/**
 * pr-01-3 — Prisma ORM · Chapter 1 · Lesson 1.3 "How a query becomes SQL" (deck video, 12/11/2026). Bài web: pr-1-3-thanh-sql. Tập prisma-1-3.
 * Output THẬT: `bash scratchpad/prisma/demo/chay.sh p1-3` (dự án demo/p02/hoc-prisma; posts nạp thêm 120.000 hàng; Prisma 6.19.3 · PostgreSQL 16.14):
 * sự kiện query (SQL · PARAMS · DURATION) · EXPLAIN author_id IN (…) ⇒ Bitmap Index Scan posts_author_id_idx 1,874 ms (CÓ @@index — khác bài web
 * vốn không có chỉ mục, Seq Scan 18,5 ms) · EXPLAIN title LIKE '%9999%' ⇒ Seq Scan, 120.179 hàng bị loại, 9,19 ms · ls engine: .node + .wasm.
 * Khối driver adapter = DÁNG mã của bài web, không chạy trong video (ghi trên slide).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/p1/su-kien.mts": "import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });\nprisma.$on('query', (e) => {\n  console.log('SQL     :', e.query);\n  console.log('PARAMS  :', e.params);\n  console.log('DURATION:', e.duration, 'ms');\n});\nawait prisma.user.findMany({\n  where: { email: { contains: 'example' } },\n  include: { posts: { where: { published: true } } },\n  take: 5,\n});\nawait prisma.$disconnect();\n",
 "demo/out/p1-3/su-kien.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/su-kien.mts\nSQL     : SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"email\", \"public\".\"users\".\"full_name\", \"public\".\"users\".\"created_at\" FROM \"public\".\"users\" WHERE \"public\".\"users\".\"email\"::text LIKE $1 ORDER BY \"public\".\"users\".\"id\" ASC LIMIT $2 OFFSET $3\nPARAMS  : [\"%example%\",5,0]\nDURATION: 2 ms\nSQL     : SELECT \"public\".\"posts\".\"id\", \"public\".\"posts\".\"title\", \"public\".\"posts\".\"body\", \"public\".\"posts\".\"published\", \"public\".\"posts\".\"views\", \"public\".\"posts\".\"created_at\", \"public\".\"posts\".\"author_id\" FROM \"public\".\"posts\" WHERE (\"public\".\"posts\".\"published\" = $1 AND \"public\".\"posts\".\"author_id\" IN ($2,$3,$4,$5,$6)) OFFSET $7\nPARAMS  : [true,50,51,52,53,54,0]\nDURATION: 7 ms\n",
 "demo/out/p1-3/explain-like.txt": "$ docker exec prisma-pg psql -U student -d hocprisma -c \"EXPLAIN ANALYZE SELECT * FROM posts WHERE title::text LIKE '%9999%';\"\n                                             QUERY PLAN                                              \n-----------------------------------------------------------------------------------------------------\n Seq Scan on posts  (cost=0.00..3504.50 rows=12 width=63) (actual time=1.714..9.157 rows=21 loops=1)\n   Filter: (title ~~ '%9999%'::text)\n   Rows Removed by Filter: 120179\n Planning Time: 0.206 ms\n Execution Time: 9.190 ms\n(5 rows)\n\n",
 "demo/out/p1-3/engine.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL ls node_modules/.prisma/client | grep -E 'engine|wasm'; npx prisma -v | grep -E 'Computed binaryTarget|Query Engine' | cut -c1-90\nlibquery_engine-darwin-arm64.dylib.node\nquery_engine_bg.js\nquery_engine_bg.wasm\nwasm-edge-light-loader.mjs\nwasm-worker-loader.mjs\nwasm.d.ts\nwasm.js\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\nComputed binaryTarget   : darwin-arm64\nQuery Engine (Node-API) : libquery-engine c2990dca591cba766e3b7ef5d9e8a84796e47ab7 (at nod\n",
 "demo/out/p1-3/explain.txt": "$ docker exec prisma-pg psql -U student -d hocprisma -c 'EXPLAIN ANALYZE SELECT * FROM posts WHERE published = true AND author_id IN (50,51);'\n                                                             QUERY PLAN                                                             \n------------------------------------------------------------------------------------------------------------------------------------\n Bitmap Heap Scan on posts  (cost=79.95..2146.52 rows=2558 width=63) (actual time=0.666..5.286 rows=2563 loops=1)\n   Recheck Cond: (author_id = ANY ('{50,51}'::integer[]))\n   Filter: published\n   Rows Removed by Filter: 2554\n   Heap Blocks: exact=2002\n   ->  Bitmap Index Scan on posts_author_id_idx  (cost=0.00..79.31 rows=5165 width=0) (actual time=0.469..0.469 rows=10224 loops=1)\n         Index Cond: (author_id = ANY ('{50,51}'::integer[]))\n Planning Time: 0.318 ms\n Execution Time: 5.423 ms\n(9 rows)\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, ts, tp, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-01-3', code: 'PR 1.3', title: 'How a query becomes SQL', sub: 'Chapter 1 · Lesson 1.3' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p1-3/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ cd \.\.\/p02\/hoc-prisma && env -u DATABASE_URL /gm, '$ ').replace(/"public"\./g, '');
const plan = (s) => s.split('\n').filter((l) => !/QUERY PLAN|^-+$|^\(\d+ rows\)/.test(l.trim())).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — What an ORM actually is', bai: '1.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 1 · Lesson 1.3', t: 'How a query becomes SQL', sub: 'From a method call on a JavaScript object to a packet carrying SQL — four steps, three engine designs' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The full path: delegate → JSON protocol → engine → rows back to objects</li>
    <li>Why the connection pool lives in the engine, not in your JavaScript</li>
    <li>Seeing both sides at once: SQL, parameters and duration from the client</li>
    <li>Three engine architectures — and the incident one of them caused</li>
    <li>Reading the plan Prisma cannot show you: <code>EXPLAIN ANALYZE</code></li></ul>` },
  /* 3 */ { t: 'The path, end to end', to: true, body: steps([
      '<b>You call a delegate method</b> — a <code>Proxy</code> intercepts <code>.user</code>, then <code>.findMany</code>, and packages the arguments. No SQL exists yet.',
      '<b>Packed into the JSON protocol</b> — model, action, arguments. The boundary between JavaScript and the engine; the client knows no SQL at all.',
      '<b>The engine builds and runs SQL</b> — re-validates against its schema, generates SQL for the provider, takes a connection from <b>its own pool</b>, sends it.',
      '<b>Rows become objects</b> — flat rows reshaped into your <code>include</code> nesting, types converted (TIMESTAMP → Date, NUMERIC → Decimal).',
    ]) },
  /* 4 */ { t: 'The pool lives in the engine', to: true, giua: true, body: cards([
      ['URL, not constructor', 'That is why <code>connection_limit</code> is a URL parameter, not a <code>new PrismaClient()</code> option.'],
      ['Two clients, two pools', 'A second <code>new PrismaClient()</code> is a second pool — Lesson 0.2’s trap, explained.'],
      ['Not shared with pg', 'Prisma’s native pool cannot be shared with a <code>pg</code> client in the same process. Chapter 9 measures the cost; Chapter 11 covers PgBouncer.'],
    ], 3) },
  /* 5 */ { t: 'Both sides at once: the query event', body: ts(SRC('p1/su-kien.mts').split('\n').slice(1, 12).join('\n'), { sm: true, hl: [2, 3, 4, 5] }) +
    tp(gon(OUT('su-kien')).split('\n').map((l) => (l.length > 150 ? l.slice(0, 150) + ' …' : l)).join('\n'), { wrap: 120, fs: 13 }) },
  /* 6 */ { t: 'Three habits hidden in that output', to: true, giua: true, body: cards([
      ['$1, $2 … with params', 'Values never concatenated into the SQL — structurally immune to injection. Chapter 10 is about the one place that guarantee stops.'],
      ['Every column named', 'Prisma never sends <code>SELECT *</code>. Add a column tomorrow and old queries do not silently start fetching it.'],
      ['contains → LIKE \'%…%\'', 'A leading <code>%</code> cannot use a normal B-tree index — on a big table it is a sequential scan (next slide).'],
    ], 3) },
  /* 7 */ { t: 'contains on 120,000 rows: a sequential scan', to: true, giua: true, body: tp(plan(OUT('explain-like')), { wrap: 110, title: 'psql — EXPLAIN ANALYZE … title LIKE \'%9999%\'' }) +
    box('“Prisma is slow” — or the query was always going to be slow?', '<code>Rows Removed by Filter: 120179</code>: PostgreSQL read every row. No index on <code>title</code> helps a pattern that starts with <code>%</code>. Chapter 9 fixes it with a trigram index.', 'do2') +
    box('Check your own query', 'Copy the SQL from the query event (slide 5), put the parameters in, and run it in psql behind <code>EXPLAIN ANALYZE</code>.', 'lam') },
  /* 8 */ { t: 'Three engine architectures', body: tbl(['Design', 'How it runs', 'Trade-off'], [
      ['Binary engine (Prisma 2)', 'a separate process, HTTP on localhost', 'robust; one more process and port; rarely right today'],
      ['Node-API library (default 3–5, and here in 6.19)', '<code>libquery_engine-&lt;platform&gt;.node</code> loaded into your Node process', 'fast — and tied to the exact platform and libc it was built for'],
      ['WebAssembly compiler + driver adapter (6+)', 'SQL compiled in WASM, executed by a normal JS driver', 'no native binary (~18 MB less), no libc mismatch; needs adapter packages'],
    ]) + tp(gon(OUT('engine')).split('\n').filter((l) => !/config|^\s*$/.test(l)).join('\n'), { wrap: 110, title: 'this project — both engine files ship in 6.19.3; Node-API is in use' }) },
  /* 9 */ { t: 'The shape of a driver adapter', body: ts(`// The shape of the WASM / driver-adapter setup (from the lesson — not run in this video)
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
// the pool is now node-postgres's pool — configured by you, shareable with other pg code`, { hl: [5, 6] }) +
    two(box('Why it matters beyond size', 'The connection pool comes back into JavaScript, where you can see and tune it. It is also the only way to reach databases over non-standard transports (Neon over WebSocket, Cloudflare D1, PlanetScale HTTP).', 'xanh'),
      box('What you trade', 'The Rust engine handles some type conversions the JS driver does not. Behaviour is very close but not identical — test around Decimal and BigInt.', ''), '') },
  /* 10 */ { t: 'From CuongThai: the engine mismatch, seven minutes of 502', to: true, giua: true, body: box('18 Aug 2026', 'A deploy script ran <code>docker build .</code>, which picked the default Dockerfile — <code>node:22-alpine</code>, <b>musl</b> — instead of <code>Dockerfile.backend</code>. The generated client still carried the <code>debian-openssl-3.0.x</code> (<b>glibc</b>) engine. Green build, green push, green swap — then an endless restart loop and 502 for seven minutes.', 'do2') +
    box('The lesson written into the repository', '<b>A green build does not mean the image runs.</b> The fix is a libc ↔ engine check before pushing. Chapter 11 shows how to write it, and why <code>binaryTargets</code> stops being optional.', 'lam') },
  /* 11 */ { t: 'Read the plan Prisma cannot show you', body: tp(plan(OUT('explain')), { wrap: 120, title: 'psql — EXPLAIN ANALYZE the SQL copied from the log (author_id IN …)' }) +
    box('The whole performance loop', 'Copy the SQL from the query log → put the parameters in → <code>EXPLAIN ANALYZE</code> → change the schema → measure again. Here the <code>@@index([authorId])</code> from Lesson 0.3 is used: a <b>Bitmap Index Scan</b>, about 5 ms for 2,563 rows.', 'xanh') },
  /* 12 */ { t: 'What runs where', body: tbl(['Where', 'What happens there'], [
      ['<b>Your process</b>', 'generated client: Proxy, argument packing, TypeScript types — no SQL knowledge; with an adapter, also the JS driver and its pool'],
      ['<b>The engine</b>', 'validate against the embedded schema · generate SQL per provider · native-mode pool (URL-configured) · reshape results'],
      ['<b>The database</b>', 'plan and execute: index choice, join order — everything that makes 18 ms be 18 ms or 18 s. Prisma has no say here.'],
    ]) + box('Trap: a stale generated client', 'The engine validates against the schema embedded at <b>generate</b> time, not against the live database. Change the schema, deploy the migration, forget to generate — and client and database disagree. In CI, always run <code>prisma generate</code> after <code>migrate deploy</code>.', 'do2') },
  /* 13 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Add a ${c("$on('query')")} listener; print SQL, params, duration`,
      `Run a ${c('contains')} on a big table; ${c('EXPLAIN ANALYZE')} the SQL`,
      `Run the ${c('author_id IN')} query with and without ${c('@@index')}`,
      `${c('ls node_modules/.prisma/client')} — find your engine files`,
    ]), box('Keep these', `<ul><li>Delegate → JSON protocol → engine → objects</li><li>The native pool lives in the engine (URL options)</li><li>Params are separate; columns are named; ${c('contains')} = LIKE</li><li>The database plans — read it with EXPLAIN</li></ul>`, 'lam'), '') },
]);
