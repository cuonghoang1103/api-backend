/**
 * pg-09-3 — PostgreSQL · Chapter 9 · Lesson 9.3 "When indexes are NOT used, selectivity & partial indexes" (slide EN, kiểu FU, 25/10/2026, agent c9).
 * Nguồn: content/courses/postgresql/s09-chi-muc.mjs › postgresql-9-3-khong-dung-selectivity-partial. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-09-3*.sql/.out.txt; 3b/3c = bản COSTS OFF + \pset format wrapped, dựng lại trạng thái bài 9.3 bằng DROP tạm
 * trong BEGIN … ROLLBACK). Đọc từ pg-09-out.mjs (sinh tự động).
 * Bổ sung so với bài web: chỉ mục biểu thức có THỐNG KÊ RIÊNG (trước ANALYZE ước 2500 dòng → Bitmap; sau ANALYZE ước 1 → Index Scan);
 * created_at::date vs viết lại thành khoảng; kiểu lệch 42.0 vs '42'; pg_stats most_common_vals; ép dùng chỉ mục cho giá trị phổ biến
 * ĐỌC NHIỀU TRANG HƠN (8.221 vs 7.941); partial + tham số: custom plan dùng được, generic plan (plan_cache_mode) thì không;
 * thống kê cũ (ước 1 dòng, thật 60.100); chi phí ghi 0 vs 8 chỉ mục (88 ms vs 1.216 ms); pg_stat_user_indexes; CREATE INDEX CONCURRENTLY
 * (không chạy trong giao dịch, indisvalid); chỉ mục partial viết tay trong migration của CuongThai (Prisma không có WHERE).
 */
import { lamDeck, sql, psql, two, box, cards, kw, vsd, c } from './_pg-chung.mjs';
import { O } from './pg-09-out.mjs';
import { selPic, partialPic, barsPages } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-09-3', code: 'PG 9.3', title: 'When indexes are NOT used, selectivity & partial indexes', sub: 'The planner is usually right' };

