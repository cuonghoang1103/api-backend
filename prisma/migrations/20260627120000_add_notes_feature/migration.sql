-- Notes feature: per-user study notebooks (Subjects > Chapters > Notes + attachments, links, vocab).
-- Additive only. The unrelated projects.search_vector drop from the schema diff is intentionally excluded
-- (search_vector is a raw-SQL tsvector column managed by 20260623120000_add_project_search_index).

-- CreateTable
CREATE TABLE "note_subjects" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "color" VARCHAR(20),
    "emoji" VARCHAR(20),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_chapters" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "chapter_id" INTEGER,
    "title" VARCHAR(300) NOT NULL DEFAULT 'Untitled',
    "content_json" JSONB,
    "content_html" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "needs_review" BOOLEAN NOT NULL DEFAULT false,
    "review_date" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_attachments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER,
    "chapter_id" INTEGER,
    "note_id" INTEGER,
    "fileName" VARCHAR(300) NOT NULL,
    "fileUrl" VARCHAR(2000) NOT NULL,
    "file_type" VARCHAR(150),
    "file_size_bytes" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_links" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER,
    "chapter_id" INTEGER,
    "note_id" INTEGER,
    "label" VARCHAR(500) NOT NULL,
    "url" VARCHAR(2000) NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'WEB',
    "thumbnail_url" VARCHAR(2000),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_vocab_entries" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "note_id" INTEGER NOT NULL,
    "term" VARCHAR(500) NOT NULL,
    "reading" VARCHAR(500),
    "meaning" TEXT,
    "example" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_vocab_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_note_subjects_user_sort" ON "note_subjects"("user_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_note_subjects_user_pinned" ON "note_subjects"("user_id", "is_pinned");

-- CreateIndex
CREATE INDEX "idx_note_chapters_user_subject" ON "note_chapters"("user_id", "subject_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_notes_user_tree" ON "notes"("user_id", "subject_id", "chapter_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_notes_user_recent" ON "notes"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "idx_notes_user_pinned" ON "notes"("user_id", "is_pinned");

-- CreateIndex
CREATE INDEX "idx_notes_user_archived" ON "notes"("user_id", "is_archived");

-- CreateIndex
CREATE INDEX "idx_note_attachments_note" ON "note_attachments"("user_id", "note_id");

-- CreateIndex
CREATE INDEX "idx_note_attachments_subject" ON "note_attachments"("user_id", "subject_id");

-- CreateIndex
CREATE INDEX "idx_note_links_note" ON "note_links"("user_id", "note_id");

-- CreateIndex
CREATE INDEX "idx_note_links_subject" ON "note_links"("user_id", "subject_id");

-- CreateIndex
CREATE INDEX "idx_note_vocab_note" ON "note_vocab_entries"("user_id", "note_id", "sort_order");

-- AddForeignKey
ALTER TABLE "note_subjects" ADD CONSTRAINT "note_subjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_chapters" ADD CONSTRAINT "note_chapters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_chapters" ADD CONSTRAINT "note_chapters_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "note_chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "note_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "note_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_vocab_entries" ADD CONSTRAINT "note_vocab_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_vocab_entries" ADD CONSTRAINT "note_vocab_entries_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

