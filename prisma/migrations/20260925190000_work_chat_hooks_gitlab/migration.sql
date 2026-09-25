-- CT Work: webhook chat (Discord/Slack/Google Chat) + kết nối GitLab. Thuần CREATE TABLE mới.
-- CreateTable
CREATE TABLE "work_chat_hooks" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "url" VARCHAR(600) NOT NULL,
    "events" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" INTEGER,
    "last_sent_at" TIMESTAMP(3),
    "last_error" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_chat_hooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_gitlab_connections" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "repo_path" VARCHAR(200),
    "token" VARCHAR(100) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "last_event_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_gitlab_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_chat_hook_project" ON "work_chat_hooks"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_gitlab_project" ON "work_gitlab_connections"("project_id");

-- AddForeignKey
ALTER TABLE "work_chat_hooks" ADD CONSTRAINT "work_chat_hooks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_gitlab_connections" ADD CONSTRAINT "work_gitlab_connections_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

