// src/extension.ts
import * as vscode from "vscode";
import { MockServer } from "./MockServer";
import { WebViewManager } from "./WebViewManager";
import { EmptyTreeDataProvider } from "./EmptyTreeDataProvider";

let mockServerInstance: MockServer | null = null;
// 从配置中获取监听端口，默认值为 3000
const listenPort = vscode.workspace
  .getConfiguration("imock")
  .get("listenPort", 3000);

// 插件激活时调用
export async function activate(context: vscode.ExtensionContext) {
  // 初始化 mockSwichButton

  // 注册树状视图数据提供者
  // const emptyTreeDataProvider = new EmptyTreeDataProvider();
  // const view = await vscode.window.createTreeView("imock-full-view", {
  //   treeDataProvider: emptyTreeDataProvider,
  //   showCollapseAll: true,
  // });
  // context.subscriptions.push(view);

  // 注册 imock.showTreeView 命令，在命令的实现中调用
  // const showTreeViewDisposable = vscode.commands.registerCommand(
  //   "imock.showTreeView",
  //   async () => {
  //     await vscode.commands.executeCommand(
  //       "workbench.view.extension.imock-full-view"
  //     );
  //   }
  // );
  // context.subscriptions.push(showTreeViewDisposable);

  mockServerInstance = new MockServer(listenPort, context);
  mockServerInstance.showMockSwich();
  // startDisposable
  context.subscriptions.push(
    vscode.commands.registerCommand("imock.startMockServer", () => {
      mockServerInstance?.start();
    }),
    vscode.commands.registerCommand("imock.stopMockServer", () => {
      mockServerInstance?.stop();
    })
  );

  mockServerInstance?.updateButtonText(false);

  // 创建 WebView 管理器实例并创建 WebView
  // const webViewManager = new WebViewManager(context);
  // webViewManager.createWebView();
}

// 插件停用时代码清理
export function deactivate() {
  mockServerInstance?.stop();
}
