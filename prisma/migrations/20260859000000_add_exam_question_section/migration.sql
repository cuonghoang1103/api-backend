-- Gán câu hỏi Exam Room về CHƯƠNG (course_sections) để "học chương nào luyện
-- câu chương đó" trong Academy.
--
-- Viết TAY (kho này `migrate dev` hỏng sẵn — P3006 trên shadow DB), áp bằng
-- `migrate deploy`. Hoàn toàn ADDITIVE + nullable: câu hỏi cũ không đổi, chưa
-- gán chương thì section_id = NULL, chạy bình thường. `IF NOT EXISTS` để một
-- deploy chết giữa chừng rồi chạy lại không đổ.

ALTER TABLE "exam_questions" ADD COLUMN IF NOT EXISTS "section_id" INTEGER;

-- FK: xoá chương thì chỉ gỡ gán (SET NULL), không xoá câu hỏi. Bọc trong DO để
-- thêm ràng buộc idempotent (Postgres không có ADD CONSTRAINT IF NOT EXISTS).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exam_questions_section_id_fkey'
  ) THEN
    ALTER TABLE "exam_questions"
      ADD CONSTRAINT "exam_questions_section_id_fkey"
      FOREIGN KEY ("section_id") REFERENCES "course_sections"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_exam_questions_section" ON "exam_questions"("section_id");
