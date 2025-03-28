// src/EmptyTreeDataProvider.ts
import * as vscode from "vscode";
// import { WebViewManager } from "./WebViewManager";
//  创建 WebView 管理器实例并创建 WebView
// const webViewManager = new WebViewManager();

export class EmptyTreeDataProvider
  implements vscode.TreeDataProvider<TreeItem>
{
  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }
  getChildren(element?: TreeItem): Thenable<TreeItem[]> {
    return Promise.resolve([]);
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label);
  }
}
