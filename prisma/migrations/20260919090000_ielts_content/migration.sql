-- Nội dung IELTS phục vụ app. Bản SAO do scripts/ielts-seed.mjs dựng lại từ
-- các tệp TS của web; trang web không đọc bảng này.
--
-- Viết tay + `migrate deploy`: `migrate dev` không replay được trên kho này
-- (migration 20260706130000 dựng UNIQUE và INDEX trùng tên ⇒ P3006 trên
-- shadow DB). Xem CLAUDE.md.
CREATE TABLE IF NOT EXISTS "ielts_content" (
  "id"         SERIAL       PRIMARY KEY,
  "stage"      VARCHAR(12)  NOT NULL,
  "kind"       VARCHAR(24)  NOT NULL,
  "payload"    JSONB        NOT NULL,
  "so_muc"     INTEGER      NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seeder chạy `upsert` theo cặp này, nên nó phải là UNIQUE THẬT — không có
-- ràng buộc thì `ON CONFLICT` không làm gì cả và mỗi lần seed lại đẻ thêm
-- một bản trùng.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_ielts_stage_kind"
  ON "ielts_content" ("stage", "kind");
