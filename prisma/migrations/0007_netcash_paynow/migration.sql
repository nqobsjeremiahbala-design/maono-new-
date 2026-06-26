-- Netcash Pay Now: extra reconciliation columns + raw postback log
ALTER TABLE "purchases" ADD COLUMN     "netcashRequestTrace" TEXT;
ALTER TABLE "purchases" ADD COLUMN     "netcashMethod" TEXT;

CREATE TABLE "netcash_postbacks" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "reference" TEXT,
    "requestTrace" TEXT,
    "method" TEXT,
    "accepted" BOOLEAN,
    "amount" TEXT,
    "rawPayload" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "netcash_postbacks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "netcash_postbacks_reference_idx" ON "netcash_postbacks"("reference");
