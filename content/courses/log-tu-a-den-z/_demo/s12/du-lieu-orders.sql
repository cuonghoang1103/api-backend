-- Bảng đơn hàng 2 triệu dòng, KHÔNG có chỉ mục trên customer_email (đúng lỗi hay gặp) — dùng cho 12.2 và Lab 12.
SET ROLE app;
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (id bigserial PRIMARY KEY, customer_email text NOT NULL, created_at timestamptz NOT NULL,
                     total numeric(12,0) NOT NULL, status text NOT NULL, note text);
INSERT INTO orders (customer_email, created_at, total, status, note)
SELECT 'khach' || (g::bigint * 7919 % 50000) || '@example.com',
       timestamptz '2026-11-24 00:00+07' - (g % 525600) * interval '1 minute',
       (g::bigint * 37 % 5000 + 1) * 1000,
       (ARRAY['paid','paid','paid','shipped','cancelled'])[g % 5 + 1], repeat('x', 60)
FROM generate_series(1, 2000000) g;
ANALYZE orders;
