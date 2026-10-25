/**
 * Lab 1 — CT Shop: từ ERD tới lược đồ chạy được (sau Chương 3). Agent lab, 25/10/2026.
 * Chèn vào Chương 3 bằng lab/index.mjs (LAB_SAU[3]) — sau bài 3.4, trước quiz.
 * Mọi output = chạy thật PostgreSQL 17.11 (container pgcourse17). Tệp tải về: lab/sql/lab1-*.sql → R2 files/academy/PG/labs/v1/.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-1.mjs';
import { img } from '../_slides.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Khối SQL: tô chú thích -- … bằng tok-comment. */
const code = (s) => `<pre><code class="language-sql">${esc(s).split('\n').map((l) => l.replace(/(--.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;
const ERD = `<div class="anh-slide"><img src="${img('pg-lab-1', 5)}" alt="CT Shop ERD: 8 tables, 10 relationships" loading="lazy" width="1280" height="720" /></div>`;

/* Sinh từ lab/sql/lab1-solution.sql (giữ trùng khớp tệp tải về). */
const T = {
  customer: `CREATE TABLE customer (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- surrogate key, never changes
  email       text        NOT NULL,
  full_name   text        NOT NULL,
  phone       text,                                               -- optional (không bắt buộc)
  city        text        NOT NULL DEFAULT 'Hà Nội',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_email_key   UNIQUE (email),                 -- one account per email
  CONSTRAINT customer_email_check CHECK (email = lower(email) AND email LIKE '%_@_%.__%')
);`,
  category: `CREATE TABLE category (
  id         int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,       -- small table ⇒ int is enough
  name       text NOT NULL UNIQUE,
  parent_id  int  REFERENCES category(id) ON DELETE RESTRICT      -- NULL = root; cannot delete a parent that has children
);`,
  product: `CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text          NOT NULL UNIQUE,                     -- the code printed on the label
  name         text          NOT NULL,
  category_id  int           NOT NULL REFERENCES category(id),    -- same type as category.id (int)
  price        numeric(12,2) NOT NULL CHECK (price > 0),          -- money ⇒ numeric, never float
  stock        int           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attrs        jsonb         NOT NULL DEFAULT '{}',               -- brand, color, tags… (Lab 7)
  is_active    boolean       NOT NULL DEFAULT true,               -- "soft delete": hide instead of DELETE
  created_at   timestamptz   NOT NULL DEFAULT now()
);`,
  orders: `CREATE TABLE orders (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  bigint      NOT NULL REFERENCES customer(id),      -- NO ACTION: a customer with orders cannot be deleted
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  note         text
);`,
  order_item: `CREATE TABLE order_item (
  order_id    bigint        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  -- lines live and die with their order
  product_id  bigint        NOT NULL REFERENCES product(id),                    -- a sold product cannot be deleted
  qty         int           NOT NULL CHECK (qty > 0),
  unit_price  numeric(12,2) NOT NULL CHECK (unit_price > 0),
  PRIMARY KEY (order_id, product_id)                               -- a product appears once per order (raise qty instead)
);`,
  payment: `CREATE TABLE payment (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id  bigint        NOT NULL UNIQUE REFERENCES orders(id),  -- UNIQUE on the FK ⇒ one-to-zero-or-one
  amount    numeric(12,2) NOT NULL CHECK (amount > 0),
  method    text          NOT NULL CHECK (method IN ('cod', 'card', 'momo', 'bank')),
  paid_at   timestamptz   NOT NULL DEFAULT now()
);`,
  stock_movement: `CREATE TABLE stock_movement (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint      NOT NULL REFERENCES product(id),
  change      int         NOT NULL CHECK (change <> 0),           -- +import, −sale; zero is meaningless
  reason      text        NOT NULL CHECK (reason IN ('import', 'sale', 'return', 'adjust')),
  order_id    bigint      REFERENCES orders(id),                  -- optional: only sales/returns belong to an order
  created_at  timestamptz NOT NULL DEFAULT now()
);`,
  review: `CREATE TABLE review (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id   bigint      NOT NULL REFERENCES product(id),
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);`,
};

const OUT_DT = `             List of relations
 Schema |      Name      | Type  |  Owner
--------+----------------+-------+----------
 shop   | category       | table | postgres
 shop   | customer       | table | postgres
 shop   | order_item     | table | postgres
 shop   | orders         | table | postgres
 shop   | payment        | table | postgres
 shop   | product        | table | postgres
 shop   | review         | table | postgres
 shop   | stock_movement | table | postgres
(8 rows)`;

const OUT_EMAIL = `    email     | accepted
--------------+----------
 an@ctshop.vn | t
 a@b.cc       | t
 a@b.c        | f
 @ctshop.vn   | f
 an@ctshop    | f
 An@ctshop.vn | f
(6 rows)`;

/* Output thật của lab1-check.sql (PG 17.11) — mốc giờ của bạn sẽ khác (now()). */
const CHK = {
  A: `== A. Valid rows — must succeed ==
 id |     email      |   phone    |  city   | has_time
----+----------------+------------+---------+----------
  1 | an@ctshop.vn   |            | Hà Nội  | t
  2 | binh@ctshop.vn | 0901234567 | Đà Nẵng | t
(2 rows)

 id |  sku   |  price   | stock | attrs | is_active
----+--------+----------+-------+-------+-----------
  1 | CT0201 |  5000.00 |   100 | {}    | t
  2 | CT0202 | 28000.00 |     0 | {}    | t
(2 rows)

 id | customer_id | status
----+-------------+---------
  1 |           1 | pending
  2 |           1 | paid
