-- ============================================================
-- Cyber-music Phase 1: persistent play queue
-- Additive migration: only creates new objects, never alters or
-- drops anything that already exists. Every CREATE uses
-- IF NOT EXISTS so the script can be replayed safely if
-- `prisma migrate deploy` runs twice.
-- ============================================================

-- 1. New junction table: per-user play queue
CREATE TABLE IF NOT EXISTS "music_queue_items" (
  "id"         SERIAL NOT NULL,
  "user_id"    INTEGER NOT NULL,
  "track_id"   INTEGER NOT NULL,
  "position"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "intent"     VARCHAR(16) NOT NULL DEFAULT 'queue',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "music_queue_items_pkey" PRIMARY KEY ("id")
);

-- 2. Idempotent uniqueness — same (userId, trackId) can never
--    exist twice. The service layer relies on this to avoid the
--    "duplicate queue row" bug the user reported.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_queue_user_track_unique'
  ) THEN
    ALTER TABLE "music_queue_items"
      ADD CONSTRAINT "music_queue_user_track_unique" UNIQUE ("user_id", "track_id");
  END IF;
END $$;

-- 3. Idempotent indexes
CREATE INDEX IF NOT EXISTS "idx_queue_user_position"
  ON "music_queue_items"("user_id", "position");

-- 4. Foreign keys (additive, idempotent). We use IF NOT EXISTS-style
--    guards via DO blocks so the migration can run twice without
--    raising "constraint already exists".
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_queue_items_user_id_fkey'
  ) THEN
    ALTER TABLE "music_queue_items"
      ADD CONSTRAINT "music_queue_items_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'music_queue_items_track_id_fkey'
  ) THEN
    ALTER TABLE "music_queue_items"
      ADD CONSTRAINT "music_queue_items_track_id_fkey"
      FOREIGN KEY ("track_id") REFERENCES "music_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;