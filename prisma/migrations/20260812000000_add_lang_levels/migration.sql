-- Add a level tag (free-text convention: A1..C2 | N5..N1 | HSK1..HSK6) to the
-- My Language content tables that lacked one, so every section can be browsed
-- and deep-linked BY LEVEL (grammar already had `level`). Additive only.
-- Hand-written (prisma migrate dev is unusable here due to pre-existing drift).

ALTER TABLE "lang_vocab_categories" ADD COLUMN IF NOT EXISTS "level" VARCHAR(20);
ALTER TABLE "lang_conversation_items" ADD COLUMN IF NOT EXISTS "level" VARCHAR(20);
ALTER TABLE "lang_reading_articles" ADD COLUMN IF NOT EXISTS "level" VARCHAR(20);
ALTER TABLE "lang_qna_items" ADD COLUMN IF NOT EXISTS "level" VARCHAR(20);
ALTER TABLE "lang_listening_items" ADD COLUMN IF NOT EXISTS "level" VARCHAR(20);

CREATE INDEX IF NOT EXISTS "idx_lang_vocab_categories_level" ON "lang_vocab_categories" ("language_id", "level");
CREATE INDEX IF NOT EXISTS "idx_lang_conversation_level" ON "lang_conversation_items" ("language_id", "level");
CREATE INDEX IF NOT EXISTS "idx_lang_reading_level" ON "lang_reading_articles" ("language_id", "level");
CREATE INDEX IF NOT EXISTS "idx_lang_qna_level" ON "lang_qna_items" ("language_id", "level");
CREATE INDEX IF NOT EXISTS "idx_lang_listening_level" ON "lang_listening_items" ("language_id", "level");
