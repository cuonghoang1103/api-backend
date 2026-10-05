-- CT Work đợt S6 (05/10/2026): SPEC FIDELITY + nguồn gốc AI (provenance). CHỈ THÊM — không sửa/xoá gì có sẵn.

-- Nguồn gốc AI trên thẻ
ALTER TABLE "work_issues" ADD COLUMN "ai_assisted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ai_model" VARCHAR(120),
ADD COLUMN "ai_assisted_at" TIMESTAMP(3),
ADD COLUMN "ai_applied_by_id" INTEGER;

-- Nguồn gốc AI trên trang tài liệu
ALTER TABLE "work_pages" ADD COLUMN "ai_assisted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ai_model" VARCHAR(120),
ADD COLUMN "ai_assisted_at" TIMESTAMP(3),
ADD COLUMN "ai_applied_by_id" INTEGER;

-- Lịch sử chấm Spec Fidelity
CREATE TABLE "work_spec_reviews" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "scope" VARCHAR(16) NOT NULL,
    "page_id" INTEGER,
    "page_version" INTEGER,
    "stage_id" INTEGER,
    "epic_number" INTEGER,
    "scope_label" VARCHAR(200) NOT NULL,
    "overall" INTEGER NOT NULL,
    "completeness" INTEGER NOT NULL,
    "consistency" INTEGER NOT NULL,
    "unambiguity" INTEGER NOT NULL,
    "verifiability" INTEGER NOT NULL,
    "item_count" INTEGER NOT NULL DEFAULT 0,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "untraced" JSONB NOT NULL DEFAULT '[]',
    "stats" JSONB NOT NULL DEFAULT '{}',
    "semantic" VARCHAR(16) NOT NULL DEFAULT 'SKIPPED',
    "model" VARCHAR(120),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_spec_reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_spec_review_project" ON "work_spec_reviews"("project_id", "scope", "created_at");
CREATE INDEX "idx_work_spec_review_page" ON "work_spec_reviews"("page_id", "created_at");
CREATE INDEX "idx_work_spec_review_stage" ON "work_spec_reviews"("stage_id", "created_at");

ALTER TABLE "work_spec_reviews" ADD CONSTRAINT "work_spec_reviews_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_spec_reviews" ADD CONSTRAINT "work_spec_reviews_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_spec_reviews" ADD CONSTRAINT "work_spec_reviews_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Phê duyệt cổng giai đoạn đính kèm lần chấm
ALTER TABLE "work_approvals" ADD COLUMN "spec_review_id" INTEGER;
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_spec_review_id_fkey" FOREIGN KEY ("spec_review_id") REFERENCES "work_spec_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
