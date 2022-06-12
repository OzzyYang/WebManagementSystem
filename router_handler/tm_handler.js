const path = require("path");

const database = require(path.join(__dirname, "..", "/database/index"));

/**
 * 获取所有标签的信息
 * TODO:分页
 * @param {请求体} req
 * @param {响应体} res
 * @returns 执行信息
 */
exports.getAllTagInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const logInfo = `manage tag by [${adminUserInfo.username}] - get all tag info`;

  const sql = "SELECT * from book_tag where status <> 0;";
  database.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 0) {
      return res.cc("未找到任何标签信息", logInfo);
    }
    return res.cc("所有标签信息查询成功", logInfo, 1, results);
  });
};

/**
 * 获取单个标签的信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.getTagInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  const tagId = req.params.tagid;
  const logInfo = `manage tag by [${adminUserInfo.username}] - get tag info [id:${tagId}]`;

  const sql = "SELECT * from book_tag where id=? and status <> 0";
  database.query(sql, tagId, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 0) {
      return res.cc("未找到对应的标签", logInfo);
    }
    return res.cc("标签信息查询成功", logInfo, 1, results[0]);
  });
};

/**
 * 管理员添加单个标签
 * @param {请求体} req
 * @param {响应体} res
 */
exports.addTag = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //标签信息
  var tagInfo = {};
  tagInfo.name = req.body.name ? req.body.name : "未分类";
  tagInfo.status = req.body.status ? req.body.status : 1; //状态默认为2，即正常使用状态

  const logInfo = `manage tag by [${adminUserInfo.username}] - add tag [tag:${tagInfo.name}]`;

  //插入新的标签
  const sqlIns = "insert ignore into book_tag set ?;";
  database.query(sqlIns, tagInfo, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.warningCount === 1) {
      return res.cc("标签已存在", logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("新建标签失败", logInfo);
    }
    return res.cc("新建标签成功", logInfo, 1);
  });
};

/**
 * 管理员更新单个标签信息
 * @param {请求体} req
 * @param {响应体} res
 */
exports.updateTagInfo = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息
  //标签信息
  var tagInfo = {};
  const tagId = req.params.tagid;
  tagInfo.name = req.body.name ? req.body.name : "未分类";
  tagInfo.status = req.body.status ? req.body.status : 1; //状态默认为2，即正常使用状态

  const logInfo = `manage tag by [${adminUserInfo.username}] - update tag info [tag:${tagInfo.name}]`;

  //插入新的标签
  const sqlIns = "update book_tag set ? where id=?;";
  database.query(sqlIns, [tagInfo, tagId], (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("修改失败，已存在同名标签", logInfo);
    }
    return res.cc("标签修改成功", logInfo, 1);
  });
};

/**
 * 管理员删除单个标签
 * @param {请求体} req
 * @param {响应体} res
 */
exports.deleteTag = (req, res) => {
  const adminUserInfo = req.auth; //管理员信息

  var tagId = req.params.tagid;

  const logInfo = `manage tag by [${adminUserInfo.username}] - delete tag [id:${tagId}]`;

  const sql = "update book_tag set status=0 where id=?; ";
  database.query(sql, tagId, (err, results) => {
    if (err) {
      return res.cc(err, logInfo);
    }
    if (results.affectedRows === 0) {
      return res.cc("删除标签失败", logInfo);
    }
    return res.cc("删除标签成功", logInfo, 1);
  });
};
