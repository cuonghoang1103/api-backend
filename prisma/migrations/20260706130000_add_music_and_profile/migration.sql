-- ─── Music Post + User Profile (Phase 4 add) ───────────────
-- Adds the Song pool that admins use to curate music for
-- Instagram-style post attachments, the PostMusic join
-- table that records the per-post snippet (startSec..endSec
-- < 40s, with 1-second resolution), and the UserProfile
-- table for bio / cover photo / work / education / location
-- / website URL.

-- Song table
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "artist" VARCHAR(255) NOT NULL,
    "audio_url" VARCHAR(700) NOT NULL,
    "cover_image" VARCHAR(700),
    "duration_sec" INTEGER NOT NULL,
    "file_size" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "uploaded_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- Song uploader FK (Restrict on delete — don't cascade-delete
-- all posts that referenced a track if the original uploader is
-- removed; the admin can re-assign ownership first).
ALTER TABLE "songs" ADD CONSTRAINT "songs_uploaded_by_id_fkey"
    FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "idx_songs_active_created" ON "songs"("is_active", "created_at" DESC);

-- PostMusic join: 1-1 with post (each post has at most one
-- attached music). The postId column is unique so the second
-- snippet on the same post would replace the first instead of
-- accumulating.
CREATE TABLE "post_music" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "start_sec" INTEGER NOT NULL DEFAULT 0,
    "end_sec" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_music_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");
CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");

ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "social_posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_music" ADD CONSTRAINT "post_music_song_id_fkey"
    FOREIGN KEY ("song_id") REFERENCES "songs"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "idx_post_music_song" ON "post_music"("song_id");

-- UserProfile table (1-1 with users). Optional — every user
-- gets a default empty profile the first time the row is
-- touched. We use a separate table to avoid bloating the hot
-- User row with profile fields.
CREATE TABLE "user_profiles" (
    "user_id" INTEGER NOT NULL,
    "bio" TEXT,
    "cover_photo" VARCHAR(700),
    "location" VARCHAR(255),
    "website_url" VARCHAR(500),
    "work" VARCHAR(255),
    "education" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
