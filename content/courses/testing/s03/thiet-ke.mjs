/**
 * Testing · Chương 3 · 3.4 — Thiết kế code dễ test. Slug giữ từ khung: tst-3-4-thiet-ke.
 * Đo thật: book-hard không double ⇒ ECONNREFUSED; test có double 21 dòng (2 vi.mock + đồng hồ giả) vs bản tiêm 11 dòng.
 */
import G from '../giang/tst-03-4.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

export default {
  title: '3.4 — Designing code that is easy to test: injection, pure core, ports and adapters|||3.4 — Thiết kế code dễ test: tiêm phụ thuộc, lõi thuần, ports and adapters',
  slug: 'tst-3-4-thiet-ke',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng một tính năng viết hai lần: bookHard tự lấy pool CSDL, client thư và đồng hồ (không double ⇒ ECONNREFUSED; có double ⇒ 2 vi.mock + đồng hồ giả + thứ tự truy vấn, 21 dòng) và bookAndNotify nhận phụ thuộc qua tham số (11 dòng). Lõi thuần buildMail, ports and adapters, so với Spring Boot constructor injection.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Designing code that is easy to test</h2>
<p class="lead">The best test double is the one you do not need. This lesson writes the booking feature a second time, the way it is often written under deadline pressure, and measures what that costs the tests. Then it names the three design habits that made LabFlow Lite easy to test all along.</p>

<h3>The “quick” version</h3>
${ma('javascript', CODE.db)}
${ma('javascript', CODE.smtp)}
${ma('javascript', CODE.bookHard)}
<p>The signature says <code>bookHard(input)</code>. In reality the function also needs a database pool, a mail client and the current date — three <strong>hidden dependencies</strong> that a test cannot pass in.</p>

<h3>What a test costs</h3>
<p>Without doubles (pointing <code>DATABASE_URL</code> at a port where nothing listens):</p>
${ma('javascript', CODE.khoThat)}
${ra(OUT['34-kho-that'])}
<p>With a real database it would write real rows and send real e-mail on every run — and from 17 November it would fail with PAST_DATE because it reads the real clock. So the test has to patch everything:</p>
${ma('javascript', CODE.kho)}
<p>And the injected version from lesson 3.1:</p>
${ma('javascript', CODE.deTest)}
${ra(OUT['34-kho'])}
<p>Both are green. The first is 21 lines with two module mocks, a frozen clock and query results in a fixed order — it knows that the SELECT runs before the INSERT. The second is 11 lines and knows nothing about SQL. Reorder the queries, add a capacity check, or switch to PostgreSQL in Chapter 4: only the first test has to change.</p>

<h3>Three habits</h3>
<ol>
<li><strong>Pass dependencies in</strong> (lightweight dependency injection). <code>bookAndNotify({ repo, mailer, log }, input)</code>: everything it talks to is visible and replaceable. No framework needed — an object parameter is enough.</li>
<li><strong>Functional core, imperative shell.</strong> Decisions live in pure functions — <code>checkSlot</code>, <code>needsApproval</code>, <code>buildMail</code> — tested with tables and no doubles. A thin shell does the I/O and needs only a few tests with fakes.</li>
<li><strong>Ports and adapters.</strong> The core states what it needs (a <em>port</em>: <code>mailer.send</code>, <code>repo.findOverlap/insert</code>); <em>adapters</em> fulfil it — <code>createHttpMailer</code> in production, <code>createFakeMailer</code> in tests; <code>createMemoryRepo</code> now, <code>createPgRepo</code> in Chapter 4. The idea is Alistair Cockburn’s “hexagonal architecture” (2005), without the ceremony.</li>
</ol>
<p><strong>Spring Boot, same idea:</strong> a <code>@Service</code> receives its repository and mail sender through its constructor; a unit test simply calls <code>new BookingService(fakeRepo, fakeMailer)</code> (or Mockito mocks) without starting Spring. Field injection with <code>@Autowired</code> on private fields hides dependencies exactly like <code>bookHard</code> does.</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-2-unit-test', title: 'Also in the Node.js course — 14.2: unit tests with injected dependencies', sub: 'The same habit applied to an Express API: inject a repository to swap in a fake, and a clock so that 20 minutes pass in 4 ms.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-4-1-rest-mvc', title: 'Also in SDN302 — 4.1: routes → controllers → services → models', sub: 'Same: split an Express app into layers with one job each. Different: here we measure what that split buys in tests — a service that receives its dependencies needs half the test code and no module mocks.', cta: 'OPEN SDN302 LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Test <code>buildMail</code> with a three-row <code>it.each</code> table — no doubles.</li>
<li>Rewrite <code>reminder.js</code> as <code>createReminder({ mailer })</code> returning the send function.</li>
<li>Test it with the fake mailer — no <code>vi.mock</code>.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.reminderDi)}
${ma('javascript', CODE.th34)}
${ra(OUT['34-th'])}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hidden dependency</span><span class="v">Something a function needs but does not receive as a parameter (module singleton, clock, environment).</span></div>
  <div class="kv"><span class="k">dependency injection</span><span class="v">Passing dependencies in instead of creating them inside.</span></div>
  <div class="kv"><span class="k">functional core, imperative shell</span><span class="v">Pure decisions inside, thin I/O outside.</span></div>
  <div class="kv"><span class="k">port · adapter</span><span class="v">The interface the core needs · an implementation of it (real or fake).</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Testable design in three habits</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Inject dependencies</span><span class="lz-lnote">pass repo, mailer, clock as parameters</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep logic pure</span><span class="lz-lnote">build the e-mail in a function, send it elsewhere</span></div>
  <div class="lz-layer"><span class="lz-lname">Thin edges</span><span class="lz-lnote">routes and handlers only wire things together</span></div>
