\set ON_ERROR_STOP on
\pset pager off
DROP TABLE IF EXISTS orders, customers CASCADE;

CREATE TABLE customers (
  id      INT PRIMARY KEY,
  city    TEXT NOT NULL,
  country TEXT NOT NULL,
  tier    TEXT NOT NULL
);
-- city and tier are perfectly correlated: index g % 3 drives both.
INSERT INTO customers
SELECT g,
       (ARRAY['Hanoi','Danang','Hue'])[1 + g % 3],
       'VN',
       (ARRAY['gold','silver','bronze'])[1 + g % 3]
FROM generate_series(1, 20000) g;

CREATE TABLE orders (
  id          INT PRIMARY KEY,
  customer_id INT NOT NULL,
  total       NUMERIC(10,2) NOT NULL,
  status      TEXT NOT NULL,
  placed_at   DATE NOT NULL
);
INSERT INTO orders
SELECT g,
       1 + g % 20000,
       (g % 500) + 1,
       (ARRAY['new','paid','shipped','cancelled'])[1 + g % 4],
       DATE '2026-01-01' + (g % 180)
FROM generate_series(1, 200000) g;

CREATE INDEX ix_orders_customer ON orders(customer_id);
CREATE INDEX ix_orders_placed   ON orders(placed_at);
ANALYZE customers;
ANALYZE orders;

