-- CTW đợt 9c (13/10/2026): LỚP HỌC — QUIZ TRẮC NGHIỆM TỰ CHẤM (ngân hàng câu hỏi, quiz, lượt làm). Viết tay theo
-- `prisma migrate diff` (migrate dev hỏng P3006 trong repo này). Chỉ TẠO bảng mới — không đụng bảng cũ.

-- CreateTable
CREATE TABLE "work_class_quiz_questions" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "topic" VARCHAR(60) NOT NULL DEFAULT 'General',
    "type" VARCHAR(12) NOT NULL,
    "prompt" TEXT NOT NULL,
    "image_url" VARCHAR(500),
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "options" JSONB NOT NULL DEFAULT '[]',
    "answer" JSONB NOT NULL DEFAULT '{}',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "ai_draft" BOOLEAN NOT NULL DEFAULT false,
    "approved_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_quizzes" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "topic" VARCHAR(80),
    "status" VARCHAR(12) NOT NULL DEFAULT 'DRAFT',
    "items" JSONB NOT NULL DEFAULT '[]',
    "open_at" TIMESTAMP(3),
    "close_at" TIMESTAMP(3),
    "time_limit_min" INTEGER,
    "max_attempts" INTEGER NOT NULL DEFAULT 1,
    "shuffle_questions" BOOLEAN NOT NULL DEFAULT true,
    "shuffle_options" BOOLEAN NOT NULL DEFAULT true,
    "layout" VARCHAR(16) NOT NULL DEFAULT 'ALL',
    "show_answers" VARCHAR(12) NOT NULL DEFAULT 'AFTER_DUE',
    "scoring" VARCHAR(10) NOT NULL DEFAULT 'HIGHEST',
    "published_at" TIMESTAMP(3),
    "announced_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_quiz_attempts" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "seed" INTEGER NOT NULL,
    "status" VARCHAR(12) NOT NULL DEFAULT 'IN_PROGRESS',
    "paper" JSONB NOT NULL DEFAULT '[]',
    "responses" JSONB NOT NULL DEFAULT '{}',
    "results" JSONB NOT NULL DEFAULT '{}',
    "manual" JSONB NOT NULL DEFAULT '{}',
    "score" DOUBLE PRECISION,
    "max_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "auto_submitted" BOOLEAN NOT NULL DEFAULT false,
    "last_saved_at" TIMESTAMP(3),
    "blur_count" INTEGER NOT NULL DEFAULT 0,
    "blur_log" JSONB NOT NULL DEFAULT '[]',
    "graded_by_id" INTEGER,
    "graded_at" TIMESTAMP(3),

    CONSTRAINT "work_class_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_class_quiz_question_topic" ON "work_class_quiz_questions"("class_id", "topic");

-- CreateIndex
CREATE INDEX "idx_work_class_quiz_class" ON "work_class_quizzes"("class_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_class_quiz_attempt_user" ON "work_class_quiz_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_quiz_attempt" ON "work_class_quiz_attempts"("quiz_id", "user_id", "number");

-- AddForeignKey
ALTER TABLE "work_class_quiz_questions" ADD CONSTRAINT "work_class_quiz_questions_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_quizzes" ADD CONSTRAINT "work_class_quizzes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_quiz_attempts" ADD CONSTRAINT "work_class_quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "work_class_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

