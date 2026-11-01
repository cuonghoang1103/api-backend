/**
 * Testing · Chương 9 · 9.1 — Chạy test trong GitHub Actions. Slug giữ từ khung: tst-9-1-github-actions.
 * Chạy thật bằng act 0.2.94 (nektos/act, Docker, ảnh catthehacker/ubuntu:act-24.04, arm64) + actionlint 1.7.12 trên LabFlow Lite:
 * job unit + web 116 + 16 passed; npm ci 34,8 s (không cache) · 49,6 s (cache lạnh) · 15,0 s (cache ấm), cả lượt 47/61/27 s;
 * npm ci đỏ khi lockfile lệch (EUSAGE, Missing: dayjs@1.11.23); service postgres:17 qua localhost:5432 xanh 11 passed, qua tên
 * "postgres" ⇒ ENOTFOUND; Playwright thiếu --with-deps ⇒ libnspr4.so, có ⇒ 9 passed (cài 5 phút 4 giây, test 3,7 s);
 * it.only xanh trên máy, đỏ khi CI=true. Phần chỉ có trên GitHub ghi là TÀI LIỆU (đọc 01/11/2026), không phải số đo.
 */
import G from '../giang/tst-09-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

// Lọc output (chỉ bỏ dòng, không sửa chữ).
const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const motLan = (t, re, mot) => { let da = false; return t.split('\n').filter((l) => re.test(l) && (!mot.test(l) || (!da && (da = true)))).join('\n'); };
const BUOC = /^\$ |Success - Main|Failure - Main|Job (succeeded|failed)|wall time|act exit|Tests {2}/;
const DAU = loc(OUT['91-khong-cache'], BUOC);
const AM = loc(OUT['91-cache-lan2'], /^\$ |cache-hit|Cache restored from|Main npm ci|wall time/);
const LECH = loc(OUT['91-npm-ci-lech'], /^\$ |dayjs|can only install|Missing/);
const PG_XANH = loc(OUT['91-int-localhost'], /^\$ |is healthy|Tests {2}|Main npm run test:int|Job succeeded|wall time/);
const PG_TEN = loc(OUT['91-int-ten-dich-vu'], /^\$ |ENOTFOUND postgres|Failure - Main|act exit/);
const E2E_THIEU = motLan(OUT['91-e2e-thieu-deps'], /^\$ |Success - Main npx|libnspr4|\d failed|did not run|act exit/, /libnspr4/);
const E2E = loc(OUT['91-e2e'], /^\$ |Success - Main n|passed \(|act exit|wall time/);
const ONLY_MAY = loc(OUT['91-only-may'], /^\$ |✓ 31|↓|Tests {2}/);
const ONLY_CI = loc(OUT['91-only-ci'], /^\$ |Unexpected|Tests {2}/);
const TH_LINT = loc(OUT['91-th-lint'], /^\$ |is unknown/);
const TH_0 = loc(OUT['91-th-act-0'], /^\$ |Skipping|act exit/);
const TH_1 = loc(OUT['91-th-act-1'], /^\$ |does not exist|Failure - Main|act exit/);
const TH_2 = loc(OUT['91-th-act-2'], /^\$ |Tests {2}|Job succeeded|act exit/);
const SERVICE = CODE.wf91Int.split('\n').slice(5, 21).join('\n');

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Event</div><div class="lz-d">a push to main, or a pull request opened/updated</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Fresh machine</div><div class="lz-d">one clean runner per job — nothing from your laptop, nothing from the last run</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Steps</div><div class="lz-d">checkout → setup-node → npm ci → the test command(s)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Exit code</div><div class="lz-d">every step 0 → job ✓ · one step not 0 → job ✗, later steps skipped</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Status on the PR</div><div class="lz-d">a check per job, next to the Merge button (lesson 9.3 makes it blocking)</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Sự kiện</div><div class="lz-d">một lần push lên main, hoặc một pull request được mở/cập nhật</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Máy mới tinh</div><div class="lz-d">mỗi job một runner sạch — không có gì từ laptop của bạn, không có gì từ lần chạy trước</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Các bước</div><div class="lz-d">checkout → setup-node → npm ci → (các) lệnh test</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Mã thoát</div><div class="lz-d">mọi bước ra 0 → job ✓ · một bước khác 0 → job ✗, các bước sau bị bỏ qua</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Trạng thái trên PR</div><div class="lz-d">mỗi job một check, cạnh nút Merge (bài 9.3 biến nó thành bắt buộc)</div></div>
</div>`;

const ACT_EN = `<table>
<thead><tr><th></th><th>GitHub-hosted runner (documentation)</th><th>act on your machine (measured here)</th></tr></thead>
<tbody>
<tr><td>Where a job runs</td><td>a fresh virtual machine</td><td>a Docker container (<code>catthehacker/ubuntu:act-24.04</code>, arm64)</td></tr>
<tr><td>Which code</td><td>the pushed commit</td><td>your working folder, <strong>uncommitted files too</strong></td></tr>
<tr><td>Cache</td><td>GitHub’s cache service</td><td>a local server (<code>--cache-server-path</code>)</td></tr>
<tr><td>Artifacts</td><td>always available</td><td>only with <code>--artifact-server-path</code> (lesson 9.2)</td></tr>
</tbody></table>`;
const ACT_VI = `<table>
<thead><tr><th></th><th>Runner GitHub cung cấp (tài liệu)</th><th>act trên máy bạn (đo ở đây)</th></tr></thead>
<tbody>
<tr><td>Job chạy ở đâu</td><td>một máy ảo mới</td><td>một container Docker (<code>catthehacker/ubuntu:act-24.04</code>, arm64)</td></tr>
<tr><td>Code nào</td><td>commit được push</td><td>thư mục làm việc, <strong>cả file chưa commit</strong></td></tr>
<tr><td>Cache</td><td>dịch vụ cache của GitHub</td><td>một server cục bộ (<code>--cache-server-path</code>)</td></tr>
<tr><td>Artifact</td><td>luôn có</td><td>chỉ khi có <code>--artifact-server-path</code> (bài 9.2)</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'GitHub Docs — Workflow syntax for GitHub Actions', 'on, jobs, runs-on, steps, services, env, default shells (read 01/11/2026).', 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax'),
  nguon('🐳', 'act — usage guide', 'Run workflows locally in Docker: events, -W, -j, .actrc, the artifact server.', 'https://nektosact.com/usage/index.html'),
].join('\n');

