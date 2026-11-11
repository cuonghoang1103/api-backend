/**
 * pr-00-1 — Prisma ORM · Section 0 · Lesson 0.1 "What Prisma solves" (deck của VIDEO, 11/11/2026; web chưa có slide).
 * Bài web: pr-0-1-van-de (content/courses/prisma-orm/s00-intro.mjs). 15 slide = TRỌN bài, MỘT tập prisma-0-1 (chủ kênh 08/11: không tách).
 * Slide 13 (bẫy hiệu năng) = `chay.sh p0-1b` (200.000 hàng, EXPLAIN trước/sau chỉ mục).
 * Output = transcript CHẠY THẬT `bash scratchpad/prisma/demo/chay.sh p0-1` (Node 26.8.1 · Prisma 6.19.3 · PostgreSQL 16.14,
 * container prisma-pg 127.0.0.1:55491) đọc từ demo/out/p0-1/*.txt — không chép tay.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p0-1/dts-lines.txt": "$ wc -l node_modules/.prisma/client/index.d.ts\n    2491 node_modules/.prisma/client/index.d.ts\n$ wc -l prisma/schema.prisma\n      18 prisma/schema.prisma\n",
 "demo/lab/raw-driver.js": "// raw-driver.js — the `pg` driver, no abstraction at all\nimport { Pool } from 'pg';\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\n\nconst { rows } = await pool.query(\n  'SELECT id, full_name, email, created_at FROM users WHERE email = $1',\n  ['an@example.com'],\n);\nconst user = rows[0];\n\nconsole.log(user);\nconsole.log(typeof user.id, typeof user.created_at);\nawait pool.end();\n",
 "demo/out/p0-1/raw-driver.txt": "$ node raw-driver.js\n{\n  id: 42,\n  full_name: 'Nguyen Van An',\n  email: 'an@example.com',\n  created_at: 2026-03-14T09:12:44.318Z\n}\nnumber object\n",
 "demo/lab/raw-bugs.ts": "import { Pool } from 'pg';\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\nconst { rows } = await pool.query(\n  'SELECT id, full_name, email, created_at FROM users WHERE email = $1', ['an@example.com']);\nconst user = rows[0];        // any\nconsole.log(user.fullName);  // column is full_name\nconsole.log(user.emial);     // typo\nconsole.log(user.deleted_at.getTime()); // column not selected\n",
 "demo/out/p0-1/raw-bugs-tsc.txt": "$ npx tsc -p tsconfig.raw.json && echo \"tsc: no errors\"\ntsc: no errors\n",
 "demo/out/p0-1/raw-bugs-run.txt": "$ npx tsx raw-bugs.ts\nundefined\nundefined\nraw-bugs.ts:8\nconsole.log(user.deleted_at.getTime()); // column not selected\n                            ^\n\nTypeError: Cannot read properties of undefined (reading 'getTime')\n    at <anonymous> (raw-bugs.ts:8:29)\n    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)\n\nNode.js v26.8.1\n[exit 1]\n",
 "demo/lab/prisma/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id        Int       @id @default(autoincrement())\n  fullName  String?   @map(\"full_name\")\n  email     String    @unique\n  createdAt DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  deletedAt DateTime? @map(\"deleted_at\") @db.Timestamptz\n\n  @@map(\"users\")\n}\n",
 "demo/out/p0-1/generate.txt": "$ npx prisma generate\nEnvironment variables loaded from .env\nPrisma schema loaded from prisma/schema.prisma\n\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 37ms\n\nStart by importing your Prisma Client (See: https://pris.ly/d/importing-client)\n\nTip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate\n\n",
 "demo/lab/prisma-version.ts": "// prisma-version.ts\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\nconst user = await prisma.user.findUnique({\n  where: { email: 'an@example.com' },\n  select: { id: true, fullName: true, email: true, createdAt: true },\n});\n// type of user: { id: number; fullName: string | null; email: string; createdAt: Date } | null\nconsole.log(user?.fullName);\nawait prisma.$disconnect();\n",
 "demo/out/p0-1/prisma-version.txt": "$ npx tsx prisma-version.ts\nNguyen Van An\n",
 "demo/out/p0-1/log-sql.txt": "$ npx tsx log-sql.ts\nprisma:query SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"full_name\", \"public\".\"users\".\"email\", \"public\".\"users\".\"created_at\" FROM \"public\".\"users\" WHERE (\"public\".\"users\".\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n{\n  id: 42,\n  fullName: 'Nguyen Van An',\n  email: 'an@example.com',\n  createdAt: 2026-03-14T09:12:44.318Z\n}\n",
 "demo/lab/typed-bugs.ts": "import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\nconst user = await prisma.user.findUnique({\n  where: { email: 'an@example.com' },\n  select: { id: true, fullName: true, email: true, createdAt: true },\n});\nuser.fullName;               // may be null — handle it first\nuser?.emial;                 // typo\nuser?.deletedAt.getTime();   // not selected\n",
 "demo/out/p0-1/typed-bugs.txt": "$ npx tsc -p tsconfig.typed.json\ntyped-bugs.ts(7,1): error TS18047: 'user' is possibly 'null'.\ntyped-bugs.ts(8,7): error TS2551: Property 'emial' does not exist on type '{ id: number; email: string; fullName: string | null; createdAt: Date; }'. Did you mean 'email'?\ntyped-bugs.ts(9,7): error TS2339: Property 'deletedAt' does not exist on type '{ id: number; email: string; fullName: string | null; createdAt: Date; }'.\n[exit 2]\n",
 "demo/out/p0-1b/explain-no-index.txt": "$ docker exec prisma-pg psql -U postgres -d prismacourse -c \"EXPLAIN ANALYZE SELECT * FROM users WHERE full_name = 'User 199999';\"\n                                             QUERY PLAN                                              \n-----------------------------------------------------------------------------------------------------\n Seq Scan on users  (cost=0.00..4370.01 rows=1 width=53) (actual time=12.157..12.158 rows=1 loops=1)\n   Filter: (full_name = 'User 199999'::text)\n   Rows Removed by Filter: 200000\n Planning Time: 0.222 ms\n Execution Time: 12.191 ms\n(5 rows)\n\n",
 "demo/out/p0-1b/create-index.txt": "$ docker exec prisma-pg psql -U postgres -d prismacourse -c 'CREATE INDEX users_full_name_idx ON users (full_name);'\nCREATE INDEX\n",
 "demo/out/p0-1b/explain-index.txt": "$ docker exec prisma-pg psql -U postgres -d prismacourse -c \"EXPLAIN ANALYZE SELECT * FROM users WHERE full_name = 'User 199999';\"\n                                                         QUERY PLAN                                                         \n----------------------------------------------------------------------------------------------------------------------------\n Index Scan using users_full_name_idx on users  (cost=0.42..8.44 rows=1 width=53) (actual time=0.046..0.046 rows=1 loops=1)\n   Index Cond: (full_name = 'User 199999'::text)\n Planning Time: 0.316 ms\n Execution Time: 0.085 ms\n(4 rows)\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, ts, js, prs, tp, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-00-1', code: 'PR 0.1', title: 'What Prisma solves', sub: 'Section 0 · Lesson 0.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p0-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const OUT2 = (t) => fs.readFileSync(`${DEMO}/out/p0-1b/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/${t}`, 'utf8').replace(/\n+$/, '');
/** Bỏ dòng trống + dòng quảng cáo "Tip:"/"Start by importing" — chỉ giữ dòng thật có nội dung. */
const gon = (s) => s.split('\n').filter((l) => l.trim() && !/^(Tip:|Start by importing)/.test(l)).join('\n');
/** Bỏ khung gọi (stack trace) Node sau dòng TypeError — chỉ giữ dòng lỗi. */
const catTrace = (s) => s.split('\n').filter((l) => !/^\s+at |^Node\.js v/.test(l) && l.trim()).join('\n');

