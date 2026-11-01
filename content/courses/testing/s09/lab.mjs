/**
 * Testing · Chương 9 · Lab 9 — Sửa một pipeline hỏng. BÀI MỚI 01/11/2026, slug tst-9-5-lab-ci.
 * lab9/ci.yml cài sẵn 8 lỗi (+1 lỗi actionlint); máy chấm scripts/cham-lab-9.mjs = actionlint + 8 luật (src/ci/policy.js) + --act:
 * hai lần chạy thật (code thật ⇒ ci-ok xanh; cài bug 30 chỗ ⇒ ci-ok ĐỎ). Đo: bản gốc 0/8 + 1 lỗi actionlint; lần thử đầu (sửa lint, npm ci,
 * đổi tên cổng) 2/8 — act: cổng ci-ok không hề chạy (bị bỏ qua) khi e2e và Node 20 đỏ; lời giải 8/8 + act xanh/đỏ đúng.
 * Bẫy đo được: container service của một job ĐỎ bị act để lại trên cổng 5432 ⇒ job sau không có service vẫn "11 passed".
 */
import G from '../giang/tst-lab-9.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const LINT = OUT['lab9-lint'];
const GOC = loc(OUT['lab9-cham-goc'], /^\$ |✘ R|rules|Lab 9/);
const YEU = loc(OUT['lab9-cham-yeu'], /^\$ |actionlint|R\d|rules|Lab 9/);
const ACT_YEU = loc(OUT['lab9-act-yeu'], /^\$ |Error: connect ECONNREFUSED 127|Tests {2}\d+ failed|Failure - Main|Job (succeeded|failed)|^Error|act exit|wall time/);
const RAC = loc(OUT['lab9-rac'], /^\$ |^b2 |act-tests-integration|Error: connect ECONNREFUSED 127|Tests {2}|Job (succeeded|failed)|act exit/);
const LOI_GIAI = loc(OUT['lab9-cham-loi-giai'], /^\$ |actionlint|R\d|rules|act exit|act, |Lab 9|wall time/);
const POLICY = CODE.policy.split('\n').slice(51, 63).join('\n');
const SUA = CODE.loiGiai.split('\n').slice(12, 29).join('\n');

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">actionlint</div><div class="lz-d">is it a valid workflow? (syntax, expressions, runner labels)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">8 rules</div><div class="lz-d">is it a safe workflow? (src/ci/policy.js, seconds)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">act, real code</div><div class="lz-d">every required job and ci-ok must succeed</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">act, planted bug</div><div class="lz-d">30 seats need approval ⇒ ci-ok must FAIL (the file is restored in finally)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">verdict</div><div class="lz-d">exit 0 only when all four pass</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">actionlint</div><div class="lz-d">có phải một workflow hợp lệ? (cú pháp, biểu thức, nhãn runner)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">8 luật</div><div class="lz-d">có phải một workflow an toàn? (src/ci/policy.js, vài giây)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">act, code thật</div><div class="lz-d">mọi job bắt buộc và ci-ok phải thành công</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">act, cài bug</div><div class="lz-d">30 chỗ phải chờ duyệt ⇒ ci-ok phải ĐỎ (file được trả lại trong finally)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">kết luận</div><div class="lz-d">thoát 0 chỉ khi cả bốn đều đạt</div></div>
</div>`;

const LOI_EN = `<table>
<thead><tr><th>#</th><th>Planted problem</th><th>Rule</th><th>What it means for the team</th></tr></thead>
<tbody>
<tr><td>0</td><td><code>matrix.nodes</code> (typo)</td><td>actionlint</td><td>Node version empty — the job uses whatever Node the machine has</td></tr>
<tr><td>1</td><td><code>npm install</code></td><td>R1</td><td>CI tests versions nobody committed</td></tr>
<tr><td>2</td><td>no <code>cache: npm</code></td><td>R2</td><td>every run downloads 55 MB again</td></tr>
<tr><td>3</td><td>URL to localhost:5432, no service</td><td>R3</td><td>integration tests cannot connect (or, on a laptop, connect to the wrong database)</td></tr>
<tr><td>4</td><td><code>playwright install chromium</code></td><td>R4</td><td>every e2e test “fails” — the browser cannot start</td></tr>
<tr><td>5</td><td>required check “tests passed (pull_request)”</td><td>R5</td><td>the name contains the event; on a push it is a different check</td></tr>
<tr><td>6</td><td>gate without <code>always()</code>, never reads results</td><td>R6</td><td>skipped when something is red — and skipped counts as passed</td></tr>
<tr><td>7</td><td>gate forgets integration; quarantine runs in the unit job</td><td>R7</td><td>a red integration merges; a flaky test blocks innocent PRs</td></tr>
<tr><td>8</td><td><code>continue-on-error: true</code> on the matrix, Node 20 in it</td><td>R8</td><td>red legs look green; a version the project does not support is “tested”</td></tr>
</tbody></table>`;
const LOI_VI = `<table>
<thead><tr><th>#</th><th>Lỗi cài sẵn</th><th>Luật</th><th>Với cả nhóm nghĩa là gì</th></tr></thead>
<tbody>
<tr><td>0</td><td><code>matrix.nodes</code> (gõ sai)</td><td>actionlint</td><td>bản Node rỗng — job dùng Node nào có sẵn trên máy</td></tr>
<tr><td>1</td><td><code>npm install</code></td><td>R1</td><td>CI test những phiên bản không ai commit</td></tr>
<tr><td>2</td><td>thiếu <code>cache: npm</code></td><td>R2</td><td>lần chạy nào cũng tải lại 55 MB</td></tr>
<tr><td>3</td><td>URL tới localhost:5432, không có service</td><td>R3</td><td>test tích hợp không kết nối được (hoặc, trên laptop, kết nối nhầm CSDL)</td></tr>
<tr><td>4</td><td><code>playwright install chromium</code></td><td>R4</td><td>mọi test e2e “đỏ” — trình duyệt không khởi động nổi</td></tr>
<tr><td>5</td><td>check bắt buộc “tests passed (pull_request)”</td><td>R5</td><td>tên chứa event; khi push nó là một check khác</td></tr>
<tr><td>6</td><td>cổng thiếu <code>always()</code>, không đọc kết quả</td><td>R6</td><td>bị bỏ qua khi có gì đỏ — và bị bỏ qua được tính là đạt</td></tr>
<tr><td>7</td><td>cổng quên integration; quarantine chạy trong job unit</td><td>R7</td><td>integration đỏ vẫn merge; test chập chờn chặn PR vô tội</td></tr>
<tr><td>8</td><td><code>continue-on-error: true</code> trên matrix, có Node 20</td><td>R8</td><td>nhánh đỏ trông như xanh; “test” một bản Node dự án không hỗ trợ</td></tr>
</tbody></table>`;

const CHAM_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>actionlint: 0 problems</td><td>1</td></tr>
<tr><td>The 8 rules of <code>cham-lab-9.mjs</code> (0.5 each)</td><td>4</td></tr>
<tr><td><code>--act</code>, real code: ci-ok succeeded</td><td>2</td></tr>
<tr><td><code>--act</code>, planted bug: ci-ok failed</td><td>2</td></tr>
<tr><td>A pull-request description: which ONE check branch protection must require, and what happens to the quarantined test</td><td>1</td></tr>
<tr><td><strong>Total (pass: 7)</strong></td><td><strong>10</strong></td></tr>
</tbody></table>`;
const CHAM_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>actionlint: 0 lỗi</td><td>1</td></tr>
<tr><td>8 luật của <code>cham-lab-9.mjs</code> (mỗi luật 0,5)</td><td>4</td></tr>
<tr><td><code>--act</code>, code thật: ci-ok thành công</td><td>2</td></tr>
<tr><td><code>--act</code>, cài bug: ci-ok đỏ</td><td>2</td></tr>
<tr><td>Một đoạn mô tả pull request: branch protection phải đòi MỘT check nào, và test bị cách ly được xử lý ra sao</td><td>1</td></tr>
<tr><td><strong>Tổng (đạt: 7)</strong></td><td><strong>10</strong></td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🔎', 'actionlint', 'Static checker for GitHub Actions workflows: syntax, expressions, runner labels, shellcheck on run: scripts.', 'https://github.com/rhysd/actionlint'),
  nguon('🐳', 'act — usage guide', 'Events, -W, -j, .actrc, the artifact server flag.', 'https://nektosact.com/usage/index.html'),
].join('\n');

