-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 7 — START: a clean CT Shop at its standard size + the supplier's spec sheet + your to-do list
-- Lab 7 — KHỞI ĐẦU: CT Shop sạch, cỡ chuẩn (48 sản phẩm) + bảng thông số của nhà cung cấp (JSON) + danh sách việc
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- Run ONCE (it drops and rebuilds schema shop — whatever Lab 6 added is gone):
--   docker cp lab7-start.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab7-start.sql
-- Part A = ctshop-schema.sql + ctshop-data.sql (the standard shop, the same numbers as Labs 1–4 and 6).
-- Part B = shop.spec_feed: the technical specs the supplier sent for the catalogue, one JSON document per product
--          (a STAGING table — not one of the 8 tables of the model; the lab drops it at the end).
-- Then open psql:  docker exec -it pgdemo psql -U postgres -d ctshop
--   SET search_path = shop, public;  SET TimeZone = 'Asia/Ho_Chi_Minh';  SET max_parallel_workers_per_gather = 0;
-- ═══════════════════════════════════════════════════════════════════════════
\pset pager off

-- ── PART A — the standard shop ──
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

-- ── PART B — the supplier's spec sheet: 48 JSON documents, exactly as they arrived ──
CREATE TABLE spec_feed (
  line  int   PRIMARY KEY,          -- line number in the supplier's file
  doc   jsonb NOT NULL              -- {"sku": …, "specs": {…}}
);
INSERT INTO spec_feed (line, doc) VALUES
 ( 1, '{"sku": "CT0501", "specs": {"tip_mm": 0.5, "ink": "dầu", "pack": 1, "refill": false, "desc": "Bút bi quốc dân của học sinh, ngòi 0.5 mm, mực dầu ra đều, viết êm"}}'),
 ( 2, '{"sku": "CT0502", "specs": {"tip_mm": 0.5, "ink": "dầu", "pack": 20, "desc": "Hộp 20 cây cho cả lớp, ngòi 0.5 mm, mực xanh"}}'),
 ( 3, '{"sku": "CT0503", "specs": {"tip_mm": "0.7", "ink": "dầu", "pack": 1, "desc": "Ngòi 0.7 mm nét đậm, thân trong suốt, hợp ghi chép nhanh"}}'),
 ( 4, '{"sku": "CT0504", "specs": {"tip_mm": 0.5, "ink": "gel", "pack": 1, "desc": "Mực gel chống nước, nét mảnh, sinh viên hay dùng để ghi chú"}}'),
 ( 5, '{"sku": "CT0505", "specs": {"tip_mm": 0.5, "ink": "gel", "pack": 1, "refill": true, "desc": "Bút gel bấm có kẹp, thay ruột được, mực khô nhanh"}}'),
 ( 6, '{"sku": "CT0506", "specs": {"tip_mm": 0.7, "ink": "dầu", "pack": 12, "desc": "Bút bi bấm hộp 12 cây cho văn phòng"}}'),
 ( 7, '{"sku": "CT0601", "specs": {"hardness": "2B", "pack": 1, "desc": "Bút chì gỗ 2B cho bài thi trắc nghiệm, tô phiếu đậm, dễ tẩy"}}'),
 ( 8, '{"sku": "CT0602", "specs": {"tip_mm": 0.50, "hardness": "HB", "pack": 1, "refill": true, "desc": "Bút chì kim thân kim loại, ngòi 0.5 mm"}}'),
 ( 9, '{"sku": "CT0603", "specs": {"tip_mm": 0.5, "hardness": "2B", "pack": 40, "desc": "Tuýp 40 ruột chì 0.5 mm độ đậm 2B"}}'),
 (10, '{"sku": "CT0604", "specs": {"pack": 1, "desc": "Tẩy mềm không làm rách giấy, tẩy sạch nét chì 2B"}}'),
 (11, '{"sku": "CT0605", "specs": {"hardness": "2B", "pack": 12, "desc": "Hộp 12 bút chì 2B, gỗ chắc, dùng cho phiếu trắc nghiệm"}}'),
 (12, '{"sku": "CT0606", "specs": {"pack": 24, "desc": "Bút chì màu 24 màu cho học sinh tiểu học, màu tươi"}}'),
 (13, '{"sku": "CT0701", "specs": {"pack": 1, "tip": "dẹt", "desc": "Bút dạ quang đánh dấu sách giáo khoa, đầu dẹt"}}'),
 (14, '{"sku": "CT0702", "specs": {"pack": 1, "tip": "dẹt", "desc": "Bút đánh dấu kinh điển, mực lâu khô trên ngòi"}}'),
 (15, '{"sku": "CT0703", "specs": {"pack": 6, "tip": "dẹt", "desc": "Bộ 6 màu pastel nhẹ mắt cho ghi chú ôn thi"}}'),
 (16, '{"sku": "CT0704", "specs": {"pack": 1, "tip": "hai đầu", "desc": "Hai đầu: đầu dẹt để tô, đầu tròn để gạch chân"}}'),
 (17, '{"sku": "CT0705", "specs": {"pack": 5, "tip": "hai đầu", "desc": "Bộ 5 màu nhẹ, sinh viên hay dùng trong sổ bullet journal"}}'),
 (18, '{"sku": "CT0706", "specs": {"pack": 1, "tip": "dẹt", "desc": "Bút dạ quang mảnh, không lem mực in"}}'),
 (19, '{"sku": "CT0801", "specs": {"pages": 48, "ruling": "ô ly", "gsm": 70, "desc": "Vở ô ly cho học sinh tiểu học, giấy trắng ít lem"}}'),
 (20, '{"sku": "CT0802", "specs": {"pages": "96 trang", "ruling": "ô ly", "gsm": 70, "desc": "Vở ô ly 96 trang, bìa cứng"}}'),
 (21, '{"sku": "CT0803", "specs": {"pages": 80, "ruling": "kẻ ngang", "gsm": null, "desc": "Vở kẻ ngang giấy mịn, gáy may chắc"}}'),
 (22, '{"sku": "CT0804", "specs": {"pages": "200", "ruling": "kẻ ngang", "gsm": 70, "desc": "Vở dày 200 trang ghi bài cả học kỳ"}}'),
 (23, '{"sku": "CT0805", "specs": {"pages": 96, "pack": 10, "ruling": "ô ly", "gsm": 70, "desc": "Lốc 10 cuốn cho cả năm học"}}'),
 (24, '{"sku": "CT0806", "specs": {"pages": 120, "ruling": "kẻ ngang", "gsm": 80, "colour": "xanh", "desc": "Vở kẻ ngang bìa nhựa chống nước"}}'),
 (25, '{"sku": "CT0901", "specs": {"size": "A5", "pages": 100, "desc": "Sổ lò xo gáy xoắn, mở phẳng 360 độ"}}'),
 (26, '{"sku": "CT0902", "specs": {"size": "A5", "pages": 200, "cover": "bìa da", "desc": "Sổ bìa da có dây buộc, hợp làm quà"}}'),
 (27, '{"sku": "CT0903", "specs": {"size": "A5", "pages": 160, "ruling": "chấm", "desc": "Giấy chấm dot grid cho bullet journal"}}'),
 (28, '{"sku": "CT0904", "specs": {"size": "B5", "pages": 120, "ruling": "kẻ ngang", "desc": "Sổ B5 kẻ ngang ghi bài giảng đại học"}}'),
 (29, '{"sku": "CT0905", "specs": {"size": "76x76mm", "pages": 100, "desc": "Giấy note dán 100 tờ, keo dán lại nhiều lần"}}'),
 (30, '{"sku": "CT1001", "specs": {"functions": 521, "solar": true, "exam_ok": true, "desc": "Máy tính khoa học được mang vào phòng thi, giải phương trình, tích phân"}}'),
 (31, '{"sku": "CT1002", "specs": {"functions": 453, "solar": true, "exam_ok": true, "desc": "Máy tính khoa học quen thuộc của học sinh cấp ba, được mang vào phòng thi"}}'),
 (32, '{"sku": "CT1003", "specs": {"functions": 453, "solar": "có", "exam_ok": true, "desc": "Máy tính khoa học giá tốt, được mang vào phòng thi"}}'),
 (33, '{"sku": "CT1004", "specs": {"functions": 552, "solar": true, "exam_ok": true, "desc": "Máy tính khoa học màn hình lớn, có bảng tuần hoàn"}}'),
 (34, '{"sku": "CT1005", "specs": {"digits": 12, "solar": true, "exam_ok": false, "desc": "Máy tính văn phòng 12 số, phím to"}}'),
 (35, '{"sku": "CT1006", "specs": {"functions": 240, "solar": false, "exam_ok": false, "desc": "Máy tính khoa học dùng pin, không mang vào phòng thi"}}'),
 (36, '{"sku": "CT1101", "specs": {"length_cm": 20, "material": "nhựa", "desc": "Thước kẻ nhựa trong, vạch chia rõ"}}'),
 (37, '{"sku": "CT1102", "specs": {"length_cm": 30, "material": "thép", "desc": "Thước thép không gỉ, cạnh vát"}}'),
 (38, '{"sku": "CT1103", "specs": {"length_cm": 15, "material": "nhựa", "pack": 3, "desc": "Bộ ê-ke và thước đo độ cho hình học"}}'),
 (39, '{"sku": "CT1104", "specs": {"material": "kim loại", "desc": "Compa dùng ruột chì kim, vẽ đường tròn tới 30 cm"}}'),
 (40, '{"sku": "CT1105", "specs": {"material": "kim loại", "desc": "Compa khớp chắc cho bản vẽ kỹ thuật"}}'),
 (41, '{"sku": "CT1106", "specs": {"length_cm": 30, "material": "nhựa", "pack": 4, "desc": "Bộ 4 thước cho môn vẽ kỹ thuật"}}'),
 (42, '{"sku": "CT1201", "specs": {"pages": 320, "format": "bản in", "year": 2025, "desc": "Mô hình quan hệ, SQL, chuẩn hoá, giao dịch, kèm bài tập có lời giải"}}'),
 (43, '{"sku": "CT1202", "specs": {"pages": 280, "format": "bản in", "year": 2024, "desc": "Lập trình hướng đối tượng với Java từ số 0"}}'),
 (44, '{"sku": "CT1203", "specs": {"pages": 464, "format": "bản in", "year": 2023, "desc": "Viết mã sạch: đặt tên, hàm ngắn, kiểm thử"}}'),
 (45, '{"sku": "CT1204", "specs": {"pages": 120, "format": "bản in", "year": 2026, "desc": "Tra nhanh câu lệnh SQL: JOIN, GROUP BY, chỉ mục"}}'),
 (46, '{"sku": "CT1205", "specs": {"pages": 360, "format": "bản in", "year": 2025, "desc": "Mảng, danh sách liên kết, cây, đồ thị, sắp xếp"}}'),
 (47, '{"sku": "CT1206", "specs": {"pages": 180, "format": "bản in", "year": 2026, "desc": "Đề luyện thi thực hành và trắc nghiệm cho sinh viên"}}'),
 (48, '{"sku": "CT1207", "specs": {"pages": 400, "format": "bản in", "year": 2026, "desc": "PostgreSQL từ số 0 tới production"}}');

