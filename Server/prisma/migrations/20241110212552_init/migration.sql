/*
  Warnings:

  - You are about to drop the column `idZona_OLT` on the `router_gestor` table. All the data in the column will be lost.
  - You are about to drop the `zona_olt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `router_gestor` DROP FOREIGN KEY `Router_Gestor_idZona_OLT_fkey`;

-- DropForeignKey
ALTER TABLE `zona_olt` DROP FOREIGN KEY `Zona_OLT_idOLT_fkey`;

-- AlterTable
ALTER TABLE `router_gestor` DROP COLUMN `idZona_OLT`;

-- DropTable
DROP TABLE `zona_olt`;
