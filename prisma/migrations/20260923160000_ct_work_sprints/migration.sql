-- CT Work đợt 2: báo cáo sprint (cột report) + số liệu hằng ngày cho burndown.
-- Chỉ thêm cột/bảng mới.

-- AlterTable
ALTER TABLE "work_sprints" ADD COLUMN     "report" JSONB;

-- CreateTable
CREATE TABLE "work_sprint_snapshots" (
    "id" SERIAL NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "day" VARCHAR(10) NOT NULL,
    "total_points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remaining_points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_issues" INTEGER NOT NULL DEFAULT 0,
    "done_issues" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_sprint_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_sprint_snapshot" ON "work_sprint_snapshots"("sprint_id", "day");

-- AddForeignKey
ALTER TABLE "work_sprint_snapshots" ADD CONSTRAINT "work_sprint_snapshots_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "work_sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

