-- Lab 9 · C7 — "My orders": filter by customer AND already sorted the way the screen reads it (no Sort, LIMIT stops early).
-- CONCURRENTLY: the table keeps taking orders while the index is built. It cannot run inside a transaction block,
-- so this file holds ONE statement and nothing else (a second statement ⇒ Prisma runs the file as one block ⇒ 25001, lesson 16.1).
CREATE INDEX CONCURRENTLY "orders_customer_id_created_at_id_idx" ON "orders"("customer_id", "created_at" DESC, "id" DESC);
