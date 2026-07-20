-- Tech Trends: AI news bulletin (additive only — nothing existing is dropped
-- or rewritten, so this is safe to apply to a production table that already
-- holds articles).

-- ─── tech_trend_articles: bulletin fields ────────────────────────────────
ALTER TABLE "tech_trend_articles"
  ADD COLUMN IF NOT EXISTS "kind"         VARCHAR(16) NOT NULL DEFAULT 'ARTICLE',
  ADD COLUMN IF NOT EXISTS "sources"      JSONB,
  ADD COLUMN IF NOT EXISTS "ai_generated" BOOLEAN     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "ai_model"     VARCHAR(80),
  ADD COLUMN IF NOT EXISTS "scheduled_at" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "idx_tech_trend_kind_feed"
  ON "tech_trend_articles" ("kind", "status", "published_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_tech_trend_scheduled_at"
  ON "tech_trend_articles" ("scheduled_at");

-- ─── news_feeds: registry of official RSS/Atom sources ───────────────────
CREATE TABLE IF NOT EXISTS "news_feeds" (
  "id"            SERIAL       PRIMARY KEY,
  "name"          VARCHAR(120) NOT NULL,
  "url"           VARCHAR(500) NOT NULL,
  "publisher"     VARCHAR(120) NOT NULL,
  "homepage"      VARCHAR(500),
  "topic"         VARCHAR(40),
  "weight"        INTEGER      NOT NULL DEFAULT 50,
  "is_active"     BOOLEAN      NOT NULL DEFAULT true,
  "last_fetch_at" TIMESTAMP(3),
  "last_error"    TEXT,
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "uk_news_feed_url" ON "news_feeds" ("url");
CREATE INDEX IF NOT EXISTS "idx_news_feed_active" ON "news_feeds" ("is_active");

-- ─── news_items: one entry pulled from a feed ────────────────────────────
CREATE TABLE IF NOT EXISTS "news_items" (
  "id"                 SERIAL        PRIMARY KEY,
  "feed_id"            INTEGER       NOT NULL,
  "title"              VARCHAR(500)  NOT NULL,
  "url"                VARCHAR(1000) NOT NULL,
  "url_hash"           VARCHAR(64)   NOT NULL,
  "summary"            TEXT,
  "author"             VARCHAR(200),
  "image_url"          VARCHAR(1000),
  "published_at"       TIMESTAMP(3),
  "fetched_at"         TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "used_in_article_id" INTEGER,
  "used_at"            TIMESTAMP(3),
  CONSTRAINT "fk_news_item_feed" FOREIGN KEY ("feed_id")
    REFERENCES "news_feeds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "uk_news_item_url_hash" ON "news_items" ("url_hash");
CREATE INDEX IF NOT EXISTS "idx_news_item_published_at" ON "news_items" ("published_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_news_item_used_in"      ON "news_items" ("used_in_article_id");
CREATE INDEX IF NOT EXISTS "idx_news_item_feed"         ON "news_items" ("feed_id");
