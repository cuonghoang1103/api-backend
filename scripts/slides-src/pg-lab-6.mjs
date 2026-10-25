/**
 * pg-lab-6 — PostgreSQL · Lab 6 · CT Shop "Safe checkout: transactions + functions + triggers + views + matviews" (slide EN, kiểu FU, agent lab6 26/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-6.mjs + lab/sql/lab6-*.sql. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB nháp ctlab6: lab6-start.sql rồi lab6-solution.sql bằng psql -f theo đoạn; sáu khối HAI PHIÊN =
 * hai phiên psql thật song song, that/c11-scripts/hai-phien.mjs) — Q/O bên dưới SINH TỰ ĐỘNG (scratchpad lab6/mk6.mjs).
 * Dòng thời gian trên slide: mọi thời điểm lấy từ O.H… bằng tg() — không gõ tay. Hình nào là sơ đồ ghi "schematic".
 * Mã place_order trên slide = đúng thân hàm, bỏ chú thích cuối dòng, tách 3 slide (≤ 14 dòng mỗi slide).
 */
import { lamDeck, sql, psql, tbl, two, three, box, steps, kw, vsd, flow, hai_phien, sh, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-6', code: 'PG Lab 6', title: 'Lab 6 — CT Shop: safe checkout', sub: 'ledger trigger · place_order · flash sale in two terminals · totals · views · matview · deadlock' };

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

/* ── HELPERS ── */
const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const bo = (s) => s.split('\n').map((l) => l.replace(/\s+--.*$/, '')).join('\n');
const S = (k, to = [], o = {}) => { const t = bo(Q[k]); return sql(t, { sm: true, hl: t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean), ...o }); };
const nho = (h, fs = 13) => h.replace(/<pre>/g, `<pre style="font-size:${fs}px;line-height:1.34">`);
const dong = (t, to) => t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean);
/** Khung psql cho output O[k], tô dòng chứa một trong các chuỗi. */
const PO = (k, to = [], o = {}) => P(O[k], { sm: true, hl: dong(O[k], to), ...o });
const lay = (k, re) => { const m = O[k].match(re); if (!m) throw new Error(`không thấy ${re} trong O.${k}`); return m[1]; };
const vn = (x, le = 0) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
/** Thời điểm (giây) của dòng đầu tiên khớp re trong dòng thời gian hai phiên O[k]. */
const tg = (k, re) => { const l = O[k].split('\n').find((x) => re.test(x)); if (!l) throw new Error(`không thấy ${re} trong O.${k}`); return l.match(/\[\s*\+([\d.]+)s\]/)[1]; };
const ts = (k, re) => `+${tg(k, re)}`;
/** Đoạn thân hàm place_order (Q.T2F) từ dòng chứa a tới trước dòng chứa b, bỏ chú thích. */
const doan = (a, b) => { const L = Q.T2F.split('\n'); const i = L.findIndex((l) => l.includes(a)); const j = b ? L.findIndex((l, n) => n > i && l.includes(b)) : L.length; return bo(L.slice(i, j).join('\n')).replace(/\n\s*\n(\s*\n)+/g, '\n\n').replace(/\n+$/, ''); };
const HL = (t, to) => t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean);

/* ── HÌNH ── */
const MK = (id, mau) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${mau}"/></marker>`;

/** Trigger sổ kho: ai đổi stock ⇒ chuông AFTER UPDATE OF stock ⇒ một dòng stock_movement; lý do đi qua set_config. */
const chuongKho = () => {
  const W = 1110, H = 250;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${MK('l6a', NAU)}${MK('l6b', TIM)}</defs>`;
  const ai = [['checkout', 'place_order'], ['warehouse', 'delivery script'], ['psql', 'a quick fix']];
  ai.forEach(([t, s2], i) => {
    const y = 20 + i * 76;
    s += `<g data-k="ai-${i}"><rect x="6" y="${y}" width="210" height="60" rx="10" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/><text x="111" y="${y + 26}" text-anchor="middle" font-size="19" font-weight="800" fill="${PG}">${t}</text><text x="111" y="${y + 48}" text-anchor="middle" font-size="16" fill="#555">${s2}</text></g>`;
    s += `<line x1="218" y1="${y + 30}" x2="318" y2="128" stroke="${NAU}" stroke-width="2.5" marker-end="url(#l6a)"/>`;
  });
  s += `<g data-k="upd"><rect x="322" y="94" width="230" height="68" rx="10" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5"/><text x="437" y="122" text-anchor="middle" font-size="18" font-weight="800" fill="${NAU}">UPDATE product</text><text x="437" y="146" text-anchor="middle" font-size="17" fill="#555" font-family="Menlo,monospace">SET stock = …</text></g>`;
  s += `<line x1="554" y1="128" x2="618" y2="128" stroke="${NAU}" stroke-width="3" marker-end="url(#l6a)"/>`;
  s += `<g data-k="bell"><rect x="622" y="84" width="220" height="88" rx="12" fill="#fff" stroke="${TIM}" stroke-width="3"/><text x="732" y="112" text-anchor="middle" font-size="19" font-weight="800" fill="${TIM}">🔔 product_stock_log</text><text x="732" y="136" text-anchor="middle" font-size="15" fill="#555">AFTER UPDATE OF stock</text><text x="732" y="158" text-anchor="middle" font-size="15" fill="#555">WHEN stock really changed</text></g>`;
  s += `<line x1="844" y1="128" x2="904" y2="128" stroke="${NAU}" stroke-width="3" marker-end="url(#l6a)"/>`;
  s += `<g data-k="sm"><rect x="908" y="70" width="196" height="116" rx="10" fill="#eaf4ee" stroke="${XANH}" stroke-width="2.5"/><text x="1006" y="96" text-anchor="middle" font-size="17" font-weight="800" fill="${XANH}">stock_movement</text><text x="920" y="122" font-size="15" fill="#333" font-family="Menlo,monospace">change = NEW−OLD</text><text x="920" y="146" font-size="15" fill="#333" font-family="Menlo,monospace">reason</text><text x="920" y="170" font-size="15" fill="#333" font-family="Menlo,monospace">order_id</text></g>`;
  s += `<g data-k="ctx"><rect x="322" y="196" width="520" height="44" rx="8" fill="#f4eefa" stroke="${TIM}" stroke-width="2" stroke-dasharray="6 4"/><text x="582" y="224" text-anchor="middle" font-size="16" fill="${TIM}" font-family="Menlo,monospace">set_config('ctshop.reason', 'sale', true)</text></g>`;
  s += `<path d="M842,218 L1006,218 L1006,190" fill="none" stroke="${TIM}" stroke-width="2.5" marker-end="url(#l6b)"/>`;
  s += `<text x="852" y="244" font-size="14" fill="${TIM}">read by current_setting(…, true)</text>`;
  return s + '</svg>';
};

