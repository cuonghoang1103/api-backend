-- MoneyFlow Phase 2 — additive investments & savings tables.
-- (Non-finance drift statements from 'migrate diff' intentionally excluded.)

-- CreateTable
CREATE TABLE "finance_investments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'VND',
    "date" DATE NOT NULL,
    "wallet_id" INTEGER,
    "expected_outcome" TEXT,
    "current_value" DECIMAL(18,2),
    "status" VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    "outcome_note" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_savings_accounts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bank_name" VARCHAR(150) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'VND',
    "interest_rate_per_year" DECIMAL(6,3) NOT NULL,
    "term_months" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "maturity_date" DATE NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "wallet_id" INTEGER,
    "status" VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_savings_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_savings_goals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "target_amount" DECIMAL(18,2) NOT NULL,
    "current_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "deadline" DATE,
    "icon" VARCHAR(40),
    "status" VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_savings_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_fin_investments_user_type" ON "finance_investments"("user_id", "type");

-- CreateIndex
CREATE INDEX "idx_fin_savings_accounts_user_status" ON "finance_savings_accounts"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_fin_savings_goals_user" ON "finance_savings_goals"("user_id");
