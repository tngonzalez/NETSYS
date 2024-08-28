/*
  Warnings:

  - You are about to drop the column `idEstProyecto` on the `ldf_iptv` table. All the data in the column will be lost.
  - You are about to drop the column `idEstProyecto` on the `panica_iptv` table. All the data in the column will be lost.
  - You are about to drop the column `CajaDerivada` on the `proyecto` table. All the data in the column will be lost.
  - You are about to drop the column `osInstalado` on the `retiro` table. All the data in the column will be lost.
  - You are about to drop the `estado_instalacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estadodanado` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `direccionActual` to the `Estropeado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idEstInstalacion` to the `LDF_IPTV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idEstInstalacion` to the `Panica_IPTV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cajaDerivada` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `osActual` to the `Retiro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `osNuevo` to the `Retiro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ldf_iptv` DROP FOREIGN KEY `LDF_IPTV_idEstProyecto_fkey`;

-- DropForeignKey
ALTER TABLE `panica_iptv` DROP FOREIGN KEY `Panica_IPTV_idEstProyecto_fkey`;

-- AlterTable
ALTER TABLE `estropeado` ADD COLUMN `direccionActual` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `ldf_iptv` DROP COLUMN `idEstProyecto`,
    ADD COLUMN `idEstInstalacion` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `panica_iptv` DROP COLUMN `idEstProyecto`,
    ADD COLUMN `idEstInstalacion` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `proyecto` DROP COLUMN `CajaDerivada`,
    ADD COLUMN `cajaDerivada` VARCHAR(70) NOT NULL;

-- AlterTable
ALTER TABLE `retiro` DROP COLUMN `osInstalado`,
    ADD COLUMN `osActual` INTEGER NOT NULL,
    ADD COLUMN `osNuevo` INTEGER NOT NULL;

-- DropTable
DROP TABLE `estado_instalacion`;

-- DropTable
DROP TABLE `estadodanado`;

-- CreateTable
CREATE TABLE `EstadoInstalacion` (
    `idEstInstalacion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idEstInstalacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LDF_IPTV` ADD CONSTRAINT `LDF_IPTV_idEstInstalacion_fkey` FOREIGN KEY (`idEstInstalacion`) REFERENCES `EstadoInstalacion`(`idEstInstalacion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Panica_IPTV` ADD CONSTRAINT `Panica_IPTV_idEstInstalacion_fkey` FOREIGN KEY (`idEstInstalacion`) REFERENCES `EstadoInstalacion`(`idEstInstalacion`) ON DELETE RESTRICT ON UPDATE CASCADE;
