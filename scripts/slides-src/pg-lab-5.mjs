/**
 * pg-lab-5 — PostgreSQL · Lab 5 · CT Shop "One million orders: indexes + EXPLAIN" (slide EN, kiểu FU, agent lab5 26/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-5.mjs + lab/sql/lab5-*.sql. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB nháp ctlab5, lab5-start.sql rồi lab5-solution.sql bằng psql -f) — Q/O bên dưới SINH TỰ ĐỘNG (scratchpad lab5/mk5.mjs).
 * Kế hoạch EXPLAIN trên slide: bỏ phần (cost=…) và dòng "Planning: Buffers" cho vừa khung — ghi "(costs trimmed)" ở tiêu đề khung (hàm kh()).
 * Hình nào là sơ đồ (vị trí trang heap, mục lá) ghi "schematic"; mọi CON SỐ trên hình lấy từ O (output thật).
 */
import { lamDeck, sql, psql, tbl, two, box, steps, kw, vsd, flow, sh, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-5', code: 'PG Lab 5', title: 'Lab 5 — CT Shop: one million orders', sub: 'audit · EXPLAIN before/after · composite · covering · partial · expression · the cost of writes' };

/* Q:BEGIN */
const Q = {
  AUD: `SELECT c.conrelid::regclass AS child_table, a.attname AS fk_column, c.confrelid::regclass AS parent
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f' AND c.connamespace = 'shop'::regnamespace
  AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1])
ORDER BY 1, 2;   -- 7 rows; orders.customer_id is one — order_item.order_id is NOT (it leads the PRIMARY KEY)`,
  P1A: `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- Seq Scan on orders: 999.943 rows removed by the filter, a top-N heapsort`,
  P1D: `EXPLAIN (ANALYZE, BUFFERS) DELETE FROM customer WHERE id = 300;   -- read "Trigger for constraint …"`,
  P1X: `CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);   -- ERROR`,
  P1I: `CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);`,
  P1B: `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- Index Scan … but still a Sort of all 57 orders`,
  P1E: `EXPLAIN (ANALYZE, BUFFERS) DELETE FROM customer WHERE id = 300;   -- the FK check now uses the index`,
  P2I: `CREATE INDEX CONCURRENTLY idx_orders_customer_created ON orders (customer_id, created_at DESC);`,
  P2A: `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- no Sort node: Limit stops after 20 index entries`,
  P2D: `DROP INDEX CONCURRENTLY idx_orders_customer;`,
  P2G: `EXPLAIN (GENERIC_PLAN)
SELECT "shop"."orders"."id", "shop"."orders"."created_at", "shop"."orders"."status"
FROM "shop"."orders"
WHERE "shop"."orders"."customer_id" = $1
ORDER BY "shop"."orders"."created_at" DESC
LIMIT $2 OFFSET $3;`,
  P3A: `EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Bitmap Heap Scan: 54 heap pages`,
  P3I: `CREATE INDEX CONCURRENTLY idx_orders_customer_cover ON orders (customer_id, created_at DESC) INCLUDE (status);`,
  P3D: `DROP INDEX CONCURRENTLY idx_orders_customer_created;   -- the covering index serves the page too (same key)`,
  P3B: `EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Index Only Scan, Heap Fetches: 0`,
  P3N: `INSERT INTO orders (customer_id, status, created_at)
VALUES (42, 'pending', '2026-10-01 09:00+07'), (42, 'pending', '2026-10-01 09:05+07'), (42, 'pending', '2026-10-01 09:10+07');`,
  P3C: `EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Heap Fetches: 3`,
  P3V: `VACUUM orders;   -- sets the visibility-map bits again`,
  P3E: `EXPLAIN (ANALYZE, BUFFERS)
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;   -- Heap Fetches: 0`,
  P3P: `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at, o.status, p.amount
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;   -- the history page on the covering index`,
  P4A: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending'
ORDER BY created_at
LIMIT 50;   -- Seq Scan of 1.000.003 rows to keep 3.124`,
  P4C: `SELECT count(*) AS pending, count(*) FILTER (WHERE created_at < '2026-09-01') AS before_september
FROM orders WHERE status = 'pending';   -- 170 orders forgotten since 2025 – the first 50 on the screen`,
  P4I1: `CREATE INDEX CONCURRENTLY idx_orders_status_created ON orders (status, created_at);   -- option A: every row`,
  P4I2: `CREATE INDEX CONCURRENTLY idx_orders_pending ON orders (created_at) WHERE status = 'pending';   -- option B: partial`,
  P4S: `SELECT indexrelid::regclass AS index, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_index WHERE indrelid = 'orders'::regclass ORDER BY pg_relation_size(indexrelid) DESC;`,
  P4B: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending'
ORDER BY created_at
LIMIT 50;   -- the planner picks the small partial index`,
  P4D: `DROP INDEX CONCURRENTLY idx_orders_status_created;   -- keep the 88 kB one, not the 31 MB one`,
  P4P: `PREPARE pending_queue(text) AS
SELECT id, customer_id, created_at FROM orders WHERE status = $1 ORDER BY created_at LIMIT 50;`,
  P4G: `EXPLAIN (COSTS OFF) EXECUTE pending_queue('pending');   -- Seq Scan + Sort`,
  P4H: `EXPLAIN (COSTS OFF) EXECUTE pending_queue('pending');   -- custom plan: the partial index again`,
  P5A: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh004242@CtShop.vn');   -- Seq Scan: the UNIQUE index is on email, not on lower(email)`,
  P5B: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE email = lower('Kh004242@CtShop.vn');   -- Index Scan using customer_email_key`,
  P5I: `CREATE INDEX CONCURRENTLY idx_customer_lower_email ON customer (lower(email));`,
  P5C: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh004242@CtShop.vn');   -- rows=500 estimated, 1 found`,
  P5Z: `ANALYZE customer;`,
  P5E: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh004242@CtShop.vn');   -- rows=1 estimated`,
  P5X: `EXPLAIN (ANALYZE, BUFFERS) SELECT id, customer_id, status FROM orders WHERE id = 999999.0;`,
  P5Y: `EXPLAIN (ANALYZE, BUFFERS) SELECT id, customer_id, status FROM orders WHERE id = 999999;`,
  P6F: `CREATE TEMP TABLE flash AS
SELECT g, 1 + floor(random() * 100000)::int AS customer_id,
       timestamptz '2026-11-11 00:00+07' + g * interval '0.5 second' AS created_at
FROM generate_series(1, 100000) g;`,
  P6C: `CREATE TABLE orders_bare AS SELECT * FROM orders;`,
  P6O: `ALTER TABLE orders SET (autovacuum_enabled = off);   -- freeze the moment between the import and autovacuum's next visit`,
  P6A: `EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO orders_bare (id, customer_id, status, created_at)
SELECT 1000003 + g, customer_id, 'pending', created_at FROM flash;   -- heap only`,
  P6B: `EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO orders (customer_id, status, created_at)
SELECT customer_id, 'pending', created_at FROM flash;   -- heap + 3 indexes + the FK trigger, row by row`,
  P6S: `SELECT indexrelid::regclass AS index, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_index WHERE indrelid = 'orders'::regclass ORDER BY pg_relation_size(indexrelid) DESC;   -- the partial index grew 88 kB → 2,2 MB`,
  P6T: `SELECT n_live_tup, n_mod_since_analyze, last_autoanalyze FROM pg_stat_user_tables WHERE relid = 'orders'::regclass;`,
  P6X: `EXPLAIN (ANALYZE, BUFFERS)
SELECT c.city, count(*) AS pending FROM orders o JOIN customer c ON c.id = o.customer_id
WHERE o.status = 'pending' GROUP BY c.city ORDER BY c.city;   -- rows estimated ≈ 3–4 thousand, actual 103.124`,
  P6Z: `ANALYZE orders;`,
  P6Y: `EXPLAIN (ANALYZE, BUFFERS)
SELECT c.city, count(*) AS pending FROM orders o JOIN customer c ON c.id = o.customer_id
WHERE o.status = 'pending' GROUP BY c.city ORDER BY c.city;   -- estimate ≈ actual`,
  P7A: `SELECT relname AS "table", indexrelname AS index, idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'shop' AND relname IN ('orders', 'customer')
ORDER BY idx_scan, relname, indexrelname;   -- idx_customer_lower_email: 0 — the app now sends email = lower($1);`,
  P7D: `DROP INDEX CONCURRENTLY idx_customer_lower_email;`,
  SC1: `SELECT indexrelid::regclass AS index, indisvalid AS valid, pg_get_indexdef(indexrelid) AS definition
FROM pg_index WHERE indrelid IN ('orders'::regclass, 'customer'::regclass) ORDER BY 1::text;`,
  SC2: `SELECT count(*) AS orders, count(*) FILTER (WHERE status = 'pending') AS pending FROM orders;`,
};
/* Q:END */

/* O:BEGIN */
const O = {
  AUD: `  child_table   |  fk_column  |  parent  
----------------+-------------+----------
 category       | parent_id   | category
 product        | category_id | category
 orders         | customer_id | customer
 order_item     | product_id  | product
 stock_movement | order_id    | orders
 stock_movement | product_id  | product
 review         | customer_id | customer
(7 rows)`,
  P1A: `                                                                     QUERY PLAN                                                                     
----------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=20053.53..20053.56 rows=12 width=29) (actual time=98.745..98.749 rows=20 loops=1)
   Buffers: shared hit=7592 read=85
   ->  Sort  (cost=20053.53..20053.56 rows=12 width=29) (actual time=98.743..98.745 rows=20 loops=1)
         Sort Key: o.created_at DESC
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=7592 read=85
         ->  Nested Loop Left Join  (cost=0.42..20053.31 rows=12 width=29) (actual time=0.049..98.501 rows=57 loops=1)
               Buffers: shared hit=7589 read=85
               ->  Seq Scan on orders o  (cost=0.00..19952.00 rows=12 width=23) (actual time=0.023..87.856 rows=57 loops=1)
                     Filter: (customer_id = 42)
                     Rows Removed by Filter: 999943
                     Buffers: shared hit=7452
               ->  Index Scan using payment_order_id_key on payment p  (cost=0.42..8.44 rows=1 width=14) (actual time=0.040..0.040 rows=1 loops=57)
                     Index Cond: (order_id = o.id)
                     Buffers: shared hit=137 read=85
 Planning:
   Buffers: shared hit=189 read=7
 Planning Time: 0.969 ms
 Execution Time: 98.785 ms
(19 rows)`,
  P1D: `                                                          QUERY PLAN                                                          
------------------------------------------------------------------------------------------------------------------------------
 Delete on customer  (cost=0.29..8.31 rows=0 width=0) (actual time=0.130..0.130 rows=0 loops=1)
   Buffers: shared hit=10 read=3 dirtied=2
   ->  Index Scan using customer_pkey on customer  (cost=0.29..8.31 rows=1 width=6) (actual time=0.044..0.045 rows=1 loops=1)
         Index Cond: (id = 300)
         Buffers: shared hit=4 read=2
 Planning:
   Buffers: shared hit=37
 Planning Time: 0.204 ms
 Trigger for constraint orders_customer_id_fkey: time=74.556 calls=1
 Trigger for constraint review_customer_id_fkey: time=0.437 calls=1
 Execution Time: 75.181 ms
(11 rows)`,
  P1X: `psql:/tmp/lab5-solution.sql:41: ERROR:  CREATE INDEX CONCURRENTLY cannot run inside a transaction block`,
  P1I: `CREATE INDEX
Time: 818.470 ms`,
  P1B: `                                                                     QUERY PLAN                                                                     
----------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=154.16..154.19 rows=12 width=29) (actual time=0.346..0.350 rows=20 loops=1)
   Buffers: shared hit=279
   ->  Sort  (cost=154.16..154.19 rows=12 width=29) (actual time=0.345..0.347 rows=20 loops=1)
         Sort Key: o.created_at DESC
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=279
         ->  Nested Loop Left Join  (cost=0.85..153.94 rows=12 width=29) (actual time=0.015..0.327 rows=57 loops=1)
               Buffers: shared hit=279
               ->  Index Scan using idx_orders_customer on orders o  (cost=0.42..52.63 rows=12 width=23) (actual time=0.009..0.087 rows=57 loops=1)
                     Index Cond: (customer_id = 42)
                     Buffers: shared hit=57
               ->  Index Scan using payment_order_id_key on payment p  (cost=0.42..8.44 rows=1 width=14) (actual time=0.004..0.004 rows=1 loops=57)
                     Index Cond: (order_id = o.id)
                     Buffers: shared hit=222
 Planning:
   Buffers: shared hit=31 read=1
 Planning Time: 0.250 ms
 Execution Time: 0.372 ms
(18 rows)`,
  P1E: `                                                          QUERY PLAN                                                          
------------------------------------------------------------------------------------------------------------------------------
 Delete on customer  (cost=0.29..8.31 rows=0 width=0) (actual time=0.026..0.026 rows=0 loops=1)
   Buffers: shared hit=5
   ->  Index Scan using customer_pkey on customer  (cost=0.29..8.31 rows=1 width=6) (actual time=0.014..0.015 rows=1 loops=1)
         Index Cond: (id = 300)
         Buffers: shared hit=3
 Planning Time: 0.034 ms
 Trigger for constraint orders_customer_id_fkey: time=0.212 calls=1
 Trigger for constraint review_customer_id_fkey: time=0.068 calls=1
 Execution Time: 0.317 ms
(9 rows)`,
  P2I: `CREATE INDEX
Time: 862.853 ms`,
  P2A: `                                                                      QUERY PLAN                                                                      
------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.85..153.94 rows=12 width=29) (actual time=0.019..0.171 rows=20 loops=1)
   Buffers: shared hit=102
   ->  Nested Loop Left Join  (cost=0.85..153.94 rows=12 width=29) (actual time=0.018..0.165 rows=20 loops=1)
         Buffers: shared hit=102
         ->  Index Scan using idx_orders_customer_created on orders o  (cost=0.42..52.63 rows=12 width=23) (actual time=0.010..0.037 rows=20 loops=1)
               Index Cond: (customer_id = 42)
               Buffers: shared hit=23
         ->  Index Scan using payment_order_id_key on payment p  (cost=0.42..8.44 rows=1 width=14) (actual time=0.006..0.006 rows=1 loops=20)
               Index Cond: (order_id = o.id)
               Buffers: shared hit=79
 Planning:
   Buffers: shared hit=32 read=1
 Planning Time: 0.271 ms
 Execution Time: 0.185 ms
(14 rows)`,
  P2D: `DROP INDEX`,
  P2G: `                                            QUERY PLAN                                             
---------------------------------------------------------------------------------------------------
 Limit  (cost=4.78..9.13 rows=1 width=23)
   ->  Index Scan using idx_orders_customer_created on orders  (cost=0.42..52.63 rows=12 width=23)
         Index Cond: (customer_id = $1)
(3 rows)`,
  P3A: `                                                                    QUERY PLAN                                                                    
--------------------------------------------------------------------------------------------------------------------------------------------------
 GroupAggregate  (cost=51.44..51.57 rows=4 width=15) (actual time=0.135..0.143 rows=3 loops=1)
   Group Key: status
   Buffers: shared hit=60
   ->  Sort  (cost=51.44..51.47 rows=12 width=7) (actual time=0.126..0.130 rows=57 loops=1)
         Sort Key: status
         Sort Method: quicksort  Memory: 25kB
         Buffers: shared hit=60
         ->  Bitmap Heap Scan on orders  (cost=4.52..51.22 rows=12 width=7) (actual time=0.022..0.095 rows=57 loops=1)
               Recheck Cond: (customer_id = 42)
               Heap Blocks: exact=54
               Buffers: shared hit=57
               ->  Bitmap Index Scan on idx_orders_customer_created  (cost=0.00..4.51 rows=12 width=0) (actual time=0.012..0.012 rows=57 loops=1)
                     Index Cond: (customer_id = 42)
                     Buffers: shared hit=3
 Planning:
   Buffers: shared hit=14 read=2
 Planning Time: 0.096 ms
 Execution Time: 0.164 ms
(18 rows)`,
  P3I: `CREATE INDEX
Time: 1142.077 ms (00:01.142)`,
  P3D: `DROP INDEX`,
  P3B: `                                                                  QUERY PLAN                                                                   
-----------------------------------------------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=4.70..4.74 rows=4 width=15) (actual time=0.041..0.041 rows=3 loops=1)
   Group Key: status
   Batches: 1  Memory Usage: 24kB
   Buffers: shared hit=5
   ->  Index Only Scan using idx_orders_customer_cover on orders  (cost=0.42..4.63 rows=12 width=7) (actual time=0.017..0.023 rows=57 loops=1)
         Index Cond: (customer_id = 42)
         Heap Fetches: 0
         Buffers: shared hit=5
 Planning:
   Buffers: shared hit=16 read=1
 Planning Time: 0.161 ms
 Execution Time: 0.060 ms
(12 rows)`,
  P3N: `INSERT 0 3`,
  P3C: `                                                                  QUERY PLAN                                                                   
-----------------------------------------------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=4.70..4.74 rows=4 width=15) (actual time=0.032..0.033 rows=4 loops=1)
   Group Key: status
   Batches: 1  Memory Usage: 24kB
   Buffers: shared hit=6
   ->  Index Only Scan using idx_orders_customer_cover on orders  (cost=0.42..4.63 rows=12 width=7) (actual time=0.014..0.020 rows=60 loops=1)
         Index Cond: (customer_id = 42)
         Heap Fetches: 3
         Buffers: shared hit=6
 Planning Time: 0.051 ms
 Execution Time: 0.048 ms
(10 rows)`,
  P3V: `VACUUM`,
  P3E: `                                                                  QUERY PLAN                                                                   
-----------------------------------------------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=4.70..4.74 rows=4 width=15) (actual time=0.033..0.034 rows=4 loops=1)
   Group Key: status
   Batches: 1  Memory Usage: 24kB
   Buffers: shared hit=5
   ->  Index Only Scan using idx_orders_customer_cover on orders  (cost=0.42..4.63 rows=12 width=7) (actual time=0.014..0.021 rows=60 loops=1)
         Index Cond: (customer_id = 42)
         Heap Fetches: 0
         Buffers: shared hit=5
 Planning Time: 0.070 ms
 Execution Time: 0.053 ms
(10 rows)`,
  P3P: `                                                                     QUERY PLAN                                                                     
----------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.85..153.94 rows=12 width=29) (actual time=0.013..0.142 rows=20 loops=1)
   Buffers: shared hit=97
   ->  Nested Loop Left Join  (cost=0.85..153.94 rows=12 width=29) (actual time=0.012..0.139 rows=20 loops=1)
         Buffers: shared hit=97
         ->  Index Scan using idx_orders_customer_cover on orders o  (cost=0.42..52.63 rows=12 width=23) (actual time=0.007..0.033 rows=20 loops=1)
               Index Cond: (customer_id = 42)
               Buffers: shared hit=21
         ->  Index Scan using payment_order_id_key on payment p  (cost=0.42..8.44 rows=1 width=14) (actual time=0.005..0.005 rows=1 loops=20)
               Index Cond: (order_id = o.id)
               Buffers: shared hit=76
 Planning:
   Buffers: shared hit=18
 Planning Time: 0.166 ms
 Execution Time: 0.160 ms
(14 rows)`,
  P4A: `                                                       QUERY PLAN                                                       
------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=20061.62..20061.75 rows=50 width=24) (actual time=92.801..92.825 rows=50 loops=1)
   Buffers: shared hit=7439 read=13
   ->  Sort  (cost=20061.62..20069.87 rows=3300 width=24) (actual time=92.799..92.817 rows=50 loops=1)
         Sort Key: created_at
         Sort Method: top-N heapsort  Memory: 30kB
         Buffers: shared hit=7439 read=13
         ->  Seq Scan on orders  (cost=0.00..19952.00 rows=3300 width=24) (actual time=0.023..91.939 rows=3124 loops=1)
               Filter: (status = 'pending'::text)
               Rows Removed by Filter: 996879
               Buffers: shared hit=7439 read=13
 Planning:
   Buffers: shared hit=3 read=2
 Planning Time: 0.127 ms
 Execution Time: 92.844 ms
(14 rows)`,
  P4C: ` pending | before_september 
---------+------------------
    3124 |              170
(1 row)`,
  P4I1: `CREATE INDEX
Time: 1898.072 ms (00:01.898)`,
  P4I2: `CREATE INDEX
Time: 189.739 ms`,
  P4S: `           index           | size  
---------------------------+-------
 idx_orders_customer_cover | 39 MB
 idx_orders_status_created | 31 MB
 orders_pkey               | 21 MB
 idx_orders_pending        | 88 kB
(4 rows)`,
  P4B: `                                                               QUERY PLAN                                                               
----------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.28..3.44 rows=50 width=24) (actual time=0.009..0.050 rows=50 loops=1)
   Buffers: shared hit=50
   ->  Index Scan using idx_orders_pending on orders  (cost=0.28..208.91 rows=3300 width=24) (actual time=0.008..0.045 rows=50 loops=1)
         Buffers: shared hit=50
 Planning:
   Buffers: shared hit=5 read=2
 Planning Time: 0.108 ms
 Execution Time: 0.059 ms
(8 rows)`,
  P4D: `DROP INDEX`,
  P4P: `PREPARE`,
  P4G: `             QUERY PLAN              
-------------------------------------
 Limit
   ->  Sort
         Sort Key: created_at
         ->  Seq Scan on orders
               Filter: (status = $1)
(5 rows)`,
  P4H: `                     QUERY PLAN                      
-----------------------------------------------------
 Limit
   ->  Index Scan using idx_orders_pending on orders
(2 rows)`,
  P5A: `                                               QUERY PLAN                                                
---------------------------------------------------------------------------------------------------------
 Seq Scan on customer  (cost=0.00..2770.00 rows=500 width=24) (actual time=1.748..58.251 rows=1 loops=1)
   Filter: (lower(email) = 'kh004242@ctshop.vn'::text)
   Rows Removed by Filter: 99999
   Buffers: shared hit=2 read=1268
 Planning:
   Buffers: shared hit=3 dirtied=1
 Planning Time: 0.181 ms
 Execution Time: 58.263 ms
(8 rows)`,
  P5B: `                                                          QUERY PLAN                                                          
------------------------------------------------------------------------------------------------------------------------------
 Index Scan using customer_email_key on customer  (cost=0.42..8.44 rows=1 width=24) (actual time=0.063..0.065 rows=1 loops=1)
   Index Cond: (email = 'kh004242@ctshop.vn'::text)
   Buffers: shared hit=1 read=3
 Planning:
   Buffers: shared hit=3
 Planning Time: 0.569 ms
 Execution Time: 0.076 ms
(7 rows)`,
  P5I: `CREATE INDEX
Time: 343.069 ms`,
  P5C: `                                                             QUERY PLAN                                                             
------------------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on customer  (cost=16.29..976.37 rows=500 width=24) (actual time=0.023..0.023 rows=1 loops=1)
   Recheck Cond: (lower(email) = 'kh004242@ctshop.vn'::text)
   Heap Blocks: exact=1
   Buffers: shared hit=4
   ->  Bitmap Index Scan on idx_customer_lower_email  (cost=0.00..16.17 rows=500 width=0) (actual time=0.011..0.011 rows=1 loops=1)
         Index Cond: (lower(email) = 'kh004242@ctshop.vn'::text)
         Buffers: shared hit=3
 Planning:
   Buffers: shared hit=16 read=1
 Planning Time: 0.113 ms
 Execution Time: 0.031 ms
(11 rows)`,
  P5Z: `ANALYZE`,
  P5E: `                                                             QUERY PLAN                                                             
------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_customer_lower_email on customer  (cost=0.42..8.44 rows=1 width=24) (actual time=0.016..0.017 rows=1 loops=1)
   Index Cond: (lower(email) = 'kh004242@ctshop.vn'::text)
   Buffers: shared hit=4
 Planning:
   Buffers: shared hit=11
 Planning Time: 0.121 ms
 Execution Time: 0.027 ms
(7 rows)`,
  P5X: `                                                 QUERY PLAN                                                 
------------------------------------------------------------------------------------------------------------
 Seq Scan on orders  (cost=0.00..22452.04 rows=5000 width=23) (actual time=102.672..102.673 rows=1 loops=1)
   Filter: ((id)::numeric = 999999.0)
   Rows Removed by Filter: 1000002
   Buffers: shared hit=7452
 Planning:
   Buffers: shared hit=5 read=1
 Planning Time: 0.097 ms
 Execution Time: 102.683 ms
(8 rows)`,
  P5Y: `                                                     QUERY PLAN                                                      
---------------------------------------------------------------------------------------------------------------------
 Index Scan using orders_pkey on orders  (cost=0.42..8.44 rows=1 width=23) (actual time=0.015..0.016 rows=1 loops=1)
   Index Cond: (id = 999999)
   Buffers: shared hit=4
 Planning Time: 0.059 ms
 Execution Time: 0.025 ms
(5 rows)`,
  P6F: `SELECT 100000`,
  P6C: `SELECT 1000003
Time: 640.418 ms`,
  P6O: `ALTER TABLE`,
  P6A: `                                                     QUERY PLAN                                                     
--------------------------------------------------------------------------------------------------------------------
 Insert on orders_bare  (cost=0.00..2440.80 rows=0 width=0) (actual time=100.961..100.962 rows=0 loops=1)
   Buffers: shared hit=101468 dirtied=736 written=780, local hit=576
   ->  Seq Scan on flash  (cost=0.00..2440.80 rows=106560 width=88) (actual time=0.014..15.328 rows=100000 loops=1)
         Buffers: local hit=576
 Planning:
   Buffers: shared hit=8
 Planning Time: 0.081 ms
 Execution Time: 100.985 ms
(8 rows)`,
  P6B: `                                                     QUERY PLAN                                                      
---------------------------------------------------------------------------------------------------------------------
 Insert on orders  (cost=0.00..2174.40 rows=0 width=0) (actual time=1376.068..1376.069 rows=0 loops=1)
   Buffers: shared hit=805556 read=1314 dirtied=8045 written=4884, local hit=576
   ->  Seq Scan on flash  (cost=0.00..2174.40 rows=106560 width=88) (actual time=0.022..107.529 rows=100000 loops=1)
         Buffers: shared hit=100000 dirtied=1, local hit=576
 Planning Time: 0.056 ms
 Trigger for constraint orders_customer_id_fkey: time=957.852 calls=100000
 Execution Time: 2353.533 ms
(7 rows)`,
  P6S: `           index           |  size   
---------------------------+---------
 idx_orders_customer_cover | 53 MB
 orders_pkey               | 24 MB
 idx_orders_pending        | 2272 kB
(3 rows)`,
  P6T: ` n_live_tup | n_mod_since_analyze |       last_autoanalyze        
------------+---------------------+-------------------------------
    1100003 |              100003 | 2026-10-26 00:41:32.758856+07
(1 row)`,
  P6X: `                                                                        QUERY PLAN                                                                        
----------------------------------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=3778.09..3778.10 rows=5 width=18) (actual time=192.924..192.926 rows=5 loops=1)
   Sort Key: c.city
   Sort Method: quicksort  Memory: 25kB
   Buffers: shared hit=2482 read=4
   ->  HashAggregate  (cost=3777.98..3778.03 rows=5 width=18) (actual time=192.914..192.916 rows=5 loops=1)
         Group Key: c.city
         Batches: 1  Memory Usage: 24kB
         Buffers: shared hit=2482 read=4
         ->  Hash Join  (cost=3520.29..3759.86 rows=3625 width=10) (actual time=37.699..160.191 rows=103124 loops=1)
               Hash Cond: (o.customer_id = c.id)
               Buffers: shared hit=2482 read=4
               ->  Index Scan using idx_orders_pending on orders o  (cost=0.29..230.34 rows=3625 width=8) (actual time=0.007..24.937 rows=103124 loops=1)
                     Buffers: shared hit=1212 read=4
               ->  Hash  (cost=2270.00..2270.00 rows=100000 width=18) (actual time=37.666..37.667 rows=100000 loops=1)
                     Buckets: 131072  Batches: 1  Memory Usage: 6336kB
                     Buffers: shared hit=1270
                     ->  Seq Scan on customer c  (cost=0.00..2270.00 rows=100000 width=18) (actual time=0.003..13.005 rows=100000 loops=1)
                           Buffers: shared hit=1270
 Planning:
   Buffers: shared hit=24
 Planning Time: 0.103 ms
 Execution Time: 192.969 ms
(22 rows)`,
  P6Z: `ANALYZE`,
  P6Y: `                                                                         QUERY PLAN                                                                          
-------------------------------------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=7890.42..7890.43 rows=5 width=18) (actual time=191.060..191.063 rows=5 loops=1)
   Sort Key: c.city
   Sort Method: quicksort  Memory: 25kB
   Buffers: shared hit=2486
   ->  HashAggregate  (cost=7890.31..7890.36 rows=5 width=18) (actual time=191.038..191.041 rows=5 loops=1)
         Group Key: c.city
         Batches: 1  Memory Usage: 24kB
         Buffers: shared hit=2486
         ->  Hash Join  (cost=3520.29..7376.06 rows=102850 width=10) (actual time=61.144..162.524 rows=103124 loops=1)
               Hash Cond: (o.customer_id = c.id)
               Buffers: shared hit=2486
               ->  Index Scan using idx_orders_pending on orders o  (cost=0.29..3586.07 rows=102850 width=8) (actual time=0.022..18.795 rows=103124 loops=1)
                     Buffers: shared hit=1216
               ->  Hash  (cost=2270.00..2270.00 rows=100000 width=18) (actual time=60.959..60.961 rows=100000 loops=1)
                     Buckets: 131072  Batches: 1  Memory Usage: 6336kB
                     Buffers: shared hit=1270
                     ->  Seq Scan on customer c  (cost=0.00..2270.00 rows=100000 width=18) (actual time=0.016..12.939 rows=100000 loops=1)
                           Buffers: shared hit=1270
 Planning:
   Buffers: shared hit=52 read=2
 Planning Time: 0.375 ms
 Execution Time: 191.142 ms
(22 rows)`,
  P7A: `  table   |           index           | idx_scan |  size   
----------+---------------------------+----------+---------
 customer | customer_pkey             |        0 | 2208 kB
 customer | idx_customer_lower_email  |        0 | 3992 kB
 customer | customer_email_key        |        1 | 7144 kB
 orders   | idx_orders_pending        |        1 | 2272 kB
 orders   | orders_pkey               |        1 | 24 MB
 orders   | idx_orders_customer_cover |        2 | 53 MB
(6 rows)`,
  P7D: `DROP INDEX`,
  SC1: `           index           | valid |                                                    definition                                                     
---------------------------+-------+-------------------------------------------------------------------------------------------------------------------
 customer_pkey             | t     | CREATE UNIQUE INDEX customer_pkey ON shop.customer USING btree (id)
 customer_email_key        | t     | CREATE UNIQUE INDEX customer_email_key ON shop.customer USING btree (email)
 orders_pkey               | t     | CREATE UNIQUE INDEX orders_pkey ON shop.orders USING btree (id)
 idx_orders_customer_cover | t     | CREATE INDEX idx_orders_customer_cover ON shop.orders USING btree (customer_id, created_at DESC) INCLUDE (status)
 idx_orders_pending        | t     | CREATE INDEX idx_orders_pending ON shop.orders USING btree (created_at) WHERE (status = 'pending'::text)
(5 rows)`,
  SC2: ` orders  | pending 
---------+---------
 1100003 |  103124
(1 row)`,
};
/* O:END */

/* ── HELPERS ── */
const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const bo = (s) => s.split('\n').map((l) => l.replace(/\s+--.*$/, '')).join('\n');
/** SQL của bước k cho slide: bỏ chú thích cuối dòng, tô các dòng chứa một trong các chuỗi `to`. */
const S = (k, to = [], o = {}) => { const t = bo(Q[k]); return sql(t, { sm: true, hl: t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean), ...o }); };
const nho = (h, fs = 13) => h.replace(/<pre>/g, `<pre style="font-size:${fs}px;line-height:1.34">`);
/** Kế hoạch EXPLAIN gọn cho slide: bỏ (cost=…), bỏ "Planning:" + dòng Buffers ngay sau, dựng lại tiêu đề QUERY PLAN theo bề rộng mới. */
const kh = (o, { boPlan = true, tt = false } = {}) => {
  const L = o.split('\n');
  const than = [];
  for (let i = 2; i < L.length; i++) {
    const l = L[i];
    if (/^\(\d+ rows?\)$/.test(l)) continue;
    if (boPlan && l === ' Planning:') { i++; continue; }
    let x = l.replace(/\s+\(cost=[\d.]+\.\.[\d.]+ rows=\d+ width=\d+\)/, '').replace(/\s+$/, '');
    if (tt) x = x.replace(/\(actual time=[\d.]+\.\.[\d.]+ (rows=\d+ loops=\d+)\)/, '(actual $1)');
    than.push(x);
  }
  const w = Math.max(10, ...than.map((l) => l.length));
  const pad = Math.floor((w - 10) / 2);
  return [' '.repeat(pad + 1) + 'QUERY PLAN', '-'.repeat(w + 1), ...than].join('\n');
};
/** Chỉ số dòng (1-based) của khung psql chứa một trong các chuỗi. */
const dong = (t, to) => t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean);
const K = (k, to = [], o = {}) => { const t = kh(O[k], o); return P(t, { sm: true, title: o.title || `EXPLAIN (ANALYZE, BUFFERS) — real output, ${o.tt ? 'costs + node times trimmed' : 'costs trimmed'}`, hl: dong(t, to) }); };
const so = (x) => Number(String(x).replace(/[^0-9.\-]/g, ''));
/** Lấy số trong output thật bằng regex (nhóm 1). */
const lay = (k, re) => { const m = O[k].match(re); if (!m) throw new Error(`không thấy ${re} trong O.${k}`); return m[1]; };
const ms = (k) => lay(k, /Execution Time: ([\d.]+) ms/);
const vn = (x, le) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
const trang = (k) => { const m = O[k].split('\n').find((l) => /^\s+Buffers:/.test(l)); const h = Number((m.match(/hit=(\d+)/) || [0, 0])[1]), r = Number((m.match(/read=(\d+)/) || [0, 0])[1]); return h + r; };

