-- CreateTable
CREATE TABLE `TipoCliente` (
    `idTipo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idTipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ONT` (
    `idONT` INTEGER NOT NULL AUTO_INCREMENT,
    `potenciaRecepcion` VARCHAR(100) NOT NULL,
    `numActivo` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `numSN` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `ONT_numActivo_key`(`numActivo`),
    UNIQUE INDEX `ONT_macAddress_key`(`macAddress`),
    PRIMARY KEY (`idONT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoCliente` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoRouter` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Router` (
    `idRouter` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstado` INTEGER NOT NULL,
    `numActivo` VARCHAR(50) NOT NULL,
    `serie` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `tipoDispositivo` VARCHAR(50) NOT NULL,
    `idSubred_OLT` INTEGER NULL,
    `idZona_OLT` INTEGER NULL,
    `idOLT` INTEGER NULL,

    UNIQUE INDEX `Router_numActivo_key`(`numActivo`),
    UNIQUE INDEX `Router_serie_key`(`serie`),
    UNIQUE INDEX `Router_macAddress_key`(`macAddress`),
    PRIMARY KEY (`idRouter`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OLT` (
    `idOLT` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreTipo` VARCHAR(100) NOT NULL,
    `ODF` INTEGER NOT NULL,
    `segmentoZona` VARCHAR(50) NOT NULL,
    `ipGeneral` VARCHAR(50) NOT NULL,
    `puertoNAT` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `OLT_nombreTipo_key`(`nombreTipo`),
    UNIQUE INDEX `OLT_ipGeneral_key`(`ipGeneral`),
    PRIMARY KEY (`idOLT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subred_OLT` (
    `idRed` INTEGER NOT NULL AUTO_INCREMENT,
    `idOLT` INTEGER NOT NULL,
    `ip` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Subred_OLT_ip_key`(`ip`),
    PRIMARY KEY (`idRed`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zona_OLT` (
    `idZona` INTEGER NOT NULL AUTO_INCREMENT,
    `idOLT` INTEGER NOT NULL,
    `nombreZona` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idZona`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Condominio` (
    `idCondominio` INTEGER NOT NULL AUTO_INCREMENT,
    `zona` VARCHAR(100) NOT NULL,
    `numCasa` INTEGER NOT NULL,

    PRIMARY KEY (`idCondominio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfoCliente` (
    `idInfoCliente` INTEGER NOT NULL AUTO_INCREMENT,
    `idCondominio` INTEGER NOT NULL,
    `numero` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idInfoCliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BW` (
    `idBW` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idBW`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `idCliente` INTEGER NOT NULL AUTO_INCREMENT,
    `idInfoCliente` INTEGER NOT NULL,
    `idTipo` INTEGER NOT NULL,
    `idONT` INTEGER NOT NULL,
    `idEstado` INTEGER NOT NULL,
    `idRouter` INTEGER NULL,
    `idBW` INTEGER NOT NULL,
    `BW_KBPS` INTEGER NOT NULL,
    `numOS` INTEGER NOT NULL,
    `cajaDerivada` VARCHAR(150) NOT NULL,
    `fechaInstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(200) NOT NULL,
    `agente` VARCHAR(100) NOT NULL,
    `cloudMonitoreo` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `Cliente_cloudMonitoreo_key`(`cloudMonitoreo`),
    PRIMARY KEY (`idCliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoRetiro` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Retiro` (
    `idRetiro` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `idEstado` INTEGER NOT NULL,
    `fechaDesinstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(200) NOT NULL,
    `agente` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idRetiro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoDano` (
    `idDano` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idDano`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Danado` (
    `idDanado` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `fechaInstalacion` DATETIME(3) NOT NULL,
    `dispositivo` VARCHAR(150) NOT NULL,
    `direccionNueva` VARCHAR(100) NOT NULL,
    `direccionActual` VARCHAR(100) NOT NULL,
    `comentario` VARCHAR(200) NOT NULL,
    `idTipo` INTEGER NOT NULL,

    PRIMARY KEY (`idDanado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoInstalacion` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DNS_Stick` (
    `idDNS` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(100) NOT NULL,
    `clave` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `dns` VARCHAR(100) NOT NULL,
    `fechaInstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `DNS_Stick_macAddress_key`(`macAddress`),
    PRIMARY KEY (`idDNS`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IPTV` (
    `idIPTV` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `idEstado` INTEGER NOT NULL,
    `idDNS` INTEGER NOT NULL,
    `fechaInstalacion` DATETIME(3) NOT NULL,
    `comentario` VARCHAR(200) NOT NULL,
    `agente` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `clave` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `IPTV_macAddress_key`(`macAddress`),
    PRIMARY KEY (`idIPTV`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IpPublica` (
    `idIP` INTEGER NOT NULL AUTO_INCREMENT,
    `idInfoCliente` INTEGER NOT NULL,
    `red` VARCHAR(100) NOT NULL,
    `gateway` VARCHAR(100) NOT NULL,
    `cliente` VARCHAR(100) NOT NULL,
    `broadcast` VARCHAR(100) NOT NULL,
    `punto` VARCHAR(100) NOT NULL,
    `nota` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `IpPublica_red_key`(`red`),
    UNIQUE INDEX `IpPublica_gateway_key`(`gateway`),
    UNIQUE INDEX `IpPublica_cliente_key`(`cliente`),
    UNIQUE INDEX `IpPublica_broadcast_key`(`broadcast`),
    PRIMARY KEY (`idIP`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Router` ADD CONSTRAINT `Router_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoRouter`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Router` ADD CONSTRAINT `Router_idOLT_fkey` FOREIGN KEY (`idOLT`) REFERENCES `OLT`(`idOLT`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Router` ADD CONSTRAINT `Router_idSubred_OLT_fkey` FOREIGN KEY (`idSubred_OLT`) REFERENCES `Subred_OLT`(`idRed`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Router` ADD CONSTRAINT `Router_idZona_OLT_fkey` FOREIGN KEY (`idZona_OLT`) REFERENCES `Zona_OLT`(`idZona`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subred_OLT` ADD CONSTRAINT `Subred_OLT_idOLT_fkey` FOREIGN KEY (`idOLT`) REFERENCES `OLT`(`idOLT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zona_OLT` ADD CONSTRAINT `Zona_OLT_idOLT_fkey` FOREIGN KEY (`idOLT`) REFERENCES `OLT`(`idOLT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfoCliente` ADD CONSTRAINT `InfoCliente_idCondominio_fkey` FOREIGN KEY (`idCondominio`) REFERENCES `Condominio`(`idCondominio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idInfoCliente_fkey` FOREIGN KEY (`idInfoCliente`) REFERENCES `InfoCliente`(`idInfoCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idTipo_fkey` FOREIGN KEY (`idTipo`) REFERENCES `TipoCliente`(`idTipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idONT_fkey` FOREIGN KEY (`idONT`) REFERENCES `ONT`(`idONT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoCliente`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idBW_fkey` FOREIGN KEY (`idBW`) REFERENCES `BW`(`idBW`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idRouter_fkey` FOREIGN KEY (`idRouter`) REFERENCES `Router`(`idRouter`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoRetiro`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Danado` ADD CONSTRAINT `Danado_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Danado` ADD CONSTRAINT `Danado_idTipo_fkey` FOREIGN KEY (`idTipo`) REFERENCES `TipoDano`(`idDano`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoInstalacion`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idDNS_fkey` FOREIGN KEY (`idDNS`) REFERENCES `DNS_Stick`(`idDNS`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IpPublica` ADD CONSTRAINT `IpPublica_idInfoCliente_fkey` FOREIGN KEY (`idInfoCliente`) REFERENCES `InfoCliente`(`idInfoCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;
