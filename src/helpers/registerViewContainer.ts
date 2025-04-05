import * as vscode from "vscode";
import { getTemplate } from "../views/browser";
import { WebviewViewProvider } from "./crteateWebview/treeContainer/webviewViewProvider";

export function webView(context: vscode.ExtensionContext) {
  // 渲染treeView
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "menu",
      new WebviewViewProvider(
        getTemplate(context.extensionPath, "/src/views/pages/menu.html"),
        context
      )
    ),
    vscode.window.registerWebviewViewProvider(
      "intercept-view",
      new WebviewViewProvider(
        getTemplate(context.extensionPath, "/src/views/pages/server.html"),
        context
      )
    )
  );
}
