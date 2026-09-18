-- Bảng kế hoạch chi tiết + điểm uy tín (18/09/2026)
--
-- ⚠️ VIẾT TAY, KHÔNG dùng `prisma migrate diff` chép thẳng.
-- `migrate dev` hỏng trong kho này (P3006 — xem CLAUDE.md), và bản diff
-- tự sinh còn kéo theo DRIFT có sẵn chẳng liên quan gì tới tính năng này:
-- nó đòi DROP hai chỉ mục HNSW của pgvector
-- (`idx_document_chunks_embedding_hnsw`, `idx_note_embeddings_vec`) và
-- đổi tên một loạt chỉ mục của bảng khác. Đẩy nguyên bản diff lên
-- production là giết tìm kiếm vector mà không ai yêu cầu.
-- Dưới đây CHỈ có phần thuộc về tính năng này.

-- ─── Điểm uy tín ────────────────────────────────────────────────
-- DEFAULT 100: mọi người dùng cũ khởi điểm ở mức được tin tưởng đầy
-- đủ. Không kẹp sàn 0 ở tầng DB — âm là trạng thái hợp lệ, xem chú
-- thích trong schema.
ALTER TABLE "dashboard_states"
  ADD COLUMN "uy_tin"          INTEGER NOT NULL DEFAULT 100,
  ADD COLUMN "cong_ngay"       VARCHAR(10),
  ADD COLUMN "cong_trong_ngay" INTEGER NOT NULL DEFAULT 0;

-- ─── Kế hoạch chi tiết cho từng việc ────────────────────────────
ALTER TABLE "dashboard_tasks"
  ADD COLUMN "do_kho"        INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "bat_dau_at"    TIMESTAMP(3),
  ADD COLUMN "phut_lam"      INTEGER,
  ADD COLUMN "truot_luc"     TIMESTAMP(3),
  ADD COLUMN "ly_do_truot"   TEXT,
  ADD COLUMN "da_tru_uy_tin" INTEGER,
  ADD COLUMN "canh_bao_luc"  TIMESTAMP(3),
  ADD COLUMN "so_lan_hoan"   INTEGER NOT NULL DEFAULT 0;

-- Quét việc quá hạn chưa chấm: chạy mỗi lần mở Tổng quan và mỗi vòng
-- dò nhắc, nên nó phải rẻ.
CREATE INDEX "idx_dashboard_tasks_truot"
  ON "dashboard_tasks" ("user_id", "truot_luc", "due_at");

-- ─── Sổ cái uy tín ──────────────────────────────────────────────
CREATE TABLE "dashboard_uy_tin_log" (
  "id"         SERIAL       NOT NULL,
  "user_id"    INTEGER      NOT NULL,
  "delta"      INTEGER      NOT NULL,
  "diem_sau"   INTEGER      NOT NULL,
  "loai"       VARCHAR(16)  NOT NULL,
  "ly_do"      VARCHAR(300) NOT NULL,
  "task_id"    INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "dashboard_uy_tin_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_uy_tin_log_user"
  ON "dashboard_uy_tin_log" ("user_id", "created_at");

-- ON DELETE SET NULL, KHÔNG phải CASCADE: xoá một việc thì dòng sổ vẫn
-- ở lại. Điểm đã trừ là chuyện đã xảy ra — cascade ở đây cho phép xoá
-- việc để tẩy trắng lịch sử uy tín.
ALTER TABLE "dashboard_uy_tin_log"
  ADD CONSTRAINT "dashboard_uy_tin_log_task_id_fkey"
  FOREIGN KEY ("task_id") REFERENCES "dashboard_tasks"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "dashboard_uy_tin_log"
  ADD CONSTRAINT "dashboard_uy_tin_log_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
