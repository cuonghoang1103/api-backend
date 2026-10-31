/**
 * Testing · Mục 0 · Bắt đầu tại đây (1/2) — tst-0-8-bat-dau-tai-day (slug giữ từ khung 24/09/2026).
 * Output: chạy thật Node 22.23.3 (node:test, reporter spec) trong thư mục thu-test, 31/10/2026.
 * Mốc lịch sử: kiểm nguồn (link ở cuối bài). KHÔNG backtick trần, KHÔNG gạch chéo ngược trong mã mẫu.
 */
import G from '../giang/tst-00-8.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';

const M = {
  pkg: `
{"type":"module"}
`,
  gio: `
// Đổi "HH:MM" thành số phút tính từ 00:00
export function parseTime(text) {
  const [h, m] = text.split(':').map(Number);
  return h * 60 + m;
}
`,
  test: `
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTime } from './gio.js';

test('07:00 is minute 420', () => {
  assert.equal(parseTime('07:00'), 420);
});

test('21:30 is minute 1290', () => {
  assert.equal(parseTime('21:30'), 1290);
});
`,
  pass: `
$ node --test --test-reporter=spec gio.test.js
✔ 07:00 is minute 420 (0.704208ms)
✔ 21:30 is minute 1290 (0.074041ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 52.915667
`,
  broken: `
export function parseTime(text) {
  const [h, m] = text.split(':').map(Number);
  return h * 60;          // cố ý quên cộng phút
}
`,
  fail: `
$ node --test --test-reporter=spec gio.test.js
✔ 07:00 is minute 420 (0.422875ms)
✖ 21:30 is minute 1290 (0.411167ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
…

✖ failing tests:

test at gio.test.js:9:1
✖ 21:30 is minute 1290 (0.411167ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  1260 !== 1290

      at TestContext.<anonymous> (file://…/thu-test/gio.test.js:10:10)
      …
`,
};

const NGUON = [
  nguon('📚', 'Wikipedia — JUnit', 'Kent Beck &amp; Erich Gamma; SUnit (Smalltalk) is the original xUnit.', 'https://en.wikipedia.org/wiki/JUnit'),
  nguon('✈️', 'Martin Fowler — Xunit', '“JUnit was born on a flight from Zurich to the 1997 OOPSLA in Atlanta.”', 'https://martinfowler.com/bliki/Xunit.html'),
  nguon('🦋', 'Wikipedia — Software bug', 'Edison’s 1878 letter; the 1947 Harvard Mark II moth taped into the log book.', 'https://en.wikipedia.org/wiki/Software_bug'),
  nguon('📖', 'Wikipedia — Software testing', 'Myers (1979) separates debugging from testing; “software tester” as a profession in the 1980s.', 'https://en.wikipedia.org/wiki/Software_testing'),
  nguon('🔺', 'Martin Fowler — TestPyramid (2012)', 'Mike Cohn, Succeeding with Agile (2009); first drawn with Lisa Crispin in 2003–04.', 'https://martinfowler.com/bliki/TestPyramid.html'),
  nguon('🏆', 'Kent C. Dodds — The Testing Trophy', 'First tweeted on 6 February 2018.', 'https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications'),
  nguon('🃏', 'Meta Engineering — Jest moves to the OpenJS Foundation (2022)', 'Created in 2011, open-sourced in 2014.', 'https://engineering.fb.com/2022/05/11/open-source/jest-openjs-foundation/'),
  nguon('🟩', 'Node.js docs — Test runner', 'Added in v18.0.0, stable since v20.0.0.', 'https://nodejs.org/api/test.html'),
  nguon('🏛️', 'Wikipedia — ISTQB', 'Founded in Edinburgh in November 2002.', 'https://en.wikipedia.org/wiki/International_Software_Testing_Qualifications_Board'),
].join('\n');

