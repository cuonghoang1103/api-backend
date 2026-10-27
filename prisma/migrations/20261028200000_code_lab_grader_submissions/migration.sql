-- Code Lab đợt Academy (28/10/2026) — máy chấm + lượt nộp. CHỈ THÊM, không phá:
--   * code_exercises: bộ kiểm (tests_json), loại chấm (grade_kind), dạng bài (kind),
--     lỗi hay gặp (mistakes_json), mốc video bài giảng (video_ref), bảng thuật ngữ (glossary_json),
--     bản demo chạy được của đề lớn (demo_html).
--   * code_submissions: lịch sử Chạy thử / Nộp của người học.
-- Viết tay + `npx prisma migrate deploy` (CLAUDE.md: `migrate dev` hỏng P3006 ở repo này).

ALTER TABLE "code_exercises"
  ADD COLUMN "tests_json"    JSONB,
  ADD COLUMN "grade_kind"    VARCHAR(20),
  ADD COLUMN "kind"          VARCHAR(20) NOT NULL DEFAULT 'practice',
  ADD COLUMN "mistakes_json" JSONB,
  ADD COLUMN "video_ref"     JSONB,
  ADD COLUMN "glossary_json" JSONB,
  ADD COLUMN "demo_html"     TEXT;

CREATE INDEX "idx_code_exercise_kind" ON "code_exercises"("kind");

CREATE TABLE "code_submissions" (
    "id"          SERIAL NOT NULL,
    "user_id"     INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "mode"        VARCHAR(10) NOT NULL DEFAULT 'submit',
    "grade_kind"  VARCHAR(20),
    "code"        JSONB,
    "results"     JSONB,
    "passed"      INTEGER NOT NULL DEFAULT 0,
    "total"       INTEGER NOT NULL DEFAULT 0,
    "score"       DOUBLE PRECISION,
    "max_score"   DOUBLE PRECISION,
    "accepted"    BOOLEAN NOT NULL DEFAULT false,
    "ms"          INTEGER,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_code_submission_user_exercise" ON "code_submissions"("user_id", "exercise_id", "created_at");
CREATE INDEX "idx_code_submission_exercise" ON "code_submissions"("exercise_id");

ALTER TABLE "code_submissions" ADD CONSTRAINT "code_submissions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "code_submissions" ADD CONSTRAINT "code_submissions_exercise_id_fkey"
  FOREIGN KEY ("exercise_id") REFERENCES "code_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
