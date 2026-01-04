/*
  Warnings:

  - You are about to drop the column `interviewer` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `interviewerId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "interviewer",
ADD COLUMN     "interviewerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
