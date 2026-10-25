/**
 * pg-17-1 — PostgreSQL · Chapter 17 · Lesson 17.1 "Four database systems" (slide EN, kiểu FU, agent c17, 25/10/2026).
 * Nguồn: content/courses/postgresql/s17-bon-he-csdl.mjs › postgresql-17-1-bon-he-csdl (bài MỚI).
 * Output = chạy THẬT cùng đơn hàng #1 của CT Shop trên SQL Server 2022 16.0.4305 · MySQL 8.4.13 · PostgreSQL 17.11 · MongoDB 7.0.37
 * (mongo:8 không khởi động được trên kernel 6.19 của Docker Desktop — lỗi SERVER-121912 — nên dùng 7.0). Lưu ở video-bai-giang/src/khung/pg/that/pg-17-1.*.
 */
import { lamDeck, sql, two, three, box, cards as cards0, steps, tbl, vsd } from './_pg-chung.mjs';
import { T, HE, bang3 } from './pg-17-hinh.mjs';

const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);
const col = (...a) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${a.join('')}</div>`;
const t13 = (s) => s.replace('<pre>', '<pre style="font-size:13px;line-height:1.34">');

export const deck = { key: 'pg-17-1', code: 'PG 17.1', title: 'Four database systems', sub: 'SQL Server, MySQL, PostgreSQL and MongoDB — history, data model, licence, who uses them' };

const NAU = '#b85a2b';

/* Dòng thời gian 1986 → 2024 (SVG) — vị trí nhãn đặt tay để không đè nhau (chữ 16px đậm ≈ 8,8 px/ký tự). */
const dongThoiGian = () => {
  const x = (y) => 40 + ((y - 1985) / (2025 - 1985)) * 1030;
  // [năm, chữ, hệ, y nhãn, neo, x nhãn]
  const moc = [
    [1986, '1986 · POSTGRES at UC Berkeley', 'pg', 222, 'start', 40], [1989, '1989 · SQL Server 1.0 (Microsoft + Sybase)', 'ss', 112, 'start', 110],
    [1995, '1995 · MySQL 1.0 · Postgres95 adds SQL', 'my', 258, 'start', 200], [1996, '1996 · renamed PostgreSQL', 'pg', 76, 'start', 290],
    [2008, '2008 · Sun buys MySQL AB', 'my', 294, 'middle', 632], [2009, '2009 · MongoDB released · MariaDB fork', 'mg', 112, 'middle', 690],
    [2010, '2010 · Oracle buys Sun (and MySQL)', 'my', 222, 'middle', 700], [2017, '2017 · SQL Server runs on Linux', 'ss', 76, 'middle', 864],
    [2018, '2018 · MongoDB 4.0: multi-doc transactions · SSPL', 'mg', 258, 'end', 1085], [2024, '2024 · PostgreSQL 17', 'pg', 40, 'end', 1085],
  ];
  return `<svg viewBox="0 0 1110 310" width="1110" height="310" font-family="Arial">
  <line x1="30" y1="165" x2="1085" y2="165" stroke="#999" stroke-width="3"/>
  ${[1990, 2000, 2010, 2020].map((y) => `<text x="${x(y)}" y="188" text-anchor="middle" font-size="14" fill="#aaa">${y}</text><line x1="${x(y)}" y1="159" x2="${x(y)}" y2="171" stroke="#999" stroke-width="2"/>`).join('')}
  ${moc.map(([y, t, he, ly, neo, lx]) => {
    const X = x(y), m = HE[he].mau, tren = ly < 165;
    return `<line x1="${X}" y1="165" x2="${X}" y2="${tren ? ly + 6 : ly - 16}" stroke="${m}" stroke-width="2" stroke-dasharray="4 3"/>
    <circle data-k="moc" cx="${X}" cy="165" r="8" fill="${m}"/>
    <text data-k="mocchu" x="${lx}" y="${ly}" text-anchor="${neo}" font-size="16" font-weight="700" fill="${m}">${t}</text>`;
  }).join('')}
