-- ============================================================
-- Add pending_uploads table for orphaned upload cleanup
-- Tracks uploads that have been started but not yet linked to a post.
-- ============================================================

CREATE TABLE IF NOT EXISTS "pending_uploads" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "r2_key" VARCHAR(700) NOT NULL,
    "url" VARCHAR(700) NOT NULL,
    "thumbnail" VARCHAR(700),
    "file_size" BIGINT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_name" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One pending upload per (user, R2 key). If the user re-uploads
-- the same file, we refresh the TTL instead of creating a duplicate.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_pending_upload_user_key" 
    ON "pending_uploads"("user_id", "r2_key");

CREATE INDEX IF NOT EXISTS "idx_pending_upload_user_status" 
    ON "pending_uploads"("user_id", "status");

CREATE INDEX IF NOT EXISTS "idx_pending_upload_status_expires" 
    ON "pending_uploads"("status", "expires_at");

ALTER TABLE "pending_uploads" ADD CONSTRAINT "fk_pending_upload_user"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