(2 rows)`,
  customer: `T01 duplicate email
psql:/tmp/lab1-check.sql:43: ERROR:  duplicate key value violates unique constraint "customer_email_key"
DETAIL:  Key (email)=(an@ctshop.vn) already exists.
T02 email with capital letters
psql:/tmp/lab1-check.sql:45: ERROR:  new row for relation "customer" violates check constraint "customer_email_check"
DETAIL:  Failing row contains (4, An@CTShop.vn, Viết hoa, null, Hà Nội, 2026-10-25 19:29:18.385+07).
T03 email without @
psql:/tmp/lab1-check.sql:47: ERROR:  new row for relation "customer" violates check constraint "customer_email_check"
DETAIL:  Failing row contains (5, an.ctshop.vn, Thiếu a còng, null, Hà Nội, 2026-10-25 19:29:18.385296+07).
T04 missing full_name
psql:/tmp/lab1-check.sql:49: ERROR:  null value in column "full_name" of relation "customer" violates not-null constraint
DETAIL:  Failing row contains (6, chi@ctshop.vn, null, null, Hà Nội, 2026-10-25 19:29:18.385518+07).
T05 typing the id yourself
psql:/tmp/lab1-check.sql:51: ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.`,
  category: `T06 duplicate category name
psql:/tmp/lab1-check.sql:53: ERROR:  duplicate key value violates unique constraint "category_name_key"
DETAIL:  Key (name)=(Bút bi) already exists.
T07 parent category that does not exist
psql:/tmp/lab1-check.sql:55: ERROR:  insert or update on table "category" violates foreign key constraint "category_parent_id_fkey"
DETAIL:  Key (parent_id)=(99) is not present in table "category".`,
  product: `T08 duplicate sku
psql:/tmp/lab1-check.sql:57: ERROR:  duplicate key value violates unique constraint "product_sku_key"
DETAIL:  Key (sku)=(CT0201) already exists.
T09 price 0
psql:/tmp/lab1-check.sql:59: ERROR:  new row for relation "product" violates check constraint "product_price_check"
DETAIL:  Failing row contains (4, CT0203, Hàng tặng, 2, 0.00, 0, {}, t, 2026-10-25 19:29:18.3866+07).
T10 negative stock
psql:/tmp/lab1-check.sql:61: ERROR:  new row for relation "product" violates check constraint "product_stock_check"
DETAIL:  Failing row contains (5, CT0204, Kho âm, 2, 5000.00, -5, {}, t, 2026-10-25 19:29:18.386868+07).
T11 category that does not exist
psql:/tmp/lab1-check.sql:63: ERROR:  insert or update on table "product" violates foreign key constraint "product_category_id_fkey"
DETAIL:  Key (category_id)=(99) is not present in table "category".`,
  orders: `T12 unknown order status
psql:/tmp/lab1-check.sql:65: ERROR:  new row for relation "orders" violates check constraint "orders_status_check"
DETAIL:  Failing row contains (3, 1, done, 2026-10-25 19:29:18.387364+07, null).
T13 order for a customer that does not exist
psql:/tmp/lab1-check.sql:67: ERROR:  insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"
DETAIL:  Key (customer_id)=(99) is not present in table "customer".`,
  order_item: `T14 quantity 0
psql:/tmp/lab1-check.sql:69: ERROR:  new row for relation "order_item" violates check constraint "order_item_qty_check"
DETAIL:  Failing row contains (2, 2, 0, 28000.00).
T15 same product twice in one order
psql:/tmp/lab1-check.sql:71: ERROR:  duplicate key value violates unique constraint "order_item_pkey"
DETAIL:  Key (order_id, product_id)=(1, 1) already exists.
T16 order line for a product that does not exist
psql:/tmp/lab1-check.sql:73: ERROR:  insert or update on table "order_item" violates foreign key constraint "order_item_product_id_fkey"
DETAIL:  Key (product_id)=(99) is not present in table "product".`,
  payment: `T17 second payment for the same order
psql:/tmp/lab1-check.sql:75: ERROR:  duplicate key value violates unique constraint "payment_order_id_key"
DETAIL:  Key (order_id)=(2) already exists.
T18 unknown payment method
psql:/tmp/lab1-check.sql:77: ERROR:  new row for relation "payment" violates check constraint "payment_method_check"
DETAIL:  Failing row contains (3, 1, 38000.00, paypal, 2026-10-25 19:29:18.388752+07).
T19 payment amount 0
psql:/tmp/lab1-check.sql:79: ERROR:  new row for relation "payment" violates check constraint "payment_amount_check"
DETAIL:  Failing row contains (4, 1, 0.00, cod, 2026-10-25 19:29:18.388905+07).`,
  stock_movement: `T20 stock change 0
psql:/tmp/lab1-check.sql:81: ERROR:  new row for relation "stock_movement" violates check constraint "stock_movement_change_check"
DETAIL:  Failing row contains (2, 1, 0, adjust, null, 2026-10-25 19:29:18.389166+07).
T21 unknown stock reason
psql:/tmp/lab1-check.sql:83: ERROR:  new row for relation "stock_movement" violates check constraint "stock_movement_reason_check"
DETAIL:  Failing row contains (3, 1, 5, gift, null, 2026-10-25 19:29:18.389296+07).`,
  review: `T22 rating 6 stars
psql:/tmp/lab1-check.sql:85: ERROR:  new row for relation "review" violates check constraint "review_rating_check"
DETAIL:  Failing row contains (2, 2, 1, 6, null, 2026-10-25 19:29:18.389463+07).
T23 second review of the same product by the same customer
psql:/tmp/lab1-check.sql:87: ERROR:  duplicate key value violates unique constraint "review_product_id_customer_id_key"
DETAIL:  Key (product_id, customer_id)=(1, 1) already exists.`,
  C: `== C. ON DELETE rules ==
