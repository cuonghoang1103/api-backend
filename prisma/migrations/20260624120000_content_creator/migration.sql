-- ============================================================
-- Phase 1: Content Creator (additive only)
-- ------------------------------------------------------------
-- Adds 6 enums + 9 tables for the personal production tool
-- (videos posted to TikTok / YouTube / Facebook / Instagram).
-- Nothing in this migration touches any pre-existing table.
--
-- Schema drift note
-- ------------------------------------------------------------
-- The `projects.search_vector` column and its GIN index
-- `idx_projects_search_vector` are intentionally NOT
-- dropped here. They were created by the raw-SQL migration
-- `20260623120000_add_project_search_index` and are part of
-- Phase-6 full-text search; they are not mapped in
-- schema.prisma on purpose. Prisma's `migrate diff` would
-- suggest dropping them, but that would break search on
-- /projects. We exclude those two operations from this
-- migration so the column + index are preserved.
-- ============================================================

-- ─── Enums ──────────────────────────────────────────────────
-- CreateEnum
CREATE TYPE "content_type" AS ENUM ('VLOG', 'AFFILIATE', 'CODE', 'REVIEW', 'IDEA', 'OTHER');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('IDEA', 'SCRIPTING', 'FILMING', 'EDITING', 'SCHEDULED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "scene_type" AS ENUM ('OPENING', 'HOOK', 'INTRO', 'BODY', 'BROLL', 'CTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "shot_type" AS ENUM ('CLOSEUP', 'MEDIUM', 'WIDE', 'POV', 'OVERHEAD');

-- CreateEnum
CREATE TYPE "content_platform" AS ENUM ('TIKTOK', 'YOUTUBE', 'FACEBOOK', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "checklist_phase" AS ENUM ('PRE', 'PRODUCTION', 'POST', 'PUBLISH');

-- ─── Tables ─────────────────────────────────────────────────
-- CreateTable
CREATE TABLE "content_projects" (
 "id" SERIAL NOT NULL,
 "slug" VARCHAR(120) NOT NULL,
 "title" VARCHAR(200) NOT NULL,
 "type" "content_type" NOT NULL,
 "status" "content_status" NOT NULL DEFAULT 'IDEA',
 "idea_date" TIMESTAMP(3),
 "film_date" TIMESTAMP(3),
 "publish_date" TIMESTAMP(3),
 "concept" TEXT,
 "main_hook" VARCHAR(280),
 "thumbnail_url" VARCHAR(500),
 "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
 "reference_links" JSONB NOT NULL DEFAULT '[]',
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "content_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_days" (
 "id" SERIAL NOT NULL,
 "content_project_id" INTEGER NOT NULL,
 "day_number" INTEGER NOT NULL,
 "date" TIMESTAMP(3),
 "location" VARCHAR(200),
 "notes" TEXT,
 "order" INTEGER NOT NULL DEFAULT 0,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "production_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenes" (
 "id" SERIAL NOT NULL,
 "production_day_id" INTEGER NOT NULL,
 "scene_number" INTEGER NOT NULL,
 "scene_type" "scene_type" NOT NULL,
 "dialogue" TEXT,
 "voiceover" TEXT,
 "camera_angle" VARCHAR(200),
 "shot_type" "shot_type",
 "action" TEXT,
 "props" VARCHAR(300),
 "broll_notes" TEXT,
 "editing_notes" TEXT,
 "duration_seconds" INTEGER,
 "storyboard_image_url" VARCHAR(500),
 "order" INTEGER NOT NULL DEFAULT 0,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "scenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_products" (
 "id" SERIAL NOT NULL,
 "content_project_id" INTEGER NOT NULL,
 "name" VARCHAR(200) NOT NULL,
 "url" VARCHAR(500) NOT NULL,
 "discount_code" VARCHAR(50),
 "commission_percent" DOUBLE PRECISION,
 "revenue" DOUBLE PRECISION DEFAULT 0,
 "notes" TEXT,
 "order" INTEGER NOT NULL DEFAULT 0,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "affiliate_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_posts" (
  "id" SERIAL NOT NULL,
 "content_project_id" INTEGER NOT NULL,
 "platform" "content_platform" NOT NULL,
 "caption" TEXT,
 "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
 "scheduled_time" TIMESTAMP(3),
 "post_url" VARCHAR(500),
 "is_published" BOOLEAN NOT NULL DEFAULT false,
 "order" INTEGER NOT NULL DEFAULT 0,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "platform_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
 "id" SERIAL NOT NULL,
 "content_project_id" INTEGER NOT NULL,
 "phase" "checklist_phase" NOT NULL,
 "label" VARCHAR(300) NOT NULL,
 "done" BOOLEAN NOT NULL DEFAULT false,
 "order" INTEGER NOT NULL DEFAULT 0,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_performance" (
 "id" SERIAL NOT NULL,
 "content_project_id" INTEGER NOT NULL,
 "views" INTEGER NOT NULL DEFAULT 0,
 "likes" INTEGER NOT NULL DEFAULT 0,
 "comments" INTEGER NOT NULL DEFAULT 0,
 "shares" INTEGER NOT NULL DEFAULT 0,
 "ctr" DOUBLE PRECISION,
 "watch_time_sec" INTEGER,
 "platform_metrics" JSONB NOT NULL DEFAULT '{}',
 "lessons_learned" TEXT,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP(3) NOT NULL,

 CONSTRAINT "content_performance_pkey" PRIMARY KEY ("id")
);

-- ─── Indexes ────────────────────────────────────────────────
-- CreateIndex
CREATE UNIQUE INDEX "content_projects_slug_key" ON "content_projects"("slug");

-- CreateIndex
CREATE INDEX "idx_content_projects_status_type" ON "content_projects"("status", "type");

-- CreateIndex
CREATE INDEX "idx_content_projects_film_date" ON "content_projects"("film_date");

-- CreateIndex
CREATE INDEX "idx_content_projects_publish_date" ON "content_projects"("publish_date");

-- CreateIndex
CREATE INDEX "idx_content_projects_type" ON "content_projects"("type");

-- CreateIndex
CREATE INDEX "idx_production_days_project_order" ON "production_days"("content_project_id", "order");

-- CreateIndex
CREATE INDEX "idx_scenes_day_order" ON "scenes"("production_day_id", "order");

-- CreateIndex
CREATE INDEX "idx_affiliate_products_project_order" ON "affiliate_products"("content_project_id", "order");

-- CreateIndex
CREATE INDEX "idx_platform_posts_project_order" ON "platform_posts"("content_project_id", "order");

-- CreateIndex
CREATE INDEX "idx_platform_posts_project_platform" ON "platform_posts"("content_project_id", "platform");

-- CreateIndex
CREATE INDEX "idx_checklist_items_project_phase_order" ON "checklist_items"("content_project_id", "phase", "order");

-- CreateIndex
CREATE UNIQUE INDEX "content_performance_content_project_id_key" ON "content_performance"("content_project_id");

-- ─── Foreign keys (CASCADE on parent delete) ───────────────
-- AddForeignKey
ALTER TABLE "production_days" ADD CONSTRAINT "production_days_content_project_id_fkey" FOREIGN KEY ("content_project_id") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_production_day_id_fkey" FOREIGN KEY ("production_day_id") REFERENCES "production_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_products" ADD CONSTRAINT "affiliate_products_content_project_id_fkey" FOREIGN KEY ("content_project_id") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_posts" ADD CONSTRAINT "platform_posts_content_project_id_fkey" FOREIGN KEY ("content_project_id") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_content_project_id_fkey" FOREIGN KEY ("content_project_id") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_performance" ADD CONSTRAINT "content_performance_content_project_id_fkey" FOREIGN KEY ("content_project_id") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
