/**
 * Testing · Chương 11 · 11.4 — Đưa vào CI, và checklist cuối. Slug giữ từ khung: tst-11-4-ci.
 * Pipeline PR đầy đủ (.github/workflows/test.yml: unit Node 22/24 · integration · e2e · mutation · quarantine báo cáo · report · ci-ok),
 * test của chính pipeline (src/ci/workflow.test.js) + actionlint; ngưỡng nâng dần (vitest.config.js 97/91/96/97, stryker break 95);
 * báo cáo một trang (src/ci/quality.js + scripts/ci-report.mjs) và bẫy RTM tự đếm test của nó; act xanh 11:00 (cache lạnh) và act đỏ 8:47
 * (AC7 chưa có test); nightly giờ Việt Nam; checklist cả khoá; thực hành Lite-1 lên High. Mọi output ở ./_ma.mjs (sinh tự động, 114-*).
 */
import G from '../giang/tst-11-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const dong = (src, a, b) => src.split('\n').slice(a - 1, b).join('\n');
const Y = CODE.testYml;

const YML = [dong(Y, 111, 112), '    …', dong(Y, 122, 122), '', dong(Y, 145, 148), '    …', dong(Y, 178, 185), '    …', dong(Y, 190, 194)].join('\n');
const T_WF = loc('114-workflow-test', /^\$ |uploads its reports|gate requires|report job reads|Tests {2}/);
const LINT = OUT['114-actionlint'];
const CFG = [dong(CODE.vitestCfg, 14, 14), dong(CODE.stryker, 15, 15)].join('\n');
const RATCHET = loc('114-cov-ratchet', /^\$ |Tests {2}|All files|quality\.js|ERROR/);
const QUAL = dong(CODE.quality, 30, 36);
const REPORT = loc('114-ci-report', /^### ✅|^\| (Unit|UI|DB|End|lines) |Mutation score|Every in-scope/);
const SELF = OUT['114-rtm-tu-dem'];
const ACT_G = loc('114-act-xanh', /^\$ act|Node 22\)-1\] {3}✅ {2}Success - Main (npm ci|unit)|e2e \(Chromium\)\] {3}✅ {2}Success - Main npm ci|npm run test:mutation|npx playwright|npm run test:e2e|ci-ok: every|^Error: Job|^\(time/);
const ACT_R = loc('114-act-do', /^\$ git|^1011cec|Do not merge|- traceability|US-11 AC7 |✔ mutation|✘ report|ci-ok\] 🏁|^\(time/);
const NIGHT = OUT['114-act-dem'];
const TH_DO = loc('114-th-do', /^planted|^### |^- traceability|^\| Lite-1 |^::error/);
const TH = dong(CODE.th111, 18, 24);
const TH_XANH = loc('114-th-xanh', /^### |^\| Lite-1 /);

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Test jobs</div><div class="lz-d">unit (Node 22, 24) · integration · e2e · mutation — in parallel</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">report</div><div class="lz-d">reads every job's reports, writes one page, lists reasons not to merge</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">ci-ok</div><div class="lz-d">the only required check: every job above must be a success</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Nightly</div><div class="lz-d">5 browsers, shuffled order, Viet Nam time zone — tells the team in the morning</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Các job test</div><div class="lz-d">unit (Node 22, 24) · integration · e2e · mutation — chạy song song</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">report</div><div class="lz-d">đọc báo cáo của mọi job, viết một trang, liệt kê lý do không được merge</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">ci-ok</div><div class="lz-d">check bắt buộc duy nhất: mọi job ở trên phải success</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Ban đêm</div><div class="lz-d">5 trình duyệt, thứ tự xáo trộn, múi giờ Việt Nam — báo cho nhóm buổi sáng</div></div>
</div>`;

const KHI_EN = `<table>
<thead><tr><th>Check</th><th>Where it runs</th><th>Why there (measured in act)</th></tr></thead>
<tbody>
<tr><td>Unit + API + UI, coverage bars</td><td>every pull request</td><td>5.1 s + 7.5 s of tests</td></tr>
<tr><td>Mutation testing, break 95</td><td>every pull request (moved from the night)</td><td>39.7 s</td></tr>
<tr><td>One E2E journey, Chromium</td><td>every pull request</td><td>5.8 s of tests, 6 min 11 s to install Chromium</td></tr>
<tr><td>5 browsers, shuffled order, Viet Nam time zone</td><td>nightly</td><td>slow installs; different environments</td></tr>
</tbody></table>`;
const KHI_VI = `<table>
<thead><tr><th>Phép kiểm</th><th>Chạy ở đâu</th><th>Vì sao ở đó (đo bằng act)</th></tr></thead>
<tbody>
<tr><td>Unit + API + UI, ngưỡng độ phủ</td><td>mọi pull request</td><td>test mất 5,1 s + 7,5 s</td></tr>
<tr><td>Mutation testing, break 95</td><td>mọi pull request (chuyển từ ban đêm sang)</td><td>39,7 s</td></tr>
<tr><td>Một hành trình E2E, Chromium</td><td>mọi pull request</td><td>test 5,8 s, cài Chromium 6 phút 11 giây</td></tr>
<tr><td>5 trình duyệt, thứ tự xáo trộn, múi giờ Việt Nam</td><td>ban đêm</td><td>cài đặt chậm; môi trường khác</td></tr>
</tbody></table>`;

const CHECK_EN = `<table>
<thead><tr><th>Part</th><th>I can, without looking it up…</th></tr></thead>
<tbody>
<tr><td>Section 0 – Ch 1</td><td>write tests that can fail, named after their rule, at the boundaries</td></tr>
<tr><td>Ch 2</td><td>control async code, time, errors and randomness</td></tr>
<tr><td>Ch 3</td><td>mock only at boundaries I do not own</td></tr>
<tr><td>Ch 4</td><td>test SQL on a throw-away PostgreSQL, isolated</td></tr>
<tr><td>Ch 5</td><td>test an API from outside, against its contract</td></tr>
<tr><td>Ch 6 – 7</td><td>test screens by role; write stable journeys</td></tr>
<tr><td>Ch 8</td><td>read coverage and mutation; hunt flaky tests</td></tr>
<tr><td>Ch 9</td><td>run it all in CI behind one gate that turns red</td></tr>
<tr><td>Ch 10</td><td>test first, pin legacy code, review tests</td></tr>
<tr><td>Ch 11</td><td>plan from risks, trace every requirement, ship behind ci-ok</td></tr>
</tbody></table>`;
const CHECK_VI = `<table>
<thead><tr><th>Phần</th><th>Tôi làm được, không cần tra cứu…</th></tr></thead>
<tbody>
<tr><td>Mục 0 – Ch 1</td><td>viết test có thể đỏ, tên theo luật, ở giá trị biên</td></tr>
<tr><td>Ch 2</td><td>điều khiển code bất đồng bộ, thời gian, lỗi và ngẫu nhiên</td></tr>
<tr><td>Ch 3</td><td>chỉ mock ở ranh giới mình không sở hữu</td></tr>
<tr><td>Ch 4</td><td>test SQL trên PostgreSQL dùng một lần, cô lập</td></tr>
<tr><td>Ch 5</td><td>test API từ bên ngoài, đối chiếu hợp đồng</td></tr>
<tr><td>Ch 6 – 7</td><td>test màn hình theo vai trò; viết hành trình ổn định</td></tr>
<tr><td>Ch 8</td><td>đọc đúng độ phủ và đột biến; săn test chập chờn</td></tr>
<tr><td>Ch 9</td><td>chạy tất cả trong CI sau một cổng biết đỏ</td></tr>
<tr><td>Ch 10</td><td>test trước, ghim code cũ, review test</td></tr>
<tr><td>Ch 11</td><td>lập kế hoạch từ rủi ro, truy vết mọi yêu cầu, phát hành sau ci-ok</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐙', 'GitHub Docs — Workflow commands', 'Job summaries ($GITHUB_STEP_SUMMARY) and ::error annotations, as the report job uses them.', 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands'),
  nguon('👽', 'StrykerJS — Configuration', 'thresholds.high / low / break: the bar that fails the run.', 'https://stryker-mutator.io/docs/stryker-js/configuration/'),
].join('\n');

