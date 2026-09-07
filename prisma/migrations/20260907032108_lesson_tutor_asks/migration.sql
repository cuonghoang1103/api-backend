-- Lưu lại từng lượt hỏi gia sư AI của một bài học, để người sau đọc được.
--
-- Viết TAY chứ không sinh bằng `prisma migrate dev`: migration
-- 20260706130000_add_music_and_profile trong kho này không replay được trên
-- shadow DB (P3006), nên `migrate dev` luôn hỏng. Xem CLAUDE.md.
--
-- `IF NOT EXISTS` ở mọi bước: nếu một lần chạy trước chết giữa chừng thì lần
-- sau vẫn đi tiếp được, thay vì kẹt ở P3009 và phải gỡ tay trên production.

CREATE TABLE IF NOT EXISTS "lesson_tutor_asks" (
    "id"         SERIAL       NOT NULL,
    "lesson_id"  INTEGER      NOT NULL,
    "user_id"    INTEGER      NOT NULL,
    "question"   TEXT         NOT NULL,
    "answer"     TEXT         NOT NULL,
    "lang"       VARCHAR(4)   NOT NULL DEFAULT 'vi',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_tutor_asks_pkey" PRIMARY KEY ("id")
);

-- Danh sách luôn đọc theo (bài, mới nhất trước).
CREATE INDEX IF NOT EXISTS "idx_lesson_tutor_ask_lesson"
    ON "lesson_tutor_asks" ("lesson_id", "created_at");

CREATE INDEX IF NOT EXISTS "idx_lesson_tutor_ask_user"
    ON "lesson_tutor_asks" ("user_id");

-- Khoá ngoại: thêm rời để `IF NOT EXISTS` dùng được (Postgres không có
-- `ADD CONSTRAINT IF NOT EXISTS`, nên bọc trong DO).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lesson_tutor_asks_lesson_id_fkey') THEN
    ALTER TABLE "lesson_tutor_asks"
      ADD CONSTRAINT "lesson_tutor_asks_lesson_id_fkey"
      FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lesson_tutor_asks_user_id_fkey') THEN
    ALTER TABLE "lesson_tutor_asks"
      ADD CONSTRAINT "lesson_tutor_asks_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