T24 delete a category that still has a child -> must fail (RESTRICT)
psql:/tmp/lab1-check.sql:91: ERROR:  update or delete on table "category" violates foreign key constraint "category_parent_id_fkey" on table "category"
DETAIL:  Key (id)=(1) is still referenced from table "category".
T25 delete a customer who has orders -> must fail
psql:/tmp/lab1-check.sql:93: ERROR:  update or delete on table "customer" violates foreign key constraint "orders_customer_id_fkey" on table "orders"
DETAIL:  Key (id)=(1) is still referenced from table "orders".
T26 delete a product that was sold -> must fail
psql:/tmp/lab1-check.sql:95: ERROR:  update or delete on table "product" violates foreign key constraint "order_item_product_id_fkey" on table "order_item"
DETAIL:  Key (id)=(1) is still referenced from table "order_item".
T27 delete an order that has a payment -> must fail
psql:/tmp/lab1-check.sql:97: ERROR:  update or delete on table "orders" violates foreign key constraint "payment_order_id_fkey" on table "payment"
DETAIL:  Key (id)=(2) is still referenced from table "payment".
T28 delete an unpaid order -> succeeds, its lines go with it (CASCADE)
 order_id | lines
----------+-------
        1 |     2
        2 |     1
(2 rows)

 id | status
----+---------
  1 | pending
(1 row)

 order_id | lines
----------+-------
        2 |     1
(1 row)

T29 hide a product instead of deleting it (soft delete)
 id |  sku   | is_active
----+--------+-----------
  1 | CT0201 | f
(1 row)`,
  D: ` columns |        column_fingerprint
---------+----------------------------------
      44 | f26adcc3956f7b1242d84269ba258345
(1 row)

 constraints |      constraint_fingerprint
-------------+----------------------------------
          34 | 0a360bffadc8373fcf6b177ba6d6f692
(1 row)`,
};

const TRAP_ORDER = `ctshop=# CREATE TABLE order (id bigint PRIMARY KEY);
ERROR:  syntax error at or near "order"
LINE 1: CREATE TABLE order (id bigint PRIMARY KEY);
                     ^`;
const TRAP_PARENT = `ctshop=# CREATE TABLE orders (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, customer_id bigint NOT NULL REFERENCES customer(id));
ERROR:  relation "customer" does not exist`;
const TRAP_NULL = `ctshop=# CREATE TABLE orders_bad (id int PRIMARY KEY, status text CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')));
CREATE TABLE
ctshop=# INSERT INTO orders_bad VALUES (1, NULL);
INSERT 0 1
ctshop=# SELECT id, status, status IS NULL AS is_null FROM orders_bad;
 id | status | is_null
----+--------+---------
  1 |        | t
