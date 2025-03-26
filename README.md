


src/extension.ts：
startMockServer 函数：创建一个简单的 HTTP 服务器，监听 3000 端口，当有请求到来时返回一个 mock 数据。
stopMockServer 函数：关闭正在运行的 HTTP 服务器。
activate 函数：注册开启和关闭 mock 服务的命令。
deactivate 函数：在插件停用的时候关闭服务器。
package.json：
activationEvents：定义插件的激活事件，当用户执行开启或关闭命令时激活插件。
contributes：定义插件的命令，包含命令的 ID 和标题。

## 新建一个功能分之，并且切入
`git checkout -b new-feature`
