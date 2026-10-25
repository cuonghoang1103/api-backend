-- ═══════════════════════════════════════════════════════════════════════════
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
\pset pager off
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

-- ── S3–S5 · bulk load with \copy — parents before children (category → product, customer → orders) ──
\copy product (sku, name, category_id, price, stock, attrs, is_active, created_at) FROM '/tmp/lab2-products.csv' WITH (FORMAT csv, HEADER true)
\copy customer (email, full_name, phone, city, created_at) FROM '/tmp/lab2-customers.csv' WITH (FORMAT csv, HEADER true)
-- orders.csv says "customer_id = 61": that only means the right person if customers got ids 1..300
SELECT min(id), max(id), count(*) FROM customer;      -- 1 | 300 | 300
\copy orders (customer_id, status, created_at, note) FROM '/tmp/lab2-orders.csv' WITH (FORMAT csv, HEADER true)

-- ── S6 · supplier price list: stage it, then UPSERT by sku ──
CREATE TABLE price_update (
  sku          text PRIMARY KEY,
  name         text NOT NULL,
  category_id  int  NOT NULL,
  price        numeric(12,2) NOT NULL,
  stock        int  NOT NULL                          -- units delivered today
);
\copy price_update FROM '/tmp/lab2-price-update.csv' WITH (FORMAT csv, HEADER true)
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
SELECT count(*) AS cancelled FROM orders WHERE status = 'cancelled';                      -- 327
