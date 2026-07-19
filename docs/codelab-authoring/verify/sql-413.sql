\set ON_ERROR_STOP off
\pset pager off

\echo '========== EX 1: Refactor a Repeated Subquery into a Common Table Expression =========='
DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (sale_id INT PRIMARY KEY, category TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL);
INSERT INTO sales VALUES
 (1,'Electronics',400),(2,'Electronics',200),
 (3,'Books',100),(4,'Books',50),
 (5,'Toys',300);
\echo '--- check (expected result) ---'
WITH category_totals AS (SELECT category, SUM(amount) AS revenue FROM sales GROUP BY category)
SELECT category, revenue FROM category_totals WHERE revenue > (SELECT AVG(revenue) FROM category_totals) ORDER BY revenue DESC;

\echo '========== EX 2: Bucket Customers into Tiers with a CASE Expression =========='
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (customer_id INT PRIMARY KEY, name TEXT NOT NULL, total_spent NUMERIC(10,2) NOT NULL);
INSERT INTO customers VALUES (1,'Ann',1500),(2,'Bob',750),(3,'Cy',500),(4,'Di',200);
\echo '--- check (expected result) ---'
SELECT name, total_spent, CASE WHEN total_spent >= 1000 THEN 'Gold' WHEN total_spent >= 500 THEN 'Silver' ELSE 'Bronze' END AS tier FROM customers ORDER BY total_spent DESC;

\echo '========== EX 3: Keep Only the Latest Row per Group with ROW_NUMBER =========='
DROP TABLE IF EXISTS price_history CASCADE;
CREATE TABLE price_history (id INT PRIMARY KEY, product_id INT, price NUMERIC(10,2), changed_at DATE);
INSERT INTO price_history VALUES
 (1,1,10,'2026-01-10'),(2,1,12,'2026-03-05'),(3,1,11,'2026-02-01'),
 (4,2,50,'2026-01-15'),(5,2,55,'2026-02-20');
\echo '--- check (expected result) ---'
WITH ranked AS (SELECT product_id, price, changed_at, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC) AS rn FROM price_history)
SELECT product_id, price, changed_at FROM ranked WHERE rn = 1 ORDER BY product_id;

\echo '========== EX 4: Build a Leaderboard with RANK and DENSE_RANK =========='
DROP TABLE IF EXISTS scores CASCADE;
CREATE TABLE scores (player TEXT PRIMARY KEY, points INT NOT NULL);
INSERT INTO scores VALUES ('Ann',90),('Bob',90),('Cy',80),('Di',70);
\echo '--- check (expected result) ---'
SELECT player, points, RANK() OVER (ORDER BY points DESC) AS rnk, DENSE_RANK() OVER (ORDER BY points DESC) AS dense FROM scores ORDER BY points DESC, player;

\echo '========== EX 5: Compute a Running Total with a Windowed SUM =========='
DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE transactions (txn_date DATE PRIMARY KEY, amount NUMERIC(10,2) NOT NULL);
INSERT INTO transactions VALUES ('2026-01-01',100),('2026-01-02',-30),('2026-01-03',50);
\echo '--- check (expected result) ---'
SELECT txn_date, amount, SUM(amount) OVER (ORDER BY txn_date) AS running_balance FROM transactions ORDER BY txn_date;

\echo '========== EX 6: Pivot Monthly Sales into Columns with FILTER =========='
DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (id INT PRIMARY KEY, region TEXT, quarter TEXT, amount NUMERIC(10,2));
INSERT INTO sales VALUES
 (1,'North','Q1',100),(2,'North','Q2',200),
 (3,'South','Q1',50),(4,'South','Q3',80);
\echo '--- check (expected result) ---'
SELECT region,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q1'),0) AS q1,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q2'),0) AS q2,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q3'),0) AS q3,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q4'),0) AS q4
FROM sales GROUP BY region ORDER BY region;

\echo '========== EX 7: Produce Subtotals and a Grand Total with ROLLUP =========='
DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (id INT PRIMARY KEY, region TEXT, product TEXT, amount NUMERIC(10,2));
INSERT INTO sales VALUES (1,'North','A',100),(2,'North','B',50),(3,'South','A',80);
\echo '--- check (expected result) ---'
SELECT COALESCE(region,'(all regions)') AS region, COALESCE(product,'(all products)') AS product, SUM(amount) AS revenue
FROM sales GROUP BY ROLLUP (region, product)
ORDER BY GROUPING(region), region, GROUPING(product), product;

\echo '========== EX 8: Pick One Row per Group with DISTINCT ON =========='
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (customer_id INT, order_id INT PRIMARY KEY, ordered_at DATE, total NUMERIC(10,2));
INSERT INTO orders VALUES
 (1,101,'2026-01-05',10),(1,102,'2026-03-09',40),
 (2,201,'2026-02-02',20);
\echo '--- check (expected result) ---'
SELECT DISTINCT ON (customer_id) customer_id, order_id, ordered_at, total FROM orders ORDER BY customer_id, ordered_at DESC;

\echo '========== EX 9: Walk an Organization Chart with a Recursive CTE =========='
DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees (employee_id INT PRIMARY KEY, name TEXT NOT NULL, manager_id INT REFERENCES employees(employee_id));
INSERT INTO employees VALUES (1,'CEO',NULL),(2,'VP-Eng',1),(3,'VP-Sales',1),(4,'Engineer',2);
\echo '--- check (expected result) ---'
WITH RECURSIVE tree AS (
  SELECT employee_id, name, 1 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, t.depth + 1 FROM employees e JOIN tree t ON e.manager_id = t.employee_id
)
SELECT employee_id, name, depth FROM tree ORDER BY depth, employee_id;

\echo '========== EX 10: Number Consecutive Login Streaks with the Gaps-and-Islands Technique =========='
DROP TABLE IF EXISTS logins CASCADE;
CREATE TABLE logins (user_id INT, login_date DATE, PRIMARY KEY (user_id, login_date));
INSERT INTO logins VALUES
 (1,'2026-01-01'),(1,'2026-01-02'),(1,'2026-01-03'),(1,'2026-01-05'),(1,'2026-01-06'),
 (2,'2026-01-10'),(2,'2026-01-11');
\echo '--- check (expected result) ---'
WITH marked AS (SELECT user_id, login_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn FROM logins),
islands AS (SELECT user_id, login_date, login_date - (rn * INTERVAL '1 day') AS grp FROM marked)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_length
FROM islands GROUP BY user_id, grp ORDER BY user_id, streak_start;
