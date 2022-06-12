const path = require("path");

const express = require("express");
const dayjs = require("dayjs");
const cors = require("cors");
const { expressjwt: expressJwt } = require("express-jwt");
//导入全局配置
const config = require(path.join(__dirname, "/store/config"));

//启动Express服务
const app = express();

//配置跨域访问的全局中间件
app.use(cors());

//配置解析表单数据的全局中间件
app.use(express.urlencoded({ extended: false }));

//在3007接口进行监听
app.listen(config.port, () => {
  console.log("Api Server on:" + config.port);
});

//配置解析Token的中间件
app.use(
  expressJwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/user\//]
  })
);

//全局的响应函数的中间件
app.use((req, res, next) => {
  /**
   * 全局的响应函数
   * @param {发送给前端的错误信息} msg
   * @param {输出在控制面板的日志信息} logInfo
   * @param {发送给前端的执行状态,0表示成功,1表示失败} status
   * @param {发送给前端的数据} data
   */
  res.cc = (msg, logInfo, status = 0, data = undefined) => {
    //如果msg是一种错误，则取值为错误信息
    msg = msg instanceof Error ? msg.message : msg;
    console.log(
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
      ":",
      logInfo ? logInfo : "",
      status === 1 ? "success" : msg
    );
    res.send({
      status,
      message: msg,
      data: data
    });
  };
  next();
});

//导入用户路由模块
const userRouter = require(path.join(__dirname, "/router/user.js"));
app.use("/user", userRouter);

//导入个人中心路由模块
const myRouter = require(path.join(__dirname, "/router/my.js"));
app.use("/my", myRouter);

//导入用户管理模块
const umRouter = require(path.join(__dirname, "/router/um"));
app.use("/manage/user", umRouter);

//导入绘本管理模块
const bmRouter = require(path.join(__dirname, "/router/bm"));
app.use("/manage/book", bmRouter);

//导入标签管理模块
const tmRouter = require(path.join(__dirname, "/router/tm"));
app.use("/manage/tag", tmRouter);

//捕获Token认证后的错误
app.use((err, req, res, next) => {
  console.log(err.message);
  // token解析失败导致的错误
  if (err.name === "UnauthorizedError") {
    //TODO 无效的cc function
    return res.send({
      status: 0,
      msg: "无效的Token"
    });
  }
  //其它原因导致的错误
  return res.send({
    status: 0,
    msg: err.message
  });
});