const dongDts = OUT('dts-lines').match(/(\d+) node_modules/)[1];
const dongSchema = OUT('dts-lines').match(/(\d+) prisma\/schema/)[1];
const fmt = (n) => Number(n).toLocaleString('en-US');

/* Ngăn xếp 5 tầng "Prisma nằm ở đâu" (lớp riêng tiền tố pr- — không trùng lớp của bộ render). */
const STACK = `<style>
.pg .pr-stack{display:flex;flex-direction:column;gap:8px}
.pg .pr-l{display:grid;grid-template-columns:300px 1fr;align-items:center;gap:16px;border:2px solid #d6dde6;border-left:10px solid var(--m);
  border-radius:10px;padding:9px 16px;background:#fff}
.pg .pr-l b{font-size:23px;color:var(--m)}.pg .pr-l span{font-size:19px;line-height:1.35;color:#333}
.pg .pr-l.new{background:#f0fdfa}
</style><div class="pr-stack">
<div class="pr-l" data-k="tang" style="--m:#2563eb"><b>① Your application code</b><span>${c('prisma.user.findUnique({ where: { email } })')} — typed, autocompleted; a wrong field name is a <b>compile error</b></span></div>
<div class="pr-l new" data-k="tang" style="--m:#0d9488"><b>② Generated Prisma Client</b><span>Not a library you install: a package <b>written for your schema</b> by ${c('prisma generate')}</span></div>
<div class="pr-l new" data-k="tang" style="--m:#0d9488"><b>③ Query engine</b><span>Turns your JavaScript object into <b>SQL</b>, runs the connection pool, maps rows back to objects</span></div>
<div class="pr-l" data-k="tang" style="--m:#7c3aed"><b>④ Driver / wire protocol</b><span>Plain SQL over the wire — you can read it in the log and paste it into ${c('psql')}</span></div>
<div class="pr-l" data-k="tang" style="--m:#336791"><b>⑤ Your database</b><span>Still the source of truth. Still enforces its own constraints, long after app checks are bypassed</span></div>
</div>`;

