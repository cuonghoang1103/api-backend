-- Add content-type bucket to social_posts for the home feed tabs
-- (Tất cả / Bài viết / Video / File). Additive + backfilled; safe for
-- existing data (column has a default, backfill only sets the new column).

-- 1. Add the column with a default so every existing row is immediately valid.
ALTER TABLE "social_posts" ADD COLUMN "type" VARCHAR(20) NOT NULL DEFAULT 'POST';

-- 2. Backfill old rows so they land in the right tab. Idempotent / re-runnable.
--    VIDEO: has a YouTube link or any VIDEO media.
UPDATE "social_posts" p
   SET "type" = 'VIDEO'
 WHERE p."youtube_url" IS NOT NULL
    OR EXISTS (
         SELECT 1 FROM "social_media" m
          WHERE m."post_id" = p."id" AND m."type" = 'VIDEO'
       );

--    FILE: not already VIDEO, and has any FILE / CODE_FILE media.
UPDATE "social_posts" p
   SET "type" = 'FILE'
 WHERE p."type" = 'POST'
   AND EXISTS (
         SELECT 1 FROM "social_media" m
          WHERE m."post_id" = p."id" AND m."type" IN ('FILE', 'CODE_FILE')
       );

-- 3. Index powering the content-type tabs (filter by type, newest first).
CREATE INDEX "idx_social_posts_type_created" ON "social_posts" ("type", "created_at" DESC);
