/**
 * pg-08-4 — PostgreSQL · Chapter 8 · Lesson 8.4 "Window frames, FIRST_VALUE & NTILE" (slide EN, kiểu FU, 25/10/2026, agent c8).
 * Nguồn: content/courses/postgresql/s08-window.mjs › postgresql-8-4-frame-ntile. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-08-4.out.txt schema ch08 · pg-08-4b.out.txt DB ctshop). Bổ sung so với web: kính lúp nhiệt độ (đời thường),
 * thước khung, ba khung mặc định, trung bình trượt 3 ngày (lùi và căn giữa) + số dòng trong khung, hình khung trượt, ROWS vs RANGE ở dòng hoà
 * + hình, khoá phá hoà, GROUPS, RANGE theo khoảng thời gian, EXCLUDE CURRENT ROW, LAST_VALUE sửa bằng khung cả phân vùng, NTILE chia không đều
 * + hình, bẫy mép trung bình trượt (WINDOW đặt tên), CT Shop trung bình 7 ngày + nhóm khách theo quartile, SQL Server.
 */
import { lamDeck, run, two, box, kw } from './_pg-chung.mjs';
import { magnifier, frameRuler, slidingFrames, rowsVsRange, ntileBuckets } from './pg-08-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-08-4', code: 'PG 8.4', title: 'Window frames, FIRST_VALUE & NTILE', sub: 'Choose exactly which rows the window sees' };

export const slides = lamDeck({ chuong: 'Chapter 8 — Window functions', bai: '8.4' }, [
  { cover: true, t: 'Window frames,<br>FIRST_VALUE & NTILE', sub: 'Say exactly which rows around the current one<br>the window may see.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The ${kw('frame', 'the rows around the current one that the function sees')}: <code class="i">ROWS BETWEEN … AND …</code></li>
<li>The <b>default</b> frames you have been using without knowing it</li>
<li><b>Moving averages</b> (2-row, 3-day, centred) — and their honest edges</li>
<li><b>ROWS vs RANGE</b> at ties, <code class="i">GROUPS</code>, RANGE by <code class="i">interval</code>, <code class="i">EXCLUDE</code></li>
<li><code class="i">first_value</code>, fixing <code class="i">last_value</code>, and <code class="i">ntile</code> buckets — then CT Shop</li>
</ul>
${box('Remember from 8.3', 'With ORDER BY, sum() became a running total and last_value looked broken — both because of a frame you never wrote. Today you write it yourself.', 'lam')}` },

  { t: 'Everyday example first: a magnifier on the weather', giua: true, body: `
${magnifier()}
<p style="font-size:22px;margin:0">Daily temperatures jump around. To see the <b>trend</b>, look through a 3-day magnifier: for each day, average that day and the two before it, then slide one day right. That is a <b>moving average</b>, and the magnifier is the <b>frame</b>.</p>` },

  { t: 'The frame: which rows around the current one', giua: true, body: `
${frameRuler()}
${box('Syntax', '<code class="i">{ ROWS | RANGE | GROUPS } BETWEEN start AND end</code> — start/end are any of the five marks above. The yellow box is <code class="i">ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code>: the current row and the two before it. The frame never crosses a partition border.', 'lam')}` },

  { t: 'The frames you were already using', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
  sum(amount) OVER (PARTITION BY seller)                  AS no_order,
  sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS with_order,
  sum(amount) OVER (PARTITION BY seller ORDER BY sold_on
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS whole
FROM sale WHERE seller IN ('Alice', 'Bob') ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | no_order | with_order | whole
--------+------------+--------+----------+------------+--------
 Alice  | 2026-01-05 | 100.00 |   250.00 |     100.00 | 250.00
 Alice  | 2026-02-10 | 150.00 |   250.00 |     250.00 | 250.00
 Bob    | 2026-01-20 | 200.00 |   350.00 |     200.00 | 350.00
 Bob    | 2026-03-01 | 150.00 |   350.00 |     350.00 | 350.00
(4 rows)`, { hl: [4, 5] }), 1.0)}
${two(box('No ORDER BY', 'Frame = the <b>whole partition</b>.', 'lam'),
box('ORDER BY, no frame written', 'Frame = <code class="i">RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> → a running total.', 'bad'))}` },

  { t: 'A 2-row moving average', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
       round(avg(amount) OVER (PARTITION BY seller ORDER BY sold_on
                               ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 1) AS moving_avg2
FROM sale ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | moving_avg2
--------+------------+--------+-------------
 Alice  | 2026-01-05 | 100.00 |       100.0
 Alice  | 2026-02-10 | 150.00 |       125.0
 Bob    | 2026-01-20 | 200.00 |       200.0
 Bob    | 2026-03-01 | 150.00 |       175.0
 Carol  | 2026-01-15 | 300.00 |       300.0
 Carol  | 2026-02-20 | 250.00 |       275.0
 Dave   | 2026-02-05 | 180.00 |       180.0
 Dave   | 2026-03-10 | 220.00 |       200.0
(8 rows)`, { hl: [3], hlOut: [3, 4] }), 1.05)}
<p style="font-size:22px;margin:0"><code class="i">ROWS BETWEEN 1 PRECEDING AND CURRENT ROW</code> = this row and the one before. Alice’s second row: (100 + 150) / 2 = <b>125</b>. Her first row has no predecessor, so it averages <b>one</b> row: 100.</p>` },

  { t: 'A 3-day moving average: trailing and centred', giua: true, body: `
