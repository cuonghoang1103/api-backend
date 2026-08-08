-- Creator Studio: teaching content types, Academy binding,
-- script history + reusable script templates.
--
-- ── Why this file is hand-written ──────────────────────────────
-- `prisma migrate diff` renders enum changes as a drop-and-
-- recreate: CREATE TYPE content_type_new → ALTER every column
-- USING (type::text::content_type_new) → DROP TYPE old.
-- That is DESTRUCTIVE here, because the value `CODE` does not
-- exist in the new enum: the USING cast throws
-- "invalid input value for enum" on the first surviving row and
-- the whole migration aborts (or, worse, would need those rows
-- nulled first).
--
-- Postgres 12+ can do this non-destructively with RENAME VALUE /
-- ADD VALUE, which rewrite the type in place and leave every
-- existing row untouched. Production runs PG 15, so we use that.
--
-- Each ADD VALUE is positioned BEFORE 'OTHER' so the physical
-- enum order matches the order declared in schema.prisma —
-- otherwise the next `migrate diff` reports phantom drift.

-- ── 1. Fix the CODE / CODE_REVIEW mismatch ────────────────────
-- The frontend (types/index.ts, studio-meta.ts, the List filter)
-- has always spoken 'CODE_REVIEW' while the enum said 'CODE'.
-- Creating one 400'd with INVALID_TYPE and any existing row
-- rendered undefined meta in the UI. Renaming the value fixes
-- both directions at once and preserves the rows.
ALTER TYPE "content_type" RENAME VALUE 'CODE' TO 'CODE_REVIEW';

-- ── 2. Teaching-oriented content types ────────────────────────
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'LECTURE' BEFORE 'OTHER';
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'EXAM_SOLVING' BEFORE 'OTHER';
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'EXERCISE' BEFORE 'OTHER';
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'PROJECT_BUILD' BEFORE 'OTHER';
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'TUTORIAL' BEFORE 'OTHER';
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'SHORTS' BEFORE 'OTHER';
ALTER TYPE "content_type" ADD VALUE IF NOT EXISTS 'LIVESTREAM' BEFORE 'OTHER';

-- ── 3. Academy binding + series/pacing on content_projects ────
-- Plain scalars, not FKs: deleting a Course or Exam must not
-- cascade into the video project that documents it.
ALTER TABLE "content_projects"
  ADD COLUMN "course_slug"         VARCHAR(255),
  ADD COLUMN "course_title"        VARCHAR(255),
  ADD COLUMN "exam_id"             INTEGER,
  ADD COLUMN "exam_title"          VARCHAR(255),
  ADD COLUMN "lesson_ref"          VARCHAR(255),
  ADD COLUMN "project_slug"        VARCHAR(255),
  ADD COLUMN "series_name"         VARCHAR(200),
  ADD COLUMN "episode_number"      INTEGER,
  ADD COLUMN "target_duration_sec" INTEGER,
  ADD COLUMN "script_lang"         VARCHAR(5) NOT NULL DEFAULT 'VI';

CREATE INDEX "idx_content_projects_course_slug" ON "content_projects"("course_slug");
CREATE INDEX "idx_content_projects_series"      ON "content_projects"("series_name", "episode_number");

-- ── 4. Script history ─────────────────────────────────────────
-- Immutable snapshots. Never written by the editor's autosave —
-- only by an explicit save, a template apply, or automatically
-- just before a restore (which makes restoring itself undoable).
CREATE TABLE "content_script_versions" (
    "id"                 SERIAL       NOT NULL,
    "content_project_id" INTEGER      NOT NULL,
    "version"            INTEGER      NOT NULL,
    "label"              VARCHAR(160),
    "script"             TEXT         NOT NULL,
    "word_count"         INTEGER      NOT NULL DEFAULT 0,
    "origin"             VARCHAR(16)  NOT NULL DEFAULT 'MANUAL',
    "created_at"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_script_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_script_version_project_version"
  ON "content_script_versions"("content_project_id", "version");
CREATE INDEX "idx_script_versions_project_created"
  ON "content_script_versions"("content_project_id", "created_at" DESC);

ALTER TABLE "content_script_versions"
  ADD CONSTRAINT "content_script_versions_content_project_id_fkey"
  FOREIGN KEY ("content_project_id") REFERENCES "content_projects"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ── 5. User-saved reusable script templates ───────────────────
-- Built-in templates live in code (studio-templates.ts) and need
-- no rows here; this table only holds what the user saves from
-- their own scripts.
CREATE TABLE "script_templates" (
    "id"             SERIAL       NOT NULL,
    "name"           VARCHAR(160) NOT NULL,
    "name_en"        VARCHAR(160),
    "description"    VARCHAR(500),
    "description_en" VARCHAR(500),
    "body"           TEXT         NOT NULL,
    "body_en"        TEXT,
    "content_type"   "content_type",
    "tags"           TEXT[]       DEFAULT ARRAY[]::TEXT[],
    "use_count"      INTEGER      NOT NULL DEFAULT 0,
    "order"          INTEGER      NOT NULL DEFAULT 0,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "script_templates_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_script_templates_type"      ON "script_templates"("content_type");
CREATE INDEX "idx_script_templates_use_count" ON "script_templates"("use_count" DESC);
