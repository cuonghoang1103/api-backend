/**
 * pg-08-3 — PostgreSQL · Chapter 8 · Lesson 8.3 "LAG, LEAD & running totals" (slide EN, kiểu FU, 25/10/2026, agent c8).
 * Nguồn: content/courses/postgresql/s08-window.mjs › postgresql-8-3-lag-running-total. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-08-3.out.txt schema ch08 · pg-08-3b.out.txt DB ctshop). Bổ sung so với web: sổ tiết kiệm (đời thường),
 * hình luỹ tiến, luỹ tiến cả công ty, có/không ORDER BY trong OVER, bẫy dòng hoà làm tổng "nhảy" (dẫn 8.4), hình LAG/LEAD + NULL ở mép,
 * LEAD/độ lệch/mặc định, % thay đổi + số ngày, cách cũ subquery tương quan, LAST_VALUE bất ngờ, CT Shop doanh thu tháng + tăng trưởng + luỹ kế,
 * bẫy chuỗi có lỗ + generate_series, IGNORE NULLS không có ở PG 17, Prisma $queryRaw biểu đồ đăng ký luỹ kế.
 */
import { lamDeck, sql, run, two, box, kw, c } from './_pg-chung.mjs';
import { passbook, runningPic, lagLead } from './pg-08-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-08-3', code: 'PG 8.3', title: 'LAG, LEAD & running totals', sub: 'Neighbours and “so far” in an ordered window' };

export const slides = lamDeck({ chuong: 'Chapter 8 — Window functions', bai: '8.3' }, [
  { cover: true, t: 'LAG, LEAD &<br>running totals', sub: 'Once rows are in order, each one has a previous,<br>a next — and everything “so far”.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>A <b>running total</b>: <code class="i">sum()</code> over an <b>ordered</b> window</li>
<li>Why adding <code class="i">ORDER BY</code> inside OVER <b>changes the meaning</b> of sum()</li>
<li><code class="i">lag</code> / <code class="i">lead</code>: look at the previous / next row — and the NULL at the edges</li>
<li>Change, % growth, days between events; <code class="i">first_value</code> and the <code class="i">last_value</code> surprise</li>
<li>CT Shop month-over-month revenue, the <b>gaps</b> trap, SQL Server and Prisma</li>
</ul>
${box('Remember from 8.2', 'ORDER BY inside OVER gave every row a <b>position</b>. Today we use that order differently: to reach the <b>neighbouring</b> rows and to <b>accumulate</b> down the list.', 'lam')}` },

  { t: 'Everyday example first: a savings book', giua: true, body: `
${passbook()}
<p style="font-size:22px;margin:0">The <b>balance</b> column is everything so far, added up in date order — a <b>running total</b>. The last column compares each line with the <b>previous</b> one — that is <code class="i">lag</code>. Your bank computes both for every line, without merging any lines.</p>` },

  { t: 'Running total: an ordered SUM', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
       sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS running_total
FROM sale ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | running_total
--------+------------+--------+---------------
 Alice  | 2026-01-05 | 100.00 |        100.00
 Alice  | 2026-02-10 | 150.00 |        250.00
 Bob    | 2026-01-20 | 200.00 |        200.00
 Bob    | 2026-03-01 | 150.00 |        350.00
 Carol  | 2026-01-15 | 300.00 |        300.00
 Carol  | 2026-02-20 | 250.00 |        550.00
 Dave   | 2026-02-05 | 180.00 |        180.00
 Dave   | 2026-03-10 | 220.00 |        400.00
(8 rows)`, { hl: [2], hlOut: [3, 4] }), 1.1)}
<p style="font-size:22px;margin:0"><code class="i">ORDER BY sold_on</code> defines “so far”; <code class="i">PARTITION BY seller</code> restarts the sum for each seller. Alice: 100, then 100 + 150 = <b>250</b>. This is the query behind every cumulative-revenue chart.</p>` },

  { t: 'Picture it: each row adds itself to what came before', giua: true, body: `
