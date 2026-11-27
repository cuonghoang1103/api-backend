-- Chế độ đóng vai (27/11/2026): MỘT tài khoản đóng 5 vai C1–C5 trong dự án bật settings.soloRoles.
-- Chỉ THÊM cột NULL — dữ liệu cũ = "không có vai" ⇒ hành vi cũ (so theo người).

-- Vai đang đóng lúc ghi lịch sử thẻ / nhật ký / bình luận
ALTER TABLE "work_history" ADD COLUMN "acting_role" VARCHAR(4);
ALTER TABLE "work_audit_logs" ADD COLUMN "acting_role" VARCHAR(4);
ALTER TABLE "work_comments" ADD COLUMN "acting_role" VARCHAR(4);

-- Phiên review: vai của từng người tham gia (AUTHOR C3, REVIEWER C5…) — luật "tác giả không tự duyệt" so theo vai
ALTER TABLE "work_review_participants" ADD COLUMN "hat" VARCHAR(4);

-- Lần chạy test: vai của người bấm kết quả (thường C5 QA)
ALTER TABLE "work_test_runs" ADD COLUMN "executed_role" VARCHAR(4);
