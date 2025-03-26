import * as vscode from 'vscode';
import { MockServer } from './MockServer';
import { MockTreeDataProvider } from './MockTreeDataProvider';

let mockServerInstance: MockServer | null = null;
let startStopButton: vscode.StatusBarItem;
let listenPort = 3000;

// 插件激活时调用
export function activate(context: vscode.ExtensionContext) {
  // 初始化 startStopButton
  startStopButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  startStopButton.show();

  mockServerInstance = new MockServer(listenPort, startStopButton);

  const startDisposable = vscode.commands.registerCommand('extension.startMockServer', () => {
    mockServerInstance?.start();
  });
  const stopDisposable = vscode.commands.registerCommand('extension.stopMockServer', () => {
    mockServerInstance?.stop();
  });

  mockServerInstance?.updateButtonText(false);

  // 注册树状视图数据提供者
  const treeDataProvider = new MockTreeDataProvider();
  vscode.window.registerTreeDataProvider('imockTreeView', treeDataProvider);

  context.subscriptions.push(startDisposable, stopDisposable, startStopButton);
}

// 插件停用时代码清理
export function deactivate() {
  mockServerInstance?.stop();
}