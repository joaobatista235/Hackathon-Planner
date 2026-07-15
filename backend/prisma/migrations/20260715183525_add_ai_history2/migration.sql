/*
  Warnings:

  - You are about to drop the `AIHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIHistory" DROP CONSTRAINT "AIHistory_userId_fkey";

-- DropTable
DROP TABLE "AIHistory";

-- CreateTable
CREATE TABLE "AiHistory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiHistory_userId_idx" ON "AiHistory"("userId");

-- AddForeignKey
ALTER TABLE "AiHistory" ADD CONSTRAINT "AiHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
