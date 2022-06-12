const path = require("path");

const database = require(path.join(__dirname, "..", "/database/index"));
//用于加密用户密码的中间件
const bcrypt = require("bcryptjs");

/**
 * 获取所有用户信息
 * TODO:分页
 * @param {请求体} req
 * @param {响应体} res
 * @returns 执行信息
 */
exports.getAllUserInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const logInfo = `manage user by [${adminUserInfo.username}] - get all userinfo`;

  const sql =
    "SELECT i.*, a.avatar FROM user_info AS i INNER JOIN user_avatar AS a ON i.id = a.userid where status <> 3;";
  database.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    return res.cc("所有用户信息查询成功", logInfo, 1, results);
  });
};

/**
 * 获取单个用户的所有信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.getUserInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const manaUserID = req.params.userid; //被管理者用户ID
  const logInfo = `manage user by [${adminUserInfo.username}] - get userinfo [${manaUserID}]`;

  const sql =
    "SELECT i.*, a.avatar FROM user_info AS i INNER JOIN user_avatar AS a ON i.id = a.userid WHERE id=?;";
  database.query(sql, manaUserID, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    return res.cc("用户信息查询成功", logInfo, 1, results[0]);
  });
};

/**
 * 管理员添加用户，包含权限信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.addUserByManager = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var manaUserInfo = {};

  manaUserInfo.username = req.body.username ? req.body.username : null;
  manaUserInfo.phone = req.body.phone ? req.body.phone : null;
  manaUserInfo.email = req.body.email ? req.body.email : null;
  manaUserInfo.nickname = req.body.nickname ? req.body.nickname : null;
  manaUserInfo.gender = req.body.gender ? req.body.gender : null;
  manaUserInfo.age = req.body.age ? req.body.age : null;
  manaUserInfo.status = req.body.status ? req.body.status : null;
  manaUserInfo.level = req.body.level ? req.body.level : null;

  const manaUserAvatar = req.body.avatar;
  //调用bcrypt.hashSync()对密码进行加密
  const manaUserPSD = bcrypt.hashSync(req.body.password, 10);

  const logInfo = `manage user by [${adminUserInfo.username}] - add user [${manaUserInfo.username}]`;

  const sql =
    "insert into user_info set ?;insert into user_avatar set userid=(select id from user_info where username=?),avatar=?;insert into user_psd set userid=(select id from user_info where username=?),password=?;";

  database.getConnection((err, connection) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    connection.beginTransaction((err) => {
      if (err) return res.cc(err, logInfo);
      connection.query(
        sql,
        [
          manaUserInfo,
          manaUserInfo.username,
          manaUserAvatar,
          manaUserInfo.username,
          manaUserPSD
        ],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.cc(err, logInfo);
            });
          }
          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.cc("添加用户失败", logInfo);
            });
          }
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.cc(err, logInfo);
              });
            }
            return res.cc("添加用户成功", logInfo, 1);
          });
        }
      );
    });
  });
};

/**
 * 管理员更新用户信息，包含权限信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.updateUserInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var manaUserInfo = { id: req.params.userid };
  for (const key in req.body) {
    //Object.hasOwnProperty.call()方法的作用与Object.hasOwnProperty(prop)相同，用于检测对象自身属性中是否具有指定的属性
    //如果键对应的值为空或者null或者undefined，则将其值设为null，保证入库值的统一性
    if (Object.hasOwnProperty.call(req.body, key) && req.body[key]) {
      manaUserInfo[key] = req.body[key];
    } else {
      manaUserInfo[key] = null;
    }
  }

  const logInfo = `manage user by [${adminUserInfo.username}] - update userinfo [id:${manaUserInfo.id}]`;

  const sql =
    "update user_info set username=?,phone=?,email=?,nickname=?,age=?,gender=?,islogin=?,status=?,level=? where id=?;update user_avatar set avatar=? where userid=?; ";
  database.getConnection((err, connection) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    connection.beginTransaction((err) => {
      if (err) return res.cc(err, logInfo);
      connection.query(
        sql,
        [
          manaUserInfo.username,
          manaUserInfo.phone,
          manaUserInfo.email,
          manaUserInfo.nickname,
          manaUserInfo.age,
          manaUserInfo.gender,
          manaUserInfo.islogin,
          manaUserInfo.status,
          manaUserInfo.level,
          manaUserInfo.id,
          manaUserInfo.avatar,
          manaUserInfo.id
        ],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.cc(err, logInfo);
            });
          }
          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.cc("用户信息更新失败", logInfo);
            });
          }
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.cc(err, logInfo);
              });
            }
            return res.cc("用户信息更新成功", logInfo, 1);
          });
        }
      );
    });
  });
};

exports.deleteUser = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var manaUserID = req.params.userid;

  const logInfo = `manage user by [${adminUserInfo.username}] - delete user [id:${manaUserID}]`;

  const sql = "update user_info set status=3 where id=?; ";
  database.query(sql, manaUserID, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("删除用户失败", logInfo);
    }
    return res.cc("删除用户成功", logInfo, 1);
  });
};

exports.resetPSDByManager = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var manaUserID = req.params.userid;
  //调用bcrypt.hashSync()对密码进行加密
  const manaUserNewPSD = bcrypt.hashSync(req.body.newPassword, 10);

  const logInfo = `manage user by [${adminUserInfo.username}] - reset user password [id:${manaUserID}]`;

  const sqlSel = "select * from user_psd where userid=?; ";
  database.query(sqlSel, manaUserID, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.length === 0) {
      return res.cc("查找用户失败", logInfo);
    }
    const sqlUpt =
      "update user_psd set password=?,password_1=?,password_2=? where userid=?; ";
    database.query(
      sqlUpt,
      [manaUserNewPSD, results[0].password, results[0].password_1, manaUserID],
      (err, results) => {
        if (err) {
          return res.cc(err, logInfo);
        }
        if (results.affectedRows === 0) {
          return res.cc("用户密码重置失败", logInfo);
        }
        return res.cc("用户密码重置成功", logInfo, 1);
      }
    );
  });
};
