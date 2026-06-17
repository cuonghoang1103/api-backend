# Migration: 20260617_tech_trend_articles
# Date: 2026-06-17
#
# Adds the `tech_trend_articles` table backing the public
# /tech-trends page. The data model is intentionally simple:
#
#   - `category` is a varchar(20) holding one of:
#       'TechNews' | 'FixBug' | 'Experience' | 'Interviews'
#     We use a varchar instead of a Postgres ENUM so we can
#     add new categories via a single UPDATE if we ever need
#     a 5th bucket (e.g. 'CareerAdvice') without a destructive
#     ALTER TYPE migration.
#
#   - `body` is JSONB so the page can render arbitrary rich
#     content (paragraphs, code blocks, images, etc.) without
#     needing a schema change per content type. The frontend
#     `TechTrendsClient` already accepts a `body: string[]`
#     shape — stored here as JSON array, decoded on read.
#
#   - `code_block` is nullable JSONB, only set on #FixBug
#     posts. Shape: { before: {lang, lines:[]}, after: {...},
#     takeaway: string }.
#
#   - `tags` is text[] for cheap multi-tag filtering. The
#     public list endpoint does NOT use tags in its WHERE
#     clause (the client filters in-memory for the small
#     dataset size). If we ever cross 10k articles, swap in
#     a join table and a GIN index.
#
#   - `is_featured` controls the bento grid span on the
#     frontend (2-col vs 1-col). Admin toggles it via the
#     /admin/tech-trends UI.
#
#   - `trending_score` is a 0-100 score set by the admin.
#     The public sidebar sums (trending_score) per tag and
#     ranks the top 8 — this is the "Trending Tags" widget.
#
#   - `status` mirrors the existing blog `Post.status` pattern
#     (DRAFT | PUBLISHED). Public queries always filter
#     status = 'PUBLISHED'.
#
#   - `author_id` is nullable so deleting a user does not
#     cascade-delete the article (we'd rather keep the post
#     and just show "Anonymous" author on the card).
#
# Indexes are limited to the hot path: the public list query
# is `WHERE status = 'PUBLISHED' ORDER BY published_at DESC`,
# so the (status, published_at DESC) composite is the most
# valuable. The single-column indexes on category/is_featured
# support the admin-side filters and the sidebar aggregations.

-- ─── Table: tech_trend_articles ─────────────────────────────────
CREATE TABLE "tech_trend_articles" (
    "id"               SERIAL             NOT NULL,
    "title"            VARCHAR(255)       NOT NULL,
    "slug"             VARCHAR(255)       NOT NULL,
    "summary"          TEXT               NOT NULL,
    "body"             JSONB              NOT NULL,
    "category"         VARCHAR(20)        NOT NULL,
    "cover_emoji"      VARCHAR(16),
    "cover_image_url"  VARCHAR(500),
    "code_block"       JSONB,
    "tags"             TEXT[]             NOT NULL DEFAULT ARRAY[]::TEXT[],
    "trending_score"   INTEGER            NOT NULL DEFAULT 0,
    "is_featured"      BOOLEAN            NOT NULL DEFAULT false,
    "status"           VARCHAR(20)        NOT NULL DEFAULT 'DRAFT',
    "read_time_min"    INTEGER            NOT NULL DEFAULT 5,
    "author_id"        INTEGER,
    "view_count"       INTEGER            NOT NULL DEFAULT 0,
    "published_at"     TIMESTAMP(3),
    "created_at"       TIMESTAMP(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"       TIMESTAMP(3)       NOT NULL,

    CONSTRAINT "tech_trend_articles_pkey" PRIMARY KEY ("id")
);

-- Unique slug for SEO-friendly URLs (future /tech-trends/:slug)
CREATE UNIQUE INDEX "uk_tech_trend_slug" ON "tech_trend_articles"("slug");

-- Hot path: WHERE status = 'PUBLISHED' ORDER BY published_at DESC
CREATE INDEX "idx_tech_trend_status" ON "tech_trend_articles"("status");
CREATE INDEX "idx_tech_trend_published_at" ON "tech_trend_articles"("published_at" DESC);

-- Admin filters
CREATE INDEX "idx_tech_trend_category" ON "tech_trend_articles"("category");
CREATE INDEX "idx_tech_trend_featured" ON "tech_trend_articles"("is_featured");
CREATE INDEX "idx_tech_trend_author_id" ON "tech_trend_articles"("author_id");

-- FK to users (nullable; ON DELETE SET NULL keeps the article
-- alive even if the user is removed)
ALTER TABLE "tech_trend_articles"
    ADD CONSTRAINT "tech_trend_articles_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
