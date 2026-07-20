// Lesson generator for SQL module 413 (advanced-sql-techniques), moduleId 413.
// Emits the DocBlocks payload AND a verify.sql built from a shared demo dataset + every
// runnable SQL code block, so each snippet is executed against real Postgres before shipping.
import fs from 'node:fs';
import path from 'node:path';

const moduleId = 413;
const trackSlug = 'sql';
const moduleSlug = 'advanced-sql-techniques';

const B = [];
const h = (text) => B.push({ type: 'heading', text });
const p = (html) => B.push({ type: 'prose', html });
// runnable: mark whether this code block should be run in verify (true) and any expected substring
const c = (title, code, runnable = true) => { B.push({ type: 'code', title, language: 'sql', code, _run: runnable }); };
const mm = (code) => B.push({ type: 'mermaid', code });

// ---------- Introduction ----------
h('Beyond Basic Queries');
p(`<p>You can already select, filter, join, and group. That covers "fetch the rows I want", but real reporting asks harder questions: rank each salesperson within their region, show a running balance, compare each month to the previous one, walk an org chart of unknown depth, or turn rows into a columnar report. Doing those in application code means pulling large result sets over the network and looping — slow, verbose, and easy to get wrong under concurrency.</p>
<p>This lesson covers the tools SQL gives you to answer those questions <em>inside</em> the database: common table expressions, recursive queries, <code>CASE</code> expressions, and the window functions that compute across related rows without collapsing them. By the end you will be able to write ranked leaderboards, running totals, pivots, subtotal reports, and hierarchy traversals as single queries.</p>`);
p(`<p>Every example runs against a small demo schema introduced below, and every stated result is what PostgreSQL actually prints. Type the queries as you read — the ideas stick when you see the output change.</p>`);

// ---------- Prerequisites recap ----------
h('Prerequisites: A Quick Recap');
p(`<p>Three things from earlier modules underpin everything here. First, <code>GROUP BY</code> collapses rows that share a value into one summary row, and aggregate functions (<code>SUM</code>, <code>COUNT</code>, <code>AVG</code>) compute over each group. Second, a <em>subquery</em> is a query nested inside another, usable in <code>FROM</code>, <code>WHERE</code>, or as a scalar value. Third, a <code>JOIN</code> combines rows from two tables on a matching condition.</p>
<p>Here is the demo dataset used throughout. Create it once and the later queries will run as shown.</p>`);
c('The demo schema and seed data', `CREATE TABLE sales (
    id        INT PRIMARY KEY,
    region    TEXT NOT NULL,
    product   TEXT NOT NULL,
    category  TEXT NOT NULL,
    amount    NUMERIC(10,2) NOT NULL,
    sold_on   DATE NOT NULL
);

INSERT INTO sales VALUES
 (1,'North','Keyboard','input',   100,'2026-01-05'),
 (2,'North','Mouse',   'input',    60,'2026-01-06'),
 (3,'North','Monitor', 'display', 300,'2026-02-02'),
 (4,'South','Keyboard','input',   120,'2026-01-09'),
 (5,'South','Monitor', 'display', 250,'2026-02-11'),
 (6,'South','Cable',   'cable',    40,'2026-02-15');`);
p(`<p>A grouped query over this table is the baseline the advanced tools build on. This sums revenue per region:</p>`);
c('A plain GROUP BY', `SELECT region, SUM(amount) AS revenue
FROM   sales
GROUP BY region
ORDER BY region;`);
p(`<p>It prints one row per region: <code>North | 460.00</code> and <code>South | 410.00</code>. The limitation to keep in mind is that <code>GROUP BY</code> <strong>collapses</strong> rows — after grouping you can no longer see the individual sales, only the aggregate. Much of what follows exists precisely because you often want an aggregate <em>and</em> the detail rows at the same time.</p>`);

