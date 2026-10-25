/**
 * pg-07-3 — PostgreSQL · Chapter 7 · Lesson 7.3 "CTEs (WITH): queries in readable steps" (slide EN, kiểu FU, 25/10/2026, agent c7).
 * Nguồn: content/courses/postgresql/s07-subquery-cte.mjs › postgresql-7-3-cte. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-07-3.out.txt, schema ch07 + ctshop). Bổ sung: so CTE với bảng dẫn xuất, chuỗi CTE, dùng hai lần,
 * fan-out + cách chữa, MATERIALIZED / NOT MATERIALIZED (đọc kế hoạch thật, 18 ms vs 0,5 ms), CTE ghi dữ liệu (DELETE … RETURNING → INSERT),
 * so sánh SQL Server, CT Shop (top khách chi nhiều nhất, không fan-out).
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { cteSteps, fan7, matPic } from './pg-07-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-07-3', code: 'PG 7.3', title: 'CTEs (WITH): queries in readable steps', sub: 'Name each step, read top to bottom' };

const NOTE = tbl(['id', 'user_id', 'title', 'views'], [[1, 1, 'Intro to SQL', 120], [2, 1, 'Indexes', 90], [3, 2, 'Timezones', 45], [4, 3, 'Backup', 12], [5, 3, 'JSONB', 30], [6, 2, 'Window funcs', 60], [7, null, 'Orphan draft', 5]], { cap: 'note' });
const USER = tbl(['id', 'name', 'city'], [[1, 'Cuong', 'Hanoi'], [2, 'Lan', 'Hue'], [3, 'Minh', 'Hanoi'], [4, 'Ngoc', 'Danang']], { cap: 'app_user' });
const COMMENT = tbl(['id', 'note_id', 'user_id'], [[1, 1, 2], [2, 1, 3], [3, 3, 1]], { cap: 'comment' });

export const slides = lamDeck({ chuong: 'Chapter 7 — Subqueries & CTEs', bai: '7.3' }, [
  { cover: true, t: 'CTEs (WITH):<br>queries in readable steps', sub: 'Give every step a name — and fix the<br>fan-out sum left open in Chapter 6.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>A <b>CTE</b> (Common Table Expression): <code class="i">WITH name AS (…)</code> — a named step you can query like a table</li>
<li>Why it reads <b>top to bottom</b> where nested subqueries read inside-out</li>
<li><b>Chains</b> of CTEs, and a CTE <b>used twice</b></li>
<li>The cure for the <b>fan-out sum</b>: aggregate the “many” side <b>before</b> joining</li>
<li><code class="i">MATERIALIZED</code> / <code class="i">NOT MATERIALIZED</code>, and <b>CTEs that write data</b></li>
</ul>
${box('Where we are', '7.1 and 7.2 put queries <b>inside</b> queries. Nest three deep and nobody can read it. <b>WITH</b> flattens the nesting into named steps.', 'lam')}` },

  { t: 'Everyday example first: a recipe in named steps', giua: true, body: `
${cteSteps({ steps: [{ name: 'prep', sub: ['wash and chop', 'the vegetables'] }, { name: 'sauce', sub: ['simmer the', 'tomatoes'] }, { name: 'dinner', sub: ['combine prep', '+ sauce, serve'], mau: '#b85a2b' }] })}
<p style="font-size:23px;margin:0">A recipe is a list of <b>named steps</b>, each using the result of the earlier ones. A nested subquery is the same recipe written <i>inside out</i> in a single sentence: “serve (combine (chop the vegetables) with (simmer the tomatoes))”. A <b>CTE</b> gives every step a name and puts them in order.</p>` },

  { t: 'Our three tables', body: `
${two(NOTE, `<div style="display:flex;flex-direction:column;gap:14px">${USER}${COMMENT}</div>`, 'r64')}
<ul style="font-size:22px;margin:4px 0 0">
<li>Goal today: <b>views and comment counts per author</b> — a one-to-many problem from Chapter 6</li>
</ul>` },

  { t: 'WITH: a named, reusable step', giua: true, body: `
${zm(run(`WITH author_stats AS (
  SELECT user_id, count(*) AS notes,
         sum(views) AS total_views
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id
)
SELECT u.name, s.notes, s.total_views
FROM author_stats s JOIN app_user u ON u.id = s.user_id
WHERE s.total_views > 100
ORDER BY s.total_views DESC;`, ` name  | notes | total_views
-------+-------+-------------
 Cuong |     2 |         210
 Lan   |     2 |         105
(2 rows)`, { hl: [1, 2, 6], hlOut: [3, 4] }), 1.0)}
<p style="font-size:21px;margin:0">Define the CTE <b>first</b> (<code class="i">WITH author_stats AS ( … )</code>), then <code class="i">SELECT</code> from it as if it were a table. Step 1: summarise notes per author. Step 2: join names and filter.</p>` },

  { t: 'The same query, as named steps', giua: true, body: `
${cteSteps({ steps: [{ name: 'author_stats', sub: ['notes + total views', 'per user_id'] }, { name: 'join + filter', sub: ['add names,', 'keep total_views > 100'] }, { name: 'result', sub: ['Cuong 210', 'Lan 105'], mau: '#b85a2b' }], h: 210 })}
<p style="font-size:23px;margin:0">Read it like paragraphs: <b>“first compute author stats, then join and filter.”</b> Each box has a <b>name chosen for what it produces</b> (author_stats), not how it works. The next person reads the plan of the query without decoding brackets.</p>` },

  { t: 'CTE vs derived table: same result, different reading', body: `
${two(`<div><div class="tcap">Derived table — read inside-out</div>${sql(`SELECT u.name, s.notes, s.total_views
FROM (SELECT user_id, count(*) AS notes,
             sum(views) AS total_views
      FROM note WHERE user_id IS NOT NULL
      GROUP BY user_id) s
JOIN app_user u ON u.id = s.user_id
WHERE s.total_views > 100
ORDER BY s.total_views DESC;`, { sm: true, hl: [2, 3, 4, 5] })}</div>`, `<div><div class="tcap">CTE — read top-down</div>${sql(`WITH author_stats AS (
  SELECT user_id, count(*) AS notes,
         sum(views) AS total_views
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id
)
SELECT u.name, s.notes, s.total_views
FROM author_stats s
JOIN app_user u ON u.id = s.user_id
WHERE s.total_views > 100
ORDER BY s.total_views DESC;`, { sm: true, hl: [1, 2, 3, 4, 5, 6] })}</div>`)}
${zm(psql(` name  | notes | total_views
-------+-------+-------------
 Cuong |     2 |         210
 Lan   |     2 |         105
(2 rows)`, { sm: true, hl: [3, 4], title: 'both queries return exactly this' }), 1.0)}
<p style="font-size:21px;margin:0">Identical output, identical plan; only the <b>human</b> cost differs — the logic that hides mid-FROM on the left sits named and on top on the right.</p>` },

  { t: 'Several CTEs: later steps build on earlier ones', giua: true, body: `
${zm(run(`WITH per_author AS (
  SELECT user_id, sum(views) AS total_views
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id
), best AS (
  SELECT user_id FROM per_author
  WHERE total_views = (SELECT max(total_views)
                       FROM per_author)
)
SELECT u.name FROM best b
JOIN app_user u ON u.id = b.user_id;`, ` name
-------
 Cuong
(1 row)`, { hl: [5], hlOut: [3] }), 0.98)}
<p style="font-size:21px;margin:0">Separate CTEs with a <b>comma</b> (one <code class="i">WITH</code> only). <code class="i">best</code> uses <code class="i">per_author</code>, and <code class="i">per_author</code> is even used <b>twice</b> there — once for the filter, once for the max. A derived table cannot be shared like that.</p>` },

  { t: 'Defined once, used twice', giua: true, body: `
${zm(run(`WITH totals AS (
  SELECT user_id, sum(views) AS v
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id
)
SELECT t.user_id, t.v,
       round(100.0 * t.v / (SELECT sum(v) FROM totals), 1) AS pct
FROM totals t ORDER BY t.user_id;`, ` user_id |  v  | pct
---------+-----+------
       1 | 210 | 58.8
       2 | 105 | 29.4
       3 |  42 | 11.8
(3 rows)`, { hl: [7], hlOut: [3, 4, 5] }), 1.05)}
<p style="font-size:21px;margin:0">Each author’s <b>share of all views</b>: the CTE feeds both the row and the grand total. Write the subquery twice and the copies <b>drift apart</b> at the next edit; a CTE keeps one definition.</p>` },

  { t: 'The fan-out problem from Chapter 6', body: `
${fan7({ short: true })}
${zm(run(`SELECT u.name, sum(n.views) AS wrong_views
FROM app_user u JOIN note n ON n.user_id = u.id
JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;`, ` name  | wrong_views
-------+-------------
 Cuong |         240
 Lan   |          45
(2 rows)`, { hl: [3], hlOut: [3] }), 1.05)}` },

  { t: 'The fix: aggregate the “many” side first', giua: true, body: `
${zm(run(`WITH note_comments AS (
  SELECT note_id, count(*) AS comments
  FROM comment GROUP BY note_id
)
SELECT u.name, sum(n.views) AS total_views,
       coalesce(sum(nc.comments), 0) AS comments
FROM app_user u
JOIN note n ON n.user_id = u.id
LEFT JOIN note_comments nc ON nc.note_id = n.id
GROUP BY u.name ORDER BY u.name;`, ` name  | total_views | comments
-------+-------------+----------
 Cuong |         210 |        2
 Lan   |         105 |        1
 Minh  |          42 |        0
(3 rows)`, { hl: [1, 2, 3, 9], hlOut: [3, 4, 5] }), 0.98)}
<p style="font-size:21px;margin:0">The CTE collapses comments to <b>one row per note</b> before the join, so no note repeats. Cuong is <b>210</b> (not 240), and <b>Minh is back</b> thanks to the <code class="i">LEFT JOIN</code>. “Pre-aggregate, then join” is the definitive cure.</p>` },

  { t: 'What a CTE buys you', to: true, giua: true, body: `
${zm(cards([['Readability', 'The real reason. A chain of named CTEs reads like paragraphs; three nested subqueries read inside-out.'], ['Reuse', 'Reference it several times, define it once. A derived table would have to be repeated.'], ['Correctness', 'Aggregate a one-to-many side before joining so its rows do not multiply a sum.']], 3), 1.1)}
${box('Name steps by WHAT, not HOW', '<code class="i">author_stats</code>, <code class="i">note_comments</code>, <code class="i">best</code> — not <code class="i">t1</code>, <code class="i">sub</code>, <code class="i">x</code>. The name is the documentation.', 'lam')}` },

  { t: 'Optimisation fence? It changed in PostgreSQL 12', giua: true, body: `
${matPic()}
<p style="font-size:22px;margin:0">Before PG 12 every CTE was <b>materialised</b>: computed fully, then read. From <b>12</b> on, a CTE that is <b>referenced once</b> and has <b>no side effects</b> is <b>inlined</b> like a subquery, so a filter can be pushed inside. Override with <code class="i">AS MATERIALIZED</code> / <code class="i">AS NOT MATERIALIZED</code>. Advice written before 2019 says the opposite of today.</p>` },

  { t: 'Read the plans: inlined vs materialised', giua: true, body: `
${two(`<div><div class="tcap">default (referenced once) → inlined</div>${psql(`WITH w AS (SELECT * FROM big_note)
SELECT * FROM w WHERE user_id = 7;

Bitmap Heap Scan on big_note
  Recheck Cond: (user_id = 7)
  -> Bitmap Index Scan
       on big_note_user_id_idx`, { sm: true, hl: [4, 5, 6] })}</div>`,
`<div><div class="tcap">AS MATERIALIZED (or referenced twice)</div>${psql(`WITH w AS MATERIALIZED
  (SELECT * FROM big_note)
SELECT * FROM w WHERE user_id = 7;

CTE Scan on w
  Filter: (user_id = 7)
  CTE w
    -> Seq Scan on big_note`, { sm: true, hl: [5, 6, 8] })}</div>`)}
${two(box('Inlined', 'The planner treats the CTE as part of the outer query, finds the index on <code class="i">user_id</code> and reads only the matching rows.', 'xanh'), box('Materialised', '<b>Seq Scan</b> of the whole table into a temporary result, <b>then</b> a <code class="i">CTE Scan</code> filters it. Same rows, much more work.', 'bad'))}` },

  { t: 'Trap: a CTE is not a speed-up', giua: true, body: `
${cards([['AS MATERIALIZED', '<span style="font-size:42px;font-weight:800;color:#c0392b">18 ms</span><br>200,000 rows computed, 200 kept'], ['AS NOT MATERIALIZED', '<span style="font-size:42px;font-weight:800;color:#2f7d4f">0.5 ms</span><br>index scan, 200 rows read'], ['Verdict', '<span style="font-size:30px;font-weight:800;color:#b85a2b">same answer: 200</span><br>a CTE is a <b>naming</b> device']], 3)}
${box('Rule', 'Use a CTE when it makes the query <b>readable</b>. On PG 12+ an inlined CTE gives the <b>same plan</b> as the subquery — no faster; a forced MATERIALIZED one can be much <b>slower</b>. Want speed? <code class="i">EXPLAIN</code> (Chapter 10). Use <code class="i">MATERIALIZED</code> only to compute something expensive <b>once</b> and reuse it.', 'lam')}` },

  { t: 'A CTE that writes: DELETE … RETURNING → INSERT', giua: true, body: `
${zm(run(`BEGIN;
WITH gone AS (
  DELETE FROM note WHERE views < 20 RETURNING *
)
INSERT INTO note_archive
SELECT * FROM gone RETURNING id, title;
ROLLBACK;`, ` id |    title
----+--------------
  4 | Backup
  7 | Orphan draft
(2 rows)

INSERT 0 2`, { hl: [2, 3, 5, 6], hlOut: [3, 4] }), 1.05)}
<p style="font-size:21px;margin:0">PostgreSQL lets a CTE be <code class="i">INSERT</code>, <code class="i">UPDATE</code> or <code class="i">DELETE … RETURNING</code>: <b>move</b> rows from one table to another in <b>one atomic statement</b> — archive what you delete, with no gap between the two. (Rolled back here so the table keeps its 7 notes.)</p>` },

  { t: 'Data-modifying CTEs: what to know', giua: true, body: `
${zm(run(`BEGIN;
WITH d AS (DELETE FROM note WHERE id = 7 RETURNING id)
SELECT (SELECT count(*) FROM note) AS note_rows_seen,
       (SELECT count(*) FROM d)    AS deleted;
ROLLBACK;`, ` note_rows_seen | deleted
----------------+---------
              7 |       1`, { hl: [3, 4], hlOut: [3] }), 1.02)}
${steps(['They are <b>always executed to the end</b>, exactly once, even if the main query never reads them.', 'All parts see <b>the same snapshot</b>: the main query still sees the 7 rows — the delete is not visible to it. Use <code class="i">RETURNING</code> to pass the changed rows along.', 'Two parts must not change the <b>same row</b> — the outcome is unpredictable. T-SQL cannot do this (only <code class="i">OUTPUT</code> into a table).'])}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:370px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">WITH x AS (…) SELECT …</code> (previous statement needs <code class="i">;</code>)</td><td><b>Identical</b> idea; no such quirk</td></tr>
<tr><td>Recursive CTE: plain <code class="i">WITH</code></td><td><code class="i">WITH RECURSIVE</code> (lesson 7.4)</td></tr>
<tr><td>Always inlined, like a view; no hint</td><td>Inlined by default (PG 12+); <code class="i">MATERIALIZED</code> / <code class="i">NOT MATERIALIZED</code> to choose</td></tr>
<tr><td>DML in a CTE: not allowed (use <code class="i">OUTPUT</code>)</td><td><b>Allowed</b>: <code class="i">WITH d AS (DELETE … RETURNING *)</code></td></tr>
<tr><td>Column list <code class="i">WITH x (a, b) AS</code></td><td>Same</td></tr>
<tr><td>Temp table / table variable for steps</td><td>CTE for one statement; <code class="i">CREATE TEMP TABLE</code> to reuse across statements</td></tr>
</table>`, 1.02)}
${box('Good news', 'Everything you wrote with CTEs in T-SQL runs unchanged; PostgreSQL adds <b>writing CTEs</b> and an explicit <b>MATERIALIZED</b> switch.', 'xanh')}` },

  { t: 'In production: analytics and CT Shop', giua: true, body: `
${zm(run(`\\c ctshop   -- top 3 spenders (cancelled orders excluded)
WITH spent AS (
  SELECT o.customer_id, sum(i.qty * i.unit_price) AS total
  FROM orders o JOIN order_item i ON i.order_id = o.id
  WHERE o.status <> 'cancelled' GROUP BY o.customer_id
)
SELECT c.full_name, s.total FROM spent s
JOIN customer c ON c.id = s.customer_id
ORDER BY s.total DESC LIMIT 3;`, `   full_name    |    total
----------------+-------------
 Phạm Gia Trang | 12592000.00
 Vũ Gia Bình    | 10234000.00
 Đặng Văn An    | 10068000.00
(3 rows)`, { hl: [2, 3, 4, 5, 6], hlOut: [3, 4, 5] }), 0.92)}
${box('The same shape on cuongthai.com', 'The analytics dashboard shows <b>each post with its view total and its comment count</b>. It pre-aggregates comments per post in a CTE (<code class="i">post_comments</code>) and only then joins to <code class="i">posts</code> — otherwise a post with many comments would report an inflated view count. In CT Shop the CTE collapses 5,000 order lines to <b>one row per customer</b>.', 'lam')}` },

  { t: 'Exercise: two CTE queries', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code>, <code class="i">comment</code> and <code class="i">app_user</code>:</p>
<ol style="font-size:24px">
<li>Per author with <b>at least 2 notes</b>: <b>name, number of notes, best views</b>. Best first. Use a CTE.</li>
<li>For <b>every note</b>: title and a column <code class="i">has_comments</code> (true / false) — build the commented ids in a CTE with <code class="i">DISTINCT</code>.</li>
</ol>
${box('Before you run it — predict', 'How many rows does each query return — 3 authors qualify; and 7 notes appear in query 2 (even the ones with no comment). Which join or test keeps the uncommented notes?', 'lam')}
<p class="nho">Pause the video and write the queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`WITH per_user AS (
  SELECT user_id, count(*) AS notes,
         max(views) AS best
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id)
SELECT u.name, p.notes, p.best
FROM per_user p JOIN app_user u ON u.id = p.user_id
WHERE p.notes >= 2 ORDER BY p.best DESC;`, ` name  | notes | best
-------+-------+------
 Cuong |     2 |  120
 Lan   |     2 |   60
 Minh  |     2 |   30
(3 rows)`, { hlOut: [3, 4, 5] }), 0.94)}`,
`${zm(run(`WITH commented AS (
  SELECT DISTINCT note_id FROM comment)
SELECT n.title,
  (n.id IN (SELECT note_id FROM commented))
    AS has_comments
FROM note n ORDER BY n.id;`, `    title     | has_comments
--------------+--------------
 Intro to SQL | t
 Indexes      | f
 Timezones    | t
 Backup       | f
 JSONB        | f
 Window funcs | f
 Orphan draft | f
(7 rows)`, { hlOut: [3, 5] }), 0.94)}`)}
<p style="font-size:21px;margin:0">1) All three authors have exactly 2 notes. 2) The <b>IN</b> test returns a boolean per note, so no note is dropped — only notes 1 and 3 are <code class="i">t</code>. A plain INNER JOIN to <code class="i">commented</code> would have lost five notes.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol style="font-size:25px">
<li>Why would you choose a CTE over a nested subquery if the plan is the same?</li>
<li>How does a CTE fix the fan-out sum?</li>
<li>When is a CTE materialised in PostgreSQL 17, and why might that hurt?</li>
</ol>
${box('Answers', '<b>1.</b> Readability and reuse: named steps read top to bottom, and one definition can be used several times. <b>2.</b> It collapses the “many” side to one row per key <b>before</b> the join, so no row is repeated and sum() stays correct. <b>3.</b> When referenced <b>more than once</b>, when it has side effects (DML / volatile functions), or when you write <code class="i">AS MATERIALIZED</code>; it then computes everything before outer filters apply.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><code class="i">WITH name AS (…)</code> = a <b>named step</b>; chain with commas; reference more than once</li>
<li>CTEs are for <b>readability</b> and <b>correctness</b> (pre-aggregate, then join) — not for speed</li>
<li><b>PG 12+</b>: inlined by default; <code class="i">MATERIALIZED</code> / <code class="i">NOT MATERIALIZED</code> to choose</li>
<li>CTEs can <b>write</b>: <code class="i">WITH d AS (DELETE … RETURNING *) INSERT …</code></li>
</ul>
${box('Next: 7.4 — Recursive CTEs', 'What if a step must <b>feed itself</b> — an org chart, a category tree, a reply thread? <code class="i">WITH RECURSIVE</code> walks a hierarchy as deep as it goes.', 'lam')}` },
]);
