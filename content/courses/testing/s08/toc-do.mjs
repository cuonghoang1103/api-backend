/**
 * Testing · Chương 8 · 8.4 — Giữ bộ test chạy nhanh. Slug giữ từ khung: tst-8-4-toc-do.
 * Chạy thật (Vitest 5.0.5, máy 10 nhân): theo tầng — unit 100 test 1,092 s · web 16 test 2,692 s · tích hợp 11 test 3,703 s · e2e 9 test 9,634 s;
 * 200 kiểm tra unit 3 ms vs 200 request HTTP 192 ms; demo8/cham 6,14 s (song song) / 11,07 s (nối tiếp) → demo8/nhanh 210 ms;
 * beforeAll dùng chung dữ liệu ⇒ đỏ (102 thay vì 100); worker/isolate/pool đo 3 lần; --changed 1/14 và 6/14 file; related 6 file 74 test;
 * shard 31 + 56 + 13 = 100; thực hành 5006 ms → 29 ms, --testTimeout=500 làm 3 test ngủ đỏ.
 */
import G from '../giang/tst-08-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const cay = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests  |Duration/.test(l)).join('\n');
const CHAM = cay(OUT['84-cham']);
const NHANH = cay(OUT['84-nhanh']);
const CHUNG = OUT['84-chung'].split('\n').filter((l) => /^\$ |✓|×|AssertionError/.test(l)).join('\n');
const DO = cay(OUT['84-do-toc-do']);
const TH = OUT['84-th'].split('\n').filter((l) => /^\$ |^ ✓|Duration/.test(l)).join('\n');
const DOI = OUT['84-changed'].split('\n').filter((l) => !/^\$ /.test(l)).join('\n');
const DATA = CODE.duLieuNhanh.split('\n').slice(4, 14).join('\n');
const FAKE = CODE.choThatNhanh.split('\n').slice(4, 13).join('\n');
const SOL = '// …the same imports (plus vi, afterEach) and input as th84-de.test.js\n' + CODE.th84.split('\n').slice(8).join('\n');
const GAC = OUT['84-timeout'].split('\n').filter((l) => /^\$ |^ ✓|×|Tests  /.test(l)).join('\n');

const NGUON = [
  nguon('⚡', 'Vitest — Improving Performance', 'Isolation, pools (forks, threads), file parallelism and sharding, from the Vitest team.', 'https://vitest.dev/guide/improving-performance'),
  nguon('⌨️', 'Vitest — Command Line Interface', 'Every flag of this lesson: --changed, related, --shard, --maxWorkers, --no-isolate, --pool, --testTimeout, --mergeReports.', 'https://vitest.dev/guide/cli'),
].join('\n');

const STACK_EN = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Start the workers</span><span class="lz-lnote">processes or threads, up to the number of CPU cores</span></div>
  <div class="lz-layer"><span class="lz-lname">Transform and import</span><span class="lz-lnote">compile and load every file a test imports</span></div>
  <div class="lz-layer"><span class="lz-lname">Environment</span><span class="lz-lnote">a jsdom document per file for the React tests of Chapter 6</span></div>
  <div class="lz-layer"><span class="lz-lname">Setup</span><span class="lz-lnote">beforeEach / beforeAll, containers, building the app</span></div>
  <div class="lz-layer"><span class="lz-lname">The tests</span><span class="lz-lnote">real waits — sleep, retry delays, latency — hide here and dominate</span></div>
</div>`;
const STACK_VI = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Khởi động worker</span><span class="lz-lnote">tiến trình hoặc thread, tối đa theo số nhân CPU</span></div>
  <div class="lz-layer"><span class="lz-lname">Biên dịch và import</span><span class="lz-lnote">dịch và nạp mọi file mà test import</span></div>
  <div class="lz-layer"><span class="lz-lname">Môi trường</span><span class="lz-lnote">mỗi file một tài liệu jsdom cho các test React của Chương 6</span></div>
  <div class="lz-layer"><span class="lz-lname">Chuẩn bị (setup)</span><span class="lz-lnote">beforeEach / beforeAll, container, build ứng dụng</span></div>
  <div class="lz-layer"><span class="lz-lname">Chính các test</span><span class="lz-lnote">những lần chờ thật — sleep, delay của retry, độ trễ — nằm ở đây và lấn át mọi thứ</span></div>
</div>`;

