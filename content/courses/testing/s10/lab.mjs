/**
 * Testing · Chương 10 · Lab 10 — Tính năng viết test trước, code cũ được ghim, refactor an toàn. BÀI MỚI 01/11/2026, slug tst-10-5-lab-tdd-code-cu.
 * Máy chấm scripts/dot-bien-10.mjs: test đặc tả clubFee phải xanh trên bản gốc v0 (lab10/clubFee.v0.js) VÀ trên bản refactor; test weeklyDates
 * (BR-10) phải xanh trên bản tham khảo của nhóm (lab10/recurring.ref.js); rồi 8 đột biến (4 trong v0, 4 trong bản tham khảo) thay vào từng con
 * một, file của người học luôn được trả lại trong finally.
 * Output thật (s10/_ma.mjs): bộ yếu 4 test xanh, 1/8; lời giải 26 test, cả ba dòng xanh, 8/8 (~6,4 s); bẫy refactor !!club.member ⇒ dòng 'yes' đỏ;
 * Stryker cả src/rules 98,99%, recurring.js 98,28% (con sống duy nhất holidays = ["Stryker was here"] là đột biến tương đương); cả bộ unit 229 test / 28 file.
 */
import G from '../giang/tst-lab-10.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const FT = CODE.clubFeeTest;
const FEE_X = FT.slice(FT.indexOf('function quote'), FT.indexOf("  it('returns NaN")).trimEnd();
const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const REF_RUN = loc('105-ref-run', /^\$ |✓ src|Test Files|Tests {2}/);
const TRUOT = loc('105-truot', /^\$ |planted|× |AssertionError|Tests {2}/);

const NGUON = [
  nguon('📜', 'Wikipedia — Characterization test', 'Tests that describe what existing code actually does (Michael Feathers), before you change it.', 'https://en.wikipedia.org/wiki/Characterization_test'),
  nguon('🔴', 'Martin Fowler — Test Driven Development', 'The red, green, refactor cycle and why the test list comes first.', 'https://martinfowler.com/bliki/TestDrivenDevelopment.html'),
].join('\n');

