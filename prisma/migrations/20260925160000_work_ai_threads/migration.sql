-- CT Work: hội thoại AI lưu ở server, dùng chung trong dự án. Thuần CREATE TABLE mới.
-- CreateTable
CREATE TABLE "work_ai_threads" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "title" VARCHAR(160) NOT NULL,
    "visibility" VARCHAR(12) NOT NULL DEFAULT 'PROJECT',
    "issue_number" INTEGER,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_ai_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_ai_messages" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "role" VARCHAR(12) NOT NULL,
    "author_id" INTEGER,
    "content" TEXT NOT NULL,
    "title" VARCHAR(120),
    "issue_number" INTEGER,
    "actions" JSONB,
    "error" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_ai_thread_project" ON "work_ai_threads"("project_id", "last_message_at");

-- CreateIndex
CREATE INDEX "idx_work_ai_message_thread" ON "work_ai_messages"("thread_id", "id");

-- AddForeignKey
ALTER TABLE "work_ai_threads" ADD CONSTRAINT "work_ai_threads_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_ai_threads" ADD CONSTRAINT "work_ai_threads_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_ai_messages" ADD CONSTRAINT "work_ai_messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "work_ai_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_ai_messages" ADD CONSTRAINT "work_ai_messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

