-- Học qua video đa ngôn ngữ (CT Language, 16/11/2026) — CHỈ THÊM cột + chỉ mục, không đổi dữ liệu cũ.
--   lang     : ngôn ngữ của phụ đề ('en' | 'ja' | 'zh'). Hàng cũ = 'en' (trước nay chỉ nhận phụ đề tiếng Anh).
--   track_goc: mã track gốc đã lấy (vd 'ja', 'en-orig', 'zh-Hant', 'jpn-JP') — 'zh-Hant…' ⇒ app tự chuyển giản thể.
--   tu_dong  : phụ đề TỰ ĐỘNG (nhận dạng giọng nói) hay do người làm — app gắn nhãn để người học biết có thể sai.
--   so_dich  : số câu đã có bản dịch tiếng Việt (để màn duyệt hiện "Có bản dịch" mà không phải đọc cả mảng dich_vi).
ALTER TABLE "video_nguoi_dung" ADD COLUMN "lang" VARCHAR(12) NOT NULL DEFAULT 'en';
ALTER TABLE "video_nguoi_dung" ADD COLUMN "track_goc" VARCHAR(24);
ALTER TABLE "video_nguoi_dung" ADD COLUMN "tu_dong" BOOLEAN;
ALTER TABLE "video_nguoi_dung" ADD COLUMN "so_dich" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "idx_video_nguoi_dung_lang" ON "video_nguoi_dung"("user_id", "lang");
-- Dùng lại bản dịch của người khác cho cùng video + cùng ngôn ngữ (đỡ gọi AI lần hai).
CREATE INDEX "idx_video_nguoi_dung_nguon_video" ON "video_nguoi_dung"("nguon", "video_id", "lang");