const BUG_EN = `<table>
<thead><tr><th>#</th><th>Planted bug</th><th>What a user would notice</th></tr></thead>
<tbody>
<tr><td>1</td><td>v0: <code>seats &gt;= 40</code></td><td>a club booking exactly 40 seats pays the 100,000 VND big-event fee</td></tr>
<tr><td>2</td><td>v0: <code>hrs &gt; 4</code></td><td>a 4-hour event loses its 50,000 VND discount</td></tr>
<tr><td>3</td><td>v0: <code>Math.floor</code> instead of <code>Math.round</code></td><td>262,500 VND is quoted 262,000 instead of 263,000</td></tr>
<tr><td>4</td><td>v0: Sunday removed from the weekend test</td><td>a quote made on Sunday is 1.5 times cheaper than the finance office expects</td></tr>
<tr><td>5</td><td>BR-10: <code>7 * (i + 1)</code></td><td>the lecturer’s first class is not booked; the series starts a week late</td></tr>
<tr><td>6</td><td>BR-10: <code>weeks &gt;= MAX_WEEKS</code></td><td>a full 15-week term is refused with BAD_WEEKS</td></tr>
<tr><td>7</td><td>BR-10: <code>&gt;= toDay(until)</code></td><td>the class on the last day of term is dropped as AFTER_TERM</td></tr>
<tr><td>8</td><td>BR-10: holiday check removed</td><td>a class is booked on a public holiday</td></tr>
</tbody></table>`;
const BUG_VI = `<table>
<thead><tr><th>#</th><th>Bug cài vào</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>v0: <code>seats &gt;= 40</code></td><td>câu lạc bộ đặt đúng 40 chỗ bị tính phí sự kiện lớn 100.000 đ</td></tr>
<tr><td>2</td><td>v0: <code>hrs &gt; 4</code></td><td>sự kiện đúng 4 giờ mất khoản giảm 50.000 đ</td></tr>
<tr><td>3</td><td>v0: <code>Math.floor</code> thay cho <code>Math.round</code></td><td>262.500 đ bị báo 262.000 thay vì 263.000</td></tr>
<tr><td>4</td><td>v0: bỏ Chủ nhật khỏi phép kiểm cuối tuần</td><td>báo giá làm vào Chủ nhật rẻ hơn 1,5 lần so với điều phòng tài chính mong</td></tr>
<tr><td>5</td><td>BR-10: <code>7 * (i + 1)</code></td><td>buổi đầu tiên của giảng viên không được đặt; chuỗi bắt đầu trễ một tuần</td></tr>
<tr><td>6</td><td>BR-10: <code>weeks &gt;= MAX_WEEKS</code></td><td>trọn một học kỳ 15 tuần bị từ chối với BAD_WEEKS</td></tr>
<tr><td>7</td><td>BR-10: <code>&gt;= toDay(until)</code></td><td>buổi học đúng ngày cuối kỳ bị bỏ, ghi AFTER_TERM</td></tr>
<tr><td>8</td><td>BR-10: bỏ phép kiểm ngày lễ</td><td>một buổi học bị đặt vào ngày nghỉ lễ</td></tr>
</tbody></table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-10.mjs</code></td></tr>
<tr><td>TDD evidence: the log (or one commit per step) shows each weeklyDates test red <em>before</em> its code, with the reason it was red</td><td>1.5</td><td>read <code>lab10/TDD-LOG.md</code> / <code>git log</code></td></tr>
<tr><td>Characterization pins today’s behaviour with a fixed clock — including LF-212 (weekend rate by the quote day) and NaN for an unknown building</td><td>1.5</td><td>read the tests</td></tr>
<tr><td>Refactor: characterization tests unchanged, green on v0 and on your refactor</td><td>1.5</td><td>lines 1 and 3 of the grader</td></tr>
<tr><td>Exact assertions (<code>toBe</code>, <code>toEqual</code>) and names that state the boundary (40/41 seats, 4 h, 15 weeks, last day of term)</td><td>1</td><td>read the tests</td></tr>
<tr><td>No real clock, no state shared between tests</td><td>0.5</td><td>read the tests</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-10.mjs</code></td></tr>
<tr><td>Bằng chứng TDD: nhật ký (hoặc mỗi bước một commit) cho thấy mỗi test của weeklyDates đỏ <em>trước</em> khi có code, kèm lý do đỏ</td><td>1,5</td><td>đọc <code>lab10/TDD-LOG.md</code> / <code>git log</code></td></tr>
<tr><td>Test đặc tả ghim hành vi hôm nay với đồng hồ cố định — kể cả LF-212 (giá cuối tuần theo ngày báo giá) và NaN cho toà nhà không có giá</td><td>1,5</td><td>đọc test</td></tr>
<tr><td>Refactor: test đặc tả không đổi, xanh trên v0 và trên bản refactor của bạn</td><td>1,5</td><td>dòng 1 và dòng 3 của máy chấm</td></tr>
<tr><td>Khẳng định chính xác (<code>toBe</code>, <code>toEqual</code>) và tên test nói rõ giá trị biên (40/41 chỗ, 4 giờ, 15 tuần, ngày cuối kỳ)</td><td>1</td><td>đọc test</td></tr>
<tr><td>Không đồng hồ thật, không trạng thái dùng chung giữa các test</td><td>0,5</td><td>đọc test</td></tr>
</tbody></table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">your tests on v0</div><div class="lz-d">clubFee tests must pass on the original lab10/clubFee.v0.js</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">your tests on the reference</div><div class="lz-d">weeklyDates tests must pass on the team’s lab10/recurring.ref.js</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">your tests on your refactor</div><div class="lz-d">the same clubFee tests, unchanged, on your src/legacy/clubFee.js</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">8 planted bugs</div><div class="lz-d">4 in v0, 4 in the reference, one at a time — each must turn your tests red</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">your file comes back</div><div class="lz-d">restored in finally after every run; exit 0 only with 3 green lines and 8/8</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">test của bạn trên v0</div><div class="lz-d">test clubFee phải xanh trên bản gốc lab10/clubFee.v0.js</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">test của bạn trên bản tham khảo</div><div class="lz-d">test weeklyDates phải xanh trên lab10/recurring.ref.js của nhóm</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">test của bạn trên bản refactor</div><div class="lz-d">đúng các test clubFee đó, không sửa, trên src/legacy/clubFee.js của bạn</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">8 bug cài sẵn</div><div class="lz-d">4 trong v0, 4 trong bản tham khảo, từng con một — con nào cũng phải làm test đỏ</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">trả file của bạn</div><div class="lz-d">trong finally sau mỗi lần chạy; thoát 0 chỉ khi đủ 3 dòng xanh và 8/8</div></div>
</div>`;

