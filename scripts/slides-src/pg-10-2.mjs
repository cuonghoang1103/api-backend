/**
 * pg-10-2 — PostgreSQL · Chapter 10 · Lesson 10.2 "Join strategies: Nested Loop, Hash & Merge" (slide EN, kiểu FU, 25/10/2026, agent c10).
 * Nguồn: content/courses/postgresql/s10-explain-planner.mjs › postgresql-10-2-chien-luoc-join. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-10-2.sql/.out.txt, pg-10-2b (ép NL không Memoize), pg-10-2c (bài tập), schema ch10).
 * Bổ sung so với web: ví dụ đời thường (ghép bài thi với học sinh), mã giả mỗi thuật toán, đọc nút Hash (Buckets/Batches, hash_mem_multiplier),
 * so cost + thời gian thật 3 cách trên cùng truy vấn, Merge Join "tự nhiên" nhờ chỉ mục + LIMIT, FK thiếu chỉ mục ⇒ Hash Join quét 500k,
 * ép Nested Loop ⇒ loops=500.000 (và Memoize của PG 14+), thêm chỉ mục FK ⇒ Nested Loop 1 ms, bảng quyết định, Prisma @@index, bài tập.
 */
import { lamDeck, sql, run, psql, tbl, two, box, kw, vsd, c, cards, steps } from './_pg-chung.mjs';
import { wrapPlan, nlPic, hashPic, mergePic, bars, PG, CAM, XANH, DO, NAU, TIM } from './pg-10-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-10-2', code: 'PG 10.2', title: 'Join strategies', sub: 'Nested Loop, Hash Join, Merge Join' };

const REG = `SELECT c.region, count(*), sum(o.amount)
FROM ord o JOIN customer c ON c.id = o.customer_id
GROUP BY c.region;`;
const FEW = `SELECT c.name, o.id, o.amount
FROM customer c JOIN ord o ON o.customer_id = c.id
WHERE c.id <= 20;`;

