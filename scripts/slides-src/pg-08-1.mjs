/**
 * pg-08-1 — PostgreSQL · Chapter 8 · Lesson 8.1 "What a window function is: aggregate without collapsing" (slide EN, kiểu FU, 25/10/2026, agent c8).
 * Nguồn: content/courses/postgresql/s08-window.mjs › postgresql-8-1-window-la-gi. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-08-1.out.txt schema ch08 · pg-08-1b.out.txt DB ctshop). Bổ sung so với web: ví dụ đời thường
 * (bảng điểm lớp), lỗi GROUP BY, giải phẫu OVER(), hình gộp vs giữ dòng, nhiều cửa sổ một câu, so với trung bình nhóm, thứ tự thực thi
 * logic + lỗi WHERE, WHERE chạy trước cửa sổ, cửa sổ trên GROUP BY, FILTER + WINDOW đặt tên (PG), đối chiếu SQL Server, CT Shop, Prisma.
 */
import { lamDeck, sql, run, tbl, two, box, kw, vsd, flow, c } from './_pg-chung.mjs';
import { collapseVsKeep, anatomy, partitionPic } from './pg-08-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-08-1', code: 'PG 8.1', title: 'What a window function is', sub: 'Aggregate without collapsing the rows' };

const SALE_ROWS = [[1, 'North', 'Alice', '100.00', '2026-01-05'], [2, 'North', 'Alice', '150.00', '2026-02-10'], [3, 'North', 'Bob', '200.00', '2026-01-20'], [4, 'North', 'Bob', '150.00', '2026-03-01'],
  [5, 'South', 'Carol', '300.00', '2026-01-15'], [6, 'South', 'Carol', '250.00', '2026-02-20'], [7, 'South', 'Dave', '180.00', '2026-02-05'], [8, 'South', 'Dave', '220.00', '2026-03-10']];

