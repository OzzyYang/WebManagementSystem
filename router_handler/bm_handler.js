const path = require("path");

const database = require(path.join(__dirname, "..", "/database/index"));

/**
 * 获取所有绘本的信息
 * TODO:分页
 * @param {请求体} req
 * @param {响应体} res
 * @returns 执行信息
 */
exports.getAllBookInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const logInfo = `manage user by [${adminUserInfo.username}] - get all book info`;

  const sql =
    "SELECT i.*, GROUP_CONCAT(t.id,'-',t.name) AS tags FROM book_info AS i INNER JOIN (book_tag AS t, book_tag_rel AS r) ON r.bookid = i.id AND r.tagid = t.id  where i.status<>0 GROUP BY i.id;";
  database.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 0) {
      return res.cc("未找到任何绘本信息", logInfo);
    }
    return res.cc("所有绘本信息查询成功", logInfo, 1, results);
  });
};

/**
 * 获取单个绘本的所有信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.getBookInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const bookID = req.params.bookid; //被管理者用户ID
  const logInfo = `manage user by [${adminUserInfo.username}] - get book info [id:${bookID}]`;

  const sql =
    "SELECT i.*, GROUP_CONCAT(t.id,'-',t.name) AS tags FROM book_info AS i INNER JOIN (book_tag AS t, book_tag_rel AS r) ON r.bookid = i.id AND r.tagid = t.id  where i.id=? and i.status<>0 GROUP BY i.id;";
  database.query(sql, bookID, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 0) {
      return res.cc("未找到对应的绘本", logInfo);
    }
    return res.cc("绘本信息查询成功", logInfo, 1, results[0]);
  });
};

/**
 * 管理员添加单个绘本
 * @param {请求体} req
 * @param {响应体} res
 */
exports.addBookByManager = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //绘本信息
  var bookInfo = {};
  var bookTags = [];

  bookInfo.title = req.body.title ? req.body.title : null;
  bookInfo.cover = req.body.cover ? req.body.cover : null;
  bookInfo.intro = req.body.intro ? req.body.intro : null;
  bookInfo.status = req.body.status ? req.body.status : 2; //状态默认为2，即上架状态
  bookTags = req.body.tags ? req.body.tags : [1]; //分类标签默认为1，即未分类

  const logInfo = `manage book by [${adminUserInfo.username}] - add book [${bookInfo.title}]`;

  //插入绘本信息
  const sqlIns = "insert into book_info set ?;";
  database.getConnection((err, connection) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    connection.beginTransaction((err) => {
      if (err) return res.cc(err, logInfo);
      connection.query(sqlIns, bookInfo, (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.cc(err, logInfo);
          });
        }
        if (results.affectedRows === 0) {
          return connection.rollback(() => {
            res.cc("添加绘本失败", logInfo);
          });
        }

        //根据插入绘本的ID建立与标签的联系
        const sql = "insert into book_tag_rel values(?,?)";
        const bookid = results.insertId;
        for (let i = 0; i < bookTags.length; i++) {
          connection.query(sql, [bookid, bookTags[i]], (err, results) => {
            console.log(err);
            if (err) {
              connection.rollback(() => {
                res.cc(err, logInfo);
              });
            }
            if (results.affectedRows === 0) {
              connection.rollback(() => {
                res.cc("添加绘本失败", logInfo);
              });
            }
            if (i === bookTags.length - 1) {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    res.cc(err, logInfo);
                  });
                }
                return res.cc("绘本添加成功", logInfo, 1);
              });
            }
          });
        }
      });
    });
  });
};

