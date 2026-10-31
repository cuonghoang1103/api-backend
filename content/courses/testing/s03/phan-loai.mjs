/**
 * Testing · Chương 3 · 3.1 — Stub, mock, spy, fake: mỗi loại là gì. Slug giữ từ khung: tst-3-1-phan-loai.
 * Code/output từ ./_ma.mjs (chạy thật). Mục tiêu độ dài 25–40k (điều phối 01/11).
 */
import G from '../giang/tst-03-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const BANG_EN = `<table>
<thead><tr><th>Double</th><th>What it does</th><th>Check afterwards?</th><th>In LabFlow Lite</th></tr></thead>
<tbody>
<tr><td><strong>Dummy</strong></td><td>fills a parameter, never used</td><td>no</td><td><code>log: {}</code> on the happy path</td></tr>
<tr><td><strong>Stub</strong></td><td>returns or throws canned answers</td><td>no — it controls the input</td><td>a mailer that always throws</td></tr>
<tr><td><strong>Spy</strong></td><td>records every call</td><td>yes, if it matters</td><td><code>vi.fn()</code> as <code>send</code></td></tr>
<tr><td><strong>Mock</strong></td><td>a spy whose expected call is the point</td><td>yes — that is the test</td><td><code>log.warn</code> must be called</td></tr>
<tr><td><strong>Fake</strong></td><td>small working implementation</td><td>check its state</td><td><code>createMemoryRepo</code>, <code>createFakeMailer</code></td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Loại</th><th>Làm gì</th><th>Kiểm sau đó?</th><th>Trong LabFlow Lite</th></tr></thead>
<tbody>
<tr><td><strong>Dummy</strong></td><td>lấp chỗ một tham số, không dùng tới</td><td>không</td><td><code>log: {}</code> ở nhánh suôn</td></tr>
<tr><td><strong>Stub</strong></td><td>trả lời hoặc ném lỗi soạn sẵn</td><td>không — nó điều khiển đầu vào</td><td>mailer luôn ném lỗi</td></tr>
<tr><td><strong>Spy</strong></td><td>ghi lại mọi lần gọi</td><td>có, nếu cần</td><td><code>vi.fn()</code> làm <code>send</code></td></tr>
<tr><td><strong>Mock</strong></td><td>spy mà lời gọi mong đợi là mục đích</td><td>có — đó chính là test</td><td><code>log.warn</code> phải được gọi</td></tr>
<tr><td><strong>Fake</strong></td><td>bản cài đặt nhỏ chạy được thật</td><td>kiểm trạng thái của nó</td><td><code>createMemoryRepo</code>, <code>createFakeMailer</code></td></tr>
</tbody></table>`;

export default {
  title: '3.1 — Stub, mock, spy, fake: what each one is|||3.1 — Stub, mock, spy, fake: mỗi loại là gì',
  slug: 'tst-3-1-phan-loai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tính năng mới bookAndNotify (đặt phòng rồi gửi thư); năm loại test double của Meszaros (dummy, stub, spy, mock, fake) dựng bằng object thường, vi.fn và vi.spyOn; khẳng định trạng thái hay tương tác; quy tắc chọn loại nào.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Stub, mock, spy, fake</h2>
<p class="lead">Unit tests must be fast and repeatable, but real code sends e-mail, writes to databases and calls other services. A <strong>test double</strong> is an object that stands in for such a dependency during a test — like a stunt double in a film. This lesson names the five kinds and builds each one around a new LabFlow Lite feature.</p>

<h3>The code: book, then e-mail</h3>
<p>Add <code>src/notify/notify.js</code> and a fake mailer for tests in <code>test/support/fakes.js</code>:</p>
${ma('javascript', CODE.notify)}
${ma('javascript', CODE.fakes)}
<p>A confirmed booking e-mails the student; a PENDING one (BR-06) e-mails the approver. A failed e-mail is logged and the booking stays saved — the result says <code>notified: false</code>. Everything <code>bookAndNotify</code> talks to arrives as a parameter, which is why every double below is a one-liner. Our <code>vitest.config.js</code> now also has <code>restoreMocks: true</code> from lesson 2.4:</p>
${ma('javascript', CODE.config)}

<h3>Five kinds of double</h3>
${BANG_EN}
<p>The names come from Gerard Meszaros, <em>xUnit Test Patterns</em> (2007), and are used the same way in JUnit/Mockito. People often say “mock” for all of them; the precise names help you say <em>why</em> a double is there.</p>
${ma('javascript', CODE.doubles)}
${ra(OUT['31-doubles'])}
<ul>
<li><strong>Dummy</strong> — <code>log: {}</code>: if the code ever called <code>log.warn</code>, the test would crash with a TypeError, which is exactly what a dummy should do.</li>
<li><strong>Stub</strong> — controls what comes <em>into</em> the code from a dependency. Here it forces the catch branch, like the broken repository of lesson 2.3.</li>
<li><strong>Spy</strong> — <code>vi.fn()</code> remembers each call; <code>toHaveBeenCalledWith</code> checks the arguments. <code>mockResolvedValue</code> gives it an answer, so one <code>vi.fn</code> is often a stub and a spy at once.</li>
<li><strong>Mock</strong> — the same tool, different intention: the test exists to check that a warning is logged.</li>
<li><strong>Fake</strong> — a working mailer with an outbox; the test reads the outbox like a user reading their inbox.</li>
<li><strong>vi.spyOn</strong> — wraps a method of a real object: calls are counted, the original still runs (the outbox has one mail). With <code>restoreMocks</code> it is undone before the next test.</li>
</ul>

<h3>Assert state or interaction?</h3>
<p><strong>State verification</strong> looks at the result: the returned booking, the outbox, the stored rows. <strong>Interaction verification</strong> looks at the calls: <code>toHaveBeenCalledWith</code>. Prefer state — it does not care how the code reached the result, so it survives refactoring. Use interactions when the call itself is the behaviour and nothing else shows it: an e-mail sent, a log line written, a card charged. Lesson 3.3 measures what happens when this rule is ignored.</p>
<div class="callout"><strong>Rule of thumb.</strong> Real thing if it is fast and deterministic (pure rules) · fake for storage · stub to force errors · spy/mock only for outgoing side effects.</div>

${lienKet({ bai: 'swt301-test-levels', title: 'Also in SWT301 — 2.2: test levels, stubs and drivers', sub: 'Same: a component is tested in isolation by replacing its neighbours with stubs (top-down) or calling it from a driver (bottom-up). Different: here the stand-ins are code — five kinds, built in Vitest around a real feature — and the question is which one gives a test that still means something.', cta: 'OPEN SWT301 LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>With the fake mailer: a 31-seat student booking e-mails the approver and nobody else.</li>
<li>With a stub mailer that throws: the booking is still stored (<code>repo.count()</code> is 1) and <code>notified</code> is false.</li>
<li>With a spy: the approver mail mentions “31 seats” — use <code>expect.objectContaining</code> and <code>expect.stringContaining</code>.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th31)}
${ra(OUT['31-th'])}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test double</span><span class="v">Any object that replaces a real dependency in a test.</span></div>
  <div class="kv"><span class="k">dummy · stub · spy · mock · fake</span><span class="v">Fills a slot · gives canned answers · records calls · expects a call · works for real, in memory.</span></div>
  <div class="kv"><span class="k">vi.fn / vi.spyOn</span><span class="v">Create a recording function / wrap a method of a real object.</span></div>
  <div class="kv"><span class="k">state vs interaction verification</span><span class="v">Checking results vs checking calls.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A double stands in for a slow or uncontrollable dependency.</li>
<li>Dummy fills, stub answers, spy records, mock expects, fake works.</li>
<li>Prefer asserting state; assert interactions only for outgoing side effects.</li>
<li>Dependencies passed in as parameters make doubles trivial.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Stub, mock, spy, fake</h2>
<p class="lead">Unit test phải nhanh và lặp lại được, nhưng code thật thì gửi thư, ghi cơ sở dữ liệu và gọi dịch vụ khác. <strong>Test double</strong> (đồ đóng thế) là object đứng thay một phụ thuộc như thế trong lúc test — giống diễn viên đóng thế trong phim. Bài này gọi tên năm loại và dựng từng loại quanh một tính năng mới của LabFlow Lite.</p>

<h3>Code: đặt phòng rồi gửi thư</h3>
<p>Thêm <code>src/notify/notify.js</code> và một mailer giả cho test ở <code>test/support/fakes.js</code>:</p>
${ma('javascript', CODE.notify)}
${ma('javascript', CODE.fakes)}
<p>Lượt đặt được xác nhận thì gửi thư cho sinh viên; lượt PENDING (BR-06) thì gửi cho người duyệt. Gửi thư hỏng thì ghi log và lượt đặt vẫn được lưu — kết quả ghi <code>notified: false</code>. Mọi thứ <code>bookAndNotify</code> nói chuyện cùng đều đi vào qua tham số, nên mỗi đồ đóng thế bên dưới chỉ là một dòng. <code>vitest.config.js</code> giờ có thêm <code>restoreMocks: true</code> từ bài 2.4:</p>
${ma('javascript', CODE.config)}

<h3>Năm loại đồ đóng thế</h3>
${BANG_VI}
<p>Tên gọi đến từ Gerard Meszaros, cuốn <em>xUnit Test Patterns</em> (2007), và được dùng y như vậy trong JUnit/Mockito. Người ta hay gọi chung tất cả là “mock”; tên chính xác giúp bạn nói được <em>vì sao</em> đồ đóng thế đó có mặt.</p>
${ma('javascript', CODE.doubles)}
${ra(OUT['31-doubles'])}
<ul>
<li><strong>Dummy</strong> — <code>log: {}</code>: nếu code lỡ gọi <code>log.warn</code>, test sẽ sập vì TypeError — đúng điều một dummy nên làm.</li>
<li><strong>Stub</strong> — điều khiển thứ đi <em>vào</em> code từ một phụ thuộc. Ở đây nó ép code vào nhánh catch, như repository hỏng ở bài 2.3.</li>
<li><strong>Spy</strong> — <code>vi.fn()</code> nhớ từng lần gọi; <code>toHaveBeenCalledWith</code> kiểm tham số. <code>mockResolvedValue</code> cho nó một câu trả lời, nên một <code>vi.fn</code> thường vừa là stub vừa là spy.</li>
<li><strong>Mock</strong> — cùng công cụ, khác ý đồ: test tồn tại để kiểm rằng có một cảnh báo được ghi log.</li>
<li><strong>Fake</strong> — một mailer chạy thật với hộp thư đi; test đọc hộp thư như người dùng đọc hộp thư đến.</li>
<li><strong>vi.spyOn</strong> — bọc một phương thức của object thật: lời gọi được đếm, bản gốc vẫn chạy (hộp thư có một thư). Có <code>restoreMocks</code> thì nó được gỡ trước test kế tiếp.</li>
</ul>

<h3>Khẳng định trạng thái hay tương tác?</h3>
<p><strong>Kiểm trạng thái</strong> (state verification) nhìn kết quả: lượt đặt trả về, hộp thư, các dòng đã lưu. <strong>Kiểm tương tác</strong> (interaction verification) nhìn các lời gọi: <code>toHaveBeenCalledWith</code>. Ưu tiên trạng thái — nó không quan tâm code đi tới kết quả bằng cách nào, nên sống sót qua refactor. Dùng tương tác khi chính lời gọi là hành vi và không có cách nào khác để thấy: một thư đã gửi, một dòng log, một lần trừ tiền thẻ. Bài 3.3 đo xem chuyện gì xảy ra khi phớt lờ quy tắc này.</p>
<div class="callout"><strong>Quy tắc dễ nhớ.</strong> Dùng đồ thật nếu nhanh và tất định (luật thuần) · fake cho lưu trữ · stub để ép lỗi · spy/mock chỉ cho tác dụng phụ đi ra ngoài.</div>

${lienKet({ bai: 'swt301-test-levels', title: 'Đã gặp ở SWT301 — 2.2: cấp test, stub và driver', sub: 'Giống: test một component cô lập bằng cách thay thành phần xung quanh bằng stub (top-down) hoặc gọi nó từ một driver (bottom-up). Khác: ở đây đồ đóng thế là code — năm loại, dựng bằng Vitest quanh một tính năng thật — và câu hỏi là loại nào cho ra một test còn ý nghĩa.', cta: 'MỞ BÀI SWT301 →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Dùng mailer fake: lượt đặt 31 chỗ của sinh viên gửi thư cho người duyệt và không ai khác.</li>
<li>Dùng mailer stub luôn ném lỗi: lượt đặt vẫn được lưu (<code>repo.count()</code> bằng 1) và <code>notified</code> là false.</li>
<li>Dùng spy: thư gửi người duyệt có chữ “31 seats” — dùng <code>expect.objectContaining</code> và <code>expect.stringContaining</code>.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th31)}
${ra(OUT['31-th'])}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test double (đồ đóng thế)</span><span class="v">Bất kỳ object nào thay cho một phụ thuộc thật trong test.</span></div>
  <div class="kv"><span class="k">dummy · stub · spy · mock · fake</span><span class="v">Lấp chỗ · trả lời soạn sẵn · ghi lời gọi · mong đợi một lời gọi · chạy thật trong bộ nhớ.</span></div>
  <div class="kv"><span class="k">vi.fn / vi.spyOn</span><span class="v">Tạo hàm biết ghi nhớ / bọc một phương thức của object thật.</span></div>
  <div class="kv"><span class="k">kiểm trạng thái vs kiểm tương tác</span><span class="v">Kiểm kết quả vs kiểm các lời gọi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đồ đóng thế đứng thay phụ thuộc chậm hoặc không điều khiển được.</li>
<li>Dummy lấp chỗ, stub trả lời, spy ghi lại, mock mong đợi, fake chạy thật.</li>
<li>Ưu tiên khẳng định trạng thái; chỉ khẳng định tương tác cho tác dụng phụ đi ra ngoài.</li>
<li>Phụ thuộc truyền vào qua tham số làm đồ đóng thế trở nên đơn giản.</li>
</ul>
</div>
`,
};
