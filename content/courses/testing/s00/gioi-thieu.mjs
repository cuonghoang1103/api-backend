/**
 * Testing · Mục 0 · 0.1 — Về khoá học: dự án LabFlow Lite, lộ trình, điều kiện, công cụ. BÀI MỚI 31/10/2026 (slug tst-0-3-gioi-thieu-du-an,
 * khung cũ không có bài giới thiệu khoá/dự án — thêm để Mục 0 trả lời đủ "khoá là gì, làm được gì, cần gì trước, lộ trình").
 * Output: chạy thật Node 22.23.3. Phiên bản: npm view / --version 31/10/2026.
 */
import G from '../giang/tst-00-3.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';

const M = {
  tuKiem: `
const bookings = [
  { lab: 'BE-201', minutes: 120 },
  { lab: 'BE-305', minutes: 90 },
];
const total = bookings.map((b) => b.minutes).reduce((a, m) => a + m, 0);
const allShort = bookings.every((b) => b.minutes <= 240);
const { lab } = bookings[1];
console.log(total, allShort, lab);
try {
  JSON.parse('{oops');
} catch (err) {
  console.log(err.name);
}
`,
  tuKiemOut: `
$ node tu-kiem.js
210 true BE-305
SyntaxError
`,
  cay: `
labflow-lite/
├─ package.json, vitest.config.js
├─ src/rules/time.js, booking.js     ← Chương 1–2: luật nghiệp vụ (hàm thuần)
├─ src/app.js, src/routes/           ← Chương 5: API Express 5
├─ src/db/                           ← Chương 4: PostgreSQL
├─ web/                              ← Chương 6: màn hình React
├─ e2e/                              ← Chương 7: Playwright
├─ scripts/dot-bien.mjs              ← Lab 1: kiểm bộ test bằng đột biến
└─ .github/workflows/test.yml        ← Chương 9: CI
`,
};

const BANG_LUAT_EN = `<table>
<thead><tr><th>Rule</th><th>What it says</th><th>Function you will test</th><th>Source</th></tr></thead>
<tbody>
<tr><td>BR-04</td><td>Bookings sit on a 30-minute grid inside opening hours 07:00–21:00</td><td><code>checkSlot(start, end)</code></td><td>LabFlow Demo</td></tr>
<tr><td>BR-05</td><td>At most 14 days in advance; exactly 14 is still valid</td><td><code>isWithinBookingWindow(daysAhead)</code></td><td>LabFlow Demo</td></tr>
<tr><td>BR-06</td><td>A lab booking for more than 30 seats needs approval</td><td><code>needsApproval({ seats, role })</code></td><td>LabFlow Demo</td></tr>
<tr><td>Lite-1</td><td>One booking lasts at most 4 hours</td><td><code>checkSlot</code> → <code>TOO_LONG</code></td><td>simplified for this course</td></tr>
<tr><td>Lite-2</td><td>Lecturers and admins never need approval</td><td><code>needsApproval</code></td><td>simplified for this course</td></tr>
<tr><td>Later</td><td>No overlap in one lab · lock after 5 failed logins (BR-02) · cancel at least 1 hour before</td><td>Chapters 2, 4, 5</td><td>LabFlow + Lite</td></tr>
</tbody>
</table>`;

const BANG_LUAT_VI = `<table>
<thead><tr><th>Luật</th><th>Nội dung</th><th>Hàm bạn sẽ test</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td>BR-04</td><td>Lượt đặt nằm trên lưới 30 phút, trong giờ mở cửa 07:00–21:00</td><td><code>checkSlot(start, end)</code></td><td>LabFlow Demo</td></tr>
<tr><td>BR-05</td><td>Đặt trước tối đa 14 ngày; đúng 14 ngày vẫn hợp lệ</td><td><code>isWithinBookingWindow(daysAhead)</code></td><td>LabFlow Demo</td></tr>
<tr><td>BR-06</td><td>Đặt phòng trên 30 chỗ thì cần duyệt</td><td><code>needsApproval({ seats, role })</code></td><td>LabFlow Demo</td></tr>
<tr><td>Lite-1</td><td>Một lượt đặt dài tối đa 4 giờ</td><td><code>checkSlot</code> → <code>TOO_LONG</code></td><td>đơn giản hoá cho khoá học</td></tr>
<tr><td>Lite-2</td><td>Giảng viên và admin không bao giờ cần duyệt</td><td><code>needsApproval</code></td><td>đơn giản hoá cho khoá học</td></tr>
<tr><td>Về sau</td><td>Không trùng giờ trong một phòng · khoá tài khoản sau 5 lần sai mật khẩu (BR-02) · huỷ trước ít nhất 1 giờ</td><td>Chương 2, 4, 5</td><td>LabFlow + Lite</td></tr>
</tbody>
</table>`;

