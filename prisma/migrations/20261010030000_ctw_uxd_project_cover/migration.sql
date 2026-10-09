-- CT Work UX-D (09/10/2026): ảnh bìa dự án — chỉ THÊM cột, không đổi dữ liệu cũ.
--   cover_url        "preset:<id>" (thư viện ảnh bìa có sẵn) hoặc URL công khai ảnh tải lên
--   cover_position_y điểm lấy nét theo chiều dọc, 0–100 (%); NULL = giữa (50)
ALTER TABLE "work_projects" ADD COLUMN "cover_url" VARCHAR(500);
ALTER TABLE "work_projects" ADD COLUMN "cover_position_y" INTEGER;