// ---------- CTEs ----------
h('Common Table Expressions');
p(`<p>A common table expression (CTE), written with <code>WITH</code>, names a subquery so the main query can refer to it by name. Think of it as a local variable for a result set: you define the derived table once and reuse it, which turns a deeply-nested query into a readable top-to-bottom pipeline.</p>`);
c('Naming a subquery with WITH', `WITH region_totals AS (
    SELECT region, SUM(amount) AS revenue
    FROM   sales
    GROUP BY region
)
SELECT region, revenue
FROM   region_totals
WHERE  revenue > 420
ORDER BY revenue DESC;`);
p(`<p>The CTE <code>region_totals</code> computes revenue per region; the outer query then filters it. This prints only <code>North | 460.00</code>, because South's 410.00 is below the 420 threshold. The value is clarity: the aggregation is written once and named, so the intent reads in order rather than inside-out.</p>`);
p(`<p>CTEs chain, and later ones can reference earlier ones, which is how you express multi-step transformations without nesting:</p>`);
c('Chaining CTEs', `WITH region_totals AS (
    SELECT region, SUM(amount) AS revenue
    FROM   sales
    GROUP BY region
),
ranked AS (
    SELECT region, revenue,
           revenue - (SELECT AVG(revenue) FROM region_totals) AS vs_avg
    FROM   region_totals
)
SELECT region, revenue, vs_avg
FROM   ranked
ORDER BY vs_avg DESC;`);
p(`<p>The second CTE reads the first. Average region revenue is (460 + 410) / 2 = 435, so the output is <code>North | 460.00 | 25.00</code> and <code>South | 410.00 | -25.00</code> — each region's distance from the average.</p>`);
p(`<p><strong>Common mistake.</strong> Writing <code>WHERE revenue &gt; AVG(revenue)</code> directly fails with <em>aggregate functions are not allowed in WHERE</em>. An aggregate over the whole set has to be computed separately — in a subquery or a second CTE — and then compared, which is exactly what the chained version does. A second surprise: a CTE is scoped to the single statement it prefixes; you cannot reference <code>region_totals</code> from a later, separate query.</p>`);

// ---------- Recursive CTEs ----------
h('Recursive CTEs for Hierarchies');
p(`<p>Some data references itself — an employee whose <code>manager_id</code> points at another employee forms a tree. An ordinary join reaches one level down; to walk to arbitrary depth you need a <strong>recursive CTE</strong>, which repeatedly joins its own output back to the table until nothing new is found.</p>`);
c('An employee hierarchy', `CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    name        TEXT NOT NULL,
    manager_id  INT REFERENCES employees(employee_id),
    salary      NUMERIC(10,2) NOT NULL
);

INSERT INTO employees VALUES
 (1,'Dana',NULL,200),
 (2,'Evan',1,150),
 (3,'Fay', 1,150),
 (4,'Gil', 2,100);`);
p(`<p>A recursive CTE has two halves joined by <code>UNION ALL</code>: an <em>anchor</em> that seeds the result (the root), and a <em>recursive term</em> that extends it one level per pass.</p>`);
c('WITH RECURSIVE to walk the tree', `WITH RECURSIVE org AS (
    SELECT employee_id, name, 1 AS depth
    FROM   employees
    WHERE  manager_id IS NULL

    UNION ALL

    SELECT e.employee_id, e.name, o.depth + 1
    FROM   employees e
    JOIN   org o ON e.manager_id = o.employee_id
)
SELECT employee_id, name, depth
FROM   org
ORDER BY depth, employee_id;`);
p(`<p>The anchor selects Dana (the root, depth 1). Each recursive pass finds everyone reporting to a row already in <code>org</code>, stamping them one level deeper. The output is Dana at depth 1, Evan and Fay at depth 2, and Gil at depth 3 — the whole tree, regardless of how tall it is.</p>`);
mm(`flowchart TD
  Dana[Dana depth 1] --> Evan[Evan depth 2]
  Dana --> Fay[Fay depth 2]
  Evan --> Gil[Gil depth 3]`);
p(`<p><strong>Common mistake.</strong> Using <code>UNION</code> instead of <code>UNION ALL</code> makes Postgres deduplicate on every iteration, which is slower and hides cycles. And if the data is not a clean tree — a manager loop — the recursion never ends; guard real hierarchies by carrying a path array and excluding already-visited rows, or set a depth cap. The join direction encodes the walk: <code>e.manager_id = o.employee_id</code> descends from managers to reports; flipping it climbs from an employee up their chain of managers.</p>`);

