-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 2 — STARTER: an EMPTY standard schema + your step list
-- Lab 2 — FILE KHỞI ĐẦU: lược đồ chuẩn RỖNG + danh sách việc phải làm
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- 1) Copy the 4 CSV files into the container (chép 4 file CSV vào container):
--      for f in lab2-products.csv lab2-customers.csv lab2-orders.csv lab2-price-update.csv; do docker cp $f pgdemo:/tmp/; done
-- 2) Rebuild the empty schema (this file):
--      docker exec -i pgdemo psql -U postgres -d ctshop < lab2-start.sql
-- 3) Open psql and do the TODOs at the bottom one by one, checking each output against the lesson:
--      docker exec -it pgdemo psql -U postgres -d ctshop
-- (psql installed on your machine? Use the local path of the CSV in \copy instead of /tmp/…)
-- ═══════════════════════════════════════════════════════════════════════════
DROP SCHEMA IF EXISTS shop CASCADE;
CREATE SCHEMA shop;
SET search_path = shop;

-- Order of CREATE = order of the FK arrows: a parent table must exist before its child.
-- Thứ tự CREATE = thứ tự mũi tên khoá ngoại: bảng cha phải có trước bảng con.
--   customer, category  →  product, orders  →  order_item, payment, stock_movement, review

-- 1 · customer — one row per registered shopper (khách hàng)
CREATE TABLE customer (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- surrogate key, never changes
  email       text        NOT NULL,
  full_name   text        NOT NULL,
  phone       text,                                               -- optional (không bắt buộc)
  city        text        NOT NULL DEFAULT 'Hà Nội',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_email_key   UNIQUE (email),                 -- one account per email
  CONSTRAINT customer_email_check CHECK (email = lower(email) AND email LIKE '%_@_%.__%')
);

-- 2 · category — a tree: a sub-category points to its parent (cây danh mục)
CREATE TABLE category (
  id         int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,       -- small table ⇒ int is enough
  name       text NOT NULL UNIQUE,
  parent_id  int  REFERENCES category(id) ON DELETE RESTRICT      -- NULL = root; cannot delete a parent that has children
);

-- 3 · product — what is on the shelf (sản phẩm)
CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text          NOT NULL UNIQUE,                     -- the code printed on the label
  name         text          NOT NULL,
  category_id  int           NOT NULL REFERENCES category(id),    -- same type as category.id (int)
  price        numeric(12,2) NOT NULL CHECK (price > 0),          -- money ⇒ numeric, never float
  stock        int           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attrs        jsonb         NOT NULL DEFAULT '{}',               -- brand, color, tags… (Lab 7)
  is_active    boolean       NOT NULL DEFAULT true,               -- "soft delete": hide instead of DELETE
  created_at   timestamptz   NOT NULL DEFAULT now()
);

-- 4 · orders — "order" is a reserved word, so the table is "orders" (đơn hàng)
CREATE TABLE orders (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  bigint      NOT NULL REFERENCES customer(id),      -- NO ACTION: a customer with orders cannot be deleted
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  note         text
);

-- 5 · order_item — junction orders ↔ product, keeps the price AT THE TIME OF PURCHASE (dòng đơn)
CREATE TABLE order_item (
  order_id    bigint        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  -- lines live and die with their order
  product_id  bigint        NOT NULL REFERENCES product(id),                    -- a sold product cannot be deleted
  qty         int           NOT NULL CHECK (qty > 0),
  unit_price  numeric(12,2) NOT NULL CHECK (unit_price > 0),
  PRIMARY KEY (order_id, product_id)                               -- a product appears once per order (raise qty instead)
);

-- 6 · payment — at most ONE successful payment per order (thanh toán)
CREATE TABLE payment (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id  bigint        NOT NULL UNIQUE REFERENCES orders(id),  -- UNIQUE on the FK ⇒ one-to-zero-or-one
  amount    numeric(12,2) NOT NULL CHECK (amount > 0),
  method    text          NOT NULL CHECK (method IN ('cod', 'card', 'momo', 'bank')),
  paid_at   timestamptz   NOT NULL DEFAULT now()
);

-- 7 · stock_movement — every change of stock is one row (nhật ký kho; Lab 6 fills it with a trigger)
CREATE TABLE stock_movement (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint      NOT NULL REFERENCES product(id),
  change      int         NOT NULL CHECK (change <> 0),           -- +import, −sale; zero is meaningless
  reason      text        NOT NULL CHECK (reason IN ('import', 'sale', 'return', 'adjust')),
  order_id    bigint      REFERENCES orders(id),                  -- optional: only sales/returns belong to an order
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 8 · review — one review per customer per product (đánh giá)
CREATE TABLE review (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id   bigint      NOT NULL REFERENCES product(id),
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);


SET TimeZone = 'Asia/Ho_Chi_Minh';   -- the lab's times are Vietnam time (giờ Việt Nam)
\dt shop.*

-- ── TODO (type in psql, one by one — gõ trong psql, từng câu) ──────────────────────────────
-- SET search_path = shop;  SET TimeZone = 'Asia/Ho_Chi_Minh';
-- S1  INSERT the 4 root categories in ONE statement, RETURNING id, name
-- S2  INSERT the 8 sub-categories in ONE statement, using the parent ids S1 returned
-- S3  \copy product (sku, name, category_id, price, stock, attrs, is_active, created_at) FROM '/tmp/lab2-products.csv' …
-- S4  \copy customer (…) FROM '/tmp/lab2-customers.csv' …   then CHECK: min(id) = 1, max(id) = 300
-- S5  \copy orders (…) FROM '/tmp/lab2-orders.csv' …
-- S6  supplier price list: staging table price_update + \copy + INSERT … SELECT … ON CONFLICT (sku) DO UPDATE
-- Q1–Q10  the ten questions in the lesson
-- U1–U5   UPDATE / DELETE, always inside BEGIN … then COMMIT or ROLLBACK
