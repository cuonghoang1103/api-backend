-- ─── Hộp thư admin ────────────────────────────────────────────────────────
-- Mọi việc cần admin biết đổ về MỘT bảng, thay vì nằm rải trong 43 mục sidebar.
-- Idempotent: viết tay và áp bằng `migrate deploy` (xem CLAUDE.md — `migrate
-- dev` hỏng sẵn trong kho này).

CREATE TABLE IF NOT EXISTS "admin_notifications" (
  "id"               SERIAL       PRIMARY KEY,
  "loai"             VARCHAR(32)  NOT NULL,
  "tieu_de"          VARCHAR(200) NOT NULL,
  "noi_dung"         TEXT,
  "duong_dan"        VARCHAR(300),
  "muc_do"           VARCHAR(16)  NOT NULL DEFAULT 'thuong',
  "user_id"          INTEGER,
  "entity_id"        INTEGER,
  "khoa_chong_trung" VARCHAR(120),
  "da_doc"           BOOLEAN      NOT NULL DEFAULT false,
  "doc_luc"          TIMESTAMP(3),
  "da_xu_ly"         BOOLEAN      NOT NULL DEFAULT false,
  "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Chặn trùng khi webhook thanh toán gọi lại nhiều lần. UNIQUE thật sự, không
-- phải `ON CONFLICT DO NOTHING` suông — đã có bài học: thiếu UNIQUE thì
-- ON CONFLICT im lặng vô tác dụng và dữ liệu nhân đôi.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_admin_notif_khoa"
  ON "admin_notifications"("khoa_chong_trung");

CREATE INDEX IF NOT EXISTS "idx_admin_notif_chua_doc"
  ON "admin_notifications"("da_doc", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_admin_notif_can_xu_ly"
  ON "admin_notifications"("muc_do", "da_xu_ly");
CREATE INDEX IF NOT EXISTS "idx_admin_notif_thoi_gian"
  ON "admin_notifications"("created_at" DESC);
