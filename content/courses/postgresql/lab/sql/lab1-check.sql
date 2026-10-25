-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 1 — CHECK SCRIPT: try to break every rule of your schema
-- Lab 1 — FILE KIỂM: cố tình phá từng luật của lược đồ bạn vừa viết
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- Run AFTER your CREATE TABLEs (chạy SAU khi đã tạo 8 bảng):
--   docker cp lab1-check.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab1-check.sql
-- (each ERROR line starts with psql:/tmp/lab1-check.sql:<line>: — the line number tells you which test)
--
-- Part A inserts a few VALID rows (must succeed). Part B sends 23 BAD rows: every one must be
-- rejected with an ERROR naming the right constraint. Part C tests the ON DELETE rules.
-- Part D compares your schema with the standard one (two fingerprints). Part E empties the tables.
-- Phần A chèn vài dòng HỢP LỆ (phải thành công). Phần B gửi 23 dòng SAI: dòng nào cũng phải bị
-- từ chối bằng một ERROR nêu đúng tên ràng buộc. Phần C thử luật ON DELETE. Phần D so lược đồ của
-- bạn với lược đồ chuẩn (hai "dấu vân tay"). Phần E dọn sạch bảng.
-- ═══════════════════════════════════════════════════════════════════════════
\set ON_ERROR_STOP off
\set QUIET on
\pset pager off
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';

\echo '== A. Valid rows — must succeed =='
INSERT INTO customer (email, full_name) VALUES ('an@ctshop.vn', 'Nguyễn Văn An');
INSERT INTO customer (email, full_name, phone, city) VALUES ('binh@ctshop.vn', 'Trần Thị Bình', '0901234567', 'Đà Nẵng');
INSERT INTO category (name) VALUES ('Bút & mực');
INSERT INTO category (name, parent_id) VALUES ('Bút bi', 1);
INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0201', 'Bút bi Thiên Long TL-027 (xanh)', 2, 5000, 100);
INSERT INTO product (sku, name, category_id, price) VALUES ('CT0202', 'Bút gel Uni-ball Signo 0.5mm', 2, 28000);
INSERT INTO orders (customer_id) VALUES (1);
INSERT INTO orders (customer_id, status) VALUES (1, 'paid');
INSERT INTO order_item VALUES (1, 1, 2, 5000), (1, 2, 1, 28000), (2, 1, 3, 5000);
INSERT INTO payment (order_id, amount, method) VALUES (2, 15000, 'momo');
INSERT INTO stock_movement (product_id, change, reason) VALUES (1, 100, 'import');
INSERT INTO review (product_id, customer_id, rating, body) VALUES (1, 1, 5, 'Mực ra đều');
SELECT id, email, phone, city, created_at IS NOT NULL AS has_time FROM customer ORDER BY id;
SELECT id, sku, price, stock, attrs, is_active FROM product ORDER BY id;
SELECT id, customer_id, status FROM orders ORDER BY id;

