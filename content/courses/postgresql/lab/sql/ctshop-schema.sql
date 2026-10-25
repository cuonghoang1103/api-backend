-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop — cửa hàng đồ học tập online. Lược đồ CHUẨN dùng chung cho 9 lab của
-- khoá cuongthai.com/courses/postgresql (Lab 1 dựng đúng lược đồ này từ ERD).
-- PostgreSQL 17. Chạy: psql -d ctshop -f ctshop-schema.sql
-- ═══════════════════════════════════════════════════════════════════════════
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
