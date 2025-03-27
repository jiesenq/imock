// src/extension.ts
import * as vscode from "vscode";
import { MockServer } from "./MockServer";
import { MockTreeDataProvider } from "./MockTreeDataProvider";

let mockServerInstance: MockServer | null = null;
let startStopButton: vscode.StatusBarItem;
// 从配置中获取监听端口，默认值为 3000
const listenPort = vscode.workspace
  .getConfiguration("imock")
  .get("listenPort", 3000);

// 插件激活时调用
export function activate(context: vscode.ExtensionContext) {
  // 注册树状视图数据提供者
  try {
    const treeDataProvider = new MockTreeDataProvider();
    vscode.window.registerTreeDataProvider("imock-full-view", treeDataProvider);
    console.log("imock-full-view 视图已注册");
  } catch (error) {
    console.error("注册 imock-full-view 视图时出错:", error);
  }
  // 初始化 startStopButton
  startStopButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  startStopButton.show();

  mockServerInstance = new MockServer(listenPort, startStopButton);

  const startDisposable = vscode.commands.registerCommand(
    "imock.startMockServer",
    () => {
      try {
        mockServerInstance?.start();
      } catch (error) {
        vscode.window.showErrorMessage(`启动 Mock 服务时出错: ${error}`);
      }
    }
  );
  const stopDisposable = vscode.commands.registerCommand(
    "imock.stopMockServer",
    () => {
      try {
        mockServerInstance?.stop();
      } catch (error) {
        vscode.window.showErrorMessage(`停止 Mock 服务时出错: ${error}`);
      }
    }
  );

  mockServerInstance?.updateButtonText(false);
  context.subscriptions.push(startDisposable, stopDisposable, startStopButton);
}

// 插件停用时代码清理
export function deactivate() {
  try {
    mockServerInstance?.stop();
  } catch (error) {
    vscode.window.showErrorMessage(`停用插件时停止 Mock 服务出错: ${error}`);
  }
}
