-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 5 — SOLUTION: one million orders, made fast (indexes + EXPLAIN)
-- Lab 5 — ĐÁP ÁN: một triệu đơn, làm cho nhanh (chỉ mục + EXPLAIN)
-- cuongthai.com/courses/postgresql · PostgreSQL 17.11
--
-- Run AFTER lab5-start.sql, in a fresh session, top to bottom:
--   docker cp lab5-solution.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab5-solution.sql
-- Every number in the comments is from a real run (PostgreSQL 17.11, 4 CPU, warm cache).
-- Times on your machine WILL differ — compare the plan shape, rows, Buffers and the ratio before/after.
-- Recipe for every step: measure → read the plan → guess → fix → measure again.
-- ═══════════════════════════════════════════════════════════════════════════
\pset pager off
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;   -- one process per query ⇒ plans without Gather (as in Chapter 10)

-- ─── P1 · audit first: foreign-key columns that are not the FIRST column of any index ───
SELECT c.conrelid::regclass AS child_table, a.attname AS fk_column, c.confrelid::regclass AS parent
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f' AND c.connamespace = 'shop'::regnamespace
  AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1])
ORDER BY 1, 2;   -- 7 rows; orders.customer_id is one — order_item.order_id is NOT (it leads the PRIMARY KEY)

-- P1 · the order-history page: the 20 latest orders of customer 42, with the amount paid
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- Seq Scan on orders: 999.943 rows removed by the filter, a top-N heapsort

-- P1 · "delete customer 300" (never bought anything): PostgreSQL must prove no order points at it
BEGIN;
EXPLAIN (ANALYZE, BUFFERS) DELETE FROM customer WHERE id = 300;   -- read "Trigger for constraint …"
ROLLBACK;

-- P1 · trap: on production you build indexes CONCURRENTLY — and that cannot run inside a transaction
BEGIN;
CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);   -- ERROR
ROLLBACK;

-- P1 · the fix, the production way (writes keep flowing while it builds)
\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);
\timing off

EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- Index Scan … but still a Sort of all 57 orders

BEGIN;
EXPLAIN (ANALYZE, BUFFERS) DELETE FROM customer WHERE id = 300;   -- the FK check now uses the index
ROLLBACK;

-- ─── P2 · one composite index: filter on customer_id AND read in created_at DESC order ───
\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer_created ON orders (customer_id, created_at DESC);
\timing off

EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- no Sort node: Limit stops after 20 index entries

-- P2 · (customer_id) is now redundant: (customer_id, created_at DESC) serves every query it served
DROP INDEX CONCURRENTLY idx_orders_customer;

-- P2 · the SQL Prisma logs for findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, take: 20 }),
--      planned with its $1 $2 $3 still in it (PostgreSQL 16+)
EXPLAIN (GENERIC_PLAN)
SELECT "shop"."orders"."id", "shop"."orders"."created_at", "shop"."orders"."status"
FROM "shop"."orders"
WHERE "shop"."orders"."customer_id" = $1
ORDER BY "shop"."orders"."created_at" DESC
LIMIT $2 OFFSET $3;

-- ─── P3 · the account badge: how many orders of customer 42 are in each status ───
EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Bitmap Heap Scan: 54 heap pages

\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer_cover ON orders (customer_id, created_at DESC) INCLUDE (status);
\timing off
DROP INDEX CONCURRENTLY idx_orders_customer_created;   -- the covering index serves the page too (same key)

EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Index Only Scan, Heap Fetches: 0

-- P3 · customer 42 places three new orders; their heap page is not "all-visible" yet
INSERT INTO orders (customer_id, status, created_at)
VALUES (42, 'pending', '2026-10-01 09:00+07'), (42, 'pending', '2026-10-01 09:05+07'), (42, 'pending', '2026-10-01 09:10+07');

EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Heap Fetches: 3

VACUUM orders;   -- sets the visibility-map bits again

EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Heap Fetches: 0

EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- the history page on the covering index

-- ─── P4 · the admin queue: the 50 oldest orders still 'pending' ───
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending'
ORDER BY created_at
LIMIT 50;   -- Seq Scan of 1.000.003 rows to keep 3.124

SELECT count(*) AS pending, count(*) FILTER (WHERE created_at < '2026-09-01') AS before_september
FROM orders WHERE status = 'pending';   -- 170 orders forgotten since 2025 – the first 50 on the screen

\timing on
CREATE INDEX CONCURRENTLY idx_orders_status_created ON orders (status, created_at);          -- option A: every row
CREATE INDEX CONCURRENTLY idx_orders_pending ON orders (created_at) WHERE status = 'pending';  -- option B: partial
\timing off

SELECT indexrelid::regclass AS index, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_index WHERE indrelid = 'orders'::regclass ORDER BY pg_relation_size(indexrelid) DESC;

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending'
ORDER BY created_at
LIMIT 50;   -- the planner picks the small partial index

DROP INDEX CONCURRENTLY idx_orders_status_created;   -- keep the 88 kB one, not the 31 MB one

