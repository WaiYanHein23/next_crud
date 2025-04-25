/*
  Warnings:

  - You are about to drop the column `bio` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `bio`,
    DROP COLUMN `name`,
    ADD COLUMN `email` VARCHAR(250) NOT NULL,
    ADD COLUMN `username` VARCHAR(250) NOT NULL;

-- DropTable
DROP TABLE `post`;
