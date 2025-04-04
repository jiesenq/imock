import * as vscode from "vscode";
import Data from "../../types/data";
import { readFileSync } from "fs";
import { mockServerInstance } from "../registerCommand";

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
  panel: vscode.WebviewView,
  html: string,
  context: vscode.ExtensionContext
): void {
  panel.webview.html = html;

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
