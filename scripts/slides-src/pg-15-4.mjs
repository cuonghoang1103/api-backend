/**
 * pg-15-4 — PostgreSQL · Chapter 15 · Lesson 15.4 "Partitioning: one table, many pieces" (slide EN, kiểu FU, 26/10/2026, agent c15).
 * Nguồn: s15-sao-luu-nhan-ban.mjs › postgresql-15-4-phan-manh. Output = chạy thật PostgreSQL 17.11 (pgcourse17, schema ch15):
 * video-bai-giang/src/khung/pg/that/pg-15-4.out.txt (+ .sql). 300.000 sự kiện tất định trải 3 tháng, bảng phẳng event_flat song song.
 * Bổ sung so với web (web cũ đo trên 16.13): tủ hồ sơ (đời thường), pruning lúc chạy (Subplans Removed), lọc không theo khoá chạy
 * Parallel Append (KHÔNG chậm hơn ở cỡ này — sửa câu khẳng định cũ), DELETE 34,9 ms vs DROP 4,5 ms (≈ 8×, web cũ 19×), DETACH CONCURRENTLY
 * bị chặn khi có DEFAULT, DEFAULT chặn tạo mảnh mới, chỉ mục lan xuống mảnh, PK phải gồm khoá phân mảnh (+ Prisma @@id), LIST, HASH,
 * ATTACH, sharding/Citus, khi nào KHÔNG cần, page_views của CuongThai (không có hạn giữ).
 */
import { lamDeck, sql, psql, sh, run, two, box, kw, cards, steps, c, tbl } from './_pg-chung.mjs';
import { cabinetPic, routePic, shardPic } from './pg-15-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t, fs = 22) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
export const deck = { key: 'pg-15-4', code: 'PG 15.4', title: 'Partitioning: one table, many pieces', sub: 'RANGE · LIST · HASH · pruning · DROP vs DELETE' };