/* ── HÌNH ── */
/** Lưới trang heap của orders (mỗi ô ≈ 5 trang), 54 ô có đơn của khách 42 (vị trí là SƠ ĐỒ). */
const luoiHeap = () => {
  const cot = 60, hang = 25, o = 16, g = 2, W = cot * (o + g), H = hang * (o + g);
  let s = `<svg viewBox="0 0 ${W + 20} ${H + 46}" width="${W + 20}" height="${H + 46}" font-family="Arial"><g data-k="heap">`;
  let seed = 42; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const co = new Set(); while (co.size < 54) co.add(Math.floor(rnd() * cot * hang));
  for (let i = 0; i < cot * hang; i++) {
    const x = (i % cot) * (o + g), y = Math.floor(i / cot) * (o + g);
    s += `<rect x="${x}" y="${y}" width="${o}" height="${o}" rx="2" fill="${co.has(i) ? DO : '#f3d9c4'}"/>`;
  }
  s += `</g><text x="0" y="${H + 26}" font-size="17" fill="#555">orders heap: ${vn(lay('P1A', /Seq Scan on orders o[^\n]*\n[^\n]*\n[^\n]*\n\s+Buffers: shared hit=(\d+)/), 0)} pages read (one square ≈ 5 pages) · <tspan fill="${DO}" font-weight="700">red = a page holding an order of customer 42</tspan> (positions schematic)</text></svg>`;
  return s;
};

