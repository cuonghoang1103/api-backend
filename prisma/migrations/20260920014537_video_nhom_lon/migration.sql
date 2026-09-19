-- Nhóm lớn cho video người dùng tự thêm (hoạt hình, nhạc, lịch sử…).
-- Bài giảng Academy luôn thuộc nhóm 'academy' nên không cần cột này.
ALTER TABLE "video_nguoi_dung"
    ADD COLUMN IF NOT EXISTS "nhom_lon" VARCHAR(24) NOT NULL DEFAULT 'khac';

CREATE INDEX IF NOT EXISTS "idx_video_nguoi_dung_nhom_lon"
    ON "video_nguoi_dung"("user_id", "nhom_lon");
