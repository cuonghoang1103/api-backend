/**
 * 2.3 — Module: imports, exports, đóng gói, @Global, phụ thuộc vòng (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c2/app/src/b23:
 * main.ts + rooms/bookings.module.ts với EXPORT=0/1, KHAI_LAI=1 (hai bản RoomsService #1/#2);
 * vong1 (import vòng trần ⇒ ReferenceError), vong2 (forwardRef vẫn sập trong ESM — metadata nạp sớm),
 * vong3 (forwardRef + bí danh kiểu Ref<T> ⇒ paramtypes Object ⇒ chạy), vong4 (tách CryptoModule, hết vòng), global.ts (@Global + re-export).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'typescript', bai: 'typescript-10-1-es-modules', title: 'TypeScript 10.1 — ES module & biên giới kiểu', sub: 'import type bị xoá, import vòng trong ESM — gốc của lỗi ở cuối bài.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-2-dependency-injection', title: 'Spring Boot 3.2 — DI qua constructor hay field', sub: 'Spring Boot 2.6+ cấm vòng phụ thuộc mặc định — cùng triết lý "sửa thiết kế, đừng vá".', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Modules', 'Đóng gói, exports, re-export, @Global, dynamic module.', 'https://docs.nestjs.com/modules'),
  nguon('📘', 'NestJS Docs — Circular dependency', 'forwardRef cho module và provider; khuyến cáo tránh vòng.', 'https://docs.nestjs.com/fundamentals/circular-dependency'),
  nguon('📘', 'NestJS Docs — Common errors', 'Đọc "Nest can\'t resolve dependencies" từng phần.', 'https://docs.nestjs.com/faq/common-errors'),
].join('\n');

const SO_DO = `┌──────────── RoomsModule ────────────┐        ┌────────── BookingsModule ──────────┐
│ providers: RoomsService, RoomsRepo  │        │ imports: [RoomsModule]             │
│ exports:   RoomsService  ═══════════╪═══════►│ providers: BookingsService         │
│            (RoomsRepo ở lại trong)  │        │   constructor(rooms: RoomsService) │
└─────────────────────────────────────┘        └────────────────────────────────────┘
thấy được = provider của chính mình  +  thứ module mình import đã EXPORT  +  module @Global`;
const MA_ROOMS = "import { Injectable, Module } from '@nestjs/common';\nlet dem = 0;\n@Injectable() export class RoomsService {\n  readonly so = ++dem;                                    // đánh số từng bản được tạo\n  constructor() { console.log(`  tạo RoomsService #${this.so}`); }\n  tonTai(id: number) { return id <= 3; }\n}\n@Injectable() export class RoomsRepo {}                  // chi tiết nội bộ, không ai ngoài cần\n@Module({\n  providers: [RoomsService, RoomsRepo],\n  exports: process.env.EXPORT === '1' ? [RoomsService] : [],\n})\nexport class RoomsModule {}";
const MA_BOOK = "import { Injectable, Module } from '@nestjs/common';\nimport { RoomsModule, RoomsService } from './rooms.module.js';\n@Injectable() export class BookingsService {\n  constructor(readonly rooms: RoomsService) {}\n  dat(roomId: number) { return this.rooms.tonTai(roomId) ? `đã đặt phòng ${roomId}` : `không có phòng ${roomId}`; }\n}\n@Module({\n  imports: [RoomsModule],\n  // lỗi hay gặp: \"cho chắc\" khai RoomsService vào providers của module khác\n  providers: process.env.KHAI_LAI === '1' ? [BookingsService, RoomsService] : [BookingsService],\n})\nexport class BookingsModule {}";
const MA_MAIN = "import 'reflect-metadata';\nimport { Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { BookingsModule, BookingsService } from './bookings.module.js';\nimport { RoomsModule, RoomsService } from './rooms.module.js';\n\n@Module({ imports: [RoomsModule, BookingsModule] }) class AppModule {}\ntry {\n  const app = await NestFactory.createApplicationContext(AppModule, { logger: false, abortOnError: false });\n  const b = app.get(BookingsService);\n  console.log(' ', b.dat(2), '|', b.dat(9));\n  const goc = app.get(RoomsService);\n  console.log(`  BookingsService dùng RoomsService #${b.rooms.so}; RoomsModule giữ #${app.select(RoomsModule).get(RoomsService, { strict: true }).so}; get() lấy #${goc.so}`);\n  await app.close();\n} catch (e) { console.log(String((e as Error).message).split('\\n').slice(0, process.env.DU ? 30 : 3).join('\\n')); }";
const OUT_A = "  tạo RoomsService #1\nNest can't resolve dependencies of the BookingsService (?). Please make sure that the argument RoomsService at index [0] is available in the BookingsModule module.\n\nPotential solutions:\n- Is BookingsModule a valid NestJS module?\n- If RoomsService is a provider, is it part of the current BookingsModule?\n- If RoomsService is exported from a separate @Module, is that module imported within BookingsModule?\n  @Module({\n    imports: [ /* the Module containing RoomsService */ ]\n  })\n\nFor more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors";
const OUT_B = "  tạo RoomsService #1\n  đã đặt phòng 2 | không có phòng 9\n  BookingsService dùng RoomsService #1; RoomsModule giữ #1; get() lấy #1";
const OUT_C = "  tạo RoomsService #1\n  tạo RoomsService #2\n  đã đặt phòng 2 | không có phòng 9\n  BookingsService dùng RoomsService #2; RoomsModule giữ #1; get() lấy #2";
const MA_V1U = "import { Injectable, Module } from '@nestjs/common';\nimport { AuthModule, AuthService } from './auth.module.js';\n@Injectable() export class UsersService { constructor(readonly auth: AuthService) {} }\n@Module({ imports: [AuthModule], providers: [UsersService], exports: [UsersService] })\nexport class UsersModule {}";
const MA_V1A = "import { Injectable, Module } from '@nestjs/common';\nimport { UsersModule, UsersService } from './users.module.js';\n@Injectable() export class AuthService { constructor(readonly users: UsersService) {} }\n@Module({ imports: [UsersModule], providers: [AuthService], exports: [AuthService] })\nexport class AuthModule {}";
const OUT_V1 = "file:///app/c2/app/dist/b23/vong1/auth.module.js:20\n    __metadata(\"design:paramtypes\", [UsersService])\n                                     ^\n\nReferenceError: Cannot access 'UsersService' before initialization\n    at file:///app/c2/app/dist/b23/vong1/auth.module.js:20:38";
const MA_V2U = "import { Inject, Injectable, Module, forwardRef } from '@nestjs/common';\nimport { AuthModule, AuthService } from './auth.module.js';\n@Injectable() export class UsersService {\n  constructor(@Inject(forwardRef(() => AuthService)) readonly auth: AuthService) {}\n  ten() { return 'UsersService'; }\n}\n@Module({ imports: [forwardRef(() => AuthModule)], providers: [UsersService], exports: [UsersService] })\nexport class UsersModule {}";
const OUT_V2 = "file:///app/c2/app/dist/b23/vong2/auth.module.js:25\n    __metadata(\"design:paramtypes\", [UsersService])\n                                     ^\n\nReferenceError: Cannot access 'UsersService' before initialization\n    at file:///app/c2/app/dist/b23/vong2/auth.module.js:25:38";
const MA_V3U = "import { Inject, Injectable, Module, forwardRef } from '@nestjs/common';\ntype Ref<T> = T;   // bí danh kiểu ⇒ TS phát \"Object\" thay vì tham chiếu lớp lúc nạp\nimport { AuthModule, AuthService } from './auth.module.js';\n@Injectable() export class UsersService {\n  constructor(@Inject(forwardRef(() => AuthService)) readonly auth: Ref<AuthService>) {}\n  ten() { return 'UsersService'; }\n}\n@Module({ imports: [forwardRef(() => AuthModule)], providers: [UsersService], exports: [UsersService] })\nexport class UsersModule {}";
const OUT_V3 = "chạy được: UsersService → AuthService → UsersService | cùng một bản: true";
const OUT_V3M = "dist/b23/vong3/auth.module.js:25:    __metadata(\"design:paramtypes\", [Object])\ndist/b23/vong3/users.module.js:25:    __metadata(\"design:paramtypes\", [Object])";
const MA_V4 = "import 'reflect-metadata';\nimport { Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n// Cách sửa tốt hơn forwardRef: phần cả hai cùng cần tách ra module thứ ba — đồ thị hết vòng\n@Injectable() class PasswordService { bam(p: string) { return `băm(${p})`; } }\n@Module({ providers: [PasswordService], exports: [PasswordService] }) class CryptoModule {}\n@Injectable() class UsersService { constructor(readonly pw: PasswordService) {} tao(p: string) { return { hash: this.pw.bam(p) }; } }\n@Module({ imports: [CryptoModule], providers: [UsersService], exports: [UsersService] }) class UsersModule {}\n@Injectable() class AuthService {\n  constructor(readonly users: UsersService, readonly pw: PasswordService) {}\n  dangNhap(p: string) { return this.pw.bam(p) === this.users.tao(p).hash; }\n}\n@Module({ imports: [UsersModule, CryptoModule], providers: [AuthService] }) class AuthModule {}\nconst app = await NestFactory.createApplicationContext(AuthModule, { logger: false });\nconsole.log('Crypto ← Users ← Auth, không vòng; đăng nhập:', app.get(AuthService).dangNhap('123'));\nawait app.close();";
const OUT_V4 = "Crypto ← Users ← Auth, không vòng; đăng nhập: true";
const MA_GL = "import 'reflect-metadata';\nimport { Global, Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n@Injectable() class Clock { now() { return '2026-11-24T08:00Z'; } }\n@Injectable() class Mailer {}\n// ① @Global: export một lần ở gốc, MỌI module thấy mà không cần imports\n@Global() @Module({ providers: [Clock], exports: [Clock] }) class CoreModule {}\n// ② re-export: SharedModule gom lại và xuất cả module lẫn provider của mình\n@Module({ providers: [Mailer], exports: [Mailer] }) class MailModule {}\n@Module({ imports: [MailModule], exports: [MailModule] }) class SharedModule {}\n@Injectable() class ReportService { constructor(readonly clock: Clock, readonly mail: Mailer) {} }\n@Module({ imports: [SharedModule], providers: [ReportService] }) class ReportModule {}\n@Module({ imports: [CoreModule, ReportModule] }) class AppModule {}\nconst app = await NestFactory.createApplicationContext(AppModule, { logger: false });\nconst r = app.get(ReportService);\nconsole.log('ReportService thấy Clock (global):', r.clock.now(), '| thấy Mailer (qua SharedModule):', r.mail.constructor.name);\nawait app.close();";
const OUT_GL = "ReportService thấy Clock (global): 2026-11-24T08:00Z | thấy Mailer (qua SharedModule): Mailer";