${runningPic()}
<p style="font-size:21px;margin:0">Row 2 of Alice is 100 (the row before) + 150 (itself). When the partition changes to Bob, the bar starts again from zero — that is PARTITION BY at work.</p>` },

  { t: 'No PARTITION BY: one running total for the company', giua: true, body: `
${zm(run(`SELECT sold_on, seller, amount,
       sum(amount) OVER (ORDER BY sold_on) AS company_running
FROM sale ORDER BY sold_on;`, `  sold_on   | seller | amount | company_running
------------+--------+--------+-----------------
 2026-01-05 | Alice  | 100.00 |          100.00
 2026-01-15 | Carol  | 300.00 |          400.00
 2026-01-20 | Bob    | 200.00 |          600.00
 2026-02-05 | Dave   | 180.00 |          780.00
 2026-02-10 | Alice  | 150.00 |          930.00
 2026-02-20 | Carol  | 250.00 |         1180.00
 2026-03-01 | Bob    | 150.00 |         1330.00
 2026-03-10 | Dave   | 220.00 |         1550.00
(8 rows)`, { hl: [2], hlOut: [10] }), 1.1)}
<p style="font-size:22px;margin:0">One window, ordered by date: the company total grows sale by sale and ends at the grand total <b>1550</b> — a quick sanity check for any running total.</p>` },

  { t: 'ORDER BY inside OVER changes what sum() means', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
       sum(amount) OVER (PARTITION BY seller)                  AS seller_total,
       sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS running
FROM sale WHERE seller IN ('Alice', 'Bob') ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | seller_total | running
--------+------------+--------+--------------+---------
 Alice  | 2026-01-05 | 100.00 |       250.00 |  100.00
 Alice  | 2026-02-10 | 150.00 |       250.00 |  250.00
 Bob    | 2026-01-20 | 200.00 |       350.00 |  200.00
 Bob    | 2026-03-01 | 150.00 |       350.00 |  350.00
(4 rows)`, { hl: [2, 3] }), 1.0)}
${two(box('No ORDER BY', 'The window is the <b>whole partition</b>: every row shows the same total (250 for Alice).', 'lam'),
box('With ORDER BY', 'The window becomes <b>“start of the partition up to the current row”</b>: the total runs. That default is called the ' + kw('frame', 'which rows count') + ' — lesson 8.4.', 'xanh'))}` },

  { t: 'Trap preview: ties make the running total jump', giua: true, body: `
${zm(run(`SELECT seller, amount,
       sum(amount) OVER (ORDER BY amount) AS running_by_amount
FROM sale ORDER BY amount, id;`, ` seller | amount | running_by_amount
--------+--------+-------------------
 Alice  | 100.00 |            100.00
 Alice  | 150.00 |            400.00
 Bob    | 150.00 |            400.00
 Dave   | 180.00 |            580.00
 Bob    | 200.00 |            780.00
 Dave   | 220.00 |           1000.00
 Carol  | 250.00 |           1250.00
 Carol  | 300.00 |           1550.00
(8 rows)`, { hlOut: [4, 5] }), 0.95)}
${box('Where is 250?', 'The two 150s are <b>peers</b> (8.2). By default the running window includes <b>every peer of the current row</b>, so both rows show 100 + 150 + 150 = <b>400</b> and 250 never appears. Fix: a unique tiebreaker (<code class="i">ORDER BY amount, id</code>) — the full explanation (ROWS vs RANGE) is lesson 8.4.', 'bad')}` },

  { t: 'LAG: compare each row with the previous one', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
       lag(amount) OVER (PARTITION BY seller ORDER BY sold_on)          AS prev_amount,
       amount - lag(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS change
FROM sale ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | prev_amount | change
--------+------------+--------+-------------+--------
 Alice  | 2026-01-05 | 100.00 |             |
 Alice  | 2026-02-10 | 150.00 |      100.00 |  50.00
 Bob    | 2026-01-20 | 200.00 |             |
 Bob    | 2026-03-01 | 150.00 |      200.00 | -50.00
 Carol  | 2026-01-15 | 300.00 |             |
 Carol  | 2026-02-20 | 250.00 |      300.00 | -50.00
 Dave   | 2026-02-05 | 180.00 |             |
 Dave   | 2026-03-10 | 220.00 |      180.00 |  40.00
(8 rows)`, { hl: [2], hlOut: [3, 4] }), 1.05)}
<p style="font-size:22px;margin:0"><code class="i">lag(amount)</code> reaches back <b>one row</b> in the window’s order. Each seller’s first row has no earlier row, so lag is <b>NULL</b> (shown blank by psql) — and so is the change. Bob dropped 50, Dave rose 40.</p>` },

  { t: 'Picture it: lag looks up, lead looks down', body: `