/** Danh bạ (customer_id, created_at DESC): các mục của khách 42 xếp mới nhất trước, Limit dừng ở mục 20. */
const danhBa = () => {
  const W = 1110, H = 330, x0 = 10, w = 330, h = 34;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="l5a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  const muc = [['41', '… last entries of 41', '#eee', '#999'], ['42', 'newest order', '#eaf4ee', XANH], ['42', '2nd newest', '#eaf4ee', XANH], ['42', '…', '#eaf4ee', XANH], ['42', '20th newest', '#eaf4ee', XANH], ['42', '21st … 57th — never read', '#fff', '#bbb'], ['43', 'first entries of 43 …', '#eee', '#999']];
  s += `<text x="${x0}" y="20" font-size="17" font-weight="800" fill="${PG}">leaf entries of (customer_id, created_at DESC) — schematic</text>`;
  muc.forEach(([c, t, nen, vien], i) => {
    const y = 34 + i * (h + 6);
    s += `<g data-k="e-${i}"><rect x="${x0}" y="${y}" width="${w + 260}" height="${h}" rx="6" fill="${nen}" stroke="${vien}" stroke-width="2" ${i === 5 ? 'stroke-dasharray="6 5"' : ''}/>`;
    s += `<text x="${x0 + 14}" y="${y + 23}" font-size="18" font-weight="800" fill="#333" font-family="Menlo,monospace">${c}</text><text x="${x0 + 70}" y="${y + 23}" font-size="18" fill="${i === 5 ? '#999' : '#333'}">${t}</text></g>`;
  });
  const yd = 34 + 1 * (h + 6), yc = 34 + 4 * (h + 6) + h;
  s += `<path d="M${x0 + w + 280},${yd + 4} L${x0 + w + 300},${yd + 4} L${x0 + w + 300},${yc - 4} L${x0 + w + 280},${yc - 4}" fill="none" stroke="${XANH}" stroke-width="3"/>`;
  s += `<g data-k="limit"><text x="${x0 + w + 316}" y="${(yd + yc) / 2 - 8}" font-size="19" font-weight="800" fill="${XANH}">Index Scan reads 20 entries, already sorted</text><text x="${x0 + w + 316}" y="${(yd + yc) / 2 + 20}" font-size="18" fill="#444">⇒ no Sort node, Limit stops: rows=20</text></g>`;
  s += `<line x1="${x0 + w + 300}" y1="${yc + 18}" x2="${x0 + w + 300}" y2="${yc + 40}" stroke="${DO}" stroke-width="3"/><text x="${x0 + w + 316}" y="${yc + 36}" font-size="18" font-weight="800" fill="${DO}">✋ stop — the other 37 are never touched</text>`;
  return s + '</svg>';
};