export const slides = lamDeck({ chuong: 'Section 0 — What Prisma solves', bai: '0.1' }, [
  /* 1 */ { cover: true, nhan: 'Section 0 · Lesson 0.1', t: 'What Prisma solves', sub: 'Rows in the database, objects in your program — and the layer that translates between them' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The gap between a <b>row</b> and an <b>object</b> — and who pays for it</li>
    <li>Three bugs the raw driver lets through <b>silently</b> (run for real)</li>
    <li>Where Prisma sits: five layers, from your code down to PostgreSQL</li>
    <li>The same query with Prisma — and the <b>SQL</b> it really sends</li>
    <li>Three things Prisma does better — and three things it is <b>not</b></li>
    <li>Its neighbours, one trap, and the map of the thirteen sections</li></ul>` },
  /* 3 */ { t: 'Your database speaks in rows. Your program thinks in objects.', body:
      tbl(['id', 'full_name', 'email', 'created_at', 'deleted_at'], [['42', "'Nguyen Van An'", "'an@example.com'", '2026-03-14 09:12:44.318+00', null]], { cap: '🐘 PostgreSQL — table <b>users</b>: one row, snake_case columns' }) + two(
      js(`// what your code wants: an object\nconst user = {\n  id: 42,\n  fullName: 'Nguyen Van An',\n  email: 'an@example.com',\n  createdAt: Date,   // a real Date\n  deletedAt: null,\n};`),
      `<div class="o info" style="font-size:24px;line-height:1.55"><div class="h">The translation, field by field</div>${c('full_name')} → ${c('fullName')}<br>timestamp → ${c('Date')}<br>${c('NULL')} → ${c('null')}<br>one row → one ${c('{ … }')}</div>`, 'r64') +
    box('Someone has to translate', `Every application that touches a database does this. The only question: <b>by hand</b>, <b>generated</b>, or <b>pretend it does not exist</b> until it breaks at 3 a.m.`, 'lam') },
  /* 4 */ { t: 'Talking to PostgreSQL with nothing but the driver', body: two(
      js(SRC('raw-driver.js'), { sm: true, hl: [6] }), tp(OUT('raw-driver'), { wrap: 30 }), 'r73') +
    box('It works. Nothing is wrong with that output.', `The column names live in a <b>string</b> the compiler never reads. The shape of the result lives <b>in your head</b>.`, 'xanh') },
  /* 5 */ { t: 'What TypeScript knows about that row: nothing', body: ts(SRC('raw-bugs.ts').split('\n').slice(4).join('\n'), { hl: [2, 3, 4] }) + two(
      tp(OUT('raw-bugs-tsc')), tp(catTrace(OUT('raw-bugs-run')), { wrap: 52 }), '') +
    box('Three bugs, zero compiler complaints', `${c('rows[0]')} is ${c('any')}. A wrong column name, a typo, a column you never selected — all three only appear when a <b>real user</b> hits that path. Multiply by 200 queries.`, 'do2') },
  /* 6 */ { t: 'Where Prisma sits', body: STACK },
  /* 7 */ { t: 'Describe your data once: schema.prisma', body: two(
      prs(SRC('prisma/schema.prisma'), { sm: true, hl: [12, 15] }),
      tp(gon(OUT('generate')), { wrap: 28 }), 'r73') +
    box(`${dongSchema} lines in → ${fmt(dongDts)} lines out`, `${c('prisma generate')} read an ${dongSchema}-line schema and wrote <b>${fmt(dongDts)} lines</b> of TypeScript types into ${c('node_modules/.prisma/client')}. Change the schema, regenerate — the types change with it.`, 'xanh') },
  /* 8 */ { t: 'The same query, with Prisma', body: ts(SRC('prisma-version.ts'), { sm: true, hl: [5, 6, 7, 8] }) +
    tp(OUT('prisma-version') + '\n' + OUT('log-sql').split('\n').slice(0, 2).join('\n'), { wrap: 104 }) },
  /* 9 */ { t: 'Three silent bugs become three red lines', body: ts(SRC('typed-bugs.ts').split('\n').slice(6).join('\n'), { hl: [1, 2, 3] }) +
    tp(OUT('typed-bugs'), { wrap: 104 }) +
    box('The type follows your select', `${c('deletedAt')} is refused because <b>you did not select it</b> — the type is the query, not the whole table. And ${c('| null')} forces you to handle “no such email” before the build passes.`, 'xanh') },
  /* 10 */ { t: 'Three things Prisma does better than the alternatives', body: cards([
      ['① Types come from the database', 'With a driver or query builder you write the interface yourself and <b>hope</b> it matches the table. Prisma generates it. A column becomes nullable ⇒ every forgotten null check turns red on the next build — <b>before</b> deploy.'],
      ['② One file is schema and migration source', 'Edit <code>schema.prisma</code>; Prisma computes the SQL difference. No hand-written <code>ALTER TABLE</code>, no drift between “what the code thinks” and “what the database has”.'],
      ['③ Relations read like objects, run as SQL', '<code>include: { posts: { include: { comments: true } } }</code> loads three levels. You never write the JOIN — or the N+1 loop a naive home-made layer produces (measured in Chapter 9).'],
    ], 3) },
  /* 11 */ { t: 'Three things Prisma is not', body: cards([
      ['① Not an excuse to skip SQL', 'Every Prisma query becomes SQL. When it is slow you read <code>EXPLAIN ANALYZE</code> like everyone else. Prisma removes the typing, <b>not the thinking</b>. The PostgreSQL course exists because this one cannot replace it.'],
      ['② Not a database-swap layer', 'Native types (<code>@db.VarChar(50)</code>), index types, partial indexes, JSON operators, full-text search and array columns are tied to the provider. “Move to MySQL later” has never survived a real schema.'],
      ['③ Not a query optimiser', 'It will happily generate a query that scans four million rows because you asked it to. It adds no index, rewrites no filter, warns about nothing. <code>@@index</code> is <b>your</b> job.'],
    ], 3) },
  /* 12 */ { t: 'Prisma among its neighbours', body: tbl(['Tool', 'Where the types come from', 'Migrations', 'Right choice for'], [
      ['Raw driver — <code>pg</code>, <code>mysql2</code>', 'you, by hand (or <code>any</code>)', '—', 'a script, a one-off, a query no layer can express'],
      ['Query builder — Knex, Kysely', 'you supply them (Kysely: fully typed)', 'not generated', 'SQL-minded teams'],
      ['Drizzle', 'schema written in TypeScript', 'yes, less mature', 'the modern alternative, no engine binary'],
      ['TypeORM, Sequelize', 'entity classes — <b>never checked</b> against the DB', 'yes', 'old codebases; lazy loading hides N+1'],
      ['<b>Prisma</b>', '<b>generated</b> from <code>schema.prisma</code>', '<b>generated</b>', 'strongest end-to-end types; raw SQL via <code>$queryRaw</code>'],
    ], { hl: [4], cap: 'Five ways to talk to the database (course wording, Lesson 0.1)' }) },
  /* 13 */ { t: 'Trap: “the ORM will handle performance”', body: two(
      tp(OUT2('explain-no-index').split('\n').filter((l) => !/^-+$|QUERY PLAN/.test(l.trim())).join('\n'), { wrap: 56, title: 'psql · 200,000 users · no index' }),
      tp(OUT2('create-index') + '\n' + OUT2('explain-index').split('\n').filter((l) => !/^-+$|QUERY PLAN|^\$/.test(l.trim())).join('\n'), { wrap: 56, title: 'psql · after CREATE INDEX' }), '') +
    box('Same Prisma query, different plan', `${c("findMany({ where: { fullName: 'User 199999' } })")} sent the same SQL both times (${c('WHERE "full_name" = $1')}). Only the <b>index</b> changed: a Seq Scan through 200,000 rows became an Index Scan. Prisma adds no index for you — a 40 ms page in development can take 9 s in production.`, 'do2') },
  /* 14 */ { t: 'What this course teaches — and the map ahead', body: two(
      `<div class="o info" style="font-size:21px"><div class="h">Three courses, three jobs</div><b>Node.js, Chapter 7</b> — Prisma as a tool to move the Notes API into PostgreSQL.<br><b>PostgreSQL</b> — the database itself: SQL, joins, indexes, EXPLAIN.<br><b>This course</b> — Prisma itself: schema, generate, migrations, transactions, performance, engines, diagnosis.</div>`,
      tbl(['Stage', 'Sections'], [['Foundations', '0 Setup · 1 What an ORM is · 2 Schema · 3 Relations'], ['Using the client', '4 Read &amp; write · 5 Querying deeply'], ['Keeping data safe', '6 Migrations · 7 Transactions'], ['Production', '8 Types · 9 Performance · 10 Raw SQL · 11 Shipping · 12 Diagnosis']], { cap: 'Thirteen sections, four stages' }), 'r46') +
    box('How to read this course', 'Every command ran on a real PostgreSQL 16 with a real Prisma 6, and every output block is the real output — ugly errors included. Type it again yourself.', 'xanh') },
  /* 15 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Start PostgreSQL 16 in Docker (Lesson 0.2 shows the one-line command)`,
      `Create table ${c('users')} with ${c('full_name')}, insert one row`,
      `Query it with ${c('pg')}: misspell a column — watch tsc stay silent`,
      `Write the 18-line ${c('schema.prisma')}, run ${c('prisma generate')}`,
      `Repeat the typo with Prisma — read the ${c('TS2551')} line`,
    ]), box('Keep these', `<ul><li>Rows ≠ objects: the translation is always there</li><li>Raw driver ⇒ ${c('any')} ⇒ bugs found by users</li><li>Prisma: <b>schema → generated client → SQL</b></li><li>It still sends plain SQL — read it with ${c("log: ['query']")}</li></ul>`, 'lam'), '') },
]);
