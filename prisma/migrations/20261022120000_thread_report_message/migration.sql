-- App Store 1.2 (22/10/2026): báo cáo MỘT tin nhắn riêng cụ thể. Cột mới, có thể NULL (báo cáo cả hội thoại như cũ).
-- Tin bị xoá hẳn ⇒ báo cáo vẫn giữ (SET NULL), chỉ mất liên kết tới tin.
ALTER TABLE "thread_reports" ADD COLUMN "message_id" INTEGER;

CREATE INDEX "idx_report_message" ON "thread_reports"("message_id");

ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
