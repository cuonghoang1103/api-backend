// SQL module 722 (recursive-ctes-and-complex-data-hierarchies) — 10 exercises. Postgres.
// Shared datasets: emp (org tree w/ salary), bom (bill of materials), edge (DAG), cyc (graph w/ cycle).
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'recursive-ctes-and-complex-data-hierarchies';

const SETUP = `DROP TABLE IF EXISTS emp, bom, edge, cyc CASCADE;
CREATE TABLE emp (id INT PRIMARY KEY, name TEXT, manager_id INT, salary INT);
INSERT INTO emp VALUES
 (1,'CEO',NULL,500),(2,'VP-Eng',1,300),(3,'VP-Sales',1,280),
 (4,'Eng-Lead',2,200),(5,'Eng-1',4,120),(6,'Eng-2',4,110),(7,'Sales-1',3,100);
CREATE TABLE bom (parent TEXT, child TEXT, qty INT);
INSERT INTO bom VALUES
 ('Bike','Wheel',2),('Bike','Frame',1),('Wheel','Tire',1),('Wheel','Rim',1);
CREATE TABLE edge (src INT, dst INT);
INSERT INTO edge VALUES (1,2),(1,3),(2,4),(3,4),(4,5);
CREATE TABLE cyc (src INT, dst INT);
INSERT INTO cyc VALUES (1,2),(2,3),(3,1);`;

