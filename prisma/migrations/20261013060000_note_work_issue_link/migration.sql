-- Ghi chú cá nhân (Notes) ↔ thẻ CT Work: liên kết HAI CHIỀU, chỉ THAM CHIẾU (không sao chép nội dung).
-- Viết tay theo `prisma migrate diff` (migrate dev hỏng P3006 trong repo này — xem CLAUDE.md).
-- Chỉ TẠO một bảng mới — không đụng bảng cũ.

-- CreateTable
CREATE TABLE "note_work_issue_links" (
    "id" SERIAL NOT NULL,
    "note_id" INTEGER NOT NULL,
    "work_issue_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_work_issue_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_note_work_issue_issue" ON "note_work_issue_links"("work_issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_note_work_issue" ON "note_work_issue_links"("note_id", "work_issue_id");

-- AddForeignKey
ALTER TABLE "note_work_issue_links" ADD CONSTRAINT "note_work_issue_links_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_work_issue_links" ADD CONSTRAINT "note_work_issue_links_work_issue_id_fkey" FOREIGN KEY ("work_issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
