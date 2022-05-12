const express = require('express');
//创建路由对象
const router = express.Router();
//导入用户路由处理模块
const userHandler = require('../router_handler/user_handler.js');

//用于验证用户信息的中间件
const { body } = require('express-validator');

//注册新用户
router.post('/add',
    userHandler.checkUserInfo,
    userHandler.addUser)

//登陆
router.post('/login',
    userHandler.checkUserInfo,
    userHandler.userLogin)

module.exports = router;