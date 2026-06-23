-- ──────────────────────────────────────────────────────────
-- Phase 6: Full-text search for project case studies
-- ──────────────────────────────────────────────────────────
-- We add a generated `search_vector` column that concatenates
-- title, description, and body_mdx into a single tsvector
-- weighted by importance (A=title, B=description, C=body).
-- Postgres keeps it in sync automatically; we just need a
-- GIN index for sub-millisecond lookups.
--
-- We use the `simple` text-search configuration because
-- stemming is language-specific and Vietnamese isn't well
-- served by any built-in dictionary. For a portfolio this
-- is plenty — users will search for tech names, project
-- names, etc. that don't need stemming anyway.

ALTER TABLE "projects"
 ADD COLUMN "search_vector" tsvector
 GENERATED ALWAYS AS (
 setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
 setweight(to_tsvector('simple', coalesce("description", '')), 'B') ||
 setweight(to_tsvector('simple', coalesce("body_mdx", '')), 'C')
 ) STORED;

CREATE INDEX "idx_projects_search_vector" ON "projects" USING GIN ("search_vector");

-- Trigger function to bump the updatedAt column on
-- search_vector changes (Postgres doesn't auto-update
-- updatedAt for generated columns, but our app already
-- manages updatedAt on every PUT, so this is a no-op
-- safety net).
CREATE OR REPLACE FUNCTION projects_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
 NEW."updated_at" = now();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;
