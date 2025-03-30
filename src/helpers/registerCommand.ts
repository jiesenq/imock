import * as vscode from "vscode";
import { MockServer } from "./MockServer";
let mockServerInstance: MockServer | null = null;
// 从配置中获取监听端口，默认值为 3000
let listenPort = vscode.workspace
  .getConfiguration("imock")
  .get("listenPort", 3000);

export function mockServer(context: vscode.ExtensionContext) {
  mockServerInstance = new MockServer(listenPort, context);
  try {
    // mockServerInstance.showMockSwich();
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
