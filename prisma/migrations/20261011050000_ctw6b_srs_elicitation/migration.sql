-- CTW đợt 6b (11/10/2026) — SWR-3 "SRS chuyên sâu" + SWR-4 "Elicitation & stakeholder" (rà soát R1/R2/R3/R7/R10/R14/R15/R24/R28).
-- Viết tay (migrate dev vấp P3006 ở repo này — xem CLAUDE.md). CHỈ THÊM bảng mới, không đụng bảng cũ.
-- Khoá ngoại tới work_issues: DEFERRABLE INITIALLY DEFERRED (luật 20260923131000_ct_work_issue_fk_deferred).
-- Liên kết tới họp (meeting_id), sơ đồ (diagram_id), ảnh (image_id), người (…_by_id/user_id): KHÔNG FK (xoá mềm / lịch sử),
-- lọc khi đọc — như work_trace_links.

-- CreateTable
CREATE TABLE "work_stakeholders" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "role" VARCHAR(160),
    "organization" VARCHAR(160),
    "kind" VARCHAR(8) NOT NULL DEFAULT 'PERSON',
    "user_class" VARCHAR(120),
    "influence" INTEGER NOT NULL DEFAULT 3,
    "interest" INTEGER NOT NULL DEFAULT 3,
    "attitude" VARCHAR(10),
    "is_champion" BOOLEAN NOT NULL DEFAULT false,
    "decision_rights" TEXT,
    "major_value" TEXT,
    "interests" TEXT,
    "constraints" TEXT,
    "contact" VARCHAR(200),
    "notes" TEXT,
    "actor_id" INTEGER,
    "user_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_raci_activities" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_raci_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_raci_cells" (
    "activity_id" INTEGER NOT NULL,
    "stakeholder_id" INTEGER NOT NULL,
    "role" VARCHAR(1) NOT NULL,

    CONSTRAINT "work_raci_cells_pkey" PRIMARY KEY ("activity_id","stakeholder_id")
);

-- CreateTable
CREATE TABLE "work_elicitation_sessions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "technique" VARCHAR(20) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'PLANNED',
    "scheduled_at" TIMESTAMP(3),
    "duration_min" INTEGER,
    "location" VARCHAR(200),
    "objective" TEXT,
    "plan" TEXT,
    "questions" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "outcome" TEXT,
    "meeting_id" INTEGER,
    "survey_id" INTEGER,
    "ai_simulated" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" INTEGER,
    "rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_elicitation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_elicitation_participants" (
    "session_id" INTEGER NOT NULL,
    "stakeholder_id" INTEGER NOT NULL,
    "role_played" VARCHAR(120),

    CONSTRAINT "work_elicitation_participants_pkey" PRIMARY KEY ("session_id","stakeholder_id")
);