/** Visibility map: trang heap + bit all-visible; trang mới chưa có bit ⇒ Heap Fetches. */
const vm = () => {
  const W = 1110, n = 8, bw = 118, gap = (W - 20 - n * bw) / (n - 1);
  let s = `<svg viewBox="0 0 ${W} 230" width="${W}" height="230" font-family="Arial">`;
  s += `<text x="10" y="20" font-size="17" font-weight="800" fill="${PG}">heap pages of orders + their visibility-map bit (schematic) — the last page holds the 3 new orders</text>`;
  for (let i = 0; i < n; i++) {
    const x = 10 + i * (bw + gap), moi = i === n - 1;
    s += `<g data-k="pg-${i}"><rect x="${x}" y="40" width="${bw}" height="90" rx="8" fill="${moi ? '#fff7ef' : '#eef4fa'}" stroke="${moi ? CAM : PG}" stroke-width="2.5"/>`;
    s += `<text x="${x + bw / 2}" y="78" text-anchor="middle" font-size="16" fill="#333" font-family="Menlo,monospace">${moi ? 'new page' : 'old page'}</text>`;
    s += `<text x="${x + bw / 2}" y="104" text-anchor="middle" font-size="15" fill="${moi ? CAM : '#555'}">${moi ? '3 new orders' : 'old orders'}</text>`;
    s += `<rect x="${x + bw / 2 - 26}" y="146" width="52" height="34" rx="6" fill="${moi ? '#fde2e0' : '#e4f3e9'}" stroke="${moi ? DO : XANH}" stroke-width="2"/><text x="${x + bw / 2}" y="169" text-anchor="middle" font-size="17" font-weight="800" fill="${moi ? DO : XANH}">${moi ? '0 ✗' : '1 ✓'}</text></g>`;
  }
  s += `<text x="10" y="214" font-size="17" fill="#444">bit 1 = all-visible ⇒ Index Only Scan trusts the index · bit 0 ⇒ visit the page (Heap Fetches) · <tspan fill="${XANH}" font-weight="700">VACUUM sets the bit</tspan></text>`;
  return s + '</svg>';
};

