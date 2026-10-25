/**
 * Lab 2 — CT Shop: đổ dữ liệu, đặt câu hỏi (sau Chương 4). Agent lab, 25/10/2026.
 * Chèn vào Chương 4 bằng lab/index.mjs (LAB_SAU[4]) — sau bài 4.4, trước quiz.
 * Chỉ dùng kiến thức tới Ch4 (mỗi truy vấn một bảng; JOIN để Lab 3). COPY/\copy, EXCLUDED, keyset giảng mới ngay trong lab.
 * Mọi output = chạy thật PostgreSQL 17.11 (lab2-solution.sql chạy bằng psql -f trên lược đồ rỗng). Tệp tải về: R2 files/academy/PG/labs/v1/.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-2.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s) => `<pre><code class="language-sql">${esc(s).split('\n').map((l) => l.replace(/(--.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Output THẬT (PostgreSQL 17.11) — sinh từ lab2-solution.sql chạy bằng psql -f; bẫy COPY chạy trong schema nháp lab2trap. */
const O = {
  S1: ` id |      name
----+-----------------
  1 | Bút & mực
  2 | Vở & giấy
  3 | Dụng cụ học tập
  4 | Sách & tài liệu
(4 rows)

INSERT 0 4`,
  S2: ` id |       name       | parent_id
----+------------------+-----------
  5 | Bút bi           |         1
  6 | Bút chì & tẩy    |         1
  7 | Bút dạ quang     |         1
  8 | Vở ô ly          |         2
  9 | Sổ tay           |         2
 10 | Máy tính cầm tay |         3
 11 | Thước & compa    |         3
 12 | Giáo trình IT    |         4
(8 rows)

INSERT 0 8`,
  S35: `COPY 48
COPY 300
 min | max | count
-----+-----+-------
   1 | 300 |   300
(1 row)

COPY 2000`,
  S6: `CREATE TABLE
COPY 6
 id |  sku   |   price   | stock
----+--------+-----------+-------
 31 | CT1001 | 720000.00 |   277
 32 | CT1002 | 489000.00 |   202
 14 | CT0702 |  23000.00 |   186
 24 | CT0806 |  15000.00 |   271
 53 | CT0507 |   6000.00 |   300
 54 | CT1207 | 119000.00 |    40
(6 rows)

INSERT 0 6
DROP TABLE
 products | total_stock
----------+-------------
       50 |        8129
(1 row)`,
  Q1: `  sku   |               name                |   price
--------+-----------------------------------+-----------
 CT1004 | Máy tính Casio FX-880BTG          | 790000.00
 CT1001 | Máy tính Casio FX-580VN X         | 720000.00
 CT1002 | Máy tính Casio FX-570VN Plus      | 489000.00
 CT1005 | Máy tính Casio MX-12B (văn phòng) | 195000.00
(4 rows)`,
  Q2: `  sku   |              name               |  price
--------+---------------------------------+---------
 CT0601 | Bút chì gỗ Thiên Long 2B GP-01  | 4000.00
 CT0501 | Bút bi Thiên Long TL-027 (xanh) | 5000.00
 CT1101 | Thước kẻ nhựa Thiên Long 20cm   | 5000.00
 CT0507 | Bút bi Thiên Long TL-095 (xanh) | 6000.00
 CT0801 | Vở ô ly Hồng Hà 48 trang        | 6000.00
 CT0701 | Bút dạ quang Thiên Long HL-03   | 7000.00
 CT0604 | Tẩy Pentel Hi-Polymer           | 9000.00
 CT0704 | Bút dạ quang hai đầu Deli       | 9000.00
(8 rows)`,
  Q3: `  sku   |                  name                  | stock
--------+----------------------------------------+-------
 CT1207 | Giáo trình PostgreSQL từ số 0 (bản in) |    40
 CT0704 | Bút dạ quang hai đầu Deli              |    54
 CT0502 | Bút bi Thiên Long TL-079 (hộp 20 cây)  |    62
 CT0601 | Bút chì gỗ Thiên Long 2B GP-01         |    66
 CT1004 | Máy tính Casio FX-880BTG               |    79
(5 rows)`,
  Q4: `  sku   |                name                |  price
--------+------------------------------------+----------
 CT0506 | Bút bi bấm Deli 0.7mm (hộp 12 cây) | 45000.00
 CT0602 | Bút chì kim Pentel A255 0.5mm      | 32000.00
 CT0504 | Bút gel Uni-ball Signo 0.5mm       | 28000.00
 CT0505 | Bút gel Zebra Sarasa Clip 0.5mm    | 24000.00
 CT0702 | Bút dạ quang Stabilo Boss Original | 23000.00
(5 rows)`,
  Q5: ` id  |   full_name    |  city
-----+----------------+---------
  21 | Vũ Quốc Bình   | Đà Nẵng
  49 | Trần Thị Trang | Đà Nẵng
  70 | Đặng Thu An    | Đà Nẵng
  91 | Phạm Thị Bình  | Đà Nẵng
 161 | Trần Gia Bình  | Đà Nẵng
 231 | Bùi Quốc Bình  | Đà Nẵng
 259 | Phạm Thị Trang | Đà Nẵng
 273 | Trần Quốc Dũng | Đà Nẵng
(8 rows)`,
  Q6: ` count
-------
   137
(1 row)

 count
-------
   179
(1 row)`,
  Q7: ` count
-------
    91
(1 row)

 count
-------
    95
(1 row)`,
  Q8: ` count
-------
   170
(1 row)

  id  | customer_id |       created_at
------+-------------+------------------------
  622 |         285 | 2025-01-01 16:52:00+07
  995 |         133 | 2025-01-06 23:37:00+07
  800 |         183 | 2025-01-07 06:35:00+07
 1953 |         137 | 2025-01-17 07:48:00+07
  956 |         175 | 2025-01-20 22:53:00+07
(5 rows)`,
  Q9: ` customer_id | last_order | status  |       created_at
-------------+------------+---------+------------------------
           1 |        335 | shipped | 2026-09-29 06:39:00+07
           2 |        287 | shipped | 2026-02-26 00:47:00+07
           3 |       1852 | shipped | 2026-08-29 07:52:00+07
           4 |       1408 | paid    | 2026-07-12 20:45:00+07
           5 |        250 | shipped | 2026-07-17 07:58:00+07
(5 rows)`,
  Q10: `  id  | customer_id |  status   |       created_at
------+-------------+-----------+------------------------
 1706 |          58 | paid      | 2026-09-26 14:02:00+07
  471 |         110 | shipped   | 2026-09-26 12:46:00+07
 1832 |          34 | shipped   | 2026-09-25 19:56:00+07
 1570 |         168 | shipped   | 2026-09-25 19:51:00+07
 1383 |          33 | paid      | 2026-09-25 07:30:00+07
 1840 |         135 | cancelled | 2026-09-25 03:28:00+07
 1229 |         211 | pending   | 2026-09-25 02:20:00+07
  798 |         104 | shipped   | 2026-09-24 20:05:00+07
  116 |         201 | paid      | 2026-09-23 11:20:00+07
 1316 |         225 | paid      | 2026-09-23 06:15:00+07
(10 rows)

  id  | customer_id |  status   |       created_at
------+-------------+-----------+------------------------
 1706 |          58 | paid      | 2026-09-26 14:02:00+07
  471 |         110 | shipped   | 2026-09-26 12:46:00+07
 1832 |          34 | shipped   | 2026-09-25 19:56:00+07
 1570 |         168 | shipped   | 2026-09-25 19:51:00+07
 1383 |          33 | paid      | 2026-09-25 07:30:00+07
 1840 |         135 | cancelled | 2026-09-25 03:28:00+07
 1229 |         211 | pending   | 2026-09-25 02:20:00+07
  798 |         104 | shipped   | 2026-09-24 20:05:00+07
  116 |         201 | paid      | 2026-09-23 11:20:00+07
 1316 |         225 | paid      | 2026-09-23 06:15:00+07
(10 rows)`,
  U1: `BEGIN
  sku   |   price
--------+-----------
 CT1201 |  93450.00
 CT1202 |  99750.00
 CT1203 | 187950.00
 CT1204 |  61950.00
 CT1205 | 131250.00
 CT1206 |  51450.00
 CT1207 | 124950.00
(7 rows)

UPDATE 7
ROLLBACK
  sku   |  price
--------+----------
 CT1201 | 89000.00
(1 row)`,
  U2: `BEGIN
UPDATE 50
 empty_shelves
---------------
            50
(1 row)

ROLLBACK
 empty_shelves
---------------
             0
(1 row)`,
  U3: `psql:/tmp/lab2-solution.sql:113: ERROR:  new row for relation "product" violates check constraint "product_price_check"
DETAIL:  Failing row contains (1, CT0501, Bút bi Thiên Long TL-027 (xanh), 5, 0.00, 198, {"tags": ["văn phòng"], "brand": "Thiên Long", "color": "đen..., t, 2025-01-02 08:00:00+07).
  sku   |  price
--------+----------
 CT0501 |  5000.00
 CT0502 | 78000.00
 CT0503 | 12000.00
 CT0504 | 28000.00
 CT0505 | 24000.00
 CT0506 | 45000.00
 CT0507 |  6000.00
(7 rows)`,
  U4: `BEGIN
UPDATE 170
 still_pending
---------------
            10
(1 row)

COMMIT`,
  U5: `BEGIN
 id  |      email
-----+-----------------
 300 | kh300@ctshop.vn
(1 row)

DELETE 1
psql:/tmp/lab2-solution.sql:126: ERROR:  update or delete on table "customer" violates foreign key constraint "orders_customer_id_fkey" on table "orders"
DETAIL:  Key (id)=(1) is still referenced from table "orders".
psql:/tmp/lab2-solution.sql:127: ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK
 customers
-----------
       300
(1 row)`,
  SELF: ` products | total_stock | max_id
----------+-------------+--------
       50 |        8129 |     54
(1 row)

 customers
-----------
       300
(1 row)

 orders
--------
   2000
(1 row)

 pending
---------
      10
(1 row)

 cancelled
-----------
       327
(1 row)`,
  COPYERR: `ERROR:  could not open file "/Users/an/Downloads/lab2-products.csv" for reading: No such file or directory
HINT:  COPY FROM instructs the PostgreSQL server process to read a file. You may want a client-side facility such as psql's \\copy.`,
  TRAP: `ERROR:  new row for relation "customer" violates check constraint "customer_email_check"
DETAIL:  Failing row contains (1, Trần Thị Bình, kh001@ctshop.vn, 0910007919, Cần Thơ, 2026-02-14 08:00:00+07).
CONTEXT:  COPY customer, line 2: "kh001@ctshop.vn,Trần Thị Bình,0910007919,Cần Thơ,2026-02-14 08:00:00+07"
 count
-------
     0
(1 row)

COPY 300
 min | max | count
-----+-----+-------
   2 | 301 |   300
(1 row)

ERROR:  insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"
DETAIL:  Key (customer_id)=(1) is not present in table "customer".
TRUNCATE TABLE
COPY 300
 min | max | count
-----+-----+-------
   1 | 300 |   300
(1 row)

COPY 2000`,
};