const ex = [
  {
    title: 'Generate a Number Series with a Recursive CTE',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['WITH RECURSIVE', 'anchor term', 'recursive term', 'termination condition', 'UNION ALL'],
    prerequisites: ['CTE', 'UNION ALL'],
    tags: ['recursive-cte', 'series', 'iteration', 'termination', 'postgres'],
    problemHtml: `<p>A recursive CTE is SQL's loop, and it is the tool for anything of unknown depth — trees, graphs, chains — that a fixed number of joins cannot handle. It has an <strong>anchor</strong> that produces the first row(s) and a <strong>recursive term</strong> that references the CTE itself to produce the next rows from the previous ones, repeating round after round until the recursive term returns nothing. The simplest way to see the mechanism, with no table at all, is to generate a sequence of numbers.</p>
<p>Write a recursive CTE that produces the integers 1 through 5:</p>
<ul>
<li>The anchor selects <code>1 AS n</code>.</li>
<li>The recursive term selects <code>n + 1</code> from the CTE <code>WHERE n &lt; 5</code> — the condition that stops the recursion.</li>
<li>Combine the two halves with <code>UNION ALL</code> and select <code>n</code> ordered ascending.</li>
</ul>
<p>The <code>WHERE n &lt; 5</code> is the termination guard: without it the recursion never ends. The scaffold shows the two halves to complete.</p>`,
    inputSpec: 'No tables needed — the series is generated purely by the recursion.',
    outputSpec: 'Rows n = 1, 2, 3, 4, 5.',
    constraints: 'Use WITH RECURSIVE with an anchor (SELECT 1) and a recursive term (n + 1) joined by UNION ALL. The termination condition WHERE n < 5 must be present.',
    examplesJson: [
      { input: 'anchor SELECT 1, recursive SELECT n+1 WHERE n < 5', output: 'n: 1, 2, 3, 4, 5', explanation: 'The anchor gives 1; each pass adds one until n reaches 5, when WHERE n < 5 stops it.' },
      { input: 'changing the guard to WHERE n < 3', output: 'n: 1, 2, 3', explanation: 'The termination condition controls how many rows the recursion produces.' },
    ],
    hintsJson: [
      'A recursive CTE is a loop: a starting row, and a rule to make the next from the last.',
      'The anchor is SELECT 1 AS n; the recursive term reads the CTE and adds one.',
      'Join the two halves with UNION ALL (not UNION).',
      'The WHERE n < 5 in the recursive term is what stops the loop.',
    ],
    solution: `-- The anchor seeds n = 1; the recursive term reads the previous rows and adds one,
-- and WHERE n < 5 is the termination guard (without it the recursion never ends).
WITH RECURSIVE nums AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 5
)
SELECT n FROM nums ORDER BY n;`,
    solutionExplanationHtml: `<p>A recursive CTE runs in rounds. The <strong>anchor</strong> (<code>SELECT 1 AS n</code>) executes once and seeds the working table with a single row. Then the <strong>recursive term</strong> executes repeatedly: each round it reads the rows produced by the <em>previous</em> round (referenced as <code>nums</code>), computes <code>n + 1</code>, and the <code>WHERE n &lt; 5</code> filters out anything that would exceed 5. When a round produces no new rows — here when <code>n</code> reaches 5 and <code>5 &lt; 5</code> is false — the recursion stops and all accumulated rows are returned.</p>
<p>The termination condition is the whole game. Omit the <code>WHERE n &lt; 5</code> and the recursive term always produces a new, larger number, so the recursion never terminates; PostgreSQL will run until it errors or is cancelled. Every recursive CTE needs a guaranteed stopping point, whether a value bound like this or the natural exhaustion of a finite hierarchy. Use <code>UNION ALL</code> rather than <code>UNION</code>: <code>UNION</code> deduplicates on every round, which is slower and, for hierarchies, can mask problems. This number-generator is the "hello world" of recursion, but the same anchor-plus-recursive-term shape drives every tree and graph traversal in this module — the only thing that changes is that the recursive term joins back to a real table instead of doing arithmetic. For plain integer ranges in production you would normally use <code>generate_series(1, 5)</code>; the recursive version is here to expose the mechanism.</p>`,
    check: `WITH RECURSIVE nums AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 5) SELECT n FROM nums ORDER BY n;`,
  },
  {
    title: 'List All Descendants of a Node',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['downward traversal', 'self-referencing table', 'depth tracking', 'subtree', 'join to CTE'],
    prerequisites: ['WITH RECURSIVE', 'self join'],
    tags: ['recursive-cte', 'hierarchy', 'descendants', 'subtree', 'postgres'],
    problemHtml: `<p>The most common recursive query walks a self-referencing table downward: from a starting node to all of its descendants, at any depth. The <code>emp</code> table has <code>manager_id</code> pointing at another employee, forming a tree; "everyone under VP-Eng" is a downward traversal.</p>
<p>List the entire subtree under employee <code>id = 2</code> (VP-Eng), including VP-Eng, with each person's depth relative to VP-Eng:</p>
<ul>
<li>The anchor selects the starting node (<code>id = 2</code>) at <code>depth = 1</code>.</li>
<li>The recursive term joins <code>emp</code> to the CTE on <code>emp.manager_id = cte.id</code>, adding <code>depth + 1</code>.</li>
<li>Return <code>id</code>, <code>name</code>, <code>depth</code>, ordered by <code>depth</code> then <code>id</code>.</li>
</ul>
<p>Only VP-Eng's part of the tree should appear — not the CEO or the sales side. The scaffold shows the anchor and recursive term.</p>`,
    inputSpec: 'The emp tree: CEO(1) manages VP-Eng(2) and VP-Sales(3); VP-Eng manages Eng-Lead(4); Eng-Lead manages Eng-1(5) and Eng-2(6); VP-Sales manages Sales-1(7).',
    outputSpec: 'Subtree under id 2: VP-Eng(2, depth 1), Eng-Lead(4, depth 2), Eng-1(5, depth 3), Eng-2(6, depth 3).',
    constraints: 'Anchor on id = 2; join emp.manager_id = cte.id to descend. Do not include nodes outside VP-Eng\'s subtree.',
    examplesJson: [
      { input: 'start at id 2 (VP-Eng)', output: 'VP-Eng d1, Eng-Lead d2, Eng-1 d3, Eng-2 d3', explanation: 'The traversal descends from VP-Eng: to Eng-Lead, then to the two engineers.' },
      { input: 'the CEO (id 1) and sales side', output: 'excluded', explanation: 'They are not under VP-Eng, so the anchored subtree does not reach them.' },
    ],
    hintsJson: [
      'Start from the chosen node, then repeatedly find everyone whose manager is already in the result.',
      'Anchor: SELECT id, name, 1 AS depth FROM emp WHERE id = 2.',
      'Recursive term: JOIN emp e ON e.manager_id = cte.id, with depth + 1.',
      'Descending uses manager_id = cte.id (children point up to the parent already found).',
    ],
    solution: `WITH RECURSIVE sub AS (
    SELECT id, name, 1 AS depth
    FROM   emp
    WHERE  id = 2
    UNION ALL
    SELECT e.id, e.name, s.depth + 1
    FROM   emp e
    JOIN   sub s ON e.manager_id = s.id
)
SELECT id, name, depth
FROM   sub
ORDER BY depth, id;`,
    solutionExplanationHtml: `<p>The anchor picks the single starting node (VP-Eng, <code>id = 2</code>) at depth 1. The recursive term then finds everyone whose <code>manager_id</code> equals an id already discovered — so the first round finds Eng-Lead (whose manager is VP-Eng), the next round finds Eng-1 and Eng-2 (whose manager is Eng-Lead), and the round after finds nothing, ending the recursion. Because the traversal only ever follows <code>manager_id</code> links downward from the seed, it stays within VP-Eng's subtree and never touches the CEO or the sales branch.</p>
<p>The join direction is what makes this a <em>downward</em> traversal: <code>e.manager_id = s.id</code> reads "employee <code>e</code> reports to someone <code>s</code> we have already found", pulling children in. Flip it to <code>e.id = s.manager_id</code> and you would walk <em>upward</em> to ancestors instead — the same table, opposite direction, covered in a later exercise. The <code>depth</code> column is accumulated by adding one on each recursive step, giving each node its distance from the seed, which is useful for indentation and level-based filtering. This anchored-subtree pattern answers "everything under X": an org unit, a folder and its contents, a comment and its replies. Note that changing the anchor to <code>WHERE manager_id IS NULL</code> would start at the root and return the whole tree.</p>`,
    diagramMermaid: `flowchart TD
  VPE[VP-Eng depth 1] --> EL[Eng-Lead depth 2]
  EL --> E1[Eng-1 depth 3]
  EL --> E2[Eng-2 depth 3]`,
    check: `WITH RECURSIVE sub AS (SELECT id, name, 1 AS depth FROM emp WHERE id = 2 UNION ALL SELECT e.id, e.name, s.depth + 1 FROM emp e JOIN sub s ON e.manager_id = s.id) SELECT id, name, depth FROM sub ORDER BY depth, id;`,
  },
  {
    title: 'Build a Breadcrumb Path from Root to Each Node',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['path accumulation', 'string concatenation in recursion', 'root-to-node path', 'ordering by path', 'breadcrumb'],
    prerequisites: ['recursive downward traversal', 'string concatenation'],
    tags: ['recursive-cte', 'path', 'breadcrumb', 'hierarchy', 'postgres'],
    problemHtml: `<p>Displaying a hierarchy often needs the full path to each node — a breadcrumb like <code>CEO &gt; VP-Eng &gt; Eng-Lead</code>. You build it by carrying an accumulating string through the recursion: the anchor starts the path with the root's name, and each recursive step appends the child's name to the parent's path. Because the string grows as you descend, every node ends up carrying the names of all its ancestors in order — the breadcrumb the UI shows.</p>
<p>For the whole <code>emp</code> tree starting at the root (<code>manager_id IS NULL</code>), produce each employee's root-to-node path:</p>
<ul>
<li>The anchor selects the root with <code>path = name</code>.</li>
<li>The recursive term appends the child: <code>path || ' &gt; ' || e.name</code>.</li>
<li>Return <code>id</code>, <code>name</code>, <code>path</code>, ordered by <code>path</code>.</li>
</ul>
<p>Because the path is a string, ordering by it groups each branch together. The scaffold shows the path accumulation to complete.</p>`,
    inputSpec: 'The full emp tree rooted at CEO (id 1).',
    outputSpec: "Each node's path: CEO -> 'CEO'; VP-Eng -> 'CEO > VP-Eng'; Eng-Lead -> 'CEO > VP-Eng > Eng-Lead'; Eng-1 -> 'CEO > VP-Eng > Eng-Lead > Eng-1'; etc.",
    constraints: 'Accumulate the path with string concatenation in the recursive term. Start the anchor path at the root name. Order by the path string.',
    examplesJson: [
      { input: 'the root CEO', output: "path 'CEO'", explanation: 'The anchor initialises the path to just the root name.' },
      { input: 'Eng-Lead (under VP-Eng under CEO)', output: "path 'CEO > VP-Eng > Eng-Lead'", explanation: 'Each recursive step appends the current node to its parent path, building the breadcrumb.' },
    ],
    hintsJson: [
      'Carry a growing string down the tree, appending each node as you descend.',
      'Anchor: SELECT id, name, name AS path FROM emp WHERE manager_id IS NULL.',
      "Recursive term: t.path || ' > ' || e.name to append the child.",
      'Order the final result by path to keep each branch together.',
    ],
    solution: `WITH RECURSIVE tree AS (
    SELECT id, name, name::text AS path
    FROM   emp
    WHERE  manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, t.path || ' > ' || e.name
    FROM   emp e
    JOIN   tree t ON e.manager_id = t.id
)
SELECT id, name, path
FROM   tree
ORDER BY path;`,
    solutionExplanationHtml: `<p>The path is accumulated as the recursion descends. The anchor initialises it to the root's own name (<code>name::text AS path</code> — the cast keeps the column type <code>text</code> so later concatenation is unambiguous). Each recursive step takes the parent's already-built path and appends <code>' &gt; ' || e.name</code>, so a node three levels deep carries the names of all its ancestors in order. This is the standard way to render breadcrumbs, materialised paths, and indented tree views directly from SQL.</p>
<p>Ordering by the <code>path</code> string is a neat trick: because every descendant's path begins with its ancestor's path, sorting alphabetically by path lists each branch contiguously and in tree order — a depth-first listing for free. Two things to watch. First, string paths assume names (or ids) that sort sensibly and do not contain the separator; for robustness people often use an array (<code>path || e.id</code> building an <code>int[]</code>) instead of a delimited string, which avoids separator collisions and supports array operators. Second, the accumulated path also doubles as a cycle guard: you can add <code>WHERE e.id &lt;&gt; ALL(string_to_array(t.path, ' &gt; ')::...)</code> style checks, though an array path makes that cleaner. Storing such a path column (a "materialised path") is one classic alternative to recursive queries for read-heavy trees, trading write complexity for fast reads.</p>`,
    check: `WITH RECURSIVE tree AS (SELECT id, name, name::text AS path FROM emp WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, t.path || ' > ' || e.name FROM emp e JOIN tree t ON e.manager_id = t.id) SELECT id, name, path FROM tree ORDER BY path;`,
  },
  {
    title: 'Walk Upward to a Node\'s Chain of Managers',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['upward traversal', 'ancestors', 'reverse join direction', 'management chain', 'recursion'],
    prerequisites: ['recursive downward traversal', 'self join'],
    tags: ['recursive-cte', 'ancestors', 'upward', 'hierarchy', 'postgres'],
    problemHtml: `<p>The mirror image of finding descendants is walking <em>up</em> the tree to a node's ancestors — an employee's entire management chain, a folder's parents, a comment's thread up to the root. The only change from a downward traversal is the direction of the recursive join: instead of "who reports to the found node", you ask "who is the found node's manager". Everything else — the anchor, the accumulation, the termination — stays the same.</p>
<p>Return the management chain of employee <code>id = 5</code> (Eng-1), from Eng-1 up to the CEO:</p>
<ul>
<li>The anchor selects the starting node (<code>id = 5</code>).</li>
<li>The recursive term joins <code>emp</code> to the CTE on <code>emp.id = cte.manager_id</code> — i.e. find the current node's manager.</li>
<li>Return <code>id</code>, <code>name</code> in the order visited (Eng-1 first, CEO last); add a <code>level</code> counter to make the order explicit.</li>
</ul>
<p>The join direction is reversed from downward traversal. The scaffold shows the recursive term to complete.</p>`,
    inputSpec: 'The emp tree; Eng-1(5) reports to Eng-Lead(4), who reports to VP-Eng(2), who reports to CEO(1).',
    outputSpec: 'The chain from Eng-1 upward: Eng-1(5, level 1), Eng-Lead(4, level 2), VP-Eng(2, level 3), CEO(1, level 4).',
    constraints: 'Join emp.id = cte.manager_id to ascend (find the parent). Anchor on id = 5. Track a level so the visiting order is explicit.',
    examplesJson: [
      { input: 'start at Eng-1 (id 5)', output: 'Eng-1 (l1), Eng-Lead (l2), VP-Eng (l3), CEO (l4)', explanation: 'Each step follows manager_id up one level until the CEO, whose manager is NULL, ends the chain.' },
      { input: 'the recursive join emp.id = cte.manager_id', output: 'finds the current node\'s manager', explanation: 'Matching a row whose id equals the current manager_id walks upward to the parent.' },
    ],
    hintsJson: [
      'Ancestors means going up: from a node to its manager, then that manager\'s manager.',
      'Anchor on the starting employee (id = 5).',
      'Recursive term: JOIN emp e ON e.id = cte.manager_id (the parent of the current node).',
      'The chain ends naturally at the CEO because their manager_id is NULL.',
    ],
    solution: `WITH RECURSIVE chain AS (
    SELECT id, name, manager_id, 1 AS level
    FROM   emp
    WHERE  id = 5
    UNION ALL
    SELECT e.id, e.name, e.manager_id, c.level + 1
    FROM   emp e
    JOIN   chain c ON e.id = c.manager_id
)
SELECT id, name, level
FROM   chain
ORDER BY level;`,
    solutionExplanationHtml: `<p>Walking upward is the same recursion as walking downward with the join reversed. The anchor is the starting employee (Eng-1). The recursive term matches an employee <code>e</code> whose <code>id</code> equals the current row's <code>manager_id</code> — that is, the current node's <em>parent</em> — so each step climbs one level: Eng-1 → Eng-Lead → VP-Eng → CEO. The recursion ends naturally when it reaches the CEO, because the CEO's <code>manager_id</code> is <code>NULL</code> and no employee has <code>id = NULL</code>, so the next round finds nothing.</p>
<p>Contrast the two directions explicitly: downward traversal joins <code>e.manager_id = cte.id</code> ("who reports to the found node"), while upward traversal joins <code>e.id = cte.manager_id</code> ("who is the found node's manager"). Getting this backwards is the most common mistake and produces either the wrong set or an immediate empty result. The <code>level</code> counter makes the visiting order explicit and is handy for "how many levels up is my manager". Upward traversals are naturally bounded by the tree height, so they are cheap and rarely need a cycle guard in a clean hierarchy — though if the data could contain a management loop (A reports to B reports to A), the same path-array guard used for graphs applies. This pattern answers "the chain of custody / approval hierarchy / ancestry" for any parent-pointer structure.</p>`,
    check: `WITH RECURSIVE chain AS (SELECT id, name, manager_id, 1 AS level FROM emp WHERE id = 5 UNION ALL SELECT e.id, e.name, e.manager_id, c.level + 1 FROM emp e JOIN chain c ON e.id = c.manager_id) SELECT id, name, level FROM chain ORDER BY level;`,
  },
  {
    title: 'Roll Up Subtree Salary Totals',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['subtree aggregation', 'recursion then GROUP BY', 'manager-descendant pairs', 'rollup', 'org totals'],
    prerequisites: ['downward traversal', 'GROUP BY', 'aggregate functions'],
    tags: ['recursive-cte', 'rollup', 'aggregation', 'hierarchy', 'postgres'],
    problemHtml: `<p>"What is the total salary of everyone under each manager, including indirect reports?" needs both recursion and aggregation. The trick is to first expand the tree into <strong>(manager, descendant)</strong> pairs — pairing every node with all of its descendants and itself — then <code>GROUP BY</code> the manager and sum.</p>
<p>For every employee who is a manager of a subtree, compute the total salary of that whole subtree (the manager plus all direct and indirect reports):</p>
<ul>
<li>Build a recursive CTE <code>chain(mgr, emp)</code>: the anchor pairs each employee with themselves (<code>id AS mgr, id AS emp</code>); the recursive term extends each pair down to the next level (<code>e.manager_id = chain.emp</code>).</li>
<li>Join <code>chain</code> to <code>emp</code> on the <code>emp</code> id to get each descendant's salary, then <code>GROUP BY mgr</code> and <code>SUM(salary)</code>.</li>
<li>Return the manager's <code>id</code>, <code>name</code>, and <code>subtree_salary</code>, ordered by <code>id</code>.</li>
</ul>
<p>The CEO's subtree total should be the sum of all salaries. The scaffold shows the pairing CTE to complete.</p>`,
    inputSpec: 'The emp tree with salaries: CEO 500, VP-Eng 300, VP-Sales 280, Eng-Lead 200, Eng-1 120, Eng-2 110, Sales-1 100.',
    outputSpec: 'Subtree salary per manager: CEO(1)=1610 (all), VP-Eng(2)=730 (300+200+120+110), Eng-Lead(4)=430 (200+120+110), VP-Sales(3)=380 (280+100), and leaves equal their own salary (Eng-1=120, Eng-2=110, Sales-1=100).',
    constraints: 'Pair each node with itself in the anchor, then extend down. Group by the manager to sum descendant salaries. Do not double count by joining incorrectly.',
    examplesJson: [
      { input: 'manager VP-Eng (id 2)', output: 'subtree_salary 730', explanation: 'VP-Eng (300) + Eng-Lead (200) + Eng-1 (120) + Eng-2 (110) = 730.' },
      { input: 'the CEO (id 1)', output: 'subtree_salary 1610', explanation: 'The CEO\'s subtree is the whole company, so it sums every salary.' },
    ],
    hintsJson: [
      'To total a subtree, first list every (manager, descendant-including-self) pair, then group and sum.',
      'Anchor: SELECT id AS mgr, id AS emp FROM emp — every node pairs with itself.',
      'Recursive term: JOIN emp e ON e.manager_id = chain.emp, keeping the same mgr but a deeper emp.',
      'Then JOIN emp on the emp column to get salary, GROUP BY mgr, SUM(salary).',
    ],
    solution: `WITH RECURSIVE chain AS (
    SELECT id AS mgr, id AS emp
    FROM   emp
    UNION ALL
    SELECT c.mgr, e.id
    FROM   chain c
    JOIN   emp e ON e.manager_id = c.emp
)
SELECT c.mgr AS id, m.name, SUM(e.salary) AS subtree_salary
FROM   chain c
JOIN   emp e ON e.id = c.emp
JOIN   emp m ON m.id = c.mgr
GROUP BY c.mgr, m.name
ORDER BY c.mgr;`,
    solutionExplanationHtml: `<p>The key idea is to flatten the tree into <strong>ancestor-descendant pairs</strong> before aggregating. The anchor pairs every employee with themselves (<code>mgr = emp = id</code>), which captures the "including self" part and ensures leaves get their own salary. The recursive term keeps the <code>mgr</code> fixed while extending <code>emp</code> one level deeper each round (<code>e.manager_id = c.emp</code>), so after the recursion completes, <code>chain</code> contains one row for every (manager, descendant) relationship in the whole tree — VP-Eng paired with VP-Eng, Eng-Lead, Eng-1, and Eng-2, for instance.</p>
<p>Once you have those pairs, the aggregation is ordinary: join each <code>emp</code> descendant to <code>emp</code> for its salary, group by the manager, and sum. VP-Eng's four pairs sum to 730; the CEO, whose subtree is the entire company, sums to 1610. The reason this works where a simple join would not is that a plain self-join only reaches one level; the recursion reaches <em>all</em> levels, and pairing-then-grouping avoids the double counting you would get if you tried to sum during the traversal. The <code>m.name</code> join is just to label the manager. This "transitive closure then aggregate" pattern is the general recipe for any subtree rollup — headcount, cost, file sizes under a folder — and is far cleaner than attempting to accumulate sums inside the recursive term, which is error-prone because a node can be reached only once per path but its total must include every descendant exactly once.</p>`,
    check: `WITH RECURSIVE chain AS (SELECT id AS mgr, id AS emp FROM emp UNION ALL SELECT c.mgr, e.id FROM chain c JOIN emp e ON e.manager_id = c.emp) SELECT c.mgr AS id, m.name, SUM(e.salary) AS subtree_salary FROM chain c JOIN emp e ON e.id = c.emp JOIN emp m ON m.id = c.mgr GROUP BY c.mgr, m.name ORDER BY c.mgr;`,
  },
  {
    title: 'Explode a Bill of Materials',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['bill of materials', 'quantity multiplication', 'recursive explosion', 'base parts', 'aggregation'],
    prerequisites: ['downward traversal', 'GROUP BY'],
    tags: ['recursive-cte', 'bom', 'manufacturing', 'multiply', 'postgres'],
    problemHtml: `<p>A bill of materials (BOM) is a hierarchy where each assembly is made of sub-assemblies and parts, each with a quantity. "Exploding" a BOM means computing how many of each base part are needed to build the top item — which requires <strong>multiplying</strong> quantities as you descend, not just listing nodes.</p>
<p>The <code>bom</code> table has <code>(parent, child, qty)</code> rows: a <code>Bike</code> needs 2 <code>Wheel</code> and 1 <code>Frame</code>; a <code>Wheel</code> needs 1 <code>Tire</code> and 1 <code>Rim</code>. Compute the total quantity of each <strong>base part</strong> (a part that is never itself a parent) needed for one Bike:</p>
<ul>
<li>The anchor selects the Bike's direct children with their quantities.</li>
<li>The recursive term multiplies: for each child that is itself a parent, its components' quantities are multiplied by the accumulated quantity (<code>n.qty * b.qty</code>).</li>
<li>Keep only base parts (children that never appear in the <code>parent</code> column), <code>GROUP BY</code> the part, and <code>SUM</code> the quantities.</li>
</ul>
<p>Two wheels each needing one tire means two tires. The scaffold shows the multiplying recursive term.</p>`,
    inputSpec: 'bom: (Bike,Wheel,2), (Bike,Frame,1), (Wheel,Tire,1), (Wheel,Rim,1). Base parts (never a parent): Frame, Tire, Rim.',
    outputSpec: 'For one Bike: Frame 1, Rim 2, Tire 2 (each wheel contributes one tire and one rim, and there are two wheels).',
    constraints: 'Multiply quantities along the path (n.qty * b.qty). Restrict the output to base parts (child NOT IN (SELECT parent FROM bom)). Sum per part.',
    examplesJson: [
      { input: 'Bike needs 2 Wheel; each Wheel needs 1 Tire', output: 'Tire total 2', explanation: 'The tire quantity is multiplied by the number of wheels: 2 * 1 = 2.' },
      { input: 'the base parts of a Bike', output: 'Frame 1, Rim 2, Tire 2', explanation: 'Frame is a direct part (1); Rim and Tire come two each through the two wheels.' },
    ],
    hintsJson: [
      'Exploding a BOM multiplies quantities down the tree, unlike a plain node listing.',
      'Anchor: SELECT child, qty FROM bom WHERE parent = \'Bike\'.',
      'Recursive term: JOIN bom b ON b.parent = n.child, quantity = n.qty * b.qty.',
      'Filter to base parts with child NOT IN (SELECT parent FROM bom), then GROUP BY child and SUM(qty).',
    ],
    solution: `WITH RECURSIVE needs AS (
    SELECT child, qty
    FROM   bom
    WHERE  parent = 'Bike'
    UNION ALL
    SELECT b.child, n.qty * b.qty
    FROM   needs n
    JOIN   bom b ON b.parent = n.child
)
SELECT child AS part, SUM(qty) AS total
FROM   needs
WHERE  child NOT IN (SELECT parent FROM bom)
GROUP BY child
ORDER BY child;`,
    solutionExplanationHtml: `<p>The difference between a BOM explosion and an ordinary tree walk is <em>multiplication</em>. The anchor lists the top item's direct components with their quantities (2 Wheel, 1 Frame). The recursive term then descends into any component that is itself an assembly and multiplies: for each Wheel (quantity 2), its Tire (quantity 1) contributes <code>2 * 1 = 2</code> tires, and likewise 2 rims. This carrying-forward of the accumulated quantity is why a plain <code>JOIN</code> or a listing query cannot solve it — you must scale each level's quantities by the path above it.</p>
<p>The <code>needs</code> CTE ends up containing both intermediate assemblies (Wheel, qty 2) and base parts (Tire 2, Rim 2, Frame 1). The final query keeps only <strong>base parts</strong> — those that never appear in the <code>parent</code> column, i.e. cannot be broken down further — and sums per part, because a base part can be reached through multiple sub-assemblies and its total is the sum of all those contributions. Two real-world extensions to know: a component that appears under several parents (a screw used in many places) is naturally summed correctly by this pattern; and a genuine BOM must guard against cycles (an assembly that transitively contains itself is a data error), which the path-array guard from the graph exercises handles. This explosion is the foundation of manufacturing requirements planning, recipe scaling, and any "total leaf resources" computation over a weighted hierarchy.</p>`,
    check: `WITH RECURSIVE needs AS (SELECT child, qty FROM bom WHERE parent = 'Bike' UNION ALL SELECT b.child, n.qty * b.qty FROM needs n JOIN bom b ON b.parent = n.child) SELECT child AS part, SUM(qty) AS total FROM needs WHERE child NOT IN (SELECT parent FROM bom) GROUP BY child ORDER BY child;`,
  },
  {
    title: 'Traverse a Graph Safely with a Cycle Guard',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['graph traversal', 'cycle detection', 'path array', 'infinite recursion prevention', 'visited set'],
    prerequisites: ['recursive traversal', 'arrays'],
    tags: ['recursive-cte', 'graph', 'cycle', 'path-array', 'postgres'],
    problemHtml: `<p>Trees cannot cycle, but general graphs can — node A links to B links to C links back to A. A naive recursive traversal of such a graph never terminates, because it keeps re-following the loop. The fix is to carry the <strong>path</strong> of visited nodes as an array and refuse to revisit a node already on the path.</p>
<p>The <code>cyc</code> table is a directed graph with edges <code>1&rarr;2</code>, <code>2&rarr;3</code>, <code>3&rarr;1</code> — a cycle. Starting from node 1, list the nodes reachable by walking forward <strong>without revisiting</strong>:</p>
<ul>
<li>The anchor starts at node 1 with a path array <code>ARRAY[1]</code>.</li>
<li>The recursive term follows edges to <code>dst</code>, but only where <code>dst</code> is <strong>not already</strong> in the path (<code>NOT dst = ANY(path)</code>), appending <code>dst</code> to the path.</li>
<li>Return the visited node and its path, ordered by the path.</li>
</ul>
<p>Without the guard this query would loop forever. The scaffold shows the path-array guard to complete.</p>`,
    inputSpec: 'cyc is a directed graph with a cycle: 1->2, 2->3, 3->1.',
    outputSpec: 'From node 1, visiting without revisiting: node 1 (path {1}), node 2 (path {1,2}), node 3 (path {1,2,3}). The edge 3->1 is skipped because 1 is already on the path, so the recursion terminates.',
    constraints: 'Carry a path array and add NOT dst = ANY(path) to the recursive term. Without this guard the recursion is infinite. Append each new node to the path.',
    examplesJson: [
      { input: 'start at node 1, edges 1->2->3->1', output: 'visit 1 {1}, 2 {1,2}, 3 {1,2,3}', explanation: 'The walk follows 1->2->3, then 3->1 is blocked because 1 is already visited, ending the recursion.' },
      { input: 'removing the NOT dst = ANY(path) guard', output: 'infinite recursion (never terminates)', explanation: 'Without the visited check the query re-follows the 3->1->2->3 loop forever.' },
    ],
    hintsJson: [
      'A graph can loop, so a plain recursion never stops — you must track where you have been.',
      'Carry the visited nodes as an array: anchor path is ARRAY[start].',
      'In the recursive term, only follow an edge whose dst is NOT already in the path.',
      'PostgreSQL: NOT dst = ANY(path) tests membership; append with path || dst.',
    ],
    solution: `WITH RECURSIVE walk AS (
    SELECT 1 AS node, ARRAY[1] AS path
    UNION ALL
    SELECT c.dst, w.path || c.dst
    FROM   walk w
    JOIN   cyc c ON c.src = w.node
    WHERE  NOT c.dst = ANY(w.path)
)
SELECT node, path
FROM   walk
ORDER BY path;`,
    solutionExplanationHtml: `<p>The path array is a running record of every node visited on the way to the current one. The anchor seeds it with the start node (<code>ARRAY[1]</code>). The recursive term follows outgoing edges (<code>c.src = w.node</code>) but adds the crucial guard <code>NOT c.dst = ANY(w.path)</code>: it will only step to a node that is not already on the path, and it appends each new node with <code>w.path || c.dst</code>. So the walk goes 1 → 2 → 3, and when it tries 3 → 1, the guard sees 1 is already in <code>{1,2,3}</code> and rejects the edge, leaving the recursive term with no new rows and terminating the query.</p>
<p>Without that guard the recursion is genuinely infinite — it would follow 1 → 2 → 3 → 1 → 2 → … forever, and PostgreSQL would run until cancelled or out of memory. This is the single most important safety rule for recursive queries over anything that is not a guaranteed tree: <em>always</em> carry a visited-set (an array here) and exclude already-seen nodes, or impose a depth cap. The array approach doubles as useful output — the <code>path</code> column shows exactly how each node was reached, which is the basis for path-reconstruction and shortest-path queries. PostgreSQL 14+ also offers built-in <code>CYCLE</code> and <code>SEARCH</code> clauses on recursive CTEs that automate cycle detection, but the explicit path-array technique is portable and makes the mechanism visible. The same pattern underlies social-graph reachability, dependency resolution, and routing.</p>`,
    diagramMermaid: `flowchart LR
  N1[Node 1] --> N2[Node 2] --> N3[Node 3]
  N3 -. edge to 1 blocked .-> N1`,
    check: `WITH RECURSIVE walk AS (SELECT 1 AS node, ARRAY[1] AS path UNION ALL SELECT c.dst, w.path || c.dst FROM walk w JOIN cyc c ON c.src = w.node WHERE NOT c.dst = ANY(w.path)) SELECT node, path FROM walk ORDER BY path;`,
  },
  {
    title: 'Compute Reachability in a Directed Graph',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['transitive closure', 'reachable set', 'DISTINCT nodes', 'directed graph', 'recursion'],
    prerequisites: ['graph traversal', 'DISTINCT'],
    tags: ['recursive-cte', 'graph', 'reachability', 'transitive-closure', 'postgres'],
    problemHtml: `<p>"Which nodes can I get to from here?" is the reachability (transitive closure) question, and it underlies dependency analysis, permission propagation, and impact assessment. In a directed acyclic graph you follow every outgoing edge, collecting all nodes reachable at any distance from the start. Because a node can be reached by several different paths, you return the <strong>distinct</strong> set of nodes rather than one row per path.</p>
<p>The <code>edge</code> table is a DAG: <code>1&rarr;2</code>, <code>1&rarr;3</code>, <code>2&rarr;4</code>, <code>3&rarr;4</code>, <code>4&rarr;5</code>. List every node reachable from node 1:</p>
<ul>
<li>The anchor selects node 1's direct targets.</li>
<li>The recursive term follows further edges from each reached node.</li>
<li>Return the <strong>distinct</strong> reachable nodes, ordered.</li>
</ul>
<p>Node 4 is reachable via two paths (through 2 and through 3) but should appear once. The scaffold shows the traversal to complete.</p>`,
    inputSpec: 'edge is a DAG: 1->2, 1->3, 2->4, 3->4, 4->5.',
    outputSpec: 'Nodes reachable from 1: 2, 3, 4, 5 (4 is reached by two paths but listed once via DISTINCT).',
    constraints: 'Return DISTINCT reachable nodes. The graph is acyclic so a cycle guard is optional, but DISTINCT is needed because node 4 is reached twice.',
    examplesJson: [
      { input: 'from node 1 in the DAG', output: 'reachable: 2, 3, 4, 5', explanation: 'Following all edges from 1 reaches 2 and 3 directly, then 4 (via both), then 5.' },
      { input: 'node 4 reached via 1->2->4 and 1->3->4', output: 'appears once', explanation: 'DISTINCT collapses the two paths to node 4 into a single row.' },
    ],
    hintsJson: [
      'Reachability follows every outgoing edge, collecting all nodes at any distance.',
      'Anchor: SELECT dst FROM edge WHERE src = 1.',
      'Recursive term: JOIN edge e ON e.src = reached.node to step further.',
      'Wrap the result in SELECT DISTINCT because a node can be reached by multiple paths.',
    ],
    solution: `WITH RECURSIVE reach AS (
    SELECT dst AS node
    FROM   edge
    WHERE  src = 1
    UNION ALL
    SELECT e.dst
    FROM   reach r
    JOIN   edge e ON e.src = r.node
)
SELECT DISTINCT node
FROM   reach
ORDER BY node;`,
    solutionExplanationHtml: `<p>Reachability collects the transitive closure of the "can step to" relation. The anchor takes node 1's immediate targets (2 and 3). The recursive term then follows outgoing edges from each already-reached node — from 2 to 4, from 3 to 4, from 4 to 5 — accumulating every node touchable from the start. The result is the set {2, 3, 4, 5}: everything reachable from node 1 at any number of hops.</p>
<p>The <code>DISTINCT</code> is the detail that matters here. Node 4 is reached by two different paths (<code>1&rarr;2&rarr;4</code> and <code>1&rarr;3&rarr;4</code>), so with <code>UNION ALL</code> it appears twice in <code>reach</code>; wrapping the final select in <code>DISTINCT</code> collapses it to one row. It is tempting to use <code>UNION</code> in the recursive CTE itself to deduplicate as you go, and for a graph that can revisit nodes that is even a mild performance help — but on a graph with cycles, <code>UNION</code> alone is <em>not</em> a safe cycle guard (it dedupes final rows but the recursion can still loop through paths that produce the same node with different intermediate state), so the explicit path-array guard from the previous exercise remains the correct defense against non-termination. Here the graph is acyclic, so no guard is needed and <code>DISTINCT</code> on the outside is enough. Reachability underlies dependency analysis ("what depends on this module"), access propagation, and impact analysis.</p>`,
    check: `WITH RECURSIVE reach AS (SELECT dst AS node FROM edge WHERE src = 1 UNION ALL SELECT e.dst FROM reach r JOIN edge e ON e.src = r.node) SELECT DISTINCT node FROM reach ORDER BY node;`,
  },
  {
    title: 'Find the Shortest Hop Count to Each Node',
    difficulty: 'HARD', estimatedMinutes: 45, points: 25,
    concepts: ['shortest path', 'BFS with recursion', 'MIN hops', 'level tracking', 'graph distance'],
    prerequisites: ['reachability', 'graph traversal', 'aggregation'],
    tags: ['recursive-cte', 'graph', 'shortest-path', 'bfs', 'postgres'],
    problemHtml: `<p>Beyond "can I reach it", the next question is "how far". The minimum number of hops from a start node to each reachable node is a breadth-first distance. A recursive CTE naturally explores by increasing depth, so tracking the hop count and taking the <strong>minimum</strong> per node gives the shortest distance.</p>
<p>Using the <code>edge</code> DAG (<code>1&rarr;2</code>, <code>1&rarr;3</code>, <code>2&rarr;4</code>, <code>3&rarr;4</code>, <code>4&rarr;5</code>), compute the fewest hops from node 1 to every reachable node:</p>
<ul>
<li>The anchor sets node 1's direct targets at <code>hops = 1</code>.</li>
<li>The recursive term follows further edges, adding 1 to <code>hops</code>, guarding against revisiting with a path array (the graph is a DAG here, but the guard keeps it safe).</li>
<li>Group by node and take <code>MIN(hops)</code>, returning <code>node</code>, <code>min_hops</code>, ordered by node.</li>
</ul>
<p>Node 4 is reachable in 2 hops by either path. The scaffold shows the hop-counting traversal.</p>`,
    inputSpec: 'edge DAG: 1->2, 1->3, 2->4, 3->4, 4->5.',
    outputSpec: 'Minimum hops from node 1: node 2 -> 1, node 3 -> 1, node 4 -> 2, node 5 -> 3.',
    constraints: 'Track hops in the recursion and take MIN(hops) per node. Use a path array guard for safety. Do not assume the first path found is the shortest without MIN.',
    examplesJson: [
      { input: 'node 4 via 1->2->4 or 1->3->4', output: 'min_hops 2', explanation: 'Both paths to node 4 are length 2, so the minimum is 2.' },
      { input: 'node 5 via 1->..->4->5', output: 'min_hops 3', explanation: 'The shortest route to 5 is three edges (1 to 4 in two hops, then 4 to 5).' },
    ],
    hintsJson: [
      'The recursion explores deeper each round; attach a hop counter and minimise per node.',
      'Anchor: node 1\'s targets at hops = 1, path ARRAY[1, dst].',
      'Recursive term: hops + 1, and NOT e.dst = ANY(path) to stay safe.',
      'GROUP BY node, MIN(hops) collapses multiple paths to the shortest.',
    ],
    solution: `WITH RECURSIVE bfs AS (
    SELECT dst AS node, 1 AS hops, ARRAY[1, dst] AS path
    FROM   edge
    WHERE  src = 1
    UNION ALL
    SELECT e.dst, b.hops + 1, b.path || e.dst
    FROM   bfs b
    JOIN   edge e ON e.src = b.node
    WHERE  NOT e.dst = ANY(b.path)
)
SELECT node, MIN(hops) AS min_hops
FROM   bfs
GROUP BY node
ORDER BY node;`,
    solutionExplanationHtml: `<p>A recursive CTE expands outward one edge-length at a time, so the <code>hops</code> counter — set to 1 in the anchor and incremented on each recursive step — records the length of the path by which each node was reached. Because a node can be reached by several paths of different lengths, the query enumerates all of them and then takes <code>MIN(hops)</code> per node to get the shortest. Node 4 is reached in 2 hops by both <code>1&rarr;2&rarr;4</code> and <code>1&rarr;3&rarr;4</code>, so its minimum is 2; node 5 is 3 hops away.</p>
<p>The path-array guard (<code>NOT e.dst = ANY(b.path)</code>) is included for safety even though this particular graph is acyclic — on a cyclic graph it prevents the infinite loop, and it never hurts on a DAG. The crucial correctness point is the <code>MIN</code>: a recursive CTE does <em>not</em> guarantee it visits the shortest path first, so you cannot simply take the first hop count you see for a node; you must enumerate reachable paths and minimise. This is essentially breadth-first search expressed declaratively, and it gives unweighted shortest distance. For <em>weighted</em> shortest paths (edges with costs), the same shape works by summing edge weights instead of counting hops and taking <code>MIN(cost)</code>, though for large graphs a purpose-built algorithm (or PostgreSQL's <code>pgRouting</code> extension) outperforms a recursive CTE. As a declarative solution to "degrees of separation" and "minimum steps between states", this pattern is both compact and correct.</p>`,
    check: `WITH RECURSIVE bfs AS (SELECT dst AS node, 1 AS hops, ARRAY[1, dst] AS path FROM edge WHERE src = 1 UNION ALL SELECT e.dst, b.hops + 1, b.path || e.dst FROM bfs b JOIN edge e ON e.src = b.node WHERE NOT e.dst = ANY(b.path)) SELECT node, MIN(hops) AS min_hops FROM bfs GROUP BY node ORDER BY node;`,
  },
  {
    title: 'Build an Indented Org Chart with Headcount Rollup',
    difficulty: 'HARD', estimatedMinutes: 55, points: 30,
    concepts: ['combined recursion', 'indentation by depth', 'subtree headcount', 'ordered tree output', 'capstone'],
    prerequisites: ['downward traversal', 'subtree rollup', 'string functions'],
    tags: ['recursive-cte', 'org-chart', 'rollup', 'capstone', 'postgres'],
    problemHtml: `<p>This capstone combines several techniques into a report a manager would actually read: an indented org chart, in tree order, where each person's row also shows the <strong>headcount of their subtree</strong> (themselves plus all direct and indirect reports). It needs a downward traversal for the indentation and order, and a subtree rollup for the counts.</p>
<p>Produce, for the whole <code>emp</code> tree:</p>
<ul>
<li>A downward traversal from the root carrying <code>depth</code> and a sortable <code>path</code> array (of ids) so rows come out in tree order.</li>
<li>An indented label: <code>repeat('  ', depth - 1) || name</code>.</li>
<li>A <code>subtree_headcount</code> for each person = the number of employees in their subtree including themselves, computed with a correlated recursive count (or a join to the ancestor-descendant pairs).</li>
<li>Return the indented <code>label</code> and <code>subtree_headcount</code>, in tree order (order by the path array).</li>
</ul>
<p>The CEO's row should show a headcount of 7; a leaf shows 1. The scaffold shows both pieces to combine.</p>`,
    inputSpec: 'The full emp tree (7 employees, 4 levels).',
    outputSpec: 'Indented rows in tree order. Headcounts: CEO 7; VP-Eng 4 (self + Eng-Lead + Eng-1 + Eng-2); Eng-Lead 3; VP-Sales 2; leaves (Eng-1, Eng-2, Sales-1) 1 each.',
    constraints: 'Use a recursive traversal with a path array for tree ordering and depth for indentation. Compute the subtree headcount via the ancestor-descendant pairing. Combine both in one query.',
    examplesJson: [
      { input: 'the VP-Eng row', output: 'label "  VP-Eng", subtree_headcount 4', explanation: 'VP-Eng is at depth 2 (one indent) and their subtree is VP-Eng, Eng-Lead, Eng-1, Eng-2 = 4.' },
      { input: 'a leaf like Sales-1', output: 'subtree_headcount 1', explanation: 'A leaf has no reports, so its subtree is just itself.' },
    ],
    hintsJson: [
      'Two computations combine: a tree-ordered traversal (depth + path) and a per-node subtree count.',
      'Traversal: carry path = parent.path || id so ordering by path yields tree order; depth for indentation.',
      'Headcount: reuse the ancestor-descendant pairing (each node with all descendants incl. self), grouped and counted.',
      'Join the traversal to the counts on the node id, then order by the path array.',
    ],
    solution: `WITH RECURSIVE tree AS (
    SELECT id, name, 1 AS depth, ARRAY[id] AS path
    FROM   emp
    WHERE  manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, t.depth + 1, t.path || e.id
    FROM   emp e
    JOIN   tree t ON e.manager_id = t.id
),
pairs AS (
    SELECT id AS mgr, id AS emp
    FROM   emp
    UNION ALL
    SELECT p.mgr, e.id
    FROM   pairs p
    JOIN   emp e ON e.manager_id = p.emp
),
counts AS (
    SELECT mgr, COUNT(*) AS headcount
    FROM   pairs
    GROUP BY mgr
)
SELECT repeat('  ', t.depth - 1) || t.name AS label,
       c.headcount AS subtree_headcount
FROM   tree t
JOIN   counts c ON c.mgr = t.id
ORDER BY t.path;`,
    solutionExplanationHtml: `<p>The capstone stitches three recursive/aggregate pieces together. The <code>tree</code> CTE is a downward traversal that carries two things: <code>depth</code> for indentation and a <code>path</code> array of ancestor ids for ordering. Sorting by that array yields a proper depth-first tree order, because each child's path extends its parent's — the same idea as the string breadcrumb earlier, but an integer array sorts cleanly and avoids separator issues. The indented label is then just <code>repeat('  ', depth - 1) || name</code>, giving two spaces of indent per level.</p>
<p>The <code>pairs</code> CTE is the ancestor-descendant expansion from the salary rollup, pairing every node with itself and all descendants; grouping it in <code>counts</code> yields each node's subtree headcount (CEO 7, VP-Eng 4, and so on down to 1 for leaves). The final query joins the ordered tree to the counts on the node id, so every row gets both its indented position and its rollup. This is why the two techniques are complementary: the traversal gives <em>where</em> each node sits and in what order to print it, while the pairing-and-grouping gives the <em>aggregate</em> over each node's subtree — you cannot get both from a single traversal without either re-walking per node or accumulating incorrectly. The result reads like an actual org chart with team sizes. The same combination — ordered traversal plus subtree aggregate — produces file-tree views with folder sizes, category trees with product counts, and any "outline with rollup totals" report, all in one declarative query with no procedural code.</p>`,
    diagramMermaid: `flowchart TD
  A[tree CTE depth and path] --> D[join on node id]
  B[pairs CTE ancestor descendant] --> C[counts group by mgr]
  C --> D
  D --> E[indented label with subtree headcount]`,
    check: `WITH RECURSIVE tree AS (SELECT id, name, 1 AS depth, ARRAY[id] AS path FROM emp WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, t.depth + 1, t.path || e.id FROM emp e JOIN tree t ON e.manager_id = t.id), pairs AS (SELECT id AS mgr, id AS emp FROM emp UNION ALL SELECT p.mgr, e.id FROM pairs p JOIN emp e ON e.manager_id = p.emp), counts AS (SELECT mgr, COUNT(*) AS headcount FROM pairs GROUP BY mgr) SELECT repeat('  ', t.depth - 1) || t.name AS label, c.headcount AS subtree_headcount FROM tree t JOIN counts c ON c.mgr = t.id ORDER BY t.path;`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
const clean = ex.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Write the recursive CTE described above.\nWITH RECURSIVE /* name */ AS (\n    -- anchor: the starting row(s)\n    UNION ALL\n    -- recursive term: reference the CTE to produce the next rows\n)\nSELECT /* ... */;` }],
  solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: e.solution }],
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let sql = `\\set ON_ERROR_STOP on\n\\pset pager off\n` + SETUP + '\n';
ex.forEach((e, i) => { sql += `\n\\echo '===== EX ${i + 1}: ${e.title.replace(/'/g, '')} ====='\n` + e.check + '\n'; });
fs.writeFileSync(path.join(VERIFY, `sql-722.sql`), sql);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error('need 10');
parsed.exercises.forEach((e, i) => {
  if (e.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} ${e.difficulty}`);
  if (e.problemHtml.length < 900) throw new Error(`problemHtml<900 ${e.title} (${e.problemHtml.length})`);
  if (e.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${e.title}`);
  if (e.hintsJson.length < 4) throw new Error(`<4 hints ${e.title}`);
  if (e.examplesJson.length < 2) throw new Error(`<2 ex ${e.title}`);
  const sl = e.solutionCodeJson.map((f) => f.code).join('').length;
  if (sl < 205) throw new Error(`sol<205 ${e.title} (${sl})`);
});
console.log(`OK ${parsed.exercises.length} -> ${trackSlug}__${moduleSlug}.json`);
