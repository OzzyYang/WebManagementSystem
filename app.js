const express = require("express");
const app = express();
const config = require("./store/config");
const dayjs = require("dayjs");

//配置跨域访问的全局中间件
const cors = require("cors");
app.use(cors());

//配置解析表单数据的全局中间件
app.use(express.urlencoded({ extended: false }));

//在3007接口进行监听
app.listen(config.port, () => {
  console.log("Api Server on:" + config.port);
});

//配置解析Token的中间件
const { expressjwt: expressJwt } = require("express-jwt");

app.use(
  expressJwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/user\//]
  })
);

//全局的响应函数的中间件
app.use((req, res, next) => {
  /**
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
      logInfo,
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
const userRouter = require("./router/user.js");
app.use("/user", userRouter);

//导入个人中心路由模块
const myRouter = require("./router/my.js");
app.use("/my", myRouter);

//捕获Token认证后的错误
app.use((err, req, res, next) => {
  console.log(err.message);
  // token解析失败导致的错误
  if (err.name === "UnauthorizedError") {
    //TODO 无效的cc function
    return res.send({
      status: 1,
      msg: "无效的Token"
    });
  }
  //其它原因导致的错误
  return res.send({
    status: 1,
    msg: "Token认证失败"
  });
});