export default {
  title: '11.4 — Shipping it in CI, and the final checklist|||11.4 — Đưa vào CI, và checklist cuối',
  slug: 'tst-11-4-ci',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đưa mọi tầng test của US-11 vào một pipeline pull request duy nhất và chạy thật bằng act: unit (Node 22/24), tích hợp PostgreSQL 17, một hành trình E2E, mutation testing chuyển từ ban đêm lên mọi PR, một job report viết MỘT trang (test theo tầng, độ phủ, điểm đột biến, truy vết) và cổng ci-ok; test của chính pipeline đổi cùng PR, actionlint 0 lỗi. Ngưỡng nâng dần (ratchet): độ phủ 85/80/80/85 → 97/91/96/97, Stryker break 80 → 95 — một PR xoá test của quality.js còn 93,8/84,86/94,44/92,83, ngưỡng cũ vẫn cho qua, ngưỡng mới chặn. Bẫy: báo cáo truy vết đếm cả test của chính nó (BR-06 8 thay vì 7). act xanh 11:00 với cache lạnh (cài Chromium 6 phút 11 giây), act đỏ 8:47 vì AC7 chưa có test — mọi job test xanh mà merge vẫn bị chặn. Nightly theo giờ Việt Nam 30,85 s. Checklist năng lực cả khoá.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Shipping it in CI, and the final checklist</h2>
<p class="lead">US-11 has tests at every layer and a plan that says what “done” means. This lesson makes the plan enforceable: every pull request runs every layer, one page reports the result, and one required check blocks the merge when anything — including traceability — is missing. Then it rehearses the whole pipeline on a laptop with act, green and red.</p>
<p><strong>After this lesson you can</strong> run every layer and mutation testing on each pull request, raise the bars with a ratchet, turn all reports into one page that can block a merge, rehearse it all with act, and check yourself against the course checklist. <strong>Why it is useful:</strong> the exit criteria of 11.1 are promises until a machine checks them on every change — and “my pipeline blocks a merge when a requirement has no test” is a sentence few interns can say and show.</p>
${FLOW_EN}

<h3>What changed since Chapter 9</h3>
<p>The Chapter 9 pipeline had unit, integration, e2e, a report-only quarantine job and the gate <code>ci-ok</code>. Chapter 11 adds two jobs and makes the gate wait for both (<code>.github/workflows/test.yml</code>, excerpt):</p>
${ma('yaml', YML)}
<p><code>report</code> runs with <code>if: !cancelled()</code>, so after a red job it still says what is missing; <code>shell: bash</code> adds <code>-eo pipefail</code>, so <code>| tee</code> cannot swallow its exit code (9.3); <code>ci-ok</code> keeps <code>if: always()</code>, because a skipped required check counts as passed. The workflow's own tests (<code>src/ci/workflow.test.js</code>) changed in the same pull request:</p>
${ra(T_WF)}
${ra(LINT)}

<h3>The ratchet: bars just under what you measured</h3>
<p>Chapter 8 set coverage at 85/80/80/85 and Stryker's break at 80. The suite now measures 98.93% lines, 93.30% branches, 97.47% functions, 98.32% statements and 99.08% mutation — bars that far below reality catch nothing. The ratchet moves each bar to just under today's number:</p>
${ma('javascript', CFG)}
<p>What it buys: a pull request that deletes the tests of <code>src/ci/quality.js</code>:</p>
${ra(RATCHET)}
<p>Every number is above Chapter 8's bars, so that pull request would have merged; with the ratchet it is red on all four. A ratchet only moves up, to just below a measured number.</p>

<h3>One page for the whole pull request</h3>
<p>Each job knows only its own result. The <code>report</code> job downloads the four artifacts — Vitest JSON (unit, web, integration), Playwright JSON (e2e), the coverage summary, Stryker's JSON — and <code>scripts/ci-report.mjs</code> turns them into one page with <code>qualityReport</code> (<code>src/ci/quality.js</code>). Failed tests and missing reports are collected first; then the bars and the traceability gaps:</p>
${ma('javascript', QUAL)}
<p>Every problem is a reason not to merge: a failed test, a missing report (a job that crashed must not look green), coverage or mutation under the bar, a traceability gap. Run locally after the suites:</p>
${ra(REPORT)}
<div class="pitfall co-tieu-de"><strong>The report first counted its own tests.</strong> The tests of the traceability tool (<code>src/ci/rtm.test.js</code>) contain requirement ids as test data, so the first version counted them as proof:</div>
${ra(SELF)}
<p>BR-06 showed 8 unit tests instead of 7, Lite-1 and Lite-2 3 instead of 2. The fix, in <code>layerOf</code>: a file under <code>src/ci/</code> belongs to no layer, so its tests prove nothing about the product.</p>

<h3>Rehearsed with act: green, then red for the right reason</h3>
<p>The whole pipeline ran with act 0.2.94 on the course laptop, cold cache:</p>
${ra(ACT_G)}
<p>11 minutes, and almost none of it is testing: <code>npm ci</code> took 2.6–3.8 minutes in each of six jobs starting together with an empty cache, and installing Chromium with its system libraries 6 minutes 11 seconds; Stryker took 39.7 s and the E2E tests 5.8 s. Then a branch where the product owner adds AC7 (“cancelling a PENDING booking removes it from the lecturer's approval list”) to <code>requirements.json</code> without a test, warm cache:</p>
${ra(ACT_R)}
<p>Every test job is green — no test is wrong, one is missing — and the merge is blocked by the report: “US-11 AC7: no passing test”. That is the exit criterion of 11.1 enforced by a machine.</p>
<div class="pitfall co-tieu-de"><strong>act exits 1 even on the green run.</strong> The report-only <code>quarantine</code> job is red (the known flaky race of 8.3) and act turns any red job into exit code 1, ignoring <code>continue-on-error</code> — measured in Chapter 9. On GitHub that job shows red and does not block. Read <code>ci-ok</code>, not act's exit code.</div>

<h3>The nightly run</h3>
<p>Mutation testing moved to pull requests: 39.7 s is cheap. The night keeps what is slow or needs another environment — five browsers and devices, unit tests in shuffled order, and a new job, <code>unit-hanoi</code>, that sets <code>env: TZ: Asia/Ho_Chi_Minh</code> and runs <code>npm run test:unit</code>:</p>
${ra(NIGHT)}
<p>Pull requests run in UTC like the servers (Stryker too, 11.2); the night run in <code>Asia/Ho_Chi_Minh</code> catches the opposite bugs (lesson 2.2).</p>
${KHI_EN}
<p><strong>In Java/Spring:</strong> JaCoCo's <code>haltOnFailure</code> and PIT's <code>mutationThreshold</code> are the same two bars.</p>

<h3>The course checklist</h3>
<p>The whole course on one page. Tick what you can do without looking anything up; for any row you cannot tick, reread those chapters before you put the capstone on your CV.</p>
${CHECK_EN}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>The team re-rates Lite-1 (“a booking lasts at most 4 hours”) from Low to High: a lab blocked all afternoon costs a whole class. Plant the change in <code>test-plan/requirements.json</code>, run <code>scripts/ci-report.mjs</code>, read the reason it gives, then write the one test that answers it.</p>
<p><strong>Solution and real output.</strong> Before (with <code>scripts/thu-loi-lenh.mjs</code>, which plants one change and restores the file):</p>
${ra(TH_DO)}
<p>A High risk needs a test above the Unit layer. One API test, named with the requirement (<code>src/api/rules.api.test.js</code>):</p>
${ma('javascript', TH)}
${ra(TH_XANH)}
<p><strong>Done when</strong> the report says “Every check passed” with Lite-1 rated High, and you can explain why raising a risk can make a pull request red without any code changing.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">required check (check bắt buộc)</span><span class="v">The status branch protection needs before merging — here only ci-ok.</span></div>
  <div class="kv"><span class="k">ratchet (bánh cóc)</span><span class="v">A bar that only moves up, to just below a measured value.</span></div>
  <div class="kv"><span class="k">quality report (báo cáo chất lượng)</span><span class="v">One page from every job's reports; its problems block the merge.</span></div>
  <div class="kv"><span class="k">artifact (tệp kết quả của job)</span><span class="v">Files a job uploads so another job can download them.</span></div>
  <div class="kv"><span class="k">pipefail</span><span class="v">A pipe fails if any command in it fails, not only the last one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every layer, mutation testing and a one-page report run on each pull request; ci-ok is the only required check.</li>
<li>The ratchet: 97/91/96/97 and break 95 caught a pull request Chapter 8's bars would have merged.</li>
<li>The report blocks on failures, missing reports, low scores and traceability gaps — and does not count its own tests.</li>
<li>act: 11:00 green with a cold cache; 8:47 red because AC7 had no test, every test job green.</li>
<li>The night keeps the slow and the different: 5 browsers, shuffled order, Viet Nam time zone.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-test-monitoring-control', title: 'Theory in SWT301 — 7.3: test monitoring, control and reports', sub: 'Same: test metrics, progress and summary reports, exit criteria. Deeper here: the report is generated from real test results on every pull request, and it blocks the merge.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-14-1-cong-chat-luong', title: 'GitHub Actions course — 14.1: quality gates', sub: 'There: quality gates on real GitHub pull requests. Here: the gate also requires mutation testing and traceability, rehearsed with act.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Đưa vào CI, và checklist cuối</h2>
<p class="lead">US-11 đã có test ở mọi tầng và một kế hoạch nói rõ thế nào là “xong”. Bài này biến kế hoạch thành thứ được thi hành: mọi pull request chạy mọi tầng, một trang báo cáo kết quả, và một check bắt buộc chặn merge khi thiếu bất cứ thứ gì — kể cả truy vết. Rồi tổng duyệt cả pipeline trên laptop bằng act, xanh và đỏ.</p>
<p><strong>Sau bài này bạn có thể</strong> chạy mọi tầng và mutation testing ở mỗi pull request, nâng các mức theo kiểu bánh cóc (ratchet), gom mọi báo cáo thành một trang có thể chặn merge, tổng duyệt tất cả bằng act, và tự kiểm bằng checklist cả khoá. <strong>Vì sao hữu ích:</strong> tiêu chí kết thúc của bài 11.1 chỉ là lời hứa cho tới khi máy kiểm chúng ở mọi thay đổi — và “pipeline của em chặn merge khi một yêu cầu chưa có test” là câu ít thực tập sinh nói được và cho xem được.</p>
${FLOW_VI}

<h3>Điều gì đã đổi so với Chương 9</h3>
<p>Pipeline của Chương 9 có unit, integration, e2e, job quarantine chỉ báo cáo và cổng <code>ci-ok</code>. Chương 11 thêm hai job và bắt cổng chờ cả hai (<code>.github/workflows/test.yml</code>, trích):</p>
${ma('yaml', YML)}
<p><code>report</code> chạy với <code>if: !cancelled()</code>, nên sau một job đỏ nó vẫn nói thiếu gì; <code>shell: bash</code> thêm <code>-eo pipefail</code>, nên <code>| tee</code> không nuốt được mã thoát (9.3); <code>ci-ok</code> giữ <code>if: always()</code>, vì một check bắt buộc bị skipped được tính là đạt. Test của chính workflow (<code>src/ci/workflow.test.js</code>) đổi trong cùng pull request:</p>
${ra(T_WF)}
${ra(LINT)}

<h3>Bánh cóc: đặt mức sát dưới con số đo được</h3>
<p>Chương 8 đặt độ phủ 85/80/80/85 và break của Stryker là 80. Giờ bộ test đo được 98,93% dòng, 93,30% nhánh, 97,47% hàm, 98,32% câu lệnh và 99,08% đột biến — mức thấp xa thực tế như vậy chẳng bắt được gì. Bánh cóc đẩy từng mức lên sát dưới con số hôm nay:</p>
${ma('javascript', CFG)}
<p>Nó mua được gì: một pull request xoá test của <code>src/ci/quality.js</code>:</p>
${ra(RATCHET)}
<p>Con số nào cũng trên mức của Chương 8, nên pull request đó sẽ được merge; với bánh cóc, nó đỏ cả bốn. Bánh cóc chỉ đi lên, tới sát dưới một con số đo được.</p>

<h3>Một trang cho cả pull request</h3>
<p>Mỗi job chỉ biết kết quả của chính nó. Job <code>report</code> tải bốn artifact (tệp kết quả của job) — Vitest JSON (unit, web, tích hợp), Playwright JSON (e2e), bản tóm tắt độ phủ, JSON của Stryker — và <code>scripts/ci-report.mjs</code> biến chúng thành một trang bằng <code>qualityReport</code> (<code>src/ci/quality.js</code>). Test đỏ và báo cáo thiếu được gom trước; rồi tới các mức và lỗ hổng truy vết:</p>
${ma('javascript', QUAL)}
<p>Mỗi vấn đề là một lý do không được merge: một test đỏ, một báo cáo thiếu (job sập không được trông như xanh), độ phủ hay điểm đột biến dưới mức, một lỗ hổng truy vết. Chạy trên máy sau các bộ test:</p>
${ra(REPORT)}
<div class="pitfall co-tieu-de"><strong>Lúc đầu báo cáo đếm cả test của chính nó.</strong> Test của công cụ truy vết (<code>src/ci/rtm.test.js</code>) chứa mã yêu cầu làm dữ liệu test, nên bản đầu tiên đếm chúng là bằng chứng:</div>
${ra(SELF)}
<p>BR-06 hiện 8 test unit thay vì 7, Lite-1 và Lite-2 hiện 3 thay vì 2. Cách sửa, trong <code>layerOf</code>: file nằm dưới <code>src/ci/</code> không thuộc tầng nào, nên test của nó không chứng minh gì về sản phẩm.</p>

<h3>Tổng duyệt bằng act: xanh, rồi đỏ đúng lý do</h3>
<p>Cả pipeline chạy bằng act 0.2.94 trên laptop soạn khoá, cache lạnh:</p>
${ra(ACT_G)}
<p>11 phút, và gần như không phút nào là chạy test: <code>npm ci</code> mất 2,6–3,8 phút ở mỗi job trong sáu job khởi động cùng lúc với cache rỗng, cài Chromium kèm thư viện hệ thống mất 6 phút 11 giây; Stryker mất 39,7 s và test E2E 5,8 s. Rồi một nhánh nơi product owner thêm AC7 (“huỷ một lượt PENDING thì nó biến khỏi danh sách chờ duyệt của giảng viên”) vào <code>requirements.json</code> mà chưa có test, cache ấm:</p>
${ra(ACT_R)}
<p>Mọi job test đều xanh — không test nào sai, chỉ là thiếu một test — và merge bị report chặn: “US-11 AC7: no passing test”. Đó là tiêu chí kết thúc của bài 11.1 do máy thi hành.</p>
<div class="pitfall co-tieu-de"><strong>act thoát mã 1 cả ở lần chạy xanh.</strong> Job <code>quarantine</code> chỉ báo cáo bị đỏ (cuộc đua chập chờn đã biết của 8.3) và act biến mọi job đỏ thành mã thoát 1, bỏ qua <code>continue-on-error</code> — đã đo ở Chương 9. Trên GitHub job đó hiện đỏ nhưng không chặn. Hãy đọc <code>ci-ok</code>, đừng đọc mã thoát của act.</div>

<h3>Lần chạy ban đêm</h3>
<p>Mutation testing đã chuyển lên pull request: 39,7 s là rẻ. Ban đêm giữ thứ chậm hoặc cần môi trường khác — năm trình duyệt và thiết bị, unit test xáo thứ tự, và một job mới, <code>unit-hanoi</code>, đặt <code>env: TZ: Asia/Ho_Chi_Minh</code> rồi chạy <code>npm run test:unit</code>:</p>
${ra(NIGHT)}
<p>Pull request chạy theo UTC như máy chủ (Stryker cũng vậy, 11.2); lần chạy đêm theo <code>Asia/Ho_Chi_Minh</code> bắt các bug theo chiều ngược lại (bài 2.2).</p>
${KHI_VI}
<p><strong>Với Java/Spring:</strong> <code>haltOnFailure</code> của JaCoCo và <code>mutationThreshold</code> của PIT là đúng hai mức đó.</p>

<h3>Checklist cả khoá</h3>
<p>Cả khoá trên một trang. Đánh dấu những gì bạn làm được mà không phải tra cứu; dòng nào chưa đánh dấu được thì đọc lại các chương đó trước khi ghi dự án cuối khoá vào CV.</p>
${CHECK_VI}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Nhóm xếp lại Lite-1 (“một lượt đặt dài tối đa 4 giờ”) từ Low lên High: một phòng lab bị chiếm cả buổi chiều làm cả một lớp mất buổi. Cài thay đổi đó vào <code>test-plan/requirements.json</code>, chạy <code>scripts/ci-report.mjs</code>, đọc lý do nó đưa ra, rồi viết đúng một test trả lời lý do đó.</p>
<p><strong>Lời giải và output thật.</strong> Trước (bằng <code>scripts/thu-loi-lenh.mjs</code>, script cài một thay đổi rồi trả file về):</p>
${ra(TH_DO)}
<p>Rủi ro High cần một test ở trên tầng Unit. Một test API, tên mang mã yêu cầu (<code>src/api/rules.api.test.js</code>):</p>
${ma('javascript', TH)}
${ra(TH_XANH)}
<p><strong>Xong khi</strong> báo cáo ghi “Every check passed” với Lite-1 xếp High, và bạn giải thích được vì sao nâng một rủi ro có thể làm pull request đỏ mà không dòng code nào đổi.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">required check (check bắt buộc)</span><span class="v">Trạng thái mà branch protection đòi trước khi merge — ở đây chỉ ci-ok.</span></div>
  <div class="kv"><span class="k">ratchet (bánh cóc)</span><span class="v">Mức chỉ đi lên, tới sát dưới một giá trị đo được.</span></div>
  <div class="kv"><span class="k">quality report (báo cáo chất lượng)</span><span class="v">Một trang từ báo cáo của mọi job; vấn đề của nó chặn merge.</span></div>
  <div class="kv"><span class="k">artifact (tệp kết quả của job)</span><span class="v">Tệp một job tải lên để job khác tải về.</span></div>
  <div class="kv"><span class="k">pipefail</span><span class="v">Một đường ống hỏng nếu bất kỳ lệnh nào trong nó hỏng, không chỉ lệnh cuối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi tầng, mutation testing và một trang báo cáo chạy ở mỗi pull request; ci-ok là check bắt buộc duy nhất.</li>
<li>Bánh cóc: 97/91/96/97 và break 95 bắt được một pull request mà mức của Chương 8 sẽ cho merge.</li>
<li>Báo cáo chặn khi có test đỏ, báo cáo thiếu, điểm thấp và lỗ hổng truy vết — và không đếm test của chính nó.</li>
<li>act: 11:00 xanh với cache lạnh; 8:47 đỏ vì AC7 chưa có test, mọi job test xanh.</li>
<li>Ban đêm giữ thứ chậm và thứ khác: 5 trình duyệt, thứ tự xáo trộn, múi giờ Việt Nam.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-test-monitoring-control', title: 'Lý thuyết ở SWT301 — 7.3: giám sát, kiểm soát test và báo cáo', sub: 'Giống: số đo test, báo cáo tiến độ và báo cáo tổng kết, tiêu chí kết thúc. Sâu thêm ở đây: báo cáo sinh từ kết quả test thật ở mọi pull request, và nó chặn merge.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-14-1-cong-chat-luong', title: 'Khoá GitHub Actions — 14.1: cổng chất lượng', sub: 'Ở đó: cổng chất lượng trên pull request GitHub thật. Ở đây: cổng còn đòi mutation testing và truy vết, tổng duyệt bằng act.', cta: 'MỞ BÀI →' })}
</div>
`,
};
