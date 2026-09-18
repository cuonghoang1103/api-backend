-- Nền tài liệu của trang vở (PDF giáo trình / ảnh quét) — đồng bộ được.
--
-- Trước đây nền chỉ sống trên máy: người dùng chú thích cả học kỳ lên giáo
-- trình, mở máy khác ra thì nét bút trôi trên giấy trắng.
--
-- `bg_key` đánh theo NỘI DUNG (sha256) nên một PDF nhập nhiều trang chỉ tốn
-- MỘT object trên R2; mỗi trang chỉ khác `bg_page`.
--
-- Viết tay + IF NOT EXISTS: `prisma migrate dev` hỏng sẵn trong kho này
-- (P3006 vì migration 20260706130000), nên mọi migration đều đi
-- `migrate deploy` và phải chạy lại được nhiều lần mà không vỡ.
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "bg_key" VARCHAR(500);
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "bg_kind" VARCHAR(8);
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "bg_page" INTEGER NOT NULL DEFAULT 0;

-- Dọn tệp nền mồ côi: cần biết còn trang nào trỏ vào một khoá hay không.
CREATE INDEX IF NOT EXISTS "idx_notes_bg_key" ON "notes" ("bg_key") WHERE "bg_key" IS NOT NULL;
