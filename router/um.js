/*
 * 用户管理模块
 * 此模块仅面向拥有管理员权限的用户开放
 * 功能：添加用户（包含权限信息），获取所有用户信息，更新用户信息、删除用户
 *
 */

const express = require("express");
const path = require("path");
const router = express.Router();
const database = require(path.join(__dirname, "..", "/database/index"));

//导入用户管理模块
const umHandler = require(path.join(
  __dirname,
  "..",
  "/router_handler/um_handler"
));

//导入全局的CheckSchema
const myCheckShema = require(path.join(__dirname, "..", "/store/check_shema"));

router.use((req, res, next) => {
  if (!req.auth) {
    return res.cc("用户鉴权失败，用户失效或者未知用户");
  }

  const sqlIns = "select level from user_info where id = ? ";
  database.query(sqlIns, req.auth.id, (err, results, fields) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 0) {
      return res.cc("用户不存在 - " + req.auth.username);
    }

    if (results[0].level !== "1") {
      return res.cc("用户不具备管理员权限 - " + req.auth.username);
    }
    next();
  });
});

//获取所有用户信息
router.get("/getAll", umHandler.getAllUserInfo);
//更改单个用户信息
router.post("/add", umHandler.addUserByManager);
//获取单个用户信息
router.get("/:userid/get", umHandler.getUserInfo);
//更改单个用户信息
router.post("/:userid/update", umHandler.updateUserInfo);
//更改单个用户
router.get("/:userid/delete", umHandler.deleteUser);
//更改单个用户
router.post("/:userid/reset", umHandler.resetPSDByManager);

module.exports = router;