-- Quick check — must print 12 | 48 | 300 | 2000 | 5000 | 1663 | 48
SELECT (SELECT count(*) FROM category) AS categories, (SELECT count(*) FROM product) AS products,
       (SELECT count(*) FROM customer) AS customers, (SELECT count(*) FROM orders) AS orders,
       (SELECT count(*) FROM order_item) AS order_lines, (SELECT count(*) FROM payment) AS payments,
       (SELECT count(*) FROM spec_feed) AS spec_docs;

-- ═══════════════════════════════════════════════════════════════════════════
-- TODO — a catalogue page with attribute filters, and a search box that forgives. Tools: Chapter 13
-- (jsonb, GIN, JSON_TABLE · full-text search, unaccent · pg_trgm) + functions/triggers of Chapter 12.
-- Setup (once per database):  CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
--                             CREATE EXTENSION IF NOT EXISTS pg_trgm  SCHEMA public;
--   J1  survey the feed: which keys, in how many documents, with which JSON types? which sku is unknown,
--       which product got no specs?
--   J2  merge the specs into product.attrs; guard attrs with CHECK constraints (they fail first — find out why,
--       repair the documents with jsonb_set / - / ||, then add them); the NULL trap of jsonb_set
--   J3  the marketplace opens: 60.000 seller listings. Filters "gel ink, 0.5 mm" and "100–200 pages":
--       @> with a GIN index (jsonb_path_ops), EXPLAIN before / after; the text-comparison traps of ->>
--   J4  an attribute table for accounting with JSON_TABLE (PG17), tags as rows (NESTED PATH); what bad data does to it
--   S1  a search configuration vn_unaccent: "but bi thien long" must find "Bút bi Thiên Long"; f_unaccent (IMMUTABLE)
--   S2  the search document: name (A) + category (B) + brand and description (C) — why it cannot be a generated
--       column, a trigger instead; GIN; websearch_to_tsquery, ts_rank, ts_headline
--   S3  typos and autocomplete with pg_trgm: "casoi fx 580", "thien lomg"; thresholds; KNN with GiST
--   S4  search_products(q): full-text first, trigram when it finds nothing — one function, ranked; sizes and timings
-- Pass when: the feed survey finds 4 badly typed values, 1 unknown sku and 1 product without specs ·
--            the CHECK constraints are in place and reject a bad document · the attribute filter is a Bitmap Index Scan ·
--            "but bi thien long", "giao trinh" and "casoi fx 580" all return results through search_products
-- ═══════════════════════════════════════════════════════════════════════════
