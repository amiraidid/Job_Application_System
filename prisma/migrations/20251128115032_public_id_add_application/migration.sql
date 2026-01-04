/*
  Warnings:

  - Added the required column `publicId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "publicId" TEXT NOT NULL;
