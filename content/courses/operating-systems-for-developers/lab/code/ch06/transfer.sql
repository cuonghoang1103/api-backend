-- transfer.sql — chuyển 100 từ :from sang :to, khoá theo thứ tự "từ → tới" (giống dl.c chế độ naive).
\set VERBOSITY verbose
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = :from;
SELECT pg_sleep(0.5) \gset
\timing on
UPDATE accounts SET balance = balance + 100 WHERE id = :to;
\timing off
COMMIT;
