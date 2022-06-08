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

exports.updateUserInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var manaUserInfo = {};
  for (const key in req.body) {
    console.log(key, req.body[key], typeof req.body[key]);
    if (
      Object.hasOwnProperty.call(req.body, key) &&
      req.body[key] &&
      key !== "avatar" &&
      key !== "password"
    ) {
      manaUserInfo[key] = req.body[key];
    } else {
      manaUserInfo[key] = null;
    }
  }

  const logInfo = `manage user by [${adminUserInfo.username}] - update userinfo [${manaUserInfo.id}]`;

  const sql = "update user_info set ? where id=?";
  database.query(sql, [manaUserInfo, req.params.userid], (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("用户信息更新失败", logInfo);
    }
    return res.cc("用户信息更新成功", logInfo, 1);
  });
};

exports.deleteUser = (req, res) => {};
