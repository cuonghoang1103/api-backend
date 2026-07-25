-- Add optional downloadable starter/"Given" file to exams (PE papers).
ALTER TABLE "exams" ADD COLUMN "attachment_url" VARCHAR(500);
ALTER TABLE "exams" ADD COLUMN "attachment_name" VARCHAR(200);