/* Toàn văn lab2-solution.sql (trùng tệp tải về). */
const SOL = `-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 2 — SOLUTION: load the data, answer 10 questions, change data safely
-- Lab 2 — ĐÁP ÁN: nạp dữ liệu, trả lời 10 câu hỏi, sửa dữ liệu an toàn
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- Needs: lab2-start.sql already run (empty schema) + the 4 CSV files in the container's /tmp/.
--   docker cp lab2-solution.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab2-solution.sql
-- Every number in the comments is the real output on PostgreSQL 17.
-- Mọi con số trong chú thích là output thật trên PostgreSQL 17.
-- ═══════════════════════════════════════════════════════════════════════════
\\pset pager off
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';

-- ── S1 · root categories: one multi-row INSERT, RETURNING shows the ids we need next ──
INSERT INTO category (name)
VALUES ('Bút & mực'), ('Vở & giấy'), ('Dụng cụ học tập'), ('Sách & tài liệu')
RETURNING id, name;                                   -- ids 1..4

-- ── S2 · sub-categories point to the parent ids from S1 ──
INSERT INTO category (name, parent_id)
VALUES ('Bút bi', 1), ('Bút chì & tẩy', 1), ('Bút dạ quang', 1),
       ('Vở ô ly', 2), ('Sổ tay', 2),
       ('Máy tính cầm tay', 3), ('Thước & compa', 3),
       ('Giáo trình IT', 4)
RETURNING id, name, parent_id;                        -- ids 5..12

-- ── S3–S5 · bulk load with \\copy — parents before children (category → product, customer → orders) ──
\\copy product (sku, name, category_id, price, stock, attrs, is_active, created_at) FROM '/tmp/lab2-products.csv' WITH (FORMAT csv, HEADER true)
\\copy customer (email, full_name, phone, city, created_at) FROM '/tmp/lab2-customers.csv' WITH (FORMAT csv, HEADER true)
-- orders.csv says "customer_id = 61": that only means the right person if customers got ids 1..300
SELECT min(id), max(id), count(*) FROM customer;      -- 1 | 300 | 300
\\copy orders (customer_id, status, created_at, note) FROM '/tmp/lab2-orders.csv' WITH (FORMAT csv, HEADER true)

-- ── S6 · supplier price list: stage it, then UPSERT by sku ──
CREATE TABLE price_update (
  sku          text PRIMARY KEY,
  name         text NOT NULL,
  category_id  int  NOT NULL,
  price        numeric(12,2) NOT NULL,
  stock        int  NOT NULL                          -- units delivered today
);
\\copy price_update FROM '/tmp/lab2-price-update.csv' WITH (FORMAT csv, HEADER true)
INSERT INTO product (sku, name, category_id, price, stock)
SELECT sku, name, category_id, price, stock FROM price_update
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price,                         -- EXCLUDED = the row that tried to come in
      stock = product.stock + EXCLUDED.stock          -- add the delivery to what is on the shelf
RETURNING id, sku, price, stock;                      -- 4 updated (ids ≤ 48) + 2 new (ids 53, 54)
DROP TABLE price_update;
SELECT count(*) AS products, sum(stock) AS total_stock FROM product;   -- 50 | 8129

-- ════════════════════ Ten questions (one table each — JOINs come in Lab 3) ════════════════════
-- Q1 · every Casio item, most expensive first (4 rows)
SELECT sku, name, price FROM product WHERE name ILIKE '%casio%' ORDER BY price DESC;

-- Q2 · everything under 10.000 đ, cheapest first, ties by sku (8 rows)
SELECT sku, name, price FROM product WHERE price < 10000 ORDER BY price, sku;

-- Q3 · low-stock alert: active products with fewer than 80 units (5 rows)
SELECT sku, name, stock FROM product WHERE stock < 80 AND is_active ORDER BY stock, sku;

-- Q4 · pens & pencils (categories 5, 6, 7) priced 20.000–50.000 đ (5 rows)
SELECT sku, name, price FROM product
WHERE category_id IN (5, 6, 7) AND price BETWEEN 20000 AND 50000
ORDER BY price DESC, sku;

-- Q5 · customers in Đà Nẵng who left no phone number (8 rows)
SELECT id, full_name, city FROM customer WHERE city = 'Đà Nẵng' AND phone IS NULL ORDER BY id;

-- Q6 · customers the 09x SMS gateway cannot reach (no 09 number) — NULL trap
SELECT count(*) FROM customer WHERE phone NOT LIKE '09%';                     -- 137  ✗ forgets NULL phones
SELECT count(*) FROM customer WHERE phone NOT LIKE '09%' OR phone IS NULL;    -- 179  ✓

-- Q7 · orders placed in September 2026 — use a half-open range
SELECT count(*) FROM orders WHERE created_at BETWEEN '2026-09-01' AND '2026-09-30';     -- 91 ✗ stops at 30/09 00:00
SELECT count(*) FROM orders WHERE created_at >= '2026-09-01' AND created_at < '2026-10-01';  -- 95 ✓

-- Q8 · stale orders: still pending and created before 1 September 2026
SELECT count(*) FROM orders WHERE status = 'pending' AND created_at < '2026-09-01';     -- 170
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending' AND created_at < '2026-09-01'
ORDER BY created_at, id LIMIT 5;

-- Q9 · the latest order of customers 1–5 (DISTINCT ON keeps the first row per customer)
SELECT DISTINCT ON (customer_id) customer_id, id AS last_order, status, created_at
FROM orders WHERE customer_id IN (1, 2, 3, 4, 5)
ORDER BY customer_id, created_at DESC;

-- Q10 · newest orders, page 3 with 10 per page — OFFSET, then keyset (same 10 rows)
SELECT id, customer_id, status, created_at FROM orders
ORDER BY created_at DESC, id DESC LIMIT 10 OFFSET 20;
SELECT id, customer_id, status, created_at FROM orders            -- last row of page 2: (2026-09-26 16:54+07, 1522)
WHERE (created_at, id) < ('2026-09-26 16:54:00+07', 1522)
ORDER BY created_at DESC, id DESC LIMIT 10;

-- ════════════════════ Changing data safely ════════════════════
-- U1 · rehearse a 5 % price rise on IT books: look at RETURNING, then throw it away
BEGIN;
UPDATE product SET price = price * 1.05 WHERE category_id = 12 RETURNING sku, price;   -- 7 rows
ROLLBACK;
SELECT sku, price FROM product WHERE sku = 'CT1201';                           -- back to 89000.00

-- U2 · the forgotten WHERE — caught because we were inside a transaction
BEGIN;
UPDATE product SET stock = 0;                                                  -- UPDATE 50 (!)
SELECT count(*) AS empty_shelves FROM product WHERE stock = 0;                 -- 50
ROLLBACK;
SELECT count(*) AS empty_shelves FROM product WHERE stock = 0;                 -- 0

-- U3 · a constraint is a safety net: one bad row stops the WHOLE statement
UPDATE product SET price = price - 5000 WHERE category_id = 5;                 -- ERROR product_price_check
SELECT sku, price FROM product WHERE category_id = 5 ORDER BY sku;             -- nothing changed

-- U4 · cancel the 170 stale orders from Q8 — for real this time
BEGIN;
UPDATE orders SET status = 'cancelled', note = 'auto-cancel: pending > 30 days'
WHERE status = 'pending' AND created_at < '2026-09-01';                        -- UPDATE 170
SELECT count(*) AS still_pending FROM orders WHERE status = 'pending';         -- 10
COMMIT;

-- U5 · delete with RETURNING; an error inside a transaction poisons it until ROLLBACK
BEGIN;
DELETE FROM customer WHERE id = 300 RETURNING id, email;                       -- 1 row: no orders, allowed
DELETE FROM customer WHERE id = 1;                                             -- ERROR orders_customer_id_fkey
SELECT count(*) FROM customer;                                                 -- ERROR current transaction is aborted
ROLLBACK;
SELECT count(*) AS customers FROM customer;                                    -- 300

-- ════════════════════ Self-check: these numbers must match ════════════════════
SELECT count(*) AS products, sum(stock) AS total_stock, max(id) AS max_id FROM product;   -- 50 | 8129 | 54
SELECT count(*) AS customers FROM customer;                                               -- 300
SELECT count(*) AS orders FROM orders;                                                    -- 2000
SELECT count(*) AS pending FROM orders WHERE status = 'pending';                          -- 10
SELECT count(*) AS cancelled FROM orders WHERE status = 'cancelled';                      -- 327`;

