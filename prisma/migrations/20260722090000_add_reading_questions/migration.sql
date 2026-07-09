-- Reading comprehension Q&A: array of {kind:'mc'|'open', prompt, options?, correctIndex?, sampleAnswer?, explanation?}
ALTER TABLE "lang_reading_articles" ADD COLUMN "questions" JSONB;
