/**
 * pg-06-4 — PostgreSQL · Chapter 6 · Lesson 6.4 "Aggregating over joins: taming fan-out" (slide EN, kiểu FU, 25/10/2026, agent c6).
 * Nguồn: content/courses/postgresql/s06-tong-hop.mjs › postgresql-6-4-tong-hop-tren-join. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-06-4.out.txt, schema ch06 + ctshop). Bổ sung: sổ nộp bài (đời thường), hình fan-out, INNER JOIN làm rơi cả tác giả,
 * count(DISTINCT)+LEFT JOIN, count(*) vs count(col) sau LEFT JOIN, SUM phồng 180 → 420, "gộp trước rồi nối" (hình hai thứ tự), báo cáo hai số đo đúng/sai (views 450 vs 210),
 * bẫy DISTINCT-như-miếng-vá, dấu hiệu count(*) cạnh sum, WHERE phía phải LEFT JOIN, FILTER, đối chiếu SQL Server, CT Shop thật (946 triệu phồng thành 2,84 tỷ), Prisma _count.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { fanPic6, twoOrders } from './pg-06-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-06-4', code: 'PG 6.4', title: 'Aggregating over joins: taming fan-out', sub: 'Why counts and sums go wrong after a JOIN — and the fixes' };

export const slides = lamDeck({ chuong: 'Chapter 6 — Aggregation & grouping', bai: '6.4' }, [
  { cover: true, t: 'Aggregating over joins:<br>taming fan-out', sub: 'A join can copy rows — and every SUM and COUNT<br>after it quietly counts the copies.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>See the <b>join-plus-aggregate bug</b> happen: counts and sums that look plausible and are simply <b>false</b></li>
<li>Why an <b>INNER JOIN</b> can make a whole author <b>disappear</b> from a report</li>
<li>Fix 1: <code class="i">count(DISTINCT …)</code> + <code class="i">LEFT JOIN</code> — and <code class="i">count(col)</code> instead of <code class="i">count(*)</code></li>
<li>Fix 2 (the honest one): <b>aggregate first, then join</b> — so no row is ever copied</li>
<li>The <b>tell</b>: put <code class="i">count(*)</code> next to every <code class="i">sum()</code></li>
<li>The same bug on real money: <b>946 million</b> becoming <b>2.8 billion</b> in CT Shop</li>
</ul>
${box('Where we are', 'Chapter 5 warned that a one-to-many join <b>multiplies rows</b> (fan-out). Now that you aggregate, that multiplication turns into <b>wrong numbers</b>. This lesson closes Chapter 6.', 'lam')}` },

  { t: 'Everyday example first: the homework register', body: `
${zm(two(tbl(['student', 'weekly allowance'], [['Cuong', 120], ['Lan', 60]], { cap: 'students (the “one” side)' }),
tbl(['student', 'allowance', 'submission'], [['Cuong', 120, 'Hw 1'], ['Cuong', 120, 'Hw 2'], ['Cuong', 120, 'Hw 3'], ['Lan', 60, 'Hw 1']], { cap: 'students ⨝ submissions', hl: [1, 2] }), 'r37'), 1.2)}
<ul style="font-size:25px;margin:8px 0 0">
<li>Count the lines of the joined list and you get <b>4 “students”</b> — it counts <b>submissions</b>.</li>
<li>Add the allowance column and Cuong's 120 is counted <b>three times</b>: 360 + 60 = <b>420</b>, not 180.</li>
<li>The join was <b>correct</b>; the question we asked of it was not.</li>
</ul>` },

  { t: 'Our data: notes and their comments', body: `
${zm(two(tbl(['id', 'user_id', 'title', 'views'], [[1, 1, 'Intro to SQL', 120], [2, 1, 'Indexes', 90], [3, 1, 'Draft ideas', null], [4, 2, 'Joins', 60], [5, 2, 'Timezones', 45], [6, 3, 'Backup', 12], [7, 3, 'Vacuum', 30]], { cap: 'note (7 rows)' }),
tbl(['id', 'note_id', 'user_id', 'body'], [[1, 1, 2, 'Great intro!'], [2, 1, 3, 'Thanks'], [3, 1, 4, 'Very clear'], [4, 4, 1, 'Nice joins']], { cap: 'comment (4 rows)', hl: [0, 1, 2] }), 'r46'), 1.18)}
<ul style="font-size:23px;margin:4px 0 0">
<li><b>Intro to SQL</b> has <b>3</b> comments, <b>Joins</b> has 1 — the other five notes have <b>none</b>. Users: Cuong, Lan, Minh, Ngoc.</li>
</ul>` },

  { t: 'The bug: counting over a fan-out join', giua: true, body: `
${zm(run(`SELECT u.name, count(*) AS wrong_count
FROM app_user u
JOIN note n    ON n.user_id = u.id
JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;`, ` name  | wrong_count
-------+-------------
 Cuong |           3
 Lan   |           1
(2 rows)`, { hlOut: [3, 4] }), 1.15)}
<p style="font-size:22px;margin:0">“How many notes does each author have?” — it looks plausible. But Cuong's <b>3</b> is not his notes: it is the number of <b>comments</b> on his one commented note (Cuong has 3 notes). <b>Lan</b> has 2 notes, not 1. <b>Minh</b> and <b>Ngoc</b> are missing altogether.</p>` },

  { t: 'Look at the raw rows', giua: true, body: `
${fanPic6()}
${zm(run(`SELECT u.name, n.title, c.id AS comment_id
FROM app_user u JOIN note n ON n.user_id = u.id JOIN comment c ON c.note_id = n.id
ORDER BY n.id, c.id;`, ` name  |    title     | comment_id
-------+--------------+------------
 Cuong | Intro to SQL |          1
 Cuong | Intro to SQL |          2
 Cuong | Intro to SQL |          3
 Lan   | Joins        |          4
(4 rows)`, { hlOut: [3, 4, 5] }), 0.95)}` },

  { t: 'Two things went wrong at once', giua: true, body: `
${two(tbl(['author', 'true notes', 'wrong_count'], [['Cuong', 3, 3], ['Lan', 2, 1], ['Minh', 2, '—'], ['Ngoc', 0, '—']], { cap: 'what we wanted vs what we got', hl: [1], bo: [2, 3] }),
`<div style="font-size:23px;line-height:1.5">${box('Inflated / mixed up', 'Cuong\'s “3” is <b>comments</b>, not notes. One note with 3 comments became 3 rows.', 'bad')}<div style="height:12px"></div>${box('Missing', '<b>Minh</b>’s notes have no comment, so the <b>INNER JOIN</b> to comment dropped them — and the whole author with them. <b>Ngoc</b> has no note at all.', 'bad')}</div>`, 'r46')}
${box('The signature of an untamed fan-out', 'A number that is both <b>inflated</b> and <b>missing rows</b>. Two different bugs, one join.', 'lam')}` },

  { t: 'Fix 1: count(DISTINCT) + LEFT JOIN', giua: true, body: `
${zm(run(`SELECT u.name,
       count(DISTINCT n.id) AS notes,
       count(c.id)          AS comments
FROM app_user u
JOIN note n     ON n.user_id = u.id
LEFT JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;`, ` name  | notes | comments
-------+-------+----------
 Cuong |     3 |        3
 Lan   |     2 |        1
 Minh  |     2 |        0
(3 rows)`, { hlOut: [3, 4, 5] }), 1.12)}
<p style="font-size:21px;margin:0"><code class="i">count(DISTINCT n.id)</code> collapses the copies, <code class="i">LEFT JOIN</code> keeps Minh (his notes have no comments), and <code class="i">count(c.id)</code> counts only <b>real</b> comments — skipping the NULL the LEFT JOIN produced. Now: Cuong 3 notes + 3 comments, Minh 2 + 0.</p>` },

  { t: 'count(*) vs count(col) after a LEFT JOIN', giua: true, body: `
${zm(run(`SELECT u.name,
       count(n.id) AS notes,
       count(*)    AS rows_star
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.name ORDER BY notes DESC, u.name;`, ` name  | notes | rows_star
-------+-------+-----------
 Cuong |     3 |         3
 Lan   |     2 |         2
 Minh  |     2 |         2
 Ngoc  |     0 |         1
(4 rows)`, { hlOut: [6] }), 1.15)}
${two(box('count(n.id) — correct', 'Counts only <b>real</b> notes. Ngoc → <b>0</b>.', 'xanh'), box('count(*) — wrong here', 'Counts the placeholder row the LEFT JOIN made for Ngoc (all columns NULL) → <b>1</b>. “Users with no notes” becomes “users with one note”.', 'bad'))}` },

  { t: 'The same bug with SUM', giua: true, body: `
${zm(run(`SELECT sum(n.views) AS true_total FROM note n WHERE n.id IN (1, 4);

SELECT sum(n.views) AS inflated_total
FROM note n JOIN comment c ON c.note_id = n.id;`, ` true_total
------------
        180
(1 row)

 inflated_total
----------------
            420
(1 row)`, { hlOut: [3, 9] }), 1.2)}
<p style="font-size:22px;margin:0">The two commented notes have 120 + 60 = <b>180</b> views. After the join, Intro to SQL (120) appears <b>three times</b> and Joins (60) once: <b>120×3 + 60 = 420</b>. A SUM of a <b>one-side</b> column counts it once per <b>many-side</b> row.</p>` },

  { t: 'Why: the copies', giua: true, body: `
${zm(run(`SELECT n.title, n.views,
       count(*) OVER (PARTITION BY n.id) AS copies
FROM note n JOIN comment c ON c.note_id = n.id
ORDER BY n.id, c.id;`, `    title     | views | copies
--------------+-------+--------
 Intro to SQL |   120 |      3
 Intro to SQL |   120 |      3
 Intro to SQL |   120 |      3
 Joins        |    60 |      1
(4 rows)`, { hlOut: [3, 4, 5] }), 1.2)}
${box('Reading the output', '<code class="i">copies</code> says how many times each note row now exists. 3 for Intro to SQL means <b>every sum over this note’s columns is tripled</b>. (The <code class="i">OVER</code> clause is a window function — Chapter 8; here it is just a magnifying glass.)', 'lam')}` },

  { t: 'Fix 2: aggregate first, then join', giua: true, body: `
${zm(run(`SELECT sum(n.views) AS fixed_total
FROM note n
JOIN (SELECT note_id, count(*) AS comments
      FROM comment GROUP BY note_id) cc ON cc.note_id = n.id;`, ` fixed_total
-------------
         180
(1 row)`, { hl: [3, 4], hlOut: [3] }), 1.05)}
${zm(run(`SELECT n.title, n.views, cc.comments
FROM note n JOIN (SELECT note_id, count(*) AS comments FROM comment GROUP BY note_id) cc
  ON cc.note_id = n.id ORDER BY n.id;`, `    title     | views | comments
--------------+-------+----------
 Intro to SQL |   120 |        3
 Joins        |    60 |        1
(2 rows)`, { hlOut: [3, 4] }), 0.88)}
<p style="font-size:21px;margin:0">The subquery collapses <code class="i">comment</code> to <b>one row per note</b> first (a subquery in <code class="i">FROM</code> — Chapter 7 teaches it properly). Now the join <b>cannot copy</b> anything: views are added once, and the comment count rides along.</p>` },

  { t: 'Two orders of operations, two different numbers', giua: true, body: `
${twoOrders()}` },

  { t: 'A report with two measures — the wrong way', giua: true, body: `
${zm(run(`SELECT u.name,
       count(DISTINCT n.id) AS notes,
       sum(n.views)         AS views_wrong,
       count(c.id)          AS comments
FROM app_user u
LEFT JOIN note n    ON n.user_id = u.id
LEFT JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;`, ` name  | notes | views_wrong | comments
-------+-------+-------------+----------
 Cuong |     3 |         450 |        3
 Lan   |     2 |         105 |        1
 Minh  |     2 |          42 |        0
 Ngoc  |     0 |             |        0
(4 rows)`, { hlOut: [3] }), 1.08)}
${box('Trap: count(DISTINCT) is a patch, not a fix', '<code class="i">notes = 3</code> is right because of <code class="i">DISTINCT</code> — but <code class="i">views_wrong = 450</code> for Cuong is <b>120 × 3 + 90 + 0</b>. One query, one correct column, one wrong column — and nothing marks the wrong one as suspect.', 'do2')}` },

  { t: 'The honest version: pre-aggregate, then join', giua: true, body: `
${zm(run(`SELECT u.name,
       count(n.id)                   AS notes,
       coalesce(sum(n.views), 0)     AS views,
       coalesce(sum(cc.comments), 0) AS comments
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id
LEFT JOIN (SELECT note_id, count(*) AS comments FROM comment GROUP BY note_id) cc ON cc.note_id = n.id
GROUP BY u.name ORDER BY u.name;`, ` name  | notes | views | comments
-------+-------+-------+----------
 Cuong |     3 |   210 |        3
 Lan   |     2 |   105 |        1
 Minh  |     2 |    42 |        0
 Ngoc  |     0 |     0 |        0
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.0)}
<p style="font-size:21px;margin:0">Now <b>every</b> column is right: Cuong's views are <b>210</b> (not 450), Ngoc is present with zeros thanks to <code class="i">LEFT JOIN</code> + <code class="i">coalesce</code>. Treat a needed <code class="i">DISTINCT</code> as a <b>signal</b>: the grain is wrong — fix the grain.</p>` },

  { t: 'The tell: count(*) beside your sum()', giua: true, body: `
${zm(run(`SELECT count(*)            AS rows_in_group,
       count(DISTINCT n.id) AS distinct_notes
FROM note n JOIN comment c ON c.note_id = n.id;`, ` rows_in_group | distinct_notes
---------------+----------------
             4 |              2
(1 row)`, { hlOut: [3] }), 1.3)}
${steps([
    'Add <code class="i">count(*)</code> <b>beside</b> every <code class="i">sum()</code> you write over a join.',
    'Compare it with the number of <b>parent rows</b> you expect (here: 2 notes have comments).',
    '<b>4 ≠ 2</b> → the grain is wrong and <b>every aggregate</b> in that query is suspect — not only the one you noticed.',
  ])}` },

  { t: 'LEFT JOIN + WHERE on the right table', giua: true, body: `
${two(zm(run(`SELECT u.name, count(n.id) AS sql_notes
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.tag = 'sql'
GROUP BY u.name ORDER BY u.name;`, ` name  | sql_notes
-------+-----------
 Cuong |         2
 Lan   |         1
 Minh  |         1
(3 rows)`, { hlOut: [3, 4, 5] }), 0.8), zm(run(`SELECT u.name, count(n.id) AS sql_notes
FROM app_user u LEFT JOIN note n
  ON n.user_id = u.id AND n.tag = 'sql'
GROUP BY u.name ORDER BY u.name;`, ` name  | sql_notes
-------+-----------
 Cuong |         2
 Lan   |         1
 Minh  |         1
 Ngoc  |         0
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 0.8))}
${box('Same trap as lesson 5.2', 'A <code class="i">WHERE</code> on the right table <b>throws away the NULL placeholder rows</b> — turning the LEFT JOIN back into an INNER JOIN: <b>Ngoc disappears</b>. Put the condition in <code class="i">ON</code> (right) — or use <code class="i">FILTER</code> (next slide).', 'do2')}` },

  { t: 'FILTER keeps the zero rows for free', giua: true, body: `
${zm(run(`SELECT u.name,
       count(n.id) FILTER (WHERE n.tag = 'sql') AS sql_notes
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.name ORDER BY u.name;`, ` name  | sql_notes
-------+-----------
 Cuong |         2
 Lan   |         1
 Minh  |         1
 Ngoc  |         0
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.3)}
<p style="font-size:23px;margin:0">No WHERE, no placeholders lost: the LEFT JOIN keeps <b>every user</b>, and <code class="i">FILTER</code> counts only the matching notes. Combine <code class="i">FILTER</code> (6.3) with <code class="i">count(col)</code> (6.1) and the “users with zero” report writes itself.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:430px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Fan-out inflates <code class="i">SUM / COUNT(*)</code> after a one-to-many JOIN</td><td><b>Identical</b> — a data-shape problem, not a product quirk</td></tr>
<tr><td><code class="i">COUNT(DISTINCT x)</code>, <code class="i">LEFT JOIN</code>, derived tables</td><td><b>Same syntax</b>; derived table needs an alias in PostgreSQL too (<code class="i">… ) cc</code>)</td></tr>
<tr><td><code class="i">ISNULL(SUM(x), 0)</code></td><td><code class="i">coalesce(sum(x), 0)</code> (standard; ISNULL does not exist)</td></tr>
<tr><td><code class="i">OUTER APPLY (SELECT COUNT(*) …)</code> per row</td><td><code class="i">LEFT JOIN LATERAL (SELECT count(*) …) ON true</code> — also pre-aggregates per parent</td></tr>
<tr><td><code class="i">COUNT(*)</code> returns <code class="i">int</code></td><td><code class="i">count(*)</code> returns <b>bigint</b> — big sums never overflow</td></tr>
</table>`, 1.12)}
${box('Good news', 'The <b>fan-out lesson is database-agnostic</b>: if you learned to spot it in T-SQL, you already know how to spot it here — the fix (aggregate first, then join) is the same.', 'xanh')}` },

  { t: 'In production: 946 million becomes 2.8 billion', giua: true, body: `
${zm(run(`\\c ctshop
SELECT sum(amount) AS true_revenue FROM payment;
SELECT sum(p.amount) AS inflated_revenue
FROM payment p JOIN order_item oi ON oi.order_id = p.order_id;`, ` true_revenue
--------------
 946164000.00
(1 row)

 inflated_revenue
------------------
    2837494000.00
(1 row)`, { hlOut: [3, 9] }), 0.88)}
${zm(run(`SELECT (SELECT count(*) FROM payment) AS payments,
       (SELECT count(*) FROM payment p JOIN order_item oi ON oi.order_id = p.order_id) AS rows_after_join;`, ` payments | rows_after_join
----------+-----------------
     1663 |            4165
(1 row)`, { hlOut: [3] }), 0.88)}
<p style="font-size:20px;margin:0">1663 payments, but joining each to its <b>order lines</b> gives <b>4165</b> rows (2.5 copies on average; big orders have more lines). The report says <b>2,837,494,000 ₫</b> instead of <b>946,164,000 ₫</b> — three times too much, and nothing looks wrong.</p>` },

  { t: 'In production: the CT Shop fixes', giua: true, body: `
${zm(run(`SELECT sum(p.amount) AS fixed_revenue
FROM payment p
JOIN (SELECT order_id, count(*) AS items
      FROM order_item GROUP BY order_id) i ON i.order_id = p.order_id;`, ` fixed_revenue
---------------
  946164000.00
(1 row)`, { hlOut: [3] }), 1.0)}
${zm(run(`SELECT count(*) AS never_bought
FROM (SELECT c.id FROM customer c LEFT JOIN orders o ON o.customer_id = c.id
      GROUP BY c.id HAVING count(o.id) = 0) t;`, ` never_bought
--------------
           10
(1 row)`, { hlOut: [3] }), 1.0)}
<p style="font-size:19px;margin:0">Pre-aggregating order lines restores <b>946,164,000 ₫</b>. And “customers who never ordered” is the pattern from this lesson: <code class="i">LEFT JOIN</code> + <code class="i">GROUP BY</code> + <code class="i">HAVING count(o.id) = 0</code> — <b>10 customers</b> (ids 291–300), each with <code class="i">count(*)</code> = 1 but <code class="i">count(o.id)</code> = 0.</p>` },

  { t: 'In production: Prisma _count on relations', body: `
${zm(sql(`// cuongthai.com — “users with their post count, including new users at 0”
const users = await prisma.user.findMany({
  select: { id: true, name: true, _count: { select: { posts: true } } },
});
// Prisma builds this as a pre-aggregated subquery joined to the user:
//   LEFT JOIN (SELECT user_id, count(*) FROM posts GROUP BY user_id) …
// = "aggregate first, then join": rows are never multiplied,
// and a user with no posts correctly shows _count.posts = 0.

// Danger: joining two relations in raw SQL and then SUM-ing
//   SELECT p.id, count(DISTINCT l.id) AS likes FROM posts p
//   LEFT JOIN likes l ON l.post_id = p.id
//   LEFT JOIN comments c ON c.post_id = p.id GROUP BY p.id;
// likes is safe (DISTINCT) but any sum(p.views) would be multiplied by the comments`, { sm: true, lang: 'typescript' }), 0.98)}
<p style="font-size:20px;margin:0">A “posts and their like counts” panel that also joins comments must pre-aggregate (or <code class="i">count(DISTINCT …)</code>), or every post with 10 comments reports <b>10×</b> its real like total. Prisma's relation <code class="i">_count</code> follows the safe pattern for you: <b>aggregate per parent, then join</b>.</p>` },

  { t: 'Exercise: a report with two honest measures', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">app_user</code>, <code class="i">note</code>, <code class="i">comment</code>:</p>
<ol style="font-size:24px">
<li>One row <b>per author who has at least one note</b> with: number of notes, number of comments <b>received</b>.</li>
<li>Sort by comments received (most first). Authors with <b>zero</b> comments must still appear.</li>
<li>Check yourself: add <code class="i">count(*)</code> in a scratch query — does it equal the number of notes?</li>
</ol>
${box('Before you run it — predict', 'Who is first? How many rows? What would <code class="i">count(*)</code> be for Cuong if you joined comment <b>directly</b>?', 'lam')}
<p class="nho">Pause the video and write the query yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${zm(run(`SELECT u.name,
       count(n.id) AS notes,
       coalesce(sum(cc.k), 0) AS comments_received
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
LEFT JOIN (SELECT note_id, count(*) AS k
           FROM comment GROUP BY note_id) cc ON cc.note_id = n.id
GROUP BY u.name HAVING count(n.id) > 0
ORDER BY comments_received DESC, u.name;`, `  name  | notes | comments_received
-------+-------+-------------------
 Cuong |     3 |                 3
 Lan   |     2 |                 1
 Minh  |     2 |                 0
(3 rows)`, { hl: [4, 5, 6], hlOut: [3, 4, 5] }), 1.1)}
<p style="font-size:21px;margin:0">Pre-aggregate comments per note (<code class="i">cc</code>), <code class="i">LEFT JOIN</code> so Minh (0 comments) stays, <code class="i">HAVING count(n.id) &gt; 0</code> drops Ngoc (no notes) — <b>3 rows</b>. Joined directly to comment, Cuong's <code class="i">count(*)</code> is also 3 — a coincidence (it counts his <b>comments</b>) — while his <code class="i">sum(views)</code> becomes <b>450</b> instead of 210.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>A query joins <code class="i">orders</code> to <code class="i">order_item</code> and prints <code class="i">sum(orders.total)</code>. Why is the number wrong?</li>
<li>After a <code class="i">LEFT JOIN</code>, why use <code class="i">count(child.id)</code> instead of <code class="i">count(*)</code>?</li>
<li>Your report has <code class="i">count(DISTINCT o.id)</code> next to <code class="i">sum(o.total)</code>. What is wrong, and what is the fix?</li>
</ol>
${box('Answers', '<b>1.</b> Each order row is copied once per order line, so its <code class="i">total</code> is added once per line. <b>2.</b> A parent with no children still produces one placeholder row of NULLs — <code class="i">count(*)</code> counts it as 1; <code class="i">count(child.id)</code> counts 0. <b>3.</b> DISTINCT fixes only the count; the sum is still multiplied. Fix the <b>grain</b>: aggregate the many-side first, then join.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li>A one-to-many join <b>copies</b> the “one” row — every <code class="i">sum()</code> / <code class="i">count(*)</code> over its columns counts the copies</li>
<li>After a <code class="i">LEFT JOIN</code> count a <b>real column</b> (<code class="i">count(child.id)</code>); <code class="i">count(*)</code> counts the NULL placeholder as 1</li>
<li><b>Aggregate first, then join</b> is the honest fix; <code class="i">count(DISTINCT)</code> patches one number and leaves the rest wrong</li>
<li>The tell: <code class="i">count(*)</code> next to <code class="i">sum()</code> ≠ the rows you expected ⇒ the grain is wrong</li>
</ul>
${box('Next: Lab 3, then Chapter 7', '<b>Lab 3</b> practises JOINs and aggregates on CT Shop (revenue by month and category, customers who never ordered, fan-out). <b>Chapter 7</b> teaches <b>subqueries and CTEs</b> — the tools that make “aggregate first, then join” readable.', 'lam')}` },
]);