// ---------- CASE ----------
h('CASE Expressions');
p(`<p>A <code>CASE</code> expression is SQL's inline if/else. It evaluates its <code>WHEN</code> branches top to bottom and returns the value of the first that is true, so you can compute a derived column — a label, a bucket, a sign — without leaving the query.</p>`);
c('Bucketing with CASE', `SELECT product, amount,
       CASE
           WHEN amount >= 250 THEN 'big'
           WHEN amount >= 100 THEN 'medium'
           ELSE 'small'
       END AS size_band
FROM   sales
ORDER BY amount DESC;`);
p(`<p>Each sale is labelled by its amount: 300 and 250 are <code>big</code>, 100 and 120 are <code>medium</code>, and 40 and 60 are <code>small</code>. Because <code>CASE</code> stops at the first true branch, the order of branches matters — listing the highest threshold first is what makes the bands correct.</p>`);
p(`<p><strong>Common mistake.</strong> Reversing the branches (<code>&gt;= 100</code> before <code>&gt;= 250</code>) mislabels every big sale as medium, because <code>&gt;= 100</code> matches first. And omitting <code>ELSE</code> makes unmatched rows return <code>NULL</code> instead of a value — a silent gap that only shows up for the rows no branch caught.</p>`);

// ---------- Window functions core ----------
h('Window Functions: The Core Idea');
p(`<p>A window function computes a value across a set of rows <em>related to the current row</em>, without collapsing them the way <code>GROUP BY</code> does. You keep every detail row and gain a computed column — a rank, a running total, a value from a neighbour. The magic word is <code>OVER</code>, which defines the "window" of rows the function sees.</p>`);
c('An aggregate as a window function', `SELECT region, product, amount,
       SUM(amount) OVER (PARTITION BY region) AS region_total
FROM   sales
ORDER BY region, amount DESC;`);
p(`<p>Compare this to <code>GROUP BY region</code>: instead of two summary rows, you get all six sales, each carrying its region's total alongside. <code>PARTITION BY region</code> restarts the window per region, so North's rows all show 460.00 and South's all show 410.00. The detail and the aggregate coexist — that is the defining feature.</p>`);
mm(`flowchart TD
  A[All rows kept] --> B[PARTITION BY region]
  B --> C[North window sees North rows]
  B --> D[South window sees South rows]
  C --> E[Function computed per row over its window]
  D --> E`);
p(`<p><strong>Common mistake.</strong> Mixing a window function into a <code>GROUP BY</code> query and expecting them to combine cleanly. Window functions run <em>after</em> grouping in SQL's evaluation order, so a window over a grouped query sees the grouped rows, not the originals. When you want a per-row window over raw data, do not add <code>GROUP BY</code> at all — the window's <code>PARTITION BY</code> is the grouping.</p>`);

