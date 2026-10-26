/**
 * Lab 6 — CT Shop: đặt hàng an toàn — giao dịch + hàm + trigger + view + materialized view (sau Chương 12). Agent lab6, 26/10/2026.
 * Chèn vào Chương 12 bằng lab/index.mjs (LAB_SAU[12]) — sau bài 12.4, trước quiz.
 * Kiến thức tới Ch12 (giao dịch, MVCC, FOR UPDATE, deadlock — Ch11; hàm SQL/PL/pgSQL, volatility, RAISE, trigger BEFORE/AFTER/WHEN,
 * view, quyền qua view, materialized view, REFRESH CONCURRENTLY — Ch12). Mới, giảng ngắn trong lab: set_config(…, true) /
 * current_setting(…, true) (biến cục bộ của giao dịch), jsonb_to_recordset, CREATE OR REPLACE TRIGGER, SET ROLE / REVOKE … FROM PUBLIC.
 * Dữ liệu: lab6-start.sql = lược đồ chuẩn + dữ liệu chuẩn (cỡ chuẩn, 2.000 đơn — KHÔNG dùng 1 triệu đơn của Lab 5).
 * Mọi output = chạy thật PostgreSQL 17.11 (DB nháp ctlab6, đã xoá): lab6-solution.sql bằng psql -f qua TTY, cắt theo đoạn;
 * sáu khối HAI PHIÊN chạy bằng hai phiên psql thật song song (that/c11-scripts/hai-phien.mjs), có thời điểm; Prisma 5.22 thật.
 * Q / O / SOL SINH TỰ ĐỘNG (scratchpad lab6/mk6.mjs) — không gõ tay.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-6.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s, lang = 'sql') => `<pre><code class="language-${lang}">${esc(s).split('\n').map((l) => l.replace(lang === 'sql' ? /(--.*)$/ : /(\/\/.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Câu SQL từng bước — sinh từ lab6-solution.sql. */
/* Q:BEGIN */
const Q = {
  T1V: `CREATE VIEW stock_check AS
SELECT p.id AS product_id, p.sku, p.stock,
       coalesce(l.balance, 0) AS ledger,
       p.stock - coalesce(l.balance, 0) AS gap
FROM product p
LEFT JOIN (SELECT product_id, sum(change) AS balance FROM stock_movement GROUP BY product_id) l
       ON l.product_id = p.id;`,
  T1A: `SELECT count(*) AS products, count(*) FILTER (WHERE gap <> 0) AS mismatched, sum(gap) AS gap_units
FROM stock_check;   -- 48 of 48 wrong: the old app wrote the ledger only on some code paths`,
  T1B: `SELECT * FROM stock_check ORDER BY product_id LIMIT 5;`,
  T1BG: `BEGIN;`,
  T1I: `INSERT INTO stock_movement (product_id, change, reason)
SELECT product_id, gap, 'adjust' FROM stock_check WHERE gap <> 0;`,
  T1C: `SELECT count(*) FILTER (WHERE gap <> 0) AS mismatched FROM stock_check;   -- 0 — still inside the transaction`,
  T1CM: `COMMIT;`,
  T1F: `CREATE FUNCTION log_stock_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO stock_movement (product_id, change, reason, order_id)
  VALUES (NEW.id,
          NEW.stock - OLD.stock,
          coalesce(nullif(current_setting('ctshop.reason', true), ''), 'adjust'),
          nullif(current_setting('ctshop.order_id', true), '')::bigint);
  RETURN NULL;   -- AFTER trigger: the return value is ignored
END $$;`,
  T1T: `CREATE TRIGGER product_stock_log
  AFTER UPDATE OF stock ON product
  FOR EACH ROW EXECUTE FUNCTION log_stock_change();`,
  T1X: `UPDATE product SET price = 750000, stock = stock WHERE id = 34;   -- ERROR: change = 0 breaks CHECK (change <> 0)`,
  T1XC: `SELECT price, stock FROM product WHERE id = 34;   -- 790000.00 | 79 — the whole UPDATE was rolled back`,
  T1W: `CREATE OR REPLACE TRIGGER product_stock_log
  AFTER UPDATE OF stock ON product
  FOR EACH ROW
  WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
  EXECUTE FUNCTION log_stock_change();`,
  T1WU: `UPDATE product SET price = 750000, stock = stock WHERE id = 34;   -- UPDATE 1, no ledger row`,
  T1MB: `BEGIN;`,
  T1MS: `SELECT set_config('ctshop.reason', 'import', true);`,
  T1MU: `UPDATE product SET stock = stock + 50 WHERE id IN (1, 3);`,
  T1MC: `COMMIT;`,
  T1P: `UPDATE product SET stock = stock - 2 WHERE id = 3;   -- 2 pens broken in the warehouse`,
  T1L: `SELECT id, product_id, change, reason, order_id FROM stock_movement WHERE id > 477 ORDER BY id;`,
  T1OK: `SELECT count(*) FILTER (WHERE gap <> 0) AS mismatched FROM stock_check;   -- 0`,
  T2CF: `CREATE FUNCTION cart_lines(p_items jsonb)
RETURNS TABLE (product_id bigint, qty int)
LANGUAGE sql IMMUTABLE
AS $$
  SELECT x.product_id, sum(x.qty)::int
  FROM jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)
  GROUP BY x.product_id
$$;`,
  T2C: `SELECT * FROM cart_lines('[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]') ORDER BY product_id;`,
  T2F: `CREATE FUNCTION place_order(p_customer bigint, p_items jsonb)
RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  v_order bigint;
  v_line  record;
BEGIN
   -- 1 · validate the input
  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR p_items = '[]'::jsonb THEN
    RAISE EXCEPTION 'the cart is empty';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)
             WHERE x.product_id IS NULL OR x.qty IS NULL OR x.qty <= 0) THEN
    RAISE EXCEPTION 'every line needs a product_id and a qty > 0';
  END IF;

   -- 2 · lock the products, ALWAYS in id order: two carts can never wait for each other in a circle
  PERFORM 1 FROM product
  WHERE id IN (SELECT c.product_id FROM cart_lines(p_items) c)
  ORDER BY id
  FOR UPDATE;

   -- 3 · check every line against the LOCKED rows (nobody can change them until we finish)
  FOR v_line IN
    SELECT c.product_id, c.qty, p.id AS found, p.name, p.stock, p.is_active
    FROM cart_lines(p_items) c LEFT JOIN product p ON p.id = c.product_id
    ORDER BY c.product_id
  LOOP
    IF v_line.found IS NULL THEN
      RAISE EXCEPTION 'product % does not exist', v_line.product_id;
    ELSIF NOT v_line.is_active THEN
      RAISE EXCEPTION 'product % (%) is not for sale', v_line.product_id, v_line.name;
    ELSIF v_line.stock < v_line.qty THEN
      RAISE EXCEPTION 'out of stock: % — % left, % wanted', v_line.name, v_line.stock, v_line.qty
        USING HINT = 'the whole order was cancelled: nothing was sold';
    END IF;
  END LOOP;

   -- 4 · write: the order, its lines (the price AT THE MOMENT of buying), the stock
  INSERT INTO orders (customer_id) VALUES (p_customer) RETURNING id INTO v_order;
  INSERT INTO order_item (order_id, product_id, qty, unit_price)
  SELECT v_order, c.product_id, c.qty, p.price
  FROM cart_lines(p_items) c JOIN product p ON p.id = c.product_id;

  PERFORM set_config('ctshop.reason', 'sale', true);   -- tell the T1 trigger why …
  PERFORM set_config('ctshop.order_id', v_order::text, true);   -- … and for which order
  UPDATE product p SET stock = p.stock - c.qty
  FROM cart_lines(p_items) c WHERE p.id = c.product_id;
  PERFORM set_config('ctshop.reason', '', true);   -- don't leak into the caller's next UPDATE
  PERFORM set_config('ctshop.order_id', '', true);

  RETURN v_order;
END $$;`,
  T2S0: `SELECT id, name, stock FROM product WHERE id IN (4, 30) ORDER BY id;`,
  T2O: `SELECT place_order(42, '[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]') AS order_id;`,
  T2OI: `SELECT o.id, o.customer_id, o.status, oi.product_id, oi.qty, oi.unit_price
FROM orders o JOIN order_item oi ON oi.order_id = o.id
WHERE o.id = 2001 ORDER BY oi.product_id;`,
  T2S1: `SELECT id, name, stock FROM product WHERE id IN (4, 30) ORDER BY id;   -- 200 → 197, 179 → 178`,
  T2L: `SELECT id, product_id, change, reason, order_id FROM stock_movement WHERE order_id = 2001 ORDER BY id;`,
  T2E1: `SELECT place_order(42, '[{"product_id": 4, "qty": 1}, {"product_id": 30, "qty": 500}]');   -- ERROR: out of stock`,
  T2E2: `SELECT place_order(42, '[{"product_id": 999, "qty": 1}]');   -- ERROR: no such product`,
  T2E3: `SELECT place_order(42, '[{"product_id": 4, "qty": 0}]');   -- ERROR: bad qty`,
  T2E4: `SELECT place_order(42, '[]');   -- ERROR: empty cart`,
  T2N: `SELECT (SELECT count(*) FROM orders) AS orders, (SELECT stock FROM product WHERE id = 4) AS gel_pen_stock,
       (SELECT count(*) FROM stock_movement) AS ledger_rows;   -- 2001 | 197 | 482 — unchanged by the 4 errors`,
  T3F: `CREATE FUNCTION place_order_v0(p_customer bigint, p_product bigint, p_qty int)
RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  v_stock int;
  v_price numeric;
  v_order bigint;
BEGIN
  SELECT stock, price INTO v_stock, v_price FROM product WHERE id = p_product;   -- 1 · read (no lock)
  IF v_stock < p_qty THEN   -- 2 · check in code
    RAISE EXCEPTION 'out of stock';
  END IF;
  INSERT INTO orders (customer_id) VALUES (p_customer) RETURNING id INTO v_order;
  INSERT INTO order_item (order_id, product_id, qty, unit_price) VALUES (v_order, p_product, p_qty, v_price);
  PERFORM set_config('ctshop.reason', 'sale', true);
  PERFORM set_config('ctshop.order_id', v_order::text, true);
  UPDATE product SET stock = v_stock - p_qty WHERE id = p_product;   -- 3 · write back the number we computed
  RETURN v_order;
END $$;`,
  T3S: `UPDATE product SET stock = 1 WHERE id = 34;`,
  T3AUD: `SELECT o.id AS order_id, o.customer_id, oi.sold, coalesce(-m.logged, 0) AS logged
FROM orders o
JOIN (SELECT order_id, sum(qty) AS sold FROM order_item GROUP BY order_id) oi ON oi.order_id = o.id
LEFT JOIN (SELECT order_id, sum(change) AS logged FROM stock_movement WHERE reason = 'sale' GROUP BY order_id) m
       ON m.order_id = o.id
WHERE o.id > 2000 AND o.status <> 'cancelled' AND oi.sold <> coalesce(-m.logged, 0);   -- order 2003: sold 1, logged 0`,
  T3CX: `UPDATE orders SET status = 'cancelled', note = 'oversold in the 20:00 flash sale' WHERE id = 2003;`,
  T3D: `DROP FUNCTION place_order_v0(bigint, bigint, int);`,
  T3S2: `UPDATE product SET stock = 1 WHERE id = 34;`,
  T3R: `SELECT o.id, o.customer_id, o.status, oi.qty
FROM orders o JOIN order_item oi ON oi.order_id = o.id
WHERE oi.product_id = 34 AND o.id > 2000 ORDER BY o.id;   -- 2002 (v0), 2003 cancelled, 2004 — no order for B this time`,
  T3K: `SELECT stock FROM product WHERE id = 34;   -- 0`,
  T4F: `CREATE FUNCTION order_total(p_order bigint) RETURNS numeric
LANGUAGE sql STABLE
AS $$
  SELECT coalesce(sum(qty * unit_price), 0) FROM shop.order_item WHERE order_id = p_order
$$;`,
  T4T: `SELECT order_total(2001) AS total_2001, order_total(1) AS total_1, order_total(-1) AS no_such_order;`,
  T4P: `SELECT count(*) AS payments, count(*) FILTER (WHERE amount <> order_total(order_id)) AS wrong
FROM payment;   -- 1663 | 0`,
  T4X: `CREATE INDEX payment_gap_idx ON payment ((amount - order_total(order_id)));   -- ERROR`,
  T4GF: `CREATE FUNCTION check_payment_amount() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_total numeric := order_total(NEW.order_id);
BEGIN
  IF NEW.amount <> v_total THEN
    RAISE EXCEPTION 'payment for order % is % but the order total is %', NEW.order_id, NEW.amount, v_total;
  END IF;
  RETURN NEW;
END $$;`,
  T4GT: `CREATE TRIGGER payment_amount_guard
  BEFORE INSERT OR UPDATE OF amount, order_id ON payment
  FOR EACH ROW EXECUTE FUNCTION check_payment_amount();`,
  T4G1: `INSERT INTO payment (order_id, amount, method) VALUES (2001, 600000, 'momo');   -- ERROR: a tampered amount`,
  T4G2: `INSERT INTO payment (order_id, amount, method) VALUES (2001, order_total(2001), 'momo');`,
  T4G3: `UPDATE orders SET status = 'paid' WHERE id = 2001;`,
  T4A0: `SELECT (SELECT count(*) FROM orders) AS orders, (SELECT stock FROM product WHERE id = 12) AS stock_12,
       (SELECT count(*) FROM stock_movement) AS ledger_rows;`,
  T4AB: `BEGIN;`,
  T4AO: `SELECT place_order(55, '[{"product_id": 12, "qty": 2}]') AS order_id;`,
  T4AX: `INSERT INTO payment (order_id, amount, method)
SELECT max(id), 1000, 'card' FROM orders;   -- ERROR: 1000 ≠ the total`,
  T4AR: `ROLLBACK;`,
  T4A1: `SELECT (SELECT count(*) FROM orders) AS orders, (SELECT stock FROM product WHERE id = 12) AS stock_12,
       (SELECT count(*) FROM stock_movement) AS ledger_rows;   -- the same three numbers`,
  T4AN: `SELECT place_order(55, '[{"product_id": 12, "qty": 2}]') AS order_id;   -- 2006, not 2005: a sequence never goes back`,
  T4K1: `ALTER TABLE payment ADD CONSTRAINT payment_matches_total CHECK (amount = order_total(order_id));`,
  T4K2: `UPDATE order_item SET qty = qty + 1 WHERE order_id = 2001 AND product_id = 4;`,
  T4K3: `SELECT amount, order_total(order_id) AS total_now FROM payment WHERE order_id = 2001;   -- 674.000 vs 702.000`,
  T4K4: `UPDATE order_item SET qty = qty - 1 WHERE order_id = 2001 AND product_id = 4;   -- put it back`,
  T4K5: `ALTER TABLE payment DROP CONSTRAINT payment_matches_total;   -- a CHECK must be about its own row only`,
  T5V: `CREATE VIEW daily_revenue AS
SELECT (pm.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS day,
       count(*) AS payments,
       sum(pm.amount) AS revenue
FROM payment pm
GROUP BY 1;`,
  T5S: `SELECT * FROM daily_revenue WHERE day BETWEEN '2026-09-26' AND '2026-09-30' ORDER BY day;`,
  T5NV: `CREATE VIEW daily_revenue_naive AS
SELECT pm.paid_at::date AS day, count(*) AS payments, sum(pm.amount) AS revenue
FROM payment pm
GROUP BY 1;`,
  T5UTC: `SET TimeZone = 'UTC';`,
  T5N: `SELECT d.day, n.revenue AS naive_in_utc, d.revenue AS correct
FROM daily_revenue d JOIN daily_revenue_naive n USING (day)
WHERE d.day BETWEEN '2026-09-26' AND '2026-09-30' ORDER BY d.day;`,
  T5C: `SELECT count(*) AS payments, count(*) FILTER (WHERE paid_at::date <> (paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')::date) AS other_day
FROM payment WHERE order_id <= 2000;   -- 1663 | 459: every payment between 00:00 and 07:00 Việt Nam time lands on the day before`,
  T5HCM: `SET TimeZone = 'Asia/Ho_Chi_Minh';`,
  T5ND: `DROP VIEW daily_revenue_naive;`,
  T5R0: `DROP ROLE IF EXISTS ctshop_report;`,
  T5R1: `CREATE ROLE ctshop_report NOLOGIN;`,
  T5R2: `GRANT USAGE ON SCHEMA shop TO ctshop_report;`,
  T5R3: `GRANT SELECT ON daily_revenue TO ctshop_report;`,
  T5R4: `SET ROLE ctshop_report;`,
  T5R5: `SELECT count(*) AS days, sum(payments) AS payments, sum(revenue) AS revenue FROM daily_revenue;   -- works: the view runs with its OWNER's rights`,
  T5R6: `SELECT count(*) FROM payment;   -- ERROR: permission denied`,
  T5R7: `SELECT place_order(1, '[{"product_id": 1, "qty": 1}]');   -- EXECUTE is granted to PUBLIC by default …`,
  T5R8: `RESET ROLE;`,
  T5R9: `REVOKE EXECUTE ON FUNCTION place_order(bigint, jsonb) FROM PUBLIC;   -- … so take it away`,
  T5R10: `SET ROLE ctshop_report;`,
  T5R11: `SELECT place_order(1, '[{"product_id": 1, "qty": 1}]');   -- refused at the door now`,
  T5R12: `RESET ROLE;`,
  T6M: `CREATE MATERIALIZED VIEW product_rank AS
SELECT p.id AS product_id, p.sku, p.name,
       sum(oi.qty) AS units,
       sum(oi.qty * oi.unit_price) AS revenue,
       rank() OVER (ORDER BY sum(oi.qty * oi.unit_price) DESC) AS rnk,
       now() AS refreshed_at
FROM order_item oi
JOIN orders o ON o.id = oi.order_id AND o.status <> 'cancelled'
JOIN product p ON p.id = oi.product_id
GROUP BY p.id;`,
  T6S: `SELECT rnk, sku, name, units, revenue FROM product_rank WHERE rnk <= 5 ORDER BY rnk;`,
  T6E1: `EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
SELECT rnk, sku, units, revenue FROM product_rank WHERE rnk <= 5;`,
  T6E2: `EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
SELECT * FROM (
  SELECT p.sku, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue,
         rank() OVER (ORDER BY sum(oi.qty * oi.unit_price) DESC) AS rnk
  FROM order_item oi
  JOIN orders o ON o.id = oi.order_id AND o.status <> 'cancelled'
  JOIN product p ON p.id = oi.product_id
  GROUP BY p.id) live
WHERE rnk <= 5;`,
  T6O: `SELECT place_order(77, '[{"product_id": 32, "qty": 60}]') AS order_id;`,
  T6B: `SELECT rnk, sku, revenue, refreshed_at FROM product_rank WHERE product_id = 32;`,
  T6X: `REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;   -- ERROR: needs a unique index`,
  T6U: `CREATE UNIQUE INDEX product_rank_product_id ON product_rank (product_id);`,
  T6RC: `REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;`,
  T6A: `SELECT rnk, sku, revenue, refreshed_at FROM product_rank WHERE product_id = 32;`,
  T7W1: `BEGIN;`,
  T7W2: `SELECT set_config('ctshop.reason', 'import', true);`,
  T7W3: `SELECT id, stock FROM product WHERE id IN (30, 12) ORDER BY id FOR UPDATE;`,
  T7W4: `UPDATE product SET stock = stock + 20 WHERE id IN (12, 30);`,
  T7W5: `COMMIT;`,
  SC1: `SELECT count(*) FILTER (WHERE gap <> 0) AS mismatched_products FROM stock_check;   -- 0`,
  SC2: `SELECT count(*) AS orders_after_2000,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       (SELECT count(*) FROM payment WHERE amount <> order_total(order_id)) AS wrong_payments
FROM orders WHERE id > 2000;`,
  SC3: `SELECT reason, count(*) AS rows, sum(change) AS units FROM stock_movement GROUP BY reason ORDER BY reason;`,
  SC4: `SELECT event_object_table AS "table", trigger_name, action_timing AS timing, string_agg(event_manipulation, ' OR ') AS events
FROM information_schema.triggers WHERE trigger_schema = 'shop'
GROUP BY 1, 2, 3 ORDER BY 1, 2;`,
  SC5: `SELECT p.proname AS function, p.provolatile AS volatility, pg_get_function_result(p.oid) AS returns
FROM pg_proc p WHERE p.pronamespace = 'shop'::regnamespace ORDER BY 1;`,
};
/* Q:END */

