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
  email: {
    //可选的
    optional: {},
    isEmail: {
      errorMessage: "邮箱格式错误"
    }
  },
  nickname: {
    optional: {},
    isString: { errorMessage: "昵称必须为字符串格式" },
    isLength: {
      errorMessage: "用户名不得少于1位或者超过10位字符",
      options: { min: 1, max: 10 }
    }
  },
  user_pic: {
    optional: {},
    isURL: {
      errorMessage: "非法的URL地址",
      options: { require_protocol: true }
    }
  }
});

//验证用户更新息的Schema
exports.updateUserInfo = checkSchema({
  email: {
    //可选的
    optional: {},
    isEmail: {
      errorMessage: "邮箱格式错误"
    }
  },
  nickname: {
    optional: {},
    isString: { errorMessage: "昵称必须为字符串格式" },
    isLength: {
      errorMessage: "用户名不得少于1位或者超过10位字符",
      options: { min: 1, max: 10 }
    }
  },
  user_pic: {
    optional: {},
    isURL: {
      errorMessage: "非法的URL地址",
      options: { require_protocol: true }
    }
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
      errorMessage: "旧密码不能少于6位或超过12位",
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
      errorMessage: "新密码不能少于6位或超过12位",
      options: { min: 6, max: 16 }
    }
  }
});
