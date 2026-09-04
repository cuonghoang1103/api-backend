-- Việc trên Tổng quan: ghi chú, hạn, nhắc nhở, ưu tiên.
--
-- Viết TAY chứ không qua `prisma migrate dev`: migration
-- 20260706130000_add_music_and_profile tạo một UNIQUE và một index TRÙNG TÊN
-- nên nó không bao giờ replay được trên shadow database (P3006). Xem CLAUDE.md.
--
-- Mọi cột đều NULL được (hoặc có DEFAULT), nên migration này chạy được trên
-- bảng đang có dữ liệu mà không cần backfill và không khoá bảng lâu.
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "note" TEXT;
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "due_at" TIMESTAMP(3);
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "remind_at" TIMESTAMP(3);
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "reminded_at" TIMESTAMP(3);
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0;

-- Dò việc tới hạn nhắc chạy đều đặn ở nền, nên nó phải rẻ.
CREATE INDEX IF NOT EXISTS "idx_dashboard_tasks_remind"
  ON "dashboard_tasks" ("user_id", "remind_at");
