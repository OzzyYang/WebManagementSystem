const path = require("path");

const database = require(path.join(__dirname, "..", "/database/index"));

exports.getAllUserInfo = (req, res) => {
  const logInfo = `manage user by [${req.auth.username}] - get all userinfo`;
  const userInfo = req.auth;

  const sql =
    "SELECT i.*, a.avatar, p.password, p.password_1, p.password_2 FROM user_info AS i INNER JOIN (user_avatar AS a, user_psd AS p) ON i.id = a.userid AND i.id = p.userid;";
  database.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    return res.cc("所有用户信息查询成功", logInfo, 1, results);
  });
};

exports.getUserInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const manaUserID = req.params.userid; //被管理者用户ID
  const logInfo = `manage user by [${adminUserInfo.username}] - get userinfo [${manaUserID}]`;

  const sql =
    "SELECT i.*, a.avatar, p.password, p.password_1, p.password_2 FROM user_info AS i INNER JOIN (user_avatar AS a, user_psd AS p) ON i.id = a.userid AND i.id = p.userid WHERE id=?;";
  database.query(sql, manaUserID, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    return res.cc("用户信息查询成功", logInfo, 1, results[0]);
  });
};

exports.addUserByManager = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var manaUserInfo = {};
  for (const key in req.body) {
    //Object.hasOwnProperty.call()方法的作用与Object.hasOwnProperty(prop)相同，用于检测对象自身属性中是否具有指定的属性
    //如果键对应的值为空或者null或者undefined，则将其值设为null，保证入库值的统一性
    if (Object.hasOwnProperty.call(req.body, key) && req.body[key]) {
      manaUserInfo[key] = req.body[key];
    } else {
      manaUserInfo[key] = null;
    }
  }

  const manaUserAvatar = manaUserInfo.avatar;
  const manaUserPSD = manaUserInfo.password;
  delete manaUserInfo.password;
  delete manaUserInfo.avatar;

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

exports.deleteUser = (req, res) => {};