</div>
<div class="pitfall"><strong>Hidden imports.</strong> A service that imports its own database pool and mailer can only be tested with module mocks and fake timers; the lesson measured the same test at 11 lines with injected dependencies against 21 lines with two <code>vi.mock</code> calls. Hard to test usually means hard to change.</div>
<h3>📌 Summary</h3>
<ul>
<li>Hidden dependencies make tests slow, fragile or impossible — measured: ECONNREFUSED, then 21 lines of patches.</li>
<li>Pass dependencies in through small interfaces; keep decisions pure.</li>
<li>Real adapters in production, fakes in tests; the core does not know the difference.</li>
<li>Needing <code>vi.mock</code> for your own code is a signal to redesign.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Thiết kế code dễ test</h2>
<p class="lead">Đồ đóng thế tốt nhất là cái bạn không cần tới. Bài này viết tính năng đặt phòng thêm một lần nữa, theo cách hay gặp khi chạy deadline, và đo xem nó bắt test trả giá bao nhiêu. Rồi gọi tên ba thói quen thiết kế đã làm LabFlow Lite dễ test từ đầu.</p>

<h3>Bản viết “cho nhanh”</h3>
${ma('javascript', CODE.db)}
${ma('javascript', CODE.smtp)}
${ma('javascript', CODE.bookHard)}
<p>Chữ ký hàm ghi <code>bookHard(input)</code>. Thực tế hàm còn cần một pool cơ sở dữ liệu, một client gửi thư và ngày hiện tại — ba <strong>phụ thuộc ẩn</strong> (hidden dependency) mà test không truyền vào được.</p>

<h3>Test phải trả giá bao nhiêu</h3>
<p>Không dùng đồ đóng thế (trỏ <code>DATABASE_URL</code> tới một cổng không có gì lắng nghe):</p>
${ma('javascript', CODE.khoThat)}
${ra(OUT['34-kho-that'])}
<p>Có cơ sở dữ liệu thật thì mỗi lần chạy nó ghi dữ liệu thật và gửi thư thật — và từ ngày 17/11 nó sẽ hỏng với PAST_DATE vì đọc đồng hồ thật. Thế nên test phải vá mọi thứ:</p>
${ma('javascript', CODE.kho)}
<p>Và bản được tiêm phụ thuộc từ bài 3.1:</p>
${ma('javascript', CODE.deTest)}
${ra(OUT['34-kho'])}
<p>Cả hai đều xanh. Cái đầu dài 21 dòng với hai mock module, một đồng hồ đóng băng và kết quả truy vấn theo thứ tự cố định — nó biết câu SELECT chạy trước câu INSERT. Cái sau dài 11 dòng và chẳng biết gì về SQL. Đổi thứ tự truy vấn, thêm bước kiểm sức chứa, hay chuyển sang PostgreSQL ở Chương 4: chỉ test đầu phải sửa.</p>

