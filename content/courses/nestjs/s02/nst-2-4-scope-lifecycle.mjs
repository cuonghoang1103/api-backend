/**
 * 2.4 — Scope và lifecycle hook (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c2/app/src/b24:
 * scope.ts (CHE_DO=singleton | ngam [chỉ @Inject(REQUEST)] | request; đếm số lần tạo; 3000 request tuần tự, đo 2 lượt mỗi chế độ —
 * máy nhà đang render GPU nên số ms dao động, lời chỉ nêu tỉ lệ), ro.ts (singleton giữ trạng thái ⇒ An nhận dữ liệu của Bình; chạy 3 lần, giống nhau),
 * ro-bt.ts (bài tập: REQUEST scope), hooks.ts chạy làm PID 1 trong container rồi `docker stop` (HOOKS=1: 0,2 s, exit 0; HOOKS=0: 10,1 s, exit 137).
 * Sự cố thật: Steam 25/12/2015 — cấu hình cache phục vụ trang của người đã đăng nhập cho người khác, ~34 000 tài khoản (Valve, 30/12/2015).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-17-3-pid-1-tat-em', title: 'Node.js 17.3 — PID 1 và tắt êm', sub: 'Vì sao dòng CMD làm mất request đang xử lý — phần Docker của bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-1-3-vong-doi', title: 'Docker 1.3 — Vòng đời container và PID 1', sub: 'docker stop gửi SIGTERM, chờ 10 giây, rồi SIGKILL.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-4-bean-lifecycle', title: 'Spring Boot 3.4 — Vòng đời bean và scope', sub: '@PostConstruct/@PreDestroy và scope request/prototype — để đối chiếu.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Injection scopes', 'DEFAULT, REQUEST, TRANSIENT; scope lan lên chuỗi tiêm; durable provider.', 'https://docs.nestjs.com/fundamentals/injection-scopes'),
  nguon('📘', 'NestJS Docs — Lifecycle events', 'Thứ tự hook khi khởi động và tắt; enableShutdownHooks.', 'https://docs.nestjs.com/fundamentals/lifecycle-events'),
  nguon('📰', 'Valve — Steam\'s troubled Christmas (30/12/2015)', 'Lỗi cấu hình cache: khoảng 34 000 tài khoản bị người khác xem trang có thông tin cá nhân.', 'https://store.steampowered.com/oldnews/19852'),
].join('\n');

const MA_DOCKER = `docker run -d --name nst-run-hook1 -e HOOKS=1 … nst-node:22 node dist/b24/hooks.js   # node là PID 1
sleep 3
docker stop nst-run-hook1          # gửi SIGTERM; quá 10 s thì SIGKILL
docker inspect -f '{{.State.ExitCode}}' nst-run-hook1`;
const MA_SCOPE = "import 'reflect-metadata';\nimport { Controller, Get, Headers, Inject, Injectable, Module, Scope } from '@nestjs/common';\nimport { NestFactory, REQUEST } from '@nestjs/core';\nimport type { Request } from 'express';\n\nconst dem: Record<string, number> = {};\nconst tao = (ten: string) => { dem[ten] = (dem[ten] ?? 0) + 1; };\nconst CHE_DO = process.env.CHE_DO ?? 'singleton';\n\n@Injectable() class Db { constructor() { tao('Db'); } }\n\n// Logger TRANSIENT: mỗi nơi xin được một bản riêng (để mỗi nơi tự đặt ngữ cảnh)\n@Injectable({ scope: Scope.TRANSIENT }) class AppLogger {\n  ctx = '?'; constructor() { tao('AppLogger'); }\n  setContext(c: string) { this.ctx = c; return this; }\n}\n\n// singleton: đọc tenant từ tham số;  request: tiêm REQUEST — chỉ dòng @Inject(REQUEST) cũng đủ biến nó thành request scope\n@Injectable() class TenantSingleton { constructor(private db: Db) { tao('TenantService'); } tenant(h?: string) { return h; } }\n@Injectable({ scope: Scope.REQUEST }) class TenantRequest {\n  constructor(private db: Db, @Inject(REQUEST) private req: Request) { tao('TenantService'); }\n  tenant() { return this.req.headers['x-tenant']; }\n}\nabstract class TenantService { abstract tenant(h?: string): unknown; }\nconst TenantImpl = CHE_DO === 'request' ? TenantRequest : CHE_DO === 'ngam' ? TenantNgam() : TenantSingleton;\nfunction TenantNgam() {   // KHÔNG khai scope, chỉ tiêm REQUEST\n  @Injectable() class T { constructor(@Inject(REQUEST) private req: Request) { tao('TenantService'); } tenant() { return this.req.headers['x-tenant']; } }\n  return T;\n}\n\n@Injectable() class RoomsService {\n  constructor(readonly t: TenantService, readonly log: AppLogger) { tao('RoomsService'); log.setContext('Rooms'); }\n}\n@Injectable() class BookingsService {\n  constructor(readonly log: AppLogger) { tao('BookingsService'); log.setContext('Bookings'); }\n}\n\n@Controller('rooms') class RoomsController {\n  constructor(private rooms: RoomsService, private bookings: BookingsService) { tao('RoomsController'); }\n  @Get() ds(@Headers('x-tenant') h: string) { return { tenant: this.rooms.t.tenant(h), log1: this.rooms.log.ctx, log2: this.bookings.log.ctx }; }\n}\n\n@Module({ controllers: [RoomsController], providers: [Db, AppLogger, { provide: TenantService, useClass: TenantImpl }, RoomsService, BookingsService] })\nclass AppModule {}\n\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconsole.log(`## CHE_DO=${CHE_DO} — sau khởi động:`, JSON.stringify(dem));\nfor (const t of ['fpt', 'hust', 'fpt']) {\n  const r = await fetch('http://127.0.0.1:3000/rooms', { headers: { 'x-tenant': t } });\n  console.log(`  GET /rooms (x-tenant: ${t}) →`, await r.text());\n}\nconsole.log('  sau 3 request:', JSON.stringify(dem));\nconst N = 3000; const t0 = performance.now();\nfor (let i = 0; i < N; i++) await (await fetch('http://127.0.0.1:3000/rooms')).text();\nconsole.log(`  ${N} request tuần tự: ${(performance.now() - t0).toFixed(0)} ms; RoomsController đã tạo ${dem.RoomsController} lần`);\nawait app.close();";
const OUT_SCOPE = "## CHE_DO=singleton — sau khởi động: {\"Db\":1,\"AppLogger\":2,\"TenantService\":1,\"BookingsService\":1,\"RoomsService\":1,\"RoomsController\":1}\n  GET /rooms (x-tenant: fpt) → {\"tenant\":\"fpt\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  GET /rooms (x-tenant: hust) → {\"tenant\":\"hust\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  GET /rooms (x-tenant: fpt) → {\"tenant\":\"fpt\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  sau 3 request: {\"Db\":1,\"AppLogger\":2,\"TenantService\":1,\"BookingsService\":1,\"RoomsService\":1,\"RoomsController\":1}\n  3000 request tuần tự: 1573 ms; RoomsController đã tạo 1 lần\n## CHE_DO=ngam — sau khởi động: {\"Db\":1,\"AppLogger\":1,\"BookingsService\":1}\n  GET /rooms (x-tenant: fpt) → {\"tenant\":\"fpt\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  GET /rooms (x-tenant: hust) → {\"tenant\":\"hust\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  GET /rooms (x-tenant: fpt) → {\"tenant\":\"fpt\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  sau 3 request: {\"Db\":1,\"AppLogger\":4,\"BookingsService\":1,\"TenantService\":3,\"RoomsService\":3,\"RoomsController\":3}\n  3000 request tuần tự: 1935 ms; RoomsController đã tạo 3003 lần\n## CHE_DO=request — sau khởi động: {\"Db\":1,\"AppLogger\":1,\"BookingsService\":1}\n  GET /rooms (x-tenant: fpt) → {\"tenant\":\"fpt\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  GET /rooms (x-tenant: hust) → {\"tenant\":\"hust\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}\n  GET /rooms (x-tenant: fpt) → {\"tenant\":\"fpt\",\"log1\":\"Rooms\",\"log2\":\"Bookings\"}";
const MA_RO = "import 'reflect-metadata';\nimport { Controller, Get, Headers, Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\n\n@Injectable()\nclass ProfileService {                       // singleton — MỘT bản cho mọi request\n  private nguoiDung = '';                    // ⚠ trạng thái của request cất vào trường của singleton\n  async hoSo(user: string) {\n    this.nguoiDung = user;\n    await ngu(user === 'an' ? 100 : 10);     // truy vấn DB: An chậm hơn Bình một chút\n    return { hoiBoi: user, traVe: `hồ sơ + số điện thoại của ${this.nguoiDung}` };\n  }\n  async hoSoDung(user: string) {             // sửa: giữ trong biến cục bộ / tham số\n    await ngu(user === 'an' ? 100 : 10);\n    return { hoiBoi: user, traVe: `hồ sơ + số điện thoại của ${user}` };\n  }\n}\n@Controller('me') class MeController {\n  constructor(private readonly p: ProfileService) {}\n  @Get() me(@Headers('x-user') u: string) { return process.env.SUA ? this.p.hoSoDung(u) : this.p.hoSo(u); }\n}\n@Module({ controllers: [MeController], providers: [ProfileService] }) class AppModule {}\n\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst goi = (u: string) => fetch('http://127.0.0.1:3000/me', { headers: { 'x-user': u } }).then((r) => r.json());\nconst [an, binh] = await Promise.all([goi('an'), (async () => { await ngu(20); return goi('binh'); })()]);\nconsole.log('An   nhận:', JSON.stringify(an));\nconsole.log('Bình nhận:', JSON.stringify(binh));\nawait app.close();";
const OUT_RO = "## singleton giữ trạng thái\nAn   nhận: {\"hoiBoi\":\"an\",\"traVe\":\"hồ sơ + số điện thoại của binh\"}\nBình nhận: {\"hoiBoi\":\"binh\",\"traVe\":\"hồ sơ + số điện thoại của binh\"}\n## SUA=1\nAn   nhận: {\"hoiBoi\":\"an\",\"traVe\":\"hồ sơ + số điện thoại của an\"}\nBình nhận: {\"hoiBoi\":\"binh\",\"traVe\":\"hồ sơ + số điện thoại của binh\"}";
const MA_HK = "import 'reflect-metadata';\nimport { Injectable, Module, type OnModuleInit, type OnApplicationBootstrap, type OnModuleDestroy,\n  type BeforeApplicationShutdown, type OnApplicationShutdown } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n\nconst t0 = Date.now();\nconst log = (m: string) => console.log(`+${String(Date.now() - t0).padStart(4)} ms  ${m}`);\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\n\nfunction DichVu(ten: string) {\n  @Injectable() class S implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {\n    constructor() { log(`${ten}: constructor`); }\n    async onModuleInit() { if (ten === 'DbService') { log(`${ten}: onModuleInit — mở pool…`); await ngu(200); } log(`${ten}: onModuleInit xong`); }\n    onApplicationBootstrap() { log(`${ten}: onApplicationBootstrap`); }\n    onModuleDestroy() { log(`${ten}: onModuleDestroy`); }\n    async beforeApplicationShutdown(sig?: string) { log(`${ten}: beforeApplicationShutdown(${sig})`); if (ten === 'DbService') await ngu(100); }\n    onApplicationShutdown(sig?: string) { log(`${ten}: onApplicationShutdown(${sig})`); }\n  }\n  Object.defineProperty(S, 'name', { value: ten });\n  return S;\n}\nconst DbService = DichVu('DbService'), UsersService = DichVu('UsersService'), AppService = DichVu('AppService');\n@Module({ providers: [DbService], exports: [DbService] }) class DbModule {}\n@Module({ imports: [DbModule], providers: [UsersService] }) class UsersModule {}\n@Module({ imports: [UsersModule], providers: [AppService] }) class AppModule {}\n\nconst app = await NestFactory.create(AppModule, { logger: false });\nif (process.env.HOOKS !== '0') app.enableShutdownHooks();\nawait app.listen(3000);\nlog(`đang nghe — pid ${process.pid}, chờ tín hiệu`);";
const OUT_HK = "## HOOKS=1 — docker stop\n+  65 ms  AppService: constructor\n+  66 ms  UsersService: constructor\n+  66 ms  DbService: constructor\n+  70 ms  DbService: onModuleInit — mở pool…\n+ 271 ms  DbService: onModuleInit xong\n+ 271 ms  UsersService: onModuleInit xong\n+ 271 ms  AppService: onModuleInit xong\n+ 272 ms  DbService: onApplicationBootstrap\n+ 272 ms  UsersService: onApplicationBootstrap\n+ 272 ms  AppService: onApplicationBootstrap\n+ 274 ms  đang nghe — pid 1, chờ tín hiệu\n+2772 ms  AppService: onModuleDestroy\n+2772 ms  UsersService: onModuleDestroy\n+2772 ms  DbService: onModuleDestroy\n+2772 ms  AppService: beforeApplicationShutdown(SIGTERM)\n+2772 ms  UsersService: beforeApplicationShutdown(SIGTERM)\n+2772 ms  DbService: beforeApplicationShutdown(SIGTERM)\n+2873 ms  AppService: onApplicationShutdown(SIGTERM)\n+2873 ms  UsersService: onApplicationShutdown(SIGTERM)\n+2873 ms  DbService: onApplicationShutdown(SIGTERM)\ndocker stop mất 0.2 s\n## HOOKS=0 — docker stop\n+  57 ms  AppService: constructor\n+  57 ms  UsersService: constructor\n+  57 ms  DbService: constructor\n+  61 ms  DbService: onModuleInit — mở pool…\n+ 262 ms  DbService: onModuleInit xong\n+ 262 ms  UsersService: onModuleInit xong\n+ 262 ms  AppService: onModuleInit xong\n+ 263 ms  DbService: onApplicationBootstrap\n+ 263 ms  UsersService: onApplicationBootstrap\n+ 263 ms  AppService: onApplicationBootstrap\n+ 264 ms  đang nghe — pid 1, chờ tín hiệu\ndocker stop mất 10.1 s";
const OUT_EXIT = "HOOKS=0 ExitCode=137\nHOOKS=1 ExitCode=0";
const OUT_DO = "singleton:  3000 request tuần tự: 1968 ms; RoomsController đã tạo 1 lần\nrequest:    3000 request tuần tự: 2598 ms; RoomsController đã tạo 3003 lần\nsingleton:  3000 request tuần tự: 1934 ms; RoomsController đã tạo 1 lần\nrequest:    3000 request tuần tự: 2577 ms; RoomsController đã tạo 3003 lần";
const OUT_BT = "An   nhận: {\"hoiBoi\":\"an\",\"traVe\":\"hồ sơ + số điện thoại của an\"}\nBình nhận: {\"hoiBoi\":\"binh\",\"traVe\":\"hồ sơ + số điện thoại của binh\"}\nMeController đã tạo: 2 lần";

export default {
  title: '2.4 — Scopes and lifecycle hooks: singleton, request, transient, startup and shutdown|||2.4 — Scope và lifecycle hook: singleton, request, transient, khởi động và tắt',
  slug: 'nst-2-4-scope-lifecycle',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba scope chạy thật và đếm số lần tạo: singleton (1 controller cho 3000 request), request (3003 controller — scope lan ngược lên cả chuỗi), transient (mỗi nơi một logger). Bẫy: chỉ cần @Inject(REQUEST) là provider ngầm thành request scope. Lỗi kinh điển: cất dữ liệu request vào trường của singleton ⇒ An nhận số điện thoại của Bình (liên hệ sự cố Steam 2015). Lifecycle hook theo thứ tự cây module, và tắt êm trong Docker: enableShutdownHooks ⇒ 0,2 giây, exit 0; thiếu ⇒ 10 giây, exit 137.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>2.4 — How many of you are there, and when do you wake up?</h2>
<p class="lead">So far every provider was a singleton: built once at startup, shared by every request. That is right 95% of the time and it is why Nest is fast. This lesson covers the other 5% — request and transient scope — what they cost, the classic bug that tempts people into them, and the lifecycle hooks that let a provider open and close resources properly, including when Docker stops the container.</p>

<h3>Experiment 1 — count the instances</h3>
<pre><code class="language-ts">${esc(MA_SCOPE)}</code></pre>
<div class="out">${esc(OUT_SCOPE)}</div>
<table>
<thead><tr><th>Mode</th><th>What happened</th></tr></thead>
<tbody>
<tr><td><code>singleton</code></td><td>Everything built at startup, nothing after. The tenant comes in as a handler parameter. <code>AppLogger</code> = 2: transient gives Rooms and Bookings one logger each, so <code>setContext</code> does not clash.</td></tr>
<tr><td><code>ngam</code> ("implicit")</td><td>No <code>scope</code> option at all — only <code>@Inject(REQUEST)</code>. Nest still made it request-scoped: <code>TenantService</code>, then <code>RoomsService</code>, then <code>RoomsController</code> are built <strong>per request</strong>. Injecting the request object is a scope declaration.</td></tr>
<tr><td><code>request</code></td><td>Same counts as <code>ngam</code>. Scope <strong>bubbles up</strong>: anything that depends on a request-scoped provider becomes request-scoped too, up to the controller. <code>BookingsService</code> and <code>Db</code> stay singletons because they do not depend on it.</td></tr>
</tbody>
</table>
<p>The cost, 3 000 sequential requests, two runs each (this machine was rendering video on the GPU, so treat milliseconds as rough):</p>
<div class="out">${esc(OUT_DO)}</div>
<p>About a third slower here, and 3 000 extra controller objects for the garbage collector. On a real handler with a database call the relative cost shrinks, but the chain effect does not: one request-scoped provider deep in a shared module can make half the application per-request. If you need per-request data deep inside services (tenant id, request id, current user), Chapter 6 uses <code>AsyncLocalStorage</code> via <code>nestjs-cls</code> and keeps everything singleton.</p>

<h3>Experiment 2 — the bug that makes people reach for request scope</h3>
<pre><code class="language-ts">${esc(MA_RO)}</code></pre>
<div class="out">${esc(OUT_RO)}</div>
<p>An asked for her own profile and got Bình's phone number. The singleton stored "who is asking" in a field; while An's query was waiting, Bình's request overwrote it. Node is single-threaded, but every <code>await</code> lets another request run — a field on a singleton is shared memory between users. Ran three times, same leak every time. The fix (<code>SUA=1</code>) is boring: keep request data in parameters and local variables.</p>

<h3>🕵️ Real incident — Steam, Christmas Day 2015</h3>
<p>On 25 December 2015, under a denial-of-service attack, Steam's caching partner deployed a configuration that cached pages for logged-in users. For about 90 minutes, people opening their account page could be served a page generated for someone else — billing address, email, last digits of a card. Valve's statement put it at roughly 34,000 accounts. Different layer (an HTTP cache, not a Nest service), same root cause as experiment 2: <strong>data belonging to one request stored in a place shared by all requests</strong>. Code review question to keep: "Is this per-user data, and is this object shared?"</p>

<h3>Experiment 3 — lifecycle hooks and <code>docker stop</code></h3>
<pre><code class="language-ts">${esc(MA_HK)}</code></pre>
<pre><code class="language-bash">${esc(MA_DOCKER)}</code></pre>
<div class="out">${esc(OUT_HK)}</div>
<div class="out">${esc(OUT_EXIT)}</div>
<ul>
<li><strong>Startup</strong>: all constructors, then <code>onModuleInit</code> from the deepest module up (<code>Db → Users → App</code>) — and Nest <em>awaits</em> the async one: Users waited 200 ms for the pool. Then <code>onApplicationBootstrap</code> in the same order. Only after that does <code>listen</code> resolve. Open connections in <code>onModuleInit</code>, not in the constructor (a constructor cannot be awaited).</li>
<li><strong>Shutdown</strong> is the mirror: root first (<code>App → Users → Db</code>), so the database closes last, after everything that uses it. <code>beforeApplicationShutdown</code> receives the signal name; the 100 ms <code>await</code> in Db delayed <code>onApplicationShutdown</code> by exactly 100 ms.</li>
<li><strong>Without <code>enableShutdownHooks()</code></strong>, Node as PID 1 ignores SIGTERM, no hook runs, Docker waits its 10 seconds and kills the process: exit 137, in-flight requests cut. Every deploy and every rollback pays those 10 seconds.</li>
</ul>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<p>Fix experiment 2 <em>without</em> changing the method — keep the field, make <code>ProfileService</code> <code>Scope.REQUEST</code>, and count how many <code>MeController</code>s are built for the two requests. Is this a good fix?</p>
<details><summary>Show the answer</summary>
<div class="out">${esc(OUT_BT)}</div>
<p>The leak is gone: each request gets its own <code>ProfileService</code>, hence its own field. But the controller is now built per request too (2 for 2 requests), and so is everything that depends on <code>ProfileService</code>. It works; the parameter fix is cheaper and keeps the service testable as a plain singleton.</p>
</details>
</div>

<h3>💼 On the job</h3>
<p>When the project moves to Kubernetes or Docker Compose, operations will ask: "Does it shut down gracefully?" The provable answer is experiment 3: hooks logged in order, <code>docker stop</code> under a second, exit 0. In code review, whenever you see <code>private currentUser</code> or <code>this.tenant =</code> in an <code>@Injectable()</code> with no scope, stop and think of experiment 2.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scope.DEFAULT</span><span class="v">Singleton: one instance for the app lifetime.</span></div>
  <div class="kv"><span class="k">Scope.REQUEST</span><span class="v">A new instance per incoming request; bubbles up to every dependant.</span></div>
  <div class="kv"><span class="k">Scope.TRANSIENT</span><span class="v">A new instance for every consumer that injects it.</span></div>
  <div class="kv"><span class="k">REQUEST token</span><span class="v">Injects the current request object; implies request scope.</span></div>
  <div class="kv"><span class="k">enableShutdownHooks</span><span class="v">Makes Nest listen for SIGTERM/SIGINT and run the destroy/shutdown hooks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Default to singletons; keep per-request data in parameters (or CLS, Chapter 6).</li>
<li>Request scope bubbles up the chain; <code>@Inject(REQUEST)</code> alone triggers it.</li>
<li>A field on a singleton is shared by all users — every <code>await</code> is a chance to leak.</li>
<li>Init hooks run leaves-first and are awaited; shutdown hooks run root-first.</li>
<li>In Docker, call <code>app.enableShutdownHooks()</code>, or <code>docker stop</code> costs 10 s and exit 137.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>2.4 — Có bao nhiêu bản của bạn, và bạn thức dậy lúc nào?</h2>
<p class="lead">Tới giờ mọi provider đều là singleton: tạo một lần lúc khởi động, mọi request dùng chung. Đúng trong 95% trường hợp, và đó là lý do Nest chạy nhanh. Bài này lo 5% còn lại — scope request và transient — chúng tốn gì, lỗi kinh điển khiến người ta tìm tới chúng, và các lifecycle hook giúp provider mở, đóng tài nguyên đúng lúc, kể cả khi Docker dừng container.</p>

<h3>Thí nghiệm 1 — đếm số bản được tạo</h3>
<pre><code class="language-ts">${esc(MA_SCOPE)}</code></pre>
<div class="out">${esc(OUT_SCOPE)}</div>
<table>
<thead><tr><th>Chế độ</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td><code>singleton</code></td><td>Mọi thứ tạo lúc khởi động, sau đó không tạo thêm. Tenant đi vào bằng tham số của handler. <code>AppLogger</code> = 2: transient cho Rooms và Bookings mỗi bên một logger, nên <code>setContext</code> không giẫm lên nhau.</td></tr>
<tr><td><code>ngam</code> (ngầm)</td><td>Không khai <code>scope</code> gì cả — chỉ có <code>@Inject(REQUEST)</code>. Nest vẫn biến nó thành request scope: <code>TenantService</code>, rồi <code>RoomsService</code>, rồi <code>RoomsController</code> bị tạo <strong>mỗi request một lần</strong>. Tiêm đối tượng request chính là khai báo scope.</td></tr>
<tr><td><code>request</code></td><td>Đếm giống hệt <code>ngam</code>. Scope <strong>lan ngược lên</strong>: thứ gì phụ thuộc provider request scope cũng thành request scope, lên tới tận controller. <code>BookingsService</code> và <code>Db</code> vẫn là singleton vì không phụ thuộc nó.</td></tr>
</tbody>
</table>
<p>Cái giá, 3 000 request tuần tự, mỗi chế độ hai lượt (máy đo đang render video bằng GPU, nên số mili giây chỉ để tham khảo):</p>
<div class="out">${esc(OUT_DO)}</div>
<p>Chậm hơn khoảng một phần ba ở máy này, kèm 3 000 đối tượng controller thừa cho bộ gom rác. Với handler thật có truy vấn cơ sở dữ liệu, tỉ lệ đó nhỏ lại, nhưng hiệu ứng dây chuyền thì không: một provider request scope nằm sâu trong module dùng chung có thể kéo nửa ứng dụng thành tạo-mỗi-request. Nếu cần dữ liệu theo request ở sâu trong service (tenant, request id, người dùng hiện tại), Chương 6 dùng <code>AsyncLocalStorage</code> qua <code>nestjs-cls</code> và giữ mọi thứ là singleton.</p>

<h3>Thí nghiệm 2 — lỗi khiến người ta tìm tới request scope</h3>
<pre><code class="language-ts">${esc(MA_RO)}</code></pre>
<div class="out">${esc(OUT_RO)}</div>
<p>An xin hồ sơ của chính mình và nhận số điện thoại của Bình. Singleton cất "ai đang hỏi" vào một trường; trong lúc truy vấn của An đang chờ, request của Bình ghi đè lên. Node chạy một luồng, nhưng mỗi <code>await</code> là một lần nhường cho request khác chạy — trường của singleton là bộ nhớ dùng chung giữa mọi người dùng. Chạy ba lần, lần nào cũng lộ y hệt. Cách sửa (<code>SUA=1</code>) rất nhàm: giữ dữ liệu của request trong tham số và biến cục bộ.</p>

<h3>🕵️ Sự cố thật — Steam, ngày Giáng sinh 2015</h3>
<p>Ngày 25/12/2015, đang bị tấn công từ chối dịch vụ, đối tác cache của Steam triển khai một cấu hình lỡ cache cả trang của người đã đăng nhập. Trong khoảng 90 phút, người mở trang tài khoản có thể nhận trang được tạo cho người khác — địa chỉ thanh toán, email, vài số cuối của thẻ. Thông báo của Valve ước khoảng 34 000 tài khoản. Khác tầng (cache HTTP, không phải service Nest), cùng gốc với thí nghiệm 2: <strong>dữ liệu của một request bị cất ở chỗ mọi request dùng chung</strong>. Câu hỏi nên giữ khi review mã: "Đây có phải dữ liệu theo người dùng không, và đối tượng này có dùng chung không?"</p>

<h3>Thí nghiệm 3 — lifecycle hook và <code>docker stop</code></h3>
<pre><code class="language-ts">${esc(MA_HK)}</code></pre>
<pre><code class="language-bash">${esc(MA_DOCKER)}</code></pre>
<div class="out">${esc(OUT_HK)}</div>
<div class="out">${esc(OUT_EXIT)}</div>
<ul>
<li><strong>Khởi động</strong>: chạy hết constructor, rồi <code>onModuleInit</code> từ module sâu nhất đi lên (<code>Db → Users → App</code>) — và Nest <em>chờ</em> hook bất đồng bộ: Users đợi 200 ms cho pool mở xong. Rồi <code>onApplicationBootstrap</code> cùng thứ tự. Chỉ sau đó <code>listen</code> mới xong. Mở kết nối trong <code>onModuleInit</code>, đừng mở trong constructor (constructor không chờ được).</li>
<li><strong>Tắt</strong> là ảnh gương: gốc trước (<code>App → Users → Db</code>), nên cơ sở dữ liệu đóng sau cùng, sau mọi thứ dùng nó. <code>beforeApplicationShutdown</code> nhận tên tín hiệu; 100 ms <code>await</code> trong Db làm <code>onApplicationShutdown</code> trễ đúng 100 ms.</li>
<li><strong>Thiếu <code>enableShutdownHooks()</code></strong>: Node làm PID 1 bỏ qua SIGTERM, không hook nào chạy, Docker chờ đủ 10 giây rồi giết tiến trình: exit 137, request đang xử lý bị cắt ngang. Mỗi lần triển khai, mỗi lần quay lui đều trả 10 giây đó.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Sửa thí nghiệm 2 <em>mà không</em> đổi phương thức — giữ nguyên trường, cho <code>ProfileService</code> thành <code>Scope.REQUEST</code>, và đếm số <code>MeController</code> được tạo cho hai request. Đây có phải cách sửa tốt không?</p>
<details><summary>Xem đáp án</summary>
<div class="out">${esc(OUT_BT)}</div>
<p>Hết lộ: mỗi request có <code>ProfileService</code> riêng, nên có trường riêng. Nhưng controller giờ cũng bị tạo theo request (2 cho 2 request), và mọi thứ phụ thuộc <code>ProfileService</code> cũng vậy. Chạy được; còn cách sửa bằng tham số thì rẻ hơn và giữ service là một singleton dễ test.</p>
</details>
</div>

<h3>💼 Đi làm thật</h3>
<p>Khi dự án lên Kubernetes hay Docker Compose, đội vận hành sẽ hỏi: "Ứng dụng có tắt êm không?". Câu trả lời chứng minh được là đúng thí nghiệm 3: log hook theo thứ tự, <code>docker stop</code> dưới một giây, exit 0. Khi review mã, mỗi lần thấy <code>private currentUser</code> hay <code>this.tenant =</code> trong một <code>@Injectable()</code> không khai scope, hãy dừng lại và hỏi thí nghiệm 2.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scope.DEFAULT</span><span class="v">Singleton: một bản suốt đời ứng dụng.</span></div>
  <div class="kv"><span class="k">Scope.REQUEST</span><span class="v">Mỗi request tới một bản mới; lan lên mọi thứ phụ thuộc nó.</span></div>
  <div class="kv"><span class="k">Scope.TRANSIENT</span><span class="v">Mỗi nơi tiêm nhận một bản mới.</span></div>
  <div class="kv"><span class="k">token REQUEST</span><span class="v">Tiêm đối tượng request hiện tại; kéo theo request scope.</span></div>
  <div class="kv"><span class="k">enableShutdownHooks</span><span class="v">Cho Nest nghe SIGTERM/SIGINT và chạy các hook huỷ/tắt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định dùng singleton; dữ liệu theo request đi bằng tham số (hoặc CLS, Chương 6).</li>
<li>Request scope lan lên cả chuỗi; chỉ <code>@Inject(REQUEST)</code> cũng đủ kích hoạt.</li>
<li>Trường của singleton là của chung mọi người dùng — mỗi <code>await</code> là một cơ hội lộ.</li>
<li>Hook khởi động chạy từ lá lên và được chờ; hook tắt chạy từ gốc xuống.</li>
<li>Trong Docker, gọi <code>app.enableShutdownHooks()</code>, kẻo <code>docker stop</code> mất 10 giây và exit 137.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
