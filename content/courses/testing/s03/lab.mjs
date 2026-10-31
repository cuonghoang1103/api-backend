/**
 * Testing · Chương 3 · Lab 3 — Đồ đóng thế trung thực: diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-3-5-lab-test-double.
 * Máy chấm scripts/dot-bien-3.mjs. Output thật: bộ yếu 3 test xanh → 0/8; lời giải 11 test (73 cả dự án) → 8/8.
 */
import G from '../giang/tst-lab-3.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

// Cả dự án: chỉ giữ dòng từng file test và dòng tổng (cây 73 test quá dài để in hai lần).
const FULL = OUT['lab3-full'].split('\n').filter((l) => /^\$ |^ [✓❯] |Test Files|Tests |Duration/.test(l)).join('\n');

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-3.mjs</code></td></tr>
<tr><td>Right double for each job: fakes for repo and mailer, a stub for failures, MSW for HTTP; no <code>vi.mock</code> of your own modules</td><td>2</td><td>read the tests</td></tr>
<tr><td>Outcomes asserted (outbox, stored rows, returned result); interactions only for the log warning and the HTTP request</td><td>2</td><td>read the tests</td></tr>
<tr><td>No real network: <code>onUnhandledFrame: 'error'</code></td><td>1</td><td>MSW server setup</td></tr>
<tr><td>Clear names, under 1 second, no <code>.only</code>/<code>.skip</code></td><td>1</td><td>report tree</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-3.mjs</code></td></tr>
<tr><td>Đúng loại đồ đóng thế cho từng việc: fake cho repo và mailer, stub cho lỗi, MSW cho HTTP; không <code>vi.mock</code> module của mình</td><td>2</td><td>đọc test</td></tr>
<tr><td>Khẳng định kết quả (hộp thư, dòng đã lưu, giá trị trả về); tương tác chỉ cho cảnh báo log và request HTTP</td><td>2</td><td>đọc test</td></tr>
<tr><td>Không chạm mạng thật: <code>onUnhandledFrame: 'error'</code></td><td>1</td><td>phần dựng server MSW</td></tr>
<tr><td>Tên rõ ràng, dưới 1 giây, không <code>.only</code>/<code>.skip</code></td><td>1</td><td>cây báo cáo</td></tr>
</tbody></table>`;

export default {
  title: 'Lab 3 — Honest doubles: test the e-mail flow and kill 8 mutants|||Lab 3 — Đồ đóng thế trung thực: test luồng gửi thư và diệt 8 đột biến',
  slug: 'tst-3-5-lab-test-double',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 3, thang chấm 10 điểm: test notify.js (buildMail, bookAndNotify) và mailer.js (createHttpMailer) bằng fake, stub và MSW — không mock module của mình; script dot-bien-3.mjs cài 8 bug ở phần code nối (gửi nhầm người, thiếu ngày/số chỗ, thư hỏng làm hỏng yêu cầu, không log, 429, Bearer, 4xx). Output thật: bộ yếu 0/8, lời giải 11 test 8/8.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab 3</span>
<h2>Honest doubles: test the e-mail flow</h2>
<p class="lead">About 75 minutes. Graded like Labs 1 and 2: a script plants eight bugs one at a time and your suite must turn red for each. This time the bugs live in glue code — who receives which e-mail, what happens when the provider fails, how the HTTP contract is spoken.</p>

<h3>Setup</h3>
<ol>
<li>LabFlow Lite with <code>src/notify/notify.js</code>, <code>src/lib/mailer.js</code> and <code>test/support/fakes.js</code> exactly as in lessons 3.1–3.2; <code>msw@3</code> installed.</li>
<li>Create <code>scripts/dot-bien-3.mjs</code>:
${ma('javascript', CODE.dotBien3)}</li>
</ol>
<p>The eight bugs: the confirmation goes to the approver; the subject loses the date; the approver mail loses the seat count; a failed e-mail fails the whole request; a failed e-mail is no longer logged; HTTP 429 is not recognised; the API key is sent without “Bearer ”; 4xx answers are treated as success.</p>

<h3>Your task</h3>
<p>Write <code>src/notify/notify.test.js</code> and <code>src/lib/mailer.test.js</code> so that <code>npm run test:unit</code> is green and <code>node scripts/dot-bien-3.mjs</code> prints <strong>8/8</strong>. Rules: real business rules; the memory repository and the fake mailer for storage and e-mail; a stub to make the mailer fail; MSW for HTTP with unhandled requests failing; no <code>vi.mock</code> of LabFlow’s own modules.</p>

<h3>What a first attempt usually looks like</h3>
${ma('javascript', CODE.weak3)}
${ra(OUT['lab3-weak-run'])}
${ra(OUT['lab3-mut-weak'])}
<p>Three green tests, zero bugs noticed. <code>toHaveBeenCalled()</code> without arguments cannot tell a correct recipient from a wrong one; a mailer that never fails never reaches the catch branch; one happy HTTP answer says nothing about 429 or 400, and nobody looks at the request that was sent.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Write the e-mail rules as sentences: who receives what, with which subject, and what happens when sending fails.</li>
<li>For <code>buildMail</code>, a two-row table that compares the whole <code>{ to, subject }</code> object kills three mutants at once.</li>
<li>For failures: a stub mailer that throws; then check the result, <code>repo.count()</code>, and the exact warning text.</li>
<li>In MSW, record the request (header + JSON) in the handler; answer 429, 400 and 503 in separate tests.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.notifyTest)}
${ma('javascript', CODE.mailerTest)}
${ra(OUT['lab3-ch3'])}
${ra(FULL)}
${ra(OUT['lab3-mut-strong'])}
<p>Eleven new tests, 73 in the whole project, 8/8. Labs 1 and 2 still print 8/8 — the new tests did not change any source file.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:unit</code> green, no real network, no <code>.only</code>/<code>.skip</code>.</li>
<li><code>node scripts/dot-bien-3.mjs</code> prints 8/8; Labs 1 and 2 still 8/8.</li>
<li><code>git diff src/</code> shows only test files.</li>
<li>Commit: <code>test: e-mail flow with fakes and MSW (Lab 3, 8/8)</code>.</li>
</ul>

<!-- SODO-TST -->
<h3>🗺 Choosing the double in Lab 3</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">What is slow or external?</div><div class="lz-d">mail provider, clock</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Stub or fake it</div><div class="lz-d">a fake repo, a stub mailer</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Assert the outcome</div><div class="lz-d">booking stored, notified flag</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Assert the call</div><div class="lz-d">only for who receives the e-mail</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Grade</div><div class="lz-d">dot-bien-3.mjs → 8/8</div></div>
</div>
<div class="pitfall"><strong>A mailer that never fails.</strong> If every test uses a mailer that always succeeds, the bug “a failed e-mail fails the whole booking” survives. Give one test a mailer that throws and check the booking is still saved.</div>
<h3>📌 Summary</h3>
<ul>
<li>“Something happened” tests miss every bug in glue code; assert who, what and what-if-it-fails.</li>
<li>Fakes for state, a stub for failure, MSW for the HTTP contract — each double has one job.</li>
<li>Eleven precise tests killed all eight mutants.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab 3</span>
<h2>Đồ đóng thế trung thực: test luồng gửi thư</h2>
<p class="lead">Khoảng 75 phút. Chấm như Lab 1 và Lab 2: một script cài tám con bug, mỗi lần một con, và bộ test của bạn phải đỏ với từng con. Lần này bug nằm ở code nối — ai nhận thư gì, chuyện gì xảy ra khi nhà cung cấp hỏng, hợp đồng HTTP được nói ra sao.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>LabFlow Lite có <code>src/notify/notify.js</code>, <code>src/lib/mailer.js</code> và <code>test/support/fakes.js</code> giữ nguyên như bài 3.1–3.2; đã cài <code>msw@3</code>.</li>
<li>Tạo <code>scripts/dot-bien-3.mjs</code>:
${ma('javascript', CODE.dotBien3)}</li>
</ol>
<p>Tám con bug: thư xác nhận gửi nhầm cho người duyệt; tiêu đề mất ngày; thư người duyệt mất số chỗ; gửi thư hỏng làm hỏng cả yêu cầu; gửi thư hỏng mà không còn ghi log; không nhận ra HTTP 429; khoá API gửi thiếu chữ “Bearer ”; coi câu trả lời 4xx là thành công.</p>

<h3>Nhiệm vụ</h3>
<p>Viết <code>src/notify/notify.test.js</code> và <code>src/lib/mailer.test.js</code> sao cho <code>npm run test:unit</code> xanh và <code>node scripts/dot-bien-3.mjs</code> in <strong>8/8</strong>. Luật chơi: luật nghiệp vụ thật; repository bộ nhớ và mailer giả cho lưu trữ và thư; một stub để mailer hỏng; MSW cho HTTP với request lạ bị đánh hỏng; không <code>vi.mock</code> module của chính LabFlow.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
${ma('javascript', CODE.weak3)}
${ra(OUT['lab3-weak-run'])}
${ra(OUT['lab3-mut-weak'])}
<p>Ba test xanh, không phát hiện con bug nào. <code>toHaveBeenCalled()</code> không tham số thì không phân biệt được người nhận đúng hay sai; mailer không bao giờ hỏng thì không bao giờ tới nhánh catch; một câu trả lời HTTP suôn sẻ chẳng nói gì về 429 hay 400, và không ai nhìn request đã gửi đi.</p>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Viết luật gửi thư thành câu: ai nhận gì, tiêu đề nào, và gửi hỏng thì sao.</li>
<li>Với <code>buildMail</code>, một bảng hai dòng so nguyên object <code>{ to, subject }</code> diệt ba đột biến một lúc.</li>
<li>Với lỗi: một mailer stub ném lỗi; rồi kiểm kết quả, <code>repo.count()</code>, và đúng nội dung cảnh báo.</li>
<li>Trong MSW, ghi lại request (header + JSON) ngay trong handler; trả 429, 400 và 503 ở các test riêng.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã tự làm)</h3>
${ma('javascript', CODE.notifyTest)}
${ma('javascript', CODE.mailerTest)}
${ra(OUT['lab3-ch3'])}
${ra(FULL)}
${ra(OUT['lab3-mut-strong'])}
<p>Mười một test mới, 73 test cả dự án, 8/8. Lab 1 và Lab 2 vẫn in 8/8 — test mới không đổi file nguồn nào.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:unit</code> xanh, không chạm mạng thật, không <code>.only</code>/<code>.skip</code>.</li>
<li><code>node scripts/dot-bien-3.mjs</code> in 8/8; Lab 1 và Lab 2 vẫn 8/8.</li>
<li><code>git diff src/</code> chỉ có file test.</li>
<li>Commit: <code>test: e-mail flow with fakes and MSW (Lab 3, 8/8)</code>.</li>
</ul>

<h3>🗺 Chọn test double trong Lab 3</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Cái gì chậm hoặc ở ngoài?</div><div class="lz-d">nhà cung cấp mail, đồng hồ</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Stub hoặc fake nó</div><div class="lz-d">repo giả, mailer stub</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Khẳng định kết quả</div><div class="lz-d">lượt đặt đã lưu, cờ đã thông báo</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Khẳng định lời gọi</div><div class="lz-d">chỉ cho việc ai nhận email</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chấm</div><div class="lz-d">dot-bien-3.mjs → 8/8</div></div>
</div>
<div class="pitfall"><strong>Một mailer không bao giờ hỏng.</strong> Nếu mọi test dùng một mailer luôn thành công, con bug “email gửi hỏng làm hỏng cả lượt đặt” sẽ sống. Cho một test dùng mailer ném lỗi và kiểm lượt đặt vẫn được lưu.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Test kiểu “có chuyện gì đó xảy ra” bỏ lọt mọi bug ở code nối; hãy khẳng định ai, cái gì, và nếu hỏng thì sao.</li>
<li>Fake cho trạng thái, stub cho lỗi, MSW cho hợp đồng HTTP — mỗi đồ đóng thế một việc.</li>
<li>Mười một test chính xác diệt đủ tám đột biến.</li>
</ul>
</div>
`,
};
