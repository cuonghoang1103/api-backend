/**
 * pg-17-4 — PostgreSQL · Chapter 17 · Lesson 17.4 "Which one should you choose?" (slide EN, kiểu FU, agent c17, 25/10/2026).
 * Nguồn: content/courses/postgresql/s17-bon-he-csdl.mjs › postgresql-17-4-chon-he-nao.
 * Số đo thật (video-bai-giang/src/khung/pg/that/pg-17-4.out.txt): repo api-backend (cuongthai.com) — Prisma provider postgresql, 602 model,
 * 57 enum, 266 trường Json, 235 migration, 8 migration dùng tsvector, cột vector(384), ảnh DB postgres 16 + PostGIS 3.4 + pgvector;
 * LabFlow AI (đồ án) — Spring Boot 3.5.6 + Flyway + postgres:16-alpine. Kết quả đo 17.1–17.3 dùng lại.
 */
import { lamDeck, sql, two, three, box, cards as cards0, steps, vsd } from './_pg-chung.mjs';
import { T, HE, bang3 } from './pg-17-hinh.mjs';

const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);
const col = (...a) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${a.join('')}</div>`;

export const deck = { key: 'pg-17-4', code: 'PG 17.4', title: 'Which one should you choose?', sub: 'A decision method, real situations, and why cuongthai.com and LabFlow run PostgreSQL' };

const NAU = '#b85a2b';

/* Cây quyết định (SVG). */
const cayQuyetDinh = () => {
  const q = (x, y, w, t, k) => `<rect data-k="${k}" x="${x}" y="${y}" width="${w}" height="56" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="2.5"/><text x="${x + w / 2}" y="${y + 35}" text-anchor="middle" font-size="17" font-weight="700" fill="#333">${t}</text>`;
  const a = (x, y, w, he, t) => `<rect data-k="kq" x="${x}" y="${y}" width="${w}" height="56" rx="10" fill="${HE[he].nen}" stroke="${HE[he].mau}" stroke-width="3"/><text x="${x + w / 2}" y="${y + 35}" text-anchor="middle" font-size="18" font-weight="800" fill="${HE[he].mau}">${HE[he].icon} ${t}</text>`;
  const ln = (x1, y1, x2, y2, t, tx, ty) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${NAU}" stroke-width="2.5" marker-end="url(#cq)"/>${t ? `<text x="${tx}" y="${ty}" font-size="15" font-weight="800" fill="${NAU}">${t}</text>` : ''}`;
  return `<svg viewBox="0 0 1110 420" width="1110" height="420" font-family="Arial">
  <defs><marker id="cq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>
  ${q(20, 10, 520, '① Is it WordPress / a PHP host that only offers MySQL?', 'q')}
  ${a(760, 10, 330, 'my', 'MySQL / MariaDB')}
  ${ln(540, 38, 756, 38, 'yes', 640, 30)}
  ${ln(280, 66, 280, 112, 'no', 290, 94)}
  ${q(20, 116, 520, '② .NET company, SQL Server licences + DBAs already?', 'q')}
  ${a(760, 116, 330, 'ss', 'SQL Server')}
  ${ln(540, 144, 756, 144, 'yes', 640, 136)}
  ${ln(280, 172, 280, 218, 'no', 290, 200)}
  ${q(20, 222, 520, '③ Self-contained JSON docs, few reports, sharding?', 'q')}
  ${a(760, 222, 330, 'mg', 'MongoDB')}
  ${ln(540, 250, 756, 250, 'yes', 640, 242)}
  ${ln(280, 278, 280, 324, 'no / not sure', 290, 306)}
  ${a(20, 328, 520, 'pg', 'PostgreSQL (+ JSONB for the flexible parts)')}
  <text x="925" y="360" text-anchor="middle" font-size="16" fill="#666">default answer for a new project</text>
  <text x="925" y="384" text-anchor="middle" font-size="16" fill="#666">when nothing above forces your hand</text>
</svg>`;
};

