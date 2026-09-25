-- CT Work: khoá chỉnh sửa cá nhân theo dự án. Thuần CREATE TABLE mới.
-- CreateTable
CREATE TABLE "work_edit_locks" (
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_edit_locks_pkey" PRIMARY KEY ("user_id","project_id")
);
-- AddForeignKey
ALTER TABLE "work_edit_locks" ADD CONSTRAINT "work_edit_locks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_edit_locks" ADD CONSTRAINT "work_edit_locks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