/* Output THẬT (PostgreSQL 17.11) — sinh từ lab6-solution.sql chạy bằng psql -f + sáu khối hai phiên (H…). */
/* O:BEGIN */
const O = {
  T1V: `CREATE VIEW`,
  T1A: ` products | mismatched | gap_units 
----------+------------+-----------
       48 |         48 |     -4025
(1 row)`,
  T1B: ` product_id |  sku   | stock | ledger | gap 
------------+--------+-------+--------+-----
          1 | CT0501 |   198 |    270 | -72
          2 | CT0502 |    62 |    157 | -95
          3 | CT0503 |   148 |    240 | -92
          4 | CT0504 |   200 |    285 | -85
          5 | CT0505 |   217 |    305 | -88
(5 rows)`,
  T1BG: `BEGIN`,
  T1I: `INSERT 0 48`,
  T1C: ` mismatched 
------------
          0
(1 row)`,
  T1CM: `COMMIT`,
  T1F: `CREATE FUNCTION`,
  T1T: `CREATE TRIGGER`,
  T1X: `psql:/tmp/lab6-solution.sql:56: ERROR:  new row for relation "stock_movement" violates check constraint "stock_movement_change_check"
DETAIL:  Failing row contains (478, 34, 0, adjust, null, 2026-10-26 02:00:01.327466+07).
CONTEXT:  SQL statement "INSERT INTO stock_movement (product_id, change, reason, order_id)
  VALUES (NEW.id,
          NEW.stock - OLD.stock,
          coalesce(nullif(current_setting('ctshop.reason', true), ''), 'adjust'),
          nullif(current_setting('ctshop.order_id', true), '')::bigint)"
PL/pgSQL function log_stock_change() line 3 at SQL statement`,
  T1XC: `   price   | stock 
-----------+-------
 790000.00 |    79
(1 row)`,
  T1W: `CREATE TRIGGER`,
  T1WU: `UPDATE 1`,
  T1MB: `BEGIN`,
  T1MS: ` set_config 
------------
 import
(1 row)`,
  T1MU: `UPDATE 2`,
  T1MC: `COMMIT`,
  T1P: `UPDATE 1`,
  T1L: ` id  | product_id | change | reason | order_id 
-----+------------+--------+--------+----------
 479 |          1 |     50 | import |         
 480 |          3 |     50 | import |         
 481 |          3 |     -2 | adjust |         
(3 rows)`,
  T1OK: ` mismatched 
------------
          0
(1 row)`,
  T2CF: `CREATE FUNCTION`,
  T2C: ` product_id | qty 
------------+-----
          4 |   3
         30 |   1
(2 rows)`,
  T2F: `CREATE FUNCTION`,
  T2S0: ` id |             name             | stock 
----+------------------------------+-------
  4 | Bút gel Uni-ball Signo 0.5mm |   200
 30 | Sổ tay Moleskine Classic A5  |   179
(2 rows)`,
  T2O: ` order_id 
----------
     2001
(1 row)`,
  T2OI: `  id  | customer_id | status  | product_id | qty | unit_price 
------+-------------+---------+------------+-----+------------
 2001 |          42 | pending |          4 |   3 |   28000.00
 2001 |          42 | pending |         30 |   1 |  590000.00
(2 rows)`,
  T2S1: ` id |             name             | stock 
----+------------------------------+-------
  4 | Bút gel Uni-ball Signo 0.5mm |   197
 30 | Sổ tay Moleskine Classic A5  |   178
(2 rows)`,
  T2L: ` id  | product_id | change | reason | order_id 
-----+------------+--------+--------+----------
 482 |          4 |     -3 | sale   |     2001
 483 |         30 |     -1 | sale   |     2001
(2 rows)`,
  T2E1: `psql:/tmp/lab6-solution.sql:167: ERROR:  out of stock: Sổ tay Moleskine Classic A5 — 178 left, 500 wanted
HINT:  the whole order was cancelled: nothing was sold
CONTEXT:  PL/pgSQL function place_order(bigint,jsonb) line 32 at RAISE`,
  T2E2: `psql:/tmp/lab6-solution.sql:169: ERROR:  product 999 does not exist
CONTEXT:  PL/pgSQL function place_order(bigint,jsonb) line 28 at RAISE`,
  T2E3: `psql:/tmp/lab6-solution.sql:171: ERROR:  every line needs a product_id and a qty > 0
CONTEXT:  PL/pgSQL function place_order(bigint,jsonb) line 12 at RAISE`,
  T2E4: `psql:/tmp/lab6-solution.sql:173: ERROR:  the cart is empty
CONTEXT:  PL/pgSQL function place_order(bigint,jsonb) line 8 at RAISE`,
  T2N: ` orders | gel_pen_stock | ledger_rows 
--------+---------------+-------------
   2001 |           197 |         482
(1 row)`,
  T3F: `CREATE FUNCTION`,
  T3S: `UPDATE 1`,
  T3AUD: ` order_id | customer_id | sold | logged 
----------+-------------+------+--------
     2003 |         102 |    1 |      0
(1 row)`,
  T3CX: `UPDATE 1`,
  T3D: `DROP FUNCTION`,
  T3S2: `UPDATE 1`,
  T3R: `  id  | customer_id |  status   | qty 
------+-------------+-----------+-----
 2002 |         101 | pending   |   1
 2003 |         102 | cancelled |   1
 2004 |         101 | pending   |   1
(3 rows)`,
  T3K: ` stock 
-------
     0
(1 row)`,
  T4F: `CREATE FUNCTION`,
  T4T: ` total_2001 |  total_1  | no_such_order 
------------+-----------+---------------
  674000.00 | 805000.00 |             0
(1 row)`,
  T4P: ` payments | wrong 
----------+-------
     1663 |     0
(1 row)`,
  T4X: `psql:/tmp/lab6-solution.sql:259: ERROR:  functions in index expression must be marked IMMUTABLE`,
  T4GF: `CREATE FUNCTION`,
  T4GT: `CREATE TRIGGER`,
  T4G1: `psql:/tmp/lab6-solution.sql:277: ERROR:  payment for order 2001 is 600000.00 but the order total is 674000.00
CONTEXT:  PL/pgSQL function check_payment_amount() line 6 at RAISE`,
  T4G2: `INSERT 0 1`,
  T4G3: `UPDATE 1`,
  T4A0: ` orders | stock_12 | ledger_rows 
--------+----------+-------------
   2004 |      128 |         486
(1 row)`,
  T4AB: `BEGIN`,
  T4AO: ` order_id 
----------
     2005
(1 row)`,
  T4AX: `psql:/tmp/lab6-solution.sql:290: ERROR:  payment for order 2005 is 1000.00 but the order total is 250000.00
CONTEXT:  PL/pgSQL function check_payment_amount() line 6 at RAISE`,
  T4AR: `ROLLBACK`,
  T4A1: ` orders | stock_12 | ledger_rows 
--------+----------+-------------
   2004 |      128 |         486
(1 row)`,
  T4AN: ` order_id 
----------
     2006
(1 row)`,
  T4K1: `ALTER TABLE`,
  T4K2: `UPDATE 1`,
  T4K3: `  amount   | total_now 
-----------+-----------
 674000.00 | 702000.00
(1 row)`,
  T4K4: `UPDATE 1`,
  T4K5: `ALTER TABLE`,
  T5V: `CREATE VIEW`,
  T5S: `    day     | payments |  revenue   
------------+----------+------------
 2026-09-26 |        2 | 3174000.00
 2026-09-27 |        3 |  763000.00
 2026-09-28 |        5 | 1897000.00
 2026-09-29 |        1 |  264000.00
 2026-09-30 |        3 | 1455000.00
(5 rows)`,
  T5NV: `CREATE VIEW`,
  T5UTC: `SET`,
  T5N: `    day     | naive_in_utc |  correct   
------------+--------------+------------
 2026-09-26 |   3303000.00 | 3174000.00
 2026-09-27 |    822000.00 |  763000.00
 2026-09-28 |   1709000.00 | 1897000.00
 2026-09-29 |   1164000.00 |  264000.00
 2026-09-30 |   1194000.00 | 1455000.00
(5 rows)`,
  T5C: ` payments | other_day 
----------+-----------
     1663 |       459
(1 row)`,
  T5HCM: `SET`,
  T5ND: `DROP VIEW`,
  T5R0: `psql:/tmp/lab6-solution.sql:343: NOTICE:  role "ctshop_report" does not exist, skipping
DROP ROLE`,
  T5R1: `CREATE ROLE`,
  T5R2: `GRANT`,
  T5R3: `GRANT`,
  T5R4: `SET`,
  T5R5: ` days | payments |   revenue    
------+----------+--------------
  597 |     1664 | 946838000.00
(1 row)`,
  T5R6: `psql:/tmp/lab6-solution.sql:355: ERROR:  permission denied for table payment`,
  T5R7: `psql:/tmp/lab6-solution.sql:357: ERROR:  permission denied for table product
CONTEXT:  SQL statement "SELECT 1 FROM product
  WHERE id IN (SELECT c.product_id FROM cart_lines(p_items) c)
  ORDER BY id
  FOR UPDATE"
PL/pgSQL function place_order(bigint,jsonb) line 16 at PERFORM`,
  T5R8: `RESET`,
  T5R9: `REVOKE`,
  T5R10: `SET`,
  T5R11: `psql:/tmp/lab6-solution.sql:365: ERROR:  permission denied for function place_order`,
  T5R12: `RESET`,
  T6M: `SELECT 48`,
  T6S: ` rnk |  sku   |              name              | units |   revenue    
-----+--------+--------------------------------+-------+--------------
   1 | CT1001 | Máy tính Casio FX-580VN X      |   205 | 144525000.00
   2 | CT1004 | Máy tính Casio FX-880BTG       |   179 | 141330000.00
   3 | CT1002 | Máy tính Casio FX-570VN Plus   |   228 | 112860000.00
   4 | CT0906 | Sổ tay Moleskine Classic A5    |   176 | 103840000.00
   5 | CT1003 | Máy tính Vinacal 570ES Plus II |   191 |  65895000.00
(5 rows)`,
  T6E1: `                             QUERY PLAN                             
--------------------------------------------------------------------
 Seq Scan on product_rank (actual time=0.004..0.006 rows=5 loops=1)
   Filter: (rnk <= 5)
   Rows Removed by Filter: 43
   Buffers: shared hit=1
 Planning Time: 0.015 ms
 Execution Time: 0.012 ms
(6 rows)`,
  T6E2: `                                                 QUERY PLAN                                                  
-------------------------------------------------------------------------------------------------------------
 Subquery Scan on live (actual time=3.123..3.128 rows=5 loops=1)
   Buffers: shared hit=54
   ->  WindowAgg (actual time=3.123..3.127 rows=5 loops=1)
         Run Condition: (rank() OVER (?) <= 5)
         Buffers: shared hit=54
         ->  Sort (actual time=3.115..3.117 rows=6 loops=1)
               Sort Key: (sum(((oi.qty)::numeric * oi.unit_price))) DESC
               Sort Method: quicksort  Memory: 27kB
               Buffers: shared hit=54
               ->  HashAggregate (actual time=3.093..3.103 rows=48 loops=1)
                     Group Key: p.id
                     Batches: 1  Memory Usage: 48kB
                     Buffers: shared hit=54
                     ->  Hash Join (actual time=0.568..2.110 rows=4630 loops=1)
                           Hash Cond: (oi.product_id = p.id)
                           Buffers: shared hit=54
                           ->  Hash Join (actual time=0.481..1.471 rows=4630 loops=1)
                                 Hash Cond: (oi.order_id = o.id)
                                 Buffers: shared hit=52
                                 ->  Seq Scan on order_item oi (actual time=0.004..0.301 rows=5006 loops=1)
                                       Buffers: shared hit=37
                                 ->  Hash (actual time=0.439..0.439 rows=1847 loops=1)
                                       Buckets: 2048  Batches: 1  Memory Usage: 89kB
                                       Buffers: shared hit=15
                                       ->  Seq Scan on orders o (actual time=0.028..0.213 rows=1847 loops=1)
                                             Filter: (status <> 'cancelled'::text)
                                             Rows Removed by Filter: 158
                                             Buffers: shared hit=15
                           ->  Hash (actual time=0.052..0.052 rows=48 loops=1)
                                 Buckets: 1024  Batches: 1  Memory Usage: 11kB
                                 Buffers: shared hit=2
                                 ->  Seq Scan on product p (actual time=0.009..0.034 rows=48 loops=1)
                                       Buffers: shared hit=2
 Planning:
   Buffers: shared hit=22
 Planning Time: 0.473 ms
 Execution Time: 3.188 ms
(37 rows)`,
  T6O: ` order_id 
----------
     2007
(1 row)`,
  T6B: ` rnk |  sku   |   revenue    |         refreshed_at          
-----+--------+--------------+-------------------------------
   3 | CT1002 | 112860000.00 | 2026-10-26 02:00:06.200883+07
(1 row)`,
  T6X: `psql:/tmp/lab6-solution.sql:404: ERROR:  cannot refresh materialized view "shop.product_rank" concurrently
HINT:  Create a unique index with no WHERE clause on one or more columns of the materialized view.`,
  T6U: `CREATE INDEX`,
  T6RC: `REFRESH MATERIALIZED VIEW`,
  T6A: ` rnk |  sku   |   revenue    |         refreshed_at          
-----+--------+--------------+-------------------------------
   2 | CT1002 | 142560000.00 | 2026-10-26 02:00:06.217962+07
(1 row)`,
  T7W1: `BEGIN`,
  T7W2: ` set_config 
------------
 import
(1 row)`,
  T7W3: ` id | stock 
----+-------
 12 |   144
 30 |   196
(2 rows)`,
  T7W4: `UPDATE 2`,
  T7W5: `COMMIT`,
  SC1: ` mismatched_products 
---------------------
                   0
(1 row)`,
  SC2: ` orders_after_2000 | cancelled | wrong_payments 
-------------------+-----------+----------------
                 8 |         1 |              0
(1 row)`,
  SC3: ` reason | rows | units 
--------+------+-------
 adjust |   51 | -4104
 import |   54 | 12419
 sale   |  391 |  -847
(3 rows)`,
  SC4: `  table  |     trigger_name     | timing |      events      
---------+----------------------+--------+------------------
 payment | payment_amount_guard | BEFORE | INSERT OR UPDATE
 product | product_stock_log    | AFTER  | UPDATE
(2 rows)`,
  SC5: `       function       | volatility |                returns                
----------------------+------------+---------------------------------------
 cart_lines           | i          | TABLE(product_id bigint, qty integer)
 check_payment_amount | v          | trigger
 log_stock_change     | v          | trigger
 order_total          | s          | numeric
 place_order          | v          | bigint
(5 rows)`,
  HT3A: `[ +0.00s] A> BEGIN;
[ +0.00s] A│ BEGIN
[ +0.02s] A> SELECT place_order_v0(101, 34, 1);
[ +0.02s] A│  place_order_v0
[ +0.02s] A│ ----------------
[ +0.02s] A│            2002
[ +0.02s] A│ (1 row)
[ +0.02s] A│
[ +0.03s] B> SELECT place_order_v0(102, 34, 1);
[ +1.53s] B  ⏳ (sau 1.5 s vẫn chưa có kết quả — đang chờ)
[ +1.53s] A> COMMIT;
[ +1.54s] B│  place_order_v0
[ +1.54s] B│ ----------------
[ +1.54s] B│            2003
[ +1.54s] B│ (1 row)
[ +1.54s] B│
[ +1.54s] A│ COMMIT

-- sau (phiên riêng):
SET
 stock 
-------
     0
(1 row)

 id  | product_id | change | reason | order_id 
-----+------------+--------+--------+----------
 485 |         34 |     -1 | sale   |     2002
 484 |         34 |    -78 | adjust |         
 463 |         34 |    -83 | adjust |         
(3 rows)`,
  HT3B: `[ +0.00s] A> BEGIN;
[ +0.00s] A│ BEGIN
[ +0.01s] A> SELECT place_order(101, '[{"product_id": 34, "qty": 1}]');
[ +0.02s] A│  place_order
[ +0.02s] A│ -------------
[ +0.02s] A│         2004
[ +0.02s] A│ (1 row)
[ +0.02s] A│
[ +0.03s] B> SELECT place_order(102, '[{"product_id": 34, "qty": 1}]');
[ +1.53s] B  ⏳ (sau 1.5 s vẫn chưa có kết quả — đang chờ)
[ +1.53s] A> COMMIT;
[ +1.53s] A│ COMMIT
[ +1.53s] B│ ERROR:  out of stock: Máy tính Casio FX-880BTG — 0 left, 1 wanted
[ +1.53s] B│ HINT:  the whole order was cancelled: nothing was sold
[ +1.53s] B│ CONTEXT:  PL/pgSQL function place_order(bigint,jsonb) line 32 at RAISE`,
  HT6A: `[ +0.00s] ·  — plain REFRESH —
[ +0.00s] A> BEGIN;
[ +0.00s] A│ BEGIN
[ +0.02s] A> REFRESH MATERIALIZED VIEW product_rank;
[ +0.02s] A│ REFRESH MATERIALIZED VIEW
[ +0.03s] B> SELECT rnk, sku, revenue FROM product_rank WHERE rnk <= 3;
[ +1.53s] B  ⏳ (sau 1.5 s vẫn chưa có kết quả — đang chờ)
[ +1.53s] A> COMMIT;
[ +1.54s] A│ COMMIT
[ +1.54s] B│  rnk |  sku   |   revenue
[ +1.54s] B│ -----+--------+--------------
[ +1.54s] B│    1 | CT1001 | 144525000.00
[ +1.54s] B│    2 | CT1002 | 142560000.00
[ +1.54s] B│    3 | CT1004 | 141330000.00
[ +1.54s] B│ (3 rows)
[ +1.54s] B│
[ +1.55s] ·  — REFRESH … CONCURRENTLY —
[ +1.55s] A> BEGIN;
[ +1.55s] A│ BEGIN
[ +1.57s] A> REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;
[ +1.57s] A│ REFRESH MATERIALIZED VIEW
[ +1.58s] B> SELECT rnk, sku, revenue FROM product_rank WHERE rnk <= 3;
[ +1.58s] B│  rnk |  sku   |   revenue
[ +1.58s] B│ -----+--------+--------------
[ +1.58s] B│    1 | CT1001 | 144525000.00
[ +1.58s] B│    2 | CT1002 | 142560000.00
[ +1.58s] B│    3 | CT1004 | 141330000.00
[ +1.58s] B│ (3 rows)
[ +1.58s] B│
[ +2.60s] A> COMMIT;
[ +2.60s] A│ COMMIT`,
  HT7A: `[ +0.00s] A> BEGIN;
[ +0.00s] A│ BEGIN
[ +0.01s] A> SELECT stock FROM product WHERE id = 30 FOR UPDATE;
[ +0.02s] A│  stock
[ +0.02s] A│ -------
[ +0.02s] A│    178
[ +0.02s] A│ (1 row)
[ +0.02s] A│
[ +0.03s] B> BEGIN;
[ +0.03s] B│ BEGIN
[ +0.04s] B> SELECT stock FROM product WHERE id = 12 FOR UPDATE;
[ +0.05s] B│  stock
[ +0.05s] B│ -------
[ +0.05s] B│    126
[ +0.05s] B│ (1 row)
[ +0.05s] B│
[ +0.06s] A> SELECT stock FROM product WHERE id = 12 FOR UPDATE;
[ +0.46s] A  ⏳ (sau 0.4 s vẫn chưa có kết quả — đang chờ)
[ +0.46s] B> SELECT stock FROM product WHERE id = 30 FOR UPDATE;
[ +0.76s] B  ⏳ (sau 0.3 s vẫn chưa có kết quả — đang chờ)
[ +1.06s] A│ ERROR:  deadlock detected
[ +1.06s] A│ DETAIL:  Process 9308 waits for ShareLock on transaction 71346; blocked by process 9309.
[ +1.06s] A│ Process 9309 waits for ShareLock on transaction 71345; blocked by process 9308.
[ +1.06s] A│ HINT:  See server log for query details.
[ +1.06s] A│ CONTEXT:  while locking tuple (0,48) in relation "product"
[ +1.06s] B│  stock
[ +1.06s] B│ -------
[ +1.06s] B│    178
[ +1.06s] B│ (1 row)
[ +1.06s] B│
[ +1.07s] A> ROLLBACK;
[ +1.07s] A│ ROLLBACK
[ +1.09s] B> ROLLBACK;
[ +1.09s] B│ ROLLBACK`,
  HT7B: `[ +0.00s] A> BEGIN;
[ +0.00s] A│ BEGIN
[ +0.02s] A> SELECT place_order(201, '[{"product_id": 30, "qty": 1}, {"product_id": 12, "qty": 1}]');
[ +0.02s] A│  place_order
[ +0.02s] A│ -------------
[ +0.02s] A│         2008
[ +0.02s] A│ (1 row)
[ +0.02s] A│
[ +0.03s] B> SELECT place_order(202, '[{"product_id": 12, "qty": 1}, {"product_id": 30, "qty": 1}]');
[ +1.53s] B  ⏳ (sau 1.5 s vẫn chưa có kết quả — đang chờ)
[ +1.53s] A> COMMIT;
[ +1.53s] A│ COMMIT
[ +1.54s] B│  place_order
[ +1.54s] B│ -------------
[ +1.54s] B│         2009
[ +1.54s] B│ (1 row)
[ +1.54s] B│`,
  HT7C: `[ +0.00s] A> BEGIN;
[ +0.01s] A│ BEGIN
[ +0.02s] A> SELECT set_config('ctshop.reason', 'import', true);
[ +0.02s] A│  set_config
[ +0.02s] A│ ------------
[ +0.02s] A│  import
[ +0.02s] A│ (1 row)
[ +0.02s] A│
[ +0.03s] A> UPDATE product SET stock = stock + 20 WHERE id = 30;
[ +0.04s] A│ UPDATE 1
[ +0.05s] B> SELECT place_order(203, '[{"product_id": 12, "qty": 1}, {"product_id": 30, "qty": 1}]');
[ +0.45s] B  ⏳ (sau 0.4 s vẫn chưa có kết quả — đang chờ)
[ +0.45s] A> UPDATE product SET stock = stock + 20 WHERE id = 12;
[ +0.75s] A  ⏳ (sau 0.3 s vẫn chưa có kết quả — đang chờ)
[ +1.05s] B│ ERROR:  deadlock detected
[ +1.05s] B│ DETAIL:  Process 9354 waits for ShareLock on transaction 71349; blocked by process 9353.
[ +1.05s] B│ Process 9353 waits for ShareLock on transaction 71350; blocked by process 9354.
[ +1.05s] B│ HINT:  See server log for query details.
[ +1.05s] B│ CONTEXT:  while locking tuple (1,14) in relation "product"
[ +1.05s] B│ SQL statement "SELECT 1 FROM product
[ +1.05s] B│   WHERE id IN (SELECT c.product_id FROM cart_lines(p_items) c)
[ +1.05s] B│   ORDER BY id
[ +1.05s] B│   FOR UPDATE"
[ +1.05s] B│ PL/pgSQL function place_order(bigint,jsonb) line 16 at PERFORM
[ +1.05s] A│ UPDATE 1
[ +1.06s] A> COMMIT;
[ +1.07s] A│ COMMIT`,
};
/* O:END */

