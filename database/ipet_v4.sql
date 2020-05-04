-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: ipet
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(200) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `adresss_user_id_idx` (`userId`),
  CONSTRAINT `adresss_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'Bandung',1),(2,'Jakarta',1),(3,'Palembang',2);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  `qty` int NOT NULL,
  `subTotal` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_user_id_idx` (`userId`),
  KEY `cart_product_id_idx` (`productId`),
  CONSTRAINT `cart_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `cart_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,1,1,10000),(2,2,1,5,250000),(3,3,1,2,60000);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Obat'),(2,'Hygiene'),(3,'Makanan'),(4,'Kucing'),(5,'Anjing'),(6,'General'),(7,'Toys');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcel`
--

DROP TABLE IF EXISTS `parcel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parcelName` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcel`
--

LOCK TABLES `parcel` WRITE;
/*!40000 ALTER TABLE `parcel` DISABLE KEYS */;
INSERT INTO `parcel` VALUES (1,'Paket Diare');
/*!40000 ALTER TABLE `parcel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_numbers`
--

DROP TABLE IF EXISTS `phone_numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_numbers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(20) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phoneNumber_UNIQUE` (`phoneNumber`),
  KEY `phone_number_user_id_idx` (`userId`),
  CONSTRAINT `phone_number_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_numbers`
--

LOCK TABLES `phone_numbers` WRITE;
/*!40000 ALTER TABLE `phone_numbers` DISABLE KEYS */;
INSERT INTO `phone_numbers` VALUES (1,'0811111111',1),(2,'0822222222',1),(3,'02111111111',2),(4,'08211111111',2);
/*!40000 ALTER TABLE `phone_numbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id_idx` (`categoryId`),
  KEY `product_id_idx` (`productId`),
  CONSTRAINT `category_id` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`),
  CONSTRAINT `product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,1,3),(2,2,1),(3,2,2),(4,2,4),(5,3,5),(6,2,6),(7,6,1),(8,6,2),(9,6,3),(10,4,4),(11,4,5),(12,4,6),(13,7,7),(14,5,7),(21,2,26),(22,6,26),(23,3,27),(24,5,27),(25,1,28),(26,5,28),(27,6,29),(28,2,29),(29,4,30),(30,1,30);
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(2000) NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `image_product_id_idx` (`productId`),
  CONSTRAINT `image_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (1,'https://id-test-11.slatic.net/p/2e48cf54bd11a996aeab46e155b91016.jpg',1),(2,'https://s2.bukalapak.com/img/7700017652/original/Sekop_kotoran_Kucing_Anjing_atau_Serokan_kotoran_Kucing_Anji.jpg',1),(3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQspeZOdzOKiPqtl_OEV2i350XNPkZfAdCP6P5SwAbEQEZ59BnuJQ&s',2),(4,'https://i0.wp.com/kucing.co.id/wp-content/uploads/2019/01/harga-pasir-kucing.jpg?fit=1094%2C588&ssl=1',2),(5,'https://ecs7.tokopedia.net/img/cache/700/product-1/2017/3/1/72129/72129_f2beb868-e573-41dc-a601-01bfd2014afc.jpg',3),(6,'https://s2.bukalapak.com/img/2689978822/large/Obat_Cacing_Kucing_Drontal_Cat.jpg',3),(7,'https://cf.shopee.co.id/file/10d8a04b994fc21f48e9f5462d996e58',4),(8,'https://cf.shopee.co.id/file/d8efe39dc2549b6be123b9f4bbd0b2fa',4),(9,'https://s0.bukalapak.com/img/00710952631/w-1000/Whiskas_Adult_Mackerel_480_Gram___Makanan_Kucing_Fresh_Pack.jpg',5),(10,'https://cf.shopee.co.id/file/10d8a04b994fc21f48e9f5462d996e58',5),(11,'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/medium//96/MTA-2568246/kandila_kandila-grooming-kotak-segiempat-sisir-kucing_full05.jpg',6),(12,'https://cf.shopee.co.id/file/d401e600ec2c2d7df512bb6d1a4f77af',6),(13,'https://ae01.alicdn.com/kf/HTB15GjLXshmZKJjSZFPq6A5_XXah/Tahan-Terhadap-Gigitan-Tulang-Anjing-Gigi-Geraham-Bola-Karet-Bermain-untuk-Gigi-Pelatihan-Karet-Plastik-Termal.jpg',7),(14,'https://sc02.alicdn.com/kf/HTB1Adl2drsTMeJjSszdq6AEupXah/Free-sample-rubber-pet-chew-dog-bone.jpg_350x350.jpg',7),(39,'/images/product/PROD1588572811317.jpg',26),(40,'/images/product/PROD1588572811335.jpg',26),(41,'/images/product/PROD1588578049227.jpg',27),(42,'/images/product/PROD1588578049242.jpg',27),(43,'/images/product/PROD1588578471156.jpg',28),(44,'/images/product/PROD1588578471157.jpg',28),(45,'/images/product/PROD1588578652040.jpg',29),(46,'/images/product/PROD1588578652053.jpg',29),(47,'/images/product/PROD1588578746007.jpg',30),(48,'/images/product/PROD1588578746009.jpg',30);
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_parcel`
--

DROP TABLE IF EXISTS `product_parcel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_parcel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parcelId` int NOT NULL,
  `productId` int NOT NULL,
  `productQty` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parcel_id_idx` (`parcelId`),
  KEY `parcel_product_id_idx` (`productId`),
  CONSTRAINT `parcel_id` FOREIGN KEY (`parcelId`) REFERENCES `parcel` (`id`),
  CONSTRAINT `parcel_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_parcel`
--

LOCK TABLES `product_parcel` WRITE;
/*!40000 ALTER TABLE `product_parcel` DISABLE KEYS */;
INSERT INTO `product_parcel` VALUES (1,1,1,1),(2,1,2,3),(3,1,3,1);
/*!40000 ALTER TABLE `product_parcel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_view`
--

DROP TABLE IF EXISTS `product_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_view` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `view_product_id_idx` (`productId`),
  KEY `view_user_id_idx` (`userId`),
  CONSTRAINT `view_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `view_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_view`
--

LOCK TABLES `product_view` WRITE;
/*!40000 ALTER TABLE `product_view` DISABLE KEYS */;
INSERT INTO `product_view` VALUES (1,1,1),(2,2,1);
/*!40000 ALTER TABLE `product_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(45) NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Serokan Tai',10000),(2,'Pasir Tai',50000),(3,'Obat Cacing',30000),(4,'Shampo kucing',25000),(5,'Whiskas',54000),(6,'Sisir Kucing',15000),(7,'Tulang Mainan',20000),(26,'Popok Anjing Kucing',10000),(27,'Royal Canin Mini Adult 8kg',570000),(28,'Obat Kutu Anjing Caplax',49000),(29,'Serokan Kotoran',10000),(30,'Obat Cacing Kucing Drontal',25000);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `invStock` int NOT NULL,
  `appStock` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_product_id_idx` (`productId`),
  CONSTRAINT `stock_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,10,10),(2,2,50,50),(3,3,5,5),(4,4,12,12),(5,5,10,10),(6,6,20,20),(7,7,10,10),(24,26,15,15),(25,27,15,15),(26,28,5,5),(27,29,5,5),(28,30,10,10);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `totalPrice` int NOT NULL,
  `approval` tinyint(1) NOT NULL,
  `paymentImg` varchar(200) NOT NULL,
  `date` datetime NOT NULL,
  `invoicePath` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_user_id_idx` (`userId`),
  CONSTRAINT `payment_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,1,100000,1,'www.hotmail.com','2019-03-22 14:18:21',NULL);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_item`
--

DROP TABLE IF EXISTS `transaction_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `transactionId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction_cart_id_idx` (`cartId`),
  KEY `transaction_transaction_id_idx` (`transactionId`),
  CONSTRAINT `transaction_cart_id` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`),
  CONSTRAINT `transaction_transaction_id` FOREIGN KEY (`transactionId`) REFERENCES `transaction` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item`
--

LOCK TABLES `transaction_item` WRITE;
/*!40000 ALTER TABLE `transaction_item` DISABLE KEYS */;
INSERT INTO `transaction_item` VALUES (1,1,1),(2,2,1),(3,3,1);
/*!40000 ALTER TABLE `transaction_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(64) NOT NULL,
  `roleId` int NOT NULL,
  `verified` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `user_id_role_idx` (`roleId`),
  CONSTRAINT `user_id_role` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'susilo','susilo@gmail.com','123',2,1),(2,'bangbang','bangbang@gmail.com','123',2,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-04 21:12:31
