-- ============================================================
-- Migration: add_stories_tables
-- Phase 6 features - Stories / Tin
-- ============================================================

-- Create stories table
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

-- Create story_views table
CREATE TABLE IF NOT EXISTS story_views (
  id        SERIAL PRIMARY KEY,
  story_id  INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_story_view ON story_views(story_id, user_id);
CREATE INDEX IF NOT EXISTS idx_story_view_story ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_view_user ON story_views(user_id);

-- Create story_highlights table
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

-- Create story_hides table
CREATE TABLE IF NOT EXISTS story_hides (
  id        SERIAL PRIMARY KEY,
  story_id  INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_story_hide ON story_hides(story_id, user_id);
CREATE INDEX IF NOT EXISTS idx_story_hide_story ON story_hides(story_id);
CREATE INDEX IF NOT EXISTS idx_story_hide_user ON story_hides(user_id);

-- ============================================================
-- Rollback:
-- DROP TABLE IF EXISTS story_hides;
-- DROP TABLE IF EXISTS story_highlights;
-- DROP TABLE IF EXISTS story_views;
-- DROP TABLE IF EXISTS stories;
-- ============================================================
