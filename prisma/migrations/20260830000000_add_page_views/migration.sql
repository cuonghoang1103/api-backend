-- Web analytics: page views. Additive only.
CREATE TABLE IF NOT EXISTS "page_views" (
  "id"         SERIAL       PRIMARY KEY,
  "path"       VARCHAR(500) NOT NULL,
  "title"      VARCHAR(300),
  "referrer"   VARCHAR(500),
  "session_id" VARCHAR(64)  NOT NULL,
  "user_id"    INTEGER,
  "device"     VARCHAR(16),
  "is_bot"     BOOLEAN      NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- The dashboard only ever asks three shapes of question: "what happened in this
-- time range", "which paths were hottest", "how many distinct sessions" — so
-- every index is time-leading.
CREATE INDEX IF NOT EXISTS "idx_pageview_created_at"  ON "page_views" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_pageview_path_time"   ON "page_views" ("path", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_pageview_session"     ON "page_views" ("session_id");
CREATE INDEX IF NOT EXISTS "idx_pageview_bot_time"    ON "page_views" ("is_bot", "created_at" DESC);