export default {
  title: 'Start here (1/2) — What testing is, where it came from, and why it matters to you|||Bắt đầu tại đây (1/2) — Kiểm thử là gì, ra đời thế nào, và vì sao nó quan trọng với bạn',
  slug: 'tst-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài mở cửa cho người chưa từng viết test: test là gì bằng hình ảnh đời thường, kiểm thử tự động khác kiểm thử tay ra sao, những cặp từ hay nhầm (testing/debugging/QA, error/defect/failure, unit/integration/e2e, verification/validation), lịch sử từ con bướm 1947 tới Vitest, vì sao nó ra đời, nó giúp gì cho SWT301, LabFlow và phỏng vấn — và test đầu tiên của bạn trong 10 phút.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>Hello. Before you write your first test, know what you are learning — and why</h2>
<p class="lead">Welcome. If you have never written an automated test, or you have written JUnit tests for SWT301 only because the lab said so, this lesson is for you. Nothing to install, nothing to memorise. In twenty minutes you will know what a test really is, how automated testing was born, why every team you will join asks about it, and you will run your own first test.</p>
<p>This lesson and the next one are the front door of the course. The next lesson tells real stories of what happens <em>without</em> tests and gives you a study plan that does not burn you out. After that, lesson 0.1 shows the project you will test all course long, 0.2 the test pyramid, and 0.3 installs Vitest.</p>

<h3>What a test is — an everyday picture first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🍲 Tasting the soup</span><span class="v">A cook tastes the soup <strong>before</strong> it reaches the guests. The taste is cheap; a complaint from a guest is expensive. A test is a taste taken on purpose, at the right moment.</span></div>
  <div class="kv"><span class="k">✈️ The pre-flight checklist</span><span class="v">Pilots run the <strong>same list</strong> before every flight, even after ten thousand flights — because the day they skip it is the day something is wrong. An automated test is a checklist that runs itself.</span></div>
  <div class="kv"><span class="k">📝 The 15-minute quiz</span><span class="v">The teacher writes the answer key <strong>before</strong> the quiz, then compares. A test knows the <strong>expected</strong> result in advance and compares it with the <strong>actual</strong> result.</span></div>
</div>
<p>Now the definition, and it will feel obvious: <strong>a test runs a piece of software with a known input, compares the actual result with the expected result, and reports pass or fail.</strong> An <strong>automated test</strong> is that same thing written as code, so a program — the <strong>test runner</strong> — can execute hundreds of them in a second, as often as you like.</p>

<h3>What it looks like as code</h3>
<p>Here is a complete test file. It checks a function <code>parseTime</code> that turns a clock time like <code>"07:00"</code> into minutes since midnight — the kind of helper the LabFlow booking screen needs:</p>
${ma('javascript', M.test)}
<p>Read it as plain English. <code>test('…', () =&gt; { … })</code> names one check and holds its code. <code>assert.equal(actual, expected)</code> is the comparison: the actual value is whatever <code>parseTime('07:00')</code> returns, the expected value is <code>420</code>, because 7 × 60 = 420. That line is called an <strong>assertion</strong>. Running it with Node 22 prints:</p>
${ra(M.pass)}
<p>Two ticks, two passing tests, 53 milliseconds. Nothing was clicked, nothing was read by a human — and it will give exactly the same answer the thousandth time.</p>

<h3>Manual testing vs automated testing</h3>
<table>
<thead><tr><th></th><th>Manual testing</th><th>Automated testing</th></tr></thead>
<tbody>
<tr><td>Who executes</td><td>A person follows steps, clicks, reads the screen</td><td>A program (the test runner) executes code</td></tr>
<tr><td>First run</td><td>Cheap — nothing to write</td><td>More expensive — you write the test first</td></tr>
<tr><td>100th run</td><td>Tired, skips steps, misses things</td><td>Identical to the first, in seconds</td></tr>
<tr><td>Best at</td><td>Exploring, judging usability, “something feels off”</td><td>Re-checking known rules after every change</td></tr>
<tr><td>In SWT301 terms</td><td>Test cases in Report 5.x executed by a tester, round by round</td><td>JUnit tests in Lab 2, Selenium WebDriver in Chapter 8</td></tr>
</tbody>
</table>
<p>Teams need both. This course is about the automated half — the part a machine can repeat for free forever.</p>

<h3>The words people mix up</h3>
<table>
<thead><tr><th>Pair</th><th>The difference in one line</th></tr></thead>
<tbody>
<tr><td><strong>Testing vs debugging</strong></td><td>Testing <em>shows</em> that something is wrong. Debugging starts after that and <em>finds and removes the cause</em>. A test that fails is the start of debugging, not the end of testing.</td></tr>
<tr><td><strong>Testing vs QA</strong></td><td>QA (quality assurance) is the whole process that prevents defects — reviews, coding standards, tests, CI. Testing is one tool inside QA.</td></tr>
<tr><td><strong>Error → defect → failure</strong></td><td>A human makes an <em>error</em> (wrong idea), which leaves a <em>defect</em> (a wrong line, a bug) in the code, which causes a <em>failure</em> (wrong behaviour) when that line runs with the wrong input.</td></tr>
<tr><td><strong>Verification vs validation</strong></td><td>Verification: did we build it <em>right</em> — does the code match the spec? Validation: did we build the <em>right thing</em> — does it meet the real need? Automated tests mostly verify.</td></tr>
<tr><td><strong>Unit vs integration vs end-to-end</strong></td><td>Unit: one function, nothing external, milliseconds. Integration: several real parts together (route + rules + database). End-to-end: a real browser driving the real app like a user, seconds.</td></tr>
<tr><td><strong>Test case vs test code</strong></td><td>In SWT301 a <em>test case</em> is a row in a report (ID, steps, expected result). In this course it becomes a function the machine runs. Same idea, different medium.</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Trap — “all tests are green, so there are no bugs”.</strong> Tests only check what they were written to check. The broken version of <code>parseTime</code> later in this lesson still passes the <code>07:00</code> test, because 07:00 has zero minutes. Testing shows the <em>presence</em> of defects, never their absence — the first of the seven ISTQB principles you meet in SWT301.</p>
</div>

<h3>Where automated testing came from — dates you can check</h3>
<table>
<thead><tr><th>When</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>1878</td><td>Thomas Edison uses the word “bug” for a fault in a device, in a letter. The word is older than computers.</td></tr>
<tr><td>1947</td><td>Operators of the Harvard Mark II find a moth trapped in a relay and tape it into the log book: “First actual case of bug being found.”</td></tr>
<tr><td>1979</td><td>Glenford Myers’ <em>The Art of Software Testing</em> separates testing from debugging: a good test case is one that finds an error not yet discovered.</td></tr>
<tr><td>1980s</td><td>“Software tester” becomes a separate profession.</td></tr>
<tr><td>1990s</td><td>Kent Beck writes a small testing framework for Smalltalk (SUnit) — the ancestor of the whole “xUnit” family.</td></tr>
<tr><td>1997</td><td>Kent Beck and Erich Gamma write <strong>JUnit</strong> on a flight from Zurich to the OOPSLA conference in Atlanta, test-first.</td></tr>
<tr><td>1999</td><td>Extreme Programming (XP) makes writing tests first, every day, a team practice.</td></tr>
<tr><td>2002</td><td>Kent Beck publishes <em>Test-Driven Development: By Example</em>. ISTQB is founded in Edinburgh.</td></tr>
<tr><td>2009</td><td>Mike Cohn’s <em>Succeeding with Agile</em> popularises the <strong>test pyramid</strong> (he first drew it with Lisa Crispin in 2003–04).</td></tr>
<tr><td>2014</td><td>Facebook open-sources <strong>Jest</strong>, created in 2011 for its chat rewrite. In 2022 it moves to the OpenJS Foundation.</td></tr>
<tr><td>2018</td><td>Kent C. Dodds draws the <strong>testing trophy</strong> (6 February 2018).</td></tr>
<tr><td>Dec 2021</td><td>The first <strong>Vitest</strong> release appears on npm (0.0.1). Version 5 arrives in September 2026.</td></tr>
<tr><td>2022–2023</td><td>Node.js adds a built-in runner, <code>node:test</code> (v18), and marks it stable in v20.</td></tr>
</tbody>
</table>
<p>Notice the thread: every tool you will use in this course — Vitest, <code>node:test</code>, Jest, and the JUnit you use in SWT301 — is the same 1997 idea. Learn it once, and it transfers to Java, Python, Go, anything.</p>

<h3>Why it was born: regression</h3>
<p>Imagine LabFlow in week 2: one feature, “book a lab”. Checking it by hand takes five minutes. Week 10: booking, cancelling, approving, equipment, notifications, reports. Each release you must re-check <em>all</em> of them, because changing the approval rule can break cancelling. That re-check is called <strong>regression testing</strong>, and done by hand its cost grows with every feature. Sooner or later a tired team skips it “just this once”, and that is exactly the release that breaks.</p>
<p>Automated tests turn the re-check into a single command. Writing them costs effort once; running them costs seconds forever. That is the whole economic reason they exist. This very website runs <strong>190 test files</strong> on every <code>npm test</code> (counted on 31 October 2026), and its deploy script refuses to push code to GitHub when the checks are red.</p>

<h3>What it gives you, personally</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🎓 SWT301</span><span class="v">Lab 2 asks for unit tests with JUnit, Report 5.1 lists test cases with boundaries. The ideas in Chapter 1 here — arrange/act/assert, one reason to fail, boundary values as a table — work identically in Java.</span></div>
  <div class="kv"><span class="k">🧪 LabFlow</span><span class="v">Your graduation project lives on business rules: a 30-minute grid, at most 14 days ahead, approval above 30 seats. A test suite proves them before the defence and keeps proving them every time you change code at 2 a.m.</span></div>
  <div class="kv"><span class="k">💼 Internship interviews</span><span class="v">“How do you test your API?”, “What is the test pyramid?”, “When do you mock?” are standard backend questions. You will answer with your own test suite, not a definition.</span></div>
  <div class="kv"><span class="k">🏢 Real work</span><span class="v">In most companies a pull request cannot be merged until continuous integration (CI) is green. Without tests your code does not ship — and with good tests you can change other people’s code without fear.</span></div>
</div>

<h3>Where this course takes you</h3>
<p>From the very first <code>expect</code> to a complete test suite for one real project — <strong>LabFlow Lite</strong>, a small lab-booking API built on the same business rules as the LabFlow Demo in SWT301 — growing chapter by chapter: unit tests, async code and time, mocks used honestly, integration tests against a real PostgreSQL, HTTP API tests, React component tests, Playwright end-to-end tests, coverage and flaky tests, CI on GitHub Actions, TDD in teams, and a capstone. Lesson 0.1 shows the whole map.</p>

<h3>🧪 Practice (10 minutes — you will succeed)</h3>
<div class="callout ok">
<ol>
<li>Check Node: <code>node -v</code> must print <code>v22</code> or newer. (Lesson 0.3 explains installing it if not.)</li>
<li>Create a folder <code>thu-test</code>, and inside it a file <code>package.json</code> containing exactly:
${ma('json', M.pkg)}
It tells Node to understand <code>import</code>/<code>export</code>.</li>
<li>Create <code>gio.js</code>:
${ma('javascript', M.gio)}</li>
<li>Create <code>gio.test.js</code> with the test file shown above, then run <code>node --test --test-reporter=spec gio.test.js</code> in that folder. You should see the two ✔ lines.</li>
<li>Now break the code on purpose — remove <code>+ m</code>:
${ma('javascript', M.broken)}
Run again and read the result:
${ra(M.fail)}</li>
<li>Answer two questions in your notebook: why did the <code>07:00</code> test still pass? What do <code>1260</code> and <code>1290</code> mean?</li>
</ol>
<p><strong>Done when:</strong> you saw ✔ ✔, then ✖ with <code>1260 !== 1290</code>, and you can explain that 21:30 lost its 30 minutes (21 × 60 = 1260) while 07:00 has no minutes to lose — so a test with the value <code>07:00</code> could never catch this defect. Put <code>+ m</code> back and see ✔ ✔ again.</p>
</div>
<p><strong>Why this tiny exercise matters:</strong> you just experienced the whole course in miniature — a test catches a defect only if it runs the risky line with a value that exposes it. Chapter 1 turns that into a method (boundary values, decision tables).</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test</span><span class="v">Run something with a known input, compare actual with expected, report pass/fail.</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">The line that compares actual with expected (<code>assert.equal</code>, <code>expect(…).toBe(…)</code>).</span></div>
  <div class="kv"><span class="k">test runner</span><span class="v">The program that finds test files, runs them and prints the report (<code>node --test</code>, Vitest, Jest).</span></div>
  <div class="kv"><span class="k">regression</span><span class="v">Something that used to work breaks after a change; regression testing re-checks old behaviour.</span></div>
  <div class="kv"><span class="k">defect / bug</span><span class="v">The wrong line in the code. A failure is what the user sees when it runs.</span></div>
  <div class="kv"><span class="k">unit · integration · e2e</span><span class="v">Three distances from the user: one function · several real parts · the whole app in a browser.</span></div>
  <div class="kv"><span class="k">verification · validation</span><span class="v">Built it right (vs the spec) · built the right thing (value for the user).</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 One lesson, five moves</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Read</div><div class="lz-d">the lesson once, slides and text</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Type</div><div class="lz-d">every example by hand, run it</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Break</div><div class="lz-d">plant a bug, watch the test turn red</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Fix</div><div class="lz-d">make it green again, read the message</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Practise</div><div class="lz-d">the 🧪 task, then compare with the solution</div></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A test compares an <strong>actual</strong> result with an <strong>expected</strong> one; an automated test does it in code, so a machine repeats it for free.</li>
<li>Testing shows defects; debugging removes them; QA is the whole prevention process.</li>
<li>Error → defect → failure: a defect causes no failure until it runs with the input that exposes it — tests must pick those inputs.</li>
<li>From JUnit (1997) to Jest, Vitest and <code>node:test</code>, it is the same idea; learn it once and it works in every language.</li>
<li>Automation exists because regression re-checks grow with every feature; code repeats them in seconds.</li>
<li>For you: SWT301 labs, LabFlow’s business rules, interview answers, and code that can be merged at work.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
${lienKet({ bai: 'swt301-fundamentals-principles', title: 'Also in SWT301 — lesson 1.1: What is testing? Testing vs debugging', sub: 'If you study SWT301 on Academy, this will feel familiar. Same: the definition of testing, testing vs debugging, verification vs validation (ISTQB). Different: SWT301 gives the exam definitions and slide-by-slide theory; here you turn them into code that runs. Not studying SWT301? No problem — this course stands on its own.', cta: 'OPEN SWT301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Chào bạn. Trước khi viết dòng test đầu tiên, hãy biết mình đang học cái gì — và vì sao</h2>
<p class="lead">Chào mừng bạn. Nếu bạn chưa từng viết một test tự động nào, hoặc từng viết JUnit cho SWT301 chỉ vì đề lab bắt thế, thì bài này dành cho bạn. Không cài gì, không học thuộc gì. Trong hai mươi phút bạn sẽ hiểu test thật ra là gì, kiểm thử tự động ra đời thế nào, vì sao đội nào bạn vào làm cũng hỏi về nó — và tự chạy test đầu tiên của mình.</p>
<p>Bài này và bài kế tiếp là "cửa chính" của khoá. Bài kế kể những chuyện có thật xảy ra khi <em>không có</em> test và đưa bạn một lộ trình học không bị đuối. Sau đó, bài 0.1 giới thiệu dự án bạn sẽ test suốt khoá, 0.2 là kim tự tháp test, 0.3 cài Vitest.</p>

<h3>Test là gì — nói bằng hình ảnh đời thường trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🍲 Nếm nồi canh</span><span class="v">Đầu bếp nếm canh <strong>trước khi</strong> bưng ra cho khách. Nếm thì rẻ; khách phàn nàn thì đắt. Một test là một lần nếm có chủ đích, đúng lúc.</span></div>
  <div class="kv"><span class="k">✈️ Bảng kiểm trước khi bay</span><span class="v">Phi công đọc <strong>cùng một bảng kiểm</strong> trước mỗi chuyến, kể cả khi đã bay mười nghìn chuyến — vì đúng hôm bỏ qua là hôm có chuyện. Test tự động là một bảng kiểm tự chạy.</span></div>
  <div class="kv"><span class="k">📝 Bài kiểm tra 15 phút</span><span class="v">Thầy cô viết đáp án <strong>trước</strong>, rồi so từng bài. Test biết trước kết quả <strong>mong đợi (expected)</strong> và so với kết quả <strong>thực tế (actual)</strong>.</span></div>
</div>
<p>Giờ mới tới định nghĩa, và bạn sẽ thấy nó hiển nhiên: <strong>một test chạy một phần mềm với đầu vào đã biết, so kết quả thực tế với kết quả mong đợi, rồi báo đạt (pass) hay không đạt (fail).</strong> Một <strong>test tự động (automated test)</strong> là đúng việc đó nhưng viết thành code, để một chương trình — gọi là <strong>test runner (bộ chạy test)</strong> — chạy hàng trăm test trong một giây, bao nhiêu lần cũng được.</p>

<h3>Viết thành code thì trông thế nào</h3>
<p>Đây là một file test hoàn chỉnh. Nó kiểm hàm <code>parseTime</code>, hàm đổi giờ dạng <code>"07:00"</code> thành số phút tính từ nửa đêm — loại hàm phụ mà màn hình đặt phòng của LabFlow cần tới:</p>
${ma('javascript', M.test)}
<p>Đọc nó như đọc tiếng Việt. <code>test('…', () =&gt; { … })</code> đặt tên cho một phép kiểm và chứa code của nó. <code>assert.equal(actual, expected)</code> là phép so sánh: giá trị thực tế là thứ <code>parseTime('07:00')</code> trả về, giá trị mong đợi là <code>420</code>, vì 7 × 60 = 420. Dòng đó gọi là <strong>assertion (khẳng định)</strong>. Chạy bằng Node 22 thì in ra:</p>
${ra(M.pass)}
<p>Hai dấu tích, hai test đạt, 53 mili-giây. Không ai phải bấm gì, không ai phải đọc màn hình — và lần chạy thứ một nghìn vẫn cho đúng câu trả lời ấy.</p>

<h3>Kiểm thử thủ công và kiểm thử tự động</h3>
<table>
<thead><tr><th></th><th>Kiểm thử thủ công (manual)</th><th>Kiểm thử tự động (automated)</th></tr></thead>
<tbody>
<tr><td>Ai thực hiện</td><td>Một người làm theo các bước, bấm, đọc màn hình</td><td>Một chương trình (test runner) chạy code</td></tr>
<tr><td>Lần chạy đầu</td><td>Rẻ — không phải viết gì</td><td>Tốn hơn — phải viết test trước</td></tr>
<tr><td>Lần thứ 100</td><td>Mệt, bỏ bước, sót lỗi</td><td>Y hệt lần đầu, trong vài giây</td></tr>
<tr><td>Giỏi nhất ở</td><td>Khám phá, đánh giá trải nghiệm, cảm giác "có gì đó sai sai"</td><td>Kiểm lại những luật đã biết sau mỗi lần sửa code</td></tr>
<tr><td>Theo ngôn ngữ SWT301</td><td>Test case trong Report 5.x do tester chạy từng round</td><td>Test JUnit ở Lab 2, Selenium WebDriver ở Chương 8</td></tr>
</tbody>
</table>
<p>Đội nào cũng cần cả hai. Khoá này dạy nửa tự động — phần mà máy lặp lại miễn phí mãi mãi.</p>

<h3>Những cặp từ hay bị nhầm</h3>
<table>
<thead><tr><th>Cặp từ</th><th>Khác nhau trong một câu</th></tr></thead>
<tbody>
<tr><td><strong>Testing và debugging</strong></td><td>Testing (kiểm thử) <em>cho thấy</em> có gì đó sai. Debugging (gỡ lỗi) bắt đầu sau đó: <em>tìm và gỡ nguyên nhân</em>. Một test đỏ là điểm bắt đầu của gỡ lỗi, không phải điểm kết thúc của kiểm thử.</td></tr>
<tr><td><strong>Testing và QA</strong></td><td>QA (quality assurance — đảm bảo chất lượng) là cả quy trình ngăn lỗi: review, chuẩn code, test, CI. Testing là một công cụ nằm trong QA.</td></tr>
<tr><td><strong>Error → defect → failure</strong></td><td>Con người mắc <em>error (sai sót)</em> — một ý nghĩ sai, để lại <em>defect (khiếm khuyết, bug)</em> — một dòng sai trong code, gây ra <em>failure (thất bại)</em> — phần mềm cư xử sai khi dòng đó chạy với đầu vào xấu.</td></tr>
<tr><td><strong>Verification và validation</strong></td><td>Verification (kiểm định): làm có <em>đúng cách</em> không — code có khớp đặc tả không? Validation (xác nhận): làm có <em>đúng thứ</em> người dùng cần không? Test tự động chủ yếu làm verification.</td></tr>
<tr><td><strong>Unit, integration, end-to-end</strong></td><td>Unit (đơn vị): một hàm, không gì bên ngoài, mili-giây. Integration (tích hợp): nhiều phần thật chạy cùng nhau (route + luật + cơ sở dữ liệu). End-to-end (đầu-cuối, e2e): trình duyệt thật điều khiển ứng dụng thật như người dùng, tính bằng giây.</td></tr>
<tr><td><strong>Test case và test code</strong></td><td>Ở SWT301, <em>test case</em> là một dòng trong báo cáo (ID, các bước, kết quả mong đợi). Ở khoá này nó trở thành một hàm mà máy chạy. Cùng một ý tưởng, khác chất liệu.</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "test xanh hết rồi, vậy là không còn lỗi".</strong> Test chỉ kiểm đúng những gì nó được viết ra để kiểm. Bản <code>parseTime</code> bị hỏng ở phần thực hành cuối bài vẫn qua test <code>07:00</code>, vì 07:00 có 0 phút. Kiểm thử cho thấy lỗi <em>có tồn tại</em>, không bao giờ chứng minh được là <em>hết lỗi</em> — nguyên tắc số 1 trong bảy nguyên tắc ISTQB bạn học ở SWT301.</p>
</div>

<h3>Kiểm thử tự động ra đời thế nào — các mốc kiểm được</h3>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>1878</td><td>Thomas Edison dùng chữ "bug" để chỉ lỗi của một thiết bị, trong một bức thư. Chữ này có trước cả máy tính.</td></tr>
<tr><td>1947</td><td>Người vận hành máy Harvard Mark II tìm thấy một con bướm đêm kẹt trong rơ-le và dán nó vào sổ nhật ký: "First actual case of bug being found" — lần đầu tìm thấy một con "bọ" thật.</td></tr>
<tr><td>1979</td><td>Cuốn <em>The Art of Software Testing</em> của Glenford Myers tách bạch kiểm thử với gỡ lỗi: test case tốt là test case tìm ra một lỗi chưa ai thấy.</td></tr>
<tr><td>Thập niên 1980</td><td>"Software tester" trở thành một nghề riêng.</td></tr>
<tr><td>Thập niên 1990</td><td>Kent Beck viết một khung test nhỏ cho ngôn ngữ Smalltalk (SUnit) — tổ tiên của cả họ công cụ "xUnit".</td></tr>
<tr><td>1997</td><td>Kent Beck và Erich Gamma viết <strong>JUnit</strong> ngay trên chuyến bay từ Zurich tới hội nghị OOPSLA ở Atlanta, viết test trước rồi mới viết code.</td></tr>
<tr><td>1999</td><td>Extreme Programming (XP) biến việc viết test trước, mỗi ngày, thành thói quen của cả đội.</td></tr>
<tr><td>2002</td><td>Kent Beck xuất bản <em>Test-Driven Development: By Example</em>. ISTQB được thành lập ở Edinburgh.</td></tr>
<tr><td>2009</td><td>Sách <em>Succeeding with Agile</em> của Mike Cohn phổ biến <strong>kim tự tháp test</strong> (ông vẽ lần đầu cùng Lisa Crispin năm 2003–04).</td></tr>
<tr><td>2014</td><td>Facebook công bố mã nguồn <strong>Jest</strong>, công cụ họ viết từ 2011 khi làm lại phần chat. Năm 2022 Jest chuyển sang OpenJS Foundation.</td></tr>
<tr><td>2018</td><td>Kent C. Dodds vẽ <strong>"chiếc cúp" testing trophy</strong> (6/2/2018).</td></tr>
<tr><td>12/2021</td><td>Bản <strong>Vitest</strong> đầu tiên lên npm (0.0.1). Bản 5 ra tháng 9/2026.</td></tr>
<tr><td>2022–2023</td><td>Node.js thêm bộ chạy test có sẵn <code>node:test</code> (v18) và đánh dấu ổn định ở v20.</td></tr>
</tbody>
</table>
<p>Để ý sợi chỉ xuyên suốt: mọi công cụ bạn dùng trong khoá — Vitest, <code>node:test</code>, Jest, và cả JUnit bạn dùng ở SWT301 — đều là cùng một ý tưởng năm 1997. Học một lần là dùng được ở Java, Python, Go, ngôn ngữ nào cũng được.</p>

<h3>Vì sao nó ra đời: chuyện "kiểm lại"</h3>
<p>Hình dung LabFlow ở tuần 2: một tính năng, "đặt phòng lab". Kiểm bằng tay mất năm phút. Tuần 10: đặt phòng, huỷ, duyệt, mượn thiết bị, thông báo, báo cáo. Mỗi lần phát hành bạn phải kiểm lại <em>tất cả</em>, vì sửa luật duyệt có thể làm hỏng chức năng huỷ. Việc kiểm lại đó gọi là <strong>regression testing (kiểm thử hồi quy)</strong>, và làm tay thì chi phí tăng theo từng tính năng. Sớm muộn gì một đội đang mệt cũng sẽ bỏ qua "chỉ lần này thôi" — và đúng lần đó là lần hỏng.</p>
<p>Test tự động biến việc kiểm lại thành một câu lệnh. Viết thì tốn công một lần; chạy thì chỉ vài giây, mãi mãi. Đó là toàn bộ lý do kinh tế khiến nó tồn tại. Chính trang web bạn đang đọc chạy <strong>190 tệp test</strong> mỗi lần gõ <code>npm test</code> (đếm ngày 31/10/2026), và script deploy của nó từ chối đẩy code lên GitHub khi bộ kiểm còn đỏ.</p>

<h3>Nó giúp gì cho chính BẠN</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🎓 SWT301</span><span class="v">Lab 2 yêu cầu unit test bằng JUnit, Report 5.1 liệt kê test case kèm giá trị biên. Những gì Chương 1 ở đây dạy — chuẩn bị/hành động/khẳng định, mỗi test một lý do để đỏ, giá trị biên viết thành bảng — dùng y hệt trong Java.</span></div>
  <div class="kv"><span class="k">🧪 LabFlow</span><span class="v">Đồ án tốt nghiệp của bạn sống nhờ luật nghiệp vụ: lưới 30 phút, đặt trước tối đa 14 ngày, trên 30 chỗ thì cần duyệt. Một bộ test chứng minh các luật đó trước buổi bảo vệ, và tiếp tục chứng minh mỗi lần bạn sửa code lúc 2 giờ sáng.</span></div>
  <div class="kv"><span class="k">💼 Phỏng vấn thực tập</span><span class="v">"Em test API thế nào?", "Kim tự tháp test là gì?", "Khi nào thì mock?" là câu hỏi chuẩn của phỏng vấn backend. Bạn sẽ trả lời bằng chính bộ test của mình, không phải bằng định nghĩa học thuộc.</span></div>
  <div class="kv"><span class="k">🏢 Đi làm thật</span><span class="v">Ở đa số công ty, pull request không được merge cho tới khi CI (tích hợp liên tục) xanh. Không có test thì code không được lên — còn có test tốt thì bạn dám sửa code của người khác mà không sợ.</span></div>
</div>

<h3>Khoá này đưa bạn đi tới đâu</h3>
<p>Từ dòng <code>expect</code> đầu tiên tới một bộ test hoàn chỉnh cho một dự án thật — <strong>LabFlow Lite</strong>, một API đặt phòng lab nhỏ dựng trên đúng các luật nghiệp vụ của LabFlow Demo trong SWT301 — lớn dần theo từng chương: unit test, code bất đồng bộ và thời gian, mock dùng cho trung thực, test tích hợp với PostgreSQL thật, test API HTTP, test component React, test đầu-cuối bằng Playwright, độ phủ và test chập chờn, CI trên GitHub Actions, TDD trong đội, và dự án cuối khoá. Bài 0.1 có bản đồ đầy đủ.</p>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok">
<ol>
<li>Kiểm Node: <code>node -v</code> phải in ra <code>v22</code> trở lên. (Chưa có thì bài 0.3 hướng dẫn cài.)</li>
<li>Tạo thư mục <code>thu-test</code>, bên trong tạo file <code>package.json</code> có đúng nội dung:
${ma('json', M.pkg)}
Dòng này bảo Node hiểu cú pháp <code>import</code>/<code>export</code>.</li>
<li>Tạo <code>gio.js</code>:
${ma('javascript', M.gio)}</li>
<li>Tạo <code>gio.test.js</code> với đúng file test ở trên, rồi chạy <code>node --test --test-reporter=spec gio.test.js</code> trong thư mục đó. Bạn sẽ thấy hai dòng ✔.</li>
<li>Giờ cố ý làm hỏng code — xoá <code>+ m</code>:
${ma('javascript', M.broken)}
Chạy lại và đọc kết quả:
${ra(M.fail)}</li>
<li>Trả lời hai câu vào vở: vì sao test <code>07:00</code> vẫn đạt? <code>1260</code> và <code>1290</code> nghĩa là gì?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy ✔ ✔, rồi thấy ✖ kèm <code>1260 !== 1290</code>, và giải thích được rằng 21:30 bị mất 30 phút (21 × 60 = 1260) còn 07:00 chẳng có phút nào để mất — nên một test dùng giá trị <code>07:00</code> không bao giờ bắt được lỗi này. Thêm lại <code>+ m</code> và thấy ✔ ✔ lần nữa.</p>
</div>
<p><strong>Vì sao bài tập bé xíu này quan trọng:</strong> bạn vừa trải qua cả khoá học thu nhỏ — một test chỉ bắt được lỗi khi nó chạy đúng dòng nguy hiểm với một giá trị làm lộ lỗi ra. Chương 1 biến điều đó thành phương pháp (giá trị biên, bảng quyết định).</p>
<p>Mẹo nhỏ: nếu chạy <code>node --test</code> mà không thêm <code>--test-reporter=spec</code> (và không ghi tên file thì Node tự tìm mọi file <code>*.test.js</code>), Node vẫn chạy y như vậy; trong cửa sổ terminal thường nó tự chọn kiểu in đẹp này, còn khi output bị chuyển hướng (vd. trong CI) nó in dạng TAP gồm các dòng <code>ok 1 - …</code>. Thêm cờ cho chắc là thấy giống hệt bài.</p>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test (phép kiểm)</span><span class="v">Chạy một thứ với đầu vào đã biết, so thực tế với mong đợi, báo đạt/không đạt.</span></div>
  <div class="kv"><span class="k">assertion (khẳng định)</span><span class="v">Dòng so sánh thực tế với mong đợi (<code>assert.equal</code>, <code>expect(…).toBe(…)</code>).</span></div>
  <div class="kv"><span class="k">test runner (bộ chạy test)</span><span class="v">Chương trình tìm file test, chạy chúng và in báo cáo (<code>node --test</code>, Vitest, Jest).</span></div>
  <div class="kv"><span class="k">regression (hồi quy)</span><span class="v">Thứ đang chạy tốt bị hỏng sau một thay đổi; regression testing là kiểm lại hành vi cũ.</span></div>
  <div class="kv"><span class="k">defect / bug (khiếm khuyết)</span><span class="v">Dòng sai trong code. Failure (thất bại) là thứ người dùng thấy khi dòng đó chạy.</span></div>
  <div class="kv"><span class="k">unit · integration · e2e</span><span class="v">Ba khoảng cách tới người dùng: một hàm · nhiều phần thật · cả ứng dụng trong trình duyệt.</span></div>
  <div class="kv"><span class="k">verification · validation (kiểm định · xác nhận)</span><span class="v">Làm đúng cách (so với spec) · làm đúng thứ cần (giá trị cho người dùng).</span></div>
</div>

<h3>🗺 Một bài, năm bước</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đọc</div><div class="lz-d">bài một lượt, slide và chữ</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Gõ</div><div class="lz-d">tự gõ mọi ví dụ, chạy thử</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Phá</div><div class="lz-d">cài một bug, xem test đỏ</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Sửa</div><div class="lz-d">cho xanh lại, đọc thông báo</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Luyện</div><div class="lz-d">làm phần 🧪 rồi so với lời giải</div></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Test so kết quả <strong>thực tế</strong> với kết quả <strong>mong đợi</strong>; test tự động làm việc đó bằng code nên máy lặp lại miễn phí.</li>
<li>Kiểm thử cho thấy lỗi; gỡ lỗi loại bỏ nó; QA là cả quy trình phòng ngừa.</li>
<li>Error → defect → failure: khiếm khuyết không gây thất bại cho tới khi chạy với đúng đầu vào làm lộ nó — test phải chọn được những đầu vào đó.</li>
<li>Từ JUnit (1997) tới Jest, Vitest và <code>node:test</code> đều là một ý tưởng; học một lần dùng ở mọi ngôn ngữ.</li>
<li>Tự động hoá ra đời vì việc kiểm lại (hồi quy) phình theo từng tính năng; code lặp lại nó trong vài giây.</li>
<li>Với bạn: lab SWT301, luật nghiệp vụ LabFlow, câu trả lời phỏng vấn, và code được merge khi đi làm.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
${lienKet({ bai: 'swt301-fundamentals-principles', title: 'Đã gặp ở SWT301 — bài 1.1: Kiểm thử là gì? Testing vs debugging', sub: 'Nếu bạn học SWT301 trên Academy, phần này sẽ quen. Giống: định nghĩa kiểm thử, testing khác debugging, verification khác validation (theo ISTQB). Khác: SWT301 cho định nghĩa để thi và lý thuyết theo từng slide; ở đây bạn biến chúng thành code chạy được. Chưa học SWT301? Không sao — khoá này tự đủ từ đầu.', cta: 'MỞ BÀI SWT301 →' })}
</div>
`,
};
