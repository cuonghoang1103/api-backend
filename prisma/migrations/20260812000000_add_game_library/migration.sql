-- Migration: add_game_library
-- Game Library ("Playground") — DB-backed replacement for the old static
-- GAMES_DATA array. Fully ADDITIVE: 3 new enums + 3 new tables only. No
-- existing table or column is altered, so this applies cleanly even on a
-- database carrying historical drift.
--
-- SQL below is taken verbatim from `prisma migrate diff --from-empty
-- --to-schema-datamodel` so it matches Prisma's canonical output exactly
-- (zero drift on any future migrate status/diff).

-- CreateEnum
CREATE TYPE "GameDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMING_SOON');

-- CreateEnum
CREATE TYPE "GameKind" AS ENUM ('REACT', 'IFRAME');

-- CreateTable
CREATE TABLE "game_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "name_vi" VARCHAR(80),
    "slug" VARCHAR(80) NOT NULL,
    "icon" VARCHAR(40),
    "color" VARCHAR(16),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "title_vi" VARCHAR(160),
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT NOT NULL,
    "description_vi" TEXT,
    "long_description" TEXT,
    "cover_image" VARCHAR(500),
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" "GameDifficulty" NOT NULL DEFAULT 'EASY',
    "status" "GameStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "play_count" INTEGER NOT NULL DEFAULT 0,
    "kind" "GameKind" NOT NULL DEFAULT 'REACT',
    "component_key" VARCHAR(64),
    "iframe_src" VARCHAR(500),
    "estimated_time" VARCHAR(40),
    "tech_stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "controls" TEXT,
    "controls_vi" TEXT,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_plays" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "score" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_plays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_game_category_slug" ON "game_categories"("slug");

-- CreateIndex
CREATE INDEX "idx_game_category_sort" ON "game_categories"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "uk_game_slug" ON "games"("slug");

-- CreateIndex
CREATE INDEX "idx_game_status_featured" ON "games"("status", "featured");

-- CreateIndex
CREATE INDEX "idx_game_category" ON "games"("category_id");

-- CreateIndex
CREATE INDEX "idx_game_sort" ON "games"("sort_order");

-- CreateIndex
CREATE INDEX "idx_game_play_game_score" ON "game_plays"("game_id", "score" DESC);

-- CreateIndex
CREATE INDEX "idx_game_play_user" ON "game_plays"("user_id");

-- CreateIndex
CREATE INDEX "idx_game_play_time" ON "game_plays"("played_at" DESC);

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "game_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_plays" ADD CONSTRAINT "game_plays_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_plays" ADD CONSTRAINT "game_plays_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
