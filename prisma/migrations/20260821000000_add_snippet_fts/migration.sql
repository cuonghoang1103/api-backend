-- Migration: add_snippet_fts
-- Full-text search for EXP_Hub — ADDITIVE: one generated column + one GIN
-- index on the existing snippets table. No data migration, no other table
-- touched. The column is GENERATED ALWAYS ... STORED so Postgres keeps it in
-- sync automatically (no trigger). Config 'simple' = no stemming, which suits
-- both code tokens and Vietnamese text. Queried only via $queryRaw.

-- AlterTable — generated tsvector over title + description + code
ALTER TABLE "snippets"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      coalesce("title", '') || ' ' ||
      coalesce("description", '') || ' ' ||
      coalesce("code", '')
    )
  ) STORED;

-- CreateIndex — GIN for fast @@ tsquery matching
CREATE INDEX "idx_snippets_search_vector" ON "snippets" USING GIN ("search_vector");
