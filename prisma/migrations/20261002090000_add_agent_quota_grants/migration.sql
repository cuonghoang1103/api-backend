-- KEY GIA HẠN hạn mức AI Code (02/10/2026): mỗi hàng = một lần nhập đúng key.
-- Viết tay: `prisma migrate dev` hỏng ở repo này (xem CLAUDE.md, P3006).
CREATE TABLE "agent_quota_grants" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "so_token" INTEGER NOT NULL,
    "phien_ban" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_quota_grants_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_agent_quota_grant_user_created" ON "agent_quota_grants"("user_id", "created_at");

ALTER TABLE "agent_quota_grants" ADD CONSTRAINT "agent_quota_grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
