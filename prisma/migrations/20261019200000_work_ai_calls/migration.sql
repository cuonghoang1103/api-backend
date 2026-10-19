-- CT Work đợt 8B (19/10/2026): sổ AI trong CT Work — lời gọi tool CT Work của AI (MCP/CuongMini/agent/Ask AI/agent dựng sẵn)
-- và lời gọi model của trợ lý AI web, gắn dự án + người + client. Đọc bởi trang "AI usage" (aiUsage.service.ts).
-- Viết tay: `prisma migrate dev` hỏng ở repo này (CLAUDE.md, P3006). Không FK (bảng sổ). Chỉ THÊM bảng.
CREATE TABLE "work_ai_calls" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client" VARCHAR(12) NOT NULL,
    "kind" VARCHAR(8) NOT NULL DEFAULT 'tool',
    "tool" VARCHAR(64) NOT NULL,
    "write" BOOLEAN NOT NULL DEFAULT false,
    "target" VARCHAR(40),
    "ok" BOOLEAN NOT NULL DEFAULT true,
    "error_code" VARCHAR(40),
    "model" VARCHAR(80),
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_usd" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_ai_calls_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_ai_calls_project" ON "work_ai_calls"("project_id", "created_at");
CREATE INDEX "idx_work_ai_calls_ws" ON "work_ai_calls"("workspace_id", "created_at");
CREATE INDEX "idx_work_ai_calls_user" ON "work_ai_calls"("user_id", "created_at");
