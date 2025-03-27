// src/EmptyTreeDataProvider.ts
import * as vscode from "vscode";
// import { WebViewManager } from "./WebViewManager";
//  创建 WebView 管理器实例并创建 WebView
// const webViewManager = new WebViewManager();

export class EmptyTreeDataProvider implements vscode.TreeDataProvider<null> {
  getTreeItem(element: null): vscode.TreeItem {
    return new vscode.TreeItem(
      "空树状视图",
      vscode.TreeItemCollapsibleState.None
    );
  }

  // createWebView() {
  //   return webViewManager.createWebView();
  // }

  getChildren(element?: null): Thenable<null[]> {
    return Promise.resolve([]);
  }
}
