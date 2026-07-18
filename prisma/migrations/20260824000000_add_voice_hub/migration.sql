-- Migration: add_voice_hub
-- Voice Hub — admin-only creator channel (Vlog / Reaction / Kinh nghiệm code /
-- Podcast-voice / Tutorial). Fully ADDITIVE: five brand-new tables
-- (voice_series, voice_posts, voice_likes, voice_comments, voice_comment_likes)
-- + their indexes and FKs. No existing table/column is touched, so this applies
-- cleanly on a database carrying historical drift. Matches prisma migrate diff.

-- CreateTable
CREATE TABLE "voice_series" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cover_image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "description_html" TEXT,
    "type" VARCHAR(20) NOT NULL DEFAULT 'VLOG',
    "mediaKind" VARCHAR(20) NOT NULL DEFAULT 'YOUTUBE',
    "youtube_id" VARCHAR(32),
    "video_url" VARCHAR(555),
    "audio_url" VARCHAR(555),
    "thumbnail_url" VARCHAR(500),
    "duration_sec" INTEGER,
    "chapters" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "series_id" INTEGER,
    "author_id" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_likes" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_comment_likes" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_voice_series_slug" ON "voice_series"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uk_voice_post_slug" ON "voice_posts"("slug");

-- CreateIndex
CREATE INDEX "idx_voice_post_type" ON "voice_posts"("type");

-- CreateIndex
CREATE INDEX "idx_voice_post_status" ON "voice_posts"("status");

-- CreateIndex
CREATE INDEX "idx_voice_post_featured" ON "voice_posts"("is_featured");

-- CreateIndex
CREATE INDEX "idx_voice_post_published_at" ON "voice_posts"("published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_voice_post_series" ON "voice_posts"("series_id");

-- CreateIndex
CREATE INDEX "idx_voice_post_author" ON "voice_posts"("author_id");

-- CreateIndex
CREATE INDEX "idx_voice_likes_post" ON "voice_likes"("post_id");

-- CreateIndex
CREATE INDEX "idx_voice_likes_user" ON "voice_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "voice_likes_post_id_user_id_key" ON "voice_likes"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_voice_comments_post_time" ON "voice_comments"("post_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_voice_comments_parent" ON "voice_comments"("parent_id");

-- CreateIndex
CREATE INDEX "idx_voice_comments_user" ON "voice_comments"("user_id");

-- CreateIndex
CREATE INDEX "idx_voice_comment_likes_comment" ON "voice_comment_likes"("comment_id");

-- CreateIndex
CREATE INDEX "idx_voice_comment_likes_user" ON "voice_comment_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "voice_comment_likes_comment_id_user_id_key" ON "voice_comment_likes"("comment_id", "user_id");

-- AddForeignKey
ALTER TABLE "voice_posts" ADD CONSTRAINT "voice_posts_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "voice_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_posts" ADD CONSTRAINT "voice_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_likes" ADD CONSTRAINT "voice_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "voice_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_likes" ADD CONSTRAINT "voice_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_comments" ADD CONSTRAINT "voice_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "voice_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_comments" ADD CONSTRAINT "voice_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_comments" ADD CONSTRAINT "voice_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "voice_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_comment_likes" ADD CONSTRAINT "voice_comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "voice_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_comment_likes" ADD CONSTRAINT "voice_comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

