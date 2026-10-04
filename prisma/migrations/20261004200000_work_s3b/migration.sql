-- CT Work — QUẢN TRỊ DỰ ÁN đợt S3b (04/10/2026): CR (`changeRequests`), sổ RAID (`raid`), họp (`meetings`).
-- CHỈ THÊM: một cột nullable trên work_approvals (change_request_id, cho phê duyệt targetType CR)
-- + 8 bảng mới. Không UPDATE dữ liệu cũ nào ⇒ dự án có sẵn không có settings.modules.{changeRequests,
-- raid,meetings} ⇒ mô-đun TẮT, mọi route mới trả 403 MODULE_DISABLED, hành vi cũ y nguyên.
-- MỌI khoá ngoại mới đều DEFERRABLE INITIALLY DEFERRED (như S2a): khoá trỏ vào work_issues theo luật
-- 20260923131000_ct_work_issue_fk_deferred; khoá SET NULL (người, thẻ gốc, họp trước) bị xoá dây chuyền
-- theo dự án trong cùng câu lệnh — cùng bệnh đã gặp ở 20261004100000_work_studio_s1.

-- AlterTable
ALTER TABLE "work_approvals" ADD COLUMN     "change_request_id" INTEGER;

-- CreateTable
CREATE TABLE "work_change_requests" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
    "description_json" JSONB,
    "description_text" TEXT,
    "reason" TEXT,
    "urgency" VARCHAR(8) NOT NULL DEFAULT 'MEDIUM',
    "impact_scope" TEXT,
    "schedule_days" INTEGER,
    "cost_amount" DOUBLE PRECISION,
    "cost_currency" VARCHAR(16),
    "impact_risk" TEXT,
    "alternatives" TEXT,
    "client_visible" BOOLEAN NOT NULL DEFAULT false,
    "client_shared_at" TIMESTAMP(3),
    "requester_id" INTEGER,
    "owner_id" INTEGER,
    "created_by_id" INTEGER,
    "source_issue_id" INTEGER,
    "submitted_at" TIMESTAMP(3),
    "decided_at" TIMESTAMP(3),
    "implemented_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_change_request_links" (
    "id" SERIAL NOT NULL,
    "change_request_id" INTEGER NOT NULL,
    "role" VARCHAR(16) NOT NULL DEFAULT 'AFFECTED',
    "issue_id" INTEGER,
    "stage_id" INTEGER,
    "version_id" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_change_request_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_raid_items" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(60),
    "owner_id" INTEGER,
    "status" VARCHAR(16) NOT NULL,
    "probability" INTEGER,
    "impact" INTEGER,
    "response" VARCHAR(16),
    "mitigation" TEXT,
    "trigger" TEXT,
    "review_date" DATE,
    "review_notified_for" DATE,
    "created_by_id" INTEGER,
    "closed_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_raid_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_raid_links" (
    "id" SERIAL NOT NULL,
    "raid_id" INTEGER NOT NULL,
    "issue_id" INTEGER,
    "stage_id" INTEGER,
    "change_request_id" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_raid_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_raid_history" (
    "id" SERIAL NOT NULL,
    "raid_id" INTEGER NOT NULL,
    "actor_id" INTEGER,
    "field" VARCHAR(40) NOT NULL,
    "from_value" TEXT,
    "to_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_raid_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_meetings" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" VARCHAR(16) NOT NULL DEFAULT 'OTHER',
    "status" VARCHAR(16) NOT NULL DEFAULT 'SCHEDULED',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "location" VARCHAR(255),
    "meeting_url" VARCHAR(500),
    "agenda_json" JSONB,
    "agenda_text" TEXT,
    "minutes_json" JSONB,
    "minutes_text" TEXT,
    "decisions" JSONB NOT NULL DEFAULT '[]',
    "minutes_shared" BOOLEAN NOT NULL DEFAULT false,
    "minutes_shared_at" TIMESTAMP(3),
    "organizer_id" INTEGER,
    "previous_id" INTEGER,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_meeting_attendees" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_meeting_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_meeting_actions" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "text" VARCHAR(500) NOT NULL,
    "assignee_id" INTEGER,
    "due_date" DATE,
    "issue_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_meeting_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_cr_project" ON "work_change_requests"("project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_cr_number" ON "work_change_requests"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_cr_link_cr" ON "work_change_request_links"("change_request_id");

-- CreateIndex
CREATE INDEX "idx_work_cr_link_issue" ON "work_change_request_links"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_raid_project" ON "work_raid_items"("project_id", "type", "status");

-- CreateIndex
CREATE INDEX "idx_work_raid_review" ON "work_raid_items"("review_date");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_raid_number" ON "work_raid_items"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_raid_link_raid" ON "work_raid_links"("raid_id");

-- CreateIndex
CREATE INDEX "idx_work_raid_link_issue" ON "work_raid_links"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_raid_history" ON "work_raid_history"("raid_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_meeting_project" ON "work_meetings"("project_id", "starts_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_meeting_number" ON "work_meetings"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_meeting_attendee_user" ON "work_meeting_attendees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_meeting_attendee" ON "work_meeting_attendees"("meeting_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_meeting_action" ON "work_meeting_actions"("meeting_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_meeting_action_issue" ON "work_meeting_actions"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_approval_cr" ON "work_approvals"("change_request_id");

-- AddForeignKey
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_change_request_id_fkey" FOREIGN KEY ("change_request_id") REFERENCES "work_change_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_requests" ADD CONSTRAINT "work_change_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_requests" ADD CONSTRAINT "work_change_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_requests" ADD CONSTRAINT "work_change_requests_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_requests" ADD CONSTRAINT "work_change_requests_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_requests" ADD CONSTRAINT "work_change_requests_source_issue_id_fkey" FOREIGN KEY ("source_issue_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_request_links" ADD CONSTRAINT "work_change_request_links_change_request_id_fkey" FOREIGN KEY ("change_request_id") REFERENCES "work_change_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_request_links" ADD CONSTRAINT "work_change_request_links_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_request_links" ADD CONSTRAINT "work_change_request_links_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_request_links" ADD CONSTRAINT "work_change_request_links_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "work_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_change_request_links" ADD CONSTRAINT "work_change_request_links_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_items" ADD CONSTRAINT "work_raid_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_items" ADD CONSTRAINT "work_raid_items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_items" ADD CONSTRAINT "work_raid_items_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_links" ADD CONSTRAINT "work_raid_links_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "work_raid_items"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_links" ADD CONSTRAINT "work_raid_links_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_links" ADD CONSTRAINT "work_raid_links_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_links" ADD CONSTRAINT "work_raid_links_change_request_id_fkey" FOREIGN KEY ("change_request_id") REFERENCES "work_change_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_links" ADD CONSTRAINT "work_raid_links_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_history" ADD CONSTRAINT "work_raid_history_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "work_raid_items"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_raid_history" ADD CONSTRAINT "work_raid_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meetings" ADD CONSTRAINT "work_meetings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meetings" ADD CONSTRAINT "work_meetings_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meetings" ADD CONSTRAINT "work_meetings_previous_id_fkey" FOREIGN KEY ("previous_id") REFERENCES "work_meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meeting_attendees" ADD CONSTRAINT "work_meeting_attendees_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "work_meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meeting_attendees" ADD CONSTRAINT "work_meeting_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meeting_actions" ADD CONSTRAINT "work_meeting_actions_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "work_meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meeting_actions" ADD CONSTRAINT "work_meeting_actions_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_meeting_actions" ADD CONSTRAINT "work_meeting_actions_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

