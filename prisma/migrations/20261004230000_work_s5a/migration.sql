-- CT Work — đợt S5a (04/10/2026): SERVICE DESK & SLA (mô-đun `serviceDesk`). CHỈ THÊM: 4 bảng mới, không cột
-- mới trên bảng cũ, không UPDATE dữ liệu cũ nào ⇒ dự án có sẵn không có settings.modules.serviceDesk ⇒ mô-đun TẮT,
-- route mới trả 403 MODULE_DISABLED; thẻ cũ không có dòng work_desk_tickets ⇒ không SLA, không gì đổi.
-- Ưu tiên P1–P4 nằm ở work_desk_tickets.priority — TÁCH khỏi work_issues.priority (1–5) để không đụng board/JQL/xuất.
-- Cột người KHÔNG FK tới users. MỌI khoá ngoại mới DEFERRABLE INITIALLY DEFERRED (FK trỏ work_issues và FK SET NULL —
-- luật của S1–S4: xoá dây chuyền theo dự án trong cùng câu lệnh).

-- CreateTable
CREATE TABLE "work_desk_settings" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "work_days" JSONB NOT NULL DEFAULT '[1,2,3,4,5]',
    "work_start" INTEGER NOT NULL DEFAULT 480,
    "work_end" INTEGER NOT NULL DEFAULT 1020,
    "holidays" JSONB NOT NULL DEFAULT '[]',
    "goals" JSONB NOT NULL DEFAULT '{}',
    "matrix" JSONB NOT NULL DEFAULT '{}',
    "request_types" JSONB NOT NULL DEFAULT '[]',
    "pause_status_ids" JSONB NOT NULL DEFAULT '[]',
    "response_status_ids" JSONB NOT NULL DEFAULT '[]',
    "at_risk_percent" INTEGER NOT NULL DEFAULT 75,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_desk_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_desk_tickets" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "request_type" VARCHAR(24) NOT NULL,
    "impact" VARCHAR(8) NOT NULL,
    "urgency" VARCHAR(8) NOT NULL,
    "priority" VARCHAR(2) NOT NULL,
    "channel" VARCHAR(8) NOT NULL DEFAULT 'STAFF',
    "requester_id" INTEGER,
    "fields" JSONB NOT NULL DEFAULT '{}',
    "waiting" BOOLEAN NOT NULL DEFAULT false,
    "waiting_since" TIMESTAMP(3),
    "status_before_wait" INTEGER,
    "first_response_at" TIMESTAMP(3),
    "first_response_by_id" INTEGER,
    "fr_status" VARCHAR(12) NOT NULL DEFAULT 'ON_TRACK',
    "res_status" VARCHAR(12) NOT NULL DEFAULT 'ON_TRACK',
    "fr_due_at" TIMESTAMP(3),
    "res_due_at" TIMESTAMP(3),
    "fr_breached_at" TIMESTAMP(3),
    "res_breached_at" TIMESTAMP(3),
    "fr_alert" INTEGER NOT NULL DEFAULT 0,
    "res_alert" INTEGER NOT NULL DEFAULT 0,
    "sla_checked_at" TIMESTAMP(3),
    "problem_id" INTEGER,
    "csat_requested_at" TIMESTAMP(3),
    "csat_rating" INTEGER,
    "csat_comment" TEXT,
    "csat_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_desk_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_sla_events" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "value" VARCHAR(32),
    "actor_id" INTEGER,
    "note" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT "work_sla_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_desk_problems" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(16) NOT NULL DEFAULT 'OPEN',
    "root_cause" TEXT,
    "workaround" TEXT,
    "owner_id" INTEGER,
    "postmortem_page_id" INTEGER,
    "created_by_id" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

CONSTRAINT "work_desk_problems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_desk_settings_project" ON "work_desk_settings"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_desk_ticket_issue" ON "work_desk_tickets"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_desk_ticket_problem" ON "work_desk_tickets"("problem_id");

-- CreateIndex
CREATE INDEX "idx_work_sla_event_ticket" ON "work_sla_events"("ticket_id", "at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_desk_problem_number" ON "work_desk_problems"("project_id", "number");

-- AddForeignKey
ALTER TABLE "work_desk_settings" ADD CONSTRAINT "work_desk_settings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_desk_tickets" ADD CONSTRAINT "work_desk_tickets_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_desk_tickets" ADD CONSTRAINT "work_desk_tickets_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "work_desk_problems"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_sla_events" ADD CONSTRAINT "work_sla_events_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "work_desk_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_desk_problems" ADD CONSTRAINT "work_desk_problems_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_desk_problems" ADD CONSTRAINT "work_desk_problems_postmortem_page_id_fkey" FOREIGN KEY ("postmortem_page_id") REFERENCES "work_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
