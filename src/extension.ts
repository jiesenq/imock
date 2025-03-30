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

// 插件停用时代码清理
export function deactivate() {
  mockServerInstance?.stop();
}
