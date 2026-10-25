/**
 * pg-07-4 — PostgreSQL · Chapter 7 · Lesson 7.4 "Recursive CTEs: walking a hierarchy" (slide EN, kiểu FU, 25/10/2026, agent c7).
 * Nguồn: content/courses/postgresql/s07-subquery-cte.mjs › postgresql-7-4-recursive-cte. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-07-4.out.txt, schema ch07 + ctshop). Bổ sung: đếm 1..5 (ca nhỏ nhất), từng vòng lặp (bảng làm việc),
 * đi lên thay vì đi xuống, cây thụt lề + SEARCH DEPTH FIRST, UNION vs UNION ALL, hai lỗi hay gặp (thiếu RECURSIVE; varchar vs text),
 * chu trình + ba cách chặn (độ sâu, mảng đã thăm, mệnh đề CYCLE của PG 14+), cây danh mục CT Shop, so sánh SQL Server (MAXRECURSION).
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { orgTree7, iterPic, catTree } from './pg-07-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-07-4', code: 'PG 7.4', title: 'Recursive CTEs: walking a hierarchy', sub: 'WITH RECURSIVE — anchor, step, stop' };

const EMP = tbl(['id', 'name', 'manager_id'], [[1, 'Alice', null], [2, 'Bob', 1], [3, 'Carol', 1], [4, 'Dave', 2], [5, 'Erin', 4]], { cap: 'employee' });
const Q_LEVELS = `WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.level + 1
  FROM employee e JOIN chain c ON e.manager_id = c.id
)
SELECT level, name FROM chain ORDER BY level, name;`;

export const slides = lamDeck({ chuong: 'Chapter 7 — Subqueries & CTEs', bai: '7.4' }, [
  { cover: true, t: 'Recursive CTEs:<br>walking a hierarchy', sub: 'Org charts, category trees, reply threads —<br>one query that follows the chain as deep as it goes.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why a plain JOIN reaches <b>one</b> level and a <b>recursive CTE</b> reaches them <b>all</b></li>
<li>The three parts: <b>anchor</b>, <code class="i">UNION ALL</code>, <b>recursive step</b> — and how it <b>stops</b></li>
<li>Walk <b>down</b> (levels, paths, indented chart) and <b>up</b> (all bosses)</li>
<li>The <b>cycle</b> that loops forever — and <b>three guards</b> including PG 14’s <code class="i">CYCLE</code></li>
<li>A real tree: CT Shop’s <b>category</b> table, and how SQL Server differs</li>
</ul>
${box('Where we are', 'The last lesson of Chapter 7. A CTE that <b>feeds on its own output</b> is the one SQL feature built specifically for <b>hierarchies</b>.', 'lam')}` },

  { t: 'Everyday example first: “who is above me?”', body: `
${two(`<div><p style="font-size:23px;margin:0 0 6px">You ask “who is my manager?” — Dave answers Bob. You ask again: “and Bob’s?” — Alice. Again: “and Alice’s?” — nobody. <b>You repeated the same question until the answer was empty.</b></p><p style="font-size:23px;margin:0">A plain <code class="i">JOIN</code> asks it <b>once</b> (one level up). You cannot write “join to my boss’s boss’s boss…” — you do not know how many times. A recursive CTE <b>repeats the question for you</b>.</p></div>`,
orgTree7({ lv: { Alice: 1, Bob: 2, Carol: 2, Dave: 3, Erin: 4 }, badge: { Alice: 'CEO', Dave: 'reports to Bob' } }), 'r46')}` },

  { t: 'Our table: a tree stored in one table', body: `
${two(EMP, orgTree7({}), 'r46')}
<ul style="font-size:22px;margin:4px 0 0">
<li><code class="i">manager_id</code> points at <code class="i">employee.id</code> — the table <b>refers to itself</b> (a self-reference, lesson 5.3)</li>
<li>Alice has <code class="i">NULL</code> — the <b>root</b>. Depth is <b>unknown</b>: Erin is 4 levels down, tomorrow someone may be 9</li>
</ul>` },

  { t: 'The smallest recursion: count 1 to 5', giua: true, body: `
${zm(run(`WITH RECURSIVE n(i) AS (
  SELECT 1                         -- anchor
  UNION ALL
  SELECT i + 1 FROM n WHERE i < 5  -- step
)
SELECT i FROM n;`, ` i
---
 1
 2
 3
 4
 5
(5 rows)`, { hl: [2, 4, 5], hlOut: [3, 4, 5, 6, 7] }), 1.0)}
<p style="font-size:22px;margin:0">The <b>anchor</b> makes the first row (1). The <b>step</b> reads the row(s) just produced and makes the next (i + 1). When <code class="i">WHERE i &lt; 5</code> returns <b>no row</b>, it stops. Same engine as the org chart — only the data differs.</p>` },

  { t: 'The shape of a recursive CTE', to: true, giua: true, body: `
${cards([['1 · Anchor', 'A plain query for the <b>starting rows</b> — the root, day 1. Runs <b>once</b>.'], ['2 · UNION ALL', 'Glue between the parts. Almost always <b>ALL</b>: plain UNION de-duplicates every round.'], ['3 · Recursive term', 'A query that <b>mentions the CTE by name</b>. Each pass sees <b>only the rows of the previous pass</b>.'], ['4 · Stop', 'No exit clause. It ends when a pass returns <b>zero rows</b> — so a cycle never ends.']], 4)}
${box('Keyword', 'Write <code class="i">WITH <b>RECURSIVE</b></code> as soon as any CTE refers to itself — PostgreSQL insists (T-SQL does not).', 'lam')}` },

  { t: 'Walk down: levels', body: `
${two(sql(Q_LEVELS, { sm: true, hl: [2, 3, 5, 6] }), psql(` level | name
-------+-------
     1 | Alice
     2 | Bob
     2 | Carol
     3 | Dave
     4 | Erin
(5 rows)`, { sm: true, hl: [3, 4, 5, 6, 7] }), 'r64')}
${orgTree7({ lv: { Alice: 1, Bob: 2, Carol: 2, Dave: 3, Erin: 4 }, badge: { Alice: 'level 1', Bob: 'level 2', Carol: 'level 2', Dave: 'level 3', Erin: 'level 4' }, h: 345 }).replace('height="345"', 'height="262"').replace('width="700"', 'width="560"')}` },

  { t: 'What happens, round by round', giua: true, body: `
${iterPic({ rounds: [{ t: 'Round 0 · anchor', rows: ['Alice'], mau: '#336791' }, { t: 'Round 1 · level 2', rows: ['Bob', 'Carol'], mau: '#2f7d4f' }, { t: 'Round 2 · level 3', rows: ['Dave'], mau: '#e08a1e' }, { t: 'Round 3 · level 4', rows: ['Erin'], mau: '#7a5a9a' }, { t: 'Round 4', rows: [], mau: '#c0392b' }], h: 250 })}
<p style="font-size:22px;margin:0">Each round <b>joins the employees to the rows of the previous round only</b> (<code class="i">e.manager_id = c.id</code>): Alice → her reports Bob and Carol → Bob’s report Dave → Dave’s report Erin → <b>nobody reports to Erin</b>, zero rows, stop. The result is every round added together.</p>` },

  { t: 'Build a path as you go down', giua: true, body: `
${zm(run(`WITH RECURSIVE tree AS (
  SELECT id, name, manager_id, name::text AS path
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id,
         t.path || ' > ' || e.name
  FROM employee e JOIN tree t ON e.manager_id = t.id
)
SELECT path FROM tree ORDER BY path;`, `           path
---------------------------
 Alice
 Alice > Bob
 Alice > Bob > Dave
 Alice > Bob > Dave > Erin
 Alice > Carol
(5 rows)`, { hl: [2, 6], hlOut: [3, 4, 5, 6, 7] }), 0.98)}
<p style="font-size:21px;margin:0">Each level <b>appends its own name</b> to the parent’s path — full lineage for every employee. The same trick builds <b>category breadcrumbs</b>, <b>comment threads</b>, “show the whole branch”. Note <code class="i">name::text</code>: the types must match (see the traps).</p>` },

  { t: 'An indented org chart', giua: true, body: `
${zm(run(`WITH RECURSIVE t AS (
  SELECT id, name, 0 AS depth, name::text AS sortkey
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, t.depth + 1,
         t.sortkey || '/' || e.name
  FROM employee e JOIN t ON e.manager_id = t.id
)
SELECT repeat('  ', depth) || name AS org_chart
FROM t ORDER BY sortkey;`, ` org_chart
------------
 Alice
   Bob
     Dave
       Erin
   Carol
(5 rows)`, { hl: [2, 8], hlOut: [3, 4, 5, 6, 7] }), 0.9)}
${box('PostgreSQL 14+: SEARCH DEPTH FIRST', 'Skip the hand-made sort key: add <code class="i">) SEARCH DEPTH FIRST BY name SET ordercol</code> after the CTE and <code class="i">ORDER BY ordercol</code> — same order. <code class="i">SEARCH BREADTH FIRST</code> gives level by level.', 'lam')}` },

  { t: 'Walk UP: all the bosses of Erin', giua: true, body: `
${zm(run(`WITH RECURSIVE up AS (
  SELECT id, name, manager_id, 0 AS steps
  FROM employee WHERE name = 'Erin'
  UNION ALL
  SELECT e.id, e.name, e.manager_id, u.steps + 1
  FROM employee e JOIN up u ON e.id = u.manager_id
)
SELECT steps, name FROM up ORDER BY steps;`, ` steps | name
-------+-------
     0 | Erin
     1 | Dave
     2 | Bob
     3 | Alice
(4 rows)`, { hl: [2, 3, 6], hlOut: [3, 4, 5, 6] }), 1.05)}
<p style="font-size:21px;margin:0">Same query, <b>join flipped</b>: start at one person, and each round takes <code class="i">e.id = u.manager_id</code> — the boss of the previous row. Use it for “breadcrumb to the root”, “is X above Y?”, “who must approve this?”.</p>` },

  { t: 'Subtree size, and UNION vs UNION ALL', body: `
${two(run(`WITH RECURSIVE sub AS (
  SELECT id FROM employee WHERE name = 'Bob'
  UNION ALL
  SELECT e.id FROM employee e
  JOIN sub s ON e.manager_id = s.id
)
SELECT count(*) - 1 AS reports_under_bob
FROM sub;`, ` reports_under_bob
-------------------
                 2
(1 row)`, { hl: [2, 7], hlOut: [3] }), run(`WITH RECURSIVE sub AS (
  SELECT id FROM employee
  WHERE name = 'Alice'
  UNION          -- not ALL
  SELECT e.id FROM employee e
  JOIN sub s ON e.manager_id = s.id
)
SELECT count(*) AS with_union FROM sub;`, ` with_union
------------
          5
(1 row)`, { hl: [4], hlOut: [3] }))}
<p style="font-size:21px;margin:0">Left: <b>2</b> people sit under Bob (the count includes Bob himself, hence <code class="i">− 1</code>). Right: on a clean tree <code class="i">UNION</code> gives the same 5 — but it <b>de-duplicates every round</b> (slower), and on a tree you never have duplicates. Default to <code class="i">UNION ALL</code>; reach for <code class="i">UNION</code> only on <b>graphs</b> where the same node can be reached twice.</p>` },

  { t: 'Two errors you will meet', body: `
${two(`<div><div class="tcap">1 · Forgot the keyword</div>${psql(`WITH chain AS (
  … UNION ALL
  SELECT … FROM employee e JOIN chain c …
)
ERROR:  relation "chain" does not exist
DETAIL: There is a WITH item named "chain",
  but it cannot be referenced from this part
  of the query.
HINT:  Use WITH RECURSIVE, or re-order the
  WITH items to remove forward references.`, { sm: true, hl: [5, 6, 9] })}</div>`,
`<div><div class="tcap">2 · Types differ between anchor and step</div>${psql(`-- anchor: name AS path    (varchar(10))
-- step:   t.path || ' > ' || e.name  (varchar)
ERROR:  recursive query "tree" column 2 has
  type character varying(10) in non-recursive
  term but type character varying overall
HINT:  Cast the output of the non-recursive
  term to the correct type.`, { sm: true, hl: [3, 6, 7] })}</div>`)}
${box('Fix', '1 → write <code class="i">WITH RECURSIVE</code>. 2 → cast the anchor to the widest type: <code class="i">name::text AS path</code> (this is why the earlier slides write <code class="i">::text</code>). Both come up in the <b>first week</b> of using recursion.', 'lam')}` },

  { t: 'The danger: a cycle in the data', body: `
${two(`<div><p style="font-size:23px;margin:0 0 8px">Someone saves a bad row in the admin panel: <b>Alice now reports to Erin</b>. The chain Alice → Bob → Dave → Erin → <b>Alice</b> → Bob → … never reaches a round with zero rows.</p>${psql(`SET statement_timeout = '1s';
WITH RECURSIVE chain AS (… same query …)
SELECT count(*) FROM chain;

ERROR:  canceling statement due to
        statement timeout`, { sm: true, hl: [5, 6] })}</div>`, orgTree7({ lv: { Alice: 1, Bob: 2, Carol: 2, Dave: 3, Erin: 4 }, ring: true }), 'r64')}
${box('Works on your seed data. Takes production down the day a bad row appears.', 'Without a limit, the query keeps eating memory until the connection dies. Always add a guard: three options on the next slides.', 'do2')}` },

  { t: 'Guard 1: a depth limit', giua: true, body: `
${two(sql(`-- (the Alice → Erin cycle is in the data)
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employee WHERE name = 'Alice'
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.level + 1
  FROM employee e JOIN chain c
    ON e.manager_id = c.id
  WHERE c.level < 7
)
SELECT level, name FROM chain ORDER BY level;`, { sm: true, hl: [9] }), psql(` level | name
-------+-------
     1 | Alice
     2 | Bob
     2 | Carol
     3 | Dave
     4 | Erin
     5 | Alice
     6 | Bob
     6 | Carol
     7 | Dave
(9 rows)`, { sm: true, hl: [8, 9, 10, 11] }), 'r64')}
${box('Costs nothing — turns an outage into a result you can notice', 'The loop stops after level 7: Alice appears <b>twice</b> (levels 1 and 5), a visible sign of the cycle. Pick a limit well above any real depth (100 is common). It does not fix the data, but it keeps the server alive.', 'info')}` },

  { t: 'Guard 2: remember the ids you have visited', giua: true, body: `
${two(sql(`WITH RECURSIVE chain AS (
  SELECT id, name, manager_id,
         ARRAY[id] AS visited
  FROM employee WHERE name = 'Alice'
  UNION ALL
  SELECT e.id, e.name, e.manager_id,
         c.visited || e.id
  FROM employee e JOIN chain c
    ON e.manager_id = c.id
  WHERE NOT e.id = ANY (c.visited)
)
SELECT name, visited FROM chain
ORDER BY cardinality(visited);`, { sm: true, hl: [3, 7, 10] }), psql(` name  |  visited
-------+-----------
 Alice | {1}
 Bob   | {1,2}
 Carol | {1,3}
 Dave  | {1,2,4}
 Erin  | {1,2,4,5}
(5 rows)`, { sm: true, hl: [3, 4, 5, 6, 7] }), 'r64')}
${box('A clean cut', 'Carry the ids already seen in an <b>array</b>; refuse to step onto one (<code class="i">NOT e.id = ANY (c.visited)</code>). The cycle is cut where Erin would point back to Alice — 5 correct rows and the array doubles as a <b>path</b>.', 'xanh')}` },

  { t: 'Guard 3: CYCLE (PostgreSQL 14+)', giua: true, body: `
${zm(run(`WITH RECURSIVE chain AS (
  SELECT id, name, manager_id FROM employee
  WHERE name = 'Alice'
  UNION ALL
  SELECT e.id, e.name, e.manager_id
  FROM employee e JOIN chain c ON e.manager_id = c.id
) CYCLE id SET is_cycle USING path
SELECT id, name, is_cycle, path FROM chain;`, ` id | name  | is_cycle |         path
----+-------+----------+-----------------------
  1 | Alice | f        | {(1)}
  2 | Bob   | f        | {(1),(2)}
  3 | Carol | f        | {(1),(3)}
  4 | Dave  | f        | {(1),(2),(4)}
  5 | Erin  | f        | {(1),(2),(4),(5)}
  1 | Alice | t        | {(1),(2),(4),(5),(1)}
(6 rows)`, { hl: [7], hlOut: [8] }), 0.96)}
<p style="font-size:21px;margin:0">The SQL-standard clause does the bookkeeping: it adds <code class="i">is_cycle</code> and a <code class="i">path</code> and <b>stops</b> the branch where a node repeats — you even <b>see</b> the repeat (<code class="i">t</code>). No hand-made array, no <code class="i">NOT … = ANY</code>.</p>` },

  { t: 'A real tree: CT Shop categories', giua: true, body: `
${catTree({ h: 300 })}
${zm(psql(` depth |       breadcrumb
-------+-------------------------
     1 | Bút & mực
     2 | Bút & mực > Bút bi
     2 | Bút & mực > Bút chì & tẩy
     2 | Bút & mực > Bút dạ quang
  … (12 rows in all: 4 roots + 8 children)`, { sm: true, hl: [3, 4, 5, 6] }), 1.1)}
<p style="font-size:21px;margin:0">The <code class="i">category</code> table is the same shape as <code class="i">employee</code>: <code class="i">parent_id</code> is NULL for the 4 roots. The same anchor (<code class="i">WHERE parent_id IS NULL</code>) and step (<code class="i">JOIN cat ON c.parent_id = cat.id</code>) build the <b>breadcrumb</b> of every category.</p>` },

  { t: 'Use it: every product under a category', giua: true, body: `
${zm(run(`\\c ctshop     -- Pens & ink = id 1, children 5, 6, 7
WITH RECURSIVE cat AS (
  SELECT id FROM category WHERE id = 1
  UNION ALL
  SELECT c.id FROM category c JOIN cat ON c.parent_id = cat.id
)
SELECT count(*) AS products_under_pens
FROM product WHERE category_id IN (SELECT id FROM cat);`, ` products_under_pens
---------------------
                  18`, { hl: [3, 4, 5, 8], hlOut: [3] }), 1.05)}
${box('On cuongthai.com', 'Threaded comment replies are exactly this: <code class="i">parent_id</code> points at another comment, and rendering a thread walks the chain with a recursive CTE (from Prisma: <code class="i">prisma.$queryRaw</code> with <code class="i">WITH RECURSIVE</code>). Category trees and nested menus use the identical shape — this CT Shop query lets “Pens & ink” show <b>all 18</b> products of its sub-categories.', 'lam')}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:360px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">WITH chain AS (…)</code> — no keyword</td><td><code class="i">WITH <b>RECURSIVE</b> chain AS (…)</code></td></tr>
<tr><td><code class="i">UNION ALL</code> only</td><td><code class="i">UNION ALL</code> <b>or</b> <code class="i">UNION</code> (de-duplicates)</td></tr>
<tr><td><code class="i">OPTION (MAXRECURSION 100)</code> — stops at 100 by default</td><td><b>No default limit</b> — add your own guard or <code class="i">CYCLE</code></td></tr>
<tr><td>String concat <code class="i">name + ' &gt; ' + …</code></td><td><code class="i">name || ' &gt; ' || …</code> (and cast <code class="i">::text</code>)</td></tr>
<tr><td><code class="i">hierarchyid</code> type for trees</td><td>Plain <code class="i">parent_id</code> + recursion, or the <code class="i">ltree</code> extension</td></tr>
<tr><td>No cycle detection built in</td><td><code class="i">CYCLE … SET … USING …</code> (PG 14+), <code class="i">SEARCH DEPTH/BREADTH FIRST</code></td></tr>
</table>`, 1.15)}
${box('Good news', 'The idea and the anchor / step shape are identical. Add the keyword, add a guard (T-SQL had <code class="i">MAXRECURSION</code> doing it for you).', 'xanh')}` },

  { t: 'Exercise: walk the tree yourself', to: true, giua: true, body: `
<p style="font-size:24px;margin:0">Using <code class="i">employee</code> (Alice, Bob, Carol, Dave, Erin):</p>
<ol style="font-size:24px">
<li>List everyone at <b>depth 3 or deeper</b> with their depth (Alice = 1).</li>
<li>List <b>Dave’s chain of managers</b> up to the root, numbered from 0.</li>
<li>How many people work <b>under Bob</b> at any depth (not counting Bob)?</li>
</ol>
${box('Before you run it — predict', 'Who answers 1? How many rows does 2 return (hint: Dave → Bob → …)? And what must you change in the query to go <b>up</b> instead of down?', 'lam')}
<p class="nho">Pause the video and write the queries yourself.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`WITH RECURSIVE t AS (
  SELECT id, name, 1 AS depth FROM employee
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, t.depth + 1
  FROM employee e JOIN t ON e.manager_id = t.id
)
SELECT name, depth FROM t
WHERE depth >= 3 ORDER BY depth, name;`, ` name | depth
------+-------
 Dave |     3
 Erin |     4
(2 rows)`, { hlOut: [3, 4] }), 0.88)}`,
`${zm(run(`WITH RECURSIVE up AS (
  SELECT id, name, manager_id, 0 AS steps
  FROM employee WHERE name = 'Dave'
  UNION ALL
  SELECT e.id, e.name, e.manager_id, u.steps + 1
  FROM employee e JOIN up u ON e.id = u.manager_id
)
SELECT steps, name FROM up ORDER BY steps;`, ` steps | name
-------+-------
     0 | Dave
     1 | Bob
     2 | Alice
(3 rows)`, { hlOut: [3, 4, 5] }), 0.88)}`)}
<p style="font-size:21px;margin:0">1) Dave 3, Erin 4. 2) Dave → Bob → Alice (3 rows); “up” = the join <code class="i">e.id = u.manager_id</code> and the anchor is the person. 3) <b>2</b> (Dave and Erin): <code class="i">count(*) − 1</code> over the subtree starting at Bob.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol style="font-size:25px">
<li>Name the parts of a recursive CTE and say <b>when it stops</b>.</li>
<li>Why <code class="i">UNION ALL</code> and not <code class="i">UNION</code> for a tree?</li>
<li>What happens if the data has a <b>cycle</b>, and how do you protect against it?</li>
</ol>
${box('Answers', '<b>1.</b> Anchor (start rows) + <code class="i">UNION ALL</code> + recursive term that reads the previous round; stops when a round returns zero rows. <b>2.</b> A tree has no duplicates, so de-duplicating each round is wasted work. <b>3.</b> It never reaches an empty round and runs until memory or the timeout kills it; guard with a depth limit, a visited-ids array, or <code class="i">CYCLE</code> (PG 14+).', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><code class="i">WITH RECURSIVE</code> = <b>anchor</b> + <code class="i">UNION ALL</code> + <b>step</b>; stops at an empty round</li>
<li>Down: levels, paths, indented chart · Up: flip the join to <code class="i">manager_id</code></li>
<li>Always guard against <b>cycles</b>: depth limit, visited array, or <code class="i">CYCLE</code></li>
<li>Chapter 7 in one line: <b>subquery</b> (value / set) → <b>correlated + EXISTS</b> → <b>CTE</b> (named steps) → <b>recursive CTE</b> (hierarchies)</li>
</ul>
${box('Next: Chapter 8 — Window functions', 'Rankings, running totals and “each row with its group” calculations — without collapsing the rows. Then <b>Lab 4</b> combines CTEs and windows on CT Shop.', 'lam')}` },
]);
