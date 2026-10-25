/**
 * Lab 4 — CT Shop: bảng điều khiển tăng trưởng (sau Chương 8). Agent lab34, 25/10/2026.
 * Chèn vào Chương 8 bằng lab/index.mjs (LAB_SAU[8]) — sau bài 8.4, trước quiz.
 * Kiến thức tới Ch8 (CTE, WITH RECURSIVE, hàm cửa sổ: LAG, ROW_NUMBER/RANK/DENSE_RANK, SUM() OVER, khung ROWS/RANGE, generate_series).
 * Mới, giảng ngắn ngay trong lab: NULLIF. Ví dụ KHÁC Ch8 (Ch8 đã làm MoM + YTD 2026 và top-3 danh mục 5/10 theo mọi đơn không huỷ):
 * lab làm YoY (LAG 12) + bẫy lọc trước cửa sổ, tuần trống của Moleskine, luỹ kế theo ngày tháng 9, top-3 9 tháng (hoà ở Vở ô ly), tỷ trọng, cây 3 tầng.
 * Con số trùng Ch8 phải khớp: doanh thu 9 tháng 2026 = 411.147.000, MoM 2026 (−36,2 · 105,9 …) — đã đối chiếu pg-08-3b.out.txt.
 * Mọi output = chạy thật PostgreSQL 17.11 (lab4-start.sql rồi lab4-solution.sql bằng psql -f qua TTY, DB nháp ctlab4).
 * Q / O / SOL SINH TỰ ĐỘNG từ lab/sql/lab4-solution.sql + output thật (scratchpad lab34/mk-o.mjs) — không gõ tay.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-4.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s, lang = 'sql') => `<pre><code class="language-${lang}">${esc(s).split('\n').map((l) => l.replace(lang === 'sql' ? /(--.*)$/ : /(\/\/.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Câu SQL từng bước — sinh từ lab4-solution.sql. */
/* Q:BEGIN */
const Q = {
  W1: `WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment
  WHERE paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       round(100 * (revenue - lag(revenue) OVER w)
                  / lag(revenue) OVER w, 1) AS mom_pct,
       lag(revenue, 12) OVER w AS last_year,
       round(100 * (revenue / lag(revenue, 12) OVER w - 1), 1)
         AS yoy_pct
FROM m
WINDOW w AS (ORDER BY month)
ORDER BY month;   -- 21 rows; 2026-03 +34.7 % vs 2025-03`,
  W1X: `WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment
  WHERE paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       lag(revenue, 12) OVER (ORDER BY month) AS last_year
FROM m
WHERE month >= '2026-01-01'
ORDER BY month;   -- last_year all NULL ✗`,
  W1B: `WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment
  WHERE paid_at < '2026-10-01'
  GROUP BY 1
), g AS (
  SELECT month, revenue,
         lag(revenue, 12) OVER (ORDER BY month) AS last_year
  FROM m
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue, last_year,
       round(100 * (revenue / last_year - 1), 1) AS yoy_pct
FROM g
WHERE month >= '2026-01-01'
ORDER BY month;   -- 9 rows; 2026-03 +34.7 %`,
  W2X: `WITH sold AS (
  SELECT date_trunc('week', p.paid_at)::date AS week, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE pr.sku = 'CT0906' AND p.paid_at >= '2026-06-29' AND p.paid_at < '2026-09-28'
  GROUP BY 1
)
SELECT week, units,
       lag(week)  OVER (ORDER BY week) AS prev_week,
       lag(units) OVER (ORDER BY week) AS prev_units
FROM sold
ORDER BY week;   -- 8 rows for 13 weeks ✗`,
  W2E: `WITH weeks AS (
  SELECT generate_series(date '2026-06-29', date '2026-09-21',
                         interval '7 days')::date AS week
), sold AS (
  SELECT date_trunc('week', p.paid_at)::date AS week, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE pr.sku = 'CT0906' AND p.paid_at >= '2026-06-29' AND p.paid_at < '2026-09-28'
  GROUP BY 1
), filled AS (
  SELECT w.week, coalesce(s.units, 0) AS units
  FROM weeks w LEFT JOIN sold s ON s.week = w.week
)
SELECT week, units, lag(units) OVER (ORDER BY week) AS prev,
       round(100.0 * (units - lag(units) OVER (ORDER BY week))
             / lag(units) OVER (ORDER BY week)) AS wow_pct
FROM filled
ORDER BY week;   -- ERROR division by zero`,
  W2: `WITH weeks AS (
  SELECT generate_series(date '2026-06-29', date '2026-09-21',
                         interval '7 days')::date AS week
), sold AS (
  SELECT date_trunc('week', p.paid_at)::date AS week, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE pr.sku = 'CT0906' AND p.paid_at >= '2026-06-29' AND p.paid_at < '2026-09-28'
  GROUP BY 1
), filled AS (
  SELECT w.week, coalesce(s.units, 0) AS units
  FROM weeks w LEFT JOIN sold s ON s.week = w.week
)
SELECT week, units, lag(units) OVER (ORDER BY week) AS prev,
       round(100.0 * (units - lag(units) OVER (ORDER BY week))
             / NULLIF(lag(units) OVER (ORDER BY week), 0))
         AS wow_pct
FROM filled
ORDER BY week;   -- 13 rows, 5 weeks with 0`,
  W3X: `SELECT p.paid_at::date AS day, p.order_id, p.amount,
       sum(p.amount) OVER (ORDER BY p.paid_at::date) AS range_default,
       sum(p.amount) OVER (ORDER BY p.paid_at::date
                           ROWS BETWEEN UNBOUNDED PRECEDING
                                    AND CURRENT ROW) AS rows_frame
FROM payment p
WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01'
ORDER BY p.paid_at, p.id
LIMIT 8;`,
  W3A: `SELECT p.paid_at::date AS day, p.order_id, p.amount,
       sum(p.amount) OVER (ORDER BY p.paid_at, p.id) AS running
FROM payment p
WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01'
ORDER BY p.paid_at, p.id
LIMIT 8;`,
  W3B: `WITH d AS (
  SELECT paid_at::date AS day, count(*) AS payments, sum(amount) AS revenue
  FROM payment
  WHERE paid_at >= '2026-09-01' AND paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT day, payments, revenue,
       sum(revenue) OVER (ORDER BY day) AS month_to_date
FROM d
ORDER BY day;   -- 29 days; 30/09 → 42485000.00`,
  W4A: `WITH sold AS (
  SELECT pr.category_id, pr.sku, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
  GROUP BY pr.category_id, pr.sku
)
SELECT sku, units,
       row_number() OVER w AS row_number,
       rank()       OVER w AS rank,
       dense_rank() OVER w AS dense_rank
FROM sold
WHERE category_id = 8   -- Vở ô ly: a tie for 2nd place
WINDOW w AS (PARTITION BY category_id ORDER BY units DESC)
ORDER BY units DESC, sku;`,
  W4C: `WITH sold AS (
  SELECT pr.category_id, pr.sku, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
  GROUP BY pr.category_id, pr.sku
), r AS (
  SELECT row_number() OVER w AS rn, rank() OVER w AS rk,
         dense_rank() OVER w AS dr
  FROM sold
  WINDOW w AS (PARTITION BY category_id ORDER BY units DESC)
)
SELECT count(*) FILTER (WHERE rn <= 3) AS by_row_number,
       count(*) FILTER (WHERE rk <= 3) AS by_rank,
       count(*) FILTER (WHERE dr <= 3) AS by_dense_rank
FROM r;   -- 24 | 24 | 25`,
  W4: `WITH sold AS (
  SELECT pr.category_id, pr.sku, pr.name, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
  GROUP BY pr.category_id, pr.sku, pr.name
), ranked AS (
  SELECT category_id, sku, name, units,
         row_number() OVER (PARTITION BY category_id
                            ORDER BY units DESC, revenue DESC, sku) AS pos
  FROM sold
)
SELECT c.name AS category, r.pos, r.sku, r.name, r.units
FROM ranked r
JOIN category c ON c.id = r.category_id
WHERE r.pos <= 3
ORDER BY c.id, r.pos;   -- 24 rows`,
  W5: `SELECT r.name AS root, c.name AS category,
       sum(oi.qty * oi.unit_price) AS revenue,
       round(100 * sum(oi.qty * oi.unit_price)
             / sum(sum(oi.qty * oi.unit_price)) OVER (), 1) AS pct_shop,
       round(100 * sum(oi.qty * oi.unit_price)
             / sum(sum(oi.qty * oi.unit_price))
                 OVER (PARTITION BY r.name), 1) AS pct_in_root
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name, c.name
ORDER BY r.name, revenue DESC;   -- 8 rows; calculators 54.9 % of the shop`,
  W6A: `WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 AS depth, name AS path, id AS root_id
  FROM category
  WHERE parent_id IS NULL   -- anchor: the 4 roots
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.depth + 1, t.path || ' › ' || c.name, t.root_id
  FROM category c
  JOIN tree t ON c.parent_id = t.id   -- step: children of the rows found so far
)
SELECT id, depth, path FROM tree ORDER BY root_id, path;   -- 12 rows, depth 1–2`,
  W6INS: `INSERT INTO category (name, parent_id) VALUES ('Bút gel', 5)
RETURNING id, name, parent_id;`,
  W6UPD: `UPDATE product SET category_id = 13
WHERE sku IN ('CT0504', 'CT0505');`,
  W6X: `SELECT r.name AS root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name
ORDER BY revenue DESC;   -- 5 rows ✗`,
  W6: `WITH RECURSIVE tree AS (
  SELECT id, name AS root
  FROM category WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, t.root
  FROM category c JOIN tree t ON c.parent_id = t.id
)
SELECT t.root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN tree t        ON t.id = pr.category_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY t.root
ORDER BY revenue DESC;   -- 4 rows ✓, Bút & mực 54875000`,
  W6D: `WITH RECURSIVE tree AS (
  SELECT id, 1 AS depth, name AS path
  FROM category WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, t.depth + 1, t.path || ' › ' || c.name
  FROM category c JOIN tree t ON c.parent_id = t.id
)
SELECT depth, path FROM tree
WHERE path LIKE 'Bút & mực%' ORDER BY path;   -- depth 3 appears`,
  SC1: `SELECT count(*) AS months, sum(revenue) AS total
FROM (SELECT date_trunc('month', paid_at), sum(amount) AS revenue
      FROM payment WHERE paid_at < '2026-10-01' GROUP BY 1) m;   -- 21 | 945525000.00`,
  SC2: `SELECT sum(amount) AS sep_total FROM payment
WHERE paid_at >= '2026-09-01' AND paid_at < '2026-10-01';   -- 42485000.00`,
  SC3: `SELECT count(*) AS categories FROM category;   -- 12 (the ROLLBACK undid Bút gel)`,
};
/* Q:END */