${lagLead()}
<p style="font-size:21px;margin:0">For the current row (5 Feb, 180.00): <code class="i">lag</code> takes the amount <b>one row up</b> (200.00), <code class="i">lead</code> the amount <b>one row down</b> (150.00). At the two edges there is nothing to take — NULL.</p>` },

  { t: 'LEAD, a bigger offset, and a default instead of NULL', giua: true, body: `
${zm(run(`SELECT sold_on, amount,
       lag(amount)       OVER w AS prev,
       lag(amount, 1, 0) OVER w AS prev_or_0,
       lag(amount, 2)    OVER w AS two_back,
       lead(amount)      OVER w AS next
FROM sale WINDOW w AS (ORDER BY sold_on)
ORDER BY sold_on;`, `  sold_on   | amount |  prev  | prev_or_0 | two_back |  next
------------+--------+--------+-----------+----------+--------
 2026-01-05 | 100.00 |        |         0 |          | 300.00
 2026-01-15 | 300.00 | 100.00 |    100.00 |          | 200.00
 2026-01-20 | 200.00 | 300.00 |    300.00 |   100.00 | 180.00
 2026-02-05 | 180.00 | 200.00 |    200.00 |   300.00 | 150.00
 2026-02-10 | 150.00 | 180.00 |    180.00 |   200.00 | 250.00
 2026-02-20 | 250.00 | 150.00 |    150.00 |   180.00 | 150.00
 2026-03-01 | 150.00 | 250.00 |    250.00 |   150.00 | 220.00
 2026-03-10 | 220.00 | 150.00 |    150.00 |   250.00 |
(8 rows)`, { hlOut: [3, 10] }), 1.0)}
<p style="font-size:21px;margin:0"><code class="i">lag(x, n, default)</code>: <b>n</b> rows back (default 1), and a value to use instead of NULL — <code class="i">lag(amount, 1, 0)</code> gives 0 on the first row, often saving a COALESCE. <code class="i">lag(amount, 2)</code> is NULL for the first <b>two</b> rows.</p>` },

  { t: 'Growth in %, and the time between two events', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
  round(100.0 * (amount - lag(amount) OVER w) / lag(amount) OVER w, 1) AS pct_change,
  sold_on - lag(sold_on) OVER w AS days_since_prev
FROM sale WINDOW w AS (PARTITION BY seller ORDER BY sold_on)
ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | pct_change | days_since_prev
--------+------------+--------+------------+-----------------
 Alice  | 2026-01-05 | 100.00 |            |
 Alice  | 2026-02-10 | 150.00 |       50.0 |              36
 Bob    | 2026-01-20 | 200.00 |            |
 Bob    | 2026-03-01 | 150.00 |      -25.0 |              40
 Carol  | 2026-01-15 | 300.00 |            |
 Carol  | 2026-02-20 | 250.00 |      -16.7 |              36
 Dave   | 2026-02-05 | 180.00 |            |
 Dave   | 2026-03-10 | 220.00 |       22.2 |              33
(8 rows)`, { hl: [2, 3], hlOut: [6, 10] }), 1.0)}
<p style="font-size:21px;margin:0">% growth = (this − previous) / previous × 100: Bob −25 %, Dave +22.2 %. lag works on <b>any</b> column — subtracting two dates gives the <b>number of days</b> between sales. (If the previous value can be 0, divide by <code class="i">NULLIF(lag(…), 0)</code>.)</p>` },

  { t: 'Before window functions: a subquery per row', giua: true, body: `
