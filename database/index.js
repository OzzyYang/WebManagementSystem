const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
//用于加密用户密码的中间件
const bcrypt = require("bcryptjs");

//创建数据库连接对象
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "oyzz7758258",
  database: "wms_test",
  multipleStatements: true
});

db.query("select 1 from user_info;", (err, result) => {
  if (err && err.code === "ER_NO_SUCH_TABLE") {
    console.log(
      dayjs().format("YYYY-MM-DD HH:mm:ss :"),
      "first run, creating tables ..."
    );
    //创建表
    fs.readFile(
      path.join(__dirname, "./sql/createTables.sql"),
      "utf8",
      function (err, dataStr) {
        db.query(dataStr, (err, result) => {
          if (err) {
            console.log(err.message);
          }
          console.log(
            dayjs().format("YYYY-MM-DD HH:mm:ss :"),
            "table created."
          );
          //初始化权限数据
          const initLevel =
            "insert into user_level values(1,'Administrator'),(2,'User'),(3,'Guest')";
          db.query(initLevel, (err, results) => {
            if (err) {
              console.log("add level fail", err.message);
            }
            if (results.affectedRows === 0) {
              console.log("add level fail", err.message);
            }
            console.log("add level success");
            //创建测试管理用户
            const sql =
              "insert into user_info (username,level,nickname) values(?,?,?);insert into user_avatar set userid=(select id from user_info where username=?),avatar=?;insert into user_psd set userid=(select id from user_info where username=?),password=?;";
            const adminUserInfo = {
              username: "Admin",
              nickname: "测试管理员",
              level: "1",
              password: bcrypt.hashSync("AdminyounoBB", 10),
              avatar:
                "data:image/png;base64,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"
            };

            db.getConnection((err, connection) => {
              if (err) {
                return res.cc(err, logInfo);
              }
              connection.beginTransaction((err) => {
                if (err) return res.cc(err, logInfo);
                connection.query(
                  sql,
                  [
                    adminUserInfo.username,
                    adminUserInfo.level,
                    adminUserInfo.nickname,
                    adminUserInfo.username,
                    adminUserInfo.avatar,
                    adminUserInfo.username,
                    adminUserInfo.password
                  ],
                  (err, results) => {
                    if (err) {
                      return connection.rollback(() => {
                        console.log("add admin fail", err.message);
                      });
                    }
                    if (results.affectedRows === 0) {
                      return connection.rollback(() => {
                        console.log("add admin fail", err.message);
                      });
                    }
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          console.log("add admin fail", err.message);
                        });
                      }
                      console.log("add admin success");
                    });
                  }
                );
              });
            });
          });
        });
      }
    );
  }
});

module.exports = db;
