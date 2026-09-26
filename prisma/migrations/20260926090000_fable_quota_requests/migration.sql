-- Xin thêm hạn mức model Cuong Fable 5 (claude-fable-5) trong AI Code.
-- Viết tay: `prisma migrate dev` hỏng ở repo này (xem CLAUDE.md, P3006).
CREATE TABLE "fable_quota_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "so_token" INTEGER,
    "admin_note" VARCHAR(500),
    "resolved_by" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fable_quota_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_fable_req_status_created" ON "fable_quota_requests"("status", "created_at" DESC);
CREATE INDEX "idx_fable_req_user_resolved" ON "fable_quota_requests"("user_id", "resolved_at");

ALTER TABLE "fable_quota_requests" ADD CONSTRAINT "fable_quota_requests_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