-- P4 · trap: a prepared statement with status = $1 — the GENERIC plan cannot use a partial index
PREPARE pending_queue(text) AS
SELECT id, customer_id, created_at FROM orders WHERE status = $1 ORDER BY created_at LIMIT 50;
SET plan_cache_mode = force_generic_plan;   -- what can happen after 5 executions from an app / ORM
EXPLAIN (COSTS OFF) EXECUTE pending_queue('pending');   -- Seq Scan + Sort
RESET plan_cache_mode;
EXPLAIN (COSTS OFF) EXECUTE pending_queue('pending');   -- custom plan: the partial index again
DEALLOCATE pending_queue;

-- ─── P5 · login: the customer typed "Kh004242@CtShop.vn" ───
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh004242@CtShop.vn');   -- Seq Scan: the UNIQUE index is on email, not on lower(email)

-- fix 1 (best here): the CHECK already guarantees email = lower(email) ⇒ lower the INPUT, not the column
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE email = lower('Kh004242@CtShop.vn');   -- Index Scan using customer_email_key

-- fix 2 (when the column is NOT normalised): an expression index — it needs ANALYZE for its own statistics
\timing on
CREATE INDEX CONCURRENTLY idx_customer_lower_email ON customer (lower(email));
\timing off
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh004242@CtShop.vn');   -- rows=500 estimated, 1 found
ANALYZE customer;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh004242@CtShop.vn');   -- rows=1 estimated

-- P5 · trap: the type of the literal. 999999.0 is numeric ⇒ the bigint column is cast ⇒ no index
EXPLAIN (ANALYZE, BUFFERS) SELECT id, customer_id, status FROM orders WHERE id = 999999.0;
EXPLAIN (ANALYZE, BUFFERS) SELECT id, customer_id, status FROM orders WHERE id = 999999;

-- ─── P6 · flash sale 11/11: import 100.000 orders. What does every index cost on INSERT? ───
SELECT setseed(0.77);
CREATE TEMP TABLE flash AS
SELECT g, 1 + floor(random() * 100000)::int AS customer_id,
       timestamptz '2026-11-11 00:00+07' + g * interval '0.5 second' AS created_at
FROM generate_series(1, 100000) g;

-- a copy of orders with the same 1.000.003 rows but NO index, NO foreign key
\timing on
CREATE TABLE orders_bare AS SELECT * FROM orders;
\timing off

ALTER TABLE orders SET (autovacuum_enabled = off);   -- freeze the moment between the import and autovacuum's next visit

EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO orders_bare (id, customer_id, status, created_at)
SELECT 1000003 + g, customer_id, 'pending', created_at FROM flash;   -- heap only

EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO orders (customer_id, status, created_at)
SELECT customer_id, 'pending', created_at FROM flash;   -- heap + 3 indexes + the FK trigger, row by row

SELECT indexrelid::regclass AS index, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_index WHERE indrelid = 'orders'::regclass ORDER BY pg_relation_size(indexrelid) DESC;   -- the partial index grew 88 kB → 2,2 MB

-- P6 · stale statistics: the planner still believes 3.124 orders are pending
SELECT n_live_tup, n_mod_since_analyze, last_autoanalyze FROM pg_stat_user_tables WHERE relid = 'orders'::regclass;
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.city, count(*) AS pending FROM orders o JOIN customer c ON c.id = o.customer_id
WHERE o.status = 'pending' GROUP BY c.city ORDER BY c.city;   -- rows estimated ≈ 3–4 thousand, actual 103.124
ANALYZE orders;
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.city, count(*) AS pending FROM orders o JOIN customer c ON c.id = o.customer_id
WHERE o.status = 'pending' GROUP BY c.city ORDER BY c.city;   -- estimate ≈ actual
ALTER TABLE orders RESET (autovacuum_enabled);
DROP TABLE orders_bare;

-- ─── P7 · which indexes did nobody use? Reset the counters, replay one "day" of the app, look ───
SELECT pg_sleep(1);   -- let this session flush the counters of P1–P6 first (at most once per second)
SELECT pg_stat_reset();   -- zero the counters of THIS database
SELECT o.id, o.created_at, o.status, p.amount FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42 ORDER BY o.created_at DESC LIMIT 20 \g /dev/null
SELECT status, count(*) FROM orders WHERE customer_id = 7 GROUP BY status \g /dev/null
SELECT id, customer_id, created_at FROM orders WHERE status = 'pending' ORDER BY created_at LIMIT 50 \g /dev/null
SELECT id, full_name FROM customer WHERE email = lower('Kh004242@CtShop.vn') \g /dev/null
SELECT pg_sleep(1);   -- …and flush the counters of the replay

SELECT relname AS "table", indexrelname AS index, idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'shop' AND relname IN ('orders', 'customer')
ORDER BY idx_scan, relname, indexrelname;   -- idx_customer_lower_email: 0 — the app now sends email = lower($1);
                                              -- customer_pkey: 0 too, but it enforces the PRIMARY KEY — never drop it

DROP INDEX CONCURRENTLY idx_customer_lower_email;

-- ─── Self-check — your end state must match ───
SELECT indexrelid::regclass AS index, indisvalid AS valid, pg_get_indexdef(indexrelid) AS definition
FROM pg_index WHERE indrelid IN ('orders'::regclass, 'customer'::regclass) ORDER BY 1::text;
SELECT count(*) AS orders, count(*) FILTER (WHERE status = 'pending') AS pending FROM orders;
