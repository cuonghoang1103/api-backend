/**
 * pg-08-2 — PostgreSQL · Chapter 8 · Lesson 8.2 "Ranking: ROW_NUMBER, RANK & DENSE_RANK" (slide EN, kiểu FU, 25/10/2026, agent c8).
 * Nguồn: content/courses/postgresql/s08-window.mjs › postgresql-8-2-ranking. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-08-2.out.txt schema ch08 · pg-08-2b.out.txt DB ctshop). Bổ sung so với web: vạch đích (đời thường),
 * đánh số cả bảng rồi theo vùng, công thức rank/dense_rank, percent_rank & cume_dist, bằng chứng hoà bị xếp tuỳ ý (hai lần chạy khác nhau),
 * hai lỗi khi lọc trong WHERE, hình top-N, subquery + DISTINCT ON (riêng PG), top-N có tính hoà, CT Shop top-3 mỗi danh mục,
 * mã thật cuongthai.com (2 bình luận mới nhất mỗi bài), QUALIFY không có, SQL Server.
 */
import { lamDeck, sql, run, two, box, cards, kw, vsd, flow } from './_pg-chung.mjs';
import { finishLine, rankCols, topNCut } from './pg-08-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-08-2', code: 'PG 8.2', title: 'Ranking: ROW_NUMBER, RANK & DENSE_RANK', sub: 'Numbering rows, ties, and top-N per group' };

