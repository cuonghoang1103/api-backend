-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 3 — SOLUTION: the 9-month report for Monday's meeting (JOIN + GROUP BY)
-- Lab 3 — ĐÁP ÁN: báo cáo 9 tháng 2026 cho buổi họp sáng thứ Hai
-- cuongthai.com/courses/postgresql · PostgreSQL 17 · only Chapters 1–6 (+ NOT EXISTS, previewed here)
--
-- Needs: lab3-start.sql already run (clean standard schema + standard data).
--   docker cp lab3-solution.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab3-solution.sql
-- Every number in the comments is the real output on PostgreSQL 17.
-- Mọi con số trong chú thích là output thật trên PostgreSQL 17.
-- ═══════════════════════════════════════════════════════════════════════════
\pset pager off
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';

-- ── R0 · the period: money counts on the day it is PAID (payment.paid_at), Jan 1 → Sep 30 2026, half-open ──
SELECT count(*) AS payments, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';             -- 713 | 411147000.00

-- ── R1 · revenue by month: payment ⋈ orders (buyers = distinct customers) ──
SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*)                      AS orders,
       count(DISTINCT o.customer_id) AS buyers,
       sum(p.amount)                 AS revenue,
       round(avg(p.amount))          AS avg_order
FROM payment p
JOIN orders o ON o.id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;                                                            -- 9 rows, best month 2026-03: 63914000

-- ── R2 · revenue by category: 5 tables, category joined to ITSELF to find the root ──
SELECT r.name AS root, c.name AS category,
       sum(oi.qty)                 AS units,
       sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id                               -- self-join: the parent row
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name, c.name
ORDER BY revenue DESC;                                                 -- 8 rows, calculators 225855000

-- R2b · the same money rolled up to the 4 roots — must add up to R0
SELECT r.name AS root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name
ORDER BY revenue DESC;                                                 -- 240969000 + 68949000 + 54875000 + 46354000 = 411147000 ✓

-- ── R3 · customers to win back ──
-- R3a · never ordered anything: LEFT JOIN … IS NULL (anti-join) …
SELECT c.id, c.email, c.city, c.created_at::date AS joined
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.id;                                                         -- 10 rows: 291…300
-- … and the same question with NOT EXISTS (Chapter 7 goes deeper)
SELECT count(*) AS never_ordered
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);  -- 10

-- R3b · no PAID order placed in 2026 — the condition on orders belongs in ON
SELECT count(*) AS no_purchase_2026
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
                  AND o.status IN ('paid', 'shipped')
                  AND o.created_at >= '2026-01-01'
WHERE o.id IS NULL;                                                    -- 30 (10 never + 20 lapsed)
-- ✗ trap: the same condition in WHERE throws away the NULL rows LEFT JOIN just kept
SELECT count(*) AS no_purchase_2026
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status IN ('paid', 'shipped')
  AND o.created_at >= '2026-01-01'
  AND o.id IS NULL;                                                    -- 0 ✗
-- R3c · the call list: bought before 2026, nothing paid in 2026 (latest purchase first)
SELECT c.id, c.full_name, c.phone, max(o.created_at)::date AS last_purchase
FROM customer c
JOIN orders o ON o.customer_id = c.id AND o.status IN ('paid', 'shipped')
WHERE NOT EXISTS (SELECT 1 FROM orders o2
                  WHERE o2.customer_id = c.id
                    AND o2.status IN ('paid', 'shipped')
                    AND o2.created_at >= '2026-01-01')
GROUP BY c.id
ORDER BY last_purchase DESC, c.id;                                     -- 20 rows

