-- CT Work — TÀI LIỆU DỰ ÁN kiểu Confluence (đợt S2a, 04/10/2026), mô-đun `docs`.
-- CHỈ THÊM: một cột nullable trên work_approvals (page_id, cho phê duyệt targetType
-- DOC) + 4 bảng mới. Không UPDATE dữ liệu cũ nào ⇒ dự án có sẵn không có
-- settings.modules.docs ⇒ mô-đun TẮT, hành vi y như cũ.
-- MỌI khoá ngoại mới đều DEFERRABLE INITIALLY DEFERRED: bảng trỏ vào work_issues
-- (work_page_issue_links) theo luật 20260923131000_ct_work_issue_fk_deferred, còn
-- các khoá SET NULL (người, giai đoạn, trang cha) bị xoá dây chuyền theo dự án cùng
-- câu lệnh — cùng bệnh đã gặp ở 20261004100000_work_studio_s1.

-- AlterTable
ALTER TABLE "work_approvals" ADD COLUMN     "page_id" INTEGER;

-- CreateTable
CREATE TABLE "work_pages" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "content_json" JSONB,
    "content_text" TEXT,
    "status" VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
    "visibility" VARCHAR(16) NOT NULL DEFAULT 'INTERNAL',
    "owner_id" INTEGER,
    "last_edited_by_id" INTEGER,
    "template_key" VARCHAR(64),
    "stage_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

CONSTRAINT "work_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_page_versions" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "n" INTEGER NOT NULL,
    "kind" VARCHAR(16) NOT NULL DEFAULT 'EDIT',
    "title" VARCHAR(255) NOT NULL,
    "content_json" JSONB,
    "content_text" TEXT,
    "author_id" INTEGER,
    "note" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

CONSTRAINT "work_page_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_page_issue_links" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT "work_page_issue_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_page_comments" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "body_json" JSONB NOT NULL,
    "body_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

CONSTRAINT "work_page_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_page_tree" ON "work_pages"("project_id", "parent_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_page_stage" ON "work_pages"("stage_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_page_number" ON "work_pages"("project_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_page_version" ON "work_page_versions"("page_id", "n");

-- CreateIndex
CREATE INDEX "idx_work_page_issue_issue" ON "work_page_issue_links"("issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_page_issue" ON "work_page_issue_links"("page_id", "issue_id");

-- CreateIndex
CREATE INDEX "idx_work_page_comment_page" ON "work_page_comments"("page_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_approval_page" ON "work_approvals"("page_id");

-- AddForeignKey
ALTER TABLE "work_approvals" ADD CONSTRAINT "work_approvals_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_pages" ADD CONSTRAINT "work_pages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_pages" ADD CONSTRAINT "work_pages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_pages" ADD CONSTRAINT "work_pages_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_pages" ADD CONSTRAINT "work_pages_last_edited_by_id_fkey" FOREIGN KEY ("last_edited_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_pages" ADD CONSTRAINT "work_pages_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "work_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_versions" ADD CONSTRAINT "work_page_versions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_versions" ADD CONSTRAINT "work_page_versions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_issue_links" ADD CONSTRAINT "work_page_issue_links_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_issue_links" ADD CONSTRAINT "work_page_issue_links_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_issue_links" ADD CONSTRAINT "work_page_issue_links_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_comments" ADD CONSTRAINT "work_page_comments_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_page_comments" ADD CONSTRAINT "work_page_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
