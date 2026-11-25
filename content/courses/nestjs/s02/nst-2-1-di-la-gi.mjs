/**
 * 2.1 — Đảo ngược điều khiển từ số 0: tự viết DI container (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, TypeScript 6, reflect-metadata 0.2) — scratchpad/nst/lab/c2/di:
 * khong-di.ts (new bên trong vs constructor injection), container.ts (52 dòng) + demo.ts (8 thí nghiệm),
 * vong-tdz.ts (vòng giữa hai class ESM ⇒ ReferenceError lúc nạp), bài tập container2.ts + baitap.ts (useExisting, transient).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'typescript', bai: 'typescript-14-4-decorators', title: 'TypeScript 14.4 — Decorator', sub: 'Cú pháp decorator từ đầu — bài này dùng nó để đọc kiểu tham số constructor.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-1-ioc-container', title: 'Spring Boot 3.1 — IoC container và bean', sub: 'Cùng ý tưởng ở Java: ApplicationContext là container của Spring.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', title: 'Testing 3.1 — Stub, mock, spy, fake', sub: 'DI cho bạn chỗ để cắm bản giả; bài này phân loại các bản giả.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📄', 'Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern (2004)', 'Bài gốc đặt tên "dependency injection", phân biệt constructor/setter injection và service locator.', 'https://martinfowler.com/articles/injection.html'),
  nguon('📘', 'NestJS Docs — Providers', 'Nest đọc kiểu tham số constructor để tiêm phụ thuộc — đúng điều bạn tự viết trong bài.', 'https://docs.nestjs.com/providers'),
  nguon('📘', 'TypeScript Handbook — Decorators: Metadata', 'emitDecoratorMetadata ghi design:paramtypes; interface bị xoá thành Object.', 'https://www.typescriptlang.org/docs/handbook/decorators.html#metadata'),
].join('\n');

const DO_THI = `BookingsService
 ├── RoomsService
 │    ├── RoomsRepo
 │    │    └── Db
 │    ├── Logger  ◄──────────┐  một bản, hai nơi dùng
 │    └── 'GIO_MO_CUA' (factory)
 └── Logger ─────────────────┘

thứ tự tạo = duyệt sâu, lá trước:  Db → RoomsRepo → Logger → GIO_MO_CUA → RoomsService → BookingsService`;
const MA_KHONG = "// Không DI: OrderService tự \"đi chợ\" — tự new MailService bên trong\nclass MailService {\n  gui(to: string, noiDung: string) { console.log(`  [SMTP THẬT] gửi tới ${to}: ${noiDung}`); }\n}\nclass OrderService {\n  private mail = new MailService();                 // ← dính chặt vào bản thật\n  datHang(email: string) { this.mail.gui(email, 'Đơn #1 đã nhận'); return 'ok'; }\n}\n\n// Có DI: nhận MailService qua constructor — ai tạo thì kệ\nclass OrderServiceDI {\n  constructor(private readonly mail: { gui(to: string, n: string): void }) {}\n  datHang(email: string) { this.mail.gui(email, 'Đơn #1 đã nhận'); return 'ok'; }\n}\n\nconsole.log('— \"test\" bản không DI:');\nnew OrderService().datHang('sv@fpt.edu.vn');        // muốn test mà không gửi thư thật? không có cách sạch\n\nconsole.log('— test bản có DI, đưa vào bản giả:');\nconst daGui: string[] = [];\nconst gia = { gui: (to: string) => { daGui.push(to); } };\nconsole.log('  kết quả:', new OrderServiceDI(gia).datHang('sv@fpt.edu.vn'), '| thư giả đã ghi:', daGui);";
const OUT_KHONG = "— \"test\" bản không DI:\n  [SMTP THẬT] gửi tới sv@fpt.edu.vn: Đơn #1 đã nhận\n— test bản có DI, đưa vào bản giả:\n  kết quả: ok | thư giả đã ghi: [ 'sv@fpt.edu.vn' ]";
const MA_CON = "import 'reflect-metadata';\n\nexport type Token = string | symbol | (abstract new (...a: any[]) => unknown);\ntype Provider =\n  | { useClass: new (...a: any[]) => unknown }\n  | { useValue: unknown }\n  | { useFactory: (...a: any[]) => unknown; inject?: Token[] };\n\nconst tenToken = (t: Token) => (typeof t === 'function' ? t.name : String(t));\n\n// @Injectable chỉ để TypeScript phát design:paramtypes; @Inject(token) ghi đè một vị trí\nexport const Injectable = (): ClassDecorator => () => {};\nexport const Inject = (token: Token): ParameterDecorator => (target, _key, i) => {\n  const ds: Record<number, Token> = Reflect.getMetadata('inject', target) ?? {};\n  Reflect.defineMetadata('inject', { ...ds, [i]: token }, target);\n};\n\nexport class Container {\n  private dangKy = new Map<Token, Provider>();\n  private daTao = new Map<Token, unknown>();          // singleton: tạo một lần, dùng mãi\n\n  register(token: Token, p?: Provider) {\n    this.dangKy.set(token, p ?? { useClass: token as new (...a: any[]) => unknown });\n    return this;\n  }\n\n  get<T>(token: Token, duong: Token[] = []): T {\n    if (this.daTao.has(token)) return this.daTao.get(token) as T;\n    if (duong.includes(token))                         // đang tạo dở mà lại cần chính nó\n      throw new Error(`Phụ thuộc vòng: ${[...duong, token].map(tenToken).join(' → ')}`);\n    const p = this.dangKy.get(token);\n    if (!p) {\n      const ai = duong.length ? tenToken(duong[duong.length - 1]) : '(gốc)';\n      throw new Error(`Không tạo được ${ai}: thiếu provider cho \"${tenToken(token)}\" (đã đăng ký chưa?)`);\n    }\n    const sau = [...duong, token];\n    let obj: unknown;\n    if ('useValue' in p) obj = p.useValue;\n    else if ('useFactory' in p) obj = p.useFactory(...(p.inject ?? []).map((t) => this.get(t, sau)));\n    else {\n      const kieu: Token[] = Reflect.getMetadata('design:paramtypes', p.useClass) ?? [];\n      const ghiDe: Record<number, Token> = Reflect.getMetadata('inject', p.useClass) ?? {};\n      const thamSo = kieu.map((k, i) => ghiDe[i] ?? k);\n      if (thamSo.some((t) => t === Object))\n        throw new Error(`${p.useClass.name}: tham số kiểu interface/any — cần @Inject(token)`);\n      obj = new p.useClass(...thamSo.map((t) => this.get(t, sau)));\n    }\n    console.log(`  tạo ${tenToken(token)}`);\n    this.daTao.set(token, obj);\n    return obj as T;\n  }\n}";
const MA_DEMO = "import { Container, Injectable, Inject } from './container.js';\n\n@Injectable() class Db { truyVan(sql: string) { return [`kết quả của ${sql}`]; } }\n@Injectable() class Logger { log(m: string) { console.log(`  [log] ${m}`); } }\n@Injectable() class RoomsRepo { constructor(private db: Db) {} tatCa() { return this.db.truyVan('SELECT * FROM rooms'); } }\n@Injectable() class RoomsService {\n  constructor(private repo: RoomsRepo, private log: Logger, @Inject('GIO_MO_CUA') public gio: string) {}\n  danhSach() { this.log.log('liệt kê phòng'); return this.repo.tatCa(); }\n}\n@Injectable() class BookingsService { constructor(public rooms: RoomsService, public log: Logger) {} }\n\nconst c = new Container()\n  .register(Db).register(Logger).register(RoomsRepo).register(RoomsService).register(BookingsService)\n  .register('GIO_MO_CUA', { useFactory: () => process.env.GIO ?? '07:00–21:00' });\n\nconsole.log('① xin BookingsService — container tự đi hết đồ thị:');\nconst b = c.get<BookingsService>(BookingsService);\nconsole.log('② dùng:', b.rooms.danhSach(), '| giờ:', b.rooms.gio);\nconsole.log('③ xin lại RoomsService — không tạo mới:', c.get(RoomsService) === b.rooms);\nconsole.log('④ Logger dùng chung một bản:', b.log === (b.rooms as any).log);\n\nconsole.log('⑤ thay Db bằng bản giả (đúng việc test sẽ làm):');\nconst t = new Container().register(RoomsRepo).register(Db, { useValue: { truyVan: () => ['phòng giả'] } });\nconsole.log('  ', t.get<RoomsRepo>(RoomsRepo).tatCa());\n\nconsole.log('⑥ quên đăng ký Logger:');\ntry { new Container().register(Db).register(RoomsRepo).register(RoomsService).get(RoomsService); }\ncatch (e) { console.log('  ✗', (e as Error).message); }\n\nconsole.log('⑦ vòng qua token chuỗi (A cần B, B cần A):');\n@Injectable() class A { constructor(@Inject('B') public b: unknown) {} }\n@Injectable() class B { constructor(@Inject('A') public a: unknown) {} }\ntry { new Container().register('A', { useClass: A }).register('B', { useClass: B }).get('A'); }\ncatch (e) { console.log('  ✗', (e as Error).message); }\n\nconsole.log('⑧ tham số kiểu interface:');\ninterface Mailer { gui(): void }\n@Injectable() class Notify { constructor(public m: Mailer) {} }\ntry { new Container().register(Notify).get(Notify); } catch (e) { console.log('  ✗', (e as Error).message); }";
const OUT_DEMO = "① xin BookingsService — container tự đi hết đồ thị:\n  tạo Db\n  tạo RoomsRepo\n  tạo Logger\n  tạo GIO_MO_CUA\n  tạo RoomsService\n  tạo BookingsService\n  [log] liệt kê phòng\n② dùng: [ 'kết quả của SELECT * FROM rooms' ] | giờ: 07:00–21:00\n③ xin lại RoomsService — không tạo mới: true\n④ Logger dùng chung một bản: true\n⑤ thay Db bằng bản giả (đúng việc test sẽ làm):\n  tạo Db\n  tạo RoomsRepo\n   [ 'phòng giả' ]\n⑥ quên đăng ký Logger:\n  tạo Db\n  tạo RoomsRepo\n  ✗ Không tạo được RoomsService: thiếu provider cho \"Logger\" (đã đăng ký chưa?)\n⑦ vòng qua token chuỗi (A cần B, B cần A):\n  ✗ Phụ thuộc vòng: A → B → A\n⑧ tham số kiểu interface:\n  ✗ Notify: tham số kiểu interface/any — cần @Inject(token)";
const MA_TDZ = "import 'reflect-metadata';\nconst Injectable = (): ClassDecorator => () => {};\n@Injectable() class A { constructor(public b: B) {} }\n@Injectable() class B { constructor(public a: A) {} }\nconsole.log(Reflect.getMetadata('design:paramtypes', A));";
const OUT_TDZ = "file:///app/c2/di/dist/vong-tdz.js:20\n    __metadata(\"design:paramtypes\", [B])\n                                     ^\n\nReferenceError: Cannot access 'B' before initialization\n    at file:///app/c2/di/dist/vong-tdz.js:20:38\n    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)\n    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)\n    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)\n\nNode.js v22.23.5";
const DIFF_BT = "6a7\n>   | { useExisting: Token }\n7a9\n> type Dang = Provider & { transient?: boolean };\n19c21\n<   private dangKy = new Map<Token, Provider>();\n---\n>   private dangKy = new Map<Token, Dang>();\n22c24\n<   register(token: Token, p?: Provider) {\n---\n>   register(token: Token, p?: Dang) {\n37a40\n>     if ('useExisting' in p) return this.get(p.useExisting, sau);   // bí danh: trả đúng bản của token kia\n49c52\n<     this.daTao.set(token, obj);\n---\n>     if (!p.transient) this.daTao.set(token, obj);                  // transient: không nhớ, lần sau tạo mới";
const MA_BT = "import { Container, Injectable } from './container2.js';\n@Injectable() class Logger { id = Math.random().toString(36).slice(2, 6); }\n@Injectable() class Nhap { id = Math.random().toString(36).slice(2, 6); }\nconst c = new Container()\n  .register(Logger).register('LOGGER_CU', { useExisting: Logger })\n  .register(Nhap, { useClass: Nhap, transient: true });\nconsole.log('alias cùng bản:', c.get(Logger) === c.get('LOGGER_CU'));\nconsole.log('transient khác bản:', c.get<Nhap>(Nhap).id !== c.get<Nhap>(Nhap).id);";
const OUT_BT = "  tạo Logger\nalias cùng bản: true\n  tạo Nhap\n  tạo Nhap\ntransient khác bản: true";

export default {
  title: '2.1 — Inversion of control from zero: write a 60-line DI container|||2.1 — Đảo ngược điều khiển từ số 0: tự viết DI container 60 dòng',
  slug: 'nst-2-1-di-la-gi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao "new" bên trong constructor làm mã khó test, và đảo ngược điều khiển giải quyết thế nào. Tự viết một DI container 52 dòng: đọc design:paramtypes, tạo singleton, nhận token chuỗi/symbol, useValue/useFactory, báo thiếu provider và phát hiện phụ thuộc vòng. Thấy vì sao interface không làm token được, và vì sao hai class phụ thuộc vòng trong ESM sập ngay lúc nạp — nền cho cả Chương 2.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>2.1 — The cook does not go shopping</h2>
<p class="lead">Chapter 1 ended with a 62-line mini Nest whose <code>taoDoiTuong</code> function quietly created your services. That one line is the heart of Nest. In this lesson you grow it into a real dependency-injection container — singletons, tokens, factories, clear errors, cycle detection — in 52 lines. After this, every Nest DI error message in this chapter will read like plain language.</p>

<h3>Everyday picture: a restaurant kitchen</h3>
<p>A home cook decides what to cook, goes to the market, buys the fish, then cooks. A restaurant cook does not shop: ingredients arrive at the station, prepared, from someone whose job is supply. The cook only says <em>what</em> they need ("200 g of salmon"). That is <strong>inversion of control</strong>: the object stops creating what it depends on and declares it instead. The kitchen manager who delivers is the <strong>container</strong>. On test day you can hand the cook plastic fish — the recipe does not change.</p>

<h3>Experiment 1 — <code>new</code> inside versus a constructor parameter</h3>
<pre><code class="language-ts">${esc(MA_KHONG)}</code></pre>
<div class="out">${esc(OUT_KHONG)}</div>
<p>The first service sends a real email in a "test" because it chose its own <code>MailService</code>. The second takes whatever it is given; the test gives it a fake that just records the address. That is all dependency injection is: <strong>pass dependencies in, don't create them inside</strong>. You could stop here and wire everything by hand in <code>main.ts</code> — many Express apps do. A container exists because with 40 services, hand wiring becomes a 200-line file that must be edited in the right order every time.</p>

<h3>Experiment 2 — a container in 52 lines</h3>
<p>The container has two maps: <em>registrations</em> (token → how to build it) and <em>instances</em> (token → the object already built). <code>get(token)</code> returns a cached instance, otherwise builds one — and to build a class it reads <code>design:paramtypes</code> (lesson 1.1), calls <code>get</code> for each parameter type, then <code>new</code>s the class. The <code>duong</code> ("path") array remembers what is being built right now, which is enough to detect cycles.</p>
<pre><code class="language-ts">${esc(MA_CON)}</code></pre>
<p>Using it, with the same classes as the course project:</p>
<pre><code class="language-ts">${esc(MA_DEMO)}</code></pre>
<div class="out">${esc(OUT_DEMO)}</div>
<pre><code>${esc(DO_THI)}</code></pre>
<table>
<thead><tr><th>Step</th><th>What it proves</th></tr></thead>
<tbody>
<tr><td>①</td><td>You asked for one class; the container walked the whole graph depth-first and built leaves first. Nobody wrote <code>new Db()</code>.</td></tr>
<tr><td>②</td><td>A string token (<code>'GIO_MO_CUA'</code>) can carry a value that is not a class — opening hours from an environment variable.</td></tr>
<tr><td>③ ④</td><td><strong>Singleton</strong>: asking again returns the same object; <code>Logger</code> is shared by two consumers. This is Nest's default scope.</td></tr>
<tr><td>⑤</td><td>Register <code>Db</code> as a plain value and the repository receives a fake — what <code>overrideProvider</code> does in Nest tests (lesson 2.2).</td></tr>
<tr><td>⑥</td><td>A missing registration fails <em>at startup</em> with the name of who needed it — the shape of Nest's "can't resolve dependencies of X".</td></tr>
<tr><td>⑦</td><td>A → B → A is detected because A is still in the path when B asks for it.</td></tr>
<tr><td>⑧</td><td>An <code>interface</code> does not exist at runtime: TypeScript wrote <code>Object</code> into the metadata. Nothing can be looked up by "Object", so you need an explicit token.</td></tr>
</tbody>
</table>

<h3>Experiment 3 — a cycle between two classes in ESM</h3>
<p>Step ⑦ used string tokens. With class types the cycle breaks much earlier:</p>
<pre><code class="language-ts">${esc(MA_TDZ)}</code></pre>
<div class="out">${esc(OUT_TDZ)}</div>
<p>No container was even involved. <code>emitDecoratorMetadata</code> writes <code>[B]</code> into A's metadata while A is being defined — and <code>B</code> is a <code>class</code> declared below, still in its temporal dead zone. Nest 12 projects are ESM by default, so you will meet this exact error when two services depend on each other. Lesson 2.3 shows the fix (and why the better fix is to remove the cycle).</p>

<h3>The toy versus the real Nest container</h3>
<table>
<thead><tr><th>Feature</th><th>Our 52 lines</th><th>Nest</th></tr></thead>
<tbody>
<tr><td>Who may see a provider</td><td>everyone</td><td>only its module and modules that import an export (2.3)</td></tr>
<tr><td>Async factory</td><td>no</td><td>awaits <code>useFactory</code> promises before building dependants (2.2)</td></tr>
<tr><td>Scopes</td><td>singleton only</td><td>singleton, request, transient (2.4)</td></tr>
<tr><td>Lifecycle</td><td>none</td><td><code>onModuleInit</code> … <code>onApplicationShutdown</code> (2.4)</td></tr>
<tr><td>Configurable modules</td><td>none</td><td><code>forRoot</code>, <code>ConfigurableModuleBuilder</code> (2.5)</td></tr>
<tr><td>Core idea</td><td colspan="2">identical: read constructor types, look up by token, build once, cache</td></tr>
</tbody>
</table>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p>Add two provider kinds to the container, keeping it under 60 lines:</p>
<ol>
<li><code>{ useExisting: Logger }</code> — an alias: a second token that returns <em>the same instance</em> as another.</li>
<li><code>transient: true</code> — every <code>get</code> builds a new object.</li>
</ol>
<p>Passes when this prints two <code>true</code> lines:</p>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<details><summary>Show the answer</summary>
<pre><code class="language-diff">${esc(DIFF_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Four changed lines. The alias simply delegates to <code>get</code> of the target token, so it shares the cache. Transient skips the cache write — note <code>tạo Nhap</code> printed twice.</p>
</details>
</div>

<h3>💼 On the job</h3>
<p>Outsourcing projects often carry hand-wired Express code: a home-made <code>container.js</code>, or routes that <code>require</code> a service which <code>require</code>s the database connection directly. When the client asks for tests, the team lead's first question is "where are we calling <code>new</code> ourselves?". Spotting experiment 1's pattern in someone else's code is the real skill — before any move to Nest.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inversion of control (IoC)</span><span class="v">The object stops creating its dependencies; something outside supplies them.</span></div>
  <div class="kv"><span class="k">dependency injection (DI)</span><span class="v">The common way to do IoC: pass dependencies through the constructor.</span></div>
  <div class="kv"><span class="k">container / injector</span><span class="v">The component that knows how to build every registered thing and caches the results.</span></div>
  <div class="kv"><span class="k">provider</span><span class="v">A registration: a token plus a recipe (class, value or factory).</span></div>
  <div class="kv"><span class="k">token</span><span class="v">The lookup key: a class, a string or a symbol. Never an interface — it does not exist at runtime.</span></div>
  <div class="kv"><span class="k">singleton</span><span class="v">One instance per container, reused by every consumer. Nest's default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>DI = pass dependencies in. A container automates the wiring once the graph grows.</li>
<li>Nest's container reads <code>design:paramtypes</code>, looks up each type as a token, builds depth-first and caches.</li>
<li>Missing providers and cycles fail at startup, not at the first request.</li>
<li>Interfaces become <code>Object</code> in metadata ⇒ use a class, an abstract class or an explicit token.</li>
<li>Two classes depending on each other in ESM crash at load time, before Nest runs.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>2.1 — Đầu bếp không tự đi chợ</h2>
<p class="lead">Chương 1 khép lại với một Nest tí hon 62 dòng, trong đó hàm <code>taoDoiTuong</code> lặng lẽ tạo service giúp bạn. Chính dòng đó là trái tim của Nest. Bài này nuôi nó lớn thành một DI container thật — singleton, token, factory, báo lỗi rõ, phát hiện vòng — chỉ trong 52 dòng. Học xong, mọi thông báo lỗi DI của Nest trong chương này sẽ đọc như tiếng người.</p>

<h3>Liên hệ đời thường: bếp nhà hàng</h3>
<p>Nấu ở nhà: bạn tự nghĩ món, tự ra chợ, tự mua cá, rồi mới nấu. Đầu bếp nhà hàng thì không đi chợ: nguyên liệu được mang tới tận bàn, sơ chế sẵn, bởi người chuyên lo hàng. Đầu bếp chỉ nói <em>cần gì</em> ("200 g cá hồi"). Đó là <strong>đảo ngược điều khiển</strong> (inversion of control): đối tượng thôi tự tạo thứ nó phụ thuộc, mà khai báo ra. Người quản bếp mang hàng tới là <strong>container</strong>. Hôm kiểm tra tay nghề, bạn đưa đầu bếp cá nhựa — công thức không đổi một chữ.</p>

<h3>Thí nghiệm 1 — <code>new</code> bên trong, hay nhận qua constructor</h3>
<pre><code class="language-ts">${esc(MA_KHONG)}</code></pre>
<div class="out">${esc(OUT_KHONG)}</div>
<p>Service đầu tiên gửi thư thật ngay trong "test", vì nó tự chọn <code>MailService</code> của mình. Service thứ hai nhận gì dùng nấy; test đưa vào bản giả chỉ ghi lại địa chỉ. Dependency injection chỉ có vậy: <strong>đưa phụ thuộc vào, đừng tự tạo bên trong</strong>. Bạn có thể dừng ở đây và tự nối tay mọi thứ trong <code>main.ts</code> — nhiều ứng dụng Express làm thế. Container ra đời vì khi có 40 service, nối tay thành một tệp 200 dòng phải sửa đúng thứ tự mỗi lần thêm gì.</p>

<h3>Thí nghiệm 2 — container trong 52 dòng</h3>
<p>Container có hai bảng: <em>đăng ký</em> (token → cách tạo) và <em>đã tạo</em> (token → đối tượng đã có). <code>get(token)</code> trả bản đã có; chưa có thì tạo — và để tạo một class, nó đọc <code>design:paramtypes</code> (bài 1.1), gọi <code>get</code> cho từng kiểu tham số, rồi <code>new</code>. Mảng <code>duong</code> nhớ những thứ đang tạo dở — chừng đó đủ để bắt vòng.</p>
<pre><code class="language-ts">${esc(MA_CON)}</code></pre>
<p>Dùng thử, với đúng các class của dự án khoá học:</p>
<pre><code class="language-ts">${esc(MA_DEMO)}</code></pre>
<div class="out">${esc(OUT_DEMO)}</div>
<pre><code>${esc(DO_THI)}</code></pre>
<table>
<thead><tr><th>Bước</th><th>Chứng minh điều gì</th></tr></thead>
<tbody>
<tr><td>①</td><td>Bạn xin một class; container tự đi hết đồ thị theo chiều sâu, tạo lá trước. Không ai viết <code>new Db()</code>.</td></tr>
<tr><td>②</td><td>Token chuỗi (<code>'GIO_MO_CUA'</code>) mang được giá trị không phải class — giờ mở cửa lấy từ biến môi trường.</td></tr>
<tr><td>③ ④</td><td><strong>Singleton</strong>: xin lại được đúng đối tượng cũ; <code>Logger</code> dùng chung cho hai nơi. Đây là scope mặc định của Nest.</td></tr>
<tr><td>⑤</td><td>Đăng ký <code>Db</code> bằng một giá trị thường, repository nhận ngay bản giả — đúng việc <code>overrideProvider</code> làm trong test Nest (bài 2.2).</td></tr>
<tr><td>⑥</td><td>Thiếu đăng ký thì lỗi <em>lúc khởi động</em>, kèm tên ai cần nó — chính là dáng của lỗi "can't resolve dependencies of X" trong Nest.</td></tr>
<tr><td>⑦</td><td>A → B → A bị bắt vì A vẫn còn trong đường đi khi B xin nó.</td></tr>
<tr><td>⑧</td><td><code>interface</code> không tồn tại lúc chạy: TypeScript ghi <code>Object</code> vào metadata. Không tra được gì bằng "Object", nên phải có token tường minh.</td></tr>
</tbody>
</table>

<h3>Thí nghiệm 3 — hai class phụ thuộc vòng trong ESM</h3>
<p>Bước ⑦ dùng token chuỗi. Với kiểu là class, vòng gãy sớm hơn nhiều:</p>
<pre><code class="language-ts">${esc(MA_TDZ)}</code></pre>
<div class="out">${esc(OUT_TDZ)}</div>
<p>Không có container nào tham gia cả. <code>emitDecoratorMetadata</code> ghi <code>[B]</code> vào metadata của A ngay lúc A đang được định nghĩa — mà <code>B</code> là <code>class</code> khai báo bên dưới, còn nằm trong vùng chết tạm thời (temporal dead zone). Dự án Nest 12 mặc định là ESM, nên bạn sẽ gặp đúng lỗi này khi hai service phụ thuộc lẫn nhau. Bài 2.3 chỉ cách sửa — và vì sao cách sửa tốt hơn là xoá luôn cái vòng.</p>

<h3>Container đồ chơi so với container thật của Nest</h3>
<table>
<thead><tr><th>Tính năng</th><th>52 dòng của ta</th><th>Nest</th></tr></thead>
<tbody>
<tr><td>Ai được thấy provider</td><td>mọi nơi</td><td>chỉ module của nó, và module import thứ nó export (2.3)</td></tr>
<tr><td>Factory bất đồng bộ</td><td>không</td><td>chờ promise của <code>useFactory</code> rồi mới tạo thứ phụ thuộc (2.2)</td></tr>
<tr><td>Scope</td><td>chỉ singleton</td><td>singleton, request, transient (2.4)</td></tr>
<tr><td>Vòng đời</td><td>không</td><td><code>onModuleInit</code> … <code>onApplicationShutdown</code> (2.4)</td></tr>
<tr><td>Module có cấu hình</td><td>không</td><td><code>forRoot</code>, <code>ConfigurableModuleBuilder</code> (2.5)</td></tr>
<tr><td>Ý tưởng lõi</td><td colspan="2">giống hệt: đọc kiểu tham số constructor, tra theo token, tạo một lần, nhớ lại</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p>Thêm hai kiểu provider vào container, giữ dưới 60 dòng:</p>
<ol>
<li><code>{ useExisting: Logger }</code> — bí danh: một token thứ hai trả về <em>đúng bản</em> của token kia.</li>
<li><code>transient: true</code> — mỗi lần <code>get</code> tạo một đối tượng mới.</li>
</ol>
<p>Đạt khi đoạn này in ra hai dòng <code>true</code>:</p>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<details><summary>Xem đáp án</summary>
<pre><code class="language-diff">${esc(DIFF_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Bốn dòng đổi. Bí danh chỉ gọi lại <code>get</code> của token đích, nên dùng chung bộ nhớ đệm. Transient bỏ qua bước ghi vào bộ nhớ đệm — để ý <code>tạo Nhap</code> in hai lần.</p>
</details>
</div>

<h3>💼 Đi làm thật</h3>
<p>Dự án outsourcing hay có "mã cũ" Express nối tay: một tệp <code>container.js</code> tự viết, hoặc mỗi route <code>require</code> thẳng service rồi service <code>require</code> thẳng kết nối cơ sở dữ liệu. Khi khách hàng muốn viết test, câu đầu tiên trưởng nhóm hỏi là "chỗ nào đang tự <code>new</code>?". Nhận ra mẫu ở thí nghiệm 1 trong mã người khác là kỹ năng đọc mã thật sự — trước cả khi chuyển sang Nest.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">đảo ngược điều khiển (IoC)</span><span class="v">Đối tượng thôi tự tạo phụ thuộc; có thứ khác bên ngoài cung cấp.</span></div>
  <div class="kv"><span class="k">dependency injection (DI)</span><span class="v">Cách làm IoC phổ biến nhất: đưa phụ thuộc vào qua constructor.</span></div>
  <div class="kv"><span class="k">container / injector</span><span class="v">Thành phần biết cách tạo mọi thứ đã đăng ký và nhớ lại kết quả.</span></div>
  <div class="kv"><span class="k">provider</span><span class="v">Một mục đăng ký: token kèm cách tạo (class, giá trị hoặc factory).</span></div>
  <div class="kv"><span class="k">token</span><span class="v">Khoá để tra: class, chuỗi hoặc symbol. Không bao giờ là interface — nó không tồn tại lúc chạy.</span></div>
  <div class="kv"><span class="k">singleton</span><span class="v">Một bản cho mỗi container, mọi nơi dùng chung. Mặc định của Nest.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>DI = đưa phụ thuộc vào. Container tự động hoá việc nối khi đồ thị lớn dần.</li>
<li>Container của Nest đọc <code>design:paramtypes</code>, tra từng kiểu như một token, tạo theo chiều sâu và nhớ lại.</li>
<li>Thiếu provider hay có vòng thì lỗi lúc khởi động, không đợi tới request đầu tiên.</li>
<li>Interface thành <code>Object</code> trong metadata ⇒ dùng class, abstract class hoặc token tường minh.</li>
<li>Hai class phụ thuộc lẫn nhau trong ESM sập ngay lúc nạp, trước khi Nest kịp chạy.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
