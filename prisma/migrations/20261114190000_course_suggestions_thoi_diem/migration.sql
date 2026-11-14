-- Góp ý nhanh trong trang học (14/11/2026) — docs/gop-y-khoa-hoc.md.
-- Chỉ ADD COLUMN nullable, không default, không khoá bảng lâu: an toàn với dữ liệu prod (dòng cũ = NULL).
-- Giá trị hợp lệ (0–86400 giây; VI|EN|YT) chốt bằng Zod trong src/services/courseSuggestion.service.ts.
ALTER TABLE "course_suggestions" ADD COLUMN "thoi_diem_giay" INTEGER;
ALTER TABLE "course_suggestions" ADD COLUMN "nguon_video" VARCHAR(4);
ALTER TABLE "course_suggestions" ADD COLUMN "tu_sai" TEXT;
ALTER TABLE "course_suggestions" ADD COLUMN "nen_doc" TEXT;
