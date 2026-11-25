/**
 * 6.1 — Prisma trong Nest: PrismaService, vòng đời và tầng repository (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, Prisma 7.10.1 + @prisma/adapter-pg 7.10.1, pg 8.23.1, PostgreSQL 16.16 container nst-pg):
 * scratchpad/nst/lab/c6/bay (npm i prisma ⇒ 8.0.0-rc.35 vì dist-tag latest), app/prisma (schema, prisma.config.ts, migrate dev không
 * generate, env() đòi DATABASE_URL cả khi generate, .env không tự nạp), b61/nhieu-pool.ts (PrismaService khai ở 3 module ⇒ 3 bản, 15 kết
 * nối vs 5), b61/khoi-dong.ts (lazy: nghe cổng rồi 500 P1001; eager: thoát mã 1), b61/rooms (repository + test đơn vị/tích hợp, Vitest 4.1.12).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'prisma-orm', bai: 'pr-0-2-cai-dat', title: 'Prisma ORM 0.2 — Cho Prisma chạy lên', sub: 'Prisma từ số 0: schema, generate, migrate — phần nền bài này không dạy lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-9-4-connection-pool', title: 'Prisma ORM 9.4 — Connection pool, tính bằng số học', sub: 'Vì sao 15 kết nối thay vì 5 là chuyện lớn: max_connections và cách tính pool.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-11-5-vong-doi-client', title: 'Prisma ORM 11.5 — Một client, và nó nên chết như thế nào', sub: 'Vòng đời PrismaClient ngoài Nest: một bản, đóng đúng lúc.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-2-4-scope-lifecycle', title: 'NestJS 2.4 — Scope và lifecycle hook', sub: 'onModuleInit/onModuleDestroy và enableShutdownHooks mà PrismaService dựa vào.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS — Prisma recipe', 'Cách tài liệu chính thức nối PrismaClient vào Nest.', 'https://docs.nestjs.com/recipes/prisma'),
  nguon('📘', 'Prisma — Editing a migration', 'migrate dev --create-only, sửa SQL rồi mới áp.', 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations'),
].join('\n');
const OUT_BAY = "$ npm i -D prisma && npm i @prisma/client\n$ npm ls\nbay@1.0.0 /home/sv/bay\n+-- @prisma/client@7.10.1\n`-- prisma@8.0.0-rc.35\n\n$ npx prisma --version\n8.0.0-rc.35\n$ npm view prisma dist-tags.latest\n8.0.0-rc.35\n$ npm view @prisma/client dist-tags.latest\n7.10.1";
const MA_SCHEMA = "generator client {\n  provider     = \"prisma-client\"\n  output       = \"../src/generated/prisma\"\n  moduleFormat = \"esm\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Room {\n  id       Int       @id @default(autoincrement())\n  code     String    @unique\n  capacity Int\n  bookings Booking[]\n}\n\nmodel Booking {\n  id        Int      @id @default(autoincrement())\n  roomId    Int\n  room      Room     @relation(fields: [roomId], references: [id])\n  studentId String\n  start     DateTime @db.Timestamptz(3)\n  end       DateTime @db.Timestamptz(3)\n  status    String   @default(\"PENDING\")\n  version   Int      @default(1)\n  createdAt DateTime @default(now()) @db.Timestamptz(3)\n\n  @@index([roomId, start])\n}\n\nmodel AuditLog {\n  id     Int    @id @default(autoincrement())\n  action String @db.VarChar(20)\n  detail String\n}";
const MA_CONFIG = "import 'dotenv/config';\nimport { defineConfig, env } from 'prisma/config';\n\nexport default defineConfig({\n  schema: 'prisma/schema.prisma',\n  migrations: { path: 'prisma/migrations' },\n  datasource: { url: env('DATABASE_URL') },\n});";
const OUT_GEN = "$ npx prisma migrate dev --name init   # (đã có DATABASE_URL)\n… Your database is now in sync with your schema.\n$ ls src/generated/prisma\nls: cannot access 'src/generated/prisma': No such file or directory\n$ unset DATABASE_URL; npx prisma generate\nFailed to load config file \"/home/sv/app\" as a TypeScript/JavaScript module. Error: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL.\n$ echo \"DATABASE_URL=postgresql://nst:nst@127.0.0.1:41601/lab\" > .env; npx prisma generate\nFailed to load config file \"/home/sv/app\" as a TypeScript/JavaScript module. Error: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL.\n$ sed -i \"1i import 'dotenv/config';\" prisma.config.ts; npx prisma generate\n│    npm i @prisma/client@latest                          │\n└─────────────────────────────────────────────────────────┘\n✔ Generated Prisma Client (7.10.1) to ./src/generated/prisma in 29ms\n$ ls src/generated/prisma\nbrowser.ts\nclient.ts\ncommonInputTypes.ts\nenums.ts\ninternal\nmodels\nmodels.ts";
const MA_SVC = "// prisma.service.ts — MỘT PrismaClient cho cả ứng dụng, sống theo vòng đời của Nest\nimport { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport { PrismaClient } from '../generated/prisma/client.js';\n\n@Injectable()\nexport class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {\n  private readonly log = new Logger(PrismaService.name);\n  constructor() {\n    super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: Number(process.env.DB_POOL ?? 5) }) });\n  }\n  async onModuleInit() {\n    await this.$connect();                                    // hỏng DB ⇒ hỏng NGAY lúc khởi động, không đợi request đầu\n    await this.$queryRaw`SELECT 1`;\n    this.log.log('đã kết nối PostgreSQL');\n  }\n  async onModuleDestroy() {\n    await this.$disconnect();                                 // app.close() / SIGTERM (enableShutdownHooks) ⇒ trả kết nối\n    this.log.log('đã đóng pool');\n  }\n}";
const MA_MOD = "import { Global, Module } from '@nestjs/common';\nimport { PrismaService } from './prisma.service.js';\n\n@Global()                                   // mọi module dùng được mà không phải import — và chỉ có MỘT bản\n@Module({ providers: [PrismaService], exports: [PrismaService] })\nexport class PrismaModule {}";
const MA_POOL = "const Rooms = svc('Rooms'), Bookings = svc('Bookings'), Audit = svc('Audit');\n@Module({ providers: sai ? [PrismaService, Rooms] : [Rooms], exports: [Rooms] }) class RoomsModule {}\n@Module({ providers: sai ? [PrismaService, Bookings] : [Bookings], exports: [Bookings] }) class BookingsModule {}\n@Module({ providers: sai ? [PrismaService, Audit] : [Audit], exports: [Audit] }) class AuditModule {}\n@Module({ imports: [...(sai ? [] : [PrismaModule]), RoomsModule, BookingsModule, AuditModule] }) class AppModule {}";
const OUT_POOL = "$ KICH=sai DB_POOL=5 node dist/b61/nhieu-pool.js\nba service dùng chung một PrismaService? false\nkết nối PostgreSQL đang mở từ ứng dụng này: 15 (pool max 5 mỗi client)\n$ KICH=dung DB_POOL=5 node dist/b61/nhieu-pool.js\nba service dùng chung một PrismaService? true\nkết nối PostgreSQL đang mở từ ứng dụng này: 5 (pool max 5 mỗi client)";
const MA_LAZY = "@Injectable()\nclass LazyPrisma extends PrismaClient {            // không onModuleInit: kết nối ở truy vấn đầu tiên\n  constructor() { super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) }); }\n}\nconst Db = process.env.KICH === 'lazy' ? LazyPrisma : PrismaService;";
const OUT_KHOI = "$ KICH=lazy DATABASE_URL=…:41699/lab node dist/b61/khoi-dong.js; echo \"mã thoát $?\"\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n>> đã nghe cổng sau 111 ms — load balancer tưởng bản này khoẻ\n[Nest] ERROR [ExceptionsHandler] PrismaClientKnownRequestError: \nCan't reach database server at 127.0.0.1:41699\n  code: 'P1001',\n>> GET /rooms → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nmã thoát 0\n$ KICH=eager DATABASE_URL=…:41699/lab node dist/b61/khoi-dong.js; echo \"mã thoát $?\"\n>> khởi động thất bại sau 129 ms: PrismaClientKnownRequestError\nmã thoát 1";
const MA_REPO = "// rooms.repository.ts — service nói chuyện với \"kho phòng\", không biết Prisma\nimport { Injectable } from '@nestjs/common';\nimport { PrismaService } from '../../prisma/prisma.service.js';\n\nexport type Room = { id: number; code: string; capacity: number };\n\nexport abstract class RoomsRepository {                      // lớp trừu tượng = token DI (interface thì biến mất lúc chạy — bài 2.2)\n  abstract findByCode(code: string): Promise<Room | null>;\n  abstract create(data: Omit<Room, 'id'>): Promise<Room>;\n}\n\n@Injectable()\nexport class PrismaRoomsRepository extends RoomsRepository {\n  constructor(private readonly db: PrismaService) { super(); }\n  findByCode(code: string) { return this.db.room.findUnique({ where: { code } }); }\n  create(data: Omit<Room, 'id'>) { return this.db.room.create({ data }); }\n}\n\nexport class InMemoryRoomsRepository extends RoomsRepository {   // cho test đơn vị: không cần DB\n  rows: Room[] = [];\n  async findByCode(code: string) { return this.rows.find((r) => r.code === code) ?? null; }\n  async create(data: Omit<Room, 'id'>) { const r = { id: this.rows.length + 1, ...data }; this.rows.push(r); return r; }\n}";
const MA_RSVC = "import { ConflictException, Injectable } from '@nestjs/common';\nimport { RoomsRepository } from './rooms.repository.js';\n\n@Injectable()\nexport class RoomsService {\n  constructor(private readonly rooms: RoomsRepository) {}\n  async create(code: string, capacity: number) {\n    if (await this.rooms.findByCode(code)) throw new ConflictException(`phòng ${code} đã có`);\n    return this.rooms.create({ code, capacity });\n  }\n}";
const MA_RMOD = "import { Module } from '@nestjs/common';\nimport { PrismaRoomsRepository, RoomsRepository } from './rooms.repository.js';\nimport { RoomsService } from './rooms.service.js';\n\n@Module({\n  providers: [RoomsService, { provide: RoomsRepository, useClass: PrismaRoomsRepository }],\n  exports: [RoomsService],\n})\nexport class RoomsModule {}";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport { PrismaModule } from '../../prisma/prisma.module.js';\nimport { PrismaService } from '../../prisma/prisma.service.js';\nimport { InMemoryRoomsRepository, RoomsRepository } from './rooms.repository.js';\nimport { RoomsModule } from './rooms.module.js';\nimport { RoomsService } from './rooms.service.js';\n\ndescribe('RoomsService — đơn vị (kho trong bộ nhớ, không DB)', () => {\n  it('trùng mã phòng ⇒ 409', async () => {\n    const m = await Test.createTestingModule({ imports: [RoomsModule, PrismaModule] })\n      .overrideProvider(RoomsRepository).useValue(new InMemoryRoomsRepository())\n      .overrideProvider(PrismaService).useValue({})           // không mở kết nối nào\n      .compile();\n    const svc = m.get(RoomsService);\n    await svc.create('AL-301', 30);\n    await expect(svc.create('AL-301', 40)).rejects.toThrow('phòng AL-301 đã có');\n  });\n});\n\ndescribe('PrismaRoomsRepository — tích hợp (PostgreSQL thật)', () => {\n  it('ghi rồi đọc lại đúng hàng', async () => {\n    const m = await Test.createTestingModule({ imports: [RoomsModule, PrismaModule] }).compile();\n    await m.init();                                          // gọi onModuleInit ⇒ $connect\n    const db = m.get(PrismaService);\n    await db.$executeRaw`TRUNCATE \"Booking\", \"Room\" RESTART IDENTITY CASCADE`;\n    const r = await m.get(RoomsService).create('BE-205', 24);\n    expect(await db.room.findUnique({ where: { id: r.id } })).toEqual({ id: 1, code: 'BE-205', capacity: 24 });\n    await m.close();                                         // onModuleDestroy ⇒ $disconnect\n  });\n});";
const OUT_TEST = " RUN  v4.1.12 /home/sv/app\n ✓ src/b61/rooms/rooms.service.spec.ts > RoomsService — đơn vị (kho trong bộ nhớ, không DB) > trùng mã phòng ⇒ 409 88ms\n ✓ src/b61/rooms/rooms.service.spec.ts > PrismaRoomsRepository — tích hợp (PostgreSQL thật) > ghi rồi đọc lại đúng hàng 149ms\n Test Files  1 passed (1)\n      Tests  2 passed (2)";

export default {
  title: '6.1 — Prisma in Nest: a PrismaService, lifecycle and a repository layer|||6.1 — Prisma trong Nest: PrismaService, vòng đời và tầng repository',
  slug: 'nst-6-1-prisma',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Prisma đã dạy ở khoá prisma-orm; bài này dạy cách nó sống trong DI container của Nest. Chạy thật Prisma 7.10 + PostgreSQL 16: npm i prisma kéo về 8.0.0-rc vì dist-tag, migrate dev không còn tự generate, PrismaService khai ở ba module thành ba pool (15 kết nối thay vì 5), không $connect lúc khởi động thì ứng dụng nghe cổng rồi trả 500, và tầng repository cho test đơn vị không cần DB.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>6.1 — One database client, owned by the container</h2>
<p class="lead">Until now lab-booking kept everything in arrays and lost it on every restart. This chapter gives it a real PostgreSQL. Prisma itself — schema language, queries, migrations — is taught in depth in the <em>Prisma ORM</em> course; here we only learn the part that belongs to Nest: <strong>who creates the client, how many exist, when it connects and disconnects, and how services reach it</strong>. Get these wrong and the app works on your laptop and runs out of connections in production.</p>

<h3>Everyday analogy: one water main, not a well per flat</h3>
<p>A building has one water main with a fixed number of pipes. If every flat drilled its own well, each would work alone — until the ground water runs out for everyone at once. A <code>PrismaClient</code> is a well: it owns a pool of database connections. Nest's job is to make sure the building has exactly one, opened before the first tenant moves in and closed when the building is shut.</p>

<h3>Step 0 — install with exact versions (a real trap from today)</h3>
<div class="out">${esc(OUT_BAY)}</div>
<p>On 24/11/2026 the <code>latest</code> tag of the <code>prisma</code> CLI points to a release candidate, while <code>@prisma/client</code> is still on 7.10.1. A plain <code>npm i -D prisma</code> gives you a CLI one major version ahead of the runtime. Pin both, and the adapter, to the same version:</p>
<pre><code class="language-bash">npm i prisma@7.10.1 @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 pg dotenv</code></pre>
<p>Lesson for every project: a <code>package.json</code> range is not a version. Lock files and exact pins for the database toolchain are cheap insurance.</p>

<h3>Step 1 — schema and config in Prisma 7</h3>
<pre><code class="language-prisma">${esc(MA_SCHEMA)}</code></pre>
<pre><code class="language-ts">${esc(MA_CONFIG)}</code></pre>
<p>Three Prisma 7 details matter in a Nest project: the generator <code>prisma-client</code> writes TypeScript into <code>src/generated/prisma</code> (so <code>nest build</code> compiles it with your code, ESM with <code>.js</code> imports); the database URL lives in <code>prisma.config.ts</code>, not in the schema; and the client talks to PostgreSQL through a driver adapter (<code>@prisma/adapter-pg</code> on top of <code>pg</code>) — there is no query engine binary any more. Now watch the first run:</p>
<div class="out">${esc(OUT_GEN)}</div>
<ul>
<li><strong>migrate dev no longer generates the client.</strong> The migration was applied, yet <code>src/generated/prisma</code> does not exist. In Prisma 7 you run <code>prisma generate</code> yourself — put it in the <code>build</code> script and in CI.</li>
<li><strong><code>env('DATABASE_URL')</code> is required even to generate.</strong> A CI job that only builds (no database) fails here. Give the build step a dummy URL, or read it with <code>process.env.DATABASE_URL ?? ''</code> if you really need generate without one.</li>
<li><strong>The .env file is not read automatically.</strong> Writing <code>.env</code> changed nothing until <code>import 'dotenv/config'</code> was added. (Your Nest app reads .env through <code>@nestjs/config</code> — Lesson 5.1; the Prisma CLI is a separate program.)</li>
</ul>

<h3>Step 2 — PrismaService and PrismaModule</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p><code>PrismaService</code> <em>is</em> a <code>PrismaClient</code> (it extends it), so services call <code>this.db.room.findMany()</code> with full types. It is a singleton provider (Lesson 2.4), it connects in <code>onModuleInit</code> and releases the pool in <code>onModuleDestroy</code>. <code>@Global()</code> is justified here — almost every feature module needs the database, and there must be exactly one.</p>

<h3>Experiment 1 — "I'll just add PrismaService to my module's providers"</h3>
<p>The most common mistake in Nest + Prisma code bases. Three feature modules, each listing <code>PrismaService</code> in its own <code>providers</code> (KICH=sai), versus one global <code>PrismaModule</code> (KICH=dung). Each service runs five 200 ms queries at the same time, then we count connections in <code>pg_stat_activity</code>:</p>
<pre><code class="language-ts">${esc(MA_POOL)}</code></pre>
<div class="out">${esc(OUT_POOL)}</div>
<p>A provider listed in a module's <code>providers</code> is instantiated <em>for that module</em> (Lesson 2.3). Three modules ⇒ three <code>PrismaClient</code>s ⇒ three pools ⇒ 15 connections where you planned 5. Now do production arithmetic: 4 replicas × 6 feature modules × pool 10 = 240 connections against PostgreSQL's default <code>max_connections = 100</code>. The symptom is not an error in your code; it is <code>too many clients already</code> at the busiest hour. Rule: <strong>PrismaService is provided in exactly one module</strong>; everyone else imports or receives it globally.</p>

<h3>Experiment 2 — when should the app find out the database is down?</h3>
<p>Point <code>DATABASE_URL</code> at a port with no database and start the app twice: once with a client that connects lazily (no <code>onModuleInit</code>), once with the <code>PrismaService</code> above.</p>
<pre><code class="language-ts">${esc(MA_LAZY)}</code></pre>
<div class="out">${esc(OUT_KHOI)}</div>
<p>The lazy version starts in 111 ms, listens on its port and looks healthy to the load balancer — then answers the first real user with a 500 (<code>P1001 Can't reach database server</code>). The eager version refuses to start and exits with code 1, so Docker/Kubernetes restarts it and the old version keeps serving. <strong>Fail at startup, not at the first request.</strong> (A real readiness endpoint that also checks the database is Lesson 11.2.)</p>

<h3>Step 3 — a repository layer: when and how</h3>
<p>Prisma's client is already a typed data-access object, so a repository layer is not mandatory. It pays for itself when (a) you want unit tests of business rules with no database, (b) queries are complex enough to deserve names, or (c) part of the data may move to another store. The Nest way: an <strong>abstract class as the DI token</strong> (an interface vanishes at runtime — Lesson 2.2), a Prisma implementation, and an in-memory one for tests.</p>
<pre><code class="language-ts">${esc(MA_REPO)}</code></pre>
<pre><code class="language-ts">${esc(MA_RSVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_RMOD)}</code></pre>
<p>Two tests: a unit test that swaps the repository for the in-memory version (and replaces <code>PrismaService</code> with an empty object, so not a single connection is opened), and an integration test against the real database that calls <code>m.init()</code> / <code>m.close()</code> so the lifecycle hooks run exactly as in production.</p>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>

<h3>Comparing with Spring</h3>
<p>In Spring Boot, the <code>DataSource</code> and its HikariCP pool are one bean created by auto-configuration, and you would never write <code>new HikariDataSource()</code> in a service. <code>PrismaModule</code> is that auto-configuration written by hand. <code>RoomsRepository</code> plays the role of a Spring Data repository interface — but in Nest you write the implementation yourself.</p>

<h3>🧪 Exercise</h3>
<p>The <code>PrismaService</code> above reads <code>process.env</code> directly. Make it take the URL and pool size from the validated configuration of Lesson 5.1 (<code>ConfigService&lt;Env, true&gt;</code>), add <code>DATABASE_URL</code> (protocol postgres/postgresql only) and <code>DB_POOL</code> (1–50, default 10) to the schema, and prove that a missing URL stops the app before it listens.</p>
<details><summary>Show solution</summary>
<p>This is exactly what milestone 6 does (Lesson 6.7, which shows the full code and the passing tests). The two key pieces:</p>
<pre><code class="language-ts">// env.schema.ts — two new variables
DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
DB_POOL: z.coerce.number().int().min(1).max(50).default(10),

// prisma.service.ts — the constructor
constructor(c: ConfigService&lt;Env, true&gt;) {
  super({ adapter: new PrismaPg({ connectionString: c.get('DATABASE_URL', { infer: true }), max: c.get('DB_POOL', { infer: true }) }) });
}</code></pre>
<p>Test run of milestone 6: <code>mốc 6: thiếu DATABASE_URL hoặc sai giao thức ⇒ từ chối</code> passes — <code>mysql://…</code> gives <code>DATABASE_URL: Invalid URL</code>, and starting the built app without the variable (<code>NODE_ENV=test API_KEYS=test-key-1234 node dist/main.js</code>) prints <code>ERROR [ExceptionHandler] Error: Config validation error: DATABASE_URL: Invalid input: expected string, received undefined</code> and exits with code 1 — before any port is opened.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you integrate Prisma with Nest?</strong> One <code>PrismaService extends PrismaClient</code>, provided by one (global) module, connecting in <code>onModuleInit</code> and disconnecting in <code>onModuleDestroy</code>, with <code>enableShutdownHooks()</code> so SIGTERM runs the hook.</li>
<li><strong>What happens if two modules both list PrismaService in providers?</strong> Two instances, two pools — connection count multiplies with modules and replicas. Measured here: 15 instead of 5.</li>
<li><strong>Why connect at startup instead of on the first query?</strong> So a broken database configuration fails the deployment (non-zero exit) instead of serving 500s from an instance that looks healthy.</li>
<li><strong>Do you need a repository layer on top of Prisma?</strong> Not always. Use one for unit-testing business rules without a database or for naming complex queries; token = abstract class.</li>
</ol>

<h3>💼 On the job</h3>
<p>In an outsourcing project you often inherit a Nest code base where each module "just works" with its own <code>new PrismaClient()</code>. The first production incident is usually connection exhaustion after scaling to more replicas. Search the code for <code>new PrismaClient</code> and for <code>PrismaService</code> in <code>providers</code> arrays on your first day — it is a five-minute check that prevents a night call.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PrismaService</span><span class="v">A provider that extends PrismaClient; one instance owns the connection pool of the whole app.</span></div>
  <div class="kv"><span class="k">Driver adapter</span><span class="v">Prisma 7 talks to the database through a JS driver (@prisma/adapter-pg + pg) instead of an engine binary.</span></div>
  <div class="kv"><span class="k">prisma.config.ts</span><span class="v">Prisma 7 configuration: schema path, migrations, datasource URL. Does not load .env by itself.</span></div>
  <div class="kv"><span class="k">pg_stat_activity</span><span class="v">PostgreSQL view listing open connections — filter by application_name to count your app's.</span></div>
  <div class="kv"><span class="k">Fail fast</span><span class="v">Check dependencies at startup and exit non-zero, instead of failing on user requests.</span></div>
  <div class="kv"><span class="k">Repository (abstract class token)</span><span class="v">A named data-access API; the abstract class is the DI token, implementations are swapped in tests.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pin prisma, @prisma/client and the adapter to the same exact version; run <code>prisma generate</code> explicitly (Prisma 7 migrate dev does not).</li>
<li>Exactly one PrismaService for the whole app — listing it in several modules multiplies pools (15 vs 5 connections).</li>
<li>Connect in <code>onModuleInit</code> so a bad database fails the start (exit 1), and disconnect in <code>onModuleDestroy</code>.</li>
<li>A repository layer is optional; when used, an abstract class is the token and an in-memory implementation makes unit tests database-free.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>6.1 — Một client cơ sở dữ liệu, do container nắm giữ</h2>
<p class="lead">Tới giờ lab-booking giữ mọi thứ trong mảng và mất sạch mỗi lần khởi động lại. Chương này cho nó một PostgreSQL thật. Bản thân Prisma — ngôn ngữ schema, truy vấn, migration — đã dạy kỹ ở khoá <em>Prisma ORM</em>; ở đây ta chỉ học phần thuộc về Nest: <strong>ai tạo client, có bao nhiêu bản, kết nối và ngắt lúc nào, service lấy nó ra sao</strong>. Làm sai mấy điều này thì ứng dụng chạy ngon trên máy bạn và cạn kết nối trên production.</p>

<h3>Liên hệ đời thường: một đường ống nước chính, không phải mỗi căn hộ một giếng</h3>
<p>Một toà nhà có một đường ống chính với số nhánh cố định. Nếu căn hộ nào cũng tự khoan giếng, từng nhà vẫn có nước — cho tới khi mạch nước ngầm cạn cho tất cả cùng lúc. Một <code>PrismaClient</code> là một cái giếng: nó sở hữu một pool kết nối tới cơ sở dữ liệu. Việc của Nest là đảm bảo toà nhà có đúng một cái, mở trước khi người đầu tiên dọn vào và đóng khi toà nhà ngừng hoạt động.</p>

<h3>Bước 0 — cài đúng phiên bản (một cái bẫy có thật hôm nay)</h3>
<div class="out">${esc(OUT_BAY)}</div>
<p>Ngày 24/11/2026, nhãn <code>latest</code> của CLI <code>prisma</code> trỏ vào một bản release candidate, trong khi <code>@prisma/client</code> vẫn ở 7.10.1. Gõ <code>npm i -D prisma</code> trần là bạn có CLI đi trước runtime cả một phiên bản lớn. Ghim cả hai, cùng adapter, về đúng một phiên bản:</p>
<pre><code class="language-bash">npm i prisma@7.10.1 @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 pg dotenv</code></pre>
<p>Bài học cho mọi dự án: một khoảng phiên bản trong <code>package.json</code> không phải là một phiên bản. Tệp khoá và ghim chính xác cho bộ công cụ cơ sở dữ liệu là bảo hiểm rẻ.</p>

<h3>Bước 1 — schema và cấu hình ở Prisma 7</h3>
<pre><code class="language-prisma">${esc(MA_SCHEMA)}</code></pre>
<pre><code class="language-ts">${esc(MA_CONFIG)}</code></pre>
<p>Ba chi tiết của Prisma 7 quan trọng trong dự án Nest: generator <code>prisma-client</code> sinh TypeScript vào <code>src/generated/prisma</code> (nên <code>nest build</code> biên dịch nó cùng mã của bạn, ESM với import đuôi <code>.js</code>); chuỗi kết nối nằm trong <code>prisma.config.ts</code>, không nằm trong schema; và client nói chuyện với PostgreSQL qua một driver adapter (<code>@prisma/adapter-pg</code> trên <code>pg</code>) — không còn tệp nhị phân query engine. Giờ xem lần chạy đầu:</p>
<div class="out">${esc(OUT_GEN)}</div>
<ul>
<li><strong>migrate dev không còn tự sinh client.</strong> Migration đã áp, vậy mà <code>src/generated/prisma</code> chưa tồn tại. Ở Prisma 7 bạn tự chạy <code>prisma generate</code> — đặt nó vào script <code>build</code> và vào CI.</li>
<li><strong><code>env('DATABASE_URL')</code> bắt buộc cả khi chỉ generate.</strong> Một job CI chỉ build (không có DB) sẽ hỏng ở đây. Cho bước build một URL giả, hoặc đọc bằng <code>process.env.DATABASE_URL ?? ''</code> nếu thật sự cần generate mà không có URL.</li>
<li><strong>Tệp .env không được đọc tự động.</strong> Viết <code>.env</code> xong vẫn y nguyên lỗi, cho tới khi thêm <code>import 'dotenv/config'</code>. (Ứng dụng Nest đọc .env qua <code>@nestjs/config</code> — Bài 5.1; CLI của Prisma là một chương trình khác.)</li>
</ul>

<h3>Bước 2 — PrismaService và PrismaModule</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p><code>PrismaService</code> <em>chính là</em> một <code>PrismaClient</code> (nó kế thừa), nên service gọi <code>this.db.room.findMany()</code> với đủ kiểu. Nó là provider singleton (Bài 2.4), kết nối trong <code>onModuleInit</code> và trả pool trong <code>onModuleDestroy</code>. Dùng <code>@Global()</code> ở đây là có lý — gần như module tính năng nào cũng cần cơ sở dữ liệu, và chỉ được có đúng một bản.</p>

<h3>Thí nghiệm 1 — "Thôi cứ thêm PrismaService vào providers của module mình"</h3>
<p>Lỗi phổ biến nhất trong các dự án Nest + Prisma. Ba module tính năng, mỗi module tự liệt kê <code>PrismaService</code> trong <code>providers</code> của mình (KICH=sai), so với một <code>PrismaModule</code> toàn cục (KICH=dung). Mỗi service chạy năm truy vấn 200 ms cùng lúc, rồi đếm kết nối trong <code>pg_stat_activity</code>:</p>
<pre><code class="language-ts">${esc(MA_POOL)}</code></pre>
<div class="out">${esc(OUT_POOL)}</div>
<p>Provider ghi trong <code>providers</code> của một module được tạo <em>cho module đó</em> (Bài 2.3). Ba module ⇒ ba <code>PrismaClient</code> ⇒ ba pool ⇒ 15 kết nối trong khi bạn tính 5. Giờ làm phép tính production: 4 bản chạy × 6 module tính năng × pool 10 = 240 kết nối, trong khi PostgreSQL mặc định <code>max_connections = 100</code>. Triệu chứng không phải lỗi trong mã của bạn; nó là <code>too many clients already</code> đúng giờ cao điểm. Luật: <strong>PrismaService chỉ được cung cấp ở đúng một module</strong>; mọi nơi khác import hoặc nhận nó qua global.</p>

<h3>Thí nghiệm 2 — ứng dụng nên biết DB sập vào lúc nào?</h3>
<p>Cho <code>DATABASE_URL</code> trỏ vào một cổng không có DB và khởi động hai lần: một lần với client kết nối lười (không có <code>onModuleInit</code>), một lần với <code>PrismaService</code> ở trên.</p>
<pre><code class="language-ts">${esc(MA_LAZY)}</code></pre>
<div class="out">${esc(OUT_KHOI)}</div>
<p>Bản lười khởi động trong 111 ms, nghe cổng và trông khoẻ mạnh trong mắt load balancer — rồi trả 500 cho người dùng thật đầu tiên (<code>P1001 Can't reach database server</code>). Bản chủ động từ chối khởi động và thoát mã 1, nên Docker/Kubernetes khởi động lại nó còn bản cũ tiếp tục phục vụ. <strong>Hỏng lúc khởi động, đừng hỏng ở request đầu tiên.</strong> (Endpoint readiness thật có kiểm cả DB là Bài 11.2.)</p>

<h3>Bước 3 — tầng repository: khi nào và làm thế nào</h3>
<p>Client của Prisma vốn đã là một đối tượng truy cập dữ liệu có kiểu, nên tầng repository không bắt buộc. Nó đáng công khi (a) bạn muốn test đơn vị luật nghiệp vụ mà không cần DB, (b) truy vấn đủ phức tạp để xứng đáng có tên, hoặc (c) một phần dữ liệu có thể chuyển sang kho khác. Cách của Nest: <strong>lớp trừu tượng làm token DI</strong> (interface biến mất lúc chạy — Bài 2.2), một bản cài đặt bằng Prisma, và một bản trong bộ nhớ cho test.</p>
<pre><code class="language-ts">${esc(MA_REPO)}</code></pre>
<pre><code class="language-ts">${esc(MA_RSVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_RMOD)}</code></pre>
<p>Hai test: một test đơn vị thay repository bằng bản trong bộ nhớ (và thay <code>PrismaService</code> bằng object rỗng, nên không một kết nối nào được mở), và một test tích hợp với DB thật, gọi <code>m.init()</code> / <code>m.close()</code> để các hook vòng đời chạy y như production.</p>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>

<h3>So với Spring</h3>
<p>Ở Spring Boot, <code>DataSource</code> và pool HikariCP là một bean do auto-configuration tạo, và bạn không bao giờ viết <code>new HikariDataSource()</code> trong service. <code>PrismaModule</code> chính là auto-configuration đó, viết bằng tay. <code>RoomsRepository</code> đóng vai interface repository của Spring Data — nhưng ở Nest bạn tự viết phần cài đặt.</p>

<h3>🧪 Bài tập</h3>
<p><code>PrismaService</code> ở trên đọc thẳng <code>process.env</code>. Hãy cho nó lấy URL và cỡ pool từ cấu hình đã kiểm của Bài 5.1 (<code>ConfigService&lt;Env, true&gt;</code>), thêm <code>DATABASE_URL</code> (chỉ giao thức postgres/postgresql) và <code>DB_POOL</code> (1–50, mặc định 10) vào schema, và chứng minh thiếu URL thì ứng dụng dừng trước khi nghe cổng.</p>
<details><summary>Xem lời giải</summary>
<p>Đây chính là việc mốc 6 làm (Bài 6.7 có mã đầy đủ và lần chạy test xanh). Hai mảnh chính:</p>
<pre><code class="language-ts">// env.schema.ts — hai biến mới
DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
DB_POOL: z.coerce.number().int().min(1).max(50).default(10),

// prisma.service.ts — hàm khởi tạo
constructor(c: ConfigService&lt;Env, true&gt;) {
  super({ adapter: new PrismaPg({ connectionString: c.get('DATABASE_URL', { infer: true }), max: c.get('DB_POOL', { infer: true }) }) });
}</code></pre>
<p>Lần chạy test của mốc 6: <code>mốc 6: thiếu DATABASE_URL hoặc sai giao thức ⇒ từ chối</code> xanh — <code>mysql://…</code> cho <code>DATABASE_URL: Invalid URL</code>, còn chạy bản build mà thiếu biến (<code>NODE_ENV=test API_KEYS=test-key-1234 node dist/main.js</code>) in <code>ERROR [ExceptionHandler] Error: Config validation error: DATABASE_URL: Invalid input: expected string, received undefined</code> và thoát mã 1 — trước khi mở bất kỳ cổng nào.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Bạn tích hợp Prisma vào Nest thế nào?</strong> Một <code>PrismaService extends PrismaClient</code>, do một module (global) cung cấp, kết nối trong <code>onModuleInit</code>, ngắt trong <code>onModuleDestroy</code>, có <code>enableShutdownHooks()</code> để SIGTERM chạy hook.</li>
<li><strong>Hai module cùng liệt kê PrismaService trong providers thì sao?</strong> Hai bản, hai pool — số kết nối nhân theo số module và số bản chạy. Đo ở đây: 15 thay vì 5.</li>
<li><strong>Vì sao kết nối lúc khởi động thay vì ở truy vấn đầu?</strong> Để cấu hình DB hỏng làm hỏng lần triển khai (mã thoát khác 0), thay vì một bản trông khoẻ mạnh mà trả 500.</li>
<li><strong>Có cần tầng repository trên Prisma không?</strong> Không phải lúc nào. Dùng khi muốn test đơn vị luật nghiệp vụ không cần DB hoặc đặt tên cho truy vấn phức tạp; token là lớp trừu tượng.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing bạn hay nhận một mã nguồn Nest mà mỗi module "vẫn chạy" với một <code>new PrismaClient()</code> riêng. Sự cố production đầu tiên thường là cạn kết nối sau khi tăng số bản chạy. Ngày đầu nhận dự án, hãy tìm <code>new PrismaClient</code> và <code>PrismaService</code> trong các mảng <code>providers</code> — năm phút kiểm tra tránh được một cuộc gọi lúc nửa đêm.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PrismaService</span><span class="v">Provider kế thừa PrismaClient; một bản duy nhất sở hữu pool kết nối của cả ứng dụng.</span></div>
  <div class="kv"><span class="k">Driver adapter</span><span class="v">Prisma 7 nói chuyện với DB qua driver JS (@prisma/adapter-pg + pg) thay vì tệp nhị phân engine.</span></div>
  <div class="kv"><span class="k">prisma.config.ts</span><span class="v">Cấu hình Prisma 7: đường schema, migration, chuỗi kết nối. Không tự nạp .env.</span></div>
  <div class="kv"><span class="k">pg_stat_activity</span><span class="v">View của PostgreSQL liệt kê kết nối đang mở — lọc theo application_name để đếm của ứng dụng mình.</span></div>
  <div class="kv"><span class="k">Hỏng sớm (fail fast)</span><span class="v">Kiểm phụ thuộc lúc khởi động và thoát mã khác 0, thay vì hỏng trên request của người dùng.</span></div>
  <div class="kv"><span class="k">Repository (token lớp trừu tượng)</span><span class="v">API truy cập dữ liệu có tên; lớp trừu tượng là token DI, bản cài đặt được thay trong test.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ghim prisma, @prisma/client và adapter về cùng một phiên bản chính xác; tự chạy <code>prisma generate</code> (migrate dev của Prisma 7 không làm).</li>
<li>Đúng một PrismaService cho cả ứng dụng — liệt kê ở nhiều module là nhân pool (15 so với 5 kết nối).</li>
<li>Kết nối trong <code>onModuleInit</code> để DB hỏng thì khởi động hỏng (mã 1), ngắt trong <code>onModuleDestroy</code>.</li>
<li>Tầng repository là tuỳ chọn; khi dùng, lớp trừu tượng làm token và bản trong bộ nhớ giúp test đơn vị không cần DB.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
