import * as vscode from "vscode";
import { getTemplate } from "../views/browser";
// eslint-disable-next-line @typescript-eslint/naming-convention
import { bindWebviewEvents } from "./events/bindWebviewEvents";
import { WebviewViewProvider } from "./crteateWebview/treeContainer/webviewViewProvider";
import { WebviewPanelGenerator } from "./crteateWebview/webViewPanel/ webviewPanelGenerator";

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
