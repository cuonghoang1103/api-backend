-- CT Work đợt 5: trường tuỳ chỉnh, bộ lọc đã lưu, dashboard. Chỉ thêm bảng mới.

-- CreateTable
CREATE TABLE "work_custom_fields" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "kind" VARCHAR(16) NOT NULL,
    "options" JSONB NOT NULL DEFAULT '[]',
    "type_keys" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_custom_values" (
    "issue_id" INTEGER NOT NULL,
    "field_id" INTEGER NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "work_custom_values_pkey" PRIMARY KEY ("issue_id","field_id")
);

-- CreateTable
CREATE TABLE "work_saved_filters" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "query" TEXT NOT NULL,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_saved_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_dashboards" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shared" BOOLEAN NOT NULL DEFAULT true,
    "widgets" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_custom_field" ON "work_custom_fields"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_custom_value_field" ON "work_custom_values"("field_id");

-- CreateIndex
CREATE INDEX "idx_work_saved_filter_project" ON "work_saved_filters"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_dashboard_project" ON "work_dashboards"("project_id");

-- AddForeignKey
ALTER TABLE "work_custom_fields" ADD CONSTRAINT "work_custom_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_custom_values" ADD CONSTRAINT "work_custom_values_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_custom_values" ADD CONSTRAINT "work_custom_values_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "work_custom_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_saved_filters" ADD CONSTRAINT "work_saved_filters_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_saved_filters" ADD CONSTRAINT "work_saved_filters_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_dashboards" ADD CONSTRAINT "work_dashboards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_dashboards" ADD CONSTRAINT "work_dashboards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

