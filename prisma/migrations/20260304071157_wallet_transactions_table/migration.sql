-- CreateEnum
CREATE TYPE "txAction" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "walletTransactions" (
    "id" UUID NOT NULL,
    "walletId" UUID NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "txAction" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "walletTransactions_pkey" PRIMARY KEY ("id")
);
