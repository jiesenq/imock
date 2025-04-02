import * as vscode from "vscode";
import Data from "../types/data";
import { mockServerInstance } from "./registerCommand";
interface WebviewContext {
  extensionPath: string;
  webviewUri: string;
}

interface WebviewMessage {
  type: string;
  value?: any;
}

export function bindWebviewEvents(
  panel: any,
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
    vscode.window.showInformationMessage(`message：`, JSON.stringify(message)); // 确保能正确显示消息内容
    switch (message.command) {
      case "submitForm":
        const { requestType, name, requestResult } = message.data;
        const key = `${requestType} ${name}`;
        if (mockServerInstance) {
          mockServerInstance.setMockResponse(requestType, name, requestResult);
        }
        break;
    }
  }, undefined);
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