-- CreateTable
CREATE TABLE "work_req_proposals" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "text" TEXT,
    "req_type" VARCHAR(20) NOT NULL DEFAULT 'FUNCTIONAL',
    "priority" VARCHAR(8),
    "stakeholder_id" INTEGER,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "status" VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    "issue_id" INTEGER,
    "model" VARCHAR(80),
    "created_by_id" INTEGER,
    "decided_by_id" INTEGER,
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_req_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_requirement_origins" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "session_id" INTEGER,
    "stakeholder_id" INTEGER,
    "note" VARCHAR(300),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_requirement_origins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_surveys" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "session_id" INTEGER,
    "token" VARCHAR(48),
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "questions" JSONB NOT NULL DEFAULT '[]',
    "collect_name" BOOLEAN NOT NULL DEFAULT false,
    "closes_at" TIMESTAMP(3),
    "max_responses" INTEGER,
    "created_by_id" INTEGER,
    "rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_survey_responses" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "respondent_name" VARCHAR(120),
    "ip_hash" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_screen_mockups" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "screen_id" INTEGER NOT NULL,
    "kind" VARCHAR(8) NOT NULL,
    "image_id" INTEGER,
    "url" VARCHAR(1000),
    "provider" VARCHAR(16),
    "title" VARCHAR(200),
    "status" VARCHAR(12) NOT NULL DEFAULT 'DRAFT',
    "review_token" VARCHAR(48),
    "reviewer_name" VARCHAR(120),
    "reviewer_role" VARCHAR(10),
    "reviewed_by_id" INTEGER,
    "review_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_screen_mockups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_nfr_specs" (
    "issue_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "characteristic" VARCHAR(32) NOT NULL,
    "sub_characteristic" VARCHAR(48),
    "scale" TEXT NOT NULL,
    "meter" TEXT NOT NULL,
    "unit" VARCHAR(24),
    "comparator" VARCHAR(2) NOT NULL DEFAULT '<=',
    "must_value" DOUBLE PRECISION,
    "plan_value" DOUBLE PRECISION,
    "wish_value" DOUBLE PRECISION,
    "conditions" TEXT,
    "verification" VARCHAR(14) NOT NULL DEFAULT 'TEST',
    "updated_by_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_nfr_specs_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "work_req_quality" (
    "issue_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "manual" JSONB NOT NULL DEFAULT '{}',
    "ai_suggestion" JSONB,
    "ai_model" VARCHAR(80),
    "checked_by_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_req_quality_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "work_srs_models" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL,
    "subject" VARCHAR(160) NOT NULL DEFAULT '',
    "diagram_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_srs_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_stakeholder_number" ON "work_stakeholders"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_raci_activity" ON "work_raci_activities"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_raci_cell_stakeholder" ON "work_raci_cells"("stakeholder_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_elicitation_number" ON "work_elicitation_sessions"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_elicitation_participant_sh" ON "work_elicitation_participants"("stakeholder_id");

-- CreateIndex
CREATE INDEX "idx_work_req_proposal_session" ON "work_req_proposals"("session_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_requirement_origin_issue" ON "work_requirement_origins"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_requirement_origin_project" ON "work_requirement_origins"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_survey_number" ON "work_surveys"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_survey_token" ON "work_surveys"("token");

-- CreateIndex
CREATE INDEX "idx_work_survey_response_survey" ON "work_survey_responses"("survey_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_screen_mockup_screen" ON "work_screen_mockups"("screen_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_screen_mockup_token" ON "work_screen_mockups"("review_token");

-- CreateIndex
CREATE INDEX "idx_work_nfr_spec_project" ON "work_nfr_specs"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_req_quality_project" ON "work_req_quality"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_srs_model" ON "work_srs_models"("project_id", "kind", "subject");

-- AddForeignKey
ALTER TABLE "work_stakeholders" ADD CONSTRAINT "work_stakeholders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_raci_activities" ADD CONSTRAINT "work_raci_activities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_raci_cells" ADD CONSTRAINT "work_raci_cells_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "work_raci_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_raci_cells" ADD CONSTRAINT "work_raci_cells_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "work_stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_elicitation_sessions" ADD CONSTRAINT "work_elicitation_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_elicitation_participants" ADD CONSTRAINT "work_elicitation_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_elicitation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_elicitation_participants" ADD CONSTRAINT "work_elicitation_participants_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "work_stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_req_proposals" ADD CONSTRAINT "work_req_proposals_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_elicitation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_req_proposals" ADD CONSTRAINT "work_req_proposals_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "work_stakeholders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_requirement_origins" ADD CONSTRAINT "work_requirement_origins_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_requirement_origins" ADD CONSTRAINT "work_requirement_origins_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_elicitation_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_requirement_origins" ADD CONSTRAINT "work_requirement_origins_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "work_stakeholders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_surveys" ADD CONSTRAINT "work_surveys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_survey_responses" ADD CONSTRAINT "work_survey_responses_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "work_surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_screen_mockups" ADD CONSTRAINT "work_screen_mockups_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "work_srs_screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_nfr_specs" ADD CONSTRAINT "work_nfr_specs_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_req_quality" ADD CONSTRAINT "work_req_quality_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_srs_models" ADD CONSTRAINT "work_srs_models_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
