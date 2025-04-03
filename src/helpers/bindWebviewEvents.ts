import * as vscode from "vscode";
import Data from "../types/data";
import { mockServerInstance } from "./registerCommand";
import { mockViewTemplate } from "../views/browser";

interface WebviewContext {
  extensionPath: string;
  webviewUri: string;
}

interface WebviewMessage {
  type: string;
  value?: any;
}

let currentPanel: vscode.WebviewPanel | undefined;

export function bindWebviewEvents(
  panel: vscode.WebviewPanel,
  template: Function,
  context: vscode.ExtensionContext,
  data?: Data
): void {
  panel.webview.html = getWebViewContent(
    panel.webview,
    template,
    context.extensionUri,
    context.extensionPath,
    data
  );

  panel.webview.onDidReceiveMessage((message: any) => {
    vscode.window.showInformationMessage(`message：`, JSON.stringify(message));
    switch (message.command) {
      case "submitForm":
        const { requestType, name, requestResult } = message.data;
        const key = `${requestType} ${name}`;
        if (mockServerInstance) {
          mockServerInstance.setMockResponse(requestType, name, requestResult);
        }
        break;
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
          const newPanel = vscode.window.createWebviewPanel(
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

          const newTemplate = () => {
            const htmlUri = vscode.Uri.joinPath(
              vscode.Uri.file(context.extensionPath),
              "src",
              "views",
              "pages",
              page
            );
            return vscode.workspace.fs.readFile(htmlUri).then((buffer) => {
              return buffer.toString();
            });
          };

          newTemplate().then((html) => {
            newPanel.webview.html = html;
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

/**
 * Get webview context
 *
 * @param webview
 * @param extensionUri
 * @param extensionPath
 * @param data
 * @returns
 */
export function getWebViewContent(
  webview: vscode.Webview,
  template: Function,
  extensionUri: vscode.Uri,
  extensionPath: string,
  data?: Data
) {
  // Create uri for webview
  const webviewUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "/")
  ) as unknown as string;
  let html = template({
    webviewUri: webviewUri,
    extensionPath: extensionPath + "/",
  });
  return html;
}
