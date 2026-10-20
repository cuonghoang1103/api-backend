-- "Create with CuongMini" (20/10/2026): bản nháp dựng dự án / không gian bằng CuongMini.
CREATE TABLE "work_setup_drafts" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "mode" VARCHAR(12) NOT NULL DEFAULT 'PROJECT',
    "status" VARCHAR(12) NOT NULL DEFAULT 'DRAFT',
    "title" VARCHAR(160) NOT NULL DEFAULT '',
    "model" VARCHAR(20) NOT NULL DEFAULT 'cm-sonic',
    "input" JSONB NOT NULL DEFAULT '{}',
    "sources" JSONB NOT NULL DEFAULT '[]',
    "understanding" JSONB,
    "plan" JSONB,
    "progress" JSONB NOT NULL DEFAULT '[]',
    "usage" JSONB NOT NULL DEFAULT '[]',
    "result" JSONB,
    "error" TEXT,
    "failed_phase" VARCHAR(12),
    "cancel_requested" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "applied_at" TIMESTAMP(3),

    CONSTRAINT "work_setup_drafts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_setup_draft_owner" ON "work_setup_drafts"("workspace_id", "created_by_id", "updated_at");

ALTER TABLE "work_setup_drafts" ADD CONSTRAINT "work_setup_drafts_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
