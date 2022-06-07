//用于验证用户信息的中间件
const { checkSchema } = require("express-validator");
//验证用户注册信息的Schema
exports.checkUserInfo = checkSchema({
  username: {
    exists: { errorMessage: "必须指定用户名" },
    isString: { errorMessage: "用户名必须为字符串格式" },
    isAlphanumeric: {
      errorMessage: "用户名必须为字母或者数字，不能包含空格等其它特殊字符"
    },
    isLength: {
      errorMessage: "用户名不得少于1位或者超过11位字符",
      options: { min: 1, max: 11 }
    }
  },
  password: {
    exists: { errorMessage: "必须指定密码" },
    isString: { errorMessage: "密码必须为字符串格式" },
    isAlphanumeric: {
      errorMessage: "密码必须为字母或者数字，不能包含空格等其它特殊字符"
    },
    isLength: {
      errorMessage: "密码不能少于6位或超过12位",
      options: { min: 6, max: 16 }
    }
  },
  avatar: {
    optional: true,
    isBase64: { errorMessage: "用户头像的格式应为Base64" }
  }
});

//验证用户更新息的Schema
exports.updateUserInfo = checkSchema({
  email: {
    //可选的
    optional: true,
    isEmail: {
      errorMessage: "邮箱格式错误"
    }
  },
  nickname: {
    optional: true,
    isString: { errorMessage: "昵称必须为字符串格式" },
    isLength: {
      errorMessage: "用户名不得少于1位或者超过10位字符",
      options: { min: 1, max: 10 }
    }
  },
  gender: {
    optional: true,
    //自定义验证器
    custom: {
      //value即要验证的值，req是请求体，location是body，path是gender
      options: (value, { req, location, path }) => {
        if (value === "男" || value === "女") {
          return true;
        }
        throw new Error("用户性别必须为男或者女");
      }
    }
  },
  age: {
    optional: true,
    isInt: {
      errorMessage: "用户年龄必须为1-200之间的整数",
      options: {
        min: 1,
        max: 200
      }
    },
    toInt: true
  }
});

//验证用户重置密码的CheckSchema
exports.CheckPassword = checkSchema({
  oldPassword: {
    exists: { errorMessage: "必须指定旧密码" },
    isString: { errorMessage: "旧密码必须为字符串格式" },
    isAlphanumeric: {
      errorMessage: "旧密码必须为字母或者数字，不能包含空格等其它特殊字符"
    },
    isLength: {
      errorMessage: "旧密码不能少于6位或超过16位",
      options: { min: 6, max: 16 }
    }
  },
  newPassword: {
    exists: { errorMessage: "必须指定新密码" },
    isString: { errorMessage: "新密码必须为字符串格式" },
    isAlphanumeric: {
      errorMessage: "新密码必须为字母或者数字，不能包含空格等其它特殊字符"
    },
    isLength: {
      errorMessage: "新密码不能少于6位或超过16位",
      options: { min: 6, max: 16 }
    }
  }
});

exports.checkAvatar = checkSchema({
  file: {
    isDataURI: {
      errorMessage: "用户头像的格式应为DataURI",
      options: { urlSafe: false }
    }
  }
});
