-- CTW đợt 5 (10/10/2026): GIẢNG VIÊN & LỚP HỌC — lớp (mã lớp, danh sách MSSV, nhóm ⇒ dự án), rubric + điểm theo mốc
-- (công bố mới thấy, lịch sử), và khoá chống trùng của việc định kỳ (trigger scheduled.recurring).
-- CHỈ THÊM 7 bảng mới, không sửa/xoá gì đang có. Viết tay theo CLAUDE.md (migrate dev hỏng P3006) —
-- áp bằng `npx prisma migrate deploy`.

-- CreateTable
CREATE TABLE "work_classes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "subject" VARCHAR(16) NOT NULL,
    "class_code" VARCHAR(32) NOT NULL,
    "term" VARCHAR(16) NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "teacher_email" VARCHAR(100),
    "join_code" VARCHAR(16) NOT NULL,
    "join_expires_at" TIMESTAMP(3),
    "join_open" BOOLEAN NOT NULL DEFAULT true,
    "max_group_size" INTEGER NOT NULL DEFAULT 6,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "week1_start" DATE,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_groups" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "project_id" INTEGER,
    "leader_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_students" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "email" VARCHAR(100),
    "student_code" VARCHAR(20),
    "full_name" VARCHAR(120),
    "group_id" INTEGER,
    "source" VARCHAR(8) NOT NULL DEFAULT 'ROSTER',
    "invited_at" TIMESTAMP(3),
    "invite_count" INTEGER NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_rubrics" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "subject" VARCHAR(16),
    "description" TEXT,
    "criteria" JSONB NOT NULL DEFAULT '[]',
    "scale_max" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "template_key" VARCHAR(32),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_rubrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_grades" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "rubric_id" INTEGER NOT NULL,
    "milestone" VARCHAR(80) NOT NULL,
    "stage_id" INTEGER,
    "subject_key" VARCHAR(24) NOT NULL,
    "subject_user_id" INTEGER,
    "scores" JSONB NOT NULL DEFAULT '{}',
    "notes" JSONB NOT NULL DEFAULT '{}',
    "comment" TEXT,
    "total" DOUBLE PRECISION,
    "grader_id" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_grade_history" (
    "id" SERIAL NOT NULL,
    "grade_id" INTEGER NOT NULL,
    "action" VARCHAR(12) NOT NULL,
    "scores" JSONB NOT NULL DEFAULT '{}',
    "total" DOUBLE PRECISION,
    "comment" TEXT,
    "published_at" TIMESTAMP(3),
    "actor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_grade_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_recurring_runs" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "dedup_key" VARCHAR(120) NOT NULL,
    "occurrence" VARCHAR(10) NOT NULL,
    "issue_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_recurring_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_join_code" ON "work_classes"("join_code");

-- CreateIndex
CREATE INDEX "idx_work_class_owner" ON "work_classes"("owner_id");

-- CreateIndex
CREATE INDEX "idx_work_class_teacher" ON "work_classes"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_group_project" ON "work_class_groups"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_group_number" ON "work_class_groups"("class_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_class_student_user" ON "work_class_students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_student_email" ON "work_class_students"("class_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_student_user" ON "work_class_students"("class_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_student_code" ON "work_class_students"("class_id", "student_code");

-- CreateIndex
CREATE INDEX "idx_work_rubric_owner" ON "work_rubrics"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_grade_subject" ON "work_grades"("project_id", "rubric_id", "milestone", "subject_key");

-- CreateIndex
CREATE INDEX "idx_work_grade_history" ON "work_grade_history"("grade_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_recurring_dedup" ON "work_recurring_runs"("dedup_key");

-- CreateIndex
CREATE INDEX "idx_work_recurring_run_rule" ON "work_recurring_runs"("rule_id", "created_at");

-- AddForeignKey
ALTER TABLE "work_classes" ADD CONSTRAINT "work_classes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_classes" ADD CONSTRAINT "work_classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_groups" ADD CONSTRAINT "work_class_groups_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_groups" ADD CONSTRAINT "work_class_groups_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_students" ADD CONSTRAINT "work_class_students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_students" ADD CONSTRAINT "work_class_students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_students" ADD CONSTRAINT "work_class_students_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "work_class_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_rubrics" ADD CONSTRAINT "work_rubrics_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_grades" ADD CONSTRAINT "work_grades_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_grades" ADD CONSTRAINT "work_grades_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "work_rubrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_grade_history" ADD CONSTRAINT "work_grade_history_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "work_grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_recurring_runs" ADD CONSTRAINT "work_recurring_runs_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "work_automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
