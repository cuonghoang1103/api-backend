\set ON_ERROR_STOP on
\pset pager off
DROP TABLE IF EXISTS emp, bom, edge, cyc CASCADE;
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
INSERT INTO cyc VALUES (1,2),(2,3),(3,1);

\echo '===== EX 1: Generate a Number Series with a Recursive CTE ====='
WITH RECURSIVE nums AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 5) SELECT n FROM nums ORDER BY n;

\echo '===== EX 2: List All Descendants of a Node ====='
WITH RECURSIVE sub AS (SELECT id, name, 1 AS depth FROM emp WHERE id = 2 UNION ALL SELECT e.id, e.name, s.depth + 1 FROM emp e JOIN sub s ON e.manager_id = s.id) SELECT id, name, depth FROM sub ORDER BY depth, id;

\echo '===== EX 3: Build a Breadcrumb Path from Root to Each Node ====='
WITH RECURSIVE tree AS (SELECT id, name, name::text AS path FROM emp WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, t.path || ' > ' || e.name FROM emp e JOIN tree t ON e.manager_id = t.id) SELECT id, name, path FROM tree ORDER BY path;

\echo '===== EX 4: Walk Upward to a Nodes Chain of Managers ====='
WITH RECURSIVE chain AS (SELECT id, name, manager_id, 1 AS level FROM emp WHERE id = 5 UNION ALL SELECT e.id, e.name, e.manager_id, c.level + 1 FROM emp e JOIN chain c ON e.id = c.manager_id) SELECT id, name, level FROM chain ORDER BY level;

\echo '===== EX 5: Roll Up Subtree Salary Totals ====='
WITH RECURSIVE chain AS (SELECT id AS mgr, id AS emp FROM emp UNION ALL SELECT c.mgr, e.id FROM chain c JOIN emp e ON e.manager_id = c.emp) SELECT c.mgr AS id, m.name, SUM(e.salary) AS subtree_salary FROM chain c JOIN emp e ON e.id = c.emp JOIN emp m ON m.id = c.mgr GROUP BY c.mgr, m.name ORDER BY c.mgr;

\echo '===== EX 6: Explode a Bill of Materials ====='
WITH RECURSIVE needs AS (SELECT child, qty FROM bom WHERE parent = 'Bike' UNION ALL SELECT b.child, n.qty * b.qty FROM needs n JOIN bom b ON b.parent = n.child) SELECT child AS part, SUM(qty) AS total FROM needs WHERE child NOT IN (SELECT parent FROM bom) GROUP BY child ORDER BY child;

\echo '===== EX 7: Traverse a Graph Safely with a Cycle Guard ====='
WITH RECURSIVE walk AS (SELECT 1 AS node, ARRAY[1] AS path UNION ALL SELECT c.dst, w.path || c.dst FROM walk w JOIN cyc c ON c.src = w.node WHERE NOT c.dst = ANY(w.path)) SELECT node, path FROM walk ORDER BY path;

\echo '===== EX 8: Compute Reachability in a Directed Graph ====='
WITH RECURSIVE reach AS (SELECT dst AS node FROM edge WHERE src = 1 UNION ALL SELECT e.dst FROM reach r JOIN edge e ON e.src = r.node) SELECT DISTINCT node FROM reach ORDER BY node;

\echo '===== EX 9: Find the Shortest Hop Count to Each Node ====='
WITH RECURSIVE bfs AS (SELECT dst AS node, 1 AS hops, ARRAY[1, dst] AS path FROM edge WHERE src = 1 UNION ALL SELECT e.dst, b.hops + 1, b.path || e.dst FROM bfs b JOIN edge e ON e.src = b.node WHERE NOT e.dst = ANY(b.path)) SELECT node, MIN(hops) AS min_hops FROM bfs GROUP BY node ORDER BY node;

\echo '===== EX 10: Build an Indented Org Chart with Headcount Rollup ====='
WITH RECURSIVE tree AS (SELECT id, name, 1 AS depth, ARRAY[id] AS path FROM emp WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, t.depth + 1, t.path || e.id FROM emp e JOIN tree t ON e.manager_id = t.id), pairs AS (SELECT id AS mgr, id AS emp FROM emp UNION ALL SELECT p.mgr, e.id FROM pairs p JOIN emp e ON e.manager_id = p.emp), counts AS (SELECT mgr, COUNT(*) AS headcount FROM pairs GROUP BY mgr) SELECT repeat('  ', t.depth - 1) || t.name AS label, c.headcount AS subtree_headcount FROM tree t JOIN counts c ON c.mgr = t.id ORDER BY t.path;
