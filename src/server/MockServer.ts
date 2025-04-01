// IMock/src/MockServer.ts
import * as vscode from "vscode";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
// 模拟的请求结果

export class MockServer {
  private server: http.Server | null = null;
  private listenPort: number;
  private mockSwichButton: vscode.StatusBarItem;
  private context: vscode.ExtensionContext;
  private mockResponses: { [key: string]: any } = {};

  constructor(listenPort: number, context: vscode.ExtensionContext) {
    this.listenPort = listenPort;
    this.context = context;

    // 初始化 mockSwichButton 显示 mock开关
    this.mockSwichButton = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.mockSwichButton.show();
    this.context.subscriptions.push(this.mockSwichButton);
  }

  // 开启 mock 服务
  start() {
    if (this.server) {
      vscode.window.showInformationMessage("Mock 服务已开启");
      return;
    }

    // this.server = http.createServer((req, res) => {
    //   res.writeHead(200, { "Content-Type": "application/json" });
    //   const mockData = { message: "这是一个 mock 数据" };
    //   res.end(JSON.stringify(mockData));
    // });
    // this.server.listen(this.listenPort, () => {
    //   vscode.window.showInformationMessage(
    //     `Mock 服务已开启，监听端口: ${this.listenPort}`
    //   );
    //   this.updateButtonText(true);
    // });

    // // 创建代理服务器
    this.server = http.createServer((req, res) => {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const key = `${req.method} ${url.pathname}`;

      if (this.mockResponses[key]) {
        // 返回 Mock 数据
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(this.mockResponses[key]));
      } else {
        // 转发请求
        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === "https:" ? 443 : 80),
          path: url.pathname + url.search,
          method: req.method,
          headers: req.headers,
        };

        const protocol = url.protocol === "https:" ? https : http;
        const proxyReq = protocol.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res);
        });

        req.pipe(proxyReq);
      }
    });

    // 启动代理服务器
    this.server.listen(8080, () => {
      vscode.window.showInformationMessage(
        "Mock 代理服务器已启动，监听端口 8080"
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