/* SOL:BEGIN */
const SOL = `-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 6 — SOLUTION: safe checkout (transactions + functions + triggers + views + materialized views)
-- Lab 6 — ĐÁP ÁN: đặt hàng an toàn (giao dịch + hàm + trigger + view + materialized view)
-- cuongthai.com/courses/postgresql · PostgreSQL 17 — every number in the comments comes from a real run
-- (lab6-start.sql, then this file with psql -f; the TWO TERMINALS blocks done by hand in two psql sessions).
-- Open it AFTER your own attempt. Run lab6-start.sql first: this file assumes the standard shop.
-- ═══════════════════════════════════════════════════════════════════════════
\\pset pager off
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T1 · The stock ledger: one row in stock_movement for EVERY stock change │
-- └─────────────────────────────────────────────────────────────────────────┘
-- T1a · Does the ledger add up? A view, because we will ask this question again and again.
CREATE VIEW stock_check AS
SELECT p.id AS product_id, p.sku, p.stock,
       coalesce(l.balance, 0) AS ledger,
       p.stock - coalesce(l.balance, 0) AS gap
FROM product p
LEFT JOIN (SELECT product_id, sum(change) AS balance FROM stock_movement GROUP BY product_id) l
       ON l.product_id = p.id;

SELECT count(*) AS products, count(*) FILTER (WHERE gap <> 0) AS mismatched, sum(gap) AS gap_units
FROM stock_check;   -- 48 of 48 wrong: the old app wrote the ledger only on some code paths

SELECT * FROM stock_check ORDER BY product_id LIMIT 5;

-- T1b · An opening balance: one 'adjust' row per product makes the ledger equal to today's stock.
--       ONE transaction: either all 48 corrections or none.
BEGIN;
INSERT INTO stock_movement (product_id, change, reason)
SELECT product_id, gap, 'adjust' FROM stock_check WHERE gap <> 0;
SELECT count(*) FILTER (WHERE gap <> 0) AS mismatched FROM stock_check;   -- 0 — still inside the transaction
COMMIT;

-- T1c · The trigger: AFTER UPDATE OF stock, one ledger row per changed product.
--       Who changed it and why? The caller says so with a transaction-local setting (set_config(…, true));
--       nobody said anything ⇒ 'adjust'. current_setting(name, true) = "missing_ok": NULL instead of an error.
CREATE FUNCTION log_stock_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO stock_movement (product_id, change, reason, order_id)
  VALUES (NEW.id,
          NEW.stock - OLD.stock,
          coalesce(nullif(current_setting('ctshop.reason', true), ''), 'adjust'),
          nullif(current_setting('ctshop.order_id', true), '')::bigint);
  RETURN NULL;   -- AFTER trigger: the return value is ignored
END $$;

CREATE TRIGGER product_stock_log
  AFTER UPDATE OF stock ON product
  FOR EACH ROW EXECUTE FUNCTION log_stock_change();

-- Trap: an admin form (or an ORM) saves the WHOLE product — stock included, unchanged.
UPDATE product SET price = 750000, stock = stock WHERE id = 34;   -- ERROR: change = 0 breaks CHECK (change <> 0)

SELECT price, stock FROM product WHERE id = 34;   -- 790000.00 | 79 — the whole UPDATE was rolled back

-- Fix: fire only when the number really changes (WHEN is checked before the function is called).
CREATE OR REPLACE TRIGGER product_stock_log
  AFTER UPDATE OF stock ON product
  FOR EACH ROW
  WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
  EXECUTE FUNCTION log_stock_change();

UPDATE product SET price = 750000, stock = stock WHERE id = 34;   -- UPDATE 1, no ledger row

-- A delivery: the warehouse script says why.
BEGIN;
SELECT set_config('ctshop.reason', 'import', true);
UPDATE product SET stock = stock + 50 WHERE id IN (1, 3);
COMMIT;

-- A quick fix typed in psql: nobody says why ⇒ 'adjust'. The trigger still writes it down.
UPDATE product SET stock = stock - 2 WHERE id = 3;   -- 2 pens broken in the warehouse

SELECT id, product_id, change, reason, order_id FROM stock_movement WHERE id > 477 ORDER BY id;

SELECT count(*) FILTER (WHERE gap <> 0) AS mismatched FROM stock_check;   -- 0

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T2 · place_order(customer, items): all of checkout in ONE call          │
-- └─────────────────────────────────────────────────────────────────────────┘
-- T2a · The cart: one line per product. IMMUTABLE is honest here — the result depends only on the argument.
CREATE FUNCTION cart_lines(p_items jsonb)
RETURNS TABLE (product_id bigint, qty int)
LANGUAGE sql IMMUTABLE
AS $$
  SELECT x.product_id, sum(x.qty)::int
  FROM jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)
  GROUP BY x.product_id
$$;

SELECT * FROM cart_lines('[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]') ORDER BY product_id;

-- T2b · The function. VOLATILE (the default): it writes. It runs inside the CALLER's transaction —
--       any RAISE EXCEPTION undoes everything it did (and everything the caller did in that transaction).
CREATE FUNCTION place_order(p_customer bigint, p_items jsonb)
RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  v_order bigint;
  v_line  record;
BEGIN
  -- 1 · validate the input
  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR p_items = '[]'::jsonb THEN
    RAISE EXCEPTION 'the cart is empty';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)
             WHERE x.product_id IS NULL OR x.qty IS NULL OR x.qty <= 0) THEN
    RAISE EXCEPTION 'every line needs a product_id and a qty > 0';
  END IF;

  -- 2 · lock the products, ALWAYS in id order: two carts can never wait for each other in a circle
  PERFORM 1 FROM product
  WHERE id IN (SELECT c.product_id FROM cart_lines(p_items) c)
  ORDER BY id
  FOR UPDATE;

  -- 3 · check every line against the LOCKED rows (nobody can change them until we finish)
  FOR v_line IN
    SELECT c.product_id, c.qty, p.id AS found, p.name, p.stock, p.is_active
    FROM cart_lines(p_items) c LEFT JOIN product p ON p.id = c.product_id
    ORDER BY c.product_id
  LOOP
    IF v_line.found IS NULL THEN
      RAISE EXCEPTION 'product % does not exist', v_line.product_id;
    ELSIF NOT v_line.is_active THEN
      RAISE EXCEPTION 'product % (%) is not for sale', v_line.product_id, v_line.name;
    ELSIF v_line.stock < v_line.qty THEN
      RAISE EXCEPTION 'out of stock: % — % left, % wanted', v_line.name, v_line.stock, v_line.qty
        USING HINT = 'the whole order was cancelled: nothing was sold';
    END IF;
  END LOOP;

  -- 4 · write: the order, its lines (the price AT THE MOMENT of buying), the stock
  INSERT INTO orders (customer_id) VALUES (p_customer) RETURNING id INTO v_order;
  INSERT INTO order_item (order_id, product_id, qty, unit_price)
  SELECT v_order, c.product_id, c.qty, p.price
  FROM cart_lines(p_items) c JOIN product p ON p.id = c.product_id;

  PERFORM set_config('ctshop.reason', 'sale', true);          -- tell the T1 trigger why …
  PERFORM set_config('ctshop.order_id', v_order::text, true);  -- … and for which order
  UPDATE product p SET stock = p.stock - c.qty
  FROM cart_lines(p_items) c WHERE p.id = c.product_id;
  PERFORM set_config('ctshop.reason', '', true);              -- don't leak into the caller's next UPDATE
  PERFORM set_config('ctshop.order_id', '', true);

  RETURN v_order;
END $$;

-- T2c · Customer 42 buys: 1 Moleskine + 2 gel pens + 1 more gel pen (the same product twice in the cart).
SELECT id, name, stock FROM product WHERE id IN (4, 30) ORDER BY id;

SELECT place_order(42, '[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]') AS order_id;

SELECT o.id, o.customer_id, o.status, oi.product_id, oi.qty, oi.unit_price
FROM orders o JOIN order_item oi ON oi.order_id = o.id
WHERE o.id = 2001 ORDER BY oi.product_id;

SELECT id, name, stock FROM product WHERE id IN (4, 30) ORDER BY id;   -- 200 → 197, 179 → 178

SELECT id, product_id, change, reason, order_id FROM stock_movement WHERE order_id = 2001 ORDER BY id;

-- T2d · Every wrong cart is refused — and nothing is left behind.
SELECT place_order(42, '[{"product_id": 4, "qty": 1}, {"product_id": 30, "qty": 500}]');   -- ERROR: out of stock

SELECT place_order(42, '[{"product_id": 999, "qty": 1}]');   -- ERROR: no such product

SELECT place_order(42, '[{"product_id": 4, "qty": 0}]');   -- ERROR: bad qty

SELECT place_order(42, '[]');   -- ERROR: empty cart

SELECT (SELECT count(*) FROM orders) AS orders, (SELECT stock FROM product WHERE id = 4) AS gel_pen_stock,
       (SELECT count(*) FROM stock_movement) AS ledger_rows;   -- 2001 | 197 | 482 — unchanged by the 4 errors

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T3 · Flash sale 20:00 — one Casio FX-880BTG left, two buyers            │
-- └─────────────────────────────────────────────────────────────────────────┘
-- T3a · The naive version — what a straight port of "read, check in code, write back" looks like.
CREATE FUNCTION place_order_v0(p_customer bigint, p_product bigint, p_qty int)
RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  v_stock int;
  v_price numeric;
  v_order bigint;
BEGIN
  SELECT stock, price INTO v_stock, v_price FROM product WHERE id = p_product;   -- 1 · read (no lock)
  IF v_stock < p_qty THEN                                                       -- 2 · check in code
    RAISE EXCEPTION 'out of stock';
  END IF;
  INSERT INTO orders (customer_id) VALUES (p_customer) RETURNING id INTO v_order;
  INSERT INTO order_item (order_id, product_id, qty, unit_price) VALUES (v_order, p_product, p_qty, v_price);
  PERFORM set_config('ctshop.reason', 'sale', true);
  PERFORM set_config('ctshop.order_id', v_order::text, true);
  UPDATE product SET stock = v_stock - p_qty WHERE id = p_product;               -- 3 · write back the number we computed
  RETURN v_order;
END $$;

-- The warehouse leaves exactly ONE FX-880BTG (product 34) for the flash sale (the trigger logs it as 'adjust').
UPDATE product SET stock = 1 WHERE id = 34;

-- ═══ TWO TERMINALS · T3A — the naive version (do it by hand, in this order) ═══
-- Terminal A:  BEGIN;
-- Terminal A:  SELECT place_order_v0(101, 34, 1);   -- order 2002; A's app now waits for the payment gateway…
-- Terminal B:  SELECT place_order_v0(102, 34, 1);   -- … B read stock = 1 too; B's UPDATE waits for A's row lock
-- Terminal A:  COMMIT;                              -- B continues at once: order 2003, "success"
-- Real run: two orders for one calculator, stock 0, and only ONE 'sale' row in the ledger.

-- The audit that catches it: units sold on an order vs units the ledger says left the shelf.
SELECT o.id AS order_id, o.customer_id, oi.sold, coalesce(-m.logged, 0) AS logged
FROM orders o
JOIN (SELECT order_id, sum(qty) AS sold FROM order_item GROUP BY order_id) oi ON oi.order_id = o.id
LEFT JOIN (SELECT order_id, sum(change) AS logged FROM stock_movement WHERE reason = 'sale' GROUP BY order_id) m
       ON m.order_id = o.id
WHERE o.id > 2000 AND o.status <> 'cancelled' AND oi.sold <> coalesce(-m.logged, 0);   -- order 2003: sold 1, logged 0

-- The shop cannot deliver order 2003: cancel it (and apologise to customer 102).
UPDATE orders SET status = 'cancelled', note = 'oversold in the 20:00 flash sale' WHERE id = 2003;

DROP FUNCTION place_order_v0(bigint, bigint, int);

-- T3b · The same race with place_order. Put the last unit back first.
UPDATE product SET stock = 1 WHERE id = 34;

-- ═══ TWO TERMINALS · T3B — place_order (do it by hand, in this order) ═══
-- Terminal A:  BEGIN;
-- Terminal A:  SELECT place_order(101, '[{"product_id": 34, "qty": 1}]');   -- order 2004, the row is locked
-- Terminal B:  SELECT place_order(102, '[{"product_id": 34, "qty": 1}]');   -- waits at FOR UPDATE …
-- Terminal A:  COMMIT;                                                       -- … B wakes up, re-reads stock = 0:
--              ERROR:  out of stock: Máy tính Casio FX-880BTG — 0 left, 1 wanted

SELECT o.id, o.customer_id, o.status, oi.qty
FROM orders o JOIN order_item oi ON oi.order_id = o.id
WHERE oi.product_id = 34 AND o.id > 2000 ORDER BY o.id;   -- 2002 (v0), 2003 cancelled, 2004 — no order for B this time

SELECT stock FROM product WHERE id = 34;   -- 0

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T4 · The order total — and a payment that must match it                 │
-- └─────────────────────────────────────────────────────────────────────────┘
-- STABLE: it reads a table, so its answer can change between statements — never IMMUTABLE.
-- shop.order_item, schema-qualified: PostgreSQL 17 runs index/maintenance work with a safe search_path
-- (pg_catalog, pg_temp), so a function that may end up there must not rely on the caller's search_path.
CREATE FUNCTION order_total(p_order bigint) RETURNS numeric
LANGUAGE sql STABLE
AS $$
  SELECT coalesce(sum(qty * unit_price), 0) FROM shop.order_item WHERE order_id = p_order
$$;

SELECT order_total(2001) AS total_2001, order_total(1) AS total_1, order_total(-1) AS no_such_order;

SELECT count(*) AS payments, count(*) FILTER (WHERE amount <> order_total(order_id)) AS wrong
FROM payment;   -- 1663 | 0

-- Why the label matters: an index stores answers forever, so PostgreSQL only accepts IMMUTABLE functions there.
CREATE INDEX payment_gap_idx ON payment ((amount - order_total(order_id)));   -- ERROR

-- The guard: the payment gateway reports what the customer paid; accept it only if it equals the order total.
CREATE FUNCTION check_payment_amount() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_total numeric := order_total(NEW.order_id);
BEGIN
  IF NEW.amount <> v_total THEN
    RAISE EXCEPTION 'payment for order % is % but the order total is %', NEW.order_id, NEW.amount, v_total;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER payment_amount_guard
  BEFORE INSERT OR UPDATE OF amount, order_id ON payment
  FOR EACH ROW EXECUTE FUNCTION check_payment_amount();

INSERT INTO payment (order_id, amount, method) VALUES (2001, 600000, 'momo');   -- ERROR: a tampered amount

INSERT INTO payment (order_id, amount, method) VALUES (2001, order_total(2001), 'momo');

UPDATE orders SET status = 'paid' WHERE id = 2001;

-- Order + payment in ONE transaction: the payment fails ⇒ the order, its lines and the stock go back too.
SELECT (SELECT count(*) FROM orders) AS orders, (SELECT stock FROM product WHERE id = 12) AS stock_12,
       (SELECT count(*) FROM stock_movement) AS ledger_rows;

BEGIN;
SELECT place_order(55, '[{"product_id": 12, "qty": 2}]') AS order_id;
INSERT INTO payment (order_id, amount, method)
SELECT max(id), 1000, 'card' FROM orders;   -- ERROR: 1000 ≠ the total
ROLLBACK;

SELECT (SELECT count(*) FROM orders) AS orders, (SELECT stock FROM product WHERE id = 12) AS stock_12,
       (SELECT count(*) FROM stock_movement) AS ledger_rows;   -- the same three numbers

SELECT place_order(55, '[{"product_id": 12, "qty": 2}]') AS order_id;   -- 2006, not 2005: a sequence never goes back

-- Trap: a CHECK that calls the function. PostgreSQL accepts it …
ALTER TABLE payment ADD CONSTRAINT payment_matches_total CHECK (amount = order_total(order_id));

-- … but a CHECK only looks at the row being written. Changing the LINES of a paid order is not seen:
UPDATE order_item SET qty = qty + 1 WHERE order_id = 2001 AND product_id = 4;

SELECT amount, order_total(order_id) AS total_now FROM payment WHERE order_id = 2001;   -- 674.000 vs 702.000

UPDATE order_item SET qty = qty - 1 WHERE order_id = 2001 AND product_id = 4;   -- put it back

ALTER TABLE payment DROP CONSTRAINT payment_matches_total;   -- a CHECK must be about its own row only

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T5 · A daily-revenue VIEW for accounting + a role that sees only that   │
-- └─────────────────────────────────────────────────────────────────────────┘
-- "A day" in Việt Nam. paid_at::date would depend on the TimeZone of whoever asks.
CREATE VIEW daily_revenue AS
SELECT (pm.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS day,
       count(*) AS payments,
       sum(pm.amount) AS revenue
FROM payment pm
GROUP BY 1;

SELECT * FROM daily_revenue WHERE day BETWEEN '2026-09-26' AND '2026-09-30' ORDER BY day;

-- Trap: the naive view, read by an app server whose sessions run in UTC (the default of the postgres Docker image).
CREATE VIEW daily_revenue_naive AS
SELECT pm.paid_at::date AS day, count(*) AS payments, sum(pm.amount) AS revenue
FROM payment pm
GROUP BY 1;

SET TimeZone = 'UTC';

SELECT d.day, n.revenue AS naive_in_utc, d.revenue AS correct
FROM daily_revenue d JOIN daily_revenue_naive n USING (day)
WHERE d.day BETWEEN '2026-09-26' AND '2026-09-30' ORDER BY d.day;

SELECT count(*) AS payments, count(*) FILTER (WHERE paid_at::date <> (paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')::date) AS other_day
FROM payment WHERE order_id <= 2000;   -- 1663 | 459: every payment between 00:00 and 07:00 Việt Nam time lands on the day before

SET TimeZone = 'Asia/Ho_Chi_Minh';

DROP VIEW daily_revenue_naive;

-- A read-only role for the accountant's tool: the view, nothing else.
DROP ROLE IF EXISTS ctshop_report;

CREATE ROLE ctshop_report NOLOGIN;

GRANT USAGE ON SCHEMA shop TO ctshop_report;

GRANT SELECT ON daily_revenue TO ctshop_report;

SET ROLE ctshop_report;

SELECT count(*) AS days, sum(payments) AS payments, sum(revenue) AS revenue FROM daily_revenue;   -- works: the view runs with its OWNER's rights

SELECT count(*) FROM payment;   -- ERROR: permission denied

SELECT place_order(1, '[{"product_id": 1, "qty": 1}]');   -- EXECUTE is granted to PUBLIC by default …

RESET ROLE;

REVOKE EXECUTE ON FUNCTION place_order(bigint, jsonb) FROM PUBLIC;   -- … so take it away

SET ROLE ctshop_report;

SELECT place_order(1, '[{"product_id": 1, "qty": 1}]');   -- refused at the door now

RESET ROLE;

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T6 · A MATERIALIZED VIEW: the best-selling products                     │
-- └─────────────────────────────────────────────────────────────────────────┘
CREATE MATERIALIZED VIEW product_rank AS
SELECT p.id AS product_id, p.sku, p.name,
       sum(oi.qty) AS units,
       sum(oi.qty * oi.unit_price) AS revenue,
       rank() OVER (ORDER BY sum(oi.qty * oi.unit_price) DESC) AS rnk,
       now() AS refreshed_at
FROM order_item oi
JOIN orders o ON o.id = oi.order_id AND o.status <> 'cancelled'
JOIN product p ON p.id = oi.product_id
GROUP BY p.id;

SELECT rnk, sku, name, units, revenue FROM product_rank WHERE rnk <= 5 ORDER BY rnk;

-- Measure: the stored rows vs computing it live (the same query without the matview).
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
SELECT rnk, sku, units, revenue FROM product_rank WHERE rnk <= 5;

EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
SELECT * FROM (
  SELECT p.sku, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue,
         rank() OVER (ORDER BY sum(oi.qty * oi.unit_price) DESC) AS rnk
  FROM order_item oi
  JOIN orders o ON o.id = oi.order_id AND o.status <> 'cancelled'
  JOIN product p ON p.id = oi.product_id
  GROUP BY p.id) live
WHERE rnk <= 5;

-- A school orders 60 Casio FX-570VN Plus (product 32, rank 3). The board does not move: it is a photograph.
SELECT place_order(77, '[{"product_id": 32, "qty": 60}]') AS order_id;

SELECT rnk, sku, revenue, refreshed_at FROM product_rank WHERE product_id = 32;

REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;   -- ERROR: needs a unique index

CREATE UNIQUE INDEX product_rank_product_id ON product_rank (product_id);

REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;

SELECT rnk, sku, revenue, refreshed_at FROM product_rank WHERE product_id = 32;

-- ═══ TWO TERMINALS · T6A — what each kind of REFRESH does to a reader (do it by hand, in this order) ═══
-- Terminal A:  BEGIN;
-- Terminal A:  REFRESH MATERIALIZED VIEW product_rank;               -- AccessExclusiveLock until COMMIT
-- Terminal B:  SELECT rnk, sku, revenue FROM product_rank WHERE rnk <= 3;   -- waits …
-- Terminal A:  COMMIT;                                               -- … B gets its rows only now
-- Terminal A:  BEGIN;
-- Terminal A:  REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;
-- Terminal B:  SELECT rnk, sku, revenue FROM product_rank WHERE rnk <= 3;   -- answers at once
-- Terminal A:  COMMIT;

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ T7 · A real deadlock — two carts, the same two products, opposite order │
-- └─────────────────────────────────────────────────────────────────────────┘
-- ═══ TWO TERMINALS · T7A — an app that locks the cart lines in CART order (do it by hand) ═══
-- Terminal A:  BEGIN;
-- Terminal A:  SELECT stock FROM product WHERE id = 30 FOR UPDATE;   -- A's cart: Moleskine, then Faber-Castell
-- Terminal B:  BEGIN;
-- Terminal B:  SELECT stock FROM product WHERE id = 12 FOR UPDATE;   -- B's cart: Faber-Castell, then Moleskine
-- Terminal A:  SELECT stock FROM product WHERE id = 12 FOR UPDATE;   -- waits for B
-- Terminal B:  SELECT stock FROM product WHERE id = 30 FOR UPDATE;   -- waits for A ⇒ a circle
--              ~1 s later (deadlock_timeout) one of them: ERROR:  deadlock detected
-- Terminal A:  ROLLBACK;
-- Terminal B:  ROLLBACK;

-- ═══ TWO TERMINALS · T7B — the same two carts through place_order (it sorts the ids) ═══
-- Terminal A:  BEGIN;
-- Terminal A:  SELECT place_order(201, '[{"product_id": 30, "qty": 1}, {"product_id": 12, "qty": 1}]');
-- Terminal B:  SELECT place_order(202, '[{"product_id": 12, "qty": 1}, {"product_id": 30, "qty": 1}]');   -- waits, no circle
-- Terminal A:  COMMIT;                                                    -- B finishes: two orders, no error

-- ═══ TWO TERMINALS · T7C — trap: ANOTHER code path that locks in a different order ═══
-- Terminal A (warehouse script):  BEGIN;
-- Terminal A:  SELECT set_config('ctshop.reason', 'import', true);
-- Terminal A:  UPDATE product SET stock = stock + 20 WHERE id = 30;
-- Terminal B (checkout):  SELECT place_order(203, '[{"product_id": 12, "qty": 1}, {"product_id": 30, "qty": 1}]');   -- locks 12, waits for 30
-- Terminal A:  UPDATE product SET stock = stock + 20 WHERE id = 12;   -- waits for B ⇒ deadlock again
-- Terminal A:  COMMIT;

-- The rule holds only if EVERY code path follows it: the warehouse script locks in id order too.
BEGIN;
SELECT set_config('ctshop.reason', 'import', true);
SELECT id, stock FROM product WHERE id IN (30, 12) ORDER BY id FOR UPDATE;
UPDATE product SET stock = stock + 20 WHERE id IN (12, 30);
COMMIT;

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ Self-check — your end state                                             │
-- └─────────────────────────────────────────────────────────────────────────┘
SELECT count(*) FILTER (WHERE gap <> 0) AS mismatched_products FROM stock_check;   -- 0

SELECT count(*) AS orders_after_2000,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       (SELECT count(*) FROM payment WHERE amount <> order_total(order_id)) AS wrong_payments
FROM orders WHERE id > 2000;

SELECT reason, count(*) AS rows, sum(change) AS units FROM stock_movement GROUP BY reason ORDER BY reason;

SELECT event_object_table AS "table", trigger_name, action_timing AS timing, string_agg(event_manipulation, ' OR ') AS events
FROM information_schema.triggers WHERE trigger_schema = 'shop'
GROUP BY 1, 2, 3 ORDER BY 1, 2;

SELECT p.proname AS function, p.provolatile AS volatility, pg_get_function_result(p.oid) AS returns
FROM pg_proc p WHERE p.pronamespace = 'shop'::regnamespace ORDER BY 1;`;
/* SOL:END */

