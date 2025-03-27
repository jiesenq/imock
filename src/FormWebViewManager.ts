// src/FormWebViewManager.ts
import * as vscode from "vscode";

export class FormWebViewManager {
  private panel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  public createFormWebView() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    // 创建 WebView 面板
    this.panel = vscode.window.createWebviewPanel(
      "imockFormWebView", // WebView 面板的标识符
      "IMock 实例表单", // WebView 面板的标题
      vscode.ViewColumn.One, // WebView 面板的显示位置
      {
        enableScripts: true, // 允许在 WebView 中运行 JavaScript
      }
    );

    // 设置 WebView 的 HTML 内容
    this.panel.webview.html = this.getFormWebViewContent();

    // 监听面板关闭事件
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  private getFormWebViewContent() {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>IMock 实例表单</title>
            </head>
            <body>
                <h1>IMock 实例表单</h1>
                <form>
                    <label for="name">名称:</label>
                    <input type="text" id="name" name="name"><br><br>
                    <label for="description">描述:</label>
                    <textarea id="description" name="description"></textarea><br><br>
                    <input type="submit" value="提交">
                </form>
            </body>
            </html>
        `;
  }
}
