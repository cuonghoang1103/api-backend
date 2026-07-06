-- CreateTable
CREATE TABLE "finance_fx_rates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vnd_per_usd" DECIMAL(18,2) NOT NULL,
    "note" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_fx_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_fin_fx_rates_user_created" ON "finance_fx_rates"("user_id", "created_at");

