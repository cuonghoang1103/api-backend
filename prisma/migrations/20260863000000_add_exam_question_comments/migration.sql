-- Bình luận/trao đổi ngay dưới MỘT câu hỏi Exam Room cụ thể, mở cho mọi tài
-- khoản (không chỉ người đang thi câu đó). 1 cấp trả lời qua parent_id, theo
-- mẫu TechTrendComment/SocialComment đã có. is_ai=true khi tài khoản bot
-- "cuongmini" tự đăng câu trả lời của CuongMini.
-- ADDITIVE + idempotent (IF NOT EXISTS). Viết tay, áp bằng `migrate deploy`.

CREATE TABLE IF NOT EXISTS "exam_question_comments" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "is_ai" BOOLEAN NOT NULL DEFAULT false,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_question_comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "idx_exam_qcomments_question" ON "exam_question_comments"("question_id");
CREATE INDEX IF NOT EXISTS "idx_exam_qcomments_parent" ON "exam_question_comments"("parent_id");
CREATE INDEX IF NOT EXISTS "idx_exam_qcomments_user" ON "exam_question_comments"("user_id");

DO $$ BEGIN
  ALTER TABLE "exam_question_comments"
    ADD CONSTRAINT "exam_question_comments_question_id_fkey"
    FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "exam_question_comments"
    ADD CONSTRAINT "exam_question_comments_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "exam_question_comments"
    ADD CONSTRAINT "exam_question_comments_parent_id_fkey"
    FOREIGN KEY ("parent_id") REFERENCES "exam_question_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tài khoản bot "cuongmini" — đăng thay CuongMini khi AI trả lời trong panel
-- CuongMini. password NULL (không đăng nhập được). Idempotent: ON CONFLICT
-- theo username (đã UNIQUE) thì bỏ qua, chạy lại migration này không nhân đôi.
INSERT INTO "users" ("username", "email", "display_name", "full_name", "bio", "enabled", "email_verified")
VALUES ('cuongmini', 'cuongmini@bot.cuongthai.com', 'CuongMini', 'CuongMini', 'AI đồng hành khi thi — trả lời tự động, đăng lại trong bình luận từng câu.', true, true)
ON CONFLICT ("username") DO NOTHING;
