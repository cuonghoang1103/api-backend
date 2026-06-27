-- ─── Tech trends: rich body via TipTap/Markdown (Tier 1A) ─
-- Adds three columns to tech_trend_articles:
--   body_mdx  TEXT  — canonical Markdown source written by the
--                       admin via the TipTap editor. Authoritative.
--   body_html TEXT  — server-rendered HTML cached at write time
--                       so the public read endpoint doesn't pay a
--                       render cost on every request. Re-rendered
--                       whenever body_mdx changes.
--   toc       JSONB — auto-extracted heading list for the sidebar
--                       table of contents. Same lifecycle as
--                       body_html — re-extracted on every write.
--
-- All three are nullable so existing rows (already published
-- via the legacy body String[] column) keep working without a
-- backfill. The reader detects body_mdx IS NOT NULL and
-- prefers it; otherwise it falls back to joining the legacy
-- `body` array with <p> tags.
--
-- ADD COLUMN ... DEFAULT NULL is metadata-only in Postgres 11+.

ALTER TABLE "tech_trend_articles" ADD COLUMN "body_mdx"  TEXT;
ALTER TABLE "tech_trend_articles" ADD COLUMN "body_html" TEXT;
ALTER TABLE "tech_trend_articles" ADD COLUMN "toc"       JSONB;