-- "Start Exam with CuongMini" (Pro only) — gates the live per-question AI
-- chat/reveal-answer routes on an exam attempt.
ALTER TABLE "exam_attempts" ADD COLUMN "ai_assisted" BOOLEAN NOT NULL DEFAULT false;
