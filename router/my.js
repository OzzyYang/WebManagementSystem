const express = require("express");
const path = require("path");
const router = express.Router();

//导入个人中心处理模块
const myHandler = require(path.join(
  __dirname,
  "..",
  "/router_handler/my_handler"
));
//导入全局的CheckSchema
const myCheckShema = require(path.join(__dirname, "..", "/store/check_shema"));

//获取用户信息
router.get("/get", myHandler.getUserInfo);

//更新用户信息
router.post("/update", myCheckShema.updateUserInfo, myHandler.updateUserInfo);

//重置密码
router.post("/reset", myCheckShema.CheckPassword, myHandler.resetPassWord);

module.exports = router;
