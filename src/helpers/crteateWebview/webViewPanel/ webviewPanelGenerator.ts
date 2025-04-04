// imock/src/helpers/createWebview/webViewPanel/webviewPanelGenerator.ts
import * as vscode from "vscode";

export class WebviewPanelGenerator {
  //   private context: vscode.ExtensionContext;
  panel?: vscode.WebviewPanel;

  constructor(id: string, title: string, ViewColumn: any, option: {}) {
    this.panel = vscode.window.createWebviewPanel(
      id,
      title,
      ViewColumn,
      option
    );
  }
}
