-- ============================================================
-- Migration: add_message_post_share_and_shares_count
-- Phase 6 features:
--   1. SocialPost.sharesCount - count of shares/reposts
--   2. SocialShare unique constraint - for toggle semantics
--   3. MessagePostShare - store post share previews in messages
-- ============================================================

-- 1. Add sharesCount to SocialPost
ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER NOT NULL DEFAULT 0;

-- 2. Add unique constraint on SocialShare for repost toggle
-- First check if the constraint already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uk_social_share_post_user'
  ) THEN
    ALTER TABLE social_shares ADD CONSTRAINT uk_social_share_post_user UNIQUE (post_id, user_id);
  END IF;
END $$;

-- 3. Create MessagePostShare table
CREATE TABLE IF NOT EXISTS message_post_shares (
  id                SERIAL PRIMARY KEY,
  message_id        INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  post_id          INTEGER NOT NULL,
  author_username   VARCHAR(64) NOT NULL,
  author_display   VARCHAR(128),
  author_avatar    VARCHAR(500),
  content_preview  TEXT NOT NULL,
  media_thumbnail  VARCHAR(700),
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_msg_post_share_msg ON message_post_shares(message_id);
CREATE INDEX IF NOT EXISTS idx_msg_post_share_post ON message_post_shares(post_id);

-- ============================================================
-- Rollback (if needed):
-- DROP TABLE IF EXISTS message_post_shares;
-- ALTER TABLE social_posts DROP COLUMN IF EXISTS shares_count;
-- ALTER TABLE social_shares DROP CONSTRAINT IF EXISTS uk_social_share_post_user;
-- ============================================================