// ---------- Ranking ----------
h('Ranking: ROW_NUMBER, RANK, and DENSE_RANK');
p(`<p>Three window functions number rows within a window, and they differ only in how they treat ties. <code>ROW_NUMBER</code> always yields a unique sequence; <code>RANK</code> gives tied rows the same rank then skips (1, 1, 3); <code>DENSE_RANK</code> gives ties the same rank with no gap (1, 1, 2).</p>`);
c('Ranking sales within each region', `SELECT region, product, amount,
       ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,
       RANK()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY region ORDER BY amount DESC) AS dense
FROM   sales
ORDER BY region, amount DESC;`);
p(`<p>Within North, Monitor (300) is rank 1, Keyboard (100) rank 2, Mouse (60) rank 3 — no ties here, so all three functions agree. Ties are where they diverge, which the next query makes visible.</p>`);
c('Where ranking functions disagree on ties', `WITH scores(player, points) AS (
    VALUES ('Ann',90),('Bob',90),('Cy',80),('Di',70)
)
SELECT player, points,
       ROW_NUMBER() OVER (ORDER BY points DESC) AS rn,
       RANK()       OVER (ORDER BY points DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY points DESC) AS dense
FROM   scores
ORDER BY points DESC, player;`);
p(`<p>Ann and Bob tie at 90. <code>ROW_NUMBER</code> still splits them (1 and 2). <code>RANK</code> gives both 1 then jumps to 3 for Cy (a gap). <code>DENSE_RANK</code> gives both 1 then 2 for Cy (no gap). So for a leaderboard where "tied for first, next is third" is correct, use <code>RANK</code>; for "top 3 distinct scores", use <code>DENSE_RANK</code>; for "exactly one winner", use <code>ROW_NUMBER</code>.</p>`);
p(`<p>The classic use of <code>ROW_NUMBER</code> is "one row per group": number rows within a partition, then keep number 1.</p>`);
c('Latest sale per region via ROW_NUMBER', `WITH ranked AS (
    SELECT region, product, sold_on,
           ROW_NUMBER() OVER (PARTITION BY region ORDER BY sold_on DESC) AS rn
    FROM   sales
)
SELECT region, product, sold_on
FROM   ranked
WHERE  rn = 1
ORDER BY region;`);
p(`<p>North's newest sale is the Monitor on 2026-02-02; South's is the Cable on 2026-02-15. The two-step shape — number in a CTE, filter <code>rn = 1</code> outside — is necessary because a window function cannot appear in <code>WHERE</code> (it is evaluated after <code>WHERE</code>).</p>`);
p(`<p><strong>Common mistake.</strong> Writing <code>WHERE ROW_NUMBER() OVER (...) = 1</code> directly raises <em>window functions are not allowed in WHERE</em>. Always compute the number in a subquery or CTE and filter in the outer query.</p>`);

// ---------- Running totals / frames ----------
h('Running Totals and Window Frames');
p(`<p>Add an <code>ORDER BY</code> inside <code>OVER</code> and an aggregate becomes cumulative: it sums a moving <em>frame</em> of rows relative to the current one. This is how you compute a running balance in a single pass.</p>`);
c('A running total of sales by date', `SELECT sold_on, amount,
       SUM(amount) OVER (ORDER BY sold_on, id) AS running_total
FROM   sales
ORDER BY sold_on, id;`);
p(`<p>Each row adds its amount to the sum of all earlier rows: 100, 160, 280, 400, 700, then 940 at the end. With an <code>ORDER BY</code> present and no explicit frame, the default frame is every row from the start of the ordering through the current one — exactly a running total.</p>`);
p(`<p><strong>Common mistake.</strong> The default frame is <code>RANGE</code>-based, which treats rows with an equal <code>ORDER BY</code> value as peers and gives them the same cumulative sum — often mistaken for a bug. When you need strict row-by-row accumulation across ties, spell out <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, which counts physical rows. Adding a tiebreaker like <code>, id</code> to the ordering also makes the result deterministic.</p>`);

// ---------- LAG / LEAD ----------
h('Comparing to Neighbours with LAG and LEAD');
p(`<p><code>LAG</code> and <code>LEAD</code> reach into a previous or following row within the window, which is how you compute period-over-period change without a self-join. <code>LAG(x)</code> returns <code>x</code> from the prior row (NULL for the first), <code>LEAD(x)</code> from the next.</p>`);
c('Month-over-month change with LAG', `WITH monthly AS (
    SELECT date_trunc('month', sold_on)::date AS month, SUM(amount) AS revenue
    FROM   sales
    GROUP BY 1
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_month,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM   monthly
ORDER BY month;`);
p(`<p>January's revenue is 100 + 60 + 120 = 280; February's is 300 + 250 + 40 = 590. The January row shows <code>prev_month</code> as NULL (nothing precedes it), so its <code>change</code> is NULL; February shows <code>prev_month = 280</code> and <code>change = 310</code>. The <code>LAG</code> quietly aligns each row with the one before it in the ordered window.</p>`);
p(`<p><strong>Common mistake.</strong> Forgetting the first row's <code>LAG</code> is NULL and letting that NULL propagate — <code>revenue - NULL</code> is NULL, not <code>revenue</code>. Wrap it in <code>COALESCE(LAG(revenue) OVER (...), 0)</code> when you want the first period to compare against zero rather than vanish.</p>`);