export const slides = lamDeck({ chuong: 'Chapter 17 — SQL Server · MySQL · PostgreSQL · MongoDB', bai: '17.4' }, [
  { cover: true, t: 'Which one should you choose?', sub: 'A decision method, real situations,<br>and why cuongthai.com and LabFlow<br>both run PostgreSQL.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Six questions that decide the database — before anyone says a brand name</li>
<li>A decision table for real situations: start-up web, enterprise .NET, WordPress, logs & events, analytics, catalogues</li>
<li>A one-page decision tree you can use in a team meeting</li>
<li>Two real case studies: <b>cuongthai.com</b> (Prisma) and <b>LabFlow AI</b> (Spring Boot)</li>
<li>The mistakes people make when they choose by hype</li>
</ul>` },

  { t: 'An everyday picture: choosing a vehicle', to: true, body: two(cards([
    ['🛵 Motorbike', 'Fast, cheap, everywhere — perfect for one person in city traffic. A bad idea for moving a house.'],
    ['🚚 Truck', 'Carries anything, needs a licence and a bigger budget. Overkill for buying bread.'],
    ['🚌 Bus', 'Built for many people on fixed routes. Wonderful — if your route is one of its routes.'],
  ], 1), col(box('The point', 'Nobody asks “which vehicle is best?”. You ask: <b>what are we carrying, where, how often, with which driver, on what budget?</b> Databases are the same.', 'lam'),
    box('In this chapter', 'You have now seen the four systems run the same CT Shop data. Their differences were real but specific — so the choice depends on <b>your</b> situation.', 'ok')), 'r46') },

  { t: 'Six questions before any brand name', to: true, body: two(steps([
    '<b>Shape</b>: many linked things (orders ↔ products ↔ customers) or self-contained documents?',
    '<b>Correctness</b>: money, stock, grades? You need transactions and constraints everywhere.',
    '<b>Questions</b>: fixed screens only, or new reports every week?',
    '<b>Team & stack</b>: C#/.NET, PHP, Node/Python, Java? What does your ORM support best?',
    '<b>Cost & licence</b>: free at any size, or paid per core?',
    '<b>Operations</b>: who runs backups and upgrades? Managed cloud or your own VPS? How big will it get?',
  ]), col(box('Answer in one sentence each', 'Write the six answers in the README before the first migration. A database outlives most frameworks — it is the hardest thing to change later.', ''),
    box('Measured in this chapter', '17.2: behaviours (DDL, isolation, JSON, ids) · 17.3: documents vs tables (size 2.8×, 119 rewrites) — use them as evidence, not opinions.', 'lam')), 'r64') },

  { t: 'Decision table — real situations (1/2)', giua: true, body: bang3([
    ['Start-up / SaaS web app (Node, Python, Java)', '<b>PostgreSQL</b>', 'free at any size; relational + JSONB + full-text; first-class in Prisma, Django, Spring; managed everywhere (RDS, Supabase, Neon)', 'MySQL'],
    ['Enterprise ERP / internal .NET systems', '<b>SQL Server</b>', 'licences and DBAs already there; SSMS, Reporting/Integration Services, Windows & AD integration; Entity Framework', 'PostgreSQL (to cut licence cost)'],
    ['WordPress, PHP shared hosting (LAMP)', '<b>MySQL / MariaDB</b>', 'WordPress supports only MySQL/MariaDB; every cheap host offers it', '—'],
  ], { he: ['pg', 'pg', 'pg'], fs: 21, w1: 250, dau: 'situation' }).replace(/<tr><th style="width:250px;background:#7a7a7a">situation<\/th>.*?<\/tr>/, '<tr><th style="width:250px;background:#7a7a7a">situation</th><th style="background:#b85a2b;width:170px">pick</th><th style="background:#b85a2b">why</th><th style="background:#b85a2b;width:170px">also fine</th></tr>') + box('How to read it', 'The “pick” is the usual winner, not a law — the six questions can override it. Your company’s existing skills count as much as features.', 'lam') },

  { t: 'Decision table — real situations (2/2)', giua: true, body: bang3([
    ['Product catalogue with varying attributes', '<b>PostgreSQL</b> tables + JSONB', 'fixed columns for price/stock (constraints), JSONB + GIN for attributes — CT Shop’s product.attrs', 'MongoDB'],
    ['High-volume logs & events, flexible payloads', '<b>MongoDB</b> or PostgreSQL partitions', 'append-only, JSON-shaped, often sharded; PostgreSQL partitions + BRIN indexes also go far (Ch 15.4)', 'a log platform (Elasticsearch, ClickHouse)'],
    ['Analytics / dashboards', '<b>PostgreSQL</b> to start', 'window functions, materialized views (Ch 8, 12); move to a column store only at billions of rows', 'ClickHouse, BigQuery (outside this course)'],
    ['MERN side project, learning', '<b>MongoDB</b> or PostgreSQL', 'MongoDB matches the MERN tutorials; PostgreSQL (Supabase / Neon free tiers) teaches skills used at work', '—'],
  ], { he: ['pg', 'pg', 'pg'], fs: 19, w1: 230, dau: 'situation' }).replace(/<tr><th style="width:230px;background:#7a7a7a">situation<\/th>.*?<\/tr>/, '<tr><th style="width:230px;background:#7a7a7a">situation</th><th style="background:#b85a2b;width:190px">pick</th><th style="background:#b85a2b">why</th><th style="background:#b85a2b;width:180px">also fine</th></tr>') },

  { t: 'A decision tree for the team meeting', body: `${cayQuyetDinh()}
${box('Why PostgreSQL is the default leaf', 'It is free at any size, relational where it matters, document-friendly where you need it (JSONB), and extensible (PostGIS, pgvector). The questions above are the situations where something else clearly wins.', 'lam')}` },

  { t: 'Case study 1 — cuongthai.com: PostgreSQL + Prisma', body: two(col(`<ul style="font-size:24px">
<li><b>602</b> Prisma models, <b>57</b> enums, <b>235</b> migrations — deeply relational: users, courses, orders, CT Work…</li>
<li><b>266</b> <code class="i">Json</code> fields (JSONB): settings, AI outputs, flexible forms</li>
<li><b>8</b> migrations add full-text search (<code class="i">tsvector</code>)</li>
<li>a <code class="i">vector(384)</code> column — AI similarity search with <b>pgvector</b>; maps with <b>PostGIS</b></li>
<li>runs on one VPS: <code class="i">api-backend-postgres:16-3.4-pgvector</code></li>
</ul>`), col(box('Why PostgreSQL won here', '① one engine for tables, documents, search, vectors and maps — one backup, one skill set · ② free licence on a small VPS · ③ Prisma’s most complete provider · ④ transactional migrations: a failed migration rolls back cleanly (17.2)', 'ok'),
    sql(`$ grep -c '^model ' prisma/schema.prisma
602
$ grep -cE '^\\s+\\w+\\s+Json' \\
    prisma/schema.prisma
266`, { sm: true, lang: 'bash' })), 'r64') },

  { t: 'Case study 2 — LabFlow AI (graduation project)', giua: true, body: two(col(`<ul style="font-size:26px;gap:12px">
<li>Backend: <b>Spring Boot 3.5</b> (Java) — not Prisma, not Node</li>
<li>Database: <b>PostgreSQL 16</b> in Docker (<code class="i">postgres:16-alpine</code>)</li>
<li>Schema changes: <b>Flyway</b> migrations (<code class="i">V1__init.sql</code>, <code class="i">V2__…</code>, <code class="i">V3__…</code>)</li>
<li>Planned AI features (RAG) can add <b>pgvector</b> in the same database</li>
</ul>`), col(box('The lesson', 'A different language and ORM reached the same answer. The database choice followed the <b>data and the team</b>, not the framework: relational core, JSON where needed, free, and one engine to operate.', 'ok'),
    box('What would change it', 'If LabFlow had to plug into a university that runs everything on SQL Server with its own DBAs, question ② of the tree would win — and that would be a perfectly good choice.', 'lam')), 'r64') },

  { t: 'Mistakes when choosing', giua: true, body: vsd(`<ul style="font-size:25px;gap:12px">
<li>“MongoDB, because no schema = faster” — then re-inventing JOINs and constraints in app code</li>
<li>Choosing what a famous company uses — at their scale and with their team</li>
<li>Three databases for a two-person project “to use the best tool for each part”</li>
<li>Ignoring the licence until the first production invoice</li>
</ul>`, `<ul style="font-size:25px;gap:12px">
<li>Model the data first (ERD, Ch 3); let the shape suggest the store</li>
<li>Match today’s scale; plan the migration path, not the final architecture</li>
<li>One primary database; add a specialised one only with a measured reason</li>
<li>Read the licence and price page on day one</li>
</ul>`, '✗ Choosing by hype', '✓ Choosing by evidence') },

  { t: 'What the choice does NOT decide', to: true, giua: true, body: cards([
    ['📇 Indexes & query plans', 'Every engine needs the right indexes and someone who reads plans (Ch 9–10).'],
    ['🔒 Transactions & concurrency', 'Isolation, locks and lost updates exist everywhere, with different defaults (Ch 11, 17.2).'],
    ['💾 Backups & restore tests', 'A backup you never restored is a hope, not a backup (Ch 15).'],
    ['🧭 Schema design', 'Documents or tables, someone must decide what lives together (Ch 3, 17.3).'],
  ], 2) },

  { t: 'Exercise — choose and justify', to: true, body: two(steps([
    'A café chain wants a website with a blog and online menu, on a cheap PHP host.',
    'A bank’s internal loan system, written in C#, with an existing SQL Server team.',
    'A start-up: Next.js + Prisma marketplace with orders, reviews and flexible product specs.',
    'An IoT project storing millions of sensor readings per day, each with a different JSON payload.',
  ]), `<div data-k="dapan" class="o ok" style="font-size:20px"><div class="h">Suggested answers</div>
1 · WordPress on <b>MySQL/MariaDB</b> — the host decides.<br>
2 · <b>SQL Server</b> — team, licences and tooling are already there.<br>
3 · <b>PostgreSQL</b> — relational orders, JSONB specs + GIN, Prisma.<br>
4 · <b>MongoDB</b> (sharding) or PostgreSQL with partitions — measure both; a time-series store is also an option.</div>`, 'r46') },

  { t: 'Check yourself', to: true, giua: true, body: `
${steps([
    'Name three of the six questions you should answer before naming a database.',
    'Why did both cuongthai.com and LabFlow end up on PostgreSQL even though their backends differ?',
    'Give one situation where SQL Server is the better choice, and say why.',
  ])}
<div data-k="dapan3" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · Any three of: shape, correctness, questions, team & stack, cost & licence, operations.<br>
2 · Relational core + JSONB + extensions (pgvector), free licence, one engine to run — the data and team decided, not the framework.<br>
3 · An enterprise .NET system with SQL Server licences and DBAs already in place.</div>` },

  { t: 'Summary — Chapter 17 and the course', to: true, body: two(`<ul>
<li>Four systems, two shapes: tables (SQL Server, MySQL, PostgreSQL) and documents (MongoDB)</li>
<li>Same data ⇒ same answers; differences live in <b>behaviour</b>, <b>licence</b> and <b>fit</b></li>
<li>Choose with six questions and evidence, not hype</li>
<li>PostgreSQL is a strong default — and everything you learned in Ch 1–16 transfers to the others</li>
</ul>`, col(box('Next', 'Chapter 17 quiz, then the final exam of the course (PE + FE). Labs 1–9 are your portfolio — the CT Shop database you built is real.', 'ok'))) },
]);
