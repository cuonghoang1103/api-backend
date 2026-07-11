-- ============================================================
-- Migration: add_stories_and_message_post_share
--
-- Folds two previously-loose SQL files that were sitting directly in
-- prisma/migrations/ (add_stories_tables.sql and
-- add_message_post_share_and_shares_count.sql) into a proper, tracked
-- migration so a fresh `prisma migrate deploy` (new environment, DB
-- rebuild, restore) creates these objects. On the existing production DB
-- (where they were applied by hand) every statement is guarded with
-- IF NOT EXISTS / a constraint-existence check, so re-applying is a no-op.
--
-- Covers:
--   1. Stories / Tin: stories, story_views, story_highlights, story_hides
--   2. SocialPost.shares_count + social_shares unique constraint
--   3. message_post_shares (post-share previews inside messages)
-- ============================================================

-- ── 1. Stories ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stories (
  id                SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visibility       VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
  caption          TEXT,
  media_url       VARCHAR(700),
  media_type       VARCHAR(10) NOT NULL DEFAULT 'IMAGE',
  duration_seconds INTEGER,
  thumbnail        VARCHAR(700),
  background_color VARCHAR(7),
  expires_at       TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_user ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_story_expires ON stories(expires_at);

CREATE TABLE IF NOT EXISTS story_views (
  id        SERIAL PRIMARY KEY,
  story_id  INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_story_view ON story_views(story_id, user_id);
CREATE INDEX IF NOT EXISTS idx_story_view_story ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_view_user ON story_views(user_id);

CREATE TABLE IF NOT EXISTS story_highlights (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(50) NOT NULL,
  story_id  INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_highlight_story ON story_highlights(user_id, story_id);
CREATE INDEX IF NOT EXISTS idx_highlight_user ON story_highlights(user_id);

CREATE TABLE IF NOT EXISTS story_hides (
  id        SERIAL PRIMARY KEY,
  story_id  INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_story_hide ON story_hides(story_id, user_id);
CREATE INDEX IF NOT EXISTS idx_story_hide_story ON story_hides(story_id);
CREATE INDEX IF NOT EXISTS idx_story_hide_user ON story_hides(user_id);

-- ── 2. SocialPost.shares_count + social_shares unique constraint ──
ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uk_social_share_post_user'
  ) THEN
    ALTER TABLE social_shares ADD CONSTRAINT uk_social_share_post_user UNIQUE (post_id, user_id);
  END IF;
END $$;

-- ── 3. message_post_shares ──────────────────────────────────
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
