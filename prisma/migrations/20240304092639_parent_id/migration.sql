/*
  Warnings:

  - You are about to drop the column `parent` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "parent",
ADD COLUMN     "parentId" INTEGER DEFAULT 0;
