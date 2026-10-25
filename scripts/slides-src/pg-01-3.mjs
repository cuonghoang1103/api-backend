/**
 * pg-01-3 — PostgreSQL · Chapter 1 · Lesson 1.3 "PostgreSQL vs MySQL, SQLite & NoSQL" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s01-vi-sao.mjs › postgresql-1-3-vs-alternatives. Output THẬT: PostgreSQL 17.11 (pgcourse17) + SQLite 3.53.4 (python3 sqlite3)
 * — video-bai-giang/src/khung/pg/that/pg-01-3.out.txt, pg-01-3.sqlite.txt, pg-01-3.writerA/B.txt. MySQL: KHÔNG chạy thật ở bài này (nói định tính; Ch17 chạy thật).
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, flow, vsd } from './_pg-chung.mjs';

export const deck = { key: 'pg-01-3', code: 'PG 1.3', title: 'PostgreSQL vs MySQL, SQLite & NoSQL', sub: 'Where PostgreSQL stands — and when to choose something else' };
const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;

/* Ba công cụ lưu dữ liệu đời thường. */
const tools = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <g data-k="t-lite"><rect x="20" y="20" width="340" height="250" rx="16" fill="#fffaf0" stroke="#b85a2b" stroke-width="3"/>
  <text x="190" y="100" text-anchor="middle" font-size="78">📓</text><text x="190" y="150" text-anchor="middle" font-size="27" font-weight="800" fill="#b85a2b">A notebook</text>
  <text x="190" y="184" text-anchor="middle" font-size="21" fill="#555">one file you carry</text><text x="190" y="212" text-anchor="middle" font-size="21" fill="#555">only one writer at a time</text><text x="190" y="248" text-anchor="middle" font-size="23" font-weight="800" fill="#333">≈ SQLite</text></g>
  <g data-k="t-mysql"><rect x="385" y="20" width="340" height="250" rx="16" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="555" y="100" text-anchor="middle" font-size="78">🗄️</text><text x="555" y="150" text-anchor="middle" font-size="27" font-weight="800" fill="#245077">A shared cabinet</text>
  <text x="555" y="184" text-anchor="middle" font-size="21" fill="#555">a server many people use</text><text x="555" y="212" text-anchor="middle" font-size="21" fill="#555">simple, popular, fast to start</text><text x="555" y="248" text-anchor="middle" font-size="23" font-weight="800" fill="#333">≈ MySQL</text></g>
  <g data-k="t-pg"><rect x="750" y="20" width="340" height="250" rx="16" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/>
  <text x="920" y="100" text-anchor="middle" font-size="78">🏛️</text><text x="920" y="150" text-anchor="middle" font-size="27" font-weight="800" fill="#1f6b40">A strict archive</text>
  <text x="920" y="184" text-anchor="middle" font-size="21" fill="#555">same shared server, but</text><text x="920" y="212" text-anchor="middle" font-size="21" fill="#555">rules, rich types, very careful</text><text x="920" y="248" text-anchor="middle" font-size="23" font-weight="800" fill="#333">≈ PostgreSQL</text></g>
</svg>`;

/* Bản đồ NoSQL. */
const nosql = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  ${[
    ['Document', 'MongoDB', ['JSON-like documents', 'no fixed schema'], '#2f7d4f', 20],
    ['Key–value', 'Redis', ['lookup by key', 'in memory'], '#c0392b', 285],
    ['Wide-column', 'Cassandra · DynamoDB', ['huge writes over', 'many machines'], '#e08a1e', 550],
    ['Relational', 'PostgreSQL', ['schema · JOIN', 'transactions · ACID'], '#336791', 815],
  ].map(([t, e, d, m, x]) => `<g data-k="nosql"><rect x="${x}" y="30" width="255" height="230" rx="14" fill="#fff" stroke="${m}" stroke-width="3.5"/><rect x="${x}" y="30" width="255" height="50" rx="14" fill="${m}"/><text x="${x + 127}" y="64" text-anchor="middle" font-size="23" font-weight="800" fill="#fff">${t}</text>
  <text x="${x + 127}" y="132" text-anchor="middle" font-size="${e.length > 14 ? 19 : 25}" font-weight="800" fill="${m}">${e}</text><text x="${x + 127}" y="182" text-anchor="middle" font-size="20" fill="#555">${d[0]}</text><text x="${x + 127}" y="212" text-anchor="middle" font-size="20" fill="#555">${d[1]}</text></g>`).join('')}
</svg>`;

