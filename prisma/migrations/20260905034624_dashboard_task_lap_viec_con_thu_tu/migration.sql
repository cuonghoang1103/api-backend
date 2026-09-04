-- Việc LẶP LẠI, việc CON, và thứ tự do người dùng kéo thả.
-- Viết tay (xem CLAUDE.md). Mọi cột NULL được hoặc có DEFAULT nên
-- chạy được trên bảng đang có dữ liệu mà không cần backfill.
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "repeat" VARCHAR(16) NOT NULL DEFAULT 'none';
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "parent_id" INTEGER;
ALTER TABLE "dashboard_tasks" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "idx_dashboard_tasks_parent" ON "dashboard_tasks" ("parent_id");

-- Xoá việc cha thì việc con đi theo. Không có ràng buộc này thì
-- việc con thành mồ côi: không hiện ở đâu, không xoá được, và vẫn
-- nằm trong DB mãi mãi.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'dashboard_tasks_parent_id_fkey'
  ) THEN
    ALTER TABLE "dashboard_tasks"
      ADD CONSTRAINT "dashboard_tasks_parent_id_fkey"
      FOREIGN KEY ("parent_id") REFERENCES "dashboard_tasks"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