-- ── R4 · the boss wants "units sold" in R1 — the FAN-OUT trap ──
-- ✗ join payment straight to order_item: one payment row per order LINE
SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*) AS orders, sum(p.amount) AS revenue, sum(oi.qty) AS units
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;                                                            -- revenue ×3, orders ×2.5 — units is right
-- why: look at the raw rows of one order
SELECT p.order_id, p.amount, oi.product_id, oi.qty, oi.unit_price
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.order_id = 87;                                                 -- 4 rows, 832000 four times
-- the tell: count(*) beside count(DISTINCT key)
SELECT count(*) AS joined_rows, count(DISTINCT p.id) AS payments, sum(p.amount) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01';          -- 1779 | 713 | 1240593000.00 ✗
-- ✓ fix: aggregate order_item to ONE row per order first, then join
SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*) AS orders, sum(p.amount) AS revenue, sum(i.units) AS units
FROM payment p
JOIN (SELECT order_id, sum(qty) AS units
      FROM order_item
      GROUP BY order_id) i ON i.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;                                                            -- revenue back to R1, units 3528 in total

-- ── R5 · VIP list: spent ≥ 4.000.000 đ AND ≥ 5 paid orders in 2026 → HAVING ──
SELECT c.id, c.full_name, c.city, count(*) AS orders, sum(p.amount) AS spent
FROM customer c
JOIN orders o  ON o.customer_id = c.id
JOIN payment p ON p.order_id = o.id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'           -- filters ROWS (before grouping)
GROUP BY c.id
HAVING sum(p.amount) >= 4000000 AND count(*) >= 5                      -- filters GROUPS (after)
ORDER BY spent DESC;                                                   -- 7 rows
-- ✗ trap: an aggregate in WHERE
SELECT c.id
FROM customer c
JOIN orders o ON o.customer_id = c.id
WHERE count(*) >= 5
GROUP BY c.id;                                                         -- ERROR aggregate functions are not allowed in WHERE

-- ── R6 · order health by month: one row per month, one column per status → FILTER ──
SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
       count(*)                                     AS placed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'paid')      AS paid,
       count(*) FILTER (WHERE status = 'shipped')   AS shipped,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct
FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;                                                            -- 855 placed, worst month 2026-08: 12.2 %
-- ✗ trap: integer ÷ integer throws the decimals away
SELECT 100 * count(*) FILTER (WHERE status = 'cancelled') / count(*)   AS int_pct,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS real_pct
FROM orders
WHERE created_at >= '2026-08-01' AND created_at < '2026-09-01';        -- 12 | 12.2
-- R6b · payment methods side by side (one row)
SELECT sum(amount) FILTER (WHERE method = 'cod')  AS cod,
       sum(amount) FILTER (WHERE method = 'card') AS card,
       sum(amount) FILTER (WHERE method = 'momo') AS momo,
       sum(amount) FILTER (WHERE method = 'bank') AS bank
FROM payment
WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';              -- adds up to 411147000

-- ── T1 · trap: the server runs in UTC → orders near midnight change month ──
SET TimeZone = 'UTC';
SELECT order_id, amount, paid_at
FROM payment
WHERE paid_at >= '2026-02-01 00:00+07' AND paid_at < '2026-02-01 07:00+07';   -- paid 00:48 on 1 Feb in Hà Nội = 31 Jan in UTC
SELECT to_char(date_trunc('month', paid_at), 'YYYY-MM') AS month, count(*) AS orders, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01 00:00+07' AND paid_at < '2026-04-01 00:00+07'
GROUP BY 1 ORDER BY 1;                                                 -- 76 / 66 / 89 ✗ (should be 75 / 64 / 92)
-- ✓ name the time zone inside the query (works whatever the session says)
SELECT to_char(date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM') AS month,
       count(*) AS orders, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01 00:00+07' AND paid_at < '2026-04-01 00:00+07'
GROUP BY 1 ORDER BY 1;                                                 -- 75 / 64 / 92 ✓
SET TimeZone = 'Asia/Ho_Chi_Minh';

-- ════════════════════ Self-check: these numbers must match ════════════════════
SELECT count(*) AS payments, sum(amount) AS revenue
FROM payment WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';                -- 713 | 411147000.00
SELECT sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS item_revenue
FROM payment p JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01';                        -- 3528 | 411147000.00
SELECT count(*) AS never_ordered FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);                 -- 10
SELECT count(*) AS orders_2026 FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01';                      -- 855
