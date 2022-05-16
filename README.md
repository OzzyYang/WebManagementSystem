使用Node.js开发的后台管理系统，包含用户模块，用户数据使用MySQL存储。

# 依赖环境

项目处在Node.js v16.15.0环境中开发，所以建立安装此版本或者更高版本的Node.js作为运行环境，低版本运行环境可自行测试。
> 访问官网下载：https://nodejs.org/en/download/

npm的开发版本为8.5.5，若Node.js从官网下载，则npm无需格外安装。项目依赖于npm中的包和中间件，若要运行项目，使用以下命令，自行安装依赖：

```shell
npm install
```
同时项目还需要使用MySQL作为数据层，本项目使用的版本为 `8.0.29 MySQL Community Server - GPL`，MySQL的配置在`/database.index.js`中。

# 启动项目

使用命令执行项目根目录中的`app.js`，即可启动项目

```shell
node app.js
```

# 项目结构

- 根目录
  - [APIDOC.md](./APIDOC.md)：API接口文档。
  - [app.js](./app.js)：项目入口。
- [database](./database)：数据库模块，处理数据层的交互
  - [index.js](./database.index.js)：数据层的入口对象，可以进行访问配置
- [router](./router)：路由模块，只存放客户端的请求与处理函数之间的映射关系
  - [user.js](./router/user.js)：用户路由模块，监听注册用户和用户登陆的请求
  - [my.js](./router//my.js)：个人中心路由模块，监听获取、更新用户信息以及重置密码的请求
- [router_handler](./router_handler)：路由处理模块，存放实际的处理行为
  - [user_handler.js](./router_handler/user_handler.js)：用户路由处理模块
  - [my_handler.js](./router_handler/my_handler.js)：个人中心路由处理模块
- [store](./store)：仓库模块，存放全局共享的变量或者方法