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
  CONSTRAINT `adresss_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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
  CONSTRAINT `cart_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,1,1,10000),(2,2,1,5,250000),(3,3,1,2,60000),(4,1,2,2,20000),(5,2,2,3,150000),(6,4,2,3,50000),(7,46,3,5,1111),(8,47,3,1,1111),(9,48,3,2,1111),(10,46,1,1,1111),(11,48,1,2,1111),(12,47,5,5,1111),(13,49,2,1,1111),(14,50,2,3,1111);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Obat'),(2,'Kebersihan'),(3,'Makanan'),(4,'Kucing'),(5,'Anjing'),(6,'General'),(7,'Mainan'),(10,'Aksesoris'),(13,'Pakaian'),(14,'Grooming');
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
  CONSTRAINT `product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,1,3),(2,2,1),(3,2,2),(4,2,4),(5,3,5),(6,2,6),(7,6,1),(8,6,2),(9,6,3),(10,4,4),(11,4,5),(12,4,6),(52,13,46),(54,5,47),(55,2,47),(56,3,48),(57,5,48),(58,4,49),(59,14,49),(60,6,50),(61,14,50),(62,6,51),(63,14,51),(65,5,46),(67,1,52),(68,3,52),(69,1,53),(70,6,54),(71,14,54),(72,6,55),(73,13,55),(74,5,56),(75,13,56),(76,4,57),(77,7,57),(78,4,58),(79,7,58),(80,7,59),(81,5,59),(82,5,60),(83,2,60),(84,6,61),(85,10,61),(86,4,62),(87,14,62),(88,6,63),(89,14,63),(90,6,64),(91,14,64),(92,6,65),(93,14,65),(94,6,66),(95,14,66),(96,2,67),(97,14,67),(98,6,67),(99,2,68),(100,14,68),(101,6,68),(102,10,69),(103,4,69),(104,7,69),(105,13,70),(106,6,70),(107,7,71),(108,5,71),(109,7,72),(110,5,72),(111,2,72),(112,7,73),(113,4,73),(114,7,74),(115,5,74),(116,2,75),(117,5,75),(118,10,76),(119,6,76);
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
  CONSTRAINT `image_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (1,'https://id-test-11.slatic.net/p/2e48cf54bd11a996aeab46e155b91016.jpg',1),(2,'https://s2.bukalapak.com/img/7700017652/original/Sekop_kotoran_Kucing_Anjing_atau_Serokan_kotoran_Kucing_Anji.jpg',1),(3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQspeZOdzOKiPqtl_OEV2i350XNPkZfAdCP6P5SwAbEQEZ59BnuJQ&s',2),(4,'https://i0.wp.com/kucing.co.id/wp-content/uploads/2019/01/harga-pasir-kucing.jpg?fit=1094%2C588&ssl=1',2),(5,'https://ecs7.tokopedia.net/img/cache/700/product-1/2017/3/1/72129/72129_f2beb868-e573-41dc-a601-01bfd2014afc.jpg',3),(6,'https://s2.bukalapak.com/img/2689978822/large/Obat_Cacing_Kucing_Drontal_Cat.jpg',3),(7,'https://cf.shopee.co.id/file/10d8a04b994fc21f48e9f5462d996e58',4),(8,'https://cf.shopee.co.id/file/d8efe39dc2549b6be123b9f4bbd0b2fa',4),(9,'https://s0.bukalapak.com/img/00710952631/w-1000/Whiskas_Adult_Mackerel_480_Gram___Makanan_Kucing_Fresh_Pack.jpg',5),(10,'https://cf.shopee.co.id/file/10d8a04b994fc21f48e9f5462d996e58',5),(11,'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/medium//96/MTA-2568246/kandila_kandila-grooming-kotak-segiempat-sisir-kucing_full05.jpg',6),(12,'https://cf.shopee.co.id/file/d401e600ec2c2d7df512bb6d1a4f77af',6),(79,'/images/product/PROD1589295605232.jpg',47),(80,'/images/product/PROD1589295637590.png',48),(81,'/images/product/PROD1589295714732.jpg',49),(82,'/images/product/PROD1589295714735.jpg',49),(83,'/images/product/PROD1589295714745.jpg',49),(84,'/images/product/PROD1589295756273.jpg',50),(85,'/images/product/PROD1589295756291.jpg',50),(86,'/images/product/PROD1589295756293.jpg',50),(87,'/images/product/PROD1589295756295.jpg',50),(88,'/images/product/PROD1589295756297.jpg',50),(89,'/images/product/PROD1589295780658.jpg',51),(90,'/images/product/PROD1589295780660.jpg',51),(97,'/images/product/PROD1591779296971.jpg',46),(98,'/images/product/PROD1591086092202.jpg',46),(99,'/images/product/PROD1591086130680.png',46),(104,'/images/product/PROD1591186910413.jpg',52),(105,'/images/product/PROD1591186910414.png',52),(106,'/images/product/PROD1591337209663.jpg',53),(107,'/images/product/PROD1591777736686.jpg',46),(108,'/images/product/PROD1591799193857.jpg',54),(109,'/images/product/PROD1591799286892.jpg',55),(110,'/images/product/PROD1591799286901.jpg',55),(111,'/images/product/PROD1591799286903.jpg',55),(112,'/images/product/PROD1591799286904.jpg',55),(113,'/images/product/PROD1591799340488.jpg',56),(114,'/images/product/PROD1591799340489.jpg',56),(115,'/images/product/PROD1591799340490.jpg',56),(117,'/images/product/PROD1591800343311.jpg',57),(118,'/images/product/PROD1591799436892.jpg',57),(119,'/images/product/PROD1591799480426.jpg',58),(120,'/images/product/PROD1591799480427.jpg',58),(121,'/images/product/PROD1591799480434.jpg',58),(122,'/images/product/PROD1591799508266.jpg',59),(123,'/images/product/PROD1591799548457.jpg',60),(124,'/images/product/PROD1591799548458.jpg',60),(125,'/images/product/PROD1591799606605.jpg',61),(126,'/images/product/PROD1591799606606.jpg',61),(127,'/images/product/PROD1591799606607.jpg',61),(128,'/images/product/PROD1591799606613.jpg',61),(129,'/images/product/PROD1591799606616.jpg',61),(130,'/images/product/PROD1591799672905.jpg',62),(131,'/images/product/PROD1591799672906.jpg',62),(132,'/images/product/PROD1591799672907.jpg',62),(133,'/images/product/PROD1591799672915.jpg',62),(134,'/images/product/PROD1591799672923.jpg',62),(135,'/images/product/PROD1591799729981.png',63),(136,'/images/product/PROD1591799729990.png',63),(137,'/images/product/PROD1591799729994.png',63),(138,'/images/product/PROD1591799730002.png',63),(139,'/images/product/PROD1591799730005.png',63),(140,'/images/product/PROD1591799819914.jpg',64),(141,'/images/product/PROD1591799819915.jpg',64),(142,'/images/product/PROD1591799819916.jpg',64),(143,'/images/product/PROD1591799819923.jpg',64),(144,'/images/product/PROD1591799864887.jpg',65),(145,'/images/product/PROD1591799864889.jpg',65),(146,'/images/product/PROD1591945931810.png',66),(147,'/images/product/PROD1591945931815.jpg',66),(148,'/images/product/PROD1591945931816.jpg',66),(149,'/images/product/PROD1591945971635.jpg',67),(150,'/images/product/PROD1591945971636.jpg',67),(151,'/images/product/PROD1591945971637.png',67),(152,'/images/product/PROD1591945971644.jpg',67),(153,'/images/product/PROD1591945971645.jpg',67),(154,'/images/product/PROD1591946008245.jpg',68),(155,'/images/product/PROD1591946008246.jpg',68),(156,'/images/product/PROD1591946008247.jpg',68),(157,'/images/product/PROD1591946008248.jpg',68),(158,'/images/product/PROD1591946008249.jpg',68),(159,'/images/product/PROD1591946057606.jpg',69),(160,'/images/product/PROD1591946057609.jpg',69),(161,'/images/product/PROD1591946057610.jpg',69),(162,'/images/product/PROD1591946057611.jpg',69),(163,'/images/product/PROD1591946115108.jpg',70),(164,'/images/product/PROD1591946115110.jpg',70),(165,'/images/product/PROD1591946153275.jpg',71),(166,'/images/product/PROD1591946153277.jpg',71),(167,'/images/product/PROD1591946153278.jpg',71),(168,'/images/product/PROD1591946153279.jpg',71),(169,'/images/product/PROD1591946184789.jpg',72),(170,'/images/product/PROD1591946184789.jpg',72),(171,'/images/product/PROD1591946184790.jpg',72),(172,'/images/product/PROD1591946184793.jpg',72),(173,'/images/product/PROD1591946216664.png',73),(174,'/images/product/PROD1591946216666.png',73),(175,'/images/product/PROD1591946216668.png',73),(176,'/images/product/PROD1591946216670.png',73),(177,'/images/product/PROD1591946216674.png',73),(178,'/images/product/PROD1591946236930.jpg',74),(179,'/images/product/PROD1591946267718.jpg',75),(180,'/images/product/PROD1591946267719.jpg',75),(181,'/images/product/PROD1591946295501.jpg',76),(182,'/images/product/PROD1591946295502.jpg',76),(183,'/images/product/PROD1591946384687.jpg',46);
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
  CONSTRAINT `parcel_id` FOREIGN KEY (`parcelId`) REFERENCES `parcel` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `parcel_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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
  CONSTRAINT `view_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `view_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_view`
--

LOCK TABLES `product_view` WRITE;
/*!40000 ALTER TABLE `product_view` DISABLE KEYS */;
INSERT INTO `product_view` VALUES (1,1,1),(2,2,1),(3,46,2),(4,46,6),(5,46,4),(6,46,8),(7,47,1),(8,47,7),(9,47,2),(10,47,8),(11,47,9),(12,47,4),(13,48,10),(14,48,5),(15,48,7),(16,48,3),(17,49,3),(18,49,8),(19,49,10),(20,50,9),(21,50,8),(22,50,7),(23,50,6),(24,50,5),(25,50,4),(26,50,3),(27,50,2),(28,50,1);
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
  `productName` varchar(200) NOT NULL,
  `price` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Serokan Tai',10000,0),(2,'Pasir Tai',50000,0),(3,'Obat Cacing',30000,0),(4,'Shampo kucing',25000,0),(5,'Whiskas',54000,0),(6,'Sisir Kucing',15000,0),(46,'Kaos Polo Type B / Baju Anjing / Baju Kucing / T-Shirt Anjing',35000,1),(47,'Popok anjing betina XXS Dog female diapers pampers disposable',110000,1),(48,'Repack Makanan Anjing bolt 10 kg',145000,1),(49,'Sisir Kutu Kucing Cat Flea Comb',12000,1),(50,'True Touch Pet Glove / Sarung Tangan Sisir Anjing Kucing Grooming',21000,1),(51,'Volk Pets Roller Fur & Lint Remover / Sikat Penghilang Bulu Hewan',104000,1),(52,'test cancel tengah',111111,0),(53,'1',1,0),(54,'ARTERO DOUBLE COMB 19CM',360000,1),(55,'Baju Gitar Anjing - Kostum Gitar - Baju Anjing dan Kucing - Kostum',135000,1),(56,'Baju Kaos Mantel Jaket Jumpsuit Adidog Anjing Besar Large Dog',110000,1),(57,'Cat toys stick tikus lonceng bulu - mainan kucing stick tikus lonceng',13000,1),(58,'Cat Toys Teaser - Mainan Kucing Stick Teaser Stik Kucing Anjing Musang',13500,1),(59,'Dog pet clicker peluit melatih anjing dog training clicker',15000,1),(60,'Dog Toothpaste - Sikat Pasta Gigi Odol Toothbrush Anjing Kucing Hewan',33000,1),(61,'Elizabeth Collar Corong Penutup Pelindung Anjing Kucing No.6',27500,1),(62,'Grooming Set untuk kucing bulu panjang merek Catit',720000,1),(63,'Gunting kuku anjing kucing hewan dog cat nail clipper grooming',35000,1),(64,'Gunting Kuku Kikir Kuku Anjing Kucing Kecil Merah',36000,1),(65,'Gunting kuku kucing dan anjing',20000,1),(66,'Gunting kuku murah nail clippers trimmer sugar glider kucing anjing',36000,1),(67,'Handuk Anjing Kucing MICROFIBER Pet Grooming Towel Handuk Grooming',17500,1),(68,'Handuk Anjing Kucing PET BATH PVA Pet Grooming Towel Handuk Grooming',12500,1),(69,'HEYSA X3 (Mainan Kucing, Rumah Kucing, Cat Condo, Garukan)',39000,1),(70,'Jayden Top - Pet Cat Dog Clothes Baju Kostum Anjing Hewan Kucing',65000,1),(71,'Mainan Anjing - Gigitan Anjing Tulang Karet Bergerigi Rubber Bone Chew',17000,1),(72,'Mainan Anjing Gigit untuk Membersihkan Gigi Size. S - Kd. 1360',71000,1),(73,'Mainan kucing Catit 2.0 play circuit 43154w',128000,1),(74,'M-PETS ATHLETIC BONES DOG TOY - MAINAN GIGIT ANJING BUNYI',30800,1),(75,'M-PETS FINGER TOOTHBRUSH SET CLEAN & MASSAGE  SIKAT GIGI ANJING',30800,1),(76,'M-PETS PLASTIC DOUBLE BOWLS 2X150 ML - TEMPAT MAKAN ANJING KUCING',20900,1);
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
  CONSTRAINT `stock_product_id` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,10,10),(2,2,50,50),(3,3,5,5),(4,4,12,12),(5,5,10,10),(6,6,20,20),(44,46,5,5),(45,47,4,4),(46,48,6,6),(47,49,95,95),(48,50,36,36),(49,51,45,45),(50,52,11,11),(51,53,1,1),(52,54,4,4),(53,55,10,10),(54,56,25,25),(55,57,8,8),(56,58,15,15),(57,59,5,5),(58,60,6,6),(59,61,3,3),(60,62,2,2),(61,63,30,30),(62,64,20,20),(63,65,10,10),(64,66,10,10),(65,67,50,50),(66,68,25,25),(67,69,11,11),(68,70,25,25),(69,71,5,5),(70,72,100,100),(71,73,2,2),(72,74,5,5),(73,75,10,10),(74,76,13,13);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,1,100000,1,'www.hotmail.com','2019-03-22 14:18:21',NULL),(2,2,20000,1,'www.gmail.com','2019-03-22 14:18:21',NULL),(3,3,11111,1,'www.google.com','2019-03-22 14:18:21',NULL),(4,1,11111,1,'www.bing.com','2019-03-22 14:18:21',NULL),(5,5,11111,1,'www.reddit.com','2019-03-22 14:18:21',NULL),(6,2,11111,1,'www.youtube.com','2019-03-22 14:18:21',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item`
--

LOCK TABLES `transaction_item` WRITE;
/*!40000 ALTER TABLE `transaction_item` DISABLE KEYS */;
INSERT INTO `transaction_item` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,2),(5,5,2),(6,6,2),(7,7,3),(8,8,3),(9,9,3),(10,10,4),(11,11,4),(12,12,5),(13,13,6),(14,14,6);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'susilo','susilo@gmail.com','123',2,1),(2,'bangbang','bangbang@gmail.com','123',2,1),(3,'andi','andi@gmail.com','123',2,1),(4,'daud','daudi@gmail.com','123',2,1),(5,'jaing','jaingi@gmail.com','123',2,1),(6,'wakwaw','wakwawi@gmail.com','123',2,1),(7,'yahud','yahudi@gmail.com','123',2,1),(8,'saik','saiki@gmail.com','123',2,1),(9,'mantul','mantuli@gmail.com','123',2,1),(10,'cakep','cakepi@gmail.com','123',2,1);
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

-- Dump completed on 2020-06-12 14:22:31