/** Hai khách tranh món cuối: kệ có 1 máy, hai mũi tên tới cùng một dòng (schematic). */
const monCuoi = (kq) => {
  const W = 1110, H = 170;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${MK('l6c', NAU)}</defs>`;
  s += `<g data-k="k101"><rect x="10" y="20" width="250" height="56" rx="10" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/><text x="135" y="54" text-anchor="middle" font-size="19" font-weight="800" fill="${PG}">customer 101 · A</text></g>`;
  s += `<g data-k="k102"><rect x="10" y="96" width="250" height="56" rx="10" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5"/><text x="135" y="130" text-anchor="middle" font-size="19" font-weight="800" fill="${CAM}">customer 102 · B</text></g>`;
  s += `<line x1="262" y1="48" x2="440" y2="84" stroke="${PG}" stroke-width="3" marker-end="url(#l6c)"/><line x1="262" y1="124" x2="440" y2="96" stroke="${CAM}" stroke-width="3" marker-end="url(#l6c)"/>`;
  s += `<g data-k="ke"><rect x="446" y="50" width="300" height="80" rx="12" fill="#fff" stroke="${NAU}" stroke-width="3"/><text x="596" y="82" text-anchor="middle" font-size="19" font-weight="800" fill="${NAU}">product 34 · FX-880BTG</text><text x="596" y="112" text-anchor="middle" font-size="19" fill="#333">stock = <tspan font-weight="800" fill="${DO}">1</tspan></text></g>`;
  s += `<g data-k="kq">${kq.map(([t, m], i) => `<text x="780" y="${70 + i * 34}" font-size="19" font-weight="800" fill="${m}">${t}</text>`).join('')}</g>`;
  return s + '</svg>';
};

/** Vòng chờ deadlock: A giữ 30 chờ 12, B giữ 12 chờ 30 (schematic). */
const vongChet = (ten = ['A', 'B'], tieu = 'A holds 30, waits for 12 · B holds 12, waits for 30') => {
  const W = 1110, H = 250;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${MK('l6g', XANH)}${MK('l6r', DO)}</defs>`;
  const o = (x, y, t, s2, m, k) => `<g data-k="${k}"><rect x="${x}" y="${y}" width="230" height="64" rx="12" fill="${m}18" stroke="${m}" stroke-width="3"/><text x="${x + 115}" y="${y + 28}" text-anchor="middle" font-size="20" font-weight="800" fill="${m}">${t}</text><text x="${x + 115}" y="${y + 52}" text-anchor="middle" font-size="16" fill="#555">${s2}</text></g>`;
  s += o(120, 20, `session ${ten[0]}`, 'cart: 30, then 12', PG, 'sA') + o(120, 160, `session ${ten[1]}`, 'cart: 12, then 30', CAM, 'sB');
  s += o(760, 20, 'row 30', 'Moleskine', NAU, 'r30') + o(760, 160, 'row 12', 'Faber-Castell', NAU, 'r12');
  s += `<line x1="352" y1="44" x2="756" y2="44" stroke="${XANH}" stroke-width="4" marker-end="url(#l6g)"/><text x="554" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${XANH}">holds ✓</text>`;
  s += `<line x1="352" y1="204" x2="756" y2="204" stroke="${XANH}" stroke-width="4" marker-end="url(#l6g)"/><text x="554" y="230" text-anchor="middle" font-size="17" font-weight="700" fill="${XANH}">holds ✓</text>`;
  s += `<line x1="352" y1="64" x2="756" y2="182" stroke="${DO}" stroke-width="4" stroke-dasharray="10 7" marker-end="url(#l6r)"/><line x1="352" y1="182" x2="756" y2="66" stroke="${DO}" stroke-width="4" stroke-dasharray="10 7" marker-end="url(#l6r)"/>`;
  s += `<g data-k="circle"><rect x="455" y="104" width="200" height="40" rx="8" fill="#fff" stroke="${DO}" stroke-width="2"/><text x="555" y="131" text-anchor="middle" font-size="18" font-weight="800" fill="${DO}">waits for ⇒ a circle</text></g>`;
  return s + '</svg>';
};

/** Lấy các mốc của dòng thời gian thành bảng hai cột A/B (hai_phien), câu lệnh viết gọn. */
const HP = (rows, o = {}) => hai_phien(rows, { fs: 15, ...o });

const T2_A = doan('IF jsonb_typeof', 'FOR v_line IN');
const T2_B = doan('FOR v_line IN', 'INSERT INTO orders');
const T2_C = doan('INSERT INTO orders', null);

