-- Full-text search over interview_questions. Mirrors the Projects module:
-- a GENERATED STORED tsvector column + GIN index, config 'simple' (Vietnamese
-- has no built-in stemmer). Auto-maintained by Postgres. Queried via
-- $queryRawUnsafe + websearch_to_tsquery('simple', …), with an ILIKE fallback
-- in the service if the column is ever missing.
-- Only immutable plain-text columns go in the generated expression (body +
-- translations). `tags text[]` is searched via its own GIN array index below.
ALTER TABLE "interview_questions"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("body", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("body_vi", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("body_en", '')), 'B')
  ) STORED;

CREATE INDEX "idx_interview_questions_search" ON "interview_questions" USING GIN ("search_vector");

-- Tag filtering (array containment / overlap).
CREATE INDEX "idx_interview_questions_tags" ON "interview_questions" USING GIN ("tags");
