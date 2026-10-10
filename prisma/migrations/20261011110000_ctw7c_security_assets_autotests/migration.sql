-- CTW đợt 7c (11/10/2026) — bảo mật & quản trị (C17 ép 2FA), sổ tài sản/giấy phép (C25 / CTW-21),
-- kết quả test tự động (TST-2: B10 JUnit/Playwright/Jest, T11 độ phủ, test flaky).
-- Viết tay (migrate dev vấp P3006 ở repo này — xem CLAUDE.md). CHỈ THÊM bảng mới, không đụng bảng cũ.
-- Liên kết tới người / thẻ / trang / cycle / token: KHÔNG FK (xoá mềm / lịch sử), lọc khi đọc — như work_trace_links.

-- CreateTable
CREATE TABLE "work_security_policies" (
    "workspace_id" INTEGER NOT NULL,
    "require_2fa" BOOLEAN NOT NULL DEFAULT false,
    "grace_days" INTEGER NOT NULL DEFAULT 7,
    "enforced_at" TIMESTAMP(3),
    "grace_until" TIMESTAMP(3),
    "updated_by_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_security_policies_pkey" PRIMARY KEY ("workspace_id")
);

-- CreateTable
CREATE TABLE "work_assets" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "category" VARCHAR(16) NOT NULL,
    "license_type" VARCHAR(24) NOT NULL,
    "license_name" VARCHAR(120),
    "license_url" VARCHAR(500),
    "source" VARCHAR(300),
    "source_url" VARCHAR(500),
    "version" VARCHAR(60),
    "owner_id" INTEGER,
    "status" VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    "expires_at" DATE,
    "remind_days" INTEGER NOT NULL DEFAULT 30,
    "reminded_for" DATE,
    "cost" DECIMAL(14,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "billing" VARCHAR(10) NOT NULL DEFAULT 'ONE_TIME',
    "seats" INTEGER,
    "attribution_required" BOOLEAN NOT NULL DEFAULT false,
    "attribution" TEXT,
    "notes" TEXT,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_asset_links" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "issue_id" INTEGER,
    "page_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_asset_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_auto_tests" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "key_hash" VARCHAR(64) NOT NULL,
    "key" TEXT NOT NULL,
    "suite" VARCHAR(300),
    "name" VARCHAR(500) NOT NULL,
    "file" VARCHAR(500),
    "test_case_id" INTEGER,
    "history" VARCHAR(40) NOT NULL DEFAULT '',
    "last_status" VARCHAR(8),
    "last_duration_ms" INTEGER,
    "flaky" BOOLEAN NOT NULL DEFAULT false,
    "flaky_score" INTEGER NOT NULL DEFAULT 0,
    "bug_issue_id" INTEGER,
    "fail_signature" VARCHAR(64),
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_auto_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_imports" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "cycle_id" INTEGER,
    "format" VARCHAR(12) NOT NULL,
    "source" VARCHAR(8) NOT NULL DEFAULT 'API',
    "build" VARCHAR(80),
    "branch" VARCHAR(120),
    "commit_sha" VARCHAR(64),
    "run_url" VARCHAR(500),
    "total" INTEGER NOT NULL DEFAULT 0,
    "passed" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "flaky" INTEGER NOT NULL DEFAULT 0,
    "duration_ms" INTEGER,
    "new_bugs" INTEGER NOT NULL DEFAULT 0,
    "linked_bugs" INTEGER NOT NULL DEFAULT 0,
    "coverage_pct" DECIMAL(5,2),
    "coverage_branch_pct" DECIMAL(5,2),
    "coverage_format" VARCHAR(12),
    "coverage_detail" JSONB,
    "token_id" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_test_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_security_policy_req" ON "work_security_policies"("require_2fa");

-- CreateIndex
CREATE INDEX "idx_work_asset_expiry" ON "work_assets"("project_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_asset_number" ON "work_assets"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_asset_link_issue" ON "work_asset_links"("asset_id", "issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_asset_link_page" ON "work_asset_links"("asset_id", "page_id");

-- CreateIndex
CREATE INDEX "idx_work_auto_test_case" ON "work_auto_tests"("test_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_auto_test" ON "work_auto_tests"("project_id", "key_hash");

-- CreateIndex
CREATE INDEX "idx_work_test_import_project" ON "work_test_imports"("project_id", "created_at");

-- AddForeignKey
ALTER TABLE "work_security_policies" ADD CONSTRAINT "work_security_policies_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_assets" ADD CONSTRAINT "work_assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_asset_links" ADD CONSTRAINT "work_asset_links_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "work_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_auto_tests" ADD CONSTRAINT "work_auto_tests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_imports" ADD CONSTRAINT "work_test_imports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
