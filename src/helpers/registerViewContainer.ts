import * as vscode from "vscode";
import { mockViewTemplate } from "../view/browser";
// eslint-disable-next-line @typescript-eslint/naming-convention
import CONST_WEBVIEW from "../data/webview";
import { WebviewViewProvider } from "../view/WebviewViewProvider";

export function treeContainer(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "mock-view",
      new WebviewViewProvider(
        mockViewTemplate,
        context,
        CONST_WEBVIEW.CONFIG.BASE.BROWSER
      )
    )
  );
}
