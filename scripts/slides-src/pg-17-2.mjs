/**
 * pg-17-2 — PostgreSQL · Chapter 17 · Lesson 17.2 "The same queries on three SQL servers" (slide EN, kiểu FU, agent c17, 25/10/2026).
 * Nguồn: content/courses/postgresql/s17-bon-he-csdl.mjs › postgresql-17-2-cung-truy-van-ba-he.
 * Dữ liệu: CT Shop rút gọn (category 12 · product 48 · customer 300 · orders 2000 · order_item 5000), chép từ shop.* và nạp GIỐNG HỆT vào
 * SQL Server 2022 16.0.4305 (DB ctshop), MySQL 8.4.13 (DB ctshop), PostgreSQL 17.11 (DB ctshop, schema ch17).
 * Output thật: video-bai-giang/src/khung/pg/that/pg-17-2{,.mssql,.mysql}.out.txt (kể cả hai phiên song song cho mức cô lập).
 */
import { lamDeck, sql, two, three, box, cards as cards0, steps, flow, hai_phien, vsd } from './_pg-chung.mjs';
import { T, HE, bang3 } from './pg-17-hinh.mjs';

const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);
const col = (...a) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${a.join('')}</div>`;
const t13 = (s) => s.replace('<pre>', '<pre style="font-size:13px;line-height:1.34">');
const t12 = (s) => s.replace('<pre>', '<pre style="font-size:12px;line-height:1.3">');
const t15 = (s) => s.replace('<pre>', '<pre style="font-size:15px;line-height:1.38">');
const t18 = (s) => s.replace('<pre>', '<pre style="font-size:18px;line-height:1.4">');
const nhanCode = (he, s, o = {}) => `<div style="min-width:0"><div class="tcap" style="color:${HE[he].mau}">${HE[he].icon} ${HE[he].ten}</div>${sql(s, { sm: true, ...o }).replace('<pre class="vs sm">', `<pre class="vs sm" style="font-size:${o.fs ?? 13}px">`)}</div>`;

export const deck = { key: 'pg-17-2', code: 'PG 17.2', title: 'The same queries on three SQL servers', sub: 'Where the syntax differs — and where the behaviour differs' };

/* Lược đồ CT Shop rút gọn (SVG). */
const luocDo = () => {
  const b = (x, y, w, t, cols, k) => `<rect data-k="${k}" x="${x}" y="${y}" width="${w}" height="${34 + cols.length * 24}" rx="8" fill="#fff" stroke="#336791" stroke-width="2.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="30" rx="8" fill="#336791"/><text x="${x + w / 2}" y="${y + 21}" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">${t}</text>
  ${cols.map((c, i) => `<text x="${x + 10}" y="${y + 52 + i * 24}" font-size="15" font-family="Menlo,monospace" fill="#333">${c}</text>`).join('')}`;
  const a = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="2.5" marker-end="url(#ld)"/>`;
  return `<svg viewBox="0 0 640 330" width="436" height="225" font-family="Arial">
  <defs><marker id="ld" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  ${b(10, 10, 180, 'customer · 300', ['id', 'email', 'full_name', 'city'], 'bang')}
  ${b(230, 10, 180, 'orders · 2000', ['id', 'customer_id', 'status', 'created_at'], 'bang')}
  ${b(230, 175, 180, 'order_item · 5000', ['order_id', 'product_id', 'qty', 'unit_price'], 'bang')}
  ${b(450, 10, 180, 'product · 48', ['id', 'sku', 'name', 'category_id', 'price', 'attrs (JSON)'], 'bang')}
  ${b(450, 215, 180, 'category · 12', ['id', 'name', 'parent_id'], 'bang')}
  ${a(228, 72, 192, 72)} ${a(320, 173, 320, 140)} ${a(412, 230, 448, 90)} ${a(540, 213, 540, 192)}
</svg>`;
};

