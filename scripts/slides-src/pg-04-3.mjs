/**
 * pg-04-3 — PostgreSQL · Chapter 4 · Lesson 4.3 "ORDER BY, LIMIT/OFFSET & DISTINCT" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s04-chen-truy-van.mjs › postgresql-4-3-order-limit-distinct. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-04-3.out.txt). Bổ sung: NULL xếp ở đâu (PG khác SQL Server), không có ORDER BY ⇒ không có thứ tự (chạy thật sau UPDATE),
 * công thức OFFSET theo trang, khoá sắp không duy nhất làm trang lặp/rớt dòng (demo thật), phân trang keyset + đo 500.000 dòng (53 ms vs 0,04 ms; EXPLAIN BUFFERS),
 * DISTINCT/count(DISTINCT), DISTINCT ON, FETCH FIRST … WITH TIES, đối chiếu SQL Server (TOP, OFFSET FETCH, NULL đầu hay cuối), Prisma cursor, CT Shop.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { bangChuyen, offsetKeyset, trangDong } from './pg-04-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-04-3', code: 'PG 4.3', title: 'ORDER BY, LIMIT/OFFSET & DISTINCT', sub: 'Sort, page, and de-duplicate' };

export const slides = lamDeck({ chuong: 'Chapter 4 — Inserting & querying data', bai: '4.3' }, [
  { cover: true, t: 'ORDER BY, LIMIT/OFFSET<br>& DISTINCT', sub: 'Put rows in order, cut them into pages, remove duplicates.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>ORDER BY</b> — one or many keys, ASC / DESC, and where <b>NULL</b> goes</li>
<li><b>No ORDER BY = no order</b> — why a result can change by itself</li>
<li><b>LIMIT / OFFSET</b> paging — and the bug that repeats or skips rows</li>
<li><b>Keyset pagination</b> — jump to a page instead of counting to it</li>
<li><b>DISTINCT</b> and <b>DISTINCT ON</b> — “latest row per group”</li>
</ul>
${box('SQL Server developer?', '<code class="i">TOP n</code> → <code class="i">LIMIT n</code> · <code class="i">OFFSET … FETCH</code> works in both · and <b>NULL sorts the other way round</b> (first in SQL Server, last in PostgreSQL).', 'lam')}` },

  { t: 'Everyday example first: the canteen queue', giua: true, body: `
${two(tbl(['who', 'height'], [['Mai', '158'], ['An', '172'], ['Binh', '165'], ['Chi', '150']], { cap: 'no ORDER BY — any order' }),
tbl(['who', 'height'], [['An', '172'], ['Binh', '165'], ['Mai', '158'], ['Chi', '150']], { cap: 'ORDER BY height DESC — tallest first', hl: [0] }))}
<p style="font-size:23px;margin:0">A table is a <b>pile</b> of rows, not a line. To get a line, you must say how to line them up: <code class="i">ORDER BY</code>. Then <code class="i">LIMIT 2</code> means “the first two in that line”, <code class="i">OFFSET 2</code> means “skip the first two”. And <code class="i">DISTINCT</code> sends home anyone who is a duplicate.</p>` },

  { t: 'ORDER BY: one or many sort keys', body: `
${zm(run(`SELECT title, author, views FROM note
ORDER BY author ASC, views DESC;`, `        title         | author | views
----------------------+--------+-------
 Intro to SQL         | Cuong  |   120
 Indexes deep dive    | Cuong  |    90
 Backup strategy      | Cuong  |    12
 Timezones done right | Lan    |    45
 JSONB in practice    | Lan    |    30
 My reading list      | Minh   |     8
 Quick draft          | Minh   |     0
(7 rows)`, { hl: [2], hlOut: [3, 4, 5, 6, 7, 8, 9] }), 1.15)}
<p style="font-size:21px;margin:0">First key <code class="i">author</code> groups the rows A→Z; <b>inside each author</b> the second key <code class="i">views DESC</code> breaks the ties. <code class="i">ASC</code> is the default and can be left out.</p>` },

  { t: 'Where does NULL go?', body: `
${zm(run(`SELECT title, tag FROM note ORDER BY tag;           -- ASC
SELECT title, tag FROM note ORDER BY tag DESC;`, `        title         | tag
----------------------+------
 Timezones done right | date
 Backup strategy      | ops
 Intro to SQL         | sql
 JSONB in practice    | sql
 Indexes deep dive    | sql
 My reading list      |
 Quick draft          |
(7 rows)

        title         | tag
----------------------+------
 Quick draft          |
 My reading list      |
 Intro to SQL         | sql
 ...`, { hlOut: [8, 9, 14, 15] }), 0.9)}
${box('PostgreSQL treats NULL as the LARGEST value', 'ASC → NULL <b>last</b>; DESC → NULL <b>first</b>. SQL Server is the opposite (NULL is the <i>smallest</i>) — a ported report can silently reorder.', 'do2')}` },

  { t: 'NULLS FIRST / NULLS LAST', body: `
${zm(run(`SELECT title, tag FROM note ORDER BY tag NULLS FIRST;
SELECT title, tag FROM note ORDER BY tag DESC NULLS LAST;`, `        title         | tag
----------------------+------
 My reading list      |
 Quick draft          |
 Timezones done right | date
 Backup strategy      | ops
 JSONB in practice    | sql
 Indexes deep dive    | sql
 Intro to SQL         | sql
(7 rows)

        title         | tag
----------------------+------
 JSONB in practice    | sql
 Indexes deep dive    | sql
 Intro to SQL         | sql
 Backup strategy      | ops
 Timezones done right | date
 Quick draft          |
 My reading list      |
(7 rows)`, { hlOut: [3, 4, 14, 15, 16] }), 0.88)}
<p style="font-size:20px;margin:0">Say it out loud whenever the column allows NULL and the position matters: <code class="i">NULLS FIRST</code> or <code class="i">NULLS LAST</code>. Same wording works in both directions.</p>` },

  { t: 'Sort by an expression or an alias', body: `
${zm(run(`SELECT title, views, length(title) AS len
FROM note ORDER BY len DESC, title LIMIT 3;`, `        title         | views | len
----------------------+-------+-----
 Timezones done right |    45 |  20
 Indexes deep dive    |    90 |  17
 JSONB in practice    |    30 |  17
(3 rows)`, { hlOut: [3, 4, 5] }), 1.3)}
${two(box('ORDER BY can use the alias', 'It runs <b>after</b> SELECT (lesson 4.2), so <code class="i">len</code> exists. WHERE could not use it.', 'xanh'),
box('Add a tie-breaker', 'Two titles have 17 characters: the second key <code class="i">title</code> decides. A good ORDER BY ends with something <b>unique</b> — you will see why in a minute.', 'info'))}` },

  { t: 'No ORDER BY = no order', body: `
${zm(two(`<div><div class="tcap">① before</div>` + run(`SELECT id, title FROM draw;`, ` id | title
----+-------
  1 | A
  2 | B
  3 | C
  4 | D
(4 rows)`, { sm: true }) + `</div>`, `<div><div class="tcap">② after one UPDATE — same query</div>` + run(`UPDATE draw SET title = 'B!' WHERE id = 2;
SELECT id, title FROM draw;`, ` id | title
----+-------
  1 | A
  3 | C
  4 | D
  2 | B!
(4 rows)`, { sm: true, hlOut: [7] }) + `</div>`), 1.05)}
<p style="font-size:22px;margin:0">Row <code class="i">B</code> jumped to the end: rows come back in the <b>cheapest</b> order (as stored on disk), and an UPDATE writes a new copy of the row elsewhere. It looks stable in testing — and changes after an update, a VACUUM, or a new plan.</p>
${box('Rule', 'If order matters to the user, <b>always</b> write ORDER BY. “It came back sorted” on your laptop is luck.', 'do2')}` },

  { t: 'LIMIT and OFFSET', body: `
${zm(run(`SELECT title, views FROM note ORDER BY views DESC LIMIT 3;
SELECT title, views FROM note ORDER BY views DESC LIMIT 3 OFFSET 3;`, `        title         | views
----------------------+-------
 Intro to SQL         |   120
 Indexes deep dive    |    90
 Timezones done right |    45
(3 rows)

       title       | views
-------------------+-------
 JSONB in practice |    30
 Backup strategy   |    12
 My reading list   |     8
(3 rows)`, { hlOut: [3, 4, 5, 11, 12, 13] }), 1.0)}
<p style="font-size:21px;margin:0"><code class="i">LIMIT n</code> = at most n rows. <code class="i">OFFSET m</code> = skip the first m. Together they turn a sorted list into <b>pages</b>. The standard spelling also works: <code class="i">OFFSET 5 ROWS FETCH FIRST 2 ROWS ONLY</code>.</p>` },

  { t: 'From page number to OFFSET', giua: true, body: `
${trangDong()}
<p style="font-size:23px;margin:0">With a page size of 3: page 1 is <code class="i">OFFSET 0</code>, page 2 is <code class="i">OFFSET 3</code>, page 3 is <code class="i">OFFSET 6</code> … In code: <code class="i">OFFSET (page − 1) * size</code>. This only makes sense on a <b>stable sorted</b> list — next slide.</p>` },

  { t: 'The paging bug: ties in the sort key', body: `
${two(tbl(['id', 'title', 'created_at'], [['1', 'A', '2026-05-01'], ['2', 'B', '2026-05-01'], ['3', 'C', '2026-05-01'], ['4', 'D', '2026-05-01'], ['5', 'E', '2026-05-01'], ['6', 'F', '2026-05-01']], { cap: 'six posts, same date' }),
`<ol style="font-size:21px;margin:0"><li>You open <b>page 1</b> (<code class="i">ORDER BY created_at LIMIT 3</code>): A, B, C.</li><li>Meanwhile two posts are edited (A, B).</li><li>You open <b>page 2</b> (<code class="i">OFFSET 3</code>): the ties re-shuffle …</li></ol>`, 'r46')}
${zm(run(`SELECT id, title FROM post ORDER BY created_at LIMIT 3 OFFSET 3;   -- page 2`, ` id | title
----+-------
  6 | F
  2 | B!
  1 | A!
(3 rows)`, { hlOut: [4, 5] }), 0.95)}
<p style="font-size:20px;margin:0">A and B appear <b>again</b>; D and E were <b>never shown</b> — “the list skips items”.</p>` },

  { t: 'The fix: end ORDER BY with a unique column', body: `
${zm(run(`SELECT id, title FROM post
ORDER BY created_at, id LIMIT 3 OFFSET 3;`, ` id | title
----+-------
  4 | D
  5 | E
  6 | F
(3 rows)`, { hlOut: [3, 4, 5] }), 1.3)}
${two(box('Why it works', 'Adding <code class="i">id</code> (unique) makes the order <b>total</b>: no two rows tie, so every page boundary is the same every time.', 'xanh'),
box('Rule', 'Always finish ORDER BY with the primary key (or another unique column): <code class="i">ORDER BY created_at DESC, id DESC</code>. One extra word — and the next slide needs it.', 'lam'))}` },

  { t: 'Keyset pagination: jump instead of count', body: `
${zm(run(`SELECT id, title, created_at FROM note
ORDER BY created_at DESC, id DESC LIMIT 3;

SELECT id, title, created_at FROM note
WHERE (created_at, id) < ('2026-03-20', 5)
ORDER BY created_at DESC, id DESC LIMIT 3;`, ` id |      title      | created_at
----+-----------------+------------
  7 | Quick draft     | 2026-04-10
  6 | Backup strategy | 2026-04-02
  5 | My reading list | 2026-03-20
(3 rows)

 id |        title         | created_at
----+----------------------+------------
  4 | JSONB in practice    | 2026-03-05
  3 | Timezones done right | 2026-03-01
  2 | Indexes deep dive    | 2026-02-14
(3 rows)`, { hl: [5], hlOut: [5, 11, 12, 13] }), 0.92)}
<p style="font-size:20px;margin:0">Remember the <b>last row</b> of the current page <code class="i">(2026-03-20, 5)</code>; the next page is “everything <b>after</b> it”. A row comparison <code class="i">(a, b) &lt; (x, y)</code> is exactly why we needed the unique tie-breaker.</p>` },

  { t: 'OFFSET reads and throws away', giua: true, body: `
${offsetKeyset()}
<p style="font-size:22px;margin:0">To serve page 100,000, <code class="i">OFFSET 399980</code> makes the server <b>produce and discard ~400,000 rows</b> — the cost grows with the page number. Keyset starts <b>at</b> the cursor through the index — the cost does not depend on how deep you are.</p>` },

  { t: 'Measured on 500,000 rows', body: `
${zm(run(`EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF)
SELECT id, title FROM feed
ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 400000;`, ` Limit (actual rows=20 loops=1)
   Buffers: shared hit=2945 read=1532
   ->  Index Scan using feed_created_idx on feed
         (actual rows=400020 loops=1)
 Execution Time: 53.424 ms`, { hlOut: [3, 4, 5] }), 1.0)}
${zm(run(`... WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC LIMIT 20;`, ` Limit (actual rows=20 loops=1)
   Buffers: shared hit=3 read=1
   ->  Index Scan using feed_created_idx on feed
         (actual rows=20 loops=1)
 Execution Time: 0.036 ms`, { hlOut: [3, 4, 5] }), 1.0)}
<p style="font-size:20px;margin:0"><b>400,020 rows read vs 20</b> · <b>4,477 buffers vs 4</b> · <b>53 ms vs 0.04 ms</b> — about 1,500× — on a warm laptop. Plans (EXPLAIN) are Chapter 10; for now just read “actual rows”.</p>` },

  { t: 'DISTINCT: remove duplicate rows', body: `
${zm(run(`SELECT DISTINCT tag FROM note ORDER BY tag NULLS LAST;
SELECT DISTINCT author, pinned FROM note ORDER BY author, pinned;
SELECT count(DISTINCT tag) AS distinct_tags, count(tag) AS non_null,
       count(*) AS all_rows FROM note;`, ` tag
------
 date
 ops
 sql

(4 rows)

 author | pinned
--------+--------
 Cuong  | f
 Cuong  | t
 Lan    | f
 Minh   | f
(4 rows)

 distinct_tags | non_null | all_rows
---------------+----------+----------
             3 |        5 |        7
(1 row)`, { hlOut: [7, 15, 24] }), 0.85)}
<p style="font-size:19px;margin:0">Four <code class="i">sql</code> notes collapse into one row; NULL counts as <b>one</b> group (the empty row). <code class="i">DISTINCT a, b</code> compares the <b>whole combination</b>. <code class="i">count(DISTINCT tag)</code> ignores NULL: 3.</p>` },

  { t: 'DISTINCT ON: the newest row per group', body: `
${zm(run(`SELECT DISTINCT ON (author) author, title, created_at
FROM note
ORDER BY author, created_at DESC;`, ` author |       title       | created_at
--------+-------------------+------------
 Cuong  | Backup strategy   | 2026-04-02
 Lan    | JSONB in practice | 2026-03-05
 Minh   | Quick draft       | 2026-04-10
(3 rows)`, { hl: [1, 3], hlOut: [3, 4, 5] }), 1.25)}
${two(box('How it works', 'Sort by <code class="i">author, created_at DESC</code>; then keep the <b>first row of each author</b> — the newest. The ORDER BY <b>must start with</b> the DISTINCT ON columns.', 'info'),
box('Everyday uses', 'Last message per chat · latest price per product · most recent login per user. Only in PostgreSQL — in SQL Server you would use <code class="i">ROW_NUMBER()</code>.', 'xanh'))}` },

  { t: 'The full order of work', body: `
${bangChuyen([['FROM', 'which table'], ['WHERE', 'keep TRUE rows'], ['SELECT', 'compute columns'], ['DISTINCT', 'drop duplicates'], ['ORDER BY', 'sort'], ['LIMIT', 'cut']], { hi: -1 })}
${zm(run(`SELECT DISTINCT tag FROM note
WHERE views >= 10 ORDER BY tag LIMIT 2;`, ` tag
------
 date
 ops
(2 rows)`, { hlOut: [3, 4] }), 1.2)}
<p style="font-size:20px;margin:0">Walk it: 7 rows → WHERE keeps 5 → SELECT tag → DISTINCT leaves sql, date, ops → ORDER BY → date, ops, sql → LIMIT 2 → <b>date, ops</b>. Written order and run order differ.</p>` },

  { t: 'Coming from SQL Server?', body: `
<div style="zoom:1.12"><table class="t">
<tr><th style="width:230px">Task</th><th>SQL Server (T-SQL)</th><th>PostgreSQL</th></tr>
<tr><td>First n rows</td><td><code class="i">SELECT TOP 3 …</code></td><td><code class="i">… LIMIT 3</code> (or <code class="i">FETCH FIRST 3 ROWS ONLY</code>)</td></tr>
<tr><td>Skip and take</td><td><code class="i">OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY</code></td><td>same — or <code class="i">LIMIT 3 OFFSET 3</code></td></tr>
<tr><td>Ties at the cut</td><td><code class="i">TOP 1 WITH TIES</code></td><td><code class="i">FETCH FIRST 1 ROWS WITH TIES</code></td></tr>
<tr><td>NULL when ASC</td><td><b>first</b> (smallest)</td><td><b>last</b> (largest) — use NULLS FIRST/LAST</td></tr>
<tr><td>Newest per group</td><td><code class="i">ROW_NUMBER() OVER (…) = 1</code></td><td><code class="i">DISTINCT ON (…)</code></td></tr>
</table></div>` },

  { t: 'FETCH FIRST … WITH TIES', body: `
${zm(run(`SELECT title, pinned FROM note
ORDER BY pinned DESC FETCH FIRST 1 ROWS WITH TIES;`, `      title      | pinned
-----------------+--------
 Backup strategy | t
 Intro to SQL    | t
(2 rows)`, { hlOut: [3, 4] }), 1.3)}
<p style="font-size:22px;margin:0">“The top 1” is a <b>tie</b> between two pinned notes. <code class="i">WITH TIES</code> keeps every row that ties with the last one — so you get 2 rows, not an arbitrary 1. It needs an ORDER BY.</p>` },

  { t: 'Real world (1): the feed on cuongthai.com', body: `
${two(`<div>` + sql(`SELECT id, title, created_at
FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;`, { sm: true }) + `<p style="font-size:20px;margin:8px 0 0">The shape of the news feed: newest first, unique tie-breaker, 20 per page.</p></div>`,
`<div>` + sql(`prisma.post.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastId },
  orderBy: [{ createdAt: 'desc' },
            { id: 'desc' }],
})`, { sm: true, lang: 'typescript' }) + `</div>`)}
${box('Cursor = keyset', 'Prisma\'s <code class="i">cursor</code> is keyset pagination. This site moved its hot, deep-scroll lists away from big <code class="i">OFFSET</code>: about <b>100 ms</b> at deep offsets down to <b>under 1 ms</b> with a cursor.', 'xanh')}` },

  { t: 'Real world (2): CT Shop', body: `
${zm(run(`SELECT id, name, price FROM product ORDER BY price DESC LIMIT 3;
SELECT DISTINCT ON (category_id) category_id, name, price
FROM product ORDER BY category_id, price DESC LIMIT 4;`, `  id |            name             |   price
----+-----------------------------+-----------
 34 | Máy tính Casio FX-880BTG    | 790000.00
 31 | Máy tính Casio FX-580VN X   | 705000.00
 30 | Sổ tay Moleskine Classic A5 | 590000.00
(3 rows)

 category_id |                  name                   |   price
-------------+-----------------------------------------+-----------
           5 | Bút bi Thiên Long TL-079 (hộp 20 cây)   |  78000.00
           6 | Bút chì màu Faber-Castell 24 màu        | 125000.00
           7 | Bút dạ quang Stabilo Boss Pastel (bộ 6) | 129000.00
           8 | Lốc 10 vở Hồng Hà 96 trang              | 105000.00
(4 rows)`, { hlOut: [3, 4, 5, 11, 12, 13, 14] }), 0.92)}
<p style="font-size:20px;margin:0">Top 3 priciest products, and the <b>priciest product in each category</b> (DISTINCT ON) — a catalogue page in two queries.</p>` },

  { t: 'Your turn: newest note per author', body: `
<p style="margin:0">List the <b>newest note of each author</b>, and show the authors with the <b>most recent activity first</b>.</p>
${zm(run(`SELECT title, author, created_at FROM (
  SELECT DISTINCT ON (author) title, author, created_at
  FROM note ORDER BY author, created_at DESC
) t ORDER BY created_at DESC;`, `       title       | author | created_at
-------------------+--------+------------
 Quick draft       | Minh   | 2026-04-10
 Backup strategy   | Cuong  | 2026-04-02
 JSONB in practice | Lan    | 2026-03-05
(3 rows)`, { hlOut: [3, 4, 5] }), 1.25)}
<p class="nho">Try it first. Hint: DISTINCT ON forces ORDER BY to start with <code class="i">author</code>, so a second ORDER BY on the outside re-sorts the three winners.</p>` },

  { t: 'Self-check — pause the video and answer', to: true, body: `
${steps([
    'Where does NULL appear with <code class="i">ORDER BY tag</code> and with <code class="i">ORDER BY tag DESC</code> in PostgreSQL?',
    'Why can <code class="i">LIMIT 3 OFFSET 3</code> show the same row on two pages? How do you fix it?',
    'Why is <code class="i">OFFSET 400000</code> slow and keyset fast?',
  ])}
${box('Answers', `<ol style="margin:0;font-size:21px"><li>NULL is the largest value: <b>last</b> with ASC, <b>first</b> with DESC (override with NULLS FIRST/LAST).</li>
<li>Ties in the sort key re-shuffle when rows change. End ORDER BY with a unique column (id).</li>
<li>OFFSET reads and discards every skipped row; keyset starts at the cursor through the index.</li></ol>`, 'xanh')}` },

  { t: 'Summary', to: true, body: `
<ul>
<li><code class="i">ORDER BY</code> multi-key; NULL is largest (use <code class="i">NULLS FIRST/LAST</code>); <b>no ORDER BY = no order</b></li>
<li><code class="i">LIMIT/OFFSET</code> for pages — <b>always end ORDER BY with a unique key</b></li>
<li>Deep pages: <b>keyset</b> <code class="i">WHERE (a, id) &lt; (…)</code> instead of big OFFSET</li>
<li><code class="i">DISTINCT</code> · <code class="i">DISTINCT ON</code> for “newest per group”</li>
</ul>
${box('Next: 4.4 UPDATE & DELETE — safely', 'You can read the data. Now change it without disasters: WHERE, RETURNING, BEGIN / ROLLBACK, and the “forgot WHERE” nightmare. Then practise on <b>Code Lab → PostgreSQL</b>.', 'lam')}` },
]);
