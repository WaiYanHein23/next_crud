/*
  Warnings:

  - You are about to alter the column `content` on the `post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(191)`.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `bio` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(191)`.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `bio` VARCHAR(191) NULL;