<h3>Ba thói quen</h3>
<ol>
<li><strong>Truyền phụ thuộc vào</strong> (dependency injection kiểu nhẹ). <code>bookAndNotify({ repo, mailer, log }, input)</code>: mọi thứ nó nói chuyện cùng đều nhìn thấy được và thay được. Không cần framework — một tham số object là đủ.</li>
<li><strong>Lõi thuần, vỏ mệnh lệnh</strong> (functional core, imperative shell). Quyết định nằm trong hàm thuần — <code>checkSlot</code>, <code>needsApproval</code>, <code>buildMail</code> — test bằng bảng, không cần đồ đóng thế. Một lớp vỏ mỏng lo vào/ra và chỉ cần vài test với fake.</li>
<li><strong>Ports and adapters</strong> (cổng và bộ chuyển). Lõi nói rõ nó cần gì (một <em>port</em>: <code>mailer.send</code>, <code>repo.findOverlap/insert</code>); <em>adapter</em> đáp ứng port đó — <code>createHttpMailer</code> khi chạy thật, <code>createFakeMailer</code> khi test; <code>createMemoryRepo</code> bây giờ, <code>createPgRepo</code> ở Chương 4. Ý tưởng là “kiến trúc lục giác” (hexagonal architecture) của Alistair Cockburn (2005), bỏ bớt thủ tục.</li>
</ol>
<p><strong>Spring Boot cũng vậy:</strong> một <code>@Service</code> nhận repository và bộ gửi thư qua hàm khởi tạo; unit test chỉ cần <code>new BookingService(fakeRepo, fakeMailer)</code> (hoặc mock Mockito) mà không phải bật Spring. Tiêm vào field private bằng <code>@Autowired</code> thì giấu phụ thuộc y như <code>bookHard</code>.</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-2-unit-test', title: 'Gặp lại ở khoá Node.js — 14.2: unit test với phụ thuộc được tiêm', sub: 'Cùng thói quen áp vào một API Express: tiêm repository để thay bằng fake, và tiêm đồng hồ để 20 phút trôi qua trong 4 ms.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-4-1-rest-mvc', title: 'Đã gặp ở SDN302 — 4.1: routes → controllers → services → models', sub: 'Giống: chia app Express thành các lớp, mỗi lớp một việc. Khác: ở đây ta đo cách chia đó mang lại gì cho test — service nhận phụ thuộc qua tham số cần nửa số dòng test và không cần mock module.', cta: 'MỞ BÀI SDN302 →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Test <code>buildMail</code> bằng bảng <code>it.each</code> ba dòng — không đồ đóng thế.</li>
<li>Viết lại <code>reminder.js</code> thành <code>createReminder({ mailer })</code> trả về hàm gửi.</li>
<li>Test nó bằng mailer giả — không <code>vi.mock</code>.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.reminderDi)}
${ma('javascript', CODE.th34)}
${ra(OUT['34-th'])}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hidden dependency (phụ thuộc ẩn)</span><span class="v">Thứ hàm cần nhưng không nhận qua tham số (singleton của module, đồng hồ, biến môi trường).</span></div>
  <div class="kv"><span class="k">dependency injection (tiêm phụ thuộc)</span><span class="v">Truyền phụ thuộc vào thay vì tự tạo bên trong.</span></div>
  <div class="kv"><span class="k">functional core, imperative shell</span><span class="v">Quyết định thuần ở trong, vào/ra mỏng ở ngoài.</span></div>
  <div class="kv"><span class="k">port · adapter</span><span class="v">Interface mà lõi cần · một bản cài đặt của nó (thật hoặc giả).</span></div>
</div>

<h3>🗺 Thiết kế dễ test qua ba thói quen</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tiêm phụ thuộc</span><span class="lz-lnote">truyền repo, mailer, đồng hồ qua tham số</span></div>
  <div class="lz-layer"><span class="lz-lname">Giữ logic thuần</span><span class="lz-lnote">dựng email trong một hàm, gửi ở chỗ khác</span></div>
  <div class="lz-layer"><span class="lz-lname">Rìa mỏng</span><span class="lz-lnote">route và handler chỉ nối các phần lại</span></div>
</div>
<div class="pitfall"><strong>Import ẩn.</strong> Một service tự import pool CSDL và mailer chỉ test được bằng mock module và đồng hồ giả; bài đã đo cùng một test: 11 dòng khi tiêm phụ thuộc, 21 dòng với hai lời gọi <code>vi.mock</code>. Khó test thường có nghĩa là khó sửa.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Phụ thuộc ẩn làm test chậm, giòn hoặc không viết nổi — đo được: ECONNREFUSED, rồi 21 dòng vá víu.</li>
<li>Truyền phụ thuộc qua interface nhỏ; giữ quyết định trong hàm thuần.</li>
<li>Adapter thật khi chạy, fake khi test; lõi không cần biết khác nhau.</li>
<li>Phải <code>vi.mock</code> chính code của mình là tín hiệu cần thiết kế lại.</li>
</ul>
</div>
`,
};