export const slides = lamDeck({ chuong: 'Chapter 17 — SQL Server · MySQL · PostgreSQL · MongoDB', bai: '17.2' }, [
  { cover: true, t: 'The same queries<br>on three SQL servers', sub: 'One CT Shop database, loaded identically into<br>SQL Server, MySQL and PostgreSQL.<br>Same numbers — until the behaviour differs.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A real report (revenue by category) run on all three — and how little the SQL changes</li>
<li>The syntax that does change: TOP / LIMIT, date formatting, JSON access</li>
<li>Four <b>behaviours</b> that change without any syntax error:
  transactions around <b>CREATE TABLE</b>, the default <b>isolation</b>, <b>JSON</b> storage, and <b>upsert</b> numbering</li>
<li>A checklist for moving a project from one server to another</li>
</ul>` },

  { t: 'The lab: CT Shop, trimmed to five tables', body: two(col(luocDo(), `<p style="font-size:19px;margin:0">The real CT Shop data from the course labs, copied row for row into all three servers. Same ids, same prices, same 2,000 orders.</p>`),
    col(t13(T('ss', `1> SELECT (SELECT COUNT(*) FROM category) AS cat, …
cat  prod  cust  ord   items
---- ----- ----- ----- -----
  12    48   300  2000  5000`, { title: 'sqlcmd — SQL Server 2022 · ctshop (spacing trimmed)' })),
    t13(T('my', `mysql> SELECT (SELECT COUNT(*) FROM category) AS cat, …
| cat  | prod | cust | ord  | items |
|   12 |   48 |  300 | 2000 |  5000 |`, { title: 'mysql — MySQL 8.4.13 · ctshop' })),
    t13(T('pg', `ctshop=# SELECT (SELECT COUNT(*) FROM category) AS cat, …
 cat | prod | cust | ord  | items
-----+------+------+------+-------
  12 |   48 |  300 | 2000 |  5000`, { title: 'psql (17.11) — ctshop, schema ch17' })),
    box('Types used', 'NVARCHAR · DATETIMEOFFSET · JSON in NVARCHAR(MAX) | VARCHAR · DATETIME · JSON | text · timestamptz · jsonb', 'lam')), 'r46') },

  { t: 'Report 1 — revenue by category: the SQL', body: `${three(
    nhanCode('ss', `SELECT TOP 5 c.name AS category,
  COUNT(DISTINCT o.id) AS orders,
  SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
JOIN product p ON p.id = oi.product_id
JOIN category c ON c.id = p.category_id
WHERE o.status IN ('paid', 'shipped')
  AND o.created_at >=
      '2026-01-01 00:00 +07:00'
GROUP BY c.name
ORDER BY revenue DESC;`, { hl: [1, 10] }),
    nhanCode('my', `SELECT c.name AS category,
  COUNT(DISTINCT o.id) AS orders,
  SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
JOIN product p ON p.id = oi.product_id
JOIN category c ON c.id = p.category_id
WHERE o.status IN ('paid', 'shipped')
  AND o.created_at >= '2026-01-01'
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 5;`, { hl: [9, 12] }),
    nhanCode('pg', `SELECT c.name AS category,
  COUNT(DISTINCT o.id) AS orders,
  SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
JOIN product p ON p.id = oi.product_id
JOIN category c ON c.id = p.category_id
WHERE o.status IN ('paid', 'shipped')
  AND o.created_at >= '2026-01-01'
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 5;`, { hl: [9, 12] }))}
${box('Only two lines differ', '<b>TOP 5</b> vs <b>LIMIT 5</b>, and the date literal: the SQL Server column is DATETIMEOFFSET, so we write the +07:00; MySQL’s DATETIME has no zone (we stored Vietnam time); PostgreSQL reads the literal in the session time zone (Asia/Ho_Chi_Minh).', 'lam')}` },

  { t: 'Report 1 — three servers, identical numbers', body: `${T('ss', `category             orders      revenue
-------------------- ----------- ----------------------------------------
Máy tính cầm tay             216                             225855000.00
Sổ tay                       188                              57982000.00
Giáo trình IT                206                              46403000.00
Bút chì & tẩy                202                              22782000.00
Bút dạ quang                 185                              16507000.00

(5 rows affected)`, { title: 'sqlcmd — SQL Server 2022 (sqlcmd -y 20)' })}
${two(T('my', `+----------------------+--------+--------------+
| category             | orders | revenue      |
+----------------------+--------+--------------+
| Máy tính cầm tay     |    216 | 225855000.00 |
| Sổ tay               |    188 |  57982000.00 |
| Giáo trình IT        |    206 |  46403000.00 |
| Bút chì & tẩy        |    202 |  22782000.00 |
| Bút dạ quang         |    185 |  16507000.00 |
+----------------------+--------+--------------+
5 rows in set (0.07 sec)`, { title: 'mysql — MySQL 8.4.13' }),
    T('pg', `     category     | orders |   revenue
------------------+--------+--------------
 Máy tính cầm tay |    216 | 225855000.00
 Sổ tay           |    188 |  57982000.00
 Giáo trình IT    |    206 |  46403000.00
 Bút chì & tẩy    |    202 |  22782000.00
 Bút dạ quang     |    185 |  16507000.00
(5 rows)`, { title: 'psql (17.11) — ctshop' }))}` },

  { t: 'Dates and JSON: the syntax that changes', body: two(col(
    nhanCode('ss', `SELECT FORMAT(o.created_at, 'yyyy-MM') AS month, …
GROUP BY FORMAT(o.created_at, 'yyyy-MM')
SELECT TOP 3 JSON_VALUE(attrs, '$.brand') AS brand, …`, { hl: [1, 3] }),
    nhanCode('my', `SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS month, …
GROUP BY month
SELECT attrs->>'$.brand' AS brand, … LIMIT 3;`, { hl: [1, 3] }),
    nhanCode('pg', `SELECT to_char(o.created_at, 'YYYY-MM') AS month, …
GROUP BY month
SELECT attrs->>'brand' AS brand, … LIMIT 3;`, { hl: [1, 3] }),
    box('Same idea, three spellings', 'Format a date: <b>FORMAT</b> · <b>DATE_FORMAT</b> · <b>to_char</b>. Read a JSON field: <b>JSON_VALUE(attrs, \'$.brand\')</b> · <b>attrs->>\'$.brand\'</b> · <b>attrs->>\'brand\'</b>. SQL Server also cannot GROUP BY an alias.', '')),
    col(t12(T('ss', `month                revenue
-------------------- -----------
2026-07              61111000.00
2026-08              37076000.00
2026-09              42173000.00
brand                products
-------------------- -----------
Thiên Long                     7
Deli                           6
CT Books                       5`, { title: 'sqlcmd (revenue column trimmed)' })),
    t12(T('my', `| 2026-07 | 61111000.00 |
| 2026-08 | 37076000.00 |
| 2026-09 | 42173000.00 |
| Thiên Long  |        7 |
| Deli        |        6 |
| CT Books    |        5 |`, { title: 'mysql (rows only)' })),
    t12(T('pg', ` 2026-07 | 61111000.00
 2026-08 | 37076000.00
 2026-09 | 42173000.00
 Thiên Long |        7
 Deli       |        6
 CT Books   |        5`, { title: 'psql (rows only)' }))), 'r64') },

  { t: 'Where JSON lives on each server', body: `${bang3([
    ['Column type', 'NVARCHAR(MAX) + CHECK (ISJSON(attrs) = 1)', '<b>JSON</b> — validated, stored in a binary format', '<b>jsonb</b> (binary) or json (text)'],
    ['Read a field', "JSON_VALUE(attrs, '$.brand')", "attrs->>'$.brand'", "attrs->>'brand'"],
    ['“contains” test', 'OPENJSON / JSON_VALUE in WHERE', 'JSON_CONTAINS(attrs, …)', "attrs @> '{\"brand\": \"Deli\"}'"],
    ['Index it', 'computed column + normal index', 'generated column / multi-valued index', '<b>GIN</b> index on the whole document'],
    ['Invalid JSON', 'rejected by our CHECK', 'rejected by the type', 'rejected by the type'],
  ], { fs: 18, w1: 170 })}
${box('Why it matters', 'In PostgreSQL JSON is a first-class type with its own operators and indexes (Chapter 13). In SQL Server 2022 it is text plus functions. That is why many projects that mix fixed columns with flexible attributes — like CT Shop’s <b>product.attrs</b> or the 266 JSON fields of cuongthai.com — pick PostgreSQL.', 'ok')}` },

  { t: 'Same SQL, different behaviour — four tests', to: true, giua: true, body: cards([
    ['1 · CREATE TABLE inside a transaction', 'Does ROLLBACK undo it?'],
    ['2 · Reading a row someone is changing', 'Do you wait, or see the old value?'],
    ['3 · JSON storage', 'Text with a check, or a real type?'],
    ['4 · Upsert and auto numbers', 'Does an update burn an id?'],
  ], 2) + box('No error in any of them', 'Each test runs without a single syntax error on all three servers. Only the result tells you they disagree.', 'do2') },

  { t: 'Test 1 — CREATE TABLE inside a transaction', body: `${sql(`CREATE TABLE audit_log (msg …);              -- before the transaction
BEGIN;  -- (SQL Server: BEGIN TRANSACTION; MySQL: START TRANSACTION)
INSERT INTO audit_log VALUES ('price change');
CREATE TABLE t_ddl (id INT);
INSERT INTO t_ddl VALUES (1);
ROLLBACK;
SELECT COUNT(*) AS audit_rows FROM audit_log;  -- then: does t_ddl exist?`, { sm: true, hl: [4, 6] })}
${three(t18(T('ss', `audit_rows
-----------
          0
t_ddl_exists
------------
        NULL`, { title: 'sqlcmd — all undone ✓' })),
    t18(T('my', `+------------+
| audit_rows |
+------------+
|          1 |
+------------+
+------------+
| t_ddl_rows |
+------------+
|          1 |
+------------+`, { title: 'mysql — NOTHING undone ✗' })),
    t18(T('pg', ` audit_rows
------------
          0
(1 row)

ctshop=# SELECT * FROM t_ddl;
ERROR:  relation "t_ddl"
        does not exist`, { title: 'psql — all undone ✓' })))}` },

  { t: 'Why MySQL kept everything: the implicit commit', body: `${flow([
    { t: 'START TRANSACTION', s: 'a transaction opens', mau: '#00758f' },
    { t: 'INSERT audit_log', s: 'inside the transaction', mau: '#00758f' },
    { t: 'CREATE TABLE', s: 'COMMITS first — silently', mau: '#c0392b' },
    { t: 'INSERT t_ddl', s: 'autocommit: saved at once', mau: '#e08a1e' },
    { t: 'ROLLBACK', s: 'nothing left to undo', mau: '#7a7a7a' },
  ], { h: 150, fs: 16 })}
${two(box('MySQL rule', 'DDL statements (CREATE, ALTER, DROP…) cause an <b>implicit commit</b>: everything before them is committed, and they cannot be rolled back.', 'do2'),
    box('PostgreSQL & SQL Server', 'DDL is <b>transactional</b>: a CREATE TABLE inside BEGIN … ROLLBACK disappears together with the rows around it.', 'ok'))}
${box('Real-world consequence: migrations', 'A migration with 10 steps fails at step 7. On PostgreSQL, run it in one transaction and the database is exactly as before. On MySQL, steps 1–6 stay applied — a half-migrated schema you must repair by hand (Prisma’s docs warn about exactly this).', '')}` },

  { t: 'Test 2 — the default isolation level', body: `${bang3([
    ['Default', 'READ COMMITTED (with locks)', 'REPEATABLE READ', 'READ COMMITTED'],
    ['How readers see a row being changed', 'wait for the writer’s lock', 'read the old version (MVCC)', 'read the old version (MVCC)'],
    ['Setting that changes it', 'READ_COMMITTED_SNAPSHOT (OFF here; ON in Azure SQL)', 'transaction_isolation', 'default_transaction_isolation'],
  ], { fs: 19, w1: 230 })}
${three(t13(T('ss', `1> SELECT name,
2>   is_read_committed_snapshot_on
3> FROM sys.databases
4> WHERE name = 'ctshop';
ctshop      0`, { title: 'sqlcmd (spacing trimmed)' })),
    t13(T('my', `mysql> SELECT @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+`, { title: 'mysql' })),
    t13(T('pg', `ctshop=# SHOW
ctshop-#   default_transaction_isolation;
 default_transaction_isolation
-------------------------------
 read committed`, { title: 'psql' })))}
${box('MVCC in one line', '<b>Multi-Version Concurrency Control</b>: a writer creates a new version of the row; readers keep reading the last committed version, so readers never wait for writers (Chapter 11.2).', 'lam')}` },

  { t: 'Two real sessions: who waits?', body: `${hai_phien([
    ['t0', 'BEGIN; UPDATE product SET price = price + 1000 WHERE id = 1;', '', 'A holds the change, does not commit (sleeps 8 s)'],
    ['t+2s', '', 'SET LOCK_TIMEOUT 3000; SELECT price FROM product WHERE id = 1;', 'B reads the same row'],
    ['SQL Server', '', 'Msg 1222 … Lock request time out period exceeded.', 'B waited 3 s, then gave up', '#fdecec'],
    ['MySQL', '', '5000.00 — 1 row in set (0.00 sec)', 'old value, immediately', '#e6f4f7'],
    ['PostgreSQL', '', '5000.00 — Time: 0.847 ms', 'old value, immediately', '#e8f0f8'],
  ], { fs: 16 })}
${t13(T('ss', `phiên B lúc 20:31:29:
1> SET LOCK_TIMEOUT 3000;
2> SELECT price FROM product WHERE id = 1;
Msg 1222, Level 16, State 51, Server c2538cdfdc92, Line 2
Lock request time out period exceeded.
xong lúc 20:31:33`, { title: 'sqlcmd — session B (real log, timestamps from the run)' }))}` },

  { t: 'SQL Server can behave like PostgreSQL — if you ask', to: true, body: two(col(sql(`ALTER DATABASE ctshop
  SET READ_COMMITTED_SNAPSHOT ON
  WITH ROLLBACK IMMEDIATE;
-- same two sessions again`),
    t15(T('ss', `phiên B lúc 20:31:44:
1> SET LOCK_TIMEOUT 3000;
2> SELECT price FROM product WHERE id = 1;
price
--------------
       5000.00
(1 rows affected)
xong lúc 20:31:44`, { title: 'sqlcmd — session B, now no waiting' }))),
    col(box('What changed', 'With <b>READ_COMMITTED_SNAPSHOT</b> SQL Server keeps row versions in tempdb, so readers get the last committed value instead of waiting — the same idea as PostgreSQL’s MVCC.', 'ok'),
      box('Why it matters when you move', 'Code written on SQL Server often has <b>WITH (NOLOCK)</b> hints or retries for blocking. On PostgreSQL readers never block on writers, so those workarounds are not needed — but you must learn its own rules for writers (Chapter 11).', 'lam')), 'r46') },

  { t: 'Test 4 — upsert and the auto number', giua: true, body: two(col(sql(`-- a tag table with an auto-numbered id and a UNIQUE name
INSERT INTO tag (name, hits) VALUES ('sql', 1);
-- upsert 'sql' twice (MERGE / ON DUPLICATE KEY / ON CONFLICT)
-- …the row exists, so both are UPDATEs: hits 1 → 3
INSERT INTO tag (name, hits) VALUES ('json', 1);
SELECT id, name, hits FROM tag ORDER BY id;`, { sm: true }),
    three(t15(T('ss', ` id  name  hits
--- ----- -----
  1  sql      3
  2  json     1`, { title: 'SQL Server (trimmed)' })),
      t15(T('my', `+----+------+------+
| id | name | hits |
+----+------+------+
|  1 | sql  |    3 |
|  4 | json |    1 |
+----+------+------+`, { title: 'MySQL' })),
      t15(T('pg', ` id | name | hits
----+------+------
  1 | sql  |    3
  4 | json |    1
(2 rows)`, { title: 'PostgreSQL' })))),
    col(box('What happened', 'MySQL and PostgreSQL <b>take a new number first</b>, then discover the conflict and update instead — the numbers 2 and 3 are burnt. SQL Server’s MERGE only takes a number when it really inserts.', 'lam'),
      box('Lesson', 'Gaps in ids are normal (also after ROLLBACK). Never use an auto-number as an invoice counter that must have no gaps.', 'do2')), 'r64') },

  { t: 'Behaviour cheat sheet', body: `${bang3([
    ['CREATE TABLE inside a transaction', 'rolled back ✓', '<span class="do">implicit commit</span>', 'rolled back ✓'],
    ['Default isolation', 'READ COMMITTED + locks', 'REPEATABLE READ', 'READ COMMITTED'],
    ['Reader vs uncommitted writer', '<span class="do">waits</span> (unless RCSI ON)', 'old version', 'old version'],
    ['JSON', 'text + functions', 'JSON type', 'jsonb + operators + GIN'],
    ['Upsert burns ids', 'no (MERGE)', '<span class="do">yes</span>', '<span class="do">yes</span>'],
    ['7 / 2 · text = TEXT (Lesson 0.5)', '3 · equal', '3.5000 · equal', '3 · different'],
  ], { fs: 19, w1: 290 })}
${box('Read it like this', 'Syntax differences are found by the compiler on day one. Behaviour differences are found by your users months later. When you move a project, test the behaviour list — not just whether the SQL runs.', 'lam')}` },

  { t: 'Moving a project between servers: checklist', body: two(steps([
    'Run the <b>same reports</b> on both and compare the numbers (division, rounding, time zones).',
    'Search the code for <b>TOP</b>, <b>ISNULL</b>, <b>+</b> on strings, <b>GETDATE</b>, <b>OUTPUT</b>, <b>MERGE</b>, square brackets, backticks.',
    'Check every <b>text comparison</b>: collation, ILIKE, trailing spaces.',
    'Test migrations that <b>fail halfway</b> — can you roll back?',
    'Load-test two users editing the same rows: blocking vs MVCC.',
    'Don’t trust gapless ids; check JSON queries and indexes.',
  ]), col(box('Tools that help', 'pgloader (MySQL / SQL Server → PostgreSQL data copy) · AWS SCT / Babelfish for SQL Server · your ORM’s migration diff — but none of them checks behaviour for you.', 'lam'),
    box('In this course', 'Lesson 0.5 lists the syntax; this lesson the behaviour; Chapter 11 explains isolation and locks in depth.', 'ok')), 'r64') },

  { t: 'Exercise — predict before you run', to: true, body: two(steps([
    'MySQL: <code class="i">START TRANSACTION; ALTER TABLE product ADD note TEXT; ROLLBACK;</code> — does the column exist?',
    'SQL Server (RCSI OFF): session A updates a row and waits; session B reads it with no LOCK_TIMEOUT. What happens?',
    'PostgreSQL: an ON CONFLICT DO UPDATE runs 5 times on an existing row, then one real insert. Its id is…?',
  ]), `<div data-k="dapan" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · Yes — ALTER TABLE commits implicitly; ROLLBACK cannot undo it.<br>
2 · B waits until A commits or rolls back (default LOCK_TIMEOUT is −1: forever).<br>
3 · Not the next number: each upsert took one value first, so expect a gap of 5.</div>`, 'r64') },

  { t: 'Check yourself', to: true, giua: true, body: `
${steps([
    'Why does PostgreSQL let you wrap a whole migration in BEGIN … COMMIT safely, but MySQL does not?',
    'Under default settings, which of the three makes a reader wait for an uncommitted writer?',
    'Name the SQL Server setting that gives readers the last committed version instead.',
  ])}
<div data-k="dapan3" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · PostgreSQL DDL is transactional; MySQL DDL commits implicitly.<br>
2 · SQL Server (READ COMMITTED with locks).<br>
3 · READ_COMMITTED_SNAPSHOT (on by default in Azure SQL Database).</div>` },

  { t: 'Summary', to: true, body: two(`<ul>
<li>The same report gives the <b>same numbers</b> on all three servers</li>
<li>Syntax changes: TOP/LIMIT, FORMAT/DATE_FORMAT/to_char, JSON_VALUE / ->></li>
<li>Behaviour changes: DDL in transactions, readers vs writers, JSON as a type, burnt ids</li>
<li>Moving servers = test behaviour, not just syntax</li>
</ul>`, col(box('Next — 17.3', 'The other shape: MongoDB documents vs PostgreSQL JSONB vs tables, on the same 2,000 orders — queries, indexes and size.', 'ok'))) },
]);
