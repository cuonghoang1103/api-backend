/**
 * pg-09-4 — PostgreSQL · Chapter 9 · Lesson 9.4 "Index types: B-tree, GIN, BRIN, GiST, Hash & unique" (slide EN, kiểu FU, 25/10/2026, agent c9).
 * Nguồn: content/courses/postgresql/s09-chi-muc.mjs › postgresql-9-4-loai-chi-muc. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-09-4.sql/.out.txt; GiST đặt phòng chạy lại từng lệnh: pg-09-4c; CT Shop: pg-09-ctshop). Đọc từ pg-09-out.mjs.
 * Bổ sung so với bài web: GIN = chỉ mục ngược (hình), jsonb_ops vs jsonb_path_ops (kích thước + toán tử ?), GIN cho mảng, BRIN min/max THẬT
 * từng khoảng 128 trang (brin_page_items), correlation trong pg_stats, BRIN trên cột không có thứ tự (lossy = mọi trang), Hash (16 vs 19 MB,
 * không phục vụ khoảng), GiST + ràng buộc loại trừ đặt phòng chạy thật, UNIQUE = chỉ mục, bảng kích thước 10 chỉ mục (96 MB > bảng 62 MB),
 * GIN làm chậm ghi (đo thật), GIN trigram/search_vector thật của CuongThai, CT Shop attrs (bảng nhỏ ⇒ Seq Scan).
 */
import { lamDeck, sql, psql, two, box, cards, kw, vsd, c } from './_pg-chung.mjs';
import { O } from './pg-09-out.mjs';
import { ginPic, brinPic, rangesPic, sizeBars, barsPages } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-09-4', code: 'PG 9.4', title: 'Index types: B-tree, GIN, BRIN, GiST, Hash & unique', sub: 'The right index for the shape of the data' };

const dai = (t) => Math.max(...String(t).split('\n').map((l) => l.length));
const P = (t, o = {}) => { const z = Math.min(o.max ?? 1.25, (o.w ?? 1100) / (dai(t) * 0.602 * 14 + 32)); return `<div style="zoom:${z.toFixed(3)}">${psql(t, { sm: true, ...o })}</div>`; };
/** psql gói dòng dài (giữ chữ to). */
const PW = (t, o = {}) => `<div class="c9w" style="zoom:${o.z ?? 1}">${psql(t, { sm: true, ...o })}</div>`;
const S = (src, o = {}) => { const z = Math.min(o.max ?? 1.3, (o.w ?? 1100) / (dai(src) * 0.602 * 15 + 30)); return `<div style="zoom:${z.toFixed(3)}">${sql(src, { sm: true, ...o })}</div>`; };
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const L = (q, out) => `pgcourse=# ${q}\n${out}`;
const WRAP = `<style>.c9w .term pre{white-space:pre-wrap;word-break:break-all}</style>`;
/** Bỏ cột cost=…: chỉ để cắt ngắn dòng khi chiếu — KHÔNG đổi số nào khác. */

