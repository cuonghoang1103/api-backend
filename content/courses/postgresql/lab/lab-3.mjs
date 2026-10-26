/**
 * Lab 3 — CT Shop: báo cáo 9 tháng cho buổi họp (sau Chương 6). Agent lab34, 25/10/2026.
 * Chèn vào Chương 6 bằng lab/index.mjs (LAB_SAU[6]) — sau bài 6.4, trước quiz.
 * Kiến thức tới Ch6 (JOIN, self-join, LEFT JOIN, GROUP BY, HAVING, FILTER, bảng dẫn xuất trong FROM như bài 6.4).
 * Mới, giảng ngắn ngay trong lab: NOT EXISTS (Ch7 học kỹ) và AT TIME ZONE (bẫy máy chủ chạy UTC).
 * Mọi output = chạy thật PostgreSQL 17.11 (lab3-start.sql rồi lab3-solution.sql bằng psql -f qua TTY, DB nháp ctlab3).
 * Q / O / SOL SINH TỰ ĐỘNG từ lab/sql/lab3-solution.sql + output thật (scratchpad lab34/mk-o.mjs) — không gõ tay.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-3.mjs';

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

/* Câu SQL từng bước — sinh từ lab3-solution.sql. */
/* Q:BEGIN */
const Q = {
  R0: `SELECT count(*) AS payments, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';   -- 713 | 411147000.00`,
  R1: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*)                      AS orders,
       count(DISTINCT o.customer_id) AS buyers,
       sum(p.amount)                 AS revenue,
       round(avg(p.amount))          AS avg_order
FROM payment p
JOIN orders o ON o.id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- 9 rows, best month 2026-03: 63914000`,
  R2: `SELECT r.name AS root, c.name AS category,
       sum(oi.qty)                 AS units,
       sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id   -- self-join: the parent row
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name, c.name
ORDER BY revenue DESC;   -- 8 rows, calculators 225855000`,
  R2B: `SELECT r.name AS root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name
ORDER BY revenue DESC;   -- 240969000 + 68949000 + 54875000 + 46354000 = 411147000 ✓`,
  R3A: `SELECT c.id, c.email, c.city, c.created_at::date AS joined
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.id;   -- 10 rows: 291…300`,
  R3A2: `SELECT count(*) AS never_ordered
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);   -- 10`,
  R3B: `SELECT count(*) AS no_purchase_2026
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
                  AND o.status IN ('paid', 'shipped')
                  AND o.created_at >= '2026-01-01'
WHERE o.id IS NULL;   -- 30 (10 never + 20 lapsed)`,
  R3BX: `SELECT count(*) AS no_purchase_2026
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status IN ('paid', 'shipped')
  AND o.created_at >= '2026-01-01'
  AND o.id IS NULL;   -- 0 ✗`,
  R3C: `SELECT c.id, c.full_name, c.phone, max(o.created_at)::date AS last_purchase
FROM customer c
JOIN orders o ON o.customer_id = c.id AND o.status IN ('paid', 'shipped')
WHERE NOT EXISTS (SELECT 1 FROM orders o2
                  WHERE o2.customer_id = c.id
                    AND o2.status IN ('paid', 'shipped')
                    AND o2.created_at >= '2026-01-01')
GROUP BY c.id
ORDER BY last_purchase DESC, c.id;   -- 20 rows`,
  R4X: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*) AS orders, sum(p.amount) AS revenue, sum(oi.qty) AS units
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- revenue ×3, orders ×2.5 — units is right`,
  R4RAW: `SELECT p.order_id, p.amount, oi.product_id, oi.qty, oi.unit_price
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.order_id = 87;   -- 4 rows, 832000 four times`,
  R4TELL: `SELECT count(*) AS joined_rows, count(DISTINCT p.id) AS payments, sum(p.amount) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01';   -- 1779 | 713 | 1240593000.00 ✗`,
  R4FIX: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*) AS orders, sum(p.amount) AS revenue, sum(i.units) AS units
FROM payment p
JOIN (SELECT order_id, sum(qty) AS units
      FROM order_item
      GROUP BY order_id) i ON i.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- revenue back to R1, units 3528 in total`,
  R5: `SELECT c.id, c.full_name, c.city, count(*) AS orders, sum(p.amount) AS spent
FROM customer c
JOIN orders o  ON o.customer_id = c.id
JOIN payment p ON p.order_id = o.id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'   -- filters ROWS (before grouping)
GROUP BY c.id
HAVING sum(p.amount) >= 4000000 AND count(*) >= 5   -- filters GROUPS (after)
ORDER BY spent DESC;   -- 7 rows`,
  R5X: `SELECT c.id
FROM customer c
JOIN orders o ON o.customer_id = c.id
WHERE count(*) >= 5
GROUP BY c.id;   -- ERROR aggregate functions are not allowed in WHERE`,
  R6: `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
       count(*)                                     AS placed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'paid')      AS paid,
       count(*) FILTER (WHERE status = 'shipped')   AS shipped,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct
FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- 855 placed, worst month 2026-08: 12.2 %`,
  R6X: `SELECT 100 * count(*) FILTER (WHERE status = 'cancelled') / count(*)   AS int_pct,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS real_pct
FROM orders
WHERE created_at >= '2026-08-01' AND created_at < '2026-09-01';   -- 12 | 12.2`,
  R6B: `SELECT sum(amount) FILTER (WHERE method = 'cod')  AS cod,
       sum(amount) FILTER (WHERE method = 'card') AS card,
       sum(amount) FILTER (WHERE method = 'momo') AS momo,
       sum(amount) FILTER (WHERE method = 'bank') AS bank
FROM payment
WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';   -- adds up to 411147000`,
  T1A: `SELECT order_id, amount, paid_at
FROM payment
WHERE paid_at >= '2026-02-01 00:00+07' AND paid_at < '2026-02-01 07:00+07';   -- paid 00:48 on 1 Feb in Hà Nội = 31 Jan in UTC`,
  T1X: `SELECT to_char(date_trunc('month', paid_at), 'YYYY-MM') AS month, count(*) AS orders, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01 00:00+07' AND paid_at < '2026-04-01 00:00+07'
GROUP BY 1 ORDER BY 1;   -- 76 / 66 / 89 ✗ (should be 75 / 64 / 92)`,
  T1: `SELECT to_char(date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM') AS month,
       count(*) AS orders, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01 00:00+07' AND paid_at < '2026-04-01 00:00+07'
GROUP BY 1 ORDER BY 1;   -- 75 / 64 / 92 ✓`,
  SC1: `SELECT count(*) AS payments, sum(amount) AS revenue
FROM payment WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';   -- 713 | 411147000.00`,
  SC2: `SELECT sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS item_revenue
FROM payment p JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01';   -- 3528 | 411147000.00`,
  SC3: `SELECT count(*) AS never_ordered FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);   -- 10`,
  SC4: `SELECT count(*) AS orders_2026 FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01';   -- 855`,
};
/* Q:END */