export const slides = lamDeck({ chuong: 'Chapter 10 — EXPLAIN & the planner', bai: '10.2' }, [
  { cover: true, t: 'Join strategies:<br>Nested Loop, Hash & Merge', sub: 'One <code>JOIN</code> in your SQL — three different algorithms<br>underneath. Learn to spot which one is hurting you.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The <b>three algorithms</b> PostgreSQL can use for one JOIN — each drawn, each run for real</li>
<li><b>Nested Loop</b>: great for a few rows with an index; a disaster with <code class="i">loops=500000</code></li>
<li><b>Hash Join</b>: the workhorse for big joins — build, then probe</li>
<li><b>Merge Join</b>: two sorted lists zipped together</li>
<li>Why a missing <b>foreign-key index</b> changes the strategy — and a 50× fix</li>
</ul>
${box('From 10.1', 'You can read a plan bottom-up and multiply by <code class="i">loops</code>. Today every plan has a join node in the middle — and we decide whether it is the problem.', 'lam')}` },

  { t: 'Everyday example first: matching 30 exam papers to students', body: `
${cards([['🔁 Nested Loop', 'Take paper 1, look the name up in the <b>class register’s alphabetical index</b>, write the seat. Paper 2, look up again… Fast for <b>5 papers</b>; tiring for 5,000.'],
  ['🗂️ Hash Join', 'First lay out <b>pigeon-holes</b> A–Z on a desk and drop every student card in its hole (build). Then each paper goes straight to its hole (probe). Two passes, no searching.'],
  ['🤐 Merge Join', 'Both piles are <b>already sorted by name</b>. Walk down the two piles together like closing a zip — never go back.']], 3)}
${box('Same answer, different work', 'All three give the same pairs. What changes is <b>how many steps</b> it takes — and that depends on how many papers, whether there is an index, and whether the piles are already sorted. The planner picks by estimating each.', '')}
${tbl(['analogy', 'PostgreSQL'], [['alphabetical index of the register', 'a B-tree index on the inner table'], ['pigeon-holes on the desk', 'a hash table in memory (work_mem)'], ['two sorted piles', 'inputs sorted on the join key (by an index or a Sort)']])}` },

  { t: 'One JOIN, three algorithms', body: `
${tbl(['strategy', 'how it works', 'loves', 'hates'], [
    ['<b>Nested Loop</b>', 'for each outer row, look up the inner side', 'few outer rows + <b>index</b> on inner', 'big outer side, inner without index'],
    ['<b>Hash Join</b>', 'build a hash table from one side, stream the other past it', 'big unsorted inputs, equality', 'hash bigger than memory (batches)'],
    ['<b>Merge Join</b>', 'walk two inputs sorted on the key', 'inputs <b>already sorted</b> (index)', 'having to sort big inputs first']])}
${two(box('Who decides?', 'The <b>planner</b>, by estimating the cost of each from the <b>row estimates</b> (10.1). A wrong estimate ⇒ a wrong strategy — lesson 10.3.', 'lam'),
  box('What you write', 'Nothing changes in SQL: <code class="i">INNER JOIN … ON a = b</code> can run as any of the three. You influence the choice with <b>indexes</b> and <b>fresh statistics</b>, not with hints.', ''))}` },

  { t: 'Nested Loop — a loop inside a loop', body: `
${two(`<div>${sql(`# what the executor does (pseudo-code)
for o in ord.rows(id BETWEEN 1 AND 5):  # outer
    c = customer_pkey.find(o.customer_id)  # inner
    emit(o, c)`, { lang: 'python', sm: true })}
<ul style="font-size:22px;margin-top:10px">
<li><b>Outer</b> side: the first child (top) — read once</li>
<li><b>Inner</b> side: the second child — run <b>once per outer row</b></li>
<li>Work ≈ outer rows × cost of one inner lookup</li>
</ul></div>`, nlPic(), 'r46')}
${box('Remember the class register', '5 papers ⇒ 5 quick look-ups in the index. 500,000 papers ⇒ 500,000 look-ups — still correct, just slow. That number is <code class="i">loops=</code>.', 'lam')}` },

  { t: 'Nested Loop, for real: five orders and their customers', body: `
${zm(run(`EXPLAIN ANALYZE SELECT o.id, o.amount, c.name, c.city
FROM ord o JOIN customer c ON c.id = o.customer_id
WHERE o.id BETWEEN 1 AND 5;`, wrapPlan(` Nested Loop  (cost=0.71..50.04 rows=5 width=29) (actual time=0.018..0.034 rows=5 loops=1)
   ->  Index Scan using ord_pkey on ord o  (cost=0.42..8.52 rows=5 width=14) (actual time=0.004..0.005 rows=5 loops=1)
         Index Cond: ((id >= 1) AND (id <= 5))
   ->  Index Scan using customer_pkey on customer c  (cost=0.29..8.30 rows=1 width=23) (actual time=0.005..0.005 rows=1 loops=5)
         Index Cond: (id = o.customer_id)
 Planning Time: 0.417 ms
 Execution Time: 0.060 ms`, 70), { hlOut: [3, 6, 7] }), 1.18)}
<p style="font-size:21px;margin:0">Outer: 5 orders via <code class="i">ord_pkey</code>. Inner: one <code class="i">customer_pkey</code> lookup <b>per order</b> — <code class="i">loops=5</code>. Cost check: <code class="i">8.52 + 5 × 8.30 ≈ 50</code>. Total <b>0.06 ms</b>: the best plan there is for a handful of rows.</p>` },

  { t: 'Hash Join — build, then probe', body: `
${two(`<div>${steps(['<b>Build</b>: read the <b>smaller</b> input (customer, 10,000 rows) once and put every row in a hash table keyed by <code class="i">id</code>', '<b>Probe</b>: stream the bigger input (ord, 500,000 rows) once; for each row compute <code class="i">hash(customer_id)</code> and jump to its bucket', 'A match ⇒ emit the joined row. <b>No index needed</b>, each side read exactly once'])}
${box('Needs memory', 'The hash table must fit in <code class="i">work_mem × hash_mem_multiplier</code> (4MB × 2 by default). Bigger ⇒ split into <b>batches</b> on disk.', 'lam')}</div>`, hashPic(), 'r46')}` },

  { t: 'Hash Join, for real: every order joined to its customer', body: `
${zm(run(`EXPLAIN ANALYZE ${REG}`, wrapPlan(` HashAggregate  (cost=14042.06..14042.09 rows=3 width=46) (actual time=168.590..168.592 rows=3 loops=1)
   Group Key: c.region
   ->  Hash Join  (cost=302.00..10292.06 rows=500000 width=12) (actual time=1.741..100.909 rows=500000 loops=1)
         Hash Cond: (o.customer_id = c.id)
         ->  Seq Scan on ord o  (cost=0.00..8677.00 rows=500000 width=10) (actual time=0.005..30.240 rows=500000 loops=1)
         ->  Hash  (cost=177.00..177.00 rows=10000 width=10) (actual time=1.685..1.685 rows=10000 loops=1)
               Buckets: 16384  Batches: 1  Memory Usage: 558kB
               ->  Seq Scan on customer c  (cost=0.00..177.00 rows=10000 width=10) (actual time=0.004..0.669 rows=10000 loops=1)
 Execution Time: 168.668 ms`, 72), { hlOut: [4, 9, 10] }), 0.98)}
<p style="font-size:21px;margin:0">No filter ⇒ all 500,000 orders. <b>loops=1 everywhere</b>: the 10,000 customers become a 558 kB hash table once, then the orders stream past it once. <span class="nho">(Batches line and planning time omitted; full output under the lesson.)</span></p>` },

  { t: 'Reading the Hash node', giua: true, body: `
${zm(psql(`   ->  Hash  (cost=177.00..177.00 rows=10000 width=10)
         Buckets: 16384  Batches: 1  Memory Usage: 558kB
         ->  Seq Scan on customer c  …`, { hl: [2], title: 'the build side' }), 1.35)}
${cards([['Buckets: 16384', 'Slots in the hash table — a power of two ≥ the expected rows (10,000). Rows with the same hash share a bucket.'],
  ['Batches: 1', 'Everything fitted in memory. <b>Batches: 4</b> would mean the table was split and spilled to temp files — slower.'],
  ['Memory Usage: 558kB', '10,000 rows × ~56 bytes. The limit is <code class="i">work_mem × hash_mem_multiplier</code> = 4MB × 2.0 = 8MB here.'],
  ['Which side is built?', 'The planner builds from the side it <b>expects to be smaller</b> — so a wrong row estimate can build from the huge side.']], 2)}` },

  { t: 'Merge Join — zip two sorted lists', body: `
${two(`<div>${sql(`-- both inputs sorted on the join key
a = next(ord_sorted_by_customer_id)
b = next(customer_sorted_by_id)
while a and b:
    if a.customer_id < b.id: a = next(ord…)
    elif a.customer_id > b.id: b = next(customer…)
    else: emit(a, b); a = next(ord…)`, { lang: 'python', sm: true })}
<ul style="font-size:22px;margin-top:10px">
<li>Each list is read <b>once</b>, front to back</li>
<li>Free if the inputs are <b>already sorted</b> (an index scan)</li>
<li>Expensive if PostgreSQL must <b>Sort</b> them first</li>
</ul></div>`, mergePic(), 'r46')}
${box('Like closing a zip', 'Two pointers move down, the smaller key advances; equal keys ⇒ a joined row. One pass over each list — but only if both lists are <b>already in order</b>.', 'lam')}` },

  { t: 'Merge Join, forced (diagnosis only)', body: `
${sql(`SET enable_hashjoin = off;  SET enable_nestloop = off;   -- diagnosis only, this session`, { sm: true })}
${zm(psql(wrapPlan(` HashAggregate  (cost=76694.06..76694.09 rows=3 width=46) (actual time=273.403..273.405 rows=3 loops=1)
   ->  Merge Join  (cost=65394.56..72944.06 rows=500000 width=12) (actual time=121.352..206.787 rows=500000 loops=1)
         Merge Cond: (o.customer_id = c.id)
         ->  Sort  (cost=64552.92..65802.92 rows=500000 width=10) (actual time=119.730..159.605 rows=500000 loops=1)
               Sort Key: o.customer_id
               Sort Method: external merge  Disk: 10800kB
               ->  Seq Scan on ord o  (cost=0.00..8677.00 rows=500000 width=10) (actual time=0.007..31.197 rows=500000 loops=1)
         ->  Sort  (cost=841.39..866.39 rows=10000 width=10) (actual time=1.616..2.017 rows=10000 loops=1)
               Sort Key: c.id
               Sort Method: quicksort  Memory: 697kB
 Execution Time: 275.081 ms`, 72), { hl: [3, 8, 9, 15], title: 'psql (17.11) — same query as the Hash Join (Group Key and scans of customer omitted)' }), 0.96)}
<p style="font-size:20px;margin:0">To merge, both sides had to be <b>sorted first</b> — and 500,000 orders did not fit in 4MB, so the sort <b>spilled 10.8 MB to disk</b>.</p>` },

  { t: 'Same query, two strategies: cost and clock', giua: true, body: `
${bars([{ t: 'Hash Join — estimated cost', v: 14042, nhan: '14,042', mau: XANH }, { t: 'Merge Join — estimated cost', v: 76694, nhan: '76,694', mau: CAM }], { rh: 58, fs: 22, lw: 380 })}
${bars([{ t: 'Hash Join — actual time', v: 168.7, nhan: '168.7 ms', mau: XANH }, { t: 'Merge Join — actual time', v: 275.1, nhan: '275.1 ms', mau: CAM }], { rh: 58, fs: 22, lw: 380, k: 'bar2' })}
${box('The planner was right', 'It priced Merge at 5.5× the Hash plan and rejected it; the clock agrees (1.6× slower, plus a disk spill). <code class="i">enable_*</code> switches exist to <b>see</b> the rejected plan — never to “fix” production.', 'xanh')}` },

  { t: 'When Merge Join wins: inputs already sorted', body: `
${zm(run(`-- with an index on ord(customer_id) (we add it in a moment)
EXPLAIN ANALYZE SELECT c.id, c.name, o.id, o.amount
FROM customer c JOIN ord o ON o.customer_id = c.id
ORDER BY c.id LIMIT 10;`, wrapPlan(` Limit  (cost=0.71..1.32 rows=10 width=27) (actual time=0.011..0.020 rows=10 loops=1)
   ->  Merge Join  (cost=0.71..30581.68 rows=500000 width=27) (actual time=0.010..0.018 rows=10 loops=1)
         Merge Cond: (c.id = o.customer_id)
         ->  Index Scan using customer_pkey on customer c  (cost=0.29..350.29 rows=10000 width=17) (actual time=0.004..0.004 rows=1 loops=1)
         ->  Index Scan using idx_ord_customer on ord o  (cost=0.42..23956.40 rows=500000 width=14) (actual time=0.003..0.010 rows=10 loops=1)
 Execution Time: 0.030 ms`, 66), { hlOut: [3, 6, 8] }), 1.1)}
<p style="font-size:21px;margin:0">Both indexes already return rows <b>in key order</b>, so there is nothing to sort. And startup cost is <b>0.71</b>: with <code class="i">LIMIT 10</code> it stops after 10 rows — 0.03 ms although the full join would be 500,000 rows (startup vs total, 10.1).</p>` },

  { t: 'The FK without an index: orders of 20 customers', body: `
${zm(run(`EXPLAIN ANALYZE ${FEW}`, wrapPlan(` Hash Join  (cost=8.88..9998.94 rows=1000 width=23) (actual time=0.081..52.004 rows=951 loops=1)
   Hash Cond: (o.customer_id = c.id)
   ->  Seq Scan on ord o  (cost=0.00..8677.00 rows=500000 width=14) (actual time=0.007..28.061 rows=500000 loops=1)
   ->  Hash  (cost=8.63..8.63 rows=20 width=17) (actual time=0.011..0.012 rows=20 loops=1)
         Buckets: 1024  Batches: 1  Memory Usage: 9kB
         ->  Index Scan using customer_pkey on customer c  (cost=0.29..8.63 rows=20 width=17) (actual time=0.004..0.007 rows=20 loops=1)
               Index Cond: (id <= 20)
 Execution Time: 52.070 ms`, 66), { hlOut: [4, 5] }), 1.1)}
<p style="font-size:21px;margin:0">Only <b>951 rows</b> come out, yet all <b>500,000 orders</b> are read: with no index on <code class="i">ord.customer_id</code> there is no way to “look up” orders by customer. A Hash Join with a 20-row hash is the <b>best the planner can do</b> — the real problem is the missing index.</p>` },

  { t: 'Forcing a Nested Loop there: loops=500,000', body: `
${sql(`SET enable_hashjoin = off; SET enable_mergejoin = off; SET enable_memoize = off; SET enable_material = off;`, { sm: true })}
${zm(psql(wrapPlan(` Nested Loop  (cost=0.29..161604.10 rows=1000 width=23) (actual time=5.245..144.047 rows=951 loops=1)
   ->  Seq Scan on ord o  (cost=0.00..8677.00 rows=500000 width=14) (actual time=0.017..28.706 rows=500000 loops=1)
   ->  Index Scan using customer_pkey on customer c  (cost=0.29..0.31 rows=1 width=17) (actual time=0.000..0.000 rows=0 loops=500000)
         Index Cond: ((id = o.customer_id) AND (id <= 20))
 Planning Time: 0.351 ms
 JIT:
   Functions: 6
 Execution Time: 162.918 ms`, 66), { hl: [5, 6], title: 'psql (17.11) — diagnosis only (JIT detail lines omitted)' }), 1.0)}
${two(box('loops=500000', 'The outer side is now the <b>big</b> table, so the inner lookup runs half a million times: cost 161,604 — 16× the Hash Join. This is the Nested Loop you should fear.', 'do2'),
  box('Memoize · JIT', 'With <code class="i">enable_memoize</code> on (PG 14+) PostgreSQL caches inner results per key (490,000 hits). <b>JIT</b> = compiling expressions, tried when cost &gt; 100,000.', 'lam'))}` },

  { t: 'Add the foreign-key index — 52 ms → 1 ms', body: `
${zm(run(`CREATE INDEX idx_ord_customer ON ord(customer_id);
EXPLAIN ANALYZE ${FEW}`, wrapPlan(` Nested Loop  (cost=5.10..3428.64 rows=1000 width=23) (actual time=0.018..1.033 rows=951 loops=1)
   ->  Index Scan using customer_pkey on customer c  (cost=0.29..8.63 rows=20 width=17) (actual time=0.003..0.006 rows=20 loops=1)
         Index Cond: (id <= 20)
   ->  Bitmap Heap Scan on ord o  (cost=4.81..170.50 rows=50 width=14) (actual time=0.005..0.047 rows=48 loops=20)
         Recheck Cond: (c.id = customer_id)
         ->  Bitmap Index Scan on idx_ord_customer  (cost=0.00..4.80 rows=50 width=0) (actual time=0.002..0.002 rows=48 loops=20)
               Index Cond: (customer_id = c.id)
 Execution Time: 1.070 ms`, 66), { hlOut: [1, 6, 7, 12] }), 0.98)}
<p style="font-size:21px;margin:0">Now the <b>20 customers</b> are the outer side and each one fetches its ~48 orders through the new index (<code class="i">loops=20</code>). Same query, same data: <b>52 ms → 1.07 ms</b>, and the planner switched to Nested Loop <b>by itself</b>.</p>` },

  { t: 'Rules the planner follows — and the knobs', giua: true, body: `
${zm(tbl(['situation', 'usual winner', 'red flag in the plan'], [
    ['few outer rows, inner side indexed', '<b>Nested Loop</b>', 'big <code class="i">loops=</code> with a Seq Scan or cheap-looking inner node'],
    ['big join on equality, unsorted inputs', '<b>Hash Join</b>', '<code class="i">Batches: &gt; 1</code> — hash spilled to disk'],
    ['both inputs already in key order', '<b>Merge Join</b>', 'a <code class="i">Sort … external merge Disk</code> below it'],
    ['non-equality condition (<code class="i">a.x &lt; b.y</code>)', 'Nested Loop only', 'huge <code class="i">Rows Removed by Join Filter</code>']]), 1.15)}
${box('enable_hashjoin · enable_nestloop · enable_mergejoin · enable_memoize', 'Session switches that make a strategy look very expensive. Use them to <b>compare</b> plans while diagnosing — never in application code or <code class="i">postgresql.conf</code>. Fix the cause: an index, fresh statistics, or the query shape.', 'do2')}` },

  { t: 'Trap: “Nested Loop is the slow one”', giua: true, body: `
${zm(vsd(`<p style="font-size:22px;margin:0">“I saw <b>Nested Loop</b> in the plan, it is O(n²), let me rewrite the query to avoid it.”</p>
<ul style="font-size:21px;margin-top:8px"><li>Judging the node by its <b>name</b></li><li>Rewriting a 0.06 ms query</li><li>Forcing hash joins with <code class="i">enable_nestloop = off</code></li></ul>`,
`<p style="font-size:22px;margin:0">Look at <b>loops=</b> and at <b>what the inner side does</b>.</p>
<ul style="font-size:21px;margin-top:8px"><li>Few loops + index lookup inside ⇒ often the <b>fastest</b> plan possible (0.06 ms, 1.07 ms above)</li><li>Huge loops, or a Seq Scan inside ⇒ the real O(n²) — caused by a <b>missing index</b> or a <b>wrong estimate</b></li></ul>`), 1.1)}
${box('On cuongthai.com', 'The classic slow endpoint was always the same picture: a Nested Loop with <code class="i">loops=5000</code> whose inner node was a full scan, because a foreign-key column had no index. One <code class="i">CREATE INDEX</code> later the planner chose a better plan and seconds became milliseconds.', 'lam')}` },

  { t: 'In practice: Prisma does not index your foreign keys', giua: true, body: `
${zm(two(`<div>${sql(`// prisma/schema.prisma (cuongthai.com, excerpt)
model Post {
  id         Int   @id @default(autoincrement())
  authorId   Int?  @map("author_id")
  author     User? @relation("PostAuthor",
                     fields: [authorId], references: [id])
  // …
  @@index([authorId], name: "idx_posts_author_id")
  @@map("posts")
}`, { lang: 'typescript', sm: true, hl: [8] })}</div>`,
`<ul style="font-size:22px">
<li>On PostgreSQL, a <code class="i">@relation</code> creates the <b>foreign key</b> but <b>no index</b> on <code class="i">author_id</code></li>
<li>Without the <code class="i">@@index</code> line, “posts of author 7” = Seq Scan; “authors with their posts” = Hash Join over the whole table</li>
<li>Rule: every FK column you join or filter on gets an <code class="i">@@index</code></li>
</ul>
${box('Check a live plan', 'Copy the SQL from Prisma’s query log and run <code class="i">EXPLAIN ANALYZE</code> — lesson 10.4 does it step by step.', 'lam')}`), 1.1)}` },

  { t: 'Practice — predict, then run', body: `
${two(`<div><p style="font-size:22px;margin:0 0 6px"><b>Top 3 customers in Hue by number of refunds.</b> Before running: which join strategy? which side becomes the hash?</p>
${sql(`EXPLAIN ANALYZE
SELECT c.id, c.name, count(*) AS refunds
FROM customer c JOIN ord o ON o.customer_id = c.id
WHERE c.city = 'Hue' AND o.status = 'refunded'
GROUP BY c.id, c.name
ORDER BY refunds DESC LIMIT 3;`, { sm: true })}
${box('Answer', '<b>Hash Join</b>: no index on <code class="i">ord.customer_id</code>, 10,000 refunded orders on one side. The hash is built from the <b>smaller</b> side — 1,000 Hue customers, 57 kB. Then GroupAggregate, and a <b>top-N heapsort</b> keeps only 3.', 'xanh')}</div>`,
psql(wrapPlan(` Limit  (actual time=67.675..67.678 rows=3 loops=1)
   ->  Sort  (actual time=67.674..67.676 rows=3 loops=1)
         Sort Method: top-N heapsort  Memory: 25kB
         ->  GroupAggregate  (actual … rows=607 loops=1)
               ->  Sort  (actual … rows=944 loops=1)
                     ->  Hash Join  (actual time=0.633..66.197 rows=944 loops=1)
                           Hash Cond: (o.customer_id = c.id)
                           ->  Seq Scan on ord o  (… rows=10000 loops=1)
                                 Rows Removed by Filter: 490000
                           ->  Hash  (… rows=1000 loops=1)
                                 Buckets: 1024  Batches: 1  Memory Usage: 57kB
                                 ->  Seq Scan on customer c  (… rows=1000 loops=1)
 Execution Time: 67.735 ms`, 80), { sm: true, hl: [6, 11], title: 'shortened: costs and some lines removed' }).replace('<div class="term sm">', '<div class="term sm" style="zoom:.86">'), 'r46')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>A Nested Loop shows <code class="i">loops=20</code> and an index lookup inside. Problem or not?</li>
<li>Which side of a Hash Join does PostgreSQL usually build the hash table from?</li>
<li>Why did the forced Merge Join spill to disk, and the Hash Join did not?</li>
</ol>
${box('Answers', '1 — Usually <b>fine</b>: 20 cheap lookups. 2 — The side it <b>estimates</b> to be smaller. 3 — Merge needed 500,000 orders <b>sorted</b> (10.8 MB &gt; 4MB work_mem); the hash only held 10,000 customers (558 kB).', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li><b>Nested Loop</b>: outer × inner lookup — superb with few rows + an index, terrible with big <code class="i">loops=</code></li>
<li><b>Hash Join</b>: build from the smaller side, probe with the bigger — the default for large equality joins</li>
<li><b>Merge Join</b>: zip two sorted inputs — great when indexes already sort them</li>
<li>The planner picks from <b>row estimates</b>; index your FKs; <code class="i">enable_*</code> only to diagnose</li>
</ul>
${box('Next: 10.3 — Statistics', 'Where do the row estimates come from, and what happens when the planner believes 1 row will come out but 50,000 do?', 'lam')}` },
]);