export const slides = lamDeck({ chuong: 'Chapter 8 — Window functions', bai: '8.1' }, [
  { cover: true, t: 'Window functions:<br>aggregate without collapsing', sub: 'A total, an average, a count — written next to<br>every row instead of squeezing the rows away.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why <code class="i">GROUP BY</code> <b>loses</b> the detail rows — and how a <b>window function</b> keeps them</li>
<li><code class="i">OVER ()</code>: one value computed over all rows, shown on <b>each</b> row</li>
<li><code class="i">PARTITION BY</code>: a <b>separate window per group</b> — “group by, but keep the rows”</li>
<li>Where windows run in the query, and why <code class="i">WHERE</code> cannot use them</li>
<li>PostgreSQL extras (<code class="i">FILTER</code>, named <code class="i">WINDOW</code>), SQL Server, CT Shop and Prisma</li>
</ul>
${box('Where we are', 'Chapter 6 grouped rows into summaries. Chapter 7 nested queries. <b>Chapter 8 is the analytics chapter</b> — rankings, running totals, month-over-month growth. If you came here on the fast track from SQL Server, <b>study this chapter carefully</b>.', 'lam')}` },

  { t: 'Everyday example first: the class test', giua: true, body: `
${zm(two(`<div class="card"><div class="h">Teacher A — a summary sheet</div>
${tbl(['class', 'average'], [['10A', '7.2'], ['10B', '6.8']])}
<p style="margin-top:8px">Short and tidy… but <b>whose</b> paper was an 8? Gone. The sheet has <b>one line per class</b>.</p></div>`,
`<div class="card" style="border-color:#9fd0b2;background:#f1f9f4"><div class="h" style="color:#1f6b40">Teacher B — a stamp on every paper</div>
${tbl(['student', 'score', 'class avg'], [['Lan', '8.0', '7.2'], ['Minh', '6.5', '7.2'], ['Hoa', '7.1', '7.2']], { o: [[0, 2], [1, 2], [2, 2]] })}
<p style="margin-top:8px">Every student keeps <b>their own paper</b> and also sees the class average beside it.</p></div>`), 1.12)}
${box('The whole chapter in one sentence', 'Teacher A is <b>GROUP BY</b> (collapse to a summary). Teacher B is a <b>window function</b> (keep every row, attach the summary).', '')}` },

  { t: 'Our table for the whole chapter', body: `
${two(tbl(['id', 'region', 'seller', 'amount', 'sold_on'], SALE_ROWS, { cap: 'sale — 8 rows, 2 regions, 4 sellers' }),
`<ul style="font-size:23px">
<li><b>2 regions</b>: North (Alice, Bob) and South (Carol, Dave)</li>
<li>Each seller made <b>2 sales</b>, on different days</li>
<li>North has a <b>tie</b>: two sales of exactly <code class="i">150.00</code> — it matters in 8.2</li>
<li>Total of all 8 sales: <b>1550.00</b></li>
</ul>
${box('Run it yourself', 'The CREATE + INSERT script is under the lesson. Every output on these slides came from <b>PostgreSQL 17.11</b>.', 'lam')}`, 'r64')}` },

  { t: 'GROUP BY collapses — and then forbids the detail', giua: true, body: `
${two(zm(run(`SELECT region, sum(amount) AS region_total
FROM sale
GROUP BY region ORDER BY region;`, ` region | region_total
--------+--------------
 North  |       600.00
 South  |       950.00
(2 rows)`, { hlOut: [3, 4] }), 1.22),
zm(run(`SELECT region, seller, sum(amount)
FROM sale GROUP BY region;`, `ERROR:  column "sale.seller" must appear in
the GROUP BY clause or be used in an
aggregate function`, { hlOut: [1] }), 1.22))}
<p style="font-size:23px;margin:0"><b>8 rows became 2.</b> Four sales were squeezed into each total, so there is no single <code class="i">seller</code> left to show — PostgreSQL refuses rather than guess. To see each sale <i>and</i> its region total you need something that does <b>not</b> collapse.</p>` },

  { t: 'OVER () — a total on every row', giua: true, body: `
${zm(run(`SELECT seller, amount,
       sum(amount) OVER ()                            AS grand_total,
       round(100.0 * amount / sum(amount) OVER (), 1) AS pct_of_total
FROM sale ORDER BY id;`, ` seller | amount | grand_total | pct_of_total
--------+--------+-------------+--------------
 Alice  | 100.00 |     1550.00 |          6.5
 Alice  | 150.00 |     1550.00 |          9.7
 Bob    | 200.00 |     1550.00 |         12.9
 Bob    | 150.00 |     1550.00 |          9.7
 Carol  | 300.00 |     1550.00 |         19.4
 Carol  | 250.00 |     1550.00 |         16.1
 Dave   | 180.00 |     1550.00 |         11.6
 Dave   | 220.00 |     1550.00 |         14.2
(8 rows)`, { hl: [2, 3], hlOut: [3] }), 1.08)}
<p style="font-size:21px;margin:0">Add <code class="i">OVER ()</code> to an aggregate and it becomes a <b>window function</b>: computed over all 8 rows, reported on each. Empty brackets = the window is the whole result. <span class="nho">(Before windows: <code class="i">CROSS JOIN (SELECT sum(amount) …)</code> — a second query glued on.)</span></p>` },

  { t: 'Picture it: collapse vs keep', body: `
${collapseVsKeep()}
<p style="font-size:21px;margin:0">Same input, same <code class="i">sum()</code>. GROUP BY pours each region into one bucket. The window function computes the bucket total too — then <b>writes it back onto every row</b>.</p>` },

  { t: 'Anatomy of a window function call', giua: true, body: `
${anatomy()}
${box('Read it left to right', '<b>Function</b> — any aggregate (<code class="i">sum, avg, count, min, max</code>) or a window-only function (<code class="i">row_number, rank, lag</code>…). <b>OVER</b> — the keyword that turns it into a window function. Inside the brackets, three <b>optional</b> parts: which rows form a window, their order, and the frame. This lesson uses only ③.', 'lam')}
<p class="nho">${kw('window', 'the set of rows the function looks at for the current row')} — every row has its own window.</p>` },

  { t: 'PARTITION BY — a separate window per group', giua: true, body: `
${zm(run(`SELECT region, seller, amount,
       sum(amount) OVER (PARTITION BY region) AS region_total
FROM sale ORDER BY region, id;`, ` region | seller | amount | region_total
--------+--------+--------+--------------
 North  | Alice  | 100.00 |       600.00
 North  | Alice  | 150.00 |       600.00
 North  | Bob    | 200.00 |       600.00
 North  | Bob    | 150.00 |       600.00
 South  | Carol  | 300.00 |       950.00
 South  | Carol  | 250.00 |       950.00
 South  | Dave   | 180.00 |       950.00
 South  | Dave   | 220.00 |       950.00
(8 rows)`, { hl: [2], hlOut: [3, 7] }), 1.12)}
<p style="font-size:22px;margin:0"><code class="i">PARTITION BY region</code> splits the rows into groups <b>for the calculation only</b>. North rows all show 600, South rows all show 950 — and all 8 rows are still there. <b>“GROUP BY, but keep the rows.”</b></p>` },

  { t: 'Picture it: each partition is its own window', body: `
${partitionPic()}
<p style="font-size:21px;margin:0">When PostgreSQL computes <code class="i">region_total</code> for a North row, it looks <b>only at the blue rows</b>. A South row sees only the orange rows. The windows never mix — that is what a ${kw('partition', 'one group of rows that share a window')} is.</p>` },

  { t: 'Several windows in one query', giua: true, body: `
${zm(run(`SELECT region, seller, amount,
       count(*)    OVER (PARTITION BY region) AS n_region,
       sum(amount) OVER (PARTITION BY seller) AS seller_total,
       sum(amount) OVER ()                    AS grand
FROM sale ORDER BY id;`, ` region | seller | amount | n_region | seller_total |  grand
--------+--------+--------+----------+--------------+---------
 North  | Alice  | 100.00 |        4 |       250.00 | 1550.00
 North  | Alice  | 150.00 |        4 |       250.00 | 1550.00
 North  | Bob    | 200.00 |        4 |       350.00 | 1550.00
 North  | Bob    | 150.00 |        4 |       350.00 | 1550.00
 South  | Carol  | 300.00 |        4 |       550.00 | 1550.00
 South  | Carol  | 250.00 |        4 |       550.00 | 1550.00
 South  | Dave   | 180.00 |        4 |       400.00 | 1550.00
 South  | Dave   | 220.00 |        4 |       400.00 | 1550.00
(8 rows)`, { hl: [2, 3, 4] }), 1.0)}
<p style="font-size:22px;margin:0">Each <code class="i">OVER</code> has <b>its own</b> partition: by region, by seller, or none at all. One pass, three different groupings — impossible with a single GROUP BY.</p>` },

  { t: 'Compare each row with its group', giua: true, body: `
${zm(run(`SELECT region, seller, amount,
  round(avg(amount) OVER (PARTITION BY region), 2)          AS region_avg,
  amount - round(avg(amount) OVER (PARTITION BY region), 2) AS vs_avg,
  round(100.0 * amount / sum(amount) OVER (PARTITION BY region), 1) AS pct_region
FROM sale ORDER BY region, id;`, ` region | seller | amount | region_avg | vs_avg | pct_region
--------+--------+--------+------------+--------+------------
 North  | Alice  | 100.00 |     150.00 | -50.00 |       16.7
 North  | Alice  | 150.00 |     150.00 |   0.00 |       25.0
 North  | Bob    | 200.00 |     150.00 |  50.00 |       33.3
 North  | Bob    | 150.00 |     150.00 |   0.00 |       25.0
 South  | Carol  | 300.00 |     237.50 |  62.50 |       31.6
 South  | Carol  | 250.00 |     237.50 |  12.50 |       26.3
 South  | Dave   | 180.00 |     237.50 | -57.50 |       18.9
 South  | Dave   | 220.00 |     237.50 | -17.50 |       23.2
(8 rows)`, { hlOut: [5, 9] }), 1.0)}
<p style="font-size:22px;margin:0">Because the detail row is still there, you can do <b>arithmetic with it</b>: “50 above the region average”, “33.3 % of the region”. This is the everyday use of windows.</p>` },

  { t: 'Where window functions run in a query', giua: true, body: `
${flow([{ t: 'FROM', s: 'rows' }, { t: 'WHERE', s: 'filter rows' }, { t: 'GROUP BY', s: '+ HAVING' }, { t: 'WINDOW', s: 'OVER (…)', mau: '#e08a1e' }, { t: 'SELECT', s: 'columns' }, { t: 'ORDER BY', s: '+ LIMIT' }], { h: 130, fs: 21 })}
${zm(run(`SELECT seller, amount FROM sale
WHERE amount > avg(amount) OVER ();`, `ERROR:  window functions are not allowed in WHERE
LINE 1: SELECT seller, amount FROM sale WHERE amount > avg(amount) O...
                                                       ^`, { hlOut: [1] }), 1.0)}
<p style="font-size:22px;margin:0">Windows are computed <b>after</b> WHERE and GROUP BY, so at WHERE time the value does not exist yet. To filter on a window value, compute it in a subquery/CTE first — lesson 8.2.</p>` },

  { t: 'Two consequences of that order', giua: true, body: `
${two(`<div>${zm(run(`SELECT seller, amount,
       sum(amount) OVER () AS total_seen
FROM sale WHERE amount >= 200
ORDER BY id;`, ` seller | amount | total_seen
--------+--------+------------
 Bob    | 200.00 |     970.00
 Carol  | 300.00 |     970.00
 Carol  | 250.00 |     970.00
 Dave   | 220.00 |     970.00
(4 rows)`, { hlOut: [3] }), 1.0)}
${box('1 · WHERE runs first', 'The window only sees the 4 rows that survived: total <b>970</b>, not 1550. A “% of total” after a WHERE is a % of the <b>filtered</b> rows.', 'bad')}</div>`,
`<div>${zm(run(`SELECT region, sum(amount) AS region_total,
  sum(sum(amount)) OVER () AS grand_total,
  round(100.0 * sum(amount)
    / sum(sum(amount)) OVER (), 1) AS pct
FROM sale GROUP BY region ORDER BY region;`, ` region | region_total | grand_total | pct
--------+--------------+-------------+------
 North  |       600.00 |     1550.00 | 38.7
 South  |       950.00 |     1550.00 | 61.3
(2 rows)`, { hl: [2], hlOut: [3, 4] }), 1.0)}
${box('2 · GROUP BY runs first too', 'A window can sit <b>on top of</b> a GROUP BY: <code class="i">sum(sum(amount)) OVER ()</code> = the total of the group totals. Each region’s share in one query.', 'xanh')}</div>`)}` },

  { t: 'Trap: PARTITION BY is not GROUP BY', giua: true, body: `
${vsd(`<p style="margin:0 0 8px">“PARTITION BY sounds like GROUP BY, so they must do the same thing.”</p>
${sql(`SELECT region, sum(amount)
FROM sale GROUP BY region;      -- 2 rows`, { sm: true })}`,
`<p style="margin:0 0 8px">PARTITION BY divides rows <b>for the calculation</b>, then hands <b>every row</b> back.</p>
${sql(`SELECT region, sum(amount)
       OVER (PARTITION BY region)
FROM sale;                      -- 8 rows`, { sm: true })}`, '✗ The mix-up', '✓ The difference')}
${box('Ask one question first', '<b>How many rows should the answer have?</b> One per group → GROUP BY. One per detail row (each with a group value beside it) → window function. Real check: <code class="i">count(*)</code> of the first query is <b>2</b>, of the second <b>8</b>.', 'lam')}` },

  { t: 'PostgreSQL extras: FILTER and a named WINDOW', giua: true, body: `
${two(`${zm(run(`SELECT region, seller, amount,
  count(*) FILTER (WHERE amount >= 200)
    OVER (PARTITION BY region) AS big_sales
FROM sale ORDER BY region, id;`, ` region | seller | amount | big_sales
--------+--------+--------+-----------
 North  | Alice  | 100.00 |         1
 North  | Alice  | 150.00 |         1
 North  | Bob    | 200.00 |         1
 North  | Bob    | 150.00 |         1
 South  | Carol  | 300.00 |         3
 South  | Carol  | 250.00 |         3
 South  | Dave   | 180.00 |         3
 South  | Dave   | 220.00 |         3
(8 rows)`, { hl: [2] }), 0.92)}`,
`${zm(run(`SELECT seller, amount,
       sum(amount)       OVER w AS region_total,
       round(avg(amount) OVER w, 2) AS region_avg
FROM sale
WINDOW w AS (PARTITION BY region)
ORDER BY id;`, ` seller | amount | region_total | region_avg
--------+--------+--------------+------------
 Alice  | 100.00 |       600.00 |     150.00
 Alice  | 150.00 |       600.00 |     150.00
 Bob    | 200.00 |       600.00 |     150.00
 Bob    | 150.00 |       600.00 |     150.00
 Carol  | 300.00 |       950.00 |     237.50
 Carol  | 250.00 |       950.00 |     237.50
 Dave   | 180.00 |       950.00 |     237.50
 Dave   | 220.00 |       950.00 |     237.50
(8 rows)`, { hl: [5] }), 0.92)}`)}
<p style="font-size:20px;margin:0"><b>FILTER</b> counts only some rows of the window (South has 3 sales ≥ 200). <b>WINDOW w AS (…)</b> names a window once and reuses it — less copy-paste, fewer typos.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:420px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">SUM(x) OVER (PARTITION BY g)</code></td><td><b>Identical</b> — same syntax, same result</td></tr>
<tr><td>Windows not allowed in <code class="i">WHERE</code></td><td>Same rule, same fix (CTE / subquery)</td></tr>
<tr><td>No <code class="i">FILTER</code>: <code class="i">SUM(CASE WHEN … THEN 1 END) OVER (…)</code></td><td><code class="i">count(*) FILTER (WHERE …) OVER (…)</code></td></tr>
<tr><td><code class="i">WINDOW w AS (…)</code> only since SQL Server 2022</td><td>Available for many years</td></tr>
<tr><td><code class="i">COUNT(DISTINCT x) OVER (…)</code> — not allowed</td><td>Not allowed either: <i>“DISTINCT is not implemented for window functions”</i></td></tr>
</table>`, 1.06)}
${box('Good news', 'Window functions are standard SQL, so almost everything you know transfers. The PostgreSQL-only parts (FILTER, frames with GROUPS / EXCLUDE / RANGE by interval) come in 8.4.', 'xanh')}` },

  { t: 'In production: CT Shop and Prisma', giua: true, body: `
${zm(run(`-- CT Shop: each calculator vs. its category's average price
SELECT name, price,
       round(avg(price) OVER (PARTITION BY category_id)) AS cat_avg
FROM product WHERE category_id = 10 ORDER BY price DESC;`, `               name                |   price   | cat_avg
-----------------------------------+-----------+---------
 Máy tính Casio FX-880BTG          | 790000.00 |  469167
 Máy tính Casio FX-580VN X         | 705000.00 |  469167
 Máy tính Casio FX-570VN Plus      | 495000.00 |  469167
 Máy tính Vinacal 570ES Plus II    | 345000.00 |  469167
 Máy tính Deli D82TL               | 285000.00 |  469167
 Máy tính Casio MX-12B (văn phòng) | 195000.00 |  469167
(6 rows)`, { hlOut: [3], title: 'psql (17.11) — ctshop' }), 0.95)}
${zm(sql(`// cuongthai.com: Prisma has no OVER() helper → $queryRaw
const rows = await prisma.$queryRaw\`
  SELECT id, title, view_count,
         sum(view_count) OVER (PARTITION BY category_id) AS cat_views
  FROM posts WHERE status = 'PUBLISHED'\`;`, { sm: true, lang: 'typescript' }), 1.0)}
