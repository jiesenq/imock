import * as vscode from "vscode";
import CONST_CONFIGS from "../data/configs";
import CONST_WEBVIEW from "../data/webview";
import Data, { FavouriteData } from "../types/data";
// import { WebviewContext } from "../../types/";
interface WebviewContext {
  extensionPath: string;
  webviewUri: string;
}

interface WebviewMessage {
  type: string;
  value?: any;
}
let activePanels: Array<vscode.WebviewPanel> = [];

export function bindWebviewEvents(
  panel: any,
  template: Function,
  context: vscode.ExtensionContext,
  data: Data
): void {
  // let configs = vscode.workspace.getConfiguration("imock");
  panel.webview.html = getWebViewContent(
    panel.webview,
    template,
    context.extensionUri,
    context.extensionPath,
    data
  );
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
  data: Data
) {
  // Create uri for webview
  const webviewUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "/")
  ) as unknown as string;

  return (
    template({
      webviewUri: webviewUri,
      extensionPath: extensionPath + "/",
    } as WebviewContext),
    data
  );
}
