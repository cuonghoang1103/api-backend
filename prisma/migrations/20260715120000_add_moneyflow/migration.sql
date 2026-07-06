-- MoneyFlow (Phase 1) — additive personal-finance tables.
-- Purely additive: 11 finance_* tables, their indexes, and intra-finance FKs.
-- (Non-finance drift statements from 'migrate diff' were intentionally excluded.)

-- CreateTable
CREATE TABLE "finance_wallets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "icon" VARCHAR(40),
    "color" VARCHAR(20),
    "balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'VND',
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_wallet_adjustments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "kind" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "balance_after" DECIMAL(18,2) NOT NULL,
    "counterparty_wallet_id" INTEGER,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_wallet_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_income_sources" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "pay_type" VARCHAR(20) NOT NULL,
    "base_salary" DECIMAL(18,2),
    "hourly_rate" DECIMAL(18,2),
    "ot_multiplier_normal" DECIMAL(4,2) NOT NULL DEFAULT 1.5,
    "ot_multiplier_holiday" DECIMAL(4,2) NOT NULL DEFAULT 2.0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_income_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_work_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "hours_normal" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "hours_ot" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "hours_ot_holiday" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_work_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_income_entries" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "source_id" INTEGER,
    "wallet_id" INTEGER NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'VND',
    "date" DATE NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_income_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_debts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "lender_name" VARCHAR(150) NOT NULL,
    "lender_type" VARCHAR(20) NOT NULL,
    "principal" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'VND',
    "interest_type" VARCHAR(20) NOT NULL,
    "interest_rate" DECIMAL(8,4) NOT NULL,
    "start_date" DATE NOT NULL,
    "term_months" INTEGER,
    "payment_day" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "attachment_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_debt_schedule_items" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "debt_id" INTEGER NOT NULL,
    "installment_no" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "amount_due" DECIMAL(18,2) NOT NULL,
    "principal_part" DECIMAL(18,2) NOT NULL,
    "interest_part" DECIMAL(18,2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "payment_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_debt_schedule_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_debt_payments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "debt_id" INTEGER NOT NULL,
    "wallet_id" INTEGER,
    "amount" DECIMAL(18,2) NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_debt_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expense_categories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "icon" VARCHAR(40),
    "color" VARCHAR(20),
    "order" INTEGER NOT NULL DEFAULT 0,
    "monthly_budget" DECIMAL(18,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expenses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'VND',
    "date" DATE NOT NULL,
    "description" VARCHAR(500),
    "receipt_url" VARCHAR(500),
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_recurring_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kind" VARCHAR(10) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "category_id" INTEGER,
    "wallet_id" INTEGER NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "frequency" VARCHAR(10) NOT NULL,
    "day_of_month" INTEGER,
    "next_run_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_recurring_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_fin_wallets_user" ON "finance_wallets"("user_id");

-- CreateIndex
CREATE INDEX "idx_fin_wallet_adj_user_wallet" ON "finance_wallet_adjustments"("user_id", "wallet_id");

-- CreateIndex
CREATE INDEX "idx_fin_income_sources_user" ON "finance_income_sources"("user_id");

-- CreateIndex
CREATE INDEX "idx_fin_worklogs_user_date" ON "finance_work_logs"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "finance_work_logs_user_id_source_id_date_key" ON "finance_work_logs"("user_id", "source_id", "date");

-- CreateIndex
CREATE INDEX "idx_fin_income_entries_user_date" ON "finance_income_entries"("user_id", "date");

-- CreateIndex
CREATE INDEX "idx_fin_income_entries_user_source" ON "finance_income_entries"("user_id", "source_id");

-- CreateIndex
CREATE INDEX "idx_fin_debts_user_status" ON "finance_debts"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_fin_debt_sched_user_due_paid" ON "finance_debt_schedule_items"("user_id", "due_date", "is_paid");

-- CreateIndex
CREATE INDEX "idx_fin_debt_sched_debt_seq" ON "finance_debt_schedule_items"("debt_id", "installment_no");

-- CreateIndex
CREATE INDEX "idx_fin_debt_payments_user_date" ON "finance_debt_payments"("user_id", "date");

-- CreateIndex
CREATE INDEX "idx_fin_debt_payments_debt" ON "finance_debt_payments"("debt_id");

-- CreateIndex
CREATE INDEX "idx_fin_expense_categories_user" ON "finance_expense_categories"("user_id");

-- CreateIndex
CREATE INDEX "idx_fin_expenses_user_date" ON "finance_expenses"("user_id", "date");

-- CreateIndex
CREATE INDEX "idx_fin_expenses_user_category" ON "finance_expenses"("user_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_fin_recurring_user_next_active" ON "finance_recurring_transactions"("user_id", "next_run_at", "is_active");

-- AddForeignKey (intra-finance only)
-- AddForeignKey
ALTER TABLE "finance_wallet_adjustments" ADD CONSTRAINT "finance_wallet_adjustments_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "finance_wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_work_logs" ADD CONSTRAINT "finance_work_logs_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "finance_income_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_income_entries" ADD CONSTRAINT "finance_income_entries_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "finance_income_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_debt_schedule_items" ADD CONSTRAINT "finance_debt_schedule_items_debt_id_fkey" FOREIGN KEY ("debt_id") REFERENCES "finance_debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_debt_payments" ADD CONSTRAINT "finance_debt_payments_debt_id_fkey" FOREIGN KEY ("debt_id") REFERENCES "finance_debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "finance_expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
