-- My Language — Han character (kanji/hanzi) writing practice.
--
-- Stroke paths are NOT stored: hanzi-writer-data already has all 9,575 chars and
-- is served from our own origin (the CSP blocks third-party CDNs). These tables
-- hold what that data cannot know — Vietnamese meaning, mnemonic, the admin's
-- illustrations, and how each learner is doing.
--
-- Fully additive: two new tables, no existing table touched.

CREATE TABLE IF NOT EXISTS "lang_hanzi_chars" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "char" VARCHAR(8) NOT NULL,
    "level" VARCHAR(20),
    "stroke_count" INTEGER,
    "onyomi" VARCHAR(120),
    "kunyomi" VARCHAR(120),
    "pinyin" VARCHAR(120),
    "meaning_vi" TEXT NOT NULL,
    "mnemonic" TEXT,
    "radical" VARCHAR(16),
    "breakdown" TEXT,
    "examples" JSONB NOT NULL DEFAULT '[]',
    "images" JSONB NOT NULL DEFAULT '[]',
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_hanzi_chars_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "lang_hanzi_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "char_id" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "mistakes" INTEGER NOT NULL DEFAULT 0,
    "best_mistakes" INTEGER,
    "learned" BOOLEAN NOT NULL DEFAULT false,
    "last_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lang_hanzi_progress_pkey" PRIMARY KEY ("id")
);

-- One row per character per language: a re-run of the seed must never double up.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_lang_hanzi_lang_char" ON "lang_hanzi_chars" ("language_id", "char");
CREATE INDEX IF NOT EXISTS "idx_lang_hanzi_lang_level" ON "lang_hanzi_chars" ("language_id", "level", "order");
CREATE UNIQUE INDEX IF NOT EXISTS "uk_lang_hanzi_progress" ON "lang_hanzi_progress" ("user_id", "char_id");
CREATE INDEX IF NOT EXISTS "idx_lang_hanzi_progress_user" ON "lang_hanzi_progress" ("user_id", "last_at");

-- Deleting a language takes its characters; deleting a character takes the
-- progress rows that point at it. user_id deliberately has NO FK — the whole
-- My Language module keeps user references loose.
ALTER TABLE "lang_hanzi_chars" ADD CONSTRAINT "lang_hanzi_chars_language_id_fkey"
    FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lang_hanzi_progress" ADD CONSTRAINT "lang_hanzi_progress_char_id_fkey"
    FOREIGN KEY ("char_id") REFERENCES "lang_hanzi_chars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
