-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 5 — START: a clean CT Shop, then ONE MILLION orders + your to-do list
-- Lab 5 — KHỞI ĐẦU: CT Shop sạch, rồi phóng lên MỘT TRIỆU đơn + danh sách việc
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- Run ONCE (it drops and rebuilds schema shop — whatever Labs 1–4 left behind is gone):
--   docker cp lab5-start.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab5-start.sql
-- Part A = ctshop-schema.sql + ctshop-data.sql (the standard shop, same numbers as Labs 3–4).
-- Part B = 99.700 more customers, 998.000 more orders, ~2,5 M more order lines, ~915.000 more payments
--          (deterministic — setseed — so every machine gets the same rows). About 1 minute and ~420 MB on disk.
-- Then open psql and run:  SET search_path = shop;  SET TimeZone = 'Asia/Ho_Chi_Minh';
--                          SET max_parallel_workers_per_gather = 0;   -- plans without Gather, like Chapter 10
-- and do P1–P7 below. Times on your machine will differ: compare plan shapes, rows, buffers and ratios.
-- ═══════════════════════════════════════════════════════════════════════════
\pset pager off

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART A — the standard CT Shop (schema + deterministic data)             │
-- └─────────────────────────────────────────────────────────────────────────┘
DROP SCHEMA IF EXISTS shop CASCADE;
CREATE SCHEMA shop;
SET search_path = shop;

-- Khách hàng
CREATE TABLE customer (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text        NOT NULL,
  full_name   text        NOT NULL,
  phone       text,
  city        text        NOT NULL DEFAULT 'Hà Nội',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_email_key   UNIQUE (email),
  CONSTRAINT customer_email_check CHECK (email = lower(email) AND email LIKE '%_@_%.__%')
);

-- Danh mục (cây: danh mục con trỏ về danh mục cha)
CREATE TABLE category (
  id         int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  parent_id  int  REFERENCES category(id) ON DELETE RESTRICT
);

-- Sản phẩm (attrs = thuộc tính tuỳ loại, dùng ở Lab 7)
CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text          NOT NULL UNIQUE,
  name         text          NOT NULL,
  category_id  int           NOT NULL REFERENCES category(id),
  price        numeric(12,2) NOT NULL CHECK (price > 0),
  stock        int           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attrs        jsonb         NOT NULL DEFAULT '{}',
  is_active    boolean       NOT NULL DEFAULT true,
  created_at   timestamptz   NOT NULL DEFAULT now()
);

-- Đơn hàng
CREATE TABLE orders (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  note         text
);

-- Dòng đơn hàng (bảng nối orders ↔ product, giữ giá TẠI LÚC MUA)
CREATE TABLE order_item (
  order_id    bigint        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  bigint        NOT NULL REFERENCES product(id),
  qty         int           NOT NULL CHECK (qty > 0),
  unit_price  numeric(12,2) NOT NULL CHECK (unit_price > 0),
  PRIMARY KEY (order_id, product_id)
);

-- Thanh toán (mỗi đơn tối đa một lần thanh toán thành công)
CREATE TABLE payment (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id  bigint        NOT NULL UNIQUE REFERENCES orders(id),
  amount    numeric(12,2) NOT NULL CHECK (amount > 0),
  method    text          NOT NULL CHECK (method IN ('cod', 'card', 'momo', 'bank')),
  paid_at   timestamptz   NOT NULL DEFAULT now()
);

