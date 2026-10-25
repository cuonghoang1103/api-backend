/**
 * pg-10-3 — PostgreSQL · Chapter 10 · Lesson 10.3 "Statistics: how the planner estimates, and when it's wrong" (slide EN, kiểu FU, 25/10/2026, agent c10).
 * Nguồn: content/courses/postgresql/s10-explain-planner.mjs › postgresql-10-3-thong-ke-uoc-luong. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-10-3.sql/.out.txt — pg_stats, histogram, cột tương quan, CREATE STATISTICS; pg-10-3b — nhập 50.000 dòng,
 * thống kê cũ ⇒ rows=1 ⇒ Nested Loop 15,1 s ⇒ ANALYZE ⇒ Hash Join 35 ms; pg-10-3c — bài tập tự tính ước lượng). Schema ch10.
 * Bổ sung so với web: ví dụ đời thường (bếp ăn ước suất), mẫu 30.000 dòng, đọc pg_stats (n_distinct âm, correlation), MCV ⇒ 9.700 tính tay,
 * histogram 100 ô, quy tắc kết hợp (=, khoảng, AND, OR), GROUP BY ước 18 vs 6 + ndistinct, ba loại thống kê mở rộng, bẫy thống kê cũ sau
 * nhập lô (ngưỡng autovacuum 50.050), danh sách chẩn đoán, Prisma migrate/seed không ANALYZE, bài tập.
 */
import { lamDeck, sql, run, psql, tbl, two, box, kw, vsd, c, cards, steps, flow } from './_pg-chung.mjs';
import { wrapPlan, histPic, vennPic, bars, PG, CAM, XANH, DO, NAU, TIM } from './pg-10-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-10-3', code: 'PG 10.3', title: 'Statistics & estimates', sub: 'How the planner estimates, and when it is wrong' };