${two(`${zm(run(`SELECT day, revenue,
  round(avg(revenue) OVER (ORDER BY day
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS avg3,
  count(*) OVER (ORDER BY day
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rows_in
FROM daily ORDER BY day;`, `    day     | revenue | avg3  | rows_in
------------+---------+-------+---------
 2026-03-01 |     120 | 120.0 |       1
 2026-03-02 |      80 | 100.0 |       2
 2026-03-03 |     100 | 100.0 |       3
 2026-03-04 |     160 | 113.3 |       3
 2026-03-05 |      40 | 100.0 |       3
 2026-03-06 |     140 | 113.3 |       3
 2026-03-07 |     200 | 126.7 |       3
(7 rows)`, { hlOut: [3, 4] }), 0.92)}`,
`${zm(run(`SELECT day, revenue,
  round(avg(revenue) OVER (ORDER BY day
    ROWS BETWEEN 1 PRECEDING
             AND 1 FOLLOWING), 1)
    AS centered3
FROM daily ORDER BY day;`, `    day     | revenue | centered3
------------+---------+-----------
 2026-03-01 |     120 |     100.0
 2026-03-02 |      80 |     100.0
 2026-03-03 |     100 |     113.3
 2026-03-04 |     160 |     100.0
 2026-03-05 |      40 |     113.3
 2026-03-06 |     140 |     126.7
 2026-03-07 |     200 |     170.0
(7 rows)`, { hlOut: [3, 9] }), 0.92)}`)}
<p style="font-size:20px;margin:0"><b>Trailing</b> (2 PRECEDING … CURRENT ROW) uses only the past — what a live dashboard can know. <b>Centred</b> (1 PRECEDING … 1 FOLLOWING) looks one day ahead too — smoother for reports. <code class="i">rows_in</code> shows the first two days averaged fewer than 3 rows.</p>` },

  { t: 'Picture it: the frame slides with the current row', giua: true, body: `
${slidingFrames()}
<p style="font-size:22px;margin:0">The red arrow is the current row; the yellow box is its frame. Move the arrow down one day and the box moves with it — always the current day and the two before.</p>` },

  { t: 'ROWS vs RANGE: the difference appears at ties', giua: true, body: `
${zm(run(`SELECT seller, amount,
  sum(amount) OVER (ORDER BY amount ROWS  BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_sum,
  sum(amount) OVER (ORDER BY amount RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_sum
FROM sale ORDER BY amount, id;`, ` seller | amount | rows_sum | range_sum
--------+--------+----------+-----------
 Alice  | 100.00 |   100.00 |    100.00
 Alice  | 150.00 |   250.00 |    400.00
 Bob    | 150.00 |   400.00 |    400.00
 Dave   | 180.00 |   580.00 |    580.00
 Bob    | 200.00 |   780.00 |    780.00
 Dave   | 220.00 |  1000.00 |   1000.00
 Carol  | 250.00 |  1250.00 |   1250.00
 Carol  | 300.00 |  1550.00 |   1550.00
(8 rows)`, { hl: [2, 3], hlOut: [4, 5] }), 1.0)}
<p style="font-size:22px;margin:0"><b>ROWS</b> counts physical rows: Alice’s 150 stops at herself → 250. <b>RANGE</b> works on <b>values</b>: “current row” means every row with the same amount, so both 150s see 400. Without ties the two columns are identical — which is why the bug hides.</p>` },

  { t: 'Picture it: same current row, two different frames', giua: true, body: `
${rowsVsRange()}
<p style="font-size:22px;margin:0">RANGE is the <b>default</b> when you write ORDER BY without a frame — that is the “running total jumps” trap from 8.3. On a column with duplicates (dates of orders, prices, scores) decide which one you mean.</p>` },

  { t: 'Two fixes: a tiebreaker — or GROUPS on purpose', giua: true, body: `
${two(`<div>${zm(run(`SELECT seller, amount,
  sum(amount) OVER (ORDER BY amount, id)
    AS running_tiebreak
FROM sale ORDER BY amount, id;`, ` seller | amount | running_tiebreak
--------+--------+------------------
 Alice  | 100.00 |           100.00
 Alice  | 150.00 |           250.00
 Bob    | 150.00 |           400.00
 Dave   | 180.00 |           580.00
 … 4 more rows, ending at 1550.00
(8 rows)`, { hlOut: [4] }), 0.95)}
${box('Tiebreaker', 'With <code class="i">id</code> added there are no peers left, so even the default RANGE frame behaves like ROWS.', 'xanh')}</div>`,
`<div>${zm(run(`SELECT seller, amount,
  sum(amount) OVER (ORDER BY amount
    GROUPS BETWEEN 1 PRECEDING
           AND CURRENT ROW) AS g
FROM sale ORDER BY amount, id;`, ` seller | amount |   g
--------+--------+--------
 Alice  | 100.00 | 100.00
 Alice  | 150.00 | 400.00
 Bob    | 150.00 | 400.00
 Dave   | 180.00 | 480.00
 Bob    | 200.00 | 380.00
 … 3 more rows
(8 rows)`, { hlOut: [6] }), 0.95)}
${box('GROUPS (PostgreSQL)', 'Counts <b>groups of peers</b>, not rows: “this value and the previous value”. Dave’s 180 = 180 + (150 + 150) = <b>480</b>.', 'lam')}</div>`)}` },

  { t: 'PostgreSQL extras: RANGE by interval, EXCLUDE', giua: true, body: `
${two(`<div>${zm(run(`SELECT day, n,
  sum(n) OVER (ORDER BY day ROWS
    BETWEEN 2 PRECEDING AND CURRENT ROW)
    AS last3_rows,
  sum(n) OVER (ORDER BY day RANGE
    BETWEEN INTERVAL '2 days' PRECEDING
        AND CURRENT ROW) AS last3_days
FROM signup ORDER BY day;`, `    day     | n | last3_rows | last3_days
------------+---+------------+------------
 2026-03-01 | 5 |          5 |          5
 2026-03-02 | 3 |          8 |          8
 2026-03-05 | 4 |         12 |          4
 2026-03-06 | 6 |         13 |         10
(4 rows)`, { hlOut: [5] }), 0.92)}
${box('Calendar, not rows', 'On 5 March, “last 3 <b>rows</b>” reaches back to 1 March (12); “last 3 <b>days</b>” = 3–5 March = only <b>4</b>. RANGE with an interval respects gaps.', 'xanh')}</div>`,
`<div>${zm(run(`SELECT region, seller, amount,
  round(avg(amount) OVER (PARTITION BY region
    ORDER BY amount ROWS BETWEEN UNBOUNDED
    PRECEDING AND UNBOUNDED FOLLOWING
    EXCLUDE CURRENT ROW), 2) AS avg_of_others
FROM sale ORDER BY region, id;`, ` region | seller | amount | avg_of_others
--------+--------+--------+---------------
 North  | Alice  | 100.00 |        166.67
 North  | Alice  | 150.00 |        150.00
 North  | Bob    | 200.00 |        133.33
 North  | Bob    | 150.00 |        150.00
 … South: 216.67 · 233.33 · 256.67 · 243.33
(8 rows)`, { hlOut: [3] }), 0.92)}
${box('EXCLUDE CURRENT ROW', 'The frame without the row itself: Alice’s 100 vs the <b>others</b> in North = (150+200+150)/3 = 166.67.', 'lam')}</div>`)}` },

  { t: 'first_value — and the last_value fix', giua: true, body: `
${two(`${zm(run(`SELECT region, seller, amount,
  first_value(amount) OVER (PARTITION BY region
    ORDER BY amount DESC) AS top_amount
FROM sale ORDER BY region, amount DESC, seller;`, ` region | seller | amount | top_amount
--------+--------+--------+------------
 North  | Bob    | 200.00 |     200.00
 North  | Alice  | 150.00 |     200.00
 North  | Bob    | 150.00 |     200.00
 North  | Alice  | 100.00 |     200.00
 South  | Carol  | 300.00 |     300.00
 South  | Carol  | 250.00 |     300.00
 South  | Dave   | 220.00 |     300.00
 South  | Dave   | 180.00 |     300.00
(8 rows)`, { hlOut: [3, 7] }), 0.9)}`,
`${zm(run(`SELECT region, seller, amount,
  last_value(amount) OVER (PARTITION BY region
    ORDER BY amount DESC) AS last_default,
  last_value(amount) OVER (PARTITION BY region
    ORDER BY amount DESC ROWS BETWEEN UNBOUNDED
    PRECEDING AND UNBOUNDED FOLLOWING) AS last_fixed
FROM sale ORDER BY region, amount DESC, seller;`, ` region | seller | amount | last_default | last_fixed
--------+--------+--------+--------------+------------
 North  | Bob    | 200.00 |       200.00 |     100.00
 North  | Alice  | 150.00 |       150.00 |     100.00
 North  | Bob    | 150.00 |       150.00 |     100.00
 North  | Alice  | 100.00 |       100.00 |     100.00
 South  | Carol  | 300.00 |       300.00 |     180.00
 … 3 more rows: last_fixed 180.00
(8 rows)`, { hlOut: [3, 4] }), 0.9)}`)}
<p style="font-size:20px;margin:0"><b>first_value</b> reads the top of the frame — fine with the default frame (the top is the partition start). <b>last_value</b> reads the bottom, which by default is the current row; open the frame to <code class="i">UNBOUNDED FOLLOWING</code> and it returns the real last value. Same for <code class="i">nth_value(x, n)</code>.</p>` },

  { t: 'NTILE: split the rows into equal buckets', giua: true, body: `
${zm(run(`SELECT seller, amount,
       ntile(2) OVER (ORDER BY amount DESC) AS half
FROM sale ORDER BY amount DESC, seller;`, ` seller | amount | half
--------+--------+------
 Carol  | 300.00 |    1
 Carol  | 250.00 |    1
 Dave   | 220.00 |    1
 Bob    | 200.00 |    1
 Dave   | 180.00 |    2
 Alice  | 150.00 |    2
 Bob    | 150.00 |    2
 Alice  | 100.00 |    2
(8 rows)`, { hl: [2], hlOut: [3, 7] }), 1.1)}
<p style="font-size:22px;margin:0"><code class="i">ntile(n)</code> deals the ordered rows into <b>n buckets</b> and labels each row with its bucket number. ntile(2) = top / bottom half, <b>ntile(4) = quartiles</b>, ntile(100) = percentiles — no thresholds to compute by hand.</p>` },

  { t: 'NTILE when the rows do not divide evenly', giua: true, body: `
${two(`${zm(run(`SELECT seller, amount,
  ntile(3) OVER (ORDER BY amount DESC, id)
    AS third
FROM sale ORDER BY amount DESC, id;`, ` seller | amount | third
--------+--------+-------
 Carol  | 300.00 |     1
 Carol  | 250.00 |     1
 Dave   | 220.00 |     1
 Bob    | 200.00 |     2
 Dave   | 180.00 |     2
 Alice  | 150.00 |     2
 Bob    | 150.00 |     3
 Alice  | 100.00 |     3
(8 rows)`), 0.95)}`, `<div><div style="zoom:0.62">${ntileBuckets()}</div>
${box('Watch the tie', 'NTILE cuts by <b>position</b>, not value: the two 150s land in <b>different</b> buckets. Add a tiebreaker so the cut is at least repeatable.', 'bad')}</div>`, 'r46')}` },

  { t: 'Trap: a moving average that lies at the edges', giua: true, body: `
${zm(run(`SELECT day, revenue,
       CASE WHEN count(*) OVER w3 = 3 THEN round(avg(revenue) OVER w3, 1) END AS avg3_full
FROM daily
WINDOW w3 AS (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
ORDER BY day;`, `    day     | revenue | avg3_full
------------+---------+-----------
 2026-03-01 |     120 |
 2026-03-02 |      80 |
 2026-03-03 |     100 |     100.0
 2026-03-04 |     160 |     113.3
 2026-03-05 |      40 |     100.0
 2026-03-06 |     140 |     113.3
 2026-03-07 |     200 |     126.7
(7 rows)`, { hl: [2, 4], hlOut: [3, 4] }), 0.9)}
${box('A “3-day average” of one day', 'On day 1 the frame holds 1 row, on day 2 two rows — yet the column is called a 3-day average, so charts of new products always “start with wild swings”. Count the rows in the same frame and return NULL until the window is full: a gap is more honest than a fake number.', 'bad')}` },

  { t: 'CT Shop: a 7-day average and spending quartiles', giua: true, body: `
${two(`${zm(run(`WITH d AS (
  SELECT g::date AS day, coalesce(sum(p.amount), 0) AS revenue
  FROM generate_series(date '2026-09-01', date '2026-09-30',
                       interval '1 day') g
  LEFT JOIN payment p ON p.paid_at::date = g::date
  GROUP BY 1
), w AS (
  SELECT day, revenue, round(avg(revenue) OVER (ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) AS avg7
  FROM d
)
SELECT * FROM w WHERE day >= '2026-09-24' ORDER BY day;`, `    day     |  revenue   |  avg7
------------+------------+---------
 2026-09-24 | 3024000.00 | 1376000
 2026-09-25 | 1960000.00 | 1485714
 2026-09-26 | 3174000.00 | 1917714
 2026-09-27 |  763000.00 | 1395429
 2026-09-28 | 1897000.00 | 1613000
 2026-09-29 |  264000.00 | 1590857
 2026-09-30 | 1455000.00 | 1791000
(7 rows)`, { title: 'psql (17.11) — ctshop' }), 0.78)}`,
`${zm(run(`WITH spend AS (
  SELECT o.customer_id, sum(p.amount) AS spent
  FROM payment p JOIN orders o ON o.id = p.order_id
  GROUP BY o.customer_id
), q AS (
  SELECT spent, ntile(4) OVER
    (ORDER BY spent DESC, customer_id) AS quartile
  FROM spend
)
SELECT quartile, count(*) AS customers,
       min(spent) AS from_spent, max(spent) AS to_spent
FROM q GROUP BY quartile ORDER BY quartile;`, ` quartile | customers | from_spent |  to_spent
----------+-----------+------------+-------------
        1 |        73 | 4485000.00 | 10634000.00
        2 |        73 | 2808000.00 |  4478000.00
        3 |        72 | 1735000.00 |  2807000.00
        4 |        72 |    7000.00 |  1734000.00
(4 rows)`, { title: 'psql (17.11) — ctshop', hlOut: [3] }), 0.78)}`)}
<p style="font-size:19px;margin:0">Left: generate_series fills days without payments (8.3), then a <b>7-day trailing frame</b> smooths the daily noise (264,000 đ on 29 Sep, average still 1.59 M). Right: <b>ntile(4)</b> splits the 290 paying customers into quartiles (73 · 73 · 72 · 72 — the first buckets take the remainder); the top quartile spent ≥ 4,485,000 đ.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:470px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">ROWS BETWEEN n PRECEDING AND …</code></td><td><b>Identical</b>; same default frame (RANGE … CURRENT ROW)</td></tr>
<tr><td><code class="i">RANGE</code> only with UNBOUNDED / CURRENT ROW</td><td>RANGE with offsets too: <code class="i">INTERVAL '7 days' PRECEDING</code></td></tr>
<tr><td>No <code class="i">GROUPS</code>, no <code class="i">EXCLUDE</code></td><td>Both supported (SQL:2011 standard)</td></tr>
<tr><td><code class="i">FIRST_VALUE / LAST_VALUE</code>, <code class="i">NTILE</code></td><td>Same functions, same last_value trap</td></tr>
<tr><td>No <code class="i">NTH_VALUE</code></td><td><code class="i">nth_value(x, n)</code></td></tr>
</table>`, 1.08)}
${box('Most important habit — both systems', 'Whenever you use first_value / last_value / a moving average, <b>write the frame explicitly</b>. The default is RANGE … CURRENT ROW in both, and it is rarely what you meant.', 'xanh')}` },

  { t: 'Exercise: two frames to write', to: true, giua: true, body: `
<p style="margin:0">Using the <code class="i">sale</code> table:</p>
<ol>
<li>For every sale, the <b>sum of that sale and the seller’s previous sale</b> (the “last 2 sales”).</li>
<li>For every sale, the <b>smallest sale in its region</b> using <code class="i">last_value</code> over amount descending, and whether the sale is in the <b>top or bottom half of its region</b>.</li>
</ol>
${box('Before you run it — predict', 'What frame does task 1 need? What goes wrong in task 2 if you forget the frame?', 'lam')}
<p class="nho">Pause the video and write both queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
  sum(amount) OVER (PARTITION BY seller ORDER BY sold_on
    ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS last2_sum
FROM sale ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | last2_sum
--------+------------+--------+-----------
 Alice  | 2026-01-05 | 100.00 |    100.00
 Alice  | 2026-02-10 | 150.00 |    250.00
 Bob    | 2026-01-20 | 200.00 |    200.00
 Bob    | 2026-03-01 | 150.00 |    350.00
 … Carol 300 · 550, Dave 180 · 400
(8 rows)`, { ngang: true, hl: [3] }), 0.9)}
${zm(run(`SELECT region, seller, amount,
  last_value(amount) OVER (PARTITION BY region
    ORDER BY amount DESC ROWS BETWEEN UNBOUNDED
    PRECEDING AND UNBOUNDED FOLLOWING) AS region_min,
  ntile(2) OVER (PARTITION BY region
    ORDER BY amount DESC, id) AS half_in_region
FROM sale ORDER BY region, amount DESC, id;`, ` region | seller | amount | region_min | half_in_region
--------+--------+--------+------------+----------------
 North  | Bob    | 200.00 |     100.00 |              1
 North  | Alice  | 150.00 |     100.00 |              1
 North  | Bob    | 150.00 |     100.00 |              2
 North  | Alice  | 100.00 |     100.00 |              2
 South  | … region_min 180.00 · halves 1 1 2 2
(8 rows)`, { ngang: true, hl: [3, 4] }), 0.9)}
<p style="font-size:20px;margin:0">1) <code class="i">ROWS BETWEEN 1 PRECEDING AND CURRENT ROW</code>. 2) Without the frame, last_value would echo each row’s own amount — the frame must reach <b>UNBOUNDED FOLLOWING</b>. (min(amount) OVER (PARTITION BY region) gives the same number more simply.)</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>Write the frame for a <b>7-day trailing</b> moving average over one row per day.</li>
<li>Amounts 100, 150, 150 ordered ascending: what does the running sum show on the first 150 with <code class="i">ROWS</code>, and with <code class="i">RANGE</code>?</li>
<li>Why does <code class="i">last_value(x) OVER (ORDER BY d)</code> return the current row’s value?</li>
</ol>
${box('Answers', '<b>1.</b> <code class="i">ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> (and NULL until 7 rows exist, if you want honesty). <b>2.</b> ROWS 250, RANGE 400 — RANGE includes the peer. <b>3.</b> The default frame ends at the current row; use <code class="i">… AND UNBOUNDED FOLLOWING</code>.', 'xanh')}` },

  { t: 'Summary: the window toolkit is complete', to: true, giua: true, body: `
<ul>
<li><b>Frames</b> — <code class="i">ROWS BETWEEN …</code> for moving windows; RANGE groups peers; GROUPS, interval RANGE, EXCLUDE in PostgreSQL</li>
<li><b>Ranking</b> — row_number / rank / dense_rank (8.2) · <b>buckets</b> — ntile</li>
<li><b>Navigation</b> — lag / lead (8.3), first_value / last_value / nth_value (with the right frame)</li>
<li>All keep every row, all driven by <b>PARTITION BY + ORDER BY + frame</b> inside OVER</li>
</ul>
${box('Next: Lab 4 — then Chapter 9, indexes', 'Lab 4 puts Chapters 7 and 8 to work on CT Shop: top-3 per category, month-over-month growth, running totals. Then Phase 3 begins: why a query is slow and how the right index fixes it.', 'lam')}` },
]);
