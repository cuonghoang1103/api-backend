-- MySQL dump 10.13  Distrib 5.7.29, for Win64 (x86_64)
--
-- Host: localhost    Database: thuvien
-- ------------------------------------------------------
-- Server version	5.7.29-log

/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `thuvien` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `thuvien`;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'STAFF',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'admin','admin123','Quản trị','ADMIN'),(2,'thuthu','123456','Thủ thư Lan','STAFF');
UNLOCK TABLES;

--
-- Table structure for table `readers`
--
DROP TABLE IF EXISTS `readers`;
CREATE TABLE `readers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(10) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `readers` WRITE;
INSERT INTO `readers` (`id`,`name`,`type`,`phone`) VALUES
 (1,'Nguyễn Văn An','SV','0901000001'),(2,'Trần Thị Bình','SV','0901000002'),
 (3,'Lê Minh Châu','GV','0901000003'),(4,'Phạm Quốc Dũng','KHACH','0901000004'),
 (5,'Hoàng Gia Huy','SV','0901000005');
UNLOCK TABLES;

--
-- Table structure for table `books`
--
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `available` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `books` WRITE;
INSERT INTO `books` VALUES
 (1,'CNTT001','Lập trình Java căn bản','Phạm Văn Ất',5,3),
 (2,'CNTT002','Cấu trúc dữ liệu và giải thuật','Đỗ Xuân Lôi',3,2),
 (3,'CNTT003','Clean Code','Robert C. Martin',2,1),
 (4,'CNTT004','Refactoring','Martin Fowler',2,2),
 (5,'CNTT005','Working Effectively with Legacy Code','Michael Feathers',1,1),
 (6,'KT001','Kinh tế vi mô','N. Gregory Mankiw',4,4),
 (7,'NN001','Tiếng Nhật sơ cấp 1','Minna no Nihongo',6,5);
UNLOCK TABLES;

--
-- Table structure for table `loans`
--
DROP TABLE IF EXISTS `loans`;
CREATE TABLE `loans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `reader_id` int(11) NOT NULL,
  `borrow_date` datetime NOT NULL,
  `due_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `fine` double DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_loans_book` (`book_id`),
  KEY `fk_loans_reader` (`reader_id`),
  CONSTRAINT `fk_loans_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `fk_loans_reader` FOREIGN KEY (`reader_id`) REFERENCES `readers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Du lieu mau: ngay tinh tu luc nap de luon co phieu qua han
LOCK TABLES `loans` WRITE;
INSERT INTO `loans` (`id`,`book_id`,`reader_id`,`borrow_date`,`due_date`,`return_date`,`fine`) VALUES
 (1,1,1,NOW() - INTERVAL 20 DAY,NOW() - INTERVAL 6 DAY,NULL,0),
 (2,1,2,NOW() - INTERVAL 5 DAY,NOW() + INTERVAL 9 DAY,NULL,0),
 (3,2,3,NOW() - INTERVAL 40 DAY,NOW() - INTERVAL 10 DAY,NULL,0),
 (4,3,4,NOW() - INTERVAL 30 DAY,NOW() - INTERVAL 23 DAY,NULL,0),
 (5,7,1,NOW() - INTERVAL 60 DAY,NOW() - INTERVAL 46 DAY,NOW() - INTERVAL 40 DAY,12000);
UNLOCK TABLES;

--
-- Trigger: tru so sach con lai khi muon
--
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_loans_ai` AFTER INSERT ON `loans` FOR EACH ROW
BEGIN
  UPDATE books SET available = available - 1 WHERE id = NEW.book_id;
END */;;
DELIMITER ;

--
-- Procedure: bao cao qua han (Lan 2019)
--
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_overdue_report`(IN p_min_days INT)
BEGIN
  SELECT l.id AS loan_id, r.name AS reader_name, b.title,
         DATEDIFF(NOW(), l.due_date) AS days_late,
         DATEDIFF(NOW(), l.due_date) * 2000 AS est_fine
  FROM loans l
  JOIN readers r ON r.id = l.reader_id
  JOIN books b ON b.id = l.book_id
  WHERE l.return_date IS NULL AND DATEDIFF(NOW(), l.due_date) >= p_min_days
  ORDER BY days_late DESC;
END ;;
DELIMITER ;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
-- Dump completed on 2019-11-04 16:20:11
