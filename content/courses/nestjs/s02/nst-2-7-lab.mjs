/**
 * 2.7 — Lab: đổi nhà cung cấp thanh toán mà không sửa service (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c2/app/src/lab27 + lab27.sh
 * (PAYMENT_PROVIDER=vnpay | momo | paypal ⇒ exit 1); orders.spec.ts 5 test xanh (Vitest 4.1.12 trên máy nhà, Node v22.22.2, supertest);
 * bài tập thêm: lab27z (ZaloPay — orders.ts không đổi dòng nào; chặn cổng giả khi NODE_ENV=production ⇒ exit 1).
 * Sự cố thật: Knight Capital 01/08/2012 — cờ cấu hình dùng lại bật đường mã cũ "Power Peg" trên 1/8 máy chủ chưa cập nhật,
 * hơn 4 triệu lệnh trong 45 phút, lỗ hơn 460 triệu USD (SEC, thông cáo 2013-222, 16/10/2013).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'online-payments', bai: 'pay-12-2-tich-hop', title: 'Thanh toán trực tuyến 12.2 — Hai cổng sau một giao diện chung', sub: 'Phía nghiệp vụ của lab này: webhook, idempotency, đối soát khi có nhiều cổng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-5-lab-test-double', title: 'Testing — Lab 3: Đồ đóng thế trung thực', sub: 'FakeGateway ghi lại lời gọi — một "fake" đúng nghĩa.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🏛️', 'SEC — SEC Charges Knight Capital With Violations of Market Access Rule (2013-222)', 'Sự cố 01/08/2012: hơn 4 triệu lệnh trong 45 phút cho 212 lệnh khách, lỗ hơn 460 triệu USD.', 'https://www.sec.gov/news/press-release/2013-222'),
  nguon('📘', 'NestJS Docs — Custom providers: factory providers', 'useFactory + inject — lõi của lab.', 'https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory'),
].join('\n');
const MA_PAY = "import { Injectable, Logger, Module } from '@nestjs/common';\n\n// Hợp đồng — service chỉ biết cái này\nexport abstract class PaymentGateway {\n  abstract readonly ten: string;\n  abstract charge(orderId: string, vnd: number): Promise<{ ok: boolean; maGd: string }>;\n}\n\n@Injectable() export class VnpayGateway extends PaymentGateway {\n  readonly ten = 'vnpay';\n  async charge(orderId: string, vnd: number) { return { ok: true, maGd: `VNP-${orderId}-${vnd}` }; }\n}\n@Injectable() export class MomoGateway extends PaymentGateway {\n  readonly ten = 'momo';\n  async charge(orderId: string, vnd: number) { return { ok: vnd <= 50_000_000, maGd: `MOMO-${orderId}` }; }\n}\n@Injectable() export class FakeGateway extends PaymentGateway {\n  readonly ten = 'fake';\n  readonly daGoi: Array<[string, number]> = [];\n  async charge(orderId: string, vnd: number) { this.daGoi.push([orderId, vnd]); return { ok: true, maGd: 'FAKE' }; }\n}\n\nexport const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';          // token cho giá trị cấu hình\n\nexport function chonGateway(ten: string | undefined, vnpay: VnpayGateway, momo: MomoGateway, fake: FakeGateway) {\n  const bang: Record<string, PaymentGateway> = { vnpay, momo, fake };\n  const gw = ten && bang[ten];\n  if (!gw) throw new Error(`PAYMENT_PROVIDER=\"${ten}\" không hợp lệ (vnpay | momo | fake)`);\n  new Logger('PaymentModule').log(`dùng cổng ${gw.ten}`);\n  return gw;\n}\n\n@Module({\n  providers: [\n    VnpayGateway, MomoGateway, FakeGateway,\n    { provide: PAYMENT_PROVIDER, useFactory: () => process.env.PAYMENT_PROVIDER },\n    { provide: PaymentGateway, useFactory: chonGateway, inject: [PAYMENT_PROVIDER, VnpayGateway, MomoGateway, FakeGateway] },\n  ],\n  exports: [PaymentGateway],\n})\nexport class PaymentModule {}";
const MA_ORD = "import { BadRequestException, Body, Controller, HttpCode, Injectable, Module, Post } from '@nestjs/common';\nimport { PaymentGateway, PaymentModule } from './payment.js';\n\n@Injectable() export class OrdersService {\n  private n = 0;\n  constructor(private readonly gw: PaymentGateway) {}           // ← không biết vnpay hay momo\n  async tao(vnd: number) {\n    if (!Number.isInteger(vnd) || vnd <= 0) throw new BadRequestException('vnd phải là số nguyên dương');\n    const id = `DH${++this.n}`;\n    const kq = await this.gw.charge(id, vnd);\n    return { id, vnd, congThanhToan: this.gw.ten, ...kq };\n  }\n}\n@Controller('orders') export class OrdersController {\n  constructor(private readonly orders: OrdersService) {}\n  @Post() @HttpCode(201) tao(@Body() b: { vnd: number }) { return this.orders.tao(b?.vnd); }\n}\n@Module({ imports: [PaymentModule], controllers: [OrdersController], providers: [OrdersService] })\nexport class OrdersModule {}";
const MA_MAIN = "import 'reflect-metadata';\nimport { NestFactory } from '@nestjs/core';\nimport { OrdersModule } from './orders.js';\nconst app = await NestFactory.create(OrdersModule, { logger: ['log', 'error'] });\nawait app.listen(3000);";
const MA_SH = "cd /app/c2/app\nfor p in vnpay momo; do\n  echo \"## PAYMENT_PROVIDER=$p\"\n  PAYMENT_PROVIDER=$p node dist/${M:-lab27}/main.js > /tmp/log.txt 2>&1 & P=$!\n  for i in $(seq 50); do curl -s localhost:3000 >/dev/null && break; sleep 0.1; done\n  grep -o 'dùng cổng.*' /tmp/log.txt | sed 's/\\x1b\\[[0-9;]*m//g'\n  curl -s -XPOST localhost:3000/orders -H 'content-type: application/json' -d '{\"vnd\":60000000}'; echo\n  kill $P; wait $P 2>/dev/null\ndone\necho \"## PAYMENT_PROVIDER=paypal\"\nPAYMENT_PROVIDER=paypal node dist/${M:-lab27}/main.js 2>&1 | sed 's/\\x1b\\[[0-9;]*m//g' | grep -E 'ERROR|không hợp lệ' | head -2; echo \"exit ${PIPESTATUS[0]}\"";
const OUT_CHAY = "## PAYMENT_PROVIDER=vnpay\ndùng cổng vnpay\n{\"id\":\"DH1\",\"vnd\":60000000,\"congThanhToan\":\"vnpay\",\"ok\":true,\"maGd\":\"VNP-DH1-60000000\"}\n## PAYMENT_PROVIDER=momo\ndùng cổng momo\n{\"id\":\"DH1\",\"vnd\":60000000,\"congThanhToan\":\"momo\",\"ok\":false,\"maGd\":\"MOMO-DH1\"}\n## PAYMENT_PROVIDER=paypal\n[Nest] 47  - 11/23/2026, 9:48:35 PM   ERROR [ExceptionHandler] Error: PAYMENT_PROVIDER=\"paypal\" không hợp lệ (vnpay | momo | fake)\nexit 1";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport { OrdersModule, OrdersService } from './orders.js';\nimport { FakeGateway, PaymentGateway, PaymentModule, PAYMENT_PROVIDER, VnpayGateway, MomoGateway } from './payment.js';\n\ndescribe('PaymentModule chọn cổng theo cấu hình', () => {\n  for (const [ten, Lop] of [['vnpay', VnpayGateway], ['momo', MomoGateway]] as const) {\n    it(`PAYMENT_PROVIDER=${ten} ⇒ ${Lop.name}`, async () => {\n      const m = await Test.createTestingModule({ imports: [PaymentModule] })\n        .overrideProvider(PAYMENT_PROVIDER).useValue(ten).compile();\n      expect(m.get(PaymentGateway)).toBeInstanceOf(Lop);\n    });\n  }\n  it('tên lạ ⇒ từ chối khởi động', async () => {\n    await expect(Test.createTestingModule({ imports: [PaymentModule] })\n      .overrideProvider(PAYMENT_PROVIDER).useValue('paypal').compile()).rejects.toThrow(/không hợp lệ/);\n  });\n});\n\ndescribe('OrdersService với cổng giả', () => {\n  it('gọi charge đúng số tiền, không chạm cổng thật', async () => {\n    const fake = new FakeGateway();\n    const m = await Test.createTestingModule({ imports: [OrdersModule] })\n      .overrideProvider(PaymentGateway).useValue(fake).compile();\n    const kq = await m.get(OrdersService).tao(120_000);\n    expect(kq).toMatchObject({ id: 'DH1', congThanhToan: 'fake', ok: true });\n    expect(fake.daGoi).toEqual([['DH1', 120_000]]);\n  });\n});\n\ndescribe('e2e POST /orders', () => {\n  it('201 khi hợp lệ, 400 khi vnd âm', async () => {\n    const m = await Test.createTestingModule({ imports: [OrdersModule] })\n      .overrideProvider(PaymentGateway).useClass(FakeGateway).compile();\n    const app = m.createNestApplication({ logger: false });\n    await app.init();\n    await request(app.getHttpServer()).post('/orders').send({ vnd: 99_000 }).expect(201)\n      .expect((r) => expect(r.body.congThanhToan).toBe('fake'));\n    await request(app.getHttpServer()).post('/orders').send({ vnd: -5 }).expect(400);\n    await app.close();\n  });\n});";
const OUT_SPEC = " ✓ src/lab27/orders.spec.ts > PaymentModule chọn cổng theo cấu hình > PAYMENT_PROVIDER=vnpay ⇒ VnpayGateway 47ms\n ✓ src/lab27/orders.spec.ts > PaymentModule chọn cổng theo cấu hình > PAYMENT_PROVIDER=momo ⇒ MomoGateway 2ms\n ✓ src/lab27/orders.spec.ts > PaymentModule chọn cổng theo cấu hình > tên lạ ⇒ từ chối khởi động 3ms\n ✓ src/lab27/orders.spec.ts > OrdersService với cổng giả > gọi charge đúng số tiền, không chạm cổng thật 3ms\n ✓ src/lab27/orders.spec.ts > e2e POST /orders > 201 khi hợp lệ, 400 khi vnd âm 40ms\n Test Files  1 passed (1)\n      Tests  5 passed (5)\n   Duration  560ms (transform 39ms, setup 0ms, import 284ms, tests 97ms, environment 0ms)";
const DIFF_Z = "--- app/src/lab27/payment.ts\t2026-11-24 04:48:00.239101773 +0700\n+++ lab27z/payment.ts\t2026-11-24 05:02:11.074523367 +0700\n@@ -20,21 +20,26 @@\n   async charge(orderId: string, vnd: number) { this.daGoi.push([orderId, vnd]); return { ok: true, maGd: 'FAKE' }; }\n }\n \n+@Injectable() export class ZalopayGateway extends PaymentGateway {\n+  readonly ten = 'zalopay';\n+  async charge(orderId: string, vnd: number) { return { ok: true, maGd: `ZLP-${orderId}` }; }\n+}\n+\n export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';          // token cho giá trị cấu hình\n \n-export function chonGateway(ten: string | undefined, vnpay: VnpayGateway, momo: MomoGateway, fake: FakeGateway) {\n-  const bang: Record<string, PaymentGateway> = { vnpay, momo, fake };\n+export function chonGateway(ten: string | undefined, vnpay: VnpayGateway, momo: MomoGateway, fake: FakeGateway, zalopay: ZalopayGateway) {\n+  const bang: Record<string, PaymentGateway> = { vnpay, momo, fake, zalopay };\n   const gw = ten && bang[ten];\n-  if (!gw) throw new Error(`PAYMENT_PROVIDER=\"${ten}\" không hợp lệ (vnpay | momo | fake)`);\n+  if (!gw) throw new Error(`PAYMENT_PROVIDER=\"${ten}\" không hợp lệ (vnpay | momo | fake | zalopay)`);\n   new Logger('PaymentModule').log(`dùng cổng ${gw.ten}`);\n   return gw;\n }\n \n @Module({\n   providers: [\n-    VnpayGateway, MomoGateway, FakeGateway,\n+    VnpayGateway, MomoGateway, FakeGateway, ZalopayGateway,\n     { provide: PAYMENT_PROVIDER, useFactory: () => process.env.PAYMENT_PROVIDER },\n-    { provide: PaymentGateway, useFactory: chonGateway, inject: [PAYMENT_PROVIDER, VnpayGateway, MomoGateway, FakeGateway] },\n+    { provide: PaymentGateway, useFactory: chonGateway, inject: [PAYMENT_PROVIDER, VnpayGateway, MomoGateway, FakeGateway, ZalopayGateway] },\n   ],\n   exports: [PaymentGateway],\n })\n--- orders.ts:\nkhông đổi dòng nào";
const OUT_Z = "{\"id\":\"DH1\",\"vnd\":250000,\"congThanhToan\":\"zalopay\",\"ok\":true,\"maGd\":\"ZLP-DH1\"}";
const MA_PF = "  if (ten === 'fake' && process.env.NODE_ENV === 'production')\n    throw new Error('cổng giả bị cấm ở production');               // chặn \"cờ cũ\" bật nhầm đường giả\n  const gw = ten && bang[ten];";
const OUT_PF = "Error: cổng giả bị cấm ở production\nexit 1";

export default {
  title: '2.7 — Lab: Swap a payment provider without touching the service|||2.7 — Lab: Đổi nhà cung cấp thanh toán mà không sửa service',
  slug: 'nst-2-7-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 2: OrdersService chỉ biết abstract class PaymentGateway; PaymentModule chọn VNPAY, MoMo hay cổng giả bằng biến môi trường qua useFactory + inject, và từ chối khởi động khi tên lạ. Chạy thật ba cấu hình, 5 test xanh (chọn cổng, tên lạ, unit với cổng giả, e2e 201/400). Bài tập thêm: thêm ZaloPay mà orders.ts không đổi dòng nào; chặn cổng giả ở production — kèm sự cố Knight Capital 2012 (cờ cấu hình cũ, 45 phút, 460 triệu USD). 5 câu phỏng vấn của Chương 2.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab</span>
<h2>2.7 — Lab: one service, three payment gateways</h2>
<p class="lead">The client wants VNPAY in production, MoMo for a pilot, and no real charges in tests. The rule from the tech lead: <code>OrdersService</code> must not know which gateway it talks to, and switching is a configuration change, not a code change. Everything you need is in lessons 2.2–2.4.</p>

<h3>The brief (90 min)</h3>
<div class="callout ok">
<ol>
<li><code>PaymentGateway</code> is an abstract class with <code>ten</code> and <code>charge(orderId, vnd)</code>. Three implementations: <code>VnpayGateway</code>, <code>MomoGateway</code> (refuses above 50 million ₫), <code>FakeGateway</code> (records every call).</li>
<li><code>PaymentModule</code> exports only <code>PaymentGateway</code>. Which one is chosen depends on <code>PAYMENT_PROVIDER</code>; an unknown value must stop the application at startup.</li>
<li><code>OrdersModule</code>: <code>POST /orders {"vnd": number}</code> ⇒ 201 with the gateway's name and transaction code; 400 when <code>vnd</code> is not a positive integer.</li>
<li>Tests: the factory picks the right class; an unknown name rejects; a unit test with the fake proves the amount charged; an e2e test proves 201 and 400 — <em>without</em> touching a real gateway.</li>
</ol>
<p><strong>Passes when:</strong> the same build behaves differently with <code>PAYMENT_PROVIDER=vnpay</code>/<code>momo</code>, refuses <code>paypal</code> with exit 1, and five tests are green.</p>
</div>

<details><summary>Show a reference solution</summary>
<pre><code class="language-ts">${esc(MA_PAY)}</code></pre>
<pre><code class="language-ts">${esc(MA_ORD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p>Check script and its real output:</p>
<pre><code class="language-bash">${esc(MA_SH)}</code></pre>
<div class="out">${esc(OUT_CHAY)}</div>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_SPEC)}</div>
<p>Design notes. The gateway choice is a <strong>factory with <code>inject</code></strong>: the three gateways are ordinary providers (so each may have its own dependencies — an HTTP client, secrets), and the factory only picks one. The configuration value is itself a provider (<code>PAYMENT_PROVIDER</code>), which is why the test can <code>overrideProvider(PAYMENT_PROVIDER).useValue('momo')</code> instead of mutating <code>process.env</code>. Trade-off: all three gateways are constructed even though one is used; if a constructor is expensive, build inside the factory instead.</p>
</details>

<h3>🕵️ Real incident — Knight Capital, 1 August 2012</h3>
<p>Knight deployed new trading code to eight servers; one was missed. The new code reused an old configuration flag that, on the stale server, switched on "Power Peg", a code path dead since 2003. In the first 45 minutes of trading, that server sent more than 4 million orders while trying to fill 212 customer orders. Knight lost over 460 million USD and was taken over months later; the SEC fined it 12 million (release 2013-222). Two lessons map directly onto this lab: a configuration value that selects an implementation must <strong>reject what it does not recognise</strong> (our <code>paypal</code> ⇒ exit 1), and dangerous implementations must be <strong>impossible to select in production</strong> (exercise 2 below).</p>

<h3>🧪 Extra exercises</h3>
<div class="callout ok">
<ol>
<li>Add ZaloPay. Constraint: <code>orders.ts</code> unchanged.</li>
<li>Make <code>PAYMENT_PROVIDER=fake</code> refuse to start when <code>NODE_ENV=production</code>.</li>
</ol>
<details><summary>Show the answer</summary>
<pre><code class="language-diff">${esc(DIFF_Z)}</code></pre>
<div class="out">${esc(OUT_Z)}</div>
<pre><code class="language-ts">${esc(MA_PF)}</code></pre>
<div class="out">${esc(OUT_PF)}</div>
</details>
</div>

<h3>🎤 What interviewers ask about Chapter 2</h3>
<ol>
<li><strong>"What does <code>@Injectable()</code> actually do?"</strong> — It is a class decorator so TypeScript emits <code>design:paramtypes</code> for the constructor; Nest reads that list to know what to inject. Registration happens by listing the class in a module's <code>providers</code>, not by the decorator.</li>
<li><strong>"Nest can't resolve dependencies of X (?, Y) — what do you check?"</strong> — <code>?</code> without a name: interface or <code>import type</code>, so use a token or abstract class. A class name: is it a provider somewhere, exported, and is that module imported here?</li>
<li><strong>"Why not mark everything @Global?"</strong> — It removes the module wall: any module can depend on anything, nobody can tell what a module needs, and refactoring breaks distant code. Keep it for config, logger, database.</li>
<li><strong>"Request scope — when and what does it cost?"</strong> — When a provider truly needs the request object. It bubbles up to the controller, so the chain is rebuilt per request (3,003 controllers for 3,000 requests in lesson 2.4). Prefer parameters or AsyncLocalStorage.</li>
<li><strong>"How do you test a service that calls a payment gateway?"</strong> — The service depends on an abstract <code>PaymentGateway</code>; the test builds the module with <code>Test.createTestingModule</code> and <code>overrideProvider(PaymentGateway).useValue(fake)</code>, then asserts on what the fake recorded. Real gateway calls belong in a separate contract test against the sandbox.</li>
</ol>

<h3>💼 On the job</h3>
<p>This is almost word for word a ticket from an e-commerce project: "Add MoMo, keep VNPAY as default, switch per environment by configuration". When you open the pull request, attach the check script output and the test list — the reviewer sees at once that <code>OrdersService</code> did not change and that nothing can switch on the fake gateway in production.</p>

<h3>📌 Summary</h3>
<ul>
<li>Contract (abstract class) + implementations as providers + one factory that chooses = configuration-driven swap.</li>
<li>Configuration values are providers too, so tests override them instead of touching <code>process.env</code>.</li>
<li>Unknown or dangerous choices fail at startup.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab</span>
<h2>2.7 — Lab: một service, ba cổng thanh toán</h2>
<p class="lead">Khách hàng muốn VNPAY ở production, MoMo cho đợt thử nghiệm, và không trừ tiền thật khi test. Luật của trưởng nhóm kỹ thuật: <code>OrdersService</code> không được biết mình đang nói chuyện với cổng nào, và đổi cổng là đổi cấu hình, không phải sửa mã. Mọi thứ cần dùng đều đã có trong bài 2.2–2.4.</p>

<h3>Đề bài (90 phút)</h3>
<div class="callout ok">
<ol>
<li><code>PaymentGateway</code> là abstract class có <code>ten</code> và <code>charge(orderId, vnd)</code>. Ba bản cài đặt: <code>VnpayGateway</code>, <code>MomoGateway</code> (từ chối khi trên 50 triệu ₫), <code>FakeGateway</code> (ghi lại mọi lời gọi).</li>
<li><code>PaymentModule</code> chỉ export <code>PaymentGateway</code>. Chọn cổng nào phụ thuộc <code>PAYMENT_PROVIDER</code>; giá trị lạ phải làm ứng dụng dừng ngay lúc khởi động.</li>
<li><code>OrdersModule</code>: <code>POST /orders {"vnd": số}</code> ⇒ 201 kèm tên cổng và mã giao dịch; 400 khi <code>vnd</code> không phải số nguyên dương.</li>
<li>Test: factory chọn đúng class; tên lạ thì bị từ chối; test đơn vị với cổng giả chứng minh số tiền bị trừ; test e2e chứng minh 201 và 400 — <em>không</em> chạm cổng thật nào.</li>
</ol>
<p><strong>Đạt khi:</strong> cùng một bản build chạy khác nhau với <code>PAYMENT_PROVIDER=vnpay</code>/<code>momo</code>, từ chối <code>paypal</code> với exit 1, và năm test xanh.</p>
</div>

<details><summary>Xem lời giải tham khảo</summary>
<pre><code class="language-ts">${esc(MA_PAY)}</code></pre>
<pre><code class="language-ts">${esc(MA_ORD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p>Kịch bản kiểm và output thật:</p>
<pre><code class="language-bash">${esc(MA_SH)}</code></pre>
<div class="out">${esc(OUT_CHAY)}</div>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_SPEC)}</div>
<p>Ghi chú thiết kế. Việc chọn cổng là một <strong>factory có <code>inject</code></strong>: ba cổng là provider bình thường (nên mỗi cổng có thể có phụ thuộc riêng — client HTTP, bí mật), còn factory chỉ chọn một. Bản thân giá trị cấu hình cũng là một provider (<code>PAYMENT_PROVIDER</code>), nên test mới <code>overrideProvider(PAYMENT_PROVIDER).useValue('momo')</code> được thay vì sửa <code>process.env</code>. Đánh đổi: cả ba cổng đều được tạo dù chỉ dùng một; nếu constructor nào đắt, hãy tạo ngay trong factory.</p>
</details>

<h3>🕵️ Sự cố thật — Knight Capital, ngày 1/8/2012</h3>
<p>Knight triển khai mã giao dịch mới lên tám máy chủ; sót mất một. Mã mới dùng lại một cờ cấu hình cũ, và trên máy chủ chưa cập nhật, cờ đó bật "Power Peg" — đường mã đã chết từ 2003. Trong 45 phút đầu phiên, máy chủ đó gửi hơn 4 triệu lệnh khi đang cố khớp 212 lệnh của khách. Knight lỗ hơn 460 triệu đô la Mỹ và bị mua lại vài tháng sau; SEC phạt 12 triệu (thông cáo 2013-222). Hai bài học khớp thẳng vào lab này: giá trị cấu hình dùng để chọn bản cài đặt phải <strong>từ chối thứ nó không nhận ra</strong> (<code>paypal</code> của ta ⇒ exit 1), và bản cài đặt nguy hiểm phải <strong>không thể chọn được ở production</strong> (bài tập 2 bên dưới).</p>

<h3>🧪 Bài tập thêm</h3>
<div class="callout ok">
<ol>
<li>Thêm ZaloPay. Ràng buộc: <code>orders.ts</code> giữ nguyên.</li>
<li>Cho <code>PAYMENT_PROVIDER=fake</code> từ chối khởi động khi <code>NODE_ENV=production</code>.</li>
</ol>
<details><summary>Xem đáp án</summary>
<pre><code class="language-diff">${esc(DIFF_Z)}</code></pre>
<div class="out">${esc(OUT_Z)}</div>
<pre><code class="language-ts">${esc(MA_PF)}</code></pre>
<div class="out">${esc(OUT_PF)}</div>
</details>
</div>

<h3>🎤 Phỏng vấn viên sẽ hỏi gì về chương 2</h3>
<ol>
<li><strong>"<code>@Injectable()</code> thực ra làm gì?"</strong> — Nó là decorator class để TypeScript phát <code>design:paramtypes</code> cho constructor; Nest đọc danh sách đó để biết cần tiêm gì. Việc đăng ký xảy ra khi liệt kê class trong <code>providers</code> của module, không phải nhờ decorator.</li>
<li><strong>"Nest can't resolve dependencies of X (?, Y) — em kiểm gì?"</strong> — <code>?</code> không có tên: interface hoặc <code>import type</code>, nên dùng token hoặc abstract class. Có tên class: nó có là provider ở đâu không, có được export không, module đó có được import ở đây không?</li>
<li><strong>"Sao không cho mọi thứ @Global cho tiện?"</strong> — Nó xoá bức tường module: module nào cũng phụ thuộc được mọi thứ, không ai nói được một module cần gì, và tái cấu trúc làm vỡ mã ở xa. Chỉ dành cho cấu hình, logger, cơ sở dữ liệu.</li>
<li><strong>"Request scope — khi nào dùng và tốn gì?"</strong> — Khi provider thật sự cần đối tượng request. Nó lan lên tới controller, nên cả chuỗi bị tạo lại mỗi request (3 003 controller cho 3 000 request ở bài 2.4). Ưu tiên tham số hoặc AsyncLocalStorage.</li>
<li><strong>"Test một service gọi cổng thanh toán thế nào?"</strong> — Service phụ thuộc abstract <code>PaymentGateway</code>; test dựng module bằng <code>Test.createTestingModule</code> và <code>overrideProvider(PaymentGateway).useValue(fake)</code>, rồi khẳng định trên thứ bản giả ghi lại. Gọi cổng thật thuộc về một test hợp đồng riêng chạy với sandbox.</li>
</ol>

<h3>💼 Đi làm thật</h3>
<p>Đây gần như đúng nguyên văn một phiếu việc ở dự án thương mại điện tử: "Thêm cổng MoMo, giữ VNPAY làm mặc định, bật bằng cấu hình theo môi trường". Khi nộp pull request, kèm output của kịch bản kiểm và danh sách test — người review thấy ngay bạn không sửa <code>OrdersService</code>, và không có đường nào bật nhầm cổng giả ở production.</p>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hợp đồng (abstract class) + các bản cài đặt là provider + một factory chọn = đổi bằng cấu hình.</li>
<li>Giá trị cấu hình cũng là provider, nên test thay nó thay vì động vào <code>process.env</code>.</li>
<li>Lựa chọn lạ hoặc nguy hiểm thì lỗi ngay lúc khởi động.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
