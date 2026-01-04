/*
  Warnings:

  - Made the column `resumeUrl` on table `JobApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "resumeUrl" SET NOT NULL;
