-- CT Work đợt 8c (12/10/2026): họp định kỳ RRULE (work_meeting_series + 4 cột work_meetings), phiên bản test case trên
-- run (T10), cycle CI tự đóng, phân tích tĩnh SARIF + độ phức tạp V(G) (T3/T4), ảnh Mermaid vẽ sẵn, ước lượng BA (R13),
-- transcript stakeholder AI (R28). CHỈ THÊM bảng/cột (cột mới đều NULL hoặc có DEFAULT) — không sửa/xoá dữ liệu cũ.

ALTER TABLE "work_elicitation_sessions" ADD COLUMN     "ai_persona_id" INTEGER,
ADD COLUMN     "ai_transcript" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "work_meetings" ADD COLUMN     "occurrence_date" VARCHAR(10),
ADD COLUMN     "series_detached" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "series_id" INTEGER,
ADD COLUMN     "template_key" VARCHAR(24);

ALTER TABLE "work_swr_settings" ADD COLUMN     "estimation" JSONB;

ALTER TABLE "work_test_cases" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "work_test_cycles" ADD COLUMN     "auto_close_minutes" INTEGER,
ADD COLUMN     "closed_reason" VARCHAR(8),
ADD COLUMN     "expected_jobs" INTEGER,
ADD COLUMN     "import_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_import_at" TIMESTAMP(3);

ALTER TABLE "work_test_runs" ADD COLUMN     "test_case_version" INTEGER;

CREATE TABLE "work_meeting_series" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" VARCHAR(16) NOT NULL DEFAULT 'OTHER',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "recurrence" JSONB NOT NULL,
    "rrule" VARCHAR(300) NOT NULL,
    "duration_min" INTEGER NOT NULL DEFAULT 60,
    "location" VARCHAR(255),
    "meeting_url" VARCHAR(500),
    "template_key" VARCHAR(24),
    "agenda_items" JSONB NOT NULL DEFAULT '[]',
    "agenda_json" JSONB,
    "attendee_ids" JSONB NOT NULL DEFAULT '[]',
    "exdates" JSONB NOT NULL DEFAULT '[]',
    "generated_until" VARCHAR(10),
    "organizer_id" INTEGER,
    "split_from_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "work_meeting_series_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_static_imports" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "kind" VARCHAR(12) NOT NULL,
    "tools" VARCHAR(200),
    "source" VARCHAR(8) NOT NULL DEFAULT 'API',
    "build" VARCHAR(80),
    "branch" VARCHAR(120),
    "commit_sha" VARCHAR(64),
    "total" INTEGER NOT NULL DEFAULT 0,
    "new_count" INTEGER NOT NULL DEFAULT 0,
    "fixed_count" INTEGER NOT NULL DEFAULT 0,
    "issues_made" INTEGER NOT NULL DEFAULT 0,
    "units" INTEGER NOT NULL DEFAULT 0,
    "token_id" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_static_imports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_static_findings" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "fingerprint" VARCHAR(64) NOT NULL,
    "tool" VARCHAR(80) NOT NULL,
    "rule_id" VARCHAR(200) NOT NULL,
    "level" VARCHAR(8) NOT NULL,
    "message" TEXT NOT NULL,
    "file" VARCHAR(500),
    "line" INTEGER,
    "help_uri" VARCHAR(500),
    "status" VARCHAR(8) NOT NULL DEFAULT 'OPEN',
    "issue_id" INTEGER,
    "seen_count" INTEGER NOT NULL DEFAULT 1,
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fixed_at" TIMESTAMP(3),
    "last_import_id" INTEGER,

    CONSTRAINT "work_static_findings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_code_complexity" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "unit_key" VARCHAR(64) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "file" VARCHAR(500),
    "line" INTEGER,
    "vg" INTEGER NOT NULL,
    "source" VARCHAR(12) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_code_complexity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_diagram_renders" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "svg" TEXT,
    "png" BYTEA,
    "width" INTEGER,
    "height" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_diagram_renders_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_meeting_series_project" ON "work_meeting_series"("project_id");

CREATE INDEX "idx_work_static_import_project" ON "work_static_imports"("project_id", "created_at");

CREATE INDEX "idx_work_static_finding_status" ON "work_static_findings"("project_id", "status");

CREATE UNIQUE INDEX "uk_work_static_finding" ON "work_static_findings"("project_id", "fingerprint");

CREATE INDEX "idx_work_code_complexity_vg" ON "work_code_complexity"("project_id", "vg");

CREATE UNIQUE INDEX "uk_work_code_complexity" ON "work_code_complexity"("project_id", "unit_key");

CREATE UNIQUE INDEX "uk_work_diagram_render" ON "work_diagram_renders"("project_id", "hash");

CREATE UNIQUE INDEX "uk_work_meeting_occurrence" ON "work_meetings"("series_id", "occurrence_date");

ALTER TABLE "work_meetings" ADD CONSTRAINT "work_meetings_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "work_meeting_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "work_meeting_series" ADD CONSTRAINT "work_meeting_series_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_static_imports" ADD CONSTRAINT "work_static_imports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_static_findings" ADD CONSTRAINT "work_static_findings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_code_complexity" ADD CONSTRAINT "work_code_complexity_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "work_diagram_renders" ADD CONSTRAINT "work_diagram_renders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
