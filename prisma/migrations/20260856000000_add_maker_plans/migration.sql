-- Kế hoạch theo giờ cho robot: nhắc việc, hướng dẫn, chấm xong.
--
-- Viết TAY chứ không phải `prisma migrate dev` sinh ra — migration
-- `20260706130000_add_music_and_profile` tạo một UNIQUE và một index
-- TRÙNG TÊN nên không bao giờ replay được trên shadow database (P3006).
-- Xem CLAUDE.md. Áp bằng `npx prisma migrate deploy`, rồi xác nhận
-- không lệch bằng `prisma migrate diff`.

-- CreateEnum
CREATE TYPE "MakerPlanKind" AS ENUM ('ONCE', 'DAILY', 'WEEKDAYS', 'WEEKLY');

-- CreateEnum
CREATE TYPE "MakerRunState" AS ENUM ('PENDING', 'DONE', 'SKIPPED', 'MISSED');

-- CreateTable
CREATE TABLE "maker_plans" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "huong_dan" TEXT,
    "note_id" INTEGER,
    "kind" "MakerPlanKind" NOT NULL DEFAULT 'DAILY',
    -- Số phút kể từ 00:00 GIỜ ĐỊA PHƯƠNG (0..1439), không phải UTC.
    -- Container chạy UTC, người dùng ở +07 — lưu mốc thời gian tuyệt
    -- đối là mua sẵn một cái báo thức lệch bảy tiếng.
    "gio" INTEGER NOT NULL,
    "tz" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "thu" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "ngay_mot" VARCHAR(10),
    "nhac_truoc" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maker_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_plan_runs" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "ngay" VARCHAR(10) NOT NULL,
    "state" "MakerRunState" NOT NULL DEFAULT 'PENDING',
    "nhac_luc" TIMESTAMP(3),
    "xong_luc" TIMESTAMP(3),
    "hoan_toi" TIMESTAMP(3),
    "ghi_chu" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maker_plan_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_maker_plan_owner" ON "maker_plans"("owner_id", "active");

-- CreateIndex
CREATE INDEX "idx_maker_plan_project" ON "maker_plans"("project_id", "active");

-- CreateIndex
-- Khoá chống nhắc hai lần: một việc chỉ có ĐÚNG MỘT lượt trong một ngày.
CREATE UNIQUE INDEX "uk_maker_plan_run_day" ON "maker_plan_runs"("plan_id", "ngay");

-- CreateIndex
CREATE INDEX "idx_maker_plan_run_day_state" ON "maker_plan_runs"("ngay", "state");

-- AddForeignKey
ALTER TABLE "maker_plans" ADD CONSTRAINT "maker_plans_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_plans" ADD CONSTRAINT "maker_plans_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "maker_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_plan_runs" ADD CONSTRAINT "maker_plan_runs_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "maker_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