${two(`${zm(run(`SELECT s.seller, s.sold_on, s.amount,
  (SELECT p.amount FROM sale p
    WHERE p.seller = s.seller
      AND p.sold_on < s.sold_on
    ORDER BY p.sold_on DESC LIMIT 1)
  AS prev_amount
FROM sale s ORDER BY s.seller, s.sold_on;`, ` seller |  sold_on   | amount | prev_amount
--------+------------+--------+-------------
 Alice  | 2026-01-05 | 100.00 |
 Alice  | 2026-02-10 | 150.00 |      100.00
 Bob    | 2026-01-20 | 200.00 |
 Bob    | 2026-03-01 | 150.00 |      200.00
 … same 8 rows as lag()
(8 rows)`), 0.95)}`,
`<div>${box('Same answer, three times the code', 'A correlated subquery (lesson 7.2) runs once <b>per outer row</b> and has to re-state the partition (<code class="i">p.seller = s.seller</code>) and the order (<code class="i">p.sold_on &lt; s.sold_on … DESC LIMIT 1</code>) by hand.', 'bad')}
${box('lag() says it once', '<code class="i">lag(amount) OVER (PARTITION BY seller ORDER BY sold_on)</code> — the database walks the sorted rows a single time. Shorter, clearer, and usually faster.', 'xanh')}</div>`)}` },

  { t: 'first_value works — last_value surprises', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
       first_value(amount) OVER w AS first_amt,
       last_value(amount)  OVER w AS last_amt
FROM sale WINDOW w AS (PARTITION BY seller ORDER BY sold_on)
ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | first_amt | last_amt
--------+------------+--------+-----------+----------
 Alice  | 2026-01-05 | 100.00 |    100.00 |   100.00
 Alice  | 2026-02-10 | 150.00 |    100.00 |   150.00
 Bob    | 2026-01-20 | 200.00 |    200.00 |   200.00
 Bob    | 2026-03-01 | 150.00 |    200.00 |   150.00
 … Carol, Dave the same pattern
(8 rows)`, { hlOut: [3] }), 1.0)}
${box('Why is Alice’s first last_amt 100, not 150?', 'With ORDER BY, the default window stops <b>at the current row</b> (slide 7). On Alice’s first row the window holds only that row, so its “last value” is itself. last_value just echoes the current row. The fix — an explicit frame — is the heart of 8.4.', 'bad')}` },

  { t: 'CT Shop: revenue per month, growth, year to date', giua: true, body: `
${zm(run(`WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT month, revenue,
       round(100.0 * (revenue - lag(revenue) OVER (ORDER BY month))
                   / lag(revenue) OVER (ORDER BY month), 1) AS growth_pct,
       sum(revenue) OVER (ORDER BY month) AS ytd
FROM m ORDER BY month;`, `   month    |   revenue   | growth_pct |     ytd
------------+-------------+------------+--------------
 2026-01-01 | 48698000.00 |            |  48698000.00
 2026-02-01 | 31046000.00 |      -36.2 |  79744000.00
 2026-03-01 | 63914000.00 |      105.9 | 143658000.00
 2026-04-01 | 37252000.00 |      -41.7 | 180910000.00
 2026-05-01 | 49290000.00 |       32.3 | 230200000.00
 2026-06-01 | 40587000.00 |      -17.7 | 270787000.00
 2026-07-01 | 60560000.00 |       49.2 | 331347000.00
 2026-08-01 | 37315000.00 |      -38.4 | 368662000.00
 2026-09-01 | 42485000.00 |       13.9 | 411147000.00
(9 rows)`, { hl: [7, 9], hlOut: [5, 11], title: 'psql (17.11) — ctshop · TimeZone Asia/Ho_Chi_Minh' }), 0.86)}
<p style="font-size:20px;margin:0">GROUP BY month first, then two windows on top: <b>lag</b> for growth (March +105.9 %) and a running <b>sum</b> for year-to-date. The last ytd, 411,147,000 đ, equals a plain <code class="i">sum(amount)</code> over the 9 months — checked.</p>` },

  { t: 'Trap: a running total over a series with gaps', giua: true, body: `
