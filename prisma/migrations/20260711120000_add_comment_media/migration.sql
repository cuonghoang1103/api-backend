-- Add rich-media (GIF / sticker) columns to social_comments, mirroring the
-- messages.media_url / media_kind pair. Idempotent so re-runs on a DB that
-- already has the columns are safe (see CLAUDE.md P3009 history).
ALTER TABLE "social_comments" ADD COLUMN IF NOT EXISTS "media_url" TEXT;
ALTER TABLE "social_comments" ADD COLUMN IF NOT EXISTS "media_kind" VARCHAR(12);