export default {
  title: 'Lab 9 — Fix a broken pipeline until one required check blocks a real bug|||Lab 9 — Sửa một pipeline hỏng tới khi một check bắt buộc chặn được bug thật',
  slug: 'tst-9-5-lab-ci',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 9: lab9/ci.yml của một bạn cùng nhóm "thường xanh" mà có 8 lỗi + 1 lỗi actionlint (npm install, thiếu cache, không có service PostgreSQL, Playwright thiếu --with-deps, check bắt buộc mang tên event, cổng thiếu always(), cổng quên integration + test chập chờn trong job chặn, continue-on-error trên matrix có Node 20). Máy chấm scripts/cham-lab-9.mjs: actionlint + 8 luật + hai lần chạy act thật (code thật ⇒ ci-ok xanh, cài bug 30 chỗ ⇒ ci-ok đỏ). Lần thử đầu đo thật 2/8 và cổng không hề chạy; thang 10 điểm, gợi ý, lời giải 8/8.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9</span>
<h2>Fix a broken pipeline until one required check blocks a real bug</h2>
<p class="lead">A teammate wrote the CI for LabFlow Lite in a hurry. It is “usually green”. Your job is to make green mean something: when this lab is done, one required check passes on the real code and fails on a planted bug — proved by two real runs.</p>
<p><strong>After this lab you can</strong> review a workflow the way a senior does — validity with actionlint, safety with explicit rules, behaviour with a real run — and fix it without breaking what works. <strong>Why it is useful:</strong> in a first job you inherit pipelines more often than you write them, and “the CI was green” is the most common sentence after a bug reached production.</p>

<h3>Setup</h3>
<p>The project of this chapter (<code>_labflow-lite</code>, end of Chapter 9), with Docker, act and actionlint installed (lesson 9.1). Edit only <code>lab9/ci.yml</code>. The grader:</p>
${FLOW_EN}
<p><code>node scripts/cham-lab-9.mjs</code> checks the first two in seconds; <code>node scripts/cham-lab-9.mjs --act</code> adds the two real runs (832 s on our laptop, mostly the browser install).</p>

<h3>The file you inherit</h3>
${ma('yaml', CODE.lab)}
${ra(LINT)}
${ra(GOC)}
${LOI_EN}

<h3>Your task — start from the promise, not from the list</h3>
<p>Do not fix rule by rule. Write down first what this CI must promise, in plain words: (1) it installs exactly the lockfile; (2) every kind of test runs against what it needs — a database, a browser; (3) exactly one check, with a stable name, decides a merge; (4) that check fails whenever a required job did not succeed; (5) a known flaky test reports but never blocks; (6) only supported Node versions are tested, and a red one is red. Then change the file until each promise holds, and use the grader to find what you missed.</p>

<h3>A first attempt — measured</h3>
<p>The usual first attempt fixes what is loud: the actionlint error, <code>npm install</code>, and renames the gate to <code>ci-ok</code> (<code>lab9/thu-lan-dau.yml</code>):</p>
${ra(YEU)}
<p>2 of 8. And a real run shows why the rules matter — act on the first attempt:</p>
${ra(ACT_YEU)}
<p>Node 20 is red (lesson 9.4), e2e is red (no <code>--with-deps</code>, lesson 9.1), integration cannot connect — and <code>ci-ok</code> does not appear at all. It was skipped, and on GitHub a skipped required check counts as passed: this pull request would merge. Each remaining rule closes one such hole.</p>
<div class="pitfall co-tieu-de"><strong>Clean up between act runs.</strong> Our first run of this attempt printed “11 passed” for an integration job that has no service. The PostgreSQL service of an earlier <em>failed</em> run was still running on port 5432 — act keeps a failed job’s containers so you can inspect them. Reproduced on purpose:
${ra(RAC)}
Before trusting a green act run, <code>docker ps -a | grep act-</code> and remove what is left.</div>

<h3>Rubric (10 points, pass 7)</h3>
${CHAM_EN}

<h3>Hints, from light to strong</h3>
<ol>
<li>Read each ✘ line of the grader: it names the job and the problem.</li>
<li>Lesson 9.1 has the service block, the cache line and the browser install; lesson 9.3 has the gate; lesson 9.4 has the matrix decision.</li>
<li>The quarantined test needs its own job with <code>continue-on-error: true</code> — and that job must not be in the gate’s <code>needs</code>.</li>
<li>Check what the rules read, in <code>src/ci/policy.js</code>; R7, for example:
${ma('javascript', POLICY)}</li>
</ol>

<h3>Reference solution</h3>
<p><code>lab9/loi-giai.yml</code> — the unit job (the integration service, e2e install, quarantine job and gate follow lessons 9.1 and 9.3; the whole file is in the project):</p>
${ma('yaml', SUA)}
${ra(LOI_GIAI)}
<p>Static: 0 actionlint problems, 8/8 rules. Real runs: on the real code every required job and <code>ci-ok</code> succeeded; with the planted bug <code>ci-ok</code> failed and named the job. That is the whole point of the chapter in one line: the required check is red exactly when a required test is red.</p>

<h3>✅ Checklist</h3>
<ul>
<li><code>actionlint lab9/ci.yml</code> prints nothing.</li>
<li><code>node scripts/cham-lab-9.mjs --act</code> ends with <code>Lab 9: PASS</code>.</li>
<li>Your PR description says: branch protection requires <code>ci-ok</code> only; the quarantined race test (LAB-142) reports in its own job until it is fixed.</li>
<li><code>docker ps -a | grep act-</code> is empty when you finish.</li>
</ul>

${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9</span>
<h2>Sửa một pipeline hỏng tới khi một check bắt buộc chặn được bug thật</h2>
<p class="lead">Một bạn cùng nhóm viết CI cho LabFlow Lite trong lúc vội. Nó “thường xanh”. Việc của bạn là làm cho màu xanh có ý nghĩa: khi xong lab, một check bắt buộc đạt trên code thật và đỏ trên một bug cài sẵn — chứng minh bằng hai lần chạy thật.</p>
<p><strong>Sau lab này bạn có thể</strong> soát một workflow như người có kinh nghiệm — tính hợp lệ bằng actionlint, tính an toàn bằng các luật tường minh, hành vi bằng một lần chạy thật — và sửa nó mà không làm hỏng phần đang chạy tốt. <strong>Vì sao hữu ích:</strong> ở công việc đầu tiên bạn thừa kế pipeline nhiều hơn là tự viết, và “CI đã xanh mà” là câu hay nghe nhất sau khi một bug lọt ra production.</p>

<h3>Chuẩn bị</h3>
<p>Dự án của chương này (<code>_labflow-lite</code>, cuối Chương 9), đã cài Docker, act và actionlint (bài 9.1). Chỉ sửa <code>lab9/ci.yml</code>. Máy chấm:</p>
${FLOW_VI}
<p><code>node scripts/cham-lab-9.mjs</code> kiểm hai bước đầu trong vài giây; <code>node scripts/cham-lab-9.mjs --act</code> thêm hai lần chạy thật (832 s trên laptop của chúng tôi, phần lớn là cài trình duyệt).</p>

<h3>File bạn thừa kế</h3>
${ma('yaml', CODE.lab)}
${ra(LINT)}
${ra(GOC)}
${LOI_VI}

<h3>Nhiệm vụ — bắt đầu từ lời hứa, không từ danh sách</h3>
<p>Đừng sửa theo từng luật. Trước tiên viết ra CI này phải hứa gì, bằng lời thường: (1) nó cài đúng lockfile; (2) mỗi loại test chạy với thứ nó cần — một CSDL, một trình duyệt; (3) đúng một check, tên ổn định, quyết định chuyện merge; (4) check đó đỏ mỗi khi một job bắt buộc không thành công; (5) một test đã biết là chập chờn thì báo cáo nhưng không bao giờ chặn; (6) chỉ test các bản Node được hỗ trợ, và bản nào đỏ thì phải đỏ. Rồi sửa file tới khi từng lời hứa đều đúng, và dùng máy chấm để tìm chỗ còn sót.</p>

<h3>Lần thử đầu — đo thật</h3>
<p>Lần thử đầu thường sửa những gì ồn ào: lỗi actionlint, <code>npm install</code>, và đổi tên cổng thành <code>ci-ok</code> (<code>lab9/thu-lan-dau.yml</code>):</p>
${ra(YEU)}
<p>2 trên 8. Và một lần chạy thật cho thấy vì sao các luật quan trọng — act trên lần thử đầu:</p>
${ra(ACT_YEU)}
<p>Node 20 đỏ (bài 9.4), e2e đỏ (thiếu <code>--with-deps</code>, bài 9.1), integration không kết nối được — và <code>ci-ok</code> hoàn toàn không xuất hiện. Nó bị bỏ qua, và trên GitHub một check bắt buộc bị bỏ qua được tính là đạt: pull request này sẽ được merge. Mỗi luật còn lại bịt một lỗ như thế.</p>
<div class="pitfall co-tieu-de"><strong>Dọn dẹp giữa các lần chạy act.</strong> Lần chạy đầu tiên của chúng tôi với bản thử này in “11 passed” cho một job integration không hề có service. Service PostgreSQL của một lần chạy <em>đỏ</em> trước đó vẫn đang chạy ở cổng 5432 — act giữ container của job đỏ để bạn xem lại. Tái hiện có chủ đích:
${ra(RAC)}
Trước khi tin một lần act xanh, chạy <code>docker ps -a | grep act-</code> và xoá thứ còn sót.</div>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${CHAM_VI}

<h3>Gợi ý, từ nhẹ tới mạnh</h3>
<ol>
<li>Đọc từng dòng ✘ của máy chấm: nó gọi tên job và vấn đề.</li>
<li>Bài 9.1 có khối service, dòng cache và lệnh cài trình duyệt; bài 9.3 có cổng; bài 9.4 có quyết định về matrix.</li>
<li>Test bị cách ly cần job riêng với <code>continue-on-error: true</code> — và job đó không được nằm trong <code>needs</code> của cổng.</li>
<li>Xem các luật đọc gì trong <code>src/ci/policy.js</code>; ví dụ R7:
${ma('javascript', POLICY)}</li>
</ol>

<h3>Lời giải tham khảo</h3>
<p><code>lab9/loi-giai.yml</code> — job unit (service tích hợp, lệnh cài e2e, job quarantine và cổng làm theo bài 9.1 và 9.3; cả file nằm trong dự án):</p>
${ma('yaml', SUA)}
${ra(LOI_GIAI)}
<p>Tĩnh: 0 lỗi actionlint, 8/8 luật. Chạy thật: trên code thật mọi job bắt buộc và <code>ci-ok</code> đều thành công; với bug cài sẵn <code>ci-ok</code> đỏ và gọi tên job. Đó là toàn bộ ý của chương trong một dòng: check bắt buộc đỏ đúng khi một test bắt buộc đỏ.</p>

<h3>✅ Checklist</h3>
<ul>
<li><code>actionlint lab9/ci.yml</code> không in gì.</li>
<li><code>node scripts/cham-lab-9.mjs --act</code> kết thúc bằng <code>Lab 9: PASS</code>.</li>
<li>Mô tả PR của bạn ghi: branch protection chỉ đòi <code>ci-ok</code>; test tranh chấp bị cách ly (LAB-142) báo cáo trong job riêng cho tới khi được sửa.</li>
<li><code>docker ps -a | grep act-</code> trống khi bạn xong việc.</li>
</ul>

${NGUON}
</div>
`,
};
