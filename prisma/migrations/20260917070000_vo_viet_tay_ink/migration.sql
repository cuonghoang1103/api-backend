-- Vở viết tay (iPad · PencilKit) — Đợt 2: đồng bộ cloud
--
-- MỘT TRANG GIẤY = MỘT `notes`. Nét vẽ KHÔNG vào Postgres: nó là tệp
-- PKDrawing trên R2, ở đây chỉ giữ con trỏ + số phiên bản để phát hiện
-- xung đột giữa hai máy.
--
-- ⚠️ Migration này viết TAY, không sinh bằng `prisma migrate dev` — shadow
-- database của kho này không replay được (migration
-- `20260706130000_add_music_and_profile` tạo UNIQUE rồi tạo INDEX trùng tên
-- ⇒ P3006). Áp bằng `npx prisma migrate deploy`.
--
-- Toàn bộ là THÊM: cột mới đều nullable hoặc có DEFAULT, nên bảng `notes`
-- (đang có dữ liệu thật trên production) không phải viết lại và không khoá
-- lâu. Ba ràng buộc UNIQUE đều trên cột nullable — Postgres cho phép nhiều
-- hàng NULL, nên mọi ghi chú/môn/chương đã có (client_id = NULL) không
-- vướng gì.

-- ─── notes: con trỏ tệp nét vẽ ───────────────────────────────────────────
ALTER TABLE "notes"
  ADD COLUMN IF NOT EXISTS "ink_key"          VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "ink_preview_key"  VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "ink_version"      INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "ink_stroke_count" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "ink_updated_at"   TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "paper_kind"       VARCHAR(24),
  ADD COLUMN IF NOT EXISTS "paper_orient"     VARCHAR(12),
  ADD COLUMN IF NOT EXISTS "client_id"        VARCHAR(64);

-- ─── note_subjects / note_chapters: khoá chống trùng khi đồng bộ ─────────
ALTER TABLE "note_subjects"
  ADD COLUMN IF NOT EXISTS "client_id" VARCHAR(64);

ALTER TABLE "note_chapters"
  ADD COLUMN IF NOT EXISTS "client_id"   VARCHAR(64),
  ADD COLUMN IF NOT EXISTS "cover_color" VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "paper_kind"  VARCHAR(24);

-- ─── Ràng buộc chống trùng ───────────────────────────────────────────────
-- Dựng bằng CREATE UNIQUE INDEX chứ không ADD CONSTRAINT: Prisma đọc cả hai
-- như nhau, còn `IF NOT EXISTS` chỉ có ở lệnh index — cần nó để migration
-- chạy lại được sau một lượt deploy đứt giữa chừng.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_note_client"
  ON "notes" ("user_id", "client_id");

CREATE UNIQUE INDEX IF NOT EXISTS "uk_note_subject_client"
  ON "note_subjects" ("user_id", "client_id");

CREATE UNIQUE INDEX IF NOT EXISTS "uk_note_chapter_client"
  ON "note_chapters" ("user_id", "client_id");

-- Đường nóng của lượt kéo về: "cho tôi mọi trang có nét vẽ của tôi, mới
-- nhất trước". Không có index này thì mỗi lần mở app là một seq scan trên
-- cả bảng `notes`.
CREATE INDEX IF NOT EXISTS "idx_notes_user_ink"
  ON "notes" ("user_id", "ink_updated_at" DESC)
  WHERE "ink_key" IS NOT NULL;