/* Output THẬT (PostgreSQL 17.11) — sinh từ lab3-solution.sql chạy bằng psql -f. */
/* O:BEGIN */
const O = {
  R0: ` payments |   revenue    
----------+--------------
      713 | 411147000.00
(1 row)`,
  R1: `  month  | orders | buyers |   revenue   | avg_order 
---------+--------+--------+-------------+-----------
 2026-01 |     75 |     67 | 48698000.00 |    649307
 2026-02 |     64 |     56 | 31046000.00 |    485094
 2026-03 |     92 |     80 | 63914000.00 |    694717
 2026-04 |     69 |     64 | 37252000.00 |    539884
 2026-05 |     73 |     62 | 49290000.00 |    675205
 2026-06 |     81 |     68 | 40587000.00 |    501074
 2026-07 |     99 |     85 | 60560000.00 |    611717
 2026-08 |     80 |     67 | 37315000.00 |    466438
 2026-09 |     80 |     74 | 42485000.00 |    531063
(9 rows)`,
  R2: `      root       |     category     | units |   revenue    
-----------------+------------------+-------+--------------
 Dụng cụ học tập | Máy tính cầm tay |   474 | 225855000.00
 Vở & giấy       | Sổ tay           |   417 |  57392000.00
 Sách & tài liệu | Giáo trình IT    |   464 |  46354000.00
 Bút & mực       | Bút chì & tẩy    |   451 |  22782000.00
 Bút & mực       | Bút dạ quang     |   373 |  16507000.00
 Bút & mực       | Bút bi           |   506 |  15586000.00
 Dụng cụ học tập | Thước & compa    |   451 |  15114000.00
 Vở & giấy       | Vở ô ly          |   392 |  11557000.00
(8 rows)`,
  R2B: `      root       |   revenue    
-----------------+--------------
 Dụng cụ học tập | 240969000.00
 Vở & giấy       |  68949000.00
 Bút & mực       |  54875000.00
 Sách & tài liệu |  46354000.00
(4 rows)`,
  R3A: ` id  |      email      |   city    |   joined   
-----+-----------------+-----------+------------
 291 | kh291@ctshop.vn | Đà Nẵng   | 2026-08-11
 292 | kh292@ctshop.vn | TP.HCM    | 2025-04-20
 293 | kh293@ctshop.vn | Cần Thơ   | 2025-05-29
 294 | kh294@ctshop.vn | Hải Phòng | 2025-03-10
 295 | kh295@ctshop.vn | Cần Thơ   | 2025-01-11
 296 | kh296@ctshop.vn | Đà Nẵng   | 2025-07-18
 297 | kh297@ctshop.vn | Cần Thơ   | 2025-08-19
 298 | kh298@ctshop.vn | Hà Nội    | 2025-07-12
 299 | kh299@ctshop.vn | Cần Thơ   | 2025-12-10
 300 | kh300@ctshop.vn | Cần Thơ   | 2026-02-07
(10 rows)`,
  R3A2: ` never_ordered 
---------------
            10
(1 row)`,
  R3B: ` no_purchase_2026 
------------------
               30
(1 row)`,
  R3BX: ` no_purchase_2026 
------------------
                0
(1 row)`,
  R3C: ` id  |    full_name    |   phone    | last_purchase 
-----+-----------------+------------+---------------
 197 | Vũ Gia Nam      | 0931560043 | 2025-12-28
 241 | Trần Thị Bình   | 0911908479 | 2025-12-28
 186 | Lê Văn Linh     | 0981472934 | 2025-12-17
 230 | Đặng Minh An    | 0971821370 | 2025-11-28
 252 | Hoàng Văn Chi   |            | 2025-11-26
  47 | Bùi Gia Nam     | 0930372193 | 2025-11-12
  24 | Nguyễn Văn Hà   | 0350190056 | 2025-11-06
 158 | Đặng Minh Phúc  | 0321251202 | 2025-11-06
 118 | Đặng Thu Phúc   | 0810934442 | 2025-10-31
 105 | Trần Quốc Khoa  |            | 2025-10-16
 152 | Nguyễn Minh Chi | 0931203688 | 2025-10-12
  37 | Vũ Thị Nam      | 0860293003 | 2025-09-18
 141 | Vũ Quốc Bình    | 0981116579 | 2025-08-18
 221 | Vũ Gia Bình     | 0701750099 | 2025-08-01
 126 | Đặng Văn Linh   |            | 2025-07-25
 189 | Vũ Quốc Trang   |            | 2025-07-16
 264 | Nguyễn Văn Hà   | 0352090616 | 2025-06-10
 130 | Lê Thu An       | 0381029470 | 2025-04-06
 153 | Trần Quốc Dũng  | 0941211607 | 2025-03-25
 144 | Nguyễn Văn Hà   | 0351140336 | 2025-02-13
(20 rows)`,
  R4X: `  month  | orders |   revenue    | units 
---------+--------+--------------+-------
 2026-01 |    185 | 149045000.00 |   354
 2026-02 |    157 |  93381000.00 |   320
 2026-03 |    242 | 204918000.00 |   488
 2026-04 |    160 | 100083000.00 |   323
 2026-05 |    186 | 152807000.00 |   376
 2026-06 |    201 | 118270000.00 |   396
 2026-07 |    250 | 184921000.00 |   494
 2026-08 |    200 | 115884000.00 |   382
 2026-09 |    198 | 121284000.00 |   395
(9 rows)`,
  R4RAW: ` order_id |  amount   | product_id | qty | unit_price 
----------+-----------+------------+-----+------------
       87 | 832000.00 |         21 |   1 |   13000.00
       87 | 832000.00 |         37 |   3 |    5000.00
       87 | 832000.00 |         43 |   3 |   89000.00
       87 | 832000.00 |         45 |   3 |  179000.00
(4 rows)`,
  R4TELL: ` joined_rows | payments |    revenue    
-------------+----------+---------------
        1779 |      713 | 1240593000.00
(1 row)`,
  R4FIX: `  month  | orders |   revenue   | units 
---------+--------+-------------+-------
 2026-01 |     75 | 48698000.00 |   354
 2026-02 |     64 | 31046000.00 |   320
 2026-03 |     92 | 63914000.00 |   488
 2026-04 |     69 | 37252000.00 |   323
 2026-05 |     73 | 49290000.00 |   376
 2026-06 |     81 | 40587000.00 |   396
 2026-07 |     99 | 60560000.00 |   494
 2026-08 |     80 | 37315000.00 |   382
 2026-09 |     80 | 42485000.00 |   395
(9 rows)`,
  R5: ` id  |    full_name    |  city   | orders |   spent    
-----+-----------------+---------+--------+------------
 270 | Đặng Văn An     | Hà Nội  |      8 | 6936000.00
  51 | Phạm Quốc Bình  | TP.HCM  |      5 | 5328000.00
 188 | Hoàng Minh Phúc | TP.HCM  |     10 | 5108000.00
 202 | Lê Thu Chi      | Đà Nẵng |      5 | 4659000.00
 254 | Đặng Minh Hà    | TP.HCM  |      7 | 4404000.00
  94 | Đặng Thu Hà     | Cần Thơ |      5 | 4124000.00
  59 | Phạm Gia Trang  | TP.HCM  |      5 | 4015000.00
(7 rows)`,
  R5X: `psql:/tmp/lab3-solution.sql:138: ERROR:  aggregate functions are not allowed in WHERE
LINE 4: WHERE count(*) >= 5
              ^`,
  R6: `  month  | placed | pending | paid | shipped | cancelled | cancel_pct 
---------+--------+---------+------+---------+-----------+------------
 2026-01 |     96 |      12 |   28 |      48 |         8 |        8.3
 2026-02 |     78 |       7 |   28 |      36 |         7 |        9.0
 2026-03 |    113 |      15 |   47 |      44 |         7 |        6.2
 2026-04 |     80 |       5 |   33 |      36 |         6 |        7.5
 2026-05 |     89 |       9 |   36 |      37 |         7 |        7.9
 2026-06 |     93 |       6 |   28 |      53 |         6 |        6.5
 2026-07 |    113 |       9 |   39 |      61 |         4 |        3.5
 2026-08 |     98 |       6 |   33 |      47 |        12 |       12.2
 2026-09 |     95 |      10 |   27 |      52 |         6 |        6.3
(9 rows)`,
  R6X: ` int_pct | real_pct 
---------+----------
      12 |     12.2
(1 row)`,
  R6B: `     cod     |    card     |     momo     |     bank     
-------------+-------------+--------------+--------------
 38923000.00 | 77206000.00 | 132814000.00 | 162204000.00
(1 row)`,
  T1A: ` order_id |  amount  |        paid_at         
----------+----------+------------------------
      854 | 51000.00 | 2026-01-31 17:48:00+00
(1 row)`,
  T1X: `  month  | orders |   revenue   
---------+--------+-------------
 2026-01 |     76 | 48749000.00
 2026-02 |     66 | 32889000.00
 2026-03 |     89 | 62020000.00
(3 rows)`,
  T1: `  month  | orders |   revenue   
---------+--------+-------------
 2026-01 |     75 | 48698000.00
 2026-02 |     64 | 31046000.00
 2026-03 |     92 | 63914000.00
(3 rows)`,
  SC1: ` payments |   revenue    
----------+--------------
      713 | 411147000.00
(1 row)`,
  SC2: ` units | item_revenue 
-------+--------------
  3528 | 411147000.00
(1 row)`,
  SC3: ` never_ordered 
---------------
            10
(1 row)`,
  SC4: ` orders_2026 
-------------
         855
(1 row)`,
};
/* O:END */