/* Output THẬT (PostgreSQL 17.11) — sinh từ lab4-solution.sql chạy bằng psql -f. */
/* O:BEGIN */
const O = {
  W1: `  month  |   revenue   | mom_pct |  last_year  | yoy_pct 
---------+-------------+---------+-------------+---------
 2025-01 | 47822000.00 |         |             |        
 2025-02 | 41651000.00 |   -12.9 |             |        
 2025-03 | 47443000.00 |    13.9 |             |        
 2025-04 | 28095000.00 |   -40.8 |             |        
 2025-05 | 57284000.00 |   103.9 |             |        
 2025-06 | 41420000.00 |   -27.7 |             |        
 2025-07 | 52033000.00 |    25.6 |             |        
 2025-08 | 44354000.00 |   -14.8 |             |        
 2025-09 | 43172000.00 |    -2.7 |             |        
 2025-10 | 40043000.00 |    -7.2 |             |        
 2025-11 | 50818000.00 |    26.9 |             |        
 2025-12 | 40243000.00 |   -20.8 |             |        
 2026-01 | 48698000.00 |    21.0 | 47822000.00 |     1.8
 2026-02 | 31046000.00 |   -36.2 | 41651000.00 |   -25.5
 2026-03 | 63914000.00 |   105.9 | 47443000.00 |    34.7
 2026-04 | 37252000.00 |   -41.7 | 28095000.00 |    32.6
 2026-05 | 49290000.00 |    32.3 | 57284000.00 |   -14.0
 2026-06 | 40587000.00 |   -17.7 | 41420000.00 |    -2.0
 2026-07 | 60560000.00 |    49.2 | 52033000.00 |    16.4
 2026-08 | 37315000.00 |   -38.4 | 44354000.00 |   -15.9
 2026-09 | 42485000.00 |    13.9 | 43172000.00 |    -1.6
(21 rows)`,
  W1X: `  month  |   revenue   | last_year 
---------+-------------+-----------
 2026-01 | 48698000.00 |          
 2026-02 | 31046000.00 |          
 2026-03 | 63914000.00 |          
 2026-04 | 37252000.00 |          
 2026-05 | 49290000.00 |          
 2026-06 | 40587000.00 |          
 2026-07 | 60560000.00 |          
 2026-08 | 37315000.00 |          
 2026-09 | 42485000.00 |          
(9 rows)`,
  W1B: `  month  |   revenue   |  last_year  | yoy_pct 
---------+-------------+-------------+---------
 2026-01 | 48698000.00 | 47822000.00 |     1.8
 2026-02 | 31046000.00 | 41651000.00 |   -25.5
 2026-03 | 63914000.00 | 47443000.00 |    34.7
 2026-04 | 37252000.00 | 28095000.00 |    32.6
 2026-05 | 49290000.00 | 57284000.00 |   -14.0
 2026-06 | 40587000.00 | 41420000.00 |    -2.0
 2026-07 | 60560000.00 | 52033000.00 |    16.4
 2026-08 | 37315000.00 | 44354000.00 |   -15.9
 2026-09 | 42485000.00 | 43172000.00 |    -1.6
(9 rows)`,
  W2X: `    week    | units | prev_week  | prev_units 
------------+-------+------------+------------
 2026-06-29 |     3 |            |           
 2026-07-06 |     4 | 2026-06-29 |          3
 2026-07-20 |     3 | 2026-07-06 |          4
 2026-08-10 |     2 | 2026-07-20 |          3
 2026-08-17 |     1 | 2026-08-10 |          2
 2026-08-24 |     3 | 2026-08-17 |          1
 2026-09-14 |     3 | 2026-08-24 |          3
 2026-09-21 |     3 | 2026-09-14 |          3
(8 rows)`,
  W2E: `psql:/tmp/lab4-solution.sql:95: ERROR:  division by zero`,
  W2: `    week    | units | prev | wow_pct 
------------+-------+------+---------
 2026-06-29 |     3 |      |        
 2026-07-06 |     4 |    3 |      33
 2026-07-13 |     0 |    4 |    -100
 2026-07-20 |     3 |    0 |        
 2026-07-27 |     0 |    3 |    -100
 2026-08-03 |     0 |    0 |        
 2026-08-10 |     2 |    0 |        
 2026-08-17 |     1 |    2 |     -50
 2026-08-24 |     3 |    1 |     200
 2026-08-31 |     0 |    3 |    -100
 2026-09-07 |     0 |    0 |        
 2026-09-14 |     3 |    0 |        
 2026-09-21 |     3 |    3 |       0
(13 rows)`,
  W3X: `    day     | order_id |   amount   | range_default | rows_frame 
------------+----------+------------+---------------+------------
 2026-09-01 |     1393 |  312000.00 |     511000.00 |  511000.00
 2026-09-01 |     1851 |  199000.00 |     511000.00 |  199000.00
 2026-09-02 |     1421 |  522000.00 |    3869000.00 | 1033000.00
 2026-09-02 |      479 |  384000.00 |    3869000.00 | 1446000.00
 2026-09-02 |     1584 |   29000.00 |    3869000.00 | 1062000.00
 2026-09-02 |      278 | 2423000.00 |    3869000.00 | 3869000.00
 2026-09-03 |     1440 |   58000.00 |    4514000.00 | 4023000.00
 2026-09-03 |     1810 |  427000.00 |    4514000.00 | 4514000.00
(8 rows)`,
  W3A: `    day     | order_id |   amount   |  running   
------------+----------+------------+------------
 2026-09-01 |     1393 |  312000.00 |  312000.00
 2026-09-01 |     1851 |  199000.00 |  511000.00
 2026-09-02 |     1421 |  522000.00 | 1033000.00
 2026-09-02 |      479 |  384000.00 | 1417000.00
 2026-09-02 |     1584 |   29000.00 | 1446000.00
 2026-09-02 |      278 | 2423000.00 | 3869000.00
 2026-09-03 |     1440 |   58000.00 | 3927000.00
 2026-09-03 |     1810 |  427000.00 | 4354000.00
(8 rows)`,
  W3B: `    day     | payments |  revenue   | month_to_date 
------------+----------+------------+---------------
 2026-09-01 |        2 |  511000.00 |     511000.00
 2026-09-02 |        4 | 3358000.00 |    3869000.00
 2026-09-03 |        4 |  645000.00 |    4514000.00
 2026-09-04 |        1 |  177000.00 |    4691000.00
 2026-09-05 |        5 | 3359000.00 |    8050000.00
 2026-09-06 |        3 | 1787000.00 |    9837000.00
 2026-09-07 |        1 |   49000.00 |    9886000.00
 2026-09-08 |        4 | 2331000.00 |   12217000.00
 2026-09-09 |        1 |  340000.00 |   12557000.00
 2026-09-10 |        5 | 1854000.00 |   14411000.00
 2026-09-12 |        5 | 3038000.00 |   17449000.00
 2026-09-13 |        3 | 1280000.00 |   18729000.00
 2026-09-14 |        1 |  103000.00 |   18832000.00
 2026-09-15 |        2 |  672000.00 |   19504000.00
 2026-09-16 |        3 |  268000.00 |   19772000.00
 2026-09-17 |        3 | 3568000.00 |   23340000.00
 2026-09-18 |        5 | 1192000.00 |   24532000.00
 2026-09-19 |        1 |  150000.00 |   24682000.00
 2026-09-20 |        3 | 4419000.00 |   29101000.00
 2026-09-21 |        3 |  374000.00 |   29475000.00
 2026-09-22 |        1 |  419000.00 |   29894000.00
 2026-09-23 |        2 |   54000.00 |   29948000.00
 2026-09-24 |        1 | 3024000.00 |   32972000.00
 2026-09-25 |        3 | 1960000.00 |   34932000.00
 2026-09-26 |        2 | 3174000.00 |   38106000.00
 2026-09-27 |        3 |  763000.00 |   38869000.00
 2026-09-28 |        5 | 1897000.00 |   40766000.00
 2026-09-29 |        1 |  264000.00 |   41030000.00
 2026-09-30 |        3 | 1455000.00 |   42485000.00
(29 rows)`,
  W4A: `  sku   | units | row_number | rank | dense_rank 
--------+-------+------------+------+------------
 CT0803 |   102 |          1 |    1 |          1
 CT0804 |    64 |          2 |    2 |          2
 CT0805 |    64 |          3 |    2 |          2
 CT0801 |    63 |          4 |    4 |          3
 CT0802 |    52 |          5 |    5 |          4
 CT0806 |    47 |          6 |    6 |          5
(6 rows)`,
  W4C: ` by_row_number | by_rank | by_dense_rank 
---------------+---------+---------------
            24 |      24 |            25
(1 row)`,
  W4: `     category     | pos |  sku   |                  name                   | units 
------------------+-----+--------+-----------------------------------------+-------
 Bút bi           |   1 | CT0501 | Bút bi Thiên Long TL-027 (xanh)         |   104
 Bút bi           |   2 | CT0506 | Bút bi bấm Deli 0.7mm (hộp 12 cây)      |    94
 Bút bi           |   3 | CT0503 | Bút bi Pentel BK77 0.7mm                |    89
 Bút chì & tẩy    |   1 | CT0605 | Bút chì Staedtler Noris 2B (hộp 12 cây) |    92
 Bút chì & tẩy    |   2 | CT0603 | Ruột chì kim Pentel 0.5mm 2B            |    83
 Bút chì & tẩy    |   3 | CT0606 | Bút chì màu Faber-Castell 24 màu        |    79
 Bút dạ quang     |   1 | CT0701 | Bút dạ quang Thiên Long HL-03           |    72
 Bút dạ quang     |   2 | CT0704 | Bút dạ quang hai đầu Deli               |    65
 Bút dạ quang     |   3 | CT0703 | Bút dạ quang Stabilo Boss Pastel (bộ 6) |    64
 Vở ô ly          |   1 | CT0803 | Vở kẻ ngang Campus 80 trang             |   102
 Vở ô ly          |   2 | CT0805 | Lốc 10 vở Hồng Hà 96 trang              |    64
 Vở ô ly          |   3 | CT0804 | Vở kẻ ngang Campus 200 trang            |    64
 Sổ tay           |   1 | CT0901 | Sổ lò xo Campus A5                      |    85
 Sổ tay           |   2 | CT0903 | Sổ chấm bullet journal A5               |    79
 Sổ tay           |   3 | CT0904 | Sổ tay Deli B5 kẻ ngang                 |    69
 Máy tính cầm tay |   1 | CT1003 | Máy tính Vinacal 570ES Plus II          |    91
 Máy tính cầm tay |   2 | CT1002 | Máy tính Casio FX-570VN Plus            |    85
 Máy tính cầm tay |   3 | CT1004 | Máy tính Casio FX-880BTG                |    81
 Thước & compa    |   1 | CT1101 | Thước kẻ nhựa Thiên Long 20cm           |    90
 Thước & compa    |   2 | CT1105 | Compa Staedtler Noris                   |    82
 Thước & compa    |   3 | CT1104 | Compa chì kim Thiên Long                |    76
 Giáo trình IT    |   1 | CT1202 | Giáo trình Lập trình Java căn bản       |    91
 Giáo trình IT    |   2 | CT1205 | Cấu trúc dữ liệu & giải thuật           |    82
 Giáo trình IT    |   3 | CT1204 | Sổ tay SQL bỏ túi                       |    79
(24 rows)`,
  W5: `      root       |     category     |   revenue    | pct_shop | pct_in_root 
-----------------+------------------+--------------+----------+-------------
 Bút & mực       | Bút chì & tẩy    |  22782000.00 |      5.5 |        41.5
 Bút & mực       | Bút dạ quang     |  16507000.00 |      4.0 |        30.1
 Bút & mực       | Bút bi           |  15586000.00 |      3.8 |        28.4
 Dụng cụ học tập | Máy tính cầm tay | 225855000.00 |     54.9 |        93.7
 Dụng cụ học tập | Thước & compa    |  15114000.00 |      3.7 |         6.3
 Sách & tài liệu | Giáo trình IT    |  46354000.00 |     11.3 |       100.0
 Vở & giấy       | Sổ tay           |  57392000.00 |     14.0 |        83.2
 Vở & giấy       | Vở ô ly          |  11557000.00 |      2.8 |        16.8
(8 rows)`,
  W6A: ` id | depth |                path                
----+-------+------------------------------------
  1 |     1 | Bút & mực
  5 |     2 | Bút & mực › Bút bi
  6 |     2 | Bút & mực › Bút chì & tẩy
  7 |     2 | Bút & mực › Bút dạ quang
  2 |     1 | Vở & giấy
  9 |     2 | Vở & giấy › Sổ tay
  8 |     2 | Vở & giấy › Vở ô ly
  3 |     1 | Dụng cụ học tập
 10 |     2 | Dụng cụ học tập › Máy tính cầm tay
 11 |     2 | Dụng cụ học tập › Thước & compa
  4 |     1 | Sách & tài liệu
 12 |     2 | Sách & tài liệu › Giáo trình IT
(12 rows)`,
  W6INS: ` id |  name   | parent_id 
----+---------+-----------
 13 | Bút gel |         5
(1 row)

INSERT 0 1`,
  W6UPD: `UPDATE 2`,
  W6X: `      root       |   revenue    
-----------------+--------------
 Dụng cụ học tập | 240969000.00
 Vở & giấy       |  68949000.00
 Bút & mực       |  51191000.00
 Sách & tài liệu |  46354000.00
 Bút bi          |   3684000.00
(5 rows)`,
  W6: `      root       |   revenue    
-----------------+--------------
 Dụng cụ học tập | 240969000.00
 Vở & giấy       |  68949000.00
 Bút & mực       |  54875000.00
 Sách & tài liệu |  46354000.00
(4 rows)`,
  W6D: ` depth |             path             
-------+------------------------------
     1 | Bút & mực
     2 | Bút & mực › Bút bi
     3 | Bút & mực › Bút bi › Bút gel
     2 | Bút & mực › Bút chì & tẩy
     2 | Bút & mực › Bút dạ quang
(5 rows)`,
  SC1: ` months |    total     
--------+--------------
     21 | 945525000.00
(1 row)`,
  SC2: `  sep_total  
-------------
 42485000.00
(1 row)`,
  SC3: ` categories 
------------
         12
(1 row)`,
};
/* O:END */