export const slides = lamDeck({ chuong: 'Chapter 9 — Indexes', bai: '9.4' }, [
  { cover: true, t: 'Index types:<br>B-tree, GIN, BRIN, GiST, Hash', sub: 'B-tree answers 95% of queries.<br>For the other 5%, nothing else works.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>One question to pick an index type: <b>what shape is the data, what does the query ask?</b></li>
<li><b>GIN</b> — the “contains” index for jsonb, arrays and text</li>
<li><b>BRIN</b> — kilobytes instead of megabytes for huge, naturally ordered tables</li>
<li><b>GiST</b> — ranges and overlap: “no two bookings may overlap”</li>
<li><b>Hash</b>, <b>unique</b> indexes, and what all of them cost on disk and on writes</li>
</ul>` },

  { t: 'Five types, one question each', to: true, giua: true, body: `
${cards([['B-tree (default)', 'Equality, ranges, sorting, prefix LIKE. <b>If unsure, this one.</b>'],
['GIN', '“Does this row <b>contain</b> …?” — many values inside one row: jsonb, arrays, full text.'],
['BRIN', 'Huge table whose <b>physical order</b> follows the column (append-only time series).'],
['GiST', 'Ranges, geometry, nearest neighbour, <b>overlap</b> — and exclusion constraints.'],
['Hash', 'Equality only. Rarely better than B-tree.'],
['UNIQUE', 'Not a type: a B-tree that also <b>rejects duplicates</b> — every PK and UNIQUE.']], 3)}
${box('Syntax', '<code class="i">CREATE INDEX name ON table USING gin (column);</code> — leave out <code class="i">USING</code> and you get a B-tree.', 'lam')}` },

  { t: 'GIN — everyday example first: a cookbook index', giua: true, body: `
${ginPic()}
${p('A B-tree sorts <b>whole values</b>; it cannot answer “which rows have t15 <b>somewhere inside</b>?”. GIN (Generalized Inverted iNdex) stores every <b>element</b> once, with the list of rows that contain it — like a cookbook index by ingredient: “garlic → pages 12, 40, 77”.', 20)}` },

  { t: 'GIN on jsonb: @> (contains)', body: `
${two(P(L('SELECT props FROM event WHERE id IN (15, 35) ORDER BY id;', O.g_props), { w: 460, max: 1.2 }), PW(L(`EXPLAIN ANALYZE SELECT count(*) FROM event\n           WHERE props @> '{"tags": ["t15"]}';`, O.g_seq), { hl: [6, 8], z: 0.85 }), 'r37')}
${PW(`pgcourse=# CREATE INDEX idx_event_props ON event USING GIN (props);   -- 0.26 s here\nCREATE INDEX\npgcourse=# EXPLAIN (ANALYZE, BUFFERS) … same query … — excerpt\n${O.g_idx.split('\n').slice(2, 9).join('\n')}\n …`, { hl: [6, 9], z: 0.82 })}
${WRAP}` },

  { t: 'Reading the GIN result', to: true, giua: true, body: `
${barsPages({ rows: [['Seq Scan', 101, '#c0392b', 'parses all 500,000 jsonb values'], ['GIN + Bitmap', 16, '#7a5a9a', 'index finds the 25,000 rows, then re-checks']], max: 150, w: 1100, lw: 250, unit: 'ms', fs: 22 })}
<ul>
<li>t15 is in <b>5%</b> of rows, spread over every page (Heap Blocks: exact=7937) — still <b>6×</b> faster: no jsonb parsing of 475,000 non-matching rows</li>
<li>The gap grows with rarer values and bigger tables. Chapter 13 builds jsonb search and full-text search on GIN</li>
</ul>` },

  { t: 'jsonb_ops vs jsonb_path_ops', body: `
${S(`CREATE INDEX idx_event_props_path ON event USING GIN (props jsonb_path_ops);`, { max: 1.15 })}
${two(P(O.g_sizes, { w: 460, hl: [3, 4] }), box('Two flavours of jsonb GIN', '<b>jsonb_ops</b> (default) indexes every key and value: supports <code class="i">@&gt;</code>, <code class="i">?</code>, <code class="i">?|</code>, <code class="i">?&amp;</code>. <b>jsonb_path_ops</b> indexes hashed paths: <b>smaller</b> (1.6 vs 2.2 MB) and fast for <code class="i">@&gt;</code> — but cannot answer <code class="i">?</code> (key exists).', 'lam'), 'r46')}
${two(P(L(`EXPLAIN SELECT count(*) FROM event\n           WHERE props ? 'color';   -- with jsonb_ops`, O.g_q1), { w: 540, hl: [5, 7] }), P(L(`-- only jsonb_path_ops left:\npgcourse=# EXPLAIN SELECT count(*) FROM event\n           WHERE props ? 'color';`, O.g_q2), { w: 540, hl: [6, 7] }))}` },

  { t: 'GIN on arrays', giua: true, body: `
${S(`CREATE TABLE post (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, tags text[] NOT NULL);
INSERT INTO post (tags) SELECT ARRAY['t' || (i % 50), 'k' || (i % 13)]
FROM generate_series(1, 100000) i;
CREATE INDEX idx_post_tags ON post USING GIN (tags);`, { max: 1.0 })}
${PW(L(`EXPLAIN ANALYZE SELECT count(*) FROM post WHERE tags @> ARRAY['t7'];`, O.g_arr), { hl: [5, 8], z: 0.95 })}
${p('Same idea for <code class="i">text[]</code>: <code class="i">@&gt;</code> (contains), <code class="i">&amp;&amp;</code> (overlaps), <code class="i">&lt;@</code> (is contained by). Typical use: tags, roles, categories stored in one column.', 20)}
${WRAP}` },

  { t: 'BRIN — one summary per block range', giua: true, body: `
${brinPic()}
${p('BRIN (Block Range INdex) stores no rows at all: for each range of <b>128 table pages</b> it keeps only the <b>min and max</b> of the column. A query skips every range whose min..max cannot contain the answer.', 20)}` },

  { t: 'BRIN: 24 kB instead of 11 MB', body: `
${two(P(L(`SELECT … pg_relation_size(indexrelid) / 8192 AS pages\n           FROM pg_index WHERE indexrelid IN (…);`, O.b_sizes), { w: 560, hl: [5, 6] }),
P(L(`SELECT attname, round(correlation::numeric, 3) AS correlation\n           FROM pg_stats WHERE tablename = 'event' AND attname IN (…);`, O.b_corr), { w: 560, hl: [6] }))}
${two(box('≈ 460× smaller', 'The B-tree on created_at: <b>1,374 pages</b>. The BRIN: <b>3 pages</b>. On a billion-row log table that is the difference between gigabytes of index and a few megabytes.', 'xanh'),
box('correlation decides', '<code class="i">pg_stats.correlation</code> ≈ <b>1</b> means the column grows with the physical row order (we inserted in time order). <code class="i">amount</code> and <code class="i">user_id</code> ≈ 0: random order — BRIN useless there.', 'lam'))}` },

  { t: 'BRIN in a plan: lossy, then recheck', body: `
${PW(L(`EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM event\n           WHERE created_at BETWEEN '2024-03-01' AND '2024-03-08';   -- B-tree dropped (in BEGIN … ROLLBACK)`, O.b_brin.split('\n').slice(0, 11).join('\n') + '\n …'), { hl: [6, 8, 9, 10], z: 0.9 })}
${two(box('What the lines say', '<b>Heap Blocks: lossy=261</b> — the index knows <b>pages</b>, not rows (2 ranges of 128 pages). <b>Rows Removed by Index Recheck: 6844</b> — rows on those pages outside the week, thrown away. 269 pages, 1.8 ms.', 'lam'),
box('vs the B-tree', 'The B-tree on created_at answered the same query with an Index Only Scan: 31 pages, 1.2 ms. BRIN reads more pages per query — and <b>460× smaller</b>. Pick by table size and how much index RAM you can afford.', ''))}
${WRAP}` },

  { t: 'BRIN on a column with no physical order: useless', body: `
${PW(L(`CREATE INDEX idx_event_amount_brin ON event USING BRIN (amount);\npgcourse=# SET enable_seqscan = off;   -- force it, test only\npgcourse=# EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM event WHERE amount BETWEEN 100 AND 101;`, O.b_amt2.split('\n').slice(0, 11).join('\n') + '\n …'), { hl: [8, 9, 10], z: 0.9 })}
${p('<code class="i">amount</code> is random across pages (correlation 0.005): every range’s min..max covers almost everything, so BRIN marks <b>all 7,941 pages</b> and rechecks 499,495 rows — a slow Seq Scan in disguise. Without forcing, the planner simply ignores it. BRIN only for <b>append-only, naturally ordered</b> columns: timestamps of logs, events, sensor readings.', 20)}
${WRAP}` },

  { t: 'Hash: equality only', body: `
${S(`CREATE INDEX idx_event_email_hash ON event USING HASH (email);`, { max: 1.15 })}
${two(P(O.h_sizes, { w: 460, hl: [3, 4] }), `<div>${P(L(`EXPLAIN SELECT * FROM event\n           WHERE email = 'user250000@example.com';   -- B-tree dropped in BEGIN`, O.h_eq), { w: 600, hl: [5] })}
${P(L(`EXPLAIN SELECT count(*) FROM event WHERE email > 'user99';`, O.h_rng), { w: 600, hl: [6, 7] })}</div>`, 'r37')}
${box('Verdict', 'A hash index stores a hash of each value: it can find <code class="i">=</code> (here 16 MB vs 19 MB), but has no order — no <code class="i">&lt;</code>/<code class="i">&gt;</code>, no ORDER BY, no UNIQUE, no multi-column. Crash-safe since PostgreSQL 10, but a B-tree does all of that too. Rarely worth choosing.', 'lam')}` },

  { t: 'GiST: ranges that must not overlap', body: `
${S(`CREATE EXTENSION btree_gist;   -- lets GiST also handle "room_id WITH ="
CREATE TABLE booking (
  id      int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id int       NOT NULL,
  during  tstzrange NOT NULL,                       -- a time RANGE
  EXCLUDE USING gist (room_id WITH =, during WITH &&)  -- && = overlaps
);`, { max: 1.0 })}
${rangesPic()}
${p('The rule: <b>no two rows</b> with the <b>same room</b> and <b>overlapping</b> time. A UNIQUE constraint can only say “not equal”; “not overlapping” needs a GiST index — enforced by the database itself, race-free.', 20)}` },

  { t: 'GiST: the database refuses the double booking', body: `
${P(`pgcourse=# INSERT INTO booking (room_id, during) VALUES (1, '[2024-10-25 09:00, 2024-10-25 11:00)');\n${O.gi_ok1}\npgcourse=# INSERT INTO booking (room_id, during) VALUES (2, '[2024-10-25 10:00, 2024-10-25 12:00)');\n${O.gi_ok2}\npgcourse=# INSERT INTO booking (room_id, during) VALUES (1, '[2024-10-25 10:30, 2024-10-25 12:00)');\n${O.gi_bad.replace(' conflicts with existing key', '\n         conflicts with existing key')}\npgcourse=# INSERT INTO booking (room_id, during) VALUES (1, '[2024-10-25 11:00, 2024-10-25 12:00)');\n${O.gi_ok3}`, { hl: [6, 7, 8], max: 0.95 })}
${two(`<ul style="font-size:20px">
<li>Room 2 at 10:00 — fine: other room</li>
<li>Room 1, 10:30–12:00 — <b>rejected</b>: overlaps 09:00–11:00</li>
<li>Room 1, 11:00–12:00 — fine: <code class="i">[…)</code> excludes its end, so 11:00 touches but does not overlap</li>
</ul>`, box('Also GiST', 'Geometry and maps (PostGIS: “shops within 2 km”), nearest-neighbour search, ranges of numbers or dates. Shapes, ranges or distance ⇒ think GiST.', 'lam'))}` },

  { t: 'UNIQUE: a constraint that is an index', body: `
${two(`<div>${P(L(`CREATE UNIQUE INDEX uq_event_email ON event(email);\npgcourse=# INSERT INTO event (user_id, status, amount, email, created_at, props)\n           VALUES (1, 'active', 1, 'user42@example.com', now(), '{}');`, O.u_dup), { w: 600, hl: [4, 5] })}
${P(L(`SELECT conname, contype, conindid::regclass AS backed_by_index\n           FROM pg_constraint WHERE conrelid = 'event'::regclass;`, O.u_con), { w: 600, hl: [5] })}</div>`,
`<ul style="font-size:21px">
<li>A <b>unique B-tree</b> both <b>rejects duplicates</b> and makes the lookup fast</li>
<li>Every <code class="i">PRIMARY KEY</code> and <code class="i">UNIQUE</code> constraint is backed by one — <code class="i">event_pkey</code> since Chapter 3</li>
<li>Prefer the <b>constraint</b> (<code class="i">ALTER TABLE … ADD UNIQUE</code>, Prisma <code class="i">@unique</code>): same index, plus it can be referenced by a foreign key</li>
<li><code class="i">CREATE UNIQUE INDEX … WHERE</code> = a <b>partial</b> unique rule (“one active row per user”)</li>
</ul>`, 'r46')}` },

  { t: 'What all those indexes cost on disk', body: `
${two(sizeBars({ w: 700 }), `<div>${P(O.all_tot, { w: 380, hl: [3] })}
${box('96 MB of indexes on a 62 MB table', 'Ten indexes built in this chapter weigh more than the data. B-trees on wide text (email, lower(email)) are the heaviest; partial and BRIN are tiny.', 'do2')}</div>`, 'r64')}` },

  { t: 'Trap: GIN on a write-heavy column', body: `
${two(`<div>${S(`CREATE TABLE evg0 (LIKE event INCLUDING IDENTITY);
CREATE TABLE evg1 (LIKE event INCLUDING IDENTITY);
CREATE INDEX ON evg1 USING GIN (props);
-- 100,000 rows into each:`, { w: 560 })}
${P(`-- evg0 (no index)\n${O.gw0}\n-- evg1 (one GIN)\n${O.gw1}`, { w: 400, hl: [3, 6] })}</div>`,
`<div>${barsPages({ rows: [['no index', 84, '#2f7d4f'], ['one GIN', 186, '#7a5a9a']], max: 186, w: 520, lw: 150, fs: 19, unit: 'ms' })}
${box('Why', 'One row puts <b>many</b> entries into a GIN (every key and value of its jsonb). <code class="i">fastupdate</code> (on by default) batches them in a pending list — writes stay fast until a flush makes one of them slow.', 'do2')}</div>`)}
${p('One GIN index made bulk inserts <b>2.2×</b> slower here. On a table taking thousands of writes per second, that is the bottleneck. Options: index only the jsonb path you search, keep search in a less-written table, or update a search table in the background.', 19)}` },

  { t: 'In practice: GIN on CuongThai', body: `
${two(S(`model SocialPost {
  // … content String …
  // GIN trigram index powering fast ILIKE/substring
  // search on post content. Requires pg_trgm.
  @@index([content(ops: raw("gin_trgm_ops"))],
          type: Gin,
          map: "idx_social_posts_content_trgm")
}`, { lang: 'typescript', w: 580 }), S(`-- migrations on the same site
CREATE INDEX "idx_projects_search_vector"
  ON "projects" USING GIN ("search_vector");
CREATE INDEX "idx_interview_questions_tags"
  ON "interview_questions" USING GIN ("tags");
CREATE INDEX "idx_users_username_trgm"
  ON "users" USING gin ("username" gin_trgm_ops);`, { w: 520 }))}
${box('Three GIN jobs in one schema', '<b>Trigram</b> GIN for <code class="i">ILIKE \'%word%\'</code> search (the leading-% trap from 9.3, solved), <b>tsvector</b> GIN for full-text search, plain GIN for a <b>tags</b> array. Prisma supports <code class="i">type: Gin</code> and operator classes via <code class="i">ops: raw(…)</code>. Chapter 13 builds both kinds of search.', 'lam')}` },

  { t: 'CT Shop: product attributes', body: `
${P(`ctshop=# SELECT id, name, attrs FROM product WHERE attrs ? 'color' ORDER BY id LIMIT 3;\n${O.sh_attr}`, { hl: [], max: 1.0, title: 'psql (17.11) — ctshop' })}
${two(P(`ctshop=# BEGIN; CREATE INDEX idx_product_attrs ON product USING GIN (attrs);\nctshop=*# EXPLAIN SELECT id, name FROM product WHERE attrs @> '{"color": "xanh"}';\n${O.sh_gin}\nctshop=*# ROLLBACK;`, { w: 640, hl: [5, 6], title: 'psql (17.11) — ctshop' }),
box('Small table, Seq Scan', 'CT Shop has <b>96 products</b> (2 pages): the planner reads them all and ignores the GIN — correctly. Lab 7 adds search over many more rows, where the same index pays off.', 'lam'), 'r64')}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>Count the events whose tags contain <code class="i">"k3"</code>. Which index serves it, and what does the plan look like?</li>
<li>A <code class="i">login_audit</code> table gets 2 million rows a day, only ever appended, always queried by time range. Which index type, and why?</li>
<li>“A teacher cannot teach two classes at overlapping times.” Which index / constraint?</li>
</ol>` },

  { t: 'Solution', body: `
${PW(L(`EXPLAIN ANALYZE SELECT count(*) FROM event WHERE props @> '{"tags": ["k3"]}';`, O.ex4a), { hl: [5, 7, 8], z: 0.9 })}
${two(P(L(`SELECT count(*) FROM event WHERE props @> '{"tags": ["k3"]}';`, O.ex4b), { w: 520, hl: [4] }),
box('Answers', '1 → <b>GIN</b> on props (Bitmap Index Scan on idx_event_props, 71,429 rows). 2 → <b>BRIN</b> on the timestamp: append-only ⇒ correlation ≈ 1, tiny index, cheap writes. 3 → <b>GiST exclusion constraint</b>: <code class="i">EXCLUDE USING gist (teacher_id WITH =, during WITH &amp;&amp;)</code>.', 'xanh'), 'r46')}
${WRAP}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why can a B-tree not answer <code class="i">props @&gt; '{"tags":["t15"]}'</code>?</li>
<li>When does BRIN degrade into reading every page?</li>
<li>Name one rule that UNIQUE cannot express but GiST can.</li>
</ol>
${box('Answers', '1 · A B-tree sorts whole values; “contains an element” needs GIN, which indexes the elements. &nbsp;2 · When the column’s values are not physically ordered (correlation ≈ 0). &nbsp;3 · “No two ranges overlap” (bookings) — an exclusion constraint.', 'xanh')}` },

  { t: 'Summary of Chapter 9 & next', to: true, body: `
<ul>
<li><b>9.1</b> An index is a sorted B-tree: 4 pages instead of 7,937. Read plans with EXPLAIN (ANALYZE, BUFFERS)</li>
<li><b>9.2</b> Composite: leftmost prefix, equality first; INCLUDE ⇒ Index Only Scan</li>
<li><b>9.3</b> Bare columns, selectivity, partial indexes, statistics — and the write tax</li>
<li><b>9.4</b> B-tree by default; GIN “contains”, BRIN huge + ordered, GiST overlap; UNIQUE is an index</li>
</ul>
${box('Next — Chapter 10: EXPLAIN & the planner', 'Read every node of a plan, join strategies (nested loop, hash, merge), how row estimates are made, and how to tune. Then <b>Lab 5</b>: 1 million CT Shop orders, before and after indexes.', 'lam')}` },
]);
