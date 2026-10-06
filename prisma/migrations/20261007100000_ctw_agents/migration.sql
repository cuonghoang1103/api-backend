-- CT Work — AI agent là thành viên hạng nhất (CTW-28/29/30/32/33, 06/10/2026). CHỈ THÊM — không sửa/xoá gì có sẵn.
-- Thiết kế: docs/ct-work-ai-agents-thiet-ke.md §2. Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng
-- `npx prisma migrate deploy`.
--
-- Lệch thiết kế (có chủ ý, để `migrate diff` sạch):
--   · "Mỗi thẻ một lease ACTIVE" dùng cột `active_issue_id` + UNIQUE thường (Postgres cho nhiều NULL) thay cho
--     partial unique index — Prisma không khai được partial index nên diff sẽ luôn đòi DROP nó.
--   · Bỏ `idx_user_kind` (partial) — không truy vấn nào lọc users theo kind; agent tra qua work_agents.

-- Người dùng: HUMAN (mặc định, mọi user hiện có) | AGENT
ALTER TABLE "users" ADD COLUMN "kind" VARCHAR(8) NOT NULL DEFAULT 'HUMAN';

-- Token: gắn agent + phạm vi dự án
ALTER TABLE "work_api_tokens" ADD COLUMN "agent_id" INTEGER,
ADD COLUMN "project_ids" JSONB NOT NULL DEFAULT '[]';

-- Worklog: nguồn (MANUAL | AGENT_AUTO)
ALTER TABLE "work_worklogs" ADD COLUMN "source" VARCHAR(10) NOT NULL DEFAULT 'MANUAL';

CREATE TABLE "work_agents" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "model" VARCHAR(80) NOT NULL,
    "role_text" VARCHAR(300),
    "capabilities" JSONB NOT NULL DEFAULT '{}',
    "runtime" VARCHAR(12) NOT NULL DEFAULT 'EXTERNAL',
    "status" VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    "parallel_slots" INTEGER NOT NULL DEFAULT 1,
    "daily_cost_cap_usd" DOUBLE PRECISION,
    "instructions" TEXT,
    "last_seen_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "retired_at" TIMESTAMP(3),

    CONSTRAINT "work_agents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_agent_leases" (
    "id" SERIAL NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "active_issue_id" INTEGER,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heartbeat_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "released_at" TIMESTAMP(3),
    "progress" VARCHAR(300),
    "progress_pct" INTEGER,

    CONSTRAINT "work_agent_leases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_agent_usage" (
    "id" SERIAL NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER,
    "run_id" INTEGER,
    "model" VARCHAR(80) NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "cache_read_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_usd" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "source" VARCHAR(10) NOT NULL,
    "note" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_agent_usage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_webhooks" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "agent_id" INTEGER,
    "url" VARCHAR(600) NOT NULL,
    "secret" VARCHAR(100) NOT NULL,
    "events" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" INTEGER,
    "last_sent_at" TIMESTAMP(3),
    "last_error" VARCHAR(300),
    "fail_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_webhooks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_agent_inbox" (
    "id" SERIAL NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER,
    "type" VARCHAR(32) NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acked_at" TIMESTAMP(3),
    "delivery" VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_try_at" TIMESTAMP(3),

    CONSTRAINT "work_agent_inbox_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_agent_runs" (
    "id" SERIAL NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "task" VARCHAR(24) NOT NULL,
    "status" VARCHAR(12) NOT NULL DEFAULT 'QUEUED',
    "requested_by_id" INTEGER NOT NULL,
    "input" JSONB NOT NULL DEFAULT '{}',
    "steps" JSONB NOT NULL DEFAULT '[]',
    "result_text" TEXT,
    "error" VARCHAR(500),
    "cost_usd" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_agent_runs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_work_agent_user" ON "work_agents"("user_id");
CREATE INDEX "idx_work_agent_ws" ON "work_agents"("workspace_id", "status");
CREATE INDEX "idx_work_agent_owner" ON "work_agents"("owner_id");
CREATE UNIQUE INDEX "uk_work_agent_lease_active" ON "work_agent_leases"("active_issue_id");
CREATE INDEX "idx_work_agent_lease_agent" ON "work_agent_leases"("agent_id", "status");
CREATE INDEX "idx_work_agent_lease_issue" ON "work_agent_leases"("issue_id");
CREATE INDEX "idx_work_agent_lease_expiry" ON "work_agent_leases"("status", "expires_at");
CREATE INDEX "idx_work_agent_usage_agent" ON "work_agent_usage"("agent_id", "created_at");
CREATE INDEX "idx_work_agent_usage_project" ON "work_agent_usage"("project_id", "created_at");
CREATE INDEX "idx_work_agent_usage_issue" ON "work_agent_usage"("issue_id");
CREATE INDEX "idx_work_webhook_ws" ON "work_webhooks"("workspace_id");
CREATE INDEX "idx_work_webhook_agent" ON "work_webhooks"("agent_id");
CREATE INDEX "idx_work_agent_inbox_agent" ON "work_agent_inbox"("agent_id", "id");
CREATE INDEX "idx_work_agent_inbox_delivery" ON "work_agent_inbox"("delivery", "next_try_at");
CREATE INDEX "idx_work_agent_run_issue" ON "work_agent_runs"("issue_id");
CREATE INDEX "idx_work_agent_run_status" ON "work_agent_runs"("status", "created_at");
CREATE INDEX "idx_work_api_token_agent" ON "work_api_tokens"("agent_id");

-- user_id DEFERRABLE như mọi FK Work trỏ users (xoá cascade có thể chạm một dòng hai lần trong cùng câu lệnh).
-- owner_id RESTRICT (không hoãn được — RESTRICT luôn kiểm ngay): xoá tài khoản người đang chịu trách nhiệm agent bị
-- chặn cho tới khi chuyển chủ / retire agent.
ALTER TABLE "work_agents" ADD CONSTRAINT "work_agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "work_agents" ADD CONSTRAINT "work_agents_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "work_agents" ADD CONSTRAINT "work_agents_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_api_tokens" ADD CONSTRAINT "work_api_tokens_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "work_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_agent_leases" ADD CONSTRAINT "work_agent_leases_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "work_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_agent_usage" ADD CONSTRAINT "work_agent_usage_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "work_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_webhooks" ADD CONSTRAINT "work_webhooks_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "work_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_agent_runs" ADD CONSTRAINT "work_agent_runs_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "work_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
