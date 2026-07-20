\set ON_ERROR_STOP on
\pset pager off
DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (
  id     INT PRIMARY KEY,
  region TEXT NOT NULL,
  rep    TEXT NOT NULL,
  month  INT  NOT NULL,
  amount NUMERIC(10,2) NOT NULL
);
INSERT INTO sales VALUES
 (1,'North','Ann',1,100),(2,'North','Ann',2,150),(3,'North','Ann',3,120),
 (4,'North','Bob',1, 80),(5,'North','Bob',2, 90),(6,'North','Bob',3,200),
 (7,'South','Cy', 1,300),(8,'South','Cy', 2,110),(9,'South','Cy', 3,250);

\echo '===== EX 1: Attach Partition Aggregates and Share of Total ====='
SELECT region, rep, month, amount, SUM(amount) OVER (PARTITION BY region) AS region_total, ROUND(100.0 * amount / SUM(amount) OVER (PARTITION BY region), 1) AS pct FROM sales ORDER BY region, rep, month;

\echo '===== EX 2: Number Rows within Each Partition with ROW_NUMBER ====='
SELECT rep, month, amount, ROW_NUMBER() OVER (PARTITION BY rep ORDER BY month DESC) AS recency FROM sales ORDER BY rep, month DESC;

\echo '===== EX 3: Compute Running Totals per Partition ====='
SELECT rep, month, amount, SUM(amount) OVER (PARTITION BY rep ORDER BY month) AS rep_cumulative FROM sales ORDER BY rep, month;

\echo '===== EX 4: Compare Rows to Their Neighbours with LAG and LEAD ====='
SELECT rep, month, amount, LAG(amount) OVER (PARTITION BY rep ORDER BY month) AS prev, amount - LAG(amount,1,0) OVER (PARTITION BY rep ORDER BY month) AS change, LEAD(amount) OVER (PARTITION BY rep ORDER BY month) AS next FROM sales ORDER BY rep, month;

\echo '===== EX 5: Anchor to First and Last with FIRST_VALUE and LAST_VALUE ====='
SELECT rep, month, amount, FIRST_VALUE(amount) OVER w AS first_month, LAST_VALUE(amount) OVER w AS last_month FROM sales WINDOW w AS (PARTITION BY rep ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) ORDER BY rep, month;

\echo '===== EX 6: Split Rows into Buckets with NTILE ====='
SELECT rep, month, amount, NTILE(3) OVER (ORDER BY amount DESC) AS tercile FROM sales ORDER BY amount DESC;

\echo '===== EX 7: Rank Relatively with PERCENT_RANK and CUME_DIST ====='
SELECT rep, month, amount, ROUND(PERCENT_RANK() OVER (ORDER BY amount)::numeric,3) AS pct_rank, ROUND(CUME_DIST() OVER (ORDER BY amount)::numeric,3) AS cume_dist FROM sales ORDER BY amount;

\echo '===== EX 8: Smooth a Series with a Moving Average Frame ====='
WITH monthly AS (SELECT month, SUM(amount) AS total FROM sales GROUP BY month) SELECT month, total, ROUND(AVG(total) OVER (ORDER BY month ROWS BETWEEN 1 PRECEDING AND CURRENT ROW),2) AS moving_avg FROM monthly ORDER BY month;

\echo '===== EX 9: Reuse One Named Window Across Several Functions ====='
SELECT rep, month, amount, RANK() OVER w AS seq, SUM(amount) OVER w AS cumulative, ROUND(AVG(amount) OVER w,2) AS avg_to_date FROM sales WINDOW w AS (PARTITION BY rep ORDER BY month) ORDER BY rep, month;

\echo '===== EX 10: Build a Ranked Regional Leaderboard Dashboard ====='
WITH rep_totals AS (SELECT region, rep, SUM(amount) AS total FROM sales GROUP BY region, rep) SELECT region, rep, total, RANK() OVER (PARTITION BY region ORDER BY total DESC) AS rank_in_region, SUM(total) OVER (PARTITION BY region) AS region_total, ROUND(100.0*total/SUM(total) OVER (PARTITION BY region),1) AS pct, CASE WHEN RANK() OVER (PARTITION BY region ORDER BY total DESC)=1 THEN 'TOP' ELSE '' END AS flag FROM rep_totals ORDER BY region, rank_in_region, rep;