export default {
  title: '9.1 — Running tests in GitHub Actions|||9.1 — Chạy test trong GitHub Actions',
  slug: 'tst-9-1-github-actions',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Workflow đầu tiên chạy unit + web test của LabFlow Lite mỗi lần push/PR, chạy THẬT trên máy bằng act (Docker) và kiểm bằng actionlint: npm ci thay vì npm install (lockfile lệch ⇒ đỏ ngay), cache ~/.npm (npm ci 49,6 s → 15,0 s), PostgreSQL bằng service container (localhost:5432 xanh, gọi tên "postgres" ⇒ ENOTFOUND), Playwright cần --with-deps (thiếu ⇒ libnspr4.so), it.only xanh trên máy mà đỏ trong CI; act khác GitHub ở đâu.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Running tests in GitHub Actions</h2>
<p class="lead">A test suite that someone must remember to run is skipped exactly on the day it matters. This lesson makes a machine run LabFlow Lite’s tests on every push and pull request — rehearsed on your own laptop first, so every output below is real.</p>
<p><strong>After this lesson you can</strong> write a workflow that installs LabFlow Lite exactly from its lockfile and runs unit, web, integration (real PostgreSQL) and browser tests; rehearse it with <code>act</code> and check it with <code>actionlint</code>. <strong>Why it is useful:</strong> a neutral machine ends “works on my machine”; Node job posts list CI, and your group project (SWP, capstone) gets a red mark on the pull request that breaks it.</p>

<h3>What CI does, in one picture</h3>
<p><em>Continuous integration</em> (CI, tích hợp liên tục): every change is built and tested automatically. A <strong>workflow</strong> (YAML in <code>.github/workflows/</code>) reacts to <strong>events</strong>; each of its <strong>jobs</strong> runs on its own <strong>runner</strong> as a list of <strong>steps</strong> — a command (<code>run:</code>) or a ready-made <strong>action</strong> (<code>uses:</code>).</p>
${FLOW_EN}

<h3>The first workflow</h3>
${ma('yaml', CODE.wf91)}
<p><code>runs-on</code> picks a GitHub-hosted Linux machine; <code>timeout-minutes</code> stops a hung test from burning the default 6 hours; <code>checkout</code> and <code>setup-node</code> get the code and Node 22; the three <code>run:</code> steps are the commands you type. A step fails when its command exits with non-zero — the <code>[exit 1]</code> of this course.</p>

<h3>Run it on your machine with act</h3>
<p>You do not need to push to find out whether a YAML file works: <a href="https://nektosact.com" target="_blank" rel="noopener">act</a> runs each job of the same workflow in a Docker container. Install it and the linter once (<code>brew install act actionlint</code>; Windows: <code>winget install nektos.act</code>) and name the runner image in <code>.actrc</code>:</p>
${ma('bash', CODE.actrc)}
<p>The second run of <code>act push -W &lt;file&gt;</code> (the first one downloads a 2.26 GB image), one line per step:</p>
${ra(DAU)}
<p>132 tests green on a machine that has never seen your <code>node_modules</code> — and <code>npm ci</code> took 34.8 of the 47 seconds: installing, not testing, is the cost of CI.</p>
${ACT_EN}
<div class="pitfall co-tieu-de"><strong>act is a rehearsal, not GitHub.</strong> It copies your working folder — half-written files included — when each job starts; it refuses <code>--cache-server-path</code> and <code>--artifact-server-path</code> in a project <code>.actrc</code> (put them on the command line); and its job containers share the Docker host’s network — here a wrong port once reached another project’s PostgreSQL. Failed jobs’ containers are kept: <code>docker ps -a | grep act-</code>, then <code>docker rm -f</code>.</div>

<h3>npm ci, never npm install</h3>
<p><code>npm install</code> may change <code>package-lock.json</code> to satisfy <code>package.json</code>; <code>npm ci</code> deletes <code>node_modules</code> and installs <em>exactly</em> the lockfile — or refuses. A teammate added <code>dayjs</code> to <code>package.json</code> by hand and forgot the lockfile:</p>
${ra(LECH)}
<p>Good: red <em>before</em> any test runs, reason in one line. <code>npm install</code> would have quietly installed whatever <code>^1.11.13</code> means today and tested code nobody has.</p>

<h3>Cache the downloads</h3>
<p>Add <code>cache: npm</code> to <code>setup-node</code>. It saves <code>~/.npm</code> (the download cache, not <code>node_modules</code>) under a key built from the hash of <code>package-lock.json</code>, and restores it next time:</p>
${ra(AM)}
<table>
<thead><tr><th>Run (act, this laptop)</th><th><code>npm ci</code></th><th>Whole run</th></tr></thead>
<tbody><tr><td>No cache</td><td>34.8 s</td><td>47 s</td></tr><tr><td><code>cache: npm</code>, first run (miss, then save 55 MB)</td><td>49.6 s</td><td>61 s</td></tr><tr><td><code>cache: npm</code>, second run (hit)</td><td>15.0 s</td><td>27 s</td></tr></tbody></table>
<p>The two cold runs differ by 15 s with only the network changed — measure twice. Warm is about 3× faster; <code>npm ci</code> still runs, it just stops downloading. A new lockfile ⇒ a new key ⇒ one cold run, which is correct.</p>

<h3>A real PostgreSQL: service containers</h3>
<p>Chapter 4’s integration tests need PostgreSQL 17. In CI it comes as a <strong>service container</strong>: started next to the job, waited for through its health check, removed afterwards. LabFlow Lite already reads <code>TEST_DATABASE_URL</code> (lesson 4.2):</p>
${ma('yaml', SERVICE)}
${ra(PG_XANH)}
<div class="pitfall co-tieu-de"><strong>localhost or the service name?</strong> GitHub’s documentation (read 01/11/2026): a job running <em>on the runner</em>, like this one, reaches a service at <code>localhost:&lt;mapped port&gt;</code>; the label <code>postgres</code> is a hostname only when the job itself runs in a container. Copied from a container example:
${ra(PG_TEN)}
</div>

<h3>Playwright in CI</h3>
<p>A fresh Ubuntu machine has neither Chromium nor its system libraries. Downloading only the browser:</p>
${ra(E2E_THIEU)}
<p>The two sign-in setup tests failed and the other 7 never ran, in 2.8 s; the test code was fine — the browser could not start. <code>--with-deps</code> also installs the Linux packages (64 here, via <code>apt-get</code>):</p>
${ra(E2E)}
<p>Five minutes of installing for 3.7 seconds of tests (this laptop’s network). Playwright’s documentation: “Caching browser binaries is not recommended”; the alternative is Playwright’s official Docker image. Lesson 9.3 decides when this slow job runs.</p>

<h3>One more trap: it.only</h3>
<p>While debugging, someone writes <code>it.only</code> and commits it. On their machine:</p>
${ra(ONLY_MAY)}
<p>Green — and the second test, which is wrong, never ran. In CI Vitest sees <code>CI=true</code> (GitHub and act both set it) and refuses:</p>
${ra(ONLY_CI)}
<p>Playwright does the same with <code>forbidOnly: !!process.env.CI</code> (Chapter 7): CI adds the checks a tired human skips.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo9/wf/th91-de.yml</code> never went green. Run <code>actionlint</code>, fix what it reports, run act, fix what act shows.</p>
<p><strong>Solution and real output.</strong> actionlint finds the first problem (its message ends with a long list of valid labels, so the lines are cut at 110 characters):</p>
${ra(TH_LINT)}
<p>Had you skipped actionlint, act would have told you nothing useful — it skips a job whose runner label it does not know, and still exits 0:</p>
${ra(TH_0)}
<p>Fixed to <code>ubuntu-latest</code>, act now runs the job and shows the second problem:</p>
${ra(TH_1)}
<p>The URL asks for the database <code>labflow</code>; the service creates <code>labflow_test</code> (<code>POSTGRES_DB</code>). With both fixed (<code>demo9/wf/th91.yml</code>):</p>
${ra(TH_2)}
<p><strong>Done when</strong> <code>actionlint</code> prints nothing, act ends with <code>act exit: 0</code> and <code>Job succeeded</code> after 11 integration tests passed — and you can say which problem actionlint could see and which only a real run could.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">workflow / job / step (quy trình / việc / bước)</span><span class="v">A YAML file; its parallel units, each on its own machine; the commands inside a job.</span></div>
  <div class="kv"><span class="k">runner (máy chạy)</span><span class="v">The machine that runs one job; GitHub-hosted runners are fresh every time.</span></div>
  <div class="kv"><span class="k">service container (container dịch vụ)</span><span class="v">A Docker container started next to a job, e.g. PostgreSQL for integration tests.</span></div>
  <div class="kv"><span class="k">lockfile (tệp khoá phiên bản)</span><span class="v">package-lock.json: the exact versions npm ci must install.</span></div>
  <div class="kv"><span class="k">act / actionlint</span><span class="v">Run a workflow locally in Docker / check a workflow file for mistakes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rehearse locally: <code>actionlint</code> for the file, <code>act</code> for the run — and remember act is not GitHub.</li>
<li><code>npm ci</code> + <code>cache: npm</code>: exact versions, and 49.6 s → 15.0 s here.</li>
<li>PostgreSQL as a service with a health check; on the runner it is <code>localhost:5432</code>.</li>
<li>Playwright needs <code>--with-deps</code>; the browser install dominates the e2e job.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-ci-automation', title: 'Theory in SWT301 — 8.6: test pyramid and continuous integration', sub: 'Same: CI tests every change; red or green comes from the exit code. Deeper here: a real Node workflow, run and measured with act.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-1-cache-mua-gi', title: 'GitHub Actions course — 5.1: what the npm cache buys', sub: 'There: measured on GitHub’s runners, and why caching node_modules is not worth it. Here: the same cache in a test workflow, measured with act.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Node.js course — 14.5: coverage, flaky tests and CI', sub: 'There: the CI of cuongthai.com. Here: CI for the course project.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Chạy test trong GitHub Actions</h2>
<p class="lead">Một bộ test phải nhớ mới chạy thì bị quên đúng vào ngày nó quan trọng nhất. Bài này giao cho một cái máy chạy test của LabFlow Lite ở mỗi lần push và pull request — tổng duyệt trên laptop của bạn trước, nên mọi output dưới đây đều là thật.</p>
<p><strong>Sau bài này bạn có thể</strong> viết một workflow cài LabFlow Lite đúng theo lockfile và chạy test unit, web, tích hợp (PostgreSQL thật) và trình duyệt; tổng duyệt bằng <code>act</code> và kiểm bằng <code>actionlint</code>. <strong>Vì sao hữu ích:</strong> một cái máy trung lập chấm dứt “máy em chạy được”; tin tuyển Node đều ghi CI, và đồ án nhóm (SWP, capstone) có dấu đỏ trên đúng pull request làm hỏng nó.</p>

<h3>CI làm gì, trong một hình</h3>
<p><em>Continuous integration</em> (CI, tích hợp liên tục): mọi thay đổi được build và test tự động. Một <strong>workflow</strong> (YAML trong <code>.github/workflows/</code>) phản ứng với các <strong>event</strong> (sự kiện); mỗi <strong>job</strong> của nó chạy trên một <strong>runner</strong> (máy chạy) riêng theo danh sách <strong>step</strong> (bước) — một lệnh (<code>run:</code>) hoặc một <strong>action</strong> làm sẵn (<code>uses:</code>).</p>
${FLOW_VI}

<h3>Workflow đầu tiên</h3>
${ma('yaml', CODE.wf91)}
<p><code>runs-on</code> chọn một máy Linux của GitHub; <code>timeout-minutes</code> chặn test bị treo đốt hết 6 tiếng mặc định; <code>checkout</code> và <code>setup-node</code> lấy code và Node 22; ba bước <code>run:</code> là đúng các lệnh bạn vẫn gõ. Một bước đỏ khi lệnh của nó thoát khác 0 — chính là <code>[exit 1]</code> của khoá này.</p>

<h3>Chạy nó trên máy bằng act</h3>
<p>Không cần push mới biết một file YAML có chạy không: <a href="https://nektosact.com" target="_blank" rel="noopener">act</a> chạy từng job của đúng workflow đó trong một container Docker. Cài nó cùng bộ kiểm một lần (<code>brew install act actionlint</code>; Windows: <code>winget install nektos.act</code>) rồi ghi ảnh runner vào <code>.actrc</code>:</p>
${ma('bash', CODE.actrc)}
<p>Lần chạy thứ hai của <code>act push -W &lt;file&gt;</code> (lần đầu tải một ảnh 2,26 GB), mỗi bước một dòng:</p>
${ra(DAU)}
<p>132 test xanh trên một cái máy chưa từng thấy <code>node_modules</code> của bạn — và <code>npm ci</code> chiếm 34,8 trong 47 giây: cài đặt, chứ không phải test, mới là chi phí của CI.</p>
${ACT_VI}
<div class="pitfall co-tieu-de"><strong>act là buổi tổng duyệt, không phải GitHub.</strong> Nó chép thư mục làm việc của bạn — kể cả file đang gõ dở — lúc mỗi job bắt đầu; nó từ chối <code>--cache-server-path</code> và <code>--artifact-server-path</code> trong <code>.actrc</code> của dự án (ghi chúng trên dòng lệnh); và container job của nó dùng chung mạng của máy chủ Docker — ở đây có lần sai cổng chạm vào PostgreSQL của một dự án khác. Container của job đỏ bị giữ lại: <code>docker ps -a | grep act-</code>, rồi <code>docker rm -f</code>.</div>

<h3>npm ci, đừng bao giờ npm install</h3>
<p><code>npm install</code> có thể sửa <code>package-lock.json</code> cho khớp <code>package.json</code>; <code>npm ci</code> xoá <code>node_modules</code> và cài <em>đúng y</em> lockfile — hoặc từ chối. Một bạn cùng nhóm thêm <code>dayjs</code> vào <code>package.json</code> bằng tay và quên lockfile:</p>
${ra(LECH)}
<p>Tốt: đỏ <em>trước khi</em> test nào chạy, lý do gọn trong một dòng. <code>npm install</code> sẽ lặng lẽ cài bản nào mà <code>^1.11.13</code> nghĩa là hôm nay rồi test một bộ code không ai có.</p>

<h3>Cache phần tải về</h3>
<p>Thêm <code>cache: npm</code> vào <code>setup-node</code>. Nó lưu <code>~/.npm</code> (bộ đệm tải về, không phải <code>node_modules</code>) dưới một khoá dựng từ mã băm của <code>package-lock.json</code>, và khôi phục ở lần sau:</p>
${ra(AM)}
<table>
<thead><tr><th>Lần chạy (act, laptop này)</th><th><code>npm ci</code></th><th>Cả lượt</th></tr></thead>
<tbody><tr><td>Không cache</td><td>34,8 s</td><td>47 s</td></tr><tr><td><code>cache: npm</code>, lần đầu (trượt, rồi lưu 55 MB)</td><td>49,6 s</td><td>61 s</td></tr><tr><td><code>cache: npm</code>, lần hai (trúng)</td><td>15,0 s</td><td>27 s</td></tr></tbody></table>
<p>Hai lần lạnh lệch nhau 15 s dù chỉ có mạng thay đổi — đo hai lần. Lần ấm nhanh khoảng 3 lần; <code>npm ci</code> vẫn chạy, chỉ thôi tải về. Lockfile mới ⇒ khoá mới ⇒ lại một lần lạnh, và như vậy là đúng.</p>

<h3>Một PostgreSQL thật: service container</h3>
<p>Test tích hợp của Chương 4 cần PostgreSQL 17. Trong CI nó đến dưới dạng <strong>service container</strong> (container dịch vụ): bật cạnh job, được chờ qua health check, rồi bị xoá khi xong. LabFlow Lite vốn đọc <code>TEST_DATABASE_URL</code> (bài 4.2):</p>
${ma('yaml', SERVICE)}
${ra(PG_XANH)}
<div class="pitfall co-tieu-de"><strong>localhost hay tên service?</strong> Tài liệu GitHub (đọc 01/11/2026): job chạy <em>trên runner</em>, như job này, tới service qua <code>localhost:&lt;cổng đã ánh xạ&gt;</code>; nhãn <code>postgres</code> chỉ là tên máy khi chính job chạy trong container. Chép từ một ví dụ dùng container:
${ra(PG_TEN)}
</div>

<h3>Playwright trong CI</h3>
<p>Một máy Ubuntu mới tinh không có Chromium lẫn thư viện hệ thống của nó. Chỉ tải trình duyệt:</p>
${ra(E2E_THIEU)}
<p>Hai test đăng nhập (setup) đỏ và 7 test còn lại không chạy, trong 2,8 s; code test không sai — trình duyệt không khởi động nổi. <code>--with-deps</code> cài thêm các gói Linux (ở đây 64 gói, qua <code>apt-get</code>):</p>
${ra(E2E)}
<p>Năm phút cài đặt cho 3,7 giây test (mạng của laptop này). Tài liệu Playwright: “Caching browser binaries is not recommended”; cách khác là ảnh Docker chính thức của Playwright. Bài 9.3 quyết định khi nào job chậm này chạy.</p>

<h3>Thêm một bẫy: it.only</h3>
<p>Lúc gỡ lỗi, ai đó viết <code>it.only</code> rồi commit luôn. Trên máy người đó:</p>
${ra(ONLY_MAY)}
<p>Xanh — còn test thứ hai, vốn sai, chưa bao giờ chạy. Trong CI, Vitest thấy <code>CI=true</code> (GitHub và act đều đặt biến này) và từ chối:</p>
${ra(ONLY_CI)}
<p>Playwright cũng vậy với <code>forbidOnly: !!process.env.CI</code> (Chương 7): CI thêm những phép kiểm mà người mệt mỏi bỏ qua.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo9/wf/th91-de.yml</code> chưa từng xanh. Chạy <code>actionlint</code>, sửa cái nó báo, chạy act, sửa cái act cho thấy.</p>
<p><strong>Lời giải và output thật.</strong> actionlint tìm ra lỗi thứ nhất (thông báo của nó kết thúc bằng một danh sách nhãn hợp lệ rất dài, nên các dòng được cắt ở 110 ký tự):</p>
${ra(TH_LINT)}
<p>Nếu bỏ qua actionlint, act chẳng cho bạn biết gì có ích — nó bỏ qua job có nhãn runner nó không biết, và vẫn thoát 0:</p>
${ra(TH_0)}
<p>Sửa thành <code>ubuntu-latest</code>, act chạy job và cho thấy lỗi thứ hai:</p>
${ra(TH_1)}
<p>URL đòi CSDL <code>labflow</code>; service tạo <code>labflow_test</code> (<code>POSTGRES_DB</code>). Sửa cả hai (<code>demo9/wf/th91.yml</code>):</p>
${ra(TH_2)}
<p><strong>Xong khi</strong> <code>actionlint</code> không in gì, act kết thúc bằng <code>act exit: 0</code> và <code>Job succeeded</code> sau 11 test tích hợp passed — và bạn nói được lỗi nào actionlint thấy được, lỗi nào chỉ một lần chạy thật mới lộ.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">workflow / job / step (quy trình / việc / bước)</span><span class="v">Một file YAML; các đơn vị chạy song song, mỗi cái một máy; các lệnh bên trong một job.</span></div>
  <div class="kv"><span class="k">runner (máy chạy)</span><span class="v">Cái máy chạy một job; runner của GitHub lần nào cũng mới tinh.</span></div>
  <div class="kv"><span class="k">service container (container dịch vụ)</span><span class="v">Container Docker bật cạnh một job, vd PostgreSQL cho test tích hợp.</span></div>
  <div class="kv"><span class="k">lockfile (tệp khoá phiên bản)</span><span class="v">package-lock.json: đúng các phiên bản npm ci phải cài.</span></div>
  <div class="kv"><span class="k">act / actionlint</span><span class="v">Chạy workflow trên máy bằng Docker / kiểm file workflow tìm lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tổng duyệt trên máy: <code>actionlint</code> cho file, <code>act</code> cho lần chạy — và nhớ act không phải GitHub.</li>
<li><code>npm ci</code> + <code>cache: npm</code>: đúng phiên bản, và ở đây 49,6 s → 15,0 s.</li>
<li>PostgreSQL là một service có health check; trên runner nó là <code>localhost:5432</code>.</li>
<li>Playwright cần <code>--with-deps</code>; cài trình duyệt chiếm gần hết job e2e.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-ci-automation', title: 'Lý thuyết ở SWT301 — 8.6: test pyramid và tích hợp liên tục', sub: 'Giống: CI test mọi thay đổi; đỏ hay xanh do mã thoát quyết định. Sâu thêm ở đây: một workflow Node thật, chạy và đo bằng act.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-1-cache-mua-gi', title: 'Khoá GitHub Actions — 5.1: cache npm mua được gì', sub: 'Ở đó: đo trên runner của GitHub, và vì sao cache node_modules không đáng. Ở đây: cùng cái cache đó trong một workflow test, đo bằng act.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Khoá Node.js — 14.5: độ phủ, test chập chờn và CI', sub: 'Ở đó: CI của cuongthai.com. Ở đây: CI cho dự án của khoá.', cta: 'MỞ BÀI →' })}
</div>
`,
};