/* Toàn văn lab4-solution.sql (trùng tệp tải về). */
/* SOL:BEGIN */
const SOL = `-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 4 — SOLUTION: the growth dashboard (CTE + window functions + recursion)
-- Lab 4 — ĐÁP ÁN: bảng điều khiển tăng trưởng (CTE + hàm cửa sổ + đệ quy)
-- cuongthai.com/courses/postgresql · PostgreSQL 17 · Chapters 1–8 (+ NULLIF, previewed here)
--
-- Needs: lab4-start.sql already run (clean standard schema + standard data).
--   docker cp lab4-solution.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab4-solution.sql
-- Every number in the comments is the real output on PostgreSQL 17.
-- Mọi con số trong chú thích là output thật trên PostgreSQL 17.
-- ═══════════════════════════════════════════════════════════════════════════
\\pset pager off
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';

-- ── W1 · growth: vs last month (LAG) and vs the same month last year (LAG 12) — all 21 months ──
WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment
  WHERE paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       round(100 * (revenue - lag(revenue) OVER w)
                  / lag(revenue) OVER w, 1) AS mom_pct,
       lag(revenue, 12) OVER w AS last_year,
       round(100 * (revenue / lag(revenue, 12) OVER w - 1), 1)
         AS yoy_pct
FROM m
WINDOW w AS (ORDER BY month)
ORDER BY month;                                                       -- 21 rows; 2026-03 +34.7 % vs 2025-03
-- ✗ trap: filter 2026 in the SAME query — WHERE runs before the window, last year is gone
WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment
  WHERE paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       lag(revenue, 12) OVER (ORDER BY month) AS last_year
FROM m
WHERE month >= '2026-01-01'
ORDER BY month;                                                       -- last_year all NULL ✗
-- ✓ compute the window first (inner query), filter afterwards (outer query)
WITH m AS (
  SELECT date_trunc('month', paid_at)::date AS month, sum(amount) AS revenue
  FROM payment
  WHERE paid_at < '2026-10-01'
  GROUP BY 1
), g AS (
  SELECT month, revenue,
         lag(revenue, 12) OVER (ORDER BY month) AS last_year
  FROM m
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue, last_year,
       round(100 * (revenue / last_year - 1), 1) AS yoy_pct
FROM g
WHERE month >= '2026-01-01'
ORDER BY month;                                                       -- 9 rows; 2026-03 +34.7 %

-- ── W2 · weekly units of the Moleskine notebook (CT0906), Q3 2026 — missing weeks ──
-- ✗ LAG on the weeks that HAVE sales: "previous week" is sometimes 2–3 weeks earlier
WITH sold AS (
  SELECT date_trunc('week', p.paid_at)::date AS week, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE pr.sku = 'CT0906' AND p.paid_at >= '2026-06-29' AND p.paid_at < '2026-09-28'
  GROUP BY 1
)
SELECT week, units,
       lag(week)  OVER (ORDER BY week) AS prev_week,
       lag(units) OVER (ORDER BY week) AS prev_units
FROM sold
ORDER BY week;                                                        -- 8 rows for 13 weeks ✗
-- fill the calendar with generate_series, then LAG — a zero week makes the % divide by zero
WITH weeks AS (
  SELECT generate_series(date '2026-06-29', date '2026-09-21',
                         interval '7 days')::date AS week
), sold AS (
  SELECT date_trunc('week', p.paid_at)::date AS week, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE pr.sku = 'CT0906' AND p.paid_at >= '2026-06-29' AND p.paid_at < '2026-09-28'
  GROUP BY 1
), filled AS (
  SELECT w.week, coalesce(s.units, 0) AS units
  FROM weeks w LEFT JOIN sold s ON s.week = w.week
)
SELECT week, units, lag(units) OVER (ORDER BY week) AS prev,
       round(100.0 * (units - lag(units) OVER (ORDER BY week))
             / lag(units) OVER (ORDER BY week)) AS wow_pct
FROM filled
ORDER BY week;                                                        -- ERROR division by zero
-- ✓ NULLIF(x, 0) returns NULL when x = 0 → the % becomes NULL ("cannot compare") instead of an error
WITH weeks AS (
  SELECT generate_series(date '2026-06-29', date '2026-09-21',
                         interval '7 days')::date AS week
), sold AS (
  SELECT date_trunc('week', p.paid_at)::date AS week, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE pr.sku = 'CT0906' AND p.paid_at >= '2026-06-29' AND p.paid_at < '2026-09-28'
  GROUP BY 1
), filled AS (
  SELECT w.week, coalesce(s.units, 0) AS units
  FROM weeks w LEFT JOIN sold s ON s.week = w.week
)
SELECT week, units, lag(units) OVER (ORDER BY week) AS prev,
       round(100.0 * (units - lag(units) OVER (ORDER BY week))
             / NULLIF(lag(units) OVER (ORDER BY week), 0))
         AS wow_pct
FROM filled
ORDER BY week;                                                        -- 13 rows, 5 weeks with 0

-- ── W3 · running total of September revenue — ROWS vs RANGE ──
-- ✗ ORDER BY a DATE that repeats: the default frame (RANGE) gives every same-day payment the day's total,
--   ROWS adds them one by one in an order PostgreSQL chooses
SELECT p.paid_at::date AS day, p.order_id, p.amount,
       sum(p.amount) OVER (ORDER BY p.paid_at::date) AS range_default,
       sum(p.amount) OVER (ORDER BY p.paid_at::date
                           ROWS BETWEEN UNBOUNDED PRECEDING
                                    AND CURRENT ROW) AS rows_frame
FROM payment p
WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01'
ORDER BY p.paid_at, p.id
LIMIT 8;
-- ✓ per payment: make the ORDER BY unique (time, then id)
SELECT p.paid_at::date AS day, p.order_id, p.amount,
       sum(p.amount) OVER (ORDER BY p.paid_at, p.id) AS running
FROM payment p
WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01'
ORDER BY p.paid_at, p.id
LIMIT 8;
-- ✓ per day (what the chart needs): aggregate first, then one row per day ⇒ ROWS = RANGE
WITH d AS (
  SELECT paid_at::date AS day, count(*) AS payments, sum(amount) AS revenue
  FROM payment
  WHERE paid_at >= '2026-09-01' AND paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT day, payments, revenue,
       sum(revenue) OVER (ORDER BY day) AS month_to_date
FROM d
ORDER BY day;                                                         -- 29 days; 30/09 → 42485000.00

-- ── W4 · top 3 products of every sub-category (units, paid in the 9 months) — ties ──
WITH sold AS (
  SELECT pr.category_id, pr.sku, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
  GROUP BY pr.category_id, pr.sku
)
SELECT sku, units,
       row_number() OVER w AS row_number,
       rank()       OVER w AS rank,
       dense_rank() OVER w AS dense_rank
FROM sold
WHERE category_id = 8                                                 -- Vở ô ly: a tie for 2nd place
WINDOW w AS (PARTITION BY category_id ORDER BY units DESC)
ORDER BY units DESC, sku;
-- how many rows does "top 3" return for the whole shop, with each function?
WITH sold AS (
  SELECT pr.category_id, pr.sku, sum(oi.qty) AS units
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
  GROUP BY pr.category_id, pr.sku
), r AS (
  SELECT row_number() OVER w AS rn, rank() OVER w AS rk,
         dense_rank() OVER w AS dr
  FROM sold
  WINDOW w AS (PARTITION BY category_id ORDER BY units DESC)
)
SELECT count(*) FILTER (WHERE rn <= 3) AS by_row_number,
       count(*) FILTER (WHERE rk <= 3) AS by_rank,
       count(*) FILTER (WHERE dr <= 3) AS by_dense_rank
FROM r;                                                               -- 24 | 24 | 25
-- ✓ the report: ROW_NUMBER with a tie-breaker (revenue, then sku) — exactly 3 per category, same every run
WITH sold AS (
  SELECT pr.category_id, pr.sku, pr.name, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
  GROUP BY pr.category_id, pr.sku, pr.name
), ranked AS (
  SELECT category_id, sku, name, units,
         row_number() OVER (PARTITION BY category_id
                            ORDER BY units DESC, revenue DESC, sku) AS pos
  FROM sold
)
SELECT c.name AS category, r.pos, r.sku, r.name, r.units
FROM ranked r
JOIN category c ON c.id = r.category_id
WHERE r.pos <= 3
ORDER BY c.id, r.pos;                                                 -- 24 rows

-- ── W5 · share in %: of the whole shop, and inside its root category ──
SELECT r.name AS root, c.name AS category,
       sum(oi.qty * oi.unit_price) AS revenue,
       round(100 * sum(oi.qty * oi.unit_price)
             / sum(sum(oi.qty * oi.unit_price)) OVER (), 1) AS pct_shop,
       round(100 * sum(oi.qty * oi.unit_price)
             / sum(sum(oi.qty * oi.unit_price))
                 OVER (PARTITION BY r.name), 1) AS pct_in_root
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name, c.name
ORDER BY r.name, revenue DESC;                                        -- 8 rows; calculators 54.9 % of the shop

-- ── W6 · the category tree with WITH RECURSIVE ──
WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 AS depth, name AS path, id AS root_id
  FROM category
  WHERE parent_id IS NULL                                             -- anchor: the 4 roots
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.depth + 1, t.path || ' › ' || c.name, t.root_id
  FROM category c
  JOIN tree t ON c.parent_id = t.id                                   -- step: children of the rows found so far
)
SELECT id, depth, path FROM tree ORDER BY root_id, path;              -- 12 rows, depth 1–2
-- the owner adds a 3rd level: "Bút gel" under "Bút bi", two gel pens move there (inside a transaction)
BEGIN;
INSERT INTO category (name, parent_id) VALUES ('Bút gel', 5)
RETURNING id, name, parent_id;
UPDATE product SET category_id = 13
WHERE sku IN ('CT0504', 'CT0505');
-- ✗ Lab 3's self-join assumes 2 levels: "Bút bi" now shows up as a ROOT
SELECT r.name AS root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name
ORDER BY revenue DESC;                                                -- 5 rows ✗
-- ✓ the recursive tree carries the real root down to every level
WITH RECURSIVE tree AS (
  SELECT id, name AS root
  FROM category WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, t.root
  FROM category c JOIN tree t ON c.parent_id = t.id
)
SELECT t.root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN tree t        ON t.id = pr.category_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY t.root
ORDER BY revenue DESC;                                                -- 4 rows ✓, Bút & mực 54875000
WITH RECURSIVE tree AS (
  SELECT id, 1 AS depth, name AS path
  FROM category WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, t.depth + 1, t.path || ' › ' || c.name
  FROM category c JOIN tree t ON c.parent_id = t.id
)
SELECT depth, path FROM tree
WHERE path LIKE 'Bút & mực%' ORDER BY path;   -- depth 3 appears
ROLLBACK;

-- ════════════════════ Self-check: these numbers must match ════════════════════
SELECT count(*) AS months, sum(revenue) AS total
FROM (SELECT date_trunc('month', paid_at), sum(amount) AS revenue
      FROM payment WHERE paid_at < '2026-10-01' GROUP BY 1) m;                        -- 21 | 945525000.00
SELECT sum(amount) AS sep_total FROM payment
WHERE paid_at >= '2026-09-01' AND paid_at < '2026-10-01';                            -- 42485000.00
SELECT count(*) AS categories FROM category;                                         -- 12 (the ROLLBACK undid Bút gel)`;
/* SOL:END */

