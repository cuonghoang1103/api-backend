/**
 * pg-09-1 — PostgreSQL · Chapter 9 · Lesson 9.1 "What an index is: B-tree, Seq Scan vs Index Scan" (slide EN, kiểu FU, 25/10/2026, agent c9).
 * Nguồn: content/courses/postgresql/s09-chi-muc.mjs › postgresql-9-1-chi-muc-la-gi. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-09-1.sql/.out.txt; bảng ch09.event 500.000 dòng, 62 MB, 7.937 trang). Đọc từ pg-09-out.mjs (sinh tự động).
 * Bổ sung so với bài web: trang 8 kB + đếm trang bằng BUFFERS (7.937 vs 4), cây THẬT bằng pageinspect (gốc 164 → nhánh 800 → lá 829 → bảng (3937,47)),
 * khoá phân cách thật trong trang gốc, lá nối nhau (range), ORDER BY miễn phí, bẫy LIKE 'abc%' cần text_pattern_ops khi collation không phải C,
 * ba cách đọc bảng (Seq / Index / Bitmap Heap + Index Only), PK đã có chỉ mục, bảng nhỏ bỏ qua chỉ mục, Prisma @@index (lược đồ CuongThai thật).
 */
import { lamDeck, sql, psql, run, two, box, cards, kw, vsd, c } from './_pg-chung.mjs';
import { O } from './pg-09-out.mjs';
import { bookPic, heapPage, barsPages, btreePic, leafChain, scanTypes } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-09-1', code: 'PG 9.1', title: 'What an index is: B-tree, Seq Scan vs Index Scan', sub: 'The book index, for your table' };

const dai = (t) => Math.max(...String(t).split('\n').map((l) => l.length));
/** psql thu nhỏ vừa khung (chữ mã 14px × zoom, không dưới ~12px). */
const P = (t, o = {}) => { const z = Math.min(o.max ?? 1.25, (o.w ?? 1100) / (dai(t) * 0.602 * 14 + 32)); return `<div style="zoom:${z.toFixed(3)}">${psql(t, { sm: true, ...o })}</div>`; };
const S = (src, o = {}) => { const z = Math.min(o.max ?? 1.3, (o.w ?? 1100) / (dai(src) * 0.602 * 15 + 30)); return `<div style="zoom:${z.toFixed(3)}">${sql(src, { sm: true, ...o })}</div>`; };
const p = (t, fs = 22) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;

