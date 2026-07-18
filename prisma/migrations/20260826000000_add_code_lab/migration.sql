-- Migration: add_code_lab
-- Code Lab — coding-practice + learning-roadmap module. Fully ADDITIVE:
-- four new enums + five brand-new tables
-- (code_groups, code_tracks, code_modules, code_exercises, code_progress)
-- with their FKs, indexes and a generated tsvector search column on
-- code_exercises. No existing table/column is touched, so this applies
-- cleanly on a database carrying historical drift. Matches the schema.

-- CreateEnum
CREATE TYPE "code_level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "code_difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');
CREATE TYPE "code_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "code_progress_status" AS ENUM ('IN_PROGRESS', 'SOLVED');

-- CreateTable
CREATE TABLE "code_groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(500),
    "color" VARCHAR(20),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_tracks" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "language" VARCHAR(40) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(500),
    "color" VARCHAR(20),
    "cover_image_url" VARCHAR(2000),
    "docs_url" VARCHAR(500),
    "level" "code_level" NOT NULL DEFAULT 'BEGINNER',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "code_status" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_modules" (
    "id" SERIAL NOT NULL,
    "track_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "level" "code_level" NOT NULL DEFAULT 'BEGINNER',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_exercises" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "difficulty" "code_difficulty" NOT NULL DEFAULT 'EASY',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "code_status" NOT NULL DEFAULT 'PUBLISHED',
    "language" VARCHAR(40) NOT NULL,
    "problem_html" TEXT,
    "concepts" JSONB,
    "prerequisites" JSONB,
    "input_spec" TEXT,
    "output_spec" TEXT,
    "constraints" TEXT,
    "examples_json" JSONB,
    "hints_json" JSONB,
    "starter_code_json" JSONB,
    "solution_code_json" JSONB,
    "solution_explanation_html" TEXT,
    "diagram_image_url" VARCHAR(2000),
    "images_json" JSONB,
    "youtube_url" VARCHAR(500),
    "reference_url" VARCHAR(500),
    "tags" JSONB,
    "estimated_minutes" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 10,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "solve_count" INTEGER NOT NULL DEFAULT 0,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "status" "code_progress_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "saved_code" JSONB,
    "solved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_code_group_slug" ON "code_groups"("slug");
CREATE INDEX "idx_code_group_order" ON "code_groups"("sort_order");

CREATE UNIQUE INDEX "uk_code_track_slug" ON "code_tracks"("slug");
CREATE INDEX "idx_code_track_group_order" ON "code_tracks"("group_id", "sort_order");
CREATE INDEX "idx_code_track_slug" ON "code_tracks"("slug");

CREATE UNIQUE INDEX "uk_code_module_track_slug" ON "code_modules"("track_id", "slug");
CREATE INDEX "idx_code_module_track_order" ON "code_modules"("track_id", "sort_order");

CREATE UNIQUE INDEX "uk_code_exercise_slug" ON "code_exercises"("slug");
CREATE INDEX "idx_code_exercise_module_order" ON "code_exercises"("module_id", "sort_order");
CREATE INDEX "idx_code_exercise_track" ON "code_exercises"("track_id");
CREATE INDEX "idx_code_exercise_status" ON "code_exercises"("status");
CREATE INDEX "idx_code_exercise_difficulty" ON "code_exercises"("difficulty");
CREATE INDEX "idx_code_exercise_language" ON "code_exercises"("language");
CREATE INDEX "idx_code_exercise_slug" ON "code_exercises"("slug");

CREATE UNIQUE INDEX "uk_code_progress_user_exercise" ON "code_progress"("user_id", "exercise_id");
CREATE INDEX "idx_code_progress_user_status" ON "code_progress"("user_id", "status");
CREATE INDEX "idx_code_progress_exercise" ON "code_progress"("exercise_id");

-- AddForeignKey
ALTER TABLE "code_tracks" ADD CONSTRAINT "code_tracks_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "code_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_modules" ADD CONSTRAINT "code_modules_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "code_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_exercises" ADD CONSTRAINT "code_exercises_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "code_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "code_exercises" ADD CONSTRAINT "code_exercises_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "code_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "code_exercises" ADD CONSTRAINT "code_exercises_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "code_progress" ADD CONSTRAINT "code_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "code_progress" ADD CONSTRAINT "code_progress_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "code_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Full-text search: generated tsvector over title + problem + concepts + language.
-- GENERATED ALWAYS ... STORED so Postgres keeps it in sync (no trigger).
-- Config 'simple' = no stemming (suits code tokens). Queried only via $queryRaw.
ALTER TABLE "code_exercises"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      coalesce("title", '') || ' ' ||
      coalesce("problem_html", '') || ' ' ||
      coalesce("concepts"::text, '') || ' ' ||
      coalesce("language", '')
    )
  ) STORED;

CREATE INDEX "idx_code_exercises_search_vector" ON "code_exercises" USING GIN ("search_vector");
