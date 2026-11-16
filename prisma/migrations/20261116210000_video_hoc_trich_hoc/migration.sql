-- Học qua video (CT Language, 16/11/2026) — thẻ TỪ VỰNG + NGỮ PHÁP trích bằng AI từ một câu / đoạn / cả video.
-- CHỈ THÊM một cột: kết quả lưu theo khoá phạm vi ("cau:12-12", "doan:0-14", "video") để không gọi AI lần hai.
ALTER TABLE "video_nguoi_dung" ADD COLUMN "trich_hoc" JSONB;
