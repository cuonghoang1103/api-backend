-- CreateEnum
CREATE TYPE "InterviewLevel" AS ENUM ('INTERN', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL');

-- CreateEnum
CREATE TYPE "InterviewQuestionType" AS ENUM ('CONCEPTUAL', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'SCENARIO', 'MCQ');

-- CreateEnum
CREATE TYPE "InterviewQuestionSource" AS ENUM ('SEED', 'ADMIN', 'AI_GENERATED', 'IMPORTED');

-- CreateEnum
CREATE TYPE "InterviewContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InterviewSessionMode" AS ENUM ('TEXT', 'VOICE', 'CODING', 'SYSTEM_DESIGN');

-- CreateEnum
CREATE TYPE "InterviewEngineMode" AS ENUM ('STATIC', 'HYBRID', 'FULL_AI');

-- CreateEnum
CREATE TYPE "InterviewLanguage" AS ENUM ('VI', 'EN');

-- CreateEnum
CREATE TYPE "InterviewSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "InterviewHireRecommendation" AS ENUM ('STRONG_NO', 'NO', 'LEAN_NO', 'LEAN_YES', 'YES', 'STRONG_YES');

-- CreateEnum
CREATE TYPE "InterviewMasteryLevel" AS ENUM ('UNSEEN', 'SHAKY', 'LEARNING', 'SOLID', 'MASTERED');

-- CreateTable
CREATE TABLE "interview_domains" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "name_vi" VARCHAR(120),
    "description" TEXT,
    "icon" VARCHAR(60),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_tracks" (
    "id" SERIAL NOT NULL,
    "domain_id" INTEGER NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "name_vi" VARCHAR(150),
    "description" TEXT,
    "icon" VARCHAR(60),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_topics" (
    "id" SERIAL NOT NULL,
    "track_id" INTEGER NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "name_vi" VARCHAR(150),
    "weight" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_concepts" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_company_profiles" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "style_descriptor" TEXT NOT NULL,
    "rigor" INTEGER NOT NULL DEFAULT 3,
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_company_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_questions" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "concept_id" INTEGER,
    "level" "InterviewLevel" NOT NULL,
    "type" "InterviewQuestionType" NOT NULL DEFAULT 'CONCEPTUAL',
    "difficulty" INTEGER NOT NULL DEFAULT 3,
    "body" TEXT NOT NULL,
    "body_vi" TEXT,
    "body_en" TEXT,
    "reference_answer" TEXT,
    "rubric" JSONB NOT NULL DEFAULT '[]',
    "must_mention" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "should_mention" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "red_flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "synonyms" JSONB NOT NULL DEFAULT '{}',
    "mcq_options" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" "InterviewQuestionSource" NOT NULL DEFAULT 'SEED',
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'DRAFT',
    "rubric_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_question_versions" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "editor_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_question_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,
    "company_profile_id" INTEGER,
    "level" "InterviewLevel" NOT NULL,
    "mode" "InterviewSessionMode" NOT NULL DEFAULT 'TEXT',
    "engine_mode" "InterviewEngineMode" NOT NULL DEFAULT 'STATIC',
    "language" "InterviewLanguage" NOT NULL DEFAULT 'VI',
    "status" "InterviewSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "focused_mode" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_turns" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "question_id" INTEGER,
    "order" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "user_answer" TEXT,
    "self_score" JSONB,
    "deterministic_score" JSONB,
    "ai_follow_ups" JSONB,
    "turn_score" JSONB,
    "time_spent_ms" INTEGER,
    "integrity_signals" JSONB,
    "needs_review" BOOLEAN NOT NULL DEFAULT false,
    "injection_attempted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_turns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_reports" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "overall_score" DOUBLE PRECISION,
    "letter_grade" VARCHAR(2),
    "score_breakdown" JSONB NOT NULL DEFAULT '{}',
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weaknesses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "actionable_advice" TEXT,
    "suggested_resources" JSONB,
    "hire_recommendation" "InterviewHireRecommendation",
    "pdf_r2_key" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_review_cards" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "concept_id" INTEGER,
    "question_id" INTEGER,
    "source_session_id" INTEGER,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval_days" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "due_at" TIMESTAMP(3),
    "last_reviewed_at" TIMESTAMP(3),
    "mastery_level" "InterviewMasteryLevel" NOT NULL DEFAULT 'UNSEEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_review_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_prompt_templates" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "content" TEXT NOT NULL,
    "language" "InterviewLanguage" NOT NULL DEFAULT 'VI',
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_llm_call_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "session_id" INTEGER,
    "step" VARCHAR(40) NOT NULL,
    "provider" VARCHAR(40) NOT NULL,
    "model" VARCHAR(80) NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_usd" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_llm_call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_domains_slug_key" ON "interview_domains"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "interview_tracks_slug_key" ON "interview_tracks"("slug");

-- CreateIndex
CREATE INDEX "idx_interview_tracks_domain" ON "interview_tracks"("domain_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_topics_slug_key" ON "interview_topics"("slug");

-- CreateIndex
CREATE INDEX "idx_interview_topics_track" ON "interview_topics"("track_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_concepts_slug_key" ON "interview_concepts"("slug");

-- CreateIndex
CREATE INDEX "idx_interview_concepts_topic" ON "interview_concepts"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_company_profiles_slug_key" ON "interview_company_profiles"("slug");

-- CreateIndex
CREATE INDEX "idx_interview_questions_topic_level" ON "interview_questions"("topic_id", "level", "status");

-- CreateIndex
CREATE INDEX "idx_interview_questions_concept" ON "interview_questions"("concept_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_question_versions_question_id_version_key" ON "interview_question_versions"("question_id", "version");

-- CreateIndex
CREATE INDEX "idx_interview_sessions_user" ON "interview_sessions"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_interview_sessions_track" ON "interview_sessions"("track_id");

-- CreateIndex
CREATE INDEX "idx_interview_turns_question" ON "interview_turns"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_turns_session_id_order_key" ON "interview_turns"("session_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "interview_reports_session_id_key" ON "interview_reports"("session_id");

-- CreateIndex
CREATE INDEX "idx_interview_reviewcards_due" ON "interview_review_cards"("user_id", "due_at");

-- CreateIndex
CREATE INDEX "idx_interview_reviewcards_topic" ON "interview_review_cards"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_review_cards_user_id_concept_id_key" ON "interview_review_cards"("user_id", "concept_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_prompt_templates_key_version_key" ON "interview_prompt_templates"("key", "version");

-- CreateIndex
CREATE INDEX "idx_interview_llmlog_user" ON "interview_llm_call_logs"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "interview_tracks" ADD CONSTRAINT "interview_tracks_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "interview_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_topics" ADD CONSTRAINT "interview_topics_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "interview_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_concepts" ADD CONSTRAINT "interview_concepts_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "interview_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "interview_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "interview_concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_question_versions" ADD CONSTRAINT "interview_question_versions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "interview_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "interview_tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_company_profile_id_fkey" FOREIGN KEY ("company_profile_id") REFERENCES "interview_company_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_turns" ADD CONSTRAINT "interview_turns_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_turns" ADD CONSTRAINT "interview_turns_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "interview_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_reports" ADD CONSTRAINT "interview_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_review_cards" ADD CONSTRAINT "interview_review_cards_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "interview_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_review_cards" ADD CONSTRAINT "interview_review_cards_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "interview_concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_review_cards" ADD CONSTRAINT "interview_review_cards_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "interview_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

