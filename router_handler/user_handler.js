/**
 * 在此定义和用户相关的路由处理函数，由/router/user.js调用
 */

const db = require('../database/index');
const bcrypt = require('bcryptjs');
const config = require('../store/config');
//配置Token的中间件
const jwt = require('jsonwebtoken');


//用于验证用户信息的中间件
const { validationResult, checkSchema } = require('express-validator');
//验证用户信息的Schema
exports.checkUserInfo = checkSchema({
    username: {
        exists: { errorMessage: '必须指定用户名' },
        isString: { errorMessage: '用户名必须为字符串格式' },
        isAlphanumeric: { errorMessage: '用户名必须为字母或者数字，不能包含空格等其它特殊字符' },
        isLength: {
            errorMessage: '用户名不得少于1位或者超过10位字符',
            options: { min: 1, max: 10 }
        },
    },
    password: {
        exists: { errorMessage: '必须指定密码' },
        isString: { errorMessage: '密码必须为字符串格式' },
        isAlphanumeric: { errorMessage: '密码必须为字母或者数字，不能包含空格等其它特殊字符' },
        isLength: {
            errorMessage: '密码不能少于6位或超过12位',
            options: { min: 6, max: 16 }
        },
    },
    email: {
        //可选的
        optional: {},
        isEmail: {
            errorMessage: '邮箱格式错误'
        }
    },
    nickname: {
        optional: {},
        isString: { errorMessage: '昵称必须为字符串格式' },
        isLength: {
            errorMessage: '用户名不得少于1位或者超过10位字符',
            options: { min: 1, max: 10 }
        }
    }
})
//添加新的用户
exports.addUser = (req, res) => {
    //获取用户信息
    var userinfo = req.body;
    console.log(`add user [${userinfo.username}]`);

    //验证用户信息是否为合法的格式
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.cc(errors.array(true)[0].msg);
    }

    const sqlSel = 'select * from wms_user where username=?';
    db.query(sqlSel, [userinfo.username], (err, results) => {
        //执行语句失败
        if (err) {
            return res.cc(err);
        }
        //用户名被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请选择其它用户名');
        }

        //调用bcrypt.hashSync()对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        //插入新用户
        const sqlIns = 'insert into wms_user set ?'
        db.query(sqlIns, userinfo, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                return res.cc('用户注册失败，请稍后再试')
            }
            return res.cc('注册成功', 0)
        })
    })
}

//用户进行登陆
exports.userLogin = (req, res) => {
    //获取用户信息
    const userinfo = req.body;
    console.log(`user login [${userinfo.username}]`);

    //验证用户信息是否为合法的格式
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.cc(errors.array(true)[0].msg);
    }

    const sqlSel = 'select * from wms_user where username=?';
    db.query(sqlSel, [userinfo.username], (err, results) => {
        //执行语句失败
        if (err) {
            return res.cc(err);
        }
        //查询到的数据不为1，则登陆失败
        if (results.length !== 1) {
            return res.cc('登陆失败，用户未找到');
        }

        //判断用户输入密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) {
            return res.cc('登陆失败')
        }

        //清洗用户信息
        const userInfo = { ...results[0], password: '', user_pic: '' };
        res.tokenStr = jwt.sign(userInfo, config.jwtSecretKey, { expiresIn: config.tokenDuration });
        return res.cc('登陆成功', 0)
    })

}