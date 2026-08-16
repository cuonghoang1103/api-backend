-- Nội dung DÙNG CHUNG giữa nhiều trang ghi chú ("synced block" của Notion).
--
-- Viết TAY chứ không phải `prisma migrate dev` sinh ra — migration
-- `20260706130000_add_music_and_profile` tạo một UNIQUE và một index TRÙNG
-- TÊN nên không bao giờ replay được trên shadow database (P3006). Xem
-- CLAUDE.md. Áp bằng `npx prisma migrate deploy`, rồi xác nhận không lệch
-- bằng `prisma migrate diff`.
--
-- KHÔNG có khoá ngoại tới `notes`: một khối được nhúng ở nhiều ghi chú, và
-- xoá một ghi chú không được kéo theo nội dung mà các ghi chú khác vẫn đang
-- hiển thị. Ràng buộc duy nhất là chủ sở hữu.

-- CreateTable
CREATE TABLE "note_synced_blocks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_synced_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_note_synced_blocks_user" ON "note_synced_blocks"("user_id", "updated_at" DESC);

-- AddForeignKey
ALTER TABLE "note_synced_blocks" ADD CONSTRAINT "note_synced_blocks_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
