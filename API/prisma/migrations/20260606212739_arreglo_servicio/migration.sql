/*
  Warnings:

  - You are about to drop the column `servicioId` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the `_servicetospecialty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_servicetospecialty` DROP FOREIGN KEY `_ServiceToSpecialty_A_fkey`;

-- DropForeignKey
ALTER TABLE `_servicetospecialty` DROP FOREIGN KEY `_ServiceToSpecialty_B_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_servicioId_fkey`;

-- DropIndex
DROP INDEX `Appointment_servicioId_fkey` ON `appointment`;

-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `servicioId`;

-- DropTable
DROP TABLE `_servicetospecialty`;