const TANG_EN = `<table>
<thead><tr><th>Layer (command)</th><th>Tests</th><th>Wall time</th><th>Per test</th><th>What it pays for</th></tr></thead>
<tbody>
<tr><td>unit — <code>test:unit</code></td><td>100</td><td>1.092 s</td><td>~11 ms</td><td>Node workers and imports</td></tr>
<tr><td>components — <code>test:web</code></td><td>16</td><td>2.692 s</td><td>~170 ms</td><td>jsdom, React rendering</td></tr>
<tr><td>integration — <code>test:int</code></td><td>11</td><td>3.703 s</td><td>~340 ms</td><td>PostgreSQL 17 in a container</td></tr>
<tr><td>end-to-end — <code>test:e2e</code></td><td>9 (7 + 2 setup)</td><td>9.634 s</td><td>~1 s</td><td>Vite build, server, Chromium</td></tr>
</tbody></table>`;
const TANG_VI = `<table>
<thead><tr><th>Tầng (lệnh)</th><th>Số test</th><th>Thời gian thực</th><th>Mỗi test</th><th>Trả tiền cho</th></tr></thead>
<tbody>
<tr><td>unit — <code>test:unit</code></td><td>100</td><td>1,092 s</td><td>~11 ms</td><td>worker Node và import</td></tr>
<tr><td>component — <code>test:web</code></td><td>16</td><td>2,692 s</td><td>~170 ms</td><td>jsdom, React render</td></tr>
<tr><td>tích hợp — <code>test:int</code></td><td>11</td><td>3,703 s</td><td>~340 ms</td><td>PostgreSQL 17 trong container</td></tr>
<tr><td>đầu-cuối — <code>test:e2e</code></td><td>9 (7 + 2 setup)</td><td>9,634 s</td><td>~1 s</td><td>build Vite, server, Chromium</td></tr>
</tbody></table>`;

const TRUOC_SAU_EN = `<table>
<thead><tr><th>File</th><th>Before</th><th>After</th><th>What changed</th></tr></thead>
<tbody>
<tr><td><code>cho-that.test.js</code> (2 tests)</td><td>6011 ms</td><td>7 ms</td><td>fake timers: the waits are checked, not waited for</td></tr>
<tr><td><code>du-lieu.test.js</code> (4 tests)</td><td>4733 ms</td><td>97 ms</td><td>each test builds the one booking it talks about</td></tr>
<tr><td>whole folder (Duration)</td><td>6.14 s (11.07 s on one worker)</td><td>210 ms</td><td>about 29× faster, same six behaviours</td></tr>
</tbody></table>`;
const TRUOC_SAU_VI = `<table>
<thead><tr><th>File</th><th>Trước</th><th>Sau</th><th>Đã đổi gì</th></tr></thead>
<tbody>
<tr><td><code>cho-that.test.js</code> (2 test)</td><td>6011 ms</td><td>7 ms</td><td>fake timers: kiểm các lần chờ, không ngồi chờ</td></tr>
<tr><td><code>du-lieu.test.js</code> (4 test)</td><td>4733 ms</td><td>97 ms</td><td>mỗi test dựng đúng lượt đặt nó nói tới</td></tr>
<tr><td>cả thư mục (Duration)</td><td>6,14 s (11,07 s trên một worker)</td><td>210 ms</td><td>nhanh hơn ~29 lần, vẫn sáu hành vi</td></tr>
</tbody></table>`;