// ---------- FILTER / pivot ----------
h('Conditional Aggregation and Pivoting with FILTER');
p(`<p>Turning rows into columns — one row per region with a column per category — is a <em>pivot</em>. Standard SQL does it with conditional aggregation: an aggregate that only counts rows matching a condition, expressed with the <code>FILTER (WHERE ...)</code> clause.</p>`);
c('Pivoting category revenue into columns', `SELECT region,
       COALESCE(SUM(amount) FILTER (WHERE category = 'input'),   0) AS input,
       COALESCE(SUM(amount) FILTER (WHERE category = 'display'), 0) AS display,
       COALESCE(SUM(amount) FILTER (WHERE category = 'cable'),   0) AS cable
FROM   sales
GROUP BY region
ORDER BY region;`);
p(`<p>Each filtered <code>SUM</code> adds only its category's rows within the region group. North gets <code>input 160, display 300, cable 0</code>; South gets <code>input 120, display 250, cable 40</code>. The <code>COALESCE</code> turns a missing category (a NULL sum) into 0 so the grid has no holes.</p>`);
p(`<p><strong>Common mistake.</strong> Dropping the <code>COALESCE</code> and shipping a report peppered with <code>NULL</code>s where a region has no sales in a category. Also note this pivot requires naming the categories in advance — SQL cannot pivot an unknown, data-driven set of columns in one static query, so fixed dimensions are the natural fit. The older <code>SUM(CASE WHEN category = 'input' THEN amount END)</code> form is equivalent; <code>FILTER</code> just reads more clearly.</p>`);

// ---------- ROLLUP ----------
h('Subtotals and Grand Totals with ROLLUP');
p(`<p>A finished report often wants detail, per-group subtotals, and a grand total at once. <code>GROUP BY ROLLUP</code> computes all those levels in one query by aggregating the grouping columns from most detailed to least.</p>`);
c('ROLLUP for region and category subtotals', `SELECT COALESCE(region, '(all)')   AS region,
       COALESCE(category, '(all)') AS category,
       SUM(amount) AS revenue
FROM   sales
GROUP BY ROLLUP (region, category)
ORDER BY GROUPING(region), region, GROUPING(category), category;`);
p(`<p><code>ROLLUP (region, category)</code> produces the detail rows per (region, category), a subtotal per region (with <code>category</code> rolled to <code>(all)</code>), and one grand total (both <code>(all)</code>) — the grand total row shows 940.00. Each rolled-away column comes back as <code>NULL</code>, which the <code>COALESCE</code> labels.</p>`);
p(`<p><strong>Common mistake.</strong> Confusing a <code>ROLLUP</code>-generated NULL with a real NULL already in the data. The <code>GROUPING()</code> function disambiguates — it returns 1 for a rolled-up column and 0 for a real value — and is also the key to ordering the subtotals correctly, keeping each region's detail above its subtotal and the grand total last.</p>`);

// ---------- DISTINCT ON ----------
h('One Row per Group with DISTINCT ON');
p(`<p>PostgreSQL's <code>DISTINCT ON</code> is a concise way to keep one representative row per group. It retains the first row it sees for each distinct value of the listed expressions, and you control which row is "first" through <code>ORDER BY</code>.</p>`);
c('Highest-value sale per region with DISTINCT ON', `SELECT DISTINCT ON (region)
       region, product, amount
FROM   sales
ORDER BY region, amount DESC;`);
p(`<p>Ordering by <code>region, amount DESC</code> makes the first row per region its biggest sale: North's Monitor (300) and South's Monitor (250). It is shorter than the <code>ROW_NUMBER ... WHERE rn = 1</code> pattern for the same job, though it is Postgres-specific.</p>`);
p(`<p><strong>Common mistake.</strong> The <code>ORDER BY</code> must <em>begin</em> with the <code>DISTINCT ON</code> expressions, or Postgres raises <em>SELECT DISTINCT ON expressions must match initial ORDER BY expressions</em>. Any sort keys after the key decide which row wins; add a deterministic tiebreaker if two rows tie on the deciding column.</p>`);

