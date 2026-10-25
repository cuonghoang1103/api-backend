-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop — DỮ LIỆU MẪU (tất định: chạy lần nào cũng ra đúng các con số trong lab).
-- Chạy SAU ctshop-schema.sql:  psql -d ctshop -f ctshop-data.sql
-- 12 danh mục (cây 2 tầng) · 48 sản phẩm · 300 khách · 2.000 đơn (01/2025 → 01/10/2026) · dòng đơn · thanh toán · nhật ký kho · đánh giá
--
-- CON SỐ ĐẾM CHUẨN (PostgreSQL 17.11, đo lại 25/10/2026 sau khi agent lab thay tên/giá sản phẩm bằng hàng thật):
--   category 12 (id 1–4 gốc, 5 Bút bi · 6 Bút chì & tẩy · 7 Bút dạ quang · 8 Vở ô ly · 9 Sổ tay · 10 Máy tính cầm tay
--               · 11 Thước & compa · 12 Giáo trình IT)
--   product 48 (sku CT0501…CT1206, giá 4.000 → 790.000 đ) · customer 300 (42 khách không có số điện thoại;
--               Cần Thơ 65 · Hải Phòng 64 · Đà Nẵng 61 · Hà Nội 56 · TP.HCM 54) · khách 291–300 CHƯA MUA (290 khách có đơn)
--   orders 2.000 (shipped 910 · paid 753 · pending 180 · cancelled 157) · order_item 5.000 · payment 1.663
--               (tổng 946.164.000 đ) · stock_movement 429 · review 678
-- ⚠ Giờ hiển thị theo TimeZone của phiên: các lab dùng SET TimeZone = 'Asia/Ho_Chi_Minh' (ảnh Docker postgres:17 mặc định UTC).
-- ═══════════════════════════════════════════════════════════════════════════
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
