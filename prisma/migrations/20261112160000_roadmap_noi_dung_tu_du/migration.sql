-- Bước lộ trình có bài đọc tự đủ (Markdown) + danh sách bài học/slide/mô phỏng ngay trên web (12/11/2026).
ALTER TABLE "roadmap_nodes" ADD COLUMN "body" TEXT;
ALTER TABLE "roadmap_nodes" ADD COLUMN "lessons" JSONB;
