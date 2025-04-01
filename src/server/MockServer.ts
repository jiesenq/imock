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

  // 设置自定义响应
  setMockResponse(method: string, path: string, response: any) {
    const key = `${method} ${path}`;
    this.mockResponses[key] = response;
  }

  // 开启 mock 服务
  start() {
    if (this.server) {
      vscode.window.showInformationMessage("Mock 服务已开启");
      return;
    }

    // 创建代理服务器
    this.server = http.createServer((req, res) => {
      console.log("req     :", req);

      // 添加跨域头
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      // 处理 OPTIONS 请求
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

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
          // 添加跨域头到响应
          proxyRes.headers["Access-Control-Allow-Origin"] = "*";
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res);
        });

        req.pipe(proxyReq);
      }
    });

    // 启动代理服务器
    this.server.listen(8081, () => {
      vscode.window.showInformationMessage(
        "Mock 代理服务器已启动，监听端口 8081"
      );
      vscode.window.showInformationMessage(
        "请手动配置浏览器代理，使用 127.0.0.1:8081 作为代理服务器。"
      );
      this.updateButtonText(true);
    });
    // .on("error", (err) => {
    //   if (err.code === "EADDRINUSE") {
    //     vscode.window.showErrorMessage(
    //       "端口 8080 已被占用，请关闭其他占用该端口的程序后重试。"
    //     );
    //   } else {
    //     vscode.window.showErrorMessage(
    //       `启动代理服务器时发生错误: ${err.message}`
    //     );
    //   }
    // });
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