export const slides = lamDeck({ chuong: 'Chapter 15 — Backup, replication & scaling', bai: '15.4' }, [
  { cover: true, t: 'Partitioning:<br>one table, many pieces', sub: 'RANGE, LIST, HASH, partition pruning —<br>and why DROP beats DELETE' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Declarative partitioning: <b>RANGE</b> by month, <b>LIST</b>, <b>HASH</b> — all run for real</li>
<li><b>Partition pruning</b> in EXPLAIN, at plan time and at run time</li>
<li>The real reason to partition: retiring old data with <b>DROP</b>, not DELETE — measured</li>
<li>DETACH / ATTACH, the DEFAULT partition, indexes, and the <b>primary key</b> trap</li>
<li>Sharding (Citus) in one slide — and when you need <b>none</b> of this</li>
</ul>
${box('From 15.3', 'Replicas scale <b>reads</b>. Partitioning helps one table that has grown too big to <b>maintain</b> — which is a different problem.', 'lam')}` },

  { t: 'Everyday example first: a filing cabinet', giua: true, body: `
${cabinetPic()}
${P('One drawer per month. “Show me August” means opening one drawer, not leafing through everything. And when June’s papers expire, you pull the whole drawer out — instead of picking out 99,692 sheets one by one. That is partitioning.')}` },

  { t: 'Declaring a partitioned table', giua: true, body: `
${two(zm(sql(`CREATE TABLE event_p (
  id      bigint GENERATED ALWAYS AS IDENTITY,
  luc     timestamptz NOT NULL,
  payload text NOT NULL
) PARTITION BY RANGE (luc);

CREATE TABLE event_p_2026_06 PARTITION OF event_p
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE event_p_2026_07 PARTITION OF event_p
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE event_p_2026_08 PARTITION OF event_p
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');`, { sm: true, hl: [5, 7, 8] }), 1.05),
  `<div>${steps([
    'The <b>parent</b> <code class="i">event_p</code> holds no rows itself — it is the name queries use.',
    'Each <b>partition</b> is a real table with a range of the <b>partition key</b> <code class="i">luc</code>.',
    'Ranges are <b>[FROM, TO)</b>: the start is included, the end is not — so months never overlap.',
  ])}${box('Words', `${kw('partition', 'one piece')} ${kw('partition key', 'the column that decides')}`, 'lam')}</div>`, 'r64')}` },

  { t: 'Insert into the parent — rows route themselves', giua: true, body: `
${two(zm(run(`INSERT INTO event_p (luc, payload)
SELECT timestamptz '2026-06-01 00:00+07'
       + (g * interval '26 seconds'), 'p' || (g % 1000)
FROM generate_series(1, 300000) g;
SELECT tableoid::regclass AS phan_manh, count(*),
       min(luc)::date AS tu, max(luc)::date AS den
FROM event_p GROUP BY 1 ORDER BY 1;`, `INSERT 0 300000
    phan_manh    | count  |     tu     |    den
-----------------+--------+------------+------------
 event_p_2026_06 |  99692 | 2026-06-01 | 2026-06-30
 event_p_2026_07 | 103015 | 2026-07-01 | 2026-07-31
 event_p_2026_08 |  97293 | 2026-08-01 | 2026-08-30
(3 rows)`, { hlOut: [4, 5, 6] }), 1.0), box('Routing', 'Each row is checked against the ranges <b>[FROM, TO)</b> of the partitions and written into the one that matches. A row matching none is rejected (slide 12).', 'lam'), 'r64')}
${P('The INSERT only named <code class="i">event_p</code>; PostgreSQL put each row in the right partition by its <code class="i">luc</code>. <code class="i">tableoid</code> is a hidden column that names the physical table a row lives in. (A flat copy, <code class="i">event_flat</code>, holds the same 300,000 rows for comparison.)', 21)}` },

  { t: 'Partition pruning: only one partition is read', giua: true, body: `
${zm(psql(`SET max_parallel_workers_per_gather = 0;   -- compare one process each
EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM event_flat
WHERE luc >= '2026-08-01' AND luc < '2026-09-01';
 Aggregate (actual time=16.714..16.715 rows=1 loops=1)
   ->  Seq Scan on event_flat (actual time=7.372..13.550 rows=97293 loops=1)
         Rows Removed by Filter: 202707
 Execution Time: 16.764 ms
EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM event_p
WHERE luc >= '2026-08-01' AND luc < '2026-09-01';
 Aggregate (actual time=10.052..10.053 rows=1 loops=1)
   ->  Seq Scan on event_p_2026_08 event_p (actual time=0.015..6.960 rows=97293 loops=1)
 Execution Time: 10.067 ms`, { sm: true, hl: [6, 7, 11, 12] }), 1.0)}
${two(box('Read the second plan', 'No <code class="i">Append</code>, and June and July are not mentioned at all: the planner proved from the WHERE clause that they cannot match and <b>pruned</b> them. Two thirds of the data was never touched.', 'xanh'),
  box('Measured', 'Flat table: reads 300,000 rows and throws away 202,707 — <b>16.8 ms</b>. Partitioned: reads 97,293 — <b>10.1 ms</b>.', 'lam'))}` },

  { t: 'Pruning at run time: Subplans Removed', giua: true, body: `
${zm(psql(`PREPARE theo_ngay(timestamptz) AS
  SELECT count(*) FROM event_p WHERE luc >= $1 AND luc < $1 + interval '1 day';
SET plan_cache_mode = force_generic_plan;
EXPLAIN (ANALYZE, COSTS OFF) EXECUTE theo_ngay('2026-07-15');
 Finalize Aggregate (actual time=4.853..6.008 rows=1 loops=1)
   ->  Gather (actual time=4.778..6.002 rows=3 loops=1)
         ->  Partial Aggregate (actual time=2.785..2.786 rows=1 loops=3)
               ->  Parallel Append (actual time=1.832..2.750 rows=1108 loops=3)
                     Subplans Removed: 2
                     ->  Parallel Seq Scan on event_p_2026_07 event_p_1 …
                           Filter: ((luc >= $1) AND (luc < ($1 + '1 day'::interval)))`, { sm: true, hl: [9, 10] }), 1.0)}
${P('With a parameter (<code class="i">$1</code>) the planner cannot know the month when it builds a generic plan — so the plan keeps all three, and the executor removes two at start-up, once <code class="i">$1</code> is known. This is what an ORM like Prisma sends: parameters, not literals.', 21)}` },

  { t: 'Filtering on something else: every partition is read', giua: true, body: `
${two(zm(psql(`EXPLAIN (ANALYZE, COSTS OFF)
SELECT count(*) FROM event_p
WHERE payload = 'p42';
 Finalize Aggregate (… rows=1 loops=1)
   ->  Gather
         Workers Launched: 2
         ->  Parallel Append
               ->  … on event_p_2026_07
               ->  … on event_p_2026_06
               ->  … on event_p_2026_08
 Execution Time: 7.670 ms`, { sm: true, hl: [7, 8, 9, 10] }), 1.05),
  zm(psql(`EXPLAIN (ANALYZE, COSTS OFF)
SELECT count(*) FROM event_flat
WHERE payload = 'p42';
 Finalize Aggregate (… rows=1 loops=1)
   ->  Gather
         Workers Launched: 1
         ->  Parallel Seq Scan
               on event_flat
 Execution Time: 9.911 ms`, { sm: true, hl: [7, 8] }), 1.05))}
${box('Choosing the key is choosing which queries get faster', 'Pruning only works when the query filters on the <b>partition key</b>. Here every partition was scanned — not slower at this size (7.7 vs 9.9 ms, the partitions were scanned in parallel), but not faster either, and planning cost grows with the number of partitions. Queries that do not use the key get <b>no benefit</b>.', '')}` },

  { t: 'The real reason to partition: DROP instead of DELETE', giua: true, body: `
${two(zm(sh(`-- remove June, two ways
\\timing on
DELETE FROM event_flat WHERE luc < '2026-07-01';
DELETE 99692
Time: 34.865 ms
DROP TABLE event_p_2026_06;
DROP TABLE
Time: 4.480 ms`, { sm: true, title: 'psql (17.11) — pgcourse', hl: [5, 8] }), 1.12),
  zm(psql(`SELECT relname, n_dead_tup,
  pg_size_pretty(pg_total_relation_size(relid))
  AS kich_thuoc FROM pg_stat_user_tables …;
     relname     | n_dead_tup | kich_thuoc
-----------------+------------+------------
 event_flat      |      99692 | 15 MB
 event_p_2026_07 |          0 | 5288 kB
 event_p_2026_08 |          0 | 4992 kB`, { sm: true, hl: [6] }), 1.05))}
${box('Speed is the smaller half', '≈ <b>8× faster</b> here — and look at what each left behind. DELETE left <b>99,692 dead tuples</b> and the file is still <b>15 MB</b>: autovacuum must now work through them (14.3), and the space stays allocated. The dropped partition is simply gone: space back to the OS at once, no vacuum, no bloat. (event_flat had autovacuum off so you can see the dead rows.)', 'xanh')}` },

  { t: 'Retention: make deletion a DROP', to: true, giua: true, body: `
${cards([
    ['Logs, events, metrics', 'Anything you keep for N days and then throw away: partition by <b>time</b>.'],
    ['Every night', 'Create next month’s partition ahead of time; DETACH + archive + DROP the oldest.'],
    ['What you gain', 'Deleting a month costs milliseconds, no dead tuples, no bloat, no long DELETE holding locks.'],
  ])}
${box('Rule', '<b>If your data has a retention policy, partition by time and make deletion a DROP.</b> That is an operational win, bigger than any query speed-up.', 'xanh')}` },

  { t: 'DETACH: keep the data, leave the table', giua: true, body: `
${two(zm(psql(`ALTER TABLE event_p DETACH PARTITION event_p_2026_07;
ALTER TABLE
Time: 0.848 ms
SELECT count(*) AS van_con_du_lieu FROM event_p_2026_07;
 van_con_du_lieu
-----------------
          103015
SELECT relname, relispartition FROM pg_class …;
     relname     | relispartition
-----------------+----------------
 event_p_2026_07 | f
 event_p_2026_08 | t`, { sm: true, hl: [7, 11] }), 1.0),
  zm(psql(`ALTER TABLE event_p DETACH PARTITION
  event_p_2026_07 CONCURRENTLY;
ERROR:  cannot detach partitions concurrently
  when a default partition exists
-- after DROP TABLE event_p_default:
ALTER TABLE event_p DETACH PARTITION
  event_p_2026_08 CONCURRENTLY;
ALTER TABLE
Time: 1.248 ms`, { sm: true, hl: [3, 4, 8] }), 1.05))}
${box('A soft DROP', 'DETACH turns a partition into an ordinary table that still holds its rows: archive it, <code class="i">pg_dump -t</code> it (15.1), then drop it. Plain DETACH takes a strong lock on the parent; <code class="i">CONCURRENTLY</code> avoids that — but not while a DEFAULT partition exists.', 'lam')}` },

  { t: 'A row with nowhere to go — and the DEFAULT partition', giua: true, body: `
${zm(psql(`INSERT INTO event_p (luc, payload) VALUES ('2026-09-02', 'thang chin');
ERROR:  no partition of relation "event_p" found for row
DETAIL:  Partition key of the failing row contains (luc) = (2026-09-02 00:00:00+07).
CREATE TABLE event_p_2026_09 PARTITION OF event_p FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE event_p_default PARTITION OF event_p DEFAULT;
INSERT INTO event_p (luc, payload) VALUES ('2027-01-15', 'tuong lai xa');      -- ⇒ event_p_default
CREATE TABLE event_p_2027_01 PARTITION OF event_p FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');
ERROR:  updated partition constraint for default partition "event_p_default" would be violated by some row`, { sm: true, hl: [2, 5, 8] }), 1.0)}
${two(box('Without DEFAULT', 'A row outside every range is <b>rejected</b> — in production that is an outage at midnight on the 1st if nobody created the new month. Create partitions <b>ahead</b> (a cron job, or the <code class="i">pg_partman</code> extension).', 'bad'),
  box('With DEFAULT', 'Nothing is rejected — but rows pile up there, every new partition must scan it, and it <b>blocks</b> creating a partition whose range it already holds rows for. A safety net to watch, not a place to live.', ''))}` },
  { t: 'Indexes: declare once, on the parent', giua: true, body: `
${two(zm(psql(`CREATE INDEX ON event_p (luc);
\\d event_p
             Partitioned table "ch15.event_p"
Partition key: RANGE (luc)
Indexes:
    "event_p_luc_idx" btree (luc)
Number of partitions: 4 (Use \\d+ to list them.)
\\di event_p_2026_0*
 event_p_2026_07_luc_idx | index | event_p_2026_07
 event_p_2026_08_luc_idx | index | event_p_2026_08
 event_p_2026_09_luc_idx | index | event_p_2026_09`, { sm: true, hl: [6, 9, 10, 11] }), 1.0),
  zm(psql(`-- a partition created LATER
CREATE TABLE event_p_2026_10 PARTITION OF event_p
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
\\d event_p_2026_10
Partition of: event_p FOR VALUES FROM
  ('2026-10-01 00:00:00+07') TO ('2026-11-01 00:00:00+07')
Indexes:
    "event_p_2026_10_luc_idx" btree (luc)`, { sm: true, hl: [8] }), 1.05))}
${P('An index on the parent is a template: PostgreSQL creates one real index per partition — and on every partition added later. Each partition’s index is small, so it fits in memory and VACUUM handles it quickly.', 21)}` },

  { t: 'Trap: the primary key must include the partition key', giua: true, body: `
${zm(psql(`ALTER TABLE event_p ADD PRIMARY KEY (id);
ERROR:  unique constraint on partitioned table must include all partitioning columns
DETAIL:  PRIMARY KEY constraint on table "event_p" lacks column "luc" which is part of the partition key.
ALTER TABLE event_p ADD PRIMARY KEY (id, luc);
ALTER TABLE`, { sm: true, hl: [2, 3, 5] }), 1.05)}
${two(box('Why', 'Each partition can only check uniqueness <b>inside itself</b>; there is no global index. Including <code class="i">luc</code> guarantees two equal keys always land in the same partition. Consequence: <code class="i">id</code> alone is no longer guaranteed unique across partitions (the identity sequence still hands out distinct values).', 'bad'),
  `<div>${box('In Prisma', 'The model needs a compound key — <code class="i">@@id([id, createdAt])</code> — and the <code class="i">PARTITION BY</code> itself lives in a hand-written SQL migration: Prisma 5 does not generate partitioned tables.', 'lam')}${sql(`model PageView {
  id        Int
  createdAt DateTime @default(now())
  @@id([id, createdAt])
}`, { sm: true, lang: 'typescript' })}</div>`)}` },

  { t: 'LIST: a fixed set of values', giua: true, body: `
${two(zm(sql(`CREATE TABLE don_hang (id bigint, vung text NOT NULL,
  tong numeric(12,2)) PARTITION BY LIST (vung);
CREATE TABLE don_hang_bac  PARTITION OF don_hang
  FOR VALUES IN ('HN', 'HP', 'QN');
CREATE TABLE don_hang_nam  PARTITION OF don_hang
  FOR VALUES IN ('HCM', 'CT', 'BD');
CREATE TABLE don_hang_khac PARTITION OF don_hang DEFAULT;
INSERT INTO don_hang SELECT g,
  (ARRAY['HN','HCM','DN','HP','CT','HCM','HN','BD'])[1 + g % 8],
  g % 900 FROM generate_series(1, 8000) g;`, { sm: true, hl: [2, 4, 6] }), 1.0),
  zm(psql(`SELECT tableoid::regclass AS phan_manh, count(*),
  string_agg(DISTINCT vung, ',') AS vung
FROM don_hang GROUP BY 1 ORDER BY 1;
   phan_manh   | count |   vung
---------------+-------+-----------
 don_hang_bac  |  3000 | HN,HP
 don_hang_nam  |  4000 | BD,CT,HCM
 don_hang_khac |  1000 | DN
(3 rows)`, { sm: true, hl: [6, 7, 8] }), 1.05))}
${P('LIST fits a column with a known, small set of values: a region, a country, a tenant tier. “Da Nang” (DN) was not listed, so it went to the DEFAULT partition — exactly the kind of row you want an alert about.', 21)}` },

  { t: 'HASH: spread evenly when there is no natural grouping', giua: true, body: `
${two(zm(sql(`CREATE TABLE phien (user_id bigint NOT NULL, token text)
  PARTITION BY HASH (user_id);
CREATE TABLE phien_0 PARTITION OF phien
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
-- … phien_1, phien_2, phien_3
INSERT INTO phien SELECT g, md5(g::text)
FROM generate_series(1, 100000) g;`, { sm: true, hl: [2, 4] }), 1.05),
  zm(psql(`SELECT tableoid::regclass AS phan_manh, count(*)
FROM phien GROUP BY 1 ORDER BY 1;
 phan_manh | count
-----------+-------
 phien_0   | 25126
 phien_1   | 24978
 phien_2   | 24971
 phien_3   | 24925
EXPLAIN (COSTS OFF) SELECT * FROM phien WHERE user_id = 42;
 Seq Scan on phien_2 phien
   Filter: (user_id = 42)`, { sm: true, hl: [5, 6, 7, 8, 10] }), 1.05))}
${P('Four almost equal pieces, and a lookup by <code class="i">user_id</code> still prunes to one. But HASH gives you <b>no</b> cheap retention (no partition is “the old one”) — use it to split maintenance of a huge table, not to delete data.', 21)}` },

  { t: 'ATTACH: bring an existing table in', giua: true, body: `
${zm(psql(`ALTER TABLE event_p ATTACH PARTITION event_p_2026_07
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
ALTER TABLE
Time: 4.453 ms
SELECT tableoid::regclass AS phan_manh, count(*) FROM event_p GROUP BY 1 ORDER BY 1;
    phan_manh    | count
-----------------+--------
 event_p_2026_07 | 103015
 event_p_2026_09 |      1`, { sm: true, hl: [4, 8] }), 1.1)}
${steps([
    'ATTACH checks every row of the table against the range before accepting it — 103,015 rows here, 4.5 ms; hours on a big table, under lock.',
    'Pro tip: add a <code class="i">CHECK</code> constraint with the same range first (it can be <code class="i">NOT VALID</code> then <code class="i">VALIDATE</code>d without blocking writes); ATTACH then trusts it and skips the scan.',
    'This is also how you convert an existing big table: create the partitioned parent, ATTACH the old table as its first partition, new months go to new partitions.',
  ])}` },

  { t: 'Beyond one machine: sharding (Citus)', giua: true, body: `
${shardPic()}
${two(box('What it is', '<b>Sharding</b> spreads one table’s rows across several <b>machines</b>. <b>Citus</b> (an open-source PostgreSQL extension) does it with a coordinator that routes each query by a distribution key — usually the tenant id — to worker nodes.', 'lam'),
  box('What it costs', 'Cross-shard joins and transactions get slower or harder, the distribution key must be in almost every query, and operations multiply by the number of machines. Partitioning first; sharding when one machine truly cannot hold the writes.', 'bad'))}` },

  { t: 'When NOT to partition — and a real candidate', giua: true, body: `
${two(`<div>${steps([
    'Below a few tens of millions of rows, a plain table with good indexes (Chapter 9) is usually faster and always simpler.',
    'Planning time grows with the number of partitions; queries that do not use the key touch every piece.',
    'Honest triggers: a <b>retention policy</b>, a table VACUUM cannot keep up with, a maintenance window that became impossible. “It is getting big” is not one.',
  ])}</div>`,
  `<div>${box('CuongThai: page_views', 'The <code class="i">PageView</code> model (<code class="i">page_views</code>) gets one row per page view, with indexes on <code class="i">created_at</code>, and the code never deletes from it — it grows forever. It is the natural candidate: the day a 90-day retention is decided, partition by month and retire with DROP. Today it is not needed.', 'lam')}${box('Plan it early', 'Converting a big table later needs a migration with its own maintenance window — if retention is coming, partition on day one.', '')}</div>`, 'r46')}` },

  { t: 'Exercise — next month in, oldest month out', giua: true, body: `
${two(`<div>${steps([
    'Create the partition for <b>November 2026</b>.',
    'Insert an event at <code class="i">2026-11-11 11:11+07</code> and prove which partition holds it.',
    'Retire July: detach it, then drop it. Show what is left.',
  ])}${box('Hint', '<code class="i">PARTITION OF … FOR VALUES FROM … TO …</code> · <code class="i">tableoid::regclass</code> · <code class="i">DETACH PARTITION</code>.', '')}</div>`,
  zm(psql(`CREATE TABLE event_p_2026_11 PARTITION OF event_p
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
INSERT INTO event_p (luc, payload)
  VALUES ('2026-11-11 11:11+07', 'ngay doc than');
SELECT tableoid::regclass AS phan_manh, luc, payload
FROM event_p WHERE luc >= '2026-11-01';
    phan_manh    |          luc           |    payload
-----------------+------------------------+---------------
 event_p_2026_11 | 2026-11-11 11:11:00+07 | ngay doc than
ALTER TABLE event_p DETACH PARTITION event_p_2026_07;
DROP TABLE event_p_2026_07;
    phan_manh    | count
-----------------+-------
 event_p_2026_09 |     1
 event_p_2026_11 |     1`, { sm: true, hl: [9, 14, 15] }), 1.0), 'r46')}` },

  { t: 'Self-check & summary', giua: true, body: `
${two(`<ol style="font-size:23px;margin:0;padding-left:26px">
<li>Which queries benefit from partition pruning?</li>
<li>Why is <code class="i">ADD PRIMARY KEY (id)</code> refused?</li>
<li>Name the strongest reason to partition a table.</li>
</ol>
${box('Answers', '1 · Those that filter on the partition key (literal or parameter). &nbsp;2 · Uniqueness is checked per partition, so the key must include the partition key. &nbsp;3 · A retention policy: retiring old data becomes a DROP — fast, no dead tuples.', 'xanh')}`,
  `<ul style="font-size:23px;margin:0">
<li>RANGE (time), LIST (values), HASH (spread)</li>
<li>Pruning needs the key in the WHERE</li>
<li>DROP / DETACH a partition ≫ DELETE</li>
<li>Create partitions ahead; DEFAULT is a net</li>
<li>Index on the parent; PK includes the key</li>
</ul>
${box('Next — Lab 8', 'Production drill for Chapters 14–15: dump and restore, a read-only role, a streaming standby and its lag.', 'lam')}`)}` },
]);