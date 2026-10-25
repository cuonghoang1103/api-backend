/**
 * pg-10-4 — PostgreSQL · Chapter 10 · Lesson 10.4 "BUFFERS and a tuning workflow" (slide EN, kiểu FU, 25/10/2026, agent c10).
 * Nguồn: content/courses/postgresql/s10-explain-planner.mjs › postgresql-10-4-buffers-tinh-chinh. Output psql = chạy thật PostgreSQL 17.11
 * trên container TẠM pgc10tmp (postgres:17, shared_preload_libraries=pg_stat_statements, khởi động lại để cache lạnh) — video-bai-giang/src/khung/pg/that/
 * pg-10-4.sql/.out.txt (BUFFERS lạnh/ấm, chỉ mục created_at) · pg-10-4b (work_mem tràn đĩa, top-N, SET LOCAL, SERIALIZE/MEMORY, GENERIC_PLAN) ·
 * pg-10-4c (pg_stat_statements, câu dạng Prisma, chỉ mục tổ hợp, auto_explain + .autoexplain.log.txt) · pg-10-4d (random_page_cost) ·
 * pg-10-4.prisma.txt (log Prisma thật của lược đồ cuongthai.com).
 * Bổ sung so với web: ví dụ đời thường (bàn thư viện vs kho), trang 8 kB + shared_buffers, cache lạnh/ấm đo thật, work_mem tràn đĩa + top-N,
 * random_page_cost làm planner chọn sai (BUFFERS bắt quả tang), pg_stat_statements, log Prisma → EXPLAIN (GENERIC_PLAN) → chỉ mục tổ hợp,
 * auto_explain, EXPLAIN (SERIALIZE, MEMORY) của PG 17, quy trình 4 bước, bẫy đo hai lần.
 */
import { lamDeck, sql, run, psql, tbl, two, box, kw, vsd, c, cards, steps, flow } from './_pg-chung.mjs';
import { wrapPlan, bufPic, bars, PG, CAM, XANH, DO, NAU, TIM } from './pg-10-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-10-4', code: 'PG 10.4', title: 'BUFFERS & tuning', sub: 'Count the pages, then follow a workflow' };

const DAY = `EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM ord
WHERE created_at BETWEEN '2024-06-01' AND '2024-06-02';`;
const FIL = `         Filter: ((created_at >= '2024-06-01 00:00:00+07'::timestamp with time zone)
                  AND (created_at <= '2024-06-02 00:00:00+07'::timestamp with time zone))`;

