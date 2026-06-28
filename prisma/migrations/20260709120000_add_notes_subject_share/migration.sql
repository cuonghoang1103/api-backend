-- Add notes subject sharing models (Phase 4)
-- This migration creates tables for sharing NoteSubjects (folders) with other users

-- Create note_subject_shares table
CREATE TABLE "note_subject_shares" (
    "id" SERIAL PRIMARY KEY,
    "subject_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "permission" VARCHAR(20) NOT NULL DEFAULT 'view',
    "note" VARCHAR(500),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE("subject_id", "recipient_id")
);

-- Create indexes for note_subject_shares
CREATE INDEX "idx_note_subject_share_owner" ON "note_subject_shares"("owner_id");
CREATE INDEX "idx_note_subject_share_recipient" ON "note_subject_shares"("recipient_id");

-- Create note_subject_share_recipients table (for tracking seen status)
CREATE TABLE "note_subject_share_recipients" (
    "id" SERIAL PRIMARY KEY,
    "share_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "seen_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE("share_id", "recipient_id")
);

-- Add foreign key constraints
ALTER TABLE "note_subject_shares" ADD CONSTRAINT "fk_note_subject_share_subject"
    FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE;
ALTER TABLE "note_subject_shares" ADD CONSTRAINT "fk_note_subject_share_owner"
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "note_subject_shares" ADD CONSTRAINT "fk_note_subject_share_recipient"
    FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "note_subject_share_recipients" ADD CONSTRAINT "fk_share_recipient_share"
    FOREIGN KEY ("share_id") REFERENCES "note_subject_shares"("id") ON DELETE CASCADE;
ALTER TABLE "note_subject_share_recipients" ADD CONSTRAINT "fk_share_recipient_subject"
    FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE;
ALTER TABLE "note_subject_share_recipients" ADD CONSTRAINT "fk_share_recipient_user"
    FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE;
