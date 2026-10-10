-- CTW đợt 9b (13/10/2026): LỚP HỌC — BÀI TẬP (Classwork) + nộp bài (lịch sử phiên bản) + trả bài + nhận xét riêng
-- + tệp (R2) + cấu hình sổ điểm. CHỈ THÊM 6 bảng mới, không sửa/xoá gì đang có. Viết tay theo CLAUDE.md
-- (migrate dev hỏng P3006) — áp bằng `npx prisma migrate deploy`.

-- CreateTable
CREATE TABLE "work_class_assignments" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" JSONB,
    "description_text" TEXT,
    "kind" VARCHAR(12) NOT NULL DEFAULT 'INDIVIDUAL',
    "category" VARCHAR(40) NOT NULL DEFAULT 'Assignment',
    "topic" VARCHAR(80),
    "max_points" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "rubric_id" INTEGER,
    "due_at" TIMESTAMP(3),
    "publish_at" TIMESTAMP(3),
    "announced_at" TIMESTAMP(3),
    "reminded_at" TIMESTAMP(3),
    "allow_late" BOOLEAN NOT NULL DEFAULT true,
    "late_penalty_pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "late_penalty_max_pct" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "target_all" BOOLEAN NOT NULL DEFAULT true,
    "target_group_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "target_student_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_submissions" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "owner_key" VARCHAR(16) NOT NULL,
    "user_id" INTEGER,
    "group_id" INTEGER,
    "status" VARCHAR(12) NOT NULL DEFAULT 'ASSIGNED',
    "text" TEXT,
    "links" JSONB NOT NULL DEFAULT '[]',
    "submitted_at" TIMESTAMP(3),
    "submitted_by_id" INTEGER,
    "late" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 0,
    "points" DOUBLE PRECISION,
    "scores" JSONB NOT NULL DEFAULT '{}',
    "member_points" JSONB NOT NULL DEFAULT '{}',
    "penalty_pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "graded_at" TIMESTAMP(3),
    "grader_id" INTEGER,
    "returned_at" TIMESTAMP(3),
    "returned_points" DOUBLE PRECISION,
    "returned_scores" JSONB,
    "returned_member_points" JSONB,
    "returned_penalty_pct" DOUBLE PRECISION,
    "return_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_submission_versions" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "action" VARCHAR(12) NOT NULL,
    "text" TEXT,
    "links" JSONB NOT NULL DEFAULT '[]',
    "file_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "late" BOOLEAN NOT NULL DEFAULT false,
    "actor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_submission_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_submission_comments" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_submission_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_files" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "assignment_id" INTEGER,
    "submission_id" INTEGER,
    "uploader_id" INTEGER NOT NULL,
    "r2_key" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "detached_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_gradebooks" (
    "class_id" INTEGER NOT NULL,
    "mode" VARCHAR(12) NOT NULL DEFAULT 'POINTS',
    "weights" JSONB NOT NULL DEFAULT '{}',
    "missing_as_zero" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_gradebooks_pkey" PRIMARY KEY ("class_id")
);

-- CreateIndex
CREATE INDEX "idx_work_class_assignment_class" ON "work_class_assignments"("class_id", "publish_at");

-- CreateIndex
CREATE INDEX "idx_work_class_assignment_due" ON "work_class_assignments"("due_at", "reminded_at");

-- CreateIndex
CREATE INDEX "idx_work_class_submission_user" ON "work_class_submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_work_class_submission_group" ON "work_class_submissions"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_submission_owner" ON "work_class_submissions"("assignment_id", "owner_key");

-- CreateIndex
CREATE INDEX "idx_work_class_submission_version" ON "work_class_submission_versions"("submission_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_class_submission_comment" ON "work_class_submission_comments"("submission_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_class_file_assignment" ON "work_class_files"("assignment_id");

-- CreateIndex
CREATE INDEX "idx_work_class_file_submission" ON "work_class_files"("submission_id");

-- AddForeignKey
ALTER TABLE "work_class_assignments" ADD CONSTRAINT "work_class_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_assignments" ADD CONSTRAINT "work_class_assignments_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "work_rubrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_submissions" ADD CONSTRAINT "work_class_submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "work_class_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_submission_versions" ADD CONSTRAINT "work_class_submission_versions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "work_class_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_submission_comments" ADD CONSTRAINT "work_class_submission_comments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "work_class_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_files" ADD CONSTRAINT "work_class_files_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "work_class_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_files" ADD CONSTRAINT "work_class_files_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "work_class_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_gradebooks" ADD CONSTRAINT "work_class_gradebooks_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

