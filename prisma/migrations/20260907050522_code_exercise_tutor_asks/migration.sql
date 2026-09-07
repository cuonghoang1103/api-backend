-- Lưu lượt hỏi gia sư AI của một bài Code Lab (song song với lesson_tutor_asks).
-- Viết TAY + `IF NOT EXISTS` mọi bước — xem CLAUDE.md (migrate dev hỏng P3006).

CREATE TABLE IF NOT EXISTS "code_exercise_tutor_asks" (
    "id"          SERIAL       NOT NULL,
    "exercise_id" INTEGER      NOT NULL,
    "user_id"     INTEGER      NOT NULL,
    "question"    TEXT         NOT NULL,
    "answer"      TEXT         NOT NULL,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_exercise_tutor_asks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "idx_code_ex_tutor_ask_ex"
    ON "code_exercise_tutor_asks" ("exercise_id", "created_at");

CREATE INDEX IF NOT EXISTS "idx_code_ex_tutor_ask_user"
    ON "code_exercise_tutor_asks" ("user_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'code_exercise_tutor_asks_exercise_id_fkey') THEN
    ALTER TABLE "code_exercise_tutor_asks"
      ADD CONSTRAINT "code_exercise_tutor_asks_exercise_id_fkey"
      FOREIGN KEY ("exercise_id") REFERENCES "code_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'code_exercise_tutor_asks_user_id_fkey') THEN
    ALTER TABLE "code_exercise_tutor_asks"
      ADD CONSTRAINT "code_exercise_tutor_asks_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