export const slides = lamDeck({ chuong: 'Chapter 8 — Window functions', bai: '8.2' }, [
  { cover: true, t: 'Ranking:<br>ROW_NUMBER, RANK & DENSE_RANK', sub: 'Put ORDER BY inside OVER — and finally write<br>“the top 3 in each category”.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><code class="i">ORDER BY</code> <b>inside</b> <code class="i">OVER</code>: number the rows in an order you choose</li>
<li>The three rankers — <code class="i">row_number</code>, <code class="i">rank</code>, <code class="i">dense_rank</code> — differ <b>only on ties</b></li>
<li>Why a tie makes <code class="i">row_number</code> <b>unpredictable</b>, and the one-word fix</li>
<li><b>Top-N per group</b>: why WHERE cannot do it, and the CTE that can</li>
<li>PostgreSQL’s <code class="i">DISTINCT ON</code>, CT Shop’s best sellers and real cuongthai.com code</li>
</ul>
${box('Remember from 8.1', 'A window function keeps every row. 8.1 used <b>PARTITION BY</b> (which rows belong together). Today adds part ④ of the anatomy: <b>ORDER BY</b> — the order inside each window.', 'lam')}` },

  { t: 'Everyday example first: the finish line', giua: true, body: `
${finishLine()}
<p style="font-size:22px;margin:0">Lan and Hoa cross the line at exactly <b>10.1 s</b>. The race office still has to write a number next to each name. <b>row_number</b> just counts 1, 2, 3, 4. <b>rank</b> gives two silver medals and <b>no bronze</b>. <b>dense_rank</b> gives two silvers and Tuan the bronze.</p>` },

  { t: 'ORDER BY inside OVER numbers the rows', giua: true, body: `
${zm(run(`SELECT seller, amount,
       row_number() OVER (ORDER BY amount DESC) AS rn
FROM sale ORDER BY rn;`, ` seller | amount | rn
--------+--------+----
 Carol  | 300.00 |  1
 Carol  | 250.00 |  2
 Dave   | 220.00 |  3
 Bob    | 200.00 |  4
 Dave   | 180.00 |  5
 Bob    | 150.00 |  6
 Alice  | 150.00 |  7
 Alice  | 100.00 |  8
(8 rows)`, { hl: [2], hlOut: [8, 9] }), 1.12)}
<p style="font-size:22px;margin:0"><code class="i">row_number()</code> takes no argument: it is <b>1, 2, 3 … in the order you give inside OVER</b>. No PARTITION BY here, so the whole table is one window and the numbers run 1 to 8. Note the two 150s — Bob got 6, Alice 7. Remember that.</p>` },

  { t: 'Add PARTITION BY: the numbering restarts per group', giua: true, body: `
${zm(run(`SELECT region, seller, amount,
       row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn
FROM sale ORDER BY region, rn;`, ` region | seller | amount | rn
--------+--------+--------+----
 North  | Bob    | 200.00 |  1
 North  | Alice  | 150.00 |  2
 North  | Bob    | 150.00 |  3
 North  | Alice  | 100.00 |  4
 South  | Carol  | 300.00 |  1
 South  | Carol  | 250.00 |  2
 South  | Dave   | 220.00 |  3
 South  | Dave   | 180.00 |  4
(8 rows)`, { hl: [2], hlOut: [3, 7] }), 1.12)}
<p style="font-size:22px;margin:0">PARTITION BY splits, ORDER BY sorts <b>inside each split</b>, and the counter goes back to 1 at the start of every region. This shape — <code class="i">PARTITION BY group ORDER BY measure</code> — is behind every “best in each …” question.</p>` },

  { t: 'The three ranking functions side by side', giua: true, body: `
${zm(run(`SELECT region, seller, amount,
       row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,
       rank()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,
       dense_rank() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk
FROM sale ORDER BY region, amount DESC, seller;`, ` region | seller | amount | rn | rnk | drnk
--------+--------+--------+----+-----+------
 North  | Bob    | 200.00 |  1 |   1 |    1
 North  | Alice  | 150.00 |  2 |   2 |    2
 North  | Bob    | 150.00 |  3 |   2 |    2
 North  | Alice  | 100.00 |  4 |   4 |    3
 South  | Carol  | 300.00 |  1 |   1 |    1
 South  | Carol  | 250.00 |  2 |   2 |    2
 South  | Dave   | 220.00 |  3 |   3 |    3
 South  | Dave   | 180.00 |  4 |   4 |    4
(8 rows)`, { hlOut: [4, 5, 6] }), 1.05)}
<p style="font-size:22px;margin:0">Same window, three functions. <b>South has no tie</b>, so all three columns agree: 1, 2, 3, 4. <b>North has the tie at 150</b> — and that is the only place they disagree.</p>` },

  { t: 'Picture it: what happens at the tie', giua: true, body: `
${zm(rankCols(), 1.25)}
<p style="font-size:22px;margin:0">The two 150 rows are ${kw('peers', 'rows with the same ORDER BY value')}. <code class="i">rank</code> gives peers the same number, then <b>skips</b> the places they used. <code class="i">dense_rank</code> gives the same number and <b>does not skip</b>.</p>` },

  { t: 'Which one to pick — and how they are computed', giua: true, body: `
${zm(cards([
    ['row_number() → 1, 2, 3, 4', 'Always distinct. Breaks ties <b>arbitrarily</b>. Use when you need <b>exactly one</b> row per position — “the one latest order”.'],
    ['rank() → 1, 2, 2, 4', 'Ties share a number, then it <b>skips</b> — sports standings, two silvers and no bronze.'],
    ['dense_rank() → 1, 2, 2, 3', 'Ties share a number, <b>no gap</b>. Use when the number is shown to users and a gap would look like a bug.'],
  ]), 1.12)}
${two(box('rank = 1 + rows strictly ahead', 'Alice’s 100 has <b>3</b> rows with a bigger amount ahead of it (200, 150, 150) → rank <b>4</b>.', 'lam'),
box('dense_rank = 1 + distinct values ahead', 'Ahead of 100 there are only <b>2</b> distinct amounts (200 and 150) → dense_rank <b>3</b>.', 'xanh'))}
<p class="nho" style="font-size:20px">Pick by intent: unique numbering → row_number · standings with gaps → rank · standings without gaps → dense_rank.</p>` },

  { t: 'Two relatives: percent_rank and cume_dist', giua: true, body: `
${zm(run(`SELECT seller, amount,
       rank()                              OVER w AS rnk,
       round(percent_rank() OVER w::numeric, 2) AS pct_rank,
       round(cume_dist()    OVER w::numeric, 2) AS cume
FROM sale WINDOW w AS (ORDER BY amount DESC)
ORDER BY amount DESC, seller;`, ` seller | amount | rnk | pct_rank | cume
--------+--------+-----+----------+------
 Carol  | 300.00 |   1 |     0.00 | 0.13
 Carol  | 250.00 |   2 |     0.14 | 0.25
 Dave   | 220.00 |   3 |     0.29 | 0.38
 Bob    | 200.00 |   4 |     0.43 | 0.50
 Dave   | 180.00 |   5 |     0.57 | 0.63
 Alice  | 150.00 |   6 |     0.71 | 0.88
 Bob    | 150.00 |   6 |     0.71 | 0.88
 Alice  | 100.00 |   8 |     1.00 | 1.00
(8 rows)`, { hlOut: [6] }), 1.0)}
${two(box('percent_rank', '<code class="i">(rank − 1) / (rows − 1)</code>: 0 for the first, 1 for the last. Bob’s 200 → (4−1)/7 = <b>0.43</b>.', 'lam'),
box('cume_dist', 'share of rows <b>at or ahead of</b> this one: Bob’s 200 → 4 of 8 = <b>0.50</b> — “top 50 %”.', 'xanh'))}` },

  { t: 'Trap: a tie makes row_number unpredictable', giua: true, body: `
${two(box('Seen on these very slides', 'Slide 4 (whole table): <b>Bob 150 → 6, Alice 150 → 7</b>.<br>Slide 5 (per region): <b>Alice 150 → 2, Bob 150 → 3</b>.<br>Same data, same server — the tie went <b>different ways</b>. PostgreSQL never promised an order among peers.', 'bad'),
`${zm(run(`SELECT seller, amount, row_number() OVER
  (PARTITION BY region ORDER BY amount DESC, id) AS rn
FROM sale WHERE region = 'North' ORDER BY rn;`, ` seller | amount | rn
--------+--------+----
 Bob    | 200.00 |  1
 Alice  | 150.00 |  2
 Bob    | 150.00 |  3
 Alice  | 100.00 |  4
(4 rows)`, { hl: [2] }), 1.0)}`)}
${box('The fix: add a unique tiebreaker', '<code class="i">ORDER BY amount DESC, id</code> — the id is unique, so the order is now <b>fully decided</b> and identical on every run, after VACUUM, on every replica. A “latest note per user” that flickers between two values every few days is this bug.', 'xanh')}` },

  { t: 'Why you cannot filter rankings in WHERE', giua: true, body: `
${two(zm(run(`SELECT region, seller, amount,
  row_number() OVER (PARTITION BY region
    ORDER BY amount DESC) AS rn
FROM sale WHERE rn <= 2;`, `ERROR:  column "rn" does not exist
LINE 3: FROM sale WHERE rn <= 2;
                        ^`, { hlOut: [1] }), 1.0),
zm(run(`SELECT region, seller, amount
FROM sale
WHERE row_number() OVER (PARTITION BY region
        ORDER BY amount DESC) <= 2;`, `ERROR:  window functions are not allowed
in WHERE`, { hlOut: [1, 2] }), 1.0))}
${flow([{ t: 'FROM' }, { t: 'WHERE', s: 'rn? not yet', mau: '#c0392b' }, { t: 'GROUP BY' }, { t: 'WINDOW', s: 'rn is born', mau: '#e08a1e' }, { t: 'SELECT', s: 'alias rn' }, { t: 'ORDER BY' }], { h: 120, fs: 20 })}
<p style="font-size:21px;margin:0">The alias <code class="i">rn</code> is created at SELECT; the window itself is computed after WHERE. At WHERE time <b>neither exists</b>.</p>` },

  { t: 'Top-N per group: rank in a CTE, filter outside', giua: true, body: `
${zm(run(`WITH ranked AS (
  SELECT region, seller, amount,
         row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn
  FROM sale
)
SELECT region, seller, amount FROM ranked WHERE rn <= 2 ORDER BY region, rn;`, ` region | seller | amount
--------+--------+--------
 North  | Bob    | 200.00
 North  | Alice  | 150.00
 South  | Carol  | 300.00
 South  | Carol  | 250.00
(4 rows)`, { hl: [3, 6] }), 1.08)}
<p style="font-size:22px;margin:0">Step 1, inside the CTE (lesson 7.3): compute <code class="i">rn</code> for every row. Step 2, the outer query: by now <code class="i">rn</code> is an ordinary column, so <code class="i">WHERE rn &lt;= 2</code> works. Top 3 posts per category, best 5 customers per city, latest 2 orders per user — <b>all are this shape</b>.</p>` },

  { t: 'Picture it: rank everything, then cut', body: `
${zm(topNCut(), 1.08)}` },

  { t: 'Same idea as a subquery — and DISTINCT ON for top-1', giua: true, body: `
${two(`<div>${zm(run(`SELECT region, seller, amount, rn
FROM (SELECT region, seller, amount,
        row_number() OVER (PARTITION BY region
          ORDER BY amount DESC, id) AS rn
      FROM sale) t
WHERE rn <= 2 ORDER BY region, rn;`, ` region | seller | amount | rn
--------+--------+--------+----
 North  | Bob    | 200.00 |  1
 North  | Alice  | 150.00 |  2
 South  | Carol  | 300.00 |  1
 South  | Carol  | 250.00 |  2
(4 rows)`), 1.0)}${box('Subquery or CTE?', 'Identical result. The subquery needs an alias (<code class="i">t</code>); the CTE reads top-down.', 'lam')}</div>`,
`<div>${zm(run(`SELECT DISTINCT ON (region)
       region, seller, amount
FROM sale
ORDER BY region, amount DESC, id;`, ` region | seller | amount
--------+--------+--------
 North  | Bob    | 200.00
 South  | Carol  | 300.00
(2 rows)`, { hl: [1] }), 1.0)}${box('PostgreSQL only: DISTINCT ON', 'Keeps the <b>first row of each region</b> in the ORDER BY. Shortest way to write “top 1 per group” — but only top 1.', 'xanh')}</div>`)}` },

  { t: 'Top-N with ties: let rank decide', giua: true, body: `
${zm(run(`WITH r AS (
  SELECT region, seller, amount,
         rank() OVER (PARTITION BY region ORDER BY amount DESC) AS rnk
  FROM sale
)
SELECT region, seller, amount, rnk FROM r WHERE rnk <= 2 ORDER BY region, rnk, seller;`, ` region | seller | amount | rnk
--------+--------+--------+-----
 North  | Bob    | 200.00 |   1
 North  | Alice  | 150.00 |   2
 North  | Bob    | 150.00 |   2
 South  | Carol  | 300.00 |   1
 South  | Carol  | 250.00 |   2
(5 rows)`, { hl: [3], hlOut: [4, 5] }), 1.05)}
<p style="font-size:22px;margin:0">With <code class="i">row_number</code> North kept <b>2</b> rows and one 150 lost by coin flip. With <code class="i">rank</code> both 150s share 2nd place, so North keeps <b>3</b> rows. Choose deliberately: “exactly N rows” → row_number; “everyone in the top N places” → rank.</p>` },

  { t: 'CT Shop: the top-3 best sellers of each category', giua: true, body: `
${zm(run(`WITH sold AS (
  SELECT p.category_id, p.name, sum(oi.qty) AS units
  FROM order_item oi
  JOIN orders  o ON o.id = oi.order_id AND o.status <> 'cancelled'
  JOIN product p ON p.id = oi.product_id
  GROUP BY p.category_id, p.name
), ranked AS (
  SELECT category_id, name, units, row_number() OVER
    (PARTITION BY category_id ORDER BY units DESC, name) AS rn
  FROM sold
)
SELECT category_id, rn, name, units FROM ranked
WHERE rn <= 3 AND category_id IN (5, 10) ORDER BY category_id, rn;`, ` category_id | rn |                name                | units
-------------+----+------------------------------------+-------
           5 |  1 | Bút bi Thiên Long TL-027 (xanh)    |   240
           5 |  2 | Bút bi bấm Deli 0.7mm (hộp 12 cây) |   222
           5 |  3 | Bút bi Pentel BK77 0.7mm           |   216
          10 |  1 | Máy tính Casio FX-570VN Plus       |   228
          10 |  2 | Máy tính Casio FX-580VN X          |   205
          10 |  3 | Máy tính Casio MX-12B (văn phòng)  |   199
(6 rows)`, { ngang: false, hl: [9], title: 'psql (17.11) — ctshop' }), 0.84)}
<p style="font-size:20px;margin:0">GROUP BY first (units per product), window on top (rank inside each category), filter outside. Without the <code class="i">category_id IN (5, 10)</code> it returns <b>24 rows = 8 categories × 3</b>.</p>` },

  { t: 'cuongthai.com: the 2 newest comments per post', giua: true, body: `
${zm(sql(`// src/services/work/feed.service.ts — CT Work feed (real code)
const rows = await prisma.$queryRaw<Array<{ id: number }>>\`
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY post_id
                                  ORDER BY created_at DESC, id DESC) AS rn
    FROM work_feed_comments
    WHERE post_id IN (\${Prisma.join(ids)}) AND parent_id IS NULL
      AND deleted_at IS NULL
  ) t WHERE rn <= 2\`;`, { lang: 'typescript' }), 1.0)}
${two(box('Exactly this lesson', 'Partition by post, newest first, keep <code class="i">rn &lt;= 2</code> in an outer query — one round trip for a whole page of posts instead of one query per post.', 'xanh'),
box('Note the tiebreaker', '<code class="i">created_at DESC, id DESC</code>: two comments in the same millisecond still come out in a fixed order. A sibling query elsewhere in the codebase sorts by <code class="i">created_at</code> alone — exactly the trap from slide 10.', 'lam'))}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:430px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">ROW_NUMBER() / RANK() / DENSE_RANK()</code></td><td><b>Identical</b>, same tie rules</td></tr>
<tr><td><code class="i">SELECT TOP 3 …</code> (whole result)</td><td><code class="i">… LIMIT 3</code> — still not per group</td></tr>
<tr><td>Top-1 per group: ROW_NUMBER in a CTE</td><td>Same — or the shortcut <code class="i">DISTINCT ON (group)</code></td></tr>
<tr><td><code class="i">QUALIFY</code>? Not in SQL Server</td><td>Not in PostgreSQL 17 either: <i>syntax error at or near "row_number"</i></td></tr>
<tr><td><code class="i">PERCENT_RANK() / CUME_DIST()</code></td><td>Same names: <code class="i">percent_rank() / cume_dist()</code></td></tr>
</table>`, 1.1)}
${box('QUALIFY exists in Snowflake, BigQuery, DuckDB…', 'If you meet it in a tutorial: in PostgreSQL (and SQL Server) write the CTE + outer WHERE instead.', 'lam')}` },

  { t: 'Exercise: two ranking questions', to: true, giua: true, body: `
<p style="margin:0">Using the <code class="i">sale</code> table:</p>
<ol>
<li>Rank the <b>sellers</b> by their <b>total</b> sales (biggest first) and show the place: 1, 2, 3 … with no gaps. <span class="nho">(Hint: GROUP BY first, window on top — 8.1.)</span></li>
<li>Show the <b>most recent sale of each seller</b> — exactly one row per seller, even if two sales ever share a date.</li>
</ol>
${box('Before you run it — predict', 'Which ranking function fits each task? How many rows will each answer have?', 'lam')}
<p class="nho">Pause the video and write both queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${zm(run(`SELECT seller, sum(amount) AS total,
       dense_rank() OVER (ORDER BY sum(amount) DESC)
         AS place
FROM sale GROUP BY seller ORDER BY place, seller;`, ` seller | total  | place
--------+--------+-------
 Carol  | 550.00 |     1
 Dave   | 400.00 |     2
 Bob    | 350.00 |     3
 Alice  | 250.00 |     4
(4 rows)`, { ngang: true, hl: [2] }), 1.0)}
${zm(run(`WITH r AS (
  SELECT seller, sold_on, amount,
         row_number() OVER (PARTITION BY seller
           ORDER BY sold_on DESC, id DESC) AS rn
  FROM sale
)
SELECT seller, sold_on, amount
FROM r WHERE rn = 1 ORDER BY seller;`, ` seller |  sold_on   | amount
--------+------------+--------
 Alice  | 2026-02-10 | 150.00
 Bob    | 2026-03-01 | 150.00
 Carol  | 2026-02-20 | 250.00
 Dave   | 2026-03-10 | 220.00
(4 rows)`, { ngang: true, hl: [4] }), 1.0)}
<p style="font-size:21px;margin:0">1) <b>dense_rank</b> (“no gaps”), computed over the GROUP BY result. 2) <b>row_number</b> (“exactly one”) with <code class="i">id DESC</code> as tiebreaker. Both give <b>4 rows</b> — one per seller.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>Amounts 200, 150, 150, 100 (descending). Write the <code class="i">rank</code> and the <code class="i">dense_rank</code> columns.</li>
<li>Why does <code class="i">… WHERE rn &lt;= 3</code> fail in the same SELECT that defines <code class="i">rn</code>?</li>
<li>“Latest order per customer” sometimes shows a different order for the same customer. What is missing?</li>
</ol>
${box('Answers', '<b>1.</b> rank 1, 2, 2, 4 · dense_rank 1, 2, 2, 3. <b>2.</b> WHERE runs before the window (and before the alias exists) — rank in a CTE/subquery, filter outside. <b>3.</b> A unique tiebreaker: <code class="i">ORDER BY created_at DESC, id DESC</code>.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><code class="i">ORDER BY</code> inside OVER numbers rows; <code class="i">PARTITION BY</code> restarts the count per group</li>
<li>Ties: row_number 1 2 3 4 · rank 1 2 2 4 · dense_rank 1 2 2 3</li>
<li>Always add a <b>unique tiebreaker</b> when one row must win</li>
<li>Top-N per group = rank in a <b>CTE/subquery</b>, filter outside (top-1: <code class="i">DISTINCT ON</code>)</li>
</ul>
${box('Next: 8.3 — LAG, LEAD & running totals', 'Once rows are ordered, every row has a “previous” and a “next” — and a growing set of rows “so far”. That gives month-over-month growth and cumulative revenue.', 'lam')}` },
]);
