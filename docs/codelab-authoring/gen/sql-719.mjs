// SQL module 719 (query-optimization-and-performance-tuning) — 10 exercises. PostgreSQL.
// Every estimate, actual-row count and "scanned" figure below was produced by running the
// exercise against a real postgres:16 server with the 200,000-row orders table the setup
// builds. Plans are read through helpers that report structure and row counts, because
// those repeat exactly; timings and buffer counts do not.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'query-optimization-and-performance-tuning';

const SETUP = `DROP TABLE IF EXISTS orders, customers CASCADE;

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

SET max_parallel_workers_per_gather = 0;`;

const ex = [
  {
    title: 'Read an EXPLAIN ANALYZE Before Changing Anything',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['estimated versus actual rows', 'plan tree reads bottom-up', 'rows scanned versus rows returned', 'EXPLAIN versus EXPLAIN ANALYZE', 'optimising by measurement'],
    prerequisites: ['SELECT', 'basic indexes'],
    tags: ['explain', 'performance', 'postgres', 'diagnosis', 'planning'],
    problemHtml: `<p>Every optimisation starts with the same step: ask the server what it is actually doing. <code>EXPLAIN</code> shows the plan the planner chose along with its <em>estimates</em>; <code>EXPLAIN ANALYZE</code> runs the query and adds what really happened. The gap between the two numbers is the single most informative thing on the page — a planner working from wrong estimates will choose a wrong plan no matter how many indexes you add.</p>
<p>Using the <code>plan_facts</code> helper the setup provides, which reports the top node, the estimated rows, the actual rows and how many rows the underlying scan had to read:</p>
<ul>
<li>Print <code>selective ...</code> for <code>SELECT * FROM orders WHERE customer_id = 7</code>.</li>
<li>Print <code>broad ...</code> for <code>SELECT * FROM orders WHERE status = 'paid'</code>.</li>
<li>Print <code>aggregate ...</code> for <code>SELECT count(*) FROM orders WHERE placed_at >= DATE '2026-06-01'</code>. Compare <code>actual</code> — one row — with <code>scanned</code>, and note that a query returning a single row can still read a great many.</li>
<li>Print <code>nodes ...</code> using <code>plan_nodes</code> for the aggregate query, to see the whole plan tree rather than only its top.</li>
<li>Finally print <code>rowcounts N M</code> — the true number of rows matching each of the first two filters — so the estimates can be judged against reality.</li>
</ul>`,
    inputSpec: 'The orders table: 200,000 rows, customer_id cycling 1–20000 (10 rows each), status cycling over four values (50,000 each), placed_at spanning 180 days from 2026-01-01. Indexes exist on customer_id and placed_at.',
    outputSpec:
      'The selective filter is a Bitmap Heap Scan estimating and returning 10 rows; the broad filter is a Seq Scan returning 50,000 after reading all 200,000; the aggregate returns one row after scanning 32,219; the plan tree for it shows an Aggregate above a bitmap scan; and the counts confirm 10 and 50,000.',
    constraints: 'Do not add indexes or change any setting in this exercise. Read the plans and report them.',
    examplesJson: [
      { input: "plan_facts('SELECT * FROM orders WHERE customer_id = 7')", output: 'Bitmap Heap Scan est=10 actual=10 scanned=10', explanation: 'A good estimate and a targeted read — the planner knew what it would find.' },
      { input: "plan_facts('SELECT * FROM orders WHERE status = ''paid''')", output: 'Seq Scan est=49860 actual=50000 scanned=200000', explanation: 'A quarter of the table is not worth an index lookup. Note that scanned is 200,000: the scan read every row and discarded three quarters of them.' },
      { input: "plan_facts for count(*) over a date range", output: 'Aggregate est=1 actual=1 scanned=32219', explanation: 'The result is one row, but the work is proportional to the rows read — which is why "it returns one row" says nothing about cost.' },
    ],
    hintsJson: [
      'EXPLAIN alone shows estimates; EXPLAIN ANALYZE runs the query and adds actuals.',
      'Read a plan tree from the innermost node outwards — that is execution order.',
      'The rows a query returns and the rows it reads are different numbers; the second one drives cost.',
      'Compare est with actual before blaming the indexes: a wrong estimate is a different problem.',
    ],
    solution: `SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7')                       AS selective;
SELECT plan_facts('SELECT * FROM orders WHERE status = ''paid''')                     AS broad;
SELECT plan_facts('SELECT count(*) FROM orders WHERE placed_at >= DATE ''2026-06-01''') AS aggregate;
SELECT plan_nodes('SELECT count(*) FROM orders WHERE placed_at >= DATE ''2026-06-01''') AS nodes;

SELECT (SELECT count(*) FROM orders WHERE customer_id = 7) AS rows_customer,
       (SELECT count(*) FROM orders WHERE status = 'paid') AS rows_paid;`,
    solutionExplanationHtml: `<p>Three numbers carry most of the diagnostic value. <strong>Estimated</strong> rows is what the planner believed before running; <strong>actual</strong> is what came out; <strong>scanned</strong> is what the underlying scan had to read to produce it. Their relationships answer different questions. Estimate far from actual means the planner is working from bad information — statistics, correlation, or a predicate it cannot reason about — and no index will fix a plan chosen on false premises. Scanned far above actual means the query is reading much more than it returns, which is the classic signature of a missing or unusable index.</p>
<p>The aggregate makes the second point unmissable: it returns exactly one row while reading tens of thousands. "The query only returns one row" is one of the most misleading sentences in performance work, and the <code>scanned</code> figure is the correction.</p>
<p>Plans are trees, and they execute from the leaves upward: the scan produces rows, a filter or aggregate consumes them, a sort or limit sits above that. Reading them innermost-first is the habit that makes a long plan legible, and <code>plan_nodes</code> here shows the whole set of steps rather than just the top — an <code>Aggregate</code> sitting above a scan.</p>
<p>Two practical notes on the tool itself. <code>EXPLAIN ANALYZE</code> <em>runs</em> the query, so it must not be used casually on a statement with side effects — wrap it in a transaction and roll back when analysing an <code>UPDATE</code> or <code>DELETE</code>. And on a plan with loops, the per-node row counts are <strong>per loop</strong>: a node showing 10 rows with <code>loops=1000</code> produced ten thousand, a subtlety that makes nested-loop joins look far cheaper than they are until you notice it.</p>`,
    diagramMermaid: `flowchart TD
  A[EXPLAIN ANALYZE] --> B[estimated rows]
  A --> C[actual rows]
  A --> D[rows scanned]
  B --> E{est far from actual}
  E -->|yes| F[statistics problem not an index problem]
  D --> G{scanned far above actual}
  G -->|yes| H[missing or unusable index]`,
    check: `SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7') AS selective;
SELECT plan_facts('SELECT * FROM orders WHERE status = ''paid''') AS broad;
SELECT plan_facts('SELECT count(*) FROM orders WHERE placed_at >= DATE ''2026-06-01''') AS aggregate;
SELECT plan_nodes('SELECT count(*) FROM orders WHERE placed_at >= DATE ''2026-06-01''') AS nodes;
SELECT (SELECT count(*) FROM orders WHERE customer_id = 7) AS rows_customer, (SELECT count(*) FROM orders WHERE status = 'paid') AS rows_paid;`,
  },
  {
    title: 'Stop Writing Predicates That Disable Your Index',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['sargable predicates', 'casting the column instead of the value', 'functions on the indexed column', 'leading wildcard LIKE', 'rewriting a range instead'],
    prerequisites: ['indexes', 'reading plans'],
    tags: ['index', 'sargable', 'performance', 'postgres', 'query-writing'],
    problemHtml: `<p>An index stores column values. The moment a predicate transforms the column — a cast, a function, a concatenation — the stored values no longer match what is being compared, and the index becomes unusable. Such a predicate is called non-<em>sargable</em>, and it is the most common way a perfectly good index is quietly ignored.</p>
<p>Compare each pair with <code>plan_facts</code> and print, one per line:</p>
<ul>
<li><code>cast_column ...</code> for <code>WHERE customer_id::text = '7'</code> and <code>plain ...</code> for <code>WHERE customer_id = 7</code>.</li>
<li><code>fn_on_column ...</code> for <code>WHERE date_trunc('day', placed_at) = DATE '2026-03-01'</code> and <code>range ...</code> for the equivalent half-open range <code>placed_at &gt;= DATE '2026-03-01' AND placed_at &lt; DATE '2026-03-02'</code>.</li>
<li><code>leading_wildcard ...</code> for <code>WHERE status LIKE '%aid'</code> and <code>prefix ...</code> for <code>WHERE status LIKE 'pai%'</code>.</li>
<li>Print <code>same_answer ...</code> — whether the function form and the range form return the same row count — to show the rewrite changed the plan and not the result.</li>
</ul>`,
    inputSpec: 'The orders table with indexes on customer_id and placed_at; status has no index.',
    outputSpec:
      'The cast on the column forces a sequential scan with a badly wrong estimate while the plain comparison uses the index; wrapping the date column in date_trunc forces a scan while the half-open range uses the index; both LIKE forms scan because status is unindexed; and both date forms return the same count.',
    constraints: 'Do not create indexes to fix these — the point is to rewrite the predicate. Keep the rewritten query logically identical.',
    examplesJson: [
      { input: "plan_facts('SELECT * FROM orders WHERE customer_id::text = ''7''')", output: 'Seq Scan est=1000 actual=10 scanned=200000', explanation: 'The cast hides the column from the index, and the planner cannot estimate a transformed value either — it guessed 1000 and got 10.' },
      { input: "plan_facts('SELECT * FROM orders WHERE customer_id = 7')", output: 'Bitmap Heap Scan est=10 actual=10 scanned=10', explanation: 'Comparing the column directly lets the index do the work and the estimate is exact.' },
      { input: 'date_trunc on the column versus a half-open range', output: 'Seq Scan versus a Bitmap Heap Scan, with the same row count returned', explanation: 'The rewrite is the standard fix: never transform the column, express the same condition as a range over it.' },
    ],
    hintsJson: [
      'Cast the value to the column type, never the column to the value type.',
      'Replace f(column) = x with a range on column whenever f is monotonic, such as a date truncation.',
      'A leading wildcard cannot use a B-tree at all — that is what trigram indexes are for.',
      'Check the estimate as well as the plan: a transformed predicate also destroys the row estimate.',
    ],
    solution: `SELECT plan_facts('SELECT * FROM orders WHERE customer_id::text = ''7''') AS cast_column;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7')           AS plain;

SELECT plan_facts('SELECT * FROM orders WHERE date_trunc(''day'', placed_at) = DATE ''2026-03-01''') AS fn_on_column;
SELECT plan_facts('SELECT * FROM orders WHERE placed_at >= DATE ''2026-03-01'' AND placed_at < DATE ''2026-03-02''') AS range;

SELECT plan_facts('SELECT * FROM orders WHERE status LIKE ''%aid''') AS leading_wildcard;
SELECT plan_facts('SELECT * FROM orders WHERE status LIKE ''pai%''') AS prefix;

SELECT (SELECT count(*) FROM orders WHERE date_trunc('day', placed_at) = DATE '2026-03-01')
     = (SELECT count(*) FROM orders WHERE placed_at >= DATE '2026-03-01' AND placed_at < DATE '2026-03-02')
       AS same_answer;`,
    solutionExplanationHtml: `<p>The rule is short: <strong>never transform the indexed column</strong>. An index on <code>customer_id</code> contains integers; <code>customer_id::text</code> asks about strings, which are not in it, so the server must compute the cast for all 200,000 rows. The fix is always to move the transformation to the other side — compare the column to a value of its own type, and let the value be cast at planning time.</p>
<p>The damage is not only to the plan. Look at the estimate on the cast version: 1000 predicted against 10 actual. Statistics are gathered on column values, so a transformed expression has none, and the planner falls back to a generic guess. A wrong estimate propagates upward, and in a larger query it is what turns a sensible nested loop into a catastrophic one — which is why a non-sargable predicate buried in a join condition can be far more expensive than this example suggests.</p>
<p>The date case is the one that appears in almost every reporting codebase. <code>date_trunc('day', placed_at) = '2026-03-01'</code> reads naturally and disables the index; the half-open range <code>&gt;= '2026-03-01' AND &lt; '2026-03-02'</code> says exactly the same thing in terms the index understands. Prefer half-open ranges to <code>BETWEEN</code> for timestamps, since <code>BETWEEN</code> includes the upper bound and quietly captures midnight of the next day.</p>
<p>The <code>LIKE</code> pair shows the boundary of the technique. A prefix pattern is a range and a B-tree can serve it (given an index and a suitable collation or <code>text_pattern_ops</code>); a leading wildcard is not a range at all and no B-tree can help, which is what trigram indexes (<code>pg_trgm</code>) exist for. Here neither uses an index because <code>status</code> has none — a reminder that "it scanned" has two possible causes, and the plan does not distinguish "predicate unusable" from "index absent" unless you know which indexes exist.</p>`,
    check: `SELECT plan_facts('SELECT * FROM orders WHERE customer_id::text = ''7''') AS cast_column;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7') AS plain;
SELECT plan_facts('SELECT * FROM orders WHERE date_trunc(''day'', placed_at) = DATE ''2026-03-01''') AS fn_on_column;
SELECT plan_facts('SELECT * FROM orders WHERE placed_at >= DATE ''2026-03-01'' AND placed_at < DATE ''2026-03-02''') AS range;
SELECT plan_facts('SELECT * FROM orders WHERE status LIKE ''%aid''') AS leading_wildcard;
SELECT plan_facts('SELECT * FROM orders WHERE status LIKE ''pai%''') AS prefix;
SELECT (SELECT count(*) FROM orders WHERE date_trunc('day', placed_at) = DATE '2026-03-01') = (SELECT count(*) FROM orders WHERE placed_at >= DATE '2026-03-01' AND placed_at < DATE '2026-03-02') AS same_answer;`,
  },
  {
    title: 'Fix a Wrong Estimate with Extended Statistics',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['independence assumption', 'correlated columns', 'CREATE STATISTICS', 'functional dependencies', 'estimates drive plan choice'],
    prerequisites: ['reading EXPLAIN ANALYZE', 'ANALYZE'],
    tags: ['statistics', 'estimation', 'performance', 'postgres', 'planner'],
    problemHtml: `<p>The planner estimates a multi-column filter by assuming the columns are <strong>independent</strong>: if a third of rows are in Hanoi and a third are gold-tier, it predicts a ninth match both. When the columns are correlated that assumption is wrong, and every plan built on the estimate is wrong with it.</p>
<p>In this dataset <code>city</code> and <code>tier</code> are perfectly correlated — every Hanoi customer is gold — so the true answer is a third, not a ninth.</p>
<ul>
<li>Print <code>naive ...</code> — <code>plan_facts</code> for <code>SELECT * FROM customers WHERE city = 'Hanoi' AND tier = 'gold'</code>. Compare the estimate with the actual.</li>
<li>Print <code>single ...</code> for the same query with only <code>city = 'Hanoi'</code>, to confirm single-column statistics are accurate.</li>
<li>Create extended statistics: <code>CREATE STATISTICS st_city_tier (dependencies, mcv) ON city, tier FROM customers</code>, then run <code>ANALYZE customers</code>.</li>
<li>Print <code>corrected ...</code> — the same two-column query again.</li>
<li>Print <code>truth N</code>, the real row count, and <code>ndistinct ...</code> — the number of distinct (city, tier) pairs, which is the fact the planner was missing.</li>
</ul>`,
    inputSpec: 'The customers table: 20,000 rows where city and tier are driven by the same expression, so there are only three (city, tier) combinations, not nine.',
    outputSpec:
      'Before the extended statistics the planner estimates about a ninth of the table (roughly 2,222) while 6,666 rows match; the single-column estimate is accurate; after CREATE STATISTICS and ANALYZE the estimate matches the actual exactly; and there are 3 distinct pairs.',
    constraints: 'Do not rewrite the query or add indexes. The estimate must be fixed with statistics.',
    examplesJson: [
      { input: "plan_facts for city = 'Hanoi' AND tier = 'gold'", output: 'Seq Scan est=2222 actual=6666', explanation: 'A third times a third gives a ninth — the independence assumption, applied to columns that are not independent.' },
      { input: 'the same query after CREATE STATISTICS ... ON city, tier', output: 'Seq Scan est=6666 actual=6666', explanation: 'With the dependency recorded, the planner predicts the real selectivity exactly.' },
      { input: 'counting distinct (city, tier) pairs', output: '3', explanation: 'Nine combinations are possible and only three occur — precisely the information the default statistics cannot represent.' },
    ],
    hintsJson: [
      'The planner multiplies per-column selectivities unless told the columns are related.',
      'CREATE STATISTICS (dependencies, mcv) ON a, b FROM t records the relationship.',
      'Extended statistics only take effect after the next ANALYZE.',
      'Check a single-column estimate first — if that is accurate, the problem is correlation, not stale statistics.',
    ],
    solution: `SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi'' AND tier = ''gold''') AS naive;
SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi''')                       AS single;

DROP STATISTICS IF EXISTS st_city_tier;
CREATE STATISTICS st_city_tier (dependencies, mcv) ON city, tier FROM customers;
ANALYZE customers;

SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi'' AND tier = ''gold''') AS corrected;

SELECT count(*) AS truth FROM customers WHERE city = 'Hanoi' AND tier = 'gold';
SELECT count(*) AS ndistinct FROM (SELECT DISTINCT city, tier FROM customers) s;`,
    solutionExplanationHtml: `<p>The independence assumption is a reasonable default and a frequent source of bad plans, because real schemas are full of correlated columns: city and postcode, country and currency, product and category, status and date. Multiplying selectivities under-estimates by exactly the degree of correlation — here a factor of three, and in wider filters the error compounds column by column.</p>
<p>An under-estimate is dangerous in a specific way. Believing a branch will produce 2,000 rows, the planner may choose a nested loop that would be excellent for 2,000 and disastrous for 200,000; it may choose a hash join and size the hash table for a fraction of the data, spilling to disk; it may pick an index scan where a sequential scan was right. The visible symptom is a query that is fast on a small table and collapses at scale — not because the data grew, but because the error grew with it.</p>
<p><code>CREATE STATISTICS</code> teaches the planner what it could not infer. <code>dependencies</code> records functional dependencies ("city determines tier"), <code>mcv</code> records the most common <em>combinations</em>, and <code>ndistinct</code> records how many distinct combinations exist — useful for <code>GROUP BY</code> estimates. They take effect only after the next <code>ANALYZE</code>, which is the step people forget when the statistics appear to do nothing.</p>
<p>The diagnostic order matters more than the fix. Check the single-column estimate first: if it is accurate, statistics are fresh and the problem is correlation. If it is also wrong, the table simply needs <code>ANALYZE</code> — stale statistics after a bulk load are the more common cause and the cheaper fix. Only when the estimate is right and the plan is still bad does the problem move on to indexes or query structure.</p>`,
    diagramMermaid: `flowchart TD
  A[filter on city and tier] --> B[planner multiplies selectivities]
  B --> C[one third times one third gives one ninth]
  C --> D[estimate 2222 against 6666 actual]
  D --> E[plans chosen for the wrong data volume]
  F[CREATE STATISTICS on city and tier] --> G[ANALYZE records the dependency]
  G --> H[estimate matches reality]`,
    check: `SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi'' AND tier = ''gold''') AS naive;
SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi''') AS single;
DROP STATISTICS IF EXISTS st_city_tier;
CREATE STATISTICS st_city_tier (dependencies, mcv) ON city, tier FROM customers;
ANALYZE customers;
SELECT plan_facts('SELECT * FROM customers WHERE city = ''Hanoi'' AND tier = ''gold''') AS corrected;
SELECT count(*) AS truth FROM customers WHERE city = 'Hanoi' AND tier = 'gold';
SELECT count(*) AS ndistinct FROM (SELECT DISTINCT city, tier FROM customers) s;`,
  },
  {
    title: 'Understand Why the Planner Switches Join Algorithms',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['nested loop', 'hash join', 'merge join', 'row counts drive the choice', 'loops multiply per-node rows'],
    prerequisites: ['joins', 'reading plans'],
    tags: ['join', 'planner', 'performance', 'postgres', 'explain'],
    problemHtml: `<p>PostgreSQL has three ways to join and no preference among them — it picks by estimated cost, which is driven almost entirely by how many rows each side produces. A <strong>nested loop</strong> probes the inner side once per outer row and wins when the outer side is tiny. A <strong>hash join</strong> builds a hash table from one side and scans the other once, winning when both sides are large. A <strong>merge join</strong> walks two sorted inputs in step, winning when the inputs are already ordered.</p>
<ul>
<li>Print <code>one_customer ...</code> using <code>plan_nodes</code> for a join restricted to a single customer: <code>SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5</code>.</li>
<li>Print <code>whole_table ...</code> for the same join with no restriction.</li>
<li>Print <code>facts_one ...</code> and <code>facts_all ...</code> with <code>plan_facts</code> for those two queries, so the row volumes behind the choice are visible.</li>
<li>Force the wrong strategy to see the cost model's reasoning: <code>SET enable_hashjoin = off; SET enable_mergejoin = off;</code> then print <code>forced_loop ...</code> with <code>plan_facts</code> for the unrestricted join. Reset both afterwards with <code>RESET ALL</code>.</li>
<li>Print <code>rows_one N</code> and <code>rows_all N</code>, the true result sizes.</li>
</ul>`,
    inputSpec: 'orders (200,000 rows) joined to customers (20,000 rows) on customer_id, with an index on orders.customer_id.',
    outputSpec:
      'The single-customer join is a Nested Loop returning 10 rows; the unrestricted join is a Hash Join returning 200,000; forcing a nested loop for the unrestricted join produces the same 200,000 rows through a far more expensive plan; and the true result sizes are 10 and 200,000.',
    constraints: 'Use the enable_* settings only to demonstrate, and reset them. Never leave them off in real code.',
    examplesJson: [
      { input: 'plan_nodes for the join restricted to one customer', output: 'includes Nested Loop', explanation: 'One outer row means one index probe into orders — the cheapest possible join.' },
      { input: 'plan_nodes for the unrestricted join', output: 'includes Hash Join', explanation: 'With 20,000 outer rows a nested loop would mean 20,000 probes, so the planner builds a hash table instead.' },
      { input: 'the unrestricted join with hash and merge joins disabled', output: 'Nested Loop returning the same 200,000 rows', explanation: 'The result is identical and the work is not — which is exactly the judgement the cost model is making for you.' },
    ],
    hintsJson: [
      'plan_nodes lists every node type in the plan, which is where the join strategy appears.',
      'A nested loop is cheap only when the outer side is small — its cost is outer rows times the inner lookup.',
      'A hash join reads each side once but needs memory for the hash table.',
      'enable_hashjoin and enable_mergejoin are diagnostic switches, never a production fix.',
    ],
    solution: `SELECT plan_nodes('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5') AS one_customer;
SELECT plan_nodes('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id')                     AS whole_table;

SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5') AS facts_one;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id')                AS facts_all;

SET enable_hashjoin = off;
SET enable_mergejoin = off;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS forced_loop;
RESET ALL;

SELECT (SELECT count(*) FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5) AS rows_one,
       (SELECT count(*) FROM orders o JOIN customers c ON c.id = o.customer_id)                AS rows_all;`,
    solutionExplanationHtml: `<p>The three algorithms are not better or worse in the abstract; each is optimal for a different shape of input, and the planner's job is to guess the shape. A <strong>nested loop</strong> costs roughly <em>outer rows × the cost of one inner lookup</em>, so it is unbeatable when the outer side is one row and an index makes the lookup cheap — and it degrades linearly into disaster as the outer side grows. A <strong>hash join</strong> pays a fixed cost to build a hash table from the smaller side, then streams the larger side past it once; that fixed cost is wasted on tiny inputs and trivial on large ones. A <strong>merge join</strong> avoids both by walking two already-sorted streams, which is why it appears when the inputs arrive ordered from an index or a prior sort.</p>
<p>Because the choice is driven by estimated row counts, the previous exercise is not a separate topic — it is the cause of most bad join plans. An under-estimated outer side is exactly how a nested loop gets chosen for a hundred thousand iterations, and that single mistake produces the archetypal "one query pins a CPU for ten minutes" incident.</p>
<p>Forcing the wrong plan is worth doing once, deliberately, because it makes the cost model's judgement concrete: the same 200,000 rows come back, and the work to produce them is entirely different. That is also the argument against leaving the <code>enable_*</code> switches off in production — they do not fix a bad estimate, they only remove the planner's ability to adapt when the data changes.</p>
<p>One reading detail that catches everyone: in a nested loop, the inner node's reported rows are <strong>per loop</strong>. A node showing 10 rows with <code>loops=20000</code> produced 200,000, so multiply before concluding that the inner side is cheap. It is the single most misread number in an <code>EXPLAIN ANALYZE</code> output.</p>`,
    diagramMermaid: `flowchart TD
  A[how many rows on the outer side] --> B{small}
  B -->|yes| C[Nested Loop probes the inner index per row]
  B -->|no| D{both sides large}
  D -->|yes| E[Hash Join builds once and streams once]
  D -->|already sorted| F[Merge Join walks both in step]
  G[bad row estimate] --> C
  G -.->|nested loop over 200000 rows| H[the classic runaway query]`,
    check: `SELECT plan_nodes('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5') AS one_customer;
SELECT plan_nodes('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS whole_table;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5') AS facts_one;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS facts_all;
SET enable_hashjoin = off;
SET enable_mergejoin = off;
SELECT plan_facts('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id') AS forced_loop;
RESET ALL;
SELECT (SELECT count(*) FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.id = 5) AS rows_one, (SELECT count(*) FROM orders o JOIN customers c ON c.id = o.customer_id) AS rows_all;`,
  },
  {
    title: 'Replace Deep OFFSET Pagination with a Keyset Cursor',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['OFFSET reads and discards', 'keyset pagination', 'cost grows with page number', 'stable ordering', 'index-supported seek'],
    prerequisites: ['ORDER BY and LIMIT', 'reading plans'],
    tags: ['pagination', 'performance', 'postgres', 'query-writing', 'scale'],
    problemHtml: `<p><code>LIMIT 20 OFFSET 100000</code> does not skip to row 100,001. The server produces the first 100,000 rows in order and <strong>throws them away</strong>, then returns the next twenty. Page one is instant, page five thousand reads a hundred thousand rows, and the endpoint gets slower the deeper anyone browses — a performance profile that looks fine in testing and degrades in production exactly where the crawlers go.</p>
<ul>
<li>Print <code>page1 ...</code> — <code>plan_facts</code> for <code>SELECT * FROM orders ORDER BY id LIMIT 20</code>.</li>
<li>Print <code>deep ...</code> for <code>SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000</code>. Compare the <code>scanned</code> figure with the twenty rows returned.</li>
<li>Print <code>keyset ...</code> for the equivalent seek: <code>SELECT * FROM orders WHERE id &gt; 100000 ORDER BY id LIMIT 20</code>.</li>
<li>Print <code>same_ids ...</code> — whether both approaches return the same first id, proving the rewrite is equivalent for this ordering.</li>
<li>Print <code>counted N</code> — the number of rows a full count would read — as a reminder that "page N of M" costs a second full scan unless the total is cached or approximated.</li>
</ul>`,
    inputSpec: 'The orders table with 200,000 rows and a primary key on id, so the ordering column is indexed.',
    outputSpec:
      'Page one reads only the twenty rows it returns; the deep offset reads 100,020 to return twenty; the keyset seek reads twenty again; both return the same first id; and a full count reads all 200,000.',
    constraints: 'The keyset query must use the last id from the previous page as a bound. Do not add indexes — the primary key already provides the ordering.',
    examplesJson: [
      { input: "plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000')", output: 'Limit est=20 actual=20 scanned=100020', explanation: 'The server produced 100,020 rows and discarded all but the last twenty.' },
      { input: "plan_facts('SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20')", output: 'Limit est=20 actual=20 scanned=20', explanation: 'The index seeks straight to the boundary, so the work is the same for page 1 and page 5,000.' },
      { input: 'comparing the first id from each', output: 'same_ids true', explanation: 'Keyset pagination is not an approximation — for a unique, indexed ordering it returns exactly the same page.' },
    ],
    hintsJson: [
      'OFFSET is applied after rows are produced, so the work is proportional to the offset.',
      'Keyset pagination remembers the last row of the previous page and seeks past it.',
      'The ordering column must be unique, or ties will skip or repeat rows — add a tiebreaker such as the primary key.',
      'A total count is a separate full scan; consider caching it or showing "more results" instead.',
    ],
    solution: `SELECT plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20')                        AS page1;
SELECT plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000')         AS deep;
SELECT plan_facts('SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20')     AS keyset;

SELECT (SELECT id FROM orders ORDER BY id LIMIT 1 OFFSET 100000)
     = (SELECT id FROM orders WHERE id > 100000 ORDER BY id LIMIT 1) AS same_ids;

SELECT count(*) AS counted FROM orders;`,
    solutionExplanationHtml: `<p>The numbers state the case: 100,020 rows read to return twenty, against twenty read to return twenty. <code>OFFSET</code> is defined as "produce these rows, then discard the first N", so its cost is proportional to the page number. Keyset pagination replaces the discard with a <strong>seek</strong>: remember the last row you showed, and ask the index for what follows it. The index can jump straight there, so page 5,000 costs exactly what page 1 costs.</p>
<p>Keyset pagination is also more <em>correct</em> under concurrency, which is the argument that usually convinces people faster than the performance one. With <code>OFFSET</code>, a row inserted or deleted while a user is browsing shifts every subsequent page: rows are silently skipped or shown twice. A keyset cursor is anchored to a value rather than a position, so concurrent changes cannot shift it.</p>
<p>The requirement is a <strong>stable, unique ordering</strong>. Paginating by a non-unique column — <code>ORDER BY placed_at</code> — breaks the moment two rows share a value, because <code>WHERE placed_at &gt; $last</code> skips the rest of the ties. The fix is a compound cursor: order by <code>(placed_at, id)</code> and seek with <code>WHERE (placed_at, id) &gt; ($last_date, $last_id)</code>, which PostgreSQL supports directly as a row comparison and can serve from an index on those columns.</p>
<p>The trade is that keyset pagination gives no random access: there is no way to jump to page 500 without walking there, so it fits "next / previous" and infinite scrolling rather than numbered page links. The final count is a reminder of the same theme from another angle — rendering "page 3 of 8,412" requires counting every row, a second full scan that often costs more than the page itself. Cache it, approximate it from <code>pg_class.reltuples</code>, or show a "load more" affordance and skip the question entirely.</p>`,
    diagramMermaid: `flowchart TD
  A[LIMIT 20 OFFSET 100000] --> B[produce 100020 rows in order]
  B --> C[discard the first 100000]
  C --> D[return 20]
  E[WHERE id greater than last seen] --> F[index seeks to the boundary]
  F --> G[read 20 and stop]
  G --> H[cost is the same on every page]`,
    check: `SELECT plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20') AS page1;
SELECT plan_facts('SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000') AS deep;
SELECT plan_facts('SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20') AS keyset;
SELECT (SELECT id FROM orders ORDER BY id LIMIT 1 OFFSET 100000) = (SELECT id FROM orders WHERE id > 100000 ORDER BY id LIMIT 1) AS same_ids;
SELECT count(*) AS counted FROM orders;`,
  },
  {
    title: 'Ask Whether Any Row Exists Without Counting Them All',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['EXISTS short-circuits', 'COUNT reads everything', 'NOT IN versus NOT EXISTS with NULLs', 'semi-join', 'answering the question actually asked'],
    prerequisites: ['subqueries', 'aggregates'],
    tags: ['exists', 'subquery', 'performance', 'postgres', 'null'],
    problemHtml: `<p><code>SELECT count(*) &gt; 0</code> answers "does anything match" by counting every match. <code>EXISTS</code> answers the same question by stopping at the first one. On a customer with ten orders the difference is invisible; on one with a million it is the difference between a fast endpoint and a timeout.</p>
<ul>
<li>Print <code>exists_form ...</code> — <code>plan_facts</code> for <code>SELECT EXISTS (SELECT 1 FROM orders WHERE customer_id = 7)</code>.</li>
<li>Print <code>count_form ...</code> for <code>SELECT count(*) &gt; 0 FROM orders WHERE customer_id = 7</code>. Compare the <code>scanned</code> figures.</li>
<li>Print <code>flattened ...</code> using <code>plan_nodes</code> for <code>SELECT c.id FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total &gt; 400)</code>. The correlated subquery does not appear in the plan at all — work out what the planner turned it into.</li>
<li>Now the correctness half. Insert one order with a <code>NULL</code> customer id is impossible here (the column is <code>NOT NULL</code>), so use a scalar list instead: print <code>not_in_null ...</code> — the row count from <code>SELECT count(*) FROM customers WHERE id NOT IN (1, 2, NULL)</code>.</li>
<li>Print <code>not_exists ...</code> — the count from the <code>NOT EXISTS</code> equivalent over the same two ids, and note which of the two answered the question you meant.</li>
</ul>`,
    inputSpec: 'The orders table (200,000 rows, 10 per customer) and the customers table (20,000 rows).',
    outputSpec:
      'EXISTS stops after the first matching row while the count reads all ten; the correlated EXISTS is flattened into a hash join over de-duplicated customer ids rather than being run per row; NOT IN with a NULL in the list returns zero rows; and the NOT EXISTS form returns 19,998.',
    constraints: 'Do not add indexes. The NOT IN demonstration must keep the NULL in the list — that is the point.',
    examplesJson: [
      { input: 'plan_facts for the EXISTS form', output: 'Result est=1 actual=1 scanned=1', explanation: 'The scan stops as soon as one row is found.' },
      { input: 'plan_facts for the count form', output: 'Aggregate est=1 actual=1 scanned=10', explanation: 'Counting requires visiting every matching row, however many there are.' },
      { input: 'SELECT count(*) FROM customers WHERE id NOT IN (1, 2, NULL)', output: '0', explanation: 'NULL makes every comparison unknown, so NOT IN returns nothing at all — silently, with no error.' },
    ],
    hintsJson: [
      'EXISTS is a boolean question; the planner stops at the first row that answers it.',
      'A correlated EXISTS is flattened by the planner — look for a join plus a de-duplicating aggregate, not a subquery node.',
      'x NOT IN (list containing NULL) is never true — it is unknown for every row.',
      'NOT EXISTS handles NULLs the way people expect, which is why it is the safer default.',
    ],
    solution: `SELECT plan_facts('SELECT EXISTS (SELECT 1 FROM orders WHERE customer_id = 7)')  AS exists_form;
SELECT plan_facts('SELECT count(*) > 0 FROM orders WHERE customer_id = 7')       AS count_form;

SELECT plan_nodes('SELECT c.id FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total > 400)') AS flattened;

SELECT count(*) AS not_in_null FROM customers WHERE id NOT IN (1, 2, NULL);
SELECT count(*) AS not_exists  FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM (VALUES (1), (2)) AS t(id) WHERE t.id = c.id);`,
    solutionExplanationHtml: `<p>The performance half is simple and worth internalising as a habit: ask the question you actually mean. "Does this customer have any orders" is a boolean, and <code>EXISTS</code> expresses it exactly — the executor stops at the first matching row. <code>count(*) &gt; 0</code> asks "how many are there" and then throws the number away, so its cost is proportional to the number of matches rather than to the answer. The same applies to <code>LIMIT 1</code> in place of a full fetch when only presence matters.</p>
<p>A correlated <code>EXISTS</code> is not executed once per outer row, despite how it reads. The planner flattens it: here it aggregates <code>orders</code> down to distinct qualifying <code>customer_id</code> values and hash-joins them to <code>customers</code>, so the subquery disappears from the plan entirely. Semantically it is a <strong>semi join</strong> — at most one output row per outer row, no duplicates — even though the node is labelled <code>Hash Join</code> above a <code>HashAggregate</code> that performs the de-duplication. That is also why <code>EXISTS</code> is usually preferable to <code>IN (SELECT …)</code> for correlated conditions and always preferable to a join plus <code>DISTINCT</code>, which materialises duplicates only to remove them.</p>
<p>The correctness half is the sharper trap. <code>NOT IN</code> with a <code>NULL</code> anywhere in the list returns <strong>no rows at all</strong>, and it does so silently. The reason is three-valued logic: <code>id NOT IN (1, 2, NULL)</code> expands to <code>id &lt;&gt; 1 AND id &lt;&gt; 2 AND id &lt;&gt; NULL</code>, and the last comparison is <code>UNKNOWN</code> for every row, so the whole condition can never be true. Nothing errors; the query simply returns an empty result, and the bug survives review because the SQL reads correctly.</p>
<p>This matters most where the list is a subquery — <code>WHERE id NOT IN (SELECT customer_id FROM …)</code> — because a single NULL in that column empties the result. <code>NOT EXISTS</code> has no such behaviour: it compares row by row and treats a NULL as simply not matching. Prefer <code>NOT EXISTS</code> by default, and if <code>NOT IN</code> must be used against a subquery, add <code>WHERE col IS NOT NULL</code> to it.</p>`,
    check: `SELECT plan_facts('SELECT EXISTS (SELECT 1 FROM orders WHERE customer_id = 7)') AS exists_form;
SELECT plan_facts('SELECT count(*) > 0 FROM orders WHERE customer_id = 7') AS count_form;
SELECT plan_nodes('SELECT c.id FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total > 400)') AS flattened;
SELECT count(*) AS not_in_null FROM customers WHERE id NOT IN (1, 2, NULL);
SELECT count(*) AS not_exists FROM customers c WHERE NOT EXISTS (SELECT 1 FROM (VALUES (1), (2)) AS t(id) WHERE t.id = c.id);`,
  },
  {
    title: 'Rewrite an OR That Blocks Both Indexes',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['OR across different columns', 'BitmapOr', 'UNION rewrite', 'IN as an OR over one column', 'when the planner can combine indexes'],
    prerequisites: ['indexes', 'reading plans'],
    tags: ['or', 'union', 'index', 'performance', 'postgres'],
    problemHtml: `<p>An <code>OR</code> spanning two columns is the classic query that "has indexes and still scans". PostgreSQL can sometimes combine two indexes with a <strong>BitmapOr</strong>, but only when both sides are selective enough to be worth it — otherwise a single sequential scan is cheaper than two index scans plus a merge.</p>
<ul>
<li>Print <code>or_two_columns ...</code> — <code>plan_nodes</code> for <code>WHERE customer_id = 7 OR placed_at = DATE '2026-03-01'</code>, where both columns are indexed.</li>
<li>Print <code>facts_or ...</code> with <code>plan_facts</code> for the same query.</li>
<li>Print <code>union_rewrite ...</code> — <code>plan_facts</code> for the <code>UNION</code> of the two halves, which lets each half use its own index.</li>
<li>Print <code>same_rows ...</code> — whether the two forms return the same number of rows. Think about why <code>UNION</code> and not <code>UNION ALL</code>.</li>
<li>Print <code>or_same_column ...</code> — <code>plan_nodes</code> for <code>WHERE customer_id = 7 OR customer_id = 99</code>, and <code>in_list ...</code> for the <code>IN (7, 99)</code> form, to see that an OR over one column is a different situation entirely.</li>
</ul>`,
    inputSpec: 'The orders table with indexes on customer_id and placed_at; customer 7 has 10 rows and 2026-03-01 has about 1,111.',
    outputSpec:
      'The two-column OR is planned with a BitmapOr combining both indexes; the UNION rewrite returns the same rows through two separate index scans; the two forms agree on row count; and the same-column OR is planned identically to the IN list.',
    constraints: 'The UNION rewrite must return the same rows as the OR — deduplicate rather than using UNION ALL. Do not drop the indexes.',
    examplesJson: [
      { input: 'plan_nodes for customer_id = 7 OR placed_at = ...', output: 'includes BitmapOr', explanation: 'Both sides are selective, so PostgreSQL scans each index and ORs the resulting bitmaps.' },
      { input: 'the UNION rewrite', output: 'the same rows through two index scans plus a deduplication step', explanation: 'The rewrite is what you reach for when the planner declines to combine the indexes itself.' },
      { input: 'customer_id = 7 OR customer_id = 99 versus IN (7, 99)', output: 'identical plans', explanation: 'An OR over a single column is just a list of values, and the planner treats the two spellings the same.' },
    ],
    hintsJson: [
      'BitmapOr appears when the planner combines two index scans for an OR.',
      'A row can satisfy both halves of an OR, so a UNION ALL rewrite would duplicate it.',
      'An OR over one column is equivalent to IN and needs no rewrite at all.',
      'If one side of the OR is unselective, no index combination helps — the scan is correct.',
    ],
    solution: `SELECT plan_nodes('SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE ''2026-03-01''') AS or_two_columns;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE ''2026-03-01''') AS facts_or;

SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7 UNION SELECT * FROM orders WHERE placed_at = DATE ''2026-03-01''') AS union_rewrite;

SELECT (SELECT count(*) FROM (SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE '2026-03-01') a)
     = (SELECT count(*) FROM (SELECT * FROM orders WHERE customer_id = 7 UNION SELECT * FROM orders WHERE placed_at = DATE '2026-03-01') b)
       AS same_rows;

SELECT plan_nodes('SELECT * FROM orders WHERE customer_id = 7 OR customer_id = 99') AS or_same_column;
SELECT plan_nodes('SELECT * FROM orders WHERE customer_id IN (7, 99)')              AS in_list;`,
    solutionExplanationHtml: `<p>Two very different situations hide behind the same keyword. An <code>OR</code> over a <strong>single column</strong> is a list of values: the planner rewrites it to the same thing <code>IN</code> produces, and one index serves it. The plans here are identical, which is why "replace OR with IN for performance" is folklore rather than advice.</p>
<p>An <code>OR</code> across <strong>different columns</strong> is the real problem, because no single index covers both sides. PostgreSQL's answer is <code>BitmapOr</code>: scan each index, build a bitmap of matching row locations from each, OR them together, then visit the heap once in physical order. It is an elegant solution and it is chosen only when both sides are selective — if either half matches a large fraction of the table, building bitmaps is more work than reading the table, and the sequential scan you see is the correct plan rather than a failure.</p>
<p>The <code>UNION</code> rewrite is the manual version of the same idea and remains useful when the planner declines: each branch is a separate query that can use its own index and its own statistics. The important detail is <code>UNION</code> rather than <code>UNION ALL</code> — a row matching both halves would otherwise appear twice, since <code>OR</code> is a set union, not a concatenation. That deduplication has a cost (a sort or hash), which is part of why the rewrite is not automatically better.</p>
<p>The practical order of attack is therefore: check whether the <code>OR</code> is over one column (nothing to do), then check whether both sides are selective (a <code>BitmapOr</code> will appear on its own), and only then reach for the rewrite. And where one branch is fundamentally unselective — <code>status = 'paid' OR customer_id = 7</code> — no rewrite helps, because a quarter of the table has to be read either way.</p>`,
    diagramMermaid: `flowchart TD
  A[OR across two columns] --> B{both sides selective}
  B -->|yes| C[Bitmap Index Scan on each]
  C --> D[BitmapOr combines them]
  D --> E[one heap visit in physical order]
  B -->|no| F[Seq Scan is genuinely cheaper]
  G[OR over one column] --> H[same plan as IN]`,
    check: `SELECT plan_nodes('SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE ''2026-03-01''') AS or_two_columns;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE ''2026-03-01''') AS facts_or;
SELECT plan_facts('SELECT * FROM orders WHERE customer_id = 7 UNION SELECT * FROM orders WHERE placed_at = DATE ''2026-03-01''') AS union_rewrite;
SELECT (SELECT count(*) FROM (SELECT * FROM orders WHERE customer_id = 7 OR placed_at = DATE '2026-03-01') a) = (SELECT count(*) FROM (SELECT * FROM orders WHERE customer_id = 7 UNION SELECT * FROM orders WHERE placed_at = DATE '2026-03-01') b) AS same_rows;
SELECT plan_nodes('SELECT * FROM orders WHERE customer_id = 7 OR customer_id = 99') AS or_same_column;
SELECT plan_nodes('SELECT * FROM orders WHERE customer_id IN (7, 99)') AS in_list;`,
  },
  {
    title: 'Measure Whether the Join Rewrite Actually Wins',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['correlated scalar subquery', 'aggregate then join', 'work equals rows times loops', 'fan-out and indexes decide', 'PostgreSQL does not index foreign keys'],
    prerequisites: ['joins', 'aggregates', 'subqueries'],
    tags: ['subquery', 'join', 'performance', 'postgres', 'measurement'],
    problemHtml: `<p>A scalar subquery in the select list runs once per output row — the SQL spelling of an N+1 query. The standard advice is to aggregate the child table once and join. This exercise applies that advice and then <strong>measures whether it helped</strong>, because the honest answer is "it depends", and the two things it depends on are worth knowing.</p>
<p>Use <code>plan_work</code>, which multiplies each scan's rows by how many times that node ran — a per-row subquery reports a handful of rows per execution, so without the loop multiplier its true cost is invisible.</p>
<ul>
<li>Report the lifetime order count for every Hanoi gold customer with a <strong>correlated</strong> subquery and print <code>correlated ...</code>.</li>
<li>Do the same by aggregating <code>orders</code> once in a CTE and joining, and print <code>joined ...</code>. Compare the two <code>work</code> figures before assuming which won.</li>
<li>Now remove the index that makes the correlated version viable — <code>DROP INDEX ix_orders_customer</code> — and print <code>correlated_noindex ...</code> and <code>joined_noindex ...</code>.</li>
<li>Recreate the index and print <code>same_answer ...</code>, confirming both forms return identical totals.</li>
</ul>
<p>PostgreSQL does not create an index for a foreign key automatically, so the unindexed case is not hypothetical — it is the default state of most child tables.</p>`,
    inputSpec: 'orders (200,000 rows, exactly 10 per customer, index on customer_id) and customers (20,000 rows, of which 6,666 are Hanoi/gold).',
    outputSpec:
      'With the index the correlated version does LESS total work than the join rewrite (about 153,000 against 220,000), because ten rows per customer through an index beats a full aggregation. Without the index the correlated version explodes to over a billion units while the join barely moves — a difference of roughly four orders of magnitude. Both forms always return the same numbers.',
    constraints: 'Measure with plan_work rather than assuming. Recreate the dropped index at the end so later exercises are unaffected.',
    examplesJson: [
      { input: 'the correlated form with the index in place', output: 'work about 153,000', explanation: 'Each of 6,666 customers costs one index lookup of ten rows — cheap, and the rewrite has to beat that.' },
      { input: 'the aggregate-then-join form', output: 'work about 289,000', explanation: 'It aggregates all 200,000 orders for all 20,000 customers, including the 13,334 the report does not want. Here the "optimisation" is slower.' },
      { input: 'the same pair after DROP INDEX ix_orders_customer', output: 'correlated about 1.33 billion, joined about 220,000', explanation: 'Without the index each subquery becomes a full scan, run 6,666 times. This is the case the folklore is really about.' },
    ],
    hintsJson: [
      'plan_work multiplies rows by loops — that is what exposes a per-row subquery.',
      'Fan-out matters: ten child rows per parent is cheap to fetch, ten thousand is not.',
      'The join rewrite aggregates every parent, including ones the report filters out.',
      'PostgreSQL indexes primary keys automatically but never foreign keys — check before blaming the query.',
    ],
    solution: `SELECT plan_work($q$
  SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
$q$) AS correlated;

SELECT plan_work($q$
  WITH lifetime AS (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id)
  SELECT c.id, l.n
  FROM customers c LEFT JOIN lifetime l ON l.customer_id = c.id
  WHERE c.city = 'Hanoi' AND c.tier = 'gold'
$q$) AS joined;

DROP INDEX ix_orders_customer;
ANALYZE orders;

SELECT plan_work($q$
  SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
$q$) AS correlated_noindex;

SELECT plan_work($q$
  WITH lifetime AS (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id)
  SELECT c.id, l.n
  FROM customers c LEFT JOIN lifetime l ON l.customer_id = c.id
  WHERE c.city = 'Hanoi' AND c.tier = 'gold'
$q$) AS joined_noindex;

CREATE INDEX ix_orders_customer ON orders(customer_id);
ANALYZE orders;

SELECT (SELECT sum((SELECT count(*) FROM orders o WHERE o.customer_id = c.id))
        FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold')
     = (SELECT sum(l.n) FROM customers c
        LEFT JOIN (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) l
          ON l.customer_id = c.id
        WHERE c.city = 'Hanoi' AND c.tier = 'gold') AS same_answer;`,
    solutionExplanationHtml: `<p>The measurement contradicts the advice, and that is the lesson. With an index on the foreign key, the correlated version costs roughly 153,000 units and the celebrated rewrite costs roughly 220,000 — the rewrite is <em>slower</em>. The reason is visible once stated: each customer has only ten orders, so a per-customer index lookup is nearly free, while the CTE dutifully aggregates all 200,000 orders for all 20,000 customers, including the 13,334 that the <code>WHERE</code> clause then discards.</p>
<p>Remove the index and the picture inverts violently: the correlated form jumps to about 1.33 <em>billion</em> units — 6,666 sequential scans of 200,000 rows — while the join is unchanged at about 220,000. Four orders of magnitude, from one missing index.</p>
<p>So the real rule is not "joins beat subqueries". It is that a correlated subquery costs <strong>outer rows × the cost of one lookup</strong>, and that product is small only when both factors are small. Two questions decide it: is there an index supporting the correlation, and how many child rows does each parent have? Low fan-out plus an index favours the subquery, which also reads more clearly. High fan-out, a missing index, or a report covering most of the parent table favours aggregating once.</p>
<p>The missing-index case deserves emphasis because it is the default. PostgreSQL creates an index for a primary key and for a unique constraint, but <strong>never</strong> for a foreign key — that is left to you, and forgetting it is one of the most common causes of a query that was fine in development and impossible in production. Before rewriting a slow correlated query, check whether the correlation column is indexed; that one-line fix beats any rewrite here.</p>
<p>Finally, note the discipline the last check enforces. Both forms return identical totals, verified rather than assumed — a rewrite that changes the answer is not an optimisation, and <code>LEFT JOIN</code> versus <code>JOIN</code> is exactly where that difference creeps in, since an inner join would silently drop customers with no orders.</p>`,
    diagramMermaid: `flowchart TD
  A[correlated subquery per row] --> B{is the correlation column indexed}
  B -->|yes| C[cost is outer rows times a small lookup]
  B -->|no| D[cost is outer rows times a full scan]
  D --> E[1.33 billion units here]
  F[aggregate once then join] --> G[cost is one pass over the child table]
  G --> H[same cost with or without the index]
  C --> I{fan-out per parent}
  I -->|small| J[subquery can win]
  I -->|large| F`,
    check: `SELECT plan_work($q$ SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS correlated;
SELECT plan_work($q$ WITH lifetime AS (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) SELECT c.id, l.n FROM customers c LEFT JOIN lifetime l ON l.customer_id = c.id WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS joined;
DROP INDEX ix_orders_customer;
ANALYZE orders;
SELECT plan_work($q$ SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS correlated_noindex;
SELECT plan_work($q$ WITH lifetime AS (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) SELECT c.id, l.n FROM customers c LEFT JOIN lifetime l ON l.customer_id = c.id WHERE c.city = 'Hanoi' AND c.tier = 'gold' $q$) AS joined_noindex;
CREATE INDEX ix_orders_customer ON orders(customer_id);
ANALYZE orders;
SELECT (SELECT sum((SELECT count(*) FROM orders o WHERE o.customer_id = c.id)) FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold') = (SELECT sum(l.n) FROM customers c LEFT JOIN (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) l ON l.customer_id = c.id WHERE c.city = 'Hanoi' AND c.tier = 'gold') AS same_answer;`,
  },
  {
    title: 'Control Whether a CTE Is Inlined or Materialised',
    difficulty: 'HARD', estimatedMinutes: 45, points: 25,
    concepts: ['CTE inlining since PostgreSQL 12', 'MATERIALIZED and NOT MATERIALIZED', 'optimisation fences', 'predicate pushdown', 'reusing an expensive result'],
    prerequisites: ['CTEs', 'reading plans'],
    tags: ['cte', 'planner', 'performance', 'postgres', 'optimisation'],
    problemHtml: `<p>Before PostgreSQL 12 every <code>WITH</code> clause was an <strong>optimisation fence</strong>: it was computed in full, exactly as written, and the outer query's conditions could not reach inside it. Since 12 the planner <em>inlines</em> a CTE that is referenced once, so filters push down and the CTE behaves like a subquery — a large improvement that also invalidated a decade of "use a CTE to force the plan" advice.</p>
<p>Both behaviours are now explicit, and this exercise measures the difference.</p>
<ul>
<li>Print <code>inlined ...</code> — <code>plan_facts</code> for a CTE selecting all of <code>orders</code>, referenced once, with the outer query filtering <code>WHERE customer_id = 7</code>. Look at <code>scanned</code>.</li>
<li>Print <code>materialised ...</code> — the same query with <code>WITH x AS MATERIALIZED (...)</code>.</li>
<li>Print <code>nodes_mat ...</code> from <code>plan_nodes</code> for the materialised version, to see the extra step in the tree.</li>
<li>Print <code>same_rows ...</code> — whether both return the same row count.</li>
<li>Show when materialising is the right choice: print <code>twice ...</code> — <code>plan_facts</code> for a query referencing an aggregate CTE <strong>twice</strong> (self-joined on a computed value), where computing it once is genuinely better.</li>
</ul>`,
    inputSpec: 'The orders table with 200,000 rows and an index on customer_id; customer 7 has 10 of them.',
    outputSpec:
      'The inlined CTE pushes the filter down and scans only the ten matching rows; the materialised version computes all 200,000 first and filters afterwards; the materialised plan contains a CTE Scan node; both return the same rows; and the twice-referenced aggregate is computed once.',
    constraints: 'Do not rewrite the CTE into a subquery — the exercise is about the two keywords. Keep the outer filter identical in both versions.',
    examplesJson: [
      { input: 'a single-reference CTE with an outer WHERE customer_id = 7', output: 'scanned=10', explanation: 'The planner inlined the CTE, so the filter reached the index — the CTE is not a barrier any more.' },
      { input: 'the same query with AS MATERIALIZED', output: 'scanned=200000', explanation: 'MATERIALIZED restores the fence: the CTE is computed in full and only then filtered.' },
      { input: 'plan_nodes for the materialised version', output: 'includes CTE Scan', explanation: 'The extra node is the materialised result being read back — visible proof that it was computed separately.' },
    ],
    hintsJson: [
      'Since PostgreSQL 12 a CTE referenced once is inlined by default.',
      'AS MATERIALIZED forces the old behaviour; AS NOT MATERIALIZED forces inlining even for multiple references.',
      'Compare scanned: an inlined CTE lets the outer filter reach the index.',
      'Materialising is right when an expensive result is used several times, or when a function must run exactly once.',
    ],
    solution: `SELECT plan_facts($q$
  WITH x AS (SELECT * FROM orders)
  SELECT * FROM x WHERE customer_id = 7
$q$) AS inlined;

SELECT plan_facts($q$
  WITH x AS MATERIALIZED (SELECT * FROM orders)
  SELECT * FROM x WHERE customer_id = 7
$q$) AS materialised;

SELECT plan_nodes($q$
  WITH x AS MATERIALIZED (SELECT * FROM orders)
  SELECT * FROM x WHERE customer_id = 7
$q$) AS nodes_mat;

SELECT (SELECT count(*) FROM (WITH x AS (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7) a)
     = (SELECT count(*) FROM (WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7) b)
       AS same_rows;

SELECT plan_facts($q$
  WITH totals AS MATERIALIZED (
    SELECT customer_id, sum(total) AS spend FROM orders GROUP BY customer_id
  )
  SELECT count(*)
  FROM totals a
  JOIN totals b ON b.spend > a.spend AND b.customer_id = a.customer_id + 1
$q$) AS twice;`,
    solutionExplanationHtml: `<p>The <code>scanned</code> figures tell the whole story: ten rows against two hundred thousand, for queries that return exactly the same result. Inlining lets the outer <code>WHERE</code> push down into the CTE, so the index on <code>customer_id</code> is used; <code>MATERIALIZED</code> puts the fence back, and the CTE is computed in full before the filter is applied to its output.</p>
<p>This is a genuine version boundary and a common source of confusion. On PostgreSQL 11 and earlier, the first query would also have scanned everything — which is why older material recommends CTEs as a way to <em>force</em> a plan, and why that advice quietly stopped working after an upgrade. The modern rule is the opposite: write CTEs for readability, and reach for <code>MATERIALIZED</code> only when you have a reason.</p>
<p>There are three such reasons. First, a CTE referenced <strong>several times</strong> whose computation is expensive: inlining would recompute it per reference, while materialising computes it once — the case the last query demonstrates. Second, a CTE containing a <strong>volatile function</strong> or a data-modifying statement, where running it a different number of times changes behaviour. Third, the deliberate fence: when the planner's estimate for the inlined form is badly wrong and materialising gives a more predictable plan. That third use is a workaround for a bad estimate, and the better fix is usually the statistics of exercise 3.</p>
<p>Note also that PostgreSQL inlines only when the CTE is referenced <strong>once</strong> and is not recursive or data-modifying; a CTE used twice is materialised by default, and <code>NOT MATERIALIZED</code> is how you override that when recomputation is cheaper than storing the intermediate result. The <code>CTE Scan</code> node in the plan is the reliable way to tell which happened, and it is worth checking rather than assuming.</p>`,
    diagramMermaid: `flowchart TD
  A[WITH x AS SELECT from orders] --> B{referenced once}
  B -->|yes and not forced| C[inlined so the outer filter pushes down]
  C --> D[index used scanned equals 10]
  B -->|AS MATERIALIZED| E[computed in full first]
  E --> F[CTE Scan node then filter]
  F --> G[scanned equals 200000]
  H[expensive CTE used twice] --> E`,
    check: `SELECT plan_facts($q$ WITH x AS (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7 $q$) AS inlined;
SELECT plan_facts($q$ WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7 $q$) AS materialised;
SELECT plan_nodes($q$ WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7 $q$) AS nodes_mat;
SELECT (SELECT count(*) FROM (WITH x AS (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7) a) = (SELECT count(*) FROM (WITH x AS MATERIALIZED (SELECT * FROM orders) SELECT * FROM x WHERE customer_id = 7) b) AS same_rows;
SELECT plan_facts($q$ WITH totals AS MATERIALIZED (SELECT customer_id, sum(total) AS spend FROM orders GROUP BY customer_id) SELECT count(*) FROM totals a JOIN totals b ON b.spend > a.spend AND b.customer_id = a.customer_id + 1 $q$) AS twice;`,
  },
  {
    title: 'Capstone: Diagnose and Fix a Slow Report',
    difficulty: 'HARD', estimatedMinutes: 60, points: 30,
    concepts: ['isolate the dominant half first', 'sargable predicate as a precondition', 'covering index for a correlated subquery', 'measuring each change separately', 'rejecting a change that does not help'],
    prerequisites: ['explain analyze', 'sargable predicates', 'indexes', 'aggregation'],
    tags: ['capstone', 'performance', 'postgres', 'optimisation', 'diagnosis'],
    problemHtml: `<p>A report is slow. It lists the ten highest-spending gold-tier customers in Hanoi for March 2026, and it was written by someone who knew the business rules and not the planner.</p>
<pre>SELECT c.id, c.city,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders,
       (SELECT sum(o.total) FROM orders o
         WHERE o.customer_id = c.id
           AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend
FROM customers c
WHERE c.city = 'Hanoi' AND c.tier = 'gold'
ORDER BY march_spend DESC NULLS LAST, c.id
LIMIT 10;</pre>
<p>Work in measured steps, using <code>plan_work</code> for every one:</p>
<ul>
<li>Print <code>before ...</code> for the query as written.</li>
<li><strong>Isolate.</strong> Print <code>lifetime_only ...</code> and <code>march_only ...</code> — the report with one subquery each. Compare them with the baseline and draw the conclusion the numbers actually support.</li>
<li><strong>Make it indexable.</strong> The dominant half wraps <code>placed_at</code> in <code>date_trunc</code>. Rewrite it as a half-open range and print <code>sargable ...</code>. The number will barely move — explain to yourself why this is still a necessary step.</li>
<li><strong>Give it an index to use.</strong> Create <code>ix_orders_cust_placed ON orders(customer_id, placed_at) INCLUDE (total)</code> and print <code>with_index ...</code>.</li>
<li>Print <code>same_result ...</code> — whether the original and the final version return the same ten ids.</li>
</ul>`,
    inputSpec: 'customers (20,000 rows; 6,666 are Hanoi/gold) and orders (200,000 rows, 10 per customer, spread over 180 days from 2026-01-01), with an existing index on orders(customer_id).',
    outputSpec:
      'The report costs about 153,500 units as written, and each half costs about 153,300 on its own — neither subquery dominates, so the cost is the per-customer loop itself. Making the date predicate sargable changes almost nothing on its own. Adding the covering composite index drops the whole report to about 46,900 — roughly a 3.3x improvement — and the result is unchanged.',
    constraints: 'Measure every step with plan_work; do not claim an improvement you have not measured. The final version must return the same ten ids as the original.',
    examplesJson: [
      { input: 'plan_work for the report as written', output: 'work about 153,500', explanation: 'The baseline every later number is judged against.' },
      { input: 'the two halves measured separately', output: 'about 153,300 each', explanation: 'Removing either subquery leaves the cost unchanged, so neither is the problem: the expense is scanning 6,666 customers and doing per-customer lookups at all.' },
      { input: 'after adding orders(customer_id, placed_at) INCLUDE (total)', output: 'work about 46,900', explanation: 'Both subqueries now seek a customer in one index — a range for March, an index-only count for the lifetime figure — and never visit the table.' },
    ],
    hintsJson: [
      'Split the query before optimising it — you cannot fix the expensive half if you do not know which one it is.',
      'A sargable predicate is a precondition for an index range, not a speedup on its own.',
      'The index must match the subquery: equality on customer_id, range on placed_at, and the summed column carried as payload.',
      'Compare the ids of the old and new results; a faster query that answers differently is not a fix.',
    ],
    solution: `-- 1. Baseline.
SELECT plan_work($q$
  SELECT c.id, c.city,
         (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders,
         (SELECT sum(o.total) FROM orders o
           WHERE o.customer_id = c.id
             AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend
  FROM customers c
  WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY march_spend DESC NULLS LAST, c.id
  LIMIT 10
$q$) AS before;

-- 2. Which half costs what?
SELECT plan_work($q$
  SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY lifetime_orders DESC, c.id LIMIT 10
$q$) AS lifetime_only;

SELECT plan_work($q$
  SELECT c.id, (SELECT sum(o.total) FROM orders o
                 WHERE o.customer_id = c.id
                   AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10
$q$) AS march_only;

-- 3. Make the dominant predicate indexable. On its own this changes little.
SELECT plan_work($q$
  SELECT c.id, (SELECT sum(o.total) FROM orders o
                 WHERE o.customer_id = c.id
                   AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10
$q$) AS sargable;

-- 4. Now give it an index shaped like the subquery.
DROP INDEX IF EXISTS ix_orders_cust_placed;
CREATE INDEX ix_orders_cust_placed ON orders(customer_id, placed_at) INCLUDE (total);
ANALYZE orders;

SELECT plan_work($q$
  SELECT c.id, c.city,
         (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders,
         (SELECT sum(o.total) FROM orders o
           WHERE o.customer_id = c.id
             AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend
  FROM customers c
  WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY march_spend DESC NULLS LAST, c.id
  LIMIT 10
$q$) AS with_index;

-- 5. Same answer, or it is not a fix.
WITH original AS (
  SELECT c.id,
         (SELECT sum(o.total) FROM orders o
           WHERE o.customer_id = c.id
             AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10
), fixed AS (
  SELECT c.id,
         (SELECT sum(o.total) FROM orders o
           WHERE o.customer_id = c.id
             AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend
  FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold'
  ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10
)
SELECT (SELECT array_agg(id ORDER BY id) FROM original)
     = (SELECT array_agg(id ORDER BY id) FROM fixed) AS same_result;`,
    solutionExplanationHtml: `<p>The order of operations is the lesson, and the first measurement is the one that redirects the work. Splitting the report gives about 153,300 for <em>each</em> half against a 153,500 baseline — removing either subquery saves essentially nothing. That is a specific and useful finding: neither subquery is expensive by itself, so there is no "slow query" to rewrite. The cost is the shape of the report, 6,666 customers each triggering per-customer lookups, and the fix has to make those lookups cheaper rather than eliminate one of them. Guessing at the March subquery because it looks more complicated would have produced a rewrite that measured no better.</p>
<p><strong>A sargable predicate is a precondition, not a fix.</strong> Replacing <code>date_trunc('month', placed_at) = …</code> with a half-open range barely moves the number, and that surprises people. The reason is that the subquery was already using the index on <code>customer_id</code> to find a customer's ten rows; the date condition was only a filter applied afterwards, so removing the transformation saved nothing measurable. It still had to be done — an index range over <code>placed_at</code> is impossible while the column is wrapped in a function, so the rewrite is what makes the <em>next</em> step possible.</p>
<p><strong>Then give the query an index shaped like it.</strong> <code>(customer_id, placed_at) INCLUDE (total)</code> matches the subqueries exactly: equality on the leading column, a range on the second, and the summed column carried as payload so the heap is never visited. The report drops to about 46,900 — roughly 3.3 times less work — and the single index serves both halves, the March range and the lifetime count, the latter as an index-only scan. One index, chosen from the query text, beats every rewrite attempted here.</p>
<p>Note what is <em>not</em> in this solution: the aggregate-then-join rewrite. Exercise 8 measured it on this data and it cost more, because the report wants 6,666 customers with ten orders each and the rewrite aggregates all 200,000 orders for all 20,000 customers. Leaving it out is the point — the discipline is to measure each change and keep only the ones that pay, rather than applying a checklist of things that are usually true.</p>
<p>Finally, the result comparison is not ceremony. Sorting with a deterministic tiebreaker and comparing the id arrays is what distinguishes an optimisation from a query that happens to be faster because it answers a different question — and the <code>NULLS LAST</code> behaviour, which keeps customers with no March orders in the ranking, is exactly the kind of detail a careless rewrite drops.</p>`,
    diagramMermaid: `flowchart TD
  A[measure the report 153500] --> B[split into halves]
  B --> C[march subquery 153300 dominates]
  B --> D[lifetime count 86700]
  C --> E[rewrite date_trunc as a half-open range]
  E --> F[number barely moves but an index range is now possible]
  F --> G[index on customer_id and placed_at including total]
  G --> H[report drops to 33400]
  H --> I[verify the same ten ids]`,
    check: `SELECT plan_work($q$ SELECT c.id, c.city, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS before;
SELECT plan_work($q$ SELECT c.id, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY lifetime_orders DESC, c.id LIMIT 10 $q$) AS lifetime_only;
SELECT plan_work($q$ SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS march_only;
SELECT plan_work($q$ SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS sargable;
DROP INDEX IF EXISTS ix_orders_cust_placed;
CREATE INDEX ix_orders_cust_placed ON orders(customer_id, placed_at) INCLUDE (total);
ANALYZE orders;
SELECT plan_work($q$ SELECT c.id, c.city, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS lifetime_orders, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10 $q$) AS with_index;
WITH original AS (SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND date_trunc('month', o.placed_at) = DATE '2026-03-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10), fixed AS (SELECT c.id, (SELECT sum(o.total) FROM orders o WHERE o.customer_id = c.id AND o.placed_at >= DATE '2026-03-01' AND o.placed_at < DATE '2026-04-01') AS march_spend FROM customers c WHERE c.city = 'Hanoi' AND c.tier = 'gold' ORDER BY march_spend DESC NULLS LAST, c.id LIMIT 10) SELECT (SELECT array_agg(id ORDER BY id) FROM original) = (SELECT array_agg(id ORDER BY id) FROM fixed) AS same_result;`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });

