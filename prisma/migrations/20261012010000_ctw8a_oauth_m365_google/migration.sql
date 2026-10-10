-- CTW đợt 8a (12/10/2026) — kết nối Microsoft 365 / Google Workspace theo người: kết nối OAuth (token mã hoá),
-- state OAuth (PKCE, dùng một lần), nhật ký kết nối, liên kết sự kiện lịch ↔ thẻ/họp, tệp đám mây gắn thẻ, bảng tính xuất.
-- Viết tay (migrate dev vấp P3006 — xem CLAUDE.md). CHỈ THÊM bảng mới, không đụng bảng cũ.

-- CreateTable
CREATE TABLE "work_oauth_connections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(24) NOT NULL,
    "status" VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    "account_id" VARCHAR(200),
    "account_email" VARCHAR(320),
    "account_name" VARCHAR(200),
    "scopes" TEXT NOT NULL DEFAULT '',
    "access_token_enc" TEXT,
    "refresh_token_enc" TEXT,
    "expires_at" TIMESTAMP(3),
    "settings" JSONB NOT NULL DEFAULT '{}',
    "sync_cursor" TEXT,
    "last_sync_at" TIMESTAMP(3),
    "last_error" VARCHAR(500),
    "last_error_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_oauth_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_oauth_states" (
    "nonce" VARCHAR(64) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(24) NOT NULL,
    "verifier_enc" TEXT NOT NULL,
    "return_to" VARCHAR(500),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_oauth_states_pkey" PRIMARY KEY ("nonce")
);

-- CreateTable
CREATE TABLE "work_oauth_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(24) NOT NULL,
    "connection_id" INTEGER,
    "kind" VARCHAR(16) NOT NULL,
    "entity_type" VARCHAR(12),
    "entity_id" INTEGER,
    "project_id" INTEGER,
    "summary" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_oauth_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_calendar_links" (
    "id" SERIAL NOT NULL,
    "connection_id" INTEGER NOT NULL,
    "entity_type" VARCHAR(12) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "calendar_id" VARCHAR(500) NOT NULL,
    "event_id" VARCHAR(500) NOT NULL,
    "pushed_hash" VARCHAR(64),
    "pushed_start" TIMESTAMP(3),
    "pushed_end" TIMESTAMP(3),
    "pushed_at" TIMESTAMP(3),
    "remote_updated_at" TIMESTAMP(3),
    "detached_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_calendar_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issue_cloud_files" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "provider" VARCHAR(24) NOT NULL,
    "file_id" VARCHAR(300) NOT NULL,
    "drive_id" VARCHAR(300),
    "name" VARCHAR(300) NOT NULL,
    "mime_type" VARCHAR(200),
    "icon_url" VARCHAR(500),
    "web_url" VARCHAR(2000) NOT NULL,
    "size_bytes" BIGINT,
    "last_modified_by" VARCHAR(200),
    "last_modified_at" TIMESTAMP(3),
    "attached_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_issue_cloud_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_cloud_sheets" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(24) NOT NULL,
    "kind" VARCHAR(12) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "jql" TEXT,
    "file_id" VARCHAR(300) NOT NULL,
    "file_url" VARCHAR(2000) NOT NULL,
    "sheet_name" VARCHAR(64) NOT NULL DEFAULT 'CT Work',
    "row_count" INTEGER NOT NULL DEFAULT 0,
    "last_synced_at" TIMESTAMP(3),
    "last_error" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_cloud_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_oauth_user_provider" ON "work_oauth_connections"("user_id", "provider");
-- CreateIndex
CREATE INDEX "idx_work_oauth_state_exp" ON "work_oauth_states"("expires_at");
-- CreateIndex
CREATE INDEX "idx_work_oauth_log_user" ON "work_oauth_logs"("user_id", "created_at");
-- CreateIndex
CREATE INDEX "idx_work_cal_link_event" ON "work_calendar_links"("connection_id", "event_id");
-- CreateIndex
CREATE INDEX "idx_work_cal_link_target" ON "work_calendar_links"("entity_type", "entity_id");
-- CreateIndex
CREATE UNIQUE INDEX "uk_work_cal_link_entity" ON "work_calendar_links"("connection_id", "entity_type", "entity_id");
-- CreateIndex
CREATE INDEX "idx_work_issue_cloud_file_project" ON "work_issue_cloud_files"("project_id");
-- CreateIndex
CREATE UNIQUE INDEX "uk_work_issue_cloud_file" ON "work_issue_cloud_files"("issue_id", "provider", "file_id");
-- CreateIndex
CREATE INDEX "idx_work_cloud_sheet_project" ON "work_cloud_sheets"("project_id");

-- AddForeignKey
ALTER TABLE "work_oauth_connections" ADD CONSTRAINT "work_oauth_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "work_calendar_links" ADD CONSTRAINT "work_calendar_links_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "work_oauth_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
