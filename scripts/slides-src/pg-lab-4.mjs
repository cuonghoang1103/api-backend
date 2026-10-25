/**
 * pg-lab-4 — PostgreSQL · Lab 4 · CT Shop "The growth dashboard" (slide EN, kiểu FU, agent lab34 25/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-4.mjs + lab/sql/lab4-*.sql. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB nháp ctlab4, lab4-solution.sql bằng psql -f) — Q/O bên dưới SINH TỰ ĐỘNG (scratchpad lab34/mk-o.mjs).
 * Kiến thức tới Ch8 (+ NULLIF giảng ngắn trong lab). Hình vẽ lấy số từ O (output thật), không gõ tay.
 */
import { lamDeck, sql, psql, tbl, two, three, box, steps, cards, kw, vsd, flow, sh, c, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-4', code: 'PG Lab 4', title: 'Lab 4 — CT Shop: the growth dashboard', sub: 'CTE, LAG, frames, ranking, shares, WITH RECURSIVE' };

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

/* HELPERS (chép từ pg-lab-3.mjs) */
const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
/** Bỏ chú thích cuối dòng (-- …) khỏi câu SQL cho gọn slide. */
const bo = (s) => s.split('\n').map((l) => l.replace(/\s+--.*$/, '')).join('\n');
/** Bẻ dòng SQL dài cho vừa cột slide (chỉ đổi XUỐNG DÒNG/khoảng trắng, không đổi chữ). */
const sau0 = (l, i) => { let d = 0, q = false; for (let k = 0; k < i; k++) { const ch = l[k]; if (ch === "'") q = !q; else if (!q && ch === '(') d++; else if (!q && ch === ')') d--; } return d <= 0 && !q; };
function gon(src, W = 54) {
  const ra = [];
  const di = (l) => {
    if (l.length <= W) return ra.push(l);
    const ind = l.match(/^\s*/)[0];
    let m = l.match(/^(\s*SELECT )to_char\((date_trunc\(.*\)), '(YYYY-MM)'\)(.*)$/);
    if (m) {
      const dau = `${m[1]}to_char(${m[2]},`;
      if (dau.length > W && dau.includes("date_trunc('month', ")) { const k = dau.indexOf("date_trunc('month', ") + 20; ra.push(dau.slice(0, k - 1)); ra.push('        ' + dau.slice(k)); } else ra.push(dau);
      const pad = ' '.repeat(m[1].length + 8), j = m[4].indexOf(', ');
      if (j >= 0 && (pad + "'YYYY-MM')" + m[4]).length > W) { ra.push(`${pad}'YYYY-MM')${m[4].slice(0, j + 1)}`); return di('       ' + m[4].slice(j + 2)); }
      return di(`${pad}'YYYY-MM')${m[4]}`);
    }
    let k = l.indexOf(' / count(*)');
    if (k > 20) { ra.push(l.slice(0, k)); return di(`${ind}${l.trimStart().startsWith('SELECT') ? '        ' : '      '} ${l.slice(k + 1)}`); }
    m = l.match(/^(.*\(SELECT 1 FROM \w+ \w+)( WHERE .*)$/);
    if (m) { ra.push(m[1]); return di(' '.repeat(l.indexOf('(SELECT') + 1) + m[2].trimStart()); }
    const coChu = (i) => l.slice(0, i).trim().length > 0;
    for (let i = W; i > 18; i--) if (l.startsWith(' AND ', i) && coChu(i) && sau0(l, i)) { ra.push(l.slice(0, i)); return di(`${ind}  ${l.slice(i + 1)}`); }
    for (let i = W; i > 18; i--) if (l.startsWith(', ', i) && coChu(i) && sau0(l, i)) { ra.push(l.slice(0, i + 1)); return di(`${ind}${l.trimStart().startsWith('SELECT') ? '       ' : ind.length >= 7 ? '' : '  '}${l.slice(i + 2)}`); }
    for (let i = W; i > 18; i--) if (l.startsWith(' ON ', i)) { ra.push(l.slice(0, i)); return di(`${ind}  ${l.slice(i + 1)}`); }
    for (let i = W; i > 18; i--) if (l.startsWith(' / ', i) && coChu(i)) { ra.push(l.slice(0, i)); return di(`${ind}      ${l.slice(i + 1)}`); }
    for (let i = W; i > 10; i--) if (l.startsWith(', ', i) && coChu(i) && sau0(l, i)) { ra.push(l.slice(0, i + 1)); return di(`${ind}${l.trimStart().startsWith('SELECT') ? '       ' : ''}${l.slice(i + 2)}`); }
    for (let i = W; i > 18; i--) if (l.startsWith(' AS ', i) && coChu(i)) { ra.push(l.slice(0, i)); return di(`${ind}    ${l.slice(i + 1)}`); }
    ra.push(l);
  };
  src.split('\n').map((l) => l.replace(/(\S) {2,}(AS \w+,?$)/, '$1 $2')).forEach(di);
  return ra.join('\n');
}
/** SQL của bước k cho slide: bỏ chú thích, bẻ dòng, tô các dòng chứa một trong các chuỗi `to`. */
const S = (k, to = [], o = {}) => { const t = gon(bo(Q[k]), o.W); const h = sql(t, { sm: true, hl: t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean), ...o }); return o.x ? h.replace(/<pre class="vs sm">/, '<pre class="vs sm" style="font-size:13.5px;line-height:1.38">') : h; };
/** Bẻ dòng output psql dài (ghi rõ "(long lines wrapped)" ở tiêu đề khung). */
const bePsql = (t, n = 64) => t.split('\n').flatMap((l) => { if (l.length <= n) return [l]; const k = l.lastIndexOf(' ', n); return [l.slice(0, k), '        ' + l.slice(k + 1)]; }).join('\n');
/** Chữ mã nhỏ hơn (13px) cho slide chật. */
const nho = (h) => h.replace(/<pre class="vs sm">/g, '<pre class="vs sm" style="font-size:13.5px;line-height:1.38">').replace(/<pre>/g, '<pre style="font-size:13px;line-height:1.34">');
/** Giữ tiêu đề + n dòng đầu của một bảng psql, rồi "…" và dòng (N rows) thật. */
const dau = (o, n) => { const L = o.split('\n'); const cuoi = L[L.length - 1]; return [...L.slice(0, 2 + n), ' …', cuoi].join('\n'); };



/** Các dòng dữ liệu của một bảng psql (bỏ tiêu đề, gạch, (n rows)) ⇒ mảng mảng ô đã trim. */
const hang = (o) => o.split('\n').slice(2, -1).map((l) => l.split('|').map((x) => x.trim()));
const so = (x) => Number(String(x).replace(/[^0-9.\-]/g, ''));
const giu = (o, chon) => { const L = o.split('\n'); const cuoi = L[L.length - 1]; return [L[0], L[1], ...L.slice(2, -1).filter((l, i) => chon(l, i)), cuoi].join('\n'); };

/* 2026: 9 cột + mũi tên LAG + nhãn % (số thật O.W1). */
const cuaSo = () => {
  const r = hang(O.W1).filter((x) => x[0].startsWith('2026'));
  const W = 1110, H = 300, x0 = 40, bw = 90, gap = (W - 2 * x0 - 9 * bw) / 8, y0 = 236, k = 170 / 65e6;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="l4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  r.forEach(([m, rev, mom], i) => {
    const x = x0 + i * (bw + gap), h = so(rev) * k;
    s += `<g data-k="m-${m}"><rect x="${x}" y="${y0 - h}" width="${bw}" height="${h}" rx="5" fill="${PG}" opacity=".85"/><text x="${x + bw / 2}" y="${y0 + 24}" text-anchor="middle" font-size="17" fill="#444" font-family="Menlo,monospace">${m.slice(5)}/26</text>`;
    if (mom) s += `<text x="${x + bw / 2}" y="${y0 - h - 12}" text-anchor="middle" font-size="18" font-weight="800" fill="${so(mom) < 0 ? DO : XANH}">${so(mom) > 0 ? '+' : ''}${mom}%</text>`;
    if (i > 0) s += `<path d="M${x - gap - bw / 2 + 10},${y0 + 36} C${x - gap / 2},${y0 + 62} ${x - gap / 2},${y0 + 62} ${x + bw / 2 - 10},${y0 + 38}" fill="none" stroke="${NAU}" stroke-width="2" marker-end="url(#l4)"/>`;
    s += '</g>';
  });
  return s + `<line x1="${x0 - 10}" y1="${y0}" x2="${W - x0 + 10}" y2="${y0}" stroke="#999" stroke-width="2"/></svg>`;
};

