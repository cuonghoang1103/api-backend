/**
 * Testing · Chương 8 · 8.2 — Mutation testing: kiểm tra chính bộ test. Slug giữ từ khung: tst-8-2-mutation.
 * Chạy thật (StrykerJS 10.1.1 + @stryker-mutator/vitest-runner 10.1.1, Vitest 5.0.5): bộ test 100% độ phủ của 8.1 chỉ diệt 41,49% (39/94);
 * bộ unit thật 88,96% (163 đột biến: 144 diệt, 1 timeout, 11 sống, 7 không phủ) → thêm src/rules/mutation-gaps.test.js → 98,16% (3 sống: 2 tương đương
 * ở days.js + 1 trong bộ sinh số ngẫu nhiên); chi phí 0,768 s so với 10,531 s; incremental 10 s → 2 s; sandbox sót làm vitest run src/ chạy 20 file / 170 test.
 */
import G from '../giang/tst-08-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const L = (k) => OUT[k].split('\n');
// One "[Survived] …" / "[NoCoverage] …" block of the clear-text report: status, location, the - and + lines (n = which match).
const khoi = (k, loc, n = 0) => {
  const a = L(k);
  const at = a.map((l, i) => (l === loc ? i : -1)).filter((i) => i >= 0)[n];
  let j = at + 1;
  while (j < a.length && /^[-+] /.test(a[j])) j++;
  return a.slice(at - 1, j).join('\n');
};
// The score table at the end of a run: header and data rows, the verdict line and "Done in".
const bang = (k) => L(k).filter((l) => /^(File|All files| \w+\.js) +\|.*\|$|breaking threshold|Done in/.test(l)).join('\n');

