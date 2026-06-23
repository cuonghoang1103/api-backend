-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "body_html" TEXT,
ADD COLUMN     "body_mdx" TEXT,
ADD COLUMN     "category" VARCHAR(80),
ADD COLUMN     "difficulty" VARCHAR(20),
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "schema_code" TEXT,
ADD COLUMN     "schema_lang" VARCHAR(40),
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "phase" VARCHAR(40) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date" DATE,
    "image_url" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_features" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PLANNED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_resources" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'LINK',
    "file_size" INTEGER,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_likes" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "ip_hash" VARCHAR(128) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_project_milestones_project_order" ON "project_milestones"("project_id", "order");

-- CreateIndex
CREATE INDEX "idx_project_features_project_order" ON "project_features"("project_id", "order");

-- CreateIndex
CREATE INDEX "idx_project_features_project_status" ON "project_features"("project_id", "status");

-- CreateIndex
CREATE INDEX "idx_project_resources_project_order" ON "project_resources"("project_id", "order");

-- CreateIndex
CREATE INDEX "idx_project_likes_project" ON "project_likes"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_likes_project_id_ip_hash_key" ON "project_likes"("project_id", "ip_hash");

-- CreateIndex
CREATE INDEX "idx_projects_category" ON "projects"("category");

-- CreateIndex
CREATE INDEX "idx_projects_difficulty" ON "projects"("difficulty");

-- CreateIndex
CREATE INDEX "idx_projects_is_published" ON "projects"("is_published");

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_features" ADD CONSTRAINT "project_features_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_resources" ADD CONSTRAINT "project_resources_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_likes" ADD CONSTRAINT "project_likes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
