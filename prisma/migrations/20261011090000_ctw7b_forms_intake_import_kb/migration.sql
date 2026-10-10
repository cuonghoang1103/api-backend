-- CTW đợt 7b (11/10/2026): Forms (C8) · kênh ngoài → đề xuất thẻ (C14/CTW-26) · nhập Trello/Asana/Jira/CSV (C15) · knowledge base (C21).
-- Viết tay từ migrate diff (chỉ lấy bảng của đợt này). Chỉ THÊM bảng — không đụng dữ liệu cũ.

CREATE TABLE "work_forms" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL DEFAULT '[]',
    "mapping" JSONB NOT NULL DEFAULT '{}',
    "access" VARCHAR(16) NOT NULL DEFAULT 'PUBLIC',
    "status" VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
    "token" VARCHAR(48),
    "confirm_message" VARCHAR(500),
    "collect_email" BOOLEAN NOT NULL DEFAULT false,
    "max_responses" INTEGER,
    "closes_at" TIMESTAMP(3),
    "rev" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_forms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_form_responses" (
    "id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "issue_id" INTEGER,
    "issue_number" INTEGER,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "user_id" INTEGER,
    "respondent_name" VARCHAR(120),
    "respondent_email" VARCHAR(200),
    "ip_hash" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_form_responses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_intake_channels" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "token" VARCHAR(48) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "secret_enc" TEXT,
    "created_by_id" INTEGER,
    "last_event_at" TIMESTAMP(3),
    "last_error" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_intake_channels_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_intake_proposals" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "channel_id" INTEGER,
    "source" VARCHAR(16) NOT NULL,
    "external_id" VARCHAR(200) NOT NULL,
    "sender_name" VARCHAR(160),
    "sender_handle" VARCHAR(200),
    "sender_user_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "meta" JSONB,
    "status" VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    "issue_id" INTEGER,
    "issue_number" INTEGER,
    "decided_by_id" INTEGER,
    "decided_at" TIMESTAMP(3),
    "decision_note" VARCHAR(300),
    "simulated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_intake_proposals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_intake_nonces" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "nonce" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_intake_nonces_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_import_records" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "source" VARCHAR(16) NOT NULL,
    "kind" VARCHAR(16) NOT NULL DEFAULT 'ISSUE',
    "external_id" VARCHAR(200) NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "run_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_import_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_import_runs" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "source" VARCHAR(16) NOT NULL,
    "file_name" VARCHAR(255),
    "created_by_id" INTEGER,
    "created" INTEGER NOT NULL DEFAULT 0,
    "duplicates" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "report" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_import_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_kb_categories" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" VARCHAR(300),
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_kb_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_kb_articles" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "page_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "audience" VARCHAR(16) NOT NULL DEFAULT 'CLIENT',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "keywords" VARCHAR(500),
    "views" INTEGER NOT NULL DEFAULT 0,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "not_helpful" INTEGER NOT NULL DEFAULT 0,
    "deflected" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_kb_articles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_kb_votes" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "helpful" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_kb_votes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_work_form_token" ON "work_forms"("token");

CREATE UNIQUE INDEX "uk_work_form_number" ON "work_forms"("project_id", "number");

CREATE INDEX "idx_work_form_response_form" ON "work_form_responses"("form_id", "created_at");

CREATE INDEX "idx_work_form_response_ip" ON "work_form_responses"("form_id", "ip_hash", "created_at");

CREATE UNIQUE INDEX "uk_work_intake_channel_token" ON "work_intake_channels"("token");

CREATE INDEX "idx_work_intake_channel_project" ON "work_intake_channels"("project_id");

CREATE INDEX "idx_work_intake_proposal_status" ON "work_intake_proposals"("project_id", "status", "created_at");

CREATE UNIQUE INDEX "uk_work_intake_proposal_ext" ON "work_intake_proposals"("project_id", "source", "external_id");

CREATE INDEX "idx_work_intake_nonce_created" ON "work_intake_nonces"("created_at");

CREATE UNIQUE INDEX "uk_work_intake_nonce" ON "work_intake_nonces"("channel_id", "nonce");

CREATE UNIQUE INDEX "uk_work_import_record" ON "work_import_records"("project_id", "source", "kind", "external_id");

CREATE INDEX "idx_work_import_run_project" ON "work_import_runs"("project_id", "created_at");

CREATE UNIQUE INDEX "uk_work_kb_category" ON "work_kb_categories"("project_id", "name");

CREATE UNIQUE INDEX "uk_work_kb_article_page" ON "work_kb_articles"("project_id", "page_id");

CREATE UNIQUE INDEX "uk_work_kb_vote" ON "work_kb_votes"("article_id", "user_id");

ALTER TABLE "work_forms" ADD CONSTRAINT "work_forms_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_form_responses" ADD CONSTRAINT "work_form_responses_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "work_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_intake_channels" ADD CONSTRAINT "work_intake_channels_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_intake_proposals" ADD CONSTRAINT "work_intake_proposals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_intake_proposals" ADD CONSTRAINT "work_intake_proposals_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "work_intake_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "work_intake_nonces" ADD CONSTRAINT "work_intake_nonces_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "work_intake_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_import_records" ADD CONSTRAINT "work_import_records_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_import_runs" ADD CONSTRAINT "work_import_runs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_kb_categories" ADD CONSTRAINT "work_kb_categories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_kb_articles" ADD CONSTRAINT "work_kb_articles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_kb_articles" ADD CONSTRAINT "work_kb_articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "work_kb_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "work_kb_votes" ADD CONSTRAINT "work_kb_votes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "work_kb_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
