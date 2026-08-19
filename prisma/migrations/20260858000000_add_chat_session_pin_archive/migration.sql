-- Ghim + lưu trữ cho cuộc trò chuyện AI Chat.
--
-- Viết TAY chứ không qua `prisma migrate dev`: migration
-- `20260706130000_add_music_and_profile` không replay được trên shadow DB
-- (P3006), nên `migrate dev` hỏng sẵn trong kho này. Áp bằng `migrate deploy`.
--
-- `IF NOT EXISTS` để chạy lại được: một deploy chết giữa chừng rồi chạy lại
-- không được phép đổ vì cột đã có.
ALTER TABLE "chat_sessions" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "chat_sessions" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMP(3);

-- Danh sách mặc định lọc "chưa lưu trữ" rồi sắp ghim lên đầu, nên index đi
-- theo đúng bộ ba đó.
CREATE INDEX IF NOT EXISTS "idx_chat_sessions_user_archived" ON "chat_sessions"("user_id", "archived_at", "pinned");
