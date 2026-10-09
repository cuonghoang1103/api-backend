-- QA 10/10 P2-2: admin xoá giảng viên đã chấm điểm ⇒ P2003 work_grades_rubric_id_fkey.
-- work_rubrics.owner_id CASCADE kéo rubric đi, nhưng work_grades.rubric_id RESTRICT chặn ⇒ cả lệnh xoá người hỏng.
-- Chọn SET NULL (không đổi grades sang CASCADE): điểm đã công bố của sinh viên + lịch sử chấm phải sống sót.
ALTER TABLE "work_rubrics" DROP CONSTRAINT "work_rubrics_owner_id_fkey";
ALTER TABLE "work_rubrics" ALTER COLUMN "owner_id" DROP NOT NULL;
ALTER TABLE "work_rubrics" ADD CONSTRAINT "work_rubrics_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
