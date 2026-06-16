# Migration: add discount code fields to course_orders
# Date: 2026-06-16
#
# Adds three columns to course_orders:
#   - discount_code       (VARCHAR(50))  the coupon string user typed
#   - discount_code_id    (INTEGER)      FK to discount_codes.id
#   - original_amount     (DECIMAL(10,2)) amount BEFORE coupon
#                                  (so we can show "saved X%" later)
#
# Then a foreign key to discount_codes with ON DELETE SET NULL so
# removing a coupon doesn't cascade-orphan the historical order.

ALTER TABLE "course_orders"
    ADD COLUMN "discount_code" VARCHAR(50),
    ADD COLUMN "discount_code_id" INTEGER,
    ADD COLUMN "original_amount" DECIMAL(10, 2);

CREATE INDEX "idx_course_orders_coupon"
    ON "course_orders"("discount_code_id");

ALTER TABLE "course_orders"
    ADD CONSTRAINT "course_orders_discount_code_id_fkey"
    FOREIGN KEY ("discount_code_id")
    REFERENCES "discount_codes"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