/** Thanh ngang so kích thước / thời gian (số thật truyền vào). */
const thanh = (rows, { W = 1110, max, donVi = '', wTen = 330, h = 40, fs = 19, log = false } = {}) => {
  const H = rows.length * (h + 14) + 6, wMax = W - wTen - 190;
  const L = (v) => (log ? Math.log10(v + 1) / Math.log10(max + 1) : v / max);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  rows.forEach(([ten, v, nhan, mau], i) => {
    const y = 4 + i * (h + 14), w = Math.max(4, L(v) * wMax);
    s += `<g data-k="bar-${i}"><text x="${wTen - 12}" y="${y + h / 2 + 7}" text-anchor="end" font-size="${fs}" fill="#333" font-family="Menlo,monospace">${esc(ten)}</text>`;
    s += `<rect x="${wTen}" y="${y}" width="${w}" height="${h}" rx="6" fill="${mau}"/><text x="${wTen + w + 10}" y="${y + h / 2 + 7}" font-size="${fs}" font-weight="800" fill="${mau}">${nhan}${donVi}</text></g>`;
  });
  return s + '</svg>';
};

/** Thanh chồng của lệnh INSERT vào orders: Insert node + trigger FK (số thật P6B), so với heap-only (P6A). */
const chiPhiGhi = () => {
  const bare = so(ms('P6A')), tong = so(ms('P6B')), ins = so(lay('P6B', /Insert on orders[^\n]*actual time=[\d.]+\.\.([\d.]+)/)), fk = so(lay('P6B', /orders_customer_id_fkey: time=([\d.]+)/));
  const W = 1110, x0 = 250, wMax = W - x0 - 40, k = wMax / tong;
  let s = `<svg viewBox="0 0 ${W} 210" width="${W}" height="210" font-family="Arial">`;
  s += `<g data-k="g-bare"><text x="${x0 - 12}" y="44" text-anchor="end" font-size="19" fill="#333" font-family="Menlo,monospace">orders_bare</text><rect x="${x0}" y="18" width="${bare * k}" height="40" rx="5" fill="${XANH}"/><text x="${x0 + bare * k + 10}" y="44" font-size="19" font-weight="800" fill="${XANH}">${vn(bare, 0)} ms · heap only</text></g>`;
  s += `<g data-k="g-ins"><text x="${x0 - 12}" y="118" text-anchor="end" font-size="19" fill="#333" font-family="Menlo,monospace">orders</text><rect x="${x0}" y="92" width="${ins * k}" height="40" rx="5" fill="${PG}"/><text x="${x0 + 12}" y="118" font-size="18" font-weight="800" fill="#fff">Insert ${vn(ins, 0)} ms · heap + 3 indexes</text></g>`;
  s += `<g data-k="g-fk"><rect x="${x0 + ins * k}" y="92" width="${fk * k}" height="40" rx="5" fill="${DO}"/><text x="${x0 + ins * k + 12}" y="118" font-size="18" font-weight="800" fill="#fff">FK trigger ${vn(fk, 0)} ms</text></g>`;
  s += `<text x="${x0}" y="170" font-size="19" fill="#444">100.000 rows each · Execution Time <tspan font-weight="800" fill="${DO}">${vn(tong, 0)} ms</tspan> vs <tspan font-weight="800" fill="${XANH}">${vn(bare, 0)} ms</tspan> ≈ <tspan font-weight="800">${Math.round(tong / bare)}×</tspan></text>`;
  s += `<text x="${x0}" y="198" font-size="16" fill="#777">calls=100000: the foreign-key check runs once per inserted row (a look-up in customer_pkey)</text>`;
  return s + '</svg>';
};

const DAU = [['page · 20 latest orders', ms('P1A'), trang('P1A')], ['+ (customer_id)', ms('P1B'), trang('P1B')], ['+ (customer_id, created_at DESC)', ms('P2A'), trang('P2A')], ['covering INCLUDE (status)', ms('P3P'), trang('P3P')]];
const TRANG = (t) => sql(t, { sm: true });
/** Câu SQL của trang "Đơn của tôi" — bẻ dòng cho slide (chỉ đổi khoảng trắng). */
const SQL_TRANG = `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.created_at,
       o.status, p.amount
FROM orders o LEFT JOIN payment p
       ON p.order_id = o.id
WHERE o.customer_id = 42
ORDER BY o.created_at DESC
LIMIT 20;`;
const doi = (k) => lay(k, /Time: ([\d.]+) ms/);
const ma = (h, fs = 13.5) => h.replace(/<pre class="vs sm">/g, `<pre class="vs sm" style="font-size:${fs}px;line-height:1.38">`);

