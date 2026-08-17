-- Thư mục gom cuộc chat theo chủ đề.
--
-- ⚠️ Viết TAY, không dùng `prisma migrate dev`: migration
-- `20260706130000_add_music_and_profile` tạo một UNIQUE và một index TRÙNG TÊN
-- nên nó không bao giờ replay được trên shadow DB (P3006). Áp bằng
-- `prisma migrate deploy` — xem CLAUDE.md.

CREATE TABLE "chat_folders" (
    "id"         TEXT NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "ten"        VARCHAR(80) NOT NULL,
    "mau"        VARCHAR(16),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "chat_folders_pkey" PRIMARY KEY ("id")
);

-- Một người không có hai thư mục trùng tên.
CREATE UNIQUE INDEX "chat_folders_user_id_ten_key" ON "chat_folders"("user_id", "ten");
CREATE INDEX "idx_chat_folders_user" ON "chat_folders"("user_id");

ALTER TABLE "chat_folders"
  ADD CONSTRAINT "chat_folders_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Cột nối trên phiên chat. NULL = "Chưa phân loại".
ALTER TABLE "chat_sessions" ADD COLUMN "folder_id" TEXT;
CREATE INDEX "idx_chat_sessions_folder" ON "chat_sessions"("folder_id");

-- ⛔ ON DELETE SET NULL, KHÔNG phải CASCADE.
-- Xoá thư mục là dọn một cái NHÃN; xoá theo cả hội thoại bên trong là biến một
-- cú bấm thành mất hàng chục cuộc chat mà người dùng không hề định.
ALTER TABLE "chat_sessions"
  ADD CONSTRAINT "chat_sessions_folder_id_fkey"
  FOREIGN KEY ("folder_id") REFERENCES "chat_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