</svg>`;
};

/* Bảng vs document: cùng đơn #1. */
const bangVsDoc = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="bd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>
  <text x="250" y="24" text-anchor="middle" font-size="20" font-weight="800" fill="#336791">RELATIONAL: order #1 = rows in 2 tables (+ keys)</text>
  <rect data-k="bang" x="20" y="40" width="210" height="100" rx="8" fill="#e8f0f8" stroke="#336791" stroke-width="2.5"/>
  <text x="125" y="64" text-anchor="middle" font-size="17" font-weight="800" fill="#336791">orders</text>
  <text x="34" y="92" font-size="15" font-family="Menlo,monospace" fill="#333">id=1 customer_id=61</text>
  <text x="34" y="116" font-size="15" font-family="Menlo,monospace" fill="#333">status='paid'</text>
  <rect data-k="bang" x="270" y="40" width="230" height="130" rx="8" fill="#e8f0f8" stroke="#336791" stroke-width="2.5"/>
  <text x="385" y="64" text-anchor="middle" font-size="17" font-weight="800" fill="#336791">order_item</text>
  <text x="282" y="92" font-size="15" font-family="Menlo,monospace" fill="#333">1 · product 34 · 1 ×</text>
  <text x="282" y="114" font-size="15" font-family="Menlo,monospace" fill="#333">    790000.00</text>
  <text x="282" y="140" font-size="15" font-family="Menlo,monospace" fill="#333">1 · product 38 · 1 ×</text>
  <text x="282" y="162" font-size="15" font-family="Menlo,monospace" fill="#333">     15000.00</text>
  <line x1="232" y1="90" x2="266" y2="90" stroke="${NAU}" stroke-width="2.5" marker-end="url(#bd)"/>
  <text x="250" y="210" text-anchor="middle" font-size="16" fill="#555">customer, product, category live in their own tables</text>
  <text x="250" y="234" text-anchor="middle" font-size="16" fill="#555">— read the order back with JOIN</text>
  <text x="820" y="24" text-anchor="middle" font-size="20" font-weight="800" fill="#2f8d46">DOCUMENT: order #1 = one nested object</text>
  <rect data-k="doc" x="580" y="40" width="510" height="250" rx="10" fill="#e9f6ec" stroke="#2f8d46" stroke-width="2.5"/>
  <text font-size="14" font-family="Menlo,monospace" fill="#333">
    <tspan x="594" y="58.0" xml:space="preserve">{ _id: 1,</tspan>
    <tspan x="594" y="76.5" xml:space="preserve">  customer: { id: 61, name: 'Vũ Thị Bình',</tspan>
    <tspan x="594" y="95.0" xml:space="preserve">              city: 'Đà Nẵng' },</tspan>
    <tspan x="594" y="113.5" xml:space="preserve">  status: 'paid',</tspan>
    <tspan x="594" y="132.0" xml:space="preserve">  created_at: ISODate('2026-09-05T23:28:00.000Z'),</tspan>
    <tspan x="594" y="150.5" xml:space="preserve">  items: [</tspan>
    <tspan x="594" y="169.0" xml:space="preserve">    { sku: 'CT1004', name: 'Máy tính Casio FX-880BTG',</tspan>
    <tspan x="594" y="187.5" xml:space="preserve">      category: 'Máy tính cầm tay',</tspan>
    <tspan x="594" y="206.0" xml:space="preserve">      qty: 1, unit_price: 790000 },</tspan>
    <tspan x="594" y="224.5" xml:space="preserve">    { sku: 'CT1102', name: 'Thước thép Deli 30cm',</tspan>
    <tspan x="594" y="243.0" xml:space="preserve">      category: 'Thước &amp; compa',</tspan>
    <tspan x="594" y="261.5" xml:space="preserve">      qty: 1, unit_price: 15000 }</tspan>
    <tspan x="594" y="280.0" xml:space="preserve">  ] }</tspan>
  </text>
</svg>`;

const ho = (he, rows, note) => `<table class="t" style="font-size:21px">${rows.map(([k, v]) => `<tr><td style="width:170px;font-weight:700;color:${HE[he].mau}">${k}</td><td>${v}</td></tr>`).join('')}</table>${note ? `<p class="nho" style="margin:6px 0 0">${note}</p>` : ''}`;

