-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)

--

-- Host: localhost    Database: wms

-- ------------------------------------------------------

-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */

;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */

;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */

;

/*!50503 SET NAMES utf8 */

;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */

;

/*!40103 SET TIME_ZONE='+00:00' */

;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */

;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */

;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */

;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */

;

--

-- Table structure for table `book_info`

--

DROP TABLE IF EXISTS `book_info`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `book_info` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(45) NOT NULL,
    `cover` longtext,
    `intro` longtext,
    `createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` tinyint NOT NULL DEFAULT '2',
    `VV` int NOT NULL DEFAULT '0' COMMENT 'Visited View 访问次数（浏览量）',
    `BV` int NOT NULL DEFAULT '0' COMMENT 'Borrowed View 借阅次数',
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = '绘本的基本信息表';

/*!40101 SET character_set_client = @saved_cs_client */

;

--

-- Table structure for table `book_tag`

--

DROP TABLE IF EXISTS `book_tag`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `book_tag` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(45) NOT NULL COMMENT '标签分类的名字',
    `status` tinyint NOT NULL DEFAULT '1' COMMENT '标签状态：0表示删除，1表示正常使用',
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = '绘本的分类标签表';

/*!40101 SET character_set_client = @saved_cs_client */

;

--

-- Table structure for table `book_tag_rel`

--

DROP TABLE IF EXISTS `book_tag_rel`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `book_tag_rel` (
    `bookid` int NOT NULL,
    `tagid` int NOT NULL,
    PRIMARY KEY (`bookid`, `tagid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '绘本和标签信息的对应表';

/*!40101 SET character_set_client = @saved_cs_client */

;

--

-- Table structure for table `user_avatar`

--

DROP TABLE IF EXISTS `user_avatar`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `user_avatar` (
    `userid` int unsigned NOT NULL COMMENT '用户ID',
    `avatar` longtext,
    PRIMARY KEY (`userid`),
    UNIQUE KEY `userid_UNIQUE` (`userid`),
    CONSTRAINT `fk__pic_userid` FOREIGN KEY (`userid`) REFERENCES `user_info` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户的头像表';

/*!40101 SET character_set_client = @saved_cs_client */

;

--

-- Table structure for table `user_info`

--

DROP TABLE IF EXISTS `user_info`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `user_info` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` varchar(20) NOT NULL COMMENT '用户名',
    `phone` varchar(11) DEFAULT NULL COMMENT '手机号码',
    `email` varchar(45) DEFAULT NULL COMMENT '电子邮箱',
    `nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
    `gender` char(1) DEFAULT NULL COMMENT '性别',
    `age` char(3) DEFAULT NULL COMMENT '年龄',
    `status` char(1) NOT NULL DEFAULT '1' COMMENT '删除状态',
    `level` char(1) NOT NULL DEFAULT '2' COMMENT '权限等级',
    `islogin` char(1) NOT NULL DEFAULT '0' COMMENT '在线',
    `createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `lastlogin` datetime DEFAULT NULL COMMENT '最近登录',
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `username_UNIQUE` (`username`),
    UNIQUE KEY `email_UNIQUE` (`email`),
    UNIQUE KEY `phone_UNIQUE` (`phone`),
    KEY `sdad_idx` (`level`),
    CONSTRAINT `fk_user_level` FOREIGN KEY (`level`) REFERENCES `user_level` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = '用户的基本信息表';

/*!40101 SET character_set_client = @saved_cs_client */

;

--

-- Table structure for table `user_level`

--

DROP TABLE IF EXISTS `user_level`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `user_level` (
    `id` char(1) NOT NULL,
    `commit` varchar(20) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `commit_UNIQUE` (`commit`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户权限表';

/*!40101 SET character_set_client = @saved_cs_client */

;

--

-- Table structure for table `user_psd`

--

DROP TABLE IF EXISTS `user_psd`;

/*!40101 SET @saved_cs_client     = @@character_set_client */

;

/*!50503 SET character_set_client = utf8mb4 */

;

CREATE TABLE `user_psd` (
    `userid` int unsigned NOT NULL,
    `password` varchar(255) NOT NULL,
    `password_1` varchar(255) DEFAULT NULL COMMENT '曾用密码',
    `password_2` varchar(255) DEFAULT NULL COMMENT '曾曾用密码',
    PRIMARY KEY (`userid`),
    UNIQUE KEY `userid_UNIQUE` (`userid`),
    CONSTRAINT `fk__psd_userid` FOREIGN KEY (`userid`) REFERENCES `user_info` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户的密码表';

/*!40101 SET character_set_client = @saved_cs_client */

;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */

;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */

;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */

;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */

;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */

;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */

;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */

;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */

;

-- Dump completed on 2022-06-14 19:33:01