// IMock/src/MockServer.ts
import * as vscode from "vscode";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
import rateLimit from "express-rate-limit";
import { sendMockServerStatusToWebview } from "../helpers/bindWebviewEvents";

// 模拟的请求结果
export class MockServer {
  private server: http.Server | null = null;
  private listenPort: number;
  private mockSwichButton: vscode.StatusBarItem;
  private context: vscode.ExtensionContext;
  private mockResponses: { [key: string]: any } = {};
  // 在 MockServer 类中添加一个缓存对象
  private requestCache: { [key: string]: any } = {};

  constructor(listenPort: number, context: vscode.ExtensionContext) {
    this.listenPort = listenPort;
    this.context = context;

    // 初始化 mockSwichButton 显示 mock 开关
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
      // const rateLimiter = this.createRateLimiter();
      // rateLimiter(req, res, () => {
      console.log("key:");

      this.addCorsHeaders(res);

      // 处理 OPTIONS 请求
      if (req.method === "OPTIONS") {
        this.handleOptionsRequest(res);
        return;
      }

      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const key = `${req.method} ${url.pathname}`;
      console.log("key:", key);
      console.log("mockResponses[key]:", this.mockResponses[key]);
      if (this.mockResponses[key]) {
        // 返回 Mock 数据
        this.returnMockData(res, this.mockResponses[key]);
      } else {
        // 转发请求
        // this.forwardRequest(req, res, url);
        res.end(JSON.stringify({ data: "" }));
      }
      // });
    });

    // 启动代理服务器
    this.server
      .listen(this.listenPort, () => {
        vscode.window
          .showInformationMessage(`Mock 代理服务器已启动，监听端口 ${this.listenPort} 
					请手动配置浏览器代理，使用 127.0.0.1:${this.listenPort} 作为代理服务器。
				`);
        this.updateButtonText(true);
      })
      .on("error", (err) => {
        this.handleServerError(err);
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
    this.mockSwichButton.text = isRunning
      ? "$(debug-stop)关闭服务"
      : "$(play)开启服务";
    this.mockSwichButton.command = isRunning
      ? "imock.stopMockServer"
      : "imock.startMockServer";

    // 向 webview 发送服务状态消息
    sendMockServerStatusToWebview(isRunning);
  }

  // 添加跨域头
  private addCorsHeaders(res: http.ServerResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // 处理 OPTIONS 请求
  private handleOptionsRequest(res: http.ServerResponse) {
    res.writeHead(200);
    res.end();
  }

  // 返回 Mock 数据
  private returnMockData(res: http.ServerResponse, response: any) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  }

  // 转发请求
  // 修改 forwardRequest 方法
  private forwardRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    url: URL
  ) {
    const cacheKey = `${req.method} ${url.href}`;
    if (this.requestCache[cacheKey]) {
      // 如果缓存中有数据，直接返回缓存数据
      this.returnMockData(res, this.requestCache[cacheKey]);
      return;
    }

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: req.method,
      headers: req.headers,
    };

    const protocol = url.protocol === "https:" ? https : http;
    const proxyReq = protocol.request(options, (proxyRes) => {
      this.addCorsHeaders(res);
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);

      let responseData = "";
      proxyRes.on("data", (chunk) => {
        responseData += chunk;
      });

      proxyRes.on("end", () => {
        try {
          const jsonData = JSON.parse(responseData);
          this.requestCache[cacheKey] = jsonData;
        } catch (error) {
          // 如果不是 JSON 数据，不进行缓存
        }
        res.end(responseData);
      });
    });

    proxyReq.on("error", (err) => {
      vscode.window.showErrorMessage(`转发请求时发生错误: ${err.message}`);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    });

    req.pipe(proxyReq);
  }

  // 处理服务器错误
  private handleServerError(err: NodeJS.ErrnoException) {
    if (err.code === "EADDRINUSE") {
      vscode.window.showErrorMessage(
        `端口 ${this.listenPort} 已被占用，请关闭其他占用该端口的程序后重试。`
      );
    } else {
      vscode.window.showErrorMessage(
        `启动代理服务器时发生错误: ${err.message}`
      );
    }
  }

  // 在 MockServer 类中添加限流中间件
  private createRateLimiter() {
    return rateLimit({
      windowMs: 60 * 1000, // 1 分钟
      max: 100, // 每分钟最多 100 个请求
      message: "Too many requests, please try again later.",
    });
  }
}