/* Câu SQL từng bước (trùng lab2-solution.sql). */
const Q = {
  S1: `INSERT INTO category (name)
VALUES ('Bút & mực'), ('Vở & giấy'), ('Dụng cụ học tập'), ('Sách & tài liệu')
RETURNING id, name;`,
  S2: `INSERT INTO category (name, parent_id)
VALUES ('Bút bi', 1), ('Bút chì & tẩy', 1), ('Bút dạ quang', 1),
       ('Vở ô ly', 2), ('Sổ tay', 2),
       ('Máy tính cầm tay', 3), ('Thước & compa', 3),
       ('Giáo trình IT', 4)
RETURNING id, name, parent_id;`,
  S35: `\\copy product (sku, name, category_id, price, stock, attrs, is_active, created_at) FROM '/tmp/lab2-products.csv' WITH (FORMAT csv, HEADER true)
\\copy customer (email, full_name, phone, city, created_at) FROM '/tmp/lab2-customers.csv' WITH (FORMAT csv, HEADER true)
SELECT min(id), max(id), count(*) FROM customer;      -- must be 1 | 300 | 300
\\copy orders (customer_id, status, created_at, note) FROM '/tmp/lab2-orders.csv' WITH (FORMAT csv, HEADER true)`,
  S6: `CREATE TABLE price_update (
  sku          text PRIMARY KEY,
  name         text NOT NULL,
  category_id  int  NOT NULL,
  price        numeric(12,2) NOT NULL,
  stock        int  NOT NULL                  -- units delivered today
);
\\copy price_update FROM '/tmp/lab2-price-update.csv' WITH (FORMAT csv, HEADER true)
INSERT INTO product (sku, name, category_id, price, stock)
SELECT sku, name, category_id, price, stock FROM price_update
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price,                 -- EXCLUDED = the row that tried to come in
      stock = product.stock + EXCLUDED.stock  -- add the delivery to what is on the shelf
RETURNING id, sku, price, stock;
DROP TABLE price_update;
SELECT count(*) AS products, sum(stock) AS total_stock FROM product;`,
  Q1: `SELECT sku, name, price FROM product WHERE name ILIKE '%casio%' ORDER BY price DESC;`,
  Q2: `SELECT sku, name, price FROM product WHERE price < 10000 ORDER BY price, sku;`,
  Q3: `SELECT sku, name, stock FROM product WHERE stock < 80 AND is_active ORDER BY stock, sku;`,
  Q4: `SELECT sku, name, price FROM product
WHERE category_id IN (5, 6, 7) AND price BETWEEN 20000 AND 50000
ORDER BY price DESC, sku;`,
  Q5: `SELECT id, full_name, city FROM customer WHERE city = 'Đà Nẵng' AND phone IS NULL ORDER BY id;`,
  Q6: `SELECT count(*) FROM customer WHERE phone NOT LIKE '09%';                     -- ✗ forgets NULL phones
SELECT count(*) FROM customer WHERE phone NOT LIKE '09%' OR phone IS NULL;    -- ✓`,
  Q7: `SELECT count(*) FROM orders WHERE created_at BETWEEN '2026-09-01' AND '2026-09-30';        -- ✗
SELECT count(*) FROM orders WHERE created_at >= '2026-09-01' AND created_at < '2026-10-01';  -- ✓`,
  Q8: `SELECT count(*) FROM orders WHERE status = 'pending' AND created_at < '2026-09-01';
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending' AND created_at < '2026-09-01'
ORDER BY created_at, id LIMIT 5;`,
  Q9: `SELECT DISTINCT ON (customer_id) customer_id, id AS last_order, status, created_at
FROM orders WHERE customer_id IN (1, 2, 3, 4, 5)
ORDER BY customer_id, created_at DESC;`,
  Q10: `SELECT id, customer_id, status, created_at FROM orders
ORDER BY created_at DESC, id DESC LIMIT 10 OFFSET 20;
-- keyset: the last row of page 2 was (2026-09-26 16:54+07, id 1522)
SELECT id, customer_id, status, created_at FROM orders
WHERE (created_at, id) < ('2026-09-26 16:54:00+07', 1522)
ORDER BY created_at DESC, id DESC LIMIT 10;`,
  U1: `BEGIN;
UPDATE product SET price = price * 1.05 WHERE category_id = 12 RETURNING sku, price;
ROLLBACK;
SELECT sku, price FROM product WHERE sku = 'CT1201';`,
  U2: `BEGIN;
UPDATE product SET stock = 0;                                  -- no WHERE!
SELECT count(*) AS empty_shelves FROM product WHERE stock = 0;
ROLLBACK;
SELECT count(*) AS empty_shelves FROM product WHERE stock = 0;`,
  U3: `UPDATE product SET price = price - 5000 WHERE category_id = 5;
SELECT sku, price FROM product WHERE category_id = 5 ORDER BY sku;`,
  U4: `BEGIN;
UPDATE orders SET status = 'cancelled', note = 'auto-cancel: pending > 30 days'
WHERE status = 'pending' AND created_at < '2026-09-01';
SELECT count(*) AS still_pending FROM orders WHERE status = 'pending';
COMMIT;`,
  U5: `BEGIN;
DELETE FROM customer WHERE id = 300 RETURNING id, email;
DELETE FROM customer WHERE id = 1;
SELECT count(*) FROM customer;
ROLLBACK;
SELECT count(*) AS customers FROM customer;`,
  SELF: `SELECT count(*) AS products, sum(stock) AS total_stock, max(id) AS max_id FROM product;
SELECT count(*) AS customers FROM customer;
SELECT count(*) AS orders FROM orders;
SELECT count(*) AS pending FROM orders WHERE status = 'pending';
SELECT count(*) AS cancelled FROM orders WHERE status = 'cancelled';`,
};

