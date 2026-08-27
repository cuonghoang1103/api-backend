-- Cache câu trả lời gia sư AI cho câu hỏi GỢI Ý cố định của từng bài học.
-- ADDITIVE, idempotent (IF NOT EXISTS). Bảng mới, không đụng dữ liệu cũ. Viết
-- tay (repo `migrate dev` hỏng shadow DB), áp bằng `migrate deploy`.

-- CreateTable
CREATE TABLE IF NOT EXISTS "lesson_ai_answers" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "cache_key" VARCHAR(40) NOT NULL,
    "lang" VARCHAR(4) NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_ai_answers_pkey" PRIMARY KEY ("id")
);

-- Một chip (lesson_id, cache_key, lang) chỉ có một câu trả lời cache.
CREATE UNIQUE INDEX IF NOT EXISTS "lesson_ai_answers_lesson_id_cache_key_lang_key"
    ON "lesson_ai_answers"("lesson_id", "cache_key", "lang");

CREATE INDEX IF NOT EXISTS "idx_lesson_ai_answers_lesson"
    ON "lesson_ai_answers"("lesson_id");

-- FK: xoá bài học thì xoá luôn cache của nó. Bọc DO để idempotent.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lesson_ai_answers_lesson_id_fkey'
  ) THEN
    ALTER TABLE "lesson_ai_answers"
      ADD CONSTRAINT "lesson_ai_answers_lesson_id_fkey"
      FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
