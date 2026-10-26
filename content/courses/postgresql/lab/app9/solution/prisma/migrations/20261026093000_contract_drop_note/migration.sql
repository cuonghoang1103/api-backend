-- Lab 9 · C4 — CONTRACT: only after EVERY v1 instance is gone (check: nothing reads "note" any more).
SET LOCAL lock_timeout = '3s';

DROP TRIGGER orders_sync_note ON "orders";
DROP FUNCTION orders_sync_note();

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "note";