const Q_SEQ = `EXPLAIN ANALYZE
SELECT * FROM event WHERE email = 'user250000@example.com';`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Indexes', bai: '9.1' }, [
  { cover: true, t: 'What an index is:<br>B-tree, Seq Scan vs Index Scan', sub: 'Phase 3 — Performance begins.<br>Same answer, a few pages read instead of the whole table.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why a query on a big table is slow: PostgreSQL reads <b>pages</b>, and without help it reads <b>all</b> of them</li>
<li>What an <b>index</b> is — a separate, <b>sorted</b> structure that points at rows — and how to create one</li>
<li>Reading <code class="i">EXPLAIN ANALYZE</code> and counting pages with <code class="i">BUFFERS</code>: <b>7,937 pages → 4 pages</b></li>
<li>The <b>B-tree</b>: root → internal → leaf → table, walked on our real 500,000-row table</li>
<li>What a B-tree can answer (=, ranges, ORDER BY, prefix LIKE) and the <b>three ways</b> to read a table</li>
</ul>
${box('Where we are', 'Chapters 2–8: the <b>right</b> answer. Chapters 9–12: the <b>fast</b> answer.', 'lam')}` },

  { t: 'Everyday example first: the index at the back of a book', giua: true, body: `
${bookPic()}
${p('To find “MVCC” in a 900-page book you do not read 900 pages. You open the <b>index</b> at the back — a short, <b>alphabetical</b> list — find “MVCC → 412” and turn straight to page 412. A database index is exactly that, for a table.', 23)}` },

  { t: 'Our test table: event, 500,000 rows', body: `
${two(S(`CREATE TABLE event (
  id         bigint GENERATED ALWAYS AS IDENTITY
             PRIMARY KEY,
  user_id    int           NOT NULL,  -- 1..1000
  status     text          NOT NULL,  -- active/done/pending
  amount     numeric(10,2) NOT NULL,
  email      text          NOT NULL,  -- user<i>@example.com
  created_at timestamptz   NOT NULL,  -- one per minute, 2024
  props      jsonb         NOT NULL   -- {"tags": [...]}
);
INSERT INTO event (...) SELECT ...
FROM generate_series(1, 500000) AS i;`, { w: 640 }),
`<div>${S(`SELECT count(*) AS rows,
  pg_size_pretty(
    pg_relation_size('event')) AS size,
  pg_relation_size('event') / 8192
    AS pages
FROM event;`, { w: 440, max: 1 })}${P(O.size, { w: 440, max: 1.25, hl: [3] })}
</div>`, 'r64')}
${box('Deterministic', 'No <code class="i">random()</code>: every value is computed from <code class="i">i</code>, so <b>you get the same rows</b> on your machine. Each user has 500 events; 66% active, 33% done, 1% pending.', 'lam')}
${p('Every number in this chapter was measured on this table, on PostgreSQL 17.11. <b>Your times will differ — compare the ratios and the page counts</b>, which do not.', 20)}` },

  { t: 'A table lives on disk as 8 kB pages', body: `
${two(heapPage(), `<div><ul style="font-size:23px">
<li>PostgreSQL stores a table (the <b>heap</b>) as a file of fixed-size <b>pages</b> (also called blocks) of <b>8 kB</b></li>
<li>It never reads “one row”: it reads the <b>whole page</b> the row sits on, and keeps recent pages in memory (<b>shared buffers</b>)</li>
<li>Our table: <b>7,937 pages</b> × 8 kB = 62 MB</li>
</ul>
<div style="display:flex;gap:14px;align-items:flex-start"><div style="flex:0 0 190px">${P(`SHOW block_size;\n${O.bsize}`, { max: 1.2, w: 190, title: 'psql' })}</div>
${box('The unit of work', '“How much work did this query do?” = “<b>how many pages did it touch?</b>”. That is how we measure every index in this chapter.', '')}</div></div>`, 'r46')}` },

  { t: 'Without an index: a Sequential Scan', giua: true, body: `
${S(Q_SEQ, { max: 1.25 })}
${P(O.seq, { hl: [3, 5] })}
${p('No index on <code class="i">email</code> yet, so PostgreSQL has no choice: <b>read every row and test it</b>. <code class="i">EXPLAIN ANALYZE</code> really runs the query and reports what happened. Look at the highlighted lines: a <b>Seq Scan</b> that inspected 500,000 rows and <b>threw away 499,999</b> to find one.', 22)}` },

  { t: 'Read the plan line by line', to: true, giua: true, body: `
${cards([['Seq Scan on event', 'The <b>access method</b>: sequential scan, top to bottom. On a big table this is what “slow” looks like.'],
['cost=0.00..14187.00', 'The planner’s <b>estimate</b>, in arbitrary units (startup..total). Used to <b>compare plans</b> — not milliseconds.'],
['actual time=21.812..43.624', 'Real milliseconds of <b>this run</b> (first row..last row) — there because of <code class="i">ANALYZE</code>. Varies run to run.'],
['Rows Removed by Filter: 499999', 'The tell-tale sign: <b>all 500,000 rows</b> were examined to return one. Pure waste.']], 2)}
${box('Two words', `${kw('EXPLAIN', 'show the plan, do not run')} &nbsp; ${kw('EXPLAIN ANALYZE', 'run it, show plan + real numbers')} — Chapter 10 reads plans in depth; here you need just these four lines.`, 'lam')}` },

  { t: 'Count the pages: EXPLAIN (ANALYZE, BUFFERS)', giua: true, body: `
${S(`EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM event WHERE email = 'user250000@example.com';`, { max: 1.2 })}
${P(O.seqbuf, { hl: [6] })}
${two(box('Buffers: shared hit=7937', '<b>7,937 = every page of the table.</b> “hit” = the page was already in PostgreSQL’s memory; “read” = it had to be fetched from disk first.', ''), box('Why count pages, not ms?', 'Milliseconds change with cache, machine, load. <b>Pages read</b> is the honest measure of work — and it is what an index reduces.', 'lam'))}` },

  { t: 'Build an index', body: `
${two(`<div>${S(`CREATE INDEX idx_event_email ON event(email);

SELECT pg_size_pretty(pg_relation_size('idx_event_email'))
       AS index_size,
       pg_relation_size('idx_event_email') / 8192
       AS index_pages;`, { w: 600 })}
${P(`${O.mkidx}\n\n${O.idxsize}`, { w: 600, hl: [2] })}</div>`,
`<ul style="font-size:22px">
<li><code class="i">CREATE INDEX name ON table(column)</code> — the default type is <b>B-tree</b></li>
<li>It is a <b>separate file</b>: every <code class="i">email</code>, <b>sorted</b>, each with a pointer to its row</li>
<li>Building it read the whole table once and sorted 500,000 keys: <b>~1.8 s</b> here, <b>19 MB</b> (2,482 pages)</li>
<li>From now on PostgreSQL keeps it up to date on every write — automatically</li>
</ul>`, 'r64')}
${box('Naming habit', 'Name indexes <code class="i">idx_&lt;table&gt;_&lt;columns&gt;</code>. When you read a plan later, the name tells you what it is.', 'lam')}` },

  { t: 'Same query, now an Index Scan', body: `
${S(`EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM event WHERE email = 'user250000@example.com';`, { max: 1.15 })}
${P(O.idxbuf, { hl: [3, 4, 5] })}
${barsPages({ rows: [['Seq Scan', 7937, '#c0392b', '88.2 ms · read the whole table'], ['Index Scan', 4, '#2f7d4f', '0.011 ms · 4 pages']], max: 7937, lw: 210 })}
${p('<b>Index Scan</b> replaced Seq Scan; <b>Index Cond</b> replaced Filter (the index answers the condition); no rows removed. <b>7,937 pages → 4 pages.</b>', 21)}` },

  { t: 'Why only 4 pages? Walking the B-tree', body: `
${btreePic()}
${p('① the <b>root</b> page sends us to the right internal page, ② the <b>internal</b> page to the right leaf, ③ the <b>leaf</b> holds the key and the row’s address (TID), ④ one <b>table</b> page. 4 pages — exactly <code class="i">Buffers: shared hit=4</code>.', 20)}` },

  { t: 'Our real tree, measured with pageinspect', body: `
${two(`<div>${P(`SELECT root, level FROM bt_metap('idx_event_email');\n${O.metap}`, { w: 520 })}
${P(`-- pages at each level\n${O.levels}`, { w: 520, hl: [4, 5, 6] })}</div>`,
`<div>${P(`-- separator keys in the root page\n${O.rootkeys}`, { w: 540 })}
${box('Read it', 'Root page <b>164</b>, level <b>2</b> ⇒ 3 levels. 1 root → 16 internal → <b>2,464 leaves</b>. The root only holds “signposts”: emails <b>≥ user244335…</b> go to child 6. Text sorts as text: <code class="i">user82</code> comes after <code class="i">user54133</code>.', 'lam')}</div>`)}
${p(`${c('pageinspect')} is a standard extension for looking inside pages — used here only to show you the tree is real.`, 18)}` },

  { t: 'Why it stays fast at any size', to: true, body: `
${two(`<ul>
<li>Each page holds <b>hundreds</b> of keys, so each level <b>multiplies</b> the reach by ~200</li>
<li>To find one key: <b>one page per level</b> + one table page</li>
<li>The tree stays <b>balanced</b>: when a page fills up it splits; the tree grows taller only at the root, rarely</li>
<li>That is “<b>logarithmic</b>”: 10× more rows ≈ <b>+1 page</b>, not 10× the work</li>
</ul>`, `<div><table class="t" style="font-size:22px"><tr><th>levels</th><th>reach (rough, ~200 keys/page)</th></tr>
<tr><td>2</td><td>≈ 40,000 keys</td></tr><tr><td><b>3</b> (ours)</td><td>≈ 8 million keys</td></tr><tr><td>4</td><td>≈ 1.6 billion keys</td></tr></table>
${box('Compare', 'Seq Scan work grows with the table: 10× rows = 10× pages. B-tree work barely moves.', 'xanh')}</div>`, 'r64')}
${p('Our tree: 1 root → 16 internal → 2,464 leaves holding 500,000 emails (≈ 203 per leaf). The numbers on the right are rough and depend on key size — the shape is what matters.', 20)}` },

  { t: 'Ranges: the leaves are linked', body: `
${leafChain()}
${S(`EXPLAIN (ANALYZE, BUFFERS) SELECT id, email FROM event WHERE id BETWEEN 1000 AND 1100;`, { max: 1.1 })}
${P(O.range, { hl: [3, 5] })}
${p('101 rows for <b>6 pages</b>: 3 to walk down (primary-key index), then read along the leaf and fetch the 3 table pages that hold ids 1000–1100. Ranges, <code class="i">&gt;</code>, <code class="i">&lt;</code>, <code class="i">BETWEEN</code> all work this way.', 20)}` },

  { t: 'Sorted order comes for free', giua: true, body: `
${S(`EXPLAIN ANALYZE SELECT email FROM event ORDER BY email LIMIT 5;`, { max: 1.2 })}
${P(O.c_order, { hl: [3, 4, 5], max: 1.3 })}
${p('(Here and on a few slides below we add <code class="i">COSTS OFF</code> only to shorten the output — the plan is the same.)', 17)}
${two(box('No Sort node', 'The leaves are already sorted, so “first 5 by email” = read the <b>first 5 leaf entries</b> and stop: 0.025 ms. Without an index PostgreSQL would sort 500,000 rows to keep 5.', 'xanh'), box('Index Only Scan · Heap Fetches: 0', 'Only <code class="i">email</code> was asked for, and the index has it — the table was <b>not touched at all</b>. Lesson 9.2 builds on this.', 'lam'))}` },

  { t: 'What a B-tree can answer', to: true, giua: true, body: `
${cards([['=  and  IN (…)', '<code class="i">email = \'x\'</code>, <code class="i">id IN (1, 5, 9)</code> — walk down once per value.'],
['<  >  <=  >=  BETWEEN', 'Walk down to the start, then read along the linked leaves.'],
['ORDER BY … LIMIT', 'Read the leaves in order (forwards or <b>backward</b>) and stop early.'],
['LIKE \'abc%\' (prefix)', 'A prefix is a range: <code class="i">≥ \'abc\'</code> and <code class="i">&lt; \'abd\'</code> — <b>with one catch</b>, next slide.'],
['IS NULL', 'NULLs are stored in the B-tree too (sorted last by default).'],
['Not: LIKE \'%abc\', lower(col)', 'No sorted place to start from — lesson 9.3 shows the fixes.']], 3)}
${box('Rule of thumb', 'B-tree is the default type and the right answer about <b>95%</b> of the time. Lesson 9.4 covers the others.', 'lam')}` },

  { t: 'The catch with LIKE \'prefix%\'', body: `
${P(`pgcourse=# EXPLAIN (ANALYZE, COSTS OFF) SELECT id FROM event WHERE email LIKE 'user25000%';\n${O.c_like1}`, { hl: [4, 6], max: 1.0 })}
${P(`pgcourse=# SELECT datcollate FROM pg_database WHERE datname = current_database();\n${O.coll}`, { hl: [4], max: 1.0 })}
${box('Why the index on email is skipped', 'This database sorts text by <code class="i">en_US.utf8</code> rules (language-aware sorting). Under those rules the planner cannot turn “starts with <code class="i">user25000</code>” into a range of the index, so it falls back to reading the whole table: <b>Seq Scan, 32.6 ms</b>, 499,989 rows thrown away.', 'do2')}` },

  { t: 'Fix: an index in plain byte order (text_pattern_ops)', body: `
${P(`pgcourse=# CREATE INDEX idx_event_email_pattern ON event (email text_pattern_ops);\nCREATE INDEX\npgcourse=# EXPLAIN (ANALYZE, COSTS OFF) SELECT id FROM event WHERE email LIKE 'user25000%';\n${O.c_like2}`, { hl: [6, 7], max: 1.0 })}
${two(box('Now it is a range', '<code class="i">text_pattern_ops</code> compares plain bytes, so “starts with <code class="i">user25000</code>” = <code class="i">≥ \'user25000\' AND &lt; \'user25001\'</code> — the <b>Index Cond</b> line. 32.6 ms → <b>0.07 ms</b>.', 'xanh'),
box('Or: the C collation', 'A database (or column) created with <code class="i">COLLATE "C"</code> sorts by bytes already, and a plain index serves prefix LIKE. Check yours with <code class="i">SELECT datcollate …</code> before assuming.', 'lam'))}
${p('Keep the normal index too if you need <code class="i">ORDER BY email</code> or <code class="i">&lt;</code> / <code class="i">&gt;</code> in language order: a <code class="i">text_pattern_ops</code> index serves only LIKE \'prefix%\' and equality.', 19)}` },

  { t: 'Three (and a half) ways to read a table', body: `
${scanTypes()}
${p('<b>Seq Scan</b> when most rows are needed or the table is tiny. <b>Index Scan</b> for a few rows. <b>Bitmap Heap Scan</b> for “some hundreds, spread out”: collect the page numbers from the index first, then read each page <b>once, in physical order</b>. <b>Index Only Scan</b> when the index alone has every column needed.', 21)}` },

  { t: 'Bitmap Heap Scan in a real plan', body: `
${S(`CREATE INDEX idx_event_user ON event(user_id);
EXPLAIN (ANALYZE, BUFFERS) SELECT sum(amount) FROM event WHERE user_id = 42;`, { max: 1.1 })}
${P(O.bitmap, { hl: [3, 5, 7, 8] })}
${p('Read it bottom-up: the <b>Bitmap Index Scan</b> reads 3 index pages and marks the pages holding user 42’s 500 rows; the <b>Bitmap Heap Scan</b> visits those <b>500 pages</b> once each (<code class="i">Heap Blocks: exact=500</code>) and re-checks the condition. 503 pages instead of 7,937.', 20)}` },

  { t: 'You already had indexes: every primary key', body: `
${two(P(`pgcourse=# \\di\n${O.di}`, { w: 560, max: 1 }),
box('Since Chapter 3', '<code class="i">PRIMARY KEY</code> and <code class="i">UNIQUE</code> create a <b>unique B-tree index</b> automatically (<code class="i">event_pkey</code>). That is how they check uniqueness fast — and why a lookup by <code class="i">id</code> was always cheap. Lesson 9.4 returns to unique indexes.', 'lam'), 'r64')}
${P(`pgcourse=# EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT * FROM event WHERE id = 42;\n${O.c_pk}`, { hl: [4, 6], max: 1.05 })}` },

  { t: 'Trap: creating an index ≠ the planner using it', body: `
${vsd(`<p style="font-size:20px;margin:0 0 6px">Tiny table (10 rows, 1 page):</p>${P(`EXPLAIN SELECT * FROM tiny WHERE id = 7;\n${O.tiny1}`, { w: 500 })}
<p style="font-size:20px;margin:6px 0">Function on the column:</p>${P(`EXPLAIN SELECT * FROM event\nWHERE lower(email) = 'user250000@example.com';\n${O.lower91}`, { w: 500 })}`,
`<p style="font-size:20px;margin:0 0 6px">Forcing the index anyway (test only!):</p>${P(`SET enable_seqscan = off;\nEXPLAIN SELECT * FROM tiny WHERE id = 7;\n${O.tiny2}`, { w: 500 })}
<ul style="font-size:20px;margin-top:8px"><li>cost <b>8.15</b> vs <b>1.12</b>: on one page, the scan <b>is</b> cheaper — the planner was right</li><li><code class="i">lower(email)</code> is not what the index stores ⇒ unusable (9.3)</li><li><b>Only EXPLAIN tells you</b>: look for the index name</li></ul>`, '✗ index exists, not used', '✓ what is really going on')}` },

  { t: 'In practice: indexes in Prisma (CuongThai’s schema)', body: `
${two(S(`model MusicLike {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  trackId   Int      @map("track_id")
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, trackId], name: "music_likes_user_track_unique")
  @@index([trackId], name: "idx_music_likes_track")
  @@index([userId, createdAt(sort: Desc)],
          name: "idx_music_likes_user_recent")
  @@map("music_likes")
}`, { lang: 'typescript', w: 660 }), S(`-- what prisma migrate writes
CREATE UNIQUE INDEX
  "music_likes_user_track_unique"
  ON "music_likes"("user_id", "track_id");
CREATE INDEX "idx_music_likes_track"
  ON "music_likes"("track_id");
CREATE INDEX "idx_music_likes_user_recent"
  ON "music_likes"("user_id",
                   "created_at" DESC);`, { w: 440 }), 'r64')}
${p('<code class="i">@id</code> and <code class="i">@unique</code> get a B-tree for free; <code class="i">@@index</code> adds one. The live schema of this site has <b>807</b> <code class="i">@@index</code> lines. The habit: every query a page runs on a big table gets an <code class="i">EXPLAIN</code> before it ships.', 20)}
${box('Watch out', 'A <b>foreign key</b> (<code class="i">@relation(fields: [userId] …)</code>) does <b>not</b> create an index on the child column — that is why <code class="i">idx_music_likes_track</code> is written by hand. Lesson 9.2 checks this on CT Shop.', 'do2')}` },

  { t: 'Exercise — predict before you run', to: true, giua: true, body: `
<ol>
<li>How many pages does <code class="i">SELECT * FROM event WHERE id = 250000</code> read?</li>
<li>And <code class="i">WHERE email = 'nobody@example.com'</code> — an email that does <b>not</b> exist?</li>
<li>Does <code class="i">SELECT email FROM event ORDER BY email DESC LIMIT 3</code> need a Sort node?</li>
</ol>
${box('How', 'Write your guess first, then check with <code class="i">EXPLAIN (ANALYZE, BUFFERS)</code> on the event table (script in the lesson). Hint: draw the 4 boxes of the B-tree walk.', '')}` },

  { t: 'Solution', body: `
${P(`pgcourse=# -- 1 · WHERE id = 250000\n${O.c_ex1a}`, { hl: [4, 6], max: 0.8 })}
${P(`pgcourse=# -- 2 · WHERE email = 'nobody@example.com'\n${O.c_ex1b}`, { hl: [4, 6], max: 0.8 })}
${two(P(`pgcourse=# -- 3 · ORDER BY email DESC LIMIT 3\n${O.c_ex1c}`, { hl: [5], max: 0.9, w: 560 }),
box('Answers', '1 → <b>4</b> (3 index levels + 1 table page). 2 → <b>3</b>: walk down, find nothing, never touch the table. 3 → <b>no Sort</b>: <code class="i">Index Only Scan Backward</code>.', 'xanh'))}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why is “pages read” a better measure than milliseconds?</li>
<li>Name the 4 pages an Index Scan read to find one email.</li>
<li>Your new index does not show up in the plan of a 20-row table. Bug?</li>
</ol>
${box('Answers', '1 · Milliseconds depend on cache, machine and load; pages are the actual work, and they are stable. &nbsp;2 · Root → internal → leaf (index) → one table page. &nbsp;3 · No: on one page a Seq Scan is genuinely cheaper; the planner is right. It will use the index once the table grows.', 'xanh')}` },

  { t: 'Summary & next', to: true, body: `
<ul>
<li>A table is pages; without an index a lookup reads <b>all</b> of them (Seq Scan, 7,937 pages)</li>
<li>An index is a separate, sorted B-tree: root → internal → leaf → row. Ours: <b>4 pages</b></li>
<li><code class="i">EXPLAIN (ANALYZE, BUFFERS)</code>: look for the scan type, <code class="i">Index Cond</code> vs <code class="i">Filter</code>, rows removed, buffers</li>
<li>B-tree serves =, ranges, ORDER BY, prefix LIKE (watch the collation); PKs are indexed already</li>
</ul>
${box('Next — 9.2', 'Which columns to index, <b>multi-column</b> indexes and why their <b>column order</b> decides everything, and <b>covering</b> indexes that never touch the table.', 'lam')}` },
]);
