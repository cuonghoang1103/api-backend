-- Migration: add_lang_notebook
-- Adds the per-user Language Notebook: nested folders + entries, scoped per
-- user + language. Fully additive (2 new tables only). No existing table is
-- modified.

-- CreateTable
CREATE TABLE "lang_notebook_folders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "name" VARCHAR(120) NOT NULL,
    "icon" VARCHAR(64),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_notebook_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_notebook_entries" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "folder_id" INTEGER,
    "kind" VARCHAR(32) NOT NULL DEFAULT 'note',
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "reading" VARCHAR(255),
    "meaning" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_notebook_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_lang_nb_folder_user" ON "lang_notebook_folders"("user_id", "language_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_lang_nb_entry_user" ON "lang_notebook_entries"("user_id", "language_id", "folder_id");

-- AddForeignKey
ALTER TABLE "lang_notebook_folders" ADD CONSTRAINT "lang_notebook_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_notebook_folders" ADD CONSTRAINT "lang_notebook_folders_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_notebook_folders" ADD CONSTRAINT "lang_notebook_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "lang_notebook_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_notebook_entries" ADD CONSTRAINT "lang_notebook_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_notebook_entries" ADD CONSTRAINT "lang_notebook_entries_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_notebook_entries" ADD CONSTRAINT "lang_notebook_entries_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "lang_notebook_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
