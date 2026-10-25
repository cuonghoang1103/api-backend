-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 1 — SOLUTION: the 8-table schema, built from the ERD
-- Lab 1 — ĐÁP ÁN: lược đồ 8 bảng dựng từ ERD
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- Run (Docker, container "pgdemo" from lesson 0.3):
--   docker exec -i pgdemo psql -U postgres -d ctshop < lab1-solution.sql
-- Re-runnable: it drops and rebuilds schema "shop" every time.
-- Chạy lại bao nhiêu lần cũng được: mỗi lần xoá và dựng lại schema "shop".
--
-- This DDL is IDENTICAL to ctshop-schema.sql (the standard schema every later lab uses).
-- DDL này GIỐNG HỆT ctshop-schema.sql (lược đồ chuẩn mà mọi lab sau dùng).
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

\dt shop.*
