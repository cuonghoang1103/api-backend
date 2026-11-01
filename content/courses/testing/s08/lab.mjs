/**
 * Testing · Chương 8 · Lab 8 — Mạnh và ổn định: từ 100% độ phủ và 3/8 đột biến tới 8/8, ở mọi thứ tự. BÀI MỚI 01/11/2026, slug tst-8-5-lab-chat-luong.
 * Máy chấm scripts/dot-bien-8.mjs (một file test: xanh ở 10 thứ tự xáo trộn --sequence.seed=1..10, rồi 8 đột biến trong src/rules/checkin.js).
 * Output thật: bộ yếu 8 test xanh theo thứ tự file, 100% dòng/hàm/câu lệnh, 93,75% nhánh; đỏ 10/20 lần khi xáo; xanh 4/10 thứ tự, diệt 3/8.
 * Lời giải: 100% cả bốn chỉ số, 10/10 thứ tự, 8/8 (9,7 s); Stryker trên checkin.js: 98,65% (sống 1: no-show đúng hôm nay) → thêm test thứ 16 → 100%.
 * Lưu ý: lab8-ref-run, lab8-mut chạy với bản cuối (16 test); lab8-stryker-1 chạy TRƯỚC khi thêm test thứ 16 (bonus Stryker); lab8-unit = 116 test.
 */