${two(`<div>${zm(run(`SELECT day, n,
  lag(n) OVER (ORDER BY day) AS prev_row,
  day - lag(day) OVER (ORDER BY day) AS gap_days
FROM signup ORDER BY day;`, `    day     | n | prev_row | gap_days
------------+---+----------+----------
 2026-03-01 | 5 |          |
 2026-03-02 | 3 |        5 |        1
 2026-03-05 | 4 |        3 |        3
 2026-03-06 | 6 |        4 |        1
(4 rows)`, { hlOut: [5] }), 0.98)}
${box('“Yesterday” is not yesterday', 'There are no rows for 3 and 4 March, so lag on 5 March returns the value of <b>2 March</b>. A chart on these rows silently skips two days.', 'bad')}</div>`,
`${zm(run(`SELECT d::date AS day, coalesce(s.n, 0) AS n,
  lag(coalesce(s.n, 0)) OVER (ORDER BY d) AS yesterday,
  sum(coalesce(s.n, 0)) OVER (ORDER BY d) AS running
FROM generate_series(date '2026-03-01',
       date '2026-03-06', interval '1 day') AS d
LEFT JOIN signup s ON s.day = d::date
ORDER BY d;`, `    day     | n | yesterday | running
------------+---+-----------+---------
 2026-03-01 | 5 |           |       5
 2026-03-02 | 3 |         5 |       8
 2026-03-03 | 0 |         3 |       8
 2026-03-04 | 0 |         0 |       8
 2026-03-05 | 4 |         0 |      12
 2026-03-06 | 6 |         4 |      18
(6 rows)`, { hlOut: [5, 6] }), 0.98)}`)}
<p style="font-size:20px;margin:0">Fix it <b>before</b> the window: <code class="i">generate_series</code> makes one row per calendar day, a <b>LEFT JOIN</b> (5.2) attaches the data, <code class="i">coalesce</code> turns missing days into 0.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:450px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">LAG(x, 1, 0) OVER (…)</code>, <code class="i">LEAD</code> (since 2012)</td><td><b>Identical</b> — same arguments, same NULL at the edges</td></tr>
<tr><td>Running total <code class="i">SUM(x) OVER (ORDER BY d)</code></td><td>Identical, same default frame (ties are peers)</td></tr>
<tr><td><code class="i">LAG(x) IGNORE NULLS OVER …</code> (SQL Server 2022)</td><td><b class="do">Not in PostgreSQL 17</b>: <i>syntax error at or near "NULLS"</i></td></tr>
<tr><td><code class="i">DATEDIFF(day, a, b)</code></td><td><code class="i">b - a</code> on two <code class="i">date</code> values</td></tr>
<tr><td>A calendar table / recursive CTE for dates</td><td><code class="i">generate_series(start, end, interval '1 day')</code></td></tr>
</table>`, 1.08)}
${box('Good news', 'lag, lead, first_value, running sums: the SQL you wrote in SQL Server runs unchanged. Watch only IGNORE NULLS and the date arithmetic.', 'xanh')}` },

  { t: 'In production: a cumulative sign-ups chart', giua: true, body: `
${zm(sql(`// a sign-ups chart for cuongthai.com — real table users(created_at)
const rows = await prisma.$queryRaw<{ day: Date; n: number; total: number }[]>\`
  SELECT d::date AS day,
         count(u.id)::int AS n,
         (sum(count(u.id)) OVER (ORDER BY d))::int AS total
  FROM generate_series(now()::date - 29, now()::date, interval '1 day') AS d
  LEFT JOIN users u ON u.created_at::date = d::date
  GROUP BY d ORDER BY d\`;`, { lang: 'typescript' }), 1.0)}
