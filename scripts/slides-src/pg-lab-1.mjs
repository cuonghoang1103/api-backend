/**
 * pg-lab-1 — PostgreSQL · Lab 1 · CT Shop "From ERD to a working schema" (slide EN, kiểu FU, agent lab 25/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-1.mjs + lab/sql/lab1-{start,solution,check}.sql. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB ctlab) — video-bai-giang/src/khung/pg/that/pg-lab-1*.out.txt.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, sh, c } from './_pg-chung.mjs';
import { erdShop, chuGiai, cayDanhMuc, PG, CAM, NAU, XANH } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-1', code: 'PG Lab 1', title: 'Lab 1 — CT Shop: from ERD to a working schema', sub: 'Keys, constraints, ON DELETE — then break every rule' };

/* Ba tầng tạo bảng theo mũi tên khoá ngoại. */
const tang = () => {
  const L = [
    ['Level 1 · no parents', ['customer', 'category'], PG],
    ['Level 2 · need level 1', ['product', 'orders'], XANH],
    ['Level 3 · need level 2', ['order_item', 'payment', 'stock_movement', 'review'], CAM],
  ];
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  L.forEach(([t, ts, m], i) => {
    const y = 8 + i * 76;
    s += `<text x="0" y="${y + 38}" font-size="20" font-weight="800" fill="${m}">${t}</text>`;
    ts.forEach((n, j) => {
      const x = 290 + j * 205;
      s += `<rect x="${x}" y="${y + 8}" width="190" height="46" rx="9" fill="${m}18" stroke="${m}" stroke-width="2.5"/>` +
        `<text x="${x + 95}" y="${y + 38}" text-anchor="middle" font-size="19" font-weight="700" fill="#333" font-family="Menlo,monospace">${n}</text>`;
    });
    if (i < 2) s += `<path d="M270,${y + 58} l0,22" stroke="#b85a2b" stroke-width="3"/><path d="M262,${y + 74} l8,10 l8,-10" fill="none" stroke="#b85a2b" stroke-width="3"/>`;
  });
  return s + '</svg>';
};

/** Một cột của two(): gói nhiều khối thành MỘT ô lưới. */
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;

const OUT_EMAIL = ` email        | accepted
--------------+----------
 an@ctshop.vn | t
 a@b.cc       | t
 a@b.c        | f
 @ctshop.vn   | f
 an@ctshop    | f
 An@ctshop.vn | f
(6 rows)`;

