# Migration: add github_repo_hub
# Date: 2026-06-16
#
# Adds 3 objects for the GitHub Repo Hub & Feed feature:
#
#   1. enum `github_repo_status` (DRAFT, PUBLISHED) for the
#      staging → published workflow.
#
#   2. table `github_repos` — the curated list. UUID primary key
#      so the public-facing API can return opaque IDs without
#      leaking the row count. Unique on `url` prevents duplicate
#      inserts when the admin re-submits the same repo or when
#      `fetch-starred` overlaps with a manual add. The composite
#      index `(status, created_at DESC)` is the hot path for the
#      public feed query.
#
#   3. join table `github_repo_tags` — many-to-many to the
#      existing `tags` table. We reuse the blog tag taxonomy
#      so topics like "Backend", "Payment", "Clean Architecture"
#      can be shared across the blog and the repo feed.
#
# All FKs use ON DELETE CASCADE because deleting a tag or a
# repo entry should also clean up the join rows (no orphans).

# ─── 1. enum ─────────────────────────────────────────────────────
CREATE TYPE "github_repo_status" AS ENUM ('DRAFT', 'PUBLISHED');

# ─── 2. github_repos ─────────────────────────────────────────────
CREATE TABLE "github_repos" (
    "id"          UUID                  NOT NULL,
    "repo_name"   VARCHAR(200)          NOT NULL,
    "owner"       VARCHAR(100)          NOT NULL,
    "url"         VARCHAR(500)          NOT NULL,
    "stars"       INTEGER               NOT NULL DEFAULT 0,
    "language"    VARCHAR(50),
    "description" TEXT,
    "my_review"   TEXT                  NOT NULL,
    "status"      "github_repo_status"  NOT NULL DEFAULT 'DRAFT',
    "created_at"  TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP(3)          NOT NULL,

    CONSTRAINT "github_repos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_github_repos_url" ON "github_repos"("url");
CREATE INDEX "idx_github_repos_status" ON "github_repos"("status");
CREATE INDEX "idx_github_repos_status_created"
    ON "github_repos"("status", "created_at" DESC);
CREATE INDEX "idx_github_repos_language" ON "github_repos"("language");
CREATE INDEX "idx_github_repos_owner_name"
    ON "github_repos"("owner", "repo_name");

# ─── 3. github_repo_tags ─────────────────────────────────────────
CREATE TABLE "github_repo_tags" (
    "repo_id" UUID    NOT NULL,
    "tag_id"  INTEGER NOT NULL,

    CONSTRAINT "pk_github_repo_tags" PRIMARY KEY ("repo_id","tag_id")
);

CREATE INDEX "idx_github_repo_tags_repo" ON "github_repo_tags"("repo_id");
CREATE INDEX "idx_github_repo_tags_tag"  ON "github_repo_tags"("tag_id");

ALTER TABLE "github_repo_tags"
    ADD CONSTRAINT "github_repo_tags_repo_id_fkey"
    FOREIGN KEY ("repo_id") REFERENCES "github_repos"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "github_repo_tags"
    ADD CONSTRAINT "github_repo_tags_tag_id_fkey"
    FOREIGN KEY ("tag_id") REFERENCES "tags"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
