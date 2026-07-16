-- Migration: add_lang_roadmap
-- Adds the per-language learning Roadmap: ordered stages + nodes that deep-link
-- into the existing section pages, plus a per-user manual "done" table.
-- Fully additive (2 new tables only). No existing table is modified.

-- CreateTable
CREATE TABLE "lang_roadmap_nodes" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "stage_label" VARCHAR(120) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "side" VARCHAR(10) NOT NULL DEFAULT 'center',
    "kind" VARCHAR(16) NOT NULL DEFAULT 'primary',
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "level" VARCHAR(20),
    "icon" VARCHAR(48),
    "description" TEXT,
    "link_type" VARCHAR(32),
    "link_ref" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_roadmap_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_roadmap_done" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "node_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lang_roadmap_done_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_lang_roadmap_lang" ON "lang_roadmap_nodes"("language_id", "stage", "order");

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_roadmap_done" ON "lang_roadmap_done"("user_id", "node_id");

-- CreateIndex
CREATE INDEX "idx_lang_roadmap_done_user" ON "lang_roadmap_done"("user_id");

-- AddForeignKey
ALTER TABLE "lang_roadmap_nodes" ADD CONSTRAINT "lang_roadmap_nodes_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_roadmap_done" ADD CONSTRAINT "lang_roadmap_done_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_roadmap_done" ADD CONSTRAINT "lang_roadmap_done_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "lang_roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
