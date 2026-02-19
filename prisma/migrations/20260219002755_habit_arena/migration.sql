/*
  Warnings:

  - You are about to drop the `WaterEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('QUANTITY', 'COUNT', 'CHECK');

-- CreateEnum
CREATE TYPE "RankingMethod" AS ENUM ('TOTAL', 'CONSISTENCY', 'COMBINED');

-- DropForeignKey
ALTER TABLE "WaterEntry" DROP CONSTRAINT "WaterEntry_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "WaterEntry" DROP CONSTRAINT "WaterEntry_userId_fkey";

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "metricType" "MetricType" NOT NULL DEFAULT 'QUANTITY',
ADD COLUMN     "rankingMethod" "RankingMethod" NOT NULL DEFAULT 'COMBINED',
ADD COLUMN     "unit" TEXT;

-- DropTable
DROP TABLE "WaterEntry";

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entry_userId_competitionId_date_idx" ON "Entry"("userId", "competitionId", "date");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
