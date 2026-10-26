-- 26/10/2026 — chỉ mục cho 4 khoá ngoại trên bảng lớn nhất còn thiếu (đo prod: code_exercises 12,7k dòng,
-- work_issues 2,7k, maker_commands 1,6k). Lý do: xoá/sửa user hoặc xoá sprint ⇒ Postgres quét cả bảng con để
-- SET NULL; truy vấn "của tôi" theo author/reporter. Bảng nhỏ ⇒ CREATE INDEX thường (khoá ghi < 1 giây), không
-- cần CONCURRENTLY (Prisma chạy cả tệp trong một giao dịch nên CONCURRENTLY không dùng được ở đây).
-- 184 khoá ngoại còn lại nằm trên bảng < 1.000 dòng ⇒ chưa đáng thêm chi phí ghi; xem lại khi dữ liệu lớn.

-- CreateIndex
CREATE INDEX "idx_code_exercise_author" ON "code_exercises"("author_id");

-- CreateIndex
CREATE INDEX "idx_maker_command_issued_by" ON "maker_commands"("issued_by_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_reporter" ON "work_issues"("reporter_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_sprint_fk" ON "work_issues"("sprint_id");
