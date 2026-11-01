/**
 * Testing · Chương 11 · 11.5 — Dự án cuối khoá: US-11, chấm trên thang 100. BÀI MỚI 01/11/2026, slug tst-11-5-du-an-cuoi-khoa.
 * Máy chấm scripts/cham-cuoi-khoa.mjs (100 điểm: A 4×5 xanh trên code đúng · B 12 bug × 3 · C độ phủ 6 + đột biến 8 · D truy vết 10 ·
 * E kế hoạch test 10 · F CI 10; đạt 70, giỏi 85). 12 bug ở capstone/mutants.mjs. Bản yếu capstone/yeu = 42/100 (115-cham-yeu),
 * bản tham khảo = 100/100 (115-cham-ref). Phần CV/phỏng vấn dùng số đo của Chương 11 (111-ma-tran, 112-mutation, 112-stryker-*,
 * 111-lf-301, 113-flaky, 114-act-*). Mọi output ở ./_ma.mjs (sinh tự động).
 */
import G from '../giang/tst-11-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const YEU = loc('115-cham-yeu', /^\$ |SURVIVED|killed|^ +\d+\/\d+ +[B-F]\.|Total/);
const REF = loc('115-cham-ref', /^\$ |killed by (DB|UI|E2E)|bugs your tests|Total/);
const part = (src, needle, n) => { const d = src.split('\n'); const i = d.findIndex((l) => l.includes(needle)); return d.slice(i, i + n).join('\n'); };
const WEAK_API = part(CODE.yeuApi, "it('cancel works'", 8);
const WEAK_WEB = part(CODE.yeuWeb, "it('calls cancelBooking'", 7);