const TUYCHON_EN = `<table>
<thead><tr><th>Option (3 runs each)</th><th>src/ — 100 tests</th><th>web/ — 16 tests</th></tr></thead>
<tbody>
<tr><td>default: forks pool, isolated files, in parallel</td><td>1.150 · 0.979 · 1.062 s</td><td>2.624 · 2.162 · 2.107 s</td></tr>
<tr><td><code>--maxWorkers=1</code></td><td>2.306 · 2.276 · 2.156 s</td><td>2.705 · 2.783 · 2.740 s</td></tr>
<tr><td><code>--no-isolate</code></td><td>0.894 · 0.926 · 0.859 s</td><td>2.106 · 2.148 · 2.083 s</td></tr>
<tr><td><code>--pool=threads</code></td><td>0.946 · 0.898 · 0.990 s</td><td>—</td></tr>
</tbody></table>`;
const TUYCHON_VI = `<table>
<thead><tr><th>Tuỳ chọn (mỗi cách 3 lần)</th><th>src/ — 100 test</th><th>web/ — 16 test</th></tr></thead>
<tbody>
<tr><td>mặc định: pool forks, mỗi file cô lập, song song</td><td>1,150 · 0,979 · 1,062 s</td><td>2,624 · 2,162 · 2,107 s</td></tr>
<tr><td><code>--maxWorkers=1</code></td><td>2,306 · 2,276 · 2,156 s</td><td>2,705 · 2,783 · 2,740 s</td></tr>
<tr><td><code>--no-isolate</code></td><td>0,894 · 0,926 · 0,859 s</td><td>2,106 · 2,148 · 2,083 s</td></tr>
<tr><td><code>--pool=threads</code></td><td>0,946 · 0,898 · 0,990 s</td><td>—</td></tr>
</tbody></table>`;