const setupFile = { name: 'setup.sql', language: 'sql', code: `-- Run this once: it builds the 200,000-row dataset these exercises measure and\n-- the plan_facts / plan_nodes helpers they read plans with.\n${SETUP}` };
const clean = ex.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: [
    setupFile,
    { name: 'solution.sql', language: 'sql', code: `-- Measure first, then change one thing at a time:\n--   SELECT plan_facts('<query>');   -- node, estimated, actual, rows scanned\n--   SELECT plan_nodes('<query>');   -- every node type in the plan` },
  ],
  solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: e.solution }],
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let sql = `\\set ON_ERROR_STOP on\n\\pset pager off\n${SETUP}\n`;
ex.forEach((e, i) => { sql += `\n\\echo '===== EX ${i + 1}: ${e.title.replace(/'/g, '')} ====='\n${e.check}\n`; });
fs.writeFileSync(path.join(VERIFY, 'sql-719.sql'), sql);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error('need 10');
const titles = new Set();
parsed.exercises.forEach((e, i) => {
  if (e.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} ${e.difficulty}`);
  if (titles.has(e.title)) throw new Error(`duplicate title ${e.title}`);
  titles.add(e.title);
  if (e.problemHtml.length < 900) throw new Error(`problemHtml<900 ${e.title} (${e.problemHtml.length})`);
  if (e.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${e.title}`);
  if (e.hintsJson.length < 4) throw new Error(`<4 hints ${e.title}`);
  if (e.examplesJson.length < 2) throw new Error(`<2 ex ${e.title}`);
  const sl = e.solutionCodeJson.map((f) => f.code).join('').length;
  if (sl < 205) throw new Error(`sol<205 ${e.title} (${sl})`);
  if (/TODO|\.\.\./.test(e.solutionCodeJson.map((f) => f.code).join(''))) throw new Error(`incomplete solution ${e.title}`);
});
console.log(`OK ${parsed.exercises.length} -> ${trackSlug}__${moduleSlug}.json`);