\echo '== B. Bad rows — every statement must fail =='
\echo 'T01 duplicate email'
INSERT INTO customer (email, full_name) VALUES ('an@ctshop.vn', 'Người trùng email');
\echo 'T02 email with capital letters'
INSERT INTO customer (email, full_name) VALUES ('An@CTShop.vn', 'Viết hoa');
\echo 'T03 email without @'
INSERT INTO customer (email, full_name) VALUES ('an.ctshop.vn', 'Thiếu a còng');
\echo 'T04 missing full_name'
INSERT INTO customer (email) VALUES ('chi@ctshop.vn');
\echo 'T05 typing the id yourself'
INSERT INTO customer (id, email, full_name) VALUES (99, 'dung@ctshop.vn', 'Lê Dũng');
\echo 'T06 duplicate category name'
INSERT INTO category (name) VALUES ('Bút bi');
\echo 'T07 parent category that does not exist'
INSERT INTO category (name, parent_id) VALUES ('Bút lông', 99);
\echo 'T08 duplicate sku'
INSERT INTO product (sku, name, category_id, price) VALUES ('CT0201', 'Hàng trùng mã', 2, 5000);
\echo 'T09 price 0'
INSERT INTO product (sku, name, category_id, price) VALUES ('CT0203', 'Hàng tặng', 2, 0);
\echo 'T10 negative stock'
INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0204', 'Kho âm', 2, 5000, -5);
\echo 'T11 category that does not exist'
INSERT INTO product (sku, name, category_id, price) VALUES ('CT9901', 'Lạc danh mục', 99, 5000);
\echo 'T12 unknown order status'
INSERT INTO orders (customer_id, status) VALUES (1, 'done');
\echo 'T13 order for a customer that does not exist'
INSERT INTO orders (customer_id) VALUES (99);
\echo 'T14 quantity 0'
INSERT INTO order_item VALUES (2, 2, 0, 28000);
\echo 'T15 same product twice in one order'
INSERT INTO order_item VALUES (1, 1, 5, 5000);
\echo 'T16 order line for a product that does not exist'
INSERT INTO order_item VALUES (2, 99, 1, 5000);
\echo 'T17 second payment for the same order'
INSERT INTO payment (order_id, amount, method) VALUES (2, 15000, 'card');
\echo 'T18 unknown payment method'
INSERT INTO payment (order_id, amount, method) VALUES (1, 38000, 'paypal');
\echo 'T19 payment amount 0'
INSERT INTO payment (order_id, amount, method) VALUES (1, 0, 'cod');
\echo 'T20 stock change 0'
INSERT INTO stock_movement (product_id, change, reason) VALUES (1, 0, 'adjust');
\echo 'T21 unknown stock reason'
INSERT INTO stock_movement (product_id, change, reason) VALUES (1, 5, 'gift');
\echo 'T22 rating 6 stars'
INSERT INTO review (product_id, customer_id, rating) VALUES (2, 1, 6);
\echo 'T23 second review of the same product by the same customer'
INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 4);

\echo '== C. ON DELETE rules =='
\echo 'T24 delete a category that still has a child -> must fail (RESTRICT)'
DELETE FROM category WHERE id = 1;
\echo 'T25 delete a customer who has orders -> must fail'
DELETE FROM customer WHERE id = 1;
\echo 'T26 delete a product that was sold -> must fail'
DELETE FROM product WHERE id = 1;
\echo 'T27 delete an order that has a payment -> must fail'
DELETE FROM orders WHERE id = 2;
\echo 'T28 delete an unpaid order -> succeeds, its lines go with it (CASCADE)'
SELECT order_id, count(*) AS lines FROM order_item GROUP BY order_id ORDER BY order_id;
DELETE FROM orders WHERE id = 1 RETURNING id, status;
SELECT order_id, count(*) AS lines FROM order_item GROUP BY order_id ORDER BY order_id;
\echo 'T29 hide a product instead of deleting it (soft delete)'
UPDATE product SET is_active = false WHERE id = 1 RETURNING id, sku, is_active;

\echo '== D. Compare with the standard schema (ctshop-schema.sql) =='
SELECT conrelid::regclass AS table_name, contype, conname
FROM pg_constraint
WHERE connamespace = 'shop'::regnamespace
ORDER BY conrelid::regclass::text, contype, conname;
-- Fingerprints: equal to the lesson ⇒ same columns/types/defaults and same constraint definitions.
-- Dấu vân tay: trùng với bài ⇒ cùng cột/kiểu/mặc định và cùng định nghĩa ràng buộc.
SELECT count(*) AS columns,
       md5(string_agg(format('%s.%s %s(%s,%s) %s %s %s', table_name, column_name, data_type,
                             numeric_precision, numeric_scale, is_nullable, coalesce(column_default, '-'), is_identity),
                      E'\n' ORDER BY table_name, column_name)) AS column_fingerprint
FROM information_schema.columns
WHERE table_schema = 'shop';
SELECT count(*) AS constraints,
       md5(string_agg(conrelid::regclass::text || ' ' || pg_get_constraintdef(oid), E'\n'
                      ORDER BY conrelid::regclass::text, pg_get_constraintdef(oid))) AS constraint_fingerprint
FROM pg_constraint
WHERE connamespace = 'shop'::regnamespace;

\echo '== E. Clean up: empty all 8 tables and restart the ids at 1 =='
TRUNCATE customer, category, product, orders, order_item, payment, stock_movement, review RESTART IDENTITY;
SELECT count(*) AS customers_left FROM customer;
