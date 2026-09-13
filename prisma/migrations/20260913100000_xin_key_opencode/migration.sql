-- ═══════════════════════════════════════════════════════════════════
-- Xin key OpenCode (cổng key con LLM) — 13/09/2026
--
-- Viết TAY (migrate dev hỏng trong repo này — xem CLAUDE.md).
-- Thuần THÊM MỚI: một bảng. Không xoá, không đổi kiểu, chạy lại an toàn.
-- ═══════════════════════════════════════════════════════════════════

-- CreateTable
CREATE TABLE IF NOT EXISTS "llm_key_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "key_value" VARCHAR(200),
    "key_hien" VARCHAR(40),
    "quota_usd" INTEGER,
    "admin_note" VARCHAR(500),
    "resolved_by" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llm_key_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_llm_key_req_status_created" ON "llm_key_requests"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_llm_key_req_user" ON "llm_key_requests"("user_id");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "llm_key_requests" ADD CONSTRAINT "llm_key_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
