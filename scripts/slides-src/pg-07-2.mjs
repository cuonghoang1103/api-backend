/**
 * pg-07-2 — PostgreSQL · Chapter 7 · Lesson 7.2 "Correlated subqueries, EXISTS & the NOT IN trap" (slide EN, kiểu FU, 25/10/2026, agent c7).
 * Nguồn: content/courses/postgresql/s07-subquery-cte.mjs › postgresql-7-2-correlated-exists. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-07-2.out.txt, schema ch07 + ctshop). Bổ sung: vòng lặp tương quan (hình), EXISTS dừng sớm
 * (2,5 ms vs 172 ms trên 400 000 dòng, đọc kế hoạch Semi Join / SubPlan), logic ba giá trị của NOT IN + NULL, ba cách sửa (NOT EXISTS,
 * IS NOT NULL, anti-join), LATERAL = CROSS/OUTER APPLY, tương quan trong WHERE, CT Shop (10 khách chưa mua).
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { loopPic, nullLogic, stopPic, twoStep } from './pg-07-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-07-2', code: 'PG 7.2', title: 'Correlated subqueries, EXISTS & the NOT IN trap', sub: 'A subquery that sees the outer row — and the NULL that bites' };

const NOTE = tbl(['id', 'user_id', 'title', 'views'], [[1, 1, 'Intro to SQL', 120], [2, 1, 'Indexes', 90], [3, 2, 'Timezones', 45], [4, 3, 'Backup', 12], [5, 3, 'JSONB', 30], [6, 2, 'Window funcs', 60], [7, null, 'Orphan draft', 5]], { cap: 'note' });
const COMMENT = tbl(['id', 'note_id', 'user_id', 'body'], [[1, 1, 2, 'Great intro!'], [2, 1, 3, 'Thanks'], [3, 3, 1, 'Very clear']], { cap: 'comment' });

export const slides = lamDeck({ chuong: 'Chapter 7 — Subqueries & CTEs', bai: '7.2' }, [
  { cover: true, t: 'Correlated subqueries,<br>EXISTS &amp; the NOT IN trap', sub: 'A subquery that looks at the outer row —<br>and the one NULL that empties your result.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>A <b>correlated</b> subquery: the inner query uses a column of the <b>current outer row</b></li>
<li>How to <b>see it run</b>: once per outer row — and the one question that tells you if it is correlated</li>
<li><code class="i">EXISTS</code> / <code class="i">NOT EXISTS</code>: “is there at least one?” — and why it <b>stops at the first hit</b></li>
<li>The <b>NOT IN + NULL</b> trap: exactly why it returns nothing, and three safe fixes</li>
<li><code class="i">LATERAL</code>, the correlated subquery in FROM (SQL Server: <code class="i">CROSS APPLY</code>)</li>
</ul>
${box('Where we are', 'Lesson 7.1 gave you subqueries that run <b>once</b>. Today the inner query gets to <b>look at the outer row</b> — that single change makes it far more powerful, and a little more dangerous.', 'lam')}` },

  { t: 'Everyday example first: the teacher with the list', giua: true, body: `
${twoStep({ a: ['Outer: one student at a time', 'next name on the list: Lan'], b: ['Inner: ask THIS student', 'did Lan hand in homework?'] })}
<p style="font-size:23px;margin:0">The teacher walks down the class list. For <b>each</b> name she asks a question that mentions <b>that</b> student — the question changes with every row. That is a <b>correlated subquery</b>. “Is there at least one?” (<i>Did anybody hand in anything?</i>) is <b>EXISTS</b>; she can stop asking the moment she hears the first “yes”.</p>` },

  { t: 'Our tables: note and comment', body: `
${two(NOTE, COMMENT, 'r64')}
<ul style="font-size:23px;margin:4px 0 0">
<li><code class="i">comment.note_id</code> points at <code class="i">note.id</code> — only notes 1 (two comments) and 3 (one comment) have any</li>
<li>Also in play: <code class="i">app_user</code> (Cuong, Lan, Minh, Ngoc — Ngoc wrote nothing) from 7.1</li>
</ul>` },

  { t: 'A correlated subquery: one lookup per outer row', giua: true, body: `
${zm(run(`SELECT n.title,
       (SELECT count(*) FROM comment c
        WHERE c.note_id = n.id) AS comments
FROM note n ORDER BY n.id;`, `    title     | comments
--------------+----------
 Intro to SQL |        2
 Indexes      |        0
 Timezones    |        1
 Backup       |        0
 JSONB        |        0
 Window funcs |        0
 Orphan draft |        0
(7 rows)`, { hl: [3], hlOut: [3, 5] }), 1.1)}
<p style="font-size:22px;margin:0">The inner query contains <code class="i">n.id</code> — a column of the <b>outer</b> query. So it cannot run once: it is re-evaluated <b>for each note</b>, counting that note's comments. Every row gets its own number, zeros included.</p>` },

  { t: 'Watch it run: the inner query changes with the row', giua: true, body: `
${zm(loopPic({ rows: [[1, 'Intro to SQL'], [2, 'Indexes'], [3, 'Timezones'], [4, 'Backup']], cur: 2, inner: ['SELECT count(*) FROM comment', 'WHERE note_id = 3   ← n.id of this row'], result: '→ 1' }), 1.0)}
<p style="font-size:22px;margin:0">The cursor sits on <b>Timezones</b> (id 3). PostgreSQL <b>substitutes</b> <code class="i">n.id = 3</code>, runs the inner query, gets <b>1</b>, writes it next to that row, and moves to the next note. Conceptually: <b>N outer rows → N inner executions</b>.</p>` },

  { t: 'Correlated or not? One question decides', body: `
${two(`<div class="card"><div class="h">Does the inner query mention an outer column?</div><p>That is the <b>entire</b> test. <code class="i">WHERE c.note_id = n.id</code> mentions <code class="i">n</code>, which comes from outside → <b>correlated</b>.</p></div>
<div class="card" style="margin-top:12px"><div class="h">Same question, uncorrelated</div><p><code class="i">(SELECT count(*) FROM comment)</code> mentions no outer column: it runs <b>once</b> and prints the same <b>3</b> on every row.</p></div>`,
`${run(`SELECT n.title,
 (SELECT count(*) FROM comment)
   AS all_comments
FROM note n ORDER BY n.id LIMIT 3;`, `    title     | all_comments
--------------+--------------
 Intro to SQL |            3
 Indexes      |            3
 Timezones    |            3
(3 rows)`, { hl: [2, 3], hlOut: [3, 4, 5] })}`, 'r46')}
${two(box('No → uncorrelated: runs ONCE', 'Evaluated a single time and reused. Cost does not depend on how many outer rows there are.', 'xanh'), box('Yes → correlated: conceptually per row', 'Ten thousand outer rows = ten thousand evaluations — <b>unless the planner rewrites it into a join</b>, which it often does (Chapter 10).', 'info'))}` },

  { t: 'EXISTS: “is there at least one?”', giua: true, body: `
${zm(run(`SELECT u.name
FROM app_user u
WHERE EXISTS (SELECT 1 FROM note n
              WHERE n.user_id = u.id)
ORDER BY u.id;`, ` name
-------
 Cuong
 Lan
 Minh
(3 rows)`, { hl: [3, 4], hlOut: [3, 4, 5] }), 1.2)}
<p style="font-size:22px;margin:0"><code class="i">EXISTS (subquery)</code> is just <b>true or false</b>: true if the inner query returns <b>at least one row</b>. “Users who wrote at least one note.” It is correlated (it mentions <code class="i">u.id</code>) — for each user: <i>is there a note for this user?</i></p>` },

  { t: 'NOT EXISTS: find the orphans', giua: true, body: `
${zm(run(`SELECT u.name
FROM app_user u
WHERE NOT EXISTS (SELECT 1 FROM note n
                  WHERE n.user_id = u.id)
ORDER BY u.id;`, ` name
------
 Ngoc
(1 row)`, { hl: [3, 4], hlOut: [3] }), 1.2)}
<p style="font-size:22px;margin:0">The same “find the rows with no partner” question you answered with <code class="i">LEFT JOIN … IS NULL</code> in lesson 5.2 — written as a subquery. It reads like the sentence: <b>users for whom no note exists</b>. Ngoc is the only one.</p>` },

  { t: 'Why “SELECT 1”? EXISTS ignores the select list', body: `
${two(run(`SELECT u.name FROM app_user u
WHERE EXISTS (SELECT * FROM note n
              WHERE n.user_id = u.id)
ORDER BY u.id;`, ` name
-------
 Cuong
 Lan
 Minh
(3 rows)`, { hlOut: [3, 4, 5] }), run(`SELECT u.name FROM app_user u
WHERE EXISTS (SELECT NULL FROM note n
              WHERE n.user_id = u.id)
ORDER BY u.id;`, ` name
-------
 Cuong
 Lan
 Minh
(3 rows)`, { hlOut: [3, 4, 5] }))}
${box('Remember', '<code class="i">EXISTS</code> only asks <b>“did a row come back?”</b> — never what is in it. <code class="i">SELECT 1</code>, <code class="i">SELECT *</code> and <code class="i">SELECT NULL</code> give identical results, and PostgreSQL does not even read the columns. <code class="i">SELECT 1</code> is the convention: it says “I don’t care what”.', 'lam')}` },

  { t: 'EXISTS stops at the first hit', giua: true, body: `
${stopPic()}
${cards([['EXISTS (…)', '<span style="font-size:40px;font-weight:800;color:#2f7d4f">2.5 ms</span><br>2,000 users · 400,000 notes · index on user_id'], ['count(*) &gt; 0', '<span style="font-size:40px;font-weight:800;color:#c0392b">172 ms</span><br>same data, same answer: 2000 users'], ['≈ 70× slower', '<span style="font-size:40px;font-weight:800;color:#b85a2b">400 000 rows</span><br>read to answer 2,000 yes/no questions']], 3)}` },

  { t: 'What the planner really does', giua: true, body: `
${two(`<div><div class="tcap">EXISTS → Nested Loop Semi Join</div>${psql(`Nested Loop Semi Join (actual rows=2000 loops=1)
  -> Seq Scan on big_user u
  -> Index Only Scan using big_note_user_id_idx
       on big_note n (actual rows=1 loops=2000)
       Index Cond: (user_id = u.id)`, { sm: true, hl: [1, 4] })}</div>`,
`<div><div class="tcap">count(*) &gt; 0 → SubPlan, once per user</div>${psql(`Seq Scan on big_user u
  Filter: ((SubPlan 1) > 0)
  SubPlan 1
    -> Aggregate (actual rows=1 loops=2000)
       -> Bitmap Heap Scan on big_note n
            (actual rows=200 loops=2000)
          Heap Blocks: exact=400000`, { sm: true, hl: [3, 6, 7] })}</div>`)}
${two(box('Semi join', '“Semi” = <b>keep the outer row if any partner exists</b>, and never multiply rows. Each probe reads <b>1</b> row (<code class="i">rows=1</code>) — then stops.', 'xanh'), box('count(*) > 0', 'Each probe reads <b>all 200</b> matching notes (<code class="i">rows=200 loops=2000</code>) just to throw the number away. The same <b>400 000</b> rows read in total.', 'bad'))}` },

  { t: 'The same mistake in two shapes', to: true, giua: true, body: `
${vsd(`<p style="margin:0"><code class="i">WHERE (SELECT count(*) …) &gt; 0</code><br><code class="i">WHERE (SELECT count(*) …) = 0</code></p><p style="font-size:20px;margin:6px 0 0">Counts <b>every</b> match to answer yes / no.</p>`, `<p style="margin:0"><code class="i">WHERE EXISTS (SELECT 1 …)</code><br><code class="i">WHERE NOT EXISTS (SELECT 1 …)</code></p><p style="font-size:20px;margin:6px 0 0">Stops at the <b>first</b> match.</p>`, '✗ Counting to answer yes/no', '✓ Ask the yes/no question')}
${box('Rule', 'Use a <b>count</b> when you want the <b>number</b>. Use <b>EXISTS</b> when you want the <b>answer yes or no</b>. On a user with 40 000 notes the count reads 40 000 rows to answer a question the first row already settled.', 'lam')}` },

  { t: 'The NOT IN trap: zero rows, no error', giua: true, body: `
${zm(run(`SELECT name FROM app_user
WHERE id NOT IN (SELECT user_id FROM note)
ORDER BY id;`, ` name
------
(0 rows)`, { hlOut: [3] }), 1.3)}
${box('Silently wrong', 'Ngoc <b>clearly</b> has no notes — yet the result is empty. The inner query returns <code class="i">{1, 1, 2, 3, 3, 2, NULL}</code>: the orphan draft has <code class="i">user_id NULL</code>. No error, no warning — a report that worked yesterday is empty today because <b>one NULL arrived</b>.', 'do2')}` },

  { t: 'Why: three-valued logic', body: `
${nullLogic()}
<p style="font-size:21px;margin:0">“Is 4 different from NULL?” is neither true nor false — it is <b>UNKNOWN</b> (Chapter 4’s NULL rule). <code class="i">AND</code> with one UNKNOWN can never become TRUE, and <code class="i">WHERE</code> keeps <b>only TRUE</b>. So <b>one NULL in the list poisons the entire NOT IN.</b></p>` },

  { t: 'IN survives NULL; NOT IN does not', giua: true, body: `
${zm(run(`SELECT 4 NOT IN (1,2,3)      AS clean,
       4 NOT IN (1,2,3,NULL) AS with_null,
       1 NOT IN (1,2,3,NULL) AS found_it;`, ` clean | with_null | found_it
-------+-----------+----------
 t     |           | f
(1 row)`, { hlOut: [3] }), 1.08)}
${zm(run(`SELECT 4 IN (1,2,3,NULL) AS in_miss,
       1 IN (1,2,3,NULL) AS in_hit;`, ` in_miss | in_hit
---------+--------
         | t
(1 row)`, { hlOut: [3] }), 1.08)}
<p style="font-size:21px;margin:0">A <b>match</b> is enough for IN (<code class="i">1 IN (…)</code> → true even with a NULL around). A <b>miss</b> is never certain when a NULL is present → NULL. <code class="i">NOT</code> of NULL is still NULL → row rejected.</p>` },

  { t: 'Three safe ways to write “find the missing”', to: true, body: `
${three3()}
${box('Prefer NOT EXISTS', 'It handles NULLs correctly, reads like the question, and PostgreSQL plans it as an <b>anti join</b>. <code class="i">NOT IN</code> is fine only when you are <b>certain</b> the subquery column can never be NULL (a <code class="i">NOT NULL</code> constraint is a promise worth checking).', 'xanh')}` },

  { t: 'NOT EXISTS is also faster to plan', giua: true, body: `
${two(`<div><div class="tcap">NOT EXISTS</div>${psql(`Hash Right Anti Join
  Hash Cond: (n.user_id = u.id)
  -> Seq Scan on note n
  -> Hash
       -> Seq Scan on app_user u`, { sm: true, hl: [1] })}</div>`,
`<div><div class="tcap">NOT IN</div>${psql(`Seq Scan on app_user u
  Filter: (NOT (ANY (id = (hashed SubPlan 1).col1)))
  SubPlan 1
    -> Seq Scan on note`, { sm: true, hl: [2, 3] })}</div>`)}
${box('Same answer on clean data, different plan', '<b>NOT EXISTS</b> becomes a real <b>anti join</b> (a join that keeps the rows with <i>no</i> partner) the planner can reorder and index. <b>NOT IN</b> must keep its NULL semantics, so it stays a filter over a hashed subplan. (Plans are covered in Chapter 10.)', 'lam')}` },

  { t: 'Correlated in WHERE: above my own average', giua: true, body: `
${zm(run(`SELECT n.title, n.views
FROM note n
WHERE n.views > (SELECT avg(n2.views) FROM note n2
                 WHERE n2.user_id = n.user_id)
ORDER BY n.id;`, `    title     | views
--------------+-------
 Intro to SQL |   120
 JSONB        |    30
 Window funcs |    60
(3 rows)`, { hl: [3, 4], hlOut: [3, 4, 5] }), 1.1)}
<p style="font-size:21px;margin:0">“Notes that beat <b>their own author’s</b> average.” The average is recomputed for each note's author — Cuong’s bar is 105, Lan’s 52.5, Minh’s 21. (The orphan has <code class="i">user_id NULL</code>, its average is NULL, the comparison is UNKNOWN: dropped.)</p>` },

  { t: 'LATERAL: a correlated subquery in FROM', giua: true, body: `
${zm(run(`SELECT u.name, x.title, x.views
FROM app_user u
LEFT JOIN LATERAL (
  SELECT n.title, n.views FROM note n
  WHERE n.user_id = u.id
  ORDER BY n.views DESC LIMIT 1) x ON true
ORDER BY u.id;`, `  name  |    title     | views
-------+--------------+-------
 Cuong | Intro to SQL |   120
 Lan   | Window funcs |    60
 Minh  | JSONB        |    30
 Ngoc  |              |
(4 rows)`, { hl: [3, 4, 5, 6], hlOut: [3, 4, 5, 6] }), 1.05)}
<p style="font-size:21px;margin:0">Normally a subquery in FROM cannot see the tables beside it. <b><code class="i">LATERAL</code></b> lifts that rule: it can use <code class="i">u.id</code>, so you can ask for the <b>top note of each user</b> (top-N-per-group). <code class="i">LEFT JOIN … ON true</code> keeps Ngoc with NULLs.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:360px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">EXISTS</code> / <code class="i">NOT EXISTS</code> / correlated scalar</td><td><b>Identical</b></td></tr>
<tr><td><code class="i">CROSS APPLY (SELECT TOP 1 …)</code></td><td><code class="i">CROSS JOIN LATERAL (SELECT … LIMIT 1)</code> — or <code class="i">JOIN LATERAL … ON true</code></td></tr>
<tr><td><code class="i">OUTER APPLY</code></td><td><code class="i">LEFT JOIN LATERAL … ON true</code></td></tr>
<tr><td><code class="i">NOT IN</code> + NULL → no rows</td><td><b>Same trap</b> (standard SQL three-valued logic)</td></tr>
<tr><td><code class="i">SET ANSI_NULLS OFF</code> “fixes” it (deprecated)</td><td>No such switch — always standard behaviour</td></tr>
<tr><td>Plan: “Left Semi / Left Anti Semi Join”</td><td>Plan: “Semi Join” / “Anti Join”</td></tr>
</table>`, 1.2)}
${box('Good news', 'EXISTS and the NOT IN trap are word for word the same. The one new keyword is <b>LATERAL</b> — your <code class="i">APPLY</code>.', 'xanh')}` },

  { t: 'In production: CT Shop and the onboarding bug', body: `
${zm(run(`\\c ctshop      -- 300 customers, 2000 orders
SELECT count(*) AS never_ordered
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o
                  WHERE o.customer_id = c.id);`, ` never_ordered
---------------
            10`, { hl: [4, 5], hlOut: [3] }), 1.05)}
${box('A real bug pattern', 'A “users who have not finished onboarding” query written with <code class="i">NOT IN</code> returned an <b>empty list</b> the moment one compared row held a NULL — it looked as if everybody had onboarded. Rewriting it as <b>NOT EXISTS</b> fixed it instantly. In Prisma, the same question is <code class="i">where: { orders: { none: {} } }</code>.', 'do2')}
<p class="nho">CT Shop customers 291–300 (10 people) never ordered; <code class="i">NOT IN</code> would also give 10 here — only because <code class="i">orders.customer_id</code> is NOT NULL. Safe today, a trap tomorrow.</p>` },

  { t: 'Exercise: three questions', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code>, <code class="i">comment</code> and <code class="i">app_user</code>:</p>
<ol style="font-size:24px">
<li>Notes with <b>no comment at all</b> (skip the orphan draft). Use <b>NOT EXISTS</b>.</li>
<li>Users who <b>wrote a comment</b>. Use <b>EXISTS</b>.</li>
<li>Rewrite “users with no notes” with <b>NOT IN</b> so that it <b>still works</b> when the column has NULLs.</li>
</ol>
${box('Before you run it — predict', 'How many rows will 1 and 2 return? Why would <code class="i">NOT IN (SELECT note_id FROM comment)</code> be safe here but not on <code class="i">note.user_id</code>?', 'lam')}
<p class="nho">Pause the video and write the queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`SELECT n.title FROM note n
WHERE NOT EXISTS (SELECT 1 FROM comment c
                  WHERE c.note_id = n.id)
  AND n.user_id IS NOT NULL
ORDER BY n.id;`, `    title
--------------
 Indexes
 Backup
 JSONB
 Window funcs
(4 rows)`, { hlOut: [3, 4, 5, 6] }), 1.0)}`,
`${zm(run(`SELECT u.name FROM app_user u
WHERE EXISTS (SELECT 1 FROM comment c
              WHERE c.user_id = u.id)
ORDER BY u.id;`, ` name
-------
 Cuong
 Lan
 Minh
(3 rows)`, { hlOut: [3, 4, 5] }), 1.0)}`)}
<p style="font-size:21px;margin:0">1) Four notes have no comments. 2) Lan and Minh commented on Intro, Cuong on Timezones. 3) <code class="i">WHERE id NOT IN (SELECT user_id FROM note <b>WHERE user_id IS NOT NULL</b>)</code> → Ngoc. <code class="i">comment.note_id</code> is declared <b>NOT NULL</b>, so NOT IN could never meet a NULL there.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol style="font-size:25px">
<li>What makes a subquery <b>correlated</b>? How many times does it run?</li>
<li>Why is <code class="i">EXISTS</code> better than <code class="i">(SELECT count(*) …) &gt; 0</code>?</li>
<li>Why does <code class="i">NOT IN</code> return no rows when the list contains a NULL?</li>
</ol>
${box('Answers', '<b>1.</b> The inner query mentions a column of the outer query; conceptually once per outer row (the planner may rewrite it into a join). <b>2.</b> EXISTS stops at the first matching row; count(*) must find them all. <b>3.</b> <code class="i">x &lt;&gt; NULL</code> is UNKNOWN, so the AND-chain of NOT IN is never TRUE and WHERE rejects every row. Use NOT EXISTS.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><b>Correlated</b> = the inner query uses an outer column → re-run per outer row (conceptually)</li>
<li><b>EXISTS / NOT EXISTS</b> ask yes/no and stop at the first row — prefer them to counting</li>
<li><b>NOT IN + NULL</b> = silent empty result; the safe default is <b>NOT EXISTS</b></li>
<li><b>LATERAL</b> is the correlated subquery in FROM (top-N per group)</li>
</ul>
${box('Next: 7.3 — CTEs (WITH)', 'Subqueries nested three deep are unreadable. A <b>CTE</b> gives each step a name — and cures the fan-out sum from Chapter 6.', 'lam')}` },
]);

function three3() {
  return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
<div>${psql(`SELECT u.name FROM app_user u
WHERE NOT EXISTS (
  SELECT 1 FROM note n
  WHERE n.user_id = u.id);

 name
------
 Ngoc`, { sm: true, hl: [7, 8], title: '1 · NOT EXISTS' })}</div>
<div>${psql(`SELECT name FROM app_user
WHERE id NOT IN (
  SELECT user_id FROM note
  WHERE user_id IS NOT NULL);

 name
------
 Ngoc`, { sm: true, hl: [4, 7, 8], title: '2 · NOT IN + IS NOT NULL' })}</div>
<div>${psql(`SELECT u.name FROM app_user u
LEFT JOIN note n
  ON n.user_id = u.id
WHERE n.id IS NULL;

 name
------
 Ngoc`, { sm: true, hl: [4, 7, 8], title: '3 · LEFT JOIN … IS NULL' })}</div>
</div>`;
}
