-- exam_question_comments: chuyển sang khoá BỀN (exam_id + prompt_hash) thay
-- vì chỉ dựa vào question_id — câu hỏi bị xoá+tạo lại (id đổi) mỗi lần
-- deploy chạy "Exam Room seed" (xem deploy.sh), CASCADE cũ sẽ xoá sạch bình
-- luận theo mỗi lần đó. Bảng này vừa tạo, còn trống (xác nhận trước khi
-- viết migration) nên ALTER thẳng, không cần backfill.
-- Viết tay, áp bằng `migrate deploy`.

ALTER TABLE "exam_question_comments" DROP CONSTRAINT IF EXISTS "exam_question_comments_question_id_fkey";

ALTER TABLE "exam_question_comments" ALTER COLUMN "question_id" DROP NOT NULL;
ALTER TABLE "exam_question_comments" ADD COLUMN IF NOT EXISTS "exam_id" INTEGER;
ALTER TABLE "exam_question_comments" ADD COLUMN IF NOT EXISTS "prompt_hash" VARCHAR(64);

-- Bảng trống nên set NOT NULL ngay được (không có dòng nào vi phạm).
UPDATE "exam_question_comments" SET "exam_id" = 0 WHERE "exam_id" IS NULL;
UPDATE "exam_question_comments" SET "prompt_hash" = '' WHERE "prompt_hash" IS NULL;
ALTER TABLE "exam_question_comments" ALTER COLUMN "exam_id" SET NOT NULL;
ALTER TABLE "exam_question_comments" ALTER COLUMN "prompt_hash" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_exam_qcomments_reapply" ON "exam_question_comments"("exam_id", "prompt_hash");

DO $$ BEGIN
  ALTER TABLE "exam_question_comments"
    ADD CONSTRAINT "exam_question_comments_exam_id_fkey"
    FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "exam_question_comments"
    ADD CONSTRAINT "exam_question_comments_question_id_fkey"
    FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
