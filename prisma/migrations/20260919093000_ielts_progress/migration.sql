-- Tiến độ học IELTS theo NGƯỜI (web đang để ở localStorage nên không đồng bộ).
CREATE TABLE IF NOT EXISTS "ielts_progress" (
  "id"         SERIAL       PRIMARY KEY,
  "user_id"    INTEGER      NOT NULL,
  "stage"      VARCHAR(12)  NOT NULL,
  "kind"       VARCHAR(24)  NOT NULL,
  "muc"        VARCHAR(120) NOT NULL,
  "xong"       BOOLEAN      NOT NULL DEFAULT true,
  "diem"       INTEGER,
  "ghiChu"     TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- App `upsert` theo bộ bốn này; thiếu UNIQUE thật thì `ON CONFLICT` không làm
-- gì và mỗi lần tích lại đẻ thêm một hàng.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_ielts_tien_do"
  ON "ielts_progress" ("user_id", "stage", "kind", "muc");
CREATE INDEX IF NOT EXISTS "idx_ielts_tien_do_user_stage"
  ON "ielts_progress" ("user_id", "stage");
