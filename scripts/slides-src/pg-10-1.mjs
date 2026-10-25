/**
 * pg-10-1 — PostgreSQL · Chapter 10 · Lesson 10.1 "Reading a plan: EXPLAIN vs EXPLAIN ANALYZE" (slide EN, kiểu FU, 25/10/2026, agent c10).
 * Nguồn: content/courses/postgresql/s10-explain-planner.mjs › postgresql-10-1-doc-explain. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-10-setup.sql + pg-10-1.sql/.out.txt, schema ch10: customer 10.000 + ord 500.000 tất định).
 * Bổ sung so với web: ví dụ đời thường (app chỉ đường: lộ trình dự kiến vs chuyến đi thật), planner trong đường đi truy vấn, kế hoạch
 * song song mặc định, giải phẫu một dòng nút, cost 9927 tính tay từ relpages/reltuples, startup vs total (nút chặn), loops, các tuỳ chọn
 * EXPLAIN (COSTS OFF, TIMING OFF, VERBOSE, FORMAT JSON), bẫy DELETE chạy thật + ROLLBACK, bài tập, tự kiểm.
 */
import { lamDeck, sql, run, psql, tbl, two, box, kw, vsd, flow, c, cards, steps } from './_pg-chung.mjs';
import { wrapPlan, anatomy, planTree, bars, PG, CAM, XANH, DO, NAU, TIM } from './pg-10-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const W = '<span class="nho">↪ = one long psql line wrapped to fit the slide (nothing cut)</span>';
export const deck = { key: 'pg-10-1', code: 'PG 10.1', title: 'Reading a plan', sub: 'EXPLAIN vs EXPLAIN ANALYZE' };

const Q = `SELECT count(*), avg(amount) FROM ord WHERE status = 'refunded';`;
const OUT_EX = `                          QUERY PLAN
---------------------------------------------------------------
 Aggregate  (cost=9975.50..9975.51 rows=1 width=40)
   ->  Seq Scan on ord  (cost=0.00..9927.00 rows=9700 width=6)
         Filter: (status = 'refunded'::text)
(3 rows)`;
const OUT_EA = ` Aggregate  (cost=9975.50..9975.51 rows=1 width=40) (actual time=23.516..23.517 rows=1 loops=1)
   ->  Seq Scan on ord  (cost=0.00..9927.00 rows=9700 width=6) (actual time=0.008..22.892 rows=10000 loops=1)
         Filter: (status = 'refunded'::text)
         Rows Removed by Filter: 490000
 Planning Time: 0.009 ms
 Execution Time: 23.528 ms
(6 rows)`;
const TREE_SQL = `EXPLAIN ANALYZE
SELECT c.region, count(*) AS orders, sum(o.amount) AS revenue
FROM ord o JOIN customer c ON c.id = o.customer_id
WHERE o.status = 'refunded'
GROUP BY c.region
ORDER BY revenue DESC;`;
const TREE_OUT = ` Sort  (cost=10327.28..10327.29 rows=3 width=46) (actual time=26.812..26.813 rows=3 loops=1)
   Sort Key: (sum(o.amount)) DESC
   Sort Method: quicksort  Memory: 25kB
   ->  HashAggregate  (cost=10327.22..10327.26 rows=3 width=46) (actual time=26.789..26.791 rows=3 loops=1)
         Group Key: c.region
         Batches: 1  Memory Usage: 24kB
         ->  Hash Join  (cost=302.00..10254.47 rows=9700 width=12) (actual time=1.739..25.497 rows=10000 loops=1)
               Hash Cond: (o.customer_id = c.id)
               ->  Seq Scan on ord o  (cost=0.00..9927.00 rows=9700 width=10) (actual time=0.008..21.258 rows=10000 loops=1)
                     Filter: (status = 'refunded'::text)
                     Rows Removed by Filter: 490000
               ->  Hash  (cost=177.00..177.00 rows=10000 width=10) (actual time=1.679..1.679 rows=10000 loops=1)
                     Buckets: 16384  Batches: 1  Memory Usage: 558kB
                     ->  Seq Scan on customer c  (cost=0.00..177.00 rows=10000 width=10) (actual time=0.002..0.673 rows=10000 loops=1)
 Planning Time: 0.301 ms
 Execution Time: 26.873 ms`;

