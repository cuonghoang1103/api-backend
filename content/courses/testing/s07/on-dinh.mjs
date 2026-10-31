/**
 * Testing · Chương 7 · 7.3 — Làm test e2e ổn định. Slug giữ từ khung: tst-7-3-on-dinh.
 * Chạy thật (Playwright 1.64.1): hai test cùng khung SH-301 — 2 worker: 2 xanh (đặt trùng lọt qua race của repo bộ nhớ; chạy thêm 3 lần: 1 lần một đỏ,
 * 2 lần cả hai xanh), 1 worker: 1 đỏ, --repeat-each=3: 4 đỏ; cung-luc.spec.js gửi cùng lúc hai lượt đặt ⇒ [201, 201]; freshLab ⇒ 12/12 xanh (4 worker × 5 lần);
 * trace.zip + error-context.md; API chậm 6 s ở lần đầu ⇒ retry xanh ⇒ "1 flaky".
 */
import G from '../giang/tst-07-3.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|✘|passed|failed$|Running|flaky$/.test(l)).join('\n');
const NOI_TIEP = OUT['73-chung-noi-tiep'].split('\n').filter((l) => /^\$ |✓|✘|Expected substring|element\(s\) not found|passed \(|failed$/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const LUOT = OUT['73-cung-luc'].split('\n').filter((l) => /^\$ |✘|Expected  -|Received  \+|Array|^\s+[-+]?\s+\d{3},|^\s+\]|^\s+\d+ failed$|passed \(/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const TRACE = OUT['73-trace'].split('\n').filter((l) => /^\$ |✘|Expected:|Received:|attachment #2|trace\.zip|show-trace|^test-results|failed$|passed \(/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const NGU_CANH = OUT['73-error-context'].split('\n').filter((l) => !/^\s*\x60\x60\x60/.test(l)).join('\n');
const NC = NGU_CANH.split('\n');
const NGU_CANH_GON = NC.slice(NC.findIndex((l) => l.startsWith('# Test info')), NC.findIndex((l) => l.startsWith('# Test source'))).filter((l) => !/^Call log|^  - |^\s*$/.test(l)).join('\n');
const THU_LAI = OUT['73-thu-lai'].split('\n').filter((l) => /^\$ |✓|✘|Expected:|element\(s\) not found|flaky$|passed \(/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const HE = CODE.helpers.split('\n');
const FRESH = HE.slice(HE.findIndex((l) => l.startsWith('// A lab code'))).join('\n');
const TH = OUT['73-th'].split('\n').filter((l) => /^\$ |Running|passed \(/.test(l)).join('\n');
const LAP = OUT['73-chung-lap'].split('\n').filter((l) => /^\$ |Running|✘|passed \(|^\s+\d+ failed$/.test(l)).join('\n');

const BA_EN = `<table>
<thead><tr><th>Command (same two tests, same code)</th><th>Result</th><th>What happened</th></tr></thead>
<tbody>
<tr><td><code>--workers=2</code></td><td>2 passed</td><td>both bookings arrived together; both checks ran before either insert — a double booking got through</td></tr>
<tr><td><code>--workers=1</code></td><td>1 failed</td><td>the second test met the first test’s booking: 409, “already taken”, no status message</td></tr>
<tr><td><code>--workers=2 --repeat-each=3</code></td><td>4 failed</td><td>after the first round the slot is taken; every later attempt is refused</td></tr>
</tbody></table>`;
const BA_VI = `<table>
<thead><tr><th>Lệnh (cùng hai test, cùng code)</th><th>Kết quả</th><th>Chuyện gì đã xảy ra</th></tr></thead>
<tbody>
<tr><td><code>--workers=2</code></td><td>2 qua</td><td>hai lượt đặt tới cùng lúc; cả hai lần kiểm chạy trước khi bên nào kịp ghi — một lượt đặt trùng lọt qua</td></tr>
<tr><td><code>--workers=1</code></td><td>1 đỏ</td><td>test thứ hai gặp lượt đặt của test thứ nhất: 409, “already taken”, không có thông báo status</td></tr>
<tr><td><code>--workers=2 --repeat-each=3</code></td><td>4 đỏ</td><td>sau vòng đầu khung đã có người đặt; mọi lần sau đều bị từ chối</td></tr>
</tbody></table>`;

const CHO_EN = `<table>
<thead><tr><th>Instead of</th><th>Write</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>await page.waitForTimeout(1000)</code></td><td><code>await expect(locator).toHaveText('…')</code></td><td>waits exactly as long as needed, up to the timeout</td></tr>
<tr><td><code>expect(await locator.isVisible()).toBe(true)</code></td><td><code>await expect(locator).toBeVisible()</code></td><td>the first asks once; the second keeps asking</td></tr>
<tr><td><code>expect(await locator.count()).toBe(3)</code></td><td><code>await expect(locator).toHaveCount(3)</code></td><td>rows that arrive late are counted</td></tr>
<tr><td>a loop that polls the API</td><td><code>await expect.poll(() =&gt; read()).toBe(…)</code></td><td>retries any function, with the same timeout and a clear message</td></tr>
</tbody></table>`;
const CHO_VI = `<table>
<thead><tr><th>Thay vì</th><th>Hãy viết</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>await page.waitForTimeout(1000)</code></td><td><code>await expect(locator).toHaveText('…')</code></td><td>chờ vừa đủ, tối đa tới timeout</td></tr>
<tr><td><code>expect(await locator.isVisible()).toBe(true)</code></td><td><code>await expect(locator).toBeVisible()</code></td><td>cái đầu hỏi một lần; cái sau hỏi tới khi được</td></tr>
<tr><td><code>expect(await locator.count()).toBe(3)</code></td><td><code>await expect(locator).toHaveCount(3)</code></td><td>dòng tới muộn vẫn được đếm</td></tr>
<tr><td>một vòng lặp hỏi API liên tục</td><td><code>await expect.poll(() =&gt; read()).toBe(…)</code></td><td>thử lại bất kỳ hàm nào, cùng timeout và thông báo rõ ràng</td></tr>
</tbody></table>`;

const STACK_EN = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Shared data</span><span class="lz-lnote">two tests, one slot — results depend on who runs first</span></div>
  <div class="lz-layer"><span class="lz-lname">Waiting by the clock</span><span class="lz-lnote">sleeps and one-shot checks — lesson 7.1 measured both red</span></div>
  <div class="lz-layer"><span class="lz-lname">Order between tests</span><span class="lz-lnote">a test that only passes after another one</span></div>
  <div class="lz-layer"><span class="lz-lname">The environment</span><span class="lz-lnote">a busy CI machine, a slow network, a server left running</span></div>
  <div class="lz-layer"><span class="lz-lname">The app itself</span><span class="lz-lnote">a real race condition — the flaky test is right</span></div>
</div>`;
const STACK_VI = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dữ liệu dùng chung</span><span class="lz-lnote">hai test, một khung giờ — kết quả tuỳ ai chạy trước</span></div>
  <div class="lz-layer"><span class="lz-lname">Chờ theo đồng hồ</span><span class="lz-lnote">sleep và kiểm một lần — bài 7.1 đo được cả hai đều đỏ</span></div>
  <div class="lz-layer"><span class="lz-lname">Thứ tự giữa các test</span><span class="lz-lnote">một test chỉ qua khi chạy sau một test khác</span></div>
  <div class="lz-layer"><span class="lz-lname">Môi trường</span><span class="lz-lnote">máy CI bận, mạng chậm, server cũ còn chạy</span></div>
  <div class="lz-layer"><span class="lz-lname">Chính ứng dụng</span><span class="lz-lnote">một race condition thật — test chập chờn nói đúng</span></div>
</div>`;

const LENH = `npx playwright test demo7/du-lieu-chung.spec.js --workers=1          # strict order: shows order-dependence
npx playwright test demo7/du-lieu-chung.spec.js --repeat-each=10      # many rounds against one server
npx playwright test e2e/ --project=chromium --retries=0              # see every failure, hide nothing
npx playwright test e2e/ --project=chromium --fail-on-flaky-tests    # a test that only passed on retry fails the run`;

export default {
  title: '7.3 — Making e2e tests stable|||7.3 — Làm test e2e ổn định',
  slug: 'tst-7-3-on-dinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Test chập chờn (flaky) là gì và năm nguồn gốc của nó; đo thật: hai test cùng một khung giờ cho ba kết quả khác nhau theo số worker và số lần lặp — và lần "xanh" che một lượt đặt trùng thật (race của repo bộ nhớ, tái hiện bằng hai request cùng lúc ⇒ [201, 201]); freshLab cho mỗi test dữ liệu riêng ⇒ 12/12 xanh; chờ ứng dụng chứ không chờ đồng hồ; trace.zip và error-context.md khi đỏ; retry trong CI báo "1 flaky" thay vì giấu lỗi; lệnh tái hiện.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Making e2e tests stable</h2>
<p class="lead">The fastest way to make a team stop trusting its tests is a test that is green on Monday and red on Tuesday with no code change. People re-run it until it passes, then they stop reading red results at all — and the next real bug walks through. This lesson causes that on purpose, measures it, and removes each cause.</p>
<p><strong>After this lesson you can</strong> explain what makes a test flaky, reproduce a flaky test on demand, give every test data of its own, write waits that never depend on the clock, read the evidence Playwright leaves behind when a test fails, and use retries without hiding problems. <strong>Why it is useful:</strong> “our e2e tests are flaky” is one of the most common complaints in real teams, and the person who can turn a random red into a reproducible, explained bug is the person everyone asks for help.</p>

<h3>What “flaky” means, and where it comes from</h3>
<p>A <em>flaky test</em> (test chập chờn) passes and fails on the same code. The result depends on something the test does not control. Five usual sources, from the most common:</p>
${STACK_EN}
<p>The last one matters: sometimes the flaky test is the only one telling the truth. That happens in this lesson.</p>

<h3>Two tests, one slot</h3>
${ma('javascript', CODE.chung)}
<p>Each test is reasonable on its own, and each passes when run alone. Both use the “obvious” data: lab SH-301 on 16 November, 08:00–10:00. One e2e server serves every test of a run, so these two share one booking table.</p>
${ra(gon(OUT['73-chung-song-song']))}
${ra(NOI_TIEP)}
${ra(LAP)}
${BA_EN}
<p>Same code, three different results — the definition of flaky. Running the two-worker command three more times gave one run with a red test and two runs with both green: even the green result is a matter of luck. Note the error in the one-worker run: <em>element(s) not found</em> for the status region. The test does not say “the slot was taken”; you only learn that by looking at the page (below: the error context shows the alert).</p>

<h3>The green run hid a real bug</h3>
<p>Two workers, both green, both told “Booked. See you in SH-301.” — so the same lab was booked twice for the same two hours. Is that the test’s fault or the app’s? Ask the server directly, with two requests sent at the same moment:</p>
${ma('javascript', CODE.cungLuc)}
${ra(LUOT)}
<p><code>[201, 201]</code>: both students got the room. The e2e server keeps bookings in the in-memory repository of Chapter 2, and that repository still has the check-then-insert race: <code>findOverlap</code> and <code>insert</code> each wait a few milliseconds, so two requests can both check, both find nothing, and both insert. Lesson 4.1 fixed this <em>in PostgreSQL</em> with an <code>EXCLUDE</code> constraint, but this demo server does not use PostgreSQL.</p>
<div class="pitfall co-tieu-de"><strong>A green parallel run is not proof, and an e2e suite on a fake store cannot find database bugs.</strong> Here the “lucky” green run was the one with the bug. Two lessons for real projects: run the e2e environment on the same database as production (a container, as in Chapter 4), and keep concurrency bugs in integration tests, where two real connections can be made to collide on purpose — an end-to-end test only hits them by accident.</div>

<h3>Every test gets its own data</h3>
<p>Whatever the app does with two bookings for one slot, two tests should not depend on each other’s data. The fix is in the test, not the app:</p>
${ma('javascript', FRESH)}
<p>Each test, repeat and retry gets its own lab code (QA-100 to QA-999). Why a hash and not a counter? Workers are separate processes that share no memory, so a <code>let n = 0</code> would restart at 0 in each. A hash of test id, repeat and retry is stable inside one attempt and different between attempts. (900 codes can still collide by chance; a suite of hundreds of tests needs unique users or a database per worker.)</p>
<p>The two SH-301 tests rewritten with <code>freshLab</code> (the practice below) pass 10 attempts out of 10 on four workers. Other ways teams isolate data, from light to heavy:</p>
<ul>
<li><strong>Unique names</strong> — like <code>freshLab</code>: a code, an e-mail, a title per test.</li>
<li><strong>One account per worker</strong> — <code>testInfo.parallelIndex</code> (0, 1, 2…) picks <code>student0</code>, <code>student1</code>…, so parallel tests never share a session or a cart.</li>
<li><strong>Clean up through the API</strong> — create in <code>beforeEach</code>, delete in <code>afterEach</code>.</li>
<li><strong>A database per run or per worker</strong> — strongest, most work (Chapter 4).</li>
</ul>
<p>Avoid the opposite fix — forcing tests to run in a fixed order (<code>test.describe.configure({ mode: 'serial' })</code>) so that one test can rely on the data of the previous one. It hides the dependency instead of removing it, and one failure skips everything after it.</p>

<h3>Wait for the app, not the clock</h3>
<p>Lesson 7.1 measured it with an API delayed by 1.5 seconds: <code>await expect(status).toHaveText(…)</code> passed after 2.2 s, while <code>isVisible()</code> and a one-second <code>waitForTimeout</code> both failed. A longer sleep would pass today and fail on a slower CI machine; it also makes every run slower even when the app is fast. The rule: <strong>every line that waits is an assertion that retries.</strong></p>
${CHO_EN}
<p>Two timeouts matter. An <code>expect</code> retries for 5 seconds by default (you see <code>Timeout: 5000ms</code> in every failure above); a whole test may take 30 seconds. Actions wait too: before <code>click</code> or <code>fill</code>, Playwright checks that the element is attached, visible, stable (not animating) and enabled — its <em>actionability checks</em>. You almost never need to wait before an action; you need to wait for a <em>result</em>.</p>

<h3>A red run leaves evidence</h3>
${ma('javascript', CODE.trace)}
${ra(TRACE)}
<p>A failure leaves two files. <code>trace.zip</code> is a recording: <code>npx playwright show-trace &lt;file&gt;</code> opens a viewer with every action, a DOM snapshot before and after it, the network requests and the console — you can step through the failed run as if you were there. <code>error-context.md</code> is a text summary written next to it:</p>
${ra(NGU_CANH_GON)}
<p>The “page snapshot” (the accessibility tree at the moment of failure) already gives the answer: the status says the booking waits for approval, because 31 seats from a student needs approval (BR-06). The test expected the wrong message. Read the evidence before you guess, and before you add a sleep. (The file opens with instructions addressed to an AI assistant — Playwright writes it so that you can paste it into one. Read it yourself first; the snapshot is usually enough.)</p>
<p>Tracing costs time and disk, so LabFlow records only <code>'on-first-retry'</code>; <code>'retain-on-failure'</code> records every test and keeps the failures. CI uploads <code>test-results/</code> as an artifact (Chapter 9).</p>

<h3>Retries: report flakiness, do not hide it</h3>
${ma('javascript', CODE.thuLai)}
${ra(THU_LAI)}
<p>The first attempt was made slow on purpose (6 seconds, longer than the 5-second expect timeout) and failed; the retry passed. Playwright does not report this as passed: the summary says <strong>1 flaky</strong>. LabFlow’s config sets <code>retries: process.env.CI ? 2 : 0</code>:</p>
<ul>
<li><strong>Locally, no retries</strong> — you see every failure the first time it happens.</li>
<li><strong>On CI, two retries</strong> — one hiccup of a shared machine does not block someone else’s merge, and the run still records which tests needed a second try.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>“Flaky” is a bug report, not a pass.</strong> A team that raises retries until the pipeline is green has stopped testing: the double booking above would pass on retry and ship. Keep a list of flaky tests, find the cause (data, waits, order, environment, or a real race), and fix it. Chapter 8 turns this into a routine; <code>--fail-on-flaky-tests</code> makes a run fail when any test only passed on retry.</div>

<h3>Reproduce before you fix</h3>
${ma('bash', LENH)}
<p>Change one thing at a time and write down what you saw, as the table above does. A fix is done when the command that used to fail passes, many times.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Rewrite the two SH-301 tests so that each books a lab of its own with <code>freshLab(testInfo)</code>.</li>
<li>Run them with <code>--workers=4 --repeat-each=5</code>: all ten attempts must pass.</li>
<li>Then break it on purpose: make <code>freshLab</code> return a constant and run the same command again. The repeats collide again — that is the bug you removed.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th73)}
${ra(TH)}
<p><strong>Done when</strong> 12 tests pass (10 attempts and 2 setup) and you can say in one sentence why the original pair depended on order.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">A test that passes and fails on the same code.</span></div>
  <div class="kv"><span class="k">test isolation (cô lập test)</span><span class="v">Each test creates the data it needs and does not depend on any other test.</span></div>
  <div class="kv"><span class="k">worker</span><span class="v">A separate process running tests in parallel; workers share no memory.</span></div>
  <div class="kv"><span class="k">--repeat-each</span><span class="v">Runs every test N times in one run — a cheap way to expose shared data.</span></div>
  <div class="kv"><span class="k">actionability checks</span><span class="v">What Playwright waits for before an action: attached, visible, stable, enabled.</span></div>
  <div class="kv"><span class="k">trace</span><span class="v">A recording of a test run — actions, DOM snapshots, network, console — opened with <code>show-trace</code>.</span></div>
  <div class="kv"><span class="k">retry</span><span class="v">Running a failed test again; passing on retry is reported as flaky.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Flaky = the result depends on something the test does not control.</li>
<li>Shared data made one pair of tests give three results; one lab per test made it 12/12.</li>
<li>A green parallel run hid a real double booking: test races in integration tests, on the real database.</li>
<li>Wait with retrying assertions only; actions already wait for themselves.</li>
<li>Read <code>error-context.md</code> and the trace before guessing.</li>
<li>Retries only on CI, and every “flaky” gets a cause and a fix.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Làm test e2e ổn định</h2>
<p class="lead">Cách nhanh nhất làm một nhóm thôi tin bộ test là một test thứ Hai xanh, thứ Ba đỏ mà code không đổi gì. Mọi người chạy lại tới khi nó qua, rồi thôi hẳn việc đọc kết quả đỏ — và con bug thật tiếp theo cứ thế đi qua. Bài này cố ý gây ra chuyện đó, đo nó, và gỡ từng nguyên nhân.</p>
<p><strong>Sau bài này bạn có thể</strong> giải thích điều gì làm test chập chờn, tái hiện test chập chờn khi cần, cho mỗi test dữ liệu riêng, viết lệnh chờ không bao giờ phụ thuộc đồng hồ, đọc bằng chứng Playwright để lại khi test đỏ, và dùng retry mà không giấu vấn đề. <strong>Vì sao hữu ích:</strong> “test e2e của bọn mình chập chờn lắm” là một trong những lời than phổ biến nhất ở các nhóm thật, và người biến được một lần đỏ ngẫu nhiên thành một bug tái hiện được, giải thích được, là người cả nhóm tìm tới để nhờ.</p>

<h3>“Chập chờn” nghĩa là gì, và từ đâu ra</h3>
<p>Một <em>flaky test</em> (test chập chờn) lúc qua lúc đỏ trên cùng một code. Kết quả phụ thuộc vào thứ test không kiểm soát. Năm nguồn thường gặp, từ phổ biến nhất:</p>
${STACK_VI}
<p>Nguồn cuối cùng rất quan trọng: đôi khi test chập chờn lại là test duy nhất nói thật. Bài này sẽ gặp đúng chuyện đó.</p>

<h3>Hai test, một khung giờ</h3>
${ma('javascript', CODE.chung)}
<p>Từng test đều hợp lý, và từng test đều qua khi chạy riêng. Cả hai dùng dữ liệu “hiển nhiên”: phòng SH-301 ngày 16 tháng 11, 08:00–10:00. Một server e2e phục vụ mọi test của một lần chạy, nên hai test này dùng chung một bảng đặt phòng.</p>
${ra(gon(OUT['73-chung-song-song']))}
${ra(NOI_TIEP)}
${ra(LAP)}
${BA_VI}
<p>Cùng code, ba kết quả khác nhau — đúng định nghĩa của chập chờn. Chạy lệnh hai worker thêm ba lần nữa: một lần có một test đỏ, hai lần cả hai xanh — ngay cả kết quả xanh cũng là chuyện may rủi. Để ý lỗi trong lần chạy một worker: <em>element(s) not found</em> cho vùng status. Test không nói “khung đã có người đặt”; bạn chỉ biết điều đó khi nhìn vào trang (bên dưới: error context cho thấy alert).</p>

<h3>Lần xanh đã che một bug thật</h3>
<p>Hai worker, cả hai xanh, cả hai được báo “Booked. See you in SH-301.” — nghĩa là cùng một phòng bị đặt hai lần cho cùng hai tiếng. Lỗi của test hay của ứng dụng? Hỏi thẳng server, bằng hai request gửi cùng một lúc:</p>
${ma('javascript', CODE.cungLuc)}
${ra(LUOT)}
<p><code>[201, 201]</code>: cả hai sinh viên đều được phòng. Server e2e giữ lượt đặt trong repository bộ nhớ của Chương 2, và repository đó vẫn còn race kiểu kiểm-rồi-ghi: <code>findOverlap</code> và <code>insert</code> mỗi bước chờ vài mili giây, nên hai request có thể cùng kiểm, cùng không thấy gì, và cùng ghi. Bài 4.1 đã sửa lỗi này <em>trong PostgreSQL</em> bằng ràng buộc <code>EXCLUDE</code>, nhưng server demo này không dùng PostgreSQL.</p>
<div class="pitfall co-tieu-de"><strong>Một lần chạy song song xanh không phải bằng chứng, và bộ e2e chạy trên kho giả không tìm được bug của cơ sở dữ liệu.</strong> Ở đây lần xanh “may mắn” lại chính là lần có bug. Hai bài học cho dự án thật: cho môi trường e2e chạy trên cùng loại cơ sở dữ liệu với production (một container, như Chương 4), và để bug tranh chấp cho test tích hợp, nơi có thể cố ý cho hai kết nối thật đụng nhau — test đầu-cuối chỉ đụng phải chúng một cách tình cờ.</div>

<h3>Mỗi test có dữ liệu riêng</h3>
<p>Dù ứng dụng xử lý hai lượt đặt cùng khung thế nào, hai test cũng không nên phụ thuộc dữ liệu của nhau. Cách sửa nằm ở test, không ở ứng dụng:</p>
${ma('javascript', FRESH)}
<p>Mỗi test, lần lặp và lần thử lại có một mã phòng riêng (QA-100 tới QA-999). Sao lại băm mà không dùng bộ đếm? Các worker là những tiến trình riêng, không chung bộ nhớ, nên <code>let n = 0</code> sẽ bắt đầu lại từ 0 ở mỗi worker. Mã băm của id test, lần lặp và lần thử lại thì ổn định trong một lần chạy thử và khác nhau giữa các lần. (900 mã vẫn có thể trùng do ngẫu nhiên; bộ hàng trăm test cần người dùng riêng hoặc mỗi worker một cơ sở dữ liệu.)</p>
<p>Hai test SH-301 viết lại bằng <code>freshLab</code> (phần thực hành bên dưới) qua 10 trên 10 lần chạy thử trên bốn worker. Các cách khác để cô lập dữ liệu, từ nhẹ tới nặng:</p>
<ul>
<li><strong>Tên riêng</strong> — như <code>freshLab</code>: mỗi test một mã, một email, một tiêu đề.</li>
<li><strong>Mỗi worker một tài khoản</strong> — <code>testInfo.parallelIndex</code> (0, 1, 2…) chọn <code>student0</code>, <code>student1</code>…, để các test song song không bao giờ chung phiên hay giỏ hàng.</li>
<li><strong>Dọn qua API</strong> — tạo trong <code>beforeEach</code>, xoá trong <code>afterEach</code>.</li>
<li><strong>Mỗi lần chạy hoặc mỗi worker một cơ sở dữ liệu</strong> — mạnh nhất, tốn công nhất (Chương 4).</li>
</ul>
<p>Tránh cách sửa ngược lại — ép các test chạy theo thứ tự cố định (<code>test.describe.configure({ mode: 'serial' })</code>) để test sau dựa vào dữ liệu của test trước. Nó giấu sự phụ thuộc thay vì gỡ bỏ, và một test đỏ là bỏ qua mọi test phía sau.</p>

<h3>Chờ ứng dụng, đừng chờ đồng hồ</h3>
<p>Bài 7.1 đã đo với API trễ 1,5 giây: <code>await expect(status).toHaveText(…)</code> qua sau 2,2 giây, còn <code>isVisible()</code> và <code>waitForTimeout</code> một giây đều đỏ. Sleep dài hơn sẽ qua hôm nay và đỏ trên máy CI chậm hơn; nó còn làm mọi lần chạy chậm đi kể cả khi ứng dụng nhanh. Luật: <strong>mọi dòng có chờ đều là một assertion biết thử lại.</strong></p>
${CHO_VI}
<p>Có hai timeout cần nhớ. Một <code>expect</code> mặc định thử lại trong 5 giây (bạn thấy <code>Timeout: 5000ms</code> ở mọi lỗi phía trên); cả một test được tối đa 30 giây. Thao tác cũng tự chờ: trước <code>click</code> hay <code>fill</code>, Playwright kiểm phần tử đã gắn vào trang, hiển thị, đứng yên (không đang chuyển động) và bật — gọi là <em>actionability checks</em> (kiểm tra thao tác được). Bạn gần như không bao giờ cần chờ trước một thao tác; bạn cần chờ <em>kết quả</em>.</p>

<h3>Lần đỏ để lại bằng chứng</h3>
${ma('javascript', CODE.trace)}
${ra(TRACE)}
<p>Một lần đỏ để lại hai file. <code>trace.zip</code> là bản ghi: <code>npx playwright show-trace &lt;file&gt;</code> mở trình xem có mọi thao tác, ảnh chụp DOM trước và sau mỗi thao tác, các request mạng và console — bạn đi lại từng bước của lần chạy đỏ như thể đã có mặt lúc đó. <code>error-context.md</code> là bản tóm tắt bằng chữ, nằm ngay cạnh:</p>
${ra(NGU_CANH_GON)}
<p>“Page snapshot” (cây trợ năng tại thời điểm đỏ) đã cho câu trả lời: status báo lượt đặt chờ duyệt, vì sinh viên đặt 31 chỗ thì cần duyệt (BR-06). Test mong sai câu thông báo. Hãy đọc bằng chứng trước khi đoán, và trước khi thêm một lần sleep. (File mở đầu bằng lời dặn gửi một trợ lý AI — Playwright viết nó để bạn dán vào một trợ lý như vậy. Hãy tự đọc trước; phần snapshot thường đã đủ.)</p>
<p>Ghi trace tốn thời gian và ổ đĩa, nên LabFlow chỉ ghi <code>'on-first-retry'</code>; <code>'retain-on-failure'</code> ghi mọi test và giữ lại các lần đỏ. CI tải <code>test-results/</code> lên làm artifact (Chương 9).</p>

<h3>Retry: để báo chập chờn, không để giấu</h3>
${ma('javascript', CODE.thuLai)}
${ra(THU_LAI)}
<p>Lần chạy đầu bị cố ý làm chậm (6 giây, dài hơn timeout 5 giây của expect) và đỏ; lần thử lại qua. Playwright không báo đây là qua: dòng tổng kết ghi <strong>1 flaky</strong>. Cấu hình của LabFlow đặt <code>retries: process.env.CI ? 2 : 0</code>:</p>
<ul>
<li><strong>Trên máy bạn, không retry</strong> — bạn thấy mọi lần đỏ ngay lần đầu nó xảy ra.</li>
<li><strong>Trên CI, hai lần retry</strong> — một lần trục trặc của máy dùng chung không chặn việc merge của người khác, và lần chạy vẫn ghi lại test nào phải thử lần hai.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>“Flaky” là một báo cáo lỗi, không phải một lần qua.</strong> Nhóm nào tăng số retry tới khi pipeline xanh là đã thôi test: lượt đặt trùng ở trên sẽ qua ở lần thử lại và lên production. Giữ một danh sách test chập chờn, tìm nguyên nhân (dữ liệu, chờ, thứ tự, môi trường, hay một race thật), và sửa. Chương 8 biến việc này thành thói quen; <code>--fail-on-flaky-tests</code> làm cả lần chạy đỏ khi có test chỉ qua nhờ thử lại.</div>

<h3>Tái hiện trước khi sửa</h3>
${ma('bash', LENH)}
<p>Mỗi lần chỉ đổi một thứ và ghi lại điều đã thấy, như bảng phía trên. Bản sửa chỉ xong khi lệnh từng đỏ nay xanh, nhiều lần liền.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết lại hai test SH-301 để mỗi test đặt một phòng riêng bằng <code>freshLab(testInfo)</code>.</li>
<li>Chạy với <code>--workers=4 --repeat-each=5</code>: cả mười lần chạy thử phải qua.</li>
<li>Rồi cố ý làm hỏng: cho <code>freshLab</code> trả về một hằng số và chạy lại đúng lệnh đó. Các lần lặp lại đụng nhau — đó chính là con bug bạn vừa gỡ.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th73)}
${ra(TH)}
<p><strong>Xong khi</strong> 12 test qua (10 lần chạy thử và 2 setup) và bạn nói được trong một câu vì sao cặp test ban đầu phụ thuộc thứ tự.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">Test lúc qua lúc đỏ trên cùng một code.</span></div>
  <div class="kv"><span class="k">test isolation (cô lập test)</span><span class="v">Mỗi test tự tạo dữ liệu nó cần và không phụ thuộc test nào khác.</span></div>
  <div class="kv"><span class="k">worker</span><span class="v">Một tiến trình riêng chạy test song song; các worker không chung bộ nhớ.</span></div>
  <div class="kv"><span class="k">--repeat-each</span><span class="v">Chạy mỗi test N lần trong một lượt — cách rẻ để lộ dữ liệu dùng chung.</span></div>
  <div class="kv"><span class="k">actionability checks (kiểm tra thao tác được)</span><span class="v">Thứ Playwright chờ trước một thao tác: đã gắn vào trang, hiển thị, đứng yên, bật.</span></div>
  <div class="kv"><span class="k">trace (bản ghi)</span><span class="v">Bản ghi một lần chạy test — thao tác, ảnh DOM, mạng, console — mở bằng <code>show-trace</code>.</span></div>
  <div class="kv"><span class="k">retry (thử lại)</span><span class="v">Chạy lại test đỏ; qua ở lần thử lại thì bị báo là flaky.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chập chờn = kết quả phụ thuộc thứ test không kiểm soát.</li>
<li>Dữ liệu dùng chung làm một cặp test cho ba kết quả; mỗi test một phòng thì 12/12.</li>
<li>Một lần chạy song song xanh đã che một lượt đặt trùng thật: test race bằng test tích hợp, trên cơ sở dữ liệu thật.</li>
<li>Chỉ chờ bằng assertion biết thử lại; thao tác tự chờ cho chính nó.</li>
<li>Đọc <code>error-context.md</code> và trace trước khi đoán.</li>
<li>Chỉ retry trên CI, và mỗi “flaky” đều phải có nguyên nhân và bản sửa.</li>
</ul>
</div>
`,
};
