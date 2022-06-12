/*
 * 绘本模块
 * 面向单独的用户接口
 * 功能：
 *
 */

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

//更新用户头像
router.post(
  "/avatar/update",
  myCheckShema.checkAvatar,
  myHandler.updateUserAvatar
);

//退出登录
router.get("/logout", myHandler.userLogout);

module.exports = router;
