/**
 * Testing · Chương 10B · 10B.5 — Newman trong CI: GitHub Actions, mã thoát, báo cáo JUnit. BÀI MỚI 24/11/2026, slug tst-10b-5-newman-ci.
 * Chạy thật: các bước run: của api-tests.yml trong container node:22 sạch (pmn-ci) — xanh 42/42 exit 0, mật khẩu sai 12 đỏ exit 1, JUnit 42 testcase;
 * --bail dừng sau request 2; server tắt ⇒ ECONNREFUSED 41 đỏ; --suppress-exit-code ⇒ exit 0 dù đỏ. KHÔNG chạy trên GitHub thật (ghi rõ trong bài).
 */
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const lines = (t) => t.split('\n');
const tbl = (out) => lines(out).filter((l) => /│ +(requests|assertions)/.test(l)).join('\n');
const failTable = (out, n) => { const a = lines(out); const i = a.findIndex((l) => l.includes('#  failure')); return a.slice(i, i + 2 + 5 * n).join('\n'); };
const CI_XANH = lines(OUT['b5-ci-xanh']).filter((l) => !/npm notice|::group::/.test(l)).join('\n');
const CI_DO = (() => { const a = lines(OUT['b5-ci-do']).filter((l) => !/npm notice|::group::|^├/.test(l)); const i = a.findIndex((l) => l.includes('#  failure')); const j = a.findIndex((l) => l.startsWith('newman exit code')); return a.slice(0, i + 12).concat(['   …'], a.slice(j, j + 1), a.slice(-2)).join('\n'); })();
const BAIL = lines(OUT['b5-bail'])[0] + '\n' + tbl(OUT['b5-bail']) + '\n' + failTable(OUT['b5-bail'], 1);
const TAT = lines(OUT['b5-tat'])[0] + '\n' + tbl(OUT['b5-tat']) + '\n' + failTable(OUT['b5-tat'], 1);
const TH5 = lines(OUT.th5).filter((l) => /^\$ |❏|↳|✓|^  [0-9]+\. |│ +(requests|assertions)/.test(l)).join('\n');
const TH5_OK = lines(OUT['th5-xanh']).filter((l) => /^\$ |│ +(requests|assertions)/.test(l)).join('\n');
const SUP = lines(OUT['b5-suppress'])[0] + '\n' + tbl(OUT['b5-suppress']);

const FLAGS_EN = `<table>
<thead><tr><th>Flag</th><th>What it does</th><th>Measured here</th></tr></thead>
<tbody>
<tr><td><code>-e file</code> / <code>--env-var k=v</code></td><td>environment / one value in it</td><td>CI passes the password with <code>--env-var</code></td></tr>
<tr><td><code>-d file</code>, <code>-n N</code></td><td>data file, number of iterations</td><td>lesson 10B.4</td></tr>
<tr><td><code>--bail</code></td><td>stop at the first failing request</td><td>2 requests instead of 14</td></tr>
<tr><td><code>--delay-request ms</code></td><td>wait before each request</td><td>lesson 10B.3 (token expiry)</td></tr>
<tr><td><code>--timeout-request ms</code></td><td>give up on a slow response</td><td>keeps a hung API from hanging CI</td></tr>
<tr><td><code>--reporters cli,junit</code></td><td>which reports to write</td><td>JUnit XML with 42 testcases</td></tr>
<tr><td><code>--suppress-exit-code</code></td><td>always exit 0</td><td>red run, exit 0 — avoid in CI</td></tr>
<tr><td><code>--color off</code></td><td>no ANSI colours in logs</td><td>used for every output in this chapter</td></tr>
</tbody></table>`;
const FLAGS_VI = `<table>
<thead><tr><th>Cờ</th><th>Làm gì</th><th>Đo ở đây</th></tr></thead>
<tbody>
<tr><td><code>-e tệp</code> / <code>--env-var k=v</code></td><td>environment / một giá trị trong nó</td><td>CI truyền mật khẩu bằng <code>--env-var</code></td></tr>
<tr><td><code>-d tệp</code>, <code>-n N</code></td><td>tệp dữ liệu, số vòng</td><td>bài 10B.4</td></tr>
<tr><td><code>--bail</code></td><td>dừng ở request đỏ đầu tiên</td><td>2 request thay vì 14</td></tr>
<tr><td><code>--delay-request ms</code></td><td>chờ trước mỗi request</td><td>bài 10B.3 (token hết hạn)</td></tr>
<tr><td><code>--timeout-request ms</code></td><td>bỏ cuộc với phản hồi chậm</td><td>giữ cho API treo không làm treo CI</td></tr>
<tr><td><code>--reporters cli,junit</code></td><td>ghi những báo cáo nào</td><td>JUnit XML có 42 testcase</td></tr>
<tr><td><code>--suppress-exit-code</code></td><td>luôn thoát 0</td><td>lượt đỏ mà exit 0 — tránh dùng trong CI</td></tr>
<tr><td><code>--color off</code></td><td>không mã màu ANSI trong log</td><td>dùng cho mọi output của chương này</td></tr>
</tbody></table>`;

