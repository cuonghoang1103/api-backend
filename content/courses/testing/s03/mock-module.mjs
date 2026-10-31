/**
 * Testing · Chương 3 · 3.2 — Mock module và HTTP. Slug giữ từ khung: tst-3-2-mock-module.
 * MSW 3.0.3: tuỳ chọn là onUnhandledFrame (tên cũ MSW 2 onUnhandledRequest bị bỏ qua — đo thật: ENOTFOUND).
 */
import G from '../giang/tst-03-2.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

// Rút gọn output dài: chỉ giữ dòng lệnh, cảnh báo MSW, kết quả test và chuỗi "Caused by" (nội dung giữ nguyên từng dòng).
const gon = (t) => t.split('\n').filter((l) => /^\$ |\[MSW\]|^  •|×|✓|Caused by|AssertionError|Tests /.test(l)).join('\n');
const LOT_CU = gon(OUT['32-msw-lot-cu']);
const LOT = gon(OUT['32-msw-lot']);

const SO_EN = `<table>
<thead><tr><th>Do</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td>Wrap each provider in <strong>your own</strong> adapter (<code>createHttpMailer</code>)</td><td>Mocking a vendor SDK or library internals</td></tr>
<tr><td>Test that adapter against the HTTP contract with MSW</td><td>Inventing the vendor’s behaviour inside a mock</td></tr>
<tr><td>Give the rest of the code a fake of <strong>your</strong> interface (<code>createFakeMailer</code>)</td><td>Replacing <code>fetch</code> by hand in every test</td></tr>
</tbody></table>`;
const SO_VI = `<table>
<thead><tr><th>Nên</th><th>Tránh</th></tr></thead>
<tbody>
<tr><td>Bọc mỗi nhà cung cấp trong adapter <strong>của chính bạn</strong> (<code>createHttpMailer</code>)</td><td>Mock SDK của nhà cung cấp hay ruột của thư viện</td></tr>
<tr><td>Test adapter đó theo hợp đồng HTTP bằng MSW</td><td>Tự bịa hành vi của nhà cung cấp trong một mock</td></tr>
<tr><td>Cho phần còn lại của code một fake theo interface <strong>của bạn</strong> (<code>createFakeMailer</code>)</td><td>Thay <code>fetch</code> bằng tay trong từng test</td></tr>
</tbody></table>`;

