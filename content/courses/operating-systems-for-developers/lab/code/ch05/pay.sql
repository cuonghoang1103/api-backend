-- pay.sql — trừ 30 cho đơn 42. Không có gì ngăn chạy HAI lần (vd. app/khách hàng gửi lại khi hết thời gian chờ).
BEGIN;
DO $$ BEGIN PERFORM pg_sleep(0.3); END $$;   -- gọi cổng thanh toán, chậm…
UPDATE wallets SET balance = balance - 30 WHERE id = 1;
INSERT INTO payments (order_id, amount) VALUES (42, 30);
COMMIT;
\echo :who charged 30 for order 42