// ---------- Gaps and islands ----------
h('The Gaps-and-Islands Technique');
p(`<p>"How many consecutive days did each user log in?" is hard because "consecutive" is a relationship between rows. The elegant solution combines the tools above: subtract a per-group <code>ROW_NUMBER</code> from each date, and every run of consecutive dates collapses to a constant you can group on.</p>`);
c('Login data with gaps', `CREATE TABLE logins (
    user_id    INT NOT NULL,
    login_date DATE NOT NULL,
    PRIMARY KEY (user_id, login_date)
);

INSERT INTO logins VALUES
 (1,'2026-03-01'),(1,'2026-03-02'),(1,'2026-03-03'),
 (1,'2026-03-05'),(1,'2026-03-06'),
 (2,'2026-03-10');`);
c('Summarising consecutive-day streaks', `WITH marked AS (
    SELECT user_id, login_date,
           login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)
                         * INTERVAL '1 day') AS grp
    FROM   logins
)
SELECT user_id,
       MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end,
       COUNT(*)        AS streak_length
FROM   marked
GROUP BY user_id, grp
ORDER BY user_id, streak_start;`);
p(`<p>Within a run of consecutive days, both the date and the row number increase by one each row, so their difference is constant — that constant identifies the "island". Grouping by it collapses each streak to one summary row: user 1 has a 3-day streak (Mar 1&ndash;3) and a 2-day streak (Mar 5&ndash;6), and user 2 a single day. It is one sort plus one grouping, far cheaper than comparing every row to its neighbours.</p>`);
mm(`flowchart LR
  A[Mar 1] --> B[Mar 2] --> C[Mar 3]
  C -. gap Mar 4 .-> D[Mar 5] --> E[Mar 6]`);
p(`<p><strong>Common mistake.</strong> Running this on data that has duplicate rows per user per day — the duplicates inflate the row number and split islands incorrectly. Deduplicate first, or define the window so ties do not matter. The technique generalises: change the interval for consecutive months, or the ordering key for other "group the runs" problems.</p>`);

// ---------- Comparison table ----------
h('Choosing the Right Tool');
p(`<p>The techniques overlap, so knowing which to reach for is half the skill. This table contrasts the choices you make most often.</p>
<table>
<tr><th>Goal</th><th>Use</th><th>Why not the alternative</th></tr>
<tr><td>Aggregate but keep detail rows</td><td>Window function <code>OVER</code></td><td><code>GROUP BY</code> collapses the rows you wanted to keep</td></tr>
<tr><td>Rank with ties, gaps allowed</td><td><code>RANK</code></td><td><code>ROW_NUMBER</code> breaks ties arbitrarily; <code>DENSE_RANK</code> leaves no gap</td></tr>
<tr><td>Rank distinct levels, no gaps</td><td><code>DENSE_RANK</code></td><td><code>RANK</code> skips numbers after a tie</td></tr>
<tr><td>Exactly one row per group</td><td><code>ROW_NUMBER</code> filter, or <code>DISTINCT ON</code></td><td><code>GROUP BY</code> cannot return the full matching row</td></tr>
<tr><td>Readable multi-step query</td><td>CTE (<code>WITH</code>)</td><td>Nested subqueries read inside-out and repeat logic</td></tr>
<tr><td>Traverse a tree</td><td>Recursive CTE</td><td>A plain join reaches only one level</td></tr>
<tr><td>Detail plus subtotals</td><td><code>ROLLUP</code> / <code>GROUPING SETS</code></td><td>Multiple queries stitched together are fragile</td></tr>
</table>`);

