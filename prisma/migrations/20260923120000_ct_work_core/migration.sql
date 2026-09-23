-- CT Work — lõi quản lý dự án kiểu Jira (đợt 0, 23/09/2026).
-- Chỉ TẠO bảng work_* mới + khoá ngoại; không đụng bảng cũ nào.
-- Sinh bằng `prisma migrate diff` schema main → schema mới (migrate dev hỏng, xem CLAUDE.md).

-- CreateTable
CREATE TABLE "work_spaces" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(60) NOT NULL,
    "description" TEXT,
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_members" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(16) NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_invites" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "email" VARCHAR(100),
    "role" VARCHAR(16) NOT NULL DEFAULT 'MEMBER',
    "project_role" VARCHAR(16),
    "token_hash" VARCHAR(128) NOT NULL,
    "invited_by_id" INTEGER NOT NULL,
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_projects" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "key" VARCHAR(10) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(16) NOT NULL DEFAULT 'SCRUM',
    "template" VARCHAR(32) NOT NULL DEFAULT 'BLANK',
    "visibility" VARCHAR(16) NOT NULL DEFAULT 'WORKSPACE',
    "issue_counter" INTEGER NOT NULL DEFAULT 0,
    "lead_id" INTEGER,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_project_members" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(16) NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_workflows" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_statuses" (
    "id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "category" VARCHAR(16) NOT NULL,
    "color" VARCHAR(16) NOT NULL DEFAULT '#64748b',
    "position" INTEGER NOT NULL DEFAULT 0,
    "wip_limit" INTEGER,

    CONSTRAINT "work_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_transitions" (
    "id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "from_status_id" INTEGER,
    "to_status_id" INTEGER NOT NULL,
    "name" VARCHAR(60),
    "rules" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "work_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issue_types" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "key" VARCHAR(16) NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "icon" VARCHAR(24) NOT NULL DEFAULT 'task',
    "color" VARCHAR(16) NOT NULL DEFAULT '#3b82f6',
    "level" INTEGER NOT NULL DEFAULT 0,
    "workflow_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "work_issue_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issues" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "sprint_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description_json" JSONB,
    "description_text" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "assignee_id" INTEGER,
    "reporter_id" INTEGER,
    "story_points" DOUBLE PRECISION,
    "original_estimate_min" INTEGER,
    "remaining_estimate_min" INTEGER,
    "time_spent_min" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE,
    "due_date" DATE,
    "rank" VARCHAR(64) NOT NULL,
    "resolution" VARCHAR(32),
    "resolved_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issue_links" (
    "id" SERIAL NOT NULL,
    "from_issue_id" INTEGER NOT NULL,
    "to_issue_id" INTEGER NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_issue_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_labels" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(16) NOT NULL DEFAULT '#64748b',

    CONSTRAINT "work_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issue_labels" (
    "issue_id" INTEGER NOT NULL,
    "label_id" INTEGER NOT NULL,

    CONSTRAINT "work_issue_labels_pkey" PRIMARY KEY ("issue_id","label_id")
);

-- CreateTable
CREATE TABLE "work_components" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" TEXT,
    "lead_id" INTEGER,

    CONSTRAINT "work_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issue_components" (
    "issue_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,

    CONSTRAINT "work_issue_components_pkey" PRIMARY KEY ("issue_id","component_id")
);

-- CreateTable
CREATE TABLE "work_comments" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "is_ai" BOOLEAN NOT NULL DEFAULT false,
    "body_json" JSONB NOT NULL,
    "body_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_attachments" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "uploader_id" INTEGER,
    "r2_key" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_history" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "actor_id" INTEGER,
    "actor_kind" VARCHAR(16) NOT NULL DEFAULT 'USER',
    "field" VARCHAR(40) NOT NULL,
    "from_value" TEXT,
    "to_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_watchers" (
    "issue_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_watchers_pkey" PRIMARY KEY ("issue_id","user_id")
);

-- CreateTable
CREATE TABLE "work_sprints" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "goal" TEXT,
    "state" VARCHAR(16) NOT NULL DEFAULT 'PLANNED',
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "committed_points" DOUBLE PRECISION,
    "completed_points" DOUBLE PRECISION,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_sprints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_space_slug" ON "work_spaces"("slug");

-- CreateIndex
CREATE INDEX "idx_work_space_owner" ON "work_spaces"("owner_id");

-- CreateIndex
CREATE INDEX "idx_work_member_user" ON "work_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_member" ON "work_members"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_invite_token" ON "work_invites"("token_hash");

-- CreateIndex
CREATE INDEX "idx_work_invite_space" ON "work_invites"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_project_key" ON "work_projects"("workspace_id", "key");

-- CreateIndex
CREATE INDEX "idx_work_project_member_user" ON "work_project_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_project_member" ON "work_project_members"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_workflow_project" ON "work_workflows"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_status_workflow" ON "work_statuses"("workflow_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_transition_workflow" ON "work_transitions"("workflow_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_issue_type" ON "work_issue_types"("project_id", "key");

-- CreateIndex
CREATE INDEX "idx_work_issue_board" ON "work_issues"("project_id", "status_id", "rank");

-- CreateIndex
CREATE INDEX "idx_work_issue_sprint" ON "work_issues"("project_id", "sprint_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_assignee" ON "work_issues"("assignee_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_parent" ON "work_issues"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_issue_number" ON "work_issues"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_issue_link_to" ON "work_issue_links"("to_issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_issue_link" ON "work_issue_links"("from_issue_id", "to_issue_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_label" ON "work_labels"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_issue_label_label" ON "work_issue_labels"("label_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_component" ON "work_components"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_issue_component_component" ON "work_issue_components"("component_id");

-- CreateIndex
CREATE INDEX "idx_work_comment_issue" ON "work_comments"("issue_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_attachment_issue" ON "work_attachments"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_history_issue" ON "work_history"("issue_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_history_actor" ON "work_history"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_watcher_user" ON "work_watchers"("user_id");

-- CreateIndex
CREATE INDEX "idx_work_sprint_project" ON "work_sprints"("project_id", "state");

-- AddForeignKey
ALTER TABLE "work_spaces" ADD CONSTRAINT "work_spaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_members" ADD CONSTRAINT "work_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_members" ADD CONSTRAINT "work_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_invites" ADD CONSTRAINT "work_invites_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_invites" ADD CONSTRAINT "work_invites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_invites" ADD CONSTRAINT "work_invites_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_projects" ADD CONSTRAINT "work_projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_projects" ADD CONSTRAINT "work_projects_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_project_members" ADD CONSTRAINT "work_project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_project_members" ADD CONSTRAINT "work_project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_workflows" ADD CONSTRAINT "work_workflows_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_statuses" ADD CONSTRAINT "work_statuses_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "work_workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_transitions" ADD CONSTRAINT "work_transitions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "work_workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_transitions" ADD CONSTRAINT "work_transitions_from_status_id_fkey" FOREIGN KEY ("from_status_id") REFERENCES "work_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_transitions" ADD CONSTRAINT "work_transitions_to_status_id_fkey" FOREIGN KEY ("to_status_id") REFERENCES "work_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_types" ADD CONSTRAINT "work_issue_types_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_types" ADD CONSTRAINT "work_issue_types_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "work_workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "work_issue_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "work_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "work_sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_links" ADD CONSTRAINT "work_issue_links_from_issue_id_fkey" FOREIGN KEY ("from_issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_links" ADD CONSTRAINT "work_issue_links_to_issue_id_fkey" FOREIGN KEY ("to_issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_labels" ADD CONSTRAINT "work_labels_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_labels" ADD CONSTRAINT "work_issue_labels_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_labels" ADD CONSTRAINT "work_issue_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "work_labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_components" ADD CONSTRAINT "work_components_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_components" ADD CONSTRAINT "work_issue_components_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_components" ADD CONSTRAINT "work_issue_components_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "work_components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_comments" ADD CONSTRAINT "work_comments_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_comments" ADD CONSTRAINT "work_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_attachments" ADD CONSTRAINT "work_attachments_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_attachments" ADD CONSTRAINT "work_attachments_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_history" ADD CONSTRAINT "work_history_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_history" ADD CONSTRAINT "work_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_watchers" ADD CONSTRAINT "work_watchers_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_watchers" ADD CONSTRAINT "work_watchers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sprints" ADD CONSTRAINT "work_sprints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

