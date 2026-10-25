-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 6 — SOLUTION: safe checkout (transactions + functions + triggers + views + materialized views)
-- Lab 6 — ĐÁP ÁN: đặt hàng an toàn (giao dịch + hàm + trigger + view + materialized view)
-- cuongthai.com/courses/postgresql · PostgreSQL 17 — every number in the comments comes from a real run
-- (lab6-start.sql, then this file with psql -f; the TWO TERMINALS blocks done by hand in two psql sessions).
-- Open it AFTER your own attempt. Run lab6-start.sql first: this file assumes the standard shop.
-- ═══════════════════════════════════════════════════════════════════════════
\pset pager off
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
FROM pg_proc p WHERE p.pronamespace = 'shop'::regnamespace ORDER BY 1;
