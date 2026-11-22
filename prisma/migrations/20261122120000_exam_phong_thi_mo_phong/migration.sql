-- Phòng thi mô phỏng (22/11/2026): lượt mô phỏng FE/PE dùng chung bảng exam_attempts.
-- Chỉ THÊM cột (mặc định giữ nguyên hành vi mọi lượt cũ = STANDARD).
ALTER TABLE "exam_attempts" ADD COLUMN IF NOT EXISTS "mode" VARCHAR(16) NOT NULL DEFAULT 'STANDARD';
ALTER TABLE "exam_attempts" ADD COLUMN IF NOT EXISTS "paper" JSONB;
ALTER TABLE "exam_attempts" ADD COLUMN IF NOT EXISTS "progress" JSONB;
CREATE INDEX IF NOT EXISTS "idx_exam_attempts_user_mode" ON "exam_attempts"("user_id", "mode");
