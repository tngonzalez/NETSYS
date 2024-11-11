/*
  Warnings:

  - You are about to drop the column `idDNS` on the `iptv` table. All the data in the column will be lost.
  - You are about to drop the `dns_stick` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dns_stick` DROP FOREIGN KEY `DNS_Stick_idEstado_fkey`;

-- DropForeignKey
ALTER TABLE `iptv` DROP FOREIGN KEY `IPTV_idDNS_fkey`;

-- AlterTable
ALTER TABLE `iptv` DROP COLUMN `idDNS`,
    ADD COLUMN `idDSN` INTEGER NULL;

-- DropTable
DROP TABLE `dns_stick`;

-- CreateTable
CREATE TABLE `DSN_Stick` (
    `idDSN` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstado` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `clave` VARCHAR(100) NOT NULL,
    `macAddress` VARCHAR(100) NOT NULL,
    `dsn` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `DSN_Stick_macAddress_key`(`macAddress`),
    UNIQUE INDEX `DSN_Stick_dsn_key`(`dsn`),
    PRIMARY KEY (`idDSN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DSN_Stick` ADD CONSTRAINT `DSN_Stick_idEstado_fkey` FOREIGN KEY (`idEstado`) REFERENCES `EstadoActivo`(`idEstado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPTV` ADD CONSTRAINT `IPTV_idDSN_fkey` FOREIGN KEY (`idDSN`) REFERENCES `DSN_Stick`(`idDSN`) ON DELETE SET NULL ON UPDATE CASCADE;
