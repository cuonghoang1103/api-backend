-- Exam Room (Phòng thi): FE (multiple choice) + PE (code/write/speak) with
-- persisted attempts. Additive — creates 3 new tables, touches nothing else.

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "kind" VARCHAR(10) NOT NULL DEFAULT 'FE',
    "pe_type" VARCHAR(10),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "code" VARCHAR(60),
    "duration_minutes" INTEGER NOT NULL DEFAULT 60,
    "total_points" DECIMAL(6,2) NOT NULL DEFAULT 10,
    "pass_mark" DECIMAL(6,2) NOT NULL DEFAULT 4,
    "shuffle_questions" BOOLEAN NOT NULL DEFAULT false,
    "shuffle_options" BOOLEAN NOT NULL DEFAULT false,
    "source" VARCHAR(10) NOT NULL DEFAULT 'SAMPLE',
    "instructions" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "kind" VARCHAR(10) NOT NULL DEFAULT 'MCQ',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "points" DECIMAL(6,2) NOT NULL DEFAULT 1,
    "prompt" TEXT NOT NULL,
    "image_url" VARCHAR(500),
    "options" JSONB,
    "correct_indexes" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "explanation" TEXT,
    "language" VARCHAR(30),
    "starter_code" TEXT,
    "sample_solution" TEXT,
    "expected_output" TEXT,
    "rubric" JSONB,
    "speaking_prompts" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "status" VARCHAR(15) NOT NULL DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "time_spent_seconds" INTEGER NOT NULL DEFAULT 0,
    "score" DECIMAL(6,2),
    "max_score" DECIMAL(6,2),
    "passed" BOOLEAN,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "feedback" JSONB,
    "integrity_signals" JSONB,
    "grading_mode" VARCHAR(10) NOT NULL DEFAULT 'AUTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_exams_course" ON "exams"("course_id");
CREATE INDEX "idx_exams_course_kind" ON "exams"("course_id", "kind");
CREATE INDEX "idx_exams_published" ON "exams"("is_published");

-- CreateIndex
CREATE INDEX "idx_exam_questions_exam" ON "exam_questions"("exam_id");

-- CreateIndex
CREATE INDEX "idx_exam_attempts_user_exam" ON "exam_attempts"("user_id", "exam_id");
CREATE INDEX "idx_exam_attempts_exam" ON "exam_attempts"("exam_id");
CREATE INDEX "idx_exam_attempts_user_status" ON "exam_attempts"("user_id", "status");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
