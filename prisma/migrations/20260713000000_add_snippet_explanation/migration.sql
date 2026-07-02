-- Add explanation and youtube_url columns to snippets table
ALTER TABLE "snippets" ADD COLUMN "explanation" TEXT;
ALTER TABLE "snippets" ADD COLUMN "youtube_url" VARCHAR(500);