export const slides = lamDeck({ chuong: 'Lab 1 · CT Shop', bai: '' }, [
  { cover: true, t: 'Lab 1 — CT Shop:<br>from ERD to a working schema', sub: '8 tables · primary &amp; foreign keys · UNIQUE, CHECK, DEFAULT, identity · ON DELETE.<br>Then we try to break every rule — and PostgreSQL says no.' },

  { t: 'Your assignment', body: two(
    box('The brief', `<p style="margin:0 0 8px"><b>CT Shop</b> sells school &amp; office supplies online — pens, notebooks, calculators, IT textbooks.</p>
<p style="margin:0">The owner hands you the data model (an <b>ERD</b>) and <b>16 business rules</b>. Turn them into a PostgreSQL schema that <b>refuses bad data on its own</b> — no matter which app, script or intern writes to it.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      'Your <code class="i">lab1-start.sql</code> creates all <b>8 tables</b> without one error',
      'It is <b>re-runnable</b>: run it twice, same result',
      '<code class="i">lab1-check.sql</code>: all <b>23 bad rows rejected</b> by the right constraint',
      'The 5 delete tests behave as the rules say',
      'Both <b>fingerprints</b> equal the standard schema',
    ]))), giua: true },

  { t: 'Files and setup', body: `
${tbl(['File', 'What it is'], [
  ['lab1-start.sql', 'Starter: schema <b>shop</b>, column names &amp; types given, 8 TODOs for you'],
  ['lab1-check.sql', 'The test: 12 valid rows, 23 bad rows, 6 delete/update tests, 2 fingerprints'],
  ['lab1-solution.sql', 'The answer — identical to <b>ctshop-schema.sql</b>, used by every later lab'],
], { w: 1110 })}
${sh(`$ docker exec -it pgdemo psql -U postgres -c "CREATE DATABASE ctshop;"
CREATE DATABASE
$ docker exec -i pgdemo psql -U postgres -d ctshop < lab1-start.sql
$ docker cp lab1-check.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab1-check.sql`)}
<p class="nho">Container <b>pgdemo</b> from lesson 0.3. psql installed locally? <code class="i">psql -d ctshop -f lab1-start.sql</code> works the same.</p>
${box('How to work', '⏱ About 60–90 minutes. Write all 8 tables on your own first, run the check script, fix, run again. Open the solution (and the second solution video) only after your own attempt — that is where the learning happens.', 'xanh')}` },

  { t: 'The shop owner’s 16 rules', body: cards([
    ['customer', 'R1 email required, unique, lower-case, shaped like a@b.cc · R2 name required, phone optional, city defaults to Hà Nội'],
    ['category', 'R3 name required &amp; unique · R4 may have a parent; a parent with children cannot be deleted'],
    ['product', 'R5 unique sku, one category · R6 price &gt; 0, stock ≥ 0 (default 0), attrs {} , active by default'],
    ['orders', 'R7 belongs to a real customer; customers with orders stay · R8 status: pending · paid · shipped · cancelled'],
    ['order_item', 'R9 a product once per order · R10 qty &gt; 0, unit_price &gt; 0 · R11 delete order ⇒ delete lines; sold products stay'],
    ['payment', 'R12 at most ONE per order, amount &gt; 0 · R13 method: cod · card · momo · bank'],
    ['stock_movement', 'R14 change ≠ 0, reason: import · sale · return · adjust · R15 order is optional'],
    ['review', 'R16 rating 1–5, one review per customer per product, text optional'],
  ], 4), to: true },

  { t: 'The ERD — 8 tables, 10 relationships', body: `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${erdShop({ w: 1005, h: 470 })}${chuGiai(900)}</div>` },

  { t: 'Reading the ERD out loud', body: `
<table class="t" style="font-size:18px">
<tr><th style="width:290px">Relationship</th><th>Read it as</th><th style="width:330px">Built with</th></tr>
<tr><td>customer ‖—○&lt; orders</td><td>one customer has zero or many orders</td><td><code class="i">orders.customer_id</code> NOT NULL FK</td></tr>
<tr><td>orders ‖—|&lt; order_item</td><td>an order has one or many lines</td><td>FK + composite PK (order_id, product_id)</td></tr>
<tr><td>product ‖—○&lt; order_item</td><td>a product appears in zero or many lines</td><td><code class="i">order_item.product_id</code> FK</td></tr>
<tr><td>category ‖—○&lt; product</td><td>every product sits in exactly one category</td><td><code class="i">product.category_id</code> NOT NULL FK</td></tr>
<tr><td>category ○|—○&lt; category</td><td>a category has zero or one parent</td><td><code class="i">parent_id</code> nullable FK to itself</td></tr>
<tr><td>orders ‖—○| payment</td><td>an order has at most one payment</td><td><code class="i">payment.order_id</code> FK <b>+ UNIQUE</b></td></tr>
<tr><td>customer, product → review</td><td>one review per customer per product</td><td>UNIQUE (product_id, customer_id)</td></tr>
</table>
${box('The ERD promises more than DDL can enforce', '“At least one line per order”, “payment = order total”, “only buyers may review” — a CREATE TABLE cannot say these. They need transactions and triggers (Lab 6).', '')}` },

  { t: 'Build order = follow the arrows', body: tang() + two(psql(`ctshop=# CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customer(id));
ERROR:  relation "customer" does not exist`, { sm: true, title: 'psql (17.11) — ctshop · child before parent' }),
  box('Make the script re-runnable', `Start with <code class="i">DROP SCHEMA IF EXISTS shop CASCADE;</code> then <code class="i">CREATE SCHEMA shop;</code> — every run starts from a clean slate.`, 'xanh'), 'r64') },

  { t: 'Table 1 — customer', body: two(col(sql(`CREATE TABLE customer (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text        NOT NULL,
  full_name   text        NOT NULL,
  phone       text,
  city        text        NOT NULL DEFAULT 'Hà Nội',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_email_key   UNIQUE (email),
  CONSTRAINT customer_email_check
    CHECK (email = lower(email) AND email LIKE '%_@_%.__%')
);`, { sm: true, hl: [8, 9, 10] }), `<ul style="font-size:21px"><li><b>R1</b>: UNIQUE + CHECK. <code class="i">lower()</code> stops “An@…” and “an@…” from being two accounts</li>
<li><code class="i">LIKE '%_@_%.__%'</code>: something, @, something, a dot, at least 2 letters</li>
<li><b>R2</b>: <code class="i">phone</code> has no NOT NULL — optional; <code class="i">city</code> gets <b>'Hà Nội'</b> when omitted</li></ul>`), col(psql(OUT_EMAIL, { sm: true, title: 'what the CHECK accepts (real run)' }),
  box('Why a CHECK if the app lower-cases?', 'The website does lower-case the email. A CSV import, an admin script or next year’s mobile app may not. The database is the <b>last line of defence</b> every writer must pass.', 'lam')), 'r64') },

  { t: 'Table 2 — category: a tree in one table', body: two(col(sql(`CREATE TABLE category (
  id         int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  parent_id  int  REFERENCES category(id)
                  ON DELETE RESTRICT
);`, { sm: true, hl: [4, 5] }), `<ul style="font-size:20px"><li>A <b>self-reference</b>: the FK points at its own table</li>
<li><code class="i">parent_id</code> NULL = a root category</li>
<li><b>RESTRICT</b>: a parent that still has children cannot be deleted (R4)</li>
<li><code class="i">int</code>, not bigint: a shop has dozens of categories, not billions</li></ul>`,
  box('Why a tree?', 'Tomorrow the owner wants <i>Bút bi → Bút gel</i>: one more row with <code class="i">parent_id = 5</code>. No new table, no ALTER TABLE. Lab 4 walks the tree with a recursive CTE.', 'xanh')), col(`<div class="tcap">What the rows look like</div>`, cayDanhMuc()), 'r64') },

  { t: 'Table 3 — product', body: two(sql(`CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text          NOT NULL UNIQUE,
  name         text          NOT NULL,
  category_id  int           NOT NULL REFERENCES category(id),
  price        numeric(12,2) NOT NULL CHECK (price > 0),
  stock        int           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attrs        jsonb         NOT NULL DEFAULT '{}',
  is_active    boolean       NOT NULL DEFAULT true,
  created_at   timestamptz   NOT NULL DEFAULT now()
);`, { sm: true, hl: [5, 6, 7] }), cards([
    ['Money = numeric', '<code class="i">numeric(12,2)</code>, never float — 0.1 + 0.2 must be 0.3 (lesson 2.1).'],
    ['FK type = PK type', '<code class="i">category_id int</code> matches <code class="i">category.id int</code>.'],
    ['Soft delete', 'A sold product is never deleted (R11) — set <code class="i">is_active = false</code> instead.'],
  ], 1), 'r64') },

  { t: 'Table 4 — orders, and two traps', body: two(sql(`CREATE TABLE orders (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'paid',
                                 'shipped', 'cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  note         text
);`, { sm: true, hl: [4, 5, 6] }), `<p style="font-size:21px;margin:0">A CHECK fails only when it is <b>false</b>. NULL makes it <i>unknown</i> ⇒ the row is accepted. Always pair it with <b>NOT NULL</b> — like line 4.</p>
<p style="font-size:21px;margin:0">And the table is called <b>orders</b>, never <i>order</i>:</p>`, 'r64') +
  two(psql(`ctshop=# CREATE TABLE order (id bigint PRIMARY KEY);
ERROR:  syntax error at or near "order"
LINE 1: CREATE TABLE order (id bigint PRIMARY KEY);
                     ^`, { sm: true, title: 'trap 1 · ORDER is a reserved word (ORDER BY)' }),
  psql(`ctshop=# INSERT INTO orders_bad VALUES (1, NULL);
INSERT 0 1
ctshop=# SELECT id, status, status IS NULL AS is_null
ctshop-#   FROM orders_bad;
 id | status | is_null
----+--------+---------
  1 |        | t
(1 row)`, { sm: true, title: 'trap 2 · status with CHECK but no NOT NULL' })) },

  { t: 'Table 5 — order_item: the key is a pair', body: two(col(sql(`CREATE TABLE order_item (
  order_id    bigint NOT NULL
              REFERENCES orders(id) ON DELETE CASCADE,
  product_id  bigint NOT NULL REFERENCES product(id),
  qty         int    NOT NULL CHECK (qty > 0),
  unit_price  numeric(12,2) NOT NULL CHECK (unit_price > 0),
  PRIMARY KEY (order_id, product_id)
);`, { sm: true, hl: [3, 7] }), `<ul style="font-size:20px"><li>No <code class="i">id</code>: the pair <b>(order_id, product_id)</b> is the identity (R9)</li>
<li><b>CASCADE</b>: lines live and die with their order (R11)</li>
<li><code class="i">unit_price</code> = price <b>at the moment of purchase</b> — the shelf price may change tomorrow</li></ul>`),
  col(tbl(['order_id', 'product_id', 'qty', 'unit_price'], [['1', '1', '2', '5000.00'], ['1', '2', '1', '28000.00'], ['2', '1', '3', '5000.00'], ['1', '1', '5', '5000.00']], { cap: 'order 1 has two lines, order 2 has one', bo: [3] }),
  box('Last row', '(1, 1) again ⇒ <b>order_item_pkey</b> rejects it. To buy more, raise <code class="i">qty</code>.', 'do2')), 'r64') },

  { t: 'Tables 6 &amp; 8 — payment and review', body: two(col(sql(`CREATE TABLE payment (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id  bigint NOT NULL UNIQUE REFERENCES orders(id),
  amount    numeric(12,2) NOT NULL CHECK (amount > 0),
  method    text NOT NULL
            CHECK (method IN ('cod', 'card', 'momo', 'bank')),
  paid_at   timestamptz NOT NULL DEFAULT now()
);`, { sm: true, hl: [3] }), sql(`CREATE TABLE review (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id   bigint   NOT NULL REFERENCES product(id),
  customer_id  bigint   NOT NULL REFERENCES customer(id),
  rating       smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);`, { sm: true, hl: [8] })),
  col(box('UNIQUE on a foreign key', 'An FK alone means “many payments per order”. Add <b>UNIQUE</b> and it becomes <b>zero or one</b> payment per order (R12).', 'lam'),
    box('Why not a composite PK for review?', 'Other tables may later point at one review (likes, reports) — a single <code class="i">id</code> is easier to reference. The pair stays unique through <b>UNIQUE</b> (R16).', ''),
    box('smallint', 'A rating is 1–5: <code class="i">smallint</code> (2 bytes) is plenty.', 'xanh')), 'r64') },

  { t: 'Table 7 — stock_movement, and the first run', body: two(col(sql(`CREATE TABLE stock_movement (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint NOT NULL REFERENCES product(id),
  change      int    NOT NULL CHECK (change <> 0),
  reason      text   NOT NULL CHECK (reason IN
                ('import', 'sale', 'return', 'adjust')),
  order_id    bigint REFERENCES orders(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);`, { sm: true, hl: [4, 7] }), `<ul style="font-size:21px"><li><code class="i">change</code> +100 = import, −2 = sale; <b>0 means nothing</b> (R14)</li>
<li><code class="i">order_id</code> has no NOT NULL: an import belongs to no order (R15)</li>
<li>Lab 6 fills this table automatically with a <b>trigger</b></li></ul>`,
  box('Run it twice', 'The second run prints <code class="i">NOTICE: drop cascades to 8 other objects</code>, then builds the same 8 tables again. That is what “re-runnable” means.', 'xanh')),
  psql(`ctshop=# \\dt shop.*
             List of relations
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
(8 rows)`, { sm: true, title: 'after lab1-solution.sql — 8 × CREATE TABLE' }), 'r64') },

  { t: 'ON DELETE: what happens to the children?', body: `
<table class="t" style="font-size:18px">
<tr><th style="width:330px">Foreign key</th><th style="width:150px">ON DELETE</th><th>Why (business rule)</th></tr>
<tr><td>order_item.order_id → orders</td><td><b class="do">CASCADE</b></td><td>a line means nothing without its order (R11)</td></tr>
<tr><td>category.parent_id → category</td><td><b class="lam">RESTRICT</b></td><td>empty the sub-categories first (R4)</td></tr>
<tr><td>orders.customer_id → customer</td><td>NO ACTION</td><td>orders are financial records — the customer stays (R7)</td></tr>
<tr><td>order_item.product_id → product</td><td>NO ACTION</td><td>a sold product stays; hide it with <code class="i">is_active</code></td></tr>
<tr><td>payment.order_id → orders</td><td>NO ACTION</td><td>a paid order can never silently disappear</td></tr>
<tr><td>stock_movement · review → …</td><td>NO ACTION</td><td>history is kept</td></tr>
</table>
${box('NO ACTION vs RESTRICT', 'Both refuse the delete. NO ACTION (the default) checks at the end of the statement and can be deferred; RESTRICT checks immediately. For this lab they behave the same — RESTRICT just states the intent loudly.', 'lam')}` },

  { t: 'The check script — five parts', body: two(steps([
    '<b>A · valid rows</b> — 2 customers, 2 categories, 2 products, 2 orders, 3 lines, 1 payment… all must succeed',
    '<b>B · 23 bad rows</b> — each must fail with an ERROR naming the right constraint',
    '<b>C · ON DELETE</b> — 4 deletes refused, 1 cascade, 1 soft delete',
    '<b>D · fingerprints</b> — md5 of your columns and constraints vs the standard',
    '<b>E · clean up</b> — TRUNCATE all 8 tables, ids restart at 1',
  ]), col(sh(`$ docker cp lab1-check.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres \\
    -d ctshop -f /tmp/lab1-check.sql`, { sm: true }),
  box('Read the line number', 'Each error starts with <code class="i">psql:/tmp/lab1-check.sql:45:</code> — line 45 of the file is the test that produced it.', 'lam'),
  box('Expected', 'Exactly <b>27 ERROR</b> lines: 23 in part B, 4 in part C. Fewer ⇒ a rule is missing. More ⇒ a valid row in part A was refused.', 'xanh')), 'r46') },

  { t: 'Part B — bad rows bounce off (1/2)', body: `<div style="zoom:.97">${psql(`T01 duplicate email
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
HINT:  Use OVERRIDING SYSTEM VALUE to override.`, { sm: true, title: 'psql (17.11) — ctshop · lab1-check.sql part B' })}</div>` +
  box('Notice the ids 4, 5, 6', 'Every failed INSERT still used up an identity number (T01 burned 3). Gaps in ids are normal — never rely on ids being consecutive. Your timestamps will differ: they are now().', '') },

  { t: 'Part B — bad rows bounce off (2/2)', body: `<div style="zoom:.95">${psql(`T07 parent category that does not exist
psql:/tmp/lab1-check.sql:55: ERROR:  insert or update on table "category" violates foreign key constraint "category_parent_id_fkey"
DETAIL:  Key (parent_id)=(99) is not present in table "category".
T13 order for a customer that does not exist
psql:/tmp/lab1-check.sql:67: ERROR:  insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"
DETAIL:  Key (customer_id)=(99) is not present in table "customer".
T15 same product twice in one order
psql:/tmp/lab1-check.sql:71: ERROR:  duplicate key value violates unique constraint "order_item_pkey"
DETAIL:  Key (order_id, product_id)=(1, 1) already exists.
T17 second payment for the same order
psql:/tmp/lab1-check.sql:75: ERROR:  duplicate key value violates unique constraint "payment_order_id_key"
DETAIL:  Key (order_id)=(2) already exists.
T23 second review of the same product by the same customer
psql:/tmp/lab1-check.sql:87: ERROR:  duplicate key value violates unique constraint "review_product_id_customer_id_key"
DETAIL:  Key (product_id, customer_id)=(1, 1) already exists.`, { sm: true, title: 'psql (17.11) — ctshop · lab1-check.sql part B (excerpt)' })}</div>` +
  box('Default names tell you everything', '<code class="i">&lt;table&gt;_&lt;column&gt;_fkey</code> foreign key · <code class="i">_key</code> UNIQUE · <code class="i">_check</code> CHECK · <code class="i">_pkey</code> primary key. One glance at the error and you know which rule fired — and in which table.', 'lam') },

  { t: 'Part C — the ON DELETE rules at work', body: two(psql(`T24 delete a category that still has a child
ERROR:  update or delete on table "category" violates
  foreign key constraint "category_parent_id_fkey"
DETAIL:  Key (id)=(1) is still referenced from table "category".
T25 delete a customer who has orders
ERROR:  … violates … "orders_customer_id_fkey" on table "orders"
T26 delete a product that was sold
ERROR:  … violates … "order_item_product_id_fkey" on table "order_item"
T27 delete an order that has a payment
ERROR:  … violates … "payment_order_id_fkey" on table "payment"`, { sm: true, title: 'refused (messages shortened with …)' }),
  psql(`ctshop=# SELECT order_id, count(*) AS lines
ctshop-#   FROM order_item GROUP BY order_id
ctshop-#   ORDER BY order_id;
 order_id | lines
----------+-------
        1 |     2
        2 |     1
ctshop=# DELETE FROM orders WHERE id = 1
ctshop-#   RETURNING id, status;
 id | status
----+---------
  1 | pending
ctshop=# -- same SELECT again
 order_id | lines
----------+-------
        2 |     1`, { sm: true, title: 'T28 · CASCADE took 2 lines with it' }), 'r64') +
  box('T27 is the subtle one', 'Order 2’s <b>lines</b> would cascade, but its <b>payment</b> refuses (NO ACTION) — so the whole DELETE is undone, the lines included. A statement is all or nothing.', '') },

  { t: 'Part D — compare with the standard schema', body: two(col(psql(` columns |        column_fingerprint
---------+----------------------------------
      44 | f26adcc3956f7b1242d84269ba258345
(1 row)

 constraints |      constraint_fingerprint
-------------+----------------------------------
          34 | 0a360bffadc8373fcf6b177ba6d6f692
(1 row)`, { sm: true, title: 'the standard schema — yours must match' }),
  box('Different hash?', 'Run the listing query of part D and compare line by line: a missing NOT NULL, <code class="i">CURRENT_TIMESTAMP</code> instead of <code class="i">now()</code>, a bigint that should be int, a CHECK written differently…', '')),
  col(tbl(['contype', 'meaning', 'count'], [['p', 'PRIMARY KEY', '8'], ['f', 'FOREIGN KEY', '10'], ['u', 'UNIQUE', '5'], ['c', 'CHECK', '11'], ['', '<b>total</b>', '<b>34</b>']], { cap: 'pg_constraint in schema shop', hl: [4] }),
  `<p style="font-size:19px;margin:0">NOT NULL is not counted here: in PostgreSQL 17 it lives on the column (<code class="i">is_nullable</code>), which the column fingerprint covers.</p>`), 'r64') },

  { t: 'Traps we met on the way', body: vsd(`<ul>
<li><code class="i">CREATE TABLE order</code> — reserved word</li>
<li>Child table created before its parent</li>
<li><code class="i">CHECK (status IN …)</code> without NOT NULL</li>
<li><code class="i">UNIQUE (email)</code> alone: “An@…” and “an@…” both get in</li>
<li>Expecting ids 1, 2, 3 with no gaps</li>
<li>CASCADE on <code class="i">orders.customer_id</code> — one click wipes a customer’s history</li></ul>`,
  `<ul>
<li>Name it <code class="i">orders</code></li>
<li>Create in FK order: level 1 → 2 → 3</li>
<li><code class="i">NOT NULL</code> + <code class="i">CHECK</code> together</li>
<li><code class="i">CHECK (email = lower(email))</code> + UNIQUE</li>
<li>Identity numbers are names, not counters</li>
<li>CASCADE only where the child is <b>part of</b> the parent</li></ul>`, '✗ Trap', '✓ Do this'), to: true, giua: true },

  { t: 'Self-check', body: `<ol style="font-size:25px;gap:12px">
<li>Why does <code class="i">payment.order_id</code> need <b>UNIQUE</b> on top of the foreign key?</li>
<li>T27 deletes an order whose lines are ON DELETE CASCADE. Why does it still fail — and what happens to the lines?</li>
<li>You add <code class="i">CHECK (rating BETWEEN 1 AND 5)</code> but forget NOT NULL. Which INSERT slips through?</li>
</ol>
${box('Answers', `<b>1</b> · Without it an order could have many payments; UNIQUE turns 1–many into 1–(0..1). <b>2</b> · The payment still points at the order (NO ACTION) ⇒ the whole statement is rolled back, lines included. <b>3</b> · <code class="i">rating = NULL</code> — a CHECK that is unknown passes.`, 'xanh')}`, giua: true },

  { t: 'Summary — and next: Lab 2', body: two(steps([
    'ERD → tables: one box = one table, one line = one foreign key',
    'Create parents before children; start with DROP SCHEMA … CASCADE',
    'Every rule becomes a constraint: PK, FK, UNIQUE, CHECK, NOT NULL, DEFAULT',
    'ON DELETE CASCADE only for true parts (order → lines); history stays',
    'Prove it: break every rule on purpose and read the error',
  ]), box('Lab 2 — fill the shop', `Load 48 products, 300 customers and 2,000 orders with <b>COPY</b>, update prices with an <b>UPSERT</b>, answer 10 business questions and change data safely inside <b>BEGIN … ROLLBACK</b>.`, 'lam'), 'r64'), giua: true, to: true },
]);
