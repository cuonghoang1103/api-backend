-- Lab 9 · C7 — the revenue report reads one date range of payments: an index on paid_at, built without blocking writes.
CREATE INDEX CONCURRENTLY "payment_paid_at_idx" ON "payment"("paid_at");