export const slides = lamDeck({ chuong: 'Lab 5 · CT Shop', bai: '' }, [
  { cover: true, t: 'Lab 5 — CT Shop:<br>one million orders', sub: 'audit the foreign keys · EXPLAIN before / after ·<br>composite · covering · partial · expression · what writes pay' },

  { t: 'Your assignment', body: two(
    box('The ticket — after 1.000.000 orders', `<ul style="margin:0">
<li>“<b>My orders</b>” and the status badge feel slow</li>
<li><b>Deleting</b> a test account takes long</li>
<li>The admin <b>pending queue</b> is refreshed all day</li>
<li><b>Login</b> by e-mail is slow at peak</li>
<li>A <b>flash sale</b> will import 100.000 orders at once</li></ul>
<p style="margin:10px 0 0">Rule: <b>no change without a before / after plan.</b></p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      'page: <b>no Sort</b>, <b>102</b> pages, not 7.677',
      'DELETE’s FK trigger <b>74,6 → 0,2 ms</b>',
      'badge: <b>Index Only Scan</b>, Heap Fetches <b>0</b>',
      'queue: <b>partial index, 88 kB</b> · login: <b>customer_email_key</b>',
      'INSERT shows the FK trigger · <b>idx_scan = 0</b> dropped',
    ]))), giua: true, to: true },

  { t: 'Files and setup — one million orders in a minute', body: two(
    sh(`$ docker exec -it pgdemo psql -U postgres -d ctshop \\
      -f /tmp/lab5-start.sql
INSERT 0 99700
Time: 814.956 ms
INSERT 0 998000
Time: 9540.246 ms (00:09.540)
INSERT 0 2495000
Time: 42867.950 ms (00:42.868)
INSERT 0 915490
Time: 27353.466 ms (00:27.353)
 customers | orders  | order_lines | payments | pending 
-----------+---------+-------------+----------+---------
    100000 | 1000000 |     2500000 |   917153 |    3121`, { sm: true, hl: [13], title: 'terminal — lab5-start.sql, part B (real run, lines selected)' }),
    col(tbl(['table', 'heap', 'indexes', 'total'], [['order_item', '144 MB', '75 MB', '219 MB'], ['payment', '60 MB', '46 MB', '106 MB'], ['orders', '58 MB', '21 MB', '80 MB'], ['customer', '10160 kB', '9352 kB', '19 MB']], { cap: 'pg_relation_size / pg_indexes_size — real run' }),
      box('Deterministic', '<code class="i">setseed(0.55)</code> ⇒ the same rows on every machine. Dates grow with the id; low customer ids buy more (customer 1: 142 orders, average 10); only the last 2 days are <code class="i">pending</code>.', 'lam'),
      sql(`SET max_parallel_workers_per_gather = 0;   -- as in Ch. 10`, { sm: true }))), giua: true },

  { t: 'The loop for every step', body: `${flow([{ t: '1 · Measure', s: 'EXPLAIN ANALYZE', mau: PG }, { t: '2 · Read', s: 'which node works?', mau: CAM }, { t: '3 · Guess', s: 'what skips it?', mau: TIM }, { t: '4 · Fix', s: 'CONCURRENTLY', mau: XANH }, { t: '5 · Again', s: 'same numbers', mau: NAU }], { h: 140, fs: 21 })}
${two(box('Write down 4 numbers BEFORE you change anything', '<b>top node</b> · <b>Rows Removed</b> · <b>Execution Time</b> · <b>Buffers</b> (hit + read = pages). After the fix: the same four.', ''),
    box('Then check the cost', 'How big is the new index? What does it do to <b>INSERT</b>? Is another index now <b>redundant</b>?', 'do2'))}
${p('Time on your machine will differ (laptop, busy laptop, server). <b>Plan shape, rows and pages do not</b> — compare those, and the ratio.', 22)}`, to: true, giua: true },

  { t: 'P1 · Audit: foreign keys without an index', body: `${sql(`SELECT c.conrelid::regclass AS child_table, a.attname AS fk_column,
       c.confrelid::regclass AS parent
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f' AND c.connamespace = 'shop'::regnamespace
  AND NOT EXISTS (SELECT 1 FROM pg_index i
                  WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1])
ORDER BY 1, 2;`, { sm: true, hl: [7] })}
${two(P(O.AUD, { sm: true, hl: [5] }), box('Who is NOT on the list?', '<code class="i">order_item.order_id</code> — it leads the PRIMARY KEY <b>(order_id, product_id)</b>, and an index serves its leading column. An extra <code class="i">(order_id)</code> index would be a duplicate. <b>orders.customer_id</b> is on the list — the column “My orders” filters on.', 'xanh'), 'r46')}`, giua: true },

  { t: 'P1 · “My orders” — before', body: two(col(TRANG(SQL_TRANG), box('Read bottom-up', `<b>Seq Scan</b> on all orders → <b>Rows Removed 999.943</b> → keep 57 → <b>top-N heapsort</b> → 20. <b>${vn(trang('P1A'), 0)}</b> pages, <b>${vn(ms('P1A'), 1)} ms</b>. Estimate rows=12 vs actual 57: customer 42 buys more than average.`, 'do2')),
    nho(K('P1A', ['Seq Scan on orders', 'Rows Removed', 'Execution Time', 'top-N heapsort'], { tt: true }), 12), 'r37'), giua: true },

  { t: 'Where the time goes: 7.452 pages for 57 rows', body: `${luoiHeap()}
${two(box('Seq Scan', `reads <b>every</b> page of orders and tests every row: 7.452 pages, ${vn(ms('P1A'), 1)} ms — for one screen, every time anyone opens it.`, 'do2'),
    box('What an index changes', 'jump straight to the ~54 red pages — through a few index pages that already know where customer 42’s orders live.', 'xanh'))}` },

  { t: 'P1 · “Delete customer 300” — the hidden scan', body: `${two(col(sql(`BEGIN;
EXPLAIN (ANALYZE, BUFFERS)
  DELETE FROM customer WHERE id = 300;
ROLLBACK;`, { sm: true }), p('The DELETE itself: <b>0,13 ms</b>. The FK check: <b>74,6 ms</b>.', 22)),
    box('Who runs that scan?', 'Before a customer may go, PostgreSQL proves <b>no order points at it</b> — a query on <code class="i">orders.customer_id</code>. Without an index: a scan of 1.000.000 orders on <b>every</b> DELETE of a customer.', 'do2'), 'r46')}
${K('P1D', ['Trigger for constraint orders_customer_id_fkey', 'Execution Time'])}`, giua: true },

  { t: 'P1 · Fix it the production way: CONCURRENTLY', body: `${vsd(col(sql(`BEGIN;
CREATE INDEX CONCURRENTLY idx_orders_customer
  ON orders (customer_id);`, { sm: true }), P(O.P1X.replace('ERROR:  ', 'ERROR:  \n  '), { sm: true, title: 'psql — real error (wrapped)' }), p('Plain <code class="i">CREATE INDEX</code> blocks every write to orders while it builds.', 19)),
  col(sql(`\\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer
  ON orders (customer_id);`, { sm: true, hl: [2] }), P(O.P1I, { sm: true }), p('Builds <b>without blocking writes</b> (two passes, slower). Outside any transaction. Failed? It leaves an <b>INVALID</b> index — check <code class="i">indisvalid</code>, drop, retry.', 19)),
  '✗ inside BEGIN', '✓ on production')}
${box('How long would writes have waited? (build times in this lab, 1.000.003 rows)', `(customer_id) <b>${vn(doi('P1I'), 0)} ms</b> · (customer_id, created_at DESC) <b>${vn(doi('P2I'), 0)} ms</b> · covering <b>${vn(doi('P3I'), 0)} ms</b> · (status, created_at) <b>${vn(doi('P4I1'), 0)} ms</b> · partial <b>${vn(doi('P4I2'), 0)} ms</b>. On a 100× bigger table: minutes of blocked checkouts.`, 'lam')}`, giua: true },

  { t: 'P1 · After: two screens fixed by one index', body: `${nho(K('P1B', ['Index Scan using idx_orders_customer', 'Sort Key', 'Execution Time']), 12.5)}
${two(tbl(['', 'before', 'after'], [['page · Execution', `${vn(ms('P1A'), 1)} ms`, `${vn(ms('P1B'), 3)} ms`], ['page · pages', vn(trang('P1A'), 0), vn(trang('P1B'), 0)], ['DELETE · FK trigger', `${vn(lay('P1D', /fkey: time=([\d.]+)/), 1)} ms`, `${vn(lay('P1E', /fkey: time=([\d.]+)/), 3)} ms`]], { cap: 'real runs' }),
    box('Still a Sort', 'The index finds all <b>57</b> orders — in index order — and PostgreSQL sorts them by date to keep 20. P2 removes that Sort.', ''))}` },

  { t: 'P2 · One index that filters AND sorts', body: `${danhBa()}
${two(sql(`\\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer_created
  ON orders (customer_id, created_at DESC);`, { sm: true, hl: [3] }), col(P(O.P2I, { sm: true }), p('The phone-book rule (lesson 9.2): <b>equality column first, sort column last</b>.', 20)))}`, giua: true },

  { t: 'P2 · After: Limit stops after 20 rows', body: `${nho(K('P2A', ['Limit', 'Index Scan using idx_orders_customer_created', 'Execution Time']), 12.5)}
${two(tbl(['index', 'Execution', 'pages'], DAU.slice(0, 3).map(([a, b, c]) => [a, `${vn(b, 3)} ms`, vn(c, 0)]), { cap: 'the same page, three plans (real runs)', hl: [2] }),
    col(sql(`DROP INDEX CONCURRENTLY idx_orders_customer;`, { sm: true }), box('(customer_id) is now redundant', 'Leftmost prefix: <b>(customer_id, created_at DESC)</b> serves every query <b>(customer_id)</b> served — the page and the FK check.', 'xanh')))}` },

  { t: 'In a real Node app: what Prisma writes — and sends', body: two(col(ma(sql(`model Order {
  id         BigInt   @id
  customerId BigInt   @map("customer_id")
  createdAt  DateTime @map("created_at")
  // …
  @@index([customerId, createdAt(sort: Desc)])
  @@map("orders")
}`, { sm: true, lang: 'typescript', hl: [6] })), ma(sql(`-- prisma migrate diff … --script (real)
CREATE INDEX "orders_customer_id_created_at_idx"
  ON "orders"("customer_id", "created_at" DESC);`, { sm: true }), 13),
    box('@@index has no INCLUDE, no WHERE', 'Covering (P3) and partial (P4) indexes are hand-written in the migration’s <b>SQL</b> file.', 'do2')),
  col(nho(P(`prisma:query SELECT "shop"."orders"."id", …
  FROM "shop"."orders"
  WHERE "shop"."orders"."customer_id" = $1
  ORDER BY "shop"."orders"."created_at" DESC
  LIMIT $2 OFFSET $3
params [42,20,0] 8ms`, { sm: true, title: 'Prisma query log — real run (wrapped)', hl: [3, 4, 5] }), 13.5),
    p('Prisma sends <b>$1 $2 $3</b>, not values. Plan that exact text (lesson 10.4):', 19),
    nho(K('P2G', ['Index Scan using', 'Index Cond'], { title: 'EXPLAIN (GENERIC_PLAN) — real output, costs trimmed' }), 13),
    p('The generic plan uses the index ⇒ the fix works <b>for the app</b>, not only in psql.', 19))), giua: true },

  /* ── tập 2 ── */
  { t: 'P3 · The status badge: still 54 heap pages', body: `${sql(bo(Q.P3A), { sm: true })}
${two(nho(K('P3A', ['Bitmap Heap Scan', 'Heap Blocks: exact=54', 'Execution Time'], { tt: true }), 11.5),
    col(box('Why visit the table?', '<b>status</b> is not in the index. The index finds the 57 orders; the <b>Bitmap Heap Scan</b> reads <b>54 heap pages</b> to fetch status.', 'do2'),
      sql(`CREATE INDEX CONCURRENTLY
  idx_orders_customer_cover
  ON orders (customer_id, created_at DESC)
  INCLUDE (status);`, { sm: true, hl: [4] }), p(`${kw('INCLUDE', 'stored in the leaf, not in the key')} — key order unchanged ⇒ the page keeps working. Built in ${vn(so(doi('P3I')) / 1000, 1)} s; the composite one is dropped.`, 18)), 'r64')}` },

  { t: 'P3 · Index Only Scan — and Heap Fetches', body: `${vm()}
${two(nho(K('P3B', ['Index Only Scan', 'Heap Fetches: 0'], { tt: true }), 11.5), col(tbl(['moment', 'Heap Fetches', 'pages'], [['after CREATE INDEX', lay('P3B', /Heap Fetches: (\d+)/), lay('P3B', /\n   Buffers: shared hit=(\d+)/)], ['3 new orders inserted', lay('P3C', /Heap Fetches: (\d+)/), lay('P3C', /\n   Buffers: shared hit=(\d+)/)], ['after VACUUM orders', lay('P3E', /Heap Fetches: (\d+)/), lay('P3E', /\n   Buffers: shared hit=(\d+)/)]], { cap: 'the badge of customer 42 — real runs', hl: [1] }),
    p('Busy table, rare VACUUM ⇒ Heap Fetches grow ⇒ “index only” loses its point. Autovacuum normally keeps up.', 19)), 'r64')}` },

  { t: 'P4 · The admin queue: 50 oldest pending orders', body: two(col(S('P4A', ["status = 'pending'", 'ORDER BY created_at']), nho(K('P4A', ['Seq Scan', 'Rows Removed by Filter', 'Execution Time'], { tt: true }), 12.5)),
    col(P(O.P4C, { sm: true, hl: [3] }), box('A business finding', `<b>${lay('P4C', /\n\s+\d+ \|\s+(\d+)/)}</b> pending orders are older than September — orders from 2025 nobody processed. They are the first 50 on the screen. Performance work often surfaces data problems.`, ''),
      box('Two candidates', 'A · <code class="i">(status, created_at)</code> — all 1.000.003 rows<br>B · <code class="i">(created_at) WHERE status = \'pending\'</code> — only the 3.124 the queue can return', 'lam')), 'r64'), giua: true },

  { t: 'P4 · Full vs partial: 31 MB vs 88 kB', body: `${thanh([['idx_orders_status_created', 31 * 1024, '31 MB', DO], ['idx_orders_pending (partial)', 88, '88 kB', XANH], ['orders_pkey', 21 * 1024, '21 MB', '#8a9bb0'], ['idx_orders_customer_cover', 39 * 1024, '39 MB', '#8a9bb0']], { max: 39 * 1024, wTen: 360, h: 34 })}
${two(ma(sql(`CREATE INDEX CONCURRENTLY
  idx_orders_pending
  ON orders (created_at)
  WHERE status = 'pending';`, { sm: true, hl: [4] })), nho(K('P4B', ['Index Scan using idx_orders_pending', 'Execution Time'], { tt: true }), 12), 'r37')}
${p(`Both are fast; the planner picks the partial one: ${vn(ms('P4A'), 1)} ms → ${vn(ms('P4B'), 3)} ms. About <b>360× smaller</b> ⇒ cheaper on every INSERT, stays in memory. Option A is dropped.`, 21)}`, giua: true },

  { t: 'Trap: a partial index behind a parameter', body: vsd(col(sql(`PREPARE pending_queue(text) AS
SELECT id, customer_id, created_at FROM orders
WHERE status = $1 ORDER BY created_at LIMIT 50;
SET plan_cache_mode = force_generic_plan;
EXPLAIN (COSTS OFF) EXECUTE pending_queue('pending');`, { sm: true, hl: [3] }), P(O.P4G, { sm: true, hl: [4, 5] }), p('A <b>generic plan</b> is made for every possible $1 — it cannot prove $1 = \'pending\'.', 19)),
  col(P(O.P4H, { sm: true, hl: [2] }), p('Default <code class="i">plan_cache_mode</code>: the <b>custom</b> plan (sees the value) wins here — but do not leave it to luck.', 19),
    box('Fixed value ⇒ literal', 'The queue is <b>always</b> pending: write <code class="i">status = \'pending\'</code> in the SQL (raw query or a VIEW), not as a parameter.', 'xanh')),
  '✗ generic plan', '✓ value visible'), giua: true },

  { t: 'P5 · Login: lower(email) ignores the UNIQUE index', body: vsd(col(sql(`SELECT id, full_name FROM customer
WHERE lower(email) = lower('Kh004242@CtShop.vn');`, { sm: true, hl: [2] }), nho(K('P5A', ['Seq Scan', 'Rows Removed', 'Execution Time'], { tt: true }), 11),
    p('The UNIQUE index is sorted by <b>email</b>; the query asks about <b>lower(email)</b> — a value the index does not hold.', 19)),
    col(sql(`SELECT id, full_name FROM customer
WHERE email = lower('Kh004242@CtShop.vn');`, { sm: true, hl: [2] }), nho(K('P5B', ['Index Scan using customer_email_key', 'Execution Time'], { tt: true }), 11),
      box('Read the table first', 'Lab 1: <code class="i">CHECK (email = lower(email))</code> ⇒ stored e-mails are lower-case. Lower the <b>input</b> — <b>no new index</b>.', 'xanh')),
    '✗ function on the column', '✓ fix 1: transform the input').replace('<div class="vsd">', '<div class="vsd" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">'), giua: true },

  { t: 'P5 · Fix 2 (expression index) — and the literal trap', body: two(col(sql(`CREATE INDEX CONCURRENTLY
  idx_customer_lower_email
  ON customer (lower(email));`, { sm: true }), tbl(['moment', 'plan', 'rows est.'], [['right after CREATE INDEX', 'Bitmap Heap Scan', lay('P5C', /Bitmap Heap Scan on customer\s+\(cost=[\d.]+\.\.[\d.]+ rows=(\d+)/)], ['after ANALYZE customer', 'Index Scan', lay('P5E', /Index Scan using idx_customer_lower_email on customer\s+\(cost=[\d.]+\.\.[\d.]+ rows=(\d+)/)]], { cap: 'its statistics come from ANALYZE (real runs)' }),
    p('For a column that is <b>not</b> normalised. CT Shop keeps fix 1 ⇒ this index has no job (P7 will catch it).', 19)),
  col(`<div class="tcap">Trap: 999999.0 is numeric, the column is bigint</div>`, nho(K('P5X', ['Filter: ((id)::numeric', 'Execution Time'], { tt: true }), 12.5), nho(K('P5Y', ['Index Scan using orders_pkey', 'Execution Time'], { tt: true }), 12.5),
    p('The <b>column</b> is cast ⇒ even the primary key is skipped. Send parameters with the column’s type (Node: BigInt / integer, never a float).', 19)), 'r46'), giua: true },

  { t: 'P6 · Flash sale: what every index costs on INSERT', body: `${chiPhiGhi()}
${two(tbl(['index', 'before', 'after +100.000'], [['idx_orders_customer_cover', '39 MB', '53 MB'], ['orders_pkey', '21 MB', '24 MB'], ['idx_orders_pending', '88 kB', '2272 kB']], { cap: 'pg_relation_size — real runs', hl: [2] }),
    box('Pay on every write, forever', '<code class="i">EXPLAIN ANALYZE</code> on INSERT really inserts — here that is the import. The partial index grew 26×: 100.000 new <b>pending</b> orders are exactly its rows. Bulk load into a new table? Drop secondary indexes, load, recreate.', ''))}`, giua: true },

  { t: 'P6 · After the import: stale statistics', body: `${P(O.P6T, { sm: true, title: 'pg_stat_user_tables — real output', hl: [3] })}
${two(col(tbl(['', 'rows estimated', 'actual'], [['before ANALYZE', vn(lay('P6X', /Index Scan using idx_orders_pending on orders o\s+\(cost=[\d.]+\.\.[\d.]+ rows=(\d+)/), 0), '103.124'], ['after ANALYZE orders', vn(lay('P6Y', /Index Scan using idx_orders_pending on orders o\s+\(cost=[\d.]+\.\.[\d.]+ rows=(\d+)/), 0), '103.124']], { cap: 'pending orders per city — the same query twice (real runs)', hl: [0] }),
    box('Here: no harm. In lesson 10.3: 15 seconds.', 'This Hash Join was right anyway. The same 28× error once picked a Nested Loop and turned 35 ms into 15 s.', 'do2')),
  col(sql(`ALTER TABLE orders
  SET (autovacuum_enabled = off);
-- … the import …
ANALYZE orders;
ALTER TABLE orders
  RESET (autovacuum_enabled);`, { sm: true, hl: [4] }), box('Habit', '<b>ANALYZE right after every bulk load</b> — do not wait for autovacuum. The table setting is off only to freeze the moment for this lab.', 'xanh')))}`, giua: true },

  { t: 'P7 · Which indexes did nobody use?', body: two(col(sql(`SELECT pg_stat_reset();   -- zero this database's counters
-- replay one "day" of the app (rows thrown away):
SELECT … WHERE o.customer_id = 42 … \\g /dev/null
SELECT … WHERE customer_id = 7 GROUP BY status \\g /dev/null
SELECT … WHERE status = 'pending' … LIMIT 50 \\g /dev/null
SELECT … WHERE email = lower('Kh004242@CtShop.vn') \\g /dev/null
SELECT pg_sleep(1);   -- counters flush at most once a second`, { sm: true }), P(O.P7A, { sm: true, hl: [3, 4] })),
  col(box('Drop: idx_customer_lower_email', '<b>idx_scan = 0</b> — login now sends <code class="i">email = lower($1)</code>. The index only costs: 3.992 kB + work on every new customer.', 'xanh'),
    box('Keep: customer_pkey (also 0!)', 'It enforces the <b>PRIMARY KEY</b>, and P6’s 100.000 FK checks used it before the reset. One replayed day is a tiny window: read idx_scan over <b>weeks</b>, on every replica.', 'do2'), sql(`DROP INDEX CONCURRENTLY
  idx_customer_lower_email;`, { sm: true })), 'r64'), giua: true },

  { t: 'Self-check — the end state and the rubric', body: `${tbl(['table', 'index', 'key'], O.SC1.split('\n').slice(2, -1).map((l) => l.split('|').map((x) => x.trim())).map(([a, , d]) => { const m = d.match(/ON shop\.(\w+) USING btree (.*)$/); return [m[1], a, esc(m[2])]; }), { cap: 'pg_index — real output: exactly 5 indexes on orders + customer (definition shortened)' })}
${two(col(P(O.SC2, { sm: true })), tbl(['part', 'pts', 'awarded when'], [['P1', '2', 'audit 7 · CONCURRENTLY · FK trigger &lt; 1 ms'], ['P2', '2', 'no Sort · rows=20 · redundant dropped'], ['P3', '1,5', 'Index Only Scan · Heap Fetches explained'], ['P4', '1,5', 'sizes · partial kept · generic plan'], ['P5', '1', 'no new index · 999999.0'], ['P6', '1', 'INSERT split · ANALYZE'], ['P7', '1', 'idx_scan = 0 dropped, PK kept']], { cap: 'rubric · 10 points' }), 'r37')}`.replace(/<table class="d">/g, '<table class="d" style="font-size:15px">') },

  { t: 'Check yourself', body: two(`<ol style="font-size:22px;margin:0;padding-left:28px;display:flex;flex-direction:column;gap:14px">
<li>Why was <code class="i">order_item.order_id</code> missing from the audit — and why is <code class="i">CREATE INDEX ON order_item (order_id)</code> a mistake?</li>
<li>After P1 the page was ${Math.floor(so(ms('P1A')) / so(ms('P1B')))}× faster. What did P2 still remove, and why can LIMIT 20 then stop early?</li>
<li>Index Only Scan, but <b>Heap Fetches: 3</b>. What does it mean, what makes it 0?</li></ol>`,
  box('Answers', '1 · The PK (order_id, product_id) leads with order_id and already serves it; a second index adds only write cost.<br>2 · The <b>Sort</b>: (customer_id, created_at DESC) returns each customer’s orders newest first, so Limit stops after 20 — 102 pages instead of 279.<br>3 · Three rows on pages not marked all-visible (the new orders) were checked in the table; <b>VACUUM</b> sets the marks ⇒ 0.', 'xanh'), 'r46'), giua: true, to: true },

  { t: 'Traps of Lab 5', body: vsd(`<ul style="font-size:22px">
<li>Indexing without measuring before / after</li>
<li>Foreign keys with no index (JOIN + every DELETE)</li>
<li>Plain CREATE INDEX on a live big table</li>
<li>(a) next to (a, b) — or on the PK’s first column</li>
<li>Index Only Scan on a never-vacuumed table</li>
<li>Partial index behind <code class="i">status = $1</code></li>
<li><code class="i">lower(email)</code>, <code class="i">id = 999999.0</code></li>
<li>No ANALYZE after a bulk load</li></ul>`,
  `<ul style="font-size:22px">
<li>4 numbers: node · rows removed · time · Buffers</li>
<li>Audit query of lesson 9.2 on every schema</li>
<li>CONCURRENTLY, outside BEGIN, check indisvalid</li>
<li>Drop the redundant one (leftmost prefix)</li>
<li>Let (auto)VACUUM keep the visibility map fresh</li>
<li>Fixed value ⇒ literal in SQL</li>
<li>Transform the input — or index the expression</li>
<li>ANALYZE right after the import</li></ul>`, '✗ Trap', '✓ Do this'), giua: true },

  { t: 'Summary — and next: Lab 6', body: two(col(steps([
    'Measure → read → guess → fix → measure again → <b>check the cost</b>',
    'FK columns need indexes — for JOINs <b>and</b> DELETEs',
    'Composite = filter + sort ⇒ <b>no Sort</b>, LIMIT stops early',
    '<b>INCLUDE</b> ⇒ Index Only Scan (VACUUM keeps it honest) · <b>partial</b> for hot subsets',
    'Every index is a <b>tax on writes</b>: drop the redundant and the unused',
  ]), box('Extra challenge', '① “Orders containing the Moleskine (CT0906)” — order_item.product_id: index or not? ② payment.paid_at report: B-tree vs <b>BRIN</b> (lesson 9.4).', '')),
  box('Lab 6 — after Chapter 12', 'Back to a normal-size shop, made <b>correct under concurrency</b>: place an order in a transaction, take stock with <b>FOR UPDATE</b>, a function for the order total, a trigger that writes stock_movement, views for reports. <code class="i">lab6-start.sql</code> rebuilds the shop — <code class="i">DROP SCHEMA shop CASCADE</code> frees ~500 MB.', 'lam'), 'r64'), giua: true },
]);
