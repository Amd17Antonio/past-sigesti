CREATE DATABASE  IF NOT EXISTS `sistema_solicitudes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_solicitudes`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_solicitudes
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `siglas` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `titular` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES (34,'Dirección de Tecnologías de la Información','DTI','Juan Carlos Pérez',_binary ''),(35,'Sistemas','s','Aguilar Antonio',_binary '');
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_anio_denominacion`
--

DROP TABLE IF EXISTS `cat_anio_denominacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_anio_denominacion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ejercicio` year NOT NULL,
  `denominacion` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_anio_denominacion`
--

LOCK TABLES `cat_anio_denominacion` WRITE;
/*!40000 ALTER TABLE `cat_anio_denominacion` DISABLE KEYS */;
INSERT INTO `cat_anio_denominacion` VALUES (3,2026,'Ejercicio Fiscal 2026');
/*!40000 ALTER TABLE `cat_anio_denominacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_antivirus`
--

DROP TABLE IF EXISTS `cat_antivirus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_antivirus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `antivirus` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_antivirus`
--

LOCK TABLES `cat_antivirus` WRITE;
/*!40000 ALTER TABLE `cat_antivirus` DISABLE KEYS */;
INSERT INTO `cat_antivirus` VALUES (3,'Windows Defender');
/*!40000 ALTER TABLE `cat_antivirus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_autoriza_internet`
--

DROP TABLE IF EXISTS `cat_autoriza_internet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_autoriza_internet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `cargo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'activo',
  `usuario_mov` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_autoriza_internet`
--

LOCK TABLES `cat_autoriza_internet` WRITE;
/*!40000 ALTER TABLE `cat_autoriza_internet` DISABLE KEYS */;
INSERT INTO `cat_autoriza_internet` VALUES (20,'Laura Gómez','Directora de Área','lgomez@dependencia.gob.mx','activo','admin',NULL,'2026-07-31 22:33:52');
/*!40000 ALTER TABLE `cat_autoriza_internet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_avisos`
--

DROP TABLE IF EXISTS `cat_avisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_avisos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `status` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_avisos`
--

LOCK TABLES `cat_avisos` WRITE;
/*!40000 ALTER TABLE `cat_avisos` DISABLE KEYS */;
INSERT INTO `cat_avisos` VALUES (2,'Mantenimiento programado del sistema el fin de semana',_binary '');
/*!40000 ALTER TABLE `cat_avisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_cargo`
--

DROP TABLE IF EXISTS `cat_cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_cargo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cargo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'activo',
  `usuario_mov` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_cargo`
--

LOCK TABLES `cat_cargo` WRITE;
/*!40000 ALTER TABLE `cat_cargo` DISABLE KEYS */;
INSERT INTO `cat_cargo` VALUES (66,'Jefe de Departamento','activo','admin',NULL,'2026-07-31 22:33:52');
/*!40000 ALTER TABLE `cat_cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_categoria_telefonia`
--

DROP TABLE IF EXISTS `cat_categoria_telefonia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_categoria_telefonia` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `categoria` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estatus` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_categoria_telefonia`
--

LOCK TABLES `cat_categoria_telefonia` WRITE;
/*!40000 ALTER TABLE `cat_categoria_telefonia` DISABLE KEYS */;
INSERT INTO `cat_categoria_telefonia` VALUES (1,'Directivo','Categoría para personal directivo','activo','2026-07-31 22:33:52','2026-07-31 22:33:52'),(2,'Categoría 1','Privilegios básicos','activo','2026-08-02 17:00:33',NULL),(3,'Categoría 2','Privilegios intermedios','activo','2026-08-02 17:00:33',NULL),(4,'Categoría 3','Privilegios avanzados','activo','2026-08-02 17:00:33',NULL),(5,'Categoría 4','Privilegios administrativos','activo','2026-08-02 17:00:33',NULL),(6,'Categoría 5','Intranet, Local, Celular 044, 01 800, Celular 045 — Previa justificación','activo','2026-08-12 20:45:13','2026-08-12 20:45:13'),(7,'Categoría 6','Intranet, Local, Celular 044, 01 800, Celular 045, LDN — Previa justificación','activo','2026-08-12 20:45:13','2026-08-12 20:45:13'),(8,'Categoría 7','LDI, LDM, IP fijas, Servicios especiales de datos — Previa justificación','activo','2026-08-12 20:45:13','2026-08-12 20:45:13'),(9,'Local','Solo llamadas locales','activo','2026-08-12 20:48:53','2026-08-12 20:48:53'),(10,'Nacional','Llamadas locales y de larga distancia nacional','activo','2026-08-12 20:48:53','2026-08-12 20:48:53'),(11,'Internacional','Llamadas sin restricción','activo','2026-08-12 20:48:53','2026-08-12 20:48:53');
/*!40000 ALTER TABLE `cat_categoria_telefonia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_enlace_informatico`
--

DROP TABLE IF EXISTS `cat_enlace_informatico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_enlace_informatico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enlace` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `puesto` varchar(175) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ext` int DEFAULT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_enlace_informatico`
--

LOCK TABLES `cat_enlace_informatico` WRITE;
/*!40000 ALTER TABLE `cat_enlace_informatico` DISABLE KEYS */;
INSERT INTO `cat_enlace_informatico` VALUES (3,'Pedro Sánchez','Enlace Informático','psanchez@dependencia.gob.mx',4321,'inactivo','2026-07-31 22:33:52'),(4,'L.I. Romualdo Alejandro Guzmán García','Enlace Informático',NULL,NULL,'activo','2026-08-07 23:37:27');
/*!40000 ALTER TABLE `cat_enlace_informatico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_firma_ofi_internet`
--

DROP TABLE IF EXISTS `cat_firma_ofi_internet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_firma_ofi_internet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `cargo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tipo` enum('titular','administrativo','tecnologias') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'activo',
  `usuario_mov` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_firma_ofi_internet`
--

LOCK TABLES `cat_firma_ofi_internet` WRITE;
/*!40000 ALTER TABLE `cat_firma_ofi_internet` DISABLE KEYS */;
INSERT INTO `cat_firma_ofi_internet` VALUES (4,'Laura Gómez','Directora de Área','lgomez@dependencia.gob.mx','titular','activo','admin',NULL,'2026-07-31 22:33:52');
/*!40000 ALTER TABLE `cat_firma_ofi_internet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_marca`
--

DROP TABLE IF EXISTS `cat_marca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_marca` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_marca`
--

LOCK TABLES `cat_marca` WRITE;
/*!40000 ALTER TABLE `cat_marca` DISABLE KEYS */;
INSERT INTO `cat_marca` VALUES (56,'Dell'),(57,'Hp');
/*!40000 ALTER TABLE `cat_marca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_modelo`
--

DROP TABLE IF EXISTS `cat_modelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_modelo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_marca` int DEFAULT NULL,
  `modelo` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=344 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_modelo`
--

LOCK TABLES `cat_modelo` WRITE;
/*!40000 ALTER TABLE `cat_modelo` DISABLE KEYS */;
INSERT INTO `cat_modelo` VALUES (343,56,'Latitude 5420');
/*!40000 ALTER TABLE `cat_modelo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_poa`
--

DROP TABLE IF EXISTS `cat_poa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_poa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `poa` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_poa`
--

LOCK TABLES `cat_poa` WRITE;
/*!40000 ALTER TABLE `cat_poa` DISABLE KEYS */;
INSERT INTO `cat_poa` VALUES (9,'Mantenimientos Preventivos y Correctivos a Equipos de Cómputo (Hardware Y Software) Realizados'),(10,'Asesorías Técnicas a las Diversas Áreas de la Secretaria Impartidas'),(11,'Capacitaciones Sobre el Uso de Sistemas Informáticos Impartidas'),(12,'Sistemas de Cómputo Desarrollados y/o Actualizados'),(13,'Servicios de Voz, datos y adecuaciones al portal institucional'),(14,'Estadística'),(15,'Asesorías otorgadas respecto a la funcionalidad de las plataformas de transparencia'),(16,'Soportes técnicos realizados a la operación de las plataformas de transparencia');
/*!40000 ALTER TABLE `cat_poa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_preguntas`
--

DROP TABLE IF EXISTS `cat_preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_preguntas` (
  `id` int NOT NULL,
  `pregunta` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `fecha_creacion` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_preguntas`
--

LOCK TABLES `cat_preguntas` WRITE;
/*!40000 ALTER TABLE `cat_preguntas` DISABLE KEYS */;
INSERT INTO `cat_preguntas` VALUES (1,'¿Cómo calificas el tiempo de respuesta?','2026-07-31 14:25:09',1),(2,'¿Cómo calificas la atención del técnico?','2026-07-31 14:25:09',1),(3,'¿El problema quedó resuelto satisfactoriamente?','2026-07-31 14:25:09',1);
/*!40000 ALTER TABLE `cat_preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_servicios`
--

DROP TABLE IF EXISTS `cat_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `servicio` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` int DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_servicios`
--

LOCK TABLES `cat_servicios` WRITE;
/*!40000 ALTER TABLE `cat_servicios` DISABLE KEYS */;
INSERT INTO `cat_servicios` VALUES (77,'Mantenimiento correctivo de hardware',1);
/*!40000 ALTER TABLE `cat_servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_so`
--

DROP TABLE IF EXISTS `cat_so`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_so` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sistema` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_so`
--

LOCK TABLES `cat_so` WRITE;
/*!40000 ALTER TABLE `cat_so` DISABLE KEYS */;
INSERT INTO `cat_so` VALUES (9,'Windows 11',_binary '');
/*!40000 ALTER TABLE `cat_so` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_software`
--

DROP TABLE IF EXISTS `cat_software`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_software` (
  `id` int NOT NULL AUTO_INCREMENT,
  `software` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_software`
--

LOCK TABLES `cat_software` WRITE;
/*!40000 ALTER TABLE `cat_software` DISABLE KEYS */;
INSERT INTO `cat_software` VALUES (4,'Microsoft Office 2021',1);
/*!40000 ALTER TABLE `cat_software` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_tipo_clave`
--

DROP TABLE IF EXISTS `cat_tipo_clave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_tipo_clave` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` enum('PIN','CN') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_tipo_clave`
--

LOCK TABLES `cat_tipo_clave` WRITE;
/*!40000 ALTER TABLE `cat_tipo_clave` DISABLE KEYS */;
INSERT INTO `cat_tipo_clave` VALUES (1,'PIN'),(2,'PIN'),(3,'CN');
/*!40000 ALTER TABLE `cat_tipo_clave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_tipo_equipo`
--

DROP TABLE IF EXISTS `cat_tipo_equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_tipo_equipo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TipoEquipo` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_tipo_equipo`
--

LOCK TABLES `cat_tipo_equipo` WRITE;
/*!40000 ALTER TABLE `cat_tipo_equipo` DISABLE KEYS */;
INSERT INTO `cat_tipo_equipo` VALUES (40,'Laptop'),(41,'Impresora');
/*!40000 ALTER TABLE `cat_tipo_equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comp_equipos`
--

DROP TABLE IF EXISTS `comp_equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comp_equipos` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdEquipo` int DEFAULT NULL,
  `IdArea` int DEFAULT NULL,
  `Resguardante` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Usuario` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Edificio` smallint DEFAULT NULL,
  `ENivel` char(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Puerto` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Switch` bit(1) DEFAULT NULL,
  `Mac` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Conexion` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Nivel` char(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NoTiket` int DEFAULT NULL,
  `usr` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comp_equipos`
--

LOCK TABLES `comp_equipos` WRITE;
/*!40000 ALTER TABLE `comp_equipos` DISABLE KEYS */;
INSERT INTO `comp_equipos` VALUES (215,1597,34,'María Fernanda López','mlopez',2,'1','12',_binary '','00:1A:2B:3C:4D:5E','Cableada','1',1001,'admin','2026-07-31 22:33:52');
/*!40000 ALTER TABLE `comp_equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `correo`
--

DROP TABLE IF EXISTS `correo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `correo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correo`
--

LOCK TABLES `correo` WRITE;
/*!40000 ALTER TABLE `correo` DISABLE KEYS */;
INSERT INTO `correo` VALUES (1,'soporte@dependencia.gob.mx','Soporte TI');
/*!40000 ALTER TABLE `correo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_equipos`
--

DROP TABLE IF EXISTS `datos_equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datos_equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_tipo` int DEFAULT NULL,
  `id_marca` int DEFAULT NULL,
  `id_modelo` int DEFAULT NULL,
  `id_so` int DEFAULT NULL,
  `no_serie` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `no_inventario` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mac_ethernet` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mac_wifi` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `observacion` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  `usr` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1602 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_equipos`
--

LOCK TABLES `datos_equipos` WRITE;
/*!40000 ALTER TABLE `datos_equipos` DISABLE KEYS */;
INSERT INTO `datos_equipos` VALUES (1597,40,56,343,9,'SN-2026-0001','INV-2026-0001','00:1A:2B:3C:4D:5E','00:1A:2B:3C:4D:5F','Equipo asignado a Dirección de TI',_binary '','admin','2026-07-31 22:33:52'),(1598,40,56,343,9,'12355322','1111',NULL,'00:1A:2B:3C:4D:5E',NULL,_binary '','admin','2026-08-07 23:42:58'),(1599,40,56,343,9,'12355322','111',NULL,'00:1A:2B:3C:4D:5E',NULL,_binary '','admin','2026-08-07 22:28:42'),(1600,40,56,343,9,'12355322','11111',NULL,NULL,NULL,_binary '','admin','2026-08-02 12:40:52'),(1601,40,56,343,9,'123553211','123','01:A2:B3:C4:D5:05',NULL,NULL,_binary '','admin','2026-08-11 21:38:26');
/*!40000 ALTER TABLE `datos_equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dictamen`
--

DROP TABLE IF EXISTS `dictamen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dictamen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int DEFAULT NULL,
  `ejercicio` int DEFAULT NULL,
  `fecha_dictamen` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `id_equipo` int DEFAULT NULL,
  `folio` int DEFAULT NULL,
  `servicio` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `dictamen` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `expediente` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `copias` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fallas` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tipo_falla` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `sugiere_baja` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_solicitud` (`id_solicitud`,`ejercicio`,`folio`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2361 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictamen`
--

LOCK TABLES `dictamen` WRITE;
/*!40000 ALTER TABLE `dictamen` DISABLE KEYS */;
INSERT INTO `dictamen` VALUES (2330,17521,2026,'2026-07-31 06:00:00',1597,1,'Mantenimiento correctivo de hardware','Se realizó cambio de fuente de poder','EXP-2026-001','2','Fuente de poder dañada','HW',1),(2331,17574,2026,'2026-08-04 02:46:23',NULL,2,'Servicio de mantenimiento preventivo #1','Dictamen de prueba número 1: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-001','1',NULL,'N/A',0),(2332,17575,2026,'2026-08-04 02:46:23',NULL,3,'Servicio de mantenimiento preventivo #2','Dictamen de prueba número 2: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-002','1',NULL,'N/A',0),(2333,17576,2026,'2026-08-04 02:46:23',NULL,4,'Servicio de mantenimiento preventivo #3','Dictamen de prueba número 3: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-003','1',NULL,'N/A',0),(2334,17577,2026,'2026-08-04 02:46:23',NULL,5,'Servicio de mantenimiento preventivo #4','Dictamen de prueba número 4: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-004','1',NULL,'N/A',0),(2335,17578,2026,'2026-08-04 02:46:23',NULL,6,'Servicio de mantenimiento preventivo #5','Dictamen de prueba número 5: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-005','1',NULL,'N/A',0),(2336,17579,2026,'2026-08-04 02:46:23',NULL,7,'Servicio de mantenimiento preventivo #6','Dictamen de prueba número 6: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-006','1',NULL,'N/A',0),(2337,17580,2026,'2026-08-04 02:46:23',NULL,8,'Servicio de mantenimiento preventivo #7','Dictamen de prueba número 7: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-007','1',NULL,'N/A',0),(2338,17581,2026,'2026-08-04 02:46:23',NULL,9,'Servicio de mantenimiento preventivo #8','Dictamen de prueba número 8: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-008','1',NULL,'N/A',0),(2339,17582,2026,'2026-08-04 02:46:23',NULL,10,'Servicio de mantenimiento preventivo #9','Dictamen de prueba número 9: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-009','1',NULL,'N/A',0),(2340,17583,2026,'2026-08-04 02:46:23',NULL,11,'Servicio de mantenimiento preventivo #10','Dictamen de prueba número 10: el equipo funciona correctamente después del servicio.','EXP-2026-TEST-010','1',NULL,'N/A',0),(2346,17589,2026,'2026-08-04 03:00:56',NULL,12,'Servicio de mantenimiento preventivo POA #1','Dictamen de prueba POA número 1: equipo revisado y funcionando correctamente.','EXP-POA-2026-001','1',NULL,'N/A',0),(2347,17590,2026,'2026-08-04 03:00:56',NULL,13,'Servicio de mantenimiento preventivo POA #2','Dictamen de prueba POA número 2: equipo revisado y funcionando correctamente.','EXP-POA-2026-002','1',NULL,'N/A',0),(2348,17591,2026,'2026-08-04 03:00:56',NULL,14,'Servicio de mantenimiento preventivo POA #3','Dictamen de prueba POA número 3: equipo revisado y funcionando correctamente.','EXP-POA-2026-003','1',NULL,'N/A',0),(2349,17592,2026,'2026-08-04 03:00:56',NULL,15,'Servicio de mantenimiento preventivo POA #4','Dictamen de prueba POA número 4: equipo revisado y funcionando correctamente.','EXP-POA-2026-004','1',NULL,'N/A',0),(2350,17593,2026,'2026-08-04 03:00:56',NULL,16,'Servicio de mantenimiento preventivo POA #5','Dictamen de prueba POA número 5: equipo revisado y funcionando correctamente.','EXP-POA-2026-005','1',NULL,'N/A',0),(2353,17604,2026,'2026-08-04 03:09:49',NULL,17,'Servicio de mantenimiento preventivo POA cerrado #1','Dictamen de prueba POA cerrado número 1: equipo revisado y funcionando correctamente.','EXP-POA2-2026-001','1',NULL,'N/A',0),(2354,17605,2026,'2026-08-04 03:09:49',NULL,18,'Servicio de mantenimiento preventivo POA cerrado #2','Dictamen de prueba POA cerrado número 2: equipo revisado y funcionando correctamente.','EXP-POA2-2026-002','1',NULL,'N/A',0),(2355,17606,2026,'2026-08-04 03:09:49',NULL,19,'Servicio de mantenimiento preventivo POA cerrado #3','Dictamen de prueba POA cerrado número 3: equipo revisado y funcionando correctamente.','EXP-POA2-2026-003','1',NULL,'N/A',0),(2356,17607,2026,'2026-08-04 03:09:49',NULL,20,'Servicio de mantenimiento preventivo POA cerrado #4','Dictamen de prueba POA cerrado número 4: equipo revisado y funcionando correctamente.','EXP-POA2-2026-004','1',NULL,'N/A',0),(2357,17608,2026,'2026-08-03 06:00:00',NULL,21,'Servicio de mantenimiento preventivo POA cerrado #5','Dictamen de prueba POA cerrado número 5: equipo revisado y funcionando correctamente.','EXP-POA2-2026-005','1','dsdxfft,drmmdmnv','N/A',1),(2358,17620,2026,'2026-08-14 04:09:50',NULL,22,'Chec','se va para baja','sdsttud','1','fdsyfuiy','No sirve',1),(2359,17619,2026,'2026-08-15 10:39:37',1599,23,'dat','gxgernxn','EXP-POA2-2026-007',NULL,'ewretrye','No sirve',1),(2360,17631,2026,'2026-08-15 10:49:27',NULL,24,'Falla','14225522','EXP-POA2-2026-00888','1','etryetr','feett',1);
/*!40000 ALTER TABLE `dictamen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encuesta`
--

DROP TABLE IF EXISTS `encuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuesta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int DEFAULT NULL,
  `id_pregunta` int DEFAULT NULL,
  `tipo_respuesta` enum('B','R','M') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `observaciones` text,
  `usuario` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encuesta`
--

LOCK TABLES `encuesta` WRITE;
/*!40000 ALTER TABLE `encuesta` DISABLE KEYS */;
INSERT INTO `encuesta` VALUES (1,17521,1,'B',NULL,'mlopez','2026-07-31 16:33:52'),(2,17571,1,'R',NULL,'usuario','2026-08-05 00:06:24'),(3,17571,2,'B',NULL,'usuario','2026-08-05 00:06:24'),(4,17571,3,'B',NULL,'usuario','2026-08-05 00:06:24');
/*!40000 ALTER TABLE `encuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_solicitud`
--

DROP TABLE IF EXISTS `equipos_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_solicitud` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int DEFAULT NULL,
  `id_equipo` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2979 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_solicitud`
--

LOCK TABLES `equipos_solicitud` WRITE;
/*!40000 ALTER TABLE `equipos_solicitud` DISABLE KEYS */;
INSERT INTO `equipos_solicitud` VALUES (2966,17521,1597),(2967,17574,1597),(2968,17575,1598),(2969,17576,1599),(2970,17577,1600),(2971,17578,1597),(2972,17579,1598),(2973,17580,1599),(2974,17581,1600),(2975,17582,1597),(2976,17583,1598),(2977,17608,1598),(2978,17619,1599);
/*!40000 ALTER TABLE `equipos_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ip_usuario`
--

DROP TABLE IF EXISTS `ip_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ip_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_soporte` int DEFAULT NULL,
  `ip` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ip_usuario`
--

LOCK TABLES `ip_usuario` WRITE;
/*!40000 ALTER TABLE `ip_usuario` DISABLE KEYS */;
INSERT INTO `ip_usuario` VALUES (19,27,'192.168.1.60');
/*!40000 ALTER TABLE `ip_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jefe_secretaria`
--

DROP TABLE IF EXISTS `jefe_secretaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jefe_secretaria` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jefe_id` bigint unsigned NOT NULL,
  `secretaria_id` bigint unsigned NOT NULL,
  `mismos_privilegios` tinyint(1) DEFAULT '0',
  `observaciones` text,
  `estatus` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jefe_id` (`jefe_id`),
  KEY `secretaria_id` (`secretaria_id`),
  CONSTRAINT `jefe_secretaria_ibfk_1` FOREIGN KEY (`jefe_id`) REFERENCES `usuarios_telefonia` (`id`),
  CONSTRAINT `jefe_secretaria_ibfk_2` FOREIGN KEY (`secretaria_id`) REFERENCES `usuarios_telefonia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jefe_secretaria`
--

LOCK TABLES `jefe_secretaria` WRITE;
/*!40000 ALTER TABLE `jefe_secretaria` DISABLE KEYS */;
INSERT INTO `jefe_secretaria` VALUES (1,1,2,1,'Acceso compartido a correo institucional del jefe','activo','2026-07-31 22:33:52','2026-07-31 22:33:52'),(2,13,11,1,NULL,'activo','2026-08-13 04:05:23',NULL),(3,12,11,1,NULL,'activo','2026-08-13 04:14:56',NULL),(4,12,11,1,NULL,'activo','2026-08-13 04:18:32',NULL),(5,12,11,1,NULL,'activo','2026-08-13 04:19:02',NULL),(6,12,11,0,'dwdfaes','activo','2026-08-13 04:21:37',NULL),(7,12,11,1,NULL,'activo','2026-08-13 04:31:26',NULL);
/*!40000 ALTER TABLE `jefe_secretaria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mantenimientos`
--

DROP TABLE IF EXISTS `mantenimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mantenimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_equipo` int NOT NULL,
  `fecha_mantenimiento` date NOT NULL,
  `proxima_fecha` date DEFAULT NULL,
  `tipo` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `usr` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_mant_equipo_proxima` (`id_equipo`,`proxima_fecha`) USING BTREE,
  CONSTRAINT `mantenimientos_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `datos_equipos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenimientos`
--

LOCK TABLES `mantenimientos` WRITE;
/*!40000 ALTER TABLE `mantenimientos` DISABLE KEYS */;
INSERT INTO `mantenimientos` VALUES (1,1597,'2026-08-03','2027-02-03','Preventivo','Limpieza y revisión general','admin','2026-08-04 02:37:10');
/*!40000 ALTER TABLE `mantenimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2026_07_30_211805_create_personal_access_tokens_table',1),(2,'2026_08_03_000001_add_baja_to_solicitud_table',2),(3,'2026_08_04_000001_add_observaciones_to_encuesta_table',3),(4,'2026_08_06_000001_add_fecha_autoriza_tecnico_to_solicitud',4),(5,'2026_08_11_000001_add_fechas_estatus_solicitudes_telefonia',5),(6,'2026_08_11_000002_add_fechas_estatus_vpn_correo',6),(7,'2026_08_11_000003_alinear_estatus_telefonia_vpn_correo',7),(8,'2026_08_12_060720_create_cache_table',7),(9,'2026_08_12_000004_add_campos_activacion_telefonia',8),(10,'2026_08_13_000001_add_extension_a_solicitud_correo',9),(11,'2026_08_14_000001_add_detalle_y_clave_telefonia',10),(12,'2026_08_13_000002_permitir_ambos_tipo_acceso_vpn',11);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `rol_destino` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_usuario_destino` int DEFAULT NULL,
  `id_referencia` int DEFAULT NULL,
  `titulo` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mensaje` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `url` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_notif_rol` (`rol_destino`) USING BTREE,
  KEY `idx_notif_usuario` (`id_usuario_destino`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,'mantenimiento','Administrador',NULL,1597,'Mantenimiento rojo: equipo INV-2026-0001','Sin mantenimiento registrado','/mantenimiento','2026-08-04 07:45:35'),(2,'mantenimiento','Administrador',NULL,1598,'Mantenimiento rojo: equipo 1111','Sin mantenimiento registrado','/mantenimiento','2026-08-04 07:45:35'),(3,'mantenimiento','Administrador',NULL,1599,'Mantenimiento rojo: equipo 111','Sin mantenimiento registrado','/mantenimiento','2026-08-04 07:45:35'),(4,'mantenimiento','Administrador',NULL,1600,'Mantenimiento rojo: equipo 11111','Sin mantenimiento registrado','/mantenimiento','2026-08-04 07:45:35'),(5,'mantenimiento','Administrador',NULL,1598,'Mantenimiento rojo: equipo 1111','Sin mantenimiento registrado','/mantenimiento','2026-08-13 05:12:47'),(6,'mantenimiento','Administrador',NULL,1599,'Mantenimiento rojo: equipo 111','Sin mantenimiento registrado','/mantenimiento','2026-08-13 05:12:47'),(7,'mantenimiento','Administrador',NULL,1600,'Mantenimiento rojo: equipo 11111','Sin mantenimiento registrado','/mantenimiento','2026-08-13 05:12:47'),(8,'mantenimiento','Administrador',NULL,1601,'Mantenimiento rojo: equipo 123','Sin mantenimiento registrado','/mantenimiento','2026-08-13 05:12:47'),(9,'mantenimiento','Administrador',NULL,1598,'Mantenimiento rojo: equipo 1111','Sin mantenimiento registrado','/mantenimiento','2026-08-15 04:32:47'),(10,'mantenimiento','Administrador',NULL,1599,'Mantenimiento rojo: equipo 111','Sin mantenimiento registrado','/mantenimiento','2026-08-15 04:32:47'),(11,'mantenimiento','Administrador',NULL,1600,'Mantenimiento rojo: equipo 11111','Sin mantenimiento registrado','/mantenimiento','2026-08-15 04:32:47'),(12,'mantenimiento','Administrador',NULL,1601,'Mantenimiento rojo: equipo 123','Sin mantenimiento registrado','/mantenimiento','2026-08-15 04:32:47'),(13,'solicitud','Administrador',NULL,17628,'Nueva solicitud de Solicitante POA 4','w4e5re67t','/pendientes','2026-08-15 09:14:55'),(14,'solicitud','Capturista',NULL,17628,'Nueva solicitud de Solicitante POA 4','w4e5re67t','/pendientes','2026-08-15 09:14:55'),(15,'solicitud','Soporte Técnico',NULL,17628,'Nueva solicitud de Solicitante POA 4','w4e5re67t','/pendientes','2026-08-15 09:14:55'),(16,'solicitud','Administrador',NULL,17629,'Nueva solicitud de Solicitante POA 5','restdytu yoooooooooooooooo','/pendientes','2026-08-15 09:37:56'),(17,'solicitud','Capturista',NULL,17629,'Nueva solicitud de Solicitante POA 5','restdytu yoooooooooooooooo','/pendientes','2026-08-15 09:37:56'),(18,'solicitud','Soporte Técnico',NULL,17629,'Nueva solicitud de Solicitante POA 5','restdytu yoooooooooooooooo','/pendientes','2026-08-15 09:37:56'),(19,'solicitud','Administrador',NULL,17630,'Nueva solicitud de Antonio Méndez ddd','dsgdtfygh','/pendientes','2026-08-15 09:45:12'),(20,'solicitud','Capturista',NULL,17630,'Nueva solicitud de Antonio Méndez ddd','dsgdtfygh','/pendientes','2026-08-15 09:45:12'),(21,'solicitud','Soporte Técnico',NULL,17630,'Nueva solicitud de Antonio Méndez ddd','dsgdtfygh','/pendientes','2026-08-15 09:45:12');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones_leidas`
--

DROP TABLE IF EXISTS `notificaciones_leidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones_leidas` (
  `id_notificacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notificacion`,`id_usuario`) USING BTREE,
  CONSTRAINT `fk_notif_leida` FOREIGN KEY (`id_notificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones_leidas`
--

LOCK TABLES `notificaciones_leidas` WRITE;
/*!40000 ALTER TABLE `notificaciones_leidas` DISABLE KEYS */;
INSERT INTO `notificaciones_leidas` VALUES (1,82,'2026-08-15 04:32:50'),(2,82,'2026-08-15 04:32:50'),(3,82,'2026-08-15 04:32:50'),(4,82,'2026-08-15 04:32:50'),(5,82,'2026-08-15 04:32:50'),(6,82,'2026-08-15 04:32:50'),(7,82,'2026-08-15 04:32:50'),(8,82,'2026-08-15 04:32:50'),(9,82,'2026-08-15 04:32:50'),(10,82,'2026-08-15 04:32:50'),(11,82,'2026-08-15 04:32:50'),(12,82,'2026-08-15 04:32:50');
/*!40000 ALTER TABLE `notificaciones_leidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Usuario',77,'auth_token','00a74a5c0142981f13ac5c38b82be8744fe62f86a54bb7c3f119c78c1d6deecf','[\"*\"]','2026-08-01 13:00:31',NULL,'2026-07-31 03:21:20','2026-08-01 13:00:31'),(2,'App\\Models\\Usuario',77,'auth_token','3f56790edef82ace21aa8a95fa4fc5f92b0bf1bdea4b01a789a02e9360800d1a','[\"*\"]','2026-07-31 03:22:21',NULL,'2026-07-31 03:22:20','2026-07-31 03:22:21'),(3,'App\\Models\\Usuario',78,'auth_token','bf9381367ef1c4f617070e560441ba4d2ed4bfd1a5b3f1b269e864735f3cc00f','[\"*\"]','2026-07-31 03:22:36',NULL,'2026-07-31 03:22:35','2026-07-31 03:22:36'),(4,'App\\Models\\Usuario',77,'auth_token','5c0b32798f7a8ff139f298901628668ff2af607032b982645d37997248d3195b','[\"*\"]','2026-07-31 04:37:06',NULL,'2026-07-31 03:47:47','2026-07-31 04:37:06'),(5,'App\\Models\\Usuario',77,'auth_token','e4452eec757865b7623c44fd2147f329c18daf88f5cf5bdb6b3042862028dae2','[\"*\"]','2026-08-01 02:33:41',NULL,'2026-08-01 02:33:38','2026-08-01 02:33:41'),(6,'App\\Models\\Usuario',77,'auth_token','bdf1a4a5e3a9b56cace55b714da1b243114c505466d4966326bba4b1b9d5237a','[\"*\"]','2026-08-01 02:33:55',NULL,'2026-08-01 02:33:40','2026-08-01 02:33:55'),(7,'App\\Models\\Usuario',78,'auth_token','26e8b7a1b729fd0d266416c1a6cbdd30f90b5bb769dce398b877ca82df2723b5','[\"*\"]','2026-08-01 02:34:22',NULL,'2026-08-01 02:34:14','2026-08-01 02:34:22'),(8,'App\\Models\\Usuario',79,'auth_token','2598a54f160eaebd47747e08904c3d45e7b4ae7abe81343d4bbf5fd56f7f23ba','[\"*\"]','2026-08-01 02:35:18',NULL,'2026-08-01 02:34:46','2026-08-01 02:35:18'),(9,'App\\Models\\Usuario',80,'auth_token','e6fb5d8ce75770b6850fd46455c512efc74ea3915d86bc0784ab115fd58c13bb','[\"*\"]','2026-08-01 03:49:59',NULL,'2026-08-01 02:35:31','2026-08-01 03:49:59'),(10,'App\\Models\\Usuario',77,'auth_token','c685254d28c1d607e9af5d3a9e17cd84a4525170e366a575a76eda30af3faa44','[\"*\"]','2026-08-01 04:34:40',NULL,'2026-08-01 04:29:02','2026-08-01 04:34:40'),(11,'App\\Models\\Usuario',77,'auth_token','9061932f2301daa9c85210d68c2f2bb37fa71441043483daa3ad00823d0a53db','[\"*\"]','2026-08-01 04:35:05',NULL,'2026-08-01 04:34:46','2026-08-01 04:35:05'),(12,'App\\Models\\Usuario',79,'auth_token','ae35f22a4d5d0d59824726b92681a999d9971f95bedc6cec9b3607def277b955','[\"*\"]','2026-08-01 04:35:16',NULL,'2026-08-01 04:35:10','2026-08-01 04:35:16'),(13,'App\\Models\\Usuario',78,'auth_token','25c46aeb35e3e19f6e5d9b2e4cd77641c0e851786b94d673b00f669af4395e05','[\"*\"]','2026-08-01 04:35:25',NULL,'2026-08-01 04:35:24','2026-08-01 04:35:25'),(14,'App\\Models\\Usuario',78,'auth_token','bc23805a1125fbbb97a0d8628a85e81f887e8a728cf0b64bce880a2dd19d4578','[\"*\"]','2026-08-01 04:35:46',NULL,'2026-08-01 04:35:24','2026-08-01 04:35:46'),(35,'App\\Models\\Usuario',77,'auth_token','e9fc29e7e774f2828e663f46d6757d88b3d3d09d42d61606271376a6609c2c94','[\"*\"]','2026-08-01 07:27:04',NULL,'2026-08-01 07:27:02','2026-08-01 07:27:04'),(38,'App\\Models\\Usuario',78,'auth_token','aa140e41c600f04fe7e1e1d480bc5c7992eae3a921ad9b1ba46b901b013d813e','[\"*\"]','2026-08-01 07:45:25',NULL,'2026-08-01 07:35:25','2026-08-01 07:45:25'),(39,'App\\Models\\Usuario',77,'auth_token','d230eff7fc598ae5d006ece6feb7a465f6d70e501e4f4a7810cc46425bcd0d5e','[\"*\"]','2026-08-01 12:45:02',NULL,'2026-08-01 12:44:49','2026-08-01 12:45:02'),(49,'App\\Models\\Usuario',77,'auth_token','22b5c46550de3ebbac583e8fecad5d2b2f0f73d0b3df374f9e11cca23517f9ed','[\"*\"]','2026-08-01 13:49:17',NULL,'2026-08-01 13:19:39','2026-08-01 13:49:17'),(50,'App\\Models\\Usuario',77,'auth_token','e29c400529c11f35a935f489f21ff2e9ec2d791e29a748e92211650441c8b828','[\"*\"]','2026-08-02 13:15:29',NULL,'2026-08-02 12:18:38','2026-08-02 13:15:29'),(51,'App\\Models\\Usuario',77,'auth_token','0df83430d0d1a194050f5649766e8a217d688c2f06138a53a83a3f39cb6296c7','[\"*\"]','2026-08-02 22:52:44',NULL,'2026-08-02 22:52:41','2026-08-02 22:52:44'),(54,'App\\Models\\Usuario',77,'auth_token','157c50aa9daedefa815726b5e15c727c10beb1ddb20468c3a80d90193c86cc42','[\"*\"]','2026-08-02 23:19:18',NULL,'2026-08-02 23:19:16','2026-08-02 23:19:18'),(55,'App\\Models\\Usuario',77,'auth_token','9afa2ab96e1a0a7a18312bbc259b4d145a9ba416d0b717b64981e09434e6f017','[\"*\"]','2026-08-02 23:19:35',NULL,'2026-08-02 23:19:17','2026-08-02 23:19:35'),(56,'App\\Models\\Usuario',77,'auth_token','21066e6373bcea76f18bcb6c1d47c85d4398ae9359ca0979a9fd517a72ca280a','[\"*\"]','2026-08-03 10:23:57',NULL,'2026-08-03 10:23:53','2026-08-03 10:23:57'),(59,'App\\Models\\Usuario',78,'auth_token','6dc4794ae0cde8cdfc101e4dfb914e90f62bfca27998382a212e1df03c2ab7e0','[\"*\"]','2026-08-03 11:52:44',NULL,'2026-08-03 11:52:42','2026-08-03 11:52:44'),(66,'App\\Models\\Usuario',77,'auth_token','7778ece3278318ae9ece9315430cd02f2eb667e960c6fa7e95973f339268ff11','[\"*\"]','2026-08-03 14:04:20',NULL,'2026-08-03 14:04:18','2026-08-03 14:04:20'),(69,'App\\Models\\Usuario',77,'auth_token','1d51961f1074769ab42f6edcb8b4e33650d157d5c533b54ef2928de093c2d515','[\"*\"]','2026-08-03 14:15:22',NULL,'2026-08-03 14:15:20','2026-08-03 14:15:22'),(76,'App\\Models\\Usuario',77,'auth_token','3a3a3f6eba8824b76eea8e02c03ad96873b32877ad95bc188aff1f5443028840','[\"*\"]',NULL,NULL,'2026-08-03 14:58:46','2026-08-03 14:58:46'),(77,'App\\Models\\Usuario',77,'auth_token','3764689e36ff891decb9dabe2635a5b3cf6e9698b0d28779b0d349eb37f214a9','[\"*\"]','2026-08-03 15:00:09',NULL,'2026-08-03 14:59:48','2026-08-03 15:00:09'),(81,'App\\Models\\Usuario',77,'auth_token','661089054e88599d35de01c4518672eb9a1f2155f6afac3ab465c072c36b3456','[\"*\"]','2026-08-04 01:12:09',NULL,'2026-08-04 01:12:06','2026-08-04 01:12:09'),(82,'App\\Models\\Usuario',77,'auth_token','deab0eac1f8ce515967aac6e53e1797ececb69cc694633ff97b69fe544901311','[\"*\"]',NULL,NULL,'2026-08-04 01:12:07','2026-08-04 01:12:07'),(93,'App\\Models\\Usuario',77,'auth_token','db059936bdd8aa43dc26fb1117ea28e21044bda4acfe6e7f9e7fdc3cc567bbc2','[\"*\"]','2026-08-04 03:48:28',NULL,'2026-08-04 03:45:44','2026-08-04 03:48:28'),(107,'App\\Models\\Usuario',77,'auth_token','74da9c8c6e5118ef15ed460253d1d2f3eb6ba8952b7a91fc9138c92335d4f010','[\"*\"]','2026-08-04 06:00:13',NULL,'2026-08-04 05:19:52','2026-08-04 06:00:13'),(108,'App\\Models\\Usuario',77,'auth_token','a3b56bc15314104d8fed71e9b554c65fcc964cfc98391b29540f83fed4a6411a','[\"*\"]','2026-08-04 07:02:13',NULL,'2026-08-04 07:01:35','2026-08-04 07:02:13'),(109,'App\\Models\\Usuario',77,'auth_token','ec8a426f8c53ad990b2adce6bfcaaf235ab09682b150095e16fee5c1a04ab03c','[\"*\"]','2026-08-04 07:02:17',NULL,'2026-08-04 07:01:42','2026-08-04 07:02:17'),(110,'App\\Models\\Usuario',77,'auth_token','fd35777b914c3e690e6fbaba601209810c8946c86125bf97f83af749c8d314e4','[\"*\"]','2026-08-04 07:02:30',NULL,'2026-08-04 07:01:43','2026-08-04 07:02:30'),(111,'App\\Models\\Usuario',77,'auth_token','59271d0cf7da8861babd213a1c832657ed144d1788086e31b11684b0bcf24f4a','[\"*\"]','2026-08-04 07:02:55',NULL,'2026-08-04 07:02:43','2026-08-04 07:02:55'),(112,'App\\Models\\Usuario',77,'auth_token','c9ceb319b6caa0909e8a25e16d338f76d2e4e59973209c5d15422ac9d0b72bb0','[\"*\"]','2026-08-04 07:03:01',NULL,'2026-08-04 07:02:44','2026-08-04 07:03:01'),(126,'App\\Models\\Usuario',79,'auth_token','7bb45de254870aa3ec3185d457969972754e1a507af2069431ed53d935e959d3','[\"*\"]','2026-08-05 01:57:11',NULL,'2026-08-05 01:57:07','2026-08-05 01:57:11'),(142,'App\\Models\\Usuario',78,'auth_token','1d1be95bc6fe640a77c544b99a42cfc8973de1d115dc37c091ad90e01bf424a6','[\"*\"]','2026-08-06 03:22:21',NULL,'2026-08-06 03:22:19','2026-08-06 03:22:21'),(146,'App\\Models\\Usuario',81,'auth_token','23fd49adf51582013af51bc46f67dfa3136af7b49158f296d2cf5c8a7f93f0f1','[\"*\"]','2026-08-07 00:49:36',NULL,'2026-08-07 00:49:31','2026-08-07 00:49:36'),(147,'App\\Models\\Usuario',81,'auth_token','7ac6cb8b1bf9fe8de45ba17b9a92feeed6e02e47386b500689f861f2767d5c29','[\"*\"]',NULL,NULL,'2026-08-07 00:49:34','2026-08-07 00:49:34'),(148,'App\\Models\\Usuario',81,'auth_token','aa21ec14f47c2c364e3a79b52d3e090b9845568c9539f600954e2023f14533c3','[\"*\"]','2026-08-07 00:49:48',NULL,'2026-08-07 00:49:34','2026-08-07 00:49:48'),(149,'App\\Models\\Usuario',77,'auth_token','e757aa12dad13afba1d4372585c807afd6608031199b5aede9fc96af9a50a7d9','[\"*\"]','2026-08-07 03:14:46',NULL,'2026-08-07 03:14:42','2026-08-07 03:14:46'),(152,'App\\Models\\Usuario',77,'auth_token','dad382957fc2ce040df4ce4acd33b0728bb2d888d35b43958575eb514a735e79','[\"*\"]','2026-08-07 06:02:04',NULL,'2026-08-07 06:02:01','2026-08-07 06:02:04'),(155,'App\\Models\\Usuario',78,'auth_token','f58f6bb210c07a6ae6d62e6eb1bc3c14e74382366776dc4b6d59986852b487f1','[\"*\"]','2026-08-07 08:00:20',NULL,'2026-08-07 07:35:59','2026-08-07 08:00:20'),(156,'App\\Models\\Usuario',77,'auth_token','aacfc6350a2eadd0283fd73bd081ca9e4ce9c151dee237f4833bad53c27ef312','[\"*\"]','2026-08-08 01:15:01',NULL,'2026-08-08 01:14:56','2026-08-08 01:15:01'),(157,'App\\Models\\Usuario',77,'auth_token','273b325716fa0313e9b79fb79c5196616912600b27cc0ebbb288e56eccf6dc58','[\"*\"]',NULL,NULL,'2026-08-08 01:14:59','2026-08-08 01:14:59'),(159,'App\\Models\\Usuario',82,'auth_token','e6680b7d82b322b5c5a822791ee0528e798d4b1ff3cf89613c9cc94e73d4fe2a','[\"*\"]','2026-08-08 05:09:05',NULL,'2026-08-08 01:27:26','2026-08-08 05:09:05'),(160,'App\\Models\\Usuario',77,'auth_token','e62297004766421e7da878ce3db524e49c055c3084943d72f3d5362cfcc864db','[\"*\"]','2026-08-08 05:43:33',NULL,'2026-08-08 05:09:40','2026-08-08 05:43:33'),(161,'App\\Models\\Usuario',77,'auth_token','93055256d727cba79227202908f8ace5a9fa11810e03de2f2a20bb9d9bd64ad1','[\"*\"]','2026-08-11 05:24:50',NULL,'2026-08-11 05:24:45','2026-08-11 05:24:50'),(162,'App\\Models\\Usuario',77,'auth_token','e5a94be6178ac45befc4692d7f46bdd32dec957d84d4be7fabb28151a0e8c2ac','[\"*\"]',NULL,NULL,'2026-08-11 05:24:48','2026-08-11 05:24:48'),(167,'App\\Models\\Usuario',78,'auth_token','84881b087c340c92eb038eebac280d42f03290bd5af70aba9b5bb5a195a93e64','[\"*\"]','2026-08-11 05:40:53',NULL,'2026-08-11 05:40:50','2026-08-11 05:40:53'),(170,'App\\Models\\Usuario',81,'auth_token','06db54cf5c90fb968deadc3df85f49e3443ea106ca731fe525f026a43bc8b050','[\"*\"]','2026-08-11 05:43:25',NULL,'2026-08-11 05:43:24','2026-08-11 05:43:25'),(171,'App\\Models\\Usuario',81,'auth_token','68e24e9301979d6ce5f5f336fe89dec755cf78dcd56dc3028bcbe85bbce14fd8','[\"*\"]',NULL,NULL,'2026-08-11 05:54:07','2026-08-11 05:54:07'),(172,'App\\Models\\Usuario',81,'auth_token','7c8eec8d46bda67c31da9bd605b1004e2a77175ca3d832feb52f8018ece9d1be','[\"*\"]',NULL,NULL,'2026-08-11 05:54:14','2026-08-11 05:54:14'),(176,'App\\Models\\Usuario',81,'auth_token','1a51c04cc819c18d11cb012450fe8d28da172b81f2c50a0e206c142df9fb16a9','[\"*\"]',NULL,NULL,'2026-08-11 05:55:14','2026-08-11 05:55:14'),(177,'App\\Models\\Usuario',81,'auth_token','910ed0be3bea2856c4651cd1ad87c4c98838fe9a38486cad33efc966fd97071d','[\"*\"]','2026-08-11 05:58:41',NULL,'2026-08-11 05:58:39','2026-08-11 05:58:41'),(178,'App\\Models\\Usuario',81,'auth_token','8b8c718def9f79dd07bdda662904b9eed897e2a91d61c8939f3f3ac674b9f840','[\"*\"]','2026-08-11 05:58:45',NULL,'2026-08-11 05:58:39','2026-08-11 05:58:45'),(179,'App\\Models\\Usuario',79,'auth_token','a06d71cbbc166663d449e597ececbe8e990842ef969d149520b5777ba2750a3c','[\"*\"]','2026-08-11 06:25:32',NULL,'2026-08-11 06:25:30','2026-08-11 06:25:32'),(181,'App\\Models\\Usuario',77,'auth_token','3622951e7b74b204d5d712c6bbef140e046672289d038b66d9a5496f9b250b91','[\"*\"]','2026-08-11 07:35:07',NULL,'2026-08-11 06:38:20','2026-08-11 07:35:07'),(188,'App\\Models\\Usuario',82,'auth_token','38717db7db882100e0fed833c2106f21bf5d4c82432e43f7c323d9e40bfded5c','[\"*\"]','2026-08-12 13:12:52',NULL,'2026-08-12 06:32:38','2026-08-12 13:12:52'),(189,'App\\Models\\Usuario',77,'auth_token','d49841f14a6285ec75de53f7d34808281fa8eda8e68c12a73615e7e4278fc480','[\"*\"]','2026-08-12 12:44:18',NULL,'2026-08-12 12:37:30','2026-08-12 12:44:18'),(190,'App\\Models\\Usuario',82,'auth_token','3286cde265be3844e27deafa49045b2f8340ea122644fdbebbe5c7cc5760aedf','[\"*\"]',NULL,NULL,'2026-08-13 01:52:56','2026-08-13 01:52:56'),(191,'App\\Models\\Usuario',82,'auth_token','fa7008664cc0a21a407da2e74fcdc829f4d4e056603ba4ef502e1a9936201f92','[\"*\"]','2026-08-13 01:53:01',NULL,'2026-08-13 01:52:57','2026-08-13 01:53:01'),(192,'App\\Models\\Usuario',82,'auth_token','1d57cc929a42f4543122b5d21a180968382b936761c14a7f5946556590c90c41','[\"*\"]','2026-08-13 05:31:33',NULL,'2026-08-13 01:52:59','2026-08-13 05:31:33'),(193,'App\\Models\\Usuario',82,'auth_token','62b1598cbe626e9a7f019df756d3b75394282ad183c899516609b5c20108bf02','[\"*\"]','2026-08-13 10:36:37',NULL,'2026-08-13 10:36:33','2026-08-13 10:36:37'),(194,'App\\Models\\Usuario',82,'auth_token','17e09dbc19e2c7ee31e69fb142a78e74af2189861cfd3ac1d87640c66d0c9ec0','[\"*\"]','2026-08-13 12:04:12',NULL,'2026-08-13 10:36:36','2026-08-13 12:04:12'),(195,'App\\Models\\Usuario',82,'auth_token','58d567ea4ed72db8eeb7cdb03db426564d5bbacf892e5101f1869c401c3b9222','[\"*\"]','2026-08-14 01:42:23',NULL,'2026-08-14 01:42:19','2026-08-14 01:42:23'),(200,'App\\Models\\Usuario',82,'auth_token','bf86665dee72b8f00186a64faaa6a332e0ce6ad229b120ff73b6ba0427c70ff2','[\"*\"]','2026-08-14 05:45:09',NULL,'2026-08-14 04:27:12','2026-08-14 05:45:09'),(201,'App\\Models\\Usuario',82,'auth_token','06beda35362d16f2359922d5647ebeb2d9e5ac6d68840a8ecc4fc11e1d1f1b84','[\"*\"]','2026-08-15 03:04:49',NULL,'2026-08-15 01:06:39','2026-08-15 03:04:49'),(225,'App\\Models\\Usuario',78,'auth_token','68349aaee617b345123f912bc695a69d324c791fcc3e93cf9f3240c54425663d','[\"*\"]','2026-08-15 09:45:51',NULL,'2026-08-15 09:45:23','2026-08-15 09:45:51'),(229,'App\\Models\\Usuario',80,'auth_token','502578168330d65210cda620b18bb1c9a5f939b028a57115a470ecf31330af21','[\"*\"]','2026-08-15 10:08:01',NULL,'2026-08-15 10:07:56','2026-08-15 10:08:01'),(253,'App\\Models\\Usuario',82,'auth_token','a7b31e762793e2e0a60e757028ef2d413543dcba6802cf81d0a2d6e32e1b1b6a','[\"*\"]',NULL,NULL,'2026-08-15 12:08:11','2026-08-15 12:08:11'),(254,'App\\Models\\Usuario',82,'auth_token','2ae39d8f424b2a11b4a8128f868caddfbac424585ef2c7602bd92219c0e6720b','[\"*\"]','2026-08-15 12:30:14',NULL,'2026-08-15 12:08:13','2026-08-15 12:30:14');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peticion_red`
--

DROP TABLE IF EXISTS `peticion_red`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peticion_red` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_equipo` int DEFAULT NULL,
  `usuario_equipo` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `edificio` int DEFAULT NULL,
  `nivel` varchar(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `puerto` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_so` int DEFAULT NULL,
  `mac` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `nivel_red` varchar(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `conexion` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peticion_red`
--

LOCK TABLES `peticion_red` WRITE;
/*!40000 ALTER TABLE `peticion_red` DISABLE KEYS */;
INSERT INTO `peticion_red` VALUES (1,1597,'mlopez',2,'1','12',9,'00:1A:2B:3C:4D:5E','1','Cableada');
/*!40000 ALTER TABLE `peticion_red` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Control total del sistema','2026-07-29 22:19:30','2026-07-29 22:19:30'),(2,'Soporte Técnico','Atiende y administra solicitudes de soporte','2026-07-29 22:19:30','2026-07-29 22:19:30'),(3,'Capturista','Captura solicitudes de dictamenes','2026-07-29 22:19:30','2026-07-29 22:19:30'),(4,'Usuario Solicitante','Genera solicitudes de soporte','2026-07-29 22:19:30','2026-07-29 22:19:30'),(5,'Recursos Materiales','Consulta equipos sugeridos para baja y exporta reportes','2026-08-06 02:00:20','2026-08-06 02:00:20');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seriales_antivirus`
--

DROP TABLE IF EXISTS `seriales_antivirus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seriales_antivirus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `no_inventario` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `clave_producto` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seriales_antivirus`
--

LOCK TABLES `seriales_antivirus` WRITE;
/*!40000 ALTER TABLE `seriales_antivirus` DISABLE KEYS */;
INSERT INTO `seriales_antivirus` VALUES (82,'INV-2026-0001',3,'XXXXX-XXXXX-XXXXX-XXXXX');
/*!40000 ALTER TABLE `seriales_antivirus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios_solicitud`
--

DROP TABLE IF EXISTS `servicios_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios_solicitud` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int DEFAULT NULL,
  `id_servicio` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=620 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios_solicitud`
--

LOCK TABLES `servicios_solicitud` WRITE;
/*!40000 ALTER TABLE `servicios_solicitud` DISABLE KEYS */;
INSERT INTO `servicios_solicitud` VALUES (594,17521,77),(595,17589,77),(596,17590,77),(597,17591,77),(598,17592,77),(599,17593,77),(600,17594,77),(601,17595,77),(602,17596,77),(603,17597,77),(604,17598,77),(610,17604,77),(611,17605,77),(612,17606,77),(613,17607,77),(614,17608,77),(615,17609,77),(616,17610,77),(617,17611,77),(618,17612,77),(619,17613,77);
/*!40000 ALTER TABLE `servicios_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `situacion`
--

DROP TABLE IF EXISTS `situacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `situacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `situacion` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `situacion`
--

LOCK TABLES `situacion` WRITE;
/*!40000 ALTER TABLE `situacion` DISABLE KEYS */;
INSERT INTO `situacion` VALUES (1,'Pendiente'),(2,'Asignada'),(3,'Cerrada');
/*!40000 ALTER TABLE `situacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `software_equipo`
--

DROP TABLE IF EXISTS `software_equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `software_equipo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_equipo` int DEFAULT NULL,
  `id_software` int DEFAULT NULL,
  `licencia` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `usr` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=438 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `software_equipo`
--

LOCK TABLES `software_equipo` WRITE;
/*!40000 ALTER TABLE `software_equipo` DISABLE KEYS */;
INSERT INTO `software_equipo` VALUES (437,1597,4,'LIC-2026-0001','2026-07-31','admin','2026-07-31 22:33:52');
/*!40000 ALTER TABLE `software_equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud`
--

DROP TABLE IF EXISTS `solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud` (
  `id` int NOT NULL AUTO_INCREMENT,
  `solicitante` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `puesto` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `extension` int DEFAULT NULL,
  `id_area` int DEFAULT NULL,
  `descripcion` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tipo_documento` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `num_documento` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `prioridad` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fecha_solicitud` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_asignacion` timestamp NULL DEFAULT NULL,
  `usr_asigna` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_situacion` int DEFAULT '1',
  `id_soporte` int DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `fecha_autoriza_tecnico` timestamp NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `edificio` int DEFAULT NULL,
  `nivel` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_poa` int DEFAULT NULL,
  `num_servicios` int DEFAULT '1',
  `ip` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `usr_crea` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status_uie` tinyint(1) DEFAULT '0' COMMENT '0->generada por usuario, 1->generada por uie, 2->autorizada por uie para generar dictamen, 3->generado pra historial',
  `dada_baja` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_baja` datetime DEFAULT NULL,
  `motivo_baja` text,
  `fecha_autoriza_dictamen` datetime DEFAULT NULL,
  `fecha_memo` date DEFAULT NULL,
  `fecha_memo_recibido` date DEFAULT NULL,
  `seguimiento` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_area` (`id_area`) USING BTREE,
  KEY `idx_soporte` (`id_soporte`) USING BTREE,
  KEY `idx_status_uie` (`status_uie`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17632 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud`
--

LOCK TABLES `solicitud` WRITE;
/*!40000 ALTER TABLE `solicitud` DISABLE KEYS */;
INSERT INTO `solicitud` VALUES (17521,'María Fernanda López','Jefa de Departamento',4567,34,'Falla en equipo de cómputo, no enciende','Oficio','OF-2026-045','Alta','2026-07-31 22:33:52','2026-08-01 05:27:29','admin',2,29,NULL,NULL,NULL,2,'1',9,1,'192.168.1.50','usuario_sistema',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17522,'Juan Pérez','Analista',2101,1,'Falla en teléfono IP.','Oficio','TEL-001','Alta','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17523,'María López','Secretaria',2102,1,'Cambio de extensión telefónica.','Oficio','TEL-002','Media','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17524,'Carlos García','Jefe de Área',2103,2,'Solicitud de nuevo teléfono.','Memo','TEL-003','Alta','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17525,'Ana Martínez','Auxiliar',2104,2,'El teléfono no tiene tono.','Oficio','TEL-004','Baja','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17526,'Luis Hernández','Coordinador',2105,3,'Cambio de usuario de extensión.','Memo','TEL-005','Media','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17527,'Patricia Ruiz','Asistente',2106,3,'Configuración de buzón de voz.','Oficio','TEL-006','Baja','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17528,'Miguel Torres','Director',2107,4,'Asignación de nueva línea telefónica.','Oficio','TEL-007','Alta','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17529,'Laura Sánchez','Enlace',2108,4,'Reubicación de teléfono.','Memo','TEL-008','Media','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17530,'Fernando Díaz','Supervisor',2109,5,'Cambio de categoría telefónica.','Oficio','TEL-009','Alta','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17531,'Sofía Morales','Capturista',2110,5,'Teléfono sin servicio.','Memo','TEL-010','Media','2026-07-31 23:30:29',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17532,'Juan Pérez','Analista',3001,1,'Solicitud de nuevo teléfono IP.','Oficio','OF-001/2026','Alta','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17533,'María López','Secretaria',3002,1,'Cambio de extensión telefónica.','Oficio','OF-002/2026','Media','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17534,'Carlos García','Jefe de Área',3003,2,'Asignación de teléfono para nuevo personal.','Memo','ME-003/2026','Alta','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17535,'Ana Martínez','Auxiliar',3004,2,'El teléfono no tiene tono.','Oficio','OF-004/2026','Baja','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17536,'Luis Hernández','Coordinador',3005,3,'Cambio de usuario de extensión.','Memo','ME-005/2026','Media','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17537,'Patricia Ruiz','Asistente',3006,3,'Cambio de categoría telefónica.','Oficio','OF-006/2026','Alta','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17538,'Miguel Torres','Director',3007,4,'Instalación de nueva línea telefónica.','Oficio','OF-007/2026','Alta','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17539,'Laura Sánchez','Enlace',3008,4,'Reubicación de teléfono institucional.','Memo','ME-008/2026','Media','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17540,'Fernando Díaz','Supervisor',3009,5,'Falla en el equipo telefónico.','Oficio','OF-009/2026','Alta','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17541,'Sofía Morales','Capturista',3010,5,'Solicitud de activación de extensión.','Memo','ME-010/2026','Media','2026-07-31 23:34:53',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17542,'María Fernanda López','Jefa de Departamento',4567,1,'Falla en equipo de cómputo, no enciende','Oficio','OF-2026-045','Alta','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.1.50','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17543,'Juan Carlos Pérez','Analista de Sistemas',3210,1,'No tiene acceso a la red institucional','Oficio','OF-2026-046','Media','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.1.51','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17544,'Ana Sofía Martínez','Auxiliar Administrativo',4589,1,'La impresora no responde','Memorándum','OF-2026-047','Baja','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'1',1,1,'192.168.1.52','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17545,'Luis Alberto Gómez','Coordinador',4102,1,'Equipo con pantalla azul al iniciar','Oficio','OF-2026-048','Alta','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,3,'2',1,1,'192.168.1.53','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17546,'Patricia Hernández','Secretaria',3678,1,'Solicitud de instalación de Office','Oficio','OF-2026-049','Media','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.1.54','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17547,'Miguel Ángel Ruiz','Jefe de Área',4455,1,'No funciona el correo institucional','Oficio','OF-2026-050','Alta','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'2',1,1,'192.168.1.55','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17548,'Laura Sánchez Cruz','Capturista',3987,1,'Cambio de equipo de cómputo por falla','Memorándum','OF-2026-051','Media','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.1.56','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17549,'Fernando Díaz Morales','Supervisor',4321,1,'Sin acceso al sistema de solicitudes','Oficio','OF-2026-052','Alta','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,3,'2',1,1,'192.168.1.57','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17550,'Gabriela Torres Silva','Enlace Administrativo',4789,1,'Configuración de impresora de red','Oficio','OF-2026-053','Baja','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'1',1,1,'192.168.1.58','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17551,'Carlos Ramírez Soto','Director',5001,1,'Equipo demasiado lento para trabajar','Oficio','OF-2026-054','Alta','2026-07-31 23:40:46',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.1.59','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17552,'Ricardo Mendoza','Analista de Sistemas',4101,1,'Equipo no inicia correctamente','Oficio','OF-2026-101','Alta','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.101','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17553,'Elena Vargas','Auxiliar Administrativo',4102,2,'Impresora de red sin conexión','Oficio','OF-2026-102','Media','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'1',1,1,'192.168.10.102','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17554,'José Ramírez','Jefe de Departamento',4103,3,'Solicitud de instalación de software institucional','Memorándum','OF-2026-103','Alta','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,3,'2',1,1,'192.168.10.103','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17555,'Carmen Ortega','Secretaria Ejecutiva',4104,4,'No tiene acceso al correo institucional','Oficio','OF-2026-104','Alta','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.104','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17556,'Daniel Castillo','Coordinador',4105,5,'Falla en conexión a internet por cable','Oficio','OF-2026-105','Media','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'2',1,1,'192.168.10.105','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17557,'Verónica Silva','Capturista',4106,1,'Cambio de equipo por bajo rendimiento','Oficio','OF-2026-106','Media','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.106','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17558,'Héctor Jiménez','Supervisor',4107,2,'Configuración de impresora compartida','Memorándum','OF-2026-107','Baja','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,3,'2',1,1,'192.168.10.107','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17559,'Mónica Cruz','Enlace Administrativo',4108,3,'Actualización de sistema operativo','Oficio','OF-2026-108','Media','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.108','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17560,'Alejandro Flores','Director',4109,4,'Solicitud de equipo portátil para trabajo de campo','Oficio','OF-2026-109','Alta','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'2',1,1,'192.168.10.109','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17561,'Gabriela Navarro','Asistente',4110,5,'No puede acceder al sistema institucional','Oficio','OF-2026-110','Alta','2026-07-31 23:44:37',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.110','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17562,'Ricardo Mendoza','Analista de Sistemas',4101,34,'Equipo no inicia correctamente','Oficio','OF-2026-101','Alta','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.101','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17563,'Elena Vargas','Auxiliar Administrativo',4102,34,'Impresora de red sin conexión','Oficio','OF-2026-102','Media','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'1',1,1,'192.168.10.102','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17564,'José Ramírez','Jefe de Departamento',4103,34,'Solicitud de instalación de software institucional','Memorándum','OF-2026-103','Alta','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,3,'2',1,1,'192.168.10.103','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17565,'Carmen Ortega','Secretaria Ejecutiva',4104,34,'No tiene acceso al correo institucional','Oficio','OF-2026-104','Alta','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.104','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17566,'Daniel Castillo','Coordinador',4105,34,'Falla en conexión a internet por cable','Oficio','OF-2026-105','Media','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,1,'2',1,1,'192.168.10.105','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17567,'Verónica Silva','Capturista',4106,34,'Cambio de equipo por bajo rendimiento','Oficio','OF-2026-106','Media','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.106','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17568,'Héctor Jiménez','Supervisor',4107,34,'Configuración de impresora compartida','Memorándum','OF-2026-107','Baja','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,3,'2',1,1,'192.168.10.107','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17569,'Mónica Cruz','Enlace Administrativo',4108,34,'Actualización de sistema operativo','Oficio','OF-2026-108','Media','2026-07-31 23:49:45',NULL,NULL,1,NULL,NULL,NULL,NULL,2,'1',1,1,'192.168.10.108','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17570,'Alejandro Flores','Director',4109,34,'Solicitud de equipo portátil para trabajo de campo','Oficio','OF-2026-109','Alta','2026-07-31 23:49:45','2026-08-01 05:50:55','soporte',2,29,NULL,NULL,NULL,1,'2',1,1,'192.168.10.109','usuario',0,0,NULL,NULL,NULL,NULL,NULL,'[05/08/2026 23:19 - soporte] No se puede aun'),(17571,'Gabriela Navarro','Asistente',4110,34,'No puede acceder al sistema institucional','Oficio','OF-2026-110','Alta','2026-07-31 23:49:45','2026-08-01 05:50:36','capturista',3,29,'2026-08-01 00:22:37',NULL,'Ninguna',2,'1',9,0,'192.168.10.110','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17572,'Antonio Méndez',NULL,11204,NULL,'ABC',NULL,NULL,'normal','2026-08-01 13:05:09',NULL,NULL,1,NULL,NULL,NULL,NULL,4,'PB',NULL,1,'127.0.0.1','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17573,'Alejandro',NULL,11234,NULL,'safdgdrhgykuh',NULL,NULL,'normal','2026-08-01 13:19:29','2026-08-03 15:06:40','soporte',2,29,NULL,NULL,NULL,2,'3',NULL,1,'127.0.0.1','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17574,'Solicitante Prueba 1','Puesto de prueba',5501,NULL,'Solicitud de prueba número 1 para dictamen','Oficio','DOC-2026-001','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17575,'Solicitante Prueba 2','Puesto de prueba',5502,NULL,'Solicitud de prueba número 2 para dictamen','Oficio','DOC-2026-002','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17576,'Solicitante Prueba 3','Puesto de prueba',5503,NULL,'Solicitud de prueba número 3 para dictamen','Oficio','DOC-2026-003','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17577,'Solicitante Prueba 4','Puesto de prueba',5504,NULL,'Solicitud de prueba número 4 para dictamen','Oficio','DOC-2026-004','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17578,'Solicitante Prueba 5','Puesto de prueba',5505,NULL,'Solicitud de prueba número 5 para dictamen','Oficio','DOC-2026-005','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17579,'Solicitante Prueba 6','Puesto de prueba',5506,NULL,'Solicitud de prueba número 6 para dictamen','Oficio','DOC-2026-006','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17580,'Solicitante Prueba 7','Puesto de prueba',5507,NULL,'Solicitud de prueba número 7 para dictamen','Oficio','DOC-2026-007','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17581,'Solicitante Prueba 8','Puesto de prueba',5508,NULL,'Solicitud de prueba número 8 para dictamen','Oficio','DOC-2026-008','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17582,'Solicitante Prueba 9','Puesto de prueba',5509,NULL,'Solicitud de prueba número 9 para dictamen','Oficio','DOC-2026-009','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17583,'Solicitante Prueba 10','Puesto de prueba',5510,NULL,'Solicitud de prueba número 10 para dictamen','Oficio','DOC-2026-010','Media','2026-08-04 02:46:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17589,'Solicitante POA 1','Puesto de prueba',5601,34,'Solicitud de prueba POA número 1','Oficio','DOC-POA-2026-001','Media','2026-08-03 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17590,'Solicitante POA 2','Puesto de prueba',5602,34,'Solicitud de prueba POA número 2','Oficio','DOC-POA-2026-002','Baja','2026-08-02 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17591,'Solicitante POA 3','Puesto de prueba',5603,34,'Solicitud de prueba POA número 3','Oficio','DOC-POA-2026-003','Alta','2026-08-01 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17592,'Solicitante POA 4','Puesto de prueba',5604,34,'Solicitud de prueba POA número 4','Oficio','DOC-POA-2026-004','Media','2026-07-31 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,1,'2026-08-04 08:44:47','No',NULL,NULL,NULL,NULL),(17593,'Solicitante POA 5','Puesto de prueba',5605,34,'Solicitud de prueba POA número 5','Oficio','DOC-POA-2026-005','Baja','2026-07-30 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17594,'Solicitante POA 6','Puesto de prueba',5606,34,'Solicitud de prueba POA número 6','Oficio','DOC-POA-2026-006','Alta','2026-07-29 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17595,'Solicitante POA 7','Puesto de prueba',5607,34,'Solicitud de prueba POA número 7','Oficio','DOC-POA-2026-007','Media','2026-07-28 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17596,'Solicitante POA 8','Puesto de prueba',5608,34,'Solicitud de prueba POA número 8','Oficio','DOC-POA-2026-008','Baja','2026-07-27 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17597,'Solicitante POA 9','Puesto de prueba',5609,34,'Solicitud de prueba POA número 9','Oficio','DOC-POA-2026-009','Alta','2026-07-26 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17598,'Solicitante POA 10','Puesto de prueba',5610,34,'Solicitud de prueba POA número 10','Oficio','DOC-POA-2026-010','Media','2026-07-25 03:00:56',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17604,'Solicitante POA 1','Puesto de prueba',5701,34,'Solicitud cerrada de prueba POA número 1','Oficio','DOC-POA2-2026-001','Media','2026-07-24 03:09:49',NULL,NULL,3,27,'2026-08-02 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17605,'Solicitante POA 2','Puesto de prueba',5702,34,'Solicitud cerrada de prueba POA número 2','Oficio','DOC-POA2-2026-002','Baja','2026-07-23 03:09:49',NULL,NULL,3,27,'2026-08-01 21:09:49','2026-08-14 04:58:20',NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,NULL,NULL,NULL,NULL),(17606,'Solicitante POA 3','Puesto de prueba',5703,34,'Solicitud cerrada de prueba POA número 3','Oficio','DOC-POA2-2026-003','Alta','2026-07-22 03:09:49',NULL,NULL,3,27,'2026-07-31 21:09:49','2026-08-08 01:49:17',NULL,NULL,NULL,9,1,NULL,'admin',2,0,NULL,NULL,'2026-08-13 22:39:31',NULL,NULL,NULL),(17607,'Solicitante POA 4','Puesto de prueba',5704,34,'Solicitud cerrada de prueba POA número 4','Oficio','DOC-POA2-2026-004','Media','2026-07-21 03:09:49','2026-08-08 01:28:33','Antonio',3,30,'2026-08-07 19:29:11','2026-08-08 01:39:11','17607',NULL,NULL,15,1,NULL,'admin',1,0,NULL,NULL,'2026-08-07 19:48:24',NULL,NULL,NULL),(17608,'Solicitante POA 5','Puesto de prueba',5705,34,'Solicitud cerrada de prueba POA número 5','Oficio','DOC-POA2-2026-005','Baja','2026-07-20 03:09:49',NULL,NULL,3,27,'2026-07-29 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',2,1,'2026-08-04 08:44:15','Duplicado',NULL,NULL,NULL,NULL),(17609,'Solicitante POA 6','Puesto de prueba',5706,34,'Solicitud cerrada de prueba POA número 6','Oficio','DOC-POA2-2026-006','Alta','2026-07-19 03:09:49',NULL,NULL,3,27,'2026-07-28 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17610,'Solicitante POA 7','Puesto de prueba',5707,34,'Solicitud cerrada de prueba POA número 7','Oficio','DOC-POA2-2026-007','Media','2026-07-18 03:09:49',NULL,NULL,3,27,'2026-07-27 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17611,'Solicitante POA 8','Puesto de prueba',5708,34,'Solicitud cerrada de prueba POA número 8','Oficio','DOC-POA2-2026-008','Baja','2026-07-17 03:09:49',NULL,NULL,3,27,'2026-07-26 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17612,'Solicitante POA 9','Puesto de prueba',5709,34,'Solicitud cerrada de prueba POA número 9','Oficio','DOC-POA2-2026-009','Alta','2026-07-16 03:09:49',NULL,NULL,3,27,'2026-07-25 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17613,'Solicitante POA 10','Puesto de prueba',5710,34,'Solicitud cerrada de prueba POA número 10','Oficio','DOC-POA2-2026-010','Media','2026-07-15 03:09:49',NULL,NULL,3,27,'2026-07-24 21:09:49',NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17614,'Solicitante POA 5','Puesto de prueba',5705,34,'Solicitud cerrada de prueba POA número 5','Oficio','DOC-POA2-2026-005','Baja','2026-08-04 14:32:12',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17615,'Solicitante POA 5','Puesto de prueba',5705,34,'Solicitud cerrada de prueba POA número 5','Oficio','DOC-POA2-2026-005','Baja','2026-08-04 14:32:44',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17616,'Solicitante POA 5','Puesto de prueba',5705,34,'Solicitud cerrada de prueba POA número 5','Oficio','DOC-POA2-2026-005','Baja','2026-08-04 14:43:01',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17617,'Solicitante POA 4','Puesto de prueba',5704,34,'Solicitud cerrada de prueba POA número 4','Oficio','DOC-POA2-2026-004','Media','2026-08-04 14:48:04',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17618,'Solicitante POA 4','Puesto de prueba',5704,34,'Solicitud cerrada de prueba POA número 4','Oficio','DOC-POA2-2026-004','Media','2026-08-04 14:54:33',NULL,NULL,1,27,NULL,NULL,NULL,NULL,NULL,9,1,NULL,'admin',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(17619,'Solicitante POA 4','Puesto de prueba',5704,34,'Solicitud cerrada de prueba POA número 4','Oficio','DOC-POA2-2026-004','Media','2026-08-04 14:54:44','2026-08-07 06:58:09','Antonio',3,30,'2026-08-07 00:58:28','2026-08-14 04:36:11','1222',NULL,NULL,15,2,NULL,'admin',3,0,NULL,NULL,'2026-08-13 22:36:23',NULL,NULL,NULL),(17620,'Solicitante POA 4','Puesto de prueba',5704,34,'Solicitud cerrada de prueba POA número 4','Oficio','DOC-POA2-2026-004','Media','2026-08-05 00:19:49','2026-08-08 01:24:33','admin',3,30,'2026-08-15 04:46:32','2026-08-08 01:24:24','falla para baja',NULL,NULL,15,2,NULL,'admin',3,0,NULL,NULL,NULL,NULL,NULL,NULL),(17621,'Antonio Méndez',NULL,11204,34,'sdtytdyuy',NULL,NULL,'media','2026-08-08 02:44:31',NULL,NULL,1,NULL,NULL,NULL,NULL,2,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,'2026-08-21',NULL),(17622,'Antonio Méndez',NULL,11204,34,'sdtytdyuy',NULL,NULL,'media','2026-08-08 02:44:31',NULL,NULL,1,NULL,NULL,NULL,NULL,2,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,'2026-08-21',NULL),(17623,'Alejandro',NULL,NULL,34,'Office',NULL,NULL,'baja','2026-08-08 02:54:17',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17624,'Alejandro',NULL,NULL,34,'Office',NULL,NULL,'baja','2026-08-08 02:54:17',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17625,'Ram',NULL,NULL,34,'sddfew',NULL,NULL,'media','2026-08-08 02:54:55',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17626,'Ram',NULL,NULL,34,'sddfew',NULL,NULL,'media','2026-08-08 02:54:55',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17627,'Antonio Méndez',NULL,11204,34,'dsy',NULL,NULL,NULL,'2026-08-08 02:58:22','2026-08-11 06:40:18','admin',2,28,NULL,NULL,NULL,NULL,NULL,NULL,1,'127.0.0.1','Antonio',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17628,'Solicitante POA 4',NULL,11204,NULL,'w4e5re67t',NULL,NULL,'alta','2026-08-15 09:14:55',NULL,NULL,1,NULL,NULL,NULL,NULL,6,'2',NULL,1,'127.0.0.1','usuario',0,0,NULL,NULL,NULL,NULL,NULL,NULL),(17629,'Solicitante POA 5',NULL,11204,NULL,'restdytu yoooooooooooooooo',NULL,NULL,'normal','2026-08-15 09:37:56','2026-08-15 09:48:58','admin',3,28,'2026-08-15 03:53:01','2026-08-15 09:53:17',NULL,NULL,NULL,15,0,'127.0.0.1','usuario',1,0,NULL,NULL,'2026-08-15 03:53:27',NULL,NULL,NULL),(17630,'Antonio Méndez ddd',NULL,11204,NULL,'dsgdtfygh',NULL,NULL,'alta','2026-08-15 09:45:12','2026-08-15 09:45:42','soporte',2,29,NULL,NULL,NULL,NULL,NULL,NULL,1,'127.0.0.1','usuario',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(17631,'Aguilar Antonio',NULL,11204,35,'Falla de la maquina','MEMORÁNDUM',NULL,'media','2026-08-15 10:46:06','2026-08-15 10:46:16','Antonio',3,28,'2026-08-15 04:48:39','2026-08-15 10:48:48','PAra baja',NULL,NULL,15,1,'127.0.0.1','Antonio',3,0,NULL,NULL,'2026-08-15 04:48:58',NULL,NULL,NULL);
/*!40000 ALTER TABLE `solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_archivos`
--

DROP TABLE IF EXISTS `solicitud_archivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_archivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int DEFAULT NULL,
  `ruta_archivo` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `tipo` enum('acuseDictamen','memoSolicitud','acuseMemoRespuesta') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `usr_created` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_archivos` (`id_solicitud`,`tipo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2027 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_archivos`
--

LOCK TABLES `solicitud_archivos` WRITE;
/*!40000 ALTER TABLE `solicitud_archivos` DISABLE KEYS */;
INSERT INTO `solicitud_archivos` VALUES (2026,17521,'/storage/solicitudes/of-2026-045.pdf','memoSolicitud','2026-07-31 22:33:52','admin');
/*!40000 ALTER TABLE `solicitud_archivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_archivos_bitacora`
--

DROP TABLE IF EXISTS `solicitud_archivos_bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_archivos_bitacora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int DEFAULT NULL,
  `ruta_archivo` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `tipo` enum('acuseDictamen','memoSolicitud','acuseMemoRespuesta') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `usr_created` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `usr_deleted` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1979 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_archivos_bitacora`
--

LOCK TABLES `solicitud_archivos_bitacora` WRITE;
/*!40000 ALTER TABLE `solicitud_archivos_bitacora` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitud_archivos_bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_correo`
--

DROP TABLE IF EXISTS `solicitud_correo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_correo` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tipo_solicitud` enum('alta','baja') NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `puesto` varchar(200) DEFAULT NULL,
  `id_area` int DEFAULT NULL,
  `area_interna` varchar(200) DEFAULT NULL COMMENT 'Solo formato de alta',
  `correo_secundario` varchar(150) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `correo_institucional` varchar(150) DEFAULT NULL COMMENT 'Se llena al autorizar el alta, o es la cuenta a dar de baja',
  `usuario_generado` varchar(150) DEFAULT NULL COMMENT 'usuario@oaxaca.gob.mx asignado',
  `motivo_baja` text,
  `estatus` enum('creado_cgd','atendiendo_dgti','activo','baja') NOT NULL DEFAULT 'creado_cgd',
  `fecha_creado_cgd` datetime DEFAULT NULL,
  `fecha_atendiendo_dgti` datetime DEFAULT NULL,
  `folio_glpi` varchar(50) DEFAULT NULL,
  `observacion_glpi` text,
  `fecha_activo` datetime DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `observaciones` text,
  `oficio_cgd` varchar(75) DEFAULT NULL COMMENT 'número de oficio de la coordinación de gestión digital',
  `usuario_mov` varchar(100) DEFAULT NULL,
  `id_usuario_crea` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_correo_area` (`id_area`),
  KEY `idx_correo_estatus` (`estatus`),
  KEY `fk_correo_usuario_crea` (`id_usuario_crea`),
  CONSTRAINT `fk_correo_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_correo_usuario_crea` FOREIGN KEY (`id_usuario_crea`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_correo`
--

LOCK TABLES `solicitud_correo` WRITE;
/*!40000 ALTER TABLE `solicitud_correo` DISABLE KEYS */;
INSERT INTO `solicitud_correo` VALUES (1,'alta','Anonio mendez','Jefe de Departamento',34,'hora','mendez@gmail.com','9524858569',NULL,NULL,NULL,NULL,'activo','2026-08-12 06:18:18','2026-08-13 23:27:55','1458',NULL,'2026-08-14 19:25:25',NULL,NULL,NULL,'Antonio',82,'2026-08-12 12:18:18','2026-08-15 01:25:25');
/*!40000 ALTER TABLE `solicitud_correo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_correo_archivos`
--

DROP TABLE IF EXISTS `solicitud_correo_archivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_correo_archivos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_solicitud_correo` bigint unsigned NOT NULL,
  `ruta_archivo` text,
  `tipo` enum('formatoFirmado','oficio','acuse') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `usr_created` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_correo_archivos` (`id_solicitud_correo`,`tipo`),
  CONSTRAINT `fk_correo_archivo_solicitud` FOREIGN KEY (`id_solicitud_correo`) REFERENCES `solicitud_correo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_correo_archivos`
--

LOCK TABLES `solicitud_correo_archivos` WRITE;
/*!40000 ALTER TABLE `solicitud_correo_archivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitud_correo_archivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_internet`
--

DROP TABLE IF EXISTS `solicitud_internet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_internet` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_equipo` int NOT NULL,
  `usuario_internet` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id_cargo` int NOT NULL,
  `id_area` int NOT NULL,
  `id_autoriza` int NOT NULL,
  `id_enlace` int DEFAULT '1',
  `correo` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `tel_ext` int NOT NULL,
  `tipo_conexion` enum('cableada','inalambrica') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nivel_filtrado` tinyint NOT NULL DEFAULT '1',
  `tipo_solicitud` enum('nueva','cambio') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `edificio` enum('2','3','4','6') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nivel` enum('PB','1','2','3') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `puerto` int DEFAULT NULL,
  `justificacion` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `estatus` enum('generado_uie','atendiendo_dt','activo','eliminado','baja') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'generado_uie',
  `fecha_generado_uie` datetime DEFAULT NULL COMMENT 'fecha en que se genera',
  `fecha_atendiendo_dt` datetime DEFAULT NULL COMMENT 'fecha en que se imprimi el formato',
  `fecha_activo` datetime DEFAULT NULL COMMENT 'fecha en que se activa el servicio',
  `motivo_actualizacion` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `fecha_baja` datetime DEFAULT NULL COMMENT 'fecha en que se da de baja el servicio',
  `motivo_baja` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `folio_glpi` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `observacion_glpi` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `oficio_cgd` varchar(75) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'número de oficio de la coordinación de gestión digital',
  `cpp_archivo` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_titular` int DEFAULT NULL,
  `id_administrativo` int DEFAULT NULL,
  `id_tecnologias` int DEFAULT NULL,
  `usuario_mov` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id_usuario_crea` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id_equipo` (`id_equipo`) USING BTREE,
  KEY `id_cargo` (`id_cargo`) USING BTREE,
  KEY `id_area` (`id_area`) USING BTREE,
  KEY `id_autoriza` (`id_autoriza`) USING BTREE,
  KEY `id_usuario_crea` (`id_usuario_crea`) USING BTREE,
  KEY `id_enlace` (`id_enlace`) USING BTREE,
  KEY `id_titular` (`id_titular`) USING BTREE,
  KEY `id_administrativo` (`id_administrativo`) USING BTREE,
  KEY `id_tecnologias` (`id_tecnologias`) USING BTREE,
  CONSTRAINT `solicitud_internet_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `datos_equipos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_2` FOREIGN KEY (`id_cargo`) REFERENCES `cat_cargo` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_3` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_4` FOREIGN KEY (`id_autoriza`) REFERENCES `cat_autoriza_internet` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_5` FOREIGN KEY (`id_usuario_crea`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_6` FOREIGN KEY (`id_enlace`) REFERENCES `cat_enlace_informatico` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_internet`
--

LOCK TABLES `solicitud_internet` WRITE;
/*!40000 ALTER TABLE `solicitud_internet` DISABLE KEYS */;
INSERT INTO `solicitud_internet` VALUES (292,1597,'mlopez',66,34,20,3,'mlopez@dependencia.gob.mx',4567,'cableada',1,'nueva','2','1',12,'Se requiere acceso a internet para labores administrativas','generado_uie',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin',NULL,'2026-07-31 22:33:52',NULL),(300,1599,'Antonio Lopez Castillo',66,34,20,3,'mendez17anto@gmail.com',4567,'inalambrica',2,'nueva','2','PB',NULL,'ACCESO A DISTINTAS PÁGINAS PARA:\n- COMPARTIR INFORMACIÓN RESPECTO A MIS ACTIVIDADES, SE REQUIERE ACCESO A DROPBOX, GOOGLE DRIVE, ICLOUD, ONEDRIVE.\n- ACCESO A PÁGINAS DE LEYES, PERIÓDICOS, REVISTAS O ARTÍCULOS, PARA MONITOREO INFORMATIVO A TEMAS ADMINISTRATIVOS Y DE AUDITORÍAS DE FISCALIZACIÓN ENTRE OTROS.\n- CONSULTAR CURSOS EN VIDEO.\n- ACCESO A PLATAFORMAS PARA VIDEOCONFERENCIAS.\n- ACCESO A REDES SOCIALES.\n- Y DEMÁS ACCIONES QUE SE REALICEN EN LA DIRECCIÓN.','generado_uie','2026-08-07 22:28:42',NULL,'2026-08-12 07:11:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antonio',82,'2026-08-08 04:28:42','2026-08-13 23:28:27'),(301,1598,'Antonio Lopez Castillo',66,34,20,3,'mendez17anto@gmail.com',4567,'inalambrica',1,'nueva','3','1',NULL,'ACCESO A DISTINTAS PÁGINAS PARA:\n- COMPARTIR INFORMACIÓN RESPECTO A MIS ACTIVIDADES, SE REQUIERE ACCESO A DROPBOX, GOOGLE DRIVE, ICLOUD, ONEDRIVE.\n- ACCESO A PÁGINAS DE LEYES, PERIÓDICOS, REVISTAS O ARTÍCULOS, PARA MONITOREO INFORMATIVO A TEMAS ADMINISTRATIVOS Y DE AUDITORÍAS DE FISCALIZACIÓN ENTRE OTROS.\n- CONSULTAR CURSOS EN VIDEO.\n- ACCESO A PLATAFORMAS PARA VIDEOCONFERENCIAS.\n- ACCESO A REDES SOCIALES.\n- Y DEMÁS ACCIONES QUE SE REALICEN EN LA DIRECCIÓN.','atendiendo_dt','2026-08-07 23:42:58','2026-08-12 00:30:22',NULL,NULL,NULL,NULL,'5503',NULL,NULL,NULL,NULL,NULL,NULL,'admin',77,'2026-08-08 05:42:58','2026-08-12 00:30:22'),(302,1601,'Antonio Lopez Castillo',66,34,20,3,'mendez17anto@gmail.com',4567,'cableada',2,'nueva','2','PB',111,'ACCESO A DISTINTAS PÁGINAS PARA:\n- COMPARTIR INFORMACIÓN RESPECTO A MIS ACTIVIDADES, SE REQUIERE ACCESO A DROPBOX, GOOGLE DRIVE, ICLOUD, ONEDRIVE.\n- ACCESO A PÁGINAS DE LEYES, PERIÓDICOS, REVISTAS O ARTÍCULOS, PARA MONITOREO INFORMATIVO A TEMAS ADMINISTRATIVOS Y DE AUDITORÍAS DE FISCALIZACIÓN ENTRE OTROS.\n- CONSULTAR CURSOS EN VIDEO.\n- ACCESO A PLATAFORMAS PARA VIDEOCONFERENCIAS.\n- ACCESO A REDES SOCIALES.\n- Y DEMÁS ACCIONES QUE SE REALICEN EN LA DIRECCIÓN.','generado_uie','2026-08-11 21:38:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin',77,'2026-08-12 03:38:26',NULL);
/*!40000 ALTER TABLE `solicitud_internet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_internet_impresion`
--

DROP TABLE IF EXISTS `solicitud_internet_impresion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_internet_impresion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_solicitud_internet` int unsigned NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `oficio_cdg` varchar(75) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id_solicitud_internet` (`id_solicitud_internet`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_internet_impresion`
--

LOCK TABLES `solicitud_internet_impresion` WRITE;
/*!40000 ALTER TABLE `solicitud_internet_impresion` DISABLE KEYS */;
INSERT INTO `solicitud_internet_impresion` VALUES (16,292,'2026-07-31 16:33:52','OF-CGD-2026-010',NULL);
/*!40000 ALTER TABLE `solicitud_internet_impresion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_vpn`
--

DROP TABLE IF EXISTS `solicitud_vpn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_vpn` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(150) NOT NULL,
  `puesto` varchar(200) DEFAULT NULL,
  `id_area` int DEFAULT NULL,
  `dependencia` varchar(200) DEFAULT NULL,
  `correo_institucional` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `tipo_acceso` enum('link','ip_puerto','ambos') NOT NULL DEFAULT 'ambos',
  `link_sistema` varchar(255) DEFAULT NULL COMMENT 'Ej. https://correspondencia.oaxaca.gob.mx/',
  `ip_puerto` varchar(100) DEFAULT NULL COMMENT 'Ej. 192.168.1.100:8080,443',
  `justificacion_uso` text,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `num_ticket` varchar(50) DEFAULT NULL,
  `estatus` enum('creado_cgd','atendiendo_dgti','activo','baja') NOT NULL DEFAULT 'creado_cgd',
  `fecha_creado_cgd` datetime DEFAULT NULL,
  `fecha_atendiendo_dgti` datetime DEFAULT NULL,
  `folio_glpi` varchar(50) DEFAULT NULL,
  `observacion_glpi` text,
  `fecha_activo` datetime DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `motivo_baja` text,
  `observaciones` text,
  `usuario_mov` varchar(100) DEFAULT NULL,
  `id_usuario_crea` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vpn_area` (`id_area`),
  KEY `idx_vpn_estatus` (`estatus`),
  KEY `fk_vpn_usuario_crea` (`id_usuario_crea`),
  CONSTRAINT `fk_vpn_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_vpn_usuario_crea` FOREIGN KEY (`id_usuario_crea`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_vpn`
--

LOCK TABLES `solicitud_vpn` WRITE;
/*!40000 ALTER TABLE `solicitud_vpn` DISABLE KEYS */;
INSERT INTO `solicitud_vpn` VALUES (1,'Antonio','Jefe de Departamento',34,'srtyh','mendez@gmail.com','9517858989','1142','link','https://sig.oaxaca.gob.mx/soportec/index.php',NULL,'lo ocupo para tramites','2026-08-12','2026-08-13',NULL,'activo','2026-08-12 06:17:14',NULL,NULL,NULL,'2026-08-14 19:25:54',NULL,NULL,NULL,'Antonio',82,'2026-08-12 12:17:14','2026-08-15 01:25:54');
/*!40000 ALTER TABLE `solicitud_vpn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_vpn_archivos`
--

DROP TABLE IF EXISTS `solicitud_vpn_archivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_vpn_archivos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_solicitud_vpn` bigint unsigned NOT NULL,
  `ruta_archivo` text,
  `tipo` enum('formatoFirmado','oficio','acuse') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `usr_created` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_vpn_archivos` (`id_solicitud_vpn`,`tipo`),
  CONSTRAINT `fk_vpn_archivo_solicitud` FOREIGN KEY (`id_solicitud_vpn`) REFERENCES `solicitud_vpn` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_vpn_archivos`
--

LOCK TABLES `solicitud_vpn_archivos` WRITE;
/*!40000 ALTER TABLE `solicitud_vpn_archivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitud_vpn_archivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_telefonia`
--

DROP TABLE IF EXISTS `solicitudes_telefonia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_telefonia` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned DEFAULT NULL,
  `tipo_tramite` enum('SOLICITAR_TELEFONO','CAMBIO_PIN_CN','CAMBIO_USUARIO','MODIFICAR_DATOS','JEFE_SECRETARIA','CAMBIO_DID','CAMBIO_CATEGORIA','FAX','CAMBIO_FAX','OTROS') DEFAULT NULL,
  `estatus` enum('creado_cgd','atendiendo_dgti','activo','baja') NOT NULL DEFAULT 'creado_cgd',
  `fecha_creado_cgd` datetime DEFAULT NULL,
  `fecha_atendiendo_dgti` datetime DEFAULT NULL,
  `folio_glpi` varchar(50) DEFAULT NULL,
  `observacion_glpi` text,
  `fecha_activo` datetime DEFAULT NULL,
  `extension_asignada` varchar(10) DEFAULT NULL,
  `did_asignado` varchar(20) DEFAULT NULL,
  `tipo_clave` enum('PIN','CN') DEFAULT NULL,
  `clave_asignada` varchar(50) DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `motivo_baja` text,
  `observaciones` text,
  `detalle` json DEFAULT NULL,
  `usuario_mov` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_telefonia`
--

LOCK TABLES `solicitudes_telefonia` WRITE;
/*!40000 ALTER TABLE `solicitudes_telefonia` DISABLE KEYS */;
INSERT INTO `solicitudes_telefonia` VALUES (1,6,'SOLICITAR_TELEFONO','activo','2026-08-12 06:32:30','2026-08-12 06:32:51','1234',NULL,'2026-08-12 20:06:25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antonio','2026-08-12 12:32:30','2026-08-13 02:06:25'),(2,7,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1001',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(3,8,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1002',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(4,9,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1003',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(5,10,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1004',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo (Jefe)',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(6,11,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1005',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo (Secretaria)',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(7,12,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1006',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(8,13,'SOLICITAR_TELEFONO','activo','2026-07-28 14:48:53','2026-07-30 14:48:53','GLPI-1007',NULL,'2026-08-02 14:48:53',NULL,NULL,NULL,NULL,NULL,NULL,'Alta inicial - servicio activo',NULL,'usuario','2026-07-28 20:48:53','2026-08-02 20:48:53'),(9,13,'JEFE_SECRETARIA','atendiendo_dgti','2026-08-12 22:05:23','2026-08-13 06:03:36','1111',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antonio','2026-08-13 04:05:23','2026-08-13 12:03:36'),(10,12,'JEFE_SECRETARIA','creado_cgd','2026-08-12 22:14:56',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antonio','2026-08-13 04:14:56',NULL),(11,12,'JEFE_SECRETARIA','creado_cgd','2026-08-12 22:18:32',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antonio','2026-08-13 04:18:32',NULL),(12,12,'JEFE_SECRETARIA','baja','2026-08-12 22:19:02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-12 22:30:51',NULL,NULL,NULL,'Antonio','2026-08-13 04:19:02','2026-08-13 04:30:51'),(13,12,'JEFE_SECRETARIA','baja','2026-08-12 22:21:37',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-12 22:30:45',NULL,'dwdfaes',NULL,'Antonio','2026-08-13 04:21:37','2026-08-13 04:30:45'),(14,12,'JEFE_SECRETARIA','creado_cgd','2026-08-12 22:31:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antonio','2026-08-13 04:31:26',NULL);
/*!40000 ALTER TABLE `solicitudes_telefonia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soporte`
--

DROP TABLE IF EXISTS `soporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `extension` int DEFAULT NULL,
  `siglas` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `expediente` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `status` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soporte`
--

LOCK TABLES `soporte` WRITE;
/*!40000 ALTER TABLE `soporte` DISABLE KEYS */;
INSERT INTO `soporte` VALUES (27,'Carlos Ramírez Soto',1234,'CRS','EXP-2026-001',_binary ''),(28,'Administrador del Sistema',NULL,'ADM',NULL,_binary ''),(29,'Usuario Soporte',NULL,'SOP',NULL,_binary ''),(30,'Jose Méndez',NULL,NULL,NULL,_binary ''),(31,'Antonio Aguilar',NULL,NULL,NULL,_binary '');
/*!40000 ALTER TABLE `soporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefonia`
--

DROP TABLE IF EXISTS `telefonia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefonia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `extension` int DEFAULT NULL,
  `modelo` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mac` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `serie` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  `nivel_tel` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefonia`
--

LOCK TABLES `telefonia` WRITE;
/*!40000 ALTER TABLE `telefonia` DISABLE KEYS */;
INSERT INTO `telefonia` VALUES (1,4567,'Cisco 7841','00:1A:2B:3C:4D:60','TEL-2026-0001',_binary '','1');
/*!40000 ALTER TABLE `telefonia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `clave` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `new_clave` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `pswd` blob,
  `id_soporte` int DEFAULT NULL,
  `id_area` int DEFAULT NULL,
  `ip` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `cel` bigint DEFAULT NULL,
  `hrs` smallint DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  `nombre` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `rol_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_usuarios_roles` (`rol_id`),
  CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (77,'admin','admin123','admin123',NULL,28,NULL,'127.0.0.1',9511111111,8,_binary '','Administrador del Sistema',1),(78,'soporte','soporte123','soporte123',NULL,29,NULL,'127.0.0.1',9512222222,8,_binary '','Usuario Soporte',2),(79,'capturista','captura123','captura123',NULL,NULL,NULL,'127.0.0.1',9513333333,8,_binary '','Usuario Capturista',3),(80,'usuario','usuario123','usuario123',NULL,NULL,NULL,'127.0.0.1',9514444444,8,_binary '','Usuario Solicitante',4),(81,'recursos','recursos123','recursos123',NULL,NULL,NULL,'127.0.0.1',9515555555,8,_binary '','Usuario Recursos Materiales',5),(82,'Antonio','123456','123456',NULL,30,34,NULL,NULL,NULL,_binary '','Jose Méndez',1),(83,'Aguilar','123456789','123456789',NULL,NULL,35,NULL,NULL,NULL,_binary '','Antonio Aguilar',4);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_telefonia`
--

DROP TABLE IF EXISTS `usuarios_telefonia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_telefonia` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) DEFAULT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `clave_puesto` varchar(30) DEFAULT NULL,
  `puesto` varchar(200) DEFAULT NULL,
  `nivel_puesto` varchar(30) DEFAULT NULL,
  `dependencia_id` bigint unsigned DEFAULT NULL,
  `area_id` bigint unsigned DEFAULT NULL,
  `correo_institucional` varchar(150) DEFAULT NULL,
  `correo_externo` varchar(150) DEFAULT NULL,
  `correo_jefe` varchar(150) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `did` varchar(20) DEFAULT NULL,
  `mac` varchar(30) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `edificio` varchar(20) DEFAULT NULL,
  `nodo` varchar(50) DEFAULT NULL,
  `nivel` varchar(20) DEFAULT NULL,
  `categoria_id` bigint unsigned DEFAULT NULL,
  `tipo_clave` enum('PIN','CN') DEFAULT NULL,
  `clave_actual` varchar(50) DEFAULT NULL,
  `internet` tinyint(1) DEFAULT '0',
  `equipo_computo` tinyint(1) DEFAULT '0',
  `status` enum('Activo','Suspendido','Baja','Mantenimiento') DEFAULT 'Activo',
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `extension` (`extension`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_telefonia`
--

LOCK TABLES `usuarios_telefonia` WRITE;
/*!40000 ALTER TABLE `usuarios_telefonia` DISABLE KEYS */;
INSERT INTO `usuarios_telefonia` VALUES (1,'Roberto','Hernández','Castillo','HECR800101ABC','HECR800101HDFRRB01','CP-001','Director de Área','Directivo',1,34,'rhernandez@dependencia.gob.mx','roberto.hernandez@gmail.com',NULL,'Av. Reforma 123','Edificio 2, Nivel 1','3001','5551234501','00:1A:2B:3C:4D:70','Cisco 8845','TEL-2026-0002','2','NODO-2A','1',1,NULL,NULL,1,1,'Activo','Usuario directivo con línea DID asignada','2026-07-31 22:33:52','2026-07-31 22:33:52'),(2,'Ana','Torres','Ramírez','TORA850202XYZ','TORA850202MDFRMN02','CP-002','Secretaria Ejecutiva','Operativo',1,34,'atorres@dependencia.gob.mx',NULL,'rhernandez@dependencia.gob.mx','Av. Reforma 123','Edificio 2, Nivel 1','3002',NULL,'00:1A:2B:3C:4D:71','Cisco 7841','TEL-2026-0003','2','NODO-2A','1',1,NULL,NULL,1,1,'Activo','Secretaria del director, mismos privilegios de correo','2026-07-31 22:33:52','2026-07-31 22:33:52'),(3,'María','López','Sánchez','LOSM800101ABC','LOSM800101MOCPNR01','0J172A','Jefa de Departamento',NULL,NULL,1,'maria.lopez@oaxaca.gob.mx',NULL,NULL,NULL,NULL,'11930',NULL,'AC:DE:48:00:11:22','4038','H0500707520099','4','99','3',2,NULL,NULL,1,1,'Activo',NULL,'2026-08-02 17:00:33',NULL),(4,'Jorge','Ramírez','Cruz','RACJ850215XYZ','RACJ850215HOCMRR02','0J173B','Analista Técnico',NULL,NULL,3,'jorge.ramirez@oaxaca.gob.mx',NULL,NULL,NULL,NULL,'11931',NULL,NULL,'3212',NULL,'2','15','PB',1,NULL,NULL,0,1,'Activo',NULL,'2026-08-02 17:00:33',NULL),(5,'Toño','Antonio','Mendez','CME920314H56','MEMA000617HOCNNNA6','asj-21',NULL,NULL,NULL,NULL,'mendez17anto@gmail.com',NULL,NULL,'1959 NE 153 ST','Ciudad administrativa','11204',NULL,NULL,'MAc',NULL,NULL,'223','3',NULL,NULL,NULL,1,1,'Activo',NULL,'2026-08-12 12:23:44',NULL),(6,'Toño','Antonio','Mendez','CME920314H56','MEMA000617HOCNNNA6','asj-21',NULL,NULL,NULL,NULL,'mendez17anto@gmail.com',NULL,NULL,'1959 NE 153 ST','Ciudad administrativa','112041',NULL,NULL,'MAc',NULL,NULL,'223','3',NULL,NULL,NULL,1,1,'Activo',NULL,'2026-08-12 12:32:29',NULL),(7,'Rosa','Guzmán','Torres','GUTR870101AA1','GUTR870101MOCZRR01','A001','Auxiliar Administrativo',NULL,NULL,NULL,'rosa.guzman@oaxaca.gob.mx',NULL,NULL,'Edificio 2','Edificio 2','200001','5301','00:1B:2C:3D:4E:01','Cisco 7841','SN-ACT-0001','2','NODO-A','PB',1,NULL,NULL,1,1,'Activo','Usuario activo para prueba de Cambio de Clave/PIN/CN','2026-08-12 20:48:53','2026-08-12 20:48:53'),(8,'Pedro','Jiménez','Solís','JISP880202BB2','JISP880202HOCMLR02','A002','Auxiliar Administrativo',NULL,NULL,NULL,'pedro.jimenez@oaxaca.gob.mx',NULL,NULL,'Edificio 3','Edificio 3','200002','5302','00:1B:2C:3D:4E:02','Cisco 7841','SN-ACT-0002','3','NODO-B','1',1,NULL,NULL,1,1,'Activo','Usuario activo para prueba de Cambio de Usuario','2026-08-12 20:48:53','2026-08-12 20:48:53'),(9,'Elena','Reyes','Morales','REME890303CC3','REME890303MOCYRL03','A003','Analista',NULL,NULL,NULL,'elena.reyes@oaxaca.gob.mx',NULL,NULL,'Edificio 4','Edificio 4','200003','5303','00:1B:2C:3D:4E:03','Cisco 7821','SN-ACT-0003','4','NODO-C','2',2,NULL,NULL,1,1,'Activo','Usuario activo para prueba de Modificar Datos','2026-08-12 20:48:53','2026-08-12 20:48:53'),(10,'Ricardo','Domínguez','Flores','DOFR700404DD4','DOFR700404HOCMLC04','D001','Director de Área',NULL,NULL,NULL,'ricardo.dominguez@oaxaca.gob.mx',NULL,NULL,'Edificio 6','Edificio 6','200004','5304','00:1B:2C:3D:4E:04','Cisco 8841','SN-ACT-0004','6','NODO-D','3',3,NULL,NULL,1,1,'Activo','Jefe - usuario activo para prueba de Arreglo Jefe-Secretaria','2026-08-12 20:48:53','2026-08-12 20:48:53'),(11,'Fernanda','Cruz','Aguilar','CRAF910505EE5','CRAF910505MOCRGN05','A004','Secretaria',NULL,NULL,NULL,'fernanda.cruz@oaxaca.gob.mx',NULL,NULL,'Edificio 6','Edificio 6','200005','5305','00:1B:2C:3D:4E:05','Cisco 7821','SN-ACT-0005','6','NODO-D','3',1,NULL,NULL,1,1,'Activo','Secretaria - usuario activo para prueba de Arreglo Jefe-Secretaria','2026-08-12 20:48:53','2026-08-12 20:48:53'),(12,'Sergio','Mendoza','Núñez','MENS750606FF6','MENS750606HOCNXR06','A005','Coordinador',NULL,NULL,NULL,'sergio.mendoza@oaxaca.gob.mx',NULL,NULL,'Edificio 2','Edificio 2','200006','5306','00:1B:2C:3D:4E:06','Cisco 7841','SN-ACT-0006','2','NODO-A','1',2,NULL,NULL,1,1,'Activo','Usuario activo para prueba de Cambio de DID','2026-08-12 20:48:53','2026-08-12 20:48:53'),(13,'Patricia','Ortega','Vega','ORVP930707GG7','ORVP930707MOCRGT07','A006','Jefa de Oficina',NULL,NULL,NULL,'patricia.ortega@oaxaca.gob.mx',NULL,NULL,'Edificio 3','Edificio 3','200007','5307','00:1B:2C:3D:4E:07','Cisco 7841','SN-ACT-0007','3','NODO-B','2',1,NULL,NULL,1,1,'Activo','Usuario activo para prueba de Cambio de Categoría','2026-08-12 20:48:53','2026-08-12 20:48:53');
/*!40000 ALTER TABLE `usuarios_telefonia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_dictamenes`
--

DROP TABLE IF EXISTS `v_dictamenes`;
/*!50001 DROP VIEW IF EXISTS `v_dictamenes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_dictamenes` AS SELECT 
 1 AS `id`,
 1 AS `folio_sistema`,
 1 AS `folio_dictamen`,
 1 AS `fecha_dictamen`,
 1 AS `dictamen`,
 1 AS `expediente`,
 1 AS `no_inventario`,
 1 AS `area`,
 1 AS `id_area`,
 1 AS `fecha_autoriza_dictamen`,
 1 AS `acuseDictamen`,
 1 AS `acuseMemo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_equipos`
--

DROP TABLE IF EXISTS `v_equipos`;
/*!50001 DROP VIEW IF EXISTS `v_equipos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_equipos` AS SELECT 
 1 AS `id`,
 1 AS `tipo`,
 1 AS `marca`,
 1 AS `modelo`,
 1 AS `sistema`,
 1 AS `no_serie`,
 1 AS `no_inventario`,
 1 AS `observacion`,
 1 AS `id_tipo`,
 1 AS `Mac`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_equipos_dictamen`
--

DROP TABLE IF EXISTS `v_equipos_dictamen`;
/*!50001 DROP VIEW IF EXISTS `v_equipos_dictamen`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_equipos_dictamen` AS SELECT 
 1 AS `id`,
 1 AS `id_solicitud`,
 1 AS `id_equipo`,
 1 AS `tipo`,
 1 AS `marca`,
 1 AS `modelo`,
 1 AS `no_serie`,
 1 AS `no_inventario`,
 1 AS `sistema`,
 1 AS `observacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_equipos_solicitud_uie`
--

DROP TABLE IF EXISTS `v_equipos_solicitud_uie`;
/*!50001 DROP VIEW IF EXISTS `v_equipos_solicitud_uie`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_equipos_solicitud_uie` AS SELECT 
 1 AS `id_solicitud`,
 1 AS `no_inventario`,
 1 AS `id_equipo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_historial_solicitudes`
--

DROP TABLE IF EXISTS `v_historial_solicitudes`;
/*!50001 DROP VIEW IF EXISTS `v_historial_solicitudes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_historial_solicitudes` AS SELECT 
 1 AS `id`,
 1 AS `solicitante`,
 1 AS `extension`,
 1 AS `area`,
 1 AS `descripcion`,
 1 AS `prioridad`,
 1 AS `fecha_solicitud`,
 1 AS `id_situacion`,
 1 AS `situacion`,
 1 AS `nombre`,
 1 AS `fecha_cierre`,
 1 AS `observaciones`,
 1 AS `edificio`,
 1 AS `nivel`,
 1 AS `id_poa`,
 1 AS `id_soporte`,
 1 AS `id_area`,
 1 AS `fecha_asignacion`,
 1 AS `num_documento`,
 1 AS `status_uie`,
 1 AS `acuseMemoRespuesta`,
 1 AS `memoSolicitud`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_servicios_dictamen`
--

DROP TABLE IF EXISTS `v_servicios_dictamen`;
/*!50001 DROP VIEW IF EXISTS `v_servicios_dictamen`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_servicios_dictamen` AS SELECT 
 1 AS `id`,
 1 AS `id_solicitud`,
 1 AS `servicio`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitud_uie`
--

DROP TABLE IF EXISTS `v_solicitud_uie`;
/*!50001 DROP VIEW IF EXISTS `v_solicitud_uie`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitud_uie` AS SELECT 
 1 AS `id`,
 1 AS `solicitante`,
 1 AS `area`,
 1 AS `num_documento`,
 1 AS `descripcion`,
 1 AS `prioridad`,
 1 AS `fecha_solicitud`,
 1 AS `id_situacion`,
 1 AS `situacion`,
 1 AS `tecnico`,
 1 AS `fecha_cierre`,
 1 AS `observaciones`,
 1 AS `fecha_asignacion`,
 1 AS `NoDictamen`,
 1 AS `ejercicio`,
 1 AS `folio`,
 1 AS `no_inventario`,
 1 AS `usr_crea`,
 1 AS `id_equipo`,
 1 AS `fecha_memo`,
 1 AS `fecha_memo_recibido`,
 1 AS `status_uie`,
 1 AS `acuseDictamen`,
 1 AS `memoSolicitud`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitudes`
--

DROP TABLE IF EXISTS `v_solicitudes`;
/*!50001 DROP VIEW IF EXISTS `v_solicitudes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitudes` AS SELECT 
 1 AS `id`,
 1 AS `solicitante`,
 1 AS `extension`,
 1 AS `area`,
 1 AS `descripcion`,
 1 AS `prioridad`,
 1 AS `fecha_solicitud`,
 1 AS `id_situacion`,
 1 AS `situacion`,
 1 AS `nombre`,
 1 AS `fecha_cierre`,
 1 AS `observaciones`,
 1 AS `edificio`,
 1 AS `nivel`,
 1 AS `id_poa`,
 1 AS `id_soporte`,
 1 AS `id_area`,
 1 AS `fecha_asignacion`,
 1 AS `NoDictamen`,
 1 AS `num_documento`,
 1 AS `seguimiento`,
 1 AS `poa`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitudes_asignadas`
--

DROP TABLE IF EXISTS `v_solicitudes_asignadas`;
/*!50001 DROP VIEW IF EXISTS `v_solicitudes_asignadas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitudes_asignadas` AS SELECT 
 1 AS `id`,
 1 AS `solicitante`,
 1 AS `extension`,
 1 AS `area`,
 1 AS `descripcion`,
 1 AS `prioridad`,
 1 AS `fecha_solicitud`,
 1 AS `id_situacion`,
 1 AS `situacion`,
 1 AS `nombre`,
 1 AS `fecha_cierre`,
 1 AS `observaciones`,
 1 AS `edificio`,
 1 AS `nivel`,
 1 AS `id_poa`,
 1 AS `id_soporte`,
 1 AS `id_area`,
 1 AS `fecha_asignacion`,
 1 AS `num_documento`,
 1 AS `status_uie`,
 1 AS `id_equipo`,
 1 AS `no_inventario`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitudes_correo`
--

DROP TABLE IF EXISTS `v_solicitudes_correo`;
/*!50001 DROP VIEW IF EXISTS `v_solicitudes_correo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitudes_correo` AS SELECT 
 1 AS `id`,
 1 AS `tipo_solicitud`,
 1 AS `nombre`,
 1 AS `puesto`,
 1 AS `area`,
 1 AS `area_interna`,
 1 AS `correo_secundario`,
 1 AS `telefono_contacto`,
 1 AS `correo_institucional`,
 1 AS `usuario_generado`,
 1 AS `motivo_baja`,
 1 AS `estatus`,
 1 AS `oficio_cgd`,
 1 AS `observaciones`,
 1 AS `fecha_creado_cgd`,
 1 AS `fecha_atendiendo_dgti`,
 1 AS `folio_glpi`,
 1 AS `observacion_glpi`,
 1 AS `fecha_activo`,
 1 AS `fecha_baja`,
 1 AS `usuario_mov`,
 1 AS `id_usuario_crea`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitudes_sin_asignar`
--

DROP TABLE IF EXISTS `v_solicitudes_sin_asignar`;
/*!50001 DROP VIEW IF EXISTS `v_solicitudes_sin_asignar`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitudes_sin_asignar` AS SELECT 
 1 AS `id`,
 1 AS `solicitante`,
 1 AS `extension`,
 1 AS `area`,
 1 AS `descripcion`,
 1 AS `prioridad`,
 1 AS `fecha_solicitud`,
 1 AS `id_situacion`,
 1 AS `situacion`,
 1 AS `edificio`,
 1 AS `nivel`,
 1 AS `num_documento`,
 1 AS `status_uie`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitudes_telefonia`
--

DROP TABLE IF EXISTS `v_solicitudes_telefonia`;
/*!50001 DROP VIEW IF EXISTS `v_solicitudes_telefonia`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitudes_telefonia` AS SELECT 
 1 AS `id`,
 1 AS `tramite`,
 1 AS `nombre`,
 1 AS `extension`,
 1 AS `puesto`,
 1 AS `estatus`,
 1 AS `usuario_id`,
 1 AS `did`,
 1 AS `categoria_id`,
 1 AS `correo_institucional`,
 1 AS `edificio`,
 1 AS `nivel`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_solicitudes_vpn`
--

DROP TABLE IF EXISTS `v_solicitudes_vpn`;
/*!50001 DROP VIEW IF EXISTS `v_solicitudes_vpn`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_solicitudes_vpn` AS SELECT 
 1 AS `id`,
 1 AS `nombre_usuario`,
 1 AS `puesto`,
 1 AS `area`,
 1 AS `dependencia`,
 1 AS `correo_institucional`,
 1 AS `telefono`,
 1 AS `extension`,
 1 AS `tipo_acceso`,
 1 AS `link_sistema`,
 1 AS `ip_puerto`,
 1 AS `justificacion_uso`,
 1 AS `fecha_inicio`,
 1 AS `fecha_fin`,
 1 AS `num_ticket`,
 1 AS `estatus`,
 1 AS `observaciones`,
 1 AS `folio_glpi`,
 1 AS `observacion_glpi`,
 1 AS `motivo_baja`,
 1 AS `fecha_creado_cgd`,
 1 AS `fecha_atendiendo_dgti`,
 1 AS `fecha_activo`,
 1 AS `fecha_baja`,
 1 AS `usuario_mov`,
 1 AS `id_usuario_crea`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_usuarios`
--

DROP TABLE IF EXISTS `v_usuarios`;
/*!50001 DROP VIEW IF EXISTS `v_usuarios`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_usuarios` AS SELECT 
 1 AS `id`,
 1 AS `usuario`,
 1 AS `ip`,
 1 AS `Nombre_Soporte`,
 1 AS `area`,
 1 AS `Tipo_Usuario`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'sistema_solicitudes'
--

--
-- Dumping routines for database 'sistema_solicitudes'
--

--
-- Final view structure for view `v_dictamenes`
--

/*!50001 DROP VIEW IF EXISTS `v_dictamenes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_dictamenes` AS select `dictamen`.`id` AS `id`,`solicitud`.`id` AS `folio_sistema`,concat(`dictamen`.`ejercicio`,'/',`dictamen`.`folio`) AS `folio_dictamen`,`dictamen`.`fecha_dictamen` AS `fecha_dictamen`,`dictamen`.`dictamen` AS `dictamen`,`dictamen`.`expediente` AS `expediente`,`v_equipos_solicitud_uie`.`no_inventario` AS `no_inventario`,`areas`.`area` AS `area`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_autoriza_dictamen` AS `fecha_autoriza_dictamen`,`acused`.`ruta_archivo` AS `acuseDictamen`,`amemo`.`ruta_archivo` AS `acuseMemo` from (((((`dictamen` join `solicitud` on((`dictamen`.`id_solicitud` = `solicitud`.`id`))) left join `v_equipos_solicitud_uie` on((`solicitud`.`id` = `v_equipos_solicitud_uie`.`id_solicitud`))) join `areas` on((`solicitud`.`id_area` = `areas`.`id`))) left join `solicitud_archivos` `acused` on(((`acused`.`id_solicitud` = `dictamen`.`id_solicitud`) and (`acused`.`tipo` = 'acuseDictamen')))) left join `solicitud_archivos` `amemo` on(((`amemo`.`id_solicitud` = `dictamen`.`id_solicitud`) and (`amemo`.`tipo` = 'memoSolicitud')))) where (`dictamen`.`id` <> 844) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_equipos`
--

/*!50001 DROP VIEW IF EXISTS `v_equipos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_equipos` AS select `datos_equipos`.`id` AS `id`,`cat_tipo_equipo`.`TipoEquipo` AS `tipo`,`cat_marca`.`marca` AS `marca`,`cat_modelo`.`modelo` AS `modelo`,`cat_so`.`sistema` AS `sistema`,`datos_equipos`.`no_serie` AS `no_serie`,`datos_equipos`.`no_inventario` AS `no_inventario`,`datos_equipos`.`observacion` AS `observacion`,`datos_equipos`.`id_tipo` AS `id_tipo`,`comp_equipos`.`Mac` AS `Mac` from (((((`datos_equipos` left join `cat_marca` on((`cat_marca`.`id` = `datos_equipos`.`id_marca`))) left join `cat_modelo` on((`cat_modelo`.`id` = `datos_equipos`.`id_modelo`))) left join `cat_so` on((`cat_so`.`id` = `datos_equipos`.`id_so`))) left join `cat_tipo_equipo` on((`cat_tipo_equipo`.`id` = `datos_equipos`.`id_tipo`))) left join `comp_equipos` on((`datos_equipos`.`id` = `comp_equipos`.`IdEquipo`))) where (`datos_equipos`.`status` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_equipos_dictamen`
--

/*!50001 DROP VIEW IF EXISTS `v_equipos_dictamen`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_equipos_dictamen` AS select `equipos_solicitud`.`id` AS `id`,`equipos_solicitud`.`id_solicitud` AS `id_solicitud`,`v_equipos`.`id` AS `id_equipo`,`v_equipos`.`tipo` AS `tipo`,`v_equipos`.`marca` AS `marca`,`v_equipos`.`modelo` AS `modelo`,`v_equipos`.`no_serie` AS `no_serie`,`v_equipos`.`no_inventario` AS `no_inventario`,`v_equipos`.`sistema` AS `sistema`,`v_equipos`.`observacion` AS `observacion` from (`v_equipos` join `equipos_solicitud` on((`v_equipos`.`id` = `equipos_solicitud`.`id_equipo`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_equipos_solicitud_uie`
--

/*!50001 DROP VIEW IF EXISTS `v_equipos_solicitud_uie`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_equipos_solicitud_uie` AS select `equipos_solicitud`.`id_solicitud` AS `id_solicitud`,group_concat(`datos_equipos`.`no_inventario` separator ',') AS `no_inventario`,group_concat(`datos_equipos`.`id` separator ',') AS `id_equipo` from (`equipos_solicitud` join `datos_equipos` on((`equipos_solicitud`.`id_equipo` = `datos_equipos`.`id`))) group by `equipos_solicitud`.`id_solicitud` order by `equipos_solicitud`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_historial_solicitudes`
--

/*!50001 DROP VIEW IF EXISTS `v_historial_solicitudes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_historial_solicitudes` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `nombre`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`id_poa` AS `id_poa`,`solicitud`.`id_soporte` AS `id_soporte`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`status_uie` AS `status_uie`,(select count(0) from `solicitud_archivos` where ((`solicitud_archivos`.`id_solicitud` = `solicitud`.`id`) and (`solicitud_archivos`.`tipo` = 'acuseMemoRespuesta'))) AS `acuseMemoRespuesta`,(select count(0) from `solicitud_archivos` where ((`solicitud_archivos`.`id_solicitud` = `solicitud`.`id`) and (`solicitud_archivos`.`tipo` = 'memoSolicitud'))) AS `memoSolicitud` from (((`solicitud` left join `areas` on((`solicitud`.`id_area` = `areas`.`id`))) join `situacion` on((`solicitud`.`id_situacion` = `situacion`.`id`))) left join `soporte` on((`solicitud`.`id_soporte` = `soporte`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_servicios_dictamen`
--

/*!50001 DROP VIEW IF EXISTS `v_servicios_dictamen`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_servicios_dictamen` AS select `servicios_solicitud`.`id` AS `id`,`servicios_solicitud`.`id_solicitud` AS `id_solicitud`,`cat_servicios`.`servicio` AS `servicio` from (`servicios_solicitud` left join `cat_servicios` on((`cat_servicios`.`id` = `servicios_solicitud`.`id_servicio`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitud_uie`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitud_uie`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitud_uie` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`areas`.`area` AS `area`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `tecnico`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,concat(`dictamen`.`folio`,'/',`dictamen`.`ejercicio`) AS `NoDictamen`,`dictamen`.`ejercicio` AS `ejercicio`,`dictamen`.`folio` AS `folio`,`v_equipos_solicitud_uie`.`no_inventario` AS `no_inventario`,`solicitud`.`usr_crea` AS `usr_crea`,`v_equipos_solicitud_uie`.`id_equipo` AS `id_equipo`,`solicitud`.`fecha_memo` AS `fecha_memo`,`solicitud`.`fecha_memo_recibido` AS `fecha_memo_recibido`,`solicitud`.`status_uie` AS `status_uie`,(select count(0) from `solicitud_archivos` where ((`solicitud_archivos`.`id_solicitud` = `solicitud`.`id`) and (`solicitud_archivos`.`tipo` = 'acuseDictamen'))) AS `acuseDictamen`,(select count(0) from `solicitud_archivos` where ((`solicitud_archivos`.`id_solicitud` = `solicitud`.`id`) and (`solicitud_archivos`.`tipo` = 'memoSolicitud'))) AS `memoSolicitud` from (((((`solicitud` left join `areas` on((`solicitud`.`id_area` = `areas`.`id`))) join `situacion` on((`solicitud`.`id_situacion` = `situacion`.`id`))) left join `soporte` on((`solicitud`.`id_soporte` = `soporte`.`id`))) left join `dictamen` on((`solicitud`.`id` = `dictamen`.`id_solicitud`))) left join `v_equipos_solicitud_uie` on((`solicitud`.`id` = `v_equipos_solicitud_uie`.`id_solicitud`))) where (`solicitud`.`status_uie` > 0) order by `dictamen`.`ejercicio` desc,`dictamen`.`folio` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitudes`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitudes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitudes` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `nombre`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`id_poa` AS `id_poa`,`solicitud`.`id_soporte` AS `id_soporte`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,concat(`dictamen`.`folio`,'/',`dictamen`.`ejercicio`) AS `NoDictamen`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`seguimiento` AS `seguimiento`,`cat_poa`.`poa` AS `poa` from (((((`solicitud` join `areas` on((`solicitud`.`id_area` = `areas`.`id`))) join `situacion` on((`solicitud`.`id_situacion` = `situacion`.`id`))) left join `soporte` on((`solicitud`.`id_soporte` = `soporte`.`id`))) left join `dictamen` on((`solicitud`.`id` = `dictamen`.`id_solicitud`))) left join `cat_poa` on((`solicitud`.`id_poa` = `cat_poa`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitudes_asignadas`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitudes_asignadas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitudes_asignadas` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `nombre`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`id_poa` AS `id_poa`,`solicitud`.`id_soporte` AS `id_soporte`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`status_uie` AS `status_uie`,`equipos_solicitud`.`id_equipo` AS `id_equipo`,`datos_equipos`.`no_inventario` AS `no_inventario` from (((((`solicitud` left join `areas` on((`solicitud`.`id_area` = `areas`.`id`))) join `situacion` on((`solicitud`.`id_situacion` = `situacion`.`id`))) left join `soporte` on((`solicitud`.`id_soporte` = `soporte`.`id`))) left join `equipos_solicitud` on((`solicitud`.`id` = `equipos_solicitud`.`id_solicitud`))) left join `datos_equipos` on((`datos_equipos`.`id` = `equipos_solicitud`.`id_equipo`))) where (`solicitud`.`id_situacion` = 2) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitudes_correo`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitudes_correo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitudes_correo` AS select `sc`.`id` AS `id`,`sc`.`tipo_solicitud` AS `tipo_solicitud`,`sc`.`nombre` AS `nombre`,`sc`.`puesto` AS `puesto`,`a`.`area` AS `area`,`sc`.`area_interna` AS `area_interna`,`sc`.`correo_secundario` AS `correo_secundario`,`sc`.`telefono_contacto` AS `telefono_contacto`,`sc`.`correo_institucional` AS `correo_institucional`,`sc`.`usuario_generado` AS `usuario_generado`,`sc`.`motivo_baja` AS `motivo_baja`,`sc`.`estatus` AS `estatus`,`sc`.`oficio_cgd` AS `oficio_cgd`,`sc`.`observaciones` AS `observaciones`,`sc`.`fecha_creado_cgd` AS `fecha_creado_cgd`,`sc`.`fecha_atendiendo_dgti` AS `fecha_atendiendo_dgti`,`sc`.`folio_glpi` AS `folio_glpi`,`sc`.`observacion_glpi` AS `observacion_glpi`,`sc`.`fecha_activo` AS `fecha_activo`,`sc`.`fecha_baja` AS `fecha_baja`,`sc`.`usuario_mov` AS `usuario_mov`,`sc`.`id_usuario_crea` AS `id_usuario_crea`,`sc`.`created_at` AS `created_at`,`sc`.`updated_at` AS `updated_at` from (`solicitud_correo` `sc` left join `areas` `a` on((`a`.`id` = `sc`.`id_area`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitudes_sin_asignar`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitudes_sin_asignar`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitudes_sin_asignar` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`status_uie` AS `status_uie` from ((`solicitud` join `areas` on((`solicitud`.`id_area` = `areas`.`id`))) join `situacion` on((`solicitud`.`id_situacion` = `situacion`.`id`))) where ((`solicitud`.`id_situacion` = 1) and (year(`solicitud`.`fecha_solicitud`) >= 2023)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitudes_telefonia`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitudes_telefonia`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitudes_telefonia` AS select `st`.`id` AS `id`,`st`.`tipo_tramite` AS `tramite`,concat(`ut`.`nombre`,' ',ifnull(`ut`.`apellido_paterno`,''),' ',ifnull(`ut`.`apellido_materno`,'')) AS `nombre`,`ut`.`extension` AS `extension`,`ut`.`puesto` AS `puesto`,`st`.`estatus` AS `estatus`,`st`.`usuario_id` AS `usuario_id`,`ut`.`did` AS `did`,`ut`.`categoria_id` AS `categoria_id`,`ut`.`correo_institucional` AS `correo_institucional`,`ut`.`edificio` AS `edificio`,`ut`.`nivel` AS `nivel`,`st`.`created_at` AS `created_at`,`st`.`updated_at` AS `updated_at` from (`solicitudes_telefonia` `st` left join `usuarios_telefonia` `ut` on((`ut`.`id` = `st`.`usuario_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_solicitudes_vpn`
--

/*!50001 DROP VIEW IF EXISTS `v_solicitudes_vpn`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_solicitudes_vpn` AS select `sv`.`id` AS `id`,`sv`.`nombre_usuario` AS `nombre_usuario`,`sv`.`puesto` AS `puesto`,`a`.`area` AS `area`,`sv`.`dependencia` AS `dependencia`,`sv`.`correo_institucional` AS `correo_institucional`,`sv`.`telefono` AS `telefono`,`sv`.`extension` AS `extension`,`sv`.`tipo_acceso` AS `tipo_acceso`,`sv`.`link_sistema` AS `link_sistema`,`sv`.`ip_puerto` AS `ip_puerto`,`sv`.`justificacion_uso` AS `justificacion_uso`,`sv`.`fecha_inicio` AS `fecha_inicio`,`sv`.`fecha_fin` AS `fecha_fin`,`sv`.`num_ticket` AS `num_ticket`,`sv`.`estatus` AS `estatus`,`sv`.`observaciones` AS `observaciones`,`sv`.`folio_glpi` AS `folio_glpi`,`sv`.`observacion_glpi` AS `observacion_glpi`,`sv`.`motivo_baja` AS `motivo_baja`,`sv`.`fecha_creado_cgd` AS `fecha_creado_cgd`,`sv`.`fecha_atendiendo_dgti` AS `fecha_atendiendo_dgti`,`sv`.`fecha_activo` AS `fecha_activo`,`sv`.`fecha_baja` AS `fecha_baja`,`sv`.`usuario_mov` AS `usuario_mov`,`sv`.`id_usuario_crea` AS `id_usuario_crea`,`sv`.`created_at` AS `created_at`,`sv`.`updated_at` AS `updated_at` from (`solicitud_vpn` `sv` left join `areas` `a` on((`a`.`id` = `sv`.`id_area`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_usuarios`
--

/*!50001 DROP VIEW IF EXISTS `v_usuarios`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_usuarios` AS select `u`.`id` AS `id`,`u`.`usuario` AS `usuario`,`u`.`ip` AS `ip`,`s`.`nombre` AS `Nombre_Soporte`,`a`.`area` AS `area`,`r`.`nombre` AS `Tipo_Usuario` from (((`usuarios` `u` left join `soporte` `s` on((`s`.`id` = `u`.`id_soporte`))) left join `areas` `a` on((`a`.`id` = `u`.`id_area`))) left join `roles` `r` on((`r`.`id` = `u`.`rol_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-15  0:30:44
