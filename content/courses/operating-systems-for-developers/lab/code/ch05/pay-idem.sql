-- pay-idem.sql — như pay.sql nhưng mỗi yêu cầu mang một idempotency key; cùng key ⇒ chỉ trừ tiền MỘT lần.
BEGIN;
INSERT INTO idempotency_keys (key, order_id) VALUES (:'key', 42) ON CONFLICT (key) DO NOTHING;
\if :ROW_COUNT
  DO $$ BEGIN PERFORM pg_sleep(0.3); END $$;   -- gọi cổng thanh toán, chậm…
  UPDATE wallets SET balance = balance - 30 WHERE id = 1;
  INSERT INTO payments (order_id, amount) VALUES (42, 30);
  UPDATE idempotency_keys SET response = 'charged 30' WHERE key = :'key';
  COMMIT;
  \echo :who charged 30 for order 42
\else
  COMMIT;
  SELECT response FROM idempotency_keys WHERE key = :'key' \gset
  \echo :who duplicate key, nothing charged - replaying stored response: :response
\endif
