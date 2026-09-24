import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 1: Tệp workflow, và những cái bẫy sinh ra vì nó là YAML.
 * Số đo: pyyaml trên chuẩn YAML 1.1, và 10 lần chạy theo lịch THẬT của kho này.
 */

export default {
  title: 'Chapter 1 — The workflow file, and the traps that come from YAML|||Chương 1 — Tệp workflow, và những cái bẫy tới từ YAML',
  slug: 'ga-ch1-tep-workflow',
  description: 'Cái khoá `on:` trong mọi workflow bị YAML đọc thành boolean `True`. `node-version: 18.20` thành `18.2`. Và mười lần chạy theo lịch của kho này: KHÔNG lần nào đúng giờ, trễ trung bình 2,6 tiếng.',
  sortOrder: 2,
  lessons: [

    /* ─────────────────────────── 1.0 ─────────────────────────── */
    {
      title: '1.0 — Chapter 1 slides: the workflow file in pictures|||1.0 — Slide Chương 1: tệp workflow bằng hình',
      slug: 'ga-1-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 1: giải phẫu một workflow, một push đi qua 6 chặng, bẫy YAML đo trên runner thật, bộ kích hoạt, cron trễ bao lâu, merge commit của pull_request và bộ lọc branches/paths — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the eight keys of a workflow file, the six stages one push goes through, a runner installing Node 18.2.0 because of two missing quotes, fourteen Sunday crons that were never on time, and the merge commit that nobody pushed.</p>
<p>Slides 3–8 belong to Lesson 1.1, 9–13 to 1.2, 14–18 to 1.3, 19–24 to 1.4 and 25–29 to 1.5. The last three are the chapter&#39;s common mistakes, a cheat sheet, and a 45-minute practice session. Every log on the slides is real: recorded on 24 September 2026 on GitHub-hosted <code>ubuntu-24.04</code> runners in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a> (branch <code>ch01-workflow</code>, PRs #1 and #2), plus PyYAML 6.0.3, yq 4.53 and actionlint 1.7.12 in containers. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: tám khoá của một tệp workflow, sáu chặng mà một cú push đi qua, một runner cài Node 18.2.0 chỉ vì thiếu hai dấu nháy, mười bốn lần cron Chủ nhật không lần nào đúng giờ, và cái merge commit không ai push.</p>
<p>Slide 3–8 thuộc Bài 1.1, 9–13 thuộc 1.2, 14–18 thuộc 1.3, 19–24 thuộc 1.4 và 25–29 thuộc 1.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi log trên slide là THẬT: ghi ngày 24/09/2026 trên runner <code>ubuntu-24.04</code> của GitHub, trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a> (nhánh <code>ch01-workflow</code>, PR #1 và #2), cộng PyYAML 6.0.3, yq 4.53 và actionlint 1.7.12 chạy trong container — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('ga-01', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Giải phẫu một file workflow'], [4, 'Một push đi qua 6 chặng — 10 giây'], [5, 'PyYAML đọc on: thành True, yq thì không'],
  [6, 'Không nháy: 18.20 ⇒ Node 18.2.0'], [7, 'run: > gập hai lệnh thành một'], [8, 'actionlint bắt 4 lỗi, GitHub báo 1'],
  [9, 'api-backend: 14 workflow, 1 cái chạy khi push'], [10, 'Deploy thôi tự động vì hai workflow đua nhau'], [11, 'Sáu bộ kích hoạt'],
  [12, 'pull_request mặc định: 3 loại hoạt động'], [13, 'workflow_dispatch và bẫy boolean'],
  [14, 'Cron 03:00 UTC: 14 lần, không lần nào đúng giờ'], [15, 'Cron */5 trên sân tập'], [16, 'UTC, giờ Việt Nam và timezone:'],
  [17, 'schedule dùng cho việc gì'], [18, 'Cron trên nhánh tính năng không chạy'],
  [19, 'pull_request chạy trên commit thứ ba'], [20, 'Hai nhánh xanh, run PR đỏ'], [21, 'GITHUB_SHA và head.sha'],
  [22, 'API và job nhìn hai sha khác nhau'], [23, 'Xung đột ⇒ không có lần chạy'], [24, 'pull_request_target và bí mật'],
  [25, 'Bộ lọc paths: 3 commit × 2 workflow'], [26, 'src/* khớp 1 file, src/** khớp 353'], [27, 'branches lọc nhánh đích'],
  [28, 'paths trên PR + ô kiểm bắt buộc'], [29, 'Bộ lọc giấu job không tồn tại'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 1'],
])}
`,
    },

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — It is YAML, and that is where the traps live|||1.1 — Nó là YAML, và bẫy nằm ở đó',
      slug: 'ga-1-1-la-yaml',
      type: 'VIDEO',
      description: 'Cái khoá `on:` mở đầu mọi workflow trên đời bị YAML đọc thành boolean `True`. `node-version: 18.20` thành `18.2`. Và `run: >` gấp hai câu lệnh thành một, khiến câu thứ hai KHÔNG BAO GIỜ chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>It is YAML, and that is where the traps live</h2>
<p class="lead">A workflow file is not a GitHub Actions file that happens to use YAML syntax. It <em>is</em> a YAML document, parsed by a YAML parser, with all of YAML&#39;s opinions about what your text means. Most of the surprises in this chapter are YAML&#39;s, not GitHub&#39;s.</p>

<h3>Anatomy of a workflow file, line by line</h3>
${slide('ga-01', 3, 'Anatomy of a workflow file — eight keys are enough to read any file')}
<p>Before any trap, the vocabulary. This is the smallest workflow in this chapter&#39;s sandbox repository, and it runs for real on <a href="https://github.com/cuonghoang1103/ga-san-tap/blob/ch01-workflow/.github/workflows/ch01-giai-phau.yml" target="_blank" rel="noopener">github.com/cuonghoang1103/ga-san-tap</a>. Every other file in this course is the same eight keys, arranged differently.</p>
<pre><code class="language-yaml">name: ch01 giai phau
on:
  push:
    branches: [ch01-workflow]
  workflow_dispatch:
jobs:
  xem:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '22'
      - name: Ai kich hoat toi
        run: |
          echo "su kien : $GITHUB_EVENT_NAME"
          echo "ref     : $GITHUB_REF"
          echo "sha     : $GITHUB_SHA"
          echo "may     : $RUNNER_NAME ($RUNNER_OS, $ImageOS $ImageVersion)"
          node --version</code></pre>
<div class="kv-grid">
<div class="kv"><span class="k"><code>name:</code></span><span class="v">The label shown in the Actions tab. Optional — without it GitHub shows the file path, which is exactly what you see when the file fails to parse.</span></div>
<div class="kv"><span class="k"><code>on:</code></span><span class="v">WHEN. A list or a map of events (push, pull_request, schedule…), each with optional filters. Lessons 1.2–1.5 are entirely about this key.</span></div>
<div class="kv"><span class="k"><code>jobs:</code></span><span class="v">WHAT. A map of jobs. The key under it (<code>xem</code>) is the job id you invent; other jobs refer to it with <code>needs:</code>.</span></div>
<div class="kv"><span class="k"><code>runs-on:</code></span><span class="v">WHERE. A runner label. <code>ubuntu-latest</code> means "give me a fresh GitHub-hosted Linux virtual machine" — fresh every single time.</span></div>
<div class="kv"><span class="k"><code>steps:</code></span><span class="v">HOW. A <em>list</em> (hence the dashes), executed top to bottom on that one machine. First failing step stops the job.</span></div>
<div class="kv"><span class="k"><code>uses:</code></span><span class="v">A step that runs someone else&#39;s packaged code — an <em>action</em> — pinned by a ref such as <code>@v7</code>. Chapter 4 is about choosing and pinning them.</span></div>
<div class="kv"><span class="k"><code>with:</code></span><span class="v">The inputs of that action. Every value here arrives at the action as a string — which is why the YAML type of <code>18.20</code> matters so much (below).</span></div>
<div class="kv"><span class="k"><code>run:</code></span><span class="v">A step that runs shell commands. On Linux the default is <code>bash -e</code>, so the first failing command fails the step.</span></div>
</div>

<p>Read any workflow as four nested questions: <strong>WHEN</strong> does it start (<code>on</code>), <strong>WHAT</strong> does it do (<code>jobs</code>), <strong>WHERE</strong> does each job run (<code>runs-on</code>), <strong>HOW</strong> does it do it (<code>steps</code>, each either <code>uses</code> or <code>run</code>). If you can answer those four out loud for a file you have never seen, you can read it.</p>

<table>
<thead><tr><th>Level</th><th>Runs</th><th>Shares with its siblings</th></tr></thead>
<tbody>
<tr><td>workflow (one file)</td><td>once per matching event</td><td>nothing — each file is independent</td></tr>
<tr><td>job</td><td>in parallel by default, each on its OWN new machine</td><td>nothing on disk; only declared outputs/artifacts (Chapter 2)</td></tr>
<tr><td>step</td><td>one after another, same machine</td><td>the working directory, files, installed tools</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Where the file must live.</strong> Any file ending in <code>.yml</code> or <code>.yaml</code> directly inside <code>.github/workflows/</code> on the commit being processed. The filename is free — <code>ci.yml</code>, <code>ch01-giai-phau.yml</code> — but a file in a subfolder of <code>workflows/</code> or in <code>.github/workflow/</code> (no s) is silently ignored. One file is one workflow; there is no "main" file.</p>
</div>

<h3>What one push actually sets in motion</h3>
${slide('ga-01', 4, 'One push, six stages, ten seconds — measured')}
<p>"I pushed and CI ran" hides six separate things, each of which can be the one that went wrong. Here is one real push to the sandbox, timed from the API (<code>gh api repos/…/actions/runs/35987243212</code> and <code>…/jobs</code>) and the job log:</p>
<div class="out">git push xong        10:26:35   commit ed08af5 -&gt; ch01-workflow
run duoc tao         10:26:37   run 35987243212, event=push, status=queued
job bat dau          10:26:40   runner "GitHub Actions 1000004248"
  Set up job           10:26:41
  actions/checkout@v7  10:26:41 -&gt; 10:26:42
  actions/setup-node   10:26:42 -&gt; 10:26:43
  Ai kich hoat toi     10:26:43
job xong             10:26:44
run xong             10:26:45   conclusion=success</div>
<div class="out">su kien : push
ref     : refs/heads/ch01-workflow
sha     : ed08af582805ec970cef633fb09e45aca1c46164
may     : GitHub Actions 1000004248 (Linux, ubuntu24 20260907.300.1)
v22.23.2</div>
<ol>
<li><strong>git push</strong> — git sends the commit. Nothing about Actions has happened yet.</li>
<li><strong>The event.</strong> GitHub records a <code>push</code> event with its payload: the ref (<code>refs/heads/ch01-workflow</code>), the new sha, who pushed.</li>
<li><strong>Matching.</strong> GitHub reads every file in <code>.github/workflows/</code> <em>as it exists in the pushed commit</em> and evaluates each <code>on:</code> block against the event. At that commit the branch had six workflow files; two matched (this one, and the test workflow). Each match becomes its own <em>run</em>. The other four were filtered out and left no trace — Lesson 1.5 is about that silence.</li>
<li><strong>Queue.</strong> The run and its job exist, status <code>queued</code>, two seconds after the push.</li>
<li><strong>A runner picks the job up</strong> — a brand-new virtual machine, three seconds later. The first log lines say exactly which one: </li>
</ol>
<div class="out">Current runner version: '2.337.0'
Azure Region: westcentralus
Operating System: Ubuntu 24.04.5 LTS
Image: ubuntu-24.04   Version: 20260907.300.1
GITHUB_TOKEN Permissions:  Contents: read  Metadata: read  Packages: read
Download action repository 'actions/checkout@v7' (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)</div>
<ol start="6">
<li><strong>Steps run, the log is stored, the run gets a conclusion.</strong> Four seconds of work, one second to close the run. The machine is then destroyed — anything the job left on disk is gone.</li>
</ol>

<div class="callout ok">
<p><strong>Two consequences worth keeping.</strong> (1) Because matching uses the files <em>in the pushed commit</em>, a push that edits a workflow is processed by the edited version — you can fix a broken workflow in the same push that exercises it. (2) Because every job gets a fresh machine, "it worked yesterday" never means leftover state; it means the inputs changed (code, action version, runner image). The image version (<code>20260907.300.1</code>) is in the log for exactly that reason.</p>
</div>

<h4>Run it step by step on your own repository</h4>
<pre><code class="language-bash">mkdir thu-actions &amp;&amp; cd thu-actions &amp;&amp; git init -b main
mkdir -p .github/workflows
# paste the file above into .github/workflows/giai-phau.yml, with branches: [main]
git add . &amp;&amp; git commit -m "first workflow"
gh repo create thu-actions --public --source . --push
gh run list -L 5          # the run appears within seconds
gh run watch              # follow it live
gh run view --log         # the full log, every step
git rev-parse HEAD        # compare with the "sha :" line in the log</code></pre>

<h3>Start with the first key in every workflow ever written</h3>
${slide('ga-01', 5, 'PyYAML reads the on: key as True — yq does not')}
<p>Re-measured on 24 September 2026, in throw-away containers: PyYAML 6.0.3 (which implements YAML 1.1) still returns <code>True</code> as the key, and still turns the country code <code>NO</code> into <code>False</code>. The Go-based <code>yq</code> 4.53.6 implements YAML 1.2, where only <code>true</code>/<code>false</code> are booleans:</p>
<div class="out">$ docker run --rm -v "$PWD":/w mikefarah/yq:4 'keys' /w/thu.yml
- name
- on
- jobs
country -&gt; NO     (!!str)
node-version -&gt; 18.20  (!!float)   &lt;- still a number in YAML 1.2</div>
<p>So the choice of parser changes the <code>on</code> trap but not the version-number trap below — keep that asymmetry in mind.</p>

<pre><code>name: thu
on:
  push:
    branches: [main]
jobs:
  a:
    runs-on: ubuntu-latest</code></pre>

<p>Parse that with a standard YAML parser and ask what the top-level keys are:</p>

<div class="out">cac khoa cap tren: {'name': str, True: bool, 'jobs': str}

d[True]        = {'push': {'branches': ['main']}}
d.get("on")    = None</div>

<div class="callout warn">
<p><strong>The key is not the string <code>"on"</code>. It is the boolean <code>True</code>.</strong> YAML 1.1 treats <code>on</code>, <code>yes</code>, <code>y</code>, <code>true</code> and their negatives as booleans, and an unquoted key is a scalar like any other. So the single most important key in GitHub Actions — the one that decides when your workflow runs — is stored under a boolean.</p>
</div>

<p>This does not break your workflow: GitHub&#39;s own parser knows and handles it. It breaks <em>your tooling</em>. Every script that lints workflows, every "list all triggers" one-liner, every editor plugin that reads the file has to know to look up <code>True</code> as well as <code>"on"</code>. If you have ever written a five-line script to audit your workflows and got empty results, this is why.</p>

<h3>The one that silently changes your runtime</h3>
${slide('ga-01', 6, 'Unquoted 18.20 makes the runner install Node 18.2.0')}
<p>The table below comes from PyYAML. Is GitHub&#39;s own parser different? The sandbox has two jobs that differ only in the quotes (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986150275" target="_blank" rel="noopener">run 35986150275</a>). The runner echoes the <code>with:</code> it actually received:</p>
<div class="out">job khong-nhay (node-version: 18.20)     job co-nhay (node-version: '18.20')
with:                                    with:
  node-version: 18.2                       node-version: 18.20
Attempting to download 18.2...           Attempting to download 18.20...
Acquiring 18.2.0 - x64                   Acquiring 18.20.8 - x64
$ node --version                         $ node --version
v18.2.0                                  v18.20.8</div>
<p>No error, no warning, green tick. Node 18.2.0 is a real release, so <code>setup-node</code> installs it happily. That is what makes this trap expensive: nothing fails until some API that Node 18.2 does not have is called — and then the error message points at your code, not at a missing pair of quotes.</p>

<div class="out">| viet         | doc ra  | kieu  |
|--------------|---------|-------|
| yes / on     | True    | bool  |
| no / off / NO| False   | bool  |
| 1.20         | 1.2     | float |
| 3.10         | 3.1     | float |
| 18.20        | 18.2    | float |  ← BAY
| 08           | '08'    | str   |
| 2026-08-24   | date    | date  |
| "3.10"       | '3.10'  | str   |</div>

<p>Read the <code>18.20</code> row. Written unquoted, <code>node-version: 18.20</code> is the number eighteen point two — and <code>setup-node</code> is asked for Node <strong>18.2</strong>, a version from June 2022, instead of 18.20, a version from 2024. Same for <code>python-version: 3.10</code>, which becomes 3.1 — a Python released in 2009.</p>

<div class="callout ok">
<p><strong>This is why <code>ci-lint.yml</code> in this repository writes <code>node-version: '22'</code> with quotes.</strong> For <code>22</code> the quotes change nothing — an integer is unambiguous. The habit matters because the day somebody writes <code>18.20</code>, the quotes are already there. Quote every version number, always, without thinking about whether this particular one needs it.</p>
</div>

<div class="pitfall">
<p><strong>Trap — the "Norway problem" is real and it is this same rule.</strong> A list of country codes containing <code>NO</code> parses as <code>[..., False, ...]</code>. It has bitten enough people to have a name. The general rule: <strong>if a scalar could be read as something other than a string, and you meant a string, quote it.</strong> Version numbers, country codes, git refs, anything starting with a zero, anything that looks like a date.</p>
</div>

<h3>The one that silently drops a command</h3>
${slide('ga-01', 7, 'run: > folds two commands into one — the second one disappears')}
<p>Measured on a real runner too (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986150275" target="_blank" rel="noopener">run 35986150275</a>, job <code>gap-dong</code>). The only place the fold shows is the step header the runner prints — <code>Run echo mot echo hai</code> — which is exactly the line nobody reads on a green run.</p>

<p>YAML has five ways to write a multi-line string, and two of them are common in workflows:</p>

<div class="out">| dang | ket qua                |
|------|------------------------|
| \\|    | 'dong 1\\ndong 2\\n'     |  giu xuong dong
| >    | 'dong 1 dong 2\\n'      |  GAP thanh mot dong
| \\|-   | 'dong 1\\ndong 2'       |  bo \\n cuoi
| >-   | 'dong 1 dong 2'        |
| \\|+   | 'dong 1\\n\\n'           |  giu moi dong trong cuoi</div>

<p>Now put that in a step and run it for real:</p>

<pre><code>- run: |
    echo mot
    echo hai

- run: >
    echo mot
    echo hai</code></pre>

<div class="out">=== buoc dung dau | ===
mot
hai
=== buoc dung dau > (bi gap dong) ===
mot echo hai</div>

<div class="callout warn">
<p><strong>The second step ran one command, not two.</strong> <code>&gt;</code> folds newlines into spaces, so the shell received <code>echo mot echo hai</code> — a single <code>echo</code> with four arguments. The second command never ran, the step exited 0, and CI went green. Nothing anywhere reports this.</p>
</div>

<p>For a <code>run:</code> block you almost always want <code>|</code>. <code>&gt;</code> is for prose — a long <code>description</code> or a comment you want wrapped in the file but joined in the value.</p>

<h3>The rest of the YAML that matters here</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">indentation is structure</span><span class="lz-lnote">two spaces, never tabs — a tab is a parse error, and the message points at the line after the one you edited</span></div>
<div class="lz-layer"><span class="lz-lname">a list is <code>-</code>, a map is <code>key:</code></span><span class="lz-lnote"><code>steps:</code> is a list of maps, which is why every step starts with <code>-</code> and later keys line up under it</span></div>
<div class="lz-layer"><span class="lz-lname">inline forms are equivalent</span><span class="lz-lnote"><code>branches: [main]</code> and a two-line block form parse identically. This repository uses both, in the same file</span></div>
<div class="lz-layer"><span class="lz-lname"><code>#</code> is a comment anywhere</span><span class="lz-lnote">except inside a quoted string — and inside a <code>|</code> block, where it is part of the script and the shell sees it</span></div>
<div class="lz-layer"><span class="lz-lname"><code>{}</code> is an empty map</span><span class="lz-lnote"><code>workflow_dispatch: {}</code> means "this trigger, with no configuration" — the same as <code>workflow_dispatch:</code> with nothing after it</span></div>
</div>

<h3>Checking it before you push</h3>
${slide('ga-01', 8, 'actionlint catches four errors before the push — GitHub reports one, after it')}

<p>A workflow with a YAML error does not run — it appears in the Actions tab as a failed run with a parse message, which costs a round trip. Two ways to find out sooner:</p>

<pre><code><span class="tok-comment"># bat ky bo phan tich YAML nao cung bat duoc loi cu phap</span>
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))"

<span class="tok-comment"># actionlint kiem CA cu phap YAML LAN luoc do cua GitHub Actions</span>
actionlint .github/workflows/*.yml</code></pre>

<p>The first catches malformed YAML. The second catches valid YAML that is not a valid workflow — a misspelled key, a job referring to a <code>needs:</code> that does not exist, a shell expression that will not evaluate. It does <strong>not</strong>, however, catch the unquoted-version trap. (An earlier version of this lesson said it did. Measured with actionlint 1.7.12 on 24/09/2026: <code>node-version: 18.20</code>, <code>python-version: 3.10</code> and a <code>run: &gt;</code> block all pass with exit code 0, because each is valid YAML carrying a valid — just unintended — value.)</p>

<div class="callout ok">
<p><strong>The three rules that prevent most of this.</strong> <strong>(1)</strong> Quote every version number and every value that could be read as a boolean or a date. <strong>(2)</strong> Use <code>|</code> for <code>run:</code>, never <code>&gt;</code>. <strong>(3)</strong> Run a YAML parser over the file before pushing, because a parse error costs a full round trip to find.</p>
</div>

<h3>What actionlint catches — and what GitHub says instead</h3>
<p>One deliberately broken file, <code>ch01-hong.yml</code>, with four mistakes: <code>step:</code> instead of <code>steps:</code>, a <code>needs:</code> naming a job that does not exist (<code>biuld</code>), a PR title pasted straight into a shell line, and an unquoted <code>18.20</code>. First, actionlint in a container, before pushing:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color
ch01-hong.yml:6:3: "steps" section is missing in job "build" [syntax-check]
ch01-hong.yml:8:5: unexpected key "step" for "job" section. expected one of
  "concurrency", "container", ... "steps", "strategy", ... [syntax-check]
ch01-hong.yml:10:3: job "deploy" needs job "biuld" which does not exist
  in this workflow [job-needs]
ch01-hong.yml:14:23: "github.event.pull_request.title" is potentially untrusted.
  avoid using it directly in inline scripts. instead, pass it through an
  environment variable. [expression]
exit=1</div>
<p>Four findings; the unquoted version is not among them. Then the same file pushed anyway (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986887824" target="_blank" rel="noopener">run 35986887824</a>):</p>
<div class="out">X ch01-workflow .github/workflows/ch01-hong.yml · 35986887824
X This run likely failed because of a workflow file issue.

Invalid workflow file: .github/workflows/ch01-hong.yml#L1
(Line: 8, Col: 5): Unexpected value 'step'</div>
<div class="kv-grid">
<div class="kv"><span class="k">GitHub reports the FIRST error</span><span class="v">one line, only on the web page — <code>gh run view --log</code> has nothing, because zero jobs ran. Fix it, push, and the next error appears: one round trip per mistake.</span></div>
<div class="kv"><span class="k">the run is named after the PATH</span><span class="v">not after <code>name:</code> — GitHub could not read the file far enough to learn its name. A run titled <code>.github/workflows/…yml</code> in the Actions list is the signature of a parse failure.</span></div>
<div class="kv"><span class="k">actionlint reports all of them</span><span class="v">plus a security finding GitHub never mentions: interpolating an attacker-controlled PR title into a shell line is script injection (Chapter 6 measures it).</span></div>
<div class="kv"><span class="k">neither catches YAML typing</span><span class="v"><code>18.20</code> is a valid float and <code>run: &gt;</code> is a valid string. Only the habit of quoting (and <code>|</code>) protects you there.</span></div>
</div>

<p>Make it impossible to forget by running actionlint in CI itself — a job of a few seconds that fails the PR when a workflow file is wrong:</p>
<pre><code class="language-yaml">  lint-workflows:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:1.7.12 -color</code></pre>
<p>On your own machine, <code>brew install actionlint</code> (macOS) or the same <code>docker run</code> line works; pin the image tag in CI so the linter does not change under you. Another tool, <code>act</code>, can <em>run</em> a workflow locally in Docker — useful, but it is an imitation of a GitHub runner, so this course always says when an output came from <code>act</code> rather than from GitHub.</p>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: What is the difference between a workflow, a job, a step and an action?</strong><br>A: A workflow is one YAML file triggered by events. It contains jobs; each job runs on its own fresh runner and jobs run in parallel unless linked with <code>needs</code>. A job is a sequence of steps on one machine. A step is either a shell command (<code>run</code>) or a call to an action (<code>uses</code>) — a reusable, versioned package of steps.</p>
<p><strong>Q: A teammate wrote <code>python-version: 3.10</code> and CI installed Python 3.1. Why, and how do you stop it happening again?</strong><br>A: Unquoted, <code>3.10</code> is a YAML float, which is <code>3.1</code>; <code>with:</code> inputs are passed as strings of that value. Quote every version (<code>'3.10'</code>), and prefer version files or aliases (<code>node-version-file</code>, <code>lts/*</code>). Linters do not catch it because the value is valid.</p>
<p><strong>Q: How do you validate workflow changes before merging?</strong><br>A: A YAML parse, then actionlint (schema, <code>needs</code>, expressions, shellcheck of <code>run</code>, injection warnings) — locally and as a CI job; optionally <code>act</code> for a local dry run, knowing it is not a real GitHub runner; and finally the real run on a branch or PR.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team is adding its first CI. Before anyone trusts it, you want to see with your own eyes what a workflow file is, what one push sets in motion, and the three YAML traps.</p><ol>
<li>Create a throw-away public repository and add the anatomy workflow from the top of this lesson (use <code>branches: [main]</code>). Push, then run <code>gh run view --log</code>.</li>
<li>In the log, find the <code>sha :</code> line and compare it with <code>git rev-parse HEAD</code>. Find the runner version and the image version in "Set up job".</li>
<li>Add a second job with two <code>setup-node</code> steps, one with <code>node-version: 18.20</code> and one with <code>node-version: '18.20'</code>, each followed by <code>node --version</code>. Push and read both versions.</li>
<li>Add a step with <code>run: &gt;</code> over two <code>echo</code> lines. Push and find the <code>Run …</code> header in the log.</li>
<li>Copy the workflow to <code>broken.yml</code>, rename <code>steps:</code> to <code>step:</code>, and run actionlint on it BEFORE pushing. Then delete <code>broken.yml</code>.</li></ol>
<p><strong>Done when:</strong> the sha in the log equals your HEAD; the two jobs print <code>v18.2.0</code> and <code>v18.20.x</code>; the log shows <code>Run echo mot echo hai</code>; actionlint exits non-zero on <code>broken.yml</code>; and you can name which of the three traps actionlint did NOT flag.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow</span><span class="v">One YAML file in <code>.github/workflows/</code>; starts on the events in its <code>on:</code>.</span></div>
  <div class="kv"><span class="k">Job</span><span class="v">A group of steps that runs on one fresh runner. Jobs run in parallel unless linked with <code>needs:</code>.</span></div>
  <div class="kv"><span class="k">Step</span><span class="v">One command (<code>run:</code>) or one action (<code>uses:</code>) inside a job, executed in order.</span></div>
  <div class="kv"><span class="k">Action</span><span class="v">Packaged, versioned code you call with <code>uses:</code> and configure with <code>with:</code>.</span></div>
  <div class="kv"><span class="k">Runner</span><span class="v">The machine that executes a job; GitHub-hosted runners are new virtual machines each time.</span></div>
  <div class="kv"><span class="k">Scalar</span><span class="v">A single YAML value — string, number, boolean, date. The parser decides the type unless you quote it.</span></div>
  <div class="kv"><span class="k">Block scalar <code>|</code> / <code>&gt;</code></span><span class="v">Multi-line strings: <code>|</code> keeps newlines (use for <code>run:</code>), <code>&gt;</code> folds them into spaces.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">A static checker for workflow files: schema, <code>needs</code>, expressions, shell, injection risks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A workflow answers four questions: WHEN (<code>on</code>), WHAT (<code>jobs</code>), WHERE (<code>runs-on</code>), HOW (<code>steps</code> with <code>uses</code>/<code>with</code> or <code>run</code>).</li>
<li>One push = event → matching of every workflow file in the pushed commit → one run per match → queue → fresh runner → steps and log. Measured: 10 seconds end to end.</li>
<li>YAML 1.1 parsers read the key <code>on</code> as <code>True</code>; GitHub copes, your own scripts must look up <code>True</code> too.</li>
<li>Unquoted <code>18.20</code> reaches the runner as <code>18.2</code> and installs Node 18.2.0 with no error — quote every version.</li>
<li><code>run: &gt;</code> folds lines, so the second command never runs; use <code>|</code>.</li>
<li>actionlint catches schema, <code>needs</code> and injection mistakes before the push (GitHub shows only the first, after it) — but not YAML typing traps.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.2 specification — §7 Flow styles, §8 Block styles</span><span class="lc-sub">yaml.org/spec/1.2.2/#chapter-8-block-style-productions — the normative description of <code>|</code>, <code>&gt;</code>, and the chomping indicators <code>-</code> and <code>+</code> measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.1 — Boolean type</span><span class="lc-sub">yaml.org/type/bool.html — the resolution table that turns <code>on</code>, <code>yes</code> and <code>NO</code> into booleans. YAML 1.2 narrowed this, but most parsers still implement 1.1 behaviour by default.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — a static checker for workflow files; it knows the schema, the expression syntax, and the shell inside <code>run:</code>. Worth adding to your own CI.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — Supported version syntax</span><span class="lc-sub">github.com/actions/setup-node#supported-version-syntax — what strings it accepts, and why <code>lts/*</code> is often better than a number you have to remember to quote.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — quoting, and what the shell does with your string</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why <code>echo mot echo hai</code> is one command with four arguments, and how word splitting decides that.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Nó là YAML, và bẫy nằm ở đó</h2>
<p class="lead">Một tệp workflow không phải một tệp GitHub Actions tình cờ dùng cú pháp YAML. Nó <em>LÀ</em> một tài liệu YAML, được một bộ phân tích YAML đọc, kèm theo toàn bộ ý kiến của YAML về việc chữ của bạn có nghĩa gì. Phần lớn những bất ngờ trong chương này là của YAML, không phải của GitHub.</p>

<h3>Giải phẫu một tệp workflow, từng dòng một</h3>
${slide('ga-01', 3, 'Giải phẫu một file workflow — 8 khoá là đủ đọc mọi file')}
<p>Trước khi nói tới bẫy nào, hãy nắm bộ từ vựng. Đây là workflow nhỏ nhất trong kho sân tập của chương này, và nó chạy THẬT trên <a href="https://github.com/cuonghoang1103/ga-san-tap/blob/ch01-workflow/.github/workflows/ch01-giai-phau.yml" target="_blank" rel="noopener">github.com/cuonghoang1103/ga-san-tap</a>. Mọi tệp khác trong khoá học này đều chỉ là tám khoá ấy, sắp xếp theo cách khác.</p>
<pre><code class="language-yaml">name: ch01 giai phau
on:
  push:
    branches: [ch01-workflow]
  workflow_dispatch:
jobs:
  xem:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '22'
      - name: Ai kich hoat toi
        run: |
          echo "su kien : $GITHUB_EVENT_NAME"
          echo "ref     : $GITHUB_REF"
          echo "sha     : $GITHUB_SHA"
          echo "may     : $RUNNER_NAME ($RUNNER_OS, $ImageOS $ImageVersion)"
          node --version</code></pre>
<div class="kv-grid">
<div class="kv"><span class="k"><code>name:</code></span><span class="v">Cái nhãn hiện ở tab Actions. Không bắt buộc — thiếu nó GitHub hiện đường dẫn tệp, và đó cũng chính là thứ bạn thấy khi tệp đọc không nổi.</span></div>
<div class="kv"><span class="k"><code>on:</code></span><span class="v">KHI NÀO. Một danh sách hoặc ánh xạ các sự kiện (push, pull_request, schedule…), mỗi cái kèm bộ lọc tuỳ chọn. Bài 1.2–1.5 nói trọn về khoá này.</span></div>
<div class="kv"><span class="k"><code>jobs:</code></span><span class="v">LÀM GÌ. Một ánh xạ các job (công việc). Khoá ngay bên dưới (<code>xem</code>) là id do bạn tự đặt; job khác trỏ tới nó bằng <code>needs:</code>.</span></div>
<div class="kv"><span class="k"><code>runs-on:</code></span><span class="v">Ở ĐÂU. Nhãn của runner (máy chạy). <code>ubuntu-latest</code> nghĩa là "cho tôi một máy ảo Linux của GitHub, MỚI TINH" — mới ở MỌI lần chạy.</span></div>
<div class="kv"><span class="k"><code>steps:</code></span><span class="v">LÀM THẾ NÀO. Một <em>danh sách</em> (nên mới có dấu gạch đầu dòng), chạy từ trên xuống trên đúng một máy. Bước đầu tiên hỏng là job dừng.</span></div>
<div class="kv"><span class="k"><code>uses:</code></span><span class="v">Một bước chạy mã đóng gói sẵn của người khác — một <em>action</em> — ghim bằng một ref như <code>@v7</code>. Chương 4 dạy chọn và ghim chúng.</span></div>
<div class="kv"><span class="k"><code>with:</code></span><span class="v">Tham số đầu vào của action đó. Mọi giá trị ở đây tới tay action dưới dạng CHUỖI — nên kiểu YAML của <code>18.20</code> mới quan trọng đến thế (bên dưới).</span></div>
<div class="kv"><span class="k"><code>run:</code></span><span class="v">Một bước chạy lệnh shell. Trên Linux mặc định là <code>bash -e</code>, nên lệnh đầu tiên hỏng là cả bước hỏng.</span></div>
</div>

<p>Đọc mọi workflow như bốn câu hỏi lồng nhau: <strong>KHI NÀO</strong> nó bắt đầu (<code>on</code>), nó <strong>LÀM GÌ</strong> (<code>jobs</code>), mỗi job chạy <strong>Ở ĐÂU</strong> (<code>runs-on</code>), làm <strong>THẾ NÀO</strong> (<code>steps</code>, mỗi bước hoặc <code>uses</code> hoặc <code>run</code>). Nếu bạn trả lời to được bốn câu đó cho một tệp chưa từng thấy, thì bạn đọc được nó.</p>

<table>
<thead><tr><th>Cấp</th><th>Chạy thế nào</th><th>Dùng chung gì với anh em cùng cấp</th></tr></thead>
<tbody>
<tr><td>workflow (một tệp)</td><td>một lần cho mỗi sự kiện khớp</td><td>không gì cả — mỗi tệp độc lập</td></tr>
<tr><td>job</td><td>song song theo mặc định, mỗi job một máy MỚI của riêng nó</td><td>không gì trên đĩa; chỉ output/artifact khai báo rõ (Chương 2)</td></tr>
<tr><td>step</td><td>lần lượt từng bước, cùng một máy</td><td>thư mục làm việc, file, công cụ đã cài</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Tệp phải nằm ở đâu.</strong> Mọi tệp đuôi <code>.yml</code> hoặc <code>.yaml</code> nằm TRỰC TIẾP trong <code>.github/workflows/</code> của commit đang được xử lý. Tên tệp tuỳ bạn — <code>ci.yml</code>, <code>ch01-giai-phau.yml</code> — nhưng một tệp trong thư mục con của <code>workflows/</code>, hay trong <code>.github/workflow/</code> (thiếu chữ s), sẽ bị bỏ qua ÂM THẦM. Một tệp là một workflow; không có tệp "chính" nào.</p>
</div>

<h3>Một cú push thật ra khởi động những gì</h3>
${slide('ga-01', 4, 'Một push đi qua 6 chặng, 10 giây — đo thật')}
<p>Câu "tôi push và CI chạy" giấu đi SÁU việc riêng rẽ, và việc nào cũng có thể là chỗ hỏng. Đây là một cú push thật lên sân tập, đo giờ bằng API (<code>gh api repos/…/actions/runs/35987243212</code> và <code>…/jobs</code>) cộng với log của job:</p>
<div class="out">git push xong        10:26:35   commit ed08af5 -&gt; ch01-workflow
run duoc tao         10:26:37   run 35987243212, event=push, status=queued
job bat dau          10:26:40   runner "GitHub Actions 1000004248"
  Set up job           10:26:41
  actions/checkout@v7  10:26:41 -&gt; 10:26:42
  actions/setup-node   10:26:42 -&gt; 10:26:43
  Ai kich hoat toi     10:26:43
job xong             10:26:44
run xong             10:26:45   conclusion=success</div>
<div class="out">su kien : push
ref     : refs/heads/ch01-workflow
sha     : ed08af582805ec970cef633fb09e45aca1c46164
may     : GitHub Actions 1000004248 (Linux, ubuntu24 20260907.300.1)
v22.23.2</div>
<ol>
<li><strong>git push</strong> — git gửi commit đi. Actions chưa có gì xảy ra cả.</li>
<li><strong>Sự kiện.</strong> GitHub ghi lại một sự kiện <code>push</code> kèm payload (gói dữ liệu): ref (<code>refs/heads/ch01-workflow</code>), sha mới, ai đã push.</li>
<li><strong>So khớp.</strong> GitHub đọc mọi tệp trong <code>.github/workflows/</code> <em>đúng như nó có trong commit vừa push</em> rồi xét khối <code>on:</code> của từng tệp với sự kiện đó. Tại commit ấy nhánh có sáu tệp workflow; hai tệp khớp (tệp này, và workflow test). Mỗi tệp khớp thành một <em>run</em> (lần chạy) riêng. Bốn tệp kia bị lọc ra và KHÔNG để lại dấu vết gì — bài 1.5 nói về sự im lặng ấy.</li>
<li><strong>Xếp hàng.</strong> Run và job của nó đã tồn tại, trạng thái <code>queued</code>, hai giây sau cú push.</li>
<li><strong>Một runner nhận job</strong> — một máy ảo mới tinh, ba giây sau. Mấy dòng log đầu tiên nói rõ đó là máy nào:</li>
</ol>
<div class="out">Current runner version: '2.337.0'
Azure Region: westcentralus
Operating System: Ubuntu 24.04.5 LTS
Image: ubuntu-24.04   Version: 20260907.300.1
GITHUB_TOKEN Permissions:  Contents: read  Metadata: read  Packages: read
Download action repository 'actions/checkout@v7' (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)</div>
<ol start="6">
<li><strong>Các bước chạy, log được lưu, run nhận kết luận.</strong> Bốn giây làm việc, một giây để chốt run. Sau đó máy bị huỷ — mọi thứ job để lại trên đĩa đều mất.</li>
</ol>

<div class="callout ok">
<p><strong>Hai hệ quả đáng giữ lại.</strong> (1) Vì việc so khớp dùng các tệp <em>trong commit vừa push</em>, nên một cú push sửa workflow sẽ được xử lý bằng CHÍNH bản đã sửa — bạn sửa được một workflow hỏng ngay trong cú push chạy nó. (2) Vì mỗi job một máy mới, "hôm qua còn chạy" không bao giờ nghĩa là trạng thái còn sót lại; nó nghĩa là đầu vào đã đổi (mã, phiên bản action, ảnh của runner). Phiên bản ảnh (<code>20260907.300.1</code>) nằm trong log chính vì lý do đó.</p>
</div>

<h4>Chạy thử từng bước trên kho của chính bạn</h4>
<pre><code class="language-bash">mkdir thu-actions &amp;&amp; cd thu-actions &amp;&amp; git init -b main
mkdir -p .github/workflows
# dan tep o tren vao .github/workflows/giai-phau.yml, doi thanh branches: [main]
git add . &amp;&amp; git commit -m "workflow dau tien"
gh repo create thu-actions --public --source . --push
gh run list -L 5          # lan chay hien ra sau vai giay
gh run watch              # theo doi truc tiep
gh run view --log         # toan bo log, moi buoc
git rev-parse HEAD        # so voi dong "sha :" trong log</code></pre>

<h3>Bắt đầu từ cái khoá đầu tiên trong mọi workflow từng được viết ra</h3>
${slide('ga-01', 5, 'Khoá on: bị PyYAML đọc thành True — yq thì không')}
<p>Đo lại ngày 24/09/2026 trong container dùng-xong-bỏ: PyYAML 6.0.3 (cài đặt YAML 1.1) VẪN trả về <code>True</code> làm khoá, và VẪN biến mã quốc gia <code>NO</code> thành <code>False</code>. Còn <code>yq</code> 4.53.6 (viết bằng Go) cài đặt YAML 1.2, nơi chỉ <code>true</code>/<code>false</code> mới là boolean:</p>
<div class="out">$ docker run --rm -v "$PWD":/w mikefarah/yq:4 'keys' /w/thu.yml
- name
- on
- jobs
country -&gt; NO     (!!str)
node-version -&gt; 18.20  (!!float)   &lt;- van la SO trong YAML 1.2</div>
<p>Vậy đổi bộ phân tích thì đổi được cái bẫy <code>on</code>, nhưng KHÔNG đổi được cái bẫy số phiên bản ngay dưới đây — hãy nhớ sự bất đối xứng ấy.</p>

<pre><code>name: thu
on:
  push:
    branches: [main]
jobs:
  a:
    runs-on: ubuntu-latest</code></pre>

<p>Đem cái đó cho một bộ phân tích YAML chuẩn rồi hỏi các khoá cấp trên là gì:</p>

<div class="out">cac khoa cap tren: {'name': str, True: bool, 'jobs': str}

d[True]        = {'push': {'branches': ['main']}}
d.get("on")    = None</div>

<div class="callout warn">
<p><strong>Cái khoá đó KHÔNG phải chuỗi <code>"on"</code>. Nó là boolean <code>True</code>.</strong> YAML 1.1 coi <code>on</code>, <code>yes</code>, <code>y</code>, <code>true</code> và các dạng phủ định của chúng là boolean, và một khoá không đặt trong nháy thì cũng là một vô hướng như mọi vô hướng khác. Nên cái khoá QUAN TRỌNG NHẤT trong GitHub Actions — cái quyết định workflow của bạn chạy lúc nào — được lưu dưới một giá trị boolean.</p>
</div>

<p>Chuyện này KHÔNG làm hỏng workflow của bạn: bộ phân tích của chính GitHub biết và xử lý được. Nó làm hỏng <em>CÔNG CỤ CỦA BẠN</em>. Mọi script đi soi workflow, mọi dòng lệnh "liệt kê tất cả trigger", mọi plugin trình soạn thảo đọc cái tệp đó đều phải biết mà tra cả <code>True</code> lẫn <code>"on"</code>. Nếu bạn từng viết một script năm dòng để kiểm kê workflow của mình và nhận về kết quả rỗng, thì đây là lý do.</p>

<h3>Cái bẫy ÂM THẦM đổi môi trường chạy của bạn</h3>
${slide('ga-01', 6, 'Không nháy: 18.20 ⇒ runner cài Node 18.2.0')}
<p>Bảng dưới đây là của PyYAML. Vậy bộ phân tích của chính GitHub có khác không? Sân tập có hai job chỉ khác nhau đúng cặp nháy (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986150275" target="_blank" rel="noopener">run 35986150275</a>). Runner in lại khối <code>with:</code> mà nó THẬT SỰ nhận được:</p>
<div class="out">job khong-nhay (node-version: 18.20)     job co-nhay (node-version: '18.20')
with:                                    with:
  node-version: 18.2                       node-version: 18.20
Attempting to download 18.2...           Attempting to download 18.20...
Acquiring 18.2.0 - x64                   Acquiring 18.20.8 - x64
$ node --version                         $ node --version
v18.2.0                                  v18.20.8</div>
<p>Không lỗi, không cảnh báo, dấu tick xanh. Node 18.2.0 là một bản phát hành CÓ THẬT, nên <code>setup-node</code> cài nó vui vẻ. Đó là thứ làm cái bẫy này đắt: chẳng có gì hỏng cho tới khi mã gọi một API mà Node 18.2 không có — và lúc đó dòng báo lỗi chỉ vào mã của BẠN, không chỉ vào một cặp nháy bị thiếu.</p>

<div class="out">| viet         | doc ra  | kieu  |
|--------------|---------|-------|
| yes / on     | True    | bool  |
| no / off / NO| False   | bool  |
| 1.20         | 1.2     | float |
| 3.10         | 3.1     | float |
| 18.20        | 18.2    | float |  ← BAY
| 08           | '08'    | str   |
| 2026-08-24   | date    | date  |
| "3.10"       | '3.10'  | str   |</div>

<p>Đọc dòng <code>18.20</code>. Viết không nháy, <code>node-version: 18.20</code> là con số mười tám phẩy hai — và <code>setup-node</code> được yêu cầu cài Node <strong>18.2</strong>, một phiên bản từ tháng 6 năm 2022, thay vì 18.20, một phiên bản từ 2024. Tương tự với <code>python-version: 3.10</code>, thành 3.1 — một bản Python phát hành năm 2009.</p>

<div class="callout ok">
<p><strong>Đây là lý do <code>ci-lint.yml</code> của kho này viết <code>node-version: '22'</code> CÓ NHÁY.</strong> Với <code>22</code> thì cặp nháy chẳng đổi gì — một số nguyên thì không mơ hồ. Cái đáng giá là THÓI QUEN: tới cái ngày có người viết <code>18.20</code> thì cặp nháy đã sẵn ở đó rồi. Hãy đặt nháy cho MỌI số phiên bản, LUÔN LUÔN, đừng dừng lại để nghĩ xem cái này có cần không.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — "vấn đề Na Uy" là có thật và nó chính là cái luật này.</strong> Một danh sách mã quốc gia có chứa <code>NO</code> sẽ đọc ra thành <code>[..., False, ...]</code>. Nó cắn đủ nhiều người để được đặt tên riêng. Quy tắc tổng quát: <strong>nếu một vô hướng CÓ THỂ bị đọc thành thứ khác ngoài chuỗi, mà bạn định nói chuỗi, thì hãy ĐẶT NHÁY.</strong> Số phiên bản, mã quốc gia, tham chiếu git, mọi thứ bắt đầu bằng số không, mọi thứ trông giống một ngày tháng.</p>
</div>

<h3>Cái bẫy ÂM THẦM vứt mất một câu lệnh</h3>
${slide('ga-01', 7, 'run: > gập hai lệnh thành MỘT — lệnh thứ hai biến mất')}
<p>Cũng đã đo trên runner thật (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986150275" target="_blank" rel="noopener">run 35986150275</a>, job <code>gap-dong</code>). Chỗ DUY NHẤT lộ ra cú gập là dòng tiêu đề bước mà runner in ra — <code>Run echo mot echo hai</code> — đúng cái dòng chẳng ai đọc khi run xanh.</p>

<p>YAML có năm cách viết một chuỗi nhiều dòng, và hai trong số đó hay gặp trong workflow:</p>

<div class="out">| dang | ket qua                |
|------|------------------------|
| \\|    | 'dong 1\\ndong 2\\n'     |  giu xuong dong
| >    | 'dong 1 dong 2\\n'      |  GAP thanh mot dong
| \\|-   | 'dong 1\\ndong 2'       |  bo \\n cuoi
| >-   | 'dong 1 dong 2'        |
| \\|+   | 'dong 1\\n\\n'           |  giu moi dong trong cuoi</div>

<p>Giờ đặt cái đó vào một bước và chạy THẬT:</p>

<pre><code>- run: |
    echo mot
    echo hai

- run: >
    echo mot
    echo hai</code></pre>

<div class="out">=== buoc dung dau | ===
mot
hai
=== buoc dung dau > (bi gap dong) ===
mot echo hai</div>

<div class="callout warn">
<p><strong>Bước thứ hai chạy MỘT câu lệnh, không phải hai.</strong> <code>&gt;</code> gấp các dấu xuống dòng thành dấu cách, nên shell nhận được <code>echo mot echo hai</code> — một lệnh <code>echo</code> duy nhất với bốn tham số. Câu lệnh thứ hai KHÔNG BAO GIỜ chạy, bước thoát 0, và CI xanh. Chẳng có gì ở đâu báo chuyện này.</p>
</div>

<p>Với một khối <code>run:</code> thì gần như luôn luôn bạn muốn <code>|</code>. Cái <code>&gt;</code> dành cho VĂN XUÔI — một dòng <code>description</code> dài hay một chú thích bạn muốn xuống dòng trong tệp mà nối liền trong giá trị.</p>

<h3>Phần YAML còn lại có ý nghĩa ở đây</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thụt lề LÀ cấu trúc</span><span class="lz-lnote">hai dấu cách, không bao giờ dùng tab — một cái tab là lỗi phân tích, và dòng thông báo trỏ vào dòng SAU cái dòng bạn vừa sửa</span></div>
<div class="lz-layer"><span class="lz-lname">danh sách là <code>-</code>, ánh xạ là <code>khoa:</code></span><span class="lz-lnote"><code>steps:</code> là một DANH SÁCH các ánh xạ, và đó là lý do mọi bước bắt đầu bằng <code>-</code> còn các khoá sau thì thẳng hàng dưới nó</span></div>
<div class="lz-layer"><span class="lz-lname">dạng nội dòng là TƯƠNG ĐƯƠNG</span><span class="lz-lnote"><code>branches: [main]</code> và dạng khối hai dòng phân tích ra y hệt nhau. Kho này dùng cả hai, trong cùng một tệp</span></div>
<div class="lz-layer"><span class="lz-lname"><code>#</code> là chú thích ở mọi chỗ</span><span class="lz-lnote">trừ bên trong một chuỗi có nháy — và bên trong một khối <code>|</code>, nơi nó là một phần của script và SHELL nhìn thấy nó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>{}</code> là một ánh xạ RỖNG</span><span class="lz-lnote"><code>workflow_dispatch: {}</code> nghĩa là "bộ kích hoạt này, không có cấu hình gì" — giống hệt <code>workflow_dispatch:</code> để trống phía sau</span></div>
</div>

<h3>Kiểm nó TRƯỚC khi push</h3>
${slide('ga-01', 8, 'actionlint bắt 4 lỗi trước push — GitHub báo 1, sau push')}

<p>Một workflow có lỗi YAML thì KHÔNG chạy — nó hiện ra ở tab Actions dưới dạng một lần chạy hỏng kèm dòng báo lỗi phân tích, và chuyện đó tốn một vòng đi về. Hai cách biết sớm hơn:</p>

<pre><code><span class="tok-comment"># bat ky bo phan tich YAML nao cung bat duoc loi cu phap</span>
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))"

<span class="tok-comment"># actionlint kiem CA cu phap YAML LAN luoc do cua GitHub Actions</span>
actionlint .github/workflows/*.yml</code></pre>

<p>Cái đầu bắt được YAML dị dạng. Cái thứ hai bắt được YAML HỢP LỆ mà không phải một workflow hợp lệ — một khoá gõ sai, một job trỏ tới một <code>needs:</code> không tồn tại, một biểu thức shell sẽ không tính ra được. Tuy nhiên nó <strong>KHÔNG</strong> bắt được cái bẫy phiên-bản-không-nháy. (Bản trước của bài này nói là có. Đo bằng actionlint 1.7.12 ngày 24/09/2026: <code>node-version: 18.20</code>, <code>python-version: 3.10</code> và một khối <code>run: &gt;</code> đều qua với mã thoát 0, vì mỗi cái là YAML hợp lệ mang một giá trị hợp lệ — chỉ là không đúng ý.)</p>

<div class="callout ok">
<p><strong>Ba quy tắc ngăn được phần lớn chuyện này.</strong> <strong>(1)</strong> Đặt nháy cho mọi số phiên bản và mọi giá trị có thể bị đọc thành boolean hay ngày tháng. <strong>(2)</strong> Dùng <code>|</code> cho <code>run:</code>, đừng bao giờ dùng <code>&gt;</code>. <strong>(3)</strong> Chạy một bộ phân tích YAML lên tệp trước khi push, vì một lỗi phân tích tốn trọn một vòng đi về mới tìm ra.</p>
</div>

<h3>actionlint bắt được gì — và GitHub nói gì thay vào đó</h3>
<p>Một tệp CỐ Ý hỏng, <code>ch01-hong.yml</code>, có bốn lỗi: <code>step:</code> thay cho <code>steps:</code>, một <code>needs:</code> gọi tên job không tồn tại (<code>biuld</code>), tiêu đề PR dán thẳng vào dòng shell, và một <code>18.20</code> không nháy. Trước hết, actionlint trong container, TRƯỚC khi push:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color
ch01-hong.yml:6:3: "steps" section is missing in job "build" [syntax-check]
ch01-hong.yml:8:5: unexpected key "step" for "job" section. expected one of
  "concurrency", "container", ... "steps", "strategy", ... [syntax-check]
ch01-hong.yml:10:3: job "deploy" needs job "biuld" which does not exist
  in this workflow [job-needs]
ch01-hong.yml:14:23: "github.event.pull_request.title" is potentially untrusted.
  avoid using it directly in inline scripts. instead, pass it through an
  environment variable. [expression]
exit=1</div>
<p>Bốn phát hiện; cái phiên bản không nháy KHÔNG nằm trong số đó. Rồi cứ push chính tệp ấy lên (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986887824" target="_blank" rel="noopener">run 35986887824</a>):</p>
<div class="out">X ch01-workflow .github/workflows/ch01-hong.yml · 35986887824
X This run likely failed because of a workflow file issue.

Invalid workflow file: .github/workflows/ch01-hong.yml#L1
(Line: 8, Col: 5): Unexpected value 'step'</div>
<div class="kv-grid">
<div class="kv"><span class="k">GitHub báo lỗi ĐẦU TIÊN</span><span class="v">một dòng, chỉ trên trang web — <code>gh run view --log</code> trống trơn vì KHÔNG job nào chạy. Sửa, push, lỗi kế tiếp mới hiện: mỗi lỗi tốn một vòng đi về.</span></div>
<div class="kv"><span class="k">run mang tên ĐƯỜNG DẪN</span><span class="v">không mang tên <code>name:</code> — GitHub đọc tệp không đủ xa để biết tên nó. Một run tên <code>.github/workflows/…yml</code> trong danh sách Actions là dấu hiệu nhận ra ngay của lỗi phân tích.</span></div>
<div class="kv"><span class="k">actionlint báo TẤT CẢ</span><span class="v">kèm một phát hiện bảo mật mà GitHub chẳng hề nhắc: nhét tiêu đề PR (kẻ tấn công điều khiển được) vào dòng shell là script injection — tiêm lệnh (Chương 6 đo nó).</span></div>
<div class="kv"><span class="k">không cái nào bắt lỗi KIỂU YAML</span><span class="v"><code>18.20</code> là số thực hợp lệ, <code>run: &gt;</code> là chuỗi hợp lệ. Chỉ thói quen đặt nháy (và dùng <code>|</code>) cứu được bạn ở đó.</span></div>
</div>

<p>Làm cho việc này KHÔNG THỂ bị quên bằng cách chạy actionlint ngay trong CI — một job vài giây, làm PR đỏ khi tệp workflow sai:</p>
<pre><code class="language-yaml">  lint-workflows:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:1.7.12 -color</code></pre>
<p>Trên máy bạn, <code>brew install actionlint</code> (macOS) hoặc đúng dòng <code>docker run</code> ấy là dùng được; trong CI hãy ghim tag của ảnh để bộ kiểm không tự đổi dưới chân bạn. Một công cụ khác, <code>act</code>, CHẠY được workflow ngay trên máy bằng Docker — hữu ích, nhưng nó là bản bắt chước runner của GitHub, nên khoá này luôn ghi rõ khi một output đến từ <code>act</code> chứ không phải từ GitHub.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Workflow, job, step và action khác nhau thế nào?</strong><br>Đ: Workflow là một tệp YAML được sự kiện kích hoạt. Nó chứa các job; mỗi job chạy trên một runner mới của riêng nó, và các job chạy song song trừ khi nối bằng <code>needs</code>. Một job là chuỗi các step trên một máy. Một step hoặc là lệnh shell (<code>run</code>) hoặc là lời gọi một action (<code>uses</code>) — một gói các bước dùng lại được, có phiên bản.</p>
<p><strong>H: Đồng đội viết <code>python-version: 3.10</code> và CI cài Python 3.1. Vì sao, và làm sao để không lặp lại?</strong><br>Đ: Không nháy thì <code>3.10</code> là số thực YAML, tức <code>3.1</code>; tham số <code>with:</code> được truyền dưới dạng chuỗi của giá trị đó. Đặt nháy mọi phiên bản (<code>'3.10'</code>), và ưu tiên tệp phiên bản hoặc bí danh (<code>node-version-file</code>, <code>lts/*</code>). Bộ lint không bắt được vì giá trị hợp lệ.</p>
<p><strong>H: Bạn kiểm tra thay đổi workflow trước khi gộp bằng cách nào?</strong><br>Đ: Phân tích YAML, rồi actionlint (lược đồ, <code>needs</code>, biểu thức, shellcheck cho <code>run</code>, cảnh báo tiêm lệnh) — trên máy và như một job CI; có thể thêm <code>act</code> để chạy thử cục bộ, biết rằng nó không phải runner thật của GitHub; và cuối cùng là lần chạy thật trên một nhánh hay PR.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn sắp thêm CI đầu tiên. Trước khi ai đó tin nó, bạn muốn tận mắt thấy một tệp workflow là gì, một cú push khởi động những gì, và ba cái bẫy YAML.</p><ol>
<li>Tạo một kho công khai dùng-xong-bỏ, thêm workflow giải phẫu ở đầu bài (đổi thành <code>branches: [main]</code>). Push, rồi chạy <code>gh run view --log</code>.</li>
<li>Trong log, tìm dòng <code>sha :</code> và so với <code>git rev-parse HEAD</code>. Tìm phiên bản runner và phiên bản ảnh trong "Set up job".</li>
<li>Thêm một job thứ hai có hai bước <code>setup-node</code>, một bước <code>node-version: 18.20</code> và một bước <code>node-version: '18.20'</code>, mỗi bước kèm <code>node --version</code>. Push và đọc cả hai phiên bản.</li>
<li>Thêm một bước <code>run: &gt;</code> trải trên hai dòng <code>echo</code>. Push và tìm dòng tiêu đề <code>Run …</code> trong log.</li>
<li>Chép workflow ra <code>broken.yml</code>, đổi <code>steps:</code> thành <code>step:</code>, và chạy actionlint lên nó TRƯỚC khi push. Rồi xoá <code>broken.yml</code>.</li></ol>
<p><strong>Đạt khi:</strong> sha trong log bằng HEAD của bạn; hai job in <code>v18.2.0</code> và <code>v18.20.x</code>; log hiện <code>Run echo mot echo hai</code>; actionlint thoát khác 0 với <code>broken.yml</code>; và bạn gọi được tên cái bẫy nào trong ba cái mà actionlint KHÔNG bắt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow (quy trình tự động)</span><span class="v">Một tệp YAML trong <code>.github/workflows/</code>; khởi động theo các sự kiện ghi trong <code>on:</code>.</span></div>
  <div class="kv"><span class="k">Job (công việc)</span><span class="v">Một nhóm bước chạy trên một runner mới. Các job chạy song song trừ khi nối bằng <code>needs:</code>.</span></div>
  <div class="kv"><span class="k">Step (bước)</span><span class="v">Một lệnh (<code>run:</code>) hoặc một action (<code>uses:</code>) trong job, chạy theo thứ tự.</span></div>
  <div class="kv"><span class="k">Action (gói hành động)</span><span class="v">Mã đóng gói sẵn, có phiên bản, gọi bằng <code>uses:</code> và cấu hình bằng <code>with:</code>.</span></div>
  <div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">Máy thực thi một job; runner do GitHub cấp là máy ảo MỚI ở mỗi lần.</span></div>
  <div class="kv"><span class="k">Scalar (giá trị vô hướng)</span><span class="v">Một giá trị YAML đơn — chuỗi, số, boolean, ngày. Bộ phân tích tự quyết kiểu trừ khi bạn đặt nháy.</span></div>
  <div class="kv"><span class="k">Block scalar <code>|</code> / <code>&gt;</code> (chuỗi khối)</span><span class="v">Chuỗi nhiều dòng: <code>|</code> giữ xuống dòng (dùng cho <code>run:</code>), <code>&gt;</code> gập thành dấu cách.</span></div>
  <div class="kv"><span class="k">actionlint (bộ kiểm tĩnh)</span><span class="v">Công cụ kiểm tệp workflow: lược đồ, <code>needs</code>, biểu thức, shell, nguy cơ tiêm lệnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một workflow trả lời bốn câu: KHI NÀO (<code>on</code>), LÀM GÌ (<code>jobs</code>), Ở ĐÂU (<code>runs-on</code>), THẾ NÀO (<code>steps</code> với <code>uses</code>/<code>with</code> hoặc <code>run</code>).</li>
<li>Một cú push = sự kiện → so khớp mọi tệp workflow TRONG commit vừa push → mỗi tệp khớp một run → xếp hàng → runner mới → các bước và log. Đo thật: 10 giây từ đầu tới cuối.</li>
<li>Bộ phân tích YAML 1.1 đọc khoá <code>on</code> thành <code>True</code>; GitHub tự xử lý được, script của BẠN thì phải tra cả <code>True</code>.</li>
<li><code>18.20</code> không nháy tới runner thành <code>18.2</code> và cài Node 18.2.0 mà không lỗi gì — đặt nháy MỌI phiên bản.</li>
<li><code>run: &gt;</code> gập dòng nên lệnh thứ hai không bao giờ chạy; dùng <code>|</code>.</li>
<li>actionlint bắt lỗi lược đồ, <code>needs</code> và tiêm lệnh TRƯỚC khi push (GitHub chỉ báo lỗi đầu tiên, SAU khi push) — nhưng không bắt được bẫy kiểu YAML.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả YAML 1.2 — §7 Flow styles, §8 Block styles</span><span class="lc-sub">yaml.org/spec/1.2.2/#chapter-8-block-style-productions — mô tả chuẩn tắc về <code>|</code>, <code>&gt;</code>, và các chỉ báo cắt <code>-</code> với <code>+</code> đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.1 — kiểu Boolean</span><span class="lc-sub">yaml.org/type/bool.html — cái bảng phân giải biến <code>on</code>, <code>yes</code> và <code>NO</code> thành boolean. YAML 1.2 đã thu hẹp lại, nhưng phần lớn bộ phân tích tới giờ vẫn cài đặt hành vi 1.1 theo mặc định.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — bộ kiểm tĩnh cho tệp workflow; nó biết lược đồ, biết cú pháp biểu thức, và biết cả cái shell nằm trong <code>run:</code>. Đáng thêm vào chính CI của bạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — Supported version syntax</span><span class="lc-sub">github.com/actions/setup-node#supported-version-syntax — nó nhận những chuỗi nào, và vì sao <code>lts/*</code> thường tốt hơn một con số mà bạn phải NHỚ đặt nháy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — dấu nháy, và shell làm gì với chuỗi của bạn</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao <code>echo mot echo hai</code> là MỘT lệnh với bốn tham số, và việc tách từ quyết định điều đó ra sao.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — What starts a run|||1.2 — Cái gì KHỞI ĐỘNG một lần chạy',
      slug: 'ga-1-2-kich-hoat',
      type: 'VIDEO',
      description: 'Mười một workflow trong kho này, và MƯỜI cái chỉ chạy khi có người bấm nút. Đó không phải lười — đó là một quyết định có ghi ngày, ra sau hai lần sập production thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What starts a run</h2>
<p class="lead">The trigger block is the most consequential part of a workflow, and the easiest to get wrong in a way nobody notices for months. Here is the actual inventory of one repository.</p>

<h3>Eleven workflows, counted</h3>
<div class="out">backend-vps.yml          workflow_dispatch
ci-lint.yml              pull_request, push, workflow_dispatch
deploy-ghcr.yml          workflow_dispatch
desktop-release.yml      workflow_dispatch
e2e-message-button.yml   workflow_dispatch
fix-containers.yml       workflow_dispatch
full-deploy.yml          workflow_dispatch
guard-no-duplicates.yml  workflow_dispatch
restart-containers.yml   workflow_dispatch
sync-frontend.yml        workflow_dispatch
vps-cleanup-weekly.yml   schedule, workflow_dispatch</div>

<div class="callout warn">
<p><strong>Nine of eleven run only when a human presses a button, one more runs on a weekly timer, and exactly one starts on a push.</strong> (An earlier version of this sentence said "ten of eleven"; <code>vps-cleanup-weekly.yml</code> also has a <code>schedule</code>, as the table shows.) That looks like an under-automated repository until you read why — and the why is written down, with dates, because it cost two outages.</p>
</div>

<p><strong>Recounted on 24 September 2026:</strong> the directory now holds fourteen files — three new manual workflows — and the shape has not moved. Counted with PyYAML, looking up the key <code>True</code> as well as <code>"on"</code> (Lesson 1.1 explains why a script that only asks for <code>"on"</code> would have printed fourteen empty lines):</p>
${slide('ga-01', 9, 'api-backend: 14 workflows, only one starts on a push')}
<div class="out">backend-vps.yml            workflow_dispatch
ci-lint.yml                pull_request, push, workflow_dispatch
deploy-ghcr.yml            workflow_dispatch
desktop-release.yml        workflow_dispatch
e2e-message-button.yml     workflow_dispatch
fix-containers.yml         workflow_dispatch
full-deploy.yml            workflow_dispatch
guard-no-duplicates.yml    workflow_dispatch
restart-containers.yml     workflow_dispatch
ship-lab211.yml            workflow_dispatch      &lt;- moi
ssh-port-apply.yml         workflow_dispatch      &lt;- moi
ssh-port-diagnostic.yml    workflow_dispatch      &lt;- moi
sync-frontend.yml          workflow_dispatch
vps-cleanup-weekly.yml     schedule, workflow_dispatch</div>
<h3>Why the deploys stopped being automatic</h3>
${slide('ga-01', 10, 'Deploys stopped being automatic because two workflows raced')}
<p>From this repository&#39;s own notes: two deploy workflows once both ran on every push to <code>main</code>, and they raced each other into production.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">2026-07-03</span><span class="lz-t">feed returning 500</span><span class="lz-d">the schema lagged behind the image — two pipelines finished in the wrong order</span></div>
<div class="lz-step"><span class="lz-k">2026-07-06</span><span class="lz-t">Exited(137) + orphan containers</span><span class="lz-d">a backend recreate race; recovered by hand with <code>docker start</code></span></div>
<div class="lz-step"><span class="lz-k">after</span><span class="lz-t">both moved to workflow_dispatch</span><span class="lz-d">"deploying stays a script you run, never a side effect of pushing"</span></div>
</div>

<p>Chapter 10 measures that decision properly. The point here is narrower and more useful: <strong>the trigger is a policy decision, not a formality.</strong> "Run on push" means "anybody who can push can start this", and if what it starts touches production, that is the same sentence as "anybody who can push can deploy".</p>

<h3>The triggers worth knowing</h3>
${slide('ga-01', 11, 'Six triggers cover 90% of workflows')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">a commit reached a branch or tag. Supports <code>branches</code>, <code>branches-ignore</code>, <code>tags</code>, <code>paths</code>, <code>paths-ignore</code></span></div>
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">a PR was opened, updated, reopened or retargeted. Runs against a <em>merge commit</em>, not your branch — 1.4 measures why that matters</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch</span><span class="lz-lnote">a human pressed Run workflow, or something called the API. Can declare typed <code>inputs</code>, which is how a deploy workflow asks "which environment?"</span></div>
<div class="lz-layer"><span class="lz-lname">schedule</span><span class="lz-lnote">cron, in UTC. 1.3 measures how punctual it actually is, and the answer will change how you use it</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_run</span><span class="lz-lnote">another workflow finished. The way to chain "test" into "deploy" without merging them into one file</span></div>
<div class="lz-layer"><span class="lz-lname">release, issues, issue_comment…</span><span class="lz-lnote">roughly thirty more. Useful, and each has its own filter vocabulary</span></div>
</div>

<h3>The default that surprises people</h3>
${slide('ga-01', 12, 'pull_request fires on only three activity types by default')}
<pre><code>on:
  pull_request:      <span class="tok-comment"># khong noi 'types' → mac dinh la ba loai</span>
    branches: [main]</code></pre>

<p>Written like that, <code>pull_request</code> fires on <strong>opened</strong>, <strong>synchronize</strong> and <strong>reopened</strong> — and <em>not</em> on the many other things that happen to a PR. Adding a label does not trigger it. Neither does a review, a comment, or converting from draft. If you want those you must say so:</p>

<pre><code>on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review, labeled]</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>synchronize</code> is the one that fires on every new commit, and it is easy to remove by accident.</strong> The moment you write an explicit <code>types:</code> list you have taken responsibility for the whole list. Writing <code>types: [opened]</code> because you wanted to add something gives you a workflow that checks the first commit of a PR and never looks at it again — every subsequent push goes unchecked while the PR still shows a green tick from the first run. This is one of the quietest ways to lose CI coverage.</p>
</div>

<h3>Multiple triggers in one file</h3>
<p>A workflow can have several, and each carries its own filters — which is exactly where <code>ci-lint.yml</code>&#39;s asymmetry came from (0.3):</p>

<pre><code>on:
  pull_request:
    branches: [main]          <span class="tok-comment"># KHONG co paths</span>
  push:
    branches: [main]
    paths: ['src/**', …]      <span class="tok-comment"># CO paths</span>
  workflow_dispatch: {}</code></pre>

<p>Three independent entry points into the same jobs. A README-only commit skips CI when pushed and runs CI when it arrives as a PR. Neither behaviour is wrong; not knowing which you have is.</p>

<div class="callout ok">
<p><strong>Read your trigger block out loud as a sentence.</strong> "This runs when a PR targeting main is opened or updated, <em>or</em> when a commit lands on main that touches source, <em>or</em> when someone presses the button." If the sentence surprises you, the file is not doing what you think. It takes ten seconds and it is the cheapest audit in this course.</p>
</div>

<h3>workflow_dispatch, and its inputs</h3>
${slide('ga-01', 13, 'workflow_dispatch: one button, one form — and the boolean trap')}
<p>An empty <code>{}</code> means no inputs. Declaring them turns a workflow into a form:</p>

<pre><code>on:
  workflow_dispatch:
    inputs:
      moi_truong:
        description: 'Moi truong dich'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]
      bo_qua_test:
        type: boolean
        default: false</code></pre>

<p>Which gives you a dropdown in the UI, and <code>&#36;{{ inputs.moi_truong }}</code> inside the run. This is the mechanism that lets a deploy be deliberate — a human chooses the target and the moment — while still being one button rather than a checklist somebody follows from memory.</p>

<div class="pitfall">
<p><strong>Trap — a boolean input arrives as a <em>string</em> — in <code>github.event.inputs</code>.</strong> (Corrected on 24/09/2026. An earlier version of this box said <code>if: inputs.bo_qua_test</code> is true for both values. Measured, it is not: the <code>inputs</code> context keeps booleans as booleans; only the older <code>github.event.inputs</code> context turns them into the strings <code>'true'</code>/<code>'false'</code>, and a non-empty string is truthy.) A real dispatch with <code>bo_qua_test=false</code> on the sandbox (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987558284" target="_blank" rel="noopener">run 35987558284</a>):</p>
<div class="out">$ gh workflow run ch01-dispatch.yml --ref ch01-workflow -f bo_qua_test=false

inputs.bo_qua_test              = false
github.event.inputs.bo_qua_test = false

if inputs.bo_qua_test                           skipped
if github.event.inputs.bo_qua_test              success   &lt;- chuoi 'false' la DUNG
if github.event.inputs.bo_qua_test == 'true'    skipped</div>
<p>So: write <code>if: inputs.bo_qua_test</code>, and if you meet <code>github.event.inputs.x</code> in an old workflow, compare it as a string (<code>== 'true'</code>). Chapter 3 measures the expression rules that make this happen; the two contexts look identical until the day they are not.</p>
</div>

<h3>What starts nothing</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a workflow file on a branch</span><span class="v">for <code>push</code> and <code>pull_request</code>, GitHub uses the workflow file from the branch being pushed. A new workflow added on a feature branch does run on that branch</span></div>
<div class="kv"><span class="k">but <code>schedule</code> only runs from the default branch</span><span class="v">adding a cron on a feature branch schedules nothing, ever, and there is no warning</span></div>
<div class="kv"><span class="k">and <code>workflow_dispatch</code> needs to be on the default branch first</span><span class="v">before the Run workflow button appears at all. A dispatch-only workflow on a feature branch is invisible in the UI</span></div>
<div class="kv"><span class="k">a push by a workflow</span><span class="v">using <code>GITHUB_TOKEN</code> does <strong>not</strong> trigger another workflow — deliberate, to prevent infinite loops. Chapter 7 covers the consequences</span></div>
</div>

<h3>What each trigger hands the job: which commit, which ref</h3>
<p>The trigger does not only decide <em>when</em>. It also decides <em>which version of the code</em> the job sees and which workflow file is used — and those differ per event:</p>
<table>
<thead><tr><th>Event</th><th><code>GITHUB_SHA</code> (what checkout gets)</th><th><code>GITHUB_REF</code></th><th>Workflow file read from</th></tr></thead>
<tbody>
<tr><td><code>push</code></td><td>the tip commit that was pushed</td><td>the updated branch or tag</td><td>that commit</td></tr>
<tr><td><code>pull_request</code></td><td>a merge commit GitHub creates (Lesson 1.4)</td><td><code>refs/pull/N/merge</code></td><td>that merge commit</td></tr>
<tr><td><code>workflow_dispatch</code></td><td>last commit on the chosen branch/tag</td><td>the branch/tag you picked</td><td>that branch</td></tr>
<tr><td><code>schedule</code></td><td>last commit on the default branch</td><td>the default branch</td><td>the default branch only</td></tr>
<tr><td><code>workflow_run</code></td><td>last commit on the default branch</td><td>the default branch</td><td>the default branch only</td></tr>
</tbody>
</table>
<p>The last two rows are why a <code>schedule</code> or <code>workflow_run</code> workflow on a feature branch does nothing: GitHub never reads it there. (Source: "Events that trigger workflows", GitHub Docs, as of 09/2026.)</p>

<h3>Run it step by step: a dispatch from the terminal</h3>
<p>The Run workflow button is a call to an API, and <code>gh</code> makes the same call. Two real attempts on the sandbox, one after the other:</p>
<div class="out">$ gh workflow run ch01-dispatch.yml --ref ch01-workflow -f bo_qua_test=false
HTTP 404: workflow ch01-dispatch.yml not found on the default branch

$ gh workflow run ch01-giai-phau.yml --ref ch01-workflow
https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987547571</div>
<p>The first file existed only on a feature branch and had never run, so GitHub did not know it: 404, "not found on the default branch". The second file also lives only on the feature branch — but it had already run there on a push, so GitHub knew the workflow and accepted a dispatch against that branch. Rule of thumb that matches both results: <strong>put a dispatch workflow on the default branch first</strong>; then <code>--ref</code> can point at any branch that has the file.</p>
<pre><code class="language-bash">gh workflow list                                   # what GitHub knows about
gh workflow run deploy.yml --ref main -f moi_truong=staging
gh run list -w deploy.yml -L 3                     # the run you just started
gh run watch                                       # follow it</code></pre>

<h3>When to use which trigger — and when not</h3>
<table>
<thead><tr><th>You want…</th><th>Use</th><th>Do NOT use</th></tr></thead>
<tbody>
<tr><td>check every change before it lands</td><td><code>pull_request</code> (+ <code>push</code> to <code>main</code> for the merged result)</td><td><code>push</code> alone — it never sees the merge (Lesson 1.4)</td></tr>
<tr><td>deploy</td><td><code>workflow_dispatch</code> with an <code>environment</code> input, or <code>push</code> to <code>main</code> guarded by <code>concurrency</code> (Chapter 9)</td><td>two workflows on the same <code>push</code> — the 03/07 and 06/07 outages</td></tr>
<tr><td>"roughly weekly" maintenance</td><td><code>schedule</code> + <code>workflow_dispatch</code></td><td><code>schedule</code> for anything that must happen at a clock time (Lesson 1.3)</td></tr>
<tr><td>deploy only after tests passed</td><td><code>needs:</code> in one workflow, or <code>workflow_run</code></td><td>two crons one hour apart</td></tr>
<tr><td>a bot that comments on PRs from forks</td><td><code>pull_request</code> + artifact → <code>workflow_run</code></td><td><code>pull_request_target</code> that checks out the PR (Lesson 1.4)</td></tr>
</tbody>
</table>

<div class="callout warn">
<p><strong>Updated nuance on <code>GITHUB_TOKEN</code> (GitHub Docs, 09/2026).</strong> Events caused by the workflow&#39;s own <code>GITHUB_TOKEN</code> still do not start new runs — <em>except</em> <code>workflow_dispatch</code> and <code>repository_dispatch</code>, which do. And when a workflow opens or updates a pull request with <code>GITHUB_TOKEN</code>, the resulting <code>pull_request</code> runs are now created but <strong>wait for approval</strong> by someone with write access. So "my release bot pushed and CI never ran" and "CI is stuck waiting for approval" have the same root cause.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Your deploy workflow runs on every push to main. What can go wrong and what would you change?</strong><br>A: Anyone who can push can deploy; two pushes in quick succession start two deploys that race (this repository had a 500 and an <code>Exited(137)</code> from exactly that). Options: make it <code>workflow_dispatch</code> with a chosen environment, or keep <code>push</code> but add <code>concurrency:</code> and a protected <code>environment</code> with reviewers.</p>
<p><strong>Q: Which activity types does <code>pull_request</code> run on by default, and why does it matter?</strong><br>A: <code>opened</code>, <code>synchronize</code>, <code>reopened</code>. Writing <code>types:</code> replaces the default list — <code>types: [opened]</code> silently stops checking every later push to the PR.</p>
<p><strong>Q: A workflow_dispatch input is a boolean. How do you test it in <code>if:</code>?</strong><br>A: <code>if: inputs.flag</code> — the <code>inputs</code> context keeps real booleans. <code>github.event.inputs.flag</code> is a string, so <code>'false'</code> is truthy there; compare with <code>== 'true'</code> if you must use it.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are asked "what exactly starts our CI, and could a push deploy by accident?" Answer it with measurements, not guesses.</p><ol>
<li>On your practice repository, write one workflow with three triggers: <code>push</code> to <code>main</code>, <code>pull_request</code> to <code>main</code>, and <code>workflow_dispatch</code> with a <code>boolean</code> input <code>bo_qua_test</code>. Make it print <code>$GITHUB_EVENT_NAME</code>, <code>$GITHUB_REF</code> and <code>$GITHUB_SHA</code>.</li>
<li>Trigger it three ways: a push, a PR from a branch, and <code>gh workflow run ten.yml --ref main -f bo_qua_test=false</code>.</li>
<li>Add three steps with <code>if: inputs.bo_qua_test</code>, <code>if: github.event.inputs.bo_qua_test</code> and <code>if: github.event.inputs.bo_qua_test == 'true'</code>. Dispatch with <code>false</code> and note which steps are skipped.</li>
<li>Inventory the triggers of a real repository you use (your team project, or api-backend) with a script that reads both <code>d[True]</code> and <code>d.get('on')</code>.</li></ol>
<p><strong>Done when:</strong> you have three runs whose logs show <code>push</code>, <code>pull_request</code> (with <code>refs/pull/N/merge</code>) and <code>workflow_dispatch</code>; exactly one of the three <code>if:</code> steps ran with <code>false</code> — the <code>github.event.inputs</code> one; and your inventory prints a trigger list for every file, none empty.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Event / trigger</span><span class="v">Something that happened on GitHub (push, PR, schedule, button) that can start workflows listed under <code>on:</code>.</span></div>
  <div class="kv"><span class="k">Activity type</span><span class="v">The sub-kind of an event, e.g. <code>opened</code>/<code>synchronize</code> for <code>pull_request</code>; chosen with <code>types:</code>.</span></div>
  <div class="kv"><span class="k"><code>workflow_dispatch</code></span><span class="v">Manual trigger — the Run workflow button or <code>gh workflow run</code> — with typed <code>inputs</code>.</span></div>
  <div class="kv"><span class="k"><code>inputs</code> context</span><span class="v">Where dispatch inputs arrive with their real type; <code>github.event.inputs</code> holds the same values as strings.</span></div>
  <div class="kv"><span class="k"><code>workflow_run</code></span><span class="v">Starts a workflow when another one finishes; reads its file from the default branch.</span></div>
  <div class="kv"><span class="k"><code>GITHUB_SHA</code> / <code>GITHUB_REF</code></span><span class="v">The commit and ref a run is about; what they contain depends on the event.</span></div>
  <div class="kv"><span class="k">Default branch</span><span class="v">The repository&#39;s main branch (often <code>main</code>); the only place <code>schedule</code> and <code>workflow_run</code> are read from.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The trigger block is a policy: "runs on push" means "anyone who can push can start it" — including deploys.</li>
<li>In api-backend 12 of 14 workflows are manual-only because two deploys racing on the same push caused two outages.</li>
<li><code>pull_request</code> defaults to <code>opened</code>, <code>synchronize</code>, <code>reopened</code>; a <code>types:</code> list replaces that default entirely.</li>
<li>Each event hands the job a different <code>GITHUB_SHA</code>/<code>GITHUB_REF</code>; <code>schedule</code> and <code>workflow_run</code> only read the default branch.</li>
<li>A dispatch workflow must be known to GitHub (on the default branch, or already run) — otherwise HTTP 404.</li>
<li><code>inputs.x</code> keeps booleans; <code>github.event.inputs.x</code> is a string where <code>'false'</code> is true — measured.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — every event, its default activity types, and which filters it supports. The table is the reference for this whole lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Manually running a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/manually-running-a-workflow — <code>workflow_dispatch</code> inputs, the API endpoint behind the button, and the default-branch requirement.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Triggering a workflow from a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow — the normative statement that <code>GITHUB_TOKEN</code> pushes do not cascade, and what to use when you need them to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — branches, pull requests, and what a push actually is</span><span class="lc-sub">/courses/git/learn${REF} — the vocabulary every trigger in this lesson is built on.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Cái gì KHỞI ĐỘNG một lần chạy</h2>
<p class="lead">Khối kích hoạt là phần nặng ký nhất của một workflow, và dễ viết sai nhất theo kiểu chẳng ai nhận ra suốt nhiều tháng. Đây là bản kiểm kê THẬT của một kho.</p>

<h3>Mười một workflow, đếm ra</h3>
<div class="out">backend-vps.yml          workflow_dispatch
ci-lint.yml              pull_request, push, workflow_dispatch
deploy-ghcr.yml          workflow_dispatch
desktop-release.yml      workflow_dispatch
e2e-message-button.yml   workflow_dispatch
fix-containers.yml       workflow_dispatch
full-deploy.yml          workflow_dispatch
guard-no-duplicates.yml  workflow_dispatch
restart-containers.yml   workflow_dispatch
sync-frontend.yml        workflow_dispatch
vps-cleanup-weekly.yml   schedule, workflow_dispatch</div>

<div class="callout warn">
<p><strong>Chín trên mười một chỉ chạy khi có NGƯỜI bấm nút, thêm một cái chạy theo đồng hồ hằng tuần, và đúng MỘT workflow khởi động khi push.</strong> (Bản trước của câu này ghi "mười trên mười một"; nhưng <code>vps-cleanup-weekly.yml</code> còn có <code>schedule</code>, như chính bảng trên cho thấy.) Nhìn thì tưởng đây là một kho lười tự động hoá, cho tới khi bạn đọc LÝ DO — và lý do đó được ghi lại, có ngày tháng, vì nó đã tốn HAI lần sập.</p>
</div>

<p><strong>Đếm lại ngày 24/09/2026:</strong> thư mục giờ có mười bốn tệp — thêm ba workflow chạy tay — và hình dạng không hề xê dịch. Đếm bằng PyYAML, tra cả khoá <code>True</code> lẫn <code>"on"</code> (bài 1.1 giải thích vì sao một script chỉ hỏi <code>"on"</code> sẽ in ra mười bốn dòng trống):</p>
${slide('ga-01', 9, 'api-backend: 14 workflow, chỉ 1 cái chạy khi push')}
<div class="out">backend-vps.yml            workflow_dispatch
ci-lint.yml                pull_request, push, workflow_dispatch
deploy-ghcr.yml            workflow_dispatch
desktop-release.yml        workflow_dispatch
e2e-message-button.yml     workflow_dispatch
fix-containers.yml         workflow_dispatch
full-deploy.yml            workflow_dispatch
guard-no-duplicates.yml    workflow_dispatch
restart-containers.yml     workflow_dispatch
ship-lab211.yml            workflow_dispatch      &lt;- moi
ssh-port-apply.yml         workflow_dispatch      &lt;- moi
ssh-port-diagnostic.yml    workflow_dispatch      &lt;- moi
sync-frontend.yml          workflow_dispatch
vps-cleanup-weekly.yml     schedule, workflow_dispatch</div>
<h3>Vì sao các lần deploy THÔI tự động</h3>
${slide('ga-01', 10, 'Deploy thôi tự động vì hai workflow từng đua nhau')}
<p>Trích ghi chú của chính kho này: hai workflow deploy từng cùng chạy ở MỌI lần push vào <code>main</code>, và chúng giẫm lên nhau ngay trên production.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">03/07/2026</span><span class="lz-t">bảng tin trả 500</span><span class="lz-d">lược đồ tụt lại sau cái ảnh — hai đường ống về đích SAI THỨ TỰ</span></div>
<div class="lz-step"><span class="lz-k">06/07/2026</span><span class="lz-t">Exited(137) + container mồ côi</span><span class="lz-d">một cuộc đua khi tạo lại backend; cứu bằng tay với <code>docker start</code></span></div>
<div class="lz-step"><span class="lz-k">sau đó</span><span class="lz-t">cả hai chuyển sang workflow_dispatch</span><span class="lz-d">"deploy vẫn là một script BẠN chạy, không bao giờ là tác dụng phụ của việc push"</span></div>
</div>

<p>Chương 10 đem quyết định đó ra đo cho đàng hoàng. Điểm ở đây hẹp hơn và hữu dụng hơn: <strong>bộ kích hoạt là một quyết định CHÍNH SÁCH, không phải một thủ tục.</strong> "Chạy khi push" nghĩa là "AI push được thì khởi động được cái này", và nếu cái nó khởi động đụng tới production, thì đó là cùng một câu với "ai push được thì deploy được".</p>

<h3>Những bộ kích hoạt đáng biết</h3>
${slide('ga-01', 11, 'Sáu bộ kích hoạt gặp trong 90% workflow')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">một commit tới được một nhánh hay một thẻ. Hỗ trợ <code>branches</code>, <code>branches-ignore</code>, <code>tags</code>, <code>paths</code>, <code>paths-ignore</code></span></div>
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">một PR được mở, cập nhật, mở lại hay đổi đích. Chạy trên một <em>COMMIT GỘP</em>, không phải nhánh của bạn — bài 1.4 đo vì sao chuyện đó quan trọng</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch</span><span class="lz-lnote">một người bấm Run workflow, hoặc có thứ gì đó gọi API. Khai báo được <code>inputs</code> có kiểu, và đó là cách một workflow deploy hỏi "môi trường nào?"</span></div>
<div class="lz-layer"><span class="lz-lname">schedule</span><span class="lz-lnote">cron, theo UTC. Bài 1.3 đo xem nó ĐÚNG GIỜ tới đâu, và câu trả lời sẽ đổi cách bạn dùng nó</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_run</span><span class="lz-lnote">một workflow khác vừa xong. Cách nối "kiểm thử" vào "deploy" mà không gộp chúng thành một tệp</span></div>
<div class="lz-layer"><span class="lz-lname">release, issues, issue_comment…</span><span class="lz-lnote">khoảng ba mươi cái nữa. Hữu dụng, và mỗi cái có bộ từ vựng lọc riêng</span></div>
</div>

<h3>Cái mặc định làm người ta bất ngờ</h3>
${slide('ga-01', 12, 'pull_request mặc định chỉ nổ với 3 loại hoạt động')}
<pre><code>on:
  pull_request:      <span class="tok-comment"># khong noi 'types' → mac dinh la ba loai</span>
    branches: [main]</code></pre>

<p>Viết như thế, <code>pull_request</code> nổ khi <strong>opened</strong>, <strong>synchronize</strong> và <strong>reopened</strong> — và <em>KHÔNG</em> nổ với hàng loạt chuyện khác xảy ra với một PR. Gắn nhãn thì không kích hoạt. Cũng không có review, không có bình luận, không có chuyện chuyển từ nháp. Muốn có mấy cái đó thì phải NÓI RA:</p>

<pre><code>on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review, labeled]</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>synchronize</code> là cái nổ ở MỖI commit mới, và nó dễ bị gỡ đi một cách vô tình.</strong> Khoảnh khắc bạn viết một danh sách <code>types:</code> tường minh là bạn đã nhận trách nhiệm cho TOÀN BỘ danh sách. Viết <code>types: [opened]</code> vì bạn muốn THÊM một thứ gì đó sẽ cho bạn một workflow kiểm commit ĐẦU TIÊN của một PR rồi chẳng bao giờ nhìn lại — mọi cú push sau đó không được kiểm trong khi PR vẫn hiện một dấu tích xanh từ lần chạy đầu. Đây là một trong những cách ÂM THẦM NHẤT để mất độ phủ CI.</p>
</div>

<h3>Nhiều bộ kích hoạt trong một tệp</h3>
<p>Một workflow có thể có vài cái, và MỖI CÁI mang bộ lọc riêng — mà đó chính xác là chỗ sự bất đối xứng của <code>ci-lint.yml</code> tới từ (bài 0.3):</p>

<pre><code>on:
  pull_request:
    branches: [main]          <span class="tok-comment"># KHONG co paths</span>
  push:
    branches: [main]
    paths: ['src/**', …]      <span class="tok-comment"># CO paths</span>
  workflow_dispatch: {}</code></pre>

<p>Ba lối vào ĐỘC LẬP dẫn tới cùng những job đó. Một commit chỉ-README bỏ qua CI khi được push và chạy CI khi tới dưới dạng PR. Không hành vi nào là SAI; không BIẾT mình đang có hành vi nào mới là sai.</p>

<div class="callout ok">
<p><strong>Hãy ĐỌC TO khối kích hoạt của bạn thành một câu.</strong> "Cái này chạy khi một PR nhắm vào main được mở hoặc cập nhật, <em>HOẶC</em> khi một commit đáp xuống main mà nó đụng vào mã nguồn, <em>HOẶC</em> khi có người bấm nút." Nếu cái câu đó làm bạn bất ngờ thì tệp đang không làm cái bạn nghĩ. Nó tốn mười giây và là lần soi rẻ nhất trong cả khoá này.</p>
</div>

<h3>workflow_dispatch, và tham số của nó</h3>
${slide('ga-01', 13, 'workflow_dispatch: một nút, một biểu mẫu — và bẫy boolean')}
<p>Một cái <code>{}</code> rỗng nghĩa là không có tham số. Khai báo chúng thì biến một workflow thành một cái BIỂU MẪU:</p>

<pre><code>on:
  workflow_dispatch:
    inputs:
      moi_truong:
        description: 'Moi truong dich'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]
      bo_qua_test:
        type: boolean
        default: false</code></pre>

<p>Cái đó cho bạn một ô thả xuống trên giao diện, và <code>&#36;{{ inputs.moi_truong }}</code> bên trong lúc chạy. Đây là cơ chế cho phép một lần deploy trở nên CÓ CHỦ ĐÍCH — một con người chọn cái đích và chọn thời điểm — mà vẫn là MỘT cái nút chứ không phải một danh sách việc ai đó làm theo trí nhớ.</p>

<div class="pitfall">
<p><strong>Bẫy — một tham số boolean tới nơi dưới dạng một <em>CHUỖI</em> — trong <code>github.event.inputs</code>.</strong> (Sửa ngày 24/09/2026. Bản trước của khung này nói <code>if: inputs.bo_qua_test</code> ĐÚNG với cả hai giá trị. Đo thật thì KHÔNG: ngữ cảnh <code>inputs</code> giữ boolean là boolean; chỉ ngữ cảnh cũ <code>github.event.inputs</code> mới biến chúng thành chuỗi <code>'true'</code>/<code>'false'</code>, và một chuỗi không rỗng thì luôn đúng.) Một lần dispatch thật với <code>bo_qua_test=false</code> trên sân tập (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987558284" target="_blank" rel="noopener">run 35987558284</a>):</p>
<div class="out">$ gh workflow run ch01-dispatch.yml --ref ch01-workflow -f bo_qua_test=false

inputs.bo_qua_test              = false
github.event.inputs.bo_qua_test = false

if inputs.bo_qua_test                           skipped
if github.event.inputs.bo_qua_test              success   &lt;- chuoi 'false' la DUNG
if github.event.inputs.bo_qua_test == 'true'    skipped</div>
<p>Vậy: viết <code>if: inputs.bo_qua_test</code>, và nếu gặp <code>github.event.inputs.x</code> trong một workflow cũ thì so nó như chuỗi (<code>== 'true'</code>). Chương 3 đo các luật biểu thức làm chuyện này xảy ra; hai ngữ cảnh trông y hệt nhau cho tới cái ngày chúng khác nhau.</p>
</div>

<h3>Thứ KHÔNG khởi động gì cả</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một tệp workflow trên một nhánh</span><span class="v">với <code>push</code> và <code>pull_request</code>, GitHub dùng tệp workflow TỪ CHÍNH cái nhánh đang được push. Một workflow mới thêm trên nhánh tính năng thì CÓ chạy trên nhánh đó</span></div>
<div class="kv"><span class="k">nhưng <code>schedule</code> chỉ chạy từ nhánh MẶC ĐỊNH</span><span class="v">thêm một cái cron trên nhánh tính năng thì chẳng lên lịch gì cả, KHÔNG BAO GIỜ, và không có cảnh báo nào</span></div>
<div class="kv"><span class="k">và <code>workflow_dispatch</code> phải có mặt trên nhánh mặc định TRƯỚC ĐÃ</span><span class="v">thì cái nút Run workflow mới hiện ra. Một workflow chỉ-dispatch nằm trên nhánh tính năng thì VÔ HÌNH trên giao diện</span></div>
<div class="kv"><span class="k">một cú push DO workflow thực hiện</span><span class="v">dùng <code>GITHUB_TOKEN</code> thì <strong>KHÔNG</strong> kích hoạt workflow khác — có chủ đích, để ngăn vòng lặp vô hạn. Chương 7 nói về hệ quả</span></div>
</div>

<h3>Mỗi bộ kích hoạt trao cho job cái gì: commit nào, ref nào</h3>
<p>Bộ kích hoạt không chỉ quyết định <em>KHI NÀO</em>. Nó còn quyết định job nhìn thấy <em>PHIÊN BẢN MÃ NÀO</em> và tệp workflow được đọc từ đâu — và mấy thứ đó khác nhau theo từng sự kiện:</p>
<table>
<thead><tr><th>Sự kiện</th><th><code>GITHUB_SHA</code> (checkout lấy gì)</th><th><code>GITHUB_REF</code></th><th>Tệp workflow đọc từ</th></tr></thead>
<tbody>
<tr><td><code>push</code></td><td>commit đầu mút vừa được push</td><td>nhánh hoặc tag vừa cập nhật</td><td>chính commit đó</td></tr>
<tr><td><code>pull_request</code></td><td>một merge commit do GitHub tạo (bài 1.4)</td><td><code>refs/pull/N/merge</code></td><td>merge commit đó</td></tr>
<tr><td><code>workflow_dispatch</code></td><td>commit cuối của nhánh/tag bạn chọn</td><td>nhánh/tag bạn chọn</td><td>nhánh đó</td></tr>
<tr><td><code>schedule</code></td><td>commit cuối của nhánh mặc định</td><td>nhánh mặc định</td><td>CHỈ nhánh mặc định</td></tr>
<tr><td><code>workflow_run</code></td><td>commit cuối của nhánh mặc định</td><td>nhánh mặc định</td><td>CHỈ nhánh mặc định</td></tr>
</tbody>
</table>
<p>Hai dòng cuối là lý do một workflow <code>schedule</code> hay <code>workflow_run</code> nằm trên nhánh tính năng chẳng làm gì: GitHub không bao giờ đọc nó ở đó. (Nguồn: "Events that trigger workflows", GitHub Docs, tính đến 09/2026.)</p>

<h3>Chạy thử từng bước: dispatch từ terminal</h3>
<p>Cái nút Run workflow là một lời gọi API, và <code>gh</code> gọi đúng lời gọi ấy. Hai lần thử thật trên sân tập, nối tiếp nhau:</p>
<div class="out">$ gh workflow run ch01-dispatch.yml --ref ch01-workflow -f bo_qua_test=false
HTTP 404: workflow ch01-dispatch.yml not found on the default branch

$ gh workflow run ch01-giai-phau.yml --ref ch01-workflow
https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987547571</div>
<p>Tệp đầu chỉ có trên một nhánh tính năng và CHƯA TỪNG chạy, nên GitHub không biết nó: 404, "not found on the default branch". Tệp thứ hai cũng chỉ nằm trên nhánh tính năng — nhưng nó ĐÃ chạy ở đó khi có push, nên GitHub biết workflow này và nhận lời dispatch nhắm vào nhánh đó. Quy tắc khớp với cả hai kết quả: <strong>đặt workflow dispatch lên nhánh mặc định TRƯỚC</strong>; sau đó <code>--ref</code> trỏ được tới bất kỳ nhánh nào có tệp ấy.</p>
<pre><code class="language-bash">gh workflow list                                   # GitHub dang biet nhung workflow nao
gh workflow run deploy.yml --ref main -f moi_truong=staging
gh run list -w deploy.yml -L 3                     # lan chay vua khoi dong
gh run watch                                       # theo doi no</code></pre>

<h3>Khi nào dùng bộ kích hoạt nào — và khi nào KHÔNG</h3>
<table>
<thead><tr><th>Bạn muốn…</th><th>Dùng</th><th>ĐỪNG dùng</th></tr></thead>
<tbody>
<tr><td>kiểm mọi thay đổi trước khi nó vào</td><td><code>pull_request</code> (+ <code>push</code> vào <code>main</code> để kiểm bản đã gộp)</td><td>chỉ <code>push</code> — nó không bao giờ thấy bản gộp (bài 1.4)</td></tr>
<tr><td>deploy</td><td><code>workflow_dispatch</code> có input chọn môi trường, hoặc <code>push</code> vào <code>main</code> có <code>concurrency</code> canh (Chương 9)</td><td>hai workflow cùng nghe một <code>push</code> — hai sự cố 03/07 và 06/07</td></tr>
<tr><td>bảo trì "đại khái hằng tuần"</td><td><code>schedule</code> + <code>workflow_dispatch</code></td><td><code>schedule</code> cho việc phải xảy ra ĐÚNG giờ (bài 1.3)</td></tr>
<tr><td>deploy chỉ sau khi test qua</td><td><code>needs:</code> trong một workflow, hoặc <code>workflow_run</code></td><td>hai cron cách nhau một tiếng</td></tr>
<tr><td>một bot bình luận vào PR từ fork</td><td><code>pull_request</code> + artifact → <code>workflow_run</code></td><td><code>pull_request_target</code> checkout mã PR (bài 1.4)</td></tr>
</tbody>
</table>

<div class="callout warn">
<p><strong>Sắc thái mới về <code>GITHUB_TOKEN</code> (GitHub Docs, 09/2026).</strong> Sự kiện do chính <code>GITHUB_TOKEN</code> của workflow gây ra vẫn KHÔNG khởi động run mới — <em>trừ</em> <code>workflow_dispatch</code> và <code>repository_dispatch</code>, hai cái này thì có. Và khi một workflow mở hoặc cập nhật PR bằng <code>GITHUB_TOKEN</code>, các run <code>pull_request</code> sinh ra giờ ĐƯỢC tạo nhưng <strong>chờ duyệt</strong> bởi một người có quyền ghi. Nên "bot phát hành của tôi push mà CI không chạy" và "CI kẹt chờ duyệt" có chung một gốc rễ.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Workflow deploy của bạn chạy ở mọi cú push vào main. Có thể hỏng ở đâu, và bạn đổi gì?</strong><br>Đ: Ai push được là deploy được; hai cú push liền nhau khởi động hai lần deploy đua nhau (kho này từng dính một lỗi 500 và một <code>Exited(137)</code> vì đúng chuyện đó). Cách sửa: chuyển sang <code>workflow_dispatch</code> có chọn môi trường, hoặc giữ <code>push</code> nhưng thêm <code>concurrency:</code> và một <code>environment</code> được bảo vệ, có người duyệt.</p>
<p><strong>H: <code>pull_request</code> mặc định chạy với những loại hoạt động nào, và vì sao điều đó quan trọng?</strong><br>Đ: <code>opened</code>, <code>synchronize</code>, <code>reopened</code>. Viết <code>types:</code> là THAY THẾ danh sách mặc định — <code>types: [opened]</code> âm thầm thôi kiểm mọi cú push sau đó lên PR.</p>
<p><strong>H: Một input của workflow_dispatch kiểu boolean. Bạn kiểm nó trong <code>if:</code> thế nào?</strong><br>Đ: <code>if: inputs.flag</code> — ngữ cảnh <code>inputs</code> giữ boolean thật. <code>github.event.inputs.flag</code> là chuỗi, nên ở đó <code>'false'</code> vẫn đúng; nếu buộc phải dùng thì so <code>== 'true'</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn bị hỏi "chính xác thì cái gì khởi động CI của mình, và một cú push có thể vô tình deploy không?" Trả lời bằng số đo, không bằng đoán.</p><ol>
<li>Trên kho thực hành, viết một workflow có ba bộ kích hoạt: <code>push</code> vào <code>main</code>, <code>pull_request</code> vào <code>main</code>, và <code>workflow_dispatch</code> có input <code>boolean</code> tên <code>bo_qua_test</code>. Cho nó in <code>$GITHUB_EVENT_NAME</code>, <code>$GITHUB_REF</code> và <code>$GITHUB_SHA</code>.</li>
<li>Kích hoạt nó ba cách: một cú push, một PR từ nhánh khác, và <code>gh workflow run ten.yml --ref main -f bo_qua_test=false</code>.</li>
<li>Thêm ba bước với <code>if: inputs.bo_qua_test</code>, <code>if: github.event.inputs.bo_qua_test</code> và <code>if: github.event.inputs.bo_qua_test == 'true'</code>. Dispatch với <code>false</code> và ghi lại bước nào bị bỏ qua.</li>
<li>Kiểm kê bộ kích hoạt của một kho thật bạn đang dùng (đồ án nhóm, hoặc api-backend) bằng một script đọc cả <code>d[True]</code> lẫn <code>d.get('on')</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có ba run mà log hiện <code>push</code>, <code>pull_request</code> (kèm <code>refs/pull/N/merge</code>) và <code>workflow_dispatch</code>; đúng MỘT trong ba bước <code>if:</code> chạy khi giá trị là <code>false</code> — bước dùng <code>github.event.inputs</code>; và bản kiểm kê in ra danh sách bộ kích hoạt cho mọi tệp, không tệp nào rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Event / trigger (sự kiện / bộ kích hoạt)</span><span class="v">Điều xảy ra trên GitHub (push, PR, lịch, bấm nút) có thể khởi động các workflow liệt kê trong <code>on:</code>.</span></div>
  <div class="kv"><span class="k">Activity type (loại hoạt động)</span><span class="v">Kiểu con của một sự kiện, vd <code>opened</code>/<code>synchronize</code> của <code>pull_request</code>; chọn bằng <code>types:</code>.</span></div>
  <div class="kv"><span class="k"><code>workflow_dispatch</code> (chạy tay)</span><span class="v">Bộ kích hoạt thủ công — nút Run workflow hoặc <code>gh workflow run</code> — có <code>inputs</code> định kiểu.</span></div>
  <div class="kv"><span class="k">Ngữ cảnh <code>inputs</code></span><span class="v">Nơi input của dispatch tới nơi với ĐÚNG kiểu; <code>github.event.inputs</code> giữ cùng giá trị nhưng dạng chuỗi.</span></div>
  <div class="kv"><span class="k"><code>workflow_run</code> (nối workflow)</span><span class="v">Khởi động một workflow khi workflow khác xong; đọc tệp từ nhánh mặc định.</span></div>
  <div class="kv"><span class="k"><code>GITHUB_SHA</code> / <code>GITHUB_REF</code></span><span class="v">Commit và ref mà lần chạy nói về; chứa gì thì tuỳ sự kiện.</span></div>
  <div class="kv"><span class="k">Default branch (nhánh mặc định)</span><span class="v">Nhánh chính của kho (thường là <code>main</code>); nơi DUY NHẤT <code>schedule</code> và <code>workflow_run</code> được đọc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khối kích hoạt là một CHÍNH SÁCH: "chạy khi push" nghĩa là "ai push được thì khởi động được" — kể cả deploy.</li>
<li>Ở api-backend 12 trên 14 workflow chỉ chạy tay, vì hai workflow deploy đua nhau trên cùng một push đã gây hai sự cố.</li>
<li><code>pull_request</code> mặc định là <code>opened</code>, <code>synchronize</code>, <code>reopened</code>; một danh sách <code>types:</code> THAY THẾ hoàn toàn mặc định ấy.</li>
<li>Mỗi sự kiện trao cho job một <code>GITHUB_SHA</code>/<code>GITHUB_REF</code> khác nhau; <code>schedule</code> và <code>workflow_run</code> chỉ đọc nhánh mặc định.</li>
<li>Một workflow dispatch phải được GitHub biết tới (có trên nhánh mặc định, hoặc đã từng chạy) — không thì HTTP 404.</li>
<li><code>inputs.x</code> giữ boolean; <code>github.event.inputs.x</code> là chuỗi, nơi <code>'false'</code> vẫn đúng — đã đo.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — mọi sự kiện, các loại hoạt động mặc định của nó, và nó hỗ trợ bộ lọc nào. Cái bảng đó là tài liệu tham chiếu cho cả bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Manually running a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/manually-running-a-workflow — tham số của <code>workflow_dispatch</code>, endpoint API nằm sau cái nút, và yêu cầu về nhánh mặc định.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Triggering a workflow from a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow — phát biểu chuẩn tắc rằng các cú push bằng <code>GITHUB_TOKEN</code> KHÔNG lan truyền, và dùng gì khi bạn CẦN chúng lan truyền.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — nhánh, pull request, và một cú push thật ra là gì</span><span class="lc-sub">/courses/git/learn${REF} — bộ từ vựng mà mọi bộ kích hoạt trong bài này dựng lên trên đó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — schedule, and how late it actually is|||1.3 — schedule, và nó THẬT SỰ trễ tới đâu',
      slug: 'ga-1-3-lich-cron',
      type: 'VIDEO',
      description: 'Mười lần chạy theo lịch của kho này, cron đặt 03:00 UTC Chủ nhật. KHÔNG lần nào đúng giờ. Trễ ít nhất 41 phút, nhiều nhất 4 tiếng rưỡi, trung bình 2,6 tiếng — và có một xu hướng trong đó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2><code>schedule</code>, and how late it actually is</h2>
<p class="lead">The documentation says scheduled workflows "may be delayed during periods of high load". This lesson measures ten real runs of one cron over two months, and the answer is stronger than that sentence suggests.</p>

<h3>The workflow, and what it asks for</h3>
<pre><code>on:
  schedule:
    <span class="tok-comment"># Chay luc 3h sang UTC moi Chu nhat (= 10h sang VN)</span>
    - cron: '0 3 * * 0'</code></pre>

<p>Sunday, 03:00 UTC. Ten runs, from June to August, read back through the API:</p>

<div class="out">  lan | ngay       | gio THAT (UTC) | TRE
  ----+------------+----------------+--------
   12 | 2026-08-23 | 03:42:42       | +0h42m
    9 | 2026-08-16 | 03:40:56       | +0h40m
    8 | 2026-08-09 | 04:11:47       | +1h11m
    7 | 2026-08-02 | 05:48:11       | +2h48m
    6 | 2026-07-26 | 05:52:32       | +2h52m
    5 | 2026-07-19 | 05:43:19       | +2h43m
    4 | 2026-07-12 | 05:48:52       | +2h48m
    3 | 2026-07-05 | 06:33:20       | +3h33m
    2 | 2026-06-28 | 06:57:00       | +3h57m
    1 | 2026-06-21 | 07:28:18       | +4h28m

  n = 10 lan chay theo lich
  dung gio (tre < 1 phut): 0
  TRE it nhat   : 41 phut
  TRE nhieu nhat: 268 phut = 4,5 gio
  TRUNG BINH    : 155 phut = 2,6 gio
  TRUNG VI      : 169 phut</div>

<div class="callout warn">
<p><strong>Zero out of ten started on time.</strong> Not "usually on time with occasional delays" — <em>none</em> of them. The best was 41 minutes late and the worst was four and a half hours. If this cron had been "take a backup at 03:00 and alert if it has not finished by 04:00", it would have paged somebody on eight of ten Sundays for a reason that had nothing to do with the backup.</p>
</div>


${slide('ga-01', 14, 'Cron 03:00 UTC on Sundays: 14 runs, none on time')}
<p><strong>Update, 24 September 2026.</strong> The table above was measured at the end of August. Four more Sundays have run since, read back the same way (<code>gh api "repos/…/actions/workflows/vps-cleanup-weekly.yml/runs?event=schedule"</code>):</p>
<div class="out">  lan | ngay       | gio THAT (UTC) | TRE
  ----+------------+----------------+--------
   18 | 2026-09-20 | 08:08:41       | +5h08m
   17 | 2026-09-13 | 07:51:24       | +4h51m
   16 | 2026-09-06 | 07:27:40       | +4h27m
   13 | 2026-08-30 | 08:46:07       | +5h46m
   12 | 2026-08-23 | 03:42:42       | +0h42m   &lt;- bang cu dung o day
  ...
  n = 14 lan chay theo lich (so lan 10, 11, 14, 15 la bam tay)
  dung gio (tre &lt; 1 phut): 0
  TRE it nhat   : 41 phut
  TRE nhieu nhat: 346 phut = 5,8 gio
  TRUNG BINH    : 197 phut = 3,3 gio
  4 lan moi nhat: trung binh 303 phut = 5,1 gio</div>
<p>Still zero on time — and the next section&#39;s "trend" did not last. Keep reading with that in mind.</p>
<h3>There is a trend, and it is worth reading</h3>
<p>Look at the delays in date order rather than in the table&#39;s order: <strong>4h28m, 3h57m, 3h33m, 2h48m, 2h43m, 2h52m, 2h48m, 1h11m, 0h40m, 0h42m</strong>. June was consistently worse than August, and the improvement is monotone apart from noise in the middle.</p>

<p>That is a measurement of GitHub&#39;s queue, not of this repository — nothing about the workflow changed across those ten weeks. It also means the number you would have measured in June (about four hours) and the number you would measure today (about forty minutes) differ by a factor of six. <strong>Any specific delay figure has a shelf life.</strong> What does not expire is the shape: scheduled runs start late, by an amount you do not control and cannot predict.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what cron means elsewhere</span><span class="lz-t">at 03:00</span><span class="lz-d">a Linux crontab fires within a second of the minute, every time</span></div>
<div class="lz-step"><span class="lz-k">what it means here</span><span class="lz-t">not before 03:00</span><span class="lz-d">a request to enter a queue, serviced when there is capacity</span></div>
</div>


<div class="callout warn">
<p><strong>Update: the trend reversed.</strong> After two good Sundays in August (0h40m, 0h42m), the next four were 5h46m, 4h27m, 4h51m and 5h08m — the worst run of the whole series. That is the strongest possible illustration of the paragraph below: a delay measured in one month tells you nothing about the next. Nothing in this repository changed; GitHub&#39;s queue did.</p>
</div>
<h3>Measured again on the sandbox: "every five minutes"</h3>
${slide('ga-01', 15, 'A */5 cron on the sandbox, measured')}
<p>A weekly cron gives one sample a week. To see the queue directly, the sandbox got a workflow that asks for <code>'*/5 * * * *'</code> — the shortest interval GitHub allows — on the default branch, plus a second schedule with a <code>timezone:</code>. It was pushed on 24/09/2026 at 10:15:48 UTC and switched off with <code>gh workflow disable</code> once the measurement was done:</p>
<pre><code class="language-yaml">on:
  schedule:
    - cron: '*/5 * * * *'           # UTC, every 5 minutes
    - cron: '50 17 * * *'           # 17:50 ... in which timezone?
      timezone: 'Asia/Ho_Chi_Minh'  # = 10:50 UTC
  workflow_dispatch:</code></pre>
<div class="out">10:15:48  push ch01-cron.yml len main          cron '*/5 * * * *' (UTC)
10:25:03  them muc '50 17 * * *' + timezone     = 10:50 UTC
10:20 ... 11:45  18 moc */5 di qua             0 lan chay theo lich
10:50     moc timezone di qua                   0 lan chay
11:08:25  gh workflow run ch01-cron.yml        run 35991278091 (workflow_dispatch) chay ngay
11:46     gh workflow disable ch01-cron.yml    state: disabled_manually

$ gh run list -w "ch01 cron moi 5 phut" --json event,createdAt
workflow_dispatch   2026-09-24T11:08:25Z        &lt;- lan chay DUY NHAT
githubstatus.com: Actions = operational</div>
<p><strong>Ninety minutes, eighteen five-minute slots, one timezone slot: zero scheduled runs.</strong> The file was valid — a manual dispatch at 11:08 (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35991278091" target="_blank" rel="noopener">run 35991278091</a>) ran immediately, and GitHub&#39;s status page showed Actions as operational throughout. The schedule simply had not produced a single run by the time the measurement was stopped and the workflow disabled.</p>
<p>This is the other face of the documentation&#39;s "may be delayed… some queued jobs may be dropped": a <em>brand-new</em> schedule can take a long time before its first run, and nothing tells you. We cannot say whether the first run would have come after two hours or five — we stopped at ninety minutes rather than leave a five-minute cron running on a shared sandbox. The practical rule is the valuable part: <strong>after adding or changing a schedule, check that its first run actually happened</strong> (<code>gh run list -w &lt;name&gt; --json event</code>) before you rely on it, and keep <code>workflow_dispatch</code> so you can run it yourself meanwhile.</p>
<h3>The timezone, which is the other half</h3>
${slide('ga-01', 16, 'Cron is UTC; for Vietnam time subtract 7, or name a timezone')}

<p>GitHub runs cron in <strong>UTC</strong>. Not the repository owner&#39;s timezone, not the runner&#39;s, and with no daylight-saving adjustment:</p>

<div class="out">'0 0 * * *' = 00:00 UTC = 07:00 gio Viet Nam
'0 3 * * *' = 03:00 UTC = 10:00 gio Viet Nam
'0 17 * * *' = 17:00 UTC = 00:00 gio Viet Nam (hom sau)

→ muon chay 03:00 GIO VIET NAM thi phai viet '0 20 * * *'
  (20:00 UTC HOM TRUOC)</div>

<p>This repository&#39;s workflow gets it right and, more importantly, <em>writes the conversion in a comment</em> — <code># Chạy lúc 3h sáng UTC mỗi Chủ nhật (= 10h sáng VN)</code>. A cron expression is five numbers with no units and no timezone; the comment is the only place the intent can live.</p>

<div class="pitfall">
<p><strong>Trap — for a country that observes daylight saving, one cron cannot mean one local time all year.</strong> UTC does not shift; local time does. A job scheduled for 09:00 local runs at 09:00 for half the year and 08:00 or 10:00 for the other half, and switches on a date nobody wrote down. Vietnam does not observe DST so this repository is unaffected — but if your team is in Europe or North America, the "why did the report arrive an hour early in March" question has this answer.</p>
</div>


<div class="callout ok">
<p><strong>Correction, 24/09/2026 — there is now a <code>timezone:</code> key.</strong> The two paragraphs above describe the default, and the default is still UTC. But GitHub&#39;s documentation (as of 09/2026) now lets each schedule entry carry an IANA timezone name, and says that in zones with daylight saving a time skipped by the spring-forward change "advances to the next valid time" (a 2:30 AM schedule runs at 3:00 AM). So for a team in Europe the DST trap above is now avoidable: <code>timezone: "Europe/Berlin"</code> keeps a 09:00 job at 09:00 local all year. (The sandbox entry with <code>timezone: 'Asia/Ho_Chi_Minh'</code> passed actionlint and was accepted by GitHub, but — like every other slot in that window — its 10:50 UTC slot produced no run, so the timezone behaviour is documented here, not yet observed.)</p>
</div>
<h3>What this measurement should change</h3>
${slide('ga-01', 17, 'schedule answers "roughly weekly", not "at 03:00"')}

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">do not schedule anything time-critical</span><span class="lz-lnote">"publish at 09:00" is not something <code>schedule</code> can promise. Publish from a workflow the moment the thing is ready instead</span></div>
<div class="lz-layer"><span class="lz-lname">do not alert on "did not finish by X"</span><span class="lz-lnote">measured: that alarm would have fired on 8 of 10 Sundays. Alert on "has not run in more than 8 days" instead — a dead-man&#39;s switch, which is the shape Chapter 9 argues for</span></div>
<div class="lz-layer"><span class="lz-lname">do not chain two crons</span><span class="lz-lnote">"A at 03:00, B at 04:00, B needs A" is a coin flip. Make B depend on A finishing, with <code>workflow_run</code></span></div>
<div class="lz-layer"><span class="lz-lname">do keep <code>workflow_dispatch</code> alongside</span><span class="lz-lnote">this repository does. When the schedule is four hours late and you need it now, the button is the answer</span></div>
<div class="lz-layer"><span class="lz-lname">do make the job idempotent</span><span class="lz-lnote">a cleanup that runs at 03:42 instead of 03:00 should not care. If it does care, the delay is not your real problem</span></div>
</div>

<h3>The other way schedules die: silently</h3>
${slide('ga-01', 18, 'A cron on a feature branch: never runs, never errors')}
<p>Measured, not just quoted. The sandbox branch <code>ch01-workflow</code> carries <code>ch01-cron-nhanh.yml</code> with <code>cron: '*/5 * * * *'</code> and nothing else. GitHub does not even know the workflow exists:</p>
<div class="out">$ gh run list -w "ch01 cron tren nhanh"
could not find any workflows named ch01 cron tren nhanh
$ gh api repos/cuonghoang1103/ga-san-tap/actions/workflows --jq '.workflows[].name' | grep -c "cron tren nhanh"
0</div>
<p>Zero runs, no error, no entry in the workflow list. (Zero runs alone would prove little — the main-branch cron above also had none in ninety minutes. The difference is the list: GitHub registered the main-branch file as a workflow with state <code>active</code>; the branch-only file does not exist for it at all.) The documentation&#39;s own wording is worth remembering: the event "will only trigger a workflow run if the workflow file exists on the default branch", and under high load "some queued jobs may be dropped" — so a schedule can also lose a run outright, not just start it late.</p>

<p>Two rules that produce no error message:</p>

<div class="kv-grid">
<div class="kv"><span class="k">only the default branch</span><span class="v">a <code>schedule:</code> on a feature branch schedules nothing. No warning, no run, no way to tell from the Actions tab</span></div>
<div class="kv"><span class="k">disabled after 60 days of inactivity</span><span class="v">GitHub turns off scheduled workflows in public repositories with no commits for 60 days, and emails the owner. A quiet repository stops running its own maintenance</span></div>
<div class="kv"><span class="k">the shortest interval is 5 minutes</span><span class="v">and given the measured delays, treating <code>*/5</code> as "every five minutes" is optimistic</span></div>
<div class="kv"><span class="k">no run means no record</span><span class="v">the Actions tab shows runs that happened. It cannot show you a run that was never queued, which is why the dead-man&#39;s switch matters</span></div>
</div>

<div class="callout ok">
<p><strong>The rule this lesson buys.</strong> <code>schedule</code> answers "roughly daily" or "roughly weekly", and it answers that well — this cleanup job has run every Sunday for two months without anybody touching it. It does not answer "at 03:00". If your requirement contains a clock time that matters, <code>schedule</code> is the wrong mechanism and no amount of tuning the cron expression will change that.</p>
</div>

<h3>Reading a cron expression, field by field</h3>
<table>
<thead><tr><th>Field</th><th>Range</th><th><code>'0 3 * * 0'</code></th><th><code>'*/15 9-17 * * 1-5'</code></th></tr></thead>
<tbody>
<tr><td>minute</td><td>0–59</td><td>0</td><td>every 15th: 0, 15, 30, 45</td></tr>
<tr><td>hour</td><td>0–23</td><td>3 (UTC!)</td><td>9 through 17</td></tr>
<tr><td>day of month</td><td>1–31</td><td>any</td><td>any</td></tr>
<tr><td>month</td><td>1–12 or JAN–DEC</td><td>any</td><td>any</td></tr>
<tr><td>day of week</td><td>0–6 or SUN–SAT (0 = Sunday)</td><td>0 = Sunday</td><td>Monday–Friday</td></tr>
</tbody>
</table>
<p>Two habits prevent most cron mistakes: always quote the expression (a bare <code>*</code> at the start of a YAML value is an alias marker, so an unquoted <code>*/5 * * * *</code> is a parse error), and write the local-time translation in a comment on the same line — like api-backend does. The documentation also advises avoiding minute 0, because "the start of every hour" is when the queue is fullest: <code>'17 3 * * 0'</code> is a kinder request than <code>'0 3 * * 0'</code>.</p>

<h3>Run it step by step: measure your own schedule&#39;s delay</h3>
<pre><code class="language-bash"># every scheduled run of one workflow, with the time it was created
gh api "repos/OWNER/REPO/actions/workflows/cleanup.yml/runs?event=schedule&amp;per_page=50" \\
  --jq '.workflow_runs[] | [.run_number, .created_at] | @tsv'

# which schedule entry fired (a workflow can have several)
echo "lich: &#36;{{ github.event.schedule }}"     # inside a run: step

# stop a schedule without deleting the file
gh workflow disable cleanup.yml
gh workflow enable cleanup.yml</code></pre>
<p>Subtract the scheduled minute from <code>created_at</code> and you have the delay; do it for a few weeks before you believe any number, including the ones in this lesson.</p>

<h3>The alarm this lesson recommends, written out</h3>
<p>"Alert when it has not run for 8 days" sounds abstract until you see how little it takes. A second, tiny workflow (or any monitor you already have) asks the API when the cleanup last succeeded:</p>
<pre><code class="language-yaml">name: canh-gac don dia
on:
  schedule:
    - cron: '23 */6 * * *'        # every ~6 hours, off the top of the hour
  workflow_dispatch:
jobs:
  kiem:
    runs-on: ubuntu-latest
    permissions:
      actions: read
    steps:
      - env:
          GH_TOKEN: &#36;{{ github.token }}
        run: |
          last=$(gh api "repos/&#36;{{ github.repository }}/actions/workflows/vps-cleanup-weekly.yml/runs?status=success&amp;per_page=1" --jq '.workflow_runs[0].created_at')
          age=$(( ( $(date +%s) - $(date -d "$last" +%s) ) / 86400 ))
          echo "lan chay thanh cong cuoi: $last ($age ngay truoc)"
          test "$age" -le 8</code></pre>
<p>It fails — and notifies whoever watches the Actions tab — only when the cleanup has been missing for more than eight days, whatever the queue delay was. That is the shape that survives a five-hour-late Sunday. (It is itself a schedule, so it too can be late; that is fine, because it is checking for days, not minutes.)</p>
<p>Tested for real before it went into this lesson: the same job on the sandbox, pointed at <code>ch01-giai-phau.yml</code> instead (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35988744631" target="_blank" rel="noopener">run 35988744631</a>), printed <code>lan chay thanh cong cuoi: 2026-09-24T10:29:45Z (0 ngay truoc)</code> and passed. Note the <code>permissions: actions: read</code> — the job token needs it to list runs.</p>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: You scheduled a job for 09:00 and it ran at 11:40. Is something broken?</strong><br>A: No. GitHub cron is a request to enqueue at or after that time, in UTC by default; delays of hours are normal under load and runs can even be dropped. For clock-time requirements use an external scheduler that calls <code>workflow_dispatch</code>, or trigger on the event that makes the work ready.</p>
<p><strong>Q: Why doesn&#39;t my scheduled workflow run at all?</strong><br>A: The file must be on the default branch; public repositories disable schedules after 60 days without activity; the workflow may be disabled; and the expression may be in UTC when you meant local time. Check <code>gh workflow list</code> for the state.</p>
<p><strong>Q: How would you monitor a nightly job?</strong><br>A: Alert on absence — "no successful run in N hours" — not on "not finished by time X", because the start time itself is not guaranteed.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team wants "a backup check every morning at 07:00 Vietnam time". Measure what GitHub actually delivers before promising it.</p><ol>
<li>On the DEFAULT branch of your practice repository, add a workflow with <code>cron: '*/5 * * * *'</code> and <code>workflow_dispatch</code>; make the step print <code>date -u</code> and <code>&#36;{{ github.event.schedule }}</code>.</li>
<li>Put the same file (another name) only on a feature branch. Push both.</li>
<li>After 30–60 minutes, list the runs with <code>gh run list -w &lt;name&gt; --json createdAt,event</code> and compute the delay of each run against its 5-minute slot.</li>
<li>Write the cron line for "07:00 Vietnam time every day" twice: once in UTC, once with <code>timezone:</code>.</li>
<li>Switch the schedule off with <code>gh workflow disable</code> and confirm it shows as disabled in <code>gh workflow list</code>.</li></ol>
<p><strong>Done when:</strong> you have a table of at least three scheduled runs with their delays; the feature-branch copy has zero runs; your two cron lines are <code>'0 0 * * *'</code> and <code>'0 7 * * *'</code> + <code>timezone: 'Asia/Ho_Chi_Minh'</code>; and the workflow is disabled.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>schedule</code> / cron</span><span class="v">Time-based trigger; five fields: minute, hour, day of month, month, day of week.</span></div>
  <div class="kv"><span class="k">UTC</span><span class="v">Coordinated Universal Time, the default timezone for GitHub cron. Vietnam = UTC+7, no daylight saving.</span></div>
  <div class="kv"><span class="k"><code>timezone:</code></span><span class="v">Optional IANA zone name on a schedule entry, e.g. <code>Asia/Ho_Chi_Minh</code> (GitHub Docs, 09/2026).</span></div>
  <div class="kv"><span class="k">Queue delay</span><span class="v">Time between the scheduled minute and the run actually being created; measured here from 40 minutes to almost 6 hours.</span></div>
  <div class="kv"><span class="k">Dead-man&#39;s switch</span><span class="v">An alarm that fires when an expected signal stops arriving, instead of when something is slow.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Safe to run again or at another time with the same result.</span></div>
  <div class="kv"><span class="k"><code>gh workflow disable</code></span><span class="v">Turns a workflow off (schedules stop) without deleting the file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>GitHub cron means "not before", not "at": 14 real Sunday runs, 0 on time, 41 minutes to 5.8 hours late.</li>
<li>Delays drift with GitHub&#39;s load — August looked fine, September was the worst yet. Never design around a measured delay.</li>
<li>Default timezone is UTC (Vietnam = UTC+7); a <code>timezone:</code> key now exists per schedule entry.</li>
<li>Schedules only run from the default branch; a cron on a feature branch never runs and GitHub does not even list it.</li>
<li>Use schedule for "roughly daily/weekly", always with <code>workflow_dispatch</code>, idempotent jobs, and absence-based alerts.</li>
<li>Avoid minute 0, quote the expression, write the local time in a comment, and disable crons you no longer need.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: schedule</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule — the UTC statement, the five-minute minimum, the default-branch rule, and the 60-day disable. The delay warning is one sentence; this lesson is what it looks like measured.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab(5)</span><span class="lc-sub">man 5 crontab — the five fields, the ranges, and the step syntax <code>*/n</code>. GitHub accepts POSIX cron syntax but not the <code>@yearly</code>-style shortcuts.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab.guru</span><span class="lc-sub">crontab.guru — reads an expression back in English. Worth pasting into before committing, because <code>'0 3 * * 0'</code> and <code>'0 3 0 * *'</code> look similar and mean very different things.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — alerting on absence, not on threshold</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the dead-man&#39;s-switch pattern this lesson recommends, measured against a threshold alarm on the same data.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2><code>schedule</code>, và nó THẬT SỰ trễ tới đâu</h2>
<p class="lead">Tài liệu nói các workflow theo lịch "có thể bị trễ trong những lúc tải cao". Bài này đo MƯỜI lần chạy thật của một cái cron suốt hai tháng, và câu trả lời mạnh hơn cái câu đó gợi ý.</p>

<h3>Workflow, và nó yêu cầu gì</h3>
<pre><code>on:
  schedule:
    <span class="tok-comment"># Chay luc 3h sang UTC moi Chu nhat (= 10h sang VN)</span>
    - cron: '0 3 * * 0'</code></pre>

<p>Chủ nhật, 03:00 UTC. Mười lần chạy, từ tháng 6 tới tháng 8, đọc ngược về qua API:</p>

<div class="out">  lan | ngay       | gio THAT (UTC) | TRE
  ----+------------+----------------+--------
   12 | 2026-08-23 | 03:42:42       | +0h42m
    9 | 2026-08-16 | 03:40:56       | +0h40m
    8 | 2026-08-09 | 04:11:47       | +1h11m
    7 | 2026-08-02 | 05:48:11       | +2h48m
    6 | 2026-07-26 | 05:52:32       | +2h52m
    5 | 2026-07-19 | 05:43:19       | +2h43m
    4 | 2026-07-12 | 05:48:52       | +2h48m
    3 | 2026-07-05 | 06:33:20       | +3h33m
    2 | 2026-06-28 | 06:57:00       | +3h57m
    1 | 2026-06-21 | 07:28:18       | +4h28m

  n = 10 lan chay theo lich
  dung gio (tre < 1 phut): 0
  TRE it nhat   : 41 phut
  TRE nhieu nhat: 268 phut = 4,5 gio
  TRUNG BINH    : 155 phut = 2,6 gio
  TRUNG VI      : 169 phut</div>

<div class="callout warn">
<p><strong>KHÔNG trên mười lần bắt đầu đúng giờ.</strong> Không phải "thường đúng giờ, thỉnh thoảng trễ" — <em>KHÔNG CÁI NÀO</em>. Tốt nhất là trễ 41 phút và tệ nhất là bốn tiếng rưỡi. Nếu cái cron này từng là "sao lưu lúc 03:00 và báo động nếu chưa xong trước 04:00", thì nó đã gọi điện đánh thức ai đó vào TÁM trên mười Chủ nhật vì một lý do chẳng liên quan gì tới việc sao lưu.</p>
</div>


${slide('ga-01', 14, 'Cron 03:00 UTC Chủ nhật: 14 lần, không lần nào đúng giờ')}
<p><strong>Cập nhật ngày 24/09/2026.</strong> Bảng ở trên đo vào cuối tháng 8. Từ đó đã có thêm bốn Chủ nhật, đọc ngược về theo đúng cách cũ (<code>gh api "repos/…/actions/workflows/vps-cleanup-weekly.yml/runs?event=schedule"</code>):</p>
<div class="out">  lan | ngay       | gio THAT (UTC) | TRE
  ----+------------+----------------+--------
   18 | 2026-09-20 | 08:08:41       | +5h08m
   17 | 2026-09-13 | 07:51:24       | +4h51m
   16 | 2026-09-06 | 07:27:40       | +4h27m
   13 | 2026-08-30 | 08:46:07       | +5h46m
   12 | 2026-08-23 | 03:42:42       | +0h42m   &lt;- bang cu dung o day
  ...
  n = 14 lan chay theo lich (so lan 10, 11, 14, 15 la bam tay)
  dung gio (tre &lt; 1 phut): 0
  TRE it nhat   : 41 phut
  TRE nhieu nhat: 346 phut = 5,8 gio
  TRUNG BINH    : 197 phut = 3,3 gio
  4 lan moi nhat: trung binh 303 phut = 5,1 gio</div>
<p>Vẫn KHÔNG lần nào đúng giờ — và cái "xu hướng" ở mục sau đã không kéo dài. Hãy đọc tiếp với điều đó trong đầu.</p>
<h3>Có một XU HƯỚNG, và nó đáng đọc</h3>
<p>Nhìn các độ trễ theo thứ tự NGÀY thay vì theo thứ tự trong bảng: <strong>4h28m, 3h57m, 3h33m, 2h48m, 2h43m, 2h52m, 2h48m, 1h11m, 0h40m, 0h42m</strong>. Tháng 6 tệ hơn tháng 8 một cách nhất quán, và mức cải thiện là ĐƠN ĐIỆU trừ chút nhiễu ở khúc giữa.</p>

<p>Đó là một phép đo về HÀNG ĐỢI CỦA GITHUB, không phải về cái kho này — chẳng có gì trong workflow thay đổi suốt mười tuần ấy. Nó cũng có nghĩa là con số bạn đo được hồi tháng 6 (khoảng bốn tiếng) và con số bạn đo hôm nay (khoảng bốn mươi phút) chênh nhau SÁU LẦN. <strong>Mọi con số độ trễ cụ thể đều có hạn sử dụng.</strong> Thứ KHÔNG hết hạn là cái HÌNH DẠNG: các lần chạy theo lịch bắt đầu MUỘN, muộn một lượng bạn không kiểm soát được và không dự đoán được.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">cron nghĩa là gì ở nơi khác</span><span class="lz-t">LÚC 03:00</span><span class="lz-d">một crontab Linux nổ trong vòng một giây kể từ phút đó, mọi lần</span></div>
<div class="lz-step"><span class="lz-k">nó nghĩa là gì ở đây</span><span class="lz-t">KHÔNG SỚM HƠN 03:00</span><span class="lz-d">một lời xin vào hàng đợi, được phục vụ khi có chỗ</span></div>
</div>


<div class="callout warn">
<p><strong>Cập nhật: xu hướng đã ĐẢO CHIỀU.</strong> Sau hai Chủ nhật đẹp hồi tháng 8 (0h40m, 0h42m), bốn lần tiếp theo là 5h46m, 4h27m, 4h51m và 5h08m — chuỗi tệ nhất của cả bộ số. Đó là minh hoạ mạnh nhất có thể cho đoạn văn ngay dưới: một độ trễ đo trong tháng này không nói gì về tháng sau. Chẳng có gì trong kho này thay đổi; hàng đợi của GitHub thì có.</p>
</div>
<h3>Đo lại trên sân tập: "mỗi năm phút"</h3>
${slide('ga-01', 15, 'Cron */5 trên sân tập, đo thật')}
<p>Một cron hằng tuần chỉ cho một mẫu đo mỗi tuần. Để nhìn thẳng vào hàng đợi, sân tập được thêm một workflow xin <code>'*/5 * * * *'</code> — khoảng ngắn nhất GitHub cho phép — trên nhánh mặc định, cộng một lịch thứ hai có <code>timezone:</code>. Nó được push ngày 24/09/2026 lúc 10:15:48 UTC và bị tắt bằng <code>gh workflow disable</code> ngay khi đo xong:</p>
<pre><code class="language-yaml">on:
  schedule:
    - cron: '*/5 * * * *'           # UTC, moi 5 phut
    - cron: '50 17 * * *'           # 17:50 ... theo mui gio nao?
      timezone: 'Asia/Ho_Chi_Minh'  # = 10:50 UTC
  workflow_dispatch:</code></pre>
<div class="out">10:15:48  push ch01-cron.yml len main          cron '*/5 * * * *' (UTC)
10:25:03  them muc '50 17 * * *' + timezone     = 10:50 UTC
10:20 ... 11:45  18 moc */5 di qua             0 lan chay theo lich
10:50     moc timezone di qua                   0 lan chay
11:08:25  gh workflow run ch01-cron.yml        run 35991278091 (workflow_dispatch) chay ngay
11:46     gh workflow disable ch01-cron.yml    state: disabled_manually

$ gh run list -w "ch01 cron moi 5 phut" --json event,createdAt
workflow_dispatch   2026-09-24T11:08:25Z        &lt;- lan chay DUY NHAT
githubstatus.com: Actions = operational</div>
<p><strong>Chín mươi phút, mười tám mốc năm phút, một mốc có timezone: KHÔNG lần chạy theo lịch nào.</strong> Tệp hợp lệ — một lần dispatch tay lúc 11:08 (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35991278091" target="_blank" rel="noopener">run 35991278091</a>) chạy NGAY, và trang trạng thái của GitHub báo Actions hoạt động bình thường suốt thời gian đó. Cái lịch đơn giản là chưa sinh ra nổi một lần chạy nào tới lúc dừng đo và tắt workflow.</p>
<p>Đây là mặt kia của câu trong tài liệu "có thể bị trễ… một số job đang xếp hàng có thể bị bỏ": một lịch <em>MỚI TINH</em> có thể mất rất lâu mới có lần chạy đầu tiên, và không có gì báo cho bạn. Chúng tôi không nói được lần đầu sẽ tới sau hai tiếng hay năm tiếng — đã dừng ở phút thứ chín mươi thay vì để một cron năm phút chạy mãi trên sân tập dùng chung. Quy tắc thực dụng mới là phần giá trị: <strong>sau khi thêm hoặc sửa một lịch, hãy KIỂM rằng lần chạy đầu tiên thật sự đã xảy ra</strong> (<code>gh run list -w &lt;tên&gt; --json event</code>) trước khi dựa vào nó, và giữ <code>workflow_dispatch</code> để tự chạy trong lúc chờ.</p>
<h3>Múi giờ, nửa còn lại của vấn đề</h3>
${slide('ga-01', 16, 'Cron tính theo UTC; muốn giờ VN thì trừ 7, hoặc ghi timezone')}

<p>GitHub chạy cron theo <strong>UTC</strong>. Không theo múi giờ của chủ kho, không theo múi giờ của runner, và KHÔNG điều chỉnh theo giờ mùa hè:</p>

<div class="out">'0 0 * * *' = 00:00 UTC = 07:00 gio Viet Nam
'0 3 * * *' = 03:00 UTC = 10:00 gio Viet Nam
'0 17 * * *' = 17:00 UTC = 00:00 gio Viet Nam (hom sau)

→ muon chay 03:00 GIO VIET NAM thi phai viet '0 20 * * *'
  (20:00 UTC HOM TRUOC)</div>

<p>Workflow của kho này làm đúng, và quan trọng hơn, nó <em>GHI PHÉP QUY ĐỔI RA CHÚ THÍCH</em> — <code># Chạy lúc 3h sáng UTC mỗi Chủ nhật (= 10h sáng VN)</code>. Một biểu thức cron là năm con số không có đơn vị và không có múi giờ; cái chú thích là NƠI DUY NHẤT ý định có thể sống.</p>

<div class="pitfall">
<p><strong>Bẫy — với một nước có giờ mùa hè, MỘT cái cron không thể có nghĩa là MỘT giờ địa phương suốt cả năm.</strong> UTC không dịch; giờ địa phương thì có. Một tác vụ hẹn 09:00 giờ địa phương sẽ chạy lúc 09:00 trong nửa năm và 08:00 hoặc 10:00 trong nửa còn lại, và nó chuyển vào một ngày chẳng ai ghi lại. Việt Nam không dùng giờ mùa hè nên kho này không dính — nhưng nếu đội của bạn ở châu Âu hay Bắc Mỹ, thì câu hỏi "sao báo cáo tới sớm một tiếng hồi tháng Ba" có câu trả lời ở đây.</p>
</div>


<div class="callout ok">
<p><strong>Đính chính ngày 24/09/2026 — giờ ĐÃ có khoá <code>timezone:</code>.</strong> Hai đoạn trên mô tả MẶC ĐỊNH, và mặc định vẫn là UTC. Nhưng tài liệu GitHub (tính đến 09/2026) nay cho mỗi mục lịch mang một tên múi giờ IANA, và nói rằng ở múi giờ có giờ mùa hè, một thời điểm bị nhảy mất lúc chuyển giờ mùa xuân "được dời tới thời điểm hợp lệ kế tiếp" (lịch 2:30 sáng chạy lúc 3:00). Vậy với một đội ở châu Âu, cái bẫy giờ mùa hè ở trên giờ tránh được: <code>timezone: "Europe/Berlin"</code> giữ một tác vụ 09:00 đúng 09:00 giờ địa phương quanh năm. (Mục lịch có <code>timezone: 'Asia/Ho_Chi_Minh'</code> trên sân tập qua được actionlint và được GitHub nhận, nhưng — như mọi mốc khác trong khoảng đo — mốc 10:50 UTC của nó không sinh ra lần chạy nào, nên hành vi timezone ở đây là theo TÀI LIỆU, chưa được QUAN SÁT tận mắt.)</p>
</div>
<h3>Phép đo này nên đổi điều gì</h3>
${slide('ga-01', 17, 'schedule trả lời “đại khái hằng tuần”, không trả lời “lúc 03:00”')}

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">ĐỪNG lên lịch thứ gì phụ thuộc THỜI ĐIỂM</span><span class="lz-lnote">"đăng lúc 09:00" không phải thứ <code>schedule</code> hứa được. Hãy đăng từ một workflow NGAY KHI thứ đó sẵn sàng, thay vì thế</span></div>
<div class="lz-layer"><span class="lz-lname">ĐỪNG báo động theo kiểu "chưa xong trước giờ X"</span><span class="lz-lnote">đo thật: cái báo động đó đã nổ vào 8 trên 10 Chủ nhật. Hãy báo động theo kiểu "chưa chạy suốt hơn 8 ngày" — một công tắc người chết, đúng hình dạng mà Chương 9 lập luận</span></div>
<div class="lz-layer"><span class="lz-lname">ĐỪNG nối hai cái cron với nhau</span><span class="lz-lnote">"A lúc 03:00, B lúc 04:00, B cần A" là tung đồng xu. Hãy làm cho B phụ thuộc vào việc A KẾT THÚC, bằng <code>workflow_run</code></span></div>
<div class="lz-layer"><span class="lz-lname">HÃY giữ <code>workflow_dispatch</code> đi kèm</span><span class="lz-lnote">kho này có làm thế. Khi lịch trễ bốn tiếng và bạn cần nó NGAY, cái nút là câu trả lời</span></div>
<div class="lz-layer"><span class="lz-lname">HÃY làm cho tác vụ BẤT BIẾN theo số lần chạy</span><span class="lz-lnote">một cú dọn dẹp chạy lúc 03:42 thay vì 03:00 thì KHÔNG nên bận tâm. Nếu nó có bận tâm, thì độ trễ không phải vấn đề thật của bạn</span></div>
</div>

<h3>Cách khác mà lịch chết: ÂM THẦM</h3>
${slide('ga-01', 18, 'Cron trên nhánh tính năng: không chạy, không báo lỗi')}
<p>Đo thật, không chỉ trích tài liệu. Nhánh <code>ch01-workflow</code> của sân tập mang tệp <code>ch01-cron-nhanh.yml</code> với <code>cron: '*/5 * * * *'</code> và không gì khác. GitHub còn không biết workflow ấy TỒN TẠI:</p>
<div class="out">$ gh run list -w "ch01 cron tren nhanh"
could not find any workflows named ch01 cron tren nhanh
$ gh api repos/cuonghoang1103/ga-san-tap/actions/workflows --jq '.workflows[].name' | grep -c "cron tren nhanh"
0</div>
<p>Không lần chạy nào, không lỗi, không có tên trong danh sách workflow. (Riêng "0 lần chạy" thì chứng minh được ít — cron trên main ở mục trên cũng 0 lần trong chín mươi phút. Khác biệt nằm ở DANH SÁCH: GitHub đăng ký tệp trên main thành một workflow trạng thái <code>active</code>; còn tệp chỉ nằm trên nhánh thì với GitHub nó không hề tồn tại.) Câu chữ của chính tài liệu đáng nhớ: sự kiện này "chỉ kích hoạt một lần chạy nếu tệp workflow tồn tại trên nhánh mặc định", và khi tải cao thì "một số job đang xếp hàng có thể bị BỎ" — nên một lịch còn có thể MẤT hẳn một lần chạy, chứ không chỉ khởi động muộn.</p>

<p>Hai quy tắc không đẻ ra dòng báo lỗi nào:</p>

<div class="kv-grid">
<div class="kv"><span class="k">chỉ nhánh MẶC ĐỊNH</span><span class="v">một <code>schedule:</code> trên nhánh tính năng thì chẳng lên lịch gì. Không cảnh báo, không lần chạy nào, không có cách nào biết được từ tab Actions</span></div>
<div class="kv"><span class="k">bị TẮT sau 60 ngày không hoạt động</span><span class="v">GitHub tắt các workflow theo lịch trong kho công khai không có commit nào suốt 60 ngày, và gửi email cho chủ kho. Một cái kho im ắng sẽ thôi chạy chính phần bảo trì của nó</span></div>
<div class="kv"><span class="k">khoảng ngắn nhất là 5 phút</span><span class="v">và với các độ trễ đã đo, coi <code>*/5</code> là "mỗi năm phút" thì hơi lạc quan</span></div>
<div class="kv"><span class="k">không chạy thì không có bản ghi</span><span class="v">tab Actions hiện những lần chạy ĐÃ XẢY RA. Nó không thể cho bạn xem một lần chạy chưa bao giờ được xếp hàng, và đó là lý do công tắc người chết quan trọng</span></div>
</div>

<div class="callout ok">
<p><strong>Quy tắc bài này mua được.</strong> <code>schedule</code> trả lời câu "đại khái hằng ngày" hoặc "đại khái hằng tuần", và nó trả lời TỐT — cái tác vụ dọn dẹp này đã chạy mỗi Chủ nhật suốt hai tháng mà không ai phải đụng tới. Nó KHÔNG trả lời câu "lúc 03:00". Nếu yêu cầu của bạn chứa một giờ đồng hồ CÓ Ý NGHĨA, thì <code>schedule</code> là cơ chế SAI và không có mức tinh chỉnh biểu thức cron nào đổi được điều đó.</p>
</div>

<h3>Đọc một biểu thức cron, từng trường một</h3>
<table>
<thead><tr><th>Trường</th><th>Miền giá trị</th><th><code>'0 3 * * 0'</code></th><th><code>'*/15 9-17 * * 1-5'</code></th></tr></thead>
<tbody>
<tr><td>phút</td><td>0–59</td><td>0</td><td>mỗi 15 phút: 0, 15, 30, 45</td></tr>
<tr><td>giờ</td><td>0–23</td><td>3 (UTC!)</td><td>từ 9 tới 17</td></tr>
<tr><td>ngày trong tháng</td><td>1–31</td><td>bất kỳ</td><td>bất kỳ</td></tr>
<tr><td>tháng</td><td>1–12 hoặc JAN–DEC</td><td>bất kỳ</td><td>bất kỳ</td></tr>
<tr><td>thứ trong tuần</td><td>0–6 hoặc SUN–SAT (0 = Chủ nhật)</td><td>0 = Chủ nhật</td><td>thứ Hai–thứ Sáu</td></tr>
</tbody>
</table>
<p>Hai thói quen chặn được phần lớn lỗi cron: luôn đặt biểu thức trong nháy (một dấu <code>*</code> trần ở đầu giá trị YAML là ký hiệu alias, nên <code>*/5 * * * *</code> không nháy là lỗi phân tích), và ghi phép quy đổi ra giờ địa phương vào chú thích ngay cùng dòng — như api-backend đang làm. Tài liệu còn khuyên tránh phút 0, vì "đầu mỗi giờ" là lúc hàng đợi đầy nhất: <code>'17 3 * * 0'</code> là một lời xin dễ chịu hơn <code>'0 3 * * 0'</code>.</p>

<h3>Chạy thử từng bước: đo độ trễ lịch của chính bạn</h3>
<pre><code class="language-bash"># moi lan chay theo lich cua mot workflow, kem thoi diem duoc tao
gh api "repos/OWNER/REPO/actions/workflows/cleanup.yml/runs?event=schedule&amp;per_page=50" \\
  --jq '.workflow_runs[] | [.run_number, .created_at] | @tsv'

# muc lich nao da no (mot workflow co the co nhieu muc)
echo "lich: &#36;{{ github.event.schedule }}"     # ben trong mot buoc run:

# tat mot lich ma khong xoa tep
gh workflow disable cleanup.yml
gh workflow enable cleanup.yml</code></pre>
<p>Lấy <code>created_at</code> trừ đi phút đã hẹn là ra độ trễ; làm vậy vài tuần rồi hẵng tin bất kỳ con số nào, kể cả những con số trong bài này.</p>

<h3>Cái báo động bài này khuyên dùng, viết ra hẳn hoi</h3>
<p>"Báo động khi nó chưa chạy suốt 8 ngày" nghe trừu tượng cho tới khi bạn thấy nó cần ít thứ tới mức nào. Một workflow thứ hai, bé tí (hoặc bất kỳ công cụ giám sát nào bạn đang có), hỏi API xem lần dọn đĩa thành công gần nhất là khi nào:</p>
<pre><code class="language-yaml">name: canh-gac don dia
on:
  schedule:
    - cron: '23 */6 * * *'        # khoang 6 tieng mot lan, tranh dau gio
  workflow_dispatch:
jobs:
  kiem:
    runs-on: ubuntu-latest
    permissions:
      actions: read
    steps:
      - env:
          GH_TOKEN: &#36;{{ github.token }}
        run: |
          last=$(gh api "repos/&#36;{{ github.repository }}/actions/workflows/vps-cleanup-weekly.yml/runs?status=success&amp;per_page=1" --jq '.workflow_runs[0].created_at')
          age=$(( ( $(date +%s) - $(date -d "$last" +%s) ) / 86400 ))
          echo "lan chay thanh cong cuoi: $last ($age ngay truoc)"
          test "$age" -le 8</code></pre>
<p>Nó chỉ hỏng — và báo cho ai đang theo dõi tab Actions — khi lần dọn đĩa đã VẮNG MẶT quá tám ngày, bất kể độ trễ hàng đợi là bao nhiêu. Đó là hình dạng sống sót qua một Chủ nhật trễ năm tiếng. (Bản thân nó cũng là một lịch nên cũng có thể trễ; không sao, vì nó đang kiểm theo NGÀY, không theo phút.)</p>
<p>Đã chạy thật trước khi đưa vào bài: đúng job ấy trên sân tập, trỏ vào <code>ch01-giai-phau.yml</code> thay vì tệp dọn đĩa (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35988744631" target="_blank" rel="noopener">run 35988744631</a>), in ra <code>lan chay thanh cong cuoi: 2026-09-24T10:29:45Z (0 ngay truoc)</code> và qua. Để ý <code>permissions: actions: read</code> — token của job cần quyền đó mới liệt kê được các run.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn hẹn một job lúc 09:00 mà nó chạy lúc 11:40. Có gì hỏng không?</strong><br>Đ: Không. Cron của GitHub là lời xin xếp hàng vào lúc hoặc SAU thời điểm đó, mặc định theo UTC; trễ vài tiếng khi tải cao là bình thường và run còn có thể bị bỏ. Yêu cầu theo giờ đồng hồ thì dùng bộ lập lịch bên ngoài gọi <code>workflow_dispatch</code>, hoặc kích hoạt theo chính sự kiện làm công việc sẵn sàng.</p>
<p><strong>H: Vì sao workflow theo lịch của tôi không chạy chút nào?</strong><br>Đ: Tệp phải nằm trên nhánh mặc định; kho công khai tự tắt lịch sau 60 ngày không hoạt động; workflow có thể đang bị disable; và biểu thức có thể đang là UTC trong khi bạn nghĩ giờ địa phương. Xem trạng thái bằng <code>gh workflow list</code>.</p>
<p><strong>H: Bạn giám sát một job chạy hằng đêm thế nào?</strong><br>Đ: Báo động theo SỰ VẮNG MẶT — "không có lần chạy thành công nào trong N giờ" — chứ không theo "chưa xong trước giờ X", vì chính giờ bắt đầu đã không được bảo đảm.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn muốn "mỗi sáng 07:00 giờ Việt Nam kiểm bản sao lưu một lần". Hãy đo xem GitHub thật sự giao được gì trước khi hứa.</p><ol>
<li>Trên nhánh MẶC ĐỊNH của kho thực hành, thêm một workflow có <code>cron: '*/5 * * * *'</code> và <code>workflow_dispatch</code>; cho bước in <code>date -u</code> và <code>&#36;{{ github.event.schedule }}</code>.</li>
<li>Đặt cùng tệp đó (tên khác) CHỈ trên một nhánh tính năng. Push cả hai.</li>
<li>Sau 30–60 phút, liệt kê các run bằng <code>gh run list -w &lt;tên&gt; --json createdAt,event</code> và tính độ trễ của từng run so với mốc 5 phút của nó.</li>
<li>Viết dòng cron cho "07:00 giờ Việt Nam mỗi ngày" hai lần: một lần theo UTC, một lần có <code>timezone:</code>.</li>
<li>Tắt lịch bằng <code>gh workflow disable</code> và xác nhận nó hiện trạng thái disabled trong <code>gh workflow list</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một bảng ít nhất ba run theo lịch kèm độ trễ; bản trên nhánh tính năng có 0 run; hai dòng cron của bạn là <code>'0 0 * * *'</code> và <code>'0 7 * * *'</code> + <code>timezone: 'Asia/Ho_Chi_Minh'</code>; và workflow đã bị tắt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>schedule</code> / cron (lịch)</span><span class="v">Bộ kích hoạt theo thời gian; năm trường: phút, giờ, ngày trong tháng, tháng, thứ trong tuần.</span></div>
  <div class="kv"><span class="k">UTC (giờ phối hợp quốc tế)</span><span class="v">Múi giờ mặc định của cron trên GitHub. Việt Nam = UTC+7, không có giờ mùa hè.</span></div>
  <div class="kv"><span class="k"><code>timezone:</code> (múi giờ)</span><span class="v">Tên múi giờ IANA tuỳ chọn trên một mục lịch, vd <code>Asia/Ho_Chi_Minh</code> (GitHub Docs, 09/2026).</span></div>
  <div class="kv"><span class="k">Queue delay (độ trễ hàng đợi)</span><span class="v">Khoảng cách giữa phút đã hẹn và lúc run thật sự được tạo; đo ở đây từ 40 phút tới gần 6 tiếng.</span></div>
  <div class="kv"><span class="k">Dead-man&#39;s switch (công tắc người chết)</span><span class="v">Báo động nổ khi một tín hiệu đáng lẽ phải tới lại NGỪNG tới, thay vì khi thứ gì đó chậm.</span></div>
  <div class="kv"><span class="k">Idempotent (chạy lại vô hại)</span><span class="v">Chạy lại, hay chạy vào lúc khác, vẫn cho cùng kết quả.</span></div>
  <div class="kv"><span class="k"><code>gh workflow disable</code></span><span class="v">Tắt một workflow (lịch ngừng) mà không xoá tệp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cron của GitHub nghĩa là "không sớm hơn", không phải "đúng lúc": 14 Chủ nhật thật, 0 lần đúng giờ, trễ từ 41 phút tới 5,8 tiếng.</li>
<li>Độ trễ trôi theo tải của GitHub — tháng 8 trông ổn, tháng 9 tệ nhất từ trước tới giờ. Đừng bao giờ thiết kế dựa trên một độ trễ đã đo.</li>
<li>Múi giờ mặc định là UTC (Việt Nam = UTC+7); nay đã có khoá <code>timezone:</code> cho từng mục lịch.</li>
<li>Lịch chỉ chạy từ nhánh mặc định; cron trên nhánh tính năng không bao giờ chạy và GitHub còn không liệt kê nó.</li>
<li>Dùng schedule cho "đại khái hằng ngày/hằng tuần", luôn kèm <code>workflow_dispatch</code>, job chạy lại vô hại, và báo động theo sự vắng mặt.</li>
<li>Tránh phút 0, đặt nháy cho biểu thức, ghi giờ địa phương trong chú thích, và tắt những cron không còn cần.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: schedule</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule — phát biểu về UTC, mức tối thiểu năm phút, luật nhánh mặc định, và cú tắt sau 60 ngày. Lời cảnh báo về độ trễ chỉ có MỘT câu; bài này là hình dạng của nó khi đem đi ĐO.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab(5)</span><span class="lc-sub">man 5 crontab — năm trường, các khoảng, và cú pháp bước <code>*/n</code>. GitHub nhận cú pháp cron POSIX nhưng KHÔNG nhận các lối viết tắt kiểu <code>@yearly</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab.guru</span><span class="lc-sub">crontab.guru — đọc ngược một biểu thức ra tiếng Anh. Đáng dán vào đó trước khi commit, vì <code>'0 3 * * 0'</code> và <code>'0 3 0 * *'</code> trông giống nhau mà nghĩa rất khác nhau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — báo động theo SỰ VẮNG MẶT, không theo ngưỡng</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — khuôn mẫu công-tắc-người-chết mà bài này khuyên dùng, đo đối chiếu với một báo động ngưỡng trên cùng bộ dữ liệu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — pull_request runs on a commit that is not on your branch|||1.4 — pull_request chạy trên một commit KHÔNG nằm trên nhánh bạn',
      slug: 'ga-1-4-merge-commit',
      type: 'VIDEO',
      description: 'Đo thật: nhánh PR xanh, main xanh, gộp không xung đột — và CI vẫn ĐỎ. Vì `pull_request` không chạy trên nhánh bạn, nó chạy trên một merge commit không tồn tại ở đâu cả. Cộng ba tổ hợp `pull_request_target` và cái nào rò bí mật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2><code>pull_request</code> runs on a commit that is not on your branch</h2>
<p class="lead">You push a branch, open a PR, and CI goes green. It is natural to read that tick as "my branch passes". It does not say that. It says something narrower and more useful, and the gap between the two is where a whole class of broken-main incidents lives.</p>

<h3>The question, stated precisely</h3>
${slide('ga-01', 19, 'pull_request runs on a THIRD commit — not your branch')}
<p>When a <code>pull_request</code> event fires and <code>actions/checkout</code> runs, <strong>which commit ends up in the working directory?</strong> Three candidates look plausible:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">candidate</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">the tip of my branch</span><span class="lz-nsub">what I pushed, what I tested locally, what the PR page shows as the latest commit</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">the tip of the base branch</span><span class="lz-nsub">main as it stands now, without my changes at all</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">a merge of the two</span><span class="lz-nsub">a commit nobody wrote, that exists on no branch, created by GitHub for this purpose</span></div></div>
</div>
</div>

<p>It is the third one. GitHub computes <code>git merge --no-ff</code> of your branch into the base and publishes the result as <code>refs/pull/&lt;N&gt;/merge</code>. That commit is what the job checks out, and its SHA is what <code>&#36;{{ github.sha }}</code> holds.</p>

<h3>Why that distinction is not academic</h3>
<p>Here is a rig built to make the difference visible. Base branch has a function and a test for it. The PR branch <strong>adds one new file</strong> and its own test — it does not touch a single file that the base branch touches. Meanwhile the base branch changes that function&#39;s signature and updates <em>its own</em> test to match:</p>

<pre><code><span class="tok-comment"># main: chu ky cu</span>
function calc(a, b) { return a + b; }

<span class="tok-comment"># nhanh PR: CHI THEM file moi, goi ham theo chu ky cu</span>
function orderTotal(x, y) { return calc(x, y); }

<span class="tok-comment"># main (trong luc do): doi chu ky, va sua test CUA CHINH NO</span>
function calc({ a, b }) { return a + b; }</code></pre>

<p>No file is edited on both sides, so the merge is textually clean. Now run the same test suite in each of the three places:</p>

<div class="out">######## A. CHAY TREN DAU NHANH PR (cai ban thay o local) ########
  xanh: thu-bao-cao
  xanh: thu-tinh
CI XANH
exit=0

######## B. CHAY TREN MAIN (khong co PR) ########
  xanh: thu-tinh
CI XANH
exit=0

######## C. MERGE COMMIT — cai ma pull_request THUC SU chay ########
gop: SACH, khong xung dot
GITHUB_SHA      = ebf646c58c6dfcf24ba494d6d7fca4e16f914698
  ^1 (base)     = 4455dae17852942087937e976f117b6b465f6407
  ^2 (dau PR)   = f1f968b0ebb224829e605d94db8c9d2636937728
  HONG: thu-bao-cao.js - tongDon(10,20) = NaN, mong doi 30
  xanh: thu-tinh
CI DO (1 hong)
exit=1</div>

<div class="callout warn">
<p><strong>Both branches are green. The merge has no conflict. The result is red.</strong> There is no version-control operation that could have warned you: git&#39;s job is to reconcile <em>text</em>, and the text reconciled perfectly. What broke is a contract between two files that were never edited together. Only running the merged tree can find it, and running the merged tree is exactly what <code>pull_request</code> does.</p>
</div>

<p>Read the SHAs in block C again. The merge commit has <strong>two parents</strong>, and the interesting one is that neither parent is the commit you would have guessed:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">^1</span><span class="lz-t">4455dae1 — the base</span><span class="lz-d">the tip of <code>main</code> at the moment the merge ref was computed</span></div>
<div class="lz-step"><span class="lz-k">^2</span><span class="lz-t">f1f968b0 — your branch</span><span class="lz-d">the commit the PR page displays, the one you pushed</span></div>
<div class="lz-step"><span class="lz-k">itself</span><span class="lz-t">ebf646c5 — GITHUB_SHA</span><span class="lz-d">on no branch, in nobody&#39;s local clone, and it is the thing CI judged</span></div>
</div>


${slide('ga-01', 20, 'Both branches green, merge clean — the pull_request run is red')}
<p><strong>Reproduced on GitHub itself, 24/09/2026.</strong> The harness above ran locally. The same three files were then pushed to the sandbox: the base branch <code>ch01-workflow</code> changed <code>calc(a, b)</code> to <code>calc({ a, b })</code> and fixed its own test; the branch <code>ch01-pr-bao-cao</code>, cut before that change, only added <code>lib/bao-cao.js</code> and its test. One workflow runs the tests on <code>push</code> to both branches and on <code>pull_request</code>. Then <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/1" target="_blank" rel="noopener">PR #1</a> was opened (and closed after recording):</p>
<div class="out">run          su kien        commit              ket qua
35986530494  push           93c3050 (nhanh goc)  xanh: calc.test.js              CI XANH
35986526254  push           e1459aa (nhanh PR)   xanh: bao-cao.test.js, calc     CI XANH
35986554816  pull_request   0815f9a (merge)      HONG: bao-cao.test.js
                                                 tongDon(10,20) = NaN, mong doi 30  CI DO</div>
<p>Two green runs, one red run, and the red one is on a commit that no one pushed. Open the three links (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986530494" target="_blank" rel="noopener">base</a>, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986526254" target="_blank" rel="noopener">PR branch</a>, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986554816" target="_blank" rel="noopener">pull_request</a>) and the whole lesson is in front of you.</p>
<h3>The SHA the API shows you is not the SHA the job saw</h3>
${slide('ga-01', 21, 'GITHUB_SHA is the merge commit; head.sha is your branch')}
<p>The job log of that red run, plus two questions to the API afterwards:</p>
<div class="out">su kien     = pull_request
GITHUB_REF  = refs/pull/1/merge
GITHUB_SHA  = 0815f9af01e8c0b24d39825dcb5f802b4e62ec7c
head.sha    = e1459aae73936edd84bd618bcab9422ae46e56a3
base.sha    = 93c30503ebacb40a2254851a26f34ea603682806
HEAD        = 0815f9af01e8c0b24d39825dcb5f802b4e62ec7c
parents     =

$ gh api repos/cuonghoang1103/ga-san-tap/commits/0815f9a --jq '.commit.message, .parents[].sha'
Merge e1459aae73936edd84bd618bcab9422ae46e56a3 into 93c30503ebacb40a2254851a26f34ea603682806
93c30503ebacb40a2254851a26f34ea603682806
e1459aae73936edd84bd618bcab9422ae46e56a3

$ gh pr checks 1
test  fail  4s  .../actions/runs/35986554816
test  pass  7s  .../actions/runs/35986526254</div>
${slide('ga-01', 22, 'The API files the run under head.sha — the job tested the merge commit')}
<p>Three details in that output are worth a second look:</p>
<ul>
<li><strong><code>parents =</code> is empty inside the job.</strong> <code>actions/checkout</code> fetches with <code>fetch-depth: 1</code>, so git on the runner sees the merge commit but not its parents. If a step needs to diff against the base (changed files, commit messages), fetch more history (<code>fetch-depth: 0</code>, or fetch the base sha explicitly) — otherwise the "diff" is silently empty.</li>
<li><strong>The commit message is "Merge e1459aa… into 93c3050…"</strong> and GitHub is its author. It exists only as <code>refs/pull/1/merge</code>; <code>git fetch origin pull/1/merge</code> brings it to your machine if you want to reproduce a PR failure locally.</li>
<li><strong><code>gh pr checks</code> shows TWO rows called <code>test</code></strong>: the push run on the branch (green) and the pull_request run on the merge (red). Both attach to the PR because both ran on the same head sha. Reading the green one and merging is exactly the mistake this lesson is about.</li>
</ul>

<p>This is where the confusion becomes concrete. Ask the API about a real <code>pull_request</code> run from this repository and compare it with the PR itself:</p>

<div class="out">run 27990511412 (PR #4) head_sha = 3220149d38388b8f8173e1e2d9312ae7739860a6
PR #4 head.sha (API)             = 3220149d38388b8f8173e1e2d9312ae7739860a6  <- GIONG NHAU
PR #4 mergeable_state            = unknown  <- GitHub tinh LUOI, chi tinh khi co nguoi HOI</div>

<p>The run&#39;s <code>head_sha</code> equals the PR&#39;s head. So every tool that reads the API — dashboards, badges, bots, your own scripts — reports the run as being <em>about</em> your branch tip. Inside the job, <code>&#36;{{ github.sha }}</code> is a different SHA entirely, and it appears nowhere in the run&#39;s API record. Two coherent views of the same run that disagree about what was tested.</p>

<div class="kv-grid">
<div class="kv"><span class="k">want the merge commit</span><span class="v"><code>&#36;{{ github.sha }}</code> — the default, what checkout takes with no <code>ref:</code></span></div>
<div class="kv"><span class="k">want your branch tip</span><span class="v"><code>&#36;{{ github.event.pull_request.head.sha }}</code> — pass it as <code>ref:</code> explicitly</span></div>
<div class="kv"><span class="k">want the base tip</span><span class="v"><code>&#36;{{ github.event.pull_request.base.sha }}</code></span></div>
<div class="kv"><span class="k">want the branch NAME</span><span class="v"><code>&#36;{{ github.head_ref }}</code>. <code>&#36;{{ github.ref }}</code> on a PR is <code>refs/pull/&lt;N&gt;/merge</code>, which is not a branch and will surprise anything that string-matches it</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — tagging or publishing with <code>github.sha</code> on a PR run.</strong> A step that does <code>docker build -t app:&#36;{{ github.sha }}</code> produces, on a PR, an image tagged with a merge commit that will never exist again once the PR updates. It is not reproducible, not reachable from any branch, and after the PR merges the tag corresponds to nothing. On PR runs tag with <code>head.sha</code>, or do not publish from PR runs at all.</p>
</div>

<h3>When the merge does not exist, nothing runs — and nothing says so</h3>
${slide('ga-01', 23, 'Conflict ⇒ no merge commit ⇒ no run at all')}
<p>Also reproduced: <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/2" target="_blank" rel="noopener">PR #2</a> changed the same line of <code>lib/calc.js</code> that the base had changed.</p>
<div class="out">$ gh pr view 2 --json mergeable,mergeStateStatus
{"mergeStateStatus":"DIRTY","mergeable":"CONFLICTING", ...}
$ gh api repos/cuonghoang1103/ga-san-tap/pulls/2 --jq '{merge_commit_sha, mergeable_state}'
{"merge_commit_sha":null,"mergeable_state":"dirty"}
$ gh run list -L 5 --json workflowName,headBranch,event     # 60 giay sau khi mo PR
ch01 test   ch01-pr-bao-cao   pull_request     &lt;- cua PR #1, khong phai PR #2
ch01 test   ch01-workflow     push
...                                             # 0 lan chay nao cho ch01-pr-xung-dot</div>
<p>The documentation says it in one line: "Workflows will not run on <code>pull_request</code> activity if the pull request has a merge conflict." Notice that the only check on PR #2 was a third-party app (a secret scanner) — which makes the PR look "checked" at a glance even though CI never started.</p>

<p>Same rig, one change: let both sides edit the same file so the merge genuinely conflicts.</p>

<div class="out">Auto-merging thu.js
CONFLICT (content): Merge conflict in thu.js
Automatic merge failed; fix conflicts and then commit the result.

git rev-parse HEAD -> van la main, KHONG co commit nao duoc tao</div>

<p>There is no merge commit to check out, so GitHub queues no run. The consequence on the PR page is specific and worth recognising on sight: the check does not go red. It does not go green. It sits at <strong>"Expected — Waiting for status to be reported"</strong>, indefinitely, and if it is a required check the PR is unmergeable with no failure to click into.</p>

<div class="callout">
<p><strong>The recognition rule.</strong> A check that is <em>pending forever</em> on a PR is almost never a stuck runner. It is one of three things: a merge conflict (no merge ref to run against), a path or branch filter that excluded this PR (lesson 1.5), or a required check whose workflow no longer exists. All three are configuration, and none of them will produce a log to read.</p>
</div>

<h3>How much a green tick can go stale</h3>
<p>PR #4 in this repository is still open. Its last CI run was a success. Here is what has happened to the base branch underneath it since:</p>

<div class="out">PR #4: mo 22/06/2026, base luc do = dda544e7, dau nhanh = 3220149d
lan chay ci-lint cuoi: 27990511412, 22/06/2026, ket qua: success

main tu do toi nay (24/08/2026) da di them:
  1527 commit
  5315 file thay doi
  +1.214.424 / -14.703 dong</div>

<div class="callout warn">
<p><strong>That green tick was computed against a merge commit whose base half is now 1,527 commits old.</strong> It is not wrong — it faithfully reports that the merge <em>as of 22 June</em> was fine. It simply has nothing to say about merging this PR today. And <code>mergeable_state: unknown</code> is GitHub telling you it has not even recomputed whether the merge is still possible; it does that lazily, when something asks.</p>
</div>

<p>This is the practical rule that follows: <strong>a PR&#39;s green tick ages, and the rate it ages at is the rate the base branch moves.</strong> On a quiet repository a week-old tick is fine. On this one, 1,527 commits in two months, a tick from June is decoration. Branch protection has a setting for exactly this — "Require branches to be up to date before merging" — which forces the PR to absorb the base before the tick counts. It costs a re-run on every merge into the base, which is why it is off by default and why busy repositories turn it on anyway.</p>

<h3><code>pull_request_target</code>, and the reason it exists</h3>
${slide('ga-01', 24, 'pull_request_target + checkout of head.sha = leaked secrets')}

<p>A PR from a fork is code written by somebody who does not have write access to your repository. If CI ran that code with your secrets, the fork author would have your secrets. So GitHub does not: on a <code>pull_request</code> run from a fork, <code>GITHUB_TOKEN</code> is read-only and repository secrets are <strong>not</strong> passed.</p>

<p>That is safe and it is also inconvenient — a labeller bot, a benchmark that posts a comment, a preview deployment all need write access. <code>pull_request_target</code> is the answer: it runs <strong>the workflow file from the base branch</strong>, in the context of the base branch, with full secrets. Three combinations, measured on a rig where the base has a harmless <code>postinstall</code> script and the PR branch rewrites that same script to print a secret:</p>

<div class="out">############ 1. pull_request (checkout mac dinh) ############
[pr] sau-cai: DEPLOY_KEY = (khong thay)

############ 2. pull_request_target (checkout mac dinh) ############
[base] sau-cai: khong lam gi ca

############ 3. pull_request_target + checkout ref: head.sha ############
[pr] sau-cai: DEPLOY_KEY = sk-that-su-cua-production-9f2a</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — <code>pull_request</code></span><span class="lz-lnote">runs the PR&#39;s code, with NO secrets. The attacker&#39;s script executes and finds nothing. This is the safe default and it is why the default exists</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code>, default checkout</span><span class="lz-lnote">runs the BASE&#39;s code, WITH secrets. The attacker&#39;s script never executes at all — checkout took the base tree. Also safe</span></div>
<div class="lz-layer"><span class="lz-lname">3 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">runs the PR&#39;s code, WITH secrets. The attacker&#39;s script executes AND finds the key. This single added line is the entire vulnerability</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the line that turns a convenience into a compromise.</strong> Combination 2 is useless for most real jobs: you wanted <code>pull_request_target</code> so you could <em>build the PR</em>, and the base checkout does not contain the PR. So the obvious next step is to add <code>ref: &#36;{{ github.event.pull_request.head.sha }}</code>, and that step produces combination 3. It is obvious, it is what a search result will show you, and it hands an arbitrary stranger a shell with your production credentials in the environment. Note also that nothing in the attack required a malicious <em>workflow</em> — the workflow file came from the base branch, untouched. Editing one already-trusted script was enough.</p>
</div>

<h3>What to do instead</h3>
<div class="kv-grid">
<div class="kv"><span class="k">need nothing privileged</span><span class="v">use <code>pull_request</code>. Lint, typecheck, tests. This is the overwhelming majority of CI and it needs no secrets at all</span></div>
<div class="kv"><span class="k">need to write a comment or label</span><span class="v">split it: <code>pull_request</code> builds and uploads a report as an artifact, then a separate <code>workflow_run</code> workflow — which runs from the base and never checks out PR code — reads the artifact and posts</span></div>
<div class="kv"><span class="k">must use <code>pull_request_target</code></span><span class="v">never check out PR code in it. If you truly must, gate on a maintainer-applied label and <code>environment:</code> approval, scope <code>permissions:</code> to the minimum, and treat every secret it touches as one PR away from public</span></div>
<div class="kv"><span class="k">building this repository&#39;s workflows</span><span class="v">this is not hypothetical for you today: <strong>0 of 11</strong> workflows here use <code>pull_request_target</code>, and the one <code>pull_request</code> workflow needs no secrets. Keep it that way</span></div>
</div>

<h3>What this repository actually does</h3>
<div class="out">pull_request_target       : 0 / 11 workflow
permissions: khai tuong minh: 1 / 11 (chi deploy-ghcr.yml)
ci-lint.yml on pull_request: branches: [main], KHONG co paths:
8 lan chay pull_request tong cong, tat ca success</div>

<p>One line there is a deliberate choice worth naming. <code>ci-lint.yml</code> has a <code>paths:</code> filter on its <code>push</code> trigger but <strong>not</strong> on its <code>pull_request</code> trigger. That asymmetry looks like an oversight and is the opposite — it is the fix for a failure mode that lesson 1.5 measures.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>pull_request</code> tests a commit that exists nowhere but GitHub&#39;s servers, made of your branch plus the base as it stood at some past moment — which is the right thing to test, and is also why a green tick is a statement with an expiry date on it.</p>
</div>

<h3>Keeping the green tick honest: up-to-date branches and the merge queue</h3>
<p>Lesson 1.4&#39;s problem has two standard answers, and interviewers like to hear both:</p>
<table>
<thead><tr><th>Option</th><th>What it guarantees</th><th>What it costs</th></tr></thead>
<tbody>
<tr><td><strong>Require branches to be up to date before merging</strong> (branch protection / ruleset)</td><td>the tick was computed against the current base</td><td>every merge to <code>main</code> forces every open PR to update and re-run; on a busy repo, PRs race each other</td></tr>
<tr><td><strong>Merge queue</strong></td><td>GitHub builds a temporary branch = base + queued PRs, runs checks on it, merges only if green</td><td>workflows must also listen to the <code>merge_group</code> event — otherwise the required check never reports and the merge fails</td></tr>
<tr><td>neither</td><td>the tick is "green as of when it ran"</td><td>occasional red <code>main</code> after a clean merge — this lesson&#39;s scenario</td></tr>
</tbody>
</table>
<pre><code class="language-yaml">on:
  pull_request:
    branches: [main]
  merge_group:            # required once the repository uses a merge queue
    types: [checks_requested]</code></pre>
<p>(GitHub Docs, "Events that trigger workflows: merge_group", as of 09/2026: the event runs with <code>GITHUB_SHA</code> = the merge group&#39;s commit, and "the merge will fail as the required status check will not be reported" if you forget it.)</p>

<h3>Run it step by step on your own repository</h3>
<pre><code class="language-bash"># 1. base: a function and its test, plus a workflow on push + pull_request
git switch main
#    lib/calc.js: function calc(a, b) {...}   tests/calc.test.js
git commit -am "calc(a, b)" &amp;&amp; git push

# 2. feature branch cut NOW, adds a new file that calls calc(x, y)
git switch -c bao-cao
#    lib/bao-cao.js + tests/bao-cao.test.js
git add . &amp;&amp; git commit -m "tongDon" &amp;&amp; git push -u origin bao-cao

# 3. meanwhile, main changes the signature and ITS OWN test
git switch main
#    calc({ a, b }) ...
git commit -am "calc({a,b})" &amp;&amp; git push

# 4. open the PR and compare the three runs
gh pr create --base main --head bao-cao --fill
gh pr checks
git fetch origin "pull/$(gh pr view --json number --jq .number)/merge" &amp;&amp; git log --oneline --graph -4 FETCH_HEAD</code></pre>

<h3>When to check out <code>head.sha</code> on purpose — and when not</h3>
<div class="kv-grid">
<div class="kv"><span class="k">keep the default (merge commit)</span><span class="v">tests, type checks, builds that decide "can this be merged?" — that is the question the merge commit answers</span></div>
<div class="kv"><span class="k">use <code>head.sha</code></span><span class="v">anything that must name a real, reachable commit: preview deployments, container tags, status reports back to the exact commit the author pushed</span></div>
<div class="kv"><span class="k">never under <code>pull_request_target</code></span><span class="v">checking out <code>head.sha</code> there runs untrusted code with secrets — combination 3 above</span></div>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Your PR was green, you merged it, and main went red. How is that possible?</strong><br>A: The PR run tested a merge commit of the PR with the base <em>as it was then</em>. The base moved (or another PR merged) and the new combination breaks — often a contract between files that were never edited together, so git sees no conflict. Fix with "require up to date" or a merge queue (and add <code>merge_group</code> to the workflow).</p>
<p><strong>Q: What is <code>github.sha</code> on a <code>pull_request</code> run?</strong><br>A: The sha of <code>refs/pull/N/merge</code>, a merge commit GitHub creates; <code>github.event.pull_request.head.sha</code> is the branch tip and <code>github.head_ref</code> is its name.</p>
<p><strong>Q: Why is <code>pull_request_target</code> dangerous?</strong><br>A: It runs the base branch&#39;s workflow with secrets and a write token. That is safe until the workflow checks out and executes the PR&#39;s code (e.g. <code>ref: head.sha</code> then <code>npm install</code>) — then any fork can run code with your secrets ("pwn request").</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate says "my branch is green and there are no conflicts, so it is safe to merge". Show them, with links, why that is not the same statement as "main will be green".</p><ol>
<li>Follow "Run it step by step" above on your practice repository (base changes a signature, feature branch only adds a caller).</li>
<li>Make the workflow print <code>$GITHUB_SHA</code>, <code>&#36;{{ github.event.pull_request.head.sha }}</code> and <code>$GITHUB_REF</code>.</li>
<li>Open the PR and run <code>gh pr checks</code>. Note how many rows share the same check name.</li>
<li>Fetch <code>pull/N/merge</code> locally and show its two parents with <code>git log --graph</code>.</li>
<li>Open a second PR that edits the same line as the base. Wait a minute and confirm no <code>pull_request</code> run appears; then close both PRs.</li></ol>
<p><strong>Done when:</strong> you have one red pull_request run whose <code>GITHUB_SHA</code> differs from <code>head.sha</code>, two green push runs, a local graph showing the merge commit&#39;s parents, and a conflicting PR with zero runs.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge commit</span><span class="v">A commit with two parents that joins two histories; for PRs GitHub creates one at <code>refs/pull/N/merge</code>.</span></div>
  <div class="kv"><span class="k">Head / base</span><span class="v">Head = the PR&#39;s branch (where changes come from); base = the branch it wants to merge into.</span></div>
  <div class="kv"><span class="k"><code>refs/pull/N/merge</code></span><span class="v">The ref GitHub publishes for the test merge of PR number N; what <code>pull_request</code> checks out.</span></div>
  <div class="kv"><span class="k">Required status check</span><span class="v">A check that must pass before a PR can merge (branch protection / rulesets).</span></div>
  <div class="kv"><span class="k">Merge queue</span><span class="v">GitHub feature that tests base + queued PRs together before merging; needs the <code>merge_group</code> trigger.</span></div>
  <div class="kv"><span class="k"><code>pull_request_target</code></span><span class="v">PR trigger that runs the BASE branch&#39;s workflow with secrets — safe only if it never runs PR code.</span></div>
  <div class="kv"><span class="k">Shallow clone</span><span class="v"><code>fetch-depth: 1</code>: only the tip commit, no parents — diffs and history are empty unless you fetch more.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>pull_request</code> runs on a merge commit GitHub builds (<code>refs/pull/N/merge</code>), not on your branch — reproduced on GitHub: two green branches, clean merge, red PR run.</li>
<li><code>github.sha</code> = merge commit; <code>head.sha</code> = your branch tip; <code>github.ref</code> = <code>refs/pull/N/merge</code>; <code>github.head_ref</code> = branch name.</li>
<li>The API and <code>gh pr checks</code> file the run under the head sha, and a push run on the same sha appears as a second row with the same name.</li>
<li>A conflicting PR has no merge commit, so no <code>pull_request</code> run at all — the required check waits forever.</li>
<li>A green tick ages as the base moves; "require up to date" or a merge queue (+ <code>merge_group</code>) keeps it honest.</li>
<li><code>pull_request_target</code> + checkout of the PR&#39;s code = secrets for any fork. Keep PR code under <code>pull_request</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: pull_request</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request — states the merge-commit behaviour and the fork permission rules. The merge-commit sentence is one line long and is the single most consequential line on the page.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — Keeping your GitHub Actions and workflows secure: Preventing pwn requests</span><span class="lc-sub">securitylab.github.com/resources/github-actions-preventing-pwn-requests/ — the original write-up of combination 3, by the team that found it in the wild. The artifact + workflow_run split recommended above comes from here.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README, the <code>ref</code> input</span><span class="lc-sub">github.com/actions/checkout#usage — documents that the default ref is the SHA that triggered the workflow, and carries its own warning against checking out untrusted code under pull_request_target.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-merge(1) — the --no-ff flag and two-parent commits</span><span class="lc-sub">git-scm.com/docs/git-merge — what GitHub is actually running to produce refs/pull/N/merge, and why HEAD^1 and HEAD^2 mean what they mean.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — merge commits, two parents, and reading history</span><span class="lc-sub">/courses/git/learn${REF} — the merge machinery underneath this lesson, including why a clean merge and a correct merge are different claims.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2><code>pull_request</code> chạy trên một commit KHÔNG nằm trên nhánh bạn</h2>
<p class="lead">Bạn đẩy một nhánh, mở PR, CI xanh. Đọc cái dấu tick ấy thành "nhánh của tôi qua được" là phản xạ tự nhiên. Nó KHÔNG nói thế. Nó nói một câu hẹp hơn và hữu ích hơn, và khoảng cách giữa hai câu ấy là nơi cả một họ sự cố vỡ-main sinh sống.</p>

<h3>Câu hỏi, phát biểu cho chính xác</h3>
${slide('ga-01', 19, 'pull_request chạy trên commit THỨ BA — không phải nhánh bạn')}
<p>Khi một sự kiện <code>pull_request</code> nổ và <code>actions/checkout</code> chạy, <strong>commit nào rơi vào thư mục làm việc?</strong> Ba ứng viên đều nghe hợp lý:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">ứng viên</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">đầu nhánh của tôi</span><span class="lz-nsub">cái tôi đã đẩy, cái tôi đã thử ở máy, cái trang PR hiện ra là commit mới nhất</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">đầu nhánh gốc</span><span class="lz-nsub">main như nó đang có, hoàn toàn không có thay đổi của tôi</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">một bản gộp của hai cái</span><span class="lz-nsub">một commit không ai viết, không nằm trên nhánh nào, do GitHub tạo ra cho đúng việc này</span></div></div>
</div>
</div>

<p>Là cái thứ ba. GitHub tính <code>git merge --no-ff</code> nhánh bạn vào nhánh gốc rồi công bố kết quả dưới tên <code>refs/pull/&lt;N&gt;/merge</code>. Chính commit đó được job lấy về, và sha của nó là thứ nằm trong <code>&#36;{{ github.sha }}</code>.</p>

<h3>Vì sao chỗ phân biệt ấy không phải chuyện hàn lâm</h3>
<p>Đây là một bộ đồ nghề dựng ra để cho thấy khác biệt đó. Nhánh gốc có một hàm và một bài kiểm cho nó. Nhánh PR <strong>chỉ thêm một file mới</strong> cùng bài kiểm của riêng nó — nó không đụng một file nào mà nhánh gốc đụng. Trong lúc đó nhánh gốc đổi chữ ký của hàm ấy và sửa <em>bài kiểm của chính nó</em> cho khớp:</p>

<pre><code><span class="tok-comment"># main: chu ky cu</span>
function calc(a, b) { return a + b; }

<span class="tok-comment"># nhanh PR: CHI THEM file moi, goi ham theo chu ky cu</span>
function orderTotal(x, y) { return calc(x, y); }

<span class="tok-comment"># main (trong luc do): doi chu ky, va sua test CUA CHINH NO</span>
function calc({ a, b }) { return a + b; }</code></pre>

<p>Không file nào bị sửa ở cả hai phía, nên xét về mặt chữ, bản gộp sạch. Bây giờ chạy đúng một bộ kiểm ấy ở cả ba chỗ:</p>

<div class="out">######## A. CHAY TREN DAU NHANH PR (cai ban thay o local) ########
  xanh: thu-bao-cao
  xanh: thu-tinh
CI XANH
exit=0

######## B. CHAY TREN MAIN (khong co PR) ########
  xanh: thu-tinh
CI XANH
exit=0

######## C. MERGE COMMIT — cai ma pull_request THUC SU chay ########
gop: SACH, khong xung dot
GITHUB_SHA      = ebf646c58c6dfcf24ba494d6d7fca4e16f914698
  ^1 (base)     = 4455dae17852942087937e976f117b6b465f6407
  ^2 (dau PR)   = f1f968b0ebb224829e605d94db8c9d2636937728
  HONG: thu-bao-cao.js - tongDon(10,20) = NaN, mong doi 30
  xanh: thu-tinh
CI DO (1 hong)
exit=1</div>

<div class="callout warn">
<p><strong>Cả hai nhánh đều xanh. Bản gộp không xung đột. Kết quả ĐỎ.</strong> Không có thao tác quản lý phiên bản nào có thể cảnh báo bạn: việc của git là hoà giải <em>chữ</em>, và chữ hoà giải hoàn hảo. Cái vỡ là một khế ước giữa hai file chưa bao giờ được sửa cùng nhau. Chỉ chạy cái cây ĐÃ GỘP mới tìm ra, và chạy cái cây đã gộp đúng là việc <code>pull_request</code> làm.</p>
</div>

<p>Đọc lại mấy cái sha trong khối C. Merge commit có <strong>hai cha</strong>, và điều đáng chú ý là không cha nào là commit bạn sẽ đoán:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">^1</span><span class="lz-t">4455dae1 — nhánh gốc</span><span class="lz-d">đầu <code>main</code> tại thời điểm merge ref được tính</span></div>
<div class="lz-step"><span class="lz-k">^2</span><span class="lz-t">f1f968b0 — nhánh bạn</span><span class="lz-d">commit trang PR hiện ra, cái bạn đã đẩy</span></div>
<div class="lz-step"><span class="lz-k">chính nó</span><span class="lz-t">ebf646c5 — GITHUB_SHA</span><span class="lz-d">không nằm trên nhánh nào, không có trong bản sao của ai, và nó là thứ CI đã phán</span></div>
</div>


${slide('ga-01', 20, 'Hai nhánh xanh, gộp sạch — lần chạy pull_request ĐỎ')}
<p><strong>Đã tái hiện trên chính GitHub, ngày 24/09/2026.</strong> Bộ đồ nghề ở trên chạy trên máy. Sau đó đúng ba tệp ấy được đẩy lên sân tập: nhánh gốc <code>ch01-workflow</code> đổi <code>calc(a, b)</code> thành <code>calc({ a, b })</code> và sửa bài kiểm của CHÍNH NÓ; nhánh <code>ch01-pr-bao-cao</code>, rẽ ra TRƯỚC thay đổi đó, chỉ thêm <code>lib/bao-cao.js</code> cùng bài kiểm của nó. Một workflow chạy test khi <code>push</code> lên cả hai nhánh và khi <code>pull_request</code>. Rồi <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/1" target="_blank" rel="noopener">PR #1</a> được mở (và đóng lại sau khi ghi xong):</p>
<div class="out">run          su kien        commit              ket qua
35986530494  push           93c3050 (nhanh goc)  xanh: calc.test.js              CI XANH
35986526254  push           e1459aa (nhanh PR)   xanh: bao-cao.test.js, calc     CI XANH
35986554816  pull_request   0815f9a (merge)      HONG: bao-cao.test.js
                                                 tongDon(10,20) = NaN, mong doi 30  CI DO</div>
<p>Hai run xanh, một run đỏ, và run đỏ nằm trên một commit KHÔNG AI push. Mở ba đường dẫn (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986530494" target="_blank" rel="noopener">nhánh gốc</a>, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986526254" target="_blank" rel="noopener">nhánh PR</a>, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986554816" target="_blank" rel="noopener">pull_request</a>) là cả bài học nằm trước mắt bạn.</p>
<h3>Cái sha API cho bạn xem KHÔNG phải cái sha job nhìn thấy</h3>
${slide('ga-01', 21, 'GITHUB_SHA là merge commit; head.sha mới là nhánh bạn')}
<p>Log của job trong run đỏ đó, cộng hai câu hỏi gửi API sau đó:</p>
<div class="out">su kien     = pull_request
GITHUB_REF  = refs/pull/1/merge
GITHUB_SHA  = 0815f9af01e8c0b24d39825dcb5f802b4e62ec7c
head.sha    = e1459aae73936edd84bd618bcab9422ae46e56a3
base.sha    = 93c30503ebacb40a2254851a26f34ea603682806
HEAD        = 0815f9af01e8c0b24d39825dcb5f802b4e62ec7c
parents     =

$ gh api repos/cuonghoang1103/ga-san-tap/commits/0815f9a --jq '.commit.message, .parents[].sha'
Merge e1459aae73936edd84bd618bcab9422ae46e56a3 into 93c30503ebacb40a2254851a26f34ea603682806
93c30503ebacb40a2254851a26f34ea603682806
e1459aae73936edd84bd618bcab9422ae46e56a3

$ gh pr checks 1
test  fail  4s  .../actions/runs/35986554816
test  pass  7s  .../actions/runs/35986526254</div>
${slide('ga-01', 22, 'API xếp run vào head.sha — job lại kiểm merge commit')}
<p>Ba chi tiết trong output ấy đáng nhìn lần hai:</p>
<ul>
<li><strong><code>parents =</code> TRỐNG bên trong job.</strong> <code>actions/checkout</code> tải với <code>fetch-depth: 1</code>, nên git trên runner thấy merge commit nhưng KHÔNG thấy cha của nó. Nếu một bước cần so với nhánh gốc (file đã đổi, thông điệp commit), hãy tải thêm lịch sử (<code>fetch-depth: 0</code>, hoặc tải riêng sha gốc) — không thì cái "diff" rỗng một cách âm thầm.</li>
<li><strong>Thông điệp commit là "Merge e1459aa… into 93c3050…"</strong> và tác giả là GitHub. Nó chỉ tồn tại dưới tên <code>refs/pull/1/merge</code>; <code>git fetch origin pull/1/merge</code> kéo nó về máy bạn nếu muốn tái hiện một lỗi PR tại chỗ.</li>
<li><strong><code>gh pr checks</code> hiện HAI dòng tên <code>test</code></strong>: run push trên nhánh (xanh) và run pull_request trên bản gộp (đỏ). Cả hai gắn vào PR vì cùng chạy trên một head sha. Đọc dòng xanh rồi gộp chính là sai lầm mà bài này nói tới.</li>
</ul>

<p>Đây là chỗ sự nhầm lẫn thành cụ thể. Hỏi API về một lần chạy <code>pull_request</code> thật của kho này rồi đối chiếu với chính cái PR:</p>

<div class="out">run 27990511412 (PR #4) head_sha = 3220149d38388b8f8173e1e2d9312ae7739860a6
PR #4 head.sha (API)             = 3220149d38388b8f8173e1e2d9312ae7739860a6  <- GIONG NHAU
PR #4 mergeable_state            = unknown  <- GitHub tinh LUOI, chi tinh khi co nguoi HOI</div>

<p><code>head_sha</code> của lần chạy đúng bằng đầu nhánh của PR. Nên mọi công cụ đọc API — bảng điều khiển, huy hiệu, bot, và script của chính bạn — đều báo lần chạy ấy là <em>về</em> đầu nhánh bạn. Bên trong job, <code>&#36;{{ github.sha }}</code> là một sha hoàn toàn khác, và nó KHÔNG xuất hiện ở đâu trong bản ghi API của lần chạy. Hai cách nhìn nhất quán về cùng một lần chạy, bất đồng về việc cái gì đã được kiểm.</p>

<div class="kv-grid">
<div class="kv"><span class="k">muốn merge commit</span><span class="v"><code>&#36;{{ github.sha }}</code> — mặc định, thứ checkout lấy khi không có <code>ref:</code></span></div>
<div class="kv"><span class="k">muốn đầu nhánh của bạn</span><span class="v"><code>&#36;{{ github.event.pull_request.head.sha }}</code> — truyền tường minh vào <code>ref:</code></span></div>
<div class="kv"><span class="k">muốn đầu nhánh gốc</span><span class="v"><code>&#36;{{ github.event.pull_request.base.sha }}</code></span></div>
<div class="kv"><span class="k">muốn TÊN nhánh</span><span class="v"><code>&#36;{{ github.head_ref }}</code>. <code>&#36;{{ github.ref }}</code> trên một PR là <code>refs/pull/&lt;N&gt;/merge</code> — không phải tên nhánh, và nó sẽ làm bất ngờ mọi thứ đem so khớp chuỗi với nó</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — gắn nhãn hay công bố bằng <code>github.sha</code> trên lần chạy PR.</strong> Một bước làm <code>docker build -t app:&#36;{{ github.sha }}</code> sẽ, trên một PR, đẻ ra một ảnh mang nhãn là merge commit — thứ sẽ không bao giờ tồn tại lại một khi PR cập nhật. Không tái lập được, không với tới được từ nhánh nào, và sau khi PR gộp thì cái nhãn ấy ứng với hư không. Trên lần chạy PR hãy gắn nhãn bằng <code>head.sha</code>, hoặc đừng công bố gì từ lần chạy PR cả.</p>
</div>

<h3>Khi bản gộp không tồn tại thì KHÔNG có gì chạy — và cũng không có gì báo</h3>
${slide('ga-01', 23, 'Xung đột ⇒ không có merge commit ⇒ không có lần chạy')}
<p>Cũng đã tái hiện: <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/2" target="_blank" rel="noopener">PR #2</a> sửa đúng dòng của <code>lib/calc.js</code> mà nhánh gốc đã sửa.</p>
<div class="out">$ gh pr view 2 --json mergeable,mergeStateStatus
{"mergeStateStatus":"DIRTY","mergeable":"CONFLICTING", ...}
$ gh api repos/cuonghoang1103/ga-san-tap/pulls/2 --jq '{merge_commit_sha, mergeable_state}'
{"merge_commit_sha":null,"mergeable_state":"dirty"}
$ gh run list -L 5 --json workflowName,headBranch,event     # 60 giay sau khi mo PR
ch01 test   ch01-pr-bao-cao   pull_request     &lt;- cua PR #1, khong phai PR #2
ch01 test   ch01-workflow     push
...                                             # 0 lan chay nao cho ch01-pr-xung-dot</div>
<p>Tài liệu nói trong một dòng: "Workflow sẽ không chạy với hoạt động <code>pull_request</code> nếu pull request có xung đột gộp." Để ý rằng ô kiểm DUY NHẤT trên PR #2 là của một ứng dụng bên thứ ba (bộ quét bí mật) — khiến PR thoạt nhìn như "đã được kiểm" dù CI chưa hề khởi động.</p>

<p>Vẫn bộ đồ nghề ấy, đổi một chỗ: cho hai phía cùng sửa một file để bản gộp xung đột thật.</p>

<div class="out">Auto-merging thu.js
CONFLICT (content): Merge conflict in thu.js
Automatic merge failed; fix conflicts and then commit the result.

git rev-parse HEAD -> van la main, KHONG co commit nao duoc tao</div>

<p>Không có merge commit để lấy về, nên GitHub không xếp hàng lần chạy nào. Hệ quả trên trang PR rất đặc trưng và đáng nhận ra ngay khi nhìn: ô kiểm KHÔNG đỏ. Cũng KHÔNG xanh. Nó nằm ở <strong>"Expected — Waiting for status to be reported"</strong>, vô thời hạn, và nếu đó là một ô kiểm bắt buộc thì PR không gộp được mà chẳng có cú hỏng nào để bấm vào xem.</p>

<div class="callout">
<p><strong>Quy tắc nhận dạng.</strong> Một ô kiểm <em>treo mãi</em> trên PR gần như không bao giờ là runner kẹt. Nó là một trong ba thứ: bản gộp xung đột (không có merge ref để chạy), một bộ lọc đường dẫn hay nhánh đã loại PR này ra (bài 1.5), hoặc một ô kiểm bắt buộc mà workflow của nó không còn tồn tại. Cả ba đều là cấu hình, và không cái nào đẻ ra một dòng log để đọc.</p>
</div>

<h3>Một dấu tick xanh cũ được tới đâu</h3>
<p>PR #4 của kho này vẫn đang mở. Lần chạy CI cuối của nó thành công. Đây là những gì đã xảy ra với nhánh gốc bên dưới nó kể từ đó:</p>

<div class="out">PR #4: mo 22/06/2026, base luc do = dda544e7, dau nhanh = 3220149d
lan chay ci-lint cuoi: 27990511412, 22/06/2026, ket qua: success

main tu do toi nay (24/08/2026) da di them:
  1527 commit
  5315 file thay doi
  +1.214.424 / -14.703 dong</div>

<div class="callout warn">
<p><strong>Cái tick xanh ấy được tính trên một merge commit mà nửa gốc của nó nay đã cũ 1.527 commit.</strong> Nó không sai — nó tường thuật trung thực rằng bản gộp <em>tính tới 22/06</em> ổn. Nó chỉ đơn giản là không có gì để nói về việc gộp PR này HÔM NAY. Và <code>mergeable_state: unknown</code> là GitHub đang nói với bạn rằng nó còn chưa tính lại xem bản gộp có còn khả thi không; nó tính lười, khi nào có thứ gì hỏi tới.</p>
</div>

<p>Từ đó ra quy tắc dùng được: <strong>dấu tick xanh của một PR CÓ TUỔI, và nó già đi với tốc độ mà nhánh gốc di chuyển.</strong> Ở một kho im ắng, một cái tick một tuần tuổi vẫn ổn. Ở kho này, 1.527 commit trong hai tháng, một cái tick từ tháng Sáu là đồ trang trí. Branch protection có đúng một tuỳ chọn cho chuyện này — "Require branches to be up to date before merging" — bắt PR phải hấp thụ nhánh gốc trước khi cái tick được tính. Cái giá là một lượt chạy lại cho mỗi lần gộp vào nhánh gốc, đó là lý do nó tắt mặc định và cũng là lý do các kho bận rộn vẫn bật.</p>

<h3><code>pull_request_target</code>, và lý do nó tồn tại</h3>
${slide('ga-01', 24, 'pull_request_target + checkout head.sha = lộ bí mật')}

<p>Một PR từ fork là mã do một người KHÔNG có quyền ghi vào kho bạn viết. Nếu CI chạy mã đó với bí mật của bạn, thì tác giả fork có bí mật của bạn. Nên GitHub không làm thế: trong một lần chạy <code>pull_request</code> đến từ fork, <code>GITHUB_TOKEN</code> chỉ đọc và bí mật của kho <strong>không</strong> được truyền vào.</p>

<p>Điều đó an toàn và cũng bất tiện — một bot gắn nhãn, một phép đo hiệu năng có bình luận kết quả, một bản dựng xem thử đều cần quyền ghi. <code>pull_request_target</code> là câu trả lời: nó chạy <strong>tệp workflow của nhánh gốc</strong>, trong ngữ cảnh nhánh gốc, với đầy đủ bí mật. Ba tổ hợp, đo trên một bộ đồ nghề mà nhánh gốc có một script <code>postinstall</code> vô hại còn nhánh PR viết lại đúng script ấy để in một bí mật ra:</p>

<div class="out">############ 1. pull_request (checkout mac dinh) ############
[pr] sau-cai: DEPLOY_KEY = (khong thay)

############ 2. pull_request_target (checkout mac dinh) ############
[base] sau-cai: khong lam gi ca

############ 3. pull_request_target + checkout ref: head.sha ############
[pr] sau-cai: DEPLOY_KEY = sk-that-su-cua-production-9f2a</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — <code>pull_request</code></span><span class="lz-lnote">chạy mã của PR, KHÔNG bí mật. Script của kẻ tấn công có chạy và không thấy gì. Đây là mặc định an toàn, và đó là lý do cái mặc định ấy tồn tại</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code>, checkout mặc định</span><span class="lz-lnote">chạy mã của NHÁNH GỐC, CÓ bí mật. Script của kẻ tấn công không hề chạy — checkout đã lấy cây của nhánh gốc. Cũng an toàn</span></div>
<div class="lz-layer"><span class="lz-lname">3 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">chạy mã của PR, CÓ bí mật. Script của kẻ tấn công vừa chạy VỪA thấy cái khoá. Đúng một dòng thêm vào ấy LÀ toàn bộ lỗ hổng</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái dòng biến một tiện lợi thành một cú thất thủ.</strong> Tổ hợp 2 vô dụng với phần lớn việc thật: bạn muốn <code>pull_request_target</code> để <em>dựng cái PR</em>, mà bản checkout nhánh gốc thì không chứa PR. Nên bước tiếp theo hiển nhiên là thêm <code>ref: &#36;{{ github.event.pull_request.head.sha }}</code>, và bước đó đẻ ra tổ hợp 3. Nó hiển nhiên, nó là thứ một kết quả tìm kiếm sẽ chỉ cho bạn, và nó trao cho một người lạ bất kỳ một cái shell với thông tin đăng nhập production nằm sẵn trong môi trường. Cũng để ý: cú tấn công KHÔNG cần một <em>workflow</em> độc hại nào — tệp workflow đến từ nhánh gốc, nguyên vẹn. Sửa một script vốn đã được tin tưởng là đủ.</p>
</div>

<h3>Thay vào đó thì làm gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">không cần quyền gì đặc biệt</span><span class="v">dùng <code>pull_request</code>. Lint, kiểm kiểu, chạy test. Đây là đại đa số CI và nó không cần bí mật nào cả</span></div>
<div class="kv"><span class="k">cần viết bình luận hay gắn nhãn</span><span class="v">tách đôi: <code>pull_request</code> dựng rồi tải kết quả lên dạng artifact, sau đó một workflow <code>workflow_run</code> riêng — chạy từ nhánh gốc và không bao giờ checkout mã PR — đọc artifact ấy rồi đăng</span></div>
<div class="kv"><span class="k">buộc phải dùng <code>pull_request_target</code></span><span class="v">đừng bao giờ checkout mã PR trong đó. Nếu thật sự buộc phải, hãy chốt bằng một nhãn do người bảo trì gắn cộng phê duyệt <code>environment:</code>, thu <code>permissions:</code> về mức tối thiểu, và coi mọi bí mật nó chạm tới là cách chỗ công khai đúng một cái PR</span></div>
<div class="kv"><span class="k">dựng workflow cho chính kho này</span><span class="v">chuyện này không hề giả định với bạn hôm nay: <strong>0 trên 11</strong> workflow ở đây dùng <code>pull_request_target</code>, và workflow <code>pull_request</code> duy nhất thì không cần bí mật nào. Cứ giữ nguyên như thế</span></div>
</div>

<h3>Kho này thực tế đang làm gì</h3>
<div class="out">pull_request_target       : 0 / 11 workflow
permissions: khai tuong minh: 1 / 11 (chi deploy-ghcr.yml)
ci-lint.yml on pull_request: branches: [main], KHONG co paths:
8 lan chay pull_request tong cong, tat ca success</div>

<p>Một dòng ở đó là lựa chọn có chủ ý, đáng gọi tên. <code>ci-lint.yml</code> có bộ lọc <code>paths:</code> trên kích hoạt <code>push</code> nhưng <strong>không</strong> có trên kích hoạt <code>pull_request</code>. Sự bất đối xứng ấy trông như sót, và nó là điều ngược lại — nó là phần vá cho một kiểu hỏng mà bài 1.5 sẽ đo.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>pull_request</code> kiểm một commit không tồn tại ở đâu ngoài máy chủ GitHub, làm bằng nhánh bạn cộng nhánh gốc như nó đứng tại một thời điểm đã qua — đó ĐÚNG là thứ cần kiểm, và cũng chính là lý do một dấu tick xanh là một lời khẳng định có ghi hạn dùng.</p>
</div>

<h3>Giữ cho dấu tick xanh trung thực: nhánh phải cập nhật, và hàng đợi gộp</h3>
<p>Vấn đề của bài 1.4 có hai lời giải chuẩn, và người phỏng vấn thích nghe cả hai:</p>
<table>
<thead><tr><th>Lựa chọn</th><th>Nó bảo đảm gì</th><th>Cái giá</th></tr></thead>
<tbody>
<tr><td><strong>Require branches to be up to date before merging</strong> (branch protection / ruleset)</td><td>dấu tick được tính trên nhánh gốc HIỆN TẠI</td><td>mỗi lần gộp vào <code>main</code> buộc mọi PR đang mở phải cập nhật và chạy lại; ở kho bận rộn, các PR đua nhau</td></tr>
<tr><td><strong>Merge queue (hàng đợi gộp)</strong></td><td>GitHub dựng một nhánh tạm = nhánh gốc + các PR đang xếp hàng, chạy kiểm trên đó, xanh mới gộp</td><td>workflow phải nghe thêm sự kiện <code>merge_group</code> — không thì ô kiểm bắt buộc không bao giờ báo và cú gộp thất bại</td></tr>
<tr><td>không dùng gì</td><td>dấu tick là "xanh tại lúc nó chạy"</td><td>thỉnh thoảng <code>main</code> đỏ sau một cú gộp sạch — đúng kịch bản của bài này</td></tr>
</tbody>
</table>
<pre><code class="language-yaml">on:
  pull_request:
    branches: [main]
  merge_group:            # bat buoc khi kho dung merge queue
    types: [checks_requested]</code></pre>
<p>(GitHub Docs, "Events that trigger workflows: merge_group", tính đến 09/2026: sự kiện chạy với <code>GITHUB_SHA</code> = commit của merge group, và "cú gộp sẽ thất bại vì ô kiểm bắt buộc không được báo cáo" nếu bạn quên nó.)</p>

<h3>Chạy thử từng bước trên kho của chính bạn</h3>
<pre><code class="language-bash"># 1. nhanh goc: mot ham va bai kiem cua no, kem workflow nghe push + pull_request
git switch main
#    lib/calc.js: function calc(a, b) {...}   tests/calc.test.js
git commit -am "calc(a, b)" &amp;&amp; git push

# 2. nhanh tinh nang re ra BAY GIO, them mot file moi goi calc(x, y)
git switch -c bao-cao
#    lib/bao-cao.js + tests/bao-cao.test.js
git add . &amp;&amp; git commit -m "tongDon" &amp;&amp; git push -u origin bao-cao

# 3. trong luc do, main doi chu ky va sua bai kiem CUA CHINH NO
git switch main
#    calc({ a, b }) ...
git commit -am "calc({a,b})" &amp;&amp; git push

# 4. mo PR va so ba lan chay
gh pr create --base main --head bao-cao --fill
gh pr checks
git fetch origin "pull/$(gh pr view --json number --jq .number)/merge" &amp;&amp; git log --oneline --graph -4 FETCH_HEAD</code></pre>

<h3>Khi nào CỐ Ý checkout <code>head.sha</code> — và khi nào KHÔNG</h3>
<div class="kv-grid">
<div class="kv"><span class="k">giữ mặc định (merge commit)</span><span class="v">test, kiểm kiểu, build để trả lời "cái này gộp được không?" — đó chính là câu hỏi merge commit trả lời</span></div>
<div class="kv"><span class="k">dùng <code>head.sha</code></span><span class="v">mọi thứ phải gọi tên một commit THẬT, với tới được: bản deploy xem thử, nhãn container, báo trạng thái về đúng commit tác giả đã push</span></div>
<div class="kv"><span class="k">không bao giờ dưới <code>pull_request_target</code></span><span class="v">checkout <code>head.sha</code> ở đó là chạy mã không tin cậy kèm bí mật — tổ hợp 3 ở trên</span></div>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: PR của bạn xanh, bạn gộp, và main đỏ. Sao có thể thế?</strong><br>Đ: Run của PR kiểm một merge commit giữa PR và nhánh gốc <em>như nó LÚC ĐÓ</em>. Nhánh gốc đã đi tiếp (hoặc một PR khác đã gộp) và tổ hợp mới thì vỡ — thường là khế ước giữa hai file chưa bao giờ được sửa cùng nhau, nên git không thấy xung đột nào. Sửa bằng "require up to date" hoặc merge queue (và thêm <code>merge_group</code> vào workflow).</p>
<p><strong>H: <code>github.sha</code> trên một run <code>pull_request</code> là gì?</strong><br>Đ: Sha của <code>refs/pull/N/merge</code>, một merge commit do GitHub tạo; <code>github.event.pull_request.head.sha</code> là đầu nhánh và <code>github.head_ref</code> là tên của nó.</p>
<p><strong>H: Vì sao <code>pull_request_target</code> nguy hiểm?</strong><br>Đ: Nó chạy workflow của nhánh GỐC kèm bí mật và token có quyền ghi. An toàn cho tới khi workflow checkout rồi CHẠY mã của PR (vd <code>ref: head.sha</code> rồi <code>npm install</code>) — khi đó bất kỳ fork nào cũng chạy được mã với bí mật của bạn ("pwn request").</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm nói "nhánh mình xanh và không xung đột, gộp an toàn". Hãy cho bạn ấy thấy, bằng đường dẫn cụ thể, vì sao câu đó KHÔNG cùng nghĩa với "main sẽ xanh".</p><ol>
<li>Làm theo "Chạy thử từng bước" ở trên trên kho thực hành (nhánh gốc đổi chữ ký, nhánh tính năng chỉ thêm chỗ gọi).</li>
<li>Cho workflow in <code>$GITHUB_SHA</code>, <code>&#36;{{ github.event.pull_request.head.sha }}</code> và <code>$GITHUB_REF</code>.</li>
<li>Mở PR và chạy <code>gh pr checks</code>. Ghi lại có bao nhiêu dòng mang cùng tên ô kiểm.</li>
<li>Kéo <code>pull/N/merge</code> về máy và cho thấy hai cha của nó bằng <code>git log --graph</code>.</li>
<li>Mở PR thứ hai sửa đúng dòng mà nhánh gốc đã sửa. Chờ một phút, xác nhận KHÔNG có run <code>pull_request</code> nào; rồi đóng cả hai PR.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một run pull_request đỏ mà <code>GITHUB_SHA</code> khác <code>head.sha</code>, hai run push xanh, một đồ thị trên máy cho thấy hai cha của merge commit, và một PR xung đột với 0 run.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge commit (commit gộp)</span><span class="v">Commit có hai cha, nối hai lịch sử; với PR, GitHub tạo một cái tại <code>refs/pull/N/merge</code>.</span></div>
  <div class="kv"><span class="k">Head / base (nhánh PR / nhánh gốc)</span><span class="v">Head = nhánh của PR (nơi thay đổi đi ra); base = nhánh nó muốn gộp vào.</span></div>
  <div class="kv"><span class="k"><code>refs/pull/N/merge</code></span><span class="v">Ref GitHub công bố cho bản gộp thử của PR số N; thứ <code>pull_request</code> checkout.</span></div>
  <div class="kv"><span class="k">Required status check (ô kiểm bắt buộc)</span><span class="v">Ô kiểm phải qua thì PR mới gộp được (branch protection / ruleset).</span></div>
  <div class="kv"><span class="k">Merge queue (hàng đợi gộp)</span><span class="v">Tính năng GitHub kiểm nhánh gốc + các PR xếp hàng CÙNG NHAU trước khi gộp; cần bộ kích hoạt <code>merge_group</code>.</span></div>
  <div class="kv"><span class="k"><code>pull_request_target</code></span><span class="v">Bộ kích hoạt PR chạy workflow của nhánh GỐC kèm bí mật — chỉ an toàn nếu KHÔNG BAO GIỜ chạy mã của PR.</span></div>
  <div class="kv"><span class="k">Shallow clone (bản sao nông)</span><span class="v"><code>fetch-depth: 1</code>: chỉ commit đầu mút, không có cha — diff và lịch sử rỗng trừ khi tải thêm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>pull_request</code> chạy trên một merge commit GitHub dựng (<code>refs/pull/N/merge</code>), không phải nhánh bạn — đã tái hiện trên GitHub: hai nhánh xanh, gộp sạch, run PR đỏ.</li>
<li><code>github.sha</code> = merge commit; <code>head.sha</code> = đầu nhánh bạn; <code>github.ref</code> = <code>refs/pull/N/merge</code>; <code>github.head_ref</code> = tên nhánh.</li>
<li>API và <code>gh pr checks</code> xếp run vào head sha, và một run push trên cùng sha hiện thành dòng thứ hai CÙNG TÊN.</li>
<li>PR xung đột không có merge commit, nên KHÔNG có run <code>pull_request</code> nào — ô kiểm bắt buộc chờ mãi.</li>
<li>Dấu tick xanh già đi khi nhánh gốc di chuyển; "require up to date" hoặc merge queue (+ <code>merge_group</code>) giữ nó trung thực.</li>
<li><code>pull_request_target</code> + checkout mã của PR = bí mật cho mọi fork. Giữ mã PR dưới <code>pull_request</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: pull_request</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request — phát biểu hành vi merge commit và luật quyền với fork. Câu về merge commit dài đúng một dòng và là dòng nặng hệ quả nhất trên cả trang.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — Preventing pwn requests</span><span class="lc-sub">securitylab.github.com/resources/github-actions-preventing-pwn-requests/ — bài viết gốc về tổ hợp 3, của chính đội đã bắt được nó ngoài thực địa. Cách tách artifact + workflow_run khuyến nghị ở trên lấy từ đây.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README, tham số <code>ref</code></span><span class="lc-sub">github.com/actions/checkout#usage — ghi rõ ref mặc định là sha đã kích hoạt workflow, và tự nó mang một lời cảnh báo về việc checkout mã không tin cậy dưới pull_request_target.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-merge(1) — cờ --no-ff và commit hai cha</span><span class="lc-sub">git-scm.com/docs/git-merge — đúng thứ GitHub đang chạy để đẻ ra refs/pull/N/merge, và vì sao HEAD^1 với HEAD^2 mang nghĩa như thế.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — merge commit, hai cha, và cách đọc lịch sử</span><span class="lc-sub">/courses/git/learn${REF} — bộ máy gộp nằm dưới bài này, gồm cả việc vì sao "gộp sạch" và "gộp đúng" là hai lời khẳng định khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Filters, and the 73.5% of commits that run no CI|||1.5 — Bộ lọc, và 73,5% commit không chạy CI nào',
      slug: 'ga-1-5-bo-loc',
      type: 'VIDEO',
      description: 'Đo 200 commit gần nhất trên main của kho này: 147 cái KHÔNG kích hoạt CI nào. Bộ lọc `paths:` không sai — nhưng cú hỏng thật duy nhất của tháng Bảy nằm trọn trong tập bị bỏ qua. Và `src/*` khớp 1 file, `src/**` khớp 353.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Filters, and the 73.5% of commits that run no CI</h2>
<p class="lead">Filters make CI cheaper by not running it. That is the whole point and it works. The question this lesson answers with numbers is: <em>on what, exactly, is it not running?</em> — because in this repository the answer turned out to include the one thing that actually broke.</p>

<h3>The four filters</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>branches:</code> / <code>branches-ignore:</code></span><span class="v">which branch the push or PR targets. On <code>pull_request</code> this filters the <strong>base</strong> branch — where the PR is going, not where it came from</span></div>
<div class="kv"><span class="k"><code>tags:</code> / <code>tags-ignore:</code></span><span class="v">only for <code>push</code>. Adding <code>tags:</code> and omitting <code>branches:</code> means branch pushes stop triggering entirely</span></div>
<div class="kv"><span class="k"><code>paths:</code> / <code>paths-ignore:</code></span><span class="v">which files the change touched. Any one match is enough to run</span></div>
<div class="kv"><span class="k">the pairing rule</span><span class="v">you cannot use <code>paths:</code> and <code>paths-ignore:</code> in the same event, nor <code>branches:</code> with <code>branches-ignore:</code>. Pick one side of each pair</span></div>
</div>

<h3>Measured on the sandbox: three commits, two filters</h3>
${slide('ga-01', 25, 'paths measured: 3 commits × 2 workflows')}
<p>Before reading a real repository&#39;s filter, watch the mechanism on a tiny one. The sandbox branch <code>ch01-workflow</code> has two workflows that differ in one character — <code>paths: ['app/**']</code> and <code>paths: ['app/*']</code>. Three commits were pushed one by one:</p>
<div class="out">commit    file doi                 paths: ['app/**']        paths: ['app/*']
2f4ef2a   docs/ghi-chu.md          -  khong chay            -  khong chay
8d5a151   app/con/sau.js           CHAY (35986372146)       -  KHONG chay
b7d67dd   app/tinh.js              CHAY (35986389132)       CHAY (35986389107)</div>
<p>The docs-only commit starts neither workflow — and leaves no trace: there is no "skipped" run to click, just nothing. The file one level down (<code>app/con/sau.js</code>) starts only the <code>**</code> workflow. Only a file directly inside <code>app/</code> starts both. (Links: <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986372146" target="_blank" rel="noopener">35986372146</a>, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986389107" target="_blank" rel="noopener">35986389107</a>.)</p>
${slide('ga-01', 27, 'branches filters the TARGET branch — a push elsewhere: 0 runs')}
<p>The <code>branches:</code> filter, same method. Every ch01 workflow says <code>branches: [ch01-workflow]</code>; the same kind of <code>app/</code> change pushed to a new branch starts nothing at all:</p>
<div class="out">$ git switch -c ch01-khac
$ git add app/khac.js &amp;&amp; git commit -m "app/khac.js tren nhanh ch01-khac"
$ git push -u origin ch01-khac
$ gh run list -b ch01-khac --json databaseId --jq length
0</div>
<p>One more observation from the same sandbox, and it surprises people: the very FIRST push of <code>ch01-workflow</code> started both path-filtered workflows, although that push contained nothing but new files. For a push that creates a branch, GitHub compares against "the parent of the ancestor of the deepest commit pushed" — here, <code>main</code> — so every file on the new branch counted as changed, including <code>app/README.md</code>.</p>
<h3>What this repository&#39;s filter actually filters</h3>
${slide('ga-01', 29, 'A filter does not hide a broken job — it hides a job that does not exist')}
<p><code>ci-lint.yml</code> is the only workflow here that runs on <code>push</code>, and it carries a <code>paths:</code> list:</p>

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
      <span class="tok-comment"># ... con 5 duong nua</span></code></pre>

<p>Rather than reason about whether that list is right, replay it. Take the last 200 commits on <code>main</code> and apply the patterns to each commit&#39;s file list:</p>

<div class="out">200 commit gan nhat tren main:
  KHOP bo loc paths (ci-lint CHAY):    53
  TRUOT bo loc     (ci-lint IM LANG):  147
  ty le im lang: 73.5%</div>

<div class="callout warn">
<p><strong>Just under three quarters of commits on the main branch trigger no CI at all.</strong> That is not a bug report yet — it might be exactly right. But it is a number worth knowing before you assume "main is green" means anything.</p>
</div>

<h3>Is it right? Look at what the skipped commits touch</h3>
<div class="out">147 commit bi bo qua dung vao dau (dem theo file):
  desktop/   297
  content/    84
  firmware/   46
  scripts/     2
  deploy-nha.sh  2
  .github/       1
  docker-compose.yml 1
  CLAUDE.md      1
  AGENTS.md      1</div>

<p>Now check that against what the job would have done anyway. The backend job runs <code>tsc --noEmit</code>, and the compiler&#39;s own scope is:</p>

<div class="out">include: ['src*']
exclude: ['node_modules', 'dist', 'prisma/seed.ts']
rootDir: ./src</div>

<div class="callout ok">
<p><strong>The filter is correctly scoped.</strong> <code>tsc</code> genuinely does not look at <code>desktop/</code>, <code>content/</code>, <code>firmware/</code> or <code>scripts/</code>, so running it on a commit that touches only those would burn two minutes to re-verify an unchanged tree. Those 147 skips are 147 correct decisions, and the person who wrote that list knew what the job checks.</p>
</div>

<h3>And yet</h3>
<p>The most expensive CI failure this repository has had was run <strong>32400097927</strong> — <code>vite build</code> exiting 134 with <code>Reached heap limit — JavaScript heap out of memory</code> on a macOS runner, during a desktop release. It built green in twenty seconds on the developer&#39;s own machine. It failed only on CI, only on macOS, and only at release time.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">where the break lived</span><span class="lz-t"><code>desktop/</code></span><span class="lz-d">297 of the 147 skipped commits&#39; files are in this directory</span></div>
<div class="lz-step"><span class="lz-k">what CI ran on it</span><span class="lz-t">nothing</span><span class="lz-d">no pattern in the <code>paths:</code> list matches <code>desktop/**</code></span></div>
<div class="lz-step"><span class="lz-k">when it surfaced</span><span class="lz-t">at release</span><span class="lz-d">the first time anything built that directory was a human pressing publish</span></div>
</div>

<div class="callout warn">
<p><strong>The filter is not wrong; the coverage is.</strong> Every pattern in that list is defensible. What is missing is a <em>second job</em> — one that builds <code>desktop/</code> — and a matching pattern for it. A <code>paths:</code> filter silently converts "we have no job for this directory" into "CI passed", and those two sentences look identical on the commit list. That is the failure mode worth carrying out of this lesson: filters do not hide broken jobs, they hide <strong>missing</strong> ones.</p>
</div>

<h3>The glob syntax, measured against the real file list</h3>
${slide('ga-01', 26, 'On the real repository: src/* matches 1 file, src/** matches 353')}
<p>The single most common filter bug is writing one asterisk where two are needed. Apply each pattern to this repository&#39;s actual tracked files:</p>

<div class="out">mau                so file khop   ghi chu
------------------------------------------------------------
src/**                      353
src/*                         1   <- CHI src/index.ts
src/*.ts                      1
src/**/*.ts                 353
**/*.ts                   1.039   <- ca kho
frontend/**               2.242
*.json                        5   <- chi thu muc goc
**/*.json                    93</div>

<div class="pitfall">
<p><strong>Trap — <code>src/*</code> is not "everything under src".</strong> A single <code>*</code> does not cross a <code>/</code>. In this repository <code>src/**</code> matches 353 files and <code>src/*</code> matches exactly one, because <code>src/index.ts</code> is the only file sitting directly in <code>src/</code>. Write <code>src/*</code> in a <code>paths:</code> filter and you have removed CI from 352 files — with no error, no warning, and a workflow that still runs often enough to look alive. The same trap turns <code>*.json</code> (5 files, root only) into something very different from <code>**/*.json</code> (93 files).</p>
</div>

<h3>The filter that stops a PR forever</h3>
${slide('ga-01', 28, 'paths on a PR + a required check = a PR stuck forever')}
<p>This is the reason for an asymmetry in the config above that looks like an oversight. Read the two triggers again:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>push:</code> has <code>paths:</code></span><span class="lz-lnote">correct — a push to main that touches nothing the job checks should not spend two minutes checking it</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pull_request:</code> has NO <code>paths:</code></span><span class="lz-lnote">also correct, and for a completely different reason</span></div>
</div>

<p>A <em>required</em> status check that never runs never reports. GitHub does not treat "this workflow was filtered out" as a pass — it treats it as a result that has not arrived. The PR sits at <strong>"Expected — Waiting for status to be reported"</strong> and cannot be merged, with no failing job to open and no log to read. Combine a <code>paths:</code> filter on <code>pull_request</code> with branch protection requiring that check, and every documentation-only PR is permanently unmergeable.</p>

<div class="callout">
<p><strong>The standard fix, when you do want path filtering on PRs.</strong> Drop <code>paths:</code> from the trigger and move the condition inside: keep the job always running, and let its <em>steps</em> decide. A job that starts, discovers nothing relevant changed, and exits 0 in eight seconds reports success — which is what branch protection needs. The dedicated tool is a changed-files action feeding an <code>if:</code> on the expensive steps; Chapter 3 builds that pattern properly. The cheap version is a first step that computes the diff and sets an output.</p>
</div>

<h3>Two limits, one of which does not apply here</h3>
<p>The documentation states that <code>paths</code> filtering only examines the first 3,000 changed files (older versions of the documentation, and of this lesson, said 300 — corrected on 24/09/2026 against the current page), and that a push of more than 1,000 commits always runs regardless of filters. Both are real. Whether they matter to you is measurable:</p>

<div class="out">commit lon nhat trong 200 commit gan nhat: 23 file
so commit vuot 300 file: 0 / 200</div>

<div class="callout ok">
<p><strong>A null result, reported as one.</strong> The file ceiling exists and is worth knowing, and in this repository it has not come close to biting — the largest commit in two hundred touched 23 files. It would matter to a monorepo doing generated-code commits or vendored dependency updates. Stating it as a live hazard here would be teaching a rule by a threat that the numbers say is not present.</p>
</div>

<h3>Tags, and a grep that lied</h3>
<p>Counting tag triggers in this repository looks like one command, and the obvious command gives the wrong answer:</p>

<div class="out">$ grep -l "tags:" .github/workflows/*.yml
.github/workflows/deploy-ghcr.yml        <- co ve nhu CO kich hoat theo tag</div>

<p>It does not. That match is inside a <code>docker/build-push-action</code> step, where <code>tags:</code> names the <em>Docker image tags</em> to push. Counting only inside the <code>on:</code> block gives the real number: <strong>0 of 11</strong> workflows here trigger on a tag.</p>

<div class="pitfall">
<p><strong>Trap — grepping a key name across YAML with no regard for nesting.</strong> <code>tags:</code>, <code>name:</code>, <code>env:</code>, <code>if:</code> and <code>permissions:</code> are all legal at several different depths with different meanings. A flat <code>grep</code> across workflow files answers a question you did not ask. Scope the search to the block you mean — and when a one-line grep produces a surprising claim about your own repository, that surprise is the signal to check it, not to write it down.</p>
</div>

<p>One more thing falls out of that same file. <code>deploy-ghcr.yml</code> tags its images with <code>&#36;{{ github.sha }}</code>, which lesson 1.4 named as a pitfall on PR runs. It is safe here for a reason that has nothing to do with the tag: the workflow is <code>workflow_dispatch:</code> only, so it can never run on a pull request, so <code>github.sha</code> is always a real branch commit. The hazard was avoided by the trigger configuration, not by the variable choice — which is exactly the kind of accidental safety that stops being safe the moment somebody adds a <code>pull_request:</code> trigger to that file.</p>

<div class="callout ok">
<p><strong>What to take away.</strong> Filters are an economic decision that reads as a correctness one. Before adding <code>paths:</code>, replay it over your last two hundred commits — the command is short and the number is usually surprising. Then ask the second question, which is the one that matters: of the directories this filter excludes, which ones have <em>no job at all</em>?</p>
</div>

<h3>How GitHub decides which files "changed"</h3>
<p>Every <code>paths</code> result depends on a diff GitHub computes before any job starts. The rules, from the current documentation (09/2026), with what each means in practice:</p>
<table>
<thead><tr><th>Situation</th><th>Diff GitHub uses</th><th>Consequence</th></tr></thead>
<tbody>
<tr><td>push to an existing branch</td><td>two-dot: old tip ↔ new tip</td><td>only what this push changed</td></tr>
<tr><td>push that creates a branch</td><td>two-dot against the parent of the deepest pushed commit</td><td>often "everything differs from main" — both sandbox filters fired</td></tr>
<tr><td>pull request</td><td>three-dot: PR tip ↔ merge base with the base branch</td><td>all files the PR changes so far, not just the last push</td></tr>
<tr><td>no files changed</td><td>—</td><td>the workflow does not run</td></tr>
<tr><td>more than 1,000 commits in one push, or the diff times out</td><td>—</td><td>the workflow ALWAYS runs</td></tr>
<tr><td>diff over 3,000 files and your matches are not among the first 3,000</td><td>—</td><td>the workflow does NOT run</td></tr>
</tbody>
</table>

<h3>Negation, <code>paths-ignore</code>, and the order of patterns</h3>
<pre><code class="language-yaml">on:
  push:
    branches: [main, 'release/**', '!release/**-alpha']
    paths:
      - 'src/**'
      - '!src/**/*.md'        # ... but not Markdown under src
      - 'package*.json'</code></pre>
<ul>
<li>Order matters: a <code>!</code> pattern AFTER a positive match excludes; a positive pattern after a negative one includes again. Read the list top to bottom, last match wins.</li>
<li><code>paths-ignore:</code> is the mirror image ("run unless only these changed"). You cannot put <code>paths</code> and <code>paths-ignore</code> on the same event — use <code>paths</code> with <code>!</code> lines when you need both.</li>
<li>Patterns that start with <code>*</code> or <code>!</code> must be quoted — the same YAML rule as the cron in Lesson 1.3.</li>
<li>Filters of different kinds are ANDed: <code>branches: [main]</code> + <code>paths: ['src/**']</code> means "main AND touches src".</li>
</ul>

<h3>When to filter — and when not</h3>
<table>
<thead><tr><th>Situation</th><th>Filter?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>monorepo, a slow job that only concerns one folder</td><td>yes, on <code>push</code></td><td>the job cannot be affected by other folders; saving minutes is real</td></tr>
<tr><td>a check that is <em>required</em> on PRs</td><td>not on the trigger — decide inside the job</td><td>a filtered-out required check never reports; the PR waits forever</td></tr>
<tr><td>docs-only repos, tiny test suites</td><td>usually no</td><td>the filter saves seconds and adds a rule people must remember</td></tr>
<tr><td>a folder with NO job at all (api-backend&#39;s <code>desktop/</code>)</td><td>the filter is not the problem</td><td>add a job for it first; then decide its filter</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Your docs-only PR cannot be merged: the required check says "Expected — Waiting for status to be reported". Why?</strong><br>A: The workflow has a <code>paths</code> filter on <code>pull_request</code> that excludes docs, so it never ran and never reported; GitHub treats that as pending, not passed. Remove the filter from the trigger and skip the expensive steps inside the job (a changed-files step feeding <code>if:</code>), so the job always reports.</p>
<p><strong>Q: What is the difference between <code>src/*</code> and <code>src/**</code> in a filter?</strong><br>A: <code>*</code> does not cross <code>/</code>, so <code>src/*</code> only matches files directly in <code>src</code>; <code>**</code> matches any depth. Measured here: 1 file versus 353.</p>
<p><strong>Q: For <code>pull_request</code>, what does <code>branches:</code> filter on?</strong><br>A: The base branch the PR targets, not the PR&#39;s own branch. Use <code>github.head_ref</code> in an <code>if:</code> if you need to act on the source branch name.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team wants CI to "only run when code changes". Before adding the filter, prove what it will and will not run on.</p><ol>
<li>On a practice branch, add two workflows identical except for <code>paths: ['app/**']</code> and <code>paths: ['app/*']</code>, with <code>branches:</code> set to that branch.</li>
<li>BEFORE pushing, write down your prediction: which of the two runs for a change to <code>docs/a.md</code>, to <code>app/con/b.js</code>, to <code>app/c.js</code>?</li>
<li>Push the three changes as three separate pushes. Fill in the real table from <code>gh run list -b &lt;branch&gt; --json workflowName,headSha</code>.</li>
<li>Push an <code>app/</code> change to a different branch and confirm the run count there is 0.</li>
<li>On the repository you actually work on, replay your real filter against the last 50 commits: <code>git log -50 --name-only --format=%h</code>, and count how many commits would run CI.</li></ol>
<p><strong>Done when:</strong> your predicted table matches the real one in all six cells; the other branch shows 0 runs; and you can state the percentage of recent commits your real filter skips, plus one folder it skips that no job checks.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>branches</code> / <code>branches-ignore</code></span><span class="v">Filter on the target branch (push: the pushed branch; pull_request: the base branch).</span></div>
  <div class="kv"><span class="k"><code>paths</code> / <code>paths-ignore</code></span><span class="v">Filter on which files the change touches; one match is enough to run.</span></div>
  <div class="kv"><span class="k">Glob <code>*</code> / <code>**</code></span><span class="v"><code>*</code> matches within one folder level; <code>**</code> matches across <code>/</code>, any depth.</span></div>
  <div class="kv"><span class="k">Negative pattern <code>!</code></span><span class="v">Excludes paths or branches matched earlier in the list; order matters.</span></div>
  <div class="kv"><span class="k">Two-dot / three-dot diff</span><span class="v">Tip versus tip (pushes) / tip versus merge base (pull requests) — how GitHub lists changed files.</span></div>
  <div class="kv"><span class="k">"Expected — Waiting for status to be reported"</span><span class="v">A required check that never ran: filtered out, merge conflict, or deleted workflow.</span></div>
  <div class="kv"><span class="k">Coverage</span><span class="v">Which parts of the repository some job actually checks; a filter can hide the absence of coverage.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four filter pairs: <code>branches</code>, <code>tags</code>, <code>paths</code> (+ their <code>-ignore</code> forms); different kinds are ANDed, the same pair cannot be mixed.</li>
<li>Measured on the sandbox: a docs change ran nothing, <code>app/con/sau.js</code> ran only <code>app/**</code>, <code>app/tinh.js</code> ran both; another branch ran 0.</li>
<li><code>*</code> stops at <code>/</code>: on api-backend <code>src/*</code> matches 1 file, <code>src/**</code> 353 — the filter fails silently, never loudly.</li>
<li>The changed-file list is a diff whose base depends on the event; a brand-new branch often counts every file.</li>
<li>Never filter a required PR check on the trigger — move the decision inside the job so it always reports.</li>
<li>Replay a filter on your last 200 commits, then ask which excluded folder has no job at all.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: onpushpaths / filter patterns cheat sheet</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet — the authoritative table for <code>*</code> vs <code>**</code> vs <code>?</code>, and the statement that <code>paths</code> and <code>paths-ignore</code> cannot coexist on one event.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Troubleshooting required status checks</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/troubleshooting-required-status-checks — the official description of the "Expected — Waiting for status to be reported" state and its causes, including the filtered-out case.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">dorny/paths-filter and tj-actions/changed-files</span><span class="lc-sub">github.com/dorny/paths-filter — the standard way to move path conditions from the trigger into the job, so a required check still reports on every PR. Chapter 3 uses this with <code>if:</code> on individual steps.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — pathspec, .gitignore globs, and why they differ</span><span class="lc-sub">/courses/git/learn${REF} — git&#39;s own glob rules are close to but not identical to the Actions filter syntax, and the differences bite in exactly the <code>*</code> vs <code>**</code> place this lesson measured.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Bộ lọc, và 73,5% commit không chạy CI nào</h2>
<p class="lead">Bộ lọc làm CI rẻ đi bằng cách KHÔNG chạy nó. Đó là toàn bộ mục đích và nó hiệu quả. Câu hỏi bài này trả lời bằng con số là: <em>chính xác thì nó đang không chạy trên cái gì?</em> — bởi ở kho này, đáp án hoá ra có chứa đúng cái thứ đã vỡ.</p>

<h3>Bốn bộ lọc</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>branches:</code> / <code>branches-ignore:</code></span><span class="v">cú push hay PR nhắm vào nhánh nào. Với <code>pull_request</code>, nó lọc nhánh <strong>GỐC</strong> — nơi PR đi TỚI, không phải nơi PR đi RA</span></div>
<div class="kv"><span class="k"><code>tags:</code> / <code>tags-ignore:</code></span><span class="v">chỉ dành cho <code>push</code>. Thêm <code>tags:</code> mà bỏ <code>branches:</code> nghĩa là push lên nhánh THÔI kích hoạt hoàn toàn</span></div>
<div class="kv"><span class="k"><code>paths:</code> / <code>paths-ignore:</code></span><span class="v">thay đổi đụng vào file nào. Khớp được MỘT cái là đủ chạy</span></div>
<div class="kv"><span class="k">luật cặp đôi</span><span class="v">không được dùng <code>paths:</code> cùng <code>paths-ignore:</code> trong cùng một sự kiện, cũng không được <code>branches:</code> cùng <code>branches-ignore:</code>. Mỗi cặp chọn một phía</span></div>
</div>

<h3>Đo trên sân tập: ba commit, hai bộ lọc</h3>
${slide('ga-01', 25, 'Bộ lọc paths đo thật: 3 commit × 2 workflow')}
<p>Trước khi đọc bộ lọc của một kho thật, hãy xem CƠ CHẾ trên một kho tí hon. Nhánh <code>ch01-workflow</code> của sân tập có hai workflow chỉ khác nhau ĐÚNG MỘT ký tự — <code>paths: ['app/**']</code> và <code>paths: ['app/*']</code>. Ba commit được push lần lượt từng cái:</p>
<div class="out">commit    file doi                 paths: ['app/**']        paths: ['app/*']
2f4ef2a   docs/ghi-chu.md          -  khong chay            -  khong chay
8d5a151   app/con/sau.js           CHAY (35986372146)       -  KHONG chay
b7d67dd   app/tinh.js              CHAY (35986389132)       CHAY (35986389107)</div>
<p>Commit chỉ sửa tài liệu không khởi động workflow nào — và KHÔNG để lại dấu vết: không có run "bị bỏ qua" nào để bấm vào, chỉ là không có gì. File nằm sâu một cấp (<code>app/con/sau.js</code>) chỉ khởi động workflow <code>**</code>. Chỉ file nằm NGAY trong <code>app/</code> mới khởi động cả hai. (Đường dẫn: <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986372146" target="_blank" rel="noopener">35986372146</a>, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986389107" target="_blank" rel="noopener">35986389107</a>.)</p>
${slide('ga-01', 27, 'branches lọc nhánh ĐÍCH — push sang nhánh khác: 0 lần chạy')}
<p>Bộ lọc <code>branches:</code>, cùng phương pháp. Mọi workflow ch01 đều ghi <code>branches: [ch01-workflow]</code>; cùng kiểu thay đổi trong <code>app/</code> nhưng push lên một nhánh MỚI thì chẳng khởi động gì:</p>
<div class="out">$ git switch -c ch01-khac
$ git add app/khac.js &amp;&amp; git commit -m "app/khac.js tren nhanh ch01-khac"
$ git push -u origin ch01-khac
$ gh run list -b ch01-khac --json databaseId --jq length
0</div>
<p>Thêm một quan sát từ chính sân tập ấy, và nó làm nhiều người bất ngờ: cú push ĐẦU TIÊN của <code>ch01-workflow</code> đã khởi động CẢ HAI workflow có lọc đường dẫn, dù cú push đó chỉ toàn file mới. Với cú push TẠO nhánh, GitHub so với "cha của tổ tiên của commit sâu nhất được push" — ở đây là <code>main</code> — nên mọi file trên nhánh mới đều bị tính là đã đổi, kể cả <code>app/README.md</code>.</p>
<h3>Bộ lọc của kho này thật ra lọc cái gì</h3>
${slide('ga-01', 29, 'Bộ lọc không giấu job hỏng — nó giấu job KHÔNG TỒN TẠI')}
<p><code>ci-lint.yml</code> là workflow duy nhất ở đây chạy khi <code>push</code>, và nó mang một danh sách <code>paths:</code>:</p>

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
      <span class="tok-comment"># ... con 5 duong nua</span></code></pre>

<p>Thay vì ngồi lập luận xem danh sách ấy có đúng không, hãy DIỄN LẠI nó. Lấy 200 commit gần nhất trên <code>main</code> rồi áp các mẫu ấy vào danh sách file của từng commit:</p>

<div class="out">200 commit gan nhat tren main:
  KHOP bo loc paths (ci-lint CHAY):    53
  TRUOT bo loc     (ci-lint IM LANG):  147
  ty le im lang: 73.5%</div>

<div class="callout warn">
<p><strong>Chưa đầy một phần tư commit trên nhánh chính là có CI; ba phần tư còn lại không kích hoạt gì cả.</strong> Đó chưa phải một báo cáo lỗi — có thể nó đúng y như vậy là hợp lý. Nhưng đó là con số đáng biết TRƯỚC khi bạn cho rằng "main đang xanh" có nghĩa gì đó.</p>
</div>

<h3>Nó có đúng không? Nhìn xem các commit bị bỏ qua đụng vào đâu</h3>
<div class="out">147 commit bi bo qua dung vao dau (dem theo file):
  desktop/   297
  content/    84
  firmware/   46
  scripts/     2
  deploy-nha.sh  2
  .github/       1
  docker-compose.yml 1
  CLAUDE.md      1
  AGENTS.md      1</div>

<p>Giờ đối chiếu với việc mà job dù sao cũng sẽ làm. Job backend chạy <code>tsc --noEmit</code>, và phạm vi của chính trình biên dịch là:</p>

<div class="out">include: ['src*']
exclude: ['node_modules', 'dist', 'prisma/seed.ts']
rootDir: ./src</div>

<div class="callout ok">
<p><strong>Bộ lọc được khoanh ĐÚNG phạm vi.</strong> <code>tsc</code> thật sự không nhìn tới <code>desktop/</code>, <code>content/</code>, <code>firmware/</code> hay <code>scripts/</code>, nên chạy nó trên một commit chỉ đụng mấy chỗ đó là đốt hai phút để kiểm lại một cái cây không đổi. 147 lần bỏ qua ấy là 147 quyết định đúng, và người viết danh sách kia biết rõ job kiểm cái gì.</p>
</div>

<h3>Vậy mà</h3>
<p>Cú hỏng CI đắt nhất kho này từng có là lần chạy <strong>32400097927</strong> — <code>vite build</code> thoát 134 với <code>Reached heap limit — JavaScript heap out of memory</code> trên runner macOS, giữa một lượt phát hành desktop. Nó dựng xanh trong hai mươi giây trên máy của chính người viết. Nó chỉ hỏng ở CI, chỉ trên macOS, và chỉ vào lúc phát hành.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">chỗ cú vỡ nằm</span><span class="lz-t"><code>desktop/</code></span><span class="lz-d">297 trong số file của 147 commit bị bỏ qua nằm ở thư mục này</span></div>
<div class="lz-step"><span class="lz-k">CI chạy gì trên đó</span><span class="lz-t">không gì cả</span><span class="lz-d">không mẫu nào trong danh sách <code>paths:</code> khớp <code>desktop/**</code></span></div>
<div class="lz-step"><span class="lz-k">lúc nào nó lộ ra</span><span class="lz-t">lúc phát hành</span><span class="lz-d">lần đầu tiên có thứ gì dựng thư mục ấy là một con người bấm nút công bố</span></div>
</div>

<div class="callout warn">
<p><strong>Bộ lọc không sai; ĐỘ PHỦ mới sai.</strong> Mọi mẫu trong danh sách kia đều bảo vệ được. Cái thiếu là một <em>job thứ hai</em> — cái dựng <code>desktop/</code> — cùng một mẫu tương ứng cho nó. Một bộ lọc <code>paths:</code> âm thầm biến "chúng ta không có job nào cho thư mục này" thành "CI đã qua", và hai câu ấy trông y hệt nhau trên danh sách commit. Đó là kiểu hỏng đáng mang ra khỏi bài này: bộ lọc không giấu job HỎNG, nó giấu job <strong>KHÔNG TỒN TẠI</strong>.</p>
</div>

<h3>Cú pháp glob, đo trên danh sách file thật</h3>
${slide('ga-01', 26, 'Trên kho thật: src/* khớp 1 file, src/** khớp 353')}
<p>Lỗi bộ lọc phổ biến nhất là viết một dấu sao ở chỗ cần hai. Áp từng mẫu vào danh sách file đang được theo dõi của kho này:</p>

<div class="out">mau                so file khop   ghi chu
------------------------------------------------------------
src/**                      353
src/*                         1   <- CHI src/index.ts
src/*.ts                      1
src/**/*.ts                 353
**/*.ts                   1.039   <- ca kho
frontend/**               2.242
*.json                        5   <- chi thu muc goc
**/*.json                    93</div>

<div class="pitfall">
<p><strong>Bẫy — <code>src/*</code> KHÔNG phải "mọi thứ dưới src".</strong> Một dấu <code>*</code> không vượt qua dấu <code>/</code>. Ở kho này <code>src/**</code> khớp 353 file còn <code>src/*</code> khớp đúng MỘT, vì <code>src/index.ts</code> là file duy nhất nằm trực tiếp trong <code>src/</code>. Viết <code>src/*</code> vào một bộ lọc <code>paths:</code> là bạn vừa gỡ CI khỏi 352 file — không lỗi, không cảnh báo, và một workflow vẫn chạy đủ thường xuyên để trông như còn sống. Cùng cái bẫy ấy biến <code>*.json</code> (5 file, chỉ gốc) thành một thứ rất khác <code>**/*.json</code> (93 file).</p>
</div>

<h3>Bộ lọc chặn đứng một PR vĩnh viễn</h3>
${slide('ga-01', 28, 'paths trên PR + ô kiểm bắt buộc = PR kẹt vĩnh viễn')}
<p>Đây là lý do cho một sự bất đối xứng trong cấu hình bên trên, cái trông như sót. Đọc lại hai kích hoạt:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>push:</code> CÓ <code>paths:</code></span><span class="lz-lnote">đúng — một cú push vào main không đụng gì job kiểm thì không nên tốn hai phút đi kiểm nó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pull_request:</code> KHÔNG có <code>paths:</code></span><span class="lz-lnote">cũng đúng, và vì một lý do hoàn toàn khác</span></div>
</div>

<p>Một ô kiểm trạng thái <em>bắt buộc</em> mà không bao giờ chạy thì không bao giờ báo cáo. GitHub KHÔNG coi "workflow này bị lọc ra" là một lần qua — nó coi đó là một kết quả CHƯA TỚI. PR nằm ở <strong>"Expected — Waiting for status to be reported"</strong> và không gộp được, không có job hỏng nào để mở, không có log nào để đọc. Ghép một bộ lọc <code>paths:</code> trên <code>pull_request</code> với branch protection đòi ô kiểm ấy, và mọi PR chỉ sửa tài liệu sẽ vĩnh viễn không gộp được.</p>

<div class="callout">
<p><strong>Cách vá chuẩn, khi bạn THẬT SỰ muốn lọc đường dẫn trên PR.</strong> Bỏ <code>paths:</code> khỏi kích hoạt và đưa điều kiện vào BÊN TRONG: giữ cho job luôn chạy, để các <em>bước</em> của nó tự quyết. Một job khởi động, phát hiện không có gì liên quan thay đổi, rồi thoát 0 trong tám giây thì vẫn báo cáo thành công — đúng thứ branch protection cần. Công cụ chuyên dụng là một action đọc danh sách file đã đổi rồi nạp vào <code>if:</code> của các bước đắt tiền; Chương 3 dựng khuôn mẫu ấy cho tử tế. Bản rẻ tiền là một bước đầu tiên tính diff rồi đặt một output.</p>
</div>

<h3>Hai giới hạn, một cái không áp dụng ở đây</h3>
<p>Tài liệu nói rằng việc lọc <code>paths</code> chỉ xét 3.000 file thay đổi đầu tiên (bản tài liệu cũ, và bản cũ của bài này, ghi 300 — đã sửa ngày 24/09/2026 theo trang hiện tại), và rằng một cú push quá 1.000 commit thì luôn chạy bất kể bộ lọc. Cả hai đều có thật. Chúng có ăn thua với bạn không thì đo được:</p>

<div class="out">commit lon nhat trong 200 commit gan nhat: 23 file
so commit vuot 300 file: 0 / 200</div>

<div class="callout ok">
<p><strong>Một kết quả RỖNG, và ghi lại đúng là rỗng.</strong> Cái trần số file có thật và đáng biết, còn ở kho này nó chưa hề tới gần chỗ cắn — commit lớn nhất trong hai trăm cái đụng 23 file. Nó sẽ ăn thua với một monorepo hay commit mã sinh tự động hoặc cập nhật thư viện nhúng kèm. Đem nó ra doạ ở đây là dạy một quy tắc bằng một mối nguy mà số đo bảo là không có mặt.</p>
</div>

<h3>Tag, và một lệnh grep nói dối</h3>
<p>Đếm số kích hoạt theo tag trong kho này trông như một câu lệnh, và câu lệnh hiển nhiên ấy cho đáp án SAI:</p>

<div class="out">$ grep -l "tags:" .github/workflows/*.yml
.github/workflows/deploy-ghcr.yml        <- co ve nhu CO kich hoat theo tag</div>

<p>Không hề. Chỗ khớp ấy nằm bên trong một bước <code>docker/build-push-action</code>, nơi <code>tags:</code> đặt tên cho các <em>nhãn ảnh Docker</em> cần đẩy. Chỉ đếm bên trong khối <code>on:</code> mới ra con số thật: <strong>0 trên 11</strong> workflow ở đây kích hoạt theo tag.</p>

<div class="pitfall">
<p><strong>Bẫy — grep một tên khoá xuyên qua YAML mà không đếm xỉa tới độ lồng.</strong> <code>tags:</code>, <code>name:</code>, <code>env:</code>, <code>if:</code> và <code>permissions:</code> đều hợp lệ ở nhiều độ sâu khác nhau với nghĩa khác nhau. Một lệnh <code>grep</code> phẳng xuyên các tệp workflow sẽ trả lời một câu hỏi bạn không hỏi. Hãy khoanh vùng tìm kiếm vào đúng khối bạn định nói — và khi một lệnh grep một dòng đẻ ra một khẳng định gây bất ngờ về chính kho của bạn, thì sự bất ngờ ấy là tín hiệu để đi KIỂM, không phải để ghi xuống.</p>
</div>

<p>Còn một thứ nữa rơi ra từ chính tệp ấy. <code>deploy-ghcr.yml</code> gắn nhãn ảnh bằng <code>&#36;{{ github.sha }}</code>, đúng cái bài 1.4 đã gọi tên là bẫy trên lần chạy PR. Ở đây nó an toàn vì một lý do chẳng liên quan gì tới cái nhãn: workflow ấy <code>workflow_dispatch:</code> thuần, nên nó không bao giờ chạy trên một pull request, nên <code>github.sha</code> luôn là một commit thật của nhánh. Mối nguy bị né nhờ cấu hình KÍCH HOẠT, không nhờ việc chọn biến — mà đó đúng là kiểu an toàn tình cờ sẽ thôi an toàn ngay khoảnh khắc có người thêm một kích hoạt <code>pull_request:</code> vào tệp đó.</p>

<div class="callout ok">
<p><strong>Rút ra cái gì.</strong> Bộ lọc là một quyết định KINH TẾ nhưng đọc lên như một quyết định ĐÚNG-SAI. Trước khi thêm <code>paths:</code>, hãy diễn lại nó trên hai trăm commit gần nhất của bạn — câu lệnh ngắn và con số thường gây bất ngờ. Rồi hỏi câu thứ hai, câu mới thật sự quan trọng: trong những thư mục mà bộ lọc này loại ra, thư mục nào <em>không có job nào cả</em>?</p>
</div>

<h3>GitHub quyết định file nào "đã đổi" ra sao</h3>
<p>Mọi kết quả của <code>paths</code> phụ thuộc vào một phép diff GitHub tính TRƯỚC khi job nào khởi động. Các luật, theo tài liệu hiện tại (09/2026), kèm ý nghĩa thực tế:</p>
<table>
<thead><tr><th>Tình huống</th><th>Diff GitHub dùng</th><th>Hệ quả</th></tr></thead>
<tbody>
<tr><td>push lên nhánh đã có</td><td>hai chấm: đầu cũ ↔ đầu mới</td><td>chỉ những gì cú push này đổi</td></tr>
<tr><td>push TẠO nhánh</td><td>hai chấm so với cha của commit sâu nhất được push</td><td>thường là "mọi thứ khác main" — cả hai bộ lọc sân tập đều nổ</td></tr>
<tr><td>pull request</td><td>ba chấm: đầu PR ↔ gốc chung với nhánh gốc</td><td>mọi file PR đã đổi tới giờ, không chỉ cú push cuối</td></tr>
<tr><td>không file nào đổi</td><td>—</td><td>workflow không chạy</td></tr>
<tr><td>một cú push quá 1.000 commit, hoặc diff bị quá giờ</td><td>—</td><td>workflow LUÔN chạy</td></tr>
<tr><td>diff quá 3.000 file và các file khớp không nằm trong 3.000 file đầu</td><td>—</td><td>workflow KHÔNG chạy</td></tr>
</tbody>
</table>

<h3>Phủ định, <code>paths-ignore</code>, và thứ tự các mẫu</h3>
<pre><code class="language-yaml">on:
  push:
    branches: [main, 'release/**', '!release/**-alpha']
    paths:
      - 'src/**'
      - '!src/**/*.md'        # ... nhung khong tinh Markdown trong src
      - 'package*.json'</code></pre>
<ul>
<li>Thứ tự có nghĩa: một mẫu <code>!</code> đứng SAU một mẫu khớp thì loại ra; một mẫu dương đứng sau mẫu phủ định thì lấy lại. Đọc danh sách từ trên xuống, mẫu khớp CUỐI thắng.</li>
<li><code>paths-ignore:</code> là ảnh gương ("chạy trừ khi chỉ những file này đổi"). Không được đặt <code>paths</code> và <code>paths-ignore</code> trên cùng một sự kiện — cần cả hai thì dùng <code>paths</code> kèm dòng <code>!</code>.</li>
<li>Mẫu bắt đầu bằng <code>*</code> hoặc <code>!</code> phải đặt trong nháy — cùng luật YAML với cron ở bài 1.3.</li>
<li>Bộ lọc KHÁC loại được nối bằng VÀ: <code>branches: [main]</code> + <code>paths: ['src/**']</code> nghĩa là "main VÀ đụng tới src".</li>
</ul>

<h3>Khi nào nên lọc — và khi nào KHÔNG</h3>
<table>
<thead><tr><th>Tình huống</th><th>Lọc?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>monorepo, một job chậm chỉ liên quan một thư mục</td><td>có, trên <code>push</code></td><td>thư mục khác không ảnh hưởng được job; tiết kiệm phút là thật</td></tr>
<tr><td>một ô kiểm <em>bắt buộc</em> trên PR</td><td>không lọc ở bộ kích hoạt — quyết định BÊN TRONG job</td><td>ô kiểm bắt buộc bị lọc ra thì không bao giờ báo; PR chờ mãi</td></tr>
<tr><td>kho toàn tài liệu, bộ test tí hon</td><td>thường là không</td><td>bộ lọc tiết kiệm vài giây mà thêm một luật mọi người phải nhớ</td></tr>
<tr><td>một thư mục KHÔNG có job nào (<code>desktop/</code> của api-backend)</td><td>bộ lọc không phải vấn đề</td><td>thêm job cho nó trước; rồi mới tính bộ lọc</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: PR chỉ sửa tài liệu của bạn không gộp được: ô kiểm bắt buộc ghi "Expected — Waiting for status to be reported". Vì sao?</strong><br>Đ: Workflow có bộ lọc <code>paths</code> trên <code>pull_request</code> loại tài liệu ra, nên nó không chạy và không báo; GitHub coi đó là ĐANG CHỜ, không phải ĐÃ QUA. Bỏ bộ lọc khỏi bộ kích hoạt và bỏ qua các bước đắt BÊN TRONG job (một bước tính file đã đổi nạp vào <code>if:</code>), để job luôn báo cáo.</p>
<p><strong>H: <code>src/*</code> và <code>src/**</code> trong bộ lọc khác nhau thế nào?</strong><br>Đ: <code>*</code> không vượt qua <code>/</code>, nên <code>src/*</code> chỉ khớp file nằm ngay trong <code>src</code>; <code>**</code> khớp mọi độ sâu. Đo ở đây: 1 file so với 353.</p>
<p><strong>H: Với <code>pull_request</code>, <code>branches:</code> lọc theo cái gì?</strong><br>Đ: Nhánh GỐC mà PR nhắm tới, không phải nhánh của chính PR. Cần xử lý theo tên nhánh nguồn thì dùng <code>github.head_ref</code> trong <code>if:</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn muốn CI "chỉ chạy khi mã thay đổi". Trước khi thêm bộ lọc, hãy chứng minh nó sẽ chạy và KHÔNG chạy trên những gì.</p><ol>
<li>Trên một nhánh thực hành, thêm hai workflow giống hệt nhau trừ <code>paths: ['app/**']</code> và <code>paths: ['app/*']</code>, với <code>branches:</code> đặt là chính nhánh đó.</li>
<li>TRƯỚC khi push, ghi ra dự đoán: cái nào trong hai cái chạy khi đổi <code>docs/a.md</code>, <code>app/con/b.js</code>, <code>app/c.js</code>?</li>
<li>Push ba thay đổi thành ba cú push riêng. Điền bảng thật từ <code>gh run list -b &lt;nhánh&gt; --json workflowName,headSha</code>.</li>
<li>Push một thay đổi trong <code>app/</code> lên một nhánh KHÁC và xác nhận số run ở đó là 0.</li>
<li>Trên kho bạn đang làm thật, diễn lại bộ lọc thật trên 50 commit gần nhất: <code>git log -50 --name-only --format=%h</code>, và đếm xem bao nhiêu commit sẽ chạy CI.</li></ol>
<p><strong>Đạt khi:</strong> bảng dự đoán khớp bảng thật ở cả sáu ô; nhánh kia hiện 0 run; và bạn nói được tỉ lệ commit gần đây mà bộ lọc thật bỏ qua, cộng một thư mục nó bỏ qua mà KHÔNG job nào kiểm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>branches</code> / <code>branches-ignore</code> (lọc nhánh)</span><span class="v">Lọc theo nhánh ĐÍCH (push: nhánh được push; pull_request: nhánh gốc).</span></div>
  <div class="kv"><span class="k"><code>paths</code> / <code>paths-ignore</code> (lọc đường dẫn)</span><span class="v">Lọc theo file mà thay đổi đụng tới; khớp một là đủ chạy.</span></div>
  <div class="kv"><span class="k">Glob <code>*</code> / <code>**</code> (mẫu đại diện)</span><span class="v"><code>*</code> khớp trong một cấp thư mục; <code>**</code> vượt qua <code>/</code>, mọi độ sâu.</span></div>
  <div class="kv"><span class="k">Mẫu phủ định <code>!</code></span><span class="v">Loại những đường dẫn/nhánh đã khớp ở trên trong danh sách; thứ tự có nghĩa.</span></div>
  <div class="kv"><span class="k">Diff hai chấm / ba chấm</span><span class="v">Đầu ↔ đầu (push) / đầu ↔ gốc chung (pull request) — cách GitHub liệt kê file đã đổi.</span></div>
  <div class="kv"><span class="k">"Expected — Waiting for status to be reported"</span><span class="v">Ô kiểm bắt buộc chưa từng chạy: bị lọc, xung đột gộp, hoặc workflow đã bị xoá.</span></div>
  <div class="kv"><span class="k">Coverage (độ phủ)</span><span class="v">Phần nào của kho thật sự có job kiểm; một bộ lọc có thể che đi sự THIẾU độ phủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn cặp bộ lọc: <code>branches</code>, <code>tags</code>, <code>paths</code> (+ dạng <code>-ignore</code>); khác loại thì nối bằng VÀ, cùng cặp thì không được trộn.</li>
<li>Đo trên sân tập: đổi tài liệu không chạy gì, <code>app/con/sau.js</code> chỉ chạy <code>app/**</code>, <code>app/tinh.js</code> chạy cả hai; nhánh khác chạy 0.</li>
<li><code>*</code> dừng ở <code>/</code>: trên api-backend <code>src/*</code> khớp 1 file, <code>src/**</code> 353 — bộ lọc hỏng trong im lặng, không bao giờ ồn ào.</li>
<li>Danh sách file đã đổi là một phép diff mà gốc so tuỳ sự kiện; một nhánh mới tinh thường tính MỌI file.</li>
<li>Đừng bao giờ lọc một ô kiểm PR bắt buộc ở bộ kích hoạt — đưa quyết định vào TRONG job để nó luôn báo cáo.</li>
<li>Diễn lại bộ lọc trên 200 commit gần nhất, rồi hỏi thư mục bị loại nào KHÔNG có job nào cả.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: bảng tra cứu mẫu lọc</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet — bảng chính thức cho <code>*</code> với <code>**</code> với <code>?</code>, và phát biểu rằng <code>paths</code> và <code>paths-ignore</code> không thể cùng nằm trên một sự kiện.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Troubleshooting required status checks</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/troubleshooting-required-status-checks — mô tả chính thức trạng thái "Expected — Waiting for status to be reported" và các nguyên nhân, gồm cả trường hợp bị bộ lọc loại ra.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">dorny/paths-filter và tj-actions/changed-files</span><span class="lc-sub">github.com/dorny/paths-filter — cách chuẩn để chuyển điều kiện đường dẫn từ kích hoạt vào bên trong job, để một ô kiểm bắt buộc vẫn báo cáo trên mọi PR. Chương 3 dùng nó cùng <code>if:</code> trên từng bước.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — pathspec, glob của .gitignore, và chỗ chúng khác nhau</span><span class="lc-sub">/courses/git/learn${REF} — luật glob của chính git gần giống nhưng không đồng nhất với cú pháp lọc của Actions, và chỗ khác biệt cắn đúng vào chỗ <code>*</code> với <code>**</code> mà bài này vừa đo.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
      slug: 'ga-1-6-kiem-tra',
      type: 'QUIZ',
      description: 'Mười câu tình huống trên đúng những gì chương đã chạy thật: khoá on: thành True, 18.20 thành Node 18.2.0, input boolean, cron trên nhánh, merge commit của pull_request, pull_request_target, và app/* khác app/**.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>What Chapter 1 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Every one is a situation you will meet in a real repository, and every answer was measured in this chapter rather than asserted — if an option feels like a matter of opinion, go back to the output block it came from.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read any workflow as WHEN (<code>on</code>) → WHAT (<code>jobs</code>) → WHERE (<code>runs-on</code>) → HOW (<code>steps</code>: <code>uses</code>/<code>with</code> or <code>run</code>).</li>
<li>I can explain why a YAML 1.1 parser returns <code>True</code> for the key <code>on</code>, and why <code>18.20</code> must be quoted.</li>
<li>I know which commit and ref each trigger hands the job, and that <code>schedule</code> only reads the default branch.</li>
<li>I can predict that a cron will run late, and design an alarm on absence instead of on a clock time.</li>
<li>I can show, with <code>GITHUB_SHA</code> and <code>head.sha</code>, that <code>pull_request</code> tests a merge commit.</li>
<li>I can predict which commits a <code>branches</code>/<code>paths</code> filter runs on — including the ones it silently skips.</li>
</ul>
${slide('ga-01', 31, 'Chapter 1 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Chương 1 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Câu nào cũng là một tình huống bạn sẽ gặp trong kho thật, và mọi đáp án đều đã được ĐO trong chương này chứ không phải khẳng định suông — nếu một phương án khiến bạn thấy nó tuỳ quan điểm, hãy quay lại khối output mà nó lấy ra.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được mọi workflow theo KHI NÀO (<code>on</code>) → LÀM GÌ (<code>jobs</code>) → Ở ĐÂU (<code>runs-on</code>) → THẾ NÀO (<code>steps</code>: <code>uses</code>/<code>with</code> hoặc <code>run</code>).</li>
<li>Tôi giải thích được vì sao bộ phân tích YAML 1.1 trả về <code>True</code> cho khoá <code>on</code>, và vì sao <code>18.20</code> phải đặt nháy.</li>
<li>Tôi biết mỗi bộ kích hoạt trao cho job commit và ref nào, và rằng <code>schedule</code> chỉ đọc nhánh mặc định.</li>
<li>Tôi đoán trước được cron sẽ trễ, và thiết kế báo động theo sự vắng mặt thay vì theo giờ đồng hồ.</li>
<li>Tôi chứng minh được, bằng <code>GITHUB_SHA</code> và <code>head.sha</code>, rằng <code>pull_request</code> kiểm một merge commit.</li>
<li>Tôi đoán trước được bộ lọc <code>branches</code>/<code>paths</code> chạy trên commit nào — kể cả những commit nó âm thầm bỏ qua.</li>
</ul>
${slide('ga-01', 31, 'Bảng tra nhanh Chương 1')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your Python script inventories workflow triggers with PyYAML: triggers = doc.get("on"). It prints None for every file, although every file clearly starts with on:. What is going on?|||Script Python của bạn kiểm kê bộ kích hoạt bằng PyYAML: triggers = doc.get("on"). Nó in None cho MỌI tệp, dù tệp nào cũng rõ ràng bắt đầu bằng on:. Chuyện gì đang xảy ra?',
            options: [
              'The files are invalid YAML, and PyYAML silently returns None when a document fails to parse|||Các tệp là YAML không hợp lệ, và PyYAML âm thầm trả None khi một tài liệu phân tích hỏng',
              'PyYAML implements YAML 1.1, where the bare word on is a boolean, so the key is True — look up doc[True] (or use a YAML 1.2 parser such as yq)|||PyYAML cài đặt YAML 1.1, nơi từ trần on là boolean, nên khoá là True — hãy tra doc[True] (hoặc dùng bộ phân tích YAML 1.2 như yq)',
              'GitHub strips the on: key when the file is stored, so it only exists inside the Actions service|||GitHub gỡ khoá on: khi lưu tệp, nên nó chỉ tồn tại bên trong dịch vụ Actions',
              'on is a reserved word in Python, so dictionary lookups with that name always fail|||on là từ khoá dành riêng của Python, nên tra từ điển bằng tên đó luôn thất bại',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: YAML 1.1 resolves on/off/yes/no as booleans, and keys are scalars like any other, so the key is the boolean True (measured with PyYAML 6.0.3; yq, which is YAML 1.2, keeps "on"). GitHub copes; your tools must too. Tempting wrong answer: "invalid YAML" — an invalid file raises an error, it does not return a dict with other keys intact.|||VI: YAML 1.1 coi on/off/yes/no là boolean, và khoá cũng là vô hướng như mọi vô hướng khác, nên khoá là boolean True (đo bằng PyYAML 6.0.3; yq, theo YAML 1.2, giữ nguyên "on"). GitHub tự xử lý được; công cụ của bạn thì phải tự lo. Phương án sai hấp dẫn: "YAML không hợp lệ" — tệp hỏng sẽ ném lỗi, chứ không trả về một từ điển còn nguyên các khoá khác.',
          },
          {
            question: 'A job has node-version: 18.20 (no quotes). CI is green, but a teammate notices node --version prints v18.2.0 in the log. What is the correct explanation and fix?|||Một job có node-version: 18.20 (không nháy). CI xanh, nhưng đồng đội thấy node --version in v18.2.0 trong log. Giải thích và cách sửa đúng là gì?',
            options: [
              'setup-node rounds versions to the nearest minor release it has cached; add check-latest: true|||setup-node làm tròn phiên bản về bản minor gần nhất có trong cache; thêm check-latest: true',
              'The runner image ships Node 18.2.0 and ignores node-version; switch to a container job|||Ảnh runner có sẵn Node 18.2.0 và bỏ qua node-version; chuyển sang job chạy trong container',
              'actionlint would have caught it; the team just forgot to run the linter|||actionlint lẽ ra đã bắt được; cả nhóm chỉ quên chạy bộ lint',
              'Unquoted, 18.20 is the YAML float 18.2, so the action receives "18.2" and installs Node 18.2.0; write node-version: "18.20"|||Không nháy thì 18.20 là số thực YAML 18.2, nên action nhận "18.2" và cài Node 18.2.0; viết node-version: "18.20"',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured on a real runner: the with: echo shows node-version: 18.2, then "Acquiring 18.2.0". With quotes the same job installed 18.20.8. Tempting wrong answer: actionlint — measured, actionlint 1.7.12 exits 0 on this file because 18.20 is a valid value.|||VI: Đo trên runner thật: phần with: in ra node-version: 18.2, rồi "Acquiring 18.2.0". Có nháy thì cùng job cài 18.20.8. Phương án sai hấp dẫn: actionlint — đo thật, actionlint 1.7.12 thoát 0 với tệp này vì 18.20 là giá trị hợp lệ.',
          },
          {
            question: 'Branch protection requires the check "backend". A PR that only edits README.md shows "backend — Expected — Waiting for status to be reported" for hours. The workflow has pull_request: with paths: ["src/**"]. What is the right fix?|||Branch protection bắt buộc ô kiểm "backend". Một PR chỉ sửa README.md hiện "backend — Expected — Waiting for status to be reported" suốt nhiều giờ. Workflow có pull_request: kèm paths: ["src/**"]. Cách sửa đúng là gì?',
            options: [
              'Remove paths from the pull_request trigger and skip the expensive steps inside the job, so the job always runs and always reports|||Bỏ paths khỏi bộ kích hoạt pull_request và bỏ qua các bước đắt BÊN TRONG job, để job luôn chạy và luôn báo cáo',
              'Wait: GitHub marks a filtered-out required check as passed after its timeout|||Chờ: GitHub đánh dấu ô kiểm bắt buộc bị lọc là đã qua sau khi hết hạn',
              'Re-run the last workflow run from the Actions tab so the status is reported|||Chạy lại lần chạy gần nhất từ tab Actions để trạng thái được báo cáo',
              'Change src/** to src/* so that the filter matches fewer files|||Đổi src/** thành src/* để bộ lọc khớp ít file hơn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A workflow filtered out by paths never runs, so the required check never reports; GitHub treats that as pending, not passed — forever. Moving the decision inside the job keeps the check reporting on every PR (api-backend deliberately has no paths on pull_request). Tempting wrong answer: re-running — there is no run for this PR to re-run.|||VI: Workflow bị paths lọc ra thì không bao giờ chạy, nên ô kiểm bắt buộc không bao giờ báo; GitHub coi đó là ĐANG CHỜ, không phải ĐÃ QUA — mãi mãi. Đưa quyết định vào trong job thì ô kiểm luôn báo trên mọi PR (api-backend cố ý không có paths trên pull_request). Phương án sai hấp dẫn: chạy lại — PR này làm gì có lần chạy nào để chạy lại.',
          },
          {
            question: 'A workflow_dispatch input bo_qua_test is type: boolean. You dispatch with false, yet a step guarded by if: github.event.inputs.bo_qua_test still runs. Why?|||Input bo_qua_test của workflow_dispatch có type: boolean. Bạn dispatch với false, vậy mà bước có if: github.event.inputs.bo_qua_test vẫn chạy. Vì sao?',
            options: [
              'Dispatch inputs are only applied from the second run onwards; the first run uses defaults|||Input của dispatch chỉ áp dụng từ lần chạy thứ hai; lần đầu dùng giá trị mặc định',
              'The if: expression is evaluated before inputs are loaded, so it is always true|||Biểu thức if: được tính trước khi nạp input, nên luôn đúng',
              'github.event.inputs holds strings, and the non-empty string "false" is truthy; inputs.bo_qua_test keeps the real boolean and would skip the step|||github.event.inputs giữ CHUỖI, và chuỗi không rỗng "false" là đúng; inputs.bo_qua_test giữ boolean thật và sẽ bỏ qua bước',
              'Boolean inputs cannot be used in if: at all; use a choice input instead|||Input boolean hoàn toàn không dùng được trong if:; hãy dùng input kiểu choice',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured on run 35987558284: if: inputs.bo_qua_test was skipped, if: github.event.inputs.bo_qua_test ran, and == "true" was skipped. The docs say the inputs context preserves booleans while github.event.inputs converts them to strings. Tempting wrong answer: "use choice" — booleans work fine through inputs.|||VI: Đo trên run 35987558284: if: inputs.bo_qua_test bị bỏ qua, if: github.event.inputs.bo_qua_test lại chạy, còn == "true" bị bỏ qua. Tài liệu nói ngữ cảnh inputs giữ boolean còn github.event.inputs đổi chúng thành chuỗi. Phương án sai hấp dẫn: "dùng choice" — boolean chạy tốt qua inputs.',
          },
          {
            question: 'To also run when a PR is labeled, someone changed the trigger to pull_request: types: [opened, labeled]. A week later, pushes to open PRs are no longer tested. Why?|||Để chạy thêm khi PR được gắn nhãn, ai đó đổi bộ kích hoạt thành pull_request: types: [opened, labeled]. Một tuần sau, các cú push lên PR đang mở không còn được kiểm. Vì sao?',
            options: [
              'Labeled PRs are locked from further CI runs until the label is removed|||PR đã gắn nhãn bị khoá CI cho tới khi gỡ nhãn',
              'A types: list replaces the default (opened, synchronize, reopened), so synchronize — the new-commit event — was dropped|||Danh sách types: THAY THẾ mặc định (opened, synchronize, reopened), nên synchronize — sự kiện commit mới — đã bị bỏ',
              'GitHub only runs pull_request once per PR unless concurrency is configured|||GitHub chỉ chạy pull_request một lần cho mỗi PR trừ khi cấu hình concurrency',
              'labeled events cancel all queued runs of the same workflow|||Sự kiện labeled huỷ mọi lần chạy đang xếp hàng của cùng workflow',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Without types:, pull_request runs on opened, synchronize and reopened. Writing types: takes responsibility for the whole list; omitting synchronize means every later push shows the old green tick from the first run. Tempting wrong answer: concurrency — it only cancels or queues runs, it never stops them from being created.|||VI: Không có types: thì pull_request chạy với opened, synchronize và reopened. Viết types: là nhận trách nhiệm cho CẢ danh sách; thiếu synchronize thì mọi cú push sau đó chỉ hiện dấu tick xanh cũ của lần chạy đầu. Phương án sai hấp dẫn: concurrency — nó chỉ huỷ hoặc xếp hàng run, không bao giờ ngăn run được tạo.',
          },
          {
            question: 'A backup workflow uses cron: "0 3 * * 0". Management wants an alert "if the backup has not finished by 04:00 UTC". Based on the 14 measured Sundays, what do you propose?|||Một workflow sao lưu dùng cron: "0 3 * * 0". Sếp muốn báo động "nếu sao lưu chưa xong trước 04:00 UTC". Dựa trên 14 Chủ nhật đã đo, bạn đề xuất gì?',
            options: [
              'Alert on absence — "no successful backup in the last 8 days" — because the start itself was 41 minutes to 5.8 hours late and never on time|||Báo động theo sự vắng mặt — "không có lần sao lưu thành công nào trong 8 ngày qua" — vì chính giờ bắt đầu đã trễ 41 phút tới 5,8 tiếng và chưa lần nào đúng giờ',
              'Keep the 04:00 alert but move the cron to "0 2 * * 0" to leave an hour of margin|||Giữ báo động 04:00 nhưng dời cron về "0 2 * * 0" để chừa một tiếng dư',
              'Switch to cron: "*/5 * * * *" so the backup starts within five minutes of 03:00|||Đổi sang cron: "*/5 * * * *" để sao lưu bắt đầu trong vòng năm phút sau 03:00',
              'Add timezone: "UTC" to the schedule so GitHub treats the time as exact|||Thêm timezone: "UTC" vào lịch để GitHub coi giờ đó là chính xác',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 0 of 14 runs started on time, 12 of 14 had not even STARTED by 04:00, and September was the worst month. A one-hour margin would still have alarmed on most Sundays. timezone: only changes which clock the cron reads, not the queue delay. Tempting wrong answer: "*/5" — more requests do not make any one of them punctual, and it runs the backup 288 times a day.|||VI: 0 trên 14 lần khởi động đúng giờ, 12 trên 14 lần còn chưa hề BẮT ĐẦU lúc 04:00, và tháng 9 là tháng tệ nhất. Chừa một tiếng dư thì vẫn báo động gần như mọi Chủ nhật. timezone: chỉ đổi cron đọc đồng hồ nào, không đổi độ trễ hàng đợi. Phương án sai hấp dẫn: "*/5" — xin nhiều lần hơn không làm lần nào đúng giờ hơn, lại còn chạy sao lưu 288 lần mỗi ngày.',
          },
          {
            question: 'You add a nightly cron workflow on your feature branch to test it before merging. A day later there are no runs, and gh run list -w "nightly" says it cannot find the workflow. Why?|||Bạn thêm một workflow cron hằng đêm trên nhánh tính năng để thử trước khi gộp. Một ngày sau vẫn không có lần chạy nào, và gh run list -w "nightly" báo không tìm thấy workflow. Vì sao?',
            options: [
              'Cron workflows need at least one manual run before GitHub schedules them|||Workflow cron cần ít nhất một lần chạy tay thì GitHub mới lên lịch',
              'The cron expression must be quoted, otherwise GitHub ignores the schedule|||Biểu thức cron phải đặt nháy, không thì GitHub bỏ qua lịch',
              'Nightly schedules only start after 60 days of repository activity|||Lịch hằng đêm chỉ bắt đầu sau 60 ngày kho có hoạt động',
              'schedule only reads workflow files from the default branch; a cron that exists only on a feature branch never runs and is not even listed|||schedule chỉ đọc tệp workflow từ nhánh mặc định; một cron chỉ nằm trên nhánh tính năng không bao giờ chạy và còn không được liệt kê',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured on the sandbox: ch01-cron-nhanh.yml with */5 on branch ch01-workflow had zero runs, and gh answered "could not find any workflows named …". Tempting wrong answer: quoting — an unquoted */5 is a YAML parse error (an alias), which shows up as a failed run, not as silence.|||VI: Đo trên sân tập: ch01-cron-nhanh.yml với */5 trên nhánh ch01-workflow có 0 lần chạy, và gh trả lời "could not find any workflows named …". Phương án sai hấp dẫn: đặt nháy — */5 không nháy là lỗi phân tích YAML (một alias), hiện ra thành một run hỏng chứ không phải im lặng.',
          },
          {
            question: 'On PR #1 the push runs of both branches were green and the pull_request run was red, with GITHUB_SHA = 0815f9a. Which statement is true about 0815f9a?|||Trên PR #1, run push của cả hai nhánh đều xanh còn run pull_request đỏ, với GITHUB_SHA = 0815f9a. Phát biểu nào về 0815f9a là đúng?',
            options: [
              'It is the latest commit on the PR branch, which GitHub rebased onto main before testing|||Đó là commit mới nhất trên nhánh PR, được GitHub rebase lên main trước khi kiểm',
              'It is the base branch tip; pull_request tests main to make sure it is still green|||Đó là đầu nhánh gốc; pull_request kiểm main để chắc nó vẫn xanh',
              'It is a merge commit GitHub created at refs/pull/1/merge, with the base tip and the PR tip as its two parents; it lives on no branch|||Đó là một merge commit GitHub tạo tại refs/pull/1/merge, với đầu nhánh gốc và đầu nhánh PR là hai cha; nó không nằm trên nhánh nào',
              'It is a cached result from an earlier run, which is why it differs from head.sha|||Đó là kết quả trong cache từ một lần chạy trước, nên mới khác head.sha',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The API shows 0815f9a = "Merge e1459aa into 93c3050" with parents 93c3050 (base) and e1459aa (PR). The red result came from a contract between two files that were never edited together. Tempting wrong answer: "rebased" — GitHub does not rewrite your branch; it builds a separate two-parent commit.|||VI: API cho thấy 0815f9a = "Merge e1459aa into 93c3050" với hai cha 93c3050 (gốc) và e1459aa (PR). Kết quả đỏ đến từ khế ước giữa hai file chưa từng được sửa cùng nhau. Phương án sai hấp dẫn: "rebase" — GitHub không viết lại nhánh của bạn; nó dựng một commit hai cha riêng.',
          },
          {
            question: 'A workflow on pull_request_target checks out ref: github.event.pull_request.head.sha and then runs npm install to build a preview. Why is this dangerous?|||Một workflow pull_request_target checkout ref: github.event.pull_request.head.sha rồi chạy npm install để dựng bản xem thử. Vì sao việc này nguy hiểm?',
            options: [
              'Because the PR author&#39;s code (e.g. a postinstall script) now runs with the base repository&#39;s secrets and write token — any fork can steal them|||Vì mã của tác giả PR (vd một script postinstall) giờ chạy CÙNG bí mật và token có quyền ghi của kho gốc — bất kỳ fork nào cũng lấy được chúng',
              'Because pull_request_target runs on the merge commit, which may contain conflicts|||Vì pull_request_target chạy trên merge commit, có thể chứa xung đột',
              'Because head.sha is not reachable from any branch, so checkout fails intermittently|||Vì head.sha không với tới được từ nhánh nào, nên checkout hỏng lúc được lúc không',
              'Because npm install is not allowed on pull_request_target runners|||Vì npm install không được phép trên runner của pull_request_target',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: pull_request_target runs the BASE workflow with secrets; that is safe only while it never executes PR code. Adding ref: head.sha is exactly combination 3 of Lesson 1.4, where a rewritten postinstall printed the secret. Tempting wrong answer: "merge commit" — that is pull_request; pull_request_target checks out the base by default.|||VI: pull_request_target chạy workflow của nhánh GỐC kèm bí mật; chỉ an toàn khi nó không bao giờ chạy mã PR. Thêm ref: head.sha chính là tổ hợp 3 của bài 1.4, nơi một postinstall bị viết lại đã in bí mật ra. Phương án sai hấp dẫn: "merge commit" — đó là pull_request; pull_request_target mặc định checkout nhánh gốc.',
          },
          {
            question: 'A workflow has push: paths: ["app/*"]. You push a commit that only adds app/con/sau.js. What happens?|||Một workflow có push: paths: ["app/*"]. Bạn push một commit chỉ thêm app/con/sau.js. Chuyện gì xảy ra?',
            options: [
              'It runs, because app/con/sau.js is inside the app folder|||Nó chạy, vì app/con/sau.js nằm trong thư mục app',
              'It fails with a "pattern matched no files" error visible in the Actions tab|||Nó hỏng với lỗi "pattern matched no files" hiện ở tab Actions',
              'It runs once with a warning that the pattern should be app/**|||Nó chạy một lần kèm cảnh báo rằng mẫu nên là app/**',
              'Nothing runs and nothing is recorded: * does not cross /, so app/* only matches files directly inside app/|||Không có gì chạy và không có gì được ghi lại: * không vượt qua /, nên app/* chỉ khớp file nằm NGAY trong app/',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured on the sandbox (commit 8d5a151): the app/** workflow ran, the app/* workflow did not, and there is no skipped run to see. Only b7d67dd (app/tinh.js) started both. Tempting wrong answer: "it runs, the file is inside app" — true for a human reading the path, false for the glob.|||VI: Đo trên sân tập (commit 8d5a151): workflow app/** chạy, workflow app/* không chạy, và không có run "bị bỏ qua" nào để xem. Chỉ b7d67dd (app/tinh.js) khởi động cả hai. Phương án sai hấp dẫn: "chạy, vì file nằm trong app" — đúng với mắt người đọc đường dẫn, sai với mẫu glob.',
          },
        ],
      },
    },
  ],
};
