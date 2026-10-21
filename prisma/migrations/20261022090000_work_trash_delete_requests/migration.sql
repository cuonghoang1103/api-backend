-- CT Work 22/10/2026: thùng rác dữ liệu 30 ngày + yêu cầu xoá chờ trưởng nhóm duyệt.
-- Sự cố gốc: "Nhập Excel → Thay thế" xoá cứng cả bảng 5.1 (24 hàm) của nhóm SWT301, không đường lấy lại.

CREATE TABLE "work_trash" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "kind" VARCHAR(40) NOT NULL,
    "label" VARCHAR(300) NOT NULL,
    "item_count" INTEGER NOT NULL DEFAULT 1,
    "payload" JSONB NOT NULL,
    "source" VARCHAR(16) NOT NULL DEFAULT 'web',
    "request_id" INTEGER,
    "deleted_by_id" INTEGER,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "restored_at" TIMESTAMP(3),
    "restored_by_id" INTEGER,
    "restore_note" VARCHAR(500),

    CONSTRAINT "work_trash_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_delete_requests" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER,
    "class_id" INTEGER,
    "kind" VARCHAR(40) NOT NULL,
    "label" VARCHAR(300) NOT NULL,
    "item_count" INTEGER NOT NULL DEFAULT 1,
    "params" JSONB NOT NULL DEFAULT '{}',
    "file" BYTEA,
    "via" VARCHAR(16) NOT NULL,
    "ai_client" VARCHAR(16),
    "status" VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    "requested_by_id" INTEGER NOT NULL,
    "decided_by_id" INTEGER,
    "decided_at" TIMESTAMP(3),
    "decision_note" VARCHAR(500),
    "result" JSONB,
    "error" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_delete_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_trash_project" ON "work_trash"("project_id", "deleted_at");
CREATE INDEX "idx_work_trash_expires" ON "work_trash"("expires_at");
CREATE INDEX "idx_work_delete_req_project" ON "work_delete_requests"("project_id", "status", "created_at");
CREATE INDEX "idx_work_delete_req_class" ON "work_delete_requests"("class_id", "status");
CREATE INDEX "idx_work_delete_req_status" ON "work_delete_requests"("status", "expires_at");

ALTER TABLE "work_trash" ADD CONSTRAINT "work_trash_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_trash" ADD CONSTRAINT "work_trash_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "work_trash" ADD CONSTRAINT "work_trash_restored_by_id_fkey" FOREIGN KEY ("restored_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "work_delete_requests" ADD CONSTRAINT "work_delete_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_delete_requests" ADD CONSTRAINT "work_delete_requests_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_delete_requests" ADD CONSTRAINT "work_delete_requests_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
