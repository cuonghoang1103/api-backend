-- Playlist riêng tư chia sẻ cho người được chỉ định (05/10/2026). CHỈ THÊM bảng mới.
CREATE TABLE "music_playlist_shares" (
    "id" SERIAL NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "music_playlist_shares_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_playlist_share" ON "music_playlist_shares"("playlist_id", "user_id");
CREATE INDEX "idx_playlist_share_user" ON "music_playlist_shares"("user_id");
ALTER TABLE "music_playlist_shares" ADD CONSTRAINT "music_playlist_shares_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "music_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
