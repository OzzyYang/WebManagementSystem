const path = require("path");

const database = require(path.join(__dirname, "..", "/database/index"));
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

/**
 * 获取用户除了密码之外的基本信息
 * 包括ID、用户名、手机号码、邮箱、昵称、性别、年龄、权限等级
 * 登陆状态、创建时间、最近登录时间、用户头像
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @returns 执行信息
 */
exports.getUserInfo = (req, res) => {
  if (!req.auth) {
    return res.cc("用户鉴权失败", "用户鉴权失败，用户失效或者未知用户");
  }
  const logInfo = `get userinfo [${req.auth.username}]`;
  const userInfo = req.auth;

  //修改用户的最近登陆时间以及登陆状态
  const sqlUpdate = "update user_info set islogin=1,lastlogin=now() where id=?";
  database.query(sqlUpdate, userInfo.id, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("未找到用户", logInfo);
    }
    //根据鉴权信息查询对应的用户信息
    const sqlSelect =
      "select i.*,a.avatar from user_info i inner join user_avatar a on i.id=a.userid where id=?";
    database.query(sqlSelect, userInfo.id, (err, results) => {
      if (err) {
        return res.cc(err, logInfo);
      }
      if (results.length !== 1) {
        return res.cc("未找到用户", logInfo);
      }
      return res.cc("获取用户信息成功", logInfo, 1, results[0]);
    });
  });
};

/**
 * 更新用户信息
 * 包括手机号码、邮箱、昵称、性别、年龄
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @returns 执行信息
 */
exports.updateUserInfo = (req, res) => {
  const logInfo = `update userinfo [${req.auth.username}]`;

  if (!req.auth) {
    return res.cc("用户鉴权失败", logInfo);
  }

  const newUserInfo = req.body;

  //检查用户信息格式是否正确
  const checkErrors = validationResult(req);
  if (checkErrors.array().length > 0) {
    return res.cc(checkErrors.array(true)[0].msg, logInfo);
  }

  //更新用户信息
  const sqlUpdate =
    "update user_info set phone=?,email=?,nickname=?,gender=?,age=? where id=?";
  database.query(
    sqlUpdate,
    [
      newUserInfo.phone,
      newUserInfo.email,
      newUserInfo.nickname,
      newUserInfo.gender,
      newUserInfo.age,
      req.auth.id
    ],
    (err, results) => {
      if (err) {
        return res.cc(err, logInfo);
      }
      if (results.affectedRows === 0) {
        return res.cc("更新用户信息失败，请重试", logInfo);
      }
      return res.cc("更新用户信息成功", logInfo, 1);
    }
  );
};

/**
 * 对用户的密码进行重置，前端应对用户的输入的新密码进行二次验证
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @returns 执行信息
 */
exports.resetPassWord = (req, res) => {
  const logInfo = `reset user password [${req.auth.username}]`;

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
  const sqlSel = "select * from user_psd where userid=?";
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

    //调用bcrypt.hashSync()对新密码进行加密
    const newPassword = bcrypt.hashSync(req.body.newPassword, 10);

    const sqlUpd =
      "update user_psd set password=?,password_1=?,password_2=? where userid=?";
    database.query(
      sqlUpd,
      [newPassword, results[0].password, results[0].password_1, req.auth.id],
      (err, results) => {
        if (err) {
          return res.cc(err, logInfo);
        }
        if (results.affectedRows !== 1) {
          return res.cc("重置密码失败，请重试", logInfo);
        }
        return res.cc("重置密码成功", logInfo, 1);
      }
    );
  });
};

exports.updateUserAvatar = () => {};
