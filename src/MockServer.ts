// IMock/src/MockServer.ts
import * as vscode from "vscode";
import * as http from "http";

export class MockServer {
  private server: http.Server | null = null;
  private listenPort: number;
  mockSwichButton: vscode.StatusBarItem;

  constructor(listenPort: number, mockSwichButton: vscode.StatusBarItem) {
    this.listenPort = listenPort;
    this.mockSwichButton = mockSwichButton;
  }

  // 开启 mock 服务
  start() {
    if (this.server) {
      vscode.window.showInformationMessage("Mock 服务已开启");
      return;
    }

    this.server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      const mockData = { message: "这是一个 mock 数据" };
      res.end(JSON.stringify(mockData));
    });

    this.server.listen(this.listenPort, () => {
      vscode.window.showInformationMessage(
        `Mock 服务已开启，监听端口: ${this.listenPort}`
      );
      this.updateButtonText(true);
    });
  }

  // 关闭 mock 服务
  stop() {
    if (this.server) {
      this.server.close(() => {
        vscode.window.showInformationMessage("Mock 服务已关闭");
        this.server = null;
        this.updateButtonText(false);
      });
    } else {
      vscode.window.showInformationMessage("Mock 服务未开启");
    }
  }

  // 更新按钮文本
  updateButtonText(isRunning: boolean) {
    if (isRunning) {
      this.mockSwichButton.text = "$(debug-stop) Mock 服务";
      this.mockSwichButton.command = "imock.stopMockServer";
    } else {
      this.mockSwichButton.text = "$(play) Mock 服务";
      this.mockSwichButton.command = "imock.startMockServer";
    }
  }
}
