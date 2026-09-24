import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 4: Action, `uses:`, và mã của người khác.
 * Số đo: 21 lượt dùng action trong kho này (21/21 ghim thẻ major, 0 ghim SHA),
 * và 11,3% thời gian bước chạy bên trong mã người khác viết.
 */

export default {
  title: 'Chapter 4 — Actions, and running other people’s code|||Chương 4 — Action, và chuyện chạy mã của người khác',
  slug: 'ga-ch4-action',
  description: '21 lượt dùng action, 21/21 ghim bằng thẻ major di động, 0 ghim bằng SHA. Và bằng chứng đo được rằng `@v4` KHÔNG phải hằng số: tệp không đổi suốt 18 ngày, runtime bên dưới sáu action thì đổi.',
  sortOrder: 5,
  lessons: [

    /* ─────────────────────────── 4.0 ─────────────────────────── */
    {
      title: '4.0 — Chapter 4 slides: actions in pictures|||4.0 — Slide Chương 4: action bằng hình',
      slug: 'ga-4-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 4: một dòng uses: được giải ra thế nào, cây quyền của một action, thẻ @v4 đã dời 15 bản, vụ tj-actions 03/2025, SHA đủ 40 ký tự, khoá mà checkout để lại, khoá cache của setup-node tái lập được, và composite action trong repo — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the five stages a <code>uses:</code> line goes through before it runs, what an action can reach, fifteen releases living under one <code>@v4</code>, the tag move that leaked secrets from thousands of repositories in March 2025, the credential <code>checkout</code> leaves behind, and a cache key that turned out to be computable after all.</p>
<p>Slides 3–8 belong to Lesson 4.1, 9–14 to 4.2, 15–19 to 4.3, 20–24 to 4.4 and 25–28 to 4.5. The last three are the chapter&#39;s common mistakes, a cheat sheet, and a 45-minute practice session. Every new log on the slides is real: recorded on 24 September 2026 on GitHub-hosted <code>ubuntu-24.04</code> and <code>macos-15</code> runners (runner 2.337.0) in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch04-action</code>, plus actionlint 1.7.12 in a container and the GitHub API for tags and advisories. Two slides correct earlier versions of this chapter: an action does <em>not</em> see <code>GITHUB_TOKEN</code> in its environment, and the <code>setup-node</code> cache key <em>is</em> reproducible. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: năm chặng mà một dòng <code>uses:</code> đi qua trước khi chạy, những gì một action với tới được, mười lăm bản phát hành sống dưới cùng một chữ <code>@v4</code>, cú dời thẻ làm lộ secret của hàng nghìn kho tháng 3/2025, cái khoá mà <code>checkout</code> để lại, và một khoá cache hoá ra vẫn tính được.</p>
<p>Slide 3–8 thuộc Bài 4.1, 9–14 thuộc 4.2, 15–19 thuộc 4.3, 20–24 thuộc 4.4 và 25–28 thuộc 4.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi log mới trên slide là THẬT: ghi ngày 24/09/2026 trên runner <code>ubuntu-24.04</code> và <code>macos-15</code> của GitHub (runner 2.337.0), trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch04-action</code>, cộng actionlint 1.7.12 chạy trong container và API của GitHub cho thẻ và advisory. Hai slide đính chính bản cũ của chương: action KHÔNG thấy <code>GITHUB_TOKEN</code> trong môi trường, và khoá cache của <code>setup-node</code> TÁI LẬP ĐƯỢC — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('ga-04', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Một dòng uses: đi qua 5 chặng'], [4, 'Log Set up job: tải về đâu, thành SHA nào'], [5, 'Ba loại action'],
  [6, 'Cây quyền của một action'], [7, 'with: thành INPUT_*, gõ sai chỉ bị cảnh báo'], [8, 'pre → main → post, dọn ngược'],
  [9, 'api-backend: 21/21 ghim thẻ major'], [10, '@v4: 15 bản dưới một chữ'], [11, 'tj-actions 03/2025'],
  [12, 'Bốn cách ghim'], [13, 'SHA ngắn bị từ chối'], [14, 'Dependabot cho github-actions'],
  [15, 'checkout mặc định: 1 commit, 0 thẻ'], [16, 'Các chặng của một lần checkout'], [17, 'Khoá của checkout: v4 và v6+'],
  [18, 'Bước sau đọc được khoá — push 403'], [19, 'Tuỳ chọn của checkout'],
  [20, 'setup-node: có sẵn 1 giây, tải 4–5 giây'], [21, 'Khoá cache = hashFiles(lockfile)'], [22, 'Tái lập khoá cũ: Windows khác vì CRLF'],
  [23, 'Trượt → lưu, trúng → bỏ qua, npm ci vẫn chạy'], [24, 'Họ setup-*'],
  [25, 'Bốn cách thôi chép'], [26, 'Composite action trong repo'], [27, 'Action cục bộ chỉ có sau checkout'], [28, 'Chín bản chép trôi thành hai'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh'], [31, 'Thực hành chương 4'],
])}
`,
    },

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — What an action is, and what it can do|||4.1 — Action là cái gì, và nó làm được gì',
      slug: 'ga-4-1-action-la-gi',
      type: 'VIDEO',
      description: 'Đo thật: 11,3% thời gian bước của kho này chạy bên trong mã do người khác viết, với workspace, mạng và cả khoá mà checkout để lại trong tầm tay (còn `GITHUB_TOKEN` thì — đo lại 24/09/2026 — KHÔNG nằm trong môi trường của nó). Một dòng uses: được giải ra thế nào, ba loại action, và loại nào chạy được cái gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>What an action is, and what it can do</h2>
<p class="lead">An action is a repository somebody published that contains code, and <code>uses:</code> means "download that repository and run its code on my runner, in my job, with my environment". Everything else about actions follows from reading that sentence carefully.</p>

<h3>What happens between <code>uses:</code> and the first line of its code</h3>
${slide('ga-04', 3, 'One uses: line goes through five stages before it runs')}
<p>A beginner reads <code>uses: actions/checkout@v4</code> as "call the checkout function". The runner reads it as five separate jobs of work, and each one can be the place where things go wrong. They all happen in the "Set up job" section of the log, <strong>before your first step starts</strong>:</p>
<ol>
<li><strong>Parse the reference.</strong> <code>owner/repo@ref</code> — or <code>owner/repo/sub/folder@ref</code> for an action that lives in a subfolder, <code>./path</code> for a local one, or <code>docker://image:tag</code> for a ready-made container. The part after <code>@</code> can be a branch, a tag or a commit SHA; the runner does not care which yet.</li>
<li><strong>Resolve the ref to a commit.</strong> The runner asks GitHub&#39;s API "what commit is <code>v4</code> right now?". This is the moment a tag stops being a name and becomes content — and the log records the answer.</li>
<li><strong>Download a tarball</strong> of the whole repository at that commit (not just <code>dist/</code>: README, tests and all).</li>
<li><strong>Unpack it</strong> into <code>/home/runner/work/_actions/&lt;owner&gt;/&lt;repo&gt;/&lt;ref&gt;/</code> — next to your workspace, on the same disk, readable by every step.</li>
<li><strong>Read <code>action.yml</code></strong> and look at <code>runs.using</code>. That single key decides how the code is executed: <code>node20</code>/<code>node24</code> (JavaScript, with optional <code>pre</code>/<code>main</code>/<code>post</code> scripts), <code>docker</code> (a container, pulled or built during Set up job), or <code>composite</code> (a list of ordinary steps).</li>
</ol>
${slide('ga-04', 4, 'The Set up job log: where the action was downloaded, and which SHA it became')}
<p>Measured on the sandbox (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000261804" target="_blank" rel="noopener">36000261804</a>, branch <code>ch04-action</code>, 24 September 2026). The job uses the same action twice — once by tag, once by full SHA — plus <code>setup-node</code> and a <code>docker://</code> step:</p>
<div class="out">Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)
Download action repository 'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1' (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)
Download action repository 'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020' (SHA:820762786026740c76f36085b0efc47a31fe5020)
Complete job name: giai
3.20: Pulling from library/alpine        &lt;- docker:// image pulled HERE, before step 1</div>
<p>And from inside the job, a step that simply lists what landed on disk:</p>
<div class="out">$ cd "$RUNNER_WORKSPACE/../_actions" &amp;&amp; pwd
/home/runner/work/_actions
$ find . -maxdepth 3 -mindepth 3 -type d
./actions/checkout/3d3c42e5aac5ba805825da76410c181273ba90b1
./actions/checkout/v4
./actions/setup-node/820762786026740c76f36085b0efc47a31fe5020
$ sed -n '/^runs:/,$p' actions/checkout/v4/action.yml
runs:
  using: node20
  main: dist/index.js
  post: dist/index.js
$ du -sh actions/checkout/*
2.4M  actions/checkout/3d3c42e5aac5ba805825da76410c181273ba90b1
2.2M  actions/checkout/v4</div>
<div class="callout">
<p><strong>Three things to take from this log.</strong> First, <code>@v4</code> is turned into a SHA <em>at run time</em>, and the log keeps the SHA — so "what code did CI run last Tuesday?" has an exact answer, one line into the Set up job section of last Tuesday&#39;s log. Second, the folder name is the ref you wrote (<code>v4</code>), not the SHA; two jobs a week apart both have a folder called <code>v4</code> with different contents. Third, the whole repository is downloaded — 2.2 MB for checkout — and it sits on the runner&#39;s disk next to your code for the rest of the job.</p>
</div>
<div class="pitfall">
<p><strong>Trap — expecting a bad <code>uses:</code> to fail on the step that uses it.</strong> A reference that cannot be resolved (a typo in the owner, a tag that does not exist, a short SHA) fails the <em>whole job</em> in Set up job, before any step runs — even if the broken action is step 12 and steps 1–11 would have been useful. Conversely a <em>local</em> action (<code>./…</code>) is not checked at Set up job at all, because it does not exist yet; it fails only when its step is reached (lesson 4.5 shows both errors).</p>
</div>
<h3>How much of a run is other people&#39;s code</h3>
<p>Run 32662461744 again, splitting each build job&#39;s step time into steps that are <code>uses:</code> and steps that are <code>run:</code>:</p>

<div class="out">nen tang    trong ACTION  trong run: cua BAN  ty le action
------------------------------------------------------------
Linux                28s                208s         11.9%
macOS                44s                387s         10.2%
Windows              39s                278s         12.3%
------------------------------------------------------------
CONG                111s                873s         11.3%</div>

<div class="callout">
<p><strong>Eleven percent, from three actions doing unremarkable things</strong> — checking out the repository, installing Node, uploading a file. That is a reasonable proportion and the actions are worth their time. The number is here to be concrete about what is running: for 111 of every 984 seconds, the process on the runner is code this repository did not write, with the job&#39;s <code>GITHUB_TOKEN</code> and every secret passed to that step available to it.</p>
</div>

<h3>Three kinds, and the differences that matter</h3>
${slide('ga-04', 5, 'Three kinds of action: JS runs everywhere, Docker only on Linux, composite is just steps')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">JavaScript action</span><span class="lz-lnote">an <code>action.yml</code> declaring <code>runs: {using: node20, main: dist/index.js}</code>. Runs on the runner&#39;s own Node, in the job&#39;s workspace, with full filesystem and network access. All eight actions this repository uses are this kind, and the runtime version is a property GitHub can change — measured in 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">Docker action</span><span class="lz-lnote"><code>runs: {using: docker, image: ...}</code>. Runs in a container, so it can bring its own toolchain — but <strong>Linux runners only</strong>, and it pays image pull time on every job. Good for a tool with heavy dependencies; wrong for anything on a matrix that includes macOS or Windows</span></div>
<div class="lz-layer"><span class="lz-lname">composite action</span><span class="lz-lnote"><code>runs: {using: composite, steps: [...]}</code>. A named bundle of ordinary steps. No new capability at all — but it is the right tool for "these six steps appear in four workflows", and unlike the other two you can read the whole thing at a glance</span></div>
</div>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">runs on</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">JavaScript · all three platforms</span><span class="lz-nsub">Linux, macOS, Windows. The runner&#39;s own Node executes it — which is why the Node-20 deprecation in 4.2 touched every one of them at once</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Docker · Linux only</span><span class="lz-nsub">a matrix leg on macOS or Windows cannot use it, and the image pull is paid per job</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">composite · all three</span><span class="lz-nsub">it is just steps, so it runs wherever the steps do — but every <code>run:</code> inside must name its <code>shell:</code></span></div></div>
</div>
</div>

<h3>Measured: a Docker action on macOS</h3>
<p>The table says "Docker actions run on Linux only". Here is what that looks like when you forget, with a <code>docker://alpine:3.20</code> step on <code>macos-15</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">36000264372</a>, job <code>docker-tren-mac</code>):</p>
<div class="out">Prepare all required actions
Container action is only supported on Linux, skip pull and build docker images.
Complete job name: docker-tren-mac
##[error]Value cannot be null. (Parameter 'container')</div>
<p>Set up job prints the real reason as an ordinary line — not a warning, not an error — and continues. The step then fails with a message about a null parameter that says nothing about operating systems. If a matrix leg on macOS or Windows is red with that message, this is why. The same step on <code>ubuntu-24.04</code> pulled the image in one second and printed <code>3.20.10</code>.</p>

<h3>Which kind to reach for — and when not to</h3>
<table>
<thead><tr><th>Situation</th><th>Use</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td>Reusable logic that must run on all three runner OSes</td><td>JavaScript action</td><td>Docker (Linux only)</td></tr>
<tr><td>A tool with heavy native dependencies (a specific <code>terraform</code>, a scanner, LaTeX)</td><td>Docker action, or a <code>container:</code> job</td><td>JS action that downloads half a toolchain at run time</td></tr>
<tr><td>"These five steps appear in four workflows of the same repository"</td><td>composite action in <code>.github/actions/</code></td><td>a published action in a separate repository — overkill</td></tr>
<tr><td>Something you want to run on your laptop too</td><td>a script in the repository, called from <code>run:</code></td><td>any kind of action — none of them run outside a runner without extra tooling</td></tr>
<tr><td>Anything that needs cleanup after the job (log out, save a cache)</td><td>JS action with <code>post:</code></td><td>composite (it has no <code>post</code>)</td></tr>
</tbody>
</table>
<h3>What an action can reach</h3>
${slide('ga-04', 6, 'The permission tree: an action reaches exactly what the job reaches')}
<p>The honest answer is: everything the job can. There is no sandbox between a step and the rest of the job, and the boundary people imagine is not there:</p>

<div class="kv-grid">
<div class="kv"><span class="k">the whole workspace</span><span class="v">your checked-out source, and anything earlier steps wrote. It can read it, and it can modify it before your build step runs</span></div>
<div class="kv"><span class="k">the secrets passed to that step — and, in practice, more</span><span class="v">whatever is in <code>with:</code> or <code>env:</code> for that step arrives as environment variables, and secrets you did not pass are not in its environment. <strong>Correction (24/09/2026):</strong> an earlier version of this lesson called this boundary "properly scoped" and stopped there. It is a boundary of <em>environment variables</em>, not of the machine: the runner process holds every secret the job uses, and a step that can run <code>sudo</code> — every step on a GitHub-hosted runner can — can read that process&#39;s memory. That is exactly what the tj-actions/changed-files payload did in March 2025 (lesson 4.2)</span></div>
<div class="kv"><span class="k"><code>GITHUB_TOKEN</code></span><span class="v"><strong>Correction (24/09/2026):</strong> not in the environment by default — an earlier version of this lesson said it was. Measured below: a self-written action printed <code>co GITHUB_TOKEN trong env? false</code>. It reaches actions in two other ways: as the default value of an input (both <code>checkout</code> and <code>setup-node</code> declare a <code>token:</code> input that defaults to <code>github.token</code> — that is the <code>token: ***</code> line in their logs), and through the credential <code>checkout</code> leaves behind in git&#39;s config (lesson 4.3). With write permissions, an action holding it can push commits, create releases, and comment on issues in your repository</span></div>
<div class="kv"><span class="k">the network</span><span class="v">unrestricted outbound. There is no egress policy on a GitHub-hosted runner, so an action can send anything it read anywhere it likes</span></div>
<div class="kv"><span class="k">the next steps</span><span class="v">it can write to <code>\$GITHUB_ENV</code> and <code>\$GITHUB_PATH</code>, which change the environment and the executable lookup path for every <em>later</em> step in the job. An action can therefore replace a binary your build calls</span></div>
</div>

<div class="callout warn">
<p><strong>This is not a warning about malice — it is a description of the trust model.</strong> <code>uses:</code> is not "call a function", it is "run this program as me". The industry&#39;s repeated Actions supply-chain incidents have all had the same shape: a widely-used action was compromised at the source, and every workflow pinned to a moving tag picked up the new code on its next run without anybody doing anything. Nothing in the model prevents that; what prevents it is pinning, and 4.2 measures what this repository pins to.</p>
</div>

<h3>Measured: what a self-written action actually sees</h3>
<p>Claims about "what an action can see" are easy to make and easy to get wrong — this lesson got one wrong before it was measured. So the sandbox has a twelve-line JavaScript action, <code>.github/actions/soi-moi-truong</code>, that prints only the <em>names</em> of what it can reach (never a secret value):</p>
<pre><code class="language-yaml"># .github/actions/soi-moi-truong/action.yml
name: Soi moi truong
inputs:
  loi-nhan: { required: true }
  so-lan:   { default: '2' }
outputs:
  da-nhan: { description: Lap lai loi nhan }
runs:
  using: node24
  pre: pre.js
  main: index.js
  post: post.js</code></pre>
<p>Called as step 4 of the job, after a <code>checkout@v4</code> with default settings, it printed:</p>
<div class="out">node chay action : v24.19.0 | /home/runner/actions-runner/cached/2.337.0/externals/node24/bin/node
bien INPUT_*     : INPUT_LOI-NHAN=xin chao  INPUT_SO-LAN=2
co GITHUB_TOKEN trong env? false
ten bien co chu TOKEN: ACTIONS_RUNTIME_TOKEN
ten bien ACTIONS_*   : ACTIONS_CACHE_MODE, ACTIONS_CACHE_SERVICE_V2, ACTIONS_CACHE_URL, ACTIONS_ORCHESTRATION_ID,
                       ACTIONS_RESULTS_URL, ACTIONS_RUNNER_ACTION_ARCHIVE_CACHE, ACTIONS_RUNNER_RETURN_JOB_RESULT_FOR_HOSTED
thu muc lam viec     : /home/runner/work/ga-san-tap/ga-san-tap
.git/config co extraheader? true | co includeIf? false</div>
<ul>
<li><strong>The Node that runs it is the runner&#39;s own</strong> (<code>externals/node24</code>), not the Node you install with <code>setup-node</code>. That is why a platform-wide Node deprecation hits every JavaScript action at once (lesson 4.2).</li>
<li><strong>Inputs arrive as <code>INPUT_&lt;NAME&gt;</code></strong>, upper-cased with the hyphen kept — <code>INPUT_LOI-NHAN</code>, which is not even a valid shell variable name. The default of <code>so-lan</code> was filled in by the runner.</li>
<li><strong>No <code>GITHUB_TOKEN</code> in the environment</strong> — but <code>ACTIONS_RUNTIME_TOKEN</code> is there. That one is scoped to the Actions services (cache, artifacts, results), which is exactly why a malicious action can poison a cache.</li>
<li><strong>The last line is the one that matters.</strong> The job&#39;s <code>checkout@v4</code> left an authentication header in <code>.git/config</code>, and this action — which was given no token at all — could read it. The credential you did not pass arrived anyway, through the workspace.</li>
</ul>
<h3>Inputs, outputs, and where <code>with:</code> goes</h3>
${slide('ga-04', 7, 'with: becomes INPUT_*; a misspelled input earns only a yellow warning')}
<pre><code>- uses: actions/setup-node@v4
  id: node
  with:
    node-version: '22'          <span class="tok-comment"># -&gt; INPUT_NODE-VERSION</span>
    cache: npm

- run: echo "&#36;{{ steps.node.outputs.node-version }}"</code></pre>

<p>Each <code>with:</code> key becomes an environment variable named <code>INPUT_&lt;KEY&gt;</code>, uppercased. That is the entire mechanism — which is why passing a value through <code>with:</code> is safe from shell injection in a way that putting it in <code>run:</code> is not: the action receives it as data, and never as script text. Outputs come back the same way an ordinary step&#39;s do, through <code>\$GITHUB_OUTPUT</code>, and are read from the <code>steps</code> context with an <code>id:</code>.</p>

<div class="pitfall">
<p><strong>Trap — a misspelled <code>with:</code> key does not fail anything.</strong> <strong>Correction (24/09/2026):</strong> an earlier version of this lesson said you get "no error, no warning". Measured on the sandbox, the runner does print exactly one warning — <code>##[warning]Unexpected input(s) 'node_version', valid inputs are ['node-version', 'node-version-file', …]</code> — as a yellow annotation on a run that stays green. The step succeeds and the action uses its <em>default</em>: asked for <code>node_version: '20'</code>, it set up <code>v22.23.2</code>. A yellow annotation on a green run is read by nobody, so in practice the behaviour is what this trap always described: write <code>node_version</code> where the action expects <code>node-version</code> and you get the action&#39;s <em>default</em> version instead of yours. The symptom is a build that works and uses the wrong toolchain, which surfaces weeks later as an inexplicable difference between CI and a developer machine. Read the action&#39;s <code>action.yml</code> for the exact input names rather than the README, which is prose and can lag.</p>
</div>

<h3>Catching it before the push: actionlint, and the SHA blind spot</h3>
<p>actionlint (Chapter 1) knows the inputs of popular actions. Run on a file that uses both pin styles:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color
.github/workflows/t.yml:8:11: input "node_version" is not defined in action "actions/setup-node@v4".
  available inputs are "always-auth", "architecture", "cache", "cache-dependency-path", "check-latest",
  "mirror", "mirror-token", "node-version", "node-version-file", "registry-url", "scope", "token" [action]</div>
<p>One error — for the <code>@v4</code> line. The identical mistake on the line pinned to <code>@820762786026740c…</code> (the SHA of v7.0.0) produced <strong>nothing</strong>, and neither did a short SHA. actionlint 1.7.12 keeps a table of popular actions keyed by tag; a SHA is not in the table, so it cannot check the inputs. Two consequences: when you move to SHA pins (4.2), read the action&#39;s <code>action.yml</code> for input names, because the linter stops helping; and for a <em>local</em> action (<code>./.github/actions/…</code>) actionlint reads the <code>action.yml</code> from your repository, so those inputs are checked regardless.</p>
<h3>The pre and post phases</h3>
${slide('ga-04', 8, 'pre → main → post: set up forwards, tear down in reverse')}
<p>An action can declare a <code>post:</code> script that runs during job cleanup. Chapter 2 measured the order on a job with eight of them:</p>

<div class="out">dung : checkout(2) setup-node(3) cache-SWC(4) cache-backend(5)
       buildx(10) ghcr-login(11) anh-backend(14) anh-frontend(15)
don  : anh-frontend(43) anh-backend(44) ghcr-login(45) buildx(46)
       cache-backend(47) cache-SWC(48) setup-node(49) checkout(50)</div>

<p>Eight setups, eight teardowns, in exactly reverse order. This is where <code>actions/cache</code> actually saves the cache, where <code>docker/login-action</code> logs out, and where <code>actions/checkout</code> removes the credentials it wrote into <code>.git/config</code>. It is also a phase you did not write and cannot see in the YAML — so when a job&#39;s log shows twenty seconds of activity after your last step, this is what it is.</p>

<h3>Measured again: order, and the pre that never ran</h3>
<p>On the sandbox job, the step list from the API (<code>gh api …/runs/36000261804/jobs</code>) shows the same mirror image with four actions that have a post script:</p>
<div class="out">3  1. checkout ghim THE major          6  4. Action JS tu viet (pre/main/post)
4  2. checkout ghim SHA day du         8  6. Go sai ten input (setup-node)
...
17 Post 6. Go sai ten input (node_version)
18 Post 4. Action JS tu viet (pre/main/post)
19 Post 2. checkout ghim SHA day du
20 Post 1. checkout ghim THE major</div>
<p>And the self-written action declared <code>pre: pre.js</code> — which never ran. The log says why, twice:</p>
<div class="out">##[warning]&#96;pre&#96; execution is not supported for local action from './.github/actions/soi-moi-truong'</div>
<p><code>pre</code> runs before step 1, and at that moment a local action does not exist on disk yet — it arrives with your <code>checkout</code>. Only downloaded actions (the ones listed under "Download action repository") can have a working <code>pre</code>. The <code>post</code> did run: <code>[post] chay luc don dep, sau buoc cuoi cung</code>.</p>
<div class="callout ok">
<p><strong>The one sentence.</strong> An action is a program you run as yourself with your token in the environment, which is exactly as powerful and exactly as risky as that sounds — and the mitigations are the ordinary ones: pin what you run, narrow what it can see, and prefer a composite action you can read over a dependency you cannot.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: What actually happens when a workflow says <code>uses: actions/checkout@v4</code>?</strong><br>A: During "Set up job" the runner resolves <code>v4</code> to a commit SHA through the API, downloads that commit of the repository as a tarball into <code>_actions/actions/checkout/v4/</code>, reads <code>action.yml</code>, and later executes it according to <code>runs.using</code> — a JavaScript action on the runner&#39;s bundled Node, with <code>pre</code>/<code>main</code>/<code>post</code> hooks. It runs in my job, as my job, on my runner.</p>
<p><strong>Q: JavaScript, Docker and composite actions — how do you choose?</strong><br>A: JavaScript for cross-platform logic and anything needing <code>post</code> cleanup; Docker when the tool has heavy dependencies and Linux-only is acceptable (it pays an image pull per job); composite to bundle repeated steps inside one repository or organisation. A plain script in the repo when I want to run and debug it locally.</p>
<p><strong>Q: Can a third-party action read my secrets?</strong><br>A: Through its environment, only the ones passed to that step. But it runs with <code>sudo</code> on the same machine as the runner process, which holds every secret the job uses, and it can read the workspace, including a git credential left by <code>checkout</code>. The tj-actions/changed-files incident (March 2025) dumped runner memory into logs. So the real controls are: pin to a full SHA, minimise <code>permissions:</code>, set <code>persist-credentials: false</code>, and do not give secrets to jobs that run untrusted code.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> before your team adds its fifth third-party action, you want to see with your own eyes where an action comes from and what it can see.</p><ol>
<li>In a test repository, add a job with <code>actions/checkout@v4</code> and one more action pinned by full SHA (copy the SHA from <code>gh api repos/actions/setup-node/git/ref/tags/v4 --jq .object.sha</code>). Push and open the "Set up job" section: find both "Download action repository" lines.</li>
<li>Add a step: <code>ls "$RUNNER_WORKSPACE/../_actions"/*/*</code> and <code>sed -n '/^runs:/,$p'</code> on the checkout <code>action.yml</code>. Note the value of <code>using:</code>.</li>
<li>Add a step with <code>env | grep -c ^GITHUB_TOKEN= || true</code> and <code>git config --get-all http.https://github.com/.extraheader | cut -c1-20</code>. Compare the two answers.</li>
<li>Misspell one input on purpose (<code>node_version</code>) and push. Find the warning in the run summary, then check which Node version was installed.</li>
<li>Run actionlint on the file twice: once with the action pinned by tag, once by SHA.</li></ol>
<p><strong>Done when:</strong> you can quote the SHA that <code>@v4</code> resolved to in your run; <code>using:</code> is <code>node20</code> or <code>node24</code>; the <code>GITHUB_TOKEN</code> count is 0 while the git header starts with <code>AUTHORIZATION: basic</code>; you found the "Unexpected input(s)" warning and the default Node version; and actionlint flagged the typo only in the tag-pinned version.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Action</span><span class="v">A repository (or folder) with an <code>action.yml</code>; <code>uses:</code> downloads it and runs it inside your job.</span></div>
  <div class="kv"><span class="k"><code>action.yml</code> (metadata file)</span><span class="v">Declares <code>inputs</code>, <code>outputs</code> and <code>runs:</code> — the only reliable source for input names.</span></div>
  <div class="kv"><span class="k"><code>runs.using</code></span><span class="v"><code>node20</code>/<code>node24</code> (JavaScript), <code>docker</code>, or <code>composite</code> — decides how the code executes.</span></div>
  <div class="kv"><span class="k"><code>INPUT_*</code></span><span class="v">Environment variables the runner creates from <code>with:</code>, name upper-cased, hyphens kept.</span></div>
  <div class="kv"><span class="k">pre / main / post</span><span class="v">Scripts of a JavaScript action: before step 1, at its own step, and during cleanup (in reverse order).</span></div>
  <div class="kv"><span class="k">Set up job</span><span class="v">The first log section: runner info, token permissions, and resolving + downloading every action.</span></div>
  <div class="kv"><span class="k">Trust model</span><span class="v"><code>uses:</code> = run this program as me. No sandbox between a step and the rest of the job.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A <code>uses:</code> line is resolved to a SHA, downloaded as a tarball into <code>_actions/</code>, and run according to <code>runs.using</code> — all decided in Set up job, before step 1.</li>
<li>JavaScript actions run on the runner&#39;s own Node on every OS; Docker actions only on Linux (on macOS: "Value cannot be null"); composite actions are plain steps.</li>
<li>An action reaches the workspace, the network, <code>$GITHUB_ENV</code>/<code>$GITHUB_PATH</code> and — with sudo — the runner&#39;s memory. <code>GITHUB_TOKEN</code> is not in its environment, but the checkout credential and <code>token:</code> input defaults bring it close.</li>
<li><code>with:</code> keys become <code>INPUT_*</code>; a misspelled key earns one yellow warning and the action&#39;s default value.</li>
<li>actionlint checks inputs of popular actions pinned by tag, not by SHA.</li>
<li><code>post</code> scripts run in reverse order; <code>pre</code> never runs for a local action.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Metadata syntax for GitHub Actions (action.yml)</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions — the authoritative reference for inputs, outputs, <code>runs.using</code>, and the <code>pre</code>/<code>post</code> hooks. Reading an action&#39;s <code>action.yml</code> answers most questions its README does not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using third-party actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — GitHub&#39;s own statement of the trust model described above, and the recommendation to pin to a full commit SHA.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — the third kind, including the restrictions (no <code>if:</code> on composite steps in older versions, and the <code>shell:</code> key being mandatory on every <code>run:</code>).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — an image is somebody else&#39;s filesystem, and FROM is a trust decision</span><span class="lc-sub">/courses/docker/learn${REF} — the identical model one layer down, including why "official" is a weaker guarantee than a digest.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — what npm install actually executes</span><span class="lc-sub">/courses/nodejs/learn${REF} — install scripts, transitive dependencies, and lockfiles: the same supply-chain question in the ecosystem your build already depends on.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Action là cái gì, và nó làm được gì</h2>
<p class="lead">Một action là một kho ai đó đã công bố, trong có mã, và <code>uses:</code> nghĩa là "tải kho ấy về rồi chạy mã của nó trên runner của tôi, trong job của tôi, với môi trường của tôi". Mọi thứ khác về action đều chảy ra từ việc đọc câu ấy cho kỹ.</p>

<h3>Chuyện gì xảy ra giữa dòng <code>uses:</code> và dòng mã đầu tiên của nó</h3>
${slide('ga-04', 3, 'Một dòng uses: đi qua 5 chặng trước khi chạy được')}
<p>Người mới đọc <code>uses: actions/checkout@v4</code> thành "gọi hàm checkout". Runner (máy chạy) đọc nó thành NĂM việc riêng rẽ, và việc nào cũng có thể là chỗ hỏng. Tất cả diễn ra trong phần "Set up job" của log, <strong>trước khi bước đầu tiên của bạn bắt đầu</strong>:</p>
<ol>
<li><strong>Phân tích tham chiếu.</strong> <code>owner/repo@ref</code> — hoặc <code>owner/repo/thu-muc/con@ref</code> với action nằm trong thư mục con, <code>./duong-dan</code> với action cục bộ, hay <code>docker://anh:the</code> với một container dựng sẵn. Phần sau <code>@</code> có thể là nhánh, thẻ (tag) hay SHA commit; lúc này runner chưa quan tâm là loại nào.</li>
<li><strong>Đổi ref thành commit.</strong> Runner hỏi API của GitHub "ngay bây giờ <code>v4</code> là commit nào?". Đây là khoảnh khắc một cái thẻ thôi là CÁI TÊN và trở thành NỘI DUNG — và log ghi lại câu trả lời.</li>
<li><strong>Tải tarball</strong> (tệp nén) của CẢ kho tại commit đó (không chỉ <code>dist/</code>: README, test, tất cả).</li>
<li><strong>Giải nén</strong> vào <code>/home/runner/work/_actions/&lt;owner&gt;/&lt;repo&gt;/&lt;ref&gt;/</code> — cạnh workspace của bạn, cùng một đĩa, bước nào cũng đọc được.</li>
<li><strong>Đọc <code>action.yml</code></strong> và nhìn <code>runs.using</code>. Đúng một khoá ấy quyết định mã được chạy thế nào: <code>node20</code>/<code>node24</code> (JavaScript, có thể kèm script <code>pre</code>/<code>main</code>/<code>post</code>), <code>docker</code> (một container, kéo về hoặc dựng ngay trong Set up job), hay <code>composite</code> (một danh sách bước thường).</li>
</ol>
${slide('ga-04', 4, 'Log Set up job: action tải về đâu, và thành SHA nào')}
<p>Đo trên sân tập (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000261804" target="_blank" rel="noopener">36000261804</a>, nhánh <code>ch04-action</code>, 24/09/2026). Job dùng cùng một action HAI lần — một lần theo thẻ, một lần theo SHA đầy đủ — cộng <code>setup-node</code> và một bước <code>docker://</code>:</p>
<div class="out">Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)
Download action repository 'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1' (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)
Download action repository 'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020' (SHA:820762786026740c76f36085b0efc47a31fe5020)
Complete job name: giai
3.20: Pulling from library/alpine        &lt;- ảnh docker:// được kéo Ở ĐÂY, trước bước 1</div>
<p>Và từ bên trong job, một bước chỉ liệt kê những gì đã nằm trên đĩa:</p>
<div class="out">$ cd "$RUNNER_WORKSPACE/../_actions" &amp;&amp; pwd
/home/runner/work/_actions
$ find . -maxdepth 3 -mindepth 3 -type d
./actions/checkout/3d3c42e5aac5ba805825da76410c181273ba90b1
./actions/checkout/v4
./actions/setup-node/820762786026740c76f36085b0efc47a31fe5020
$ sed -n '/^runs:/,$p' actions/checkout/v4/action.yml
runs:
  using: node20
  main: dist/index.js
  post: dist/index.js
$ du -sh actions/checkout/*
2.4M  actions/checkout/3d3c42e5aac5ba805825da76410c181273ba90b1
2.2M  actions/checkout/v4</div>
<div class="callout">
<p><strong>Ba điều rút ra từ log này.</strong> Một: <code>@v4</code> được đổi thành SHA <em>LÚC CHẠY</em>, và log giữ lại SHA — nên câu "thứ Ba tuần trước CI đã chạy mã nào?" có câu trả lời chính xác, nằm ngay một dòng trong phần Set up job của log thứ Ba tuần trước. Hai: tên thư mục là ref bạn viết (<code>v4</code>), không phải SHA; hai job cách nhau một tuần đều có thư mục tên <code>v4</code> với nội dung khác nhau. Ba: CẢ kho được tải về — 2,2 MB với checkout — và nằm trên đĩa runner cạnh mã của bạn suốt phần còn lại của job.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — trông đợi một <code>uses:</code> hỏng sẽ hỏng ở ĐÚNG bước dùng nó.</strong> Một tham chiếu không giải được (gõ sai owner, thẻ không tồn tại, SHA ngắn) làm hỏng <em>CẢ job</em> ngay ở Set up job, trước khi bước nào chạy — kể cả khi action hỏng là bước 12 còn bước 1–11 lẽ ra vẫn hữu ích. Ngược lại một action <em>CỤC BỘ</em> (<code>./…</code>) hoàn toàn không được kiểm ở Set up job, vì lúc đó nó chưa tồn tại; nó chỉ hỏng khi tới bước của nó (bài 4.5 cho thấy cả hai lỗi).</p>
</div>
<h3>Bao nhiêu phần một lần chạy là mã của người khác</h3>
<p>Lại run 32662461744, tách thời gian bước của mỗi job dựng thành bước <code>uses:</code> và bước <code>run:</code>:</p>

<div class="out">nen tang    trong ACTION  trong run: cua BAN  ty le action
------------------------------------------------------------
Linux                28s                208s         11.9%
macOS                44s                387s         10.2%
Windows              39s                278s         12.3%
------------------------------------------------------------
CONG                111s                873s         11.3%</div>

<div class="callout">
<p><strong>Mười một phần trăm, từ ba action làm những việc chẳng có gì đặc biệt</strong> — lấy mã kho về, cài Node, tải một tệp lên. Tỉ lệ ấy hợp lý và mấy action ấy xứng đáng với thời gian của chúng. Con số nằm đây để nói cho cụ thể cái gì đang chạy: cứ 984 giây thì có 111 giây tiến trình trên runner là mã mà kho này KHÔNG viết, với <code>GITHUB_TOKEN</code> của job và mọi bí mật truyền cho bước ấy nằm sẵn trong tầm với của nó.</p>
</div>

<h3>Ba loại, và những khác biệt có ý nghĩa</h3>
${slide('ga-04', 5, 'Ba loại action: JS chạy mọi nơi, Docker chỉ Linux, composite là các bước')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">action JavaScript</span><span class="lz-lnote">một <code>action.yml</code> khai <code>runs: {using: node20, main: dist/index.js}</code>. Chạy trên Node của chính runner, trong thư mục làm việc của job, với toàn quyền hệ tệp và mạng. Cả tám action kho này dùng đều thuộc loại này, và phiên bản runtime là một thuộc tính GitHub đổi được — đo ở bài 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">action Docker</span><span class="lz-lnote"><code>runs: {using: docker, image: ...}</code>. Chạy trong một container, nên nó mang được bộ công cụ riêng — nhưng <strong>CHỈ trên runner Linux</strong>, và nó trả giá bằng thời gian kéo ảnh ở mỗi job. Tốt cho một công cụ có phụ thuộc nặng; sai cho bất cứ thứ gì nằm trên một ma trận có macOS hay Windows</span></div>
<div class="lz-layer"><span class="lz-lname">action composite</span><span class="lz-lnote"><code>runs: {using: composite, steps: [...]}</code>. Một bó các bước thông thường được đặt tên. Hoàn toàn không thêm năng lực gì mới — nhưng nó là công cụ đúng cho "sáu bước này xuất hiện ở bốn workflow", và khác hai loại kia, bạn đọc trọn nó trong một cái liếc</span></div>
</div>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">chạy được ở đâu</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">JavaScript · cả ba nền tảng</span><span class="lz-nsub">Linux, macOS, Windows. Node của chính runner thực thi nó — và đó là lý do cú khai tử Node 20 ở bài 4.2 chạm vào TẤT CẢ chúng cùng lúc</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Docker · CHỈ Linux</span><span class="lz-nsub">một nhánh ma trận trên macOS hay Windows không dùng được nó, và tiền kéo ảnh trả theo TỪNG job</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">composite · cả ba</span><span class="lz-nsub">nó chỉ là các bước, nên nó chạy ở đâu các bước chạy được — nhưng mọi <code>run:</code> bên trong phải nêu <code>shell:</code> của nó</span></div></div>
</div>
</div>

<h3>Đo thật: một Docker action trên macOS</h3>
<p>Bảng trên nói "Docker action chỉ chạy trên Linux". Đây là hình dạng của nó khi bạn quên, với một bước <code>docker://alpine:3.20</code> trên <code>macos-15</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">36000264372</a>, job <code>docker-tren-mac</code>):</p>
<div class="out">Prepare all required actions
Container action is only supported on Linux, skip pull and build docker images.
Complete job name: docker-tren-mac
##[error]Value cannot be null. (Parameter 'container')</div>
<p>Set up job in lý do THẬT dưới dạng một dòng bình thường — không phải cảnh báo, không phải lỗi — rồi đi tiếp. Sau đó bước hỏng với một thông điệp về tham số null, chẳng nói gì về hệ điều hành. Nếu một nhánh ma trận trên macOS hay Windows đỏ với thông điệp ấy, lý do là đây. Cùng bước đó trên <code>ubuntu-24.04</code> kéo ảnh mất một giây và in ra <code>3.20.10</code>.</p>

<h3>Khi nào dùng loại nào — và khi nào KHÔNG</h3>
<table>
<thead><tr><th>Tình huống</th><th>Dùng</th><th>Tránh</th></tr></thead>
<tbody>
<tr><td>Logic dùng lại phải chạy trên cả ba hệ điều hành của runner</td><td>JavaScript action</td><td>Docker (chỉ Linux)</td></tr>
<tr><td>Một công cụ nặng phụ thuộc gốc (một bản <code>terraform</code> cụ thể, máy quét bảo mật, LaTeX)</td><td>Docker action, hoặc job có <code>container:</code></td><td>JS action tải nửa bộ công cụ lúc chạy</td></tr>
<tr><td>"Năm bước này lặp lại trong bốn workflow của CÙNG một kho"</td><td>composite action trong <code>.github/actions/</code></td><td>một action phát hành ở kho riêng — quá tay</td></tr>
<tr><td>Thứ bạn cũng muốn chạy trên laptop</td><td>một script trong kho, gọi từ <code>run:</code></td><td>mọi loại action — không loại nào chạy ngoài runner nếu không có công cụ phụ</td></tr>
<tr><td>Việc cần dọn dẹp sau job (đăng xuất, lưu cache)</td><td>JS action có <code>post:</code></td><td>composite (không có <code>post</code>)</td></tr>
</tbody>
</table>
<h3>Một action với tới được những gì</h3>
${slide('ga-04', 6, 'Cây quyền: một action với tới đúng những gì job với tới')}
<p>Câu trả lời trung thực là: mọi thứ job với tới được. KHÔNG có hộp cát nào giữa một bước và phần còn lại của job, và cái ranh giới người ta tưởng tượng ra thì không tồn tại:</p>

<div class="kv-grid">
<div class="kv"><span class="k">toàn bộ thư mục làm việc</span><span class="v">mã nguồn bạn vừa lấy về, và mọi thứ các bước trước đã ghi ra. Nó đọc được, và nó SỬA ĐƯỢC trước khi bước dựng của bạn chạy</span></div>
<div class="kv"><span class="k">bí mật truyền cho bước ấy — và trên thực tế, NHIỀU HƠN</span><span class="v">bất cứ thứ gì nằm trong <code>with:</code> hay <code>env:</code> của bước đó tới dưới dạng biến môi trường, còn bí mật bạn không truyền thì không nằm trong môi trường của nó. <strong>Đính chính (24/09/2026):</strong> bản trước của bài này gọi ranh giới ấy là "khoanh vùng đúng đắn" rồi dừng. Nó là ranh giới của <em>BIẾN MÔI TRƯỜNG</em>, không phải của cỗ máy: tiến trình runner giữ MỌI bí mật mà job dùng, và một bước chạy được <code>sudo</code> — trên runner của GitHub bước nào cũng chạy được — đọc được bộ nhớ của tiến trình ấy. Đó chính xác là điều mã độc tj-actions/changed-files đã làm tháng 3/2025 (bài 4.2)</span></div>
<div class="kv"><span class="k"><code>GITHUB_TOKEN</code></span><span class="v"><strong>Đính chính (24/09/2026):</strong> mặc định KHÔNG nằm trong môi trường — bản trước của bài nói là có. Đo ở dưới: một action tự viết in ra <code>co GITHUB_TOKEN trong env? false</code>. Nó tới được tay action theo hai đường khác: làm giá trị mặc định của một input (cả <code>checkout</code> lẫn <code>setup-node</code> đều khai input <code>token:</code> mặc định là <code>github.token</code> — đó là dòng <code>token: ***</code> trong log của chúng), và qua khoá xác thực mà <code>checkout</code> để lại trong cấu hình git (bài 4.3). Với quyền ghi, một action cầm được nó thì đẩy được commit, tạo được bản phát hành, và bình luận được vào issue trong kho bạn</span></div>
<div class="kv"><span class="k">mạng</span><span class="v">ra ngoài không hạn chế. Không có chính sách chặn lối ra nào trên một runner do GitHub cấp, nên một action gửi được bất cứ thứ gì nó đọc được tới bất cứ đâu nó muốn</span></div>
<div class="kv"><span class="k">các bước tiếp theo</span><span class="v">nó ghi được vào <code>\$GITHUB_ENV</code> và <code>\$GITHUB_PATH</code>, thứ đổi môi trường và đường tìm tệp thực thi cho MỌI bước <em>SAU</em> trong job. Nên một action THAY THẾ được một tệp nhị phân mà bản dựng của bạn gọi tới</span></div>
</div>

<div class="callout warn">
<p><strong>Đây không phải lời cảnh báo về ác ý — nó là mô tả MÔ HÌNH TIN CẬY.</strong> <code>uses:</code> không phải "gọi một hàm", nó là "chạy chương trình này với tư cách là tôi". Những sự cố chuỗi cung ứng Actions lặp đi lặp lại của ngành đều cùng một hình dạng: một action được dùng rộng rãi bị chiếm ở gốc, và mọi workflow ghim vào một cái thẻ DI ĐỘNG nhận mã mới ở lần chạy kế mà chẳng ai làm gì cả. Không có gì trong mô hình ngăn được chuyện đó; thứ ngăn được là GHIM, và bài 4.2 đo xem kho này ghim vào cái gì.</p>
</div>

<h3>Đo thật: một action tự viết THẤY được những gì</h3>
<p>Những khẳng định kiểu "action nhìn thấy gì" rất dễ nói và rất dễ sai — chính bài này đã sai một câu trước khi được đo. Nên sân tập có một JavaScript action mười hai dòng, <code>.github/actions/soi-moi-truong</code>, chỉ in ra <em>TÊN</em> của những thứ nó với tới (không bao giờ in giá trị bí mật):</p>
<pre><code class="language-yaml"># .github/actions/soi-moi-truong/action.yml
name: Soi moi truong
inputs:
  loi-nhan: { required: true }
  so-lan:   { default: '2' }
outputs:
  da-nhan: { description: Lap lai loi nhan }
runs:
  using: node24
  pre: pre.js
  main: index.js
  post: post.js</code></pre>
<p>Gọi ở bước 4 của job, sau một <code>checkout@v4</code> để mặc định, nó in ra:</p>
<div class="out">node chay action : v24.19.0 | /home/runner/actions-runner/cached/2.337.0/externals/node24/bin/node
bien INPUT_*     : INPUT_LOI-NHAN=xin chao  INPUT_SO-LAN=2
co GITHUB_TOKEN trong env? false
ten bien co chu TOKEN: ACTIONS_RUNTIME_TOKEN
ten bien ACTIONS_*   : ACTIONS_CACHE_MODE, ACTIONS_CACHE_SERVICE_V2, ACTIONS_CACHE_URL, ACTIONS_ORCHESTRATION_ID,
                       ACTIONS_RESULTS_URL, ACTIONS_RUNNER_ACTION_ARCHIVE_CACHE, ACTIONS_RUNNER_RETURN_JOB_RESULT_FOR_HOSTED
thu muc lam viec     : /home/runner/work/ga-san-tap/ga-san-tap
.git/config co extraheader? true | co includeIf? false</div>
<ul>
<li><strong>Node chạy nó là Node CỦA RUNNER</strong> (<code>externals/node24</code>), không phải Node bạn cài bằng <code>setup-node</code>. Vì thế một đợt khai tử Node trên toàn nền tảng đánh vào mọi JavaScript action cùng lúc (bài 4.2).</li>
<li><strong>Input tới dưới dạng <code>INPUT_&lt;TÊN&gt;</code></strong>, viết hoa, GIỮ dấu gạch ngang — <code>INPUT_LOI-NHAN</code>, thậm chí không phải tên biến shell hợp lệ. Giá trị mặc định của <code>so-lan</code> do runner điền vào.</li>
<li><strong>Không có <code>GITHUB_TOKEN</code> trong môi trường</strong> — nhưng có <code>ACTIONS_RUNTIME_TOKEN</code>. Token đó dùng cho các dịch vụ của Actions (cache, artifact, kết quả), và đó đúng là lý do một action độc đầu độc được cache.</li>
<li><strong>Dòng cuối mới là dòng quan trọng.</strong> <code>checkout@v4</code> của job để lại một header xác thực trong <code>.git/config</code>, và action này — thứ KHÔNG được đưa token nào — đọc được nó. Khoá bạn không truyền vẫn tới nơi, qua thư mục làm việc.</li>
</ul>
<h3>Tham số vào, tham số ra, và <code>with:</code> đi đâu</h3>
${slide('ga-04', 7, 'with: thành INPUT_*; gõ sai tên chỉ nhận một cảnh báo vàng')}
<pre><code>- uses: actions/setup-node@v4
  id: node
  with:
    node-version: '22'          <span class="tok-comment"># -&gt; INPUT_NODE-VERSION</span>
    cache: npm

- run: echo "&#36;{{ steps.node.outputs.node-version }}"</code></pre>

<p>Mỗi khoá <code>with:</code> trở thành một biến môi trường tên <code>INPUT_&lt;KHOÁ&gt;</code>, viết hoa lên. Đó là TOÀN BỘ cơ chế — và đó là lý do truyền một giá trị qua <code>with:</code> thì an toàn trước injection vào shell theo cái cách mà đặt nó vào <code>run:</code> thì không: action nhận nó dưới dạng DỮ LIỆU, không bao giờ dưới dạng chữ trong script. Tham số ra quay về theo đúng cách của một bước thường, qua <code>\$GITHUB_OUTPUT</code>, và được đọc từ context <code>steps</code> với một <code>id:</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — một khoá <code>with:</code> gõ sai KHÔNG làm hỏng gì cả.</strong> <strong>Đính chính (24/09/2026):</strong> bản trước của bài này nói bạn "không nhận được lỗi, không cảnh báo". Đo trên sân tập, runner CÓ in đúng một cảnh báo — <code>##[warning]Unexpected input(s) 'node_version', valid inputs are ['node-version', 'node-version-file', …]</code> — thành một chú thích vàng trên một run vẫn XANH. Bước thành công và action dùng giá trị <em>MẶC ĐỊNH</em>: xin <code>node_version: '20'</code>, nó cài <code>v22.23.2</code>. Một chú thích vàng trên run xanh thì chẳng ai đọc, nên trên thực tế hành vi vẫn đúng như cái bẫy này luôn mô tả: viết <code>node_version</code> ở chỗ action mong <code>node-version</code> thì bạn nhận về phiên bản <em>MẶC ĐỊNH</em> của action thay vì phiên bản của bạn. Triệu chứng là một bản dựng chạy được và dùng sai bộ công cụ, thứ lộ ra vài tuần sau dưới dạng một khác biệt không giải thích nổi giữa CI với máy của một người. Hãy đọc <code>action.yml</code> của action để lấy đúng tên tham số, chứ đừng đọc README — README là văn xuôi và nó tụt hậu được.</p>
</div>

<h3>Bắt nó TRƯỚC khi push: actionlint, và điểm mù của SHA</h3>
<p>actionlint (Chương 1) biết input của các action phổ biến. Chạy trên một tệp dùng cả hai kiểu ghim:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color
.github/workflows/t.yml:8:11: input "node_version" is not defined in action "actions/setup-node@v4".
  available inputs are "always-auth", "architecture", "cache", "cache-dependency-path", "check-latest",
  "mirror", "mirror-token", "node-version", "node-version-file", "registry-url", "scope", "token" [action]</div>
<p>Một lỗi — cho dòng <code>@v4</code>. Cùng lỗi y hệt trên dòng ghim <code>@820762786026740c…</code> (SHA của v7.0.0) cho ra <strong>KHÔNG GÌ CẢ</strong>, SHA ngắn cũng vậy. actionlint 1.7.12 giữ một bảng action phổ biến tra theo THẺ; một SHA không có trong bảng, nên nó không kiểm được input. Hai hệ quả: khi chuyển sang ghim SHA (4.2), hãy đọc <code>action.yml</code> của action để lấy tên input, vì bộ kiểm thôi giúp; còn với action <em>CỤC BỘ</em> (<code>./.github/actions/…</code>) actionlint đọc <code>action.yml</code> trong chính kho bạn, nên input của chúng vẫn được kiểm.</p>
<h3>Pha pre và pha post</h3>
${slide('ga-04', 8, 'pre → main → post: dựng xuôi, dọn NGƯỢC thứ tự')}
<p>Một action khai được một script <code>post:</code> chạy trong lúc dọn dẹp job. Chương 2 đã đo thứ tự trên một job có tám cái:</p>

<div class="out">dung : checkout(2) setup-node(3) cache-SWC(4) cache-backend(5)
       buildx(10) ghcr-login(11) anh-backend(14) anh-frontend(15)
don  : anh-frontend(43) anh-backend(44) ghcr-login(45) buildx(46)
       cache-backend(47) cache-SWC(48) setup-node(49) checkout(50)</div>

<p>Tám cái dựng, tám cái tháo, ngược thứ tự chính xác. Đây là chỗ <code>actions/cache</code> THẬT SỰ lưu cache, chỗ <code>docker/login-action</code> đăng xuất, và chỗ <code>actions/checkout</code> gỡ đi phần thông tin đăng nhập nó đã ghi vào <code>.git/config</code>. Nó cũng là một pha bạn không viết ra và không nhìn thấy được trong YAML — nên khi log của một job hiện ra hai mươi giây hoạt động sau bước cuối cùng của bạn, thì đó chính là nó.</p>

<h3>Đo lại: thứ tự, và cái pre KHÔNG BAO GIỜ chạy</h3>
<p>Trên job của sân tập, danh sách bước lấy từ API (<code>gh api …/runs/36000261804/jobs</code>) cho thấy đúng hình ảnh soi gương ấy với bốn action có script post:</p>
<div class="out">3  1. checkout ghim THE major          6  4. Action JS tu viet (pre/main/post)
4  2. checkout ghim SHA day du         8  6. Go sai ten input (setup-node)
...
17 Post 6. Go sai ten input (node_version)
18 Post 4. Action JS tu viet (pre/main/post)
19 Post 2. checkout ghim SHA day du
20 Post 1. checkout ghim THE major</div>
<p>Và action tự viết đã khai <code>pre: pre.js</code> — thứ không bao giờ chạy. Log nói lý do, hai lần:</p>
<div class="out">##[warning]&#96;pre&#96; execution is not supported for local action from './.github/actions/soi-moi-truong'</div>
<p><code>pre</code> chạy trước bước 1, và lúc đó một action cục bộ chưa có trên đĩa — nó tới cùng cú <code>checkout</code> của bạn. Chỉ action TẢI VỀ (những cái có dòng "Download action repository") mới có <code>pre</code> chạy được. Còn <code>post</code> thì có chạy: <code>[post] chay luc don dep, sau buoc cuoi cung</code>.</p>
<div class="callout ok">
<p><strong>Một câu.</strong> Một action là một chương trình bạn chạy VỚI TƯ CÁCH LÀ BẠN, với token của bạn trong môi trường, tức là mạnh đúng như nghe và cũng rủi ro đúng như nghe — và cách giảm nhẹ là những cách thông thường: GHIM thứ bạn chạy, THU HẸP thứ nó nhìn thấy, và ưu tiên một action composite bạn ĐỌC ĐƯỢC hơn một phụ thuộc bạn không đọc được.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Khi workflow ghi <code>uses: actions/checkout@v4</code>, chuyện gì THẬT SỰ xảy ra?</strong><br>Đ: Trong "Set up job", runner đổi <code>v4</code> thành một SHA commit qua API, tải commit đó của kho về dạng tarball vào <code>_actions/actions/checkout/v4/</code>, đọc <code>action.yml</code>, rồi sau đó chạy nó theo <code>runs.using</code> — JavaScript action thì chạy bằng Node đi kèm runner, có móc <code>pre</code>/<code>main</code>/<code>post</code>. Nó chạy TRONG job của tôi, VỚI TƯ CÁCH job của tôi, trên runner của tôi.</p>
<p><strong>H: JavaScript, Docker, composite — chọn thế nào?</strong><br>Đ: JavaScript cho logic đa nền tảng và mọi thứ cần dọn dẹp ở <code>post</code>; Docker khi công cụ nặng phụ thuộc và chấp nhận chỉ Linux (trả giá kéo ảnh mỗi job); composite để gom các bước lặp trong một kho hay một tổ chức. Một script thường trong kho khi tôi muốn chạy và gỡ lỗi nó ở máy mình.</p>
<p><strong>H: Một action của bên thứ ba đọc được secret của tôi không?</strong><br>Đ: Qua biến môi trường thì chỉ những cái truyền cho bước đó. Nhưng nó chạy có <code>sudo</code> trên cùng máy với tiến trình runner — thứ giữ mọi secret job dùng — và nó đọc được workspace, gồm cả khoá git mà <code>checkout</code> để lại. Vụ tj-actions/changed-files (03/2025) đã đổ bộ nhớ runner ra log. Nên các biện pháp thật là: ghim SHA đầy đủ, thu nhỏ <code>permissions:</code>, đặt <code>persist-credentials: false</code>, và không đưa secret cho job chạy mã không tin được.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước khi nhóm bạn thêm action bên thứ ba thứ năm, bạn muốn tận mắt thấy một action tới từ đâu và nó thấy được gì.</p><ol>
<li>Trong một kho thử, thêm một job có <code>actions/checkout@v4</code> và một action nữa ghim bằng SHA đầy đủ (lấy SHA bằng <code>gh api repos/actions/setup-node/git/ref/tags/v4 --jq .object.sha</code>). Push rồi mở phần "Set up job": tìm hai dòng "Download action repository".</li>
<li>Thêm một bước: <code>ls "$RUNNER_WORKSPACE/../_actions"/*/*</code> và <code>sed -n '/^runs:/,$p'</code> trên <code>action.yml</code> của checkout. Ghi lại giá trị <code>using:</code>.</li>
<li>Thêm một bước <code>env | grep -c ^GITHUB_TOKEN= || true</code> và <code>git config --get-all http.https://github.com/.extraheader | cut -c1-20</code>. So hai câu trả lời.</li>
<li>Cố ý gõ sai một input (<code>node_version</code>) rồi push. Tìm cảnh báo ở trang tóm tắt run, rồi xem Node bản nào đã được cài.</li>
<li>Chạy actionlint trên tệp hai lần: một lần action ghim theo thẻ, một lần theo SHA.</li></ol>
<p><strong>Đạt khi:</strong> bạn đọc ra được SHA mà <code>@v4</code> đã thành trong run của mình; <code>using:</code> là <code>node20</code> hoặc <code>node24</code>; số dòng <code>GITHUB_TOKEN</code> là 0 trong khi header git bắt đầu bằng <code>AUTHORIZATION: basic</code>; bạn tìm thấy cảnh báo "Unexpected input(s)" và bản Node mặc định; và actionlint chỉ bắt lỗi gõ sai ở bản ghim theo thẻ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Action</span><span class="v">Một kho (hoặc thư mục) có <code>action.yml</code>; <code>uses:</code> tải nó về và chạy nó bên trong job của bạn.</span></div>
  <div class="kv"><span class="k"><code>action.yml</code> (tệp siêu dữ liệu)</span><span class="v">Khai <code>inputs</code>, <code>outputs</code> và <code>runs:</code> — nguồn đáng tin duy nhất cho tên input.</span></div>
  <div class="kv"><span class="k"><code>runs.using</code></span><span class="v"><code>node20</code>/<code>node24</code> (JavaScript), <code>docker</code>, hoặc <code>composite</code> — quyết định mã chạy thế nào.</span></div>
  <div class="kv"><span class="k"><code>INPUT_*</code></span><span class="v">Biến môi trường runner tạo từ <code>with:</code>, tên viết hoa, giữ dấu gạch ngang.</span></div>
  <div class="kv"><span class="k">pre / main / post</span><span class="v">Ba script của JavaScript action: trước bước 1, tại bước của nó, và lúc dọn dẹp (thứ tự ngược).</span></div>
  <div class="kv"><span class="k">Set up job (dựng job)</span><span class="v">Phần log đầu tiên: thông tin runner, quyền token, và giải + tải mọi action.</span></div>
  <div class="kv"><span class="k">Mô hình tin cậy (trust model)</span><span class="v"><code>uses:</code> = chạy chương trình này với tư cách tôi. Không có hộp cát giữa một bước và phần còn lại của job.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một dòng <code>uses:</code> được đổi thành SHA, tải về dạng tarball vào <code>_actions/</code>, rồi chạy theo <code>runs.using</code> — tất cả quyết định trong Set up job, trước bước 1.</li>
<li>JavaScript action chạy bằng Node của runner trên mọi hệ điều hành; Docker action chỉ trên Linux (trên macOS: "Value cannot be null"); composite action là các bước thường.</li>
<li>Một action với tới workspace, mạng, <code>$GITHUB_ENV</code>/<code>$GITHUB_PATH</code> và — với sudo — bộ nhớ runner. <code>GITHUB_TOKEN</code> không nằm trong môi trường của nó, nhưng khoá của checkout và giá trị mặc định của input <code>token:</code> đưa nó tới rất gần.</li>
<li>Khoá <code>with:</code> thành <code>INPUT_*</code>; gõ sai tên nhận một cảnh báo vàng và giá trị mặc định của action.</li>
<li>actionlint kiểm input của action phổ biến khi ghim theo thẻ, không phải theo SHA.</li>
<li>Script <code>post</code> chạy theo thứ tự ngược; <code>pre</code> không bao giờ chạy với action cục bộ.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Metadata syntax for GitHub Actions (action.yml)</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions — tài liệu tham chiếu chính thức cho tham số vào, tham số ra, <code>runs.using</code>, và các móc <code>pre</code>/<code>post</code>. Đọc <code>action.yml</code> của một action trả lời được phần lớn câu hỏi mà README của nó không trả lời.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using third-party actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — chính GitHub phát biểu cái mô hình tin cậy mô tả bên trên, cùng khuyến nghị ghim bằng SHA commit đầy đủ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — loại thứ ba, kèm các hạn chế (không có <code>if:</code> trên bước composite ở phiên bản cũ, và khoá <code>shell:</code> là BẮT BUỘC trên mọi <code>run:</code>).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — một ảnh là hệ tệp của người khác, và FROM là một quyết định TIN CẬY</span><span class="lc-sub">/courses/docker/learn${REF} — đúng mô hình ấy ở một tầng thấp hơn, gồm cả việc vì sao "chính thức" là một bảo đảm yếu hơn một digest.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm install THẬT SỰ chạy cái gì</span><span class="lc-sub">/courses/nodejs/learn${REF} — script cài đặt, phụ thuộc bắc cầu, và tệp khoá: cùng câu hỏi chuỗi cung ứng trong chính hệ sinh thái mà bản dựng của bạn đã phụ thuộc vào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — @v4 is a pointer, not a version|||4.2 — @v4 là một CON TRỎ, không phải một phiên bản',
      slug: 'ga-4-2-ghim',
      type: 'VIDEO',
      description: 'Bằng chứng đo được: các dòng `uses:` viết 18/06/2026 và không đổi. Ngày 06/07, tệp y nguyên, log báo runtime bên dưới SÁU action đã đổi. 21/21 lượt dùng ở kho này ghim bằng thẻ major, 0 ghim bằng SHA.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2><code>@v4</code> is a pointer, not a version</h2>
<p class="lead">Everybody writes <code>actions/checkout@v4</code> and reads it as a version number. It is a git tag, tags are mutable, and the action authors move them deliberately. This lesson is the proof from this repository&#39;s own history that the thing under a pin changed while the pin did not.</p>

<h3>The inventory</h3>
${slide('ga-04', 9, 'api-backend: 21 uses, 21 on major tags, 0 on SHAs')}
<div class="out">actions/checkout@v4            7
actions/setup-node@v4          6
docker/build-push-action@v6    2
actions/cache@v4               2
docker/setup-buildx-action@v3  1
docker/login-action@v3         1
actions/upload-artifact@v4     1
actions/download-artifact@v4   1
                              21 luot dung, 8 action khac nhau

ghim bang the MAJOR (vN):     21 / 21
ghim bang the day du (vN.N.N): 0 / 21
ghim bang SHA 40 hex:          0 / 21</div>

<h3>The proof</h3>
<p>Ask git when the <code>uses:</code> lines in <code>deploy-ghcr.yml</code> were last touched, then read a run log from later:</p>

<div class="out">$ git log -S'actions/checkout@v4' -- .github/workflows/deploy-ghcr.yml
2026-06-18  c4d54ecf  feat(deploy): add GHCR registry deploy workflow (v2)
                                    ^ lan cuoi cung dong uses: doi

--- log run 28786703109, ngay 06/07/2026, TEP KHONG DOI ---
Node.js 20 is deprecated. The following actions target Node.js 20 but are
being forced to run on Node.js 24: actions/cache@v4, actions/checkout@v4,
actions/setup-node@v4, docker/build-push-action@v6, docker/login-action@v3,
docker/setup-buildx-action@v3</div>

<div class="callout warn">
<p><strong>Eighteen days, no commit, six actions running on a different Node runtime.</strong> The file says the same thing it said on 18 June. What it points at does not. That is the entire content of the distinction between pinning a <em>version</em> and pinning <em>content</em> — and it is why a workflow can go from green to red with a diff of zero lines.</p>
</div>

<h3>The same proof, one level down: where <code>v4</code> has pointed</h3>
${slide('ga-04', 10, '@v4 is a pointer: 15 different releases under one word')}
<p>The Node-runtime warning shows that what runs <em>under</em> a tag can change. The tag itself moving is even easier to see, because git keeps the answer. On 24 September 2026:</p>
<div class="out">$ gh api repos/actions/checkout/git/ref/tags/v4 --jq '.object.sha + " " + .object.type'
11d5960a326750d5838078e36cf38b85af677262 commit
$ gh api repos/actions/checkout/git/ref/tags/v4.4.0 --jq '.object.sha'
11d5960a326750d5838078e36cf38b85af677262          &lt;- v4 == v4.4.0 today
$ gh api repos/actions/checkout/tags --paginate --jq '.[].name' | grep -c '^v4\\.'
15                                                  &lt;- v4.0.0 … v4.4.0: fifteen releases, one word</div>
<table>
<thead><tr><th>Release</th><th>Commit</th><th>Date</th><th>What <code>@v4</code> users received, with no commit of their own</th></tr></thead>
<tbody>
<tr><td>v4.2.2</td><td><code>11bd719</code></td><td>23/10/2024</td><td>bug fixes</td></tr>
<tr><td>v4.3.0</td><td><code>08eba0b</code></td><td>11/08/2025</td><td>new features</td></tr>
<tr><td>v4.3.1</td><td><code>34e1148</code></td><td>13/11/2025</td><td>fixes</td></tr>
<tr><td>v4.4.0</td><td><code>11d5960</code></td><td>20/07/2026</td><td><strong>"[BREAKING] backport <code>allow-unsafe-pr-checkout</code> to v4"</strong></td></tr>
</tbody>
</table>
<p>That last row is the whole argument in one line. In June 2026 GitHub released <code>actions/checkout@v7</code>, which refuses to check out an untrusted fork&#39;s code inside <code>pull_request_target</code> and <code>workflow_run</code> (the "pwn request" pattern). Its changelog says it plainly: "Workflows pinned to a floating major tag (e.g., <code>actions/checkout@v4</code>) will automatically pick up the change." On 20 July 2026 the enforcement was backported to v4, v5 and v6 — so every repository on <code>@v4</code> got a security fix <em>and</em> a breaking change the same morning, chosen by someone else, announced in a changelog they may never have read.</p>
<div class="callout">
<p><strong>Both halves of this are true at once.</strong> For most repositories that change was pure benefit: a dangerous pattern stopped working. For a repository that really did need that pattern (and had reviewed it), CI broke with a zero-line diff. A floating tag is not "unsafe" and a SHA is not "safe" — each one decides <em>who</em> chooses the moment your CI changes. The tag lets the maintainer choose; the SHA makes you choose, and therefore obliges you to have a way of choosing (Dependabot, below).</p>
</div>
<div class="pitfall">
<p><strong>Trap — reading a tag&#39;s SHA from an annotated tag.</strong> <code>actions/checkout</code> uses lightweight tags, so <code>.object.type</code> is <code>commit</code> and <code>.object.sha</code> is the commit. Some repositories use <em>annotated</em> tags: then <code>.object.type</code> is <code>tag</code> and <code>.object.sha</code> is the tag object, not a commit — pin that and the runner cannot resolve it. Dereference with <code>gh api repos/o/r/git/tags/&lt;sha&gt; --jq .object.sha</code>, or simply copy the SHA from the "Download action repository … (SHA:…)" line of a run that used the tag.</p>
</div>

<h3>Why this is not theoretical: tj-actions/changed-files, March 2025</h3>
${slide('ga-04', 11, 'tj-actions 03/2025: moving tags was enough — over 23,000 repositories impacted')}
<p>The most-cited Actions supply-chain incident so far is recorded in GitHub&#39;s own advisory database as <a href="https://github.com/advisories/GHSA-mrrh-fwg8-r2c3" target="_blank" rel="noopener">GHSA-mrrh-fwg8-r2c3</a> (CVE-2025-30066, severity high). What the advisory states:</p>
<ul>
<li><strong>When:</strong> between 14 and 15 March 2025.</li>
<li><strong>How:</strong> attackers "retroactively modified multiple version tags to reference a malicious commit" (<code>0e58ed8671d6b60d0890c21b07f8835ace038e67</code>). The advisory lists <code>v1.0.0</code>, <code>v35.7.7-sec</code> and <code>v44.5.1</code> among the moved tags. Nobody changed a workflow file anywhere: every workflow that referenced a moved tag ran the new code on its next run.</li>
<li><strong>What the code did:</strong> downloaded a Python script that, run with <code>sudo</code>, read the memory of the <code>Runner.Worker</code> process, extracted secrets, base64-encoded them and printed them into the build log.</li>
<li><strong>Why it hurt:</strong> in public repositories, workflow logs are readable by anyone. The advisory describes the attack as impacting over 23,000 repositories.</li>
<li><strong>Who was not affected:</strong> workflows pinned to a full SHA of a clean commit. Moving a tag cannot change what a SHA names.</li>
<li><strong>Fixed in:</strong> v46.0.1.</li>
</ul>
<div class="callout warn">
<p><strong>Notice which of lesson 4.1&#39;s boundaries it went through.</strong> Not the environment: it did not need you to pass it a secret. It read the runner process — the one place that holds every secret the job uses. And it did not need a vulnerability in your code or in GitHub: it needed only that your workflow trusted a tag, and that a tag is a pointer someone else can move.</p>
</div>
<h3>The three ways to pin, and what each buys</h3>
${slide('ga-04', 12, 'Four ways to pin: who decides when your CI changes?')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>@v4</code> — major tag</span><span class="lz-lnote">a tag the maintainer <em>re-points</em> at every new v4.x release. You get bug fixes and security patches with no action from you, and you get behaviour changes the same way. This is what all 21 uses here do</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@v4.2.1</code> — full tag</span><span class="lz-lnote">normally immutable by convention — but it is still a tag, and a tag can be force-moved by anyone with write access to that repository. Better than a major tag; not a guarantee</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@a1b2c3…</code> — full commit SHA</span><span class="lz-lnote">the only form that cannot change. A SHA names content; there is no operation that makes it name different content. The cost is that you now own updating it, and an unattended pin ages into an unpatched dependency</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@main</code> — a branch</span><span class="lz-lnote">every run gets whatever was pushed most recently. There is no reason to do this for a third-party action, and it is worth grepping for once: it means a stranger&#39;s uncommitted-this-morning code runs in your job</span></div>
</div>

<div class="callout ok">
<p><strong>The honest trade, stated plainly.</strong> SHA pinning is the recommendation, and it is right for anything handling secrets or publishing artifacts. But a SHA pin with nobody updating it is a dependency frozen at a known-old version, which is its own risk — the Node 20 deprecation above is precisely the kind of thing a moving tag handled for this repository <em>for free</em>. The workable answer is SHA pins plus an updater bot (Dependabot understands Actions pins and will raise the SHA with the version in the comment). Pinning without an update mechanism swaps one risk for another rather than removing it.</p>
</div>

<h3>Pinning to a SHA, run step by step</h3>
${slide('ga-04', 13, 'A SHA must be all 40 characters — a short SHA is rejected at Set up job')}
<ol>
<li><strong>Find the SHA of the version you want</strong>, for the exact release rather than the moving major: <code>gh api repos/actions/checkout/git/ref/tags/v7.0.1 --jq .object.sha</code> → <code>3d3c42e5aac5ba805825da76410c181273ba90b1</code>.</li>
<li><strong>Write it in full, with the version as a comment:</strong>
<pre><code class="language-yaml">- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1</code></pre>
The comment is not decoration: humans read it, and Dependabot rewrites it together with the SHA.</li>
<li><strong>Push and read Set up job:</strong> <code>Download action repository 'actions/checkout@3d3c42e…' (SHA:3d3c42e…)</code> — the ref and the SHA are now the same string.</li>
<li><strong>Do not shorten it.</strong> The sandbox job <code>sha-ngan</code> used <code>@3d3c42e</code> and died in three seconds, before any step:</li>
</ol>
<div class="out">##[error]Unable to resolve action &#96;actions/checkout@3d3c42e&#96;, the provided ref &#96;3d3c42e&#96; is the shortened
version of a commit SHA, which is not supported. Please use the full commit SHA
&#96;3d3c42e5aac5ba805825da76410c181273ba90b1&#96; instead.</div>
<p>(Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">36000264372</a>.) Why the runner refuses: seven hex characters are only a prefix, and a prefix is something an attacker can try to collide with by creating commits of their own — including in a fork, whose commits are reachable through the parent repository. Forty characters name exactly one commit.</p>
<h3>What this repository should conclude</h3>
<p>Twenty-one uses of eight actions, all from <code>actions/</code> and <code>docker/</code> — the two most-scrutinised namespaces there are — all on major tags. That is a defensible position and it is not the same as a considered one. The question worth asking is per-workflow rather than global:</p>

<div class="kv-grid">
<div class="kv"><span class="k">handles <code>VPS_SSH_PRIVATE_KEY</code></span><span class="v">this is the sharp end: nine uses of that secret across the deploy workflows. An action running in those jobs can read a key that opens a production server. These are the ones to SHA-pin first</span></div>
<div class="kv"><span class="k">publishes to GHCR or Releases</span><span class="v"><code>docker/login-action</code> and <code>docker/build-push-action</code> hold registry credentials and push artifacts users install. Same reasoning</span></div>
<div class="kv"><span class="k">runs on <code>pull_request</code> only</span><span class="v"><code>ci-lint.yml</code> — no secrets, read-only token, nothing published. A major tag here is a reasonable trade for free upkeep</span></div>
<div class="kv"><span class="k">the thing that makes it tractable</span><span class="v">there are eight distinct actions, not eighty. This is a twenty-minute change, and the inventory above is the whole worklist</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — pinning the action but not what the action downloads.</strong> A SHA-pinned <code>setup-node</code> still fetches a Node distribution over the network at run time; a SHA-pinned <code>checkout</code> still fetches your repository. Pinning the action fixes <em>the code that runs</em>, not <em>everything that code brings in</em>. This is not an argument against pinning — it is an argument against treating a pinned <code>uses:</code> as a completed security task. The install step immediately after it is usually the bigger surface, and that one is governed by your lockfile.</p>
</div>

<h3>Keeping SHA pins alive: Dependabot, and the organisation policy</h3>
${slide('ga-04', 14, 'SHA pins only last with Dependabot updating them')}
<p>The honest trade above ends with "SHA pins plus an updater bot". Concretely, that is one file on the default branch:</p>
<pre><code class="language-yaml"># .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: github-actions   # reads every uses: in .github/workflows (and .github/actions)
    directory: /
    schedule:
      interval: weekly
    groups:
      actions:
        patterns: ["*"]                  # one PR per week for all actions, not eight</code></pre>
<p>Dependabot then opens pull requests that change <code>@&lt;old SHA&gt; # v7.0.0</code> into <code>@&lt;new SHA&gt; # v7.0.1</code>, with the release notes in the description. The difference from a floating tag is exactly one human click: the update arrives, CI runs on it, somebody reads the notes — the v4.4.0 "[BREAKING]" line would have been in that PR — and then merges.</p>
<p>Since August 2025 the repository and organisation settings for Actions can also <strong>require</strong> full-SHA pinning (a workflow that uses a tag is then blocked from running), and can block a specific action or version outright with a <code>!</code> prefix in the allowed-actions list — the tool you want the morning an advisory like tj-actions lands. These are settings, not YAML; on a team, they are how "we pin by SHA" stops depending on everyone remembering.</p>
<table>
<thead><tr><th>When</th><th>Pin style</th></tr></thead>
<tbody>
<tr><td>Job holds deploy keys, registry credentials, or publishes releases</td><td>Full SHA + comment + Dependabot. No exceptions.</td></tr>
<tr><td>Third-party action from a small maintainer</td><td>Full SHA — and read the source once; it is usually short.</td></tr>
<tr><td><code>actions/*</code> in a read-only CI job with no secrets</td><td>Major tag is defensible; SHA + Dependabot is better and costs one file.</td></tr>
<tr><td>A throw-away experiment</td><td>Whatever — but never <code>@main</code> in anything you keep.</td></tr>
</tbody>
</table>
<h3>The one thing to do today</h3>
<p>Regardless of the pinning decision, one grep is worth running on any repository:</p>

<pre><code><span class="tok-comment"># co action nao ghim vao mot NHANH khong?</span>
grep -rn "uses:.*@\\(main\\|master\\|develop\\)" .github/workflows/

<span class="tok-comment"># kiem ke: dung nhung gi, ghim kieu gi</span>
grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c | sort -rn</code></pre>

<div class="callout">
<p><strong>The second command produced the table at the top of this lesson.</strong> It takes a second to run and most people have never run it on their own repository — which means most people cannot say how many distinct third parties execute code in their CI. Eight, here. Knowing the number is the prerequisite for having an opinion about it.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>@v4</code> is a pointer somebody else moves, and the measured consequence in this repository is six actions changing runtime under an unchanged file — so the choice is not "pin or not" but "who do you want deciding when your CI changes, and do you have a way to decide it on time".</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Why pin actions to a commit SHA instead of <code>@v4</code>?</strong><br>A: A tag is a movable pointer: the maintainer — or an attacker who gains write access — can re-point it and every workflow using it runs new code on its next run. In March 2025 that is exactly how tj-actions/changed-files leaked secrets from thousands of repositories. A full 40-character SHA always names the same content. The cost is updates, so I pair it with Dependabot and a version comment.</p>
<p><strong>Q: Doesn&#39;t SHA pinning mean you miss security fixes?</strong><br>A: Only without an update mechanism. With Dependabot you get a PR for each release, CI runs on it, and you merge after reading the notes — so you get the fix, but you also see breaking changes such as checkout v4.4.0&#39;s before they reach main.</p>
<p><strong>Q: A workflow uses <code>actions/checkout@8e5e7e5</code>. Is that pinned?</strong><br>A: It does not even run — the runner rejects short SHAs at Set up job. Pinning means all 40 characters.</p>
<p><strong>Q: How would you respond if an action you use is reported compromised?</strong><br>A: Find every use (<code>grep -rn "uses: owner/action" .github/</code>, or code search across the org), block it via the org&#39;s allowed-actions policy, check run logs in the affected window for leaked data, rotate every secret those jobs could reach, and move to a SHA of a verified clean version.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team lead asks "are we exposed to a tj-actions-style attack?" Answer with an inventory and a fix, not an opinion.</p><ol>
<li>Run the inventory command on your own repository: <code>grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c | sort -rn</code>. Count uses, distinct actions, and how many are SHA-pinned.</li>
<li>For each tag you use, find today&#39;s SHA: <code>gh api repos/&lt;owner&gt;/&lt;repo&gt;/git/ref/tags/&lt;tag&gt; --jq .object</code>. Note any whose <code>type</code> is <code>tag</code> (annotated).</li>
<li>Pin one workflow fully: replace each <code>@vN</code> with the 40-character SHA of the exact release, plus <code># vX.Y.Z</code>.</li>
<li>Add <code>.github/dependabot.yml</code> with the <code>github-actions</code> ecosystem (merge it to the default branch — Dependabot reads it only there).</li>
<li>On a branch, change one SHA to its first 7 characters and push. Read the error, then revert.</li></ol>
<p><strong>Done when:</strong> you have a written table (action → uses → pin style → current SHA); one workflow runs green with only full SHAs and its Set up job lines show <code>(SHA:…)</code> equal to the ref; the short-SHA run failed with "shortened version of a commit SHA"; and the Dependabot tab of your repository lists the <code>github-actions</code> ecosystem.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tag (thẻ)</span><span class="v">A named pointer to a commit. Mutable: can be re-pointed or force-moved by anyone with write access.</span></div>
  <div class="kv"><span class="k">Major tag (<code>v4</code>)</span><span class="v">A tag the maintainer deliberately moves to each new v4.x release.</span></div>
  <div class="kv"><span class="k">Full commit SHA</span><span class="v">40 hex characters naming exactly one commit&#39;s content. The only immutable pin.</span></div>
  <div class="kv"><span class="k">Lightweight / annotated tag</span><span class="v">Lightweight points straight at a commit; annotated points at a tag object you must dereference.</span></div>
  <div class="kv"><span class="k">Supply-chain attack</span><span class="v">Compromising something you depend on (an action) instead of attacking you directly.</span></div>
  <div class="kv"><span class="k">Dependabot (<code>github-actions</code>)</span><span class="v">Bot that opens PRs to bump action pins, updating the SHA and the version comment together.</span></div>
  <div class="kv"><span class="k">Allowed-actions policy</span><span class="v">Repo/org setting: which actions may run, block with <code>!</code>, and (since 08/2025) require SHA pinning.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>@v4</code> is a pointer: 15 checkout releases have lived under it, and the latest (20/07/2026) was marked [BREAKING].</li>
<li>tj-actions/changed-files (03/2025) re-pointed tags to a malicious commit; workflows on tags leaked secrets into public logs, SHA-pinned ones did not.</li>
<li>Pin with the full 40-character SHA plus <code># vX.Y.Z</code>; short SHAs are rejected at Set up job.</li>
<li>A SHA pin without an updater ages into an unpatched dependency — add Dependabot for <code>github-actions</code>.</li>
<li>Organisations can require SHA pinning and block specific actions in settings.</li>
<li>Pinning the action does not pin what it downloads (Node, npm packages) — that is the lockfile&#39;s job.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: pin actions to a full length commit SHA</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — the recommendation, and the explicit statement that tags and branches are mutable references.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your actions up to date with Dependabot</span><span class="lc-sub">docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot — the update mechanism that makes SHA pinning sustainable, including how it writes the version as a trailing comment.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — deprecation of Node 20 on Actions runners</span><span class="lc-sub">github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ — the announcement behind the warning measured above, and the <code>ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION</code> escape hatch it names.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — tag versus digest, and why :latest is not a version</span><span class="lc-sub">/courses/docker/learn${REF} — exactly this lesson in the container registry, including the case where re-pulling the same tag produced a different image and the build was green either way.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — tags are mutable, and what a SHA actually names</span><span class="lc-sub">/courses/git/learn${REF} — why a tag can be moved, what a force-push to a tag looks like from the outside, and why a commit hash is the only stable name git has.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2><code>@v4</code> là một CON TRỎ, không phải một phiên bản</h2>
<p class="lead">Ai cũng viết <code>actions/checkout@v4</code> và đọc nó thành một số hiệu phiên bản. Nó là một cái THẺ git, thẻ thì SỬA ĐƯỢC, và tác giả action dời chúng một cách có chủ ý. Bài này là bằng chứng lấy từ chính lịch sử kho này rằng thứ nằm dưới một cái ghim đã đổi trong khi cái ghim thì không.</p>

<h3>Kiểm kê</h3>
${slide('ga-04', 9, 'api-backend: 21 lượt uses:, 21 ghim thẻ major, 0 ghim SHA')}
<div class="out">actions/checkout@v4            7
actions/setup-node@v4          6
docker/build-push-action@v6    2
actions/cache@v4               2
docker/setup-buildx-action@v3  1
docker/login-action@v3         1
actions/upload-artifact@v4     1
actions/download-artifact@v4   1
                              21 luot dung, 8 action khac nhau

ghim bang the MAJOR (vN):     21 / 21
ghim bang the day du (vN.N.N): 0 / 21
ghim bang SHA 40 hex:          0 / 21</div>

<h3>Bằng chứng</h3>
<p>Hỏi git xem các dòng <code>uses:</code> trong <code>deploy-ghcr.yml</code> đổi lần cuối khi nào, rồi đọc một log lần chạy MUỘN HƠN:</p>

<div class="out">$ git log -S'actions/checkout@v4' -- .github/workflows/deploy-ghcr.yml
2026-06-18  c4d54ecf  feat(deploy): add GHCR registry deploy workflow (v2)
                                    ^ lan cuoi cung dong uses: doi

--- log run 28786703109, ngay 06/07/2026, TEP KHONG DOI ---
Node.js 20 is deprecated. The following actions target Node.js 20 but are
being forced to run on Node.js 24: actions/cache@v4, actions/checkout@v4,
actions/setup-node@v4, docker/build-push-action@v6, docker/login-action@v3,
docker/setup-buildx-action@v3</div>

<div class="callout warn">
<p><strong>Mười tám ngày, không một commit, sáu action chạy trên một runtime Node khác.</strong> Tệp vẫn nói đúng điều nó đã nói hôm 18 tháng Sáu. Thứ nó TRỎ TỚI thì không. Đó là toàn bộ nội dung của chỗ phân biệt giữa ghim một <em>PHIÊN BẢN</em> và ghim <em>NỘI DUNG</em> — và đó là lý do một workflow đi từ xanh sang đỏ với một diff bằng không dòng.</p>
</div>

<h3>Cùng bằng chứng ấy, xuống một tầng: <code>v4</code> đã trỏ vào đâu</h3>
${slide('ga-04', 10, '@v4 là con trỏ: 15 bản phát hành khác nhau, cùng một chữ “v4”')}
<p>Cảnh báo về runtime Node cho thấy thứ chạy <em>BÊN DƯỚI</em> một cái thẻ có thể đổi. Còn chính cái thẻ dời chỗ thì càng dễ thấy, vì git giữ câu trả lời. Ngày 24/09/2026:</p>
<div class="out">$ gh api repos/actions/checkout/git/ref/tags/v4 --jq '.object.sha + " " + .object.type'
11d5960a326750d5838078e36cf38b85af677262 commit
$ gh api repos/actions/checkout/git/ref/tags/v4.4.0 --jq '.object.sha'
11d5960a326750d5838078e36cf38b85af677262          &lt;- hôm nay v4 == v4.4.0
$ gh api repos/actions/checkout/tags --paginate --jq '.[].name' | grep -c '^v4\\.'
15                                                  &lt;- v4.0.0 … v4.4.0: mười lăm bản, một chữ</div>
<table>
<thead><tr><th>Bản</th><th>Commit</th><th>Ngày</th><th>Người dùng <code>@v4</code> nhận được gì, không cần commit nào của họ</th></tr></thead>
<tbody>
<tr><td>v4.2.2</td><td><code>11bd719</code></td><td>23/10/2024</td><td>sửa lỗi</td></tr>
<tr><td>v4.3.0</td><td><code>08eba0b</code></td><td>11/08/2025</td><td>tính năng mới</td></tr>
<tr><td>v4.3.1</td><td><code>34e1148</code></td><td>13/11/2025</td><td>sửa lỗi</td></tr>
<tr><td>v4.4.0</td><td><code>11d5960</code></td><td>20/07/2026</td><td><strong>"[BREAKING] backport <code>allow-unsafe-pr-checkout</code> to v4"</strong></td></tr>
</tbody>
</table>
<p>Hàng cuối là cả lập luận gói trong một dòng. Tháng 6/2026 GitHub phát hành <code>actions/checkout@v7</code>, bản TỪ CHỐI checkout mã của một fork không tin được bên trong <code>pull_request_target</code> và <code>workflow_run</code> (kiểu "pwn request"). Changelog của họ nói thẳng: "Workflows pinned to a floating major tag (e.g., <code>actions/checkout@v4</code>) will automatically pick up the change." Ngày 20/07/2026 phần chặn ấy được đưa ngược về v4, v5 và v6 — nên mọi kho đang ở <code>@v4</code> nhận MỘT bản vá bảo mật <em>VÀ</em> một thay đổi phá vỡ trong cùng một buổi sáng, do người khác chọn, được báo trong một changelog có thể họ chưa bao giờ đọc.</p>
<div class="callout">
<p><strong>Cả hai nửa đều đúng cùng lúc.</strong> Với phần lớn các kho, thay đổi ấy thuần lợi: một kiểu viết nguy hiểm thôi chạy được. Với một kho THẬT SỰ cần kiểu viết đó (và đã rà soát nó), CI vỡ với một diff không dòng nào. Thẻ di động không "nguy hiểm" và SHA không "an toàn" — mỗi cái quyết định <em>AI</em> chọn thời điểm CI của bạn thay đổi. Thẻ để người bảo trì chọn; SHA bắt bạn chọn, và vì thế buộc bạn phải có cách để chọn (Dependabot, bên dưới).</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — đọc SHA của một thẻ CÓ CHÚ THÍCH (annotated).</strong> <code>actions/checkout</code> dùng thẻ nhẹ (lightweight), nên <code>.object.type</code> là <code>commit</code> và <code>.object.sha</code> chính là commit. Có kho dùng thẻ <em>CÓ CHÚ THÍCH</em>: khi đó <code>.object.type</code> là <code>tag</code> và <code>.object.sha</code> là đối tượng thẻ, không phải commit — ghim cái đó thì runner không giải được. Dò tiếp bằng <code>gh api repos/o/r/git/tags/&lt;sha&gt; --jq .object.sha</code>, hoặc đơn giản chép SHA từ dòng "Download action repository … (SHA:…)" của một run đã dùng thẻ đó.</p>
</div>

<h3>Vì sao chuyện này không phải lý thuyết: tj-actions/changed-files, tháng 3/2025</h3>
${slide('ga-04', 11, 'tj-actions 03/2025: dời thẻ, hơn 23.000 kho bị ảnh hưởng')}
<p>Sự cố chuỗi cung ứng (supply chain) của Actions được nhắc nhiều nhất tới nay được ghi trong chính cơ sở dữ liệu cảnh báo của GitHub: <a href="https://github.com/advisories/GHSA-mrrh-fwg8-r2c3" target="_blank" rel="noopener">GHSA-mrrh-fwg8-r2c3</a> (CVE-2025-30066, mức nghiêm trọng high). Những gì advisory ghi:</p>
<ul>
<li><strong>Khi nào:</strong> giữa ngày 14 và 15/03/2025.</li>
<li><strong>Thế nào:</strong> kẻ tấn công "retroactively modified multiple version tags to reference a malicious commit" — dời NGƯỢC nhiều thẻ phiên bản cũ trỏ vào một commit độc (<code>0e58ed8671d6b60d0890c21b07f8835ace038e67</code>). Advisory liệt kê <code>v1.0.0</code>, <code>v35.7.7-sec</code> và <code>v44.5.1</code> trong số các thẻ bị dời. Không ai sửa tệp workflow nào ở đâu cả: mọi workflow tham chiếu một thẻ bị dời đều chạy mã mới ở lần chạy kế tiếp.</li>
<li><strong>Mã ấy làm gì:</strong> tải một script Python, chạy bằng <code>sudo</code>, đọc bộ nhớ của tiến trình <code>Runner.Worker</code>, rút secret ra, mã hoá base64 rồi IN vào log của bản dựng.</li>
<li><strong>Vì sao đau:</strong> ở kho công khai, log workflow ai cũng đọc được. Advisory mô tả vụ tấn công ảnh hưởng tới hơn 23.000 kho.</li>
<li><strong>Ai KHÔNG bị:</strong> các workflow ghim SHA đầy đủ của một commit sạch. Dời thẻ không đổi được thứ mà một SHA gọi tên.</li>
<li><strong>Bản vá:</strong> v46.0.1.</li>
</ul>
<div class="callout warn">
<p><strong>Để ý nó đi xuyên qua ranh giới nào trong bài 4.1.</strong> Không phải biến môi trường: nó chẳng cần bạn truyền secret cho nó. Nó đọc tiến trình runner — nơi duy nhất giữ MỌI secret mà job dùng. Và nó không cần lỗ hổng nào trong mã của bạn hay của GitHub: nó chỉ cần workflow của bạn tin một cái thẻ, và một cái thẻ là con trỏ mà người khác dời được.</p>
</div>
<h3>Ba cách ghim, và mỗi cách mua được gì</h3>
${slide('ga-04', 12, 'Bốn cách ghim: ai quyết định khi nào CI của bạn đổi?')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>@v4</code> — thẻ major</span><span class="lz-lnote">một cái thẻ mà người bảo trì <em>TRỎ LẠI</em> ở mỗi bản v4.x mới. Bạn nhận vá lỗi và vá bảo mật mà không phải làm gì, và bạn nhận thay đổi hành vi theo đúng cách ấy. Đây là thứ cả 21 lượt dùng ở đây đang làm</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@v4.2.1</code> — thẻ đầy đủ</span><span class="lz-lnote">bình thường thì bất biến theo quy ước — nhưng nó VẪN là một cái thẻ, và một cái thẻ thì ai có quyền ghi vào kho ấy cũng dời cưỡng bức được. Tốt hơn thẻ major; không phải một bảo đảm</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@a1b2c3…</code> — SHA commit đầy đủ</span><span class="lz-lnote">dạng DUY NHẤT không đổi được. Một SHA gọi tên NỘI DUNG; không có thao tác nào khiến nó gọi tên một nội dung khác. Cái giá là giờ bạn sở hữu việc cập nhật nó, và một cái ghim không ai trông thì già đi thành một phụ thuộc chưa vá</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@main</code> — một nhánh</span><span class="lz-lnote">mỗi lần chạy nhận bất cứ thứ gì vừa được đẩy lên gần nhất. Không có lý do gì làm thế với một action của bên thứ ba, và đáng grep tìm một lần: nó nghĩa là mã người lạ vừa gõ sáng nay chạy trong job của bạn</span></div>
</div>

<div class="callout ok">
<p><strong>Sự đánh đổi thật, nói cho thẳng.</strong> Ghim bằng SHA là khuyến nghị, và nó đúng cho bất cứ thứ gì cầm bí mật hay công bố sản phẩm. Nhưng một cái ghim SHA mà không ai cập nhật là một phụ thuộc đông cứng ở một phiên bản đã cũ có tiếng, và đó là một rủi ro của riêng nó — cái deprecation Node 20 bên trên chính xác là kiểu chuyện mà một cái thẻ di động đã xử lý cho kho này <em>MIỄN PHÍ</em>. Đáp án làm được là ghim SHA CỘNG một bot cập nhật (Dependabot hiểu cách ghim của Actions và sẽ nâng SHA kèm số phiên bản trong bình luận). Ghim mà không có cơ chế cập nhật là đổi rủi ro này lấy rủi ro khác chứ không phải gỡ bỏ nó.</p>
</div>

<h3>Ghim bằng SHA, chạy thử từng bước</h3>
${slide('ga-04', 13, 'SHA phải đủ 40 ký tự — SHA ngắn bị từ chối ngay ở Set up job')}
<ol>
<li><strong>Tìm SHA của bản bạn muốn</strong>, theo bản phát hành CHÍNH XÁC chứ không theo major đang di động: <code>gh api repos/actions/checkout/git/ref/tags/v7.0.1 --jq .object.sha</code> → <code>3d3c42e5aac5ba805825da76410c181273ba90b1</code>.</li>
<li><strong>Viết đủ, kèm phiên bản trong chú thích:</strong>
<pre><code class="language-yaml">- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1</code></pre>
Chú thích không phải để trang trí: người đọc nó, và Dependabot viết lại nó CÙNG với SHA.</li>
<li><strong>Push rồi đọc Set up job:</strong> <code>Download action repository 'actions/checkout@3d3c42e…' (SHA:3d3c42e…)</code> — giờ ref và SHA là cùng một chuỗi.</li>
<li><strong>Đừng rút gọn.</strong> Job <code>sha-ngan</code> trên sân tập dùng <code>@3d3c42e</code> và chết sau ba giây, trước mọi bước:</li>
</ol>
<div class="out">##[error]Unable to resolve action &#96;actions/checkout@3d3c42e&#96;, the provided ref &#96;3d3c42e&#96; is the shortened
version of a commit SHA, which is not supported. Please use the full commit SHA
&#96;3d3c42e5aac5ba805825da76410c181273ba90b1&#96; instead.</div>
<p>(Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">36000264372</a>.) Vì sao runner từ chối: bảy ký tự hex chỉ là một TIỀN TỐ, và tiền tố là thứ kẻ tấn công có thể cố tạo trùng bằng commit của chính họ — kể cả trong một fork, vì commit của fork với tới được qua kho gốc. Bốn mươi ký tự thì gọi tên đúng một commit.</p>
<h3>Kho này nên kết luận gì</h3>
<p>Hai mươi mốt lượt dùng của tám action, tất cả từ <code>actions/</code> và <code>docker/</code> — hai không gian tên bị soi kỹ nhất trên đời — tất cả trên thẻ major. Đó là một vị thế bảo vệ được, mà nó không đồng nghĩa với một vị thế ĐÃ CÂN NHẮC. Câu hỏi đáng hỏi là theo từng workflow chứ không phải trên tổng thể:</p>

<div class="kv-grid">
<div class="kv"><span class="k">có cầm <code>VPS_SSH_PRIVATE_KEY</code></span><span class="v">đây là đầu nhọn: chín lượt dùng bí mật ấy rải khắp các workflow deploy. Một action chạy trong mấy job đó đọc được một cái khoá mở được máy chủ production. Đây là những cái nên ghim SHA TRƯỚC TIÊN</span></div>
<div class="kv"><span class="k">có đẩy lên GHCR hoặc Releases</span><span class="v"><code>docker/login-action</code> và <code>docker/build-push-action</code> giữ thông tin đăng nhập registry và đẩy lên những sản phẩm người dùng đem cài. Cùng lý lẽ</span></div>
<div class="kv"><span class="k">chỉ chạy trên <code>pull_request</code></span><span class="v"><code>ci-lint.yml</code> — không bí mật, token chỉ đọc, không công bố gì. Một cái thẻ major ở đây là một đánh đổi hợp lý lấy phần bảo trì miễn phí</span></div>
<div class="kv"><span class="k">thứ khiến việc này làm được</span><span class="v">có TÁM action khác nhau, không phải tám mươi. Đây là một thay đổi hai mươi phút, và cái bảng kiểm kê bên trên là trọn danh sách việc</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — ghim action nhưng không ghim thứ action TẢI VỀ.</strong> Một <code>setup-node</code> ghim SHA vẫn kéo một bản phân phối Node qua mạng lúc chạy; một <code>checkout</code> ghim SHA vẫn kéo kho của bạn về. Ghim action cố định <em>MÃ ĐANG CHẠY</em>, không cố định <em>MỌI THỨ MÃ ẤY MANG VÀO</em>. Đây không phải lập luận chống lại việc ghim — nó là lập luận chống lại việc coi một <code>uses:</code> đã ghim là một nhiệm vụ bảo mật đã xong. Cái bước cài đặt ngay sau đó thường là bề mặt lớn hơn, và cái đó thì do tệp khoá của bạn cai quản.</p>
</div>

<h3>Giữ cho ghim SHA sống: Dependabot, và chính sách của tổ chức</h3>
${slide('ga-04', 14, 'Ghim SHA chỉ bền khi có Dependabot cập nhật giùm')}
<p>Cuộc đánh đổi trung thực ở trên kết thúc bằng "ghim SHA cộng một con bot cập nhật". Cụ thể, đó là một tệp trên nhánh mặc định:</p>
<pre><code class="language-yaml"># .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: github-actions   # đọc mọi uses: trong .github/workflows (và .github/actions)
    directory: /
    schedule:
      interval: weekly
    groups:
      actions:
        patterns: ["*"]                  # mỗi tuần MỘT PR cho mọi action, không phải tám</code></pre>
<p>Rồi Dependabot mở pull request đổi <code>@&lt;SHA cũ&gt; # v7.0.0</code> thành <code>@&lt;SHA mới&gt; # v7.0.1</code>, kèm ghi chú phát hành trong mô tả. Khác biệt so với thẻ di động đúng bằng một cú bấm của người: bản cập nhật tới, CI chạy trên nó, có người đọc ghi chú — dòng "[BREAKING]" của v4.4.0 sẽ nằm trong PR đó — rồi mới merge.</p>
<p>Từ 08/2025, cài đặt Actions của kho và tổ chức còn <strong>BẮT BUỘC</strong> được việc ghim SHA đầy đủ (workflow dùng thẻ khi ấy bị chặn không chạy), và chặn hẳn được một action hay một phiên bản bằng tiền tố <code>!</code> trong danh sách action được phép — đúng công cụ bạn cần vào buổi sáng một advisory kiểu tj-actions xuất hiện. Đây là CÀI ĐẶT, không phải YAML; trong một đội, chúng là cách để "chúng ta ghim SHA" thôi phụ thuộc vào trí nhớ của từng người.</p>
<table>
<thead><tr><th>Khi</th><th>Kiểu ghim</th></tr></thead>
<tbody>
<tr><td>Job giữ khoá deploy, thông tin đăng nhập registry, hoặc phát hành bản cài</td><td>SHA đầy đủ + chú thích + Dependabot. Không ngoại lệ.</td></tr>
<tr><td>Action bên thứ ba của một người bảo trì nhỏ</td><td>SHA đầy đủ — và đọc mã nguồn một lần; thường nó ngắn.</td></tr>
<tr><td><code>actions/*</code> trong job CI chỉ đọc, không có secret</td><td>Thẻ major chấp nhận được; SHA + Dependabot tốt hơn và chỉ tốn một tệp.</td></tr>
<tr><td>Một thử nghiệm dùng xong bỏ</td><td>Tuỳ — nhưng đừng bao giờ <code>@main</code> trong thứ bạn giữ lại.</td></tr>
</tbody>
</table>
<h3>Một việc nên làm ngay hôm nay</h3>
<p>Bất kể quyết định về ghim thế nào, có một lệnh grep đáng chạy trên bất kỳ kho nào:</p>

<pre><code><span class="tok-comment"># co action nao ghim vao mot NHANH khong?</span>
grep -rn "uses:.*@\\(main\\|master\\|develop\\)" .github/workflows/

<span class="tok-comment"># kiem ke: dung nhung gi, ghim kieu gi</span>
grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c | sort -rn</code></pre>

<div class="callout">
<p><strong>Lệnh thứ hai đẻ ra cái bảng ở đầu bài này.</strong> Nó chạy hết một giây và phần lớn người ta chưa bao giờ chạy nó trên kho của chính mình — nghĩa là phần lớn người ta không nói được có bao nhiêu bên thứ ba khác nhau đang chạy mã trong CI của họ. Ở đây là tám. Biết con số ấy là điều kiện tiên quyết để có một quan điểm về nó.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>@v4</code> là một con trỏ mà người khác dời, và hệ quả đo được ở kho này là sáu action đổi runtime dưới một cái tệp không đổi — nên lựa chọn không phải "ghim hay không ghim" mà là "bạn muốn AI quyết định lúc nào CI của bạn thay đổi, và bạn có cách để tự quyết đúng lúc hay không".</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Vì sao ghim action bằng SHA commit thay vì <code>@v4</code>?</strong><br>Đ: Thẻ là con trỏ dời được: người bảo trì — hay kẻ tấn công chiếm được quyền ghi — trỏ lại nó, và mọi workflow dùng nó chạy mã mới ở lần kế. Tháng 3/2025 đó đúng là cách tj-actions/changed-files làm lộ secret của hàng nghìn kho. SHA đầy đủ 40 ký tự luôn gọi tên cùng một nội dung. Cái giá là việc cập nhật, nên tôi đi kèm Dependabot và chú thích phiên bản.</p>
<p><strong>H: Ghim SHA chẳng phải là bỏ lỡ bản vá bảo mật sao?</strong><br>Đ: Chỉ khi không có cơ chế cập nhật. Có Dependabot thì mỗi bản phát hành thành một PR, CI chạy trên nó, và tôi merge sau khi đọc ghi chú — nên vẫn nhận bản vá, mà còn THẤY được các thay đổi phá vỡ như checkout v4.4.0 trước khi chúng vào main.</p>
<p><strong>H: Một workflow dùng <code>actions/checkout@8e5e7e5</code>. Vậy là đã ghim chưa?</strong><br>Đ: Nó còn không chạy được — runner từ chối SHA ngắn ngay ở Set up job. Ghim nghĩa là đủ 40 ký tự.</p>
<p><strong>H: Nếu một action bạn đang dùng bị báo là đã bị chiếm, bạn làm gì?</strong><br>Đ: Tìm mọi chỗ dùng (<code>grep -rn "uses: owner/action" .github/</code>, hoặc code search toàn tổ chức), chặn nó bằng chính sách action được phép của tổ chức, soát log các run trong khoảng thời gian bị ảnh hưởng xem có dữ liệu lộ không, xoay (rotate) mọi secret mà các job đó với tới, rồi chuyển sang SHA của một bản sạch đã kiểm.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trưởng nhóm hỏi "mình có dính kiểu tấn công như tj-actions không?". Trả lời bằng một bản kiểm kê và một bản sửa, không bằng ý kiến.</p><ol>
<li>Chạy lệnh kiểm kê trên kho của bạn: <code>grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c | sort -rn</code>. Đếm số lượt dùng, số action khác nhau, và bao nhiêu cái ghim SHA.</li>
<li>Với mỗi thẻ bạn dùng, tìm SHA hôm nay: <code>gh api repos/&lt;owner&gt;/&lt;repo&gt;/git/ref/tags/&lt;the&gt; --jq .object</code>. Ghi lại cái nào có <code>type</code> là <code>tag</code> (thẻ có chú thích).</li>
<li>Ghim trọn một workflow: thay mỗi <code>@vN</code> bằng SHA 40 ký tự của bản phát hành chính xác, kèm <code># vX.Y.Z</code>.</li>
<li>Thêm <code>.github/dependabot.yml</code> với hệ <code>github-actions</code> (merge vào nhánh mặc định — Dependabot chỉ đọc nó ở đó).</li>
<li>Trên một nhánh, đổi một SHA thành 7 ký tự đầu rồi push. Đọc lỗi, rồi hoàn lại.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một bảng viết ra (action → số lượt → kiểu ghim → SHA hiện tại); một workflow chạy xanh chỉ với SHA đầy đủ và các dòng Set up job của nó cho thấy <code>(SHA:…)</code> trùng với ref; run SHA ngắn hỏng với "shortened version of a commit SHA"; và tab Dependabot của kho liệt kê hệ <code>github-actions</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tag (thẻ)</span><span class="v">Một con trỏ có tên tới một commit. SỬA ĐƯỢC: ai có quyền ghi đều trỏ lại hoặc ép dời được.</span></div>
  <div class="kv"><span class="k">Thẻ major (<code>v4</code>)</span><span class="v">Thẻ mà người bảo trì CỐ Ý dời sang mỗi bản v4.x mới.</span></div>
  <div class="kv"><span class="k">SHA commit đầy đủ</span><span class="v">40 ký tự hex gọi tên đúng nội dung của một commit. Cách ghim duy nhất không đổi được.</span></div>
  <div class="kv"><span class="k">Thẻ nhẹ / thẻ có chú thích</span><span class="v">Thẻ nhẹ trỏ thẳng vào commit; thẻ có chú thích trỏ vào một đối tượng thẻ, phải dò tiếp.</span></div>
  <div class="kv"><span class="k">Tấn công chuỗi cung ứng</span><span class="v">Chiếm một thứ bạn phụ thuộc vào (một action) thay vì tấn công thẳng bạn.</span></div>
  <div class="kv"><span class="k">Dependabot (<code>github-actions</code>)</span><span class="v">Bot mở PR nâng bản ghim của action, sửa SHA và chú thích phiên bản cùng lúc.</span></div>
  <div class="kv"><span class="k">Chính sách action được phép</span><span class="v">Cài đặt kho/tổ chức: action nào được chạy, chặn bằng <code>!</code>, và (từ 08/2025) bắt buộc ghim SHA.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>@v4</code> là con trỏ: 15 bản phát hành của checkout đã nằm dưới nó, bản mới nhất (20/07/2026) ghi [BREAKING].</li>
<li>tj-actions/changed-files (03/2025) dời thẻ sang commit độc; workflow ghim thẻ làm lộ secret ra log công khai, workflow ghim SHA thì không.</li>
<li>Ghim bằng SHA đủ 40 ký tự cộng <code># vX.Y.Z</code>; SHA ngắn bị từ chối ngay ở Set up job.</li>
<li>Ghim SHA mà không có ai cập nhật sẽ già thành một phụ thuộc chưa vá — thêm Dependabot cho <code>github-actions</code>.</li>
<li>Tổ chức bắt buộc được việc ghim SHA và chặn từng action cụ thể trong cài đặt.</li>
<li>Ghim action không ghim thứ action tải về (Node, gói npm) — đó là việc của lockfile.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: ghim action bằng SHA commit đầy đủ</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — khuyến nghị, và phát biểu tường minh rằng thẻ và nhánh là những tham chiếu SỬA ĐƯỢC.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your actions up to date with Dependabot</span><span class="lc-sub">docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot — cơ chế cập nhật khiến việc ghim SHA duy trì được, gồm cả cách nó ghi số phiên bản thành một bình luận cuối dòng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — khai tử Node 20 trên runner của Actions</span><span class="lc-sub">github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ — thông báo đứng sau cái cảnh báo đã đo bên trên, và lối thoát <code>ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION</code> mà nó nêu tên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — thẻ với digest, và vì sao :latest không phải một phiên bản</span><span class="lc-sub">/courses/docker/learn${REF} — đúng bài học này trong registry container, gồm cả ca mà kéo lại cùng một cái thẻ ra một cái ảnh khác và bản dựng thì xanh trong cả hai lần.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — thẻ SỬA ĐƯỢC, và một SHA thật ra gọi tên cái gì</span><span class="lc-sub">/courses/git/learn${REF} — vì sao một cái thẻ dời được, một cú đẩy cưỡng bức lên thẻ nhìn từ ngoài ra sao, và vì sao một mã băm commit là cái tên ỔN ĐỊNH duy nhất mà git có.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — checkout, and the shallow clone that saves almost nothing|||4.3 — checkout, và cú clone nông gần như không tiết kiệm gì',
      slug: 'ga-4-3-checkout',
      type: 'VIDEO',
      description: 'Đo ba lượt mỗi cách trên chính kho này: `fetch-depth: 0` chỉ tốn thêm 1,9 giây và 40MB so với mặc định. Và `--filter=blob:none` cho TRỌN 2.515 commit với +1 giây, +4MB. Cộng chuyện checkout GHI khoá xác thực vào .git/config.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2><code>checkout</code>, and the shallow clone that saves almost nothing</h2>
<p class="lead">Seven of this repository&#39;s twenty-one action uses are <code>actions/checkout</code>, which makes it the one worth knowing properly. Two of its behaviours are load-bearing and neither is obvious from the two lines you write.</p>

<h3>What checkout actually does, read from its own log</h3>
${slide('ga-04', 16, 'The stages of one checkout, read from the log')}
<p>Two lines of YAML hide about forty git commands. Expand the checkout step of any run and they are all there, prefixed with <code>[command]</code>. From the sandbox (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000261745" target="_blank" rel="noopener">36000261745</a>, <code>actions/checkout@v7.0.1</code>, job <code>mac-dinh</code>), shortened to the lines that matter:</p>
<div class="out">with:
  repository: cuonghoang1103/ga-san-tap
  token: ***                          &lt;- default input = github.token
  persist-credentials: true
  fetch-depth: 1
  allow-unsafe-pr-checkout: false
Deleting the contents of '/home/runner/work/ga-san-tap/ga-san-tap'
[command]/usr/bin/git init /home/runner/work/ga-san-tap/ga-san-tap
[command]/usr/bin/git config --file /home/runner/work/_temp/git-credentials-6083cfe7-….config
         http.https://github.com/.extraheader AUTHORIZATION: basic ***
[command]/usr/bin/git config --local includeIf.gitdir:/home/runner/work/ga-san-tap/ga-san-tap/.git.path
         /home/runner/work/_temp/git-credentials-6083cfe7-….config
[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1
         origin +9b06fcb3c21c337a57c40a935b68d0462c96b72a:refs/remotes/origin/ch04-action
[command]/usr/bin/git checkout --progress --force -B ch04-action refs/remotes/origin/ch04-action
[command]/usr/bin/git log -1 --format=%H
9b06fcb3c21c337a57c40a935b68d0462c96b72a</div>
<ol>
<li><strong>It empties the workspace</strong> ("Deleting the contents") — anything an earlier step wrote there is gone. Order your steps accordingly.</li>
<li><strong>It writes the credential before fetching</strong> ("Setting up auth"), because even a public repository is fetched with the token.</li>
<li><strong>It fetches one commit by SHA</strong>, not a branch: <code>--depth=1 origin +9b06fcb…</code>. That SHA is <code>GITHUB_SHA</code>, so CI builds exactly the commit that triggered it even if the branch moved a second later.</li>
<li><strong>It creates a local branch</strong> with <code>checkout -B</code>, so <code>git status</code> says "On branch ch04-action" — on a <code>push</code>. On a <code>pull_request</code> you get the merge commit and a detached HEAD instead (below).</li>
<li><strong>It decides whether to keep the credential.</strong> With <code>persist-credentials: false</code> the same log continues with "Removing credentials config" <em>inside</em> the checkout step; with the default it stays until the post step.</li>
</ol>
<h3><code>fetch-depth</code>, measured on this repository</h3>
<p>The default is <code>fetch-depth: 1</code> — one commit, no history. Received wisdom says this is a large saving. Three runs of each approach:</p>

<div class="out">cach                            3 luot (ms)          TB    .git   ca cay  commit
--------------------------------------------------------------------------------
--depth 1  (MAC DINH)      9221 · 7913 · 9158       8,8s   131M    440M       1
day du (fetch-depth: 0)   11540 · 10381 · 10152    10,7s   171M    480M    2515
--filter=blob:none         9520 · 9866 · 9909       9,8s   135M    444M    2515</div>

<div class="callout warn">
<p><strong>The entire 2,515-commit history costs 1.9 seconds and 40 MB.</strong> On this repository the default is optimising something that was not expensive. And the reason is visible in the numbers: the shallow clone&#39;s pack is already 130 MiB for <em>one</em> commit, because the working tree is 440 MB of content — <code>frontend</code> 117 M, <code>playground-3d</code> 89 M, <code>content</code> 37 M. Content dominates; history is cheap.</p>
</div>

<p>The third row is the useful one. <code>--filter=blob:none</code> is a partial clone: it takes the full commit graph and fetches file contents on demand. Full history, <strong>+1.0 second and +4 MB</strong> over the shallow default — which makes it strictly better than <code>fetch-depth: 0</code> for the case that needs history, such as the changed-files step from lesson 3.5.</p>

<div class="callout">
<p><strong>Honest caveat on these numbers.</strong> The size figures are deterministic and would be the same anywhere. The times were measured through this sandbox&#39;s network proxy, not on a GitHub runner, so treat the absolute seconds as indicative and the <em>ratios</em> as the finding. For scale: the real checkout step on the Linux runner in run 32662461744 took <strong>7 seconds</strong>, while the build step in the same job took 149. All three options here are inside the noise of that job.</p>
</div>

<div class="pitfall">
<p><strong>Trap — "shallow clone is faster" as a general rule.</strong> It is true for a repository with deep history and small files, and this course has now measured a repository where it is not. Before adding <code>fetch-depth: 0</code> and worrying about the cost, or leaving it at 1 and writing around the missing history, measure the two clones. It is one command each and the answer is repository-specific.</p>
</div>

<h3>What else the default costs you</h3>
${slide('ga-04', 15, 'Default checkout: 1 commit, 0 tags — history must be requested')}
<p>Measured on a real GitHub runner (same run, two jobs on the same commit of the sandbox):</p>
<div class="out"># fetch-depth: 1 (default)                    # fetch-depth: 0
shallow        : true                          shallow   : false
so commit      : 1                             so commit : 7
so tag         : 0                             nhanh     : 9 nhanh o xa
nhanh          : * ch04-action                 $ git diff --stat origin/main...HEAD
                 remotes/origin/ch04-action     12 files changed, 287 insertions(+)
$ git diff --stat origin/main...HEAD           $ du -sh .git
fatal: ambiguous argument 'origin/main...HEAD'  284K  .git</div>
<p>The shallow clone does not just lack history — it lacks <code>origin/main</code> entirely, which is why the three-dot diff fails with "ambiguous argument" rather than something that mentions depth. That error message sends people looking in the wrong place more often than any other checkout symptom.</p>
<div class="kv-grid">
<div class="kv"><span class="k">no merge base</span><span class="v">any <code>git diff origin/main...HEAD</code> fails with <code>unknown revision</code>. This is the pitfall from 3.5 and it is the most common reason people reach for <code>fetch-depth: 0</code></span></div>
<div class="kv"><span class="k">no tags</span><span class="v"><code>git describe</code> has nothing to describe against. A version-from-tag step needs <code>fetch-depth: 0</code> or an explicit <code>fetch-tags: true</code></span></div>
<div class="kv"><span class="k">no other branches</span><span class="v">the default is single-branch. A step that compares against another branch has to fetch it first</span></div>
<div class="kv"><span class="k">submodules are skipped</span><span class="v"><code>submodules: true</code>, or <code>recursive</code>. Silently empty directories otherwise — no error</span></div>
</div>

<h3>The credential it writes into your repository</h3>
${slide('ga-04', 17, 'The checkout credential: v4 writes it into .git/config, v6+ into a separate file')}
<p>To fetch a private repository, <code>checkout</code> has to authenticate — and the way it does that is visible in the cleanup phase of any real run:</p>

<div class="out">[command]/usr/bin/git config --local --name-only --get-regexp
         http\\.https\\:\\/\\/github\\.com\\/\\.extraheader
http.https://github.com/.extraheader
[command]/usr/bin/git config --local --unset-all
         http.https://github.com/.extraheader</div>

<div class="callout warn">
<p><strong>For the whole duration of the job, <code>.git/config</code> in your workspace contains an authentication header.</strong> The post-step removes it — that is what those lines are — but every step between checkout and cleanup can read it, and so can anything those steps invoke: a build script, a test, a postinstall hook, another action. This is the concrete version of 4.1&#39;s point that there is no boundary between a step and the rest of the job.</p>
</div>

<p>Two mitigations exist and both are one line. <code>persist-credentials: false</code> stops <code>checkout</code> writing the header at all — correct whenever no later step needs to talk to git. And narrowing <code>permissions:</code> shrinks what the token could do if it were read, which Chapter 6 measures (lesson 6.2 — an earlier version of this sentence said Chapter 7).</p>

<h3>Measured on the newest version: the credential moved, it did not disappear</h3>
<p>The cleanup lines above come from <code>checkout@v4</code>, which writes the header straight into <code>.git/config</code> — the self-written action in lesson 4.1 found it there (<code>.git/config co extraheader? true</code>). Since v6 (November 2025, "Persist creds to a separate file") checkout writes it to a file in <code>$RUNNER_TEMP</code> and adds an <code>includeIf</code> line to <code>.git/config</code> that pulls it in. Measured with v7.0.1 on the sandbox:</p>
<div class="out">$ git config --list --show-origin | grep -iE 'extraheader|includeif'
file:.git/config  includeif.gitdir:/home/runner/work/ga-san-tap/ga-san-tap/.git.path=/home/runner/work/_temp/git-credentials-6083cfe7-….config
file:/home/runner/work/_temp/git-credentials-6083cfe7-….config  http.https://github.com/.extraheader=AUTHORIZATION: basic &lt;DA-CHE&gt;
$ h=$(git config --get-all http.https://github.com/.extraheader)
do dai header : 545 ky tu
20 ky tu dau  : AUTHORIZATION: basic</div>
<p>(The value was masked by the workflow itself before printing, and GitHub masks it again as <code>***</code>. Never print a credential in a public log to "check" it — print its length.) The practical effect of v6&#39;s change: uploading or archiving the workspace, <code>.git</code> included, no longer carries the credential, because the file lives outside the workspace. What it does <em>not</em> change: every later step still gets the full 545-character header from one <code>git config</code> command.</p>

<h3>Run it step by step: what a later step can do with it</h3>
${slide('ga-04', 18, 'A later step can read the credential — permissions: is its ceiling')}
<p>The same job then tried to push a new branch with that credential. The workflow declares <code>permissions: contents: read</code>:</p>
<div class="out">$ git push origin HEAD:refs/heads/ch04-thu-push
remote: Permission to cuonghoang1103/ga-san-tap.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/cuonghoang1103/ga-san-tap/': The requested URL returned error: 403</div>
<p>And a second job with <code>persist-credentials: false</code>:</p>
<div class="out">Removing credentials config '/home/runner/work/_temp/git-credentials-f7268f6d-….config'   &lt;- inside the checkout step
$ git config --list --show-origin | grep -iE 'extraheader|includeif' || echo "(khong co dong nao)"
(khong co dong nao)
$ git push origin HEAD:refs/heads/ch04-thu-push
fatal: could not read Username for 'https://github.com': No such device or address</div>
<div class="callout ok">
<p><strong>Two layers, two different jobs.</strong> <code>persist-credentials: false</code> means later steps <em>do not hold</em> a credential; <code>permissions: contents: read</code> means that if something does get hold of the token, it <em>cannot write</em>. The first error (403, "denied to github-actions[bot]") proves the token was present and working — it simply was not allowed. With <code>contents: write</code> that same line would have created a branch. Set both: the one you forget is the one that matters.</p>
</div>
<table>
<thead><tr><th>Your job needs</th><th><code>persist-credentials</code></th><th><code>permissions</code></th></tr></thead>
<tbody>
<tr><td>Build, test, lint (most CI)</td><td><code>false</code></td><td><code>contents: read</code></td></tr>
<tr><td>Push a commit or tag back (version bump, changelog)</td><td><code>true</code>, only in that job</td><td><code>contents: write</code>, only in that job</td></tr>
<tr><td>Fetch a second private repository</td><td><code>false</code> + a separate <code>token:</code> for that checkout</td><td>token of the second repo, not <code>GITHUB_TOKEN</code></td></tr>
<tr><td>Run code from a pull request of a fork</td><td><code>false</code></td><td><code>contents: read</code>, and no secrets in that job (Chapter 6)</td></tr>
</tbody>
</table>

<h3>Checkout on a pull request, revisited</h3>
<p>Lesson 1.4 established that <code>pull_request</code> runs against a merge commit. <code>checkout</code> is where that becomes concrete:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">default</span><span class="lz-t">the merge commit</span><span class="lz-d">no <code>ref:</code> — takes <code>github.sha</code>, which on a PR is <code>refs/pull/&lt;N&gt;/merge</code>. This is what you want for testing</span></div>
<div class="lz-step"><span class="lz-k"><code>ref: head.sha</code></span><span class="lz-t">your branch tip</span><span class="lz-d">safe under <code>pull_request</code>; the vulnerability from 1.4 when combined with <code>pull_request_target</code></span></div>
<div class="lz-step"><span class="lz-k">detached HEAD either way</span><span class="lz-t">no branch checked out</span><span class="lz-d">a step doing <code>git push</code> needs an explicit branch — <code>git symbolic-ref</code> or <code>ref: &#36;{{ github.head_ref }}</code></span></div>
</div>

<h3>The newest default: <code>allow-unsafe-pr-checkout</code></h3>
<p>Every checkout in the sandbox logs prints <code>allow-unsafe-pr-checkout: false</code>. It arrived with v7 (June 2026) and was backported to v4–v6 on 20 July 2026: under <code>pull_request_target</code> and <code>workflow_run</code>, checkout now refuses the common pattern of checking out an untrusted fork&#39;s head — the "pwn request" from lesson 1.4 — unless you set that input to <code>true</code>. If a workflow that relied on that pattern broke in late July 2026 with nobody changing it, this is the change (and lesson 4.2&#39;s point about floating tags). Setting it to <code>true</code> is almost never the right fix; splitting the job so untrusted code runs without secrets is.</p>
<h3>The settings worth knowing exist</h3>
${slide('ga-04', 19, 'Checkout options worth knowing by heart')}
<pre><code>- uses: actions/checkout@v4
  with:
    fetch-depth: 0              <span class="tok-comment"># toan bo lich su (do o tren: +1,9s, +40MB)</span>
    persist-credentials: false  <span class="tok-comment"># dung ghi header xac thuc vao .git/config</span>
    submodules: recursive       <span class="tok-comment"># mac dinh la KHONG lay submodule</span>
    path: kho-phu               <span class="tok-comment"># lay ve mot thu muc con — cho phep checkout NHIEU kho</span>
    sparse-checkout: |          <span class="tok-comment"># chi lay mot phan cay — dang ke voi cay 440MB</span>
      src
      package.json</code></pre>

<div class="callout ok">
<p><strong><code>sparse-checkout</code> is the one under-used option here.</strong> Given that this repository&#39;s working tree is 440 MB and its backend job only type-checks <code>src/</code>, a job that fetched <code>src</code> and the two config files would move a small fraction of that. Unlike <code>fetch-depth</code>, it targets the part the measurement showed is actually large.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> <code>checkout</code> makes two decisions for you — how much history to fetch, and whether to leave a credential in your workspace — and on this repository the measured cost of the first is under two seconds, which means the default was chosen for a repository shaped differently from yours.</p>
</div>

<p>One option missing from the block above, and the best one for "I need history but the repository is big": <code>filter: blob:none</code> — the partial clone measured at the top of this lesson — is a checkout input in its own right:</p>
<pre><code class="language-yaml">- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  with:
    fetch-depth: 0          # every commit…
    filter: blob:none       # …but file contents only on demand
    persist-credentials: false</code></pre>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Your job runs <code>git diff origin/main...HEAD</code> and fails with "ambiguous argument". Why?</strong><br>A: <code>actions/checkout</code> defaults to <code>fetch-depth: 1</code> and fetches only the triggering commit, so <code>origin/main</code> does not exist locally and there is no merge base. Use <code>fetch-depth: 0</code> (optionally with <code>filter: blob:none</code> to keep it cheap), or fetch the base branch explicitly.</p>
<p><strong>Q: What is <code>persist-credentials</code> and why would you turn it off?</strong><br>A: By default checkout leaves the job&#39;s token configured for git (in <code>.git/config</code> up to v5, in a <code>$RUNNER_TEMP</code> file referenced by <code>includeIf</code> since v6) until the post step. Any later step — a build script, a dependency&#39;s postinstall, another action — can read it. Turn it off unless a later step must push, and keep <code>permissions:</code> minimal so the token cannot do much even if read.</p>
<p><strong>Q: On a pull request, which commit does checkout build?</strong><br>A: By default <code>GITHUB_SHA</code>, which for <code>pull_request</code> is the merge commit <code>refs/pull/N/merge</code> — the PR as it would look merged into the base — with a detached HEAD. Use <code>ref: github.event.pull_request.head.sha</code> only when you really need the branch tip, and never together with secrets under <code>pull_request_target</code>.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate says "checkout is just git clone". Prove what it really does, and harden it.</p><ol>
<li>In a test repository, add a job with default checkout and a step printing <code>git rev-parse --is-shallow-repository</code>, <code>git rev-list --count HEAD</code>, <code>git tag | wc -l</code>, and <code>git diff --stat origin/main...HEAD || true</code>. Push to a branch.</li>
<li>Add a second job with <code>fetch-depth: 0</code> and <code>filter: blob:none</code>, same step. Compare, and compare <code>du -sh .git</code>.</li>
<li>In the first job, print <code>git config --list --show-origin | grep -iE 'extraheader|includeif' | sed -E 's/(basic )[^ ]+/\\1HIDDEN/'</code> and the length of the header. Note which file holds it for your checkout version.</li>
<li>With <code>permissions: contents: read</code>, try <code>git push origin HEAD:refs/heads/test-push</code>. Then set <code>persist-credentials: false</code> and try again.</li>
<li>Expand the checkout step and find the <code>fetch … +&lt;sha&gt;</code> line; compare the SHA with <code>GITHUB_SHA</code>.</li></ol>
<p><strong>Done when:</strong> job 1 shows <code>true</code>/<code>1</code>/<code>0</code> and a failed diff, job 2 shows full history and a working diff; you can name the file that held the credential; the first push failed with 403 "denied to github-actions[bot]" and the second with "could not read Username"; and the fetched SHA equals <code>GITHUB_SHA</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shallow clone</span><span class="v">A clone with limited history (<code>--depth=1</code>): one commit, no parents, no other branches.</span></div>
  <div class="kv"><span class="k"><code>fetch-depth</code></span><span class="v">Checkout input: <code>1</code> (default) = one commit; <code>0</code> = all history.</span></div>
  <div class="kv"><span class="k">Partial clone (<code>filter: blob:none</code>)</span><span class="v">All commits and trees, file contents downloaded on demand.</span></div>
  <div class="kv"><span class="k"><code>extraheader</code></span><span class="v">Git setting holding <code>AUTHORIZATION: basic …</code> — the job token checkout configures for git.</span></div>
  <div class="kv"><span class="k"><code>persist-credentials</code></span><span class="v">Keep that credential for later steps (<code>true</code>, default) or remove it right after checkout (<code>false</code>).</span></div>
  <div class="kv"><span class="k"><code>includeIf</code></span><span class="v">Git config directive that loads another file; checkout v6+ uses it to keep the credential outside the workspace.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">Checked out at a commit with no branch — normal for <code>pull_request</code> merge commits.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Checkout empties the workspace, configures a credential, fetches exactly <code>GITHUB_SHA</code> with <code>--depth=1</code>, and creates a local branch.</li>
<li>Depth 1 means no <code>origin/main</code>, no tags, no merge base — "ambiguous argument" on a three-dot diff.</li>
<li><code>fetch-depth: 0</code> + <code>filter: blob:none</code> gives full history cheaply.</li>
<li>The credential stays readable by every later step (v4: <code>.git/config</code>; v6+: a <code>$RUNNER_TEMP</code> file via <code>includeIf</code>) until the post step.</li>
<li><code>persist-credentials: false</code> removes it inside the checkout step; <code>permissions: contents: read</code> caps what it can do (push → 403).</li>
<li>Since 20/07/2026 checkout refuses unsafe PR checkouts under <code>pull_request_target</code> unless <code>allow-unsafe-pr-checkout: true</code>.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README and action.yml</span><span class="lc-sub">github.com/actions/checkout — every input with its default, including <code>persist-credentials</code>, <code>sparse-checkout</code>, and the note that the default ref is the SHA that triggered the workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-clone(1) — --depth, --filter, and partial clone</span><span class="lc-sub">git-scm.com/docs/git-clone — what <code>--filter=blob:none</code> actually does, and the promisor-remote mechanism that fetches blobs on demand afterwards.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Git — sparse-checkout</span><span class="lc-sub">git-scm.com/docs/git-sparse-checkout — cone mode and pattern mode, for the case the measurement above points at: a large working tree where the job only needs part of it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — shallow clones, and what a repository actually stores</span><span class="lc-sub">/courses/git/learn${REF} — objects, packs, and why a single commit of a large tree is not small, which is the whole explanation for the measurement above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — a token in a config file is a token on disk</span><span class="lc-sub">/courses/authentication/learn${REF} — credential storage, blast radius, and why "it is removed afterwards" is a different claim from "it was never readable".</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2><code>checkout</code>, và cú clone nông gần như không tiết kiệm gì</h2>
<p class="lead">Bảy trong hai mươi mốt lượt dùng action của kho này là <code>actions/checkout</code>, điều đó khiến nó là cái đáng hiểu cho tử tế. Hai hành vi của nó chịu lực, và không cái nào hiển nhiên từ hai dòng bạn viết ra.</p>

<h3>checkout THẬT RA làm gì, đọc từ chính log của nó</h3>
${slide('ga-04', 16, 'Một lần checkout đi qua những chặng nào — đọc từ log')}
<p>Hai dòng YAML giấu khoảng bốn mươi lệnh git. Mở rộng bước checkout của bất kỳ run nào là thấy đủ, có tiền tố <code>[command]</code>. Từ sân tập (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000261745" target="_blank" rel="noopener">36000261745</a>, <code>actions/checkout@v7.0.1</code>, job <code>mac-dinh</code>), rút gọn còn những dòng đáng kể:</p>
<div class="out">with:
  repository: cuonghoang1103/ga-san-tap
  token: ***                          &lt;- input mặc định = github.token
  persist-credentials: true
  fetch-depth: 1
  allow-unsafe-pr-checkout: false
Deleting the contents of '/home/runner/work/ga-san-tap/ga-san-tap'
[command]/usr/bin/git init /home/runner/work/ga-san-tap/ga-san-tap
[command]/usr/bin/git config --file /home/runner/work/_temp/git-credentials-6083cfe7-….config
         http.https://github.com/.extraheader AUTHORIZATION: basic ***
[command]/usr/bin/git config --local includeIf.gitdir:/home/runner/work/ga-san-tap/ga-san-tap/.git.path
         /home/runner/work/_temp/git-credentials-6083cfe7-….config
[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1
         origin +9b06fcb3c21c337a57c40a935b68d0462c96b72a:refs/remotes/origin/ch04-action
[command]/usr/bin/git checkout --progress --force -B ch04-action refs/remotes/origin/ch04-action
[command]/usr/bin/git log -1 --format=%H
9b06fcb3c21c337a57c40a935b68d0462c96b72a</div>
<ol>
<li><strong>Nó dọn sạch workspace</strong> ("Deleting the contents") — mọi thứ bước trước ghi vào đó đều mất. Sắp thứ tự bước cho phù hợp.</li>
<li><strong>Nó ghi khoá xác thực TRƯỚC khi fetch</strong> ("Setting up auth"), vì kể cả kho công khai cũng được fetch bằng token.</li>
<li><strong>Nó fetch MỘT commit theo SHA</strong>, không phải một nhánh: <code>--depth=1 origin +9b06fcb…</code>. SHA đó là <code>GITHUB_SHA</code>, nên CI dựng đúng commit đã kích hoạt nó kể cả khi nhánh dời đi một giây sau.</li>
<li><strong>Nó tạo một nhánh cục bộ</strong> bằng <code>checkout -B</code>, nên <code>git status</code> nói "On branch ch04-action" — với <code>push</code>. Với <code>pull_request</code> bạn nhận merge commit và HEAD tách rời (detached) thay vào đó (bên dưới).</li>
<li><strong>Nó quyết định có giữ khoá lại không.</strong> Với <code>persist-credentials: false</code>, cùng log ấy đi tiếp bằng "Removing credentials config" <em>NGAY TRONG</em> bước checkout; để mặc định thì khoá nằm lại tới bước post.</li>
</ol>
<h3><code>fetch-depth</code>, đo trên chính kho này</h3>
<p>Mặc định là <code>fetch-depth: 1</code> — một commit, không lịch sử. Lời truyền miệng bảo đây là một khoản tiết kiệm lớn. Ba lượt cho mỗi cách:</p>

<div class="out">cach                            3 luot (ms)          TB    .git   ca cay  commit
--------------------------------------------------------------------------------
--depth 1  (MAC DINH)      9221 · 7913 · 9158       8,8s   131M    440M       1
day du (fetch-depth: 0)   11540 · 10381 · 10152    10,7s   171M    480M    2515
--filter=blob:none         9520 · 9866 · 9909       9,8s   135M    444M    2515</div>

<div class="callout warn">
<p><strong>Trọn 2.515 commit lịch sử tốn 1,9 giây và 40 MB.</strong> Ở kho này cái mặc định đang tối ưu một thứ vốn không đắt. Và lý do hiện ra ngay trong mấy con số: pack của bản clone nông đã là 130 MiB cho <em>MỘT</em> commit, bởi cây làm việc là 440 MB nội dung — <code>frontend</code> 117 M, <code>playground-3d</code> 89 M, <code>content</code> 37 M. NỘI DUNG áp đảo; LỊCH SỬ thì rẻ.</p>
</div>

<p>Hàng thứ ba mới là hàng hữu ích. <code>--filter=blob:none</code> là một bản clone TỪNG PHẦN: nó lấy trọn đồ thị commit và tải nội dung tệp về khi cần. Trọn lịch sử, <strong>+1,0 giây và +4 MB</strong> so với mặc định nông — khiến nó tốt hơn hẳn <code>fetch-depth: 0</code> cho ca cần lịch sử, chẳng hạn bước đếm-file-đã-đổi ở bài 3.5.</p>

<div class="callout">
<p><strong>Nói thẳng giới hạn của mấy con số này.</strong> Các số đo DUNG LƯỢNG là tất định và sẽ giống nhau ở bất cứ đâu. Các số đo THỜI GIAN được đo qua proxy mạng của hộp cát này, không phải trên một runner của GitHub, nên hãy coi số giây tuyệt đối là để tham khảo còn <em>TỈ LỆ</em> mới là phát hiện. Để có cỡ: bước checkout thật trên runner Linux trong run 32662461744 mất <strong>7 giây</strong>, còn bước dựng trong cùng job ấy mất 149. Cả ba lựa chọn ở đây đều nằm trong tiếng ồn của job đó.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi "clone nông thì nhanh hơn" là một quy tắc chung.</strong> Nó đúng với một kho có lịch sử sâu và tệp nhỏ, và khoá học này vừa đo một kho mà nó không đúng. Trước khi thêm <code>fetch-depth: 0</code> rồi lo về cái giá, hoặc để nguyên là 1 rồi viết vòng qua chỗ thiếu lịch sử, hãy ĐO hai bản clone. Mỗi cái một câu lệnh và đáp án thì tuỳ từng kho.</p>
</div>

<h3>Cái mặc định còn khiến bạn mất gì nữa</h3>
${slide('ga-04', 15, 'checkout mặc định: 1 commit, 0 thẻ — lịch sử phải xin thêm')}
<p>Đo trên runner thật của GitHub (cùng run, hai job trên cùng một commit của sân tập):</p>
<div class="out"># fetch-depth: 1 (mặc định)                   # fetch-depth: 0
shallow        : true                          shallow   : false
so commit      : 1                             so commit : 7
so tag         : 0                             nhanh     : 9 nhanh o xa
nhanh          : * ch04-action                 $ git diff --stat origin/main...HEAD
                 remotes/origin/ch04-action     12 files changed, 287 insertions(+)
$ git diff --stat origin/main...HEAD           $ du -sh .git
fatal: ambiguous argument 'origin/main...HEAD'  284K  .git</div>
<p>Bản clone nông không chỉ thiếu lịch sử — nó thiếu HẲN <code>origin/main</code>, và đó là lý do diff ba chấm hỏng với "ambiguous argument" chứ không phải một câu nào nhắc tới độ sâu. Thông điệp lỗi ấy đẩy người ta đi tìm sai chỗ thường xuyên hơn bất kỳ triệu chứng checkout nào khác.</p>
<div class="kv-grid">
<div class="kv"><span class="k">không có merge base</span><span class="v">mọi câu <code>git diff origin/main...HEAD</code> đều hỏng với <code>unknown revision</code>. Đây là cái bẫy ở bài 3.5 và là lý do phổ biến nhất người ta với tay tới <code>fetch-depth: 0</code></span></div>
<div class="kv"><span class="k">không có tag</span><span class="v"><code>git describe</code> chẳng có gì để mô tả dựa vào. Một bước lấy-phiên-bản-từ-tag cần <code>fetch-depth: 0</code> hoặc một <code>fetch-tags: true</code> tường minh</span></div>
<div class="kv"><span class="k">không có nhánh nào khác</span><span class="v">mặc định là một nhánh. Một bước đối chiếu với nhánh khác phải fetch nhánh ấy trước</span></div>
<div class="kv"><span class="k">submodule bị bỏ qua</span><span class="v"><code>submodules: true</code>, hoặc <code>recursive</code>. Không thì thư mục rỗng một cách âm thầm — không có lỗi nào</span></div>
</div>

<h3>Cái khoá nó GHI vào kho của bạn</h3>
${slide('ga-04', 17, 'Khoá của checkout: v4 ghi vào .git/config, v6+ ghi ra tệp riêng')}
<p>Để lấy được một kho riêng tư, <code>checkout</code> phải xác thực — và cách nó làm chuyện đó hiện ra ngay trong pha dọn dẹp của bất kỳ lần chạy thật nào:</p>

<div class="out">[command]/usr/bin/git config --local --name-only --get-regexp
         http\\.https\\:\\/\\/github\\.com\\/\\.extraheader
http.https://github.com/.extraheader
[command]/usr/bin/git config --local --unset-all
         http.https://github.com/.extraheader</div>

<div class="callout warn">
<p><strong>Suốt cả thời gian job chạy, <code>.git/config</code> trong thư mục làm việc của bạn CHỨA một header xác thực.</strong> Post-step gỡ nó đi — mấy dòng trên chính là chuyện đó — nhưng mọi bước nằm giữa checkout và lúc dọn đều đọc được nó, và mọi thứ mà những bước ấy gọi tới cũng vậy: một script dựng, một bài test, một móc postinstall, một action khác. Đây là phiên bản cụ thể của luận điểm ở bài 4.1 rằng KHÔNG có ranh giới nào giữa một bước và phần còn lại của job.</p>
</div>

<p>Có hai cách giảm nhẹ và cả hai đều một dòng. <code>persist-credentials: false</code> khiến <code>checkout</code> không ghi cái header ấy chút nào — đúng đắn mỗi khi không có bước sau nào cần nói chuyện với git. Và thu hẹp <code>permissions:</code> làm nhỏ lại thứ mà token làm được nếu nó bị đọc, chuyện mà Chương 6 đo (bài 6.2 — bản trước của câu này ghi nhầm là Chương 7).</p>

<h3>Đo trên bản mới nhất: khoá CHUYỂN CHỖ, không biến mất</h3>
<p>Những dòng dọn dẹp ở trên tới từ <code>checkout@v4</code>, bản ghi header thẳng vào <code>.git/config</code> — action tự viết ở bài 4.1 tìm thấy nó ở đó (<code>.git/config co extraheader? true</code>). Từ v6 (11/2025, "Persist creds to a separate file") checkout ghi nó ra một tệp trong <code>$RUNNER_TEMP</code> và thêm một dòng <code>includeIf</code> vào <code>.git/config</code> để kéo tệp đó vào. Đo với v7.0.1 trên sân tập:</p>
<div class="out">$ git config --list --show-origin | grep -iE 'extraheader|includeif'
file:.git/config  includeif.gitdir:/home/runner/work/ga-san-tap/ga-san-tap/.git.path=/home/runner/work/_temp/git-credentials-6083cfe7-….config
file:/home/runner/work/_temp/git-credentials-6083cfe7-….config  http.https://github.com/.extraheader=AUTHORIZATION: basic &lt;DA-CHE&gt;
$ h=$(git config --get-all http.https://github.com/.extraheader)
do dai header : 545 ky tu
20 ky tu dau  : AUTHORIZATION: basic</div>
<p>(Giá trị đã được chính workflow che trước khi in, và GitHub che thêm lần nữa thành <code>***</code>. Đừng bao giờ in một khoá ra log công khai để "kiểm" nó — in ĐỘ DÀI của nó.) Hiệu quả thực tế của thay đổi ở v6: tải lên hay nén cả workspace, gồm <code>.git</code>, không còn mang khoá theo, vì tệp khoá nằm NGOÀI workspace. Thứ nó KHÔNG đổi: mọi bước sau vẫn lấy được trọn header 545 ký tự bằng một lệnh <code>git config</code>.</p>

<h3>Chạy thử từng bước: một bước sau làm được gì với nó</h3>
${slide('ga-04', 18, 'Bước sau đọc được khoá — permissions: là trần của nó')}
<p>Cùng job đó sau đó thử push một nhánh mới bằng chính khoá ấy. Workflow khai <code>permissions: contents: read</code>:</p>
<div class="out">$ git push origin HEAD:refs/heads/ch04-thu-push
remote: Permission to cuonghoang1103/ga-san-tap.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/cuonghoang1103/ga-san-tap/': The requested URL returned error: 403</div>
<p>Và một job thứ hai với <code>persist-credentials: false</code>:</p>
<div class="out">Removing credentials config '/home/runner/work/_temp/git-credentials-f7268f6d-….config'   &lt;- ngay trong bước checkout
$ git config --list --show-origin | grep -iE 'extraheader|includeif' || echo "(khong co dong nao)"
(khong co dong nao)
$ git push origin HEAD:refs/heads/ch04-thu-push
fatal: could not read Username for 'https://github.com': No such device or address</div>
<div class="callout ok">
<p><strong>Hai lớp, hai việc khác nhau.</strong> <code>persist-credentials: false</code> nghĩa là các bước sau <em>KHÔNG CẦM</em> khoá; <code>permissions: contents: read</code> nghĩa là nếu có thứ gì cầm được token thì nó <em>KHÔNG GHI</em> được. Lỗi đầu (403, "denied to github-actions[bot]") chứng minh token CÓ mặt và CHẠY được — chỉ là không được phép. Với <code>contents: write</code> chính dòng đó đã tạo ra một nhánh. Đặt cả hai: cái bạn quên chính là cái quan trọng.</p>
</div>
<table>
<thead><tr><th>Job của bạn cần</th><th><code>persist-credentials</code></th><th><code>permissions</code></th></tr></thead>
<tbody>
<tr><td>Dựng, test, lint (phần lớn CI)</td><td><code>false</code></td><td><code>contents: read</code></td></tr>
<tr><td>Đẩy commit hay thẻ ngược lên (nâng phiên bản, changelog)</td><td><code>true</code>, chỉ trong job đó</td><td><code>contents: write</code>, chỉ trong job đó</td></tr>
<tr><td>Lấy thêm một kho riêng tư thứ hai</td><td><code>false</code> + một <code>token:</code> riêng cho lần checkout đó</td><td>token của kho thứ hai, không phải <code>GITHUB_TOKEN</code></td></tr>
<tr><td>Chạy mã từ pull request của một fork</td><td><code>false</code></td><td><code>contents: read</code>, và không secret nào trong job đó (Chương 6)</td></tr>
</tbody>
</table>
<h3>Checkout trên một pull request, xem lại</h3>
<p>Bài 1.4 xác lập rằng <code>pull_request</code> chạy trên một merge commit. <code>checkout</code> là chỗ điều đó thành cụ thể:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">mặc định</span><span class="lz-t">merge commit</span><span class="lz-d">không có <code>ref:</code> — lấy <code>github.sha</code>, mà trên một PR nó là <code>refs/pull/&lt;N&gt;/merge</code>. Đây là thứ bạn MUỐN để kiểm thử</span></div>
<div class="lz-step"><span class="lz-k"><code>ref: head.sha</code></span><span class="lz-t">đầu nhánh của bạn</span><span class="lz-d">an toàn dưới <code>pull_request</code>; là lỗ hổng ở bài 1.4 khi ghép với <code>pull_request_target</code></span></div>
<div class="lz-step"><span class="lz-k">HEAD rời trong cả hai</span><span class="lz-t">không nhánh nào được checkout</span><span class="lz-d">một bước làm <code>git push</code> cần một nhánh tường minh — <code>git symbolic-ref</code> hoặc <code>ref: &#36;{{ github.head_ref }}</code></span></div>
</div>

<h3>Mặc định mới nhất: <code>allow-unsafe-pr-checkout</code></h3>
<p>Mọi lần checkout trong log sân tập đều in <code>allow-unsafe-pr-checkout: false</code>. Nó tới cùng v7 (06/2026) và được đưa ngược về v4–v6 ngày 20/07/2026: dưới <code>pull_request_target</code> và <code>workflow_run</code>, checkout giờ TỪ CHỐI kiểu viết phổ biến là checkout đầu nhánh của một fork không tin được — cái "pwn request" ở bài 1.4 — trừ khi bạn đặt input ấy thành <code>true</code>. Nếu một workflow từng dựa vào kiểu viết đó vỡ vào cuối 07/2026 mà không ai sửa gì, thì đây là thay đổi ấy (và đúng ý của bài 4.2 về thẻ di động). Đặt nó thành <code>true</code> gần như không bao giờ là cách sửa đúng; tách job để mã không tin được chạy mà không có secret mới là cách đúng.</p>
<h3>Những tuỳ chọn đáng biết là nó có</h3>
${slide('ga-04', 19, 'Những tuỳ chọn của checkout đáng thuộc lòng')}
<pre><code>- uses: actions/checkout@v4
  with:
    fetch-depth: 0              <span class="tok-comment"># toan bo lich su (do o tren: +1,9s, +40MB)</span>
    persist-credentials: false  <span class="tok-comment"># dung ghi header xac thuc vao .git/config</span>
    submodules: recursive       <span class="tok-comment"># mac dinh la KHONG lay submodule</span>
    path: kho-phu               <span class="tok-comment"># lay ve mot thu muc con — cho phep checkout NHIEU kho</span>
    sparse-checkout: |          <span class="tok-comment"># chi lay mot phan cay — dang ke voi cay 440MB</span>
      src
      package.json</code></pre>

<div class="callout ok">
<p><strong><code>sparse-checkout</code> là tuỳ chọn bị dùng thiếu ở đây.</strong> Cây làm việc của kho này là 440 MB mà job backend chỉ đi kiểm kiểu <code>src/</code>, nên một job chỉ lấy <code>src</code> cùng hai tệp cấu hình sẽ chuyển một phần nhỏ của con số ấy. Khác <code>fetch-depth</code>, nó nhắm vào đúng cái phần mà phép đo cho thấy là thật sự lớn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>checkout</code> quyết hộ bạn hai chuyện — lấy về bao nhiêu lịch sử, và có để lại một cái khoá trong thư mục làm việc của bạn hay không — và ở kho này cái giá đo được của chuyện thứ nhất là dưới hai giây, nghĩa là cái mặc định ấy được chọn cho một kho có hình dạng khác kho của bạn.</p>
</div>

<p>Một tuỳ chọn thiếu trong khối trên, và là cái tốt nhất cho câu "tôi cần lịch sử nhưng kho to": <code>filter: blob:none</code> — bản clone một phần đã đo ở đầu bài — là một input riêng của checkout:</p>
<pre><code class="language-yaml">- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  with:
    fetch-depth: 0          # mọi commit…
    filter: blob:none       # …nhưng nội dung tệp chỉ tải khi cần
    persist-credentials: false</code></pre>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Job của bạn chạy <code>git diff origin/main...HEAD</code> và hỏng với "ambiguous argument". Vì sao?</strong><br>Đ: <code>actions/checkout</code> mặc định <code>fetch-depth: 1</code> và chỉ lấy commit kích hoạt, nên <code>origin/main</code> không tồn tại ở máy và không có merge base. Dùng <code>fetch-depth: 0</code> (có thể kèm <code>filter: blob:none</code> cho rẻ), hoặc fetch nhánh gốc một cách tường minh.</p>
<p><strong>H: <code>persist-credentials</code> là gì và vì sao bạn tắt nó?</strong><br>Đ: Mặc định checkout để token của job nằm lại trong cấu hình git (trong <code>.git/config</code> tới v5, trong một tệp <code>$RUNNER_TEMP</code> được <code>includeIf</code> kéo vào từ v6) tới bước post. Mọi bước sau — script dựng, postinstall của một phụ thuộc, một action khác — đều đọc được. Tắt nó trừ khi bước sau phải push, và giữ <code>permissions:</code> tối thiểu để token có bị đọc cũng không làm được mấy.</p>
<p><strong>H: Trên một pull request, checkout dựng commit nào?</strong><br>Đ: Mặc định là <code>GITHUB_SHA</code>, với <code>pull_request</code> là merge commit <code>refs/pull/N/merge</code> — PR trông ra sao khi đã gộp vào nhánh gốc — với HEAD tách rời. Chỉ dùng <code>ref: github.event.pull_request.head.sha</code> khi thật sự cần đầu nhánh, và không bao giờ đi cùng secret dưới <code>pull_request_target</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm nói "checkout chỉ là git clone thôi". Chứng minh nó thật ra làm gì, rồi siết nó lại.</p><ol>
<li>Trong một kho thử, thêm một job checkout mặc định và một bước in <code>git rev-parse --is-shallow-repository</code>, <code>git rev-list --count HEAD</code>, <code>git tag | wc -l</code>, và <code>git diff --stat origin/main...HEAD || true</code>. Push lên một nhánh.</li>
<li>Thêm job thứ hai với <code>fetch-depth: 0</code> và <code>filter: blob:none</code>, cùng bước đó. So sánh, và so cả <code>du -sh .git</code>.</li>
<li>Trong job đầu, in <code>git config --list --show-origin | grep -iE 'extraheader|includeif' | sed -E 's/(basic )[^ ]+/\\1HIDDEN/'</code> và độ dài header. Ghi lại tệp nào giữ khoá với phiên bản checkout của bạn.</li>
<li>Với <code>permissions: contents: read</code>, thử <code>git push origin HEAD:refs/heads/test-push</code>. Rồi đặt <code>persist-credentials: false</code> và thử lại.</li>
<li>Mở rộng bước checkout và tìm dòng <code>fetch … +&lt;sha&gt;</code>; so SHA đó với <code>GITHUB_SHA</code>.</li></ol>
<p><strong>Đạt khi:</strong> job 1 cho <code>true</code>/<code>1</code>/<code>0</code> và một diff hỏng, job 2 cho đủ lịch sử và diff chạy được; bạn gọi tên được tệp giữ khoá; lần push đầu hỏng với 403 "denied to github-actions[bot]" còn lần hai với "could not read Username"; và SHA được fetch trùng <code>GITHUB_SHA</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shallow clone (clone nông)</span><span class="v">Bản clone có lịch sử giới hạn (<code>--depth=1</code>): một commit, không cha, không nhánh khác.</span></div>
  <div class="kv"><span class="k"><code>fetch-depth</code></span><span class="v">Input của checkout: <code>1</code> (mặc định) = một commit; <code>0</code> = toàn bộ lịch sử.</span></div>
  <div class="kv"><span class="k">Partial clone (<code>filter: blob:none</code>)</span><span class="v">Đủ mọi commit và cây thư mục, nội dung tệp tải khi cần.</span></div>
  <div class="kv"><span class="k"><code>extraheader</code></span><span class="v">Thiết lập git giữ <code>AUTHORIZATION: basic …</code> — token của job mà checkout cấu hình cho git.</span></div>
  <div class="kv"><span class="k"><code>persist-credentials</code></span><span class="v">Giữ khoá đó cho các bước sau (<code>true</code>, mặc định) hay gỡ ngay sau checkout (<code>false</code>).</span></div>
  <div class="kv"><span class="k"><code>includeIf</code></span><span class="v">Chỉ thị cấu hình git nạp thêm một tệp khác; checkout v6+ dùng nó để giữ khoá ngoài workspace.</span></div>
  <div class="kv"><span class="k">Detached HEAD (HEAD tách rời)</span><span class="v">Đứng ở một commit mà không ở nhánh nào — bình thường với merge commit của <code>pull_request</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checkout dọn sạch workspace, cấu hình một khoá, fetch đúng <code>GITHUB_SHA</code> với <code>--depth=1</code>, rồi tạo nhánh cục bộ.</li>
<li>Độ sâu 1 nghĩa là không có <code>origin/main</code>, không thẻ, không merge base — "ambiguous argument" khi diff ba chấm.</li>
<li><code>fetch-depth: 0</code> + <code>filter: blob:none</code> cho đủ lịch sử mà rẻ.</li>
<li>Khoá nằm đó cho mọi bước sau đọc (v4: <code>.git/config</code>; v6+: một tệp <code>$RUNNER_TEMP</code> qua <code>includeIf</code>) tới bước post.</li>
<li><code>persist-credentials: false</code> gỡ nó ngay trong bước checkout; <code>permissions: contents: read</code> đặt trần cho nó (push → 403).</li>
<li>Từ 20/07/2026 checkout từ chối checkout PR không an toàn dưới <code>pull_request_target</code> trừ khi <code>allow-unsafe-pr-checkout: true</code>.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README và action.yml</span><span class="lc-sub">github.com/actions/checkout — mọi tham số kèm giá trị mặc định, gồm <code>persist-credentials</code>, <code>sparse-checkout</code>, và ghi chú rằng ref mặc định là cái sha đã kích hoạt workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-clone(1) — --depth, --filter, và partial clone</span><span class="lc-sub">git-scm.com/docs/git-clone — <code>--filter=blob:none</code> thật ra làm gì, và cơ chế promisor-remote tải blob về theo yêu cầu về sau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Git — sparse-checkout</span><span class="lc-sub">git-scm.com/docs/git-sparse-checkout — chế độ cone và chế độ mẫu, cho đúng cái ca mà phép đo bên trên chỉ vào: một cây làm việc lớn mà job chỉ cần một phần.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — clone nông, và một kho thật ra LƯU cái gì</span><span class="lc-sub">/courses/git/learn${REF} — object, pack, và vì sao một commit đơn lẻ của một cây lớn thì không hề nhỏ, đó là toàn bộ lời giải thích cho phép đo bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — một token trong tệp cấu hình là một token NẰM TRÊN ĐĨA</span><span class="lc-sub">/courses/authentication/learn${REF} — cách lưu thông tin đăng nhập, bán kính thiệt hại, và vì sao "nó bị gỡ đi sau đó" là một lời khẳng định KHÁC với "nó chưa bao giờ đọc được".</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — setup-* actions, and the cache key you can compute after all|||4.4 — Các action setup-*, và cái khoá cache hoá ra vẫn tính được',
      slug: 'ga-4-4-setup',
      type: 'VIDEO',
      description: 'Tool cache: bản có sẵn 1 giây, bản phải tải 4–5 giây. Rồi khoá cache dựng sẵn của `setup-node`: lần đầu TÁM ứng viên không cái nào khớp — đo lại 24/09/2026 thì khoá chính là hashFiles() của các lockfile, khớp đủ 64 ký tự, và Windows khác vì CRLF.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2><code>setup-*</code> actions, and a key I could not reproduce</h2>
<p class="lead">Six of this repository&#39;s twenty-one action uses are <code>actions/setup-node</code>. It does two separate jobs — install a toolchain version, and cache the dependency download — and the second one turned out to be the more interesting to investigate, because the investigation failed.</p>

<h3>What the setup costs</h3>
${slide('ga-04', 20, 'setup-node: a preinstalled version takes 1 second, a downloaded one 4–5')}
<p>The same thing measured on the sandbox, where the numbers are small enough to see the mechanism (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264687" target="_blank" rel="noopener">36000264687</a>). One job asked for <code>node-version: 22</code>, another for <code>'20.10.0'</code>:</p>
<div class="out"># job cache-npm — node-version: 22                    (step: 1 s)
Found in cache @ /opt/hostedtoolcache/node/22.23.2/x64
tool cache co san : 22.23.2 24.21.0

# job tai-ve — node-version: '20.10.0'                  (step: 4–5 s)
Attempting to download 20.10.0...
Acquiring 20.10.0 - x64 from https://github.com/actions/node-versions/releases/download/20.10.0-6972104774/node-20.10.0-linux-x64.tar.gz
Extracting ...
Adding to the cache ...
/opt/hostedtoolcache/node/20.10.0/x64/bin/node</div>
<p>"Tool cache" (<code>/opt/hostedtoolcache</code>) is a folder baked into the runner image with a few versions of each language. A request that matches one is a <code>PATH</code> change; anything else is a download from <code>actions/node-versions</code>. And the set is not fixed: the second run of the same workflow, three minutes later, landed on an older image (<code>20260907.300.1</code> instead of <code>20260920.314.1</code>) and the tool cache said <code>22.23.2 24.20.0</code> instead of <code>22.23.2 24.21.0</code>. Ask for <code>24</code> on both and you get two different patch versions of Node — both "correct", and one more reason to pin what matters in a file (<code>.nvmrc</code>) rather than trusting the image.</p>
<div class="pitfall">
<p><strong>Trap — <code>node-version: 22</code> means "latest 22.x in the tool cache", not "latest 22.x".</strong> By default <code>check-latest</code> is <code>false</code>, so setup-node happily uses whatever 22.x the image shipped, possibly weeks old. That is usually what you want (fast, reproducible for the image&#39;s lifetime). If you need the newest patch the day it is released, set <code>check-latest: true</code> and accept a download on most runs.</p>
</div>
<p>From run 32662461744, the <code>setup-node</code> step on each platform:</p>

<div class="out">Linux    13s
macOS    11s
Windows  22s</div>

<p>That buys a specific Node version instead of whatever the runner image happens to ship — which is the point of lesson 2.1&#39;s argument about declaring rather than inheriting. Eleven to twenty-two seconds is the price of your workflow owning its toolchain version rather than GitHub&#39;s image rollout schedule owning it.</p>

<div class="kv-grid">
<div class="kv"><span class="k">already in the tool cache</span><span class="v">runner images preinstall several Node versions. Asking for one of those is a path change, and it is the fast case</span></div>
<div class="kv"><span class="k">not in the tool cache</span><span class="v">it downloads and unpacks — tens of seconds, and it varies. Pinning an exact patch version is more likely to miss the preinstalled set than pinning a major</span></div>
<div class="kv"><span class="k"><code>node-version-file:</code></span><span class="v">reads <code>.nvmrc</code> or <code>package.json</code>&#39;s <code>engines</code>. Better than a literal, because it stops the workflow and the project disagreeing about the version silently</span></div>
<div class="kv"><span class="k">the same shape everywhere</span><span class="v"><code>setup-python</code>, <code>setup-go</code>, <code>setup-java</code>, <code>setup-dotnet</code> all work identically — version input, tool cache, and an optional dependency cache</span></div>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">ask for a version</span><span class="lz-t"><code>node-version: &#39;22&#39;</code></span><span class="lz-d">the action looks in the runner&#39;s tool cache first</span></div>
<div class="lz-step"><span class="lz-k">already there</span><span class="lz-t">a PATH change</span><span class="lz-d">the fast case: preinstalled majors cost near nothing</span></div>
<div class="lz-step"><span class="lz-k">not there</span><span class="lz-t">download and unpack</span><span class="lz-d">an exact patch pin is likelier to land here — 11 to 22 seconds, measured</span></div>
</div>

<h3>The investigation, and why it failed</h3>
<p>Lesson 3.4 reproduced <code>hashFiles()</code> and verified it against a real cache key, exactly. So the same method should work on <code>setup-node</code>&#39;s built-in cache. The workflow at that commit declares exactly what to hash:</p>

<pre><code>- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
    cache-dependency-path: |
      package-lock.json
      frontend/package-lock.json</code></pre>

<p>And the log from that run prints the key it computed:</p>

<div class="out">Cache hit occurred on the primary key
  node-cache-Linux-x64-npm-699ec67c02f94027efff6b4cd1c7f842cbaa689063c4d900c963e39ac11c4c6a</div>

<p>Eight candidate calculations, all at the exact commit the run used:</p>

<div class="out">cach tinh                          ket qua
------------------------------------------------------------
hashFiles(chi goc)                 a505030c00af033c...
hashFiles(goc + frontend)          dc25e40311e9cacb...
hashFiles(chi frontend)            e3a98579f5ab829e...
hashFiles(tat ca **/)              dc25e40311e9cacb...
noi HEX thay vi nhi phan           7e9417715d1fe848...
noi NOI DUNG roi bam mot lan       6f426dc0c0a29a69...
thu tu nguoc                       dc25e40311e9cacb...
chi frontend, noi hex              1228ac54b1780ee7...

muc tieu (tu log that)             699ec67c02f94027...</div>

<div class="callout warn">
<p><strong>None of them matched. That is the result, and it is being reported as the result.</strong>
</p>
</div>
<div class="callout warn">
<p><strong>Correction (24/09/2026): the conclusion below this line was wrong.</strong> The paragraph that follows is kept as it was written, because how it went wrong is the most useful part of this lesson. <code>setup-node</code> does <em>not</em> compute its key "some other way" — the key is <code>hashFiles()</code> of the dependency files, and it has now been reproduced to all 64 characters, both on the sandbox and on the very run this investigation was about. The next section shows how, and why the eight guesses missed.</p>
</div>
<div class="callout">
<p><strong>As originally written:</strong> The <code>hashFiles()</code> reproduction is known-correct — 3.4 verified it to all sixty-four characters against an <code>actions/cache</code> key from this same run. So the difference is not in my hashing; <code>setup-node</code> computes its key some other way, and eight reasonable guesses did not find it.</p>
</div>

<h3>Re-measured: the key is <code>hashFiles()</code>, to all 64 characters</h3>
${slide('ga-04', 21, 'The setup-node cache key = hashFiles(lockfile) — computable')}
<p>Start from the source instead of guessing. In <code>actions/setup-node</code>, <code>src/cache-restore.ts</code> is short and identical in v4 and v7.0.0:</p>
<pre><code class="language-ts">const lockFilePath = cacheDependencyPath ? cacheDependencyPath : findLockFile(packageManagerInfo);
const fileHash = await glob.hashFiles(lockFilePath);
const keyPrefix = &#96;node-cache-&#36;{platform}-&#36;{arch}-&#36;{packageManager}&#96;;   // platform = RUNNER_OS
const primaryKey = &#96;&#36;{keyPrefix}-&#36;{fileHash}&#96;;</code></pre>
<p>So the key is <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> followed by the same hash the <code>hashFiles()</code> expression computes: SHA-256 over the concatenated SHA-256 digests of each matched file, in order. Test that on the sandbox by printing both side by side (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264687" target="_blank" rel="noopener">36000264687</a>):</p>
<pre><code class="language-yaml">- id: node
  uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
  with:
    node-version: 22
    cache: npm
    cache-dependency-path: ch04/app/package-lock.json
- run: |
    echo "cache-primary-key = &#36;{{ steps.node.outputs.cache-primary-key }}"
    echo "hashFiles(lock)   = &#36;{{ hashFiles('ch04/app/package-lock.json') }}"</code></pre>
<div class="out">cache-primary-key = node-cache-Linux-x64-npm-d94a99a05ccf72b4f0b7a3ac3d95ce861b43b23510dd5c837e5f00473739622d
hashFiles(lock)   =                      d94a99a05ccf72b4f0b7a3ac3d95ce861b43b23510dd5c837e5f00473739622d</div>
<p>Identical. (The <code>cache-primary-key</code> output is new in setup-node v7 — v4 to v6 only output <code>cache-hit</code> and <code>node-version</code>, so on those you read the key from the log line "Cache hit for:" or "Cache saved with the key:".)</p>

<h3>Why the eight guesses missed: wrong files, and CRLF</h3>
${slide('ga-04', 22, 'Reproducing the old api-backend key: Windows differs because of CRLF')}
<p>Back to run 32662461744 (<code>desktop-release.yml</code>, commit <code>6a121bac</code>). Its logs, read again today, contain these keys:</p>
<div class="out">Kiem tra ma   : node-cache-Linux-x64-npm-1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
Dung Linux    : node-cache-Linux-x64-npm-1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
Dung macOS    : node-cache-macOS-arm64-npm-1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
Dung Windows  : node-cache-Windows-x64-npm-c7c75d0c735a00d8ae15c9c7cf495362f44d85069f2a9c622f684a37fee284e1</div>
<p>The workflow at that commit hashes <code>desktop/package-lock.json</code> and <code>frontend/package-lock.json</code> — not the root <code>package-lock.json</code> that all eight guesses started from. Recomputed offline from git, with the same algorithm:</p>
<pre><code class="language-js">// node -e … trong kho api-backend
const h = (files, crlf) =&gt; { const r = crypto.createHash('sha256');
  for (const f of files) { let b = execSync(&#96;git show 6a121bac:&#36;{f}&#96;);
    if (crlf) b = Buffer.from(b.toString().replace(/\\r?\\n/g, '\\r\\n'));
    r.update(crypto.createHash('sha256').update(b).digest()); }
  return r.digest('hex'); };</code></pre>
<div class="out">desktop                     103d6815979fe3f5...
desktop + frontend          1271543c845c4810...   = Linux, macOS  ✓
frontend + desktop          d216f38018999ba9...   (order matters)
desktop + frontend, CRLF    c7c75d0c735a00d8...   = Windows       ✓</div>
<ul>
<li><strong>The wrong files.</strong> The job log prints only the <em>first line</em> of a multi-line <code>with:</code> value — it shows <code>cache-dependency-path: desktop/package-lock.json</code> even though the YAML lists two files. Reading the log instead of the YAML at that commit is how one ends up hashing the wrong set.</li>
<li><strong>The target.</strong> The key quoted above as the target, <code>699ec67c…</code>, does not appear in any job log of run 32662461744 as it exists today; whichever run it came from, the method was right and the inputs were not.</li>
<li><strong>Windows.</strong> On <code>windows-latest</code>, checkout leaves <code>core.autocrlf=true</code> (lesson 2.3), so the lockfiles on disk have <code>\\r\\n</code> line endings and different bytes — and therefore a different key. Linux and macOS share one cache entry; Windows has its own. That is not a bug, but it is the answer to "why does the Windows job always miss the cache the others hit?".</li>
</ul>
<h3>What the failure is worth</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a key you wrote</span><span class="lz-t">predictable</span><span class="lz-d"><code>nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles(...) }}</code> — computed offline in 3.4, matched exactly. You can answer "will this invalidate?" from the file</span></div>
<div class="lz-step"><span class="lz-k">the built-in key</span><span class="lz-t">predictable too (corrected)</span><span class="lz-d">originally described here as "visible in the log after the fact, not derivable from the workflow. Eight attempts, no match". Re-measured 24/09/2026: it is <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> + <code>hashFiles(cache-dependency-path)</code>, in the listed order, over the bytes on the runner&#39;s disk (CRLF on Windows). Reproduced exactly on the sandbox and on run 32662461744</span></div>
</div>

<div class="callout ok">
<p><strong>The usable conclusion, corrected.</strong> <code>cache: 'npm'</code> is one line and works, and for most workflows that is the right trade. The original text said that when you need to <em>reason</em> about invalidation — "why did this cache not refresh after I changed the lockfile", "why are two jobs colliding on one entry" — a key you wrote is debuggable from the file and this one is not. The second half is wrong: this key is just as debuggable, once you know it is <code>hashFiles()</code> of exactly the files in <code>cache-dependency-path</code>, and you can read it from the log (or, on v7, from the <code>cache-primary-key</code> output). What remains true is that you cannot <em>shape</em> it — add the Node version, split per job, set your own <code>restore-keys</code>. Reach for an explicit <code>actions/cache</code> when you need to control the key, not merely understand it (Chapter 5).</p>
</div>

<div class="pitfall">
<p><strong>Trap — the two caches do different things, and people expect the wrong one.</strong> <code>setup-node</code>&#39;s <code>cache:</code> caches the <strong>package manager&#39;s download directory</strong> — <code>~/.npm</code> — not <code>node_modules</code>. So <code>npm ci</code> still runs, still deletes and rebuilds <code>node_modules</code>, and still takes real time; what it skips is the network fetch. Measured on the desktop job in 2.3, <code>npm ci</code> ran in 38 to 107 seconds <em>with</em> that cache active. If you expected "cached dependencies" to mean "no install step", this is where that expectation breaks.</p>
</div>

<h3>Measured: miss, save, hit — and <code>npm ci</code> still runs</h3>
${slide('ga-04', 23, 'A miss saves in Post, a hit skips saving — and npm ci STILL runs')}
<p>The sandbox workflow ran twice on the same commit — once on push, once by <code>gh workflow run</code> — to capture both halves of the cycle:</p>
<div class="out"># run 1 (push) — 36000264687                       # run 2 (dispatch) — 36000590425
npm cache is not found                             Cache hit for: node-cache-Linux-x64-npm-d94a99a0…
cache-hit = false                                  Cache Size: ~0 MB (362465 B)
added 2 packages, audited 3 in 815ms               cache-hit = true
real 0m0.911s                                      added 2 packages, audited 3 in 786ms
Post: Sent 362465 of 362465 (100.0%)               real 0m0.856s
Cache saved with the key: node-cache-Linux-x64-    Cache hit occurred on the primary key …,
  npm-d94a99a05ccf72b4…                              not saving cache.</div>
<ul>
<li><strong>Saving happens in the post step</strong> (lesson 4.1&#39;s reverse-order cleanup), and only after a miss. A hit prints "not saving cache" — the entry is immutable, which is why a key must change when its content should.</li>
<li><strong><code>npm ci</code> ran both times</strong> and took about the same time. With two tiny packages the download is nothing, so the cache saves nothing — an honest measurement, not a failure. On the desktop job measured in 2.3, with hundreds of packages, the saving is the network fetch and <code>npm ci</code> still took 38–107 seconds.</li>
<li><strong>What is cached is <code>~/.npm</code></strong> (<code>npm config get cache</code> printed <code>/home/runner/.npm</code>), never <code>node_modules</code>.</li>
</ul>
<h3>A dead cache, found in the same log</h3>
<p>The run being examined also printed this, from a different cache step:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>That is <code>deploy-ghcr.yml</code>&#39;s backend cache, which caches <code>node_modules/.cache</code> — a path this project does not create. The step has never saved anything and never will. It costs almost no time and does nothing, which is exactly why it survived: a cache that silently does nothing looks identical to a cache that is working.</p>

<div class="callout">
<p><strong>The check is one line in the log.</strong> Every <code>actions/cache</code> step prints either a hit, a miss with the key, or that warning. Reading those three lines after adding a cache is the difference between having a cache and believing you have one — and Chapter 5 measures what the working ones are actually worth.</p>
</div>

<div class="callout ok">
<h3>The same shape for Python, Java, Go and .NET</h3>
${slide('ga-04', 24, 'The setup-* family: version → tool cache → dependency cache')}
<table>
<thead><tr><th>Action</th><th>Declare the version</th><th>Built-in cache</th><th>What gets cached</th></tr></thead>
<tbody>
<tr><td><code>setup-node</code></td><td><code>node-version</code> / <code>node-version-file</code></td><td><code>cache: npm|yarn|pnpm</code></td><td>the package manager&#39;s download store</td></tr>
<tr><td><code>setup-python</code></td><td><code>python-version</code> / <code>python-version-file</code></td><td><code>cache: pip|pipenv|poetry</code></td><td>pip&#39;s download cache</td></tr>
<tr><td><code>setup-java</code></td><td><code>java-version</code> + <code>distribution</code> (required)</td><td><code>cache: maven|gradle|sbt</code></td><td><code>~/.m2</code>, <code>~/.gradle</code> caches</td></tr>
<tr><td><code>setup-go</code></td><td><code>go-version</code> / <code>go-version-file</code></td><td>on by default</td><td>module and build cache</td></tr>
<tr><td><code>setup-dotnet</code></td><td><code>dotnet-version</code></td><td><code>cache: true</code></td><td>NuGet packages</td></tr>
</tbody>
</table>
<p>Learn one and you know the others: a version input (prefer a file the project already has), a tool-cache lookup that is fast when it hits, and an optional dependency cache keyed on the lockfile.</p>

<p><strong>The one sentence, corrected.</strong> <code>setup-*</code> actions buy you a declared toolchain for one to twenty seconds, and their built-in caching buys convenience with a key you <em>can</em> compute — <code>hashFiles()</code> of the files you listed, in order, as they sit on that runner&#39;s disk — which an earlier version of this sentence denied, and which is exactly what you need on the day the cache is the thing you have to debug.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: What does <code>cache: npm</code> in setup-node actually cache, and how is the key built?</strong><br>A: The npm download cache (<code>~/.npm</code>), not <code>node_modules</code>. The key is <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> plus <code>hashFiles()</code> of the lockfile(s) in <code>cache-dependency-path</code>. It is saved in the post step after a miss and never overwritten, so it refreshes only when the lockfile changes.</p>
<p><strong>Q: The Windows leg of your matrix never hits the cache the Linux legs share. Why?</strong><br>A: Different prefix (<code>Windows-x64</code>) — and even the hash differs, because checkout on Windows converts line endings (<code>core.autocrlf=true</code>), so the lockfile bytes differ. Each OS has its own entry; that is expected.</p>
<p><strong>Q: How do you make CI use the same Node version as developers?</strong><br>A: Put it in <code>.nvmrc</code> (or <code>engines</code>) and use <code>node-version-file</code>, so the workflow and the project cannot disagree silently; quote versions if you write them in YAML.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team argues whether <code>cache: npm</code> "does anything". Settle it with two runs and one hash.</p><ol>
<li>Add a <code>.nvmrc</code> containing <code>22</code> and a job using <code>actions/setup-node</code> with <code>node-version-file: .nvmrc</code>, <code>cache: npm</code> and an <code>id:</code>.</li>
<li>Add a step printing <code>steps.&lt;id&gt;.outputs.cache-hit</code>, <code>steps.&lt;id&gt;.outputs.cache-primary-key</code> (setup-node v7; on older versions read the key from the log) and <code>hashFiles('package-lock.json')</code>, then <code>time npm ci</code>.</li>
<li>Push, then re-run with <code>gh workflow run</code> (add <code>workflow_dispatch:</code>) or "Re-run all jobs".</li>
<li>Find "Cache saved with the key" in run 1&#39;s post step and "Cache hit for" in run 2.</li>
<li>Bonus: add a second job with <code>node-version: '20.10.0'</code> and compare the setup-node step durations.</li></ol>
<p><strong>Done when:</strong> the key&#39;s last 64 characters equal your <code>hashFiles</code> output; run 1 shows <code>cache-hit=false</code> and a save, run 2 shows <code>true</code> and "not saving cache"; and you can state, with your two <code>npm ci</code> times, how much the cache saved on your project.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tool cache</span><span class="v"><code>/opt/hostedtoolcache</code>: language versions preinstalled in the runner image. A hit is a PATH change.</span></div>
  <div class="kv"><span class="k"><code>node-version-file</code></span><span class="v">Reads the version from <code>.nvmrc</code>/<code>package.json</code> so project and CI agree.</span></div>
  <div class="kv"><span class="k"><code>check-latest</code></span><span class="v"><code>false</code> by default: use the tool-cache version if it satisfies the spec.</span></div>
  <div class="kv"><span class="k"><code>cache-dependency-path</code></span><span class="v">Files hashed into the cache key (multi-line list = several files, order matters).</span></div>
  <div class="kv"><span class="k"><code>hashFiles()</code></span><span class="v">SHA-256 of the concatenated SHA-256 of each file — the same function setup-node uses.</span></div>
  <div class="kv"><span class="k">Primary key / cache hit</span><span class="v">The exact key tried first; a hit restores it and skips saving.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line endings (<code>\\r\\n</code>); change file bytes, so hashes and cache keys differ per OS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A version in the runner&#39;s tool cache costs ~1 s; anything else is downloaded (4–5 s on the sandbox, 11–22 s in api-backend&#39;s build).</li>
<li>The tool cache changes with the runner image — pin through <code>.nvmrc</code>/<code>node-version-file</code>.</li>
<li>setup-node&#39;s cache key is <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> + <code>hashFiles(cache-dependency-path)</code> — reproduced exactly; the earlier "cannot reproduce" was wrong files, not a secret algorithm.</li>
<li>Windows gets a different key because checkout converts line endings.</li>
<li>The cache holds <code>~/.npm</code>; <code>npm ci</code> always runs; saving happens in post, only after a miss.</li>
<li>Need to shape the key? Use <code>actions/cache</code> (Chapter 5).</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — README</span><span class="lc-sub">github.com/actions/setup-node — <code>node-version-file</code>, the <code>cache</code> and <code>cache-dependency-path</code> inputs, and the statement of which directory is cached (the package manager&#39;s, not <code>node_modules</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — src/cache-restore.ts</span><span class="lc-sub">github.com/actions/setup-node — the source that computes the key measured against above. When a documented description leaves the exact algorithm open, this is where the answer is, and reading it is the next step after eight failed guesses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README, cache hits and misses</span><span class="lc-sub">github.com/actions/cache — the three log lines to look for after adding a cache, including the path-validation warning that identified the dead cache above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm ci versus npm install, and what ~/.npm holds</span><span class="lc-sub">/courses/nodejs/learn${REF} — why <code>npm ci</code> still costs time with a warm download cache, which is the mechanism behind the pitfall above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — a cache that silently never hits</span><span class="lc-sub">/courses/redis/learn${REF} — the same failure shape in a different system: a key that never matches produces correct behaviour and no error, and only a hit-rate measurement finds it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Các action <code>setup-*</code>, và một cái khoá tôi KHÔNG tái lập được</h2>
<p class="lead">Sáu trong hai mươi mốt lượt dùng action của kho này là <code>actions/setup-node</code>. Nó làm hai việc tách biệt — cài một phiên bản bộ công cụ, và cache phần tải phụ thuộc — và việc thứ hai hoá ra là việc thú vị hơn để đi điều tra, bởi cuộc điều tra ấy THẤT BẠI.</p>

<h3>Phần cài đặt tốn gì</h3>
${slide('ga-04', 20, 'setup-node: bản có sẵn mất 1 giây, bản phải tải mất 4–5 giây')}
<p>Cùng chuyện đó đo trên sân tập, nơi con số đủ nhỏ để thấy cơ chế (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264687" target="_blank" rel="noopener">36000264687</a>). Một job xin <code>node-version: 22</code>, một job xin <code>'20.10.0'</code>:</p>
<div class="out"># job cache-npm — node-version: 22                    (bước: 1 giây)
Found in cache @ /opt/hostedtoolcache/node/22.23.2/x64
tool cache co san : 22.23.2 24.21.0

# job tai-ve — node-version: '20.10.0'                  (bước: 4–5 giây)
Attempting to download 20.10.0...
Acquiring 20.10.0 - x64 from https://github.com/actions/node-versions/releases/download/20.10.0-6972104774/node-20.10.0-linux-x64.tar.gz
Extracting ...
Adding to the cache ...
/opt/hostedtoolcache/node/20.10.0/x64/bin/node</div>
<p>"Tool cache" (<code>/opt/hostedtoolcache</code>) là một thư mục nướng sẵn trong ảnh runner với vài phiên bản của mỗi ngôn ngữ. Xin trúng một bản trong đó thì chỉ là đổi <code>PATH</code>; xin bản khác là tải từ <code>actions/node-versions</code>. Và bộ ấy không cố định: lần chạy thứ hai của cùng workflow, ba phút sau, rơi vào một ảnh CŨ hơn (<code>20260907.300.1</code> thay vì <code>20260920.314.1</code>) và tool cache báo <code>22.23.2 24.20.0</code> thay vì <code>22.23.2 24.21.0</code>. Xin <code>24</code> ở cả hai là bạn nhận hai bản vá Node khác nhau — cả hai đều "đúng", và thêm một lý do để ghim thứ quan trọng trong một tệp (<code>.nvmrc</code>) thay vì tin ảnh runner.</p>
<div class="pitfall">
<p><strong>Bẫy — <code>node-version: 22</code> nghĩa là "22.x mới nhất TRONG TOOL CACHE", không phải "22.x mới nhất".</strong> Mặc định <code>check-latest</code> là <code>false</code>, nên setup-node vui vẻ dùng bản 22.x mà ảnh mang theo, có thể cũ vài tuần. Thường đó đúng là thứ bạn muốn (nhanh, tái lập được suốt đời của ảnh). Nếu cần bản vá mới nhất ngay hôm nó ra, đặt <code>check-latest: true</code> và chấp nhận tải về ở phần lớn các lần chạy.</p>
</div>
<p>Từ run 32662461744, bước <code>setup-node</code> trên từng nền tảng:</p>

<div class="out">Linux    13s
macOS    11s
Windows  22s</div>

<p>Nó mua cho bạn một phiên bản Node CỤ THỂ thay vì bất cứ thứ gì ảnh runner tình cờ mang theo — đúng luận điểm của bài 2.1 về việc KHAI BÁO thay vì thừa kế. Mười một tới hai mươi hai giây là cái giá để workflow của bạn sở hữu phiên bản bộ công cụ của nó, thay vì để lịch triển khai ảnh của GitHub sở hữu.</p>

<div class="kv-grid">
<div class="kv"><span class="k">đã có sẵn trong tool cache</span><span class="v">ảnh runner cài sẵn vài phiên bản Node. Xin một trong số đó chỉ là đổi đường dẫn, và đó là ca NHANH</span></div>
<div class="kv"><span class="k">không có trong tool cache</span><span class="v">nó tải về rồi giải nén — hàng chục giây, và thay đổi. Ghim một phiên bản vá chính xác thì dễ trượt tập cài sẵn hơn là ghim một số major</span></div>
<div class="kv"><span class="k"><code>node-version-file:</code></span><span class="v">đọc <code>.nvmrc</code> hoặc <code>engines</code> trong <code>package.json</code>. Tốt hơn một hằng viết thẳng, vì nó chặn chuyện workflow và dự án bất đồng về phiên bản một cách âm thầm</span></div>
<div class="kv"><span class="k">cùng một hình dạng ở mọi nơi</span><span class="v"><code>setup-python</code>, <code>setup-go</code>, <code>setup-java</code>, <code>setup-dotnet</code> đều hoạt động y hệt — tham số phiên bản, tool cache, và một cache phụ thuộc tuỳ chọn</span></div>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">xin một phiên bản</span><span class="lz-t"><code>node-version: &#39;22&#39;</code></span><span class="lz-d">action tìm trong tool cache của runner trước</span></div>
<div class="lz-step"><span class="lz-k">đã có sẵn</span><span class="lz-t">chỉ đổi PATH</span><span class="lz-d">ca NHANH: các số major cài sẵn gần như không tốn gì</span></div>
<div class="lz-step"><span class="lz-k">chưa có</span><span class="lz-t">tải về rồi giải nén</span><span class="lz-d">ghim một phiên bản vá chính xác thì dễ rơi vào đây — 11 tới 22 giây, đo thật</span></div>
</div>

<h3>Cuộc điều tra, và vì sao nó thất bại</h3>
<p>Bài 3.4 tái lập <code>hashFiles()</code> và kiểm chứng nó với một khoá cache thật, khớp chính xác. Vậy thì cùng phương pháp ấy phải chạy được với cache dựng sẵn của <code>setup-node</code>. Workflow tại commit đó khai đúng thứ cần băm:</p>

<pre><code>- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
    cache-dependency-path: |
      package-lock.json
      frontend/package-lock.json</code></pre>

<p>Và log của lần chạy ấy in ra cái khoá nó tính được:</p>

<div class="out">Cache hit occurred on the primary key
  node-cache-Linux-x64-npm-699ec67c02f94027efff6b4cd1c7f842cbaa689063c4d900c963e39ac11c4c6a</div>

<p>Tám cách tính ứng viên, tất cả tại đúng commit mà lần chạy ấy dùng:</p>

<div class="out">cach tinh                          ket qua
------------------------------------------------------------
hashFiles(chi goc)                 a505030c00af033c...
hashFiles(goc + frontend)          dc25e40311e9cacb...
hashFiles(chi frontend)            e3a98579f5ab829e...
hashFiles(tat ca **/)              dc25e40311e9cacb...
noi HEX thay vi nhi phan           7e9417715d1fe848...
noi NOI DUNG roi bam mot lan       6f426dc0c0a29a69...
thu tu nguoc                       dc25e40311e9cacb...
chi frontend, noi hex              1228ac54b1780ee7...

muc tieu (tu log that)             699ec67c02f94027...</div>

<div class="callout warn">
<p><strong>Không cái nào khớp. Đó là KẾT QUẢ, và nó đang được báo cáo đúng như một kết quả.</strong>
</p>
</div>
<div class="callout warn">
<p><strong>Đính chính (24/09/2026): kết luận bên dưới dòng này đã SAI.</strong> Đoạn tiếp theo được giữ nguyên như lúc viết, vì cách nó sai là phần hữu ích nhất của bài. <code>setup-node</code> KHÔNG tính khoá "theo một cách khác" — khoá là <code>hashFiles()</code> của các tệp phụ thuộc, và giờ đã được tái lập đủ 64 ký tự, cả trên sân tập lẫn trên CHÍNH lần chạy mà cuộc điều tra này nói tới. Mục kế tiếp cho thấy làm thế nào, và vì sao tám lần đoán trượt.</p>
</div>
<div class="callout">
<p><strong>Nguyên văn lúc đầu:</strong> Bản tái lập <code>hashFiles()</code> thì đã biết là ĐÚNG — bài 3.4 kiểm chứng nó tới cả sáu mươi tư ký tự với một khoá <code>actions/cache</code> lấy từ chính lần chạy này. Nên khác biệt không nằm ở cách tôi băm; <code>setup-node</code> tính khoá của nó theo một cách khác, và tám phỏng đoán hợp lý đã không tìm ra.</p>
</div>

<h3>Đo lại: khoá LÀ <code>hashFiles()</code>, đủ 64 ký tự</h3>
${slide('ga-04', 21, 'Khoá cache của setup-node = hashFiles(lockfile) — tính được')}
<p>Bắt đầu từ mã nguồn thay vì đoán. Trong <code>actions/setup-node</code>, <code>src/cache-restore.ts</code> ngắn và giống hệt nhau ở v4 lẫn v7.0.0:</p>
<pre><code class="language-ts">const lockFilePath = cacheDependencyPath ? cacheDependencyPath : findLockFile(packageManagerInfo);
const fileHash = await glob.hashFiles(lockFilePath);
const keyPrefix = &#96;node-cache-&#36;{platform}-&#36;{arch}-&#36;{packageManager}&#96;;   // platform = RUNNER_OS
const primaryKey = &#96;&#36;{keyPrefix}-&#36;{fileHash}&#96;;</code></pre>
<p>Vậy khoá là <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> nối với đúng cái hash mà biểu thức <code>hashFiles()</code> tính: SHA-256 trên chuỗi nối các digest SHA-256 của từng tệp khớp, theo thứ tự. Kiểm điều đó trên sân tập bằng cách in hai thứ cạnh nhau (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264687" target="_blank" rel="noopener">36000264687</a>):</p>
<pre><code class="language-yaml">- id: node
  uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
  with:
    node-version: 22
    cache: npm
    cache-dependency-path: ch04/app/package-lock.json
- run: |
    echo "cache-primary-key = &#36;{{ steps.node.outputs.cache-primary-key }}"
    echo "hashFiles(lock)   = &#36;{{ hashFiles('ch04/app/package-lock.json') }}"</code></pre>
<div class="out">cache-primary-key = node-cache-Linux-x64-npm-d94a99a05ccf72b4f0b7a3ac3d95ce861b43b23510dd5c837e5f00473739622d
hashFiles(lock)   =                      d94a99a05ccf72b4f0b7a3ac3d95ce861b43b23510dd5c837e5f00473739622d</div>
<p>Giống hệt. (Output <code>cache-primary-key</code> mới có ở setup-node v7 — v4 tới v6 chỉ trả <code>cache-hit</code> và <code>node-version</code>, nên với các bản đó bạn đọc khoá từ dòng log "Cache hit for:" hoặc "Cache saved with the key:".)</p>

<h3>Vì sao tám lần đoán trượt: sai tệp, và CRLF</h3>
${slide('ga-04', 22, 'Tái lập khoá cũ của api-backend: Windows khác vì CRLF')}
<p>Quay lại run 32662461744 (<code>desktop-release.yml</code>, commit <code>6a121bac</code>). Log của nó, đọc lại hôm nay, chứa các khoá này:</p>
<div class="out">Kiem tra ma   : node-cache-Linux-x64-npm-1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
Dung Linux    : node-cache-Linux-x64-npm-1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
Dung macOS    : node-cache-macOS-arm64-npm-1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
Dung Windows  : node-cache-Windows-x64-npm-c7c75d0c735a00d8ae15c9c7cf495362f44d85069f2a9c622f684a37fee284e1</div>
<p>Workflow ở commit đó băm <code>desktop/package-lock.json</code> và <code>frontend/package-lock.json</code> — không phải <code>package-lock.json</code> ở GỐC, thứ mà cả tám lần đoán đều bắt đầu từ đó. Tính lại ngoại tuyến từ git, cùng thuật toán:</p>
<pre><code class="language-js">// node -e … trong kho api-backend
const h = (files, crlf) =&gt; { const r = crypto.createHash('sha256');
  for (const f of files) { let b = execSync(&#96;git show 6a121bac:&#36;{f}&#96;);
    if (crlf) b = Buffer.from(b.toString().replace(/\\r?\\n/g, '\\r\\n'));
    r.update(crypto.createHash('sha256').update(b).digest()); }
  return r.digest('hex'); };</code></pre>
<div class="out">desktop                     103d6815979fe3f5...
desktop + frontend          1271543c845c4810...   = Linux, macOS  ✓
frontend + desktop          d216f38018999ba9...   (thứ tự CÓ ý nghĩa)
desktop + frontend, CRLF    c7c75d0c735a00d8...   = Windows       ✓</div>
<ul>
<li><strong>Sai tệp.</strong> Log của job chỉ in <em>DÒNG ĐẦU</em> của một giá trị <code>with:</code> nhiều dòng — nó hiện <code>cache-dependency-path: desktop/package-lock.json</code> dù YAML liệt kê hai tệp. Đọc log thay vì đọc YAML ở đúng commit là cách người ta băm nhầm bộ tệp.</li>
<li><strong>Cái đích.</strong> Khoá được trích bên trên làm đích, <code>699ec67c…</code>, không xuất hiện trong log job nào của run 32662461744 như chúng tồn tại hôm nay; dù nó tới từ run nào, phương pháp thì đúng còn đầu vào thì sai.</li>
<li><strong>Windows.</strong> Trên <code>windows-latest</code>, checkout để <code>core.autocrlf=true</code> (bài 2.3), nên tệp lock trên đĩa có đuôi dòng <code>\\r\\n</code> và bytes khác — tức là khoá khác. Linux với macOS dùng chung một mục cache; Windows có mục riêng. Đó không phải lỗi, nhưng nó là câu trả lời cho "vì sao job Windows luôn trượt cái cache mà các job khác trúng?".</li>
</ul>
<h3>Cú thất bại ấy đáng giá gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">khoá bạn tự viết</span><span class="lz-t">đoán được</span><span class="lz-d"><code>nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles(...) }}</code> — tính ngoại tuyến ở bài 3.4, khớp chính xác. Bạn trả lời được câu "cái này có hết hiệu lực không?" ngay từ tệp</span></div>
<div class="lz-step"><span class="lz-k">khoá dựng sẵn</span><span class="lz-t">cũng ĐOÁN ĐƯỢC (đã đính chính)</span><span class="lz-d">lúc đầu mô tả ở đây là "nhìn thấy trong log SAU KHI đã chạy, không suy ra được từ workflow. Tám lần thử, không khớp". Đo lại 24/09/2026: nó là <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> + <code>hashFiles(cache-dependency-path)</code>, theo thứ tự liệt kê, trên bytes nằm trên đĩa runner (CRLF trên Windows). Tái lập chính xác trên sân tập và trên run 32662461744</span></div>
</div>

<div class="callout ok">
<p><strong>Kết luận dùng được, đã đính chính.</strong> <code>cache: 'npm'</code> chỉ một dòng và nó chạy được, và với phần lớn workflow thì đó là đánh đổi đúng. Bản gốc nói rằng khi bạn cần <em>LẬP LUẬN</em> về việc hết hiệu lực — "vì sao cache này không làm mới sau khi tôi đổi tệp khoá", "vì sao hai job va nhau trên một mục" — thì một cái khoá bạn tự viết gỡ lỗi được từ tệp còn cái này thì không. Nửa sau SAI: khoá này gỡ lỗi được y như vậy, một khi bạn biết nó là <code>hashFiles()</code> của đúng các tệp trong <code>cache-dependency-path</code>, và bạn đọc được nó từ log (hoặc, với v7, từ output <code>cache-primary-key</code>). Điều vẫn đúng là bạn không <em>NẶN</em> được nó — thêm phiên bản Node, tách theo job, đặt <code>restore-keys</code> riêng. Hãy với tay tới một <code>actions/cache</code> tường minh khi bạn cần ĐIỀU KHIỂN khoá, chứ không chỉ để hiểu nó (Chương 5).</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — hai cái cache làm hai việc khác nhau, và người ta trông đợi nhầm cái.</strong> <code>cache:</code> của <code>setup-node</code> cache <strong>thư mục TẢI VỀ của trình quản lý gói</strong> — <code>~/.npm</code> — chứ không cache <code>node_modules</code>. Nên <code>npm ci</code> vẫn chạy, vẫn xoá rồi dựng lại <code>node_modules</code>, và vẫn tốn thời gian thật; thứ nó bỏ qua là lượt tải qua mạng. Đo trên job desktop ở bài 2.3, <code>npm ci</code> chạy mất 38 tới 107 giây <em>TRONG KHI</em> cache ấy đang hoạt động. Nếu bạn trông đợi "phụ thuộc đã cache" nghĩa là "không có bước cài", thì đây là chỗ trông đợi ấy vỡ.</p>
</div>

<h3>Đo thật: trượt, lưu, trúng — và <code>npm ci</code> VẪN chạy</h3>
${slide('ga-04', 23, 'Trượt thì lưu ở Post, trúng thì bỏ qua — và npm ci VẪN chạy')}
<p>Workflow của sân tập chạy hai lần trên cùng một commit — một lần do push, một lần do <code>gh workflow run</code> — để bắt đủ hai nửa của vòng:</p>
<div class="out"># lần 1 (push) — 36000264687                       # lần 2 (dispatch) — 36000590425
npm cache is not found                             Cache hit for: node-cache-Linux-x64-npm-d94a99a0…
cache-hit = false                                  Cache Size: ~0 MB (362465 B)
added 2 packages, audited 3 in 815ms               cache-hit = true
real 0m0.911s                                      added 2 packages, audited 3 in 786ms
Post: Sent 362465 of 362465 (100.0%)               real 0m0.856s
Cache saved with the key: node-cache-Linux-x64-    Cache hit occurred on the primary key …,
  npm-d94a99a05ccf72b4…                              not saving cache.</div>
<ul>
<li><strong>Việc LƯU diễn ra ở bước post</strong> (phần dọn ngược của bài 4.1), và chỉ sau một lần trượt. Trúng thì in "not saving cache" — mục cache không sửa được, nên khoá phải đổi khi nội dung cần đổi.</li>
<li><strong><code>npm ci</code> chạy cả hai lần</strong> và tốn gần bằng nhau. Với hai gói tí hon thì phần tải chẳng đáng gì, nên cache chẳng tiết kiệm gì — một phép đo trung thực, không phải thất bại. Trên job desktop đo ở bài 2.3, với hàng trăm gói, phần tiết kiệm là lượt tải mạng còn <code>npm ci</code> vẫn tốn 38–107 giây.</li>
<li><strong>Thứ được cache là <code>~/.npm</code></strong> (<code>npm config get cache</code> in ra <code>/home/runner/.npm</code>), không bao giờ là <code>node_modules</code>.</li>
</ul>
<h3>Một cái cache CHẾT, tìm thấy trong cùng log</h3>
<p>Lần chạy đang được soi cũng in ra dòng này, từ một bước cache khác:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>Đó là cache backend của <code>deploy-ghcr.yml</code>, thứ cache <code>node_modules/.cache</code> — một đường dẫn mà dự án này KHÔNG tạo ra. Bước ấy chưa bao giờ lưu gì và sẽ không bao giờ lưu. Nó gần như không tốn thời gian và không làm gì, và đó chính xác là lý do nó sống sót: một cái cache âm thầm chẳng làm gì trông y hệt một cái cache đang chạy tốt.</p>

<div class="callout">
<p><strong>Phép kiểm chỉ là một dòng trong log.</strong> Mọi bước <code>actions/cache</code> đều in ra hoặc một lần trúng, hoặc một lần trượt kèm khoá, hoặc cái cảnh báo kia. Đọc ba dòng ấy sau khi thêm một cache là khác biệt giữa việc CÓ một cái cache và việc TIN rằng mình có — và Chương 5 đo xem những cái đang chạy thật thì đáng bao nhiêu.</p>
</div>

<div class="callout ok">
<h3>Cùng một khuôn cho Python, Java, Go và .NET</h3>
${slide('ga-04', 24, 'Họ setup-*: phiên bản → tool cache → cache phụ thuộc')}
<table>
<thead><tr><th>Action</th><th>Khai phiên bản</th><th>Cache dựng sẵn</th><th>Thứ được cache</th></tr></thead>
<tbody>
<tr><td><code>setup-node</code></td><td><code>node-version</code> / <code>node-version-file</code></td><td><code>cache: npm|yarn|pnpm</code></td><td>kho tải về của trình quản lý gói</td></tr>
<tr><td><code>setup-python</code></td><td><code>python-version</code> / <code>python-version-file</code></td><td><code>cache: pip|pipenv|poetry</code></td><td>cache tải về của pip</td></tr>
<tr><td><code>setup-java</code></td><td><code>java-version</code> + <code>distribution</code> (bắt buộc)</td><td><code>cache: maven|gradle|sbt</code></td><td>cache <code>~/.m2</code>, <code>~/.gradle</code></td></tr>
<tr><td><code>setup-go</code></td><td><code>go-version</code> / <code>go-version-file</code></td><td>bật sẵn</td><td>cache module và cache dựng</td></tr>
<tr><td><code>setup-dotnet</code></td><td><code>dotnet-version</code></td><td><code>cache: true</code></td><td>gói NuGet</td></tr>
</tbody>
</table>
<p>Học một cái là biết các cái kia: một input phiên bản (ưu tiên một tệp dự án đã có sẵn), một lần tra tool cache nhanh khi trúng, và một cache phụ thuộc tuỳ chọn có khoá theo lockfile.</p>

<p><strong>Một câu, đã đính chính.</strong> Các action <code>setup-*</code> mua cho bạn một bộ công cụ ĐƯỢC KHAI BÁO với giá một tới hai mươi giây, còn phần cache dựng sẵn của chúng mua sự tiện lợi với một cái khoá bạn <em>TÍNH RA ĐƯỢC</em> — <code>hashFiles()</code> của các tệp bạn liệt kê, theo thứ tự, như chúng nằm trên đĩa của runner ấy — điều mà bản trước của câu này phủ nhận, và đó đúng là thứ bạn cần vào cái ngày chính cái cache là thứ phải gỡ lỗi.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: <code>cache: npm</code> của setup-node thật ra cache cái gì, và khoá dựng ra sao?</strong><br>Đ: Cache tải về của npm (<code>~/.npm</code>), không phải <code>node_modules</code>. Khoá là <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> cộng <code>hashFiles()</code> của (các) lockfile trong <code>cache-dependency-path</code>. Nó được lưu ở bước post sau một lần trượt và không bao giờ bị ghi đè, nên chỉ làm mới khi lockfile đổi.</p>
<p><strong>H: Nhánh Windows trong ma trận không bao giờ trúng cái cache mà các nhánh Linux dùng chung. Vì sao?</strong><br>Đ: Tiền tố khác (<code>Windows-x64</code>) — và cả hash cũng khác, vì checkout trên Windows đổi đuôi dòng (<code>core.autocrlf=true</code>), nên bytes của lockfile khác. Mỗi hệ điều hành có mục riêng; đó là điều bình thường.</p>
<p><strong>H: Làm sao cho CI dùng đúng bản Node như lập trình viên?</strong><br>Đ: Ghi nó vào <code>.nvmrc</code> (hoặc <code>engines</code>) và dùng <code>node-version-file</code>, để workflow và dự án không thể lệch nhau âm thầm; nếu viết phiên bản trong YAML thì đặt nháy.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> cả nhóm cãi nhau xem <code>cache: npm</code> "có làm gì không". Chốt bằng hai lần chạy và một cái hash.</p><ol>
<li>Thêm <code>.nvmrc</code> chứa <code>22</code> và một job dùng <code>actions/setup-node</code> với <code>node-version-file: .nvmrc</code>, <code>cache: npm</code> và một <code>id:</code>.</li>
<li>Thêm một bước in <code>steps.&lt;id&gt;.outputs.cache-hit</code>, <code>steps.&lt;id&gt;.outputs.cache-primary-key</code> (setup-node v7; bản cũ hơn thì đọc khoá trong log) và <code>hashFiles('package-lock.json')</code>, rồi <code>time npm ci</code>.</li>
<li>Push, rồi chạy lại bằng <code>gh workflow run</code> (thêm <code>workflow_dispatch:</code>) hoặc "Re-run all jobs".</li>
<li>Tìm "Cache saved with the key" ở bước post của lần 1 và "Cache hit for" ở lần 2.</li>
<li>Thêm điểm: thêm job thứ hai với <code>node-version: '20.10.0'</code> và so thời gian bước setup-node.</li></ol>
<p><strong>Đạt khi:</strong> 64 ký tự cuối của khoá trùng output <code>hashFiles</code> của bạn; lần 1 cho <code>cache-hit=false</code> và một lần lưu, lần 2 cho <code>true</code> và "not saving cache"; và bạn nói được, bằng hai con số <code>npm ci</code>, cache tiết kiệm bao nhiêu trên dự án của mình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tool cache</span><span class="v"><code>/opt/hostedtoolcache</code>: các phiên bản ngôn ngữ cài sẵn trong ảnh runner. Trúng thì chỉ đổi PATH.</span></div>
  <div class="kv"><span class="k"><code>node-version-file</code></span><span class="v">Đọc phiên bản từ <code>.nvmrc</code>/<code>package.json</code> để dự án và CI khớp nhau.</span></div>
  <div class="kv"><span class="k"><code>check-latest</code></span><span class="v">Mặc định <code>false</code>: dùng bản trong tool cache nếu nó thoả điều kiện.</span></div>
  <div class="kv"><span class="k"><code>cache-dependency-path</code></span><span class="v">Các tệp được băm vào khoá cache (danh sách nhiều dòng = nhiều tệp, thứ tự có ý nghĩa).</span></div>
  <div class="kv"><span class="k"><code>hashFiles()</code></span><span class="v">SHA-256 của chuỗi nối SHA-256 từng tệp — chính hàm setup-node dùng.</span></div>
  <div class="kv"><span class="k">Primary key / cache hit</span><span class="v">Khoá chính xác được thử trước; trúng thì khôi phục và bỏ qua việc lưu.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Đuôi dòng Windows (<code>\\r\\n</code>); đổi bytes của tệp, nên hash và khoá cache khác theo hệ điều hành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phiên bản có trong tool cache của runner tốn ~1 giây; bản khác phải tải (4–5 giây trên sân tập, 11–22 giây trong bản dựng của api-backend).</li>
<li>Tool cache đổi theo ảnh runner — ghim qua <code>.nvmrc</code>/<code>node-version-file</code>.</li>
<li>Khoá cache của setup-node là <code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> + <code>hashFiles(cache-dependency-path)</code> — tái lập chính xác; câu "không tái lập được" trước đây là do sai tệp, không phải thuật toán bí mật.</li>
<li>Windows có khoá khác vì checkout đổi đuôi dòng.</li>
<li>Cache giữ <code>~/.npm</code>; <code>npm ci</code> luôn chạy; việc lưu diễn ra ở post, chỉ sau một lần trượt.</li>
<li>Cần nặn khoá? Dùng <code>actions/cache</code> (Chương 5).</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — README</span><span class="lc-sub">github.com/actions/setup-node — <code>node-version-file</code>, hai tham số <code>cache</code> và <code>cache-dependency-path</code>, và phát biểu thư mục nào được cache (thư mục của trình quản lý gói, KHÔNG phải <code>node_modules</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — src/cache-restore.ts</span><span class="lc-sub">github.com/actions/setup-node — mã nguồn tính ra cái khoá vừa được đối chiếu bên trên. Khi mô tả trong tài liệu để ngỏ thuật toán chính xác, đây là chỗ có đáp án, và đọc nó là bước tiếp theo sau tám lần đoán trượt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README, trúng và trượt cache</span><span class="lc-sub">github.com/actions/cache — ba dòng log cần tìm sau khi thêm một cache, gồm cả cảnh báo path-validation đã nhận diện cái cache chết bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm ci với npm install, và ~/.npm giữ cái gì</span><span class="lc-sub">/courses/nodejs/learn${REF} — vì sao <code>npm ci</code> vẫn tốn thời gian với một cache tải về đang ấm, và đó là cơ chế đứng sau cái bẫy bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — một cái cache âm thầm không bao giờ trúng</span><span class="lc-sub">/courses/redis/learn${REF} — cùng hình dạng hỏng ở một hệ thống khác: một cái khoá không bao giờ khớp thì cho ra hành vi ĐÚNG và không có lỗi nào, và chỉ một phép đo tỉ lệ trúng mới tìm ra nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Writing your own, and the drift I measured|||4.5 — Tự viết lấy, và cú trôi dạt tôi đo được',
      slug: 'ga-4-5-tu-viet',
      type: 'VIDEO',
      description: 'Chín bản chép của cùng một khối SSH 10 dòng, nằm ở chín workflow, và chúng đã trôi thành HAI phiên bản: ba dòng giữ-kết-nối có ở hai workflow, không có ở bảy cái kia. Cộng một lần tôi đo sai và phải đo lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Writing your own, and the drift I measured</h2>
<p class="lead">The argument for factoring out a repeated block is usually made on taste. Here it can be made on measurement, because this repository has nine copies of one block and they have already drifted.</p>

<h3>The measurement</h3>
${slide('ga-04', 28, 'Nine copies of one SSH block have drifted into two versions')}
<p>Nine of the eleven workflows use <code>VPS_SSH_PRIVATE_KEY</code>, and each contains a ten-line step that writes the key to disk and builds an SSH config. Comparing the <em>bodies</em> of those nine blocks, ignoring the step name:</p>

<div class="out">9 khoi 'Setup SSH key', moi khoi 10 dong
THAN khoi: 2 phien ban khac nhau

  ban 3de67690 — 7 workflow:
      e2e-message-button · fix-containers · full-deploy
      guard-no-duplicates · restart-containers · sync-frontend
      vps-cleanup-weekly

  ban 57e5f9fc — 2 workflow:
      backend-vps · deploy-ghcr</div>

<p>And the single difference between the two versions:</p>

<div class="out">-printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n'
+printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n
         ServerAliveInterval 60\\n  ServerAliveCountMax 10\\n  ConnectTimeout 30\\n'</div>

<div class="callout warn">
<p><strong>Three keep-alive lines exist in two workflows and not in the other seven.</strong> Somebody hit dropped SSH connections on a long deploy, fixed it where it hurt, and stopped — which is the entirely reasonable thing to do at the time. The result is that seven workflows still have the old behaviour, and nothing anywhere records that they are the un-fixed copies. The next person to debug a hung <code>ssh</code> in <code>vps-cleanup-weekly</code> gets to rediscover this.</p>
</div>

<div class="callout">
<p><strong>A correction, kept because it is the more useful lesson.</strong> The first version of this measurement took a sixteen-line window around each match and reported that <em>all nine copies differ</em>. That was wrong — the window was swallowing the <em>next</em> step, which is genuinely different in every workflow. Cutting the block at its real boundary gives nine copies in two versions. The wrong number was more dramatic and would have made a better story; it was also not true.</p>
</div>

<h3>The three ways to stop copying</h3>
${slide('ga-04', 25, 'Four ways to stop copying, four sizes')}
<p>The slide adds a fourth size that this lesson only names: a JavaScript or Docker action in <em>its own</em> repository, released with tags, tested, and used by many repositories. That is the right tool when several repositories or teams share the logic — and it is Chapter 12&#39;s subject, together with reusable workflows in depth (inputs and secrets, <code>workflow_call</code> outputs, versioning, and the limits). Here the goal is smaller: enough to recognise the shapes and to write the one you will need first — a composite action inside your own repository.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">composite action — <code>.github/actions/&lt;name&gt;/action.yml</code></span><span class="lz-lnote">for a repeated sequence of <em>steps</em>. Called with <code>uses: ./.github/actions/&lt;name&gt;</code>. This is the right shape for the SSH block: it is steps, it takes inputs, it belongs inside a job</span></div>
<div class="lz-layer"><span class="lz-lname">reusable workflow — <code>on: workflow_call</code></span><span class="lz-lnote">for a repeated <em>job</em> or set of jobs. Called with <code>uses:</code> at job level. Heavier: it gets its own runner, and secrets must be passed explicitly or with <code>secrets: inherit</code></span></div>
<div class="lz-layer"><span class="lz-lname">a script in the repository</span><span class="lz-lnote">the underrated option. A <code>scripts/ssh-setup.sh</code> called from one <code>run:</code> line is testable on your own machine, which neither of the other two are</span></div>
</div>

<h3>Run it step by step: a composite action in the sandbox</h3>
${slide('ga-04', 26, 'A composite action in the same repository: input in, output out')}
<p>Before the real SSH block, the smallest composite action that shows every moving part — one input, two steps, one output — in <code>.github/actions/chao-ga/action.yml</code> on the sandbox:</p>
<pre><code class="language-yaml">name: Chao GA
description: Composite action nho — gom 2 buoc, nhan 1 input, tra 1 output
inputs:
  ten:
    description: Ten nguoi duoc chao
    required: true
outputs:
  loi-chao:
    description: Cau chao da ghep
    value: &#36;{{ steps.ghep.outputs.loi-chao }}     # (1) must be wired by hand
runs:
  using: composite
  steps:
    - name: Ghep cau chao
      id: ghep                                     # (2) the id the output refers to
      shell: bash                                  # (3) mandatory on every run:
      env:
        TEN: &#36;{{ inputs.ten }}                    # (4) input -&gt; env, not into the script
      run: echo "loi-chao=Xin chao $TEN tu composite action" &gt;&gt; "$GITHUB_OUTPUT"
    - name: In noi action dang nam
      shell: bash
      run: |
        echo "action_path = &#36;{{ github.action_path }}"
        ls "&#36;{{ github.action_path }}"</code></pre>
<p>And the workflow that calls it:</p>
<pre><code class="language-yaml">steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
    with:
      persist-credentials: false
  - id: chao
    uses: ./.github/actions/chao-ga       # a path, no @ref: it is whatever this commit contains
    with:
      ten: Cuong
  - run: echo "&#36;{{ steps.chao.outputs.loi-chao }}"</code></pre>
<p>The log of run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000261759" target="_blank" rel="noopener">36000261759</a>, shortened, with the inner steps nested under one step of the caller (indentation added here for readability):</p>
<div class="out">Run ./.github/actions/chao-ga
  with:
    ten: Cuong
  Run echo "action_path = /home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/chao-ga"
  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
  action_path = /home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/chao-ga
  action.yml
Run echo "Xin chao Cuong tu composite action"
shell: /usr/bin/bash -e {0}
Xin chao Cuong tu composite action</div>
<ul>
<li><strong>Outputs are plumbing, not magic.</strong> The inner step writes to <code>$GITHUB_OUTPUT</code> as in any step; the action&#39;s <code>outputs.loi-chao.value</code> points at that step&#39;s <code>id</code>; the caller reads <code>steps.chao.outputs.loi-chao</code>. Miss any link and you get an empty string, not an error.</li>
<li><strong>Look at the two <code>shell:</code> lines.</strong> Inside the action, <code>shell: bash</code> gave <code>bash --noprofile --norc -e -o pipefail</code>; the caller&#39;s own <code>run:</code>, with no <code>shell:</code>, got <code>bash -e</code> — no <code>pipefail</code> (lesson 2.4). A composite action forces you to choose, which is one of its quiet benefits.</li>
<li><strong><code>github.action_path</code></strong> is where the action lives on disk — the place to keep a helper script next to <code>action.yml</code> and call it as <code>"&#36;{{ github.action_path }}/script.sh"</code>. For a local action it is inside your workspace; for a remote one it is under <code>_actions/</code>.</li>
<li><strong>No <code>@ref</code> on a local action.</strong> <code>./.github/actions/chao-ga</code> is whatever the checked-out commit contains — so a pull request that edits the action runs its own edited version. That is convenient for development and exactly why a local action is not a security boundary.</li>
</ul>
<h3>The composite action for that block</h3>
<pre><code><span class="tok-comment"># .github/actions/ssh-vps/action.yml</span>
name: Cai SSH toi VPS
inputs:
  host:    { required: true }
  user:    { required: true }
  khoa:    { required: true }
runs:
  using: composite
  steps:
    - shell: bash          <span class="tok-comment"># BAT BUOC tren moi run: cua composite</span>
      env:
        HOST: &#36;{{ inputs.host }}
        USER: &#36;{{ inputs.user }}
        KHOA: &#36;{{ inputs.khoa }}
      run: |
        mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh
        echo "\$KHOA" | base64 -d &gt; ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        ssh-keyscan -H "\$HOST" &gt;&gt; ~/.ssh/known_hosts 2&gt;/dev/null || true
        printf 'Host vps\\n  HostName %s\\n  User %s\\n  IdentityFile ~/.ssh/deploy_key\\n  ServerAliveInterval 60\\n' \\
          "\$HOST" "\$USER" &gt; ~/.ssh/config</code></pre>

<p>Called from any of the nine:</p>

<pre><code>- uses: ./.github/actions/ssh-vps
  with:
    host: &#36;{{ secrets.VPS_HOST }}
    user: &#36;{{ secrets.VPS_USER }}
    khoa: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="callout ok">
<p><strong>Note the secrets go through <code>with:</code> and then <code>env:</code>, never into <code>run:</code> directly</strong> — the rule from 3.1, applying here because a host name from a secret is still a value being substituted into a script. The original copies interpolate <code>&#36;{{ secrets.VPS_HOST }}</code> straight into the <code>printf</code>, which is safe only because that secret is one you set yourself.</p>
</div>

<h3>What composite actions cannot do</h3>
${slide('ga-04', 27, 'A local action only exists AFTER checkout')}
<div class="kv-grid">
<div class="kv"><span class="k"><code>shell:</code> is mandatory</span><span class="v">every <code>run:</code> inside a composite action must specify a shell. Omitting it is an error, and it is the first thing that fails when you move steps in</span></div>
<div class="kv"><span class="k">no <code>secrets</code> context</span><span class="v">a composite action cannot read <code>secrets.*</code>. Pass them as inputs — which is better, because the action then declares what it needs</span></div>
<div class="kv"><span class="k">outputs need plumbing</span><span class="v">a step output inside the action is not automatically an action output; declare it in <code>outputs:</code> with a reference to the inner step&#39;s <code>id</code></span></div>
<div class="kv"><span class="k">local path means local</span><span class="v"><code>uses: ./.github/actions/x</code> requires the repository to be checked out first. A composite action cannot be the step that runs <em>before</em> <code>checkout</code></span></div>
</div>

<div class="pitfall">
<p><strong>Trap — factoring out before the shape is known.</strong> Two copies of something is not evidence of a pattern; it is evidence of two things that currently look alike. A composite action extracted from two call sites tends to grow an input for every way the third call site differs, and ends up harder to read than the duplication it replaced. Nine copies with one axis of variation — this case — is past that threshold. Two copies is not.</p>
</div>

<h3>Measured: the local action before checkout</h3>
<p>The last row of the list above, run on purpose in the sandbox (job <code>local-truoc-checkout</code> of run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">36000264372</a>) — a job whose first step is the composite action, with no checkout:</p>
<div class="out">Prepare all required actions
Getting action download info
Complete job name: local-truoc-checkout
##[error]Can't find 'action.yml', 'action.yaml' or 'Dockerfile' under
'/home/runner/work/ga-san-tap/ga-san-tap/.github/actions/chao-ga'.
Did you forget to run actions/checkout before running your local action?</div>
<p>Two details worth noticing. Set up job did not complain — it only downloads <em>remote</em> actions, and a local path is not one — so the job starts and fails at the step. And the error message names the fix. If you want a shared action to be usable <em>before</em> checkout (or from other repositories), it has to live in a repository of its own and be referenced as <code>owner/repo/path@ref</code>; then it is downloaded in Set up job like any other action. That is the step from this lesson to Chapter 12.</p>

<h3>Refactoring the nine copies, step by step</h3>
<ol>
<li><strong>Diff the copies first</strong> (the measurement above). Decide which version is correct — here, the one with the keep-alive lines.</li>
<li><strong>Write <code>.github/actions/ssh-vps/action.yml</code></strong> from the correct copy, with secrets arriving as inputs and moved into <code>env:</code>.</li>
<li><strong>Replace one call site</strong>, ideally a low-risk workflow (<code>vps-cleanup-weekly</code> can be run by <code>workflow_dispatch</code>), and run it.</li>
<li><strong>Check the log</strong>: the nested steps appear under one "Run ./.github/actions/ssh-vps" step; the secret values are masked as <code>***</code>.</li>
<li><strong>Replace the remaining eight</strong> in one pull request, so the drift cannot re-open halfway.</li>
<li><strong>Grep for leftovers</strong>: <code>grep -rn "deploy_key" .github/workflows/</code> should now find nothing outside the action.</li>
</ol>
<h3>Reusable workflows, and the one thing that surprises</h3>
<pre><code>jobs:
  goi:
    uses: ./.github/workflows/dung-chung.yml
    with:
      moi_truong: production
    secrets: inherit        <span class="tok-comment"># hoac liet ke tung cai</span></code></pre>

<div class="callout warn">
<p><strong>Without <code>secrets:</code>, the called workflow gets none — and gets empty strings, not errors.</strong> This is 3.2&#39;s availability rule arriving in its most expensive form: a deploy workflow refactored into a reusable one, called without <code>secrets: inherit</code>, will run with a blank host and a blank key and fail somewhere downstream with a message about the wrong thing. <code>secrets: inherit</code> is convenient and passes everything; listing them explicitly is the version that documents what the workflow needs.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Duplication in workflows is not a style problem, it is a drift problem — nine copies here already carry two behaviours — and the fix is a composite action when the repetition is steps, a reusable workflow when it is jobs, and a plain script whenever you would like to be able to test it.</p>
</div>

<h3>Composite action or reusable workflow — the short version</h3>
<table>
<thead><tr><th></th><th>composite action</th><th>reusable workflow</th></tr></thead>
<tbody>
<tr><td>Called with</td><td><code>uses:</code> on a <strong>step</strong></td><td><code>uses:</code> on a <strong>job</strong></td></tr>
<tr><td>Runs on</td><td>the caller&#39;s runner, same workspace</td><td>its own jobs and runners</td></tr>
<tr><td>Secrets</td><td>cannot read <code>secrets.*</code> — pass as inputs</td><td><code>secrets:</code> explicitly, or <code>secrets: inherit</code></td></tr>
<tr><td>In the log</td><td>nested under one step</td><td>separate jobs in the run graph</td></tr>
<tr><td>Good for</td><td>"these steps repeat"</td><td>"this whole pipeline repeats" (build → test → deploy)</td></tr>
</tbody>
</table>
<p>Chapter 12 builds both properly — versioning a shared action, <code>workflow_call</code> inputs and outputs, how secrets and permissions flow into a called workflow, and when an organisation should publish its own actions.</p>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: You have the same 10 steps in eight workflows. What do you do?</strong><br>A: Check whether the copies have already drifted and pick the correct version; then extract a composite action in <code>.github/actions/</code> (steps, same job) or a reusable workflow (whole jobs). Pass secrets as inputs, set <code>shell:</code> on every <code>run:</code>, wire outputs explicitly, and replace all call sites in one PR. If the logic is mostly shell, a script in the repo is even easier to test.</p>
<p><strong>Q: What is the difference between a composite action and a reusable workflow?</strong><br>A: A composite action is a step-level bundle that runs inside the caller&#39;s job on the same runner and cannot read secrets directly; a reusable workflow is called at job level, runs its own jobs on their own runners, and receives secrets through <code>secrets:</code> or <code>secrets: inherit</code>.</p>
<p><strong>Q: Why does <code>uses: ./.github/actions/x</code> fail with "Did you forget to run actions/checkout"?</strong><br>A: A local action is read from the runner&#39;s disk, and the repository is not there until checkout runs. Put checkout first — or publish the action in its own repository and reference it with <code>owner/repo/path@sha</code>.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> two of your workflows both run "install, lint, test" with slightly different flags. Turn that into one composite action.</p><ol>
<li>Create <code>.github/actions/kiem-tra/action.yml</code> with <code>using: composite</code>, an input <code>thu-muc</code> (default <code>.</code>) and an output <code>so-tep</code>.</li>
<li>Give it two steps, both with <code>shell: bash</code> and <code>working-directory: &#36;{{ inputs.thu-muc }}</code>: one prints <code>node --version</code>, one counts files and writes <code>so-tep=&lt;n&gt;</code> to <code>$GITHUB_OUTPUT</code> (with an <code>id:</code>).</li>
<li>Wire the output: <code>outputs.so-tep.value: &#36;{{ steps.&lt;id&gt;.outputs.so-tep }}</code>.</li>
<li>Call it from a workflow after checkout (<code>id: kt</code>) and print <code>&#36;{{ steps.kt.outputs.so-tep }}</code> in the next step.</li>
<li>Add a second job that calls it <em>without</em> checkout, and a third where you delete one <code>shell:</code> line. Push and read both failures.</li></ol>
<p><strong>Done when:</strong> the first job prints a non-empty count from the output; its log shows your two steps nested under one "Run ./.github/actions/kiem-tra"; the second job fails with "Did you forget to run actions/checkout"; and the third fails because a composite <code>run:</code> step has no <code>shell</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Composite action</span><span class="v"><code>runs.using: composite</code> — a named bundle of steps, called like any action.</span></div>
  <div class="kv"><span class="k">Local action</span><span class="v">Referenced by path (<code>./.github/actions/x</code>), read from the checked-out commit; no <code>@ref</code>.</span></div>
  <div class="kv"><span class="k"><code>github.action_path</code></span><span class="v">Where the running action lives on disk; keep helper scripts there.</span></div>
  <div class="kv"><span class="k">Output wiring</span><span class="v"><code>outputs.&lt;name&gt;.value: &#36;{{ steps.&lt;id&gt;.outputs.&lt;name&gt; }}</code> — needed in every composite action.</span></div>
  <div class="kv"><span class="k">Reusable workflow</span><span class="v">A workflow with <code>on: workflow_call</code>, called with <code>uses:</code> at job level (Chapter 12).</span></div>
  <div class="kv"><span class="k"><code>secrets: inherit</code></span><span class="v">Pass all of the caller&#39;s secrets to a reusable workflow; without <code>secrets:</code> it gets none.</span></div>
  <div class="kv"><span class="k">Drift (trôi dạt)</span><span class="v">Copies of the same code that slowly become different versions because each is fixed separately.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nine copies of one SSH block in api-backend had already drifted into two versions — duplication in CI is a drift problem, not a style problem.</li>
<li>Four sizes: composite action (steps), reusable workflow (jobs), a script in the repo (testable locally), a published action (shared across repos, Chapter 12).</li>
<li>A composite action needs <code>shell:</code> on every <code>run:</code>, hand-wired outputs, and secrets passed as inputs.</li>
<li>A local action is read from disk: checkout first, no <code>pre</code>, and a PR can change the action it runs.</li>
<li>Its inner steps appear nested under one step in the log; <code>github.action_path</code> points at its folder.</li>
<li>Reusable workflows get no secrets unless passed (<code>secrets:</code> or <code>inherit</code>) — empty strings, not errors.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — the full syntax, the mandatory <code>shell:</code>, and how to declare outputs from an inner step.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/reusing-workflows — <code>workflow_call</code>, the <code>secrets: inherit</code> keyword, the nesting limit, and the restrictions on what a called workflow can see.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using secrets</span><span class="lc-sub">docs.github.com/en/actions/security-guides/using-secrets-in-github-actions — why passing a secret as an input is preferable to reading it from the context deep inside a shared component.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the deploy script, and why it lives in the repository</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the third option above, argued at length: a script you can run locally is a script you can debug without pushing a commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — writing a script that takes arguments instead of hard-coding</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the same factoring decision one level down, including when parameterising makes a script worse.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Tự viết lấy, và cú trôi dạt tôi đo được</h2>
<p class="lead">Lập luận cho việc tách một khối lặp lại ra thường được đưa ra trên nền GU THẨM MỸ. Ở đây nó đưa ra được trên nền SỐ ĐO, bởi kho này có CHÍN bản chép của một khối và chúng ĐÃ trôi dạt rồi.</p>

<h3>Phép đo</h3>
${slide('ga-04', 28, 'Chín bản chép một khối SSH đã trôi thành hai phiên bản')}
<p>Chín trên mười một workflow dùng <code>VPS_SSH_PRIVATE_KEY</code>, và mỗi cái chứa một bước mười dòng ghi khoá xuống đĩa rồi dựng một cấu hình SSH. So sánh <em>THÂN</em> của chín khối ấy, bỏ qua tên bước:</p>

<div class="out">9 khoi 'Setup SSH key', moi khoi 10 dong
THAN khoi: 2 phien ban khac nhau

  ban 3de67690 — 7 workflow:
      e2e-message-button · fix-containers · full-deploy
      guard-no-duplicates · restart-containers · sync-frontend
      vps-cleanup-weekly

  ban 57e5f9fc — 2 workflow:
      backend-vps · deploy-ghcr</div>

<p>Và khác biệt DUY NHẤT giữa hai phiên bản:</p>

<div class="out">-printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n'
+printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n
         ServerAliveInterval 60\\n  ServerAliveCountMax 10\\n  ConnectTimeout 30\\n'</div>

<div class="callout warn">
<p><strong>Ba dòng giữ-kết-nối có mặt ở hai workflow và không có ở bảy cái kia.</strong> Ai đó gặp cảnh SSH rớt giữa một cuộc deploy dài, vá đúng chỗ đau, rồi dừng — mà đó là việc hoàn toàn hợp lý vào lúc ấy. Kết quả là bảy workflow vẫn giữ hành vi cũ, và không có chỗ nào ghi lại rằng chúng là những bản CHƯA VÁ. Người kế tiếp đi gỡ một cú <code>ssh</code> treo trong <code>vps-cleanup-weekly</code> sẽ được khám phá lại chuyện này từ đầu.</p>
</div>

<div class="callout">
<p><strong>Một chỗ tự sửa, giữ lại vì nó mới là bài học hữu ích hơn.</strong> Bản đầu tiên của phép đo này lấy một cửa sổ mười sáu dòng quanh mỗi chỗ khớp rồi báo rằng <em>cả chín bản đều khác nhau</em>. Sai — cửa sổ ấy nuốt cả BƯỚC KẾ TIẾP, thứ vốn thật sự khác nhau ở mọi workflow. Cắt khối ở đúng biên của nó thì ra chín bản trong hai phiên bản. Con số sai thì kịch tính hơn và làm nên một câu chuyện hay hơn; nó cũng không đúng sự thật.</p>
</div>

<h3>Ba cách để thôi chép</h3>
${slide('ga-04', 25, 'Bốn cách thôi chép, bốn kích cỡ')}
<p>Slide thêm một kích cỡ thứ tư mà bài này chỉ gọi tên: một JavaScript hay Docker action nằm ở kho <em>RIÊNG</em> của nó, phát hành có thẻ, có test, và được nhiều kho dùng. Đó là công cụ đúng khi nhiều kho hay nhiều đội dùng chung logic — và nó là chủ đề của Chương 12, cùng với workflow dùng lại (reusable workflow) đi sâu (input và secret, output của <code>workflow_call</code>, đánh phiên bản, và các giới hạn). Ở đây mục tiêu nhỏ hơn: đủ để nhận ra các hình dạng và viết được cái bạn sẽ cần đầu tiên — một composite action ngay trong kho của mình.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">composite action — <code>.github/actions/&lt;tên&gt;/action.yml</code></span><span class="lz-lnote">cho một chuỗi <em>BƯỚC</em> lặp lại. Gọi bằng <code>uses: ./.github/actions/&lt;tên&gt;</code>. Đây là hình dạng đúng cho khối SSH: nó là các bước, nó nhận tham số, nó thuộc về bên trong một job</span></div>
<div class="lz-layer"><span class="lz-lname">workflow dùng lại — <code>on: workflow_call</code></span><span class="lz-lnote">cho một <em>JOB</em> hay một tập job lặp lại. Gọi bằng <code>uses:</code> ở mức job. Nặng hơn: nó nhận một runner riêng, và bí mật phải được truyền tường minh hoặc bằng <code>secrets: inherit</code></span></div>
<div class="lz-layer"><span class="lz-lname">một script nằm trong kho</span><span class="lz-lnote">lựa chọn bị đánh giá thấp. Một <code>scripts/ssh-setup.sh</code> gọi từ một dòng <code>run:</code> thì KIỂM THỬ ĐƯỢC trên máy của chính bạn, mà hai cái kia thì không</span></div>
</div>

<h3>Chạy thử từng bước: một composite action trên sân tập</h3>
${slide('ga-04', 26, 'Composite action trong chính repo: input vào, output ra')}
<p>Trước khối SSH thật, đây là composite action nhỏ nhất cho thấy mọi bộ phận chuyển động — một input, hai bước, một output — trong <code>.github/actions/chao-ga/action.yml</code> trên sân tập:</p>
<pre><code class="language-yaml">name: Chao GA
description: Composite action nho — gom 2 buoc, nhan 1 input, tra 1 output
inputs:
  ten:
    description: Ten nguoi duoc chao
    required: true
outputs:
  loi-chao:
    description: Cau chao da ghep
    value: &#36;{{ steps.ghep.outputs.loi-chao }}     # (1) phải nối TAY
runs:
  using: composite
  steps:
    - name: Ghep cau chao
      id: ghep                                     # (2) id mà output trỏ tới
      shell: bash                                  # (3) BẮT BUỘC trên mọi run:
      env:
        TEN: &#36;{{ inputs.ten }}                    # (4) input -&gt; env, không nhét vào script
      run: echo "loi-chao=Xin chao $TEN tu composite action" &gt;&gt; "$GITHUB_OUTPUT"
    - name: In noi action dang nam
      shell: bash
      run: |
        echo "action_path = &#36;{{ github.action_path }}"
        ls "&#36;{{ github.action_path }}"</code></pre>
<p>Và workflow gọi nó:</p>
<pre><code class="language-yaml">steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
    with:
      persist-credentials: false
  - id: chao
    uses: ./.github/actions/chao-ga       # một đường dẫn, không @ref: nó là thứ commit này chứa
    with:
      ten: Cuong
  - run: echo "&#36;{{ steps.chao.outputs.loi-chao }}"</code></pre>
<p>Log của run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000261759" target="_blank" rel="noopener">36000261759</a>, rút gọn, với các bước bên trong lồng dưới MỘT bước của bên gọi (thụt lề thêm ở đây cho dễ đọc):</p>
<div class="out">Run ./.github/actions/chao-ga
  with:
    ten: Cuong
  Run echo "action_path = /home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/chao-ga"
  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
  action_path = /home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/chao-ga
  action.yml
Run echo "Xin chao Cuong tu composite action"
shell: /usr/bin/bash -e {0}
Xin chao Cuong tu composite action</div>
<ul>
<li><strong>Output là ống nối, không phải phép màu.</strong> Bước bên trong ghi vào <code>$GITHUB_OUTPUT</code> như mọi bước; <code>outputs.loi-chao.value</code> của action trỏ vào <code>id</code> của bước đó; bên gọi đọc <code>steps.chao.outputs.loi-chao</code>. Thiếu một mắt xích là bạn nhận chuỗi rỗng, không phải lỗi.</li>
<li><strong>Nhìn hai dòng <code>shell:</code>.</strong> Bên trong action, <code>shell: bash</code> cho ra <code>bash --noprofile --norc -e -o pipefail</code>; còn <code>run:</code> của chính bên gọi, không ghi <code>shell:</code>, nhận <code>bash -e</code> — không có <code>pipefail</code> (bài 2.4). Composite action buộc bạn phải chọn, và đó là một cái lợi thầm lặng của nó.</li>
<li><strong><code>github.action_path</code></strong> là chỗ action nằm trên đĩa — nơi để một script phụ cạnh <code>action.yml</code> và gọi nó bằng <code>"&#36;{{ github.action_path }}/script.sh"</code>. Với action cục bộ nó nằm trong workspace; với action từ xa nó nằm dưới <code>_actions/</code>.</li>
<li><strong>Action cục bộ không có <code>@ref</code>.</strong> <code>./.github/actions/chao-ga</code> là bất cứ thứ gì commit được checkout chứa — nên một pull request sửa action sẽ chạy CHÍNH bản đã sửa của nó. Tiện cho phát triển, và đúng là lý do một action cục bộ không phải ranh giới bảo mật.</li>
</ul>
<h3>Composite action cho khối ấy</h3>
<pre><code><span class="tok-comment"># .github/actions/ssh-vps/action.yml</span>
name: Cai SSH toi VPS
inputs:
  host:    { required: true }
  user:    { required: true }
  khoa:    { required: true }
runs:
  using: composite
  steps:
    - shell: bash          <span class="tok-comment"># BAT BUOC tren moi run: cua composite</span>
      env:
        HOST: &#36;{{ inputs.host }}
        USER: &#36;{{ inputs.user }}
        KHOA: &#36;{{ inputs.khoa }}
      run: |
        mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh
        echo "\$KHOA" | base64 -d &gt; ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        ssh-keyscan -H "\$HOST" &gt;&gt; ~/.ssh/known_hosts 2&gt;/dev/null || true
        printf 'Host vps\\n  HostName %s\\n  User %s\\n  IdentityFile ~/.ssh/deploy_key\\n  ServerAliveInterval 60\\n' \\
          "\$HOST" "\$USER" &gt; ~/.ssh/config</code></pre>

<p>Gọi từ bất kỳ cái nào trong chín:</p>

<pre><code>- uses: ./.github/actions/ssh-vps
  with:
    host: &#36;{{ secrets.VPS_HOST }}
    user: &#36;{{ secrets.VPS_USER }}
    khoa: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="callout ok">
<p><strong>Để ý bí mật đi qua <code>with:</code> rồi qua <code>env:</code>, không bao giờ đổ thẳng vào <code>run:</code></strong> — quy tắc của bài 3.1, áp dụng ở đây bởi một tên máy chủ lấy từ secret vẫn là một giá trị đang bị thay vào một script. Mấy bản chép gốc nội suy <code>&#36;{{ secrets.VPS_HOST }}</code> thẳng vào câu <code>printf</code>, và điều đó chỉ an toàn vì bí mật ấy là thứ chính bạn đặt vào.</p>
</div>

<h3>Composite action KHÔNG làm được gì</h3>
${slide('ga-04', 27, 'Action cục bộ chỉ tồn tại SAU checkout')}
<div class="kv-grid">
<div class="kv"><span class="k"><code>shell:</code> là BẮT BUỘC</span><span class="v">mọi <code>run:</code> bên trong một composite action đều phải nêu một shell. Bỏ nó đi là lỗi, và đó là thứ hỏng đầu tiên khi bạn dời các bước vào trong</span></div>
<div class="kv"><span class="k">không có context <code>secrets</code></span><span class="v">một composite action KHÔNG đọc được <code>secrets.*</code>. Hãy truyền chúng vào làm tham số — mà như thế TỐT HƠN, vì khi đó action tự khai ra nó cần gì</span></div>
<div class="kv"><span class="k">output cần nối dây</span><span class="v">output của một bước bên trong action KHÔNG tự động thành output của action; hãy khai nó trong <code>outputs:</code> kèm tham chiếu tới <code>id</code> của bước bên trong</span></div>
<div class="kv"><span class="k">đường dẫn cục bộ nghĩa là CỤC BỘ</span><span class="v"><code>uses: ./.github/actions/x</code> đòi kho phải được checkout TRƯỚC. Một composite action không thể là cái bước chạy <em>TRƯỚC</em> <code>checkout</code></span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — tách ra trước khi biết hình dạng.</strong> Hai bản chép của một thứ KHÔNG phải bằng chứng của một khuôn mẫu; nó là bằng chứng của hai thứ hiện đang trông giống nhau. Một composite action tách ra từ hai chỗ gọi thường mọc thêm một tham số cho mỗi cách mà chỗ gọi thứ ba khác đi, rồi kết thúc trong tình trạng khó đọc hơn cả chỗ trùng lặp mà nó thay thế. Chín bản với MỘT trục biến thiên — ca này — thì đã vượt ngưỡng ấy. Hai bản thì chưa.</p>
</div>

<h3>Đo thật: action cục bộ đứng TRƯỚC checkout</h3>
<p>Dòng cuối của danh sách trên, cố ý chạy trên sân tập (job <code>local-truoc-checkout</code> của run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">36000264372</a>) — một job có bước đầu là composite action, không có checkout:</p>
<div class="out">Prepare all required actions
Getting action download info
Complete job name: local-truoc-checkout
##[error]Can't find 'action.yml', 'action.yaml' or 'Dockerfile' under
'/home/runner/work/ga-san-tap/ga-san-tap/.github/actions/chao-ga'.
Did you forget to run actions/checkout before running your local action?</div>
<p>Hai chi tiết đáng để ý. Set up job không than gì — nó chỉ tải action <em>TỪ XA</em>, mà một đường dẫn cục bộ thì không phải — nên job bắt đầu rồi hỏng ở bước đó. Và thông điệp lỗi gọi tên luôn cách sửa. Nếu bạn muốn một action dùng chung chạy được <em>TRƯỚC</em> checkout (hoặc từ kho khác), nó phải nằm ở một kho riêng và được gọi bằng <code>owner/repo/duong-dan@ref</code>; khi đó nó được tải ở Set up job như mọi action khác. Đó là bước chuyển từ bài này sang Chương 12.</p>

<h3>Tái cấu trúc chín bản chép, từng bước</h3>
<ol>
<li><strong>Diff các bản chép trước</strong> (phép đo ở trên). Quyết định bản nào ĐÚNG — ở đây là bản có ba dòng giữ kết nối.</li>
<li><strong>Viết <code>.github/actions/ssh-vps/action.yml</code></strong> từ bản đúng, secret đi vào qua input rồi chuyển sang <code>env:</code>.</li>
<li><strong>Thay một chỗ gọi</strong>, tốt nhất là workflow ít rủi ro (<code>vps-cleanup-weekly</code> chạy được bằng <code>workflow_dispatch</code>), rồi chạy nó.</li>
<li><strong>Kiểm log</strong>: các bước lồng hiện dưới một bước "Run ./.github/actions/ssh-vps"; giá trị secret bị che thành <code>***</code>.</li>
<li><strong>Thay tám chỗ còn lại</strong> trong MỘT pull request, để sự trôi dạt không thể mở lại giữa chừng.</li>
<li><strong>Grep phần sót</strong>: <code>grep -rn "deploy_key" .github/workflows/</code> giờ không được thấy gì ngoài action.</li>
</ol>
<h3>Workflow dùng lại, và một chuyện gây bất ngờ</h3>
<pre><code>jobs:
  goi:
    uses: ./.github/workflows/dung-chung.yml
    with:
      moi_truong: production
    secrets: inherit        <span class="tok-comment"># hoac liet ke tung cai</span></code></pre>

<div class="callout warn">
<p><strong>Không có <code>secrets:</code> thì workflow được gọi KHÔNG nhận cái nào — và nó nhận chuỗi rỗng, không nhận lỗi.</strong> Đây là luật khả dụng của bài 3.2 tới nơi ở dạng đắt nhất: một workflow deploy được tái cấu trúc thành dạng dùng lại, gọi mà quên <code>secrets: inherit</code>, sẽ chạy với một tên máy chủ trống và một cái khoá trống rồi hỏng ở đâu đó phía sau với một thông báo về một chuyện KHÁC. <code>secrets: inherit</code> thì tiện và truyền mọi thứ; liệt kê tường minh mới là bản KHAI RA workflow ấy cần gì.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Trùng lặp trong workflow không phải một vấn đề phong cách mà là một vấn đề TRÔI DẠT — chín bản chép ở đây đã mang hai hành vi — và cách vá là một composite action khi chỗ lặp là các BƯỚC, một workflow dùng lại khi nó là các JOB, và một script trơn bất cứ khi nào bạn muốn có thể kiểm thử nó.</p>
</div>

<h3>Composite action hay reusable workflow — bản ngắn</h3>
<table>
<thead><tr><th></th><th>composite action</th><th>reusable workflow</th></tr></thead>
<tbody>
<tr><td>Gọi bằng</td><td><code>uses:</code> ở mức <strong>bước</strong></td><td><code>uses:</code> ở mức <strong>job</strong></td></tr>
<tr><td>Chạy trên</td><td>runner của bên gọi, cùng workspace</td><td>các job và runner của riêng nó</td></tr>
<tr><td>Secret</td><td>không đọc được <code>secrets.*</code> — truyền qua input</td><td><code>secrets:</code> tường minh, hoặc <code>secrets: inherit</code></td></tr>
<tr><td>Trong log</td><td>lồng dưới một bước</td><td>các job riêng trong đồ thị run</td></tr>
<tr><td>Hợp cho</td><td>"mấy bước này lặp lại"</td><td>"cả đường ống này lặp lại" (dựng → test → deploy)</td></tr>
</tbody>
</table>
<p>Chương 12 dựng cả hai cho đàng hoàng — đánh phiên bản một action dùng chung, input và output của <code>workflow_call</code>, secret và quyền chảy vào workflow được gọi ra sao, và khi nào một tổ chức nên phát hành action riêng.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn có cùng 10 bước trong tám workflow. Bạn làm gì?</strong><br>Đ: Kiểm xem các bản chép đã trôi chưa và chọn bản đúng; rồi tách thành composite action trong <code>.github/actions/</code> (các bước, cùng job) hoặc reusable workflow (cả job). Truyền secret qua input, đặt <code>shell:</code> cho mọi <code>run:</code>, nối output tường minh, và thay mọi chỗ gọi trong một PR. Nếu logic chủ yếu là shell, một script trong kho còn dễ test hơn.</p>
<p><strong>H: Composite action khác reusable workflow thế nào?</strong><br>Đ: Composite action là một gói ở mức bước, chạy trong job của bên gọi trên cùng runner và không đọc secret trực tiếp được; reusable workflow được gọi ở mức job, chạy các job của riêng nó trên runner riêng, và nhận secret qua <code>secrets:</code> hoặc <code>secrets: inherit</code>.</p>
<p><strong>H: Vì sao <code>uses: ./.github/actions/x</code> hỏng với "Did you forget to run actions/checkout"?</strong><br>Đ: Action cục bộ được đọc từ đĩa của runner, và kho chưa có ở đó cho tới khi checkout chạy. Đặt checkout lên trước — hoặc phát hành action ở kho riêng và gọi bằng <code>owner/repo/duong-dan@sha</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> hai workflow của bạn cùng chạy "cài, lint, test" với cờ hơi khác nhau. Biến nó thành một composite action.</p><ol>
<li>Tạo <code>.github/actions/kiem-tra/action.yml</code> với <code>using: composite</code>, một input <code>thu-muc</code> (mặc định <code>.</code>) và một output <code>so-tep</code>.</li>
<li>Cho nó hai bước, đều có <code>shell: bash</code> và <code>working-directory: &#36;{{ inputs.thu-muc }}</code>: một bước in <code>node --version</code>, một bước đếm tệp rồi ghi <code>so-tep=&lt;n&gt;</code> vào <code>$GITHUB_OUTPUT</code> (có <code>id:</code>).</li>
<li>Nối output: <code>outputs.so-tep.value: &#36;{{ steps.&lt;id&gt;.outputs.so-tep }}</code>.</li>
<li>Gọi nó từ một workflow sau checkout (<code>id: kt</code>) và in <code>&#36;{{ steps.kt.outputs.so-tep }}</code> ở bước kế.</li>
<li>Thêm job thứ hai gọi nó <em>KHÔNG</em> có checkout, và job thứ ba mà bạn xoá một dòng <code>shell:</code>. Push và đọc cả hai lỗi.</li></ol>
<p><strong>Đạt khi:</strong> job đầu in ra một con số khác rỗng từ output; log của nó cho thấy hai bước của bạn lồng dưới một "Run ./.github/actions/kiem-tra"; job hai hỏng với "Did you forget to run actions/checkout"; và job ba hỏng vì một bước <code>run:</code> của composite thiếu <code>shell</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Composite action</span><span class="v"><code>runs.using: composite</code> — một chùm bước có tên, gọi như mọi action.</span></div>
  <div class="kv"><span class="k">Action cục bộ (local action)</span><span class="v">Gọi bằng đường dẫn (<code>./.github/actions/x</code>), đọc từ commit đã checkout; không có <code>@ref</code>.</span></div>
  <div class="kv"><span class="k"><code>github.action_path</code></span><span class="v">Chỗ action đang chạy nằm trên đĩa; để script phụ ở đó.</span></div>
  <div class="kv"><span class="k">Nối output</span><span class="v"><code>outputs.&lt;tên&gt;.value: &#36;{{ steps.&lt;id&gt;.outputs.&lt;tên&gt; }}</code> — cần trong mọi composite action.</span></div>
  <div class="kv"><span class="k">Reusable workflow (workflow dùng lại)</span><span class="v">Workflow có <code>on: workflow_call</code>, gọi bằng <code>uses:</code> ở mức job (Chương 12).</span></div>
  <div class="kv"><span class="k"><code>secrets: inherit</code></span><span class="v">Chuyển mọi secret của bên gọi cho reusable workflow; không có <code>secrets:</code> thì nó nhận không cái nào.</span></div>
  <div class="kv"><span class="k">Drift (trôi dạt)</span><span class="v">Các bản chép của cùng một đoạn mã dần thành các phiên bản khác nhau vì mỗi bản được sửa riêng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chín bản chép một khối SSH trong api-backend đã trôi thành hai phiên bản — lặp lại trong CI là chuyện trôi dạt, không phải chuyện văn phong.</li>
<li>Bốn kích cỡ: composite action (các bước), reusable workflow (các job), script trong kho (test được ở máy), action phát hành riêng (dùng chung nhiều kho, Chương 12).</li>
<li>Composite action cần <code>shell:</code> trên mọi <code>run:</code>, output nối tay, và secret truyền qua input.</li>
<li>Action cục bộ đọc từ đĩa: checkout trước, không có <code>pre</code>, và một PR đổi được chính action mà nó chạy.</li>
<li>Các bước bên trong hiện lồng dưới một bước trong log; <code>github.action_path</code> trỏ vào thư mục của nó.</li>
<li>Reusable workflow không nhận secret nào trừ khi được truyền (<code>secrets:</code> hoặc <code>inherit</code>) — chuỗi rỗng, không phải lỗi.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — cú pháp đầy đủ, khoá <code>shell:</code> bắt buộc, và cách khai output từ một bước bên trong.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/reusing-workflows — <code>workflow_call</code>, từ khoá <code>secrets: inherit</code>, giới hạn lồng nhau, và các hạn chế về thứ mà một workflow được gọi nhìn thấy được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using secrets</span><span class="lc-sub">docs.github.com/en/actions/security-guides/using-secrets-in-github-actions — vì sao truyền một bí mật vào làm THAM SỐ thì hơn là đọc nó từ context ở sâu trong một thành phần dùng chung.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — script deploy, và vì sao nó nằm TRONG KHO</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — lựa chọn thứ ba bên trên, lập luận cho đầy đủ: một script bạn chạy được ở máy là một script bạn gỡ lỗi được mà không phải đẩy một commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — viết một script NHẬN THAM SỐ thay vì viết cứng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cùng quyết định tách bạch ấy ở một tầng thấp hơn, gồm cả lúc mà việc tham số hoá làm script TỆ ĐI.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'ga-4-6-kiem-tra',
      type: 'QUIZ',
      description: 'Mười câu tình huống trên đúng những gì chương đã chạy thật: @v4 dời sang bản mới, vụ tj-actions, SHA ngắn, khoá checkout để lại, input gõ sai, Docker trên macOS, clone nông, khoá cache setup-node và CRLF, action cục bộ trước checkout, push 403.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Each one is a situation you will meet in a real repository, and each answer was run on a real runner in this chapter rather than asserted — two of them overturn claims an earlier version of this chapter made. If an option feels like a matter of opinion, go back to the log it came from.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain what the runner does with <code>uses: owner/repo@ref</code> during Set up job, and find the resolved SHA in a log.</li>
<li>I can say what an action can reach — workspace, network, <code>$GITHUB_PATH</code>, the checkout credential, runner memory — and what it does not get by default (<code>GITHUB_TOKEN</code> in its environment).</li>
<li>I can pin an action to a full SHA with a version comment, keep it updated with Dependabot, and explain the tj-actions incident.</li>
<li>I can predict what a default checkout lacks (history, tags, <code>origin/main</code>) and where it leaves the token, and harden it with <code>persist-credentials: false</code> and <code>permissions:</code>.</li>
<li>I can compute a <code>setup-node</code> cache key from the lockfiles, and explain why the Windows key differs.</li>
<li>I can write a composite action with an input and a wired output, and say why it must come after checkout.</li>
</ul>
${slide('ga-04', 30, 'Chapter 4 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Câu nào cũng là một tình huống bạn sẽ gặp trong kho thật, và mọi đáp án đều đã được CHẠY trên runner thật trong chương này chứ không phải khẳng định suông — hai câu trong số đó lật lại điều mà bản cũ của chương từng nói. Nếu một phương án khiến bạn thấy nó tuỳ quan điểm, hãy quay lại cái log mà nó lấy ra.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được runner làm gì với <code>uses: owner/repo@ref</code> trong Set up job, và tìm được SHA đã giải ra trong log.</li>
<li>Tôi nói được một action với tới những gì — workspace, mạng, <code>$GITHUB_PATH</code>, khoá của checkout, bộ nhớ runner — và nó KHÔNG mặc định có gì (<code>GITHUB_TOKEN</code> trong môi trường).</li>
<li>Tôi ghim được action bằng SHA đầy đủ kèm chú thích phiên bản, giữ nó cập nhật bằng Dependabot, và kể lại được vụ tj-actions.</li>
<li>Tôi đoán trước được checkout mặc định thiếu gì (lịch sử, thẻ, <code>origin/main</code>) và để token ở đâu, rồi siết nó bằng <code>persist-credentials: false</code> và <code>permissions:</code>.</li>
<li>Tôi tính được khoá cache của <code>setup-node</code> từ các lockfile, và giải thích được vì sao khoá của Windows khác.</li>
<li>Tôi viết được một composite action có một input và một output đã nối, và nói được vì sao nó phải đứng sau checkout.</li>
</ul>
${slide('ga-04', 30, 'Bảng tra nhanh Chương 4')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your workflow file has not changed for two months. Today’s Set up job log says: Download action repository ’actions/checkout@v4’ (SHA:11d5960a…). A log from last month said SHA:34e11487…. What is the explanation?|||Tệp workflow của bạn hai tháng nay không đổi. Log Set up job hôm nay ghi: Download action repository ’actions/checkout@v4’ (SHA:11d5960a…). Log tháng trước ghi SHA:34e11487…. Giải thích là gì?',
            options: [
              'The runner image was updated, and each image ships its own bundled copy of the checkout action|||Ảnh runner đã được cập nhật, và mỗi ảnh mang theo một bản checkout action đóng gói sẵn của riêng nó',
              'The maintainers moved the v4 tag to a new release (v4.3.1 → v4.4.0), so the same line now runs different code|||Người bảo trì đã dời thẻ v4 sang một bản mới (v4.3.1 → v4.4.0), nên cùng một dòng giờ chạy mã khác',
              'GitHub mirrors each action per region, and the two runs were served by different regional copies|||GitHub nhân bản mỗi action theo vùng, và hai lần chạy được phục vụ bởi hai bản sao ở hai vùng khác nhau',
              'Someone force-pushed your repository, which changes the SHAs of every action your workflows reference|||Có người force-push kho của bạn, việc đó làm đổi SHA của mọi action mà workflow của bạn tham chiếu',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: @v4 is a git tag that the maintainers re-point to every v4.x release; the runner resolves it to a SHA at run time and logs that SHA. On 20/07/2026 v4 moved from v4.3.1 (34e1148) to v4.4.0 (11d5960), a release marked [BREAKING]. The runner-image answer is tempting because images do change weekly, but actions are not bundled in the image — they are downloaded in Set up job, which is exactly what that log line reports.|||VI: @v4 là một thẻ git mà người bảo trì trỏ lại sang mỗi bản v4.x; runner đổi nó thành SHA lúc chạy và ghi SHA vào log. Ngày 20/07/2026 v4 dời từ v4.3.1 (34e1148) sang v4.4.0 (11d5960), một bản ghi [BREAKING]. Đáp án “ảnh runner” hấp dẫn vì ảnh đúng là đổi hằng tuần, nhưng action KHÔNG đóng gói trong ảnh — chúng được tải ở Set up job, đúng như dòng log ấy báo.',
          },
          {
            question: 'In March 2025, tj-actions/changed-files printed secrets from thousands of repositories into their build logs. Which of these references, in a workflow that already existed before the attack, would NOT have run the malicious code?|||Tháng 3/2025, tj-actions/changed-files in secret của hàng nghìn kho ra log bản dựng. Tham chiếu nào sau đây, trong một workflow đã có từ trước vụ tấn công, sẽ KHÔNG chạy mã độc?',
            options: [
              'tj-actions/changed-files@v1.0.0 — the very first release, untouched for years, so nobody would bother moving it|||tj-actions/changed-files@v1.0.0 — bản phát hành đầu tiên, nhiều năm không ai đụng, nên chẳng ai buồn dời nó',
              'tj-actions/changed-files@v44.5.1 — an exact release tag, which by convention never moves|||tj-actions/changed-files@v44.5.1 — thẻ bản phát hành chính xác, theo quy ước không bao giờ dời',
              'tj-actions/changed-files@v35.7.7-sec — a tag the maintainers created specifically for a security fix|||tj-actions/changed-files@v35.7.7-sec — một thẻ người bảo trì tạo riêng cho một bản vá bảo mật',
              'tj-actions/changed-files@[full 40-character SHA of a clean commit] # v44.5.0|||tj-actions/changed-files@[SHA đầy đủ 40 ký tự của một commit sạch] # v44.5.0',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The attackers retroactively re-pointed multiple version tags to malicious commit 0e58ed8; advisory GHSA-mrrh-fwg8-r2c3 lists v1.0.0, v35.7.7-sec and v44.5.1 among them. A workflow referencing a moved tag followed it on its next run. A full SHA names content and cannot be moved. The exact tag is the tempting wrong answer: “never moves” is a convention, not a guarantee, and this attack is the counter-example.|||VI: Kẻ tấn công dời NGƯỢC nhiều thẻ phiên bản sang commit độc 0e58ed8; advisory GHSA-mrrh-fwg8-r2c3 liệt kê v1.0.0, v35.7.7-sec và v44.5.1 trong số đó. Workflow tham chiếu một thẻ bị dời thì đi theo nó ở lần chạy kế. SHA đầy đủ gọi tên nội dung và không dời được. Thẻ chính xác là đáp án sai hấp dẫn nhất: “không bao giờ dời” là quy ước, không phải bảo đảm, và vụ này chính là phản ví dụ.',
          },
          {
            question: 'To “pin” an action, a teammate writes uses: actions/checkout@3d3c42e. What happens when the workflow runs?|||Để “ghim” một action, bạn cùng nhóm viết uses: actions/checkout@3d3c42e. Chuyện gì xảy ra khi workflow chạy?',
            options: [
              'The job fails in Set up job, before any step: short SHAs are not supported, and the error suggests the full 40-character SHA|||Job hỏng ngay ở Set up job, trước mọi bước: SHA ngắn không được hỗ trợ, và lỗi gợi ý SHA đầy đủ 40 ký tự',
              'It works like a full SHA, because git resolves any unambiguous prefix to the same commit|||Nó chạy như SHA đầy đủ, vì git giải mọi tiền tố không mơ hồ thành cùng một commit',
              'It works, but with a warning recommending the full SHA for supply-chain safety|||Nó chạy, nhưng kèm một cảnh báo khuyên dùng SHA đầy đủ cho an toàn chuỗi cung ứng',
              'Only the checkout step fails when it is reached; the steps before it still run|||Chỉ bước checkout hỏng khi tới lượt nó; các bước trước nó vẫn chạy',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured in run 36000264372: “Unable to resolve action actions/checkout@3d3c42e, the provided ref 3d3c42e is the shortened version of a commit SHA, which is not supported. Please use the full commit SHA …” — the job died in 3 seconds. The “git resolves prefixes” option is tempting because git itself does, but the runner deliberately refuses: a prefix can be collided with, 40 characters cannot. Unresolvable references fail the whole job at Set up job, not at their step.|||VI: Đo ở run 36000264372: “Unable to resolve action actions/checkout@3d3c42e, the provided ref 3d3c42e is the shortened version of a commit SHA, which is not supported. Please use the full commit SHA …” — job chết sau 3 giây. Phương án “git giải tiền tố” hấp dẫn vì bản thân git làm được, nhưng runner CỐ Ý từ chối: tiền tố có thể bị tạo trùng, 40 ký tự thì không. Tham chiếu không giải được làm hỏng cả job ở Set up job, không phải ở bước của nó.',
          },
          {
            question: 'A small JavaScript action you wrote prints “GITHUB_TOKEN in env? false”. Yet in the same job it successfully reads an AUTHORIZATION header for github.com. Where did that come from?|||Một JavaScript action nhỏ bạn tự viết in ra “GITHUB_TOKEN in env? false”. Vậy mà trong cùng job nó đọc được một header AUTHORIZATION cho github.com. Nó lấy từ đâu?',
            options: [
              'From ACTIONS_RUNTIME_TOKEN, which is the same token under a different name|||Từ ACTIONS_RUNTIME_TOKEN, tức là cùng cái token đó dưới một tên khác',
              'From the runner’s memory — every JavaScript action can read the worker process directly|||Từ bộ nhớ của runner — mọi JavaScript action đều đọc thẳng được tiến trình worker',
              'From the git configuration that actions/checkout left behind (persist-credentials defaults to true), readable by any later step|||Từ cấu hình git mà actions/checkout để lại (persist-credentials mặc định là true), bước sau nào cũng đọc được',
              'From the with: block, because every action automatically receives the token as an input|||Từ khối with:, vì mọi action tự động nhận token làm một input',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured on the sandbox: after checkout@v4, .git/config contained the extraheader (v6+ keeps it in a $RUNNER_TEMP file pulled in by includeIf; git config --get still returns all 545 characters). The token is not in the environment, and ACTIONS_RUNTIME_TOKEN is a different token for the Actions services. Reading runner memory is possible with sudo (tj-actions did it), but that is not how a plain action got an HTTP header; and only actions that declare a token input with a github.token default receive it that way.|||VI: Đo trên sân tập: sau checkout@v4, .git/config chứa extraheader (v6+ giữ nó trong một tệp $RUNNER_TEMP được includeIf kéo vào; git config --get vẫn trả đủ 545 ký tự). Token không nằm trong môi trường, và ACTIONS_RUNTIME_TOKEN là một token KHÁC dành cho dịch vụ của Actions. Đọc bộ nhớ runner là làm được với sudo (tj-actions đã làm), nhưng đó không phải cách một action thường có được header HTTP; và chỉ action nào khai input token mặc định github.token mới nhận token theo đường input.',
          },
          {
            question: 'A step says uses: actions/setup-node@… with: node_version: ’20’ (underscore instead of hyphen). What does the run show?|||Một bước ghi uses: actions/setup-node@… with: node_version: ’20’ (gạch dưới thay cho gạch ngang). Lần chạy cho thấy gì?',
            options: [
              'The step fails with “Unexpected input(s) ’node_version’”, so the typo is caught immediately|||Bước hỏng với “Unexpected input(s) ’node_version’”, nên lỗi gõ bị bắt ngay',
              'Node 20 is installed, because the runner normalises underscores and hyphens in input names|||Node 20 được cài, vì runner chuẩn hoá gạch dưới và gạch ngang trong tên input',
              'A yellow “Unexpected input(s)” warning, the step stays green, and the action’s default Node (v22.23.2 here) is installed|||Một cảnh báo vàng “Unexpected input(s)”, bước vẫn xanh, và bản Node mặc định của action (ở đây v22.23.2) được cài',
              'Nothing at all is reported, and Node 20 is installed from the tool cache|||Không có gì được báo cả, và Node 20 được cài từ tool cache',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Run 36000261804 printed ##[warning]Unexpected input(s) ’node_version’, valid inputs are [...], kept the step green, and installed v22.23.2 — the default, not 20. This corrects an earlier version of lesson 4.1, which said there was no warning at all. The “step fails” option is the tempting one: the message sounds like an error, but it is only an annotation. actionlint catches the typo before pushing — but only when the action is pinned by a tag it knows, not by SHA.|||VI: Run 36000261804 in ##[warning]Unexpected input(s) ’node_version’, valid inputs are [...], giữ bước XANH, và cài v22.23.2 — bản mặc định, không phải 20. Điều này đính chính bản cũ của bài 4.1, bản nói rằng không có cảnh báo nào. Phương án “bước hỏng” là cái hấp dẫn: thông điệp nghe như lỗi, nhưng nó chỉ là một chú thích. actionlint bắt được lỗi gõ trước khi push — nhưng chỉ khi action ghim bằng thẻ mà nó biết, không phải bằng SHA.',
          },
          {
            question: 'A matrix runs the same job on ubuntu-24.04 and macos-15. One step is uses: docker://alpine:3.20. Linux is green; macOS fails with “Value cannot be null. (Parameter ’container’)”. Why?|||Một ma trận chạy cùng một job trên ubuntu-24.04 và macos-15. Một bước là uses: docker://alpine:3.20. Linux xanh; macOS hỏng với “Value cannot be null. (Parameter ’container’)”. Vì sao?',
            options: [
              'Container (Docker) actions run only on Linux runners; Set up job on macOS logged “Container action is only supported on Linux, skip pull”|||Action dạng container (Docker) chỉ chạy trên runner Linux; Set up job trên macOS đã ghi “Container action is only supported on Linux, skip pull”',
              'Docker Hub rate-limited the macOS runner, so the image pull returned nothing|||Docker Hub giới hạn tốc độ runner macOS, nên lượt kéo ảnh trả về rỗng',
              'The alpine image has no arm64 variant for the Apple-silicon macOS runner|||Ảnh alpine không có biến thể arm64 cho runner macOS chip Apple',
              'The step is missing a container: key at job level, which macOS requires and Linux does not|||Bước thiếu khoá container: ở mức job, thứ macOS bắt buộc còn Linux thì không',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Run 36000264372, job docker-tren-mac: Set up job printed “Container action is only supported on Linux, skip pull and build docker images.” as an ordinary line, then the step failed with the unhelpful null-parameter error. The arm64 option sounds plausible, but alpine is multi-arch — the image was never even pulled. Use a JavaScript action, or run that step only on Linux legs.|||VI: Run 36000264372, job docker-tren-mac: Set up job in “Container action is only supported on Linux, skip pull and build docker images.” như một dòng thường, rồi bước hỏng với lỗi tham số null chẳng giúp gì. Phương án arm64 nghe có lý, nhưng alpine là ảnh đa kiến trúc — ảnh thậm chí chưa hề được kéo. Dùng một JavaScript action, hoặc chỉ chạy bước đó trên các nhánh Linux.',
          },
          {
            question: 'A job runs git diff --name-only origin/main...HEAD right after a default actions/checkout and fails with “fatal: ambiguous argument ’origin/main...HEAD’”. What is the most direct fix?|||Một job chạy git diff --name-only origin/main...HEAD ngay sau một actions/checkout mặc định và hỏng với “fatal: ambiguous argument ’origin/main...HEAD’”. Cách sửa trực tiếp nhất là gì?',
            options: [
              'Quote the revision range, because bash expands the three dots|||Đặt nháy quanh khoảng revision, vì bash mở rộng ba dấu chấm',
              'Add ref: main to checkout so that the main branch is what gets checked out|||Thêm ref: main vào checkout để nhánh main là thứ được checkout',
              'Run git fetch --unshallow after the diff so the history is complete next time|||Chạy git fetch --unshallow sau lệnh diff để lần sau lịch sử được đầy đủ',
              'Set fetch-depth: 0 (optionally with filter: blob:none) — the default fetches one commit, so origin/main and the merge base do not exist|||Đặt fetch-depth: 0 (có thể kèm filter: blob:none) — mặc định chỉ lấy một commit, nên origin/main và merge base không tồn tại',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured in run 36000261745: default checkout gave shallow=true, 1 commit, 0 tags, only origin/ch04-action — and exactly this error; the fetch-depth: 0 job had 7 commits, 9 remote branches and a working diff (12 files changed). The message mentions an “ambiguous argument”, not depth, which is why people try quoting; the shell is not the problem. ref: main would check out the wrong commit entirely.|||VI: Đo ở run 36000261745: checkout mặc định cho shallow=true, 1 commit, 0 thẻ, chỉ có origin/ch04-action — và đúng lỗi này; job fetch-depth: 0 có 7 commit, 9 nhánh xa và diff chạy được (12 files changed). Thông điệp nói “ambiguous argument” chứ không nói tới độ sâu, nên người ta hay thử đặt nháy; shell không phải vấn đề. ref: main thì checkout sai commit luôn.',
          },
          {
            question: 'setup-node with cache: npm and cache-dependency-path listing desktop/package-lock.json then frontend/package-lock.json. Linux and macOS share one hash in their keys; Windows has a different hash. How is the key built, and why does Windows differ?|||setup-node với cache: npm và cache-dependency-path liệt kê desktop/package-lock.json rồi frontend/package-lock.json. Linux và macOS dùng chung một hash trong khoá; Windows có hash khác. Khoá được dựng thế nào, và vì sao Windows khác?',
            options: [
              'It is a random ID assigned by the cache service on first save; Windows got its own because it saved first|||Đó là một ID ngẫu nhiên do dịch vụ cache cấp ở lần lưu đầu; Windows có cái riêng vì nó lưu trước',
              'node-cache-OS-arch-npm- plus hashFiles() of the listed files in order; on Windows checkout converts line endings to CRLF, so the bytes and the hash differ|||node-cache-OS-arch-npm- cộng hashFiles() của các tệp đã liệt kê theo thứ tự; trên Windows checkout đổi đuôi dòng thành CRLF, nên bytes và hash khác',
              'It hashes the installed node_modules folder, which contains platform-specific binaries on Windows|||Nó băm thư mục node_modules đã cài, thứ chứa tệp nhị phân riêng cho Windows',
              'It includes the Node version, and the Windows image ships a different Node patch version|||Nó gồm phiên bản Node, và ảnh Windows mang một bản vá Node khác',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: setup-node’s src/cache-restore.ts builds node-cache-[RUNNER_OS]-[arch]-npm-[hashFiles(paths)]. Recomputed offline for run 32662461744: desktop+frontend = 1271543c… (Linux, macOS ✓), the same files with CRLF = c7c75d0c… (Windows ✓), reversed order = d216f380… ✗. This corrects the old lesson 4.4, which could not reproduce the key because it hashed the root lockfile. The Node-version option is tempting, but the version is not part of this key.|||VI: src/cache-restore.ts của setup-node dựng node-cache-[RUNNER_OS]-[arch]-npm-[hashFiles(paths)]. Tính lại ngoại tuyến cho run 32662461744: desktop+frontend = 1271543c… (Linux, macOS ✓), cùng tệp ấy với CRLF = c7c75d0c… (Windows ✓), đảo thứ tự = d216f380… ✗. Điều này đính chính bài 4.4 cũ, bài không tái lập được khoá vì đã băm lockfile ở gốc. Phương án phiên bản Node hấp dẫn, nhưng phiên bản không nằm trong khoá này.',
          },
          {
            question: 'A job’s first step is uses: ./.github/actions/chao-ga. Set up job completes without complaint, then the step fails with “Can’t find ’action.yml’ … Did you forget to run actions/checkout…?”. Why did Set up job not catch it?|||Bước đầu của một job là uses: ./.github/actions/chao-ga. Set up job xong xuôi không than gì, rồi bước hỏng với “Can’t find ’action.yml’ … Did you forget to run actions/checkout…?”. Vì sao Set up job không bắt được?',
            options: [
              'Local actions are read from the runner’s disk, which is empty until checkout runs; Set up job only downloads remote owner/repo@ref actions|||Action cục bộ được đọc từ đĩa của runner, nơi còn trống cho tới khi checkout chạy; Set up job chỉ tải các action từ xa owner/repo@ref',
              'Set up job does check local actions, but only for Docker-based ones|||Set up job CÓ kiểm action cục bộ, nhưng chỉ với loại Docker',
              'Composite actions are validated lazily, while JavaScript actions are validated in Set up job|||Composite action được kiểm muộn, còn JavaScript action được kiểm ở Set up job',
              'The path must start with .github/ without ./, otherwise it is treated as a remote repository|||Đường dẫn phải bắt đầu bằng .github/ không có ./, nếu không nó bị coi là một kho từ xa',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Run 36000264372, job local-truoc-checkout: “Prepare all required actions” listed nothing to download and the step failed at run time. The same fact explains why pre: never runs for a local action (warning “pre execution is not supported for local action”). The “composite vs JavaScript” option is tempting but wrong — any local action, of any kind, is unknown until checkout. To use a shared action before checkout, publish it and reference owner/repo/path@sha.|||VI: Run 36000264372, job local-truoc-checkout: “Prepare all required actions” không có gì để tải và bước hỏng lúc chạy. Cùng sự thật ấy giải thích vì sao pre: không bao giờ chạy với action cục bộ (cảnh báo “pre execution is not supported for local action”). Phương án “composite vs JavaScript” hấp dẫn nhưng sai — mọi action cục bộ, loại nào cũng vậy, đều chưa tồn tại cho tới checkout. Muốn dùng action chung trước checkout, hãy phát hành nó và gọi owner/repo/duong-dan@sha.',
          },
          {
            question: 'A workflow declares permissions: contents: read and uses checkout with its defaults. A later step (for example a dependency’s postinstall script) runs git push origin HEAD:refs/heads/x. What happens, and which two settings together give the safest outcome?|||Một workflow khai permissions: contents: read và dùng checkout mặc định. Một bước sau (ví dụ script postinstall của một phụ thuộc) chạy git push origin HEAD:refs/heads/x. Chuyện gì xảy ra, và hai thiết lập nào cùng nhau cho kết quả an toàn nhất?',
            options: [
              'The push succeeds, because checkout’s credential is independent of permissions:; only persist-credentials: false helps|||Push thành công, vì khoá của checkout độc lập với permissions:; chỉ persist-credentials: false giúp được',
              'The push fails with “could not read Username”, because contents: read also removes the credential|||Push hỏng với “could not read Username”, vì contents: read cũng gỡ luôn khoá',
              '403 “denied to github-actions[bot]”: the credential was present but read-only — persist-credentials: false removes it, permissions: caps it|||403 “denied to github-actions[bot]”: khoá CÓ mặt nhưng chỉ đọc — persist-credentials: false gỡ nó, permissions: đặt trần cho nó',
              'The push is queued for approval by a repository admin, because the actor is a bot|||Push được xếp hàng chờ quản trị viên duyệt, vì người thực hiện là bot',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Run 36000261745: with contents: read the push returned “Permission to cuonghoang1103/ga-san-tap.git denied to github-actions[bot]” (403) — proof the token was there and working, just not allowed. With persist-credentials: false the same push failed with “could not read Username”, because no credential was left. The second option mixes the two: permissions: does not remove the credential, it limits what it can do. Set both.|||VI: Run 36000261745: với contents: read, lệnh push trả “Permission to cuonghoang1103/ga-san-tap.git denied to github-actions[bot]” (403) — bằng chứng token CÓ ở đó và chạy được, chỉ là không được phép. Với persist-credentials: false, cùng lệnh push hỏng với “could not read Username”, vì không còn khoá nào. Phương án thứ hai trộn lẫn hai thứ: permissions: không gỡ khoá, nó giới hạn thứ khoá làm được. Đặt cả hai.',
          },
        ],
      },
    },
  ],
};