import G from '../giang/tst-lab-8.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const YEU_RUN = loc('lab8-yeu-run', /^\$ |Tests  |All files|checkin\.js|^Branches/);
const YEU_SEED = loc('lab8-yeu-seed', /^\$ |seed "|✓ too|✓ on|✓ a |✓ pending|× |AssertionError|Tests  /);
const REF_RUN = loc('lab8-ref-run', /^\$ |Tests  |All files|checkin\.js|^Branches/);
const ST1 = loc('lab8-stryker-1', /^\$ |Instrumented|\[Survived\]|^src\/|^[-+] |^All files|Done in/);
const ST2 = loc('lab8-stryker-2', /^\$ |^All files|Done in/);
const NGUON = [
  nguon('🧬', 'Stryker — Mutant states and metrics', 'Killed, Survived, No coverage, Timeout; how the mutation score is computed.', 'https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/'),
  nguon('🔀', 'Vitest — sequence (shuffle, seed)', 'Run files and tests in a random order; a seed reproduces one order exactly.', 'https://vitest.dev/config/sequence'),
].join('\n');

const BUG_EN = `<table>
<thead><tr><th>#</th><th>Planted bug in checkin.js</th><th>What a user would notice</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>t &lt;= start - EARLY</code></td><td>a student who arrives exactly 10 minutes early is told “too early”</td></tr>
<tr><td>2</td><td><code>t &gt;= start + GRACE</code></td><td>arriving at 08:15 for an 08:00 booking already counts as a no-show</td></tr>
<tr><td>3</td><td><code>late: t &gt;= start</code></td><td>a student who is exactly on time is recorded as late</td></tr>
<tr><td>4</td><td><code>status === 'CANCELLED'</code> instead of <code>!== 'CONFIRMED'</code></td><td>a booking still waiting for approval can be used</td></tr>
<tr><td>5</td><td><code>t - d &lt;= LOOKBACK_DAYS</code></td><td>a no-show from 30 days ago still counts toward a ban</td></tr>
<tr><td>6</td><td><code>recent.length &lt;= STRIKES</code></td><td>three no-shows bring no ban; it takes four</td></tr>
<tr><td>7</td><td><code>Math.min(...recent)</code></td><td>the ban is counted from the first no-show, so it is shorter or already over</td></tr>
<tr><td>8</td><td><code>end &lt;= t ? null</code></td><td>on the last day of the ban the student can book again</td></tr>
</tbody></table>`;
const BUG_VI = `<table>
<thead><tr><th>#</th><th>Bug cài vào checkin.js</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>t &lt;= start - EARLY</code></td><td>sinh viên tới sớm đúng 10 phút bị báo “quá sớm”</td></tr>
<tr><td>2</td><td><code>t &gt;= start + GRACE</code></td><td>tới lúc 08:15 cho lượt 08:00 đã bị tính là vắng mặt</td></tr>
<tr><td>3</td><td><code>late: t &gt;= start</code></td><td>sinh viên tới đúng giờ bị ghi là trễ</td></tr>
<tr><td>4</td><td><code>status === 'CANCELLED'</code> thay cho <code>!== 'CONFIRMED'</code></td><td>lượt đặt còn chờ duyệt vẫn check-in được</td></tr>
<tr><td>5</td><td><code>t - d &lt;= LOOKBACK_DAYS</code></td><td>lần vắng cách đây 30 ngày vẫn bị tính vào lệnh cấm</td></tr>
<tr><td>6</td><td><code>recent.length &lt;= STRIKES</code></td><td>vắng ba lần chưa bị cấm; phải tới lần thứ tư</td></tr>
<tr><td>7</td><td><code>Math.min(...recent)</code></td><td>lệnh cấm tính từ lần vắng đầu tiên nên ngắn hơn hoặc đã hết</td></tr>
<tr><td>8</td><td><code>end &lt;= t ? null</code></td><td>ngày cuối của lệnh cấm sinh viên đã đặt lại được</td></tr>
</tbody></table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-8.mjs</code></td></tr>
<tr><td>Order-independent: green in 10 shuffled orders</td><td>1.5</td><td>first line of the same script</td></tr>
<tr><td>Boundaries named in test titles (<code>it.each</code> tables: 07:49/07:50, 08:00/08:01, 08:15/08:16, 29/30 days, last ban day)</td><td>1.5</td><td>read the tests</td></tr>
<tr><td>Exact assertions (<code>toEqual</code>, <code>toBe</code>) — no <code>toBeTruthy</code>, <code>toBeDefined</code>, <code>not.toBeNull</code> as the only check</td><td>1</td><td>read the tests</td></tr>
<tr><td>Branch coverage of checkin.js is 100%</td><td>1</td><td><code>npx vitest run src/rules/checkin.test.js --coverage --coverage.include=src/rules/checkin.js</code></td></tr>
<tr><td>No real clock, no shared mutable state between tests</td><td>1</td><td>read the tests</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-8.mjs</code></td></tr>
<tr><td>Không phụ thuộc thứ tự: xanh ở 10 thứ tự xáo trộn</td><td>1,5</td><td>dòng đầu của chính script đó</td></tr>
<tr><td>Giá trị biên nằm trong tên test (bảng <code>it.each</code>: 07:49/07:50, 08:00/08:01, 08:15/08:16, 29/30 ngày, ngày cuối lệnh cấm)</td><td>1,5</td><td>đọc test</td></tr>
<tr><td>Khẳng định chính xác (<code>toEqual</code>, <code>toBe</code>) — không dùng <code>toBeTruthy</code>, <code>toBeDefined</code>, <code>not.toBeNull</code> làm phép kiểm duy nhất</td><td>1</td><td>đọc test</td></tr>
<tr><td>Độ phủ nhánh của checkin.js là 100%</td><td>1</td><td><code>npx vitest run src/rules/checkin.test.js --coverage --coverage.include=src/rules/checkin.js</code></td></tr>
<tr><td>Không dùng đồng hồ thật, không có trạng thái thay đổi được dùng chung giữa các test</td><td>1</td><td>đọc test</td></tr>
</tbody></table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">10 shuffled orders</div><div class="lz-d">vitest run &lt;file&gt; --sequence.shuffle --sequence.seed=1…10 — all must pass</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">plant one bug</div><div class="lz-d">one exact text in src/rules/checkin.js is replaced</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">run the file once</div><div class="lz-d">red = killed, green = survived</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">restore</div><div class="lz-d">in finally — even if you stop the script</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">verdict</div><div class="lz-d">exit 0 only with 10/10 orders and 8/8 mutants</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">10 thứ tự xáo trộn</div><div class="lz-d">vitest run &lt;file&gt; --sequence.shuffle --sequence.seed=1…10 — lần nào cũng phải xanh</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">cài một bug</div><div class="lz-d">thay đúng một đoạn chữ trong src/rules/checkin.js</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">chạy file một lần</div><div class="lz-d">đỏ = diệt được, xanh = sống sót</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">trả file về</div><div class="lz-d">trong finally — kể cả khi bạn dừng script giữa chừng</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">kết luận</div><div class="lz-d">thoát 0 chỉ khi 10/10 thứ tự và 8/8 đột biến</div></div>
</div>`;

export default {
  title: 'Lab 8 — Strong and stable: from 100% coverage and 3/8 mutants to 8/8, in any order|||Lab 8 — Mạnh và ổn định: từ 100% độ phủ và 3/8 đột biến tới 8/8, ở mọi thứ tự',
  slug: 'tst-8-5-lab-chat-luong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 8, thang chấm 10 điểm: luật mới check-in (BR-07: mở 10 phút trước, đóng 15 phút sau giờ bắt đầu) và cấm đặt vì vắng mặt (BR-08: 3 lần trong 30 ngày ⇒ cấm tới 7 ngày sau lần gần nhất). Bộ test yếu có sẵn đạt 100% dòng nhưng chỉ diệt 3/8 đột biến và đỏ 10/20 lần khi xáo thứ tự (dùng chung một sổ vắng mặt); máy chấm dot-bien-8.mjs kiểm 10 thứ tự xáo trộn rồi 8 đột biến. Lời giải: bảng giá trị biên, khẳng định chính xác, mỗi test dữ liệu riêng ⇒ 100% nhánh, 10/10 thứ tự, 8/8; Stryker tìm thêm một lỗ (lần vắng đúng hôm nay) ⇒ 100%.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8</span>
<h2>Strong and stable: from 3/8 to 8/8, in any order</h2>
<p class="lead">About 60–90 minutes. LabFlow Lite gets two new rules, and a teammate already wrote tests for them: every line is covered and the suite is green. This lab measures how much those tests are really worth — with the three tools of this chapter: coverage, mutants and a shuffled order — and then you make them strong and stable.</p>
<p><strong>After this lab you can</strong> read a green, 100%-covered suite with suspicion, turn business rules into boundary tables, replace weak assertions with exact ones, remove order dependence, and prove all of it with a script instead of a feeling. <strong>Why it is useful:</strong> in a real team you rarely write tests from nothing — you inherit a suite that “has good coverage” and still lets bugs through or fails once a week for no reason. Knowing how to measure and repair such a suite is exactly the work of lessons 8.1–8.3 put together.</p>

<h3>The new rules</h3>
<ul>
<li><strong>BR-07 — check-in.</strong> A CONFIRMED booking can be checked in from 10 minutes before its start until 15 minutes after it. Later than that is a <code>NO_SHOW</code>; after the start (but within the 15 minutes) the student is <em>late</em>. Any other status is refused with <code>NOT_CONFIRMED</code>.</li>
<li><strong>BR-08 — no-show ban.</strong> Three no-shows within the last 30 days ban new bookings until 7 days after the latest one; <code>bannedUntil</code> returns that last banned day, or <code>null</code>.</li>
</ul>
${ma('javascript', CODE.checkin)}
<p>Three boundaries live in <code>checkIn</code> (07:50, 08:00, 08:15 for an 08:00 booking) and three in <code>bannedUntil</code> (the 30-day window, the third strike, the last banned day). Keep them in mind: every planted bug sits on one of them.</p>

<h3>Setup</h3>
<ol>
<li>LabFlow Lite as it is after lesson 8.4, with <code>src/rules/checkin.js</code> above.</li>
<li>The starting tests are in <code>demo8/lab8-yeu.test.js</code>; copy them to <code>src/rules/checkin.test.js</code> (change the import to <code>./checkin.js</code>) and work there.</li>
<li>Create the grader <code>scripts/dot-bien-8.mjs</code>:
${ma('javascript', CODE.dotBien8)}</li>
</ol>
<p>It checks <strong>one</strong> test file twice: first in ten shuffled but reproducible orders (seeds 1–10, lesson 8.3), then against eight planted bugs, one at a time. Pass a file name to grade another file: <code>node scripts/dot-bien-8.mjs demo8/lab8-yeu.test.js</code>.</p>
${FLOW_EN}
${BUG_EN}

<h3>Your task</h3>
<p>Make <code>node scripts/dot-bien-8.mjs</code> print <strong>green in 10/10 shuffled orders</strong> and <strong>8/8 mutants killed</strong>, with <code>npm run test:unit</code> still green. Change no code in <code>checkin.js</code>. Start from the <em>rules</em>: write down each boundary of BR-07 and BR-08 with the value just inside and just outside it, then make each pair a row of an <code>it.each</code> table. The bug table only tells you afterwards how strong your suite turned out.</p>

<h3>The starting point: green, 100% lines — and weak</h3>
${ma('javascript', CODE.lab8Yeu)}
${ra(YEU_RUN)}
<p>Eight green tests, 100% of statements, functions and lines. Only branches say 93.75%, and the uncovered branch is line 30 — <code>end &lt; t ? null</code>, the end of a ban. Yet there <em>is</em> a test called “a ban ends”. Look at its dates: 2026-11-01, 05 and 10, checked on 2026-12-30 — all more than 30 days old, so <code>bannedUntil</code> already returns <code>null</code> at line 28 and never reaches the ban-end branch. The test name promises one thing, the test checks another, and only branch coverage noticed.</p>
<div class="pitfall co-tieu-de"><strong>A test name is a claim, not a proof.</strong> “a ban ends” passes for a different reason than its name says: the dates fell out of the 30-day window. Lesson 8.1 showed the same with lines; here a <em>branch</em> gave it away. When a covered branch is missing, read the test that was supposed to reach it.</div>

<h3>It is also flaky</h3>
${ra(OUT['lab8-yeu-lap'])}
${ra(YEU_SEED)}
<p>Never red in file order, red in 10 of 20 shuffled runs. With the seed printed by <code>lap-lai.mjs</code> the red order comes back exactly: “three no-shows ban the student” ran <em>before</em> “records a no-show”, so the one shared <code>log</code> held only two dates (no ban → <code>null</code>), and then “records a no-show” found three dates instead of one. The two tests are not independent: they are one test cut in two, glued by <code>const log = createNoShowLog()</code> at the top of the file.</p>
<div class="pitfall co-tieu-de"><strong>State at file level is shared by every test in the file.</strong> A <code>const</code> object created outside the tests is <em>one</em> object for all of them, and the default order hides the dependency until someone runs the file shuffled, filtered with <code>-t</code>, or adds a test in the middle. Create the log inside each test (or in <code>beforeEach</code>) and give each test the dates it needs.</div>

<h3>What the grader says</h3>
${ra(OUT['lab8-mut-yeu'])}
<p>Four orders out of ten and three bugs out of eight. Why the five survivors live:</p>
<ul>
<li><strong>#1, #2, #3</strong> — no test sits on a boundary. “too early” uses 07:00 (an hour before), “too late” uses 09:00, “on time” uses 08:05. 07:50, 08:00, 08:15 and 08:16 never appear. On top of that, “on time” asserts <code>toBeTruthy()</code> — every result object is truthy, even <code>{ ok: false, code: 'NO_SHOW' }</code> — and “too late” asserts <code>code</code> is defined, whatever code it is.</li>
<li><strong>#5</strong> — no no-show exactly 30 days ago (or 29) is ever tried.</li>
<li><strong>#8</strong> — nobody checks the last banned day, 2026-11-17, or the day after.</li>
</ul>
<p>The three killed bugs break the result so badly that even a loose assertion notices: a PENDING booking checking in (#4) returns <code>ok: true</code>; with <code>&lt;= STRIKES</code> (#6) or <code>Math.min</code> (#7) the three no-shows bring <code>null</code>, and <code>not.toBeNull()</code> goes red.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}
<p>Mutants are only 4 of the 10 points: 8/8 is possible with one long loop, a shared log and <code>toBeTruthy</code> here and there. The other six points check the habits of this chapter — independence, named boundaries, exact assertions, honest coverage.</p>

<h3>Hints — open one at a time</h3>
<ol>
<li>For an 08:00 booking, write the check-in table first: 07:49 → <code>TOO_EARLY</code>, 07:50 → ok and not late, 08:00 → ok and not late, 08:01 → late, 08:15 → late, 08:16 → <code>NO_SHOW</code>. Assert the whole object with <code>toEqual</code>.</li>
<li>Refuse <code>PENDING</code> and <code>CANCELLED</code> with <code>it.each</code> and the exact <code>{ ok: false, code: 'NOT_CONFIRMED' }</code>.</li>
<li>For the ban, fix “today” as a string (<code>'2026-11-12'</code>) — never <code>new Date()</code>. Three no-shows on 11-01, 11-05, 11-10 → <code>'2026-11-17'</code>; the same three in another order → the same answer; two → <code>null</code>.</li>
<li>The window: 2026-10-13 is exactly 30 days before 2026-11-12 (October has 31 days), 2026-10-14 is 29. The ban’s end: on 2026-11-17 still banned, on 2026-11-18 <code>null</code>.</li>
<li>Delete the shared <code>log</code>: each test that needs a log creates its own. Then run <code>node scripts/lap-lai.mjs 20 src/rules/checkin.test.js --sequence.shuffle</code> before calling it done.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.checkinTest)}
${ra(REF_RUN)}
${ra(OUT['lab8-mut'])}
<p>100% of statements, branches, functions and lines; green in every one of the ten orders; 8/8 — and the whole grading run took about ten seconds, because unit tests are cheap enough to run eighteen times.</p>

<h3>Bonus: what Stryker sees that eight hand-made mutants did not</h3>
<p>Eight mutants are a sample chosen by a person. Lesson 8.2’s Stryker generates every mutant it can; run it on this one file:</p>
${ra(ST1)}
<p>73 of 74 killed — and the one survivor is a real gap: changing <code>d &lt;= t</code> to <code>d &lt; t</code> means a no-show recorded <em>today</em> does not count yet, and no test noticed, because every no-show in the reference was in the past. One more test (the one marked “found by Stryker” in the file above) kills it:</p>
${ra(ST2)}
<p>Hand-picked mutants make a fast, readable grader; a mutation tool is the systematic search for the boundary nobody thought of. The Code Lab exercise <code>tst-cl-lab-8</code> grades with nine mutants — these eight plus “a no-show dated today does not count yet” — in a shuffled order.</p>

<h3>The whole suite after Lab 8</h3>
${ra(OUT['lab8-unit'])}
<p>15 files and 116 unit tests (85 from Chapters 1–7, 5 promoted in 8.1, 10 added in 8.2 and 16 here), line coverage 98.41%, and a mutation score of 98.73% over all of <code>src/rules</code>, with <code>checkin.js</code> at 100%.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>node scripts/dot-bien-8.mjs</code> prints <strong>green in 10/10 shuffled orders</strong> and <strong>8/8 mutants killed</strong>.</li>
<li><code>npx vitest run src/rules/checkin.test.js --coverage --coverage.include=src/rules/checkin.js</code> shows 100% branches.</li>
<li>No <code>toBeTruthy</code>, <code>toBeDefined</code> or bare <code>not.toBeNull</code>; no <code>new Date()</code>; no object created outside the tests and changed inside them.</li>
<li><code>npm run test:unit</code> green; (bonus) <code>npx stryker run --mutate src/rules/checkin.js</code> at 100%.</li>
<li><code>git status</code>: no <code>coverage/</code>, <code>reports/</code> or <code>.stryker-tmp/</code>. Commit: <code>test: check-in and no-show rules, strong and order-independent (Lab 8, 8/8)</code>.</li>
</ul>

${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8</span>
<h2>Mạnh và ổn định: từ 3/8 tới 8/8, ở mọi thứ tự</h2>
<p class="lead">Khoảng 60–90 phút. LabFlow Lite có thêm hai luật mới, và một bạn cùng nhóm đã viết test cho chúng: dòng nào cũng được phủ và bộ test xanh. Lab này đo xem các test đó thật sự đáng giá bao nhiêu — bằng ba công cụ của chương: độ phủ, đột biến và thứ tự xáo trộn — rồi bạn làm cho chúng mạnh và ổn định.</p>
<p><strong>Sau lab này bạn có thể</strong> đọc một bộ test xanh, phủ 100% với con mắt nghi ngờ, biến luật nghiệp vụ thành bảng giá trị biên, thay khẳng định lỏng bằng khẳng định chính xác, gỡ sự phụ thuộc thứ tự, và chứng minh tất cả bằng một script chứ không bằng cảm giác. <strong>Vì sao hữu ích:</strong> trong nhóm thật hiếm khi bạn viết test từ con số không — bạn nhận lại một bộ test “độ phủ tốt” mà vẫn để lọt bug hoặc tuần nào cũng đỏ một lần không rõ lý do. Biết đo và sửa một bộ test như vậy chính là bài 8.1–8.3 gộp lại.</p>

<h3>Hai luật mới</h3>
<ul>
<li><strong>BR-07 — check-in.</strong> Lượt đặt CONFIRMED được check-in từ 10 phút trước giờ bắt đầu tới 15 phút sau đó. Muộn hơn là <code>NO_SHOW</code> (vắng mặt); sau giờ bắt đầu (nhưng trong 15 phút) thì sinh viên bị tính là <em>trễ</em>. Trạng thái khác bị từ chối với <code>NOT_CONFIRMED</code>.</li>
<li><strong>BR-08 — cấm đặt vì vắng mặt.</strong> Ba lần vắng trong 30 ngày gần nhất ⇒ cấm đặt mới tới 7 ngày sau lần vắng gần nhất; <code>bannedUntil</code> trả về ngày bị cấm cuối cùng, hoặc <code>null</code>.</li>
</ul>
${ma('javascript', CODE.checkin)}
<p>Ba biên nằm trong <code>checkIn</code> (07:50, 08:00, 08:15 cho lượt 08:00) và ba biên trong <code>bannedUntil</code> (cửa sổ 30 ngày, lần vắng thứ ba, ngày bị cấm cuối cùng). Hãy nhớ chúng: bug nào được cài cũng nằm trên một trong các biên đó.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>LabFlow Lite như sau bài 8.4, có <code>src/rules/checkin.js</code> ở trên.</li>
<li>Bộ test ban đầu nằm ở <code>demo8/lab8-yeu.test.js</code>; chép sang <code>src/rules/checkin.test.js</code> (sửa import thành <code>./checkin.js</code>) và làm việc ở đó.</li>
<li>Tạo máy chấm <code>scripts/dot-bien-8.mjs</code>:
${ma('javascript', CODE.dotBien8)}</li>
</ol>
<p>Nó kiểm <strong>một</strong> file test hai lần: đầu tiên ở mười thứ tự xáo trộn nhưng lặp lại được (seed 1–10, bài 8.3), sau đó với tám bug cài sẵn, mỗi lần một con. Truyền tên file để chấm file khác: <code>node scripts/dot-bien-8.mjs demo8/lab8-yeu.test.js</code>.</p>
${FLOW_VI}
${BUG_VI}

<h3>Nhiệm vụ</h3>
<p>Làm cho <code>node scripts/dot-bien-8.mjs</code> in <strong>green in 10/10 shuffled orders</strong> và <strong>8/8 mutants killed</strong>, trong khi <code>npm run test:unit</code> vẫn xanh. Không sửa code trong <code>checkin.js</code>. Bắt đầu từ <em>luật</em>: ghi ra từng biên của BR-07 và BR-08 cùng giá trị ngay bên trong và ngay bên ngoài nó, rồi biến mỗi cặp thành một dòng của bảng <code>it.each</code>. Bảng bug chỉ cho bạn biết, sau cùng, bộ test của bạn mạnh tới đâu.</p>

<h3>Điểm xuất phát: xanh, 100% dòng — và yếu</h3>
${ma('javascript', CODE.lab8Yeu)}
${ra(YEU_RUN)}
<p>Tám test xanh, 100% câu lệnh, hàm và dòng. Chỉ có nhánh báo 93,75%, và nhánh chưa phủ là dòng 30 — <code>end &lt; t ? null</code>, lúc lệnh cấm hết hạn. Thế mà <em>có</em> một test tên là “a ban ends”. Nhìn ngày của nó: 2026-11-01, 05 và 10, kiểm vào 2026-12-30 — tất cả đã quá 30 ngày, nên <code>bannedUntil</code> trả <code>null</code> ngay ở dòng 28 và không bao giờ tới nhánh hết hạn cấm. Tên test hứa một điều, test kiểm một điều khác, và chỉ độ phủ nhánh nhận ra.</p>
<div class="pitfall co-tieu-de"><strong>Tên test là một lời khẳng định, không phải bằng chứng.</strong> “a ban ends” qua vì một lý do khác với tên của nó: các ngày đã rơi khỏi cửa sổ 30 ngày. Bài 8.1 cho thấy điều tương tự với dòng; ở đây một <em>nhánh</em> làm lộ ra. Khi thiếu một nhánh, hãy đọc cái test lẽ ra phải đi tới nhánh đó.</div>

<h3>Nó còn chập chờn</h3>
${ra(OUT['lab8-yeu-lap'])}
${ra(YEU_SEED)}
<p>Không bao giờ đỏ theo thứ tự trong file, đỏ 10 trên 20 lần khi xáo. Với seed mà <code>lap-lai.mjs</code> in ra, thứ tự đỏ quay lại y hệt: “three no-shows ban the student” chạy <em>trước</em> “records a no-show”, nên cuốn <code>log</code> dùng chung chỉ có hai ngày (chưa bị cấm → <code>null</code>), rồi “records a no-show” thấy ba ngày thay vì một. Hai test này không độc lập: chúng là một test bị cắt đôi, dính với nhau bằng <code>const log = createNoShowLog()</code> ở đầu file.</p>
<div class="pitfall co-tieu-de"><strong>Trạng thái ở cấp file được mọi test trong file dùng chung.</strong> Một object <code>const</code> tạo ngoài các test là <em>một</em> object cho tất cả, và thứ tự mặc định giấu sự phụ thuộc cho tới khi có người chạy file theo thứ tự xáo, lọc bằng <code>-t</code>, hoặc chèn một test vào giữa. Tạo sổ vắng mặt bên trong từng test (hoặc trong <code>beforeEach</code>) và cho mỗi test đúng những ngày nó cần.</div>

<h3>Máy chấm nói gì</h3>
${ra(OUT['lab8-mut-yeu'])}
<p>Bốn trên mười thứ tự và ba trên tám bug. Vì sao năm con còn sống:</p>
<ul>
<li><strong>#1, #2, #3</strong> — không test nào đứng trên biên. “too early” dùng 07:00 (sớm một tiếng), “too late” dùng 09:00, “on time” dùng 08:05. 07:50, 08:00, 08:15 và 08:16 không hề xuất hiện. Thêm nữa, “on time” khẳng định <code>toBeTruthy()</code> — object kết quả nào cũng truthy, kể cả <code>{ ok: false, code: 'NO_SHOW' }</code> — còn “too late” chỉ khẳng định <code>code</code> có giá trị, mã gì cũng được.</li>
<li><strong>#5</strong> — chưa ai thử một lần vắng đúng 30 ngày trước (hay 29 ngày).</li>
<li><strong>#8</strong> — không ai kiểm ngày bị cấm cuối cùng, 2026-11-17, hay ngày hôm sau.</li>
</ul>
<p>Ba bug bị diệt làm hỏng kết quả nặng tới mức khẳng định lỏng cũng nhận ra: lượt PENDING check-in (#4) trả <code>ok: true</code>; với <code>&lt;= STRIKES</code> (#6) hay <code>Math.min</code> (#7), ba lần vắng cho ra <code>null</code>, và <code>not.toBeNull()</code> đỏ.</p>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}
<p>Đột biến chỉ chiếm 4 trên 10 điểm: có thể đạt 8/8 bằng một vòng lặp dài, một sổ dùng chung và vài chỗ <code>toBeTruthy</code>. Sáu điểm còn lại kiểm các thói quen của chương — độc lập, biên có tên, khẳng định chính xác, độ phủ trung thực.</p>

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Với lượt 08:00, viết bảng check-in trước: 07:49 → <code>TOO_EARLY</code>, 07:50 → ok và không trễ, 08:00 → ok và không trễ, 08:01 → trễ, 08:15 → trễ, 08:16 → <code>NO_SHOW</code>. Khẳng định cả object bằng <code>toEqual</code>.</li>
<li>Từ chối <code>PENDING</code> và <code>CANCELLED</code> bằng <code>it.each</code> và đúng <code>{ ok: false, code: 'NOT_CONFIRMED' }</code>.</li>
<li>Với lệnh cấm, cố định “hôm nay” bằng một chuỗi (<code>'2026-11-12'</code>) — không bao giờ <code>new Date()</code>. Ba lần vắng 11-01, 11-05, 11-10 → <code>'2026-11-17'</code>; cùng ba ngày đó theo thứ tự khác → cùng đáp án; hai lần → <code>null</code>.</li>
<li>Cửa sổ: 2026-10-13 cách 2026-11-12 đúng 30 ngày (tháng Mười có 31 ngày), 2026-10-14 là 29 ngày. Ngày hết cấm: 2026-11-17 vẫn bị cấm, 2026-11-18 là <code>null</code>.</li>
<li>Xoá <code>log</code> dùng chung: test nào cần sổ thì tự tạo sổ của mình. Rồi chạy <code>node scripts/lap-lai.mjs 20 src/rules/checkin.test.js --sequence.shuffle</code> trước khi coi là xong.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('javascript', CODE.checkinTest)}
${ra(REF_RUN)}
${ra(OUT['lab8-mut'])}
<p>100% câu lệnh, nhánh, hàm và dòng; xanh ở cả mười thứ tự; 8/8 — và cả lượt chấm chỉ mất khoảng mười giây, vì unit test rẻ tới mức chạy mười tám lần vẫn nhanh.</p>

<h3>Phần thưởng: Stryker thấy điều tám đột biến làm tay không thấy</h3>
<p>Tám đột biến là một mẫu do con người chọn. Stryker của bài 8.2 sinh mọi đột biến nó sinh được; chạy nó trên đúng file này:</p>
${ra(ST1)}
<p>73 trên 74 bị diệt — và con sống sót là một lỗ thật: đổi <code>d &lt;= t</code> thành <code>d &lt; t</code> nghĩa là lần vắng ghi <em>hôm nay</em> chưa được tính, và không test nào nhận ra, vì mọi lần vắng trong lời giải đều nằm trong quá khứ. Thêm một test (test có chú thích “found by Stryker” trong file trên) là diệt được:</p>
${ra(ST2)}
<p>Đột biến chọn tay cho ra máy chấm nhanh, dễ đọc; công cụ mutation là cuộc tìm kiếm có hệ thống cho cái biên chưa ai nghĩ tới. Đề Code Lab <code>tst-cl-lab-8</code> chấm bằng chín đột biến — tám con này cộng “lần vắng đúng hôm nay chưa được tính” — theo thứ tự xáo trộn.</p>

<h3>Cả bộ test sau Lab 8</h3>
${ra(OUT['lab8-unit'])}
<p>15 file và 116 unit test (85 từ Chương 1–7, 5 được đưa vào ở 8.1, 10 thêm ở 8.2 và 16 ở đây), độ phủ dòng 98,41%, và điểm đột biến 98,73% trên toàn bộ <code>src/rules</code>, riêng <code>checkin.js</code> 100%.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>node scripts/dot-bien-8.mjs</code> in <strong>green in 10/10 shuffled orders</strong> và <strong>8/8 mutants killed</strong>.</li>
<li><code>npx vitest run src/rules/checkin.test.js --coverage --coverage.include=src/rules/checkin.js</code> báo 100% nhánh.</li>
<li>Không <code>toBeTruthy</code>, <code>toBeDefined</code> hay <code>not.toBeNull</code> đứng một mình; không <code>new Date()</code>; không object nào tạo ngoài các test rồi bị thay đổi bên trong chúng.</li>
<li><code>npm run test:unit</code> xanh; (thêm) <code>npx stryker run --mutate src/rules/checkin.js</code> đạt 100%.</li>
<li><code>git status</code>: không có <code>coverage/</code>, <code>reports/</code> hay <code>.stryker-tmp/</code>. Commit: <code>test: check-in and no-show rules, strong and order-independent (Lab 8, 8/8)</code>.</li>
</ul>

${NGUON}
</div>
`,
};
