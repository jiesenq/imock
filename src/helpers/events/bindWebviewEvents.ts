import * as vscode from "vscode";
import { getTemplate } from "../../views/browser";
import { mockServerInstance } from "../registerCommand";
import { json } from "node:stream/consumers";
interface WebviewContext {
  extensionPath: string;
  webviewUri: string;
}

interface WebviewMessage {
  type: string;
  value?: any;
}

let currentPanel: any;

export function bindWebviewEvents(
  panel: vscode.WebviewView,
  html: string,
  context: vscode.ExtensionContext
): void {
  currentPanel = panel;
    // 1. 生成 node_modules 中资源的 Webview 可访问路径
    const VUE_JS = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "node_modules", "vue", "dist", "vue.global.prod.js")
    );
    const ELEMENT_PLUS_CSS = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "node_modules", "element-plus", "dist", "index.css")
    );
    const ELEMENT_PLUS_JS = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "node_modules", "element-plus", "dist", "index.full.min.js")
    );

    // 2. 替换 HTML 模板中的占位符
    const new_html = html
      .replace("${VUE_JS}", VUE_JS.toString())
      .replace("${ELEMENT_PLUS_CSS}", ELEMENT_PLUS_CSS.toString())
      .replace("${ELEMENT_PLUS_JS}", ELEMENT_PLUS_JS.toString());

  panel.webview.html = new_html;
  panel.webview.onDidReceiveMessage((message: any) => {
    switch (message.command) {
      case "startMockServer":
        if (mockServerInstance) {
          mockServerInstance.start();
        }
        break;
      case "stopMockServer":
        if (mockServerInstance) {
          mockServerInstance.stop();
        }
        break;
      case "openMockApiPage":
        const { page } = message.data;
        if (page === "mock-api.html") {
          // 创建新的 webview panel 并显示在右侧
          const mockApi = vscode.window.createWebviewPanel(
            "mockApiPage",
            "Mock API 配置",
            vscode.ViewColumn.Beside, // 在右侧显示
            {
              enableScripts: true,
              localResourceRoots: [
                vscode.Uri.joinPath(
                  context.extensionUri,
                  "src",
                  "views",
                  "pages"
                ),
              ],
            }
          );
          mockApi.iconPath = vscode.Uri.joinPath(
            context.extensionUri,
            "media",
            "mock-green-icon.svg"
          );
          mockApi.webview.html = getTemplate(
            context.extensionPath,
            "/src/views/pages/mock-api.html"
          );
          mockApi.webview.onDidReceiveMessage((message: any) => {
            switch (message.command) {
              case "submitForm":
                const { requestType, name, requestResult } = message.data;
                if (mockServerInstance) {
                  let s = requestResult.replace(/\n/g, "");
                  try {
                    // 使用JSON.parse将字符串转换为JavaScript对象
                    let data = JSON.parse(s);
                    // 将JavaScript对象转换回JSON字符串
                    let result = JSON.stringify(data, null, 2);
                    mockServerInstance.setMockResponse(
                      requestType,
                      name,
                      result
                    );
                  } catch (error) {
                    console.log("字符串格式不正确，无法转换。");
                  }
                }
                break;
              default:
                break;
            }
          });
        }
        break;
    }
  });
}

/**
 * 向 webview 发送 Mock 服务状态消息
 * @param isRunning Mock 服务是否正在运行
 */
export function sendMockServerStatusToWebview(isRunning: boolean) {
  if (currentPanel) {
    currentPanel.webview.postMessage({
      command: "updateMockServerStatus",
      data: { isRunning },
    });
  }
}