/* LAG 12: hàng 2025 trên, 2026 dưới, mũi tên thẳng xuống, nhãn YoY (O.W1). */
const lag12 = () => {
  const r = hang(O.W1);
  const W = 1110, x0 = 10, bw = 84, gap = (W - 2 * x0 - 12 * bw) / 11;
  let s = `<svg viewBox="0 0 ${W} 280" width="${W}" height="280" font-family="Arial"><defs><marker id="l12" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  s += `<text x="${x0}" y="20" font-size="17" font-weight="800" fill="${PG}">2025 (rows 1–12)</text><text x="${x0}" y="274" font-size="17" font-weight="800" fill="${CAM}">2026 (rows 13–21) · lag(revenue, 12) reads 12 rows back</text>`;
  r.forEach(([m, rev, , , yoy], i) => {
    const nam = m.startsWith('2025'), j = (Number(m.slice(5)) - 1), x = x0 + j * (bw + gap), y = nam ? 30 : 150;
    s += `<g data-k="y-${m}"><rect x="${x}" y="${y}" width="${bw}" height="60" rx="7" fill="${nam ? '#eef4fa' : '#fff7ef'}" stroke="${nam ? PG : CAM}" stroke-width="2"/>`;
    s += `<text x="${x + bw / 2}" y="${y + 24}" text-anchor="middle" font-size="15" font-weight="800" fill="#333" font-family="Menlo,monospace">${m.slice(2).replace('-', '/')}</text><text x="${x + bw / 2}" y="${y + 47}" text-anchor="middle" font-size="15" fill="#444">${(so(rev) / 1e6).toFixed(1)}M</text></g>`;
    if (!nam) {
      s += `<line x1="${x + bw / 2}" y1="92" x2="${x + bw / 2}" y2="146" stroke="${NAU}" stroke-width="2" marker-end="url(#l12)"/>`;
      s += `<text x="${x + bw / 2}" y="${y + 84}" text-anchor="middle" font-size="16" font-weight="800" fill="${so(yoy) < 0 ? DO : XANH}">${so(yoy) > 0 ? '+' : ''}${yoy}%</text>`;
    }
  });
  return s + '</svg>';
};

/* 13 tuần Q3 của Moleskine: tuần có bán (O.W2) và tuần trống. */
const lich = () => {
  const r = hang(O.W2);
  const W = 1110, x0 = 6, bw = 78, gap = (W - 2 * x0 - 13 * bw) / 12;
  let s = `<svg viewBox="0 0 ${W} 150" width="${W}" height="150" font-family="Arial">`;
  r.forEach(([wk, u], i) => {
    const x = x0 + i * (bw + gap), co = so(u) > 0;
    s += `<g data-k="w-${wk}"><rect x="${x}" y="20" width="${bw}" height="78" rx="8" fill="${co ? '#eaf4ee' : '#fff'}" stroke="${co ? XANH : '#bbb'}" stroke-width="2" ${co ? '' : 'stroke-dasharray="6 5"'}/>`;
    s += `<text x="${x + bw / 2}" y="68" text-anchor="middle" font-size="30" font-weight="900" fill="${co ? '#1f6b40' : '#bbb'}">${u}</text>`;
    s += `<text x="${x + bw / 2}" y="122" text-anchor="middle" font-size="15" fill="#555" font-family="Menlo,monospace">${wk.slice(8)}/${wk.slice(5, 7)}</text></g>`;
  });
  return s + `<text x="${x0}" y="146" font-size="15" fill="#888">week starting Monday · dashed = no sale that week (the row does not exist until generate_series creates it)</text></svg>`;
};

/* Khung RANGE vs ROWS trên 6 thanh toán đầu tháng 9 (O.W3X). */
const khungHinh = () => {
  const r = hang(O.W3X).slice(0, 6);
  const W = 1110, y0 = 34, H = 37;
  let s = `<svg viewBox="0 0 ${W} ${y0 + 6 * H + 16}" width="${W}" height="${y0 + 6 * H + 16}" font-family="Arial">`;
  s += `<text x="10" y="22" font-size="16" font-weight="800" fill="#555" font-family="Menlo,monospace">day · order · amount</text><text x="560" y="22" font-size="16" font-weight="800" fill="${DO}">RANGE (default): frame for row 4</text><text x="850" y="22" font-size="16" font-weight="800" fill="${PG}">ROWS: frame for row 4</text>`;
  r.forEach(([d, oid, a], i) => {
    const y = y0 + i * H;
    s += `<g data-k="f-${i}"><rect x="10" y="${y}" width="480" height="${H - 6}" rx="5" fill="${d.endsWith('02') ? '#fff7ef' : '#fff'}" stroke="#c9d5e2"/><text x="22" y="${y + 25}" font-size="17" fill="#333" font-family="Menlo,monospace">${d} · ${oid.padStart(4)} · ${a.padStart(10)}</text></g>`;
  });
  s += `<rect x="540" y="${y0 - 4}" width="250" height="${6 * H - 2}" rx="8" fill="none" stroke="${DO}" stroke-width="3" stroke-dasharray="7 5"/><text x="560" y="${y0 + 6 * H - 18}" font-size="15" fill="${DO}">rows 1–6: ALL peers of 02/09</text>`;
  s += `<rect x="830" y="${y0 - 4}" width="250" height="${4 * H - 2}" rx="8" fill="none" stroke="${PG}" stroke-width="3"/><text x="850" y="${y0 + 4 * H + 22}" font-size="15" fill="${PG}">rows 1–4: up to THIS row —</text><text x="850" y="${y0 + 4 * H + 42}" font-size="15" fill="${PG}">but which row is “4th” today?</text>`;
  s += `<line x1="490" y1="${y0 + 3 * H + 18}" x2="830" y2="${y0 + 3 * H + 18}" stroke="#999" stroke-width="1.5" stroke-dasharray="3 4"/>`;
  return s + '</svg>';
};

/* Đường luỹ kế tháng 9 theo ngày (O.W3B). */
const duong = () => {
  const r = hang(O.W3B);
  const W = 1110, H = 230, x0 = 70, x1 = W - 20, y0 = 200, max = 45e6;
  const X = (d) => x0 + ((Number(d.slice(8)) - 1) / 29) * (x1 - x0), Y = (v) => y0 - (v / max) * 180;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  [0, 15, 30, 45].forEach((m) => { s += `<line x1="${x0}" y1="${Y(m * 1e6)}" x2="${x1}" y2="${Y(m * 1e6)}" stroke="#eee"/><text x="${x0 - 8}" y="${Y(m * 1e6) + 5}" text-anchor="end" font-size="14" fill="#888">${m}M</text>`; });
  s += `<polyline data-k="duong" points="${r.map(([d, , , mtd]) => `${X(d).toFixed(1)},${Y(so(mtd)).toFixed(1)}`).join(' ')}" fill="none" stroke="${XANH}" stroke-width="3.5"/>`;
  r.forEach(([d, , rev, mtd]) => { s += `<circle cx="${X(d)}" cy="${Y(so(mtd))}" r="4" fill="${XANH}"/><rect x="${X(d) - 6}" y="${y0 - (so(rev) / max) * 180}" width="12" height="${(so(rev) / max) * 180}" fill="${CAM}" opacity=".45"/>`; });
  [1, 10, 20, 30].forEach((d) => { s += `<text x="${X(`2026-09-${String(d).padStart(2, '0')}`)}" y="${y0 + 22}" text-anchor="middle" font-size="14" fill="#555">${String(d).padStart(2, '0')}/09</text>`; });
  const last = r[r.length - 1];
  s += `<text x="${X(last[0]) - 6}" y="${Y(so(last[3])) - 12}" text-anchor="end" font-size="17" font-weight="800" fill="#1f6b40">${last[3]}</text>`;
  return s + `<text x="${x0 + 6}" y="18" font-size="15" fill="#666">green = month_to_date · orange bars = revenue of the day</text></svg>`;
};

/* Ba cách đánh số cho Vở ô ly (O.W4A). */
const bucDo = () => {
  const r = hang(O.W4A);
  const cot = [['row_number', 2, PG], ['rank', 3, CAM], ['dense_rank', 4, XANH]];
  let s = `<svg viewBox="0 0 640 300" width="640" height="300" font-family="Arial">`;
  s += `<text x="0" y="22" font-size="16" font-weight="800" fill="#555" font-family="Menlo,monospace">sku    units</text>`;
  cot.forEach(([t, , m], j) => { s += `<text x="${260 + j * 130}" y="22" text-anchor="middle" font-size="16" font-weight="800" fill="${m}" font-family="Menlo,monospace">${t}</text>`; });
  r.forEach((x, i) => {
    const y = 36 + i * 42, hoa = x[1] === '64';
    s += `<g data-k="v-${x[0]}"><rect x="0" y="${y}" width="640" height="36" rx="5" fill="${hoa ? '#fff3c4' : i % 2 ? '#fafafa' : '#fff'}" stroke="#e3e3e3"/><text x="10" y="${y + 24}" font-size="17" fill="#333" font-family="Menlo,monospace">${x[0]}  ${x[1].padStart(3)}</text>`;
    cot.forEach(([, k, m], j) => { const v = Number(x[k]); s += `<text x="${260 + j * 130}" y="${y + 25}" text-anchor="middle" font-size="20" font-weight="900" fill="${v <= 3 ? m : '#bbb'}">${v}</text>`; });
    s += '</g>';
  });
  s += `<line x1="200" y1="${36 + 3 * 42 - 3}" x2="640" y2="${36 + 3 * 42 - 3}" stroke="${DO}" stroke-width="2" stroke-dasharray="6 4"/>`;
  return s + `<text x="200" y="${36 + 6 * 42 + 18}" font-size="15" fill="${DO}">— ≤ 3 cut-off: 3 · 3 · 4 rows</text></svg>`;
};

/* Cây danh mục: 4 gốc, 8 con, + "Bút gel" tầng 3 (nét đứt). Nhãn vòng lặp đệ quy. */
const cay = (moi = false) => {
  const goc = [['1', 'Bút & mực', ['5 Bút bi', '6 Bút chì & tẩy', '7 Bút dạ quang']], ['2', 'Vở & giấy', ['8 Vở ô ly', '9 Sổ tay']], ['3', 'Dụng cụ học tập', ['10 Máy tính cầm tay', '11 Thước & compa']], ['4', 'Sách & tài liệu', ['12 Giáo trình IT']]];
  const W = 1110, cw = 262;
  let s = `<svg viewBox="0 0 ${W} 330" width="${W}" height="330" font-family="Arial">`;
  s += `<text x="0" y="40" font-size="15" font-weight="800" fill="${NAU}">anchor</text><text x="0" y="58" font-size="13" fill="#888">depth 1</text><text x="0" y="128" font-size="15" font-weight="800" fill="${XANH}">step 1</text><text x="0" y="146" font-size="13" fill="#888">depth 2</text>`;
  s += moi ? `<text x="0" y="292" font-size="15" font-weight="800" fill="${TIM}">step 2</text><text x="0" y="310" font-size="13" fill="#888">depth 3</text>` : `<text x="0" y="292" font-size="15" font-weight="800" fill="#aaa">step 2</text><text x="0" y="310" font-size="13" fill="#aaa">0 rows ⇒ stop</text>`;
  goc.forEach(([id, n, con], i) => {
    const x = 70 + i * (cw + 4);
    s += `<g data-k="g-${id}"><rect x="${x}" y="18" width="${cw - 16}" height="44" rx="9" fill="#fff7ef" stroke="${NAU}" stroke-width="2.4"/><text x="${x + 12}" y="46" font-size="17" font-weight="800" fill="#333">${id} · ${esc(n)}</text></g>`;
    con.forEach((cn, j) => {
      const y = 90 + j * 52;
      s += `<path d="M${x + 22},62 L${x + 22},${y + 22} L${x + 44},${y + 22}" fill="none" stroke="#999" stroke-width="2"/>`;
      s += `<g data-k="c-${cn.split(' ')[0]}"><rect x="${x + 44}" y="${y}" width="${cw - 62}" height="42" rx="8" fill="#eaf4ee" stroke="${XANH}" stroke-width="2"/><text x="${x + 54}" y="${y + 27}" font-size="15.5" fill="#333">${esc(cn)}</text></g>`;
    });
    if (moi && i === 0) {
      s += `<path d="M${x + 66},132 L${x + 66},${276 + 18} L${x + 86},${276 + 18}" fill="none" stroke="${TIM}" stroke-width="2" stroke-dasharray="6 4"/>`;
      s += `<g data-k="gel"><rect x="${x + 86}" y="276" width="${cw - 104}" height="40" rx="8" fill="#f3ecfa" stroke="${TIM}" stroke-width="2.4" stroke-dasharray="7 4"/><text x="${x + 96}" y="302" font-size="15.5" font-weight="800" fill="${TIM}">13 Bút gel</text></g>`;
    }
  });
  return s + '</svg>';
};

export const slides = lamDeck({ chuong: 'Lab 4 · CT Shop', bai: '' }, [
  { cover: true, t: 'Lab 4 — CT Shop:<br>the growth dashboard', sub: 'LAG · LAG 12 · generate_series + NULLIF · ROWS vs RANGE ·<br>ROW_NUMBER / RANK / DENSE_RANK · shares · WITH RECURSIVE' },

  { t: 'Your assignment', body: two(
    box('Monday 9:00, on the big screen', `<p style="margin:0 0 8px">The owner wants Lab 3’s report <b>with movement in it</b>: growth vs last month and vs <b>last year</b>, a <b>running total</b>, the <b>top 3</b> of every shelf, each category’s <b>share</b>, and a category tree that survives a <b>third level</b>.</p>
<p style="margin:0">Same data as Lab 3 ⇒ 713 payments, <b>411.147.000 đ</b> in Jan–Sep 2026 still hold. Numbers that overlap Chapter 8 must agree with it.</p>`, 'lam'),
    col(`<div class="tcap">Done means — your numbers are</div>`, steps([
      '21 months · <b>945.525.000</b> · March 2026 <b>+34,7 %</b> vs 2025 (W1)',
      'Moleskine: <b>13</b> weeks, <b>5</b> of them zero, no error (W2)',
      'September month-to-date <b>42.485.000</b> on the 30th (W3)',
      'top 3 = <b>24 / 24 / 25</b> rows (W4) · calculators <b>54,9 %</b> (W5)',
      'with “Bút gel” added: still <b>4</b> roots, Bút &amp; mực <b>54.875.000</b> (W6)',
    ]))), giua: true, to: true },

  { t: 'Files, setup — and the one shape of every query', body: `
${sh(`$ docker cp lab4-start.sql pgdemo:/tmp/
$ docker exec -i pgdemo psql -U postgres -d ctshop -q -f /tmp/lab4-start.sql
 categories | products | customers | orders | order_lines | payments
------------+----------+-----------+--------+-------------+----------
         12 |       48 |       300 |   2000 |        5000 |     1663
$ docker exec -it pgdemo psql -U postgres -d ctshop
ctshop=# SET search_path = shop;  SET TimeZone = 'Asia/Ho_Chi_Minh';`, { sm: true, hl: [5] })}
${flow([{ t: 'WITH cte AS (…)', s: 'bring data to the right grain', mau: PG }, { t: 'one row per', s: 'month · week · day · product', mau: CAM }, { t: 'SELECT … OVER (…)', s: 'each row looks at its neighbours', mau: XANH }, { t: 'outer query', s: 'filter / order the result', mau: NAU }], { h: 130, fs: 19 })}
${p('Get the <b>grain</b> right first — the window is the easy part. lab4-start.sql = the standard shop + the W1–W6 to-do list; lab4-solution.sql = every answer with its real output.', 20)}` },

  { t: 'A window keeps every row', body: `${cuaSo()}
${two(box('GROUP BY (Chapter 6)', 'Many rows ⇒ <b>one</b> row per group. The detail is gone.', ''), box('OVER (Chapter 8)', 'Every row <b>stays</b> and gets extra columns computed from its neighbours — here <code class="i">lag(revenue)</code>: each month looks one row back.', 'xanh'))}` },

  { t: 'W1 · growth vs last month and vs last year', body: two(S('W1', ['lag(', 'WINDOW']), col(P(giu(O.W1, (l) => /2025-0[12]|2026/.test(l)).replace(/\n( 2026-01)/, '\n …\n$1'), { sm: true, title: 'selected rows of 21 — 2025-03 … 2025-12 hidden', hl: [14] }),
    p('<code class="i">WINDOW w AS (ORDER BY month)</code> names the window once.', 18))) },

  { t: 'LAG 12 = the same month last year', body: `${lag12()}
${two(box('Read it calmly', 'Month over month jumps around (+105,9 %, −41,7 %…). <b>Year over year</b> compares like with like: March +34,7 %, February −25,5 %.', 'lam'),
    box('Only if no month is missing', 'lag(…, 12) means “12 <b>rows</b> back”. A missing month shifts every comparison — W2 shows what that looks like.', 'do2'))}` },

  { t: 'Trap: filter 2026 in the same query', body: nho(vsd(col(S('W1X', ['WHERE month'], { x: true, W: 64 }), P(dau(O.W1X, 2), { sm: true, title: 'first 2 of 9 rows — last_year is NULL everywhere' })),
    col(S('W1B', ['), g AS', 'FROM g', 'WHERE month'], { x: true, W: 64 }), P(dau(O.W1B, 2), { sm: true, title: 'first 2 of 9 rows' })), '✗ WHERE runs before OVER', '✓ window first, filter after')) },

  { t: 'W2 · weeks that do not exist', body: `${lich()}
${two(col(S('W2X', ['date_trunc(\'week\'', 'lag(']), p('Moleskine CT0906 · 590.000 đ · Q3 2026', 18)), col(P(O.W2X, { sm: true, hl: [5, 6] }), box('The “previous row” lies', '13 weeks, <b>8 rows</b>. 20/07 is compared with 06/07, 10/08 with 20/07.', 'do2')))}` },

  { t: 'Fill the calendar — then divide by zero', body: two(S('W2E', ['generate_series', 'LEFT JOIN', 'coalesce'], { x: true, W: 64 }),
    col(P(O.W2E, { sm: true, title: 'psql (17.11) — ctshop' }),
      box('What happened', '<b>generate_series</b> made all 13 Mondays, LEFT JOIN + coalesce turned the gaps into <b>0</b> — so LAG is honest now. The week after a 0 week divides by <b>0</b>: the whole query fails.', 'do2'),
      box('New: NULLIF(a, b)', 'Returns <b>NULL</b> when a = b, else a. Dividing by NULLIF(prev, 0) ⇒ NULL instead of an error.', 'lam'))) },

  { t: 'NULLIF: “no growth from nothing”', body: two(S('W2', ['NULLIF'], { x: true, W: 64 }), col(P(O.W2, { sm: true, hl: [5, 6] }),
    p('5 zero weeks: 13/07, 27/07, 03/08, 31/08, 07/09. After a zero week the % is <b>NULL</b> — not an error, not a made-up number.', 18))) },

  { t: 'W3 · September running total: ROWS or RANGE?', body: `${khungHinh()}
${nho(P(O.W3X, { sm: true, title: 'ORDER BY p.paid_at::date — several payments share a date', hl: [5, 6, 7, 8] }))}` },

  { t: 'Two fixes — pick the question', body: two(col(`<div class="tcap">per payment: make ORDER BY unique</div>`, S('W3A', ['OVER (ORDER BY p.paid_at, p.id)']), P(O.W3A, { sm: true })),
    col(`<div class="tcap">per day: aggregate first, then sum OVER</div>`, S('W3B', ['GROUP BY 1', 'sum(revenue) OVER']),
      box('Why the default surprised you', '<code class="i">ORDER BY</code> without a frame = <b>RANGE … CURRENT ROW</b>: rows with the same value are <b>peers</b> and share one total. ROWS adds row by row — in an order nothing fixed.', 'lam'))) },

  { t: 'The chart: September, day by day', body: `${duong()}
${two(P(giu(O.W3B, (l) => /09-0[1-4]|09-2[89]|09-30/.test(l)).replace(/\n( 2026-09-28)/, '\n …\n$1'), { sm: true, title: 'selected rows of 29 — no payment on 11/09' , hl: [10] }),
  box('One row per day ⇒ ROWS = RANGE', 'The last point is exactly September’s revenue from Lab 3: <b>42.485.000</b>. The cleanest fix is often the right <b>grain</b>.', 'xanh'))}` },

  { t: 'W4 · top 3 of every shelf — and a tie', body: two(col(S('W4A', ['WINDOW w', 'category_id = 8'], { x: true, W: 64 }), p('Output (real run) shown as the table on the right: sku, units and the three numbers.', 18)),
    col(`<div style="display:flex;justify-content:center">${bucDo()}</div>`, box('CT0804 and CT0805: 64 each', 'RANK: 2, 2, then <b>4</b>. DENSE_RANK: 2, 2, then <b>3</b>. ROW_NUMBER: 2 and 3 — <b>nothing in the query says which</b>.', ''))) },

  { t: '“Top 3” returns 24, 24 … or 25 rows', body: two(col(S('W4C', ['FILTER'], { x: true, W: 64 }), P(O.W4C, { sm: true })),
    col(box('It is a business decision', '', 'lam'), cards([
      ['A shelf with 3 slots', 'ROW_NUMBER + a tie-breaker someone <b>chose</b> (revenue, then sku).'],
      ['A medal table', 'RANK — a tie is shown, the next place is skipped.'],
      ['“The top 3 sales levels”', 'DENSE_RANK — may return more than 3 products.'],
    ], 1))), giua: true },

  { t: 'W4 · the report: a tie-breaker you chose', body: nho(S('W4', ['row_number()', 'ORDER BY units DESC, revenue DESC', 'pos <= 3'], { W: 90 }) + P(giu(O.W4, (l) => /Vở ô ly/.test(l)).replace(/\n( Vở ô ly)/, '\n …\n$1'), { sm: true, title: 'Vở ô ly rows of 24 — the 10-pack (6.720.000) beats the 200-page notebook (1.856.000) on revenue', hl: [5, 6] })).replace(/font-size:13.5px;line-height:1.38/g, 'font-size:12.5px;line-height:1.3').replace(/font-size:13px;line-height:1.34/g, 'font-size:12.5px;line-height:1.3') },

  { t: 'W5 · shares: an aggregate inside a window', body: two(S('W5', ['OVER ()', 'PARTITION BY r.name'], { x: true, W: 64 }), col(nho(P(O.W5, { sm: true, hl: [6] })).replace(/font-size:13px;line-height:1.34/, 'font-size:11px;line-height:1.36'), box('sum(sum(x)) OVER ()', 'Inner sum = GROUP BY’s total per category. Outer sum = the window over <b>all</b> rows ⇒ the shop total.', 'lam'), p('Calculators: <b>54,9 %</b> of the shop, 93,7 % of their root. pct_in_root adds up to 100 inside each root.', 18))) },

  { t: 'W6 · the category tree with WITH RECURSIVE', body: `${cay(false)}
${two(S('W6A', ['WHERE parent_id IS NULL', 'JOIN tree t'], { x: true, W: 64 }), P(giu(O.W6A, (l, i) => i < 5), { sm: true, title: 'first 5 of 12 rows' }))}` },

  { t: 'The shop adds a third level', body: two(col(S('W6INS', ['INSERT'], { x: true, W: 64 }), S('W6UPD', ['UPDATE'], { x: true, W: 64 }), P(`${O.W6INS}\n${O.W6UPD}`, { sm: true }),
    `<div style="display:flex;justify-content:center">${cay(true).replace('width="1110" height="330"', 'width="540" height="160"')}</div>`),
    col(S('W6X', ['JOIN category r'], { x: true, W: 64 }), P(O.W6X, { sm: true, hl: [7], title: '✗ Lab 3’s self-join: “Bút bi” became a root' }))) },

  { t: 'The recursive tree carries the real root down', body: two(col(S('W6', ['WITH RECURSIVE', 'JOIN tree t'], { x: true, W: 64 }), P(O.W6, { sm: true, hl: [5] })),
    col(P(O.W6D, { sm: true, hl: [5], title: 'path — depth 3 appears' }), box('Back to Lab 3’s numbers', '4 roots, Bút &amp; mực <b>54.875.000</b> again. The recursion does not care how deep the tree is: each step adds the children of the rows found so far, and stops when a step finds none.', 'xanh'),
      P('ROLLBACK', { sm: true, title: 'and the shop is back as it was' }))) },

  { t: 'In a real Node app', body: two(sql(`// Prisma's query API has no OVER (...) and no recursion
const growth = await prisma.$queryRaw\`
  WITH m AS (
    SELECT date_trunc('month', paid_at
             AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS month,
           sum(amount) AS revenue
    FROM shop.payment WHERE paid_at < \${to}
    GROUP BY 1
  ), g AS (
    SELECT month, revenue,
           lag(revenue, 12) OVER (ORDER BY month) AS last_year
    FROM m)
  SELECT * FROM g WHERE month >= \${from}::date\`;`, { sm: true, lang: 'typescript', hl: [11, 13] }),
    col(box('findMany / groupBy cannot', 'window functions · WITH RECURSIVE · generate_series. Dashboards are SQL.', ''),
      box('Many screens, one query?', 'Wrap it in a <b>VIEW</b> (Chapter 12) — the app reads the view, the SQL lives in one place.', 'lam'),
      box('Same rule as Lab 3', 'ORM for everyday reads and writes, SQL for reports — tested in psql first.', 'xanh')), 'r64'), giua: true },

  { t: 'Self-check — your numbers must match', body: two(tbl(['check', 'expected'], [
    ['W1 · months, total', '21 · 945.525.000'],
    ['W1 · March 2026 vs 2025', '+34,7 %'],
    ['W2 · weeks / zero weeks', '13 / 5'],
    ['W3 · Sept month-to-date', '42.485.000'],
    ['W4 · top-3 rows', '24 / 24 / 25'],
    ['W5 · calculators', '54,9 %'],
    ['W6 · roots with Bút gel', '4 (Bút &amp; mực 54.875.000)'],
    ['after ROLLBACK', '12 categories'],
  ], { cap: 'after W1–W6' }), col(`<ol style="font-size:21px;margin:0;padding-left:26px">
<li>Why does WHERE month &gt;= 2026 make “last year” NULL?</li>
<li>Same-date payments: why do RANGE and ROWS differ?</li>
<li>Why did the self-join show “Bút bi” as a root?</li></ol>`,
    box('Answers', '1 · WHERE runs before OVER — 2025 is gone before LAG reads it. 2 · RANGE gives all peers the day’s total; ROWS adds in an order nothing fixed. 3 · it looks one level up only; the recursive CTE carries the root down.', 'xanh'))), giua: true },

  { t: 'Traps of Lab 4', body: vsd(`<ul style="font-size:22px">
<li>WHERE on rows the window still needs</li>
<li>LAG over a series with missing weeks</li>
<li>x / prev when prev can be 0</li>
<li>Running total ORDER BY a repeating date</li>
<li>ROW_NUMBER on ties, no tie-breaker</li>
<li>Two self-joins for a tree</li></ul>`,
  `<ul style="font-size:22px">
<li>Window in a CTE, filter outside</li>
<li>generate_series calendar + LEFT JOIN</li>
<li>x / NULLIF(prev, 0)</li>
<li>Unique ORDER BY, or one row per day</li>
<li>A tie-breaker you chose — or RANK</li>
<li>WITH RECURSIVE</li></ul>`, '✗ Trap', '✓ Do this'), giua: true },

  { t: 'Summary — and next: Lab 5', body: two(steps([
    'CTE first: bring data to the right <b>grain</b>',
    'LAG / LAG 12 for growth — window first, filter after',
    'Fill gaps with <b>generate_series</b>; divide by <b>NULLIF</b>',
    'Know your frame: RANGE peers vs ROWS order',
    'Ranking ties are a business decision · trees are <b>recursive</b>',
  ]), box('Lab 5 — after Chapter 10', 'The dashboard is right — is it <b>fast</b>? One million orders, <b>EXPLAIN ANALYZE</b> before and after indexes, covering and partial indexes.', 'lam'), 'r64'), giua: true, to: true },
]);
