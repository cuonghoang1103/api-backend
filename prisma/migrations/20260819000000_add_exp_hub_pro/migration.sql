-- Migration: add_exp_hub_pro
-- EXP_Hub professional upgrade — fully ADDITIVE:
--   1. One new value on the existing `snippet_kind` enum: PROJECT.
--   2. Five nullable metadata columns on `snippet_categories`
--      (rich category headers: description / icon / color / cover / docs).
--   3. One nullable column on `snippets`: `repo_url` (GitHub repo for
--      PROJECT-kind entries).
--
-- No existing column is dropped or retyped, so this applies cleanly even
-- on a database carrying historical drift. Matches the canonical
-- `prisma migrate diff` output shape.
--
-- NOTE on the enum: `ALTER TYPE ... ADD VALUE` runs fine inside Prisma's
-- migration transaction on PostgreSQL 12+ because the new value is NOT
-- used elsewhere in this same migration (no INSERT references 'PROJECT').

-- AlterEnum
ALTER TYPE "snippet_kind" ADD VALUE 'PROJECT';

-- AlterTable
ALTER TABLE "snippet_categories" ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" VARCHAR(500),
ADD COLUMN     "color" VARCHAR(20),
ADD COLUMN     "cover_image_url" VARCHAR(2000),
ADD COLUMN     "docs_url" VARCHAR(500);

-- AlterTable
ALTER TABLE "snippets" ADD COLUMN     "repo_url" VARCHAR(500);
