-- CreateTable: standalone roadmap.sh-style learning paths (Role / Skill based).
CREATE TABLE "roadmaps" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "type" VARCHAR(10) NOT NULL DEFAULT 'role',
    "description" TEXT,
    "icon" VARCHAR(48),
    "color" VARCHAR(20),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(16) NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_roadmap_slug" ON "roadmaps"("slug");
CREATE INDEX "idx_roadmap_type_order" ON "roadmaps"("type", "sort_order");

CREATE TABLE "roadmap_nodes" (
    "id" SERIAL NOT NULL,
    "roadmap_id" INTEGER NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "stage_label" VARCHAR(120) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "side" VARCHAR(10) NOT NULL DEFAULT 'center',
    "kind" VARCHAR(16) NOT NULL DEFAULT 'primary',
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "icon" VARCHAR(48),
    "description" TEXT,
    "link_type" VARCHAR(32),
    "link_ref" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "roadmap_nodes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "idx_roadmap_node_order" ON "roadmap_nodes"("roadmap_id", "stage", "order");

CREATE TABLE "roadmap_done" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "node_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roadmap_done_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_roadmap_done" ON "roadmap_done"("user_id", "node_id");
CREATE INDEX "idx_roadmap_done_user" ON "roadmap_done"("user_id");

ALTER TABLE "roadmap_nodes" ADD CONSTRAINT "roadmap_nodes_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_done" ADD CONSTRAINT "roadmap_done_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_done" ADD CONSTRAINT "roadmap_done_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
