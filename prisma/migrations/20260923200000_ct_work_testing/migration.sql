-- CT Work đợt 3: quản lý kiểm thử (test case, bước, plan, cycle, lần chạy, kết quả bước, bug).
-- Chỉ thêm bảng mới; không có khoá ngoại mới nào trên work_issues (bảng DEFERRABLE).

-- CreateTable
CREATE TABLE "work_test_cases" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL DEFAULT 'MANUAL',
    "preconditions" TEXT,
    "gherkin" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_steps" (
    "id" SERIAL NOT NULL,
    "test_case_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "data" TEXT,
    "expected" TEXT,

    CONSTRAINT "work_test_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_plans" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "created_by_id" INTEGER,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_test_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_plan_cases" (
    "plan_id" INTEGER NOT NULL,
    "test_case_id" INTEGER NOT NULL,

    CONSTRAINT "work_test_plan_cases_pkey" PRIMARY KEY ("plan_id","test_case_id")
);

-- CreateTable
CREATE TABLE "work_test_cycles" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "plan_id" INTEGER,
    "name" VARCHAR(120) NOT NULL,
    "environment" VARCHAR(120),
    "build" VARCHAR(80),
    "state" VARCHAR(16) NOT NULL DEFAULT 'PLANNED',
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_test_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_runs" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "test_case_id" INTEGER NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'TODO',
    "assignee_id" INTEGER,
    "executed_by_id" INTEGER,
    "executed_at" TIMESTAMP(3),
    "comment" TEXT,
    "gherkin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_test_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_step_results" (
    "id" SERIAL NOT NULL,
    "run_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "data" TEXT,
    "expected" TEXT,
    "status" VARCHAR(16) NOT NULL DEFAULT 'TODO',
    "actual" TEXT,

    CONSTRAINT "work_test_step_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_test_run_defects" (
    "run_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_test_run_defects_pkey" PRIMARY KEY ("run_id","issue_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_test_case_issue" ON "work_test_cases"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_test_step_case" ON "work_test_steps"("test_case_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_test_plan_project" ON "work_test_plans"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_test_cycle_project" ON "work_test_cycles"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_test_run_case" ON "work_test_runs"("test_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_test_run" ON "work_test_runs"("cycle_id", "test_case_id");

-- CreateIndex
CREATE INDEX "idx_work_step_result_run" ON "work_test_step_results"("run_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_run_defect_issue" ON "work_test_run_defects"("issue_id");

-- AddForeignKey
ALTER TABLE "work_test_cases" ADD CONSTRAINT "work_test_cases_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_steps" ADD CONSTRAINT "work_test_steps_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "work_test_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_plans" ADD CONSTRAINT "work_test_plans_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_plan_cases" ADD CONSTRAINT "work_test_plan_cases_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "work_test_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_plan_cases" ADD CONSTRAINT "work_test_plan_cases_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "work_test_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_cycles" ADD CONSTRAINT "work_test_cycles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_cycles" ADD CONSTRAINT "work_test_cycles_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "work_test_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_runs" ADD CONSTRAINT "work_test_runs_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "work_test_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_runs" ADD CONSTRAINT "work_test_runs_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "work_test_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_runs" ADD CONSTRAINT "work_test_runs_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_runs" ADD CONSTRAINT "work_test_runs_executed_by_id_fkey" FOREIGN KEY ("executed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_step_results" ADD CONSTRAINT "work_test_step_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "work_test_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_run_defects" ADD CONSTRAINT "work_test_run_defects_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "work_test_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_test_run_defects" ADD CONSTRAINT "work_test_run_defects_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

