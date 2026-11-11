/**
 * pr-00-2 — Prisma ORM · Section 0 · Lesson 0.2 "Getting Prisma running" (deck video, 11/11/2026). Bài web: pr-0-2-cai-dat. Tập prisma-0-2.
 * Output THẬT: `bash scratchpad/prisma/demo/chay.sh p0-2` — dự án MỚI demo/p02/hoc-prisma (npm 11.19.0 · Node 26.8.1 · Prisma 6.19.3),
 * CSDL hocprisma (role student) trong container prisma-pg 127.0.0.1:55491.
 * Chỗ KHÁC bài web (web chạy Prisma 6.7.0, ghi trong báo cáo): init 6.19.3 sinh thêm prisma.config.ts (import "dotenv/config"), lời "Next steps" khác;
 * index.d.ts 2.408 dòng (web 6.142); trước generate lỗi là "Cannot find module '.prisma/client/default'"; client sinh ra TỰ đọc .env (count = 1).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p0-2/pg-ready.txt": "$ docker exec prisma-pg pg_isready -U student -d hocprisma\n/var/run/postgresql:5432 - accepting connections\n",
 "demo/out/p0-2/prisma-v.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma -v\nprisma                  : 6.19.3\n@prisma/client          : 6.19.3\nComputed binaryTarget   : darwin-arm64\nOperating System        : darwin\nArchitecture            : arm64\nNode.js                 : v26.8.1\nTypeScript              : 5.9.3\nQuery Engine (Node-API) : libquery-engine c2990dca591cba766e3b7ef5d9e8a84796e47ab7 (at node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node)\nPSL                     : @prisma/prisma-schema-wasm 7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7\nSchema Engine           : schema-engine-cli c2990dca591cba766e3b7ef5d9e8a84796e47ab7 (at node_modules/@prisma/engines/schema-engine-darwin-arm64)\nDefault Engines Hash    : c2990dca591cba766e3b7ef5d9e8a84796e47ab7\nStudio                  : 0.511.0\n",
 "demo/out/p0-2/chua-gen.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL node -e \"new (require('@prisma/client').PrismaClient)()\" 2>&1 | grep -m1 '^Error'\nError: Cannot find module '.prisma/client/default'\n",
 "demo/out/p0-2/init.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma init --datasource-provider postgresql\n\nInitialized Prisma in your project\n\n  prisma/\n    schema.prisma\n  prisma.config.ts\n  .env\n\nwarn You already have a .gitignore file. Don't forget to add .env in it to not commit any private information.\n\nNext, choose how you want to set up your database:\nCONNECT EXISTING DATABASE:\n  1. Configure your DATABASE_URL in prisma.config.ts\n  2. Run prisma db pull to introspect your database.\nCREATE NEW DATABASE:\n  Local: npx prisma dev (runs Postgres locally in your terminal)\n  Cloud: npx create-db (creates a free Prisma Postgres database)\n\nThen, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.\nLearn more: https://pris.ly/getting-started\n \n\n",
 "demo/out/p0-2/ls-init.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL ls -A . prisma && grep -v '^#' .env | grep . && grep -n 'dotenv' prisma.config.ts\n.:\n.env\n.gitignore\nnode_modules\npackage-lock.json\npackage.json\nprisma\nprisma.config.ts\n\nprisma:\nschema.prisma\nDATABASE_URL=\"postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public\"\n3:// npm install --save-dev prisma dotenv\n4:import \"dotenv/config\";\n",
 "demo/out/p0-2/env-co.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL node -e \"new (require('@prisma/client').PrismaClient)().user.count().then(n=>console.log('count =',n))\"\ncount = 1\n",
 "demo/out/p0-2/env-mat.txt": "$ cd ../p02/hoc-prisma && mv .env .env.bak && env -u DATABASE_URL node -e \"new (require('@prisma/client').PrismaClient)().user.count().catch(e=>{console.log(e.message.trim().split('\\n').filter(l=>/DATABASE_URL|error/i.test(l)).slice(0,2).join('\\n'))})\"; mv .env.bak .env\nerror: Environment variable not found: DATABASE_URL.\n 7 |   url      = env(\"DATABASE_URL\")\n",
 "demo/p02/schema-buoc4.prisma": "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  fullName  String?  @map(\"full_name\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  @@map(\"users\")\n}\n",
 "demo/out/p0-2/migrate.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma migrate dev --name khoi_tao\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\nPrisma schema loaded from prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"hocprisma\", schema \"public\" at \"127.0.0.1:55491\"\n\nApplying migration `20261111161623_khoi_tao`\n\nThe following migration(s) have been created and applied from new schema changes:\n\nprisma/migrations/\n  └─ 20261111161623_khoi_tao/\n    └─ migration.sql\n\nYour database is now in sync with your schema.\n\nRunning generate... (Use --skip-generate to skip the generators)\nRunning generate... - Prisma Client\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 36ms\n\n\n",
 "demo/out/p0-2/migration-sql.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL cat prisma/migrations/*_khoi_tao/migration.sql\n-- CreateTable\nCREATE TABLE \"users\" (\n    \"id\" SERIAL NOT NULL,\n    \"email\" TEXT NOT NULL,\n    \"full_name\" TEXT,\n    \"created_at\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"users_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"users_email_key\" ON \"users\"(\"email\");\n",
 "demo/out/p0-2/proof.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL grep -c findUnique node_modules/.prisma/client/index.d.ts; grep -o 'model User' node_modules/.prisma/client/schema.prisma; wc -l node_modules/.prisma/client/index.d.ts\n10\nmodel User\n    2408 node_modules/.prisma/client/index.d.ts\n",
 "demo/p02/db.ts": "// src/db.ts — client bạn sẽ import ở khắp nơi\nimport { PrismaClient } from '@prisma/client';\nexport const prisma = new PrismaClient({\n  log: [\n    { emit: 'stdout', level: 'query' },\n    { emit: 'stdout', level: 'warn' },\n    { emit: 'stdout', level: 'error' },\n  ],\n});\n",
 "demo/out/p0-2/d-users.txt": "$ docker exec prisma-pg psql -U student -d hocprisma -c '\\d users'\n                                          Table \"public.users\"\n   Column   |              Type              | Collation | Nullable |              Default              \n------------+--------------------------------+-----------+----------+-----------------------------------\n id         | integer                        |           | not null | nextval('users_id_seq'::regclass)\n email      | text                           |           | not null | \n full_name  | text                           |           |          | \n created_at | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP\nIndexes:\n    \"users_pkey\" PRIMARY KEY, btree (id)\n    \"users_email_key\" UNIQUE, btree (email)\n\n",
 "demo/out/p0-2/log.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/thu-log.ts\nprisma:query BEGIN\nprisma:query SELECT \"public\".\"users\".\"id\" FROM \"public\".\"users\" WHERE (\"public\".\"users\".\"email\" = $1 AND 1=1) OFFSET $2\nprisma:query INSERT INTO \"public\".\"users\" (\"email\",\"full_name\",\"created_at\") VALUES ($1,$2,$3) RETURNING \"public\".\"users\".\"id\"\nprisma:query SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"email\", \"public\".\"users\".\"full_name\", \"public\".\"users\".\"created_at\" FROM \"public\".\"users\" WHERE \"public\".\"users\".\"id\" = $1 LIMIT $2 OFFSET $3\nprisma:query COMMIT\nprisma:query SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"email\", \"public\".\"users\".\"full_name\", \"public\".\"users\".\"created_at\" FROM \"public\".\"users\" WHERE (\"public\".\"users\".\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n{\n  id: 1,\n  email: 'an@example.com',\n  fullName: 'Nguyen Van An',\n  createdAt: 2026-11-11T16:16:24.810Z\n}\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, ts, prs, tp, sql, sh, two, box, cards, c, tbl, steps, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-00-2', code: 'PR 0.2', title: 'Getting Prisma running', sub: 'Section 0 · Lesson 0.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p0-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/p02/${t}`, 'utf8').replace(/\n+$/, '');
const bo = (s, re) => s.split('\n').filter((l) => l.trim() && !re.test(l)).join('\n');
/** Lệnh hiện ngắn (bỏ tiền tố cd/env của máy quay) — chữ output giữ nguyên. */
const gon = (s) => s.replace(/^\$ cd \.\.\/p02\/hoc-prisma && (env -u DATABASE_URL )?/gm, '$ ');

