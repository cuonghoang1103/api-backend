\set ON_ERROR_STOP off
\pset pager off

\echo '==================== EX 1: Post a Balanced Double-Entry Journal Transaction ===================='
DROP TABLE IF EXISTS journal_lines, journal_entries, accounts CASCADE;
CREATE TABLE accounts (
  account_id INT PRIMARY KEY,
  name       TEXT NOT NULL,
  balance    NUMERIC(12,2) NOT NULL CHECK (balance >= 0)
);
CREATE TABLE journal_entries (
  entry_id   SERIAL PRIMARY KEY,
  memo       TEXT NOT NULL,
  entry_date DATE NOT NULL
);
CREATE TABLE journal_lines (
  line_id    SERIAL PRIMARY KEY,
  entry_id   INT NOT NULL REFERENCES journal_entries(entry_id),
  account_id INT NOT NULL REFERENCES accounts(account_id),
  debit      NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit     NUMERIC(12,2) NOT NULL DEFAULT 0
);
INSERT INTO accounts VALUES (1,'Cash',800.00),(2,'Rent Expense',0.00),(3,'Office Supplies',0.00);
\echo '--- run solution ---'
BEGIN;

-- Insert the entry, then use its RETURNING id to post both lines in one statement.
WITH new_entry AS (
    INSERT INTO journal_entries (memo, entry_date)
    VALUES ('Pay July office rent', DATE '2026-07-01')
    RETURNING entry_id
)
INSERT INTO journal_lines (entry_id, account_id, debit, credit)
SELECT ne.entry_id, v.account_id, v.debit, v.credit
FROM   new_entry ne
CROSS JOIN (VALUES
    (2, 500.00, 0.00),   -- debit Rent Expense
    (1, 0.00, 500.00)    -- credit Cash
) AS v(account_id, debit, credit);

-- Move the money to match the lines.
UPDATE accounts SET balance = balance - 500.00 WHERE account_id = 1;  -- Cash
UPDATE accounts SET balance = balance + 500.00 WHERE account_id = 2;  -- Rent Expense

COMMIT;
\echo '--- checks ---'
SELECT account_id, name, balance FROM accounts WHERE account_id IN (1,2) ORDER BY account_id;
SELECT entry_id, account_id, debit, credit FROM journal_lines ORDER BY line_id;
SELECT count(*) AS entry_count FROM journal_entries;

\echo '==================== EX 2: Guarantee No Overselling with a Data-Modifying CTE ===================='
DROP TABLE IF EXISTS reservations, products CASCADE;
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name       TEXT NOT NULL,
  available  INT NOT NULL CHECK (available >= 0)
);
CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  product_id     INT NOT NULL REFERENCES products(product_id),
  order_id       INT NOT NULL,
  qty            INT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO products VALUES (100,'Mechanical Keyboard',8),(200,'USB-C Cable',2);
\echo '--- run solution ---'
BEGIN;

WITH reserved AS (
    UPDATE products
    SET    available = available - 5
    WHERE  product_id = 100
      AND  available >= 5          -- the guard: no decrement unless stock is sufficient
    RETURNING product_id
)
INSERT INTO reservations (product_id, order_id, qty)
SELECT product_id, 900, 5
FROM   reserved;                   -- zero rows here if the guard failed

COMMIT;
\echo '--- checks ---'
SELECT product_id, available FROM products ORDER BY product_id;
SELECT product_id, order_id, qty FROM reservations ORDER BY reservation_id;
\echo '--- extra scenario ---'
-- insufficient-stock path: must change nothing
WITH reserved AS (
    UPDATE products SET available = available - 5
    WHERE product_id = 200 AND available >= 5
    RETURNING product_id
)
INSERT INTO reservations (product_id, order_id, qty)
SELECT product_id, 901, 5 FROM reserved;
SELECT product_id, available FROM products WHERE product_id = 200;
SELECT count(*) AS reservation_rows FROM reservations;
