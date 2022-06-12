/*
 * 绘本管理模块
 * 面向管理员的接口
 * 功能：获取绘本信息，更新绘本信息，添加绘本
 *
 */

const express = require("express");
const path = require("path");
const router = express.Router();

//导入个人中心处理模块
const bmHandler = require(path.join(
  __dirname,
  "..",
  "/router_handler/bm_handler"
));

//导入全局的CheckSchema
const myCheckShema = require(path.join(__dirname, "..", "/store/check_shema"));

//添加单个绘本
router.post("/add", bmHandler.addBookByManager);
//添加单个绘本
router.get("/getAll", bmHandler.getAllBookInfo);
//更新单个绘本信息
router.post("/:bookid/update", bmHandler.updateBookInfo);
//删除单个绘本
router.get("/:bookid/delete", bmHandler.deleteBook);
//获取单个绘本的所有信息
router.get("/:bookid/get", bmHandler.getBookInfo);

module.exports = router;
