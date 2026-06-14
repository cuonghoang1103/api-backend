-- ============================================================
-- Enable pgvector extension + add embedding column
--
-- Run this once after the app container is up and Prisma has
-- created the document_chunks table. Idempotent: safe to re-run.
--
-- The `vector(768)` type comes from the pgvector extension, which
-- isn't enabled by default. Prisma's `Unsupported("vector(768)")`
-- in schema.prisma tells Prisma to skip the column during
-- introspection, but the column is created/managed by this script.
-- ============================================================

-- 1. Enable the extension (idempotent)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add the embedding column if it doesn't already exist.
--    Using IF NOT EXISTS makes the migration safe to re-run.
ALTER TABLE document_chunks
  ADD COLUMN IF NOT EXISTS embedding vector(768);

-- 3. Create an HNSW index for fast cosine-similarity search.
--    HNSW (Hierarchical Navigable Small World) is faster than IVFFlat
--    for our small corpus (< 10K rows) and doesn't need training.
--    vector_cosine_ops = use cosine distance (1 - cos similarity)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops);
