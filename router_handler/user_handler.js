const path = require("path");

const database = require(path.join(__dirname, "..", "/database/index"));
//用于加密用户密码的中间件
const bcrypt = require("bcryptjs");
//引入全局共享的变量和方法
const config = require(path.join(__dirname, "..", "/store/config"));
//配置Token的中间件
const jwt = require("jsonwebtoken");
//用于验证用户信息的中间件
const { validationResult } = require("express-validator");

/**
 * 新用户进行注册，需用使用唯一的用户名以及密码，前端应对用户注册使用的密码进行二次验证
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @returns 执行信息
 */
exports.addUser = (req, res) => {
  //获取新用户信息
  var userinfo = req.body;
  const logInfo = `add user [${userinfo.username}]`;

  //验证新用户信息是否为合法的格式
  const checkErrors = validationResult(req);
  if (checkErrors.array().length > 0) {
    return res.cc(checkErrors.array(true)[0].msg, logInfo);
  }

  const sqlSel = "select id from user_info where username=?;";
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
    var sqlIns =
      "insert into user_info (username) values(?);insert into user_psd (userid,password) values((select id from user_info where username=?),?);insert into user_avatar (userid) values((select id from user_info where username=?));";
    database.getConnection((err, connection) => {
      if (err) return res.cc(err, logInfo);
      connection.beginTransaction((err) => {
        if (err) return res.cc(err, logInfo);
        connection.query(
          sqlIns,
          [
            userinfo.username,
            userinfo.username,
            userinfo.password,
            userinfo.username
          ],
          (err, results) => {
            if (err) {
              return connection.rollback(() => {
                res.cc(err, logInfo);
              });
            }
            if (results.affectedRows === 0) {
              return connection.rollback(() => {
                res.cc("用户注册失败，请稍后再试", logInfo);
              });
            }
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  res.cc(err, logInfo);
                });
              }
              return res.cc("注册成功", logInfo, 1);
            });
          }
        );
      });
    });
  });
};

//用户进行登陆
exports.userLogin = (req, res) => {
  //获取用户信息
  const userInfo = req.body;
  const logInfo = `user login [${userInfo.username}]`;

  //验证用户信息是否为合法的格式
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.cc(errors.array(true)[0].msg, logInfo);
  }

  const sqlSel =
    "select i.id,i.username,p.password from user_info as i left outer join user_psd as p on i.id=p.userid where username=?";
  database.query(sqlSel, [userInfo.username], (err, results) => {
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
      userInfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("登陆失败，密码错误", logInfo);
    }

    //清洗用户信息并生成Token
    const userInfoPured = { ...results[0], password: "" };
    const tokenStr = jwt.sign(userInfoPured, config.jwtSecretKey, {
      expiresIn: config.tokenDuration
    });
    return res.cc("登陆成功", logInfo, 1, {
      token: tokenStr
    });
  });
};
