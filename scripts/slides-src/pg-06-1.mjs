/**
 * pg-06-1 — PostgreSQL · Chapter 6 · Lesson 6.1 "Aggregate functions: many rows into one number" (slide EN, kiểu FU, 25/10/2026, agent c6).
 * Nguồn: content/courses/postgresql/s06-tong-hop.mjs › postgresql-6-1-ham-tong-hop. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-06-1.out.txt, schema ch06 + ctshop). Bổ sung: phiếu thu ngân → phễu (đời thường), cột views có NULL
 * (hình), AVG chia 6 hay 7, NULL-as-zero, nhóm rỗng (count 0, còn lại NULL), kiểu trả về (avg numeric, sum bigint), bool_and/bool_or/string_agg/
 * array_agg/stddev/median, đối chiếu SQL Server (AVG của int cắt cụt), CT Shop thật, Prisma aggregate.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { receipts, foldColumn } from './pg-06-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-06-1', code: 'PG 6.1', title: 'Aggregate functions: many rows into one number', sub: 'COUNT, SUM, AVG, MIN, MAX — and what they do with NULL' };

const NOTE_COLS = ['id', 'user_id', 'title', 'tag', 'views', 'pinned'];
const NOTE_ROWS = [[1, 1, 'Intro to SQL', 'sql', 120, 't'], [2, 1, 'Indexes', 'sql', 90, 't'], [3, 1, 'Draft ideas', 'ops', null, 'f'], [4, 2, 'Joins', 'sql', 60, 'f'], [5, 2, 'Timezones', 'date', 45, 'f'], [6, 3, 'Backup', 'ops', 12, 'f'], [7, 3, 'Vacuum', 'sql', 30, 'f']];

export const slides = lamDeck({ chuong: 'Chapter 6 — Aggregation & grouping', bai: '6.1' }, [
  { cover: true, t: 'Aggregate functions:<br>many rows into one number', sub: 'COUNT, SUM, AVG, MIN, MAX —<br>and the NULL rule that trips everyone up.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why a <b>dashboard number</b> is always an aggregate</li>
<li>The five workhorses: <code class="i">count · sum · avg · min · max</code> — all in one query</li>
<li>The <b>NULL rule</b>: only <code class="i">count(*)</code> counts rows; every other aggregate skips NULL</li>
<li><code class="i">count(*)</code> vs <code class="i">count(col)</code> vs <code class="i">count(DISTINCT col)</code> — three different questions</li>
<li>Why <code class="i">avg</code> divides by <b>6, not 7</b> — and when that is the wrong answer</li>
<li>Empty groups, return types, and a few extra aggregates (<code class="i">bool_or</code>, <code class="i">string_agg</code>, median)</li>
</ul>
${box('Where we are', 'Chapter 5 joined tables. <b>Chapter 6 summarises them</b> — first the whole table (this lesson), then one summary per group (6.2), filtered groups (6.3) and summaries over joins (6.4).', 'lam')}` },

  { t: 'Everyday example first: the till at closing time', giua: true, body: `
${receipts({ items: ['120', '90', '60', '45', '12', '30'], result: 'SUM = 357', label: 'a drawer full of slips', after: 'the owner reads' })}
<p style="font-size:23px;margin:0">At closing time nobody reads <b>every receipt</b>. The owner wants <b>one</b> number: total sales, how many customers, the biggest sale. Folding many rows into one value is exactly what an <b>aggregate function</b> does. Every number on every dashboard you have seen is one.</p>` },

  { t: 'Our table: seven notes, one with no views', body: `
${zm(tbl(NOTE_COLS, NOTE_ROWS, { cap: 'note (schema ch06) — Draft ideas has views = NULL', hl: [2], o: [[2, 4]] }), 1.25)}
<ul style="font-size:23px;margin:6px 0 0">
<li><code class="i">views</code> is a nullable column: a note nobody has opened yet has <b>no number</b>, not zero.</li>
<li>Until now every query returned <b>one row per input row</b>. Aggregates do the opposite: <b>many rows in, one row out</b>.</li>
</ul>` },

  { t: 'The five workhorses', to: true, giua: true, body: `
${cards([
    ['count', 'How many? Rows or values'],
    ['sum', 'Total of a number column'],
    ['avg', 'Mean of the non-NULL values'],
    ['min', 'Smallest value (works on text and dates too)'],
    ['max', 'Largest value'],
    ['… and more', 'bool_or · string_agg · array_agg · stddev · median'],
  ], 3)}
${box('The shape', 'A query with an aggregate and <b>no GROUP BY</b> treats the <b>whole table as one group</b> and returns <b>exactly one row</b>.', 'lam')}` },

  { t: 'All five at once', giua: true, body: `
${zm(run(`SELECT count(*)                AS total_notes,
       count(views)            AS notes_with_views,
       count(DISTINCT user_id) AS authors,
       sum(views)              AS total_views,
       round(avg(views),1)     AS avg_views,
       min(views)              AS min_views,
       max(views)              AS max_views
FROM note;`, ` total_notes | notes_with_views | authors | total_views | avg_views | min_views | max_views
-------------+------------------+---------+-------------+-----------+-----------+-----------
           7 |                6 |       3 |         357 |      59.5 |        12 |       120
(1 row)`, { hl: [2, 3], hlOut: [3] }), 1.12)}
<p style="font-size:22px;margin:0">Seven input rows became <b>one</b> summary row. Notice that <code class="i">total_notes</code> is 7 but <code class="i">notes_with_views</code> is 6 — that gap is today's main lesson.</p>` },

  { t: 'How an aggregate reads a column', giua: true, body: `
${foldColumn()}` },

  { t: 'The NULL rule: count(*) vs count(col)', giua: true, body: `
${zm(run(`SELECT count(*) AS rows_all,
       count(views) AS non_null,
       count(*) - count(views) AS nulls
FROM note;`, ` rows_all | non_null | nulls
----------+----------+-------
        7 |        6 |     1
(1 row)`, { hl: [1, 2], hlOut: [3] }), 1.3)}
${two(box('count(*)', 'Counts <b>rows</b>. It never looks at a value, so NULLs are included. “How many notes exist?”', 'info'),
box('count(views)', 'Counts <b>non-NULL values</b> of that column. “How many notes have a views number?”', 'xanh'))}
<p class="nho">Rule to memorise: <b>count(*) counts rows; every other aggregate skips NULL.</b></p>` },

  { t: 'avg divides by 6, not 7', giua: true, body: `
${zm(run(`SELECT sum(views) AS s,
       sum(views)::numeric / 6 AS div6,
       sum(views)::numeric / 7 AS div7,
       avg(views) AS avg
FROM note;`, `  s  |        div6         |        div7         |         avg
-----+---------------------+---------------------+---------------------
 357 | 59.5000000000000000 | 51.0000000000000000 | 59.5000000000000000
(1 row)`, { hlOut: [3] }), 1.0)}
${two(box('What PostgreSQL does', '<code class="i">avg(views)</code> = 357 ÷ <b>6</b> = <b>59.5</b>. The NULL row is not “a zero” — it is simply <b>absent</b> from the average.', 'xanh'),
box('What you might have meant', 'If a missing value really means zero views, the honest answer is 357 ÷ <b>7</b> = <b>51.0</b>. SQL does not guess — <b>you</b> choose.', 'bad'))}` },

  { t: 'Decide on purpose: skip it or count it as zero', giua: true, body: `
${zm(run(`SELECT avg(views)               AS skip_null,
       avg(coalesce(views, 0))   AS null_as_zero
FROM note;`, `      skip_null      |    null_as_zero
---------------------+---------------------
 59.5000000000000000 | 51.0000000000000000
(1 row)`, { hlOut: [3] }), 1.25)}
${vsd(`<p style="font-size:21px;margin:0">Dashboard label says <b>“average views per note”</b> but the query is <code class="i">avg(views)</code>. It really answers “average among notes <b>that have a number</b>”.</p>`,
`<p style="font-size:21px;margin:0">Decide which one you mean. Missing = 0 → <code class="i">avg(coalesce(views, 0))</code>. Missing = unknown → keep <code class="i">avg(views)</code> and show <code class="i">count(views)</code> beside it so readers see the denominator.</p>`, '✗ Silent assumption', '✓ Explicit choice')}` },

  { t: 'Three counts, three questions', giua: true, body: `
${zm(run(`SELECT count(*)                AS rows_all,
       count(views)            AS with_views,
       count(DISTINCT user_id) AS authors,
       count(DISTINCT tag)     AS tags
FROM note;`, ` rows_all | with_views | authors | tags
----------+------------+---------+------
        7 |          6 |       3 |    3
(1 row)`, { hlOut: [3] }), 1.3)}
${cards([
    ['count(*)', '“How many <b>rows</b>?” → 7 notes'],
    ['count(col)', '“How many rows have a <b>value</b> here?” → 6'],
    ['count(DISTINCT col)', '“How many <b>different</b> values?” → 3 authors, 3 tags'],
  ], 3)}
<p class="nho">They are not interchangeable. Picking the wrong one is the classic “10,000 posters” bug: 10,000 posts written by 400 people.</p>` },

  { t: 'Empty input: count gives 0, the rest give NULL', giua: true, body: `
${zm(run(`SELECT count(*) AS c, sum(views) AS s, avg(views) AS a,
       min(views) AS mn, max(views) AS mx
FROM note WHERE tag = 'nothing';`, ` c | s | a | mn | mx
---+---+---+----+----
 0 |   |   |    |
(1 row)`, { hlOut: [3] }), 1.0)}
${zm(run(`SELECT coalesce(sum(views), 0) AS safe_sum
FROM note WHERE tag = 'nothing';`, ` safe_sum
----------
        0
(1 row)`, { hlOut: [3] }), 1.0)}
<p style="font-size:22px;margin:0">No rows still returns <b>one</b> row: <code class="i">count</code> is <b>0</b>, but <code class="i">sum / avg / min / max</code> are <b>NULL</b> — “nothing to add” is not the same as “zero”. That asymmetry is why <code class="i">coalesce(sum(x), 0)</code> is such a common wrapper.</p>` },

  { t: 'A group of only NULLs: sum is NULL, not 0', giua: true, body: `
${zm(run(`SELECT sum(views) AS s, count(views) AS c
FROM note WHERE id = 3;     -- Draft ideas`, ` s | c
---+---
   | 0
(1 row)`, { hlOut: [3] }), 1.35)}
${box('Why it matters', 'Row 3 exists, but its only <code class="i">views</code> is NULL, so the aggregate has <b>no value to add</b>. Reports that expect a number crash or print “null”. Wrap with <code class="i">coalesce</code> when a zero is the right display.', 'do2')}
${box('Check first', '<code class="i">count(views) = 0</code> tells you “nothing was summed” — a free sanity check next to any sum.', 'xanh')}` },

  { t: 'Trap: a plain column next to an aggregate', giua: true, body: `
${zm(run(`SELECT title, count(*) FROM note;`, `ERROR:  column "note.title" must appear in the GROUP BY clause or be used in an aggregate function
LINE 1: SELECT title, count(*) FROM note;
               ^`, { hlOut: [1] }), 1.25)}
${two(box('Why PostgreSQL refuses', '<code class="i">count(*)</code> collapses 7 rows to one. But which of the seven <b>titles</b> should sit beside it? There is no single answer, so there is no answer.', 'bad'),
box('Two ways out', 'Aggregate the column too (<code class="i">max(title)</code>), or <b>group</b> by it — that is next lesson, <code class="i">GROUP BY</code>.', 'xanh'))}` },

  { t: 'Trap: an aggregate inside WHERE', giua: true, body: `
${zm(run(`SELECT * FROM note WHERE views > avg(views);`, `ERROR:  aggregate functions are not allowed in WHERE
LINE 1: SELECT * FROM note WHERE views > avg(views);
                                         ^`, { hlOut: [1] }), 1.3)}
${two(box('Why', '<code class="i">WHERE</code> runs <b>before</b> any grouping. At that moment no average exists yet. It is about <b>order</b>, not permission.', 'bad'),
box('Where it belongs', 'Filter by an aggregate of <b>groups</b> with <code class="i">HAVING</code> (lesson 6.3). To compare with the table average use a <b>subquery</b> (Chapter 7).', 'xanh'))}` },

  { t: 'Return types: what comes back', giua: true, body: `
${zm(run(`SELECT pg_typeof(avg(views))   AS avg_type,
       pg_typeof(sum(views))   AS sum_type,
       pg_typeof(count(*))     AS count_type
FROM note;`, ` avg_type | sum_type | count_type
----------+----------+------------
 numeric  | bigint   | bigint
(1 row)`, { hlOut: [3] }), 1.0)}
${zm(run(`SELECT 7 / 2 AS int_div, 7 / 2.0 AS dec_div,
       sum(views) / count(views) AS sum_over_count
FROM note;`, ` int_div |      dec_div       | sum_over_count
---------+--------------------+----------------
       3 | 3.5000000000000000 |             59
(1 row)`, { hlOut: [3] }), 1.0)}
<p style="font-size:21px;margin:0"><code class="i">avg</code> of an integer column returns <b>numeric</b> (exact decimals); <code class="i">sum</code> of <code class="i">int</code> returns <b>bigint</b> (cannot overflow); <code class="i">count</code> is always <b>bigint</b>. But two integers divided by <code class="i">/</code> still <b>truncate</b>: <code class="i">357 / 6 = 59</code>.</p>` },

  { t: 'More aggregates you will meet', giua: true, body: `
${zm(run(`SELECT bool_or(pinned)  AS any_pinned,
       bool_and(pinned) AS all_pinned,
       every(views > 10) AS every_gt10
FROM note;`, ` any_pinned | all_pinned | every_gt10
------------+------------+------------
 t          | f          | t
(1 row)`, { hlOut: [3] }), 0.84)}
${zm(run(`SELECT string_agg(title, ', ' ORDER BY id) AS titles
FROM note WHERE user_id = 1;
SELECT array_agg(DISTINCT tag ORDER BY tag) AS tags FROM note;`, `               titles
------------------------------------
 Intro to SQL, Indexes, Draft ideas
(1 row)

      tags
----------------
 {date,ops,sql}
(1 row)`, { hlOut: [3, 8] }), 0.8)}
<p style="font-size:20px;margin:0"><code class="i">bool_or / bool_and / every</code>: any / all / every row is true. <code class="i">string_agg</code> glues text; <code class="i">array_agg</code> builds an array. Both accept <code class="i">ORDER BY</code> <b>inside</b> the call.</p>` },

  { t: 'Statistics: median and standard deviation', giua: true, body: `
${zm(run(`SELECT round(stddev(views), 2) AS sd,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY views) AS median
FROM note;`, `  sd   | median
-------+--------
 39.82 |   52.5
(1 row)`, { hlOut: [3] }), 1.3)}
${two(box('Mean vs median', 'The mean is 59.5, the median is 52.5. One huge note drags the mean up; the <b>median</b> (the middle value) shrugs it off — better for “typical” numbers.', 'info'),
box('Ordered-set aggregates', '<code class="i">percentile_cont(0.5) WITHIN GROUP (ORDER BY col)</code> is the PostgreSQL way to ask for a percentile. There is no <code class="i">median()</code> function.', 'xanh'))}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:420px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">AVG(int_col)</code> → <b>int</b>, truncated (357/6 → 59)</td><td><code class="i">avg(int_col)</code> → <b>numeric</b> 59.5 (no truncation)</td></tr>
<tr><td><code class="i">COUNT(*)</code> returns int (<code class="i">COUNT_BIG</code> for bigint)</td><td><code class="i">count(*)</code> is always <b>bigint</b></td></tr>
<tr><td><code class="i">STRING_AGG(x, ', ') WITHIN GROUP (ORDER BY y)</code></td><td><code class="i">string_agg(x, ', ' ORDER BY y)</code> — ORDER BY is <b>inside</b> the call</td></tr>
<tr><td>Warning “Null value is eliminated by an aggregate”</td><td>Same rule, but <b>silent</b> — no warning</td></tr>
<tr><td>No boolean aggregate — <code class="i">MAX(CAST(flag AS int))</code></td><td><code class="i">bool_or(flag)</code> · <code class="i">bool_and(flag)</code> · <code class="i">every(cond)</code></td></tr>
<tr><td><code class="i">PERCENTILE_CONT … OVER (…)</code> (window)</td><td><code class="i">percentile_cont(…) WITHIN GROUP (…)</code> — a true aggregate</td></tr>
</table>`, 1.12)}
${box('Good news', 'COUNT, SUM, AVG, MIN, MAX and the “skip NULL” rule are the <b>same</b> in both. The only change that can bite: <b>AVG of an integer column no longer truncates</b>.', 'xanh')}` },

  { t: 'In production: CT Shop, real numbers', giua: true, body: `
${zm(run(`\\c ctshop
SELECT count(*) AS orders, count(DISTINCT customer_id) AS customers FROM orders;
SELECT count(*) AS payments, sum(amount) AS revenue,
       round(avg(amount)) AS avg_payment, max(amount) AS largest
FROM payment;`, ` orders | customers
--------+-----------
   2000 |       290

 payments |   revenue    | avg_payment |  largest
----------+--------------+-------------+------------
     1663 | 946164000.00 |      568950 | 4600000.00`, { hlOut: [3, 8] }), 0.88)}
${zm(run(`SELECT count(*) AS rows_all, count(phone) AS with_phone,
       count(*) - count(phone) AS no_phone
FROM customer;`, ` rows_all | with_phone | no_phone
----------+------------+----------
      300 |        258 |       42`, { hlOut: [3] }), 0.88)}
<p style="font-size:19px;margin:0">2000 orders from <b>290</b> customers (10 never bought). Only 1663 orders have a payment: the shop's revenue is <b>946,164,000 ₫</b>. And <code class="i">count(phone)</code> reveals <b>42 customers without a phone number</b> — invisible if you only ever write <code class="i">count(*)</code>.</p>` },

  { t: 'In production: Prisma aggregate', body: `
${zm(sql(`// cuongthai.com — the admin dashboard numbers
const stats = await prisma.post.aggregate({
  _count: { _all: true, views: true },   // count(*), count(views)
  _sum:   { views: true },               // sum(views)
  _avg:   { views: true },               // avg(views)
  _min:   { views: true },
  _max:   { views: true },
});
// stats._sum.views → number | null   ← null on an empty table!

// “how many different authors posted?”
const authors = await prisma.post.findMany({
  distinct: ['authorId'], select: { authorId: true },
});   // Prisma has no count(DISTINCT): for large tables use $queryRaw`, { sm: true, lang: 'typescript' }), 0.98)}
<p style="font-size:20px;margin:0">Prisma's <code class="i">_count / _sum / _avg / _min / _max</code> are the same five aggregates. Note the return type: <code class="i">_sum</code> and <code class="i">_avg</code> are <b>nullable</b> — the same NULL rule you just learned, now in TypeScript.</p>` },

  { t: 'Exercise: three questions about the table', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">note</code>:</p>
<ol style="font-size:24px">
<li>How many notes have <b>at least 50 views</b>, what is their <b>total</b> and their <b>average</b>?</li>
<li>How many notes have <b>no views yet</b> (try it in <b>two</b> ways)?</li>
<li>Show the average views <b>treating missing as zero</b>, next to the plain average.</li>
</ol>
${box('Before you run it — predict', 'Which rows does question 1 keep? Is the NULL row among them? What will question 3 print for the first average?', 'lam')}
<p class="nho">Pause the video and write the three queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`SELECT count(*) AS big_notes,
       sum(views) AS total,
       round(avg(views), 1) AS avg
FROM note WHERE views >= 50;`, ` big_notes | total | avg
-----------+-------+------
         3 |   270 | 90.0`, { hlOut: [3] }), 1.0)}
${zm(run(`SELECT count(*) - count(views) AS a,
       count(*) FILTER (WHERE views IS NULL) AS b
FROM note;`, ` a | b
---+---
 1 | 1`, { hlOut: [3] }), 1.0)}`,
`${zm(run(`SELECT avg(views)             AS plain,
       avg(coalesce(views,0)) AS null_as_zero
FROM note;`, `        plain        |    null_as_zero
---------------------+---------------------
 59.5000000000000000 | 51.0000000000000000`, { hlOut: [3] }), 1.0)}`)}
<p style="font-size:21px;margin:0">1) <b>WHERE runs first</b>: views ≥ 50 drops the NULL row (NULL ≥ 50 is unknown) → 120, 90, 60 → 3 rows, 270, 90.0. 2) <code class="i">count(*) - count(views)</code> and <code class="i">count(*) FILTER (WHERE views IS NULL)</code> both give 1 (you will meet FILTER in 6.3). 3) 59.5 vs 51.0.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>A table has 10 rows; 4 of them have <code class="i">price = NULL</code>. What do <code class="i">count(*)</code> and <code class="i">count(price)</code> return?</li>
<li>Why does <code class="i">avg(rating)</code> sometimes disagree with “total ratings ÷ number of rows”?</li>
<li>What does <code class="i">sum(x)</code> return over a query that matches <b>no rows</b>?</li>
</ol>
${box('Answers', '<b>1.</b> 10 and 6. <b>2.</b> <code class="i">avg</code> divides by the number of <b>non-NULL</b> ratings, not by the number of rows — rows with no rating are absent from the average. <b>3.</b> <b>NULL</b> (not 0). <code class="i">count</code> is the only aggregate that returns 0 on empty input; wrap the others in <code class="i">coalesce</code> if a zero is what you want to display.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li>An <b>aggregate</b> folds many rows into one value; with no GROUP BY the whole table is one group</li>
<li><code class="i">count(*)</code> counts rows; <b>every other aggregate skips NULL</b> — <code class="i">avg</code> divides by the non-NULL count</li>
<li>Pick on purpose: <code class="i">count(*)</code> · <code class="i">count(col)</code> · <code class="i">count(DISTINCT col)</code></li>
<li>Empty input: <code class="i">count</code> → 0, the rest → NULL (use <code class="i">coalesce</code>)</li>
<li>Aggregates cannot sit in <code class="i">WHERE</code>, and a bare column cannot sit beside them</li>
</ul>
${box('Next: 6.2 — GROUP BY', 'One grand total is rarely enough. <b>GROUP BY</b> splits the rows into groups and runs the aggregate once <b>per group</b>: notes per author, revenue per month, users per city.', 'lam')}` },
]);
