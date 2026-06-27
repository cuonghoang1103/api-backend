-- ─── Hub cover image (Phase 3) ────────────────────────────
-- Adds a `cover_image_url` column to each of the three Hub
-- item tables. The column is nullable — existing rows simply
-- render the current fallback (gradient for folders, scraped
-- og:image for links, mime icon for files). When the owner
-- uploads a custom cover via the Hub dialog (R2-backed via the
-- existing /files/upload endpoint), the URL is written here
-- and the UI prioritises it over the auto-derived visuals.
--
-- We deliberately keep `thumbnailUrl` (auto-scraped from
-- og:image) AND `coverImageUrl` (owner-uploaded) as separate
-- columns rather than overwriting one with the other — that
-- way the user can fall back to the og:image if they delete
-- their custom cover, and we can render a small "custom" badge
-- in the UI when coverImageUrl is set (so the user knows their
-- upload is being used).
--
-- ADD COLUMN ... DEFAULT NULL is a metadata-only change in
-- Postgres 11+ (no table rewrite), so this is safe to run on
-- a hot table.

ALTER TABLE "hub_folders" ADD COLUMN "cover_image_url" VARCHAR(2000);
ALTER TABLE "hub_links"   ADD COLUMN "cover_image_url" VARCHAR(2000);
ALTER TABLE "hub_files"   ADD COLUMN "cover_image_url" VARCHAR(2000);
