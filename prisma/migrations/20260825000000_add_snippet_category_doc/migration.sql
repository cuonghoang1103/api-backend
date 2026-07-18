-- Exp Hub P3: AI-generated full-English reference doc per category (technology).
-- Additive only — four nullable columns on snippet_categories. Safe on prod:
-- existing rows get NULL (= "no doc yet"); the short `description` is untouched.

-- AlterTable
ALTER TABLE "snippet_categories"
  ADD COLUMN "doc_blocks" JSONB,
  ADD COLUMN "doc_lang" VARCHAR(8),
  ADD COLUMN "doc_model" VARCHAR(80),
  ADD COLUMN "doc_generated_at" TIMESTAMP(3);