export default {
  title: '3.2 — Mocking modules and HTTP: vi.mock, vi.hoisted and MSW|||3.2 — Mock module và HTTP: vi.mock, vi.hoisted và MSW',
  slug: 'tst-3-2-mock-module',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Code tự tạo phụ thuộc lúc import (reminder.js) và vi.mock; vì sao vi.mock bị hoist và lỗi "Cannot access before initialization"; vi.hoisted; adapter HTTP createHttpMailer test bằng MSW 3 (fetch thật, mạng giả: 202/429/500); tuỳ chọn đổi tên onUnhandledRequest → onUnhandledFrame làm test chạm internet (đo thật); đừng mock thứ không phải của mình.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Mocking modules and HTTP</h2>
<p class="lead">Lesson 3.1 passed doubles in as parameters. Real projects also contain code that <em>imports</em> its dependencies, and code that talks HTTP to other companies. Here are the two tools for those cases — and a real trap we hit while writing this lesson.</p>

<h3>The adapter and a hard-wired module</h3>
<p><code>src/lib/mailer.js</code> is our adapter around an e-mail provider’s HTTP API; <code>src/notify/reminder.js</code> is written the “quick” way and builds its mailer at import time:</p>
${ma('javascript', CODE.mailer)}
${ma('javascript', CODE.reminder)}

<h3>vi.mock: replace a whole module</h3>
${ma('javascript', CODE.viMock)}
${ra(OUT['32-vi-mock'])}
<p><code>vi.mock(path, factory)</code> makes every import of that path receive what the factory returns. Because <code>reminder.js</code> creates its mailer while being imported, the mock must be in place <em>before</em> any import runs — so Vitest <strong>hoists</strong> (moves) every <code>vi.mock</code> call to the top of the file. Values the factory uses must exist that early too; <code>vi.hoisted</code> is hoisted along with it.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a normal variable inside the factory.</strong></p>
${ma('javascript', CODE.viMockSai)}
${ra(OUT['32-vi-mock-sai'])}
<p>No test even starts: the factory ran before line 4, while <code>send</code> was still in JavaScript’s “temporal dead zone” — the same error as using a <code>let</code> before its line. Fix it with <code>vi.hoisted</code> as in the first file.</p>
</div>

<h3>MSW: keep fetch real, fake the network</h3>
<p>For <code>mailer.js</code> itself, mocking <code>fetch</code> would test nothing we wrote. <a href="https://mswjs.io" target="_blank" rel="noopener">Mock Service Worker</a> (MSW) intercepts requests <em>after</em> <code>fetch</code> sends them, so URL building, headers, JSON and error handling all run for real. Install it with <code>npm install --save-dev msw@3</code> (we use 3.0.3).</p>
${ma('javascript', CODE.msw)}
${ra(OUT['32-msw'])}
<ul>
<li>The handler records the <code>Authorization</code> header and the JSON body — the HTTP contract we must speak.</li>
<li><code>server.use(...)</code> overrides the answer for one test (429, 500); <code>resetHandlers</code> removes it afterwards.</li>
<li>Our adapter turns provider answers into our own error codes (<code>RATE_LIMITED</code>, <code>MAIL_FAILED</code> with the HTTP status as <code>cause</code>), so the rest of LabFlow never sees HTTP details.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Measured — a renamed option let a test reach the internet.</strong> Unhandled requests should fail, so a typo can never call a real service. MSW 2 named the option <code>onUnhandledRequest</code>. With MSW 3 installed, we first wrote the old name:</p>
${ma('javascript', CODE.mswLotCu)}
${ra(LOT_CU)}
<p>The option was silently ignored: MSW only <em>warned</em> and let the request through — the error at the bottom is a real DNS lookup of <code>mail.provider.example</code> (ENOTFOUND). In MSW 3 the option is <code>onUnhandledFrame</code> (we found it in the package’s type definitions):</p>
${ma('javascript', CODE.mswLot)}
${ra(LOT)}
<p>Now the request is refused before it leaves the process. Lesson: when a tool’s major version changes, check option names against the version you installed — a wrong name is often ignored, not reported.</p>
</div>

<h3>Don’t mock what you don’t own</h3>
${SO_EN}
<p>A mock of someone else’s library is your guess about how it behaves. When the library changes — exactly like the MSW option above — the mock keeps agreeing with you and production breaks. Owning a small adapter gives you one place to test against the real contract, and a simple interface (<code>send</code>) that the rest of the code can fake.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>A 400 answer from the provider becomes <code>MAIL_FAILED</code> with <code>cause.message</code> “HTTP 400”.</li>
<li>The JSON body is exactly <code>{ to, subject }</code>.</li>
<li>Run <code>demo3/msw-lot-cu.test.js</code> and <code>demo3/msw-lot.test.js</code>; compare the last “Caused by” lines.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th32)}
${ra(OUT['32-th'])}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">vi.mock / hoisting</span><span class="v">Replace a module for every import; Vitest moves the call to the top of the file.</span></div>
  <div class="kv"><span class="k">vi.hoisted</span><span class="v">Create values early enough for a <code>vi.mock</code> factory.</span></div>
  <div class="kv"><span class="k">MSW</span><span class="v">Mock Service Worker: intercepts real HTTP requests and answers with handlers.</span></div>
  <div class="kv"><span class="k">adapter</span><span class="v">Your own thin wrapper around a third-party service.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Where to fake a dependency</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Parameter</div><div class="lz-d">pass a stub — the cheapest seam</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">vi.mock</div><div class="lz-d">replace a whole module import</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">MSW</div><div class="lz-d">answer at the network: real client code runs</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Real service</div><div class="lz-d">only in integration or e2e tests</div></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li><code>vi.mock</code> replaces modules; it is hoisted, so use <code>vi.hoisted</code> for what the factory needs.</li>
