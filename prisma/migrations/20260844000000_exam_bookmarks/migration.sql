-- Exam Room: bookmarks (Sổ tay ôn tập)
-- Additive only. Two tables:
--   exam_bookmarks           — save a whole paper to retake
--   exam_question_bookmarks  — save a single question (+ personal note)
-- userId has no FK (matches exam_attempts / interview pattern).

-- CreateTable
CREATE TABLE "exam_bookmarks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_question_bookmarks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_question_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_exam_bookmark" ON "exam_bookmarks"("user_id", "exam_id");
CREATE INDEX "idx_exam_bookmarks_user" ON "exam_bookmarks"("user_id");
CREATE UNIQUE INDEX "uk_exam_question_bookmark" ON "exam_question_bookmarks"("user_id", "question_id");
CREATE INDEX "idx_exam_qbookmarks_user" ON "exam_question_bookmarks"("user_id");
CREATE INDEX "idx_exam_qbookmarks_exam" ON "exam_question_bookmarks"("exam_id");

-- AddForeignKey
ALTER TABLE "exam_bookmarks" ADD CONSTRAINT "exam_bookmarks_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exam_question_bookmarks" ADD CONSTRAINT "exam_question_bookmarks_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exam_question_bookmarks" ADD CONSTRAINT "exam_question_bookmarks_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
