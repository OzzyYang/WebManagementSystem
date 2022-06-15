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
  const logInfo = `get all book info`;

  const sql =
    "SELECT i.id,i.title,i.cover,i.intro,i.createtime,i.VV,i.BV, GROUP_CONCAT(t.id,'-',t.name) AS tags FROM book_info AS i INNER JOIN (book_tag AS t, book_tag_rel AS r) ON r.bookid = i.id AND r.tagid = t.id  where i.status=2 GROUP BY i.id;";
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
