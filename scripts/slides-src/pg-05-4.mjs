/**
 * pg-05-4 — PostgreSQL · Chapter 5 · Lesson 5.4 "CROSS JOIN & the join traps" (slide EN, kiểu FU, 25/10/2026, agent c5).
 * Nguồn: content/courses/postgresql/s05-join.mjs › postgresql-5-4-cross-join-traps. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-05-4.out.txt, schema ch05 + ctshop). Bổ sung: lưới size × màu, lịch × người (generate_series),
 * nổ 1000×1000, 14.400 dòng khách × sản phẩm, join quên ON, fan-out (SUM 1120 thay vì 620 — và tiền thanh toán CT Shop phồng gần ba lần),
 * chẩn đoán bằng "bỏ SUM, nhìn dòng thô", gộp phía "nhiều" trước, WHERE vs ON, bản vá OR IS NULL sai, so sánh SQL Server, Prisma.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { crossGrid, fanPic } from './pg-05-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-05-4', code: 'PG 5.4', title: 'CROSS JOIN & the join traps', sub: 'Every combination — and why your totals go wrong' };

export const slides = lamDeck({ chuong: 'Chapter 5 — JOINs: combining tables', bai: '5.4' }, [
  { cover: true, t: 'CROSS JOIN<br>& the join traps', sub: 'Every combination on purpose —<br>and three ways a join makes your numbers wrong.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>CROSS JOIN</b>: every row with every row — when you want it, and the maths that explodes</li>
<li><b>Trap 1</b> — the accidental cross join (a forgotten condition)</li>
<li><b>Trap 2</b> — <b>fan-out</b>: one-to-many repeats the “one” side, so <code class="i">SUM</code> lies</li>
<li><b>Trap 3</b> — a WHERE on the optional side turns LEFT into INNER</li>
<li>A <b>debug routine</b> for “my numbers are wrong” and the real CT Shop example</li>
</ul>
${box('Where we are', '5.1 INNER, 5.2 OUTER, 5.3 many tables. This lesson closes the chapter with the mistakes that cause <b>most</b> wrong-number bugs in real reports.', 'lam')}` },

  { t: 'Everyday example first: shirt sizes × colours', giua: true, body: `
<div style="display:flex;gap:30px;align-items:center;justify-content:center">
${crossGrid({ rows: ['S', 'M', 'L'], cols: ['Red', 'Blue'] })}
<div style="font-size:26px;max-width:480px;line-height:1.4">A shop sells <b>3 sizes</b> in <b>2 colours</b>. The full catalogue is every size with every colour: <b>3 × 2 = 6</b> shirts. Nothing links a size to a colour — you just want <b>all combinations</b>. That is a <b>CROSS JOIN</b>.</div>
</div>` },

  { t: 'CROSS JOIN: every combination', giua: true, body: `
${zm(run(`SELECT size, color
FROM sz CROSS JOIN col
ORDER BY size, color;`, ` size | color
------+-------
 L    | Blue
 L    | Red
 M    | Blue
 M    | Red
 S    | Blue
 S    | Red
(6 rows)`, { hl: [2] }), 1.25)}
<p style="font-size:23px;margin:0"><b>No ON clause.</b> Each of the 3 sizes is paired with each of the 2 colours: 6 rows. The result has the columns of <i>both</i> tables.</p>` },

  { t: 'Three spellings, one operation', giua: true, body: `
${zm(run(`SELECT count(*) AS cross_rows FROM sz CROSS JOIN col;
SELECT count(*) AS comma_rows FROM sz, col;
SELECT count(*) AS on_true_rows FROM sz JOIN col ON true;`, ` cross_rows | comma_rows | on_true_rows
------------+------------+--------------
          6 |          6 |            6`, { hlOut: [3] }), 1.0)}
${two(box('Always say CROSS JOIN', 'The comma form and <code class="i">ON true</code> do the same thing, but a reader cannot tell if the product was <b>intended</b> or a forgotten condition. <code class="i">CROSS JOIN</code> says “yes, on purpose”.', 'xanh'),
box('Same as INNER with a condition that is always true', '<code class="i">JOIN … ON true</code> matches every pair — which is exactly what “no condition” means. A CROSS JOIN is the limiting case of every join.', 'info'))}` },

  { t: 'rows × rows: the product grows fast', body: `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
<div class="card"><div class="h">3 sizes × 2 colours</div><p style="font-size:44px;font-weight:800;color:#2f7d4f;margin:2px 0">6 rows</p><p>a catalogue</p></div>
<div class="card"><div class="h">1 000 × 1 000</div><p style="font-size:44px;font-weight:800;color:#e08a1e;margin:2px 0">1 000 000</p><p>two small tables</p></div>
<div class="card" style="border-color:#e3a59c;background:#fdf0ee"><div class="h" style="color:#b0281a">100 000 × 100 000</div><p style="font-size:44px;font-weight:800;color:#c0392b;margin:2px 0">10 billion</p><p>the server will not finish</p></div>
</div>
${zm(run(`SELECT count(*) AS big
FROM generate_series(1, 1000) a CROSS JOIN generate_series(1, 1000) b;`, `   big
---------
 1000000
(1 row)`, { hlOut: [3] }), 1.1)}
<p style="font-size:21px;margin:0">The result size is <b>rows(A) × rows(B)</b>, never “about as many as the bigger table”. Always estimate it <i>before</i> you press Enter.</p>` },

  { t: 'When a cross product is exactly right', body: `
${zm(run(`SELECT d::date AS day, u.name
FROM generate_series('2026-10-01'::date,
                     '2026-10-03'::date, '1 day') AS d
CROSS JOIN app_user u
WHERE u.id <= 2
ORDER BY d, u.id;`, `    day     | name
------------+-------
 2026-10-01 | Cuong
 2026-10-01 | Lan
 2026-10-02 | Cuong
 2026-10-02 | Lan
 2026-10-03 | Cuong
 2026-10-03 | Lan
(6 rows)`, { hl: [3, 4], hlOut: [3, 4] }), 0.92)}
${two(box('Build a grid', 'Every <b>day × user</b>, every <b>day × product</b>: the skeleton of a report. Then LEFT JOIN the real data onto it — days with no sales show <b>0</b> instead of vanishing (5.2).', 'xanh'),
box('Also useful', 'Test matrices (every browser × every size), seeding sample data, “all pairs” with a filter. <code class="i">generate_series</code> makes the number or date list in one call.', 'info'))}` },

  { t: 'Real data: how big is customers × products?', giua: true, body: `
${zm(run(`\\c ctshop
SELECT count(*) AS customers FROM customer;
SELECT count(*) AS customers_x_products
FROM customer CROSS JOIN product;`, ` customers
-----------
       300

 customers_x_products
----------------------
                14400`, { hlOut: [8] }), 1.2)}
<p style="font-size:23px;margin:0">300 customers × 48 products = <b>14 400</b> rows — still tiny. But join <code class="i">orders</code> (2 000) with <code class="i">order_item</code> (5 000) <i>by mistake</i> without a condition and you get <b>10 million</b>. The same keyword, a very different size.</p>` },

  { t: 'Trap 1: the accidental cross join', body: `
${zm(run(`SELECT n.title, u.name
FROM note n, app_user u
WHERE n.tag = 'sql'
ORDER BY n.id, u.id LIMIT 5;`, `    title     | name
--------------+-------
 Intro to SQL | Cuong
 Intro to SQL | Lan
 Intro to SQL | Minh
 Intro to SQL | Ngoc
 Indexes      | Cuong
(5 rows)`, { hlOut: [3, 4, 5, 6] }), 0.95)}
${zm(run(`SELECT n.title, u.name FROM note n JOIN app_user u;`, `ERROR:  syntax error at or near ";"`, { hlOut: [1] }), 0.95)}
<p style="font-size:20px;margin:0">Comma style, <b>no join condition</b>: the 2 sql-notes × 4 users = <b>8</b> rows, no error. <code class="i">JOIN</code> without <code class="i">ON</code> is a syntax error — use the keyword. Giveaway: <b>row count = rows(A) × rows(B)</b>.</p>` },

  { t: 'Trap 2: fan-out — the “one” side is repeated', giua: true, body: `
${fanPic()}
<p style="font-size:23px;margin:0">Joining a note to its <b>many</b> comments gives <b>one row per comment</b>. “Intro to SQL” has two comments, so the note appears twice — and any number stored on the note (<code class="i">reads</code> = 500) is <b>counted twice</b> by SUM. The join is correct; the aggregate is applied at the wrong <b>grain</b>.</p>` },

  { t: 'Fan-out with real numbers', body: `
${zm(run(`SELECT sum(s.reads) AS true_total
FROM note_stat s WHERE s.id IN (1, 3);

SELECT sum(s.reads) AS inflated_total
FROM note n
JOIN comment c   ON c.note_id = n.id
JOIN note_stat s ON s.id = n.id;`, ` true_total
------------
        620

 inflated_total
----------------
           1120`, { hlOut: [3, 8] }), 1.1)}
<p style="font-size:22px;margin:0">Notes 1 and 3 have 500 + 120 = <b>620</b> reads. After joining comments, note 1 (two comments) counts <b>twice</b>: 500 + 500 + 120 = <b>1120</b>. No error, a plausible number — and a wrong dashboard.</p>` },

  { t: 'Debug routine: delete the SUM, look at the rows', giua: true, body: `
${zm(run(`SELECT n.id, s.reads, c.id AS comment_id
FROM note n
JOIN comment c   ON c.note_id = n.id
JOIN note_stat s ON s.id = n.id
ORDER BY n.id, c.id;`, ` id | reads | comment_id
----+-------+------------
  1 |   500 |          1
  1 |   500 |          2
  3 |   120 |          3
(3 rows)`, { hlOut: [3, 4] }), 1.25)}
<p style="font-size:22px;margin:0">When a total is too big, the arithmetic is almost never wrong — the <b>row count</b> is. Run the bare join, count the rows, and <b>look</b>: note 1 / reads 500 appears twice. No rewrite of the SUM would ever have found that.</p>` },

  { t: 'The fix: aggregate the “many” side first', giua: true, body: `
${zm(run(`SELECT sum(s.reads) AS fixed_total
FROM note n
JOIN (SELECT note_id, count(*) AS comments
      FROM comment GROUP BY note_id) cc ON cc.note_id = n.id
JOIN note_stat s ON s.id = n.id;`, ` fixed_total
-------------
         620
(1 row)`, { hl: [3, 4], hlOut: [3] }), 1.25)}
<p style="font-size:22px;margin:0"><b>Collapse the many-side to one row per note</b> (a subquery or CTE — Chapter 7) and join <i>that</i>: each note now appears once, so <code class="i">sum</code> is right again — 620. Rule: <b>aggregate at the grain of the key you join on</b>, then join.</p>` },

  { t: 'Counting is easier: DISTINCT', giua: true, body: `
${zm(run(`SELECT count(*) AS rows_after_join,
       count(DISTINCT n.id) AS distinct_notes
FROM note n JOIN comment c ON c.note_id = n.id;`, ` rows_after_join | distinct_notes
-----------------+----------------
               3 |              2`, { hlOut: [3] }), 1.3)}
${two(box('Counts', '<code class="i">count(DISTINCT n.id)</code> ignores the repeats: 2 notes have comments, although the joined result has 3 rows.', 'xanh'),
box('Sums', 'DISTINCT does <b>not</b> rescue a SUM — <code class="i">sum(DISTINCT reads)</code> would drop two <i>different</i> notes that happen to have the same reads. Use the aggregate-first fix.', 'bad'))}` },

  { t: 'Real data: payments in CT Shop', body: `
${zm(run(`\\c ctshop
SELECT sum(p.amount) AS payments_total FROM payment p;

SELECT sum(p.amount) AS payments_inflated
FROM payment p
JOIN orders o      ON o.id = p.order_id
JOIN order_item oi ON oi.order_id = o.id;`, ` payments_total
----------------
   946164000.00

 payments_inflated
-------------------
     2837494000.00`, { hlOut: [3, 8] }), 1.05)}
<p style="font-size:21px;margin:0">1 663 payments total <b>946 164 000</b>. Join each payment to its order <i>items</i> (about 2.5 per order) and the same money is added again and again: <b>2 837 494 000</b> — three times too much, from a perfectly valid-looking join.</p>` },

  { t: 'Trap 3: WHERE on the optional side kills the LEFT', body: `
${two(`<div>${tbl(['name', 'title'], [['Cuong', 'Intro to SQL'], ['Cuong', 'Indexes']], { cap: 'LEFT JOIN … WHERE n.tag = \'sql\'  → 2 rows' })}</div>`,
`<div>${tbl(['name', 'title'], [['Cuong', 'Intro to SQL'], ['Cuong', 'Indexes'], ['Lan', null], ['Minh', null], ['Ngoc', null]], { cap: 'LEFT JOIN … ON … AND n.tag = \'sql\'  → 5 rows', hl: [2, 3, 4] })}</div>`)}
${zm(sql(`FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.tag = 'sql'            -- ✗  filters AFTER the join: padding rows die

FROM app_user u LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql'
                               -- ✓  filters WHILE matching: users stay`, { sm: true }), 1.0)}
${box('The rule (from 5.2)', 'On an OUTER JOIN, conditions that define the <b>match</b> go in <b>ON</b>; conditions that filter the <b>final result</b> go in <b>WHERE</b>. “Rows I expected are missing” is the classic symptom.', 'lam')}` },

  { t: 'A tempting patch that is still wrong', giua: true, body: `
${zm(run(`SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.tag = 'sql' OR n.id IS NULL
ORDER BY u.id, n.id;`, `  name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Ngoc  |
(3 rows)`, { hl: [3], hlOut: [5] }), 1.25)}
<p style="font-size:22px;margin:0">Adding <code class="i">OR n.id IS NULL</code> brings <b>Ngoc</b> back (no notes at all) — but <b>Lan and Minh</b> (who have notes, just not sql ones) are still lost. The honest fix is the filter in <code class="i">ON</code>; WHERE patches only hide part of the damage.</p>` },

  { t: 'Wrong number? A five-step checklist', to: true, giua: true, body: `
${steps([
    '<b>Count the rows</b> of the bare join (<code class="i">SELECT count(*)</code>) and compare with what you expect.',
    '<b>Remove the aggregate</b>, run <code class="i">SELECT *</code> and read the rows — look for repeated “one” rows (fan-out).',
    '<b>Check the keys:</b> is at least one side of every ON unique? (5.1) Is any ON missing (cross product)?',
    '<b>ON or WHERE?</b> on LEFT/RIGHT/FULL joins, is a right-table filter sitting in WHERE?',
    '<b>Fix the grain:</b> aggregate the many-side first, then join the one-row-per-key result.',
  ])}
${box('Habit', 'Before trusting a join in a report, ask: “how many rows should this return?” — then check. Wrong joins fail <b>silently</b>.', 'xanh')}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:370px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">CROSS JOIN</code>, <code class="i">FROM a, b</code></td><td><b>Identical</b></td></tr>
<tr><td>Number list: numbers table / <code class="i">spt_values</code> / recursive CTE (<code class="i">GENERATE_SERIES</code> only from 2022)</td><td><code class="i">generate_series(1, 1000)</code> built in — also for dates</td></tr>
<tr><td>Fan-out, ON-vs-WHERE, accidental cross join</td><td><b>The same traps</b>, same symptoms, same fixes</td></tr>
<tr><td><code class="i">CROSS APPLY</code> with a per-row function</td><td><code class="i">CROSS JOIN LATERAL</code> (5.3)</td></tr>
</table>`, 1.2)}
${box('Good news', 'The traps in this lesson are language-neutral: everything you know about row counts and grain from T-SQL transfers one-to-one.', 'xanh')}` },

  { t: 'In production: dashboards and Prisma', body: `
${zm(sql(`// cuongthai.com — how many comments does each post have?
// ✗ raw join then SUM/COUNT(*)  → fan-out risk
// ✓ let Prisma aggregate per post (a grouped sub-select, no repeated posts):
const posts = await prisma.post.findMany({
  select: { id: true, title: true, _count: { select: { comments: true } } },
});

// include a to-many relation → nested arrays, the parent is NOT repeated
const withComments = await prisma.post.findMany({ include: { comments: true } });`, { sm: true, lang: 'typescript' }), 1.05)}
${two(box('Why Prisma rarely fan-outs', 'A to-many <code class="i">include</code> returns <b>nested arrays</b>, so a post appears once; <code class="i">_count</code> aggregates per parent. The danger returns the moment you write a raw join with <code class="i">$queryRaw</code>.', 'info'),
box('And the other trap', 'A “show all users plus their latest sql note” panel must put the tag filter in <b>ON</b>, or brand-new users disappear from the list (Trap 3).', 'xanh'))}` },

  { t: 'Exercise: every day × every tag', giua: true, to: true, body: `
<p style="font-size:26px;margin:0">For <b>2026-10-01 and 2026-10-02</b> list <b>every pair (day, tag)</b> where tag is any tag used by a note. Then answer: how many rows will it return <i>before</i> you run it?</p>
${box('Hints', 'Which join has no ON? Where do the days come from (<code class="i">generate_series</code>)? Use <code class="i">SELECT DISTINCT tag</code> for the tag list. Expected size = days × distinct tags.', 'lam')}
<p class="nho">Pause the video and write it yourself — and say the row count first.</p>` },

  { t: 'Exercise: the answer', giua: true, body: `
${zm(run(`SELECT d::date AS day, t.tag
FROM generate_series('2026-10-01'::date,
                     '2026-10-02'::date, '1 day') AS d
CROSS JOIN (SELECT DISTINCT tag FROM note
            WHERE tag IS NOT NULL) t
ORDER BY d, t.tag;`, `    day     | tag
------------+------
 2026-10-01 | date
 2026-10-01 | misc
 2026-10-01 | ops
 2026-10-01 | sql
 2026-10-02 | date
 2026-10-02 | misc
 2026-10-02 | ops
 2026-10-02 | sql
(8 rows)`, { hl: [3, 4], hlOut: [3, 4, 5, 6] }), 1.0)}
<p style="font-size:21px;margin:0"><b>2 days × 4 tags = 8</b> rows. Predicting the count first is the habit that catches accidental cross joins: if you had expected 8 and seen 800, something is multiplying.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>A join of 2 000 orders and 5 000 order items returns 10 million rows. What went wrong?</li>
<li>Why does <code class="i">SUM(note.reads)</code> over <code class="i">note JOIN comment</code> give a number that is too large, and how do you find the cause fast?</li>
<li>Where does a filter on the <b>right</b> table of a LEFT JOIN belong if you want to keep all left rows?</li>
</ol>
${box('Answers', '<b>1.</b> The ON condition is missing or wrong, so it became a cross product (2 000 × 5 000). <b>2.</b> Fan-out: each note repeats once per comment, so its reads are summed once per comment; remove the SUM and read the raw rows. <b>3.</b> In <b>ON</b> — a WHERE would discard the NULL padding rows.', 'xanh')}` },

  { t: 'Chapter summary & what is next', to: true, giua: true, body: `
<ul>
<li><b>CROSS JOIN</b> = rows × rows — great for grids and calendars, deadly by accident</li>
<li><b>Fan-out:</b> joining across one-to-many repeats the “one” side — aggregate the many-side first</li>
<li><b>ON vs WHERE</b> on outer joins; <b>count the rows</b> before you trust a join</li>
</ul>
${box('Next: Chapter 6 — aggregation & GROUP BY', 'You can combine tables; next you <b>summarise</b> them — COUNT, SUM, AVG per group — exactly the tool that tames fan-out. Then Lab 3 practises JOINs + GROUP BY on the CT Shop database.', 'lam')}` },
]);
