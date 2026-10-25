/**
 * pg-07-1 — PostgreSQL · Chapter 7 · Lesson 7.1 "Subqueries: a query inside a query" (slide EN, kiểu FU, 25/10/2026, agent c7).
 * Nguồn: content/courses/postgresql/s07-subquery-cte.mjs › postgresql-7-1-subquery. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-07-1.out.txt, schema ch07 + ctshop). Bổ sung: ví dụ đời thường (trung bình lớp), ngưỡng
 * "chạy theo dữ liệu" (INSERT rồi ROLLBACK), 3 lỗi của subquery vô hướng, IN so với JOIN (trùng dòng), ANY/ALL, bảng dẫn xuất
 * (PG 16+: alias tuỳ chọn), UPDATE với IN, cảnh báo NOT IN + NULL, so sánh SQL Server, CT Shop (11/48 sản phẩm trên giá TB).
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { barsAvg, setFilter, twoStep } from './pg-07-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-07-1', code: 'PG 7.1', title: 'Subqueries: a query inside a query', sub: 'Scalar, IN, ANY/ALL — a SELECT feeding another SELECT' };

const NOTE = tbl(['id', 'user_id', 'title', 'views'], [[1, 1, 'Intro to SQL', 120], [2, 1, 'Indexes', 90], [3, 2, 'Timezones', 45], [4, 3, 'Backup', 12], [5, 3, 'JSONB', 30], [6, 2, 'Window funcs', 60], [7, null, 'Orphan draft', 5]], { cap: 'note' });
const USER = tbl(['id', 'name', 'city', 'plan'], [[1, 'Cuong', 'Hanoi', 'pro'], [2, 'Lan', 'Hue', 'free'], [3, 'Minh', 'Hanoi', 'free'], [4, 'Ngoc', 'Danang', 'pro']], { cap: 'app_user' });

export const slides = lamDeck({ chuong: 'Chapter 7 — Subqueries & CTEs', bai: '7.1' }, [
  { cover: true, t: 'Subqueries:<br>a query inside a query', sub: 'Ask a question whose answer depends on<br>another question — in a single statement.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>What a <b>subquery</b> is — a SELECT in parentheses, used like a value, a list or a table</li>
<li>The <b>scalar</b> subquery (one value) and why it must return <b>at most one row</b></li>
<li><code class="i">IN</code>, <code class="i">ANY</code>, <code class="i">ALL</code> — filter against a <b>set</b> computed by another query</li>
<li>The <b>three places</b> a subquery can stand: WHERE, FROM, SELECT</li>
<li>A first look at the <b>NOT IN + NULL</b> trap (the full story is lesson 7.2)</li>
</ul>
${box('Where we are', 'Chapters 4–6 gave you single-table filters, JOINs and GROUP BY. <b>Chapter 7 lets one query use the answer of another</b> — the tool for “above average”, “in this set”, “the biggest of each”.', 'lam')}` },

  { t: 'Everyday example first: above the class average?', giua: true, body: `
${twoStep({ a: ['Step 1 — compute', 'average of every score = 51.7'], b: ['Step 2 — compare', 'keep each score above 51.7'] })}
<p style="font-size:23px;margin:0">To find “who beat the class average” you must first <b>know</b> the average. A person does it in two passes. A <b>subquery</b> lets the database do both in <b>one statement</b> — and the 51.7 is never typed by hand, so it stays correct when a new score arrives.</p>` },

  { t: 'Our two tables', body: `
${two(NOTE, USER, 'r64')}
<ul style="font-size:23px;margin:4px 0 0">
<li><code class="i">note.views</code> is what we aggregate; <code class="i">note.user_id</code> points at <code class="i">app_user.id</code></li>
<li>Seven notes, average views <b>51.7</b> · two users live in <b>Hanoi</b> (ids 1 and 3) · one note has no author</li>
</ul>` },

  { t: 'Scalar subquery in SELECT: one value, every row', giua: true, body: `
${zm(run(`SELECT title, views,
       (SELECT round(avg(views),1) FROM note) AS overall_avg
FROM note ORDER BY id;`, `    title     | views | overall_avg
--------------+-------+-------------
 Intro to SQL |   120 |        51.7
 Indexes      |    90 |        51.7
 Timezones    |    45 |        51.7
 Backup       |    12 |        51.7
 JSONB        |    30 |        51.7
 Window funcs |    60 |        51.7
 Orphan draft |     5 |        51.7
(7 rows)`, { hl: [2], hlOut: [3] }), 1.1)}
<p style="font-size:22px;margin:0">A <b>scalar subquery</b> returns exactly one value (one row, one column), so it fits anywhere a value fits. The inner query ran <b>once</b>; its 51.7 is attached to every row.</p>` },

  { t: 'Scalar subquery in WHERE: the threshold adapts', body: `
${zm(run(`SELECT title, views FROM note
WHERE views > (SELECT avg(views) FROM note)
ORDER BY views DESC;`, `    title     | views
--------------+-------
 Intro to SQL |   120
 Indexes      |    90
 Window funcs |    60
(3 rows)`, { hl: [2], hlOut: [3, 4, 5] }), 1.1)}
${barsAvg({ rows: [['Intro to SQL', 120], ['Indexes', 90], ['Window funcs', 60], ['Timezones', 45], ['JSONB', 30], ['Backup', 12], ['Orphan draft', 5]], avg: 51.7, hi: [0, 1, 2] })}` },

  { t: 'Why not just type 51.7? The data moves', giua: true, body: `
${zm(run(`BEGIN;
INSERT INTO note VALUES (8, 1, 'Viral post', 900);
SELECT round(avg(views),1) AS new_avg FROM note;
SELECT title, views FROM note
WHERE views > (SELECT avg(views) FROM note) ORDER BY views DESC;
ROLLBACK;`, ` new_avg
---------
   157.8
(1 row)

   title    | views
------------+-------
 Viral post |   900
(1 row)`, { hl: [2], hlOut: [3, 8] }), 1.05)}
<p style="font-size:22px;margin:0">One viral note and the average jumps from 51.7 to <b>157.8</b>; the same query now returns a different answer, with <b>no edit</b>. A hard-coded <code class="i">views &gt; 51.7</code> would be silently wrong. (We rolled the INSERT back, so the table is unchanged.)</p>` },

  { t: 'A scalar subquery must be ONE value', giua: true, body: `
${zm(three3(), 1.12)}
${box('Rule of thumb', 'Exactly <b>one column</b>, at most <b>one row</b>. Two columns is refused at <b>parse</b> time; two rows fail at <b>run</b> time — it can work for months, then break the day a second row appears. Make the inner query return one row on purpose: an aggregate (<code class="i">max</code>) or <code class="i">LIMIT 1</code>.', 'do2')}` },

  { t: 'IN: filter against a set computed elsewhere', body: `
${zm(sql(`SELECT title FROM note
WHERE user_id IN (SELECT id FROM app_user
                  WHERE city = 'Hanoi')
ORDER BY id;`, { sm: true, hl: [2, 3] }), 1.1)}
${setFilter({ sqlText: "SELECT id FROM app_user WHERE city='Hanoi'", set: [1, 3], rows: [['Intro to SQL', 1], ['Indexes', 1], ['Timezones', 2], ['Backup', 3], ['JSONB', 3], ['Window funcs', 2], ['Orphan draft', null]] })}` },

  { t: 'IN against a JOIN: who repeats?', body: `
${two(run(`SELECT name FROM app_user
WHERE id IN (SELECT user_id FROM note)
ORDER BY id;`, ` name
-------
 Cuong
 Lan
 Minh
(3 rows)`, { hlOut: [3, 4, 5] }), run(`SELECT u.name
FROM app_user u JOIN note n
  ON n.user_id = u.id
ORDER BY u.id;`, ` name
-------
 Cuong
 Cuong
 Lan
 Lan
 Minh
 Minh
(6 rows)`, { hlOut: [3, 4, 5, 6, 7, 8] }))}
<p style="font-size:22px;margin:0"><b>IN</b> asks “is this user in the set?” — each user appears <b>once</b>. A <b>JOIN</b> pairs every user with every note, so each author repeats once per note. Same idea, different row count: choose by the question you are asking.</p>` },

  { t: 'ANY and ALL: compare with a whole set', body: `
${two(run(`-- Minh's notes: 12 and 30
SELECT title, views FROM note
WHERE views > ANY (SELECT views FROM note
                   WHERE user_id = 3)
ORDER BY id;`, `    title     | views
--------------+-------
 Intro to SQL |   120
 Indexes      |    90
 Timezones    |    45
 JSONB        |    30
 Window funcs |    60
(5 rows)`, { hl: [3, 4], hlOut: [3, 4, 5, 6, 7] }), run(`SELECT title, views FROM note
WHERE views > ALL (SELECT views FROM note
                   WHERE user_id = 3)
ORDER BY id;`, `    title     | views
--------------+-------
 Intro to SQL |   120
 Indexes      |    90
 Timezones    |    45
 Window funcs |    60
(4 rows)`, { hl: [2, 3], hlOut: [3, 4, 5, 6] }))}
${two(box('> ANY', 'bigger than <b>at least one</b> value → bigger than the <b>smallest</b> (12). “JSONB 30” passes.', 'info'), box('> ALL', 'bigger than <b>every</b> value → bigger than the <b>largest</b> (30). JSONB 30 itself fails.', 'xanh'))}` },

  { t: 'ANY = IN, and ANY works on arrays too', giua: true, body: `
${two(run(`SELECT title FROM note
WHERE user_id = ANY (SELECT id FROM app_user
                     WHERE city = 'Hanoi')
ORDER BY id;   -- same 4 rows as IN`, `    title
--------------
 Intro to SQL
 Indexes
 Backup
 JSONB
(4 rows)`, { hlOut: [3, 4, 5, 6] }), run(`SELECT title FROM note
WHERE id = ANY (ARRAY[2,4,6])
ORDER BY id;`, `    title
--------------
 Indexes
 Backup
 Window funcs
(3 rows)`, { hlOut: [3, 4, 5] }))}
${box('Remember', '<code class="i">x IN (subquery)</code> and <code class="i">x = ANY (subquery)</code> are the same thing. PostgreSQL adds a bonus: <code class="i">= ANY (ARRAY[…])</code> takes an <b>array</b> — handy when an app passes one parameter like <code class="i">$1 = {2,4,6}</code> instead of building a long IN list.', 'lam')}` },

  { t: 'Three places a subquery can stand', to: true, body: `
${zm(cards([['In WHERE — a value or a set', '<code class="i">WHERE user_id IN (SELECT …)</code><br>Runs once, produces a list, filters the outer rows. By far the most common.'], ['In FROM — a derived table', '<code class="i">FROM (SELECT user_id, count(*) …) t</code><br>Behaves like a table; aggregate first, join after.'], ['In SELECT — a scalar', '<code class="i">SELECT u.name, (SELECT count(*) …)</code><br>One value per outer row: one column, at most one row.']], 3), 1.12)}
${box('The question that predicts performance', 'Does the inner query <b>mention a column of the outer query</b>? If not, it runs <b>once</b>. If yes (a <i>correlated</i> subquery) it is re-evaluated <b>per outer row</b> — the subject of lesson 7.2.', 'lam')}` },

  { t: 'Subquery in FROM: a derived table', giua: true, body: `
${zm(run(`SELECT u.name, t.notes
FROM app_user u
JOIN (SELECT user_id, count(*) AS notes
      FROM note GROUP BY user_id) t
  ON t.user_id = u.id
ORDER BY u.id;`, `  name  | notes
-------+-------
 Cuong |     2
 Lan   |     2
 Minh  |     2
(3 rows)`, { hl: [3, 4], hlOut: [3, 4, 5] }), 1.12)}
<p style="font-size:22px;margin:0">The inner query becomes a <b>temporary table</b> named <code class="i">t</code>: first count notes per author, then join to names. The alias was <b>mandatory before PostgreSQL 16</b> (<code class="i">subquery in FROM must have an alias</code>); PG 16/17 accept it without — but name it anyway, you need it to write <code class="i">t.notes</code>.</p>` },

  { t: 'Subquery in SELECT: one value per outer row', giua: true, body: `
${zm(run(`SELECT u.name,
       (SELECT count(*) FROM note n
        WHERE n.user_id = u.id) AS notes
FROM app_user u ORDER BY u.id;`, `  name  | notes
-------+-------
 Cuong |     2
 Lan   |     2
 Minh  |     2
 Ngoc  |     0
(4 rows)`, { hl: [2, 3], hlOut: [6] }), 1.15)}
<p style="font-size:22px;margin:0">Ngoc has <b>0</b> notes and <b>still appears</b> — a SELECT-list subquery never removes outer rows, it only adds a column. This subquery <b>mentions <code class="i">u.id</code></b> from the outer query, so it is re-evaluated for every user: a <i>correlated</i> subquery, the star of lesson 7.2.</p>` },

  { t: 'Nested subqueries: inside-out', giua: true, body: `
${two(sql(`-- who lives in Cuong's city?
SELECT title FROM note WHERE user_id IN (
  SELECT id FROM app_user
  WHERE city = (SELECT city FROM app_user
                WHERE name = 'Cuong'));`, { sm: true, hl: [5] }), psql(`    title
--------------
 Intro to SQL
 Indexes
 Backup
 JSONB
(4 rows)`, { sm: true, hl: [3, 4, 5, 6] }), 'r64')}
${steps(['Innermost runs first: <code class="i">SELECT city … WHERE name = \'Cuong\'</code> → <b>Hanoi</b>.', 'Middle: <code class="i">SELECT id … WHERE city = \'Hanoi\'</code> → the set <b>{1, 3}</b>.', 'Outer: notes whose <code class="i">user_id</code> is in {1, 3} → 4 rows.'])}
<p class="nho">Nesting works to any depth, but past two levels a <b>CTE</b> (lesson 7.3) reads far better.</p>` },

  { t: 'Subqueries also work in UPDATE / DELETE', giua: true, body: `
${zm(run(`BEGIN;
UPDATE note SET views = views + 100
WHERE user_id IN (SELECT id FROM app_user
                  WHERE plan = 'pro')
RETURNING id, title, views;
ROLLBACK;`, ` id |    title     | views
----+--------------+-------
  1 | Intro to SQL |   220
  2 | Indexes      |   190
(2 rows)`, { hl: [4], hlOut: [3, 4] }), 1.15)}
<p style="font-size:22px;margin:0">“Give a bonus to every note written by a <b>pro</b> user” — the set of pro ids is looked up, not typed. Wrapped in <code class="i">BEGIN … ROLLBACK</code> so you can see the effect without keeping it (lesson 4.4).</p>` },

  { t: 'Warning: NOT IN and NULL', giua: true, body: `
${zm(run(`SELECT name FROM app_user
WHERE id NOT IN (SELECT user_id FROM note)
ORDER BY id;`, ` name
------
(0 rows)`, { hlOut: [3] }), 1.3)}
${box('Zero rows — but Ngoc has no notes!', 'The inner query returns <code class="i">{1, 1, 2, 3, 3, 2, NULL}</code> — the orphan draft has <code class="i">user_id NULL</code>. One NULL in a <b>NOT IN</b> list makes the whole condition never true. Safe forms: <code class="i">NOT EXISTS</code>, or <code class="i">WHERE user_id IS NOT NULL</code> inside. <b>Full explanation: lesson 7.2.</b>', 'do2')}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:340px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Scalar / IN / EXISTS subqueries</td><td><b>Identical</b> syntax and results</td></tr>
<tr><td>Two rows in a scalar: <code class="i">Subquery returned more than 1 value</code></td><td><code class="i">more than one row returned by a subquery used as an expression</code></td></tr>
<tr><td>Derived table <b>needs</b> an alias, always</td><td>Alias required up to PG 15, <b>optional from PG 16</b> — name it anyway</td></tr>
<tr><td><code class="i">x &gt; ANY / ALL (subquery)</code></td><td>Same, plus <code class="i">= ANY (ARRAY[…])</code> on arrays</td></tr>
<tr><td><code class="i">SELECT TOP 1 …</code> inside a subquery</td><td><code class="i">… LIMIT 1</code></td></tr>
<tr><td><code class="i">NOT IN</code> + NULL → no rows</td><td><b>Same trap</b> — three-valued logic is standard SQL</td></tr>
</table>`, 1.2)}
${box('Good news', 'Subqueries are almost word for word the same in both worlds. The only things to retrain: <b>LIMIT</b> instead of TOP, and the optional alias.', 'xanh')}` },

  { t: 'In production: the feed, Prisma and CT Shop', body: `
${zm(sql(`-- cuongthai.com feed: posts from people I follow
SELECT * FROM posts
WHERE author_id IN (SELECT followee_id FROM follow
                    WHERE follower_id = $1)
ORDER BY created_at DESC LIMIT 20;
// Prisma: prisma.$queryRaw\`…\`  (typed, parameterised)`, { sm: true, lang: 'sql', hl: [3, 4] }), 0.98)}
${zm(run(`\\c ctshop        -- 48 products
SELECT count(*) AS above_avg FROM product
WHERE price > (SELECT avg(price) FROM product);`, ` above_avg
-----------
        11`, { hlOut: [3] }), 0.98)}
<p style="font-size:19px;margin:0">Change who you follow and the set the feed filters against changes — no code edit. In CT Shop the average price is 111 625 đ and <b>11 of 48</b> products are above it; the three dearest are Casio calculators and a Moleskine journal.</p>` },

  { t: 'Exercise: three subqueries to write', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code> and <code class="i">app_user</code>:</p>
<ol style="font-size:24px">
<li>Notes with <b>fewer views than average</b> — but <b>not</b> the orphan draft (it has no author). Fewest first.</li>
<li>The <b>names of users</b> who wrote at least one note with <b>more than 50 views</b>.</li>
<li>Why does <code class="i">views = (SELECT views FROM note WHERE user_id = 1)</code> fail, and how do you fix it?</li>
</ol>
${box('Before you run it — predict', 'How many rows will 1 and 2 return? Which kind of subquery does each need — scalar, or IN?', 'lam')}
<p class="nho">Pause the video and write the queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`SELECT title, views FROM note
WHERE views < (SELECT avg(views) FROM note)
  AND user_id IS NOT NULL
ORDER BY views;`, `   title   | views
-----------+-------
 Backup    |    12
 JSONB     |    30
 Timezones |    45
(3 rows)`, { hlOut: [3, 4, 5] }), 1.0)}`,
`${zm(run(`SELECT name FROM app_user
WHERE id IN (SELECT user_id FROM note
             WHERE views > 50)
ORDER BY id;`, ` name
-------
 Cuong
 Lan
(2 rows)`, { hlOut: [3, 4] }), 1.0)}`)}
<p style="font-size:23px;margin:0">1) <b>Scalar</b> subquery; the NULL-author filter removes the orphan (5 views). 2) <b>IN</b> — Cuong (120, 90) and Lan (60) each appear once. 3) The inner query returns <b>two rows</b> (120 and 90): use an aggregate — <code class="i">= (SELECT max(views) …)</code> — or <code class="i">IN</code> / <code class="i">= ANY</code> if you really want both.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol style="font-size:25px">
<li>What is the difference between a <b>scalar</b> subquery and an <b>IN</b> subquery?</li>
<li>When does <code class="i">x &gt; ALL (subquery)</code> equal <code class="i">x &gt; (SELECT max(…))</code>?</li>
<li>Why is <code class="i">NOT IN (SELECT user_id FROM note)</code> risky?</li>
</ol>
${box('Answers', '<b>1.</b> Scalar = exactly one value (one column, at most one row), used where a value fits; IN = a column of many values, tested for membership. <b>2.</b> Always (when the set is non-empty and has no NULL): bigger than every value means bigger than the maximum. <b>3.</b> If the column contains even one NULL, the condition is never true and the query silently returns no rows.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li>A <b>subquery</b> is a SELECT in parentheses — as a <b>value</b>, a <b>set</b> or a <b>table</b></li>
<li><b>Scalar</b>: one column, at most one row; the threshold follows the data</li>
<li><b>IN / ANY / ALL</b> compare with a whole set; IN does not repeat rows like a JOIN</li>
<li>WHERE and FROM subqueries run once; a subquery that mentions an outer column runs per row</li>
</ul>
${box('Next: 7.2 — Correlated subqueries & EXISTS', 'What if the inner query needs the <b>current outer row</b>? That is a <i>correlated</i> subquery — plus <b>EXISTS</b>, and the full story of the <b>NOT IN + NULL</b> trap.', 'lam')}` },
]);

function three3() {
  return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
<div>${psql(`SELECT title FROM note WHERE views =
 (SELECT views FROM note
  WHERE user_id = 1);

ERROR:  more than one row returned
        by a subquery used as an
        expression`, { sm: true, hl: [5, 6, 7], title: '2 rows (120, 90)' })}</div>
<div>${psql(`SELECT title FROM note WHERE views =
 (SELECT views, title FROM note
  WHERE id = 1);

ERROR:  subquery must return only
        one column`, { sm: true, hl: [5, 6], title: '2 columns' })}</div>
<div>${psql(`SELECT (SELECT views FROM note
        WHERE id = 99) AS nothing;

 nothing
---------

(1 row)`, { sm: true, hl: [6], title: '0 rows → NULL' })}</div>
</div>`;
}
