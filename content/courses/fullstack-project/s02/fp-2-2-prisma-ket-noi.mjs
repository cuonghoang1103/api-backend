/**
 * 2.2 — Kết nối Prisma và migration đầu tiên (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: PostgreSQL 18.7 (postgres:18-alpine), Prisma 7.10.1 + @prisma/adapter-pg 7.10.1, Node 22.22.2, npm 10.9.7.
 * Phát hiện thật 24/11: dist-tag latest của prisma = 8.0.0-rc.35 trong khi @prisma/client latest = 7.10.1; `prisma init` 7.10.1 tự cài
 * "agent skills" (.claude/.agents/.windsurf, ~550 KB) và đặt tên prisma7.config.ts (import dotenv/config dù không cài dotenv);
 * env('DATABASE_URL') làm cả `prisma generate` hỏng khi không có biến; npm audit 3 high (effect ≤3.22.0 qua @prisma/config), `audit fix --force`
 * đòi hạ prisma về 6.12.0 ⇒ dùng overrides effect 3.22.5 (+ npm update effect); ảnh postgres:18 đổi chỗ dữ liệu (mount /var/lib/postgresql/data bị từ chối).
 * Sự cố có nguồn (GET 200, 24/11/2026): GitLab postmortem 31/01/2017.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const OUT_PG18_VOLUME = `$ docker run --rm --name fsp-pgv -e POSTGRES_PASSWORD=x -v fsp-pgv:/var/lib/postgresql/data postgres:18-alpine     # cách của mọi hướng dẫn cũ (PG ≤ 17)
Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).  This better reflects how
       PostgreSQL itself works, and how upgrades are to be performed.

       See also https://github.com/docker-library/postgres/pull/1259

       Counter to that, there appears to be PostgreSQL data in:
         /var/lib/postgresql/data (unused mount/volume)

       This is usually the result of upgrading the Docker image without
       upgrading the underlying database using "pg_upgrade" (which requires both
       versions).`;

const OUT_DIST_TAGS = `$ npm view prisma dist-tags.latest
8.0.0-rc.35
$ npm view @prisma/client dist-tags.latest
7.10.1`;

const OUT_KHONG_GHIM = `$ npm install -D prisma &amp;&amp; npm install @prisma/client

found 0 vulnerabilities

found 0 vulnerabilities
$ npm ls prisma @prisma/client
fsp-p@1.0.0 /tmp/fsp-p
+-- @prisma/client@7.10.1
| \`-- prisma@8.0.0-rc.35 deduped
\`-- prisma@8.0.0-rc.35
$ npx prisma --version
8.0.0-rc.35`;

const OUT_INIT = `$ npx prisma init --datasource-provider postgresql --output ../src/generated/prisma
- Installing skills
✔ Skills installed

Initialized Prisma in your project

  prisma/
    schema.prisma
  prisma7.config.ts
  .gitignore
  .claude/skills/
  .windsurf/skills/
  .agents/skills/
  skills-lock.json

Next, choose how you want to set up your database:

CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma7.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

Learn more: https://pris.ly/getting-started
 `;

const OUT_INIT_NO_SKILLS = `$ npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills

Initialized Prisma in your project

  prisma/
    schema.prisma
  prisma7.config.ts
  .gitignore

warn Prisma would have added DATABASE_URL but it already exists in .env.

Next, choose how you want to set up your database:`;

const OUT_GENERATE_THIEU_ENV = `$ npx prisma generate      # máy CI: không có .env, không có DATABASE_URL
Failed to load config file "/home/…/chiase/apps/api" as a TypeScript/JavaScript module. Error: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL.`;

const CONFIG = `// Cấu hình Prisma CLI (Prisma 7). CLI KHÔNG tự đọc .env nữa ⇒ nạp bằng hàm có sẵn của Node 22, không cần gói dotenv.
import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile('.env');
} catch {
  // không có .env (CI, Docker) ⇒ biến môi trường phải được đặt sẵn từ bên ngoài
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // KHÔNG dùng env('DATABASE_URL') của prisma/config: nó ném lỗi ngay khi nạp tệp này,
  // kể cả với "prisma generate" — lệnh không cần CSDL (CI, docker build sẽ hỏng).
  datasource: { url: process.env.DATABASE_URL },
});`;

const OUT_GENERATE_SAU_SUA = `$ npx prisma generate      # sau khi sửa prisma.config.ts, vẫn không có DATABASE_URL
✔ Generated Prisma Client (7.10.1) to ./src/generated/prisma in 55ms
$ npx prisma migrate deploy     # lệnh CẦN CSDL thì vẫn báo rõ
Error: The datasource.url property is required in your Prisma config file when using prisma migrate deploy.`;

const SCHEMA_V1 = `// Lược đồ ChiaSe — viết theo docs/schema-nhap.sql (Chương 1). Tên model/trường kiểu TypeScript (camelCase),
// tên bảng/cột trong PostgreSQL kiểu SQL (snake_case) nhờ @@map/@map.

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id           String   @id @default(uuid(7)) @db.Uuid
  email        String   @unique
  passwordHash String   @map("password_hash")
  displayName  String   @map("display_name") @db.VarChar(50)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@map("users")
}`;

const OUT_MIGRATE_INIT = `$ npx prisma migrate dev --name init_users
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "chiase", schema "public" at "localhost:41812"

Applying migration \`20261124120000_init_users\`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20261124120000_init_users/
    └─ migration.sql

Your database is now in sync with your schema.`;

const MIGRATION_INIT = `-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");`;

const OUT_GENERATE = `$ npx prisma generate

✔ Generated Prisma Client (7.10.1) to ./src/generated/prisma in 49ms`;

const DB_PRISMA_V1 = `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { config } from '../config.js';

// MỘT PrismaClient cho cả tiến trình (nó giữ một pool kết nối). Tạo mới mỗi request ⇒ cạn kết nối Postgres.
const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
  max: 10, // tối đa 10 kết nối trong pool
  connectionTimeoutMillis: 3_000, // mặc định của pg là 0 = chờ MÃI nếu CSDL treo
});
export const prisma = new PrismaClient({ adapter });`;

const OUT_SUA_MIGRATION_CU = `# sửa tay migration ĐÃ áp dụng (init_users: VARCHAR(50) → VARCHAR(80)), rồi:
$ npx prisma migrate dev

- The migration \`20261124120000_init_users\` was modified after it was applied.
- Drift detected: Your database schema is not in sync with your migration history.

The following is a summary of the differences between the expected database schema given your migrations files, and the actual schema of the database.

It should be understood as the set of changes to get from the expected schema to the actual schema.

[*] Changed the \`users\` table
  [*] Altered column \`display_name\` (type changed)


We need to reset the "public" schema at "localhost:41812"

You may use prisma migrate reset to drop the development database.
All data will be lost.`;

const OUT_AUDIT = `$ npm audit
# npm audit report

effect  &lt;=3.22.0
Severity: high
Effect: ReDoS in Schema.TemplateLiteral compiled regex - https://github.com/advisories/GHSA-7589-6fvf-x4pw
fix available via \`npm audit fix --force\`
…
  node_modules/@prisma/config
    prisma  &gt;=6.13.0-dev.1
    Depends on vulnerable versions of @prisma/config
    node_modules/prisma

3 high severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
$ npm audit --omit=dev      # chỉ gói chạy trong production

To address all issues (including breaking changes), run:
  npm audit fix --force`;

const OUT_OVERRIDES = `# package.json gốc thêm: "overrides": { "effect": "3.22.5" }
$ npm install &amp;&amp; npm ls effect
npm error code ELSPROBLEMS
npm error invalid: effect@3.20.0 /home/…/chiase/node_modules/effect
$ npm update effect      # buộc npm giải lại gói này trong lockfile
$ npm ls effect
  \`-- prisma@7.10.1
    \`-- @prisma/config@7.10.1
      \`-- effect@3.22.5 overridden

$ npm audit
found 0 vulnerabilities`;

const THE = [
  lienKet({ khoa: 'prisma-orm', bai: 'pr-1-2-generate-viet-gi', title: 'Prisma ORM 1.2 — prisma generate thật sự viết ra cái gì', sub: 'Mở từng tệp trong thư mục generated.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-6-1-migration-la-gi', title: 'Prisma ORM 6.1 — Migration thật sự là gì', sub: 'Bảng _prisma_migrations, checksum, thứ tự.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-6-2-shadow-database', title: 'Prisma ORM 6.2 — Shadow database', sub: 'Vì sao migrate dev cần quyền tạo CSDL tạm.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-6-4-troi-dat', title: 'Prisma ORM 6.4 — Trôi dạt, và tiếp quản CSDL có sẵn', sub: 'Đọc thông báo "Drift detected" cho đúng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-7-2-luoc-do-va-migration', title: 'Node.js 7.2 — Lược đồ, và migration sống sót được trên production', sub: 'Migration mở rộng–thu hẹp, đổi schema không downtime.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'GitLab — Postmortem of database outage of January 31 (2017)', 'Xoá nhầm thư mục dữ liệu của máy chính thay vì máy phụ; ~300 GB mất trong vài giây; bản pg_dump hằng ngày hoá ra rỗng.', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/'),
  nguon('📘', 'Prisma Docs — Prisma Config reference', 'prisma.config.ts: schema, migrations, datasource; CLI Prisma 7 không tự đọc .env.', 'https://www.prisma.io/docs/orm/reference/prisma-config-reference'),
  nguon('📘', 'docker-library/postgres PR #1259', 'Từ PostgreSQL 18, ảnh Docker lưu dữ liệu ở /var/lib/postgresql/18/docker.', 'https://github.com/docker-library/postgres/pull/1259'),
  nguon('📘', 'npm Docs — overrides', 'Ép phiên bản một gói nằm sâu trong cây phụ thuộc.', 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides'),
].join('\n');

const DOCKER_RUN = `docker run -d --name chiase-pg \\
  -p 127.0.0.1:41812:5432 \\
  -e POSTGRES_USER=chiase -e POSTGRES_PASSWORD=chiase -e POSTGRES_DB=chiase \\
  -v chiase-pgdata:/var/lib/postgresql \\
  --memory 1g \\
  postgres:18-alpine

docker exec chiase-pg psql -U chiase -tAc 'select version()'`;

const OUT_PG_VERSION = 'PostgreSQL 18.7 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit';

const CAI_GHIM = `npm install -w apps/api --save-exact @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1
npm install -D -w apps/api --save-exact prisma@7.10.1`;

const INIT_GOC = `// This file was generated by Prisma, and assumes you have installed the following:
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});`;

const CONFIG_V0 = `import { defineConfig, env } from 'prisma/config';
// …
  datasource: { url: env('DATABASE_URL') },   // trông "chặt chẽ" hơn — và đó là cái bẫy`;

const MERMAID = `flowchart LR
  S["schema.prisma (bạn sửa)"] -->|"migrate dev"| M["migrations/…/migration.sql (commit vào git)"]
  M -->|áp dụng| DB[("PostgreSQL + bảng _prisma_migrations")]
  S -->|generate| G["src/generated/prisma (KHÔNG commit)"]
  G --> A["db/prisma.ts → services"]
  A -->|"adapter-pg (pool)"| DB`;

export default {
  title: '2.2 — Connecting Prisma and the first migration|||2.2 — Kết nối Prisma và migration đầu tiên',
  slug: 'fp-2-2-prisma-ket-noi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'PostgreSQL 18 trong Docker (và vì sao lệnh mount volume cũ bị từ chối), cài Prisma 7.10.1 GHIM phiên bản (dist-tag latest đang là 8.0.0-rc.35), đọc kỹ những gì prisma init tự thêm vào repo, prisma.config.ts không làm hỏng CI, migration đầu tiên, Prisma Client sinh ở đâu và vì sao không commit, sửa migration đã áp dụng thì sao, npm audit và overrides — kèm vụ GitLab mất dữ liệu 31/01/2017.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Database</span>
<h2>A real PostgreSQL, a pinned Prisma, and the first migration — reading every message the tools print</h2>
<p class="lead">This lesson connects the API to PostgreSQL through Prisma and creates the first table with a <strong>migration</strong>: a numbered SQL file that lives in Git and rebuilds the same schema on any machine. Along the way the tools tried to trick us five times — a release-candidate CLI, a generator that wrote AI files into the repo, a config that broke CI, a "fix" that downgraded Prisma, and a Docker volume path that changed. All outputs are real (24/11/2026, PostgreSQL 18.7, Prisma 7.10.1).</p>

<h3>Everyday picture: the renovation logbook</h3>
<p>A building keeps a logbook: "No. 1 — build ground floor. No. 2 — add a door on the east wall." A new owner can rebuild the exact same building by following the entries in order, and nobody tears out a page that the builders already carried out — you add a new entry instead. Migrations are that logbook for your database; the table <code>_prisma_migrations</code> is the list of entries already carried out.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>Step 1 — PostgreSQL in Docker</h3>
<pre><code class="language-bash">${DOCKER_RUN}</code></pre>
<div class="out">${OUT_PG_VERSION}</div>
<ul>
<li><code>-p 127.0.0.1:41812:5432</code>: only your machine can reach it. <code>-p 41812:5432</code> would listen on every network interface — on a café Wi-Fi, with password <code>chiase</code>.</li>
<li><code>-v chiase-pgdata:/var/lib/postgresql</code>: a named volume, so <code>docker rm</code> does not delete your data.</li>
<li><code>--memory 1g</code>: a dev database does not need more, and your laptop also runs Vite and a browser.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — the volume path of every older tutorial.</strong> Up to PostgreSQL 17 the official image kept data in <code>/var/lib/postgresql/data</code>. Version 18 moved it to <code>/var/lib/postgresql/18/docker</code> (so future upgrades with <code>pg_upgrade</code> can keep two versions side by side). Copy the old command and the container refuses to start:</p></div>
<div class="out">${OUT_PG18_VOLUME}</div>
<p>Mount the parent folder <code>/var/lib/postgresql</code> as above. The general lesson: when a major version changes, <em>read the release notes of the Docker image</em>, not only of the database.</p>

<h3>Step 2 — Install Prisma, pinned</h3>
<p>The habit "just <code>npm install prisma</code>" broke in 2026. Look at what the registry calls <code>latest</code>:</p>
<div class="out">${OUT_DIST_TAGS}</div>
<div class="out">${OUT_KHONG_GHIM}</div>
<p>The CLI's <code>latest</code> tag points to a <strong>release candidate of the next major version</strong>, while the client's <code>latest</code> is the stable 7.10.1. Install both without a version and you get a CLI and a client from different majors — the generated code may not match the runtime. Always pin the three packages to the same exact version:</p>
<pre><code class="language-bash">${CAI_GHIM}</code></pre>
<p><code>--save-exact</code> writes <code>"7.10.1"</code> instead of <code>"^7.10.1"</code>, so nobody upgrades Prisma by accident. Upgrades become deliberate commits ("chore: Prisma 7.10.1 → 7.11.0") that run the whole test suite.</p>
<p>Why the extra <code>@prisma/adapter-pg</code>? Since Prisma 7 the client talks to the database through a <strong>driver adapter</strong> — here the well-known <code>pg</code> driver — instead of a downloaded Rust engine. Fewer binaries in Docker images, and the connection pool is the ordinary <code>pg</code> pool you can configure.</p>

<h3>Step 3 — <code>prisma init</code>, and reading what a generator did</h3>
<div class="out">${OUT_INIT}</div>
<p>Before trusting it, <code>git status</code>. Prisma 7.10.1 had: downloaded "agent skills" (instructions for AI coding assistants) into <strong>three hidden folders</strong>, about 550 KB, with symlinks between them; named the config <code>prisma7.config.ts</code>; and written a config that imports a package we never installed:</p>
<pre><code class="language-ts">${INIT_GOC}</code></pre>
<p>It also appended a placeholder <code>DATABASE_URL</code> to the existing <code>.env</code>. None of that is malicious, but none of it was asked for, and on a team the AI folders would show up in a pull request nobody can explain. We deleted the extras and re-ran with the flag shown in <code>prisma init --help</code>:</p>
<div class="out">${OUT_INIT_NO_SKILLS}</div>
<p>Rule for any generator (create-vite, Spring Initializr, prisma init, <code>nest new</code>): <strong>run it on a clean working tree, then read <code>git status</code> and every new file before committing.</strong></p>

<h3>Step 4 — <code>prisma.config.ts</code> that does not break CI</h3>
<p>Prisma 7's CLI no longer reads <code>.env</code> by itself. Node 22 can: <code>process.loadEnvFile()</code>. Our first version used Prisma's strict helper:</p>
<pre><code class="language-ts">${CONFIG_V0}</code></pre>
<p>On a CI runner or inside <code>docker build</code> there is no <code>.env</code> and no database — and <code>prisma generate</code>, which needs neither, died while loading the config:</p>
<div class="out">${OUT_GENERATE_THIEU_ENV}</div>
<p>The final config reads the variable plainly; commands that really need the database still fail with a clear message:</p>
<pre><code class="language-ts">${CONFIG}</code></pre>
<div class="out">${OUT_GENERATE_SAU_SUA}</div>
<p>And <code>.env.example</code> gets the new line (the real <code>.env</code> stays out of Git):</p>
<pre><code class="language-ini">DATABASE_URL=postgresql://chiase:chiase@localhost:41812/chiase</code></pre>

<h3>Step 5 — The first model and the first migration</h3>
<pre><code class="language-prisma">${SCHEMA_V1}</code></pre>
<p>Model and field names follow TypeScript (<code>passwordHash</code>), table and column names follow SQL (<code>password_hash</code>) thanks to <code>@map</code>/<code>@@map</code> — exactly the draft SQL from lesson 1.2. Lesson 2.3 explains every attribute and fixes one weakness of this first version.</p>
<div class="out">${OUT_MIGRATE_INIT}</div>
<pre><code class="language-sql">${MIGRATION_INIT}</code></pre>
<p>Notice what <code>migrate dev</code> did <em>not</em> print: "Generated Prisma Client". Prisma 6 generated the client automatically after each migration; <strong>Prisma 7 does not</strong>. Run it yourself:</p>
<div class="out">${OUT_GENERATE}</div>

<h3>Step 6 — Where the client lives, and why it is not committed</h3>
<p><code>src/generated/prisma/</code> now holds TypeScript files: <code>client.ts</code>, <code>models/User.ts</code> (1,160 lines for one model), enums, input types. It is <em>built from</em> <code>schema.prisma</code>, like <code>dist/</code> is built from <code>src/</code>, so it does not go into Git. Three consequences:</p>
<ul>
<li><code>.gitignore</code> and <code>.prettierignore</code> get <code>apps/api/src/generated</code> — otherwise Prettier flagged 9 generated files on our first run.</li>
<li><code>apps/api/package.json</code> gets <code>"postinstall": "prisma generate"</code>: every <code>npm ci</code> (teammate, CI, Docker) rebuilds the client. We checked on a fresh clone: <code>npm ci</code> → the folder exists, no <code>.env</code> needed.</li>
<li>One client for the whole process, with an explicit pool:</li>
</ul>
<pre><code class="language-ts">${DB_PRISMA_V1}</code></pre>
<p><code>connectionTimeoutMillis</code> matters: the <code>pg</code> default is 0, meaning "wait forever" for a new connection. Lesson 2.3 shows a second way a database can hang and how the health check survives it.</p>

<h3>Step 7 — The migration you must never edit</h3>
<p>Tempting idea: "the column should be 80 characters, I'll just fix the old migration file." We tried it on the already-applied <code>init_users</code>:</p>
<div class="out">${OUT_SUA_MIGRATION_CU}</div>
<p>Prisma stores a checksum of every applied migration. Change the file and it detects a mismatch and proposes to <strong>reset</strong> — drop every table and replay from zero. On your laptop that costs some seed data. Pointed at a shared or production database it is a disaster. Rule: <strong>an applied migration is history; change the schema with a new migration.</strong> We restored the file; <code>migrate status</code> went back to "up to date".</p>

<h3>⚠️ Real incident: the wrong database — GitLab, 31 January 2017</h3>
<p>While fighting replication problems late at night, a GitLab engineer ran a command to wipe the data directory of the <strong>secondary</strong> database server — in a terminal that was connected to the <strong>primary</strong>. About 300 GB were removed before he stopped it a second or two later. Then the backups: the daily <code>pg_dump</code> to S3 had been silently failing (the bucket was empty), and the team restored from a disk snapshot taken six hours earlier for staging. GitLab.com was down about 18 hours; changes made between 17:20 and 00:00 UTC were lost — roughly 5,000 projects, 5,000 comments and 700 new user accounts (GitLab postmortem). What it means for you today:</p>
<ul>
<li>Know which database a command will hit <em>before</em> pressing Enter. <code>migrate dev</code> and <code>migrate reset</code> are for development databases only; production gets <code>migrate deploy</code> (Chapter 11), which never resets.</li>
<li>Different credentials per environment: your laptop's <code>.env</code> should not be <em>able</em> to reach production.</li>
<li>A backup you have never restored is a hope, not a backup.</li>
</ul>

<h3>Step 8 — <code>npm audit</code> says "3 high", and <code>--force</code> is the wrong answer</h3>
<div class="out">${OUT_AUDIT}</div>
<p>Read the tree: the vulnerable package is <code>effect</code>, used by <code>@prisma/config</code>, used by the Prisma <em>CLI</em> to load the config file. It is not on the path of any HTTP request. And look at the proposed fix: <strong>"Will install prisma@6.12.0, which is a breaking change"</strong> — a downgrade of a whole major version. Running it would break the project to silence a warning. (<code>--omit=dev</code> still lists it, because <code>@prisma/client</code> declares the CLI as an optional peer.) The precise fix is to override only the vulnerable package to a patched version, then make npm re-resolve it:</p>
<div class="out">${OUT_OVERRIDES}</div>
<p>Then verify Prisma still works (<code>validate</code>, <code>generate</code>, <code>migrate status</code> — all fine) and write the reason next to the override in the commit message, so whoever upgrades Prisma later knows when to remove it.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Edit schema.prisma</span><span class="lz-d">the only place you describe tables</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">npx prisma migrate dev --name …</span><span class="lz-d">diff → new SQL file → applied to the dev DB</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Read migration.sql</span><span class="lz-d">it is what production will run — review it like code</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">npx prisma generate</span><span class="lz-d">Prisma 7 no longer does it for you</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Commit schema + migration</span><span class="lz-d">never the generated client, never .env</span></div>
</div>

${spring(true, 'In Spring Boot the same job is split differently: JPA entities describe the tables (like schema.prisma) and Flyway runs numbered SQL files V1__init.sql, V2__… (like prisma/migrations) — you write the SQL yourself instead of generating it. The rule "never edit an applied migration" is identical; Flyway also refuses with a checksum mismatch.', [
  ['sb-6-1-entity-repository', 'Spring Boot 6.1 — Entities and repositories'],
  ['sb-8-1-vi-sao-flyway', 'Spring Boot 8.1 — Why not rely on Hibernate ddl-auto'],
  ['sb-8-2-viet-migration', 'Spring Boot 8.2 — Writing versioned migration scripts'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"What is a migration and why not just let the ORM sync the schema?"</strong> — A versioned, reviewed, repeatable change script. Auto-sync (<code>db push</code>, <code>ddl-auto=update</code>) cannot rename safely, cannot be reviewed, and does not leave a history to replay on production.</li>
<li><strong>"Can you edit a migration after it ran?"</strong> — No; tools store checksums and will refuse or demand a reset. Write a new migration.</li>
<li><strong>"Why pin exact versions for some packages?"</strong> — Tools that generate code (ORM CLI + client) must match exactly; and dist-tags like <code>latest</code> can point to pre-releases.</li>
<li><strong>"npm audit shows a high vulnerability. What do you do?"</strong> — Find the path (<code>npm why</code>), judge whether it is reachable in production, prefer a targeted override or upgrade, never blindly <code>audit fix --force</code>, verify, document.</li>
<li><strong>"Should generated code be committed?"</strong> — Usually not: regenerate it in <code>postinstall</code>/build from the committed source (schema). Commit the source of truth, not the output.</li>
</ol>

<h3>🧪 Lab 2.2 (60 min) — connect your API</h3>
<div class="callout ok">
<ol>
<li>Start <code>chiase-pg</code> with the command in Step 1 (named volume, bound to 127.0.0.1). Check the version.</li>
<li>Install the three Prisma packages pinned to the same exact version; run <code>npm ls prisma @prisma/client @prisma/adapter-pg</code>.</li>
<li><code>npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills</code>; read <code>git status</code>; rename to <code>prisma.config.ts</code> and write it as in Step 4.</li>
<li>Prove the CI trap: temporarily rename <code>.env</code>, run <code>npx prisma generate</code> — it must succeed. Put <code>.env</code> back.</li>
<li>Write the <code>User</code> model, <code>npx prisma migrate dev --name init_users</code>, read the SQL, <code>npx prisma generate</code>.</li>
<li>Add the ignores and the <code>postinstall</code> script; run <code>npm audit</code> and handle what you find as in Step 8.</li>
</ol>
<p><strong>Done when:</strong> <code>npx prisma migrate status</code> says "Database schema is up to date!", <code>git status</code> shows the migration folder and <code>migration_lock.toml</code> as new files and nothing under <code>src/generated</code>.</p>
<p><strong>Rubric (10 pts):</strong> DB bound to localhost with a named volume (2) · versions pinned and equal (2) · config works without <code>.env</code> for generate (2) · migration committed, client ignored, postinstall present (3) · audit handled without <code>--force</code> (1).</p>
</div>
<details><summary>Solution</summary>
<p>Exact files: <code>apps/api/prisma.config.ts</code>, <code>apps/api/prisma/schema.prisma</code>, <code>apps/api/prisma/migrations/20261124120000_init_users/migration.sql</code> in the ChiaSe repo (tag <code>ch2</code>). If <code>migrate dev</code> says <code>P1001: Can't reach database server</code>: the container is not running or the port in <code>DATABASE_URL</code> is not 41812. If it says the user cannot create a database: <code>migrate dev</code> needs to create a temporary <em>shadow database</em>; the <code>POSTGRES_USER</code> of the Docker image is a superuser, a hand-made user may not be (see the Prisma ORM lesson 6.2). If <code>npm ls</code> shows <code>8.0.0-rc…</code> anywhere, you installed without a version.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">migration</span><span class="v">Numbered SQL change file, committed, applied once per database in order.</span></div>
  <div class="kv"><span class="k">_prisma_migrations</span><span class="v">Table where Prisma records which migrations ran, with checksums.</span></div>
  <div class="kv"><span class="k">driver adapter</span><span class="v">Prisma 7's bridge to a normal JS driver (here pg) instead of a Rust engine.</span></div>
  <div class="kv"><span class="k">dist-tag</span><span class="v">A label on an npm version (latest, next, rc); latest is not always stable.</span></div>
  <div class="kv"><span class="k">postinstall</span><span class="v">npm script run automatically after install — used to regenerate the client.</span></div>
  <div class="kv"><span class="k">overrides</span><span class="v">package.json field forcing the version of a nested dependency.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>PostgreSQL 18 in Docker: bind to 127.0.0.1, named volume at <code>/var/lib/postgresql</code>.</li>
<li>Pin prisma, @prisma/client and @prisma/adapter-pg to the same exact version; <code>latest</code> was a release candidate.</li>
<li>Read every file a generator writes; <code>--no-skills</code>; config must not break <code>generate</code> without a database.</li>
<li>schema → <code>migrate dev</code> → read SQL → <code>generate</code> (manual in Prisma 7) → commit schema + migration, not the client.</li>
<li>Never edit an applied migration; never point dev tools at production (GitLab 2017).</li>
<li><code>npm audit fix --force</code> wanted to downgrade Prisma; a targeted override fixed it.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Cơ sở dữ liệu</span>
<h2>Một PostgreSQL thật, một Prisma được ghim phiên bản, và migration đầu tiên — đọc từng dòng công cụ in ra</h2>
<p class="lead">Bài này nối API với PostgreSQL qua Prisma và tạo bảng đầu tiên bằng một <strong>migration</strong>: tệp SQL có đánh số, nằm trong Git, dựng lại đúng lược đồ đó trên bất kỳ máy nào. Dọc đường, công cụ đã gài bẫy chúng tôi năm lần — một CLI bản thử nghiệm, một trình sinh mã ghi tệp AI vào repo, một tệp cấu hình làm hỏng CI, một lệnh "sửa" hạ cấp Prisma, và một đường dẫn volume Docker đã đổi. Mọi output đều thật (24/11/2026, PostgreSQL 18.7, Prisma 7.10.1).</p>

<h3>Liên tưởng đời thường: sổ nhật ký sửa nhà</h3>
<p>Một toà nhà có cuốn sổ: "Số 1 — xây tầng trệt. Số 2 — trổ cửa ở tường phía đông." Chủ mới làm theo từng dòng đúng thứ tự là dựng lại được y hệt, và không ai xé trang mà thợ đã làm xong — muốn đổi thì ghi thêm dòng mới. Migration chính là cuốn sổ đó của cơ sở dữ liệu; bảng <code>_prisma_migrations</code> là danh sách những dòng đã làm xong.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>Bước 1 — PostgreSQL trong Docker</h3>
<pre><code class="language-bash">${DOCKER_RUN}</code></pre>
<div class="out">${OUT_PG_VERSION}</div>
<ul>
<li><code>-p 127.0.0.1:41812:5432</code>: chỉ máy bạn kết nối được. <code>-p 41812:5432</code> sẽ mở trên mọi card mạng — ở quán cà phê, với mật khẩu <code>chiase</code>.</li>
<li><code>-v chiase-pgdata:/var/lib/postgresql</code>: volume có tên, nên <code>docker rm</code> không xoá mất dữ liệu.</li>
<li><code>--memory 1g</code>: CSDL dev không cần hơn, laptop của bạn còn chạy Vite và trình duyệt.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đường dẫn volume của mọi hướng dẫn cũ.</strong> Tới PostgreSQL 17, ảnh chính thức giữ dữ liệu ở <code>/var/lib/postgresql/data</code>. Bản 18 chuyển sang <code>/var/lib/postgresql/18/docker</code> (để sau này nâng cấp bằng <code>pg_upgrade</code> giữ được hai phiên bản cạnh nhau). Chép lệnh cũ là container từ chối khởi động:</p></div>
<div class="out">${OUT_PG18_VOLUME}</div>
<p>Hãy mount thư mục cha <code>/var/lib/postgresql</code> như ở trên. Bài học chung: khi đổi phiên bản lớn, <em>đọc ghi chú phát hành của ảnh Docker</em>, không chỉ của CSDL.</p>

<h3>Bước 2 — Cài Prisma, có ghim phiên bản</h3>
<p>Thói quen "cứ <code>npm install prisma</code>" đã hỏng từ 2026. Xem registry gọi bản nào là <code>latest</code>:</p>
<div class="out">${OUT_DIST_TAGS}</div>
<div class="out">${OUT_KHONG_GHIM}</div>
<p>Nhãn <code>latest</code> của CLI trỏ vào <strong>bản thử nghiệm (release candidate) của phiên bản lớn kế tiếp</strong>, trong khi <code>latest</code> của client là bản ổn định 7.10.1. Cài cả hai không ghi phiên bản là bạn có CLI và client khác phiên bản lớn — mã sinh ra có thể không khớp thư viện chạy. Luôn ghim ba gói về cùng một phiên bản chính xác:</p>
<pre><code class="language-bash">${CAI_GHIM}</code></pre>
<p><code>--save-exact</code> ghi <code>"7.10.1"</code> thay vì <code>"^7.10.1"</code>, nên không ai vô tình nâng Prisma. Nâng cấp trở thành một commit có chủ đích ("chore: Prisma 7.10.1 → 7.11.0") chạy lại toàn bộ test.</p>
<p>Vì sao thêm <code>@prisma/adapter-pg</code>? Từ Prisma 7, client nói chuyện với CSDL qua một <strong>driver adapter</strong> — ở đây là driver <code>pg</code> quen thuộc — thay vì tải một engine viết bằng Rust. Ít tệp nhị phân trong ảnh Docker hơn, và pool kết nối chính là pool của <code>pg</code> mà bạn cấu hình được.</p>

<h3>Bước 3 — <code>prisma init</code>, và đọc xem trình sinh mã đã làm gì</h3>
<div class="out">${OUT_INIT}</div>
<p>Trước khi tin, chạy <code>git status</code>. Prisma 7.10.1 đã: tải "agent skills" (hướng dẫn dành cho trợ lý lập trình AI) vào <strong>ba thư mục ẩn</strong>, khoảng 550 KB, có symlink trỏ qua lại; đặt tên tệp cấu hình là <code>prisma7.config.ts</code>; và viết một tệp cấu hình import một gói ta chưa hề cài:</p>
<pre><code class="language-ts">${INIT_GOC}</code></pre>
<p>Nó còn nối thêm một dòng <code>DATABASE_URL</code> mẫu vào <code>.env</code> đang có. Không cái nào độc hại, nhưng cũng không cái nào được yêu cầu, và trong một đội, mấy thư mục AI đó sẽ hiện trong pull request mà không ai giải thích được. Chúng tôi xoá phần thừa và chạy lại với cờ có trong <code>prisma init --help</code>:</p>
<div class="out">${OUT_INIT_NO_SKILLS}</div>
<p>Luật cho mọi trình sinh mã (create-vite, Spring Initializr, prisma init, <code>nest new</code>): <strong>chạy trên cây làm việc sạch, rồi đọc <code>git status</code> và từng tệp mới trước khi commit.</strong></p>

<h3>Bước 4 — <code>prisma.config.ts</code> không làm hỏng CI</h3>
<p>CLI của Prisma 7 không tự đọc <code>.env</code> nữa. Node 22 thì đọc được: <code>process.loadEnvFile()</code>. Bản đầu của chúng tôi dùng hàm "chặt chẽ" của Prisma:</p>
<pre><code class="language-ts">${CONFIG_V0}</code></pre>
<p>Trên máy CI hay trong <code>docker build</code> không có <code>.env</code> và không có CSDL — và <code>prisma generate</code>, lệnh không cần cả hai thứ đó, chết ngay lúc nạp cấu hình:</p>
<div class="out">${OUT_GENERATE_THIEU_ENV}</div>
<p>Bản cuối đọc biến một cách bình thường; lệnh thật sự cần CSDL vẫn báo lỗi rõ ràng:</p>
<pre><code class="language-ts">${CONFIG}</code></pre>
<div class="out">${OUT_GENERATE_SAU_SUA}</div>
<p>Và <code>.env.example</code> có thêm dòng mới (còn <code>.env</code> thật vẫn ngoài Git):</p>
<pre><code class="language-ini">DATABASE_URL=postgresql://chiase:chiase@localhost:41812/chiase</code></pre>

<h3>Bước 5 — Model đầu tiên và migration đầu tiên</h3>
<pre><code class="language-prisma">${SCHEMA_V1}</code></pre>
<p>Tên model và trường theo kiểu TypeScript (<code>passwordHash</code>), tên bảng và cột theo kiểu SQL (<code>password_hash</code>) nhờ <code>@map</code>/<code>@@map</code> — đúng như SQL nháp ở bài 1.2. Bài 2.3 giải thích từng thuộc tính và sửa một điểm yếu của bản đầu này.</p>
<div class="out">${OUT_MIGRATE_INIT}</div>
<pre><code class="language-sql">${MIGRATION_INIT}</code></pre>
<p>Để ý điều <code>migrate dev</code> <em>không</em> in ra: "Generated Prisma Client". Prisma 6 tự sinh client sau mỗi migration; <strong>Prisma 7 thì không</strong>. Tự chạy:</p>
<div class="out">${OUT_GENERATE}</div>

<h3>Bước 6 — Client nằm ở đâu, và vì sao không commit</h3>
<p><code>src/generated/prisma/</code> giờ chứa các tệp TypeScript: <code>client.ts</code>, <code>models/User.ts</code> (1.160 dòng cho một model), enum, kiểu đầu vào. Nó được <em>dựng ra từ</em> <code>schema.prisma</code>, giống <code>dist/</code> dựng từ <code>src/</code>, nên không vào Git. Ba hệ quả:</p>
<ul>
<li><code>.gitignore</code> và <code>.prettierignore</code> thêm <code>apps/api/src/generated</code> — không thì lần chạy đầu Prettier kêu 9 tệp sinh ra.</li>
<li><code>apps/api/package.json</code> thêm <code>"postinstall": "prisma generate"</code>: mỗi lần <code>npm ci</code> (đồng đội, CI, Docker) đều dựng lại client. Đã kiểm trên bản clone mới: <code>npm ci</code> → thư mục có mặt, không cần <code>.env</code>.</li>
<li>Một client cho cả tiến trình, với pool khai báo rõ:</li>
</ul>
<pre><code class="language-ts">${DB_PRISMA_V1}</code></pre>
<p><code>connectionTimeoutMillis</code> quan trọng: mặc định của <code>pg</code> là 0, nghĩa là "chờ mãi" khi mở kết nối mới. Bài 2.3 cho thấy cách thứ hai một CSDL có thể treo, và health check sống sót qua nó thế nào.</p>

<h3>Bước 7 — Migration không bao giờ được sửa</h3>
<p>Ý định hấp dẫn: "cột này nên dài 80 ký tự, sửa luôn tệp migration cũ cho nhanh." Chúng tôi thử trên <code>init_users</code> đã áp dụng:</p>
<div class="out">${OUT_SUA_MIGRATION_CU}</div>
<p>Prisma lưu checksum của mọi migration đã chạy. Sửa tệp là nó phát hiện lệch và đề nghị <strong>reset</strong> — xoá mọi bảng rồi chạy lại từ số 0. Trên laptop, cái giá là ít dữ liệu seed. Trỏ vào CSDL dùng chung hay production thì là thảm hoạ. Luật: <strong>migration đã áp dụng là lịch sử; đổi lược đồ bằng một migration mới.</strong> Chúng tôi trả lại tệp cũ; <code>migrate status</code> lại báo "up to date".</p>

<h3>⚠️ Sự cố thật: nhầm cơ sở dữ liệu — GitLab, 31/01/2017</h3>
<p>Đang vật lộn với sự cố sao chép dữ liệu lúc nửa đêm, một kỹ sư GitLab chạy lệnh xoá thư mục dữ liệu của máy CSDL <strong>phụ</strong> — trong một terminal đang nối vào máy <strong>chính</strong>. Khoảng 300 GB biến mất trước khi anh dừng lệnh sau một, hai giây. Rồi tới bản sao lưu: bản <code>pg_dump</code> hằng ngày lên S3 đã hỏng âm thầm từ lâu (bucket rỗng), và đội phải khôi phục từ ảnh chụp đĩa làm cho staging sáu giờ trước đó. GitLab.com sập khoảng 18 giờ; mọi thay đổi từ 17:20 tới 00:00 UTC bị mất — khoảng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới (báo cáo postmortem của GitLab). Ý nghĩa với bạn ngay hôm nay:</p>
<ul>
<li>Biết lệnh sẽ chạm vào CSDL nào <em>trước khi</em> bấm Enter. <code>migrate dev</code> và <code>migrate reset</code> chỉ dành cho CSDL dev; production dùng <code>migrate deploy</code> (Chương 11), lệnh không bao giờ reset.</li>
<li>Mỗi môi trường một thông tin đăng nhập: <code>.env</code> trên laptop không được phép <em>có khả năng</em> chạm tới production.</li>
<li>Bản sao lưu chưa từng khôi phục thử chỉ là hy vọng, không phải bản sao lưu.</li>
</ul>

<h3>Bước 8 — <code>npm audit</code> báo "3 high", và <code>--force</code> là câu trả lời sai</h3>
<div class="out">${OUT_AUDIT}</div>
<p>Đọc cây phụ thuộc: gói có lỗ hổng là <code>effect</code>, được <code>@prisma/config</code> dùng, mà <code>@prisma/config</code> thì <em>CLI</em> Prisma dùng để nạp tệp cấu hình. Nó không nằm trên đường đi của request HTTP nào. Và nhìn cách "sửa" được đề xuất: <strong>"Will install prisma@6.12.0, which is a breaking change"</strong> — hạ hẳn một phiên bản lớn. Chạy lệnh đó là phá dự án để tắt một cảnh báo. (<code>--omit=dev</code> vẫn liệt kê nó, vì <code>@prisma/client</code> khai báo CLI là peer tuỳ chọn.) Cách sửa chính xác là ép riêng gói có lỗ hổng lên bản đã vá, rồi bắt npm giải lại nó:</p>
<div class="out">${OUT_OVERRIDES}</div>
<p>Sau đó kiểm Prisma vẫn chạy (<code>validate</code>, <code>generate</code>, <code>migrate status</code> — đều ổn) và ghi lý do bên cạnh override trong commit, để người nâng Prisma sau này biết khi nào gỡ nó đi.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sửa schema.prisma</span><span class="lz-d">nơi duy nhất mô tả bảng</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">npx prisma migrate dev --name …</span><span class="lz-d">so khác biệt → tệp SQL mới → áp dụng vào CSDL dev</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đọc migration.sql</span><span class="lz-d">đây là thứ production sẽ chạy — review như review mã</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">npx prisma generate</span><span class="lz-d">Prisma 7 không làm hộ nữa</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Commit schema + migration</span><span class="lz-d">không bao giờ commit client sinh ra, không bao giờ commit .env</span></div>
</div>

${spring(false, 'Ở Spring Boot cùng việc này được chia khác: entity JPA mô tả bảng (giống schema.prisma) còn Flyway chạy các tệp SQL đánh số V1__init.sql, V2__… (giống prisma/migrations) — bạn tự viết SQL thay vì sinh ra. Luật "không sửa migration đã chạy" giống hệt; Flyway cũng từ chối vì lệch checksum.', [
  ['sb-6-1-entity-repository', 'Spring Boot 6.1 — Entity và repository'],
  ['sb-8-1-vi-sao-flyway', 'Spring Boot 8.1 — Vì sao không dựa vào Hibernate ddl-auto'],
  ['sb-8-2-viet-migration', 'Spring Boot 8.2 — Viết migration script có đánh số phiên bản'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Migration là gì, sao không để ORM tự đồng bộ lược đồ?"</strong> — Là kịch bản thay đổi có phiên bản, được review, chạy lại được. Tự đồng bộ (<code>db push</code>, <code>ddl-auto=update</code>) không đổi tên an toàn được, không review được, và không để lại lịch sử để chạy lại trên production.</li>
<li><strong>"Sửa migration sau khi đã chạy được không?"</strong> — Không; công cụ lưu checksum và sẽ từ chối hoặc đòi reset. Viết migration mới.</li>
<li><strong>"Vì sao ghim chính xác phiên bản một số gói?"</strong> — Công cụ sinh mã (CLI của ORM + client) phải khớp tuyệt đối; và dist-tag như <code>latest</code> có thể trỏ vào bản thử nghiệm.</li>
<li><strong>"npm audit báo lỗ hổng mức high. Bạn làm gì?"</strong> — Tìm đường đi (<code>npm why</code>), đánh giá có chạm tới được ở production không, ưu tiên override hoặc nâng cấp đúng chỗ, không mù quáng <code>audit fix --force</code>, kiểm lại, ghi lại.</li>
<li><strong>"Có nên commit mã sinh ra không?"</strong> — Thường là không: sinh lại trong <code>postinstall</code>/build từ nguồn đã commit (schema). Commit nguồn sự thật, không commit sản phẩm.</li>
</ol>

<h3>🧪 Lab 2.2 (60 phút) — nối API của bạn với CSDL</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>chiase-pg</code> bằng lệnh ở Bước 1 (volume có tên, chỉ mở trên 127.0.0.1). Kiểm phiên bản.</li>
<li>Cài ba gói Prisma ghim cùng một phiên bản chính xác; chạy <code>npm ls prisma @prisma/client @prisma/adapter-pg</code>.</li>
<li><code>npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills</code>; đọc <code>git status</code>; đổi tên thành <code>prisma.config.ts</code> và viết như Bước 4.</li>
<li>Chứng minh bẫy CI: tạm đổi tên <code>.env</code>, chạy <code>npx prisma generate</code> — phải thành công. Trả <code>.env</code> về.</li>
<li>Viết model <code>User</code>, <code>npx prisma migrate dev --name init_users</code>, đọc SQL, <code>npx prisma generate</code>.</li>
<li>Thêm các dòng ignore và script <code>postinstall</code>; chạy <code>npm audit</code> và xử lý như Bước 8.</li>
</ol>
<p><strong>Xong khi:</strong> <code>npx prisma migrate status</code> báo "Database schema is up to date!", <code>git status</code> hiện thư mục migration và <code>migration_lock.toml</code> là tệp mới, không có gì dưới <code>src/generated</code>.</p>
<p><strong>Thang điểm (10):</strong> CSDL chỉ mở trên localhost, có volume tên (2) · phiên bản ghim và bằng nhau (2) · cấu hình chạy được generate khi thiếu <code>.env</code> (2) · migration được commit, client bị ignore, có postinstall (3) · xử lý audit không dùng <code>--force</code> (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Tệp thật: <code>apps/api/prisma.config.ts</code>, <code>apps/api/prisma/schema.prisma</code>, <code>apps/api/prisma/migrations/20261124120000_init_users/migration.sql</code> trong repo ChiaSe (tag <code>ch2</code>). Nếu <code>migrate dev</code> báo <code>P1001: Can't reach database server</code>: container chưa chạy hoặc cổng trong <code>DATABASE_URL</code> không phải 41812. Nếu báo user không tạo được CSDL: <code>migrate dev</code> cần tạo một <em>shadow database</em> tạm; <code>POSTGRES_USER</code> của ảnh Docker là superuser, user tự tạo có thể không phải (xem bài 6.2 khoá Prisma ORM). Nếu <code>npm ls</code> hiện <code>8.0.0-rc…</code> ở bất cứ đâu, bạn đã cài mà không ghi phiên bản.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">migration</span><span class="v">Tệp SQL thay đổi lược đồ, có đánh số, được commit, chạy đúng một lần mỗi CSDL theo thứ tự.</span></div>
  <div class="kv"><span class="k">_prisma_migrations</span><span class="v">Bảng Prisma ghi migration nào đã chạy, kèm checksum.</span></div>
  <div class="kv"><span class="k">driver adapter</span><span class="v">Cầu nối của Prisma 7 tới một driver JS thường (ở đây là pg) thay cho engine Rust.</span></div>
  <div class="kv"><span class="k">dist-tag</span><span class="v">Nhãn gắn lên một phiên bản npm (latest, next, rc); latest không phải lúc nào cũng ổn định.</span></div>
  <div class="kv"><span class="k">postinstall</span><span class="v">Script npm tự chạy sau khi cài — dùng để sinh lại client.</span></div>
  <div class="kv"><span class="k">overrides</span><span class="v">Trường trong package.json ép phiên bản của một gói nằm sâu trong cây phụ thuộc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>PostgreSQL 18 trong Docker: chỉ mở trên 127.0.0.1, volume có tên ở <code>/var/lib/postgresql</code>.</li>
<li>Ghim prisma, @prisma/client và @prisma/adapter-pg cùng một phiên bản chính xác; <code>latest</code> từng là bản thử nghiệm.</li>
<li>Đọc mọi tệp trình sinh mã viết ra; <code>--no-skills</code>; cấu hình không được làm hỏng <code>generate</code> khi không có CSDL.</li>
<li>schema → <code>migrate dev</code> → đọc SQL → <code>generate</code> (tự chạy ở Prisma 7) → commit schema + migration, không commit client.</li>
<li>Không sửa migration đã áp dụng; không trỏ công cụ dev vào production (GitLab 2017).</li>
<li><code>npm audit fix --force</code> định hạ cấp Prisma; một override đúng chỗ đã giải quyết.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