-- Reports the shape of a plan plus three numbers that repeat exactly run to run:
-- what the planner ESTIMATED, what it ACTUALLY produced, and how many rows the
-- underlying scan really had to read. Timings and buffers are not reproducible,
-- so nothing here asserts on them.
CREATE OR REPLACE FUNCTION plan_facts(q TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE j JSONB; p JSONB; scanned BIGINT;
BEGIN
  EXECUTE 'EXPLAIN (ANALYZE, TIMING OFF, FORMAT JSON) ' || q INTO j;
  p := j->0->'Plan';
  -- Rows the scan actually READ. A node's "Actual Rows" is what it emitted
  -- AFTER its filter, so a sequential scan of 200,000 rows that keeps 10
  -- reports 10 — the rows it discarded have to be added back, or the number
  -- says the opposite of what it looks like.
  SELECT max(((v->>'Actual Rows')::bigint) + COALESCE((v->>'Rows Removed by Filter')::bigint, 0)) INTO scanned
  FROM jsonb_path_query(j, '$.**') AS t(v)
  WHERE v ? 'Actual Rows' AND (v->>'Node Type') LIKE '%Scan%';
  RETURN (p->>'Node Type') || ' est=' || (p->>'Plan Rows') || ' actual=' || (p->>'Actual Rows')
         || ' scanned=' || COALESCE(scanned::text, 'n/a');
END; $$;

-- Lists every node type in the plan, which is how the join strategy and any
-- sort or materialise steps become visible.
CREATE OR REPLACE FUNCTION plan_nodes(q TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE j JSONB; s TEXT;
BEGIN
  EXECUTE 'EXPLAIN (COSTS OFF, FORMAT JSON) ' || q INTO j;
  SELECT string_agg(DISTINCT v->>'Node Type', ',' ORDER BY v->>'Node Type') INTO s
  FROM jsonb_path_query(j, '$.**') AS t(v)
  WHERE v ? 'Node Type';
  RETURN s;
END; $$;

-- Total work: every scan node's rows read, multiplied by how many times that
-- node ran. A per-row subquery reports tiny numbers per execution, so without
-- the loop multiplier its true cost is invisible.
CREATE OR REPLACE FUNCTION plan_work(q TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE j JSONB; p JSONB; work BIGINT;
BEGIN
  EXECUTE 'EXPLAIN (ANALYZE, TIMING OFF, FORMAT JSON) ' || q INTO j;
  p := j->0->'Plan';
  SELECT sum(((v->>'Actual Rows')::bigint + COALESCE((v->>'Rows Removed by Filter')::bigint, 0))
             * COALESCE((v->>'Actual Loops')::bigint, 1)) INTO work
  FROM jsonb_path_query(j, '$.**') AS t(v)
  WHERE v ? 'Actual Rows' AND (v->>'Node Type') LIKE '%Scan%';
  RETURN (p->>'Node Type') || ' rows=' || (p->>'Actual Rows') || ' work=' || work;
END; $$;

SET max_parallel_workers_per_gather = 0;

\echo '===== EX 1: Read an EXPLAIN ANALYZE Before Changing Anything ====='
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7') AS selective;
SELECT plan_facts('SELECT * FROM orders WHERE status = ''paid''') AS broad;
SELECT plan_facts('SELECT count(*) FROM orders WHERE placed_at >= DATE ''2026-06-01''') AS aggregate;
SELECT plan_nodes('SELECT count(*) FROM orders WHERE placed_at >= DATE ''2026-06-01''') AS nodes;
SELECT (SELECT count(*) FROM orders WHERE customer_id = 7) AS rows_customer, (SELECT count(*) FROM orders WHERE status = 'paid') AS rows_paid;

\echo '===== EX 2: Stop Writing Predicates That Disable Your Index ====='
SELECT plan_facts('SELECT * FROM orders WHERE customer_id::text = ''7''') AS cast_column;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7') AS plain;
SELECT plan_facts('SELECT * FROM orders WHERE date_trunc(''day'', placed_at) = DATE ''2026-03-01''') AS fn_on_column;
SELECT plan_facts('SELECT * FROM orders WHERE placed_at >= DATE ''2026-03-01'' AND placed_at < DATE ''2026-03-02''') AS range;
SELECT plan_facts('SELECT * FROM orders WHERE status LIKE ''%aid''') AS leading_wildcard;
SELECT plan_facts('SELECT * FROM orders WHERE status LIKE ''pai%''') AS prefix;
SELECT (SELECT count(*) FROM orders WHERE date_trunc('day', placed_at) = DATE '2026-03-01') = (SELECT count(*) FROM orders WHERE placed_at >= DATE '2026-03-01' AND placed_at < DATE '2026-03-02') AS same_answer;

\echo '===== EX 3: Fix a Wrong Estimate with Extended Statistics ====='
SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi'' AND tier = ''gold''') AS naive;
SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi''') AS single;
DROP STATISTICS IF EXISTS st_city_tier;
CREATE STATISTICS st_city_tier (dependencies, mcv) ON city, tier FROM customers;
ANALYZE customers;
SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi'' AND tier = ''gold''') AS corrected;
SELECT count(*) AS truth FROM customers WHERE city = 'Hanoi' AND tier = 'gold';
SELECT count(*) AS ndistinct FROM (SELECT DISTINCT city, tier FROM customers) s;

\echo '===== EX 4: Understand Why the Planner Switches Join Algorithms ====='
SELECT plan_nodes('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5') AS one_customer;
SELECT plan_nodes('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS whole_table;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5') AS facts_one;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS facts_all;
SET enable_hashjoin = off;
SET enable_mergejoin = off;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS forced_loop;
RESET ALL;
SELECT (SELECT count(*) FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5) AS rows_one, (SELECT count(*) FROM orders o JOIN customers c ON c.id = o.customer_id) AS rows_all;

\echo '===== EX 5: Replace Deep OFFSET Pagination with a Keyset Cursor ====='
SELECT plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20') AS page1;
SELECT plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000') AS deep;
SELECT plan_facts('SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20') AS keyset;
SELECT (SELECT id FROM orders ORDER BY id LIMIT 1 OFFSET 100000) = (SELECT id FROM orders WHERE id > 100000 ORDER BY id LIMIT 1) AS same_ids;
SELECT count(*) AS counted FROM orders;

\echo '===== EX 6: Ask Whether Any Row Exists Without Counting Them All ====='
SELECT plan_facts('SELECT EXISTS (SELECT 1 FROM orders WHERE customer_id = 7)') AS exists_form;
SELECT plan_facts('SELECT count(*) > 0 FROM orders WHERE customer_id = 7') AS count_form;
SELECT plan_nodes('SELECT c.id FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total > 400)') AS flattened;
SELECT count(*) AS not_in_null FROM customers WHERE id NOT IN (1, 2, NULL);
SELECT count(*) AS not_exists FROM customers c WHERE NOT EXISTS (SELECT 1 FROM (VALUES (1), (2)) AS t(id) WHERE t.id = c.id);

\echo '===== EX 7: Rewrite an OR That Blocks Both Indexes ====='
SELECT plan_nodes('SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE ''2026-03-01''') AS or_two_columns;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE ''2026-03-01''') AS facts_or;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7 UNION SELECT * FROM orders WHERE placed_at = DATE ''2026-03-01''') AS union_rewrite;
SELECT (SELECT count(*) FROM (SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE '2026-03-01') a) = (SELECT count(*) FROM (SELECT * FROM orders WHERE customer_id = 7 UNION SELECT * FROM orders WHERE placed_at = DATE '2026-03-01') b) AS same_rows;
SELECT plan_nodes('SELECT * FROM orders WHERE customer_id = 7 OR customer_id = 99') AS or_same_column;
SELECT plan_nodes('SELECT * FROM orders WHERE customer_id IN (7, 99)') AS in_list;

