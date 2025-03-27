# IMock - 接口模拟工具

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-1.0.0-green)

> 开源轻量级接口模拟解决方案，助力高效开发与测试

## 🌟 核心特性
### 🚀 请求模拟
- 支持 `GET`/`POST`/`PUT`/`DELETE` 等 HTTP 方法
- 自定义响应状态码（200/401/500 等）
- 模拟请求头/响应头设置

### 🎲 动态数据

*支持数据模板语法，包含：*
- `{{email}}` 随机邮箱
- `{{timestamp}}` 时间戳
- `{{array(5)}}` 生成数组
- `{{regex(/^1[3-9]\d{9}$/)}}` 正则匹配

### ⏱ 高级控制
- 网络延迟模拟：`delay: 1500`（单位：毫秒）
- 错误率配置：`error_rate: 0.3`（30% 失败率）
- 动态路由参数：`/user/:id/profile`

## 🛠 快速开始
### 安装步骤
## 🧰 使用场景
| 场景类型       | 示例配置                       |
|----------------|--------------------------------|
| 前端联调       | 模拟分页数据接口               |
| 压力测试       | 配置高延迟/错误率              |
| 原型验证       | 快速构建完整 API 树            |
| 单元测试       | 隔离外部依赖                   |

## 🤝 参与贡献
1. Fork 仓库
2. 创建特性分支 (`git checkout -b feat/new-feature`)
3. 提交修改 (`git commit -am 'Add some feature'`)
4. 推送分支 (`git push origin feat/new-feature`)
5. 创建 Pull Request

## 📄 开源协议
本项目采用 [MIT License](LICENSE)

> 📌 注意：此文档为技术推测版本，实际功能请查看项目最新代码