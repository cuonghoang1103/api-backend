-- Migration: add_snippet_reactions
-- EXP_Hub comments + reactions — fully ADDITIVE: two new tables only.
-- SnippetComment already existed; here we add emoji reactions on snippets and
-- on comments (GitHub-style: several distinct emoji per user, each unique).
-- No existing table/column is altered → applies cleanly under history drift.

-- CreateTable
CREATE TABLE "snippet_reactions" (
    "id" SERIAL NOT NULL,
    "snippet_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snippet_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snippet_comment_reactions" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snippet_comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_snippet_reactions_snippet" ON "snippet_reactions"("snippet_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_snippet_reaction" ON "snippet_reactions"("snippet_id", "user_id", "emoji");

-- CreateIndex
CREATE INDEX "idx_snippet_comment_reactions_comment" ON "snippet_comment_reactions"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_snippet_comment_reaction" ON "snippet_comment_reactions"("comment_id", "user_id", "emoji");

-- AddForeignKey
ALTER TABLE "snippet_reactions" ADD CONSTRAINT "snippet_reactions_snippet_id_fkey" FOREIGN KEY ("snippet_id") REFERENCES "snippets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snippet_reactions" ADD CONSTRAINT "snippet_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snippet_comment_reactions" ADD CONSTRAINT "snippet_comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "snippet_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snippet_comment_reactions" ADD CONSTRAINT "snippet_comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