export const slides = lamDeck({ chuong: 'Chapter 10 — EXPLAIN & the planner', bai: '10.4' }, [
  { cover: true, t: 'BUFFERS and a<br>tuning workflow', sub: 'Time depends on what is cached. Pages do not lie.<br>Measure, find the culprit, fix the cause, measure again.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><code class="i">EXPLAIN (ANALYZE, BUFFERS)</code>: how many 8 kB pages a query touched — from <b>cache</b> or from <b>disk</b></li>
<li>A sort that <b>spills to disk</b>, and <code class="i">work_mem</code> used the safe way</li>
<li><code class="i">random_page_cost</code>: a knob that can make the planner choose <b>worse</b> — caught by BUFFERS</li>
<li>Finding slow queries with <b>pg_stat_statements</b> and <b>auto_explain</b></li>
<li>A real <b>Prisma</b> query: log → SQL → EXPLAIN → one index → 196× faster · and the 4-step workflow</li>
</ul>
${box('From 10.3', 'You can fix wrong estimates with ANALYZE and CREATE STATISTICS. Today: measuring the <b>I/O</b> behind a plan, and a repeatable way to tune.', 'lam')}` },

  { t: 'Everyday example first: the library desk', body: `
${two(`<div class="card"><div class="h">📚 On your desk</div><p>Books you used today are on the desk: grab one in a second. That is a <b>cache hit</b>.</p></div>`,
`<div class="card" style="border-color:#e3c9ae"><div class="h">🏛️ In the archive</div><p>Anything else must be fetched from the archive downstairs: minutes. That is a <b>read from disk</b>.</p></div>`)}
${cards([['First visit', 'Everything comes from the archive — slow.'], ['Second visit', 'The same books are on your desk — fast. Nothing about the <b>question</b> changed.'], ['What to count', 'Not the minutes (they depend on the desk), but <b>how many books</b> you needed. 3,677 books to answer “how many orders on June 1st?” is the real problem.']], 3)}
${box('That is BUFFERS', 'A clock measures the desk; <code class="i">BUFFERS</code> counts the books. Same query, same pages — whether they were hot or cold.', '')}` },

  { t: 'What is a buffer?', body: `
${bufPic()}
${tbl(['line in the plan', 'meaning'], [['<code class="i">shared hit=N</code>', 'N pages (8 kB each) found in PostgreSQL’s own cache, <code class="i">shared_buffers</code> (128MB default)'], ['<code class="i">shared read=N</code>', 'N pages not in the cache: asked from the OS — page cache or the real disk'], ['<code class="i">dirtied / written</code>', 'pages this query modified / had to write out itself'], ['<code class="i">temp read / written</code>', 'temporary files: a sort or hash that did not fit in <code class="i">work_mem</code>']])}` },

  { t: 'Cold cache: the first run after a restart', body: `
${zm(run(DAY, wrapPlan(` Aggregate  (cost=11180.74..11180.75 rows=1 width=8) (actual time=64.891..64.892 rows=1 loops=1)
   Buffers: shared read=3677
   ->  Seq Scan on ord  (cost=0.00..11177.00 rows=1497 width=0) (actual time=28.450..64.756 rows=1441 loops=1)
         Rows Removed by Filter: 498559
         Buffers: shared read=3677
 Planning:
   Buffers: shared hit=43 read=18 dirtied=1
 Execution Time: 64.956 ms`, 70), { hlOut: [3, 7, 8] }), 1.2)}
<p style="font-size:21px;margin:0">The server was just restarted, so <code class="i">shared_buffers</code> was empty: all <b>3,677 pages</b> of <code class="i">ord</code> (the whole 29 MB table) were <b>read</b>. Even planning needed 18 catalog pages. <span class="nho">(Filter line omitted.)</span></p>` },

  { t: 'Warm cache: the same query again', body: `
${zm(run(DAY, wrapPlan(` Aggregate  (cost=11180.74..11180.75 rows=1 width=8) (actual time=38.083..38.084 rows=1 loops=1)
   Buffers: shared hit=3677
   ->  Seq Scan on ord  (cost=0.00..11177.00 rows=1497 width=0) (actual time=12.162..38.021 rows=1441 loops=1)
         Rows Removed by Filter: 498559
         Buffers: shared hit=3677
 Execution Time: 38.112 ms`, 70), { hlOut: [3, 7] }), 1.15)}
${two(box('Same work, different clock', 'Now every page is a <b>hit</b>: 65 ms → 38 ms. The query did <b>exactly the same amount of work</b> — 3,677 pages — the desk was just closer.', 'lam'),
  box('The real waste', 'It read the <b>entire table</b> to count <b>1,441 rows</b> of one day (498,559 thrown away). BUFFERS shows the size of the problem independent of the cache.', 'do2'))}` },

  { t: 'Fix the cause: an index that fits the data', body: `
${zm(run(`CREATE INDEX idx_ord_created ON ord(created_at);
${DAY}`, wrapPlan(` Aggregate  (cost=54.10..54.11 rows=1 width=8) (actual time=0.243..0.243 rows=1 loops=1)
   Buffers: shared hit=1 read=6
   ->  Index Only Scan using idx_ord_created on ord  (cost=0.42..50.36 rows=1497 width=0) (actual time=0.060..0.183 rows=1441 loops=1)
         Heap Fetches: 0
         Buffers: shared hit=1 read=6
 Execution Time: 0.264 ms`, 70), { hlOut: [3, 4, 6, 8] }), 1.12)}
<p style="font-size:21px;margin:0"><code class="i">created_at</code> grows with every insert (correlation = 1, 10.3), so one day’s 1,441 entries sit <b>side by side</b> in the index: <b>7 pages</b> instead of 3,677. <b>Index Only Scan</b> + <code class="i">Heap Fetches: 0</code> = the table itself was not touched (Chapter 9). <span class="nho">(Index Cond line omitted.)</span></p>` },

  { t: 'Before and after — pages and time', giua: true, body: `
${bars([{ t: 'pages touched — Seq Scan', v: 3677, nhan: '3,677 pages (29 MB)', mau: DO }, { t: 'pages touched — Index Only', v: 7, nhan: '7 pages (56 kB)', mau: XANH }], { rh: 62, fs: 23, lw: 380, log: true })}
${bars([{ t: 'time — Seq Scan (warm)', v: 38.112, nhan: '38.1 ms', mau: DO }, { t: 'time — Index Only (cold!)', v: 0.264, nhan: '0.26 ms', mau: XANH }], { rh: 62, fs: 23, lw: 380, log: true, k: 'bar2' })}
${box('BUFFERS proves the fix', 'Even with 6 of its 7 pages read cold from disk, the indexed query beats the fully cached scan by 144×. Compare <b>pages</b> first: it is the number that does not depend on luck. (Log scale.)', 'xanh')}` },

  { t: 'A sort that does not fit: external merge', body: `
${zm(run(`SHOW work_mem;            -- 4MB
EXPLAIN (ANALYZE, BUFFERS) SELECT id, amount FROM ord ORDER BY amount DESC;`, wrapPlan(` Sort  (cost=64552.92..65802.92 rows=500000 width=10) (actual time=474.695..641.810 rows=500000 loops=1)
   Sort Key: amount DESC
   Sort Method: external merge  Disk: 10304kB
   Buffers: shared hit=3680, temp read=1288 written=1294
   ->  Seq Scan on ord  (cost=0.00..8677.00 rows=500000 width=10) (actual time=0.008..85.484 rows=500000 loops=1)
         Buffers: shared hit=3677
 Execution Time: 678.174 ms`, 70), { hlOut: [4, 5] }), 1.2)}
<p style="font-size:21px;margin:0">500,000 rows of 10 bytes need ~27 MB to sort; <code class="i">work_mem</code> is 4MB. So PostgreSQL sorts chunks, writes them to <b>temporary files</b> (<code class="i">temp written=1294</code> pages ≈ 10 MB) and merges them back (<code class="i">temp read=1288</code>).</p>` },

  { t: 'More memory — or no big sort at all', giua: true, body: `
${two(zm(run(`SET work_mem = '64MB';
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, amount FROM ord ORDER BY amount DESC;`, wrapPlan(` Sort  (cost=56005.92..57255.92 rows=500000 width=10) (actual time=448.893..596.162 rows=500000 loops=1)
   Sort Method: quicksort  Memory: 27914kB
   Buffers: shared hit=3677
 Execution Time: 626.871 ms`, 52), { hlOut: [3, 4] }), 1.0),
zm(run(`RESET work_mem;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, amount FROM ord ORDER BY amount DESC LIMIT 10;`, wrapPlan(`   ->  Sort  (cost=19481.82..20731.82 rows=500000 width=10) (actual time=199.632..199.632 rows=10 loops=1)
         Sort Method: top-N heapsort  Memory: 25kB
 Execution Time: 199.659 ms`, 52), { hlOut: [3] }), 1.0))}
${two(box('In memory: no temp files', '<code class="i">quicksort Memory: 27914kB</code>, temp buffers gone. Here only 8% faster (the OS had the temp files cached) — but under load, temp I/O competes with everything else.', 'lam'),
  box('Need only the top 10?', 'With <code class="i">LIMIT</code> PostgreSQL keeps a 10-row heap: <code class="i">top-N heapsort Memory: 25kB</code>, even at the default 4MB. Often the best “tuning” is asking for less.', 'xanh'))}` },

  { t: 'work_mem the safe way: SET LOCAL', giua: true, body: `
${two(zm(psql(`pgcourse=# BEGIN;
pgcourse=*# SET LOCAL work_mem = '64MB';
pgcourse=*# SHOW work_mem;
 work_mem
----------
 64MB
pgcourse=*# -- … the one big report query …
pgcourse=*# COMMIT;
pgcourse=# SHOW work_mem;
 work_mem
----------
 4MB`, { hl: [6, 12], title: 'psql (17.11) — pgcourse · output shortened' }), 1.12),
`<div>${box('Why not in postgresql.conf?', '<code class="i">work_mem</code> is granted <b>per sort or hash node, per connection</b>. 100 connections × 3 sorts × 64MB = 19 GB that the server could be asked for at once.', 'do2')}
${box('Scope it', '<code class="i">SET LOCAL</code> lasts until <code class="i">COMMIT</code>/<code class="i">ROLLBACK</code>. Other options: <code class="i">ALTER ROLE report_user SET work_mem = …</code> for one role, or per function.', 'xanh')}</div>`, 'r46')}` },

  { t: 'random_page_cost: a knob that can backfire', body: `
${zm(psql(wrapPlan(`pgcourse=# EXPLAIN (ANALYZE, BUFFERS) SELECT sum(amount) FROM ord WHERE customer_id <= 6000;
 Aggregate  (cost=10678.52..10678.53 rows=1 width=32) (actual time=70.969..70.970 rows=1 loops=1)
   Buffers: shared hit=3677
   ->  Seq Scan on ord  (cost=0.00..9927.00 rows=300605 width=6) (actual time=0.006..37.803 rows=300150 loops=1)
 Execution Time: 70.988 ms`, 90, 6), { hl: [4, 7], title: 'psql (17.11) — random_page_cost = 4 (default) · 60% of all orders · index on ord(customer_id)' }), 0.9)}
${zm(psql(wrapPlan(`pgcourse=# SET random_page_cost = 1.1;   -- then the same EXPLAIN
 Aggregate  (cost=10346.48..10346.49 rows=1 width=32) (actual time=143.408..143.409 rows=1 loops=1)
   Buffers: shared hit=298313 read=130
   ->  Index Scan using idx_ord_customer on ord  (cost=0.42..9594.97 rows=300605 width=6) (actual time=0.012..120.823 rows=300150 loops=1)
 Execution Time: 143.429 ms`, 90, 6), { hl: [4, 7], title: 'psql (17.11) — random_page_cost = 1.1 · same query' }), 0.9)}
<p style="font-size:20px;margin:0"><code class="i">random_page_cost</code> = the planner’s price of a <b>random</b> page read (sequential = 1.0). Lowering it made the Index Scan look cheap — it touched <b>298,443 pages</b> (one per row) and took <b>2× longer</b>.</p>` },

  { t: 'What to do with random_page_cost', giua: true, body: `
${zm(tbl(['customer_id ≤', 'rpc 4 (default)', 'rpc 1.1', 'winner'], [['3000 (30%)', 'Bitmap Heap Scan · 35.8 ms · 3,809 pages', 'Index Scan · 87.3 ms · 149,253 pages', 'default'], ['6000 (60%)', 'Seq Scan · 71.0 ms · 3,677 pages', 'Index Scan · 143.4 ms · 298,443 pages', 'default']], { o: [[0, 1], [1, 1]] }), 1.1)}
${zm(cards([['Why 4?', 'Spinning disks: a random seek ≈ 40× a sequential read; 4 assumes most pages are cached. SSDs and cloud disks make random reads much cheaper.'], ['SSD advice: 1.1', 'Common and often right for <b>selective</b> lookups. But it is a server-wide guess — test it on your <b>real</b> workload, not one query.'], ['Measure with BUFFERS', 'If a plan change after tuning shows pages jumping from thousands to hundreds of thousands, the knob lied. Set it per tablespace/database if storage differs.']], 3), 1.1)}` },

  { t: 'Which queries are slow? pg_stat_statements', body: `
${two(sql(`-- postgresql.conf (needs a restart)
shared_preload_libraries = 'pg_stat_statements'
-- then, once per database
CREATE EXTENSION pg_stat_statements;`, { sm: true, lang: 'pgsql' }),
`<ul style="font-size:21px"><li>Groups <b>every</b> statement by shape: constants become <code class="i">$1</code></li><li>Counts calls, total / mean time, rows, buffers</li><li>Sort by <b>total</b> time: 14 ms × 40 calls beats 24 ms × 10</li></ul>`)}
${zm(run(`SELECT calls, round(total_exec_time::numeric, 1) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms,
       rows, left(regexp_replace(query, '\\s+', ' ', 'g'), 60) AS query
FROM pg_stat_statements WHERE query NOT ILIKE '%pg_stat_statements%' AND calls >= 10
ORDER BY total_exec_time DESC LIMIT 5;`, ` calls | total_ms | mean_ms | rows |                            query
-------+----------+---------+------+--------------------------------------------------------------
    40 |    570.4 |   14.26 |  800 | PREPARE recent_orders(int, bigint, bigint) AS SELECT id, amo
    10 |    239.5 |   23.95 |   10 | SELECT count(*) FROM ord WHERE status = $1
    40 |      0.5 |    0.01 |   40 | SELECT name, city FROM customer WHERE id = $1
(3 rows)`, { hlOut: [3] }), 0.98)}
${box('The top line', '<code class="i">recent_orders</code> — “the latest 20 orders of a customer”, the shape an app sends on every profile page: 40 calls, 570 ms in total. That is the one to EXPLAIN.', 'lam')}` },

  { t: 'EXPLAIN the top query with real parameters', body: `
${zm(run(`PREPARE recent_orders(int, bigint, bigint) AS
SELECT id, amount, created_at FROM ord
WHERE customer_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;
EXPLAIN (ANALYZE, BUFFERS) EXECUTE recent_orders(42, 20, 0);`, wrapPlan(` Limit  (cost=1793.02..3585.62 rows=5 width=18) (actual time=0.875..11.374 rows=20 loops=1)
   Buffers: shared hit=2265
   ->  Index Scan Backward using idx_ord_created on ord  (cost=0.42..17926.42 rows=50 width=18) (actual time=0.874..11.369 rows=20 loops=1)
         Filter: (customer_id = $1)
         Rows Removed by Filter: 176352
         Buffers: shared hit=2265
 Execution Time: 11.387 ms`, 70), { hlOut: [3, 4, 6, 7] }), 1.0)}
<p style="font-size:21px;margin:0">The planner walks the <code class="i">created_at</code> index <b>backwards</b> (newest first) hoping to meet 20 orders of customer 42 soon. It had to skip <b>176,352</b> other orders and touch <b>2,265 pages</b>. Only an index on <code class="i">created_at</code> exists — none that starts with <code class="i">customer_id</code>. <span class="nho">(Planning line omitted.)</span></p>` },

  { t: 'The same shape from Prisma on cuongthai.com', body: `
${psql(`prisma:query SELECT "public"."posts"."id", "public"."posts"."title", "public"."posts"."published_at"
  FROM "public"."posts" WHERE "public"."posts"."author_id" = $1
  ORDER BY "public"."posts"."published_at" DESC LIMIT $2 OFFSET $3
params [1,20,0] 9ms`, { sm: true, title: "Prisma query log · prisma.post.findMany({ where: { authorId }, orderBy: { publishedAt: 'desc' }, take: 20 })", hl: [2, 3] })}
${two(`<div>${sql(`// prisma/schema.prisma — model Post (excerpt)
@@index([authorId],                  name: "idx_posts_author_id")
@@index([publishedAt(sort: Desc)],   name: "idx_posts_published_at")`, { lang: 'typescript', sm: true })}
<p style="font-size:20px;margin:8px 0 0">Two <b>separate</b> indexes — the same situation as <code class="i">ord</code>: the planner can filter by author <i>or</i> walk dates backwards, not both at once.</p></div>`,
zm(run(`EXPLAIN (GENERIC_PLAN)   -- PG 16+: plan a query that has $1
SELECT id, amount FROM ord WHERE customer_id = $1
ORDER BY created_at DESC LIMIT 20;`, wrapPlan(` Limit  (cost=0.42..7170.82 rows=20 width=18)
   ->  Index Scan Backward using idx_ord_created on ord  (cost=0.42..17926.42 rows=50 width=18)
         Filter: (customer_id = $1)`, 56, 4), { hlOut: [3, 4] }), 0.9), 'r46')}
${box('From log to plan', 'Turn on Prisma’s query log, copy the SQL, then <code class="i">EXPLAIN (GENERIC_PLAN)</code> it as-is with <code class="i">$1</code> — or <code class="i">PREPARE</code> + <code class="i">EXPLAIN ANALYZE EXECUTE</code> with real values, exactly like the app.', 'lam')}` },

  { t: 'One composite index — 11.4 ms → 0.058 ms', body: `
${zm(run(`CREATE INDEX idx_ord_customer_created ON ord(customer_id, created_at DESC);
EXPLAIN (ANALYZE, BUFFERS) EXECUTE recent_orders(42, 20, 0);`, wrapPlan(` Limit  (cost=20.91..41.40 rows=5 width=18) (actual time=0.023..0.048 rows=20 loops=1)
   Buffers: shared hit=20 read=3
   ->  Index Scan using idx_ord_customer_created on ord  (cost=0.42..205.29 rows=50 width=18) (actual time=0.022..0.045 rows=20 loops=1)
         Index Cond: (customer_id = $1)
 Execution Time: 0.058 ms`, 70), { hlOut: [3, 4, 6] }), 1.12)}
${two(`<div>${tbl(['', 'before', 'after'], [['plan', 'Index Scan Backward + Filter', '<b>Index Scan</b>, Index Cond'], ['rows skipped', '176,352', '0'], ['pages', '2,265', '<b>23</b>'], ['time', '11.387 ms', '<b>0.058 ms</b> (196×)']], { o: [[2, 2], [3, 2]] })}</div>`,
sql(`// the Prisma way (example model)
model Order {
  // …
  @@index([customerId, createdAt(sort: Desc)])
}`, { lang: 'typescript', sm: true }), 'r64')}` },

  { t: 'auto_explain · PostgreSQL 17 EXPLAIN options', body: `
${two(`<div>${sql(`LOAD 'auto_explain';                   -- or shared_preload_libraries
SET auto_explain.log_min_duration = '100ms';
SET auto_explain.log_analyze = on;
SET auto_explain.log_buffers = on;`, { sm: true })}
${psql(`LOG:  duration: 147.143 ms  plan:
  Query Text: SELECT c.region, count(*) FROM ord o JOIN customer c …
  HashAggregate  (cost=12792.06..12792.09 rows=3 width=14) (actual …)
    Buffers: shared hit=3754
    ->  Hash Join  (cost=302.00..10292.06 rows=500000 width=6) (actual …)
  …`, { sm: true, title: 'server log (docker logs) — shortened', hl: [1] })}</div>`,
`<div>${zm(run(`EXPLAIN (ANALYZE, BUFFERS, SERIALIZE, MEMORY)
SELECT * FROM customer WHERE city = 'Hue';`, ` Seq Scan on customer  (cost=0.00..202.00 rows=1000 width=29)
     ↪ (actual time=0.026..1.135 rows=1000 loops=1)
   Buffers: shared read=77
 Planning:
   Buffers: shared hit=34 read=2
   Memory: used=10kB  allocated=16kB
 Serialization: time=0.137 ms  output=44kB  format=text
 Execution Time: 1.343 ms`, { hlOut: [8, 9] }), 0.82)}
<p style="font-size:19px;margin:6px 0 0"><b>auto_explain</b> logs the plan of every statement slower than the threshold — catches the slow query you never ran by hand. PG 17: <b>MEMORY</b> = planner memory, <b>SERIALIZE</b> = cost of turning rows into bytes for the client.</p></div>`)}` },

  { t: 'The tuning workflow', body: `
${flow([{ t: '1 · Measure', s: 'EXPLAIN (ANALYZE, BUFFERS)', mau: PG }, { t: '2 · Find', s: 'the culprit node', mau: CAM }, { t: '3 · Fix', s: 'the cause', mau: XANH }, { t: '4 · Re-measure', s: 'pages + time', mau: TIM }], { h: 140 })}
${tbl(['look for…', 'usually means', 'fix'], [['Seq Scan with huge Rows Removed by Filter', 'missing / unusable index', 'an index that matches WHERE (+ ORDER BY) — Ch 9'], ['big <code class="i">loops=</code> on a Nested Loop inner side', 'FK without index, or wrong estimate', 'index the FK; ANALYZE — 10.2, 10.3'], ['rows estimate ≠ actual by 100×+', 'stale / correlated statistics', 'ANALYZE · CREATE STATISTICS — 10.3'], ['Sort/Hash with Disk / temp / Batches &gt; 1', 'work_mem too small for this query', 'SET LOCAL work_mem, or LIMIT / an index that returns rows sorted']])}
${box('Never “fix” with switches', '<code class="i">enable_*</code> and global knobs are for diagnosis. Fix the index, the statistics or the query, so the planner chooses well on its own — and re-measure every time.', 'do2')}` },

  { t: 'Trap: timing twice and believing the second number', body: `
${vsd(`<p style="font-size:21px;margin:0">Run the slow query, it takes 65 ms. Run it again: 38 ms. “Already faster — tuning done.”</p>
<ul style="font-size:20px;margin-top:8px"><li>The second run found every page in cache</li><li>Production users arriving first in the morning get the <b>cold</b> number</li><li>Nothing about the plan changed</li></ul>`,
`<p style="font-size:21px;margin:0">Read <b>BUFFERS</b> next to the time:</p>
<ul style="font-size:20px;margin-top:8px"><li><code class="i">shared read</code> = disk, <code class="i">shared hit</code> = cache — know which number you are looking at</li><li>Compare <b>pages</b> before/after: 3,677 → 7 is real; 65 → 38 ms was luck</li><li>Size your expectations by the <b>cold</b> run</li></ul>`)}
${box('On cuongthai.com', 'Exactly this loop fixed the slow endpoints: measure with BUFFERS, spot the giant Seq Scan or the FK-less Nested Loop, add one index, watch pages fall from thousands to single digits — then confirm on a cold cache.', 'lam')}` },

  { t: 'Practice & check yourself', giua: true, body: `
${zm(two(`<div><p style="font-size:22px;margin:0"><b>Practice.</b> On your copy of <code class="i">ord</code>:</p>
<ol style="font-size:21px"><li>Run the June-1st count with <code class="i">BUFFERS</code> twice — note <code class="i">read</code> vs <code class="i">hit</code>.</li><li>Add <code class="i">idx_ord_created</code>; compare <b>pages</b>, not only ms.</li><li>Sort all orders by amount with 4MB and 64MB — find the <code class="i">temp</code> line.</li></ol>
${box('Expected', '3,677 pages both runs (read → hit) · 7 pages with the index · <code class="i">external merge Disk ≈ 10MB</code> → <code class="i">quicksort Memory ≈ 27MB</code>.', 'xanh')}</div>`,
`<div><p style="font-size:22px;margin:0"><b>Check yourself.</b></p>
<ol style="font-size:21px"><li><code class="i">Buffers: shared hit=2 read=9000</code> — cache or disk?</li><li>Why not set <code class="i">work_mem = 1GB</code> in postgresql.conf?</li><li>Which extension ranks queries by total time?</li></ol>
${box('Answers', '1 — mostly <b>disk</b> (read). 2 — it is per sort/hash node per connection ⇒ memory explosion; use SET LOCAL. 3 — <code class="i">pg_stat_statements</code>.', 'xanh')}</div>`), 1.08)}` },

  { t: 'Summary — Chapter 10 complete', to: true, giua: true, body: `
<ul>
<li><code class="i">BUFFERS</code>: <b>hit</b> = cache, <b>read</b> = disk, <b>temp</b> = spilled — pages are the honest measure</li>
<li>Sorts that spill: <code class="i">SET LOCAL work_mem</code>, <code class="i">LIMIT</code> or an index — never a global 1GB</li>
<li>Find slow queries with <code class="i">pg_stat_statements</code> / <code class="i">auto_explain</code>; plan Prisma’s SQL with <code class="i">GENERIC_PLAN</code></li>
<li>Workflow: <b>measure → find → fix the cause → re-measure</b></li>
</ul>
${box('Next: Chapter 11 — Transactions & concurrency', 'From speed to correctness: transactions, MVCC, isolation levels and locks — what happens when two users change the same row at the same moment.', 'lam')}` },
]);
