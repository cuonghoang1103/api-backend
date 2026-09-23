-- CT Work đợt 6 + 7: timeline/capacity/version/worklog/luật tự động/email,
-- GitHub, audit log, link công khai, API token. Chỉ thêm bảng + cột có thể null.

-- AlterTable
ALTER TABLE "work_issues" ADD COLUMN     "fix_version_id" INTEGER;

-- AlterTable
ALTER TABLE "work_project_members" ADD COLUMN     "capacity_hours" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "work_time_off" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "note" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_time_off_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_versions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" TEXT,
    "start_date" DATE,
    "release_date" DATE,
    "status" VARCHAR(16) NOT NULL DEFAULT 'UNRELEASED',
    "released_at" TIMESTAMP(3),
    "release_notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_worklogs" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "note" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_worklogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_automation_rules" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trigger" VARCHAR(32) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_by_id" INTEGER,
    "run_count" INTEGER NOT NULL DEFAULT 0,
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_automation_logs" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "issue_id" INTEGER,
    "status" VARCHAR(16) NOT NULL,
    "message" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_automation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_notify_settings" (
    "user_id" INTEGER NOT NULL,
    "email_mode" VARCHAR(12) NOT NULL DEFAULT 'INSTANT',
    "quiet_start" INTEGER,
    "quiet_end" INTEGER,
    "last_digest_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_notify_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "work_email_queue" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kind" VARCHAR(32) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),

    CONSTRAINT "work_email_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_github_connections" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "repo_full_name" VARCHAR(200),
    "secret" VARCHAR(100) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "last_event_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_github_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_dev_activity" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "kind" VARCHAR(12) NOT NULL,
    "external_id" VARCHAR(200) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "state" VARCHAR(16),
    "author" VARCHAR(100),
    "repo" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_dev_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_audit_logs" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "actor_id" INTEGER,
    "actor_name" VARCHAR(100),
    "action" VARCHAR(48) NOT NULL,
    "target_type" VARCHAR(24),
    "target_id" INTEGER,
    "summary" VARCHAR(500) NOT NULL,
    "detail" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_public_links" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "label" VARCHAR(100),
    "options" JSONB NOT NULL DEFAULT '{}',
    "created_by_id" INTEGER,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "last_viewed_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_public_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_api_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "prefix" VARCHAR(16) NOT NULL,
    "scopes" JSONB NOT NULL DEFAULT '["read"]',
    "expires_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "last_used_ip" VARCHAR(64),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_api_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_time_off_user" ON "work_time_off"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_version" ON "work_versions"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_worklog_issue" ON "work_worklogs"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_worklog_user" ON "work_worklogs"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "idx_work_automation_trigger" ON "work_automation_rules"("project_id", "trigger");

-- CreateIndex
CREATE INDEX "idx_work_automation_log_rule" ON "work_automation_logs"("rule_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_email_queue_user" ON "work_email_queue"("user_id", "sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_github_project" ON "work_github_connections"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_dev_activity_project" ON "work_dev_activity"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_dev_activity" ON "work_dev_activity"("issue_id", "kind", "external_id");

-- CreateIndex
CREATE INDEX "idx_work_audit_ws" ON "work_audit_logs"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_audit_project" ON "work_audit_logs"("project_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_public_link_token" ON "work_public_links"("token");

-- CreateIndex
CREATE INDEX "idx_work_public_link_project" ON "work_public_links"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_api_token_hash" ON "work_api_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "idx_work_api_token_user" ON "work_api_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_fix_version" ON "work_issues"("fix_version_id");

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_fix_version_id_fkey" FOREIGN KEY ("fix_version_id") REFERENCES "work_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_time_off" ADD CONSTRAINT "work_time_off_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_time_off" ADD CONSTRAINT "work_time_off_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_versions" ADD CONSTRAINT "work_versions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_worklogs" ADD CONSTRAINT "work_worklogs_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_worklogs" ADD CONSTRAINT "work_worklogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_automation_rules" ADD CONSTRAINT "work_automation_rules_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_automation_logs" ADD CONSTRAINT "work_automation_logs_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "work_automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_notify_settings" ADD CONSTRAINT "work_notify_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_email_queue" ADD CONSTRAINT "work_email_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_github_connections" ADD CONSTRAINT "work_github_connections_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_dev_activity" ADD CONSTRAINT "work_dev_activity_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_dev_activity" ADD CONSTRAINT "work_dev_activity_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_audit_logs" ADD CONSTRAINT "work_audit_logs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_public_links" ADD CONSTRAINT "work_public_links_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_api_tokens" ADD CONSTRAINT "work_api_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
