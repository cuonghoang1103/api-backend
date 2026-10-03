-- CT Work — LỚP STUDIO đợt S1 (04/10/2026): loại dự án, bộ phận, giai đoạn + cổng,
-- phê duyệt, bàn giao, mã cũ của thẻ đã chuyển dự án.
-- CHỈ THÊM: một cột nullable trên work_projects (kind), hai cột nullable trên
-- work_issues (team_id, stage_id), bảng mới. Không UPDATE dữ liệu cũ nào ⇒ dự án
-- có sẵn giữ nguyên hành vi (mô-đun studio đọc từ settings.modules, không có = TẮT).
-- Mọi khoá ngoại NẰM TRÊN hoặc TRỎ VÀO work_issues đều DEFERRABLE INITIALLY
-- DEFERRED (lý do: 20260923131000_ct_work_issue_fk_deferred — xoá dự án dây chuyền).

-- AlterTable
ALTER TABLE "work_issues" ADD COLUMN     "stage_id" INTEGER,
ADD COLUMN     "team_id" INTEGER;

-- AlterTable
ALTER TABLE "work_projects" ADD COLUMN     "kind" VARCHAR(16);

-- CreateTable
CREATE TABLE "work_teams" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "key" VARCHAR(16) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "color" VARCHAR(16) NOT NULL DEFAULT '#64748b',
    "description" TEXT,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_team_members" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(16) NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_stages" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "n" INTEGER NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'NOT_STARTED',
    "gate_issue_id" INTEGER,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_approvals" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "target_type" VARCHAR(16) NOT NULL,
    "issue_id" INTEGER,
    "stage_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "mode" VARCHAR(16) NOT NULL DEFAULT 'SEQUENTIAL',
    "status" VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    "created_by_id" INTEGER,
    "due_at" TIMESTAMP(3),
    "content_hash" VARCHAR(64),
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_approval_steps" (
    "id" SERIAL NOT NULL,
    "approval_id" INTEGER NOT NULL,
    "approver_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "decision" VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "decided_at" TIMESTAMP(3),
    "ip" VARCHAR(64),
    "content_hash" VARCHAR(64),

    CONSTRAINT "work_approval_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_handoffs" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "from_team_id" INTEGER,
    "from_user_id" INTEGER,
    "to_team_id" INTEGER,
    "to_user_id" INTEGER,
    "checklist" JSONB NOT NULL DEFAULT '[]',
    "note" TEXT,
    "status" VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    "return_reason" TEXT,
    "created_by_id" INTEGER,
    "decided_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMP(3),

    CONSTRAINT "work_handoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_issue_aliases" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_issue_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_team_key" ON "work_teams"("workspace_id", "key");

-- CreateIndex
CREATE INDEX "idx_work_team_member_user" ON "work_team_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_team_member" ON "work_team_members"("team_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_stage_n" ON "work_stages"("project_id", "n");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_stage_slug" ON "work_stages"("project_id", "slug");

-- CreateIndex
CREATE INDEX "idx_work_approval_project" ON "work_approvals"("project_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_approval_issue" ON "work_approvals"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_approval_stage" ON "work_approvals"("stage_id");

-- CreateIndex
CREATE INDEX "idx_work_approval_step_approver" ON "work_approval_steps"("approver_id", "decision");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_approval_step" ON "work_approval_steps"("approval_id", "approver_id");

-- CreateIndex
CREATE INDEX "idx_work_handoff_issue" ON "work_handoffs"("issue_id");

-- CreateIndex
CREATE INDEX "idx_work_handoff_project" ON "work_handoffs"("project_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_handoff_to_team" ON "work_handoffs"("to_team_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_handoff_to_user" ON "work_handoffs"("to_user_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_issue_alias_issue" ON "work_issue_aliases"("issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_issue_alias" ON "work_issue_aliases"("project_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_issue_team" ON "work_issues"("team_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_stage" ON "work_issues"("stage_id");

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "work_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_issues" ADD CONSTRAINT "work_issues_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_teams" ADD CONSTRAINT "work_teams_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_team_members" ADD CONSTRAINT "work_team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "work_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_team_members" ADD CONSTRAINT "work_team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_stages" ADD CONSTRAINT "work_stages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_stages" ADD CONSTRAINT "work_stages_gate_issue_id_fkey" FOREIGN KEY ("gate_issue_id") REFERENCES "work_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_approval_steps" ADD CONSTRAINT "work_approval_steps_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "work_approvals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_approval_steps" ADD CONSTRAINT "work_approval_steps_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_from_team_id_fkey" FOREIGN KEY ("from_team_id") REFERENCES "work_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_to_team_id_fkey" FOREIGN KEY ("to_team_id") REFERENCES "work_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_handoffs" ADD CONSTRAINT "work_handoffs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_aliases" ADD CONSTRAINT "work_issue_aliases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_issue_aliases" ADD CONSTRAINT "work_issue_aliases_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- Hoãn kiểm thêm các khoá ngoại của bảng studio có cột SET NULL (người, bộ phận,
-- thẻ cổng) VÀ bị xoá dây chuyền theo dự án: xoá người/không gian có thể CẬP NHẬT
-- một dòng (SET NULL) rồi XOÁ chính dòng đó trong cùng câu lệnh ⇒ Postgres kiểm lại
-- khoá ngoại của dòng vừa cập nhật lúc dự án đã mất ⇒ "violates …_project_id_fkey".
-- Bắt được bằng test DB (work.studio.db.test.ts, bước dọn dữ liệu). Cùng bệnh với
-- 20260923131000_ct_work_issue_fk_deferred.
ALTER TABLE "work_stages" ALTER CONSTRAINT "work_stages_project_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_approvals" ALTER CONSTRAINT "work_approvals_project_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_approvals" ALTER CONSTRAINT "work_approvals_stage_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_approvals" ALTER CONSTRAINT "work_approvals_created_by_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_handoffs" ALTER CONSTRAINT "work_handoffs_project_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_handoffs" ALTER CONSTRAINT "work_handoffs_from_team_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_handoffs" ALTER CONSTRAINT "work_handoffs_to_team_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_handoffs" ALTER CONSTRAINT "work_handoffs_from_user_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_handoffs" ALTER CONSTRAINT "work_handoffs_to_user_id_fkey" DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_handoffs" ALTER CONSTRAINT "work_handoffs_created_by_id_fkey" DEFERRABLE INITIALLY DEFERRED;
