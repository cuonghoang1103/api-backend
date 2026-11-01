/**
 * Testing · Chương 9 · 9.2 — Báo cáo, annotation và artifact. Slug giữ từ khung: tst-9-2-bao-cao.
 * Chạy thật bằng act 0.2.94 trên PR "Shorter booking confirmation" (nhánh pr/tin-ngan, 'Booked.' thay cho 'Booked. See you in <lab>.'):
 * web test đỏ 1/16 + annotation ::error (Vitest github-actions reporter), e2e đỏ sau 2 retry + trace, ci-ok đỏ, cả lượt 414 s;
 * bẫy THẬT: bản tóm tắt đầu chỉ đọc unit.json ⇒ "✅ 174 of 174" trong khi web đỏ ⇒ sửa bằng mergeReports (unit + web);
 * JUnit XML; artifact Playwright report 23 file (1 trace 131 KB + 3 error-context); act cần --artifact-server-path,
 * và act NHẬN hai artifact trùng tên (giữ bản sau — mất Node 22) còn GitHub v4 từ chối (tài liệu, đọc 01/11/2026).
 */
import G from '../giang/tst-09-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const DO = OUT['92-do'];
const TONG = loc(DO, /^\$ |Job (succeeded|failed)|act exit|wall time/);
const WEB = loc(DO, /unit \(Node 22\).*(× sends|Expected element|See you in BE-201|Received:|\| {3}Booked\.$|BookingForm\.test\.jsx:28:47|Tests {2}1 failed|::error file|Failure - Main web|Summary - )/);
const E2E = loc(DO, /e2e \(Chromium\).*(✘ {2}\d+ \[chromium\]|Received: "Booked\."|\d failed$|\d passed \(|Failure - Main npm run test:e2e|playwright-report\.zip successfully)/).split('\n').filter((l) => !l.includes('::')).join('\n');
const TOM_SAI = loc(DO, /unit \(Node 22\).*(\| ## unit|\| ### |\| \| lines)/);
const TOM_DUNG = loc(OUT['92-tom-tat'], /^\$ |unit \(Node 22\).*(\| ## unit|\| ### |\| - `|\| \| lines)/);
const GH = loc(OUT['92-vitest-gh'], /^\$ |::error|^## |^\| |Tests {2}/);
const FLAKY = loc(OUT['92-vitest-flaky'], /^\$ |^run \d|Flaky|passed on retry/);
const JUNIT = loc(OUT['92-junit'], /^\$ |^\d+$|<failure|Expected element|Booked/);
const KHONG_SERVER = loc(OUT['92-artifact-khong-server'], /^\$ |Node 22.*(ACTIONS_RUNTIME_TOKEN|Failure)|act exit/);
const TRUNG = loc(OUT['92-artifact-trung'], /^\$ |upload-artifact|act exit/);
const NOI_DUNG = OUT['92-artifact-trung-noi-dung'];
const DANH_SACH = loc(OUT['92-artifact-list'], /^\$ |data\/|index\.html|files$/);
const TH = OUT['92-th'];
const UNIT_STEPS = CODE.testYml.split('\n').slice(33, 53).join('\n');
const E2E_UPLOAD = CODE.testYml.split('\n').slice(93, 100).join('\n');

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Which job?</div><div class="lz-d">the red check on the PR — ci-ok tells you which job it blames</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Which step?</div><div class="lz-d">the first ❌ step; everything after it is a consequence</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Which test?</div><div class="lz-d">FAIL line, Expected / Received, file:line — or the annotation on the changed file</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">What did it see?</div><div class="lz-d">the artifact: Playwright report, trace, error context, coverage</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Reproduce</div><div class="lz-d">the same command on your machine (or act), then fix</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Job nào?</div><div class="lz-d">check đỏ trên PR — ci-ok cho biết nó đổ lỗi cho job nào</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Bước nào?</div><div class="lz-d">bước ❌ đầu tiên; mọi thứ sau nó chỉ là hệ quả</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Test nào?</div><div class="lz-d">dòng FAIL, Expected / Received, file:dòng — hoặc annotation trên file đã sửa</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Nó thấy gì?</div><div class="lz-d">artifact: báo cáo Playwright, trace, error context, độ phủ</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Tái hiện</div><div class="lz-d">đúng lệnh đó trên máy bạn (hoặc act), rồi sửa</div></div>
</div>`;


const NGUON = [
  nguon('🧾', 'Vitest — Reporters', 'github-actions (annotations + job summary), junit, json, blob.', 'https://vitest.dev/guide/reporters'),
  nguon('📦', 'actions/upload-artifact (README)', 'v4: unique names; retention 1–90 days (read 01/11/2026).', 'https://github.com/actions/upload-artifact'),
].join('\n');

export default {
  title: '9.2 — Reports, annotations and artifacts|||9.2 — Báo cáo, annotation và artifact',
  slug: 'tst-9-2-bao-cao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Làm cho một lần CI đỏ tự nói cái gì hỏng: đọc log đỏ từ trên xuống, reporter cho CI (tree, github-actions ⇒ annotation ::error + job summary, junit XML, json), $GITHUB_STEP_SUMMARY bằng script của dự án (bẫy đo thật: bản tóm tắt chỉ đọc một báo cáo ⇒ "✅ 174 of 174" trong khi web đỏ), artifact (báo cáo Playwright + trace khi đỏ, if: !cancelled(), tên duy nhất trong matrix) — đo trên một PR thật bằng act, phần chỉ có trên GitHub ghi là tài liệu.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Reports, annotations and artifacts</h2>
<p class="lead">A red check that only says “failed” costs a teammate twenty minutes of scrolling. This lesson takes one real pull request that breaks LabFlow Lite and makes the run explain itself: which test, which line, what the page showed — without anyone re-running it locally.</p>
<p><strong>After this lesson you can</strong> read a red CI log in order, choose reporters, write a job summary that does not lie, and keep the evidence (Playwright report, trace, coverage) as artifacts. <strong>Why it is useful:</strong> the reader of a red run is rarely its author; fast diagnosis stops “re-run and hope” (lesson 8.3).</p>

<h3>The pull request</h3>
<p>Binh shortens the confirmation in <code>web/BookingForm.jsx</code> from <code>'Booked. See you in ' + lab + '.'</code> to <code>'Booked.'</code> — a one-line change that reads harmless (branch <code>pr/tin-ngan</code>; to follow along, make the same change on a branch). The whole workflow of lesson 9.1, now with reporters, runs on it (act, pull_request event):</p>
${ra(TONG)}
<p>Both unit legs, e2e and the gate are red; integration is green. The quarantine job is red too, but it is report-only (lesson 9.3) and has nothing to do with this change. Read it in this order:</p>
${FLOW_EN}

<h3>Reporters: one for people, one for GitHub, one for tools</h3>
<p>The unit job now runs Vitest with several reporters at once:</p>
${ma('yaml', UNIT_STEPS)}
<p>In the web step, <code>tree</code> prints the failure for a person, and <code>github-actions</code> prints a <em>workflow command</em> that GitHub turns into an annotation — a red mark on line 28 of the test file in the pull request’s “Files changed” tab. act shows it with ❗:</p>
${ra(WEB)}
<p>So: <code>tree</code> for people, <code>github-actions</code> for GitHub, <code>junit</code> XML for other tools, <code>json</code> for our own script — one run, four readers.</p>
<p>The <code>github-actions</code> reporter also writes Vitest’s own job summary when <code>GITHUB_STEP_SUMMARY</code> is set (act printed its first line, “Summary - ## Vitest Test Report”). Run locally with the two variables, it shows exactly what GitHub receives:</p>
${ra(GH)}
<p>Its summary has one more trick: tests that passed only after a retry are listed as flaky. Six local runs of the race test from lesson 8.3 with <code>--retry=2</code>:</p>
${ra(FLAKY)}
<p>Every run exits 0 — green — yet some of them needed a retry. The summary is the only place that says so; this is the report lesson 8.3 asked for.</p>

<h3>A job summary that does not lie</h3>
<p><code>GITHUB_STEP_SUMMARY</code> is a file: Markdown appended to it appears on the run page (GitHub Docs: per step, at most 1 MiB). LabFlow Lite adds what Vitest’s summary lacks — coverage against <em>our</em> thresholds — with <code>scripts/ci-summary.mjs</code> (<code>src/ci/summary.js</code>, tested like any other code). Our first version read only <code>reports/unit.json</code>. On this pull request it printed:</p>
${ra(TOM_SAI)}
<p>“174 of 174 passed” on a run whose web tests were red: the summary only knew the report it was given. A summary is a claim about the run, so it needs tests like any other claim. The fix: the web step also writes <code>reports/web.json</code>, and <code>mergeReports</code> adds them up. Same pull request, unit job only (<code>act -j unit</code>):</p>
${ra(TOM_DUNG)}
<div class="pitfall co-tieu-de"><strong>A summary step must run when tests fail.</strong> Steps after a failed step are skipped unless their <code>if:</code> says otherwise. <code>if: always()</code> runs even when the run was cancelled; <code>if: failure()</code> only when something failed; <code>if: &#36;{{ !cancelled() }}</code> — what LabFlow Lite uses — runs after success and failure but not after a cancel, which is usually what you want for reports.</div>

<h3>JUnit XML, for tools</h3>
<p>Jenkins, GitLab and many GitHub actions read results as JUnit XML — the format Maven Surefire writes in Spring Boot projects. The web tests, locally on the PR branch:</p>
${ra(JUNIT)}
<p>One <code>&lt;testcase&gt;</code> per test, a <code>&lt;failure&gt;</code> in the red one — upload it so a tool can draw trends.</p>

<h3>Artifacts: keep the evidence</h3>
<p>The runner is deleted after the job. Anything you want to look at later must be uploaded as an <strong>artifact</strong>:</p>
${ma('yaml', E2E_UPLOAD)}
<p>In this run the e2e test failed three times (first try + two CI retries, lesson 7.3), Playwright recorded a trace on the first retry, and the report was uploaded although the step before it was red:</p>
${ra(E2E)}
${ra(DANH_SACH)}
<p><code>index.html</code> is the report; <code>data/*.zip</code> is the trace (131 KB: DOM snapshots, network, console, every action); <code>data/*.md</code> are the error contexts, one per attempt. Download, unzip, <code>npx playwright show-report &lt;folder&gt;</code> — or <code>npx playwright show-trace</code> on the zip.</p>
<div class="pitfall co-tieu-de"><strong>act and artifacts.</strong> act starts its artifact server only with <code>--artifact-server-path</code>. Without it every upload fails:
${ra(KHONG_SERVER)}
And act is more forgiving than GitHub about names. Two matrix legs uploading an artifact called <code>reports</code>:
${ra(TRUNG)}
${ra(NOI_DUNG)}
Both “succeeded”, one survived — Node 22’s file is gone. On GitHub, upload-artifact v4 does not allow it at all: “uploading to the same artifact via multiple jobs is not supported” (README, read 01/11/2026). Put the matrix value in the name: <code>unit-reports-node&#36;{{ matrix.node }}</code>.</div>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>You were not on the team when this PR went red. Using <strong>only the artifact</strong> <code>playwright-report.zip</code> (no log, no code), answer: which test failed, at which line, what did the page show, and how many attempts were made?</p>
<p><strong>Solution and real output:</strong></p>
${ra(TH)}
<p>The test starting at <code>e2e/dat-phong.spec.js:8</code> failed at its <code>expect</code> on line 12: it expected “Booked. See you in QA-…”, the page showed <code>status: Booked.</code> (the accessibility snapshot in the error context), and there are three error contexts — the first attempt and two retries. The bug is in the app, not the test.</p>
<p><strong>Done when</strong> your four answers come from the files in the zip, and you can say why the trace exists only for the retry (<code>trace: 'on-first-retry'</code>, Chapter 7).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">reporter</span><span class="v">The part of the test runner that turns results into text, XML, JSON or annotations.</span></div>
  <div class="kv"><span class="k">annotation (chú thích trên PR)</span><span class="v">A message attached to a file and line, created by ::error / ::warning workflow commands.</span></div>
  <div class="kv"><span class="k">job summary (tóm tắt job)</span><span class="v">Markdown appended to $GITHUB_STEP_SUMMARY, shown on the run page.</span></div>
  <div class="kv"><span class="k">JUnit XML</span><span class="v">A common file format for test results, read by most CI tools.</span></div>
  <div class="kv"><span class="k">artifact</span><span class="v">Files uploaded from a job (reports, traces, coverage), kept after the runner is gone.</span></div>
  <div class="kv"><span class="k">trace (bản ghi Playwright)</span><span class="v">A recording of one test run: DOM snapshots, network, console, actions.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read red runs in order: job → first failed step → test and line → artifact → reproduce.</li>
<li>Several reporters at once: <code>tree</code> for people, <code>github-actions</code> for annotations and a summary, <code>junit</code>/<code>json</code> for tools and scripts.</li>
<li>A summary is a claim — test it: ours said 174/174 while the web tests were red.</li>
<li>Upload evidence with <code>if: &#36;{{ !cancelled() }}</code>; unique artifact names per matrix leg.</li>
<li>act needs <code>--artifact-server-path</code>, and it accepts duplicate names that GitHub refuses.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-4-artifact', title: 'GitHub Actions course — 5.4: artifacts, measured', sub: 'There: what artifacts cost on GitHub. Here: which test evidence to upload, and how to read it.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Báo cáo, annotation và artifact</h2>
<p class="lead">Một check đỏ chỉ ghi “failed” làm một bạn cùng nhóm mất hai mươi phút cuộn log. Bài này lấy một pull request thật làm hỏng LabFlow Lite và khiến lần chạy tự giải thích: test nào, dòng nào, trang đã hiện gì — mà không ai phải chạy lại trên máy.</p>
<p><strong>Sau bài này bạn có thể</strong> đọc log CI đỏ theo thứ tự, chọn reporter, viết job summary không nói dối, và giữ bằng chứng (báo cáo Playwright, trace, độ phủ) dưới dạng artifact. <strong>Vì sao hữu ích:</strong> người đọc lần chạy đỏ hiếm khi là tác giả; chẩn đoán nhanh chặn thói “chạy lại rồi cầu may” (bài 8.3).</p>

<h3>Pull request</h3>
<p>Bình rút gọn lời xác nhận trong <code>web/BookingForm.jsx</code> từ <code>'Booked. See you in ' + lab + '.'</code> thành <code>'Booked.'</code> — một thay đổi một dòng trông vô hại (nhánh <code>pr/tin-ngan</code>; muốn làm theo, tạo đúng thay đổi đó trên một nhánh). Toàn bộ workflow của bài 9.1, nay có thêm reporter, chạy trên nó (act, event pull_request):</p>
${ra(TONG)}
<p>Cả hai nhánh unit, e2e và cổng đều đỏ; integration xanh. Job quarantine cũng đỏ, nhưng nó chỉ để báo cáo (bài 9.3) và chẳng liên quan gì tới thay đổi này. Đọc theo thứ tự:</p>
${FLOW_VI}

<h3>Reporter: một cho người, một cho GitHub, một cho công cụ</h3>
<p>Job unit giờ chạy Vitest với nhiều reporter cùng lúc:</p>
${ma('yaml', UNIT_STEPS)}
<p>Ở bước web, <code>tree</code> in lỗi cho người đọc, còn <code>github-actions</code> in một <em>workflow command</em> mà GitHub biến thành annotation — một dấu đỏ ở dòng 28 của file test trong tab “Files changed” của pull request. act hiện nó bằng ❗:</p>
${ra(WEB)}
<p>Tóm lại: <code>tree</code> cho người, <code>github-actions</code> cho GitHub, <code>junit</code> XML cho công cụ khác, <code>json</code> cho script của ta — một lần chạy, bốn người đọc.</p>
<p>Reporter <code>github-actions</code> còn ghi job summary của chính Vitest khi có <code>GITHUB_STEP_SUMMARY</code> (act in dòng đầu của nó, “Summary - ## Vitest Test Report”). Chạy trên máy với hai biến đó, nó cho thấy đúng thứ GitHub nhận được:</p>
${ra(GH)}
<p>Bản tóm tắt của nó còn một điểm hay: test chỉ xanh sau khi retry được liệt kê là chập chờn. Sáu lần chạy trên máy test tranh chấp của bài 8.3 với <code>--retry=2</code>:</p>
${ra(FLAKY)}
<p>Lần nào cũng thoát 0 — xanh — vậy mà có lần phải retry. Bản tóm tắt là chỗ duy nhất nói ra điều đó; đây chính là bản báo cáo mà bài 8.3 đòi.</p>

<h3>Một job summary không nói dối</h3>
<p><code>GITHUB_STEP_SUMMARY</code> là một file: Markdown nối vào nó hiện trên trang lần chạy (tài liệu GitHub: theo từng bước, tối đa 1 MiB). LabFlow Lite thêm thứ bản tóm tắt của Vitest không có — độ phủ so với ngưỡng <em>của chúng ta</em> — bằng <code>scripts/ci-summary.mjs</code> (<code>src/ci/summary.js</code>, được test như mọi code khác). Bản đầu tiên chỉ đọc <code>reports/unit.json</code>. Trên pull request này nó in:</p>
${ra(TOM_SAI)}
<p>“174 of 174 passed” trên một lần chạy có web test đỏ: bản tóm tắt chỉ biết báo cáo mà nó được đưa. Bản tóm tắt là một lời khẳng định về lần chạy, nên nó cần test như mọi lời khẳng định khác. Cách sửa: bước web cũng ghi <code>reports/web.json</code>, và <code>mergeReports</code> cộng chúng lại. Cùng pull request, chỉ job unit (<code>act -j unit</code>):</p>
${ra(TOM_DUNG)}
<div class="pitfall co-tieu-de"><strong>Bước tóm tắt phải chạy cả khi test đỏ.</strong> Các bước sau một bước hỏng bị bỏ qua trừ khi <code>if:</code> của chúng nói khác. <code>if: always()</code> chạy cả khi lần chạy bị huỷ; <code>if: failure()</code> chỉ khi có gì đó hỏng; <code>if: &#36;{{ !cancelled() }}</code> — thứ LabFlow Lite dùng — chạy sau cả xanh lẫn đỏ nhưng không chạy sau khi bị huỷ, thường là đúng thứ bạn muốn cho báo cáo.</div>

<h3>JUnit XML, cho công cụ</h3>
<p>Jenkins, GitLab và nhiều action của GitHub đọc kết quả dưới dạng JUnit XML — định dạng Maven Surefire ghi ra trong dự án Spring Boot. Các web test, chạy trên máy ở nhánh của PR:</p>
${ra(JUNIT)}
<p>Mỗi test một <code>&lt;testcase&gt;</code>, test đỏ có một <code>&lt;failure&gt;</code> — upload nó để một công cụ vẽ xu hướng.</p>

<h3>Artifact: giữ lại bằng chứng</h3>
<p>Runner bị xoá sau khi job xong. Thứ gì muốn xem lại sau phải được upload thành <strong>artifact</strong>:</p>
${ma('yaml', E2E_UPLOAD)}
<p>Trong lần chạy này, test e2e đỏ ba lần (lần đầu + hai lần retry của CI, bài 7.3), Playwright ghi trace ở lần retry đầu, và báo cáo vẫn được upload dù bước trước nó đỏ:</p>
${ra(E2E)}
${ra(DANH_SACH)}
<p><code>index.html</code> là báo cáo; <code>data/*.zip</code> là trace (131 KB: ảnh chụp DOM, mạng, console, mọi thao tác); <code>data/*.md</code> là error context, mỗi lần thử một file. Tải về, giải nén, <code>npx playwright show-report &lt;thư mục&gt;</code> — hoặc <code>npx playwright show-trace</code> trên file zip.</p>
<div class="pitfall co-tieu-de"><strong>act và artifact.</strong> act chỉ bật artifact server khi có <code>--artifact-server-path</code>. Thiếu nó, mọi lần upload đều hỏng:
${ra(KHONG_SERVER)}
Và act dễ dãi hơn GitHub về tên. Hai nhánh matrix cùng upload một artifact tên <code>reports</code>:
${ra(TRUNG)}
${ra(NOI_DUNG)}
Cả hai đều “succeeded”, chỉ một còn lại — file của Node 22 đã mất. Trên GitHub, upload-artifact v4 không cho phép điều này: “uploading to the same artifact via multiple jobs is not supported” (README, đọc 01/11/2026). Đưa giá trị matrix vào tên: <code>unit-reports-node&#36;{{ matrix.node }}</code>.</div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Bạn không có mặt khi PR này đỏ. Chỉ dùng <strong>artifact</strong> <code>playwright-report.zip</code> (không log, không code), trả lời: test nào đỏ, ở dòng nào, trang đã hiện gì, và đã thử bao nhiêu lần?</p>
<p><strong>Lời giải và output thật:</strong></p>
${ra(TH)}
<p>Test bắt đầu ở <code>e2e/dat-phong.spec.js:8</code> đỏ ở <code>expect</code> dòng 12: nó mong “Booked. See you in QA-…”, trang hiện <code>status: Booked.</code> (bản chụp khả năng truy cập trong error context), và có ba error context — lần đầu và hai lần retry. Bug nằm trong app, không phải trong test.</p>
<p><strong>Xong khi</strong> bốn câu trả lời của bạn đến từ các file trong zip, và bạn giải thích được vì sao chỉ lần retry mới có trace (<code>trace: 'on-first-retry'</code>, Chương 7).</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">reporter</span><span class="v">Phần của bộ chạy test biến kết quả thành chữ, XML, JSON hoặc annotation.</span></div>
  <div class="kv"><span class="k">annotation (chú thích trên PR)</span><span class="v">Một thông điệp gắn vào file và dòng, tạo bởi workflow command ::error / ::warning.</span></div>
  <div class="kv"><span class="k">job summary (tóm tắt job)</span><span class="v">Markdown nối vào $GITHUB_STEP_SUMMARY, hiện trên trang lần chạy.</span></div>
  <div class="kv"><span class="k">JUnit XML</span><span class="v">Định dạng file kết quả test phổ biến, hầu hết công cụ CI đọc được.</span></div>
  <div class="kv"><span class="k">artifact</span><span class="v">File upload từ một job (báo cáo, trace, độ phủ), còn lại sau khi runner bị xoá.</span></div>
  <div class="kv"><span class="k">trace (bản ghi Playwright)</span><span class="v">Bản ghi một lần chạy test: ảnh chụp DOM, mạng, console, thao tác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc lần chạy đỏ theo thứ tự: job → bước hỏng đầu tiên → test và dòng → artifact → tái hiện.</li>
<li>Nhiều reporter cùng lúc: <code>tree</code> cho người, <code>github-actions</code> cho annotation và tóm tắt, <code>junit</code>/<code>json</code> cho công cụ và script.</li>
<li>Bản tóm tắt là một lời khẳng định — hãy test nó: của chúng ta từng ghi 174/174 khi web test đỏ.</li>
<li>Upload bằng chứng với <code>if: &#36;{{ !cancelled() }}</code>; tên artifact duy nhất cho mỗi nhánh matrix.</li>
<li>act cần <code>--artifact-server-path</code>, và nó nhận tên trùng mà GitHub từ chối.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-4-artifact', title: 'Khoá GitHub Actions — 5.4: artifact, đo thật', sub: 'Ở đó: artifact tốn gì trên GitHub. Ở đây: upload bằng chứng test nào, và đọc nó ra sao.', cta: 'MỞ BÀI →' })}
</div>
`,
};