const SETUP = `$ docker cp lab4-start.sql pgdemo:/tmp/
$ docker exec -i pgdemo psql -U postgres -d ctshop -q -f /tmp/lab4-start.sql
 categories | products | customers | orders | order_lines | payments
------------+----------+-----------+--------+-------------+----------
         12 |       48 |       300 |   2000 |        5000 |     1663
(1 row)
$ docker exec -it pgdemo psql -U postgres -d ctshop
ctshop=# SET search_path = shop;
ctshop=# SET TimeZone = 'Asia/Ho_Chi_Minh';`;

const PRISMA = `// Prisma's query API has no OVER (...): a dashboard like W1 is raw SQL
const growth = await prisma.$queryRaw\`
  WITH m AS (
    SELECT date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS month,
           sum(amount) AS revenue
    FROM shop.payment WHERE paid_at < \${to} GROUP BY 1
  ), g AS (
    SELECT month, revenue, lag(revenue, 12) OVER (ORDER BY month) AS last_year FROM m
  )
  SELECT to_char(month, 'YYYY-MM') AS month, revenue, last_year
  FROM g WHERE month >= \${from}::date ORDER BY month\`;
// Used on many screens? Turn it into a VIEW (Chapter 12) and read the view instead.`;

const FILES = (vi) => [
  [`${F}/lab4-start.sql`, '🧩', 'lab4-start.sql', vi ? 'CT Shop sạch và đầy đủ (lược đồ chuẩn + dữ liệu chuẩn) + danh sách việc W1–W6' : 'A clean, complete CT Shop (standard schema + standard data) + the W1–W6 to-do list'],
  [`${F}/lab4-solution.sql`, '🔑', 'lab4-solution.sql', vi ? 'Mọi truy vấn, mọi bẫy, output thật trong chú thích — mở sau khi tự làm' : 'Every query, every trap, real output in the comments — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

/** Một bước: đề + gợi ý + đáp án ẩn (một hay nhiều câu SQL + output thật). */
const buoc = (lang, k, de, goiY, keys, sau = '') => `<h4>${k} — ${de}</h4>
${goiY ? `<p class="meo">💡 ${goiY}</p>` : ''}
${details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, keys.map((x) => code(Q[x]) + out(O[x])).join('\n') + (sau ? `<p>${sau}</p>` : ''))}`;
const bay = (tieuDe, chu, keys) => `<div class="pitfall"><p><strong>${tieuDe}</strong> ${chu}</p></div>
${keys.map((x) => code(Q[x]) + out(O[x])).join('\n')}`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 4 · CT Shop · after Chapter 8</span>
<h2>The growth dashboard</h2>
<p class="lead">The owner liked Lab 3’s report so much that he wants it on a screen every Monday — with <em>movement</em> in it: growth against last month and against the same month last year, a running total, the top 3 of every shelf, each category’s share, and a category tree that does not break when the shop adds a third level. One row per group was Chapter 6. This lab keeps every row and lets each row look at its neighbours: window functions, CTEs and recursion, on real CT Shop money.</p>

<h3>1 · The brief</h3>
<p>Start clean: <code>lab4-start.sql</code> rebuilds the standard shop (same data as Lab 3, so every number you already know still holds: 713 payments and 411.147.000 đ in the first nine months of 2026). Money counts on <code>payment.paid_at</code>; periods are half-open. Tools: everything up to Chapter 8 — CTEs, <code>WITH RECURSIVE</code>, <code>LAG</code>, <code>ROW_NUMBER</code> / <code>RANK</code> / <code>DENSE_RANK</code>, <code>sum() OVER</code>, frames, <code>generate_series</code>. One small function is new and explained here: <code>NULLIF</code>.</p>
<p>Chapter 8 already computed month-over-month growth and the year-to-date total for 2026 and the top 3 of two categories. This lab answers the questions that come <em>after</em> those, and its numbers must agree with Chapter 8 wherever they overlap (−36,2 % in February, 105,9 % in March, 411.147.000 at the end of September).</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>W1</strong> — 21 months of revenue with % vs last month (LAG) and % vs the same month last year (LAG 12); then only the 9 months of 2026 <em>without</em> losing last year.</li>
<li><strong>W2</strong> — weekly units of the Moleskine notebook (CT0906) in Q3: fill the weeks with no sales, and a week-over-week % that survives a zero week.</li>
<li><strong>W3</strong> — September’s running total, per payment and per day, without the ROWS/RANGE surprise.</li>
<li><strong>W4</strong> — top 3 products of every sub-category, and what changes with ROW_NUMBER, RANK and DENSE_RANK when two products tie.</li>
<li><strong>W5</strong> — each sub-category’s share of the shop and of its root category.</li>
<li><strong>W6</strong> — the category tree with <code>WITH RECURSIVE</code>, and revenue per root that stays right when a third level appears.</li>
</ol>
<div class="callout ok"><p><strong>You pass when</strong> your numbers are: 21 months totalling 945.525.000 · March 2026 +34,7 % vs March 2025 · Moleskine 13 weeks, 5 of them zero · September month-to-date 42.485.000 on the 30th · top 3 = 24 / 24 / 25 rows · calculators 54,9 % of the shop · with “Bút gel” added, still 4 roots and Bút &amp; mực 54.875.000.</p></div>

<h3>3 · Downloads and setup</h3>
${FILES(false)}
${out(SETUP)}

<h3>4 · Build the dashboard, step by step</h3>
<p>Every query has the same shape: a CTE that brings the data to the right grain (one row per month, per week, per day, per product), then a SELECT that adds window columns. Get the grain right first; the window is the easy part.</p>

${buoc('en', 'W1', 'growth vs last month and vs last year', 'Bring payments to one row per month in a CTE. <code>lag(revenue)</code> reads the previous row; <code>lag(revenue, 12)</code> reads the row 12 positions back — the same month last year, as long as no month is missing. <code>WINDOW w AS (ORDER BY month)</code> names the window once instead of repeating it five times.', ['W1'], 'The first 12 rows have no “last year”: the data starts in January 2025. The 2026 month-over-month column is exactly Chapter 8’s (−36,2 % in February, 105,9 % in March). Year over year tells a calmer story: March is +34,7 %, February −25,5 %.')}
${bay('Trap — filtering in the same query.', 'The owner wants only 2026 on the screen, so the obvious move is <code>WHERE month &gt;= \'2026-01-01\'</code>. But WHERE runs <em>before</em> the window functions: the 2025 rows are gone before LAG can look at them.', ['W1X'])}
${details('Answer — W1b (window first, filter afterwards)', code(Q.W1B) + out(O.W1B) + '<p>The window is computed in the CTE <code>g</code> over all 21 months; only then does the outer query keep 2026.</p>')}

<h4>W2 — a product that does not sell every week</h4>
<p>The Moleskine notebook (CT0906, 590.000 đ) sells a few units at a time. The product manager wants week-over-week growth for July–September. Group by <code>date_trunc('week', paid_at)</code> (weeks start on Monday) and apply LAG:</p>
${code(Q.W2X)}
${out(O.W2X)}
<p>Thirteen weeks, but only eight rows: weeks without sales simply do not exist in the result. LAG reads “the previous <em>row</em>”, so the week of 20 July is compared with 6 July and 10 August with 20 July — three weeks earlier. The fix is a calendar: <code>generate_series</code> produces all 13 Mondays, a LEFT JOIN attaches the sales, <code>coalesce</code> turns the gaps into 0. Now LAG is honest — and the percentage divides by zero:</p>
${code(Q.W2E)}
${out(O.W2E)}
<p><strong>New: <code>NULLIF(a, b)</code></strong> returns NULL when a = b and a otherwise. Dividing by <code>NULLIF(prev, 0)</code> turns “divide by zero” into “divide by NULL”, which is NULL — exactly what the report should say: there is no percentage of growth from nothing.</p>
${details('Answer — W2', code(Q.W2) + out(O.W2) + '<p>13 rows, 5 zero weeks (13/07, 27/07, 03/08, 31/08, 07/09). The weeks after a zero week show NULL, not an error and not a made-up number.</p>')}

<h4>W3 — September’s running total: ROWS or RANGE?</h4>
<p>The chart wants a line that climbs from 0 to September’s 42.485.000. The first attempt orders by the <em>date</em> of each payment:</p>
${code(Q.W3X)}
${out(O.W3X)}
<p>Two different wrong answers. With <code>ORDER BY</code> and no frame, the default frame is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>: all rows with the same date are <em>peers</em> and each one gets the total up to the end of that day (all four payments of 2 September show 3.869.000). With <code>ROWS</code> the sum grows row by row — but in which order? Inside one day the ORDER BY says nothing, so PostgreSQL adds them in whatever order it reads them, and the numbers do not even rise down the screen (1.446.000 then 1.062.000). Two fixes, depending on the question:</p>
${details('Answer — W3 (per payment: a unique ORDER BY)', code(Q.W3A) + out(O.W3A))}
${details('Answer — W3 (per day: aggregate first, then the running sum)', code(Q.W3B) + out(O.W3B) + '<p>29 days (no payment on 11 September), and the last row reaches exactly September’s revenue from Lab 3: 42.485.000. With one row per day, ROWS and RANGE give the same result — the cleanest fix is often the right grain.</p>')}

<h4>W4 — top 3 of every shelf, and the tie</h4>
<p class="meo">💡 One CTE with units sold per product in the nine months, then a window <code>PARTITION BY category_id ORDER BY units DESC</code>: the numbering restarts in every category. Look at category 8 (Vở ô ly) first.</p>
${code(Q.W4A)}
${out(O.W4A)}
<p>CT0804 and CT0805 both sold 64 notebooks. <code>RANK</code> gives both a 2 and skips 3; <code>DENSE_RANK</code> gives both a 2 and continues with 3; <code>ROW_NUMBER</code> must give different numbers, so it picks one to be 2 and the other 3 — and nothing in the query says which. Another plan, another day, and the two swap places. Count what “top 3” returns for the whole shop:</p>
${code(Q.W4C)}
${out(O.W4C)}
<p>24 with ROW_NUMBER and RANK, 25 with DENSE_RANK (CT0801, 63 units, sneaks in as “3rd” in Vở ô ly). Which one is right is a <em>business</em> decision: a shelf with exactly three slots needs ROW_NUMBER plus a tie-breaker that someone chose on purpose; a “medal table” that must not hide a tie needs RANK.</p>
${details('Answer — W4 (ROW_NUMBER with a chosen tie-breaker)', code(Q.W4) + out(O.W4) + '<p>The tie in Vở ô ly is now decided by revenue (the 10-pack brings 6.720.000, the 200-page notebook 1.856.000), then by sku — the same answer on every run.</p>')}

${buoc('en', 'W5', 'each category’s share', 'An aggregate inside a window: <code>sum(sum(x)) OVER ()</code> is “the sum of all the group sums” — the inner sum is GROUP BY’s, the outer one is the window’s. <code>OVER ()</code> spans all rows; <code>OVER (PARTITION BY r.name)</code> spans the rows of one root. Lab 3 could not do this without a subquery.', ['W5'], 'Calculators are 54,9 % of the whole shop and 93,7 % of their root. The pct_in_root column adds up to 100 inside every root (41,5 + 30,1 + 28,4 for Bút &amp; mực).')}

<h4>W6 — the category tree, and the third level</h4>
<p class="meo">💡 <code>WITH RECURSIVE</code> = an anchor (the roots: <code>parent_id IS NULL</code>) <code>UNION ALL</code> a step (the children of the rows found so far). Carry <code>depth</code>, a <code>path</code> and the <code>root_id</code> down from parent to child.</p>
${details('Answer — W6a (the tree)', code(Q.W6A) + out(O.W6A))}
<p>Today the tree has two levels, so Lab 3’s self-join gave the same answer. Now the owner opens a new shelf, “Bút gel”, <em>under</em> “Bút bi”, and moves the two gel pens there. Do it inside a transaction so you can undo it:</p>
${code([Q.W6INS, Q.W6UPD].join('\n'))}
${out([O.W6INS, O.W6UPD].join('\n'))}
${bay('Trap — the self-join assumes two levels.', 'Lab 3’s roll-up joins each category to its parent and calls the parent “root”. For the gel pens the parent is “Bút bi”, so “Bút bi” appears as a fifth root and 3.684.000 đ leave Bút &amp; mực:', ['W6X'])}
${details('Answer — W6 (the recursive tree carries the real root down)', code(Q.W6) + out(O.W6) + code(Q.W6D) + out(O.W6D) + '<p>Four roots again, Bút &amp; mực back to 54.875.000 = Lab 3, and the path shows depth 3. Then <code>ROLLBACK</code> puts the shop back as it was.</p>')}

<h4>In a real Node app</h4>
<p>Prisma’s query API (<code>findMany</code>, <code>groupBy</code>) has no window functions and no recursive queries, so a dashboard like W1 is raw SQL with <code>$queryRaw</code> — parameters stay safe. When the same query feeds several screens, wrap it in a VIEW (Chapter 12) and read the view. LabFlow and cuongthai.com follow the same rule: the ORM for everyday reads and writes, SQL for reports.</p>
${code(PRISMA, 'ts')}

<h3>5 · Self-check — these numbers must match</h3>
${code([Q.SC1, Q.SC2, Q.SC3].join('\n'))}
${out([O.SC1, O.SC2, O.SC3].join('\n\n'))}
<ol>
<li>Why does <code>WHERE month &gt;= '2026-01-01'</code> in the same query make every “last year” NULL?</li>
<li>Over a date column with several payments per day, why do RANGE and ROWS give different running totals — and which one is wrong?</li>
<li>Why did Lab 3’s self-join show “Bút bi” as a root once “Bút gel” existed?</li>
</ol>
${details('Answers', `<ol><li>WHERE runs before the window functions: the 2025 rows are removed before LAG can read them. Compute the window in a CTE, filter in the outer query.</li><li>RANGE treats same-date rows as peers and gives them all the day’s total; ROWS adds row by row in an order the ORDER BY does not fix. Both are “right” for what they compute; neither is a per-payment running total — make the ORDER BY unique, or aggregate to one row per day.</li><li>The self-join only looks one level up. For a product in a level-3 category, one level up is “Bút bi”, not the root. The recursive CTE carries the root down every level.</li></ol>`)}

<h3>6 · Full solution</h3>
${details('Show the whole lab4-solution.sql', code(SOL))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>Filtering rows that the window still needs</strong> — WHERE runs before OVER. Window in a CTE, filter outside.</p></div>
<div class="pitfall"><p><strong>LAG over a series with gaps</strong> — the “previous row” is not the previous week/month. Build the calendar with generate_series and LEFT JOIN.</p></div>
<div class="pitfall"><p><strong>Dividing by a value that can be 0</strong> — <code>NULLIF(x, 0)</code> in the denominator.</p></div>
<div class="pitfall"><p><strong>Running total over a non-unique ORDER BY</strong> — RANGE (the default) lumps peers together, ROWS adds them in an undefined order. Make the order unique, or aggregate first.</p></div>
<div class="pitfall"><p><strong>ROW_NUMBER on ties with no tie-breaker</strong> — the winner changes between runs. Add a tie-breaker you chose, or use RANK / DENSE_RANK on purpose.</p></div>
<div class="pitfall"><p><strong>A fixed number of self-joins on a tree</strong> — it silently breaks when the tree gets deeper. Use WITH RECURSIVE.</p></div>

<h3>8 · Next: Lab 5</h3>
<p>The dashboard is right; is it fast? Lab 5, after Chapter 10, makes CT Shop a million orders big, reads <code>EXPLAIN ANALYZE</code> before and after indexes, and finds out which of today’s queries need a covering or partial index.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 4 · CT Shop · sau Chương 8</span>
<h2>Bảng điều khiển tăng trưởng</h2>
<p class="lead">Chủ shop thích báo cáo của Lab 3 tới mức muốn nó hiện trên màn hình mỗi sáng thứ Hai — và phải có <em>chuyển động</em>: tăng trưởng so với tháng trước và so với cùng kỳ năm ngoái, tổng luỹ kế, top 3 của mỗi kệ hàng, tỷ trọng từng danh mục, và một cây danh mục không gãy khi shop thêm tầng thứ ba. Mỗi nhóm một dòng là chuyện của Chương 6. Lab này giữ nguyên mọi dòng và cho mỗi dòng nhìn sang hàng xóm của nó: hàm cửa sổ, CTE và đệ quy, trên tiền thật của CT Shop.</p>

<h3>1 · Đề bài</h3>
<p>Bắt đầu sạch: <code>lab4-start.sql</code> dựng lại shop chuẩn (cùng dữ liệu với Lab 3, nên mọi con số bạn đã biết vẫn đúng: 713 thanh toán và 411.147.000 đ trong chín tháng đầu 2026). Tiền tính theo <code>payment.paid_at</code>; kỳ luôn nửa mở. Công cụ: mọi thứ tới Chương 8 — CTE, <code>WITH RECURSIVE</code>, <code>LAG</code>, <code>ROW_NUMBER</code> / <code>RANK</code> / <code>DENSE_RANK</code>, <code>sum() OVER</code>, khung cửa sổ, <code>generate_series</code>. Một hàm nhỏ là mới và được giảng ngay đây: <code>NULLIF</code>.</p>
<p>Chương 8 đã tính tăng trưởng so tháng trước và tổng luỹ kế 2026, và top 3 của hai danh mục. Lab này trả lời các câu hỏi đến <em>sau</em> những thứ đó, và chỗ nào trùng thì con số phải khớp Chương 8 (−36,2 % tháng 2, 105,9 % tháng 3, 411.147.000 cuối tháng 9).</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>W1</strong> — doanh thu 21 tháng kèm % so tháng trước (LAG) và % so cùng tháng năm ngoái (LAG 12); rồi chỉ 9 tháng của 2026 mà <em>không</em> mất số năm ngoái.</li>
<li><strong>W2</strong> — số cuốn Moleskine (CT0906) bán theo tuần trong quý 3: lấp các tuần không bán được, và % so tuần trước không chết khi gặp tuần bằng 0.</li>
<li><strong>W3</strong> — tổng luỹ kế tháng 9, theo từng thanh toán và theo từng ngày, không dính bất ngờ ROWS/RANGE.</li>
<li><strong>W4</strong> — top 3 sản phẩm mỗi danh mục con, và ROW_NUMBER, RANK, DENSE_RANK khác nhau ra sao khi hai sản phẩm hoà.</li>
<li><strong>W5</strong> — tỷ trọng của từng danh mục con trong cả shop và trong danh mục gốc của nó.</li>
<li><strong>W6</strong> — cây danh mục bằng <code>WITH RECURSIVE</code>, và doanh thu theo gốc vẫn đúng khi xuất hiện tầng thứ ba.</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi</strong> con số của bạn là: 21 tháng tổng 945.525.000 · tháng 3/2026 +34,7 % so tháng 3/2025 · Moleskine 13 tuần, 5 tuần bằng 0 · luỹ kế tháng 9 ngày 30 là 42.485.000 · top 3 ra 24 / 24 / 25 dòng · máy tính cầm tay chiếm 54,9 % cả shop · thêm "Bút gel" mà vẫn 4 gốc và Bút &amp; mực 54.875.000.</p></div>

<h3>3 · Tệp tải về và chuẩn bị</h3>
${FILES(true)}
${out(SETUP)}

<h3>4 · Dựng bảng điều khiển từng bước</h3>
<p>Câu truy vấn nào cũng cùng một dáng: một CTE đưa dữ liệu về đúng độ mịn (mỗi tháng, mỗi tuần, mỗi ngày, mỗi sản phẩm một dòng), rồi một SELECT thêm các cột cửa sổ. Làm đúng độ mịn trước; phần cửa sổ là phần dễ.</p>

${buoc('vi', 'W1', 'tăng trưởng so tháng trước và so năm ngoái', 'Đưa thanh toán về mỗi tháng một dòng trong CTE. <code>lag(revenue)</code> đọc dòng ngay trước; <code>lag(revenue, 12)</code> đọc dòng lùi 12 vị trí — cùng tháng năm ngoái, miễn là không thiếu tháng nào. <code>WINDOW w AS (ORDER BY month)</code> đặt tên cửa sổ một lần thay vì lặp năm lần.', ['W1'], '12 dòng đầu không có "năm ngoái": dữ liệu bắt đầu từ tháng 1/2025. Cột so tháng trước của 2026 trùng đúng Chương 8 (−36,2 % tháng 2, 105,9 % tháng 3). So cùng kỳ năm ngoái thì câu chuyện bình tĩnh hơn: tháng 3 +34,7 %, tháng 2 −25,5 %.')}
${bay('Bẫy — lọc trong cùng câu truy vấn.', 'Chủ shop chỉ muốn thấy 2026, nên phản xạ là thêm <code>WHERE month &gt;= \'2026-01-01\'</code>. Nhưng WHERE chạy <em>trước</em> hàm cửa sổ: các dòng 2025 bị loại trước khi LAG kịp nhìn tới.', ['W1X'])}
${details('Đáp án — W1b (cửa sổ trước, lọc sau)', code(Q.W1B) + out(O.W1B) + '<p>Cửa sổ được tính trong CTE <code>g</code> trên đủ 21 tháng; chỉ sau đó câu ngoài mới giữ lại 2026.</p>')}

<h4>W2 — một sản phẩm không tuần nào cũng bán được</h4>
<p>Sổ Moleskine (CT0906, 590.000 đ) mỗi lần chỉ bán vài cuốn. Quản lý sản phẩm muốn tăng trưởng theo tuần cho tháng 7–9. Gom theo <code>date_trunc('week', paid_at)</code> (tuần bắt đầu thứ Hai) rồi áp LAG:</p>
${code(Q.W2X)}
${out(O.W2X)}
<p>Mười ba tuần mà chỉ có tám dòng: tuần không bán được đơn giản là không tồn tại trong kết quả. LAG đọc "<em>dòng</em> trước", nên tuần 20/7 bị so với 6/7, còn 10/8 bị so với 20/7 — ba tuần trước đó. Cách sửa là một tờ lịch: <code>generate_series</code> sinh đủ 13 ngày thứ Hai, LEFT JOIN gắn doanh số vào, <code>coalesce</code> biến chỗ trống thành 0. Giờ LAG trung thực — và phép tính phần trăm chia cho 0:</p>
${code(Q.W2E)}
${out(O.W2E)}
<p><strong>Mới: <code>NULLIF(a, b)</code></strong> trả NULL khi a = b, còn lại trả a. Chia cho <code>NULLIF(prev, 0)</code> biến "chia cho 0" thành "chia cho NULL", ra NULL — đúng điều báo cáo nên nói: không có phần trăm tăng trưởng nào tính từ con số không.</p>
${details('Đáp án — W2', code(Q.W2) + out(O.W2) + '<p>13 dòng, 5 tuần bằng 0 (13/07, 27/07, 03/08, 31/08, 07/09). Tuần ngay sau một tuần bằng 0 hiện NULL, không lỗi và không bịa số.</p>')}

<h4>W3 — luỹ kế tháng 9: ROWS hay RANGE?</h4>
<p>Biểu đồ cần một đường đi lên từ 0 tới 42.485.000 của tháng 9. Lần thử đầu sắp theo <em>ngày</em> của từng thanh toán:</p>
${code(Q.W3X)}
${out(O.W3X)}
<p>Hai đáp án sai theo hai kiểu. Có <code>ORDER BY</code> mà không ghi khung, khung mặc định là <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>: mọi dòng cùng ngày là <em>đồng hạng</em> (peer) và dòng nào cũng nhận tổng tới hết ngày đó (cả bốn thanh toán ngày 2/9 đều hiện 3.869.000). Với <code>ROWS</code> tổng tăng từng dòng — nhưng theo thứ tự nào? Trong một ngày, ORDER BY không nói gì, nên PostgreSQL cộng theo thứ tự nó đọc được, và con số thậm chí không tăng dần trên màn hình (1.446.000 rồi 1.062.000). Hai cách sửa, tuỳ câu hỏi:</p>
${details('Đáp án — W3 (theo từng thanh toán: ORDER BY duy nhất)', code(Q.W3A) + out(O.W3A))}
${details('Đáp án — W3 (theo ngày: gộp trước, rồi cộng dồn)', code(Q.W3B) + out(O.W3B) + '<p>29 ngày (ngày 11/9 không có thanh toán nào), và dòng cuối chạm đúng doanh thu tháng 9 của Lab 3: 42.485.000. Mỗi ngày một dòng thì ROWS và RANGE cho cùng kết quả — cách sửa sạch nhất thường là đúng độ mịn.</p>')}

<h4>W4 — top 3 mỗi kệ, và chuyện hoà</h4>
<p class="meo">💡 Một CTE tính số đã bán của từng sản phẩm trong chín tháng, rồi một cửa sổ <code>PARTITION BY category_id ORDER BY units DESC</code>: số thứ tự đánh lại từ đầu ở mỗi danh mục. Nhìn danh mục 8 (Vở ô ly) trước.</p>
${code(Q.W4A)}
${out(O.W4A)}
<p>CT0804 và CT0805 cùng bán 64 cuốn. <code>RANK</code> cho cả hai số 2 rồi bỏ qua số 3; <code>DENSE_RANK</code> cho cả hai số 2 rồi đi tiếp số 3; <code>ROW_NUMBER</code> buộc phải cho hai số khác nhau, nên nó chọn một cuốn làm số 2, cuốn kia số 3 — và không có gì trong câu truy vấn quyết định cuốn nào. Kế hoạch khác, ngày khác, hai cuốn có thể đổi chỗ. Đếm xem "top 3" trả về bao nhiêu dòng cho cả shop:</p>
${code(Q.W4C)}
${out(O.W4C)}
<p>24 với ROW_NUMBER và RANK, 25 với DENSE_RANK (CT0801, 63 cuốn, lọt vào làm "hạng 3" của Vở ô ly). Cái nào đúng là quyết định <em>nghiệp vụ</em>: kệ trưng bày có đúng ba ô thì cần ROW_NUMBER kèm một tiêu chí phá hoà do người chọn có chủ đích; bảng xếp hạng không được giấu chuyện hoà thì cần RANK.</p>
${details('Đáp án — W4 (ROW_NUMBER kèm tiêu chí phá hoà đã chọn)', code(Q.W4) + out(O.W4) + '<p>Chuyện hoà ở Vở ô ly giờ được quyết bằng doanh thu (lốc 10 vở mang về 6.720.000, vở 200 trang 1.856.000), rồi tới sku — chạy lần nào cũng ra một đáp án.</p>')}

${buoc('vi', 'W5', 'tỷ trọng từng danh mục', 'Hàm tổng hợp nằm trong cửa sổ: <code>sum(sum(x)) OVER ()</code> là "tổng của mọi tổng nhóm" — sum bên trong là của GROUP BY, sum bên ngoài là của cửa sổ. <code>OVER ()</code> trải trên mọi dòng; <code>OVER (PARTITION BY r.name)</code> trải trên các dòng cùng một gốc. Lab 3 không làm được điều này nếu không có truy vấn con.', ['W5'], 'Máy tính cầm tay chiếm 54,9 % cả shop và 93,7 % trong gốc của nó. Cột pct_in_root cộng lại được 100 trong mỗi gốc (41,5 + 30,1 + 28,4 với Bút &amp; mực).')}

<h4>W6 — cây danh mục, và tầng thứ ba</h4>
<p class="meo">💡 <code>WITH RECURSIVE</code> = phần neo (các gốc: <code>parent_id IS NULL</code>) <code>UNION ALL</code> bước lặp (con của các dòng đã tìm được). Mang <code>depth</code>, một <code>path</code> và <code>root_id</code> đi từ cha xuống con.</p>
${details('Đáp án — W6a (cái cây)', code(Q.W6A) + out(O.W6A))}
<p>Hôm nay cây có hai tầng, nên self-join của Lab 3 vẫn ra đúng. Giờ chủ shop mở thêm kệ "Bút gel" <em>bên dưới</em> "Bút bi" và chuyển hai cây bút gel sang đó. Làm trong một giao dịch để còn hoàn tác:</p>
${code([Q.W6INS, Q.W6UPD].join('\n'))}
${out([O.W6INS, O.W6UPD].join('\n'))}
${bay('Bẫy — self-join ngầm định cây có hai tầng.', 'Phép gộp của Lab 3 nối mỗi danh mục với cha của nó rồi gọi cha là "gốc". Với bút gel, cha là "Bút bi", nên "Bút bi" hiện thành gốc thứ năm và 3.684.000 đ rời khỏi Bút &amp; mực:', ['W6X'])}
${details('Đáp án — W6 (cây đệ quy mang gốc thật xuống mọi tầng)', code(Q.W6) + out(O.W6) + code(Q.W6D) + out(O.W6D) + '<p>Lại bốn gốc, Bút &amp; mực về 54.875.000 = Lab 3, và cột path cho thấy tầng 3. Rồi <code>ROLLBACK</code> trả shop về như cũ.</p>')}

<h4>Trong app Node thật</h4>
<p>API truy vấn của Prisma (<code>findMany</code>, <code>groupBy</code>) không có hàm cửa sổ và không có truy vấn đệ quy, nên bảng điều khiển kiểu W1 viết bằng SQL thô với <code>$queryRaw</code> — tham số vẫn an toàn. Khi cùng một câu truy vấn nuôi nhiều màn hình, bọc nó thành VIEW (Chương 12) rồi đọc view. LabFlow và cuongthai.com theo đúng luật đó: ORM cho đọc ghi hằng ngày, SQL cho báo cáo.</p>
${code(PRISMA, 'ts')}

<h3>5 · Tự kiểm — các con số này phải khớp</h3>
${code([Q.SC1, Q.SC2, Q.SC3].join('\n'))}
${out([O.SC1, O.SC2, O.SC3].join('\n\n'))}
<ol>
<li>Vì sao <code>WHERE month &gt;= '2026-01-01'</code> trong cùng câu truy vấn làm mọi "năm ngoái" thành NULL?</li>
<li>Trên cột ngày có nhiều thanh toán mỗi ngày, vì sao RANGE và ROWS cho tổng luỹ kế khác nhau — cái nào sai?</li>
<li>Vì sao self-join của Lab 3 coi "Bút bi" là gốc khi đã có "Bút gel"?</li>
</ol>
${details('Đáp án', `<ol><li>WHERE chạy trước hàm cửa sổ: các dòng 2025 bị loại trước khi LAG kịp đọc. Tính cửa sổ trong CTE, lọc ở câu ngoài.</li><li>RANGE coi các dòng cùng ngày là đồng hạng và cho tất cả tổng của cả ngày; ROWS cộng từng dòng theo một thứ tự mà ORDER BY không cố định. Cả hai đều "đúng" với cái chúng tính; không cái nào là luỹ kế theo từng thanh toán — hãy làm ORDER BY duy nhất, hoặc gộp về mỗi ngày một dòng.</li><li>Self-join chỉ nhìn lên một tầng. Với sản phẩm ở danh mục tầng 3, lên một tầng là "Bút bi", chưa phải gốc. CTE đệ quy mang gốc xuống mọi tầng.</li></ol>`)}

<h3>6 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab4-solution.sql', code(SOL))}

<h3>7 · Bẫy hay gặp</h3>
<div class="pitfall"><p><strong>Lọc mất những dòng cửa sổ còn cần</strong> — WHERE chạy trước OVER. Cửa sổ trong CTE, lọc bên ngoài.</p></div>
<div class="pitfall"><p><strong>LAG trên chuỗi có lỗ hổng</strong> — "dòng trước" không phải tuần/tháng trước. Dựng tờ lịch bằng generate_series rồi LEFT JOIN.</p></div>
<div class="pitfall"><p><strong>Chia cho một giá trị có thể bằng 0</strong> — <code>NULLIF(x, 0)</code> ở mẫu số.</p></div>
<div class="pitfall"><p><strong>Luỹ kế trên ORDER BY không duy nhất</strong> — RANGE (mặc định) gộp các dòng đồng hạng, ROWS cộng theo thứ tự không xác định. Làm thứ tự duy nhất, hoặc gộp trước.</p></div>
<div class="pitfall"><p><strong>ROW_NUMBER gặp hoà mà không có tiêu chí phá hoà</strong> — người thắng đổi giữa các lần chạy. Thêm tiêu chí do bạn chọn, hoặc dùng RANK / DENSE_RANK có chủ đích.</p></div>
<div class="pitfall"><p><strong>Một số lần self-join cố định trên một cái cây</strong> — lặng lẽ gãy khi cây sâu thêm. Dùng WITH RECURSIVE.</p></div>

<h3>8 · Tiếp theo: Lab 5</h3>
<p>Bảng điều khiển đã đúng; nó có nhanh không? Lab 5, sau Chương 10, phóng CT Shop lên một triệu đơn, đọc <code>EXPLAIN ANALYZE</code> trước và sau khi có chỉ mục, và tìm xem câu truy vấn nào hôm nay cần chỉ mục bao phủ hay chỉ mục một phần.</p>
</div>
`;

export default {
  title: 'Lab 4 — CT Shop: the growth dashboard (CTE + window functions)|||Lab 4 — CT Shop: bảng điều khiển tăng trưởng (CTE + hàm cửa sổ)',
  slug: 'postgresql-lab-4-cte-ham-cua-so-ct-shop',
  type: 'LESSON',
  description: 'Lab dự án CT Shop sau Chương 8: tăng trưởng so tháng trước (LAG) và cùng kỳ năm ngoái (LAG 12) trên 21 tháng, bẫy WHERE chạy trước cửa sổ; tuần trống của Moleskine (generate_series + LEFT JOIN) và NULLIF chống chia cho 0; luỹ kế tháng 9 — ROWS vs RANGE khi trùng ngày; top 3 mỗi danh mục với ROW_NUMBER/RANK/DENSE_RANK khi hoà (24/24/25 dòng); tỷ trọng sum(sum()) OVER; cây danh mục WITH RECURSIVE vẫn đúng khi thêm tầng 3 (self-join của Lab 3 gãy). Output thật PostgreSQL 17.',
  content: `${G}${EN}${VI}`,
};
