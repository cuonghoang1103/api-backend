-- CT Work — đợt S4 (04/10/2026): TÀI CHÍNH dự án (mô-đun `finance`), BÁO CÁO khách tự động (mô-đun `reports`),
-- XUẤT TRỌN dự án (ZIP). CHỈ THÊM: một cột có mặc định an toàn (work_raid_items.client_visible = false) + 10 bảng mới.
-- Không UPDATE dữ liệu cũ nào ⇒ dự án có sẵn không có settings.modules.{finance,reports} ⇒ mô-đun TẮT, route mới
-- trả 403 MODULE_DISABLED, worklog của dự án cũ không bao giờ bị khoá (chưa ai nộp timesheet).
-- Cột người (created_by_id, user_id…) KHÔNG có FK tới users — số liệu kế toán phải sống lâu hơn tài khoản.
-- MỌI khoá ngoại mới DEFERRABLE INITIALLY DEFERRED (luật của S1–S3b: khoá SET NULL bị xoá dây chuyền theo dự án
-- trong cùng câu lệnh).

-- AlterTable
ALTER TABLE "work_raid_items" ADD COLUMN     "client_visible" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "work_finance_settings" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "contract_value" DOUBLE PRECISION,
    "budget_total" DOUBLE PRECISION,
    "alert_level" INTEGER NOT NULL DEFAULT 0,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_finance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_rates" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "scope" VARCHAR(8) NOT NULL,
    "project_role" VARCHAR(16),
    "team_id" INTEGER,
    "user_id" INTEGER,
    "hourly_rate" DOUBLE PRECISION NOT NULL,
    "effective_from" DATE,
    "note" VARCHAR(200),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_timesheets" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_name" VARCHAR(120) NOT NULL,
    "week_start" DATE NOT NULL,
    "status" VARCHAR(16) NOT NULL,
    "total_minutes" INTEGER NOT NULL DEFAULT 0,
    "note" VARCHAR(1000),
    "submitted_at" TIMESTAMP(3),
    "decided_at" TIMESTAMP(3),
    "decided_by_id" INTEGER,
    "return_reason" TEXT,
    "reopened_at" TIMESTAMP(3),
    "reopened_by_id" INTEGER,
    "reopen_reason" TEXT,
    "approved_cost" DOUBLE PRECISION,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_timesheet_lines" (
    "id" SERIAL NOT NULL,
    "timesheet_id" INTEGER NOT NULL,
    "worklog_id" INTEGER,
    "issue_id" INTEGER,
    "issue_key" VARCHAR(24) NOT NULL,
    "issue_title" VARCHAR(255) NOT NULL,
    "team_id" INTEGER,
    "stage_id" INTEGER,
    "day" DATE NOT NULL,
    "minutes" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION,
    "rate_source" VARCHAR(16),
    "cost" DOUBLE PRECISION,
    "note" VARCHAR(1000),

    CONSTRAINT "work_timesheet_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_budget_lines" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "category" VARCHAR(16) NOT NULL DEFAULT 'LABOR',
    "stage_id" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "note" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_budget_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_expenses" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "spent_on" DATE NOT NULL,
    "category" VARCHAR(16) NOT NULL DEFAULT 'OTHER',
    "description" VARCHAR(500) NOT NULL,
    "vendor" VARCHAR(160),
    "amount" DOUBLE PRECISION NOT NULL,
    "budget_line_id" INTEGER,
    "stage_id" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_payment_milestones" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "percent" DOUBLE PRECISION,
    "amount" DOUBLE PRECISION,
    "trigger" VARCHAR(16) NOT NULL DEFAULT 'MANUAL',
    "version_id" INTEGER,
    "stage_id" INTEGER,
    "due_date" DATE,
    "status" VARCHAR(16) NOT NULL DEFAULT 'PLANNED',
    "became_due_at" TIMESTAMP(3),
    "triggered_by_approval_id" INTEGER,
    "invoice_number" VARCHAR(80),
    "invoiced_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "client_visible" BOOLEAN NOT NULL DEFAULT false,
    "note" VARCHAR(1000),
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_payment_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_report_schedules" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "weekday" INTEGER NOT NULL DEFAULT 5,
    "hour" INTEGER NOT NULL DEFAULT 16,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "include_risks" BOOLEAN NOT NULL DEFAULT false,
    "include_changes" BOOLEAN NOT NULL DEFAULT true,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_report_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_client_reports" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL,
    "source" VARCHAR(8) NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "data" JSONB NOT NULL,
    "body_markdown" TEXT,
    "ai_polished" BOOLEAN NOT NULL DEFAULT false,
    "client_visible" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3),
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "auto_key" VARCHAR(24),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_client_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_project_exports" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "requested_by_id" INTEGER,
    "status" VARCHAR(16) NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "stage" VARCHAR(120),
    "include_files" BOOLEAN NOT NULL DEFAULT false,
    "file_path" VARCHAR(500),
    "file_name" VARCHAR(200),
    "size" INTEGER,
    "table_counts" JSONB,
    "attachment_count" INTEGER NOT NULL DEFAULT 0,
    "attachment_bytes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "files_included" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "work_project_exports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_finance_project" ON "work_finance_settings"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_rate_project" ON "work_rates"("project_id", "scope");

-- CreateIndex
CREATE INDEX "idx_work_timesheet_project" ON "work_timesheets"("project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_timesheet" ON "work_timesheets"("project_id", "user_id", "week_start");

-- CreateIndex
CREATE INDEX "idx_work_timesheet_line" ON "work_timesheet_lines"("timesheet_id");

-- CreateIndex
CREATE INDEX "idx_work_budget_line_project" ON "work_budget_lines"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_expense_project" ON "work_expenses"("project_id", "spent_on");

-- CreateIndex
CREATE INDEX "idx_work_payment_version" ON "work_payment_milestones"("version_id");

-- CreateIndex
CREATE INDEX "idx_work_payment_stage" ON "work_payment_milestones"("stage_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_payment_number" ON "work_payment_milestones"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_report_schedule_project" ON "work_report_schedules"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_client_report_project" ON "work_client_reports"("project_id", "kind", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_client_report_number" ON "work_client_reports"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_client_report_auto" ON "work_client_reports"("project_id", "auto_key");

-- CreateIndex
CREATE INDEX "idx_work_export_project" ON "work_project_exports"("project_id", "created_at");

-- AddForeignKey
ALTER TABLE "work_finance_settings" ADD CONSTRAINT "work_finance_settings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_rates" ADD CONSTRAINT "work_rates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_rates" ADD CONSTRAINT "work_rates_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "work_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_timesheets" ADD CONSTRAINT "work_timesheets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_timesheet_lines" ADD CONSTRAINT "work_timesheet_lines_timesheet_id_fkey" FOREIGN KEY ("timesheet_id") REFERENCES "work_timesheets"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_budget_lines" ADD CONSTRAINT "work_budget_lines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_budget_lines" ADD CONSTRAINT "work_budget_lines_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_expenses" ADD CONSTRAINT "work_expenses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_expenses" ADD CONSTRAINT "work_expenses_budget_line_id_fkey" FOREIGN KEY ("budget_line_id") REFERENCES "work_budget_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_expenses" ADD CONSTRAINT "work_expenses_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_payment_milestones" ADD CONSTRAINT "work_payment_milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_payment_milestones" ADD CONSTRAINT "work_payment_milestones_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "work_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_payment_milestones" ADD CONSTRAINT "work_payment_milestones_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_report_schedules" ADD CONSTRAINT "work_report_schedules_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_client_reports" ADD CONSTRAINT "work_client_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_project_exports" ADD CONSTRAINT "work_project_exports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