\echo '===== EX 8: Measure Whether the Join Rewrite Actually Wins ====='
SELECT plan_work($q$ SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS correlated;
SELECT plan_work($q$ WITH lifetime AS (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) SELECT c.id, l.n FROM customers c LEFT JOIN lifetime l ON l.customer_id = c.id WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS joined;
DROP INDEX ix_orders_customer;
ANALYZE orders;
SELECT plan_work($q$ SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS correlated_noindex;
SELECT plan_work($q$ WITH lifetime AS (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) SELECT c.id, l.n FROM customers c LEFT JOIN lifetime l ON l.customer_id = c.id WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS joined_noindex;
CREATE INDEX ix_orders_customer ON orders(customer_id);
ANALYZE orders;
SELECT (SELECT sum((SELECT count(*) FROM orders o WHERE o.customer_id = c.id)) FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold') = (SELECT sum(l.n) FROM customers c LEFT JOIN (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) l ON l.customer_id = c.id WHERE c.city = 'Hanoi' AND c.tier = 'gold') AS same_answer;

\echo '===== EX 9: Control Whether a CTE Is Inlined or Materialised ====='
SELECT plan_facts($q$ WITH x AS (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7 $q$) AS inlined;
SELECT plan_facts($q$ WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7 $q$) AS materialised;
SELECT plan_nodes($q$ WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7 $q$) AS nodes_mat;
SELECT (SELECT count(*) FROM (WITH x AS (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7) a) = (SELECT count(*) FROM (WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7) b) AS same_rows;
SELECT plan_facts($q$ WITH totals AS MATERIALIZED (SELECT customer_id, sum(total) AS spend FROM orders GROUP BY customer_id) SELECT count(*) FROM totals a JOIN totals b ON b.spend > a.spend AND b.customer_id = a.customer_id + 1 $q$) AS twice;

\echo '===== EX 10: Capstone: Diagnose and Fix a Slow Report ====='
SELECT plan_work($q$ SELECT c.id, c.city, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS before;
SELECT plan_work($q$ SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY lifetime_orders DESC, c.id LIMIT 10 $q$) AS lifetime_only;
SELECT plan_work($q$ SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS march_only;
SELECT plan_work($q$ SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS sargable;
DROP INDEX IF EXISTS ix_orders_cust_placed;
CREATE INDEX ix_orders_cust_placed ON orders(customer_id, placed_at) INCLUDE (total);
ANALYZE orders;
SELECT plan_work($q$ SELECT c.id, c.city, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS with_index;
WITH original AS (SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10), fixed AS (SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10) SELECT (SELECT array_agg(id ORDER BY id) FROM original) = (SELECT array_agg(id ORDER BY id) FROM fixed) AS same_result;
