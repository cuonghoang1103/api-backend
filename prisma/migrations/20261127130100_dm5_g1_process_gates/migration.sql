-- dm5 G1 (27/11/2026) — cổng quy trình & nhịp vận hành. Chỉ THÊM cột (NULL / mặc định), không đổi dữ liệu cũ.

-- A12: hành động retro có Trigger + Cách kiểm chứng.
ALTER TABLE "work_retro_actions" ADD COLUMN "trigger" VARCHAR(500);
ALTER TABLE "work_retro_actions" ADD COLUMN "verify" VARCHAR(500);

-- A17: giai đoạn / cổng có ngày kế hoạch.
ALTER TABLE "work_stages" ADD COLUMN "planned_start" DATE;
ALTER TABLE "work_stages" ADD COLUMN "planned_end" DATE;

-- A21: việc cần làm trong biên bản họp có loại (TASK | BUG | CR | QUESTION) + mã CR/Q đã sinh.
ALTER TABLE "work_meeting_actions" ADD COLUMN "kind" VARCHAR(12) NOT NULL DEFAULT 'TASK';
ALTER TABLE "work_meeting_actions" ADD COLUMN "created_ref" VARCHAR(24);
