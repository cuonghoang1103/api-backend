-- CreateTable
CREATE TABLE "interview_knowledge_documents" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "source_type" VARCHAR(30) NOT NULL DEFAULT 'ADMIN_WRITTEN',
    "topic_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "track_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "level" "InterviewLevel",
    "language" "InterviewLanguage" NOT NULL DEFAULT 'VI',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "source_url" TEXT,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_knowledge_chunks" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "heading_path" TEXT,
    "content" TEXT NOT NULL,
    "token_count" INTEGER NOT NULL DEFAULT 0,
    "topic_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "track_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "level" "InterviewLevel",
    "language" "InterviewLanguage" NOT NULL DEFAULT 'VI',
    "status" "InterviewContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_interview_kdoc_status" ON "interview_knowledge_documents"("status");

-- CreateIndex
CREATE INDEX "idx_interview_kchunk_doc" ON "interview_knowledge_chunks"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_knowledge_chunks_document_id_chunk_index_key" ON "interview_knowledge_chunks"("document_id", "chunk_index");

-- AddForeignKey
ALTER TABLE "interview_knowledge_chunks" ADD CONSTRAINT "interview_knowledge_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "interview_knowledge_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ── Full-text retrieval over knowledge chunks (Phase 6 RAG, lexical mode) ──
-- Mirrors interview_questions: a GENERATED STORED tsvector (config 'simple' —
-- Vietnamese has no stemmer) + GIN. content weighted above the heading path.
-- Queried via $queryRawUnsafe + websearch_to_tsquery('simple', …); the service
-- has an ILIKE fallback if the column is ever missing.
ALTER TABLE "interview_knowledge_chunks"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("content", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("heading_path", '')), 'B')
  ) STORED;

CREATE INDEX "idx_interview_kchunk_search" ON "interview_knowledge_chunks" USING GIN ("search_vector");

-- Topic-scoped retrieval (array overlap: topic_ids && ARRAY[...]).
CREATE INDEX "idx_interview_kchunk_topics" ON "interview_knowledge_chunks" USING GIN ("topic_ids");
CREATE INDEX "idx_interview_kchunk_scope" ON "interview_knowledge_chunks" ("status", "language");