(1 row)`;
const TRAP_CASE = `ctshop=# CREATE TABLE customer_bad (id int PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE
ctshop=# INSERT INTO customer_bad VALUES (1, 'an@ctshop.vn'), (2, 'An@CTShop.vn');
INSERT 0 2`;

const FILES_EN = `${card(`${F}/lab1-start.sql`, '🧩', 'lab1-start.sql — starter', 'Schema shop, column names and types given, 8 TODOs: you write the keys and constraints', 'DOWNLOAD →')}
${card(`${F}/lab1-check.sql`, '🧪', 'lab1-check.sql — check script', '12 valid rows, 23 bad rows, 6 delete/update tests, 2 fingerprints, clean-up', 'DOWNLOAD →')}
${card(`${F}/lab1-solution.sql`, '🔑', 'lab1-solution.sql — solution', 'Identical to the standard ctshop-schema.sql used by Labs 2–9. Open it after your own attempt.', 'DOWNLOAD →')}`;
const FILES_VI = `${card(`${F}/lab1-start.sql`, '🧩', 'lab1-start.sql — tệp khởi đầu', 'Schema shop, đã cho tên cột và kiểu, 8 chỗ TODO: bạn viết khoá và ràng buộc', 'TẢI VỀ →')}
${card(`${F}/lab1-check.sql`, '🧪', 'lab1-check.sql — tệp kiểm', '12 dòng hợp lệ, 23 dòng sai, 6 phép thử xoá/sửa, 2 dấu vân tay, dọn dẹp', 'TẢI VỀ →')}
${card(`${F}/lab1-solution.sql`, '🔑', 'lab1-solution.sql — đáp án', 'Giống hệt ctshop-schema.sql chuẩn dùng cho Lab 2–9. Chỉ mở sau khi đã tự làm.', 'TẢI VỀ →')}`;

const SETUP = `$ docker exec -it pgdemo psql -U postgres -c "CREATE DATABASE ctshop;"
CREATE DATABASE
$ docker exec -i pgdemo psql -U postgres -d ctshop < lab1-start.sql
$ docker cp lab1-check.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab1-check.sql`;

/** Một bước dựng bảng (EN/VI): việc phải làm + gợi ý + đáp án ẩn + output kiểm. */
const step = (n, t, lang, what, hints, chk) => `<h4>${lang === 'en' ? 'Step' : 'Bước'} ${n} — <code>${t}</code></h4>
<p>${what}</p>
<ul>${hints.map((h) => `<li>${h}</li>`).join('')}</ul>
${details(lang === 'en' ? `Solution — CREATE TABLE ${t}` : `Đáp án — CREATE TABLE ${t}`, code(T[t]))}
${chk ? `<p>${lang === 'en' ? 'When you run the check script, these tests must fail exactly like this:' : 'Khi chạy tệp kiểm, các phép thử này phải thất bại đúng như sau:'}</p>${out(chk)}` : ''}`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 1 · CT Shop · after Chapter 3</span>
<h2>From ERD to a working schema</h2>
<p class="lead">Chapter 3 gave you every tool: primary keys, foreign keys, NOT NULL, DEFAULT, UNIQUE, CHECK, identity, ON DELETE. This lab puts them together on a real project. You receive a data model and a list of business rules; you hand back a schema that <strong>refuses bad data on its own</strong> — then you prove it by trying to break every rule.</p>

<h3>1 · The brief</h3>
<p><strong>CT Shop</strong> sells school and office supplies online: pens, notebooks, calculators, IT textbooks. Over the next eight labs it grows from an empty database into a production app (Lab 9: Node.js + Prisma). The owner’s data model has 8 tables:</p>
${ERD}
<div class="table-wrap"><table>
<tr><th>Table</th><th>Business rules</th></tr>
<tr><td><code>customer</code></td><td><strong>R1</strong> email required, unique, always lower-case, shaped like a@b.cc · <strong>R2</strong> full name required, phone optional, city defaults to Hà Nội, created_at defaults to now</td></tr>
<tr><td><code>category</code></td><td><strong>R3</strong> name required and unique · <strong>R4</strong> a category may have a parent; a parent that still has children cannot be deleted</td></tr>
<tr><td><code>product</code></td><td><strong>R5</strong> sku required and unique, name required, exactly one category · <strong>R6</strong> price &gt; 0, stock ≥ 0 (default 0), attrs default <code>{}</code>, active by default</td></tr>
<tr><td><code>orders</code></td><td><strong>R7</strong> belongs to an existing customer; a customer with orders cannot be deleted · <strong>R8</strong> status ∈ pending, paid, shipped, cancelled — default pending; note optional</td></tr>
<tr><td><code>order_item</code></td><td><strong>R9</strong> a product appears at most once per order · <strong>R10</strong> qty &gt; 0, unit_price &gt; 0 (price at purchase time) · <strong>R11</strong> deleting an order deletes its lines; a sold product cannot be deleted</td></tr>
<tr><td><code>payment</code></td><td><strong>R12</strong> at most ONE payment per order, amount &gt; 0 · <strong>R13</strong> method ∈ cod, card, momo, bank; paid_at defaults to now</td></tr>
<tr><td><code>stock_movement</code></td><td><strong>R14</strong> change ≠ 0, reason ∈ import, sale, return, adjust · <strong>R15</strong> order is optional</td></tr>
<tr><td><code>review</code></td><td><strong>R16</strong> rating 1–5, one review per customer per product, text optional</td></tr>
</table></div>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li>Write the 8 <code>CREATE TABLE</code> statements in <code>lab1-start.sql</code> (column names and types are given).</li>
<li>Every id is <code>GENERATED ALWAYS AS IDENTITY</code>; <code>order_item</code> has a composite primary key.</li>
<li>Every rule R1–R16 is enforced by a constraint. Let PostgreSQL name the constraints, except the two on <code>customer.email</code> (<code>customer_email_key</code>, <code>customer_email_check</code>).</li>
<li>ON DELETE: CASCADE for order → lines, RESTRICT for the category tree, the default NO ACTION everywhere else.</li>
<li>The script is re-runnable (it starts with <code>DROP SCHEMA IF EXISTS shop CASCADE</code>).</li>
</ol>
<div class="callout ok"><p><strong>You pass when</strong> <code>lab1-check.sql</code> prints exactly <strong>27 ERROR lines</strong> (23 in part B, 4 in part C), part A and T28–T29 succeed, and both fingerprints in part D equal <code>f26adcc3…</code> and <code>0a360bff…</code>.</p></div>

<h3>3 · Downloads</h3>
${FILES_EN}
<p>Setup (container <code>pgdemo</code> from lesson 0.3):</p>
${out(SETUP)}
<p>psql installed on your machine? <code>psql -d ctshop -f lab1-start.sql</code> works the same. Budget 60–90 minutes; open the solutions below only after your own attempt.</p>

<h3>4 · Step by step</h3>
<p>Create the tables in the order of the foreign-key arrows — a foreign key can only point at a table that already exists. Level 1: customer, category · level 2: product, orders · level 3: order_item, payment, stock_movement, review. Getting it wrong looks like this:</p>
${out(TRAP_PARENT)}
${step(1, 'customer', 'en', 'Identity primary key, email unique and lower-case, sensible defaults.', [
  "<code>UNIQUE (email)</code> alone lets “An@ctshop.vn” and “an@ctshop.vn” in as two accounts — add <code>CHECK (email = lower(email) AND email LIKE '%_@_%.__%')</code>.",
  "<code>phone</code> has no NOT NULL (R2); <code>city</code> is NOT NULL with <code>DEFAULT 'Hà Nội'</code>.",
], CHK.customer)}
<p>What the email CHECK accepts (the expression run on six sample values):</p>${out(OUT_EMAIL)}
${step(2, 'category', 'en', 'A tree inside one table: a sub-category points at its parent.', [
  '<code>parent_id int REFERENCES category(id)</code> — a foreign key to the same table; NULL means a root category.',
  'R4 says a parent with children cannot be deleted: <code>ON DELETE RESTRICT</code>.',
  '<code>int</code> is enough for the id: a shop has dozens of categories, not billions.',
], CHK.category)}
${step(3, 'product', 'en', 'The shelf: price and stock must make sense, money is exact.', [
  '<code>price numeric(12,2) NOT NULL CHECK (price &gt; 0)</code> — never float for money (lesson 2.1).',
  '<code>category_id int NOT NULL REFERENCES category(id)</code> — same type as the parent key.',
  "<code>stock</code> DEFAULT 0 with <code>CHECK (stock &gt;= 0)</code>; <code>attrs jsonb</code> DEFAULT <code>'{}'</code>; <code>is_active</code> DEFAULT true (soft delete).",
], CHK.product)}
${step(4, 'orders', 'en', 'Called <code>orders</code>, because ORDER is a reserved word.', [
  "Status: <code>NOT NULL DEFAULT 'pending' CHECK (status IN (…))</code> — the NOT NULL matters, see the traps below.",
  '<code>customer_id bigint NOT NULL REFERENCES customer(id)</code> with the default NO ACTION: customers with orders stay (R7).',
], CHK.orders)}
${step(5, 'order_item', 'en', 'A junction table between orders and product.', [
  'No id column: <code>PRIMARY KEY (order_id, product_id)</code> enforces R9.',
  '<code>order_id … REFERENCES orders(id) ON DELETE CASCADE</code> (R11); <code>product_id</code> keeps NO ACTION.',
  '<code>CHECK (qty &gt; 0)</code>, <code>CHECK (unit_price &gt; 0)</code>.',
], CHK.order_item)}
${step(6, 'payment', 'en', 'At most one payment per order.', [
  'A foreign key alone allows many payments per order. <code>order_id bigint NOT NULL UNIQUE REFERENCES orders(id)</code> makes it zero-or-one.',
  '<code>method</code> CHECK with the four allowed values; <code>amount &gt; 0</code>.',
], CHK.payment)}
${step(7, 'stock_movement', 'en', 'Every change of stock becomes one row (Lab 6 will fill it with a trigger).', [
  '<code>CHECK (change &lt;&gt; 0)</code>; <code>reason</code> CHECK with four values.',
  '<code>order_id</code> is a foreign key <em>without</em> NOT NULL — an import belongs to no order (R15).',
], CHK.stock_movement)}
${step(8, 'review', 'en', 'One review per customer per product.', [
  '<code>rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5)</code>.',
  'A single id as primary key plus <code>UNIQUE (product_id, customer_id)</code>.',
], CHK.review)}
<h4>Step 9 — run it, twice</h4>
<p>Run your file. The end of the output must list the 8 tables:</p>${out(OUT_DT)}
<p>Run it again: the first lines now say <code>NOTICE:  drop cascades to 8 other objects</code> and the same 8 tables come back. That is what re-runnable means.</p>
<h4>Step 10 — the check script</h4>
<p>Part A inserts valid rows; the defaults must show up (city Hà Nội, stock 0, attrs <code>{}</code>, status pending):</p>${out(CHK.A)}
<p>Part B is the 23 errors shown in steps 1–8. Part C tests the ON DELETE rules — four refusals, one cascade, one soft delete:</p>${out(CHK.C)}
<p>T27 is the subtle one: order 2’s lines would cascade, but its payment refuses (NO ACTION) — and because one statement is all-or-nothing, the lines are restored too. Part D must print exactly these two fingerprints:</p>${out(CHK.D)}
<p>A different hash? Look at the 34-row constraint listing printed just above the fingerprints and compare: a missing NOT NULL, <code>CURRENT_TIMESTAMP</code> instead of <code>now()</code>, a bigint that should be int, a CHECK written another way. The 34 constraints are 8 PRIMARY KEY, 10 FOREIGN KEY, 5 UNIQUE and 11 CHECK. (NOT NULL is not in that list: in PostgreSQL 17 it lives on the column, which the column fingerprint covers.)</p>

<h3>5 · Full solution</h3>
${details('Show the whole lab1-solution.sql (identical to ctshop-schema.sql)', code(['DROP SCHEMA IF EXISTS shop CASCADE;', 'CREATE SCHEMA shop;', 'SET search_path = shop;', '', ...Object.values(T).map((t) => t + '\n')].join('\n')))}

<h3>6 · Traps</h3>
<div class="pitfall"><p><strong>Trap — <code>CREATE TABLE order</code>.</strong> ORDER is a reserved word (ORDER BY). Name the table <code>orders</code>; quoting <code>"order"</code> works but forces quotes in every query forever.</p></div>
${out(TRAP_ORDER)}
<div class="pitfall"><p><strong>Trap — a CHECK without NOT NULL.</strong> A CHECK rejects a row only when the condition is <em>false</em>. NULL makes it <em>unknown</em>, so the row gets in with no status at all:</p></div>
${out(TRAP_NULL)}
<div class="pitfall"><p><strong>Trap — UNIQUE without lower().</strong> Text comparison is case-sensitive, so these are two different values to UNIQUE — two accounts for one person:</p></div>
${out(TRAP_CASE)}
<div class="pitfall"><p><strong>Trap — expecting ids without gaps.</strong> Every INSERT that fails after the default was evaluated still consumes an identity number (part B: ids 4, 5, 6 appear in DETAIL lines although the rows were rejected). Identity numbers are names, not counters.</p></div>
<div class="pitfall"><p><strong>Trap — CASCADE on business records.</strong> <code>ON DELETE CASCADE</code> on <code>orders.customer_id</code> would let one <code>DELETE FROM customer</code> wipe that customer’s whole order history. Use CASCADE only where the child is literally part of the parent (order → lines).</p></div>

<h3>7 · Self-check</h3>
<ol>
<li>Why does <code>payment.order_id</code> need UNIQUE on top of the foreign key?</li>
<li>T27 deletes an order whose lines are ON DELETE CASCADE. Why does it still fail, and what happens to the lines?</li>
<li>You write <code>CHECK (rating BETWEEN 1 AND 5)</code> but forget NOT NULL. Which INSERT slips through?</li>
</ol>
${details('Answers', `<ol><li>Without UNIQUE an order could have many payments; UNIQUE on the FK turns one-to-many into one-to-zero-or-one.</li><li>The payment still references the order (NO ACTION). The DELETE fails as a whole, so the cascaded lines are rolled back too — nothing changes.</li><li>An INSERT with <code>rating = NULL</code>: the CHECK is unknown, and unknown passes.</li></ol>`)}

<h3>8 · Next: Lab 2</h3>
<p>Your tables are correct but empty. Lab 2 (after Chapter 4) loads 48 products, 300 customers and 2,000 orders with <code>\\copy</code>, applies a supplier price list with an UPSERT, answers ten business questions with real numbers, and changes data safely inside <code>BEGIN … ROLLBACK</code>.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 1 · CT Shop · sau Chương 3</span>
<h2>Từ ERD tới lược đồ chạy được</h2>
<p class="lead">Chương 3 đã trao đủ đồ nghề: khoá chính, khoá ngoại, NOT NULL, DEFAULT, UNIQUE, CHECK, identity, ON DELETE. Lab này ráp chúng lại trên một dự án thật. Bạn nhận một mô hình dữ liệu và danh sách luật nghiệp vụ; bạn giao lại một lược đồ <strong>tự từ chối dữ liệu sai</strong> — rồi chứng minh bằng cách cố tình phá từng luật.</p>

<h3>1 · Đề bài</h3>
<p><strong>CT Shop</strong> bán đồ học tập và văn phòng phẩm online: bút, vở, máy tính cầm tay, giáo trình IT. Qua tám lab tiếp theo nó lớn dần từ một database trống thành ứng dụng chạy production (Lab 9: Node.js + Prisma). Mô hình dữ liệu của chủ shop có 8 bảng:</p>
${ERD}
<div class="table-wrap"><table>
<tr><th>Bảng</th><th>Luật nghiệp vụ</th></tr>
<tr><td><code>customer</code></td><td><strong>R1</strong> email bắt buộc, không trùng, luôn viết thường, dạng a@b.cc · <strong>R2</strong> họ tên bắt buộc, số điện thoại không bắt buộc, thành phố mặc định Hà Nội, created_at mặc định là lúc tạo</td></tr>
<tr><td><code>category</code></td><td><strong>R3</strong> tên bắt buộc, không trùng · <strong>R4</strong> danh mục có thể có danh mục cha; danh mục cha còn con thì không được xoá</td></tr>
<tr><td><code>product</code></td><td><strong>R5</strong> sku bắt buộc, không trùng; tên bắt buộc; thuộc đúng một danh mục · <strong>R6</strong> giá &gt; 0, tồn kho ≥ 0 (mặc định 0), attrs mặc định <code>{}</code>, mặc định đang bán</td></tr>
<tr><td><code>orders</code></td><td><strong>R7</strong> thuộc một khách có thật; khách đã có đơn thì không được xoá · <strong>R8</strong> trạng thái ∈ pending, paid, shipped, cancelled — mặc định pending; ghi chú tuỳ ý</td></tr>
<tr><td><code>order_item</code></td><td><strong>R9</strong> mỗi sản phẩm xuất hiện tối đa một lần trong một đơn · <strong>R10</strong> qty &gt; 0, unit_price &gt; 0 (giá tại lúc mua) · <strong>R11</strong> xoá đơn thì xoá luôn dòng đơn; sản phẩm đã bán không được xoá</td></tr>
<tr><td><code>payment</code></td><td><strong>R12</strong> mỗi đơn tối đa MỘT thanh toán, số tiền &gt; 0 · <strong>R13</strong> phương thức ∈ cod, card, momo, bank; paid_at mặc định là lúc tạo</td></tr>
<tr><td><code>stock_movement</code></td><td><strong>R14</strong> change ≠ 0, lý do ∈ import, sale, return, adjust · <strong>R15</strong> gắn đơn hàng là tuỳ chọn</td></tr>
<tr><td><code>review</code></td><td><strong>R16</strong> chấm 1–5 sao, mỗi khách đánh giá mỗi sản phẩm một lần, nội dung tuỳ ý</td></tr>
</table></div>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li>Viết 8 câu <code>CREATE TABLE</code> vào <code>lab1-start.sql</code> (tên cột và kiểu đã cho sẵn).</li>
<li>Mọi id là <code>GENERATED ALWAYS AS IDENTITY</code>; <code>order_item</code> có khoá chính tổ hợp.</li>
<li>Mọi luật R1–R16 được cưỡng chế bằng ràng buộc. Để PostgreSQL tự đặt tên ràng buộc, trừ hai ràng buộc trên <code>customer.email</code> (<code>customer_email_key</code>, <code>customer_email_check</code>).</li>
<li>ON DELETE: CASCADE cho đơn → dòng đơn, RESTRICT cho cây danh mục, còn lại để mặc định NO ACTION.</li>
<li>Script chạy lại được (mở đầu bằng <code>DROP SCHEMA IF EXISTS shop CASCADE</code>).</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi</strong> <code>lab1-check.sql</code> in ra đúng <strong>27 dòng ERROR</strong> (23 ở phần B, 4 ở phần C), phần A và T28–T29 thành công, và hai dấu vân tay ở phần D bằng <code>f26adcc3…</code> và <code>0a360bff…</code>.</p></div>

<h3>3 · Tệp tải về</h3>
${FILES_VI}
<p>Chuẩn bị (container <code>pgdemo</code> ở bài 0.3):</p>
${out(SETUP)}
<p>Máy có cài psql? <code>psql -d ctshop -f lab1-start.sql</code> chạy y như vậy. Dành 60–90 phút; chỉ mở đáp án bên dưới sau khi đã tự làm.</p>

<h3>4 · Hướng dẫn từng bước</h3>
<p>Tạo bảng theo thứ tự mũi tên khoá ngoại — khoá ngoại chỉ trỏ được vào bảng đã có. Tầng 1: customer, category · tầng 2: product, orders · tầng 3: order_item, payment, stock_movement, review. Sai thứ tự sẽ ra thế này:</p>
${out(TRAP_PARENT)}
${step(1, 'customer', 'vi', 'Khoá chính identity, email không trùng và viết thường, các giá trị mặc định hợp lý.', [
  "Chỉ <code>UNIQUE (email)</code> thì “An@ctshop.vn” và “an@ctshop.vn” lọt vào thành hai tài khoản — thêm <code>CHECK (email = lower(email) AND email LIKE '%_@_%.__%')</code>.",
  "<code>phone</code> không có NOT NULL (R2); <code>city</code> NOT NULL với <code>DEFAULT 'Hà Nội'</code>.",
], CHK.customer)}
<p>Biểu thức CHECK của email chấp nhận gì (chạy thử trên sáu giá trị mẫu):</p>${out(OUT_EMAIL)}
${step(2, 'category', 'vi', 'Một cái cây trong một bảng: danh mục con trỏ về danh mục cha.', [
  '<code>parent_id int REFERENCES category(id)</code> — khoá ngoại trỏ về chính bảng đó; NULL là danh mục gốc.',
  'R4 nói danh mục cha còn con thì không xoá được: <code>ON DELETE RESTRICT</code>.',
  'id dùng <code>int</code> là đủ: shop có vài chục danh mục, không phải vài tỉ.',
], CHK.category)}
${step(3, 'product', 'vi', 'Kệ hàng: giá và tồn kho phải hợp lý, tiền phải chính xác.', [
  '<code>price numeric(12,2) NOT NULL CHECK (price &gt; 0)</code> — tiền không bao giờ dùng float (bài 2.1).',
  '<code>category_id int NOT NULL REFERENCES category(id)</code> — cùng kiểu với khoá cha.',
  "<code>stock</code> DEFAULT 0 kèm <code>CHECK (stock &gt;= 0)</code>; <code>attrs jsonb</code> DEFAULT <code>'{}'</code>; <code>is_active</code> DEFAULT true (xoá mềm).",
], CHK.product)}
${step(4, 'orders', 'vi', 'Tên là <code>orders</code>, vì ORDER là từ khoá dành riêng.', [
  "Trạng thái: <code>NOT NULL DEFAULT 'pending' CHECK (status IN (…))</code> — NOT NULL rất quan trọng, xem phần bẫy.",
  '<code>customer_id bigint NOT NULL REFERENCES customer(id)</code> để mặc định NO ACTION: khách đã có đơn thì ở lại (R7).',
], CHK.orders)}
${step(5, 'order_item', 'vi', 'Bảng nối giữa orders và product.', [
  'Không có cột id: <code>PRIMARY KEY (order_id, product_id)</code> thực hiện R9.',
  '<code>order_id … REFERENCES orders(id) ON DELETE CASCADE</code> (R11); <code>product_id</code> giữ NO ACTION.',
  '<code>CHECK (qty &gt; 0)</code>, <code>CHECK (unit_price &gt; 0)</code>.',
], CHK.order_item)}
${step(6, 'payment', 'vi', 'Mỗi đơn tối đa một thanh toán.', [
  'Chỉ có khoá ngoại thì một đơn có nhiều thanh toán. <code>order_id bigint NOT NULL UNIQUE REFERENCES orders(id)</code> biến nó thành không-hoặc-một.',
  '<code>method</code> CHECK với bốn giá trị cho phép; <code>amount &gt; 0</code>.',
], CHK.payment)}
${step(7, 'stock_movement', 'vi', 'Mỗi lần tồn kho thay đổi là một dòng (Lab 6 sẽ ghi tự động bằng trigger).', [
  '<code>CHECK (change &lt;&gt; 0)</code>; <code>reason</code> CHECK bốn giá trị.',
  '<code>order_id</code> là khoá ngoại <em>không</em> NOT NULL — nhập kho thì không gắn đơn nào (R15).',
], CHK.stock_movement)}
${step(8, 'review', 'vi', 'Mỗi khách đánh giá mỗi sản phẩm một lần.', [
  '<code>rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5)</code>.',
  'Khoá chính là một id, cộng <code>UNIQUE (product_id, customer_id)</code>.',
], CHK.review)}
<h4>Bước 9 — chạy, hai lần</h4>
<p>Chạy tệp của bạn. Cuối output phải liệt kê 8 bảng:</p>${out(OUT_DT)}
<p>Chạy lần nữa: mấy dòng đầu giờ báo <code>NOTICE:  drop cascades to 8 other objects</code> rồi 8 bảng y hệt hiện lại. Đó là nghĩa của "chạy lại được".</p>
<h4>Bước 10 — chạy tệp kiểm</h4>
<p>Phần A chèn dòng hợp lệ; các giá trị mặc định phải xuất hiện (city Hà Nội, stock 0, attrs <code>{}</code>, status pending):</p>${out(CHK.A)}
<p>Phần B là 23 lỗi đã thấy ở các bước 1–8. Phần C thử luật ON DELETE — bốn lần từ chối, một lần dây chuyền, một lần xoá mềm:</p>${out(CHK.C)}
<p>T27 là chỗ tinh tế: dòng đơn của đơn 2 sẵn sàng đi theo (CASCADE), nhưng thanh toán từ chối (NO ACTION) — và vì một câu lệnh là được cả hoặc không gì, các dòng đơn cũng được trả lại. Phần D phải in đúng hai dấu vân tay này:</p>${out(CHK.D)}
<p>Mã khác? Xem danh sách 34 ràng buộc in ngay phía trên và so: thiếu một NOT NULL, dùng <code>CURRENT_TIMESTAMP</code> thay vì <code>now()</code>, một cột bigint đáng ra là int, một CHECK viết kiểu khác. 34 ràng buộc gồm 8 PRIMARY KEY, 10 FOREIGN KEY, 5 UNIQUE và 11 CHECK. (NOT NULL không nằm trong danh sách đó: ở PostgreSQL 17 nó gắn trên cột, phần dấu vân tay cột đã bao.)</p>

<h3>5 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab1-solution.sql (giống hệt ctshop-schema.sql)', code(['DROP SCHEMA IF EXISTS shop CASCADE;', 'CREATE SCHEMA shop;', 'SET search_path = shop;', '', ...Object.values(T).map((t) => t + '\n')].join('\n')))}

<h3>6 · Bẫy hay gặp</h3>
<div class="pitfall"><p><strong>Bẫy — <code>CREATE TABLE order</code>.</strong> ORDER là từ khoá dành riêng (ORDER BY). Đặt tên bảng là <code>orders</code>; viết <code>"order"</code> trong ngoặc kép cũng chạy, nhưng từ đó mọi truy vấn đều phải có ngoặc kép.</p></div>
${out(TRAP_ORDER)}
<div class="pitfall"><p><strong>Bẫy — CHECK mà không NOT NULL.</strong> CHECK chỉ từ chối khi điều kiện <em>sai</em>. NULL làm nó thành <em>không biết</em>, nên dòng lọt vào mà không có trạng thái nào:</p></div>
${out(TRAP_NULL)}
<div class="pitfall"><p><strong>Bẫy — UNIQUE mà không lower().</strong> So sánh chữ phân biệt hoa thường, nên với UNIQUE đây là hai giá trị khác nhau — hai tài khoản cho một người:</p></div>
${out(TRAP_CASE)}
<div class="pitfall"><p><strong>Bẫy — mong id liền nhau.</strong> INSERT nào thất bại sau khi giá trị mặc định đã được tính vẫn tiêu một số identity (phần B: id 4, 5, 6 hiện trong dòng DETAIL dù các dòng đó bị từ chối). Số identity là tên gọi, không phải bộ đếm.</p></div>
<div class="pitfall"><p><strong>Bẫy — CASCADE trên hồ sơ nghiệp vụ.</strong> <code>ON DELETE CASCADE</code> trên <code>orders.customer_id</code> sẽ để một lệnh <code>DELETE FROM customer</code> xoá sạch lịch sử mua hàng của khách đó. Chỉ dùng CASCADE khi con đúng nghĩa là một phần của cha (đơn → dòng đơn).</p></div>

<h3>7 · Tự kiểm</h3>
<ol>
<li>Vì sao <code>payment.order_id</code> cần UNIQUE ngoài khoá ngoại?</li>
<li>T27 xoá một đơn có các dòng đơn ON DELETE CASCADE. Vì sao vẫn thất bại, và các dòng đơn ra sao?</li>
<li>Bạn viết <code>CHECK (rating BETWEEN 1 AND 5)</code> nhưng quên NOT NULL. INSERT nào lọt qua?</li>
</ol>
${details('Đáp án', `<ol><li>Không có UNIQUE thì một đơn có thể có nhiều thanh toán; UNIQUE trên khoá ngoại biến một-nhiều thành một-(không hoặc một).</li><li>Thanh toán vẫn tham chiếu đơn đó (NO ACTION). Cả lệnh DELETE thất bại, nên các dòng đơn đã bị kéo theo cũng được hoàn lại — không gì thay đổi.</li><li>INSERT có <code>rating = NULL</code>: CHECK cho kết quả "không biết", và "không biết" thì cho qua.</li></ol>`)}

<h3>8 · Tiếp theo: Lab 2</h3>
<p>Các bảng đã đúng nhưng còn rỗng. Lab 2 (sau Chương 4) nạp 48 sản phẩm, 300 khách và 2.000 đơn bằng <code>\\copy</code>, áp bảng giá nhà cung cấp bằng UPSERT, trả lời mười câu hỏi nghiệp vụ với con số thật, và sửa dữ liệu an toàn trong <code>BEGIN … ROLLBACK</code>.</p>
</div>
`;

export default {
  title: 'Lab 1 — CT Shop: from ERD to a working schema|||Lab 1 — CT Shop: từ ERD tới lược đồ chạy được',
  slug: 'postgresql-lab-1-luoc-do-ct-shop',
  type: 'LESSON',
  description: 'Lab dự án CT Shop sau Chương 3: đọc ERD 8 bảng, viết CREATE TABLE đủ khoá chính/ngoại, UNIQUE, CHECK, DEFAULT, identity, ON DELETE; chạy tệp kiểm phá từng ràng buộc (output lỗi thật) và so dấu vân tay với lược đồ chuẩn.',
  content: `${G}${EN}${VI}`,
};
