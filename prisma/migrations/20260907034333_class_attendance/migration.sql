-- Điểm danh từng buổi học.
--
-- Viết TAY (xem CLAUDE.md: `prisma migrate dev` hỏng trong repo này). Lấy
-- nguyên văn SQL Prisma tự sinh (`migrate diff --from-empty`) rồi bọc
-- IF NOT EXISTS, nên hình dạng khớp schema từng ký tự.
--
-- Bảng MỚI hoàn toàn nên không đụng dữ liệu đang có.
CREATE TABLE IF NOT EXISTS "class_attendances" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" VARCHAR(8) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_attendances_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "idx_class_attendance_user_date" ON "class_attendances"("user_id", "date");
CREATE UNIQUE INDEX IF NOT EXISTS "uk_class_attendance_buoi" ON "class_attendances"("schedule_id", "date");

-- Khoá ngoại: bọc trong DO để chạy lại được (migration phải idempotent —
-- một lần deploy chết giữa chừng rồi chạy lại không được vỡ vì trùng tên).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'class_attendances_user_id_fkey') THEN
    ALTER TABLE "class_attendances" ADD CONSTRAINT "class_attendances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'class_attendances_schedule_id_fkey') THEN
    ALTER TABLE "class_attendances" ADD CONSTRAINT "class_attendances_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "class_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
