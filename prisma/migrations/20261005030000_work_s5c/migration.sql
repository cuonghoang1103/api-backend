-- CT Work đợt S5c — nhập lại dự án từ ZIP xuất trọn. CHỈ THÊM một bảng, không đụng bảng cũ, không FK.
-- Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng `npx prisma migrate deploy`.

-- CreateTable
CREATE TABLE "work_project_imports" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "requested_by_id" INTEGER,
    "status" VARCHAR(16) NOT NULL DEFAULT 'UPLOADED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "stage" VARCHAR(120),
    "file_path" VARCHAR(500),
    "file_name" VARCHAR(200),
    "size" INTEGER,
    "source_key" VARCHAR(10),
    "source_name" VARCHAR(120),
    "project_key" VARCHAR(10),
    "project_name" VARCHAR(120),
    "project_id" INTEGER,
    "plan" JSONB,
    "result" JSONB,
    "error" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "work_project_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_import_workspace" ON "work_project_imports"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_import_status" ON "work_project_imports"("status");
