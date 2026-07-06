-- Migration: add_my_language
-- Adds the "My Language" learning module: languages + 7 content sections,
-- per-user SRS progress + quiz results, and a raw-SQL tsvector for vocab search.
-- Fully additive (new tables + new enums only). No existing table is modified.

-- CreateEnum
-- CreateEnum
CREATE TYPE "lang_listening_source" AS ENUM ('UPLOAD', 'YOUTUBE');

-- CreateEnum
CREATE TYPE "lang_reading_type" AS ENUM ('IMAGE_LIST', 'TEXT');

-- CreateEnum
CREATE TYPE "lang_item_type" AS ENUM ('VOCAB', 'ALPHABET', 'GRAMMAR', 'LISTENING', 'CONVERSATION', 'READING', 'QNA');

-- CreateEnum
CREATE TYPE "lang_learn_status" AS ENUM ('NEW', 'LEARNING', 'REVIEWING', 'MASTERED');

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_en" VARCHAR(100) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "flag_emoji" VARCHAR(16) NOT NULL,
    "cover_url" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_alphabet_groups" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_alphabet_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_alphabet_items" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "character" VARCHAR(32) NOT NULL,
    "romanization" VARCHAR(64),
    "audio_url" VARCHAR(500),
    "image_url" VARCHAR(500),
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_alphabet_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_vocab_categories" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "icon" VARCHAR(64),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_vocab_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_vocab_words" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "meaning_vi" TEXT NOT NULL,
    "example_sentence" TEXT,
    "example_meaning" TEXT,
    "image_url" VARCHAR(500),
    "audio_url" VARCHAR(500),
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_vocab_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_vocab_pronunciations" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "type" VARCHAR(40) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lang_vocab_pronunciations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_grammar_points" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "level" VARCHAR(20),
    "title" VARCHAR(255) NOT NULL,
    "structure" TEXT NOT NULL,
    "explanation" JSONB,
    "examples" JSONB,
    "common_mistakes" TEXT,
    "compared_with" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_grammar_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_listening_items" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "source_type" "lang_listening_source" NOT NULL DEFAULT 'UPLOAD',
    "audio_url" VARCHAR(500),
    "youtube_url" VARCHAR(500),
    "transcript" TEXT,
    "translation" TEXT,
    "questions" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_listening_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_conversation_items" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "question_pronunciation" TEXT,
    "answer_pronunciation" TEXT,
    "meaning_vi" TEXT,
    "voice_url" VARCHAR(500),
    "image_url" VARCHAR(500),
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_conversation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_reading_articles" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "lang_reading_type" NOT NULL DEFAULT 'TEXT',
    "images" JSONB,
    "content" JSONB,
    "translation" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_reading_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_qna_items" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "pronunciation" TEXT,
    "meaning_vi" TEXT,
    "audio_url" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_qna_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_user_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "item_type" "lang_item_type" NOT NULL,
    "item_id" INTEGER NOT NULL,
    "status" "lang_learn_status" NOT NULL DEFAULT 'NEW',
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval_days" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "next_review_at" TIMESTAMP(3),
    "last_reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_quiz_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lang_quiz_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_language_code" ON "languages"("code");

-- CreateIndex
CREATE INDEX "idx_languages_active_order" ON "languages"("is_active", "order");

-- CreateIndex
CREATE INDEX "idx_lang_alphabet_groups_lang" ON "lang_alphabet_groups"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_alphabet_items_group" ON "lang_alphabet_items"("group_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_vocab_categories_lang" ON "lang_vocab_categories"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_vocab_words_category" ON "lang_vocab_words"("category_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_vocab_pron_word" ON "lang_vocab_pronunciations"("word_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_grammar_points_lang" ON "lang_grammar_points"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_listening_items_lang" ON "lang_listening_items"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_conversation_items_lang" ON "lang_conversation_items"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_reading_articles_lang" ON "lang_reading_articles"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_qna_items_lang" ON "lang_qna_items"("language_id", "order");

-- CreateIndex
CREATE INDEX "idx_lang_progress_user_due" ON "lang_user_progress"("user_id", "next_review_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_progress_user_item" ON "lang_user_progress"("user_id", "item_type", "item_id");

-- CreateIndex
CREATE INDEX "idx_lang_quiz_user_lang" ON "lang_quiz_results"("user_id", "language_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "lang_alphabet_groups" ADD CONSTRAINT "lang_alphabet_groups_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_alphabet_items" ADD CONSTRAINT "lang_alphabet_items_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "lang_alphabet_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_categories" ADD CONSTRAINT "lang_vocab_categories_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_words" ADD CONSTRAINT "lang_vocab_words_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "lang_vocab_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_pronunciations" ADD CONSTRAINT "lang_vocab_pronunciations_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "lang_vocab_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_grammar_points" ADD CONSTRAINT "lang_grammar_points_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_listening_items" ADD CONSTRAINT "lang_listening_items_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_conversation_items" ADD CONSTRAINT "lang_conversation_items_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_reading_articles" ADD CONSTRAINT "lang_reading_articles_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_qna_items" ADD CONSTRAINT "lang_qna_items_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_user_progress" ADD CONSTRAINT "lang_user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_quiz_results" ADD CONSTRAINT "lang_quiz_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_quiz_results" ADD CONSTRAINT "lang_quiz_results_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Full-text search on vocab words (raw-SQL generated tsvector + GIN index).
-- Not declared in schema.prisma (Prisma can't express it); queried via
-- $queryRawUnsafe + websearch_to_tsquery('simple', ...). Mirrors the projects module.
ALTER TABLE "lang_vocab_words"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("word", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("meaning_vi", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce("example_sentence", '')), 'C')
  ) STORED;

CREATE INDEX "idx_lang_vocab_words_search" ON "lang_vocab_words" USING GIN ("search_vector");
