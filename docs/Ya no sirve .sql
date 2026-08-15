/*
 Navicat Premium Data Transfer

 Source Server         : 172.16.10.11
 Source Server Type    : MariaDB
 Source Server Version : 100508
 Source Host           : 172.16.10.11:3306
 Source Schema         : soportec

 Target Server Type    : MariaDB
 Target Server Version : 100508
 File Encoding         : 65001

 Date: 21/07/2026 14:56:04
*/

CREATE DATABASE IF NOT EXISTS `sistema_solicitudes` DEFAULT CHARACTER SET utf8mb4;
USE `sistema_solicitudes`;


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for areas
-- ----------------------------
DROP TABLE IF EXISTS `areas`;
CREATE TABLE `areas`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `siglas` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `titular` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_anio_denominacion
-- ----------------------------
DROP TABLE IF EXISTS `cat_anio_denominacion`;
CREATE TABLE `cat_anio_denominacion`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ejercicio` year NOT NULL,
  `denominacion` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_antivirus
-- ----------------------------
DROP TABLE IF EXISTS `cat_antivirus`;
CREATE TABLE `cat_antivirus`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `antivirus` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_autoriza_internet
-- ----------------------------
DROP TABLE IF EXISTS `cat_autoriza_internet`;
CREATE TABLE `cat_autoriza_internet`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cargo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'activo',
  `usuario_mov` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_avisos
-- ----------------------------
DROP TABLE IF EXISTS `cat_avisos`;
CREATE TABLE `cat_avisos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_cargo
-- ----------------------------
DROP TABLE IF EXISTS `cat_cargo`;
CREATE TABLE `cat_cargo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cargo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'activo',
  `usuario_mov` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 66 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_enlace_informatico
-- ----------------------------
DROP TABLE IF EXISTS `cat_enlace_informatico`;
CREATE TABLE `cat_enlace_informatico`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enlace` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `puesto` varchar(175) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `correo` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `ext` int(11) NULL DEFAULT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_firma_ofi_internet
-- ----------------------------
DROP TABLE IF EXISTS `cat_firma_ofi_internet`;
CREATE TABLE `cat_firma_ofi_internet`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cargo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipo` enum('titular','administrativo','tecnologias') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `estatus` enum('activo','inactivo') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'activo',
  `usuario_mov` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_marca
-- ----------------------------
DROP TABLE IF EXISTS `cat_marca`;
CREATE TABLE `cat_marca`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `marca` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_modelo
-- ----------------------------
DROP TABLE IF EXISTS `cat_modelo`;
CREATE TABLE `cat_modelo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_marca` int(11) NULL DEFAULT NULL,
  `modelo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 343 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_poa
-- ----------------------------
DROP TABLE IF EXISTS `cat_poa`;
CREATE TABLE `cat_poa`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poa` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_preguntas
-- ----------------------------
DROP TABLE IF EXISTS `cat_preguntas`;
CREATE TABLE `cat_preguntas`  (
  `id` int(11) NOT NULL,
  `pregunta` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fecha_creacion` datetime NULL DEFAULT NULL,
  `estatus` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_servicios
