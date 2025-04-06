# IMock - 接口模拟工具

## 🌟 核心特性

### 🚀 请求模拟

- 支持 `GET`/`POST`/`PUT`/`DELETE` 等 HTTP 方法
- 自定义响应状态码（200/401/500 等）
- 模拟请求头/响应头设置

## 🛠 快速开始

### 1. 首先在前端项目中设置代理

- 代理地址和端口目前在插件中是固定的，后期版本会开放灵活配置
- `"http://localhost:3000"` 例如 vue 项目，在 vue.config.js

```javascript
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
```

### 2. 开启 Mock 服务

- 打开插件后会发现有两个按钮， 点击配置 mock 按钮进行配置 mock 数据；
- 开启服务
  - 配置好 Mock 数据后，需要打开服务，才能正常的调用 Mock 接口
  - 开启服务按钮与插件底部状态栏中的开启/关闭服务是同步的，根据自己的喜好点哪里都可以；

### 3 配置 Mock 数据

- 总共有三个输入项（接口名，请求类型，响应接口）；
- 接口名
  - 不需要服务器地址 和 端口 以及问号后面的 参数
    - `http://localhost:3000/page/getList?abc=666` // 只需要输入 /page/getList
- 请求类型
  下拉自行选择
- 请求结果
  - 请输入 json 格式的字符串，否则会提示格式错误
  - 返回的是 json 对象

### 最后

- 这个是提交的第一个版本，请大家多提意见
- 后续会添加新的菜单，将支持新功能

## 注意

- 本插件用的 view 层用的是 CDN，
- 如果您的开发环境无法联网，插件将无法使用
- 这个问题将在下个版本中得到解决
