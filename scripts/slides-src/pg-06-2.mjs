/**
 * pg-06-2 — PostgreSQL · Chapter 6 · Lesson 6.2 "GROUP BY: a summary per group" (slide EN, kiểu FU, 25/10/2026, agent c6).
 * Nguồn: content/courses/postgresql/s06-tong-hop.mjs › postgresql-6-2-group-by. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-06-2.out.txt, schema ch06 + ctshop). Bổ sung: thùng phiếu bầu (đời thường), rổ gom nhóm (hình),
 * "grain" (độ mịn), lỗi cột chưa gom, hai cách sửa, gom theo hai cột, bẫy thêm cột cho hết lỗi, phụ thuộc hàm (GROUP BY khoá chính),
 * NULL là một nhóm, GROUP BY 1/alias/biểu thức, GROUP BY = DISTINCT, ROLLUP/GROUPING SETS/CUBE, đối chiếu SQL Server, CT Shop thật, Prisma groupBy.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { baskets } from './pg-06-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-06-2', code: 'PG 6.2', title: 'GROUP BY: a summary per group', sub: 'One row per group instead of one for the whole table' };

const NOTES = [['#1', 120, 0], ['#2', 90, 0], ['#3', null, 0], ['#4', 60, 1], ['#5', 45, 1], ['#6', 12, 2], ['#7', 30, 2]];

export const slides = lamDeck({ chuong: 'Chapter 6 — Aggregation & grouping', bai: '6.2' }, [
  { cover: true, t: 'GROUP BY:<br>a summary per group', sub: 'One row for every author, every tag, every month —<br>not one number for the whole table.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>What <code class="i">GROUP BY</code> does: split rows into <b>groups</b>, run the aggregate <b>once per group</b></li>
<li>The <b>grain</b> of a result: one output row per distinct combination of the grouping columns</li>
<li>The rule everyone hits: <b>every selected column must be grouped or aggregated</b> — and the two ways out</li>
<li>Grouping by <b>two columns</b>, by an expression, and by the primary key</li>
<li>Traps: adding a column “to make the error go away”, and how <b>NULL</b> forms its own group</li>
<li>Bonus: <code class="i">ROLLUP</code>, <code class="i">GROUPING SETS</code>, <code class="i">CUBE</code> add the total rows for you</li>
</ul>
${box('Where we are', '6.1 gave <b>one</b> number for the whole table. Real reports want it <b>per group</b>: notes per author, revenue per month, customers per city. This is the workhorse of every report.', 'lam')}` },

  { t: 'Everyday example first: counting ballots', giua: true, body: `
${baskets({ items: [['ballot', 'Red', 0], ['ballot', 'Blue', 1], ['ballot', 'Red', 0], ['ballot', 'Green', 2], ['ballot', 'Red', 0], ['ballot', 'Blue', 1], ['ballot', 'Red', 0]].map(([n, v, g]) => ({ n, v, g })), groups: [{ name: 'Red', stat: 'count 4' }, { name: 'Blue', stat: 'count 2' }, { name: 'Green', stat: 'count 1' }], h: 320, w: 1110 })}
<p style="font-size:23px;margin:0">To count an election you do not stare at every ballot: you <b>sort them into one box per candidate</b>, then count <b>each box</b>. “Sort into boxes” is <code class="i">GROUP BY</code>; “count each box” is the aggregate. Same pile, one answer <b>per box</b> instead of one answer for the pile.</p>` },

  { t: 'Our tables: notes and their authors', body: `
${two(tbl(['id', 'user_id', 'title', 'tag', 'views'], [[1, 1, 'Intro to SQL', 'sql', 120], [2, 1, 'Indexes', 'sql', 90], [3, 1, 'Draft ideas', 'ops', null], [4, 2, 'Joins', 'sql', 60], [5, 2, 'Timezones', 'date', 45], [6, 3, 'Backup', 'ops', 12], [7, 3, 'Vacuum', 'sql', 30]], { cap: 'note (7 rows)' }),
tbl(['id', 'name', 'city'], [[1, 'Cuong', 'Hanoi'], [2, 'Lan', 'Danang'], [3, 'Minh', 'Hanoi'], [4, 'Ngoc', 'Hue']], { cap: 'app_user (4 rows)', hl: [3] }), 'r64')}
<ul style="font-size:23px;margin:4px 0 0">
<li>Same tables as lesson 6.1 plus <code class="i">app_user.city</code>. Ngoc has written no note.</li>
<li>Question for today: <b>how many notes — and how many views — does each author have?</b></li>
</ul>` },

  { t: 'GROUP BY in action', giua: true, body: `
${zm(run(`SELECT u.name AS author, count(*) AS notes, sum(n.views) AS total_views
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
ORDER BY total_views DESC NULLS LAST;`, ` author | notes | total_views
--------+-------+-------------
 Cuong  |     3 |         210
 Lan    |     2 |         105
 Minh   |     2 |          42
(3 rows)`, { hl: [3], hlOut: [3, 4, 5] }), 1.25)}
<p style="font-size:22px;margin:0">Instead of one grand total we get <b>one row per author</b>, each with that author's own count and sum. <code class="i">NULLS LAST</code> only matters when a group's sum is NULL.</p>` },

  { t: 'What GROUP BY does to the rows', giua: true, body: `
${baskets({ items: NOTES.map(([n, v, g]) => ({ n, v, g })), groups: [{ name: 'Cuong', stat: '3 rows · sum 210' }, { name: 'Lan', stat: '2 rows · sum 105' }, { name: 'Minh', stat: '2 rows · sum 42' }], h: 330 })}
<p style="font-size:22px;margin:0">Seven rows go into <b>one basket per distinct <code class="i">u.name</code></b>. The aggregate then runs once <b>inside each basket</b>: count the rows, add the views. Basket → one output row. The NULL views (#3) still counts as a <i>row</i> for <code class="i">count(*)</code> but adds nothing to <code class="i">sum</code>.</p>` },

  { t: 'The grain: one output row per group', to: true, body: `
${steps([
    '<b>GROUP BY sets the grain.</b> The result has exactly one row per <b>distinct combination</b> of the grouping columns. <code class="i">GROUP BY u.name</code> → one row per author.',
    '<b>Individual notes stop existing as rows.</b> After grouping you can only talk about the <b>group</b>: its count, its sum, its max — not “the” title.',
    '<b>Every selected column must survive the collapse.</b> A column is legal only if it is <b>grouped by</b> or <b>wrapped in an aggregate</b>.',
    '<b>Choose the grain first.</b> Ask: “one row per <i>what</i>?” — per author? per tag? per month? Then group by exactly that.',
  ])}
${box('Remember', 'Before you write <code class="i">GROUP BY</code>, finish the sentence <b>“I want one row per ______”</b>. That blank is your grouping column.', 'lam')}` },

  { t: 'Slice the same data another way: by tag', giua: true, body: `
${zm(run(`SELECT tag, count(*) AS notes, round(avg(views),1) AS avg_views
FROM note GROUP BY tag ORDER BY notes DESC, tag;`, `  tag  | notes | avg_views
------+-------+-----------
 sql  |     4 |      75.0
 ops  |     2 |      12.0
 date |     1 |      45.0
(3 rows)`, { hlOut: [3, 4, 5] }), 1.3)}
${two(box('sql', '4 notes: 120, 90, 60, 30 → average <b>75.0</b>', 'info'), box('ops', '2 notes but views are <b>NULL</b> and 12 → only <b>one</b> value counts → average <b>12.0</b>', 'bad'))}
<p class="nho">Remember 6.1: <code class="i">avg</code> skips NULL — here it divides by 1, not 2.</p>` },

  { t: 'The rule everyone hits', giua: true, body: `
${zm(run(`SELECT tag, views FROM note GROUP BY tag;`, `ERROR:  column "note.views" must appear in the GROUP BY clause or be used in an aggregate function
LINE 1: SELECT tag, views FROM note GROUP BY tag;
                    ^`, { hlOut: [1] }), 1.25)}
<p style="font-size:23px;margin:0">This error is a rite of passage. After <code class="i">GROUP BY tag</code>, each output row is a <b>whole group</b>. The <code class="i">sql</code> group has <b>one tag</b> but <b>four different views</b> — so “which views?” has no single answer, and PostgreSQL refuses to guess.</p>` },

  { t: 'Why a bare column has no answer', body: `
${two(zm(tbl(['tag', 'views'], [['sql', 120], ['sql', 90], ['sql', 60], ['sql', 30]], { cap: 'the sql group (4 rows)' }), 1.3),
`<div style="font-size:23px;line-height:1.5">
<div class="o ok"><div class="h">tag</div>Same value in every row of the group → <b>one answer: sql</b>. Allowed.</div>
<div class="o bad" style="margin-top:12px"><div class="h">views</div>Four different values → <b>which one?</b> 120? 30? The group has no single views. Refused.</div></div>`, 'r46')}
<p style="font-size:23px;margin:0">Mental model: <b>a bare column is legal only if it is constant across the group</b>. Everything else must be turned into one number by an aggregate.</p>` },

  { t: 'Two ways out of the error', giua: true, body: `
${two(`${zm(run(`SELECT tag, max(views) AS best,
       sum(views) AS total
FROM note GROUP BY tag
ORDER BY tag;`, `  tag  | best | total
------+------+-------
 date |   45 |    45
 ops  |   12 |    12
 sql  |  120 |   300
(3 rows)`, { hlOut: [3, 4, 5] }), 1.1)}`,
`<div style="font-size:23px">${box('① Aggregate it', 'Say <b>what</b> you want from the group: <code class="i">max(views)</code>, <code class="i">sum(views)</code>, <code class="i">avg(views)</code>, <code class="i">string_agg(…)</code>.', 'xanh')}<div style="height:12px"></div>${box('② Group by it', 'Add the column to <code class="i">GROUP BY</code> — but that <b>changes the grain</b> to one row per (tag, views). Only do it if that is the grain you want.', 'do2')}</div>`)}` },

  { t: 'Grouping by two columns', giua: true, body: `
${zm(run(`SELECT u.city, n.tag, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.city, n.tag
ORDER BY u.city, n.tag;`, `  city  | tag  | notes
--------+------+-------
 Danang | date |     1
 Danang | sql  |     1
 Hanoi  | ops  |     2
 Hanoi  | sql  |     3
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.25)}
<p style="font-size:22px;margin:0">List several columns and you get <b>one row per combination</b> — here city × tag, 4 combinations that actually occur (Danang/ops does not exist, so there is no such row). “Sales by region and product”, “signups by country and month”: <b>group by every dimension you want to break the number down by</b>.</p>` },

  { t: 'Trap: adding a column to make the error go away', giua: true, body: `
${zm(run(`SELECT n.user_id, n.title, count(*) AS notes
FROM note n
GROUP BY n.user_id, n.title
ORDER BY n.user_id, n.title;`, ` user_id |    title     | notes
---------+--------------+-------
       1 | Draft ideas  |     1
       1 | Indexes      |     1
       1 | Intro to SQL |     1
       2 | Joins        |     1
       2 | Timezones    |     1
       3 | Backup       |     1
       3 | Vacuum       |     1
(7 rows)`, { hlOut: [3, 4, 5, 6, 7, 8, 9] }), 0.95)}
${box('The silent bug', 'Adding <code class="i">n.title</code> to the grouping <b>silenced the error</b> — by changing the grain to one row per (user, title). We got <b>7 rows, every count is 1</b>. The query now answers a different question than “notes per user”.', 'do2')}` },

  { t: 'The right fix: say what you mean', giua: true, body: `
${zm(run(`SELECT n.user_id,
       count(*) AS notes,
       string_agg(n.title, ', ' ORDER BY n.id) AS titles
FROM note n
GROUP BY n.user_id
ORDER BY n.user_id;`, ` user_id | notes |               titles
---------+-------+------------------------------------
       1 |     3 | Intro to SQL, Indexes, Draft ideas
       2 |     2 | Joins, Timezones
       3 |     2 | Backup, Vacuum
(3 rows)`, { hlOut: [3, 4, 5] }), 1.12)}
<p style="font-size:22px;margin:0">Read the error as a question: <b>“at what grain do I want one row?”</b> Per user → the title does not belong as a plain column; use <code class="i">string_agg</code> (list them) or <code class="i">max</code> (pick one) and <b>say what you mean</b>.</p>` },

  { t: 'Group by the primary key: the exception', giua: true, body: `
${zm(run(`SELECT u.id, u.name, u.city, count(n.id) AS notes
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.id
ORDER BY u.id;`, ` id | name  |  city  | notes
----+-------+--------+-------
  1 | Cuong | Hanoi  |     3
  2 | Lan   | Danang |     2
  3 | Minh  | Hanoi  |     2
  4 | Ngoc  | Hue    |     0
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.1)}
${zm(run(`SELECT u.name, u.city, count(n.id)
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.name;`, `ERROR:  column "u.city" must appear in the GROUP BY clause or be used in an aggregate function`, { hlOut: [1] }), 0.9)}
<p style="font-size:21px;margin:0">Group by the <b>primary key</b> and you may select <b>any column of that same table</b>: one <code class="i">id</code> can only have one name and one city (a <i>functional dependency</i>). Group by <code class="i">name</code> alone and PostgreSQL cannot know the city is unique.</p>` },

  { t: 'NULL forms ONE group', giua: true, body: `
${zm(run(`CREATE TEMP TABLE t_null (grp text, v int);
INSERT INTO t_null VALUES ('a',1),('a',2),(NULL,3),(NULL,4),('b',5);
SELECT grp, count(*) AS rows, sum(v) AS total
FROM t_null GROUP BY grp ORDER BY grp NULLS LAST;`, ` grp | rows | total
-----+------+-------
 a   |    2 |     3
 b   |    1 |     5
     |    2 |     7
(3 rows)`, { hlOut: [3, 4, 5] }), 0.98)}
${zm(run(`SELECT NULL = NULL AS eq, NULL IS NOT DISTINCT FROM NULL AS not_distinct;`, ` eq | not_distinct
----+--------------
    | t
(1 row)`, { hlOut: [3] }), 0.98)}
<p style="font-size:21px;margin:0">Two NULLs are not <i>equal</i> (<code class="i">NULL = NULL</code> is unknown) — yet <code class="i">GROUP BY</code> puts <b>all NULLs in one group</b>, using “not distinct from” instead of equality. <code class="i">ORDER BY … NULLS LAST</code> puts that group at the end.</p>` },

  { t: 'GROUP BY with aliases, numbers and expressions', giua: true, body: `
${zm(run(`SELECT tag AS t, count(*) FROM note GROUP BY 1 ORDER BY 1;
SELECT tag AS t, count(*) FROM note GROUP BY t ORDER BY t;`, `  t   | count
------+-------
 date |     1
 ops  |     2
 sql  |     4
(3 rows)    -- both queries print the same`, { hlOut: [3] }), 0.92)}
${zm(run(`SELECT views / 50 * 50 AS bucket, count(*) AS notes
FROM note WHERE views IS NOT NULL
GROUP BY views / 50 * 50 ORDER BY bucket;`, ` bucket | notes
--------+-------
      0 |     3
     50 |     2
    100 |     1
(3 rows)`, { hlOut: [3, 4, 5] }), 0.92)}
<p style="font-size:20px;margin:0">PostgreSQL lets you write <code class="i">GROUP BY 1</code> (position) or the <b>output alias</b>, and any <b>expression</b> — here buckets of 50 views. Prefer names over positions: reorder the SELECT list and <code class="i">GROUP BY 1</code> silently changes meaning.</p>` },

  { t: 'ORDER BY an aggregate · GROUP BY = DISTINCT', giua: true, body: `
${zm(run(`SELECT user_id, count(*) AS notes
FROM note GROUP BY user_id
ORDER BY count(*) DESC, user_id;`, ` user_id | notes
---------+-------
       1 |     3
       2 |     2
       3 |     2
(3 rows)`, { hlOut: [3, 4, 5] }), 0.92)}
${two(zm(run(`SELECT tag FROM note GROUP BY tag ORDER BY tag;`, ` tag
------
 date
 ops
 sql
(3 rows)`, { hlOut: [3, 4, 5] }), 0.85), zm(run(`SELECT DISTINCT tag FROM note ORDER BY tag;`, ` tag
------
 date
 ops
 sql
(3 rows)`, { hlOut: [3, 4, 5] }), 0.85))}
<p style="font-size:20px;margin:0"><code class="i">ORDER BY</code> runs <b>after</b> grouping, so it may sort by an aggregate. And <code class="i">GROUP BY</code> with <b>no aggregate</b> is just <code class="i">SELECT DISTINCT</code>: one row per distinct value.</p>` },

  { t: 'ROLLUP: subtotals and a grand total', giua: true, body: `
${zm(run(`SELECT u.city, n.tag, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY ROLLUP (u.city, n.tag)
ORDER BY u.city NULLS LAST, n.tag NULLS LAST;`, `  city  | tag  | notes
--------+------+-------
 Danang | date |     1
 Danang | sql  |     1
 Danang |      |     2
 Hanoi  | ops  |     2
 Hanoi  | sql  |     3
 Hanoi  |      |     5
        |      |     7
(7 rows)`, { hlOut: [5, 8, 9] }), 1.08)}
<p style="font-size:21px;margin:0">One query, <b>three levels</b>: detail rows, a <b>subtotal per city</b> (tag shows NULL), and a <b>grand total</b> (both NULL). Without ROLLUP you would need three queries glued with UNION ALL.</p>` },

  { t: 'GROUPING SETS and CUBE', giua: true, body: `
${zm(run(`SELECT u.city, n.tag, count(*) AS notes, GROUPING(u.city, n.tag) AS g
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY GROUPING SETS ((u.city), (n.tag), ())
ORDER BY g, u.city, n.tag;`, `  city  | tag  | notes | g
--------+------+-------+---
 Danang |      |     2 | 1
 Hanoi  |      |     5 | 1
        | date |     1 | 2
        | ops  |     2 | 2
        | sql  |     4 | 2
        |      |     7 | 3
(6 rows)`, { hlOut: [3, 4, 5, 6, 7, 8] }), 1.1)}
${two(box('GROUPING SETS', 'You list <b>exactly</b> the groupings you want: by city, by tag, and overall <code class="i">()</code>. <code class="i">GROUPING(…)</code> returns a bit mask so you can tell a <b>subtotal NULL</b> (g &gt; 0) from a <b>real NULL</b> in the data.', 'info'),
box('ROLLUP / CUBE', '<code class="i">ROLLUP (a, b)</code> = (a,b) (a) (). <code class="i">CUBE (a, b)</code> = <b>every</b> combination: (a,b) (a) (b) (). CUBE on our data → 10 rows.', 'xanh'))}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:430px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">GROUP BY</code> must list every non-aggregated column</td><td><b>Same rule</b> (and the same error). Plus: grouping by the <b>primary key</b> allows that table's other columns</td></tr>
<tr><td><code class="i">GROUP BY alias</code> → <b>invalid</b> (alias unknown)</td><td><code class="i">GROUP BY alias</code> and <code class="i">GROUP BY 1</code> both work</td></tr>
<tr><td><code class="i">STRING_AGG(x, ', ') WITHIN GROUP (ORDER BY y)</code></td><td><code class="i">string_agg(x, ', ' ORDER BY y)</code></td></tr>
<tr><td><code class="i">GROUP BY a, b WITH ROLLUP</code> (old) · <code class="i">ROLLUP (a, b)</code></td><td><code class="i">GROUP BY ROLLUP (a, b)</code> — the standard form only</td></tr>
<tr><td><code class="i">GROUPING_ID(a, b)</code></td><td><code class="i">GROUPING(a, b)</code> — same bit mask idea</td></tr>
<tr><td>One NULL group</td><td>Same: all NULLs form one group</td></tr>
</table>`, 1.12)}
${box('MySQL note', 'Old MySQL let you select non-grouped columns and <b>picked an arbitrary row</b> (<code class="i">ONLY_FULL_GROUP_BY</code> off). PostgreSQL never does — the error is a feature.', 'xanh')}` },

  { t: 'In production: CT Shop reports', giua: true, body: `
${zm(run(`SELECT date_trunc('month', paid_at)::date AS month,
       count(*) AS payments, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-04-01' AND paid_at < '2026-10-01'
GROUP BY 1 ORDER BY 1;`, `   month    | payments |   revenue
------------+----------+-------------
 2026-04-01 |       69 | 37252000.00
 2026-05-01 |       73 | 49290000.00
 2026-06-01 |       81 | 40587000.00
 2026-07-01 |       99 | 60560000.00
 2026-08-01 |       80 | 37315000.00
 2026-09-01 |       80 | 42485000.00
(6 rows)`, { hlOut: [6] }), 0.88)}
${two(zm(run(`SELECT status, count(*) AS orders
FROM orders GROUP BY status
ORDER BY orders DESC;`, `  status   | orders
-----------+--------
 shipped   |    910
 paid      |    753
 pending   |    180
 cancelled |    157
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 0.76), `<p style="font-size:20px;margin:0">One <code class="i">GROUP BY</code> turns 1663 payments into six monthly bars; another turns 2000 orders into four status counts (they add up: 910 + 753 + 180 + 157 = 2000). July was the best month — <b>60.6 M ₫</b>.</p>`, 'r64')}` },

  { t: 'In production: Prisma groupBy', body: `
${zm(sql(`// cuongthai.com — the “posts per day” chart on the analytics page
const perDay = await prisma.post.groupBy({
  by: ['createdDay'],                      // GROUP BY created_day
  _count: { _all: true },                  // count(*)
  _sum:   { views: true },                 // sum(views)
  orderBy: { createdDay: 'asc' },
});
// → [{ createdDay: '2026-10-01', _count: { _all: 12 }, _sum: { views: 340 } }, …]

// users per role, biggest group first
const byRole = await prisma.user.groupBy({
  by: ['role'], _count: { _all: true },
  orderBy: { _count: { role: 'desc' } },
});`, { sm: true, lang: 'typescript' }), 0.98)}
<p style="font-size:20px;margin:0">Prisma's <code class="i">by: […]</code> is the <code class="i">GROUP BY</code> list; <code class="i">_count / _sum / …</code> are the aggregates. Each chart on the site's analytics page is one <code class="i">GROUP BY</code> over one or two dimensions — exactly the shape you just learned.</p>` },

  { t: 'Exercise: three reports', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code> and <code class="i">app_user</code>:</p>
<ol style="font-size:24px">
<li>For <b>Cuong and Lan only</b>: the number of notes <b>per author and tag</b>, and the best (max) views in each.</li>
<li>A list with <b>one row per tag</b> showing all its titles on one line, alphabetically.</li>
<li>Add the <b>subtotal per author</b> and a grand total to question 1 (hint: ROLLUP).</li>
</ol>
${box('Before you run it — predict', 'How many rows will question 1 return? Which group has <b>NULL</b> as its best views — and why?', 'lam')}
<p class="nho">Pause the video and write the queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`SELECT u.name, n.tag, count(*) AS notes,
       max(n.views) AS best
FROM note n JOIN app_user u ON u.id = n.user_id
WHERE u.name IN ('Cuong', 'Lan')
GROUP BY u.name, n.tag
ORDER BY u.name, n.tag;`, ` name  | tag  | notes | best
-------+------+-------+------
 Cuong | ops  |     1 |
 Cuong | sql  |     2 |  120
 Lan   | date |     1 |   45
 Lan   | sql  |     1 |   60
(4 rows)`, { hlOut: [3] }), 0.84)}`,
`${zm(run(`SELECT tag,
       string_agg(title, ' | ' ORDER BY title)
FROM note GROUP BY tag ORDER BY tag;`, `  tag |               string_agg
------+-----------------------------------------
 date | Timezones
 ops  | Backup | Draft ideas
 sql  | Indexes | Intro to SQL | Joins | Vacuum
(3 rows)`, { hlOut: [3, 4, 5] }), 0.8)}`)}
<p style="font-size:20px;margin:0">1) <b>4 rows</b>. Cuong/ops has <b>NULL</b> best: its only note (“Draft ideas”) has NULL views, so <code class="i">max</code> has nothing to return. 2) <code class="i">string_agg … ORDER BY title</code>. 3) Use <code class="i">GROUP BY ROLLUP (u.name, n.tag)</code>: it adds a subtotal row per author (tag NULL) and a grand total (both NULL).</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>You write <code class="i">SELECT tag, title, count(*) FROM note GROUP BY tag</code>. Why does PostgreSQL refuse, and what are the two fixes?</li>
<li>Adding a column to <code class="i">GROUP BY</code> removed the error, but all counts became 1. What happened?</li>
<li>Three notes have a NULL tag. How many groups do they form?</li>
</ol>
${box('Answers', '<b>1.</b> A group has one tag but many titles, so “which title?” has no answer. Fix: aggregate it (<code class="i">max(title)</code>, <code class="i">string_agg</code>) or group by it knowingly. <b>2.</b> You changed the <b>grain</b> to one row per (tag, title) — each combination appears once. <b>3.</b> <b>One</b> group: GROUP BY treats all NULLs as the same.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><code class="i">GROUP BY</code> splits rows into groups and runs the aggregate <b>once per group</b></li>
<li>The <b>grain</b>: one output row per distinct combination — decide “one row per ___” first</li>
<li>Every selected column must be <b>grouped</b> or <b>aggregated</b>; never add a column just to silence the error</li>
<li>NULLs form <b>one</b> group; GROUP BY the primary key allows its table's other columns</li>
<li><code class="i">ROLLUP / GROUPING SETS / CUBE</code> add subtotals and totals in one query</li>
</ul>
${box('Next: 6.3 — HAVING and FILTER', 'You can now get a number per group. What if you only want groups with <b>at least 3 notes</b>? That is a filter on the <b>aggregate</b> — a job for <b>HAVING</b>. And <b>FILTER</b> lets one query compute several conditional totals at once.', 'lam')}` },
]);
