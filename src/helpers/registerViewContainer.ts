import * as vscode from "vscode";
import { getTemplate } from "../views/browser";
// eslint-disable-next-line @typescript-eslint/naming-convention
import CONST_WEBVIEW from "../data/webview";
import { WebviewViewProvider } from "./crteateWebview/WebviewViewProvider";

export function treeContainer(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "menu",
      new WebviewViewProvider(
        getTemplate(context.extensionPath, "/src/views/pages/menu.html"),
        context
      )
    )
  );
}