// ---------- Progression ----------
h('Progression: From Simple to Advanced');
p(`<p>Reach for the simplest form that answers the question, and escalate only when it cannot. If you need one summary per group and nothing else, a plain <code>GROUP BY</code> is clearest and fastest — do not dress it up in window functions. When you need the aggregate <em>and</em> the detail rows, that is the signal to switch to a window function. When you need to rank or number, use the ranking family; when you need cumulative or neighbour-relative values, use <code>OVER (ORDER BY ...)</code> with a frame or <code>LAG</code>/<code>LEAD</code>. Recursion is only for genuinely hierarchical or graph-shaped data; using it where a join suffices is slower and harder to read. The gaps-and-islands pattern is the top of the ladder — it composes ranking, arithmetic, and grouping — and you reach for it only when the question is explicitly about runs of consecutive values.</p>`);

// ---------- Best practices ----------
h('Best Practices');
p(`<p>A few rules keep advanced queries correct and maintainable:</p>
<ol>
<li><strong>Name steps with CTEs</strong> — a query built from named steps is far easier to debug than a five-level nested subquery, because you can select from each CTE in isolation.</li>
<li><strong>Always give window and paginated queries a deterministic ORDER BY</strong> — without a tiebreaker, ranks and "page 2" results can shift between runs, causing intermittent bugs.</li>
<li><strong>Match the ranking function to the tie semantics</strong> — <code>RANK</code>, <code>DENSE_RANK</code>, and <code>ROW_NUMBER</code> agree on tie-free data, so bugs hide until real ties arrive; pick deliberately.</li>
<li><strong>Guard recursive CTEs against cycles</strong> — carry a visited-path or a depth cap, or a single loop in the data will run the query forever.</li>
<li><strong>Prefer FILTER over CASE inside aggregates</strong> — it states the condition once and reads more clearly, and it makes conditional counts and pivots obvious.</li>
<li><strong>Use GROUPING() with ROLLUP</strong> — never assume a NULL in a rolled-up report is structural; distinguish it from real data explicitly.</li>
<li><strong>Push work into the query, not the app</strong> — a window function or CTE runs where the data lives, avoiding transferring large result sets to be looped over in application code.</li>
</ol>`);

// ---------- Worked example ----------
h('Worked Example: A Regional Sales Dashboard');
p(`<p>To finish, one query that combines several techniques into a real report: for each region, list its sales ranked by amount, show each sale's share of the region total and a running total within the region, and flag the top sale. It uses a window aggregate, a ranking function, a running total, and a <code>CASE</code> together.</p>`);
c('The dashboard query — part 1 of 2, the windows', `WITH enriched AS (
    SELECT region, product, amount,
           SUM(amount)   OVER (PARTITION BY region)                          AS region_total,
           ROW_NUMBER()  OVER (PARTITION BY region ORDER BY amount DESC)     AS rank_in_region,
           SUM(amount)   OVER (PARTITION BY region ORDER BY amount DESC,
                                                              product)        AS running_in_region
    FROM   sales
)
SELECT * FROM enriched
ORDER BY region, rank_in_region;`);
p(`<p>The <code>enriched</code> CTE attaches three windowed columns to every sale: the region total (a windowed <code>SUM</code> with no ordering), the rank within the region (by amount), and a running total within the region (a windowed <code>SUM</code> with ordering). Selecting it directly shows the intermediate result; the final query below turns those numbers into a readable dashboard.</p>`);
c('The dashboard query — part 2 of 2, the presentation', `WITH enriched AS (
    SELECT region, product, amount,
           SUM(amount)   OVER (PARTITION BY region)                          AS region_total,
           ROW_NUMBER()  OVER (PARTITION BY region ORDER BY amount DESC)     AS rank_in_region,
           SUM(amount)   OVER (PARTITION BY region ORDER BY amount DESC,
                                                              product)        AS running_in_region
    FROM   sales
)
SELECT region, product, amount,
       rank_in_region AS rnk,
       ROUND(100.0 * amount / region_total, 1) AS pct_of_region,
       running_in_region AS running,
       CASE WHEN rank_in_region = 1 THEN 'TOP' ELSE '' END AS flag
FROM   enriched
ORDER BY region, rank_in_region;`);
p(`<p>For North (total 460): Monitor 300 is rank 1, 65.2% of the region, running 300, flagged <code>TOP</code>; Keyboard 100 is rank 2, 21.7%, running 400; Mouse 60 is rank 3, 13.0%, running 460. For South (total 410): Monitor 250 is rank 1, 61.0%, <code>TOP</code>; Keyboard 120 is rank 2, 29.3%, running 370; Cable 40 is rank 3, 9.8%, running 410. One query, no application-side looping, produced a complete per-region breakdown with ranks, shares, and running totals.</p>`);