/* Cây quyết định. */
const tree = () => `<svg viewBox="0 0 1110 360" width="1110" height="360" font-family="Arial">
  <defs><marker id="mq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  ${[
    [0, 'App on one device, a test, or a single file?', 'SQLite', '#b85a2b'],
    [1, 'Backend for a web app / shop / API?', 'PostgreSQL', '#2f7d4f'],
    [2, 'Need cache, rate-limit or pub/sub?', 'Redis — beside Postgres', '#c0392b'],
    [3, 'Planet-scale writes, no JOINs, honestly?', 'A specialised store', '#e08a1e'],
  ].map(([i, q, a, m]) => { const y = 14 + i * 86; return `<g data-k="dec"><rect x="20" y="${y}" width="620" height="68" rx="12" fill="#fff" stroke="#999" stroke-width="2.5"/><text x="40" y="${y + 29}" font-size="17" font-weight="800" fill="#999">${i + 1}</text><text x="68" y="${y + 41}" font-size="24" font-weight="700" fill="#333">${q}</text>
  <path d="M642,${y + 34} L760,${y + 34}" stroke="#b85a2b" stroke-width="3.5" marker-end="url(#mq)"/><text x="700" y="${y + 24}" text-anchor="middle" font-size="19" font-weight="800" fill="#b85a2b">yes</text>
  <rect x="768" y="${y}" width="320" height="68" rx="12" fill="${m}18" stroke="${m}" stroke-width="3.5"/><text x="928" y="${y + 43}" text-anchor="middle" font-size="25" font-weight="800" fill="${m}">${a}</text></g>`; }).join('')}
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Why PostgreSQL exists', bai: '1.3' }, [
  { cover: true, t: 'PostgreSQL vs MySQL,<br>SQLite &amp; NoSQL', sub: '“Always use Postgres” is a slogan, not an argument.<br>Here is the argument — and the exceptions.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The <b>two other SQL databases</b> you will meet: <b>SQLite</b> and <b>MySQL</b></li>
<li>Two <b>real tests</b>: how strictly each treats your data, and what happens with two writers</li>
<li>What <b>“NoSQL”</b> really means — four families, four trade-offs</li>
<li>A <b>decision guide</b> you can use on your next project</li>
<li>Why PostgreSQL is the right <b>default</b> — and the one trap in choosing</li>
</ul>
${box('Where we are', 'Lesson 1.1: tables and keys. Lesson 1.2: ACID. Now: <b>which</b> database should hold all of this?', 'lam')}` },

  { t: 'Everyday example first: three ways to keep records', body: `
${tools()}
<p style="font-size:24px;margin:0">A <b>notebook</b> is perfect for one person. A <b>shared cabinet</b> works for a team. A <b>strict archive</b> adds rules, rich filing and care. None is “best” — each fits a job. Databases are the same.</p>` },

  { t: 'The two other SQL databases you will meet', to: true, body: cards([
    ['📓 SQLite', 'Not a server — a C library that reads and writes one single file. Nothing to install; lives inside an app or phone. Great for local apps, tests and embedded read-heavy use.'],
    ['🗄️ MySQL / MariaDB', 'A server like Postgres; the default of the “LAMP stack”, huge ecosystem, very capable. Historically simpler to start with.'],
    ['🐘 PostgreSQL', 'The most feature-rich open-source SQL server: JSONB, full-text search, PostGIS, window functions, strong indexing, extensions.'],
  ], 1) },

  { t: 'Test 1 — strictness: put text in a number column', body: zm(two(
    `<div><div class="tcap">SQLite 3.53 (real run)</div>` + psql(`CREATE TABLE product (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL,
  price NUMERIC NOT NULL);
INSERT INTO product VALUES (1,'Notebook','abc');
SELECT id, name, price, typeof(price)
FROM product;

(1, 'Notebook', 'abc', 'text')`, { sm: true, title: 'SQLite · python3 sqlite3' }) + `</div>`,
    `<div><div class="tcap">PostgreSQL 17.11 (real run)</div>` + psql(`CREATE TABLE product (
  id int PRIMARY KEY, name text NOT NULL,
  price numeric NOT NULL);
INSERT INTO product
VALUES (1, 'Notebook', 'abc');

ERROR:  invalid input syntax for type
        numeric: "abc"
LINE 1: INSERT INTO product VALUES (1, ...`, { sm: true, title: 'PostgreSQL · psql' }) + `</div>`), 1.12) +
    box('Takeaway', 'SQLite accepted <b>“abc” as a price</b> (it stores whatever you give it — “type affinity”). PostgreSQL <b>refuses</b>. A strict database finds the bug at INSERT time, not months later in a report.', 'xanh') },

  { t: 'Test 2 — two writers at the same time', body: zm(two(
    `<div><div class="tcap">SQLite (real run): A has a write transaction open</div>` + psql(`A: BEGIN IMMEDIATE;
A: INSERT INTO product VALUES (2,'Pen',5);
   (A now holds the write lock)
B: BEGIN IMMEDIATE;

B: OperationalError:
   database is locked
   (B cannot even start writing)`, { sm: true, title: 'SQLite · two connections' }) + `</div>`,
    `<div><div class="tcap">PostgreSQL (real run): same two writers</div>` + psql(`A: BEGIN;
A: INSERT INTO product VALUES (2,'Pen',5);
   INSERT 0 1                (A still open)
B: BEGIN;
B: INSERT INTO product
   VALUES (3,'Ruler',7);
   INSERT 0 1
B: COMMIT;   → COMMIT
A: COMMIT;   → COMMIT`, { sm: true, title: 'PostgreSQL · two sessions' }) + `</div>`), 1.12) +
    box('Takeaway', 'SQLite locks the <b>whole file</b> for a writer: the second writer fails (or waits). PostgreSQL locks only the <b>rows</b> being changed, so many writers work in parallel — the reason SQLite is “weak with many writers”.', 'xanh') },

  { t: 'MySQL vs PostgreSQL — the honest comparison', body: `
<table class="t">
<tr><th style="width:190px"></th><th>MySQL / MariaDB</th><th>PostgreSQL</th></tr>
<tr><td><b>Popularity</b></td><td>Extremely popular; the classic web-hosting database</td><td>Fast-growing; the default of many modern backends</td></tr>
<tr><td><b>Types</b></td><td>Solid core set</td><td>Richer: arrays, ranges, enums, JSONB, UUID, custom types</td></tr>
<tr><td><b>Correctness</b></td><td>Improved a lot; behaviour depends on the SQL mode</td><td>Strict by default, real constraints everywhere</td></tr>
<tr><td><b>Advanced SQL</b></td><td>CTEs and window functions arrived in 8.0</td><td>Mature for years: CTE, recursive, window, LATERAL</td></tr>
<tr><td><b>Extensibility</b></td><td>Storage-engine plugins</td><td>Extensions: PostGIS, pgvector, trigram search …</td></tr>
</table>
${box('Not a contest', 'Both are excellent and the SQL you learn transfers. Chapter 17 runs the <b>same data</b> on SQL Server, MySQL, PostgreSQL and MongoDB so you can see the differences for real.', 'lam')}` },

  { t: 'Why PostgreSQL is the usual default', to: true, body: `
<ul>
<li><b>Rich:</b> JSONB, arrays, full-text search, PostGIS, window functions, extensions</li>
<li><b>Strict &amp; correct:</b> real constraints, careful ACID with MVCC</li>
<li><b>Free &amp; open</b> — no vendor can pull the rug</li>
<li><b>Predictable</b> — “boring” in the best sense, which is the highest praise for a database</li>
</ul>
${box('Rule of thumb', 'Building a web backend and not sure? <b>Start with PostgreSQL.</b> You will rarely hit its ceiling, and the skills transfer to every SQL database.', 'xanh')}` },

  { t: '“NoSQL” is four different things', body: `
${nosql()}
<p style="font-size:23px;margin:0">“NoSQL” only means <b>not</b> a classic relational SQL database. These tools exist for real reasons — but each <b>trades away</b> something PostgreSQL gives you for free (JOINs, strong consistency, transactions).</p>` },

  { t: 'You may not need to leave: JSONB', body: `
${zm(run(`SELECT doc->>'name' AS name,
       doc->'specs'->>'ram' AS ram
FROM product_doc
WHERE doc @> '{"specs":{"tags":["study"]}}';`, `  name  | ram
--------+-----
 Laptop | 16
(1 row)`, { ngang: true }), 1.3)}
${zm(tbl(['id', 'doc  (jsonb)'], [['1', '{"name":"Laptop","specs":{"ram":16,"tags":["work","study"]}}'], ['2', '{"name":"Mouse","specs":{"ram":null,"tags":["office"]}}']], { cap: 'table product_doc — two documents, two different shapes of tags', hl: [0] }), 1.0)}
<ul style="font-size:23px">
<li>A <code class="i">jsonb</code> column stores <b>schema-free documents</b> inside a relational table</li>
<li><code class="i">@&gt;</code> = “contains”; it can be <b>indexed</b> (Chapter 13) — flexible <b>and</b> fast</li>
<li>So “NoSQL for flexibility” is a weaker argument than it sounds</li>
</ul>` },

  { t: 'Redis next to PostgreSQL — not instead of it', body: `
${two(
    flow([{ t: 'Request', s: 'user asks', mau: '#e08a1e' }, { t: 'Redis', s: 'cache · rate-limit', mau: '#c0392b' }, { t: 'PostgreSQL', s: 'the source of truth', mau: '#336791' }], { w: 640, h: 150, fs: 19 }),
    `<ul style="font-size:22px;margin:0"><li><b>Redis</b>: keys in memory — extremely fast, but <b>volatile</b></li><li><b>PostgreSQL</b>: the durable truth</li><li>The classic pair: Postgres keeps the facts; Redis is the fast hot path</li></ul>`, 'r64')}
${cards([['⚡ Cache', 'Keep the answer to an expensive query for a few seconds.'], ['🚦 Rate-limit', 'Count requests per IP per minute; the counter expires by itself.'], ['📣 Pub/Sub', 'Tell other servers that something just changed.']], 3)}
${box('On cuongthai.com', 'Redis (256 MB, <code class="i">allkeys-lru</code>, ≈ 89 % hit rate) caches and rate-limits; <b>everything permanent</b> lives in PostgreSQL. No document NoSQL store — a few <code class="i">jsonb</code> columns cover the flexible parts.', 'lam')}` },

  { t: 'An expensive mistake: NoSQL “to scale”', body: zm(vsd(
    `<p style="font-size:21px;margin:0">Pick a NoSQL store “so we can scale” — for a project with <b>10,000 users</b>.</p><ul style="font-size:20px"><li>You give up JOINs, transactions and ad-hoc queries</li><li>… to solve a scaling problem you do not have</li><li>Then re-invent them badly in application code</li></ul>`,
    `<p style="font-size:21px;margin:0">Start on PostgreSQL. It handles <b>millions of rows</b> and thousands of writes per second on modest hardware.</p><p style="font-size:20px">Reach for a specialised store only when you have <b>measured</b> the limit.</p>`), 1.3) },

  { t: 'A decision guide', body: `
${tree()}
<p style="font-size:21px;margin:0">Read it top to bottom and stop at the first “yes”. Most projects stop at <b>number 2</b>.</p>` },

  { t: 'Trap: choosing by someone else’s benchmark', body: zm(vsd(
    `<p style="font-size:21px;margin:0">“Database X is 10× faster than PostgreSQL!”</p><ul style="font-size:20px"><li>True — for one operation on one data shape</li><li>Almost never <b>your</b> workload</li></ul>`,
    `<p style="font-size:21px;margin:0">Ask the boring questions benchmarks never answer:</p><ul style="font-size:20px"><li>Do my related updates run in one <b>transaction</b>?</li><li>Can I query it in ways I have not thought of yet?</li><li>What happens to data when the schema changes?</li><li>Who runs it at 3 a.m.?</li></ul>`), 1.25) +
    `<p style="margin-top:8px;font-size:25px">PostgreSQL wins most of these by being <b>predictable</b> — and by the time raw speed matters, you will have measured <b>your own</b> workload.</p>` },

  { t: 'Exercise: pick the database', to: true, body: `
<p style="margin:0">Choose for each project, in one sentence:</p>
<ol>
<li>An offline notes app on a phone, one user</li>
<li>The backend of a shop with thousands of customers and payments</li>
<li>A login-attempt limiter (5 tries per minute per IP)</li>
<li>A product catalogue where every item has different attributes (shoe size, laptop RAM …)</li>
</ol>
${box('Answer', '1) <b>SQLite</b> — one file, no server. 2) <b>PostgreSQL</b> — many writers, ACID, rich types. 3) <b>Redis</b> next to Postgres — a fast, expiring counter; the account data stays in PostgreSQL. 4) <b>PostgreSQL + a <code class="i">jsonb</code> column</b> — flexible attributes, still relational and indexable.', 'xanh')}` },

  { t: 'Check yourself', to: true, body: `
<ol>
<li>In our test, what did SQLite do with <code class="i">'abc'</code> in a number column, and PostgreSQL?</li>
<li>Why does SQLite fail with two simultaneous writers, but PostgreSQL does not?</li>
<li>Name two reasons <b>against</b> picking a NoSQL database “to scale” for a small project.</li>
<li>What would you use for a single-user offline mobile app — and why?</li>
</ol>
${box('Answers', '1) SQLite stored it as text; PostgreSQL raised <code class="i">invalid input syntax for type numeric</code>. 2) SQLite locks the whole file for a writer; PostgreSQL locks only the affected rows (MVCC). 3) You lose JOINs/transactions/ad-hoc queries, and you solve a scaling problem you do not have. 4) SQLite: one file, no server to run.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>SQLite</b>: one file, no server — local apps &amp; tests</li>
<li><b>MySQL</b>: a popular SQL server; <b>PostgreSQL</b>: the richest, strictest — the web-backend default</li>
<li><b>NoSQL</b> = four families, each trading something away; <code class="i">jsonb</code> often covers the need</li>
<li><b>Redis</b> beside Postgres for cache — not instead of it</li>
<li>Next: <b>1.4 — How a query flows through Postgres</b></li>
</ul>
${box('Coming in Chapter 17', 'The same data on <b>SQL Server · MySQL · PostgreSQL · MongoDB</b>, run for real — and when to use which.', 'lam')}` },
]);
