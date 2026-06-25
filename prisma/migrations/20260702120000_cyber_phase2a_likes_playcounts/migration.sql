-- ============================================================
-- Cyber-music Phase 2a: per-user likes + per-user play counts.
-- Additive migration: only creates new objects, never alters or
-- drops anything that already exists. Every CREATE uses
-- IF NOT EXISTS so the script can be replayed safely if
-- `prisma migrate deploy` runs twice.
-- ============================================================

-- 1. Music likes: one row per (userId, trackId).
CREATE TABLE IF NOT EXISTS "music_likes" (
  "id"         SERIAL NOT NULL,
  "user_id"    INTEGER NOT NULL,
  "track_id"   INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "music_likes_pkey" PRIMARY KEY ("id")
);

-- 2. Idempotent uniqueness — same (userId, trackId) can never
--    exist twice. The service layer relies on this to prevent
--    duplicate-like rows from concurrent clicks.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_likes_user_track_unique'
  ) THEN
    ALTER TABLE "music_likes"
      ADD CONSTRAINT "music_likes_user_track_unique" UNIQUE ("user_id", "track_id");
  END IF;
END $$;

-- 3. Idempotent indexes — track_id lookup for "who liked this",
--    user_id+created_at for "my likes sorted by recency".
CREATE INDEX IF NOT EXISTS "idx_music_likes_track"
  ON "music_likes"("track_id");
CREATE INDEX IF NOT EXISTS "idx_music_likes_user_recent"
  ON "music_likes"("user_id", "created_at" DESC);

-- 4. Foreign keys (additive, idempotent). DO blocks so the
--    migration can run twice without "constraint already exists".
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_likes_user_id_fkey'
  ) THEN
    ALTER TABLE "music_likes"
      ADD CONSTRAINT "music_likes_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_likes_track_id_fkey'
  ) THEN
    ALTER TABLE "music_likes"
      ADD CONSTRAINT "music_likes_track_id_fkey"
      FOREIGN KEY ("track_id") REFERENCES "music_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 5. Music play counts: one row per (userId, trackId) with an
--    additive count + last-played-at timestamp. Drives the
--    "Most Played" sort.
CREATE TABLE IF NOT EXISTS "music_play_counts" (
  "id"             SERIAL NOT NULL,
  "user_id"        INTEGER NOT NULL,
  "track_id"       INTEGER NOT NULL,
  "count"          INTEGER NOT NULL DEFAULT 0,
  "last_played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"     TIMESTAMP(3) NOT NULL,
  CONSTRAINT "music_play_counts_pkey" PRIMARY KEY ("id")
);

-- 6. Idempotent uniqueness.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_play_counts_user_track_unique'
  ) THEN
    ALTER TABLE "music_play_counts"
      ADD CONSTRAINT "music_play_counts_user_track_unique" UNIQUE ("user_id", "track_id");
  END IF;
END $$;

-- 7. Idempotent index — supports the "Most Played" query:
--    ORDER BY count DESC, last_played_at DESC.
CREATE INDEX IF NOT EXISTS "idx_music_play_counts_user_count"
  ON "music_play_counts"("user_id", "count" DESC);

-- 8. Foreign keys (additive, idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_play_counts_user_id_fkey'
  ) THEN
    ALTER TABLE "music_play_counts"
      ADD CONSTRAINT "music_play_counts_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_play_counts_track_id_fkey'
  ) THEN
    ALTER TABLE "music_play_counts"
      ADD CONSTRAINT "music_play_counts_track_id_fkey"
      FOREIGN KEY ("track_id") REFERENCES "music_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;