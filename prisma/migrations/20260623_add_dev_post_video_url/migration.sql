-- Add optional video_url column to dev_posts for custom video player support
ALTER TABLE "dev_posts" ADD COLUMN "video_url" VARCHAR(555);
