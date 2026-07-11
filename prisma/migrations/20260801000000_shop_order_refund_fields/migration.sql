-- Add admin refund tracking to shop_orders (mirrors course_orders).
-- Idempotent (ADD COLUMN IF NOT EXISTS) so it is a no-op if the columns
-- were already applied by hand on an environment.
ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2);
ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS refund_reason VARCHAR(500);
ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP(3);
ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS refunded_by INTEGER;
