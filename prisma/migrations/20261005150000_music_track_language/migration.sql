-- Bộ lọc Nhạc Việt / Anh / Trung (05/10/2026). Cột cho phép trống, không đụng dữ liệu cũ.
ALTER TABLE "music_tracks" ADD COLUMN "language" VARCHAR(8);