/* Toàn văn lab3-solution.sql (trùng tệp tải về). */
/* SOL:BEGIN */
const SOL = `-- ═══════════════════════════════════════════════════════════════════════════
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
\\pset pager off
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
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01';                      -- 855`;
/* SOL:END */

const SETUP = `$ docker cp lab3-start.sql pgdemo:/tmp/
$ docker exec -i pgdemo psql -U postgres -d ctshop -q -f /tmp/lab3-start.sql
 categories | products | customers | orders | order_lines | payments
------------+----------+-----------+--------+-------------+----------
         12 |       48 |       300 |   2000 |        5000 |     1663
(1 row)
$ docker exec -it pgdemo psql -U postgres -d ctshop
ctshop=# SET search_path = shop;
ctshop=# SET TimeZone = 'Asia/Ho_Chi_Minh';`;

const PRISMA = `// groupBy: ONE table, plain columns — fine for "orders per status"
const byStatus = await prisma.orders.groupBy({
  by: ['status'],
  _count: { _all: true },
  where: { created_at: { gte: from, lt: to } },
});

// R1 needs date_trunc + a JOIN + count(DISTINCT) → raw SQL, parameters stay safe
const rows = await prisma.$queryRaw\`
  SELECT to_char(date_trunc('month', p.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM') AS month,
         count(*)::int                      AS orders,   -- ::int, or JS gets a BigInt
         count(DISTINCT o.customer_id)::int AS buyers,
         sum(p.amount)                      AS revenue   -- numeric → Prisma.Decimal
  FROM shop.payment p JOIN shop.orders o ON o.id = p.order_id
  WHERE p.paid_at >= \${from} AND p.paid_at < \${to}
  GROUP BY 1 ORDER BY 1\`;`;

