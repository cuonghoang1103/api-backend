-- CT Work đợt 4 (09/10/2026): SRS CÓ CẤU TRÚC & TRUY VẾT — actor / use case / business rule / màn hình / phân quyền
-- màn / Non-UI (A6+A7), liên kết truy vết tay (A19), defect log của Bug (A16+B5), Q&A log (A22), activity + work
-- product trên worklog (A24). CHỈ THÊM: 2 cột mới trên work_worklogs + 11 bảng mới, không sửa/xoá gì đang có.
-- Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng `npx prisma migrate deploy`.
-- Khoá ngoại tới work_issues: DEFERRABLE INITIALLY DEFERRED (luật 20260923131000_ct_work_issue_fk_deferred) —
-- xoá dự án dây chuyền (dự án ⇒ thẻ ⇒ UC/màn/defect) không vỡ vì thứ tự xoá.

-- AlterTable
ALTER TABLE "work_worklogs" ADD COLUMN     "activity" VARCHAR(16),
ADD COLUMN     "work_product" VARCHAR(120);

-- CreateTable
CREATE TABLE "work_srs_actors" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "kind" VARCHAR(12) NOT NULL DEFAULT 'PERSON',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_srs_actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_use_cases" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "feature" VARCHAR(120),
    "primary_actor_id" INTEGER,
    "secondary_actor_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "trigger" TEXT,
    "description" TEXT,
    "preconditions" TEXT,
    "postconditions" TEXT,
    "normal_flow" TEXT,
    "alternative_flows" TEXT,
    "exception_flows" TEXT,
    "priority" VARCHAR(8) NOT NULL DEFAULT 'MEDIUM',
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "issue_id" INTEGER,
    "ai_model" VARCHAR(80),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_use_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_business_rules" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "definition" TEXT,
    "category" VARCHAR(60),
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "ai_model" VARCHAR(80),
    "created_by_id" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_business_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_use_case_rules" (
    "use_case_id" INTEGER NOT NULL,
    "rule_id" INTEGER NOT NULL,

CONSTRAINT "work_use_case_rules_pkey" PRIMARY KEY ("use_case_id","rule_id")
);

-- CreateTable
CREATE TABLE "work_srs_screens" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "feature" VARCHAR(120),
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "issue_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_srs_screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_srs_screen_links" (
    "id" SERIAL NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "label" VARCHAR(120),

CONSTRAINT "work_srs_screen_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_srs_screen_auth" (
    "screen_id" INTEGER NOT NULL,
    "actor_id" INTEGER NOT NULL,

CONSTRAINT "work_srs_screen_auth_pkey" PRIMARY KEY ("screen_id","actor_id")
);

-- CreateTable
CREATE TABLE "work_srs_functions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "feature" VARCHAR(120),
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "issue_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_srs_functions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_trace_links" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "source_kind" VARCHAR(8) NOT NULL,
    "source_id" INTEGER NOT NULL,
    "target_kind" VARCHAR(8) NOT NULL,
    "target_id" INTEGER,
    "page_number" INTEGER,
    "heading" VARCHAR(255),
    "ref" VARCHAR(300),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT "work_trace_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_defect_info" (
    "issue_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "severity" VARCHAR(10),
    "activity" VARCHAR(8),
    "product" VARCHAR(40),
    "product_details" VARCHAR(300),
    "source_review_id" INTEGER,
    "source_finding_id" VARCHAR(20),
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_defect_info_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "work_raid_questions" (
    "raid_id" INTEGER NOT NULL,
    "asked_on" DATE NOT NULL,
    "asked_by" VARCHAR(120),
    "asked_to" VARCHAR(120),
    "priority" VARCHAR(8) NOT NULL DEFAULT 'MEDIUM',
    "answer" TEXT,
    "answered_at" TIMESTAMP(3),
    "answered_by_id" INTEGER,

CONSTRAINT "work_raid_questions_pkey" PRIMARY KEY ("raid_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_srs_actor_name" ON "work_srs_actors"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_use_case_issue" ON "work_use_cases"("issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_use_case_number" ON "work_use_cases"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_business_rule_number" ON "work_business_rules"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_use_case_rule_rule" ON "work_use_case_rules"("rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_srs_screen_name" ON "work_srs_screens"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_srs_screen_link_to" ON "work_srs_screen_links"("to_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_srs_screen_link" ON "work_srs_screen_links"("from_id", "to_id");

-- CreateIndex
CREATE INDEX "idx_work_srs_screen_auth_actor" ON "work_srs_screen_auth"("actor_id");

-- CreateIndex
CREATE INDEX "idx_work_srs_function_project" ON "work_srs_functions"("project_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_trace_link_source" ON "work_trace_links"("project_id", "source_kind", "source_id");

-- CreateIndex
CREATE INDEX "idx_work_defect_info_project" ON "work_defect_info"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_defect_info_review" ON "work_defect_info"("source_review_id");

-- AddForeignKey
ALTER TABLE "work_srs_actors" ADD CONSTRAINT "work_srs_actors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_use_cases" ADD CONSTRAINT "work_use_cases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_use_cases" ADD CONSTRAINT "work_use_cases_primary_actor_id_fkey" FOREIGN KEY ("primary_actor_id") REFERENCES "work_srs_actors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_use_cases" ADD CONSTRAINT "work_use_cases_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_business_rules" ADD CONSTRAINT "work_business_rules_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_use_case_rules" ADD CONSTRAINT "work_use_case_rules_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "work_use_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_use_case_rules" ADD CONSTRAINT "work_use_case_rules_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "work_business_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_screens" ADD CONSTRAINT "work_srs_screens_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_screens" ADD CONSTRAINT "work_srs_screens_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_srs_screen_links" ADD CONSTRAINT "work_srs_screen_links_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "work_srs_screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_screen_links" ADD CONSTRAINT "work_srs_screen_links_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "work_srs_screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_screen_auth" ADD CONSTRAINT "work_srs_screen_auth_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "work_srs_screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_screen_auth" ADD CONSTRAINT "work_srs_screen_auth_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "work_srs_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_functions" ADD CONSTRAINT "work_srs_functions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_srs_functions" ADD CONSTRAINT "work_srs_functions_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_trace_links" ADD CONSTRAINT "work_trace_links_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_defect_info" ADD CONSTRAINT "work_defect_info_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_defect_info" ADD CONSTRAINT "work_defect_info_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_raid_questions" ADD CONSTRAINT "work_raid_questions_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "work_raid_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
