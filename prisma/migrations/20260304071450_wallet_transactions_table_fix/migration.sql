-- AddForeignKey
ALTER TABLE "walletTransactions" ADD CONSTRAINT "walletTransactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