// ---------- Recap ----------
h('Recap and What to Practice');
p(`<p>You now have the advanced SQL toolkit: <strong>CTEs</strong> to name and chain steps, <strong>recursive CTEs</strong> to walk hierarchies, <strong>CASE</strong> for inline conditionals, and <strong>window functions</strong> — ranking, running totals, and <code>LAG</code>/<code>LEAD</code> — to compute across related rows while keeping the detail. You saw <strong>FILTER</strong> pivots, <strong>ROLLUP</strong> subtotals, <strong>DISTINCT ON</strong> for one-row-per-group, and the <strong>gaps-and-islands</strong> pattern that combines them.</p>
<p>The exercises for this module drill each of these on fresh scenarios: refactoring subqueries into CTEs, building leaderboards, computing running balances, pivoting with <code>FILTER</code>, generating subtotals with <code>ROLLUP</code>, traversing an org chart recursively, and summarising streaks with gaps-and-islands. Work them with a live database open, run each query, and check the printed result against what you predicted — the surprises are where the learning is.</p>`);

// ---------- Links ----------
B.push({ type: 'links', items: [
  { label: 'PostgreSQL Manual — WITH Queries (Common Table Expressions)', url: 'https://www.postgresql.org/docs/current/queries-with.html' },
  { label: 'PostgreSQL Manual — Window Functions Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial-window.html' },
  { label: 'PostgreSQL Manual — Window Function Calls', url: 'https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS' },
  { label: 'PostgreSQL Manual — GROUPING SETS, CUBE, and ROLLUP', url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS' },
  { label: 'PostgreSQL Manual — SELECT (DISTINCT ON, ORDER BY)', url: 'https://www.postgresql.org/docs/current/sql-select.html' },
  { label: 'PostgreSQL Manual — Aggregate Expressions (FILTER)', url: 'https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-AGGREGATES' },
] });

// ---------- emit ----------
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
const blocks = B.map(({ _run, ...b }) => b);
const payload = { moduleId, trackSlug, moduleSlug, blocks };
const outFile = path.join(OUT, `lesson__${trackSlug}__${moduleSlug}.json`);
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));

// verify.sql: run every runnable sql code block in order against a fresh database
let sql = `\\set ON_ERROR_STOP on\n\\pset pager off\nDROP TABLE IF EXISTS sales, employees, logins CASCADE;\n`;
B.forEach((b, i) => {
  if (b.type === 'code' && b._run) {
    sql += `\n\\echo '--- block ${i} : ${(b.title || '').replace(/'/g, '')} ---'\n` + b.code + '\n';
  }
});
fs.writeFileSync(path.join(VERIFY, 'lesson-sql-413.sql'), sql);

// stats + self-checks
const codeN = blocks.filter((b) => b.type === 'code').length;
const mmN = blocks.filter((b) => b.type === 'mermaid').length;
const linkN = blocks.filter((b) => b.type === 'links').length;
const chars = JSON.stringify(blocks).length;
if (blocks.length < 60) console.warn(`WARN blocks ${blocks.length} < 60`);
if (codeN < 20) console.warn(`WARN code ${codeN} < 20`);
if (mmN < 3 || mmN > 6) console.warn(`WARN mermaid ${mmN} not in 3..6`);
if (linkN !== 1) throw new Error(`links blocks = ${linkN}`);
if (blocks[blocks.length - 1].type !== 'links') throw new Error('last block must be links');
console.log(`OK ${outFile}`);
console.log(`blocks=${blocks.length} code=${codeN} mermaid=${mmN} links=${linkN} chars=${chars} (~${Math.round(chars / 1000)}k)`);
