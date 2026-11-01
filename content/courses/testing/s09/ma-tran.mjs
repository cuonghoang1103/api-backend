/**
 * Testing · Chương 9 · 9.4 — Ma trận và chia nhỏ test trong CI. Slug giữ từ khung: tst-9-4-ma-tran.
 * Chạy thật bằng act 0.2.94: ma trận Node 20/22/24 — Node 20.20.2 đỏ 4/116 (mailer.test.js: MSW 3 dùng Promise.withResolvers và
 * Set.prototype.intersection), 66 cảnh báo EBADENGINE mà npm ci vẫn xanh; Node 22.23.4 và 24.22.2 116 passed; fail-fast mặc định
 * KHÔNG huỷ nhánh Node 24 đang chạy trong act (GitHub huỷ — tài liệu); package.json engines >=22.12, ma trận [22, 24].
 * Shard: bộ chậm demo9/cham 10,56 s nối tiếp; --shard=i/3 của Vitest 5,71/1,18/3,72 s; chia theo thời gian (src/ci/shard.js)
 * 3,69/3,70/3,19 s; trong CI 3 shard + gộp blob = 147 s, một job = 36 s. concurrency = tài liệu.
 */
import G from '../giang/tst-09-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const MT = OUT['94-ma-tran'];
const MT_KQ = loc(MT, /^\$ |\| v2\d\.|Caused by: TypeError: Promise|intersection is not|Tests {2}|Main npm run test:unit|^Error|act exit/);
const MT_ENGINE = MT.split('\n').filter((l) => /Node 20.*EBADENGINE/.test(l)).slice(0, 5).join('\n');
const MT_THU_TU = loc(MT, /(Node 20|Node 24).*(Failure - Main npm run test:unit|Success - Main npm run test:unit|Main actions\/setup-node|Job (succeeded|failed))/);
const SH_VITEST = OUT['94-shard-vitest'];
const SH_TA = OUT['94-shard-ta'];
const SH_CI = loc(OUT['94-shard-ci'], /^\$ |Success - Main npm ci|Success - Main tests of this shard|Per blob|Tests {2}6 passed|Job succeeded|act exit|wall time/);
const MOT = loc(OUT['94-mot-job'], /^\$ |Success - Main npm ci|Duration|Job succeeded|act exit|wall time/);
const TH_V = OUT['94-th-vitest'];
const TH_T = OUT['94-th-ta'];
const SPLIT = CODE.shard.split('\n').slice(5, 17).join('\n');
const CONC = CODE.testYml.split('\n').slice(13, 16).join('\n');
const SHARD_STEP = CODE.wf94Shard.split('\n').slice(19, 31).join('\n');

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Timings</div><div class="lz-d">a JSON report of an earlier run: how long each test file took</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Split</div><div class="lz-d">longest file first, into the lightest shard (scripts/shard.mjs i/n)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">N jobs</div><div class="lz-d">a matrix [1, 2, 3]; each runs its files and writes a blob report</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Artifacts</div><div class="lz-d">blob-1, blob-2, blob-3 — one name per shard</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Merge</div><div class="lz-d">one job downloads all blobs: vitest --merge-reports → one report</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Thời gian</div><div class="lz-d">báo cáo JSON của một lần chạy trước: mỗi file test mất bao lâu</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chia</div><div class="lz-d">file lâu nhất trước, vào shard nhẹ nhất (scripts/shard.mjs i/n)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">N job</div><div class="lz-d">một matrix [1, 2, 3]; mỗi job chạy file của mình và ghi báo cáo blob</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Artifact</div><div class="lz-d">blob-1, blob-2, blob-3 — mỗi shard một tên</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Gộp</div><div class="lz-d">một job tải mọi blob về: vitest --merge-reports → một báo cáo</div></div>
</div>`;


const NGUON = [
  nguon('🧮', 'GitHub Docs — Running variations of jobs', 'matrix, include/exclude, fail-fast, continue-on-error per leg (read 01/11/2026).', 'https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations'),
  nguon('🎭', 'Playwright — Sharding', '--shard=x/y, blob reporter, merge-reports in GitHub Actions.', 'https://playwright.dev/docs/test-sharding'),
].join('\n');

export default {
  title: '9.4 — Matrix and sharding in CI|||9.4 — Ma trận và chia nhỏ test trong CI',
  slug: 'tst-9-4-ma-tran',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chạy cùng bộ test trên nhiều bản Node và chia một bộ chậm ra nhiều máy, đo bằng act: Node 20 đỏ 4/116 vì MSW 3 cần Promise.withResolvers (66 cảnh báo EBADENGINE mà npm ci vẫn xanh) ⇒ engines >=22.12 và ma trận [22, 24]; fail-fast trong act không huỷ nhánh đang chạy (GitHub có — tài liệu); continue-on-error cho nhánh thử nghiệm; shard theo thời gian (5,71 s → 3,70 s) với báo cáo blob gộp lại; và cái giá: 3 shard 147 s so với một job 36 s; concurrency huỷ lần chạy cũ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Matrix and sharding in CI</h2>
<p class="lead">Two questions every growing project meets: “does it still work on the next Node version?” and “the tests take 20 minutes — can CI split them?”. Both are answered with a matrix. This lesson measures both on LabFlow Lite — and finds a real incompatibility, and a case where splitting makes CI slower.</p>
<p><strong>After this lesson you can</strong> test on several Node versions and read what differs, decide which versions to support and write it down, choose <code>fail-fast</code> and <code>continue-on-error</code> on purpose, split a slow suite into shards balanced by time and merge their reports, and cancel outdated runs. <strong>Why it is useful:</strong> Node versions reach end-of-life every year, and a suite that takes too long stops being run — both end in bugs reaching users.</p>

<h3>A matrix of Node versions</h3>
<p>One job, three versions: <code>strategy.matrix.node: [20, 22, 24]</code> and <code>node-version: &#36;{{ matrix.node }}</code>. GitHub (and act) start one job per value. The unit suite, filtered:</p>
${ra(MT_KQ)}
<p>Node 22 and 24: 116 passed. Node 20: 4 failed, all in <code>mailer.test.js</code>. The cause is not our code: MSW 3, which fakes the e-mail provider in those tests (lesson 3.2), calls <code>Promise.withResolvers</code> and <code>Set.prototype.intersection</code>, which Node 20 does not have. <code>npm ci</code> had warned — 66 times — and still exited 0:</p>
${ra(MT_ENGINE)}
<p>That is what a matrix is for: one run shows the exact line where a version stops working. The decision is a team decision, written down: nodejs.org lists Node.js 20 as end-of-life (read 01/11/2026), and Vitest 5 itself declares <code>node: ^22.12.0 || ^24.0.0 || &gt;=26.0.0</code>. So LabFlow Lite’s <code>package.json</code> now says <code>"engines": { "node": "&gt;=22.12" }</code> and the matrix is <code>[22, 24]</code> — a test in <code>src/ci/workflow.test.js</code> keeps the two in agreement.</p>
<div class="pitfall co-tieu-de"><strong>EBADENGINE is only a warning.</strong> npm installs anyway, and the failure shows up later as a strange runtime error (<code>Promise.withResolvers is not a function</code>, deep inside a library). The CI of cuongthai.com itself (<code>ci-lint.yml</code>) carries a comment about the same function, needed by a PDF library — it happens in real projects.</div>

<h3>fail-fast: what happens to the other legs</h3>
<p>GitHub’s documentation: <code>fail-fast</code> “defaults to true”, and then “GitHub will cancel all in-progress and queued jobs in the matrix if any job in the matrix fails”. act does not do that. The order of events in the same run:</p>
${ra(MT_THU_TU)}
<p>Node 20 failed while Node 24 was still downloading Node; act let Node 24 finish (116 passed) — and then still printed “Job failed” for it, because it reports the matrix as one job. On GitHub, Node 24 would have been cancelled, and you would not know whether Node 24 works. For a compatibility matrix you want every answer, so the reference workflow sets <code>fail-fast: false</code>; for a matrix of shards, cancelling early saves minutes.</p>
<div class="pitfall co-tieu-de"><strong>continue-on-error on the whole matrix hides red legs.</strong> To try a new version without blocking, mark only that leg: <code>include: [{ node: 26, experimental: true }]</code> and <code>continue-on-error: &#36;{{ matrix.experimental == true }}</code> (pattern from GitHub’s documentation). <code>continue-on-error: true</code> on the job turns every red leg green — rule R8 of Lab 9 refuses it.</div>

<h3>Sharding: split by time, not by file</h3>
<p>LabFlow Lite’s suites are fast, so <code>demo9/cham/</code> stands in for a slow integration suite: six files that share one database and run one after another, 10.56 s in total (3, 3, 2.5 and three 0.5 s files). Vitest’s <code>--shard=i/n</code> splits by file, not by time:</p>
${ra(SH_VITEST)}
<p>5.71 s, 1.18 s, 3.72 s: the CI run waits for the slowest shard. <code>src/ci/shard.js</code> uses the timings of an earlier run (a Vitest JSON report) — longest file first, each into the shard with the least work so far:</p>
${ma('javascript', SPLIT)}
${ra(SH_TA)}
<p>3.69, 3.70, 3.19 s — the slowest shard 2 s shorter. The same split must come out on every machine, which is why ties are broken by file name (a test in <code>shard.test.js</code> feeds the files in reverse order and expects the same shards).</p>
${FLOW_EN}
${ma('yaml', SHARD_STEP)}
${ra(SH_CI)}
<p>The merged report printed “Per blob 4.02s 3.91s 3.50s”: the split worked. And the whole run took 147 seconds. The same suite in one job:</p>
${ra(MOT)}
<p><strong>36 seconds against 147.</strong> Each shard is a new machine that pays checkout, Node and <code>npm ci</code> again (34–41 s each here, three at once on one laptop), plus a merge job. Sharding pays off only when the tests take much longer than that setup — and on GitHub, where the shards are different machines, the arithmetic is the same per job. The e2e job of lesson 9.1 is the extreme: 3.7 s of tests after 5 minutes of browser install; two Playwright shards would pay that install twice. Measure first (lesson 8.4), shard last.</p>

<h3>concurrency: stop paying for old runs</h3>
${ma('yaml', CONC)}
<p>Push three commits to a pull request in a minute and, without this, three full runs compete for runners. With it, a new run in the same group cancels the one in progress (GitHub’s documentation, which uses <code>github.head_ref || github.run_id</code> for the same purpose). We cancel only for pull requests: a run on <code>main</code> is the record of what was merged and should finish. act accepted the key, but on one laptop there is no second run to cancel — this part is documentation, not a measurement.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Split <code>demo9/cham</code> into <strong>two</strong> shards, once with Vitest’s <code>--shard</code> and once with <code>scripts/shard.mjs</code>. Which is faster, by how much, and what is the best possible slowest shard with these six files?</p>
<p><strong>Solution and real output:</strong></p>
${ra(TH_V)}
${ra(TH_T)}
<p>Vitest: 6.28 s / 4.26 s. By time: 5.67 s / 4.85 s — 0.6 s less on the slowest shard. The best possible is 5.5 s: the two 3 s files cannot share a shard, and whichever gets the 2.5 s file reaches 5.5 s.</p>
<p><strong>Done when</strong> you have both measurements and can say why the timings file must be refreshed when tests are added (a new file costs <code>UNKNOWN_MS</code> = 1 s until it has a real time).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">matrix (ma trận)</span><span class="v">One job definition run once per combination of values (Node versions, OS, shards).</span></div>
  <div class="kv"><span class="k">fail-fast</span><span class="v">Cancel the other legs when one fails (default true on GitHub).</span></div>
  <div class="kv"><span class="k">engines</span><span class="v">The Node versions a package supports, in package.json.</span></div>
  <div class="kv"><span class="k">shard (mảnh)</span><span class="v">One of n slices of the test files, run on its own machine.</span></div>
  <div class="kv"><span class="k">blob report</span><span class="v">A raw result file per shard, merged later with --merge-reports.</span></div>
  <div class="kv"><span class="k">concurrency group (nhóm đồng thời)</span><span class="v">Runs that cancel or queue each other.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A matrix found a real break: Node 20 fails 4 tests through a library — support ≥22.12, say so in <code>engines</code>.</li>
<li><code>fail-fast: false</code> for compatibility; act does not cancel legs, GitHub does.</li>
<li>Never <code>continue-on-error: true</code> on a whole matrix; mark experimental legs only.</li>
<li>Shard by time, merge blob reports — and only when the tests dwarf the setup: 147 s sharded vs 36 s in one job here.</li>
<li><code>concurrency</code> cancels outdated PR runs; let runs on main finish.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'github-actions', bai: 'ga-2-5-ma-tran', title: 'GitHub Actions course — 2.5: the matrix', sub: 'There: fail-fast measured on GitHub’s runners. Here: a matrix that finds a real Node 20 break, and shards balanced by time.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-7-2-concurrency', title: 'GitHub Actions course — 7.2: concurrency', sub: 'There: cancel-in-progress set two opposite ways, and why. Here: cancel old PR test runs, never on main.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Ma trận và chia nhỏ test trong CI</h2>
<p class="lead">Hai câu hỏi mà dự án nào lớn lên cũng gặp: “nó còn chạy trên bản Node kế tiếp không?” và “test chạy 20 phút — CI chia nhỏ được không?”. Cả hai được trả lời bằng một matrix. Bài này đo cả hai trên LabFlow Lite — và tìm ra một chỗ không tương thích thật, và một trường hợp chia nhỏ làm CI chậm hơn.</p>
<p><strong>Sau bài này bạn có thể</strong> test trên nhiều bản Node và đọc ra chỗ khác nhau, quyết định hỗ trợ bản nào và ghi nó ra, chọn <code>fail-fast</code> và <code>continue-on-error</code> có chủ đích, chia một bộ test chậm thành các shard cân theo thời gian và gộp báo cáo, và huỷ các lần chạy đã lỗi thời. <strong>Vì sao hữu ích:</strong> năm nào cũng có bản Node hết hạn hỗ trợ, và một bộ test chạy quá lâu sẽ thôi được chạy — cả hai đều kết thúc bằng bug tới tay người dùng.</p>

<h3>Một matrix các bản Node</h3>
<p>Một job, ba bản: <code>strategy.matrix.node: [20, 22, 24]</code> và <code>node-version: &#36;{{ matrix.node }}</code>. GitHub (và act) bật mỗi giá trị một job. Bộ unit, đã lọc:</p>
${ra(MT_KQ)}
<p>Node 22 và 24: 116 passed. Node 20: 4 failed, đều trong <code>mailer.test.js</code>. Nguyên nhân không nằm trong code của ta: MSW 3, thứ giả nhà cung cấp email trong các test đó (bài 3.2), gọi <code>Promise.withResolvers</code> và <code>Set.prototype.intersection</code>, mà Node 20 không có. <code>npm ci</code> đã cảnh báo — 66 lần — mà vẫn thoát 0:</p>
${ra(MT_ENGINE)}
<p>Đó là việc của matrix: một lần chạy chỉ ra đúng dòng mà một phiên bản ngừng chạy được. Quyết định là của cả nhóm, và được ghi ra: nodejs.org liệt kê Node.js 20 là end-of-life (đọc 01/11/2026), và chính Vitest 5 khai báo <code>node: ^22.12.0 || ^24.0.0 || &gt;=26.0.0</code>. Vì vậy <code>package.json</code> của LabFlow Lite giờ ghi <code>"engines": { "node": "&gt;=22.12" }</code> và matrix là <code>[22, 24]</code> — một test trong <code>src/ci/workflow.test.js</code> giữ hai chỗ này khớp nhau.</p>
<div class="pitfall co-tieu-de"><strong>EBADENGINE chỉ là cảnh báo.</strong> npm vẫn cài, và cái hỏng lộ ra sau dưới dạng một lỗi lúc chạy rất lạ (<code>Promise.withResolvers is not a function</code>, nằm sâu trong một thư viện). Chính CI của cuongthai.com (<code>ci-lint.yml</code>) có một chú thích về cùng hàm đó, do một thư viện PDF cần — chuyện này xảy ra ở dự án thật.</div>

<h3>fail-fast: chuyện gì xảy ra với các nhánh còn lại</h3>
<p>Tài liệu GitHub: <code>fail-fast</code> “defaults to true”, và khi đó “GitHub will cancel all in-progress and queued jobs in the matrix if any job in the matrix fails”. act không làm vậy. Thứ tự sự kiện trong cùng lần chạy:</p>
${ra(MT_THU_TU)}
<p>Node 20 đỏ khi Node 24 còn đang tải Node; act để Node 24 chạy xong (116 passed) — rồi vẫn in “Job failed” cho nó, vì act báo cả matrix như một job. Trên GitHub, Node 24 sẽ bị huỷ, và bạn không biết Node 24 có chạy được không. Với matrix tương thích bạn muốn mọi câu trả lời, nên workflow tham khảo đặt <code>fail-fast: false</code>; với matrix các shard, huỷ sớm tiết kiệm được vài phút.</p>
<div class="pitfall co-tieu-de"><strong>continue-on-error trên cả matrix che mọi nhánh đỏ.</strong> Muốn thử một bản mới mà không chặn ai, chỉ đánh dấu nhánh đó: <code>include: [{ node: 26, experimental: true }]</code> và <code>continue-on-error: &#36;{{ matrix.experimental == true }}</code> (mẫu trong tài liệu GitHub). <code>continue-on-error: true</code> trên cả job biến mọi nhánh đỏ thành xanh — luật R8 của Lab 9 từ chối điều đó.</div>

<h3>Chia shard: theo thời gian, không theo file</h3>
<p>Các bộ test của LabFlow Lite chạy nhanh, nên <code>demo9/cham/</code> đóng vai một bộ test tích hợp chậm: sáu file dùng chung một CSDL và chạy lần lượt, tổng 10,56 s (3, 3, 2,5 và ba file 0,5 s). <code>--shard=i/n</code> của Vitest chia theo file, không theo thời gian:</p>
${ra(SH_VITEST)}
<p>5,71 s, 1,18 s, 3,72 s: lần chạy CI phải chờ shard chậm nhất. <code>src/ci/shard.js</code> dùng thời gian của một lần chạy trước (báo cáo JSON của Vitest) — file lâu nhất trước, mỗi file vào shard đang ít việc nhất:</p>
${ma('javascript', SPLIT)}
${ra(SH_TA)}
<p>3,69, 3,70, 3,19 s — shard chậm nhất ngắn đi 2 s. Máy nào cũng phải ra cùng một cách chia, vì vậy khi bằng nhau thì xếp theo tên file (một test trong <code>shard.test.js</code> đưa các file theo thứ tự ngược và mong ra đúng các shard đó).</p>
${FLOW_VI}
${ma('yaml', SHARD_STEP)}
${ra(SH_CI)}
<p>Báo cáo gộp in “Per blob 4.02s 3.91s 3.50s”: cách chia hoạt động. Và cả lượt mất 147 giây. Cùng bộ test trong một job:</p>
${ra(MOT)}
<p><strong>36 giây so với 147.</strong> Mỗi shard là một máy mới phải trả lại checkout, Node và <code>npm ci</code> (ở đây 34–41 s mỗi cái, ba cái cùng lúc trên một laptop), cộng thêm một job gộp. Chia shard chỉ có lời khi test chạy lâu hơn hẳn phần dựng máy đó — trên GitHub, nơi các shard là những máy khác nhau, phép tính cho mỗi job vẫn y như vậy. Job e2e của bài 9.1 là ví dụ cực đoan: 3,7 s test sau 5 phút cài trình duyệt; hai shard Playwright sẽ trả phần cài đó hai lần. Đo trước (bài 8.4), chia shard sau cùng.</p>

<h3>concurrency: thôi trả tiền cho lần chạy cũ</h3>
${ma('yaml', CONC)}
<p>Push ba commit vào một pull request trong một phút mà không có khối này thì ba lần chạy đầy đủ tranh nhau runner. Có nó, một lần chạy mới trong cùng nhóm huỷ lần đang chạy (tài liệu GitHub, vốn dùng <code>github.head_ref || github.run_id</code> cho cùng mục đích). Ta chỉ huỷ với pull request: một lần chạy trên <code>main</code> là bản ghi của thứ đã được merge và nên chạy cho xong. act nhận khoá này, nhưng trên một laptop không có lần chạy thứ hai nào để huỷ — phần này là tài liệu, không phải số đo.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Chia <code>demo9/cham</code> thành <strong>hai</strong> shard, một lần bằng <code>--shard</code> của Vitest và một lần bằng <code>scripts/shard.mjs</code>. Cách nào nhanh hơn, nhanh hơn bao nhiêu, và shard chậm nhất tốt nhất có thể là bao nhiêu với sáu file này?</p>
<p><strong>Lời giải và output thật:</strong></p>
${ra(TH_V)}
${ra(TH_T)}
<p>Vitest: 6,28 s / 4,26 s. Theo thời gian: 5,67 s / 4,85 s — shard chậm nhất ngắn đi 0,6 s. Tốt nhất có thể là 5,5 s: hai file 3 s không thể chung một shard, và shard nào nhận file 2,5 s cũng chạm 5,5 s.</p>
<p><strong>Xong khi</strong> bạn có cả hai số đo và giải thích được vì sao phải làm mới file thời gian khi thêm test (một file mới tính <code>UNKNOWN_MS</code> = 1 s cho tới khi có thời gian thật).</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">matrix (ma trận)</span><span class="v">Một định nghĩa job chạy một lần cho mỗi tổ hợp giá trị (bản Node, hệ điều hành, shard).</span></div>
  <div class="kv"><span class="k">fail-fast</span><span class="v">Huỷ các nhánh còn lại khi một nhánh đỏ (mặc định true trên GitHub).</span></div>
  <div class="kv"><span class="k">engines</span><span class="v">Các bản Node mà một gói hỗ trợ, ghi trong package.json.</span></div>
  <div class="kv"><span class="k">shard (mảnh)</span><span class="v">Một trong n phần của các file test, chạy trên một máy riêng.</span></div>
  <div class="kv"><span class="k">blob report</span><span class="v">File kết quả thô của mỗi shard, gộp lại sau bằng --merge-reports.</span></div>
  <div class="kv"><span class="k">concurrency group (nhóm đồng thời)</span><span class="v">Các lần chạy huỷ hoặc xếp hàng chờ nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một matrix tìm ra chỗ hỏng thật: Node 20 đỏ 4 test qua một thư viện — hỗ trợ ≥22.12, ghi ra trong <code>engines</code>.</li>
<li><code>fail-fast: false</code> cho matrix tương thích; act không huỷ nhánh, GitHub thì có.</li>
<li>Đừng bao giờ <code>continue-on-error: true</code> trên cả matrix; chỉ đánh dấu nhánh thử nghiệm.</li>
<li>Chia shard theo thời gian, gộp báo cáo blob — và chỉ khi test lâu hơn hẳn phần dựng máy: ở đây chia shard 147 s, một job 36 s.</li>
<li><code>concurrency</code> huỷ lần chạy PR đã cũ; để lần chạy trên main chạy xong.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'github-actions', bai: 'ga-2-5-ma-tran', title: 'Khoá GitHub Actions — 2.5: matrix', sub: 'Ở đó: fail-fast đo trên runner của GitHub. Ở đây: một matrix tìm ra chỗ hỏng thật của Node 20, và shard cân theo thời gian.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-7-2-concurrency', title: 'Khoá GitHub Actions — 7.2: concurrency', sub: 'Ở đó: cancel-in-progress đặt hai cách ngược nhau, và vì sao. Ở đây: huỷ lần chạy test PR đã cũ, không bao giờ trên main.', cta: 'MỞ BÀI →' })}
</div>
`,
};
