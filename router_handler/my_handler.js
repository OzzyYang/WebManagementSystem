const database = require("../database/index");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

//获取用户的信息，包括用户ID，用户账号，用户昵称，用户邮箱，用户头像
exports.getUserInfo = (req, res) => {
  if (!req.auth) {
    return res.cc("用户鉴权失败", "失效或者未知用户");
  }
  const logInfo = `get userinfo [${req.auth.username}]`;
  const userinfo = req.auth;

  //根据鉴权信息查询对应的用户信息
  const sqlSelect = "select * from wms_user where id=?";
  database.query(sqlSelect, [userinfo.id], (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.length !== 1) {
      return res.cc("未找到用户", logInfo);
    }
    //使密码为空
    results[0].password = undefined;
    results[0].status = undefined;
    return res.cc("获取用户信息成功", logInfo, 1, results[0]);
  });
};

//更新用户的信息，包括用户昵称，用户邮箱，用户头像
exports.updateUserInfo = (req, res) => {
  const logInfo = `update userinfo [${req.auth.username}]`;

  if (!req.auth) {
    return res.cc("用户鉴权失败", logInfo);
  }

  if (req.auth.username !== req.body.username) {
    return res.cc("用户Token与用户信息不一致", logInfo);
  }

  const newUserInfo = req.body;

  //检查用户信息格式是否正确
  const checkErrors = validationResult(req);
  if (checkErrors.array().length > 0) {
    return res.cc(checkErrors.array(true)[0].msg, logInfo);
  }

  const sqlUpdate =
    "update wms_user set nickname=?,email=?,user_pic=? where id=?";
  database.query(
    sqlUpdate,
    [
      newUserInfo.nickname,
      newUserInfo.email,
      newUserInfo.user_pic,
      req.auth.id
    ],
    (err, results) => {
      if (err) {
        return res.cc(err, logInfo);
      }
      if (results.affectedRows !== 1) {
        return res.cc("更新用户信息失败，请重试", logInfo);
      }
      return res.cc("更新用户信息成功", logInfo, 1);
    }
  );
};

//重置用户的密码
exports.resetPassWord = (req, res) => {
  const logInfo = `reset user password[${req.auth.username}]`;

  if (!req.auth) {
    return res.cc("用户鉴权失败", logInfo);
  }

  //检查用户信息格式是否正确
  const checkErrors = validationResult(req);
  if (checkErrors.array().length > 0) {
    return res.cc(checkErrors.array(true)[0].msg, logInfo);
  }

  if (req.body.oldPassword === req.body.newPassword) {
    return res.cc("新旧密码相同", logInfo);
  }

  //根据id查询用户的数据
  const sqlSel = "select * from wms_user where id=?";
  database.query(sqlSel, req.auth.id, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.length !== 1) {
      return res.cc("未找到用户，请重试", logInfo);
    }

    //检查用户输入的旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPassword,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("原密码输入错误", logInfo);
    }

    //调用bcrypt.hashSync()对密码进行加密
    const password = bcrypt.hashSync(req.body.newPassword, 10);

    const sqlUpd = "update wms_user set password=? where id=?";
    database.query(sqlUpd, [password, req.auth.id], (err, results) => {
      if (err) {
        return res.cc(err, logInfo);
      }
      if (results.affectedRows !== 1) {
        return res.cc("重置密码失败，请重试", logInfo);
      }

      return res.cc("重置密码成功", logInfo, 1);
    });
  });
};
