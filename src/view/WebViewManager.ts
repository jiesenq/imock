// src/WebViewManager.ts
import * as vscode from "vscode";

export class WebViewManager {
  private panel: vscode.WebviewPanel | undefined;

  // constructor(private context: vscode.ExtensionContext) {}

  public createWebView() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    // 创建 WebView 面板
    this.panel = vscode.window.createWebviewPanel(
      "imockWebView", // WebView 面板的标识符
      "IMock WebView", // WebView 面板的标题
      vscode.ViewColumn.One, // WebView 面板的显示位置
      {
        enableScripts: true, // 允许在 WebView 中运行 JavaScript
      }
    );

    // 设置 WebView 的 HTML 内容
    this.panel.webview.html = this.getWebViewContent();

    // 监听面板关闭事件
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  private getWebViewContent() {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>IMock WebView</title>
            </head>
            <body>
                <h1>欢迎使用 IMock WebView</h1>
                <p>这是一个简单的 WebView 示例。</p>
            </body>
            </html>
        `;
  }
}