/* Số đo thay đổi theo lần chạy ⇒ đọc thẳng từ output thật (không gõ tay). */
const lay = (k, re) => { const m = O[k].match(re); if (!m) throw new Error(`không thấy ${re} trong O.${k}`); return m[1]; };
const vn = (x, le = 0) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
const MV_MS = vn(lay('T6E1', /Execution Time: ([\d.]+)/), 3), LIVE_MS = vn(lay('T6E2', /Execution Time: ([\d.]+)/), 1);
const tgH = (k, re, n = 0) => Number(O[k].split('\n').filter((l) => re.test(l))[n].match(/\+([\d.]+)s/)[1]);
const CHO_REFRESH = vn(tgH('HT6A', /B│  rnk/) - tgH('HT6A', /B> SELECT/), 2);
const CHO_CONC = vn(tgH('HT6A', /B│  rnk/, 1) - tgH('HT6A', /B> SELECT/, 1), 2);

/* Output thật lab6-start.sql (dòng cuối) — that/pg-lab-6-start.out.txt. */
const SETUP = `$ docker cp lab6-start.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab6-start.sql
…   (DROP/CREATE SCHEMA, CREATE TABLE ×8, INSERT … — the standard shop)
 categories | products | customers | orders | order_lines | payments | stock_moves
------------+----------+-----------+--------+-------------+----------+-------------
         12 |       48 |       300 |   2000 |        5000 |     1663 |         429
(1 row)`;

/* Dòng thời gian hai phiên: công cụ ghi chú bằng tiếng Việt ⇒ bản EN dịch đúng ghi chú của công cụ (không đụng output psql). */
const hEn = (s) => s.replace(/⏳ \(sau ([\d.]+) s vẫn chưa có kết quả — đang chờ\)/g, '⏳ (no result after $1 s — waiting)')
  .replace(/-- sau \(phiên riêng\):/g, '-- afterwards (a third session):').replace(/-- setup \(phiên riêng\):/g, '-- setup (a third session):');
const hVi = (s) => s.replace(/-- sau \(phiên riêng\):/g, '-- sau đó (phiên thứ ba):');
/** Khối HAI PHIÊN: lệnh cho hai terminal (lấy từ SOL) + dòng thời gian thật. */
const khoiHai = (ten, vi) => {
  const a = SOL.indexOf(`-- ═══ TWO TERMINALS · ${ten}`);
  const b = SOL.indexOf('\n\n', a);
  const lenh = SOL.slice(a, b).split('\n').slice(1).filter((l) => /^-- (Terminal|\s{2,})/.test(l)).map((l) => l.replace(/^-- /, '')).join('\n');
  return code(lenh) +
    `<p class="meo">${vi ? '⏱ Chạy thật bằng hai phiên psql song song — mỗi dòng có thời điểm; <code>A&gt;</code> = lệnh gõ ở terminal A, <code>A│</code> = psql trả lời.' : '⏱ A real run with two psql sessions side by side — every line has a timestamp; <code>A&gt;</code> = typed in terminal A, <code>A│</code> = what psql printed.'}</p>` +
    out((vi ? hVi : hEn)(O[`H${ten}`]));
};

/* Prisma 5.22 chạy thật trên DB nháp (that/pg-lab-6.prisma.txt). */
const PRISMA_APP = `// ✗ checkout written in the app: one transaction, the lines in CART order
const thuLaiDuoc = (e) => e.code === 'P2034' || ['40P01', '40001'].includes(e.meta?.code);   // deadlock / serialization

async function checkoutApp(customer, cart, attempt = 1) {
  try {
    return await prisma.$transaction(async (tx) => {
      const [{ id }] = await tx.$queryRaw\`INSERT INTO orders (customer_id) VALUES (\${customer}) RETURNING id\`;
      await tx.$queryRaw\`SELECT set_config('ctshop.reason', 'sale', true), set_config('ctshop.order_id', \${String(id)}, true)\`;
      for (const it of cart) {                                   // ← cart order: [30, 12] for An, [12, 30] for Binh
        const n = await tx.$executeRaw\`UPDATE product SET stock = stock - \${it.qty}
                                       WHERE id = \${it.product_id} AND stock >= \${it.qty}\`;
        if (n === 0) throw new Error('out of stock');
        await tx.$executeRaw\`INSERT INTO order_item … \`;
        await sleep(150);                                        // per-line work: a coupon check, a price rule…
      }
      return id;
    });
  } catch (e) {
    if (thuLaiDuoc(e) && attempt < 3) return checkoutApp(customer, cart, attempt + 1);   // the WHOLE transaction again
    throw e;
  }
}`;
const PRISMA_FN = `// ✓ one call: the database function locks in id order, checks, writes — or raises
const [{ id }] = await prisma.$queryRaw\`
  SELECT place_order(\${customerId}::bigint, \${JSON.stringify(cart)}::jsonb) AS id\`;`;
const PRISMA_OUT = `— 1) app-side checkout, cart order, two carts at once
+1293ms Binh attempt 1: P2010 40P01 ERROR: deadlock detected DETAIL: Process 9362 waits for ShareLock on transaction 71353;
        blocked by process 9363. Process 9363 waits for ShareLock on transaction 71352; blocked by process 9362. …
+1445ms An attempt 1: order 2011
+1758ms Binh attempt 2: order 2012
— 2) place_order via $queryRaw, the same two carts
+1761ms Binh order 2013
+1763ms An order 2014
— 3) a business error
+1764ms Chi P2010 P0001 ERROR: out of stock: Máy tính Casio FX-880BTG — 0 left, 1 wanted HINT: the whole order was cancelled: nothing was sold
+1764ms Chi business error ⇒ do NOT retry, show it to the customer
+1766ms stock_check mismatched = 0`;
const PRISMA_MIG = `-- prisma/migrations/20261026120000_safe_checkout/migration.sql — written by hand
-- (schema.prisma has no syntax for functions or triggers; prisma migrate deploy runs this file as it is)
CREATE FUNCTION log_stock_change() RETURNS trigger LANGUAGE plpgsql AS $$ … $$;
CREATE TRIGGER product_stock_log AFTER UPDATE OF stock ON product
  FOR EACH ROW WHEN (OLD.stock IS DISTINCT FROM NEW.stock) EXECUTE FUNCTION log_stock_change();
CREATE FUNCTION cart_lines(p_items jsonb) RETURNS TABLE (product_id bigint, qty int) LANGUAGE sql IMMUTABLE AS $$ … $$;
CREATE FUNCTION place_order(p_customer bigint, p_items jsonb) RETURNS bigint LANGUAGE plpgsql AS $$ … $$;
REVOKE EXECUTE ON FUNCTION place_order(bigint, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION place_order(bigint, jsonb) TO ctshop_app;   -- the role your app connects as`;

