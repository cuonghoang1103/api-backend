-- book-lock.sql — y hệt book-naive.sql, chỉ thêm FOR UPDATE: khoá DÒNG ghế ngay lúc đọc.
BEGIN;
SELECT booked_by IS NULL AS free FROM seats WHERE show_id = 1 AND seat = 'A7' FOR UPDATE \gset
DO $$ BEGIN PERFORM pg_sleep(0.5); END $$;   -- app làm việc khác: tính giá, gọi cổng thanh toán…
\if :free
  UPDATE seats SET booked_by = :'who' WHERE show_id = 1 AND seat = 'A7';
  \echo :who booked A7 - confirmation e-mail sent
\else
  \echo :who sorry, A7 is already taken
\endif
COMMIT;
