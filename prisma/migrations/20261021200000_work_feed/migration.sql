-- CT Work — Bảng tin nhóm (Team Feed, 21/10/2026). Hợp đồng: docs/ctw-feed-hop-dong-api.md
-- Chỉ THÊM bảng mới (work_feed_*) + khoá ngoại tới users / work_spaces / work_projects — không đụng bảng cũ.

-- CreateTable
CREATE TABLE "work_feed_posts" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "author_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "mentions" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refs" JSONB,
    "link_preview" JSONB,
    "poll" JSONB,
    "comments_off" BOOLEAN NOT NULL DEFAULT false,
    "pinned_at" TIMESTAMP(3),
    "pinned_by_id" INTEGER,
    "reaction_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "react_notified_at" TIMESTAMP(3),
    "client_key" VARCHAR(40),
    "edited_at" TIMESTAMP(3),
    "hidden_at" TIMESTAMP(3),
    "hidden_by_id" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_feed_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_attachments" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "post_id" INTEGER,
    "uploader_id" INTEGER NOT NULL,
    "kind" VARCHAR(8) NOT NULL,
    "status" VARCHAR(8) NOT NULL DEFAULT 'READY',
    "r2_key" VARCHAR(500) NOT NULL,
    "thumb_key" VARCHAR(500),
    "file_name" VARCHAR(255) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_ms" INTEGER,
    "alt" VARCHAR(300),
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "author_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "mentions" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "reaction_count" INTEGER NOT NULL DEFAULT 0,
    "reply_count" INTEGER NOT NULL DEFAULT 0,
    "client_key" VARCHAR(40),
    "edited_at" TIMESTAMP(3),
    "hidden_at" TIMESTAMP(3),
    "hidden_by_id" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_reactions" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kind" VARCHAR(12) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_comment_reactions" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kind" VARCHAR(12) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_saves" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_hides" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_hides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_poll_votes" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "option_id" VARCHAR(8) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_reports" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "post_id" INTEGER,
    "comment_id" INTEGER,
    "target_key" VARCHAR(24) NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "reason" VARCHAR(16) NOT NULL,
    "detail" VARCHAR(1000),
    "status" VARCHAR(12) NOT NULL DEFAULT 'OPEN',
    "action" VARCHAR(12),
    "resolved_by_id" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feed_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feed_follows" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "scope_key" VARCHAR(24) NOT NULL,
    "level" VARCHAR(12) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_feed_follows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_feed_post_ws" ON "work_feed_posts"("workspace_id", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "idx_work_feed_post_project" ON "work_feed_posts"("project_id", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "idx_work_feed_post_author" ON "work_feed_posts"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_feed_post_client_key" ON "work_feed_posts"("author_id", "client_key");

-- CreateIndex
CREATE INDEX "idx_work_feed_att_post" ON "work_feed_attachments"("post_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_feed_att_uploader" ON "work_feed_attachments"("uploader_id", "post_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_feed_comment_post" ON "work_feed_comments"("post_id", "parent_id", "created_at", "id");

-- CreateIndex
CREATE INDEX "idx_work_feed_comment_author" ON "work_feed_comments"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_feed_reaction_kind" ON "work_feed_reactions"("post_id", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_reaction" ON "work_feed_reactions"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_comment_reaction" ON "work_feed_comment_reactions"("comment_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_feed_save_user" ON "work_feed_saves"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_save" ON "work_feed_saves"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_hide" ON "work_feed_hides"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_poll_vote" ON "work_feed_poll_votes"("post_id", "user_id", "option_id");

-- CreateIndex
CREATE INDEX "idx_work_feed_report_ws" ON "work_feed_reports"("workspace_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_feed_report_target" ON "work_feed_reports"("target_key", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_report" ON "work_feed_reports"("reporter_id", "target_key");

-- CreateIndex
CREATE INDEX "idx_work_feed_follow_scope" ON "work_feed_follows"("scope_key", "level");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feed_follow" ON "work_feed_follows"("user_id", "scope_key");

-- AddForeignKey
ALTER TABLE "work_feed_posts" ADD CONSTRAINT "work_feed_posts_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_posts" ADD CONSTRAINT "work_feed_posts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_posts" ADD CONSTRAINT "work_feed_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_attachments" ADD CONSTRAINT "work_feed_attachments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_attachments" ADD CONSTRAINT "work_feed_attachments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_attachments" ADD CONSTRAINT "work_feed_attachments_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_comments" ADD CONSTRAINT "work_feed_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_comments" ADD CONSTRAINT "work_feed_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_feed_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_comments" ADD CONSTRAINT "work_feed_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_reactions" ADD CONSTRAINT "work_feed_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_reactions" ADD CONSTRAINT "work_feed_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_comment_reactions" ADD CONSTRAINT "work_feed_comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "work_feed_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_comment_reactions" ADD CONSTRAINT "work_feed_comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_saves" ADD CONSTRAINT "work_feed_saves_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_saves" ADD CONSTRAINT "work_feed_saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_hides" ADD CONSTRAINT "work_feed_hides_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_hides" ADD CONSTRAINT "work_feed_hides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_poll_votes" ADD CONSTRAINT "work_feed_poll_votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_poll_votes" ADD CONSTRAINT "work_feed_poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_reports" ADD CONSTRAINT "work_feed_reports_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_reports" ADD CONSTRAINT "work_feed_reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_reports" ADD CONSTRAINT "work_feed_reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "work_feed_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_reports" ADD CONSTRAINT "work_feed_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_follows" ADD CONSTRAINT "work_feed_follows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feed_follows" ADD CONSTRAINT "work_feed_follows_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