const SETUP = [
  'npm ci && npx playwright install chromium && brew install actionlint   # once; Docker running',
  'node scripts/cham-cuoi-khoa.mjs                     # your eight files',
  'node scripts/cham-cuoi-khoa.mjs --from capstone/yeu # the weak first attempt',
].join('\n');

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Plan</div><div class="lz-d">risks, budget, traceability (11.1)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Backend</div><div class="lz-d">rule, service, API, PostgreSQL (11.2)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Frontend</div><div class="lz-d">screen tests + one browser journey (11.3)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">CI</div><div class="lz-d">mutation, quality report, ci-ok (11.4)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Grade + tell</div><div class="lz-d">100 points, then STAR (this lesson)</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Kế hoạch</div><div class="lz-d">rủi ro, ngân sách, truy vết (11.1)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Backend</div><div class="lz-d">luật, service, API, PostgreSQL (11.2)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Frontend</div><div class="lz-d">test màn hình + một hành trình trình duyệt (11.3)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">CI</div><div class="lz-d">đột biến, báo cáo chất lượng, ci-ok (11.4)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chấm + kể</div><div class="lz-d">100 điểm, rồi STAR (bài này)</div></div>
</div>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>What the grader checks</th><th>Points</th></tr></thead>
<tbody>
<tr><td>A</td><td>your tests are green on the correct code: Unit + API, UI, DB, E2E (5 each)</td><td>20</td></tr>
<tr><td>B</td><td>each of 12 planted bugs, one at a time, turns one of your layers red (3 each)</td><td>36</td></tr>
<tr><td>C</td><td>coverage thresholds 97/91/96/97 (6) · Stryker score at least 95% (8)</td><td>14</td></tr>
<tr><td>D</td><td>US-11 AC1–AC6 and Lite-3 named by your passing tests; High risk above Unit</td><td>10</td></tr>
<tr><td>E</td><td>the plan has Scope, Risks, Approach, Entry criteria, Exit criteria, Traceability, Definition of done, and names every High-risk id</td><td>10</td></tr>
<tr><td>F</td><td>actionlint (2) · Lab 9 rules (2) · ci-ok needs a mutation job (3) and a report job with <code>shell: bash</code> (3)</td><td>10</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Máy chấm kiểm gì</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>A</td><td>test của bạn xanh trên code đúng: Unit + API, UI, DB, E2E (mỗi tầng 5)</td><td>20</td></tr>
<tr><td>B</td><td>mỗi bug trong 12 bug, cài từng con một, làm một tầng của bạn đỏ (mỗi bug 3)</td><td>36</td></tr>
<tr><td>C</td><td>ngưỡng độ phủ 97/91/96/97 (6) · điểm Stryker từ 95% trở lên (8)</td><td>14</td></tr>
<tr><td>D</td><td>US-11 AC1–AC6 và Lite-3 được test xanh của bạn gọi tên; rủi ro High phải có test trên tầng Unit</td><td>10</td></tr>
<tr><td>E</td><td>kế hoạch có Scope, Risks, Approach, Entry criteria, Exit criteria, Traceability, Definition of done, và gọi tên mọi mã rủi ro High</td><td>10</td></tr>
<tr><td>F</td><td>actionlint (2) · luật Lab 9 (2) · ci-ok cần job đột biến (3) và job báo cáo có <code>shell: bash</code> (3)</td><td>10</td></tr>
</tbody></table>`;

const BUGS_EN = `<table>
<thead><tr><th>#</th><th>Where</th><th>What a user would suffer</th></tr></thead>
<tbody>
<tr><td>1</td><td>rule</td><td>an admin cannot free a lab inside the last hour</td></tr>
<tr><td>2</td><td>rule</td><td>any lecturer can cancel any student’s booking</td></tr>
<tr><td>3</td><td>rule</td><td>a 09:00 booking can still be cancelled at 15:00 (start read as UTC)</td></tr>
<tr><td>4</td><td>memory repo</td><td>a freed slot cannot be booked again</td></tr>
<tr><td>5</td><td>service</td><td>two clicks at the same moment both report success</td></tr>
<tr><td>6</td><td>schema</td><td>on PostgreSQL the freed slot stays blocked (the constraint lost its WHERE)</td></tr>
<tr><td>7</td><td>pgRepo</td><td>dates arrive as JS Dates; every cancel says TOO_LATE</td></tr>
<tr><td>8</td><td>pgRepo</td><td>the UPDATE is not atomic: two cancels both win</td></tr>
<tr><td>9</td><td>API</td><td>every student sees everyone’s bookings</td></tr>
<tr><td>10</td><td>API</td><td>“too late” answered 409, not 422</td></tr>
<tr><td>11</td><td>screen</td><td>other rows can be cancelled while one request runs</td></tr>
<tr><td>12</td><td>client</td><td>a wrong URL: every cancel says “Cannot reach the server”</td></tr>
</tbody></table>`;
const BUGS_VI = `<table>
<thead><tr><th>#</th><th>Ở đâu</th><th>Người dùng phải chịu gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>luật</td><td>admin không giải phóng được phòng trong giờ cuối</td></tr>
<tr><td>2</td><td>luật</td><td>giảng viên nào cũng huỷ được lượt của bất kỳ sinh viên nào</td></tr>
<tr><td>3</td><td>luật</td><td>lượt 09:00 vẫn huỷ được lúc 15:00 (giờ bắt đầu bị đọc theo UTC)</td></tr>
<tr><td>4</td><td>repo bộ nhớ</td><td>khung vừa trống không đặt lại được</td></tr>
<tr><td>5</td><td>service</td><td>hai cú bấm cùng lúc đều báo thành công</td></tr>
<tr><td>6</td><td>schema</td><td>trên PostgreSQL khung đã huỷ vẫn bị chặn (ràng buộc mất WHERE)</td></tr>
<tr><td>7</td><td>pgRepo</td><td>ngày về thành JS Date; lượt huỷ nào cũng báo TOO_LATE</td></tr>
<tr><td>8</td><td>pgRepo</td><td>UPDATE không nguyên tử: hai lượt huỷ cùng thắng</td></tr>
<tr><td>9</td><td>API</td><td>sinh viên nào cũng thấy lượt đặt của mọi người</td></tr>
<tr><td>10</td><td>API</td><td>“quá giờ huỷ” trả 409 thay vì 422</td></tr>
<tr><td>11</td><td>màn hình</td><td>các dòng khác vẫn huỷ được khi một request đang chạy</td></tr>
<tr><td>12</td><td>client</td><td>sai URL: lượt huỷ nào cũng báo “Cannot reach the server”</td></tr>
</tbody></table>`;

const CV_EN = `<table>
<thead><tr><th>Weak</th><th>Strong (every number re-runnable)</th></tr></thead>
<tbody>
<tr><td>Wrote unit and E2E tests with Vitest and Playwright.</td><td>Tested one feature at five layers; of 12 planted bugs no layer caught more than 6, and PostgreSQL tests caught 3 no other layer saw.</td></tr>
<tr><td>Achieved high test coverage.</td><td>Kept the mutation score at 99.08% (433 mutants) and raised the CI coverage thresholds from 85/80/80/85 to 97/91/96/97.</td></tr>
</tbody></table>`;
const CV_VI = `<table>
<thead><tr><th>Yếu</th><th>Mạnh (con số nào cũng chạy lại được)</th></tr></thead>
<tbody>
<tr><td>Viết unit test và E2E test bằng Vitest và Playwright.</td><td>Test một tính năng ở năm tầng; trong 12 bug cài vào không tầng nào bắt quá 6, và test PostgreSQL bắt 3 bug không tầng nào khác thấy.</td></tr>
<tr><td>Đạt độ phủ test cao.</td><td>Giữ điểm đột biến 99,08% (433 đột biến) và nâng ngưỡng độ phủ trong CI từ 85/80/80/85 lên 97/91/96/97.</td></tr>
</tbody></table>`;

const QA_EN = `<table>
<thead><tr><th>They ask</th><th>You answer</th></tr></thead>
<tbody>
<tr><td>Isn’t E2E enough?</td><td>I measured it: 12 planted bugs, E2E caught 2. Three only the PostgreSQL tests saw.</td></tr>
<tr><td>Why mutation testing?</td><td>Coverage says a line ran; mutation says a test noticed it change. 99.08% measured, 95% is the floor.</td></tr>
<tr><td>A flaky test you fixed?</td><td>A renamed test got a new id and its lab code collided with another test’s — 900 codes for 25 tests is about a 28% chance. Now 608,400 codes and a script that lists duplicates.</td></tr>
</tbody></table>`;
const QA_VI = `<table>
<thead><tr><th>Họ hỏi</th><th>Bạn trả lời</th></tr></thead>
<tbody>
<tr><td>E2E chưa đủ à?</td><td>Em đã đo: 12 bug cài vào, E2E bắt 2. Ba bug chỉ test PostgreSQL thấy.</td></tr>
<tr><td>Sao cần mutation testing?</td><td>Độ phủ nói một dòng đã chạy; đột biến nói test có nhận ra nó đổi không. Đo được 99,08%, sàn là 95%.</td></tr>
<tr><td>Một test chập chờn em đã sửa?</td><td>Đổi tên một test làm đổi id, mã phòng của nó trùng với test khác — 900 mã cho 25 test thì xác suất khoảng 28%. Giờ là 608.400 mã và một script liệt kê mã trùng.</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('⭐', 'Wikipedia — Situation, task, action, result (STAR)', 'The answer format behind the CV section.', 'https://en.wikipedia.org/wiki/Situation,_task,_action,_result'),
  nguon('📊', 'Google Testing Blog — Code coverage best practices', 'Why coverage is a floor, not a goal.', 'https://testing.googleblog.com/2020/08/code-coverage-best-practices.html'),
].join('\n');

