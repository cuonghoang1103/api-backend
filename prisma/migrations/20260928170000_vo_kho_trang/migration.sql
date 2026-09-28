-- Vở viết tay: khổ giấy theo cuốn + nối dài từng trang (app iPad 28/09/2026).
--
--   note_chapters.ink_page_size  khổ của cả cuốn (NULL = A4)
--   notes.ink_extra_height       phần nối dài dưới đáy trang, point (0 = không)
--   notes.ink_page_size          khổ riêng của trang (NULL = theo cuốn)
--
-- Viết tay + IF NOT EXISTS: `prisma migrate dev` hỏng sẵn trong kho này
-- (P3006 vì migration 20260706130000), nên đi `migrate deploy` và phải chạy
-- lại được nhiều lần. Chỉ THÊM cột nullable / có mặc định — không đụng dữ
-- liệu có sẵn; máy chưa cập nhật app không gửi các khoá này và không bị ảnh hưởng.
ALTER TABLE "note_chapters" ADD COLUMN IF NOT EXISTS "ink_page_size" VARCHAR(16);
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "ink_extra_height" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "ink_page_size" VARCHAR(16);
