-- CTW Code (18/10/2026): trang "Code" của dự án — dòng thời gian Git, nhánh, pull request, token chỉ đọc (mã hoá).
-- Viết tay (migrate dev hỏng ở repo này — CLAUDE.md). Chỉ THÊM: 3 bảng mới + 1 cột nullable ở hai bảng kết nối.

-- Token CHỈ ĐỌC (đã mã hoá AES-GCM, oauth/crypto.ts sealToken) để xem mã nguồn repo private.
ALTER TABLE "work_github_connections" ADD COLUMN IF NOT EXISTS "read_token" VARCHAR(1000);
ALTER TABLE "work_gitlab_connections" ADD COLUMN IF NOT EXISTS "read_token" VARCHAR(1000);

-- Mọi push / tạo-xoá nhánh / PR mở-merge-đóng / yêu cầu review (kể cả không nhắc mã thẻ).
CREATE TABLE "work_git_events" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "provider" VARCHAR(8) NOT NULL,
    "kind" VARCHAR(20) NOT NULL,
    "dedupe_key" VARCHAR(300) NOT NULL,
    "repo" VARCHAR(200),
    "ref" VARCHAR(255),
    "actor_login" VARCHAR(100),
    "actor_name" VARCHAR(100),
    "actor_email" VARCHAR(200),
    "title" VARCHAR(500),
    "url" VARCHAR(500),
    "pr_number" INTEGER,
    "commit_count" INTEGER NOT NULL DEFAULT 0,
    "commits" JSONB NOT NULL DEFAULT '[]',
    "data" JSONB NOT NULL DEFAULT '{}',
    "issue_numbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_git_events_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_work_git_event" ON "work_git_events"("project_id", "dedupe_key");
CREATE INDEX "idx_work_git_event_project" ON "work_git_events"("project_id", "occurred_at");
ALTER TABLE "work_git_events" ADD CONSTRAINT "work_git_events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Nhánh (commit cuối, người đẩy, thẻ liên quan).
CREATE TABLE "work_git_branches" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "provider" VARCHAR(8) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "head_sha" VARCHAR(64),
    "last_commit_title" VARCHAR(300),
    "last_commit_url" VARCHAR(500),
    "last_author_login" VARCHAR(100),
    "last_author_name" VARCHAR(100),
    "last_author_email" VARCHAR(200),
    "last_push_at" TIMESTAMP(3),
    "commit_count" INTEGER NOT NULL DEFAULT 0,
    "issue_numbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_git_branches_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_work_git_branch" ON "work_git_branches"("project_id", "provider", "name");
ALTER TABLE "work_git_branches" ADD CONSTRAINT "work_git_branches_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Pull request / merge request.
CREATE TABLE "work_git_pulls" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "provider" VARCHAR(8) NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "url" VARCHAR(500),
    "state" VARCHAR(16) NOT NULL,
    "author_login" VARCHAR(100),
    "head_ref" VARCHAR(255),
    "base_ref" VARCHAR(255),
    "reviewers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "issue_numbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "additions" INTEGER,
    "deletions" INTEGER,
    "changed_files" INTEGER,
    "merged_by" VARCHAR(100),
    "opened_at" TIMESTAMP(3) NOT NULL,
    "merged_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_git_pulls_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_work_git_pull" ON "work_git_pulls"("project_id", "provider", "number");
CREATE INDEX "idx_work_git_pull_state" ON "work_git_pulls"("project_id", "state");
ALTER TABLE "work_git_pulls" ADD CONSTRAINT "work_git_pulls_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