<li>Needing <code>vi.mock</code> for your own code is a design smell — lesson 3.4.</li>
<li>Test HTTP adapters with MSW: real <code>fetch</code>, fake network.</li>
<li>Make unhandled requests fail — with the option name of the version you really use.</li>
<li>Mock your own adapters, not other people’s libraries.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mock module và HTTP</h2>
<p class="lead">Bài 3.1 truyền đồ đóng thế vào qua tham số. Dự án thật còn có code <em>import</em> thẳng phụ thuộc của nó, và code nói chuyện HTTP với công ty khác. Đây là hai công cụ cho các trường hợp đó — kèm một cái bẫy thật mà chính chúng tôi vấp khi soạn bài.</p>

<h3>Adapter và một module “cắm cứng”</h3>
<p><code>src/lib/mailer.js</code> là adapter (bộ chuyển) của ta bọc quanh API HTTP của nhà cung cấp email; <code>src/notify/reminder.js</code> viết theo kiểu “cho nhanh” và tự tạo mailer ngay lúc được import:</p>
${ma('javascript', CODE.mailer)}
${ma('javascript', CODE.reminder)}

<h3>vi.mock: thay cả một module</h3>
${ma('javascript', CODE.viMock)}
${ra(OUT['32-vi-mock'])}
<p><code>vi.mock(path, factory)</code> làm mọi lần import đường dẫn đó nhận thứ factory trả về. Vì <code>reminder.js</code> tạo mailer ngay khi được import, mock phải sẵn sàng <em>trước</em> khi bất kỳ import nào chạy — nên Vitest <strong>hoist</strong> (dời) mọi lời gọi <code>vi.mock</code> lên đầu file. Giá trị factory dùng cũng phải có sớm như vậy; <code>vi.hoisted</code> được dời lên cùng nó.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dùng biến bình thường trong factory.</strong></p>
${ma('javascript', CODE.viMockSai)}
${ra(OUT['32-vi-mock-sai'])}
<p>Không test nào kịp chạy: factory chạy trước dòng 4, lúc <code>send</code> còn trong “vùng chết tạm thời” (temporal dead zone) của JavaScript — y như lỗi dùng một biến <code>let</code> trước dòng khai báo. Sửa bằng <code>vi.hoisted</code> như file đầu tiên.</p>
</div>

<h3>MSW: giữ fetch thật, giả mạng</h3>
<p>Với chính <code>mailer.js</code>, mock <code>fetch</code> thì chẳng test được gì ta viết. <a href="https://mswjs.io" target="_blank" rel="noopener">Mock Service Worker</a> (MSW) chặn request <em>sau khi</em> <code>fetch</code> gửi đi, nên phần ghép URL, header, JSON và xử lý lỗi đều chạy thật. Cài bằng <code>npm install --save-dev msw@3</code> (khoá dùng 3.0.3).</p>
${ma('javascript', CODE.msw)}
${ra(OUT['32-msw'])}
<ul>
<li>Handler ghi lại header <code>Authorization</code> và thân JSON — hợp đồng HTTP mà ta phải nói đúng.</li>
<li><code>server.use(...)</code> đổi câu trả lời cho riêng một test (429, 500); <code>resetHandlers</code> gỡ nó đi sau đó.</li>
<li>Adapter đổi câu trả lời của nhà cung cấp thành mã lỗi của ta (<code>RATE_LIMITED</code>, <code>MAIL_FAILED</code> kèm mã HTTP trong <code>cause</code>), nên phần còn lại của LabFlow không bao giờ thấy chi tiết HTTP.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Đo thật — một tuỳ chọn đổi tên làm test chạm ra internet.</strong> Request không có handler nên bị đánh hỏng, để một lỗi gõ không bao giờ gọi trúng dịch vụ thật. MSW 2 đặt tên tuỳ chọn là <code>onUnhandledRequest</code>. Khi đã cài MSW 3, lúc đầu chúng tôi viết tên cũ:</p>
${ma('javascript', CODE.mswLotCu)}
${ra(LOT_CU)}
<p>Tuỳ chọn bị bỏ qua trong im lặng: MSW chỉ <em>cảnh báo</em> rồi cho request đi tiếp — lỗi cuối cùng là một lần tra DNS thật tới <code>mail.provider.example</code> (ENOTFOUND). Ở MSW 3, tuỳ chọn tên là <code>onUnhandledFrame</code> (chúng tôi tìm ra trong file định nghĩa kiểu của gói):</p>
${ma('javascript', CODE.mswLot)}
${ra(LOT)}
<p>Giờ request bị từ chối trước khi rời tiến trình. Bài học: khi một công cụ lên phiên bản lớn, hãy đối chiếu tên tuỳ chọn với đúng bản bạn đã cài — tên sai thường bị bỏ qua chứ không bị báo lỗi.</p>
</div>