/**
 * 管理员更新单个绘本信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.updateBookInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //绘本信息
  var bookInfo = {};
  var bookTags = [];

  bookInfo.id = req.params.bookid;
  bookInfo.title = req.body.title ? req.body.title : null;
  bookInfo.cover = req.body.cover ? req.body.cover : null;
  bookInfo.intro = req.body.intro ? req.body.intro : null;
  bookInfo.status = req.body.status ? req.body.status : 2; //状态默认为2，即上架状态
  bookTags = req.body.tags ? req.body.tags.split(",") : [1]; //分类标签必须为用逗号分割的字符串，默认只包含1，即未分类，

  const logInfo = `manage user by [${adminUserInfo.username}] - update book info [id:${bookInfo.id}]`;

  //更新绘本信息
  database.getConnection((err, connection) => {
    if (err) return res.cc(err, logInfo);

    connection.beginTransaction((err) => {
      if (err) return res.cc(err, logInfo);
      //查找绘本是否存在
      const sqlSel = "select id from book_info where id=?";
      connection.query(sqlSel, bookInfo.id, (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.cc(err, logInfo);
          });
        }
        if (results.length === 0) {
          return connection.rollback(() => {
            res.cc("要更新的绘本不存在", logInfo);
          });
        }
        //更新绘本信息
        const sqlUpt = "update book_info set ? where id=?;";
        connection.query(sqlUpt, [bookInfo, bookInfo.id], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.cc(err, logInfo);
            });
          }
          if (results.length === 0) {
            return connection.rollback(() => {
              res.cc("绘本信息更新失败", logInfo);
            });
          }
          //更新绘本的标签信息，首先查询绘本已有的tag
          const sqlSel = "select tagid from book_tag_rel where bookid=?";
          connection.query(sqlSel, bookInfo.id, (err, tagsResults) => {
            if (err) {
              return connection.rollback(() => {
                res.cc(err, logInfo);
              });
            }

            //删除多余的Tag
            tagsResults.forEach((tag) => {
              if (!bookTags.includes(tag.tagid)) {
                const sqlDel =
                  "delete from book_tag_rel where bookid=? and tagid=?";
                connection.query(
                  sqlDel,
                  [bookInfo.id, tag.tagid],
                  (err, results) => {
                    if (err) {
                      connection.rollback(() => {
                        return res.cc(err, logInfo);
                      });
                    }
                    if (results.affectedRows === 0) {
                      connection.rollback(() => {
                        return res.cc(err, logInfo);
                      });
                    }
                  }
                );
              } else {
                //如果存在重复的tags则删除这个tags，防止重复插入
                bookTags.splice(bookTags.indexOf(tag.tagid));
              }
            });
            //插入新增的tags
            const sqlIns = "insert into book_tag_rel values(?,?);";
            for (let i = 0; i < bookTags.length; i++) {
              connection.query(
                sqlIns,
                [bookInfo.id, bookTags[i]],
                (err, results) => {
                  if (err) {
                    connection.rollback(() => {
                      return res.cc(err, logInfo);
                    });
                  }
                  if (results.affectedRows === 0) {
                    connection.rollback(() => {
                      return res.cc("绘本信息更新失败", logInfo);
                    });
                  }
                  if (i === bookTags.length - 1) {
                    connection.commit(() => {
                      return res.cc("绘本信息更新成功", logInfo, 1);
                    });
                  }
                }
              );
            }

            /* 已有tag数量少于要更新tag数量时，则插入新的tag对应关系
             * 以下代码为最初的写法，虽然可用，但是没有排除重复容易出现Bug
             */
            //判断已有tag数量和要更新的tag数量
            //const dif = tagsResults.length - bookTags.length;
            // if (dif < 0) {
            //   const sqlDel = "insert into book_tag_rel values(?,?);";
            //   for (let i = 0; i < -dif; i++) {
            //     connection.query(
            //       sqlDel,
            //       [bookInfo.id, bookTags[tagsResults.length + i]],
            //       (err, inserResults) => {
            //         if (err) {
            //           return connection.rollback(() => {
            //             res.cc(err, logInfo);
            //           });
            //         }
            //         if (inserResults.affectedRows === 0) {
            //           return connection.rollback(() => {
            //             res.cc("0绘本信息更新失败", logInfo);
            //           });
            //         }
            //       }
            //     );
            //   }
            // }
            //已有tag数量多于要更新tag数量时，则删除多余的tag对应关系
            // if (dif > 0) {
            //   const sqlDel =
            //     "delete from book_tag_rel where bookid=? and tagid=?;";
            //   for (let i = 0; i < dif; i++) {
            //     connection.query(
            //       sqlDel,
            //       [bookInfo.id, tagsResults[bookTags.length + i].tagid],
            //       (err, deleteResults) => {
            //         if (err) {
            //           return connection.rollback(() => {
            //             res.cc(err, logInfo);
            //           });
            //         }
            //         if (deleteResults.affectedRows === 0) {
            //           return connection.rollback(() => {
            //             res.cc("1绘本信息更新失败", logInfo);
            //           });
            //         }
            //       }
            //     );
            //   }
            // }
            // const sqlUpt =
            //   "update book_tag_rel set tagid=? where bookid=? and tagid=?;";
            // const uptTimes = dif > 0 ? bookTags.length : tagsResults.length; //执行更新的次数，其值应该为较小那一个
            // for (let i = 0; i < uptTimes; i++) {
            //   console.log(i, dif > 0 ? bookTags.length : tagsResults.length);
            //   connection.query(
            //     sqlUpt,
            //     [bookTags[i], bookInfo.id, tagsResults[i].tagid],
            //     (err, results) => {
            //       if (err) {
            //         return connection.rollback(() => {
            //           res.cc(err, logInfo);
            //         });
            //       }
            //       if (results.affectedRows === 0) {
            //         return connection.rollback(() => {
            //           res.cc("2绘本信息更新失败", logInfo);
            //         });
            //       }
            //       if (i === uptTimes - 1) {
            //         connection.commit((err) => {
            //           if (err) {
            //             connection.rollback(() => {
            //               res.cc(err, logInfo);
            //             });
            //           }
            //           return res.cc("3绘本信息更新成功", logInfo, 1);
            //         });
            //       }
            //     }
            //   );
            // }
          });
        });
      });
    });
  });
};

/**
 * 管理员删除绘本
 * @param {请求体} req
 * @param {响应体} res
 */
exports.deleteBook = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //被管理者用户信息
  var bookID = req.params.bookid;

  const logInfo = `manage user by [${adminUserInfo.username}] - delete book [id:${bookID}]`;

  const sql = "update book_info set status=0 where id=?; ";
  database.query(sql, bookID, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("删除绘本失败", logInfo);
    }
    return res.cc("删除绘本成功", logInfo, 1);
  });
};
