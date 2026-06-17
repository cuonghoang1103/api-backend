-- Migration: add_thread_preferences
-- Description: Add `preferences` JSONB column to `message_threads` for
-- per-user thread metadata (pin, mute, archive, mark unread). Each
-- participant can set their own preferences without affecting the
-- other side. Keyed by userId:
--   { [userId]: { pinnedAt?, mutedUntil?, archivedAt?, markedUnreadAt? } }
ALTER TABLE "message_threads"
  ADD COLUMN IF NOT EXISTS "preferences" JSONB NOT NULL DEFAULT '{}'::jsonb;