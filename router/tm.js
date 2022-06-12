/*
 * 绘本分类标签管理模块
 * 面向管理员的接口
 * 功能：获取单个标签信息，获取所有标签信息，添加标签信息，更新标签信息，删除标签信息
 *
 */

const express = require("express");
const path = require("path");
const router = express.Router();

//导入个人中心处理模块
const tmHandler = require(path.join(
  __dirname,
  "..",
  "/router_handler/tm_handler"
));

//导入全局的CheckSchema
const myCheckShema = require(path.join(__dirname, "..", "/store/check_shema"));

//添加单个标签信息
router.post("/add", tmHandler.addTag);
//修改单个标签信息
router.post("/:tagid/update", tmHandler.updateTagInfo);
//获取单个标签信息
router.get("/:tagid/get", tmHandler.getTagInfo);
//删除单个标签信息
router.get("/:tagid/delete", tmHandler.deleteTag);
//获取所有标签信息
router.get("/getAll", tmHandler.getAllTagInfo);

module.exports = router;
