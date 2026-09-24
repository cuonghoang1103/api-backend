import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 12 (MỚI, 09/2026): Tái sử dụng ở quy mô đội.
 * Nối tiếp bài 4.5 ("ba cách thôi chép") — KHÔNG lặp lại composite cơ bản, action_path, action cục bộ trước checkout.
 * Mọi log là run THẬT 24/09/2026 trên sân tập công khai github.com/cuonghoang1103/ga-san-tap, nhánh ch12-tai-su-dung
 * (runner 2.337.0, ubuntu-24.04 image 20260920.314.1). Docs kiểm từ mã nguồn github/docs (commit f71cc2a, 24/09/2026).
 */

const RUN = (id, t) => `<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/${id}" target="_blank" rel="noopener">${t || id}</a>`;

export default {
  title: 'Chapter 12 — Reuse at team scale: reusable workflows, composite & custom actions|||Chương 12 — Tái sử dụng ở quy mô đội: workflow dùng lại, composite action & action tự viết',
  slug: 'ga-ch12-tai-su-dung',
  description: 'Reusable workflow, composite action, action JavaScript và Docker, mẫu cho tổ chức — mọi hành vi đều chạy thật trên sân tập: output ma trận chỉ còn một, required không kiểm giá trị, inherit đưa cả secret không khai, giới hạn lồng đo được lệch docs một tầng.',
  sortOrder: 13,
  lessons: [

    /* ─────────────────────────── 12.0 ─────────────────────────── */
    {
      title: '12.0 — Chapter 12 slides: reuse at team scale in pictures|||12.0 — Slide Chương 12: tái sử dụng ở quy mô đội bằng hình',
      slug: 'ga-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 27 slide của Chương 12: một workflow được gọi hiện ra thế nào trong đồ thị run, output nối qua bốn tầng, ma trận chỉ giữ một output, secret và inherit, ba giới hạn chỉ lộ khi chạy, composite nhìn từ trong log, action JS đóng gói bằng ncc, Node 20 bị ép lên 24, Docker action, con trỏ di động vs ghim SHA, YAML anchor, template tổ chức và Dependabot.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Slides</span>
<h2>The whole chapter in 27 slides</h2>
<p class="lead">Lesson 4.5 named three ways to stop copying workflow code. This chapter builds each of them properly, at the size a team actually uses them, and measures what each one costs. Skim the slides first to see the shape; come back after the quiz to revise.</p>
<p>Slides 3–8 belong to Lesson 12.1 (reusable workflows), 9–13 to 12.2 (composite actions), 14–19 to 12.3 (JavaScript and Docker actions), and 20–24 to 12.4 (organisation templates, pinning and Dependabot). The last three are the chapter&#39;s common mistakes, a cheat sheet and a 60-minute practice session. Every log on the slides is real: recorded on 24 September 2026 on GitHub-hosted runners (runner 2.337.0, <code>ubuntu-24.04</code>, <code>windows-2025</code>, <code>macos-15</code>) in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch12-tai-su-dung" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch12-tai-su-dung</code>. Three results disagree with what you may have read elsewhere — one of them with GitHub&#39;s own documentation — and the slides say which run proves it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Slide</span>
<h2>Cả chương trong 27 slide</h2>
<p class="lead">Bài 4.5 mới gọi tên ba cách để thôi chép mã workflow. Chương này dựng từng cách cho đàng hoàng, ở đúng cỡ mà một đội thật sự dùng, và đo xem mỗi cách tốn gì. Lướt bộ slide trước để nắm hình dạng; làm xong bài kiểm tra thì quay lại đây để ôn.</p>
<p>Slide 3–8 thuộc Bài 12.1 (workflow dùng lại), 9–13 thuộc 12.2 (composite action), 14–19 thuộc 12.3 (action JavaScript và Docker), 20–24 thuộc 12.4 (mẫu cho tổ chức, ghim SHA và Dependabot). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 60 phút. Mọi log trên slide là THẬT: ghi ngày 24/09/2026 trên runner của GitHub (runner 2.337.0, <code>ubuntu-24.04</code>, <code>windows-2025</code>, <code>macos-15</code>) trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch12-tai-su-dung" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch12-tai-su-dung</code>. Có ba kết quả ngược với điều bạn có thể đã đọc ở chỗ khác — một trong số đó ngược với chính tài liệu của GitHub — và slide ghi rõ run nào chứng minh.</p>
</div>
${gallery('ga-12', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Gọi một workflow = thêm một job'], [4, 'workflow_call và bốn tầng output'], [5, 'Bên được gọi thấy github.* của bên gọi'],
  [6, 'Ma trận: output chỉ còn một'], [7, 'Secret: required và inherit'], [8, 'Ba giới hạn chỉ lộ khi chạy'],
  [9, 'Composite nhìn từ trong log'], [10, 'if, continue-on-error, uses lồng nhau'], [11, 'Hai lỗi nạp composite'],
  [12, 'Composite cục bộ hay từ xa'], [13, 'Composite hay reusable workflow'],
  [14, 'Action JS: src → ncc → dist'], [15, 'Quên đóng gói, và job kiem-dist'], [16, 'node20 bị ép lên Node 24'],
  [17, 'Docker action'], [18, 'Con trỏ di động vs ghim SHA'], [19, 'Test action trong kho của nó'],
  [20, 'Năm cỡ tái sử dụng'], [21, 'YAML anchor và merge key'], [22, 'Workflow template của tổ chức'],
  [23, 'api-backend: 24 lượt uses:, ghim SHA'], [24, 'Dependabot cho github-actions'],
  [25, 'Sai lầm hay gặp'], [26, 'Bảng tra nhanh'], [27, 'Thực hành chương 12'],
])}
`,
    },

    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — Reusable workflows: inputs, secrets, outputs, and the limits you only meet at run time|||12.1 — Workflow dùng lại: input, secret, output, và những giới hạn chỉ gặp lúc chạy',
      slug: 'ga-12-1-reusable-workflow',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'workflow_call đầy đủ, đo thật trên sân tập: output nối qua bốn tầng, ma trận chỉ giữ output của lần xong cuối, required không kiểm giá trị, inherit đưa cả secret không khai, quyền chỉ hạ được, concurrency trùng nhóm thì deadlock, và giới hạn lồng thật là 10 tầng được gọi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Reusable workflows: inputs, secrets, outputs, and the limits you only meet at run time</h2>
<p class="lead">A reusable workflow is a workflow file with <code>on: workflow_call</code>, and "calling" it means adding one more job to your run. Almost every surprise in this lesson follows from that sentence: the called workflow gets its own runner, sees the caller&#39;s <code>github</code> context, does not see the caller&#39;s <code>env</code>, and hands values back only through outputs you wire by hand.</p>

<p>Lesson 4.5 showed the one-screen version and one trap (a forgotten <code>secrets:</code> gives empty strings, not errors). This lesson goes the rest of the way: typed inputs, outputs across four layers, calling with a matrix, secrets through a chain of three workflows, permissions, concurrency, and nesting depth — each measured in the sandbox rather than paraphrased from the docs. One of the measurements disagrees with the docs.</p>

<h3>What a call looks like in the run</h3>
${slide('ga-12', 3, 'Calling a workflow adds a job that runs on its own runner')}
<p>The sandbox workflow <code>ch12-goi.yml</code> (the caller) calls <code>ch12-r-dung.yml</code> (the called workflow) three ways: once, once with a plain string as the secret, and as a three-way matrix. Then a normal job reads the outputs. Run ${RUN(36029548881)} produced six jobs:</p>
<div class="out">mot-lan / dung                 success   5s
chuoi-thuong / dung            success   5s
ma-tran (dev, 1) / dung        success   5s
ma-tran (stage, 25) / dung     success  29s
ma-tran (prod, 8) / dung       success  11s
doc-ket-qua                    success   3s</div>
<ul>
<li><strong>The name is "caller job / called job".</strong> <code>mot-lan</code> is the job id in the caller; <code>dung</code> is the job id inside the called file. A matrix adds its values in brackets. When you search a long run for "which job failed", this naming is how you find the call site.</li>
<li><strong>Each call is a separate job on a separate runner.</strong> The called jobs were created at 16:45:17 and started 2–4 seconds later, exactly like ordinary jobs. There is no in-process "function call": a reusable workflow costs one job start (queue plus Set up job) per job inside it.</li>
<li><strong>The called workflow has no run of its own.</strong> It does not appear in the Actions list as a separate run; it lives inside the caller&#39;s run. The API records it instead: the run object for 36029548881 lists <code>referenced_workflows</code> with the exact path and SHA that was used.</li>
</ul>

<h3>Declaring the interface: inputs, secrets, outputs</h3>
${slide('ga-12', 4, 'workflow_call declares three things; outputs cross four layers')}
<p>The called workflow declares its interface under <code>on.workflow_call</code>. Here is the sandbox file, trimmed:</p>
<pre><code class="language-yaml">on:
  workflow_call:
    inputs:
      moi-truong: { type: string,  required: true }
      cho-giay:   { type: number,  default: 1 }
      chay-test:  { type: boolean, default: true }
    secrets:
      ma-thu: { required: true }
    outputs:
      ban-dung:
        value: &#36;{{ jobs.dung.outputs.ban }}      # (3) workflow output &lt;- job output
jobs:
  dung:
    runs-on: ubuntu-24.04
    outputs:
      ban: &#36;{{ steps.b.outputs.ban }}           # (2) job output &lt;- step output
    steps:
      - id: b
        env: { MOI_TRUONG: &#36;{{ inputs.moi-truong }} }
        run: echo "ban=1.4.&#36;{{ github.run_number }}-$MOI_TRUONG" &gt;&gt; "$GITHUB_OUTPUT"   # (1)</code></pre>
<p>And the caller:</p>
<pre><code class="language-yaml">jobs:
  mot-lan:
    uses: ./.github/workflows/ch12-r-dung.yml
    with: { moi-truong: dev, cho-giay: 2 }
    secrets: { ma-thu: &#36;{{ secrets.CH06_GIA }} }
  doc-ket-qua:
    needs: [mot-lan]
    runs-on: ubuntu-24.04
    steps:
      - env: { A: &#36;{{ needs.mot-lan.outputs.ban-dung }} }   # (4)
        run: echo "$A"          # -&gt; 1.4.1-dev</code></pre>
<table>
<thead><tr><th>Key</th><th>What it does</th><th>What the sandbox showed</th></tr></thead>
<tbody>
<tr><td><code>inputs.&lt;id&gt;.type</code></td><td><code>string</code>, <code>number</code> or <code>boolean</code> — real types</td><td><code>&#36;{{ inputs.chay-test == true }}</code> printed <code>true</code>; with <code>chay-test: false</code> it printed <code>false</code></td></tr>
<tr><td><code>inputs.&lt;id&gt;.required</code> / <code>default</code></td><td>checked when the run starts</td><td>the Set up job log prints every input, defaults included, in a group called <code>Inputs</code></td></tr>
<tr><td><code>secrets.&lt;id&gt;.required</code></td><td>checks that the caller <em>mentions</em> the secret</td><td>does not check that it has a value — see below</td></tr>
<tr><td><code>outputs.&lt;id&gt;.value</code></td><td>must point at a <strong>job</strong> output</td><td>step → job → workflow → <code>needs</code>: four layers, all by hand</td></tr>
</tbody>
</table>
<p>The job that calls a reusable workflow is not a normal job. It may only use <code>name</code>, <code>uses</code>, <code>with</code>, <code>secrets</code>, <code>strategy</code>, <code>needs</code>, <code>if</code>, <code>concurrency</code>, <code>permissions</code> (and <code>cache-mode</code>, a newer keyword in the docs). No <code>runs-on</code>, no <code>steps</code>, no <code>env</code>, no <code>timeout-minutes</code> — those belong to the jobs inside the called file.</p>

<div class="pitfall co-tieu-de"><strong>Trap — the silent broken link.</strong> Forget any of the four layers — the <code>id</code> on the step, the job&#39;s <code>outputs:</code>, the workflow&#39;s <code>outputs:</code>, or the right name in <code>needs.&lt;job&gt;.outputs</code> — and you get an empty string. Not an error, not a warning. Deploy scripts that read a version from a reusable build workflow are the classic victim: the tag becomes <code>myapp:</code> and the push fails three steps later with a message about an invalid reference format. When an output is empty, walk the four layers in order before you look anywhere else.</div>

<h3>What the called workflow can see</h3>
${slide('ga-12', 5, 'The called side sees the caller’s github context, not its env')}
<p>The first step of the called job printed its surroundings (run ${RUN(36029548881)}, job <code>mot-lan / dung</code>):</p>
<div class="out">github.workflow     = ch12-goi
github.workflow_ref = cuonghoang1103/ga-san-tap/.github/workflows/ch12-goi.yml@refs/heads/ch12-tai-su-dung
github.job          = dung
github.event_name   = push
inputs: moi-truong=dev cho-giay=2 chay-test=true
chay-test la boolean that: true
TU_BEN_GOI (env muc workflow cua ben goi) = '&lt;rong&gt;'</div>
<ul>
<li><strong><code>github.*</code> belongs to the caller.</strong> <code>github.workflow</code> is <code>ch12-goi</code>, and <code>workflow_ref</code> points at the <em>caller&#39;s</em> file. If you want to know which file is running inside a reusable workflow, the context will not tell you; the Set up job line <code>Uses: …/ch12-r-dung.yml@refs/heads/ch12-tai-su-dung (55b77f9d…)</code> will. The token also belongs to the caller: the called workflow is "automatically granted access to <code>github.token</code>", and billing for its minutes goes to the caller too.</li>
<li><strong><code>github.job</code> is the inner job id.</strong> <code>dung</code>, not <code>mot-lan</code>.</li>
<li><strong>The caller&#39;s workflow-level <code>env:</code> does not cross.</strong> The caller sets <code>TU_BEN_GOI: co-gia-tri-o-ben-goi</code> at the top of its file; the plain caller job <code>doc-ket-qua</code> sees it, the called job sees nothing. To send a value in, make it an input. To share a value between many workflows, use a configuration variable (<code>vars.X</code>), which every workflow reads directly.</li>
<li><strong>Inputs keep their types.</strong> A <code>boolean</code> input compared with <code>== true</code> behaves as a boolean — unlike the inputs of an action, which are always strings (Lesson 12.2).</li>
</ul>

<h3>Calling with a matrix, and the output that survives</h3>
${slide('ga-12', 6, 'Matrix calls: three runs, one output — from the last to finish')}
<p>A job that calls a reusable workflow can have a <code>strategy.matrix</code>, which is how you deploy the same pipeline to three environments. The sandbox made the three runs finish in a known order by sleeping 1, 25 and 8 seconds:</p>
<pre><code class="language-yaml">  ma-tran:
    strategy:
      matrix:
        include:
          - { mt: dev,   cho: 1 }
          - { mt: stage, cho: 25 }
          - { mt: prod,  cho: 8 }
    uses: ./.github/workflows/ch12-r-dung.yml
    with: { moi-truong: &#36;{{ matrix.mt }}, cho-giay: &#36;{{ matrix.cho }} }</code></pre>
<div class="out">xong dev luc 16:45:22
xong prod luc 16:45:30
xong stage luc 16:45:47
# job doc-ket-qua:
ma-tran.result     = success
ma-tran.moi-truong = stage   (3 lan chay, output chi con MOT)
ma-tran.ban-dung   = 1.4.1-stage</div>
<p>Three runs, one output — and it is <code>stage</code>, not <code>prod</code>, even though <code>prod</code> is last in the list. The docs describe the rule precisely: the output is the one "set by the last successful completing reusable workflow of the matrix which actually sets a value". Order of finishing, not order of listing. If you need all three values (three image digests, three URLs), outputs are the wrong channel: have each matrix run upload an artifact, or write a summary job that collects them.</p>

<h3>Secrets: what "required" checks, and what "inherit" really passes</h3>
${slide('ga-12', 7, 'Secrets: required only checks the name is written; inherit passes everything')}
<p>The sandbox repository has <strong>no repository secrets at all</strong> — a fact the first experiment revealed by accident. The caller passed <code>ma-thu: &#36;{{ secrets.CH06_GIA }}</code>, a secret that does not exist, to an input declared <code>required: true</code>:</p>
<div class="out">env:
  MA:
do dai ma-thu = 0
in thang ma-thu: </div>
<p>The job was green. <code>required: true</code> on a secret means "the caller must write this key under <code>secrets:</code>"; it does not check that the value behind it exists or is non-empty. If a missing secret must stop the pipeline, the called workflow has to check it itself, first thing:</p>
<pre><code class="language-yaml">      - name: Secret phai co gia tri
        env: { MA: &#36;{{ secrets.ma-thu }} }
        run: test -n "$MA" || { echo "::error::secret ma-thu rong"; exit 1; }</code></pre>
<p>The second call passed a plain string: <code>ma-thu: gia-tri-thu-khong-that-123</code>. Inside, the value arrived with length 26 and every echo of it printed <code>***</code>. Anything passed through <code>secrets:</code> is registered for masking, even a literal — useful to know, and a reason never to pass real credentials as literals, since the literal itself sits in the workflow file for anyone to read.</p>
<p>Then a chain of three workflows, A → B → C (run ${RUN(36029944118)}). A passes two secrets, <code>mot</code> and <code>hai</code>, to B. B calls C twice: once with <code>secrets: inherit</code>, once with only <code>mot</code>. C declares only <code>mot</code>. Each level printed the <em>names</em> of the secrets it received (the values print as <code>***</code>):</p>
<div class="out">a / b-nhin            ["github_token","hai","mot"]
a / c-inherit / c-nhin  ["github_token","hai","mot"]   do dai mot = 19
a / c-mot / c-nhin      ["github_token","mot"]         do dai mot = 19</div>
<p><code>secrets: inherit</code> handed C <strong>both</strong> secrets, including <code>hai</code>, which C never declared. That is the real meaning of inherit: "everything I have", not "everything you asked for". It also shows that secrets only travel one level at a time: C gets from B only what B passes, so in a chain every level must pass explicitly or inherit. One more detail from the first chain (run ${RUN(36029549322)}): when B mapped a secret from an empty value, that key did not appear in C&#39;s <code>secrets</code> context at all. An empty secret and a missing secret are the same thing.</p>

<div class="callout warn">
<p><strong>Prefer an explicit list.</strong> <code>secrets: inherit</code> is convenient inside one repository where one team owns every file. Across teams it quietly gives a shared workflow every credential of every caller — including ones added next year. An explicit list is also documentation: it says what the workflow needs.</p>
</div>

<h3>Three limits you only meet when it runs</h3>
${slide('ga-12', 8, 'Three limits that only show up at run time — actionlint catches none')}
<p><strong>Permissions only go down.</strong> The caller sets <code>permissions:</code>, and that is the ceiling for everything it calls. In run ${RUN(36029549200)} the caller granted <code>contents: read, issues: write</code>. A called job that declared <code>contents: read</code> ran with <code>Contents: read, Metadata: read</code> — it dropped <code>issues: write</code>. A called job that declared nothing received exactly the caller&#39;s set, <code>Contents: read, Issues: write, Metadata: read</code>, as its Set up job log shows. Asking for more fails before any job starts. Run ${RUN(36029549264)} ended in <code>startup_failure</code> with no jobs:</p>
<div class="out">Invalid workflow file: .github/workflows/ch12-quyen-nang.yml#L11.
The nested job 'nang' is requesting 'contents: write', but is only allowed 'contents: read'.</div>
<p>Line 11 is the calling job in the <em>caller&#39;s</em> file — the error is reported where the ceiling was set, not where the request was made.</p>
<p><strong>Concurrency groups must not collide.</strong> Because <code>github.workflow</code> inside a called workflow is the caller&#39;s name, using <code>&#36;{{ github.workflow }}</code> as the concurrency group on both sides puts the caller job and the called job in the same group. With <code>cancel-in-progress: true</code>, run ${RUN(36029548974)} lasted two seconds:</p>
<div class="out">Canceling since a deadlock was detected for concurrency group: 'ch12-dua' between 'goi' and 'goi / ben-trong'</div>
<p>Put the concurrency group on one side only — normally the caller, which knows what "the same deployment" means.</p>
<p><strong>Nesting depth: the documentation is off by one.</strong> The docs (September 2026) say you can connect "ten levels of workflows — that is, the top-level caller workflow and up to nine levels of reusable workflows". The sandbox built a chain of thirty one-job reusable workflows and entered it at different depths. The caller plus <em>ten</em> called levels ran (run ${RUN(36029947653)}; the deepest job is named <code>vao / tang-01 / tang-02 / … / tang-09 / day</code>). The caller plus eleven failed at once (run ${RUN(36030076095)}):</p>
<div class="out">job "d29" calls workflow "./.github/workflows/ch12-r-d30.yml", but doing so would exceed the limit on called workflow depth of 10</div>
<p>So the enforced limit is ten <em>called</em> levels, plus the caller. Nobody should design a pipeline anywhere near either number — three levels is already hard to debug — but the lesson generalises: when docs and the system disagree, the error message is what the system enforces. The other documented limit, 50 unique reusable workflows per top-level file (nested ones included), was not tested.</p>
<p>actionlint 1.7.12 flagged none of these three. It checks the syntax of each file; the permission ceiling, the concurrency collision and the depth only exist when the files are put together at run time.</p>

<h3>Run it step by step: your first reusable workflow</h3>
<ol>
<li>Create <code>.github/workflows/ci-dung-chung.yml</code> with <code>on: workflow_call:</code> and one input, <code>node-version</code> (<code>type: string</code>, <code>default: '22'</code>).</li>
<li>Give it one job <code>kiem-tra</code> with <code>runs-on</code>, checkout, <code>setup-node</code> using <code>&#36;{{ inputs.node-version }}</code>, and your install/test commands.</li>
<li>Add a step with <code>id: kq</code> that writes <code>ket-qua=ok</code> to <code>$GITHUB_OUTPUT</code>; wire it to <code>jobs.kiem-tra.outputs.ket-qua</code>, then to <code>on.workflow_call.outputs.ket-qua.value</code>.</li>
<li>In <code>ci.yml</code>, replace the old job with <code>uses: ./.github/workflows/ci-dung-chung.yml</code> and <code>with: { node-version: '24' }</code>. Add <code>permissions: contents: read</code> at the top.</li>
<li>Add a job with <code>needs: [&lt;calling job&gt;]</code> that echoes <code>&#36;{{ needs.&lt;calling job&gt;.outputs.ket-qua }}</code>.</li>
<li>Push, open the run, and check three things: the job name is "caller / inner", the Set up job log has a <code>Uses:</code> line and an <code>Inputs</code> group, and the last job prints <code>ok</code>.</li>
</ol>

<h3>Re-runs and pinning</h3>
<p>A reusable workflow from another repository is referenced as <code>owner/repo/.github/workflows/file.yml@ref</code>, where the ref can be a SHA, a tag or a branch — the same choice as for actions (Lesson 4.2), with the same answer: a full SHA plus a version comment. Run ${RUN(36029943782)} called the sandbox&#39;s own workflow that way, <code>@55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94</code>, and the API recorded it with a SHA and no branch. The docs add a detail that matters when the ref is <em>not</em> a SHA: "Re-run all jobs" resolves the ref again and may pick up a newer version, while "Re-run failed jobs" uses the SHA of the first attempt. A re-run can therefore run different code from the run it is re-running — one more reason to pin.</p>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How does a reusable workflow return a value to the caller?</strong><br>A: Through outputs wired in four layers: a step writes to <code>$GITHUB_OUTPUT</code>, the job maps it in <code>outputs:</code>, <code>on.workflow_call.outputs.&lt;name&gt;.value</code> maps the job output, and the caller reads <code>needs.&lt;calling-job&gt;.outputs.&lt;name&gt;</code>. <code>env</code> and <code>GITHUB_ENV</code> do not cross the boundary.</p>
<p><strong>Q: You call a reusable workflow with a three-value matrix. What does <code>needs.x.outputs</code> contain?</strong><br>A: One value, from the run that finished last successfully and set it — not all three, and not necessarily the last in the list. Collect per-run results with artifacts or a summary job.</p>
<p><strong>Q: What is the difference between <code>secrets: inherit</code> and passing secrets explicitly?</strong><br>A: Inherit passes every secret the caller has, including ones the called workflow never declared; explicit passing sends only the listed ones and documents the dependency. Across teams, prefer explicit. In both cases <code>required: true</code> only checks that the key is mentioned, not that it has a value.</p>
<p><strong>Q: Can a called workflow get more permissions than the caller?</strong><br>A: No. The caller&#39;s <code>permissions:</code> is the ceiling; the called workflow can only keep or lower it. Requesting more is a startup failure.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your repository&#39;s CI runs "install, lint, test" in one file. Turn that into a reusable workflow and measure what changes.</p><ol>
<li>Do the six steps of "Run it step by step" above in your own repository (or a test repository).</li>
<li>Add a second caller job with <code>strategy.matrix.node: ['22', '24']</code> that calls the same workflow with <code>node-version: &#36;{{ matrix.node }}</code>. Before it runs, write down which value you expect in <code>needs.&lt;job&gt;.outputs</code>; then check.</li>
<li>Add <code>env: { THU: co }</code> at the top of the caller and print <code>$THU</code> inside the called job.</li>
<li>Add a <code>secrets:</code> block with <code>required: true</code> and call it with a secret name that does not exist in your repository.</li>
</ol><p><strong>Done when:</strong> the run graph shows jobs named "caller / inner"; you can point to the <code>Uses:</code> line and the <code>Inputs</code> group in Set up job; your matrix prediction was right (or you can explain why not); <code>$THU</code> printed empty; and the missing-secret call was green — you can explain why each of the last two happened.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">reusable workflow</span><span class="v">a workflow file with <code>on: workflow_call</code>, called from a job with <code>uses:</code></span></div>
<div class="kv"><span class="k">caller / called workflow</span><span class="v">the file that contains the <code>uses:</code> job, and the file it points at</span></div>
<div class="kv"><span class="k"><code>workflow_call</code></span><span class="v">the trigger that makes a workflow callable; declares <code>inputs</code>, <code>secrets</code>, <code>outputs</code></span></div>
<div class="kv"><span class="k">typed input</span><span class="v"><code>string</code>, <code>number</code> or <code>boolean</code>; a boolean compares as a boolean</span></div>
<div class="kv"><span class="k"><code>secrets: inherit</code></span><span class="v">pass every secret of the caller, declared or not, to the directly called workflow</span></div>
<div class="kv"><span class="k">permission ceiling</span><span class="v">the caller&#39;s <code>permissions:</code>; the called workflow can only lower it</span></div>
<div class="kv"><span class="k">nesting depth</span><span class="v">measured: ten called levels plus the caller; the eleventh is refused at startup</span></div>
<div class="kv"><span class="k"><code>referenced_workflows</code></span><span class="v">field of a run in the API that records every called workflow with its path and SHA</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Calling a reusable workflow adds jobs to your run, each on its own runner, named "caller job / inner job".</li>
<li>Inputs are typed; outputs must be wired through four layers; <code>env</code> does not cross; <code>github.*</code> is the caller&#39;s.</li>
<li>A matrix call keeps one output: from the run that finished last, not the one listed last.</li>
<li><code>required: true</code> on a secret checks that it is mentioned, not that it has a value; <code>inherit</code> passes everything, declared or not.</li>
<li>Permissions only go down; a shared concurrency group deadlocks; nesting stops after ten called levels — all only visible at run time.</li>
<li>Pin cross-repository calls to a full SHA; a re-run of all jobs may otherwise pick up different code.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reuse workflows</span><span class="lc-sub">docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows — calling, matrix, nesting, passing secrets to nested workflows, and the rule for matrix outputs quoted above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflow configurations (reference)</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations — limitations, supported keywords for the calling job, runners, permissions for nested workflows, and re-run behaviour.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — <code>on.workflow_call.inputs</code>, <code>secrets</code>, <code>outputs</code>, and <code>jobs.&lt;job_id&gt;.secrets.inherit</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch12-tai-su-dung</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch12-tai-su-dung — every workflow in this lesson (<code>ch12-goi</code>, <code>ch12-long2</code>, <code>ch12-quyen-*</code>, <code>ch12-dua</code>, <code>ch12-sau-*</code>), with its runs.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — one deployment pipeline, several environments</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — where a matrix of environments calling one reusable deploy workflow is heading, and why the order of finishing matters there.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Workflow dùng lại: input, secret, output, và những giới hạn chỉ gặp lúc chạy</h2>
<p class="lead">Workflow dùng lại (reusable workflow) là một tệp workflow có <code>on: workflow_call</code>, và "gọi" nó nghĩa là thêm một job nữa vào lần chạy của bạn. Gần như mọi bất ngờ trong bài này đều suy ra từ câu đó: workflow được gọi có runner riêng, nhìn thấy context <code>github</code> của bên gọi, KHÔNG nhìn thấy <code>env</code> của bên gọi, và chỉ trả giá trị về qua những output bạn tự nối tay.</p>

<p>Bài 4.5 mới cho xem bản gói gọn trong một màn hình và một cái bẫy (quên <code>secrets:</code> thì nhận chuỗi rỗng chứ không nhận lỗi). Bài này đi nốt phần còn lại: input có kiểu, output đi qua bốn tầng, gọi bằng ma trận, secret đi qua một chuỗi ba workflow, quyền, concurrency, và độ sâu lồng — từng thứ đều ĐO trên sân tập chứ không diễn giải lại docs. Một trong các phép đo ra kết quả khác docs.</p>

<h3>Một lời gọi trông thế nào trong lần chạy</h3>
${slide('ga-12', 3, 'Gọi một workflow = thêm một job, chạy trên runner riêng')}
<p>Workflow <code>ch12-goi.yml</code> trên sân tập (bên GỌI) gọi <code>ch12-r-dung.yml</code> (bên ĐƯỢC GỌI) theo ba cách: một lần, một lần với chuỗi thường làm secret, và bằng một ma trận ba giá trị. Rồi một job bình thường đọc output. Run ${RUN(36029548881)} sinh ra sáu job:</p>
<div class="out">mot-lan / dung                 success   5s
chuoi-thuong / dung            success   5s
ma-tran (dev, 1) / dung        success   5s
ma-tran (stage, 25) / dung     success  29s
ma-tran (prod, 8) / dung       success  11s
doc-ket-qua                    success   3s</div>
<ul>
<li><strong>Tên job là "job bên gọi / job bên trong".</strong> <code>mot-lan</code> là id của job ở bên gọi; <code>dung</code> là id job bên trong tệp được gọi. Ma trận thì thêm giá trị trong ngoặc. Khi bạn lục một run dài để tìm "job nào đỏ", cách đặt tên này chỉ thẳng về chỗ gọi.</li>
<li><strong>Mỗi lời gọi là một job riêng trên một runner riêng.</strong> Các job được gọi được tạo lúc 16:45:17 và bắt đầu 2–4 giây sau, y hệt job thường. Không có "gọi hàm" nào chạy chung tiến trình: một reusable workflow tốn một lần khởi động job (xếp hàng + Set up job) cho MỖI job bên trong nó.</li>
<li><strong>Workflow được gọi không có run riêng.</strong> Nó không hiện thành một dòng riêng trong danh sách Actions; nó sống bên trong run của bên gọi. Thay vào đó API ghi lại: đối tượng run 36029548881 có trường <code>referenced_workflows</code> liệt kê đúng đường dẫn và SHA đã dùng.</li>
</ul>

<h3>Khai giao diện: input, secret, output</h3>
${slide('ga-12', 4, 'workflow_call khai ba thứ; output phải nối qua BỐN tầng')}
<p>Workflow được gọi khai giao diện của nó dưới <code>on.workflow_call</code>. Đây là tệp trên sân tập, đã rút gọn:</p>
<pre><code class="language-yaml">on:
  workflow_call:
    inputs:
      moi-truong: { type: string,  required: true }
      cho-giay:   { type: number,  default: 1 }
      chay-test:  { type: boolean, default: true }
    secrets:
      ma-thu: { required: true }
    outputs:
      ban-dung:
        value: &#36;{{ jobs.dung.outputs.ban }}      # (3) output workflow &lt;- output job
jobs:
  dung:
    runs-on: ubuntu-24.04
    outputs:
      ban: &#36;{{ steps.b.outputs.ban }}           # (2) output job &lt;- output bước
    steps:
      - id: b
        env: { MOI_TRUONG: &#36;{{ inputs.moi-truong }} }
        run: echo "ban=1.4.&#36;{{ github.run_number }}-$MOI_TRUONG" &gt;&gt; "$GITHUB_OUTPUT"   # (1)</code></pre>
<p>Và bên gọi:</p>
<pre><code class="language-yaml">jobs:
  mot-lan:
    uses: ./.github/workflows/ch12-r-dung.yml
    with: { moi-truong: dev, cho-giay: 2 }
    secrets: { ma-thu: &#36;{{ secrets.CH06_GIA }} }
  doc-ket-qua:
    needs: [mot-lan]
    runs-on: ubuntu-24.04
    steps:
      - env: { A: &#36;{{ needs.mot-lan.outputs.ban-dung }} }   # (4)
        run: echo "$A"          # -&gt; 1.4.1-dev</code></pre>
<table>
<thead><tr><th>Khoá</th><th>Làm gì</th><th>Sân tập cho thấy</th></tr></thead>
<tbody>
<tr><td><code>inputs.&lt;id&gt;.type</code></td><td><code>string</code>, <code>number</code> hoặc <code>boolean</code> — kiểu THẬT</td><td><code>&#36;{{ inputs.chay-test == true }}</code> in <code>true</code>; với <code>chay-test: false</code> thì in <code>false</code></td></tr>
<tr><td><code>inputs.&lt;id&gt;.required</code> / <code>default</code></td><td>kiểm lúc run bắt đầu</td><td>log Set up job in mọi input, kể cả giá trị mặc định, trong nhóm tên <code>Inputs</code></td></tr>
<tr><td><code>secrets.&lt;id&gt;.required</code></td><td>kiểm bên gọi CÓ GHI secret đó</td><td>không kiểm nó có giá trị — xem bên dưới</td></tr>
<tr><td><code>outputs.&lt;id&gt;.value</code></td><td>phải trỏ vào output của một <strong>job</strong></td><td>bước → job → workflow → <code>needs</code>: bốn tầng, tầng nào cũng nối tay</td></tr>
</tbody>
</table>
<p>Job gọi một reusable workflow không phải job thường. Nó chỉ được dùng <code>name</code>, <code>uses</code>, <code>with</code>, <code>secrets</code>, <code>strategy</code>, <code>needs</code>, <code>if</code>, <code>concurrency</code>, <code>permissions</code> (và <code>cache-mode</code>, một từ khoá mới trong docs). Không <code>runs-on</code>, không <code>steps</code>, không <code>env</code>, không <code>timeout-minutes</code> — mấy thứ đó thuộc về các job bên trong tệp được gọi.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — mắt xích đứt không tiếng động.</strong> Quên bất kỳ tầng nào trong bốn — <code>id</code> của bước, <code>outputs:</code> của job, <code>outputs:</code> của workflow, hay gõ sai tên trong <code>needs.&lt;job&gt;.outputs</code> — là bạn nhận chuỗi rỗng. Không lỗi, không cảnh báo. Nạn nhân kinh điển là script deploy đọc số phiên bản từ một reusable workflow dựng ảnh: thẻ ảnh thành <code>myapp:</code> và lệnh push hỏng ba bước sau với thông báo về "invalid reference format". Output rỗng thì đi lần lượt bốn tầng trước khi nhìn chỗ nào khác.</div>

<h3>Workflow được gọi nhìn thấy gì</h3>
${slide('ga-12', 5, 'Bên được gọi thấy github.* của bên GỌI, không thấy env')}
<p>Bước đầu tiên của job được gọi in ra xung quanh nó (run ${RUN(36029548881)}, job <code>mot-lan / dung</code>):</p>
<div class="out">github.workflow     = ch12-goi
github.workflow_ref = cuonghoang1103/ga-san-tap/.github/workflows/ch12-goi.yml@refs/heads/ch12-tai-su-dung
github.job          = dung
github.event_name   = push
inputs: moi-truong=dev cho-giay=2 chay-test=true
chay-test la boolean that: true
TU_BEN_GOI (env muc workflow cua ben goi) = '&lt;rong&gt;'</div>
<ul>
<li><strong><code>github.*</code> là của bên gọi.</strong> <code>github.workflow</code> là <code>ch12-goi</code>, và <code>workflow_ref</code> trỏ vào tệp CỦA BÊN GỌI. Muốn biết bên trong reusable workflow đang chạy tệp nào thì context không trả lời; dòng Set up job <code>Uses: …/ch12-r-dung.yml@refs/heads/ch12-tai-su-dung (55b77f9d…)</code> mới trả lời. Token cũng là của bên gọi: docs viết workflow được gọi "tự động được cấp quyền dùng <code>github.token</code>", và phút chạy của nó cũng tính tiền vào bên gọi.</li>
<li><strong><code>github.job</code> là id job bên trong.</strong> <code>dung</code>, không phải <code>mot-lan</code>.</li>
<li><strong><code>env:</code> mức workflow của bên gọi KHÔNG sang.</strong> Bên gọi đặt <code>TU_BEN_GOI: co-gia-tri-o-ben-goi</code> ở đầu tệp; job thường <code>doc-ket-qua</code> của bên gọi thấy nó, job được gọi thì không thấy gì. Muốn đưa một giá trị vào thì biến nó thành input. Muốn dùng chung một giá trị cho nhiều workflow thì dùng biến cấu hình (<code>vars.X</code>) — workflow nào cũng đọc thẳng được.</li>
<li><strong>Input giữ nguyên kiểu.</strong> Một input <code>boolean</code> so với <code>== true</code> thì hành xử đúng như boolean — khác với input của một action, thứ luôn là chuỗi (Bài 12.2).</li>
</ul>

<h3>Gọi bằng ma trận, và cái output sống sót</h3>
${slide('ga-12', 6, 'Ma trận gọi reusable: ba lần chạy, output chỉ còn MỘT')}
<p>Job gọi một reusable workflow được phép có <code>strategy.matrix</code> — đó là cách deploy cùng một pipeline lên ba môi trường. Sân tập cho ba lần chạy xong theo một thứ tự biết trước bằng cách ngủ 1, 25 và 8 giây:</p>
<pre><code class="language-yaml">  ma-tran:
    strategy:
      matrix:
        include:
          - { mt: dev,   cho: 1 }
          - { mt: stage, cho: 25 }
          - { mt: prod,  cho: 8 }
    uses: ./.github/workflows/ch12-r-dung.yml
    with: { moi-truong: &#36;{{ matrix.mt }}, cho-giay: &#36;{{ matrix.cho }} }</code></pre>
<div class="out">xong dev luc 16:45:22
xong prod luc 16:45:30
xong stage luc 16:45:47
# job doc-ket-qua:
ma-tran.result     = success
ma-tran.moi-truong = stage   (3 lan chay, output chi con MOT)
ma-tran.ban-dung   = 1.4.1-stage</div>
<p>Ba lần chạy, một output — và nó là <code>stage</code>, không phải <code>prod</code>, dù <code>prod</code> đứng cuối danh sách. Docs mô tả luật này rất chính xác: output là giá trị "do lần chạy reusable workflow HOÀN THÀNH THÀNH CÔNG CUỐI CÙNG của ma trận mà thật sự có đặt giá trị". Thứ tự XONG, không phải thứ tự LIỆT KÊ. Nếu bạn cần cả ba giá trị (ba digest ảnh, ba URL), output là kênh sai: cho mỗi lần chạy trong ma trận upload một artifact, hoặc viết một job tổng hợp gom chúng lại.</p>

<h3>Secret: "required" kiểm cái gì, và "inherit" thật sự đưa gì</h3>
${slide('ga-12', 7, 'Secret: required chỉ kiểm có GHI tên; inherit đưa TẤT CẢ')}
<p>Kho sân tập <strong>không có một repository secret nào</strong> — sự thật mà thí nghiệm đầu tiên tình cờ lộ ra. Bên gọi đưa <code>ma-thu: &#36;{{ secrets.CH06_GIA }}</code>, một secret không tồn tại, vào một secret được khai <code>required: true</code>:</p>
<div class="out">env:
  MA:
do dai ma-thu = 0
in thang ma-thu: </div>
<p>Job xanh. <code>required: true</code> trên một secret nghĩa là "bên gọi phải VIẾT khoá này dưới <code>secrets:</code>"; nó không kiểm giá trị đằng sau có tồn tại hay không rỗng. Nếu thiếu secret là phải dừng pipeline, workflow được gọi tự kiểm lấy, ngay bước đầu:</p>
<pre><code class="language-yaml">      - name: Secret phai co gia tri
        env: { MA: &#36;{{ secrets.ma-thu }} }
        run: test -n "$MA" || { echo "::error::secret ma-thu rong"; exit 1; }</code></pre>
<p>Lời gọi thứ hai đưa một chuỗi thường: <code>ma-thu: gia-tri-thu-khong-that-123</code>. Bên trong, giá trị tới nơi với độ dài 26, và mọi lần in nó đều ra <code>***</code>. Bất cứ thứ gì đi qua <code>secrets:</code> đều được đăng ký để che, kể cả một chuỗi viết thẳng — đáng biết, và cũng là lý do đừng bao giờ viết thẳng khoá thật, vì bản thân chuỗi đó nằm trong tệp workflow cho ai cũng đọc được.</p>
<p>Rồi một chuỗi ba workflow, A → B → C (run ${RUN(36029944118)}). A đưa hai secret, <code>mot</code> và <code>hai</code>, cho B. B gọi C hai lần: một lần với <code>secrets: inherit</code>, một lần chỉ đưa <code>mot</code>. C chỉ KHAI <code>mot</code>. Mỗi tầng in ra TÊN các secret nó nhận được (giá trị thì in ra <code>***</code>):</p>
<div class="out">a / b-nhin            ["github_token","hai","mot"]
a / c-inherit / c-nhin  ["github_token","hai","mot"]   do dai mot = 19
a / c-mot / c-nhin      ["github_token","mot"]         do dai mot = 19</div>
<p><code>secrets: inherit</code> đưa cho C <strong>cả hai</strong> secret, kể cả <code>hai</code> mà C chưa từng khai. Đó mới là nghĩa thật của inherit: "mọi thứ tôi có", không phải "mọi thứ anh xin". Nó cũng cho thấy secret chỉ đi được MỘT tầng mỗi lần: C chỉ nhận từ B đúng thứ B đưa, nên trong một chuỗi, tầng nào cũng phải đưa tường minh hoặc inherit. Thêm một chi tiết từ chuỗi đầu tiên (run ${RUN(36029549322)}): khi B ánh xạ một secret từ giá trị rỗng, khoá đó KHÔNG hề xuất hiện trong context <code>secrets</code> của C. Secret rỗng và secret không tồn tại là một.</p>

<div class="callout warn">
<p><strong>Ưu tiên liệt kê tường minh.</strong> <code>secrets: inherit</code> tiện trong một kho mà một đội sở hữu mọi tệp. Sang tới nhiều đội, nó lặng lẽ đưa cho một workflow dùng chung MỌI khoá của MỌI bên gọi — kể cả những khoá được thêm vào năm sau. Danh sách tường minh còn là tài liệu: nó nói workflow cần gì.</p>
</div>

<h3>Ba giới hạn chỉ gặp khi chạy</h3>
${slide('ga-12', 8, 'Ba giới hạn chỉ lộ ra khi CHẠY — actionlint không bắt cái nào')}
<p><strong>Quyền chỉ đi xuống.</strong> Bên gọi đặt <code>permissions:</code>, và đó là TRẦN cho mọi thứ nó gọi. Ở run ${RUN(36029549200)}, bên gọi cấp <code>contents: read, issues: write</code>. Một job được gọi khai <code>contents: read</code> đã chạy với <code>Contents: read, Metadata: read</code> — nó bỏ <code>issues: write</code>. Một job được gọi không khai gì thì nhận đúng bộ quyền của bên gọi, <code>Contents: read, Issues: write, Metadata: read</code>, như log Set up job của nó ghi. Xin nhiều hơn thì hỏng trước cả khi job nào bắt đầu. Run ${RUN(36029549264)} kết thúc bằng <code>startup_failure</code>, không có job nào:</p>
<div class="out">Invalid workflow file: .github/workflows/ch12-quyen-nang.yml#L11.
The nested job 'nang' is requesting 'contents: write', but is only allowed 'contents: read'.</div>
<p>Dòng 11 là job gọi trong tệp CỦA BÊN GỌI — lỗi được báo ở chỗ đặt trần, không phải ở chỗ xin.</p>
<p><strong>Nhóm concurrency không được đụng nhau.</strong> Vì <code>github.workflow</code> bên trong workflow được gọi là tên của bên gọi, dùng <code>&#36;{{ github.workflow }}</code> làm concurrency group ở CẢ hai phía sẽ đặt job gọi và job được gọi vào cùng một nhóm. Với <code>cancel-in-progress: true</code>, run ${RUN(36029548974)} kéo dài đúng hai giây:</p>
<div class="out">Canceling since a deadlock was detected for concurrency group: 'ch12-dua' between 'goi' and 'goi / ben-trong'</div>
<p>Đặt concurrency group ở MỘT phía thôi — thường là bên gọi, bên biết "cùng một đợt deploy" nghĩa là gì.</p>
<p><strong>Độ sâu lồng: docs lệch một tầng.</strong> Docs (09/2026) viết bạn nối được "mười tầng workflow — tức là workflow gọi ở trên cùng và tối đa chín tầng reusable workflow". Sân tập dựng một chuỗi ba mươi reusable workflow một-job rồi vào chuỗi ở các độ sâu khác nhau. Bên gọi cộng <em>mười</em> tầng được gọi CHẠY (run ${RUN(36029947653)}; job sâu nhất tên <code>vao / tang-01 / tang-02 / … / tang-09 / day</code>). Bên gọi cộng mười một thì hỏng ngay (run ${RUN(36030076095)}):</p>
<div class="out">job "d29" calls workflow "./.github/workflows/ch12-r-d30.yml", but doing so would exceed the limit on called workflow depth of 10</div>
<p>Vậy giới hạn thật được áp là mười tầng ĐƯỢC GỌI, cộng bên gọi. Không ai nên thiết kế pipeline gần con số nào trong hai — ba tầng đã khó gỡ lỗi — nhưng bài học thì dùng được ở chỗ khác: khi docs và hệ thống nói khác nhau, thông báo lỗi mới là thứ hệ thống áp. Giới hạn còn lại trong docs, 50 reusable workflow khác nhau cho một tệp gọi (tính cả các tầng lồng), chưa được đo.</p>
<p>actionlint 1.7.12 không báo cái nào trong ba. Nó kiểm cú pháp từng tệp; trần quyền, va chạm concurrency và độ sâu chỉ tồn tại khi các tệp được ghép lại lúc chạy.</p>

<h3>Chạy thử từng bước: reusable workflow đầu tiên của bạn</h3>
<ol>
<li>Tạo <code>.github/workflows/ci-dung-chung.yml</code> với <code>on: workflow_call:</code> và một input <code>node-version</code> (<code>type: string</code>, <code>default: '22'</code>).</li>
<li>Cho nó một job <code>kiem-tra</code> có <code>runs-on</code>, checkout, <code>setup-node</code> dùng <code>&#36;{{ inputs.node-version }}</code>, và các lệnh cài/test của bạn.</li>
<li>Thêm một bước <code>id: kq</code> ghi <code>ket-qua=ok</code> vào <code>$GITHUB_OUTPUT</code>; nối nó vào <code>jobs.kiem-tra.outputs.ket-qua</code>, rồi vào <code>on.workflow_call.outputs.ket-qua.value</code>.</li>
<li>Trong <code>ci.yml</code>, thay job cũ bằng <code>uses: ./.github/workflows/ci-dung-chung.yml</code> kèm <code>with: { node-version: '24' }</code>. Thêm <code>permissions: contents: read</code> ở đầu tệp.</li>
<li>Thêm một job <code>needs: [&lt;job gọi&gt;]</code> in <code>&#36;{{ needs.&lt;job gọi&gt;.outputs.ket-qua }}</code>.</li>
<li>Push, mở run, kiểm ba điều: tên job là "gọi / trong", log Set up job có dòng <code>Uses:</code> và nhóm <code>Inputs</code>, job cuối in ra <code>ok</code>.</li>
</ol>

<h3>Chạy lại, và ghim phiên bản</h3>
<p>Reusable workflow ở kho khác được tham chiếu bằng <code>owner/repo/.github/workflows/tep.yml@ref</code>, trong đó ref có thể là SHA, thẻ hay nhánh — đúng lựa chọn như với action (Bài 4.2), và cùng câu trả lời: SHA đầy đủ kèm chú thích phiên bản. Run ${RUN(36029943782)} gọi chính workflow của sân tập theo cách đó, <code>@55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94</code>, và API ghi lại nó bằng SHA, không có nhánh. Docs thêm một chi tiết quan trọng khi ref KHÔNG phải SHA: "Re-run all jobs" giải lại ref và có thể lấy bản mới hơn, còn "Re-run failed jobs" dùng SHA của lần chạy đầu. Nghĩa là một lần chạy lại có thể chạy mã khác với chính run mà nó chạy lại — thêm một lý do để ghim.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Reusable workflow trả giá trị về cho bên gọi bằng cách nào?</strong><br>Đ: Bằng output nối qua bốn tầng: một bước ghi vào <code>$GITHUB_OUTPUT</code>, job ánh xạ nó trong <code>outputs:</code>, <code>on.workflow_call.outputs.&lt;tên&gt;.value</code> ánh xạ output của job, và bên gọi đọc <code>needs.&lt;job-gọi&gt;.outputs.&lt;tên&gt;</code>. <code>env</code> và <code>GITHUB_ENV</code> không vượt qua ranh giới.</p>
<p><strong>H: Bạn gọi một reusable workflow bằng ma trận ba giá trị. <code>needs.x.outputs</code> chứa gì?</strong><br>Đ: Một giá trị, của lần chạy XONG THÀNH CÔNG CUỐI CÙNG có đặt giá trị — không phải cả ba, và không nhất thiết là cái cuối danh sách. Muốn gom kết quả từng lần thì dùng artifact hoặc một job tổng hợp.</p>
<p><strong>H: <code>secrets: inherit</code> khác truyền secret tường minh thế nào?</strong><br>Đ: Inherit đưa mọi secret bên gọi có, kể cả thứ workflow được gọi không khai; truyền tường minh chỉ đưa những cái được liệt kê và ghi lại sự phụ thuộc. Giữa nhiều đội thì chọn tường minh. Cả hai trường hợp, <code>required: true</code> chỉ kiểm khoá có được nhắc tới, không kiểm có giá trị.</p>
<p><strong>H: Workflow được gọi có nhận được nhiều quyền hơn bên gọi không?</strong><br>Đ: Không. <code>permissions:</code> của bên gọi là trần; bên được gọi chỉ giữ hoặc hạ. Xin nhiều hơn là startup failure.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> CI của kho bạn chạy "cài, lint, test" trong một tệp. Biến nó thành reusable workflow và đo xem thứ gì thay đổi.</p><ol>
<li>Làm sáu bước của mục "Chạy thử từng bước" ở trên trong kho của bạn (hoặc một kho thử).</li>
<li>Thêm một job gọi thứ hai có <code>strategy.matrix.node: ['22', '24']</code>, gọi cùng workflow với <code>node-version: &#36;{{ matrix.node }}</code>. TRƯỚC khi nó chạy, ghi ra giấy giá trị bạn đoán sẽ có trong <code>needs.&lt;job&gt;.outputs</code>; rồi kiểm.</li>
<li>Thêm <code>env: { THU: co }</code> ở đầu bên gọi và in <code>$THU</code> bên trong job được gọi.</li>
<li>Thêm một khối <code>secrets:</code> với <code>required: true</code> và gọi nó bằng một tên secret không có trong kho của bạn.</li>
</ol><p><strong>Đạt khi:</strong> đồ thị run có job tên "gọi / trong"; bạn chỉ ra được dòng <code>Uses:</code> và nhóm <code>Inputs</code> trong Set up job; bạn đoán đúng output ma trận (hoặc giải thích được vì sao sai); <code>$THU</code> in ra rỗng; lời gọi thiếu secret vẫn xanh — và bạn giải thích được vì sao cho cả hai điều cuối.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">reusable workflow (workflow dùng lại)</span><span class="v">tệp workflow có <code>on: workflow_call</code>, được gọi từ một job bằng <code>uses:</code></span></div>
<div class="kv"><span class="k">bên gọi / bên được gọi</span><span class="v">tệp chứa job <code>uses:</code>, và tệp mà nó trỏ tới</span></div>
<div class="kv"><span class="k"><code>workflow_call</code></span><span class="v">trigger khiến một workflow gọi được; nơi khai <code>inputs</code>, <code>secrets</code>, <code>outputs</code></span></div>
<div class="kv"><span class="k">input có kiểu</span><span class="v"><code>string</code>, <code>number</code> hoặc <code>boolean</code>; boolean so sánh đúng như boolean</span></div>
<div class="kv"><span class="k"><code>secrets: inherit</code></span><span class="v">đưa mọi secret của bên gọi, có khai hay không, cho workflow được gọi TRỰC TIẾP</span></div>
<div class="kv"><span class="k">trần quyền</span><span class="v"><code>permissions:</code> của bên gọi; bên được gọi chỉ hạ được</span></div>
<div class="kv"><span class="k">độ sâu lồng</span><span class="v">đo được: mười tầng được gọi cộng bên gọi; tầng thứ mười một bị từ chối lúc khởi động</span></div>
<div class="kv"><span class="k"><code>referenced_workflows</code></span><span class="v">trường của một run trong API, ghi mọi workflow được gọi kèm đường dẫn và SHA</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gọi một reusable workflow là thêm job vào run của bạn, mỗi job một runner, tên "job gọi / job bên trong".</li>
<li>Input có kiểu; output phải nối qua bốn tầng; <code>env</code> không sang; <code>github.*</code> là của bên gọi.</li>
<li>Gọi bằng ma trận chỉ giữ một output: của lần XONG cuối, không phải cái LIỆT KÊ cuối.</li>
<li><code>required: true</code> trên secret kiểm có nhắc tới, không kiểm có giá trị; <code>inherit</code> đưa tất cả, có khai hay không.</li>
<li>Quyền chỉ đi xuống; concurrency group dùng chung thì deadlock; lồng dừng ở mười tầng được gọi — tất cả chỉ thấy lúc chạy.</li>
<li>Ghim lời gọi sang kho khác bằng SHA đầy đủ; không thì một lần "chạy lại tất cả" có thể nhặt phải mã khác.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reuse workflows</span><span class="lc-sub">docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows — cách gọi, ma trận, lồng nhau, truyền secret cho workflow lồng, và luật output của ma trận trích ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflow configurations (tham khảo)</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations — giới hạn, từ khoá được phép ở job gọi, runner, quyền của workflow lồng, và hành vi khi chạy lại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — <code>on.workflow_call.inputs</code>, <code>secrets</code>, <code>outputs</code>, và <code>jobs.&lt;job_id&gt;.secrets.inherit</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch12-tai-su-dung</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch12-tai-su-dung — mọi workflow trong bài (<code>ch12-goi</code>, <code>ch12-long2</code>, <code>ch12-quyen-*</code>, <code>ch12-dua</code>, <code>ch12-sau-*</code>), kèm các run của chúng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — một pipeline deploy, nhiều môi trường</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — nơi một ma trận môi trường gọi chung một reusable workflow deploy sẽ dẫn tới, và vì sao thứ tự XONG quan trọng ở đó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Composite actions: one step to GitHub, many steps in the log|||12.2 — Composite action: một bước trong mắt GitHub, nhiều bước trong log',
      slug: 'ga-12-2-composite-action',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Composite action đi quá mức bài 4.5: nhìn nó từ trong log (start-action/end-action), if và continue-on-error và uses lồng nhau, input luôn là chuỗi (đo: if: inputs.x chạy cả khi "false"), hai lỗi nạp mà actionlint không thấy, gọi cục bộ vs từ xa, và bảng chọn composite hay reusable workflow.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Composite actions: one step to GitHub, many steps in the log</h2>
<p class="lead">Lesson 4.5 wrote the smallest composite action and listed four things it cannot do; all four still hold. What has changed is the list older tutorials give: composite steps <em>can</em> now use <code>if</code> and <code>continue-on-error</code>, and they can call other actions. So the useful question is no longer "can a composite do this?" but "what does it look like when it runs, and where does it break?". This lesson answers from the logs.</p>

<p>The sandbox action <code>.github/actions/ch12-chuan-bi</code> does what a team&#39;s "prepare" action usually does: install Node through <code>actions/setup-node</code>, run <code>npm ci</code> unless told not to, run one step that is allowed to fail, call a script that lives next to <code>action.yml</code>, and return two outputs.</p>

<h3>What GitHub sees, and what the log shows</h3>
${slide('ga-12', 9, 'Composite: ONE step to GitHub, many steps in the log')}
<p>In run ${RUN(36029548510)}, job <code>cuc-bo</code>, the API lists the whole composite as <strong>one</strong> step, "Run ./.github/actions/ch12-chuan-bi", lasting two seconds — plus a "Post Run ./.github/actions/ch12-chuan-bi" step near the end, which exists only because <code>setup-node</code> inside it has a <code>post</code> script. The log tells a richer story. Every inner step is wrapped in a pair of markers:</p>
<div class="out">##[group]Run ./.github/actions/ch12-chuan-bi
with:
  node-version: 24
  thu-muc: ch12/app
  bo-qua-cai: false
##[endgroup]
##[start-action display=Cai Node (mot action long trong composite);id=cb.__actions_setup-node]
Found in cache @ /opt/hostedtoolcache/node/24.21.0/x64
##[end-action id=cb.__actions_setup-node;outcome=success;conclusion=success;duration_ms=345]
##[start-action display=Cai phu thuoc;id=cb.__run]
added 1 package in 438ms
##[end-action id=cb.__run;outcome=success;conclusion=success;duration_ms=536]
##[start-action display=Buoc duoc phep hong;id=cb.__run_2]
buoc nay thoat ma 3
##[error]Process completed with exit code 3.
##[end-action id=cb.__run_2;outcome=failure;conclusion=success;duration_ms=14]</div>
<ul>
<li><strong>The <code>with:</code> block shows defaults too.</strong> <code>bo-qua-cai: false</code> was never passed; it is the default from <code>action.yml</code>. When an action behaves unexpectedly, this block is the first thing to read: it is exactly what the action received.</li>
<li><strong>Each inner step has an id, an outcome, a conclusion and a duration.</strong> The id is the caller&#39;s step id (<code>cb</code>) plus the inner id or a generated one (<code>__run</code>, <code>__run_2</code>). That is how you tell which inner step took the time.</li>
<li><strong><code>continue-on-error</code> works exactly as in a workflow</strong> (Lesson 2.4): <code>outcome=failure</code>, <code>conclusion=success</code>, a red <code>##[error]</code> line, and the composite as a whole finishes with <code>outcome = success</code> — the caller printed <code>outcome cua ca composite = success</code>.</li>
<li><strong>A composite costs nothing extra to run.</strong> The same work written as plain steps (job <code>viet-thang</code>, same run) took 7 seconds; the composite job took 6. Both used one runner. The difference is in how many rows the UI shows — 9 steps against 13.</li>
</ul>

<h3>What a composite step can and cannot say</h3>
${slide('ga-12', 10, 'Composite steps now take if, continue-on-error, and nested uses')}
<pre><code class="language-yaml">runs:
  using: composite
  steps:
    - name: Cai Node (mot action long trong composite)
      uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
      with:
        node-version: &#36;{{ inputs.node-version }}
    - name: Cai phu thuoc
      if: inputs.bo-qua-cai != 'true'
      shell: bash
      working-directory: &#36;{{ inputs.thu-muc }}
      run: npm ci --no-audit --no-fund
    - name: Buoc duoc phep hong
      continue-on-error: true
      shell: bash
      run: exit 3
    - name: Goi script nam canh action.yml
      shell: bash
      run: bash "$GITHUB_ACTION_PATH/bao-cao.sh"</code></pre>
<table>
<thead><tr><th>Keyword in a composite step</th><th>Allowed?</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>run</code> + <code>shell</code></td><td>yes</td><td><code>shell</code> is required on every <code>run</code> — and it gives you <code>-o pipefail</code> (Lesson 4.5)</td></tr>
<tr><td><code>uses</code> + <code>with</code></td><td>yes</td><td>nested actions; pin them to a SHA like any other</td></tr>
<tr><td><code>if</code></td><td>yes</td><td>but inputs are strings — see the next section</td></tr>
<tr><td><code>continue-on-error</code></td><td>yes</td><td>outcome/conclusion as in a workflow</td></tr>
<tr><td><code>id</code>, <code>name</code>, <code>env</code>, <code>working-directory</code></td><td>yes</td><td></td></tr>
<tr><td><code>timeout-minutes</code></td><td>no</td><td>set it on the <em>caller&#39;s</em> step</td></tr>
<tr><td>context <code>secrets</code></td><td>no</td><td>pass secrets in as inputs</td></tr>
</tbody>
</table>

<h3>Inputs are strings — measured</h3>
<p>A reusable workflow&#39;s inputs have types. An action&#39;s inputs do not: every input arrives as a string. That matters as soon as you write an <code>if</code>. The sandbox action <code>ch12-if-chuoi</code> has one input, <code>co</code>, and four steps with four ways of testing it; run ${RUN(36031782920)} called it with <code>'false'</code> and with <code>'true'</code>:</p>
<table>
<thead><tr><th>Condition</th><th><code>co: 'false'</code></th><th><code>co: 'true'</code></th></tr></thead>
<tbody>
<tr><td><code>if: inputs.co</code></td><td><strong>ran</strong></td><td>ran</td></tr>
<tr><td><code>if: inputs.co == 'true'</code></td><td>skipped</td><td>ran</td></tr>
<tr><td><code>if: inputs.co == true</code></td><td>skipped</td><td><strong>skipped</strong></td></tr>
<tr><td><code>if: fromJSON(inputs.co)</code></td><td>skipped</td><td>ran</td></tr>
</tbody>
</table>
<p>The first row is the classic bug: the string <code>'false'</code> is non-empty, so it is truthy (Lesson 3.3). The third row is the less famous one: comparing the string <code>'true'</code> with the boolean <code>true</code> converts both to numbers — <code>NaN</code> against <code>1</code> — so it is never equal. Use <code>== 'true'</code> or <code>fromJSON()</code>; the sandbox action uses <code>!= 'true'</code> for "skip unless asked".</p>

<div class="pitfall co-tieu-de"><strong>Trap — a flag that can never be switched off.</strong> <code>if: inputs.dry-run</code> in a composite action looks like a boolean switch. It is not: every caller that writes <code>dry-run: false</code> still gets the dry-run branch, and since nothing fails, nobody notices until a real deployment silently did nothing. Any <code>if:</code> on an action input must compare with a string.</div>

<h3>Two load errors, and why they surprise you late</h3>
${slide('ga-12', 11, 'Two common composite load errors — the job has already checked out')}
<p>Run ${RUN(36029548521)} has two jobs, each calling a deliberately broken composite action. Both jobs checked out successfully and then failed on the action step:</p>
<div class="out">##[error]/home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-thieu-shell/action.yml (Line: 7, Col: 7): Required property is missing: shell
##[error]Failed to load /home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-thieu-shell/action.yml

##[error]/home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-doc-secret/action.yml (Line: 9, Col: 12): Unrecognized named-value: 'secrets'. Located at position 1 within expression: secrets.CH06_GIA</div>
<ul>
<li>Both are <strong>load</strong> errors (the stack trace names <code>ActionManifestManagerLegacy.Load</code>): a local action is only read from disk when its step is reached, so everything before it — checkout, installs, a 10-minute build — runs first and is wasted.</li>
<li><strong>actionlint does not lint a local <code>action.yml</code> on its own.</strong> The same lint pass that caught two workflow mistakes in this chapter said nothing about either file.</li>
<li>The fix is a test workflow that runs on every pull request touching <code>.github/actions/**</code> and calls each action once with realistic inputs. That is also the only place the secrets-as-inputs rule gets checked. Lesson 12.3 builds one.</li>
</ul>

<h3>Local or remote: when it is fetched, and where it lives</h3>
${slide('ga-12', 12, 'Local or remote composite: when it is fetched, where it lives')}
<p>The same action can be called two ways. Locally, <code>uses: ./.github/actions/ch12-chuan-bi</code>, as above. Remotely, as <code>owner/repo/path@ref</code> — run ${RUN(36029943782)} called it as <code>cuonghoang1103/ga-san-tap/.github/actions/ch12-chuan-bi@55b77f9d…</code>, in a job <strong>with no checkout at all</strong>:</p>
<div class="out">Prepare all required actions
Getting action download info
Download action repository 'cuonghoang1103/ga-san-tap@55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94' (SHA:55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94)
Getting action download info
Download action repository 'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020' (SHA:820762786026740c76f36085b0efc47a31fe5020)
Complete job name: composite-khong-checkout
...
##[end-action id=cb.__run;outcome=skipped;conclusion=skipped;duration_ms=0]
GITHUB_ACTION_PATH = /home/runner/work/_actions/cuonghoang1103/ga-san-tap/55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94/.github/actions/ch12-chuan-bi
node = v22.23.2
workspace co gi: 0 muc (chua checkout)</div>
<table>
<thead><tr><th></th><th>Local <code>./.github/actions/x</code></th><th>Remote <code>owner/repo/path@SHA</code></th></tr></thead>
<tbody>
<tr><td>Needs checkout first</td><td>yes — read from the workspace</td><td>no — the workspace had 0 entries</td></tr>
<tr><td>When it is fetched</td><td>not fetched; nested actions are downloaded when the step runs</td><td>in Set up job: the <em>whole repository</em> tarball, then its nested actions</td></tr>
<tr><td><code>GITHUB_ACTION_PATH</code></td><td>inside the workspace</td><td>under <code>_actions/owner/repo/&lt;SHA&gt;/</code></td></tr>
<tr><td>Which version runs</td><td>whatever the checked-out commit contains — a PR that edits the action runs its edited copy</td><td>exactly the SHA in <code>uses:</code></td></tr>
<tr><td>Dependabot</td><td>ignored (docs: local references are skipped)</td><td>updated, including the <code># vX.Y.Z</code> comment</td></tr>
</tbody>
</table>
<p>Note the skipped step in that log: <code>bo-qua-cai: 'true'</code> turned off <code>npm ci</code> through the <code>!= 'true'</code> condition, which is why this action is usable in a job with nothing to install.</p>

<h3>Composite or reusable workflow</h3>
${slide('ga-12', 13, 'Composite or reusable workflow: choose by what you are grouping')}
<table>
<thead><tr><th></th><th>Composite action</th><th>Reusable workflow</th></tr></thead>
<tbody>
<tr><td>Called at</td><td>step level</td><td>job level</td></tr>
<tr><td>Runner</td><td>the caller&#39;s runner and workspace</td><td>a new runner per inner job (2–4 s queue each, measured in 12.1)</td></tr>
<tr><td>Inputs</td><td>strings only</td><td><code>string</code> / <code>number</code> / <code>boolean</code></td></tr>
<tr><td>Secrets</td><td>no <code>secrets</code> context — inputs</td><td><code>secrets:</code> explicit or <code>inherit</code></td></tr>
<tr><td>Token permissions</td><td>those of the calling job</td><td>ceiling set by caller, can only go down</td></tr>
<tr><td><code>runs-on</code>, matrix, environment inside</td><td>no</td><td>yes</td></tr>
<tr><td>In the log</td><td>one step, inner steps marked</td><td>separate jobs, "caller / inner"</td></tr>
<tr><td>Good for</td><td>"these steps repeat" — set up, log in, report</td><td>"this pipeline repeats" — build, test, deploy</td></tr>
</tbody>
</table>
<p>A rule of thumb that survives most arguments: if the repeated thing needs its own machine, its own environment approval or its own matrix, it is a reusable workflow. If it runs inside somebody else&#39;s job, it is a composite. And if it is mostly shell, it is a script in the repository first (Lesson 4.5), wrapped by either only when several repositories need it.</p>

<h3>Run it step by step: a "prepare" action with a switch</h3>
<ol>
<li>Create <code>.github/actions/chuan-bi/action.yml</code> with <code>using: composite</code> and three inputs: <code>node-version</code> (default <code>'22'</code>), <code>thu-muc</code> (default <code>'.'</code>), <code>bo-qua-cai</code> (default <code>'false'</code>).</li>
<li>Step 1: <code>uses: actions/setup-node@&lt;full SHA&gt; # vX.Y.Z</code> with the Node input.</li>
<li>Step 2: <code>npm ci</code> with <code>if: inputs.bo-qua-cai != 'true'</code>, <code>shell: bash</code> and <code>working-directory</code>.</li>
<li>Step 3: <code>id: kq</code>, write <code>node=$(node -v)</code> to <code>$GITHUB_OUTPUT</code>; declare <code>outputs.node.value</code> pointing at it.</li>
<li>Call it twice in one workflow: once normally after checkout, once with <code>bo-qua-cai: 'false'</code> written as a bare <code>false</code> in YAML — then check the log&#39;s <code>with:</code> block to see it arrive as a string.</li>
<li>Find the <code>start-action</code>/<code>end-action</code> lines and read each inner step&#39;s <code>duration_ms</code>.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: A composite action has <code>if: inputs.enabled</code>. Callers pass <code>enabled: false</code>, yet the step runs. Why?</strong><br>A: Action inputs are strings. <code>'false'</code> is a non-empty string, so it is truthy. Compare with <code>== 'true'</code> or use <code>fromJSON(inputs.enabled)</code>; <code>== true</code> does not work either, because the string is converted to a number.</p>
<p><strong>Q: How do you give a composite action a secret?</strong><br>A: As an input, which the caller fills from <code>secrets.X</code>; inside, move it to <code>env:</code> and use <code>"$VAR"</code>. The <code>secrets</code> context does not exist in <code>action.yml</code> — referencing it is a load error.</p>
<p><strong>Q: When would you choose a reusable workflow over a composite action?</strong><br>A: When the repeated unit needs its own runner, matrix, environment protection or permissions — i.e. it is a job or a pipeline. A composite runs inside the caller&#39;s job, shares its workspace, and costs no extra runner.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> three of your workflows start with the same four steps (checkout is not one of them). Turn them into one composite action and prove it behaves.</p><ol>
<li>Build the "prepare" action from "Run it step by step" in your repository.</li>
<li>Replace the repeated steps in two workflows with one <code>uses: ./.github/actions/chuan-bi</code> step. Push.</li>
<li>Add a test workflow triggered on <code>pull_request</code> with <code>paths: ['.github/actions/**']</code> that calls the action with <code>bo-qua-cai: 'true'</code> and checks <code>steps.&lt;id&gt;.outputs.node</code> is not empty (<code>test -n</code>).</li>
<li>Deliberately delete one <code>shell:</code> line, open a PR, and watch which workflow catches it.</li>
</ol><p><strong>Done when:</strong> the two workflows are green with one step instead of four; the log shows <code>start-action</code>/<code>end-action</code> markers for the inner steps; the broken <code>shell:</code> is caught by your test workflow with "Required property is missing: shell" before merge.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">composite action</span><span class="v">an action whose <code>runs.using</code> is <code>composite</code>: a list of steps run inside the caller&#39;s job</span></div>
<div class="kv"><span class="k"><code>start-action</code> / <code>end-action</code></span><span class="v">log markers around each inner step, with id, outcome, conclusion and duration</span></div>
<div class="kv"><span class="k">nested action</span><span class="v">a <code>uses:</code> inside a composite; pin it to a SHA</span></div>
<div class="kv"><span class="k">string input</span><span class="v">every action input is a string; <code>'false'</code> is truthy</span></div>
<div class="kv"><span class="k">load error</span><span class="v">an <code>action.yml</code> that fails to parse, reported only when its step is reached</span></div>
<div class="kv"><span class="k"><code>GITHUB_ACTION_PATH</code></span><span class="v">the directory the action lives in — workspace for local, <code>_actions/…/&lt;SHA&gt;</code> for remote</span></div>
<div class="kv"><span class="k">remote reference</span><span class="v"><code>owner/repo/path@ref</code>: fetched in Set up job, needs no checkout</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>GitHub counts a composite as one step; the log marks every inner step with <code>start-action</code>/<code>end-action</code>, outcome and duration.</li>
<li>Composite steps accept <code>if</code>, <code>continue-on-error</code> and nested <code>uses</code>; not <code>timeout-minutes</code>, not <code>secrets</code>.</li>
<li>Inputs are strings: <code>if: inputs.x</code> runs for <code>'false'</code>, <code>== true</code> never matches — use <code>== 'true'</code> or <code>fromJSON()</code>.</li>
<li>A broken local <code>action.yml</code> fails only when its step runs, and actionlint does not catch it — test actions in their own workflow.</li>
<li>Remote references are fetched in Set up job and need no checkout; local ones follow whatever commit is checked out.</li>
<li>Steps that repeat → composite; a pipeline that repeats → reusable workflow; mostly shell → a script first.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Metadata syntax for GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax — <code>runs.steps[*]</code> for composite actions: <code>run</code>, <code>shell</code>, <code>if</code>, <code>uses</code>, <code>with</code>, <code>continue-on-error</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action — the end-to-end tutorial, including outputs and calling from another repository.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/expressions — how strings, booleans and numbers are compared, which explains both surprises in the <code>if</code> table.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — the composite actions of this lesson</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch12-tai-su-dung/.github/actions — <code>ch12-chuan-bi</code>, <code>ch12-if-chuoi</code>, and the two deliberately broken ones.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — scripts before wrappers</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the script-in-the-repository option that a composite action should usually wrap, not replace.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Composite action: một bước trong mắt GitHub, nhiều bước trong log</h2>
<p class="lead">Bài 4.5 đã viết composite action nhỏ nhất và liệt kê bốn điều nó KHÔNG làm được; cả bốn vẫn đúng. Cái đã thay đổi là danh sách mà các bài hướng dẫn cũ đưa ra: bước của composite nay DÙNG ĐƯỢC <code>if</code> và <code>continue-on-error</code>, và gọi được action khác. Nên câu hỏi có ích không còn là "composite làm được việc này không?" mà là "khi chạy nó trông thế nào, và nó gãy ở đâu?". Bài này trả lời bằng log.</p>

<p>Action trên sân tập <code>.github/actions/ch12-chuan-bi</code> làm đúng việc mà action "chuẩn bị" của một đội thường làm: cài Node qua <code>actions/setup-node</code>, chạy <code>npm ci</code> trừ khi được bảo bỏ qua, chạy một bước được phép hỏng, gọi một script nằm cạnh <code>action.yml</code>, và trả về hai output.</p>

<h3>GitHub nhìn thấy gì, và log cho thấy gì</h3>
${slide('ga-12', 9, 'Composite: MỘT bước trong mắt GitHub, nhiều bước trong log')}
<p>Ở run ${RUN(36029548510)}, job <code>cuc-bo</code>, API liệt kê cả composite là <strong>một</strong> bước, "Run ./.github/actions/ch12-chuan-bi", dài hai giây — cộng một bước "Post Run ./.github/actions/ch12-chuan-bi" gần cuối, bước này có mặt chỉ vì <code>setup-node</code> bên trong có script <code>post</code>. Log kể nhiều hơn thế. Mỗi bước bên trong được bọc trong một cặp dấu mốc:</p>
<div class="out">##[group]Run ./.github/actions/ch12-chuan-bi
with:
  node-version: 24
  thu-muc: ch12/app
  bo-qua-cai: false
##[endgroup]
##[start-action display=Cai Node (mot action long trong composite);id=cb.__actions_setup-node]
Found in cache @ /opt/hostedtoolcache/node/24.21.0/x64
##[end-action id=cb.__actions_setup-node;outcome=success;conclusion=success;duration_ms=345]
##[start-action display=Cai phu thuoc;id=cb.__run]
added 1 package in 438ms
##[end-action id=cb.__run;outcome=success;conclusion=success;duration_ms=536]
##[start-action display=Buoc duoc phep hong;id=cb.__run_2]
buoc nay thoat ma 3
##[error]Process completed with exit code 3.
##[end-action id=cb.__run_2;outcome=failure;conclusion=success;duration_ms=14]</div>
<ul>
<li><strong>Khối <code>with:</code> in cả giá trị mặc định.</strong> <code>bo-qua-cai: false</code> chưa hề được truyền; nó là mặc định trong <code>action.yml</code>. Khi một action cư xử lạ, khối này là thứ đầu tiên cần đọc: nó đúng là thứ action đã nhận.</li>
<li><strong>Mỗi bước bên trong có id, outcome, conclusion và thời lượng.</strong> Id là id bước của bên gọi (<code>cb</code>) cộng id bên trong hoặc một id tự sinh (<code>__run</code>, <code>__run_2</code>). Nhờ đó bạn biết bước con nào ngốn thời gian.</li>
<li><strong><code>continue-on-error</code> chạy y như trong workflow</strong> (Bài 2.4): <code>outcome=failure</code>, <code>conclusion=success</code>, một dòng <code>##[error]</code> đỏ, và cả composite vẫn kết thúc với <code>outcome = success</code> — bên gọi in ra <code>outcome cua ca composite = success</code>.</li>
<li><strong>Composite không tốn thêm gì khi chạy.</strong> Cùng việc đó viết thành các bước thường (job <code>viet-thang</code>, cùng run) mất 7 giây; job composite mất 6. Cả hai dùng một runner. Khác nhau ở số dòng giao diện hiển thị — 9 bước so với 13.</li>
</ul>

<h3>Bước composite nói được gì và không nói được gì</h3>
${slide('ga-12', 10, 'Composite giờ làm được if, continue-on-error, và uses lồng nhau')}
<pre><code class="language-yaml">runs:
  using: composite
  steps:
    - name: Cai Node (mot action long trong composite)
      uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
      with:
        node-version: &#36;{{ inputs.node-version }}
    - name: Cai phu thuoc
      if: inputs.bo-qua-cai != 'true'
      shell: bash
      working-directory: &#36;{{ inputs.thu-muc }}
      run: npm ci --no-audit --no-fund
    - name: Buoc duoc phep hong
      continue-on-error: true
      shell: bash
      run: exit 3
    - name: Goi script nam canh action.yml
      shell: bash
      run: bash "$GITHUB_ACTION_PATH/bao-cao.sh"</code></pre>
<table>
<thead><tr><th>Từ khoá trong bước composite</th><th>Được dùng?</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>run</code> + <code>shell</code></td><td>có</td><td><code>shell</code> bắt buộc trên mọi <code>run</code> — và nó cho bạn <code>-o pipefail</code> (Bài 4.5)</td></tr>
<tr><td><code>uses</code> + <code>with</code></td><td>có</td><td>action lồng nhau; ghim SHA như mọi action khác</td></tr>
<tr><td><code>if</code></td><td>có</td><td>nhưng input là chuỗi — xem mục kế tiếp</td></tr>
<tr><td><code>continue-on-error</code></td><td>có</td><td>outcome/conclusion y như trong workflow</td></tr>
<tr><td><code>id</code>, <code>name</code>, <code>env</code>, <code>working-directory</code></td><td>có</td><td></td></tr>
<tr><td><code>timeout-minutes</code></td><td>không</td><td>đặt trên bước <em>của bên gọi</em></td></tr>
<tr><td>context <code>secrets</code></td><td>không</td><td>đưa secret vào qua input</td></tr>
</tbody>
</table>

<h3>Input là chuỗi — đã đo</h3>
<p>Input của reusable workflow có kiểu. Input của action thì không: mọi input tới nơi đều là chuỗi. Chuyện đó thành quan trọng ngay khi bạn viết một <code>if</code>. Action <code>ch12-if-chuoi</code> trên sân tập có một input <code>co</code> và bốn bước thử nó theo bốn cách; run ${RUN(36031782920)} gọi nó với <code>'false'</code> và với <code>'true'</code>:</p>
<table>
<thead><tr><th>Điều kiện</th><th><code>co: 'false'</code></th><th><code>co: 'true'</code></th></tr></thead>
<tbody>
<tr><td><code>if: inputs.co</code></td><td><strong>chạy</strong></td><td>chạy</td></tr>
<tr><td><code>if: inputs.co == 'true'</code></td><td>bỏ qua</td><td>chạy</td></tr>
<tr><td><code>if: inputs.co == true</code></td><td>bỏ qua</td><td><strong>bỏ qua</strong></td></tr>
<tr><td><code>if: fromJSON(inputs.co)</code></td><td>bỏ qua</td><td>chạy</td></tr>
</tbody>
</table>
<p>Dòng đầu là lỗi kinh điển: chuỗi <code>'false'</code> không rỗng nên nó là truthy (Bài 3.3). Dòng thứ ba là lỗi ít người biết hơn: so chuỗi <code>'true'</code> với boolean <code>true</code> sẽ ép cả hai về số — <code>NaN</code> so với <code>1</code> — nên không bao giờ bằng nhau. Dùng <code>== 'true'</code> hoặc <code>fromJSON()</code>; action trên sân tập dùng <code>!= 'true'</code> cho ý "bỏ qua khi được bảo".</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — cái công tắc không bao giờ tắt được.</strong> <code>if: inputs.dry-run</code> trong một composite action trông như một công tắc boolean. Không phải: mọi bên gọi viết <code>dry-run: false</code> vẫn đi vào nhánh chạy thử, và vì chẳng có gì hỏng nên không ai để ý — cho tới khi một đợt deploy thật lặng lẽ không làm gì cả. Mọi <code>if:</code> trên input của action đều phải so với một chuỗi.</div>

<h3>Hai lỗi nạp, và vì sao chúng làm bạn bất ngờ muộn</h3>
${slide('ga-12', 11, 'Hai lỗi nạp composite hay gặp — job đã checkout xong mới đỏ')}
<p>Run ${RUN(36029548521)} có hai job, mỗi job gọi một composite cố ý hỏng. Cả hai job đều checkout thành công rồi mới hỏng ở bước action:</p>
<div class="out">##[error]/home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-thieu-shell/action.yml (Line: 7, Col: 7): Required property is missing: shell
##[error]Failed to load /home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-thieu-shell/action.yml

##[error]/home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-doc-secret/action.yml (Line: 9, Col: 12): Unrecognized named-value: 'secrets'. Located at position 1 within expression: secrets.CH06_GIA</div>
<ul>
<li>Cả hai là lỗi <strong>nạp tệp</strong> (stack trace ghi <code>ActionManifestManagerLegacy.Load</code>): action cục bộ chỉ được đọc từ đĩa khi tới lượt bước của nó, nên mọi thứ đứng trước — checkout, cài đặt, một bản dựng 10 phút — chạy trước rồi đổ sông đổ biển.</li>
<li><strong>actionlint không kiểm một <code>action.yml</code> cục bộ khi đứng riêng.</strong> Đúng lượt lint đã bắt được hai lỗi workflow trong chương này thì im lặng về cả hai tệp.</li>
<li>Cách vá là một workflow test chạy ở mọi pull request có đụng tới <code>.github/actions/**</code> và gọi mỗi action một lần với input sát thực tế. Đó cũng là chỗ duy nhất luật "secret đi qua input" được kiểm. Bài 12.3 dựng một cái như thế.</li>
</ul>

<h3>Cục bộ hay từ xa: tải lúc nào, nằm ở đâu</h3>
${slide('ga-12', 12, 'Composite cục bộ hay từ xa: tải lúc nào, nằm ở đâu')}
<p>Cùng một action gọi được theo hai cách. Cục bộ, <code>uses: ./.github/actions/ch12-chuan-bi</code>, như ở trên. Từ xa, dạng <code>owner/repo/đường-dẫn@ref</code> — run ${RUN(36029943782)} gọi nó là <code>cuonghoang1103/ga-san-tap/.github/actions/ch12-chuan-bi@55b77f9d…</code>, trong một job <strong>không checkout gì cả</strong>:</p>
<div class="out">Prepare all required actions
Getting action download info
Download action repository 'cuonghoang1103/ga-san-tap@55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94' (SHA:55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94)
Getting action download info
Download action repository 'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020' (SHA:820762786026740c76f36085b0efc47a31fe5020)
Complete job name: composite-khong-checkout
...
##[end-action id=cb.__run;outcome=skipped;conclusion=skipped;duration_ms=0]
GITHUB_ACTION_PATH = /home/runner/work/_actions/cuonghoang1103/ga-san-tap/55b77f9d2dc0ccf8376a3683bf36d9a152a1dc94/.github/actions/ch12-chuan-bi
node = v22.23.2
workspace co gi: 0 muc (chua checkout)</div>
<table>
<thead><tr><th></th><th>Cục bộ <code>./.github/actions/x</code></th><th>Từ xa <code>owner/repo/path@SHA</code></th></tr></thead>
<tbody>
<tr><td>Cần checkout trước</td><td>có — đọc từ workspace</td><td>không — workspace có 0 mục</td></tr>
<tr><td>Được tải lúc nào</td><td>không tải; action lồng bên trong được tải khi bước chạy</td><td>ở Set up job: tarball của <em>cả kho</em>, rồi tới các action lồng của nó</td></tr>
<tr><td><code>GITHUB_ACTION_PATH</code></td><td>nằm trong workspace</td><td>nằm dưới <code>_actions/owner/repo/&lt;SHA&gt;/</code></td></tr>
<tr><td>Phiên bản nào chạy</td><td>bất cứ thứ gì commit được checkout chứa — PR sửa action thì chạy bản đã sửa</td><td>đúng SHA ghi trong <code>uses:</code></td></tr>
<tr><td>Dependabot</td><td>bỏ qua (docs: tham chiếu cục bộ bị bỏ qua)</td><td>cập nhật được, kể cả chú thích <code># vX.Y.Z</code></td></tr>
</tbody>
</table>
<p>Để ý bước bị bỏ qua trong log đó: <code>bo-qua-cai: 'true'</code> đã tắt <code>npm ci</code> qua điều kiện <code>!= 'true'</code> — nhờ vậy action này dùng được trong một job chẳng có gì để cài.</p>

<h3>Composite hay reusable workflow</h3>
${slide('ga-12', 13, 'Composite hay reusable workflow: chọn theo thứ bạn cần GOM')}
<table>
<thead><tr><th></th><th>Composite action</th><th>Reusable workflow</th></tr></thead>
<tbody>
<tr><td>Gọi ở mức</td><td>bước</td><td>job</td></tr>
<tr><td>Runner</td><td>runner và workspace của bên gọi</td><td>một runner mới cho MỖI job bên trong (xếp hàng 2–4 giây mỗi cái, đo ở 12.1)</td></tr>
<tr><td>Input</td><td>chỉ chuỗi</td><td><code>string</code> / <code>number</code> / <code>boolean</code></td></tr>
<tr><td>Secret</td><td>không có context <code>secrets</code> — qua input</td><td><code>secrets:</code> tường minh hoặc <code>inherit</code></td></tr>
<tr><td>Quyền của token</td><td>như job gọi nó</td><td>trần do bên gọi đặt, chỉ hạ được</td></tr>
<tr><td><code>runs-on</code>, ma trận, environment bên trong</td><td>không</td><td>có</td></tr>
<tr><td>Trong log</td><td>một bước, các bước con có dấu mốc</td><td>các job riêng, "gọi / trong"</td></tr>
<tr><td>Hợp cho</td><td>"mấy BƯỚC này lặp lại" — chuẩn bị, đăng nhập, báo cáo</td><td>"cả PIPELINE này lặp lại" — dựng, test, deploy</td></tr>
</tbody>
</table>
<p>Một luật ngón tay cái sống sót qua hầu hết các cuộc tranh luận: nếu thứ lặp lại cần máy riêng, cần duyệt environment riêng hay cần ma trận riêng, nó là reusable workflow. Nếu nó chạy bên trong job của người khác, nó là composite. Còn nếu nó chủ yếu là shell, thì trước hết nó là một script trong kho (Bài 4.5), chỉ bọc bằng một trong hai khi nhiều kho cùng cần.</p>

<h3>Chạy thử từng bước: một action "chuẩn bị" có công tắc</h3>
<ol>
<li>Tạo <code>.github/actions/chuan-bi/action.yml</code> với <code>using: composite</code> và ba input: <code>node-version</code> (mặc định <code>'22'</code>), <code>thu-muc</code> (mặc định <code>'.'</code>), <code>bo-qua-cai</code> (mặc định <code>'false'</code>).</li>
<li>Bước 1: <code>uses: actions/setup-node@&lt;SHA đầy đủ&gt; # vX.Y.Z</code> với input Node.</li>
<li>Bước 2: <code>npm ci</code> với <code>if: inputs.bo-qua-cai != 'true'</code>, <code>shell: bash</code> và <code>working-directory</code>.</li>
<li>Bước 3: <code>id: kq</code>, ghi <code>node=$(node -v)</code> vào <code>$GITHUB_OUTPUT</code>; khai <code>outputs.node.value</code> trỏ vào nó.</li>
<li>Gọi nó hai lần trong một workflow: một lần bình thường sau checkout, một lần với <code>bo-qua-cai</code> viết thành <code>false</code> trần trong YAML — rồi xem khối <code>with:</code> trong log để thấy nó tới nơi dưới dạng chuỗi.</li>
<li>Tìm các dòng <code>start-action</code>/<code>end-action</code> và đọc <code>duration_ms</code> của từng bước con.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Một composite action có <code>if: inputs.enabled</code>. Bên gọi truyền <code>enabled: false</code>, vậy mà bước vẫn chạy. Vì sao?</strong><br>Đ: Input của action là chuỗi. <code>'false'</code> là chuỗi không rỗng nên truthy. So với <code>== 'true'</code> hoặc dùng <code>fromJSON(inputs.enabled)</code>; <code>== true</code> cũng không được, vì chuỗi bị ép sang số.</p>
<p><strong>H: Đưa secret cho một composite action bằng cách nào?</strong><br>Đ: Qua một input, bên gọi điền từ <code>secrets.X</code>; bên trong, chuyển nó sang <code>env:</code> và dùng <code>"$BIEN"</code>. Context <code>secrets</code> không tồn tại trong <code>action.yml</code> — tham chiếu tới nó là lỗi nạp.</p>
<p><strong>H: Khi nào bạn chọn reusable workflow thay vì composite action?</strong><br>Đ: Khi đơn vị lặp lại cần runner riêng, ma trận, bảo vệ environment hay quyền riêng — tức nó là một job hay một pipeline. Composite chạy bên trong job của bên gọi, dùng chung workspace, và không tốn thêm runner.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ba workflow của bạn mở đầu bằng cùng bốn bước (checkout không nằm trong số đó). Gom chúng thành một composite action và chứng minh nó cư xử đúng.</p><ol>
<li>Dựng action "chuẩn bị" theo mục "Chạy thử từng bước" trong kho của bạn.</li>
<li>Thay các bước lặp ở hai workflow bằng một bước <code>uses: ./.github/actions/chuan-bi</code>. Push.</li>
<li>Thêm một workflow test kích hoạt bởi <code>pull_request</code> với <code>paths: ['.github/actions/**']</code>, gọi action với <code>bo-qua-cai: 'true'</code> và kiểm <code>steps.&lt;id&gt;.outputs.node</code> không rỗng (<code>test -n</code>).</li>
<li>Cố ý xoá một dòng <code>shell:</code>, mở PR, và xem workflow nào bắt được.</li>
</ol><p><strong>Đạt khi:</strong> hai workflow xanh với một bước thay cho bốn; log có dấu mốc <code>start-action</code>/<code>end-action</code> cho các bước con; dòng <code>shell:</code> bị xoá bị workflow test bắt với "Required property is missing: shell" trước khi merge.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">composite action</span><span class="v">action có <code>runs.using</code> là <code>composite</code>: một danh sách bước chạy bên trong job của bên gọi</span></div>
<div class="kv"><span class="k"><code>start-action</code> / <code>end-action</code></span><span class="v">dấu mốc trong log quanh mỗi bước con, kèm id, outcome, conclusion và thời lượng</span></div>
<div class="kv"><span class="k">action lồng (nested action)</span><span class="v">một <code>uses:</code> bên trong composite; ghim nó bằng SHA</span></div>
<div class="kv"><span class="k">input chuỗi</span><span class="v">mọi input của action là chuỗi; <code>'false'</code> là truthy</span></div>
<div class="kv"><span class="k">lỗi nạp (load error)</span><span class="v"><code>action.yml</code> không đọc được, chỉ bị báo khi tới lượt bước của nó</span></div>
<div class="kv"><span class="k"><code>GITHUB_ACTION_PATH</code></span><span class="v">thư mục action đang nằm — trong workspace nếu cục bộ, dưới <code>_actions/…/&lt;SHA&gt;</code> nếu từ xa</span></div>
<div class="kv"><span class="k">tham chiếu từ xa</span><span class="v"><code>owner/repo/path@ref</code>: tải ở Set up job, không cần checkout</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>GitHub đếm composite là một bước; log đánh dấu mọi bước con bằng <code>start-action</code>/<code>end-action</code>, kèm outcome và thời lượng.</li>
<li>Bước composite nhận <code>if</code>, <code>continue-on-error</code> và <code>uses</code> lồng nhau; không nhận <code>timeout-minutes</code>, không có <code>secrets</code>.</li>
<li>Input là chuỗi: <code>if: inputs.x</code> chạy cả với <code>'false'</code>, <code>== true</code> không bao giờ khớp — dùng <code>== 'true'</code> hoặc <code>fromJSON()</code>.</li>
<li><code>action.yml</code> cục bộ bị hỏng chỉ lộ khi bước của nó chạy, và actionlint không bắt — hãy test action trong workflow riêng của nó.</li>
<li>Tham chiếu từ xa được tải ở Set up job và không cần checkout; tham chiếu cục bộ đi theo commit đang được checkout.</li>
<li>Bước lặp → composite; pipeline lặp → reusable workflow; chủ yếu là shell → script trước đã.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Metadata syntax for GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax — <code>runs.steps[*]</code> của composite action: <code>run</code>, <code>shell</code>, <code>if</code>, <code>uses</code>, <code>with</code>, <code>continue-on-error</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action — hướng dẫn từ đầu tới cuối, gồm output và gọi từ kho khác.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/expressions — chuỗi, boolean và số được so sánh ra sao, giải thích cả hai điều bất ngờ trong bảng <code>if</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — các composite action của bài</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch12-tai-su-dung/.github/actions — <code>ch12-chuan-bi</code>, <code>ch12-if-chuoi</code>, và hai cái cố ý hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — script trước, lớp bọc sau</span><span class="lc-sub">/courses/linux-bash/learn${REF} — lựa chọn "script trong kho" mà composite action thường nên bọc, chứ không thay thế.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — JavaScript and Docker actions: build, test, release|||12.3 — Action JavaScript và Docker: dựng, test, phát hành',
      slug: 'ga-12-3-action-js-docker',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Viết một action JavaScript với @actions/core và @actions/github (nay là ESM thuần), đóng gói bằng ncc 0.45, test trên ba hệ, bắt dist/ lệch bằng job kiem-dist; Node 20 bị ép lên 24; một Docker action dựng ảnh trong 3,5 giây; và đo thật con trỏ di động so với ghim SHA khi phát hành bản mới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>JavaScript and Docker actions: build, test, release</h2>
<p class="lead">A composite action is YAML gluing other things together. When the logic itself needs a real language — parse a report, call the GitHub API, decide something from JSON — you write a JavaScript action (runs anywhere, starts instantly) or a Docker action (brings its own tools, Linux only). Writing one is the easy part. This lesson spends most of its time on the parts that go wrong after: what the runner actually executes, which Node it uses, how you know the published file matches the source, and how your users receive the next version.</p>

<h3>The anatomy of a JavaScript action</h3>
${slide('ga-12', 14, 'JavaScript action: src → ncc → ONE dist file committed to the repo')}
<p>The sandbox action <code>actions/ch12-dem-tep</code> counts files by extension in a folder, returns two outputs, writes a job summary, and reads the repository&#39;s details through the API. Its <code>action.yml</code>:</p>
<pre><code class="language-yaml">name: ch12 dem tep
description: Dem tep theo duoi trong mot thu muc, ghi output + job summary, doc repo bang Octokit
inputs:
  thu-muc:
    default: '.'
  token:
    description: Token de goi API (mac dinh la GITHUB_TOKEN cua job)
    default: &#36;{{ github.token }}
outputs:
  tong:        { description: Tong so tep }
  nhieu-nhat:  { description: Duoi tep xuat hien nhieu nhat }
runs:
  using: node24
  main: dist/index.js
branding: { icon: hash, color: blue }</code></pre>
<p>Three details carry most of the weight. <code>default: &#36;{{ github.token }}</code> gives the action a token without the caller having to pass one — the same trick <code>actions/checkout</code> uses (Lesson 4.1), and the reason the log shows <code>token: ***</code> in the <code>with:</code> block even though the workflow never mentioned it. <code>runs.main</code> names <strong>one file</strong>, and the runner runs exactly that file: it never runs <code>npm install</code> for an action. And <code>branding</code> only matters on the Marketplace.</p>
<p>The code is split on purpose. <code>src/dem.js</code> is pure logic with no <code>@actions/*</code> import, so it can be tested on your laptop with <code>node --test</code> (one test, passing, before the first push). <code>src/index.js</code> is the thin layer that talks to the runner:</p>
<pre><code class="language-javascript">import * as core from '@actions/core';
import * as github from '@actions/github';
import { demTep } from './dem.js';

async function chay() {
  const thuMuc = core.getInput('thu-muc');
  const token = core.getInput('token', { required: true });
  const { tong, xep, nhieuNhat } = demTep(thuMuc);
  core.setOutput('tong', tong);
  core.setOutput('nhieu-nhat', nhieuNhat);
  if (tong &gt; 40) core.warning('... nhieu hon nguong 40', { title: 'ch12-dem-tep' });
  const octokit = github.getOctokit(token);
  const { data } = await octokit.rest.repos.get(github.context.repo);
  core.info('repo ' + data.full_name + ' · nhanh mac dinh ' + data.default_branch);
  await core.summary.addHeading('ch12-dem-tep', 3).addTable(/* ... */).write();
}
chay().catch((e) =&gt; core.setFailed(e.message));</code></pre>
<p><code>getInput</code> reads what the log shows under <code>with:</code> (internally the <code>INPUT_*</code> variables of Lesson 4.1); <code>setOutput</code> writes to <code>$GITHUB_OUTPUT</code>; <code>warning</code> creates an annotation; <code>summary</code> writes the job summary page; <code>setFailed</code> sets exit code 1 — the one line that turns an exception into a red step instead of a crash with a stack trace.</p>

<h3>Bundling: why dist/ is committed, and what changed in 2026</h3>
<p>Because the runner will not install dependencies, the file named in <code>runs.main</code> must contain them. The standard tool is <a href="https://github.com/vercel/ncc" target="_blank" rel="noopener">@vercel/ncc</a>, which the GitHub docs recommend over committing <code>node_modules</code>:</p>
<div class="out">$ npm run build
&gt; ncc build src/index.js -o dist --license licenses.txt
ncc: Version 0.45.0
ncc: Compiling file index.js into ESM
   0kB  dist/package.json
  30kB  dist/licenses.txt
1250kB  dist/index.js
1280kB  [2158ms] - ncc 0.45.0</div>
<p>Two things in that output are new compared with most tutorials you will find. First, <code>@actions/core</code> 3.0.1 and <code>@actions/github</code> 9.1.1 (the current versions on npm, September 2026) are <strong>ESM-only</strong> packages (<code>"type": "module"</code>) — since <code>@actions/github</code> 9.0.0 (27 January 2026) and <code>@actions/core</code> 3.0.0 (29 January 2026), according to the npm registry: no <code>require()</code>, only <code>import</code>. Older examples written with <code>const core = require('@actions/core')</code> will not work with them. Second, ncc noticed and compiled "into ESM", which is why it also wrote a tiny <code>dist/package.json</code> containing <code>{"type":"module"}</code>. Forget to commit that file and Node will try to read <code>dist/index.js</code> as CommonJS.</p>
<p>Committing 1.25 MB of generated code to the repository feels wrong, and it has a real cost: the file can drift from the source. The docs describe an alternative where a release workflow builds <code>dist/</code> and commits it only to the tagged release commit, never to <code>main</code>. Either way, you need a check that the published file is the one the source produces.</p>

<h3>Forgetting to bundle, and the job that catches a stale dist/</h3>
${slide('ga-12', 15, 'Forget to bundle and it fails at once; kiem-dist catches a stale dist/')}
<p>The sandbox has an action that points <code>runs.main</code> straight at a source file that imports <code>@actions/core</code>, with no <code>dist/</code> and no <code>node_modules</code>. Run ${RUN(36029943388)}, job <code>quen-dong-goi</code>:</p>
<div class="out">Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@actions/core' imported from /home/runner/work/ga-san-tap/ga-san-tap/actions/ch12-quen-dong-goi/index.js
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
    ...
Node.js v24.19.0</div>
<p>That failure is loud and immediate. The quiet one is worse: you change <code>src/</code>, forget to run the build, and the action keeps shipping the old <code>dist/</code> — green, and wrong. The job <code>kiem-dist</code> in the same workflow rebuilds and compares:</p>
<pre><code class="language-yaml">  kiem-dist:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with: { node-version: '24' }
      - working-directory: actions/ch12-dem-tep
        run: |
          npm ci --no-audit --no-fund
          npm test
          npm run build
      - name: dist/ da commit co khop voi ban dung lai khong?
        run: git diff --stat --exit-code actions/ch12-dem-tep/dist/</code></pre>
<p>It passed for version 1.0.0 (run ${RUN(36029943388)}) and again after the source changed for 1.1.0 (run ${RUN(36030337073)}), because both times the rebuilt <code>dist/</code> was committed with the source. Delete the build step before committing a source change, and <code>git diff --exit-code</code> returns 1 and turns the job red. The one condition for this check to work is a deterministic build: same lockfile, same ncc version, same Node major — which is exactly what <code>npm ci</code> and a pinned <code>setup-node</code> give you.</p>

<h3>Which Node runs your action</h3>
${slide('ga-12', 16, 'Declaring node20 still runs — on Node 24, with a warning')}
<p>A JavaScript action does not bring its own Node. It runs on the Node that ships <em>inside the runner</em>, which the action&#39;s log line shows plainly: <code>Node dang chay action: v24.19.0 (/home/runner/actions-runner/cached/2.337.0/externals/node24/bin/node)</code>. <code>runs.using</code> is a request. The docs (September 2026) list two values, <code>node20</code> and <code>node24</code>. To see what the request is worth, the sandbox has an action declaring <code>node20</code> that prints its own version (run ${RUN(36029943388)}, job <code>node20</code>):</p>
<div class="out">khai node20, dang chay bang: v24.19.0 (/home/runner/actions-runner/cached/2.337.0/externals/node24/bin/node)
...
##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: ./actions/ch12-node20. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/</div>
<p>The job was green — and ran on Node 24 anyway. For an action author, the consequences are concrete: declare <code>node24</code>, test on Node 24, and release it as a new major version if anything in it depended on Node 20 behaviour. For an action <em>user</em> who pins by SHA, the warning will keep appearing until Dependabot proposes the maintainer&#39;s <code>node24</code> release — a good example of a warning worth reading instead of scrolling past.</p>

<h3>A Docker action: its own tools, its own cost</h3>
${slide('ga-12', 17, 'Docker action: build the image INSIDE the step — seconds, and Linux only')}
<p>The sandbox&#39;s <code>actions/ch12-docker-chao</code> is three files: an <code>action.yml</code> with <code>runs.using: docker</code> and <code>image: Dockerfile</code>, a Dockerfile (<code>FROM alpine:3.20</code>, <code>RUN apk add --no-cache jq bash</code>), and an <code>entrypoint.sh</code>. Its step in run ${RUN(36029943388)} took four seconds, most of it building the image:</p>
<div class="out">#6 [1/3] FROM docker.io/library/alpine:3.20@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc
#7 [2/3] RUN apk add --no-cache jq bash
#7 1.088 OK: 11 MiB in 20 packages
#7 DONE 2.9s
#9 writing image sha256:461a2b725cd0f19840580c221e1a6099c9df28f967f18f178094233bb6c0329f done
/usr/bin/docker run --name b3a112db87714042c59cee454db91be90d_6330dc --label 4098b3 --workdir /github/workspace --rm -e "INPUT_TEN" ... -v "/home/runner/work/ga-san-tap/ga-san-tap":"/github/workspace" 4098b3:a112db87714042c59cee454db91be90d  "Cuong"
tham so $1        = Cuong
INPUT_TEN         = Cuong
may trong container: Alpine Linux v3.20 · jq jq-1.7.1
GITHUB_WORKSPACE  = /github/workspace (pwd = /github/workspace)
GITHUB_OUTPUT     = /github/file_commands/set_output_8a02493a-e546-4204-9493-ea18910e47aa
output loi-chao = Xin chao Cuong tu Docker action</div>
<ul>
<li><strong>Built on every job.</strong> <code>image: Dockerfile</code> means the image is built in the step, every time — here about 3.5 seconds, 2.9 of them <code>apk add</code>. A heavier Dockerfile costs minutes per job. The fix is to build once, push to GHCR, and reference <code>image: docker://ghcr.io/owner/image@sha256:…</code>; the runner then only pulls.</li>
<li><strong>Two ways in.</strong> <code>args:</code> became <code>$1</code>, and every input is also an <code>INPUT_*</code> variable.</li>
<li><strong>The workspace and the command files are mounted.</strong> <code>/github/workspace</code> is your checkout; <code>$GITHUB_OUTPUT</code> points to a mounted file, so outputs work unchanged.</li>
<li><strong>Linux only</strong> (measured on macOS in Lesson 4.1). If an action must run on all three systems, write it in JavaScript.</li>
</ul>

<h3>Test the action in its own repository, on every system it promises</h3>
${slide('ga-12', 19, 'Test the action in its own repo, on every system it promises')}
<p>The sandbox workflow <code>ch12-action.yml</code> is the action&#39;s test suite. Each job checks one claim: the JavaScript action on <code>ubuntu-24.04</code>, <code>windows-2025</code> and <code>macos-15</code>, with a step that asserts on the outputs; <code>kiem-dist</code>; the <code>node20</code> behaviour; the Docker action; and the deliberately broken one. In run ${RUN(36029943388)}, all three systems printed <code>tong=18 nhieu-nhat=.js</code> and passed <code>test "$TONG" -gt 0 &amp;&amp; test -n "$NHIEU"</code>. In the next run (${RUN(36030337073)}), the Windows job waited <strong>five minutes</strong> in the queue (16:52:09 → 16:57:13) while Linux jobs started in two seconds — worth knowing before you put a Windows leg in a pull-request check (Lesson 7.3).</p>
<p>Two kinds of test, two places: logic in <code>src/dem.js</code> is tested with <code>node --test</code> on your machine in a second; the contract with the runner — inputs, outputs, systems — is tested by a workflow calling <code>uses: ./actions/ch12-dem-tep</code>. You need both, and neither replaces the other.</p>

<h3>Releasing: a moving pointer or a pinned SHA</h3>
${slide('ga-12', 18, 'Moving pointer: same file, two SHAs, two sets of outputs')}
<p>Publishing an action means giving its users a ref. The docs recommend semantic version tags (<code>v1.1.3</code>) and keeping the major (<code>v1</code>) and minor (<code>v1.1</code>) tags pointing at the latest matching release. That moving <code>v1</code> is exactly the pointer of Lesson 4.2, seen from the publisher&#39;s side. The sandbox measured it end to end:</p>
<ol>
<li>A consumer workflow uses the action twice: <code>@ch12-dem-tep-v1</code> (the moving pointer) and <code>@b78ea231…&nbsp;# v1.0.0</code> (a pinned SHA).</li>
<li>Run 1 (${RUN(36030257162)}): the pointer resolves to <code>SHA:b78ea231…</code>; both jobs return <code>{ tong, nhieu-nhat }</code>.</li>
<li>Version 1.1.0 adds an output, <code>so-loai</code>. The pointer is moved to it (<code>1716c9fc…</code>). The consumer file is not edited except for a comment.</li>
<li>Run 2 (${RUN(36030357449)}): <code>Download action repository 'cuonghoang1103/ga-san-tap@ch12-dem-tep-v1' (SHA:1716c9fcb212809081b3fd21b29d488c8507b4ef)</code> — the pointer job now returns <code>{ tong, nhieu-nhat, so-loai }</code>. The pinned job still returns two outputs.</li>
</ol>
<p>One honest caveat: the environment this lesson was built in could push branches but not tags, so the moving pointer in the sandbox is a <strong>branch</strong> named <code>ch12-dem-tep-v1</code>. GitHub resolves a branch and a tag to a SHA in the same Set up job step, so the behaviour is the same; the difference is only who is allowed to move it. Both runs also show <code>tong=0</code>: the consumer jobs have no checkout, and a remote action brings its own code, not yours.</p>
<p>Two more publishing facts from the docs (September 2026). <strong>Immutable releases</strong>: if you enable them on the action&#39;s repository, the tag of a published GitHub release can no longer be moved — so the docs suggest creating releases only for exact versions (<code>v1.1.0</code>) and keeping <code>v1</code>/<code>v1.1</code> as plain git tags that you move with <code>git tag -f</code> and a force-push. <strong>Marketplace</strong>: listing requires a public repository with a single <code>action.yml</code> <em>at the root</em> and a unique name; actions in sub-folders — like every action in the sandbox — are not listed automatically. Publishing is a checkbox on the release form, after accepting the Marketplace terms.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "we pin by tag, so we control upgrades".</strong> A team pins its own internal action as <code>@v1</code> in forty repositories and feels in control because they own the action. Then someone moves <code>v1</code> to a commit with a broken <code>dist/</code>, and forty pipelines go red within the hour, none of them changed. Owning the action does not make a moving pointer safe; it only means the outage is yours. Pin internal actions by SHA too, and let Dependabot roll the upgrade out as forty small, reviewable pull requests.</div>

<h3>Run it step by step: your first JavaScript action</h3>
<ol>
<li>In a new folder <code>actions/xin-chao</code>: <code>npm init -y</code>, set <code>"type": "module"</code>, then <code>npm install @actions/core</code> and <code>npm install -D @vercel/ncc</code>.</li>
<li>Write <code>src/index.js</code>: read an input <code>ten</code>, <code>core.setOutput('loi-chao', 'Xin chao ' + ten)</code>, and wrap it in <code>try/catch</code> with <code>core.setFailed</code>.</li>
<li>Write <code>action.yml</code> with the input, the output, <code>runs.using: node24</code> and <code>main: dist/index.js</code>.</li>
<li>Run <code>npx ncc build src/index.js -o dist</code>. Check that <code>dist/package.json</code> exists. Commit <code>dist/</code>, not <code>node_modules/</code>.</li>
<li>Add a workflow that checks out and runs <code>uses: ./actions/xin-chao</code> on <code>ubuntu-24.04</code> and <code>windows-2025</code>, then asserts the output with <code>test</code>.</li>
<li>Add the <code>kiem-dist</code> job. Change the greeting in <code>src/</code> <em>without</em> rebuilding, push, and watch it go red.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Why do JavaScript actions commit a bundled <code>dist/</code> folder?</strong><br>A: The runner executes the file in <code>runs.main</code> directly and never installs dependencies, so that file must contain them. Tools like ncc bundle code and dependencies into one file. A CI job that rebuilds and runs <code>git diff --exit-code dist/</code> prevents the bundle drifting from the source.</p>
<p><strong>Q: JavaScript action or Docker action?</strong><br>A: JavaScript runs on Linux, Windows and macOS and starts instantly, using the runner&#39;s own Node. Docker brings any language and tools but runs only on Linux and pays for building or pulling the image on every job; pre-build the image and reference it by digest to cut that cost.</p>
<p><strong>Q: How should you version an action you publish?</strong><br>A: Semantic version tags per release (<code>v1.2.3</code>), plus moving major/minor tags for users who want automatic updates. Recommend that users pin a full SHA with a version comment and use Dependabot; with immutable releases enabled, only the exact-version tags are tied to releases.</p>
<p><strong>Q: Your action declares <code>node20</code>. What happens today?</strong><br>A: It runs on Node 24 with a deprecation warning (measured on runner 2.337.0). Update <code>runs.using</code> to <code>node24</code>, test, and release a new version.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team wants a small action that fails a pull request if a <code>TODO</code> appears in changed files. Build the skeleton and its safety net.</p><ol>
<li>Follow "Run it step by step" to create a JavaScript action with one input (<code>tu-khoa</code>, default <code>TODO</code>) and one output (<code>so-lan</code>).</li>
<li>Put the counting logic in a pure module and give it one <code>node --test</code> test that runs on your machine.</li>
<li>Add the test workflow (two systems) and the <code>kiem-dist</code> job.</li>
<li>Commit a source change without rebuilding and push.</li>
</ol><p><strong>Done when:</strong> <code>node --test</code> passes locally; the action runs green on two systems and a step asserts its output; <code>kiem-dist</code> goes red on the unbuilt change with a <code>git diff --stat</code> naming <code>dist/index.js</code>, and green again after you rebuild.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">JavaScript action</span><span class="v"><code>runs.using: node24</code>; runs <code>runs.main</code> on the runner&#39;s own Node</span></div>
<div class="kv"><span class="k"><code>@actions/core</code></span><span class="v">toolkit for inputs, outputs, annotations, summaries, <code>setFailed</code>; ESM-only since 3.x</span></div>
<div class="kv"><span class="k">ncc</span><span class="v">bundler that turns source plus dependencies into one <code>dist/index.js</code></span></div>
<div class="kv"><span class="k">check-dist job</span><span class="v">rebuild in CI and fail if the committed <code>dist/</code> differs</span></div>
<div class="kv"><span class="k">Docker action</span><span class="v"><code>runs.using: docker</code>; image built or pulled per job; Linux only</span></div>
<div class="kv"><span class="k">moving major tag</span><span class="v"><code>v1</code> re-pointed to each new v1.x release; users of it upgrade without editing files</span></div>
<div class="kv"><span class="k">immutable release</span><span class="v">a release whose tag can no longer be moved or deleted</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The runner runs <code>runs.main</code> as is and never installs dependencies: bundle with ncc and commit <code>dist/</code> (ncc 0.45 compiles ESM and adds <code>dist/package.json</code>).</li>
<li><code>@actions/core</code> 3.x and <code>@actions/github</code> 9.x are ESM-only — <code>import</code>, not <code>require</code>.</li>
<li>Forgetting to bundle fails loudly (<code>ERR_MODULE_NOT_FOUND</code>); a stale <code>dist/</code> fails silently — add a check-dist job.</li>
<li>Actions run on the runner&#39;s Node; <code>node20</code> is now forced onto Node 24 with a warning.</li>
<li>Docker actions carry their own tools but rebuild per job and run only on Linux; pre-build and pull by digest.</li>
<li>A moving <code>v1</code> hands upgrades to the publisher; a SHA plus Dependabot keeps them with the user — measured with the same file, two runs, two SHAs.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a JavaScript action</span><span class="lc-sub">docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action — the toolkit, and why to bundle with ncc or rollup instead of committing <code>node_modules</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a Docker container action</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-containerized-services/create-a-docker-container-action — Dockerfile, <code>args</code>, entrypoint, and what is mounted.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Release and maintain actions</span><span class="lc-sub">docs.github.com/en/actions/how-tos/create-and-publish-actions/release-and-maintain-actions — semantic tags, moving major/minor tags, building on release.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Publish in GitHub Marketplace</span><span class="lc-sub">docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace — public repository, one <code>action.yml</code> at the root, unique name.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — Deprecation of Node 20 on GitHub Actions runners</span><span class="lc-sub">github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners — the link printed by the runner&#39;s own warning.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — building small images and referencing them by digest</span><span class="lc-sub">/courses/docker/learn${REF} — the pre-built image a fast Docker action should pull instead of building every time.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Action JavaScript và Docker: dựng, test, phát hành</h2>
<p class="lead">Composite action là YAML dán các thứ khác lại với nhau. Khi bản thân phần logic cần một ngôn ngữ thật — đọc một báo cáo, gọi API GitHub, quyết định dựa trên JSON — bạn viết action JavaScript (chạy mọi hệ, khởi động tức thì) hoặc Docker action (mang công cụ riêng, chỉ Linux). Viết ra thì dễ. Bài này dành phần lớn thời gian cho những chỗ hỏng SAU đó: runner thật sự chạy cái gì, nó dùng Node nào, làm sao biết tệp phát hành khớp với mã nguồn, và người dùng nhận phiên bản kế tiếp ra sao.</p>

<h3>Giải phẫu một action JavaScript</h3>
${slide('ga-12', 14, 'JavaScript action: src/ → ncc → MỘT tệp dist/ commit vào kho')}
<p>Action <code>actions/ch12-dem-tep</code> trên sân tập đếm tệp theo đuôi trong một thư mục, trả hai output, ghi một job summary, và đọc thông tin kho qua API. <code>action.yml</code> của nó:</p>
<pre><code class="language-yaml">name: ch12 dem tep
description: Dem tep theo duoi trong mot thu muc, ghi output + job summary, doc repo bang Octokit
inputs:
  thu-muc:
    default: '.'
  token:
    description: Token de goi API (mac dinh la GITHUB_TOKEN cua job)
    default: &#36;{{ github.token }}
outputs:
  tong:        { description: Tong so tep }
  nhieu-nhat:  { description: Duoi tep xuat hien nhieu nhat }
runs:
  using: node24
  main: dist/index.js
branding: { icon: hash, color: blue }</code></pre>
<p>Ba chi tiết gánh gần hết trọng lượng. <code>default: &#36;{{ github.token }}</code> cho action một token mà bên gọi không phải truyền — đúng mẹo mà <code>actions/checkout</code> dùng (Bài 4.1), và là lý do log hiện <code>token: ***</code> trong khối <code>with:</code> dù workflow chưa từng nhắc tới nó. <code>runs.main</code> chỉ tên <strong>một tệp</strong>, và runner chạy đúng tệp đó: nó không bao giờ chạy <code>npm install</code> cho action. Còn <code>branding</code> chỉ có ý nghĩa trên Marketplace.</p>
<p>Mã được tách có chủ ý. <code>src/dem.js</code> là logic thuần, không import <code>@actions/*</code>, nên test được ngay trên laptop bằng <code>node --test</code> (một test, xanh, trước cả lần push đầu). <code>src/index.js</code> là lớp mỏng nói chuyện với runner:</p>
<pre><code class="language-javascript">import * as core from '@actions/core';
import * as github from '@actions/github';
import { demTep } from './dem.js';

async function chay() {
  const thuMuc = core.getInput('thu-muc');
  const token = core.getInput('token', { required: true });
  const { tong, xep, nhieuNhat } = demTep(thuMuc);
  core.setOutput('tong', tong);
  core.setOutput('nhieu-nhat', nhieuNhat);
  if (tong &gt; 40) core.warning('... nhieu hon nguong 40', { title: 'ch12-dem-tep' });
  const octokit = github.getOctokit(token);
  const { data } = await octokit.rest.repos.get(github.context.repo);
  core.info('repo ' + data.full_name + ' · nhanh mac dinh ' + data.default_branch);
  await core.summary.addHeading('ch12-dem-tep', 3).addTable(/* ... */).write();
}
chay().catch((e) =&gt; core.setFailed(e.message));</code></pre>
<p><code>getInput</code> đọc đúng thứ log hiện dưới <code>with:</code> (bên trong là các biến <code>INPUT_*</code> của Bài 4.1); <code>setOutput</code> ghi vào <code>$GITHUB_OUTPUT</code>; <code>warning</code> tạo một annotation; <code>summary</code> ghi trang job summary; <code>setFailed</code> đặt mã thoát 1 — chính dòng này biến một ngoại lệ thành một bước đỏ tử tế thay vì một cú sập kèm stack trace.</p>

<h3>Đóng gói: vì sao commit dist/, và năm 2026 đã đổi gì</h3>
<p>Vì runner không cài phụ thuộc, tệp được chỉ trong <code>runs.main</code> phải chứa sẵn chúng. Công cụ chuẩn là <a href="https://github.com/vercel/ncc" target="_blank" rel="noopener">@vercel/ncc</a>, thứ mà docs GitHub khuyên dùng thay cho việc commit <code>node_modules</code>:</p>
<div class="out">$ npm run build
&gt; ncc build src/index.js -o dist --license licenses.txt
ncc: Version 0.45.0
ncc: Compiling file index.js into ESM
   0kB  dist/package.json
  30kB  dist/licenses.txt
1250kB  dist/index.js
1280kB  [2158ms] - ncc 0.45.0</div>
<p>Hai điều trong output đó là MỚI so với phần lớn các bài hướng dẫn bạn sẽ gặp. Một, <code>@actions/core</code> 3.0.1 và <code>@actions/github</code> 9.1.1 (bản hiện hành trên npm, 09/2026) là gói <strong>chỉ-ESM</strong> (<code>"type": "module"</code>) — từ <code>@actions/github</code> 9.0.0 (27/01/2026) và <code>@actions/core</code> 3.0.0 (29/01/2026), theo sổ đăng ký npm: không <code>require()</code>, chỉ <code>import</code>. Ví dụ cũ viết <code>const core = require('@actions/core')</code> sẽ không chạy với chúng. Hai, ncc nhận ra điều đó và biên dịch "into ESM", nên nó ghi thêm một <code>dist/package.json</code> tí hon chứa <code>{"type":"module"}</code>. Quên commit tệp đó là Node sẽ đọc <code>dist/index.js</code> như CommonJS.</p>
<p>Commit 1,25 MB mã sinh ra vào kho nghe có vẻ sai, và nó có một cái giá thật: tệp đó có thể trôi lệch khỏi mã nguồn. Docs mô tả một cách khác, trong đó workflow phát hành dựng <code>dist/</code> và chỉ commit nó vào commit gắn thẻ phát hành, không bao giờ vào <code>main</code>. Cách nào thì cách, bạn cũng cần một phép kiểm rằng tệp phát hành đúng là thứ mã nguồn sinh ra.</p>

<h3>Quên đóng gói, và cái job bắt được dist/ cũ</h3>
${slide('ga-12', 15, 'Quên đóng gói thì đỏ ngay; kiem-dist bắt dist/ cũ')}
<p>Sân tập có một action trỏ <code>runs.main</code> thẳng vào tệp nguồn có import <code>@actions/core</code>, không <code>dist/</code>, không <code>node_modules</code>. Run ${RUN(36029943388)}, job <code>quen-dong-goi</code>:</p>
<div class="out">Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@actions/core' imported from /home/runner/work/ga-san-tap/ga-san-tap/actions/ch12-quen-dong-goi/index.js
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
    ...
Node.js v24.19.0</div>
<p>Lỗi đó ồn ào và tức thì. Lỗi im lặng mới tệ hơn: bạn sửa <code>src/</code>, quên chạy build, và action cứ tiếp tục phát hành <code>dist/</code> cũ — xanh, và sai. Job <code>kiem-dist</code> trong cùng workflow dựng lại rồi so:</p>
<pre><code class="language-yaml">  kiem-dist:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with: { node-version: '24' }
      - working-directory: actions/ch12-dem-tep
        run: |
          npm ci --no-audit --no-fund
          npm test
          npm run build
      - name: dist/ da commit co khop voi ban dung lai khong?
        run: git diff --stat --exit-code actions/ch12-dem-tep/dist/</code></pre>
<p>Nó xanh với bản 1.0.0 (run ${RUN(36029943388)}) và xanh lại sau khi mã nguồn đổi cho bản 1.1.0 (run ${RUN(36030337073)}), vì cả hai lần <code>dist/</code> dựng lại đều được commit cùng mã nguồn. Bỏ bước build trước khi commit một thay đổi mã nguồn, là <code>git diff --exit-code</code> trả 1 và job đỏ. Điều kiện duy nhất để phép kiểm này đứng vững là bản dựng phải tất định: cùng lockfile, cùng phiên bản ncc, cùng major của Node — đúng thứ <code>npm ci</code> và một <code>setup-node</code> được ghim mang lại.</p>

<h3>Action của bạn chạy bằng Node nào</h3>
${slide('ga-12', 16, 'Khai node20 vẫn chạy — trên Node 24, kèm một cảnh báo')}
<p>Action JavaScript không mang Node theo. Nó chạy bằng Node đi kèm <em>bên trong runner</em>, như dòng log của chính action nói thẳng: <code>Node dang chay action: v24.19.0 (/home/runner/actions-runner/cached/2.337.0/externals/node24/bin/node)</code>. <code>runs.using</code> là một lời xin. Docs (09/2026) liệt kê hai giá trị, <code>node20</code> và <code>node24</code>. Để xem lời xin đó đáng giá bao nhiêu, sân tập có một action khai <code>node20</code> và in ra phiên bản của chính nó (run ${RUN(36029943388)}, job <code>node20</code>):</p>
<div class="out">khai node20, dang chay bang: v24.19.0 (/home/runner/actions-runner/cached/2.337.0/externals/node24/bin/node)
...
##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: ./actions/ch12-node20. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/</div>
<p>Job xanh — và vẫn chạy trên Node 24. Với người viết action, hệ quả rất cụ thể: khai <code>node24</code>, test trên Node 24, và phát hành thành một major mới nếu có chỗ nào phụ thuộc hành vi của Node 20. Với người <em>dùng</em> action ghim bằng SHA, cảnh báo này sẽ còn hiện cho tới khi Dependabot đề xuất bản <code>node24</code> của người bảo trì — một ví dụ tốt về cảnh báo đáng đọc thay vì cuộn qua.</p>

<h3>Một Docker action: công cụ riêng, cái giá riêng</h3>
${slide('ga-12', 17, 'Docker action: dựng ảnh NGAY trong bước — 4 giây, và chỉ Linux')}
<p><code>actions/ch12-docker-chao</code> của sân tập gồm ba tệp: <code>action.yml</code> với <code>runs.using: docker</code> và <code>image: Dockerfile</code>, một Dockerfile (<code>FROM alpine:3.20</code>, <code>RUN apk add --no-cache jq bash</code>), và một <code>entrypoint.sh</code>. Bước của nó trong run ${RUN(36029943388)} mất bốn giây, phần lớn là dựng ảnh:</p>
<div class="out">#6 [1/3] FROM docker.io/library/alpine:3.20@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc
#7 [2/3] RUN apk add --no-cache jq bash
#7 1.088 OK: 11 MiB in 20 packages
#7 DONE 2.9s
#9 writing image sha256:461a2b725cd0f19840580c221e1a6099c9df28f967f18f178094233bb6c0329f done
/usr/bin/docker run --name b3a112db87714042c59cee454db91be90d_6330dc --label 4098b3 --workdir /github/workspace --rm -e "INPUT_TEN" ... -v "/home/runner/work/ga-san-tap/ga-san-tap":"/github/workspace" 4098b3:a112db87714042c59cee454db91be90d  "Cuong"
tham so $1        = Cuong
INPUT_TEN         = Cuong
may trong container: Alpine Linux v3.20 · jq jq-1.7.1
GITHUB_WORKSPACE  = /github/workspace (pwd = /github/workspace)
GITHUB_OUTPUT     = /github/file_commands/set_output_8a02493a-e546-4204-9493-ea18910e47aa
output loi-chao = Xin chao Cuong tu Docker action</div>
<ul>
<li><strong>Dựng lại ở mỗi job.</strong> <code>image: Dockerfile</code> nghĩa là ảnh được dựng ngay trong bước, lần nào cũng vậy — ở đây khoảng 3,5 giây, 2,9 giây trong đó là <code>apk add</code>. Một Dockerfile nặng hơn sẽ tốn vài phút mỗi job. Cách vá là dựng một lần, đẩy lên GHCR, rồi tham chiếu <code>image: docker://ghcr.io/owner/image@sha256:…</code>; khi đó runner chỉ còn kéo ảnh về.</li>
<li><strong>Hai đường vào.</strong> <code>args:</code> thành <code>$1</code>, và input nào cũng đồng thời là một biến <code>INPUT_*</code>.</li>
<li><strong>Workspace và các tệp lệnh được mount vào.</strong> <code>/github/workspace</code> là bản checkout của bạn; <code>$GITHUB_OUTPUT</code> trỏ tới một tệp được mount, nên output chạy như bình thường.</li>
<li><strong>Chỉ Linux</strong> (đã đo trên macOS ở Bài 4.1). Action phải chạy được trên cả ba hệ thì viết bằng JavaScript.</li>
</ul>

<h3>Test action ngay trong kho của nó, trên mọi hệ nó hứa chạy</h3>
${slide('ga-12', 19, 'Test action ngay trong kho của nó, trên mọi hệ nó hứa chạy')}
<p>Workflow <code>ch12-action.yml</code> trên sân tập chính là bộ test của action. Mỗi job kiểm một lời hứa: action JavaScript trên <code>ubuntu-24.04</code>, <code>windows-2025</code> và <code>macos-15</code>, với một bước khẳng định output; <code>kiem-dist</code>; hành vi <code>node20</code>; Docker action; và cái cố ý hỏng. Ở run ${RUN(36029943388)}, cả ba hệ in ra <code>tong=18 nhieu-nhat=.js</code> và qua <code>test "$TONG" -gt 0 &amp;&amp; test -n "$NHIEU"</code>. Ở run kế tiếp (${RUN(36030337073)}), job Windows ngồi xếp hàng <strong>năm phút</strong> (16:52:09 → 16:57:13) trong khi các job Linux bắt đầu sau hai giây — đáng biết trước khi bạn đặt một nhánh Windows vào check của pull request (Bài 7.3).</p>
<p>Hai loại test, hai chỗ: logic trong <code>src/dem.js</code> test bằng <code>node --test</code> trên máy bạn trong một giây; còn hợp đồng với runner — input, output, các hệ — test bằng một workflow gọi <code>uses: ./actions/ch12-dem-tep</code>. Bạn cần cả hai, và không cái nào thay được cái nào.</p>

<h3>Phát hành: con trỏ di động hay ghim SHA</h3>
${slide('ga-12', 18, 'Con trỏ di động: cùng một tệp, hai SHA, hai bộ output')}
<p>Phát hành một action nghĩa là đưa cho người dùng một ref. Docs khuyên dùng thẻ phiên bản ngữ nghĩa (<code>v1.1.3</code>) và giữ thẻ major (<code>v1</code>) và minor (<code>v1.1</code>) luôn trỏ vào bản phát hành mới nhất tương ứng. Cái <code>v1</code> di động ấy đúng là con trỏ của Bài 4.2, nhìn từ phía người phát hành. Sân tập đo nó từ đầu tới cuối:</p>
<ol>
<li>Một workflow bên dùng gọi action hai lần: <code>@ch12-dem-tep-v1</code> (con trỏ di động) và <code>@b78ea231…&nbsp;# v1.0.0</code> (ghim SHA).</li>
<li>Lần 1 (${RUN(36030257162)}): con trỏ giải thành <code>SHA:b78ea231…</code>; cả hai job trả về <code>{ tong, nhieu-nhat }</code>.</li>
<li>Bản 1.1.0 thêm một output, <code>so-loai</code>. Con trỏ được dời sang nó (<code>1716c9fc…</code>). Tệp của bên dùng không sửa gì ngoài một dòng chú thích.</li>
<li>Lần 2 (${RUN(36030357449)}): <code>Download action repository 'cuonghoang1103/ga-san-tap@ch12-dem-tep-v1' (SHA:1716c9fcb212809081b3fd21b29d488c8507b4ef)</code> — job con trỏ giờ trả <code>{ tong, nhieu-nhat, so-loai }</code>. Job ghim SHA vẫn trả hai output.</li>
</ol>
<p>Một lưu ý thật thà: môi trường dựng bài này đẩy được nhánh nhưng không đẩy được thẻ, nên con trỏ di động trên sân tập là một <strong>nhánh</strong> tên <code>ch12-dem-tep-v1</code>. GitHub giải nhánh và thẻ thành SHA ở cùng một chỗ trong Set up job, nên hành vi như nhau; khác nhau chỉ ở chỗ ai được phép dời nó. Cả hai lần chạy cũng cho <code>tong=0</code>: job bên dùng không checkout, và một action từ xa mang theo mã CỦA NÓ, không mang mã của bạn.</p>
<p>Thêm hai sự thật về phát hành từ docs (09/2026). <strong>Immutable releases (bản phát hành bất biến)</strong>: nếu bật cho kho của action, thẻ của một GitHub release đã công bố không dời được nữa — nên docs gợi ý chỉ tạo release cho phiên bản chính xác (<code>v1.1.0</code>), còn <code>v1</code>/<code>v1.1</code> để làm thẻ git thường và dời bằng <code>git tag -f</code> rồi force-push. <strong>Marketplace</strong>: để được liệt kê cần một kho public với đúng một <code>action.yml</code> <em>ở thư mục gốc</em> và một cái tên chưa ai dùng; action nằm trong thư mục con — như mọi action trên sân tập — không được tự liệt kê. Việc công bố là một ô đánh dấu trên form tạo release, sau khi chấp nhận điều khoản Marketplace.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "ta ghim bằng thẻ nên ta kiểm soát việc nâng cấp".</strong> Một đội ghim action nội bộ của mình là <code>@v1</code> trong bốn mươi kho và thấy yên tâm vì action là của mình. Rồi ai đó dời <code>v1</code> sang một commit có <code>dist/</code> hỏng, và bốn mươi pipeline đỏ trong vòng một giờ, không cái nào có thay đổi gì. Sở hữu action không làm con trỏ di động an toàn hơn; nó chỉ có nghĩa là sự cố thuộc về bạn. Action nội bộ cũng ghim bằng SHA, và để Dependabot đẩy việc nâng cấp ra thành bốn mươi pull request nhỏ, xem xét được.</div>

<h3>Chạy thử từng bước: action JavaScript đầu tiên của bạn</h3>
<ol>
<li>Trong một thư mục mới <code>actions/xin-chao</code>: <code>npm init -y</code>, đặt <code>"type": "module"</code>, rồi <code>npm install @actions/core</code> và <code>npm install -D @vercel/ncc</code>.</li>
<li>Viết <code>src/index.js</code>: đọc input <code>ten</code>, <code>core.setOutput('loi-chao', 'Xin chao ' + ten)</code>, bọc trong <code>try/catch</code> với <code>core.setFailed</code>.</li>
<li>Viết <code>action.yml</code> có input, output, <code>runs.using: node24</code> và <code>main: dist/index.js</code>.</li>
<li>Chạy <code>npx ncc build src/index.js -o dist</code>. Kiểm <code>dist/package.json</code> có tồn tại. Commit <code>dist/</code>, không commit <code>node_modules/</code>.</li>
<li>Thêm một workflow checkout rồi chạy <code>uses: ./actions/xin-chao</code> trên <code>ubuntu-24.04</code> và <code>windows-2025</code>, rồi khẳng định output bằng <code>test</code>.</li>
<li>Thêm job <code>kiem-dist</code>. Sửa câu chào trong <code>src/</code> mà <em>không</em> build lại, push, và nhìn nó đỏ.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Vì sao action JavaScript commit thư mục <code>dist/</code> đã đóng gói?</strong><br>Đ: Runner chạy thẳng tệp trong <code>runs.main</code> và không bao giờ cài phụ thuộc, nên tệp đó phải chứa sẵn chúng. Công cụ như ncc gói mã và phụ thuộc thành một tệp. Một job CI dựng lại và chạy <code>git diff --exit-code dist/</code> ngăn gói bị trôi lệch khỏi mã nguồn.</p>
<p><strong>H: Action JavaScript hay Docker action?</strong><br>Đ: JavaScript chạy trên Linux, Windows và macOS, khởi động tức thì, dùng Node của chính runner. Docker mang theo ngôn ngữ và công cụ tuỳ ý nhưng chỉ chạy trên Linux và trả giá dựng hoặc kéo ảnh ở mỗi job; dựng sẵn ảnh và tham chiếu bằng digest để cắt cái giá đó.</p>
<p><strong>H: Nên đánh phiên bản action bạn phát hành thế nào?</strong><br>Đ: Thẻ phiên bản ngữ nghĩa cho mỗi bản (<code>v1.2.3</code>), cộng thẻ major/minor di động cho người muốn tự cập nhật. Khuyên người dùng ghim SHA đầy đủ kèm chú thích phiên bản và dùng Dependabot; khi bật immutable releases thì chỉ thẻ phiên bản chính xác gắn với release.</p>
<p><strong>H: Action của bạn khai <code>node20</code>. Hôm nay chuyện gì xảy ra?</strong><br>Đ: Nó chạy trên Node 24 kèm một cảnh báo ngừng hỗ trợ (đo trên runner 2.337.0). Đổi <code>runs.using</code> sang <code>node24</code>, test, và phát hành bản mới.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> đội bạn muốn một action nhỏ đánh trượt pull request nếu tệp thay đổi có chữ <code>TODO</code>. Dựng bộ khung và lưới an toàn của nó.</p><ol>
<li>Làm theo "Chạy thử từng bước" để tạo một action JavaScript có một input (<code>tu-khoa</code>, mặc định <code>TODO</code>) và một output (<code>so-lan</code>).</li>
<li>Đặt logic đếm vào một module thuần và cho nó một test <code>node --test</code> chạy trên máy bạn.</li>
<li>Thêm workflow test (hai hệ) và job <code>kiem-dist</code>.</li>
<li>Commit một thay đổi mã nguồn mà không build lại, rồi push.</li>
</ol><p><strong>Đạt khi:</strong> <code>node --test</code> xanh trên máy; action chạy xanh trên hai hệ và có một bước khẳng định output của nó; <code>kiem-dist</code> đỏ với thay đổi chưa build, kèm <code>git diff --stat</code> chỉ tên <code>dist/index.js</code>, và xanh lại sau khi bạn build.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">action JavaScript</span><span class="v"><code>runs.using: node24</code>; chạy <code>runs.main</code> bằng Node của chính runner</span></div>
<div class="kv"><span class="k"><code>@actions/core</code></span><span class="v">bộ công cụ cho input, output, annotation, summary, <code>setFailed</code>; chỉ-ESM từ bản 3.x</span></div>
<div class="kv"><span class="k">ncc</span><span class="v">công cụ đóng gói biến mã nguồn cộng phụ thuộc thành một <code>dist/index.js</code></span></div>
<div class="kv"><span class="k">job kiểm dist (check-dist)</span><span class="v">dựng lại trong CI và đánh đỏ nếu <code>dist/</code> đã commit khác đi</span></div>
<div class="kv"><span class="k">Docker action</span><span class="v"><code>runs.using: docker</code>; ảnh được dựng hoặc kéo ở mỗi job; chỉ Linux</span></div>
<div class="kv"><span class="k">thẻ major di động</span><span class="v"><code>v1</code> được trỏ lại vào mỗi bản v1.x mới; người dùng nó được nâng cấp mà không sửa tệp</span></div>
<div class="kv"><span class="k">immutable release (bản phát hành bất biến)</span><span class="v">bản phát hành mà thẻ của nó không dời hay xoá được nữa</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Runner chạy <code>runs.main</code> nguyên như vậy và không cài phụ thuộc: đóng gói bằng ncc và commit <code>dist/</code> (ncc 0.45 biên dịch ESM và thêm <code>dist/package.json</code>).</li>
<li><code>@actions/core</code> 3.x và <code>@actions/github</code> 9.x là chỉ-ESM — dùng <code>import</code>, không <code>require</code>.</li>
<li>Quên đóng gói thì hỏng ầm ĩ (<code>ERR_MODULE_NOT_FOUND</code>); <code>dist/</code> cũ thì hỏng im lặng — thêm job kiểm dist.</li>
<li>Action chạy bằng Node của runner; <code>node20</code> nay bị ép lên Node 24 kèm cảnh báo.</li>
<li>Docker action mang công cụ riêng nhưng dựng lại ở mỗi job và chỉ chạy Linux; dựng sẵn và kéo bằng digest.</li>
<li><code>v1</code> di động trao việc nâng cấp cho người phát hành; SHA cộng Dependabot giữ nó ở người dùng — đã đo với cùng một tệp, hai run, hai SHA.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a JavaScript action</span><span class="lc-sub">docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action — bộ công cụ, và vì sao đóng gói bằng ncc hay rollup thay vì commit <code>node_modules</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a Docker container action</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-containerized-services/create-a-docker-container-action — Dockerfile, <code>args</code>, entrypoint, và những gì được mount.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Release and maintain actions</span><span class="lc-sub">docs.github.com/en/actions/how-tos/create-and-publish-actions/release-and-maintain-actions — thẻ ngữ nghĩa, thẻ major/minor di động, dựng lúc phát hành.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Publish in GitHub Marketplace</span><span class="lc-sub">docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace — kho public, một <code>action.yml</code> ở gốc, tên không trùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — Deprecation of Node 20 on GitHub Actions runners</span><span class="lc-sub">github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners — đường dẫn do chính cảnh báo của runner in ra.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — dựng ảnh nhỏ và tham chiếu bằng digest</span><span class="lc-sub">/courses/docker/learn${REF} — cái ảnh dựng sẵn mà một Docker action nhanh nên kéo về thay vì dựng lại mỗi lần.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Templates for an organisation, and the maintenance bill|||12.4 — Mẫu cho tổ chức, và hoá đơn bảo trì',
      slug: 'ga-12-4-mau-cho-to-chuc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Năm cỡ tái sử dụng từ YAML anchor tới workflow template của tổ chức, đo thật: GitHub nhận & và * nhưng không nhận merge key <<, và báo lỗi sai dòng. Kiểm kê api-backend (24 lượt uses:, 0 ghim SHA), một script ghim SHA chỉ bằng git trong 4 giây, Dependabot cho github-actions, và cái giá bảo trì của mỗi lựa chọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Templates for an organisation, and the maintenance bill</h2>
<p class="lead">Every reuse mechanism in this chapter is a trade: you remove copies, and in exchange you gain a thing that has versions, callers and a blast radius. This lesson is about choosing the smallest mechanism that does the job, knowing the organisation-level tools that exist around them, and keeping what you depend on up to date without doing it by hand.</p>

<h3>Five sizes of reuse</h3>
${slide('ga-12', 20, 'Five sizes of reuse — choose the SMALLEST that works')}
<table>
<thead><tr><th>Size</th><th>Scope</th><th>How it is versioned</th><th>When</th></tr></thead>
<tbody>
<tr><td>YAML anchor <code>&amp;name</code> / <code>*name</code></td><td>inside one file</td><td>with the file</td><td>two jobs in one workflow share env or steps</td></tr>
<tr><td>Script in the repository</td><td>one repository</td><td>with each commit</td><td>logic that is mostly shell and should be testable locally</td></tr>
<tr><td>Local composite action</td><td>one repository</td><td>with each commit</td><td>the same steps in three or more workflows</td></tr>
<tr><td>Reusable workflow / action in its own repository</td><td>many repositories</td><td>pinned SHA, Dependabot</td><td>many teams, one pipeline or one tool</td></tr>
<tr><td>Workflow template (organisation)</td><td>a starting point for <em>new</em> repositories</td><td>copied once, then drifts</td><td>a standard beginning, not a standard that is maintained</td></tr>
</tbody>
</table>
<p>Moving down the table costs more each time: a new repository to own, a release process, callers you cannot see. Lesson 4.5 measured the cost of staying at the top too long (nine copies of an SSH block that had already drifted into two versions). The mistake in the other direction is just as common: a shared action with ten inputs, built from two copies that only looked alike.</p>

<h3>YAML anchors: the smallest size, measured</h3>
${slide('ga-12', 21, 'YAML anchors: & and * work, the merge key << does not')}
<p>GitHub Actions now accepts YAML anchors and aliases (the docs describe them in the reusing-workflow reference). The sandbox workflow <code>ch12-neo.yml</code> defines the environment and the steps once in <code>lint</code> and reuses both in <code>test</code>:</p>
<pre><code class="language-yaml">jobs:
  lint:
    runs-on: ubuntu-24.04
    env: &amp;env-chung
      NODE_ENV: test
      TZ: Asia/Ho_Chi_Minh
    steps: &amp;buoc-chung
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - name: In moi truong
        run: echo "job=&#36;{{ github.job }} NODE_ENV=$NODE_ENV TZ=$TZ"
  test:
    runs-on: ubuntu-24.04
    env: *env-chung
    steps: *buoc-chung</code></pre>
<p>Run ${RUN(36029548603)} was green, both jobs printing the shared environment. The feature most people reach for next is the merge key, "copy this map, then override one key":</p>
<pre><code class="language-yaml">  bien-the:
    env:
      &lt;&lt;: *env-goc
      NODE_ENV: production</code></pre>
<p>That file never ran. Run ${RUN(36029546312)} failed before creating any job — even the run&#39;s name fell back to the file path, because GitHub could not read the <code>name:</code> — with:</p>
<div class="out">Invalid workflow file: .github/workflows/ch12-neo-gop.yml#L1
(Line: 13, Col: 10): A mapping was not expected</div>
<p>Line 13, column 10 is where <code>&amp;env-goc</code> is <em>defined</em>, not the <code>&lt;&lt;:</code> on line 21 that caused the problem. actionlint, run on the same file before pushing, pointed at the right place:</p>
<div class="out">.github/workflows/ch12-neo-gop.yml:21:7: GitHub Actions does not support YAML merge key "&lt;&lt;" [syntax-check]</div>
<p>Two lessons in one. Anchors are fine for exact repetition inside one file, but there is no "copy and change one key", so every variation still needs its own full block. And when GitHub&#39;s parser and a linter disagree about where an error is, trust the one that names the construct.</p>

<div class="callout">
<p><strong>When anchors are the wrong tool.</strong> An anchor is invisible coupling: someone editing the <code>lint</code> job&#39;s steps also changes <code>test</code>, and the diff does not show it. Use them for data that must stay identical (an env block, a list of paths), not for steps that will diverge next month. The moment you would want <code>&lt;&lt;:</code>, you want an input — a composite action or a matrix.</p>
</div>

<h3>Workflow templates: the organisation&#39;s starting point</h3>
${slide('ga-12', 22, 'Workflow templates live in the ORGANISATION’s .github repository')}
<p>An organisation can publish workflow templates: files in a <code>workflow-templates/</code> folder of its <code>.github</code> repository, each with a metadata file of the same name ending in <code>.properties.json</code>. When someone in the organisation creates a new workflow, the templates appear as choices. From the docs (September 2026):</p>
<ul>
<li>The metadata keys are <code>name</code> and <code>description</code> (required), and <code>iconName</code>, <code>categories</code> and <code>filePatterns</code> (optional). <code>filePatterns</code> suggests the template when the repository has a matching file at its root, for example <code>package.json$</code>.</li>
<li>Inside the template, <code>$default-branch</code> is replaced with the repository&#39;s default branch at creation time.</li>
<li>Visibility follows the <code>.github</code> repository: a public one serves every repository type, an internal one only internal and private repositories, a private one only private repositories (which also need read access granted).</li>
</ul>
<p>This part could not be run in this course&#39;s sandbox: templates exist only for organisations, and the sandbox belongs to a personal account. Everything above comes from the docs, and should be treated that way. What the docs make clear is the property that matters most for a team: a template is a <strong>copy made once</strong>. Improving the template improves no existing repository. The pattern that works is a template of a few lines whose only job is to call a reusable workflow pinned by SHA — the template spreads the call, the reusable workflow carries the logic, and Dependabot carries the upgrades.</p>

<h3>Conventions that keep a shared library readable</h3>
<ul>
<li><strong>Reusable workflows must sit directly in <code>.github/workflows/</code></strong> — the docs are explicit that subdirectories are not supported. Name them so they cannot be mistaken for entry points, for example a <code>reusable-</code> prefix, and give them no <code>push</code>/<code>pull_request</code> trigger.</li>
<li><strong>Composite actions go in <code>.github/actions/&lt;verb-noun&gt;/action.yml</code></strong>, one folder each, with any script they call next to the <code>action.yml</code> (reached through <code>$GITHUB_ACTION_PATH</code>, Lesson 12.2).</li>
<li><strong>A shared action repository has one action at its root</strong> if it will ever be listed on the Marketplace (Lesson 12.3); an internal collection can use sub-folders.</li>
<li><strong>Every interface is documented in the file itself</strong>: a <code>description</code> on each input, output and secret. It is the only documentation that cannot drift from the code.</li>
<li><strong>Restrict who can be trusted.</strong> For deployments, the docs describe using the OIDC claim <code>job_workflow_ref</code> so that a cloud account accepts tokens only from one specific reusable workflow — "only the approved deploy workflow may deploy". This was not tested in the sandbox; it is the organisation-scale version of Lesson 6.3.</li>
</ul>

<h3>Measured: what api-backend depends on today</h3>
${slide('ga-12', 23, 'api-backend: 24 uses:, 0 pinned — resolving every SHA takes 4 seconds')}
<p>The repository behind this site, at <code>origin/main</code> commit <code>da88704e</code> (24 September 2026), has 14 workflows and 24 <code>uses:</code> lines: 8 × <code>actions/checkout@v4</code>, 7 × <code>actions/setup-node@v4</code>, 2 × <code>docker/build-push-action@v6</code>, 2 × <code>actions/cache@v4</code>, and one each of five others. None is pinned by SHA. There is no <code>workflow_call</code>, no <code>.github/actions/</code> folder, and no <code>dependabot.yml</code>. Lesson 4.2 counted 21 lines at an earlier commit; the number only grows when nothing gathers it.</p>
<p>Pinning needs one fact per action: which commit does the tag point to right now, and which full version is that? The GitHub API answers it, but so does plain git — no <code>gh</code>, no token:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# ghim-sha.sh — moi owner/repo@the trong .github/workflows: SHA 40 ky tu + the phien ban DAY DU cung commit.
set -euo pipefail
grep -ho 'uses: *[^ #]*' .github/workflows/*.y*ml | sed 's/uses: *//' \\
  | grep -v '^\\./' | grep -v '^docker://' | sort -u |
while IFS=@ read -r duong the; do
  repo=$(cut -d/ -f1-2 &lt;&lt;&lt;"$duong")
  bang=$(git ls-remote --tags "https://github.com/$repo")
  sha=$(awk -v t="refs/tags/$the^{}" '$2==t{print $1}' &lt;&lt;&lt;"$bang")      # the annotated: lay commit
  [ -z "$sha" ] &amp;&amp; sha=$(awk -v t="refs/tags/$the" '$2==t{print $1}' &lt;&lt;&lt;"$bang")
  day_du=$(awk -v s="$sha" '$1==s{sub("refs/tags/","",$2); sub(/\\^\\{\\}$/,"",$2); print $2}' &lt;&lt;&lt;"$bang" \\
           | grep -E '^v[0-9]+\\.[0-9]+\\.[0-9]+$' | sort -V | tail -1)
  printf '%-34s %-4s -&gt; %s # %s\\n' "$duong" "$the" "$sha" "&#36;{day_du:-?}"
done</code></pre>
<div class="out">actions/cache                      v4   -&gt; 0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
actions/checkout                   v4   -&gt; 11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
actions/download-artifact          v4   -&gt; d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4.3.0
actions/setup-java                 v4   -&gt; cf277c60eb25467037889841efdb72551f06f6c3 # v4.9.1
actions/setup-node                 v4   -&gt; 49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
actions/upload-artifact            v4   -&gt; ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
docker/build-push-action           v6   -&gt; 10e90e3645eae34f1e60eeb005ba3a3d33f178e8 # v6.19.2
docker/login-action                v3   -&gt; c94ce9fb468520275223c153574b00df6fe4bcc9 # v3.7.0
docker/setup-buildx-action         v3   -&gt; 8d2750c68a42422c14e847fe6c8ac0403b4cbd6f # v3.12.0

real	0m3.921s</div>
<p>The <code>^{}</code> line is the detail that trips people up. For an <em>annotated</em> tag, <code>git ls-remote</code> prints two lines: the SHA of the tag object, and, suffixed <code>^{}</code>, the SHA of the commit it points to. <code>uses:</code> needs the commit. The checkout result matches Lesson 4.2 exactly (<code>v4 → 11d5960a…</code>, v4.4.0), which is a useful check that the script reads the same thing the runner resolves.</p>

<h3>Keeping pinned SHAs fresh: Dependabot for github-actions</h3>
${slide('ga-12', 24, 'Dependabot keeps SHAs fresh — but skips every uses: ./')}
<pre><code class="language-yaml"># .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /              # doc: "/" means .github/workflows
    schedule:
      interval: weekly
    groups:
      actions:
        patterns: ["*"]       # one pull request per week, not nine</code></pre>
<p>What the docs (September 2026) say it does and does not do:</p>
<ul>
<li>It updates references to actions <strong>and to reusable workflows</strong> in other repositories, in both the <code>@tag</code> and the <code>@SHA</code> form — and it rewrites a version comment on the same line, so <code>@&lt;SHA&gt; # v4.4.0</code> stays truthful.</li>
<li>It <strong>ignores</strong> local references (<code>./.github/actions/x</code>, <code>./.github/workflows/y.yml</code>) and <code>docker://</code> images.</li>
<li>If the pinned SHA is not associated with any tag, it moves to the latest commit, which may not be the latest release.</li>
<li>The docs describe <code>directory: /</code> as reading <code>.github/workflows</code>. They do not say whether <code>uses:</code> lines inside your own composite actions under <code>.github/actions/</code> are covered; check the first pull request Dependabot opens, and if they are missing, add those folders.</li>
</ul>
<p>For an internal action the team publishes, that third point settles the release question from Lesson 12.3: tag every release <code>vX.Y.Z</code>, so the forty repositories that pin it by SHA receive pull requests per <em>release</em>, not per commit.</p>

<h3>The maintenance bill, counted</h3>
<p>Put numbers on the choices for a repository like api-backend. Pinned by hand, 24 references across 14 files is 24 edits every time you check for updates, and nobody does it — which is why all 24 are still floating tags. Pinned with Dependabot and grouping, it is one pull request a week to read and merge. Behind a reusable CI workflow and a composite "prepare" action, the same nine actions would appear in two files instead of fourteen, and the repositories calling them would each receive one pull request per release of the shared workflow. The work does not disappear; it moves to where it can be reviewed once.</p>

<div class="pitfall co-tieu-de"><strong>Trap — pinning without an update path.</strong> A team pins every action by SHA after reading about the tj-actions incident (Lesson 4.2), feels safe, and never adds Dependabot. A year later the pins are a year old, a security fix to one of those actions has been out for months, and the Node 20 deprecation warning (Lesson 12.3) is on every run. Pinning without an update path trades one risk for another. The two changes belong in the same pull request.</div>

<h3>Run it step by step: pin a repository in one sitting</h3>
<ol>
<li>Run the inventory: <code>grep -ho "uses: *[^ #]*" .github/workflows/*.yml | sort | uniq -c</code>.</li>
<li>Run <code>ghim-sha.sh</code> from the repository root; keep its output.</li>
<li>Replace each <code>owner/repo@vN</code> with <code>owner/repo@&lt;SHA&gt; # vX.Y.Z</code> from the output (a <code>sed</code> per line, or by hand).</li>
<li>Run actionlint. Push on a branch and open a pull request: every job must be green with the pinned versions before merging.</li>
<li>Add <code>.github/dependabot.yml</code> as above, in the same pull request.</li>
<li>After merging, wait for Dependabot&#39;s first scheduled check: if any pinned action is behind, it opens a pull request that changes both the SHA and the <code># vX.Y.Z</code> comment. Read that first pull request to see which files it covered.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Your organisation has 60 repositories with nearly identical CI. How do you standardise it?</strong><br>A: Put the pipeline in a reusable workflow (or a small set) in one repository, versioned with tags and called by SHA. Give new repositories a workflow template that only calls it. Enable Dependabot for <code>github-actions</code> everywhere so upgrades arrive as reviewable pull requests. Keep repository-specific steps in local composite actions or scripts.</p>
<p><strong>Q: What is the difference between a workflow template and a reusable workflow?</strong><br>A: A template is copied into a repository when a workflow is created, then drifts; editing it changes nothing that exists. A reusable workflow is called at run time, so a new version reaches every caller that updates its reference.</p>
<p><strong>Q: Can you avoid duplication inside one workflow file without new files?</strong><br>A: YAML anchors and aliases now work for identical blocks. The merge key <code>&lt;&lt;</code> is not supported, so variations need a matrix, an input, or a composite action.</p>
<p><strong>Q: You pin actions to SHAs. How do they stay up to date?</strong><br>A: Dependabot with <code>package-ecosystem: github-actions</code>; it updates the SHA and the version comment on the same line. It skips local <code>./</code> references and <code>docker://</code> images.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> make your repository&#39;s dependencies on other people&#39;s code explicit and self-updating.</p><ol>
<li>Run the inventory command and <code>ghim-sha.sh</code> on your repository; save both outputs.</li>
<li>Pin every <code>uses:</code> to a SHA with a version comment, on a branch.</li>
<li>Add <code>dependabot.yml</code> for <code>github-actions</code> with weekly grouping.</li>
<li>If two jobs in one file share an identical <code>env:</code> block, replace the second with an alias; run actionlint.</li>
</ol><p><strong>Done when:</strong> <code>grep -l "@v[0-9]" .github/workflows/*.yml</code> prints nothing; the pull request is green with pinned versions; <code>dependabot.yml</code> is merged; actionlint reports no errors on the anchored file.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">YAML anchor / alias</span><span class="v"><code>&amp;name</code> marks a block, <code>*name</code> repeats it; supported in workflows</span></div>
<div class="kv"><span class="k">merge key <code>&lt;&lt;</code></span><span class="v">"copy a map and override keys" — not supported by GitHub Actions</span></div>
<div class="kv"><span class="k">workflow template</span><span class="v">file in an organisation&#39;s <code>.github/workflow-templates/</code>, offered when creating a workflow</span></div>
<div class="kv"><span class="k"><code>.properties.json</code></span><span class="v">the template&#39;s metadata: name, description, icon, categories, file patterns</span></div>
<div class="kv"><span class="k">annotated tag <code>^{}</code></span><span class="v">in <code>git ls-remote</code>, the line giving the commit a tag object points to</span></div>
<div class="kv"><span class="k">Dependabot version updates</span><span class="v">scheduled pull requests that bump pinned versions, including action SHAs</span></div>
<div class="kv"><span class="k"><code>job_workflow_ref</code></span><span class="v">OIDC claim naming the reusable workflow a job came from; lets a cloud trust only that workflow</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Choose the smallest reuse mechanism that works: anchor → script → local composite → shared workflow/action → template.</li>
<li>Anchors and aliases work in workflows; the merge key <code>&lt;&lt;</code> does not, and GitHub reports the error at the anchor&#39;s definition.</li>
<li>Workflow templates are organisation-only starting points copied once; make them thin callers of a pinned reusable workflow.</li>
<li>api-backend today: 14 workflows, 24 <code>uses:</code>, none pinned; resolving all of them with plain <code>git ls-remote</code> took 3.9 seconds.</li>
<li>Dependabot keeps SHAs and their version comments current, skips local references, and needs tagged releases to propose releases rather than commits.</li>
<li>Pin and add an update path in the same change; one without the other only moves the risk.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflow configurations (templates, anchors)</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations — template visibility, <code>$default-branch</code>, metadata keys, and YAML anchors and aliases.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Create workflow templates</span><span class="lc-sub">docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates — the <code>workflow-templates</code> folder and the <code>.properties.json</code> file, step by step.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your actions up to date with Dependabot</span><span class="lc-sub">docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions — the <code>github-actions</code> ecosystem and its caveats.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using OpenID Connect with reusable workflows</span><span class="lc-sub">docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows — trusting only a specific reusable workflow through <code>job_workflow_ref</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — the linter that named the merge-key error on the right line (version 1.7.12 in this chapter).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git — tags, annotated tags, and what ls-remote prints</span><span class="lc-sub">/courses/git/learn${REF} — the <code>^{}</code> line explained from the Git side.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Mẫu cho tổ chức, và hoá đơn bảo trì</h2>
<p class="lead">Mọi cơ chế tái sử dụng trong chương này đều là một cuộc đổi chác: bạn bỏ được bản chép, và đổi lại bạn có thêm một thứ có phiên bản, có bên gọi và có bán kính nổ. Bài này nói về việc chọn cơ chế NHỎ NHẤT làm được việc, biết những công cụ cấp tổ chức tồn tại quanh chúng, và giữ những thứ bạn phụ thuộc luôn mới mà không phải làm bằng tay.</p>

<h3>Năm cỡ tái sử dụng</h3>
${slide('ga-12', 20, 'Năm cỡ tái sử dụng — chọn cỡ NHỎ NHẤT đủ dùng')}
<table>
<thead><tr><th>Cỡ</th><th>Phạm vi</th><th>Đánh phiên bản thế nào</th><th>Khi nào</th></tr></thead>
<tbody>
<tr><td>YAML anchor <code>&amp;ten</code> / <code>*ten</code></td><td>trong một tệp</td><td>theo tệp</td><td>hai job trong một workflow dùng chung env hay steps</td></tr>
<tr><td>Script trong kho</td><td>một kho</td><td>theo từng commit</td><td>logic chủ yếu là shell và cần test được trên máy</td></tr>
<tr><td>Composite action cục bộ</td><td>một kho</td><td>theo từng commit</td><td>cùng các bước ở ba workflow trở lên</td></tr>
<tr><td>Reusable workflow / action ở kho riêng</td><td>nhiều kho</td><td>ghim SHA, Dependabot</td><td>nhiều đội, một pipeline hay một công cụ</td></tr>
<tr><td>Workflow template (tổ chức)</td><td>điểm xuất phát cho kho <em>mới</em></td><td>chép một lần rồi trôi</td><td>chuẩn khởi đầu, không phải chuẩn được duy trì</td></tr>
</tbody>
</table>
<p>Mỗi lần đi xuống một dòng trong bảng lại tốn hơn: thêm một kho phải sở hữu, một quy trình phát hành, những bên gọi bạn không nhìn thấy. Bài 4.5 đã đo cái giá của việc ở lại dòng trên cùng quá lâu (chín bản chép một khối SSH đã trôi thành hai phiên bản). Sai theo chiều ngược lại cũng phổ biến y như vậy: một action dùng chung có mười input, dựng từ hai bản chép chỉ TRÔNG giống nhau.</p>

<h3>YAML anchor: cỡ nhỏ nhất, đã đo</h3>
${slide('ga-12', 21, 'YAML anchor: & và * chạy được, merge key << thì không')}
<p>GitHub Actions nay nhận YAML anchor và alias (docs mô tả chúng trong trang tham khảo về tái sử dụng workflow). Workflow <code>ch12-neo.yml</code> trên sân tập định nghĩa môi trường và các bước một lần trong <code>lint</code> rồi dùng lại cả hai trong <code>test</code>:</p>
<pre><code class="language-yaml">jobs:
  lint:
    runs-on: ubuntu-24.04
    env: &amp;env-chung
      NODE_ENV: test
      TZ: Asia/Ho_Chi_Minh
    steps: &amp;buoc-chung
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - name: In moi truong
        run: echo "job=&#36;{{ github.job }} NODE_ENV=$NODE_ENV TZ=$TZ"
  test:
    runs-on: ubuntu-24.04
    env: *env-chung
    steps: *buoc-chung</code></pre>
<p>Run ${RUN(36029548603)} xanh, cả hai job in ra môi trường dùng chung. Tính năng mà phần lớn mọi người với tới tiếp theo là merge key, "chép cái map này, rồi ghi đè một khoá":</p>
<pre><code class="language-yaml">  bien-the:
    env:
      &lt;&lt;: *env-goc
      NODE_ENV: production</code></pre>
<p>Tệp đó chưa bao giờ chạy. Run ${RUN(36029546312)} hỏng trước cả khi tạo được job nào — đến tên của run cũng rơi về đường dẫn tệp, vì GitHub không đọc nổi <code>name:</code> — với:</p>
<div class="out">Invalid workflow file: .github/workflows/ch12-neo-gop.yml#L1
(Line: 13, Col: 10): A mapping was not expected</div>
<p>Dòng 13, cột 10 là nơi <code>&amp;env-goc</code> được ĐỊNH NGHĨA, không phải dòng <code>&lt;&lt;:</code> ở dòng 21 gây ra chuyện. actionlint, chạy trên cùng tệp đó trước khi push, chỉ đúng chỗ:</p>
<div class="out">.github/workflows/ch12-neo-gop.yml:21:7: GitHub Actions does not support YAML merge key "&lt;&lt;" [syntax-check]</div>
<p>Hai bài học trong một. Anchor ổn cho sự lặp lại Y HỆT trong một tệp, nhưng không có "chép rồi đổi một khoá", nên mỗi biến thể vẫn cần một khối đầy đủ của riêng nó. Và khi trình đọc của GitHub với một linter nói khác nhau về chỗ lỗi, hãy tin cái gọi đúng tên cấu trúc gây lỗi.</p>

<div class="callout">
<p><strong>Khi nào anchor là công cụ sai.</strong> Anchor là một sự ràng buộc vô hình: ai sửa các bước của job <code>lint</code> cũng đồng thời sửa <code>test</code>, và diff không cho thấy điều đó. Dùng chúng cho dữ liệu PHẢI giống hệt nhau (một khối env, một danh sách đường dẫn), không dùng cho các bước sẽ tách nhau vào tháng sau. Ngay khi bạn muốn tới <code>&lt;&lt;:</code>, thứ bạn thật sự cần là một input — composite action hoặc ma trận.</p>
</div>

<h3>Workflow template: điểm xuất phát của tổ chức</h3>
${slide('ga-12', 22, 'Workflow template sống trong kho .github của TỔ CHỨC')}
<p>Một tổ chức có thể công bố workflow template: các tệp trong thư mục <code>workflow-templates/</code> của kho <code>.github</code> của nó, mỗi tệp đi kèm một tệp metadata cùng tên đuôi <code>.properties.json</code>. Khi ai đó trong tổ chức tạo workflow mới, các template hiện ra để chọn. Theo docs (09/2026):</p>
<ul>
<li>Các khoá metadata là <code>name</code> và <code>description</code> (bắt buộc), cùng <code>iconName</code>, <code>categories</code> và <code>filePatterns</code> (tuỳ chọn). <code>filePatterns</code> gợi ý template khi kho có một tệp ở thư mục gốc khớp mẫu, ví dụ <code>package.json$</code>.</li>
<li>Bên trong template, <code>$default-branch</code> được thay bằng nhánh mặc định của kho lúc tạo.</li>
<li>Phạm vi hiển thị đi theo kho <code>.github</code>: kho public phục vụ mọi loại kho, kho internal chỉ phục vụ kho internal và private, kho private chỉ phục vụ kho private (và còn cần cấp quyền đọc).</li>
</ul>
<p>Phần này KHÔNG chạy thử được trên sân tập của khoá: template chỉ có ở tổ chức, còn sân tập thuộc một tài khoản cá nhân. Mọi điều ở trên lấy từ docs, và nên được đọc như vậy. Điều docs nói rõ là tính chất quan trọng nhất với một đội: template là một <strong>bản chép làm một lần</strong>. Sửa template không sửa kho nào đang có. Khuôn mẫu chạy được là một template vài dòng mà việc duy nhất của nó là gọi một reusable workflow ghim SHA — template lan truyền lời gọi, reusable workflow mang logic, còn Dependabot mang việc nâng cấp.</p>

<h3>Những quy ước giữ một thư viện dùng chung dễ đọc</h3>
<ul>
<li><strong>Reusable workflow phải nằm thẳng trong <code>.github/workflows/</code></strong> — docs nói rõ thư mục con không được hỗ trợ. Đặt tên sao cho không ai nhầm chúng là điểm vào, ví dụ tiền tố <code>reusable-</code>, và không cho chúng trigger <code>push</code>/<code>pull_request</code>.</li>
<li><strong>Composite action đặt ở <code>.github/actions/&lt;động-từ-danh-từ&gt;/action.yml</code></strong>, mỗi cái một thư mục, script nó gọi nằm cạnh <code>action.yml</code> (với tới qua <code>$GITHUB_ACTION_PATH</code>, Bài 12.2).</li>
<li><strong>Kho action dùng chung có một action ở gốc</strong> nếu có ngày sẽ lên Marketplace (Bài 12.3); một bộ sưu tập nội bộ thì dùng thư mục con được.</li>
<li><strong>Mọi giao diện được tài liệu hoá ngay trong tệp</strong>: một <code>description</code> cho mỗi input, output và secret. Đó là thứ tài liệu duy nhất không thể trôi lệch khỏi mã.</li>
<li><strong>Giới hạn ai được tin.</strong> Với deploy, docs mô tả cách dùng claim OIDC <code>job_workflow_ref</code> để một tài khoản cloud chỉ nhận token từ MỘT reusable workflow cụ thể — "chỉ workflow deploy đã duyệt mới được deploy". Phần này chưa chạy thử trên sân tập; nó là phiên bản cỡ tổ chức của Bài 6.3.</li>
</ul>

<h3>Đo thật: hôm nay api-backend phụ thuộc vào những gì</h3>
${slide('ga-12', 23, 'api-backend: 24 lượt uses:, 0 ghim SHA — tra hết SHA mất 4 giây')}
<p>Kho đứng sau chính trang này, ở <code>origin/main</code> commit <code>da88704e</code> (24/09/2026), có 14 workflow và 24 dòng <code>uses:</code>: 8 × <code>actions/checkout@v4</code>, 7 × <code>actions/setup-node@v4</code>, 2 × <code>docker/build-push-action@v6</code>, 2 × <code>actions/cache@v4</code>, và mỗi thứ một lần cho năm action khác. Không dòng nào ghim bằng SHA. Không có <code>workflow_call</code>, không có thư mục <code>.github/actions/</code>, không có <code>dependabot.yml</code>. Bài 4.2 đếm được 21 dòng ở một commit trước đó; con số chỉ có tăng khi không có gì gom nó lại.</p>
<p>Ghim cần một dữ kiện cho mỗi action: thẻ đang trỏ vào commit nào ngay lúc này, và đó là phiên bản đầy đủ nào? API GitHub trả lời được, mà git trơn cũng trả lời được — không cần <code>gh</code>, không cần token:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# ghim-sha.sh — moi owner/repo@the trong .github/workflows: SHA 40 ky tu + the phien ban DAY DU cung commit.
set -euo pipefail
grep -ho 'uses: *[^ #]*' .github/workflows/*.y*ml | sed 's/uses: *//' \\
  | grep -v '^\\./' | grep -v '^docker://' | sort -u |
while IFS=@ read -r duong the; do
  repo=$(cut -d/ -f1-2 &lt;&lt;&lt;"$duong")
  bang=$(git ls-remote --tags "https://github.com/$repo")
  sha=$(awk -v t="refs/tags/$the^{}" '$2==t{print $1}' &lt;&lt;&lt;"$bang")      # the annotated: lay commit
  [ -z "$sha" ] &amp;&amp; sha=$(awk -v t="refs/tags/$the" '$2==t{print $1}' &lt;&lt;&lt;"$bang")
  day_du=$(awk -v s="$sha" '$1==s{sub("refs/tags/","",$2); sub(/\\^\\{\\}$/,"",$2); print $2}' &lt;&lt;&lt;"$bang" \\
           | grep -E '^v[0-9]+\\.[0-9]+\\.[0-9]+$' | sort -V | tail -1)
  printf '%-34s %-4s -&gt; %s # %s\\n' "$duong" "$the" "$sha" "&#36;{day_du:-?}"
done</code></pre>
<div class="out">actions/cache                      v4   -&gt; 0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
actions/checkout                   v4   -&gt; 11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
actions/download-artifact          v4   -&gt; d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4.3.0
actions/setup-java                 v4   -&gt; cf277c60eb25467037889841efdb72551f06f6c3 # v4.9.1
actions/setup-node                 v4   -&gt; 49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
actions/upload-artifact            v4   -&gt; ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
docker/build-push-action           v6   -&gt; 10e90e3645eae34f1e60eeb005ba3a3d33f178e8 # v6.19.2
docker/login-action                v3   -&gt; c94ce9fb468520275223c153574b00df6fe4bcc9 # v3.7.0
docker/setup-buildx-action         v3   -&gt; 8d2750c68a42422c14e847fe6c8ac0403b4cbd6f # v3.12.0

real	0m3.921s</div>
<p>Dòng <code>^{}</code> là chi tiết hay làm người ta vấp. Với một thẻ <em>annotated</em>, <code>git ls-remote</code> in hai dòng: SHA của đối tượng thẻ, và — có hậu tố <code>^{}</code> — SHA của commit mà nó trỏ tới. <code>uses:</code> cần commit. Kết quả của checkout khớp Bài 4.2 tới từng ký tự (<code>v4 → 11d5960a…</code>, v4.4.0) — một phép kiểm hữu ích rằng script đọc đúng thứ mà runner giải ra.</p>

<h3>Giữ SHA luôn mới: Dependabot cho github-actions</h3>
${slide('ga-12', 24, 'Dependabot giữ SHA tươi — nhưng bỏ qua mọi uses: ./')}
<pre><code class="language-yaml"># .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /              # docs: "/" nghia la .github/workflows
    schedule:
      interval: weekly
    groups:
      actions:
        patterns: ["*"]       # mot pull request moi tuan, khong phai chin cai</code></pre>
<p>Docs (09/2026) nói nó làm gì và không làm gì:</p>
<ul>
<li>Nó cập nhật tham chiếu tới action <strong>và tới reusable workflow</strong> ở kho khác, cả dạng <code>@thẻ</code> lẫn dạng <code>@SHA</code> — và nó viết lại chú thích phiên bản nằm cùng dòng, nên <code>@&lt;SHA&gt; # v4.4.0</code> vẫn nói thật.</li>
<li>Nó <strong>bỏ qua</strong> tham chiếu cục bộ (<code>./.github/actions/x</code>, <code>./.github/workflows/y.yml</code>) và ảnh <code>docker://</code>.</li>
<li>Nếu SHA đang ghim không gắn với thẻ nào, nó đưa lên commit mới nhất — có thể không phải bản phát hành mới nhất.</li>
<li>Docs mô tả <code>directory: /</code> là đọc <code>.github/workflows</code>. Docs không nói các dòng <code>uses:</code> bên trong composite action của chính bạn dưới <code>.github/actions/</code> có được tính hay không; hãy kiểm pull request đầu tiên mà Dependabot mở, thiếu thì thêm các thư mục đó.</li>
</ul>
<p>Với một action nội bộ đội tự phát hành, điểm thứ ba khép lại câu hỏi phát hành ở Bài 12.3: gắn thẻ <code>vX.Y.Z</code> cho mỗi bản, để bốn mươi kho ghim nó bằng SHA nhận pull request theo từng <em>bản phát hành</em>, không phải theo từng commit.</p>

<h3>Hoá đơn bảo trì, đếm ra số</h3>
<p>Đặt con số lên các lựa chọn cho một kho như api-backend. Ghim bằng tay, 24 tham chiếu trong 14 tệp là 24 chỗ sửa mỗi lần kiểm cập nhật, và không ai làm — đó là lý do cả 24 vẫn là thẻ di động. Ghim cùng Dependabot có gộp nhóm, đó là một pull request mỗi tuần để đọc và merge. Đặt sau một reusable workflow CI và một composite action "chuẩn bị", chín action ấy sẽ xuất hiện ở hai tệp thay vì mười bốn, và các kho gọi chúng mỗi kho nhận một pull request cho mỗi bản phát hành của workflow dùng chung. Công việc không biến mất; nó dời về chỗ mà nó được xem xét một lần.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — ghim mà không có đường cập nhật.</strong> Một đội đọc vụ tj-actions (Bài 4.2) xong liền ghim mọi action bằng SHA, thấy yên tâm, và không bao giờ thêm Dependabot. Một năm sau các chỗ ghim đã cũ một năm, một bản vá bảo mật cho một trong số action đó đã ra từ mấy tháng, và cảnh báo Node 20 bị ngừng (Bài 12.3) hiện trên mọi run. Ghim mà không có đường cập nhật là đổi rủi ro này lấy rủi ro khác. Hai thay đổi đó thuộc về cùng một pull request.</div>

<h3>Chạy thử từng bước: ghim cả kho trong một lần ngồi</h3>
<ol>
<li>Kiểm kê: <code>grep -ho "uses: *[^ #]*" .github/workflows/*.yml | sort | uniq -c</code>.</li>
<li>Chạy <code>ghim-sha.sh</code> ở gốc kho; giữ lại output.</li>
<li>Thay mỗi <code>owner/repo@vN</code> bằng <code>owner/repo@&lt;SHA&gt; # vX.Y.Z</code> theo output (mỗi dòng một lệnh <code>sed</code>, hoặc sửa tay).</li>
<li>Chạy actionlint. Push lên một nhánh và mở pull request: mọi job phải xanh với các phiên bản đã ghim rồi mới merge.</li>
<li>Thêm <code>.github/dependabot.yml</code> như trên, trong CÙNG pull request.</li>
<li>Sau khi merge, chờ lượt kiểm theo lịch đầu tiên của Dependabot: nếu có action đang ghim bị cũ, nó mở một pull request đổi cả SHA lẫn chú thích <code># vX.Y.Z</code>. Đọc pull request đầu tiên đó để thấy nó đã quét những tệp nào.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Tổ chức của bạn có 60 kho với CI gần như giống nhau. Bạn chuẩn hoá thế nào?</strong><br>Đ: Đặt pipeline vào một reusable workflow (hoặc một bộ nhỏ) ở một kho, đánh phiên bản bằng thẻ và được gọi bằng SHA. Cho kho mới một workflow template chỉ làm mỗi việc gọi nó. Bật Dependabot cho <code>github-actions</code> ở mọi nơi để việc nâng cấp tới dưới dạng pull request xem xét được. Các bước riêng của từng kho thì để trong composite action cục bộ hoặc script.</p>
<p><strong>H: Workflow template khác reusable workflow thế nào?</strong><br>Đ: Template được chép vào kho lúc tạo workflow rồi trôi dần; sửa nó không đổi gì ở những nơi đã có. Reusable workflow được gọi lúc chạy, nên một phiên bản mới tới được mọi bên gọi cập nhật tham chiếu.</p>
<p><strong>H: Có tránh được lặp trong một tệp workflow mà không thêm tệp mới không?</strong><br>Đ: YAML anchor và alias nay chạy được cho các khối giống hệt nhau. Merge key <code>&lt;&lt;</code> không được hỗ trợ, nên biến thể thì cần ma trận, input, hoặc composite action.</p>
<p><strong>H: Bạn ghim action bằng SHA. Làm sao chúng luôn mới?</strong><br>Đ: Dependabot với <code>package-ecosystem: github-actions</code>; nó cập nhật SHA và chú thích phiên bản cùng dòng. Nó bỏ qua tham chiếu cục bộ <code>./</code> và ảnh <code>docker://</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> làm cho sự phụ thuộc của kho bạn vào mã người khác trở nên tường minh và tự cập nhật.</p><ol>
<li>Chạy lệnh kiểm kê và <code>ghim-sha.sh</code> trên kho của bạn; lưu cả hai output.</li>
<li>Ghim mọi <code>uses:</code> sang SHA kèm chú thích phiên bản, trên một nhánh.</li>
<li>Thêm <code>dependabot.yml</code> cho <code>github-actions</code>, gộp nhóm hằng tuần.</li>
<li>Nếu hai job trong một tệp có khối <code>env:</code> giống hệt nhau, thay khối thứ hai bằng một alias; chạy actionlint.</li>
</ol><p><strong>Đạt khi:</strong> <code>grep -l "@v[0-9]" .github/workflows/*.yml</code> không in tệp nào; pull request xanh với các phiên bản đã ghim; <code>dependabot.yml</code> đã merge; actionlint không báo lỗi trên tệp có anchor.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">YAML anchor / alias</span><span class="v"><code>&amp;ten</code> đánh dấu một khối, <code>*ten</code> lặp lại nó; workflow hỗ trợ</span></div>
<div class="kv"><span class="k">merge key <code>&lt;&lt;</code></span><span class="v">"chép một map rồi ghi đè vài khoá" — GitHub Actions không hỗ trợ</span></div>
<div class="kv"><span class="k">workflow template</span><span class="v">tệp trong <code>.github/workflow-templates/</code> của tổ chức, được gợi ý khi tạo workflow</span></div>
<div class="kv"><span class="k"><code>.properties.json</code></span><span class="v">metadata của template: tên, mô tả, biểu tượng, danh mục, mẫu tệp</span></div>
<div class="kv"><span class="k">thẻ annotated <code>^{}</code></span><span class="v">trong <code>git ls-remote</code>, dòng cho biết commit mà đối tượng thẻ trỏ tới</span></div>
<div class="kv"><span class="k">Dependabot version updates</span><span class="v">pull request định kỳ nâng các phiên bản đã ghim, kể cả SHA của action</span></div>
<div class="kv"><span class="k"><code>job_workflow_ref</code></span><span class="v">claim OIDC ghi tên reusable workflow sinh ra job; cho phép cloud chỉ tin đúng workflow đó</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn cơ chế tái sử dụng nhỏ nhất làm được việc: anchor → script → composite cục bộ → workflow/action dùng chung → template.</li>
<li>Anchor và alias chạy trong workflow; merge key <code>&lt;&lt;</code> thì không, và GitHub báo lỗi ở chỗ định nghĩa anchor.</li>
<li>Workflow template là điểm xuất phát chỉ-có-ở-tổ-chức, chép một lần; hãy làm chúng thành lớp gọi mỏng tới một reusable workflow ghim SHA.</li>
<li>api-backend hôm nay: 14 workflow, 24 <code>uses:</code>, không cái nào ghim; tra hết bằng <code>git ls-remote</code> trơn mất 3,9 giây.</li>
<li>Dependabot giữ SHA và chú thích phiên bản luôn mới, bỏ qua tham chiếu cục bộ, và cần bản phát hành có thẻ để đề xuất theo bản phát hành chứ không theo commit.</li>
<li>Ghim và thêm đường cập nhật trong cùng một thay đổi; thiếu một trong hai chỉ là dời rủi ro đi chỗ khác.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflow configurations (template, anchor)</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations — phạm vi của template, <code>$default-branch</code>, các khoá metadata, và YAML anchor/alias.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Create workflow templates</span><span class="lc-sub">docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates — thư mục <code>workflow-templates</code> và tệp <code>.properties.json</code>, từng bước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your actions up to date with Dependabot</span><span class="lc-sub">docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions — hệ <code>github-actions</code> và các lưu ý của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using OpenID Connect with reusable workflows</span><span class="lc-sub">docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows — chỉ tin một reusable workflow cụ thể qua <code>job_workflow_ref</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — linter đã gọi đúng dòng của lỗi merge key (bản 1.7.12 trong chương này).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git — thẻ, thẻ annotated, và ls-remote in ra gì</span><span class="lc-sub">/courses/git/learn${REF} — dòng <code>^{}</code> giải thích từ phía Git.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — Chapter 12 quiz|||12.5 — Kiểm tra Chương 12',
      slug: 'ga-12-5-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 12 đã chạy thật: output của ma trận, secret required và inherit, trần quyền, input chuỗi trong composite, lỗi nạp action, dist/ của action JavaScript, con trỏ di động, merge key, và Dependabot.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>What Chapter 12 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Every answer comes from a run in the sandbox, not from a summary of the docs — and two of them are cases where a reasonable reading of the docs, or of a tutorial, predicts the wrong thing. If you are unsure, the run is linked in the lesson.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a reusable workflow with typed inputs, a secret and an output, and wire the output through all four layers to the caller.</li>
<li>I can predict the output of a matrix call, and what <code>required: true</code> and <code>secrets: inherit</code> really do.</li>
<li>I can explain the permission ceiling, the concurrency deadlock, and why actionlint catches neither.</li>
<li>I can write a composite action with <code>if</code>, <code>continue-on-error</code> and a nested action, and test a string input correctly.</li>
<li>I can build a JavaScript action with ncc, keep <code>dist/</code> honest with a check job, and say which Node it runs on.</li>
<li>I can pin a repository&#39;s actions by SHA, keep them fresh with Dependabot, and choose the smallest reuse mechanism for a job.</li>
</ul>
${slide('ga-12', 26, 'Chapter 12 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Chương 12 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Đáp án nào cũng lấy từ một run trên sân tập, không phải tóm tắt docs — và có hai câu là trường hợp mà một cách đọc hợp lý của docs, hay của một bài hướng dẫn, sẽ đoán sai. Nếu không chắc, run đã được dẫn trong bài.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một reusable workflow có input có kiểu, một secret và một output, và nối output qua đủ bốn tầng về tới bên gọi.</li>
<li>Tôi đoán đúng output của một lời gọi bằng ma trận, và biết <code>required: true</code> với <code>secrets: inherit</code> thật sự làm gì.</li>
<li>Tôi giải thích được trần quyền, cú deadlock concurrency, và vì sao actionlint không bắt cái nào.</li>
<li>Tôi viết được composite action có <code>if</code>, <code>continue-on-error</code> và một action lồng, và kiểm đúng cách một input chuỗi.</li>
<li>Tôi dựng được action JavaScript bằng ncc, giữ <code>dist/</code> trung thực bằng một job kiểm, và nói được nó chạy trên Node nào.</li>
<li>Tôi ghim được action của một kho bằng SHA, giữ chúng luôn mới bằng Dependabot, và chọn được cơ chế tái sử dụng nhỏ nhất cho một việc.</li>
</ul>
${slide('ga-12', 26, 'Bảng tra nhanh Chương 12')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A job calls a reusable workflow with a matrix: dev (finishes after 1 s), stage (25 s), prod (8 s), listed in that order. Each run sets the output moi-truong to its own name. What does needs.[job].outputs.moi-truong contain?|||Một job gọi reusable workflow bằng ma trận: dev (xong sau 1 giây), stage (25 giây), prod (8 giây), liệt kê theo đúng thứ tự đó. Mỗi lần chạy đặt output moi-truong bằng tên của chính nó. needs.[job].outputs.moi-truong chứa gì?',
            options: [
              'prod — the output of the last entry in the matrix list|||prod — output của phần tử cuối trong danh sách ma trận',
              'stage — the output of the run that finished last|||stage — output của lần chạy xong sau cùng',
              'dev,stage,prod — all three values joined with commas|||dev,stage,prod — cả ba giá trị nối bằng dấu phẩy',
              'An empty string — matrix calls cannot return outputs|||Chuỗi rỗng — gọi bằng ma trận thì không trả output được',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The docs say the output is the one set by the last successfully completing run of the matrix that actually sets a value, and run 36029548881 confirmed it: stage finished at 16:45:47, after prod at 16:45:30, and the caller read stage. “Last in the list” is the tempting answer because the matrix is written in order, but the rule is about finishing time. Outputs are not merged; to keep all three, use artifacts or a summary job.|||VI: Docs nói output là giá trị của lần chạy hoàn thành thành công sau cùng có đặt giá trị, và run 36029548881 xác nhận: stage xong lúc 16:45:47, sau prod lúc 16:45:30, và bên gọi đọc ra stage. “Cuối danh sách” là đáp án hấp dẫn vì ma trận được viết theo thứ tự, nhưng luật tính theo thời điểm XONG. Output không được gộp; muốn giữ cả ba thì dùng artifact hoặc một job tổng hợp.',
          },
          {
            question: 'A reusable workflow declares secrets: { ma-thu: { required: true } }. The caller writes secrets: { ma-thu: ${{ secrets.CH06_GIA }} }, but the repository has no secret called CH06_GIA. What happens?|||Một reusable workflow khai secrets: { ma-thu: { required: true } }. Bên gọi viết secrets: { ma-thu: ${{ secrets.CH06_GIA }} }, nhưng kho không có secret nào tên CH06_GIA. Chuyện gì xảy ra?',
            options: [
              'The run fails at startup with “required secret ma-thu not provided”|||Run hỏng lúc khởi động với “required secret ma-thu not provided”',
              'The called job fails at its first step, before any command runs|||Job được gọi hỏng ở bước đầu tiên, trước khi lệnh nào chạy',
              'The run is green; inside, the secret is simply an empty string|||Run xanh; bên trong, secret đơn giản là một chuỗi rỗng',
              'GitHub pauses the run and asks an admin to create the secret|||GitHub tạm dừng run và yêu cầu admin tạo secret',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: required: true only checks that the caller writes the key under secrets:. The value behind it is not checked. Run 36029548881 showed env MA: (empty), length 0, and a green job. The startup-failure option is tempting because that is what happens for a missing required input, but secrets are resolved without that check. If a secret must exist, test it yourself with test -n in the first step.|||VI: required: true chỉ kiểm bên gọi CÓ VIẾT khoá dưới secrets:. Giá trị đằng sau không được kiểm. Run 36029548881 cho thấy env MA: (rỗng), độ dài 0, và job xanh. Phương án startup failure hấp dẫn vì đó là chuyện xảy ra khi thiếu một input bắt buộc, nhưng secret được giải mà không có phép kiểm đó. Secret nào bắt buộc phải có thì tự kiểm bằng test -n ở bước đầu.',
          },
          {
            question: 'Workflow B received two secrets, mot and hai. B calls workflow C with secrets: inherit. C declares only mot under on.workflow_call.secrets. Which secret names appear in C’s secrets context?|||Workflow B nhận hai secret, mot và hai. B gọi workflow C với secrets: inherit. C chỉ khai mot dưới on.workflow_call.secrets. Những tên secret nào xuất hiện trong context secrets của C?',
            options: [
              'github_token, hai and mot — inherit passes everything B has|||github_token, hai và mot — inherit đưa mọi thứ B có',
              'github_token and mot — inherit is filtered by what C declares|||github_token và mot — inherit được lọc theo những gì C khai',
              'Only github_token — inherit only works from the top-level caller|||Chỉ github_token — inherit chỉ chạy được từ bên gọi trên cùng',
              'The run fails, because C receives a secret it did not declare|||Run hỏng, vì C nhận một secret mà nó không khai',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Run 36029944118 printed ["github_token","hai","mot"] for the inherit call and ["github_token","mot"] for the explicit one. Inherit means “everything I have”, not “everything you asked for”, and it is not filtered by C’s declarations. The filtered answer is tempting because that is how explicit passing behaves. This is why explicit lists are safer across teams.|||VI: Run 36029944118 in ra ["github_token","hai","mot"] cho lời gọi inherit và ["github_token","mot"] cho lời gọi tường minh. Inherit nghĩa là “mọi thứ tôi có”, không phải “mọi thứ anh xin”, và nó không bị lọc theo phần C khai. Đáp án “được lọc” hấp dẫn vì đó là cách truyền tường minh hoạt động. Đây là lý do danh sách tường minh an toàn hơn khi làm giữa nhiều đội.',
          },
          {
            question: 'The caller sets permissions: contents: read. A job inside the called workflow declares permissions: contents: write because it needs to push a tag. What do you see?|||Bên gọi đặt permissions: contents: read. Một job bên trong workflow được gọi khai permissions: contents: write vì nó cần đẩy một thẻ. Bạn thấy gì?',
            options: [
              'The job runs with contents: write, because the job-level setting wins|||Job chạy với contents: write, vì thiết lập ở mức job thắng',
              'The job runs with contents: read, and the push fails later with 403|||Job chạy với contents: read, và lệnh push hỏng về sau với 403',
              'actionlint reports the conflict before you push|||actionlint báo xung đột trước khi bạn push',
              'The run ends in startup_failure: the nested job may only have contents: read|||Run kết thúc bằng startup_failure: job lồng chỉ được phép contents: read',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Permissions can only be kept or lowered down a chain. Run 36029549264 failed before any job with “The nested job ’nang’ is requesting ’contents: write’, but is only allowed ’contents: read’.” Silently downgrading and failing later with 403 is the tempting answer — that is how a normal job with too few permissions fails — but here GitHub refuses the whole workflow. actionlint 1.7.12 did not flag it: the conflict only exists when the files are combined.|||VI: Quyền chỉ được giữ nguyên hoặc hạ xuống dọc theo chuỗi. Run 36029549264 hỏng trước khi có job nào với “The nested job ’nang’ is requesting ’contents: write’, but is only allowed ’contents: read’.” Âm thầm hạ quyền rồi hỏng 403 về sau là đáp án hấp dẫn — đó là cách một job thường thiếu quyền hỏng — nhưng ở đây GitHub từ chối cả workflow. actionlint 1.7.12 không báo: xung đột chỉ tồn tại khi các tệp được ghép lại.',
          },
          {
            question: 'A composite action has a step with if: inputs.dry-run. A caller passes dry-run: false. Does the step run?|||Một composite action có một bước với if: inputs.dry-run. Bên gọi truyền dry-run: false. Bước đó có chạy không?',
            options: [
              'No — false is a boolean, so the condition is false|||Không — false là boolean, nên điều kiện sai',
              'Yes — action inputs are strings, and the string ’false’ is truthy|||Có — input của action là chuỗi, và chuỗi ’false’ là truthy',
              'No — composite steps ignore if: entirely|||Không — bước composite bỏ qua if: hoàn toàn',
              'It fails with a type error, because if: expects a boolean|||Nó hỏng với lỗi kiểu, vì if: đòi một boolean',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Every action input arrives as a string. Run 36031782920 measured it: if: inputs.co ran for co=’false’. The boolean answer is tempting because reusable-workflow inputs do have types, but action inputs do not. Comparing with == true is also wrong — it did not run even for ’true’. Use == ’true’ or fromJSON(inputs.x).|||VI: Mọi input của action tới nơi đều là chuỗi. Run 36031782920 đã đo: if: inputs.co chạy với co=’false’. Đáp án boolean hấp dẫn vì input của reusable workflow có kiểu, nhưng input của action thì không. So với == true cũng sai — nó không chạy kể cả với ’true’. Dùng == ’true’ hoặc fromJSON(inputs.x).',
          },
          {
            question: 'You delete a shell: line from a step in a local composite action and push. The workflow checks out, installs dependencies for 3 minutes, then calls the action. When is the mistake reported?|||Bạn xoá một dòng shell: khỏi một bước trong composite action cục bộ rồi push. Workflow checkout, cài phụ thuộc mất 3 phút, rồi gọi action. Lỗi được báo lúc nào?',
            options: [
              'By actionlint, if it runs on the workflows before the push|||Bởi actionlint, nếu nó chạy trên các workflow trước khi push',
              'In Set up job, before the first step starts|||Ở Set up job, trước khi bước đầu tiên bắt đầu',
              'Never — a missing shell defaults to bash|||Không bao giờ — thiếu shell thì mặc định là bash',
              'When the action’s step is reached, after the 3-minute install|||Khi tới lượt bước của action, sau 3 phút cài đặt',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A local action is only read from disk when its step runs, so the error “Required property is missing: shell” (run 36029548521) arrives after everything before it has run. actionlint is the tempting answer, but in this chapter it said nothing about a broken local action.yml. Set up job only downloads remote actions. A workflow that tests the action on every pull request touching .github/actions/** catches it early.|||VI: Action cục bộ chỉ được đọc từ đĩa khi bước của nó chạy, nên lỗi “Required property is missing: shell” (run 36029548521) tới sau khi mọi thứ đứng trước đã chạy xong. actionlint là đáp án hấp dẫn, nhưng trong chương này nó không nói gì về một action.yml cục bộ bị hỏng. Set up job chỉ tải action từ xa. Một workflow test action ở mọi pull request đụng tới .github/actions/** sẽ bắt được sớm.',
          },
          {
            question: 'Why does a JavaScript action commit a bundled dist/index.js instead of listing its dependencies in package.json?|||Vì sao một action JavaScript commit tệp dist/index.js đã đóng gói thay vì chỉ liệt kê phụ thuộc trong package.json?',
            options: [
              'The runner executes runs.main directly and never installs the action’s dependencies|||Runner chạy thẳng runs.main và không bao giờ cài phụ thuộc của action',
              'The Marketplace rejects actions that have a package.json|||Marketplace từ chối các action có package.json',
              'Bundling is required for the action to run on Windows and macOS|||Đóng gói là bắt buộc để action chạy được trên Windows và macOS',
              'npm is not installed on GitHub-hosted runners|||Runner của GitHub không cài npm',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The runner runs the file in runs.main as is. Without bundling, run 36029943388 failed with ERR_MODULE_NOT_FOUND for @actions/core. npm is installed on hosted runners — the kiem-dist job used npm ci — it is just not run for actions. Bundling is not about operating systems, and the Marketplace has no rule against package.json. Add a check-dist job so dist/ cannot drift from src/.|||VI: Runner chạy tệp trong runs.main nguyên như vậy. Không đóng gói thì run 36029943388 hỏng với ERR_MODULE_NOT_FOUND cho @actions/core. Runner của GitHub có npm — job kiem-dist dùng npm ci — chỉ là nó không được chạy cho action. Đóng gói không liên quan tới hệ điều hành, và Marketplace không có luật nào cấm package.json. Thêm một job kiểm dist để dist/ không trôi lệch khỏi src/.',
          },
          {
            question: 'Forty repositories use your internal action as @v1. You move v1 to a new commit. What changes in those repositories’ next runs, and what would have prevented surprises?|||Bốn mươi kho dùng action nội bộ của bạn dạng @v1. Bạn dời v1 sang một commit mới. Lần chạy kế tiếp ở các kho đó thay đổi gì, và điều gì đã ngăn được bất ngờ?',
            options: [
              'Nothing changes until each repository edits its workflow file|||Không gì thay đổi cho tới khi từng kho sửa tệp workflow của nó',
              'Only repositories that re-run old runs see the new code|||Chỉ những kho chạy lại run cũ mới thấy mã mới',
              'All forty run the new commit on their next run; pinning by SHA plus Dependabot would have turned it into reviewable pull requests|||Cả bốn mươi chạy commit mới ở lần chạy kế tiếp; ghim SHA cộng Dependabot đã biến nó thành các pull request xem xét được',
              'GitHub blocks moving v1 once any repository uses it|||GitHub chặn việc dời v1 khi đã có kho sử dụng nó',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The pointer is resolved to a SHA in every run’s Set up job. In runs 36030257162 and 36030357449 the same unchanged file resolved @ch12-dem-tep-v1 to b78ea231… and then to 1716c9fc…, and gained an output; the SHA-pinned job did not change. “Nothing changes until files are edited” is how SHA pinning behaves, not a moving tag. GitHub does not block moving a tag in general — only tags tied to immutable releases.|||VI: Con trỏ được giải thành SHA ở Set up job của MỖI run. Ở run 36030257162 và 36030357449, cùng một tệp không đổi đã giải @ch12-dem-tep-v1 thành b78ea231… rồi thành 1716c9fc…, và có thêm một output; job ghim SHA thì không đổi. “Không gì đổi cho tới khi sửa tệp” là hành vi của ghim SHA, không phải của thẻ di động. GitHub không chặn việc dời thẻ nói chung — chỉ chặn thẻ gắn với immutable release.',
          },
          {
            question: 'A workflow uses a YAML merge key: env: { <<: *env-goc, NODE_ENV: production }. What happens when it is pushed?|||Một workflow dùng YAML merge key: env: { <<: *env-goc, NODE_ENV: production }. Chuyện gì xảy ra khi push?',
            options: [
              'It works: the job gets TZ from the anchor and NODE_ENV overridden|||Nó chạy: job nhận TZ từ anchor và NODE_ENV bị ghi đè',
              'The workflow is invalid and never runs; GitHub reports the error at the anchor’s definition line|||Workflow không hợp lệ và không bao giờ chạy; GitHub báo lỗi ở dòng định nghĩa anchor',
              'It runs, but the merge key is ignored and only NODE_ENV is set|||Nó chạy, nhưng merge key bị bỏ qua và chỉ NODE_ENV được đặt',
              'Anchors of any kind are rejected in workflow files|||Anchor loại nào cũng bị từ chối trong tệp workflow',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Run 36029546312 failed before creating any job with “(Line: 13, Col: 10): A mapping was not expected” — line 13 is where &env-goc is defined, not the << on line 21. actionlint pointed at line 21. Plain anchors and aliases do work (run 36029548603), so “anchors are rejected” is wrong; “it works” is what other YAML tools would do, which is why it is tempting.|||VI: Run 36029546312 hỏng trước khi tạo được job nào với “(Line: 13, Col: 10): A mapping was not expected” — dòng 13 là nơi &env-goc được định nghĩa, không phải dòng << ở dòng 21. actionlint chỉ vào dòng 21. Anchor và alias thường thì chạy được (run 36029548603), nên “anchor bị từ chối” là sai; “nó chạy” là điều các công cụ YAML khác sẽ làm, nên nó hấp dẫn.',
          },
          {
            question: 'You enable Dependabot with package-ecosystem: github-actions. Which reference will it NOT update?|||Bạn bật Dependabot với package-ecosystem: github-actions. Tham chiếu nào nó sẽ KHÔNG cập nhật?',
            options: [
              'uses: ./.github/actions/chuan-bi — a local composite action|||uses: ./.github/actions/chuan-bi — một composite action cục bộ',
              'uses: actions/checkout@[full SHA] # v4.3.1|||uses: actions/checkout@[SHA đầy đủ] # v4.3.1',
              'uses: my-org/ci/.github/workflows/build.yml@[full SHA] # v2.0.0|||uses: my-org/ci/.github/workflows/build.yml@[SHA đầy đủ] # v2.0.0',
              'uses: actions/setup-node@v4|||uses: actions/setup-node@v4',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The docs say Dependabot ignores actions and reusable workflows referenced locally, and docker:// images. It does update remote actions and remote reusable workflows, in both tag and SHA form, and it rewrites a version comment on the same line. The SHA-with-comment options are tempting because people assume a SHA cannot be updated — updating it is exactly what Dependabot is for.|||VI: Docs nói Dependabot bỏ qua action và reusable workflow được tham chiếu cục bộ, và ảnh docker://. Nó cập nhật action từ xa và reusable workflow từ xa, cả dạng thẻ lẫn dạng SHA, và viết lại chú thích phiên bản cùng dòng. Các phương án SHA kèm chú thích hấp dẫn vì người ta tưởng SHA thì không cập nhật được — cập nhật nó chính là việc của Dependabot.',
          },
        ],
      },
    },
  ],
};
