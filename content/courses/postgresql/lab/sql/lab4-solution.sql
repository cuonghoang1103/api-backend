-- ═══════════════════════════════════════════════════════════════════════════
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
\pset pager off
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
SELECT count(*) AS categories FROM category;                                         -- 12 (the ROLLBACK undid Bút gel)