const YEU = [L('82-yeu')[0], khoi('82-yeu', 'src/rules/booking.js:13:54'), '…', bang('82-yeu')].join('\n');
const LAN_DAU = [L('82-lan-dau')[0], '…', bang('82-lan-dau')].join('\n');
const S_BIEN = khoi('82-lan-dau', 'src/rules/booking.js:25:35');
const S_REGEX = khoi('82-lan-dau', 'src/rules/time.js:3:13', 1);
const S_FALSE = khoi('82-lan-dau', 'src/rules/time.js:4:7');
const SAU = bang('82-sau');
const TH_TRUOC = L('82-th-truoc').filter((l) => /^\$ |^\[Survived\]|^src\/|^[-+] |retry\.js +\|/.test(l)).join('\n');
const TH_SAU = L('82-th-sau').filter((l) => /retry\.js +\|/.test(l)).join('\n');
const VC = CODE.vitestConfig.split('\n').filter((l) => /exclude: \[\.\.\.configDefaults/.test(l)).join('\n');
const SCRIPT = CODE.pkg.split('\n').filter((l) => /"test:mutation"/.test(l)).join('\n');


const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Instrument</div><div class="lz-d">create every mutant (163 in src/rules) in a copy under .stryker-tmp/</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Dry run</div><div class="lz-d">run the suite once unchanged — it must be green; record which test reaches which mutant</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Each mutant</div><div class="lz-d">switch it on, run only the tests that reach it</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Status</div><div class="lz-d">red → killed · green → survived · unreached → no coverage · hangs → timeout</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Score</div><div class="lz-d">(killed + timeout) ÷ mutants; below thresholds.break → exit 1</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Cài đột biến</div><div class="lz-d">tạo mọi đột biến (163 trong src/rules) trong một bản sao ở .stryker-tmp/</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chạy thử</div><div class="lz-d">chạy bộ test một lần trên code nguyên vẹn — phải xanh; ghi lại test nào chạm tới đột biến nào</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Từng đột biến</div><div class="lz-d">bật nó lên, chỉ chạy những test chạm tới nó</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Trạng thái</div><div class="lz-d">đỏ → killed · xanh → survived · không ai chạm → no coverage · treo → timeout</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Điểm</div><div class="lz-d">(killed + timeout) ÷ số đột biến; dưới thresholds.break → thoát mã 1</div></div>
</div>`;

const KHI_EN = `<table>
<thead><tr><th>Tool</th><th>Answers</th><th>Cost here</th><th>Use it</th></tr></thead>
<tbody>
<tr><td>Coverage (8.1)</td><td>Which lines and branches ran?</td><td>~0.1 s extra</td><td>every CI run</td></tr>
<tr><td>Hand-made mutants (dot-bien)</td><td>Are <em>these</em> 8 bugs caught?</td><td>8 suite runs</td><td>grading; bugs you already had</td></tr>
<tr><td>Stryker</td><td>Would <em>any</em> small change be noticed?</td><td>14× the suite</td><td>pull requests (changed files) or nightly</td></tr>
<tr><td>Reading the tests</td><td>Do they state the rule?</td><td>a reviewer’s time</td><td>always</td></tr>
</tbody></table>`;
const KHI_VI = `<table>
<thead><tr><th>Công cụ</th><th>Trả lời</th><th>Giá ở đây</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td>Độ phủ (8.1)</td><td>Dòng và nhánh nào đã chạy?</td><td>~0,1 s thêm</td><td>mọi lần chạy CI</td></tr>
<tr><td>Đột biến làm tay (dot-bien)</td><td><em>8 bug này</em> có bị bắt không?</td><td>8 lần chạy bộ test</td><td>chấm bài; bug đã từng gặp</td></tr>
<tr><td>Stryker</td><td><em>Bất kỳ</em> thay đổi nhỏ nào có bị nhận ra?</td><td>gấp 14 lần bộ test</td><td>pull request (file đã đổi) hoặc chạy đêm</td></tr>
<tr><td>Đọc test</td><td>Test có nói rõ luật không?</td><td>thời gian người review</td><td>luôn luôn</td></tr>
</tbody></table>`;

export default {
  title: '8.2 — Mutation testing: testing your tests|||8.2 — Mutation testing: kiểm tra chính bộ test',
  slug: 'tst-8-2-mutation',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Từ đột biến làm tay của Lab 1–7 sang StrykerJS chạy thật trên LabFlow Lite: cấu hình cho Vitest; chính bộ test 100% độ phủ của bài 8.1 chỉ diệt 41,49% (39/94 đột biến); bộ unit thật 88,96% — đọc đột biến sống (1 chỗ chưa ai test, regex mất ^ và $, TypeError đúng kiểu nhưng sai lý do) rồi viết 9 test để lên 98,16%; đột biến tương đương (Date.parse); cái giá 0,768 s so với 10,531 s, incremental 10 s → 2 s; bẫy sandbox .stryker-tmp; PIT bên Java.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Mutation testing: testing your tests</h2>
<p class="lead">Lesson 8.1 ended badly: a suite that only asked <code>toBeDefined()</code> reached 100% coverage, and planted bugs still passed. Coverage says which code <em>ran</em>. This lesson measures what you really want to know: <strong>if somebody breaks this code, does a test go red?</strong></p>
<p><strong>After this lesson you can</strong> set up StrykerJS for Vitest, read its report, turn surviving mutants into the missing tests, recognise an equivalent mutant, and decide when the extra run time is worth it. <strong>Why it is useful:</strong> it is the most honest answer to “are our tests any good?”, it finds missing boundary tests faster than a review, and explaining with numbers why 100% coverage is not enough is a strong interview answer.</p>

<h3>You have done this since Lab 1</h3>
<p>Every lab ended with <code>scripts/dot-bien*.mjs</code>: change one line (<code>&lt;=</code> → <code>&lt;</code>), run the tests, restore. Each changed copy is a <em>mutant</em> (đột biến): red means <em>killed</em>, green means <em>survived</em> — a bug your tests would let through. That was mutation testing by hand, with 8 mutants a person chose. A tool applies <em>mutation operators</em> to every place they fit: <code>EqualityOperator</code> (<code>&lt;</code> → <code>&lt;=</code>), <code>ConditionalExpression</code> (condition → <code>true</code>/<code>false</code>), <code>StringLiteral</code> (→ <code>""</code>), <code>Regex</code> (drop <code>^</code> or <code>$</code>), <code>ArithmeticOperator</code>, <code>BlockStatement</code>… In JavaScript the tool is <strong>StrykerJS</strong>; in Java, <strong>PIT</strong>.</p>
${FLOW_EN}

<h3>Setting up Stryker for Vitest</h3>
<p>Install <code>@stryker-mutator/core</code> and <code>@stryker-mutator/vitest-runner</code> (both 10.1.1, pinned), then add <code>stryker.config.mjs</code>:</p>
${ma('javascript', CODE.strykerConfig)}
<p><code>dir: 'src'</code> matters: the dry run must be green, and our <code>demo*/</code> folders are red on purpose. <code>perTest</code> makes each mutant run only the tests that reach it. <code>break: 80</code> makes the command fail below 80%, so it can gate a pipeline. The script: <code>${SCRIPT.trim()}</code>.</p>

<h3>Same suite: 100% coverage, 41.49% killed</h3>
<p>Point Stryker at the weak suite of lesson 8.1 only (<code>demo8/stryker.yeu.config.mjs</code> runs <code>demo8/du-nhanh.test.js</code> against <code>booking.js</code>, with <code>break: 60</code>):</p>
${ra(YEU)}
<p>94 mutants, 39 killed: <strong>41.49%</strong>, exit code 1. An off-grid slot returns <code>ok: true</code> — the rule reversed — and the suite stays green because <code>toBeDefined()</code> is true for any answer. Coverage said “every line ran”; mutation testing says “most of those lines could be wrong and nobody would know”.</p>

<h3>The real unit suite: 88.96%</h3>
${ra(LAN_DAU)}
<ul>
<li><strong>killed 144, timeout 1</strong> — detected (a hang also fails the suite).</li>
<li><strong>survived 11</strong> — tests ran on the change and stayed green.</li>
<li><strong>no cov 7</strong> — no test reaches that code: the uncovered lines of 8.1 again.</li>
<li><strong>total</strong> 145 ÷ 163 = 88.96%; <strong>covered</strong> 145 ÷ 156 = 92.95%. A big gap means “test untouched code first”; a low covered score means “your tests check too little of what they run”.</li>
</ul>

<h3>Every survivor is a missing test</h3>
${ra(S_BIEN)}
<p><code>seats &lt; 1</code> → <code>seats &lt;= 1</code> survives: the tests try 0, −5 and 2.5 seats but never the smallest <em>valid</em> value, 1 — boundary value analysis says test both sides. Among the no-coverage mutants is <code>'CONFIRMED'</code> → <code>""</code>: in <code>src/</code>, <code>createBooking</code> only ever books 31 seats — the branch 8.1’s report painted yellow.</p>
${ra(S_REGEX)}
<p>Without <code>^</code>, <code>"108:00"</code> is read as 08:00 (and without <code>$</code>, <code>"08:000"</code>). No test sends extra characters.</p>
${ra(S_FALSE)}
<div class="pitfall co-tieu-de"><strong>A test can pass for the wrong reason.</strong> With the check replaced by <code>false</code>, <code>parseTime("7:00")</code> reads <code>m[1]</code> of <code>null</code> — which also throws a <code>TypeError</code> (“Cannot read properties of null”). The test asked only <code>toThrow(TypeError)</code>, so it stayed green while the code crashed instead of validating. When the type alone could come from a crash, assert the message: <code>toThrow('expected HH:MM')</code>.</div>
<p>The other survivors: the error messages (no test reads them), the default <code>newId</code>/<code>now</code> of <code>newBookingRecord</code> (every test replaces them), one line of arithmetic in the seeded random generator, and two string literals in <code>days.js</code>.</p>

<h3>Nine tests later: 98.16%</h3>
<p>The new tests go into their own file, so the Chapter 1–2 references stay as taught. Each comment names its mutant:</p>
${ma('javascript', CODE.mutationGaps)}
${ra(SAU)}

<h3>Equivalent mutants: no test can kill them</h3>
${ra(OUT['82-tuong-duong'])}
<p>A date-only string like <code>'2026-11-16'</code> is already midnight UTC, so deleting <code>'T00:00:00Z'</code> in <code>days.js</code> changes the text, never a result. That is an <em>equivalent mutant</em>: no test can ever kill it. Recognise it, record why — teams write <code>// Stryker disable next-line StringLiteral: date-only ISO strings are already UTC</code> next to the line — and move on. (We keep <code>days.js</code> unchanged so Chapter 2 still matches.) The third survivor, in the random generator, <em>could</em> be killed by a golden-value test (“seed 7 gives exactly this code”), but that pins the generator itself; it is accepted here, on purpose.</p>
<div class="pitfall co-tieu-de"><strong>The mutation score is not a target either.</strong> 98.16% with three explained survivors beats 100% reached by pinning internals nobody cares about. Read the report as questions — “would a user notice this change?” — and gate with a <code>break</code> just below today’s score, raised as the suite improves.</div>

<h3>The cost, and how to pay less</h3>
${ra(OUT['82-chi-phi'])}
<p>One suite run per mutant: 10.5 s against 0.77 s for the plain suite (14×), 38 s with one process (50×), 28.5 s for all 465 mutants of <code>src/</code>. <code>perTest</code> barely helps a suite this fast; with HTTP or database tests it is minutes versus hours. Incremental mode saves the most:</p>
${ra(OUT['82-incremental'])}
<p>No change: 163 of 163 results reused, 2 s. One changed test file: only 5 mutants re-run. So: <strong>not on every save</strong>; on pull requests with <code>--incremental</code> (cache the JSON) or <code>--mutate</code> on changed files; nightly on everything, keeping <code>reports/mutation/index.html</code> as a CI artifact.</p>

<h3>A real trap: the sandbox that doubled the suite</h3>
${ra(OUT['82-sandbox-sot'])}
<div class="pitfall co-tieu-de"><strong>A crashed Stryker run leaves a copy of the project in <code>.stryker-tmp/</code>.</strong> <code>vitest run src/</code> filters by path, and <code>.stryker-tmp/sandbox-2n9pUw/src/…</code> contains <code>src/</code> too: 10 files and 85 tests became 20 and 170, half of them testing a stale copy, and nothing turned red to warn us. LabFlow Lite now excludes the folder from Vitest (and from git):</div>
${ma('javascript', VC)}

<h3>Java: PIT</h3>
<p>A Spring Boot team uses PIT (plugin <code>org.pitest:pitest-maven</code>, goal <code>mutationCoverage</code>; JUnit 5 needs <code>pitest-junit5-plugin</code>): it mutates the compiled bytecode, runs JUnit per mutant, and reports the same states — killed, survived, no coverage, timed out.</p>

<h3>When to use what</h3>
${KHI_EN}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>npx stryker run --mutate src/lib/retry.js</code> (retry of Chapter 2: up to 3 attempts, waiting 1 s then 2 s).</li>
<li>Say what each survivor would mean for a user.</li>
<li>Kill both in <code>src/lib/retry-last.test.js</code> with fake timers, and run Stryker again.</li>
</ol>
${ra(TH_TRUOC)}
<p>Both survivors are the same bug: after the third attempt fails, <code>retry</code> waits 3 more seconds before giving up. The old test used <code>vi.runAllTimersAsync()</code>, which jumps over every timer, so it cannot see an extra wait.</p>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.retryLast)}
${ra(TH_SAU)}
<p><strong>Done when</strong> <code>retry.js</code> shows 14 killed, 0 survived, <code>npm run test:unit</code> is green, and you can say why <code>runAllTimersAsync</code> missed this bug.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mutant (đột biến)</span><span class="v">A copy of the code with one small change.</span></div>
  <div class="kv"><span class="k">mutation operator (toán tử đột biến)</span><span class="v">A rule that makes mutants: &lt; → &lt;=, condition → false, string → "".</span></div>
  <div class="kv"><span class="k">killed / survived (bị diệt / sống sót)</span><span class="v">A test went red / every test stayed green on the mutant.</span></div>
  <div class="kv"><span class="k">no coverage (không được phủ)</span><span class="v">No test reaches the mutated code.</span></div>
  <div class="kv"><span class="k">timeout</span><span class="v">The mutant made the code hang; counted as detected.</span></div>
  <div class="kv"><span class="k">mutation score (điểm đột biến)</span><span class="v">(killed + timeout) ÷ mutants; “covered” counts only reached mutants.</span></div>
  <div class="kv"><span class="k">equivalent mutant (đột biến tương đương)</span><span class="v">A change that never alters a result, so no test can kill it.</span></div>
  <div class="kv"><span class="k">incremental mode (chế độ tăng dần)</span><span class="v">Reuses results for unchanged code and tests.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Coverage asks “did it run?”; mutation testing asks “would a test notice if it were wrong?”.</li>
<li>The same suite: 100% coverage, 41.49% killed.</li>
<li>Survivors name missing tests: a boundary (1 seat), a pattern (<code>^</code>/<code>$</code>), a weak assertion (a crash’s <code>TypeError</code>).</li>
<li>Nine tests: 88.96% → 98.16%; the rest is explained, two of them equivalent.</li>
<li>14× the suite here: run it incrementally on pull requests or nightly, with a <code>break</code> threshold, and exclude <code>.stryker-tmp/</code>.</li>
</ul>

${nguon('🧬', 'StrykerJS — Vitest runner', 'Installing @stryker-mutator/vitest-runner; configFile, dir, related; perTest coverage.', 'https://stryker-mutator.io/docs/stryker-js/vitest-runner/')}
${nguon('🟰', 'Stryker — Equivalent mutants', 'Why some mutants can never be killed, and what to do about them.', 'https://stryker-mutator.io/docs/mutation-testing-elements/equivalent-mutants/')}
${nguon('☕', 'PIT — mutation testing for Java', 'The tool for JUnit and Spring Boot projects (Maven and Gradle).', 'https://pitest.org/')}

${lienKet({ bai: 'swt301-junit-hands-on', title: 'Theory in SWT301 — 8.5: “100% coverage did not find the bug”', sub: 'Same: coverage only proves lines were executed; mutation testing (PIT) measures whether tests notice a change. Deeper here: StrykerJS run on LabFlow Lite — the same 100%-coverage suite killed 41.49%, nine tests took the real suite from 88.96% to 98.16%, equivalent mutants, and the cost in seconds. The dot-bien scripts of Labs 1–7 were the hand-made version.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Mutation testing: kiểm tra chính bộ test</h2>
<p class="lead">Bài 8.1 kết thúc không vui: một bộ test chỉ hỏi <code>toBeDefined()</code> đạt 100% độ phủ, mà bug cài sẵn vẫn lọt. Độ phủ cho biết code nào đã <em>chạy</em>. Bài này đo điều bạn thật sự muốn biết: <strong>nếu ai đó làm hỏng đoạn code này, có test nào đỏ không?</strong></p>
<p><strong>Sau bài này bạn có thể</strong> dựng StrykerJS cho Vitest, đọc báo cáo của nó, biến đột biến sống sót thành đúng những test đang thiếu, nhận ra đột biến tương đương, và quyết định khi nào đáng trả thêm thời gian chạy. <strong>Vì sao hữu ích:</strong> đây là câu trả lời thật thà nhất cho câu hỏi “test của mình có tốt không?”, nó tìm ra test biên còn thiếu nhanh hơn một buổi review, và giải thích bằng số liệu vì sao 100% độ phủ là chưa đủ là một câu trả lời phỏng vấn rất mạnh.</p>

<h3>Bạn đã làm việc này từ Lab 1</h3>
<p>Lab nào cũng kết thúc bằng <code>scripts/dot-bien*.mjs</code>: sửa một dòng (<code>&lt;=</code> → <code>&lt;</code>), chạy test, trả dòng về. Mỗi bản sao bị sửa là một <em>mutant</em> (đột biến): đỏ là <em>bị diệt</em> (killed), xanh là <em>sống sót</em> (survived) — một bug mà test của bạn sẽ để lọt. Đó là mutation testing làm tay, với 8 đột biến do người chọn. Công cụ thì áp các <em>mutation operator</em> (toán tử đột biến) vào mọi chỗ phù hợp: <code>EqualityOperator</code> (<code>&lt;</code> → <code>&lt;=</code>), <code>ConditionalExpression</code> (điều kiện → <code>true</code>/<code>false</code>), <code>StringLiteral</code> (→ <code>""</code>), <code>Regex</code> (bỏ <code>^</code> hoặc <code>$</code>), <code>ArithmeticOperator</code>, <code>BlockStatement</code>… Với JavaScript công cụ là <strong>StrykerJS</strong>; với Java là <strong>PIT</strong>.</p>
${FLOW_VI}

<h3>Dựng Stryker cho Vitest</h3>
<p>Cài <code>@stryker-mutator/core</code> và <code>@stryker-mutator/vitest-runner</code> (cùng 10.1.1, ghim phiên bản), rồi thêm <code>stryker.config.mjs</code>:</p>
${ma('javascript', CODE.strykerConfig)}
<p><code>dir: 'src'</code> rất quan trọng: lần chạy thử (dry run) phải xanh, mà các thư mục <code>demo*/</code> cố ý đỏ. <code>perTest</code> cho mỗi đột biến chỉ chạy những test chạm tới nó. <code>break: 80</code> làm lệnh thất bại khi dưới 80%, nên dùng được làm cổng chặn pipeline. Script: <code>${SCRIPT.trim()}</code>.</p>

<h3>Cùng một bộ test: 100% độ phủ, 41,49% bị diệt</h3>
<p>Cho Stryker chạy riêng với bộ test yếu của bài 8.1 (<code>demo8/stryker.yeu.config.mjs</code> chạy <code>demo8/du-nhanh.test.js</code> trên <code>booking.js</code>, với <code>break: 60</code>):</p>
${ra(YEU)}
<p>94 đột biến, 39 bị diệt: <strong>41,49%</strong>, thoát mã 1. Khung lệch lưới trả <code>ok: true</code> — luật bị đảo ngược — mà bộ test vẫn xanh vì <code>toBeDefined()</code> đúng với mọi câu trả lời. Độ phủ nói “mọi dòng đã chạy”; mutation testing nói “phần lớn các dòng đó có thể sai mà không ai biết”.</p>

<h3>Bộ unit thật: 88,96%</h3>
${ra(LAN_DAU)}
<ul>
<li><strong>killed 144, timeout 1</strong> — đã phát hiện (code treo cũng làm bộ test hỏng).</li>
<li><strong>survived 11</strong> — test chạy trên thay đổi mà vẫn xanh.</li>
<li><strong>no cov 7</strong> — không test nào chạm tới đoạn code đó: lại là các dòng chưa phủ của bài 8.1.</li>
<li><strong>total</strong> 145 ÷ 163 = 88,96%; <strong>covered</strong> 145 ÷ 156 = 92,95%. Hai số cách xa nghĩa là “test phần code chưa ai chạm trước”; covered thấp nghĩa là “test của bạn kiểm quá ít so với những gì nó chạy qua”.</li>
</ul>

<h3>Mỗi đột biến sống là một test còn thiếu</h3>
${ra(S_BIEN)}
<p><code>seats &lt; 1</code> → <code>seats &lt;= 1</code> sống sót: test đã thử 0, −5 và 2,5 chỗ nhưng chưa bao giờ thử giá trị <em>hợp lệ</em> nhỏ nhất là 1 — phân tích giá trị biên dặn test cả hai phía. Trong số đột biến không được phủ có <code>'CONFIRMED'</code> → <code>""</code>: trong <code>src/</code>, <code>createBooking</code> chỉ đặt 31 chỗ — đúng nhánh mà báo cáo của bài 8.1 tô vàng.</p>
${ra(S_REGEX)}
<p>Thiếu <code>^</code> thì <code>"108:00"</code> được đọc thành 08:00 (thiếu <code>$</code> thì <code>"08:000"</code> cũng vậy). Không test nào gửi ký tự thừa.</p>
${ra(S_FALSE)}
<div class="pitfall co-tieu-de"><strong>Một test có thể xanh vì lý do sai.</strong> Khi phép kiểm bị thay bằng <code>false</code>, <code>parseTime("7:00")</code> đọc <code>m[1]</code> của <code>null</code> — chuyện này cũng ném <code>TypeError</code> (“Cannot read properties of null”). Test chỉ hỏi <code>toThrow(TypeError)</code>, nên vẫn xanh trong khi code đang sập thay vì kiểm dữ liệu. Khi riêng kiểu lỗi có thể đến từ một cú sập, hãy khẳng định cả thông báo: <code>toThrow('expected HH:MM')</code>.</div>
<p>Các đột biến sống còn lại: thông báo lỗi (không test nào đọc), <code>newId</code>/<code>now</code> mặc định của <code>newBookingRecord</code> (test nào cũng thay chúng), một dòng phép tính trong bộ sinh số ngẫu nhiên có seed, và hai chuỗi trong <code>days.js</code>.</p>

<h3>Chín test sau: 98,16%</h3>
<p>Test mới nằm trong file riêng, để test tham khảo của Chương 1–2 giữ nguyên như lúc dạy. Chú thích của mỗi test ghi tên đột biến nó diệt:</p>
${ma('javascript', CODE.mutationGaps)}
${ra(SAU)}

<h3>Đột biến tương đương: không test nào diệt được</h3>
${ra(OUT['82-tuong-duong'])}
<p>Chuỗi chỉ có ngày như <code>'2026-11-16'</code> vốn đã là nửa đêm UTC, nên xoá <code>'T00:00:00Z'</code> trong <code>days.js</code> chỉ đổi chữ, không bao giờ đổi kết quả. Đó là <em>equivalent mutant</em> (đột biến tương đương): không test nào diệt nổi. Hãy nhận ra nó, ghi lại lý do — các nhóm viết <code>// Stryker disable next-line StringLiteral: date-only ISO strings are already UTC</code> ngay cạnh dòng đó — rồi đi tiếp. (Ở đây giữ nguyên <code>days.js</code> để Chương 2 vẫn khớp.) Đột biến sống thứ ba, trong bộ sinh số ngẫu nhiên, thì <em>diệt được</em> bằng test giá trị vàng (“seed 7 cho đúng mã này”), nhưng như vậy là ghim cứng bộ sinh số; ở đây ta chấp nhận nó, có chủ ý.</p>
<div class="pitfall co-tieu-de"><strong>Điểm đột biến cũng không phải mục tiêu.</strong> 98,16% với ba đột biến sống đã giải thích tốt hơn 100% đạt được bằng cách ghim những chi tiết bên trong không ai quan tâm. Đọc báo cáo như danh sách câu hỏi — “người dùng có nhận ra thay đổi này không?” — và chặn bằng ngưỡng <code>break</code> thấp hơn mức hiện tại một chút, nâng dần khi bộ test tốt lên.</div>

<h3>Cái giá, và cách trả ít hơn</h3>
${ra(OUT['82-chi-phi'])}
<p>Mỗi đột biến một lần chạy bộ test: 10,5 s so với 0,77 s của bộ test thường (gấp 14), 38 s nếu một tiến trình (gấp 50), 28,5 s cho cả 465 đột biến của <code>src/</code>. <code>perTest</code> gần như không giúp gì với bộ test nhanh thế này; khi có test HTTP hay CSDL, nó là khác biệt giữa vài phút và vài giờ. Chế độ incremental tiết kiệm nhiều nhất:</p>
${ra(OUT['82-incremental'])}
<p>Không đổi gì: dùng lại 163/163 kết quả, 2 s. Đổi một file test: chỉ chạy lại 5 đột biến. Vậy: <strong>không chạy mỗi lần lưu</strong>; chạy trên pull request với <code>--incremental</code> (cache file JSON) hoặc <code>--mutate</code> cho file đã đổi; chạy đêm trên toàn bộ, giữ <code>reports/mutation/index.html</code> làm artifact của CI.</p>

<h3>Một cái bẫy có thật: sandbox làm bộ test chạy gấp đôi</h3>
${ra(OUT['82-sandbox-sot'])}
<div class="pitfall co-tieu-de"><strong>Một lần Stryker bị sập để lại bản sao dự án trong <code>.stryker-tmp/</code>.</strong> <code>vitest run src/</code> lọc theo đường dẫn, mà <code>.stryker-tmp/sandbox-2n9pUw/src/…</code> cũng chứa <code>src/</code>: 10 file, 85 test thành 20 file, 170 test, một nửa test bản sao cũ, và không có gì đỏ để cảnh báo. LabFlow Lite giờ loại thư mục này khỏi Vitest (và khỏi git):</div>
${ma('javascript', VC)}

<h3>Java: PIT</h3>
<p>Nhóm Spring Boot dùng PIT (plugin <code>org.pitest:pitest-maven</code>, goal <code>mutationCoverage</code>; JUnit 5 cần thêm <code>pitest-junit5-plugin</code>): nó đột biến bytecode đã biên dịch, chạy JUnit cho từng đột biến, và báo cáo đúng các trạng thái ấy — killed, survived, no coverage, timed out.</p>

<h3>Khi nào dùng gì</h3>
${KHI_VI}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>npx stryker run --mutate src/lib/retry.js</code> (retry của Chương 2: tối đa 3 lần thử, chờ 1 s rồi 2 s).</li>
<li>Nói mỗi đột biến sống có nghĩa gì với người dùng.</li>
<li>Diệt cả hai trong <code>src/lib/retry-last.test.js</code> bằng fake timers, rồi chạy lại Stryker.</li>
</ol>
${ra(TH_TRUOC)}
<p>Hai đột biến sống là cùng một bug: sau lần thử thứ ba hỏng, <code>retry</code> còn chờ thêm 3 giây mới bỏ cuộc. Test cũ dùng <code>vi.runAllTimersAsync()</code>, lệnh này nhảy qua mọi timer, nên không thấy được lần chờ thừa.</p>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.retryLast)}
${ra(TH_SAU)}
<p><strong>Xong khi</strong> <code>retry.js</code> báo 14 bị diệt, 0 sống, <code>npm run test:unit</code> xanh, và bạn nói được vì sao <code>runAllTimersAsync</code> bỏ lọt bug này.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mutant (đột biến)</span><span class="v">Bản sao của code với một thay đổi nhỏ.</span></div>
  <div class="kv"><span class="k">mutation operator (toán tử đột biến)</span><span class="v">Luật tạo đột biến: &lt; → &lt;=, điều kiện → false, chuỗi → "".</span></div>
  <div class="kv"><span class="k">killed / survived (bị diệt / sống sót)</span><span class="v">Có test đỏ / mọi test vẫn xanh trên đột biến.</span></div>
  <div class="kv"><span class="k">no coverage (không được phủ)</span><span class="v">Không test nào chạm tới đoạn code bị đột biến.</span></div>
  <div class="kv"><span class="k">timeout</span><span class="v">Đột biến làm code treo; tính là đã phát hiện.</span></div>
  <div class="kv"><span class="k">mutation score (điểm đột biến)</span><span class="v">(killed + timeout) ÷ số đột biến; “covered” chỉ tính đột biến có test chạm tới.</span></div>
  <div class="kv"><span class="k">equivalent mutant (đột biến tương đương)</span><span class="v">Thay đổi không bao giờ làm khác kết quả, nên không test nào diệt được.</span></div>
  <div class="kv"><span class="k">incremental mode (chế độ tăng dần)</span><span class="v">Dùng lại kết quả cho code và test không đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Độ phủ hỏi “đã chạy chưa?”; mutation testing hỏi “nếu sai, có test nào nhận ra không?”.</li>
<li>Cùng một bộ test: 100% độ phủ, 41,49% bị diệt.</li>
<li>Đột biến sống chỉ ra test còn thiếu: một giá trị biên (1 chỗ), một mẫu (<code>^</code>/<code>$</code>), một assertion yếu (<code>TypeError</code> do code sập).</li>
<li>Chín test: 88,96% → 98,16%; phần còn lại đã giải thích, hai con là đột biến tương đương.</li>
<li>Ở đây tốn gấp 14 lần bộ test: chạy incremental trên pull request hoặc chạy đêm, có ngưỡng <code>break</code>, và loại <code>.stryker-tmp/</code>.</li>
</ul>

${nguon('🧬', 'StrykerJS — Vitest runner', 'Cài @stryker-mutator/vitest-runner; configFile, dir, related; độ phủ perTest.', 'https://stryker-mutator.io/docs/stryker-js/vitest-runner/')}
${nguon('🟰', 'Stryker — Equivalent mutants', 'Vì sao có đột biến không bao giờ diệt được, và nên làm gì với chúng.', 'https://stryker-mutator.io/docs/mutation-testing-elements/equivalent-mutants/')}
${nguon('☕', 'PIT — mutation testing cho Java', 'Công cụ cho dự án JUnit và Spring Boot (Maven và Gradle).', 'https://pitest.org/')}

${lienKet({ bai: 'swt301-junit-hands-on', title: 'Lý thuyết ở SWT301 — 8.5: “Coverage 100% không tìm ra bug”', sub: 'Giống: độ phủ chỉ chứng minh các dòng đã chạy; mutation testing (PIT) đo xem test có nhận ra thay đổi không. Sâu thêm ở đây: StrykerJS chạy thật trên LabFlow Lite — chính bộ test 100% độ phủ chỉ diệt 41,49%, chín test đưa bộ test thật từ 88,96% lên 98,16%, đột biến tương đương, và cái giá tính bằng giây. Các script dot-bien của Lab 1–7 là phiên bản làm tay.', cta: 'MỞ BÀI →' })}
</div>
`,
};
