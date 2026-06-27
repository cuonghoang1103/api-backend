-- ─── SocialPost music attach (Phase 3) ─────────────────────
-- Adds musicTrackId + musicStartSec columns to social_posts
-- so the composer can attach a music track to a post (the
-- Instagram-style "Music" sticker). The columns are nullable
-- so every existing post keeps working without a music
-- attachment — old posts just render the regular post card
-- without the music strip.
--
-- Foreign key is ON DELETE SET NULL (not CASCADE) so deleting
-- a track doesn't cascade-delete the user's post — the post
-- simply loses its music attachment. This matches the
-- behaviour of other optional foreign keys in the codebase
-- (e.g. course's discountCodeId).

ALTER TABLE "social_posts" ADD COLUMN "music_track_id" INTEGER;
ALTER TABLE "social_posts" ADD COLUMN "music_start_sec" INTEGER;

ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_music_track_id_fkey"
    FOREIGN KEY ("music_track_id") REFERENCES "music_tracks"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Index for the music sticker lookup on the feed query.
-- Small — music attach is rare, so we don't need a covering
-- index, just enough for the WHERE filter on the post
-- rows-join-track join.
CREATE INDEX "idx_social_posts_music_track" ON "social_posts"("music_track_id");
