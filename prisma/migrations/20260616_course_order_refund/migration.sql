# Migration: add refund tracking to course_orders
# Date: 2026-06-16
#
# Adds 4 columns for refund audit:
#   - refund_amount   DECIMAL(10,2)   how much was refunded
#   - refund_reason   VARCHAR(500)    admin's reason text
#   - refunded_at     TIMESTAMP       when the refund was issued
#   - refunded_by     INTEGER         admin user who issued it
#
# The refundedBy FK uses ON DELETE SET NULL so deleting the admin
# account doesn't lose the refund record.

ALTER TABLE "course_orders"
    ADD COLUMN "refund_amount" DECIMAL(10, 2),
    ADD COLUMN "refund_reason" VARCHAR(500),
    ADD COLUMN "refunded_at" TIMESTAMP(3),
    ADD COLUMN "refunded_by" INTEGER;

CREATE INDEX "idx_course_orders_refunder"
    ON "course_orders"("refunded_by");

ALTER TABLE "course_orders"
    ADD CONSTRAINT "course_orders_refunded_by_fkey"
    FOREIGN KEY ("refunded_by")
    REFERENCES "users"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
