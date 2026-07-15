-- CreateEnum
CREATE TYPE "CvMarket" AS ENUM ('VN', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "CvLanguage" AS ENUM ('VI', 'EN');

-- CreateEnum
CREATE TYPE "CvExperienceLevel" AS ENUM ('STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD');

-- CreateEnum
CREATE TYPE "CvType" AS ENUM ('INDUSTRY', 'ACADEMIC', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "CvItemKind" AS ENUM ('EXPERIENCE', 'PROJECT', 'EDUCATION', 'OPEN_SOURCE', 'PUBLICATION', 'AWARD', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "CvBulletStrength" AS ENUM ('WEAK', 'OK', 'STRONG');

-- CreateEnum
CREATE TYPE "CvSkillCategory" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'DATABASE', 'INFRA', 'TOOL', 'PRACTICE', 'SOFT');

-- CreateEnum
CREATE TYPE "CvEmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "CvDocumentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CvReviewMode" AS ENUM ('STATIC', 'AI');

-- CreateEnum
CREATE TYPE "CvReviewVerdict" AS ENUM ('INTERVIEW', 'MAYBE', 'REJECT');

-- CreateEnum
CREATE TYPE "CvImportSource" AS ENUM ('PDF', 'DOCX', 'GITHUB', 'LINKEDIN_ARCHIVE', 'JSON_RESUME', 'PASTE');

-- CreateEnum
CREATE TYPE "CvImportStatus" AS ENUM ('PENDING', 'PARSING', 'PARSED', 'COMMITTED', 'FAILED');

-- CreateEnum
CREATE TYPE "CvExportFormat" AS ENUM ('PDF', 'DOCX', 'TXT', 'MD', 'JSON');

-- CreateEnum
CREATE TYPE "CvExportStatus" AS ENUM ('PENDING', 'RENDERING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "CvCoverLetterTone" AS ENUM ('FORMAL', 'DIRECT', 'WARM');

-- CreateTable
CREATE TABLE "cv_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" VARCHAR(150),
    "headline" VARCHAR(200),
    "email" VARCHAR(150),
    "phone" VARCHAR(40),
    "location" VARCHAR(150),
    "links" JSONB NOT NULL DEFAULT '{}',
    "photo_r2_key" VARCHAR(300),
    "date_of_birth" TIMESTAMP(3),
    "summary" TEXT,
    "target_roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seniority" "CvExperienceLevel",
    "locations_pref" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "remote_pref" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_items" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "kind" "CvItemKind" NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "organization" VARCHAR(250),
    "location" VARCHAR(150),
    "employment_type" "CvEmploymentType",
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "url" VARCHAR(500),
    "tech_stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "context" TEXT,
    "gpa" VARCHAR(20),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_bullets" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "user_stated_facts" TEXT,
    "provenance" JSONB,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "metrics" JSONB,
    "skills_evidenced" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "strength" "CvBulletStrength" NOT NULL DEFAULT 'OK',
    "variants" JSONB NOT NULL DEFAULT '[]',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_bullets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_skills" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "CvSkillCategory" NOT NULL DEFAULT 'TOOL',
    "proficiency" VARCHAR(30),
    "years_used" DOUBLE PRECISION,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_certifications" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(200),
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "credential_id" VARCHAR(150),
    "url" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_language_skills" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "language" VARCHAR(60) NOT NULL,
    "proficiency" VARCHAR(60),
    "cert_name" VARCHAR(60),
    "cert_score" VARCHAR(40),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_language_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_documents" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "market" "CvMarket" NOT NULL DEFAULT 'VN',
    "language" "CvLanguage" NOT NULL DEFAULT 'VI',
    "experience_level" "CvExperienceLevel" NOT NULL DEFAULT 'JUNIOR',
    "cv_type" "CvType" NOT NULL DEFAULT 'INDUSTRY',
    "template_id" INTEGER,
    "target_job_id" INTEGER,
    "sectionOrder" JSONB NOT NULL DEFAULT '[]',
    "included_item_ids" JSONB NOT NULL DEFAULT '{}',
    "page_target" INTEGER NOT NULL DEFAULT 1,
    "include_photo" BOOLEAN NOT NULL DEFAULT false,
    "status" "CvDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "outcome_label" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_versions" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_job_targets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "company" VARCHAR(200),
    "source_url" VARCHAR(500),
    "raw_job_description" TEXT NOT NULL,
    "parsed_requirements" JSONB,
    "injection_attempted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_job_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_reviews" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mode" "CvReviewMode" NOT NULL DEFAULT 'STATIC',
    "verdict" "CvReviewVerdict",
    "score" INTEGER,
    "ats_score" INTEGER,
    "six_second_test" TEXT,
    "issues" JSONB NOT NULL DEFAULT '[]',
    "strengths" JSONB NOT NULL DEFAULT '[]',
    "interview_risks" JSONB NOT NULL DEFAULT '[]',
    "keyword_gaps" JSONB NOT NULL DEFAULT '[]',
    "job_target_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_templates" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(60) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "render_spec" JSONB NOT NULL DEFAULT '{}',
    "ats_safe" BOOLEAN NOT NULL DEFAULT true,
    "best_for" JSONB NOT NULL DEFAULT '{}',
    "preview_r2_key" VARCHAR(300),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_import_jobs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "source" "CvImportSource" NOT NULL,
    "status" "CvImportStatus" NOT NULL DEFAULT 'PENDING',
    "raw_content_r2_key" VARCHAR(300),
    "raw_text" TEXT,
    "parsed_result" JSONB,
    "confidence_flags" JSONB,
    "hidden_text_found" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "reviewed_by_user" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_github_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "repos" JSONB NOT NULL DEFAULT '[]',
    "language_profile" JSONB NOT NULL DEFAULT '{}',
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_github_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_cover_letters" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "job_target_id" INTEGER,
    "body" TEXT NOT NULL,
    "tone" "CvCoverLetterTone" NOT NULL DEFAULT 'DIRECT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_cover_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_suggestion_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bullet_id" INTEGER,
    "original" TEXT NOT NULL,
    "proposed" TEXT NOT NULL,
    "rationale" TEXT,
    "accepted" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_suggestion_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_exports" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "format" "CvExportFormat" NOT NULL,
    "status" "CvExportStatus" NOT NULL DEFAULT 'PENDING',
    "r2_key" VARCHAR(300),
    "file_name" VARCHAR(200),
    "round_trip_ok" BOOLEAN,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_llm_call_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "document_id" INTEGER,
    "task" VARCHAR(40) NOT NULL,
    "provider" VARCHAR(40) NOT NULL,
    "model" VARCHAR(80) NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_usd" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_llm_call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cv_profiles_user_id_key" ON "cv_profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_cv_items_profile_kind" ON "cv_items"("profile_id", "kind");

-- CreateIndex
CREATE INDEX "idx_cv_bullets_item" ON "cv_bullets"("item_id");

-- CreateIndex
CREATE INDEX "idx_cv_skills_profile" ON "cv_skills"("profile_id");

-- CreateIndex
CREATE INDEX "idx_cv_certs_profile" ON "cv_certifications"("profile_id");

-- CreateIndex
CREATE INDEX "idx_cv_langskills_profile" ON "cv_language_skills"("profile_id");

-- CreateIndex
CREATE INDEX "idx_cv_documents_user" ON "cv_documents"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_cv_documents_profile" ON "cv_documents"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "cv_versions_document_id_version_key" ON "cv_versions"("document_id", "version");

-- CreateIndex
CREATE INDEX "idx_cv_jobs_user" ON "cv_job_targets"("user_id");

-- CreateIndex
CREATE INDEX "idx_cv_reviews_document" ON "cv_reviews"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "cv_templates_key_key" ON "cv_templates"("key");

-- CreateIndex
CREATE INDEX "idx_cv_imports_user" ON "cv_import_jobs"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cv_github_profiles_user_id_key" ON "cv_github_profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_cv_coverletters_document" ON "cv_cover_letters"("document_id");

-- CreateIndex
CREATE INDEX "idx_cv_suggestions_user" ON "cv_suggestion_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_cv_exports_document" ON "cv_exports"("document_id");

-- CreateIndex
CREATE INDEX "idx_cv_llmlog_user" ON "cv_llm_call_logs"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "cv_items" ADD CONSTRAINT "cv_items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "cv_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_bullets" ADD CONSTRAINT "cv_bullets_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "cv_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_skills" ADD CONSTRAINT "cv_skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "cv_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_certifications" ADD CONSTRAINT "cv_certifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "cv_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_language_skills" ADD CONSTRAINT "cv_language_skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "cv_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_documents" ADD CONSTRAINT "cv_documents_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "cv_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_documents" ADD CONSTRAINT "cv_documents_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "cv_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_versions" ADD CONSTRAINT "cv_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "cv_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_reviews" ADD CONSTRAINT "cv_reviews_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "cv_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_cover_letters" ADD CONSTRAINT "cv_cover_letters_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "cv_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_exports" ADD CONSTRAINT "cv_exports_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "cv_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