const dai = (t) => Math.max(...String(t).split('\n').map((l) => l.length));
const P = (t, o = {}) => { const z = Math.min(o.max ?? 1.25, (o.w ?? 1100) / (dai(t) * 0.602 * 14 + 32)); return `<div style="zoom:${z.toFixed(3)}">${psql(t, { sm: true, ...o })}</div>`; };
const S = (src, o = {}) => { const z = Math.min(o.max ?? 1.3, (o.w ?? 1100) / (dai(src) * 0.602 * 15 + 30)); return `<div style="zoom:${z.toFixed(3)}">${sql(src, { sm: true, ...o })}</div>`; };
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const L = (q, out) => `pgcourse=# ${q}\n${out}`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Indexes', bai: '9.3' }, [
  { cover: true, t: 'When indexes are NOT used,<br>selectivity & partial indexes', sub: 'Why the index you built is ignored — usually for a good reason —<br>and what every index costs you on writes.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The traps that make an index <b>unusable</b>: a function on the column, a cast, a leading <code class="i">%</code></li>
<li><b>Expression indexes</b> — and why they need <code class="i">ANALYZE</code></li>
<li><b>Selectivity</b>: why skipping the index is often the <b>right</b> call</li>
<li><b>Partial indexes</b> — tiny indexes for a hot subset — and their parameter trap</li>
<li>Stale statistics, the <b>write cost</b> of indexes, unused indexes, <code class="i">CREATE INDEX CONCURRENTLY</code></li>
</ul>` },

  { t: 'Why a good index gets ignored', to: true, giua: true, body: `
${cards([['1 · The column is wrapped', '<code class="i">lower(email)</code>, <code class="i">created_at::date</code>, a cast — the index stores the <b>bare</b> column, not the result.'],
['2 · Low selectivity', 'The filter keeps <b>most</b> of the table. Reading it straight through is cheaper — the planner is right.'],
['3 · The index does not fit', 'Leading <code class="i">%</code> in LIKE, a partial index whose WHERE the query does not match, column 2 of a composite.'],
['4 · Stale statistics', 'After a bulk change the planner’s row estimates are wrong. <code class="i">ANALYZE</code> fixes it in seconds.']], 2)}
${box('And the other side', 'Even a perfect index is not free: every INSERT/UPDATE/DELETE pays for it. The end of this lesson measures that.', 'lam')}` },

  { t: 'A function on the column defeats a plain index', body: `
${P(L("EXPLAIN (ANALYZE, COSTS OFF) SELECT id FROM event WHERE lower(email) = 'user250000@example.com';", O.c3_a), { hl: [4, 5, 6], max: 1.2 })}
${two(box('Why', 'The index holds <code class="i">email</code> values in sorted order. It knows nothing about <code class="i">lower(email)</code>, so there is no sorted place to jump to: <b>Seq Scan</b>, every row computed and tested (657 ms on a busy machine).', 'do2'),
box('Two fixes', '① Index the <b>expression</b> the query uses (next slide). ② Store the value already normalised (e.g. save emails lowercase) and query the bare column.', 'xanh'))}` },

  { t: 'Expression index — and its own statistics', body: `
${P(`pgcourse=# CREATE INDEX idx_event_lower_email ON event (lower(email));\n-- right after CREATE INDEX, same query: estimate rows=2500 (a guess)\n${O.c3_pre.split('\n').slice(0, 5).join('\n')}\n …`, { hl: [5], max: 0.9 })}
${P(L(`ANALYZE event;   -- then the same query:`, O.c3_b), { hl: [4, 5], max: 1.0 })}
${p('An expression index gets <b>its own statistics</b>, collected by <code class="i">ANALYZE</code>. Before: the planner guessed 2,500 rows and chose a Bitmap scan. After: it knows lower(email) is unique — <b>Index Scan</b>, 1 row.', 20)}` },

  { t: 'The same trap with dates and casts', body: `
${P(L("EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM event WHERE created_at::date = '2024-03-01';   -- ✗", O.c3_date), { hl: [5, 6, 7], max: 0.88 })}
${P(L("EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM event WHERE created_at >= '2024-03-01' AND created_at < '2024-03-02';   -- ✓", O.c3_range), { hl: [5, 6], max: 0.88 })}
${p('Casting every <code class="i">created_at</code> to a date ⇒ Seq Scan, 203 ms. The same day as a <b>range on the bare column</b> ⇒ Index Only Scan, 1.7 ms. Same 1,440 rows.', 20)}` },

  { t: 'More silent traps', body: `
${two(`<div>${P(L('EXPLAIN (COSTS OFF) SELECT id FROM event WHERE user_id = 42.0;', O.c3_num), { w: 540, hl: [4, 5] })}
${P(L("EXPLAIN (COSTS OFF) SELECT id FROM event WHERE user_id = '42';", O.c3_str), { w: 540, hl: [4, 6] })}</div>`,
`<div>${P(L("EXPLAIN (COSTS OFF) SELECT id FROM event\n           WHERE email LIKE '%250000@example.com';", O.c3_like), { w: 540, hl: [5, 6] })}
<ul style="font-size:20px;margin-top:8px">
<li><code class="i">42.0</code> is numeric ⇒ PostgreSQL casts the <b>column</b> (<code class="i">user_id::numeric</code>) ⇒ no index. <code class="i">'42'</code> is fine: the literal is converted, not the column</li>
<li>A <b>leading</b> <code class="i">%</code> has no sorted starting point. For “contains” search use a trigram GIN index (Chapter 13)</li>
</ul></div>`)}
${box('How it bites in real code', 'An ORM sending a JS number as <code class="i">numeric</code>, or a <code class="i">bigint</code> id compared to a text parameter: the query still returns the right rows, just slowly — which is why nobody notices until the table is big.', 'do2')}` },

  { t: 'Selectivity: everyday example first', body: `
${selPic()}
${p('<b>Selectivity</b> = how small a fraction of the table a filter keeps. A teacher asked for “students wearing glasses” in a class where 2 in 40 do, uses the seating chart. Asked for “students wearing shoes”, she just looks at everyone.', 20)}` },

  { t: 'The planner knows the distribution', body: `
${P(L('SELECT status, count(*), round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct FROM event GROUP BY status ORDER BY 2 DESC;', O.c3_dist), { hl: [4, 5, 6], max: 0.95 })}
${P(L("SELECT most_common_vals, most_common_freqs FROM pg_stats WHERE tablename = 'event' AND attname = 'status';", O.c3_mcv), { hl: [4], max: 0.95 })}
${p('<code class="i">ANALYZE</code> samples the table and stores, per column, the most common values and their frequencies in <code class="i">pg_stats</code>. From that the planner estimates: <code class="i">active</code> ≈ 66% of rows, <code class="i">pending</code> ≈ 1% — and prices each plan accordingly.', 20)}
${box('Read the frequencies', '0.6577 · 0.3319 · 0.0104 — estimates from a <b>sample</b>, very close to the real 66.0 / 33.0 / 1.0 %. Chapter 10 reads these statistics in depth.', 'lam')}` },

  { t: 'A common value: the planner skips the index', body: `
${P(L("EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT avg(amount) FROM event WHERE status = 'active';", O.c3_act), { hl: [5, 6, 8], max: 1.1 })}
${p('An index on <code class="i">status</code> exists — and the plan is a <b>Seq Scan</b> over all 7,941 pages. 330,000 rows match: they sit on <b>every</b> page, so the index could not skip a single one.', 21)}` },

  { t: 'A rare value: the index wins', body: `
${P(L("EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT avg(amount) FROM event WHERE status = 'pending';", O.c3_pend), { hl: [5, 6, 8], max: 1.0 })}
${p('Same index, opposite decision. Only 5,000 rows (1%): Bitmap Heap Scan, 13.9 ms vs 131 ms. Note it still touched 5,000 pages — the win is checking 5,000 rows instead of 500,000.', 20)}` },

  { t: 'Forcing the index for the common value: worse', body: `
${P(L("SET enable_seqscan = off;   -- test only, never in production\npgcourse=# EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT avg(amount) FROM event WHERE status = 'active';", O.c3_force), { hl: [6, 9, 11], max: 0.95 })}
${two(box('Measured', 'Forced index: <b>8,221 pages</b> (280 index + all 7,941 table pages), 238 ms. Seq Scan: <b>7,941 pages</b>, 131 ms. More work for the same rows.', 'do2'),
box('Rule of thumb', 'An index pays off when a query keeps a <b>small fraction</b> of the table — a few percent or less. Indexing a column you always filter to its common value is wasted disk and write time.', 'xanh'))}` },

  { t: 'Partial index: index only the rows you query', body: `
${S(`CREATE INDEX idx_event_pending ON event (created_at)
WHERE status = 'pending';`, { max: 1.2 })}
${two(P(O.c3_sizes, { w: 440, hl: [3, 4] }), p('Only the 5,000 pending rows are in it: <b>128 kB vs 3,408 kB</b>, about 27× smaller, cheaper to update, likely to stay in memory. The classic “hot subset”: unprocessed jobs, unread notifications, soft-deleted rows.', 21), 'r46')}
${partialPic()}` },

  { t: 'A partial index is used when the query implies its WHERE', body: `
${P(L("EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM event WHERE status = 'pending' ORDER BY created_at LIMIT 10;", O.c3_old), { hl: [5], max: 1.0 })}
${P(L("EXPLAIN (COSTS OFF) SELECT id FROM event WHERE status = 'done' ORDER BY created_at LIMIT 10;", O.c3_done), { hl: [5, 6], max: 1.0 })}
${p('“Oldest 10 pending events” uses <code class="i">idx_event_pending</code> — no <code class="i">Index Cond</code> even needed, every entry is pending and already in <code class="i">created_at</code> order. A query for <code class="i">done</code> cannot use it: the planner must <b>prove</b> your WHERE is inside the index’s WHERE.', 20)}` },

  { t: 'Trap: partial index + query parameters', body: `
${two(P(L("PREPARE q(text) AS SELECT id, created_at FROM event\n           WHERE status = $1 ORDER BY created_at LIMIT 10;\npgcourse=# EXPLAIN (COSTS OFF) EXECUTE q('pending');   -- custom plan", O.c3_cust), { w: 560, hl: [7] }),
P(L("SET plan_cache_mode = force_generic_plan;\npgcourse=# EXPLAIN (COSTS OFF) EXECUTE q('pending');   -- generic plan", O.c3_gen), { w: 540, hl: [6, 7] }))}
${box('What happened', 'A <b>custom plan</b> sees the value <code class="i">\'pending\'</code> and can prove the partial index fits. A <b>generic plan</b> is made for “any $1”, so it cannot — the index is skipped. PostgreSQL may switch a prepared statement to a generic plan after 5 executions, and apps (and ORMs such as Prisma) send parameterised, often prepared, queries.', 'do2')}
${p('So a partial index that is perfect in psql can do nothing from the app. Test it through the same query path the app uses — or put the literal in the SQL when the value is fixed.', 19)}` },

  { t: 'Stale statistics: the planner flying blind', body: `
${P(`-- job: 100,000 'done' rows, ANALYZEd; autovacuum off. Then 100 'queued' rows inserted and…\nUPDATE job SET state = 'queued' WHERE id <= 60000;\npgcourse=# EXPLAIN ANALYZE SELECT * FROM job WHERE state = 'queued';\n${O.job2}`, { hl: [6], max: 0.9 })}
${P(L(`ANALYZE job;\npgcourse=# EXPLAIN ANALYZE SELECT * FROM job WHERE state = 'queued';`, O.job3), { hl: [5], max: 0.9 })}
${p('Estimated <b>rows=1</b>, actual <b>60,100</b>: the statistics still said “nobody is queued”. After <code class="i">ANALYZE</code>: rows=59816. The plan happened to stay the same here; in a JOIN, such a wrong estimate is the classic cause of a bad plan (Chapter 10). After a bulk load, run ANALYZE.', 19)}` },

  { t: 'The cost side: every index slows every write', body: `
${two(`<div>${S(`CREATE TABLE ev0 (LIKE event INCLUDING IDENTITY);
CREATE TABLE ev8 (LIKE event INCLUDING IDENTITY
                             INCLUDING INDEXES);
-- 100,000 rows into each:
INSERT INTO ev0 (…) SELECT … FROM event WHERE id <= 100000;
INSERT INTO ev8 (…) SELECT … FROM event WHERE id <= 100000;`, { w: 560 })}
${P(`-- ev0 (0 indexes)\n${O.w_ins0}\n-- ev8 (8 indexes)\n${O.w_ins8}`, { w: 400, hl: [3, 6] })}</div>`,
`<div>${barsPages({ rows: [['0 indexes', 88, '#2f7d4f'], ['8 indexes', 1216, '#c0392b']], max: 1216, w: 520, lw: 160, fs: 19, unit: 'ms' })}
${P(O.w_size, { w: 500, hl: [4] })}</div>`)}
${p('Same 100,000 rows: <b>88 ms vs 1,216 ms (~14×)</b>, and 12 MB of data carries <b>27 MB of indexes</b>. Every index is a tax on every INSERT/UPDATE/DELETE, forever.', 20)}` },

  { t: 'Find the indexes nobody uses', body: `
${two(S(`SELECT indexrelname AS index, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid))
         AS size
FROM pg_stat_user_indexes
WHERE relname = 'event'
ORDER BY idx_scan;`, { w: 520 }), P(O.w_use, { w: 560 }))}
${two(box('How to read it', '<code class="i">idx_scan</code> = how many times each index was used since statistics were reset. On a real server, after weeks of traffic, <b>0</b> means: candidate to drop. Here every index was used a few times by this lesson’s queries.', 'lam'),
box('Before dropping', 'Check every replica (stats are per server), a full business cycle (month-end reports!), and keep indexes behind PRIMARY KEY / UNIQUE — they enforce rules, not just speed.', 'do2'))}` },

  { t: 'On production: CREATE INDEX CONCURRENTLY', body: `
${two(`<div>${box('Plain CREATE INDEX', 'Takes a lock that <b>blocks all writes</b> to the table for the whole build. On a big, busy table that is minutes of failed INSERTs.', 'do2')}
${box('CREATE INDEX CONCURRENTLY', 'Builds without blocking writes: two passes over the table, slower, waits for running transactions. The standard way to add an index to a live table.', 'xanh')}</div>`,
`<div>${P(L('CREATE INDEX CONCURRENTLY idx_event_amount ON event(amount);', O.conc1), { w: 540 })}
${P(L("SELECT indexrelid::regclass AS index, indisvalid\n           FROM pg_index WHERE indexrelid = 'idx_event_amount'::regclass;", O.conc2), { w: 540, hl: [6] })}
${P(L('BEGIN;\npgcourse=*# CREATE INDEX CONCURRENTLY idx_x ON event(amount);', O.conc3.replace('ROLLBACK;\nROLLBACK', '')), { w: 540, hl: [3] })}</div>`)}
${p('Two catches: it <b>cannot run inside a transaction</b> (so not inside most migration tools’ wrapping transaction), and if it fails it leaves an <b>INVALID</b> index — check <code class="i">indisvalid</code>, drop it and retry.', 19)}` },

  { t: 'In practice: a partial index on CuongThai', body: `
${two(S(`-- prisma/migrations/20260918080000_vo_nen_tai_lieu
-- Find orphaned background files: is any page still
-- pointing at this key?
CREATE INDEX IF NOT EXISTS "idx_notes_bg_key"
  ON "notes" ("bg_key")
  WHERE "bg_key" IS NOT NULL;`, { w: 560 }), S(`-- 20260849000000_add_user_preferences…
-- NOTE: "one PENDING row per user" is enforced
-- in accountDeletion.service.ts, not by a
-- partial unique index. Prisma's schema
-- language can't express WHERE status =
-- 'PENDING', so an index here would show up
-- as permanent schema drift …`, { w: 540 }))}
${box('The trade-off', 'Prisma’s <code class="i">@@index</code> has no <code class="i">WHERE</code>. Option A: write the partial index by hand in the migration SQL (left — most notes have no background, so the index stays tiny). Option B: skip it and enforce the rule in code (right) to avoid schema drift. Both are real decisions on this site.', 'lam')}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>Write the query “the 3 oldest <b>pending</b> events created in <b>June 2024</b>” so that it uses <code class="i">idx_event_pending</code>.</li>
<li>A teammate wrote <code class="i">WHERE date_trunc('month', created_at) = '2024-06-01'</code>. Why is it slow, and how do you rewrite it?</li>
</ol>
${box('Hint', 'Repeat the partial index’s condition literally. Leave the indexed column bare — turn the month into a range.', '')}` },

  { t: 'Solution (1): use the partial index', body: `
${P(L("EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM event WHERE status = 'pending'\n           AND created_at >= '2024-06-01' AND created_at < '2024-07-01' ORDER BY created_at LIMIT 3;", O.ex3a_w), { hl: [5, 6, 7], max: 1.0 })}
${two(P(O.ex3b_w, { w: 460, title: 'result' }), box('Why it works', 'The query repeats <code class="i">status = \'pending\'</code> literally, so the planner can prove it matches the index’s WHERE; the June range becomes the <code class="i">Index Cond</code> on <code class="i">created_at</code>. 2.8 ms here.', 'xanh'), 'r46')}` },

  { t: 'Solution (2): a range instead of date_trunc', body: `
${P(`pgcourse=# -- before: a function wrapped around created_at\n${O.ex3c_w}`, { hl: [5, 6], max: 1.0 })}
${P(`pgcourse=# -- after: the same month as a range on the bare column\n${O.ex3d_w}`, { hl: [5, 6], max: 1.0 })}
${p('<code class="i">date_trunc(\'month\', created_at) = \'2024-06-01\'</code> ⇒ <code class="i">created_at &gt;= \'2024-06-01\' AND created_at &lt; \'2024-07-01\'</code>. Same rows; Seq Scan becomes an Index Only Scan. (An expression index on <code class="i">date_trunc(…)</code> would also work, but one range rewrite is cheaper than another index.)', 19)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>There is an index on <code class="i">email</code>. Why does <code class="i">WHERE lower(email) = …</code> ignore it?</li>
<li><code class="i">status = 'active'</code> matches 66% of rows. Should the planner use the index?</li>
<li>A partial index works in psql but not from the app. Likely reason?</li>
</ol>
${box('Answers', '1 · The index stores email, not lower(email): build an expression index (and ANALYZE). &nbsp;2 · No — a Seq Scan reads fewer pages. &nbsp;3 · The app sends a parameter; a generic plan cannot prove the partial WHERE.', 'xanh')}` },

  { t: 'Summary & next', to: true, body: `
<ul>
<li>Leave indexed columns <b>bare</b>; otherwise index the exact expression (then <code class="i">ANALYZE</code>)</li>
<li>Low selectivity ⇒ Seq Scan is <b>correct</b>; indexes pay off for small fractions</li>
<li>Partial indexes: tiny and fast for a hot subset — test them with the app’s parameters</li>
<li>Every index taxes writes (~14× here): drop unused ones, build new ones <code class="i">CONCURRENTLY</code></li>
</ul>
${box('Next — 9.4', 'Beyond B-tree: <b>GIN</b> for jsonb/arrays/text, <b>BRIN</b> for huge append-only tables, <b>GiST</b> for ranges and overlap, <b>Hash</b> — and unique indexes.', 'lam')}` },
]);
