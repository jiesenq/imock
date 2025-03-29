// src/extension.ts
import * as vscode from "vscode";
import { MockServer } from "./MockServer";
import WebviewViewProvider from "./view/WebviewViewProvider";
import { EmptyTreeDataProvider } from "./EmptyTreeDataProvider";

let mockServerInstance: MockServer | null = null;
// 从配置中获取监听端口，默认值为 3000
let listenPort = vscode.workspace
  .getConfiguration("imock")
  .get("listenPort", 3000);

// 插件激活时调用
export async function activate(context: vscode.ExtensionContext) {
  // 初始化 mockSwichButton
  openStaus(context);

  // registerCommand
  registerCommand(context);
  // 创建 register WebView
  registerWebView(context);
}

// 插件停用时代码清理
export function deactivate() {
  mockServerInstance?.stop();
}
function openStaus(context: vscode.ExtensionContext) {
  let mockSwichButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  // mockSwichButton.show();
  // context.subscriptions.push(mockSwichButton);
}

function registerCommand(context: vscode.ExtensionContext) {
  mockServerInstance = new MockServer(listenPort, context);
  try {
    mockServerInstance?.updateButtonText(false);
  } catch (error) {
    console.log("error:", error);
  }
  context.subscriptions.push(
    vscode.commands.registerCommand("imock.startMockServer", () => {
      mockServerInstance?.start();
    }),
    vscode.commands.registerCommand("imock.stopMockServer", () => {
      mockServerInstance?.stop();
    })
  );
}

function registerWebView(context: vscode.ExtensionContext) {
  // 创建 WebView 管理器实例并创建 WebView
  // const webViewManager = new WebViewManager();
  // webViewManager.createWebView();
  const provider = new WebviewViewProvider(context.extensionUri);
  const provider2 = new WebviewViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("mock-view", provider),
    vscode.window.registerWebviewViewProvider("intercept-view", provider2)
  );
}