-- Nhật ký kho (Lab 6: trigger tự ghi khi bán)
CREATE TABLE stock_movement (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint      NOT NULL REFERENCES product(id),
  change      int         NOT NULL CHECK (change <> 0),
  reason      text        NOT NULL CHECK (reason IN ('import', 'sale', 'return', 'adjust')),
  order_id    bigint      REFERENCES orders(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Đánh giá (mỗi khách đánh giá một sản phẩm một lần)
CREATE TABLE review (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id   bigint      NOT NULL REFERENCES product(id),
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);

SET search_path = shop;
SELECT setseed(0.42);

-- ── Danh mục: 4 gốc + 8 con ──
INSERT INTO category (name, parent_id)
SELECT name, parent_id FROM (VALUES
  ('Bút & mực', NULL::int), ('Vở & giấy', NULL), ('Dụng cụ học tập', NULL), ('Sách & tài liệu', NULL)) v(name, parent_id);
INSERT INTO category (name, parent_id)
SELECT c.name, p.id FROM (VALUES
  (1, 'Bút bi', 'Bút & mực'), (2, 'Bút chì & tẩy', 'Bút & mực'), (3, 'Bút dạ quang', 'Bút & mực'),
  (4, 'Vở ô ly', 'Vở & giấy'), (5, 'Sổ tay', 'Vở & giấy'),
  (6, 'Máy tính cầm tay', 'Dụng cụ học tập'), (7, 'Thước & compa', 'Dụng cụ học tập'),
  (8, 'Giáo trình IT', 'Sách & tài liệu')) c(n, name, parent)
JOIN category p ON p.name = c.parent
ORDER BY c.n;                      -- id 5..12 đúng thứ tự trên (5 Bút bi … 12 Giáo trình IT)

-- ── Sản phẩm: 48 món thật trên kệ (6 mỗi danh mục con), giá bán lẻ VND tham khảo thị trường 2026 ──
-- (sku = CT + mã danh mục 2 số + số thứ tự; tồn kho / màu / nhãn sinh ngẫu nhiên TẤT ĐỊNH theo setseed)
INSERT INTO product (sku, name, category_id, price, stock, attrs, created_at)
SELECT format('CT%s%s', lpad(c.id::text, 2, '0'), lpad(v.g::text, 2, '0')),
       v.name, c.id, v.price,
       50 + floor(random() * 200)::int,
       jsonb_build_object('brand', v.brand,
                          'color', (ARRAY['xanh', 'đen', 'đỏ', 'tím', 'vàng'])[1 + floor(random() * 5)::int],
                          'tags',  to_jsonb(ARRAY[(ARRAY['học sinh', 'sinh viên', 'văn phòng'])[1 + floor(random() * 3)::int]])),
       timestamptz '2025-01-01 08:00+07' + (v.g || ' days')::interval
FROM (VALUES
  ('Bút bi', 1, 'Bút bi Thiên Long TL-027 (xanh)', 'Thiên Long', 5000),
  ('Bút bi', 2, 'Bút bi Thiên Long TL-079 (hộp 20 cây)', 'Thiên Long', 78000),
  ('Bút bi', 3, 'Bút bi Pentel BK77 0.7mm', 'Pentel', 12000),
  ('Bút bi', 4, 'Bút gel Uni-ball Signo 0.5mm', 'Uni', 28000),
  ('Bút bi', 5, 'Bút gel Zebra Sarasa Clip 0.5mm', 'Zebra', 24000),
  ('Bút bi', 6, 'Bút bi bấm Deli 0.7mm (hộp 12 cây)', 'Deli', 45000),
  ('Bút chì & tẩy', 1, 'Bút chì gỗ Thiên Long 2B GP-01', 'Thiên Long', 4000),
  ('Bút chì & tẩy', 2, 'Bút chì kim Pentel A255 0.5mm', 'Pentel', 32000),
  ('Bút chì & tẩy', 3, 'Ruột chì kim Pentel 0.5mm 2B', 'Pentel', 12000),
  ('Bút chì & tẩy', 4, 'Tẩy Pentel Hi-Polymer', 'Pentel', 9000),
  ('Bút chì & tẩy', 5, 'Bút chì Staedtler Noris 2B (hộp 12 cây)', 'Staedtler', 96000),
  ('Bút chì & tẩy', 6, 'Bút chì màu Faber-Castell 24 màu', 'Faber-Castell', 125000),
  ('Bút dạ quang', 1, 'Bút dạ quang Thiên Long HL-03', 'Thiên Long', 7000),
  ('Bút dạ quang', 2, 'Bút dạ quang Stabilo Boss Original', 'Stabilo', 22000),
  ('Bút dạ quang', 3, 'Bút dạ quang Stabilo Boss Pastel (bộ 6)', 'Stabilo', 129000),
  ('Bút dạ quang', 4, 'Bút dạ quang hai đầu Deli', 'Deli', 9000),
  ('Bút dạ quang', 5, 'Bút Zebra Mildliner (bộ 5 màu)', 'Zebra', 89000),
  ('Bút dạ quang', 6, 'Bút dạ quang Pentel Illumina', 'Pentel', 15000),
  ('Vở ô ly', 1, 'Vở ô ly Hồng Hà 48 trang', 'Hồng Hà', 6000),
  ('Vở ô ly', 2, 'Vở ô ly Hồng Hà 96 trang', 'Hồng Hà', 11000),
  ('Vở ô ly', 3, 'Vở kẻ ngang Campus 80 trang', 'Campus', 13000),
  ('Vở ô ly', 4, 'Vở kẻ ngang Campus 200 trang', 'Campus', 29000),
  ('Vở ô ly', 5, 'Lốc 10 vở Hồng Hà 96 trang', 'Hồng Hà', 105000),
  ('Vở ô ly', 6, 'Vở Klong 120 trang', 'Klong', 15000),
  ('Sổ tay', 1, 'Sổ lò xo Campus A5', 'Campus', 32000),
  ('Sổ tay', 2, 'Sổ tay Klong A5 bìa da', 'Klong', 65000),
  ('Sổ tay', 3, 'Sổ chấm bullet journal A5', 'Klong', 79000),
  ('Sổ tay', 4, 'Sổ tay Deli B5 kẻ ngang', 'Deli', 39000),
  ('Sổ tay', 5, 'Giấy note Post-it 3x3 (100 tờ)', 'Post-it', 25000),
  ('Sổ tay', 6, 'Sổ tay Moleskine Classic A5', 'Moleskine', 590000),
  ('Máy tính cầm tay', 1, 'Máy tính Casio FX-580VN X', 'Casio', 705000),
  ('Máy tính cầm tay', 2, 'Máy tính Casio FX-570VN Plus', 'Casio', 495000),
  ('Máy tính cầm tay', 3, 'Máy tính Vinacal 570ES Plus II', 'Vinacal', 345000),
  ('Máy tính cầm tay', 4, 'Máy tính Casio FX-880BTG', 'Casio', 790000),
  ('Máy tính cầm tay', 5, 'Máy tính Casio MX-12B (văn phòng)', 'Casio', 195000),
  ('Máy tính cầm tay', 6, 'Máy tính Deli D82TL', 'Deli', 285000),
  ('Thước & compa', 1, 'Thước kẻ nhựa Thiên Long 20cm', 'Thiên Long', 5000),
  ('Thước & compa', 2, 'Thước thép Deli 30cm', 'Deli', 15000),
  ('Thước & compa', 3, 'Bộ thước ê-ke đo độ Thiên Long', 'Thiên Long', 18000),
  ('Thước & compa', 4, 'Compa chì kim Thiên Long', 'Thiên Long', 29000),
  ('Thước & compa', 5, 'Compa Staedtler Noris', 'Staedtler', 85000),
  ('Thước & compa', 6, 'Bộ thước vẽ kỹ thuật Deli 4 món', 'Deli', 45000),
  ('Giáo trình IT', 1, 'Giáo trình Cơ sở dữ liệu (bản in)', 'CT Books', 89000),
  ('Giáo trình IT', 2, 'Giáo trình Lập trình Java căn bản', 'CT Books', 95000),
  ('Giáo trình IT', 3, 'Sách Clean Code (bản tiếng Việt)', 'NXB Trẻ', 179000),
  ('Giáo trình IT', 4, 'Sổ tay SQL bỏ túi', 'CT Books', 59000),
  ('Giáo trình IT', 5, 'Cấu trúc dữ liệu & giải thuật', 'CT Books', 125000),
  ('Giáo trình IT', 6, 'Bộ đề luyện thi PE/FE (bản in)', 'CT Books', 49000)
) v(cat, g, name, brand, price)
JOIN category c ON c.name = v.cat
ORDER BY c.id, v.g;

-- ── Khách hàng: 300 ──
INSERT INTO customer (email, full_name, phone, city, created_at)
SELECT format('kh%s@ctshop.vn', lpad(i::text, 3, '0')),
       format('%s %s %s', (ARRAY['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'])[1 + i % 8],
                          (ARRAY['Văn', 'Thị', 'Minh', 'Quốc', 'Thu', 'Gia'])[1 + i % 6],
                          (ARRAY['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Linh', 'Nam', 'Phúc', 'Trang'])[1 + i % 10]),
       CASE WHEN i % 7 = 0 THEN NULL                                    -- 42 khách không để lại số điện thoại
            ELSE (ARRAY['090', '091', '093', '094', '096', '097', '098', '086', '032', '035', '038', '070', '077', '081', '088'])[1 + i % 15]
                 || lpad((i * 7919 % 10000000)::text, 7, '0') END,
       (ARRAY['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'])[1 + floor(random() * 5)::int],
       timestamptz '2025-01-01 08:00+07' + (floor(random() * 600) || ' days')::interval
FROM generate_series(1, 300) i;

-- ── Đơn hàng: 2.000 (khách 291–300 chưa mua bao giờ — dùng ở Lab 3) ──
INSERT INTO orders (customer_id, status, created_at)
SELECT 1 + floor(random() * 290)::int,
       CASE WHEN r < 0.08 THEN 'cancelled' WHEN r < 0.18 THEN 'pending' WHEN r < 0.55 THEN 'paid' ELSE 'shipped' END,
       timestamptz '2025-01-01 08:00+07' + (floor(random() * 638 * 24 * 60) || ' minutes')::interval
FROM (SELECT random() r FROM generate_series(1, 2000)) x;

-- ── Dòng đơn: 1–4 sản phẩm khác nhau mỗi đơn ──
INSERT INTO order_item (order_id, product_id, qty, unit_price)
SELECT o.id, p.id, 1 + floor(random() * 3)::int, p.price
FROM orders o
CROSS JOIN LATERAL (
  SELECT id, price FROM product
  ORDER BY md5(o.id::text || id::text)
  LIMIT 1 + (o.id % 4)
) p;

-- ── Thanh toán cho đơn đã trả (paid/shipped) ──
INSERT INTO payment (order_id, amount, method, paid_at)
SELECT o.id, sum(oi.qty * oi.unit_price),
       (ARRAY['cod', 'card', 'momo', 'bank'])[1 + (o.id % 4)::int],
       o.created_at + interval '2 hours'
FROM orders o JOIN order_item oi ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped')
GROUP BY o.id;

-- ── Nhật ký kho: nhập ban đầu + bán ──
INSERT INTO stock_movement (product_id, change, reason, created_at)
SELECT id, stock + 100, 'import', created_at FROM product;
INSERT INTO stock_movement (product_id, change, reason, order_id, created_at)
SELECT oi.product_id, -oi.qty, 'sale', o.id, o.created_at
FROM order_item oi JOIN orders o ON o.id = oi.order_id
WHERE o.status <> 'cancelled' AND o.id % 10 = 0;

-- ── Đánh giá: ~600, chỉ từ khách đã mua đúng sản phẩm đó ──
INSERT INTO review (product_id, customer_id, rating, body, created_at)
SELECT DISTINCT ON (oi.product_id, o.customer_id)
       oi.product_id, o.customer_id,
       (ARRAY[5, 5, 4, 4, 4, 3, 2, 5, 1, 4])[1 + (o.id % 10)::int],
       (ARRAY['Rất tốt, giao nhanh', 'Đúng mô tả', 'Mực ra đều', 'Giấy dày, viết êm', 'Tạm được', 'Hơi đắt', 'Đóng gói kỹ'])[1 + (o.id % 7)::int],
       o.created_at + interval '5 days'
FROM order_item oi JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'shipped' AND o.id % 3 = 0
ORDER BY oi.product_id, o.customer_id, o.id;

ANALYZE;

-- Quick check — must print 12 | 48 | 300 | 2000 | 5000 | 1663
SELECT (SELECT count(*) FROM category) AS categories, (SELECT count(*) FROM product) AS products,
       (SELECT count(*) FROM customer) AS customers, (SELECT count(*) FROM orders) AS orders,
       (SELECT count(*) FROM order_item) AS order_lines, (SELECT count(*) FROM payment) AS payments;

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART B — make CT Shop one million orders big (same tables, more rows)   │
-- │ PHẦN B — phóng CT Shop lên một triệu đơn (cùng lược đồ, nhiều dòng hơn) │
-- └─────────────────────────────────────────────────────────────────────────┘
\timing on
SELECT setseed(0.55);

-- B1 · 99.700 more customers (ids 301 … 100000); e-mails are already lower-case, as the CHECK demands
INSERT INTO customer (email, full_name, phone, city, created_at)
SELECT format('kh%s@ctshop.vn', lpad(i::text, 6, '0')),
       format('%s %s %s', (ARRAY['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'])[1 + i % 8],
                          (ARRAY['Văn', 'Thị', 'Minh', 'Quốc', 'Thu', 'Gia'])[1 + i % 6],
                          (ARRAY['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Linh', 'Nam', 'Phúc', 'Trang'])[1 + i % 10]),
       CASE WHEN i % 7 = 0 THEN NULL
            ELSE (ARRAY['090', '091', '093', '094', '096', '097', '098', '086', '032', '035', '038', '070', '077', '081', '088'])[1 + i % 15]
                 || lpad((i * 7919 % 10000000)::text, 7, '0') END,
       (ARRAY['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'])[1 + floor(random() * 5)::int],
       timestamptz '2025-01-01 08:00+07' + (floor(random() * 600) || ' days')::interval
FROM generate_series(301, 100000) i;

-- B2 · 998.000 more orders ⇒ 1.000.000 in total. created_at grows with the id, like in a real shop.
--      power(random(), 1.3) ⇒ low customer ids buy more often (customer 1: 142 orders; the average is 10).
--      Customers 291–300 still never buy (Lab 3). Only orders of the last two days are still 'pending'.
INSERT INTO orders (customer_id, status, created_at)
SELECT c,
       CASE WHEN t >= timestamptz '2026-09-29 00:00+07' THEN (CASE WHEN r < 0.8 THEN 'pending' ELSE 'paid' END)
            WHEN r < 0.08 THEN 'cancelled' WHEN r < 0.30 THEN 'paid' ELSE 'shipped' END,
       t
FROM (SELECT CASE WHEN c0 BETWEEN 291 AND 300 THEN c0 + 1000 ELSE c0 END AS c, r,
             timestamptz '2025-01-01 08:00+07' + (g * 638.0 / 998000) * interval '1 day' AS t
      FROM (SELECT g, 1 + floor(power(random(), 1.3) * 100000)::int AS c0, random() AS r
            FROM generate_series(1, 998000) g) x) y;

-- B3 · 1–4 different products per new order (k-th product = 1 + (id·7 + k·13) mod 48 — never twice in one order)
INSERT INTO order_item (order_id, product_id, qty, unit_price)
SELECT o.id, p.id, 1 + (o.id + k) % 3, p.price
FROM orders o
CROSS JOIN LATERAL generate_series(0, o.id % 4) k
JOIN product p ON p.id = 1 + (o.id * 7 + k * 13) % 48
WHERE o.id > 2000;

-- B4 · a payment for every new paid / shipped order
INSERT INTO payment (order_id, amount, method, paid_at)
SELECT o.id, sum(oi.qty * oi.unit_price),
       (ARRAY['cod', 'card', 'momo', 'bank'])[1 + (o.id % 4)::int],
       o.created_at + interval '2 hours'
FROM orders o JOIN order_item oi ON oi.order_id = o.id
WHERE o.id > 2000 AND o.status IN ('paid', 'shipped')
GROUP BY o.id;

VACUUM ANALYZE;
\timing off

-- Check — must print 100000 | 1000000 | 2500000 | 917153 | 3121
SELECT (SELECT count(*) FROM customer) AS customers, (SELECT count(*) FROM orders) AS orders,
       (SELECT count(*) FROM order_item) AS order_lines, (SELECT count(*) FROM payment) AS payments,
       (SELECT count(*) FROM orders WHERE status = 'pending') AS pending;

-- How big is the shop now? (heap = the table itself, indexes = all its indexes)
SELECT c.relname AS "table", pg_size_pretty(pg_relation_size(c.oid)) AS heap,
       pg_size_pretty(pg_indexes_size(c.oid)) AS indexes, pg_size_pretty(pg_total_relation_size(c.oid)) AS total
FROM pg_class c
WHERE c.relnamespace = 'shop'::regnamespace AND c.relkind = 'r'
  AND c.relname IN ('customer', 'orders', 'order_item', 'payment')
ORDER BY pg_total_relation_size(c.oid) DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- TODO — make the slow screens fast. For EVERY step: measure → read the plan → guess → fix → measure again.
--   measure = EXPLAIN (ANALYZE, BUFFERS) <query>; write down the top node, Execution Time and shared hit/read.
--   P1  audit: which foreign-key columns have no index? — then the order-history page of customer 42
--       (20 latest orders + amount) and "delete customer 300": add the missing index ON PRODUCTION
--       (CREATE INDEX CONCURRENTLY — and see why it refuses to run inside BEGIN)
--   P2  the same page: one composite index that filters AND sorts (no Sort node, LIMIT stops after 20 rows);
--       what Prisma's @@index([customerId, createdAt(sort: Desc)]) writes; drop the index it makes redundant
--   P3  the account badge "orders by status" of customer 42: a covering index (INCLUDE) ⇒ Index Only Scan;
--       Heap Fetches before and after VACUUM
--   P4  the admin queue "50 oldest pending orders": full index vs partial index — size and speed;
--       the prepared-statement (generic plan) trap
--   P5  login by e-mail: lower(email) = lower(…) ignores the UNIQUE index — two fixes; the numeric-literal trap on id
--   P6  flash sale: import 100.000 orders — what every index costs on INSERT; stale statistics ⇒ ANALYZE
--   P7  which indexes did nobody use? (pg_stat_user_indexes) — drop them
-- Pass when: page 20 rows with no Sort node and ≥ 100× faster · badge = Index Only Scan, Heap Fetches 0 ·
--            queue on a partial index of < 1 MB · login on customer_email_key · the INSERT report shows the
--            FK trigger time · idx_scan = 0 found and dropped
-- ═══════════════════════════════════════════════════════════════════════════
