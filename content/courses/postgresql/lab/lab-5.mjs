/**
 * Lab 5 — CT Shop: một triệu đơn — chỉ mục + EXPLAIN (sau Chương 10). Agent lab5, 26/10/2026.
 * Chèn vào Chương 10 bằng lab/index.mjs (LAB_SAU[10]) — sau bài 10.4, trước quiz.
 * Kiến thức tới Ch10 (B-tree, chỉ mục tổ hợp, INCLUDE, partial, biểu thức, CONCURRENTLY, pg_stat_user_indexes — Ch9;
 * EXPLAIN ANALYZE/BUFFERS, ước lượng vs thật, ANALYZE, GENERIC_PLAN, quy trình tinh chỉnh — Ch10).
 * Mới, giảng ngắn ngay trong lab: pg_stat_reset(), \g /dev/null, ALTER TABLE … SET (autovacuum_enabled = off), DROP INDEX CONCURRENTLY.
 * Dữ liệu: lab5-start.sql = lược đồ chuẩn + dữ liệu chuẩn + PHẦN B (setseed 0.55): 100.000 khách, 1.000.000 đơn, 2.500.000 dòng, 917.153 thanh toán.
 * Mọi output = chạy thật PostgreSQL 17.11 (lab5-start.sql rồi lab5-solution.sql bằng psql -f qua TTY, DB nháp ctlab5, đã xoá).
 * Q / O / SOL SINH TỰ ĐỘNG từ lab/sql/lab5-solution.sql + output thật (scratchpad lab5/mk5.mjs) — không gõ tay.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-5.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s, lang = 'sql') => `<pre><code class="language-${lang}">${esc(s).split('\n').map((l) => l.replace(lang === 'sql' ? /(--.*)$/ : /(\/\/.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Câu SQL từng bước — sinh từ lab5-solution.sql. */
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

/* Output THẬT (PostgreSQL 17.11) — sinh từ lab5-solution.sql chạy bằng psql -f. */
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

/* Toàn văn lab5-solution.sql (trùng tệp tải về). */
/* SOL:BEGIN */
const SOL = `-- ═══════════════════════════════════════════════════════════════════════════
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
\\pset pager off
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
\\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);
\\timing off

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
\\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer_created ON orders (customer_id, created_at DESC);
\\timing off

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

\\timing on
CREATE INDEX CONCURRENTLY idx_orders_customer_cover ON orders (customer_id, created_at DESC) INCLUDE (status);
\\timing off
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

\\timing on
CREATE INDEX CONCURRENTLY idx_orders_status_created ON orders (status, created_at);          -- option A: every row
CREATE INDEX CONCURRENTLY idx_orders_pending ON orders (created_at) WHERE status = 'pending';  -- option B: partial
\\timing off

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
\\timing on
CREATE INDEX CONCURRENTLY idx_customer_lower_email ON customer (lower(email));
\\timing off
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
\\timing on
CREATE TABLE orders_bare AS SELECT * FROM orders;
\\timing off

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
WHERE o.customer_id = 42 ORDER BY o.created_at DESC LIMIT 20 \\g /dev/null
SELECT status, count(*) FROM orders WHERE customer_id = 7 GROUP BY status \\g /dev/null
SELECT id, customer_id, created_at FROM orders WHERE status = 'pending' ORDER BY created_at LIMIT 50 \\g /dev/null
SELECT id, full_name FROM customer WHERE email = lower('Kh004242@CtShop.vn') \\g /dev/null
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
SELECT count(*) AS orders, count(*) FILTER (WHERE status = 'pending') AS pending FROM orders;`;
/* SOL:END */

/* Output thật của lab5-start.sql (phần B + bảng kích thước) — chép từ src/khung/pg/that/pg-lab-5-start.out.txt. */
/* SETUP:BEGIN */
const SETUP = `$ docker cp lab5-start.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab5-start.sql
…   (part A: DROP/CREATE, INSERT … — the standard shop)
 categories | products | customers | orders | order_lines | payments 
------------+----------+-----------+--------+-------------+----------
         12 |       48 |       300 |   2000 |        5000 |     1663
(1 row)

Timing is on.
 setseed 
---------
 
(1 row)

Time: 0.109 ms
INSERT 0 99700
Time: 814.956 ms
INSERT 0 998000
Time: 9540.246 ms (00:09.540)
INSERT 0 2495000
Time: 42867.950 ms (00:42.868)
INSERT 0 915490
Time: 27353.466 ms (00:27.353)
VACUUM
Time: 1526.390 ms (00:01.526)
Timing is off.
 customers | orders  | order_lines | payments | pending 
-----------+---------+-------------+----------+---------
    100000 | 1000000 |     2500000 |   917153 |    3121
(1 row)

   table    |   heap   | indexes | total  
------------+----------+---------+--------
 order_item | 144 MB   | 75 MB   | 219 MB
 payment    | 60 MB    | 46 MB   | 106 MB
 orders     | 58 MB    | 21 MB   | 80 MB
 customer   | 10160 kB | 9352 kB | 19 MB
(4 rows)`;
/* SETUP:END */

/* Prisma 5.22 chạy thật trên DB nháp (that/pg-lab-5.prisma.txt). */
const PRISMA = `// schema.prisma — the composite index of P2, written the Prisma way
model Order {
  id         BigInt   @id @default(autoincrement())
  customerId BigInt   @map("customer_id")
  status     String   @default("pending")
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz
  customer   Customer @relation(fields: [customerId], references: [id])

  @@index([customerId, createdAt(sort: Desc)])
  @@map("orders")
}`;
const PRISMA_SQL = `-- npx prisma migrate diff --from-empty --to-schema-datamodel schema.prisma --script  (orders part)
-- CreateIndex
CREATE INDEX "orders_customer_id_created_at_idx" ON "orders"("customer_id", "created_at" DESC);`;
const PRISMA_LOG = `prisma:query SELECT "shop"."orders"."id", "shop"."orders"."created_at", "shop"."orders"."status" FROM "shop"."orders" WHERE "shop"."orders"."customer_id" = $1 ORDER BY "shop"."orders"."created_at" DESC LIMIT $2 OFFSET $3
params [42,20,0] 8ms
prisma:query SELECT COUNT(*), "shop"."orders"."status" FROM "shop"."orders" WHERE "shop"."orders"."customer_id" = $1 GROUP BY "shop"."orders"."status" OFFSET $2
params [42,0] 5ms`;
const PRISMA_TAY = `-- prisma/migrations/<timestamp>_orders_covering/migration.sql — written by hand
-- (@@index has no INCLUDE and no WHERE: covering and partial indexes live in SQL)
CREATE INDEX idx_orders_customer_cover ON orders (customer_id, created_at DESC) INCLUDE (status);
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';`;

