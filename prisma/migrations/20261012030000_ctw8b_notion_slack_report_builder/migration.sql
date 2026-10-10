-- CTW đợt 8b (12/10/2026) — trình soạn báo cáo (mẫu), lịch tự gửi + nhật ký gửi, app Slack theo không gian + kênh Slack
-- của dự án, nonce chống phát lại webhook Slack. Viết tay (migrate dev vấp P3006 — xem CLAUDE.md). CHỈ THÊM bảng mới.
-- Token Notion/Slack nằm trong work_oauth_connections (khung OAuth 8a) — không có bảng token thứ hai.

-- CreateTable
CREATE TABLE "work_report_templates" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "layout" JSONB NOT NULL,
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_report_send_plans" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "template_id" INTEGER,
    "builtin_key" VARCHAR(24),
    "name" VARCHAR(120) NOT NULL,
    "cadence" VARCHAR(12) NOT NULL DEFAULT 'WEEKLY',
    "weekday" INTEGER NOT NULL DEFAULT 5,
    "hour" INTEGER NOT NULL DEFAULT 16,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "format" VARCHAR(8) NOT NULL DEFAULT 'pdf',
    "recipients" JSONB NOT NULL DEFAULT '[]',
    "chat_hook_ids" JSONB NOT NULL DEFAULT '[]',
    "slack_channel_ids" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" INTEGER,
    "last_run_at" TIMESTAMP(3),
    "last_period_key" VARCHAR(80),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_report_send_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_report_deliveries" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "schedule_id" INTEGER,
    "period_key" VARCHAR(80) NOT NULL,
    "trigger" VARCHAR(12) NOT NULL,
    "status" VARCHAR(12) NOT NULL DEFAULT 'RUNNING',
    "title" VARCHAR(255) NOT NULL,
    "detail" JSONB NOT NULL DEFAULT '[]',
    "file_name" VARCHAR(255),
    "file_key" VARCHAR(400),
    "triggered_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "work_report_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_slack_installs" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "connection_id" INTEGER NOT NULL,
    "installed_by_id" INTEGER NOT NULL,
    "team_id" VARCHAR(32) NOT NULL,
    "team_name" VARCHAR(160) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_slack_installs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_slack_channels" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "install_id" INTEGER NOT NULL,
    "channel_id" VARCHAR(32) NOT NULL,
    "channel_name" VARCHAR(160) NOT NULL,
    "events" JSONB NOT NULL DEFAULT '[]',
    "intake" BOOLEAN NOT NULL DEFAULT true,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_sent_at" TIMESTAMP(3),
    "last_error" VARCHAR(300),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_slack_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_ext_nonces" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(16) NOT NULL,
    "nonce" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_ext_nonces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_report_template_project" ON "work_report_templates"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_report_send_plan_project" ON "work_report_send_plans"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_report_delivery_project" ON "work_report_deliveries"("project_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_report_delivery_period" ON "work_report_deliveries"("schedule_id", "period_key");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_slack_install_ws" ON "work_slack_installs"("workspace_id");

-- CreateIndex
CREATE INDEX "idx_work_slack_install_team" ON "work_slack_installs"("team_id");

-- CreateIndex
CREATE INDEX "idx_work_slack_channel_install" ON "work_slack_channels"("install_id", "channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_slack_channel" ON "work_slack_channels"("project_id", "channel_id");

-- CreateIndex
CREATE INDEX "idx_work_ext_nonce_created" ON "work_ext_nonces"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_ext_nonce" ON "work_ext_nonces"("source", "nonce");

-- AddForeignKey
ALTER TABLE "work_report_templates" ADD CONSTRAINT "work_report_templates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_report_send_plans" ADD CONSTRAINT "work_report_send_plans_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_report_send_plans" ADD CONSTRAINT "work_report_send_plans_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "work_report_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_report_deliveries" ADD CONSTRAINT "work_report_deliveries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_report_deliveries" ADD CONSTRAINT "work_report_deliveries_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "work_report_send_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_slack_installs" ADD CONSTRAINT "work_slack_installs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_slack_channels" ADD CONSTRAINT "work_slack_channels_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_slack_channels" ADD CONSTRAINT "work_slack_channels_install_id_fkey" FOREIGN KEY ("install_id") REFERENCES "work_slack_installs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
