CREATE TABLE `wms`.`user_info` (
    `id` int NOT NULL COMMENT '用户ID',
    `username` varchar(10) NOT NULL COMMENT '用户名',
    `phone` varchar(11) DEFAULT NULL COMMENT '手机号码',
    `email` varchar(45) DEFAULT NULL COMMENT '电子邮箱',
    `nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
    `gender` char(1) DEFAULT NULL COMMENT '性别',
    `age` tinyint unsigned DEFAULT NULL COMMENT '年龄',
    `status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '删除状态',
    `level` tinyint NOT NULL COMMENT '权限等级',
    `islogin` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '在线',
    `createtime` date NOT NULL COMMENT '创建时间',
    `lastlogin` date DEFAULT NULL COMMENT '最近登录',
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `username_UNIQUE` (`username`),
    UNIQUE KEY `email_UNIQUE` (`email`),
    UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户的基本信息表';

CREATE TABLE `wms`.`user_psd` (
    `userid` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `password` VARCHAR(45) NOT NULL,
    `password_1` VARCHAR(45) NULL COMMENT '曾用密码',
    `password_2` VARCHAR(45) NULL COMMENT '曾曾用密码',
    PRIMARY KEY (`userid`),
    UNIQUE INDEX `userid_UNIQUE` (`userid` ASC) VISIBLE
) COMMENT = '用户的密码表';

CREATE TABLE `wms`.`user_pic` (
    `userid` INT UNSIGNED NOT NULL,
    `user_pic` VARCHAR(45) NULL,
    PRIMARY KEY (`userid`),
    UNIQUE INDEX `userid_UNIQUE` (`userid` ASC) VISIBLE
) COMMENT = '用户的头像表';

CREATE TABLE `wms`.`user_level` (
    `id` INT UNSIGNED NOT NULL,
    `commit` VARCHAR(5) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    UNIQUE INDEX `commit_UNIQUE` (`commit` ASC) VISIBLE
) COMMENT = '用户权限表';