const FILES = (vi) => [
  [`${F}/lab3-start.sql`, '🧩', 'lab3-start.sql', vi ? 'CT Shop sạch và đầy đủ (lược đồ chuẩn + dữ liệu chuẩn) + danh sách việc R0–R6' : 'A clean, complete CT Shop (standard schema + standard data) + the R0–R6 to-do list'],
  [`${F}/lab3-solution.sql`, '🔑', 'lab3-solution.sql', vi ? 'Mọi truy vấn, mọi bẫy, output thật trong chú thích — mở sau khi tự làm' : 'Every query, every trap, real output in the comments — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

/** Một bước: đề + gợi ý + đáp án ẩn (một hay nhiều câu SQL + output thật). */
const buoc = (lang, k, de, goiY, keys, sau = '') => `<h4>${k} — ${de}</h4>
${goiY ? `<p class="meo">💡 ${goiY}</p>` : ''}
${details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, keys.map((x) => code(Q[x]) + out(O[x])).join('\n') + (sau ? `<p>${sau}</p>` : ''))}`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 3 · CT Shop · after Chapter 6</span>
<h2>The 9-month report for Monday’s meeting</h2>
<p class="lead">CT Shop now has everything: order lines, payments, reviews. On Friday evening the owner sends one message: <em>“Monday 9:00, nine-month review. I need revenue by month, which categories make the money, who we should call back, a VIP list for vouchers, and how many orders get cancelled.”</em> You will build that report with JOINs and GROUP BY — and you will meet, with real money, the bug that makes a report look perfect and be three times too high.</p>

<h3>1 · The brief</h3>
<p>Start from a clean shop: <code>lab3-start.sql</code> rebuilds the standard schema with the standard data (12 categories, 48 products, 300 customers, 2,000 orders, 5,000 order lines, 1,663 payments), so whatever Lab 1 and Lab 2 left behind does not matter. Two decisions every real report must write down before the first query:</p>
<ul>
<li><strong>Which date?</strong> Money counts on the day it is paid: <code>payment.paid_at</code>. Order counts (R6) use <code>orders.created_at</code>.</li>
<li><strong>Which period?</strong> 1 January → 30 September 2026, always as a half-open range: <code>&gt;= '2026-01-01' AND &lt; '2026-10-01'</code> (Lab 2 showed what BETWEEN does to the last day).</li>
</ul>
<p>Tools: everything up to Chapter 6 — JOIN, self-join, LEFT JOIN, GROUP BY, HAVING, FILTER, and a small aggregated subquery inside FROM as in lesson 6.4. Two things are new and explained right here: <code>NOT EXISTS</code> (Chapter 7 goes deeper) and <code>AT TIME ZONE</code>.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>R0</strong> — the size of the period: number of payments and total revenue.</li>
<li><strong>R1</strong> — revenue by month: orders, distinct buyers, revenue, average order value (9 rows).</li>
<li><strong>R2</strong> — revenue and units by sub-category with its root category (self-join), then by root — and the roots must add up to R0.</li>
<li><strong>R3</strong> — the win-back list: customers who never ordered (two ways), customers with no paid order in 2026, and the 20 lapsed customers to call.</li>
<li><strong>R4</strong> — add “units sold” to R1 <em>without</em> inflating revenue.</li>
<li><strong>R5</strong> — VIP: spent at least 4.000.000 đ <strong>and</strong> at least 5 paid orders in the period.</li>
<li><strong>R6</strong> — order health: one row per month, one column per status, and the cancel rate in %.</li>
</ol>
<div class="callout ok"><p><strong>You pass when</strong> your numbers are: 713 payments · 411.147.000 đ · the 4 roots add up to 411.147.000 · 3.528 units · 10 never ordered · 30 with no purchase in 2026 · 7 VIP · 855 orders placed · August cancel rate 12,2 %.</p></div>

<h3>3 · Downloads and setup</h3>
<div class="callout"><p><code>pgdemo</code> is the name of <em>your</em> PostgreSQL 17 container. If you built it in lesson 0.3 it is called <code>pg17</code>: either write <code>pg17</code> instead of <code>pgdemo</code> in every command below, or give it the alias once with <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(false)}
${out(SETUP)}
<p>The start file drops and rebuilds schema <code>shop</code>; run it once. The data is deterministic (<code>setseed</code>), so your numbers will match ours exactly — as long as the TimeZone matches too (see T1).</p>

<h3>4 · Build the report, step by step</h3>
<p>Write each query yourself, run it, compare with the answer. Before you trust any total, ask the question of this lab: <em>what is one row here?</em></p>

${buoc('en', 'R0', 'the size of the period', 'One table is enough. This number is the anchor: every later report must agree with it.', ['R0'])}

${buoc('en', 'R1', 'revenue by month', '<code>date_trunc(\'month\', p.paid_at)</code> rounds every payment down to the first of its month (lesson 2.3); <code>to_char(…, \'YYYY-MM\')</code> makes it readable. Buyers live in <code>orders</code>, so join payment → orders on <code>o.id = p.order_id</code>. <code>GROUP BY 1</code> = “group by the first column”.', ['R1'], 'One payment per order (UNIQUE in Lab 1), so <code>count(*)</code> here really counts orders. 75 + 64 + … + 80 = 713 and the revenue column adds up to 411.147.000 — R0 again. March is the best month, February and August the weakest.')}

${buoc('en', 'R2', 'which categories make the money', 'Path: payment → order_item → product → category. A product points at a <em>sub</em>-category; its root is the row that <code>c.parent_id</code> points to — so join <code>category</code> a second time under another alias (a self-join, lesson 5.3). Revenue per line = <code>qty * unit_price</code> (the price at the time of purchase, not today’s price).', ['R2', 'R2B'], 'Calculators are 6 of the 48 products and 55 % of the money. The roll-up is the check: 240.969.000 + 68.949.000 + 54.875.000 + 46.354.000 = 411.147.000, the same as R0, computed from a different table. Two reports that agree are the cheapest test you will ever write. (The self-join only works because the tree has exactly two levels — Lab 4 replaces it with a recursive query that works at any depth.)')}

<h4>R3 — who should we call back?</h4>
<p class="meo">💡 “Customers <em>without</em> orders” is an anti-join. LEFT JOIN keeps every customer; where no order matched, the order columns are NULL — so <code>WHERE o.id IS NULL</code> keeps exactly the customers with nothing on the right.</p>
<p><strong>New: <code>NOT EXISTS</code>.</strong> The same question, asked directly: “keep customer c if there does <em>not</em> exist an order row with <code>customer_id = c.id</code>”. The inner SELECT runs per customer and only answers yes/no, so <code>SELECT 1</code> is enough. It cannot multiply rows and reads like the sentence you were given. Chapter 7 explains how PostgreSQL executes it.</p>
${details('Answer — R3a', code(Q.R3A) + out(O.R3A) + code(Q.R3A2) + out(O.R3A2) + '<p>Both ways: customers 291–300, the ten who signed up and never ordered.</p>')}
<p>Now the useful version: customers who did <strong>not buy in 2026</strong> (no paid or shipped order placed since 1 January). The extra conditions are about the <em>orders</em> we are looking for, so they go into <code>ON</code>:</p>
${details('Answer — R3b', code(Q.R3B) + out(O.R3B) + '<p>30 = the 10 who never ordered + 20 who bought before 2026 and then stopped.</p>')}
<div class="pitfall"><p><strong>Trap — the condition in WHERE.</strong> Move the same conditions to WHERE and the answer becomes 0. WHERE runs <em>after</em> the join: on the rows LEFT JOIN added for “no match”, <code>o.status</code> is NULL, <code>NULL IN (…)</code> is not true, and every one of them is thrown away — the LEFT JOIN quietly became an INNER JOIN, and an INNER JOIN row can never have <code>o.id IS NULL</code>.</p></div>
${out(O.R3BX)}
${details('Answer — R3c, the call list (20 lapsed customers)', code(Q.R3C) + out(O.R3C) + '<p>Sorted by the most recent purchase: customers who left in December are the easiest to win back. Four have no phone number — they will get an email instead.</p>')}

<h4>R4 — “add units sold to R1” — the fan-out trap</h4>
<p>It looks like a one-line change: join <code>order_item</code> too and add <code>sum(oi.qty)</code>. Run it before you read on.</p>
${details('What it returns', code(Q.R4X) + out(O.R4X))}
<p>March jumps from 63.914.000 to 204.918.000. Nothing errors, every number looks plausible — and the units column is even correct. Look at the raw rows of a single order:</p>
${code(Q.R4RAW)}
${out(O.R4RAW)}
<p>Order 87 has 4 lines, so its one payment of 832.000 đ now appears 4 times; <code>sum(p.amount)</code> counts it 4 times, <code>count(*)</code> counts 4 “orders”. That is <strong>fan-out</strong> (lesson 6.4): joining the “one” side to a “many” side copies the one-side row, and any aggregate of a one-side column is multiplied. The tell is cheap — put <code>count(*)</code> next to <code>count(DISTINCT key)</code>:</p>
${code(Q.R4TELL)}
${out(O.R4TELL)}
<p>1.779 rows but only 713 payments: the grain is wrong, and the period total reads 1.240.593.000 đ — three times the truth.</p>
${details('Answer — R4 (aggregate first, then join)', code(Q.R4FIX) + out(O.R4FIX) + '<p>The subquery in FROM turns order_item into <strong>one row per order</strong> before the join, so the join cannot copy anything: revenue is back to R1 and the units add up to 3.528.</p>')}

${buoc('en', 'R5', 'the VIP list', 'Two filters, two places: the period is a condition on <em>rows</em> (WHERE, before grouping); “spent ≥ 4.000.000 and ≥ 5 orders” is a condition on <em>groups</em> (HAVING, after). <code>GROUP BY c.id</code> is enough to select <code>c.full_name</code>: id is the primary key, so PostgreSQL knows the name cannot vary inside the group.', ['R5'], 'Seven customers. Customer 60 spent 6.831.000 đ but in only 3 orders, and customer 240 has 6 orders but 3.687.000 đ — the AND keeps neither.')}
<div class="pitfall"><p><strong>Trap — an aggregate in WHERE.</strong> WHERE decides about one row at a time, before any group exists, so it cannot ask about <code>count(*)</code>:</p></div>
${out(O.R5X)}

${buoc('en', 'R6', 'order health by month', '<code>count(*) FILTER (WHERE status = \'cancelled\')</code> counts only the rows that pass its own little WHERE — one column per status in a single pass, no subqueries. Cancel rate = cancelled ÷ placed × 100.', ['R6'], 'August stands out: 12 cancellations of 98 orders, 12,2 %. That is the line the owner will ask about.')}
<div class="pitfall"><p><strong>Trap — integer division.</strong> <code>count(*)</code> returns bigint, and integer ÷ integer is integer in PostgreSQL: the decimals are dropped (not rounded). Write <code>100.0 *</code> so the division happens in numeric.</p></div>
${code(Q.R6X)}
${out(O.R6X)}
${details('Bonus — R6b, payment methods in one row', code(Q.R6B) + out(O.R6B) + '<p>cod + card + momo + bank = 411.147.000 — R0 once more. COD is used almost as often as MoMo (183 vs 184 payments) but brings in the least money: people pay cash for small orders.</p>')}

<h4>T1 — the report that changes when the server moves</h4>
<p><code>date_trunc('month', paid_at)</code> on a <code>timestamptz</code> uses the <em>session</em> TimeZone. The Docker image (and most cloud servers) run in UTC. Order 854 was paid at 00:48 on 1 February in Hà Nội — in a UTC session that instant prints as 31 January, 17:48:</p>
${code(Q.T1A)}
${out(O.T1A)}
<p>so a monthly report run in UTC puts it in January:</p>
${code(Q.T1X)}
${out(O.T1X)}
<p>Same data, same query, different months: 76 / 66 / 89 instead of 75 / 64 / 92. The fix is to name the time zone inside the query — <code>paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> converts the instant to Vietnamese wall-clock time first — so the report no longer depends on who runs it:</p>
${code(Q.T1)}
${out(O.T1)}

<h4>In a real Node app: Prisma groupBy vs raw SQL</h4>
<p>cuongthai.com runs PostgreSQL behind Prisma. <code>groupBy</code> is perfect for one table and plain columns; it cannot <code>date_trunc</code>, cannot join, cannot <code>count(DISTINCT)</code>. A report like R1 is written as raw SQL with <code>$queryRaw</code> — the tagged template sends <code>from</code>/<code>to</code> as parameters, never glued into the string. Two details bite every first-timer: <code>count(*)</code> is bigint and arrives as a JavaScript <code>BigInt</code> (which <code>JSON.stringify</code> refuses) — cast it <code>::int</code>; and <code>numeric</code> arrives as <code>Prisma.Decimal</code>.</p>
${code(PRISMA, 'ts')}

<h3>5 · Self-check — these numbers must match</h3>
${code([Q.SC1, Q.SC2, Q.SC3, Q.SC4].join('\n'))}
${out([O.SC1, O.SC2, O.SC3, O.SC4].join('\n\n'))}
<ol>
<li>R4’s wrong query shows a correct units column next to a revenue three times too high. Why is one right and the other wrong?</li>
<li>In R3b, why does moving <code>o.created_at &gt;= '2026-01-01'</code> from ON to WHERE change 30 into 0?</li>
<li>Why can <code>GROUP BY c.id</code> select <code>c.full_name</code> without listing it?</li>
</ol>
${details('Answers', `<ol><li><code>qty</code> lives on the “many” side (one value per order line), so each line is counted once. <code>amount</code> lives on the “one” side and is copied to every line of its order, so it is summed once per line.</li><li>WHERE runs after the join; on the “no match” rows the order columns are NULL, the condition is not true, and those rows — the very ones we want — are removed.</li><li><code>id</code> is the primary key, so every other column of customer is functionally dependent on it; PostgreSQL accepts them without GROUP BY or an aggregate.</li></ol>`)}

<h3>6 · Full solution</h3>
${details('Show the whole lab3-solution.sql', code(SOL))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>Joining a one-side amount to a many-side table, then summing</strong> — fan-out. Aggregate the many side to one row per key first, or put <code>count(*)</code> next to <code>count(DISTINCT key)</code> and look.</p></div>
<div class="pitfall"><p><strong>A condition on the right table of a LEFT JOIN placed in WHERE</strong> — the LEFT JOIN turns into an INNER JOIN. Conditions that describe <em>which right rows count</em> go into ON.</p></div>
<div class="pitfall"><p><strong>An aggregate in WHERE</strong> — ERROR. Row conditions in WHERE, group conditions in HAVING.</p></div>
<div class="pitfall"><p><strong>Integer division</strong> — <code>100 * a / b</code> with integers drops the decimals. Use <code>100.0 *</code>.</p></div>
<div class="pitfall"><p><strong>Month buckets in the server’s time zone</strong> — orders near midnight change month. Use <code>AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> in reports, or set the TimeZone explicitly.</p></div>
<div class="pitfall"><p><strong>Two dates, one report</strong> — by <code>created_at</code> January has 76 paid/shipped orders, by <code>paid_at</code> 75 (an order placed at 23:xx is paid after midnight). Neither is wrong; mixing them is. Write the chosen date on the report.</p></div>

<h3>8 · Next: Lab 4</h3>
<p>The owner liked the report and wants more: <strong>growth</strong> month over month and against last year, a <strong>running total</strong> for the year, the <strong>top 3 products of every category</strong>, each category’s <strong>share in %</strong>, and a category tree that still works when someone adds a third level. That is Lab 4, after Chapter 8 — CTEs and window functions, starting again from a clean CT Shop.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 3 · CT Shop · sau Chương 6</span>
<h2>Báo cáo 9 tháng cho buổi họp sáng thứ Hai</h2>
<p class="lead">CT Shop giờ đã đủ mọi thứ: dòng đơn, thanh toán, đánh giá. Tối thứ Sáu, chủ shop nhắn đúng một tin: <em>"Sáng thứ Hai 9 giờ họp tổng kết 9 tháng. Anh cần doanh thu từng tháng, danh mục nào ra tiền, khách nào cần gọi lại, danh sách VIP để tặng voucher, và bao nhiêu đơn bị huỷ."</em> Bạn dựng báo cáo đó bằng JOIN và GROUP BY — và gặp, bằng tiền thật, cái lỗi làm báo cáo trông hoàn hảo mà cao gấp ba sự thật.</p>

<h3>1 · Đề bài</h3>
<p>Bắt đầu từ một shop sạch: <code>lab3-start.sql</code> dựng lại lược đồ chuẩn kèm dữ liệu chuẩn (12 danh mục, 48 sản phẩm, 300 khách, 2.000 đơn, 5.000 dòng đơn, 1.663 thanh toán), nên Lab 1 và Lab 2 của bạn kết thúc thế nào cũng không sao. Hai quyết định mọi báo cáo thật phải ghi ra trước câu truy vấn đầu tiên:</p>
<ul>
<li><strong>Tính theo ngày nào?</strong> Tiền tính vào ngày được trả: <code>payment.paid_at</code>. Số đơn (R6) tính theo <code>orders.created_at</code>.</li>
<li><strong>Kỳ nào?</strong> 1/1 → 30/9/2026, luôn viết dạng khoảng nửa mở: <code>&gt;= '2026-01-01' AND &lt; '2026-10-01'</code> (Lab 2 đã cho thấy BETWEEN làm gì với ngày cuối).</li>
</ul>
<p>Công cụ: mọi thứ tới Chương 6 — JOIN, self-join, LEFT JOIN, GROUP BY, HAVING, FILTER, và một truy vấn con đã tổng hợp nằm trong FROM như bài 6.4. Hai thứ mới được giảng ngay ở đây: <code>NOT EXISTS</code> (Chương 7 học kỹ) và <code>AT TIME ZONE</code>.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>R0</strong> — quy mô của kỳ: số lần thanh toán và tổng doanh thu.</li>
<li><strong>R1</strong> — doanh thu theo tháng: số đơn, số người mua khác nhau, doanh thu, giá trị đơn trung bình (9 dòng).</li>
<li><strong>R2</strong> — doanh thu và số lượng theo danh mục con kèm danh mục gốc (self-join), rồi theo danh mục gốc — và các gốc phải cộng lại đúng bằng R0.</li>
<li><strong>R3</strong> — danh sách gọi lại: khách chưa từng đặt đơn (hai cách), khách không có đơn đã trả trong 2026, và 20 khách "rơi rụng" cần gọi.</li>
<li><strong>R4</strong> — thêm cột "số món bán" vào R1 mà <em>không</em> làm phồng doanh thu.</li>
<li><strong>R5</strong> — VIP: chi ít nhất 4.000.000 đ <strong>và</strong> có ít nhất 5 đơn đã trả trong kỳ.</li>
<li><strong>R6</strong> — sức khoẻ đơn hàng: mỗi tháng một dòng, mỗi trạng thái một cột, và tỷ lệ huỷ theo %.</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi</strong> con số của bạn là: 713 thanh toán · 411.147.000 đ · 4 danh mục gốc cộng lại đúng 411.147.000 · 3.528 món · 10 khách chưa từng đặt · 30 khách không mua trong 2026 · 7 VIP · 855 đơn được đặt · tỷ lệ huỷ tháng 8 là 12,2 %.</p></div>

<h3>3 · Tệp tải về và chuẩn bị</h3>
<div class="callout"><p><code>pgdemo</code> là tên container PostgreSQL 17 của <em>bạn</em>. Nếu bạn dựng theo bài 0.3 thì nó tên <code>pg17</code>: hoặc thay <code>pgdemo</code> bằng <code>pg17</code> trong mọi lệnh bên dưới, hoặc đổi tên một lần bằng <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(true)}
${out(SETUP)}
<p>Tệp start xoá rồi dựng lại schema <code>shop</code>; chạy một lần. Dữ liệu tất định (<code>setseed</code>), nên con số của bạn khớp y hệt bài — miễn là TimeZone cũng khớp (xem T1).</p>

<h3>4 · Dựng báo cáo từng bước</h3>
<p>Tự viết từng truy vấn, chạy, rồi mới so với đáp án. Trước khi tin bất kỳ con số tổng nào, hãy hỏi câu hỏi của lab này: <em>một dòng ở đây là cái gì?</em></p>

${buoc('vi', 'R0', 'quy mô của kỳ', 'Một bảng là đủ. Con số này là mỏ neo: mọi báo cáo phía sau phải khớp với nó.', ['R0'])}

${buoc('vi', 'R1', 'doanh thu theo tháng', '<code>date_trunc(\'month\', p.paid_at)</code> làm tròn mỗi thanh toán xuống ngày đầu tháng của nó (bài 2.3); <code>to_char(…, \'YYYY-MM\')</code> cho dễ đọc. Người mua nằm ở <code>orders</code>, nên nối payment → orders bằng <code>o.id = p.order_id</code>. <code>GROUP BY 1</code> = "gom theo cột thứ nhất".', ['R1'], 'Mỗi đơn một thanh toán (UNIQUE từ Lab 1), nên <code>count(*)</code> ở đây đúng là đếm đơn. 75 + 64 + … + 80 = 713 và cột doanh thu cộng lại được 411.147.000 — lại đúng R0. Tháng 3 cao nhất, tháng 2 và tháng 8 thấp nhất.')}

${buoc('vi', 'R2', 'danh mục nào ra tiền', 'Đường đi: payment → order_item → product → category. Sản phẩm trỏ vào danh mục <em>con</em>; danh mục gốc là dòng mà <code>c.parent_id</code> trỏ tới — nên nối <code>category</code> thêm lần nữa với một bí danh khác (self-join, bài 5.3). Doanh thu mỗi dòng = <code>qty * unit_price</code> (giá lúc mua, không phải giá hôm nay).', ['R2', 'R2B'], 'Máy tính cầm tay chỉ chiếm 6 món trong 48 sản phẩm nhưng mang về 55 % số tiền. Bảng gộp theo gốc là phép kiểm: 240.969.000 + 68.949.000 + 54.875.000 + 46.354.000 = 411.147.000, đúng bằng R0, mà tính từ một bảng khác. Hai báo cáo khớp nhau là bài kiểm rẻ nhất bạn từng viết. (Self-join chạy được chỉ vì cây đúng hai tầng — Lab 4 thay nó bằng truy vấn đệ quy chạy với mọi độ sâu.)')}

<h4>R3 — nên gọi lại cho ai?</h4>
<p class="meo">💡 "Khách <em>không có</em> đơn" là phép anti-join. LEFT JOIN giữ mọi khách; chỗ nào không khớp đơn nào thì các cột của đơn là NULL — nên <code>WHERE o.id IS NULL</code> giữ đúng những khách bên phải trống trơn.</p>
<p><strong>Mới: <code>NOT EXISTS</code>.</strong> Cùng câu hỏi, hỏi thẳng: "giữ khách c nếu <em>không tồn tại</em> dòng đơn nào có <code>customer_id = c.id</code>". SELECT bên trong chạy cho từng khách và chỉ trả lời có/không, nên <code>SELECT 1</code> là đủ. Nó không thể nhân dòng và đọc lên giống hệt câu đề bài. Chương 7 giải thích PostgreSQL thực thi nó thế nào.</p>
${details('Đáp án — R3a', code(Q.R3A) + out(O.R3A) + code(Q.R3A2) + out(O.R3A2) + '<p>Cả hai cách: khách 291–300, mười người đăng ký mà chưa từng đặt đơn.</p>')}
<p>Giờ là bản hữu ích hơn: khách <strong>không mua gì trong 2026</strong> (không có đơn paid hay shipped nào đặt từ 1/1). Các điều kiện thêm nói về <em>những đơn mình đang tìm</em>, nên chúng nằm trong <code>ON</code>:</p>
${details('Đáp án — R3b', code(Q.R3B) + out(O.R3B) + '<p>30 = 10 khách chưa từng đặt + 20 khách từng mua trước 2026 rồi ngừng.</p>')}
<div class="pitfall"><p><strong>Bẫy — điều kiện đặt ở WHERE.</strong> Chuyển cùng các điều kiện đó xuống WHERE thì đáp án thành 0. WHERE chạy <em>sau</em> phép nối: ở các dòng LEFT JOIN thêm vào cho "không khớp", <code>o.status</code> là NULL, <code>NULL IN (…)</code> không đúng, và tất cả bị vứt — LEFT JOIN lặng lẽ thành INNER JOIN, mà dòng của INNER JOIN thì không bao giờ có <code>o.id IS NULL</code>.</p></div>
${out(O.R3BX)}
${details('Đáp án — R3c, danh sách gọi (20 khách rơi rụng)', code(Q.R3C) + out(O.R3C) + '<p>Sắp theo lần mua gần nhất: khách rời đi hồi tháng 12 là dễ kéo lại nhất. Bốn người không có số điện thoại — sẽ nhận email thay vì cuộc gọi.</p>')}

<h4>R4 — "thêm số món bán vào R1" — bẫy fan-out</h4>
<p>Trông như sửa một dòng: nối thêm <code>order_item</code> rồi thêm <code>sum(oi.qty)</code>. Chạy thử trước khi đọc tiếp.</p>
${details('Nó trả về gì', code(Q.R4X) + out(O.R4X))}
<p>Tháng 3 nhảy từ 63.914.000 lên 204.918.000. Không có lỗi nào, con số nào trông cũng hợp lý — và cột số món còn đúng nữa. Nhìn các dòng thô của một đơn:</p>
${code(Q.R4RAW)}
${out(O.R4RAW)}
<p>Đơn 87 có 4 dòng, nên một lần thanh toán 832.000 đ của nó giờ xuất hiện 4 lần; <code>sum(p.amount)</code> cộng nó 4 lần, <code>count(*)</code> đếm thành 4 "đơn". Đó là <strong>fan-out</strong> (bài 6.4): nối phía "một" với phía "nhiều" thì dòng phía một bị sao chép, và mọi phép tổng hợp trên cột phía một bị nhân lên. Dấu hiệu rất rẻ — đặt <code>count(*)</code> cạnh <code>count(DISTINCT khoá)</code>:</p>
${code(Q.R4TELL)}
${out(O.R4TELL)}
<p>1.779 dòng mà chỉ có 713 thanh toán: độ mịn sai, và tổng của kỳ thành 1.240.593.000 đ — gấp ba sự thật.</p>
${details('Đáp án — R4 (tổng hợp trước, nối sau)', code(Q.R4FIX) + out(O.R4FIX) + '<p>Truy vấn con trong FROM biến order_item thành <strong>mỗi đơn một dòng</strong> trước khi nối, nên phép nối không sao chép được gì: doanh thu về đúng R1 và số món cộng lại được 3.528.</p>')}

${buoc('vi', 'R5', 'danh sách VIP', 'Hai bộ lọc, hai chỗ: kỳ báo cáo là điều kiện trên <em>dòng</em> (WHERE, trước khi gom); "chi ≥ 4.000.000 và ≥ 5 đơn" là điều kiện trên <em>nhóm</em> (HAVING, sau khi gom). <code>GROUP BY c.id</code> là đủ để SELECT được <code>c.full_name</code>: id là khoá chính, PostgreSQL biết tên không thể khác nhau trong cùng một nhóm.', ['R5'], 'Bảy khách. Khách 60 chi 6.831.000 đ nhưng chỉ trong 3 đơn, còn khách 240 có 6 đơn nhưng chỉ 3.687.000 đ — điều kiện AND không giữ ai trong hai người.')}
<div class="pitfall"><p><strong>Bẫy — hàm tổng hợp trong WHERE.</strong> WHERE quyết định từng dòng một, trước khi có nhóm nào, nên nó không thể hỏi về <code>count(*)</code>:</p></div>
${out(O.R5X)}

${buoc('vi', 'R6', 'sức khoẻ đơn hàng theo tháng', '<code>count(*) FILTER (WHERE status = \'cancelled\')</code> chỉ đếm các dòng qua được cái WHERE nhỏ của riêng nó — mỗi trạng thái một cột trong một lượt quét, không cần truy vấn con. Tỷ lệ huỷ = số huỷ ÷ số đặt × 100.', ['R6'], 'Tháng 8 nổi bật: 12 đơn huỷ trên 98 đơn, 12,2 %. Đó là dòng chủ shop sẽ hỏi.')}
<div class="pitfall"><p><strong>Bẫy — chia số nguyên.</strong> <code>count(*)</code> trả về bigint, mà số nguyên chia số nguyên trong PostgreSQL ra số nguyên: phần thập phân bị cắt bỏ (không làm tròn). Viết <code>100.0 *</code> để phép chia chạy bằng numeric.</p></div>
${code(Q.R6X)}
${out(O.R6X)}
${details('Thêm — R6b, các hình thức thanh toán trên một dòng', code(Q.R6B) + out(O.R6B) + '<p>cod + card + momo + bank = 411.147.000 — lại R0. COD được dùng gần nhiều bằng MoMo (183 so với 184 lượt) nhưng mang về ít tiền nhất: đơn nhỏ thì người ta trả tiền mặt.</p>')}

<h4>T1 — báo cáo đổi số khi đổi máy chủ</h4>
<p><code>date_trunc('month', paid_at)</code> trên cột <code>timestamptz</code> dùng TimeZone của <em>phiên</em>. Ảnh Docker (và phần lớn máy chủ cloud) chạy UTC. Đơn 854 được trả lúc 0 giờ 48 ngày 1/2 ở Hà Nội — trong phiên UTC, thời điểm đó in ra là 17 giờ 48 ngày 31/1:</p>
${code(Q.T1A)}
${out(O.T1A)}
<p>nên báo cáo tháng chạy ở UTC xếp nó vào tháng 1:</p>
${code(Q.T1X)}
${out(O.T1X)}
<p>Cùng dữ liệu, cùng câu truy vấn, khác tháng: 76 / 66 / 89 thay vì 75 / 64 / 92. Cách sửa là ghi rõ múi giờ ngay trong câu — <code>paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> đổi thời điểm đó sang giờ đồng hồ Việt Nam trước — để báo cáo không còn phụ thuộc ai chạy nó:</p>
${code(Q.T1)}
${out(O.T1)}

<h4>Trong app Node thật: Prisma groupBy hay SQL thô</h4>
<p>cuongthai.com chạy PostgreSQL phía sau Prisma. <code>groupBy</code> rất hợp với một bảng và cột thường; nó không <code>date_trunc</code> được, không nối được, không <code>count(DISTINCT)</code> được. Báo cáo kiểu R1 được viết bằng SQL thô với <code>$queryRaw</code> — template có gắn thẻ gửi <code>from</code>/<code>to</code> dưới dạng tham số, không bao giờ dán vào chuỗi. Hai chi tiết làm ai mới cũng vấp: <code>count(*)</code> là bigint nên tới JavaScript thành <code>BigInt</code> (mà <code>JSON.stringify</code> từ chối) — ép <code>::int</code>; còn <code>numeric</code> tới dưới dạng <code>Prisma.Decimal</code>.</p>
${code(PRISMA, 'ts')}

<h3>5 · Tự kiểm — các con số này phải khớp</h3>
${code([Q.SC1, Q.SC2, Q.SC3, Q.SC4].join('\n'))}
${out([O.SC1, O.SC2, O.SC3, O.SC4].join('\n\n'))}
<ol>
<li>Câu sai của R4 cho cột số món đúng nằm cạnh cột doanh thu cao gấp ba. Vì sao một cột đúng, một cột sai?</li>
<li>Ở R3b, vì sao chuyển <code>o.created_at &gt;= '2026-01-01'</code> từ ON xuống WHERE lại biến 30 thành 0?</li>
<li>Vì sao <code>GROUP BY c.id</code> SELECT được <code>c.full_name</code> mà không cần liệt kê nó?</li>
</ol>
${details('Đáp án', `<ol><li><code>qty</code> nằm ở phía "nhiều" (mỗi dòng đơn một giá trị), nên mỗi dòng được cộng đúng một lần. <code>amount</code> nằm ở phía "một" và bị chép sang mọi dòng của đơn, nên bị cộng một lần cho mỗi dòng.</li><li>WHERE chạy sau phép nối; ở các dòng "không khớp" thì cột của đơn là NULL, điều kiện không đúng, và chính các dòng mình cần bị loại.</li><li><code>id</code> là khoá chính, nên mọi cột khác của customer phụ thuộc hàm vào nó; PostgreSQL cho phép SELECT chúng mà không cần GROUP BY hay hàm tổng hợp.</li></ol>`)}

<h3>6 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab3-solution.sql', code(SOL))}

<h3>7 · Bẫy hay gặp</h3>
<div class="pitfall"><p><strong>Nối số tiền phía "một" với bảng phía "nhiều" rồi cộng</strong> — fan-out. Gộp phía nhiều về mỗi khoá một dòng trước, hoặc đặt <code>count(*)</code> cạnh <code>count(DISTINCT khoá)</code> mà nhìn.</p></div>
<div class="pitfall"><p><strong>Điều kiện trên bảng bên phải của LEFT JOIN đặt ở WHERE</strong> — LEFT JOIN thành INNER JOIN. Điều kiện mô tả <em>dòng bên phải nào được tính</em> thì nằm trong ON.</p></div>
<div class="pitfall"><p><strong>Hàm tổng hợp trong WHERE</strong> — ERROR. Điều kiện dòng ở WHERE, điều kiện nhóm ở HAVING.</p></div>
<div class="pitfall"><p><strong>Chia số nguyên</strong> — <code>100 * a / b</code> với số nguyên cắt mất phần thập phân. Dùng <code>100.0 *</code>.</p></div>
<div class="pitfall"><p><strong>Chia tháng theo múi giờ của máy chủ</strong> — đơn gần nửa đêm đổi tháng. Dùng <code>AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> trong báo cáo, hoặc đặt TimeZone rõ ràng.</p></div>
<div class="pitfall"><p><strong>Hai mốc ngày trong một báo cáo</strong> — theo <code>created_at</code> tháng 1 có 76 đơn paid/shipped, theo <code>paid_at</code> là 75 (đơn đặt lúc 23 giờ hơn được trả sau nửa đêm). Không cái nào sai; trộn hai cái mới sai. Ghi mốc ngày đã chọn lên báo cáo.</p></div>

<h3>8 · Tiếp theo: Lab 4</h3>
<p>Chủ shop thích báo cáo và muốn thêm: <strong>tăng trưởng</strong> so với tháng trước và so với cùng kỳ năm ngoái, <strong>tổng luỹ kế</strong> từ đầu năm, <strong>top 3 sản phẩm mỗi danh mục</strong>, <strong>tỷ trọng %</strong> của từng danh mục, và một cây danh mục vẫn chạy đúng khi ai đó thêm tầng thứ ba. Đó là Lab 4, sau Chương 8 — CTE và hàm cửa sổ, lại bắt đầu từ một CT Shop sạch.</p>
</div>
`;

export default {
  title: 'Lab 3 — CT Shop: the 9-month report (JOIN + GROUP BY)|||Lab 3 — CT Shop: báo cáo 9 tháng (JOIN + GROUP BY)',
  slug: 'postgresql-lab-3-bao-cao-doanh-thu-ct-shop',
  type: 'LESSON',
  description: 'Lab dự án CT Shop sau Chương 6: báo cáo 9 tháng 2026 cho buổi họp — doanh thu theo tháng (date_trunc), theo danh mục (JOIN 5 bảng + self-join, đối chiếu tổng 411.147.000 đ), khách chưa mua (LEFT JOIN … IS NULL vs NOT EXISTS, bẫy điều kiện ở WHERE), bẫy fan-out (doanh thu phồng gấp 3 thành 1,24 tỷ, sửa bằng gộp trước), VIP bằng HAVING, sức khoẻ đơn bằng FILTER, bẫy chia số nguyên và múi giờ UTC; Prisma groupBy vs $queryRaw. Output thật PostgreSQL 17.',
  content: `${G}${EN}${VI}`,
};