const URL_TO = `<div data-k="url" style="font-family:Menlo,monospace;font-size:21px;background:#1e1e1e;color:#d4d4d4;border-radius:10px;padding:14px 16px;margin-bottom:12px">DATABASE_URL="<span style="color:#c586c0">postgresql://</span><span style="color:#ce9178">student:matkhau</span>@<span style="color:#4ec9b0">localhost:5432</span><span style="color:#dcdcaa">/hocprisma</span><span style="color:#9cdcfe">?schema=public</span>&amp;<span style="color:#b5cea8">connection_limit=10</span>&amp;<span style="color:#f48771">pool_timeout=20</span>"</div>`;

export const slides = lamDeck({ chuong: 'Section 0 — What Prisma solves', bai: '0.2' }, [
  /* 1 */ { cover: true, nhan: 'Section 0 · Lesson 0.2', t: 'Getting Prisma running', sub: 'A database, a schema file, a generated client — in five minutes, then the parts people skip and regret' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The three things Prisma needs before it can do anything</li>
    <li>PostgreSQL in one Docker command; two packages and why they are split</li>
    <li><code>prisma init</code>: every file it writes, and the two that are dangerous</li>
    <li><code>DATABASE_URL</code>, read part by part</li>
    <li>The first model, the first migration, and where the generated client lives</li>
    <li>Four things to fix on day one — and checking the whole chain</li></ul>` },
  /* 3 */ { t: 'Three things before anything useful', to: true, giua: true, body: cards([
      ['🐘 A database it can reach', 'PostgreSQL running somewhere, and a connection string that points at it.'],
      ['📄 A schema file', '<code>prisma/schema.prisma</code> — your models, your datasource, your generator.'],
      ['⚙️ A generated client', 'Written by <code>prisma generate</code> into <code>node_modules</code>. Until then, there is nothing to import.'],
    ], 3) + flow([{ t: '1 · database', s: 'docker run', mau: '#336791' }, { t: '2 · packages', s: 'npm install', mau: '#2d3748' }, { t: '3 · init', s: 'schema + .env', mau: '#0d9488' }, { t: '4 · model', s: 'migrate dev + generate', mau: '#0d9488' }], { h: 160 }) +
    box('Order matters', 'Nothing can be imported until step 4 has generated the client — and nothing can be migrated until step 1 answers.', 'lam') },
  /* 4 */ { t: 'Step 1 — a database to point at', body: sh(`$ docker run -d --name pg-hoc \\
    -e POSTGRES_PASSWORD=matkhau -e POSTGRES_USER=student \\
    -e POSTGRES_DB=hocprisma -p 5432:5432 \\
    -v pg-hoc-data:/var/lib/postgresql/data postgres:16-alpine`, { title: 'the one command (Lesson 0.2)' }) +
    tp(OUT('pg-ready'), { title: 'terminal — this video: same PostgreSQL 16, container prisma-pg, port 55491' }) +
    box('“Running” is not “ready”', `${c('pg_isready')} answers <b>accepting connections</b> — that is the check that matters. No Docker? A local install, Neon, Supabase or Railway work too; only the connection string changes.`, 'lam') },
  /* 5 */ { t: 'Step 2 — one project, two packages', body: tbl(['Package', 'Install as', 'Who uses it'], [
      ['<code>prisma</code>', 'devDependency', 'you, in the terminal: init, generate, migrate, studio — never imported by the running server'],
      ['<code>@prisma/client</code>', 'dependency', 'your application — a placeholder until <code>generate</code> writes your models into it'],
    ]) + two(tp(OUT('prisma-v').split('\n').slice(0, 7).join('\n'), { wrap: 60 }),
      box('Keep the two versions together', 'A newer CLI than client generates code the client cannot read. Pin both to the same version.', 'xanh') +
      box('npm 11 note (seen in this run)', 'npm may block install scripts (<code>npm warn install-scripts</code>). Allow the Prisma packages with <code>npm install-scripts approve prisma @prisma/client @prisma/engines</code>.', ''), '') },
  /* 6 */ { t: 'Import before generate: nothing there yet', to: true, giua: true, body: tp(gon(OUT('chua-gen'))) +
    box('The installed client is a shell', `${c('@prisma/client')} forwards to ${c('node_modules/.prisma/client')}, and that folder does not exist until ${c('prisma generate')} writes it. The error says so plainly.`, 'do2') +
    box('The fix', `Run ${c('npx prisma generate')} — in Prisma 6.19 ${c('migrate dev')} also runs it for you (“Running generate…”, step 4).`, 'xanh') },
  /* 7 */ { t: 'Step 3 — prisma init', body: tp(gon(OUT('init')).split('\n').filter((l) => l.trim()).join('\n'), { wrap: 110, fs: 13 }) +
    box('Prisma 6.19 writes one more file than older guides show', `${c('prisma.config.ts')} appears next to ${c('schema.prisma')} and ${c('.env')}. Note the ${c('warn')} line about ${c('.gitignore')} — it is the line nobody reads.`, 'lam') },
  /* 8 */ { t: 'The files init created — two of them are dangerous', body: tbl(['File', 'What it is', 'Rule'], [
      ['<code>prisma/schema.prisma</code>', 'the source of truth: models, datasource, generator', 'commit, review like code'],
      ['<code>.env</code>', '<code>DATABASE_URL</code> — a password', '<b>never commit</b>'],
      ['<code>.gitignore</code>', 'the safety net — init only <b>warns</b> if it exists', 'check it now: must list <code>.env</code>'],
      ['<code>prisma.config.ts</code>', 'Prisma 6.19+: where the CLI finds schema, migrations, URL (imports <code>dotenv/config</code>)', 'commit'],
      ['<code>node_modules/.prisma/client</code>', 'the generated code — not there yet', 'never commit; regenerate'],
    ], { hl: [1] }) + tp(gon(OUT('ls-init')).split('\n').slice(-3).join('\n'), { title: 'terminal — what init put in .env and prisma.config.ts' }) },
  /* 9 */ { t: 'DATABASE_URL, read part by part', body: URL_TO + tbl(['Part', 'Meaning', 'Common failure'], [
      ['<code>postgresql://</code>', 'protocol — must match <code>provider</code>', 'mismatch ⇒ P1012 at validation'],
      ['<code>student:matkhau</code>', 'user and password', '<code>@ : / ?</code> in a password must be percent-encoded (<code>p@ss</code> → <code>p%40ss</code>)'],
      ['<code>localhost:5432</code>', 'host and port', 'inside Docker Compose: the <b>service name</b>, not localhost'],
      ['<code>/hocprisma</code>', 'the database', 'not the schema — wrong one ⇒ tables in the wrong place'],
      ['<code>?schema=public</code>', 'PostgreSQL schema (namespace)', 'several environments in one database'],
      ['<code>connection_limit</code> · <code>pool_timeout</code>', 'pool size · seconds to wait', 'default cpus×2+1 per process; P2024 = connections held'],
    ]) },
  /* 10 */ { t: 'Trap: the .env that is not there', to: true, giua: true, body: two(
      tp(gon(OUT('env-co')), { wrap: 50, title: 'app, .env present, no dotenv' }),
      tp(gon(OUT('env-mat')).replace(/^\$ .*$/m, '$ mv .env .env.bak && node -e "…user.count()…"'), { wrap: 50, title: 'app, .env moved away' }), '') +
    box('What this run shows (Prisma 6.19.3)', `The generated client found ${c('.env')} in the project folder by itself (${c('count = 1')}). Take the file away and the same call fails with <b>Environment variable not found: DATABASE_URL</b>. Your own code reading ${c('process.env')} still needs ${c("import 'dotenv/config'")} or ${c('node --env-file=.env')}. Keep exactly <b>one</b> ${c('.env')}.`, 'do2') },
  /* 11 */ { t: 'Step 4 — the first model and migrate dev', body: two(prs(SRC('schema-buoc4.prisma'), { sm: true, hl: [11, 12, 13, 14] }),
      tp(bo(gon(OUT('migrate')), /^(Loaded Prisma config|Prisma schema loaded|The following migration|Running generate\.\.\. \(Use)/), { wrap: 40 }), '') },
  /* 12 */ { t: 'Read what migrate dev wrote', body: sql(bo(gon(OUT('migration-sql')), /^\$ /), {}) +
    box('Plain SQL', 'Reviewable in a pull request, runnable in <code>psql</code>, and — the important part — editable <b>before</b> you commit it. Chapter 6 builds on exactly this.', 'xanh') },
  /* 13 */ { t: 'Where the generated client really lives', to: true, giua: true, body: two(steps([
      '<code>prisma generate</code> parses and checks <code>schema.prisma</code> — errors stop here',
      'code is written to <code>node_modules/.prisma/client</code>',
      '<code>@prisma/client</code> re-exports it — the import path never changes',
      'a <code>postinstall</code> hook regenerates it on <code>npm install</code> (so <code>--ignore-scripts</code> ⇒ a client with no models)',
    ]), tp(gon(OUT('proof')), { wrap: 44, title: 'proof: the client is YOURS' }), 'r64') },
  /* 14 */ { t: 'Four things to fix on day one', body: two(steps([
      '<b>Pin versions</b> — <code>"^6.19.3"</code> → <code>"6.19.3"</code> for both packages',
      '<b>Scripts</b> — <code>db:gen</code>, <code>db:mig</code>, <code>db:studio</code>, <code>db:status</code>',
      '<b>Query log on</b> — every SQL Prisma sends, from today',
      '<b>Check .gitignore</b> — <code>.env</code> and <code>node_modules</code>',
    ]), ts(SRC('db.ts'), { sm: true, hl: [3, 4, 5] }), 'r46') +
    box('Trap: ONE PrismaClient, not one per file', 'Each instance opens its own pool. Create it inside a handler, or let a dev server hot-reload it, and <code>max_connections</code> is gone in about ninety seconds (P1001 / too many clients). Export one instance from one module.', 'do2') },
  /* 15 */ { t: 'Check the whole chain: the table', body: tp(bo(OUT('d-users'), /^\$ /), { wrap: 120, title: 'psql — \\d users' }) +
    box('snake_case below, camelCase above', '<code>full_name</code> in the table, <code>fullName</code> in your code — exactly what <code>@map</code> asked for. Primary key and the unique index on <code>email</code> are both there.', 'lam') },
  /* 16 */ { t: 'Check the whole chain: one upsert, logged', body: tp(bo(gon(OUT('log')), /^\$ /), { wrap: 120, fs: 14, title: 'npx tsx src/thu-log.ts' }) +
    box('Every statement on the receipt', 'An <code>upsert</code> became BEGIN → SELECT → INSERT → SELECT → COMMIT. Nothing hidden.', 'xanh') },
  /* 17 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Start PostgreSQL 16, check ${c('pg_isready')}`,
      `${c('npm i -D prisma')} + ${c('npm i @prisma/client')} — same version`,
      `${c('prisma init')}, fix ${c('.env')}, check ${c('.gitignore')}`,
      `Write the User model, ${c('migrate dev --name khoi_tao')}, read the SQL`,
      `Turn the query log on and run one query`,
    ]), box('Keep these', `<ul><li>Three things: database, schema, generated client</li><li>${c('prisma')} = dev tool, ${c('@prisma/client')} = runtime</li><li>${c('.env')} is a password — never commit</li><li>One PrismaClient for the whole app</li></ul>`, 'lam'), '') },
]);
