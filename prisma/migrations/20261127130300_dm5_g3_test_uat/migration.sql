-- dm5 G3 (27/11/2026) — kiểm thử, review & UAT. Chỉ THÊM cột (NULL/mặc định), dữ liệu cũ không đổi nghĩa.
-- D8: cờ Leakage của defect (NULL = suy từ activity AT / nhãn "Leakage" như trước).
ALTER TABLE "work_defect_info" ADD COLUMN "leakage" BOOLEAN;
-- D10: điểm hài lòng 1–5 + mã ẩn danh người thử của phiên UAT.
ALTER TABLE "work_uat_requests" ADD COLUMN "rating" INTEGER;
ALTER TABLE "work_uat_requests" ADD COLUMN "tester_code" VARCHAR(12);
-- D17: loại điểm — TEACHER (giảng viên) | SELF (sinh viên tự chấm theo rubric).
ALTER TABLE "work_grades" ADD COLUMN "kind" VARCHAR(8) NOT NULL DEFAULT 'TEACHER';
