-- CTW đợt 4b (10/10/2026) — SWR302: hồ sơ Wiegers + dữ liệu & sáu liên kết (R4/R5/R6/R12/R16/R23/R27).
-- Viết tay (migrate dev vấp P3006 ở repo này — xem CLAUDE.md). CHỈ THÊM bảng mới, không đụng bảng cũ.
-- Khoá ngoại tới work_issues: DEFERRABLE INITIALLY DEFERRED (luật 20260923131000_ct_work_issue_fk_deferred).
-- Liên kết feature ↔ UC/thẻ, feature ↔ version/epic, dòng ưu tiên ↔ FE/UC: đa hình, không FK tới đích (lọc khi đọc).

-- CreateTable
CREATE TABLE "work_features" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "scope" VARCHAR(4) NOT NULL DEFAULT 'IN',
    "priority" VARCHAR(8),
    "version_id" INTEGER,
    "epic_issue_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_feature_links" (
    "id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "kind" VARCHAR(8) NOT NULL,
    "target_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_feature_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_requirement_info" (
    "issue_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "req_type" VARCHAR(20) NOT NULL DEFAULT 'FUNCTIONAL',
    "subtype" VARCHAR(24),
    "priority" VARCHAR(8),
    "lifecycle" VARCHAR(12) NOT NULL DEFAULT 'PROPOSED',
    "source" VARCHAR(300),
    "owner_id" INTEGER,
    "rationale" TEXT,
    "stability" VARCHAR(8),
    "req_version" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_requirement_info_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "work_priority_rows" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "target_kind" VARCHAR(8) NOT NULL,
    "target_id" INTEGER NOT NULL,
    "benefit" INTEGER NOT NULL DEFAULT 1,
    "penalty" INTEGER NOT NULL DEFAULT 1,
    "cost" INTEGER NOT NULL DEFAULT 1,
    "risk" INTEGER NOT NULL DEFAULT 1,
    "note" VARCHAR(300),
    "position" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_priority_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_glossary_terms" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "term" VARCHAR(160) NOT NULL,
    "definition" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" VARCHAR(200),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_glossary_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_data_elements" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "kind" VARCHAR(10) NOT NULL DEFAULT 'PRIMITIVE',
    "composition" TEXT,
    "data_type" VARCHAR(60),
    "length" VARCHAR(20),
    "values" TEXT,
    "is_key" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_data_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_swr_settings" (
    "project_id" INTEGER NOT NULL,
    "weight_benefit" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "weight_penalty" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "weight_cost" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "weight_risk" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "declared_counts" JSONB,
    "ignored_nouns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_swr_settings_pkey" PRIMARY KEY ("project_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feature_number" ON "work_features"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_feature_link_target" ON "work_feature_links"("kind", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_feature_link" ON "work_feature_links"("feature_id", "kind", "target_id");

-- CreateIndex
CREATE INDEX "idx_work_requirement_info_type" ON "work_requirement_info"("project_id", "req_type");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_priority_row" ON "work_priority_rows"("project_id", "target_kind", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_glossary_term" ON "work_glossary_terms"("project_id", "term");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_data_element" ON "work_data_elements"("project_id", "name");

-- AddForeignKey
ALTER TABLE "work_features" ADD CONSTRAINT "work_features_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_feature_links" ADD CONSTRAINT "work_feature_links_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "work_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_requirement_info" ADD CONSTRAINT "work_requirement_info_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_requirement_info" ADD CONSTRAINT "work_requirement_info_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_priority_rows" ADD CONSTRAINT "work_priority_rows_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_glossary_terms" ADD CONSTRAINT "work_glossary_terms_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_data_elements" ADD CONSTRAINT "work_data_elements_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_swr_settings" ADD CONSTRAINT "work_swr_settings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
