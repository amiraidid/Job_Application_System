/*
  Warnings:

  - You are about to drop the column `candidateEmail` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `candidateName` on the `JobApplication` table. All the data in the column will be lost.
  - Added the required column `userId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "candidateEmail",
DROP COLUMN "candidateName",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
