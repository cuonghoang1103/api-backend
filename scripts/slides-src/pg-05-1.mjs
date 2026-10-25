/**
 * pg-05-1 — PostgreSQL · Chapter 5 · Lesson 5.1 "INNER JOIN: putting rows back together" (slide EN, kiểu FU, 25/10/2026, agent c5).
 * Nguồn: content/courses/postgresql/s05-join.mjs › postgresql-5-1-inner-join. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-05-1.out.txt, schema ch05 + ctshop). Bổ sung: phiếu mượn sách (đời thường), bảng trước/sau,
 * hình dây nối từng dòng, lỗi "ambiguous", NATURAL JOIN sai im lặng, join bằng cột không duy nhất (hai Cuong), so chuỗi hoa/thường,
 * dấu phẩy cũ, so sánh SQL Server, Prisma include.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { joinPic, twoLists } from './pg-05-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-05-1', code: 'PG 5.1', title: 'INNER JOIN: putting rows back together', sub: 'Match rows from two tables on a key' };

const NOTE = { name: 'note', cols: ['id', 'user_id', 'title'], wc: [60, 110, 220], rows: [[1, 1, 'Intro to SQL'], [2, 1, 'Indexes'], [3, 2, 'Timezones'], [4, 3, 'Backup'], [5, null, 'Orphan draft']] };
const USER = { name: 'app_user', cols: ['id', 'name'], wc: [60, 150], rows: [[1, 'Cuong'], [2, 'Lan'], [3, 'Minh'], [4, 'Ngoc']] };

export const slides = lamDeck({ chuong: 'Chapter 5 — JOINs: combining tables', bai: '5.1' }, [
  { cover: true, t: 'INNER JOIN:<br>putting rows back together', sub: 'The payoff of splitting data into tables —<br>match each row with its partner.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why data lives in <b>several tables</b> — and how a <b>JOIN</b> puts it back together</li>
<li>Write an <code class="i">INNER JOIN … ON</code> and <b>predict</b> how many rows come out</li>
<li><b>Aliases</b>, the “ambiguous column” error, <code class="i">USING</code> vs <code class="i">ON</code></li>
<li>Three silent traps: <b>NATURAL JOIN</b>, joining on a <b>non-unique</b> column, <b>upper/lower case</b></li>
<li>What <b>Prisma</b> <code class="i">include</code> does — and the SQL Server differences</li>
</ul>
${box('Where we are', 'Chapter 3 taught you to split data so each fact lives once. Chapter 4 taught you to query one table. <b>Chapter 5 joins them back.</b> This is the most important query skill in SQL.', 'lam')}` },

  { t: 'Everyday example first: library slips', giua: true, body: `
${twoLists({ tl: 'Loan slips (only a member number)', tr: 'Member cards', l: ['“Dune” — member 7', '“Atlas” — member 3', '“Poems” — member 7'], r: ['3 · Minh', '7 · Lan', '9 · Ngoc (no slips)'], pairs: [[0, 1], [1, 0], [2, 1]], h: 240 })}
<p style="font-size:23px;margin:0">A loan slip stores <b>only the member number</b>, never the name — so when Lan changes her name, one card changes. To read “<i>who borrowed Dune?</i>” you take the number to the card file and look it up. That lookup, done for every row by the database, is a <b>JOIN</b>.</p>` },

  { t: 'Our two tables', body: `
${two(tbl(['id', 'user_id', 'title', 'tag'], [[1, 1, 'Intro to SQL', 'sql'], [2, 1, 'Indexes', 'sql'], [3, 2, 'Timezones', 'date'], [4, 3, 'Backup', 'ops'], [5, null, 'Orphan draft', 'misc']], { cap: 'note — each note stores user_id, not a name', hl: [4] }),
tbl(['id', 'name'], [[1, 'Cuong'], [2, 'Lan'], [3, 'Minh'], [4, 'Ngoc']], { cap: 'app_user', hl: [3] }), 'r64')}
<ul style="font-size:23px;margin:4px 0 0">
<li><code class="i">note.user_id</code> points at <code class="i">app_user.id</code> — a <b>foreign key</b> (Chapter 3)</li>
<li>Two rows have <b>no partner</b>: the <b>Orphan draft</b> (<code class="i">user_id</code> is NULL) and <b>Ngoc</b> (wrote nothing)</li>
</ul>` },

  { t: 'Without a JOIN you only see the number', giua: true, body: `
${zm(run(`SELECT title, user_id FROM note ORDER BY id;`, `    title     | user_id
--------------+---------
 Intro to SQL |       1
 Indexes      |       1
 Timezones    |       2
 Backup       |       3
 Orphan draft |
(5 rows)`, { hlOut: [5] }), 1.25)}
<p style="font-size:24px;margin:0">Who wrote <b>Timezones</b>? The table only knows the number <b>2</b>. The name lives in another table. A JOIN is how a single query reads both.</p>` },

  { t: 'The basic INNER JOIN', giua: true, body: `
${zm(run(`SELECT n.title, u.name AS author, n.tag
FROM note n JOIN app_user u ON u.id = n.user_id
ORDER BY n.id;`, `    title     | author | tag
--------------+--------+------
 Intro to SQL | Cuong  | sql
 Indexes      | Cuong  | sql
 Timezones    | Lan    | date
 Backup       | Minh   | ops
(4 rows)`, { hl: [2], hlOut: [3, 4, 5, 6] }), 1.3)}
<p style="font-size:23px;margin:0"><code class="i">JOIN</code> alone means <b>INNER JOIN</b> — the default. The <code class="i">ON</code> clause is the <b>matching rule</b>: a note and a user are paired when <code class="i">u.id = n.user_id</code>.</p>` },

  { t: 'What “inner” means: only matched pairs', body: `
${joinPic({ L: NOTE, R: USER, pairs: [[0, 0], [1, 0], [2, 1], [3, 2]], dropL: [4], dropR: [3], gap: 420, titleL: 'note n', titleR: 'app_user u' })}
<p style="font-size:22px;margin:0">Each green line is one match <code class="i">u.id = n.user_id</code>. <b>Orphan draft</b> has no partner and <b>Ngoc</b> has no partner, so neither appears. One user (Cuong) matches <b>two</b> notes → two result rows.</p>` },

  { t: 'What the server does, step by step', body: `
${steps([
    '<b>Read both sides.</b> Scan <code class="i">note</code> and <code class="i">app_user</code>. Neither is “the main table” — the planner decides which to walk first (Chapter 10).',
    '<b>Match on the condition.</b> For each candidate pair test <code class="i">u.id = n.user_id</code>: a match emits one combined row, a miss emits nothing.',
    '<b>Project the columns.</b> Only now does <code class="i">SELECT</code> keep <code class="i">n.title, u.name</code>. The join makes wide rows; the select list narrows them.',
    '<b>Order last.</b> <code class="i">ORDER BY</code> sorts the joined result, so you may sort by a column from either side.',
  ])}
${box('Remember', 'The number of output rows is decided at <b>step 2</b>, before SELECT runs. A join that returns “too many rows” is never fixed by changing the select list.', 'lam')}` },

  { t: 'Predict the row count', to: true, giua: true, body: `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
<div class="card"><div class="h">note</div><p style="font-size:44px;font-weight:800;color:#336791;margin:2px 0">5 rows</p><p>one has user_id NULL</p></div>
<div class="card"><div class="h">app_user</div><p style="font-size:44px;font-weight:800;color:#7a5a9a;margin:2px 0">4 rows</p><p>Ngoc wrote nothing</p></div>
<div class="card" style="border-color:#9fd0b2;background:#f1f9f4"><div class="h" style="color:#1f6b40">INNER JOIN</div><p style="font-size:44px;font-weight:800;color:#2f7d4f;margin:2px 0">4 rows</p><p>= notes that have a user</p></div>
</div>
${box('The rule for one-to-many', 'Joining a <b>child</b> table (note) to its <b>parent</b> (app_user) gives <b>one row per child that has a parent</b>. The orphan child is dropped; a parent with no children is dropped too. INNER JOIN can never return more rows than the child table has.', 'xanh')}
<p class="nho">Real check: <code class="i">SELECT count(*) … INNER JOIN</code> → 4, <code class="i">count(*) FROM note</code> → 5, <code class="i">count(*) FROM app_user</code> → 4.</p>` },

  { t: 'Aliases — and the “ambiguous” error', giua: true, body: `
${zm(run(`SELECT id, title
FROM note JOIN app_user ON app_user.id = note.user_id;`, `ERROR:  column reference "id" is ambiguous
LINE 1: SELECT id, title FROM note JOIN app_user ON app_user.id = no...
               ^`, { hlOut: [1] }), 1.4)}
${two(`<div class="card"><div class="h">Why it fails</div><p>Both tables have a column called <code class="i">id</code>. PostgreSQL will not guess which one you mean — it stops.</p></div>`,
`<div class="card" style="border-color:#9fd0b2;background:#f1f9f4"><div class="h" style="color:#1f6b40">The fix: aliases</div><p><code class="i">FROM note n JOIN app_user u</code> then write <code class="i">n.id</code> or <code class="i">u.id</code>. Short names, no ambiguity. (<code class="i">AS</code> is optional.)</p></div>`)}` },

  { t: 'ON is the general form — extra conditions allowed', giua: true, body: `
${zm(run(`SELECT n.title, u.name
FROM note n JOIN app_user u
  ON u.id = n.user_id AND n.tag = 'sql'
ORDER BY n.id;`, `    title     | name
--------------+-------
 Intro to SQL | Cuong
 Indexes      | Cuong
(2 rows)`, { hl: [3], hlOut: [3, 4] }), 1.3)}
<p style="font-size:23px;margin:0"><code class="i">ON</code> accepts <b>any</b> condition, even when the key columns have different names (<code class="i">u.id = n.user_id</code>). For an <b>INNER</b> join, a filter inside ON and the same filter in WHERE give the same rows — the two only differ for outer joins (lesson 5.2).</p>` },

  { t: 'USING: a shortcut when names match', giua: true, body: `
${zm(run(`SELECT n.title, s.reads
FROM note n JOIN note_stat s USING (id)
ORDER BY n.id;`, `    title     | reads
--------------+-------
 Intro to SQL |   500
 Indexes      |   300
 Timezones    |   120
 Backup       |    60
 Orphan draft |     5
(5 rows)`, { hl: [2] }), 1.25)}
<p style="font-size:23px;margin:0"><code class="i">USING (id)</code> means <code class="i">note.id = note_stat.id</code>. It is only possible when <b>both tables name the join column the same</b>. Here <code class="i">note_stat</code> shares its key with <code class="i">note</code>, so every note (even the orphan draft) finds its stats.</p>` },

  { t: 'ON vs USING: what SELECT * returns', giua: true, body: `
${two(run(`SELECT * FROM note n
JOIN note_stat s ON s.id = n.id;`, ` id | user_id |  title  | tag | id | reads
----+---------+---------+-----+----+-------
  1 |       1 | Intro … | sql |  1 |   500`, { hlOut: [1] }),
run(`SELECT * FROM note n
JOIN note_stat s USING (id);`, ` id | user_id |  title  | tag | reads
----+---------+---------+-----+-------
  1 |       1 | Intro … | sql |   500`, { hlOut: [1] }))}
${two(box('With ON', 'You get <b>both</b> copies of the key: <code class="i">id</code> from note and <code class="i">id</code> from note_stat — two columns with the same name.', 'info'),
box('With USING', 'The key is merged and appears <b>once</b>. In a join of three tables a merged column can be written without an alias.', 'xanh'))}
<p style="font-size:22px;margin:0">Use <b>USING</b> when names line up; use <b>ON</b> the moment they differ — which, with keys like <code class="i">user_id → id</code>, is most of the time.</p>` },

  { t: 'Trap: NATURAL JOIN guesses the key for you', giua: true, body: `
${zm(run(`SELECT n.title, u.name
FROM note n NATURAL JOIN app_user u
ORDER BY n.id;`, `    title     | name
--------------+-------
 Intro to SQL | Cuong
 Indexes      | Lan
 Timezones    | Minh
 Backup       | Ngoc
(4 rows)`, { hlOut: [4, 5, 6] }), 1.3)}
${box('Silently wrong', '<code class="i">NATURAL JOIN</code> joins on <b>every column with the same name</b> — here only <code class="i">id</code>, so <code class="i">note.id = app_user.id</code>. “Indexes” is now written by Lan! Four rows, no error. Add a column named <code class="i">created_at</code> to both tables tomorrow and the join silently changes again.', 'do2')}
<p class="nho">Rule: never use NATURAL JOIN. Write <code class="i">ON</code> (or <code class="i">USING</code>) so the key is visible in the code.</p>` },

  { t: 'Trap: joining on a column that is not unique', body: `
${two(tbl(['title', 'author_name'], [['Intro to SQL', 'Cuong'], ['Indexes', 'Cuong'], ['Timezones', 'Lan']], { cap: 'note_by_name' }),
tbl(['id', 'name'], [[1, 'Cuong'], [2, 'Lan'], [5, 'Cuong'], ], { cap: 'app_user — a second Cuong arrives', hl: [2] }), 'r46')}
${zm(run(`SELECT b.title, u.id AS user_id
FROM note_by_name b JOIN app_user u ON u.name = b.author_name
ORDER BY b.title, u.id;`, `    title     | user_id
--------------+---------
 Indexes      |       1
 Indexes      |       5
 Intro to SQL |       1
 Intro to SQL |       5
 Timezones    |       2
(5 rows)`, { hlOut: [3, 4, 5, 6] }), 0.88)}
<p style="font-size:20px;margin:0">3 rows before the second Cuong, <b>5</b> after: each Cuong note is doubled, nothing errors. <b>Safe join = at least one side unique</b> (PK or UNIQUE). Join on <code class="i">id</code>, never on a name.</p>` },

  { t: 'Text compares exactly in PostgreSQL', giua: true, body: `
${zm(run(`SELECT 'Cuong' = 'cuong' AS equal,
       lower('Cuong') = lower('cuong') AS equal_lower;`, ` equal | equal_lower
-------+-------------
 f     | t
(1 row)`, { hlOut: [3] }), 1.3)}
${zm(run(`SELECT b.title, u.id FROM note_by_name b
JOIN app_user u ON u.name = lower(b.author_name);`, ` title | id
-------+----
(0 rows)`, { hlOut: [1, 2, 3] }), 1.0)}
<p style="font-size:22px;margin:0">'Cuong' ≠ 'cuong'. A join on text with different capitalisation returns <b>nothing</b> — not an error. Compare <code class="i">lower(a) = lower(b)</code> (or use the <code class="i">citext</code> type). Numeric ids avoid the whole problem.</p>` },

  { t: 'The old comma style — and why we avoid it', body: `
${zm(run(`SELECT count(*) AS comma_no_where FROM note, app_user;
SELECT count(*) AS comma_with_where
FROM note, app_user WHERE app_user.id = note.user_id;`, ` comma_no_where
----------------
             20
(1 row)

 comma_with_where
------------------
                4
(1 row)`, { hlOut: [3, 8] }), 1.0)}
${two(box('It works…', '<code class="i">FROM a, b WHERE a.k = b.k</code> is the pre-1992 way to inner-join. PostgreSQL still accepts it.', 'info'),
box('…but one forgotten WHERE is a disaster', 'Without the condition you get <b>5 × 4 = 20</b> rows (every pair). With real tables that is millions. <code class="i">JOIN … ON</code> makes the condition impossible to forget — a missing ON is a syntax error.', 'bad'))}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:360px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">INNER JOIN … ON a.k = b.k</code></td><td><b>Identical</b> — same keywords, same result</td></tr>
<tr><td>No <code class="i">USING</code>, no <code class="i">NATURAL JOIN</code></td><td>Both exist (USING is handy, NATURAL is a trap)</td></tr>
<tr><td><code class="i">'Cuong' = 'cuong'</code> is <b>true</b> (default case-insensitive collation)</td><td><b class="do">false</b> — exact comparison; use <code class="i">lower()</code> or <code class="i">citext</code></td></tr>
<tr><td><code class="i">SELECT TOP 3 …</code></td><td><code class="i">… LIMIT 3</code></td></tr>
<tr><td>Quoted names <code class="i">[Order]</code></td><td>Double quotes <code class="i">"order"</code>; unquoted names fold to lower case</td></tr>
</table>`, 1.3)}
${box('Good news', 'JOIN is the part of SQL that is almost word for word the same in both worlds. The traps you learned in T-SQL (fan-out, ON vs WHERE) are the same traps here — only the case rule is new.', 'xanh')}` },

  { t: 'In production: Prisma include & real CT Shop', body: `
${zm(sql(`// cuongthai.com — a post with its author
const posts = await prisma.post.findMany({
  include: { author: true },          // “JOIN” in Prisma words
});
// Prisma 5 default: TWO queries, stitched together in Node
//   SELECT … FROM "posts" …
//   SELECT … FROM "users" WHERE "id" IN ($1,$2,…)
// relationLoadStrategy: "join"  → one SQL query with a LATERAL JOIN`, { sm: true, lang: 'typescript' }), 0.95)}
${zm(run(`\\c ctshop      -- 2000 orders, 300 customers
SELECT o.id, c.full_name, o.status
FROM orders o JOIN customer c ON c.id = o.customer_id
ORDER BY o.id LIMIT 4;`, ` id |    full_name    |  status
----+-----------------+-----------
  1 | Vũ Thị Bình     | paid
  2 | Vũ Gia Trang    | cancelled
  3 | Nguyễn Minh Hà  | shipped
  4 | Nguyễn Thu Linh | shipped
(4 rows)`, { hlOut: [3] }), 0.92)}
<p style="font-size:19px;margin:0">Every “post by an author” here is this join. CT Shop: all <b>2000</b> orders match a customer → 2000 joined rows.</p>` },

  { t: 'Exercise: two joins to write', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code>, <code class="i">note_stat</code> (<code class="i">id</code>, <code class="i">reads</code>) and <code class="i">app_user</code>:</p>
<ol style="font-size:24px">
<li>List <b>title and reads</b> of notes read <b>more than 100 times</b>, most read first. (Which join form fits — <code class="i">ON</code> or <code class="i">USING</code>?)</li>
<li>List the <b>author name and title</b> of every note tagged <code class="i">sql</code>.</li>
</ol>
${box('Before you run it — predict', 'How many rows will each query return? Which notes disappear, and why? (Hint: one note has no author.)', 'lam')}
<p class="nho">Pause the video and write both queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`SELECT n.title, s.reads
FROM note n
JOIN note_stat s USING (id)
WHERE s.reads > 100
ORDER BY s.reads DESC;`, `    title     | reads
--------------+-------
 Intro to SQL |   500
 Indexes      |   300
 Timezones    |   120
(3 rows)`, { hlOut: [3, 4, 5] }), 1.08)}`,
`${zm(run(`SELECT u.name, n.title
FROM note n
JOIN app_user u ON u.id = n.user_id
WHERE n.tag = 'sql'
ORDER BY n.id;`, `  name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
(2 rows)`, { hlOut: [3, 4] }), 1.08)}`)}
<p style="font-size:21px;margin:0">1) <b>USING (id)</b> works because both tables name the column <code class="i">id</code>; 3 notes have more than 100 reads. 2) <b>ON</b> is needed because the names differ; the orphan draft would not appear anyway (its tag is <i>misc</i>).</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>An <b>INNER JOIN</b> of 5 notes and 4 users returns 4 rows. Which rows were <b>not</b> returned, and why?</li>
<li>Why is <code class="i">NATURAL JOIN</code> dangerous?</li>
<li>Two users are both named “Cuong”. What happens to <code class="i">JOIN … ON u.name = b.author_name</code>?</li>
</ol>
${box('Answers', '<b>1.</b> The orphan note (user_id NULL → no partner) and the user Ngoc (wrote no note). <b>2.</b> It joins on every same-named column, so adding or renaming a column changes the result silently — and here it paired note.id with user.id. <b>3.</b> Every Cuong note appears twice (once per Cuong): rows and totals inflate with no error. Join on a unique key.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><b>INNER JOIN</b> keeps only the pairs that match; unmatched rows on either side vanish</li>
<li>Write the rule in <code class="i">ON</code>; use <b>aliases</b> to avoid “ambiguous column”; <code class="i">USING</code> when names match</li>
<li>Join on a <b>unique key</b> (id), compare text with <code class="i">lower()</code>, never <code class="i">NATURAL JOIN</code></li>
<li>The row count is decided at the <b>match step</b>, before SELECT</li>
</ul>
${box('Next: 5.2 — OUTER JOIN', 'What if you want Ngoc (no notes) or the orphan draft (no author) in the result? <b>LEFT / RIGHT / FULL JOIN</b> keep the unmatched rows — and give you the famous “find the rows with no partner” query.', 'lam')}` },
]);
