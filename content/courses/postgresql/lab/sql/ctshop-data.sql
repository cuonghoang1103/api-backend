-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop — DỮ LIỆU MẪU (tất định: chạy lần nào cũng ra đúng các con số trong lab).
-- Chạy SAU ctshop-schema.sql:  psql -d ctshop -f ctshop-data.sql
-- 12 danh mục (cây 2 tầng) · 48 sản phẩm · 300 khách · 2.000 đơn (01/2025 → 09/2026) · dòng đơn · thanh toán · nhật ký kho · đánh giá
-- ═══════════════════════════════════════════════════════════════════════════
SET search_path = shop;
SELECT setseed(0.42);

-- ── Danh mục: 4 gốc + 8 con ──
INSERT INTO category (name, parent_id)
SELECT name, parent_id FROM (VALUES
  ('Bút & mực', NULL::int), ('Vở & giấy', NULL), ('Dụng cụ học tập', NULL), ('Sách & tài liệu', NULL)) v(name, parent_id);
INSERT INTO category (name, parent_id)
SELECT c.name, p.id FROM (VALUES
  ('Bút bi', 'Bút & mực'), ('Bút chì & tẩy', 'Bút & mực'), ('Bút dạ quang', 'Bút & mực'),
  ('Vở ô ly', 'Vở & giấy'), ('Sổ tay', 'Vở & giấy'),
  ('Máy tính cầm tay', 'Dụng cụ học tập'), ('Thước & compa', 'Dụng cụ học tập'),
  ('Giáo trình IT', 'Sách & tài liệu')) c(name, parent) JOIN category p ON p.name = c.parent;

-- ── Sản phẩm: 6 mỗi danh mục con ──
INSERT INTO product (sku, name, category_id, price, stock, attrs, created_at)
SELECT format('CT%s%s', lpad(c.id::text, 2, '0'), lpad(g::text, 2, '0')),
       format('%s %s', c.name, (ARRAY['Thiên Long', 'Hồng Hà', 'Campus', 'Deli', 'Casio', 'Stabilo'])[g]),
       c.id,
       round(((ARRAY[6000, 12000, 25000, 45000, 89000, 350000])[g] * (0.8 + random() * 0.6))::numeric, -3),
       50 + floor(random() * 200)::int,
       jsonb_build_object('brand', (ARRAY['Thiên Long', 'Hồng Hà', 'Campus', 'Deli', 'Casio', 'Stabilo'])[g],
                          'color', (ARRAY['xanh', 'đen', 'đỏ', 'tím', 'vàng'])[1 + floor(random() * 5)::int],
                          'tags',  to_jsonb(ARRAY[(ARRAY['học sinh', 'sinh viên', 'văn phòng'])[1 + floor(random() * 3)::int]])),
       timestamptz '2025-01-01 08:00+07' + (g || ' days')::interval
FROM category c CROSS JOIN generate_series(1, 6) g
WHERE c.parent_id IS NOT NULL
ORDER BY c.id, g;

-- ── Khách hàng: 300 ──
INSERT INTO customer (email, full_name, phone, city, created_at)
SELECT format('kh%s@ctshop.vn', lpad(i::text, 3, '0')),
       format('%s %s %s', (ARRAY['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'])[1 + i % 8],
                          (ARRAY['Văn', 'Thị', 'Minh', 'Quốc', 'Thu', 'Gia'])[1 + i % 6],
                          (ARRAY['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Linh', 'Nam', 'Phúc', 'Trang'])[1 + i % 10]),
       CASE WHEN i % 7 = 0 THEN NULL ELSE format('09%s', lpad((i * 7919 % 100000000)::text, 8, '0')) END,
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