export default {
  title: '2.3 — Modules: imports, exports, encapsulation, global modules and circular dependencies|||2.3 — Module: imports, exports, đóng gói, module global và phụ thuộc vòng',
  slug: 'nst-2-3-module',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Module là ranh giới nhìn thấy của provider. Thí nghiệm thật với rooms/bookings: quên exports ⇒ đọc từng dòng lỗi "can\'t resolve"; export xong chạy; khai lại provider ở module khác ⇒ hai bản RoomsService (#1, #2) và dữ liệu tách đôi. @Global và re-export. Phụ thuộc vòng trong ESM: import vòng sập lúc nạp, forwardRef một mình vẫn sập, forwardRef + bí danh kiểu thì chạy — và cách tốt nhất là tách module thứ ba.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>2.3 — A module is a wall with one door</h2>
<p class="lead">Our 52-line container let everybody see everything. Nest does not: each module has its own providers, and another module sees only what it <strong>imports</strong> from a module that <strong>exports</strong> it. That wall is what keeps a 60-module company codebase from turning into one big bag of services. This lesson breaks the wall in every common way and reads the error each time.</p>

<pre><code>${esc(SO_DO)}</code></pre>

<h3>Experiment 1 — forget <code>exports</code></h3>
<pre><code class="language-ts">${esc(MA_ROOMS)}</code></pre>
<pre><code class="language-ts">${esc(MA_BOOK)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p>Run with no flags (no export):</p>
<div class="out">${esc(OUT_A)}</div>
<p>Read it in three parts. <strong>Who</strong>: <code>BookingsService</code>. <strong>Which argument</strong>: <code>(?)</code> at index [0] — but this time Nest names the type, <code>RoomsService</code>, because the metadata holds a real class (compare lesson 2.2, where it could not). <strong>Where it looked</strong>: "in the BookingsModule module". The class exists, it was even built (<code>#1</code>) — inside RoomsModule, behind the wall. The second and third hints are the two real fixes; 90% of the time it is the third.</p>
<p>With <code>EXPORT=1</code>:</p>
<div class="out">${esc(OUT_B)}</div>
<p>One instance, shared across the wall. <code>RoomsRepo</code> stays private — BookingsModule cannot inject it, which is the point: you may rename or delete it without breaking another team.</p>

<h3>Experiment 2 — "just add it to providers too"</h3>
<p>The tempting fix for experiment 1 is to list <code>RoomsService</code> in BookingsModule's own <code>providers</code>. It compiles and runs (<code>EXPORT=1 KHAI_LAI=1</code>):</p>
<div class="out">${esc(OUT_C)}</div>
<p>Two instances. A provider listed in two modules is two recipes, so two objects. RoomsModule's controller uses <code>#1</code>, bookings use <code>#2</code>: with in-memory data (milestone 1) a room created through <code>POST /rooms</code> lives in <code>#1</code> and bookings, checking <code>#2</code>, answer "no such room". With a database the bug hides better — two connection pools, two caches. Rule: <strong>a provider is listed in exactly one module</strong>; everybody else imports.</p>

<h3>Experiment 3 — <code>@Global</code> and re-exporting</h3>
<pre><code class="language-ts">${esc(MA_GL)}</code></pre>
<div class="out">${esc(OUT_GL)}</div>
<p><code>@Global()</code> makes a module's exports visible everywhere once it is imported somewhere (usually AppModule). Use it for true infrastructure — config, logger, clock, database — not for feature services, or the wall disappears and you are back to the bag. A <strong>re-export</strong> (<code>exports: [MailModule]</code>) lets a "shared" module bundle several modules behind one import.</p>

<h3>Experiment 4 — circular dependencies in ESM</h3>
<p>Users need Auth (to issue a token on registration), Auth needs Users (to find the user at login). Naively:</p>
<pre><code class="language-ts">${esc(MA_V1U)}</code></pre>
<pre><code class="language-ts">${esc(MA_V1A)}</code></pre>
<div class="out">${esc(OUT_V1)}</div>
<p>Exactly lesson 2.1's experiment 3, now across two files: ESM evaluates <code>auth.module.js</code> first (it is imported by <code>users.module.js</code>), and its decorator metadata reaches for <code>UsersService</code> before that file has run. The documented Nest tool is <code>forwardRef</code> — on both module imports and both injections:</p>
<pre><code class="language-ts">${esc(MA_V2U)}</code></pre>
<div class="out">${esc(OUT_V2)}</div>
<p>Still crashes, same line. <code>forwardRef(() =&gt; AuthService)</code> delays <em>Nest's</em> lookup, but the type annotation <code>readonly auth: AuthService</code> still makes TypeScript emit <code>[UsersService]</code>/<code>[AuthService]</code> eagerly. In ESM, touching a class before its file has run is a <code>ReferenceError</code>. The fix that works is to hide the class from the metadata with a type alias:</p>
<pre><code class="language-ts">${esc(MA_V3U)}</code></pre>
<div class="out">${esc(OUT_V3)}</div>
<div class="out">${esc(OUT_V3M)}</div>
<p>The metadata now says <code>Object</code> (harmless, <code>@Inject</code> gives the real token) and the cycle resolves to one instance each. It works — and it is three layers of trickery to keep a design smell. The better fix is to ask <em>what both sides need</em> and move it into a third module:</p>
<pre><code class="language-ts">${esc(MA_V4)}</code></pre>
<div class="out">${esc(OUT_V4)}</div>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<ol>
<li>In experiment 2, which instance does <code>RoomsController</code> (declared in RoomsModule) get? Which output line proves it?</li>
<li>You get <code>Nest can't resolve dependencies of the ReportService (Clock, ?)</code>. List, in order, the three things you check.</li>
</ol>
<details><summary>Show the answer</summary>
<p>1 — <code>#1</code>: "RoomsModule giữ #1" is <code>select(RoomsModule).get(…, { strict: true })</code>, the instance RoomsModule's own classes receive. Only BookingsModule's classes get <code>#2</code>. 2 — (a) Is the second parameter's type an interface or an <code>import type</code>? (Nest would print a class name otherwise.) (b) Is that provider registered in some module? (c) Does that module export it, and does ReportService's module import that module (or is it <code>@Global</code>)?</p>
</details>
</div>

<h3>💼 On the job</h3>
<p>Company projects often have a giant <code>SharedModule</code> exporting a dozen services that everybody imports. Handy at first, a bottleneck later, when every change reruns every feature's tests. In review, ask: is this provider listed in two modules? Does this module really need <code>@Global</code>? A module diagram in the README (milestone 2.8) lets the team see a cycle forming early.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">encapsulation</span><span class="v">A module's providers are private unless exported.</span></div>
  <div class="kv"><span class="k">exports</span><span class="v">The only door: providers (or whole modules) other modules may use.</span></div>
  <div class="kv"><span class="k">@Global()</span><span class="v">Exports become visible to every module; for infrastructure only.</span></div>
  <div class="kv"><span class="k">re-export</span><span class="v">Exporting an imported module so importers get its exports too.</span></div>
  <div class="kv"><span class="k">forwardRef</span><span class="v">Delays Nest's lookup of a class in a cycle; does not stop TypeScript's eager metadata in ESM.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Visible = own providers + exports of imported modules + global modules.</li>
<li>"Can't resolve … in the X module" with a class name ⇒ export/import problem; with <code>(?)</code> and no name ⇒ token problem.</li>
<li>List a provider in one module only; listing it twice silently makes two instances.</li>
<li>In ESM, a cycle needs <code>forwardRef</code> <em>and</em> a type alias; prefer extracting a third module.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>2.3 — Module là bức tường có đúng một cửa</h2>
<p class="lead">Container 52 dòng của ta cho ai cũng thấy mọi thứ. Nest thì không: mỗi module có provider riêng, và module khác chỉ thấy được thứ nó <strong>import</strong> từ một module đã <strong>export</strong> thứ đó. Chính bức tường này giữ cho mã nguồn 60 module của một công ty không biến thành một bao tải service. Bài này phá tường theo mọi cách hay gặp và đọc lỗi từng lần.</p>

<pre><code>${esc(SO_DO)}</code></pre>

<h3>Thí nghiệm 1 — quên <code>exports</code></h3>
<pre><code class="language-ts">${esc(MA_ROOMS)}</code></pre>
<pre><code class="language-ts">${esc(MA_BOOK)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p>Chạy không cờ (không export):</p>
<div class="out">${esc(OUT_A)}</div>
<p>Đọc thành ba phần. <strong>Ai</strong>: <code>BookingsService</code>. <strong>Tham số nào</strong>: <code>(?)</code> tại index [0] — nhưng lần này Nest gọi được tên kiểu, <code>RoomsService</code>, vì metadata chứa một class thật (so với bài 2.2, lúc nó không gọi được). <strong>Tìm ở đâu</strong>: "in the BookingsModule module". Class có tồn tại, thậm chí đã được tạo (<code>#1</code>) — bên trong RoomsModule, sau bức tường. Gợi ý thứ hai và thứ ba là hai cách sửa thật; 90% trường hợp là cách thứ ba.</p>
<p>Với <code>EXPORT=1</code>:</p>
<div class="out">${esc(OUT_B)}</div>
<p>Một bản, dùng chung qua tường. <code>RoomsRepo</code> vẫn là của riêng — BookingsModule không tiêm được nó, và đó chính là mục đích: bạn đổi tên hay xoá nó mà không làm vỡ mã của nhóm khác.</p>

<h3>Thí nghiệm 2 — "thêm luôn vào providers cho chắc"</h3>
<p>Cách sửa dễ dãi cho thí nghiệm 1 là khai <code>RoomsService</code> vào chính <code>providers</code> của BookingsModule. Biên dịch được, chạy được (<code>EXPORT=1 KHAI_LAI=1</code>):</p>
<div class="out">${esc(OUT_C)}</div>
<p>Hai bản. Provider khai ở hai module là hai công thức, nên ra hai đối tượng. Controller của RoomsModule dùng <code>#1</code>, phần đặt lịch dùng <code>#2</code>: với dữ liệu trong bộ nhớ (mốc 1), phòng tạo qua <code>POST /rooms</code> nằm ở <code>#1</code>, còn đặt lịch tra <code>#2</code> nên trả lời "không có phòng". Với cơ sở dữ liệu thật, lỗi trốn kỹ hơn — hai pool kết nối, hai bộ nhớ đệm. Luật: <strong>một provider chỉ khai ở đúng một module</strong>; nơi khác thì import.</p>

<h3>Thí nghiệm 3 — <code>@Global</code> và re-export</h3>
<pre><code class="language-ts">${esc(MA_GL)}</code></pre>
<div class="out">${esc(OUT_GL)}</div>
<p><code>@Global()</code> làm thứ module export ra hiện ở mọi nơi, chỉ cần import nó một lần (thường ở AppModule). Dùng cho hạ tầng thật sự — cấu hình, logger, đồng hồ, cơ sở dữ liệu — đừng dùng cho service tính năng, kẻo bức tường biến mất và ta quay về cái bao tải. <strong>Re-export</strong> (<code>exports: [MailModule]</code>) cho một module "dùng chung" gom nhiều module lại sau một lần import.</p>

<h3>Thí nghiệm 4 — phụ thuộc vòng trong ESM</h3>
<p>Users cần Auth (cấp token lúc đăng ký), Auth cần Users (tìm người dùng lúc đăng nhập). Viết thẳng:</p>
<pre><code class="language-ts">${esc(MA_V1U)}</code></pre>
<pre><code class="language-ts">${esc(MA_V1A)}</code></pre>
<div class="out">${esc(OUT_V1)}</div>
<p>Đúng thí nghiệm 3 của bài 2.1, giờ trải qua hai tệp: ESM chạy <code>auth.module.js</code> trước (vì <code>users.module.js</code> import nó), và metadata decorator của nó với tới <code>UsersService</code> khi tệp kia chưa chạy. Công cụ Nest ghi trong tài liệu là <code>forwardRef</code> — đặt ở cả hai import module lẫn hai chỗ tiêm:</p>
<pre><code class="language-ts">${esc(MA_V2U)}</code></pre>
<div class="out">${esc(OUT_V2)}</div>
<p>Vẫn sập, cùng dòng. <code>forwardRef(() =&gt; AuthService)</code> hoãn việc tra của <em>Nest</em>, nhưng chú thích kiểu <code>readonly auth: AuthService</code> vẫn khiến TypeScript phát <code>[UsersService]</code>/<code>[AuthService]</code> ngay lập tức. Ở ESM, chạm vào một class trước khi tệp của nó chạy là <code>ReferenceError</code>. Cách chạy được là giấu class khỏi metadata bằng một bí danh kiểu:</p>
<pre><code class="language-ts">${esc(MA_V3U)}</code></pre>
<div class="out">${esc(OUT_V3)}</div>
<div class="out">${esc(OUT_V3M)}</div>
<p>Metadata giờ ghi <code>Object</code> (vô hại, <code>@Inject</code> đã đưa token thật) và vòng được giải thành mỗi bên một bản. Chạy được — nhưng là ba lớp mẹo để giữ một mùi thiết kế. Cách sửa tốt hơn là hỏi <em>hai bên cùng cần gì</em>, rồi chuyển phần đó sang module thứ ba:</p>
<pre><code class="language-ts">${esc(MA_V4)}</code></pre>
<div class="out">${esc(OUT_V4)}</div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Ở thí nghiệm 2, <code>RoomsController</code> (khai trong RoomsModule) nhận bản nào? Dòng output nào chứng minh?</li>
<li>Bạn gặp <code>Nest can't resolve dependencies of the ReportService (Clock, ?)</code>. Liệt kê theo thứ tự ba thứ cần kiểm.</li>
</ol>
<details><summary>Xem đáp án</summary>
<p>1 — <code>#1</code>: "RoomsModule giữ #1" là <code>select(RoomsModule).get(…, { strict: true })</code>, đúng bản mà các class của chính RoomsModule nhận. Chỉ class của BookingsModule nhận <code>#2</code>. 2 — (a) Kiểu của tham số thứ hai có phải interface hay <code>import type</code> không? (nếu là class thật, Nest đã in tên). (b) Provider đó có được khai ở module nào không? (c) Module đó có export nó, và module của ReportService có import module đó không (hoặc nó có <code>@Global</code> không)?</p>
</details>
</div>

<h3>💼 Đi làm thật</h3>
<p>Dự án thật ở công ty thường có một <code>SharedModule</code> "khổng lồ" export cả chục service, ai cũng import. Nó tiện lúc đầu và thành nút thắt khi mỗi lần sửa phải chạy lại test của mọi tính năng. Khi review, hãy hỏi: provider này có đang khai ở hai module không? module này có thật sự cần <code>@Global</code> không? Sơ đồ module trong README (mốc dự án 2.8) giúp cả nhóm thấy ngay vòng nào đang chớm hình thành.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">đóng gói (encapsulation)</span><span class="v">Provider của module là riêng tư trừ khi được export.</span></div>
  <div class="kv"><span class="k">exports</span><span class="v">Cửa duy nhất: provider (hoặc cả module) mà module khác được dùng.</span></div>
  <div class="kv"><span class="k">@Global()</span><span class="v">Thứ được export hiện ở mọi module; chỉ dành cho hạ tầng.</span></div>
  <div class="kv"><span class="k">re-export</span><span class="v">Export lại một module đã import, để ai import mình cũng thấy thứ nó export.</span></div>
  <div class="kv"><span class="k">forwardRef</span><span class="v">Hoãn việc Nest tra một class trong vòng; không chặn được metadata nạp sớm của TypeScript ở ESM.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thấy được = provider của mình + thứ module đã import export ra + module global.</li>
<li>"Can't resolve … in the X module" có tên class ⇒ lỗi export/import; có <code>(?)</code> không tên ⇒ lỗi token.</li>
<li>Mỗi provider khai ở một module; khai hai lần lặng lẽ tạo hai bản.</li>
<li>Ở ESM, vòng cần <code>forwardRef</code> <em>và</em> bí danh kiểu; nên ưu tiên tách module thứ ba.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
