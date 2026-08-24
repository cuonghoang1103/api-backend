const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Mục 0: CI thật ra giải quyết vấn đề gì.
 * Số đo lấy từ chính kho api-backend: 11 workflow, 2.343 lần chạy.
 */

export default {
  title: 'Section 0 — What CI actually solves|||Mục 0 — CI thật ra giải quyết vấn đề gì',
  slug: 'ga-muc0-intro',
  description: 'Bốn bài dựng lại vấn đề trước khi dựng lời giải: vì sao "chạy được trên máy tôi" là một câu nói KHÔNG kiểm chứng được, và một cỗ máy chạy mã trên máy người khác thì mua được điều gì.',
  sortOrder: 1,
  lessons: [

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — "It works on my machine" is not a claim you can check|||0.1 — "Máy tôi chạy được" KHÔNG phải một lời khẳng định kiểm chứng được',
      slug: 'ga-0-1-may-toi-chay-duoc',
      type: 'VIDEO',
      description: 'Một bản dựng xanh trong 20 giây trên máy nhà và thoát 134 trên runner macOS. Đó là một lần chạy THẬT trong kho này, và nó là toàn bộ lý do CI tồn tại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>"It works on my machine" is not a claim you can check</h2>
<p class="lead">Every measurement in this course comes from one real repository — the one this course is written in — with 11 workflows, 1,394 lines of YAML, and <strong>2,343 real runs</strong> read back through GitHub&#39;s API. This lesson starts with the run that failed.</p>

<h3>The failure</h3>
<p>Run 32400097927, a desktop release build. The commit message records what happened, and it is worth reading in full because it is the shape of the problem CI exists to solve:</p>

<div class="out">vite build thoat 134 tren runner macOS voi
  FATAL ERROR: Reached heap limit — JavaScript heap out of memory

May nha dung XANH trong 20 giay, nen loi CHI lo ra o CI.</div>

<div class="callout warn">
<p><strong>Twenty seconds green locally, exit 134 on the runner.</strong> Nothing was wrong with the code in a way any local check could see. The difference was the machine: a different amount of memory, a different default heap size, and 51,000 newly added lines that pushed one of them over a line the other never came near.</p>
</div>

<p>Chapter 8 of this author&#39;s Deploy VPS course measured exit 134 from the other direction — it is V8&#39;s own heap limit, which is a <em>better</em> failure than the OOM killer&#39;s 137 because it comes with a stack trace. Here it is the same signal doing the job CI is for: telling you about a machine that is not yours.</p>

<h3>What the fix was, and what it proves</h3>
<div class="out">Hai viec, can CA HAI:
  • build:renderer chay qua node --max-old-space-size=6144
  • ban do nguon TAT khi co bien CI (sourcemap: !process.env.CI)

Do that o heap bi bop 1600MB — khong doan:
  co ban do nguon  → exit 134, dung loi cua CI
  khong            → exit 0</div>

<p>Notice the second line of the fix: <code>!process.env.CI</code>. The build behaves differently <em>because it is running in CI</em> — source maps are generated locally and skipped on the runner, because <code>electron-builder</code> excludes them from the installer anyway. CI was spending memory to produce something it immediately discarded.</p>

<h3>The claim CI can actually make</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">"it works on my machine"</span><span class="lz-t">unfalsifiable</span><span class="lz-d">nobody else has your machine, your node version, your leftover node_modules, or your uncommitted file</span></div>
<div class="lz-step"><span class="lz-k">"it works from a clean checkout"</span><span class="lz-t">checkable</span><span class="lz-d">and the only way to check it is to actually do it, somewhere else, every time</span></div>
</div>

<p>That is the whole idea. CI is not a quality tool, a testing tool, or a deployment tool — those are things you can <em>put</em> in it. CI is a machine that answers one question honestly: <strong>does this commit, alone, from nothing, do what you say it does?</strong></p>

<h3>The four things a local check cannot see</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a file you did not commit</span><span class="lz-lnote">the most common one by a distance. It works locally because the file is there; it is not in the repository</span></div>
<div class="lz-layer"><span class="lz-lname">a dependency you installed once</span><span class="lz-lnote">globally, months ago, and never added to <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">a different machine</span><span class="lz-lnote">measured in this course: the same <code>npm ci</code> takes 38 s on Linux and 107 s on Windows; the same build takes 149 s on Linux and 315 s on macOS</span></div>
<div class="lz-layer"><span class="lz-lname">a step you skipped</span><span class="lz-lnote">because you knew it would pass. CI does not know that and runs it anyway</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — CI proves the commit works, not that the code is correct.</strong> A green run means every command you listed exited 0 on a clean checkout. If your workflow runs a type-check and no tests, green means the types are consistent — and nothing else. This repository&#39;s own CI is explicit about the distinction: some steps are labelled <code>(required)</code> and one is <code>continue-on-error: true</code>, which means its failure is visible and does not stop the build. Knowing exactly what your green means is more useful than making it greener.</p>
</div>

<h3>What this repository actually gates on</h3>
<p>From <code>ci-lint.yml</code>, unedited:</p>

<pre><code>- name: TypeScript type-check (required)
  run: npx tsc --noEmit
- name: Interview grader eval — golden set (required)
  run: npm run eval:grader
- name: CV linter eval — golden set (required)
  run: npm run eval:cv-linter
- name: Unit tests — money math + payment signature (required)
  run: npm test
- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>Four gates and one report. The comment on the type-check step explains a choice most workflows leave implicit:</p>

<div class="out"># 22 matches the production runtime (node:22-alpine) and is required
# by the CV PDF round-trip test in &#96;npm test&#96; (unpdf needs
# Promise.withResolvers, a Node 22 feature).</div>

<p>The CI node version is 22 <em>because production is 22</em>. A CI that tests a different runtime than production is answering a question nobody asked.</p>

<div class="callout ok">
<p><strong>The one sentence version.</strong> CI turns "I think this works" into "this worked, on a clean machine, at 06:03:42, and here is the log". Everything else in this course — triggers, jobs, expressions, caches, matrices — is machinery for making that answer arrive faster and mean more.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Understanding GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/understanding-github-actions — the vocabulary (workflow, job, step, action, runner) this course uses throughout.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Continuous Integration</span><span class="lc-sub">martinfowler.com/articles/continuousIntegration.html — the 2006 article that named the practice, and still the clearest statement of why integrating often is cheaper than integrating well.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib — and the note that the default is derived from available system memory, which is exactly why the local machine and the runner disagreed.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — exit 137, exit 134, and what the kernel writes down</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same exit codes measured from the server side, including why 134 is the more useful failure.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>"Máy tôi chạy được" KHÔNG phải một lời khẳng định kiểm chứng được</h2>
<p class="lead">Mọi số đo trong khoá này tới từ MỘT kho thật — chính cái kho khoá học này được viết trong đó — với 11 workflow, 1.394 dòng YAML, và <strong>2.343 lần chạy THẬT</strong> đọc ngược về qua API của GitHub. Bài này bắt đầu bằng cái lần chạy HỎNG.</p>

<h3>Cú hỏng</h3>
<p>Lần chạy 32400097927, một bản dựng phát hành desktop. Dòng commit ghi lại chuyện đã xảy ra, và nó đáng đọc trọn vẹn vì nó chính là hình dạng của vấn đề mà CI sinh ra để giải:</p>

<div class="out">vite build thoat 134 tren runner macOS voi
  FATAL ERROR: Reached heap limit — JavaScript heap out of memory

May nha dung XANH trong 20 giay, nen loi CHI lo ra o CI.</div>

<div class="callout warn">
<p><strong>Hai mươi giây xanh ở máy nhà, thoát 134 trên runner.</strong> Chẳng có gì sai trong mã theo cái kiểu mà bất kỳ phép kiểm cục bộ nào nhìn thấy được. Khác biệt nằm ở CÁI MÁY: một lượng bộ nhớ khác, một kích thước heap mặc định khác, và 51.000 dòng mã vừa thêm đẩy một trong hai vượt qua cái vạch mà cái kia còn chưa tới gần.</p>
</div>

<p>Chương 8 của khoá Deploy VPS cùng tác giả đã đo mã thoát 134 từ hướng ngược lại — nó là giới hạn heap của chính V8, và đó là một cú hỏng <em>TỐT HƠN</em> cú 137 của OOM killer vì nó kèm theo vết ngăn xếp. Ở đây nó là cùng một tín hiệu đang làm đúng việc CI sinh ra để làm: nói cho bạn biết về một cái máy KHÔNG phải của bạn.</p>

<h3>Cách chữa là gì, và nó chứng minh điều gì</h3>
<div class="out">Hai viec, can CA HAI:
  • build:renderer chay qua node --max-old-space-size=6144
  • ban do nguon TAT khi co bien CI (sourcemap: !process.env.CI)

Do that o heap bi bop 1600MB — khong doan:
  co ban do nguon  → exit 134, dung loi cua CI
  khong            → exit 0</div>

<p>Để ý dòng thứ hai của cách chữa: <code>!process.env.CI</code>. Bản dựng hành xử KHÁC ĐI <em>vì nó đang chạy trong CI</em> — bản đồ nguồn được sinh ở máy nhà và bỏ qua trên runner, vì <code>electron-builder</code> dù sao cũng loại chúng khỏi bản cài. CI đang tốn bộ nhớ để sinh ra một thứ chính nó vứt đi ngay sau đó.</p>

<h3>Lời khẳng định mà CI THẬT SỰ đưa ra được</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">"máy tôi chạy được"</span><span class="lz-t">không bác bỏ được</span><span class="lz-d">chẳng ai khác có cái máy của bạn, phiên bản node của bạn, đống node_modules sót lại của bạn, hay cái tệp bạn chưa commit</span></div>
<div class="lz-step"><span class="lz-k">"chạy được từ một bản lấy về SẠCH"</span><span class="lz-t">kiểm được</span><span class="lz-d">và cách DUY NHẤT để kiểm là thật sự làm điều đó, ở CHỖ KHÁC, MỖI LẦN</span></div>
</div>

<p>Đó là toàn bộ ý tưởng. CI không phải một công cụ chất lượng, một công cụ kiểm thử, hay một công cụ triển khai — đó là những thứ bạn có thể ĐẶT VÀO nó. CI là một cỗ máy trả lời trung thực đúng một câu hỏi: <strong>cái commit này, một mình nó, từ con số không, có làm đúng cái bạn nói không?</strong></p>

<h3>Bốn thứ một phép kiểm cục bộ KHÔNG thấy được</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một tệp bạn CHƯA commit</span><span class="lz-lnote">phổ biến nhất, bỏ xa các cái khác. Nó chạy ở máy bạn vì cái tệp đó CÓ; nó không có trong kho mã</span></div>
<div class="lz-layer"><span class="lz-lname">một phụ thuộc bạn cài một lần</span><span class="lz-lnote">cài toàn cục, vài tháng trước, và chẳng bao giờ thêm vào <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">một cái máy KHÁC</span><span class="lz-lnote">đo trong khoá này: cùng lệnh <code>npm ci</code> mất 38 s trên Linux và 107 s trên Windows; cùng bản dựng mất 149 s trên Linux và 315 s trên macOS</span></div>
<div class="lz-layer"><span class="lz-lname">một bước bạn BỎ QUA</span><span class="lz-lnote">vì bạn biết chắc nó sẽ đạt. CI không biết chuyện đó và cứ chạy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — CI chứng minh cái COMMIT chạy được, không chứng minh mã ĐÚNG.</strong> Một lần chạy xanh nghĩa là mọi câu lệnh bạn liệt kê đều thoát 0 trên một bản lấy về sạch. Nếu workflow của bạn chạy một phép kiểm kiểu và không chạy test nào, thì màu xanh nghĩa là các kiểu dữ liệu nhất quán — và không gì khác. Chính CI của kho này nói rõ sự phân biệt đó: vài bước gắn nhãn <code>(required)</code> và một bước có <code>continue-on-error: true</code>, nghĩa là nó hỏng thì thấy được mà không chặn bản dựng. BIẾT CHÍNH XÁC màu xanh của bạn có nghĩa gì thì hữu dụng hơn là làm cho nó xanh hơn.</p>
</div>

<h3>Kho này THẬT SỰ chốt cửa ở đâu</h3>
<p>Trích từ <code>ci-lint.yml</code>, không sửa gì:</p>

<pre><code>- name: TypeScript type-check (required)
  run: npx tsc --noEmit
- name: Interview grader eval — golden set (required)
  run: npm run eval:grader
- name: CV linter eval — golden set (required)
  run: npm run eval:cv-linter
- name: Unit tests — money math + payment signature (required)
  run: npm test
- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>Bốn cái chốt và một bản báo cáo. Dòng chú thích ở bước kiểm kiểu giải thích một lựa chọn mà phần lớn workflow để ngầm:</p>

<div class="out"># 22 matches the production runtime (node:22-alpine) and is required
# by the CV PDF round-trip test in &#96;npm test&#96; (unpdf needs
# Promise.withResolvers, a Node 22 feature).</div>

<p>Phiên bản node của CI là 22 <em>VÌ production là 22</em>. Một cái CI kiểm thử một môi trường chạy KHÁC với production thì đang trả lời một câu hỏi chẳng ai hỏi.</p>

<div class="callout ok">
<p><strong>Bản một câu.</strong> CI biến "tôi NGHĨ cái này chạy" thành "cái này ĐÃ chạy, trên một cái máy sạch, lúc 06:03:42, và đây là nhật ký". Mọi thứ khác trong khoá này — kích hoạt, job, biểu thức, bộ đệm, ma trận — đều là máy móc để làm cho câu trả lời ấy tới NHANH HƠN và có NGHĨA HƠN.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Understanding GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/understanding-github-actions — bộ từ vựng (workflow, job, step, action, runner) mà cả khoá này dùng xuyên suốt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Continuous Integration</span><span class="lc-sub">martinfowler.com/articles/continuousIntegration.html — bài viết năm 2006 đặt tên cho thực hành này, và tới giờ vẫn là phát biểu rõ nhất về việc vì sao TÍCH HỢP THƯỜNG XUYÊN rẻ hơn tích hợp giỏi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib — cùng ghi chú rằng mặc định được suy ra từ bộ nhớ hệ thống khả dụng, mà đó chính xác là lý do máy nhà và runner không đồng ý với nhau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — mã thoát 137, 134, và thứ nhân hệ điều hành ghi lại</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng những mã thoát ấy đo từ phía máy chủ, kể cả vì sao 134 là cú hỏng hữu dụng hơn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Workflow, job, step, runner|||0.2 — Workflow, job, bước, runner',
      slug: 'ga-0-2-bon-tang',
      type: 'VIDEO',
      description: 'Bốn danh từ, và mỗi cái là một ranh giới THẬT chứ không phải một cách sắp xếp. Đọc qua một lần chạy thật: 5 job, 3 nền tảng, 555 giây — và ba job trong đó bắt đầu cùng một giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Workflow, job, step, runner</h2>
<p class="lead">These four words look like an organisational hierarchy. They are not — each one is a real boundary, and knowing which boundary you are crossing explains most of what surprises people later.</p>

<h3>One real run, taken apart</h3>
<p>Run 32662461744 from this repository: a desktop release, five jobs, three operating systems, <strong>555,000 ms</strong> from start to finish.</p>

<div class="out">| Job            | Runner         | Bat dau  | Xong     | Tong |
|----------------|----------------|----------|----------|------|
| Kiem tra ma    | ubuntu-latest  | 19:49:32 | 19:50:44 |  72s |
| Dung Linux     | ubuntu-latest  | 19:50:48 | 19:54:49 | 241s |
| Dung macOS     | macos-latest   | 19:50:48 | 19:58:05 | 437s |
| Dung Windows   | windows-latest | 19:50:48 | 19:56:11 | 323s |
| Cong bo        | ubuntu-latest  | 19:58:08 | 19:58:42 |  34s |</div>

<div class="callout ok">
<p><strong>Read the third column.</strong> Three jobs start at exactly <strong>19:50:48</strong> — the same second. They are not queued behind one another; they are three separate machines running at once. And the first job finished at 19:50:44, four seconds before they started: they were <em>waiting</em> for it. That is the boundary between jobs, visible in timestamps.</p>
</div>

<h3>The four boundaries</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">workflow</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">one YAML file</div><div class="lz-nsub">one trigger, one run. This repository has 11 of them, 1,394 lines</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">job</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">a whole machine</div><div class="lz-nsub">parallel by default; a fresh filesystem; nothing shared with any other job unless you ship it explicitly</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">step</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">one command or one action</div><div class="lz-nsub">sequential within a job, on the same filesystem, in order, stopping at the first failure</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">runner</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the machine itself</div><div class="lz-nsub">a fresh VM per job, destroyed afterwards. Its OS is a choice with measurable consequences</div></div></div>
</div>
</div>

<h3>The boundary that surprises people: jobs share nothing</h3>
<p>Steps within a job share a filesystem. Jobs do not. In the run above, the Linux build job produced an installer and the publish job needed it — and the workflow had to <em>explicitly</em> move it:</p>

<div class="out">Dung Linux, buoc 9:   "Luu ban cai lam artifact"          8s
Dung macOS, buoc 9:   "Luu ban cai lam artifact"         27s
Dung Windows, buoc 9: "Luu ban cai lam artifact"          6s
Cong bo, buoc 4:      "Tai ban cai cua ca ba nen tang ve" 12s</div>

<p>Four steps and 53 seconds of a 555-second run exist purely to move files between machines. If jobs shared a disk, none of them would be needed. Chapter 5 measures artifacts properly; for now the point is structural: <strong>a job boundary is a machine boundary, and anything that crosses it has to be carried.</strong></p>

<h3>The boundary that costs money: the runner</h3>
<p>The same two <code>npm ci</code> commands, on the same commit, in the same run, on three runners:</p>

<div class="out">| Nen tang | npm ci #1 | npm ci #2 | Tong |
|----------|-----------|-----------|------|
| Linux    | 12s       | 26s       |  38s |
| macOS    | 22s       | 50s       |  72s  (1,9x) |
| Windows  | 39s       | 68s       | 107s  (2,8x) |</div>

<p>And the build step itself: <strong>149 s on Linux, 171 s on Windows, 315 s on macOS</strong>. Nothing about the code differs. <code>runs-on:</code> is one line and it is one of the most consequential lines in the file.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>ubuntu-latest</code> is not a version, it is a moving target.</strong> It points at whatever Ubuntu GitHub currently considers current, and it moves — usually with a deprecation window, occasionally with surprises. A workflow that was green for a year can go red on a morning you did not touch it. This repository&#39;s <code>ci-lint.yml</code> pins <code>ubuntu-24.04</code> for exactly this reason, while <code>desktop-release.yml</code> uses <code>ubuntu-latest</code> — two files, two different risk appetites, both defensible. What is not defensible is not knowing which one you chose.</p>
</div>

<h3>Steps: sequential, and they stop</h3>
<p>Within a job, steps run in order on one filesystem, and the first failure ends the job. That is why the ordering in this repository&#39;s CI is not arbitrary:</p>

<pre><code>- uses: actions/checkout@v4          <span class="tok-comment"># khong co ma thi khong lam gi duoc</span>
- uses: actions/setup-node@v4        <span class="tok-comment"># khong co node thi npm khong chay</span>
- run: npm ci --no-audit --no-fund   <span class="tok-comment"># khong co goi thi tsc khong chay</span>
- run: npx tsc --noEmit              <span class="tok-comment"># chot 1</span>
- run: npm run eval:grader           <span class="tok-comment"># chot 2</span>
- run: npm test                      <span class="tok-comment"># chot 3</span></code></pre>

<p>Cheapest and most likely to fail goes first. A type error that takes 9 seconds to find should not wait behind a test suite that takes 90.</p>

<div class="callout warn">
<p><strong>Two escape hatches, and they mean different things.</strong> <code>continue-on-error: true</code> lets a step fail without failing the job — this repository uses it for ESLint, deliberately, so lint warnings are visible without blocking. <code>if: always()</code> makes a step run even after an earlier failure — for uploading logs or test reports you specifically want <em>when</em> things went wrong. Chapter 3 measures both; confusing them is common.</p>
</div>

<h3>Where the vocabulary bites</h3>
<div class="kv-grid">
<div class="kv"><span class="k">"the build is slow"</span><span class="v">which job? The run was 555 s and the Linux build was 241 s. Optimising the wrong one changes nothing (Chapter 6)</span></div>
<div class="kv"><span class="k">"it worked in the previous step"</span><span class="v">same job, so same disk — that is expected. Across jobs it would not be</span></div>
<div class="kv"><span class="k">"just add it to the workflow"</span><span class="v">to which job? Adding a step to job A does nothing for job B, which starts from an empty machine</span></div>
<div class="kv"><span class="k">"CI is red"</span><span class="v">one job or all of them? The Actions UI shows per-job status, and one red job among five is a very different problem</span></div>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs, steps, runs-on</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions — the normative reference for every key in this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — the hardware behind each label, and the note that macOS runners have different specifications from Linux ones.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — what is preinstalled on each image, and the announcements repository where <code>-latest</code> moves are posted before they happen.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what a checkout actually is</span><span class="lc-sub">/courses/git/learn${REF} — <code>actions/checkout</code> is a clone with a depth of 1 by default, and knowing that explains several later surprises.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Workflow, job, bước, runner</h2>
<p class="lead">Bốn từ này trông như một cây phân cấp để sắp xếp cho gọn. Không phải — mỗi cái là một RANH GIỚI THẬT, và biết mình đang vượt qua ranh giới nào giải thích được phần lớn những thứ làm người ta bất ngờ về sau.</p>

<h3>Một lần chạy thật, tháo ra</h3>
<p>Lần chạy 32662461744 của chính kho này: một bản phát hành desktop, năm job, ba hệ điều hành, <strong>555.000 ms</strong> từ đầu tới cuối.</p>

<div class="out">| Job            | Runner         | Bat dau  | Xong     | Tong |
|----------------|----------------|----------|----------|------|
| Kiem tra ma    | ubuntu-latest  | 19:49:32 | 19:50:44 |  72s |
| Dung Linux     | ubuntu-latest  | 19:50:48 | 19:54:49 | 241s |
| Dung macOS     | macos-latest   | 19:50:48 | 19:58:05 | 437s |
| Dung Windows   | windows-latest | 19:50:48 | 19:56:11 | 323s |
| Cong bo        | ubuntu-latest  | 19:58:08 | 19:58:42 |  34s |</div>

<div class="callout ok">
<p><strong>Đọc cột thứ ba.</strong> Ba job bắt đầu vào ĐÚNG <strong>19:50:48</strong> — cùng một giây. Chúng không xếp hàng sau nhau; chúng là BA cái máy riêng chạy cùng lúc. Và job đầu tiên xong lúc 19:50:44, TRƯỚC đó bốn giây: chúng đã <em>CHỜ</em> nó. Đó là ranh giới giữa các job, nhìn thấy được ngay trong dấu thời gian.</p>
</div>

<h3>Bốn ranh giới</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">workflow</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một tệp YAML</div><div class="lz-nsub">một bộ kích hoạt, một lần chạy. Kho này có 11 cái, 1.394 dòng</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">job</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">CẢ MỘT CÁI MÁY</div><div class="lz-nsub">mặc định chạy song song; một hệ tệp mới tinh; KHÔNG chia sẻ gì với job khác trừ khi bạn chuyển đi một cách tường minh</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">bước</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một câu lệnh hoặc một action</div><div class="lz-nsub">tuần tự trong một job, trên CÙNG hệ tệp, theo thứ tự, DỪNG ở cú hỏng đầu tiên</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">runner</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">bản thân cái máy</div><div class="lz-nsub">một máy ảo MỚI cho mỗi job, huỷ đi sau đó. Hệ điều hành của nó là một lựa chọn có hậu quả ĐO ĐƯỢC</div></div></div>
</div>
</div>

<h3>Cái ranh giới làm người ta bất ngờ: job KHÔNG chia sẻ gì</h3>
<p>Các bước trong một job dùng chung hệ tệp. Các job thì KHÔNG. Trong lần chạy ở trên, "Dựng Linux" tạo ra một bản cài và "Công bố" cần nó — và workflow phải <em>TƯỜNG MINH</em> chuyển nó đi:</p>

<div class="out">Dung Linux, buoc 9:   "Luu ban cai lam artifact"          8s
Dung macOS, buoc 9:   "Luu ban cai lam artifact"         27s
Dung Windows, buoc 9: "Luu ban cai lam artifact"          6s
Cong bo, buoc 4:      "Tai ban cai cua ca ba nen tang ve" 12s</div>

<p>Bốn bước và 53 giây của một lần chạy 555 giây tồn tại thuần tuý để CHUYỂN TỆP giữa các máy. Nếu các job dùng chung một cái đĩa thì chẳng cần cái nào cả. Chương 5 đo tạo tác cho đàng hoàng; bây giờ điểm cần nắm là về cấu trúc: <strong>ranh giới job là ranh giới MÁY, và bất cứ thứ gì vượt qua nó đều phải được KHIÊNG.</strong></p>

<h3>Cái ranh giới tốn tiền: runner</h3>
<p>Cùng HAI câu lệnh <code>npm ci</code>, trên cùng một commit, trong cùng một lần chạy, trên ba runner:</p>

<div class="out">| Nen tang | npm ci #1 | npm ci #2 | Tong |
|----------|-----------|-----------|------|
| Linux    | 12s       | 26s       |  38s |
| macOS    | 22s       | 50s       |  72s  (1,9x) |
| Windows  | 39s       | 68s       | 107s  (2,8x) |</div>

<p>Còn bản thân bước dựng: <strong>149 s trên Linux, 171 s trên Windows, 315 s trên macOS</strong>. Chẳng có gì trong mã khác nhau cả. <code>runs-on:</code> là MỘT dòng và nó là một trong những dòng nặng ký nhất trong tệp.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>ubuntu-latest</code> KHÔNG phải một phiên bản, nó là một MỤC TIÊU DI ĐỘNG.</strong> Nó trỏ vào bất cứ bản Ubuntu nào GitHub đang coi là hiện hành, và nó DI CHUYỂN — thường có cửa sổ báo trước, thỉnh thoảng thì bất ngờ. Một workflow xanh suốt một năm có thể đỏ vào một buổi sáng bạn chẳng đụng vào nó. Tệp <code>ci-lint.yml</code> của kho này ghim <code>ubuntu-24.04</code> đúng vì lý do này, trong khi <code>desktop-release.yml</code> dùng <code>ubuntu-latest</code> — hai tệp, hai khẩu vị rủi ro khác nhau, cả hai đều bảo vệ được. Thứ KHÔNG bảo vệ được là không biết mình đã chọn cái nào.</p>
</div>

<h3>Bước: tuần tự, và chúng DỪNG</h3>
<p>Trong một job, các bước chạy THEO THỨ TỰ trên một hệ tệp, và cú hỏng ĐẦU TIÊN kết thúc job. Đó là lý do thứ tự trong CI của kho này không phải tuỳ tiện:</p>

<pre><code>- uses: actions/checkout@v4          <span class="tok-comment"># khong co ma thi khong lam gi duoc</span>
- uses: actions/setup-node@v4        <span class="tok-comment"># khong co node thi npm khong chay</span>
- run: npm ci --no-audit --no-fund   <span class="tok-comment"># khong co goi thi tsc khong chay</span>
- run: npx tsc --noEmit              <span class="tok-comment"># chot 1</span>
- run: npm run eval:grader           <span class="tok-comment"># chot 2</span>
- run: npm test                      <span class="tok-comment"># chot 3</span></code></pre>

<p>Rẻ nhất và dễ hỏng nhất đi TRƯỚC. Một lỗi kiểu mất 9 giây để tìm ra thì không nên xếp hàng sau một bộ test mất 90 giây.</p>

<div class="callout warn">
<p><strong>Hai cửa thoát, và chúng có nghĩa KHÁC nhau.</strong> <code>continue-on-error: true</code> cho phép một bước HỎNG mà không làm hỏng job — kho này dùng nó cho ESLint, một cách có chủ đích, để cảnh báo lint nhìn thấy được mà không chặn đường. <code>if: always()</code> làm cho một bước CHẠY kể cả sau khi có bước trước hỏng — dành cho việc tải log hay báo cáo test lên, thứ bạn muốn có ĐÚNG LÚC mọi chuyện đổ vỡ. Chương 3 đo cả hai; lẫn lộn chúng là chuyện thường gặp.</p>
</div>

<h3>Chỗ mà bộ từ vựng này cắn bạn</h3>
<div class="kv-grid">
<div class="kv"><span class="k">"bản dựng chậm"</span><span class="v">JOB NÀO? Cả lần chạy là 555 s còn bản dựng Linux là 241 s. Tối ưu nhầm cái thì chẳng đổi gì (Chương 6)</span></div>
<div class="kv"><span class="k">"bước trước nó chạy được mà"</span><span class="v">cùng JOB, nên cùng đĩa — thế là ĐÚNG. Qua job khác thì không như vậy</span></div>
<div class="kv"><span class="k">"cứ thêm vào workflow đi"</span><span class="v">vào JOB NÀO? Thêm một bước vào job A chẳng làm gì cho job B, thứ khởi đầu từ một cái máy TRỐNG</span></div>
<div class="kv"><span class="k">"CI đỏ"</span><span class="v">MỘT job hay TẤT CẢ? Giao diện Actions hiện trạng thái theo từng job, và một job đỏ trên năm cái là một vấn đề rất khác</span></div>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs, steps, runs-on</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions — tài liệu chuẩn tắc cho mọi khoá xuất hiện trong bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — phần cứng đằng sau mỗi cái nhãn, và ghi chú rằng runner macOS có cấu hình KHÁC runner Linux.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — cái gì được cài sẵn trên mỗi ảnh, và kho thông báo nơi các cú dời <code>-latest</code> được đăng TRƯỚC khi chúng xảy ra.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — một cú checkout thật ra là gì</span><span class="lc-sub">/courses/git/learn${REF} — <code>actions/checkout</code> là một cú clone với độ sâu mặc định bằng 1, và biết điều đó giải thích được vài chuyện bất ngờ về sau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Reading a real workflow, line by line|||0.3 — Đọc một workflow THẬT, từng dòng một',
      slug: 'ga-0-3-doc-mot-workflow',
      type: 'VIDEO',
      description: 'Toàn bộ ci-lint.yml của kho này, không sửa gì. Bốn mươi dòng đầu chứa một sự BẤT ĐỐI XỨNG mà tác giả có lẽ không cố ý: sửa README rồi push thì CI KHÔNG chạy, nhưng cũng cú sửa đó trong một pull request thì CI CHẠY.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Reading a real workflow, line by line</h2>
<p class="lead">Not a tutorial workflow — the one that has run 526 times in this repository. Reading a file that is actually in service teaches more than reading one written to be read.</p>

<h3>The trigger block</h3>
<pre><code>on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'frontend/src/**'
      - 'eval/**'
      - 'prisma/**'
      - 'package.json'
      - 'package-lock.json'
      - 'frontend/package.json'
      - 'tsconfig.json'
      - 'frontend/tsconfig.json'
      - '.eslintrc.json'
      - '.prettierrc'
  workflow_dispatch: {}   <span class="tok-comment"># cho phep bam chay tay — khong can push</span></code></pre>

<div class="callout warn">
<p><strong>Look at what <code>pull_request</code> does not have.</strong> The <code>push</code> trigger has a <code>paths</code> filter — eleven patterns, so a commit touching only a README or a workflow file does not start a run. The <code>pull_request</code> trigger has <code>branches</code> and <strong>no <code>paths</code></strong>. The same README-only change therefore <em>does</em> start a run when it arrives as a pull request, and does <em>not</em> when it is pushed straight to <code>main</code>.</p>
</div>

<p>Is that a bug? Not necessarily — you could argue a PR should always get a full check regardless of what it touches. But it is almost certainly not a decision somebody made on purpose, and it is the kind of asymmetry that lives in a file for a year without anyone noticing. Reading the trigger block carefully is how you find out what your CI actually does, as opposed to what you assume it does.</p>

<h3>Three triggers, three different jobs of work</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">answers "is it safe to merge?" — and runs against a <em>merge commit</em>, not your branch. Chapter 1 measures why that distinction matters</span></div>
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">answers "is <code>main</code> still healthy?" — the safety net for anything that got in without a PR</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch: {}</span><span class="lz-lnote">answers "can a human run this on demand?" The empty <code>{}</code> means no inputs. Ten of this repository&#39;s eleven workflows are dispatch-only</span></div>
</div>

<h3>The job header</h3>
<pre><code>jobs:
  backend-lint:
    name: Backend Type Check
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    defaults:
      run:
        working-directory: .</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">backend-lint</span><span class="v">the job <em>id</em> — what other jobs refer to in <code>needs:</code>, and what appears in the API</span></div>
<div class="kv"><span class="k">name:</span><span class="v">the human label in the UI. Different from the id, deliberately</span></div>
<div class="kv"><span class="k">ubuntu-24.04</span><span class="v">pinned, not <code>-latest</code>. This file chose stability; <code>desktop-release.yml</code> in the same repo chose <code>-latest</code></span></div>
<div class="kv"><span class="k">timeout-minutes: 10</span><span class="v">the single most underused key in GitHub Actions. Default is <strong>360</strong> — six hours of a hung job before anything notices</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the default timeout is six hours.</strong> A step that waits on input, retries forever, or deadlocks will sit there burning runner time until <code>timeout-minutes</code> or the six-hour ceiling stops it. On a private repository that is billed minutes; on any repository it is a job that looks "in progress" for an afternoon while everyone assumes it is just slow. Ten minutes, as here, is a statement: <em>if this takes longer than ten minutes something is wrong, and I would rather know.</em></p>
</div>

<h3>The steps, and why they are in this order</h3>
<pre><code>- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
- name: Install deps
  run: npm ci --no-audit --no-fund
- name: TypeScript type-check (required)
  run: npx tsc --noEmit</code></pre>

<p>Three things worth noticing in four steps.</p>

<p><strong><code>node-version: '22'</code> is quoted.</strong> That is not decoration — Chapter 1 measures what happens without the quotes, and it is not what you expect.</p>

<p><strong><code>cache: 'npm'</code> is one line and it is doing real work.</strong> It restores <code>~/.npm</code> from a previous run keyed on the lockfile hash. Chapter 5 measures how much it saves and the one case where it silently saves nothing.</p>

<p><strong><code>--no-audit --no-fund</code>.</strong> Two flags that turn off things nobody reads in CI: the vulnerability audit output and the funding message. Small, but this step runs on every push.</p>

<h3>The step that is deliberately allowed to fail</h3>
<pre><code>- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>Three separate safety nets on one line, which is one more than necessary and worth understanding:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">continue-on-error: true</span><span class="lz-t">job-level</span><span class="lz-d">the step may fail; the job continues and stays green</span></div>
<div class="lz-step"><span class="lz-k">|| echo "…"</span><span class="lz-t">shell-level</span><span class="lz-d">the pipeline never returns non-zero in the first place</span></div>
<div class="lz-step"><span class="lz-k">| tail -30</span><span class="lz-t">output-level</span><span class="lz-d">keeps the log readable — but see the pitfall</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>| tail -30</code> silently discards the exit code.</strong> In a pipeline, the shell reports the status of the <em>last</em> command, and <code>tail</code> almost always succeeds. So <code>npm run lint | tail -30</code> exits 0 whether lint passed or not, and the <code>|| echo</code> after it can never fire. Here that is harmless — the step is informational and <code>continue-on-error</code> already says so. In a step that is meant to gate, the same shape means the gate is not there. The Deploy VPS course measured this exact behaviour: without <code>set -o pipefail</code>, a failing command in a pipeline is invisible.</p>
</div>

<h3>The step that is designed to skip</h3>
<pre><code>- name: CV critique fabrication test (skips without an AI key)
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
    LLM_BASE_URL: \${{ secrets.LLM_BASE_URL }}
  run: npm run eval:cv-fabrication</code></pre>

<p>The repository&#39;s notes are explicit that this secret was <em>removed on purpose</em>: the account ran out of credit, so a key would have traded one red build for another. With the secret absent, GitHub substitutes an empty string, the script detects no key, and exits 0 — the step reports success and does nothing.</p>

<div class="callout warn">
<p><strong>That is a deliberate choice with a stated cost, which is the right way to do it.</strong> The notes record what is no longer being checked: nothing watches for the AI inventing metrics in CV critiques any more. A skipped step that everyone knows is skipped is a managed risk. A skipped step nobody noticed is Chapter 9&#39;s recurring nightmare — a check that passes because it is not running.</p>
</div>

<h3>What the whole file costs</h3>
<div class="out">ci-lint.yml, 10 lan chay gan nhat (giay):
  135, 155, 140, 160, 144, 144, 100, 144, 141, 145
  → TB ~141s, min 100s, max 160s

Hai job chay SONG SONG: backend-lint (node 22) + frontend-lint (node 20)</div>

<p>About two minutes and twenty seconds, twice per commit that touches source, 526 times so far. Chapter 8 is about whether that number can come down and whether it should.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — the full list, and which filters (<code>branches</code>, <code>paths</code>, <code>types</code>) each event supports. The asymmetry in this lesson is visible in that table.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — including the 360-minute default that this lesson argues you should always override.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node</span><span class="lc-sub">github.com/actions/setup-node — what <code>cache: 'npm'</code> actually caches, and <code>cache-dependency-path</code> for a lockfile that is not at the repository root.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — pipefail, and the exit code a pipe throws away</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the measured version of the <code>| tail -30</code> pitfall, with a flag-by-flag table.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Đọc một workflow THẬT, từng dòng một</h2>
<p class="lead">Không phải một workflow mẫu trong sách — mà cái đã chạy 526 lần trong chính kho này. Đọc một tệp ĐANG PHỤC VỤ dạy được nhiều hơn đọc một tệp viết ra để cho người ta đọc.</p>

<h3>Khối kích hoạt</h3>
<pre><code>on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'frontend/src/**'
      - 'eval/**'
      - 'prisma/**'
      - 'package.json'
      - 'package-lock.json'
      - 'frontend/package.json'
      - 'tsconfig.json'
      - 'frontend/tsconfig.json'
      - '.eslintrc.json'
      - '.prettierrc'
  workflow_dispatch: {}   <span class="tok-comment"># cho phep bam chay tay — khong can push</span></code></pre>

<div class="callout warn">
<p><strong>Nhìn vào thứ mà <code>pull_request</code> KHÔNG có.</strong> Bộ kích hoạt <code>push</code> có bộ lọc <code>paths</code> — mười một mẫu, nên một commit chỉ đụng vào README hay một tệp workflow thì KHÔNG khởi động lần chạy nào. Bộ kích hoạt <code>pull_request</code> có <code>branches</code> và <strong>KHÔNG có <code>paths</code></strong>. Cũng cú sửa chỉ-README ấy vì thế <em>CÓ</em> khởi động một lần chạy khi nó tới dưới dạng pull request, và <em>KHÔNG</em> khi nó được push thẳng vào <code>main</code>.</p>
</div>

<p>Đó có phải một con bọ không? Chưa chắc — bạn hoàn toàn lập luận được rằng một PR thì luôn nên nhận một lượt kiểm đầy đủ bất kể nó đụng vào cái gì. Nhưng gần như chắc chắn đó KHÔNG phải một quyết định ai đó ra một cách có chủ đích, và nó đúng là loại bất đối xứng nằm trong một tệp suốt một năm mà chẳng ai nhận ra. Đọc kỹ khối kích hoạt là cách bạn biết được CI của mình THẬT SỰ làm gì, đối lại với thứ bạn GIẢ ĐỊNH là nó làm.</p>

<h3>Ba bộ kích hoạt, ba việc khác nhau</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">trả lời "gộp vào có an toàn không?" — và nó chạy trên một <em>COMMIT GỘP</em>, không phải trên nhánh của bạn. Chương 1 đo vì sao phân biệt đó quan trọng</span></div>
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">trả lời "<code>main</code> còn khoẻ không?" — tấm lưới cho bất cứ thứ gì lọt vào mà không qua PR</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch: {}</span><span class="lz-lnote">trả lời "người có bấm chạy được không?" Cái <code>{}</code> rỗng nghĩa là không có tham số. MƯỜI trên mười một workflow của kho này chỉ chạy bằng dispatch</span></div>
</div>

<h3>Đầu job</h3>
<pre><code>jobs:
  backend-lint:
    name: Backend Type Check
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    defaults:
      run:
        working-directory: .</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">backend-lint</span><span class="v">MÃ ĐỊNH DANH của job — thứ mà các job khác gọi tới trong <code>needs:</code>, và thứ xuất hiện trong API</span></div>
<div class="kv"><span class="k">name:</span><span class="v">cái nhãn cho NGƯỜI đọc trên giao diện. Khác mã định danh, một cách có chủ đích</span></div>
<div class="kv"><span class="k">ubuntu-24.04</span><span class="v">GHIM, không phải <code>-latest</code>. Tệp này chọn sự ổn định; <code>desktop-release.yml</code> trong cùng kho lại chọn <code>-latest</code></span></div>
<div class="kv"><span class="k">timeout-minutes: 10</span><span class="v">cái khoá ít được dùng nhất trong GitHub Actions. Mặc định là <strong>360</strong> — SÁU TIẾNG một job treo trước khi có thứ gì đó nhận ra</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hạn giờ mặc định là SÁU TIẾNG.</strong> Một bước ngồi chờ đầu vào, thử lại vô hạn, hoặc tự kẹt sẽ nằm đó đốt thời gian runner cho tới khi <code>timeout-minutes</code> hoặc cái trần sáu tiếng chặn nó lại. Trên một kho riêng tư thì đó là phút tính tiền; trên bất kỳ kho nào thì đó là một job trông như "đang chạy" suốt một buổi chiều trong khi ai cũng cho rằng nó chỉ chậm thôi. Mười phút, như ở đây, là một PHÁT BIỂU: <em>nếu cái này lâu hơn mười phút thì có gì đó sai, và tôi MUỐN BIẾT.</em></p>
</div>

<h3>Các bước, và vì sao chúng theo thứ tự này</h3>
<pre><code>- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
- name: Install deps
  run: npm ci --no-audit --no-fund
- name: TypeScript type-check (required)
  run: npx tsc --noEmit</code></pre>

<p>Ba thứ đáng để ý trong bốn bước.</p>

<p><strong><code>node-version: '22'</code> ĐƯỢC ĐẶT TRONG NHÁY.</strong> Đó không phải trang trí — Chương 1 đo xem thiếu cặp nháy ấy thì chuyện gì xảy ra, và nó không phải thứ bạn nghĩ.</p>

<p><strong><code>cache: 'npm'</code> là MỘT dòng và nó đang làm việc thật.</strong> Nó khôi phục <code>~/.npm</code> từ một lần chạy trước, khoá theo mã băm của lockfile. Chương 5 đo nó tiết kiệm được bao nhiêu và cái ca duy nhất nó âm thầm chẳng tiết kiệm gì.</p>

<p><strong><code>--no-audit --no-fund</code>.</strong> Hai cái cờ tắt đi những thứ chẳng ai đọc trong CI: output kiểm lỗ hổng và dòng xin tài trợ. Nhỏ thôi, nhưng bước này chạy ở MỌI lần push.</p>

<h3>Cái bước được PHÉP hỏng một cách có chủ đích</h3>
<pre><code>- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>BA tấm lưới riêng biệt trên một dòng, tức là nhiều hơn cần thiết một tấm, và đáng hiểu:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">continue-on-error: true</span><span class="lz-t">mức JOB</span><span class="lz-d">bước được phép hỏng; job đi tiếp và vẫn xanh</span></div>
<div class="lz-step"><span class="lz-k">|| echo "…"</span><span class="lz-t">mức SHELL</span><span class="lz-d">cái ống ngay từ đầu đã không bao giờ trả về khác không</span></div>
<div class="lz-step"><span class="lz-k">| tail -30</span><span class="lz-t">mức OUTPUT</span><span class="lz-d">giữ cho nhật ký đọc được — nhưng xem cái bẫy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>| tail -30</code> ÂM THẦM vứt mất mã thoát.</strong> Trong một cái ống, shell báo trạng thái của lệnh CUỐI CÙNG, mà <code>tail</code> thì gần như luôn thành công. Nên <code>npm run lint | tail -30</code> thoát 0 bất kể lint có đạt hay không, và cái <code>|| echo</code> phía sau chẳng bao giờ nổ được. Ở ĐÂY thì vô hại — bước này chỉ để thông tin và <code>continue-on-error</code> vốn đã nói thế. Trong một bước ĐỊNH LÀM CHỐT CỬA thì cùng hình dạng đó nghĩa là cái chốt KHÔNG TỒN TẠI. Khoá Deploy VPS đã đo đúng hành vi này: thiếu <code>set -o pipefail</code>, một lệnh hỏng trong ống là VÔ HÌNH.</p>
</div>

<h3>Cái bước được thiết kế để BỎ QUA</h3>
<pre><code>- name: CV critique fabrication test (skips without an AI key)
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
    LLM_BASE_URL: \${{ secrets.LLM_BASE_URL }}
  run: npm run eval:cv-fabrication</code></pre>

<p>Ghi chú của kho nói rõ rằng cái bí mật đó đã bị gỡ <em>CÓ CHỦ ĐÍCH</em>: tài khoản hết tiền, nên một cái khoá chỉ đổi bản dựng đỏ này lấy bản dựng đỏ khác. Với bí mật vắng mặt, GitHub thế vào một chuỗi RỖNG, script phát hiện không có khoá, và thoát 0 — bước báo thành công và chẳng làm gì.</p>

<div class="callout warn">
<p><strong>Đó là một lựa chọn CÓ CHỦ ĐÍCH kèm cái giá được PHÁT BIỂU RA, và đó là cách làm đúng.</strong> Ghi chú ghi lại thứ KHÔNG CÒN được kiểm nữa: chẳng còn gì canh chừng việc AI bịa ra chỉ số trong các bài phê CV. Một bước bị bỏ qua mà AI CŨNG BIẾT là bị bỏ qua thì là một rủi ro ĐƯỢC QUẢN LÝ. Một bước bị bỏ qua mà chẳng ai nhận ra thì là cơn ác mộng lặp đi lặp lại của Chương 9 — một phép kiểm ĐẠT vì nó không chạy.</p>
</div>

<h3>Cả tệp đó tốn bao nhiêu</h3>
<div class="out">ci-lint.yml, 10 lan chay gan nhat (giay):
  135, 155, 140, 160, 144, 144, 100, 144, 141, 145
  → TB ~141s, min 100s, max 160s

Hai job chay SONG SONG: backend-lint (node 22) + frontend-lint (node 20)</div>

<p>Khoảng hai phút hai mươi giây, hai job một lượt, ở mỗi commit đụng vào mã nguồn, 526 lần tính tới giờ. Chương 8 nói về việc con số ấy có hạ xuống được không và có NÊN không.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — danh sách đầy đủ, và mỗi sự kiện hỗ trợ bộ lọc nào (<code>branches</code>, <code>paths</code>, <code>types</code>). Sự bất đối xứng trong bài này nhìn thấy được ngay trong cái bảng đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — kể cả giá trị mặc định 360 phút mà bài này lập luận là bạn nên LUÔN ghi đè.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node</span><span class="lc-sub">github.com/actions/setup-node — <code>cache: 'npm'</code> THẬT RA đệm cái gì, và <code>cache-dependency-path</code> cho một lockfile không nằm ở gốc kho.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — pipefail, và mã thoát mà một cái ống vứt đi</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — bản ĐO ĐƯỢC của cái bẫy <code>| tail -30</code>, kèm bảng từng cờ một.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — What this course measures, and in what order|||0.4 — Khoá này ĐO cái gì, và theo thứ tự nào',
      slug: 'ga-0-4-ban-do',
      type: 'VIDEO',
      description: 'Bản đồ mười một chương, và lời hứa về phương pháp: mọi con số trong khoá này lấy từ 2.343 lần chạy THẬT của kho này hoặc từ một phép đo chạy được trong hộp cát — không có con số nào chép từ tài liệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>What this course measures, and in what order</h2>
<p class="lead">Eleven chapters, each answering one question about the machine. Every number comes from somewhere you can check.</p>

<div class="callout ok">
<p><strong>The method, stated up front.</strong> Every figure in this course comes from one of two places: <strong>(a)</strong> the 2,343 real runs of this repository&#39;s 11 workflows, read back through GitHub&#39;s API — job timings, step timings, exit codes, failure messages; or <strong>(b)</strong> a measurement run in a sandbox, with the commands shown. Where a measurement surprised me I re-ran it, and where it came back null I say so and explain what the measurement could not see. Nothing here is quoted from documentation as though it were an observation.</p>
</div>

<h3>The eleven chapters</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — The workflow file</span><span class="lz-lnote">YAML, and the traps that come from it being YAML: the <code>on</code> key that parses as a boolean, and the version number that becomes a float. Triggers, filters, and the <code>pull_request</code> merge commit that is not your branch</span></div>
<div class="lz-layer"><span class="lz-lname">2 — Jobs and the runner</span><span class="lz-lnote">What a runner actually is, what is preinstalled, and the measured cost of choosing each OS. <code>needs:</code>, and why a dependency graph is not a list</span></div>
<div class="lz-layer"><span class="lz-lname">3 — Expressions and contexts</span><span class="lz-lnote">WHEN <code>\${{ }}</code> is evaluated, which is the answer to most "why did my <code>if</code> not work" questions. <code>if:</code>, <code>always()</code>, <code>success()</code>, and the difference between a skipped step and a failed one</span></div>
<div class="lz-layer"><span class="lz-lname">4 — Actions</span><span class="lz-lnote">What <code>uses:</code> does — it clones and runs somebody else&#39;s repository inside your job. Tags versus SHAs, and what a compromised action can reach</span></div>
<div class="lz-layer"><span class="lz-lname">5 — Caching and artifacts</span><span class="lz-lnote">Two things that look similar and are not. Cache keys, <code>restore-keys</code>, and the measured case where the cache saves nothing</span></div>
<div class="lz-layer"><span class="lz-lname">6 — Matrix and the critical path</span><span class="lz-lnote">Fan-out, and the measurement that matters: in this repository&#39;s release, Linux finished 3m16s before macOS and then waited</span></div>
<div class="lz-layer"><span class="lz-lname">7 — Secrets and permissions</span><span class="lz-lnote">How masking works and exactly how it fails. <code>GITHUB_TOKEN</code> permissions, and why <code>pull_request_target</code> is the most dangerous trigger there is</span></div>
<div class="lz-layer"><span class="lz-lname">8 — Speed and cost</span><span class="lz-lnote">Where the seconds actually go, measured per step across three platforms. Concurrency groups, and cancelling a run that is already obsolete</span></div>
<div class="lz-layer"><span class="lz-lname">9 — When CI is red</span><span class="lz-lnote">Reading a failed run. Flakiness, and the honest question of whether a re-run is diagnosis or avoidance</span></div>
<div class="lz-layer"><span class="lz-lname">10 — Deploying from CI</span><span class="lz-lnote">And why this repository <em>stopped</em> — two real outages caused by push-triggered deploys racing each other, with dates</span></div>
<div class="lz-layer"><span class="lz-lname">11 — Diagnosis and the final exam</span><span class="lz-lnote">A recipe book, an acceptance test for a workflow, and twelve questions</span></div>
</div>

<h3>What this course is not</h3>
<div class="kv-grid">
<div class="kv"><span class="k">not a list of actions</span><span class="v">the marketplace has thousands and they change. Chapter 4 teaches how to read one instead</span></div>
<div class="kv"><span class="k">not a YAML tutorial</span><span class="v">except for the parts that bite, which Chapter 1 measures</span></div>
<div class="kv"><span class="k">not about GitLab CI or Jenkins</span><span class="v">though the boundaries in 0.2 transfer almost unchanged</span></div>
<div class="kv"><span class="k">not a substitute for the docs</span><span class="v">every lesson links the normative page. This course is about what the docs do not tell you: what it costs and how it fails</span></div>
</div>

<h3>Where it sits next to the other courses</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Git &amp; GitHub</span><span class="lz-t">before this</span><span class="lz-d">commits, branches, pull requests. This course assumes all three</span></div>
<div class="lz-step"><span class="lz-k">Linux &amp; Bash</span><span class="lz-t">alongside</span><span class="lz-d">every <code>run:</code> step is a shell script, and Chapter 3 of that course is the reason yours does not fail silently</span></div>
<div class="lz-step"><span class="lz-k">Deploy VPS</span><span class="lz-t">after, or alongside</span><span class="lz-d">this course builds the artifact; that one moves it, swaps it, and rolls it back</span></div>
<div class="lz-step"><span class="lz-k">Docker</span><span class="lz-t">optional</span><span class="lz-d">Chapter 10 builds and pushes images; that course explains what an image is</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the numbers in this course are from one repository, and yours will differ.</strong> A Node monorepo on GitHub-hosted runners is a specific shape. Your <code>npm ci</code> will not take 38 seconds; your macOS build will not take 315. What transfers is not the figures but the <em>relationships</em>: that Windows is consistently slower at filesystem-heavy work, that the critical path is one job and not the sum, that a cache hit and a cache miss differ by a factor you should know for your own project. Every chapter shows the command, so you can produce your own numbers.</p>
</div>

<div class="callout ok">
<p><strong>The one thing to carry through all eleven chapters.</strong> A green run means: <em>every command you listed exited zero, on a clean machine, in an environment you specified.</em> It does not mean the code is correct, the deploy will work, or the thing you forgot to check is fine. Most of what goes wrong with CI is a gap between what people think green means and what it actually means — and every chapter here closes one of those gaps with a measurement.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Actions documentation</span><span class="lc-sub">docs.github.com/en/actions — the root of the official documentation; every chapter links the specific page rather than repeating it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Actions</span><span class="lc-sub">docs.github.com/en/rest/actions — how the run and job timings in this course were read. <code>GET /repos/{o}/{r}/actions/runs/{id}/jobs</code> returns per-step timestamps, which is where every table here comes from.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits, billing, and administration</span><span class="lc-sub">docs.github.com/en/actions/administering-github-actions/usage-limits-billing-and-administration — the concurrency ceilings and the minute multipliers that Chapter 8 works from.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — what a deploy actually is</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the four-step model this course hands its artifact to.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Khoá này ĐO cái gì, và theo thứ tự nào</h2>
<p class="lead">Mười một chương, mỗi chương trả lời một câu hỏi về cỗ máy. Mọi con số đều tới từ một chỗ bạn kiểm chứng được.</p>

<div class="callout ok">
<p><strong>Phương pháp, nói thẳng từ đầu.</strong> Mọi con số trong khoá này tới từ một trong hai chỗ: <strong>(a)</strong> 2.343 lần chạy THẬT của 11 workflow trong kho này, đọc ngược về qua API của GitHub — thời lượng job, thời lượng từng bước, mã thoát, dòng báo lỗi; hoặc <strong>(b)</strong> một phép đo chạy trong hộp cát, có kèm câu lệnh. Chỗ nào phép đo làm tôi bất ngờ thì tôi đo lại, và chỗ nào nó trả về RỖNG thì tôi nói ra kèm lý do phép đo không nhìn thấy được. KHÔNG có gì ở đây được trích từ tài liệu rồi trình bày như thể đó là một quan sát.</p>
</div>

<h3>Mười một chương</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — Tệp workflow</span><span class="lz-lnote">YAML, và những cái bẫy sinh ra CHÍNH VÌ nó là YAML: cái khoá <code>on</code> bị đọc thành boolean, và số phiên bản bị biến thành số thực. Kích hoạt, bộ lọc, và cái commit gộp của <code>pull_request</code> vốn KHÔNG phải nhánh của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">2 — Job và runner</span><span class="lz-lnote">Runner THẬT RA là gì, cái gì được cài sẵn, và giá ĐO ĐƯỢC của việc chọn từng hệ điều hành. <code>needs:</code>, và vì sao một đồ thị phụ thuộc không phải một danh sách</span></div>
<div class="lz-layer"><span class="lz-lname">3 — Biểu thức và ngữ cảnh</span><span class="lz-lnote">LÚC NÀO <code>\${{ }}</code> được tính, mà đó là câu trả lời cho phần lớn câu hỏi "sao cái <code>if</code> của tôi không chạy". <code>if:</code>, <code>always()</code>, <code>success()</code>, và khác biệt giữa một bước BỎ QUA với một bước HỎNG</span></div>
<div class="lz-layer"><span class="lz-lname">4 — Action</span><span class="lz-lnote">Cái <code>uses:</code> làm gì — nó CLONE và CHẠY kho mã của người khác BÊN TRONG job của bạn. Thẻ so với SHA, và một action bị chiếm quyền với tới được những gì</span></div>
<div class="lz-layer"><span class="lz-lname">5 — Bộ đệm và tạo tác</span><span class="lz-lnote">Hai thứ trông giống nhau và KHÔNG giống nhau. Khoá bộ đệm, <code>restore-keys</code>, và cái ca ĐO ĐƯỢC mà bộ đệm chẳng tiết kiệm gì</span></div>
<div class="lz-layer"><span class="lz-lname">6 — Ma trận và đường tới hạn</span><span class="lz-lnote">Toả nhánh, và phép đo THẬT SỰ quan trọng: trong bản phát hành của kho này, Linux xong TRƯỚC macOS 3 phút 16 rồi ngồi CHỜ</span></div>
<div class="lz-layer"><span class="lz-lname">7 — Bí mật và quyền</span><span class="lz-lnote">Việc che bí mật hoạt động thế nào và HỎNG chính xác ra sao. Quyền của <code>GITHUB_TOKEN</code>, và vì sao <code>pull_request_target</code> là bộ kích hoạt NGUY HIỂM NHẤT tồn tại</span></div>
<div class="lz-layer"><span class="lz-lname">8 — Tốc độ và chi phí</span><span class="lz-lnote">Các giây THẬT SỰ đi đâu, đo theo từng bước trên ba nền tảng. Nhóm đồng thời, và huỷ một lần chạy vốn đã lỗi thời</span></div>
<div class="lz-layer"><span class="lz-lname">9 — Khi CI đỏ</span><span class="lz-lnote">Đọc một lần chạy hỏng. Tính chập chờn, và câu hỏi thành thật rằng chạy lại là CHẨN ĐOÁN hay là NÉ TRÁNH</span></div>
<div class="lz-layer"><span class="lz-lname">10 — Deploy từ CI</span><span class="lz-lnote">Và vì sao kho này đã <em>THÔI</em> — hai sự cố THẬT do các lần deploy kích hoạt bằng push giẫm lên nhau, có ghi ngày</span></div>
<div class="lz-layer"><span class="lz-lname">11 — Chẩn đoán và bài thi cuối</span><span class="lz-lnote">Một sách công thức, một bộ nghiệm thu cho workflow, và mười hai câu hỏi</span></div>
</div>

<h3>Khoá này KHÔNG phải cái gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">không phải danh sách action</span><span class="v">chợ có hàng nghìn cái và chúng thay đổi. Chương 4 dạy cách ĐỌC một cái thay vì liệt kê</span></div>
<div class="kv"><span class="k">không phải giáo trình YAML</span><span class="v">trừ những phần CẮN, và Chương 1 đem chúng đi đo</span></div>
<div class="kv"><span class="k">không nói về GitLab CI hay Jenkins</span><span class="v">dù các ranh giới ở bài 0.2 chuyển sang gần như nguyên vẹn</span></div>
<div class="kv"><span class="k">không thay thế tài liệu chính thức</span><span class="v">mỗi bài đều dẫn trang chuẩn tắc. Khoá này nói về thứ tài liệu KHÔNG nói: nó tốn gì và nó hỏng thế nào</span></div>
</div>

<h3>Nó nằm ở đâu bên cạnh các khoá khác</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Git &amp; GitHub</span><span class="lz-t">TRƯỚC khoá này</span><span class="lz-d">commit, nhánh, pull request. Khoá này giả định có cả ba</span></div>
<div class="lz-step"><span class="lz-k">Linux &amp; Bash</span><span class="lz-t">song song</span><span class="lz-d">mọi bước <code>run:</code> đều là một script shell, và Chương 3 của khoá đó là lý do script của bạn không hỏng âm thầm</span></div>
<div class="lz-step"><span class="lz-k">Deploy VPS</span><span class="lz-t">sau, hoặc song song</span><span class="lz-d">khoá này DỰNG tạo tác; khoá kia CHUYỂN, TRÁO, và LÙI nó</span></div>
<div class="lz-step"><span class="lz-k">Docker</span><span class="lz-t">tuỳ chọn</span><span class="lz-d">Chương 10 dựng và đẩy ảnh; khoá đó giải thích một cái ảnh là gì</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — các con số trong khoá này là của MỘT kho, và của bạn sẽ khác.</strong> Một monorepo Node trên runner do GitHub cấp là một hình dạng cụ thể. <code>npm ci</code> của bạn sẽ không mất 38 giây; bản dựng macOS của bạn sẽ không mất 315. Thứ CHUYỂN ĐƯỢC không phải các con số mà là các <em>QUAN HỆ</em>: rằng Windows chậm một cách nhất quán với việc nặng hệ tệp, rằng đường tới hạn là MỘT job chứ không phải tổng, rằng trúng bộ đệm và trượt bộ đệm chênh nhau một hệ số mà bạn nên biết cho DỰ ÁN CỦA MÌNH. Mỗi chương đều đưa ra câu lệnh, để bạn tự sinh ra số của mình.</p>
</div>

<div class="callout ok">
<p><strong>Một thứ duy nhất mang theo suốt mười một chương.</strong> Một lần chạy xanh nghĩa là: <em>mọi câu lệnh bạn liệt kê đều thoát 0, trên một cái máy sạch, trong một môi trường bạn chỉ định.</em> Nó KHÔNG có nghĩa là mã đúng, là lần deploy sẽ chạy, hay là cái thứ bạn quên kiểm thì vẫn ổn. Phần lớn những gì hỏng với CI là một khoảng cách giữa thứ người ta NGHĨ màu xanh có nghĩa gì và thứ nó THẬT SỰ có nghĩa — và mỗi chương ở đây khép lại một trong những khoảng cách đó bằng một phép đo.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Actions documentation</span><span class="lc-sub">docs.github.com/en/actions — gốc của tài liệu chính thức; mỗi chương dẫn thẳng trang cụ thể thay vì chép lại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Actions</span><span class="lc-sub">docs.github.com/en/rest/actions — cách các số đo thời lượng run và job trong khoá này được đọc ra. <code>GET /repos/{o}/{r}/actions/runs/{id}/jobs</code> trả về dấu thời gian TỪNG BƯỚC, và đó là nơi mọi cái bảng ở đây tới từ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits, billing, and administration</span><span class="lc-sub">docs.github.com/en/actions/administering-github-actions/usage-limits-billing-and-administration — trần đồng thời và hệ số nhân phút mà Chương 8 làm việc dựa trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — một lần deploy thật ra là gì</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — mô hình bốn bước mà khoá này giao tạo tác của nó vào tay.</span></span></div>
</div>
`,
    },
  ],
};
