/**
 * pg-06-3 — PostgreSQL · Chapter 6 · Lesson 6.3 "HAVING vs WHERE, and FILTER" (slide EN, kiểu FU, 25/10/2026, agent c6).
 * Nguồn: content/courses/postgresql/s06-tong-hop.mjs › postgresql-6-3-having-filter. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-06-3.out.txt, schema ch06 + ctshop). Bổ sung: gian hàng chợ (đời thường: phiếu rách bỏ trước, gian dưới 50 bị loại sau),
 * thứ tự thực thi logic (hình), rổ + nắp HAVING (hình), alias trong HAVING/WHERE, HAVING không GROUP BY, planner đẩy điều kiện xuống (EXPLAIN),
 * FILTER ↔ SUM(CASE) ↔ T-SQL, một lượt quét (hình), pivot nhỏ, bẫy count(CASE … ELSE 0), FILTER không khớp, CT Shop thật, Prisma + raw.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { baskets, pipeline, onePass } from './pg-06-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-06-3', code: 'PG 6.3', title: 'HAVING vs WHERE, and FILTER', sub: 'Filter rows before grouping, groups after — and many totals in one pass' };

const NOTES7 = [['#1', 120, 0], ['#2', 90, 0], ['#3', null, 1], ['#4', 60, 0], ['#5', 45, 2], ['#6', 12, 1], ['#7', 30, 0]];

export const slides = lamDeck({ chuong: 'Chapter 6 — Aggregation & grouping', bai: '6.3' }, [
  { cover: true, t: 'HAVING vs WHERE,<br>and FILTER', sub: 'Two filters, two moments —<br>and several conditional totals in one query.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>Two filters, two moments</b>: <code class="i">WHERE</code> removes rows <b>before</b> grouping, <code class="i">HAVING</code> removes groups <b>after</b></li>
<li>The <b>logical order</b> SQL really runs in — it explains where every condition belongs</li>
<li>Using <b>both</b> in one query, and why the order changes the numbers</li>
<li>Traps: aggregates in <code class="i">WHERE</code>, aliases in <code class="i">HAVING</code>, conditions put in the wrong place</li>
<li><code class="i">FILTER (WHERE …)</code>: <b>several conditional totals in one pass</b> over the table</li>
<li>FILTER vs <code class="i">SUM(CASE …)</code>, and the <code class="i">count(CASE … ELSE 0)</code> trap</li>
</ul>
${box('Where we are', '6.1 summarised a table, 6.2 summarised <b>each group</b>. Now we <b>filter</b> — first the rows, then the groups — and build the one-row metrics panel every dashboard has.', 'lam')}` },

  { t: 'Everyday example first: the market stalls', giua: true, body: `
${baskets({ items: [[30, 0], [25, 0], [20, 0], [10, 1], [15, 1], [40, 2], [30, 2, true], [20, 2]].map(([v, g, x]) => ({ n: 'slip', v, g, x: !!x })), groups: [{ name: 'Stall A', stat: 'sum 75' }, { name: 'Stall B', stat: 'sum 25', out: true }, { name: 'Stall C', stat: 'sum 60' }], cap: 'HAVING sum > 50', h: 340 })}
<p style="font-size:22px;margin:0">Slips from three stalls. <b>Step 1:</b> throw away the torn slip (the crossed one) <b>before</b> adding anything — that is <code class="i">WHERE</code>. <b>Step 2:</b> total each stall, then send away every stall whose <b>total</b> is under 50 — that is <code class="i">HAVING</code>. Rows first, groups second.</p>` },

  { t: 'Two filters, two moments', giua: true, body: `
${pipeline({ hl: [1, 3] })}
${two(box('WHERE — before grouping', 'Looks at <b>one row at a time</b>. Cannot see any aggregate because no group exists yet. Cheap: it removes rows <b>before</b> the work of grouping.', 'info'),
box('HAVING — after grouping', 'Looks at <b>one group at a time</b>. Can use <code class="i">count()</code>, <code class="i">sum()</code>, <code class="i">avg()</code> of that group. Removes whole groups.', 'xanh'))}` },

  { t: 'HAVING: a WHERE for groups', giua: true, body: `
${zm(run(`SELECT u.name AS author, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
HAVING count(*) >= 3
ORDER BY notes DESC;`, ` author | notes
--------+-------
 Cuong  |     3
(1 row)`, { hl: [4], hlOut: [3] }), 1.3)}
<p style="font-size:22px;margin:0">“Authors with at least 3 notes.” Only <b>Cuong</b> survives <code class="i">HAVING count(*) &gt;= 3</code>. Lan and Minh were grouped and counted — then their <b>groups were discarded</b> because the count was too low.</p>` },

  { t: 'Why WHERE cannot do this', giua: true, body: `
${zm(run(`SELECT u.name, count(*)
FROM note n JOIN app_user u ON u.id = n.user_id
WHERE count(*) >= 3
GROUP BY u.name;`, `ERROR:  aggregate functions are not allowed in WHERE
LINE 3: WHERE count(*) >= 3
              ^`, { hl: [3], hlOut: [1] }), 1.3)}
${two(box('The message misleads', 'It sounds like a <b>permission</b> problem. It is an <b>order</b> problem: <code class="i">WHERE</code> runs before rows are grouped, so at that moment <b>no count exists yet</b>.', 'bad'),
box('The pair to memorise', 'Filter <b>individual rows</b> in <code class="i">WHERE</code>. Filter <b>whole groups</b> in <code class="i">HAVING</code>. If the condition mentions count / sum / avg → HAVING.', 'xanh'))}` },

  { t: 'The order SQL really runs in', giua: true, body: `
${pipeline({})}
${steps([
    '<b>FROM / JOIN</b> assemble the rows. <b>WHERE</b> filters single rows (it cannot see aggregates).',
    '<b>GROUP BY</b> collapses rows into groups. <b>HAVING</b> filters the groups (it <b>can</b> see aggregates).',
    '<b>SELECT</b> computes the output columns — this is why <b>aliases</b> exist only <b>after</b> HAVING. <b>ORDER BY / LIMIT</b> sort and trim.',
  ])}
<p class="nho">We <b>write</b> SELECT first, but it runs <b>fifth</b>. That one fact explains almost every “why can't I…” question in this lesson.</p>` },

  { t: 'WHERE and HAVING together', giua: true, body: `
${zm(run(`SELECT tag, count(*) AS notes, sum(views) AS total_views
FROM note
WHERE views IS NOT NULL       -- drop rows first
GROUP BY tag
HAVING sum(views) > 50        -- then drop small groups
ORDER BY tag;`, ` tag | notes | total_views
-----+-------+-------------
 sql |     4 |         300
(1 row)`, { hl: [3, 5], hlOut: [3] }), 1.2)}
<p style="font-size:22px;margin:0">WHERE first removed the <b>NULL-views</b> row; then grouping and summing; then HAVING kept only groups whose total exceeded 50. <b>sql (300)</b> qualified — date (45) and ops (12) fell short. Using both is not redundant: each does a different job.</p>` },

  { t: 'What each filter threw away', giua: true, body: `
${baskets({ items: NOTES7.map(([n, v, g]) => ({ n, v, g: v === null ? undefined : g === 1 ? 1 : g, x: v === null })).map((it, i) => ({ ...it, g: [0, 0, 1, 0, 2, 1, 0][i] })), groups: [{ name: 'sql', stat: '4 rows · sum 300' }, { name: 'ops', stat: '1 row · sum 12', out: true }, { name: 'date', stat: '1 row · sum 45', out: true }], cap: 'HAVING sum(views) > 50', h: 350 })}
<p style="font-size:22px;margin:0"><b>#3</b> (views NULL) is crossed out by <code class="i">WHERE views IS NOT NULL</code> — it never enters a basket. Of the three baskets, only <b>sql</b> passes the lid test <code class="i">sum &gt; 50</code>; ops (12) and date (45) are sent away.</p>` },

  { t: 'The same query without WHERE', giua: true, body: `
${zm(run(`SELECT tag, count(*) AS notes, sum(views) AS total_views
FROM note GROUP BY tag ORDER BY tag;`, ` tag  | notes | total_views
------+-------+-------------
 date |     1 |          45
 ops  |     2 |          12
 sql  |     4 |         300
(3 rows)`, { hlOut: [4] }), 1.3)}
${two(box('With WHERE views IS NOT NULL', '<b>ops</b> has <b>1</b> note: the NULL-views draft was removed <i>before</i> counting.', 'info'),
box('Without it', '<b>ops</b> has <b>2</b> notes: the draft still counts as a row for <code class="i">count(*)</code>.', 'bad'))}
<p class="nho">Same table, same HAVING — a different WHERE gives a different <code class="i">count(*)</code>. Filters before grouping change <b>what is counted</b>; filters after grouping only change <b>which groups are shown</b>.</p>` },

  { t: 'Aliases: HAVING cannot see them', giua: true, body: `
${zm(run(`SELECT tag, count(*) AS notes FROM note GROUP BY tag HAVING notes >= 2;`, `ERROR:  column "notes" does not exist
LINE 1: ..., count(*) AS notes FROM note GROUP BY tag HAVING notes >= 2...`, { hlOut: [1] }), 1.25)}
${zm(run(`SELECT views * 2 AS double_views FROM note WHERE double_views > 100;`, `ERROR:  column "double_views" does not exist
LINE 1: SELECT views * 2 AS double_views FROM note WHERE double_view...`, { hlOut: [1] }), 1.25)}
${two(box('Why', 'The alias is created by <b>SELECT</b> — step 5. <code class="i">WHERE</code> (2) and <code class="i">HAVING</code> (4) run <b>before</b> it, so the name does not exist yet.', 'bad'),
box('Fix', 'Repeat the expression: <code class="i">HAVING count(*) &gt;= 2</code>. Only <code class="i">ORDER BY</code> (6) runs after SELECT and may use the alias.', 'xanh'))}` },

  { t: 'HAVING without GROUP BY', giua: true, body: `
${zm(run(`SELECT count(*) AS notes FROM note HAVING count(*) > 5;
SELECT count(*) AS notes FROM note HAVING count(*) > 50;`, ` notes
-------
     7
(1 row)

 notes
-------
(0 rows)`, { hlOut: [3, 9] }), 1.25)}
<p style="font-size:22px;margin:0">With no <code class="i">GROUP BY</code> the whole table is <b>one group</b> (lesson 6.1). <code class="i">HAVING</code> keeps or drops that one group: first query returns its row, second returns <b>zero rows</b> — not a row with 0. Handy for “alert only if there are more than N”.</p>` },

  { t: 'A non-aggregate condition belongs in WHERE', giua: true, body: `
${zm(run(`EXPLAIN SELECT tag, count(*) FROM note GROUP BY tag HAVING tag = 'sql';
EXPLAIN SELECT tag, count(*) FROM note WHERE tag = 'sql' GROUP BY tag;`, `                         QUERY PLAN
------------------------------------------------------------
 GroupAggregate  (cost=0.00..19.65 rows=1 width=40)
   ->  Seq Scan on note  (cost=0.00..19.62 rows=4 width=32)
         Filter: (tag = 'sql'::text)

                         QUERY PLAN
------------------------------------------------------------
 GroupAggregate  (cost=0.00..19.65 rows=1 width=40)
   ->  Seq Scan on note  (cost=0.00..19.62 rows=4 width=32)
         Filter: (tag = 'sql'::text)`, { hlOut: [5, 11] }), 1.0)}
${two(box('PostgreSQL is smart…', 'It moved <code class="i">tag = \'sql\'</code> out of HAVING into a <b>scan filter</b> — the two plans are identical.', 'info'),
box('…but do not rely on it', 'Write <b>WHERE</b>: it says what you mean, works for every database, and it is the only form that helps when the planner cannot push it down.', 'xanh'))}` },

  { t: 'FILTER: several conditional totals in one pass', giua: true, body: `
${zm(run(`SELECT count(*)                            AS total,
       count(*) FILTER (WHERE tag='sql')   AS sql_notes,
       count(*) FILTER (WHERE pinned)      AS pinned_notes,
       sum(views) FILTER (WHERE tag='sql') AS sql_views
FROM note;`, ` total | sql_notes | pinned_notes | sql_views
-------+-----------+--------------+-----------
     7 |         4 |            2 |       300
(1 row)`, { hl: [2, 3, 4], hlOut: [3] }), 1.2)}
<p style="font-size:22px;margin:0">Often you want a total <b>and</b> a few sub-totals in <b>one row</b>: all notes, sql notes, pinned notes. Instead of four queries, attach <code class="i">FILTER (WHERE …)</code> to each aggregate — each one counts only the rows matching <b>its own</b> condition.</p>` },

  { t: 'One scan, four answers', giua: true, body: `
${onePass()}
<p style="font-size:22px;margin:0">PostgreSQL reads the table <b>once</b> and keeps four running counters; each row feeds only the counters whose <code class="i">FILTER</code> accepts it. Four separate queries would scan the table four times.</p>` },

  { t: 'FILTER = SUM(CASE …), written cleanly', giua: true, body: `
${zm(run(`SELECT count(*) AS total,
       sum(CASE WHEN tag = 'sql' THEN 1 ELSE 0 END) AS sql_notes,
       sum(CASE WHEN pinned THEN 1 ELSE 0 END) AS pinned_notes,
       sum(CASE WHEN tag = 'sql' THEN views END) AS sql_views
FROM note;`, ` total | sql_notes | pinned_notes | sql_views
-------+-----------+--------------+-----------
     7 |         4 |            2 |       300
(1 row)`, { hlOut: [3] }), 1.2)}
${two(box('The old way', '<code class="i">sum(CASE WHEN … THEN 1 ELSE 0 END)</code> — works in every database, but noisy and easy to get wrong.', 'info'),
box('The PostgreSQL way', '<code class="i">count(*) FILTER (WHERE …)</code> — same result, shorter, and the intent is obvious. Available since PostgreSQL 9.4.', 'xanh'))}` },

  { t: 'FILTER inside GROUP BY: a tiny pivot', giua: true, body: `
${zm(run(`SELECT u.name,
       count(*) FILTER (WHERE n.tag = 'sql')  AS sql,
       count(*) FILTER (WHERE n.tag = 'ops')  AS ops,
       count(*) FILTER (WHERE n.tag = 'date') AS date
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name ORDER BY u.name;`, `  name  | sql | ops | date
-------+-----+-----+------
 Cuong |   2 |   1 |    0
 Lan   |   1 |   0 |    1
 Minh  |   1 |   1 |    0
(3 rows)`, { hlOut: [3, 4, 5] }), 1.12)}
<p style="font-size:22px;margin:0">One row per author, <b>one column per tag</b> — a pivot table without any special syntax. Each cell is a filtered count over that author's rows. A tag with no matches gives <b>0</b>, not NULL.</p>` },

  { t: 'Trap: count(CASE … ELSE 0) counts everything', giua: true, body: `
${zm(run(`SELECT count(CASE WHEN tag = 'sql' THEN 1 ELSE 0 END) AS wrong,
       count(CASE WHEN tag = 'sql' THEN 1 END)        AS right_,
       count(*) FILTER (WHERE tag = 'sql')            AS filter
FROM note;`, ` wrong | right_ | filter
-------+--------+--------
     7 |      4 |      4
(1 row)`, { hlOut: [3] }), 1.25)}
${two(box('Why “wrong” is 7', '<code class="i">count(expr)</code> counts every <b>non-NULL</b> value. <code class="i">ELSE 0</code> is a value, not NULL — so all 7 rows count.', 'bad'),
box('Two correct forms', 'Drop the ELSE (the missing branch is NULL) or use <code class="i">sum(CASE … 1 ELSE 0 END)</code> — or just <code class="i">FILTER</code>, which cannot make this mistake.', 'xanh'))}` },

  { t: 'FILTER with no match: count 0, sum NULL', giua: true, body: `
${zm(run(`SELECT count(*) FILTER (WHERE tag = 'zzz')         AS c,
       sum(views) FILTER (WHERE tag = 'zzz')     AS s,
       coalesce(sum(views) FILTER (WHERE tag = 'zzz'), 0) AS s0
FROM note;`, ` c | s | s0
---+---+----
 0 |   |  0
(1 row)`, { hlOut: [3] }), 1.3)}
<p style="font-size:23px;margin:0">The same rule as 6.1: with <b>no matching rows</b>, <code class="i">count</code> gives <b>0</b> and <code class="i">sum</code> gives <b>NULL</b>. A metrics panel that prints “null” where it should print 0 is wrapping <code class="i">sum</code> without <code class="i">coalesce</code>.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:430px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">WHERE</code> before, <code class="i">HAVING</code> after grouping</td><td><b>Identical</b> — same order, same rule, same error text for aggregates in WHERE</td></tr>
<tr><td>No <code class="i">FILTER</code> clause</td><td><code class="i">count(*) FILTER (WHERE …)</code> — or <code class="i">SUM(CASE …)</code> if you want portable SQL</td></tr>
<tr><td><code class="i">COUNT(CASE WHEN … THEN 1 END)</code> or <code class="i">SUM(IIF(…, 1, 0))</code></td><td>Both work; <code class="i">IIF</code> does not exist — use <code class="i">CASE</code></td></tr>
<tr><td><code class="i">HAVING alias</code> → error</td><td>Same error: repeat the expression</td></tr>
<tr><td><code class="i">PIVOT</code> operator</td><td>No PIVOT — use <code class="i">FILTER</code> / <code class="i">CASE</code> columns, or the <code class="i">crosstab</code> extension</td></tr>
</table>`, 1.15)}
${box('Good news', 'The WHERE-vs-HAVING model you know transfers 100%. The new tool is <b>FILTER</b> — learn it and your T-SQL <code class="i">CASE</code> pivots get half as long.', 'xanh')}` },

  { t: 'In production: CT Shop dashboard', giua: true, body: `
${zm(run(`SELECT count(*) AS orders,
       count(*) FILTER (WHERE status = 'shipped')   AS shipped,
       count(*) FILTER (WHERE status = 'paid')      AS paid,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders;`, ` orders | shipped | paid | pending | cancelled
--------+---------+------+---------+-----------
   2000 |     910 |  753 |     180 |       157`, { hlOut: [3] }), 0.86)}
${zm(run(`SELECT city, count(*) AS customers
FROM customer GROUP BY city
HAVING count(*) > 60 ORDER BY customers DESC;`, `   city    | customers
-----------+-----------
 Cần Thơ   |        65
 Hải Phòng |        64
 Đà Nẵng   |        61
(3 rows)`, { hlOut: [3, 4, 5] }), 0.86)}
<p style="font-size:20px;margin:0">One row, <b>five numbers</b>, one scan of 2000 orders — they add up (910 + 753 + 180 + 157 = 2000). And <code class="i">HAVING</code> keeps the <b>3 cities with more than 60 customers</b> out of 5 (TP.HCM 54 and Hà Nội 56 are dropped).</p>` },

  { t: 'In production: the admin stats panel', body: `
${zm(sql(`-- cuongthai.com admin "system stats": ONE query instead of a dozen counts
SELECT count(*)                                         AS users,
       count(*) FILTER (WHERE role = 'ADMIN')           AS admins,
       count(*) FILTER (WHERE last_seen > now() - interval '7 days') AS active_7d
FROM users;`, { sm: true }), 1.2)}
${zm(sql(`// Prisma has no FILTER — use groupBy + having for “groups over a threshold”
const bigCities = await prisma.customer.groupBy({
  by: ['city'], _count: { _all: true },
  having: { city: { _count: { gt: 60 } } },   // HAVING count(*) > 60
});
// …and $queryRaw for FILTER metrics`, { sm: true, lang: 'typescript' }), 1.2)}
<p style="font-size:20px;margin:0">The site's “system stats” panel is exactly this one-row FILTER query: <b>one fast query</b> instead of a dozen counts behind the same dashboard. Prisma's <code class="i">having</code> is the <code class="i">HAVING</code> clause.</p>` },

  { t: 'Exercise: filter rows, then groups', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code> and <code class="i">app_user</code>:</p>
<ol style="font-size:24px">
<li>Authors whose <b>total views are at least 100</b>, ignoring notes that have no views yet. Show notes, total, and how many of them are <b>pinned</b>.</li>
<li>Does the answer change if you <b>remove</b> the “ignore no views” filter? Which numbers change?</li>
</ol>
${box('Before you run it — predict', 'Which authors pass? What does <code class="i">pinned</code> count for each of them? Cuong has 3 notes — will the result say 3 or 2?', 'lam')}
<p class="nho">Pause the video and write the query yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${zm(run(`SELECT u.name, count(*) AS notes,
       sum(n.views) AS total,
       count(*) FILTER (WHERE n.pinned) AS pinned
FROM note n JOIN app_user u ON u.id = n.user_id
WHERE n.views IS NOT NULL
GROUP BY u.name
HAVING sum(n.views) >= 100
ORDER BY total DESC;`, ` name  | notes | total | pinned
-------+-------+-------+--------
 Cuong |     2 |   210 |      2
 Lan   |     2 |   105 |      0
(2 rows)`, { hl: [5, 7], hlOut: [3, 4] }), 1.1)}
<p style="font-size:21px;margin:0">1) <b>Cuong</b> (210) and <b>Lan</b> (105) pass; Minh (42) is dropped by HAVING. Cuong shows <b>2</b> notes, not 3: WHERE removed “Draft ideas”. 2) Without the WHERE, Cuong would show <b>3</b> notes (the total stays 210 — NULL adds nothing) — only <code class="i">notes</code> changes.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>You write <code class="i">… WHERE count(*) &gt; 5 GROUP BY tag</code>. What happens and what is the fix?</li>
<li>Why does <code class="i">HAVING notes &gt;= 2</code> fail when <code class="i">notes</code> is an alias from the SELECT list?</li>
<li><code class="i">count(CASE WHEN x THEN 1 ELSE 0 END)</code> returns the total row count. Why, and what are two correct alternatives?</li>
</ol>
${box('Answers', '<b>1.</b> Error “aggregate functions are not allowed in WHERE” — move it to <code class="i">HAVING count(*) &gt; 5</code> (WHERE runs before grouping). <b>2.</b> HAVING runs <b>before</b> SELECT creates the alias; repeat <code class="i">count(*)</code>. <b>3.</b> <code class="i">count(expr)</code> counts every non-NULL value and 0 is non-NULL. Use <code class="i">count(CASE … THEN 1 END)</code> or <code class="i">count(*) FILTER (WHERE x)</code>.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><b>WHERE</b> filters rows <b>before</b> grouping; <b>HAVING</b> filters groups <b>after</b> — condition mentions an aggregate ⇒ HAVING</li>
<li>Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (aliases appear at step 5)</li>
<li>Use both when needed: WHERE changes <b>what is counted</b>, HAVING changes <b>which groups show</b></li>
<li><code class="i">count(*) FILTER (WHERE …)</code> builds a whole metrics row in <b>one scan</b>; beware <code class="i">ELSE 0</code> inside count</li>
</ul>
${box('Next: 6.4 — Aggregating over joins', 'Real queries aggregate <b>after a JOIN</b> — and a one-to-many join <b>copies rows</b>, silently inflating counts and sums. Next lesson shows the bug, how to spot it and the two ways to fix it.', 'lam')}` },
]);
