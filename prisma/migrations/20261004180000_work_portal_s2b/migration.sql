-- CT Work — CỔNG KHÁCH đợt S2b (04/10/2026, mô-đun `clientPortal`).
-- CHỈ THÊM: cột có mặc định an toàn + một bảng mới. Không UPDATE dữ liệu cũ:
--   * work_comments.visibility mặc định INTERNAL ⇒ mọi bình luận có sẵn là ghi chú nội bộ;
--     dự án bật cổng khách sau này cũng KHÔNG lộ bình luận cũ cho khách.
--   * work_issues.client_visible / work_attachments.client_visible mặc định false ⇒
--     không thẻ/tệp nào tự lộ cho khách.
-- Dự án không bật clientPortal không đọc các cột này (hành vi cũ y nguyên).
-- FK SET NULL của bảng studio mới là DEFERRABLE INITIALLY DEFERRED (như S1/S2a).

-- AlterTable
ALTER TABLE "work_comments" ADD COLUMN "visibility" VARCHAR(16) NOT NULL DEFAULT 'INTERNAL';

-- AlterTable
ALTER TABLE "work_issues" ADD COLUMN "client_visible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "client_shared_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "work_attachments" ADD COLUMN "client_visible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deliverable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "delivered_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "work_uat_requests" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "approval_id" INTEGER NOT NULL,
    "version_id" INTEGER,
    "stage_id" INTEGER,
    "round" INTEGER NOT NULL DEFAULT 1,
    "environment" VARCHAR(200),
    "build" VARCHAR(120),
    "item_issue_ids" JSONB NOT NULL DEFAULT '[]',
    "page_numbers" JSONB NOT NULL DEFAULT '[]',
    "attachment_ids" JSONB NOT NULL DEFAULT '[]',
    "conditions" TEXT,
    "created_issue_ids" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_uat_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_uat_approval" ON "work_uat_requests"("approval_id");

-- CreateIndex
CREATE INDEX "idx_work_uat_project" ON "work_uat_requests"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_issue_client" ON "work_issues"("project_id", "client_visible");

-- AddForeignKey
ALTER TABLE "work_uat_requests" ADD CONSTRAINT "work_uat_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_uat_requests" ADD CONSTRAINT "work_uat_requests_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "work_approvals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey (SET NULL — DEFERRABLE như các FK SET NULL khác của lớp studio)
ALTER TABLE "work_uat_requests" ADD CONSTRAINT "work_uat_requests_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "work_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey (SET NULL — DEFERRABLE)
ALTER TABLE "work_uat_requests" ADD CONSTRAINT "work_uat_requests_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