<p style="font-size:20px;margin:0">Same idea, two places: CT Shop compares a price with its category; the site compares a post’s views with its category’s total.</p>` },

  { t: 'Exercise: two windows to write', to: true, giua: true, body: `
<p style="margin:0">Using the <code class="i">sale</code> table:</p>
<ol>
<li>Show every sale with its <b>seller’s total</b> (<code class="i">total</code>) and what <b>% of that total</b> this sale is (<code class="i">pct</code>). Order by seller, then date.</li>
<li>Show every sale with the <b>number of sales in its region</b> (<code class="i">n</code>), the region’s <b>largest sale</b> (<code class="i">top</code>) and how far this sale is <b>behind</b> it.</li>
<li>Bonus: use one named <code class="i">WINDOW</code> per query.</li>
</ol>
${box('Before you run it — predict', 'How many rows will each answer have? (Hint: neither query uses GROUP BY.) What will Alice’s two percentages add up to?', 'lam')}
<p class="nho">Pause the video and write both queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${zm(run(`SELECT seller, sold_on, amount,
       sum(amount) OVER s AS total,
       round(100.0 * amount
         / sum(amount) OVER s, 1) AS pct
FROM sale
WINDOW s AS (PARTITION BY seller)
ORDER BY seller, sold_on;`, ` seller |  sold_on   | amount | total  | pct
--------+------------+--------+--------+------
 Alice  | 2026-01-05 | 100.00 | 250.00 | 40.0
 Alice  | 2026-02-10 | 150.00 | 250.00 | 60.0
 Bob    | 2026-01-20 | 200.00 | 350.00 | 57.1
 Bob    | 2026-03-01 | 150.00 | 350.00 | 42.9
 … 4 more rows (Carol, Dave)
(8 rows)`, { ngang: true, hlOut: [3, 4] }), 1.0)}
${zm(run(`SELECT region, seller, amount,
       count(*)    OVER r AS n,
       max(amount) OVER r AS top,
       max(amount) OVER r - amount AS behind
FROM sale
WINDOW r AS (PARTITION BY region)
ORDER BY region, amount DESC, id;`, ` region | seller | amount | n |  top   | behind
--------+--------+--------+---+--------+--------
 North  | Bob    | 200.00 | 4 | 200.00 |   0.00
 North  | Alice  | 150.00 | 4 | 200.00 |  50.00
 North  | Bob    | 150.00 | 4 | 200.00 |  50.00
 North  | Alice  | 100.00 | 4 | 200.00 | 100.00
 … 4 more rows (South: 0, 50, 80, 120)
(8 rows)`, { ngang: true, hlOut: [3] }), 1.0)}
<p style="font-size:21px;margin:0">Both answers have <b>8 rows</b> — windows never remove rows. Alice’s 40 % + 60 % = <b>100 %</b>: a quick sanity check for any “share of group” column.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>A query has <code class="i">GROUP BY region</code> and returns 2 rows. You replace it with <code class="i">sum(amount) OVER (PARTITION BY region)</code>. How many rows now?</li>
<li>Why does <code class="i">WHERE amount &gt; avg(amount) OVER ()</code> fail?</li>
<li>You add <code class="i">WHERE amount &gt;= 200</code> to a query with <code class="i">sum(amount) OVER ()</code>. Is the total still 1550?</li>
</ol>
${box('Answers', '<b>1.</b> 8 — one per sale; the region total is repeated on each row. <b>2.</b> Windows are computed after WHERE, so the value does not exist yet when WHERE runs — wrap it in a CTE/subquery. <b>3.</b> No: WHERE runs first, so the window sees only the 4 surviving rows → 970.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li>A <b>window function</b> = an aggregate (or ranking/offset function) + <code class="i">OVER (…)</code> — it <b>keeps every row</b></li>
<li><code class="i">OVER ()</code> = window is all rows · <code class="i">PARTITION BY</code> = one window per group</li>
<li>Windows run <b>after WHERE and GROUP BY</b> → not usable in WHERE, and they only see surviving rows</li>
<li>One row per group? GROUP BY. Every row plus a group value? Window.</li>
</ul>
${box('Next: 8.2 — Ranking', 'Put <code class="i">ORDER BY</code> inside OVER and you can <b>number</b> rows: <code class="i">row_number</code>, <code class="i">rank</code>, <code class="i">dense_rank</code> — and finally the famous “top 3 per category” query.', 'lam')}` },
]);
