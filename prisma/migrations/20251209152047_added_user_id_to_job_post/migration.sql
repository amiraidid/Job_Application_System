/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `JobPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JobPost_userId_key" ON "JobPost"("userId");

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