const FILES = (vi) => [
  [`${F}/lab5-start.sql`, '🧩', 'lab5-start.sql', vi ? 'CT Shop sạch (lược đồ + dữ liệu chuẩn) rồi phóng lên 1 triệu đơn — tất định, ~1 phút, ~420 MB + danh sách việc P1–P7' : 'A clean CT Shop (standard schema + data), then grown to 1 million orders — deterministic, ~1 minute, ~420 MB + the P1–P7 to-do list'],
  [`${F}/lab5-solution.sql`, '🔑', 'lab5-solution.sql', vi ? 'Mọi bước đo → sửa → đo lại, mọi bẫy, con số thật trong chú thích — mở sau khi tự làm' : 'Every measure → fix → measure-again step, every trap, real numbers in the comments — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

/** Một bước: đề + gợi ý + đáp án ẩn (một hay nhiều câu SQL + output thật). */
const buoc = (lang, k, de, goiY, keys, sau = '') => `<h4>${k} — ${de}</h4>
${goiY ? `<p class="meo">💡 ${goiY}</p>` : ''}
${details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, keys.map((x) => code(Q[x]) + out(O[x])).join('\n') + (sau ? `<p>${sau}</p>` : ''))}`;
const bay = (tieuDe, chu, keys) => `<div class="pitfall"><p><strong>${tieuDe}</strong> ${chu}</p></div>
${keys.map((x) => code(Q[x]) + out(O[x])).join('\n')}`;
const qo = (...keys) => keys.map((x) => code(Q[x]) + out(O[x])).join('\n');

const RUBRIC = (vi) => `<table>
<tr><th>${vi ? 'Phần' : 'Part'}</th><th>${vi ? 'Điểm' : 'Points'}</th><th>${vi ? 'Chấm khi' : 'Awarded when'}</th></tr>
<tr><td>P1</td><td>2</td><td>${vi ? 'liệt kê đủ 7 cột khoá ngoại thiếu chỉ mục; tạo chỉ mục bằng CONCURRENTLY; kế hoạch trước/sau ghi đủ nút, thời gian, buffers; trigger khoá ngoại của DELETE từ ~75 ms xuống &lt; 1 ms' : 'all 7 unindexed FK columns listed; index built CONCURRENTLY; before/after plans with node, time and buffers; the DELETE’s FK trigger from ~75 ms to &lt; 1 ms'}</td></tr>
<tr><td>P2</td><td>2</td><td>${vi ? 'trang lịch sử không còn nút Sort, Index Scan dừng ở 20 dòng; bỏ chỉ mục (customer_id) thừa và giải thích vì sao bỏ được' : 'the history page has no Sort node and the Index Scan stops at 20 rows; the redundant (customer_id) index dropped, with the reason'}</td></tr>
<tr><td>P3</td><td>1,5</td><td>${vi ? 'Index Only Scan; giải thích Heap Fetches 3 → 0 bằng VACUUM / visibility map' : 'Index Only Scan; Heap Fetches 3 → 0 explained with VACUUM / the visibility map'}</td></tr>
<tr><td>P4</td><td>1,5</td><td>${vi ? 'so được kích thước 31 MB vs 88 kB; chọn chỉ mục partial; nêu bẫy generic plan' : 'sizes compared (31 MB vs 88 kB); the partial index chosen; the generic-plan trap stated'}</td></tr>
<tr><td>P5</td><td>1</td><td>${vi ? 'sửa đăng nhập KHÔNG cần chỉ mục mới (customer_email_key); chỉ ra bẫy 999999.0' : 'login fixed WITHOUT a new index (customer_email_key); the 999999.0 trap explained'}</td></tr>
<tr><td>P6</td><td>1</td><td>${vi ? 'tách được thời gian INSERT: heap / chỉ mục / trigger khoá ngoại; ANALYZE đưa ước lượng về gần thật' : 'INSERT time split into heap / indexes / FK trigger; ANALYZE brings the estimate back to reality'}</td></tr>
<tr><td>P7</td><td>1</td><td>${vi ? 'tìm và xoá chỉ mục idx_scan = 0, giữ lại khoá chính dù nó cũng 0' : 'the idx_scan = 0 index found and dropped, the primary key kept although it shows 0 too'}</td></tr>
</table>`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 5 · CT Shop · after Chapter 10</span>
<h2>One million orders: make the slow screens fast</h2>
<p class="lead">With 2.000 orders every query of Labs 1–4 answered instantly — PostgreSQL could read the whole shop faster than you can blink. Real shops do not stay that small. This lab grows CT Shop to one million orders and then does what a backend developer does on a Monday morning with a performance ticket: measure, read the plan, form a guess, fix the cause, measure again — and check what the fix costs the writes.</p>

<h3>1 · The brief</h3>
<p>The ticket from the CT Shop team, after the shop crossed one million orders:</p>
<ul>
<li>“<strong>My orders</strong>” (the 20 latest orders of a customer) feels slow, and the account badge “orders by status” too.</li>
<li>Support says <strong>deleting a test account</strong> takes noticeably long.</li>
<li>The admin <strong>pending queue</strong> (the 50 oldest unpaid orders) is refreshed all day by the warehouse.</li>
<li><strong>Login</strong> by e-mail is slow at peak time.</li>
<li>Marketing plans a <strong>flash sale</strong> on 11/11 that will import 100.000 orders at once. “Just add indexes everywhere” is not an answer: every index makes that import slower.</li>
</ul>
<p>Rule of the ticket: <strong>no change without a before/after plan</strong>. Tools: everything up to Chapter 10 — indexes (B-tree, composite, <code>INCLUDE</code>, partial, expression, <code>CONCURRENTLY</code>) from Chapter 9, <code>EXPLAIN (ANALYZE, BUFFERS)</code>, estimates vs actuals, <code>ANALYZE</code> and <code>GENERIC_PLAN</code> from Chapter 10. Four small helpers are new and explained where they appear: <code>DROP INDEX CONCURRENTLY</code>, <code>pg_stat_reset()</code>, <code>\\g /dev/null</code> and the table setting <code>autovacuum_enabled</code>.</p>
<p>Chapter 10 already showed a composite index on a synthetic <code>ord</code> table. Here the tables are CT Shop’s own — with its real foreign keys, its UNIQUE e-mail, its CHECK constraints and its payments — and every fix has to be weighed against the others.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>P1</strong> — audit the foreign keys; measure “My orders” of customer 42 and “delete customer 300”; add the missing index the production way.</li>
<li><strong>P2</strong> — one composite index that filters <em>and</em> sorts; what Prisma’s <code>@@index</code> writes; drop the index it makes redundant.</li>
<li><strong>P3</strong> — the status badge from the index alone (covering index, Index Only Scan) — and why it sometimes still visits the table.</li>
<li><strong>P4</strong> — the pending queue: full index vs partial index; the prepared-statement trap.</li>
<li><strong>P5</strong> — login: why the UNIQUE index on email is ignored, and the fix that needs no new index; the numeric-literal trap.</li>
<li><strong>P6</strong> — the flash sale: what the indexes and the foreign key cost on INSERT; stale statistics.</li>
<li><strong>P7</strong> — find the index nobody used and drop it.</li>
</ol>
<div class="callout ok"><p><strong>You pass when:</strong> the audit lists 7 foreign-key columns · “My orders” has no Sort node and reads <strong>102</strong> pages instead of 7.677 (98,8 ms → 0,19 ms here) · the DELETE’s foreign-key trigger drops from 74,6 ms to 0,2 ms · the badge is an <strong>Index Only Scan</strong> with <strong>Heap Fetches: 0</strong> · the queue runs on a <strong>partial index of 88 kB</strong> (the full one is 31 MB) · login uses <strong>customer_email_key</strong> · your INSERT report shows the foreign-key trigger with <strong>calls=100000</strong> · the unused index is found with <strong>idx_scan = 0</strong> and dropped · the end state has exactly the 5 indexes of the self-check.</p></div>
<p><strong>Timing on your machine will differ</strong> — a laptop, a busy laptop, a server. Judge by what does not change: the plan’s shape (which node), the rows, the pages in <code>Buffers</code>, and the ratio before/after. The numbers in this lab come from one real run, all steps in order, warm cache.</p>
<h4>Rubric (10 points)</h4>
${RUBRIC(false)}

<h3>3 · Downloads and setup</h3>
<div class="callout"><p><code>pgdemo</code> is the name of <em>your</em> PostgreSQL 17 container. If you built it in lesson 0.3 it is called <code>pg17</code>: either write <code>pg17</code> instead of <code>pgdemo</code> in every command below, or give it the alias once with <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(false)}
<p>The start file rebuilds the standard shop (Part A, the same rows as Labs 3–4), then Part B adds 99.700 customers, 998.000 orders, 2.495.000 order lines and 915.490 payments — deterministic (<code>setseed</code>), so your counts must match exactly. Order dates grow with the id like in a real shop; a few customers buy far more often than the rest (customer 1: 142 orders, the average is 10); only the last two days still have <code>pending</code> orders. Run it with <code>-it</code> to watch the timings:</p>
${out(SETUP)}
<p>About 420 MB. Then open psql and set the session like in Chapter 10:</p>
${code(`SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;   -- one process per query: shorter plans, fair comparisons`)}

<h3>4 · Make it fast, step by step</h3>
<p>Every step follows the tuning loop of lesson 10.4. Write the four numbers of the “before” plan down <em>before</em> you change anything — the top node, the rows it threw away, <code>Execution Time</code> and <code>Buffers</code> — or you will not be able to prove the fix.</p>
<ol><li><strong>Measure</strong> — <code>EXPLAIN (ANALYZE, BUFFERS)</code> on the exact query the screen runs.</li><li><strong>Read</strong> — find the node that does the work (Seq Scan with a huge “Rows Removed”, a Sort, a trigger, an estimate far from the actual).</li><li><strong>Guess</strong> — which index (or which rewrite) would let PostgreSQL skip that work?</li><li><strong>Fix</strong> — on production: <code>CREATE INDEX CONCURRENTLY</code>.</li><li><strong>Measure again</strong> — same query, same numbers. Then <strong>check the cost</strong>: size of the index, and what it does to INSERT.</li></ol>

<h4>P1 — audit first, then “My orders” and “delete customer 300”</h4>
<p class="meo">💡 Before measuring anything, list the foreign-key columns that are not the <em>first</em> column of any index — the query from lesson 9.2. Every one of them is a JOIN or a DELETE waiting to scan a whole table.</p>
${qo('AUD')}
<p>Seven columns. <code>orders.customer_id</code> is one of them — exactly the column “My orders” filters on. Notice who is <em>not</em> on the list: <code>order_item.order_id</code>. The primary key of order_item is <code>(order_id, product_id)</code>, and an index serves its leading column, so “the lines of order X” is already fast. Adding <code>(order_id)</code> alone would be a duplicate.</p>
<p>Now measure the page the customer opens:</p>
${qo('P1A')}
<p>Read it bottom-up: a <strong>Seq Scan</strong> on all of orders, <strong>Rows Removed by Filter: 999943</strong> to keep 57, then a <strong>top-N heapsort</strong> of those 57 to keep 20. <code>Buffers: shared hit=7592 read=85</code> — 7.677 pages of 8 kB touched for one screen. Note also <code>rows=12</code> estimated vs 57 actual: customer 42 buys more than the average customer; Chapter 10 taught you to notice that, but it is not what makes this slow.</p>
<p>Support’s complaint is the same column seen from the other side. A customer can be deleted only if no order points at it, and PostgreSQL proves that with a query on <code>orders.customer_id</code>. Try it inside a transaction and roll back:</p>
${qo('P1D')}
<p>The DELETE itself takes 0,13 ms; the line <code>Trigger for constraint orders_customer_id_fkey: time=74.556</code> is the foreign-key check, a hidden scan of one million orders. Every foreign key without an index charges this on every DELETE (and on every UPDATE of the key) of the parent table.</p>
${bay('Trap — CONCURRENTLY inside a transaction.', 'On production you never use a plain CREATE INDEX on a big table: it blocks every INSERT/UPDATE/DELETE on orders while it builds (lesson 9.3). <code>CREATE INDEX CONCURRENTLY</code> builds without blocking writes — in two passes, so it is slower — and it refuses to run inside a transaction block:', ['P1X'])}
${buoc('en', 'P1', 'add the index the production way, then measure again', 'Outside any BEGIN. <code>\\timing on</code> makes psql print how long each statement took (Lab 2).', ['P1I', 'P1B', 'P1E'], 'The page: <strong>Index Scan using idx_orders_customer</strong>, 279 pages instead of 7.677, 0,372 ms instead of 98,8. The DELETE: the foreign-key trigger now takes 0,212 ms instead of 74,6 — one index, two screens fixed. But there is still a <strong>Sort</strong>: the index finds all 57 orders of customer 42 in id order, and PostgreSQL must sort them by date to take the newest 20.')}

<h4>P2 — one index that filters and sorts</h4>
<p class="meo">💡 The phone-book rule of lesson 9.2: equality columns first, then the column you sort by — <code>(customer_id, created_at DESC)</code>. Inside one customer the entries are already in the order the page wants, so <code>LIMIT 20</code> can stop after 20 entries.</p>
${details('Answer — P2', code(Q.P2I) + out(O.P2I) + qo('P2A') + '<p>The Sort node is gone: <code>Limit</code> sits directly on the scan, the Index Scan returns <strong>rows=20</strong> (not 57), and the whole plan touches <strong>102 pages</strong> — 23 for orders, 79 for the 20 payment look-ups. 98,8 ms → 0,185 ms on the same machine.</p>')}
<p>Now <code>idx_orders_customer</code> is redundant: by the leftmost-prefix rule, <code>(customer_id, created_at DESC)</code> answers every question <code>(customer_id)</code> answered — the page, and the foreign-key check of “delete customer”. A redundant index is pure cost (every INSERT updates it), so it goes — also without blocking writes:</p>
${qo('P2D')}
<p><strong>New: <code>DROP INDEX CONCURRENTLY</code></strong> waits for running queries that use the index instead of locking the table. Same rule as its twin: not inside a transaction block.</p>

<h4>In a real Node app — what Prisma writes, and what it sends</h4>
<p>In a Prisma project the same index is one line in <code>schema.prisma</code>. <code>prisma migrate diff</code> shows the SQL it generates — the index of P2, with a generated name:</p>
${code(PRISMA, 'ts')}
${code(PRISMA_SQL)}
<p>And what reaches PostgreSQL? Turn on the query log (<code>log: [{ emit: 'event', level: 'query' }]</code>) and run <code>findMany({ where: { customerId: 42n }, orderBy: { createdAt: 'desc' }, take: 20 })</code> and a <code>groupBy</code> by status — this is the real log against the lab database:</p>
${out(PRISMA_LOG)}
<p>Prisma sends parameters (<code>$1 $2 $3</code>), not values. Lesson 10.4’s trick plans that exact text, placeholders included:</p>
${qo('P2G')}
<p>The generic plan uses the composite index — the fix works for the app, not only in psql. Two limits of Prisma’s schema language matter in the next steps: <code>@@index</code> has <strong>no INCLUDE</strong> and <strong>no WHERE</strong>. Covering and partial indexes are written by hand in a migration’s SQL file:</p>
${code(PRISMA_TAY)}
<p>On a big production table build them <code>CONCURRENTLY</code> — and since that cannot run inside a transaction, check how your migration tool executes the file before you put it there; teams often run such an index as a separate, manual step.</p>

<h4>P3 — the account badge: answer from the index alone</h4>
<p>The account header shows “shipped 38 · paid 13 · cancelled 6”. Measure it with the composite index in place:</p>
${qo('P3A')}
<p>The index finds the 57 orders, but <code>status</code> is not in the index, so the <strong>Bitmap Heap Scan</strong> visits <strong>54 heap pages</strong> to read it. A covering index carries status in its leaf entries: <code>INCLUDE (status)</code> stores the column without making it part of the key — the order of the entries stays (customer_id, created_at DESC), so the same index still serves the page.</p>
${details('Answer — P3 (covering index)', code(Q.P3I) + out(O.P3I) + qo('P3D', 'P3B') + '<p><strong>Index Only Scan</strong>, <strong>Heap Fetches: 0</strong>, 5 pages, 0,060 ms. And the history page now runs on the covering index too (see below), so one index replaces two.</p>')}
<p>“Index only” has a condition. PostgreSQL may skip the table only for heap pages marked <em>all-visible</em> in the visibility map (lesson 9.2). Customer 42 places three new orders — their page is new and not marked yet:</p>
${qo('P3N', 'P3C', 'P3V', 'P3E')}
<p><strong>Heap Fetches: 3</strong> right after the INSERT — the three new rows had to be checked in the table — and <strong>0</strong> again after <code>VACUUM</code> set the marks. On a live table autovacuum does this in the background; a table that is written all the time and rarely vacuumed loses the benefit of Index Only Scans.</p>
${qo('P3P')}
<p>The history page on the covering index: same plan shape as P2, 97 pages, 0,160 ms.</p>

<h4>P4 — the admin queue: index only the rows you ask for</h4>
${qo('P4A', 'P4C')}
<p>A Seq Scan throws away 996.879 rows to keep 3.124 pending orders. The count also turns up a <em>business</em> finding: 170 pending orders are older than September — orders from 2025 that nobody ever processed. They are the first 50 on the queue, and the team should look at them; performance work often surfaces data problems like this.</p>
<p class="meo">💡 Two candidate fixes. A: an index on <code>(status, created_at)</code> — every one of the million rows gets an entry. B: a partial index on <code>(created_at) WHERE status = 'pending'</code> — only the 3.124 rows the queue can ever return. Build both, compare, keep one.</p>
${details('Answer — P4', qo('P4I1', 'P4I2', 'P4S', 'P4B', 'P4D') + '<p>Both are fast; the planner picks the partial one (50 pages, 0,059 ms instead of 92,8 ms). The difference is the size: <strong>88 kB vs 31 MB</strong>, about 360 times smaller — cheaper to update on every INSERT, and it stays in memory. Option A goes.</p>')}
${bay('Trap — a parameter the generic plan cannot see.', 'An application rarely sends <code>status = \'pending\'</code>; it sends <code>status = $1</code>. A prepared statement may switch to a <em>generic plan</em> (lesson 9.3) — planned for every possible $1 — and a generic plan cannot prove that $1 is \'pending\', so it cannot use the partial index. <code>plan_cache_mode = force_generic_plan</code> shows that plan on demand:', ['P4P', 'P4G', 'P4H'])}
<p>With the default setting the custom plan (which sees the value) wins here, because it is so much cheaper. But do not leave it to luck: when the value is fixed — the queue is <em>always</em> pending — write it as a literal in the SQL (a raw query or a view), not as a parameter.</p>

<h4>P5 — login by e-mail</h4>
<p>The customer types <code>Kh004242@CtShop.vn</code>. A developer “made login case-insensitive”:</p>
${qo('P5A')}
<p>A Seq Scan over 100.000 customers — 1.270 pages, 58,3 ms — although <code>customer_email_key</code> (the UNIQUE index) exists. The index is sorted by <code>email</code>; the query asks about <code>lower(email)</code>, a different value, which the index does not contain (lesson 9.3: a function on the column defeats a plain index).</p>
<p class="meo">💡 Before you create anything, read the table definition: CT Shop has <code>CHECK (email = lower(email))</code> since Lab 1. Every stored e-mail is already lower-case — so lower the <em>input</em>, not the column.</p>
${details('Answer — P5 (fix 1: no new index)', qo('P5B') + '<p><strong>Index Scan using customer_email_key</strong>, 4 pages, 0,076 ms. The best index is often one you already have.</p>')}
<p>If the column were not normalised (no CHECK, mixed case in the data), the fix would be an <strong>expression index</strong> on <code>lower(email)</code>. Watch the estimate: right after CREATE INDEX the planner has no statistics for the expression and guesses <code>rows=500</code>; <code>ANALYZE</code> collects them and the estimate becomes 1:</p>
${qo('P5I', 'P5C', 'P5Z', 'P5E')}
<p>Both fixes are fast. CT Shop keeps fix 1, so the expression index (3.992 kB, updated on every new customer) has no job — P7 will catch it.</p>
${bay('Trap — the type of the literal.', 'A report tool sends the order number as <code>999999.0</code>. That is a <code>numeric</code>, the column is <code>bigint</code>, and PostgreSQL compares them by casting the <em>column</em> — <code>(id)::numeric</code> — so even the primary key cannot be used:', ['P5X', 'P5Y'])}
<p>102,7 ms vs 0,025 ms for the same row. Send parameters with the column’s type (in Node: a <code>BigInt</code> or an integer, never a float).</p>

<h4>P6 — the flash sale: what indexes cost on INSERT</h4>
<p>Prepare the 100.000 orders of 11/11 in a temporary table, and a copy of orders with the same million rows but <strong>no index and no foreign key</strong>. Then switch autovacuum off <em>for this one table</em> — <code>ALTER TABLE … SET (autovacuum_enabled = off)</code> — so that we can look at the moment between the import and autovacuum’s next visit (it is switched back on at the end):</p>
${qo('P6F', 'P6C', 'P6O')}
<p class="meo">💡 <code>EXPLAIN ANALYZE</code> on an INSERT really inserts (lesson 10.1) — here that is what we want: it is the import, and the report breaks its time down for us.</p>
${details('Answer — P6 (the INSERT, measured)', qo('P6A', 'P6B', 'P6S') + '<p>Heap only: <strong>101 ms</strong>. The real table: <strong>2.354 ms</strong>, about 23 times slower — and the report says where the time went. The <code>Insert on orders</code> node (heap + identity + the three indexes) took 1.376 ms; the line <code>Trigger for constraint orders_customer_id_fkey: time=957.852 calls=100000</code> is the foreign-key check, once per row, each one a look-up in customer_pkey. The indexes grew too: the covering index from 39 MB to 53 MB, the partial index from 88 kB to 2.272 kB — 100.000 new pending orders are exactly the rows it indexes. It shrinks back as the orders get paid and VACUUM removes the old entries.</p>')}
<p>This is the cost side of every index in this lab, paid on every write, forever. For a one-off bulk load into an empty or new table, teams drop secondary indexes, load, and recreate them; on a live table like orders you keep them and accept the bill — which is why P2 and P4 dropped the indexes nobody needed.</p>
<p>Right after the import the planner’s statistics are stale:</p>
${qo('P6T', 'P6X', 'P6Z', 'P6Y')}
<p><code>n_mod_since_analyze = 100003</code>: rows changed since the last ANALYZE (autovacuum last analyzed the table before the import, then we switched it off). The plan estimates <strong>3.625</strong> pending orders and finds <strong>103.124</strong> — 28 times more. Here the Hash Join was the right plan anyway, so nothing broke; in lesson 10.3 exactly this kind of error picked a Nested Loop and turned 35 ms into 15 seconds. After <code>ANALYZE orders</code> the estimate is 102.850. Habit: <strong>ANALYZE right after every bulk load</strong> — don’t wait for autovacuum.</p>

<h4>P7 — which indexes did nobody use?</h4>
<p class="meo">💡 <code>pg_stat_user_indexes.idx_scan</code> counts how often each index was used (lesson 9.3). <strong>New: <code>pg_stat_reset()</code></strong> zeroes the counters of the current database, so we can replay one “day” of the app and see what it touches. <code>\\g /dev/null</code> runs the query in psql and throws the rows away. A session flushes its counters at most once per second — hence the <code>pg_sleep(1)</code>.</p>
${details('Answer — P7', code(SOL.slice(SOL.indexOf('SELECT pg_sleep(1);   -- let'), SOL.indexOf('SELECT relname AS "table"')).trim()) + qo('P7A', 'P7D') + '<p><code>idx_customer_lower_email</code>: <strong>0</strong> — the app now logs in with <code>email = lower($1)</code>, so this index only costs (3.992 kB and work on every new customer). It goes. <code>customer_pkey</code> also shows 0, but it enforces the PRIMARY KEY, and P6’s 100.000 foreign-key checks used it heavily before the reset: one replayed “day” is a tiny window. On a real server, read idx_scan over weeks — on every replica — and never drop an index behind a PRIMARY KEY or UNIQUE constraint.</p>')}

<h3>5 · Self-check — your end state must match</h3>
${qo('SC1', 'SC2')}
<ol>
<li>Why was <code>order_item.order_id</code> missing from the audit list, and why would <code>CREATE INDEX ON order_item (order_id)</code> be a mistake?</li>
<li>After P1 the page used an index and was 265 times faster. Why did P2 still add a different index — what node disappeared, and why could <code>LIMIT 20</code> then stop early?</li>
<li>The badge plan says Index Only Scan but Heap Fetches: 3. What does the number mean, and what makes it 0?</li>
</ol>
${details('Answers', `<ol><li>The primary key (order_id, product_id) is a B-tree whose leading column is order_id; any query or FK check on order_id alone uses it. A second index on (order_id) would answer nothing new and slow every INSERT.</li><li>The Sort. (customer_id) found the 57 orders but in index order, so all 57 had to be sorted by date. (customer_id, created_at DESC) keeps each customer’s entries newest first, so the scan returns them in the order of ORDER BY and Limit stops after 20 — 102 pages instead of 279.</li><li>Three rows lived on heap pages not marked all-visible in the visibility map (the new orders), so PostgreSQL had to check them in the table. VACUUM sets the all-visible marks; then Heap Fetches is 0.</li></ol>`)}

<h3>6 · Full solution</h3>
${details('Show the whole lab5-solution.sql', code(SOL))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>Indexing without measuring</strong> — write down node, rows removed, time and Buffers before the fix, and compare the same four after. Times vary between runs; pages and plan shapes do not.</p></div>
<div class="pitfall"><p><strong>Foreign keys without an index</strong> — slow JOINs, and a hidden scan of the child table on every DELETE of a parent (the “Trigger for constraint” line).</p></div>
<div class="pitfall"><p><strong>Plain CREATE INDEX on a live big table</strong> — it blocks writes while it builds. Use CONCURRENTLY, outside any transaction, and check <code>indisvalid</code> if it fails.</p></div>
<div class="pitfall"><p><strong>Redundant indexes</strong> — (a) next to (a, b), or an index on the leading column of the primary key: pure write cost.</p></div>
<div class="pitfall"><p><strong>Expecting Index Only Scan on a busy table</strong> — Heap Fetches grow until VACUUM marks the pages all-visible.</p></div>
<div class="pitfall"><p><strong>A partial index behind a parameter</strong> — a generic plan cannot prove <code>$1 = 'pending'</code>. Write fixed values as literals.</p></div>
<div class="pitfall"><p><strong>A function or a cast on the column</strong> — <code>lower(email)</code>, <code>id = 999999.0</code>: the plain index is ignored. Transform the input, or index the expression.</p></div>
<div class="pitfall"><p><strong>Forgetting ANALYZE after a bulk load</strong> — the planner keeps planning for yesterday’s table.</p></div>
<div class="pitfall"><p><strong>Dropping an index because idx_scan = 0 after one short window</strong> — and never the one behind a PRIMARY KEY / UNIQUE.</p></div>

<h3>8 · Extra challenge — and next: Lab 6</h3>
<ul>
<li><strong>Challenge 1</strong> — “which orders contain the Moleskine notebook (sku CT0906)?” uses <code>order_item.product_id</code>, the other FK on the audit list. Measure it, then decide: index or not? (Hint: 48 products share 2.500.000 lines — how selective is one product?)</li>
<li><strong>Challenge 2</strong> — the daily revenue report filters <code>payment.paid_at</code> by a range. Compare a B-tree and a BRIN index (lesson 9.4) on it: size, pages read, and why BRIN works here (paid_at grows with the id).</li>
</ul>
<p>Lab 6, after Chapter 12, goes back to a normal-size shop and makes it <em>correct under concurrency</em>: placing an order inside a transaction, taking stock with <code>FOR UPDATE</code>, a function that totals an order, a trigger that writes <code>stock_movement</code>, and views for the reports. <code>lab6-start.sql</code> rebuilds the shop at its standard size, so the million orders of this lab can go: <code>DROP SCHEMA shop CASCADE</code> frees the ~500 MB.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 5 · CT Shop · sau Chương 10</span>
<h2>Một triệu đơn: làm cho những màn hình chậm chạy nhanh</h2>
<p class="lead">Với 2.000 đơn, mọi câu truy vấn của Lab 1–4 trả lời tức thì — PostgreSQL đọc cả cửa hàng nhanh hơn một cái chớp mắt. Cửa hàng thật không nhỏ mãi như vậy. Lab này phóng CT Shop lên một triệu đơn, rồi làm đúng việc một lập trình viên backend làm vào sáng thứ Hai khi nhận phiếu báo chậm: đo, đọc kế hoạch, đặt giả thuyết, sửa nguyên nhân, đo lại — và kiểm cái giá mà bản sửa bắt các lệnh ghi phải trả.</p>

<h3>1 · Đề bài</h3>
<p>Phiếu việc của nhóm CT Shop, sau khi cửa hàng vượt mốc một triệu đơn:</p>
<ul>
<li>Trang "<strong>Đơn của tôi</strong>" (20 đơn mới nhất của một khách) có cảm giác chậm, huy hiệu "đơn theo trạng thái" ở đầu trang tài khoản cũng vậy.</li>
<li>Bộ phận hỗ trợ báo <strong>xoá một tài khoản thử</strong> mất thời gian thấy rõ.</li>
<li><strong>Hàng chờ pending</strong> của trang admin (50 đơn chưa thanh toán lâu nhất) bị kho bấm làm mới cả ngày.</li>
<li><strong>Đăng nhập</strong> bằng e-mail chậm vào giờ cao điểm.</li>
<li>Bộ phận marketing lên kế hoạch <strong>flash sale</strong> 11/11, sẽ nhập 100.000 đơn một lúc. "Cứ thêm chỉ mục khắp nơi" không phải câu trả lời: chỉ mục nào cũng làm lần nhập đó chậm thêm.</li>
</ul>
<p>Luật của phiếu: <strong>không thay đổi gì mà không có kế hoạch trước/sau</strong>. Công cụ: mọi thứ tới hết Chương 10 — chỉ mục (B-tree, tổ hợp, <code>INCLUDE</code>, partial, biểu thức, <code>CONCURRENTLY</code>) của Chương 9, <code>EXPLAIN (ANALYZE, BUFFERS)</code>, ước lượng so với thật, <code>ANALYZE</code> và <code>GENERIC_PLAN</code> của Chương 10. Bốn công cụ nhỏ là mới, giảng ngay chỗ dùng: <code>DROP INDEX CONCURRENTLY</code>, <code>pg_stat_reset()</code>, <code>\\g /dev/null</code> và tham số bảng <code>autovacuum_enabled</code>.</p>
<p>Chương 10 đã cho thấy chỉ mục tổ hợp trên bảng <code>ord</code> dựng riêng. Ở đây là bảng của chính CT Shop — với khoá ngoại thật, e-mail UNIQUE, ràng buộc CHECK và bảng thanh toán — và mỗi bản sửa phải được cân với các bản sửa khác.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>P1</strong> — rà khoá ngoại; đo trang "Đơn của tôi" của khách 42 và lệnh "xoá khách 300"; thêm chỉ mục còn thiếu theo cách làm trên production.</li>
<li><strong>P2</strong> — một chỉ mục tổ hợp vừa lọc <em>vừa</em> sắp xếp; <code>@@index</code> của Prisma sinh ra gì; bỏ chỉ mục mà nó làm cho thừa.</li>
<li><strong>P3</strong> — huy hiệu trạng thái chỉ đọc từ chỉ mục (chỉ mục bao phủ, Index Only Scan) — và vì sao đôi khi nó vẫn phải ghé bảng.</li>
<li><strong>P4</strong> — hàng chờ pending: chỉ mục đầy đủ so với chỉ mục một phần; bẫy câu lệnh chuẩn bị sẵn.</li>
<li><strong>P5</strong> — đăng nhập: vì sao chỉ mục UNIQUE trên email bị bỏ qua, và cách sửa không cần chỉ mục mới; bẫy kiểu của hằng số.</li>
<li><strong>P6</strong> — flash sale: chỉ mục và khoá ngoại tốn bao nhiêu khi INSERT; thống kê cũ.</li>
<li><strong>P7</strong> — tìm chỉ mục không ai dùng và xoá nó.</li>
</ol>
<div class="callout ok"><p><strong>Bạn đạt khi:</strong> bản rà liệt kê 7 cột khoá ngoại · "Đơn của tôi" không còn nút Sort và đọc <strong>102</strong> trang thay vì 7.677 (ở đây 98,8 ms → 0,19 ms) · trigger khoá ngoại của DELETE giảm từ 74,6 ms xuống 0,2 ms · huy hiệu là <strong>Index Only Scan</strong> với <strong>Heap Fetches: 0</strong> · hàng chờ chạy trên <strong>chỉ mục partial 88 kB</strong> (bản đầy đủ 31 MB) · đăng nhập dùng <strong>customer_email_key</strong> · báo cáo INSERT của bạn có dòng trigger khoá ngoại với <strong>calls=100000</strong> · tìm được chỉ mục <strong>idx_scan = 0</strong> và xoá nó · trạng thái cuối có đúng 5 chỉ mục như phần tự kiểm.</p></div>
<p><strong>Thời gian trên máy bạn sẽ khác</strong> — máy xách tay, máy đang bận, máy chủ. Hãy chấm bằng những thứ không đổi: hình dạng kế hoạch (nút nào), số dòng, số trang trong <code>Buffers</code>, và tỉ lệ trước/sau. Con số trong lab này lấy từ một lần chạy thật, đủ các bước theo thứ tự, bộ nhớ đệm đã ấm.</p>
<h4>Thang chấm (10 điểm)</h4>
${RUBRIC(true)}

<h3>3 · Tệp tải về và chuẩn bị</h3>
<div class="callout"><p><code>pgdemo</code> là tên container PostgreSQL 17 của <em>bạn</em>. Nếu bạn dựng theo bài 0.3 thì nó tên <code>pg17</code>: hoặc thay <code>pgdemo</code> bằng <code>pg17</code> trong mọi lệnh bên dưới, hoặc đổi tên một lần bằng <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(true)}
<p>Tệp start dựng lại shop chuẩn (phần A, đúng các dòng của Lab 3–4), rồi phần B thêm 99.700 khách, 998.000 đơn, 2.495.000 dòng đơn và 915.490 thanh toán — tất định (<code>setseed</code>), nên số đếm của bạn phải khớp đúng. Ngày đặt đơn tăng theo id như ở cửa hàng thật; vài khách mua nhiều hơn hẳn số còn lại (khách 1: 142 đơn, trung bình là 10); chỉ hai ngày cuối còn đơn <code>pending</code>. Chạy bằng <code>-it</code> để xem thời gian từng bước:</p>
${out(SETUP)}
<p>Khoảng 420 MB. Rồi mở psql và đặt phiên như Chương 10:</p>
${code(`SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;   -- mỗi câu một tiến trình: kế hoạch ngắn, so sánh công bằng`)}

<h3>4 · Làm cho nhanh, từng bước</h3>
<p>Bước nào cũng đi theo vòng tinh chỉnh của bài 10.4. Ghi bốn con số của kế hoạch "trước" ra giấy <em>trước khi</em> đổi bất cứ thứ gì — nút trên cùng, số dòng nó vứt đi, <code>Execution Time</code> và <code>Buffers</code> — không thì bạn sẽ không chứng minh được bản sửa.</p>
<ol><li><strong>Đo</strong> — <code>EXPLAIN (ANALYZE, BUFFERS)</code> trên đúng câu mà màn hình chạy.</li><li><strong>Đọc</strong> — tìm nút làm việc nặng (Seq Scan với "Rows Removed" khổng lồ, một Sort, một trigger, một ước lượng lệch xa số thật).</li><li><strong>Đoán</strong> — chỉ mục nào (hay cách viết lại nào) cho PostgreSQL bỏ qua được phần việc đó?</li><li><strong>Sửa</strong> — trên production: <code>CREATE INDEX CONCURRENTLY</code>.</li><li><strong>Đo lại</strong> — cùng câu, cùng các con số. Rồi <strong>kiểm cái giá</strong>: kích thước chỉ mục, và nó làm gì với INSERT.</li></ol>

<h4>P1 — rà trước, rồi "Đơn của tôi" và "xoá khách 300"</h4>
<p class="meo">💡 Trước khi đo gì, liệt kê các cột khoá ngoại không phải cột <em>đầu tiên</em> của chỉ mục nào — truy vấn của bài 9.2. Cột nào trong đó cũng là một phép JOIN hay một lệnh DELETE đang chờ quét cả bảng.</p>
${qo('AUD')}
<p>Bảy cột. <code>orders.customer_id</code> là một trong số đó — đúng cột mà "Đơn của tôi" lọc theo. Để ý cột <em>không</em> có trong danh sách: <code>order_item.order_id</code>. Khoá chính của order_item là <code>(order_id, product_id)</code>, mà chỉ mục phục vụ được cột đứng đầu của nó, nên "các dòng của đơn X" vốn đã nhanh. Thêm <code>(order_id)</code> riêng sẽ là một bản trùng.</p>
<p>Giờ đo trang mà khách mở:</p>
${qo('P1A')}
<p>Đọc từ dưới lên: một <strong>Seq Scan</strong> trên toàn bộ orders, <strong>Rows Removed by Filter: 999943</strong> để giữ lại 57 dòng, rồi một <strong>top-N heapsort</strong> 57 dòng đó để lấy 20. <code>Buffers: shared hit=7592 read=85</code> — chạm 7.677 trang 8 kB cho một màn hình. Để ý thêm <code>rows=12</code> ước lượng so với 57 thật: khách 42 mua nhiều hơn khách trung bình; Chương 10 dạy bạn nhận ra chỗ này, nhưng đó không phải lý do câu chậm.</p>
<p>Lời than của bộ phận hỗ trợ là cùng cột đó nhìn từ phía bên kia. Chỉ xoá được một khách khi không đơn nào trỏ tới khách đó, và PostgreSQL chứng minh điều này bằng một truy vấn trên <code>orders.customer_id</code>. Thử trong một giao dịch rồi rollback:</p>
${qo('P1D')}
<p>Bản thân lệnh DELETE mất 0,13 ms; dòng <code>Trigger for constraint orders_customer_id_fkey: time=74.556</code> là phần kiểm khoá ngoại, một lần quét ngầm một triệu đơn. Khoá ngoại nào không có chỉ mục cũng thu khoản phí này ở mọi lệnh DELETE (và mọi lệnh UPDATE khoá) trên bảng cha.</p>
${bay('Bẫy — CONCURRENTLY trong giao dịch.', 'Trên production không bao giờ dùng CREATE INDEX thường cho bảng lớn: nó chặn mọi INSERT/UPDATE/DELETE vào orders suốt lúc dựng (bài 9.3). <code>CREATE INDEX CONCURRENTLY</code> dựng mà không chặn ghi — đi hai lượt nên chậm hơn — và nó từ chối chạy trong một khối giao dịch:', ['P1X'])}
${buoc('vi', 'P1', 'thêm chỉ mục theo cách làm trên production, rồi đo lại', 'Ngoài mọi BEGIN. <code>\\timing on</code> cho psql in thời gian của từng câu lệnh (Lab 2).', ['P1I', 'P1B', 'P1E'], 'Trang: <strong>Index Scan using idx_orders_customer</strong>, 279 trang thay vì 7.677, 0,372 ms thay vì 98,8. Lệnh DELETE: trigger khoá ngoại giờ mất 0,212 ms thay vì 74,6 — một chỉ mục, sửa được hai màn hình. Nhưng vẫn còn một nút <strong>Sort</strong>: chỉ mục tìm đủ 57 đơn của khách 42 theo thứ tự id, và PostgreSQL phải sắp chúng theo ngày mới lấy được 20 đơn mới nhất.')}

<h4>P2 — một chỉ mục vừa lọc vừa sắp xếp</h4>
<p class="meo">💡 Luật danh bạ của bài 9.2: cột so bằng trước, cột sắp xếp sau — <code>(customer_id, created_at DESC)</code>. Trong mỗi khách, các mục đã nằm đúng thứ tự trang cần, nên <code>LIMIT 20</code> dừng được sau 20 mục.</p>
${details('Đáp án — P2', code(Q.P2I) + out(O.P2I) + qo('P2A') + '<p>Nút Sort biến mất: <code>Limit</code> ngồi thẳng trên phép quét, Index Scan trả <strong>rows=20</strong> (không phải 57), và cả kế hoạch chạm <strong>102 trang</strong> — 23 trang cho orders, 79 trang cho 20 lần tra thanh toán. 98,8 ms → 0,185 ms trên cùng máy.</p>')}
<p>Giờ <code>idx_orders_customer</code> đã thừa: theo luật tiền tố trái, <code>(customer_id, created_at DESC)</code> trả lời được mọi câu mà <code>(customer_id)</code> trả lời — trang này, và phép kiểm khoá ngoại khi "xoá khách". Chỉ mục thừa chỉ toàn là chi phí (INSERT nào cũng phải cập nhật nó), nên bỏ đi — cũng không chặn ghi:</p>
${qo('P2D')}
<p><strong>Mới: <code>DROP INDEX CONCURRENTLY</code></strong> chờ các truy vấn đang dùng chỉ mục chạy xong thay vì khoá cả bảng. Cùng luật với anh em của nó: không chạy trong khối giao dịch.</p>

<h4>Trong một ứng dụng Node thật — Prisma viết gì, và gửi gì</h4>
<p>Trong dự án Prisma, cùng chỉ mục đó là một dòng trong <code>schema.prisma</code>. <code>prisma migrate diff</code> cho xem SQL nó sinh ra — chính chỉ mục của P2, với tên tự đặt:</p>
${code(PRISMA, 'ts')}
${code(PRISMA_SQL)}
<p>Còn thứ gì tới được PostgreSQL? Bật log truy vấn (<code>log: [{ emit: 'event', level: 'query' }]</code>) rồi chạy <code>findMany({ where: { customerId: 42n }, orderBy: { createdAt: 'desc' }, take: 20 })</code> và một <code>groupBy</code> theo trạng thái — đây là log thật chạy trên CSDL của lab:</p>
${out(PRISMA_LOG)}
<p>Prisma gửi tham số (<code>$1 $2 $3</code>), không gửi giá trị. Mẹo của bài 10.4 lập kế hoạch cho đúng nguyên văn đó, kể cả các chỗ giữ chỗ:</p>
${qo('P2G')}
<p>Generic plan dùng chỉ mục tổ hợp — bản sửa có tác dụng cho ứng dụng, không chỉ trong psql. Hai giới hạn của ngôn ngữ lược đồ Prisma quan trọng ở các bước sau: <code>@@index</code> <strong>không có INCLUDE</strong> và <strong>không có WHERE</strong>. Chỉ mục bao phủ và chỉ mục một phần phải viết tay trong tệp SQL của migration:</p>
${code(PRISMA_TAY)}
<p>Trên một bảng production lớn, hãy dựng chúng bằng <code>CONCURRENTLY</code> — và vì lệnh đó không chạy được trong giao dịch, hãy kiểm công cụ migration của bạn chạy tệp ra sao trước khi đặt nó vào đó; nhiều nhóm chạy loại chỉ mục này thành một bước riêng, làm tay.</p>

<h4>P3 — huy hiệu tài khoản: trả lời chỉ bằng chỉ mục</h4>
<p>Đầu trang tài khoản hiện "đã giao 38 · đã trả 13 · đã huỷ 6". Đo nó khi đang có chỉ mục tổ hợp:</p>
${qo('P3A')}
<p>Chỉ mục tìm được 57 đơn, nhưng <code>status</code> không nằm trong chỉ mục, nên <strong>Bitmap Heap Scan</strong> phải ghé <strong>54 trang heap</strong> để đọc nó. Chỉ mục bao phủ mang sẵn status trong các mục lá: <code>INCLUDE (status)</code> lưu cột mà không đưa nó vào khoá — thứ tự các mục vẫn là (customer_id, created_at DESC), nên cùng chỉ mục đó vẫn phục vụ được trang lịch sử.</p>
${details('Đáp án — P3 (chỉ mục bao phủ)', code(Q.P3I) + out(O.P3I) + qo('P3D', 'P3B') + '<p><strong>Index Only Scan</strong>, <strong>Heap Fetches: 0</strong>, 5 trang, 0,060 ms. Và trang lịch sử giờ cũng chạy trên chỉ mục bao phủ (xem bên dưới), nên một chỉ mục thay được hai.</p>')}
<p>"Chỉ đọc chỉ mục" có điều kiện. PostgreSQL chỉ được bỏ qua bảng với những trang heap đã đánh dấu <em>all-visible</em> trong visibility map (bài 9.2). Khách 42 đặt thêm ba đơn — trang của chúng mới, chưa được đánh dấu:</p>
${qo('P3N', 'P3C', 'P3V', 'P3E')}
<p><strong>Heap Fetches: 3</strong> ngay sau INSERT — ba dòng mới phải kiểm trong bảng — và lại <strong>0</strong> sau khi <code>VACUUM</code> đặt lại dấu. Trên bảng đang chạy, autovacuum làm việc này ở nền; một bảng bị ghi liên tục mà ít được vacuum sẽ mất lợi ích của Index Only Scan.</p>
${qo('P3P')}
<p>Trang lịch sử trên chỉ mục bao phủ: cùng dáng kế hoạch với P2, 97 trang, 0,160 ms.</p>

<h4>P4 — hàng chờ của admin: chỉ đánh chỉ mục những dòng bạn hỏi</h4>
${qo('P4A', 'P4C')}
<p>Một Seq Scan vứt đi 996.879 dòng để giữ 3.124 đơn pending. Phép đếm còn lòi ra một phát hiện <em>nghiệp vụ</em>: 170 đơn pending cũ hơn tháng 9 — đơn từ năm 2025 chưa ai xử lý. Chúng là 50 dòng đầu của hàng chờ, và nhóm nên xem lại; làm hiệu năng thường làm lộ ra những vấn đề dữ liệu như vậy.</p>
<p class="meo">💡 Hai cách sửa ứng viên. A: chỉ mục trên <code>(status, created_at)</code> — cả triệu dòng mỗi dòng một mục. B: chỉ mục partial trên <code>(created_at) WHERE status = 'pending'</code> — chỉ 3.124 dòng mà hàng chờ có thể trả về. Dựng cả hai, so sánh, giữ một.</p>
${details('Đáp án — P4', qo('P4I1', 'P4I2', 'P4S', 'P4B', 'P4D') + '<p>Cả hai đều nhanh; bộ lập kế hoạch chọn bản partial (50 trang, 0,059 ms thay vì 92,8 ms). Khác nhau ở kích thước: <strong>88 kB so với 31 MB</strong>, nhỏ hơn khoảng 360 lần — rẻ hơn khi cập nhật ở mỗi INSERT, và nằm gọn trong bộ nhớ. Phương án A bị bỏ.</p>')}
${bay('Bẫy — tham số mà generic plan không nhìn thấy.', 'Ứng dụng hiếm khi gửi <code>status = \'pending\'</code>; nó gửi <code>status = $1</code>. Câu lệnh chuẩn bị sẵn có thể chuyển sang <em>generic plan</em> (bài 9.3) — kế hoạch lập cho mọi $1 có thể — và generic plan không chứng minh được $1 là \'pending\', nên không dùng được chỉ mục partial. <code>plan_cache_mode = force_generic_plan</code> cho xem kế hoạch đó theo ý muốn:', ['P4P', 'P4G', 'P4H'])}
<p>Với thiết lập mặc định, custom plan (thấy được giá trị) thắng ở đây vì nó rẻ hơn hẳn. Nhưng đừng phó mặc cho may rủi: khi giá trị cố định — hàng chờ <em>luôn</em> là pending — hãy viết nó thành hằng số trong SQL (truy vấn raw hoặc một view), đừng truyền thành tham số.</p>

<h4>P5 — đăng nhập bằng e-mail</h4>
<p>Khách gõ <code>Kh004242@CtShop.vn</code>. Một bạn lập trình viên đã "cho đăng nhập không phân biệt hoa thường":</p>
${qo('P5A')}
<p>Một Seq Scan trên 100.000 khách — 1.270 trang, 58,3 ms — dù <code>customer_email_key</code> (chỉ mục UNIQUE) vẫn có đó. Chỉ mục được sắp theo <code>email</code>; câu truy vấn hỏi về <code>lower(email)</code>, một giá trị khác mà chỉ mục không chứa (bài 9.3: hàm bọc cột làm chỉ mục thường vô dụng).</p>
<p class="meo">💡 Trước khi tạo gì, đọc định nghĩa bảng: CT Shop có <code>CHECK (email = lower(email))</code> từ Lab 1. Mọi e-mail đã lưu vốn là chữ thường — vậy hãy hạ chữ của <em>đầu vào</em>, không phải của cột.</p>
${details('Đáp án — P5 (cách 1: không cần chỉ mục mới)', qo('P5B') + '<p><strong>Index Scan using customer_email_key</strong>, 4 trang, 0,076 ms. Chỉ mục tốt nhất thường là chỉ mục bạn đã có.</p>')}
<p>Nếu cột chưa được chuẩn hoá (không có CHECK, dữ liệu lẫn hoa thường), cách sửa sẽ là một <strong>chỉ mục biểu thức</strong> trên <code>lower(email)</code>. Để ý ước lượng: ngay sau CREATE INDEX, bộ lập kế hoạch chưa có thống kê cho biểu thức nên đoán <code>rows=500</code>; <code>ANALYZE</code> thu thập thống kê và ước lượng thành 1:</p>
${qo('P5I', 'P5C', 'P5Z', 'P5E')}
<p>Cả hai cách đều nhanh. CT Shop giữ cách 1, nên chỉ mục biểu thức (3.992 kB, cập nhật mỗi khi có khách mới) không còn việc gì — P7 sẽ bắt được nó.</p>
${bay('Bẫy — kiểu của hằng số.', 'Một công cụ báo cáo gửi mã đơn dưới dạng <code>999999.0</code>. Đó là <code>numeric</code>, cột là <code>bigint</code>, và PostgreSQL so hai thứ đó bằng cách ép kiểu <em>cột</em> — <code>(id)::numeric</code> — nên ngay cả khoá chính cũng không dùng được:', ['P5X', 'P5Y'])}
<p>102,7 ms so với 0,025 ms cho cùng một dòng. Hãy gửi tham số đúng kiểu của cột (trong Node: <code>BigInt</code> hoặc số nguyên, không bao giờ số thực).</p>

<h4>P6 — flash sale: chỉ mục tốn bao nhiêu khi INSERT</h4>
<p>Chuẩn bị 100.000 đơn của 11/11 trong một bảng tạm, và một bản sao của orders có đủ một triệu dòng nhưng <strong>không chỉ mục, không khoá ngoại</strong>. Rồi tắt autovacuum <em>riêng cho bảng này</em> — <code>ALTER TABLE … SET (autovacuum_enabled = off)</code> — để nhìn được khoảnh khắc giữa lần nhập và lần ghé tiếp theo của autovacuum (cuối bước sẽ bật lại):</p>
${qo('P6F', 'P6C', 'P6O')}
<p class="meo">💡 <code>EXPLAIN ANALYZE</code> trên một lệnh INSERT thì chèn thật (bài 10.1) — ở đây đó chính là điều ta muốn: nó là lần nhập, và bản báo cáo chia nhỏ thời gian giúp ta.</p>
${details('Đáp án — P6 (đo lệnh INSERT)', qo('P6A', 'P6B', 'P6S') + '<p>Chỉ heap: <strong>101 ms</strong>. Bảng thật: <strong>2.354 ms</strong>, chậm hơn khoảng 23 lần — và bản báo cáo nói thời gian đi đâu. Nút <code>Insert on orders</code> (heap + identity + ba chỉ mục) mất 1.376 ms; dòng <code>Trigger for constraint orders_customer_id_fkey: time=957.852 calls=100000</code> là phần kiểm khoá ngoại, mỗi dòng một lần, mỗi lần một phép tra customer_pkey. Các chỉ mục cũng phình ra: chỉ mục bao phủ từ 39 MB lên 53 MB, chỉ mục partial từ 88 kB lên 2.272 kB — 100.000 đơn pending mới đúng là những dòng nó đánh chỉ mục. Nó sẽ nhỏ lại khi các đơn được thanh toán và VACUUM dọn mục cũ.</p>')}
<p>Đây là mặt chi phí của mọi chỉ mục trong lab, trả ở mọi lệnh ghi, mãi mãi. Với một lần nạp lớn vào bảng trống hoặc bảng mới, các nhóm thường xoá chỉ mục phụ, nạp, rồi dựng lại; với một bảng đang chạy như orders thì giữ chúng và chấp nhận hoá đơn — đó là lý do P2 và P4 đã bỏ những chỉ mục không ai cần.</p>
<p>Ngay sau lần nhập, thống kê của bộ lập kế hoạch đã cũ:</p>
${qo('P6T', 'P6X', 'P6Z', 'P6Y')}
<p><code>n_mod_since_analyze = 100003</code>: số dòng đã thay đổi từ lần ANALYZE gần nhất (autovacuum phân tích bảng lần cuối trước lần nhập, rồi ta tắt nó). Kế hoạch ước lượng <strong>3.625</strong> đơn pending và gặp <strong>103.124</strong> — gấp 28 lần. Ở đây Hash Join vẫn là kế hoạch đúng nên không có gì hỏng; ở bài 10.3, đúng loại sai này đã chọn Nested Loop và biến 35 ms thành 15 giây. Sau <code>ANALYZE orders</code> ước lượng là 102.850. Thói quen: <strong>ANALYZE ngay sau mỗi lần nạp hàng loạt</strong> — đừng chờ autovacuum.</p>

<h4>P7 — chỉ mục nào không ai dùng?</h4>
<p class="meo">💡 <code>pg_stat_user_indexes.idx_scan</code> đếm số lần mỗi chỉ mục được dùng (bài 9.3). <strong>Mới: <code>pg_stat_reset()</code></strong> đưa bộ đếm của CSDL hiện tại về 0, để ta chạy lại một "ngày" của ứng dụng và xem nó chạm vào đâu. <code>\\g /dev/null</code> chạy câu truy vấn trong psql rồi vứt các dòng kết quả đi. Mỗi phiên đẩy bộ đếm của mình lên tối đa mỗi giây một lần — vì thế có <code>pg_sleep(1)</code>.</p>
${details('Đáp án — P7', code(SOL.slice(SOL.indexOf('SELECT pg_sleep(1);   -- let'), SOL.indexOf('SELECT relname AS "table"')).trim()) + qo('P7A', 'P7D') + '<p><code>idx_customer_lower_email</code>: <strong>0</strong> — ứng dụng giờ đăng nhập bằng <code>email = lower($1)</code>, nên chỉ mục này chỉ còn tốn kém (3.992 kB và việc phải làm mỗi khi có khách mới). Bỏ. <code>customer_pkey</code> cũng hiện 0, nhưng nó giữ PRIMARY KEY, và 100.000 lần kiểm khoá ngoại của P6 đã dùng nó rất nhiều trước khi đặt lại bộ đếm: một "ngày" chạy lại là cửa sổ quá nhỏ. Trên máy chủ thật, đọc idx_scan qua nhiều tuần — trên mọi bản sao — và không bao giờ xoá chỉ mục đứng sau PRIMARY KEY hay UNIQUE.</p>')}

<h3>5 · Tự kiểm — trạng thái cuối của bạn phải khớp</h3>
${qo('SC1', 'SC2')}
<ol>
<li>Vì sao <code>order_item.order_id</code> không có trong danh sách rà, và vì sao <code>CREATE INDEX ON order_item (order_id)</code> là một sai lầm?</li>
<li>Sau P1 trang đã dùng chỉ mục và nhanh hơn 265 lần. Vì sao P2 vẫn thêm một chỉ mục khác — nút nào biến mất, và vì sao sau đó <code>LIMIT 20</code> dừng sớm được?</li>
<li>Kế hoạch của huy hiệu ghi Index Only Scan nhưng Heap Fetches: 3. Con số đó nghĩa là gì, và cái gì làm nó về 0?</li>
</ol>
${details('Đáp án', `<ol><li>Khoá chính (order_id, product_id) là một B-tree có cột đầu là order_id; mọi truy vấn hay phép kiểm khoá ngoại chỉ trên order_id đều dùng được nó. Thêm chỉ mục (order_id) không trả lời được gì mới mà làm chậm mọi INSERT.</li><li>Nút Sort. (customer_id) tìm được 57 đơn nhưng theo thứ tự trong chỉ mục, nên cả 57 phải sắp theo ngày. (customer_id, created_at DESC) giữ các mục của mỗi khách theo thứ tự mới nhất trước, nên phép quét trả dòng đúng thứ tự ORDER BY và Limit dừng sau 20 — 102 trang thay vì 279.</li><li>Ba dòng nằm trên các trang heap chưa được đánh dấu all-visible trong visibility map (các đơn mới), nên PostgreSQL phải kiểm chúng trong bảng. VACUUM đặt dấu all-visible; sau đó Heap Fetches là 0.</li></ol>`)}

<h3>6 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab5-solution.sql', code(SOL))}

<h3>7 · Bẫy</h3>
<div class="pitfall"><p><strong>Đánh chỉ mục mà không đo</strong> — ghi lại nút, số dòng bị loại, thời gian và Buffers trước khi sửa, rồi so đúng bốn thứ đó sau. Thời gian dao động giữa các lần chạy; số trang và dáng kế hoạch thì không.</p></div>
<div class="pitfall"><p><strong>Khoá ngoại không có chỉ mục</strong> — JOIN chậm, và một lần quét ngầm bảng con ở mỗi lệnh DELETE trên bảng cha (dòng "Trigger for constraint").</p></div>
<div class="pitfall"><p><strong>CREATE INDEX thường trên bảng lớn đang chạy</strong> — nó chặn ghi suốt lúc dựng. Dùng CONCURRENTLY, ngoài mọi giao dịch, và kiểm <code>indisvalid</code> nếu nó thất bại.</p></div>
<div class="pitfall"><p><strong>Chỉ mục thừa</strong> — (a) đứng cạnh (a, b), hay chỉ mục trên cột đầu của khoá chính: toàn chi phí ghi.</p></div>
<div class="pitfall"><p><strong>Chờ Index Only Scan trên bảng bận rộn</strong> — Heap Fetches tăng dần cho tới khi VACUUM đánh dấu trang all-visible.</p></div>
<div class="pitfall"><p><strong>Chỉ mục partial đằng sau một tham số</strong> — generic plan không chứng minh được <code>$1 = 'pending'</code>. Viết giá trị cố định thành hằng số.</p></div>
<div class="pitfall"><p><strong>Hàm hoặc phép ép kiểu bọc cột</strong> — <code>lower(email)</code>, <code>id = 999999.0</code>: chỉ mục thường bị bỏ qua. Biến đổi đầu vào, hoặc đánh chỉ mục cho biểu thức.</p></div>
<div class="pitfall"><p><strong>Quên ANALYZE sau một lần nạp lớn</strong> — bộ lập kế hoạch vẫn lập kế hoạch cho cái bảng của hôm qua.</p></div>
<div class="pitfall"><p><strong>Xoá chỉ mục vì idx_scan = 0 sau một khoảng ngắn</strong> — và không bao giờ xoá chỉ mục đứng sau PRIMARY KEY / UNIQUE.</p></div>

<h3>8 · Thử thách thêm — và tiếp theo: Lab 6</h3>
<ul>
<li><strong>Thử thách 1</strong> — "những đơn nào có sổ Moleskine (sku CT0906)?" dùng <code>order_item.product_id</code>, khoá ngoại còn lại trong danh sách rà. Đo, rồi quyết định: có nên đánh chỉ mục không? (Gợi ý: 48 sản phẩm chia nhau 2.500.000 dòng — một sản phẩm chọn lọc được bao nhiêu?)</li>
<li><strong>Thử thách 2</strong> — báo cáo doanh thu theo ngày lọc <code>payment.paid_at</code> theo khoảng. So một chỉ mục B-tree với một chỉ mục BRIN (bài 9.4) trên cột đó: kích thước, số trang đọc, và vì sao BRIN hợp ở đây (paid_at tăng theo id).</li>
</ul>
<p>Lab 6, sau Chương 12, quay về cửa hàng cỡ bình thường và làm nó <em>đúng khi chạy đồng thời</em>: đặt hàng trong một giao dịch, trừ kho bằng <code>FOR UPDATE</code>, một hàm tính tổng đơn, một trigger ghi <code>stock_movement</code>, và các view cho báo cáo. <code>lab6-start.sql</code> dựng lại shop ở cỡ chuẩn, nên một triệu đơn của lab này có thể bỏ: <code>DROP SCHEMA shop CASCADE</code> giải phóng khoảng 500 MB.</p>
</div>
`;

export default {
  title: 'Lab 5 — CT Shop: one million orders — indexes and EXPLAIN|||Lab 5 — CT Shop: một triệu đơn — chỉ mục và EXPLAIN',
  slug: 'postgresql-lab-5-chi-muc-explain-ct-shop',
  type: 'LESSON',
  description: 'Lab dự án CT Shop sau Chương 10: phóng cửa hàng lên 1 triệu đơn (tất định), rồi đo → đọc kế hoạch → sửa → đo lại: rà khoá ngoại thiếu chỉ mục, trang "Đơn của tôi" 98,8 ms → 0,19 ms (Seq Scan → chỉ mục tổ hợp customer_id, created_at DESC, hết nút Sort), trigger khoá ngoại khi xoá khách 74,6 → 0,2 ms, CREATE INDEX CONCURRENTLY; covering INCLUDE ⇒ Index Only Scan, Heap Fetches 3 → 0 sau VACUUM; partial index 88 kB thay 31 MB cho hàng chờ pending + bẫy generic plan; đăng nhập lower(email) và cách sửa không cần chỉ mục mới, bẫy 999999.0; flash sale 100.000 đơn — chi phí INSERT (heap 101 ms vs 2.354 ms, trigger FK 958 ms), thống kê cũ ⇒ ANALYZE; chỉ mục idx_scan = 0; Prisma @@index sinh SQL gì + log → EXPLAIN (GENERIC_PLAN). Output thật PostgreSQL 17.',
  content: `${G}${EN}${VI}`,
};
