/*
  Warnings:

  - You are about to drop the column `clave` on the `iptv` table. All the data in the column will be lost.
  - You are about to drop the column `correo` on the `iptv` table. All the data in the column will be lost.
  - You are about to drop the column `macAddress` on the `iptv` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `IPTV_clave_key` ON `iptv`;

-- DropIndex
DROP INDEX `IPTV_correo_key` ON `iptv`;

-- DropIndex
DROP INDEX `IPTV_macAddress_key` ON `iptv`;

-- AlterTable
ALTER TABLE `iptv` DROP COLUMN `clave`,
    DROP COLUMN `correo`,
    DROP COLUMN `macAddress`;
