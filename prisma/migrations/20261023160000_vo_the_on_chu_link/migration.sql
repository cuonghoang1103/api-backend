-- Vở viết tay (23/10/2026): chữ nhận dạng để tìm trên web, link chỉ-xem một
-- trang, và thẻ ôn rút từ trang (tái dùng note_vocab_entries + lịch SM-2).
-- Viết tay theo CLAUDE.md (migrate dev hỏng P3006 trong repo này).

-- AlterTable
ALTER TABLE "notes" ADD COLUMN "ink_text" TEXT,
ADD COLUMN "ink_text_at" TIMESTAMP(3),
ADD COLUMN "ink_share_token" VARCHAR(48),
ADD COLUMN "ink_share_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "uk_notes_ink_share_token" ON "notes"("ink_share_token");

-- AlterTable
ALTER TABLE "note_vocab_entries" ADD COLUMN "kind" VARCHAR(16) NOT NULL DEFAULT 'VOCAB',
ADD COLUMN "client_id" VARCHAR(64),
ADD COLUMN "due_at" TIMESTAMP(3),
ADD COLUMN "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
ADD COLUMN "interval_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "repetitions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lapses" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "uk_note_vocab_client" ON "note_vocab_entries"("user_id", "client_id");

-- CreateIndex
CREATE INDEX "idx_note_vocab_due" ON "note_vocab_entries"("user_id", "due_at");
