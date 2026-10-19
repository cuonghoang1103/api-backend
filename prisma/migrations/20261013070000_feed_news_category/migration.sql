-- Mạng bản tin AI nhiều bot (11/10/2026): gắn MỘT kênh tin cho bài trên Bảng tin.
-- Viết tay theo `prisma migrate diff` (migrate dev hỏng P3006 trong repo này — xem CLAUDE.md).
-- Cột nullable + mặc định NULL ⇒ mọi bài cũ hợp lệ ngay, và mọi truy vấn feed KHÔNG lọc
-- newsCategory ("Tất cả") giữ nguyên hành vi hôm nay. Giá trị: claude·codex·gemini·antigravity·tech·ai-compare.

-- AlterTable
ALTER TABLE "social_posts" ADD COLUMN "news_category" VARCHAR(20);

-- CreateIndex
CREATE INDEX "idx_social_posts_newscat_created" ON "social_posts"("news_category", "created_at" DESC);
