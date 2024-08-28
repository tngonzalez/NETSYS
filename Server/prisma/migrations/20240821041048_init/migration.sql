-- CreateTable
CREATE TABLE `EstadoProyecto` (
    `idEstProyecto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstProyecto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoDanado` (
    `idEstDanado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstDanado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoRetiro` (
    `idEstRetiro` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstRetiro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoProyecto` (
    `idTipoProyecto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idTipoProyecto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoRouter` (
    `idEstRouter` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstRouter`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tipo_OLT` (
    `idTipo_OLT` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idTipo_OLT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estado_Instalacion` (
    `idEstInstalacion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstInstalacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Router` (
    `idRouter` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstRouter` INTEGER NOT NULL,
    `numActivo` INTEGER NOT NULL,
    `serie` VARCHAR(150) NOT NULL,
    `macAddress` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`idRouter`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OLT` (
    `idOLT` INTEGER NOT NULL AUTO_INCREMENT,
    `idTipo_OLT` INTEGER NOT NULL,
    `num_OLT` INTEGER NOT NULL,
    `ODF` INTEGER NOT NULL,
    `segmentoZona` VARCHAR(100) NOT NULL,
    `zona` VARCHAR(50) NOT NULL,
    `ipGeneral` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`idOLT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ONT` (
    `idONT` INTEGER NOT NULL AUTO_INCREMENT,
    `potenciaRecepcion` VARCHAR(70) NOT NULL,
    `numActivo` INTEGER NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `numSN` VARCHAR(70) NOT NULL,

    PRIMARY KEY (`idONT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proyecto` (
    `idProyecto` INTEGER NOT NULL AUTO_INCREMENT,
    `idTipoProyecto` INTEGER NOT NULL,
    `idONT` INTEGER NOT NULL,
    `numCliente` VARCHAR(70) NOT NULL,
    `nombreCliente` VARCHAR(70) NOT NULL,
    `plan` VARCHAR(70) NOT NULL,
    `numOS` INTEGER NOT NULL,
    `PuertoNAT` INTEGER NOT NULL,
    `CajaDerivada` VARCHAR(70) NOT NULL,
    `idEstProyecto` INTEGER NOT NULL,
    `BW` INTEGER NOT NULL,
    `BW_KBPS` INTEGER NOT NULL,
    `idRouter` INTEGER NOT NULL,
    `comentario` VARCHAR(100) NOT NULL,
    `fecInstalacion` DATETIME(3) NOT NULL,
    `agente` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idProyecto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subredes_OLT` (
    `idRed` INTEGER NOT NULL AUTO_INCREMENT,
    `idProyecto` INTEGER NOT NULL,
    `idOLT` INTEGER NOT NULL,
    `ip` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idRed`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Condominio` (
    `idCondominio` INTEGER NOT NULL AUTO_INCREMENT,
    `idProyecto` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `numCasa` INTEGER NOT NULL,
    `cloudMonitoreo` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idCondominio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consecutivo` (
    `idConsecutivo` INTEGER NOT NULL AUTO_INCREMENT,
    `idProyecto` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `cloudMonitoreo` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idConsecutivo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direccionamiento_IP` (
    `idDireccionamiento` INTEGER NOT NULL AUTO_INCREMENT,
    `idProyecto` INTEGER NOT NULL,
    `subred` VARCHAR(50) NOT NULL,
    `gateway` VARCHAR(80) NOT NULL,
    `clienteIP` VARCHAR(50) NOT NULL,
    `broadcast` VARCHAR(50) NOT NULL,
    `punto` VARCHAR(50) NOT NULL,
    `nota` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`idDireccionamiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Retiro` (
    `idRetiro` INTEGER NOT NULL AUTO_INCREMENT,
    `idCondominio` INTEGER NOT NULL,
    `osInstalado` INTEGER NOT NULL,
    `idEstRetiro` INTEGER NOT NULL,
    `fecDesinstalacion` DATETIME(3) NOT NULL,
    `agente` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idRetiro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estropeado` (
    `idEstropeado` INTEGER NOT NULL AUTO_INCREMENT,
    `idCondominio` INTEGER NOT NULL,
    `fecInstalacion` DATETIME(3) NOT NULL,
    `dispostivo` VARCHAR(100) NOT NULL,
    `direccionNueva` VARCHAR(100) NOT NULL,
    `comentario` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idEstropeado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DNS_Stick` (
    `idDNS` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(50) NOT NULL,
    `clave` VARCHAR(50) NOT NULL,
    `macAddress` VARCHAR(50) NOT NULL,
    `dns` VARCHAR(50) NOT NULL,
    `fecInstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idDNS`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LDF_IPTV` (
    `idLDF` INTEGER NOT NULL AUTO_INCREMENT,
    `idCondominio` INTEGER NOT NULL,
    `idEstProyecto` INTEGER NOT NULL,
    `fecInstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(100) NOT NULL,
    `agente` VARCHAR(50) NOT NULL,
    `macAddress` VARCHAR(50) NOT NULL,
    `idDNS` INTEGER NOT NULL,
    `correo` VARCHAR(50) NOT NULL,
    `clave` VARCHAR(50) NOT NULL,
    `plan` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idLDF`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Panica_IPTV` (
    `idPanica` INTEGER NOT NULL AUTO_INCREMENT,
    `idConsecutivo` INTEGER NOT NULL,
    `idEstProyecto` INTEGER NOT NULL,
    `fecInstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(100) NOT NULL,
    `agente` VARCHAR(50) NOT NULL,
    `macAddress` VARCHAR(50) NOT NULL,
    `idDNS` INTEGER NOT NULL,
    `correo` VARCHAR(50) NOT NULL,
    `clave` VARCHAR(50) NOT NULL,
    `plan` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idPanica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Router` ADD CONSTRAINT `Router_idEstRouter_fkey` FOREIGN KEY (`idEstRouter`) REFERENCES `EstadoRouter`(`idEstRouter`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OLT` ADD CONSTRAINT `OLT_idTipo_OLT_fkey` FOREIGN KEY (`idTipo_OLT`) REFERENCES `Tipo_OLT`(`idTipo_OLT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyecto` ADD CONSTRAINT `Proyecto_idTipoProyecto_fkey` FOREIGN KEY (`idTipoProyecto`) REFERENCES `TipoProyecto`(`idTipoProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyecto` ADD CONSTRAINT `Proyecto_idONT_fkey` FOREIGN KEY (`idONT`) REFERENCES `ONT`(`idONT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyecto` ADD CONSTRAINT `Proyecto_idEstProyecto_fkey` FOREIGN KEY (`idEstProyecto`) REFERENCES `EstadoProyecto`(`idEstProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyecto` ADD CONSTRAINT `Proyecto_idRouter_fkey` FOREIGN KEY (`idRouter`) REFERENCES `Router`(`idRouter`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subredes_OLT` ADD CONSTRAINT `Subredes_OLT_idProyecto_fkey` FOREIGN KEY (`idProyecto`) REFERENCES `Proyecto`(`idProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subredes_OLT` ADD CONSTRAINT `Subredes_OLT_idOLT_fkey` FOREIGN KEY (`idOLT`) REFERENCES `OLT`(`idOLT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Condominio` ADD CONSTRAINT `Condominio_idProyecto_fkey` FOREIGN KEY (`idProyecto`) REFERENCES `Proyecto`(`idProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consecutivo` ADD CONSTRAINT `Consecutivo_idProyecto_fkey` FOREIGN KEY (`idProyecto`) REFERENCES `Proyecto`(`idProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccionamiento_IP` ADD CONSTRAINT `Direccionamiento_IP_idProyecto_fkey` FOREIGN KEY (`idProyecto`) REFERENCES `Proyecto`(`idProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_idCondominio_fkey` FOREIGN KEY (`idCondominio`) REFERENCES `Condominio`(`idCondominio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_idEstRetiro_fkey` FOREIGN KEY (`idEstRetiro`) REFERENCES `EstadoRetiro`(`idEstRetiro`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estropeado` ADD CONSTRAINT `Estropeado_idCondominio_fkey` FOREIGN KEY (`idCondominio`) REFERENCES `Condominio`(`idCondominio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LDF_IPTV` ADD CONSTRAINT `LDF_IPTV_idEstProyecto_fkey` FOREIGN KEY (`idEstProyecto`) REFERENCES `EstadoProyecto`(`idEstProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LDF_IPTV` ADD CONSTRAINT `LDF_IPTV_idCondominio_fkey` FOREIGN KEY (`idCondominio`) REFERENCES `Condominio`(`idCondominio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LDF_IPTV` ADD CONSTRAINT `LDF_IPTV_idDNS_fkey` FOREIGN KEY (`idDNS`) REFERENCES `DNS_Stick`(`idDNS`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Panica_IPTV` ADD CONSTRAINT `Panica_IPTV_idEstProyecto_fkey` FOREIGN KEY (`idEstProyecto`) REFERENCES `EstadoProyecto`(`idEstProyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Panica_IPTV` ADD CONSTRAINT `Panica_IPTV_idConsecutivo_fkey` FOREIGN KEY (`idConsecutivo`) REFERENCES `Consecutivo`(`idConsecutivo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Panica_IPTV` ADD CONSTRAINT `Panica_IPTV_idDNS_fkey` FOREIGN KEY (`idDNS`) REFERENCES `DNS_Stick`(`idDNS`) ON DELETE RESTRICT ON UPDATE CASCADE;
