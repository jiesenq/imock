import * as vscode from "vscode";

export class MockTreeDataProvider implements vscode.TreeDataProvider<MockItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    MockItem | undefined | null | void
  > = new vscode.EventEmitter<MockItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    MockItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  getTreeItem(element: MockItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MockItem): Thenable<MockItem[]> {
    if (!element) {
      // 返回根节点的子节点
      return Promise.resolve([
        new MockItem("Mock Data 1", vscode.TreeItemCollapsibleState.Collapsed),
        new MockItem("Mock Data 2", vscode.TreeItemCollapsibleState.Collapsed),
      ]);
    }
    // 返回子节点的子节点（如果有）
    return Promise.resolve([
      new MockItem("Sub Mock Data 1", vscode.TreeItemCollapsibleState.None),
      new MockItem("Sub Mock Data 2", vscode.TreeItemCollapsibleState.None),
    ]);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class MockItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}