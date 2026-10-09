-- CTW K-2 (10/10/2026): họp — agenda có cấu trúc, RSVP, điểm danh, ghi âm có đồng ý, phiên âm, đề xuất biên bản AI.
-- Chỉ THÊM cột/bảng.

-- AlterTable
ALTER TABLE "work_meeting_attendees" ADD COLUMN     "attendance" VARCHAR(8),
ADD COLUMN     "attendance_source" VARCHAR(6),
ADD COLUMN     "invited" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "joined_at" TIMESTAMP(3),
ADD COLUMN     "left_at" TIMESTAMP(3),
ADD COLUMN     "marked_by_id" INTEGER,
ADD COLUMN     "rsvp" VARCHAR(8),
ADD COLUMN     "rsvp_at" TIMESTAMP(3),
ADD COLUMN     "rsvp_note" VARCHAR(300);

-- AlterTable
ALTER TABLE "work_meetings" ADD COLUMN     "agenda_items" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "recording_url" VARCHAR(500),
ADD COLUMN     "reminded_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "work_meeting_settings" (
    "project_id" INTEGER NOT NULL,
    "audio_retention_days" INTEGER NOT NULL DEFAULT 30,
    "stt_daily_limit" INTEGER,
    "reminder_minutes" INTEGER NOT NULL DEFAULT 10,
    "remind_in_chat" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_meeting_settings_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "work_meeting_recordings" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER NOT NULL,
    "started_by_id" INTEGER,
    "source" VARCHAR(8) NOT NULL DEFAULT 'LIVE',
    "status" VARCHAR(12) NOT NULL DEFAULT 'CONSENT',
    "file_name" VARCHAR(255),
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "audio_deleted_at" TIMESTAMP(3),
    "deleted_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_meeting_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_meeting_consents" (
    "id" SERIAL NOT NULL,
    "recording_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "decision" VARCHAR(8) NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_meeting_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_meeting_chunks" (
    "id" SERIAL NOT NULL,
    "recording_id" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL,
    "r2_key" VARCHAR(500),
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "start_ms" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "speaker_id" INTEGER,
    "uploader_id" INTEGER,
    "status" VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" VARCHAR(300),
    "text" TEXT,
    "segments" JSONB,
    "language" VARCHAR(12),
    "transcribed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_meeting_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_meeting_minutes_drafts" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER NOT NULL,
    "recording_id" INTEGER,
    "created_by_id" INTEGER,
    "status" VARCHAR(10) NOT NULL DEFAULT 'PROPOSED',
    "language" VARCHAR(8) NOT NULL DEFAULT 'vi',
    "content" JSONB NOT NULL,
    "model" VARCHAR(80),
    "decided_by_id" INTEGER,
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_meeting_minutes_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_meeting_rec_meeting" ON "work_meeting_recordings"("meeting_id");

-- CreateIndex
CREATE INDEX "idx_work_meeting_rec_expires" ON "work_meeting_recordings"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_meeting_consent" ON "work_meeting_consents"("recording_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_meeting_chunk_status" ON "work_meeting_chunks"("status", "transcribed_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_meeting_chunk" ON "work_meeting_chunks"("recording_id", "seq");

-- CreateIndex
CREATE INDEX "idx_work_meeting_minutes_draft" ON "work_meeting_minutes_drafts"("meeting_id", "created_at");

-- AddForeignKey
ALTER TABLE "work_meeting_settings" ADD CONSTRAINT "work_meeting_settings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_meeting_recordings" ADD CONSTRAINT "work_meeting_recordings_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "work_meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_meeting_consents" ADD CONSTRAINT "work_meeting_consents_recording_id_fkey" FOREIGN KEY ("recording_id") REFERENCES "work_meeting_recordings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_meeting_chunks" ADD CONSTRAINT "work_meeting_chunks_recording_id_fkey" FOREIGN KEY ("recording_id") REFERENCES "work_meeting_recordings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_meeting_minutes_drafts" ADD CONSTRAINT "work_meeting_minutes_drafts_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "work_meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
