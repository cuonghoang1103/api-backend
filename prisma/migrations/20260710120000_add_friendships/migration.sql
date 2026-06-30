-- Add friend graph (two-way, Facebook-style requests)
-- Sits alongside the existing follow graph; the two are independent.
-- Uses IF NOT EXISTS / guarded DO blocks to be idempotent (safe to re-run),
-- per the project's migration conventions (CLAUDE.md Error 5 / Error 6).

-- Create friendships table
CREATE TABLE IF NOT EXISTS "friendships" (
    "id" SERIAL PRIMARY KEY,
    "requester_id" INTEGER NOT NULL,
    "addressee_id" INTEGER NOT NULL,
    "status" VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "responded_at" TIMESTAMP
);

-- Unique on the ordered pair (one row per requester→addressee).
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_friendship_pair'
    ) THEN
        ALTER TABLE "friendships" ADD CONSTRAINT "uk_friendship_pair" UNIQUE("requester_id", "addressee_id");
    END IF;
END $$;

-- Hot-path indexes: "incoming pending for me", "outgoing pending by me".
CREATE INDEX IF NOT EXISTS "idx_friendship_addressee_status" ON "friendships"("addressee_id", "status");
CREATE INDEX IF NOT EXISTS "idx_friendship_requester_status" ON "friendships"("requester_id", "status");

-- Foreign keys (idempotent). Cascade so deleting a user drops their
-- friendship rows on both sides.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_friendship_requester'
    ) THEN
        ALTER TABLE "friendships" ADD CONSTRAINT "fk_friendship_requester"
            FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_friendship_addressee'
    ) THEN
        ALTER TABLE "friendships" ADD CONSTRAINT "fk_friendship_addressee"
            FOREIGN KEY ("addressee_id") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
END $$;
