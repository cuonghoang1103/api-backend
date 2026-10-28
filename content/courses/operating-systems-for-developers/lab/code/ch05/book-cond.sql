-- book-cond.sql — gộp "kiểm" và "ghi" thành MỘT câu lệnh: chỉ ghi khi ghế còn trống.
BEGIN;
UPDATE seats SET booked_by = :'who' WHERE show_id = 1 AND seat = 'A7' AND booked_by IS NULL;
\if :ROW_COUNT
  DO $$ BEGIN PERFORM pg_sleep(0.5); END $$;   -- vẫn giữ khoá dòng trong lúc làm việc khác
  \echo :who booked A7 - confirmation e-mail sent
\else
  \echo :who sorry, A7 is already taken
\endif
COMMIT;
