const express = require('express');
const cors = require('cors');
const app = express();

//配置跨域访问的全局中间件
app.use(cors());
//配置解析表单数据的全局中间件
app.use(express.urlencoded({ extended: false }));

//在3007接口进行监听
app.listen(3007, () => {
    console.log('Api Server on:3007');
})