-- ----------------------------
DROP TABLE IF EXISTS `cat_servicios`;
CREATE TABLE `cat_servicios`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicio` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 77 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_so
-- ----------------------------
DROP TABLE IF EXISTS `cat_so`;
CREATE TABLE `cat_so`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sistema` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_software
-- ----------------------------
DROP TABLE IF EXISTS `cat_software`;
CREATE TABLE `cat_software`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `software` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` tinyint(4) NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for cat_tipo_equipo
-- ----------------------------
DROP TABLE IF EXISTS `cat_tipo_equipo`;
CREATE TABLE `cat_tipo_equipo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `TipoEquipo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for comp_equipos
-- ----------------------------
DROP TABLE IF EXISTS `comp_equipos`;
CREATE TABLE `comp_equipos`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdEquipo` int(11) NULL DEFAULT NULL,
  `IdArea` int(11) NULL DEFAULT NULL,
  `Resguardante` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Usuario` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Edificio` smallint(6) NULL DEFAULT NULL,
  `ENivel` char(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Puerto` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Switch` bit(1) NULL DEFAULT NULL,
  `Mac` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Conexion` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Nivel` char(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `NoTiket` int(11) NULL DEFAULT NULL,
  `usr` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 215 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for correo
-- ----------------------------
DROP TABLE IF EXISTS `correo`;
CREATE TABLE `correo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `alias` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for datos_equipos
-- ----------------------------
DROP TABLE IF EXISTS `datos_equipos`;
CREATE TABLE `datos_equipos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo` int(11) NULL DEFAULT NULL,
  `id_marca` int(11) NULL DEFAULT NULL,
  `id_modelo` int(11) NULL DEFAULT NULL,
  `id_so` int(11) NULL DEFAULT NULL,
  `no_serie` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `no_inventario` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mac_ethernet` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mac_wifi` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `observacion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'1',
  `usr` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1597 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dictamen
-- ----------------------------
DROP TABLE IF EXISTS `dictamen`;
CREATE TABLE `dictamen`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NULL DEFAULT NULL,
  `ejercicio` int(11) NULL DEFAULT NULL,
  `fecha_dictamen` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `id_equipo` int(11) NULL DEFAULT NULL,
  `folio` int(11) NULL DEFAULT NULL,
  `servicio` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `dictamen` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `expediente` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `copias` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fallas` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipo_falla` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sugiere_baja` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_solicitud`(`id_solicitud`, `ejercicio`, `folio`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2330 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for encuesta
-- ----------------------------
DROP TABLE IF EXISTS `encuesta`;
CREATE TABLE `encuesta`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NULL DEFAULT NULL,
  `id_pregunta` int(11) NULL DEFAULT NULL,
  `tipo_respuesta` enum('B','R','M') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `usuario` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fecha` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for equipos_solicitud
-- ----------------------------
DROP TABLE IF EXISTS `equipos_solicitud`;
CREATE TABLE `equipos_solicitud`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NULL DEFAULT NULL,
  `id_equipo` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2966 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ip_usuario
-- ----------------------------
DROP TABLE IF EXISTS `ip_usuario`;
CREATE TABLE `ip_usuario`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_soporte` int(11) NULL DEFAULT NULL,
  `ip` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for peticion_red
-- ----------------------------
DROP TABLE IF EXISTS `peticion_red`;
CREATE TABLE `peticion_red`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_equipo` int(11) NULL DEFAULT NULL,
  `usuario_equipo` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `edificio` int(11) NULL DEFAULT NULL,
  `nivel` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `puerto` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_so` int(11) NULL DEFAULT NULL,
  `mac` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `nivel_red` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `conexion` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for seriales_antivirus
-- ----------------------------
DROP TABLE IF EXISTS `seriales_antivirus`;
CREATE TABLE `seriales_antivirus`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `no_inventario` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_producto` int(11) NULL DEFAULT NULL,
  `clave_producto` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 82 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for servicios_solicitud
-- ----------------------------
DROP TABLE IF EXISTS `servicios_solicitud`;
CREATE TABLE `servicios_solicitud`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NULL DEFAULT NULL,
  `id_servicio` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 594 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for situacion
-- ----------------------------
DROP TABLE IF EXISTS `situacion`;
CREATE TABLE `situacion`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `situacion` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for software_equipo
-- ----------------------------
DROP TABLE IF EXISTS `software_equipo`;
CREATE TABLE `software_equipo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_equipo` int(11) NULL DEFAULT NULL,
  `id_software` int(11) NULL DEFAULT NULL,
  `licencia` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fecha` date NULL DEFAULT NULL,
  `usr` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fechausr` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 437 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for solicitud
-- ----------------------------
DROP TABLE IF EXISTS `solicitud`;
CREATE TABLE `solicitud`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `solicitante` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `puesto` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `extension` int(11) NULL DEFAULT NULL,
  `id_area` int(11) NULL DEFAULT NULL,
  `descripcion` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipo_documento` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `num_documento` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `prioridad` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_asignacion` timestamp NULL DEFAULT NULL,
  `usr_asigna` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_situacion` int(11) NULL DEFAULT 1,
  `id_soporte` int(11) NULL DEFAULT NULL,
  `fecha_cierre` datetime NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `edificio` int(11) NULL DEFAULT NULL,
  `nivel` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_poa` int(11) NULL DEFAULT NULL,
  `num_servicios` int(11) NULL DEFAULT 1,
  `ip` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `usr_crea` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status_uie` tinyint(1) NULL DEFAULT 0 COMMENT '0->generada por usuario, 1->generada por uie, 2->autorizada por uie para generar dictamen, 3->generado pra historial',
  `fecha_autoriza_dictamen` datetime NULL DEFAULT NULL,
  `fecha_memo` date NULL DEFAULT NULL,
  `fecha_memo_recibido` date NULL DEFAULT NULL,
  `seguimiento` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_area`(`id_area`) USING BTREE,
  INDEX `idx_soporte`(`id_soporte`) USING BTREE,
  INDEX `idx_status_uie`(`status_uie`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17521 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solicitud_archivos
-- ----------------------------
DROP TABLE IF EXISTS `solicitud_archivos`;
CREATE TABLE `solicitud_archivos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NULL DEFAULT NULL,
  `ruta_archivo` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipo` enum('acuseDictamen','memoSolicitud','acuseMemoRespuesta') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `usr_created` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_archivos`(`id_solicitud`, `tipo`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2026 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solicitud_archivos_bitacora
-- ----------------------------
DROP TABLE IF EXISTS `solicitud_archivos_bitacora`;
CREATE TABLE `solicitud_archivos_bitacora`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NULL DEFAULT NULL,
  `ruta_archivo` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipo` enum('acuseDictamen','memoSolicitud','acuseMemoRespuesta') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `usr_created` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  `usr_deleted` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1979 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solicitud_internet
-- ----------------------------
DROP TABLE IF EXISTS `solicitud_internet`;
CREATE TABLE `solicitud_internet`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_equipo` int(11) NOT NULL,
  `usuario_internet` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_cargo` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_autoriza` int(11) NOT NULL,
  `id_enlace` int(11) NULL DEFAULT 1,
  `correo` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tel_ext` int(11) NOT NULL,
  `tipo_conexion` enum('cableada','inalambrica') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tipo_solicitud` enum('nueva','cambio') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `edificio` enum('2','3','4','6') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nivel` enum('PB','1','2','3') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `puerto` int(11) NULL DEFAULT NULL,
  `justificacion` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `estatus` enum('generado_uie','atendiendo_dt','activo','eliminado','baja') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'generado_uie',
  `fecha_generado_uie` datetime NULL DEFAULT NULL COMMENT 'fecha en que se genera',
  `fecha_atendiendo_dt` datetime NULL DEFAULT NULL COMMENT 'fecha en que se imprimi el formato',
  `fecha_activo` datetime NULL DEFAULT NULL COMMENT 'fecha en que se activa el servicio',
  `motivo_actualizacion` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fecha_baja` datetime NULL DEFAULT NULL COMMENT 'fecha en que se da de baja el servicio',
  `motivo_baja` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `folio_glpi` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `observacion_glpi` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `oficio_cgd` varchar(75) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'número de oficio de la coordinación de gestión digital',
  `cpp_archivo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_titular` int(11) NULL DEFAULT NULL,
  `id_administrativo` int(11) NULL DEFAULT NULL,
  `id_tecnologias` int(11) NULL DEFAULT NULL,
  `usuario_mov` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_usuario_crea` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_equipo`(`id_equipo`) USING BTREE,
  INDEX `id_cargo`(`id_cargo`) USING BTREE,
  INDEX `id_area`(`id_area`) USING BTREE,
  INDEX `id_autoriza`(`id_autoriza`) USING BTREE,
  INDEX `id_usuario_crea`(`id_usuario_crea`) USING BTREE,
  INDEX `id_enlace`(`id_enlace`) USING BTREE,
  INDEX `id_titular`(`id_titular`) USING BTREE,
  INDEX `id_administrativo`(`id_administrativo`) USING BTREE,
  INDEX `id_tecnologias`(`id_tecnologias`) USING BTREE,
  CONSTRAINT `solicitud_internet_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `datos_equipos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_2` FOREIGN KEY (`id_cargo`) REFERENCES `cat_cargo` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_3` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_4` FOREIGN KEY (`id_autoriza`) REFERENCES `cat_autoriza_internet` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_5` FOREIGN KEY (`id_usuario_crea`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_internet_ibfk_6` FOREIGN KEY (`id_enlace`) REFERENCES `cat_enlace_informatico` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 292 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solicitud_internet_impresion
-- ----------------------------
DROP TABLE IF EXISTS `solicitud_internet_impresion`;
CREATE TABLE `solicitud_internet_impresion`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_solicitud_internet` int(10) UNSIGNED NOT NULL,
  `fecha` datetime NULL DEFAULT NULL,
  `oficio_cdg` varchar(75) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_usuario` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_solicitud_internet`(`id_solicitud_internet`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for soporte
-- ----------------------------
DROP TABLE IF EXISTS `soporte`;
CREATE TABLE `soporte`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `extension` int(11) NULL DEFAULT NULL,
  `siglas` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `expediente` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for telefonia
-- ----------------------------
DROP TABLE IF EXISTS `telefonia`;
CREATE TABLE `telefonia`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extension` int(11) NULL DEFAULT NULL,
  `modelo` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mac` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `serie` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'1',
  `nivel_tel` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for usuarios
-- ----------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `clave` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `new_clave` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pswd` blob NULL DEFAULT NULL,
  `id_soporte` int(11) NULL DEFAULT NULL,
  `id_area` int(11) NULL DEFAULT NULL,
  `nivel` smallint(6) NULL DEFAULT NULL,
  `ip` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cel` bigint(20) NULL DEFAULT NULL,
  `hrs` smallint(6) NULL DEFAULT NULL,
  `status` bit(1) NULL DEFAULT b'1',
  `nombre` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 77 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;


-- ----------------------------
-- View structure for v_equipos
-- ----------------------------
DROP VIEW IF EXISTS `v_equipos`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_equipos` AS select `datos_equipos`.`id` AS `id`,`cat_tipo_equipo`.`TipoEquipo` AS `tipo`,`cat_marca`.`marca` AS `marca`,`cat_modelo`.`modelo` AS `modelo`,`cat_so`.`sistema` AS `sistema`,`datos_equipos`.`no_serie` AS `no_serie`,`datos_equipos`.`no_inventario` AS `no_inventario`,`datos_equipos`.`observacion` AS `observacion`,`datos_equipos`.`id_tipo` AS `id_tipo`,`comp_equipos`.`Mac` AS `Mac` from (((((`datos_equipos` left join `cat_marca` on(`cat_marca`.`id` = `datos_equipos`.`id_marca`)) left join `cat_modelo` on(`cat_modelo`.`id` = `datos_equipos`.`id_modelo`)) left join `cat_so` on(`cat_so`.`id` = `datos_equipos`.`id_so`)) left join `cat_tipo_equipo` on(`cat_tipo_equipo`.`id` = `datos_equipos`.`id_tipo`)) left join `comp_equipos` on(`datos_equipos`.`id` = `comp_equipos`.`IdEquipo`)) where `datos_equipos`.`status` = 1;

-- ----------------------------
-- View structure for v_equipos_dictamen
-- ----------------------------
DROP VIEW IF EXISTS `v_equipos_dictamen`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_equipos_dictamen` AS select `equipos_solicitud`.`id` AS `id`,`equipos_solicitud`.`id_solicitud` AS `id_solicitud`,`v_equipos`.`id` AS `id_equipo`,`v_equipos`.`tipo` AS `tipo`,`v_equipos`.`marca` AS `marca`,`v_equipos`.`modelo` AS `modelo`,`v_equipos`.`no_serie` AS `no_serie`,`v_equipos`.`no_inventario` AS `no_inventario`,`v_equipos`.`sistema` AS `sistema`,`v_equipos`.`observacion` AS `observacion` from (`v_equipos` join `equipos_solicitud` on(`v_equipos`.`id` = `equipos_solicitud`.`id_equipo`));

-- ----------------------------
-- View structure for v_equipos_solicitud_uie
-- ----------------------------
DROP VIEW IF EXISTS `v_equipos_solicitud_uie`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_equipos_solicitud_uie` AS select `equipos_solicitud`.`id_solicitud` AS `id_solicitud`,group_concat(`datos_equipos`.`no_inventario` separator ',') AS `no_inventario`,group_concat(`datos_equipos`.`id` separator ',') AS `id_equipo` from (`equipos_solicitud` join `datos_equipos` on(`equipos_solicitud`.`id_equipo` = `datos_equipos`.`id`)) group by `equipos_solicitud`.`id_solicitud` order by `equipos_solicitud`.`id`;

-- ----------------------------
-- View structure for v_historial_solicitudes
-- ----------------------------
DROP VIEW IF EXISTS `v_historial_solicitudes`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_historial_solicitudes` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `nombre`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`id_poa` AS `id_poa`,`solicitud`.`id_soporte` AS `id_soporte`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`status_uie` AS `status_uie`,(select count(0) from `solicitud_archivos` where `solicitud_archivos`.`id_solicitud` = `solicitud`.`id` and `solicitud_archivos`.`tipo` = 'acuseMemoRespuesta') AS `acuseMemoRespuesta`,(select count(0) from `solicitud_archivos` where `solicitud_archivos`.`id_solicitud` = `solicitud`.`id` and `solicitud_archivos`.`tipo` = 'memoSolicitud') AS `memoSolicitud` from (((`solicitud` join `areas` on(`solicitud`.`id_area` = `areas`.`id`)) join `situacion` on(`solicitud`.`id_situacion` = `situacion`.`id`)) join `soporte` on(`solicitud`.`id_soporte` = `soporte`.`id`));

-- ----------------------------
-- View structure for v_servicios_dictamen
-- ----------------------------
DROP VIEW IF EXISTS `v_servicios_dictamen`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_servicios_dictamen` AS select `servicios_solicitud`.`id` AS `id`,`servicios_solicitud`.`id_solicitud` AS `id_solicitud`,`cat_servicios`.`servicio` AS `servicio` from (`servicios_solicitud` left join `cat_servicios` on(`cat_servicios`.`id` = `servicios_solicitud`.`id_servicio`));

-- ----------------------------
-- View structure for v_solicitudes
-- ----------------------------
DROP VIEW IF EXISTS `v_solicitudes`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_solicitudes` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `nombre`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`id_poa` AS `id_poa`,`solicitud`.`id_soporte` AS `id_soporte`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,concat(`dictamen`.`folio`,'/',`dictamen`.`ejercicio`) AS `NoDictamen`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`seguimiento` AS `seguimiento`,`cat_poa`.`poa` AS `poa` from (((((`solicitud` join `areas` on(`solicitud`.`id_area` = `areas`.`id`)) join `situacion` on(`solicitud`.`id_situacion` = `situacion`.`id`)) left join `soporte` on(`solicitud`.`id_soporte` = `soporte`.`id`)) left join `dictamen` on(`solicitud`.`id` = `dictamen`.`id_solicitud`)) left join `cat_poa` on(`solicitud`.`id_poa` = `cat_poa`.`id`));

-- ----------------------------
-- View structure for v_solicitudes_asignadas
-- ----------------------------
DROP VIEW IF EXISTS `v_solicitudes_asignadas`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_solicitudes_asignadas` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `nombre`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`id_poa` AS `id_poa`,`solicitud`.`id_soporte` AS `id_soporte`,`areas`.`id` AS `id_area`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`status_uie` AS `status_uie`,`equipos_solicitud`.`id_equipo` AS `id_equipo`,`datos_equipos`.`no_inventario` AS `no_inventario` from (((((`solicitud` join `areas` on(`solicitud`.`id_area` = `areas`.`id`)) join `situacion` on(`solicitud`.`id_situacion` = `situacion`.`id`)) join `soporte` on(`solicitud`.`id_soporte` = `soporte`.`id`)) left join `equipos_solicitud` on(`solicitud`.`id` = `equipos_solicitud`.`id_solicitud`)) left join `datos_equipos` on(`datos_equipos`.`id` = `equipos_solicitud`.`id_equipo`)) where `solicitud`.`id_situacion` = 2;

-- ----------------------------
-- View structure for v_solicitudes_sin_asignar
-- ----------------------------
DROP VIEW IF EXISTS `v_solicitudes_sin_asignar`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_solicitudes_sin_asignar` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`solicitud`.`extension` AS `extension`,`areas`.`area` AS `area`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`solicitud`.`edificio` AS `edificio`,`solicitud`.`nivel` AS `nivel`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`status_uie` AS `status_uie` from ((`solicitud` join `areas` on(`solicitud`.`id_area` = `areas`.`id`)) join `situacion` on(`solicitud`.`id_situacion` = `situacion`.`id`)) where `solicitud`.`id_situacion` = 1 and year(`solicitud`.`fecha_solicitud`) >= 2023;

-- ----------------------------
-- View structure for v_solicitud_uie
-- ----------------------------
DROP VIEW IF EXISTS `v_solicitud_uie`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_solicitud_uie` AS select `solicitud`.`id` AS `id`,`solicitud`.`solicitante` AS `solicitante`,`areas`.`area` AS `area`,`solicitud`.`num_documento` AS `num_documento`,`solicitud`.`descripcion` AS `descripcion`,`solicitud`.`prioridad` AS `prioridad`,`solicitud`.`fecha_solicitud` AS `fecha_solicitud`,`solicitud`.`id_situacion` AS `id_situacion`,`situacion`.`situacion` AS `situacion`,`soporte`.`nombre` AS `tecnico`,`solicitud`.`fecha_cierre` AS `fecha_cierre`,`solicitud`.`observaciones` AS `observaciones`,`solicitud`.`fecha_asignacion` AS `fecha_asignacion`,concat(`dictamen`.`folio`,'/',`dictamen`.`ejercicio`) AS `NoDictamen`,`dictamen`.`ejercicio` AS `ejercicio`,`dictamen`.`folio` AS `folio`,`v_equipos_solicitud_uie`.`no_inventario` AS `no_inventario`,`solicitud`.`usr_crea` AS `usr_crea`,`v_equipos_solicitud_uie`.`id_equipo` AS `id_equipo`,`solicitud`.`fecha_memo` AS `fecha_memo`,`solicitud`.`fecha_memo_recibido` AS `fecha_memo_recibido`,`solicitud`.`status_uie` AS `status_uie`,(select count(0) from `solicitud_archivos` where `solicitud_archivos`.`id_solicitud` = `solicitud`.`id` and `solicitud_archivos`.`tipo` = 'acuseDictamen') AS `acuseDictamen`,(select count(0) from `solicitud_archivos` where `solicitud_archivos`.`id_solicitud` = `solicitud`.`id` and `solicitud_archivos`.`tipo` = 'memoSolicitud') AS `memoSolicitud` from (((((`solicitud` join `areas` on(`solicitud`.`id_area` = `areas`.`id`)) join `situacion` on(`solicitud`.`id_situacion` = `situacion`.`id`)) left join `soporte` on(`solicitud`.`id_soporte` = `soporte`.`id`)) left join `dictamen` on(`solicitud`.`id` = `dictamen`.`id_solicitud`)) left join `v_equipos_solicitud_uie` on(`solicitud`.`id` = `v_equipos_solicitud_uie`.`id_solicitud`)) where `solicitud`.`status_uie` > 0 order by `dictamen`.`ejercicio` desc,`dictamen`.`folio` desc;

-- ----------------------------
-- View structure for v_usuarios
-- ----------------------------
DROP VIEW IF EXISTS `v_usuarios`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_usuarios` AS select `usuarios`.`id` AS `id`,`usuarios`.`usuario` AS `usuario`,`usuarios`.`ip` AS `ip`,`soporte`.`nombre` AS `Nombre_Soporte`,`areas`.`area` AS `area`,case `usuarios`.`nivel` when 1 then 'USUARIO SOLICITUD' when 2 then 'SOPORTE TÉCNICO' when 3 then 'ADMINISTRADOR' else 'SIN NIVEL' end AS `Tipo_Usuario` from ((`usuarios` left join `soporte` on(`soporte`.`id` = `usuarios`.`id_soporte`)) left join `areas` on(`areas`.`id` = `usuarios`.`id_area`));

-- ----------------------------
-- View structure for v_dictamenes
-- ----------------------------
DROP VIEW IF EXISTS `v_dictamenes`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_dictamenes` AS select `dictamen`.`id` AS `id`,`solicitud`.`id` AS `folio_sistema`,concat(`dictamen`.`ejercicio`,'/',`dictamen`.`folio`) AS `folio_dictamen`,`dictamen`.`fecha_dictamen` AS `fecha_dictamen`,`dictamen`.`dictamen` AS `dictamen`,`dictamen`.`expediente` AS `expediente`,`v_equipos_solicitud_uie`.`no_inventario` AS `no_inventario`,`areas`.`area` AS `area`,`acused`.`ruta_archivo` AS `acuseDictamen`,`amemo`.`ruta_archivo` AS `acuseMemo` from (((((`dictamen` join `solicitud` on(`dictamen`.`id_solicitud` = `solicitud`.`id`)) join `v_equipos_solicitud_uie` on(`solicitud`.`id` = `v_equipos_solicitud_uie`.`id_solicitud`)) join `areas` on(`solicitud`.`id_area` = `areas`.`id`)) left join `solicitud_archivos` `acused` on(`acused`.`id_solicitud` = `dictamen`.`id_solicitud` and `acused`.`tipo` = 'acuseDictamen')) left join `solicitud_archivos` `amemo` on(`amemo`.`id_solicitud` = `dictamen`.`id_solicitud` and `amemo`.`tipo` = 'memoSolicitud')) where `dictamen`.`id` <> 844;



SET FOREIGN_KEY_CHECKS = 1;














CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 


INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Control total del sistema'),
('Soporte Técnico', 'Atiende y administra solicitudes de soporte'),
('Capturista','Captura solicitudes de dictamenes'),
('Usuario Solicitante', 'Genera solicitudes de soporte');



ALTER TABLE usuarios
ADD COLUMN rol_id BIGINT UNSIGNED NULL AFTER nombre;

ALTER TABLE usuarios
ADD CONSTRAINT fk_usuarios_roles
FOREIGN KEY (rol_id)
REFERENCES roles(id);


ALTER TABLE usuarios
DROP COLUMN nivel;



CREATE TABLE cat_categoria_telefonia (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    estatus ENUM('activo','inactivo') DEFAULT 'activo',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE cat_tipo_clave (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre ENUM('PIN','CN') NOT NULL
);

CREATE TABLE usuarios_telefonia (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),

    rfc VARCHAR(13),
    curp VARCHAR(18),

    clave_puesto VARCHAR(30),
    puesto VARCHAR(200),
    nivel_puesto VARCHAR(30),

    dependencia_id BIGINT UNSIGNED,
    area_id BIGINT UNSIGNED,

    correo_institucional VARCHAR(150),
    correo_externo VARCHAR(150),
    correo_jefe VARCHAR(150),

    direccion VARCHAR(200),
    ubicacion VARCHAR(200),

    extension VARCHAR(10) UNIQUE,
    did VARCHAR(20),

    mac VARCHAR(30),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),

    edificio VARCHAR(20),
    nodo VARCHAR(50),
    nivel VARCHAR(20),

    categoria_id BIGINT UNSIGNED,

    internet BOOLEAN DEFAULT FALSE,
    equipo_computo BOOLEAN DEFAULT FALSE,

    status ENUM(
        'Activo',
        'Suspendido',
        'Baja',
        'Mantenimiento'
    ) DEFAULT 'Activo',

    observaciones TEXT,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE jefe_secretaria (

    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    jefe_id BIGINT UNSIGNED NOT NULL,

    secretaria_id BIGINT UNSIGNED NOT NULL,

    mismos_privilegios BOOLEAN DEFAULT FALSE,

    observaciones TEXT,

    estatus ENUM(
        'activo',
        'inactivo'
    ) DEFAULT 'activo',

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (jefe_id)
        REFERENCES usuarios_telefonia(id),

    FOREIGN KEY (secretaria_id)
        REFERENCES usuarios_telefonia(id)
);

CREATE TABLE solicitudes_telefonia (

    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    usuario_id BIGINT UNSIGNED,

    tipo_tramite ENUM(
        'SOLICITAR_TELEFONO',
        'CAMBIO_PIN_CN',
        'CAMBIO_USUARIO',
        'MODIFICAR_DATOS',
        'JEFE_SECRETARIA',
        'CAMBIO_DID',
        'CAMBIO_CATEGORIA',
        'FAX',
        'CAMBIO_FAX',
        'OTROS'
    ),

    estatus ENUM(
        'GENERADA',
        'EN_PROCESO',
        'AUTORIZADA',
        'RECHAZADA',
        'FINALIZADA'
    ) DEFAULT 'GENERADA',

    observaciones TEXT,

    usuario_mov VARCHAR(100),

    created_at TIMESTAMP NULL,

    updated_at TIMESTAMP NULL
);