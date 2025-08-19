// imock/src/helpers/crteateWebview/treeContainer/webviewViewProvider.ts
import {
  CancellationToken,
  ExtensionContext,
  WebviewView,
  WebviewViewResolveContext,
  Uri,
} from "vscode";
import * as vscode from "vscode";

import { bindWebviewEvents } from "../../events/bindWebviewEvents";

class WebviewViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  constructor(
    private readonly template: string,
    private readonly context: ExtensionContext // private readonly data: Data // private readonly _extensionUri: vscode.Uri
  ) {}

  // Resolves and sets up the Webview
  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ): void {
    this._view = webviewView;
      // Configure Webview options
    webviewView.webview.options = {
      enableScripts: true,
      // 允许访问 node_modules 目录
      localResourceRoots: [
        Uri.joinPath(this.context.extensionUri, "node_modules")
      ]
    };

    // 1. 生成 node_modules 中资源的 Webview 可访问路径
    const vueUri = webviewView.webview.asWebviewUri(
      Uri.joinPath(this.context.extensionUri, "node_modules", "vue", "dist", "vue.global.prod.js")
    );
    const elementPlusCssUri = webviewView.webview.asWebviewUri(
      Uri.joinPath(this.context.extensionUri, "node_modules", "element-plus", "dist", "index.css")
    );
    const elementPlusJsUri = webviewView.webview.asWebviewUri(
      Uri.joinPath(this.context.extensionUri, "node_modules", "element-plus", "dist", "index.full.min.js")
    );

    // 2. 替换 HTML 模板中的占位符
    const html = this.template
      .replace("${vueUri}", vueUri.toString())
      .replace("${elementPlusCssUri}", elementPlusCssUri.toString())
      .replace("${elementPlusJsUri}", elementPlusJsUri.toString());

    // 3. 绑定事件并设置 HTML
    bindWebviewEvents(webviewView, html, this.context);
  }
}

export { WebviewViewProvider };
