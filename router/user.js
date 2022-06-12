/*
 * 用户模块
 * 功能：注册用户，用户登陆
 *
 */

const path = require("path");

const express = require("express");
//创建路由对象
const router = express.Router();
//导入用户路由处理模块
const userHandler = require(path.join(
  __dirname,
  "..",
  "/router_handler/user_handler.js"
));
//导入全局的CheckShema
const userCheckSchema = require(path.join(
  __dirname,
  "..",
  "/store/check_shema"
));

//注册新用户
router.post("/add", userCheckSchema.checkUserInfo, userHandler.addUser);

//登陆
router.post("/login", userCheckSchema.checkUserInfo, userHandler.userLogin);

module.exports = router;
