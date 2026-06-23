-- ─────────────────────────────────────────────────────────────────
-- Add project_list_items table + extend project_milestones with
-- optional code block fields. Additive migration — every column
-- is NULL-able or has a default, and the new table is empty, so
-- existing projects are unaffected.
-- ─────────────────────────────────────────────────────────────────

-- 1) Extend project_milestones with codeBlock / codeLang.
-- NULL-able so existing rows (and the seed) are valid without
-- backfill. Editors set these via the new "Code review" block
-- inside the milestone row.
ALTER TABLE "project_milestones"
 ADD COLUMN "code_block" TEXT,
 ADD COLUMN "code_lang" VARCHAR(40);

-- 2) ProjectListKind enum — Postgres creates it implicitly from
-- Prisma's enum mapping. We declare it explicitly so the type is
-- stable across schema regenerations.
CREATE TYPE "ProjectListKind" AS ENUM (
 'CORE_KNOWLEDGE',
 'PORTFOLIO_BONUS',
 'COMPLETION_OUTCOME'
);

-- 3) project_list_items — single table shared by the three new
-- "list of strings" sections. Using one table + a kind enum
-- keeps the schema compact, makes the API uniform (one CRUD
-- pair handles all three), and avoids 3 nearly-identical child
-- tables.
CREATE TABLE "project_list_items" (
 "id" SERIAL NOT NULL,
 "project_id" INTEGER NOT NULL,
 "kind" "ProjectListKind" NOT NULL,
 "content" VARCHAR(500) NOT NULL,
 "order" INTEGER NOT NULL DEFAULT 0,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "project_list_items_pkey" PRIMARY KEY ("id")
);

-- 4) Index for the dominant query pattern: list all items of a
-- given kind for a project, ordered by `order` ASC. Composite
-- index keeps both filtering and sorting off a single B-tree.
CREATE INDEX "idx_project_list_items_project_kind_order"
 ON "project_list_items"("project_id", "kind", "order");

-- 5) Foreign key to projects, CASCADE on delete so child rows
-- disappear with the parent. onDelete matches the existing
-- convention used by project_milestones / features / resources.
ALTER TABLE "project_list_items"
 ADD CONSTRAINT "project_list_items_project_id_fkey"
 FOREIGN KEY ("project_id") REFERENCES "projects"("id")
 ON DELETE CASCADE ON UPDATE CASCADE;