const PV_EN = `<ol>
<li><strong>“How do you run Postman tests in CI?”</strong> Commit the collection and a CI environment file, start the API (or point at a deployed one), run <code>npx newman run … -e ci.json --env-var secret=$SECRET --reporters cli,junit</code>, upload the JUnit file. Newman's exit code fails the job.</li>
<li><strong>“One wrong password and 12 tests are red. How do you read that?”</strong> Read the first failure: everything after the login is a consequence. Consider a <code>--bail</code> or a setup folder whose failure stops the run, so the report shows the cause, not the cascade.</li>
<li><strong>“Postman tests in CI, or Supertest tests in CI?”</strong> Both, at different moments: Supertest on every push (fast, no deploy); Newman as a smoke test after deploy and nightly against staging, because only it tests the real network, proxy, TLS and configuration.</li>
<li><strong>“What would you never upload as a public artifact?”</strong> Full HTML/JSON reports — they contain every request and response, including tokens and passwords (measured in 10B.3).</li>
</ol>`;
const PV_VI = `<ol>
<li><strong>“Chạy test Postman trong CI thế nào?”</strong> Commit collection và một tệp environment cho CI, bật API (hoặc chĩa vào bản đã triển khai), chạy <code>npx newman run … -e ci.json --env-var secret=$SECRET --reporters cli,junit</code>, tải tệp JUnit lên. Mã thoát của Newman làm job đỏ.</li>
<li><strong>“Sai một mật khẩu mà 12 test đỏ. Đọc thế nào?”</strong> Đọc lỗi đầu tiên: mọi thứ sau đăng nhập là hệ quả. Cân nhắc <code>--bail</code> hoặc một folder setup mà đỏ là dừng lượt chạy, để báo cáo chỉ ra nguyên nhân chứ không phải cả dây chuyền.</li>
<li><strong>“Test Postman trong CI hay test Supertest trong CI?”</strong> Cả hai, ở thời điểm khác nhau: Supertest mỗi lần push (nhanh, không cần triển khai); Newman làm smoke test sau triển khai và chạy đêm vào staging, vì chỉ nó kiểm mạng thật, proxy, TLS và cấu hình thật.</li>
<li><strong>“Thứ gì bạn không bao giờ tải lên làm artifact công khai?”</strong> Báo cáo HTML/JSON đầy đủ — chúng chứa mọi request và phản hồi, cả token lẫn mật khẩu (đo ở 10B.3).</li>
</ol>`;

