/**
 * Testing · Chương 8 · 8.3 — Test chập chờn: tìm và sửa. Slug giữ từ khung: tst-8-3-flaky.
 * Chạy thật (Vitest 5.0.5, 01/11/2026): đồng hồ thật đỏ lúc 06:19 +07 và xanh sau 07:00; dữ liệu ngẫu nhiên 21/100 (--repeats=99);
 * thứ tự + trạng thái chung 0/20 theo thứ tự file, 13/20 khi --sequence.shuffle, seed tái hiện đúng test đỏ; mạng 28/100 quá 100 ms;
 * tranh chấp đặt trùng 33/100 (test ĐÚNG, app sai); retry: 17/50 đỏ → 0/50 với --retry=2 (lượt chuẩn bị: 15/50 → 3/50), tóm tắt vẫn
 * "Tests 1 passed"; cách ly bằng tag quarantine (--tagsFilter); bản sửa 11 test × 100 lần, xáo thứ tự, xanh; thực hành: fake timers rò
 * (0/20 → 8/20 khi xáo, seed ⇒ timeout 5000 ms) → afterEach(vi.useRealTimers) ⇒ 0/20.
 */
import G from '../giang/tst-08-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

// Lọc output: chỉ BỎ dòng, không sửa chữ. Khối lặp (21 dòng FAIL giống nhau) giữ một dòng.
const motLan = (l, i, a) => a.indexOf(l) === i;
const bo = (src) => src.split('\n').filter((l) => !/^import /.test(l)).join('\n'); // bỏ dòng import cho gọn (file thật có import)
const GIO = (k) => OUT[k].split('\n').filter((l) => /^\$ |^\d\d:\d\d \+07|^ +[×✓] |AssertionError|Tests {2}|Start at/.test(l)).join('\n');
const LAP = (k, re) => OUT[k].split('\n').filter((l) => /^\$ | FAIL |⎯\[1\/|Tests {2}/.test(l) || re.test(l)).filter(motLan).join('\n');
const NGAU = LAP('83-ngau-nhien', /^AssertionError/);
const DUA = LAP('83-dua-lech', /^AssertionError/);
const MANG = LAP('83-mang', /^Error: Test timed out/);
const SEED = OUT['83-thu-tu-seed'].split('\n').filter((l) => /^\$ |seed "|^ +[×✓] |^AssertionError|Tests {2}/.test(l)).join('\n');
const CACH_LY = OUT['83-cach-ly'].split('\n').filter((l) => /^\$ |quarantine:|^ +[✓↓] |⎯\[1\/|Tests {2}/.test(l)).join('\n');
const DA_SUA = OUT['83-da-sua'].split('\n').filter((l) => /^\$ |seed "|✓ demo8|✓ two students|Tests {2}|red in/.test(l)).join('\n');
const CFG = CODE.vitestConfig.split('\n');
const TH83 = CODE.th83.split('\n').filter((l) => /afterEach|^import/.test(l)).join('\n');
const TAGS = CFG.filter((l) => /tags:/.test(l)).join('\n').replace(/^ {4}/, '');

const NAM_EN = `<table>
<thead><tr><th>Cause</th><th>Demo (demo8/)</th><th>Measured</th><th>Fix at the cause</th></tr></thead>
<tbody>
<tr><td>the real clock</td><td><code>gio-that.test.js</code></td><td>red at 06:19 +07, green after 07:00</td><td>pass the clock in; test 06:30 on purpose</td></tr>
<tr><td>random data</td><td><code>ngau-nhien.test.js</code></td><td>21 of 100 runs red</td><td>name the cases, boundary first (1, 30, 31, 40)</td></tr>
<tr><td>order and shared state</td><td><code>thu-tu.test.js</code></td><td>0/20 in file order, 13/20 shuffled</td><td>every test builds its own state</td></tr>
<tr><td>the network</td><td><code>mang.test.js</code></td><td>28 of 100 runs time out</td><td>fake the provider at the boundary (msw)</td></tr>
<tr><td>a race in the app</td><td><code>dua-lech.test.js</code></td><td>33 of 100 runs: double booking</td><td>fix the APP (constraint, lock) — the test was right</td></tr>
</tbody></table>`;
const NAM_VI = `<table>
<thead><tr><th>Nguyên nhân</th><th>Demo (demo8/)</th><th>Đo được</th><th>Sửa tại gốc</th></tr></thead>
<tbody>
<tr><td>đồng hồ thật</td><td><code>gio-that.test.js</code></td><td>đỏ lúc 06:19 +07, xanh sau 07:00</td><td>truyền đồng hồ vào; cố ý test 06:30</td></tr>
<tr><td>dữ liệu ngẫu nhiên</td><td><code>ngau-nhien.test.js</code></td><td>21 trên 100 lần đỏ</td><td>gọi tên từng ca, biên trước (1, 30, 31, 40)</td></tr>
<tr><td>thứ tự và trạng thái chung</td><td><code>thu-tu.test.js</code></td><td>0/20 theo thứ tự file, 13/20 khi xáo</td><td>mỗi test tự dựng trạng thái của mình</td></tr>
<tr><td>mạng</td><td><code>mang.test.js</code></td><td>28 trên 100 lần quá giờ</td><td>giả nhà cung cấp ở ranh giới (msw)</td></tr>
<tr><td>tranh chấp trong app</td><td><code>dua-lech.test.js</code></td><td>33 trên 100 lần: đặt trùng</td><td>sửa APP (ràng buộc, khoá) — test nói đúng</td></tr>
</tbody></table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Detect</div><div class="lz-d">a red run nobody can explain; CI history; a scheduled shuffled run</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Reproduce</div><div class="lz-d">--repeats, lap-lai.mjs, --sequence.shuffle; keep the SEED of a red run</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quarantine</div><div class="lz-d">tag it, open an issue, name an owner and a date</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Fix the cause</div><div class="lz-d">clock, data, state, network — or the app itself</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Prove</div><div class="lz-d">100 repeats, shuffled, 0 red — the same command that was red</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Release</div><div class="lz-d">remove the tag; the test blocks merges again</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Phát hiện</div><div class="lz-d">một lần đỏ không ai giải thích được; lịch sử CI; một lượt chạy xáo thứ tự theo lịch</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tái hiện</div><div class="lz-d">--repeats, lap-lai.mjs, --sequence.shuffle; giữ SEED của lần đỏ</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Cách ly</div><div class="lz-d">gắn tag, mở issue, ghi người chịu trách nhiệm và hạn</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Sửa nguyên nhân</div><div class="lz-d">đồng hồ, dữ liệu, trạng thái, mạng — hoặc chính app</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chứng minh</div><div class="lz-d">lặp 100 lần, xáo thứ tự, 0 đỏ — đúng lệnh từng đỏ</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Thả ra</div><div class="lz-d">gỡ tag; test lại được quyền chặn merge</div></div>
</div>`;

const NGUON = [
  nguon('🔁', 'Google Testing Blog — Flaky Tests at Google and How We Mitigate Them (2016)', '~1.5% of all test runs flaky; almost 16% of tests have some flakiness; ~84% of pass→fail transitions involve a flaky test.', 'https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html'),
  nguon('🧭', 'Martin Fowler — Eradicating Non-Determinism in Tests', 'Quarantine, isolation, asynchronous waits, remote services, time — the classic causes and cures.', 'https://martinfowler.com/articles/nonDeterminism.html'),
  nguon('🏷️', 'Vitest — Test tags', 'Tag definitions in the config, --tagsFilter with !, &amp;&amp; and ||, --listTags.', 'https://vitest.dev/guide/test-tags'),
].join('\n');

export default {
  title: '8.3 — Flaky tests: finding and fixing them|||8.3 — Test chập chờn: tìm và sửa',
  slug: 'tst-8-3-flaky',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Test chập chờn (flaky) ở tầng Vitest, năm nguyên nhân tái hiện có chủ đích và đo thật: đồng hồ thật (đỏ lúc 06:19 giờ Việt Nam, xanh lúc 07:01), dữ liệu ngẫu nhiên (21/100), thứ tự và trạng thái chung (0/20 theo thứ tự file, 13/20 khi xáo — seed tái hiện đúng lần đỏ), mạng (28/100 quá giờ), và một tranh chấp thật trong app (33/100 đặt trùng — lần này test nói đúng). Retry che lỗi: 17/50 đỏ thành 0/50 mà lượt đặt trùng vẫn còn; cách ly bằng tag quarantine có chủ và hạn; sửa từng nguyên nhân rồi chứng minh bằng 100 lần lặp xáo thứ tự; đối chiếu JUnit.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Flaky tests: finding and fixing them</h2>
<p class="lead">A test that is sometimes red teaches the team one thing: “red does not mean broken, just run it again”. From then on, a real failure looks like noise. This lesson builds five flaky tests on purpose — one per common cause — counts how often each fails, and fixes each one where the problem really is. One of the five turns out to be the only honest test in the room.</p>
<p><strong>After this lesson you can</strong> name the five usual causes; turn “it fails sometimes” into a number and a command; replay a red test order with a seed; quarantine a flaky test without losing it; explain why automatic retries hide bugs; and fix each cause at its root. <strong>Why it is useful:</strong> Google measured that about 1.5% of all its test runs were flaky, almost 16% of its tests had some flakiness, and about 84% of the pass-to-fail changes on its CI involved a flaky test. The person who says “it fails 13 times in 20 when the order changes, here is the seed” instead of “works on my machine” is the person trusted with the test suite.</p>

<h3>What “flaky” means</h3>
<p>A <em>flaky test</em> (test chập chờn) passes and fails on the <strong>same code</strong>: something the test does not control decides — the clock, a random number, which test ran first, the network, or timing. Lesson 7.3 met it in the browser; here we work in Vitest, where a hundred repeats take seconds. The experiments live in <code>demo8/</code> and are red on purpose; <code>npm run test:unit</code> (only <code>src/</code>) stays green.</p>

<h3>Cause 1 — the real clock</h3>
${ma('javascript', bo(CODE.gioThat))}
${ra(GIO('83-gio-that-sang'))}
${ra(GIO('83-gio-that-sau'))}
<p>Red at 06:19, green at 07:01 — same file, same code. <code>toISOString()</code> gives the <strong>UTC</strong> date; at 06:19 in Viet Nam (UTC+7) UTC is still on the previous day, so “tomorrow in UTC” is <em>today</em> here: 0 days ahead. It is the bug class of lesson 2.2, now hiding in a test. Afternoon developers never see it; a nightly CI job at 06:00 sees it every day. <strong>Fix:</strong> never read the real clock in a test. <code>daysAheadVN(date, now)</code> already takes <code>now</code>, so pass a fixed moment — and choose the dangerous one, 06:30, on purpose.</p>

<h3>Cause 2 — random test data</h3>
${ma('javascript', bo(CODE.ngauNhien))}
${ra(NGAU)}
<p>“Any realistic class size” forgets BR-06 (more than 30 seats needs approval). With <code>--repeats=99</code> the test ran 100 times in one process; the <code>FAIL</code> line appears 21 times in the real output (shown once) and <code>[1/21]</code> counts them: <strong>21 red runs in 100</strong>. The summary still says <code>Tests 1 failed (1)</code> — read the error count. <strong>Fix:</strong> name the cases, boundary first (1, 30, 31, 40 seats). For many inputs use a property-based test (lesson 1.4): fast-check prints a seed and the smallest failing input. Random data without a seed is a lottery, not a test.</p>

<h3>Cause 3 — order and shared state</h3>
${ma('javascript', bo(CODE.thuTu))}
<p>One <code>guard</code> is shared by three tests. <code>scripts/lap-lai.mjs</code> runs a Vitest command N times in fresh processes, counts red runs and prints the seed of each red shuffled run:</p>
${ra(OUT['83-thu-tu'])}
<p>File order: 0 red in 20. <code>--sequence.shuffle</code> (random order of files and tests): <strong>13 red in 20</strong> — when “5 wrong passwords lock the account” runs first, the account is already locked for the next test. Now give a red seed back:</p>
${ra(SEED)}
<p>Red twice, same test, same line: a flaky test has become a deterministic bug report.</p>
<div class="pitfall co-tieu-de"><strong>The seed of a red run is your bug report.</strong> “It failed once on CI” cannot be fixed; “it fails with <code>--sequence.shuffle --sequence.seed=1793489700951</code>, test ‘a user with no failures is not locked’” can be fixed by anyone, today. Copy the seed before you press “re-run” — the next run has a new seed and the evidence is gone.</div>
<p><strong>Fix:</strong> every test builds its own state (a <code>beforeEach</code> that creates a new guard). Shuffling is how you check that you did.</p>

<h3>Cause 4 — the network</h3>
${ma('javascript', bo(CODE.mang))}
${ra(MANG)}
<p>A real server that answers in 20–140 ms, like a shared staging service, against a 100 ms test timeout: <strong>28 timeouts in 100</strong>.  <strong>Fix:</strong> fake the provider at the boundary as lesson 3.2 did with msw — real <code>fetch</code>, real adapter, a handler in the test process. Check the real provider separately (a contract test, lesson 5.4, or a smoke test after deploy).</p>

<h3>Cause 5 — a race, and this time the test is right</h3>
${ma('javascript', bo(CODE.duaLech))}
<p><code>slowRepo()</code> (<code>demo8/repo-cham.js</code>) wraps the in-memory repository of Chapter 2 and adds 0–40 ms to every lookup, like a busy database.</p>
${ra(DUA)}
<p><strong>33 runs in 100: both bookings accepted.</strong> The same race made every run red in lesson 2.1 (a fixed 5 ms) and returned <code>[201, 201]</code> in lesson 7.3; with uneven timing it looks like a production race: rare, random, expensive. This flaky test is the honest one. A sleep, sequential calls or a retry would delete the only evidence. <strong>Fix the app:</strong> in PostgreSQL, the <code>EXCLUDE</code> constraint of lesson 4.1; in the demo, one booking per lab may check and insert at a time (<code>oneAtATime</code> in <code>demo8/da-sua.test.js</code>).</p>

<h3>Retries hide bugs — measured</h3>
${ra(OUT['83-retry'])}
<p>Same race test, 50 fresh runs each: <strong>17 red without retry, 0 with <code>--retry=2</code></strong>. The double booking is as real as before; only the evidence is gone. (A first measurement while preparing this lesson gave 15/50 and 3/50 — the numbers move, the conclusion does not.) When a retry saved the run, Vitest prints <code>Tests 1 passed (1)</code>; the only trace is <code>(retry x1)</code> at the end of one tree line. Playwright at least counts “1 flaky” (lesson 7.3).</p>
<div class="pitfall co-tieu-de"><strong>Retries hide bugs.</strong> A retry turns a 1-in-3 failure into 1-in-27, then into silence. Fine for a CI machine that hiccups; fatal for a race or a timezone bug that users will hit. Rules that work: no retries locally; on CI at most one or two, only for slow infrastructure (browser, database); every test that needed a retry is reported (Playwright “flaky”, Surefire “Flakes”) and gets an issue. Never raise the retry count to make a pipeline green.</div>

<h3>Quarantine: stop the noise, keep the test</h3>
<p>The race needs a change in the data layer — not a one-hour fix. Deleting the test loses the evidence; leaving it red trains everyone to ignore red. <em>Quarantine</em> (cách ly) keeps it running in a separate job that does not block merges. Vitest 5 has <em>test tags</em>; the tag is declared in <code>vitest.config.js</code>:</p>
${ma('javascript', TAGS)}
${ma('javascript', bo(CODE.cachLy))}
${ra(CACH_LY)}
<p><code>--listTags</code> shows the tag and its meaning; the main job runs <code>--tagsFilter='!quarantine'</code> (1 passed, 1 skipped — visibly skipped, not lost); a separate non-blocking job runs <code>--tagsFilter=quarantine --repeats=19</code> and still finds the bug 8 times in 20.</p>
<div class="pitfall co-tieu-de"><strong>Quarantine is a hospital, not a graveyard.</strong> A quarantined test without an owner and a date is a deleted test that still costs CI time. Put the issue, the owner and the deadline next to the tag (<code>LAB-142 (owner: an, fix by 2026-11-20)</code>) and treat a growing quarantine as a team problem.</div>

<h3>The routine, and all five fixed</h3>
${FLOW_EN}
${NAM_EN}
<p>All five fixes are in <code>demo8/da-sua.test.js</code>. The proof is the kind of command that used to fail — 100 shuffled repeats, then 20 fresh shuffled processes:</p>
${ra(DA_SUA)}
<p>Eleven tests × 100 repeats in a random order, then <strong>0 red in 20</strong>. “Fixed” means the command that used to fail now passes, many times.</p>

<h3>The same tools in JUnit</h3>
<p>In a Spring Boot project: <code>@RepeatedTest(100)</code> repeats a test; <code>junit.jupiter.testmethod.order.default = org.junit.jupiter.api.MethodOrderer$Random</code> in <code>junit-platform.properties</code> shuffles test methods and <code>junit.jupiter.execution.order.random.seed</code> replays one order; Maven Surefire’s <code>-Dsurefire.rerunFailingTestsCount=2</code> reruns failures and lists them as <em>Flakes</em> in the summary — useful because it reports instead of hiding; <code>@Tag("quarantine")</code> with <code>-DexcludedGroups=quarantine</code> is the quarantine job.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>This file is green when you run it the normal way. Is it reliable?</p>
${ma('javascript', bo(CODE.th83De))}
<ol>
<li>Run it 20 times in file order and 20 times shuffled with <code>node scripts/lap-lai.mjs</code>; note both numbers and the first red seed.</li>
<li>Replay that seed with <code>--sequence.shuffle --sequence.seed=&lt;seed&gt;</code>. Which test fails, with what message?</li>
<li>Fix the cause without deleting a test, and prove it with 20 shuffled runs.</li>
</ol>
${ra(OUT['83-th-de'])}
<p><strong>Solution and real output:</strong> when the second test runs first, it turns fake timers on and never off. Fake timers are global, so the first test’s <code>retry(send, { delayMs: 10 })</code> waits for a timer that never fires — until Vitest’s 5-second timeout (<code>restoreMocks: true</code> restores spies, not timers). Whoever turns fake timers on must turn them off — <code>demo8/th83.test.js</code> adds one hook:</p>
${ma('javascript', TH83)}
${ra(OUT['83-th'])}
<p><strong>Done when</strong> you measured about 0/20 vs 8/20 on the given file, the seed replay fails with “Test timed out in 5000ms” on “a mail that works on the 2nd try is sent”, and your fixed file is red in 0 of 20 shuffled runs.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">Passes and fails on the same code.</span></div>
  <div class="kv"><span class="k">non-determinism (không tất định)</span><span class="v">Clock, randomness, order, network, timing — inputs the test does not control.</span></div>
  <div class="kv"><span class="k">--repeats</span><span class="v">Runs every test N more times in one process.</span></div>
  <div class="kv"><span class="k">--sequence.shuffle (xáo thứ tự)</span><span class="v">Runs files and tests in a random order.</span></div>
  <div class="kv"><span class="k">seed (hạt giống ngẫu nhiên)</span><span class="v">Fixes a random order; <code>--sequence.seed</code> replays it.</span></div>
  <div class="kv"><span class="k">shared state (trạng thái dùng chung)</span><span class="v">One object used by several tests; the usual cause of order-dependence.</span></div>
  <div class="kv"><span class="k">race condition (tranh chấp)</span><span class="v">The result depends on which of two things finishes first.</span></div>
  <div class="kv"><span class="k">quarantine (cách ly)</span><span class="v">A known flaky test in a non-blocking job, with an issue, an owner and a date.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Flaky = same code, different result. Measure it: N red runs in 100, not “sometimes”.</li>
<li>Inject the clock; name the cases; fresh state per test; fake the network; fix races in the app.</li>
<li><code>--repeats</code> inside one process, <code>lap-lai.mjs</code> + <code>--sequence.shuffle</code> for order; keep every red seed.</li>
<li>Retries turned 17/50 red into 0/50 while the double booking stayed.</li>
<li>Quarantine with a tag, an issue, an owner and a date; prove a fix with the command that used to fail.</li>
</ul>

${NGUON}

${lienKet({ bai: 'swt301-ci-automation', title: 'Theory in SWT301 — 8.6: test pyramid, CI and flaky UI tests', sub: 'Same: a flaky test fails without any code change, and a fixed sleep is too short on a slow CI machine and too long everywhere else. Deeper here: five causes reproduced and measured on a real project (21, 28 and 33 failures in 100 runs, 13 red in 20 shuffled runs), a seed that replays the red order, retries that turned 17 red runs in 50 into 0, quarantine with tags, and a fix at each cause.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Node.js course — 14.5: coverage, flaky tests and CI', sub: 'Same: the usual causes of flaky tests in a Node backend and why they matter in CI. Deeper here: every cause made to fail on purpose and counted, the order seed, the cost of retries, and quarantine with Vitest 5 test tags.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Test chập chờn: tìm và sửa</h2>
<p class="lead">Một test thỉnh thoảng đỏ dạy cả nhóm đúng một điều: “đỏ không có nghĩa là hỏng, cứ chạy lại”. Từ đó, lỗi thật trông y như tiếng ồn. Bài này cố ý dựng năm test chập chờn — mỗi cái một nguyên nhân hay gặp — đếm xem mỗi cái đỏ bao nhiêu lần, và sửa từng cái đúng chỗ vấn đề nằm. Một trong năm cái hoá ra là test trung thực duy nhất trong phòng.</p>
<p><strong>Sau bài này bạn có thể</strong> gọi tên năm nguyên nhân thường gặp; biến “thỉnh thoảng đỏ” thành một con số và một lệnh; phát lại đúng thứ tự từng đỏ bằng seed; cách ly test chập chờn mà không mất nó; giải thích vì sao tự động chạy lại (retry) che lỗi; và sửa từng nguyên nhân tận gốc. <strong>Vì sao hữu ích:</strong> Google đo được khoảng 1,5% tổng số lần chạy test của họ là chập chờn, gần 16% số test có chập chờn ở mức nào đó, và khoảng 84% lần CI thấy xanh chuyển đỏ có dính tới test chập chờn. Người nói được “nó đỏ 13 trên 20 lần khi đổi thứ tự, seed đây” thay vì “máy em chạy được mà” là người được giao giữ bộ test.</p>

<h3>“Chập chờn” là gì</h3>
<p><em>Flaky test</em> (test chập chờn) là test lúc xanh lúc đỏ trên <strong>cùng một code</strong>: một thứ test không kiểm soát quyết định kết quả — đồng hồ, số ngẫu nhiên, test nào chạy trước, mạng, hay thời điểm. Bài 7.3 gặp nó trên trình duyệt; ở đây ta làm với Vitest, nơi một trăm lần lặp chỉ mất vài giây. Các thí nghiệm nằm trong <code>demo8/</code> và cố ý đỏ; <code>npm run test:unit</code> (chỉ <code>src/</code>) vẫn xanh.</p>

<h3>Nguyên nhân 1 — đồng hồ thật</h3>
${ma('javascript', bo(CODE.gioThat))}
${ra(GIO('83-gio-that-sang'))}
${ra(GIO('83-gio-that-sau'))}
<p>Đỏ lúc 06:19, xanh lúc 07:01 — cùng file, cùng code. <code>toISOString()</code> cho ngày theo <strong>UTC</strong>; lúc 06:19 ở Việt Nam (UTC+7) thì UTC vẫn đang ở hôm trước, nên “ngày mai theo UTC” lại là <em>hôm nay</em> ở đây: 0 ngày tới. Đúng loại bug của bài 2.2, giờ trốn trong test. Người làm buổi chiều không bao giờ thấy; job CI chạy đêm lúc 06:00 thấy mỗi ngày. <strong>Cách sửa:</strong> test không bao giờ đọc đồng hồ thật. <code>daysAheadVN(date, now)</code> vốn đã nhận <code>now</code>, nên truyền một thời điểm cố định — và cố ý chọn giờ nguy hiểm, 06:30.</p>

<h3>Nguyên nhân 2 — dữ liệu test ngẫu nhiên</h3>
${ma('javascript', bo(CODE.ngauNhien))}
${ra(NGAU)}
<p>“Sĩ số lớp bất kỳ, thực tế” quên mất BR-06 (hơn 30 chỗ phải chờ duyệt). Với <code>--repeats=99</code>, test chạy 100 lần trong một tiến trình; dòng <code>FAIL</code> xuất hiện 21 lần trong output thật (ở đây hiện một lần) và <code>[1/21]</code> đếm chúng: <strong>21 lần đỏ trên 100</strong>. Tóm tắt vẫn ghi <code>Tests 1 failed (1)</code> — hãy đọc số lỗi. <strong>Cách sửa:</strong> gọi tên từng ca, biên trước (1, 30, 31, 40 chỗ). Cần nhiều đầu vào thì dùng property-based test (bài 1.4): fast-check in seed và đầu vào hỏng nhỏ nhất. Dữ liệu ngẫu nhiên không seed là xổ số, không phải kiểm thử.</p>

<h3>Nguyên nhân 3 — thứ tự và trạng thái dùng chung</h3>
${ma('javascript', bo(CODE.thuTu))}
<p>Một <code>guard</code> được ba test dùng chung. <code>scripts/lap-lai.mjs</code> chạy một lệnh Vitest N lần trong các tiến trình mới, đếm số lần đỏ và in seed của từng lần đỏ khi xáo thứ tự:</p>
${ra(OUT['83-thu-tu'])}
<p>Theo thứ tự file: 0 đỏ trên 20. <code>--sequence.shuffle</code> (thứ tự file và test ngẫu nhiên): <strong>13 đỏ trên 20</strong> — khi “5 wrong passwords lock the account” chạy trước, tài khoản đã bị khoá sẵn cho test sau. Giờ đưa một seed đỏ trở lại:</p>
${ra(SEED)}
<p>Đỏ hai lần, cùng test, cùng dòng: một test chập chờn đã thành một báo cáo bug tất định.</p>
<div class="pitfall co-tieu-de"><strong>Seed của lần đỏ chính là báo cáo bug của bạn.</strong> “Có lần nó đỏ trên CI” thì không sửa được; “nó đỏ với <code>--sequence.shuffle --sequence.seed=1793489700951</code>, test ‘a user with no failures is not locked’” thì ai cũng sửa được, ngay hôm nay. Chép seed trước khi bấm “re-run” — lần chạy sau có seed mới và bằng chứng biến mất.</div>
<p><strong>Cách sửa:</strong> mỗi test tự dựng trạng thái của mình (một <code>beforeEach</code> tạo guard mới). Xáo thứ tự là cách kiểm bạn đã làm đúng chưa.</p>

<h3>Nguyên nhân 4 — mạng</h3>
${ma('javascript', bo(CODE.mang))}
${ra(MANG)}
<p>Một server thật trả lời trong 20–140 ms, giống dịch vụ staging dùng chung, gặp timeout 100 ms của test: <strong>28 lần quá giờ trên 100</strong>.  <strong>Cách sửa:</strong> giả nhà cung cấp ở ranh giới như bài 3.2 làm với msw — <code>fetch</code> thật, adapter thật, một handler trong tiến trình test. Nhà cung cấp thật được kiểm riêng (contract test ở bài 5.4, hoặc smoke test sau deploy).</p>

<h3>Nguyên nhân 5 — tranh chấp, và lần này test nói đúng</h3>
${ma('javascript', bo(CODE.duaLech))}
<p><code>slowRepo()</code> (<code>demo8/repo-cham.js</code>) bọc repository bộ nhớ của Chương 2 và cộng thêm 0–40 ms cho mỗi lần tra cứu, giống một CSDL đang bận.</p>
${ra(DUA)}
<p><strong>33 lần trên 100: cả hai lượt đặt đều được nhận.</strong> Cùng race này làm mọi lần đỏ ở bài 2.1 (đúng 5 ms) và trả về <code>[201, 201]</code> ở bài 7.3; với thời gian không đều, nó mang dáng race trên production: hiếm, ngẫu nhiên, đắt. Test chập chờn này mới là test trung thực. Thêm sleep, gọi tuần tự hay retry là xoá bằng chứng duy nhất. <strong>Hãy sửa app:</strong> trên PostgreSQL là ràng buộc <code>EXCLUDE</code> của bài 4.1; trong demo, mỗi phòng chỉ một lượt đặt được kiểm và ghi tại một thời điểm (<code>oneAtATime</code> trong <code>demo8/da-sua.test.js</code>).</p>

<h3>Retry che lỗi — đo thật</h3>
${ra(OUT['83-retry'])}
<p>Cùng test tranh chấp, mỗi bên 50 lần chạy mới: <strong>17 đỏ khi không retry, 0 với <code>--retry=2</code></strong>. Lượt đặt trùng vẫn thật như trước; chỉ bằng chứng là biến mất. (Một lần đo đầu lúc soạn bài được 15/50 và 3/50 — con số xê dịch, kết luận thì không.) Khi một lần chạy lại cứu được, Vitest in <code>Tests 1 passed (1)</code>; dấu vết duy nhất là <code>(retry x1)</code> ở cuối một dòng trong cây. Playwright ít ra còn đếm “1 flaky” (bài 7.3).</p>
<div class="pitfall co-tieu-de"><strong>Retry che lỗi.</strong> Retry biến lỗi 1-trên-3 thành 1-trên-27, rồi thành im lặng. Được với máy CI thỉnh thoảng hắt hơi; chết người với race hay bug múi giờ mà người dùng sẽ gặp. Luật dùng được: không retry trên máy mình; trên CI tối đa một hai lần, chỉ cho hạ tầng chậm (trình duyệt, CSDL); mọi test cần retry mới qua đều được báo ra (“flaky” của Playwright, “Flakes” của Surefire) và có issue. Không bao giờ tăng số lần retry để pipeline xanh.</div>

<h3>Cách ly: dập tiếng ồn, giữ lại test</h3>
<p>Race cần đổi tầng dữ liệu — không sửa xong trong một giờ. Xoá test là mất bằng chứng; để nó đỏ là dạy mọi người lờ màu đỏ. <em>Quarantine</em> (cách ly) cho test chạy trong một job riêng không chặn merge. Vitest 5 có <em>test tag</em>; tag khai báo trong <code>vitest.config.js</code>:</p>
${ma('javascript', TAGS)}
${ma('javascript', bo(CODE.cachLy))}
${ra(CACH_LY)}
<p><code>--listTags</code> liệt kê tag và ý nghĩa; job chính chạy <code>--tagsFilter='!quarantine'</code> (1 qua, 1 bỏ qua — bỏ qua một cách nhìn thấy được, không mất); một job riêng không chặn merge chạy <code>--tagsFilter=quarantine --repeats=19</code> và vẫn bắt được bug 8 trên 20 lần.</p>
<div class="pitfall co-tieu-de"><strong>Cách ly là bệnh viện, không phải nghĩa địa.</strong> Test bị cách ly mà không có người phụ trách và hạn chót là test đã xoá mà vẫn tốn giờ CI. Ghi issue, người phụ trách và hạn ngay cạnh tag (<code>LAB-142 (owner: an, fix by 2026-11-20)</code>) và coi danh sách cách ly dài ra là vấn đề của cả nhóm.</div>

<h3>Quy trình, và cả năm đã sửa</h3>
${FLOW_VI}
${NAM_VI}
<p>Cả năm cách sửa nằm trong <code>demo8/da-sua.test.js</code>. Bằng chứng là đúng loại lệnh từng đỏ — 100 lần lặp xáo thứ tự, rồi 20 tiến trình mới xáo thứ tự:</p>
${ra(DA_SUA)}
<p>Mười một test × 100 lần lặp theo thứ tự ngẫu nhiên, rồi <strong>0 đỏ trên 20</strong>. “Đã sửa” nghĩa là lệnh từng đỏ giờ qua, nhiều lần.</p>

<h3>Cùng bộ công cụ trong JUnit</h3>
<p>Trong dự án Spring Boot: <code>@RepeatedTest(100)</code> lặp một test; <code>junit.jupiter.testmethod.order.default = org.junit.jupiter.api.MethodOrderer$Random</code> trong <code>junit-platform.properties</code> xáo thứ tự phương thức test và <code>junit.jupiter.execution.order.random.seed</code> phát lại một thứ tự; <code>-Dsurefire.rerunFailingTestsCount=2</code> của Maven Surefire chạy lại test hỏng và liệt kê chúng là <em>Flakes</em> trong tóm tắt — có ích vì nó báo ra thay vì giấu; <code>@Tag("quarantine")</code> cùng <code>-DexcludedGroups=quarantine</code> là job cách ly.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>File này xanh khi chạy theo cách bình thường. Nó có đáng tin không?</p>
${ma('javascript', bo(CODE.th83De))}
<ol>
<li>Chạy 20 lần theo thứ tự file và 20 lần xáo thứ tự bằng <code>node scripts/lap-lai.mjs</code>; ghi lại hai con số và seed đỏ đầu tiên.</li>
<li>Phát lại seed đó bằng <code>--sequence.shuffle --sequence.seed=&lt;seed&gt;</code>. Test nào đỏ, thông báo gì?</li>
<li>Sửa nguyên nhân mà không xoá test nào, rồi chứng minh bằng 20 lần chạy xáo thứ tự.</li>
</ol>
${ra(OUT['83-th-de'])}
<p><strong>Lời giải và output thật:</strong> khi test thứ hai chạy trước, nó bật fake timers mà không tắt. Fake timers là toàn cục, nên <code>retry(send, { delayMs: 10 })</code> của test thứ nhất chờ một timer không bao giờ nổ — tới timeout 5 giây của Vitest (<code>restoreMocks: true</code> chỉ khôi phục spy, không khôi phục timer). Ai bật fake timers thì phải tắt — <code>demo8/th83.test.js</code> thêm một hook:</p>
${ma('javascript', TH83)}
${ra(OUT['83-th'])}
<p><strong>Xong khi</strong> bạn đo được khoảng 0/20 so với 8/20 trên file đề, lần phát lại theo seed đỏ với “Test timed out in 5000ms” ở test “a mail that works on the 2nd try is sent”, và file đã sửa đỏ 0 trên 20 lần chạy xáo thứ tự.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">Lúc xanh lúc đỏ trên cùng một code.</span></div>
  <div class="kv"><span class="k">non-determinism (không tất định)</span><span class="v">Đồng hồ, ngẫu nhiên, thứ tự, mạng, thời điểm — đầu vào test không kiểm soát.</span></div>
  <div class="kv"><span class="k">--repeats</span><span class="v">Chạy thêm mỗi test N lần trong một tiến trình.</span></div>
  <div class="kv"><span class="k">--sequence.shuffle (xáo thứ tự)</span><span class="v">Chạy file và test theo thứ tự ngẫu nhiên.</span></div>
  <div class="kv"><span class="k">seed (hạt giống ngẫu nhiên)</span><span class="v">Cố định một thứ tự ngẫu nhiên; <code>--sequence.seed</code> phát lại nó.</span></div>
  <div class="kv"><span class="k">shared state (trạng thái dùng chung)</span><span class="v">Một đối tượng nhiều test cùng dùng; thủ phạm thường gặp của phụ thuộc thứ tự.</span></div>
  <div class="kv"><span class="k">race condition (tranh chấp)</span><span class="v">Kết quả tuỳ việc nào trong hai việc xong trước.</span></div>
  <div class="kv"><span class="k">quarantine (cách ly)</span><span class="v">Test chập chờn đã biết chạy trong job không chặn merge, có issue, người phụ trách và hạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chập chờn = cùng code, khác kết quả. Hãy đo: N lần đỏ trên 100, không phải “thỉnh thoảng”.</li>
<li>Tiêm đồng hồ; gọi tên từng ca; trạng thái mới cho mỗi test; giả mạng; sửa race trong app.</li>
<li><code>--repeats</code> trong một tiến trình, <code>lap-lai.mjs</code> + <code>--sequence.shuffle</code> cho thứ tự; giữ mọi seed đỏ.</li>
<li>Retry biến 17/50 lần đỏ thành 0/50 trong khi lượt đặt trùng vẫn còn.</li>
<li>Cách ly bằng tag, issue, người phụ trách và hạn; chứng minh bản sửa bằng chính lệnh từng đỏ.</li>
</ul>

${NGUON}

${lienKet({ bai: 'swt301-ci-automation', title: 'Lý thuyết ở SWT301 — 8.6: kim tự tháp test, CI và test UI chập chờn', sub: 'Giống: test chập chờn đỏ mà code không đổi, và một lần sleep cố định thì quá ngắn trên máy CI chậm, quá dài ở mọi chỗ khác. Sâu thêm ở đây: năm nguyên nhân được tái hiện và đo trên dự án thật (21, 28 và 33 lần đỏ trên 100, 13 lần đỏ trên 20 khi xáo thứ tự), seed phát lại đúng thứ tự đỏ, retry biến 17/50 lần đỏ thành 0, cách ly bằng tag, và sửa tại từng nguyên nhân.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Khoá Node.js — 14.5: độ phủ, test chập chờn và CI', sub: 'Giống: các nguyên nhân thường gặp của test chập chờn trong backend Node và vì sao chúng quan trọng trong CI. Sâu thêm ở đây: từng nguyên nhân được cố ý làm đỏ và đếm, seed thứ tự, cái giá của retry, và cách ly bằng test tag của Vitest 5.', cta: 'MỞ BÀI →' })}
</div>
`,
};
