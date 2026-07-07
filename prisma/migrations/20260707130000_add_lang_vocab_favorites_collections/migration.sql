-- CreateTable
CREATE TABLE "lang_vocab_favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lang_vocab_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_vocab_collections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "icon" VARCHAR(16),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_vocab_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_vocab_collection_words" (
    "id" SERIAL NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lang_vocab_collection_words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_lang_vocab_fav_user" ON "lang_vocab_favorites"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_vocab_fav_user_word" ON "lang_vocab_favorites"("user_id", "word_id");

-- CreateIndex
CREATE INDEX "idx_lang_vocab_coll_user_lang" ON "lang_vocab_collections"("user_id", "language_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_vocab_coll_user_name" ON "lang_vocab_collections"("user_id", "language_id", "name");

-- CreateIndex
CREATE INDEX "idx_lang_vocab_coll_word_word" ON "lang_vocab_collection_words"("word_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_vocab_coll_word" ON "lang_vocab_collection_words"("collection_id", "word_id");

-- AddForeignKey
ALTER TABLE "lang_vocab_favorites" ADD CONSTRAINT "lang_vocab_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_favorites" ADD CONSTRAINT "lang_vocab_favorites_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "lang_vocab_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_collections" ADD CONSTRAINT "lang_vocab_collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_collections" ADD CONSTRAINT "lang_vocab_collections_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_collection_words" ADD CONSTRAINT "lang_vocab_collection_words_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "lang_vocab_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_vocab_collection_words" ADD CONSTRAINT "lang_vocab_collection_words_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "lang_vocab_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