export const slides = lamDeck({ chuong: 'Chapter 10 — EXPLAIN & the planner', bai: '10.1' }, [
  { cover: true, t: 'Reading a plan:<br>EXPLAIN vs EXPLAIN ANALYZE', sub: 'What PostgreSQL <b>plans</b> to do, what it <b>really</b> did —<br>and how to read every number in between.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>What the <b>planner</b> is, and why the same SQL can run in very different ways</li>
<li><code class="i">EXPLAIN</code>: the plan + <b>estimates</b>, without running the query</li>
<li>Every number on a plan line: <b>cost</b> (startup..total), <b>rows</b>, <b>width</b> — and where 9927 comes from</li>
<li><code class="i">EXPLAIN ANALYZE</code>: run it for real — <b>actual time</b>, <b>actual rows</b>, <b>loops</b></li>
<li>Reading a multi-level plan <b>inside-out, bottom-up</b> — and the trap that deletes your data</li>
</ul>
${box('Where we are', 'Chapter 9 used <code class="i">EXPLAIN</code> to see Seq Scan vs Index Scan. <b>Chapter 10 reads plans properly</b> — the skill behind every “why is this endpoint slow?” fix. Learn it carefully even if you already know SQL.', 'lam')}` },

  { t: 'Everyday example first: a navigation app', giua: true, body: `
${zm(two(`<div class="card"><div class="h">Before you leave — the planned route</div>
<p>The app compares several routes (highway, city streets, bridge) and shows the one with the <b>lowest estimated time</b>: “≈ 23 min, 9.7 km”.</p>
<p style="margin-top:8px">Nothing has happened yet. It is a <b>guess</b> built from what the app knows about the roads.</p></div>`,
`<div class="card" style="border-color:#9fd0b2;background:#f1f9f4"><div class="h" style="color:#1f6b40">After the trip — what really happened</div>
<p>You drove it. The trip log says: <b>actual 23.5 min</b>, stopped 4 times, one detour.</p>
<p style="margin-top:8px">Now you can compare: was the estimate right? If not, the app's <b>map data</b> was wrong.</p></div>`), 1.12)}
${tbl(['navigation app', 'PostgreSQL'], [['several possible routes', 'several possible plans (scan types, join order, join method)'], ['estimated time for each route', 'estimated <b>cost</b> for each plan'], ['map data (roads, traffic)', '<b>statistics</b> about your tables'], ['trip log after driving', '<code class="i">EXPLAIN ANALYZE</code> actual numbers']])}
${box('The whole lesson in one sentence', '<code class="i">EXPLAIN</code> = the planned route with estimates. <code class="i">EXPLAIN ANALYZE</code> = drive it, then print the trip log next to the plan.', '')}` },

  { t: 'The planner: a cost-based optimiser', body: `
${flow([{ t: 'Parser', s: 'is the SQL valid?' }, { t: 'Rewriter', s: 'expand views, rules' }, { t: 'Planner', s: 'choose HOW to run', mau: CAM }, { t: 'Executor', s: 'run the plan', mau: XANH }])}
${two(`<ul style="font-size:22px">
<li>SQL says <b>what</b> you want, never <b>how</b> to get it</li>
<li>The planner lists alternatives: Seq Scan or Index Scan? which table first? which join method?</li>
<li>It gives each a <b>cost</b> estimate and picks the <b>cheapest</b></li>
</ul>`, box('EXPLAIN shows that decision', 'Same query, different data ⇒ different plan. That is normal: the planner re-decides from <b>statistics</b> about your data (lesson 10.3). Chapter 1.4 showed this pipeline; now we open the Planner box.', 'lam'), 'r64')}
${box('Try it', 'Put <code class="i">EXPLAIN</code> in front of any <code class="i">SELECT</code>, <code class="i">INSERT</code>, <code class="i">UPDATE</code> or <code class="i">DELETE</code> — PostgreSQL prints the plan instead of the result.', '')}` },

  { t: 'Our tables for the whole chapter', body: `
${zm(two(tbl(['id', 'name', 'city', 'region'], [[1, 'Customer 1', 'Hanoi', 'North'], [4, 'Customer 4', 'Da Nang', 'Central'], [10, 'Customer 10', 'HCMC', 'South'], ['…', '…', '…', '…']], { cap: 'customer — 10,000 rows' }),
tbl(['id', 'customer_id', 'amount', 'status', 'created_at'], [[1, 7430, '184.42', 'pending', '2024-01-01 00:00'], [2, 644, '51.66', 'paid', '2024-01-01 00:01'], [50, 9133, '228.71', 'refunded', '2024-01-01 00:49'], ['…', '…', '…', '…', '…']], { cap: 'ord — 500,000 rows (one per minute)' }), 'r46'), 1.12)}
<ul style="font-size:21px">
<li><b>2%</b> of orders are <code class="i">refunded</code> (exactly 10,000); <code class="i">city</code> decides <code class="i">region</code> (used in 10.3)</li>
<li><code class="i">ord.customer_id</code> is a foreign key <b>without an index</b> — on purpose, for 10.2</li>
</ul>
${box('Run it yourself', 'The deterministic script (<code class="i">generate_series</code> + <code class="i">setseed</code>) is under the lesson. Every plan here came from <b>PostgreSQL 17.11</b>; your timings will differ, the plan shapes will not.', 'lam')}` },

  { t: 'First look: a default server plans in parallel', body: `
${zm(run(`EXPLAIN ${Q}`, ` Finalize Aggregate  (cost=7301.61..7301.62 rows=1 width=40)
   ->  Gather  (cost=7301.38..7301.59 rows=2 width=40)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=6301.38..6301.39 rows=1 width=40)
               ->  Parallel Seq Scan on ord  (cost=0.00..6281.17 rows=4042 width=6)
                     Filter: (status = 'refunded'::text)
(6 rows)`, { hlOut: [2, 3, 5] }), 1.25)}
<p style="font-size:22px;margin:0">On a big table PostgreSQL may split a scan across <b>worker processes</b> (<code class="i">Gather</code>, <code class="i">Parallel Seq Scan</code>, 2 workers + the leader). Useful in production — but it doubles the size of every plan. For learning we switch it off <b>in our session only</b>:</p>
${sql(`SET max_parallel_workers_per_gather = 0;   -- this session only; production keeps the default (2)`)}` },

  { t: 'Plain EXPLAIN — the estimate, nothing runs', body: `
${zm(run(`EXPLAIN ${Q}`, OUT_EX, { hlOut: [4] }), 1.4)}
<ul style="font-size:22px">
<li>Returns <b>instantly</b>: the query is only planned, never executed — safe even on <code class="i">UPDATE</code>/<code class="i">DELETE</code></li>
<li>Two nodes: <code class="i">Seq Scan</code> reads the table and filters; <code class="i">Aggregate</code> computes count + avg</li>
<li><code class="i">-&gt;</code> means “feeds rows into the node above it”</li>
</ul>
${box('Habit', 'Before you add an index or rewrite a query, put <code class="i">EXPLAIN</code> in front of it and <b>look</b>. Guessing is how people add indexes that are never used.', 'lam')}` },

  { t: 'Anatomy of one plan line', giua: true, body: `
${anatomy()}
${cards([['cost = startup..total', 'Arbitrary <b>units</b>, not milliseconds. Startup = work before the first row; total = work for all rows.'], ['rows', 'How many rows the planner <b>expects</b> this node to output. Every later decision is built on it.'], ['width', 'Average bytes per row. Matters for memory (sorts, hash tables) and for the network.']])}` },

  { t: 'Where does 9927 come from?', body: `
${two(zm(run(`SELECT relpages, reltuples FROM pg_class
WHERE relname = 'ord'
  AND relnamespace = 'ch10'::regnamespace;`, ` relpages | reltuples
----------+-----------
     3677 |    500000
(1 row)`), 1.12),
zm(run(`SELECT 3677 * 1.0       -- pages × 1.0
     + 500000 * 0.01    -- rows × 0.01
     + 500000 * 0.0025  -- rows × 0.0025
       AS seq_scan_total;`, ` seq_scan_total
----------------
      9927.0000
(1 row)`, { hlOut: [3] }), 1.12))}
${bars([{ t: '3,677 pages × seq_page_cost 1.0', v: 3677, nhan: '3677', mau: PG }, { t: '500,000 rows × cpu_tuple_cost 0.01', v: 5000, nhan: '5000', mau: CAM }, { t: '500,000 × cpu_operator_cost 0.0025', v: 1250, nhan: '1250', mau: XANH }], { rh: 44, fs: 19, lw: 400 })}
<p style="font-size:21px;margin:0">Total <b>9927</b>. Aggregate on top: <code class="i">9927 + 9700 × 2 × 0.0025 = 9975.50</code> (two functions per input row). A cost unit ≈ <b>one sequential page read</b> — costs only compare <b>plans of the same query</b>.</p>` },

  { t: 'EXPLAIN ANALYZE — run it, then compare', body: `
${zm(run(`EXPLAIN ANALYZE ${Q}`, wrapPlan(OUT_EA, 70), { hlOut: [2, 4, 5] }), 1.12)}
<p style="font-size:21px;margin:0">${W}<br>Now every node carries a second block — <code class="i">(actual time=… rows=… loops=…)</code> — measured while the query really ran. The last two lines are the whole query: <b>planning</b> 0.009 ms, <b>execution</b> 23.5 ms.</p>
${box('Read it as a pair', 'Seq Scan: <code class="i">rows=9700</code> (estimate) ⟷ <code class="i">rows=10000</code> (actual). Cost 9927 (units) ⟷ 22.9 ms (clock). Same plan, now with the trip log beside it.', '')}` },

  { t: 'Estimate vs actual — the most useful comparison', body: `
${two(`<div>${tbl(['', 'estimate', 'actual'], [['rows (Seq Scan)', '9,700', '10,000'], ['time', 'cost 9927 (units)', '22.9 ms'], ['first row', 'startup 0.00', '0.008 ms'], ['loops', '—', '1']], { o: [[0, 1], [0, 2]] })}
<p style="font-size:21px;margin-top:10px"><code class="i">actual time=0.008..22.892</code> = ms to the <b>first</b> row .. ms to the <b>last</b> row — <b>per loop</b>.</p></div>`,
`${box('Healthy', '9,700 vs 10,000 ⇒ off by 3%. The planner <b>understood the data</b>, so it priced the plan correctly.', 'xanh')}
${box('Sick', 'estimate 1, actual 50,000 — the planner chose a plan for a different world. That is the root cause of most slow queries (lesson 10.3).', 'do2')}
${box('Rule of thumb', 'Within ~10× is usually fine. Hundreds or thousands × off ⇒ investigate the statistics.', '')}`)}` },

  { t: 'A real plan has many levels', body: `
${zm(run(TREE_SQL, wrapPlan(TREE_OUT, 64).split('\n').slice(0, 26).join('\n'), { hlOut: [] }), 0.86)}
<p class="nho" style="margin:0">↪ = long line wrapped (nothing cut). Indentation = depth in the tree. The <b>deepest</b> lines run first.</p>` },

  { t: 'The same plan as a tree — read it bottom-up', body: `
${planTree([
    { id: 'sort', t: '6 · Sort', s: 'rows=3 · revenue DESC', x: 555, y: 40, mau: NAU },
    { id: 'agg', t: '5 · HashAggregate', s: 'rows=3 · by region', x: 555, y: 140, cha: 'sort', mau: TIM, flow: '3 rows' },
    { id: 'hj', t: '4 · Hash Join', s: 'rows=10,000', x: 555, y: 240, cha: 'agg', mau: CAM, flow: '10,000 rows' },
    { id: 'so', t: '1 · Seq Scan ord', s: 'est 9,700 · act 10,000', x: 250, y: 350, cha: 'hj', flow: '10,000' },
    { id: 'h', t: '3 · Hash', s: 'build 558kB table', x: 860, y: 350, cha: 'hj', mau: XANH, flow: '' },
    { id: 'sc', t: '2 · Seq Scan customer', s: 'rows=10,000', x: 860, y: 445, cha: 'h', mau: XANH, flow: '' },
  ], { h: 488, bw: 310, bh: 66 })}
<p style="font-size:21px;margin:0">Leaves (scans) at the bottom touch the tables; rows flow <b>up</b> the arrows; the root at the top hands rows to you. 500,000 rows entered at the bottom-left, <b>3</b> came out at the top.</p>` },

  { t: 'Startup cost vs total cost', body: `
${zm(two(`${tbl(['node', 'startup', 'total'], [['Seq Scan ord', '0.00', '9927.00'], ['Hash', '177.00', '177.00'], ['Hash Join', '302.00', '10254.47'], ['HashAggregate', '10327.22', '10327.26'], ['Sort', '10327.28', '10327.29']], { o: [[3, 1], [4, 1]] })}`,
`<ul style="font-size:22px">
<li><b>Streaming</b> nodes (Seq Scan) start at 0 — the first row comes out immediately</li>
<li><b>Blocking</b> nodes (Hash, Aggregate, Sort) must eat <b>all</b> their input before emitting a row ⇒ startup ≈ total</li>
<li>A node's cost <b>includes its children</b> — the root's total is the cost of the whole query</li>
</ul>`, 'r46'), 1.1)}
${cards([['🚰 streaming', 'Seq Scan, Index Scan, Nested Loop, Limit — rows trickle out one by one, from the start.'], ['🧱 blocking', 'Sort, Hash, HashAggregate — a wall: nothing comes out until all input is in.']], 2)}
${box('Why it matters', 'With <code class="i">LIMIT 10</code> the planner prefers a plan with a <b>low startup</b> cost (it can stop early). That is why adding <code class="i">LIMIT</code> can switch a query to a completely different plan.', 'lam')}` },

  { t: 'loops= multiplies everything', body: `
${zm(run(`EXPLAIN ANALYZE SELECT o.id, o.amount, c.name, c.city
FROM ord o JOIN customer c ON c.id = o.customer_id
WHERE o.id BETWEEN 1 AND 5;`, wrapPlan(` Nested Loop  (cost=0.71..50.04 rows=5 width=29) (actual time=0.009..0.020 rows=5 loops=1)
   ->  Index Scan using ord_pkey on ord o  (cost=0.42..8.52 rows=5 width=14) (actual time=0.004..0.005 rows=5 loops=1)
         Index Cond: ((id >= 1) AND (id <= 5))
   ->  Index Scan using customer_pkey on customer c  (cost=0.29..8.30 rows=1 width=23) (actual time=0.002..0.002 rows=1 loops=5)
         Index Cond: (id = o.customer_id)
 Execution Time: 0.031 ms`, 70), { hlOut: [7] }), 1.12)}
<p style="font-size:21px;margin:0">The inner scan ran <b>5 times</b> (once per order). Its <code class="i">actual time</code> and <code class="i">rows</code> are <b>per loop</b>: total = 0.002 ms × 5. A node showing <code class="i">0.04 ms … loops=5000</code> really cost <b>200 ms</b>. Always multiply before calling a node cheap.</p>` },

  { t: 'Other lines worth reading', body: `
${cards([['Filter + Rows Removed by Filter', 'Rows read and then thrown away. <b>490,000 removed to keep 10,000</b> ⇒ a scan doing 50× too much work: candidate for an index.'], ['Index Cond', 'The condition answered by the index itself (cheap) — versus a Filter applied afterwards.'], ['Sort Method · Memory / Disk', '<code class="i">quicksort Memory: 25kB</code> is fine; <code class="i">external merge Disk</code> spilled to disk (10.4).'], ['Buckets · Batches · Memory Usage', 'Hash table size. <code class="i">Batches: 1</code> = fitted in memory (10.2).'], ['Planning Time', 'Choosing the plan. Usually tiny; big for queries joining many tables.'], ['Execution Time', 'Running it (without sending rows to the client). The number to compare before/after a fix.']], 3)}
${box('On cuongthai.com', 'This is the tool behind every “why is this endpoint slow?” investigation: paste the exact query into <code class="i">EXPLAIN ANALYZE</code>, look for a Seq Scan with a huge <b>Rows Removed by Filter</b>, and the missing index usually shows itself in one step.', 'lam')}` },

  { t: 'EXPLAIN options you will actually use', body: `
${two(`<div>${tbl(['option', 'what it adds / removes'], [['ANALYZE', 'run it: actual time, rows, loops'], ['BUFFERS', 'pages from cache / disk (10.4)'], ['COSTS OFF', 'hide cost — shape only'], ['TIMING OFF', 'skip per-node clocks (less overhead)'], ['VERBOSE', 'output columns, schema names'], ['FORMAT JSON', 'machine-readable (tools, visualisers)'], ['SETTINGS', 'non-default planner settings'], ['GENERIC_PLAN', 'plan a query with $1 (PG 16+, 10.4)'], ['SERIALIZE · MEMORY', 'new in PostgreSQL 17 (10.4)']])}
<p style="font-size:20px;margin:8px 0 0">Combine them in brackets: <code class="i">EXPLAIN (ANALYZE, BUFFERS, VERBOSE) …</code></p></div>`,
`<div style="display:flex;flex-direction:column;gap:10px">${psql(`pgcourse=# EXPLAIN (COSTS OFF)
pgcourse-# SELECT count(*), avg(amount)
pgcourse-# FROM ord WHERE status = 'refunded';
 Aggregate
   ->  Seq Scan on ord
         Filter: (status = 'refunded'::text)`, { sm: true })}
${psql(`pgcourse=# EXPLAIN (VERBOSE, COSTS OFF) …same query…;
 Aggregate
   Output: count(*), avg(amount)
   ->  Seq Scan on ch10.ord
         Output: id, customer_id, amount, status, created_at
         Filter: (ord.status = 'refunded'::text)`, { sm: true, hl: [5] })}
<p style="font-size:19px;margin:0">VERBOSE shows the scan returns <b>all 5 columns</b> although only <code class="i">amount</code> is needed.</p></div>`)}` },

  { t: 'Trap: EXPLAIN ANALYZE really runs the statement', body: `
${two(zm(psql(`pgcourse=# BEGIN;
BEGIN
pgcourse=*# EXPLAIN ANALYZE DELETE FROM ord WHERE status = 'refunded';
 Delete on ord  (cost=0.00..9927.00 rows=0 width=0)
     ↪ (actual time=23.236..23.237 rows=0 loops=1)
   ->  Seq Scan on ord  (cost=0.00..9927.00 rows=9700 width=6)
     ↪ (actual time=0.005..20.742 rows=10000 loops=1)
 Execution Time: 23.295 ms
pgcourse=*# SELECT count(*) FROM ord WHERE status = 'refunded';
     0
pgcourse=*# ROLLBACK;
pgcourse=# SELECT count(*) FROM ord WHERE status = 'refunded';
 10000`, { hl: [10, 13], title: 'psql (17.11) — pgcourse · output shortened' }), 1.05),
`${box('What happened', 'Inside the transaction the 10,000 rows were <b>really deleted</b> — the plan is the receipt. <code class="i">ROLLBACK</code> brought them back.', 'do2')}
${box('Habit', 'Any <code class="i">INSERT / UPDATE / DELETE</code>:<br><code class="i">BEGIN; EXPLAIN ANALYZE …; ROLLBACK;</code><br>every time — the dangerous one is exactly where you forget.', 'xanh')}
${box('Plain EXPLAIN', 'never executes — always safe.', 'lam')}`, 'r64')}` },

  { t: 'Common misreadings', to: true, giua: true, body: `
${vsd(`<ul>
<li>Reading the plan <b>top-down</b> like a recipe</li>
<li>“cost=9927 means 9.9 seconds”</li>
<li>“0.002 ms — this node is free” (ignoring <code class="i">loops=</code>)</li>
<li>Trusting <code class="i">rows=</code> without ANALYZE</li>
<li>Comparing costs of two <b>different</b> queries</li>
</ul>`, `<ul>
<li>Start at the <b>deepest</b> node; rows flow <b>up</b></li>
<li>Cost is in planner units; time is in <code class="i">actual time</code> (ms)</li>
<li>Per-loop numbers × <code class="i">loops</code> = real total</li>
<li>Compare <b>estimate vs actual</b> rows on every node</li>
<li>Costs compare <b>plans of the same query</b> only</li>
</ul>`)}` },

  { t: 'Practice — with solution', body: `
${two(`<div><p style="font-size:22px;margin:0 0 6px"><b>Run both, then answer:</b></p>
${sql(`EXPLAIN ANALYZE SELECT * FROM customer WHERE city = 'Hue';
EXPLAIN ANALYZE SELECT * FROM customer WHERE id = 42;`, { sm: true })}
<ol style="font-size:21px;margin-top:8px"><li>Which node does each use, and why?</li><li>Estimate vs actual rows — healthy?</li><li>How many rows were thrown away?</li></ol></div>`,
box('Answers', '<b>city = Hue</b>: Seq Scan — 10% of the rows, and no index on <code class="i">city</code>; estimate 1000 = actual 1000; 9,000 removed by the filter.<br><b>id = 42</b>: Index Scan on the primary key — estimate 1 = actual 1, nothing removed, 0.02 ms.', 'xanh'))}
${psql(` Seq Scan on customer  (cost=0.00..202.00 rows=1000 width=29) (actual time=0.006..0.518 rows=1000 loops=1)
   Filter: (city = 'Hue'::text)
   Rows Removed by Filter: 9000
 Execution Time: 0.550 ms`, { sm: true, title: "city = 'Hue' (Planning Time line omitted)", hl: [1, 3] })}
${psql(` Index Scan using customer_pkey on customer  (cost=0.29..8.30 rows=1 width=29) (actual time=0.011..0.012 rows=1 loops=1)
   Index Cond: (id = 42)
 Execution Time: 0.020 ms`, { sm: true, title: 'id = 42 (Planning Time line omitted)', hl: [1, 2] })}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Does <code class="i">EXPLAIN</code> run the query? Does <code class="i">EXPLAIN ANALYZE</code>?</li>
<li>A node shows <code class="i">actual time=0.05..0.06 rows=1 loops=4000</code>. Roughly how long did it take in total?</li>
<li>In a plan, which line runs first: the top one or the most indented one?</li>
</ol>
${box('Answers', '1 — EXPLAIN only plans; EXPLAIN ANALYZE <b>executes</b> (wrap writes in BEGIN … ROLLBACK). 2 — ≈ 0.06 ms × 4000 ≈ <b>240 ms</b>. 3 — the <b>most indented</b>: leaves first, rows flow up.', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li>The planner is <b>cost-based</b>: it prices alternatives and runs the cheapest</li>
<li><code class="i">cost=startup..total</code> in units, <code class="i">rows</code>, <code class="i">width</code> = estimates; ANALYZE adds <b>actual time / rows / loops</b></li>
<li>Read <b>inside-out, bottom-up</b>; multiply by <code class="i">loops</code>; compare <b>estimate vs actual</b></li>
<li>EXPLAIN ANALYZE <b>executes</b> — <code class="i">BEGIN … ROLLBACK</code> for writes</li>
</ul>
${box('Next: 10.2 — Join strategies', 'Nested Loop, Hash Join, Merge Join: three algorithms behind one JOIN, and how to tell which one is hurting you.', 'lam')}` },
]);