export default {
  title: '8.4 — Keeping the suite fast|||8.4 — Giữ bộ test chạy nhanh',
  slug: 'tst-8-4-toc-do',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo trước khi tối ưu: thời gian từng tầng của LabFlow Lite (unit 100 test 1,1 s, component 2,7 s, tích hợp 3,7 s, e2e 9,6 s), đọc dòng Duration, tìm test chậm trong cây kết quả; song song che sự chậm chứ không gỡ nó (6,14 s so với 11,07 s nối tiếp); sửa đúng nguyên nhân — chờ thật thành fake timers, dữ liệu thừa thành dữ liệu đúng việc — 6,14 s xuống 210 ms; bẫy dùng chung dữ liệu cho nhanh làm test đỏ lại; worker, isolate, pool đo ba lần; chỉ chạy phần bị ảnh hưởng (--changed, related), chia shard; đối chiếu Maven Surefire, Spring TestContext, Testcontainers.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Keeping the suite fast</h2>
<p class="lead">A suite that takes a minute is run before lunch. A suite that takes a second is run after every change — and only that kind catches a bug while you still remember what you typed. Speed decides whether tests are run at all. This lesson measures where LabFlow Lite’s test time goes, removes the slow parts at their cause, and shows how to run less when the suite grows.</p>
<p><strong>After this lesson you can</strong> measure a suite by layer, file and test, read Vitest’s duration line, fix the few tests that cost most of the time without checking less, choose workers and isolation from a measurement, run only the tests a change affects, and split a suite across machines. <strong>Why it is useful:</strong> a slow suite gets skipped (“CI will run it”), slow CI costs money in minutes and in people waiting to merge, and “how would you speed up our tests?” has a good answer only if it starts with “first I would measure”.</p>

<h3>Where the time of a run goes</h3>
${STACK_EN}
<p>Every run ends with a line like <code>Duration 416ms (tests 58%, import 35%, transform 6%, worker 1%)</code>. “tests” near 100% means the tests wait; import, transform or environment on top means start-up cost. Read it before changing anything.</p>

<h3>Measure first: one number per layer</h3>
${TANG_EN}
<p>Measured with <code>time npm run test:unit</code> (and <code>test:web</code>, <code>test:int</code>, <code>test:e2e</code>) on one machine: wall-clock times of whole commands, start-up included — rough, but they show the shape: about a hundredth of a second per unit test, about a second per end-to-end test. That is the pyramid of lesson 0.2 in time. Most of the 3.7 s of integration is starting PostgreSQL once; a container per test would multiply it. Inside one file, the measurement of lesson 0.2 (<code>test/do-toc-do.test.js</code>) says the same:</p>
${ra(DO)}
<p>The same 200 checks: 3 ms as function calls, 192 ms through Express. The rule “06:30 is before opening” needs only the first; the HTTP layer needs a few tests of its own (Chapter 5), not one per rule. <strong>Test each rule at the lowest layer that can see it.</strong></p>

<h3>Find the slow tests</h3>
<p>Usually a few tests take most of the time, and the tree reporter prints a time for each one:</p>
${ra(CHAM)}
<p>Six tests, six seconds, two common causes. <code>cho-that.test.js</code> calls <code>retry()</code> on the real clock, so each test really sleeps 1 s + 2 s (lesson 2.2). <code>du-lieu.test.js</code> seeds 100 bookings before every test, one <code>await</code> at a time, through a repository that answers in about 5 ms per query like a real database (two nested loops, <code>await bookLab(…)</code> in <code>beforeEach</code>): 100 bookings × 2 queries × ~6 ms ≈ 1.2 s before anything is checked — and three of the four tests need one booking. In a bigger suite, <code>--reporter=verbose</code> lists every test with its time and <code>--slowTestThreshold=100</code> (default 300 ms) marks the slow ones.</p>

<h3>Parallel files hide slowness</h3>
${ra(OUT['84-cham-noi-tiep'])}
<p>6.14 s in the default run, 11.07 s one file after the other. In parallel, a run lasts as long as its slowest file, not the sum. Nothing got faster: on a CI machine with two cores, or with forty slow files instead of two, the sum comes back. Parallelism multiplies a fast suite; it does not cure one that waits.</p>

<h3>Fix the cause: check the wait, build only the data you need</h3>
${ma('javascript', FAKE)}
${ma('javascript', DATA)}
${ra(NHANH)}
${TRUOC_SAU_EN}
<p>The same six behaviours are checked. The fake clock is even more precise than the real one: <code>advanceTimersByTimeAsync(1000 + 2000)</code> states the expected waits inside the test. And the booking each test talks about is now in the test, not hidden in a loop of a hundred.</p>
<div class="pitfall co-tieu-de"><strong>Faster by sharing data: flaky again.</strong> The tempting shortcut is to seed the 100 bookings once, in <code>beforeAll</code> (<code>demo8/du-lieu-chung.test.js</code>, otherwise identical):
${ra(CHUNG)}
<p>Four times faster, and red even in file order: two tests wrote into the shared repository, so the list held 102. Shuffled, the result changes from run to run — lesson 8.3 again. Share only data that no test writes.</p></div>
<div class="pitfall co-tieu-de"><strong>Faster by checking less is not faster.</strong> Deleting the slow test, stubbing <code>retry</code> so it never waits, or raising the timeout until it passes all shrink the number and weaken the suite. A speed-up is done when the same behaviours are still checked — the mutants of lesson 8.2 confirm it honestly.</div>

<h3>Workers, isolation and pools — measured</h3>
<p>Each command run three times with <code>time npx vitest run src/ &lt;option&gt;</code> (and the same for <code>web/</code>):</p>
${TUYCHON_EN}
<ul>
<li><strong>Workers</strong> run files in parallel; the default comes from the CPU cores (10 here). One worker doubled the unit suite, whose files contain small real waits.</li>
<li><strong>Pool:</strong> <code>forks</code> (default) = child processes; <code>threads</code> = worker threads, quicker to start but sharing the process (no <code>process.chdir</code>). No clear difference here.</li>
<li><strong>Isolation</strong> gives each file a fresh module cache, so module state, <code>vi.mock</code> (3.2) and spies (2.4) cannot leak.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>--no-isolate trades safety for very little.</strong> Without isolation, a mock, a fake clock left on or a module-level object from one file is still there in the next file of the same worker — the shared-state flakiness of lesson 8.3, now between files and depending on how files are distributed. Here it saved about 0.15 s on the unit suite and nothing measurable on the web suite. Turn it off only for a folder you know is pure, and only after measuring.</div>

<h3>Run less: only what a change can break</h3>
${ra(DOI)}
<p><code>--changed</code> runs only test files that import what git says changed: 1 of 14 for <code>login-guard.js</code>, 6 of 14 for <code>time.js</code>. <code>vitest related src/rules/time.js --run</code> does the same for named files (6 files, 74 tests), watch mode on every save. Use them while working, never instead of the full run before merging: a changed config, fixture or schema breaks tests that import none of them.</p>

<h3>Split the rest across machines</h3>
${ra(OUT['84-shard'])}
<p><code>--shard=i/n</code> gives each machine a slice of the files: 31 + 56 + 13 = 100, none twice, none missing — uneven, because Vitest splits by files, not time. <code>--reporter=blob</code> + <code>vitest --mergeReports</code> combine the shards; Chapter 9 runs them as a CI matrix.</p>

<h3>A time budget with a guard</h3>
<p>Speed slips back one slow test at a time: write a budget (unit in seconds, integration under a minute, e2e under ten minutes in CI) and let a low <code>--testTimeout</code> guard the unit suite — a unit test that needs half a second is almost always sleeping.</p>
<p><strong>In Java and Spring Boot</strong> the knobs are the same: Surefire’s <code>forkCount</code> = workers, <code>reuseForks=false</code> = a fresh JVM per class. Spring adds one big cost: the <code>ApplicationContext</code> takes seconds, so it is cached per configuration — every different <code>@MockBean</code> set or <code>@DirtiesContext</code> builds a new one. And start Testcontainers once per run, as in Chapter 4.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>This file is correct, green — and slow. Make it fast <strong>without checking less</strong>, then prove it with <code>--testTimeout=500</code>:</p>
${ma('javascript', CODE.th84De)}
<p><strong>Solution and real output:</strong></p>
${ma('javascript', SOL)}
${ra(TH)}
${ra(GAC)}
<p>5006 ms became 29 ms for the same three checks. <code>bookAndNotify</code> settles only after the e-mail is sent, so <code>await</code> is the exact wait — the one-second sleep was never needed, and on a slow machine it might not even be enough. With the guard, the three sleeping tests fail with <em>Test timed out in 500ms</em>; the solution stays green.</p>
<p><strong>Done when</strong> your version runs in under 100 ms, passes with <code>--testTimeout=500</code>, and still fails if you change “Booking confirmed” in <code>notify.js</code> or the number of attempts in <code>retry.js</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">worker (tiến trình chạy test)</span><span class="v">A process or thread running test files; several work in parallel.</span></div>
  <div class="kv"><span class="k">pool: forks / threads</span><span class="v">Child processes (default) or worker threads in one process.</span></div>
  <div class="kv"><span class="k">isolation (cô lập)</span><span class="v">A fresh module cache per test file; <code>--no-isolate</code> turns it off.</span></div>
  <div class="kv"><span class="k">setup cost (chi phí chuẩn bị)</span><span class="v">Time spent before a test checks anything: data, containers, builds.</span></div>
  <div class="kv"><span class="k">slow test threshold (ngưỡng test chậm)</span><span class="v">Above it Vitest marks a test as slow; default 300 ms.</span></div>
  <div class="kv"><span class="k">--changed / related</span><span class="v">Run only test files that import changed (git) or named files.</span></div>
  <div class="kv"><span class="k">shard (mảnh)</span><span class="v">One of n slices of the test files, each on its own machine.</span></div>
  <div class="kv"><span class="k">test timeout (giới hạn thời gian test)</span><span class="v">The longest a test may run before it fails; a low value guards against sleeps.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measure by layer, file and test; read the Duration line before changing anything.</li>
<li>Test each rule at the lowest layer that sees it — 3 ms vs 192 ms for the same 200 checks.</li>
<li>Real waits and unneeded data are the usual causes: 6.14 s became 210 ms.</li>
<li>Parallelism hides slowness; shared data brings flakiness back.</li>
<li>Keep isolation; run less while working, everything before merging; shard when needed.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-ci-automation', title: 'Theory in SWT301 — 8.6: test pyramid and continuous integration', sub: 'Same: every level of the pyramid has a run time, and a fixed Thread.sleep is too short on a slow CI machine and too long everywhere else. Deeper here: each layer measured on LabFlow Lite, the slow tests found in the reporter and fixed at the cause (6.14 s → 210 ms), workers, isolation, --changed and sharding measured instead of assumed.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Giữ bộ test chạy nhanh</h2>
<p class="lead">Bộ test chạy một phút thì được chạy trước giờ ăn trưa. Bộ test chạy một giây thì được chạy sau mỗi lần sửa — và chỉ loại đó bắt được bug khi bạn còn nhớ mình vừa gõ gì. Tốc độ quyết định test có được chạy hay không. Bài này đo thời gian test của LabFlow Lite đi đâu, gỡ phần chậm ở đúng nguyên nhân, và chỉ cách chạy ít hơn khi bộ test lớn lên.</p>
<p><strong>Sau bài này bạn có thể</strong> đo bộ test theo tầng, theo file, theo test, đọc dòng Duration của Vitest, sửa vài test chiếm phần lớn thời gian mà không kiểm ít đi, chọn worker và isolate dựa trên số đo, chỉ chạy những test mà thay đổi ảnh hưởng tới, và chia bộ test cho nhiều máy. <strong>Vì sao hữu ích:</strong> bộ test chậm bị bỏ qua (“để CI chạy”), CI chậm tốn tiền bằng phút chạy và bằng người ngồi chờ merge, và câu “làm test của chúng tôi nhanh hơn thế nào?” chỉ có câu trả lời tốt khi mở đầu bằng “trước hết tôi sẽ đo”.</p>

<h3>Thời gian của một lần chạy đi đâu</h3>
${STACK_VI}
<p>Mỗi lần chạy kết thúc bằng một dòng như <code>Duration 416ms (tests 58%, import 35%, transform 6%, worker 1%)</code>. “tests” gần 100% nghĩa là test đang chờ; import, transform hay environment đứng đầu nghĩa là tốn ở khâu khởi động. Đọc nó trước khi đổi bất cứ gì.</p>

<h3>Đo trước: mỗi tầng một con số</h3>
${TANG_VI}
<p>Đo bằng <code>time npm run test:unit</code> (và <code>test:web</code>, <code>test:int</code>, <code>test:e2e</code>) trên một máy: thời gian thực của cả lệnh, tính cả khởi động — thô, nhưng thấy được hình dạng: khoảng một phần trăm giây cho mỗi unit test, khoảng một giây cho mỗi test đầu-cuối. Đó là kim tự tháp của bài 0.2 viết bằng thời gian. Phần lớn 3,7 s của tầng tích hợp là bật PostgreSQL một lần; mỗi test một container thì con số sẽ nhân lên. Trong một file, phép đo của bài 0.2 (<code>test/do-toc-do.test.js</code>) nói cùng điều đó:</p>
${ra(DO)}
<p>Cùng 200 lần kiểm: 3 ms nếu gọi hàm, 192 ms nếu qua Express. Luật “06:30 là trước giờ mở cửa” chỉ cần cách đầu; tầng HTTP cần vài test riêng của nó (Chương 5), không phải mỗi luật một test. <strong>Test mỗi luật ở tầng thấp nhất còn nhìn thấy nó.</strong></p>

<h3>Tìm test chậm</h3>
<p>Thường chỉ vài test chiếm phần lớn thời gian, và reporter dạng cây in sẵn thời gian của từng test:</p>
${ra(CHAM)}
<p>Sáu test, sáu giây, hai nguyên nhân hay gặp. <code>cho-that.test.js</code> gọi <code>retry()</code> với đồng hồ thật, nên mỗi test ngủ thật 1 s + 2 s (bài 2.2). <code>du-lieu.test.js</code> dựng 100 lượt đặt trước mỗi test, mỗi lần một <code>await</code>, qua repository trả lời khoảng 5 ms mỗi truy vấn như CSDL thật (hai vòng lặp lồng nhau, <code>await bookLab(…)</code> trong <code>beforeEach</code>): 100 lượt đặt × 2 truy vấn × ~6 ms ≈ 1,2 s trước khi kiểm được gì — mà ba trong bốn test chỉ cần một lượt đặt. Với bộ test lớn hơn, <code>--reporter=verbose</code> liệt kê mọi test kèm thời gian và <code>--slowTestThreshold=100</code> (mặc định 300 ms) đánh dấu test chậm.</p>

<h3>Song song che sự chậm</h3>
${ra(OUT['84-cham-noi-tiep'])}
<p>6,14 s ở lần chạy mặc định, 11,07 s khi chạy lần lượt từng file. Khi song song, lần chạy kéo dài bằng file chậm nhất, không phải bằng tổng. Chẳng có gì nhanh hơn: trên máy CI hai nhân, hay với bốn mươi file chậm thay vì hai, cái tổng quay lại. Song song nhân tốc độ của bộ test vốn nhanh; nó không chữa được bộ test cứ ngồi chờ.</p>

<h3>Sửa đúng nguyên nhân: kiểm lần chờ, chỉ dựng dữ liệu cần dùng</h3>
${ma('javascript', FAKE)}
${ma('javascript', DATA)}
${ra(NHANH)}
${TRUOC_SAU_VI}
<p>Vẫn kiểm đúng sáu hành vi. Đồng hồ giả còn chính xác hơn đồng hồ thật: <code>advanceTimersByTimeAsync(1000 + 2000)</code> ghi rõ những lần chờ mong đợi ngay trong test. Và lượt đặt mà test nói tới nay nằm trong chính test, không bị giấu trong vòng lặp một trăm lần.</p>
<div class="pitfall co-tieu-de"><strong>Nhanh hơn nhờ dùng chung dữ liệu: lại chập chờn.</strong> Đường tắt hấp dẫn là dựng 100 lượt đặt một lần trong <code>beforeAll</code> (<code>demo8/du-lieu-chung.test.js</code>, còn lại y hệt):
${ra(CHUNG)}
<p>Nhanh gấp bốn, và đỏ ngay cả theo thứ tự trong file: hai test đã ghi vào repository dùng chung nên danh sách có 102. Xáo thứ tự thì kết quả đổi theo từng lần chạy — lại là bài 8.3. Chỉ dùng chung dữ liệu mà không test nào ghi.</p></div>
<div class="pitfall co-tieu-de"><strong>Nhanh hơn nhờ kiểm ít đi thì không phải nhanh hơn.</strong> Xoá test chậm, stub <code>retry</code> để nó không bao giờ chờ, hay nâng timeout tới khi test qua — đều làm con số nhỏ đi và bộ test yếu đi. Một lần tăng tốc chỉ xong khi vẫn kiểm đúng các hành vi cũ — các đột biến của bài 8.2 xác nhận điều đó một cách trung thực.</div>

<h3>Worker, isolate và pool — có số đo</h3>
<p>Mỗi lệnh chạy ba lần bằng <code>time npx vitest run src/ &lt;tuỳ chọn&gt;</code> (và tương tự cho <code>web/</code>):</p>
${TUYCHON_VI}
<ul>
<li><strong>Worker</strong> chạy các file song song; số mặc định lấy theo số nhân CPU (ở đây 10). Một worker làm bộ unit chậm gấp đôi vì các file có lần chờ thật nhỏ.</li>
<li><strong>Pool:</strong> <code>forks</code> (mặc định) = tiến trình con; <code>threads</code> = worker thread, khởi động nhanh hơn nhưng dùng chung tiến trình (không gọi được <code>process.chdir</code>). Ở đây không khác biệt rõ.</li>
<li><strong>Isolate</strong> cho mỗi file bộ nhớ module mới, nên trạng thái module, <code>vi.mock</code> (3.2) và spy (2.4) không rò được.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>--no-isolate đổi an toàn lấy rất ít.</strong> Không isolate, một mock, một đồng hồ giả quên tắt hay một object cấp module của file này vẫn còn ở file kế tiếp trên cùng worker — kiểu chập chờn do trạng thái chung của bài 8.3, nay giữa các file và tuỳ cách file được chia cho worker. Ở đây nó tiết kiệm khoảng 0,15 s cho bộ unit và không đo được gì cho bộ web. Chỉ tắt cho một thư mục bạn biết chắc là thuần, và chỉ sau khi đã đo.</div>

<h3>Chạy ít hơn: chỉ những gì thay đổi có thể làm hỏng</h3>
${ra(DOI)}
<p><code>--changed</code> chỉ chạy file test import thứ mà git báo đã đổi: 1 trên 14 cho <code>login-guard.js</code>, 6 trên 14 cho <code>time.js</code>. <code>vitest related src/rules/time.js --run</code> làm điều đó cho file được chỉ định (6 file, 74 test), watch mode làm sau mỗi lần lưu. Dùng khi đang làm, đừng thay cho lượt chạy đầy đủ trước khi merge: sửa cấu hình, fixture hay schema có thể làm hỏng test không import file nào trong số đó.</p>

<h3>Chia phần còn lại cho nhiều máy</h3>
${ra(OUT['84-shard'])}
<p><code>--shard=i/n</code> giao cho mỗi máy một phần các file: 31 + 56 + 13 = 100, không trùng, không sót — không đều, vì Vitest chia theo file chứ không theo thời gian. <code>--reporter=blob</code> + <code>vitest --mergeReports</code> gộp các shard; Chương 9 chạy chúng bằng matrix CI.</p>

<h3>Ngân sách thời gian, có người gác</h3>
<p>Tốc độ tụt dần, mỗi lần một test chậm: ghi ngân sách ra (unit tính bằng giây, tích hợp dưới một phút, e2e dưới mười phút trong CI) và để một <code>--testTimeout</code> thấp gác bộ unit — unit test cần nửa giây thì gần như chắc chắn đang ngủ.</p>
<p><strong>Trong Java và Spring Boot</strong> núm vặn y hệt: <code>forkCount</code> của Surefire = số worker, <code>reuseForks=false</code> = mỗi class một JVM mới. Spring thêm một chi phí lớn: <code>ApplicationContext</code> mất vài giây nên được lưu theo cấu hình — mỗi bộ <code>@MockBean</code> khác nhau hay <code>@DirtiesContext</code> lại dựng context mới. Và bật Testcontainers một lần mỗi lượt chạy, như Chương 4.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>File này đúng, xanh — và chậm. Làm nó nhanh <strong>mà không kiểm ít đi</strong>, rồi chứng minh bằng <code>--testTimeout=500</code>:</p>
${ma('javascript', CODE.th84De)}
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', SOL)}
${ra(TH)}
${ra(GAC)}
<p>5006 ms thành 29 ms cho cùng ba phép kiểm. <code>bookAndNotify</code> chỉ xong sau khi e-mail đã gửi, nên <code>await</code> là lần chờ vừa đủ — một giây sleep chưa bao giờ cần, và trên máy chậm có khi còn không đủ. Với người gác, ba test ngủ đỏ với <em>Test timed out in 500ms</em>; lời giải vẫn xanh.</p>
<p><strong>Xong khi</strong> bản của bạn chạy dưới 100 ms, qua với <code>--testTimeout=500</code>, và vẫn đỏ nếu bạn sửa “Booking confirmed” trong <code>notify.js</code> hay số lần thử trong <code>retry.js</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">worker (tiến trình chạy test)</span><span class="v">Tiến trình hoặc thread chạy các file test; nhiều worker làm song song.</span></div>
  <div class="kv"><span class="k">pool: forks / threads</span><span class="v">Tiến trình con (mặc định) hoặc worker thread trong một tiến trình.</span></div>
  <div class="kv"><span class="k">isolation (cô lập)</span><span class="v">Mỗi file test một bộ nhớ module mới; <code>--no-isolate</code> tắt nó.</span></div>
  <div class="kv"><span class="k">setup cost (chi phí chuẩn bị)</span><span class="v">Thời gian tiêu trước khi test kiểm được gì: dữ liệu, container, build.</span></div>
  <div class="kv"><span class="k">slow test threshold (ngưỡng test chậm)</span><span class="v">Vượt qua thì Vitest đánh dấu test chậm; mặc định 300 ms.</span></div>
  <div class="kv"><span class="k">--changed / related</span><span class="v">Chỉ chạy file test import file đã đổi (theo git) hoặc file được chỉ định.</span></div>
  <div class="kv"><span class="k">shard (mảnh)</span><span class="v">Một trong n phần của các file test, mỗi phần chạy trên một máy.</span></div>
  <div class="kv"><span class="k">test timeout (giới hạn thời gian test)</span><span class="v">Thời gian tối đa một test được chạy trước khi đỏ; đặt thấp để gác test ngủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo theo tầng, theo file, theo test; đọc dòng Duration trước khi đổi gì.</li>
<li>Test mỗi luật ở tầng thấp nhất còn thấy nó — 3 ms so với 192 ms cho cùng 200 lần kiểm.</li>
<li>Chờ thật và dữ liệu thừa là nguyên nhân thường gặp: 6,14 s thành 210 ms.</li>
<li>Song song che sự chậm; dữ liệu dùng chung mang chập chờn quay lại.</li>
<li>Giữ isolate; khi làm thì chạy ít, trước khi merge thì chạy hết; chia shard khi cần.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-ci-automation', title: 'Lý thuyết ở SWT301 — 8.6: test pyramid và tích hợp liên tục', sub: 'Giống: mỗi tầng của kim tự tháp có một thời gian chạy, và Thread.sleep cố định thì quá ngắn trên máy CI chậm, quá dài ở mọi chỗ khác. Sâu thêm ở đây: từng tầng đo thật trên LabFlow Lite, test chậm tìm từ reporter và sửa đúng nguyên nhân (6,14 s → 210 ms), worker, isolate, --changed và shard có số đo thay cho giả định.', cta: 'MỞ BÀI →' })}
</div>
`,
};
