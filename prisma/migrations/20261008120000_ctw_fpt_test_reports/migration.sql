-- CT Work đợt 1b (08/10/2026): tài liệu kiểm thử chuẩn FPT — Report 5.1 Unit Test + 5.2 Integration Test.
-- CHỈ THÊM (8 bảng mới, không đụng bảng cũ). Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng
-- `npx prisma migrate deploy`. Khoá ngoại vào work_projects + bảng con cùng dự án đều DEFERRABLE INITIALLY DEFERRED
-- (luật từ 20260923131000_ct_work_issue_fk_deferred): xoá dự án cascade không vỡ giữa chừng.

-- CreateTable
CREATE TABLE "work_fpt_test_docs" (
    "project_id" INTEGER NOT NULL,
    "project_name" VARCHAR(200),
    "project_code" VARCHAR(40),
    "creator" VARCHAR(120),
    "reviewer" VARCHAR(120),
    "version" VARCHAR(20) NOT NULL DEFAULT '1.0',
    "unit_issue_date" DATE,
    "int_issue_date" DATE,
    "environment" TEXT,
    "tc_per_kloc" INTEGER NOT NULL DEFAULT 100,
    "unit_notes" TEXT,
    "int_notes" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_fpt_test_docs_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "work_fpt_changes" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "report" VARCHAR(4) NOT NULL,
    "effective_date" DATE NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "change_item" VARCHAR(200),
    "action" VARCHAR(1) NOT NULL DEFAULT 'A',
    "description" TEXT,
    "reference" VARCHAR(300),
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_fpt_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_unit_functions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "module_name" VARCHAR(120) NOT NULL,
    "method_name" VARCHAR(120) NOT NULL,
    "sheet_name" VARCHAR(31),
    "description" TEXT,
    "pre_condition" TEXT,
    "test_requirement" TEXT,
    "code_ref" VARCHAR(500),
    "loc" INTEGER,
    "created_by" VARCHAR(120),
    "executed_by" VARCHAR(120),
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_unit_functions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_unit_rows" (
    "id" SERIAL NOT NULL,
    "function_id" INTEGER NOT NULL,
    "section" VARCHAR(8) NOT NULL,
    "group_name" VARCHAR(120) NOT NULL,
    "label" VARCHAR(200),
    "value" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "work_unit_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_unit_cases" (
    "id" SERIAL NOT NULL,
    "function_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "type" VARCHAR(1) NOT NULL DEFAULT 'N',
    "result" VARCHAR(1),
    "executed_at" DATE,
    "defect_id" VARCHAR(60),
    "note" TEXT,

    CONSTRAINT "work_unit_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_unit_marks" (
    "row_id" INTEGER NOT NULL,
    "case_id" INTEGER NOT NULL,

    CONSTRAINT "work_unit_marks_pkey" PRIMARY KEY ("row_id","case_id")
);

-- CreateTable
CREATE TABLE "work_it_modules" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "sheet_name" VARCHAR(31),
    "id_prefix" VARCHAR(10) NOT NULL DEFAULT 'IT',
    "description" TEXT,
    "pre_condition" TEXT,
    "test_requirement" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_it_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_it_cases" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "section" VARCHAR(200),
    "description" TEXT NOT NULL,
    "procedure" TEXT,
    "test_data" TEXT,
    "expected" TEXT,
    "actual" TEXT,
    "pre_conditions" TEXT,
    "evidence" TEXT,
    "note" TEXT,
    "rounds" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "work_it_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_fpt_change_project" ON "work_fpt_changes"("project_id", "report");

-- CreateIndex
CREATE INDEX "idx_work_unit_function_project" ON "work_unit_functions"("project_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_unit_row_function" ON "work_unit_rows"("function_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_unit_case_function" ON "work_unit_cases"("function_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_unit_mark_case" ON "work_unit_marks"("case_id");

-- CreateIndex
CREATE INDEX "idx_work_it_module_project" ON "work_it_modules"("project_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_it_case_module" ON "work_it_cases"("module_id", "position");

-- AddForeignKey
ALTER TABLE "work_fpt_test_docs" ADD CONSTRAINT "work_fpt_test_docs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_fpt_changes" ADD CONSTRAINT "work_fpt_changes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_unit_functions" ADD CONSTRAINT "work_unit_functions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_unit_rows" ADD CONSTRAINT "work_unit_rows_function_id_fkey" FOREIGN KEY ("function_id") REFERENCES "work_unit_functions"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_unit_cases" ADD CONSTRAINT "work_unit_cases_function_id_fkey" FOREIGN KEY ("function_id") REFERENCES "work_unit_functions"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_unit_marks" ADD CONSTRAINT "work_unit_marks_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "work_unit_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_unit_marks" ADD CONSTRAINT "work_unit_marks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "work_unit_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_it_modules" ADD CONSTRAINT "work_it_modules_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_it_cases" ADD CONSTRAINT "work_it_cases_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "work_it_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

