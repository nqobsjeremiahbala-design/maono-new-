-- Netcash payment fields + gateway-agnostic columns on purchases
ALTER TABLE "purchases" ADD COLUMN     "netcashRef" TEXT;
ALTER TABLE "purchases" ADD COLUMN     "gateway" TEXT;
ALTER TABLE "purchases" ADD COLUMN     "country" TEXT;
ALTER TABLE "purchases" ADD COLUMN     "paidAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "purchases_netcashRef_key" ON "purchases"("netcashRef");
CREATE INDEX "purchases_netcashRef_idx" ON "purchases"("netcashRef");
