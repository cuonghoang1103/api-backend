-- Migration: add_tech_trend_comments
-- Adds reader comments (+ likes) for Tech Trends articles. Fully ADDITIVE:
-- two brand-new tables only. No existing table or column is altered, so this
-- is safe to apply on a database that may have historical drift (no ALTER on
-- pre-existing objects). Mirrors the SnippetComment / SocialCommentLike shape.

-- CreateTable
CREATE TABLE "tech_trend_comments" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tech_trend_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_trend_comment_likes" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tech_trend_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_tt_comments_article_time" ON "tech_trend_comments"("article_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_tt_comments_parent" ON "tech_trend_comments"("parent_id");

-- CreateIndex
CREATE INDEX "idx_tt_comments_user" ON "tech_trend_comments"("user_id");

-- CreateIndex
CREATE INDEX "idx_tt_comment_likes_comment" ON "tech_trend_comment_likes"("comment_id");

-- CreateIndex
CREATE INDEX "idx_tt_comment_likes_user" ON "tech_trend_comment_likes"("user_id");

-- CreateIndex
-- NOTE: Prisma's @@unique(name: "uk_tt_comment_like") sets the CLIENT accessor,
-- not the DB index name; the DB name defaults to the column-derived form below.
CREATE UNIQUE INDEX "tech_trend_comment_likes_comment_id_user_id_key" ON "tech_trend_comment_likes"("comment_id", "user_id");

-- AddForeignKey
ALTER TABLE "tech_trend_comments" ADD CONSTRAINT "tech_trend_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "tech_trend_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_trend_comments" ADD CONSTRAINT "tech_trend_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_trend_comments" ADD CONSTRAINT "tech_trend_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "tech_trend_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_trend_comment_likes" ADD CONSTRAINT "tech_trend_comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "tech_trend_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_trend_comment_likes" ADD CONSTRAINT "tech_trend_comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
