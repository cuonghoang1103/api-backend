-- 27/10/2026: GitHub App "CT Work by CuongThai" — liên kết bản cài + repo theo dự án; sha đầu + trạng thái CI của PR.
ALTER TABLE "work_github_connections" ADD COLUMN "app_installation_id" BIGINT,
ADD COLUMN "app_repo_id" BIGINT,
ADD COLUMN "app_suspended_at" TIMESTAMP(3),
ADD COLUMN "app_linked_by_id" INTEGER;

CREATE INDEX "idx_work_github_app_repo" ON "work_github_connections"("app_repo_id");

ALTER TABLE "work_git_pulls" ADD COLUMN "head_sha" VARCHAR(64),
ADD COLUMN "ci_state" VARCHAR(16),
ADD COLUMN "ci_url" VARCHAR(500),
ADD COLUMN "ci_at" TIMESTAMP(3);
