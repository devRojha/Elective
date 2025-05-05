/*
  Warnings:

  - You are about to drop the column `Email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Request` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Admin_Email_key";

-- DropIndex
DROP INDEX "Request_Email_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "Email",
DROP COLUMN "Name";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "Email",
DROP COLUMN "Name";
