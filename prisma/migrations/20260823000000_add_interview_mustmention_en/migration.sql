-- AlterTable
ALTER TABLE "interview_questions" ADD COLUMN "must_mention_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "should_mention_en" TEXT[] DEFAULT ARRAY[]::TEXT[];
