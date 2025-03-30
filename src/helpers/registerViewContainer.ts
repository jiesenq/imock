import * as vscode from "vscode";
import browserWebview from "../view/browser";
import CONST_WEBVIEW from "../data/webview";
import { WebviewViewProvider } from "../view/WebviewViewProvider";

export function treeContainer(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "mock-view",
      new WebviewViewProvider(
        browserWebview,
        context,
        CONST_WEBVIEW.CONFIG.BASE.BROWSER
      )
    )
  );
}
