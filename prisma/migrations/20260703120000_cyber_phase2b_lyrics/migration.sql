-- ============================================================
-- Cyber-music Phase 2b: synced lyrics (one row per track).
-- Additive migration: only creates new objects, never alters or
-- drops anything that already exists. Every CREATE uses
-- IF NOT EXISTS so the script can be replayed safely if
-- `prisma migrate deploy` runs twice.
-- ============================================================

-- 1. Lyrics table: one row per track (1:1).
--    `synced` is JSONB: [{ "t": <seconds>, "text": "<line>" }] sorted by t.
--    `plain` is the newline-separated fallback when no timestamps exist.
CREATE TABLE IF NOT EXISTS "music_lyrics" (
  "id"            SERIAL NOT NULL,
  "track_id"      INTEGER NOT NULL,
  "format"        VARCHAR(16) NOT NULL DEFAULT 'synced',
  "synced"        JSONB,
  "plain"         TEXT,
  "updated_by_id" INTEGER,
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "music_lyrics_pkey" PRIMARY KEY ("id")
);

-- 2. Idempotent uniqueness on track_id — guarantees one lyrics row
--    per track. The service upserts against this constraint so a
--    re-save updates in place instead of inserting a duplicate.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_lyrics_track_id_key'
  ) THEN
    ALTER TABLE "music_lyrics"
      ADD CONSTRAINT "music_lyrics_track_id_key" UNIQUE ("track_id");
  END IF;
END $$;

-- 3. Foreign key (additive, idempotent). Cascade-delete with the track.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_lyrics_track_id_fkey'
  ) THEN
    ALTER TABLE "music_lyrics"
      ADD CONSTRAINT "music_lyrics_track_id_fkey"
      FOREIGN KEY ("track_id") REFERENCES "music_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
