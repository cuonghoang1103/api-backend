-- exam_question_comments: chuyển sang khoá BỀN (exam_id + prompt_hash) thay
-- vì chỉ dựa vào question_id — câu hỏi bị xoá+tạo lại (id đổi) mỗi lần
-- deploy chạy "Exam Room seed" (xem deploy.sh), CASCADE cũ sẽ xoá sạch bình
-- luận theo mỗi lần đó.
-- ⚠️ LẦN ĐẦU migration này (chạy 05/09/2026) THẤT BẠI: viết nhầm exam_id=0
-- làm placeholder cho "bảng trống", nhưng giữa lúc xác nhận trống và lúc
-- migration thật sự chạy, người dùng đã tự đăng 2 bình luận thật (CuongMini
-- trả lời) — placeholder 0 không khớp exams.id nào, vỡ FK, rollback sạch
-- (không mất dữ liệu, chỉ chưa lên được). Sửa: backfill exam_id THẬT bằng
-- JOIN qua question_id hiện có (đáng tin lúc này — câu chưa kịp bị reseed
-- xoá). prompt_hash để rỗng cho các dòng CŨ (không có SHA256 chuẩn trong
-- SQL thuần) — script deploy tự động (scripts/exam-reapply-comments.mjs)
-- sẽ không nối lại được 2 dòng này qua reseed đầu tiên, chấp nhận được vì
-- chỉ ảnh hưởng đúng 2 bình luận test ban đầu, không phải mất vĩnh viễn
-- (question_id hiện tại của chúng vẫn còn đúng cho tới reseed kế tiếp).
-- Viết tay, áp bằng `migrate deploy`.

ALTER TABLE "exam_question_comments" DROP CONSTRAINT IF EXISTS "exam_question_comments_question_id_fkey";

ALTER TABLE "exam_question_comments" ALTER COLUMN "question_id" DROP NOT NULL;
ALTER TABLE "exam_question_comments" ADD COLUMN IF NOT EXISTS "exam_id" INTEGER;
ALTER TABLE "exam_question_comments" ADD COLUMN IF NOT EXISTS "prompt_hash" VARCHAR(64);

UPDATE "exam_question_comments" c SET "exam_id" = q."exam_id"
  FROM "exam_questions" q WHERE c."question_id" = q."id" AND c."exam_id" IS NULL;
-- Phòng hờ: dòng nào (không nên có) mà question_id đã không còn khớp câu
-- nào thì gán về đề đầu tiên chỉ để qua được NOT NULL — không xảy ra ở lần
-- áp thật (đã kiểm cả 2 dòng đều khớp).
UPDATE "exam_question_comments" SET "exam_id" = (SELECT MIN("id") FROM "exams") WHERE "exam_id" IS NULL;
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
