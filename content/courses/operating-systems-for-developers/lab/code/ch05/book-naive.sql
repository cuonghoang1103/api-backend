-- book-naive.sql — đặt ghế kiểu "đọc, kiểm, rồi ghi" (check-then-act). Chạy: psql -v who=alice -f book-naive.sql
BEGIN;
SELECT booked_by IS NULL AS free FROM seats WHERE show_id = 1 AND seat = 'A7' \gset
DO $$ BEGIN PERFORM pg_sleep(0.5); END $$;   -- app làm việc khác: tính giá, gọi cổng thanh toán…
\if :free
  UPDATE seats SET booked_by = :'who' WHERE show_id = 1 AND seat = 'A7';
  \echo :who booked A7 - confirmation e-mail sent
\else
  \echo :who sorry, A7 is already taken
\endif
COMMIT;
