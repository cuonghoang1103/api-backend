-- Dòng database là một TRANG viết được (như Notion).
--
-- Cả hai cột đều thêm mới và có mặc định, nên dữ liệu cũ không bị đụng:
-- mọi dòng hiện có bắt đầu với page_note_id NULL (chưa ai mở trang), và mọi
-- ghi chú hiện có bắt đầu với is_database_page = false (đúng — chúng là trang
-- người dùng tự tạo).
--
-- ⚠️ Tên bắt đầu bằng 20260857 để sắp SAU 20260856. Prisma áp dụng migration
-- theo thứ tự TÊN chứ không theo ngày tạo, nên đặt tên bằng ngày thật
-- (20260817…) sẽ chèn nó vào TRƯỚC các migration tạo bảng mà nó phụ thuộc, và
-- một database dựng mới từ đầu sẽ vỡ.

ALTER TABLE "notes"
  ADD COLUMN "is_database_page" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "note_database_rows"
  ADD COLUMN "page_note_id" INTEGER;

-- UNIQUE: một ghi chú chỉ làm thân trang cho đúng một dòng. Thiếu ràng buộc
-- này thì một lượt ghi hỏng có thể nối hai dòng vào cùng một trang, và sửa
-- dòng này lại thấy nội dung đổi ở dòng kia.
CREATE UNIQUE INDEX "uk_note_database_row_page"
  ON "note_database_rows"("page_note_id");

-- Chỉ mục một phần: thanh bên lọc `is_database_page = false` ở mọi lượt tải,
-- và số trang-của-dòng sẽ áp đảo số trang thường khi bảng lớn dần.
CREATE INDEX "idx_notes_not_database_page"
  ON "notes"("user_id", "subject_id")
  WHERE "is_database_page" = false;

-- ON DELETE SET NULL: xoá thân trang thì dòng vẫn còn (mất bài viết, giữ dữ
-- liệu ô). Chiều ngược lại — xoá dòng thì xoá luôn trang — do tầng service
-- làm, vì khoá ngoại nằm ở phía dòng nên không diễn đạt được bằng cascade.
ALTER TABLE "note_database_rows"
  ADD CONSTRAINT "note_database_rows_page_note_id_fkey"
  FOREIGN KEY ("page_note_id") REFERENCES "notes"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
