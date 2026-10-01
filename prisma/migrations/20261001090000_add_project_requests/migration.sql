-- Phiếu yêu cầu dự án từ khách (/about/quy-trinh — "Nhận dự án") + liên kết dự án CT Work.
-- Viết tay: `prisma migrate dev` hỏng ở repo này (xem CLAUDE.md, P3006).
CREATE TABLE "project_requests" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(30),
    "organization" VARCHAR(200),
    "sender_role" VARCHAR(120),
    "product_types" TEXT[],
    "needs" TEXT NOT NULL,
    "business_goals" TEXT,
    "end_users" TEXT,
    "existing_systems" TEXT,
    "budget_range" VARCHAR(100),
    "desired_deadline" VARCHAR(100),
    "security_level" VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    "security_note" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_at" TIMESTAMP(3),
    "consent_version" VARCHAR(30),
    "source" VARCHAR(100),
    "ip" VARCHAR(64),
    "user_agent" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'NEW',
    "internal_note" TEXT,
    "work_project_id" INTEGER,
    "is_roleplay" BOOLEAN NOT NULL DEFAULT false,
    "status_changed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_project_request_code" ON "project_requests"("code");
CREATE UNIQUE INDEX "uk_project_request_work_project" ON "project_requests"("work_project_id");
CREATE INDEX "idx_project_request_status_created" ON "project_requests"("status", "created_at" DESC);

ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_work_project_id_fkey"
    FOREIGN KEY ("work_project_id") REFERENCES "work_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
