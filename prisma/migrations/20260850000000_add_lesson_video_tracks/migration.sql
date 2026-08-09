-- Lesson videos in three parallel tracks: VI / EN / YT.
--
-- Until now a lesson had exactly one video. The learn page now shows a
-- VN / EN / YT switcher so the instructor's own Vietnamese and English
-- recordings can live alongside a curated third-party YouTube lecture, with
-- `default_video_track` deciding which one opens first.
--
-- Hand-written (not `prisma migrate dev`): migration
-- 20260706130000_add_music_and_profile creates a UNIQUE constraint and a
-- plain index with the same name, so the shadow database can never replay
-- the history (P3006). Apply with `npx prisma migrate deploy`.

ALTER TABLE "lesson_details"
  ADD COLUMN IF NOT EXISTS "video_url_vi"        VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "video_platform_vi"   VARCHAR(30),
  ADD COLUMN IF NOT EXISTS "video_url_en"        VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "video_platform_en"   VARCHAR(30),
  ADD COLUMN IF NOT EXISTS "video_url_yt"        VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "video_yt_credit"     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "default_video_track" VARCHAR(8) NOT NULL DEFAULT 'YT';

-- Backfill from the single legacy column so no existing lesson loses its
-- video. A YouTube link is a curated third-party lecture (YT track);
-- anything else is a file we host ourselves, i.e. an own recording (VI).
UPDATE "lesson_details"
   SET "video_url_yt" = "video_url"
 WHERE "video_url" IS NOT NULL
   AND "video_url_yt" IS NULL
   AND ("video_url" LIKE '%youtube.com%' OR "video_url" LIKE '%youtu.be%');

UPDATE "lesson_details"
   SET "video_url_vi"      = "video_url",
       "video_platform_vi" = COALESCE("video_platform", 'DIRECT')
 WHERE "video_url" IS NOT NULL
   AND "video_url_vi" IS NULL
   AND "video_url" NOT LIKE '%youtube.com%'
   AND "video_url" NOT LIKE '%youtu.be%';

-- An own recording outranks a borrowed one: open on VI where we have it.
UPDATE "lesson_details"
   SET "default_video_track" = 'VI'
 WHERE "video_url_vi" IS NOT NULL;