<h3>Đừng mock thứ không phải của mình</h3>
${SO_VI}
<p>Mock thư viện của người khác là phỏng đoán của bạn về cách nó chạy. Khi thư viện đổi — y như tuỳ chọn MSW ở trên — mock vẫn đồng ý với bạn còn production thì hỏng. Sở hữu một adapter nhỏ cho bạn đúng một chỗ để test theo hợp đồng thật, và một interface đơn giản (<code>send</code>) để phần còn lại của code làm giả.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Câu trả lời 400 từ nhà cung cấp thành <code>MAIL_FAILED</code> với <code>cause.message</code> là “HTTP 400”.</li>
<li>Thân JSON đúng bằng <code>{ to, subject }</code>.</li>
<li>Chạy <code>demo3/msw-lot-cu.test.js</code> và <code>demo3/msw-lot.test.js</code>; so dòng “Caused by” cuối cùng.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th32)}
${ra(OUT['32-th'])}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">vi.mock / hoisting (dời lên đầu)</span><span class="v">Thay một module cho mọi lần import; Vitest dời lời gọi lên đầu file.</span></div>
  <div class="kv"><span class="k">vi.hoisted</span><span class="v">Tạo giá trị đủ sớm cho factory của <code>vi.mock</code>.</span></div>
  <div class="kv"><span class="k">MSW</span><span class="v">Mock Service Worker: chặn request HTTP thật và trả lời bằng handler.</span></div>
  <div class="kv"><span class="k">adapter (bộ chuyển)</span><span class="v">Lớp bọc mỏng của chính bạn quanh một dịch vụ bên thứ ba.</span></div>
</div>

<h3>🗺 Giả một phụ thuộc ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Tham số</div><div class="lz-d">truyền một stub — chỗ nối rẻ nhất</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">vi.mock</div><div class="lz-d">thay cả một module được import</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">MSW</div><div class="lz-d">trả lời ở tầng mạng: code client thật vẫn chạy</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Dịch vụ thật</div><div class="lz-d">chỉ trong test tích hợp hoặc đầu-cuối</div></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li><code>vi.mock</code> thay module; nó bị dời lên đầu, nên dùng <code>vi.hoisted</code> cho thứ factory cần.</li>
<li>Phải <code>vi.mock</code> chính code của mình là dấu hiệu thiết kế chưa tốt — bài 3.4.</li>
<li>Test adapter HTTP bằng MSW: <code>fetch</code> thật, mạng giả.</li>
<li>Bắt request lạ phải hỏng — với đúng tên tuỳ chọn của phiên bản bạn đang dùng.</li>
<li>Mock adapter của mình, không mock thư viện của người khác.</li>
</ul>
</div>
`,
};