const SETUP = `$ for f in lab2-products.csv lab2-customers.csv lab2-orders.csv lab2-price-update.csv; do docker cp $f pgdemo:/tmp/; done
$ docker exec -i pgdemo psql -U postgres -d ctshop < lab2-start.sql
$ docker exec -it pgdemo psql -U postgres -d ctshop
ctshop=# SET search_path = shop;
ctshop=# SET TimeZone = 'Asia/Ho_Chi_Minh';`;

const CSV_HEAD = `sku,name,category_id,price,stock,attrs,is_active,created_at
CT0501,Bút bi Thiên Long TL-027 (xanh),5,5000.00,198,"{""tags"": [""văn phòng""], ""brand"": ""Thiên Long"", ""color"": ""đen""}",t,2025-01-02 08:00:00+07

email,full_name,phone,city,created_at
kh006@ctshop.vn,Đặng Văn Linh,0980047514,Hải Phòng,2025-11-03 08:00:00+07
kh007@ctshop.vn,Bùi Thị Nam,,Hải Phòng,2025-08-08 08:00:00+07`;

const FILES = (vi) => [
  [`${F}/lab2-start.sql`, '🧩', 'lab2-start.sql', vi ? 'Lược đồ chuẩn RỖNG (= đáp án Lab 1) + danh sách việc S1–U5' : 'The EMPTY standard schema (= Lab 1 solution) + the S1–U5 to-do list'],
  [`${F}/lab2-products.csv`, '📦', 'lab2-products.csv', vi ? '48 sản phẩm: sku, tên, danh mục, giá, tồn kho, attrs (JSON), đang bán, ngày tạo' : '48 products: sku, name, category, price, stock, attrs (JSON), active, created_at'],
  [`${F}/lab2-customers.csv`, '👥', 'lab2-customers.csv', vi ? '300 khách (42 khách không để lại số điện thoại)' : '300 customers (42 left no phone number)'],
  [`${F}/lab2-orders.csv`, '🧾', 'lab2-orders.csv', vi ? '2.000 đơn, 01/2025 → 01/10/2026' : '2,000 orders, 01/2025 → 01/10/2026'],
  [`${F}/lab2-price-update.csv`, '🏷️', 'lab2-price-update.csv', vi ? 'Bảng giá mới của nhà cung cấp: 4 sku đã có + 2 sản phẩm mới' : 'The supplier’s new price list: 4 known skus + 2 new products'],
  [`${F}/lab2-solution.sql`, '🔑', 'lab2-solution.sql', vi ? 'Mọi bước, mọi đáp án, output thật trong chú thích — mở sau khi tự làm' : 'Every step, every answer, real output in the comments — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

/** Một câu hỏi: đề + gợi ý + đáp án ẩn (SQL + output thật). */
const hoi = (k, lang, de, goiY, sau = '') => `<h4>${k} — ${de}</h4>
${goiY ? `<p class="meo">💡 ${goiY}</p>` : ''}
${details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, code(Q[k]) + out(O[k]) + (sau ? `<p>${sau}</p>` : ''))}`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 2 · CT Shop · after Chapter 4</span>
<h2>Fill the shop, ask it questions</h2>
<p class="lead">Lab 1 gave CT Shop a strict but empty schema. Today is launch day: the owner exports the old spreadsheet as CSV, a supplier sends a new price list, and the team starts asking questions. You will load everything the way real projects do (<code>INSERT … RETURNING</code>, <code>\\copy</code>, an UPSERT), answer ten business questions with real numbers, and change data without ever losing a row by accident.</p>

<h3>1 · The brief</h3>
<p>Everything happens in the standard schema <code>shop</code> from Lab 1 — run <code>lab2-start.sql</code> to get it empty and clean. Only Chapter 4 tools are allowed: every query reads <strong>one table</strong> (when you need another table, use the ids you already know with <code>IN</code>). JOINs arrive in Lab 3. Three tools are new and explained right here: <code>\\copy</code>, <code>EXCLUDED</code> in an UPSERT, and keyset pagination.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>S1–S2</strong> — the 12 categories with two multi-row INSERTs, using <code>RETURNING</code> to learn the parent ids.</li>
<li><strong>S3–S5</strong> — load products, customers and orders from CSV with <code>\\copy</code>, parents before children, checking the customer ids before loading orders.</li>
<li><strong>S6</strong> — apply the supplier price list with <strong>one</strong> <code>INSERT … ON CONFLICT (sku) DO UPDATE</code>: new price, stock added to the shelf, new skus inserted.</li>
<li><strong>Q1–Q10</strong> — answer the ten questions below; each answer must match the real output.</li>
<li><strong>U1–U5</strong> — every UPDATE/DELETE inside <code>BEGIN</code>, checked (RETURNING or a count) before <code>COMMIT</code> or <code>ROLLBACK</code>.</li>
</ol>
<div class="callout ok"><p><strong>You pass when</strong> the self-check in section 6 prints: 50 products · total stock 8129 · max id 54 · 300 customers · 2000 orders · 10 pending · 327 cancelled.</p></div>

<h3>3 · Downloads and setup</h3>
${FILES(false)}
${out(SETUP)}
<p>psql on your own machine? Use the local path of each CSV in <code>\\copy</code> instead of <code>/tmp/…</code>. Why the TimeZone line: the CSV times carry <code>+07</code>, the Docker image runs in UTC; with the same TimeZone as this lesson your outputs and date filters match ours exactly.</p>

<h3>4 · Load the data, step by step</h3>
<h4>S1–S2 — categories: multi-row INSERT + RETURNING</h4>
<p>Twelve rows are too few for a file. Insert the 4 roots in one statement and let <code>RETURNING</code> show their ids; those ids become the <code>parent_id</code> of the 8 sub-categories.</p>
${details('Solution — S1', code(Q.S1) + out(O.S1))}
${details('Solution — S2', code(Q.S2) + out(O.S2))}
<h4>COPY or \\copy?</h4>
<p><code>COPY … FROM 'path'</code> is run by the <em>server</em>, which looks for the path on its own disk. Your CSV sits on your laptop (or in the container where psql runs), so the server answers:</p>
${out(O.COPYERR)}
<p><code>\\copy</code> is psql’s client-side version: psql reads the file and streams the rows over the connection (it uses <code>COPY … FROM STDIN</code> under the hood). Same options, written on <strong>one line</strong>, no semicolon. A CSV quick guide: <code>HEADER true</code> skips the first line; a field containing commas is wrapped in double quotes and a quote inside is doubled (that is how a JSON object fits into <code>attrs</code>); an empty unquoted field (<code>,,</code>) becomes NULL.</p>
${out(CSV_HEAD)}
<h4>S3–S5 — three \\copy, parents first</h4>
<p>Load product (its parent, category, is ready), then customer, then <strong>check the customer ids</strong>, then orders. The orders file refers to customers by number, so “customer 61” is only the right person if customers got ids 1…300.</p>
${details('Solution — S3–S5', code(Q.S35) + out(O.S35))}
<div class="pitfall"><p><strong>Trap — a failed COPY still burns identity numbers.</strong> Below, the first attempt listed the columns in the wrong order: the name landed in <code>email</code> and the CHECK rejected line 2. COPY is all-or-nothing, so 0 rows were loaded — but the identity value was already taken. The corrected COPY produced ids 2…301, and the orders file then failed on customer 1. Fix: <code>TRUNCATE customer, orders RESTART IDENTITY;</code> and load again. (Real run in a scratch schema.)</p></div>
${out(O.TRAP)}
<h4>S6 — the supplier’s price list: UPSERT</h4>
<p>Load the 6 lines into a staging table, then one <code>INSERT … SELECT … ON CONFLICT (sku) DO UPDATE</code>. Inside <code>DO UPDATE</code>, <code>EXCLUDED</code> is the row that tried to come in and <code>product</code> is the row already on the shelf: take the new price, <em>add</em> the delivered units. Before S6 the four known skus were CT0702 22000/86, CT0806 15000/71, CT1001 705000/247, CT1002 495000/182 (price/stock).</p>
${details('Solution — S6', code(Q.S6) + out(O.S6))}
<p>Two new products came in with ids <strong>53 and 54</strong>, not 49 and 50: each of the four conflicting rows consumed an identity number before PostgreSQL detected the conflict. Gaps again — normal. And one statement is safer than “SELECT first, then decide”: another session could insert the same sku in between.</p>

<h3>5 · Ten questions</h3>
<p>Write each query yourself, run it, then open the answer and compare. One table per query.</p>
${hoi('Q1', 'en', 'every Casio item, most expensive first', 'Case-insensitive search: <code>ILIKE</code>.', 'CT1001 already shows its new price from S6.')}
${hoi('Q2', 'en', 'everything under 10.000 đ, cheapest first', 'Several products share a price — add a second sort key so the order never changes between runs.')}
${hoi('Q3', 'en', 'low-stock alert: active products with fewer than 80 units', '', 'CT0806 is not here: the delivery of 200 in S6 lifted it from 71 to 271.')}
${hoi('Q4', 'en', 'pens and pencils (categories 5, 6, 7) priced 20.000–50.000 đ', 'No JOIN yet: use the category ids you got from S2 with <code>IN</code>.')}
${hoi('Q5', 'en', 'customers in Đà Nẵng who left no phone number', 'Never <code>= NULL</code>.')}
${hoi('Q6', 'en', 'how many customers can the 09x SMS gateway NOT reach?', 'Customers without any phone cannot be reached either.', 'The first query gives 137 because <code>NULL NOT LIKE \'09%\'</code> is unknown, not true: the 42 customers with no phone silently disappear — exactly the ones the gateway cannot reach. 179 is the answer.')}
${hoi('Q7', 'en', 'how many orders were placed in September 2026?', 'On a timestamptz, what time is <code>\'2026-09-30\'</code>?', 'BETWEEN stops at 30/09 00:00 and misses the 4 orders placed later that day. For any period use <code>&gt;= first day AND &lt; first day of the next period</code>: 95.')}
${hoi('Q8', 'en', 'stale orders: still pending and created before 1 September 2026 (count + the 5 oldest)', '', 'Remember 170 — U4 uses it as its safety check.')}
${hoi('Q9', 'en', 'the latest order of customers 1–5', '<code>DISTINCT ON</code> keeps the first row per group; ORDER BY decides which row is first.')}
${hoi('Q10', 'en', 'page 3 of the newest orders, 10 per page — with OFFSET, then with keyset', 'Keyset: remember the last row of page 2 — <code>(created_at, id) = (2026-09-26 16:54+07, 1522)</code> — and ask for rows smaller than that pair.', 'Both queries return the same 10 rows. OFFSET reads and throws away 20 rows (page 1000 would read 10,000); keyset jumps straight to the right place, and with an index (Chapter 9) it stays fast on any page. It only works because the sort ends with the unique <code>id</code>.')}

<h3>6 · Changing data safely</h3>
<p>The rule from lesson 4.4: <code>BEGIN</code> → run the change with <code>RETURNING</code> or check a count → <code>COMMIT</code> if it is what you expected, <code>ROLLBACK</code> if not. Inside a transaction the psql prompt shows <code>ctshop=*#</code>; after an error, <code>ctshop=!#</code>.</p>
${hoi('U1', 'en', 'rehearse a 5 % price rise on IT books, then throw it away', '')}
${hoi('U2', 'en', 'the forgotten WHERE — caught because we were inside a transaction', '', '<code>UPDATE 50</code> is the alarm: you meant a few rows, you touched all of them. ROLLBACK and the shelves are full again.')}
${hoi('U3', 'en', 'lower every pen in category 5 by 5.000 đ', 'What happens to CT0501, which costs exactly 5.000 đ?', 'Lab 1’s CHECK (price &gt; 0) rejects CT0501 at 0 đ, and the whole statement is cancelled: the other pens keep their price too.')}
${hoi('U4', 'en', 'cancel the stale orders from Q8 — for real', '', '<code>UPDATE 170</code> equals Q8’s answer and 10 orders remain pending: safe to COMMIT.')}
${hoi('U5', 'en', 'delete customer 300, then customer 1, in one transaction', '', 'Customer 300 has no orders, so that delete works. Customer 1 has orders: the foreign key refuses, the transaction is aborted, every following command is refused until ROLLBACK — which also undoes the delete of customer 300.')}
<h4>Self-check — these numbers must match</h4>
${code(Q.SELF)}
${out(O.SELF)}
<ol>
<li>Why did S6 give the new products ids 53 and 54, not 49 and 50?</li>
<li>Why is <code>BETWEEN '2026-09-01' AND '2026-09-30'</code> wrong on a timestamptz column?</li>
<li>After an ERROR inside BEGIN, what must you type next?</li>
</ol>
${details('Answers', `<ol><li>The four conflicting rows each took an identity number (49–52) before the conflict was detected.</li><li><code>'2026-09-30'</code> means 30 September at 00:00, so the rest of that day is excluded (4 orders). Use <code>&gt;= '2026-09-01' AND &lt; '2026-10-01'</code>.</li><li><code>ROLLBACK</code> — the transaction is aborted and refuses every other command.</li></ol>`)}

<h3>7 · Full solution</h3>
${details('Show the whole lab2-solution.sql', code(SOL))}

<h3>8 · Traps</h3>
<div class="pitfall"><p><strong>Server-side COPY on a laptop path</strong> — the server cannot see your files. Use <code>\\copy</code>.</p></div>
<div class="pitfall"><p><strong>Re-running a COPY that failed</strong>, then loading the children — the parent ids have shifted. Check <code>min(id), max(id)</code>; if needed <code>TRUNCATE … RESTART IDENTITY</code>.</p></div>
<div class="pitfall"><p><strong>A negative filter on a nullable column</strong> (<code>NOT LIKE</code>, <code>&lt;&gt;</code>) silently drops the NULL rows. Ask yourself whether they belong in the answer.</p></div>
<div class="pitfall"><p><strong>BETWEEN with a date on a timestamp column</strong> cuts the last day at midnight. Use a half-open range.</p></div>
<div class="pitfall"><p><strong>Paging on a non-unique sort key</strong> — rows with the same <code>created_at</code> can repeat or vanish between pages. End the sort with <code>id</code>.</p></div>
<div class="pitfall"><p><strong>Changing data in autocommit</strong> — every statement is final the moment it ends. Wrap it in <code>BEGIN</code>, read the row count, then decide.</p></div>

<h3>9 · Next: Lab 3</h3>
<p>Lab 3 (after Chapter 6) loads the complete CT Shop — order lines, payments, stock movements and reviews — and finally <strong>joins</strong> the tables: revenue by month and by category, customers who never bought, and the fan-out trap that counts money twice. It starts from a clean <code>ctshop-schema.sql</code> + <code>ctshop-data.sql</code>, so the changes you made today do not matter.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 2 · CT Shop · sau Chương 4</span>
<h2>Đổ dữ liệu vào shop, rồi đặt câu hỏi</h2>
<p class="lead">Lab 1 cho CT Shop một lược đồ khó tính nhưng còn rỗng. Hôm nay là ngày khai trương: chủ shop xuất bảng tính cũ ra CSV, nhà cung cấp gửi bảng giá mới, và cả đội bắt đầu đặt câu hỏi. Bạn nạp mọi thứ theo cách dự án thật làm (<code>INSERT … RETURNING</code>, <code>\\copy</code>, UPSERT), trả lời mười câu hỏi nghiệp vụ bằng con số thật, và sửa dữ liệu mà không bao giờ lỡ tay mất dòng nào.</p>

<h3>1 · Đề bài</h3>
<p>Mọi việc diễn ra trong schema chuẩn <code>shop</code> của Lab 1 — chạy <code>lab2-start.sql</code> để có nó rỗng và sạch. Chỉ dùng kiến thức tới Chương 4: mỗi truy vấn đọc <strong>một bảng</strong> (cần bảng khác thì dùng id đã biết với <code>IN</code>). JOIN để dành cho Lab 3. Ba công cụ mới được giảng ngay trong lab: <code>\\copy</code>, <code>EXCLUDED</code> trong UPSERT, và phân trang keyset.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>S1–S2</strong> — 12 danh mục bằng hai lệnh INSERT nhiều dòng, dùng <code>RETURNING</code> để biết id danh mục cha.</li>
<li><strong>S3–S5</strong> — nạp sản phẩm, khách, đơn hàng từ CSV bằng <code>\\copy</code>, cha trước con, kiểm id khách trước khi nạp đơn.</li>
<li><strong>S6</strong> — áp bảng giá nhà cung cấp bằng <strong>một</strong> lệnh <code>INSERT … ON CONFLICT (sku) DO UPDATE</code>: giá mới, tồn kho cộng thêm, sku mới thì chèn.</li>
<li><strong>Q1–Q10</strong> — trả lời mười câu hỏi bên dưới; đáp án phải khớp output thật.</li>
<li><strong>U1–U5</strong> — mọi UPDATE/DELETE nằm trong <code>BEGIN</code>, kiểm (RETURNING hoặc đếm) trước khi <code>COMMIT</code> hay <code>ROLLBACK</code>.</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi</strong> phần tự kiểm ở mục 6 in ra: 50 sản phẩm · tổng tồn kho 8129 · id lớn nhất 54 · 300 khách · 2000 đơn · 10 đơn chờ · 327 đơn huỷ.</p></div>

<h3>3 · Tệp tải về và chuẩn bị</h3>
${FILES(true)}
${out(SETUP)}
<p>Máy có cài psql? Dùng đường dẫn cục bộ của từng CSV trong <code>\\copy</code> thay cho <code>/tmp/…</code>. Vì sao có dòng TimeZone: giờ trong CSV mang <code>+07</code>, ảnh Docker chạy UTC; đặt cùng TimeZone với bài thì output và các bộ lọc ngày của bạn khớp y hệt bài.</p>

<h3>4 · Nạp dữ liệu từng bước</h3>
<h4>S1–S2 — danh mục: INSERT nhiều dòng + RETURNING</h4>
<p>Mười hai dòng thì không cần tệp. Chèn 4 danh mục gốc trong một lệnh và để <code>RETURNING</code> cho biết id; các id đó thành <code>parent_id</code> của 8 danh mục con.</p>
${details('Đáp án — S1', code(Q.S1) + out(O.S1))}
${details('Đáp án — S2', code(Q.S2) + out(O.S2))}
<h4>COPY hay \\copy?</h4>
<p><code>COPY … FROM 'đường dẫn'</code> do <em>máy chủ</em> chạy, và máy chủ tìm đường dẫn đó trên đĩa của chính nó. Tệp CSV của bạn nằm trên laptop (hoặc trong container nơi psql chạy), nên máy chủ trả lời:</p>
${out(O.COPYERR)}
<p><code>\\copy</code> là phiên bản phía máy khách của psql: psql đọc tệp và đẩy các dòng qua kết nối (bên dưới nó dùng <code>COPY … FROM STDIN</code>). Tuỳ chọn y hệt, viết trên <strong>một dòng</strong>, không có dấu chấm phẩy. Nhắc nhanh về CSV: <code>HEADER true</code> bỏ qua dòng đầu; trường có dấu phẩy được bọc ngoặc kép và ngoặc kép bên trong được nhân đôi (nhờ vậy cả đối tượng JSON nằm gọn trong <code>attrs</code>); trường rỗng không ngoặc (<code>,,</code>) thành NULL.</p>
${out(CSV_HEAD)}
<h4>S3–S5 — ba lệnh \\copy, cha trước</h4>
<p>Nạp product (cha của nó là category đã sẵn), rồi customer, rồi <strong>kiểm id khách</strong>, rồi orders. Tệp đơn hàng gọi khách bằng số, nên "khách 61" chỉ đúng người khi khách được đánh id 1…300.</p>
${details('Đáp án — S3–S5', code(Q.S35) + out(O.S35))}
<div class="pitfall"><p><strong>Bẫy — COPY thất bại vẫn đốt số identity.</strong> Bên dưới, lần đầu liệt kê cột sai thứ tự: tên khách rơi vào <code>email</code> và CHECK chặn ngay dòng 2. COPY là được cả hoặc không gì, nên 0 dòng được nạp — nhưng số identity đã bị lấy. Lần COPY sửa lại cho id 2…301, và tệp đơn hàng vấp ở khách số 1. Cách sửa: <code>TRUNCATE customer, orders RESTART IDENTITY;</code> rồi nạp lại. (Chạy thật trong một schema nháp.)</p></div>
${out(O.TRAP)}
<h4>S6 — bảng giá nhà cung cấp: UPSERT</h4>
<p>Nạp 6 dòng vào một bảng tạm, rồi một lệnh <code>INSERT … SELECT … ON CONFLICT (sku) DO UPDATE</code>. Trong <code>DO UPDATE</code>, <code>EXCLUDED</code> là dòng vừa định chèn còn <code>product</code> là dòng đang ở trên kệ: lấy giá mới, <em>cộng thêm</em> số hàng vừa giao. Trước S6, bốn sku đã có là CT0702 22000/86, CT0806 15000/71, CT1001 705000/247, CT1002 495000/182 (giá/tồn kho).</p>
${details('Đáp án — S6', code(Q.S6) + out(O.S6))}
<p>Hai sản phẩm mới mang id <strong>53 và 54</strong>, không phải 49 và 50: mỗi dòng trùng trong bốn dòng đã tiêu một số identity trước khi PostgreSQL phát hiện trùng. Lại là lỗ hổng id — bình thường. Và một câu lệnh an toàn hơn kiểu "SELECT trước rồi mới quyết": phiên khác có thể chèn cùng sku vào giữa.</p>

<h3>5 · Mười câu hỏi</h3>
<p>Tự viết từng truy vấn, chạy, rồi mới mở đáp án để so. Mỗi truy vấn một bảng.</p>
${hoi('Q1', 'vi', 'mọi sản phẩm Casio, đắt nhất trước', 'Tìm không phân biệt hoa thường: <code>ILIKE</code>.', 'CT1001 đã mang giá mới từ S6.')}
${hoi('Q2', 'vi', 'mọi thứ dưới 10.000 đ, rẻ nhất trước', 'Nhiều sản phẩm cùng giá — thêm khoá sắp thứ hai để thứ tự không đổi giữa các lần chạy.')}
${hoi('Q3', 'vi', 'cảnh báo sắp hết hàng: sản phẩm đang bán còn dưới 80 chiếc', '', 'CT0806 không có ở đây: 200 chiếc giao ở S6 đã nâng nó từ 71 lên 271.')}
${hoi('Q4', 'vi', 'bút các loại (danh mục 5, 6, 7) giá từ 20.000 tới 50.000 đ', 'Chưa có JOIN: dùng id danh mục có từ S2 với <code>IN</code>.')}
${hoi('Q5', 'vi', 'khách ở Đà Nẵng không để lại số điện thoại', 'Không bao giờ viết <code>= NULL</code>.')}
${hoi('Q6', 'vi', 'cổng SMS đầu số 09 KHÔNG với tới bao nhiêu khách?', 'Khách không có số điện thoại thì cũng không với tới được.', 'Truy vấn thứ nhất ra 137 vì <code>NULL NOT LIKE \'09%\'</code> là "không biết" chứ không phải đúng: 42 khách không có số lặng lẽ biến mất — đúng những người cổng SMS không với tới. Đáp án là 179.')}
${hoi('Q7', 'vi', 'tháng 9/2026 có bao nhiêu đơn?', 'Với timestamptz, <code>\'2026-09-30\'</code> là mấy giờ?', 'BETWEEN dừng ở 0 giờ ngày 30/9 và bỏ sót 4 đơn đặt muộn hơn trong ngày. Với mọi khoảng thời gian dùng <code>&gt;= ngày đầu AND &lt; ngày đầu kỳ sau</code>: 95.')}
${hoi('Q8', 'vi', 'đơn treo: vẫn pending và tạo trước 1/9/2026 (đếm + 5 đơn cũ nhất)', '', 'Nhớ con số 170 — U4 dùng nó làm phép kiểm an toàn.')}
${hoi('Q9', 'vi', 'đơn mới nhất của khách 1–5', '<code>DISTINCT ON</code> giữ dòng đầu của mỗi nhóm; ORDER BY quyết định dòng nào đứng đầu.')}
${hoi('Q10', 'vi', 'trang 3 của các đơn mới nhất, 10 đơn mỗi trang — bằng OFFSET, rồi bằng keyset', 'Keyset: nhớ dòng cuối của trang 2 — <code>(created_at, id) = (2026-09-26 16:54+07, 1522)</code> — rồi xin các dòng nhỏ hơn cặp đó.', 'Hai truy vấn trả đúng cùng 10 dòng. OFFSET đọc rồi vứt 20 dòng (trang 1000 sẽ đọc 10.000 dòng); keyset nhảy thẳng tới đúng chỗ, và có chỉ mục (Chương 9) thì trang nào cũng nhanh. Nó chỉ chạy được vì phần sắp xếp kết thúc bằng cột <code>id</code> duy nhất.')}

<h3>6 · Sửa dữ liệu an toàn</h3>
<p>Luật của bài 4.4: <code>BEGIN</code> → chạy thay đổi kèm <code>RETURNING</code> hoặc một phép đếm → <code>COMMIT</code> nếu đúng như mong đợi, <code>ROLLBACK</code> nếu không. Trong giao dịch, dấu nhắc psql hiện <code>ctshop=*#</code>; sau một lỗi thì <code>ctshop=!#</code>.</p>
${hoi('U1', 'vi', 'tập dượt tăng giá 5 % cho giáo trình IT, rồi vứt đi', '')}
${hoi('U2', 'vi', 'quên WHERE — được cứu vì đang trong giao dịch', '', '<code>UPDATE 50</code> là chuông báo động: bạn định sửa vài dòng mà chạm cả bảng. ROLLBACK và kệ hàng đầy trở lại.')}
${hoi('U3', 'vi', 'giảm 5.000 đ cho mọi cây bút trong danh mục 5', 'Chuyện gì xảy ra với CT0501, giá đúng 5.000 đ?', 'CHECK (price &gt; 0) của Lab 1 chặn CT0501 ở giá 0 đ, và cả câu lệnh bị huỷ: các bút khác cũng giữ nguyên giá.')}
${hoi('U4', 'vi', 'huỷ thật các đơn treo của Q8', '', '<code>UPDATE 170</code> khớp đáp án Q8 và còn 10 đơn chờ: an toàn để COMMIT.')}
${hoi('U5', 'vi', 'xoá khách 300, rồi khách 1, trong một giao dịch', '', 'Khách 300 chưa có đơn nên xoá được. Khách 1 có đơn: khoá ngoại từ chối, giao dịch bị huỷ, mọi lệnh sau đó bị từ chối cho tới ROLLBACK — lệnh này hoàn lại luôn việc xoá khách 300.')}
<h4>Tự kiểm — các con số này phải khớp</h4>
${code(Q.SELF)}
${out(O.SELF)}
<ol>
<li>Vì sao S6 cho sản phẩm mới id 53 và 54 chứ không phải 49 và 50?</li>
<li>Vì sao <code>BETWEEN '2026-09-01' AND '2026-09-30'</code> sai với cột timestamptz?</li>
<li>Sau một ERROR trong BEGIN, bạn phải gõ gì tiếp?</li>
</ol>
${details('Đáp án', `<ol><li>Bốn dòng trùng mỗi dòng đã lấy một số identity (49–52) trước khi phát hiện trùng.</li><li><code>'2026-09-30'</code> nghĩa là 0 giờ ngày 30/9, nên phần còn lại của ngày đó bị loại (4 đơn). Dùng <code>&gt;= '2026-09-01' AND &lt; '2026-10-01'</code>.</li><li><code>ROLLBACK</code> — giao dịch đã bị huỷ và từ chối mọi lệnh khác.</li></ol>`)}

<h3>7 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab2-solution.sql', code(SOL))}

<h3>8 · Bẫy hay gặp</h3>
<div class="pitfall"><p><strong>COPY phía máy chủ với đường dẫn trên laptop</strong> — máy chủ không thấy tệp của bạn. Dùng <code>\\copy</code>.</p></div>
<div class="pitfall"><p><strong>Chạy lại một COPY đã thất bại</strong> rồi nạp bảng con — id bảng cha đã lệch. Kiểm <code>min(id), max(id)</code>; cần thì <code>TRUNCATE … RESTART IDENTITY</code>.</p></div>
<div class="pitfall"><p><strong>Điều kiện phủ định trên cột cho phép NULL</strong> (<code>NOT LIKE</code>, <code>&lt;&gt;</code>) lặng lẽ bỏ các dòng NULL. Tự hỏi chúng có thuộc đáp án không.</p></div>
<div class="pitfall"><p><strong>BETWEEN với ngày trên cột thời gian</strong> cắt ngày cuối ở nửa đêm. Dùng khoảng nửa mở.</p></div>
<div class="pitfall"><p><strong>Phân trang trên khoá sắp không duy nhất</strong> — các dòng cùng <code>created_at</code> có thể lặp hoặc biến mất giữa các trang. Kết thúc phần sắp xếp bằng <code>id</code>.</p></div>
<div class="pitfall"><p><strong>Sửa dữ liệu ở chế độ tự commit</strong> — câu lệnh vừa xong là chốt luôn. Bọc trong <code>BEGIN</code>, đọc số dòng bị ảnh hưởng, rồi mới quyết.</p></div>

<h3>9 · Tiếp theo: Lab 3</h3>
<p>Lab 3 (sau Chương 6) nạp CT Shop đầy đủ — dòng đơn, thanh toán, nhật ký kho, đánh giá — và cuối cùng <strong>nối</strong> các bảng: doanh thu theo tháng và theo danh mục, khách chưa từng mua, và cái bẫy nhân dòng làm tiền bị đếm hai lần. Lab 3 bắt đầu từ <code>ctshop-schema.sql</code> + <code>ctshop-data.sql</code> sạch, nên những gì bạn đã sửa hôm nay không ảnh hưởng.</p>
</div>
`;

export default {
  title: 'Lab 2 — CT Shop: fill the shop, ask it questions|||Lab 2 — CT Shop: đổ dữ liệu, đặt câu hỏi',
  slug: 'postgresql-lab-2-nap-truy-van-ct-shop',
  type: 'LESSON',
  description: 'Lab dự án CT Shop sau Chương 4: nạp 48 sản phẩm, 300 khách, 2.000 đơn bằng \\copy từ CSV + INSERT nhiều dòng + RETURNING, UPSERT bảng giá với ON CONFLICT/EXCLUDED, 10 truy vấn một bảng có đáp án thật (bẫy NULL, BETWEEN, phân trang keyset), UPDATE/DELETE an toàn trong BEGIN/ROLLBACK.',
  content: `${G}${EN}${VI}`,
};