export default {
  title: '0.1 — About this course: the project you will test, the roadmap, what you need|||0.1 — Về khoá học: dự án bạn sẽ test, lộ trình, và cần biết gì trước',
  slug: 'tst-0-3-gioi-thieu-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Học xong làm được gì; dự án xuyên khoá LabFlow Lite (API đặt phòng lab, dùng đúng luật BR-04/05/06 của LabFlow Demo SWT301) và vì sao chọn nó thay vì Notes API; lộ trình 12 phần; tự kiểm điều kiện đầu vào; công cụ và phiên bản đứng sau mọi output.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About this course: the project you will test, the roadmap, and what you need</h2>
<p class="lead">This course takes you from your first <code>expect</code> to a test suite a team can trust — on one real project you grow chapter by chapter. This lesson describes that project, the result you walk away with, the full map, and the small set of things you need before starting.</p>

<h3>What you walk away with</h3>
<p>Not a certificate — a repository. At the end you own <strong>labflow-lite</strong>: a small lab-booking system with unit tests for its business rules, integration tests against a real PostgreSQL, API tests through Express, component tests for its React screens, Playwright end-to-end tests for the booking journey, a coverage report you know how to read, and a GitHub Actions workflow that blocks merges when anything is red. Along the way you also prove your own tests are good: in Lab 1 a script plants eight bugs into the code, and a good suite must turn red for all eight.</p>
<p>The skills behind it, in the order you build them:</p>
<ul>
<li>Write clear unit tests with Vitest — and, more importantly, choose <em>which values</em> to test (boundaries, decision tables, properties).</li>
<li>Test asynchronous code, time and error paths without flaky results.</li>
<li>Replace a dependency with a fake only when it helps — and recognise when a mock makes a test worthless.</li>
<li>Run integration tests against a real database that is created and thrown away for each run.</li>
<li>Test an HTTP API from the outside: status codes, validation, 401 vs 403, contracts.</li>
<li>Test UI the way users use it, and full flows in a real browser.</li>
<li>Read coverage honestly, hunt flaky tests, and run everything in CI.</li>
</ul>

<h3>The project: LabFlow Lite</h3>
<p>LabFlow Lite is a cut-down version of the lab-booking system you meet in SWT301 Lab 2 (the LabFlow Demo) and in your graduation project. It has four layers — React screens, an Express 5 API, the business rules as pure functions, and PostgreSQL. You begin with the rules alone, because they hold the logic most worth testing and they are the cheapest to test.</p>
${BANG_LUAT_EN}
<p>The rules marked <strong>Lite</strong> are honest simplifications for teaching; BR-02/04/05/06 use the same numbers as the LabFlow Demo. Here is the final shape of the repository — each chapter adds one folder:</p>
${ma('text', M.cay)}

<h3>Why LabFlow Lite and not the Notes API from the Node.js course?</h3>
<p>The Node.js course builds a Notes API — a fine way to learn Express. But a notes service is mostly create, read, update, delete, with very few business rules, so its unit tests are thin. Testing is learned on <em>rules</em>: grids, windows, limits and roles are exactly where boundary value analysis and decision tables earn their keep. LabFlow Lite gives you those rules, and they are the same rules as your SWT301 lab and your graduation project, so every test idea here pays off three times. If you already built the Notes API, nothing is lost: every technique transfers unchanged, and Chapter 5 points out how.</p>

<h3>The roadmap — 12 parts</h3>
<table>
<thead><tr><th>Part</th><th>You learn</th><th>Your repository gains</th></tr></thead>
<tbody>
<tr><td>0 · Start here</td><td>What testing is, the test pyramid, Vitest setup</td><td>the project skeleton and a first green test</td></tr>
<tr><td>1 · First unit tests</td><td>Arrange-act-assert, matchers, naming, boundary values, decision tables, property-based testing</td><td>a rules suite; Lab 1 kills 8 planted bugs</td></tr>
<tr><td>2 · Async, time and errors</td><td>Promises, fake timers, dates and time zones, randomness</td><td>cancellation deadline, login lock-out</td></tr>
<tr><td>3 · Test doubles</td><td>Stub, mock, spy, fake — and when not to use them</td><td>a faked e-mail notifier</td></tr>
<tr><td>4 · Real database</td><td>PostgreSQL in Docker, isolation, test data factories</td><td>the no-overlap rule enforced in SQL</td></tr>
<tr><td>5 · HTTP APIs</td><td>Supertest, authentication, validation, contracts</td><td>the booking API suite</td></tr>
<tr><td>6 · React components</td><td>Testing Library, user events, screens that fetch data</td><td>booking form tests</td></tr>
<tr><td>7 · End-to-end</td><td>Playwright, locators, stability, traces</td><td>the “book a lab” journey</td></tr>
<tr><td>8 · Coverage and flaky tests</td><td>What coverage measures and hides, mutation testing, speed</td><td>a coverage report and fixes</td></tr>
<tr><td>9 · CI</td><td>GitHub Actions, required checks, matrices and shards</td><td>a green check on every pull request</td></tr>
<tr><td>10 · TDD and real teams</td><td>Red-green-refactor, legacy code, reviewing tests, interview questions</td><td>one feature built test-first</td></tr>
<tr><td>11 · Capstone</td><td>A test strategy for a whole application</td><td>LabFlow Lite, fully tested</td></tr>
</tbody>
</table>

<h3>Before you start: a two-minute self-check</h3>
<p>You need everyday JavaScript, modules (<code>import</code>/<code>export</code>), <code>try</code>/<code>catch</code>, a terminal and Node.js 22 (lesson 0.3 installs it). Read this snippet and predict the output before looking:</p>
${ma('javascript', M.tuKiem)}
${ra(M.tuKiemOut)}
<p>If you predicted <code>210 true BE-305</code> and <code>SyntaxError</code>, you are ready. If <code>reduce</code>, <code>every</code> or the <code>{ lab } = …</code> line felt foreign, spend an hour on Chapter 1 of the Node.js course first. You do <strong>not</strong> need TypeScript (optional, shown in 0.3), React (Chapter 6 starts from zero), Docker or SQL (Chapter 4 teaches what it uses), or any previous testing experience.</p>

<h3>Tools and versions</h3>
<table>
<thead><tr><th>Tool</th><th>Version used for every output</th><th>Role</th></tr></thead>
<tbody>
<tr><td>Node.js</td><td>22.23.3</td><td>Runs everything; ships <code>node:test</code></td></tr>
<tr><td>Vitest</td><td>5.0.5 (requires Node ^22.12, ^24 or ≥ 26)</td><td>The main test runner</td></tr>
<tr><td>fast-check</td><td>4.10.2</td><td>Property-based tests (lesson 1.4)</td></tr>
<tr><td>Express / Supertest</td><td>5.3.0 / 7.3.1</td><td>The API and its tests (lesson 0.2, Chapter 5)</td></tr>
<tr><td>PostgreSQL, Playwright</td><td>pinned in Chapters 4 and 7</td><td>Real database, real browser</td></tr>
</tbody>
</table>
<p>Every output in the lessons was produced by running the code (31 October 2026). Your millisecond timings will differ; the shape will not. If a newer Vitest prints something slightly different, trust your terminal and the meaning, not the exact spacing.</p>

<h3>How this course relates to SWT301 and the Node.js course</h3>
<table>
<thead><tr><th>You study…</th><th>…there</th><th>…and here</th></tr></thead>
<tbody>
<tr><td>Fundamentals, error/defect/failure</td><td>SWT301 Chapter 1 (ISTQB definitions, exam questions)</td><td>Section 0: the same ideas through real incidents and running code</td></tr>
<tr><td>Equivalence partitioning, boundary values, decision tables</td><td>SWT301 Chapter 4 (designing test cases on paper and in Report 5.1)</td><td>Lesson 1.4 and Lab 1: the same test cases written as code a machine runs</td></tr>
<tr><td>Unit tests with JUnit</td><td>SWT301 lesson 8.5 and Lab 2 (Java, LabFlow Demo)</td><td>Chapter 1 with Vitest: identical structure, different language</td></tr>
<tr><td>Test pyramid, CI</td><td>SWT301 lesson 8.6</td><td>Lesson 0.2 measured, Chapter 9 built</td></tr>
<tr><td>Testing an Express app</td><td>Node.js course Chapter 14 (one chapter, overview)</td><td>Chapters 1–9: each level in depth</td></tr>
</tbody>
</table>
<p>You do not need either of them to follow this course — it explains everything it uses.</p>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok">
<ol>
<li>Save the self-check snippet as <code>tu-kiem.js</code> in your <code>thu-test</code> folder and run <code>node tu-kiem.js</code>. Compare with the output above.</li>
<li>Change the second booking to <code>minutes: 300</code>. Predict the new line, then run.</li>
<li>In your notebook, choose your path from the previous lesson (minimum or full) and write the dates of your study sessions for the next two weeks.</li>
<li>Write one sentence: which LabFlow rule from the table do you think is easiest to get wrong, and why?</li>
</ol>
<p><strong>Done when:</strong> step 2 prints <code>420 false BE-305</code> (because 300 &gt; 240), your calendar has real dates, and your sentence names a rule and a reason (a good answer: “BR-05, because ‘at most 14’ is easy to code as <code>&lt; 14</code>”).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">business rule (BR)</span><span class="v">A rule of the domain the software must enforce, e.g. “at most 14 days ahead”.</span></div>
  <div class="kv"><span class="k">pure function</span><span class="v">A function whose result depends only on its arguments and which changes nothing outside — the easiest code to test.</span></div>
  <div class="kv"><span class="k">test suite</span><span class="v">All the tests of a project together.</span></div>
  <div class="kv"><span class="k">integration test</span><span class="v">A test where several real parts work together, e.g. the rules and PostgreSQL.</span></div>
  <div class="kv"><span class="k">end-to-end (e2e) test</span><span class="v">A test that drives the whole application in a real browser like a user.</span></div>
  <div class="kv"><span class="k">CI (continuous integration)</span><span class="v">A server that runs the test suite on every push and pull request.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 LabFlow Lite, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">React screens</span><span class="lz-lnote">Chapter 6 — Testing Library, MSW</span></div>
  <div class="lz-layer"><span class="lz-lname">Express 5 API</span><span class="lz-lnote">Chapter 5 — Supertest, contracts</span></div>
  <div class="lz-layer"><span class="lz-lname">Business rules</span><span class="lz-lnote">Chapters 1–3 — pure functions, async, doubles</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL</span><span class="lz-lnote">Chapter 4 — real database, Testcontainers</span></div>
  <div class="lz-layer"><span class="lz-lname">Whole journey in a browser</span><span class="lz-lnote">Chapter 7 — Playwright</span></div>
</div>
<div class="pitfall"><strong>Starting from the UI.</strong> Beginners often test the screen first because it is what they see. The rules are where the logic lives and where tests are cheapest — that is why LabFlow Lite starts with pure functions and adds layers one chapter at a time.</div>
<h3>📌 Summary</h3>
<ul>
<li>You finish with a repository — LabFlow Lite — tested at every level and checked by CI.</li>
<li>LabFlow Lite reuses LabFlow’s rules BR-04/05/06, so your SWT301 lab and graduation project benefit directly.</li>
<li>A rule-heavy project teaches testing better than a CRUD one; every technique still applies to the Notes API.</li>
<li>Twelve parts: start → unit → async → doubles → database → API → UI → e2e → quality → CI → teams → capstone.</li>
<li>Prerequisites: everyday JavaScript, a terminal, Node 22. Everything else is taught when used.</li>
<li>All outputs are real (Node 22.23.3, Vitest 5.0.5).</li>
</ul>
${lienKet({ bai: 'swt301-lab2-labflow-nghiep-vu', title: 'Also in SWT301 — L2.10: LabFlow Demo, the business story and the data', sub: 'Same: the LabFlow booking journey and the business rules BR-04 (30-minute grid, 07:00–21:00), BR-05 (≤ 14 days) and BR-06 (> 30 seats needs approval). Different: SWT301 tests the Java/Spring Boot LabFlow Demo with JUnit and Report 5.1; this course rebuilds a small Node version, LabFlow Lite, and tests it at every level.', cta: 'OPEN SWT301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Về khoá học: dự án bạn sẽ test, lộ trình, và cần biết gì trước</h2>
<p class="lead">Khoá này đưa bạn từ dòng <code>expect</code> đầu tiên tới một bộ test mà cả đội tin được — trên một dự án thật lớn dần theo từng chương. Bài này mô tả dự án đó, thành quả bạn mang về, bản đồ toàn khoá, và vài thứ ít ỏi bạn cần có trước khi bắt đầu.</p>

<h3>Học xong bạn mang về cái gì</h3>
<p>Không phải một tờ chứng chỉ — mà là một repository. Cuối khoá bạn sở hữu <strong>labflow-lite</strong>: một hệ thống đặt phòng lab nhỏ có unit test cho luật nghiệp vụ, test tích hợp với PostgreSQL thật, test API qua Express, test component cho màn hình React, test đầu-cuối bằng Playwright cho hành trình đặt phòng, một báo cáo độ phủ mà bạn biết cách đọc, và một workflow GitHub Actions chặn merge khi có gì đỏ. Dọc đường bạn còn tự chứng minh bộ test của mình tốt: ở Lab 1, một script cài tám lỗi vào code, và bộ test tốt phải đỏ với cả tám.</p>
<p>Các kỹ năng đứng sau nó, theo đúng thứ tự bạn xây:</p>
<ul>
<li>Viết unit test rõ ràng bằng Vitest — và quan trọng hơn, chọn được <em>giá trị nào</em> cần test (giá trị biên, bảng quyết định, thuộc tính).</li>
<li>Test code bất đồng bộ, thời gian và nhánh lỗi mà không chập chờn.</li>
<li>Thay một phụ thuộc bằng đồ giả chỉ khi nó có ích — và nhận ra khi nào mock làm test vô giá trị.</li>
<li>Chạy test tích hợp với một cơ sở dữ liệu thật được tạo ra rồi vứt đi sau mỗi lần chạy.</li>
<li>Test API HTTP từ bên ngoài: mã trạng thái, kiểm dữ liệu vào, 401 khác 403, hợp đồng API.</li>
<li>Test giao diện theo cách người dùng dùng nó, và test trọn luồng trên trình duyệt thật.</li>
<li>Đọc độ phủ cho trung thực, săn test chập chờn, và chạy mọi thứ trong CI.</li>
</ul>

<h3>Dự án: LabFlow Lite</h3>
<p>LabFlow Lite là bản thu nhỏ của hệ thống đặt phòng lab bạn gặp ở SWT301 Lab 2 (LabFlow Demo) và trong đồ án tốt nghiệp. Nó có bốn tầng — màn hình React, API Express 5, luật nghiệp vụ viết thành hàm thuần, và PostgreSQL. Bạn bắt đầu chỉ với phần luật, vì đó là logic đáng test nhất và cũng rẻ nhất để test.</p>
${BANG_LUAT_VI}
<p>Các luật ghi <strong>Lite</strong> là phần đơn giản hoá có ghi rõ, để dạy cho dễ; BR-02/04/05/06 dùng đúng con số của LabFlow Demo. Đây là hình dạng cuối cùng của repository — mỗi chương thêm một thư mục:</p>
${ma('text', M.cay)}

<h3>Vì sao LabFlow Lite mà không phải Notes API của khoá Node.js?</h3>
<p>Khoá Node.js dựng một Notes API — cách rất tốt để học Express. Nhưng dịch vụ ghi chú chủ yếu là thêm, đọc, sửa, xoá, gần như không có luật nghiệp vụ, nên unit test của nó mỏng. Testing được học trên <em>luật</em>: lưới giờ, khung thời gian, giới hạn và vai trò chính là chỗ phân tích giá trị biên và bảng quyết định phát huy tác dụng. LabFlow Lite cho bạn đúng những luật đó, và chúng cũng là luật của lab SWT301 lẫn đồ án tốt nghiệp, nên mỗi ý tưởng test ở đây có lợi tới ba lần. Nếu bạn đã dựng Notes API thì cũng không mất gì: mọi kỹ thuật chuyển sang nguyên vẹn, Chương 5 sẽ chỉ rõ cách.</p>

<h3>Lộ trình — 12 phần</h3>
<table>
<thead><tr><th>Phần</th><th>Bạn học</th><th>Repository có thêm</th></tr></thead>
<tbody>
<tr><td>0 · Bắt đầu</td><td>Kiểm thử là gì, kim tự tháp test, cài Vitest</td><td>khung dự án và test xanh đầu tiên</td></tr>
<tr><td>1 · Unit test đầu tiên</td><td>Chuẩn bị–hành động–khẳng định, matcher, đặt tên, giá trị biên, bảng quyết định, test theo thuộc tính</td><td>bộ test luật nghiệp vụ; Lab 1 diệt 8 lỗi cài sẵn</td></tr>
<tr><td>2 · Bất đồng bộ, thời gian, lỗi</td><td>Promise, đồng hồ giả, ngày giờ và múi giờ, ngẫu nhiên</td><td>hạn chót huỷ phòng, khoá tài khoản</td></tr>
<tr><td>3 · Test double</td><td>Stub, mock, spy, fake — và khi nào đừng dùng</td><td>bộ gửi e-mail giả</td></tr>
<tr><td>4 · Cơ sở dữ liệu thật</td><td>PostgreSQL trong Docker, cô lập, nhà máy dữ liệu test</td><td>luật không trùng giờ cưỡng chế bằng SQL</td></tr>
<tr><td>5 · API HTTP</td><td>Supertest, xác thực, kiểm dữ liệu vào, hợp đồng API</td><td>bộ test API đặt phòng</td></tr>
<tr><td>6 · Component React</td><td>Testing Library, sự kiện người dùng, màn hình gọi API</td><td>test form đặt phòng</td></tr>
<tr><td>7 · Đầu-cuối</td><td>Playwright, locator, độ ổn định, trace</td><td>hành trình "đặt một phòng lab"</td></tr>
<tr><td>8 · Độ phủ và test chập chờn</td><td>Độ phủ đo gì, giấu gì, mutation testing, tốc độ</td><td>báo cáo độ phủ và các bản sửa</td></tr>
<tr><td>9 · CI</td><td>GitHub Actions, check bắt buộc, ma trận và chia shard</td><td>dấu xanh trên mọi pull request</td></tr>
<tr><td>10 · TDD và đội thật</td><td>Đỏ-xanh-refactor, code cũ, review test, câu hỏi phỏng vấn</td><td>một tính năng làm theo kiểu test trước</td></tr>
<tr><td>11 · Dự án cuối khoá</td><td>Chiến lược test cho cả một ứng dụng</td><td>LabFlow Lite được test đầy đủ</td></tr>
</tbody>
</table>

<h3>Trước khi bắt đầu: tự kiểm hai phút</h3>
<p>Bạn cần JavaScript thường ngày, module (<code>import</code>/<code>export</code>), <code>try</code>/<code>catch</code>, một cửa sổ terminal và Node.js 22 (bài 0.3 hướng dẫn cài). Đọc đoạn code này và đoán output trước khi nhìn đáp án:</p>
${ma('javascript', M.tuKiem)}
${ra(M.tuKiemOut)}
<p>Nếu bạn đoán ra <code>210 true BE-305</code> và <code>SyntaxError</code> thì bạn đã sẵn sàng. Nếu <code>reduce</code>, <code>every</code> hay dòng <code>{ lab } = …</code> còn lạ lẫm, hãy dành một giờ cho Chương 1 khoá Node.js trước. Bạn <strong>không</strong> cần TypeScript (tuỳ chọn, có minh hoạ ở 0.3), React (Chương 6 dạy từ số 0), Docker hay SQL (Chương 4 dạy đúng phần nó dùng), cũng không cần kinh nghiệm testing nào.</p>

<h3>Công cụ và phiên bản</h3>
<table>
<thead><tr><th>Công cụ</th><th>Phiên bản dùng cho mọi output</th><th>Vai trò</th></tr></thead>
<tbody>
<tr><td>Node.js</td><td>22.23.3</td><td>Chạy mọi thứ; có sẵn <code>node:test</code></td></tr>
<tr><td>Vitest</td><td>5.0.5 (cần Node ^22.12, ^24 hoặc ≥ 26)</td><td>Bộ chạy test chính</td></tr>
<tr><td>fast-check</td><td>4.10.2</td><td>Test theo thuộc tính (bài 1.4)</td></tr>
<tr><td>Express / Supertest</td><td>5.3.0 / 7.3.1</td><td>API và test của nó (bài 0.2, Chương 5)</td></tr>
<tr><td>PostgreSQL, Playwright</td><td>ghim phiên bản ở Chương 4 và 7</td><td>Cơ sở dữ liệu thật, trình duyệt thật</td></tr>
</tbody>
</table>
<p>Mọi output trong bài đều do chạy code thật mà có (31/10/2026). Số mili-giây trên máy bạn sẽ khác; hình dạng thì không. Nếu một bản Vitest mới hơn in hơi khác, hãy tin terminal của bạn và ý nghĩa của nó, đừng soi từng dấu cách.</p>

<h3>Khoá này liên quan thế nào tới SWT301 và khoá Node.js</h3>
<table>
<thead><tr><th>Bạn học…</th><th>…ở đó</th><th>…và ở đây</th></tr></thead>
<tbody>
<tr><td>Nền tảng, error/defect/failure</td><td>SWT301 Chương 1 (định nghĩa ISTQB, câu hỏi thi)</td><td>Mục 0: cùng ý tưởng qua sự cố thật và code chạy được</td></tr>
<tr><td>Phân vùng tương đương, giá trị biên, bảng quyết định</td><td>SWT301 Chương 4 (thiết kế test case trên giấy và trong Report 5.1)</td><td>Bài 1.4 và Lab 1: đúng những test case đó viết thành code cho máy chạy</td></tr>
<tr><td>Unit test bằng JUnit</td><td>SWT301 bài 8.5 và Lab 2 (Java, LabFlow Demo)</td><td>Chương 1 với Vitest: cấu trúc y hệt, khác ngôn ngữ</td></tr>
<tr><td>Kim tự tháp test, CI</td><td>SWT301 bài 8.6</td><td>Bài 0.2 đo thật, Chương 9 dựng thật</td></tr>
<tr><td>Test một ứng dụng Express</td><td>Khoá Node.js Chương 14 (một chương, tổng quan)</td><td>Chương 1–9: từng tầng đi sâu</td></tr>
</tbody>
</table>
<p>Bạn không cần học hai khoá kia mới theo được khoá này — thứ gì dùng tới đều được giải thích.</p>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok">
<ol>
<li>Lưu đoạn code tự kiểm thành <code>tu-kiem.js</code> trong thư mục <code>thu-test</code> và chạy <code>node tu-kiem.js</code>. So với output ở trên.</li>
<li>Đổi lượt đặt thứ hai thành <code>minutes: 300</code>. Đoán dòng in mới, rồi chạy.</li>
<li>Trong vở, chọn lộ trình ở bài trước (tối thiểu hay đầy đủ) và ghi ngày giờ các buổi học trong hai tuần tới.</li>
<li>Viết một câu: luật LabFlow nào trong bảng bạn nghĩ dễ code sai nhất, và vì sao?</li>
</ol>
<p><strong>Đạt khi:</strong> bước 2 in ra <code>420 false BE-305</code> (vì 300 &gt; 240), lịch của bạn có ngày thật, và câu trả lời nêu một luật kèm lý do (câu trả lời tốt: "BR-05, vì 'tối đa 14' rất dễ viết thành <code>&lt; 14</code>").</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">business rule — BR (luật nghiệp vụ)</span><span class="v">Một quy định của lĩnh vực mà phần mềm phải tuân theo, vd "đặt trước tối đa 14 ngày".</span></div>
  <div class="kv"><span class="k">pure function (hàm thuần)</span><span class="v">Hàm mà kết quả chỉ phụ thuộc tham số và không làm thay đổi gì bên ngoài — loại code dễ test nhất.</span></div>
  <div class="kv"><span class="k">test suite (bộ test)</span><span class="v">Toàn bộ test của một dự án gộp lại.</span></div>
  <div class="kv"><span class="k">integration test (test tích hợp)</span><span class="v">Test trong đó nhiều phần thật chạy cùng nhau, vd luật nghiệp vụ và PostgreSQL.</span></div>
  <div class="kv"><span class="k">end-to-end test (test đầu-cuối)</span><span class="v">Test điều khiển cả ứng dụng trên trình duyệt thật như một người dùng.</span></div>
  <div class="kv"><span class="k">CI — continuous integration (tích hợp liên tục)</span><span class="v">Một máy chủ chạy bộ test ở mỗi lần push và mỗi pull request.</span></div>
</div>

<h3>🗺 LabFlow Lite, từng tầng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Màn hình React</span><span class="lz-lnote">Chương 6 — Testing Library, MSW</span></div>
  <div class="lz-layer"><span class="lz-lname">API Express 5</span><span class="lz-lnote">Chương 5 — Supertest, hợp đồng</span></div>
  <div class="lz-layer"><span class="lz-lname">Luật nghiệp vụ</span><span class="lz-lnote">Chương 1–3 — hàm thuần, bất đồng bộ, test double</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL</span><span class="lz-lnote">Chương 4 — CSDL thật, Testcontainers</span></div>
  <div class="lz-layer"><span class="lz-lname">Cả hành trình trong trình duyệt</span><span class="lz-lnote">Chương 7 — Playwright</span></div>
</div>
<div class="pitfall"><strong>Bắt đầu từ giao diện.</strong> Người mới hay test màn hình trước vì đó là thứ họ thấy. Luật nghiệp vụ mới là nơi chứa logic và là nơi test rẻ nhất — vì thế LabFlow Lite bắt đầu bằng hàm thuần và mỗi chương thêm một tầng.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bạn kết thúc với một repository — LabFlow Lite — được test ở mọi tầng và được CI kiểm.</li>
<li>LabFlow Lite dùng lại luật BR-04/05/06 của LabFlow, nên lab SWT301 và đồ án tốt nghiệp được lợi trực tiếp.</li>
<li>Dự án nhiều luật dạy testing tốt hơn dự án CRUD; mọi kỹ thuật vẫn áp dụng được cho Notes API.</li>
<li>Mười hai phần: bắt đầu → unit → bất đồng bộ → test double → cơ sở dữ liệu → API → giao diện → đầu-cuối → chất lượng → CI → đội → dự án cuối khoá.</li>
<li>Điều kiện: JavaScript thường ngày, terminal, Node 22. Mọi thứ khác học khi dùng tới.</li>
<li>Mọi output là thật (Node 22.23.3, Vitest 5.0.5).</li>
</ul>
${lienKet({ bai: 'swt301-lab2-labflow-nghiep-vu', title: 'Đã gặp ở SWT301 — L2.10: LabFlow Demo, nghiệp vụ và dữ liệu', sub: 'Giống: hành trình đặt phòng LabFlow và các luật BR-04 (lưới 30 phút, 07:00–21:00), BR-05 (≤ 14 ngày), BR-06 (> 30 chỗ cần duyệt). Khác: SWT301 test bản Java/Spring Boot bằng JUnit và Report 5.1; khoá này dựng lại một bản Node nhỏ, LabFlow Lite, và test nó ở mọi tầng.', cta: 'MỞ BÀI SWT301 →' })}
</div>
`,
};
