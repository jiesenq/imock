import * as vscode from "vscode";
import { getTemplate } from "../../views/browser";
import { mockServerInstance } from "../registerCommand";

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
  panel.webview.html = html;
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
          mockApi.webview.html = getTemplate(
            context.extensionPath,
            "/src/views/pages/mock-api.html"
          );
          mockApi.webview.onDidReceiveMessage((message: any) => {
            switch (message.command) {
              case "submitForm":
                const { requestType, name, requestResult } = message.data;
                if (mockServerInstance) {
                  mockServerInstance.setMockResponse(
                    requestType,
                    name,
                    requestResult
                  );
                }
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
