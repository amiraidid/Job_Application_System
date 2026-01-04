/*
  Warnings:

  - The `isPublished` column on the `JobPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Published" AS ENUM ('PUBLISHED', 'NOT_PUBLISHED');

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "isPublished",
ADD COLUMN     "isPublished" "Published" NOT NULL DEFAULT 'NOT_PUBLISHED';