export const slides = lamDeck({ chuong: 'Chapter 17 — SQL Server · MySQL · PostgreSQL · MongoDB', bai: '17.1' }, [
  { cover: true, t: 'Four database systems', sub: 'SQL Server · MySQL · PostgreSQL · MongoDB —<br>where they came from, how they store data,<br>what they cost, and who runs them.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Where each of the four systems came from — <b>38 years</b> on one timeline</li>
<li>The two shapes of data: <b>tables</b> (three of them) and <b>documents</b> (MongoDB)</li>
<li>Licences in plain words: what is free, what is paid, what “open source” means here</li>
<li>Who really uses each one — and where <i>you</i> will meet it in Vietnam</li>
<li>The same CT Shop order, stored and read back on all four servers — for real</li>
</ul>` },

  { t: 'An everyday picture: a form or a folder?', giua: true, body: two(cards([
    ['🗂️ The form cabinet (relational)', 'Every customer, product and order line is a row on its own form, in its own drawer. An order <b>points</b> to its customer by number. To see a whole order, you pull forms from several drawers and put them side by side — that is a <b>JOIN</b>.'],
    ['📁 The folder (document)', 'Each order is one folder with everything inside: the customer’s name, every line, the prices of the day. Reading one order is one grab. But if a product is renamed, every folder that copied the old name still says the old name.'],
  ], 1), col(box('Three of the four are relational', '<b>SQL Server</b>, <b>MySQL</b> and <b>PostgreSQL</b> all keep tables and speak SQL. <b>MongoDB</b> keeps documents (BSON, a binary JSON) and has its own query language, MQL.', 'lam'),
    box('Neither is “better”', 'They make different things cheap. This chapter shows exactly which — on the same CT Shop data.', 'ok')), 'r64') },

  { t: '38 years on one timeline', body: `${dongThoiGian()}
${box('Read it like this', 'PostgreSQL is the oldest idea (1986) and the only one never owned by a company. SQL Server and MySQL were bought or built by giants. MongoDB is the youngest, born in the 2009 “NoSQL” wave — and later added the transactions it had once said you did not need.', 'lam')}` },

  { t: 'Two shapes of data: rows or one document', giua: true, body: `${bangVsDoc()}
${two(box('Relational', 'Each fact is stored <b>once</b>; keys link them; any question can be asked later with SQL.', 'lam'), box('Document', 'Data that is read together is stored together; no JOIN needed to show one order.', 'ok'))}` },

  { t: 'SQL Server — Microsoft’s database', body: two(ho('ss', [
    ['Born', '1989, Microsoft with Sybase (on OS/2); Microsoft’s own code base since 7.0 (1998)'],
    ['Owner', 'Microsoft — closed source'],
    ['Licence', '<b>Paid</b> (Standard / Enterprise, per CPU core). Free: <b>Express</b> (databases up to 10 GB) and <b>Developer</b> (not for production)'],
    ['Runs on', 'Windows, and Linux / Docker since SQL Server 2017; also as Azure SQL'],
    ['Language', 'T-SQL · tools: SSMS, sqlcmd'],
    ['You meet it', '.NET companies, banks, ERP, the DBI202 course at FPT'],
  ]), col(T('ss', `1> SELECT @@VERSION
2> GO
Microsoft SQL Server 2022 (RTM-CU27-GDR)
(KB5126934) - 16.0.4305.5 (X64)
	Oct  2 2026 17:28:11
	Copyright (C) 2022 Microsoft Corporation
1> SELECT SERVERPROPERTY('Edition')
2> GO
Developer Edition (64-bit)`, { title: 'sqlcmd — this course’s container (Linux, Rosetta)' }),
    box('Note', 'We ran it in a <b>Linux</b> Docker container — “SQL Server only runs on Windows” stopped being true in 2017.', 'lam')), 'r64') },

  { t: 'MySQL — the database of the web', body: two(ho('my', [
    ['Born', '1995, MySQL AB in Sweden (Monty Widenius, David Axmark, Allan Larsson)'],
    ['Owner', 'Sun (2008), then <b>Oracle</b> (2010). Fork: <b>MariaDB</b> (2009, by the original creator)'],
    ['Licence', '<b>GPL v2</b> Community edition, free · or a paid commercial licence / Enterprise edition'],
    ['Engine', '<b>InnoDB</b> (default since 5.5): transactions, row locks, foreign keys'],
    ['Language', 'SQL with MySQL extensions · tools: Workbench, mysql, phpMyAdmin'],
    ['You meet it', 'WordPress & PHP hosting (LAMP), XAMPP in school labs, many large web companies'],
  ]), col(T('my', `mysql> SELECT VERSION() AS version,
    ->   @@default_storage_engine AS engine;
+---------+--------+
| version | engine |
+---------+--------+
| 8.4.13  | InnoDB |
+---------+--------+
1 row in set (0.00 sec)`, { title: 'mysql — MySQL 8.4.13 (LTS)' }),
    box('Note', 'MySQL 8.4 is the <b>Long-Term Support</b> line; versions 9.x are “innovation” releases with shorter support.', 'lam')), 'r64') },

  { t: 'PostgreSQL — the community database', body: two(ho('pg', [
    ['Born', '1986 POSTGRES at UC Berkeley (Michael Stonebraker) · 1995 Postgres95 adds SQL · 1996 renamed PostgreSQL'],
    ['Owner', '<b>Nobody</b> — the PostgreSQL Global Development Group, a community; companies contribute'],
    ['Licence', '<b>PostgreSQL Licence</b> (like MIT/BSD): free for any use, including inside paid products'],
    ['Strength', 'standards, correctness, extensions (PostGIS, pgvector, …), rich types: JSONB, arrays, ranges'],
    ['Language', 'SQL + PL/pgSQL · tools: psql, pgAdmin, DBeaver'],
    ['You meet it', 'start-ups, Supabase / Neon, Instagram and Reddit, this website'],
  ]), col(t13(T('pg', `ctshop=# SELECT version();
                    version
----------------------------------------------
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on
 aarch64-unknown-linux-gnu, compiled by gcc
 (Debian 14.2.0-19) 14.2.0, 64-bit
(1 row)`, { title: 'psql (17.11) — ctshop (output wrapped)' })),
    box('Note', 'A new major version every autumn (17 in 2024), each supported for 5 years. This course uses 17; cuongthai.com runs 16.', 'lam')), 'r64') },

  { t: 'MongoDB — the document database', body: two(ho('mg', [
    ['Born', '2007 company 10gen, first release <b>2009</b>; renamed MongoDB Inc. in 2013'],
    ['Owner', 'MongoDB Inc. · cloud service: <b>MongoDB Atlas</b>'],
    ['Licence', '<b>SSPL</b> since Oct 2018: source available and free to run yourself, but not OSI “open source”; selling it as a cloud service requires opening your whole service stack'],
    ['Model', 'collections of <b>documents</b> (BSON) · engine WiredTiger · multi-document transactions since 4.0 (needs a replica set)'],
    ['Language', 'MQL: find(), aggregate() pipelines · tools: mongosh, Compass'],
    ['You meet it', 'MERN stack (Mongo + Express + React + Node), catalogues, event logs, IoT'],
  ]), col(T('mg', `ctshop> db.version()
7.0.37
ctshop> db.serverStatus().storageEngine.name
wiredTiger`, { title: 'mongosh — MongoDB 7.0.37' }),
    box('Why 7.0 here', 'The <code class="i">mongo:8</code> image refused to start on this machine’s Linux kernel 6.19 (known issue SERVER-121912); 7.0 behaves the same for everything in this chapter.', 'do2')), 'r64') },

  { t: 'Licences in plain words', body: `${bang3([
    ['Can I use it free?', 'Express (≤ 10 GB) / Developer (no production)', 'yes — Community, GPL v2', 'yes — any use', 'yes — Community, SSPL'],
    ['Production at scale', '<b>paid</b> per CPU core', 'free, or paid Enterprise', 'free', 'free self-hosted · paid Atlas / Enterprise'],
    ['Source code', 'closed', 'open (GPL)', 'open (permissive)', 'available (SSPL, not OSI-approved)'],
    ['Who decides its future', 'Microsoft', 'Oracle (MariaDB is the fork)', 'a community', 'MongoDB Inc.'],
    ['Managed cloud', 'Azure SQL, AWS RDS', 'every cloud (RDS, Cloud SQL…)', 'every cloud + Supabase, Neon', 'MongoDB Atlas'],
  ], { he: ['ss', 'my', 'pg', 'mg'], fs: 17, w1: 170 })}
${box('Why licence matters to a student', 'Your graduation project, a start-up, a freelance shop for a client: PostgreSQL and MySQL cost nothing at any size. SQL Server is free only while small or in development. MongoDB is free to run yourself, with a licence that mainly restricts cloud providers.', '')}` },

  { t: 'The same CT Shop order on four servers (real)', body: two(col(
    t13(T('ss', `1> SELECT o.id, c.full_name, o.status, p.sku, oi.qty, oi.unit_price
2> FROM orders o JOIN customer c ON c.id = o.customer_id JOIN order_item oi
3> ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id WHERE o.id = 1;
4> GO
id  full_name    status  sku     qty  unit_price
--- ------------ ------- ------- ---- ----------
  1 Vũ Thị Bình  paid    CT1004     1  790000.00
  1 Vũ Thị Bình  paid    CT1102     1   15000.00`, { title: 'sqlcmd (same query; columns trimmed)' })),
    t13(T('my', `mysql> -- the same SELECT … WHERE o.id = 1;
+----+-----------------+--------+--------+-----+------------+
| id | full_name       | status | sku    | qty | unit_price |
+----+-----------------+--------+--------+-----+------------+
|  1 | Vũ Thị Bình     | paid   | CT1004 |   1 |  790000.00 |
|  1 | Vũ Thị Bình     | paid   | CT1102 |   1 |   15000.00 |
+----+-----------------+--------+--------+-----+------------+`, { title: 'mysql' })),
    t13(T('pg', `ctshop=# -- the same SELECT … WHERE o.id = 1;
 id |  full_name  | status |  sku   | qty | unit_price
----+-------------+--------+--------+-----+------------
  1 | Vũ Thị Bình | paid   | CT1004 |   1 |  790000.00
  1 | Vũ Thị Bình | paid   | CT1102 |   1 |   15000.00
(2 rows)`, { title: 'psql (17.11) — ctshop' }))),
    t13(T('mg', `ctshop> db.orders.findOne({ _id: 1 })
{
  _id: 1,
  customer: {
    id: 61,
    name: 'Vũ Thị Bình',
    city: 'Đà Nẵng'
  },
  status: 'paid',
  created_at: ISODate('2026-09-05T23:28:00.000Z'),
  items: [
    {
      sku: 'CT1004',
      name: 'Máy tính Casio FX-880BTG',
      category: 'Máy tính cầm tay',
      qty: 1,
      unit_price: 790000
    },
    {
      sku: 'CT1102',
      name: 'Thước thép Deli 30cm',
      category: 'Thước & compa',
      qty: 1,
      unit_price: 15000
    }
  ]
}`, { title: 'mongosh — no JOIN: one document' })), 'r64') },

  { t: 'Who runs what (public, well-known examples)', giua: true, body: `${bang3([
    ['Famous users', 'Stack Overflow; banks, insurers, ERP and many .NET companies', 'WordPress sites; GitHub; Facebook ran one of the largest MySQL fleets; Wikipedia uses MariaDB', 'Instagram (from day one), Reddit, Supabase and Neon (built on it), cuongthai.com', 'MERN apps, product catalogues, content and event stores; MongoDB Atlas customers'],
    ['Typical stack', 'C# / ASP.NET + Entity Framework', 'PHP / Laravel / WordPress', 'Node + Prisma, Python + Django, Java + Spring', 'Node + Mongoose'],
    ['In Vietnam you see it in', 'banks, enterprise, DBI202', 'shared hosting, agencies, XAMPP', 'start-ups, product teams, SaaS', 'MERN courses, side projects, some start-ups'],
  ], { he: ['ss', 'my', 'pg', 'mg'], fs: 19, w1: 150 })}
${box('Popularity, measured', 'DB-Engines has ranked Oracle, MySQL, SQL Server, PostgreSQL and MongoDB as the top five for years. In the Stack Overflow Developer Survey, PostgreSQL became the most-used database among professional developers in 2023 and kept the lead in 2024.', 'lam')}` },

  { t: 'Myths you will hear', giua: true, body: `${vsd(`<ul style="font-size:25px;gap:14px">
<li>“SQL Server only runs on Windows”</li>
<li>“MongoDB has no transactions”</li>
<li>“MySQL cannot store JSON”</li>
<li>“PostgreSQL is slow / only for experts”</li>
<li>“NoSQL means no schema, so no design work”</li>
</ul>`, `<ul style="font-size:25px;gap:14px">
<li>Linux & Docker since 2017 — this chapter ran it there</li>
<li>Multi-document ACID transactions since 4.0 (2018), on a replica set</li>
<li>A binary <b>JSON</b> type since 5.7 (2015) — Lesson 17.2</li>
<li>It runs Instagram-scale traffic; psql is just a client</li>
<li>The schema moves into your code — you still design it (17.3)</li>
</ul>`, '✗ Myth', '✓ What is true')}` },

  { t: 'In a real project: what cuongthai.com runs', to: true, body: two(`<ul>
<li><b>PostgreSQL 16</b> in Docker on the VPS — image <code class="i">api-backend-postgres:16-3.4-pgvector</code> (PostGIS 3.4 + pgvector)</li>
<li><b>Prisma</b> with <code class="i">provider = "postgresql"</code></li>
<li><b>602</b> models, <b>57</b> enums, <b>235</b> migrations</li>
<li><b>266</b> <code class="i">Json</code> fields — document-style data living inside relational tables (JSONB)</li>
<li>a <code class="i">vector(384)</code> column for AI search (pgvector)</li>
</ul>`, col(box('One database, many shapes', 'Relational tables for users, orders and courses; JSONB where the shape varies; vectors for AI; full-text search — all in PostgreSQL. Lesson 17.4 explains why that mattered more than raw speed.', 'ok'),
    sql(`$ grep -c '^model ' \\
    prisma/schema.prisma
602
$ grep -cE '^\\s+\\w+\\s+Json' \\
    prisma/schema.prisma
266`, { sm: true, lang: 'bash' })), 'r64') },

  { t: 'Exercise — which system is it?', to: true, body: two(steps([
    'Free for any use, owned by no company, 1986 roots at Berkeley.',
    'Stores each order as one nested document; queried with find() and aggregate().',
    'Default engine InnoDB; the “M” in LAMP; owned by Oracle since 2010.',
    'Licensed per CPU core; T-SQL; free Express edition caps a database at 10 GB.',
    'Which two of the four can run inside one transaction a CREATE TABLE that is later rolled back? (hint: Lesson 17.2)',
  ]), `<div data-k="dapan" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · PostgreSQL<br>2 · MongoDB<br>3 · MySQL<br>4 · SQL Server<br>5 · PostgreSQL and SQL Server (MySQL commits DDL immediately)</div>`, 'r64') },

  { t: 'Check yourself', to: true, giua: true, body: `
${steps([
    'Name one thing the document model makes cheap and one thing it makes expensive.',
    'Why can a company embed PostgreSQL in a paid product without paying, but not SQL Server Standard?',
    'Since which version does MongoDB support multi-document transactions, and what does it need?',
  ])}
<div data-k="dapan3" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · Cheap: reading one whole order (no JOIN). Expensive: changing data copied into many documents, and ad-hoc reports across documents.<br>
2 · The PostgreSQL Licence is permissive; SQL Server Standard is licensed per CPU core.<br>
3 · 4.0 (2018), on a replica set (sharded clusters from 4.2).</div>` },

  { t: 'Summary', to: true, body: two(`<ul>
<li><b>SQL Server</b>: Microsoft, paid at scale, T-SQL, strong in enterprise .NET</li>
<li><b>MySQL</b>: Oracle-owned, GPL, InnoDB, the web’s default (LAMP, WordPress)</li>
<li><b>PostgreSQL</b>: community-owned, permissive licence, standards + extensions</li>
<li><b>MongoDB</b>: documents, MQL, SSPL, transactions since 4.0</li>
<li>Same order, four servers: three JOINs and one document — the next lessons measure the trade-off</li>
</ul>`, col(box('Next — 17.2', 'The same CT Shop report on SQL Server, MySQL and PostgreSQL: where the syntax differs, and where the <b>behaviour</b> differs (transactions, isolation, JSON, upsert).', 'ok'),
    box('Then', '17.3 MongoDB vs JSONB on the same 2,000 orders · 17.4 how to choose.', 'lam')), 'r64') },
]);