const FILES = (vi) => [
  [`${F}/lab6-start.sql`, '🧩', 'lab6-start.sql', vi ? 'CT Shop sạch ở cỡ chuẩn (lược đồ + dữ liệu chuẩn, 2.000 đơn) + danh sách việc T1–T7 — một triệu đơn của Lab 5 bị xoá' : 'A clean CT Shop at its standard size (standard schema + data, 2.000 orders) + the T1–T7 to-do list — the million orders of Lab 5 are dropped'],
  [`${F}/lab6-solution.sql`, '🔑', 'lab6-solution.sql', vi ? 'Mọi hàm, trigger, view, matview; sáu khối HAI TERMINAL ghi sẵn từng lệnh; con số thật trong chú thích — mở sau khi tự làm' : 'Every function, trigger, view and matview; the six TWO-TERMINAL blocks written out step by step; real numbers in the comments — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

/** Một bước: đề + gợi ý + đáp án ẩn. */
const buoc = (lang, k, de, goiY, keys, sau = '') => `<h4>${k} — ${de}</h4>
${goiY ? `<p class="meo">💡 ${goiY}</p>` : ''}
${details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, keys.map((x) => code(Q[x]) + out(O[x])).join('\n') + (sau ? `<p>${sau}</p>` : ''))}`;
const bay = (tieuDe, chu, keys) => `<div class="pitfall"><p><strong>${tieuDe}</strong> ${chu}</p></div>
${keys.map((x) => code(Q[x]) + out(O[x])).join('\n')}`;
const qo = (...keys) => keys.map((x) => code(Q[x]) + out(O[x])).join('\n');

const RUBRIC = (vi) => `<table>
<tr><th>${vi ? 'Phần' : 'Part'}</th><th>${vi ? 'Điểm' : 'Points'}</th><th>${vi ? 'Chấm khi' : 'Awarded when'}</th></tr>
<tr><td>T1</td><td>1,5</td><td>${vi ? 'đo được sổ kho lệch 48/48 sản phẩm; dòng adjust mở sổ trong MỘT giao dịch ⇒ 0; trigger ghi sổ cho MỌI thay đổi tồn (cả sửa tay), có WHEN để form lưu cả sản phẩm không vỡ' : 'the ledger measured wrong on 48/48 products; the opening adjust rows in ONE transaction ⇒ 0; a trigger that logs EVERY stock change (manual fixes too), with WHEN so a whole-product save does not break'}</td></tr>
<tr><td>T2</td><td>2</td><td>${vi ? 'place_order khoá theo id (FOR UPDATE), kiểm trên dòng đã khoá, ghi đơn + dòng + kho, trả mã đơn; 4 giỏ sai đều bị từ chối và không để lại gì (2001 | 197 | 482)' : 'place_order locks in id order (FOR UPDATE), checks the locked rows, writes order + lines + stock, returns the id; the 4 wrong carts are refused and leave nothing behind (2001 | 197 | 482)'}</td></tr>
<tr><td>T3</td><td>2</td><td>${vi ? 'chạy thật hai terminal: bản ngây thơ bán 2 máy cho 1 máy trong kho, truy vấn đối soát bắt được đơn 2003; place_order chỉ bán 1, B nhận lỗi out of stock' : 'a real two-terminal run: the naive version sells 2 calculators for 1 in stock, the audit query catches order 2003; place_order sells 1 and B gets out of stock'}</td></tr>
<tr><td>T4</td><td>1,5</td><td>${vi ? 'order_total STABLE (giải thích vì sao không IMMUTABLE); 0/1663 thanh toán lệch; trigger chặn số tiền sai; đơn + thanh toán trong MỘT giao dịch; chỉ ra lỗ hổng của CHECK gọi hàm' : 'order_total STABLE (and why not IMMUTABLE); 0 of 1663 payments wrong; a trigger refuses a wrong amount; order + payment in ONE transaction; the hole in a CHECK that calls a function'}</td></tr>
<tr><td>T5</td><td>1</td><td>${vi ? 'view doanh thu theo ngày Việt Nam (AT TIME ZONE), nêu được 459 thanh toán sai ngày nếu dùng ::date ở UTC; role chỉ đọc view, bị từ chối bảng; REVOKE EXECUTE … FROM PUBLIC' : 'a revenue view by Việt Nam day (AT TIME ZONE), with the 459 payments that ::date in UTC puts on the wrong day; a role that reads the view and is refused the tables; REVOKE EXECUTE … FROM PUBLIC'}</td></tr>
<tr><td>T6</td><td>1</td><td>${vi ? 'matview xếp hạng, đo ' + MV_MS + ' ms vs ' + LIVE_MS + ' ms; thấy nó cũ; REFRESH CONCURRENTLY sau khi có UNIQUE index; dòng thời gian hai phiên: REFRESH thường bắt người đọc chờ, CONCURRENTLY thì không' : 'a ranking matview, measured ' + MV_MS + ' ms vs ' + LIVE_MS + ' ms; seen stale; REFRESH CONCURRENTLY after a UNIQUE index; the two-session timeline: plain REFRESH makes the reader wait, CONCURRENTLY does not'}</td></tr>
<tr><td>T7</td><td>1</td><td>${vi ? 'deadlock thật với hai giỏ ngược thứ tự; cùng hai giỏ qua place_order không deadlock; chỉ ra đường code thứ hai (script kho) cũng phải khoá theo id' : 'a real deadlock with two carts in opposite order; the same carts through place_order do not deadlock; the second code path (the warehouse script) must lock in id order too'}</td></tr>
</table>`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 6 · CT Shop · after Chapter 12</span>
<h2>Safe checkout: two people, one last item</h2>
<p class="lead">Labs 1–5 asked questions of CT Shop one at a time. A real shop is many people at the same moment — and that is where the bugs live that no single test user ever sees: the last calculator sold twice, a ledger that no longer adds up, a revenue report that disagrees with itself, two carts that wait for each other forever. This lab moves checkout into the database — one function, one transaction, the right locks — and proves every claim with a real run of two psql sessions side by side.</p>

<h3>1 · The brief</h3>
<p>CT Shop’s Monday meeting, before the 20:00 flash sale:</p>
<ul>
<li><strong>Marketing</strong>: “At 20:00 we sell the last <strong>Casio FX-880BTG</strong>. Thousands of students will click at the same second.” — It must be sold <strong>exactly once</strong>.</li>
<li><strong>Warehouse</strong>: “The stock log never matches the shelf.” — Every change of <code>product.stock</code> must leave a row in <code>stock_movement</code>, whoever makes it: checkout, the delivery script, or someone typing a quick fix in psql.</li>
<li><strong>Accounting</strong>: “A payment must equal its order total, and the daily revenue report must use <strong>Việt Nam days</strong>. Our report tool may read that report — nothing else.”</li>
<li><strong>Home page</strong>: “Show the best-selling products. It may be a few minutes old, but it must never freeze the page.”</li>
<li><strong>Ops</strong>: “Last week the log said <em>deadlock detected</em> twice. Find out why.”</li>
</ul>
<p>Tools: everything up to Chapter 12 — transactions, MVCC, <code>FOR UPDATE</code> and deadlocks (Chapter 11), functions, volatility, <code>RAISE</code>, triggers, views and materialized views (Chapter 12). Ch11 already sold the last pen twice with two hand-typed transactions and fixed it with one conditional UPDATE. Here the order has <strong>several</strong> lines, the prices are taken at the moment of buying, the ledger must follow, and the fix has to live in one place that every client uses. A few small tools are new and explained where they appear: <code>set_config</code> / <code>current_setting</code> with their <code>true</code> flag, <code>jsonb_to_recordset</code>, <code>CREATE OR REPLACE TRIGGER</code>, <code>SET ROLE</code> and <code>REVOKE … FROM PUBLIC</code>.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>T1</strong> — the stock ledger: measure how wrong it is, open it with one correction per product, then a trigger that logs <em>every</em> stock change.</li>
<li><strong>T2</strong> — <code>place_order(customer, items jsonb)</code>: all of checkout in one call and one transaction; a wrong cart is refused and leaves nothing behind.</li>
<li><strong>T3</strong> — the flash sale, in two terminals: the naive read-check-write version against <code>place_order</code>.</li>
<li><strong>T4</strong> — <code>order_total</code> with the right volatility label; a payment that does not match its order is refused; order + payment in one transaction.</li>
<li><strong>T5</strong> — a daily-revenue view in Việt Nam days, and a read-only role that sees only that view.</li>
<li><strong>T6</strong> — a materialized view of the best sellers: measure, see it go stale, refresh it without blocking readers.</li>
<li><strong>T7</strong> — reproduce the deadlock with two carts, and make it impossible.</li>
</ol>
<div class="callout ok"><p><strong>You pass when:</strong> <code>stock_check</code> shows <strong>0</strong> mismatched products (it starts at 48) · <code>place_order</code> sells the last FX-880BTG <strong>once</strong> — the second buyer gets <em>out of stock</em>, while the naive version sold it twice · the 4 wrong carts leave the shop at <strong>2001 orders | 197 pens | 482 ledger rows</strong> · <strong>0</strong> of the 1.663 payments differs from its order total and a tampered amount is refused · the report role reads <code>daily_revenue</code> and gets <em>permission denied</em> on <code>payment</code> · <code>REFRESH … CONCURRENTLY</code> works and the reader in terminal B never waits · the same two carts that deadlock in T7A both succeed through <code>place_order</code> · the self-check prints the two triggers and five functions shown in section 5.</p></div>
<p>Timestamps and process numbers on your machine will differ. What must not differ: who waits for whom, who gets the error, how many units were sold, and the counts.</p>
<h4>Rubric (10 points)</h4>
${RUBRIC(false)}

<h3>3 · Downloads and setup</h3>
<div class="callout"><p><code>pgdemo</code> is the name of <em>your</em> PostgreSQL 17 container. If you built it in lesson 0.3 it is called <code>pg17</code>: either write <code>pg17</code> instead of <code>pgdemo</code> in every command below, or give it the alias once with <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(false)}
<p>The start file rebuilds the standard shop — the same rows as Labs 1–4 — so whatever Lab 5 left behind (one million orders, ~500 MB) is gone:</p>
${out(SETUP)}
<p>Then open <strong>two terminals</strong> — T3, T6 and T7 are about two people acting at the same moment, and one psql session cannot be two people. In each terminal:</p>
${code(`docker exec -it pgdemo psql -U postgres -d ctshop
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';`)}
<p>Use terminal A for everything that is not marked “TWO TERMINALS”. When a block says <em>Terminal B</em>, switch windows and type there — in the order given, without waiting for B’s answer when the step says it waits.</p>

<h3>4 · Make checkout safe, step by step</h3>

<h4>T1 — the stock ledger</h4>
<p>The warehouse’s rule: the sum of all movements of a product must equal its stock. Ask the data — through a view, because you will ask the same question after every step:</p>
${qo('T1V', 'T1A', 'T1B')}
<p><strong>48 of 48</strong> products are wrong, by 4.025 units in total. The old app wrote the ledger on one code path only (one order in ten got its <code>sale</code> rows); everything else changed the stock silently. That is exactly the kind of rule application code forgets — and why Chapter 12 put it in a trigger.</p>
${buoc('en', 'T1b', 'open the ledger: one correction per product, all or nothing', 'Insert one <code>adjust</code> row per product with <code>change = gap</code>. Do it inside <code>BEGIN … COMMIT</code> and run the check <em>before</em> COMMIT: if it does not say 0, ROLLBACK and nothing happened.', ['T1BG', 'T1I', 'T1C', 'T1CM'], '48 rows, and the check says 0 while still inside the transaction — a second session would still see the old ledger until COMMIT (Chapter 11).')}
<p><strong>The trigger.</strong> It must fire on every change of <code>stock</code> — so <code>AFTER UPDATE OF stock</code>, <code>FOR EACH ROW</code>, and it writes one row with <code>NEW.stock - OLD.stock</code>. But a row in <code>stock_movement</code> also needs a <em>reason</em> and, for a sale, the <em>order</em> — and the product table does not know them. The caller does. <strong>New: <code>set_config(name, value, true)</code></strong> stores a value for the rest of the <em>current transaction</em> (the <code>true</code> = “local”; it vanishes at COMMIT/ROLLBACK). <strong><code>current_setting(name, true)</code></strong> reads it back; its <code>true</code> means “missing is OK” — NULL instead of an error. Nobody said why ⇒ <code>'adjust'</code>. The name needs a dot (<code>ctshop.reason</code>): that marks it as your own setting, not one of PostgreSQL’s.</p>
${qo('T1F', 'T1T')}
${bay('Trap — a form that saves the whole product.', 'An admin form — or an ORM — writes every column back, <code>stock</code> included, unchanged. <code>UPDATE OF stock</code> fires whenever stock is in the SET list, even with the same value; the trigger inserts <code>change = 0</code>, the ledger’s <code>CHECK (change &lt;&gt; 0)</code> refuses it — and because the trigger runs inside the UPDATE’s transaction, the price change is rolled back too:', ['T1X', 'T1XC'])}
<p>The fix is a <code>WHEN</code> condition, checked <em>before</em> the function is called (lesson 12.2). <strong>New: <code>CREATE OR REPLACE TRIGGER</code></strong> (PostgreSQL 14+) swaps the definition in one statement:</p>
${qo('T1W', 'T1WU')}
${buoc('en', 'T1c', 'test the trigger from three sides', 'A delivery that says why (in a transaction, with set_config), a quick fix typed in psql that says nothing, then the ledger rows and the check.', ['T1MB', 'T1MS', 'T1MU', 'T1MC', 'T1P', 'T1L', 'T1OK'], 'The delivery is logged as <code>import</code> (+50 for products 1 and 3), the psql fix as <code>adjust</code> (−2) — nobody can change the stock without leaving a row. And the price change of product 34 above left no row at all. Still 0 mismatched.')}
<p class="meo">💡 After the first <code>set_config</code> in a session, <code>current_setting(…, true)</code> returns an <em>empty string</em> — not NULL — once the transaction is over. That is why the trigger wraps it in <code>nullif(…, '')</code>.</p>

<h4>T2 — place_order: all of checkout in one call</h4>
<p>The app sends the cart as JSON: <code>[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, …]</code>. <strong>New: <code>jsonb_to_recordset</code></strong> turns such an array into rows with the columns you name. A small SQL function makes it a cart — one line per product, quantities added when a product appears twice (otherwise the order_item primary key would refuse the second line):</p>
${qo('T2CF', 'T2C')}
<p><code>cart_lines</code> is honestly <strong>IMMUTABLE</strong>: its answer depends only on its argument and it reads no table — the same JSON gives the same rows forever (lesson 12.1). <code>place_order</code> below is the opposite, <strong>VOLATILE</strong> (the default): it writes.</p>
<p class="meo">💡 Design it before you type: 1 · validate the input · 2 · <strong>lock</strong> every product of the cart with <code>SELECT … ORDER BY id FOR UPDATE</code> · 3 · check the <em>locked</em> rows (exists, for sale, enough stock) and <code>RAISE EXCEPTION</code> with a clear message otherwise · 4 · insert <code>orders</code>, then <code>order_item</code> with the price <em>now</em>, then subtract the stock — telling the T1 trigger the reason and the order. Return the new id.</p>
${details('Answer — T2 (the function)', code(Q.T2F) + out(O.T2F) + `<p>Three details carry the whole design. <strong>ORDER BY id FOR UPDATE</strong>: the plan locks rows <em>after</em> sorting them (a LockRows node above the Sort), so every caller takes the locks in the same order — T7 shows what happens otherwise. <strong>Check after locking</strong>: between our check and our UPDATE nobody else can change these rows, so the check cannot be outdated. <strong>RAISE EXCEPTION</strong> aborts the statement — and since a function runs inside the caller’s transaction (lesson 12.1), everything the call did so far is undone with it.</p>`)}
${buoc('en', 'T2c', 'customer 42 buys', 'Look at the stock before, call the function, then read the order, the stock and the ledger.', ['T2S0', 'T2O', 'T2OI', 'T2S1', 'T2L'], 'Order <strong>2001</strong>: the gel pen once, with qty 3 (2 + 1 merged), at 28.000 ₫ — the price at this moment, copied into the line (if the price changes tomorrow, this order keeps its own). Stock 200 → 197 and 179 → 178, and two <code>sale</code> rows with <code>order_id = 2001</code>, written by the trigger, not by the function.')}
${buoc('en', 'T2d', 'four wrong carts', 'Too many Moleskines (with a valid first line!), a product that does not exist, qty 0, an empty cart. Then count: did anything stay behind?', ['T2E1', 'T2E2', 'T2E3', 'T2E4', 'T2N'], 'Four errors, each with its own message; the first one also carries the HINT and the <code>CONTEXT</code> line telling you where in the function it was raised. And the shop is untouched: <strong>2001 orders, 197 gel pens, 482 ledger rows</strong> — the gel pen of the first cart was not sold either.')}

<h4>T3 — the flash sale, in two terminals</h4>
<p>First the version a developer writes when porting “read the stock, check it in code, write it back” straight into PL/pgSQL. The stock is read <em>without</em> a lock, and the new value is computed from that read:</p>
${qo('T3F')}
<p>The warehouse leaves exactly one FX-880BTG for 20:00 (the trigger logs the correction as <code>adjust</code>):</p>
${qo('T3S')}
<p>Two customers click at the same second. Customer 101’s request is a little ahead: its transaction is still open — in a real app it is waiting for the payment gateway before COMMIT. Customer 102’s request arrives meanwhile:</p>
${khoiHai('T3A', false)}
<p>Read it slowly. B’s <code>SELECT stock</code> did not wait — MVCC gave it the last committed version, stock = 1 (lesson 11.2) — so B passed the check and inserted its order. Only B’s UPDATE had to wait: A held the row lock. The moment A committed, B’s UPDATE went on and wrote <code>stock = v_stock - 1</code> = <strong>0</strong>, a number computed from a value that was no longer true. Two orders, one calculator, no error anywhere. The ledger saw it: B’s UPDATE changed 0 to 0, so the WHEN of T1 logged nothing — A’s order has its <code>sale</code> row, B’s has none.</p>
<p>That gives the warehouse an audit that catches overselling after the fact — units on the order vs units the ledger says left the shelf:</p>
${qo('T3AUD')}
<p>Order 2003 cannot be delivered. In real life customer service cancels it and apologises:</p>
${qo('T3CX', 'T3D')}
${buoc('en', 'T3b', 'the same race with place_order', 'Put the last unit back, then repeat the two terminals with <code>place_order</code>.', ['T3S2'])}
${khoiHai('T3B', false)}
<p>This time B waits at the <code>FOR UPDATE</code> — <em>before</em> it checks anything. When A commits, B gets the lock and reads the row again: stock is now <strong>0</strong>, so the check raises <em>out of stock</em> and B’s call leaves nothing behind. One calculator, one order:</p>
${qo('T3R', 'T3K')}
<p>Why not just the conditional UPDATE of Chapter 11 (<code>SET stock = stock - 1 WHERE … AND stock &gt;= 1</code>)? For one line it is perfect. A cart has several lines, needs to know <em>which</em> line is short to say so, and must copy the prices — <code>FOR UPDATE</code> gives the function a stable picture of all its rows to do that with.</p>

<h4>T4 — the order total, and a payment that must match it</h4>
${buoc('en', 'T4a', 'order_total — which volatility label?', 'It reads <code>order_item</code>, so its answer can change between two statements: STABLE (lesson 12.1). IMMUTABLE would be a lie the planner believes.', ['T4F', 'T4T', 'T4P'], 'Order 2001: 3 × 28.000 + 590.000 = <strong>674.000 ₫</strong>; an order that does not exist gives 0 thanks to <code>coalesce</code>. And all <strong>1.663</strong> old payments match their order — 0 wrong. The body names <code>shop.order_item</code>: PostgreSQL 17 runs index and maintenance work with a safe <code>search_path</code> (just <code>pg_catalog, pg_temp</code>), so a function that might be used there must not rely on the caller’s path.')}
${bay('Why the label matters — an index will not take it.', 'An index stores answers once and trusts them forever, so PostgreSQL accepts only IMMUTABLE functions in an index expression — the label is checked, not the truth:', ['T4X'])}
${buoc('en', 'T4b', 'the payment guard', 'The payment gateway reports what the customer paid. A BEFORE INSERT OR UPDATE trigger on payment compares it with <code>order_total(NEW.order_id)</code> and raises when they differ.', ['T4GF', 'T4GT', 'T4G1', 'T4G2', 'T4G3'], 'A tampered 600.000 is refused with both numbers in the message; the real total goes through; the order becomes <code>paid</code>.')}
<p><strong>Order and payment in one transaction.</strong> The checkout page creates the order and records the payment together. If the payment fails, the order must not exist either — and it won’t, because <code>place_order</code> runs inside the caller’s transaction:</p>
${qo('T4A0', 'T4AB', 'T4AO', 'T4AX', 'T4AR', 'T4A1', 'T4AN')}
<p>Before and after: <strong>2004 orders, 128 Faber-Castell sets, 486 ledger rows</strong> — the order, its line, the stock change and the ledger row all went back with the ROLLBACK. One thing did not: the next order is <strong>2006</strong>, not 2005. A sequence never goes back (it would have to wait for every other transaction to know whether a number is free). Order ids have gaps; never use them as invoice numbers that must be consecutive.</p>
${bay('Trap — a CHECK that calls the function.', 'Tempting: <code>CHECK (amount = order_total(order_id))</code> on payment. PostgreSQL accepts it — it does not look inside the function. But a CHECK is evaluated only for the row being written. Change the <em>lines</em> of a paid order, and nothing checks the payment:', ['T4K1', 'T4K2', 'T4K3'])}
${qo('T4K4', 'T4K5')}
<p>674.000 paid, 702.000 owed, no error. A CHECK must be about its own row only (it is also re-checked when a dump is restored, maybe before order_item is loaded). The trigger of T4b has the same blind spot — it guards the payment, not the lines. Closing it means refusing changes to the lines of an order that has a payment: that is challenge 2 in section 8.</p>

<h4>T5 — the daily revenue view, and a role that sees only it</h4>
<p class="meo">💡 What is “a day” for a shop in Việt Nam? <code>paid_at</code> is a <code>timestamptz</code>, an instant. <code>paid_at::date</code> converts it with the <em>session’s</em> TimeZone — so the answer depends on who asks. <code>paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> pins the local wall-clock time first.</p>
${qo('T5V', 'T5S')}
${bay('Trap — the same view read by a UTC session.', 'The postgres Docker image defaults to UTC, and an app server often connects with it. Here is a naive view (<code>paid_at::date</code>) read by such a session, next to the correct one:', ['T5NV', 'T5UTC', 'T5N', 'T5C', 'T5HCM', 'T5ND'])}
<p>Every day is wrong, in both directions (29/09: 1.164.000 vs 264.000). <strong>459</strong> of the 1.663 old payments — everything paid between 00:00 and 07:00 Việt Nam time — land on the day before. Accounting would get one number from the admin page and another from psql, with no error to explain it. Put the time zone in the view, not in the session.</p>
${buoc('en', 'T5b', 'a role that may read the report — and nothing else', 'A role without login (for the report tool), USAGE on the schema, SELECT on the view only. <strong>New: <code>SET ROLE</code></strong> lets a superuser act as that role inside the session (<code>RESET ROLE</code> to come back) — a quick way to test permissions.', ['T5R0', 'T5R1', 'T5R2', 'T5R3', 'T5R4', 'T5R5', 'T5R6', 'T5R7', 'T5R8', 'T5R9', 'T5R10', 'T5R11', 'T5R12'], 'The role reads the view — it runs with its owner’s rights (lesson 12.3) — and is refused the table: 597 days, 1.664 payments, 946.838.000 ₫. The surprise is <code>place_order</code>: the role was allowed to <em>call</em> it, because <strong>every new function is executable by PUBLIC</strong>; it failed only one level down, on <code>product</code>. After <code>REVOKE EXECUTE … FROM PUBLIC</code> it is refused at the door. Habit: revoke from PUBLIC, then grant EXECUTE to the role your app connects as.')}

<h4>T6 — a materialized view of the best sellers</h4>
${qo('T6M', 'T6S')}
<p>Note <code>now() AS refreshed_at</code> inside the query: it is frozen at refresh time and travels with every row (lesson 12.4). Now measure the photograph against computing it live:</p>
${qo('T6E1', 'T6E2')}
<p><strong>${MV_MS} ms</strong> and 1 page against <strong>${LIVE_MS} ms</strong> and 54 pages (two hash joins over 5.006 lines and 1.847 orders, an aggregate, a sort, a window). On 2.000 orders a few milliseconds is still fine; on Lab 5’s million it would be seconds on every home-page view. The price: the photo is old.</p>
${buoc('en', 'T6b', 'stale, then refreshed without blocking', 'A school orders 60 Casio FX-570VN Plus. Read the board, try REFRESH CONCURRENTLY, give it what it asks for, read again.', ['T6O', 'T6B', 'T6X', 'T6U', 'T6RC', 'T6A'], 'Order 2007, and the board still shows rank 3 and 112.860.000 ₫ — the photograph. CONCURRENTLY refuses until the matview has a UNIQUE index (it matches old and new rows by it, lesson 12.4); then the product climbs to <strong>rank 2</strong>, 142.560.000 ₫, with a new <code>refreshed_at</code>.')}
<p>What does each kind of refresh do to a reader? Terminal A refreshes inside a transaction (to keep the refresh “running” long enough to see — a real refresh on a big shop takes seconds), terminal B reads the board:</p>
${khoiHai('T6A', false)}
<p>With the plain REFRESH, B’s SELECT waits <strong>${CHO_REFRESH} s</strong> — until A commits: the plain refresh holds an <code>AccessExclusiveLock</code>, which blocks even readers. With CONCURRENTLY, B answers in ${CHO_CONC} s while A is still inside its transaction. On the home page that is the difference between “a few minutes old” and “frozen”. Schedule the refresh (lesson 12.4: an app job with node-cron, or an OS timer) in the same change that creates the matview.</p>

<h4>T7 — a real deadlock, and why it cannot happen to place_order</h4>
<p>Ops’ log: <em>deadlock detected</em>. The suspect is an older checkout in the app that locks each cart line when it reaches it — in <strong>cart</strong> order. An puts the Moleskine (30) in first, then the Faber-Castell set (12); Binh does it the other way round:</p>
${khoiHai('T7A', false)}
<p>A holds 30 and waits for 12; B holds 12 and waits for 30 — a circle nobody can leave. After <code>deadlock_timeout</code> (1 s) PostgreSQL cancels one of them (here A: <code>ERROR: deadlock detected</code>, with both process ids in DETAIL) and the other proceeds at the same instant. Now the same two carts through <code>place_order</code>:</p>
${khoiHai('T7B', false)}
<p>No error: both calls lock product 12 first (ORDER BY id), so B simply queues behind A on the first row, and no circle can form. Orders 2008 and 2009.</p>
${bay('Trap — a second code path with its own order.', 'The rule only works if <em>every</em> code path that locks several products follows it. The warehouse script adds stock for 30, then for 12 — while a checkout for 12 + 30 runs:', [])}
${khoiHai('T7C', false)}
<p>Deadlock again — this time inside <code>place_order</code> (see the CONTEXT: line 16, the PERFORM … FOR UPDATE), because the <em>other</em> side locked in a different order. The fix belongs in the script: lock in id order first, then update:</p>
${qo('T7W1', 'T7W2', 'T7W3', 'T7W4', 'T7W5')}
<p class="meo">💡 Why not just <code>UPDATE … WHERE id IN (12, 30)</code>? One UPDATE locks rows in the order its plan finds them — on a heap that has seen many updates, that is physical order, not id order. <code>SELECT … ORDER BY id FOR UPDATE</code> makes the order explicit.</p>

<h4>In a real Node app — Prisma, retries, and the function</h4>
<p>The same two carts from Node (Prisma 5.22, real run against the lab database). Version 1 is checkout written in the app, line by line in cart order, inside an interactive <code>$transaction</code> — with a retry for errors that mean “run the whole transaction again”:</p>
${code(PRISMA_APP, 'ts')}
${code(PRISMA_FN, 'ts')}
${out(PRISMA_OUT)}
<p>Version 1 deadlocked exactly like T7A — Prisma reports a raw-query failure as <strong>P2010</strong> with the PostgreSQL code in <code>meta.code</code> (<strong>40P01</strong>; with the model API you would see P2034 instead, as in lesson 11.3) — and the retry saved Binh’s order on attempt 2 (order 2010 was used by the rolled-back attempt: another gap). Version 2 never deadlocks: same carts, two orders, no retry. And a <strong>business error</strong> (SQLSTATE <strong>P0001</strong>, raised by our own RAISE) must <em>not</em> be retried — retrying “out of stock” only hammers the database; show it to the customer.</p>
<p>Where does the SQL live? Prisma’s schema has no syntax for functions or triggers (lesson 12.1): write them in a migration file by hand, and <code>prisma migrate deploy</code> applies it like any other:</p>
${code(PRISMA_MIG)}
<p>Your app then calls one function; the rules — lock order, checks, prices, ledger — cannot be skipped by a second service, a script or a forgotten endpoint.</p>

<h3>5 · Self-check — your end state must match</h3>
${qo('SC1', 'SC2', 'SC3', 'SC4', 'SC5')}
<p>8 orders after 2000 (2001–2004, 2006–2009 — 2005 was rolled back), one of them cancelled (the oversold 2003), 0 wrong payments. Volatility: <code>i</code> = IMMUTABLE, <code>s</code> = STABLE, <code>v</code> = VOLATILE.</p>
<ol>
<li>In T3A, B’s <code>SELECT stock</code> did not wait for A, but B’s UPDATE did. Why — and why did B still write the wrong number after waiting?</li>
<li><code>place_order</code> checks the stock in step 3. Why is that check safe in place_order and unsafe in place_order_v0, although both read the same column?</li>
<li>Two scripts each lock products 12 and 30. What single rule makes a deadlock between them impossible — and why is <code>UPDATE … WHERE id IN (12, 30)</code> not enough to follow it?</li>
</ol>
${details('Answers', `<ol><li>Plain reads never wait for writers: MVCC hands B the last committed version (stock = 1). Writers do wait for writers: B's UPDATE needed A's row lock. After A committed, B's UPDATE re-read the row but still assigned v_stock - 1, a value computed from the old read — so it wrote 0 again and the second sale went through.</li><li>place_order checks rows it has already locked with FOR UPDATE: until it commits, nobody can change them, so the check is still true when it writes. v0 checks an unlocked snapshot; another transaction can sell the item between the check and the write.</li><li>Every code path locks the rows in the same order (by id). An UPDATE locks rows in the order its plan visits them (physical order for a Seq Scan), which is not guaranteed to be id order — so lock first with SELECT … ORDER BY id FOR UPDATE.</li></ol>`)}

<h3>6 · Full solution</h3>
${details('Show the whole lab6-solution.sql', code(SOL))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>Read, check in code, write back a computed number</strong> — a read does not lock. Lock first (<code>FOR UPDATE</code>) or put the condition in the UPDATE.</p></div>
<div class="pitfall"><p><strong>Locking several rows in “whatever order”</strong> — cart order, request order, plan order. Two such transactions deadlock. One order for every code path: by id.</p></div>
<div class="pitfall"><p><strong>Retrying everything</strong> — retry deadlocks (40P01) and serialization failures (40001, P2034), the whole transaction, a few times. Never retry your own business errors (P0001).</p></div>
<div class="pitfall"><p><strong>A trigger that fires with no change</strong> — <code>UPDATE OF col</code> fires whenever col is in the SET list. Add <code>WHEN (OLD.col IS DISTINCT FROM NEW.col)</code>.</p></div>
<div class="pitfall"><p><strong>A setting that leaks</strong> — <code>set_config(…, false)</code> lasts the whole session; use <code>true</code> (transaction-local) and clear it after use.</p></div>
<div class="pitfall"><p><strong>STABLE work labelled IMMUTABLE</strong> — the planner and indexes believe the label. If it reads a table, it is not IMMUTABLE.</p></div>
<div class="pitfall"><p><strong>A CHECK that calls a function reading other tables</strong> — it is checked only when its own row is written. Use a trigger, and guard both sides.</p></div>
<div class="pitfall"><p><strong>paid_at::date</strong> — depends on the session TimeZone. Use <code>AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> inside the view.</p></div>
<div class="pitfall"><p><strong>Forgetting that EXECUTE is PUBLIC</strong> — every new function can be called by every role. <code>REVOKE … FROM PUBLIC</code>, then grant.</p></div>
<div class="pitfall"><p><strong>Plain REFRESH at peak time</strong> — readers wait for the whole refresh. CONCURRENTLY + a UNIQUE index.</p></div>
<div class="pitfall"><p><strong>Treating ids as consecutive</strong> — a rolled-back insert still uses a sequence number.</p></div>

<h3>8 · Extra challenge — and next: Lab 7</h3>
<ul>
<li><strong>Challenge 1 · cancel_order(order)</strong> — set the order to cancelled and put its stock back, so that the ledger gets <code>return</code> rows with the order id; refuse an order that is already shipped or cancelled. Test: stock_check stays at 0, and the T3 audit query still returns 0 rows.</li>
<li><strong>Challenge 2 · freeze paid orders</strong> — a trigger on <code>order_item</code> that refuses INSERT/UPDATE/DELETE for an order that has a payment. Re-run the CHECK trap of T4: it must now fail on the UPDATE of the line.</li>
<li><strong>Challenge 3 · the app may only sell</strong> — a role <code>ctshop_app</code> with no UPDATE on product at all, and <code>place_order</code> as <code>SECURITY DEFINER</code> with a pinned <code>search_path</code> (lesson 12.1). Prove that the app role can place an order but cannot <code>UPDATE product SET stock = 999</code>.</li>
</ul>
<p>Lab 7, after Chapter 13, opens the column every product has had since Lab 1 and nobody has used: <code>attrs jsonb</code> — brands, colours, tags — with GIN indexes and full-text search, so that customers can find “bút gel xanh 0.5” in a shop of thousands of products.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 6 · CT Shop · sau Chương 12</span>
<h2>Đặt hàng an toàn: hai người, một món cuối cùng</h2>
<p class="lead">Lab 1–5 hỏi CT Shop từng câu một. Cửa hàng thật là nhiều người cùng một lúc — và đó là nơi những lỗi mà không một người dùng thử nào thấy được sinh ra: món cuối cùng bán hai lần, sổ kho không còn khớp, báo cáo doanh thu tự mâu thuẫn, hai giỏ hàng chờ nhau mãi mãi. Lab này đưa việc đặt hàng vào cơ sở dữ liệu — một hàm, một giao dịch, đúng loại khoá — và chứng minh từng điều bằng hai phiên psql chạy thật song song.</p>

<h3>1 · Đề bài</h3>
<p>Buổi họp thứ Hai của CT Shop, trước đợt flash sale 20:00:</p>
<ul>
<li><strong>Marketing</strong>: "20:00 ta bán chiếc <strong>Casio FX-880BTG</strong> cuối cùng. Hàng nghìn sinh viên sẽ bấm trong cùng một giây." — Nó phải được bán <strong>đúng một lần</strong>.</li>
<li><strong>Kho</strong>: "Sổ nhập xuất chẳng bao giờ khớp với kệ." — Mỗi lần <code>product.stock</code> đổi phải để lại một dòng trong <code>stock_movement</code>, bất kể ai đổi: trang đặt hàng, script nhập hàng, hay ai đó gõ tay một lệnh sửa trong psql.</li>
<li><strong>Kế toán</strong>: "Một khoản thanh toán phải bằng đúng tổng đơn, và báo cáo doanh thu theo ngày phải dùng <strong>ngày Việt Nam</strong>. Công cụ báo cáo của chúng tôi được đọc báo cáo đó — không gì khác."</li>
<li><strong>Trang chủ</strong>: "Hiện các sản phẩm bán chạy nhất. Cũ vài phút cũng được, nhưng không bao giờ được làm trang đứng hình."</li>
<li><strong>Vận hành</strong>: "Tuần trước log ghi <em>deadlock detected</em> hai lần. Tìm xem vì sao."</li>
</ul>
<p>Công cụ: mọi thứ tới Chương 12 — giao dịch, MVCC, <code>FOR UPDATE</code> và deadlock (Chương 11), hàm, volatility, <code>RAISE</code>, trigger, view và materialized view (Chương 12). Ch11 đã bán chiếc bút cuối cùng hai lần bằng hai giao dịch gõ tay và sửa bằng một câu UPDATE có điều kiện. Ở đây đơn hàng có <strong>nhiều</strong> dòng, giá lấy tại lúc mua, sổ kho phải đi theo, và cách sửa phải nằm ở một chỗ duy nhất mà mọi client đều dùng. Vài công cụ nhỏ là mới và được giảng ngay chỗ xuất hiện: <code>set_config</code> / <code>current_setting</code> với cờ <code>true</code> của chúng, <code>jsonb_to_recordset</code>, <code>CREATE OR REPLACE TRIGGER</code>, <code>SET ROLE</code> và <code>REVOKE … FROM PUBLIC</code>.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>T1</strong> — sổ kho: đo xem nó sai bao nhiêu, mở sổ bằng một dòng điều chỉnh cho mỗi sản phẩm, rồi một trigger ghi <em>mọi</em> lần đổi tồn.</li>
<li><strong>T2</strong> — <code>place_order(customer, items jsonb)</code>: toàn bộ việc đặt hàng trong một lời gọi và một giao dịch; giỏ sai bị từ chối và không để lại gì.</li>
<li><strong>T3</strong> — flash sale, trên hai terminal: bản ngây thơ đọc-kiểm-ghi đối đầu <code>place_order</code>.</li>
<li><strong>T4</strong> — <code>order_total</code> với nhãn volatility đúng; thanh toán không khớp đơn bị từ chối; đơn + thanh toán trong một giao dịch.</li>
<li><strong>T5</strong> — view doanh thu theo ngày Việt Nam, và một role chỉ đọc chỉ thấy đúng view đó.</li>
<li><strong>T6</strong> — materialized view sản phẩm bán chạy: đo, thấy nó cũ đi, làm mới mà không chặn người đọc.</li>
<li><strong>T7</strong> — tái hiện deadlock bằng hai giỏ hàng, và làm cho nó không thể xảy ra.</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi:</strong> <code>stock_check</code> báo <strong>0</strong> sản phẩm lệch (lúc đầu là 48) · <code>place_order</code> bán chiếc FX-880BTG cuối cùng <strong>một lần</strong> — người mua thứ hai nhận <em>out of stock</em>, trong khi bản ngây thơ bán hai lần · 4 giỏ sai để shop ở đúng <strong>2001 đơn | 197 bút | 482 dòng sổ kho</strong> · <strong>0</strong> trong 1.663 thanh toán lệch tổng đơn và số tiền bị sửa bị từ chối · role báo cáo đọc được <code>daily_revenue</code> và nhận <em>permission denied</em> ở <code>payment</code> · <code>REFRESH … CONCURRENTLY</code> chạy được và người đọc ở terminal B không phải chờ · đúng hai giỏ deadlock ở T7A đều thành công qua <code>place_order</code> · phần tự kiểm in ra hai trigger và năm hàm như mục 5.</p></div>
<p>Thời điểm và số tiến trình trên máy bạn sẽ khác. Thứ không được khác: ai chờ ai, ai nhận lỗi, bán được bao nhiêu món, và các con số đếm.</p>
<h4>Thang điểm (10 điểm)</h4>
${RUBRIC(true)}

<h3>3 · Tệp tải về và chuẩn bị</h3>
<div class="callout"><p><code>pgdemo</code> là tên container PostgreSQL 17 của <em>bạn</em>. Nếu bạn dựng theo bài 0.3 thì nó tên <code>pg17</code>: hoặc thay <code>pgdemo</code> bằng <code>pg17</code> trong mọi lệnh bên dưới, hoặc đổi tên một lần bằng <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(true)}
<p>Tệp khởi đầu dựng lại shop chuẩn — đúng các dòng của Lab 1–4 — nên mọi thứ Lab 5 để lại (một triệu đơn, ~500 MB) đều mất:</p>
${out(SETUP)}
<p>Rồi mở <strong>hai terminal</strong> — T3, T6 và T7 nói về hai người làm cùng một lúc, và một phiên psql không thể là hai người. Ở mỗi terminal:</p>
${code(`docker exec -it pgdemo psql -U postgres -d ctshop
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';`)}
<p>Dùng terminal A cho mọi thứ không ghi "TWO TERMINALS". Khi một khối ghi <em>Terminal B</em>, chuyển cửa sổ và gõ ở đó — đúng thứ tự đã ghi, và không chờ B trả lời khi bước đó nói B sẽ chờ.</p>

<h3>4 · Làm cho việc đặt hàng an toàn, từng bước</h3>

<h4>T1 — sổ kho</h4>
<p>Luật của kho: tổng mọi lần nhập xuất của một sản phẩm phải bằng tồn kho của nó. Hỏi dữ liệu — qua một view, vì sau mỗi bước bạn sẽ hỏi lại đúng câu này:</p>
${qo('T1V', 'T1A', 'T1B')}
<p><strong>48 trên 48</strong> sản phẩm sai, tổng cộng lệch 4.025 đơn vị. Ứng dụng cũ chỉ ghi sổ ở một đường code (cứ mười đơn mới có một đơn được ghi dòng <code>sale</code>); mọi chỗ khác đổi tồn kho trong im lặng. Đó đúng là loại luật mà code ứng dụng hay quên — và là lý do Chương 12 đặt nó vào trigger.</p>
${buoc('vi', 'T1b', 'mở sổ: một dòng điều chỉnh cho mỗi sản phẩm, hoặc tất cả hoặc không', 'Chèn một dòng <code>adjust</code> cho mỗi sản phẩm với <code>change = gap</code>. Làm trong <code>BEGIN … COMMIT</code> và chạy câu kiểm <em>trước</em> COMMIT: nếu nó không báo 0 thì ROLLBACK, coi như chưa có gì.', ['T1BG', 'T1I', 'T1C', 'T1CM'], '48 dòng, và câu kiểm báo 0 ngay khi còn trong giao dịch — một phiên khác vẫn thấy sổ cũ cho tới khi COMMIT (Chương 11).')}
<p><strong>Trigger.</strong> Nó phải chạy ở mọi lần đổi <code>stock</code> — nên là <code>AFTER UPDATE OF stock</code>, <code>FOR EACH ROW</code>, ghi một dòng với <code>NEW.stock - OLD.stock</code>. Nhưng một dòng trong <code>stock_movement</code> còn cần <em>lý do</em> và, với bán hàng, cần <em>đơn hàng</em> — mà bảng product không biết những thứ đó. Người gọi biết. <strong>Mới: <code>set_config(tên, giá trị, true)</code></strong> lưu một giá trị cho phần còn lại của <em>giao dịch hiện tại</em> (<code>true</code> = "cục bộ"; nó biến mất khi COMMIT/ROLLBACK). <strong><code>current_setting(tên, true)</code></strong> đọc lại; <code>true</code> của nó nghĩa là "thiếu cũng được" — trả NULL thay vì báo lỗi. Không ai nói lý do ⇒ <code>'adjust'</code>. Tên phải có dấu chấm (<code>ctshop.reason</code>): dấu chấm đánh dấu đây là thiết lập của riêng bạn, không phải của PostgreSQL.</p>
${qo('T1F', 'T1T')}
${bay('Bẫy — form lưu cả sản phẩm.', 'Một form admin — hay một ORM — ghi lại mọi cột, kể cả <code>stock</code> không đổi. <code>UPDATE OF stock</code> chạy hễ stock có trong danh sách SET, dù giá trị y như cũ; trigger chèn <code>change = 0</code>, <code>CHECK (change &lt;&gt; 0)</code> của sổ kho từ chối — và vì trigger chạy trong giao dịch của câu UPDATE, việc đổi giá cũng bị huỷ theo:', ['T1X', 'T1XC'])}
<p>Cách sửa là điều kiện <code>WHEN</code>, được kiểm <em>trước</em> khi gọi hàm (bài 12.2). <strong>Mới: <code>CREATE OR REPLACE TRIGGER</code></strong> (PostgreSQL 14+) thay định nghĩa trong một câu lệnh:</p>
${qo('T1W', 'T1WU')}
${buoc('vi', 'T1c', 'thử trigger từ ba phía', 'Một lần nhập hàng có nói lý do (trong giao dịch, với set_config), một lệnh sửa gõ tay trong psql không nói gì, rồi xem các dòng sổ kho và câu kiểm.', ['T1MB', 'T1MS', 'T1MU', 'T1MC', 'T1P', 'T1L', 'T1OK'], 'Lần nhập hàng được ghi là <code>import</code> (+50 cho sản phẩm 1 và 3), lệnh sửa tay là <code>adjust</code> (−2) — không ai đổi được tồn kho mà không để lại dấu. Còn lần đổi giá sản phẩm 34 ở trên không để lại dòng nào. Vẫn 0 sản phẩm lệch.')}
<p class="meo">💡 Sau lần <code>set_config</code> đầu tiên trong một phiên, khi giao dịch đã kết thúc <code>current_setting(…, true)</code> trả về <em>chuỗi rỗng</em> — không phải NULL. Vì thế trigger bọc nó trong <code>nullif(…, '')</code>.</p>

<h4>T2 — place_order: toàn bộ việc đặt hàng trong một lời gọi</h4>
<p>Ứng dụng gửi giỏ hàng dạng JSON: <code>[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, …]</code>. <strong>Mới: <code>jsonb_to_recordset</code></strong> biến một mảng như thế thành các dòng với những cột bạn đặt tên. Một hàm SQL nhỏ biến nó thành giỏ hàng — mỗi sản phẩm một dòng, cộng dồn số lượng khi một sản phẩm xuất hiện hai lần (không thì khoá chính của order_item sẽ từ chối dòng thứ hai):</p>
${qo('T2CF', 'T2C')}
<p><code>cart_lines</code> là <strong>IMMUTABLE</strong> một cách trung thực: kết quả chỉ phụ thuộc vào tham số và nó không đọc bảng nào — cùng một JSON cho ra cùng các dòng mãi mãi (bài 12.1). <code>place_order</code> bên dưới thì ngược lại, <strong>VOLATILE</strong> (mặc định): nó ghi dữ liệu.</p>
<p class="meo">💡 Thiết kế trước khi gõ: 1 · kiểm đầu vào · 2 · <strong>khoá</strong> mọi sản phẩm trong giỏ bằng <code>SELECT … ORDER BY id FOR UPDATE</code> · 3 · kiểm trên các dòng <em>đã khoá</em> (có tồn tại, đang bán, đủ hàng), sai thì <code>RAISE EXCEPTION</code> với thông báo rõ ràng · 4 · chèn <code>orders</code>, rồi <code>order_item</code> với giá <em>lúc này</em>, rồi trừ tồn kho — báo cho trigger T1 lý do và mã đơn. Trả về mã đơn mới.</p>
${details('Đáp án — T2 (hàm)', code(Q.T2F) + out(O.T2F) + `<p>Ba chi tiết gánh cả thiết kế. <strong>ORDER BY id FOR UPDATE</strong>: kế hoạch khoá các dòng <em>sau khi</em> đã sắp xếp (nút LockRows nằm trên nút Sort), nên mọi lời gọi lấy khoá theo cùng một thứ tự — T7 cho thấy chuyện gì xảy ra nếu không. <strong>Kiểm sau khi khoá</strong>: giữa lúc ta kiểm và lúc ta UPDATE không ai đổi được các dòng này, nên phép kiểm không thể lỗi thời. <strong>RAISE EXCEPTION</strong> huỷ câu lệnh — và vì hàm chạy trong giao dịch của người gọi (bài 12.1), mọi thứ lời gọi đã làm tới lúc đó bị huỷ theo.</p>`)}
${buoc('vi', 'T2c', 'khách 42 mua hàng', 'Xem tồn kho trước, gọi hàm, rồi đọc đơn, tồn kho và sổ kho.', ['T2S0', 'T2O', 'T2OI', 'T2S1', 'T2L'], 'Đơn <strong>2001</strong>: bút gel xuất hiện một lần với qty 3 (2 + 1 được gộp), giá 28.000 ₫ — giá ngay lúc này, chép vào dòng đơn (mai giá có đổi thì đơn này vẫn giữ giá của nó). Tồn kho 200 → 197 và 179 → 178, và hai dòng <code>sale</code> với <code>order_id = 2001</code>, do trigger ghi chứ không phải do hàm.')}
${buoc('vi', 'T2d', 'bốn giỏ hàng sai', 'Quá nhiều sổ Moleskine (có dòng đầu hợp lệ!), một sản phẩm không tồn tại, qty 0, một giỏ rỗng. Rồi đếm: có gì bị bỏ lại không?', ['T2E1', 'T2E2', 'T2E3', 'T2E4', 'T2N'], 'Bốn lỗi, mỗi lỗi một thông báo riêng; lỗi đầu còn kèm HINT và dòng <code>CONTEXT</code> chỉ chỗ trong hàm đã báo lỗi. Và shop không suy suyển: <strong>2001 đơn, 197 bút gel, 482 dòng sổ kho</strong> — cây bút gel của giỏ đầu cũng không bị bán.')}

<h4>T3 — flash sale, trên hai terminal</h4>
<p>Trước hết là phiên bản mà một lập trình viên viết khi chép thẳng "đọc tồn kho, kiểm ở code, ghi lại" vào PL/pgSQL. Tồn kho được đọc <em>không</em> khoá, và giá trị mới được tính từ lần đọc đó:</p>
${qo('T3F')}
<p>Kho để lại đúng một chiếc FX-880BTG cho 20:00 (trigger ghi lần chỉnh này là <code>adjust</code>):</p>
${qo('T3S')}
<p>Hai khách bấm trong cùng một giây. Yêu cầu của khách 101 đi trước một chút: giao dịch của nó vẫn đang mở — trong ứng dụng thật, nó đang chờ cổng thanh toán trả lời trước khi COMMIT. Yêu cầu của khách 102 tới đúng lúc đó:</p>
${khoiHai('T3A', true)}
<p>Đọc chậm thôi. <code>SELECT stock</code> của B không phải chờ — MVCC đưa cho nó phiên bản đã commit gần nhất, stock = 1 (bài 11.2) — nên B qua được phép kiểm và chèn đơn của mình. Chỉ có UPDATE của B phải chờ: A đang giữ khoá dòng. Ngay khi A commit, UPDATE của B chạy tiếp và ghi <code>stock = v_stock - 1</code> = <strong>0</strong>, một con số tính từ giá trị đã không còn đúng. Hai đơn, một chiếc máy tính, không có lỗi nào ở đâu cả. Sổ kho thì nhìn thấy: UPDATE của B đổi 0 thành 0, nên WHEN của T1 không ghi gì — đơn của A có dòng <code>sale</code>, đơn của B thì không.</p>
<p>Từ đó kho có một phép đối soát bắt được việc bán vượt sau sự việc — số món trên đơn so với số món mà sổ kho nói đã rời kệ:</p>
${qo('T3AUD')}
<p>Đơn 2003 không thể giao. Ngoài đời, chăm sóc khách hàng huỷ nó và xin lỗi khách:</p>
${qo('T3CX', 'T3D')}
${buoc('vi', 'T3b', 'cùng cuộc đua đó với place_order', 'Đặt lại món cuối cùng, rồi lặp lại hai terminal với <code>place_order</code>.', ['T3S2'])}
${khoiHai('T3B', true)}
<p>Lần này B chờ ngay ở <code>FOR UPDATE</code> — <em>trước khi</em> nó kiểm bất cứ thứ gì. Khi A commit, B lấy được khoá và đọc lại dòng: stock giờ là <strong>0</strong>, nên phép kiểm báo <em>out of stock</em> và lời gọi của B không để lại gì. Một chiếc máy tính, một đơn:</p>
${qo('T3R', 'T3K')}
<p>Sao không dùng luôn câu UPDATE có điều kiện của Chương 11 (<code>SET stock = stock - 1 WHERE … AND stock &gt;= 1</code>)? Với một dòng thì nó hoàn hảo. Một giỏ hàng có nhiều dòng, cần biết <em>dòng nào</em> thiếu hàng để báo, và phải chép giá — <code>FOR UPDATE</code> cho hàm một bức tranh ổn định về mọi dòng của nó để làm những việc đó.</p>

<h4>T4 — tổng đơn, và khoản thanh toán phải khớp với nó</h4>
${buoc('vi', 'T4a', 'order_total — nhãn volatility nào?', 'Nó đọc <code>order_item</code>, nên kết quả có thể đổi giữa hai câu lệnh: STABLE (bài 12.1). IMMUTABLE sẽ là một lời nói dối mà planner tin.', ['T4F', 'T4T', 'T4P'], 'Đơn 2001: 3 × 28.000 + 590.000 = <strong>674.000 ₫</strong>; đơn không tồn tại cho 0 nhờ <code>coalesce</code>. Và cả <strong>1.663</strong> thanh toán cũ đều khớp đơn — 0 sai. Thân hàm ghi rõ <code>shop.order_item</code>: PostgreSQL 17 chạy việc dựng chỉ mục và bảo trì với một <code>search_path</code> an toàn (chỉ <code>pg_catalog, pg_temp</code>), nên hàm nào có thể bị dùng ở đó thì không được dựa vào search_path của người gọi.')}
${bay('Vì sao nhãn quan trọng — chỉ mục không nhận nó.', 'Chỉ mục lưu kết quả một lần rồi tin mãi mãi, nên PostgreSQL chỉ nhận hàm IMMUTABLE trong biểu thức chỉ mục — nó kiểm cái nhãn, không kiểm sự thật:', ['T4X'])}
${buoc('vi', 'T4b', 'chốt chặn thanh toán', 'Cổng thanh toán báo khách đã trả bao nhiêu. Một trigger BEFORE INSERT OR UPDATE trên payment so số đó với <code>order_total(NEW.order_id)</code> và báo lỗi khi khác nhau.', ['T4GF', 'T4GT', 'T4G1', 'T4G2', 'T4G3'], 'Số 600.000 bị sửa bị từ chối, thông báo có cả hai con số; tổng thật thì qua; đơn chuyển sang <code>paid</code>.')}
<p><strong>Đơn và thanh toán trong một giao dịch.</strong> Trang thanh toán tạo đơn và ghi thanh toán cùng lúc. Nếu thanh toán hỏng, đơn cũng không được tồn tại — và nó sẽ không tồn tại, vì <code>place_order</code> chạy trong giao dịch của người gọi:</p>
${qo('T4A0', 'T4AB', 'T4AO', 'T4AX', 'T4AR', 'T4A1', 'T4AN')}
<p>Trước và sau: <strong>2004 đơn, 128 bộ Faber-Castell, 486 dòng sổ kho</strong> — đơn, dòng đơn, lần trừ kho và dòng sổ kho đều quay về theo ROLLBACK. Có một thứ không quay về: đơn tiếp theo là <strong>2006</strong>, không phải 2005. Sequence không bao giờ lùi (muốn lùi nó sẽ phải chờ mọi giao dịch khác để biết một con số còn trống hay không). Mã đơn có lỗ hổng; đừng bao giờ dùng nó làm số hoá đơn bắt buộc liên tục.</p>
${bay('Bẫy — CHECK gọi hàm.', 'Rất hấp dẫn: <code>CHECK (amount = order_total(order_id))</code> trên payment. PostgreSQL nhận — nó không nhìn vào bên trong hàm. Nhưng CHECK chỉ được kiểm cho dòng đang được ghi. Đổi các <em>dòng</em> của một đơn đã thanh toán, và không ai kiểm khoản thanh toán:', ['T4K1', 'T4K2', 'T4K3'])}
${qo('T4K4', 'T4K5')}
<p>Đã trả 674.000, phải trả 702.000, không có lỗi. CHECK chỉ nên nói về chính dòng của nó (nó còn bị kiểm lại khi khôi phục bản dump, có thể trước khi order_item được nạp). Trigger ở T4b cũng có cùng điểm mù — nó canh khoản thanh toán, không canh các dòng đơn. Bịt chỗ đó nghĩa là từ chối sửa các dòng của đơn đã có thanh toán: đó là thử thách 2 ở mục 8.</p>

<h4>T5 — view doanh thu theo ngày, và một role chỉ thấy đúng nó</h4>
<p class="meo">💡 "Một ngày" của một cửa hàng ở Việt Nam là gì? <code>paid_at</code> là <code>timestamptz</code>, một thời điểm. <code>paid_at::date</code> đổi nó theo TimeZone của <em>phiên</em> — nên câu trả lời tuỳ vào người hỏi. <code>paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> chốt giờ đồng hồ treo tường ở Việt Nam trước.</p>
${qo('T5V', 'T5S')}
${bay('Bẫy — cùng view đó, đọc bởi một phiên UTC.', 'Ảnh Docker postgres mặc định UTC, và máy chủ ứng dụng thường kết nối với thiết lập đó. Đây là một view ngây thơ (<code>paid_at::date</code>) được đọc bởi một phiên như vậy, đặt cạnh view đúng:', ['T5NV', 'T5UTC', 'T5N', 'T5C', 'T5HCM', 'T5ND'])}
<p>Ngày nào cũng sai, cả hai chiều (29/09: 1.164.000 so với 264.000). <strong>459</strong> trong 1.663 thanh toán cũ — mọi khoản trả từ 00:00 tới 07:00 giờ Việt Nam — rơi sang ngày hôm trước. Kế toán sẽ nhận một con số từ trang admin và một con số khác từ psql, không có lỗi nào để giải thích. Đặt múi giờ vào trong view, đừng để nó tuỳ phiên.</p>
${buoc('vi', 'T5b', 'một role được đọc báo cáo — và không gì khác', 'Một role không đăng nhập (cho công cụ báo cáo), USAGE trên schema, SELECT chỉ trên view. <strong>Mới: <code>SET ROLE</code></strong> cho superuser đóng vai role đó ngay trong phiên (<code>RESET ROLE</code> để quay lại) — cách nhanh để thử quyền.', ['T5R0', 'T5R1', 'T5R2', 'T5R3', 'T5R4', 'T5R5', 'T5R6', 'T5R7', 'T5R8', 'T5R9', 'T5R10', 'T5R11', 'T5R12'], 'Role đọc được view — view chạy với quyền của chủ sở hữu (bài 12.3) — và bị từ chối bảng: 597 ngày, 1.664 thanh toán, 946.838.000 ₫. Điều bất ngờ là <code>place_order</code>: role được phép <em>gọi</em> nó, vì <strong>mọi hàm mới đều cho PUBLIC quyền EXECUTE</strong>; nó chỉ hỏng ở tầng dưới, tại bảng <code>product</code>. Sau <code>REVOKE EXECUTE … FROM PUBLIC</code> nó bị chặn ngay từ cửa. Thói quen: thu hồi khỏi PUBLIC, rồi cấp EXECUTE cho role mà ứng dụng của bạn dùng để kết nối.')}

<h4>T6 — materialized view sản phẩm bán chạy</h4>
${qo('T6M', 'T6S')}
<p>Để ý <code>now() AS refreshed_at</code> trong câu truy vấn: nó bị đóng băng lúc làm mới và đi theo mọi dòng (bài 12.4). Giờ đo bức ảnh chụp so với tính trực tiếp:</p>
${qo('T6E1', 'T6E2')}
<p><strong>${MV_MS} ms</strong> và 1 trang, so với <strong>${LIVE_MS} ms</strong> và 54 trang (hai hash join trên 5.006 dòng đơn và 1.847 đơn, một phép gộp, một phép sắp xếp, một hàm cửa sổ). Với 2.000 đơn thì vài mili giây vẫn ổn; với một triệu đơn của Lab 5 thì mỗi lượt xem trang chủ mất cả giây. Cái giá: bức ảnh cũ.</p>
${buoc('vi', 'T6b', 'cũ, rồi được làm mới mà không chặn ai', 'Một trường học đặt 60 máy Casio FX-570VN Plus. Đọc bảng xếp hạng, thử REFRESH CONCURRENTLY, đưa cho nó thứ nó đòi, rồi đọc lại.', ['T6O', 'T6B', 'T6X', 'T6U', 'T6RC', 'T6A'], 'Đơn 2007, và bảng vẫn ghi hạng 3 với 112.860.000 ₫ — bức ảnh. CONCURRENTLY từ chối cho tới khi matview có chỉ mục UNIQUE (nó ghép dòng cũ với dòng mới theo chỉ mục đó, bài 12.4); sau đó sản phẩm leo lên <strong>hạng 2</strong>, 142.560.000 ₫, với <code>refreshed_at</code> mới.')}
<p>Mỗi kiểu làm mới làm gì với người đọc? Terminal A làm mới trong một giao dịch (để việc làm mới "đang chạy" đủ lâu mà nhìn — trên shop lớn, một lần làm mới thật mất vài giây), terminal B đọc bảng xếp hạng:</p>
${khoiHai('T6A', true)}
<p>Với REFRESH thường, SELECT của B chờ <strong>${CHO_REFRESH} s</strong> — tới khi A commit: REFRESH thường giữ <code>AccessExclusiveLock</code>, chặn cả người đọc. Với CONCURRENTLY, B trả lời trong ${CHO_CONC} s trong khi A vẫn còn trong giao dịch. Trên trang chủ, đó là khác biệt giữa "cũ vài phút" và "đứng hình". Lên lịch làm mới (bài 12.4: một job trong ứng dụng bằng node-cron, hoặc timer của hệ điều hành) trong cùng thay đổi tạo ra matview.</p>

<h4>T7 — một deadlock thật, và vì sao nó không thể xảy ra với place_order</h4>
<p>Log của vận hành: <em>deadlock detected</em>. Nghi phạm là một trang đặt hàng cũ trong ứng dụng, khoá từng dòng giỏ hàng khi đi tới nó — theo thứ tự <strong>trong giỏ</strong>. An bỏ sổ Moleskine (30) vào trước, rồi bộ Faber-Castell (12); Bình làm ngược lại:</p>
${khoiHai('T7A', true)}
<p>A giữ 30 và chờ 12; B giữ 12 và chờ 30 — một vòng tròn không ai thoát ra được. Sau <code>deadlock_timeout</code> (1 s) PostgreSQL huỷ một bên (ở đây là A: <code>ERROR: deadlock detected</code>, DETAIL ghi mã cả hai tiến trình) và bên kia đi tiếp ngay khoảnh khắc đó. Giờ cũng đúng hai giỏ đó, qua <code>place_order</code>:</p>
${khoiHai('T7B', true)}
<p>Không lỗi: cả hai lời gọi đều khoá sản phẩm 12 trước (ORDER BY id), nên B chỉ xếp hàng sau A ở dòng đầu tiên, và không vòng tròn nào thành hình được. Đơn 2008 và 2009.</p>
${bay('Bẫy — một đường code thứ hai với thứ tự riêng.', 'Luật chỉ đúng khi <em>mọi</em> đường code khoá nhiều sản phẩm đều theo nó. Script của kho cộng hàng cho 30 rồi cho 12 — trong khi một lần đặt hàng 12 + 30 đang chạy:', [])}
${khoiHai('T7C', true)}
<p>Lại deadlock — lần này ngay trong <code>place_order</code> (xem CONTEXT: dòng 16, chỗ PERFORM … FOR UPDATE), vì phía <em>bên kia</em> khoá theo thứ tự khác. Cách sửa thuộc về script: khoá theo id trước, rồi mới update:</p>
${qo('T7W1', 'T7W2', 'T7W3', 'T7W4', 'T7W5')}
<p class="meo">💡 Sao không chỉ <code>UPDATE … WHERE id IN (12, 30)</code>? Một câu UPDATE khoá các dòng theo thứ tự mà kế hoạch của nó gặp chúng — trên một heap đã qua nhiều lần update, đó là thứ tự vật lý, không phải thứ tự id. <code>SELECT … ORDER BY id FOR UPDATE</code> làm thứ tự trở nên tường minh.</p>

<h4>Trong một ứng dụng Node thật — Prisma, thử lại, và hàm</h4>
<p>Cũng hai giỏ đó, gọi từ Node (Prisma 5.22, chạy thật trên DB của lab). Phiên bản 1 là việc đặt hàng viết trong ứng dụng, từng dòng theo thứ tự trong giỏ, bên trong một <code>$transaction</code> tương tác — kèm vòng thử lại cho những lỗi mang nghĩa "chạy lại cả giao dịch":</p>
${code(PRISMA_APP, 'ts')}
${code(PRISMA_FN, 'ts')}
${out(PRISMA_OUT)}
<p>Phiên bản 1 deadlock y như T7A — Prisma báo lỗi của truy vấn thô là <strong>P2010</strong>, mã PostgreSQL nằm trong <code>meta.code</code> (<strong>40P01</strong>; dùng API model thì bạn sẽ thấy P2034, như bài 11.3) — và vòng thử lại cứu được đơn của Bình ở lần 2 (đơn 2010 đã bị lần thử bị huỷ dùng mất: thêm một lỗ hổng). Phiên bản 2 không bao giờ deadlock: cùng hai giỏ, hai đơn, không cần thử lại. Còn một <strong>lỗi nghiệp vụ</strong> (SQLSTATE <strong>P0001</strong>, do chính RAISE của ta báo) thì <em>không</em> được thử lại — thử lại "out of stock" chỉ dội thêm tải vào cơ sở dữ liệu; hãy báo cho khách.</p>
<p>SQL nằm ở đâu? Lược đồ Prisma không có cú pháp cho hàm hay trigger (bài 12.1): viết tay chúng trong một tệp migration, và <code>prisma migrate deploy</code> áp nó như mọi migration khác:</p>
${code(PRISMA_MIG)}
<p>Ứng dụng của bạn khi đó gọi đúng một hàm; các luật — thứ tự khoá, phép kiểm, giá, sổ kho — không thể bị bỏ qua bởi một service thứ hai, một script hay một endpoint bị quên.</p>

<h3>5 · Tự kiểm — trạng thái cuối của bạn phải khớp</h3>
${qo('SC1', 'SC2', 'SC3', 'SC4', 'SC5')}
<p>8 đơn sau 2000 (2001–2004, 2006–2009 — 2005 đã bị rollback), một đơn bị huỷ (đơn bán vượt 2003), 0 thanh toán sai. Volatility: <code>i</code> = IMMUTABLE, <code>s</code> = STABLE, <code>v</code> = VOLATILE.</p>
<ol>
<li>Ở T3A, <code>SELECT stock</code> của B không chờ A, nhưng UPDATE của B thì có. Vì sao — và vì sao chờ xong rồi B vẫn ghi sai con số?</li>
<li><code>place_order</code> kiểm tồn kho ở bước 3. Vì sao phép kiểm đó an toàn trong place_order mà không an toàn trong place_order_v0, dù cả hai đều đọc cùng một cột?</li>
<li>Hai script cùng khoá sản phẩm 12 và 30. Luật duy nhất nào làm deadlock giữa chúng không thể xảy ra — và vì sao <code>UPDATE … WHERE id IN (12, 30)</code> không đủ để tuân theo luật đó?</li>
</ol>
${details('Đáp án', `<ol><li>Đọc thường không bao giờ chờ người ghi: MVCC đưa cho B phiên bản đã commit gần nhất (stock = 1). Người ghi thì chờ người ghi: UPDATE của B cần khoá dòng mà A đang giữ. Sau khi A commit, UPDATE của B đọc lại dòng nhưng vẫn gán v_stock - 1, giá trị tính từ lần đọc cũ — nên nó lại ghi 0 và lần bán thứ hai lọt qua.</li><li>place_order kiểm trên những dòng nó đã khoá bằng FOR UPDATE: tới khi nó commit, không ai đổi được chúng, nên phép kiểm vẫn đúng lúc nó ghi. v0 kiểm trên một ảnh chụp không khoá; một giao dịch khác có thể bán món hàng giữa lúc kiểm và lúc ghi.</li><li>Mọi đường code khoá các dòng theo cùng một thứ tự (theo id). Một câu UPDATE khoá dòng theo thứ tự kế hoạch của nó đi qua (thứ tự vật lý với Seq Scan), không bảo đảm là thứ tự id — nên hãy khoá trước bằng SELECT … ORDER BY id FOR UPDATE.</li></ol>`)}

<h3>6 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab6-solution.sql', code(SOL))}

<h3>7 · Bẫy</h3>
<div class="pitfall"><p><strong>Đọc, kiểm ở code, ghi lại con số đã tính</strong> — đọc không khoá. Khoá trước (<code>FOR UPDATE</code>) hoặc đặt điều kiện vào trong câu UPDATE.</p></div>
<div class="pitfall"><p><strong>Khoá nhiều dòng theo "thứ tự nào cũng được"</strong> — thứ tự trong giỏ, thứ tự request, thứ tự của kế hoạch. Hai giao dịch như thế sẽ deadlock. Một thứ tự cho mọi đường code: theo id.</p></div>
<div class="pitfall"><p><strong>Thử lại mọi lỗi</strong> — thử lại deadlock (40P01) và lỗi tuần tự hoá (40001, P2034), cả giao dịch, vài lần. Không bao giờ thử lại lỗi nghiệp vụ của chính bạn (P0001).</p></div>
<div class="pitfall"><p><strong>Trigger chạy dù không có gì đổi</strong> — <code>UPDATE OF cột</code> chạy hễ cột có trong danh sách SET. Thêm <code>WHEN (OLD.cột IS DISTINCT FROM NEW.cột)</code>.</p></div>
<div class="pitfall"><p><strong>Thiết lập bị rò</strong> — <code>set_config(…, false)</code> sống suốt cả phiên; dùng <code>true</code> (cục bộ trong giao dịch) và xoá sau khi dùng.</p></div>
<div class="pitfall"><p><strong>Việc STABLE dán nhãn IMMUTABLE</strong> — planner và chỉ mục tin cái nhãn. Đọc bảng thì không phải IMMUTABLE.</p></div>
<div class="pitfall"><p><strong>CHECK gọi hàm đọc bảng khác</strong> — chỉ được kiểm khi chính dòng của nó được ghi. Dùng trigger, và canh cả hai phía.</p></div>
<div class="pitfall"><p><strong>paid_at::date</strong> — phụ thuộc TimeZone của phiên. Dùng <code>AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> trong view.</p></div>
<div class="pitfall"><p><strong>Quên rằng EXECUTE là của PUBLIC</strong> — mọi hàm mới đều gọi được bởi mọi role. <code>REVOKE … FROM PUBLIC</code>, rồi mới cấp.</p></div>
<div class="pitfall"><p><strong>REFRESH thường vào giờ cao điểm</strong> — người đọc chờ hết cả lần làm mới. CONCURRENTLY + chỉ mục UNIQUE.</p></div>
<div class="pitfall"><p><strong>Coi mã là liên tục</strong> — một lần chèn bị rollback vẫn tiêu một số của sequence.</p></div>

<h3>8 · Thử thách thêm — và tiếp theo: Lab 7</h3>
<ul>
<li><strong>Thử thách 1 · cancel_order(đơn)</strong> — chuyển đơn sang cancelled và trả hàng về kho, để sổ kho có các dòng <code>return</code> kèm mã đơn; từ chối đơn đã giao hoặc đã huỷ. Kiểm: stock_check vẫn 0, và câu đối soát ở T3 vẫn trả 0 dòng.</li>
<li><strong>Thử thách 2 · đóng băng đơn đã thanh toán</strong> — một trigger trên <code>order_item</code> từ chối INSERT/UPDATE/DELETE với đơn đã có thanh toán. Chạy lại bẫy CHECK ở T4: giờ câu UPDATE dòng đơn phải hỏng.</li>
<li><strong>Thử thách 3 · ứng dụng chỉ được bán</strong> — một role <code>ctshop_app</code> không có quyền UPDATE trên product, và <code>place_order</code> là <code>SECURITY DEFINER</code> với <code>search_path</code> được ghim (bài 12.1). Chứng minh role ứng dụng đặt được hàng nhưng không chạy được <code>UPDATE product SET stock = 999</code>.</li>
</ul>
<p>Lab 7, sau Chương 13, mở cái cột mà sản phẩm nào cũng có từ Lab 1 mà chưa ai dùng: <code>attrs jsonb</code> — thương hiệu, màu, nhãn — cùng chỉ mục GIN và tìm kiếm toàn văn, để khách tìm được "bút gel xanh 0.5" trong một cửa hàng hàng nghìn sản phẩm.</p>
</div>
`;

export default {
  title: 'Lab 6 — CT Shop: safe checkout — transactions, functions, triggers, views|||Lab 6 — CT Shop: đặt hàng an toàn — giao dịch, hàm, trigger, view',
  slug: 'postgresql-lab-6-dat-hang-an-toan-ct-shop',
  type: 'LESSON',
  description: 'Lab dự án CT Shop sau Chương 12 (shop cỡ chuẩn 2.000 đơn): sổ kho lệch 48/48 sản phẩm ⇒ dòng adjust mở sổ trong một giao dịch + trigger AFTER UPDATE OF stock ghi stock_movement cho mọi lần đổi tồn (lý do/mã đơn qua set_config cục bộ giao dịch, WHEN chống form lưu cả sản phẩm); hàm place_order(khách, giỏ jsonb) khoá theo id (ORDER BY id FOR UPDATE), kiểm trên dòng đã khoá, RAISE huỷ cả đơn; flash sale chạy thật HAI phiên psql: bản đọc-kiểm-ghi bán 2 máy cho 1 máy trong kho, place_order bán đúng 1; order_total STABLE + trigger chặn thanh toán lệch, đơn + thanh toán trong một giao dịch, lỗ hổng của CHECK gọi hàm; view doanh thu theo ngày Việt Nam (459 thanh toán sai ngày nếu ::date ở UTC) + role chỉ đọc, EXECUTE mặc định của PUBLIC; matview xếp hạng (1 trang thay vì 54), REFRESH CONCURRENTLY + UNIQUE index, REFRESH thường bắt người đọc chờ tới COMMIT; deadlock thật hai giỏ ngược thứ tự + script kho; Prisma $transaction thử lại P2010/40P01 vs gọi place_order qua $queryRaw. Output thật PostgreSQL 17.',
  content: `${G}${EN}${VI}`,
};
