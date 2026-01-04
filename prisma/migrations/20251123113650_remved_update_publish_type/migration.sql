/*
  Warnings:

  - Changed the type of `isPublished` on the `JobPost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "isPublished",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "Published";