export default {
  title: '11.5 — Final project: US-11, graded out of 100|||11.5 — Dự án cuối khoá: US-11, chấm trên thang 100',
  slug: 'tst-11-5-du-an-cuoi-khoa',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án cuối khoá: US-11 "My bookings" của LabFlow Lite — kế hoạch test, test ở năm tầng, pipeline — nộp tám file và chấm bằng một lệnh: node scripts/cham-cuoi-khoa.mjs, 100 điểm (xanh trên code đúng 20, 12 bug cài vào 36, độ phủ + đột biến 14, truy vết 10, kế hoạch 10, CI 10; đạt 70, giỏi 85). Lần thử đầu xanh hết mà chỉ 42/100 (bắt 2/12 bug: chỉ kiểm mã trạng thái, test cái mock, tên "should work", không mã yêu cầu, kế hoạch thiếu tiêu chí ra, pipeline Chương 9), đọc từng dòng; bản tham khảo 100/100. Rồi cách kể dự án trong CV và phỏng vấn theo STAR với số đo tự tái hiện được: dòng CV yếu và mạnh, bản nói 60 giây, câu hỏi vặn, điều không được khoe, khung README.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5 · Final project</span>
<h2>Final project: US-11, graded out of 100</h2>
<p class="lead">Lessons 11.1–11.4 built one feature the way a careful team would. Now you write the tests yourself, from empty files to a green <code>ci-ok</code>, and one command scores the result against bugs you have never seen.</p>
<p><strong>After this lesson you can</strong> hand in a test plan, tests at five layers and a pipeline for a real feature; read a grader’s report and know which test is missing; and describe the project on a CV and in an interview with numbers anybody can re-run. <strong>Why it is useful:</strong> “show me a project you tested” decides internship interviews, and a repo with a measured plan and one required check answers it better than a certificate.</p>
${FLOW_EN}

<h3>The brief</h3>
<p>LabFlow Lite 1.1 adds <strong>US-11 “My bookings”</strong>: a student lists their own bookings and cancels one, until 60 minutes before the start in Viet Nam time (Lite-3). The code is in the project; your job is everything that proves it works. Slide 3 lists the six acceptance criteria of <code>test-plan/requirements.json</code>: AC1 only my bookings, AC2 the 60-minute limit, AC3 404 for someone else’s booking, AC4 one success for two cancels, AC5 a freed slot can be booked again, AC6 admins at any time.</p>
<p>AC1, AC2, AC3, AC5 and Lite-3 are High risk, so each needs a passing test <em>above</em> the Unit layer — the rule of the plan in 11.1.</p>

<h3>What you hand in, and how to grade it</h3>
<p>Eight files: six tests — <code>src/rules/cancel.test.js</code>, <code>src/booking/myBookings.test.js</code>, <code>src/api/myBookings.test.js</code>, <code>test/integration/myBookings.int.test.js</code>, <code>web/MyBookings.test.jsx</code>, <code>e2e/huy-phong.spec.js</code> — plus <code>test-plan/TEST-PLAN.md</code> and <code>.github/workflows/test.yml</code>.</p>
${ma('bash', SETUP)}
<p>The grader needs Docker (or a <code>TEST_DATABASE_URL</code>), Chromium and <code>actionlint</code>, and takes about one to one and a half minutes. Your tests run against the team’s code, then against twelve bugs planted one at a time; every file is put back in <code>finally</code>.</p>

<h3>The rubric: 100 points, pass 70</h3>
${RUBRIC_EN}
<p>Green is worth 20; catching bugs is worth 36. 85 or more is excellent.</p>

<h3>The twelve planted bugs</h3>
<p>Each is one believable change in <code>capstone/mutants.mjs</code>, spread over every layer:</p>
${BUGS_EN}
<p>Run through the reference tests (11.1), Unit caught 5, API 6, UI 1, DB 4, E2E 2: no layer saw more than half.</p>

<h3>The first attempt: everything green, 42/100</h3>
<p><code>capstone/yeu/</code> holds a realistic weak attempt — a test in every file, all passing. All four layers are green (20/20), and almost nothing else:</p>
${ra(YEU)}
<ul>
<li><strong>B 6/36.</strong> #3 dies by luck (its one “late” test sits 30 minutes before the start); #12 because the browser test waits for a success message.</li>
<li><strong>Status-only asserts</strong> let #9 (everyone’s bookings) and #10 (409 for 422) live:</li>
</ul>
${ma('javascript', WEAK_API)}
<ul>
<li><strong>Testing the mock:</strong> the screen test proves the stub was called, never what the screen shows — #11 lives:</li>
</ul>
${ma('javascript', WEAK_WEB)}
<ul>
<li><strong>The database test</strong> only checks <code>lab</code>, which stays right even when dates come back as JS Dates; no cancel, no race, no rebooking — #6, #7, #8 live.</li>
<li><strong>C:</strong> coverage 0/6 — the thin tests leave parts of the cancel code unrun, below the 11.4 ratchet. Mutation still 8/8: Stryker scores all of <code>src/rules</code>, where the course’s strong tests carry it — a folder-wide score can hide one weak file, which is why part B exists.</li>
<li><strong>D 0/10:</strong> “should work”, “cancel works” — no ids, so nothing is traced. <strong>E 4/10:</strong> the plan has Scope, Risks and Approach only and names no requirement. <strong>F 4/10:</strong> the Chapter 9 workflow — valid and safe, but no mutation job and no report.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Green is not graded.</strong> Every test of the weak attempt passes, and ten of twelve real bugs walk through it. Before you call a test done, name the bug that turns it red. If you cannot, it is decoration.</div>

<h3>The reference: 100/100</h3>
${ra(REF)}
<p>Only the DB, UI and E2E kills are shown; the other seven were killed by Unit + API. PostgreSQL killed three that nothing else saw, the screen one, the browser journey one: every layer earned its place.</p>

<h3>Hints — open one at a time</h3>
<ol>
<li>Start from the criteria: one test per AC, its name ending with the id, e.g. <code>(AC4)</code>. Never a range on a describe.</li>
<li>For each assertion, name the bug it kills. Compare whole bodies with <code>toEqual</code> and check them against <code>openapi.json</code>.</li>
<li>Rule: a decision table (owner, other student, lecturer, admin × active or cancelled × 60 or 59 minutes). PostgreSQL: read your row back in the exact shape (<code>'2026-11-16'</code>, <code>'09:00'</code>); cancel twice at once on two warm connections; cancel, then book the slot again.</li>
<li>Screen: check what the user sees after the click; one browser journey with dates relative to today and a <code>freshLab</code> code. Then copy the plan headings of 11.1 and the workflow of 11.4.</li>
</ol>
<p><strong>Done when</strong> the grader prints 70 or more (aim for 85), the four suites are green from a fresh <code>npm ci</code>, there is no real clock, fixed date, fixed lab code, <code>.only</code> or retry hiding a red test — and every number in your plan was measured on your machine.</p>
<p><strong>Stretch:</strong> do the same for one feature of your SWP391 or SEP490 project — criteria with ids, rated risks, a measured pyramid, three bugs planted by hand.</p>

<h3>Talking about it: CV and interview</h3>
<p>Use <strong>STAR</strong>:</p>
<ul>
<li><strong>Situation</strong> — LabFlow Lite, students book lab rooms; release 1.1 adds cancelling.</li>
<li><strong>Task</strong> — ship it safely: six acceptance criteria, a 60-minute rule in Viet Nam time, privacy between students.</li>
<li><strong>Action</strong> — a risk-based plan with a measured budget, tests at five layers, a traceability matrix from real reports, one required check <code>ci-ok</code> in front of everything.</li>
<li><strong>Result</strong> — all 12 planted bugs caught, no layer more than 6; mutation 99.08% on 433 mutants; a mutant alive only in Ha Noi time (97.73% vs 100% in UTC), a rule the API never enforced (LF-301), and a flaky test traced to a hash collision.</li>
</ul>
${CV_EN}
<p><strong>The 60-second version</strong>, said out loud: <em>“In my testing course I took one feature of a lab-booking app — cancelling a booking — and tested it like a team would. I started from risks: six acceptance criteria, four of them high risk. I planted twelve realistic bugs and measured which layer catches which: none caught more than six, and three only showed on a real PostgreSQL — the driver turned dates into JavaScript Dates, so every cancel said ‘too late’. Everything runs behind one required check in GitHub Actions, including mutation testing at 99 percent and a gate that fails when a requirement has no test. Building that gate found a rule the API had never enforced.”</em></p>
${QA_EN}
<div class="pitfall co-tieu-de"><strong>Do not claim what you cannot re-run.</strong> “100% coverage” is not an achievement — lesson 8.2 measured a 100%-coverage suite that killed 41.49% of mutants. Do not round 99.08% up, do not say you “found” a bug you planted, and do not quote a number your repository cannot reproduce with one command.</div>
<p>Your portfolio README answers in this order: <strong>what it is</strong> (one line) · <strong>how it is tested</strong> (the layer table: Unit+API 299, UI 24, DB 19, E2E 8) · <strong>what the tests caught</strong> (the 12-bug matrix, with the command that reproduces it) · <strong>quality bars</strong> (97/91/96/97, mutation 99.08%, ci-ok) · <strong>how to run it</strong> · <strong>what I learned</strong> (three bullets, each with a number).</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">capstone (dự án cuối khoá)</span><span class="v">One project that uses every skill of the course on a real feature.</span></div>
  <div class="kv"><span class="k">grader (máy chấm)</span><span class="v">Runs your tests on correct code, then on planted bugs, and scores them.</span></div>
  <div class="kv"><span class="k">STAR (bối cảnh – nhiệm vụ – hành động – kết quả)</span><span class="v">Telling one piece of work so the result and your part are clear.</span></div>
  <div class="kv"><span class="k">reproducible number (con số tái hiện được)</span><span class="v">A figure anyone gets again with one command in your repository.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Eight files — six test files, the plan, the workflow — graded out of 100 by one command.</li>
<li>Green earns 20, catching the 12 planted bugs 36: a suite that never fails cannot pass.</li>
<li>The weak attempt was all green and scored 42; the reference scored 100 with every layer killing a bug.</li>
<li>On a CV: STAR, numbers you can re-run, what the tests caught — never “100% coverage”.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'software-development-project', bai: 'swp391-5-1-testing-bug-tracking', title: 'Academy SWP391 — 5.1: testing in the project, quality level Q', sub: 'Same: test results decide how a screen is graded, bugs are logged as Defect or Leakage. Deeper here: one feature tested at five layers, scored by a grader against planted bugs.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'api-design', bai: 'api-12-4-tong-ket', title: 'API Design course — 12.4: review, documentation and the interview story', sub: 'The API capstone told with STAR as well — design decisions there, test evidence here.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5 · Dự án cuối khoá</span>
<h2>Dự án cuối khoá: US-11, chấm trên thang 100</h2>
<p class="lead">Bài 11.1–11.4 đã dựng một tính năng theo cách một đội cẩn thận sẽ làm. Giờ bạn tự viết test, từ file trống tới một <code>ci-ok</code> xanh, và một lệnh chấm kết quả bằng những bug bạn chưa từng thấy.</p>
<p><strong>Sau bài này bạn có thể</strong> nộp kế hoạch test, test ở năm tầng và pipeline cho một tính năng thật; đọc báo cáo của máy chấm và biết thiếu test nào; và kể dự án trong CV, trong phỏng vấn bằng những con số ai cũng chạy lại được. <strong>Vì sao hữu ích:</strong> “cho tôi xem một dự án bạn đã test” quyết định buổi phỏng vấn thực tập, và một repo có kế hoạch được đo cùng một check bắt buộc trả lời câu đó tốt hơn mọi chứng chỉ.</p>
${FLOW_VI}

<h3>Đề bài</h3>
<p>LabFlow Lite 1.1 thêm <strong>US-11 “My bookings”</strong>: sinh viên xem các lượt đặt của mình và huỷ một lượt, tới 60 phút trước giờ bắt đầu theo giờ Việt Nam (Lite-3). Code đã có trong dự án; việc của bạn là mọi thứ chứng minh nó chạy đúng. Slide 3 liệt kê sáu tiêu chí chấp nhận của <code>test-plan/requirements.json</code>: AC1 chỉ lượt của tôi, AC2 giới hạn 60 phút, AC3 404 cho lượt của người khác, AC4 hai lượt huỷ chỉ một thành công, AC5 khung đã trống đặt lại được, AC6 admin huỷ lúc nào cũng được.</p>
<p>AC1, AC2, AC3, AC5 và Lite-3 rủi ro High, nên mỗi cái cần một test xanh ở <em>trên</em> tầng Unit — luật của kế hoạch ở 11.1.</p>

<h3>Nộp gì, và chấm thế nào</h3>
<p>Tám file: sáu file test — <code>src/rules/cancel.test.js</code>, <code>src/booking/myBookings.test.js</code>, <code>src/api/myBookings.test.js</code>, <code>test/integration/myBookings.int.test.js</code>, <code>web/MyBookings.test.jsx</code>, <code>e2e/huy-phong.spec.js</code> — cùng <code>test-plan/TEST-PLAN.md</code> và <code>.github/workflows/test.yml</code>.</p>
${ma('bash', SETUP)}
<p>Máy chấm cần Docker (hoặc <code>TEST_DATABASE_URL</code>), Chromium và <code>actionlint</code>, chạy mất chừng một tới một phút rưỡi. Test của bạn chạy trên code của nhóm, rồi trên mười hai bug cài từng con một; mọi file được trả lại trong <code>finally</code>.</p>

<h3>Thang chấm: 100 điểm, đạt 70</h3>
${RUBRIC_VI}
<p>Xanh đáng 20; bắt bug đáng 36. Từ 85 trở lên là giỏi.</p>

<h3>Mười hai bug cài vào</h3>
<p>Mỗi bug là một thay đổi rất có thể xảy ra trong <code>capstone/mutants.mjs</code>, rải khắp các tầng:</p>
${BUGS_VI}
<p>Chạy qua bộ test tham khảo (11.1): Unit bắt 5, API 6, UI 1, DB 4, E2E 2 — không tầng nào thấy quá một nửa.</p>

<h3>Lần thử đầu: xanh hết, 42/100</h3>
<p><code>capstone/yeu/</code> chứa một lần thử yếu rất thật — file nào cũng có test, tất cả đều xanh. Cả bốn tầng xanh (20/20), và gần như không còn gì khác:</p>
${ra(YEU)}
<ul>
<li><strong>B 6/36.</strong> #3 chết nhờ may (test “trễ” duy nhất đứng 30 phút trước giờ bắt đầu); #12 vì test trình duyệt chờ một thông báo thành công.</li>
<li><strong>Chỉ kiểm mã trạng thái</strong> nên #9 (thấy lượt của mọi người) và #10 (409 thay 422) sống:</li>
</ul>
${ma('javascript', WEAK_API)}
<ul>
<li><strong>Test cái mock:</strong> test màn hình chứng minh stub đã được gọi, không bao giờ nhìn màn hình hiện gì — #11 sống:</li>
</ul>
${ma('javascript', WEAK_WEB)}
<ul>
<li><strong>Test CSDL</strong> chỉ kiểm <code>lab</code>, thứ vẫn đúng kể cả khi ngày về thành JS Date; không huỷ, không đua, không đặt lại — #6, #7, #8 sống.</li>
<li><strong>C:</strong> độ phủ 0/6 — test mỏng để lại nhiều phần của code huỷ chưa chạy, dưới “bánh cóc” (ratchet) của 11.4. Đột biến vẫn 8/8: Stryker chấm cả <code>src/rules</code>, nơi bộ test mạnh của khoá gánh điểm — điểm trên cả thư mục có thể giấu một file yếu, nên mới có phần B.</li>
<li><strong>D 0/10:</strong> “should work”, “cancel works” — không mã yêu cầu, nên không truy vết được gì. <strong>E 4/10:</strong> kế hoạch chỉ có Scope, Risks, Approach và không gọi tên yêu cầu nào. <strong>F 4/10:</strong> workflow của Chương 9 — hợp lệ và an toàn, nhưng không có job đột biến, không có báo cáo.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Xanh thì không được chấm điểm.</strong> Mọi test của lần thử yếu đều qua, và mười trên mười hai bug thật đi xuyên qua nó. Trước khi coi một test là xong, hãy gọi tên bug làm nó đỏ. Không gọi tên được thì test đó chỉ là đồ trang trí.</div>

<h3>Bản tham khảo: 100/100</h3>
${ra(REF)}
<p>Chỉ hiện các dòng diệt bởi DB, UI và E2E; bảy bug còn lại do Unit + API diệt. PostgreSQL diệt ba bug không gì khác thấy, màn hình một, hành trình trình duyệt một: tầng nào cũng xứng đáng có mặt.</p>

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Bắt đầu từ tiêu chí: mỗi AC một test, tên kết thúc bằng mã, ví dụ <code>(AC4)</code>. Không bao giờ ghi một khoảng ở describe.</li>
<li>Với mỗi phép khẳng định, gọi tên bug nó diệt. So cả body bằng <code>toEqual</code> và đối chiếu <code>openapi.json</code>.</li>
<li>Luật: bảng quyết định (chủ lượt, sinh viên khác, giảng viên, admin × còn hiệu lực hay đã huỷ × còn 60 hay 59 phút). PostgreSQL: đọc lại dòng của bạn đúng dạng (<code>'2026-11-16'</code>, <code>'09:00'</code>); huỷ hai lần cùng lúc trên hai kết nối đã mở; huỷ rồi đặt lại khung đó.</li>
<li>Màn hình: kiểm thứ người dùng thấy sau cú bấm; một hành trình trình duyệt với ngày tính từ hôm nay và mã <code>freshLab</code>. Rồi chép tiêu đề kế hoạch của 11.1 và workflow của 11.4.</li>
</ol>
<p><strong>Xong khi</strong> máy chấm in từ 70 trở lên (nhắm 85), bốn bộ test xanh sau một lần <code>npm ci</code> mới, không còn đồng hồ thật, ngày cố định, mã phòng cố định, <code>.only</code> hay retry che test đỏ — và mọi con số trong kế hoạch là đo trên máy bạn.</p>
<p><strong>Nâng cao:</strong> làm y như vậy cho một tính năng trong đồ án SWP391 hay SEP490 của bạn — tiêu chí có mã, rủi ro được chấm, kim tự tháp được đo, ba bug tự tay cài.</p>

<h3>Kể về dự án: CV và phỏng vấn</h3>
<p>Dùng <strong>STAR</strong>:</p>
<ul>
<li><strong>Situation (bối cảnh)</strong> — LabFlow Lite, sinh viên đặt phòng lab; bản 1.1 thêm tính năng huỷ.</li>
<li><strong>Task (nhiệm vụ)</strong> — đưa nó ra an toàn: sáu tiêu chí chấp nhận, luật 60 phút theo giờ Việt Nam, quyền riêng tư giữa sinh viên.</li>
<li><strong>Action (hành động)</strong> — kế hoạch dựa trên rủi ro với ngân sách đo được, test ở năm tầng, ma trận truy vết từ báo cáo thật, một check bắt buộc <code>ci-ok</code> đứng trước tất cả.</li>
<li><strong>Result (kết quả)</strong> — bắt đủ 12 bug cài vào, không tầng nào quá 6; đột biến 99,08% trên 433 đột biến; một đột biến chỉ sống theo giờ Hà Nội (97,73% so với 100% ở UTC), một luật API chưa bao giờ áp (LF-301), và một test chập chờn lần ra là do va chạm hàm băm.</li>
</ul>
${CV_VI}
<p><strong>Bản nói 60 giây</strong>, tập nói thành tiếng: <em>“Trong khoá testing, em lấy một tính năng của app đặt phòng lab — huỷ lượt đặt — và test nó như một đội thật. Em bắt đầu từ rủi ro: sáu tiêu chí chấp nhận, bốn cái rủi ro cao. Em cài mười hai bug rất thật và đo tầng nào bắt bug nào: không tầng nào quá sáu, và ba bug chỉ lộ ra trên PostgreSQL thật — driver biến ngày thành Date của JavaScript, nên lượt huỷ nào cũng báo ‘quá giờ’. Tất cả chạy sau một check bắt buộc trên GitHub Actions, gồm cả mutation testing ở mức 99 phần trăm và một cổng đỏ khi có yêu cầu chưa có test. Lúc dựng cái cổng đó em tìm ra một luật mà API chưa bao giờ áp.”</em></p>
${QA_VI}
<div class="pitfall co-tieu-de"><strong>Đừng khoe thứ bạn không chạy lại được.</strong> “Độ phủ 100%” không phải thành tích — bài 8.2 đo một bộ test phủ 100% mà chỉ diệt 41,49% đột biến. Đừng làm tròn 99,08% lên, đừng nói “tìm ra” bug do chính bạn cài, và đừng đưa con số mà repo không tái hiện được bằng một lệnh.</div>
<p>README của repo portfolio trả lời theo thứ tự: <strong>nó là gì</strong> (một dòng) · <strong>được test thế nào</strong> (bảng tầng: Unit+API 299, UI 24, DB 19, E2E 8) · <strong>test bắt được gì</strong> (ma trận 12 bug, kèm lệnh tái hiện) · <strong>mức chất lượng</strong> (97/91/96/97, đột biến 99,08%, ci-ok) · <strong>cách chạy</strong> · <strong>điều đã học</strong> (ba gạch đầu dòng, mỗi dòng một con số).</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">capstone (dự án cuối khoá)</span><span class="v">Một dự án dùng mọi kỹ năng của khoá trên một tính năng thật.</span></div>
  <div class="kv"><span class="k">grader (máy chấm)</span><span class="v">Chạy test của bạn trên code đúng, rồi trên bug cài vào, và cho điểm.</span></div>
  <div class="kv"><span class="k">STAR (bối cảnh – nhiệm vụ – hành động – kết quả)</span><span class="v">Cách kể một việc để kết quả và phần của bạn hiện rõ.</span></div>
  <div class="kv"><span class="k">reproducible number (con số tái hiện được)</span><span class="v">Con số ai cũng lấy lại được bằng một lệnh trong repo của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tám file — sáu file test, kế hoạch, workflow — được một lệnh chấm trên thang 100.</li>
<li>Xanh được 20, bắt 12 bug cài vào được 36: bộ test không bao giờ đỏ thì không thể đạt.</li>
<li>Lần thử yếu xanh hết và được 42; bản tham khảo được 100, tầng nào cũng diệt một bug.</li>
<li>Trong CV: STAR, con số chạy lại được, test đã bắt được gì — không bao giờ “độ phủ 100%”.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'software-development-project', bai: 'swp391-5-1-testing-bug-tracking', title: 'Academy SWP391 — 5.1: kiểm thử trong đồ án, mức chất lượng Q', sub: 'Giống: kết quả test quyết định một màn hình được chấm thế nào, bug ghi nhãn Defect hay Leakage. Sâu thêm ở đây: một tính năng test ở năm tầng, chấm bằng máy chấm với bug cài vào.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'api-design', bai: 'api-12-4-tong-ket', title: 'Khoá API Design — 12.4: rà soát, tài liệu và câu chuyện phỏng vấn', sub: 'Dự án cuối khoá API cũng kể theo STAR — ở đó là quyết định thiết kế, ở đây là bằng chứng test.', cta: 'MỞ BÀI →' })}
</div>
`,
};
