// Generator for SQL module 413 (advanced-sql-techniques) — 10 exercises. Postgres dialect.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'advanced-sql-techniques';

const exercises = [
  {
    title: 'Refactor a Repeated Subquery into a Common Table Expression',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['common table expression', 'WITH clause', 'query readability', 'derived tables', 'aggregation'],
    prerequisites: ['GROUP BY', 'subqueries', 'JOIN'],
    tags: ['cte', 'with', 'readability', 'aggregation', 'postgres'],
    problemHtml: `<p>When the same derived result is needed twice in one query, copy-pasting a subquery makes the statement long and error-prone — change one copy and forget the other, and the query silently disagrees with itself. A <strong>common table expression</strong> (CTE), written with <code>WITH</code>, names a subquery once and lets the main query refer to it by name, the way a local variable names a value in ordinary code.</p>
<p>You are given a <code>sales</code> table. Write a query that returns each category whose total revenue is <strong>above the average category revenue</strong>:</p>
<ul>
<li>First compute, per category, the sum of <code>amount</code> as <code>revenue</code>. Name this result set <code>category_totals</code> in a <code>WITH</code> clause.</li>
<li>From <code>category_totals</code>, return <code>category</code> and <code>revenue</code> for every category whose <code>revenue</code> is greater than the average <code>revenue</code> across all categories.</li>
<li>Order the output by <code>revenue</code> descending.</li>
</ul>
<p>Use the CTE both to build the per-category totals and to compute the average over them, so the aggregation logic is written exactly once. The scaffold provides the <code>WITH</code> skeleton.</p>`,
    inputSpec: 'A sales table (sale_id, category, amount). Seeded so category totals are Electronics=600, Books=150, Toys=300 (average = 350).',
    outputSpec: 'Rows (category, revenue) for categories with revenue above the average of all category revenues, ordered by revenue descending.',
    constraints: 'Use a WITH clause (CTE). Do not repeat the SUM aggregation as two separate subqueries.',
    examplesJson: [
      {
        input: 'Category totals: Electronics=600, Books=150, Toys=300; average = (600+150+300)/3 = 350',
        output: '| category    | revenue |\n| Electronics | 600     |',
        explanation: 'Only Electronics (600) exceeds the average of 350. Toys (300) and Books (150) are below it.',
      },
      {
        input: 'The category_totals CTE holds Electronics=600, Books=150, Toys=300',
        output: 'Books and Toys are omitted from the final result',
        explanation: 'The outer WHERE compares each revenue to AVG(revenue) over the CTE (350); Books (150) and Toys (300) are both below it, so only Electronics remains.',
      },
    ],
    hintsJson: [
      'Name the per-category totals once so you can reuse them. Which clause defines a named subquery?',
      'WITH category_totals AS (SELECT category, SUM(amount) AS revenue FROM sales GROUP BY category) starts it.',
      'The threshold is the average of the revenues you just computed: (SELECT AVG(revenue) FROM category_totals).',
      'SELECT category, revenue FROM category_totals WHERE revenue > (SELECT AVG(revenue) FROM category_totals) ORDER BY revenue DESC.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Return categories whose revenue is above the average category revenue.
-- sales(sale_id, category, amount)

WITH category_totals AS (
    -- SUM(amount) per category AS revenue
)
SELECT category, revenue
FROM category_totals
-- WHERE revenue > average revenue
ORDER BY revenue DESC;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `WITH category_totals AS (
    SELECT category, SUM(amount) AS revenue
    FROM   sales
    GROUP BY category
)
SELECT category, revenue
FROM   category_totals
WHERE  revenue > (SELECT AVG(revenue) FROM category_totals)
ORDER BY revenue DESC;` }],
    solutionExplanationHtml: `<p>The CTE <code>category_totals</code> computes the per-category revenue exactly once and gives it a name. The outer query then uses that name twice — once to select the rows and once, inside the scalar subquery <code>(SELECT AVG(revenue) FROM category_totals)</code>, to compute the threshold. Because both references point at the same named result, the aggregation logic can never drift out of sync, which is the readability and correctness win over pasting the same <code>GROUP BY</code> subquery twice.</p>
<p>The subtle point is the two levels of aggregation: <code>SUM</code> collapses sales into one row per category, and <code>AVG</code> then averages across those category rows — not across the raw sales. A common mistake is writing <code>WHERE revenue &gt; AVG(revenue)</code> directly, which fails because an aggregate cannot appear in a <code>WHERE</code> clause that way; the value must come from a subquery (or a second CTE). Conceptually a CTE is an inline, single-statement view: it exists only for the duration of the query and is optimized as part of it, so there is no performance penalty for the clarity.</p>`,
    _setup: `DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (sale_id INT PRIMARY KEY, category TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL);
INSERT INTO sales VALUES
 (1,'Electronics',400),(2,'Electronics',200),
 (3,'Books',100),(4,'Books',50),
 (5,'Toys',300);`,
    _check: `WITH category_totals AS (SELECT category, SUM(amount) AS revenue FROM sales GROUP BY category)
SELECT category, revenue FROM category_totals WHERE revenue > (SELECT AVG(revenue) FROM category_totals) ORDER BY revenue DESC;`,
  },

  {
    title: 'Bucket Customers into Tiers with a CASE Expression',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['CASE expression', 'conditional logic', 'derived columns', 'ordering', 'value mapping'],
    prerequisites: ['SELECT', 'comparison operators'],
    tags: ['case', 'conditional', 'buckets', 'labels', 'postgres'],
    problemHtml: `<p>Reports rarely want raw numbers — they want labels: a spend of 1500 is a "Gold" customer, 300 is "Silver". A <code>CASE</code> expression is SQL's inline if/else: it evaluates conditions top to bottom and returns the value for the first that matches, letting you compute a derived column without leaving the query.</p>
<p>You are given a <code>customers</code> table with a <code>total_spent</code> column. Return every customer with a computed <code>tier</code>:</p>
<ul>
<li><code>total_spent &gt;= 1000</code> &rarr; <code>'Gold'</code>.</li>
<li><code>total_spent &gt;= 500</code> (but under 1000) &rarr; <code>'Silver'</code>.</li>
<li>everything else &rarr; <code>'Bronze'</code>.</li>
<li>Return <code>name</code>, <code>total_spent</code>, and the derived <code>tier</code>, ordered by <code>total_spent</code> descending.</li>
</ul>
<p>Order the <code>WHEN</code> branches from the highest threshold down, because <code>CASE</code> stops at the first true branch. The scaffold marks where the expression goes.</p>`,
    inputSpec: 'A customers table (customer_id, name, total_spent). Seeded with a mix of spend levels crossing both thresholds.',
    outputSpec: 'Rows of (name, total_spent, tier) where tier is Gold/Silver/Bronze per the thresholds, ordered by total_spent descending.',
    constraints: 'Use a single CASE expression. Branch order must be highest-threshold first so the ranges do not overlap incorrectly.',
    examplesJson: [
      {
        input: 'total_spent values: 1500, 750, 500, 200',
        output: '1500 -> Gold, 750 -> Silver, 500 -> Silver, 200 -> Bronze',
        explanation: '500 hits the >= 500 branch (Silver); 200 falls through to the ELSE (Bronze). The >= 500 boundary is inclusive.',
      },
      {
        input: 'total_spent values 1000 and 999',
        output: '1000 -> Gold, 999 -> Silver',
        explanation: 'The >= 1000 branch is inclusive, so exactly 1000 is Gold; 999 misses it and falls to the >= 500 branch, becoming Silver.',
      },
    ],
    hintsJson: [
      'You need an inline if/else that returns a label per row. Which SQL expression does that?',
      'CASE WHEN condition THEN value ... ELSE value END produces the derived column.',
      'List the highest threshold first: WHEN total_spent >= 1000 THEN \'Gold\'. CASE returns on the first true branch.',
      "SELECT name, total_spent, CASE WHEN total_spent >= 1000 THEN 'Gold' WHEN total_spent >= 500 THEN 'Silver' ELSE 'Bronze' END AS tier FROM customers ORDER BY total_spent DESC.",
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Label each customer Gold / Silver / Bronze by total_spent.
-- customers(customer_id, name, total_spent)

SELECT name, total_spent,
       CASE
           -- WHEN ... THEN 'Gold'
           -- WHEN ... THEN 'Silver'
           -- ELSE 'Bronze'
       END AS tier
FROM customers
ORDER BY total_spent DESC;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `SELECT name, total_spent,
       CASE
           WHEN total_spent >= 1000 THEN 'Gold'
           WHEN total_spent >= 500  THEN 'Silver'
           ELSE 'Bronze'
       END AS tier
FROM   customers
ORDER BY total_spent DESC;` }],
    solutionExplanationHtml: `<p><code>CASE</code> evaluates its <code>WHEN</code> branches strictly top to bottom and returns the result of the first one that is true, skipping the rest. That short-circuit is why branch order is the whole game here: a customer who spent 1500 satisfies both <code>&gt;= 1000</code> and <code>&gt;= 500</code>, and listing the Gold branch first ensures they are labelled Gold rather than Silver. Reverse the two branches and every Gold customer would be mislabelled Silver, because <code>&gt;= 500</code> would match first.</p>
<p>The <code>ELSE</code> is the catch-all for rows no branch matched; without it, unmatched rows would receive <code>NULL</code> instead of <code>'Bronze'</code>, a silent bug that only shows up for low spenders. Note the boundaries are inclusive because the conditions use <code>&gt;=</code>: exactly 500 is Silver, exactly 1000 is Gold. This "searched" form of <code>CASE</code> (each branch is a full boolean condition) is more flexible than the "simple" form <code>CASE total_spent WHEN ...</code>, which can only test equality against a single expression and cannot express ranges.</p>`,
    _setup: `DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (customer_id INT PRIMARY KEY, name TEXT NOT NULL, total_spent NUMERIC(10,2) NOT NULL);
INSERT INTO customers VALUES (1,'Ann',1500),(2,'Bob',750),(3,'Cy',500),(4,'Di',200);`,
    _check: `SELECT name, total_spent, CASE WHEN total_spent >= 1000 THEN 'Gold' WHEN total_spent >= 500 THEN 'Silver' ELSE 'Bronze' END AS tier FROM customers ORDER BY total_spent DESC;`,
  },

  {
    title: 'Keep Only the Latest Row per Group with ROW_NUMBER',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 15,
    concepts: ['window functions', 'ROW_NUMBER', 'PARTITION BY', 'deduplication', 'latest-per-group'],
    prerequisites: ['CTE', 'ORDER BY', 'GROUP BY'],
    tags: ['window-functions', 'row-number', 'dedupe', 'partition', 'postgres'],
    problemHtml: `<p>A recurring need is "one row per group — the most recent one". A plain <code>GROUP BY</code> can give you the latest <em>timestamp</em> per group, but not the whole row that goes with it. The clean tool is the <strong>window function</strong> <code>ROW_NUMBER()</code>, which numbers rows <em>within</em> each group without collapsing them, so you can then keep just number 1.</p>
<p>You are given a <code>price_history</code> table recording price changes per product over time. Return the <strong>current price of each product</strong> — the row with the newest <code>changed_at</code>:</p>
<ul>
<li>Use <code>ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC)</code> to number each product's history from newest (1) to oldest.</li>
<li>Keep only the rows numbered 1.</li>
<li>Return <code>product_id</code>, <code>price</code>, and <code>changed_at</code>, ordered by <code>product_id</code>.</li>
</ul>
<p>Because a window function cannot be used directly in <code>WHERE</code>, compute it in a CTE (or subquery) and filter in the outer query. The scaffold shows this two-step shape.</p>`,
    inputSpec: 'A price_history table (id, product_id, price, changed_at). Each product has several rows at different timestamps.',
    outputSpec: "One row per product — the one with the newest changed_at — as (product_id, price, changed_at), ordered by product_id.",
    constraints: 'Use ROW_NUMBER with PARTITION BY. The window function must be computed in a CTE/subquery and filtered in the outer query (it cannot go in WHERE directly).',
    examplesJson: [
      {
        input: 'product 1 has prices 10 (Jan), 12 (Mar), 11 (Feb); product 2 has 50 (Jan), 55 (Feb)',
        output: '| product_id | price | changed_at |\n| 1          | 12    | Mar        |\n| 2          | 55    | Feb        |',
        explanation: "Within product 1, March is newest so it is numbered 1; within product 2, February is newest. Only the number-1 rows survive.",
      },
      {
        input: 'product 2 has price 50 (Jan) and 55 (Feb)',
        output: '| product_id | price | changed_at |\n| 2          | 55    | Feb        |',
        explanation: 'Ordering by changed_at DESC gives February row number 1 for product 2, so its current price 55 is the row kept.',
      },
    ],
    hintsJson: [
      'GROUP BY would lose the price column. You need to rank rows within each product while keeping them.',
      'ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC) numbers newest = 1 per product.',
      'A window function cannot sit in WHERE. Put the numbering in a CTE, then filter rn = 1 outside.',
      'WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC) AS rn FROM price_history) SELECT product_id, price, changed_at FROM ranked WHERE rn = 1 ORDER BY product_id.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Current price per product = newest changed_at.
-- price_history(id, product_id, price, changed_at)

WITH ranked AS (
    SELECT product_id, price, changed_at,
           -- ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ... DESC) AS rn
           NULL AS rn
    FROM price_history
)
SELECT product_id, price, changed_at
FROM ranked
-- WHERE rn = 1
ORDER BY product_id;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `WITH ranked AS (
    SELECT product_id, price, changed_at,
           ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC) AS rn
    FROM   price_history
)
SELECT product_id, price, changed_at
FROM   ranked
WHERE  rn = 1
ORDER BY product_id;` }],
    solutionExplanationHtml: `<p>A window function runs <em>alongside</em> the rows instead of collapsing them. <code>ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC)</code> restarts the count at 1 for each product (that is what <code>PARTITION BY</code> does) and, within a product, assigns 1 to the newest <code>changed_at</code> because the window's <code>ORDER BY</code> is descending. Every history row keeps its price; it just gains a rank. Filtering <code>rn = 1</code> then leaves exactly one row per product — the current price, with its full context intact.</p>
<p>The structural trap is trying to write <code>WHERE ROW_NUMBER() OVER (...) = 1</code>. That fails because <code>WHERE</code> is evaluated <em>before</em> window functions in SQL's logical order, so the rank does not exist yet. The fix is the two-step pattern: materialize the numbering in a CTE (or subquery), then filter in the outer query where the column is visible. Choosing between <code>ROW_NUMBER</code> and <code>RANK</code> matters when timestamps can tie — <code>ROW_NUMBER</code> always yields a single row 1 (breaking ties arbitrarily), whereas <code>RANK</code> would return every tied row as rank 1. For "exactly one current price" you want <code>ROW_NUMBER</code>; add a tiebreaker like <code>, id DESC</code> to the window's <code>ORDER BY</code> if you need the choice to be deterministic.</p>`,
    _setup: `DROP TABLE IF EXISTS price_history CASCADE;
CREATE TABLE price_history (id INT PRIMARY KEY, product_id INT, price NUMERIC(10,2), changed_at DATE);
INSERT INTO price_history VALUES
 (1,1,10,'2026-01-10'),(2,1,12,'2026-03-05'),(3,1,11,'2026-02-01'),
 (4,2,50,'2026-01-15'),(5,2,55,'2026-02-20');`,
    _check: `WITH ranked AS (SELECT product_id, price, changed_at, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY changed_at DESC) AS rn FROM price_history)
SELECT product_id, price, changed_at FROM ranked WHERE rn = 1 ORDER BY product_id;`,
  },

  {
    title: 'Build a Leaderboard with RANK and DENSE_RANK',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 15,
    concepts: ['RANK', 'DENSE_RANK', 'ties handling', 'ordered window', 'ranking semantics'],
    prerequisites: ['window functions', 'ORDER BY'],
    tags: ['window-functions', 'rank', 'dense-rank', 'leaderboard', 'postgres'],
    problemHtml: `<p>Leaderboards must decide what happens on a tie. If two players share second place, is the next player third or fourth? SQL gives you both answers: <code>RANK</code> leaves a gap after a tie (1, 2, 2, 4) while <code>DENSE_RANK</code> does not (1, 2, 2, 3). Choosing the right one is a product decision, and knowing the difference is the point of this task.</p>
<p>You are given a <code>scores</code> table (<code>player</code>, <code>points</code>). Produce a leaderboard showing both ranking styles side by side:</p>
<ul>
<li>Return <code>player</code>, <code>points</code>, a <code>rnk</code> column from <code>RANK()</code>, and a <code>dense</code> column from <code>DENSE_RANK()</code>, both ordered by <code>points</code> descending.</li>
<li>Order the final output by <code>points</code> descending, then <code>player</code> ascending for a stable tiebreak in the display.</li>
</ul>
<p>Seed data deliberately contains a tie so the gap behaviour is visible. The scaffold provides the two window expressions to complete.</p>`,
    inputSpec: 'A scores table (player, points) with at least one tie in points.',
    outputSpec: 'Rows (player, points, rnk, dense) where rnk uses RANK() (gaps after ties) and dense uses DENSE_RANK() (no gaps), both over points descending.',
    constraints: 'Use both RANK() and DENSE_RANK() window functions over the same ORDER BY points DESC. Do not compute ranks in application code.',
    examplesJson: [
      {
        input: 'points: Ann=90, Bob=90, Cy=80, Di=70',
        output: '| player | points | rnk | dense |\n| Ann    | 90     | 1   | 1     |\n| Bob    | 90     | 1   | 1     |\n| Cy     | 80     | 3   | 2     |\n| Di     | 70     | 4   | 3     |',
        explanation: 'Ann and Bob tie at rank 1. RANK() then jumps to 3 for Cy (a gap), while DENSE_RANK() continues at 2 (no gap).',
      },
      {
        input: 'Cy scores 80, the next distinct score below the tied 90s',
        output: 'Cy: rnk 3, dense 2',
        explanation: 'RANK counts the two tied players ahead of Cy (giving 3), while DENSE_RANK counts only distinct scores ahead (giving 2).',
      },
    ],
    hintsJson: [
      'Both functions rank by the same order; they only differ in how they treat the row after a tie.',
      'RANK() OVER (ORDER BY points DESC) leaves a gap; DENSE_RANK() OVER (ORDER BY points DESC) does not.',
      'Put both in the same SELECT so you can compare them per row.',
      'SELECT player, points, RANK() OVER (ORDER BY points DESC) AS rnk, DENSE_RANK() OVER (ORDER BY points DESC) AS dense FROM scores ORDER BY points DESC, player.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Leaderboard comparing RANK vs DENSE_RANK.
-- scores(player, points)

SELECT player, points,
       -- RANK() OVER (ORDER BY points DESC) AS rnk,
       -- DENSE_RANK() OVER (ORDER BY points DESC) AS dense
       NULL AS rnk, NULL AS dense
FROM scores
ORDER BY points DESC, player;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Both ranking functions share the same ORDER BY and agree on tied rows; they differ
-- only on the row AFTER a tie: RANK leaves a gap (1, 1, 3) while DENSE_RANK does not (1, 1, 2).
SELECT player, points,
       RANK()       OVER (ORDER BY points DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY points DESC) AS dense
FROM   scores
ORDER BY points DESC, player;` }],
    solutionExplanationHtml: `<p>Both functions assign the same rank to tied rows, so Ann and Bob (90 points) are each rank 1 under both. The difference appears on the <em>next</em> distinct value. <code>RANK</code> counts the tied rows it skipped, so after two players at rank 1 the next is rank 3 — the "3" reflects that two players are ahead. <code>DENSE_RANK</code> ignores the count and simply moves to the next rank value, giving 2 — it answers "how many distinct scores are ahead" rather than "how many players".</p>
<p>Which to use is a semantics choice, not a style one. Sports standings that say "tied for 1st, next is 3rd" want <code>RANK</code>. A "top 3 distinct price bands" report wants <code>DENSE_RANK</code>, because you care about distinct levels, not how many rows filled each. A third function, <code>ROW_NUMBER</code>, would break the tie arbitrarily and give Ann 1 and Bob 2 — wrong for a leaderboard where equal scores deserve equal rank. The trap is assuming these are interchangeable; on data with no ties all three agree, which is exactly why bugs here hide until real tied data arrives. The final <code>ORDER BY points DESC, player</code> only controls display order and is independent of the window's own <code>ORDER BY</code>, which controls the ranking.</p>`,
    _setup: `DROP TABLE IF EXISTS scores CASCADE;
CREATE TABLE scores (player TEXT PRIMARY KEY, points INT NOT NULL);
INSERT INTO scores VALUES ('Ann',90),('Bob',90),('Cy',80),('Di',70);`,
    _check: `SELECT player, points, RANK() OVER (ORDER BY points DESC) AS rnk, DENSE_RANK() OVER (ORDER BY points DESC) AS dense FROM scores ORDER BY points DESC, player;`,
  },

  {
    title: 'Compute a Running Total with a Windowed SUM',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['windowed aggregate', 'SUM OVER', 'running total', 'frame ordering', 'cumulative sums'],
    prerequisites: ['window functions', 'ORDER BY', 'aggregate functions'],
    tags: ['window-functions', 'running-total', 'cumulative', 'sum-over', 'postgres'],
    problemHtml: `<p>A running (cumulative) total answers "how much have we accumulated up to and including this row" — a bank balance after each transaction, revenue-to-date by day. You could self-join every row to all earlier rows, but that is quadratic and awkward. A <strong>windowed aggregate</strong>, <code>SUM(...) OVER (ORDER BY ...)</code>, computes it in one pass by summing over a moving frame of rows.</p>
<p>You are given a <code>transactions</code> table (<code>txn_date</code>, <code>amount</code>) for a single account. Return each transaction with its running balance:</p>
<ul>
<li>Order transactions by <code>txn_date</code>.</li>
<li>Add a <code>running_balance</code> column = the sum of <code>amount</code> from the first transaction through the current one, using <code>SUM(amount) OVER (ORDER BY txn_date)</code>.</li>
<li>Return <code>txn_date</code>, <code>amount</code>, and <code>running_balance</code> in date order.</li>
</ul>
<p>The window's <code>ORDER BY</code> is what makes the aggregate cumulative rather than a grand total. The scaffold shows where the windowed sum goes.</p>`,
    inputSpec: 'A transactions table (txn_date, amount) for one account, amounts positive (deposits) and negative (withdrawals).',
    outputSpec: 'Rows (txn_date, amount, running_balance) in date order, where running_balance is the cumulative sum of amount up to and including that row.',
    constraints: 'Use SUM(amount) OVER (ORDER BY txn_date). Do not use a self-join or a correlated subquery to accumulate.',
    examplesJson: [
      {
        input: 'amounts by date: +100, -30, +50',
        output: '| txn_date | amount | running_balance |\n| d1       | 100    | 100             |\n| d2       | -30    | 70              |\n| d3       | 50     | 120             |',
        explanation: 'Each running_balance adds the current amount to the previous balance: 100, then 100-30=70, then 70+50=120.',
      },
      {
        input: 'the third transaction (+50) arrives when the running balance is 70',
        output: 'running_balance 120 on that row',
        explanation: 'The windowed SUM covers every row from the start through the current one, so it adds 50 to the prior 70 to give 120.',
      },
    ],
    hintsJson: [
      'You want a sum that grows as you move down the ordered rows, not one grand total.',
      'A plain SUM(amount) with no OVER collapses to one number. Add OVER (ORDER BY txn_date) to make it cumulative.',
      'With an ORDER BY in the window and no explicit frame, the default frame is RANGE from the start through the current row — exactly a running total.',
      'SELECT txn_date, amount, SUM(amount) OVER (ORDER BY txn_date) AS running_balance FROM transactions ORDER BY txn_date.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Running balance per transaction, in date order.
-- transactions(txn_date, amount)

SELECT txn_date, amount,
       -- SUM(amount) OVER (ORDER BY txn_date) AS running_balance
       NULL AS running_balance
FROM transactions
ORDER BY txn_date;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- SUM turns cumulative the moment it gets an OVER (ORDER BY ...): with an ORDER BY and no
-- explicit frame, the default is UNBOUNDED PRECEDING through CURRENT ROW, i.e. a running total.
SELECT txn_date, amount,
       SUM(amount) OVER (ORDER BY txn_date) AS running_balance
FROM   transactions
ORDER BY txn_date;` }],
    solutionExplanationHtml: `<p>Adding <code>OVER (ORDER BY txn_date)</code> turns the ordinary aggregate <code>SUM</code> into a windowed one: instead of collapsing all rows into a single total, it computes a total for a frame of rows relative to the current row. With an <code>ORDER BY</code> present and no explicit frame clause, the default frame is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — every row from the start of the ordering up to the current one — which is exactly the definition of a running total. So row three's balance sums rows one through three.</p>
<p>The default frame is also the classic trap. If two transactions share the same <code>txn_date</code>, the default <code>RANGE</code> frame treats them as <em>peers</em> and both get the same cumulative value (the sum through the end of that date), which can look like a mistake. When you need strict row-by-row accumulation even across ties, switch to <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, which counts physical rows rather than value ranges. Performance-wise this is a single ordered pass — far better than a correlated subquery or self-join that re-sums all prior rows for every row (O(n²)). The outer <code>ORDER BY</code> makes the displayed order match the accumulation order; without it the result set order is not guaranteed.</p>`,
    _setup: `DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE transactions (txn_date DATE PRIMARY KEY, amount NUMERIC(10,2) NOT NULL);
INSERT INTO transactions VALUES ('2026-01-01',100),('2026-01-02',-30),('2026-01-03',50);`,
    _check: `SELECT txn_date, amount, SUM(amount) OVER (ORDER BY txn_date) AS running_balance FROM transactions ORDER BY txn_date;`,
  },

  {
    title: 'Pivot Monthly Sales into Columns with FILTER',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['conditional aggregation', 'FILTER clause', 'pivoting', 'GROUP BY', 'CASE in aggregates'],
    prerequisites: ['GROUP BY', 'aggregate functions', 'CASE'],
    tags: ['pivot', 'filter', 'conditional-aggregation', 'reporting', 'postgres'],
    problemHtml: `<p>Rows are how data is stored; columns are often how humans want to read it. Turning "one row per (region, quarter)" into "one row per region with a column per quarter" is a <strong>pivot</strong>. In standard SQL you do it with <strong>conditional aggregation</strong>: an aggregate that only counts the rows matching a condition, using the <code>FILTER (WHERE ...)</code> clause.</p>
<p>You are given a <code>sales</code> table (<code>region</code>, <code>quarter</code>, <code>amount</code>) where <code>quarter</code> is one of <code>'Q1'</code>..<code>'Q4'</code>. Produce a report with one row per region and one revenue column per quarter:</p>
<ul>
<li>Group by <code>region</code>.</li>
<li>Produce four columns <code>q1</code>, <code>q2</code>, <code>q3</code>, <code>q4</code>, each the <code>SUM(amount)</code> for that region restricted to that quarter, using <code>SUM(amount) FILTER (WHERE quarter = 'Qn')</code>.</li>
<li>Use <code>COALESCE</code> so a region with no sales in a quarter shows <code>0</code> rather than <code>NULL</code>.</li>
<li>Order by <code>region</code>.</li>
</ul>
<p>The scaffold provides the <code>GROUP BY</code> skeleton and one filtered aggregate to pattern-match. </p>`,
    inputSpec: "A sales table (region, quarter, amount) with quarter in Q1..Q4. Some region/quarter combinations may be absent.",
    outputSpec: 'One row per region with columns q1..q4 = SUM(amount) for that quarter (0 when absent), ordered by region.',
    constraints: "Use aggregate FILTER (WHERE ...) for the pivot (or CASE inside SUM). Wrap each with COALESCE(..., 0). One row per region.",
    examplesJson: [
      {
        input: "North: Q1=100, Q2=200; South: Q1=50, Q3=80",
        output: '| region | q1  | q2  | q3 | q4 |\n| North  | 100 | 200 | 0  | 0  |\n| South  | 50  | 0   | 80 | 0  |',
        explanation: "Each quarter column sums only that quarter's rows for the region; quarters with no rows become 0 via COALESCE.",
      },
      {
        input: 'North has sales only in Q1 and Q2',
        output: 'North: q3 = 0 and q4 = 0',
        explanation: 'With no Q3 or Q4 rows for North, each filtered SUM returns NULL and COALESCE presents it as 0 instead of leaving a hole.',
      },
    ],
    hintsJson: [
      'You need per-quarter sums within each region group — an aggregate that only sees the matching quarter.',
      "SUM(amount) FILTER (WHERE quarter = 'Q1') sums only Q1 rows in each group.",
      'A missing quarter yields NULL from the aggregate; COALESCE(..., 0) turns it into 0.',
      "SELECT region, COALESCE(SUM(amount) FILTER (WHERE quarter='Q1'),0) AS q1, ... GROUP BY region ORDER BY region.",
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Pivot region/quarter sales into q1..q4 columns.
-- sales(region, quarter, amount)

SELECT region,
       COALESCE(SUM(amount) FILTER (WHERE quarter = 'Q1'), 0) AS q1
       -- , q2, q3, q4 the same way
FROM sales
GROUP BY region
ORDER BY region;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `SELECT region,
       COALESCE(SUM(amount) FILTER (WHERE quarter = 'Q1'), 0) AS q1,
       COALESCE(SUM(amount) FILTER (WHERE quarter = 'Q2'), 0) AS q2,
       COALESCE(SUM(amount) FILTER (WHERE quarter = 'Q3'), 0) AS q3,
       COALESCE(SUM(amount) FILTER (WHERE quarter = 'Q4'), 0) AS q4
FROM   sales
GROUP BY region
ORDER BY region;` }],
    solutionExplanationHtml: `<p>The pivot works because each aggregate carries its own <code>FILTER (WHERE ...)</code>, so within a single <code>GROUP BY region</code> group, <code>SUM(amount) FILTER (WHERE quarter = 'Q1')</code> adds up only the Q1 rows and ignores the rest, while the Q2 aggregate independently sees only Q2 rows. Four filtered sums over the same group produce four quarter columns from rows that were stored one-per-quarter. This is the standard-SQL way to pivot; <code>FILTER</code> reads more clearly than the older equivalent <code>SUM(CASE WHEN quarter = 'Q1' THEN amount END)</code>, though both compile to the same idea.</p>
<p>The <code>COALESCE</code> wrapper handles the empty case: when a region has no rows for a quarter, the filtered <code>SUM</code> returns <code>NULL</code> (there is nothing to add), and <code>COALESCE(..., 0)</code> presents that absence as a zero, which is what a financial grid should show. The trap is forgetting it and shipping a report peppered with <code>NULL</code> holes, or worse, letting those nulls propagate into a later total. One limitation to know: this hand-written pivot requires you to name the quarters in advance — SQL cannot pivot an unknown, data-driven set of columns in a single static query, which is why fixed dimensions like quarters are the natural fit.</p>`,
    _setup: `DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (id INT PRIMARY KEY, region TEXT, quarter TEXT, amount NUMERIC(10,2));
INSERT INTO sales VALUES
 (1,'North','Q1',100),(2,'North','Q2',200),
 (3,'South','Q1',50),(4,'South','Q3',80);`,
    _check: `SELECT region,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q1'),0) AS q1,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q2'),0) AS q2,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q3'),0) AS q3,
 COALESCE(SUM(amount) FILTER (WHERE quarter='Q4'),0) AS q4
FROM sales GROUP BY region ORDER BY region;`,
  },

  {
    title: 'Produce Subtotals and a Grand Total with ROLLUP',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['GROUP BY ROLLUP', 'subtotals', 'grand total', 'GROUPING function', 'hierarchical aggregation'],
    prerequisites: ['GROUP BY', 'aggregate functions', 'COALESCE'],
    tags: ['rollup', 'grouping-sets', 'subtotals', 'reporting', 'postgres'],
    problemHtml: `<p>A finished sales report usually wants three levels at once: revenue per (region, product), a subtotal per region, and a grand total across everything. Running three separate queries and stitching them together is fragile. <code>GROUP BY ROLLUP</code> computes all of those levels in a single query by aggregating the grouping columns from most detailed to least.</p>
<p>You are given a <code>sales</code> table (<code>region</code>, <code>product</code>, <code>amount</code>). Produce a rolled-up report:</p>
<ul>
<li>Use <code>GROUP BY ROLLUP (region, product)</code> to get, in one result: each (region, product) total, a per-region subtotal, and one grand total.</li>
<li>In the subtotal rows the <code>product</code> is <code>NULL</code>, and in the grand-total row both <code>region</code> and <code>product</code> are <code>NULL</code>. Replace those with the labels <code>'(all products)'</code> and <code>'(all regions)'</code> using <code>COALESCE</code> or the <code>GROUPING()</code> function so the report is readable.</li>
<li>Select <code>region</code>, <code>product</code>, and <code>SUM(amount) AS revenue</code>, ordered so each region's detail rows precede its subtotal.</li>
</ul>
<p>The scaffold provides the grouping skeleton. Focus on distinguishing detail, subtotal, and grand-total rows.</p>`,
    inputSpec: 'A sales table (region, product, amount) with multiple products per region across two regions.',
    outputSpec: "Detail rows per (region, product), a subtotal row per region with product labelled '(all products)', and a grand-total row labelled '(all regions)' / '(all products)', with SUM(amount) as revenue.",
    constraints: "Use GROUP BY ROLLUP. Distinguish subtotal/grand-total rows from a real NULL using GROUPING() (or the fact that grouped-away columns are NULL). Label them for readability.",
    examplesJson: [
      {
        input: 'North: A=100, B=50; South: A=80',
        output: 'North/A=100, North/B=50, North subtotal=150, South/A=80, South subtotal=80, grand total=230',
        explanation: 'ROLLUP adds a subtotal per region (product NULL) and one grand total (both NULL), on top of the detail rows.',
      },
      {
        input: 'the single most-aggregated row ROLLUP produces',
        output: '| (all regions) | (all products) | 230 |',
        explanation: 'Rolling away both columns gives the grand total of every sale (100 + 50 + 80 = 230); COALESCE labels the two NULLs.',
      },
    ],
    hintsJson: [
      'You want detail + per-region subtotal + grand total from one query. Which GROUP BY extension adds those higher levels?',
      'GROUP BY ROLLUP (region, product) aggregates (region, product), then (region), then ().',
      'Subtotal rows have product = NULL; the grand-total row has region = NULL too. GROUPING(product) returns 1 for a rolled-up column.',
      "Use COALESCE(product, '(all products)') and COALESCE(region, '(all regions)') to label the aggregate rows.",
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Detail + region subtotals + grand total in one query.
-- sales(region, product, amount)

SELECT COALESCE(region, '(all regions)')  AS region,
       COALESCE(product, '(all products)') AS product,
       SUM(amount) AS revenue
FROM sales
-- GROUP BY ROLLUP (...)
ORDER BY region, product;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `SELECT COALESCE(region, '(all regions)')   AS region,
       COALESCE(product, '(all products)') AS product,
       SUM(amount) AS revenue
FROM   sales
GROUP BY ROLLUP (region, product)
ORDER BY GROUPING(region), region, GROUPING(product), product;` }],
    solutionExplanationHtml: `<p><code>GROUP BY ROLLUP (region, product)</code> is shorthand for aggregating at several levels in one pass: the full detail <code>(region, product)</code>, then the subtotal level <code>(region)</code> with product rolled away, then the grand total <code>()</code> with both rolled away. Each rolled-away column comes back as <code>NULL</code> in its aggregate rows, which is why the subtotal rows have a <code>NULL</code> product and the single grand-total row has both <code>NULL</code>. Wrapping them in <code>COALESCE</code> turns those structural nulls into human labels.</p>
<p>There is a real ambiguity to handle: a <code>NULL</code> produced by <code>ROLLUP</code> looks identical to a genuine <code>NULL</code> already in the data. The <code>GROUPING()</code> function disambiguates — <code>GROUPING(product)</code> returns <code>1</code> when the row is a subtotal that rolled product away and <code>0</code> when product is a real value (even a real null). It is also the key to correct ordering: sorting by <code>GROUPING(region), region, GROUPING(product), product</code> keeps each region's detail rows above its subtotal, and pushes the grand total last, instead of letting the label text sort arbitrarily. If your data legitimately contains null regions or products, relying on <code>COALESCE</code> alone would mislabel them; <code>GROUPING()</code> is the robust discriminator. <code>ROLLUP</code> is a special case of the more general <code>GROUPING SETS</code>, which lets you request any explicit combination of levels.</p>`,
    _setup: `DROP TABLE IF EXISTS sales CASCADE;
CREATE TABLE sales (id INT PRIMARY KEY, region TEXT, product TEXT, amount NUMERIC(10,2));
INSERT INTO sales VALUES (1,'North','A',100),(2,'North','B',50),(3,'South','A',80);`,
    _check: `SELECT COALESCE(region,'(all regions)') AS region, COALESCE(product,'(all products)') AS product, SUM(amount) AS revenue
FROM sales GROUP BY ROLLUP (region, product)
ORDER BY GROUPING(region), region, GROUPING(product), product;`,
  },

  {
    title: 'Pick One Row per Group with DISTINCT ON',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['DISTINCT ON', 'one-row-per-group', 'ordering semantics', 'Postgres-specific', 'top-N-per-group'],
    prerequisites: ['ORDER BY', 'GROUP BY', 'window functions'],
    tags: ['distinct-on', 'top-per-group', 'postgres', 'ordering', 'sql'],
    problemHtml: `<p>Postgres has a concise tool for "give me one representative row per group": <code>DISTINCT ON</code>. It keeps the first row it sees for each distinct value of the listed expressions, and you control which row is "first" through <code>ORDER BY</code>. It is often shorter than the <code>ROW_NUMBER</code> pattern for the same job.</p>
<p>You are given an <code>orders</code> table (<code>customer_id</code>, <code>order_id</code>, <code>ordered_at</code>, <code>total</code>). Return each customer's <strong>most recent order</strong>:</p>
<ul>
<li>Use <code>DISTINCT ON (customer_id)</code> to keep one row per customer.</li>
<li>Make "most recent" precise: the <code>ORDER BY</code> must start with <code>customer_id</code> (to match the <code>DISTINCT ON</code> key) and then <code>ordered_at DESC</code> so the newest order is the one kept.</li>
<li>Return <code>customer_id</code>, <code>order_id</code>, <code>ordered_at</code>, <code>total</code>.</li>
</ul>
<p>The rule to remember: the leading <code>ORDER BY</code> expressions must match the <code>DISTINCT ON</code> list. The scaffold marks both clauses.</p>`,
    inputSpec: 'An orders table (customer_id, order_id, ordered_at, total). Each customer has multiple orders on different dates.',
    outputSpec: "One row per customer — their newest order — as (customer_id, order_id, ordered_at, total).",
    constraints: 'Use DISTINCT ON (customer_id). The ORDER BY must begin with customer_id, then ordered_at DESC. Do not use GROUP BY (it cannot return the whole matching row directly).',
    examplesJson: [
      {
        input: 'customer 1 has orders on Jan(=$10) and Mar(=$40); customer 2 has orders on Feb(=$20)',
        output: '| customer_id | order_id | ordered_at | total |\n| 1           | (Mar row)| Mar        | 40    |\n| 2           | (Feb row)| Feb        | 20    |',
        explanation: 'DISTINCT ON keeps the first row per customer after ordering by ordered_at DESC, so each customer\'s newest order survives.',
      },
      {
        input: 'customer 1 has order 101 (Jan, 10) and order 102 (Mar, 40)',
        output: '| customer_id | order_id | ordered_at | total |\n| 1           | 102      | Mar        | 40    |',
        explanation: 'ORDER BY customer_id, ordered_at DESC puts the March order first for customer 1, so DISTINCT ON keeps order 102.',
      },
    ],
    hintsJson: [
      'You want the whole newest row per customer, not just the max date. DISTINCT ON keeps one full row per key.',
      'DISTINCT ON (customer_id) keeps the first row for each customer as defined by ORDER BY.',
      'The ORDER BY must lead with the same key: ORDER BY customer_id, then ordered_at DESC to make "first" mean "newest".',
      'SELECT DISTINCT ON (customer_id) customer_id, order_id, ordered_at, total FROM orders ORDER BY customer_id, ordered_at DESC.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Newest order per customer using DISTINCT ON.
-- orders(customer_id, order_id, ordered_at, total)

SELECT DISTINCT ON (customer_id)
       customer_id, order_id, ordered_at, total
FROM orders
-- ORDER BY customer_id, ordered_at ???
;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- DISTINCT ON keeps the first row per customer_id; the ORDER BY (which MUST start with that
-- same key) decides which row counts as "first" — here the newest ordered_at wins.
SELECT DISTINCT ON (customer_id)
       customer_id, order_id, ordered_at, total
FROM   orders
ORDER BY customer_id, ordered_at DESC;` }],
    solutionExplanationHtml: `<p><code>DISTINCT ON (customer_id)</code> tells Postgres to keep exactly one row for each distinct <code>customer_id</code>, and the <code>ORDER BY</code> decides <em>which</em> one: after sorting, the first row encountered per customer is the one retained. Leading the sort with <code>customer_id</code> groups the rows by customer, and the following <code>ordered_at DESC</code> makes the newest order appear first within each customer — so that is the row kept. The result is one full, real row per customer, columns and all, which a plain <code>GROUP BY</code> cannot give you directly because non-aggregated columns are not tied to the row that produced the <code>MAX(ordered_at)</code>.</p>
<p>The mandatory rule, and the usual source of errors, is that the <code>ORDER BY</code> must <em>begin</em> with the <code>DISTINCT ON</code> expressions; otherwise Postgres raises <em>SELECT DISTINCT ON expressions must match initial ORDER BY expressions</em>. Any additional sort keys after the key (here <code>ordered_at DESC</code>) are what pick the winner. Compared with the portable <code>ROW_NUMBER() ... WHERE rn = 1</code> approach, <code>DISTINCT ON</code> is shorter and often faster for "one row per group", but it is Postgres-specific — reach for the window-function version when you need cross-database portability. If two orders share the newest timestamp, add a deterministic tiebreaker such as <code>, order_id DESC</code> so the choice is stable.</p>`,
    _setup: `DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (customer_id INT, order_id INT PRIMARY KEY, ordered_at DATE, total NUMERIC(10,2));
INSERT INTO orders VALUES
 (1,101,'2026-01-05',10),(1,102,'2026-03-09',40),
 (2,201,'2026-02-02',20);`,
    _check: `SELECT DISTINCT ON (customer_id) customer_id, order_id, ordered_at, total FROM orders ORDER BY customer_id, ordered_at DESC;`,
  },

  {
    title: 'Walk an Organization Chart with a Recursive CTE',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 25,
    concepts: ['recursive CTE', 'WITH RECURSIVE', 'hierarchy traversal', 'anchor and recursive terms', 'depth tracking'],
    prerequisites: ['CTE', 'JOIN', 'UNION ALL'],
    tags: ['recursive-cte', 'hierarchy', 'tree', 'graph', 'postgres'],
    problemHtml: `<p>Self-referencing tables — an employee whose <code>manager_id</code> points at another employee — form a tree that ordinary joins cannot walk to arbitrary depth. A <strong>recursive CTE</strong> (<code>WITH RECURSIVE</code>) does: it starts from a base set and repeatedly joins the CTE back to the table, following the links one level at a time until nothing new is found.</p>
<p>You are given an <code>employees</code> table (<code>employee_id</code>, <code>name</code>, <code>manager_id</code>). Starting from the top manager (the one whose <code>manager_id</code> is <code>NULL</code>), return the whole reporting tree with each person's depth:</p>
<ul>
<li>The <strong>anchor</strong> selects the root: <code>manager_id IS NULL</code>, at <code>depth = 1</code>.</li>
<li>The <strong>recursive term</strong> joins <code>employees</code> to the CTE on <code>employees.manager_id = cte.employee_id</code>, adding <code>depth + 1</code>.</li>
<li>Return <code>employee_id</code>, <code>name</code>, and <code>depth</code>, ordered by <code>depth</code> then <code>employee_id</code>.</li>
</ul>
<p>The two parts are combined with <code>UNION ALL</code>. The scaffold gives the <code>WITH RECURSIVE</code> skeleton with the anchor and recursive term marked.</p>`,
    inputSpec: 'An employees table (employee_id, name, manager_id) forming a tree: one root (manager_id NULL) and several levels of reports.',
    outputSpec: 'Every employee with a depth column (root = 1, their reports = 2, and so on), ordered by depth then employee_id.',
    constraints: 'Use WITH RECURSIVE with an anchor (manager_id IS NULL) and a recursive term joined on manager_id. Combine with UNION ALL. Do not hard-code the number of levels.',
    examplesJson: [
      {
        input: 'CEO(1, mgr NULL); VP(2, mgr 1), VP(3, mgr 1); Eng(4, mgr 2)',
        output: '| employee_id | name | depth |\n| 1           | CEO  | 1     |\n| 2           | VP   | 2     |\n| 3           | VP   | 2     |\n| 4           | Eng  | 3     |',
        explanation: 'The anchor is the CEO at depth 1; the VPs report to the CEO so they are depth 2; the engineer reports to a VP so is depth 3.',
      },
      {
        input: 'Engineer (id 4) reports to VP-Eng (id 2), who reports to CEO (id 1)',
        output: '| employee_id | name     | depth |\n| 4           | Engineer | 3     |',
        explanation: 'Each recursive pass adds one level, so the two-hop chain from CEO down to the engineer lands the engineer at depth 3.',
      },
    ],
    hintsJson: [
      'An ordinary join reaches one level down. To reach any depth, the query must refer to itself.',
      'WITH RECURSIVE has two halves joined by UNION ALL: a base row (the root) and a step that extends the result.',
      'Anchor: SELECT employee_id, name, 1 AS depth FROM employees WHERE manager_id IS NULL.',
      'Recursive term: SELECT e.employee_id, e.name, t.depth + 1 FROM employees e JOIN tree t ON e.manager_id = t.employee_id.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Full reporting tree with depth, from the root down.
-- employees(employee_id, name, manager_id)

WITH RECURSIVE tree AS (
    -- anchor: the root (manager_id IS NULL), depth 1

    UNION ALL

    -- recursive term: employees whose manager is already in tree, depth + 1
)
SELECT employee_id, name, depth
FROM tree
ORDER BY depth, employee_id;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `WITH RECURSIVE tree AS (
    SELECT employee_id, name, 1 AS depth
    FROM   employees
    WHERE  manager_id IS NULL

    UNION ALL

    SELECT e.employee_id, e.name, t.depth + 1
    FROM   employees e
    JOIN   tree t ON e.manager_id = t.employee_id
)
SELECT employee_id, name, depth
FROM   tree
ORDER BY depth, employee_id;` }],
    solutionExplanationHtml: `<p>A recursive CTE has two parts joined by <code>UNION ALL</code>. The <strong>anchor</strong> runs once and seeds the result with the root row — the employee whose <code>manager_id IS NULL</code>, at depth 1. The <strong>recursive term</strong> then runs repeatedly: each pass joins <code>employees</code> to the rows already produced (<code>tree</code>) on <code>e.manager_id = t.employee_id</code>, finding everyone who reports to someone discovered in the previous pass and stamping them one level deeper. Postgres keeps iterating until a pass adds no new rows, so the query adapts to any tree height without you naming the number of levels.</p>
<p>The classic mistakes are two. First, using <code>UNION</code> instead of <code>UNION ALL</code>: <code>UNION</code> deduplicates on every iteration, which is slower and, more importantly, masks cycles instead of surfacing them. Second, omitting a stop condition on data that is not a clean tree — if the <code>manager_id</code> links ever form a loop (A manages B who manages A), the recursion never terminates. Guard real hierarchies by carrying a path array and adding <code>WHERE e.employee_id &lt;&gt; ALL(path)</code>, or set a depth cap. The join direction encodes the traversal: joining <code>e.manager_id = t.employee_id</code> walks <em>downward</em> from managers to reports; flipping it to <code>e.employee_id = t.manager_id</code> would walk upward from an employee to their chain of managers. The same pattern traverses any parent-child structure: category trees, bill-of-materials, threaded comments.</p>`,
    diagramMermaid: `flowchart TD
  CEO[CEO depth 1] --> VP1[VP depth 2]
  CEO --> VP2[VP depth 2]
  VP1 --> Eng[Engineer depth 3]`,
    _setup: `DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees (employee_id INT PRIMARY KEY, name TEXT NOT NULL, manager_id INT REFERENCES employees(employee_id));
INSERT INTO employees VALUES (1,'CEO',NULL),(2,'VP-Eng',1),(3,'VP-Sales',1),(4,'Engineer',2);`,
    _check: `WITH RECURSIVE tree AS (
  SELECT employee_id, name, 1 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, t.depth + 1 FROM employees e JOIN tree t ON e.manager_id = t.employee_id
)
SELECT employee_id, name, depth FROM tree ORDER BY depth, employee_id;`,
  },

  {
    title: 'Number Consecutive Login Streaks with the Gaps-and-Islands Technique',
    difficulty: 'HARD',
    estimatedMinutes: 75,
    points: 30,
    concepts: ['gaps and islands', 'window functions', 'ROW_NUMBER difference', 'grouping consecutive rows', 'date arithmetic'],
    prerequisites: ['window functions', 'CTE', 'ROW_NUMBER', 'date arithmetic'],
    tags: ['gaps-and-islands', 'window-functions', 'streaks', 'analytics', 'postgres'],
    problemHtml: `<p>"How many consecutive days did each user log in?" is deceptively hard in SQL because "consecutive" is about the relationship <em>between</em> rows, not any single row. The elegant solution is the <strong>gaps-and-islands</strong> technique: subtract a per-user row number from each date, and every run of consecutive dates collapses to a constant you can group on.</p>
<p>You are given a <code>logins</code> table with one row per (<code>user_id</code>, <code>login_date</code>), already de-duplicated. For each maximal run of consecutive daily logins, return one summary row:</p>
<ul>
<li>Within each user, order by <code>login_date</code> and compute <code>ROW_NUMBER()</code>.</li>
<li>Compute the anchor <code>login_date - (row_number) * INTERVAL '1 day'</code>. For a run of consecutive days this anchor is identical across the whole run, so it identifies the "island".</li>
<li>Group by <code>user_id</code> and that anchor, returning <code>user_id</code>, the <code>streak_start</code> (min date), <code>streak_end</code> (max date), and <code>streak_length</code> (count of days).</li>
<li>Order by <code>user_id</code>, then <code>streak_start</code>.</li>
</ul>
<p>The scaffold lays out the CTE that computes the row number and the anchor, leaving the final grouping to you. </p>`,
    inputSpec: 'A logins table (user_id, login_date) with one row per user per day they logged in; some days are skipped, creating separate streaks.',
    outputSpec: 'One row per consecutive-day streak: (user_id, streak_start, streak_end, streak_length), ordered by user_id then streak_start.',
    constraints: 'Use the gaps-and-islands technique (ROW_NUMBER per user, subtracted from the date). Do not use a recursive CTE. Assume input is already one row per user per day.',
    examplesJson: [
      {
        input: 'user 1 logs in Jan 1, 2, 3, then 5, 6 (gap on Jan 4)',
        output: '| user_id | streak_start | streak_end | streak_length |\n| 1       | Jan 1        | Jan 3      | 3             |\n| 1       | Jan 5        | Jan 6      | 2             |',
        explanation: 'Jan 1-3 form one island (length 3); the gap on Jan 4 breaks the streak; Jan 5-6 form a second island (length 2).',
      },
      {
        input: 'user 2 logs in on Jan 10 and Jan 11 only',
        output: '| user_id | streak_start | streak_end | streak_length |\n| 2       | Jan 10       | Jan 11     | 2             |',
        explanation: 'Two consecutive days produce the same island key (date minus row-number), so they collapse into one streak of length 2.',
      },
    ],
    hintsJson: [
      'Consecutive dates increase by 1 each row, and a per-user ROW_NUMBER also increases by 1 each row. What is constant when you subtract them?',
      'For a run of consecutive days, login_date minus row_number (as days) is the same value throughout the run — that constant is the island key.',
      'Compute rn = ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date), then grp = login_date - rn * INTERVAL \'1 day\' in a CTE.',
      'GROUP BY user_id, grp and select MIN(login_date), MAX(login_date), COUNT(*) as the streak bounds and length.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Summarize each consecutive-day login streak per user.
-- logins(user_id, login_date)  -- one row per user per day

WITH marked AS (
    SELECT user_id, login_date,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
    FROM logins
),
islands AS (
    SELECT user_id, login_date,
           -- login_date - rn days => constant within a streak
           login_date - (rn * INTERVAL '1 day') AS grp
    FROM marked
)
SELECT user_id
       -- , MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_length
FROM islands
-- GROUP BY ...
ORDER BY user_id;` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `WITH marked AS (
    SELECT user_id, login_date,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
    FROM   logins
),
islands AS (
    SELECT user_id, login_date,
           login_date - (rn * INTERVAL '1 day') AS grp
    FROM   marked
)
SELECT user_id,
       MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end,
       COUNT(*)        AS streak_length
FROM   islands
GROUP BY user_id, grp
ORDER BY user_id, streak_start;` }],
    solutionExplanationHtml: `<p>The trick rests on a numeric coincidence. Inside one user's ordered logins, <code>ROW_NUMBER()</code> increases by exactly 1 per row. When the dates are also consecutive, <code>login_date</code> increases by exactly 1 day per row too. Subtract the row number (as days) from the date and the two increments cancel: every row in a run of consecutive days yields the <em>same</em> anchor date, while the first row after a gap yields a different one because the date jumped but the row number did not. That anchor, computed in the <code>islands</code> CTE as <code>grp</code>, becomes a stable identifier for each streak — even though it is not a real calendar date, it is constant per island, which is all <code>GROUP BY</code> needs.</p>
<p>Grouping by <code>user_id, grp</code> then collapses each island into one summary: <code>MIN</code> and <code>MAX</code> give the streak's first and last day, and <code>COUNT(*)</code> its length. The technique is O(n log n) — one sort for the window plus one grouping — versus the O(n²) of comparing every row to its neighbours with a self-join, and unlike a recursive CTE it has no iteration limit to worry about. Two assumptions make it correct and must hold: the input is one row per user per day (duplicates would inflate the row number and split islands wrongly), and "consecutive" is defined on whole days. For a different cadence — consecutive months, or "within 7 days" — you adjust the interval and the ordering, but the subtract-the-row-number idea is the same. This gaps-and-islands pattern is a workhorse for sessionization, uptime windows, and any "group the runs" problem.</p>`,
    _setup: `DROP TABLE IF EXISTS logins CASCADE;
CREATE TABLE logins (user_id INT, login_date DATE, PRIMARY KEY (user_id, login_date));
INSERT INTO logins VALUES
 (1,'2026-01-01'),(1,'2026-01-02'),(1,'2026-01-03'),(1,'2026-01-05'),(1,'2026-01-06'),
 (2,'2026-01-10'),(2,'2026-01-11');`,
    _check: `WITH marked AS (SELECT user_id, login_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn FROM logins),
islands AS (SELECT user_id, login_date, login_date - (rn * INTERVAL '1 day') AS grp FROM marked)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_length
FROM islands GROUP BY user_id, grp ORDER BY user_id, streak_start;`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });
const clean = exercises.map(({ _setup, _check, _extra, ...ex }) => ex);
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let sql = `\\set ON_ERROR_STOP off\n\\pset pager off\n`;
exercises.forEach((ex, i) => {
  const sol = ex.solutionCodeJson.map((f) => f.code).join('\n');
  sql += `\n\\echo '========== EX ${i + 1}: ${ex.title.replace(/'/g, '')} =========='\n`;
  sql += (ex._setup || '') + '\n';
  sql += `\\echo '--- check (expected result) ---'\n` + (ex._check || sol) + '\n';
});
fs.writeFileSync(path.join(VERIFY, `sql-413.sql`), sql);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} diff ${ex.difficulty} != ${diffs[i]}`);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml<900 ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${ex.title}`);
  if (ex.hintsJson.length < 4) throw new Error(`<4 hints ${ex.title}`);
  const solLen = ex.solutionCodeJson.map((f) => f.code).join('').length;
  if (solLen < 210) throw new Error(`solution<210 (seeder floor 200) ${ex.title} (${solLen})`);
});
console.log(`OK ${parsed.exercises.length} exercises -> ${trackSlug}__${moduleSlug}.json`);
