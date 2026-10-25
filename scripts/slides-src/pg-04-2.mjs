/**
 * pg-04-2 — PostgreSQL · Chapter 4 · Lesson 4.2 "SELECT & WHERE: getting exactly the rows you want" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s04-chen-truy-van.mjs › postgresql-4-2-select-where. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-04-2.out.txt). Bổ sung: chọn cột/chọn dòng (hình), AND ràng hơn OR (ví dụ ra KHÁC nhau), trục số BETWEEN,
 * _ và %, ba đèn TRUE/FALSE/UNKNOWN + bảng chân trị, IS DISTINCT FROM, COALESCE, alias không dùng được trong WHERE (thứ tự thực thi),
 * đối chiếu SQL Server (so sánh chuỗi phân biệt hoa/thường, ||, COALESCE, "ident"), ví dụ CT Shop (42 khách không có số điện thoại), Prisma mode: insensitive → ILIKE.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { chonCotDong, trucSo, baDen, chanTri, bangChuyen } from './pg-04-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-04-2', code: 'PG 4.2', title: 'SELECT & WHERE: getting exactly the rows you want', sub: 'Filters, patterns — and the NULL trap' };

const NOTE = [
  ['1', 'Intro to SQL', 'Cuong', 'sql', '120', 'true', '2026-01-10'], ['2', 'Indexes deep dive', 'Cuong', 'sql', '90', 'false', '2026-02-14'],
  ['3', 'Timezones done right', 'Lan', 'date', '45', 'false', '2026-03-01'], ['4', 'JSONB in practice', 'Lan', 'sql', '30', 'false', '2026-03-05'],
  ['5', 'My reading list', 'Minh', null, '8', 'false', '2026-03-20'], ['6', 'Backup strategy', 'Cuong', 'ops', '12', 'true', '2026-04-02'], ['7', 'Quick draft', 'Minh', null, '0', 'false', '2026-04-10'],
];
const tagTbl = (hl = [], cap = 'note (title, tag)') => tbl(['id', 'title', 'tag'], NOTE.map((r) => [r[0], r[1], r[3]]), { cap, hl });

export const slides = lamDeck({ chuong: 'Chapter 4 — Inserting & querying data', bai: '4.2' }, [
  { cover: true, t: 'SELECT & WHERE:<br>getting exactly the rows you want', sub: 'Choose columns, filter rows — and meet the NULL trap.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>SELECT</b> = which <i>columns</i> to show · <b>WHERE</b> = which <i>rows</i> to keep</li>
<li><code class="i">AND</code> · <code class="i">OR</code> · <code class="i">NOT</code> — and why <b>AND binds tighter than OR</b></li>
<li><code class="i">IN</code> · <code class="i">BETWEEN</code> · <code class="i">LIKE</code> / <code class="i">ILIKE</code> — the filter toolbox</li>
<li><b>NULL</b>: three-valued logic and the trap that makes rows <i>vanish</i></li>
<li>The <b>order</b> in which SQL really runs your query</li>
</ul>
${box('SQL Server developer?', 'Most of this is identical. The two surprises: <b>string comparison is case-sensitive</b> in PostgreSQL, and <code class="i">+</code> does not join text (<code class="i">||</code> does).', 'lam')}` },

  { t: 'Everyday example first: asking the librarian', giua: true, body: `
${chonCotDong({ cols: [1, 3], rows: [0, 1] })}
<p style="font-size:23px;margin:0">“Give me the <b>title and the number of views</b> of the notes <b>written by Cuong</b>.” Two decisions: <b>which columns</b> to read (SELECT) and <b>which rows</b> to keep (WHERE). Grey columns and crossed-out rows never reach your result.</p>` },

  { t: 'Projection: choose and compute columns', body: `
${zm(run(`SELECT id, title, views, views * 2 AS double_views
FROM note ORDER BY id LIMIT 3;`, ` id |        title         | views | double_views
----+----------------------+-------+--------------
  1 | Intro to SQL         |   120 |          240
  2 | Indexes deep dive    |    90 |          180
  3 | Timezones done right |    45 |           90
(3 rows)`, { hlOut: [1] }), 1.4)}
${two(box('AS gives a name', '<code class="i">double_views</code> is not stored anywhere — it is <b>computed for each row</b> and named with <code class="i">AS</code>.', 'info'),
box('Same table, any shape', 'You can list columns in any order, repeat them, or compute: <code class="i">views * 2</code>, <code class="i">upper(title)</code>, <code class="i">now()</code>.', 'xanh'))}` },

  { t: 'SELECT * — handy in psql, risky in code', giua: true, body: `
${vsd(
    zm(sql(`SELECT * FROM note;`, { sm: true }), 1.4) + `<ul style="font-size:20px;margin:8px 0 0"><li>Returns <b>every</b> column today — and any column added tomorrow</li><li>Sends data the screen never shows (big text, JSON)</li><li>A schema change can break your app silently</li></ul>`,
    zm(sql(`SELECT id, title, views FROM note;`, { sm: true }), 1.4) + `<ul style="font-size:20px;margin:8px 0 0"><li>Exactly the columns the screen needs</li><li>Less data over the network</li><li>Adding a column cannot surprise you</li></ul>`,
    '✗ In application code', '✓ Name your columns')}
${box('Rule', '<code class="i">SELECT *</code> to <b>explore</b> in psql — fine. In code your app runs every day: list the columns.', 'lam')}` },

  { t: 'WHERE: keep only the rows that match', giua: true, body: `
${zm(run(`SELECT title, author, views
FROM note WHERE author = 'Cuong' AND views > 50 ORDER BY id;`, `       title       | author | views
-------------------+--------+-------
 Intro to SQL      | Cuong  |   120
 Indexes deep dive | Cuong  |    90
(2 rows)`, { hlOut: [3, 4] }), 1.35)}
<table class="t" style="margin-top:6px"><tr><th>=</th><th>&lt;&gt; (or !=)</th><th>&lt;</th><th>&gt;</th><th>&lt;=</th><th>&gt;=</th></tr><tr><td>equal</td><td>not equal</td><td>less</td><td>greater</td><td>at most</td><td>at least</td></tr></table>
<p style="font-size:21px;margin:0"><b>One</b> equals sign for equality (not two, like in JavaScript). <code class="i">AND</code> keeps a row only if <b>both</b> sides are true.</p>` },

  { t: 'AND binds tighter than OR — use brackets', body: `
${zm(run(`SELECT title, author, views FROM note
WHERE author = 'Cuong' OR author = 'Lan' AND views > 50;

SELECT title, author, views FROM note
WHERE (author = 'Cuong' OR author = 'Lan') AND views > 50;`, `       title       | author | views
-------------------+--------+-------
 Intro to SQL      | Cuong  |   120
 Indexes deep dive | Cuong  |    90
 Backup strategy   | Cuong  |    12
(3 rows)

       title       | author | views
-------------------+--------+-------
 Intro to SQL      | Cuong  |   120
 Indexes deep dive | Cuong  |    90
(2 rows)`, { hlOut: [5, 14] }), 1.0)}
<p style="font-size:21px;margin:0">Top query = <code class="i">Cuong</code> <b>OR</b> (<code class="i">Lan AND views &gt; 50</code>) → Cuong's 12-view note sneaks in. Brackets give the meaning you intended. <b>When in doubt, add brackets.</b></p>` },

  { t: 'IN and BETWEEN', body: `
${trucSo()}
${zm(run(`SELECT title, tag FROM note WHERE tag IN ('sql','ops') ORDER BY id;`, `       title       | tag
-------------------+-----
 Intro to SQL      | sql
 Indexes deep dive | sql
 JSONB in practice | sql
 Backup strategy   | ops
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.0)}
<p style="font-size:20px;margin:0"><code class="i">IN (a, b, c)</code> = “equals any of these” — shorter than a chain of <code class="i">OR</code>. <code class="i">BETWEEN lo AND hi</code> includes <b>both ends</b>; for dates use it carefully (next slide).</p>` },

  { t: 'BETWEEN with dates — both ends are in', body: `
${zm(run(`SELECT title, created_at FROM note
WHERE created_at BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY created_at;`, `        title         | created_at
----------------------+------------
 Timezones done right | 2026-03-01
 JSONB in practice    | 2026-03-05
 My reading list      | 2026-03-20
(3 rows)`, { hlOut: [3] }), 1.2)}
${two(box('Inclusive', '<code class="i">2026-03-01</code> is <b>in</b> the result: <code class="i">BETWEEN a AND b</code> means <code class="i">&gt;= a AND &lt;= b</code>.', 'xanh'),
box('Careful with timestamps', 'For a <code class="i">timestamp</code>, <code class="i">BETWEEN … \'2026-03-31\'</code> stops at midnight and misses the last day. Prefer <code class="i">&gt;= start AND &lt; next_day</code> (Chapter 2).', 'do2'))}` },

  { t: 'LIKE and ILIKE: match a pattern', body: `
${zm(run(`SELECT title FROM note WHERE title LIKE  '%sql%';   -- case-sensitive
SELECT title FROM note WHERE title ILIKE '%sql%';   -- ignores case
SELECT title FROM note WHERE title LIKE '_ackup%';`, ` title
-------
(0 rows)

    title
--------------
 Intro to SQL
(1 row)

      title
-----------------
 Backup strategy
(1 row)`, { hlOut: [3, 7, 12] }), 1.0)}
<table class="t"><tr><th style="width:90px">symbol</th><th>meaning</th><th>example</th></tr>
<tr><td><code class="i">%</code></td><td>any run of characters (even none)</td><td><code class="i">'In%'</code> → starts with “In”</td></tr>
<tr><td><code class="i">_</code></td><td>exactly one character</td><td><code class="i">'_ackup%'</code> → “Backup…”</td></tr></table>` },

  { t: 'LIKE: what to remember', body: `
${two(box('Case matters', '<code class="i">LIKE \'%sql%\'</code> found <b>nothing</b>: no title contains lowercase “sql”. <code class="i">ILIKE</code> ignores case and found “Intro to SQL”. For user-facing search, <code class="i">ILIKE</code> is almost always what you want.', 'info'),
box('Speed', 'A pattern that <b>starts</b> with <code class="i">%</code> cannot use a normal B-tree index, so it reads the whole table. For big tables, Chapter 13 shows <b>trigram</b> indexes that make <code class="i">ILIKE \'%word%\'</code> fast.', 'do2'))}
<div style="zoom:1.25">${tbl(['pattern', 'matches', 'does not match'], [['\'A%\'', 'Apple, A', 'apple'], ['\'%e\'', 'Apple, e', 'Apples'], ['\'a_c\'', 'abc, a1c', 'ac, abbc']], { cap: 'LIKE cheat-sheet (case-sensitive)' })}</div>` },

  { t: 'NULL: “unknown” — the value nobody knows', giua: true, body: `
${baDen()}
<p style="font-size:23px;margin:0"><b>NULL</b> does not mean zero or empty: it means <b>unknown</b>. Is a stranger's age greater than 30? <i>Unknown.</i> So every comparison with NULL is <b>UNKNOWN</b> — and <code class="i">WHERE</code> keeps <b>only TRUE</b>. UNKNOWN rows are dropped, silently, just like FALSE.</p>` },

  { t: 'The NULL trap in action', body: `
${zm(run(`SELECT title, tag FROM note WHERE tag = NULL;                       -- never matches
SELECT title, tag FROM note WHERE tag IS NULL ORDER BY id;
SELECT title, tag FROM note WHERE tag <> 'sql' ORDER BY id;     -- expected "not sql"`, ` title | tag
-------+-----
(0 rows)

      title      | tag
-----------------+-----
 My reading list |
 Quick draft     |
(2 rows)

        title         | tag
----------------------+------
 Timezones done right | date
 Backup strategy      | ops
(2 rows)`, { hlOut: [3, 7, 8, 13, 14] }), 0.98)}
<p style="font-size:20px;margin:0"><code class="i">= NULL</code> is never true — use <code class="i">IS NULL</code>. And <code class="i">tag &lt;&gt; 'sql'</code> returns the date and ops notes but <b>not the two NULL-tag notes</b>: unknown is not “not sql”.</p>` },

  { t: 'Three ways to keep the NULL rows', body: `
${zm(run(`SELECT title, tag FROM note WHERE tag <> 'sql' OR tag IS NULL ORDER BY id;
SELECT title, tag FROM note WHERE tag IS DISTINCT FROM 'sql' ORDER BY id;
SELECT title, COALESCE(tag, '(none)') AS tag_label
FROM note WHERE tag IS DISTINCT FROM 'sql' ORDER BY id;`, `        title         | tag
----------------------+------
 Timezones done right | date
 My reading list      |
 Backup strategy      | ops
 Quick draft          |
(4 rows)

        title         | tag_label
----------------------+-----------
 Timezones done right | date
 My reading list      | (none)
 Backup strategy      | ops
 Quick draft          | (none)
(4 rows)`, { hlOut: [4, 6, 12, 14] }), 0.86)}
${two(box('IS DISTINCT FROM', 'Treats NULL as an ordinary value: <code class="i">NULL IS DISTINCT FROM \'sql\'</code> is simply true. No third state.', 'xanh'),
box('COALESCE(x, y)', 'First non-NULL argument — shows <code class="i">(none)</code> instead of an empty cell. SQL Server: <code class="i">ISNULL</code>.', 'info'))}` },

  { t: 'Three-valued logic: the full truth table', giua: true, body: `
${chanTri()}
<p style="font-size:21px;margin:0">Why does <code class="i">WHERE NOT (tag = 'sql')</code> lose the NULL notes? <code class="i">tag = 'sql'</code> is <b>?</b> for NULL, and <b>NOT ? = ?</b> — still dropped. Careful: <b>F AND ? = F</b> but <b>T AND ? = ?</b>.</p>` },

  { t: 'Seeing UNKNOWN with your own eyes', body: `
${zm(run(`SELECT NULL = NULL AS null_eq_null,
       NULL IS NULL AS is_null,
       (false AND NULL) AS f_and_u,
       (true AND NULL)  AS t_and_u,
       (true OR NULL)   AS t_or_u,
       NOT NULL::boolean AS not_u;`, ` null_eq_null | is_null | f_and_u | t_and_u | t_or_u | not_u
--------------+---------+---------+---------+--------+-------
              | t       | f       |         | t      |
(1 row)`, { hlOut: [3] }), 1.0)}
${zm(run(`SELECT count(*) AS all_rows, count(tag) AS tag_not_null FROM note;`, ` all_rows | tag_not_null
----------+--------------
        7 |            5
(1 row)`, { hlOut: [3] }), 1.0)}
<p style="font-size:20px;margin:0">An empty cell (psql shows UNKNOWN/NULL as blank) means <b>unknown</b>. Even <code class="i">NULL = NULL</code> is unknown. And <code class="i">count(tag)</code> skips NULLs: 5, not 7.</p>` },

  { t: 'In what order does SQL really run a query?', body: `
${bangChuyen([['FROM', 'which table'], ['WHERE', 'keep TRUE rows'], ['SELECT', 'compute columns'], ['…', 'DISTINCT · ORDER BY · LIMIT']], { hi: 1 })}
${zm(run(`SELECT title, views * 2 AS d FROM note WHERE d > 100;`, `ERROR:  column "d" does not exist
LINE 1: SELECT title, views * 2 AS d FROM note WHERE d > 100;
                                                     ^`, { hlOut: [1] }), 1.1)}
${two(`<p style="font-size:21px;margin:0">SELECT is <b>written first but runs third</b>. When WHERE runs, the alias <code class="i">d</code> does not exist yet. Repeat the expression: <code class="i">WHERE views * 2 &gt; 100</code>.</p>`,
`<p style="font-size:21px;margin:0">Order of work: <b>FROM → WHERE → SELECT</b> (+ DISTINCT, ORDER BY, LIMIT next lesson). <code class="i">ORDER BY</code> runs after SELECT, so it <i>can</i> use the alias.</p>`)}` },

  { t: 'Coming from SQL Server?', body: `
<div style="zoom:1.0"><table class="t">
<tr><th style="width:250px">Topic</th><th>SQL Server (T-SQL)</th><th>PostgreSQL</th></tr>
<tr><td>Text comparison</td><td>case-<b>insensitive</b> by default collation</td><td>case-<b>sensitive</b>: <code class="i">'Cuong' = 'cuong'</code> is false</td></tr>
<tr><td>Case-insensitive search</td><td><code class="i">LIKE</code> (default collation)</td><td><code class="i">ILIKE</code>, or <code class="i">lower(a) = lower(b)</code></td></tr>
<tr><td>Join text</td><td><code class="i">'a' + 'b'</code></td><td><code class="i">'a' || 'b'</code> (or <code class="i">concat()</code>)</td></tr>
<tr><td>Replace NULL</td><td><code class="i">ISNULL(x, y)</code></td><td><code class="i">COALESCE(x, y)</code></td></tr>
<tr><td>Quote a name</td><td><code class="i">[note title]</code></td><td><code class="i">"note title"</code></td></tr>
<tr><td>Unicode literal</td><td><code class="i">N'…'</code></td><td><code class="i">'…'</code> (always UTF-8)</td></tr>
</table></div>
${zm(run(`SELECT "title" || ' — by ' || author AS line FROM note WHERE id <= 2 ORDER BY id;`, `             line
------------------------------
 Intro to SQL — by Cuong
 Indexes deep dive — by Cuong
(2 rows)`, { hlOut: [3, 4] }), 1.1)}` },

  { t: 'The case-sensitivity trap, on PostgreSQL', body: `
${zm(run(`SELECT count(*) AS exact_cuong FROM note WHERE author = 'cuong';
SELECT count(*) AS lower_cuong FROM note WHERE lower(author) = 'cuong';
SELECT count(*) AS ilike_cuong FROM note WHERE author ILIKE 'cuong';`, ` exact_cuong
-------------
           0
(1 row)

 lower_cuong
-------------
           3
(1 row)

 ilike_cuong
-------------
           3
(1 row)`, { hlOut: [3, 8, 13] }), 1.0)}
<p style="font-size:24px;margin:0">Two ways to match any case: <code class="i">lower(author) = 'cuong'</code> (can use an expression index, Chapter 9) or <code class="i">ILIKE</code> (pattern search).</p>` },

  { t: 'Real world (1): 42 customers vanish', body: `
${zm(run(`-- CT Shop, 300 customers
SELECT count(*) AS phone_null FROM customer WHERE phone IS NULL;
SELECT count(*) AS phone_not_eq FROM customer WHERE phone <> '0910007919';
SELECT count(*) AS phone_not_eq_or_null FROM customer
WHERE phone <> '0910007919' OR phone IS NULL;`, ` phone_null
------------
         42
(1 row)

 phone_not_eq
--------------
          257
(1 row)

 phone_not_eq_or_null
----------------------
                  299
(1 row)`, { hlOut: [3, 8, 13] }), 0.9)}
<p style="font-size:20px;margin:0">“Everyone except this phone number” should be <b>299</b> customers. The naive <code class="i">&lt;&gt;</code> returns <b>257</b>: the <b>42 customers with no phone</b> silently vanish. On this website a support-inbox filter once dropped admin chats the same way — they were never deleted, the filter just skipped unknown rows.</p>` },

  { t: 'Real world (2): search the CT Shop catalogue', body: `
${zm(run(`SELECT sku, name, price FROM product
WHERE name ILIKE '%bút bi%' AND price BETWEEN 10000 AND 100000
ORDER BY price;`, `  sku   |                 name                  |  price
--------+---------------------------------------+----------
 CT0503 | Bút bi Pentel BK77 0.7mm              | 12000.00
 CT0506 | Bút bi bấm Deli 0.7mm (hộp 12 cây)    | 45000.00
 CT0502 | Bút bi Thiên Long TL-079 (hộp 20 cây) | 78000.00
(3 rows)`, { hl: [2], hlOut: [3, 4, 5] }), 0.95)}
${two(`<div><div class="tcap">Prisma (cuongthai.com style)</div>` + sql(`prisma.product.findMany({ where: {
  name:  { contains: 'bút bi',
           mode: 'insensitive' },
  price: { gte: 10000, lte: 100000 },
} })`, { sm: true, lang: 'typescript' }) + `</div>`,
box('Same query underneath', '<code class="i">contains</code> + <code class="i">mode: \'insensitive\'</code> becomes <code class="i">ILIKE \'%…%\'</code>; <code class="i">gte</code>/<code class="i">lte</code> become the inclusive bounds of <code class="i">BETWEEN</code>.', 'xanh'), 'r64')}` },

  { t: 'Your turn: popular, tagged notes', body: `
<p style="margin:0">Show the <b>title and views</b> of notes with <b>between 10 and 100 views</b> that <b>have a tag</b>, most viewed first.</p>
${zm(run(`SELECT title, views FROM note
WHERE views BETWEEN 10 AND 100 AND tag IS NOT NULL
ORDER BY views DESC;`, `        title         | views
----------------------+-------
 Indexes deep dive    |    90
 Timezones done right |    45
 JSONB in practice    |    30
 Backup strategy      |    12
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.25)}
<p class="nho">Try it first. Hint: “has a tag” is not <code class="i">tag &lt;&gt; ''</code> — NULL is not an empty string. Use <code class="i">IS NOT NULL</code>.</p>` },

  { t: 'Self-check — pause the video and answer', to: true, body: `
${steps([
    'Why does <code class="i">WHERE tag = NULL</code> return nothing?',
    'Why does <code class="i">WHERE tag &lt;&gt; \'sql\'</code> not return the notes with no tag? Give two fixes.',
    'Why can <code class="i">WHERE d &gt; 100</code> not use an alias <code class="i">d</code> defined in SELECT?',
  ])}
${box('Answers', `<ol style="margin:0;font-size:21px"><li>NULL = unknown; <code class="i">NULL = anything</code> is UNKNOWN, never TRUE. Use <code class="i">IS NULL</code>.</li>
<li><code class="i">NULL &lt;&gt; 'sql'</code> is UNKNOWN, dropped. Fix: <code class="i">OR tag IS NULL</code> or <code class="i">IS DISTINCT FROM 'sql'</code>.</li>
<li>WHERE runs <b>before</b> SELECT, so the alias does not exist yet. Repeat the expression.</li></ol>`, 'xanh')}` },

  { t: 'Summary', to: true, body: `
<ul>
<li><b>SELECT</b> picks columns, <b>WHERE</b> keeps rows — and only <b>TRUE</b> survives</li>
<li><code class="i">AND</code> before <code class="i">OR</code>: use brackets · <code class="i">IN</code>, <code class="i">BETWEEN</code> (inclusive), <code class="i">LIKE</code>/<code class="i">ILIKE</code></li>
<li>NULL = unknown: <code class="i">IS NULL</code>, <code class="i">IS DISTINCT FROM</code>, <code class="i">COALESCE</code> — never <code class="i">= NULL</code></li>
<li>Run order: FROM → WHERE → SELECT (aliases are not visible in WHERE)</li>
</ul>
${box('Next: 4.3 ORDER BY, LIMIT & DISTINCT', 'Rows are chosen. Now put them in order, cut them into pages, and remove duplicates. Then practise on <b>Code Lab → PostgreSQL</b>.', 'lam')}` },
]);
