-- transfer-ordered.sql — cùng lệnh chuyển, nhưng khoá CẢ HAI dòng trước, theo id tăng dần (cùng một thứ tự cho mọi giao dịch).
BEGIN;
SELECT id FROM accounts WHERE id IN (:from, :to) ORDER BY id FOR UPDATE;
SELECT pg_sleep(0.5) \gset
UPDATE accounts SET balance = balance - 100 WHERE id = :from;
UPDATE accounts SET balance = balance + 100 WHERE id = :to;
COMMIT;
