// src/extension.ts
import * as vscode from "vscode";
import { MockServer } from "./MockServer";
import { WebViewManager } from "./WebViewManager";
import { EmptyTreeDataProvider } from "./EmptyTreeDataProvider";

let mockServerInstance: MockServer | null = null;
let mockSwichButton: vscode.StatusBarItem;
let imockFullView;
let imockPanelView;
// 从配置中获取监听端口，默认值为 3000
const listenPort = vscode.workspace
  .getConfiguration("imock")
  .get("listenPort", 3000);

// 插件激活时调用
export async function activate(context: vscode.ExtensionContext) {
  // 初始化 mockSwichButton
  mockSwichButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  mockSwichButton.show();
  context.subscriptions.push(mockSwichButton);

  // 注册树状视图数据提供者
  try {
    // const emptyTreeDataProvider = new EmptyTreeDataProvider();
    // await vscode.window.registerTreeDataProvider(
    //   "imock-full-view",
    //   emptyTreeDataProvider
    // );
    // 注册 imock.showTreeView 命令，在命令的实现中调用
    const showTreeViewDisposable = vscode.commands.registerCommand(
      "imock.showTreeView",
      async () => {
        await vscode.commands.executeCommand(
          "workbench.view.extension.imock-full-view"
        );
      }
    );
    context.subscriptions.push(showTreeViewDisposable);
  } catch (error) {
    vscode.window.showErrorMessage(`树状视图数 注册时出错11111: ${error}`);
  }
  try {
    mockServerInstance = new MockServer(listenPort, mockSwichButton);
    const startDisposable = vscode.commands.registerCommand(
      "imock.startMockServer",
      () => {
        mockServerInstance?.start();
      }
    );
    const stopDisposable = vscode.commands.registerCommand(
      "imock.stopMockServer",
      () => {
        mockServerInstance?.stop();
      }
    );

    mockServerInstance?.updateButtonText(false);

    context.subscriptions.push(
      startDisposable,
      stopDisposable,
      mockSwichButton
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Mock 服务时出错: ${error}`);
  }
  // 创建 WebView 管理器实例并创建 WebView
  // const webViewManager = new WebViewManager(context);
  // webViewManager.createWebView();
}

// 插件停用时代码清理
export function deactivate() {
  try {
    mockServerInstance?.stop();
  } catch (error) {
    vscode.window.showErrorMessage(`停用插件时停止 Mock 服务出错: ${error}`);
  }
}
