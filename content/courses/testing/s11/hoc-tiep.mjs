/**
 * Testing · Chương 11 · 11.7 — Học tiếp gì sau khoá này. BÀI MỚI 01/11/2026, slug tst-11-7-hoc-tiep.
 * Bản đồ 12 phần đã học; khoá tiếp theo (api-design, nodejs, github-actions, observability-monitoring, system-design, thêm
 * performance-load-testing) — với mỗi khoá: thêm gì vào LabFlow Lite và bài đầu tiên nên mở (thẻ một chiều); kế hoạch 30/60/90 ngày;
 * giữ bộ test khoẻ nhiều tháng; tương đương Java/Spring Boot. Thực hành dùng số đo thật 111-ngan-sach (./_ma.mjs).
 */
import G from '../giang/tst-11-7.mjs';
import { ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const BUDGET = OUT['111-ngan-sach'];
const MATRIX = OUT['111-ma-tran'].split('\n').filter((l) => /^\$ |^\| (#|\d+ \| (PostgreSQL|dates|the cancel|other rows|the screen)| \|)/.test(l)).join('\n');

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">now</div><div class="lz-t">Testing</div><div class="lz-d">behaviour proven before release</div></div>
  <div class="lz-step"><div class="lz-k">next</div><div class="lz-t">API design · Node.js</div><div class="lz-d">contract-first endpoints, logs you can test</div></div>
  <div class="lz-step"><div class="lz-k">then</div><div class="lz-t">GitHub Actions</div><div class="lz-d">from ci-ok to a safe deploy</div></div>
  <div class="lz-step"><div class="lz-k">after release</div><div class="lz-t">Observability</div><div class="lz-d">what real users and real load do</div></div>
  <div class="lz-step"><div class="lz-k">at scale</div><div class="lz-t">System design</div><div class="lz-d">double booking for a whole country</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">bây giờ</div><div class="lz-t">Testing</div><div class="lz-d">hành vi được chứng minh trước khi phát hành</div></div>
  <div class="lz-step"><div class="lz-k">tiếp theo</div><div class="lz-t">API design · Node.js</div><div class="lz-d">endpoint theo hợp đồng trước, log test được</div></div>
  <div class="lz-step"><div class="lz-k">rồi</div><div class="lz-t">GitHub Actions</div><div class="lz-d">từ ci-ok tới một lần deploy an toàn</div></div>
  <div class="lz-step"><div class="lz-k">sau phát hành</div><div class="lz-t">Observability</div><div class="lz-d">người dùng thật và tải thật làm gì</div></div>
  <div class="lz-step"><div class="lz-k">quy mô lớn</div><div class="lz-t">System design</div><div class="lz-d">chống đặt trùng cho cả một quốc gia</div></div>
</div>`;

const MAP_EN = `<table>
<thead><tr><th>Part</th><th>You can now</th><th>Proof in LabFlow Lite</th></tr></thead>
<tbody>
<tr><td>0–1</td><td>write tests that can fail, named after the rule they check</td><td>BR-05 boundaries 14 → true, 15 → false</td></tr>
<tr><td>2</td><td>control time, randomness and errors</td><td>daysAheadVN on an injected clock</td></tr>
<tr><td>3–4</td><td>mock only at boundaries; test SQL on a real PostgreSQL</td><td>EXCLUDE constraint, 23P01 → OVERLAP</td></tr>
<tr><td>5–6</td><td>test an API against its contract; test screens by role and name</td><td>openapi.json check; MyBookings tests</td></tr>
<tr><td>7</td><td>write browser journeys that do not flake</td><td>book → cancel → book again</td></tr>
<tr><td>8</td><td>read coverage and mutation scores honestly</td><td>99.08% of 433 mutants</td></tr>
<tr><td>9–10</td><td>make CI turn red; TDD; pin legacy code; review tests</td><td>one required check, ci-ok</td></tr>
<tr><td>11</td><td>plan from risks and trace every requirement</td><td>the capstone: 100/100</td></tr>
</tbody></table>`;
const MAP_VI = `<table>
<thead><tr><th>Phần</th><th>Giờ bạn làm được</th><th>Bằng chứng trong LabFlow Lite</th></tr></thead>
<tbody>
<tr><td>0–1</td><td>viết test có thể đỏ, đặt tên theo luật mà nó kiểm</td><td>biên BR-05: 14 → true, 15 → false</td></tr>
<tr><td>2</td><td>điều khiển thời gian, ngẫu nhiên và lỗi</td><td>daysAheadVN với đồng hồ tiêm vào</td></tr>
<tr><td>3–4</td><td>chỉ mock ở ranh giới; test SQL trên PostgreSQL thật</td><td>ràng buộc EXCLUDE, 23P01 → OVERLAP</td></tr>
<tr><td>5–6</td><td>test API theo hợp đồng; test màn hình theo vai trò và tên</td><td>kiểm openapi.json; test MyBookings</td></tr>
<tr><td>7</td><td>viết hành trình trình duyệt không chập chờn</td><td>đặt → huỷ → đặt lại</td></tr>
<tr><td>8</td><td>đọc đúng điểm độ phủ và điểm đột biến</td><td>99,08% trên 433 đột biến</td></tr>
<tr><td>9–10</td><td>làm CI đỏ khi cần; TDD; ghim code cũ; review test</td><td>một check bắt buộc, ci-ok</td></tr>
<tr><td>11</td><td>lập kế hoạch từ rủi ro và truy vết mọi yêu cầu</td><td>dự án cuối khoá: 100/100</td></tr>
</tbody></table>`;

const PLAN_EN = `<table>
<thead><tr><th>Days</th><th>Do</th><th>Proof it is done</th></tr></thead>
<tbody>
<tr><td>1–30</td><td>Apply the capstone to one feature of your SWP391 or SEP490 project</td><td>criteria with ids; one test above Unit per High risk; a required check that is green</td></tr>
<tr><td>31–60</td><td>API design (Chapter 12) and Node.js (Chapter 15) on LabFlow Lite</td><td>a contract-first endpoint; a test that asserts a log line</td></tr>
<tr><td>61–90</td><td>GitHub Actions (Chapter 15) and observability</td><td>a deploy with a smoke test; one dashboard you read every week</td></tr>
</tbody></table>`;
const PLAN_VI = `<table>
<thead><tr><th>Ngày</th><th>Làm gì</th><th>Bằng chứng đã xong</th></tr></thead>
<tbody>
<tr><td>1–30</td><td>Áp dự án cuối khoá vào một tính năng của đồ án SWP391 hoặc SEP490</td><td>tiêu chí có mã; mỗi rủi ro High một test trên tầng Unit; một check bắt buộc đang xanh</td></tr>
<tr><td>31–60</td><td>API design (Chương 12) và Node.js (Chương 15) trên LabFlow Lite</td><td>một endpoint làm theo hợp đồng trước; một test khẳng định một dòng log</td></tr>
<tr><td>61–90</td><td>GitHub Actions (Chương 15) và observability</td><td>một lần deploy có smoke test; một dashboard bạn đọc mỗi tuần</td></tr>
</tbody></table>`;

const JAVA_EN = `<table>
<thead><tr><th>In this course</th><th>In Java / Spring Boot</th><th>Same idea</th></tr></thead>
<tbody>
<tr><td>Vitest, <code>it.each</code></td><td>JUnit 5, <code>@ParameterizedTest</code></td><td>one rule, a table of cases</td></tr>
<tr><td><code>vi.fn</code>, fakes</td><td>Mockito</td><td>doubles only at boundaries you do not own</td></tr>
<tr><td>Testcontainers (Node)</td><td>Testcontainers for Java, <code>@ServiceConnection</code></td><td>the real PostgreSQL, thrown away after</td></tr>
<tr><td>Supertest + OpenAPI check</td><td>MockMvc or RestAssured + an OpenAPI validator</td><td>test the API from outside, against its contract</td></tr>
<tr><td>Playwright</td><td>Playwright for Java</td><td>role-based locators, web-first assertions</td></tr>
<tr><td>Stryker</td><td>PIT (pitest)</td><td>tests must notice a planted change</td></tr>
<tr><td><code>(BR-04)</code> in test names</td><td><code>@DisplayName</code>, <code>@Tag("BR-04")</code></td><td>traceability from real reports</td></tr>
</tbody></table>`;
const JAVA_VI = `<table>
<thead><tr><th>Trong khoá này</th><th>Trong Java / Spring Boot</th><th>Cùng ý tưởng</th></tr></thead>
<tbody>
<tr><td>Vitest, <code>it.each</code></td><td>JUnit 5, <code>@ParameterizedTest</code></td><td>một luật, một bảng tình huống</td></tr>
<tr><td><code>vi.fn</code>, fake</td><td>Mockito</td><td>đồ đóng thế chỉ ở ranh giới mình không sở hữu</td></tr>
<tr><td>Testcontainers (Node)</td><td>Testcontainers for Java, <code>@ServiceConnection</code></td><td>PostgreSQL thật, dùng xong vứt</td></tr>
<tr><td>Supertest + kiểm OpenAPI</td><td>MockMvc hoặc RestAssured + một bộ kiểm OpenAPI</td><td>test API từ bên ngoài, đối chiếu hợp đồng</td></tr>
<tr><td>Playwright</td><td>Playwright for Java</td><td>locator theo vai trò, khẳng định chờ màn hình</td></tr>
<tr><td>Stryker</td><td>PIT (pitest)</td><td>test phải nhận ra một thay đổi cài vào</td></tr>
<tr><td><code>(BR-04)</code> trong tên test</td><td><code>@DisplayName</code>, <code>@Tag("BR-04")</code></td><td>truy vết từ báo cáo thật</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🔺', 'Martin Fowler — The Practical Test Pyramid', 'The pyramid of this course, explained with a real Spring Boot service.', 'https://martinfowler.com/articles/practical-test-pyramid.html'),
  nguon('🎲', 'Google Testing Blog — Flaky Tests at Google and How We Mitigate Them', 'What keeping a large suite healthy looks like over years.', 'https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html'),
  nguon('🧬', 'PIT — mutation testing for Java', 'Stryker’s counterpart for your Spring Boot semester.', 'https://pitest.org/'),
  nguon('🐳', 'Testcontainers for Java', 'The same throw-away PostgreSQL as Chapter 4, from JUnit 5.', 'https://java.testcontainers.org/'),
].join('\n');

export default {
  title: '11.7 — Where to go next|||11.7 — Học tiếp gì sau khoá này',
  slug: 'tst-11-7-hoc-tiep',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài cuối của khoá Testing: bản đồ 12 phần bạn đã làm được (kèm bằng chứng trong LabFlow Lite), rồi lộ trình học tiếp — API Design (hợp đồng trước), Node.js (log test được), GitHub Actions (từ ci-ok tới deploy an toàn), Observability (sau khi phát hành), System Design (chống đặt trùng ở quy mô lớn) và thêm Performance & Load Testing — với mỗi khoá: thêm gì vào LabFlow Lite và bài đầu tiên nên mở. Kế hoạch 30/60/90 ngày; giữ một bộ test khoẻ nhiều tháng (nâng ngưỡng, cách ly có chủ, xoá test chỉ kiểm mock, đo hằng tháng); bảng tương đương Java/Spring Boot (JUnit 5, Mockito, Testcontainers, MockMvc/RestAssured, Playwright for Java, PIT); thực hành lập ngân sách kim tự tháp cho dự án của bạn từ số đo thật.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.7 · The end of the course</span>
<h2>Where to go next</h2>
<p class="lead">You started with one <code>expect</code> and ended with a feature planned from risks, tested at five layers and shipped behind one required check. This last lesson is a map: what you can already do, which course builds on it, and how to keep a test suite trustworthy after the course is over.</p>
<p><strong>After this lesson you can</strong> choose the next course for your goal and know exactly what to add to LabFlow Lite in it; plan the next 90 days with proof at each step; keep a growing suite healthy; and translate everything to Java and Spring Boot. <strong>Why it is useful:</strong> skills fade fastest right after a course ends. A next project that reuses this one keeps them — and turns one portfolio repository into a story about a whole system.</p>

<h3>What you can do now</h3>
${MAP_EN}
<p>Behind every row is the same habit: <strong>before trusting a test, name the bug that turns it red.</strong> Lesson 11.1 measured why one layer is never enough:</p>
${ra(MATRIX)}
<p>Seven of the twelve bugs were seen by exactly one layer; five of them are shown here. Each course below adds a new place where bugs hide — and a new kind of test or signal that sees it.</p>

<h3>The path from here</h3>
${FLOW_EN}
<p>Tests prove the behaviour you <em>thought of</em>, before release. Observability shows the behaviour you <em>did not</em> think of, after release. A backend developer needs both, and the courses on this site follow that order.</p>

<h3>API design: contract first</h3>
<p>LabFlow’s <code>openapi.json</code> grew after the code (Chapter 5, then 11.2). In API design you write it first: resources, error shapes, pagination, idempotency keys. Add one endpoint to LabFlow Lite that way — say, a lecturer’s “approve booking” — and let the tests you already know guard it: the contract check on every response, the same check on the PostgreSQL-backed API (11.2), a 409 for a double approval.</p>
${lienKet({ khoa: 'api-design', bai: 'api-12-1-thiet-ke', title: 'API Design — 12.1: designing the capstone contract', sub: 'Start the API course’s capstone from the contract; the tests of this course become its safety net.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'api-design', bai: 'api-7-1-kiem-hop-dong', title: 'API Design — 7.1: checking the contract', sub: 'The same OpenAPI check as Chapter 5, seen from the designer’s side.', cta: 'OPEN LESSON →' })}

<h3>Node.js: logs and metrics you can test</h3>
<p>When a cancel fails in production, the first question is “which request?”. Add structured logs with a request id to the LabFlow API, then write a test that a refused cancel logs <code>TOO_LATE_TO_CANCEL</code> with the id the client received. Logging stops being decoration and becomes behaviour with a test.</p>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-1-log-co-cau-truc', title: 'Node.js — 15.1: structured logs', sub: 'Logs as JSON with a request id — the first step from a tested app to an observable one.', cta: 'OPEN LESSON →' })}

<h3>GitHub Actions: from ci-ok to a safe deploy</h3>
<p>Your pipeline stops at a green <code>ci-ok</code>. The second half builds an image, deploys to a staging server, runs a smoke test against the real URL and rolls back if it fails. Bring two numbers from 11.4: installing Chromium took 6½ of the 8¾ minutes on act — the first thing to cache.</p>
${lienKet({ khoa: 'github-actions', bai: 'ga-15-1-ci-cho-pr', title: 'GitHub Actions — 15.1: CI for pull requests', sub: 'The capstone of the GitHub Actions course starts where your ci-ok ends.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-15-3-deploy-an-toan', title: 'GitHub Actions — 15.3: deploying safely', sub: 'Smoke tests and rollbacks: tests that run after the deploy.', cta: 'OPEN LESSON →' })}

<h3>Observability: what happens after release</h3>
<p>A green suite says the code did the right thing once, on a laptop. It does not say how long a cancel takes for real users at 07:00, when everyone books. Metrics, traces and alerts answer that — the same questions you asked of the test suite (how long, how often red), asked of production.</p>
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-1-vi-sao', title: 'Observability — 0.1: why observe', sub: 'Tests before release, observability after: the other half of knowing your system works.', cta: 'OPEN LESSON →' })}

<h3>System design, and an extra: performance</h3>
<p>Double booking is LabFlow’s problem at scale. In 11.2 one EXCLUDE constraint and one atomic <code>UPDATE</code> settled it for one database; system design asks what happens with many servers, a cache and a queue. A load test then asks the race question of 11.2 with two thousand requests instead of two: does exactly one still win?</p>
${lienKet({ khoa: 'system-design', bai: 'sysd-0-8-bat-dau-tai-day', title: 'System Design — Start here', sub: 'From one VPS to many servers, with numbers instead of buzzwords.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'system-design', bai: 'sysd-9-2-chong-trung', title: 'System Design — 9.2: preventing double booking', sub: 'Constraints, locks and conditional updates — LabFlow’s race, at the scale of a ticket sale.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-0-8-bat-dau-tai-day', title: 'Performance and Load Testing — Start here', sub: 'The race test of this course, under real load.', cta: 'OPEN LESSON →' })}
<p><strong>How to choose:</strong> aiming for a backend internship next — API design, then Node.js. DevOps or platform — GitHub Actions, then observability. Interviews at product companies — system design. Whatever you choose, keep LabFlow Lite as the project: a portfolio with one system that grows is stronger than five demos.</p>

<h3>A 30/60/90-day plan</h3>
${PLAN_EN}

<h3>Keeping a suite healthy for months</h3>
<p>Suites rarely die in one day; they rot. Five rules keep the LabFlow suite honest, each one a lesson of this course:</p>
<ul>
<li><strong>Ratchet</strong> thresholds up, never down: Chapter 8 started at 85/80/80/85, Chapter 11 runs at 97/91/96/97 and a 95% mutation floor.</li>
<li><strong>Quarantine</strong> a flaky test with an issue and an owner (9.3) — it keeps running and reporting, it stops blocking — and fix the cause.</li>
<li><strong>Delete</strong> tests that only check their own mocks (3.3, 11.5): they cost time and catch nothing.</li>
<li><strong>Review</strong> tests in every pull request with the checklist of 10.3, and keep requirement ids in the names (11.1).</li>
<li><strong>Measure</strong> monthly: re-run <code>node scripts/ngan-sach.mjs</code> and Stryker. A layer that doubled in time or a score that dropped is a smell worth an issue. Upgrade Vitest, Playwright and Node on a schedule, not in a panic.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>“Just add a retry” is how suites die.</strong> In lesson 8.3 a retry turned a race that was red in 17 of 50 runs into 0 of 50 — with the double-booking bug still in the code. Every retry, skip or lowered threshold needs an issue, an owner and a date, or the suite slowly stops telling the truth.</div>

<h3>Moving to Spring Boot: the same ideas</h3>
<p>Your Spring Boot semester will use other tools for exactly the same ideas:</p>
${JAVA_EN}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Plan the test budget of your own project the way 11.1 planned LabFlow’s. Here is the model, measured on LabFlow Lite:</p>
${ra(BUDGET)}
<p><strong>Read it:</strong> before every push you can afford Unit + UI + DB = 1.6 + 2.3 + 1.5 = 5.4 s, and the Chromium journeys add 4.2 s — 9.6 s, under a 15-second budget. Five browsers (24.1 s) go to the nightly run; mutation (28.7 s) fits in a pull request. Now measure your own project the same way: count the tests per layer, time three runs of each, and write which bug only that layer can catch.</p>
<p><strong>Done when</strong> you have the same table for your project, a pre-push budget under 15 seconds, a list of what runs only at night, and one sentence per layer naming a bug only it catches.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">observability (khả năng quan sát)</span><span class="v">Logs, metrics and traces that show what a running system does.</span></div>
  <div class="kv"><span class="k">smoke test (test khói)</span><span class="v">A few quick checks right after a deploy: is it up, does the main path work?</span></div>
  <div class="kv"><span class="k">ratchet (bánh cóc)</span><span class="v">A threshold that only moves up, so quality cannot quietly slip.</span></div>
  <div class="kv"><span class="k">load test (test tải)</span><span class="v">Many simultaneous requests to see behaviour and speed under pressure.</span></div>
  <div class="kv"><span class="k">contract-first (hợp đồng trước)</span><span class="v">Write the API description before the code, then test the code against it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One habit runs through the course: name the bug that turns a test red; no single layer sees them all.</li>
<li>Next: API design and Node.js extend LabFlow; GitHub Actions ships it; observability watches it; system design scales it.</li>
<li>Plan 90 days with proof at each step, starting with your own school project.</li>
<li>Keep suites healthy: ratchet, quarantine with owners, delete mock-only tests, review, measure monthly.</li>
<li>In Spring Boot the tools change names — JUnit 5, Mockito, Testcontainers, MockMvc, PIT — and the ideas stay.</li>
</ul>
<p>Thank you for coming this far. The course is over; the project is yours.</p>

${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.7 · Kết thúc khoá học</span>
<h2>Học tiếp gì sau khoá này</h2>
<p class="lead">Bạn bắt đầu bằng một dòng <code>expect</code> và kết thúc bằng một tính năng được lập kế hoạch từ rủi ro, test ở năm tầng và đưa ra sau một check bắt buộc duy nhất. Bài cuối này là một tấm bản đồ: bạn đã làm được gì, khoá nào xây tiếp trên đó, và làm sao giữ bộ test đáng tin sau khi khoá học kết thúc.</p>
<p><strong>Sau bài này bạn có thể</strong> chọn khoá tiếp theo theo mục tiêu của mình và biết chính xác sẽ thêm gì vào LabFlow Lite ở khoá đó; lập kế hoạch 90 ngày tới với bằng chứng ở mỗi bước; giữ một bộ test đang lớn luôn khoẻ; và chuyển mọi thứ sang Java và Spring Boot. <strong>Vì sao hữu ích:</strong> kỹ năng phai nhanh nhất ngay sau khi khoá học kết thúc. Một dự án tiếp theo dùng lại dự án này giữ chúng lại — và biến một repo portfolio thành câu chuyện về cả một hệ thống.</p>

<h3>Giờ bạn làm được gì</h3>
${MAP_VI}
<p>Đằng sau mỗi dòng là cùng một thói quen: <strong>trước khi tin một test, hãy gọi tên bug làm nó đỏ.</strong> Bài 11.1 đã đo vì sao một tầng không bao giờ đủ:</p>
${ra(MATRIX)}
<p>Bảy trong mười hai bug chỉ đúng một tầng thấy; năm bug trong số đó hiện ở đây. Mỗi khoá dưới đây thêm một nơi mới để bug ẩn nấp — và một loại test hay tín hiệu mới để nhìn thấy nó.</p>

<h3>Con đường từ đây</h3>
${FLOW_VI}
<p>Test chứng minh hành vi bạn <em>đã nghĩ tới</em>, trước khi phát hành. Observability (khả năng quan sát) cho thấy hành vi bạn <em>chưa nghĩ tới</em>, sau khi phát hành. Một lập trình viên backend cần cả hai, và các khoá trên trang này đi theo đúng thứ tự đó.</p>

<h3>API design: hợp đồng trước</h3>
<p><code>openapi.json</code> của LabFlow lớn lên sau code (Chương 5, rồi 11.2). Ở khoá API design bạn viết nó trước: tài nguyên, dạng lỗi, phân trang, khoá idempotency. Thêm một endpoint vào LabFlow Lite theo cách đó — ví dụ “duyệt lượt đặt” của giảng viên — và để những test bạn đã biết canh giữ nó: kiểm hợp đồng trên mọi phản hồi, cùng phép kiểm đó trên API chạy bằng PostgreSQL (11.2), một 409 cho lần duyệt thứ hai.</p>
${lienKet({ khoa: 'api-design', bai: 'api-12-1-thiet-ke', title: 'API Design — 12.1: thiết kế hợp đồng cho dự án cuối khoá', sub: 'Bắt đầu dự án cuối khoá API từ hợp đồng; các test của khoá này thành lưới an toàn của nó.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'api-design', bai: 'api-7-1-kiem-hop-dong', title: 'API Design — 7.1: kiểm hợp đồng', sub: 'Cùng phép kiểm OpenAPI của Chương 5, nhìn từ phía người thiết kế.', cta: 'MỞ BÀI →' })}

<h3>Node.js: log và chỉ số test được</h3>
<p>Khi một lượt huỷ hỏng trên production, câu hỏi đầu tiên là “request nào?”. Thêm log có cấu trúc kèm request id vào API LabFlow, rồi viết một test rằng lượt huỷ bị từ chối ghi log <code>TOO_LATE_TO_CANCEL</code> với đúng id mà client nhận. Log không còn là đồ trang trí mà thành một hành vi có test.</p>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-1-log-co-cau-truc', title: 'Node.js — 15.1: log có cấu trúc', sub: 'Log dạng JSON kèm request id — bước đầu từ một app có test tới một app quan sát được.', cta: 'MỞ BÀI →' })}

<h3>GitHub Actions: từ ci-ok tới một lần deploy an toàn</h3>
<p>Pipeline của bạn dừng ở một <code>ci-ok</code> xanh. Nửa sau dựng image, deploy lên máy staging, chạy smoke test (test khói) vào URL thật và quay lui nếu hỏng. Mang theo hai con số từ 11.4: cài Chromium tốn 6 phút rưỡi trong gần 9 phút chạy trên act — thứ đầu tiên nên cache.</p>
${lienKet({ khoa: 'github-actions', bai: 'ga-15-1-ci-cho-pr', title: 'GitHub Actions — 15.1: CI cho pull request', sub: 'Dự án cuối khoá GitHub Actions bắt đầu ở đúng chỗ ci-ok của bạn kết thúc.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-15-3-deploy-an-toan', title: 'GitHub Actions — 15.3: deploy an toàn', sub: 'Smoke test và quay lui: những test chạy sau khi deploy.', cta: 'MỞ BÀI →' })}

<h3>Observability: chuyện gì xảy ra sau khi phát hành</h3>
<p>Một bộ test xanh nói code đã làm đúng một lần, trên một chiếc laptop. Nó không nói một lượt huỷ mất bao lâu với người dùng thật lúc 07:00, khi ai cũng đặt phòng. Chỉ số, trace và cảnh báo trả lời điều đó — chính những câu bạn đã hỏi bộ test (chạy bao lâu, đỏ bao nhiêu lần), giờ hỏi production.</p>
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-1-vi-sao', title: 'Observability — 0.1: vì sao phải quan sát', sub: 'Test trước khi phát hành, observability sau đó: nửa còn lại của việc biết hệ thống chạy đúng.', cta: 'MỞ BÀI →' })}

<h3>System design, và thêm: hiệu năng</h3>
<p>Đặt trùng là bài toán của LabFlow ở quy mô lớn. Ở 11.2, một ràng buộc EXCLUDE và một <code>UPDATE</code> nguyên tử giải quyết nó cho một CSDL; system design hỏi chuyện gì xảy ra khi có nhiều máy chủ, một lớp cache và một hàng đợi. Rồi một test tải (load test) hỏi lại câu hỏi tranh chấp của 11.2 với hai nghìn request thay vì hai: liệu vẫn đúng một người thắng?</p>
${lienKet({ khoa: 'system-design', bai: 'sysd-0-8-bat-dau-tai-day', title: 'System Design — Bắt đầu tại đây', sub: 'Từ một VPS tới nhiều máy chủ, bằng con số thay vì từ khoá thời thượng.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'system-design', bai: 'sysd-9-2-chong-trung', title: 'System Design — 9.2: chống bán trùng', sub: 'Ràng buộc, khoá và cập nhật có điều kiện — cuộc đua của LabFlow ở quy mô một đợt mở bán vé.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-0-8-bat-dau-tai-day', title: 'Performance và Load Testing — Bắt đầu tại đây', sub: 'Test tranh chấp của khoá này, dưới tải thật.', cta: 'MỞ BÀI →' })}
<p><strong>Chọn thế nào:</strong> nhắm thực tập backend — API design, rồi Node.js. DevOps hay platform — GitHub Actions, rồi observability. Phỏng vấn công ty sản phẩm — system design. Chọn gì cũng được, hãy giữ LabFlow Lite làm dự án: một portfolio có một hệ thống lớn dần mạnh hơn năm bản demo rời rạc.</p>

<h3>Kế hoạch 30/60/90 ngày</h3>
${PLAN_VI}

<h3>Giữ bộ test khoẻ nhiều tháng</h3>
<p>Bộ test hiếm khi chết trong một ngày; nó mục dần. Năm luật giữ bộ test LabFlow trung thực, luật nào cũng là một bài của khoá:</p>
<ul>
<li><strong>Nâng ngưỡng như bánh cóc (ratchet)</strong>, chỉ lên không xuống: Chương 8 bắt đầu ở 85/80/80/85, Chương 11 chạy ở 97/91/96/97 và sàn đột biến 95%.</li>
<li><strong>Cách ly</strong> test chập chờn kèm issue và người phụ trách (9.3) — vẫn chạy, vẫn báo, thôi chặn — và sửa tận gốc.</li>
<li><strong>Xoá</strong> test chỉ kiểm mock của chính nó (3.3, 11.5): tốn thời gian mà không bắt được gì.</li>
<li><strong>Review</strong> test trong mọi pull request bằng checklist của 10.3, và giữ mã yêu cầu trong tên test (11.1).</li>
<li><strong>Đo</strong> mỗi tháng: chạy lại <code>node scripts/ngan-sach.mjs</code> và Stryker. Một tầng chạy lâu gấp đôi hay một điểm số tụt là dấu hiệu đáng mở issue. Nâng cấp Vitest, Playwright và Node theo lịch, không phải lúc hoảng.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>“Thêm retry cho xong” là cách bộ test chết.</strong> Ở bài 8.3 một retry biến cuộc tranh chấp đỏ 17/50 lần thành 0/50 — trong khi bug đặt trùng vẫn còn trong code. Mỗi retry, mỗi test bị bỏ qua, mỗi lần hạ ngưỡng đều cần một issue, một người phụ trách và một hạn chót, nếu không bộ test dần dần thôi nói thật.</div>

<h3>Sang Spring Boot: cùng những ý tưởng đó</h3>
<p>Kỳ học Spring Boot sẽ dùng công cụ khác cho đúng những ý tưởng này:</p>
${JAVA_VI}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Lập ngân sách test cho dự án của chính bạn theo cách 11.1 đã làm cho LabFlow. Đây là mẫu, đo trên LabFlow Lite:</p>
${ra(BUDGET)}
<p><strong>Đọc nó:</strong> trước mỗi lần push bạn đủ sức chạy Unit + UI + DB = 1,6 + 2,3 + 1,5 = 5,4 giây, và hành trình Chromium thêm 4,2 giây — 9,6 giây, dưới ngân sách 15 giây. Năm trình duyệt (24,1 giây) để chạy đêm; đột biến (28,7 giây) vừa trong một pull request. Giờ đo dự án của bạn theo cùng cách: đếm test mỗi tầng, bấm giờ ba lần chạy mỗi tầng, và ghi bug nào chỉ tầng đó bắt được.</p>
<p><strong>Xong khi</strong> bạn có cùng bảng đó cho dự án của mình, một ngân sách trước-khi-push dưới 15 giây, danh sách những gì chỉ chạy ban đêm, và mỗi tầng một câu gọi tên một bug chỉ tầng đó bắt được.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">observability (khả năng quan sát)</span><span class="v">Log, chỉ số và trace cho thấy một hệ thống đang chạy làm gì.</span></div>
  <div class="kv"><span class="k">smoke test (test khói)</span><span class="v">Vài phép kiểm nhanh ngay sau deploy: có lên không, đường chính có chạy không?</span></div>
  <div class="kv"><span class="k">ratchet (bánh cóc)</span><span class="v">Một ngưỡng chỉ được nâng lên, để chất lượng không lặng lẽ tụt.</span></div>
  <div class="kv"><span class="k">load test (test tải)</span><span class="v">Rất nhiều request cùng lúc để xem hành vi và tốc độ khi bị dồn ép.</span></div>
  <div class="kv"><span class="k">contract-first (hợp đồng trước)</span><span class="v">Viết mô tả API trước code, rồi test code đối chiếu với nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một thói quen xuyên suốt khoá: gọi tên bug làm test đỏ; không tầng nào thấy hết mọi bug.</li>
<li>Tiếp theo: API design và Node.js mở rộng LabFlow; GitHub Actions đưa nó lên; observability theo dõi nó; system design đưa nó lên quy mô lớn.</li>
<li>Lập kế hoạch 90 ngày với bằng chứng ở mỗi bước, bắt đầu từ đồ án của chính bạn.</li>
<li>Giữ bộ test khoẻ: nâng ngưỡng, cách ly có người phụ trách, xoá test chỉ kiểm mock, review, đo hằng tháng.</li>
<li>Sang Spring Boot công cụ đổi tên — JUnit 5, Mockito, Testcontainers, MockMvc, PIT — còn ý tưởng giữ nguyên.</li>
</ul>
<p>Cảm ơn bạn đã đi tới tận đây. Khoá học đã xong; dự án là của bạn.</p>

${NGUON}
</div>
`,
};
