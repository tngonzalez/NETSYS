-- CreateTable
CREATE TABLE `TipoCliente` (
    `idTipo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `TipoCliente_nombre_key`(`nombre`),
    PRIMARY KEY (`idTipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoCliente` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoActivo` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ONT` (
    `idONT` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstado` INTEGER NOT NULL,
    `numActivo` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `numSN` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `ONT_numActivo_key`(`numActivo`),
    UNIQUE INDEX `ONT_macAddress_key`(`macAddress`),
    PRIMARY KEY (`idONT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Router_Casa` (
    `idRouter_Casa` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstado` INTEGER NOT NULL,
    `numActivo` VARCHAR(50) NOT NULL,
    `serie` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Router_Casa_numActivo_key`(`numActivo`),
    UNIQUE INDEX `Router_Casa_serie_key`(`serie`),
    UNIQUE INDEX `Router_Casa_macAddress_key`(`macAddress`),
    PRIMARY KEY (`idRouter_Casa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Router_Gestor` (
    `idRouter_Gestor` INTEGER NOT NULL AUTO_INCREMENT,
    `idSubred_OLT` INTEGER NOT NULL,
    `idOLT` INTEGER NOT NULL,

    PRIMARY KEY (`idRouter_Gestor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OLT` (
    `idOLT` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreTipo` VARCHAR(100) NOT NULL,
    `ODF` INTEGER NOT NULL,
    `segmentoZona` VARCHAR(50) NOT NULL,
    `ipGeneral` VARCHAR(50) NOT NULL,
    `puertoNAT` VARCHAR(50) NOT NULL,
    `numOLT` INTEGER NOT NULL,

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
CREATE TABLE `Condominio` (
    `idCondominio` INTEGER NOT NULL AUTO_INCREMENT,
    `zona` VARCHAR(100) NOT NULL,
    `numCasa` VARCHAR(100) NULL,

    PRIMARY KEY (`idCondominio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfoCliente` (
    `idInfoCliente` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `InfoCliente_numero_key`(`numero`),
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
    `idONT` INTEGER NULL,
    `idEstado` INTEGER NOT NULL,
    `idRouter_Gestor` INTEGER NULL,
    `idRouter_Casa` INTEGER NULL,
    `idBW` INTEGER NOT NULL,
    `BW_KBPS` VARCHAR(50) NOT NULL,
    `numOS` VARCHAR(50) NOT NULL,
    `cajaDerivada` VARCHAR(150) NOT NULL,
    `fechaInstalacion` VARCHAR(50) NULL,
    `comentario` VARCHAR(200) NULL,
    `agente` VARCHAR(100) NULL,
    `cloudMonitoreo` VARCHAR(150) NOT NULL,
    `potenciaRecepcion` VARCHAR(100) NULL,

    UNIQUE INDEX `Cliente_cloudMonitoreo_key`(`cloudMonitoreo`),
    PRIMARY KEY (`idCliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente_Condominio` (
    `idHistorial` INTEGER NOT NULL AUTO_INCREMENT,
    `idInfoCliente` INTEGER NOT NULL,
    `idCondominio` INTEGER NOT NULL,
    `estado` INTEGER NOT NULL,

    PRIMARY KEY (`idHistorial`)
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
    `idEstadoR` INTEGER NOT NULL,
    `numOS` VARCHAR(50) NULL,
    `fechaDesinstalacion` VARCHAR(50) NULL,
    `comentario` VARCHAR(200) NULL,
    `agente` VARCHAR(100) NULL,

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
    `fechaInstalacion` VARCHAR(50) NULL,
    `dispositivo` VARCHAR(150) NOT NULL,
    `direccionNueva` VARCHAR(100) NULL,
    `direccionActual` VARCHAR(100) NOT NULL,
    `comentario` VARCHAR(200) NULL,
    `idTipoDano` INTEGER NOT NULL,

    PRIMARY KEY (`idDanado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suspencion` (
    `idSuspencion` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `fechaSuspencion` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idSuspencion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoInstalacion` (
    `idEstado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idEstado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DSN_Stick` (
    `idDSN` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstado` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `clave` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NULL,
    `dsn` VARCHAR(100) NULL,

    UNIQUE INDEX `DSN_Stick_macAddress_key`(`macAddress`),
    UNIQUE INDEX `DSN_Stick_dsn_key`(`dsn`),
    PRIMARY KEY (`idDSN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IPTV` (
    `idIPTV` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `idEstado` INTEGER NOT NULL,
    `idEstadoInstalacion` INTEGER NOT NULL,
    `idDSN` INTEGER NULL,
    `fechaInstalacion` VARCHAR(50) NULL,
    `comentario` VARCHAR(200) NULL,
    `agente` VARCHAR(100) NULL,

    PRIMARY KEY (`idIPTV`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfoCliente_IPpublica` (
    `idInfoCliente` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `InfoCliente_IPpublica_numero_key`(`numero`),
    PRIMARY KEY (`idInfoCliente`)
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
ALTER TABLE `ONT` ADD CONSTRAINT `ONT_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoActivo`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Router_Casa` ADD CONSTRAINT `Router_Casa_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoActivo`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Router_Gestor` ADD CONSTRAINT `Router_Gestor_idOLT_fkey` FOREIGN KEY (`idOLT`) REFERENCES `OLT`(`idOLT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Router_Gestor` ADD CONSTRAINT `Router_Gestor_idSubred_OLT_fkey` FOREIGN KEY (`idSubred_OLT`) REFERENCES `Subred_OLT`(`idRed`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subred_OLT` ADD CONSTRAINT `Subred_OLT_idOLT_fkey` FOREIGN KEY (`idOLT`) REFERENCES `OLT`(`idOLT`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idInfoCliente_fkey` FOREIGN KEY (`idInfoCliente`) REFERENCES `InfoCliente`(`idInfoCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idTipo_fkey` FOREIGN KEY (`idTipo`) REFERENCES `TipoCliente`(`idTipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idONT_fkey` FOREIGN KEY (`idONT`) REFERENCES `ONT`(`idONT`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoCliente`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idBW_fkey` FOREIGN KEY (`idBW`) REFERENCES `BW`(`idBW`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idRouter_Gestor_fkey` FOREIGN KEY (`idRouter_Gestor`) REFERENCES `Router_Gestor`(`idRouter_Gestor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_idRouter_Casa_fkey` FOREIGN KEY (`idRouter_Casa`) REFERENCES `Router_Casa`(`idRouter_Casa`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente_Condominio` ADD CONSTRAINT `Cliente_Condominio_idCondominio_fkey` FOREIGN KEY (`idCondominio`) REFERENCES `Condominio`(`idCondominio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente_Condominio` ADD CONSTRAINT `Cliente_Condominio_idInfoCliente_fkey` FOREIGN KEY (`idInfoCliente`) REFERENCES `InfoCliente`(`idInfoCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_idEstadoR_fkey` FOREIGN KEY (`idEstadoR`) REFERENCES `EstadoRetiro`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Danado` ADD CONSTRAINT `Danado_idTipoDano_fkey` FOREIGN KEY (`idTipoDano`) REFERENCES `TipoDano`(`idDano`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Danado` ADD CONSTRAINT `Danado_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Suspencion` ADD CONSTRAINT `Suspencion_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DSN_Stick` ADD CONSTRAINT `DSN_Stick_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoActivo`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`idCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idEstadoInstalacion_fkey` FOREIGN KEY (`idEstadoInstalacion`) REFERENCES `EstadoInstalacion`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idDSN_fkey` FOREIGN KEY (`idDSN`) REFERENCES `DSN_Stick`(`idDSN`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoCliente`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IpPublica` ADD CONSTRAINT `IpPublica_idInfoCliente_fkey` FOREIGN KEY (`idInfoCliente`) REFERENCES `InfoCliente_IPpublica`(`idInfoCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;
