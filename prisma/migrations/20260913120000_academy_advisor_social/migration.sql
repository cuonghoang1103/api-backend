-- Academy Advisor — thảo luận (bình luận) + FAQ
-- Bình luận công khai trên trang Tư vấn chọn ngành, phân theo khối/ngành
-- (faculty_id/major_id là slug chuỗi, KHÔNG khoá ngoại). Kèm ảnh, like, báo cáo.
-- advisor_questions gộp câu hỏi đã hỏi AI để dựng "Câu hỏi thường gặp".

-- CreateTable
CREATE TABLE IF NOT EXISTS "advisor_comments" (
    "id" SERIAL NOT NULL,
    "faculty_id" VARCHAR(64) NOT NULL,
    "major_id" VARCHAR(64),
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "image_url" VARCHAR(500),
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "reports_count" INTEGER NOT NULL DEFAULT 0,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advisor_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "advisor_comment_likes" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advisor_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "advisor_comment_reports" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advisor_comment_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "advisor_questions" (
    "id" SERIAL NOT NULL,
    "faculty_id" VARCHAR(64) NOT NULL,
    "major_id" VARCHAR(64),
    "normalized" VARCHAR(300) NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "ask_count" INTEGER NOT NULL DEFAULT 1,
    "last_asked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advisor_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_adv_comments_scope_time" ON "advisor_comments"("faculty_id", "major_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_adv_comments_parent" ON "advisor_comments"("parent_id");
CREATE INDEX IF NOT EXISTS "idx_adv_comments_user" ON "advisor_comments"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "uk_adv_comment_like" ON "advisor_comment_likes"("comment_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_adv_comment_likes_comment" ON "advisor_comment_likes"("comment_id");
CREATE INDEX IF NOT EXISTS "idx_adv_comment_likes_user" ON "advisor_comment_likes"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "uk_adv_comment_report" ON "advisor_comment_reports"("comment_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_adv_comment_reports_comment" ON "advisor_comment_reports"("comment_id");

CREATE UNIQUE INDEX IF NOT EXISTS "uk_adv_question" ON "advisor_questions"("faculty_id", "major_id", "normalized");
CREATE INDEX IF NOT EXISTS "idx_adv_questions_scope_count" ON "advisor_questions"("faculty_id", "major_id", "ask_count" DESC);

-- AddForeignKey
ALTER TABLE "advisor_comments" ADD CONSTRAINT "advisor_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "advisor_comments" ADD CONSTRAINT "advisor_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "advisor_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "advisor_comment_likes" ADD CONSTRAINT "advisor_comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "advisor_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "advisor_comment_likes" ADD CONSTRAINT "advisor_comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "advisor_comment_reports" ADD CONSTRAINT "advisor_comment_reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "advisor_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "advisor_comment_reports" ADD CONSTRAINT "advisor_comment_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
