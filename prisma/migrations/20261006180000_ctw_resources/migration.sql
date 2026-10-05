-- CT Work — Resources (06/10/2026): thư viện link của dự án + Web links trên thẻ. CHỈ THÊM (3 bảng mới).
-- Viết tay theo CLAUDE.md (migrate dev hỏng P3006 ở repo này) — áp bằng npx prisma migrate deploy.
-- Mọi khoá ngoại trỏ vào work_issues / work_projects / bảng con cùng dự án đều DEFERRABLE INITIALLY DEFERRED (luật từ
-- 20260923131000_ct_work_issue_fk_deferred + S1): xoá dự án cascade có thể chạm một dòng hai lần trong cùng câu lệnh
-- (nhóm bị xoá ⇒ link SET NULL, rồi chính link bị xoá theo dự án) — kiểm ngay thì vỡ, hoãn tới commit thì sạch.

CREATE TABLE "work_resource_groups" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "icon" VARCHAR(16),
    "color" VARCHAR(16),
    "rank" INTEGER NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_resource_groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_resources" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "group_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "url" VARCHAR(2000) NOT NULL,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kind" VARCHAR(24) NOT NULL DEFAULT 'link',
    "favicon_url" VARCHAR(500),
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "pinned_to_sidebar" BOOLEAN NOT NULL DEFAULT false,
    "visibility" VARCHAR(8) NOT NULL DEFAULT 'TEAM',
    "rank" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "last_opened_at" TIMESTAMP(3),
    "open_count" INTEGER NOT NULL DEFAULT 0,
    "link_status" VARCHAR(8) NOT NULL DEFAULT 'UNKNOWN',
    "checked_at" TIMESTAMP(3),
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_resources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_issue_web_links" (
    "id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "resource_id" INTEGER,
    "url" VARCHAR(2000) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_issue_web_links_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_resource_group_project" ON "work_resource_groups"("project_id", "rank");

CREATE INDEX "idx_work_resource_project" ON "work_resources"("project_id", "group_id", "rank");

CREATE INDEX "idx_work_resource_checked" ON "work_resources"("checked_at");

CREATE INDEX "idx_work_issue_web_link_issue" ON "work_issue_web_links"("issue_id");

CREATE INDEX "idx_work_issue_web_link_resource" ON "work_issue_web_links"("resource_id");

ALTER TABLE "work_resource_groups" ADD CONSTRAINT "work_resource_groups_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "work_resources" ADD CONSTRAINT "work_resources_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "work_resources" ADD CONSTRAINT "work_resources_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "work_resource_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "work_issue_web_links" ADD CONSTRAINT "work_issue_web_links_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "work_issue_web_links" ADD CONSTRAINT "work_issue_web_links_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "work_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

