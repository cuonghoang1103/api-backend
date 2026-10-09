-- CTW đợt 5b K-1 (10/10/2026): bình luận đầy đủ + voice note.
-- Viết tay (migrate dev vỡ ở shadow DB — xem CLAUDE.md). Chỉ THÊM: 3 cột null/mặc định, 1 bảng mới, chỉ mục, FK.
-- Không FK nào trỏ vào work_issues (luồng/tệp trỏ vào work_comments / work_page_comments / work_attachments).

-- Luồng trả lời một cấp (bình luận thẻ + bình luận trang)
ALTER TABLE "work_comments" ADD COLUMN "parent_id" INTEGER;
ALTER TABLE "work_page_comments" ADD COLUMN "parent_id" INTEGER;

-- Tệp / voice note trong bình luận
ALTER TABLE "work_attachments" ADD COLUMN "comment_id" INTEGER,
ADD COLUMN "for_comment" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "work_voice_notes" (
    "attachment_id" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "transcript_status" VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    "transcript" TEXT,
    "language" VARCHAR(12),
    "transcribed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_voice_notes_pkey" PRIMARY KEY ("attachment_id")
);

CREATE INDEX "idx_work_comment_parent" ON "work_comments"("parent_id");
CREATE INDEX "idx_work_page_comment_parent" ON "work_page_comments"("parent_id");
CREATE INDEX "idx_work_attachment_comment" ON "work_attachments"("comment_id");
CREATE INDEX "idx_work_voice_note_status" ON "work_voice_notes"("transcript_status", "transcribed_at");

ALTER TABLE "work_comments" ADD CONSTRAINT "work_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "work_page_comments" ADD CONSTRAINT "work_page_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_page_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "work_attachments" ADD CONSTRAINT "work_attachments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "work_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "work_voice_notes" ADD CONSTRAINT "work_voice_notes_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "work_attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
