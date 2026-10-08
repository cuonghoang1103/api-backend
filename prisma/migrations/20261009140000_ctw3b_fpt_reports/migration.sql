-- CT Work đợt 3B (09/10/2026): Excel / báo cáo theo mẫu FPT — System Test 5.3 (A14), WBS + ước lượng (A3),
-- Weekly Report (A21), AI Usage Report (A29). CHỈ THÊM: 3 cột mới + 4 bảng mới, không sửa/xoá gì đang có.
-- Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng `npx prisma migrate deploy`.
-- Khoá ngoại DEFERRABLE INITIALLY DEFERRED như mọi bảng CT Work (luật 20260923131000_ct_work_issue_fk_deferred).

-- AlterTable: Report 5.3 dùng chung Cover với 5.1/5.2.
ALTER TABLE "work_fpt_test_docs" ADD COLUMN "sys_issue_date" DATE;
ALTER TABLE "work_fpt_test_docs" ADD COLUMN "sys_notes" TEXT;

-- AlterTable: module integration (INT) hay workflow system test (SYS). Dữ liệu cũ = INT.
ALTER TABLE "work_it_modules" ADD COLUMN "kind" VARCHAR(4) NOT NULL DEFAULT 'INT';

-- CreateIndex
CREATE INDEX "idx_work_it_module_kind" ON "work_it_modules"("project_id", "kind", "position");

-- CreateTable
CREATE TABLE "work_wbs_items" (
    "issue_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "kind" VARCHAR(12),
    "complexity" VARCHAR(12),
    "fields" INTEGER,
    "transactions" INTEGER,
    "feature" VARCHAR(120),
    "sub_feature" VARCHAR(120),
    "planned_days" DOUBLE PRECISION,
    "note" VARCHAR(1000),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_wbs_items_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "work_fpt_report_docs" (
    "project_id" INTEGER NOT NULL,
    "subject_code" VARCHAR(20),
    "subject_name" VARCHAR(120),
    "class_code" VARCHAR(40),
    "semester" VARCHAR(40),
    "lecturer" VARCHAR(120),
    "group_code" VARCHAR(60),
    "project_title" VARCHAR(200),
    "week1_start" DATE,
    "students" JSONB NOT NULL DEFAULT '[]',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_fpt_report_docs_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "work_weekly_reports" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "week_start" DATE NOT NULL,
    "week_no" INTEGER,
    "data" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_weekly_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_ai_usage_logs" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "used_at" DATE NOT NULL,
    "phase" VARCHAR(40) NOT NULL,
    "task" VARCHAR(300) NOT NULL,
    "tool" VARCHAR(120) NOT NULL,
    "output" TEXT,
    "validation" TEXT,
    "evidence" VARCHAR(1000),
    "measure" VARCHAR(300),
    "value" INTEGER,
    "risks" TEXT,
    "source" VARCHAR(8) NOT NULL DEFAULT 'MANUAL',
    "source_key" VARCHAR(80),
    "issue_id" INTEGER,
    "user_id" INTEGER,
    "user_name" VARCHAR(120),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_ai_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_wbs_item_project" ON "work_wbs_items"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_weekly_report" ON "work_weekly_reports"("project_id", "week_start");

-- CreateIndex
CREATE INDEX "idx_work_ai_usage_project" ON "work_ai_usage_logs"("project_id", "used_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_ai_usage_source" ON "work_ai_usage_logs"("project_id", "source_key");

-- AddForeignKey
ALTER TABLE "work_wbs_items" ADD CONSTRAINT "work_wbs_items_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_wbs_items" ADD CONSTRAINT "work_wbs_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_fpt_report_docs" ADD CONSTRAINT "work_fpt_report_docs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_weekly_reports" ADD CONSTRAINT "work_weekly_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_ai_usage_logs" ADD CONSTRAINT "work_ai_usage_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
