// src/extension.ts
import * as vscode from "vscode";
import * as registerCommand from "./helpers/registerCommand";
import * as registerViewContainer from "./helpers/registerViewContainer";
import { mockServerInstance } from "./helpers/registerCommand";

// 插件激活时调用
export async function activate(context: vscode.ExtensionContext) {
  // registerCommand
  registerCommand.mockServer(context);

  // 创建 register WebView
  registerViewContainer.treeContainer(context);
}
if (mockServerInstance) {
  mockServerInstance.setMockResponse("GET", "/page/getTableSearch", {
    message: "这是自定义的 mock 数据",
  });
}

// 插件停用时代码清理
export function deactivate() {
  mockServerInstance?.stop();
}
