-- ─── Hub User-Sharing (Phase 2) ───────────────────────────────
-- Owner can share a single folder/link/file with a specific
-- recipient (User-share, view-only + optional download). One row
-- per (owner, recipient, item) tuple, enforced by the unique
-- indexes below so re-sharing the same item updates the existing
-- row via upsert in the service layer (no duplicate inbox rows).
--
-- Exactly one of folder_id / link_id / file_id is set per row.
-- That constraint is enforced at the service layer (we throw
-- AppError(400)) — Postgres can't enforce "exactly one" cleanly
-- across three nullable columns without a CHECK constraint, which
-- we'd rather avoid to keep the migration simple.
--
-- The 3 partial unique indexes below are written as full UNIQUE
-- indexes because Postgres treats NULL as distinct in unique
-- indexes, so (owner, recipient, NULL) rows still coexist —
-- exactly what we want for the 3 separate item types. See
-- `src/services/hubShare.service.ts` for the upsert pattern.

CREATE TABLE "hub_shares" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "folder_id" INTEGER,
    "link_id" INTEGER,
    "file_id" INTEGER,
    "permission" VARCHAR(20) NOT NULL DEFAULT 'view_download',
    "note" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hub_shares_pkey" PRIMARY KEY ("id")
);

-- Performance indexes
CREATE INDEX "idx_hub_share_recipient_recent" ON "hub_shares"("recipient_id", "created_at" DESC);
CREATE INDEX "idx_hub_share_owner_recent" ON "hub_shares"("owner_id", "created_at" DESC);

-- Anti-duplicate unique constraints (one share per owner+recipient+item).
-- Postgres NULL-distinct semantics means the 3 indexes coexist
-- without conflicting with NULLs in the other item columns.
CREATE UNIQUE INDEX "hub_shares_owner_id_recipient_id_folder_id_key" ON "hub_shares"("owner_id", "recipient_id", "folder_id");
CREATE UNIQUE INDEX "hub_shares_owner_id_recipient_id_link_id_key" ON "hub_shares"("owner_id", "recipient_id", "link_id");
CREATE UNIQUE INDEX "hub_shares_owner_id_recipient_id_file_id_key" ON "hub_shares"("owner_id", "recipient_id", "file_id");

-- Foreign keys with CASCADE so deleting a User or the shared
-- item takes the share row with it (no orphans).
ALTER TABLE "hub_shares" ADD CONSTRAINT "hub_shares_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hub_shares" ADD CONSTRAINT "hub_shares_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hub_shares" ADD CONSTRAINT "hub_shares_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "hub_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hub_shares" ADD CONSTRAINT "hub_shares_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "hub_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hub_shares" ADD CONSTRAINT "hub_shares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "hub_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
