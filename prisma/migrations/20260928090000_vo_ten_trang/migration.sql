-- Vở viết tay: tên trang + nhãn chương tách khỏi `title`.
--
-- Trước đây `title` = nhãn chương hoặc "Trang N", và lượt kéo về lấy thẳng
-- `title` làm nhãn chương ⇒ cài lại app là mọi trang thành một mục lục
-- "Trang 1", "Trang 2"… Giờ hai giá trị nằm ở hai cột riêng; `title` vẫn được
-- dựng từ chúng để web đọc như cũ.
--
-- Viết tay + IF NOT EXISTS: `prisma migrate dev` hỏng sẵn trong kho này
-- (P3006 vì migration 20260706130000), nên mọi migration đi `migrate deploy`
-- và phải chạy lại được nhiều lần mà không vỡ. Chỉ THÊM cột nullable —
-- không đụng dữ liệu có sẵn.
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "ink_title" VARCHAR(300);
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "ink_section" VARCHAR(300);
