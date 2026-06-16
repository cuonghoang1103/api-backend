# Migration: add course_orders + payment_transactions
# Date: 2026-06-16
# Purpose: VNPay paid course integration
#
# Tables:
#   - course_orders: one row per user purchase attempt.
#     orderCode = vnp_TxnRef, unique, format COURSE_{courseId}_{userId}_{ts}
#   - payment_transactions: audit log of every VNPay IPN callback
#     (one order can have multiple rows because VNPay retries).
#
# Status values: PENDING | PAID | FAILED | REFUNDED

# ─── 1. course_orders ──────────────────────────────────────
CREATE TABLE "course_orders" (
    "id" SERIAL NOT NULL,
    "orderCode" VARCHAR(80) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "payment_method" VARCHAR(30) NOT NULL DEFAULT 'VNPAY',
    "payment_txn_no" VARCHAR(50),
    "payment_bank_code" VARCHAR(30),
    "payment_pay_date" TIMESTAMP(3),
    "enrolled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_orders_pkey" PRIMARY KEY ("id")
);

-- ─── 2. payment_transactions ──────────────────────────────
CREATE TABLE "payment_transactions" (
    "id" SERIAL NOT NULL,
    "order_code" VARCHAR(80) NOT NULL,
    "gateway_txn_no" VARCHAR(50),
    "bank_code" VARCHAR(30),
    "pay_date" TIMESTAMP(3),
    "response_code" VARCHAR(10),
    "amount" DECIMAL(10,2) NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- ─── 3. Indexes ────────────────────────────────────────────
CREATE UNIQUE INDEX "uk_course_order_code" ON "course_orders"("orderCode");
CREATE INDEX "idx_course_orders_user_status" ON "course_orders"("user_id", "status");
CREATE INDEX "idx_course_orders_course" ON "course_orders"("course_id");
CREATE INDEX "idx_payment_tx_order" ON "payment_transactions"("order_code");

-- ─── 4. Foreign keys (CASCADE on user/course delete) ──────
ALTER TABLE "course_orders"
    ADD CONSTRAINT "course_orders_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "course_orders"
    ADD CONSTRAINT "course_orders_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
