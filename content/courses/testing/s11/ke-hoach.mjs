/**
 * Testing · Chương 11 · 11.1 — Lập chiến lược test. Slug giữ từ khung: tst-11-1-ke-hoach.
 * Bản phát hành LabFlow Lite 1.1 = US-11 "My bookings" (6 AC). Kế hoạch test thật trong dự án: test-plan/TEST-PLAN.md + requirements.json.
 * Đo thật: 12 bug × 5 tầng (scripts/ma-tran-bat-loi.mjs: Unit 5/12, API 6/12, UI 1/12, DB 4/12, E2E 2/12), ngân sách kim tự tháp
 * (scripts/ngan-sach.mjs), ma trận truy vết sinh từ báo cáo test (scripts/rtm.mjs + src/ci/rtm.js; lần đầu nhãn ở describe ⇒ 16 test API
 * "chứng minh" AC6), lỗi LF-301 (BR-05 không được API kiểm: 201 cho 30 ngày). Thực hành Lite-2 qua API. Mọi output ở ./_ma.mjs.
 */
import G from '../giang/tst-11-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const part = (src, needle, n) => { const d = src.split('\n'); const i = d.findIndex((l) => l.includes(needle)); return d.slice(i, i + n).join('\n'); };

const PLAN_EXIT = part(CODE.plan, '## 6. Exit criteria', 7);
const MATRAN = OUT['111-ma-tran'];
const NGAN = OUT['111-ngan-sach'];
const TAGS = part(CODE.rtm, 'export function tagsOf', 10);
const RTM1 = loc('111-rtm-lan-1', /^\$ |^\| (Requirement|BR-06|Lite|US-11 AC[26])|Gaps|^- /);
const RTM = loc('111-rtm', /^\$ |tests read|^\| (Requirement|BR-0[46]|Lite-[12])|Every in-scope/);
const LF_TEST = part(CODE.lf301, "it('BR-05", 5);
const LF = loc('111-lf-301', /^\$ |×|AssertionError|^[-+] [0-9]|Tests {2}/);
const TH_TEST = part(CODE.th111, "describe('approval", 11);
const TH_RUN = loc('111-th-test', /^\$ |✓ |Tests {2}/);
const TH_SAU = OUT['111-th-sau'];

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Scope</div><div class="lz-d">what changes in this release — and what does not</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Risks</div><div class="lz-d">likelihood × impact; High needs a test above Unit</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Layers</div><div class="lz-d">which layer can SEE each risk — measured</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Budget</div><div class="lz-d">seconds per layer; what runs where</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Criteria</div><div class="lz-d">entry, exit, definition of done</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Traceability</div><div class="lz-d">every requirement → a passing test, checked by CI</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Phạm vi</div><div class="lz-d">bản này đổi gì — và không đổi gì</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Rủi ro</div><div class="lz-d">khả năng × tác động; High cần test trên tầng Unit</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Tầng</div><div class="lz-d">tầng nào NHÌN THẤY từng rủi ro — đo thật</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Ngân sách</div><div class="lz-d">số giây mỗi tầng; cái gì chạy ở đâu</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Tiêu chí</div><div class="lz-d">vào, ra, definition of done</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Truy vết</div><div class="lz-d">mọi yêu cầu → một test xanh, CI kiểm</div></div>
</div>`;

const RISK_EN = `<table>
<thead><tr><th>#</th><th>Risk</th><th>L</th><th>I</th><th>Score</th><th>Tested where</th></tr></thead>
<tbody>
<tr><td>R1</td><td>Lite-3 read in the server's time zone, not Viet Nam's</td><td>3</td><td>3</td><td><strong>9</strong></td><td>Unit decision table, Stryker in UTC, nightly in VN time</td></tr>
<tr><td>R2</td><td>a student sees or cancels someone else's booking (AC1, AC3)</td><td>2</td><td>3</td><td><strong>6</strong></td><td>API per role, contract, E2E</td></tr>
<tr><td>R3</td><td>PostgreSQL keeps a cancelled slot blocked (AC5)</td><td>3</td><td>2</td><td><strong>6</strong></td><td>DB integration</td></tr>
<tr><td>R4</td><td>dates come back as JS Dates: contract broken (AC1)</td><td>3</td><td>2</td><td><strong>6</strong></td><td>DB + openapi.json check</td></tr>
<tr><td>R5</td><td>the overlap query change breaks booking (BR-04, BR-06)</td><td>2</td><td>3</td><td><strong>6</strong></td><td>unit, DB, mutation, E2E</td></tr>
<tr><td>R6</td><td>two cancels at the same moment both succeed (AC4)</td><td>2</td><td>2</td><td>4</td><td>DB race test</td></tr>
<tr><td>R7</td><td>the screen calls the wrong URL (stub clients cannot see it)</td><td>1</td><td>3</td><td>3</td><td>one E2E journey</td></tr>
<tr><td>R8</td><td>the user is not told, or clicks twice (AC2)</td><td>2</td><td>1</td><td>2</td><td>component tests</td></tr>
</tbody></table>`;
const RISK_VI = `<table>
<thead><tr><th>#</th><th>Rủi ro</th><th>K</th><th>T</th><th>Điểm</th><th>Test ở đâu</th></tr></thead>
<tbody>
<tr><td>R1</td><td>Lite-3 bị đọc theo múi giờ máy chủ, không theo giờ Việt Nam</td><td>3</td><td>3</td><td><strong>9</strong></td><td>bảng quyết định Unit, Stryker theo UTC, chạy đêm theo giờ VN</td></tr>
<tr><td>R2</td><td>sinh viên xem hoặc huỷ được lượt của người khác (AC1, AC3)</td><td>2</td><td>3</td><td><strong>6</strong></td><td>API theo vai trò, hợp đồng, E2E</td></tr>
<tr><td>R3</td><td>PostgreSQL vẫn chặn khung đã huỷ (AC5)</td><td>3</td><td>2</td><td><strong>6</strong></td><td>tích hợp CSDL</td></tr>
<tr><td>R4</td><td>ngày trả về dạng JS Date: vỡ hợp đồng (AC1)</td><td>3</td><td>2</td><td><strong>6</strong></td><td>CSDL + kiểm openapi.json</td></tr>
<tr><td>R5</td><td>sửa câu truy vấn trùng giờ làm hỏng việc đặt (BR-04, BR-06)</td><td>2</td><td>3</td><td><strong>6</strong></td><td>unit, CSDL, mutation, E2E</td></tr>
<tr><td>R6</td><td>hai lượt huỷ cùng lúc đều thành công (AC4)</td><td>2</td><td>2</td><td>4</td><td>test tranh chấp trên CSDL</td></tr>
<tr><td>R7</td><td>màn hình gọi sai URL (client giả không thấy được)</td><td>1</td><td>3</td><td>3</td><td>một hành trình E2E</td></tr>
<tr><td>R8</td><td>người dùng không được báo, hoặc bấm hai lần (AC2)</td><td>2</td><td>1</td><td>2</td><td>test component</td></tr>
</tbody></table>`;
const KHI_EN = `<table>
<thead><tr><th>The risk is about…</th><th>Cheapest layer that can SEE it</th></tr></thead>
<tbody>
<tr><td>a rule: a boundary, a role, a time zone</td><td>Unit (a decision table)</td></tr>
<tr><td>status codes, who may see what, the JSON shape</td><td>API (Supertest + openapi.json)</td></tr>
<tr><td>SQL, constraints, races, how the driver returns types</td><td>DB integration on the real engine</td></tr>
<tr><td>what one screen shows in each state</td><td>UI component test</td></tr>
<tr><td>the wiring between screen, API and storage</td><td>one E2E journey</td></tr>
</tbody></table>`;
const KHI_VI = `<table>
<thead><tr><th>Rủi ro nằm ở…</th><th>Tầng rẻ nhất NHÌN THẤY được nó</th></tr></thead>
<tbody>
<tr><td>một luật: giá trị biên, vai trò, múi giờ</td><td>Unit (bảng quyết định)</td></tr>
<tr><td>mã trạng thái, ai được xem gì, hình dạng JSON</td><td>API (Supertest + openapi.json)</td></tr>
<tr><td>SQL, ràng buộc, tranh chấp, driver trả kiểu dữ liệu ra sao</td><td>Tích hợp CSDL trên engine thật</td></tr>
<tr><td>một màn hình hiện gì ở từng trạng thái</td><td>Test component giao diện</td></tr>
<tr><td>sợi dây nối màn hình, API và nơi lưu</td><td>Một hành trình E2E</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🔺', 'Martin Fowler / Ham Vocke — The Practical Test Pyramid', 'Why many fast low-level tests and few broad ones; what each layer is for.', 'https://martinfowler.com/articles/practical-test-pyramid.html'),
].join('\n');

