-- ─────────────────────────────────────────────────────────────────
-- Migration: add_comment_depth_and_notif_read_at
-- Phase 5 home upgrade — additive schema changes only.
--
-- 1) social_comments.depth + root_id
--    Phase 5 enforces maxDepth=2 for threaded comments (top-level
--    + 1 reply level). Existing rows stay at depth=0 / root_id=NULL
--    so the comment timeline keeps working unchanged; the new
--    index lets us fetch an entire thread (parent + replies)
--    in one query.
--
-- 2) social_notifications.read_at
--    We add a nullable timestamp so the bell can show "read 2h
--    ago" without an extra query. Existing rows stay NULL,
--    which the UI already treats as "read but we don't know
--    when" (same as before).
--
-- Both changes are wrapped in DO $$ … $$ blocks so the migration
-- is idempotent — re-running against a partially-applied schema
-- (e.g. crashed mid-deploy) is safe and a no-op.
-- ─────────────────────────────────────────────────────────────────

-- ─── 1) SocialComment.depth + root_id ──────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'social_comments' AND column_name = 'depth'
  ) THEN
    ALTER TABLE social_comments
      ADD COLUMN depth INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'social_comments' AND column_name = 'root_id'
  ) THEN
    ALTER TABLE social_comments
      ADD COLUMN root_id INTEGER NULL
      REFERENCES social_comments(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_social_comments_root'
  ) THEN
    CREATE INDEX idx_social_comments_root ON social_comments(root_id);
  END IF;
END $$;

-- Backfill root_id for existing top-level comments (parentId IS NULL
-- → root_id is self). For existing replies (parentId IS NOT NULL),
-- root_id is the top-level ancestor. This is a one-time backfill
-- so the new index is immediately useful for thread queries.
UPDATE social_comments
SET root_id = id
WHERE parent_id IS NULL AND root_id IS NULL;

-- For replies, point root_id at the top-level ancestor.
-- We use a recursive CTE but cap depth at 2 — Phase 5 enforces
-- maxDepth=2 in code, so existing rows can never be deeper than 1.
WITH RECURSIVE ancestors AS (
  SELECT id, parent_id, id AS computed_root
  FROM social_comments
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.parent_id, a.computed_root
  FROM social_comments c
  JOIN ancestors a ON c.parent_id = a.id
  WHERE c.depth <= 1
)
UPDATE social_comments sc
SET root_id = a.computed_root
FROM ancestors a
WHERE sc.id = a.id AND sc.root_id IS NULL;

-- ─── 2) SocialNotification.read_at ────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'social_notifications' AND column_name = 'read_at'
  ) THEN
    ALTER TABLE social_notifications
      ADD COLUMN read_at TIMESTAMP NULL;
  END IF;
END $$;

-- Backfill read_at for existing already-read rows so analytics
-- have a starting point. We use the updatedAt-style approximation
-- by picking createdAt (best we can do without history). Existing
-- unread rows stay NULL.
UPDATE social_notifications
SET read_at = created_at
WHERE is_read = TRUE AND read_at IS NULL;
