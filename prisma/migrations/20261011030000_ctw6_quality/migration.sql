-- CTW đợt 6 (11/10/2026): RV review/inspection + baseline + CR↔yêu cầu (R18–R22, T2, T13) · TST-1 quản lý test
-- chuyên sâu (T1, T5–T9, T12, B2, B6, B9) · phiên kiểm thử thăm dò. Viết tay (migrate dev vấp P3006 — xem CLAUDE.md).

-- AlterTable
ALTER TABLE "work_defect_info" ADD COLUMN     "detected_by_tool" VARCHAR(120),
ADD COLUMN     "fix_note" TEXT,
ADD COLUMN     "injected_phase" VARCHAR(16),
ADD COLUMN     "review_session_id" INTEGER,
ADD COLUMN     "root_cause" VARCHAR(24),
ADD COLUMN     "test_level" VARCHAR(16);

-- AlterTable
ALTER TABLE "work_raid_items" ADD COLUMN     "risk_kind" VARCHAR(8);

-- AlterTable
ALTER TABLE "work_test_cases" ADD COLUMN     "estimate_min" INTEGER,
ADD COLUMN     "level" VARCHAR(16),
ADD COLUMN     "technique" VARCHAR(16),
ADD COLUMN     "test_type" VARCHAR(16);

-- AlterTable
ALTER TABLE "work_test_plans" ADD COLUMN     "settings" JSONB;

-- CreateTable
CREATE TABLE "work_review_sessions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "kind" VARCHAR(8) NOT NULL DEFAULT 'DOC',
    "method" VARCHAR(16) NOT NULL DEFAULT 'INSPECTION',
    "checklist_key" VARCHAR(40) NOT NULL,
    "page_id" INTEGER,
    "work_product" VARCHAR(200),
    "pr_url" VARCHAR(500),
    "size" DOUBLE PRECISION,
    "size_unit" VARCHAR(8) NOT NULL DEFAULT 'PAGE',
    "status" VARCHAR(12) NOT NULL DEFAULT 'PLANNING',
    "decision" VARCHAR(20),
    "meeting_at" TIMESTAMP(3),
    "meeting_minutes" INTEGER,
    "rework_minutes" INTEGER,
    "entry_criteria" TEXT,
    "exit_criteria" TEXT,
    "notes" TEXT,
    "created_by_id" INTEGER,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_review_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_review_participants" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(12) NOT NULL,
    "prep_minutes" INTEGER,

    CONSTRAINT "work_review_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_review_items" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "section" VARCHAR(120) NOT NULL,
    "question" TEXT NOT NULL,
    "result" VARCHAR(4),
    "line" VARCHAR(60),
    "note" TEXT,
    "severity" VARCHAR(10),
    "defect_issue_id" INTEGER,

    CONSTRAINT "work_review_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_baselines" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "snapshot" JSONB NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "item_count" INTEGER NOT NULL,
    "status" VARCHAR(12) NOT NULL DEFAULT 'DRAFT',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" INTEGER,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_baseline_signoffs" (
    "id" SERIAL NOT NULL,
    "baseline_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "decision" VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "content_hash" VARCHAR(64),
    "ip" VARCHAR(64),
    "decided_at" TIMESTAMP(3),

    CONSTRAINT "work_baseline_signoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_cr_affected_refs" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "change_request_id" INTEGER NOT NULL,
    "kind" VARCHAR(4) NOT NULL,
    "ref_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_cr_affected_refs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_designs" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "technique" VARCHAR(20) NOT NULL,
    "requirement_key" VARCHAR(40),
    "input" JSONB NOT NULL,
    "cases" JSONB NOT NULL DEFAULT '[]',
    "exported" JSONB NOT NULL DEFAULT '[]',
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_test_designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_exploratory_sessions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "charter" TEXT NOT NULL,
    "area" VARCHAR(160),
    "timebox_min" INTEGER NOT NULL DEFAULT 60,
    "tester_id" INTEGER,
    "cycle_id" INTEGER,
    "status" VARCHAR(10) NOT NULL DEFAULT 'PLANNED',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "notes" JSONB NOT NULL DEFAULT '[]',
    "summary" TEXT,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_exploratory_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_review_session_number" ON "work_review_sessions"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_review_participant" ON "work_review_participants"("session_id", "user_id", "role");

-- CreateIndex
CREATE INDEX "idx_work_review_item_session" ON "work_review_items"("session_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_baseline_project" ON "work_baselines"("project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_baseline_number" ON "work_baselines"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_baseline_signoff" ON "work_baseline_signoffs"("baseline_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_cr_affected_ref_target" ON "work_cr_affected_refs"("project_id", "kind", "ref_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_cr_affected_ref" ON "work_cr_affected_refs"("change_request_id", "kind", "ref_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_test_design_number" ON "work_test_designs"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_exploratory_number" ON "work_exploratory_sessions"("project_id", "number");

-- AddForeignKey
ALTER TABLE "work_review_sessions" ADD CONSTRAINT "work_review_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_review_participants" ADD CONSTRAINT "work_review_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_review_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_review_items" ADD CONSTRAINT "work_review_items_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_review_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_baselines" ADD CONSTRAINT "work_baselines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_baseline_signoffs" ADD CONSTRAINT "work_baseline_signoffs_baseline_id_fkey" FOREIGN KEY ("baseline_id") REFERENCES "work_baselines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_cr_affected_refs" ADD CONSTRAINT "work_cr_affected_refs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_designs" ADD CONSTRAINT "work_test_designs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_exploratory_sessions" ADD CONSTRAINT "work_exploratory_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

