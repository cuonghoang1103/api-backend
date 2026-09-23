-- CT Work: thẻ → loại thẻ/trạng thái đổi RESTRICT → NO ACTION để xoá dự án
-- (cascade) không bị chặn. Xem chú thích ở model WorkIssue.

-- DropForeignKey
ALTER TABLE "work_issues" DROP CONSTRAINT "work_issues_type_id_fkey";

-- DropForeignKey
ALTER TABLE "work_issues" DROP CONSTRAINT "work_issues_status_id_fkey";

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "work_issue_types"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "work_statuses"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
