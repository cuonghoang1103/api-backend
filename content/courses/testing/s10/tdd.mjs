/**
 * Testing · Chương 10 · 10.1 — TDD trong thực tế: đỏ, xanh, refactor. Slug giữ từ khung: tst-10-1-tdd.
 * Tính năng thật làm bằng TDD: BR-09 danh sách chờ (src/rules/waitlist.js), 7 bước ghi trong demo10/tdd/<N>-do và <N>-xanh (mỗi bước chạy thật:
 * đỏ đúng lý do → xanh), refactor bước 7; bộ cuối 14 test; Stryker trên waitlist.js 100% (45/45).
 * Classicist vs mockist (demo10/truong-phai): refactor "remove trả dòng" ⇒ mockist-v1 đỏ NOT_FOUND, classicist xanh; bug splice trả mảng ⇒
 * mockist xanh, classicist đỏ 2 test. Thực hành leaveWaitlist (demo10/th101). Mọi output ở ./_ma.mjs (sinh tự động).
 */
import G from '../giang/tst-10-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const part = (src, needle, n) => { const d = src.split('\n'); const i = d.findIndex((l) => l.includes(needle)); return d.slice(i, i + n).join('\n'); };

const STUB = CODE.x0.split('\n')[1];
const X1 = CODE.x1.split('\n').slice(1).join('\n');
const X2 = CODE.x2.split('\n').slice(1).join('\n');
const X7 = part(CODE.x7, 'const refuse', 2) + '\n…\n' + part(CODE.x7, 'export function offerNext', 10);
const SVC = part(CODE.cancelSvc, 'export async function', 12);
const TH_X = CODE.th101Xanh.split('\n').slice(1).join('\n');
const T1 = CODE.t1.split('\n').slice(1).join('\n');
const B1DO = loc('101-b1-do', /^\$ |×|AssertionError|Tests {2}/);
const B2DO = loc('101-b2-do', /^\$ |×|AssertionError|^[-+] {3}"position"|Tests {2}/);
const B4DO = loc('101-b4-do', /^\$ |×|AssertionError|Tests {2}/);
const BUOC = ['101-b3-do', '101-b5-do', '101-b6-do', '101-b6-xanh', '101-b7'].map((k) => loc(k, /^\$ |TypeError|Tests {2}/)).join('\n');
const SRC = loc('101-src', /^\$ |✓ src|✓ says|✓ never|Tests {2}/);
const STRY = loc('101-stryker', /^\$ |Instrumented|^File {9}\||^All files|Final mutation/);
const MOCK_V1 = part(CODE.mockistV1, 'const repo = {', 1) + '\n    …\n' + part(CODE.mockistV1, 'expect(repo.findById)', 2);
const CLASSIC = part(CODE.classicist, 'const result = await', 5).replace(/\n\n/g, '\n');
const V1TRUOC = loc('101-v1-truoc', /^planted|Tests {2}/);
const V1_XANH = V1TRUOC.split('\n').pop().trim();
const V1SAU = loc('101-v1-sau', /^\$ |✓ demo10|×|^BookingError|Tests {2}/);
const SPLICE = loc('101-splice', /^planted|✓ demo10|❯ demo10\/truong-phai\/classicist\.test\.js \(|AssertionError: expected \{ cancelled: undefined, …\(1\) \} to deeply equal \{ cancelled: 1, …|Tests {2}/);
const TH_TEST = part(CODE.th101Test, "describe('leaveWaitlist'", 15).replace(/\n\n/g, '\n');
const TH_DO = loc('101-th-do', /^\$ |×|✓ never|Tests {2}/);
const TH_XANH = loc('101-th-xanh', /^\$ |Tests {2}/);

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">0</div><div class="lz-t">Test list</div><div class="lz-d">every case you know, in plain words</div></div>
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Red</div><div class="lz-d">ONE item becomes a test; it fails for its own reason</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Green</div><div class="lz-d">the simplest code that passes all tests</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Refactor</div><div class="lz-d">tidy up while everything stays green</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Next item</div><div class="lz-d">new cases join the list; stop when it is empty</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">0</div><div class="lz-t">Danh sách test</div><div class="lz-d">mọi tình huống bạn biết, bằng lời thường</div></div>
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đỏ</div><div class="lz-d">MỘT mục thành test; đỏ đúng lý do của nó</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Xanh</div><div class="lz-d">code đơn giản nhất làm mọi test xanh</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Refactor</div><div class="lz-d">dọn dẹp trong khi mọi thứ vẫn xanh</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Mục tiếp theo</div><div class="lz-d">tình huống mới thêm vào danh sách; dừng khi rỗng</div></div>
</div>`;

const KHI_EN = `<table>
<thead><tr><th>Situation</th><th>TDD?</th><th>What to do instead</th></tr></thead>
<tbody>
<tr><td>A business rule, pure function (BR-09)</td><td>✅ best case</td><td>—</td></tr>
<tr><td>A bug you can reproduce</td><td>✅ red test first</td><td>— (it stays as a guard)</td></tr>
<tr><td>Exploring a UI or a new library</td><td>❌</td><td>a <em>spike</em>: learn, throw it away, then test-first</td></tr>
<tr><td>Requirement still unclear</td><td>⚠️</td><td>ask; write examples first (ATDD)</td></tr>
<tr><td>Legacy code with no seams</td><td>⚠️</td><td>characterization tests first (10.2)</td></tr>
</tbody></table>`;
const KHI_VI = `<table>
<thead><tr><th>Tình huống</th><th>TDD?</th><th>Thay vào đó làm gì</th></tr></thead>
<tbody>
<tr><td>Luật nghiệp vụ, hàm thuần (BR-09)</td><td>✅ tốt nhất</td><td>—</td></tr>
<tr><td>Bug tái hiện được</td><td>✅ test đỏ trước</td><td>— (test ở lại làm lính gác)</td></tr>
<tr><td>Mò giao diện hoặc thư viện mới</td><td>❌</td><td><em>spike</em> (bản thử nhanh): học, vứt đi, rồi viết test trước</td></tr>
<tr><td>Yêu cầu còn mơ hồ</td><td>⚠️</td><td>hỏi lại; viết ví dụ trước (ATDD)</td></tr>
<tr><td>Code cũ chưa có seam</td><td>⚠️</td><td>characterization test trước (10.2)</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📕', 'Kent Beck — Canon TDD', 'The five steps: test list, one test, make it pass, optionally refactor, repeat (2023).', 'https://tidyfirst.substack.com/p/canon-tdd'),
  nguon('🧪', 'Martin Fowler — Mocks Aren’t Stubs', 'State vs behaviour verification; classical and mockist TDD.', 'https://martinfowler.com/articles/mocksArentStubs.html'),
].join('\n');

export default {
  title: '10.1 — TDD in practice: red, green, refactor|||10.1 — TDD trong thực tế: đỏ, xanh, refactor',
  slug: 'tst-10-1-tdd',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Làm một tính năng thật của LabFlow Lite bằng TDD từ đầu: luật BR-09 danh sách chờ (tối đa 3 người, người giữ khung không được chờ, mời người đầu hàng trong 30 phút). Danh sách test trước, 7 bước chạy thật — đỏ đúng lý do (undefined, vị trí 1 thay vì 2, IS_HOLDER tìm ra nhờ danh sách, "offerNext is not a function", biên 10:29/10:30) rồi xanh bằng Fake It, Triangulate, Obvious Implementation, refactor khi xanh; bộ cuối 14 test và Stryker diệt 45/45 đột biến (so với 41,49% của bộ test đuổi độ phủ ở 8.2). Classicist vs mockist đo thật: một refactor vô hại làm test mockist đỏ, một bug thật trong repository chỉ test classicist bắt được. Khi nào TDD không hợp (spike, giao diện, yêu cầu mơ hồ, code cũ).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>TDD in practice: red, green, refactor</h2>
<p class="lead">Until now you tested code that already existed. Test-driven development turns that around: a failing test, just enough code to pass it, a clean-up. This lesson builds a real LabFlow feature that way — every step a real run — and measures the result.</p>
<p><strong>After this lesson you can</strong> start a feature from a test list, make each test fail for the right reason, refactor on green, choose between classicist and mockist tests, and say when TDD is the wrong tool. <strong>Why it is useful:</strong> TDD forces edge cases out <em>before</em> the code decides them silently, and leaves tests strong enough to kill every mutant. “Do you do TDD? Show me” is a common internship interview question (lesson 10.4).</p>

<h3>The loop</h3>
<p>Kent Beck described TDD in <em>Test-Driven Development: By Example</em> (2002) and restated it in 2023 as “Canon TDD”: write a list of test scenarios; turn exactly one into a runnable test; make it (and every earlier test) pass; optionally refactor; repeat until the list is empty.</p>
${FLOW_EN}
<p>Three moves get you to green: <strong>Fake It</strong> (a constant), <strong>Triangulate</strong> (a second example forces general code), <strong>Obvious Implementation</strong> (you know the code — type it).</p>

<h3>BR-09, and the test list before any code</h3>
<p>LabFlow Lite gets a waitlist: <strong>at most 3 students wait for one slot; the student who holds the slot cannot wait for it; a freed slot is offered to the first in line for 30 minutes; the offer can be accepted until it expires.</strong> The list, before one line of code: (1) first student → position 1; (2) next student → behind the others; (3) already waiting → <code>ALREADY_WAITING</code>; (4) fourth student → <code>WAITLIST_FULL</code>; (5) the holder → <code>IS_HOLDER</code>; (6) a freed slot is offered to the first, until 30 minutes later; nobody waiting → no offer; (7) accepted at 10:29, refused at 10:30 → <code>OFFER_EXPIRED</code>.</p>
<p>Item 5 was not in the rule we were given: it appeared while writing the list, and the product owner confirmed it — a question asked before the code answers it by accident.</p>

<h3>Step 1 — red for the right reason, then fake it</h3>
${ma('javascript', T1)}
<p>With no <code>waitlist.js</code> the run fails on the import — red, but silent about behaviour. So the file starts as <code>${STUB}</code>, and the test fails on its assertion:</p>
${ra(B1DO)}
<p>Then the simplest code that passes — a constant — and the run is green:</p>
${ma('javascript', X1)}
<div class="pitfall co-tieu-de"><strong>Red for the wrong reason proves nothing.</strong> A typo in an import or a syntax error also turns the test red, then green after the “fix” — and the behaviour was never checked. Read every red message: it must be the assertion the test name promises.</div>

<h3>Step 2 — triangulate</h3>
<p>A second example, <em>puts the next student behind the ones already waiting</em>, exposes the constant:</p>
${ra(B2DO)}
${ma('javascript', X2)}

<h3>Steps 3–6 — the list drives the rest</h3>
<p>Item 5, found by the list — without it the holder would wait for their own slot:</p>
${ra(B4DO)}
<p>The other steps, red then green each time (a missing function is a plain red — fine, if the <em>next</em> run is about behaviour):</p>
${ra(BUOC)}
<p>Time is an argument (<code>offerNext(queue, now)</code>, <code>acceptOffer(offer, now)</code>), as in Chapter 2, so the boundary tests sit exactly one minute apart: 10:29 accepted, 10:30 refused. The last run is step 7, the refactor.</p>

<h3>Step 7 — refactor on green</h3>
<p>Nine green tests are a licence to clean up (helpers, destructuring, a one-line <code>acceptOffer</code>) — no new behaviour, no new test. Part of <code>src/rules/waitlist.js</code> as it ships:</p>
${ma('javascript', X7)}
<p>The final test file adds two tests the steps made us think of: a student already in a <em>full</em> line hears <code>ALREADY_WAITING</code>, not <code>WAITLIST_FULL</code> (so swapping two <code>if</code> lines in a later refactor cannot change the message silently), and the caller’s queue is never changed:</p>
${ra(SRC)}

<h3>What TDD bought: every mutant killed</h3>
<p>Lesson 8.2 measured a suite written to reach 100% coverage: it killed 41.49% of Stryker’s mutants. The suite TDD left behind:</p>
${ra(STRY)}
<p>45 of 45: every test was written to fail first on one behaviour, with the boundaries on the list from the start.</p>

<h3>Classicist or mockist?</h3>
<p>When a booking is cancelled, the first student waiting gets an e-mail — <code>cancelBooking</code> in <code>src/booking/waitlistService.js</code>:</p>
${ma('javascript', SVC)}
<p>Martin Fowler (“Mocks Aren’t Stubs”) names two schools. The <strong>mockist</strong> (London) test mocks every collaborator and checks the calls; it was written for the first version, which called <code>findById</code> then <code>remove</code>:</p>
${ma('javascript', MOCK_V1)}
<p>The <strong>classicist</strong> (Detroit/Chicago) test uses the real in-memory repository and a real <code>Map</code>, and a fake only for the mailer (Chapter 3):</p>
${ma('javascript', CLASSIC)}
<p>Against the first version both are green: <code>${V1_XANH}</code>. Then a refactor with a good reason — one database round trip instead of two: the repository’s <code>remove(id)</code> now returns the deleted row (or <code>null</code>), so the service no longer calls <code>findById</code>.</p>
${ra(V1SAU)}
<p>Same behaviour for every user, yet the mockist test is red: its mock <code>remove</code> returns <code>undefined</code>. It described a call sequence, not behaviour. Now a real bug in the repository — <code>splice</code> without <code>[0]</code> returns an array:</p>
${ra(SPLICE)}
<p>The mockist test (rewritten for the new calls) stays green — it never runs the real repository. The classicist tests catch it: nobody would ever be offered a freed slot. Harmless refactor: mockist red. Real bug: mockist green. The classicist got both right.</p>
<div class="pitfall co-tieu-de"><strong>A test that mirrors the call sequence fights refactoring</strong> — the third step of TDD. LabFlow’s rule: real objects inside your code, a fake or mock only at a boundary you do not own (the mail provider, a payment API).</div>

<h3>When TDD does not fit</h3>
${KHI_EN}
<p><strong>JUnit and Spring:</strong> the same loop in JUnit 5. <code>@MockitoBean</code> plus <code>verify(repo).findById(7)</code> is the mockist path, with the brittleness above; domain unit tests plus <code>@SpringBootTest</code> on Testcontainers (Chapter 4) is the classicist one.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>leaveWaitlist(queue, userId)</code> removes a student and moves everyone behind them up, refuses a student who is not waiting with <code>NOT_WAITING</code>, and never changes the queue it was given. Write three tests, run them against an empty function, then make them green.</p>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', TH_TEST)}
${ra(TH_DO)}
<p>Two red for the right reason — and one green: doing nothing changes nothing, so that green proves nothing yet. The simplest code:</p>
${ma('javascript', TH_X)}
${ra(TH_XANH)}
<p><strong>Done when</strong> all three are green, you saw the first two red for the reason their names say, and you can explain why the third was green too early.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TDD — test-driven development (phát triển hướng kiểm thử)</span><span class="v">Failing test, make it pass, refactor; repeat.</span></div>
  <div class="kv"><span class="k">test list (danh sách test)</span><span class="v">The cases you know before coding; grows as you learn.</span></div>
  <div class="kv"><span class="k">fake it / triangulate (giả vờ / tam giác hoá)</span><span class="v">A constant first; a second example forces the general code.</span></div>
  <div class="kv"><span class="k">refactor (tái cấu trúc)</span><span class="v">Change structure, not behaviour — only on green.</span></div>
  <div class="kv"><span class="k">classicist / mockist (trường phái cổ điển / mock)</span><span class="v">Real collaborators and state checks vs mocks and call checks.</span></div>
  <div class="kv"><span class="k">spike (bản thử nhanh)</span><span class="v">Throw-away code to learn; rewritten test-first.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Start from a test list; turn one item at a time into a test that fails for the reason in its name.</li>
<li>Fake It, Triangulate, Obvious Implementation; refactor only on green.</li>
<li>The list grows as you learn (IS_HOLDER, message order, immutability) — the result killed 45/45 mutants.</li>
<li>Real collaborators inside, mocks only at boundaries; spike when exploring, then test-first.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-tdd-bdd', title: 'Theory in SWT301 — 9.6: TDD, ATDD and BDD', sub: 'Same: red–green–refactor, one TDD session in JUnit 5. Deeper here: a feature in 7 measured steps, its mutation score, classicist vs mockist measured.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-2-unit-test', title: 'Node.js course — 14.2: unit tests and test doubles', sub: 'There: AAA, injecting a fake repository and a fake clock. Here: the same injection used test-first, and what mocking every call costs when you refactor.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>TDD trong thực tế: đỏ, xanh, refactor</h2>
<p class="lead">Tới giờ bạn test code đã có sẵn. Test-driven development (phát triển hướng kiểm thử) đảo ngược điều đó: test đỏ, vừa đủ code để xanh, dọn dẹp. Bài này dựng một tính năng thật của LabFlow theo cách đó — mỗi bước một lần chạy thật — và đo kết quả.</p>
<p><strong>Sau bài này bạn có thể</strong> bắt đầu một tính năng từ danh sách test, làm mỗi test đỏ đúng lý do, refactor khi xanh, chọn giữa test classicist và mockist, và nói được khi nào TDD là công cụ sai. <strong>Vì sao hữu ích:</strong> TDD buộc các trường hợp biên lộ ra <em>trước khi</em> code âm thầm tự quyết, và để lại bộ test đủ mạnh để diệt mọi đột biến. “Bạn có làm TDD không? Cho tôi xem” là câu phỏng vấn thực tập hay gặp (bài 10.4).</p>

<h3>Vòng lặp</h3>
<p>Kent Beck mô tả TDD trong <em>Test-Driven Development: By Example</em> (2002) và nói lại năm 2023 dưới tên “Canon TDD”: viết danh sách tình huống test; biến đúng một mục thành test chạy được; làm nó (và mọi test trước đó) xanh; nếu cần thì refactor; lặp lại tới khi danh sách rỗng.</p>
${FLOW_VI}
<p>Ba nước đi tới xanh: <strong>Fake It</strong> (giả vờ — một hằng số), <strong>Triangulate</strong> (tam giác hoá — ví dụ thứ hai buộc code tổng quát), <strong>Obvious Implementation</strong> (cài đặt hiển nhiên — đã biết code thì cứ gõ).</p>

<h3>BR-09, và danh sách test trước mọi dòng code</h3>
<p>LabFlow Lite có thêm danh sách chờ: <strong>tối đa 3 sinh viên chờ một khung; người đang giữ khung không được chờ chính khung đó; khung được trả thì mời người đầu hàng trong 30 phút; lời mời nhận được tới khi hết hạn.</strong> Danh sách, trước một dòng code nào: (1) sinh viên đầu → vị trí 1; (2) sinh viên kế → đứng sau những người đang chờ; (3) đã đang chờ → <code>ALREADY_WAITING</code>; (4) sinh viên thứ tư → <code>WAITLIST_FULL</code>; (5) người giữ khung → <code>IS_HOLDER</code>; (6) khung được trả thì mời người đầu, hạn 30 phút sau; không ai chờ → không mời; (7) nhận lúc 10:29, từ chối lúc 10:30 → <code>OFFER_EXPIRED</code>.</p>
<p>Mục 5 không có trong luật được giao: nó xuất hiện khi viết danh sách, và product owner đã xác nhận — một câu hỏi được hỏi trước khi code tình cờ trả lời nó.</p>

<h3>Bước 1 — đỏ đúng lý do, rồi giả vờ</h3>
${ma('javascript', T1)}
<p>Chưa có <code>waitlist.js</code> thì lần chạy đỏ ở dòng import — đỏ, nhưng không nói gì về hành vi. Vì vậy file bắt đầu bằng <code>${STUB}</code>, và test đỏ ở chính khẳng định của nó:</p>
${ra(B1DO)}
<p>Rồi code đơn giản nhất làm nó xanh — một hằng số — và lần chạy xanh:</p>
${ma('javascript', X1)}
<div class="pitfall co-tieu-de"><strong>Đỏ sai lý do chẳng chứng minh được gì.</strong> Gõ sai import hay lỗi cú pháp cũng làm test đỏ, rồi xanh sau khi “sửa” — mà hành vi chưa từng được kiểm. Đọc mọi thông báo đỏ: nó phải là đúng khẳng định mà tên test hứa.</div>

<h3>Bước 2 — tam giác hoá</h3>
<p>Ví dụ thứ hai, <em>puts the next student behind the ones already waiting</em>, lật tẩy hằng số:</p>
${ra(B2DO)}
${ma('javascript', X2)}

<h3>Bước 3–6 — danh sách dẫn phần còn lại</h3>
<p>Mục 5, do danh sách tìm ra — thiếu nó, người giữ khung sẽ xếp hàng chờ chính khung của mình:</p>
${ra(B4DO)}
<p>Các bước còn lại, lần nào cũng đỏ rồi xanh (thiếu hàm là kiểu đỏ đơn giản — được, miễn lần chạy <em>sau</em> là về hành vi):</p>
${ra(BUOC)}
<p>Thời gian là đối số (<code>offerNext(queue, now)</code>, <code>acceptOffer(offer, now)</code>), như Chương 2, nên hai test biên cách nhau đúng một phút: 10:29 được nhận, 10:30 bị từ chối. Lần chạy cuối là bước 7, refactor.</p>

<h3>Bước 7 — refactor khi xanh</h3>
<p>Chín test xanh là giấy phép để dọn (helper, destructuring, <code>acceptOffer</code> một dòng) — không hành vi mới, không test mới. Một phần <code>src/rules/waitlist.js</code> lúc đưa vào dự án:</p>
${ma('javascript', X7)}
<p>File test cuối thêm hai test mà các bước khiến ta nghĩ tới: sinh viên đã ở trong một hàng <em>đầy</em> nghe <code>ALREADY_WAITING</code>, không phải <code>WAITLIST_FULL</code> (để đổi chỗ hai dòng <code>if</code> lúc refactor sau này không âm thầm đổi thông báo), và hàng chờ của người gọi không bao giờ bị đổi:</p>
${ra(SRC)}

<h3>TDD mua được gì: mọi đột biến đều bị diệt</h3>
<p>Bài 8.2 đo một bộ test viết để đạt 100% độ phủ: nó diệt 41,49% đột biến của Stryker. Bộ test TDD để lại:</p>
${ra(STRY)}
<p>45 trên 45: mỗi test được viết để đỏ trước vì đúng một hành vi, các biên có trong danh sách ngay từ đầu.</p>

<h3>Classicist hay mockist?</h3>
<p>Khi một lượt đặt bị huỷ, sinh viên đầu hàng nhận e-mail — <code>cancelBooking</code> trong <code>src/booking/waitlistService.js</code>:</p>
${ma('javascript', SVC)}
<p>Martin Fowler (“Mocks Aren’t Stubs”) gọi tên hai trường phái. Test <strong>mockist</strong> (London) mock mọi cộng tác viên và kiểm các lời gọi; nó được viết cho phiên bản đầu, phiên bản gọi <code>findById</code> rồi <code>remove</code>:</p>
${ma('javascript', MOCK_V1)}
<p>Test <strong>classicist</strong> (Detroit/Chicago) dùng repository bộ nhớ thật và một <code>Map</code> thật, chỉ dùng fake cho mailer (Chương 3):</p>
${ma('javascript', CLASSIC)}
<p>Với phiên bản đầu, cả hai xanh: <code>${V1_XANH}</code>. Rồi một refactor có lý do chính đáng — một lượt gọi cơ sở dữ liệu thay vì hai: <code>remove(id)</code> của repository giờ trả về dòng vừa xoá (hoặc <code>null</code>), nên service không gọi <code>findById</code> nữa.</p>
${ra(V1SAU)}
<p>Hành vi như nhau với mọi người dùng, vậy mà test mockist đỏ: mock <code>remove</code> của nó trả <code>undefined</code>. Nó mô tả một chuỗi lời gọi, không mô tả hành vi. Giờ một bug thật trong repository — <code>splice</code> thiếu <code>[0]</code> trả về một mảng:</p>
${ra(SPLICE)}
<p>Test mockist (đã viết lại cho các lời gọi mới) vẫn xanh — nó không bao giờ chạy repository thật. Các test classicist bắt được: sẽ không ai được mời khung vừa trống. Refactor vô hại: mockist đỏ. Bug thật: mockist xanh. Classicist đúng cả hai lần.</p>
<div class="pitfall co-tieu-de"><strong>Test chép lại chuỗi lời gọi sẽ chống lại refactor</strong> — bước thứ ba của TDD. Luật của LabFlow: đồ thật bên trong code của bạn, fake hoặc mock chỉ ở ranh giới bạn không sở hữu (nhà cung cấp e-mail, API thanh toán).</div>

<h3>Khi nào TDD không hợp</h3>
${KHI_VI}
<p><strong>JUnit và Spring:</strong> vòng lặp y hệt trong JUnit 5. <code>@MockitoBean</code> cộng <code>verify(repo).findById(7)</code> là con đường mockist, với đúng độ giòn đo ở trên; unit test lớp nghiệp vụ cộng <code>@SpringBootTest</code> trên Testcontainers (Chương 4) là con đường classicist.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>leaveWaitlist(queue, userId)</code> xoá một sinh viên và đưa mọi người phía sau lên, từ chối sinh viên không có trong hàng với <code>NOT_WAITING</code>, và không bao giờ đổi hàng chờ được truyền vào. Viết ba test, chạy với một hàm rỗng, rồi làm chúng xanh.</p>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', TH_TEST)}
${ra(TH_DO)}
<p>Hai test đỏ đúng lý do — và một test xanh: không làm gì thì chẳng đổi gì, nên màu xanh đó chưa chứng minh được gì. Code đơn giản nhất:</p>
${ma('javascript', TH_X)}
${ra(TH_XANH)}
<p><strong>Xong khi</strong> cả ba xanh, bạn đã thấy hai test đầu đỏ đúng vì lý do tên chúng nói, và giải thích được vì sao test thứ ba xanh quá sớm.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TDD — test-driven development (phát triển hướng kiểm thử)</span><span class="v">Test đỏ, làm nó xanh, refactor; lặp lại.</span></div>
  <div class="kv"><span class="k">test list (danh sách test)</span><span class="v">Các tình huống biết trước khi code; lớn dần khi hiểu thêm.</span></div>
  <div class="kv"><span class="k">fake it / triangulate (giả vờ / tam giác hoá)</span><span class="v">Hằng số trước; ví dụ thứ hai buộc code tổng quát.</span></div>
  <div class="kv"><span class="k">refactor (tái cấu trúc)</span><span class="v">Đổi cấu trúc, không đổi hành vi — chỉ khi xanh.</span></div>
  <div class="kv"><span class="k">classicist / mockist (trường phái cổ điển / mock)</span><span class="v">Cộng tác viên thật và kiểm trạng thái, so với mock và kiểm lời gọi.</span></div>
  <div class="kv"><span class="k">spike (bản thử nhanh)</span><span class="v">Code viết để học rồi vứt; viết lại theo test trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bắt đầu từ danh sách test; mỗi lần biến một mục thành một test đỏ vì đúng lý do trong tên nó.</li>
<li>Fake It, Triangulate, Obvious Implementation; chỉ refactor khi xanh.</li>
<li>Danh sách lớn dần khi bạn hiểu thêm (IS_HOLDER, thứ tự thông báo, không đổi đầu vào) — kết quả diệt 45/45 đột biến.</li>
<li>Đồ thật bên trong, mock chỉ ở ranh giới; đang mò mẫm thì spike, rồi viết test trước.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-tdd-bdd', title: 'Lý thuyết ở SWT301 — 9.6: TDD, ATDD và BDD', sub: 'Giống: đỏ–xanh–refactor, một phiên TDD bằng JUnit 5. Sâu thêm ở đây: một tính năng qua 7 bước đo thật, điểm đột biến của nó, classicist vs mockist đo thật.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-2-unit-test', title: 'Khoá Node.js — 14.2: unit test và đồ đóng thế', sub: 'Ở đó: AAA, tiêm repository giả và đồng hồ giả. Ở đây: cùng cách tiêm đó dùng khi viết test trước, và cái giá của việc mock mọi lời gọi khi refactor.', cta: 'MỞ BÀI →' })}
</div>
`,
};
