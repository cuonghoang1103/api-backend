-- Kiểm khoá ngoại của work_issues LÚC COMMIT thay vì ngay lập tức.
-- Xoá dự án/không gian (cascade) có thể CẬP NHẬT một thẻ hai lần trong cùng
-- câu lệnh (sprint → NULL, rồi cha → NULL). Lần thứ hai, dòng đã do chính
-- transaction này tạo, nên Postgres kiểm lại MỌI khoá ngoại của nó — lúc dự án
-- đã bị xoá ⇒ lỗi "violates work_issues_project_id_fkey". Hoãn tới commit thì
-- thẻ cũng đã bị xoá, không còn gì để kiểm. Prisma không khai được DEFERRABLE
-- và cũng không so nó khi tìm lệch (đã kiểm bằng migrate diff).
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_project_id_fkey"  DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_type_id_fkey"     DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_status_id_fkey"   DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_parent_id_fkey"   DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_sprint_id_fkey"   DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_assignee_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_issues" ALTER CONSTRAINT "work_issues_reporter_id_fkey" DEFERRABLE INITIALLY DEFERRED;
