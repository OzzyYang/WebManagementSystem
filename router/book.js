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
const bookHandler = require(path.join(
  __dirname,
  "..",
  "/router_handler/book_handler"
));

//导入全局的CheckSchema
const myCheckShema = require(path.join(__dirname, "..", "/store/check_shema"));

//获取所有绘本
router.get("/getAll", bookHandler.getAllBookInfo);

module.exports = router;
