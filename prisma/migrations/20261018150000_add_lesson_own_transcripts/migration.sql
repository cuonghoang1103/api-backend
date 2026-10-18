-- Phụ đề của video RIÊNG (bài giảng tự dựng, phát từ R2) — bảng MỚI, tách khỏi
-- lesson_transcripts (phụ đề YouTube). Chỉ THÊM, không đụng bảng cũ.
CREATE TABLE "lesson_own_transcripts" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "track" VARCHAR(4) NOT NULL DEFAULT 'VI',
    "lang" VARCHAR(12) NOT NULL DEFAULT 'vi',
    "source" VARCHAR(16) NOT NULL DEFAULT 'r2',
    "video_url" TEXT NOT NULL,
    "cues" JSONB NOT NULL,
    "parts" JSONB NOT NULL,
    "so_cau" INTEGER NOT NULL,
    "so_tu" INTEGER NOT NULL,
    "duration_sec" DOUBLE PRECISION,
    "van_tay" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_own_transcripts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_lesson_own_transcript_track" ON "lesson_own_transcripts"("lesson_id", "track");

ALTER TABLE "lesson_own_transcripts" ADD CONSTRAINT "lesson_own_transcripts_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
