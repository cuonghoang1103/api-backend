/**
 * 2.2 — Provider chuyên sâu (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c2/app/src/b22:
 * main.parts.ts + main.ts (abstract class token, useValue/chuỗi, symbol, useFactory async + inject, useExisting, @Optional),
 * loi.ts (interface ⇒ lỗi resolve), importtype.ts (import type ⇒ paramtypes = Function),
 * checkout.spec.ts (Vitest 4.1.12 trên máy nhà, Node v22.22.2: overrideProvider().useValue).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'typescript', bai: 'typescript-14-2-abstract-implements', title: 'TypeScript 14.2 — Kế thừa, abstract & implements', sub: 'abstract class là thứ cho phép một "hợp đồng" làm token trong Nest.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-3-stereotype', title: 'Spring Boot 3.3 — @Configuration và @Bean', sub: 'useFactory của Nest ≈ phương thức @Bean của Spring.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-5-lab-test-double', title: 'Testing — Lab 3: Đồ đóng thế trung thực', sub: 'Bản giả tốt trông thế nào — overrideProvider chỉ là chỗ cắm nó.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Custom providers', 'useValue, useClass, useFactory, useExisting, token không phải class, export provider tuỳ biến.', 'https://docs.nestjs.com/fundamentals/custom-providers'),
  nguon('📘', 'NestJS Docs — Asynchronous providers', 'Factory trả Promise: Nest chờ xong mới tạo thứ phụ thuộc.', 'https://docs.nestjs.com/fundamentals/async-providers'),
  nguon('📘', 'NestJS Docs — Testing', 'Test.createTestingModule, overrideProvider().useValue/useClass/useFactory.', 'https://docs.nestjs.com/fundamentals/testing'),
].join('\n');
const MA_PARTS = "import 'reflect-metadata';\nimport { Inject, Injectable, Module, Optional } from '@nestjs/common';\n\n// ① abstract class làm token: không cần @Inject, vẫn có kiểu\nexport abstract class PaymentGateway { abstract charge(vnd: number): string; }\n@Injectable() export class VnpayGateway extends PaymentGateway {\n  charge(vnd: number) { return `VNPAY đã trừ ${vnd.toLocaleString('vi-VN')}₫`; }\n}\n\n// ② useValue + token chuỗi    ③ token symbol\nexport const CAU_HINH = 'CAU_HINH';\nexport const DONG_HO = Symbol('DONG_HO');\n\n// ④ useFactory bất đồng bộ — Nest CHỜ promise xong mới tạo thứ phụ thuộc nó\nexport const DB = 'DB';\nexport async function ketNoiDb(cfg: { dbUrl: string }) {\n  await new Promise((r) => setTimeout(r, 300));\n  console.log(`  [factory] đã kết nối ${cfg.dbUrl} sau 300 ms`);\n  return { query: (s: string) => `rows(${s})` };\n}\n\n@Injectable() export class LoggerThat { id = Math.random().toString(36).slice(2, 6); }\n\n@Injectable()\nexport class CheckoutService {\n  constructor(\n    private readonly gw: PaymentGateway,                                  // ①\n    @Inject(CAU_HINH) private readonly cfg: { phiDichVu: number },        // ②\n    @Inject(DONG_HO) private readonly now: () => Date,                    // ③\n    @Inject(DB) private readonly db: { query(s: string): string },         // ④\n    @Inject('LOGGER_CU') private readonly logCu: LoggerThat,              // ⑤ alias\n    private readonly log: LoggerThat,\n    @Optional() @Inject('KHUYEN_MAI') private readonly km?: { giam: number }, // ⑥\n  ) {}\n  thanhToan(vnd: number) {\n    const tong = vnd + this.cfg.phiDichVu - (this.km?.giam ?? 0);\n    return {\n      gw: this.gw.charge(tong), luc: this.now().toISOString(), db: this.db.query('INSERT payment'),\n      aliasCungMotBan: this.logCu === this.log, khuyenMai: this.km ?? 'không có (@Optional ⇒ undefined)',\n    };\n  }\n}";
const MA_MOD = "import 'reflect-metadata';\nimport { Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { PaymentGateway, VnpayGateway, CAU_HINH, DONG_HO, DB, ketNoiDb, LoggerThat, CheckoutService } from './main.parts.js';\n\n@Module({\n  providers: [\n    { provide: PaymentGateway, useClass: VnpayGateway },\n    { provide: CAU_HINH, useValue: { phiDichVu: 2_000, dbUrl: 'postgres://lab/booking' } },\n    { provide: DONG_HO, useValue: () => new Date('2026-11-24T08:00:00Z') },\n    { provide: DB, useFactory: ketNoiDb, inject: [CAU_HINH] },\n    LoggerThat,\n    { provide: 'LOGGER_CU', useExisting: LoggerThat },\n    CheckoutService,\n  ],\n})\nclass AppModule {}\n\nconst app = await NestFactory.createApplicationContext(AppModule, { logger: false });\nconsole.log(app.get(CheckoutService).thanhToan(150_000));\nconsole.log('gateway thực là:', app.get(PaymentGateway).constructor.name);\nawait app.close();";
const OUT_MAIN = "  [factory] đã kết nối postgres://lab/booking sau 300 ms\n{\n  gw: 'VNPAY đã trừ 152.000₫',\n  luc: '2026-11-24T08:00:00.000Z',\n  db: 'rows(INSERT payment)',\n  aliasCungMotBan: true,\n  khuyenMai: 'không có (@Optional ⇒ undefined)'\n}\ngateway thực là: VnpayGateway";
const MA_LOI = "import 'reflect-metadata';\nimport { Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\ninterface Mailer { gui(to: string): void }\n@Injectable() class NotifyService { constructor(private readonly mailer: Mailer) {} }\n@Module({ providers: [NotifyService] }) class M {}\nawait NestFactory.createApplicationContext(M, { logger: false, abortOnError: false }).catch((e) => console.log(e.message));";
const OUT_LOI = "Nest can't resolve dependencies of the NotifyService (?). Please make sure that the argument at index [0] is available in the current module.\n\nPotential solutions:\n- The dependency at index [0] appears to be undefined at runtime\n- This commonly occurs when using 'import type' instead of 'import' for injectable classes\n- Check your imports and change:\n  ❌ import type { SomeService } from './some.service';\n  ✅ import { SomeService } from './some.service';\n- Ensure the imported class is decorated with @Injectable() or is a valid provider\n- If using dynamic imports, ensure the class is available at runtime, not just for type checking\n\nFor more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n        at async CAC.run (file:///app/nst-esm/node_modules/vitest/dist/chunks/cac.DzDtg8hz.js:2318:2) {\n      cause: [Error]\n    }\n  }\n}";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport { CheckoutService, PaymentGateway, VnpayGateway, LoggerThat, CAU_HINH, DONG_HO } from './main.parts.js';\n\ndescribe('CheckoutService', () => {\n  it('thay gateway thật bằng bản giả — service không sửa một dòng', async () => {\n    const charge = vi.fn((vnd: number) => `GIẢ ${vnd}`);\n    const mod = await Test.createTestingModule({\n      providers: [\n        CheckoutService, LoggerThat,\n        { provide: PaymentGateway, useClass: VnpayGateway },\n        { provide: CAU_HINH, useValue: { phiDichVu: 2_000 } },\n        { provide: DONG_HO, useValue: () => new Date(0) },\n        { provide: 'DB', useValue: { query: () => 'rows' } },\n        { provide: 'LOGGER_CU', useExisting: LoggerThat },\n      ],\n    })\n      .overrideProvider(PaymentGateway).useValue({ charge })\n      .compile();\n    const kq = mod.get(CheckoutService).thanhToan(100_000);\n    expect(charge).toHaveBeenCalledWith(102_000);\n    expect(kq.gw).toBe('GIẢ 102000');\n  });\n});";
const OUT_SPEC = " ✓ src/b22/checkout.spec.ts > CheckoutService > thay gateway thật bằng bản giả — service không sửa một dòng 61ms\n Test Files  1 passed (1)\n      Tests  1 passed (1)";
const MA_IT = "import 'reflect-metadata';\nimport { Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport type { RoomsService } from './kieu.js';          // ← chỉ thêm chữ \"type\"\nimport { RoomsService as RS } from './kieu.js';\n\n@Injectable() class BookingsService { constructor(private readonly rooms: RoomsService) {} }\nconsole.log('design:paramtypes =', Reflect.getMetadata('design:paramtypes', BookingsService));\n@Module({ providers: [BookingsService, RS] }) class M {}\nawait NestFactory.createApplicationContext(M, { logger: false, abortOnError: false })\n  .then(() => console.log('chạy được'), (e) => console.log(String(e.message).split('\\n')[0]));";
const OUT_IT = "design:paramtypes = [ [Function: Function] ]\nNest can't resolve dependencies of the BookingsService (?). Please make sure that the argument Function at index [0] is available in the M module.";
const OUT_BT = "## bt1\n✗ thiếu dbUrl\n## bt2\n  [factory] đã kết nối postgres://lab/booking sau 300 ms\n{\n  gw: 'VNPAY đã trừ 142.000₫',\n  luc: '2026-11-24T08:00:00.000Z',\n  db: 'rows(INSERT payment)',\n  aliasCungMotBan: true,\n  khuyenMai: { giam: 10000 }\n}\ngateway thực là: VnpayGateway\n## bt3\n  [factory] đã kết nối postgres://lab/booking sau 300 ms\n{\n  gw: 'VNPAY đã trừ 152.000₫',\n  luc: '2026-11-24T08:00:00.000Z',\n  db: 'rows(INSERT payment)',\n  aliasCungMotBan: false,\n  khuyenMai: 'không có (@Optional ⇒ undefined)'\n}\ngateway thực là: VnpayGateway";

export default {
  title: '2.2 — Providers in depth: useClass, useValue, useFactory, useExisting, tokens and @Inject|||2.2 — Provider chuyên sâu: useClass, useValue, useFactory, useExisting, token và @Inject',
  slug: 'nst-2-2-provider',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một module Nest 12 dùng đủ sáu kiểu provider trong một lần chạy thật: abstract class làm token, useValue với token chuỗi, token symbol, useFactory bất đồng bộ có inject (Nest chờ 300 ms), useExisting làm bí danh, @Optional. Hai lỗi resolve hay gặp nhất và gốc của chúng (interface ⇒ Object, import type ⇒ Function). Thay bản thật bằng bản giả trong test bằng overrideProvider.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>2.2 — Six ways to say "here is how to build it"</h2>
<p class="lead">Writing <code>providers: [RoomsService]</code> is shorthand for <code>{ provide: RoomsService, useClass: RoomsService }</code>. The long form has four recipes — class, value, factory, alias — and the <code>provide</code> key can be a class, a string or a symbol. One checkout module below uses every combination, so you see each recipe's real output side by side.</p>

<h3>The parts: a contract, three tokens, a slow factory</h3>
<pre><code class="language-ts">${esc(MA_PARTS)}</code></pre>
<h3>The module: one line per recipe</h3>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<div class="out">${esc(OUT_MAIN)}</div>

<table>
<thead><tr><th>#</th><th>Recipe</th><th>Use it for</th><th>Seen in the output</th></tr></thead>
<tbody>
<tr><td>①</td><td><code>useClass</code> with an <strong>abstract class</strong> as token</td><td>a contract with several implementations (payment, mail, storage)</td><td>the service asked for <code>PaymentGateway</code> and got <code>VnpayGateway</code>, with no <code>@Inject</code>: an abstract class exists at runtime, an interface does not</td></tr>
<tr><td>②</td><td><code>useValue</code> + string token</td><td>configuration objects, constants, ready-made fakes</td><td><code>phiDichVu</code> 2 000 added to the total</td></tr>
<tr><td>③</td><td>symbol token</td><td>same as ② but impossible to collide with another library's string</td><td>a fixed clock — tests get a stable time</td></tr>
<tr><td>④</td><td><code>useFactory</code> + <code>inject</code>, async</td><td>a value computed from other providers: a DB connection from config</td><td>the factory line printed first: Nest <strong>awaited</strong> the promise before building <code>CheckoutService</code></td></tr>
<tr><td>⑤</td><td><code>useExisting</code></td><td>an alias while renaming, or exposing one instance under two tokens</td><td><code>aliasCungMotBan: true</code> — no second logger</td></tr>
<tr><td>⑥</td><td><code>@Optional()</code></td><td>a feature that works without the dependency</td><td>no provider for <code>'KHUYEN_MAI'</code> ⇒ <code>undefined</code> instead of a startup error</td></tr>
</tbody>
</table>
<p>Rule of thumb: <strong>string tokens go in a constant</strong> (<code>export const CAU_HINH = 'CAU_HINH'</code>) so a typo is a compile error, not a runtime "can't resolve". Do not spread <code>@Optional()</code> around to silence errors — a missing database should crash at startup.</p>

<h3>Two resolve errors you will see this month</h3>
<p><strong>A parameter typed as an interface:</strong></p>
<pre><code class="language-ts">${esc(MA_LOI)}</code></pre>
<div class="out">${esc(OUT_LOI)}</div>
<p>Note <code>(?)</code> and "index [0]": Nest does not even know a name, because the metadata says <code>Object</code> (lesson 2.1, step ⑧). The printed hint about <code>import type</code> is generic — your real fix is an abstract class or <code>@Inject(TOKEN)</code>.</p>
<p><strong>A class imported with <code>import type</code></strong> — an editor "quick fix" or a lint rule often does this for you:</p>
<pre><code class="language-ts">${esc(MA_IT)}</code></pre>
<div class="out">${esc(OUT_IT)}</div>
<p>The type-only import is erased, so TypeScript writes the generic <code>Function</code>. The provider <em>is</em> registered — under its real class, which nobody asked for. Remove the word <code>type</code>. If a lint rule keeps adding it, set <code>consistent-type-imports</code> to ignore decorator metadata (typescript-eslint has an option for exactly this).</p>

<h3>Swapping the real thing for a fake in a test</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_SPEC)}</div>
<p><code>overrideProvider(token)</code> replaces the recipe <em>after</em> the module is described and <em>before</em> it is built — the same token, a different recipe. <code>CheckoutService</code> is untouched; the test proves it charges 100 000 + 2 000 fee. This is the payoff of experiment 1 in lesson 2.1.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<ol>
<li>Change ④ so <code>ketNoiDb</code> throws when <code>dbUrl</code> is missing. What happens at startup, and does <code>CheckoutService</code> get built?</li>
<li>Register <code>'KHUYEN_MAI'</code> with <code>useValue: { giam: 10_000 }</code>. Which line of the output changes?</li>
<li>Replace <code>useExisting</code> with <code>useClass: LoggerThat</code>. Predict <code>aliasCungMotBan</code>.</li>
</ol>
<details><summary>Show the answer</summary>
<div class="out">${esc(OUT_BT)}</div>
<p>1 — <code>createApplicationContext</code> rejects with your error; nothing that depends on <code>DB</code> is built, so the app never half-starts. 2 — the <code>gw</code> line becomes <code>142.000₫</code> and <code>khuyenMai</code> prints the object. 3 — <code>false</code>: <code>useClass</code> under a new token is a <em>second</em> recipe, so a second instance; only <code>useExisting</code> points at the same one.</p>
</details>
</div>

<h3>💼 On the job</h3>
<p>At work you rarely write <code>useFactory</code> from scratch; you read it in existing code — <code>TypeOrmModule.forRootAsync({ useFactory })</code>, <code>JwtModule.registerAsync</code>, a home-made Redis provider. When an e2e test "suddenly" calls the real payment sandbox, the question is: which token was not overridden? A good habit on a new project: list the tokens in the README and mark which ones tests must replace.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">custom provider</span><span class="v">The long form <code>{ provide, use… }</code>.</span></div>
  <div class="kv"><span class="k">injection token</span><span class="v">The <code>provide</code> key: class, abstract class, string or symbol.</span></div>
  <div class="kv"><span class="k">@Inject(token)</span><span class="v">Tells Nest which token a parameter wants when the type cannot say it.</span></div>
  <div class="kv"><span class="k">async provider</span><span class="v">A factory returning a Promise; Nest awaits it during startup.</span></div>
  <div class="kv"><span class="k">overrideProvider</span><span class="v">Testing API that swaps a provider's recipe before the module is compiled.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four recipes: <code>useClass</code>, <code>useValue</code>, <code>useFactory</code> (+<code>inject</code>, may be async), <code>useExisting</code>.</li>
<li>Abstract class = contract and token at once; interfaces need an explicit token.</li>
<li><code>(?)</code> at an index means the metadata is <code>Object</code> or <code>Function</code>: interface or <code>import type</code>.</li>
<li>Tests keep the module and swap recipes with <code>overrideProvider</code>.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>2.2 — Sáu cách nói "tạo nó thế này"</h2>
<p class="lead">Viết <code>providers: [RoomsService]</code> là dạng tắt của <code>{ provide: RoomsService, useClass: RoomsService }</code>. Dạng đầy đủ có bốn công thức — class, giá trị, factory, bí danh — và khoá <code>provide</code> có thể là class, chuỗi hoặc symbol. Module thanh toán dưới đây dùng đủ mọi tổ hợp, để bạn thấy output thật của từng công thức đặt cạnh nhau.</p>

<h3>Các mảnh ghép: một hợp đồng, ba token, một factory chậm</h3>
<pre><code class="language-ts">${esc(MA_PARTS)}</code></pre>
<h3>Module: mỗi công thức một dòng</h3>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<div class="out">${esc(OUT_MAIN)}</div>

<table>
<thead><tr><th>#</th><th>Công thức</th><th>Dùng khi</th><th>Thấy trong output</th></tr></thead>
<tbody>
<tr><td>①</td><td><code>useClass</code> với <strong>abstract class</strong> làm token</td><td>một hợp đồng có nhiều bản cài đặt (thanh toán, gửi thư, lưu tệp)</td><td>service xin <code>PaymentGateway</code> và nhận <code>VnpayGateway</code>, không cần <code>@Inject</code>: abstract class tồn tại lúc chạy, interface thì không</td></tr>
<tr><td>②</td><td><code>useValue</code> + token chuỗi</td><td>đối tượng cấu hình, hằng số, bản giả làm sẵn</td><td><code>phiDichVu</code> 2 000 được cộng vào tổng</td></tr>
<tr><td>③</td><td>token symbol</td><td>như ② nhưng không thể trùng với chuỗi của thư viện khác</td><td>đồng hồ cố định — test có thời gian ổn định</td></tr>
<tr><td>④</td><td><code>useFactory</code> + <code>inject</code>, bất đồng bộ</td><td>giá trị tính từ provider khác: kết nối cơ sở dữ liệu từ cấu hình</td><td>dòng của factory in đầu tiên: Nest <strong>chờ</strong> promise xong rồi mới tạo <code>CheckoutService</code></td></tr>
<tr><td>⑤</td><td><code>useExisting</code></td><td>bí danh khi đổi tên dần, hoặc lộ một bản dưới hai token</td><td><code>aliasCungMotBan: true</code> — không có logger thứ hai</td></tr>
<tr><td>⑥</td><td><code>@Optional()</code></td><td>tính năng vẫn chạy được khi thiếu phụ thuộc</td><td>không có provider <code>'KHUYEN_MAI'</code> ⇒ <code>undefined</code> thay vì lỗi khởi động</td></tr>
</tbody>
</table>
<p>Kinh nghiệm: <strong>token chuỗi luôn đặt trong một hằng</strong> (<code>export const CAU_HINH = 'CAU_HINH'</code>) để gõ sai thành lỗi biên dịch, không thành "can't resolve" lúc chạy. Đừng rải <code>@Optional()</code> để dập lỗi — thiếu cơ sở dữ liệu thì phải sập ngay lúc khởi động.</p>

<h3>Hai lỗi resolve bạn sẽ gặp ngay tháng này</h3>
<p><strong>Tham số khai kiểu interface:</strong></p>
<pre><code class="language-ts">${esc(MA_LOI)}</code></pre>
<div class="out">${esc(OUT_LOI)}</div>
<p>Để ý <code>(?)</code> và "index [0]": Nest không biết nổi một cái tên, vì metadata ghi <code>Object</code> (bài 2.1, bước ⑧). Gợi ý in ra về <code>import type</code> là gợi ý chung — cách sửa thật của bạn là abstract class hoặc <code>@Inject(TOKEN)</code>.</p>
<p><strong>Class được import bằng <code>import type</code></strong> — "sửa nhanh" của trình soạn thảo hay một luật lint thường tự làm việc này:</p>
<pre><code class="language-ts">${esc(MA_IT)}</code></pre>
<div class="out">${esc(OUT_IT)}</div>
<p>Import chỉ-kiểu bị xoá khi biên dịch, nên TypeScript ghi chữ chung chung <code>Function</code>. Provider <em>có</em> đăng ký — dưới class thật của nó, mà không ai xin cái đó. Xoá chữ <code>type</code>. Nếu luật lint cứ thêm lại, chỉnh <code>consistent-type-imports</code> để bỏ qua metadata decorator (typescript-eslint có sẵn tuỳ chọn cho đúng việc này).</p>

<h3>Thay bản thật bằng bản giả trong test</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_SPEC)}</div>
<p><code>overrideProvider(token)</code> thay công thức <em>sau</em> khi module được mô tả và <em>trước</em> khi được tạo — cùng token, khác công thức. <code>CheckoutService</code> không sửa một dòng; test chứng minh nó trừ 100 000 cộng 2 000 phí. Đây là phần thưởng của thí nghiệm 1 bài 2.1.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Sửa ④ để <code>ketNoiDb</code> ném lỗi khi thiếu <code>dbUrl</code>. Lúc khởi động chuyện gì xảy ra, <code>CheckoutService</code> có được tạo không?</li>
<li>Đăng ký <code>'KHUYEN_MAI'</code> bằng <code>useValue: { giam: 10_000 }</code>. Dòng nào của output đổi?</li>
<li>Thay <code>useExisting</code> bằng <code>useClass: LoggerThat</code>. Đoán <code>aliasCungMotBan</code>.</li>
</ol>
<details><summary>Xem đáp án</summary>
<div class="out">${esc(OUT_BT)}</div>
<p>1 — <code>createApplicationContext</code> bị từ chối với chính lỗi của bạn; không thứ gì phụ thuộc <code>DB</code> được tạo, nên ứng dụng không bao giờ "khởi động một nửa". 2 — dòng <code>gw</code> thành <code>142.000₫</code> và <code>khuyenMai</code> in ra object. 3 — <code>false</code>: <code>useClass</code> dưới token mới là công thức <em>thứ hai</em>, nên ra bản thứ hai; chỉ <code>useExisting</code> trỏ vào đúng bản cũ.</p>
</details>
</div>

<h3>💼 Đi làm thật</h3>
<p>Ở công ty, bạn sẽ ít khi viết <code>useFactory</code> từ đầu mà đọc nó trong mã có sẵn: <code>TypeOrmModule.forRootAsync({ useFactory })</code>, <code>JwtModule.registerAsync</code>, provider Redis tự viết. Khi một test e2e "tự dưng" gọi cổng thanh toán sandbox thật, câu cần hỏi là: token nào chưa bị <code>overrideProvider</code>? Thói quen tốt khi nhận dự án: in danh sách token ra một tệp README, ghi rõ cái nào phải thay khi test.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">custom provider</span><span class="v">Dạng đầy đủ <code>{ provide, use… }</code>.</span></div>
  <div class="kv"><span class="k">injection token</span><span class="v">Khoá <code>provide</code>: class, abstract class, chuỗi hoặc symbol.</span></div>
  <div class="kv"><span class="k">@Inject(token)</span><span class="v">Báo Nest tham số này cần token nào, khi kiểu không nói được.</span></div>
  <div class="kv"><span class="k">provider bất đồng bộ</span><span class="v">Factory trả Promise; Nest chờ nó trong lúc khởi động.</span></div>
  <div class="kv"><span class="k">overrideProvider</span><span class="v">API test thay công thức của một provider trước khi module được biên dịch.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn công thức: <code>useClass</code>, <code>useValue</code>, <code>useFactory</code> (+<code>inject</code>, có thể bất đồng bộ), <code>useExisting</code>.</li>
<li>Abstract class vừa là hợp đồng vừa là token; interface cần token tường minh.</li>
<li><code>(?)</code> tại một index nghĩa là metadata là <code>Object</code> hoặc <code>Function</code>: interface hoặc <code>import type</code>.</li>
<li>Test giữ nguyên module, thay công thức bằng <code>overrideProvider</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
