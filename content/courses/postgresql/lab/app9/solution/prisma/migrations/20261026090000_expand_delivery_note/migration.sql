-- Lab 9 · C4 — EXPAND: add the new column next to the old one. App v1 (reads/writes "note") keeps working.
-- Generated line (prisma migrate diff), then completed by hand: the sync trigger and the back-fill.
SET LOCAL lock_timeout = '3s';   -- ADD COLUMN needs a brief ACCESS EXCLUSIVE lock: fail fast instead of queueing everyone behind us

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "delivery_note" TEXT;

-- While v1 and v2 run side by side, every write to one column is copied to the other.
CREATE FUNCTION orders_sync_note() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.delivery_note := coalesce(NEW.delivery_note, NEW.note);
    NEW.note          := coalesce(NEW.note, NEW.delivery_note);
  ELSIF NEW.note IS DISTINCT FROM OLD.note AND NEW.delivery_note IS NOT DISTINCT FROM OLD.delivery_note THEN
    NEW.delivery_note := NEW.note;            -- written by v1
  ELSIF NEW.delivery_note IS DISTINCT FROM OLD.delivery_note AND NEW.note IS NOT DISTINCT FROM OLD.note THEN
    NEW.note := NEW.delivery_note;            -- written by v2
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER orders_sync_note BEFORE INSERT OR UPDATE OF note, delivery_note ON "orders"
  FOR EACH ROW EXECUTE FUNCTION orders_sync_note();

-- Back-fill the rows that already exist (37.500 notes here; with millions, do it in batches outside the migration).
UPDATE "orders" SET "delivery_note" = "note" WHERE "note" IS NOT NULL AND "delivery_note" IS NULL;