export default {
  title: 'Lab 10 — Test-first feature, pinned legacy, safe refactor: from 1/8 to 8/8|||Lab 10 — Tính năng viết test trước, code cũ được ghim, refactor an toàn: từ 1/8 tới 8/8',
  slug: 'tst-10-5-lab-tdd-code-cu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 10, thang chấm 10 điểm, hai việc cùng lúc như trong một nhóm thật: ghim hành vi của hàm báo giá cũ clubFee (không test, đọc đồng hồ thật, bug LF-212 giá cuối tuần theo ngày báo giá, NaN cho toà nhà lạ) bằng test đặc tả với đồng hồ cố định rồi refactor sang src/rules/clubFee.js mà không đổi con số nào; và viết test trước cho luật mới BR-10 đặt lịch lặp hằng tuần (weeklyDates: bỏ ngày lễ, cắt sau cuối kỳ, 1–15 tuần). Máy chấm dot-bien-10.mjs chạy test của bạn trên bản gốc v0, trên bản tham khảo của nhóm và trên bản refactor, rồi 8 đột biến. Output thật: bộ yếu 4 test xanh, 1/8; lời giải 26 test, 8/8; bẫy !!club.member bị bắt; Stryker 98,99%.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab 10</span>
<h2>Test-first feature, pinned legacy, safe refactor</h2>
<p class="lead">About 90 minutes. A normal week in a real team: the finance office wants a five-year-old price function cleaned up “without changing a single number”, and the lecturers want to book the same lab every week for a whole term. You will pin the old code before touching it, build the new rule test-first, and prove both with one grader.</p>
<p><strong>After this lab you can</strong> write characterization tests that hold an untested function still (bugs included), refactor under them, drive a new rule with red → green → refactor and show the evidence, and accept being graded against code you did not write. <strong>Why it is useful:</strong> on your first internship you will rarely start from an empty file. You will get a ticket that says “add X” next to code nobody dares to touch — exactly lessons 10.1 and 10.2 at the same time.</p>

<h3>Job A — the legacy quote nobody may change</h3>
<p><code>src/legacy/clubFee.js</code> quotes the price for a student club renting a lab. It has no tests; a copy of this original is kept as <code>lab10/clubFee.v0.js</code>.</p>
${ma('javascript', CODE.clubV0)}
<p>Read it as lesson 10.2 taught: what does it <em>really</em> do? Prices by building prefix (BE 200,000, AL 350,000 VND per hour) times hours; ×1.5 on a weekend; ×0.8 for a member; +100,000 above 40 seats; −50,000 from 4 hours; rounded to the nearest 1,000. And two surprises: the weekend rate looks at <code>new Date()</code> — the day the quote is <em>made</em> — while the <code>date</code> parameter is never read (the team logged this as issue <strong>LF-212</strong>); and a building without a price, such as <code>XX-001</code>, returns <code>NaN</code>.</p>
<div class="pitfall co-tieu-de"><strong>Pin the bug, do not fix it here.</strong> LF-212 is wrong, and the finance office may have planned around it for years. A refactor that “also fixes” it changes numbers nobody agreed to change, and the characterization tests can no longer tell a slip from a decision. Pin it with a test whose name says LF-212; fix it later in its own pull request, with the office.</div>

<h3>Job B — BR-10, weekly repeating bookings</h3>
<p>A lecturer books one slot every week for a class: <code>weeklyDates({ firstDate, weeks, until, holidays })</code> in <code>src/rules/recurring.js</code>.</p>
<ul>
<li>The first date and the same weekday in each following week, <code>weeks</code> times (1 to <code>MAX_WEEKS</code> = 15; anything else ⇒ <code>{ ok: false, code: 'BAD_WEEKS' }</code>).</li>
<li>A holiday is skipped and reported as <code>{ date, reason: 'HOLIDAY' }</code> — the series is <em>not</em> extended by a week.</li>
<li>A week after <code>until</code> (the last day of term, inclusive) is reported as <code>AFTER_TERM</code>; a first date after the term ⇒ <code>STARTS_AFTER_TERM</code>.</li>
<li>Result: <code>{ ok: true, dates: [...], skipped: [...] }</code>; dates are <code>"YYYY-MM-DD"</code>.</li>
</ul>
<p>Build it test-first. Keep a short log in <code>lab10/TDD-LOG.md</code> — one line per step: the test you wrote, why it was red (paste the first line of the failure), the smallest code that made it green — or make one commit per step. The log is graded: it is how a reviewer sees that the tests came first.</p>

<h3>Job C — refactor the quote</h3>
<p>Move the logic of <code>clubFee</code> into a pure <code>quoteClubFee({ member, lab, start, end, seats, today })</code> in <code>src/rules/clubFee.js</code>; leave <code>src/legacy/clubFee.js</code> as a thin wrapper for its callers. The characterization tests of Job A must not change by a single character and must stay green.</p>

<h3>Setup and the grader</h3>
<p>LabFlow Lite as after lesson 10.4. The grader is <code>scripts/dot-bien-10.mjs</code>: for each target it writes <em>other</em> code into your file — v0, the reference, or one of them with a planted bug — runs your test file, and puts your file back in <code>finally</code>.</p>
<p>Your tests are run against code <strong>you did not write</strong>: the original v0, and the team’s reference implementation of BR-10. That is not a trick. In a team the specification is the contract — your weeklyDates may be shaped differently, but a test that passes only on <em>your</em> implementation is testing your implementation, not the rule. If your tests are red on the reference, read the failure: either your test disagrees with BR-10, or you found a hole in the spec — say so in your pull request.</p>
${FLOW_EN}
${BUG_EN}

<h3>Your task</h3>
<p>Make <code>node scripts/dot-bien-10.mjs</code> print three green lines and <strong>8/8 mutants killed</strong>, with <code>npm run test:unit</code> green. Order matters: Job A first (tests on v0 before any refactor), then Job B test by test, then Job C. Start from the rules and the code, not from the bug table.</p>

<h3>The first attempt: green, and almost worthless</h3>
${ma('javascript', CODE.yeuFee)}
${ra(OUT['105-yeu'])}
<p>The weak recurring test (not shown) checks <code>r.ok</code>, counts <code>r.dates.length</code> for 3 weeks, and checks that a holiday is not in the dates. Four green tests, three green lines — and one bug out of eight. Why the seven survive:</p>
<ul>
<li><strong>#1–#4 (clubFee)</strong> — the tests use the real clock and only <code>toBeGreaterThan</code>. 41 versus 40 seats, exactly 4 hours, the 262,500 rounding case and a Sunday quote never appear; “greater than 0” is true for every one of those bugs. A characterization test that does not write down the actual numbers characterizes nothing.</li>
<li><strong>#5</strong> — “creates weekly dates” counts <code>dates.length</code>: three dates starting one week late are still three.</li>
<li><strong>#6, #7</strong> — nobody tries 15 weeks, or a class exactly on the last day of term.</li>
<li><strong>#8</strong> is killed: with the holiday check removed, <code>2026-11-09</code> is in the dates.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>A test written with the real clock passes or fails by the calendar.</strong> These numbers were measured on 01/11/2026, a Sunday: any exact price written down that day includes the ×1.5. The same test would turn red on Monday with no code changed. Fix the clock (<code>vi.useFakeTimers({ toFake: ['Date'] })</code> + <code>vi.setSystemTime</code>) and quote on a named Wednesday, Saturday and Sunday.</div>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Characterization the lesson 10.2 way: call clubFee with a fixed clock, expect <code>0</code>, and copy the real number from the failure into the test. Repeat for each row of an <code>it.each</code> table.</li>
<li>Rows worth having: 40 and 41 seats; 3.5 and 4 hours; AL-105 for 30 minutes on a Sunday (262,500 → 263,000); member true on a Saturday; end before start (0); an unknown building (<code>toBeNaN</code>); LF-212 — a Saturday quote for a Wednesday event.</li>
<li>For BR-10 write the test list first: 3 weeks; a holiday in the middle; a series that ends exactly on <code>until</code>; one week more; 1 and 15 weeks; 0, 16 and 2.5; a start after the term; crossing December into January.</li>
<li>Compare whole objects with <code>toEqual</code> — <code>{ ok, dates, skipped }</code>. Counting dates is how mutant #5 survived.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', FEE_X)}
${ma('javascript', CODE.clubWrap)}
${ra(REF_RUN)}
${ra(OUT['105-ref'])}
<p>26 tests (above: the clubFee table with its fixed clock; the 11 weeklyDates tests follow the test list of hint 3 in <code>src/rules/recurring.test.js</code>), all three lines green, 8/8 in about six seconds. Stryker over <code>src/rules</code> then scores 98.99%; the one survivor in <code>recurring.js</code>, <code>holidays = ["Stryker was here"]</code>, is an equivalent mutant (lesson 8.2) — that string is never a date. The refactor itself, <code>quoteClubFee</code>, keeps v0’s order of operations and names its constants (<code>BIG_EVENT_SEATS</code>, <code>LONG_EVENT_HOURS</code>…); the wrapper below is all that is left in <code>src/legacy</code>. After the lab the unit suite has 229 tests in 28 files.</p>

<h3>The trap the pin catches</h3>
<p>A reviewer suggests “simplifying” the wrapper to <code>member: !!club.member</code>. Same thing, surely?</p>
${ra(TRUOT)}
<p>v0 compared with <code>== true</code>: <code>1</code> counts as a member, <code>'yes'</code> does not. <code>!!'yes'</code> is <code>true</code>, so one club would suddenly get 20% off. The characterization row with <code>'yes'</code> was written because the code said <code>== true</code>, not because anyone expected the change — that is the point of pinning what the code does rather than what you think it means.</p>


<h3>Before you call it done</h3>
<ul>
<li><code>node scripts/dot-bien-10.mjs</code>: three ✔ lines and <strong>8/8 mutants killed</strong>.</li>
<li><code>lab10/TDD-LOG.md</code> (or <code>git log</code>) shows each weeklyDates test red before its code.</li>
<li><code>git diff</code> on <code>src/legacy/clubFee.test.js</code> since Job A is empty; LF-212 and NaN are pinned, not fixed.</li>
<li>Commit: <code>test: pin clubFee (LF-212 kept), BR-10 test-first, refactor quote (Lab 10, 8/8)</code>.</li>
</ul>

${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab 10</span>
<h2>Tính năng viết test trước, code cũ được ghim, refactor an toàn</h2>
<p class="lead">Khoảng 90 phút. Một tuần bình thường trong nhóm thật: phòng tài chính muốn dọn một hàm tính giá viết từ năm năm trước “mà không đổi một con số nào”, còn giảng viên muốn đặt cùng một phòng lab mỗi tuần cho cả học kỳ. Bạn sẽ ghim code cũ trước khi đụng vào, xây luật mới theo kiểu test trước, và chứng minh cả hai bằng một máy chấm.</p>
<p><strong>Sau lab này bạn có thể</strong> viết test đặc tả (characterization test) giữ yên một hàm chưa có test (kể cả bug của nó), refactor bên dưới chúng, dẫn dắt một luật mới bằng đỏ → xanh → refactor và đưa ra bằng chứng, và chấp nhận được chấm trên code không phải do mình viết. <strong>Vì sao hữu ích:</strong> kỳ thực tập đầu tiên hiếm khi bắt đầu từ một file trống. Bạn sẽ nhận một ticket “thêm X” nằm cạnh đoạn code không ai dám đụng — đúng là bài 10.1 và 10.2 cùng lúc.</p>

<h3>Việc A — hàm báo giá cũ không ai được làm đổi</h3>
<p><code>src/legacy/clubFee.js</code> báo giá cho câu lạc bộ sinh viên thuê phòng lab. Nó không có test; một bản sao của bản gốc này được giữ ở <code>lab10/clubFee.v0.js</code>.</p>
${ma('javascript', CODE.clubV0)}
<p>Đọc nó như bài 10.2 dạy: nó <em>thật sự</em> làm gì? Giá theo tiền tố toà nhà (BE 200.000, AL 350.000 đ mỗi giờ) nhân số giờ; ×1,5 vào cuối tuần; ×0,8 cho thành viên; +100.000 khi trên 40 chỗ; −50.000 từ 4 giờ; làm tròn tới 1.000 gần nhất. Và hai điều bất ngờ: giá cuối tuần nhìn vào <code>new Date()</code> — ngày <em>làm</em> báo giá — trong khi tham số <code>date</code> không bao giờ được đọc (nhóm ghi lại thành issue <strong>LF-212</strong>); và toà nhà chưa có giá, như <code>XX-001</code>, trả về <code>NaN</code>.</p>
<div class="pitfall co-tieu-de"><strong>Ghim bug, đừng sửa nó ở đây.</strong> LF-212 sai, và có thể phòng tài chính đã lên kế hoạch quanh nó nhiều năm. Một lần refactor “tiện tay sửa luôn” làm đổi những con số chưa ai đồng ý đổi, và test đặc tả không còn phân biệt được một lần trượt tay với một quyết định. Hãy ghim nó bằng một test có tên nói rõ LF-212; sửa sau, trong pull request riêng, cùng với phòng tài chính.</div>

<h3>Việc B — BR-10, đặt lịch lặp hằng tuần</h3>
<p>Giảng viên đặt một khung giờ mỗi tuần cho một lớp: <code>weeklyDates({ firstDate, weeks, until, holidays })</code> trong <code>src/rules/recurring.js</code>.</p>
<ul>
<li>Ngày đầu tiên và cùng thứ đó ở mỗi tuần tiếp theo, <code>weeks</code> lần (1 tới <code>MAX_WEEKS</code> = 15; ngoài khoảng đó ⇒ <code>{ ok: false, code: 'BAD_WEEKS' }</code>).</li>
<li>Ngày lễ bị bỏ và báo là <code>{ date, reason: 'HOLIDAY' }</code> — chuỗi <em>không</em> được kéo dài thêm một tuần.</li>
<li>Tuần nằm sau <code>until</code> (ngày cuối kỳ, tính cả ngày đó) được báo là <code>AFTER_TERM</code>; ngày đầu sau cuối kỳ ⇒ <code>STARTS_AFTER_TERM</code>.</li>
<li>Kết quả: <code>{ ok: true, dates: [...], skipped: [...] }</code>; ngày dạng <code>"YYYY-MM-DD"</code>.</li>
</ul>
<p>Xây nó theo kiểu test trước. Giữ một nhật ký ngắn trong <code>lab10/TDD-LOG.md</code> — mỗi bước một dòng: test vừa viết, vì sao nó đỏ (dán dòng đầu của lỗi), đoạn code nhỏ nhất làm nó xanh — hoặc mỗi bước một commit. Nhật ký được chấm điểm: đó là cách người review thấy test đến trước.</p>

<h3>Việc C — refactor hàm báo giá</h3>
<p>Chuyển logic của <code>clubFee</code> vào hàm thuần <code>quoteClubFee({ member, lab, start, end, seats, today })</code> trong <code>src/rules/clubFee.js</code>; để <code>src/legacy/clubFee.js</code> thành một lớp bọc mỏng cho các chỗ đang gọi nó. Test đặc tả của Việc A không được đổi một ký tự nào và phải luôn xanh.</p>

<h3>Chuẩn bị và máy chấm</h3>
<p>LabFlow Lite như sau bài 10.4. Máy chấm là <code>scripts/dot-bien-10.mjs</code>: với mỗi mục tiêu, nó ghi code <em>khác</em> vào file của bạn — v0, bản tham khảo, hoặc một trong hai có cài bug — chạy file test của bạn, rồi trả file của bạn về trong <code>finally</code>.</p>
<p>Test của bạn được chạy trên code <strong>không phải do bạn viết</strong>: bản gốc v0, và bản cài đặt tham khảo BR-10 của nhóm. Đó không phải mẹo. Trong một nhóm, đặc tả là hợp đồng — weeklyDates của bạn có thể viết khác, nhưng một test chỉ xanh trên bản cài đặt <em>của bạn</em> là đang test bản cài đặt đó, không phải luật. Nếu test của bạn đỏ trên bản tham khảo, hãy đọc lỗi: hoặc test của bạn trái với BR-10, hoặc bạn vừa tìm ra một lỗ trong đặc tả — hãy nói điều đó trong pull request.</p>
${FLOW_VI}
${BUG_VI}

<h3>Nhiệm vụ</h3>
<p>Làm cho <code>node scripts/dot-bien-10.mjs</code> in ra ba dòng xanh và <strong>8/8 mutants killed</strong>, với <code>npm run test:unit</code> vẫn xanh. Thứ tự quan trọng: Việc A trước (test trên v0 trước mọi refactor), rồi Việc B từng test một, rồi Việc C. Bắt đầu từ luật và từ code, đừng bắt đầu từ bảng bug.</p>

<h3>Lần thử đầu: xanh, và gần như vô giá trị</h3>
${ma('javascript', CODE.yeuFee)}
${ra(OUT['105-yeu'])}
<p>Test recurring yếu (không chép ở đây) kiểm <code>r.ok</code>, đếm <code>r.dates.length</code> cho 3 tuần, và kiểm một ngày lễ không nằm trong danh sách. Bốn test xanh, ba dòng xanh — và một bug trên tám. Vì sao bảy con sống:</p>
<ul>
<li><strong>#1–#4 (clubFee)</strong> — test dùng đồng hồ thật và chỉ <code>toBeGreaterThan</code>. 41 so với 40 chỗ, đúng 4 giờ, trường hợp làm tròn 262.500 và một báo giá ngày Chủ nhật đều không xuất hiện; “lớn hơn 0” đúng với mọi bug trong số đó. Test đặc tả mà không ghi lại con số thật thì không đặc tả được gì.</li>
<li><strong>#5</strong> — “creates weekly dates” chỉ đếm <code>dates.length</code>: ba ngày bắt đầu trễ một tuần vẫn là ba ngày.</li>
<li><strong>#6, #7</strong> — không ai thử 15 tuần, hay một buổi học đúng ngày cuối kỳ.</li>
<li><strong>#8</strong> bị diệt: bỏ phép kiểm ngày lễ thì <code>2026-11-09</code> nằm trong danh sách ngày.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Test viết với đồng hồ thật xanh hay đỏ theo lịch.</strong> Các con số này được đo ngày 01/11/2026, một ngày Chủ nhật: giá chính xác nào ghi lại hôm đó cũng đã gồm ×1,5. Cùng test đó sẽ đỏ vào thứ Hai mà không ai sửa code. Hãy cố định đồng hồ (<code>vi.useFakeTimers({ toFake: ['Date'] })</code> + <code>vi.setSystemTime</code>) và báo giá vào một thứ Tư, thứ Bảy, Chủ nhật có tên rõ ràng.</div>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Đặc tả theo cách bài 10.2: gọi clubFee với đồng hồ cố định, mong <code>0</code>, rồi chép con số thật từ lỗi vào test. Lặp lại cho từng dòng của bảng <code>it.each</code>.</li>
<li>Những dòng đáng có: 40 và 41 chỗ; 3,5 và 4 giờ; AL-105 trong 30 phút vào Chủ nhật (262.500 → 263.000); thành viên vào thứ Bảy; giờ kết thúc trước giờ bắt đầu (0); toà nhà lạ (<code>toBeNaN</code>); LF-212 — báo giá thứ Bảy cho sự kiện thứ Tư.</li>
<li>Với BR-10, viết danh sách test trước: 3 tuần; một ngày lễ ở giữa; chuỗi kết thúc đúng <code>until</code>; thêm một tuần; 1 và 15 tuần; 0, 16 và 2,5; bắt đầu sau cuối kỳ; vắt từ tháng 12 sang tháng 1.</li>
<li>So nguyên object bằng <code>toEqual</code> — <code>{ ok, dates, skipped }</code>. Chỉ đếm số ngày chính là cách đột biến #5 sống sót.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('javascript', FEE_X)}
${ma('javascript', CODE.clubWrap)}
${ra(REF_RUN)}
${ra(OUT['105-ref'])}
<p>26 test (ở trên: bảng clubFee với đồng hồ cố định; 11 test weeklyDates đi theo danh sách test của gợi ý 3, trong <code>src/rules/recurring.test.js</code>), cả ba dòng xanh, 8/8 trong khoảng sáu giây. Stryker trên <code>src/rules</code> sau đó đạt 98,99%; con sống duy nhất trong <code>recurring.js</code>, <code>holidays = ["Stryker was here"]</code>, là đột biến tương đương (bài 8.2) — chuỗi đó không bao giờ là một ngày. Bản refactor <code>quoteClubFee</code> giữ đúng thứ tự phép tính của v0 và đặt tên cho các hằng (<code>BIG_EVENT_SEATS</code>, <code>LONG_EVENT_HOURS</code>…); lớp bọc dưới đây là tất cả những gì còn lại trong <code>src/legacy</code>. Sau lab, bộ unit có 229 test trong 28 file.</p>

<h3>Cái bẫy mà cái ghim bắt được</h3>
<p>Một người review đề nghị “rút gọn” lớp bọc thành <code>member: !!club.member</code>. Chắc là như nhau?</p>
${ra(TRUOT)}
<p>v0 so sánh bằng <code>== true</code>: <code>1</code> được tính là thành viên, <code>'yes'</code> thì không. <code>!!'yes'</code> là <code>true</code>, nên một câu lạc bộ bỗng được giảm 20%. Dòng đặc tả với <code>'yes'</code> được viết vì code ghi <code>== true</code>, không phải vì ai đoán trước thay đổi này — đó chính là lý do ghim điều code làm chứ không ghim điều bạn nghĩ nó muốn nói.</p>


<h3>Trước khi coi là xong</h3>
<ul>
<li><code>node scripts/dot-bien-10.mjs</code>: ba dòng ✔ và <strong>8/8 mutants killed</strong>.</li>
<li><code>lab10/TDD-LOG.md</code> (hoặc <code>git log</code>) cho thấy mỗi test của weeklyDates đỏ trước khi có code.</li>
<li><code>git diff</code> trên <code>src/legacy/clubFee.test.js</code> kể từ Việc A là rỗng; LF-212 và NaN được ghim, không bị sửa.</li>
<li>Commit: <code>test: pin clubFee (LF-212 kept), BR-10 test-first, refactor quote (Lab 10, 8/8)</code>.</li>
</ul>

${NGUON}
</div>
`,
};
