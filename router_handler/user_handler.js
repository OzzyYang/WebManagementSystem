const database = require("../database/index");
//用于加密用户密码的中间件
const bcrypt = require("bcryptjs");
//引入全局共享的变量和方法
const config = require("../store/config");
//配置Token的中间件
const jwt = require("jsonwebtoken");
//用于验证用户信息的中间件
const { validationResult } = require("express-validator");

//添加新的用户
exports.addUser = (req, res) => {
  //获取用户信息
  var userinfo = req.body;
  const logInfo = `add user [${userinfo.username}]`;

  //验证用户信息是否为合法的格式
  const checkErrors = validationResult(req);
  if (checkErrors.array().length > 0) {
    return res.cc(checkErrors.array(true)[0].msg, logInfo);
  }

  const sqlSel = "select * from wms_user where username=?";
  database.query(sqlSel, [userinfo.username], (err, results) => {
    //执行语句失败
    if (err) {
      return res.cc(err);
    }
    //用户名被占用
    if (results.length > 0) {
      return res.cc("用户名被占用，请选择其它用户名", logInfo);
    }

    //调用bcrypt.hashSync()对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    //插入新用户
    const sqlIns = "insert into wms_user set ?";
    database.query(sqlIns, userinfo, (err, results) => {
      if (err) {
        return res.cc(err, logInfo);
      }
      if (results.affectedRows !== 1) {
        return res.cc("用户注册失败，请稍后再试", logInfo);
      }
      return res.cc("注册成功", logInfo, 1);
    });
  });
};

//用户进行登陆
exports.userLogin = (req, res) => {
  //获取用户信息
  const userinfo = req.body;
  const logInfo = `user login [${userinfo.username}]`;

  //验证用户信息是否为合法的格式
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.cc(errors.array(true)[0].msg, logInfo);
  }

  const sqlSel = "select * from wms_user where username=?";
  database.query(sqlSel, [userinfo.username], (err, results) => {
    //执行语句失败
    if (err) {
      return res.cc(err, logInfo);
    }
    //查询到的数据不为1，则登陆失败
    if (results.length !== 1) {
      return res.cc("登陆失败，用户未找到", logInfo);
    }

    //判断用户输入密码是否正确
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("登陆失败", logInfo);
    }

    //清洗用户信息并生成Token
    const userInfo = { ...results[0], password: "", user_pic: "" };
    const tokenStr = jwt.sign(userInfo, config.jwtSecretKey, {
      expiresIn: config.tokenDuration
    });
    return res.cc("登陆成功", logInfo, 1, {
      token: tokenStr
    });
  });
};