export default {
  title: '10B.5 — Newman in CI: GitHub Actions, exit codes and JUnit reports|||10B.5 — Newman trong CI: GitHub Actions, mã thoát và báo cáo JUnit',
  slug: 'tst-10b-5-newman-ci',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một workflow GitHub Actions bật API ở nền rồi chạy collection bằng npx newman, mật khẩu từ secrets, báo cáo JUnit làm artifact kể cả khi đỏ; các bước run: chạy thật trong container node:22 sạch — xanh 42/42, mật khẩu sai 12 đỏ dây chuyền, exit 1; --bail, server tắt (ECONNREFUSED), --suppress-exit-code; bảng cờ Newman; Newman so với Supertest trong pipeline.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Lesson 10B.5</span>
<h2>Newman in CI: GitHub Actions, exit codes and JUnit reports</h2>
<p class="lead">A collection that only runs when someone clicks <em>Run</em> is a manual test. Chapter 9 put Vitest, Testcontainers and Playwright into GitHub Actions; this lesson adds the Postman collection with Newman — and measures what a red run looks like.</p>

<h3>The workflow</h3>
${ma('yaml', CODE.workflow)}
<p>Five decisions are in there. The API starts in the background and the step waits until <code>/api/health</code> answers, printing the server log if it never does. Newman is pinned (<code>newman@6.2.3</code>) like any dependency. The password comes from <code>secrets</code>, not from the repo. The report step has <code>if: always()</code> — the report matters most when the job is red. And the CI environment file is a third environment next to local and staging:</p>
${ma('json', CODE.ciEnv)}
<p>The YAML parses (checked with the <code>yaml</code> package):</p>
${ra(OUT['b5-yaml'])}

<h3>Running those steps for real</h3>
<p>This chapter was written on a machine without a GitHub runner, so the <code>run:</code> steps of the workflow were executed as they are inside a clean <code>node:22</code> container — a fresh copy of the project, <code>npm ci</code>, the server in the background, <code>npx newman</code> — the same commands a runner executes. (What only GitHub does — checkout, the setup-node cache, uploading the artifact — Chapter 9 measured.) The script:</p>
${ma('bash', CODE.giaCi)}
<p>Green:</p>
${ra(CI_XANH)}
<p>The JUnit file has one <code>testsuite</code> per request and one <code>testcase</code> per assertion — 42 — which is the format GitHub, GitLab and Jenkins all read for “tests” tabs and PR annotations.</p>
<p>Now the same job with the wrong secret, <code>PW=sai</code>:</p>
${ra(CI_DO)}
<p>One wrong value, twelve red lines. The first three are the cause (three logins refused); the other nine are consequences — every request after them had no token. In the JUnit file the cause is in the suite named <code>1 Auth / Login as an</code>. Read red runs top-down and stop at the first failure that is not explained by an earlier one.</p>

<h3>Exit codes, and the flags that change them</h3>
<p>With <code>--bail</code>, Newman stops at the first request with a failure:</p>
${ra(BAIL)}
<p>Two requests, one clear failure, exit 1. When the server is not running at all:</p>
${ra(TAT)}
<p><code>ECONNREFUSED</code> on every request — 41 failed of 41: the collection-level checks still run and fail because there is no response. That is why the workflow's start step must fail loudly by itself. And the flag to avoid:</p>
${ra(SUP)}
<p>Twelve failures, exit code 0 — CI would be green. <code>--suppress-exit-code</code> exists for reporting-only jobs; in a quality gate it turns the gate off.</p>
${FLAGS_EN}
<div class="pitfall co-tieu-de"><p><strong>Trap — testing the wrong server.</strong> If port 4173 on the runner already has something listening (a service container from another step, a leftover server), your start step's <code>curl</code> succeeds against <em>that</em> one. Chapter 9 measured exactly this with a leftover PostgreSQL under act. Check that the health response is yours (for instance, a version field), and use a port nobody else uses.</p></div>

<h3>Where Newman goes in the pipeline</h3>
<ul>
<li><strong>Every push / PR:</strong> Supertest and unit tests (Chapters 1–5) — fast, no server. Optionally the collection against a server started in the job, as above.</li>
<li><strong>After each deploy to staging:</strong> the collection against the deployed URL — catches wrong configuration, a missing environment variable, a proxy that strips the Authorization header. Supertest cannot see any of those.</li>
<li><strong>Nightly:</strong> data-driven runs (10B.4) and the slower security requests (10B.3).</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Make the cascade impossible to misread: change the workflow so that if any login fails, the job stops after the <code>1 Auth</code> folder with a message naming the login.</p>
<details><summary>Solution</summary>
<p>Run the folders as two steps. Step 1: <code>npx newman@6.2.3 run postman/labflow.postman_collection.json -e postman/ci.postman_environment.json --env-var "password=…" --folder "0 Setup" --folder "1 Auth" --bail</code>. Step 2 (only reached if step 1 is green): the full collection. Newman's <code>--folder</code> can be repeated to run several folders. Measured with the wrong password — the job ends at step 1 on the first refused login:</p>
${ra(TH5)}
<p>And with the right password, step 1 is green and step 2 runs:</p>
${ra(TH5_OK)}
</details>
<p><strong>Done when</strong> a wrong password produces a red job whose first red step is called “auth”.</p>
</div>

<h3>In real life</h3>
<p>A smoke test after deploy is the waiter tasting the soup before it leaves the kitchen. The recipe was tested (unit tests); the cook was trained (integration tests); but tonight's pot, with tonight's salt, is only checked by tasting it.</p>
<p><strong>On a project:</strong> your team deploys to the customer's staging every evening; the customer's PM checks it the next morning. A Newman job right after the deploy, posting its JUnit result to the team channel, means the team learns about a broken deploy at 19:05 instead of from the customer at 09:00.</p>

<h3>🎤 What an interviewer will ask</h3>
${PV_EN}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exit code</span><span class="v">0 = all green; non-zero fails the CI step. Newman: 1 on any failure.</span></div>
  <div class="kv"><span class="k">JUnit XML</span><span class="v">The common test report format CI servers read.</span></div>
  <div class="kv"><span class="k">smoke test</span><span class="v">A short check that a deployed system basically works.</span></div>
  <div class="kv"><span class="k">cascade failure</span><span class="v">Many red tests caused by one earlier failure.</span></div>
  <div class="kv"><span class="k">--bail</span><span class="v">Stop the run at the first failing request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Start the API, wait for health, <code>npx newman@6.2.3 run</code> with a CI environment and secrets from the CI store, JUnit report uploaded <code>if: always()</code>.</li>
<li>Measured in a clean container: green 42/42 exit 0; one wrong secret → 12 red, exit 1; server down → ECONNREFUSED on all 41.</li>
<li><code>--bail</code> shows the cause; <code>--suppress-exit-code</code> hides everything.</li>
<li>Newman's real value is after deploy: it tests what Supertest cannot reach.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-9-1-github-actions', title: 'Back to 9.1 — Running tests in GitHub Actions', sub: 'Jobs, services, caches and artifacts, measured with act.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-4-artifact', title: 'GitHub Actions — 5.4: artifacts', sub: 'Who can download them, and for how long.', cta: 'OPEN LESSON →' })}
${nguon('📘', 'Newman — command-line options', 'Every flag, reporters and exit codes.', 'https://github.com/postmanlabs/newman#command-line-options')}
${nguon('📘', 'Postman Docs — Integrate Newman with CI', 'Postman’s own guide for CI with Newman.', 'https://learning.postman.com/docs/collections/using-newman-cli/integration-with-github-actions/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10B · Bài 10B.5</span>
<h2>Newman trong CI: GitHub Actions, mã thoát và báo cáo JUnit</h2>
<p class="lead">Một collection chỉ chạy khi có người bấm <em>Run</em> là một test bằng tay. Chương 9 đã đưa Vitest, Testcontainers và Playwright vào GitHub Actions; bài này thêm collection Postman bằng Newman — và đo xem một lượt chạy đỏ trông thế nào.</p>

<h3>Workflow</h3>
${ma('yaml', CODE.workflow)}
<p>Trong đó có năm quyết định. API bật ở nền và bước này chờ tới khi <code>/api/health</code> trả lời, in log server nếu nó mãi không lên. Newman được ghim phiên bản (<code>newman@6.2.3</code>) như mọi phụ thuộc. Mật khẩu lấy từ <code>secrets</code>, không nằm trong repo. Bước báo cáo có <code>if: always()</code> — báo cáo quan trọng nhất đúng lúc job đỏ. Và tệp environment cho CI là environment thứ ba bên cạnh local và staging:</p>
${ma('json', CODE.ciEnv)}
<p>YAML phân tích được (kiểm bằng gói <code>yaml</code>):</p>
${ra(OUT['b5-yaml'])}

<h3>Chạy thật các bước đó</h3>
<p>Chương này soạn trên một máy không có runner GitHub, nên các bước <code>run:</code> của workflow được chạy nguyên văn trong một container <code>node:22</code> sạch — bản sao mới của dự án, <code>npm ci</code>, server ở nền, <code>npx newman</code> — đúng các lệnh runner sẽ chạy. (Phần chỉ GitHub làm — checkout, cache của setup-node, tải artifact — Chương 9 đã đo.) Script:</p>
${ma('bash', CODE.giaCi)}
<p>Xanh:</p>
${ra(CI_XANH)}
<p>Tệp JUnit có một <code>testsuite</code> cho mỗi request và một <code>testcase</code> cho mỗi assertion — 42 — đúng định dạng GitHub, GitLab và Jenkins đều đọc để hiện thẻ “tests” và chú thích trên PR.</p>
<p>Giờ cùng job đó với secret sai, <code>PW=sai</code>:</p>
${ra(CI_DO)}
<p>Một giá trị sai, mười hai dòng đỏ. Ba dòng đầu là nguyên nhân (ba lần đăng nhập bị từ chối); chín dòng còn lại là hệ quả — mọi request sau đó không có token. Trong tệp JUnit nguyên nhân nằm ở suite tên <code>1 Auth / Login as an</code>. Đọc lượt đỏ từ trên xuống và dừng ở lỗi đầu tiên không được giải thích bởi một lỗi trước nó.</p>

<h3>Mã thoát, và những cờ làm nó đổi</h3>
<p>Với <code>--bail</code>, Newman dừng ở request đầu tiên có lỗi:</p>
${ra(BAIL)}
<p>Hai request, một lỗi rõ ràng, thoát 1. Khi server không chạy chút nào:</p>
${ra(TAT)}
<p><code>ECONNREFUSED</code> ở mọi request — 41 đỏ trên 41: các phép kiểm mức collection vẫn chạy và đỏ vì không có phản hồi. Vì thế bước bật server trong workflow phải tự đỏ to rõ. Còn đây là cờ nên tránh:</p>
${ra(SUP)}
<p>Mười hai lỗi, mã thoát 0 — CI sẽ xanh. <code>--suppress-exit-code</code> dành cho job chỉ để báo cáo; trong một cổng chất lượng nó tắt luôn cổng.</p>
${FLAGS_VI}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — test nhầm server.</strong> Nếu cổng 4173 trên runner đã có thứ gì đang nghe (service container của bước khác, server còn sót), <code>curl</code> trong bước bật server sẽ thành công với <em>cái đó</em>. Chương 9 đã đo đúng chuyện này với một PostgreSQL sót lại dưới act. Kiểm rằng phản hồi health là của bạn (ví dụ một trường phiên bản), và dùng cổng không ai dùng.</p></div>

<h3>Newman đứng ở đâu trong pipeline</h3>
<ul>
<li><strong>Mỗi lần push / PR:</strong> Supertest và unit test (Chương 1–5) — nhanh, không cần server. Tuỳ chọn thêm collection chạy vào server bật ngay trong job, như trên.</li>
<li><strong>Sau mỗi lần triển khai lên staging:</strong> collection chạy vào URL đã triển khai — bắt cấu hình sai, thiếu biến môi trường, proxy làm rơi header Authorization. Supertest không thấy được thứ nào trong số đó.</li>
<li><strong>Hằng đêm:</strong> các lượt hướng dữ liệu (10B.4) và các request bảo mật chậm hơn (10B.3).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Làm cho dây chuyền đỏ không thể đọc nhầm: sửa workflow để nếu bất kỳ lần đăng nhập nào hỏng, job dừng sau folder <code>1 Auth</code> với thông báo gọi đúng tên lần đăng nhập đó.</p>
<details><summary>Lời giải</summary>
<p>Chạy các folder thành hai bước. Bước 1: <code>npx newman@6.2.3 run postman/labflow.postman_collection.json -e postman/ci.postman_environment.json --env-var "password=…" --folder "0 Setup" --folder "1 Auth" --bail</code>. Bước 2 (chỉ tới được khi bước 1 xanh): cả collection. Cờ <code>--folder</code> của Newman lặp lại được để chạy nhiều folder. Đo với mật khẩu sai — job kết thúc ở bước 1, ngay lần đăng nhập bị từ chối đầu tiên:</p>
${ra(TH5)}
<p>Còn với mật khẩu đúng, bước 1 xanh và bước 2 được chạy:</p>
${ra(TH5_OK)}
</details>
<p><strong>Xong khi</strong> mật khẩu sai cho ra một job đỏ mà bước đỏ đầu tiên tên là “auth”.</p>
</div>

<h3>Liên hệ đời thường</h3>
<p>Smoke test sau triển khai là người phục vụ nếm nồi canh trước khi bưng ra. Công thức đã được thử (unit test); đầu bếp đã được huấn luyện (integration test); nhưng nồi canh tối nay, với muối tối nay, chỉ kiểm được bằng cách nếm.</p>
<p><strong>Ở dự án:</strong> đội bạn triển khai lên staging của khách mỗi tối; PM bên khách kiểm vào sáng hôm sau. Một job Newman chạy ngay sau triển khai, gửi kết quả JUnit vào kênh của đội, nghĩa là đội biết bản triển khai hỏng lúc 19:05 thay vì nghe khách báo lúc 9:00.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${PV_VI}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">0 = xanh hết; khác 0 làm bước CI đỏ. Newman: 1 khi có bất kỳ lỗi nào.</span></div>
  <div class="kv"><span class="k">JUnit XML</span><span class="v">Định dạng báo cáo test chung mà các máy chủ CI đọc.</span></div>
  <div class="kv"><span class="k">smoke test (test khói)</span><span class="v">Một phép kiểm ngắn rằng hệ thống đã triển khai về cơ bản chạy được.</span></div>
  <div class="kv"><span class="k">cascade failure (đỏ dây chuyền)</span><span class="v">Nhiều test đỏ do một lỗi trước đó gây ra.</span></div>
  <div class="kv"><span class="k">--bail</span><span class="v">Dừng lượt chạy ở request đỏ đầu tiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bật API, chờ health, <code>npx newman@6.2.3 run</code> với environment CI và bí mật từ kho của CI, báo cáo JUnit tải lên với <code>if: always()</code>.</li>
<li>Đo trong container sạch: xanh 42/42 exit 0; một secret sai → 12 đỏ, exit 1; server tắt → ECONNREFUSED ở cả 41.</li>
<li><code>--bail</code> cho thấy nguyên nhân; <code>--suppress-exit-code</code> giấu tất cả.</li>
<li>Giá trị thật của Newman là sau triển khai: nó kiểm thứ Supertest không với tới.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-9-1-github-actions', title: 'Quay lại 9.1 — Chạy test trong GitHub Actions', sub: 'Job, service, cache và artifact, đo bằng act.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-4-artifact', title: 'Khoá GitHub Actions — 5.4: artifact', sub: 'Ai tải được chúng, và giữ trong bao lâu.', cta: 'MỞ BÀI →' })}
${nguon('📘', 'Newman — command-line options', 'Mọi cờ, reporter và mã thoát.', 'https://github.com/postmanlabs/newman#command-line-options')}
${nguon('📘', 'Postman Docs — Integrate Newman with CI', 'Hướng dẫn của chính Postman cho CI với Newman.', 'https://learning.postman.com/docs/collections/using-newman-cli/integration-with-github-actions/')}
</div>
`,
};
