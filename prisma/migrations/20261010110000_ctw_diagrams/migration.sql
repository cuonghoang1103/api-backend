-- CTW Diagram (10/10/2026): DIAGRAM STUDIO + AI VẼ SƠ ĐỒ — sơ đồ dự án (Mermaid/Excalidraw), phiên bản, bình luận.
-- CHỈ THÊM 3 bảng mới, không sửa/xoá gì đang có. Viết tay theo CLAUDE.md (migrate dev hỏng P3006) —
-- áp bằng `npx prisma migrate deploy`. Liên kết thẻ/UC/trang Docs là cột số KHÔNG FK (lọc khi đọc), chỉ FK tới dự án
-- (xoá dự án ⇒ xoá sơ đồ + phiên bản + bình luận theo dây chuyền).

-- CreateTable
CREATE TABLE "work_diagrams" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "format" VARCHAR(12) NOT NULL DEFAULT 'MERMAID',
    "diagram_type" VARCHAR(16) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "feature" VARCHAR(120),
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "current_version" INTEGER NOT NULL DEFAULT 1,
    "approved_version" INTEGER,
    "issue_id" INTEGER,
    "use_case_id" INTEGER,
    "page_number" INTEGER,
    "ai_model" VARCHAR(80),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_diagrams_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_diagram_versions" (
    "id" SERIAL NOT NULL,
    "diagram_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "note" VARCHAR(300),
    "state" VARCHAR(10) NOT NULL DEFAULT 'ACCEPTED',
    "origin" JSONB,
    "preview_image_id" INTEGER,
    "author_id" INTEGER,
    "ai_model" VARCHAR(80),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_diagram_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_diagram_comments" (
    "id" SERIAL NOT NULL,
    "diagram_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "parent_id" INTEGER,
    "version_number" INTEGER,
    "anchor" VARCHAR(160),
    "body" TEXT NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_diagram_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_diagram_type" ON "work_diagrams"("project_id", "diagram_type");

-- CreateIndex
CREATE INDEX "idx_work_diagram_use_case" ON "work_diagrams"("use_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_diagram_number" ON "work_diagrams"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_diagram_version" ON "work_diagram_versions"("diagram_id", "number");

-- CreateIndex
CREATE INDEX "idx_work_diagram_comment" ON "work_diagram_comments"("diagram_id", "created_at");

-- AddForeignKey
ALTER TABLE "work_diagrams" ADD CONSTRAINT "work_diagrams_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_diagram_versions" ADD CONSTRAINT "work_diagram_versions_diagram_id_fkey" FOREIGN KEY ("diagram_id") REFERENCES "work_diagrams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_diagram_comments" ADD CONSTRAINT "work_diagram_comments_diagram_id_fkey" FOREIGN KEY ("diagram_id") REFERENCES "work_diagrams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