${two(box('Every lesson in one query', '<b>generate_series</b> (no gaps) → <b>LEFT JOIN</b> → <b>GROUP BY</b> day → a <b>running sum</b> of the daily counts on top. 30 rows, one per day, ready for a line chart.', 'xanh'),
box('Why $queryRaw', 'Prisma’s <code class="i">groupBy</code> has no OVER. Window queries go through raw SQL — keep them parameterised (tagged template), never string-concatenated.', 'lam'))}` },

  { t: 'Exercise: neighbours and progress', to: true, giua: true, body: `
<p style="margin:0">Using the <code class="i">sale</code> table:</p>
<ol>
<li>For every sale show the date of the seller’s <b>next</b> sale and how much the amount changes then.</li>
<li>For each <b>region</b>, a running total by date and the <b>% of the region total</b> reached so far.</li>
</ol>
${box('Before you run it — predict', 'Which rows get NULL in task 1? What must the last % of each region be?', 'lam')}
<p class="nho">Pause the video and write both queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
  lead(sold_on) OVER w AS next_sale,
  lead(amount)  OVER w - amount AS next_change
FROM sale
WINDOW w AS (PARTITION BY seller ORDER BY sold_on)
ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | next_sale  | next_change
--------+------------+--------+------------+-------------
 Alice  | 2026-01-05 | 100.00 | 2026-02-10 |       50.00
 Alice  | 2026-02-10 | 150.00 |            |
 Bob    | 2026-01-20 | 200.00 | 2026-03-01 |      -50.00
 Bob    | 2026-03-01 | 150.00 |            |
 … Carol, Dave: −50.00 · 40.00
(8 rows)`, { ngang: true, hlOut: [4] }), 0.92)}
${zm(run(`SELECT region, sold_on, amount,
  sum(amount) OVER (PARTITION BY region
                    ORDER BY sold_on) AS running,
  round(100.0 * sum(amount) OVER (PARTITION BY region
                    ORDER BY sold_on)
    / sum(amount) OVER (PARTITION BY region), 1) AS pct_done
FROM sale ORDER BY region, sold_on;`, ` region |  sold_on   | amount | running | pct_done
--------+------------+--------+---------+----------
 North  | 2026-01-05 | 100.00 |  100.00 |     16.7
 North  | 2026-01-20 | 200.00 |  300.00 |     50.0
 North  | 2026-02-10 | 150.00 |  450.00 |     75.0
 North  | 2026-03-01 | 150.00 |  600.00 |    100.0
 South  | … 31.6 · 50.5 · 76.8 · 100.0
(8 rows)`, { ngang: true, hlOut: [6] }), 0.92)}
<p style="font-size:20px;margin:0">1) The <b>last</b> sale of each seller has no next row → NULL. 2) A running sum divided by the plain partition sum; it must end at <b>100.0</b> in every region.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>What is the difference between <code class="i">sum(x) OVER (PARTITION BY g)</code> and <code class="i">sum(x) OVER (PARTITION BY g ORDER BY d)</code>?</li>
<li>What does <code class="i">lag(amount)</code> return on the first row of a partition — and how do you get 0 instead?</li>
<li>Daily sales have no rows for days without sales. What goes wrong with “change since yesterday”, and how do you fix it?</li>
</ol>
${box('Answers', '<b>1.</b> The first repeats the group total on every row; the second is a running total (start of partition → current row). <b>2.</b> NULL; <code class="i">lag(amount, 1, 0)</code>. <b>3.</b> lag returns the last <i>existing</i> day, not yesterday — generate the full date range with generate_series and LEFT JOIN the data first.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><code class="i">sum() OVER (ORDER BY …)</code> = running total; PARTITION BY restarts it</li>
<li><code class="i">lag</code> / <code class="i">lead</code> = previous / next row (NULL at the edges; <code class="i">lag(x, n, default)</code>)</li>
<li>Ties in the ORDER BY share one running value; series with gaps need <code class="i">generate_series</code></li>
<li><code class="i">last_value</code> looks broken because the default window stops at the current row</li>
</ul>
${box('Next: 8.4 — frames, FIRST_VALUE & NTILE', 'Take control of the window: <code class="i">ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code> for a 3-day moving average, ROWS vs RANGE at ties, fixing last_value — and NTILE buckets.', 'lam')}` },
]);
