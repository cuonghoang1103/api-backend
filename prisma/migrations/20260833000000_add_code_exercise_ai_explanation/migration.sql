-- Cached AI explanation for one exercise. Shared across readers (it describes
-- the assignment, not the reader), so the second visitor pays no tokens.
ALTER TABLE "code_exercises" ADD COLUMN "ai_explanation_json" JSONB;
ALTER TABLE "code_exercises" ADD COLUMN "ai_explained_at" TIMESTAMP(3);