export const slides = lamDeck({ chuong: 'Lab 6 · CT Shop', bai: '' }, [
  { cover: true, t: 'Lab 6 — CT Shop:<br>safe checkout', sub: 'a ledger trigger · place_order in one transaction ·<br>the flash sale in two terminals · totals · views · a matview · a deadlock' },

  { t: 'Your assignment', body: two(
    box('Monday, before the 20:00 flash sale', `<ul style="margin:0">
<li><b>Marketing</b>: the last Casio FX-880BTG — sold <b>exactly once</b></li>
<li><b>Warehouse</b>: the stock log never matches the shelf</li>
<li><b>Accounting</b>: payment = order total · revenue in <b>Việt Nam days</b></li>
<li><b>Home page</b>: best sellers, never freezing the page</li>
<li><b>Ops</b>: “deadlock detected” twice last week</li></ul>`, 'lam'),
    col(`<div class="tcap">Done means (real runs)</div>`, steps([
      '<b>stock_check</b>: 48 mismatched → <b>0</b>',
      'flash sale: naive sells <b>2</b>, place_order sells <b>1</b>',
      '4 wrong carts leave <b>2001 | 197 | 482</b>',
      '<b>0</b> wrong payments · role reads the view only',
      'REFRESH CONCURRENTLY: reader never waits · no deadlock',
    ]))), giua: true, to: true },

  { t: 'Setup: the standard shop + two terminals', body: `${sh(`$ docker cp lab6-start.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab6-start.sql
…   (DROP/CREATE SCHEMA, CREATE TABLE ×8, INSERT … — the standard shop)
 categories | products | customers | orders | order_lines | payments | stock_moves
------------+----------+-----------+--------+-------------+----------+-------------
         12 |       48 |       300 |   2000 |        5000 |     1663 |         429`, { hl: [6], title: 'terminal — lab6-start.sql (real run, last lines)' })}
${two(col(box('Back to normal size', 'lab6-start.sql rebuilds the <b>standard</b> shop of Labs 1–4 — Lab 5’s million orders are dropped (~500 MB freed).', 'lam'),
    sql(`-- in EACH of the two terminals
SET search_path = shop;
SET TimeZone = 'Asia/Ho_Chi_Minh';`)),
  box('Why two terminals?', 'T3, T6 and T7 are <b>two people at the same moment</b> — one psql session cannot be two people. Terminal A for everything else; switch to B only when a block says so, and don’t wait for B when the step says it waits.', ''))}`, giua: true },

  { t: 'The plan: checkout moves into the database', body: `${flow([{ t: '1 · Validate', s: 'the cart JSON', mau: PG }, { t: '2 · Lock', s: 'by id, FOR UPDATE', mau: DO }, { t: '3 · Check', s: 'the locked rows', mau: CAM }, { t: '4 · Write', s: 'order · lines · stock', mau: XANH }, { t: '🔔 Ledger', s: 'every change', mau: TIM }], { h: 170, fs: 23 })}
${two(box('One function, one transaction', '<code class="i">place_order(customer, items jsonb)</code> returns the new order id — or raises, and <b>nothing</b> is sold. Every client calls the same rules: app, script, admin tool.', 'xanh'),
    box('Around it', '<b>T4</b> order_total + a payment guard · <b>T5</b> a revenue view + a read-only role · <b>T6</b> a matview leaderboard · <b>T7</b> why lock order matters.', 'lam'))}`, giua: true, to: true },

  /* ── T1 ── */
  { t: 'T1 · Does the ledger add up?', body: `${S('T1V', ['coalesce(l.balance, 0) AS ledger', 'p.stock - coalesce'], { sm: false })}
${two(col(PO('T1A', ['48']), box('48 of 48 wrong — by 4.025 units', 'The old app wrote <code class="i">sale</code> rows on one code path only (1 order in 10). Every other stock change was silent — the rule that code forgets.', 'do2')), PO('T1B'))}`, giua: true },

  { t: 'T1 · Open the ledger: all 48 corrections or none', body: two(col(sql(`BEGIN;
INSERT INTO stock_movement (product_id, change, reason)
SELECT product_id, gap, 'adjust'
FROM stock_check WHERE gap <> 0;
SELECT count(*) FILTER (WHERE gap <> 0)
       AS mismatched
FROM stock_check;      -- check BEFORE commit
COMMIT;`, { hl: [5, 6, 7] })), col(P(`${O.T1I}\n${O.T1C}`, { hl: [1, 5] }),
    box('Inside the transaction', 'The check says <b>0</b> before COMMIT. Not 0? <code class="i">ROLLBACK</code> — nothing happened. Another session still sees the old ledger until COMMIT (Ch. 11).', 'xanh')), 'r64'), giua: true, to: true },

  { t: 'T1 · The trigger: every stock change leaves a row', body: `${chuongKho()}
${two(sql(bo(Q.T1F).split('\n').slice(2, 9).join('\n'), { sm: true, hl: [3, 4, 5] }),
    col(p(`<code class="i">set_config(name, value, true)</code> — <b>local</b> to this transaction: the caller says <b>why</b> and <b>which order</b>.`, 19),
      p(`<code class="i">current_setting(name, true)</code> — missing ⇒ NULL, no error. Nobody said ⇒ <code class="i">'adjust'</code>. The dot in <code class="i">ctshop.reason</code> marks it as your own setting.`, 19)), 'r64')}` },

  { t: 'T1 · Trap: a form that saves the whole product', body: vsd(col(sql(`UPDATE product
SET price = 750000, stock = stock
WHERE id = 34;`, { sm: true, hl: [2] }), nho(P(O.T1X.split('\n').slice(0, 2).join('\n').replace('ERROR:  ', 'ERROR:\n  ').replace(' violates', '\n  violates').replace('DETAIL:  ', 'DETAIL:\n  '), { sm: true, title: 'psql — real error (wrapped)' }), 13),
    p(`An ORM writes every column back. <code class="i">UPDATE OF stock</code> fires ⇒ change = 0 ⇒ CHECK fails ⇒ the <b>price change is rolled back too</b>: ${lay('T1XC', /\n\s+([\d.]+ \|\s+\d+)/).replace(/\s+/g, ' ')}.`, 18)),
    col(sql(`CREATE OR REPLACE TRIGGER product_stock_log
  AFTER UPDATE OF stock ON product
  FOR EACH ROW
  WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
  EXECUTE FUNCTION log_stock_change();`, { sm: true, hl: [4] }), P(O.T1WU, { sm: true }),
      p(`<b>WHEN</b> is checked before the function is called (lesson 12.2). <code class="i">CREATE OR REPLACE TRIGGER</code> (PostgreSQL 14+) swaps it in one statement.`, 18)),
    '✗ fires with no change', '✓ only when stock changes').replace('<div class="vsd">', '<div class="vsd" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">'), giua: true },

  { t: 'T1 · Test it from three sides', body: `${sql(`BEGIN;                                                    -- 1 · a delivery says why
SELECT set_config('ctshop.reason', 'import', true);
UPDATE product SET stock = stock + 50 WHERE id IN (1, 3);
COMMIT;
UPDATE product SET stock = stock - 2 WHERE id = 3;         -- 2 · a psql fix says nothing`, { hl: [2, 5] })}
${two(col(PO('T1L', ['import', 'adjust']), PO('T1OK')),
    col(box('3 · and the price change of product 34', 'left <b>no</b> row — WHEN saw no stock change. Nobody can change the stock without leaving a row.', 'xanh'),
      box('Empty, not NULL', 'After the first set_config in a session, current_setting(…, true) returns <b>\'\'</b> once the transaction ends — hence <code class="i">nullif(…, \'\')</code> in the trigger.', '')))}`, giua: true },

  /* ── T2 ── */
  { t: 'T2 · The cart: JSON in, one line per product out', body: `${sql(bo(Q.T2CF), { hl: [5] })}
${two(col(sql(`SELECT * FROM cart_lines('[{"product_id": 30, "qty": 1},
  {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]');`, { sm: true }), PO('T2C', ['4 |   3'])),
    col(p('<code class="i">jsonb_to_recordset</code> — a JSON array becomes rows with the columns you name.', 19),
      box('IMMUTABLE — honestly', 'Depends only on its argument, reads no table ⇒ same JSON, same rows, forever. Product 4 twice ⇒ <b>one line, qty 3</b> (order_item’s PK would refuse a second line).', 'xanh')))}`, giua: true },

  { t: 'T2 · place_order ① validate, then lock in id order', body: `${sql(T2_A, { sm: true, hl: HL(T2_A, ['ORDER BY id', 'FOR UPDATE']) })}
${three(box('Validate first', 'Not an array, empty, a line without product_id or with qty ≤ 0 ⇒ <code class="i">RAISE EXCEPTION</code> before touching anything.', ''),
    nho(P(`LockRows
  ->  Sort
        Sort Key: product.id
        ->  Hash Semi Join …`, { sm: true, title: 'EXPLAIN (COSTS OFF) — trimmed', hl: [1, 3] }), 14),
    box('LockRows above Sort', 'Rows are locked <b>after</b> sorting ⇒ every caller takes the locks in the <b>same order</b> (T7).', 'do2'))}` },

  { t: 'T2 · place_order ② check the LOCKED rows', body: `${sql(T2_B, { sm: true, hl: HL(T2_B, ['RAISE EXCEPTION']) })}
${two(box('Why check after locking?', 'Between this check and our UPDATE nobody can change these rows — the check <b>cannot go out of date</b>.', 'xanh'),
    box('RAISE EXCEPTION', 'aborts the statement. A function runs <b>inside the caller’s transaction</b> (12.1) ⇒ everything the call did is undone with it.', 'lam'))}`, giua: true },

  { t: 'T2 · place_order ③ write: order, lines, stock', body: `${sql(T2_C, { sm: true, hl: HL(T2_C, ['p.price', "'sale'", 'v_order::text']) })}
${two(box('Price at the moment of buying', '<code class="i">unit_price = p.price</code> is copied into the line: tomorrow’s price change does not touch this order.', ''),
    box('Tell the trigger, then clear', '<code class="i">reason = sale</code> + <code class="i">order_id</code> ⇒ the ledger row of T1. Cleared afterwards so the caller’s next UPDATE in the same transaction is not logged as a sale.', 'lam'))}`, giua: true },

  { t: 'T2 · Customer 42 buys', body: `${sql(`SELECT place_order(42, '[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]');`, { sm: true })}
${two(col(PO('T2O', ['2001']), PO('T2OI', ['28000.00'])),
    col(tbl(['product', 'stock before', 'after'], [['4 · gel pen', lay('T2S0', /\n\s+4 \|[^|]+\|\s+(\d+)/), lay('T2S1', /\n\s+4 \|[^|]+\|\s+(\d+)/)], ['30 · Moleskine', lay('T2S0', /\n\s+30 \|[^|]+\|\s+(\d+)/), lay('T2S1', /\n\s+30 \|[^|]+\|\s+(\d+)/)]], { cap: 'real output' }), PO('T2L', ['sale']),
      p('Qty 3 = 2 + 1 merged · 28.000 ₫ copied · two <b>sale</b> rows written by the <b>trigger</b>, not by the function.', 18)))}`, giua: true },

  { t: 'T2 · Four wrong carts — and nothing left behind', body: `${P([O.T2E1, O.T2E2, O.T2E3, O.T2E4].map((x) => x.replace(/^psql:\/tmp\/lab6-solution\.sql:\d+: /gm, '')).join('\n'), { sm: true, title: 'psql — 4 real errors (file prefix trimmed)', hl: [1, 2] })}
${two(col(sql(`SELECT place_order(42, '[{"product_id": 4, "qty": 1},
                          {"product_id": 30, "qty": 500}]');
SELECT place_order(42, '[{"product_id": 999, "qty": 1}]');
SELECT place_order(42, '[{"product_id": 4, "qty": 0}]');
SELECT place_order(42, '[]');`, { sm: true }), PO('T2N', ['2001'])),
    box('Untouched', '<b>2001</b> orders · <b>197</b> gel pens · <b>482</b> ledger rows — even the valid gel pen of the first cart was not sold. <code class="i">CONTEXT</code> names the line of the function that raised.', 'xanh'), 'r64')}` },

  /* ── T3 ── */
  { t: 'T3 · The naive version: read, check in code, write back', body: `${(() => { const t = bo(Q.T3F).split('\n').slice(3, 17).join('\n'); return sql(t, { sm: true, hl: HL(t, ['INTO v_stock, v_price', 'IF v_stock', 'stock = v_stock']) }); })()}
${three(box('1 · read — no lock', 'MVCC gives the last committed stock; anyone may be about to change it.', 'do2'), box('2 · check in code', 'True <b>now</b>, maybe false a millisecond later.', 'do2'),
    box('3 · write a computed number', '<code class="i">stock = v_stock - p_qty</code> — from step 1, whatever happened since. Then: <code class="i">UPDATE product SET stock = 1 WHERE id = 34</code> — the last unit.', 'do2'))}` },

  { t: 'T3 · Two buyers at 20:00 — the naive version', body: `${monCuoi([['A: order 2002 ✓', XANH], ['B: order 2003 ✓ (!)', DO], ['stock 0 · 2 sold for 1', DO]])}
${HP([
    [ts('HT3A', /A> BEGIN/), 'BEGIN;', '', 'A opens its transaction'],
    [ts('HT3A', /A> SELECT/), 'SELECT place_order_v0(101, 34, 1);', '', '2002 · A holds the row lock, waits for the payment gateway'],
    [ts('HT3A', /B> SELECT/), '', 'SELECT place_order_v0(102, 34, 1);', 'B reads stock = 1 (MVCC), passes, inserts… its UPDATE waits ⏳', '#fdf0ee'],
    [ts('HT3A', /A> COMMIT/), 'COMMIT;', '', 'the lock is released'],
    [ts('HT3A', /B│ -/), '', '→ 2003', 'B writes stock = 1 − 1 = 0 — sold twice', '#fdf0ee'],
  ])}`, giua: true },

  { t: 'T3 · The audit that catches it', body: two(col(sql(`SELECT o.id AS order_id, o.customer_id, oi.sold,
       coalesce(-m.logged, 0) AS logged
FROM orders o
JOIN (SELECT order_id, sum(qty) AS sold
      FROM order_item GROUP BY order_id) oi ON oi.order_id = o.id
LEFT JOIN (SELECT order_id, sum(change) AS logged
           FROM stock_movement WHERE reason = 'sale'
           GROUP BY order_id) m ON m.order_id = o.id
WHERE o.id > 2000 AND o.status <> 'cancelled'
  AND oi.sold <> coalesce(-m.logged, 0);`, { sm: true, hl: [10] })),
    col(PO('T3AUD', ['2003']), box('Why the ledger noticed', 'B’s UPDATE changed <b>0 → 0</b>: the WHEN of T1 logged nothing. Order 2002 has its sale row, order 2003 has none.', 'xanh'),
      sql(`UPDATE orders SET status = 'cancelled',
  note = 'oversold in the 20:00 flash sale'
WHERE id = 2003;`, { sm: true })), 'r64'), giua: true },

  { t: 'T3 · The same race with place_order', body: `${monCuoi([['A: order 2004 ✓', XANH], ['B: out of stock ✓', XANH], ['stock 0 · 1 sold for 1', XANH]])}
${HP([
    [ts('HT3B', /A> SELECT/), `SELECT place_order(101, '[…34…]');`, '', '2004 · A holds the lock (inside BEGIN)'],
    [ts('HT3B', /B> SELECT/), '', `SELECT place_order(102, '[…34…]');`, 'B waits at FOR UPDATE — before any check ⏳', '#eef4fa'],
    [ts('HT3B', /A> COMMIT/), 'COMMIT;', '', 'lock released'],
    [ts('HT3B', /B│ ERROR/), '', 'ERROR: out of stock: … — 0 left, 1 wanted', 'B re-reads the locked row: 0 ⇒ nothing sold', '#f1f9f4'],
  ])}
${p('Ch. 11’s conditional UPDATE is perfect for <b>one</b> line. A cart has several, must say <b>which</b> line is short, and copies prices — FOR UPDATE gives the function a stable picture of all its rows.', 19)}`, giua: true },

  /* ── tập 2: T4 ── */
  { t: 'T4 · order_total — STABLE, never IMMUTABLE', body: `${sql(bo(Q.T4F), { sm: true, hl: [2, 4] })}
${two(col(PO('T4T'), PO('T4P', ['1663']), p('Reads a table ⇒ <b>STABLE</b>: its answer can change between two statements (12.1). <b>0 of 1.663</b> payments wrong.', 18)),
    col(sql(`CREATE INDEX payment_gap_idx
  ON payment ((amount - order_total(order_id)));`, { sm: true }), P(O.T4X.replace(/^psql:\/tmp\/lab6-solution\.sql:\d+: /, '').replace('ERROR:  ', 'ERROR:\n  '), { sm: true, title: 'psql — real error (wrapped)' }),
      p('An index trusts its answers forever ⇒ IMMUTABLE only. <b>shop.</b>order_item: PG 17 builds indexes with a safe search_path (pg_catalog, pg_temp).', 17)))}`, giua: true },

  { t: 'T4 · The payment guard', body: `${sql(bo(Q.T4GF).split('\n').slice(2, 11).join('\n') + '\n' + bo(Q.T4GT), { sm: true, hl: [4, 5] })}
${two(col(sql(`INSERT INTO payment (order_id, amount, method)
VALUES (2001, 600000, 'momo');           -- tampered`, { sm: true }), nho(P(O.T4G1.replace(/^psql:\/tmp\/lab6-solution\.sql:\d+: /, '').replace(' but', '\n  but'), { sm: true, title: 'psql — real error (wrapped)' }), 13.5)),
    col(sql(`INSERT INTO payment (order_id, amount, method)
VALUES (2001, order_total(2001), 'momo');`, { sm: true }), P(O.T4G2, { sm: true }),
      p('The gateway reports what was paid; accept it only if it equals the total.', 18)))}`, giua: true },

  { t: 'T4 · Order + payment in ONE transaction', body: two(col(sql(`BEGIN;
SELECT place_order(55, '[{"product_id": 12, "qty": 2}]');   -- 2005
INSERT INTO payment (order_id, amount, method)
SELECT max(id), 1000, 'card' FROM orders;   -- fails
ROLLBACK;
SELECT place_order(55, '[{"product_id": 12, "qty": 2}]');`, { sm: true, hl: [4, 6] }), nho(P(O.T4AX.replace(/^psql:\/tmp\/lab6-solution\.sql:\d+: /, '').replace(' but', '\n  but'), { sm: true, title: 'psql — real error (wrapped)' }), 13), PO('T4AN', ['2006'])),
    col(tbl(['', 'orders', 'stock 12', 'ledger'], [['before', ...O.T4A0.split('\n')[2].split('|').map((x) => x.trim())], ['after ROLLBACK', ...O.T4A1.split('\n')[2].split('|').map((x) => x.trim())]], { cap: 'real output — the same three numbers' }),
      box('Everything went back', 'the order, its line, the stock change, the ledger row.', 'xanh'),
      box('…except the sequence', '<b>2006</b>, not 2005: a sequence never goes back. Ids have gaps — never use them as consecutive invoice numbers.', 'do2')), 'r64'), giua: true },

  { t: 'T4 · Trap: a CHECK that calls the function', body: vsd(col(sql(`ALTER TABLE payment ADD CONSTRAINT payment_matches_total
  CHECK (amount = order_total(order_id));
UPDATE order_item SET qty = qty + 1
WHERE order_id = 2001 AND product_id = 4;`, { sm: true, hl: [3] }), P(`${O.T4K1}\n${O.T4K2}`, { sm: true }), PO('T4K3', ['674000']),
    p('A CHECK looks only at <b>the row being written</b>: 674.000 paid, 702.000 owed, no error.', 18)),
    col(box('A CHECK is about its own row', 'Use a trigger for cross-table rules — and guard <b>both</b> sides. The T4 guard watches the payment, not the lines.', 'xanh'),
      box('Close the hole (challenge 2)', 'A trigger on <code class="i">order_item</code> that refuses changes to an order that already has a payment.', 'lam'),
      sql(`ALTER TABLE payment
  DROP CONSTRAINT payment_matches_total;`, { sm: true })),
    '✗ CHECK (… order_total(…))', '✓ triggers on both sides').replace('<div class="vsd">', '<div class="vsd" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">'), giua: true },

  /* ── T5 ── */
  { t: 'T5 · Daily revenue in Việt Nam days', body: `${sql(bo(Q.T5V), { sm: true, hl: [2] })}
${two(col(PO('T5S'), p('<code class="i">paid_at</code> is an <b>instant</b>; <code class="i">::date</code> uses the <b>session’s</b> TimeZone. <code class="i">AT TIME ZONE</code> pins Việt Nam wall-clock time first.', 17)),
    col(tbl(['day', 'naive, UTC session', 'correct'], O.T5N.split('\n').slice(2, -1).map((l) => l.split('|').map((x) => x.trim())), { cap: 'the same payments — real output', hl: [3] }),
      p(`<b>${lay('T5C', /\n\s+\d+ \|\s+(\d+)/)}</b> of 1.663 payments (paid 00:00–07:00 local) land on the day before. The postgres Docker image defaults to UTC.`, 18)))}`, giua: true },

  { t: 'T5 · A role that may read the report — nothing else', body: two(sql(`CREATE ROLE ctshop_report NOLOGIN;
GRANT USAGE ON SCHEMA shop TO ctshop_report;
GRANT SELECT ON daily_revenue TO ctshop_report;
SET ROLE ctshop_report;               -- act as it
SELECT count(*), sum(revenue)
FROM daily_revenue;                   -- ✓
SELECT count(*) FROM payment;         -- ✗
SELECT place_order(1, '[…]');         -- ?!
RESET ROLE;
REVOKE EXECUTE ON FUNCTION
  place_order(bigint, jsonb) FROM PUBLIC;`, { sm: true, hl: [8, 10, 11] }),
    col(nho(P([O.T5R6, O.T5R7.split('\n').slice(0, 1).join(''), 'CONTEXT:  … place_order(bigint,jsonb) line 16 at PERFORM', '— after REVOKE —', O.T5R11].map((x) => x.replace(/^psql:\/tmp\/lab6-solution\.sql:\d+: /gm, '')).join('\n'), { sm: true, title: 'psql — real errors (prefix trimmed)', hl: [3] }), 12.5),
      box('EXECUTE is PUBLIC by default', 'Every new function can be <b>called</b> by every role; it failed only one level down, on <code class="i">product</code>. Revoke from PUBLIC, then grant to the app’s role.', 'do2'),
      p(`The view runs with its <b>owner’s</b> rights (12.3): ${lay('T5R5', /\n\s+(\d+) \|/)} days, ${vn(lay('T5R5', /\|\s+([\d]+)\.00/))} ₫.`, 18))), giua: true },

  /* ── T6 ── */
  { t: 'T6 · A materialized view: the best sellers', body: `${sql(bo(Q.T6M), { sm: true, hl: [6, 7] })}
${two(nho(PO('T6S'), 12.5), col(tbl(['', 'Execution Time', 'pages'], [['matview (stored rows)', `${vn(lay('T6E1', /Execution Time: ([\d.]+)/), 3)} ms`, lay('T6E1', /Buffers: shared hit=(\d+)/)], ['computed live', `${vn(lay('T6E2', /Execution Time: ([\d.]+)/), 1)} ms`, lay('T6E2', /Buffers: shared hit=(\d+)/)]], { cap: 'EXPLAIN (ANALYZE, BUFFERS) — real runs', hl: [0] }),
      p('Live = 2 hash joins over 5.006 lines, an aggregate, a sort, a window — fine at 2.000 orders, seconds at a million. <code class="i">refreshed_at</code> is frozen at refresh time. The price: the photo is old.', 17)))}`, giua: true },

  { t: 'T6 · Stale — then REFRESH CONCURRENTLY', body: two(col(sql(`SELECT place_order(77,
  '[{"product_id": 32, "qty": 60}]');          -- 2007
SELECT rnk, sku, revenue, refreshed_at
FROM product_rank WHERE product_id = 32;
REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;`, { sm: true, hl: [5] }), nho(PO('T6B', ['3 |']), 12), nho(P(O.T6X.replace(/^psql:\/tmp\/lab6-solution\.sql:\d+: /, '').replace(' concurrently', '\n  concurrently').replace('HINT:  ', 'HINT:\n  ').replace(' on one', '\n  on one'), { sm: true, title: 'psql — real error (wrapped)' }), 12.5)),
    col(sql(`CREATE UNIQUE INDEX product_rank_product_id
  ON product_rank (product_id);
REFRESH MATERIALIZED VIEW CONCURRENTLY product_rank;`, { sm: true, hl: [1] }), nho(PO('T6A', ['2 |']), 12),
      box('Why the UNIQUE index', 'CONCURRENTLY builds the new result aside and matches old ↔ new rows <b>by that key</b>, applying only the differences (12.4). Rank 3 → <b>2</b>.', 'xanh'))), giua: true },

  { t: 'T6 · What each REFRESH does to a reader', body: `${HP([
    [ts('HT6A', /A> REFRESH MATERIALIZED VIEW product_rank;/), 'BEGIN; REFRESH MATERIALIZED VIEW product_rank;', '', 'AccessExclusiveLock until COMMIT'],
    [ts('HT6A', /B> SELECT/), '', 'SELECT … FROM product_rank WHERE rnk <= 3;', 'the reader waits ⏳', '#fdf0ee'],
    [ts('HT6A', /A> COMMIT/), 'COMMIT;', '', ''],
    [ts('HT6A', /B│  rnk/), '', '→ 3 rows', `after ${(Number(tg('HT6A', /B│  rnk/)) - Number(tg('HT6A', /B> SELECT/))).toFixed(2).replace('.', ',')} s`, '#fdf0ee'],
    [ts('HT6A', /A> REFRESH MATERIALIZED VIEW CONCURRENTLY/), 'BEGIN; REFRESH … CONCURRENTLY product_rank;', '', 'A is still inside its transaction'],
    [O.HT6A.split('\n').filter((l) => /B> SELECT/.test(l)).map((l) => `+${l.match(/\+([\d.]+)s/)[1]}`)[1], '', 'SELECT … FROM product_rank WHERE rnk <= 3;', `→ 3 rows at once (${O.HT6A.split('\n').filter((l) => /B│  rnk/.test(l)).map((l) => `+${l.match(/\+([\d.]+)s/)[1]}`)[1]})`, '#f1f9f4'],
  ])}
${two(box('Plain REFRESH', 'blocks even readers ⇒ at peak time the home page <b>freezes</b> for the whole refresh.', 'do2'), box('CONCURRENTLY', 'readers keep reading the old photo ⇒ “a few minutes old”, never frozen. Schedule it (node-cron / OS timer) in the same change.', 'xanh'))}`, giua: true },

  /* ── T7 ── */
  { t: 'T7 · A real deadlock: two carts, opposite order', body: `${vongChet()}
${HP([
    [ts('HT7A', /A> SELECT stock FROM product WHERE id = 30/), '… WHERE id = 30 FOR UPDATE;', '', 'A locks 30'],
    [ts('HT7A', /B> SELECT stock FROM product WHERE id = 12/), '', '… WHERE id = 12 FOR UPDATE;', 'B locks 12'],
    [ts('HT7A', /A> SELECT stock FROM product WHERE id = 12/), '… WHERE id = 12 FOR UPDATE;', '', 'A waits for B ⏳'],
    [ts('HT7A', /B> SELECT stock FROM product WHERE id = 30/), '', '… WHERE id = 30 FOR UPDATE;', 'B waits for A ⏳ — a circle', '#fdf0ee'],
    [ts('HT7A', /A│ ERROR/), 'ERROR: deadlock detected', `→ ${[...O.HT7A.matchAll(/B│ -+\n[^\n]*B│\s+(\d+)/g)].pop()[1]}`, 'after deadlock_timeout (1 s): A is cancelled, B proceeds', '#fdf0ee'],
  ])}`, giua: true },

  { t: 'T7 · place_order: the same carts, no circle', body: `${HP([
    [ts('HT7B', /A> SELECT/), `place_order(201, '[30, 12]')`, '', '2008 · locks 12, then 30 (sorted)'],
    [ts('HT7B', /B> SELECT/), '', `place_order(202, '[12, 30]')`, 'B waits for row 12 — first in line, holds nothing ⏳', '#eef4fa'],
    [ts('HT7B', /A> COMMIT/), 'COMMIT;', '', ''],
    [ts('HT7B', /B│ -/), '', '→ 2009', 'no error', '#f1f9f4'],
  ])}
${two(box('Trap: a second code path', `The warehouse script adds stock for <b>30, then 12</b> while a checkout for 12 + 30 runs ⇒ <b>deadlock again</b>, this time inside place_order (${ts('HT7C', /B│ ERROR/)} s: line 16, the PERFORM … FOR UPDATE).`, 'do2'),
    col(sql(`BEGIN;   -- the warehouse, fixed
SELECT id, stock FROM product
WHERE id IN (30, 12) ORDER BY id FOR UPDATE;
UPDATE product SET stock = stock + 20 WHERE id IN (12, 30);
COMMIT;`, { sm: true, hl: [3] }), p('One UPDATE locks in <b>plan</b> order (physical), not id order. Lock explicitly first.', 18)))}`, giua: true },

  { t: 'In a real Node app: Prisma, retries — or the function', body: `${sql(`// ✗ checkout in the app: one interactive transaction, the lines in CART order — An [30, 12] · Binh [12, 30]
await prisma.$transaction(async (tx) => {
  for (const it of cart) {
    await tx.$executeRaw\`UPDATE product SET stock = stock - \${it.qty} WHERE id = \${it.product_id} AND stock >= \${it.qty}\`;
    await sleep(150);                                   // per-line work: a coupon check, a price rule…
  }
});                                                     // + retry on 40P01 / 40001 / P2034
// ✓ one call: the database function locks in id order
await prisma.$queryRaw\`SELECT place_order(\${customerId}::bigint, \${JSON.stringify(cart)}::jsonb) AS id\`;`, { sm: true, lang: 'typescript', hl: [3, 9] })}
${two(nho(P(`— 1) app-side, cart order, two carts at once
+1293ms Binh attempt 1: P2010 40P01 ERROR: deadlock detected …
+1445ms An attempt 1: order 2011
+1758ms Binh attempt 2: order 2012
— 2) place_order via $queryRaw, the same two carts
+1761ms Binh order 2013
+1763ms An order 2014
— 3) a business error
+1764ms Chi P2010 P0001 ERROR: out of stock: … 0 left
+1764ms Chi business error ⇒ do NOT retry`, { sm: true, title: 'node — Prisma 5.22, real run (lines shortened)', hl: [2, 9] }), 12.5),
    col(box('Retry what means “run it again”', '<b>40P01</b> deadlock, <b>40001</b>/P2034 serialization — the whole transaction, a few times. <b>Never</b> retry your own <b>P0001</b>: show it to the customer.', ''),
      p('Functions + triggers live in a hand-written <b>migration.sql</b>; <code class="i">prisma migrate deploy</code> applies it.', 18)))}`, giua: true },

  { t: 'Self-check — your end state', body: two(col(PO('SC1', ['0'], { title: 'stock_check — real output' }), PO('SC2', ['8']), PO('SC3')),
    col(PO('SC4'), PO('SC5', ['cart_lines', 'order_total']), p('<code class="i">i</code> IMMUTABLE · <code class="i">s</code> STABLE · <code class="i">v</code> VOLATILE. 8 orders after 2000 (2005 rolled back), 1 cancelled (2003).', 18)), 'r46'), giua: true },

  { t: 'Check yourself', body: two(`<ol style="font-size:22px;margin:0;padding-left:28px;display:flex;flex-direction:column;gap:14px">
<li>In T3A, B’s <b>SELECT</b> did not wait for A, but B’s <b>UPDATE</b> did. Why — and why was B’s number still wrong after waiting?</li>
<li>Both place_order and v0 read <code class="i">stock</code>. Why is the check safe in one and unsafe in the other?</li>
<li>Two scripts lock products 12 and 30. Which one rule makes a deadlock impossible — and why is <code class="i">UPDATE … WHERE id IN (12, 30)</code> not enough?</li></ol>`,
  box('Answers', '1 · Reads never wait (MVCC hands B stock = 1); writers wait for writers. B then wrote <b>v_stock − 1</b>, computed from the old read ⇒ 0 again.<br>2 · place_order checks rows it already <b>locked</b> — nobody can change them until COMMIT. v0 checks an unlocked snapshot.<br>3 · Every code path locks in the <b>same order (by id)</b>. An UPDATE locks in plan order, so lock first with <b>SELECT … ORDER BY id FOR UPDATE</b>.', 'xanh'), 'r46'), giua: true, to: true },

  { t: 'Traps of Lab 6', body: vsd(`<ul style="font-size:21px">
<li>Read → check in code → write a computed number</li>
<li>Locking rows in cart / request / plan order</li>
<li>Retrying every error (incl. out of stock)</li>
<li><code class="i">UPDATE OF stock</code> firing with no change</li>
<li><code class="i">set_config(…, false)</code> leaking into the session</li>
<li>A CHECK calling a function on other tables</li>
<li><code class="i">paid_at::date</code> in a report</li>
<li>EXECUTE left to PUBLIC · plain REFRESH at peak</li></ul>`,
  `<ul style="font-size:21px">
<li>Lock first (FOR UPDATE), check the locked rows</li>
<li>One order for every code path: <b>by id</b></li>
<li>Retry 40P01 / 40001 only, the whole transaction</li>
<li><code class="i">WHEN (OLD.stock IS DISTINCT FROM NEW.stock)</code></li>
<li><code class="i">true</code> = transaction-local, then clear it</li>
<li>Triggers, guarding both sides</li>
<li><code class="i">AT TIME ZONE 'Asia/Ho_Chi_Minh'</code> in the view</li>
<li>REVOKE … FROM PUBLIC · CONCURRENTLY + UNIQUE</li></ul>`, '✗ Trap', '✓ Do this'), giua: true },

  { t: 'Summary — and next: Lab 7', body: two(col(steps([
    'Rules nobody may skip ⇒ <b>in the database</b>: a ledger <b>trigger</b>, a <b>place_order</b> function',
    '<b>Lock, then check</b>, in <b>id order</b> — one transaction, RAISE undoes it all',
    'Prove concurrency with <b>two terminals</b>, not with one test user',
    'Honest labels: IMMUTABLE cart_lines · STABLE order_total · VOLATILE place_order',
    'Views for safe slices (time zone inside) · matviews refreshed CONCURRENTLY',
  ]), box('Extra challenge', '① <b>cancel_order</b> with <code class="i">return</code> ledger rows ② freeze the lines of paid orders ③ <code class="i">ctshop_app</code> + <b>SECURITY DEFINER</b> place_order: the app may sell, never set stock.', '')),
  box('Lab 7 — after Chapter 13', 'The column every product has had since Lab 1: <code class="i">attrs jsonb</code> — brands, colours, tags — with <b>GIN</b> indexes and <b>full-text search</b>, so customers find “bút gel xanh 0.5” among thousands of products.', 'lam'), 'r64'), giua: true },
]);