export const slides = lamDeck({ chuong: 'Chapter 10 — EXPLAIN & the planner', bai: '10.3' }, [
  { cover: true, t: 'Statistics: how the planner<br>estimates — and when it’s wrong', sub: 'Every <code>rows=</code> in a plan is a guess built from a sample.<br>Fix the guess and the plan usually fixes itself.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Where every <code class="i">rows=</code> estimate comes from: <code class="i">ANALYZE</code> → <code class="i">pg_stats</code></li>
<li>Reading the statistics: <b>n_distinct</b>, <b>most common values</b>, <b>histogram</b>, correlation</li>
<li>Estimating like the planner — by hand, and checking against real plans</li>
<li>Two ways estimates go wrong: <b>correlated columns</b> and <b>stale statistics</b></li>
<li>The fixes: <code class="i">CREATE STATISTICS</code> and <code class="i">ANALYZE</code> — 15 s → 35 ms</li>
</ul>
${box('From 10.2', 'The planner picked Nested Loop, Hash or Merge from <b>row estimates</b>. Today: what happens when those estimates are wrong.', 'lam')}` },

  { t: 'Everyday example first: the school canteen', body: `
${two(`<div class="card"><div class="h">How the cook plans lunch</div><p>No one counts every student each morning. The cook looks at a <b>sample</b>: last month’s sign-up sheet — “about 20% eat noodles, 30% eat rice…” — and cooks for that.</p></div>`,
`<div class="card" style="border-color:#e3a59c;background:#fdf0ee"><div class="h" style="color:#a52a1d">When the guess goes wrong</div><p>Yesterday a <b>new class of 50 joined</b> and nobody updated the sheet → not enough food. Or the cook assumed “noodles” and “Grade 10” are unrelated when Grade 10 <b>always</b> eats noodles.</p></div>`)}
${tbl(['canteen', 'PostgreSQL'], [['the sign-up sheet (a sample)', '<b>statistics</b> gathered by <code class="i">ANALYZE</code>'], ['“about 20% eat noodles”', '<b>most common values</b> + frequencies'], ['new class not on the sheet', '<b>stale statistics</b> after a bulk import'], ['“noodles and Grade 10 are unrelated”', 'the <b>independence assumption</b> → correlated columns']])}
${box('So the plan is only as good as the sheet', 'A wrong estimate does not just print a wrong number — it makes the planner choose the wrong join, the wrong index, the wrong memory.', '')}` },

  { t: 'Where the estimates come from', body: `
${flow([{ t: 'ANALYZE', s: 'samples the table' }, { t: 'pg_statistic', s: 'stores the stats', mau: TIM }, { t: 'planner', s: 'estimates rows=', mau: CAM }, { t: 'plan', s: 'cheapest by cost', mau: XANH }])}
${two(`<ul style="font-size:22px">
<li><code class="i">ANALYZE</code> reads a <b>random sample</b>: 300 × <code class="i">default_statistics_target</code> (100) = <b>30,000 rows</b> per table</li>
<li>Per column it records: share of NULLs, number of distinct values, the most common values + their frequencies, a histogram, physical correlation</li>
<li><b>autovacuum</b> re-runs ANALYZE automatically after enough changes</li>
</ul>`, box('Readable view', '<code class="i">pg_statistic</code> is the raw catalog; query the friendly view <code class="i">pg_stats</code> instead. Because it is a <b>sample</b>, two ANALYZE runs can give slightly different estimates (9,700 here, 10,183 on another run — actual 10,000).', 'lam'), 'r64')}` },

  { t: 'Reading pg_stats for the ord table', body: `
${zm(run(`SELECT attname, null_frac, n_distinct, correlation
FROM pg_stats WHERE schemaname = 'ch10' AND tablename = 'ord'
ORDER BY attname;`, `   attname   | null_frac | n_distinct |  correlation
-------------+-----------+------------+---------------
 amount      |         0 |      46521 | -0.0057615046
 created_at  |         0 |         -1 |             1
 customer_id |         0 |       9949 |  0.0015189351
 id          |         0 |         -1 |             1
 status      |         0 |          4 |     0.5296079
(5 rows)`, { hlOut: [4, 7] }), 1.15)}
${cards([['n_distinct = 4', 'status has 4 distinct values. A <b>positive</b> number is a count.'], ['n_distinct = -1', '<b>Negative</b> = a fraction of the rows: −1 means every row is different (id, created_at) — it grows with the table.'], ['correlation = 1', 'Physical order matches the column order (rows were inserted by time). Near 0 = scattered — index range scans cost more random reads.']], 3)}` },

  { t: 'Most common values → an estimate you can compute', body: `
${two(zm(run(`SELECT most_common_vals, most_common_freqs
FROM pg_stats
WHERE schemaname = 'ch10' AND tablename = 'ord'
  AND attname = 'status';`, `        most_common_vals         |           most_common_freqs
---------------------------------+---------------------------------------
 {paid,shipped,pending,refunded} | {0.6928333,0.1915,0.096266665,0.0194}
(1 row)`, { hlOut: [3] }), 0.92),
`<div>${zm(run(`SELECT 0.0194 * 500000 AS estimate;`, ` estimate
-----------
 9700.0000
(1 row)`, { hlOut: [3] }), 1.0)}
${box('That is the rows=9700 of 10.1', '<code class="i">WHERE status = \'refunded\'</code> ⇒ frequency 0.0194 × 500,000 rows = <b>9,700</b>. The sample saw 1.94%; the truth is exactly 2% (10,000).', 'xanh')}</div>`, 'r64')}
${box('MCV list', 'Up to 100 most common values per column (the statistics target). A value <b>not</b> in the list gets the leftover share spread over the remaining distinct values.', 'lam')}` },

  { t: 'Histogram: estimating a range', body: `
${histPic()}
${two(zm(run(`SELECT array_length(histogram_bounds::text::numeric[], 1) AS buckets_plus_1,
       (histogram_bounds::text::numeric[])[1:6] AS first_bounds
FROM pg_stats WHERE schemaname = 'ch10' AND tablename = 'ord' AND attname = 'amount';`, ` buckets_plus_1 |            first_bounds
----------------+-------------------------------------
            101 | {5.02,9.79,14.52,19.30,24.30,29.18}`), 0.78),
zm(psql(wrapPlan(`EXPLAIN ANALYZE SELECT count(*) FROM ord WHERE amount < 100;
   ->  Seq Scan on ord  (cost=0.00..9927.00 rows=97364 width=0) (actual time=0.008..30.603 rows=96039 loops=1)
         Filter: (amount < '100'::numeric)`, 66, 8), { hl: [2, 3, 4], title: 'psql (17.11) — Seq Scan line only' }), 0.82))}
<p style="font-size:20px;margin:0">Values not in the MCV list are cut into <b>100 buckets of equal row counts</b>. <code class="i">amount &lt; 100</code> covers ~19.5 buckets ⇒ ≈ 19.5% × 500,000 ⇒ estimate <b>97,364</b>, actual <b>96,039</b> (1.4% off).</p>` },

  { t: 'How the planner combines conditions', body: `
${tbl(['condition', 'how the selectivity is computed', 'example'], [
    ['<code class="i">col = const</code>', 'frequency from the MCV list (or the leftover share)', 'status = refunded → 0.0194'],
    ['<code class="i">col &lt; const</code>', 'fraction of histogram buckets covered', 'amount &lt; 100 → ~0.195'],
    ['<code class="i">A AND B</code>', '<b>multiply</b>: sel(A) × sel(B) — assumes independence', '0.2 × 0.2 = 0.04'],
    ['<code class="i">A OR B</code>', 'sel(A) + sel(B) − sel(A) × sel(B)', ''],
    ['<code class="i">GROUP BY a, b</code>', 'number of groups ≈ <b>n_distinct(a) × n_distinct(b)</b> (capped)', '6 × 3 = 18'],
    ['<code class="i">t1.x = t2.y</code> (join)', 'from the n_distinct of both sides', '']])}
${box('The weak spot', 'Two of these rules assume the columns have <b>nothing to do with each other</b>. Real data is full of columns that do: city and region, zip code and district, product and category…', 'do2')}` },

  { t: 'Correlated columns: the estimate collapses', body: `
${two(zm(run(`EXPLAIN ANALYZE SELECT * FROM customer
WHERE city = 'Hanoi' AND region = 'North';`, wrapPlan(` Seq Scan on customer  (cost=0.00..227.00 rows=400 width=29) (actual time=0.004..0.598 rows=2000 loops=1)
   Filter: ((city = 'Hanoi'::text) AND (region = 'North'::text))
   Rows Removed by Filter: 8000`, 58), { hlOut: [1, 2] }), 0.95),
`${tbl(['column', 'n_distinct', 'MCV frequencies'], [['city', '6', 'HCMC .25 · Da Nang .2 · <b>Hanoi .2</b> · Can Tho .15 · Hue .1 · Vung Tau .1'], ['region', '3', 'South .5 · Central .3 · <b>North .2</b>']])}`, 'r46')}
${vennPic()}` },

  { t: 'GROUP BY has the same blind spot', body: `
${zm(run(`EXPLAIN ANALYZE SELECT city, region, count(*) FROM customer GROUP BY city, region;`, wrapPlan(` HashAggregate  (cost=252.00..252.18 rows=18 width=20) (actual time=1.906..1.907 rows=6 loops=1)
   Group Key: city, region
   Batches: 1  Memory Usage: 24kB
   ->  Seq Scan on customer  (cost=0.00..177.00 rows=10000 width=12) (actual time=0.003..0.465 rows=10000 loops=1)`, 70), { hlOut: [1, 2] }), 1.1)}
${zm(two(box('Planner’s arithmetic', '6 cities × 3 regions = <b>18 groups</b> expected. But each city belongs to exactly one region ⇒ only <b>6</b> real groups.', 'do2'),
  box('Why you care', 'The group estimate sizes the hash table and decides HashAggregate vs Sort + GroupAggregate. On big tables a 10× miss here changes memory use and plan shape.', 'lam')), 1.12)}` },

  { t: 'The fix: CREATE STATISTICS', body: `
${zm(run(`CREATE STATISTICS st_cust_city_region (dependencies, ndistinct)
  ON city, region FROM customer;
ANALYZE customer;
SELECT statistics_name, dependencies, n_distinct
FROM pg_stats_ext WHERE statistics_name = 'st_cust_city_region';`, `   statistics_name   |               dependencies               | n_distinct
---------------------+------------------------------------------+-------------
 st_cust_city_region | {"3 => 4": 1.000000, "4 => 3": 0.200000} | {"3, 4": 6}
(1 row)`, { hlOut: [3] }), 1.1)}
${cards([['"3 => 4": 1.0', 'Column 3 (city) <b>fully determines</b> column 4 (region): knowing the city, the region is certain.'], ['"4 => 3": 0.2', 'Region only weakly predicts city (South has three cities).'], ['{"3, 4": 6}', 'The pair (city, region) has <b>6</b> distinct combinations — not 18.']], 3)}` },

  { t: 'After: the estimates are exact', body: `
${two(zm(run(`EXPLAIN ANALYZE SELECT * FROM customer
WHERE city = 'Hanoi' AND region = 'North';`, wrapPlan(` Seq Scan on customer  (cost=0.00..227.00 rows=2000 width=29) (actual time=0.004..0.544 rows=2000 loops=1)
   Filter: ((city = 'Hanoi'::text) AND (region = 'North'::text))
   Rows Removed by Filter: 8000`, 58), { hlOut: [1, 2] }), 0.95),
zm(run(`EXPLAIN ANALYZE SELECT city, region, count(*)
FROM customer GROUP BY city, region;`, wrapPlan(` HashAggregate  (cost=252.00..252.06 rows=6 width=20) (actual time=1.883..1.884 rows=6 loops=1)
   Group Key: city, region`, 58), { hlOut: [1, 2] }), 0.95))}
${bars([{ t: 'Hanoi AND North — before', v: 400, nhan: 'est 400 vs 2,000 (5× off)', mau: DO }, { t: 'Hanoi AND North — after', v: 2000, nhan: 'est 2,000 = 2,000 ✓', mau: XANH }, { t: 'GROUP BY — before', v: 18, nhan: 'est 18 vs 6 (3× off)', mau: DO }, { t: 'GROUP BY — after', v: 6, nhan: 'est 6 = 6 ✓', mau: XANH }], { rh: 50, fs: 20, lw: 330, log: true })}` },

  { t: 'Three kinds of extended statistics', giua: true, body: `
${zm(tbl(['kind', 'what it learns', 'fixes', 'example'], [
    ['<code class="i">dependencies</code>', 'column A determines column B', '<code class="i">WHERE a = … AND b = …</code> underestimates', 'city → region · zip → district'],
    ['<code class="i">ndistinct</code>', 'real number of distinct (a, b) pairs', 'GROUP BY a, b and DISTINCT estimates', '(city, region) = 6, not 18'],
    ['<code class="i">mcv</code>', 'most common <b>combinations</b> + frequencies', 'skewed pairs, also <code class="i">IN</code> / ranges on both', 'which (city, region) pairs are frequent'],
    ['expressions (PG 14+)', 'stats on <code class="i">lower(email)</code>, <code class="i">date_trunc(…)</code>', 'filters on an expression', '<code class="i">ON (lower(email)) FROM users</code>']]), 1.08)}
${two(box('Cost', 'They are only gathered by <b>ANALYZE</b> and only for the listed columns of one table — cheap, but not free. Create them where a plan shows a big estimate gap.', 'lam'),
  box('Not across tables', 'Extended statistics never cover a join between two tables (PostgreSQL 17). Cross-table correlation still fools join estimates.', ''))}` },

  { t: 'Stale statistics: 50,000 orders imported', body: `
${zm(run(`-- a bulk import of 50,000 new orders with a NEW status value
INSERT INTO ord
SELECT g, 1 + (g % 10000), 99.00, 'imported', timestamptz '2025-01-01 00:00:00+07' + (g - 500001) * interval '1 second'
FROM generate_series(500001, 550000) g;
EXPLAIN ANALYZE SELECT count(*) FROM ord WHERE status = 'imported';`, wrapPlan(` Aggregate  (cost=10920.52..10920.53 rows=1 width=8) (actual time=47.173..47.174 rows=1 loops=1)
   ->  Seq Scan on ord  (cost=0.00..10920.51 rows=1 width=0) (actual time=35.625..41.242 rows=50000 loops=1)
         Filter: (status = 'imported'::text)
         Rows Removed by Filter: 500000`, 66), { hlOut: [3, 4] }), 0.98)}
<p style="font-size:21px;margin:0">The statistics still say <code class="i">status</code> has 4 values that cover 100% of the rows. <code class="i">imported</code> is not in the list, so the planner’s best guess is <b>rows=1</b> — actual <b>50,000</b>. <span class="nho">(INSERT output line omitted.)</span></p>
${box('The planner’s arithmetic', 'MCV frequencies 0.69 + 0.19 + 0.10 + 0.02 = <b>1.00</b> ⇒ the leftover share for any other value is <b>0</b> ⇒ PostgreSQL never estimates fewer than 1 row, so it prints <b>rows=1</b>. Statistics describe the table <b>as it was</b> at the last ANALYZE.', 'do2')}` },

  { t: 'rows=1 → the wrong join → 15 seconds', body: `
${zm(run(`EXPLAIN ANALYZE
SELECT o.id, o.amount, s.carrier
FROM ord o JOIN shipment s ON s.ord_id = o.id      -- shipment: 2,000 rows, no index on ord_id
WHERE o.status = 'imported';`, wrapPlan(` Nested Loop  (cost=0.00..10976.51 rows=1 width=15) (actual time=57.818..15105.116 rows=2000 loops=1)
   Join Filter: (o.id = s.ord_id)
   Rows Removed by Join Filter: 99998000
   ->  Seq Scan on ord o  (cost=0.00..10920.51 rows=1 width=10) (actual time=46.875..85.572 rows=50000 loops=1)
         Filter: (status = 'imported'::text)
   ->  Seq Scan on shipment s  (cost=0.00..31.00 rows=2000 width=9) (actual time=0.003..0.162 rows=2000 loops=50000)
 Execution Time: 15106.652 ms`, 66), { hlOut: [1, 2, 4, 6, 9, 10, 11] }), 0.94)}
<p style="font-size:21px;margin:0">Believing the outer side has <b>1 row</b>, a Nested Loop with a full scan inside looked cheapest. In reality the inner scan of 2,000 shipments ran <b>50,000 times</b>: 100 million comparisons, <b>15.1 seconds</b>. <span class="nho">(Rows Removed by Filter / Planning lines omitted.)</span></p>` },

  { t: 'Why didn’t autovacuum fix it?', body: `
${two(zm(run(`SELECT n_live_tup, n_mod_since_analyze,
       last_autoanalyze IS NULL AS never_autoanalyzed
FROM pg_stat_user_tables
WHERE schemaname = 'ch10' AND relname = 'ord';`, ` n_live_tup | n_mod_since_analyze | never_autoanalyzed
------------+---------------------+--------------------
     550000 |               50000 | t
(1 row)`, { hlOut: [3] }), 0.85),
zm(run(`SELECT current_setting('autovacuum_analyze_threshold') AS threshold,
       current_setting('autovacuum_analyze_scale_factor') AS scale_factor,
       50 + 0.1 * 500000 AS autoanalyze_after_changes;`, ` threshold | scale_factor | autoanalyze_after_changes
-----------+--------------+---------------------------
 50        | 0.1          |                   50050.0
(1 row)`, { hlOut: [3] }), 0.78))}
${box('50,000 < 50,050', 'autovacuum re-analyzes a table after <b>50 + 10% of its rows</b> have changed. Our import changed 50,000 rows — 50 short. On a 50-million-row table you could import <b>5 million</b> rows and still plan on the old statistics.', 'do2')}
${box('Habit', 'Run <code class="i">ANALYZE table</code> yourself right after a bulk load, a big backfill, or a migration that reshapes a table. <code class="i">prisma migrate deploy</code> and seed scripts do <b>not</b> do it for you.', 'xanh')}` },

  { t: 'ANALYZE → Hash Join → 35 ms', body: `
${zm(run(`ANALYZE ord;
EXPLAIN ANALYZE SELECT o.id, o.amount, s.carrier
FROM ord o JOIN shipment s ON s.ord_id = o.id WHERE o.status = 'imported';`, wrapPlan(` Hash Join  (cost=56.00..11163.49 rows=180 width=15) (actual time=26.628..34.992 rows=2000 loops=1)
   Hash Cond: (o.id = s.ord_id)
   ->  Seq Scan on ord o  (cost=0.00..10920.00 rows=49518 width=10) (actual time=26.294..31.258 rows=50000 loops=1)
         Filter: (status = 'imported'::text)
   ->  Hash  (cost=31.00..31.00 rows=2000 width=9) (actual time=0.318..0.320 rows=2000 loops=1)
         Buckets: 2048  Batches: 1  Memory Usage: 100kB
 Execution Time: 35.065 ms`, 70), { hlOut: [1, 2, 5, 6, 11] }), 0.98)}
${bars([{ t: 'stale stats · Nested Loop', v: 15106.652, nhan: '15,106.7 ms', mau: DO }, { t: 'after ANALYZE · Hash Join', v: 35.065, nhan: '35.1 ms', mau: XANH }], { rh: 52, fs: 21, lw: 330, log: true })}
<p class="nho" style="margin:0">Log scale. Same query, same data, same indexes — only the statistics changed: ≈ 430× faster.</p>` },

  { t: 'Diagnose: when estimate and actual disagree', body: `
${steps(['<b>Find the node</b> where <code class="i">rows=</code> (estimate) and <code class="i">actual rows</code> first diverge — usually low in the tree. Everything above it inherits the error.',
  '<b>Stale?</b> Check <code class="i">n_mod_since_analyze</code> / <code class="i">last_analyze</code> in <code class="i">pg_stat_user_tables</code>. Fix: <code class="i">ANALYZE table;</code>',
  '<b>Sample too small?</b> Skewed column with many values: <code class="i">ALTER TABLE t ALTER COLUMN c SET STATISTICS 1000; ANALYZE t;</code>',
  '<b>Correlated columns?</b> Multi-column filters or GROUP BY: <code class="i">CREATE STATISTICS … (dependencies, ndistinct, mcv)</code>',
  '<b>Expression?</b> <code class="i">WHERE lower(email) = …</code> has no stats of its own: an expression index or expression statistics.'])}
${box('Fix the estimate, not the plan', 'Once the planner knows the real row counts it picks the join, index and memory on its own — no <code class="i">enable_*</code> switches, no rewrites.', 'xanh')}` },

  { t: 'Trap: “just raise work_mem for everyone”', giua: true, body: `
${zm(vsd(`<p style="font-size:21px;margin:0">A plan shows <code class="i">Sort Method: external merge Disk: 45MB</code>, so you set in <code class="i">postgresql.conf</code>:</p>
${sql(`work_mem = '256MB'   -- for every sort, everywhere`, { sm: true })}
<p style="font-size:20px;margin:6px 0 0"><code class="i">work_mem</code> is <b>per sort/hash node, per connection</b>. 100 connections × 3 sorts × 256MB = <b>75GB</b> wanted under load → the OOM killer, not a slow query.</p>`,
`<p style="font-size:21px;margin:0">Give the memory only to the query that needs it:</p>
${sql(`BEGIN;
SET LOCAL work_mem = '256MB';   -- this transaction only
SELECT … ORDER BY …;            -- the big report
COMMIT;`, { sm: true })}
<p style="font-size:20px;margin:6px 0 0">And first check the <b>estimate</b>: a hash or sort sized for “1 row” that gets 50,000 is a statistics problem, not a memory problem. (10.4 measures the spill.)</p>`), 1.0)}` },

  { t: 'Practice — estimate by hand, then check', giua: true, body: `
${zm(two(`<div>${zm(run(`SELECT most_common_vals, most_common_freqs
FROM pg_stats WHERE schemaname = 'ch10'
  AND tablename = 'ord' AND attname = 'status';`, `        most_common_vals         |             most_common_freqs
---------------------------------+-------------------------------------------
 {paid,shipped,pending,refunded} | {0.6849667,0.1968,0.09786667,0.020366667}`, { hlOut: [3] }), 0.8)}
<p style="font-size:21px;margin:8px 0 0"><b>Before running:</b> what <code class="i">rows=</code> will the planner print for<br>① <code class="i">status = 'pending'</code> &nbsp; ② <code class="i">status IN ('pending', 'refunded')</code>?</p>
<p class="nho" style="margin:4px 0 0">(a fresh ANALYZE in a new session — the frequencies differ slightly from slide 6)</p></div>`,
`<div>${psql(` Seq Scan on ord  (cost=0.00..9927.00 rows=48933 width=0)
   (actual … rows=49167 loops=1)
   Filter: (status = 'pending'::text)
 Seq Scan on ord  (cost=0.00..9927.00 rows=59117 width=0)
   (actual … rows=59167 loops=1)
   Filter: (status = ANY ('{pending,refunded}'::text[]))`, { sm: true, hl: [1, 4], title: 'Seq Scan lines of the two EXPLAIN ANALYZE (shortened)' })}
${box('Answer', '① 0.09786667 × 500,000 = <b>48,933</b> ✓ (actual 49,167). ② (0.09786667 + 0.020366667) × 500,000 = <b>59,117</b> ✓ — an <code class="i">IN</code> list adds the MCV frequencies.', 'xanh')}</div>`, 'r46'), 1.1)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Where do you read the statistics the planner uses, and what does <code class="i">n_distinct = -1</code> mean?</li>
<li>Two filters on correlated columns: does the planner over- or under-estimate? How do you fix it?</li>
<li>You imported 3 million rows into a 40-million-row table. Will autovacuum re-analyze it?</li>
</ol>
${box('Answers', '1 — <code class="i">pg_stats</code>; −1 = every row distinct (a fraction of the rows). 2 — <b>under</b>-estimates (it multiplies); <code class="i">CREATE STATISTICS (dependencies)</code> + ANALYZE. 3 — <b>No</b>: 3M &lt; 50 + 10% × 40M = 4,000,050 ⇒ run ANALYZE yourself.', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li>Estimates come from a <b>sample</b>: <code class="i">ANALYZE</code> → <code class="i">pg_stats</code> (MCV, histogram, n_distinct, correlation)</li>
<li>Equality uses MCV frequencies, ranges use the histogram, <b>AND multiplies</b> (independence)</li>
<li>Correlated columns ⇒ <code class="i">CREATE STATISTICS</code>; new data ⇒ <code class="i">ANALYZE</code> (autovacuum waits for 10%)</li>
<li>A wrong <code class="i">rows=</code> chooses the wrong join: rows=1 vs 50,000 cost 15 s instead of 35 ms</li>
</ul>
${box('Next: 10.4 — BUFFERS & a tuning workflow', 'Time is not the whole story: count the pages a query touches (cache vs disk), watch a sort spill, find slow queries with pg_stat_statements, and tune a real Prisma query.', 'lam')}` },
]);
