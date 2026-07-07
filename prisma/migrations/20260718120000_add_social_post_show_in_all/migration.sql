-- AlterTable
-- Composer checkbox "Hiện ở mục Tất cả" for VIDEO posts. Default true so
-- every existing row (and every non-video post) keeps today's behaviour.
ALTER TABLE "social_posts" ADD COLUMN "show_in_all" BOOLEAN NOT NULL DEFAULT true;