export default {
  title: '11.1 — Planning the test strategy|||11.1 — Lập chiến lược test',
  slug: 'tst-11-1-ke-hoach',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lập kế hoạch test cho một bản phát hành thật của LabFlow Lite — US-11 "My bookings" (xem và huỷ lượt đặt, 6 tiêu chí chấp nhận): phạm vi trong/ngoài, bảng rủi ro khả năng × tác động, 12 bug cài vào được chấm qua 5 tầng (Unit 5/12, API 6/12, UI 1/12, DB 4/12, E2E 2/12 — không tầng nào thấy quá nửa, bug nào cũng có tầng duy nhất thấy nó), ngân sách kim tự tháp đo bằng giây, tiêu chí vào/ra và Definition of Done; ma trận truy vết sinh từ báo cáo test thật (lần đầu đếm khống 16 test cho AC6 vì nhãn đặt ở describe) và lỗi LF-301 nó tìm ra: API không hề kiểm BR-05.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Planning the test strategy</h2>
<p class="lead">For ten chapters you learned one kind of test at a time. A real team asks another question: <em>here is the next release — how will you test it, and how will we know it is ready?</em> This lesson answers it for one real release of LabFlow Lite, with measured numbers.</p>
<p><strong>After this lesson you can</strong> start a test plan from scope and risks, choose the layer for each risk with evidence, give the pyramid a budget in seconds, write checkable entry and exit criteria and a definition of done, and generate a traceability matrix from real test reports. <strong>Why it is useful:</strong> “what is your test strategy?” separates someone who writes tests from someone a team trusts with a release — and it is exactly what the test plan of SWT301, SWP391 and your graduation project must show.</p>

<h3>The plan, in six steps</h3>
${FLOW_EN}
<p>The plan lives in the repository — <code>test-plan/TEST-PLAN.md</code> for people, <code>test-plan/requirements.json</code> for scripts — so it is reviewed in the same pull request as the code.</p>

<h3>Step 1 — the release and its scope</h3>
<p>Release 1.1 adds one user story, <strong>US-11 “My bookings”</strong>: a student lists their own bookings and can cancel one — six acceptance criteria, AC1…AC6 (slide 3), stored in <code>test-plan/requirements.json</code> with a risk level each.</p>

<p><strong>In scope:</strong> the two new endpoints, the PostgreSQL adapter and its exclusion constraint, the <code>MyBookings</code> screen — and regression of what US-11 touches (BR-04, BR-05, BR-06, Lite-1, Lite-2). <strong>Out of scope:</strong> BR-02, BR-07…BR-10: tested library code that no endpoint calls in 1.1. The “out” list stops a team from spending a week on things this release cannot break.</p>

<h3>Step 2 — risks, before tests</h3>
<p>A risk is something that can go wrong <em>for a user</em>. Score it: likelihood (L) and impact (I), each from 1 to 3; score = L × I (the same risk level as SWT301 7.5). The plan's rule: <strong>6 or more is High, and a High risk needs at least one test above the Unit layer.</strong></p>
${RISK_EN}
<div class="pitfall co-tieu-de"><strong>A risk table without a “where” column is decoration.</strong> Teams list risks, then write the unit tests they would have written anyway. Every row must name the layer that will catch it — the next section checks those claims with data.</div>

<h3>Step 3 — which layer can see which bug? Measured</h3>
<p><code>scripts/ma-tran-bat-loi.mjs</code> plants twelve real US-11 bugs one at a time and runs <strong>every</strong> layer's US-11 tests against each — without stopping at the first red, so each layer's blind spots show:</p>
${ra(MATRAN)}
<p>The best layer, API, caught 6 of 12. Bugs 6, 7 and 8 were seen <em>only</em> by the DB layer, bug 11 only by a component test, bug 12 only by the E2E journey. No layer sees half; every layer sees something nobody else does. That is the honest reason for a pyramid — a table measured on your own project.</p>
${KHI_EN}

<h3>Step 4 — the pyramid has a budget in seconds</h3>
<p>Every layer costs time on every run. <code>scripts/ngan-sach.mjs</code> runs each suite three times in a fresh process and keeps the median:</p>
${ra(NGAN)}
<p>One E2E test costs about 100 times one unit test (521 ms vs 5 ms). From those numbers the plan sets three rules:</p>
<ul>
<li><strong>Before a push</strong> (unit, UI, DB): under 15 s — today 1.6 + 2.3 + 1.5 = 5.4 s.</li>
<li><strong>Every pull request</strong> (plus E2E in Chromium and mutation): under 10 minutes — act on a laptop measured 8 min 48 s warm, 11 min cold, of which installing Chromium was about 6½ minutes (lesson 11.4).</li>
<li><strong>Every night:</strong> five browsers and devices, shuffled order, the Viet Nam time zone.</li>
</ul>

<h3>Step 5 — entry criteria, exit criteria, definition of done</h3>
<p><em>Entry criteria</em> (tiêu chí vào) say when testing can start; <em>exit criteria</em> (tiêu chí ra) say when the release can ship. Write them so a script or a reviewer can answer yes or no — “tested enough” cannot be checked, “coverage at least 97% lines” can.</p>
<p>Entry: the six ACs are agreed and written in <code>requirements.json</code>; the branch builds from the lockfile; Docker and Chromium are available. Exit, from the plan:</p>
${ma('markdown', PLAN_EXIT)}
<p>The <em>definition of done</em> is per story: every AC has a passing test tagged with its id, the tests were reviewed with the checklist of lesson 10.3, <code>openapi.json</code> documents every new status code, no <code>.only</code> or skipped test was added, and the plan's numbers are updated.</p>

<h3>Step 6 — a traceability matrix that cannot lie</h3>
<p>A <em>traceability matrix</em> (RTM) links each requirement to the tests that prove it. Here it is not filled in by hand: it is generated from the reports of tests that really ran. The convention: <strong>a test proves a requirement when its full name carries the id</strong> — <code>(BR-04)</code>, or <code>(US-11)</code> on the describe and <code>(AC4)</code> on the test. <code>src/ci/rtm.js</code> reads the ids:</p>
${ma('javascript', TAGS)}
<p>A gap is the risk table's rule: an in-scope requirement with no passing test, or a High one tested only at the Unit layer. The first run, before the tags were precise:</p>
${ra(RTM1)}
<div class="pitfall co-tieu-de"><strong>Tag the narrowest test, never a whole describe.</strong> The API tests sat under <code>describe('… (US-11 AC2–AC6)')</code>; a full name includes the describe titles, so all 16 tests claimed all five criteria — 16 tests “proved” AC6, the admin rule, when two involve an admin. A matrix that over-claims makes a gap look covered.</div>
<p>The same run showed what was <em>missing</em>: Lite-1 and Lite-2 had tests but no name said so, and BR-06 (High) was proven only at Unit. The final run, after precise tags and the API tests of the practices in 11.1 and 11.4 (lesson 11.3 tells a side effect of renaming tests):</p>
${ra(RTM)}

<h3>What the matrix found: LF-301</h3>
<p>Look at BR-05 in the final matrix: 12 unit tests, nothing above. It is Medium, so the gate lets it pass — but why is there no API test? Ask the API:</p>
${ma('javascript', LF_TEST)}
${ra(LF)}
<p>The API accepts a booking 30 days ahead. <code>isWithinBookingWindow</code> and <code>daysAheadVN</code> are correct and well tested — and no endpoint calls them. The matrix shows <em>where</em> a rule is proven, not only <em>that</em> it is.</p>
<p>Now the exit criteria decide: BR-05 is Medium, and a Medium defect may ship with an owner and a date. The plan logs <strong>LF-301</strong> — accepted for 1.1, owner backend, fixed in 1.2 starting from this red test. Without written criteria this is an argument; with them, a two-minute decision.</p>

<h3>JUnit and Spring</h3>
<p>The same convention in Java: <code>@DisplayName("… (AC4)")</code> or JUnit 5 <code>@Tag("US-11-AC4")</code> with <code>mvn test -Dgroups=…</code>. Xray and TestRail link tests by key the same way; SWT301's Report 5.x keeps it by hand.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Lite-2 — “lecturers and admins never need approval” — is tested only at the Unit layer. Write <code>src/api/rules.api.test.js</code>: through the API, 40 seats as LECTURER and ADMIN are CONFIRMED (Lite-2), as STUDENT PENDING (BR-06). Run the unit suite with a JSON report, then read the Lite-2 row of the matrix — before your test it reads <code>| Lite-2 | Medium | 2 | · | · | · | · | ✅ |</code>.</p>

<p><strong>Solution and real output:</strong></p>
${ma('javascript', TH_TEST)}
${ra(TH_RUN)}
${ra(TH_SAU)}
<p><strong>Done when</strong> the three tests pass, Lite-2 shows 2 in the API column, and you can say why the id goes on each row (<code>$rule</code>), not on the describe.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test plan (kế hoạch test)</span><span class="v">Scope, risks, approach, criteria — what will be tested, how, and when it is enough.</span></div>
  <div class="kv"><span class="k">test pyramid (kim tự tháp test)</span><span class="v">Many fast low-level tests, fewer slow broad ones — sized by cost, justified by what each layer can see.</span></div>
  <div class="kv"><span class="k">entry / exit criteria (tiêu chí vào / ra)</span><span class="v">Checkable conditions to start testing and to ship.</span></div>
  <div class="kv"><span class="k">traceability matrix, RTM (ma trận truy vết)</span><span class="v">Requirement → the passing tests that prove it, per layer.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Plan from the release: scope in and out, then risks scored likelihood × impact; High needs a test above Unit.</li>
<li>Measure which layer sees which bug: in LabFlow no layer saw more than 6 of 12, and 7 of the 12 bugs were seen by exactly one layer.</li>
<li>Give each layer a budget in seconds: pre-push under 15 s, pull request under 10 minutes, the rest at night.</li>
<li>Write exit criteria a script can check; generate the traceability matrix from real reports; tag the narrowest test.</li>
<li>The matrix found LF-301: a well-tested rule that no endpoint calls.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-test-plan-risk', title: 'Theory in SWT301 — 7.2: test planning and estimation', sub: 'Same: what a test plan contains, test strategies, entry and exit criteria. Deeper here: a plan whose numbers are measured on a real project, and whose traceability matrix is generated from test reports and blocks the merge.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'sep490-se-capstone-project', bai: 'sep490-3-1-build-test-release', title: 'SEP490 — 3.1: coding, testing and release', sub: 'There: trace each test back to a requirement in your graduation project. Here: how to make that traceability automatic and trustworthy.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Lập chiến lược test</h2>
<p class="lead">Suốt mười chương bạn học từng loại test một. Một đội thật hỏi câu khác: <em>đây là bản phát hành tới — bạn sẽ test nó thế nào, và làm sao biết nó đã sẵn sàng?</em> Bài này trả lời câu đó cho một bản phát hành thật của LabFlow Lite, bằng số đo.</p>
<p><strong>Sau bài này bạn có thể</strong> bắt đầu kế hoạch test (test plan) từ phạm vi và rủi ro, chọn tầng test cho từng rủi ro bằng bằng chứng, đặt ngân sách tính bằng giây cho kim tự tháp, viết tiêu chí vào/ra và definition of done (định nghĩa hoàn thành) kiểm được, và sinh ma trận truy vết từ báo cáo test thật. <strong>Vì sao hữu ích:</strong> “chiến lược test của bạn là gì?” phân biệt người biết viết test với người được giao cả bản phát hành — và đó chính là điều test plan ở SWT301, SWP391 hay đồ án tốt nghiệp phải thể hiện.</p>

<h3>Kế hoạch, trong sáu bước</h3>
${FLOW_VI}
<p>Kế hoạch nằm trong repository — <code>test-plan/TEST-PLAN.md</code> cho người đọc, <code>test-plan/requirements.json</code> cho script — nên nó được review trong cùng pull request với code.</p>

<h3>Bước 1 — bản phát hành và phạm vi</h3>
<p>Bản 1.1 thêm một user story, <strong>US-11 “My bookings”</strong>: sinh viên xem lượt đặt của chính mình và huỷ được một lượt — sáu tiêu chí chấp nhận (acceptance criteria), AC1…AC6 (slide 3), lưu trong <code>test-plan/requirements.json</code> kèm mức rủi ro.</p>

<p><strong>Trong phạm vi:</strong> hai endpoint mới, adapter PostgreSQL và ràng buộc loại trừ (exclusion constraint) của nó, màn hình <code>MyBookings</code> — và kiểm thử hồi quy (regression) những gì US-11 đụng tới (BR-04, BR-05, BR-06, Lite-1, Lite-2). <strong>Ngoài phạm vi:</strong> BR-02, BR-07…BR-10: code thư viện đã test nhưng ở 1.1 không endpoint nào gọi. Danh sách “ngoài” ngăn cả đội mất một tuần vào thứ bản này không thể làm hỏng.</p>

<h3>Bước 2 — rủi ro, trước test</h3>
<p>Rủi ro là điều có thể hỏng <em>với người dùng</em>. Chấm điểm nó: khả năng xảy ra (K) và tác động (T), mỗi thứ từ 1 tới 3; điểm = K × T (đúng mức rủi ro của SWT301 bài 7.5). Luật của kế hoạch: <strong>từ 6 trở lên là High, và rủi ro High cần ít nhất một test ở tầng trên Unit.</strong></p>
${RISK_VI}
<div class="pitfall co-tieu-de"><strong>Bảng rủi ro không có cột “test ở đâu” chỉ là đồ trang trí.</strong> Các đội liệt kê rủi ro rồi viết đúng những unit test họ vẫn sẽ viết. Mỗi dòng phải gọi tên tầng sẽ bắt nó — mục sau kiểm các lời khẳng định đó bằng dữ liệu.</div>

<h3>Bước 3 — tầng nào nhìn thấy bug nào? Đo thật</h3>
<p><code>scripts/ma-tran-bat-loi.mjs</code> cài lần lượt mười hai bug thật của US-11 và chạy test US-11 của <strong>mọi</strong> tầng với từng bug — không dừng ở lần đỏ đầu tiên, để thấy điểm mù của từng tầng:</p>
${ra(MATRAN)}
<p>Tầng tốt nhất, API, bắt 6/12. Bug 6, 7 và 8 <em>chỉ</em> tầng DB thấy, bug 11 chỉ test component thấy, bug 12 chỉ hành trình E2E thấy. Không tầng nào thấy nửa số bug; tầng nào cũng thấy thứ tầng khác không thấy. Đó là lý do trung thực cho kim tự tháp — một bảng đo trên chính dự án của bạn.</p>
${KHI_VI}

<h3>Bước 4 — kim tự tháp có ngân sách tính bằng giây</h3>
<p>Tầng nào cũng tốn thời gian ở mỗi lần chạy. <code>scripts/ngan-sach.mjs</code> chạy mỗi bộ test ba lần, mỗi lần một tiến trình mới, và giữ trung vị:</p>
${ra(NGAN)}
<p>Một test E2E tốn khoảng 100 lần một unit test (521 ms so với 5 ms). Từ các con số đó, kế hoạch đặt ba luật:</p>
<ul>
<li><strong>Trước khi push</strong> (unit, UI, DB): dưới 15 giây — hôm nay 1,6 + 2,3 + 1,5 = 5,4 giây.</li>
<li><strong>Mọi pull request</strong> (thêm E2E trên Chromium và mutation): dưới 10 phút — act trên laptop đo được 8 phút 48 giây khi cache ấm, 11 phút khi nguội, riêng cài Chromium khoảng 6 phút rưỡi (bài 11.4).</li>
<li><strong>Mỗi đêm:</strong> năm trình duyệt và thiết bị, thứ tự xáo trộn, múi giờ Việt Nam.</li>
</ul>

<h3>Bước 5 — tiêu chí vào, tiêu chí ra, definition of done</h3>
<p><em>Entry criteria</em> (tiêu chí vào) nói khi nào được bắt đầu test; <em>exit criteria</em> (tiêu chí ra) nói khi nào bản phát hành được ra. Hãy viết sao cho một script hoặc người review trả lời được có hay không — “test đủ rồi” không kiểm được, “độ phủ dòng tối thiểu 97%” thì kiểm được.</p>
<p>Tiêu chí vào: sáu AC đã thống nhất và ghi trong <code>requirements.json</code>; nhánh build được từ lockfile; có Docker và Chromium. Tiêu chí ra, lấy từ kế hoạch:</p>
${ma('markdown', PLAN_EXIT)}
<p><em>Definition of done</em> áp cho từng story: mỗi AC có một test xanh mang mã của nó, test đã được review theo checklist bài 10.3, <code>openapi.json</code> mô tả mọi mã trạng thái mới, không thêm <code>.only</code> hay test bị bỏ qua, và số liệu trong kế hoạch được cập nhật.</p>

<h3>Bước 6 — ma trận truy vết không thể nói dối</h3>
<p><em>Ma trận truy vết</em> (traceability matrix, RTM) nối mỗi yêu cầu với các test chứng minh nó. Ở đây nó không điền tay: nó được sinh từ báo cáo của những test đã thật sự chạy. Quy ước: <strong>một test chứng minh một yêu cầu khi tên đầy đủ của nó mang mã yêu cầu</strong> — <code>(BR-04)</code>, hoặc <code>(US-11)</code> ở describe và <code>(AC4)</code> ở test. <code>src/ci/rtm.js</code> đọc các mã:</p>
${ma('javascript', TAGS)}
<p>Lỗ hổng là đúng luật của bảng rủi ro: một yêu cầu trong phạm vi chưa có test xanh nào, hoặc một yêu cầu High chỉ được test ở tầng Unit. Lần chạy đầu, khi nhãn chưa chính xác:</p>
${ra(RTM1)}
<div class="pitfall co-tieu-de"><strong>Gắn nhãn cho test hẹp nhất, đừng gắn cho cả describe.</strong> Các test API nằm dưới <code>describe('… (US-11 AC2–AC6)')</code>; tên đầy đủ có cả tiêu đề describe, nên cả 16 test nhận đủ năm tiêu chí — 16 test “chứng minh” AC6, luật của admin, trong khi chỉ hai test có admin. Ma trận khai khống khiến lỗ hổng trông như đã được phủ.</div>
<p>Cùng lần chạy cho thấy cái <em>còn thiếu</em>: Lite-1 và Lite-2 có test mà không tên nào nói ra, và BR-06 (High) chỉ được chứng minh ở Unit. Lần chạy cuối, sau khi gắn nhãn chính xác và thêm test API của phần thực hành 11.1, 11.4 (bài 11.3 kể một tác dụng phụ của việc đổi tên test):</p>
${ra(RTM)}

<h3>Ma trận tìm ra gì: LF-301</h3>
<p>Nhìn BR-05 trong ma trận cuối: 12 unit test, không có gì ở tầng trên. Nó là Medium nên cổng cho qua — nhưng vì sao không có test API nào? Hỏi thẳng API:</p>
${ma('javascript', LF_TEST)}
${ra(LF)}
<p>API nhận lượt đặt trước 30 ngày. <code>isWithinBookingWindow</code> và <code>daysAheadVN</code> đúng và được test kỹ — nhưng không endpoint nào gọi chúng. Ma trận cho thấy luật được chứng minh <em>ở đâu</em>, không chỉ <em>có hay không</em>.</p>
<p>Giờ tiêu chí ra quyết định: BR-05 là Medium, lỗi Medium được phát hành nếu có người phụ trách và ngày sửa. Kế hoạch ghi <strong>LF-301</strong> — chấp nhận cho 1.1, phụ trách backend, sửa ở 1.2 bắt đầu từ chính test đỏ này. Không có tiêu chí viết sẵn thì là tranh cãi; có rồi thì là quyết định hai phút.</p>

<h3>JUnit và Spring</h3>
<p>Quy ước này trong Java: <code>@DisplayName("… (AC4)")</code> hoặc <code>@Tag("US-11-AC4")</code> của JUnit 5 cùng <code>mvn test -Dgroups=…</code>. Xray và TestRail nối test theo mã y như vậy; Report 5.x của SWT301 giữ nó bằng tay.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Lite-2 — “giảng viên và admin không bao giờ cần duyệt” — chỉ được test ở tầng Unit. Viết <code>src/api/rules.api.test.js</code>: qua API, 40 chỗ với vai trò LECTURER và ADMIN thì CONFIRMED (Lite-2), với STUDENT thì PENDING (BR-06). Chạy bộ unit có báo cáo JSON, rồi đọc dòng Lite-2 của ma trận — trước khi có test của bạn, nó là <code>| Lite-2 | Medium | 2 | · | · | · | · | ✅ |</code>.</p>

<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', TH_TEST)}
${ra(TH_RUN)}
${ra(TH_SAU)}
<p><strong>Xong khi</strong> ba test xanh, Lite-2 có số 2 ở cột API, và bạn giải thích được vì sao mã nằm ở từng dòng (<code>$rule</code>) chứ không ở describe.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test plan (kế hoạch test)</span><span class="v">Phạm vi, rủi ro, cách tiếp cận, tiêu chí — test gì, test thế nào, khi nào là đủ.</span></div>
  <div class="kv"><span class="k">test pyramid (kim tự tháp test)</span><span class="v">Nhiều test thấp tầng nhanh, ít test rộng chậm — kích thước theo chi phí, lý do theo thứ mỗi tầng nhìn thấy.</span></div>
  <div class="kv"><span class="k">entry / exit criteria (tiêu chí vào / ra)</span><span class="v">Điều kiện kiểm được để bắt đầu test và để phát hành.</span></div>
  <div class="kv"><span class="k">traceability matrix, RTM (ma trận truy vết)</span><span class="v">Yêu cầu → các test xanh chứng minh nó, theo từng tầng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lập kế hoạch từ bản phát hành: phạm vi trong và ngoài, rồi rủi ro chấm theo khả năng × tác động; High cần test trên tầng Unit.</li>
<li>Đo xem tầng nào thấy bug nào: ở LabFlow không tầng nào thấy quá 6/12, và 7 trong 12 bug chỉ đúng một tầng nhìn thấy.</li>
<li>Cho mỗi tầng một ngân sách tính bằng giây: trước khi push dưới 15 giây, pull request dưới 10 phút, phần còn lại chạy đêm.</li>
<li>Viết tiêu chí ra mà script kiểm được; sinh ma trận truy vết từ báo cáo thật; gắn nhãn cho test hẹp nhất.</li>
<li>Ma trận tìm ra LF-301: một luật được test kỹ mà không endpoint nào gọi.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-test-plan-risk', title: 'Lý thuyết ở SWT301 — 7.2: lập kế hoạch và ước lượng test', sub: 'Giống: test plan gồm những gì, các chiến lược test, tiêu chí vào và ra. Sâu thêm ở đây: một kế hoạch có số liệu đo trên dự án thật, và ma trận truy vết sinh từ báo cáo test, chặn được việc merge.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'sep490-se-capstone-project', bai: 'sep490-3-1-build-test-release', title: 'SEP490 — 3.1: lập trình, kiểm thử và phát hành', sub: 'Ở đó: truy mỗi test về một yêu cầu trong đồ án tốt nghiệp. Ở đây: làm sao để việc truy vết đó tự động và đáng tin.', cta: 'MỞ BÀI →' })}
</div>
`,
};
