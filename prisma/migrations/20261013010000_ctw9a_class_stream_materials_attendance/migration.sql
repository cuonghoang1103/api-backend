-- CTW đợt 9a (13/10/2026) — LỚP HỌC: bảng tin (Stream), tài liệu lớp theo chủ đề/tuần, lịch lớp + điểm danh.
-- Viết tay (migrate dev vỡ P3006 trong repo này). Chỉ THÊM: cột mới của work_classes có mặc định, bảng mới, index, FK.

-- AlterTable
ALTER TABLE "work_classes" ADD COLUMN     "absence_threshold" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "late_after_min" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "stream_comments" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "work_class_posts" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "kind" VARCHAR(16) NOT NULL DEFAULT 'ANNOUNCEMENT',
    "title" VARCHAR(255),
    "body_json" JSONB,
    "body_text" TEXT,
    "links" JSONB NOT NULL DEFAULT '[]',
    "ref_type" VARCHAR(16),
    "ref_id" INTEGER,
    "url" VARCHAR(500),
    "audience_group_ids" JSONB NOT NULL DEFAULT '[]',
    "comments_off" BOOLEAN NOT NULL DEFAULT false,
    "pinned_at" TIMESTAMP(3),
    "publish_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "edited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "hidden_at" TIMESTAMP(3),
    "hidden_by_id" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_stream_files" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "uploader_id" INTEGER NOT NULL,
    "post_id" INTEGER,
    "material_id" INTEGER,
    "r2_key" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_stream_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_topics" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "week" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_materials" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "topic_id" INTEGER,
    "author_id" INTEGER,
    "kind" VARCHAR(12) NOT NULL DEFAULT 'FILE',
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "links" JSONB NOT NULL DEFAULT '[]',
    "position" INTEGER NOT NULL DEFAULT 0,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "work_class_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_material_views" (
    "id" SERIAL NOT NULL,
    "material_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_material_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_session_series" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "recurrence" JSONB NOT NULL,
    "rrule" VARCHAR(300) NOT NULL,
    "duration_min" INTEGER NOT NULL DEFAULT 90,
    "location" VARCHAR(255),
    "meeting_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_session_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_sessions" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "series_id" INTEGER,
    "occurrence_day" VARCHAR(10),
    "title" VARCHAR(120) NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255),
    "meeting_url" VARCHAR(500),
    "status" VARCHAR(12) NOT NULL DEFAULT 'SCHEDULED',
    "checkin_code" VARCHAR(6),
    "checkin_opened_at" TIMESTAMP(3),
    "checkin_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_class_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_attendance" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" VARCHAR(8) NOT NULL,
    "source" VARCHAR(8) NOT NULL DEFAULT 'MANUAL',
    "checked_in_at" TIMESTAMP(3),
    "marked_by_id" INTEGER,
    "note" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_class_calendar_items" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "kind" VARCHAR(12) NOT NULL DEFAULT 'DUE',
    "ref_type" VARCHAR(16) NOT NULL,
    "ref_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "url" VARCHAR(500),
    "audience_group_ids" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_class_calendar_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_class_post_class" ON "work_class_posts"("class_id", "published_at");

-- CreateIndex
CREATE INDEX "idx_work_class_post_due" ON "work_class_posts"("published_at", "publish_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_post_ref" ON "work_class_posts"("class_id", "ref_type", "ref_id");

-- CreateIndex
CREATE INDEX "idx_work_class_comment_post" ON "work_class_comments"("post_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_class_sfile_class" ON "work_class_stream_files"("class_id");

-- CreateIndex
CREATE INDEX "idx_work_class_sfile_post" ON "work_class_stream_files"("post_id");

-- CreateIndex
CREATE INDEX "idx_work_class_sfile_material" ON "work_class_stream_files"("material_id");

-- CreateIndex
CREATE INDEX "idx_work_class_topic_class" ON "work_class_topics"("class_id", "position");

-- CreateIndex
CREATE INDEX "idx_work_class_material_class" ON "work_class_materials"("class_id", "topic_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_material_view" ON "work_class_material_views"("material_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_class_series_class" ON "work_class_session_series"("class_id");

-- CreateIndex
CREATE INDEX "idx_work_class_session_class" ON "work_class_sessions"("class_id", "starts_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_session_occurrence" ON "work_class_sessions"("series_id", "occurrence_day");

-- CreateIndex
CREATE INDEX "idx_work_class_attendance_student" ON "work_class_attendance"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_attendance" ON "work_class_attendance"("session_id", "student_id");

-- CreateIndex
CREATE INDEX "idx_work_class_calendar_class" ON "work_class_calendar_items"("class_id", "starts_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_class_calendar_ref" ON "work_class_calendar_items"("class_id", "ref_type", "ref_id");

-- AddForeignKey
ALTER TABLE "work_class_posts" ADD CONSTRAINT "work_class_posts_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_posts" ADD CONSTRAINT "work_class_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_comments" ADD CONSTRAINT "work_class_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_class_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_comments" ADD CONSTRAINT "work_class_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_stream_files" ADD CONSTRAINT "work_class_stream_files_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_stream_files" ADD CONSTRAINT "work_class_stream_files_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_stream_files" ADD CONSTRAINT "work_class_stream_files_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "work_class_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_stream_files" ADD CONSTRAINT "work_class_stream_files_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "work_class_materials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_topics" ADD CONSTRAINT "work_class_topics_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_materials" ADD CONSTRAINT "work_class_materials_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_materials" ADD CONSTRAINT "work_class_materials_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "work_class_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_materials" ADD CONSTRAINT "work_class_materials_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_material_views" ADD CONSTRAINT "work_class_material_views_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "work_class_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_material_views" ADD CONSTRAINT "work_class_material_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_session_series" ADD CONSTRAINT "work_class_session_series_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_sessions" ADD CONSTRAINT "work_class_sessions_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_sessions" ADD CONSTRAINT "work_class_sessions_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "work_class_session_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_attendance" ADD CONSTRAINT "work_class_attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_class_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_attendance" ADD CONSTRAINT "work_class_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "work_class_students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_class_calendar_items" ADD CONSTRAINT "work_class_calendar_items_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "work_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
