import * as vscode from "vscode";
import Data from "../types/data";
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
  let o = (panel.webview.html = getWebViewContent(
    panel.webview,
    template,
    context.extensionUri,
    context.extensionPath,
    data
  ));
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
