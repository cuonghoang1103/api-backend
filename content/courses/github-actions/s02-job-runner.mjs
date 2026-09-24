import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 2: Job và runner.
 * Số đo: run 32662461744 đọc qua API — 5 job, 5 runner_id, ba nền tảng,
 * và 5 phút 12 giây máy dựng-xong-không-dùng-được.
 */

export default {
  title: 'Chapter 2 — Jobs, runners, and the machines that wait|||Chương 2 — Job, runner, và những cỗ máy ngồi chờ',
  slug: 'ga-ch2-job-runner',
  description: 'Một lần chạy, 5 job, 5 `runner_id` khác nhau — không gì sống sót giữa hai job. Ba nền tảng chạy CÙNG một lệnh chênh nhau 2,8 lần. Và `needs:` đợi TRỌN ma trận, để lại 5m12s máy đã dựng xong mà không dùng được.',
  sortOrder: 3,
  lessons: [

    /* ─────────────────────────── 2.0 ─────────────────────────── */
    {
      title: '2.0 — Chapter 2 slides: jobs, runners and matrices in pictures|||2.0 — Slide Chương 2: job, runner và ma trận bằng hình',
      slug: 'ga-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 2: mỗi job một cỗ máy (đo cả máy bật sẵn), năm pha của một job, needs và outputs, bảng if:, ba shell trên ba hệ điều hành, pipefail, outcome/conclusion, ma trận include/exclude/fail-fast — mọi log chạy thật trên sân tập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: two chained jobs on two different machines, a "new" machine that had been booted for two and a half minutes before the push, a job graph where one failure skips two jobs and three conditional jobs still run, the same two lines of script green on Windows and red on Linux, and a matrix of 2 × 3 − 1 + 1 = 6 jobs.</p>
<p>Slides 3–8 belong to Lesson 2.1, 9–15 to 2.2, 16–20 to 2.3, 21–24 to 2.4 and 25–29 to 2.5. The last three are the chapter&#39;s common mistakes, a cheat sheet, and a 45-minute practice session. Every new log is real: recorded on 24 September 2026 on GitHub-hosted runners (<code>ubuntu-24.04</code>, <code>ubuntu-24.04-arm</code>, <code>ubuntu-slim</code>, <code>windows-2025</code>, <code>macos-15</code>) in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch02-job</code>, plus actionlint 1.7.12; the release-run figures come from this site&#39;s own repository. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: hai job nối nhau chạy trên hai cỗ máy khác hẳn nhau, một cỗ máy "mới" đã bật sẵn hai phút rưỡi trước cú push, một đồ thị job mà một cú hỏng làm hai job bị bỏ qua còn ba job có điều kiện vẫn chạy, cùng hai dòng script xanh trên Windows mà đỏ trên Linux, và một ma trận 2 × 3 − 1 + 1 = 6 job.</p>
<p>Slide 3–8 thuộc Bài 2.1, 9–15 thuộc 2.2, 16–20 thuộc 2.3, 21–24 thuộc 2.4 và 25–29 thuộc 2.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi log mới là THẬT: ghi ngày 24/09/2026 trên runner của GitHub (<code>ubuntu-24.04</code>, <code>ubuntu-24.04-arm</code>, <code>ubuntu-slim</code>, <code>windows-2025</code>, <code>macos-15</code>) trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch02-job</code>, cộng actionlint 1.7.12; số của lần chạy phát hành lấy từ chính kho của trang này — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('ga-02', [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Hai job nối nhau bằng needs — hai cỗ máy'],
  [4, 'Máy “mới” đã bật sẵn từ trước'],
  [5, 'Dòng thời gian một job'],
  [6, '“Set up job” là lý lịch cỗ máy'],
  [7, 'Bảng nhãn runs-on và số đo thật'],
  [8, 'Nhãn gõ sai: xếp hàng mãi'],
  [9, 'Một job hỏng: phụ thuộc bị SKIP'],
  [10, 'Bảng if: của job'],
  [11, 'outputs qua bốn chặng'],
  [12, 'needs chỉ thấy cha trực tiếp'],
  [13, 'Đường tới hạn'],
  [14, 'Mỗi cạnh needs tốn vài giây'],
  [15, 'Bốn kênh qua ranh giới job'],
  [16, 'Ba shell mặc định'],
  [17, 'Windows: lệnh hỏng giữa script, bước xanh'],
  [18, 'Đường dẫn, CRLF, hoa thường'],
  [19, 'bash 3.2 trên macOS'],
  [20, 'Giá mỗi phút theo nền tảng'],
  [21, 'Thiếu pipefail: bước vẫn xanh'],
  [22, 'outcome ≠ conclusion'],
  [23, 'export, cd, GITHUB_ENV'],
  [24, 'if: của bước sau hỏng và huỷ'],
  [25, 'Ma trận nở: include / exclude'],
  [26, 'Ma trận: YAML và 6 job thật'],
  [27, 'fail-fast bật và tắt'],
  [28, 'Nhánh thử nghiệm được hỏng'],
  [29, 'max-parallel: 1'],
  [30, 'Sai lầm hay gặp'],
  [31, 'Bảng tra nhanh'],
  [32, 'Thực hành Chương 2'],
])}
`,
    },

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — A job is a whole machine, and you get a new one every time|||2.1 — Một job là cả một cỗ máy, và mỗi lần bạn được một cái mới',
      slug: 'ga-2-1-may-moi',
      type: 'VIDEO',
      description: 'Một lần chạy, 5 job, và 5 `runner_id` khác nhau — đo qua API chứ không suy từ tài liệu. Xếp hàng 2–3 giây, đối chiếu với 41–268 phút của cron. Và danh sách chính xác những gì KHÔNG sống sót giữa hai job.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>A job is a whole machine, and you get a new one every time</h2>
<p class="lead">The word "job" suggests something small — a task, a unit of work. It is not small. Each job in a workflow gets its own virtual machine, booted for that job, thrown away when the job ends. Almost every confusing thing about Actions follows from that one fact, so this lesson establishes it by measurement rather than by assertion.</p>

<h3>The measurement</h3>
<p>Run 32662461744 of this repository&#39;s desktop release had five jobs. The API reports a <code>runner_id</code> for each one:</p>

<div class="out">job           nen tang          runner_id   XEP HANG     CHAY
--------------------------------------------------------------
Kiem tra ma   ubuntu-latest    1000003394         3s      72s
Dung Linux    ubuntu-latest    1000003395         3s     241s
Dung macOS    macos-latest     1000003396         3s     437s
Dung Windows  windows-latest   1000003397         3s     323s
Cong bo       ubuntu-latest    1000003398         2s      34s

5 job -> 5 runner_id KHAC NHAU: [1000003394 .. 1000003398]</div>

<div class="callout">
<p><strong>Five jobs, five machines.</strong> Note that three of them asked for the same label, <code>ubuntu-latest</code>, and still got three different runners. "Same label" means "same kind of machine", never "the same machine". There is no arrangement of workflow syntax that gets two jobs onto one runner.</p>
</div>
<h3>Measured again on the sandbox: two chained jobs, two machines</h3>
${slide('ga-02', 3, 'Two jobs chained by needs — two different machines')}
<p>The figures above come from the API of an existing release workflow. To see it for yourself you have to run it, so this course has a public sandbox repository (<a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch02-job</code>). The workflow <code>ch02-needs.yml</code> has a job <code>chuan-bi</code> that writes one file into <code>/tmp</code> and one into <code>$HOME</code>, then prints the machine&#39;s identity; a job <code>dung</code> declares <code>needs: chuan-bi</code> — so it runs AFTER it, in the SAME run — prints its identity and looks for those two files. Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945596" target="_blank" rel="noopener">35989945596</a>, 24 September 2026:</p>
<div class="out"># job chuan-bi
runner_name : GitHub Actions 1000004262
hostname    : runnervmtr4k5
machine-id  : fa19dc2cce72
may bat tu  : 2026-09-24 10:52:06 (da song 152.25s)
-rw-r--r-- 1 runner runner 22 Sep 24 10:54 /tmp/dau-vet.txt
-rw-r--r-- 1 runner runner  8 Sep 24 10:54 /home/runner/dau-vet.txt

# job dung  (needs: chuan-bi — chay SAU, cung run)
runner_name : GitHub Actions 1000004282
hostname    : runnervmlun5p
machine-id  : 58b34b8c91a9
may bat tu  : 2026-09-24 10:53:13 (da song 92.50s)
ls: cannot access '/tmp/dau-vet.txt': No such file or directory
ls: cannot access '/home/runner/dau-vet.txt': No such file or directory
&gt;&gt; khong co gi cua job chuan-bi</div>
<p>Three things differ at once: <code>runner_name</code>, <code>hostname</code> and <code>machine-id</code> (an identifier systemd generates once per operating-system install). This is not "the same machine, cleaned" — it is two machines. And <code>needs:</code> decides ORDER only; it does not connect one machine to the other: <code>dung</code> ran three seconds after <code>chuan-bi</code> and saw not a single byte it left behind.</p>
<p>The run had 8 jobs but only 6 <code>runner_id</code>s: the two <strong>skipped</strong> jobs (Lesson 2.2) have <code>runner_id: null</code>. A skipped job asks for no machine and costs no seconds — a small detail, but it is why an <code>if:</code> at JOB level is far cheaper than the same condition on every step inside a job that already holds a machine.</p>

<h3>"New machine" means unused — not freshly booted</h3>
${slide('ga-02', 4, 'The “new” machine was booted before you pushed')}
<p>The <code>may bat tu</code> line in the log above holds a surprise. The <code>chuan-bi</code> machine had been up for <strong>152 seconds</strong> when the job&#39;s first step ran, so it booted at 10:52:06 — nearly two and a half minutes BEFORE anyone ran <code>git push</code> at 10:54:34. The <code>dung</code> machine booted at 10:53:13, also before the push. Neither was booted "for" your job; they were already up and waiting.</p>
<p>That is the explanation for the 2–3 second queue time further down: no virtual machine boots in 2 seconds, but taking one that is already waiting in a pool does. GitHub does not document the pool (a note from the course: this is INFERRED from the <code>uptime</code> measurement, not taken from documentation), but the documentation does guarantee the part that matters: each job runs in a fresh instance, and that instance is destroyed when the job ends.</p>
<div class="kv-grid">
<div class="kv"><span class="k">"new" IS guaranteed</span><span class="v">no other job has run on this machine; there are no files, processes, variables or secrets from anyone else (or from your own previous job)</span></div>
<div class="kv"><span class="k">"new" is NOT guaranteed</span><span class="v">that the machine has just booted; that the clock starts at the job; that all machines with a label sit in one region. Three jobs of one course run landed in <code>westus2</code>, <code>centralus</code> and <code>eastus</code></span></div>
<div class="kv"><span class="k">the security consequence</span><span class="v">because the machine is destroyed, a malicious job cannot leave anything for the next one. A SELF-HOSTED runner is the opposite: by default it reuses one machine, so what a previous job left the next job sees — which is why Chapter 13 says never to attach a self-hosted runner to a public repository</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — using "new machine" as a reason not to clean up.</strong> On GitHub&#39;s runners you genuinely need not clean. But a workflow written with that habit will one day be moved to a self-hosted runner (a GPU box, a machine inside a private network), and there the previous run&#39;s <code>node_modules</code>, a forgotten <code>.env</code> and a still-running container are all STILL THERE. Writing the cleanup step with <code>if: always()</code> from the start (Lesson 2.4) is cheaper than discovering this after an incident.</p>
</div>


<h3>What that costs you, concretely</h3>
<p>Everything a job does to its own filesystem, environment, or installed software is gone when the job ends. The list is longer than people expect:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the checked-out repository</span><span class="lz-lnote">every job that wants the code runs <code>actions/checkout</code> again. Five jobs, five clones</span></div>
<div class="lz-layer"><span class="lz-lname"><code>node_modules</code> and every other install</span><span class="lz-lnote"><code>npm ci</code> in job A does nothing for job B. This is the single largest source of wasted CI minutes, and Chapter 5 measures the cache that fixes it</span></div>
<div class="lz-layer"><span class="lz-lname">files your steps wrote</span><span class="lz-lnote">a build output in <code>dist/</code> exists only inside the job that produced it. Getting it to the next job requires an artifact — an explicit upload and download, measured in 2.2</span></div>
<div class="lz-layer"><span class="lz-lname">environment variables you exported</span><span class="lz-lnote">and, within a job, even between <em>steps</em>: a plain <code>export FOO=bar</code> in one <code>run:</code> block is invisible to the next one, because each step is a separate shell process</span></div>
<div class="lz-layer"><span class="lz-lname">running background processes</span><span class="lz-lnote">a database you started, a server you backgrounded — all killed. The machine is destroyed, not tidied</span></div>
<div class="lz-layer"><span class="lz-lname">anything the job installed with apt/brew/choco</span><span class="lz-lnote">24 seconds of system libraries in one job buys the next job nothing</span></div>
</div>

<p>What <em>does</em> survive is deliberately narrow: artifacts (uploaded explicitly, retained for a configured period), caches (keyed, best-effort, and never guaranteed), job outputs (small strings, declared), and whatever you pushed to a real external system such as a registry or a server.</p>

<div class="pitfall">
<p><strong>Trap — expecting <code>export</code> to reach the next step.</strong> Each <code>run:</code> block is its own shell. <code>export VERSION=1.2.3</code> in step 4 is simply gone by step 5. The mechanism that does work is writing to the file named by <code>\$GITHUB_ENV</code>: <code>echo "VERSION=1.2.3" &gt;&gt; \$GITHUB_ENV</code> makes <code>\$VERSION</code> available in every <em>later</em> step — but still not in the step that wrote it, and never in another job.</p>
</div>

<h3>Queueing is fast — and this is the surprising part</h3>
<p>Look at the queue column again: 2 to 3 seconds from job creation to job start, for all five jobs, including the macOS and Windows ones. Compare that with the other number this course has measured:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a job waiting for a runner</span><span class="lz-t">2–3 seconds</span><span class="lz-d">measured across five jobs on three platforms in one run</span></div>
<div class="lz-step"><span class="lz-k">a scheduled run waiting to be queued</span><span class="lz-t">41–268 minutes</span><span class="lz-d">measured across ten runs in lesson 1.3</span></div>
</div>

<div class="callout ok">
<p><strong>These are two different systems and it is worth keeping them apart.</strong> Once a run exists, getting machines for its jobs is quick. The multi-hour delay in lesson 1.3 happens <em>before</em> that — in deciding to create the run at all. So "CI is slow today" almost never means the runner pool is short; it means either your jobs genuinely take that long, or the run was late to be created. The distinction tells you which number to go look at.</p>
</div>

<h3>The five phases of a job, read from the log and the API</h3>
${slide('ga-02', 5, 'A job’s timeline: queued → Set up → steps → Post')}
<p>A job does not start at the first step you wrote, and it does not end at the last one. The API returns the step list with numbers and timestamps, and that list always contains steps you did not write. This is the job <code>buoc</code> in run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">35989945632</a> (eleven steps by the author, two actions):</p>
<div class="out">$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35989945632/jobs \\
    --jq '.jobs[0].steps[] | "\\(.number) \\(.name) \\(.conclusion)"'
1  Set up job                          success
2  Run actions/checkout@v7             success
3  Run actions/setup-node@v7           success
4  1. Ong, shell MAC DINH              success
...
11 8. Hong that                        failure
12 9. Bi bo qua (success() ngam dinh)  skipped
13 10. failure()                       success
14 11. always()                        success
27 Post Run actions/setup-node@v7      skipped
28 Post Run actions/checkout@v7        success
29 Complete job                        success

job: created 10:54:35 · started 10:54:38 · completed 10:54:46</div>
<table>
<tr><th>Phase</th><th>What happens</th><th>Failing here means</th></tr>
<tr><td><strong>queued</strong></td><td>the job exists and waits for a runner matching the <code>runs-on</code> label. Measured: 3 seconds</td><td>a wrong label or the concurrency limit — the job hangs in <code>queued</code> with NO log at all</td></tr>
<tr><td><strong>Set up job</strong></td><td>the runner prints the machine&#39;s record and the token&#39;s permissions, then downloads EVERY action in <code>uses:</code> up front</td><td>an action with a wrong name or tag, or one blocked by an organisation policy</td></tr>
<tr><td><strong>steps</strong></td><td>each step in order; every <code>run:</code> is a new shell process</td><td>your bug — a non-zero exit code</td></tr>
<tr><td><strong>Post</strong></td><td>each action&#39;s cleanup, in REVERSE order: setup-node (step 3) is cleaned at step 27, BEFORE checkout (step 2) at step 28</td><td>rare; usually an action saving a cache or uploading logs</td></tr>
<tr><td><strong>Complete job</strong></td><td>evaluates the job&#39;s <code>outputs:</code>, kills orphan processes, reports back</td><td>an output dropped because it may contain a secret; a background process killed</td></tr>
</table>
<p>Two more details are worth keeping. One: the numbering jumps from 14 to 27 — the runner reserves slots for Post steps, so a gap in the numbering does not mean a missing step. Two: the job&#39;s "completed" time (10:54:46) is four seconds after the <code>Complete job</code> step (10:54:42) — that is finalising and reporting, and it is counted in the job duration you see in the UI.</p>

<h3>"Set up job" is the machine&#39;s record</h3>
${slide('ga-02', 6, '“Set up job” is the machine’s record')}
<p>Expanding the "Set up job" group in the log is the first thing to do when a workflow changes behaviour without a commit. Here it is, verbatim, for the job <code>chuan-bi</code>:</p>
<div class="out">Current runner version: '2.337.0'
Runner Image Provisioner
  Hosted Compute Agent  Version: 20260828.587
  Azure Region: westus2
Operating System
  Ubuntu 24.04.5 LTS
Runner Image
  Image: ubuntu-24.04
  Version: 20260920.314.1
  Included Software: https://github.com/actions/runner-images/blob/ubuntu24/20260920.314/images/ubuntu/Ubuntu2404-Readme.md
GITHUB_TOKEN Permissions
  Contents: read · Metadata: read · Packages: read
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Complete job name: chuan-bi</div>
<div class="kv-grid">
<div class="kv"><span class="k">Runner Image · Version</span><span class="v">the version of the machine IMAGE, changing almost weekly. Compare this line between the last green run and the first red one; if it differs, open the "Included Software" page to see which tool jumped</span></div>
<div class="kv"><span class="k">Current runner version</span><span class="v">the version of the runner PROGRAM (what receives the job, runs steps, ships logs). Self-updating, rarely the cause</span></div>
<div class="kv"><span class="k">Azure Region</span><span class="v">where the machine lives. Two jobs of one run can be in two regions — one slow download says nothing about the other job</span></div>
<div class="kv"><span class="k">GITHUB_TOKEN Permissions</span><span class="v">the ACTUAL permissions of the token in this job, after your <code>permissions:</code> are applied. The first place to look for any 403 (Chapter 6)</span></div>
<div class="kv"><span class="k">Prepare all required actions</span><span class="v">downloads every <code>uses:</code> before any step runs. A misspelled action fails the job RIGHT HERE — before your first step</span></div>
</div>

<h3>Picking the machine: <code>runs-on</code></h3>
${slide('ga-02', 7, 'The runs-on label table, measured')}

<p>Across this repository&#39;s eleven workflows:</p>

<div class="out">runs-on: ubuntu-24.04    11   <- GHIM phien ban
runs-on: ubuntu-latest    2
runs-on: &#36;{{ matrix.os }}  1   <- no ra macos-latest, windows-latest, ubuntu-latest</div>

<p>Eleven pinned against two floating is a deliberate ratio, and the reasoning is the same as pinning a dependency version. <code>ubuntu-latest</code> is not a constant: it moved from 20.04 to 22.04 to 24.04, each time on a rollout schedule, and each move changed preinstalled tool versions underneath workflows that had not been edited. A workflow that was green on Friday can be red on Monday with no commit in between.</p>

<div class="kv-grid">
<div class="kv"><span class="k">pinned — <code>ubuntu-24.04</code></span><span class="v">changes when you change it. The cost is that you must eventually move, and GitHub deprecates old images on a published timeline</span></div>
<div class="kv"><span class="k">floating — <code>ubuntu-latest</code></span><span class="v">changes when GitHub changes it. The benefit is you never do the migration yourself; the cost is you do not choose when it happens</span></div>
<div class="kv"><span class="k">the reasonable split</span><span class="v">pin anything whose failure blocks a deploy; float things where a surprise is cheap. This repository pins its lint and deploy paths and floats the desktop release matrix</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating a preinstalled tool as a stable interface.</strong> Runner images ship a large set of preinstalled software, and it is tempting to just call <code>node</code>, <code>python</code> or <code>docker</code> and rely on whatever is there. Those versions change with the image. The fix is not to distrust the runner but to <em>declare</em>: <code>actions/setup-node@v4</code> with an explicit version costs 8 to 22 seconds — measured on the three platforms in 2.3 — and makes the version a property of your workflow instead of a property of GitHub&#39;s rollout schedule.</p>
</div>

<h3>The runner label table, and the one-core machine</h3>
<p><code>runs-on</code> does not pick a machine — it picks a KIND of machine by label. The table below lists GitHub&#39;s standard runners from the "GitHub-hosted runners" documentation (as of 09/2026). The private-repository column matters more than people expect: with the same label <code>ubuntu-latest</code>, a public repository gets 4 cores and a private one gets 2.</p>
<table>
<tr><th>Label</th><th>Public repo</th><th>Private repo</th><th>Notes</th></tr>
<tr><td><code>ubuntu-slim</code></td><td>1 core · 5 GB</td><td>1 core · 5 GB</td><td>a container, not a VM; the cheapest</td></tr>
<tr><td><code>ubuntu-latest</code>, <code>ubuntu-24.04</code>, <code>ubuntu-22.04</code>, <code>ubuntu-26.04</code></td><td>4 cores · 16 GB</td><td>2 cores · 8 GB</td><td>x64</td></tr>
<tr><td><code>ubuntu-24.04-arm</code>, <code>ubuntu-22.04-arm</code></td><td>4 cores · 16 GB</td><td>2 cores · 8 GB</td><td>arm64 — cheaper than x64 in private repos</td></tr>
<tr><td><code>windows-latest</code>, <code>windows-2025</code>, <code>windows-2022</code></td><td>4 cores · 16 GB</td><td>2 cores · 8 GB</td><td>default shell is PowerShell (Lesson 2.3)</td></tr>
<tr><td><code>macos-latest</code>, <code>macos-15</code>, <code>macos-26</code></td><td>3 cores (M1) · 7 GB</td><td>3 cores (M1) · 7 GB</td><td>arm64; <code>macos-15-intel</code> is the Intel one</td></tr>
</table>
<p>The <code>ubuntu-slim</code> label deserves its own measurement, because it is the only kind of machine that is DIFFERENT IN KIND. The workflow <code>ch02-nhan.yml</code> runs the same step on it and on <code>ubuntu-24.04</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990300992" target="_blank" rel="noopener">35990300992</a>):</p>
<div class="out"># job slim  (runs-on: ubuntu-slim)           # job chuan  (runs-on: ubuntu-24.04)
VM Image: Source: Docker · Name: ubuntu:24.04     Image: ubuntu-24.04 · Version 20260920.314.1
CPU: 1 · RAM: 4.8Gi · dia /: 50G                  CPU: 4 · RAM: 15Gi · dia /: 145G
ao hoa: docker                                    ao hoa: microsoft
docker: /usr/bin/docker                           docker: /usr/bin/docker
job: 2s                                           job: 4s</div>
<p>The slim job&#39;s "Set up job" log has no "Runner Image" section; it has "VM Image: Source: Docker, Name: ubuntu:24.04", and <code>systemd-detect-virt</code> answers <code>docker</code>: this is a container running on a VM, one core, under 5 GB of RAM. It suits small, short jobs — labelling a PR, sending a notification, calling an API, format-checking one file — where the 4 cores of a standard machine just sit idle. It does not suit anything that builds code or runs heavy tests.</p>
<div class="kv-grid">
<div class="kv"><span class="k">one label</span><span class="v"><code>runs-on: ubuntu-24.04</code> — the most common form</span></div>
<div class="kv"><span class="k">an expression</span><span class="v"><code>runs-on: &#36;{{ matrix.os }}</code> — the label comes from a matrix (Lesson 2.5)</span></div>
<div class="kv"><span class="k">a list of labels</span><span class="v"><code>runs-on: [self-hosted, linux, gpu]</code> — the machine must carry ALL of them. This form is for self-hosted runners</span></div>
<div class="kv"><span class="k">a runner group</span><span class="v"><code>runs-on: { group: team-group, labels: [...] }</code> — for an organisation&#39;s larger or self-hosted runners</span></div>
</div>

<h3>One typo in runs-on: no error, just waiting</h3>
${slide('ga-02', 8, 'A misspelled label: the job queues forever')}
<p>The third job in <code>ch02-nhan.yml</code> deliberately says <code>runs-on: ubuntu-lastest</code> (misspelled) and sets <code>timeout-minutes: 5</code>. What was measured:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color
.github/workflows/ch02-nhan.yml:24:14: label "ubuntu-lastest" is unknown. available labels are
  "windows-latest", ..., "ubuntu-slim", "ubuntu-latest", ..., "macos-15", ... [runner-label]

$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35990300992/jobs \\
    --jq '.jobs[] | "\\(.name) \\(.status) \\(.labels)"'
slim    completed  ["ubuntu-slim"]
chuan   completed  ["ubuntu-24.04"]
go-sai  queued     ["ubuntu-lastest"]     # tao luc 10:58:25, 11:04:42 van queued

$ gh run cancel 35990300992
go-sai  completed/cancelled  11:04:45</div>
<p>No error appears anywhere in the UI. The job sat in <code>queued</code> for six minutes seventeen seconds — past its own 5-minute timeout — until it was cancelled by hand. The reason: to GitHub an unknown label is not a syntax error; it might belong to a self-hosted runner you have not switched on yet, so GitHub WAITS. And <code>timeout-minutes</code> only counts the time a job RUNS, not the time it queues. GitHub&#39;s limits page says a job can sit in the queue for up to 24 hours before it is cancelled automatically.</p>
<div class="callout ok">
<p><strong>A 30-second diagnosis.</strong> A job stuck on "Waiting for a runner to pick up this job" with no log at all: do not wait — look at exactly two things: the label in <code>runs-on</code> (against the table above, or run actionlint, which lists every valid label) and how many jobs are running on the account (Free plan: 20 concurrent jobs, at most 5 macOS — Lesson 2.5). Only when it is neither should you suspect an incident on GitHub&#39;s side.</p>
</div>

<h3>The runner is a real machine, and you can look at it</h3>
<p>Two habits pay for themselves the first time a job behaves impossibly. Neither needs any tooling:</p>

<pre><code>- name: Cai gi dang chay o day
  run: |
    <span class="tok-comment"># danh tinh may</span>
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    <span class="tok-comment"># tai nguyen — cai nay giai thich phan lon cu OOM</span>
    nproc; free -h; df -h /
    <span class="tok-comment"># phien ban that cua thu ban dang goi</span>
    node --version; npm --version</code></pre>

<p>The memory line in particular is worth having in your reflexes. The most expensive CI failure in this repository&#39;s history was <code>vite build</code> exiting 134 with <code>Reached heap limit</code> on a macOS runner while building green in twenty seconds on a developer machine with far more RAM. The runner was not broken and the code was not wrong; the two machines were different sizes, which is exactly the fact this lesson is about.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> A job is a machine you rent for the length of the job, and the design consequence is that <em>every</em> transfer of state — between jobs, between runs, between steps — has to be something you asked for explicitly, and therefore something you can find in the YAML when it is missing.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Do two jobs in the same workflow share a disk? If the build job produces <code>dist/</code>, how does the deploy job get it?</strong><br>A: No. Each job runs on a new runner that is destroyed when the job ends — even when the later job <code>needs:</code> the earlier one. Files go through an artifact (<code>upload-artifact</code> in the build job, <code>download-artifact</code> in the deploy job); short strings such as a version number go through <code>outputs</code>. A cache is not a way to hand over results, because it can miss.</p>
<p><strong>Q: <code>ubuntu-latest</code> or <code>ubuntu-24.04</code>?</strong><br>A: <code>-latest</code> is an alias GitHub moves on its own schedule, and the image underneath changes weekly anyway. For jobs whose failure blocks a release (build, deploy), pin a version so an OS change is DELIBERATE; for cheap, easy-to-fix jobs, <code>-latest</code> is fine. Either way, declare tool versions with an action (<code>setup-node</code> with a quoted version) instead of relying on whatever the image ships.</p>
<p><strong>Q: A job stays "queued" and has no log. What do you check?</strong><br>A: The <code>runs-on</code> label (a typo, or the label of a self-hosted runner that is offline — GitHub does not error, it waits, and <code>timeout-minutes</code> does not apply while queued); the plan&#39;s concurrent-job limit (Free 20, macOS 5); only then GitHub&#39;s status page.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team lead asks why the deploy job "cannot see" the <code>dist/</code> folder the build job just created. You want to prove it with numbers, not words.</p><ol>
<li>In a test repository of yours, create <code>.github/workflows/two-machines.yml</code> with two jobs <code>a</code> and <code>b</code> (<code>b</code> has <code>needs: a</code>). Each job prints <code>$RUNNER_NAME</code>, <code>hostname</code>, <code>cut -c1-12 /etc/machine-id</code> and <code>cut -d' ' -f1 /proc/uptime</code>.</li>
<li>Job <code>a</code> writes <code>echo hello &gt; /tmp/trace.txt</code>; job <code>b</code> runs <code>ls -l /tmp/trace.txt || echo "not found"</code>.</li>
<li>Push, then <code>gh run view --log</code>. Expand "Set up job" for both jobs and note the Image Version and the Azure Region.</li>
<li>Run <code>gh api repos/&lt;you&gt;/&lt;repo&gt;/actions/runs/&lt;id&gt;/jobs --jq '.jobs[] | "\\(.name) \\(.runner_id) \\(.created_at) \\(.started_at)"'</code> and work out each job&#39;s queue time.</li>
<li>Add a third job with <code>runs-on: ubuntu-lastest</code>, push, watch for 3 minutes, then <code>gh run cancel &lt;id&gt;</code>. Remove that job.</li></ol>
<p><strong>Done when:</strong> you have two <code>runner_id</code>s, two different <code>hostname</code>s and the "not found" line; the machine&#39;s <code>uptime</code> is longer than the time since you pushed (a pre-booted machine); you can state each job&#39;s queue time in seconds; and the misspelled-label job stayed <code>queued</code> with no log until cancelled.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runner</span><span class="v">The machine that executes a job. GitHub&#39;s runners are single-use VMs (or a container, for <code>ubuntu-slim</code>).</span></div>
  <div class="kv"><span class="k">Label</span><span class="v">The string in <code>runs-on</code> that picks a KIND of machine: <code>ubuntu-24.04</code>, <code>windows-2025</code>, <code>macos-15</code>…</span></div>
  <div class="kv"><span class="k">Ephemeral</span><span class="v">The machine takes exactly one job and is destroyed — nothing survives into the next job.</span></div>
  <div class="kv"><span class="k">Runner image</span><span class="v">The OS plus preinstalled software of a runner; it has a version number and changes almost weekly.</span></div>
  <div class="kv"><span class="k">Queued</span><span class="v">The job exists but no runner has picked it up. No log; <code>timeout-minutes</code> is not counting yet.</span></div>
  <div class="kv"><span class="k">Set up job / Post / Complete job</span><span class="v">Steps the runner adds itself: prepare the machine and download actions; each action&#39;s cleanup (in reverse); finalise outputs and report.</span></div>
  <div class="kv"><span class="k">Self-hosted runner</span><span class="v">Your own machine running the runner program; NOT single-use by default, so what one job leaves the next one sees.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Each job = its own runner, even when two jobs share a label and are chained with <code>needs</code>. Measured: 8 jobs → 6 <code>runner_id</code>s (the 2 skipped jobs took no machine).</li>
<li>Nothing crosses a job boundary implicitly: files, <code>node_modules</code>, variables, background processes are all gone. The valid channels: artifacts, outputs, cache (not guaranteed), external systems.</li>
<li>"New machine" means unused, not just booted: the machines had been up 152s and 92s before the job arrived — which is why queueing takes only 2–3 seconds.</li>
<li>A job has 5 phases: queued → Set up job → steps → Post (reverse cleanup) → Complete job. "Set up job" is the machine&#39;s record: read it first when CI changes behaviour.</li>
<li><code>runs-on</code> picks a kind of machine; private repositories only get 2 cores/8 GB; <code>ubuntu-slim</code> is a 1-core container for small jobs.</li>
<li>A misspelled label raises no error — the job queues forever (measured 6m17s) and <code>timeout-minutes</code> does not help. actionlint catches it before you push.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — the hardware specs per platform, the available labels, and the statement that each job runs in a fresh instance.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — the actual image definitions, the full preinstalled-software list per image, and the announcement issues for every image rollout. This is where you check what changed when a green workflow goes red without a commit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_ENV and GITHUB_OUTPUT</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the supported ways to move a value from one step to a later one, and why <code>export</code> is not among them.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — a container is a process, and what dies with it</span><span class="lc-sub">/courses/docker/learn${REF} — the same disposable-machine model one level down, including why "it worked in my container" and "it worked on my runner" fail for identical reasons.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — each command is a process, and environment inheritance</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why <code>export</code> in one shell cannot reach another, which is the whole explanation for the step-to-step trap above.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Một job là cả một cỗ máy, và mỗi lần bạn được một cái mới</h2>
<p class="lead">Chữ "job" gợi ra thứ gì đó nhỏ — một tác vụ, một đơn vị công việc. Nó không nhỏ. Mỗi job trong một workflow được cấp một máy ảo riêng, khởi động cho đúng job đó, vứt đi khi job kết thúc. Gần như mọi thứ khó hiểu ở Actions đều chảy ra từ đúng một sự thật ấy, nên bài này xác lập nó bằng SỐ ĐO chứ không bằng khẳng định.</p>

<h3>Phép đo</h3>
<p>Lần chạy 32662461744 của bản phát hành desktop kho này có năm job. API báo một <code>runner_id</code> cho từng cái:</p>

<div class="out">job           nen tang          runner_id   XEP HANG     CHAY
--------------------------------------------------------------
Kiem tra ma   ubuntu-latest    1000003394         3s      72s
Dung Linux    ubuntu-latest    1000003395         3s     241s
Dung macOS    macos-latest     1000003396         3s     437s
Dung Windows  windows-latest   1000003397         3s     323s
Cong bo       ubuntu-latest    1000003398         2s      34s

5 job -> 5 runner_id KHAC NHAU: [1000003394 .. 1000003398]</div>

<div class="callout">
<p><strong>Năm job, năm cỗ máy.</strong> Để ý ba trong số đó xin cùng một nhãn, <code>ubuntu-latest</code>, mà vẫn nhận ba runner khác nhau. "Cùng nhãn" nghĩa là "cùng LOẠI máy", không bao giờ nghĩa là "cùng MỘT máy". Không có cách sắp xếp cú pháp workflow nào đưa được hai job lên chung một runner.</p>
</div>
<h3>Đo lại trên sân tập: hai job nối nhau, hai cỗ máy</h3>
${slide('ga-02', 3, 'Hai job nối nhau bằng needs — hai cỗ máy khác hẳn nhau')}
<p>Con số ở trên đọc từ API của một workflow phát hành có sẵn. Muốn thấy tận mắt thì phải tự chạy, nên khoá này có một kho sân tập công khai (<a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch02-job</code>). Workflow <code>ch02-needs.yml</code> có job <code>chuan-bi</code> ghi một tệp vào <code>/tmp</code> và một tệp vào <code>$HOME</code>, rồi in danh tính cỗ máy; job <code>dung</code> khai <code>needs: chuan-bi</code> — tức là chạy SAU nó, trong CÙNG một lần chạy — in lại danh tính và đi tìm hai tệp ấy. Lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945596" target="_blank" rel="noopener">35989945596</a>, ngày 24/09/2026:</p>
<div class="out"># job chuan-bi
runner_name : GitHub Actions 1000004262
hostname    : runnervmtr4k5
machine-id  : fa19dc2cce72
may bat tu  : 2026-09-24 10:52:06 (da song 152.25s)
-rw-r--r-- 1 runner runner 22 Sep 24 10:54 /tmp/dau-vet.txt
-rw-r--r-- 1 runner runner  8 Sep 24 10:54 /home/runner/dau-vet.txt

# job dung  (needs: chuan-bi — chay SAU, cung run)
runner_name : GitHub Actions 1000004282
hostname    : runnervmlun5p
machine-id  : 58b34b8c91a9
may bat tu  : 2026-09-24 10:53:13 (da song 92.50s)
ls: cannot access '/tmp/dau-vet.txt': No such file or directory
ls: cannot access '/home/runner/dau-vet.txt': No such file or directory
&gt;&gt; khong co gi cua job chuan-bi</div>
<p>Ba thứ khác nhau cùng lúc: <code>runner_name</code>, <code>hostname</code> và <code>machine-id</code> (một mã định danh mà systemd sinh ra một lần cho mỗi bản cài hệ điều hành). Không phải "cùng máy nhưng đã dọn" — là hai máy. Và <code>needs:</code> chỉ quyết định THỨ TỰ, nó không nối máy này với máy kia: job <code>dung</code> chạy sau <code>chuan-bi</code> ba giây mà không thấy một byte nào nó để lại.</p>
<p>Cả lần chạy có 8 job nhưng chỉ 6 <code>runner_id</code>: hai job bị <strong>skip</strong> (bài 2.2) có <code>runner_id: null</code>. Một job bị bỏ qua không xin máy, không tốn giây nào — chi tiết nhỏ, nhưng nó là lý do đặt <code>if:</code> ở mức JOB rẻ hơn hẳn đặt nó ở từng bước bên trong một job đã xin máy.</p>

<h3>"Máy mới" nghĩa là chưa ai dùng — không phải vừa bật</h3>
${slide('ga-02', 4, 'Máy “mới” đã bật sẵn từ trước khi bạn push')}
<p>Dòng <code>may bat tu</code> trong log ở trên chứa một bất ngờ. Máy của <code>chuan-bi</code> đã chạy được <strong>152 giây</strong> khi bước đầu tiên của job được thực thi, tức là nó bật lúc 10:52:06 — gần hai phút rưỡi TRƯỚC khi có ai đó <code>git push</code> lúc 10:54:34. Máy của <code>dung</code> bật lúc 10:53:13, cũng trước cú push. Không máy nào được bật "cho" job của bạn; chúng đã bật sẵn và đứng chờ.</p>
<p>Đó là lời giải thích cho con số xếp hàng 2–3 giây ở phần dưới: không có cỗ máy ảo nào khởi động được trong 2 giây, nhưng lấy một máy đang đứng chờ trong hồ ra thì được. GitHub không công bố chi tiết cái hồ ấy (ghi chú của khoá: đây là SUY RA từ số đo <code>uptime</code>, không phải từ tài liệu), nhưng tài liệu thì bảo đảm đúng điều quan trọng: mỗi job chạy trên một thực thể mới, và thực thể đó bị huỷ khi job xong.</p>
<div class="kv-grid">
<div class="kv"><span class="k">"mới" ĐƯỢC bảo đảm</span><span class="v">chưa job nào khác chạy trên máy này; không có tệp, tiến trình, biến hay bí mật của người khác (hay của chính job trước của bạn)</span></div>
<div class="kv"><span class="k">"mới" KHÔNG được bảo đảm</span><span class="v">máy vừa khởi động; đồng hồ bắt đầu từ lúc job chạy; mọi máy cùng nhãn nằm cùng một vùng. Ba job trong một run của khoá chạy ở <code>westus2</code>, <code>centralus</code> và <code>eastus</code></span></div>
<div class="kv"><span class="k">hệ quả cho bảo mật</span><span class="v">vì máy bị huỷ, một job độc hại không để lại được gì cho job sau. Runner TỰ HOST thì ngược lại: mặc định nó dùng lại một máy, nên thứ job trước để lại thì job sau thấy — lý do Chương 13 nói không bao giờ gắn runner tự host vào kho công khai</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dùng "máy mới" như một cái cớ để không dọn.</strong> Trên runner của GitHub thì đúng là không cần dọn. Nhưng workflow viết theo thói quen ấy sẽ được đem sang một runner tự host vào một ngày nào đó (máy có GPU, máy trong mạng nội bộ), và ở đó <code>node_modules</code> của lần trước, một tệp <code>.env</code> quên xoá, một container còn chạy đều CÒN ĐÓ. Viết bước dọn bằng <code>if: always()</code> ngay từ đầu (bài 2.4) rẻ hơn phát hiện ra chuyện này sau một sự cố.</p>
</div>


<h3>Nó khiến bạn mất gì, cụ thể</h3>
<p>Mọi thứ một job làm với hệ tệp, môi trường hay phần mềm cài thêm của chính nó đều biến mất khi job kết thúc. Danh sách dài hơn người ta tưởng:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">kho mã đã checkout</span><span class="lz-lnote">mỗi job muốn có mã đều phải chạy <code>actions/checkout</code> lại. Năm job, năm bản sao</span></div>
<div class="lz-layer"><span class="lz-lname"><code>node_modules</code> và mọi lần cài khác</span><span class="lz-lnote"><code>npm ci</code> ở job A chẳng làm gì cho job B. Đây là nguồn phí phạm phút CI lớn nhất, và Chương 5 đo cái cache vá nó</span></div>
<div class="lz-layer"><span class="lz-lname">file các bước của bạn đã ghi</span><span class="lz-lnote">một bản dựng trong <code>dist/</code> chỉ tồn tại bên trong job đã tạo ra nó. Đưa nó sang job kế đòi một artifact — một lượt tải lên và tải xuống tường minh, đo ở bài 2.2</span></div>
<div class="lz-layer"><span class="lz-lname">biến môi trường bạn đã export</span><span class="lz-lnote">và ngay trong một job, giữa các <em>bước</em> cũng vậy: một câu <code>export FOO=bar</code> trơn ở khối <code>run:</code> này thì khối kế không thấy, vì mỗi bước là một tiến trình shell riêng</span></div>
<div class="lz-layer"><span class="lz-lname">tiến trình nền đang chạy</span><span class="lz-lnote">một cơ sở dữ liệu bạn khởi động, một server bạn đẩy xuống nền — đều bị giết. Cái máy bị PHÁ HUỶ, không phải dọn dẹp</span></div>
<div class="lz-layer"><span class="lz-lname">mọi thứ job cài bằng apt/brew/choco</span><span class="lz-lnote">24 giây cài thư viện hệ thống ở job này mua được con số không cho job kế</span></div>
</div>

<p>Thứ <em>có</em> sống sót thì hẹp một cách cố ý: artifact (tải lên tường minh, giữ trong một thời hạn có cấu hình), cache (theo khoá, cố-gắng-hết-sức, và không bao giờ được bảo đảm), output của job (chuỗi ngắn, phải khai báo), và bất cứ thứ gì bạn đã đẩy tới một hệ thống ngoài thật sự như một registry hay một máy chủ.</p>

<div class="pitfall">
<p><strong>Bẫy — trông chờ <code>export</code> tới được bước kế.</strong> Mỗi khối <code>run:</code> là một shell riêng. <code>export VERSION=1.2.3</code> ở bước 4 đơn giản là biến mất ở bước 5. Cơ chế thật sự chạy được là ghi vào tệp mà <code>\$GITHUB_ENV</code> trỏ tới: <code>echo "VERSION=1.2.3" &gt;&gt; \$GITHUB_ENV</code> làm <code>\$VERSION</code> có mặt ở mọi bước <em>SAU</em> — nhưng vẫn không có ở chính bước vừa ghi, và không bao giờ có ở một job khác.</p>
</div>

<h3>Xếp hàng thì NHANH — và đây là chỗ bất ngờ</h3>
<p>Nhìn lại cột xếp hàng: 2 tới 3 giây từ lúc job được tạo tới lúc job bắt đầu, cho cả năm job, kể cả macOS và Windows. So nó với con số kia mà khoá học này đã đo:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một job chờ runner</span><span class="lz-t">2–3 giây</span><span class="lz-d">đo trên năm job, ba nền tảng, trong một lần chạy</span></div>
<div class="lz-step"><span class="lz-k">một lần chạy theo lịch chờ được xếp hàng</span><span class="lz-t">41–268 phút</span><span class="lz-d">đo trên mười lần chạy ở bài 1.3</span></div>
</div>

<div class="callout ok">
<p><strong>Đây là hai hệ thống khác nhau và đáng giữ cho tách bạch.</strong> Một khi lần chạy đã tồn tại, kiếm máy cho các job của nó là chuyện nhanh. Độ trễ hàng giờ ở bài 1.3 xảy ra <em>TRƯỚC</em> chỗ đó — ở khâu quyết định có tạo lần chạy hay không. Nên "hôm nay CI chậm" gần như không bao giờ nghĩa là hồ runner đang thiếu; nó nghĩa là hoặc job của bạn thật sự lâu đến thế, hoặc lần chạy bị tạo muộn. Phân biệt được thì biết đi tra con số nào.</p>
</div>

<h3>Năm pha của một job, đọc từ log và từ API</h3>
${slide('ga-02', 5, 'Dòng thời gian một job: xếp hàng → Set up → bước → Post')}
<p>Một job không bắt đầu ở bước đầu tiên bạn viết, và cũng không kết thúc ở bước cuối. API trả về danh sách bước kèm số thứ tự và giờ, và danh sách đó luôn có những bước bạn không viết. Đây là job <code>buoc</code> ở lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">35989945632</a> (11 bước của người viết, hai action):</p>
<div class="out">$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35989945632/jobs \\
    --jq '.jobs[0].steps[] | "\\(.number) \\(.name) \\(.conclusion)"'
1  Set up job                          success
2  Run actions/checkout@v7             success
3  Run actions/setup-node@v7           success
4  1. Ong, shell MAC DINH              success
...
11 8. Hong that                        failure
12 9. Bi bo qua (success() ngam dinh)  skipped
13 10. failure()                       success
14 11. always()                        success
27 Post Run actions/setup-node@v7      skipped
28 Post Run actions/checkout@v7        success
29 Complete job                        success

job: created 10:54:35 · started 10:54:38 · completed 10:54:46</div>
<table>
<tr><th>Pha</th><th>Chuyện gì xảy ra</th><th>Hỏng ở đây nghĩa là</th></tr>
<tr><td><strong>xếp hàng</strong> (<code>queued</code>)</td><td>job đã có, chờ một runner khớp nhãn <code>runs-on</code>. Đo: 3 giây</td><td>nhãn sai hoặc hết hạn mức chạy song song — job treo ở <code>queued</code>, KHÔNG có log nào</td></tr>
<tr><td><strong>Set up job</strong></td><td>runner in lý lịch máy, quyền của token, rồi tải MỌI action trong <code>uses:</code> về trước</td><td>action sai tên, sai tag, hoặc bị chặn bởi chính sách của tổ chức</td></tr>
<tr><td><strong>các bước</strong></td><td>từng bước theo thứ tự, mỗi <code>run:</code> là một tiến trình shell mới</td><td>lỗi của bạn — mã thoát khác 0</td></tr>
<tr><td><strong>Post</strong></td><td>phần dọn của từng action, chạy NGƯỢC thứ tự: setup-node (bước 3) được dọn ở bước 27, TRƯỚC checkout (bước 2) ở bước 28</td><td>hiếm; thường là action lưu cache hay tải log lên thất bại</td></tr>
<tr><td><strong>Complete job</strong></td><td>tính <code>outputs:</code> của job, giết tiến trình mồ côi, báo kết quả về</td><td>output bị bỏ vì nghi chứa secret; tiến trình nền bị giết</td></tr>
</table>
<p>Hai chi tiết nữa đáng giữ. Một: số thứ tự nhảy từ 14 lên 27 — runner dành sẵn chỗ cho các bước Post, nên một khoảng trống trong đánh số không có nghĩa là mất bước. Hai: "completed" của job (10:54:46) muộn hơn bước <code>Complete job</code> (10:54:42) bốn giây — đó là thời gian chốt và báo về, và nó cũng được tính vào thời lượng job mà bạn thấy trên giao diện.</p>

<h3>"Set up job" là lý lịch cỗ máy</h3>
${slide('ga-02', 6, '“Set up job” là lý lịch cỗ máy')}
<p>Mở rộng nhóm "Set up job" trong log là việc đầu tiên nên làm khi một workflow đổi tính mà không có commit nào. Đây là nó, nguyên văn, của job <code>chuan-bi</code>:</p>
<div class="out">Current runner version: '2.337.0'
Runner Image Provisioner
  Hosted Compute Agent  Version: 20260828.587
  Azure Region: westus2
Operating System
  Ubuntu 24.04.5 LTS
Runner Image
  Image: ubuntu-24.04
  Version: 20260920.314.1
  Included Software: https://github.com/actions/runner-images/blob/ubuntu24/20260920.314/images/ubuntu/Ubuntu2404-Readme.md
GITHUB_TOKEN Permissions
  Contents: read · Metadata: read · Packages: read
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Complete job name: chuan-bi</div>
<div class="kv-grid">
<div class="kv"><span class="k">Runner Image · Version</span><span class="v">phiên bản của ẢNH máy, đổi gần như hằng tuần. So dòng này giữa run xanh cuối cùng và run đỏ đầu tiên; khác nhau thì mở trang "Included Software" để xem công cụ nào đã nhảy phiên bản</span></div>
<div class="kv"><span class="k">Current runner version</span><span class="v">phiên bản của CHƯƠNG TRÌNH runner (thứ nhận job, chạy bước, gửi log). Tự cập nhật, hiếm khi là nguyên nhân</span></div>
<div class="kv"><span class="k">Azure Region</span><span class="v">máy đặt ở đâu. Hai job cùng run có thể ở hai vùng — một job tải chậm không nói gì về job kia</span></div>
<div class="kv"><span class="k">GITHUB_TOKEN Permissions</span><span class="v">quyền THẬT của token trong job này, sau khi áp <code>permissions:</code> của bạn. Chỗ tra đầu tiên cho mọi lỗi 403 (Chương 6)</span></div>
<div class="kv"><span class="k">Prepare all required actions</span><span class="v">tải mọi <code>uses:</code> trước khi chạy bước nào. Một action gõ sai tên làm job hỏng NGAY ĐÂY — trước cả bước đầu tiên của bạn</span></div>
</div>

<h3>Chọn máy: <code>runs-on</code></h3>
${slide('ga-02', 7, 'Bảng nhãn runs-on và số đo thật')}

<p>Trên mười một workflow của kho này:</p>

<div class="out">runs-on: ubuntu-24.04    11   <- GHIM phien ban
runs-on: ubuntu-latest    2
runs-on: &#36;{{ matrix.os }}  1   <- no ra macos-latest, windows-latest, ubuntu-latest</div>

<p>Mười một cái ghim so với hai cái thả là một tỉ lệ có chủ ý, và lý lẽ y hệt việc ghim phiên bản một thư viện. <code>ubuntu-latest</code> KHÔNG phải hằng số: nó đã đi từ 20.04 sang 22.04 rồi 24.04, mỗi lần theo một lịch triển khai, và mỗi lần đổi phiên bản các công cụ cài sẵn bên dưới những workflow chẳng ai sửa. Một workflow xanh hôm thứ Sáu có thể đỏ hôm thứ Hai mà không có commit nào ở giữa.</p>

<div class="kv-grid">
<div class="kv"><span class="k">ghim — <code>ubuntu-24.04</code></span><span class="v">đổi khi BẠN đổi. Cái giá là rồi bạn vẫn phải chuyển, và GitHub khai tử ảnh cũ theo một lịch công bố</span></div>
<div class="kv"><span class="k">thả — <code>ubuntu-latest</code></span><span class="v">đổi khi GITHUB đổi. Cái lợi là bạn không bao giờ phải tự làm cuộc di trú; cái giá là bạn không chọn được lúc nó xảy ra</span></div>
<div class="kv"><span class="k">cách chia hợp lý</span><span class="v">ghim mọi thứ mà hỏng thì chặn deploy; thả những chỗ mà một bất ngờ là rẻ. Kho này ghim đường lint và đường deploy, thả ma trận phát hành desktop</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một công cụ cài sẵn là một giao diện ổn định.</strong> Ảnh runner mang theo một bộ phần mềm cài sẵn khá lớn, và rất dễ cứ thế gọi <code>node</code>, <code>python</code> hay <code>docker</code> rồi dựa vào bất cứ thứ gì đang có ở đó. Những phiên bản ấy đổi theo ảnh. Cách vá không phải là mất lòng tin vào runner mà là KHAI BÁO: <code>actions/setup-node@v4</code> kèm phiên bản tường minh tốn 8 tới 22 giây — đo trên ba nền tảng ở bài 2.3 — và biến phiên bản thành thuộc tính của WORKFLOW bạn thay vì thuộc tính của lịch triển khai của GitHub.</p>
</div>

<h3>Bảng nhãn runner, và cỗ máy một lõi</h3>
<p><code>runs-on</code> không chọn một cỗ máy — nó chọn một LOẠI máy bằng nhãn. Bảng dưới là runner chuẩn của GitHub theo trang tài liệu "GitHub-hosted runners" (tính đến 09/2026). Cột kho riêng tư quan trọng hơn người ta nghĩ: cùng một nhãn <code>ubuntu-latest</code>, kho công khai được 4 lõi, kho riêng tư chỉ 2.</p>
<table>
<tr><th>Nhãn</th><th>Kho công khai</th><th>Kho riêng tư</th><th>Ghi chú</th></tr>
<tr><td><code>ubuntu-slim</code></td><td>1 lõi · 5 GB</td><td>1 lõi · 5 GB</td><td>container, không phải máy ảo; rẻ nhất</td></tr>
<tr><td><code>ubuntu-latest</code>, <code>ubuntu-24.04</code>, <code>ubuntu-22.04</code>, <code>ubuntu-26.04</code></td><td>4 lõi · 16 GB</td><td>2 lõi · 8 GB</td><td>x64</td></tr>
<tr><td><code>ubuntu-24.04-arm</code>, <code>ubuntu-22.04-arm</code></td><td>4 lõi · 16 GB</td><td>2 lõi · 8 GB</td><td>arm64 — rẻ hơn x64 ở kho riêng tư</td></tr>
<tr><td><code>windows-latest</code>, <code>windows-2025</code>, <code>windows-2022</code></td><td>4 lõi · 16 GB</td><td>2 lõi · 8 GB</td><td>shell mặc định là PowerShell (bài 2.3)</td></tr>
<tr><td><code>macos-latest</code>, <code>macos-15</code>, <code>macos-26</code></td><td>3 lõi (M1) · 7 GB</td><td>3 lõi (M1) · 7 GB</td><td>arm64; <code>macos-15-intel</code> là bản Intel</td></tr>
</table>
<p>Nhãn <code>ubuntu-slim</code> đáng một phép đo riêng, vì nó là loại máy duy nhất KHÁC VỀ BẢN CHẤT. Workflow <code>ch02-nhan.yml</code> chạy cùng một bước trên nó và trên <code>ubuntu-24.04</code> (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990300992" target="_blank" rel="noopener">35990300992</a>):</p>
<div class="out"># job slim  (runs-on: ubuntu-slim)           # job chuan  (runs-on: ubuntu-24.04)
VM Image: Source: Docker · Name: ubuntu:24.04     Image: ubuntu-24.04 · Version 20260920.314.1
CPU: 1 · RAM: 4.8Gi · dia /: 50G                  CPU: 4 · RAM: 15Gi · dia /: 145G
ao hoa: docker                                    ao hoa: microsoft
docker: /usr/bin/docker                           docker: /usr/bin/docker
job: 2s                                           job: 4s</div>
<p>Log "Set up job" của job slim không có mục "Runner Image" mà có "VM Image: Source: Docker, Name: ubuntu:24.04", và <code>systemd-detect-virt</code> trả <code>docker</code>: đây là một container chạy trên một máy ảo, một lõi, dưới 5 GB RAM. Nó hợp cho những job nhỏ và ngắn — gắn nhãn cho PR, gửi thông báo, gọi một API, kiểm định dạng một tệp — nơi 4 lõi của máy chuẩn chỉ ngồi không. Nó không hợp cho bất cứ thứ gì cần dựng mã hay chạy test nặng.</p>
<div class="kv-grid">
<div class="kv"><span class="k">một nhãn</span><span class="v"><code>runs-on: ubuntu-24.04</code> — dạng thường gặp nhất</span></div>
<div class="kv"><span class="k">biểu thức</span><span class="v"><code>runs-on: &#36;{{ matrix.os }}</code> — nhãn lấy từ ma trận (bài 2.5)</span></div>
<div class="kv"><span class="k">danh sách nhãn</span><span class="v"><code>runs-on: [self-hosted, linux, gpu]</code> — máy phải có ĐỦ mọi nhãn. Dạng này dành cho runner tự host</span></div>
<div class="kv"><span class="k">nhóm runner</span><span class="v"><code>runs-on: { group: ten-nhom, labels: [...] }</code> — cho runner lớn / tự host của tổ chức</span></div>
</div>

<h3>Gõ sai một chữ trong runs-on: không lỗi, chỉ chờ</h3>
${slide('ga-02', 8, 'Nhãn gõ sai: job xếp hàng mãi')}
<p>Job thứ ba trong <code>ch02-nhan.yml</code> cố ý viết <code>runs-on: ubuntu-lastest</code> (sai chính tả) và đặt <code>timeout-minutes: 5</code>. Kết quả đo:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color
.github/workflows/ch02-nhan.yml:24:14: label "ubuntu-lastest" is unknown. available labels are
  "windows-latest", ..., "ubuntu-slim", "ubuntu-latest", ..., "macos-15", ... [runner-label]

$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35990300992/jobs \\
    --jq '.jobs[] | "\\(.name) \\(.status) \\(.labels)"'
slim    completed  ["ubuntu-slim"]
chuan   completed  ["ubuntu-24.04"]
go-sai  queued     ["ubuntu-lastest"]     # tao luc 10:58:25, 11:04:42 van queued

$ gh run cancel 35990300992
go-sai  completed/cancelled  11:04:45</div>
<p>Không có dòng lỗi nào trên giao diện. Job đứng ở trạng thái <code>queued</code> sáu phút mười bảy giây — quá cả thời hạn 5 phút đã đặt — cho tới khi bị huỷ bằng tay. Lý do: với GitHub, một nhãn lạ không phải lỗi cú pháp; nó có thể là nhãn của một runner tự host mà bạn chưa bật lên, nên GitHub CHỜ. Và <code>timeout-minutes</code> chỉ đếm thời gian job CHẠY, không đếm thời gian xếp hàng. Trang giới hạn của GitHub ghi một job có thể nằm trong hàng đợi tới 24 giờ trước khi tự bị huỷ.</p>
<div class="callout ok">
<p><strong>Cách chẩn đoán trong 30 giây.</strong> Job treo ở "Waiting for a runner to pick up this job" và không có log nào thì đừng đợi — nhìn đúng hai thứ: nhãn trong <code>runs-on</code> (so với bảng ở trên, hoặc chạy actionlint, nó liệt kê mọi nhãn hợp lệ) và số job đang chạy trên tài khoản (gói Free: 20 job cùng lúc, tối đa 5 job macOS — bài 2.5). Không phải hai thứ đó thì mới nghĩ tới sự cố phía GitHub.</p>
</div>

<h3>Runner là một cỗ máy thật, và bạn nhìn được vào nó</h3>
<p>Hai thói quen tự trả tiền cho chúng ngay lần đầu một job cư xử một cách bất khả. Không cái nào cần công cụ gì:</p>

<pre><code>- name: Cai gi dang chay o day
  run: |
    <span class="tok-comment"># danh tinh may</span>
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    <span class="tok-comment"># tai nguyen — cai nay giai thich phan lon cu OOM</span>
    nproc; free -h; df -h /
    <span class="tok-comment"># phien ban that cua thu ban dang goi</span>
    node --version; npm --version</code></pre>

<p>Riêng dòng bộ nhớ đáng đưa vào phản xạ. Cú hỏng CI đắt nhất trong lịch sử kho này là <code>vite build</code> thoát 134 với <code>Reached heap limit</code> trên một runner macOS trong khi nó dựng xanh trong hai mươi giây trên máy của người viết vốn nhiều RAM hơn hẳn. Runner không hỏng và mã không sai; hai cỗ máy có KÍCH THƯỚC khác nhau, mà đó đúng là sự thật bài này đang nói tới.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> Một job là một cỗ máy bạn thuê đúng bằng độ dài của job, và hệ quả thiết kế là <em>MỌI</em> lần chuyển giao trạng thái — giữa các job, giữa các lần chạy, giữa các bước — đều phải là thứ bạn yêu cầu tường minh, và do đó là thứ bạn tìm thấy được trong YAML khi nó vắng mặt.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Hai job trong cùng một workflow có dùng chung ổ đĩa không? Nếu job build tạo ra <code>dist/</code> thì job deploy lấy nó bằng cách nào?</strong><br>Đ: Không. Mỗi job chạy trên một runner mới, bị huỷ khi job xong — kể cả khi job sau có <code>needs:</code> job trước. Tệp phải đi qua artifact (<code>upload-artifact</code> ở job build, <code>download-artifact</code> ở job deploy); chuỗi ngắn như số phiên bản đi qua <code>outputs</code>. Cache thì không dùng để chuyển kết quả, vì nó có thể trượt.</p>
<p><strong>H: <code>ubuntu-latest</code> hay <code>ubuntu-24.04</code>?</strong><br>Đ: <code>-latest</code> là bí danh GitHub dời theo lịch của họ; ảnh bên dưới cũng đổi hằng tuần. Với job mà hỏng thì chặn phát hành (build, deploy), ghim bản cụ thể để một thay đổi hệ điều hành là việc CÓ CHỦ ĐÍCH; job rẻ và dễ sửa thì để <code>-latest</code>. Dù chọn gì cũng khai phiên bản công cụ bằng action (<code>setup-node</code> với phiên bản đặt trong nháy) thay vì dựa vào thứ có sẵn trong ảnh.</p>
<p><strong>H: Một job cứ đứng "queued", không có log. Bạn kiểm gì?</strong><br>Đ: Nhãn <code>runs-on</code> (sai chính tả hoặc nhãn runner tự host đang tắt — GitHub không báo lỗi mà chờ, <code>timeout-minutes</code> không áp dụng khi đang xếp hàng); hạn mức job đồng thời của gói (Free 20, macOS 5); rồi mới tới trang trạng thái của GitHub.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trưởng nhóm SWP391 hỏi vì sao job deploy "không thấy" thư mục <code>dist/</code> mà job build vừa tạo. Bạn muốn chứng minh bằng số, không bằng lời.</p><ol>
<li>Trong một kho thử của bạn, tạo <code>.github/workflows/hai-may.yml</code> gồm hai job <code>a</code> và <code>b</code> (<code>b</code> có <code>needs: a</code>). Mỗi job in <code>$RUNNER_NAME</code>, <code>hostname</code>, <code>cut -c1-12 /etc/machine-id</code> và <code>cut -d' ' -f1 /proc/uptime</code>.</li>
<li>Job <code>a</code> ghi <code>echo xin-chao &gt; /tmp/dau-vet.txt</code>; job <code>b</code> chạy <code>ls -l /tmp/dau-vet.txt || echo "khong thay"</code>.</li>
<li>Push, rồi <code>gh run view --log</code>. Mở nhóm "Set up job" của cả hai job, ghi lại Image Version và Azure Region.</li>
<li>Chạy <code>gh api repos/&lt;ban&gt;/&lt;kho&gt;/actions/runs/&lt;id&gt;/jobs --jq '.jobs[] | "\\(.name) \\(.runner_id) \\(.created_at) \\(.started_at)"'</code> và tính thời gian xếp hàng của từng job.</li>
<li>Thêm job thứ ba với <code>runs-on: ubuntu-lastest</code>, push, quan sát 3 phút rồi <code>gh run cancel &lt;id&gt;</code>. Xoá job đó đi.</li></ol>
<p><strong>Đạt khi:</strong> bạn có hai <code>runner_id</code>, hai <code>hostname</code> khác nhau và dòng "khong thay"; <code>uptime</code> của máy lớn hơn thời gian từ lúc bạn push (máy bật sẵn); bạn nói được thời gian xếp hàng của mỗi job bằng giây; và job gõ sai nhãn đứng <code>queued</code> không có log cho tới khi bị huỷ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">Máy thực thi một job. Runner của GitHub là máy ảo (hoặc container với <code>ubuntu-slim</code>) dùng một lần.</span></div>
  <div class="kv"><span class="k">Label (nhãn)</span><span class="v">Chuỗi trong <code>runs-on</code> chọn LOẠI máy: <code>ubuntu-24.04</code>, <code>windows-2025</code>, <code>macos-15</code>…</span></div>
  <div class="kv"><span class="k">Ephemeral (dùng một lần)</span><span class="v">Máy nhận đúng một job rồi bị huỷ — không thứ gì sống sót sang job sau.</span></div>
  <div class="kv"><span class="k">Runner image (ảnh máy)</span><span class="v">Bộ hệ điều hành + phần mềm cài sẵn của runner; có số phiên bản, đổi gần như hằng tuần.</span></div>
  <div class="kv"><span class="k">Queued (đang xếp hàng)</span><span class="v">Job đã được tạo nhưng chưa có runner nhận. Không có log; <code>timeout-minutes</code> chưa đếm.</span></div>
  <div class="kv"><span class="k">Set up job / Post / Complete job</span><span class="v">Các bước runner tự thêm: chuẩn bị máy và tải action; dọn của action (chạy ngược); chốt output và báo về.</span></div>
  <div class="kv"><span class="k">Self-hosted runner (runner tự host)</span><span class="v">Máy của bạn cài chương trình runner; mặc định KHÔNG dùng một lần, nên thứ job trước để lại thì job sau thấy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi job = một runner riêng, kể cả khi hai job cùng nhãn và nối nhau bằng <code>needs</code>. Đo: 8 job → 6 <code>runner_id</code> (2 job skip không xin máy).</li>
<li>Không có gì đi qua ranh giới job một cách ngầm định: tệp, <code>node_modules</code>, biến, tiến trình nền đều mất. Kênh hợp lệ: artifact, outputs, cache (không bảo đảm), hệ thống ngoài.</li>
<li>"Máy mới" là chưa ai dùng, không phải vừa bật: máy đã chạy 152s và 92s trước khi job tới — lý do xếp hàng chỉ 2–3 giây.</li>
<li>Một job có 5 pha: xếp hàng → Set up job → bước → Post (dọn ngược) → Complete job. "Set up job" là lý lịch máy: đọc nó đầu tiên khi CI đổi tính.</li>
<li><code>runs-on</code> chọn loại máy; kho riêng tư chỉ được 2 lõi/8 GB; <code>ubuntu-slim</code> là container 1 lõi cho việc nhỏ.</li>
<li>Nhãn gõ sai không báo lỗi — job xếp hàng mãi (đo 6m17s) và <code>timeout-minutes</code> không cứu. actionlint bắt được trước khi push.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — cấu hình phần cứng theo từng nền tảng, các nhãn dùng được, và phát biểu rằng mỗi job chạy trong một thực thể mới tinh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — định nghĩa ảnh thật sự, danh sách đầy đủ phần mềm cài sẵn theo từng ảnh, và issue thông báo cho mỗi lượt triển khai ảnh. Đây là chỗ đi tra xem cái gì đã đổi khi một workflow xanh bỗng đỏ mà không có commit nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_ENV và GITHUB_OUTPUT</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — những cách được hỗ trợ để chuyển một giá trị từ bước này sang bước sau, và vì sao <code>export</code> không nằm trong đó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — một container là một tiến trình, và cái gì chết theo nó</span><span class="lc-sub">/courses/docker/learn${REF} — cùng mô hình máy-dùng-một-lần ở một tầng thấp hơn, gồm cả việc vì sao "ở container tôi thì chạy" và "ở runner tôi thì chạy" hỏng vì cùng những lý do.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mỗi lệnh là một tiến trình, và sự thừa kế môi trường</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao <code>export</code> trong một shell không với tới được shell khác, và đó là toàn bộ lời giải thích cho cái bẫy bước-sang-bước bên trên.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — needs:, and the 5m12s of machines that finished early|||2.2 — needs:, và 5 phút 12 giây máy dựng xong sớm',
      slug: 'ga-2-2-needs',
      type: 'VIDEO',
      description: 'Ba job dựng cùng bắt đầu 19:50:48. Linux xong lúc 19:54:49 rồi NGỒI CHỜ 3 phút 17 giây. `needs:` đợi TRỌN, và bài này đo cái giá — cộng cách duy nhất chuyển được file giữa hai máy đã bị phá huỷ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2><code>needs:</code>, and the 5m12s of machines that finished early</h2>
<p class="lead">Jobs run in parallel by default. <code>needs:</code> is how you say "not this one, not yet" — and it is the only ordering primitive there is. Understanding what it waits for, and what it costs when it waits, is most of what you need to reason about a slow workflow.</p>

<h3>The workflow, and what it declares</h3>
<p>This repository&#39;s desktop release declares three jobs:</p>

<pre><code>jobs:
  kiem-tra:                 <span class="tok-comment"># khong co needs: -> chay ngay</span>
    runs-on: ubuntu-latest

  dung:
    needs: kiem-tra         <span class="tok-comment"># doi kiem-tra xong</span>
    runs-on: &#36;{{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
          - os: windows-latest
          - os: ubuntu-latest

  cong-bo:
    needs: dung             <span class="tok-comment"># doi TRON ma tran</span>
    runs-on: ubuntu-latest</code></pre>

<p>Three declared jobs. The run had five, because a matrix expands into one job per combination — 2.5 covers that. What matters here is the ordering, and the timing the API reports for it:</p>

<div class="out">BA job dung deu bat dau 19:50:48 (song song).
&#96;cong-bo&#96; co &#96;needs: dung&#96;, tuc doi CA BA.

  Linux xong   19:54:49 -> NGOI CHO 197s = 3m17s
  Windows xong 19:56:11 -> NGOI CHO 115s = 1m55s
  macOS xong   19:58:05 -> KE DINH NHIP, cho 1s

  tong may DUNG XONG ma khong dung duoc: 312s = 5m12s

duong toi han = 72 + 437 + 34 = 543s
run_duration_ms bao 555s (chenh 12s = khoang giao job)</div>

<div class="callout warn">
<p><strong><code>needs:</code> waits for all of them, and the slowest one sets the pace.</strong> Linux had a finished, correct build sitting on disk at 19:54:49 and nothing could use it for another three minutes and seventeen seconds. That is not waste in the sense of a bug — the publish step genuinely needs all three installers. It is the shape of the cost, and it is the number you attack when you want the workflow to be faster.</p>
</div>

<h3>The critical path is the only number that matters</h3>
${slide('ga-02', 13, 'The critical path: fast jobs wait for the slow one')}

<p>Add up the total machine-time in that run and you get 72 + 241 + 437 + 323 + 34 = 1,107 seconds of compute. The run took 555 seconds. The difference is parallelism working, and the reason the run is not much faster than 555 is that one chain of dependent jobs is 543 seconds long:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Check job · 72s</span><span class="lz-d">everything waits on this — nothing else can start</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">macOS build · 437s</span><span class="lz-d">the slowest of three parallel jobs, so it alone sets this stage&#39;s length</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Publish · 34s</span><span class="lz-d">cannot start until every matrix leg is done</span></div>
</div>

<div class="callout ok">
<p><strong>Making Linux faster would change nothing.</strong> It is not on the critical path — it already finishes 3m17s early. Every second you want back has to come out of the 72-second check job, the 437-second macOS build, or the 34-second publish. This is the single most useful habit in optimising a workflow: compute the chain before you optimise anything, because the intuitive target is usually the job that is already waiting. Chapter 7 does this properly with the full matrix.</p>
</div>

<h3>Each needs edge costs a few seconds, even when every job is fast</h3>
${slide('ga-02', 14, 'Each needs edge costs a few seconds of hand-over')}
<p>The critical path above is measured in minutes, so a few seconds between two jobs disappear in it. In a graph of small jobs they do not. The sandbox workflow <code>ch02-needs.yml</code> has three levels of <code>needs:</code>, each job running for only a few seconds (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945596" target="_blank" rel="noopener">35989945596</a>):</p>
<div class="out">job        tao (created)  nhan may (started)  xong     xep hang  chay
chuan-bi   10:54:35       10:54:37            10:54:42   2s        5s
dung       10:54:42       10:54:45            10:54:48   3s        3s
kiem       10:54:42       10:54:45            10:54:48   3s        3s   (hong)
bao-loi    10:54:48       10:54:52            10:54:56   4s        4s
bao-cao    10:54:49       10:54:52            10:54:56   3s        4s
deploy     10:54:49       -                   -          -         -    (skipped)

push 10:54:34 -&gt; job cuoi xong 10:54:56 = 22s
trong do CHO MAY o 3 tang needs: 2 + 3 + 4 = 9s</div>
<p>The "xep hang" (queue) column is the price of each edge: only when the parent finishes does GitHub CREATE the child job (the <code>created</code> column matches the parent&#39;s finish), then the child waits for a machine like any other job, runs "Set up job", and only then reaches its first step. Three levels of <code>needs:</code> = 9 seconds of waiting for machines in a 22-second run. In a real workflow each job also has to <code>checkout</code> and reinstall dependencies from scratch (Lesson 2.1), so each edge really costs 10–60 seconds, not 3.</p>
<table>
<tr><th>Split into two JOBS when…</th><th>Merge into two STEPS of one job when…</th></tr>
<tr><td>the two tasks need different kinds of machine (build on macOS, publish on Linux)</td><td>they run on the same kind of machine and the second uses the first one&#39;s files</td></tr>
<tr><td>the two tasks can run IN PARALLEL (lint and test) — splitting makes it faster</td><td>they must be sequential anyway — splitting only adds a machine request, a checkout and a reinstall</td></tr>
<tr><td>the second task needs different permissions (a deploy job with an <code>environment:</code> and its own secrets — Chapters 6, 9)</td><td>both use the same permissions and secrets</td></tr>
<tr><td>you want to re-run just that part when it fails ("Re-run failed jobs")</td><td>re-running the whole block is cheap anyway</td></tr>
</table>

<h3>Passing something between two machines that no longer exist</h3>
${slide('ga-02', 15, 'Four channels across a job boundary')}

<p>Lesson 2.1 established that nothing survives a job. So <code>cong-bo</code> cannot see the installers the three build jobs produced — those machines are gone. The mechanism is an artifact, and the real cost of it is visible in the step timings:</p>

<div class="out">Luu ban cai lam artifact (tai LEN):
  Linux    8s
  Windows  6s
  macOS   27s

Tai VE ca ba trong job cong-bo: 12s</div>

<p>Two things worth noticing. macOS uploads three times slower than Windows for comparable output — a platform difference that 2.3 measures across the whole job. And the download of all three together took twelve seconds, less than macOS spent uploading its one.</p>

<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">explicit upload and download, survives the run, retained 90 days by default, visible in the UI. This is the supported way to move a build output between jobs</span></div>
<div class="kv"><span class="k">job output</span><span class="v"><code>outputs:</code> on the job, read as <code>&#36;{{ needs.&lt;job&gt;.outputs.&lt;name&gt; }}</code>. For small strings only — a version number, a computed tag — and it is capped, so it is not a file transfer channel</span></div>
<div class="kv"><span class="k">cache</span><span class="v">a different tool for a different problem: it speeds up recreating something, it does not transfer something. Never rely on a cache hit for correctness</span></div>
<div class="kv"><span class="k">the runner filesystem</span><span class="v">not a channel at all, between jobs. Within one job it is fine and it is free</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the artifact that costs more than the job it saved.</strong> Uploading <code>node_modules</code> so the next job need not run <code>npm ci</code> is a reliable way to make a workflow slower. It is tens of thousands of small files; the upload compresses and transfers them, the download reverses it, and on the measurements in this repository a fresh <code>npm ci</code> takes 12 to 39 seconds depending on platform. Artifacts are for build <em>outputs</em> — the installer, the bundle, the report. For dependencies, the tool is the cache, and Chapter 5 measures both.</p>
</div>

<h3><code>outputs</code>, step by step</h3>
${slide('ga-02', 11, 'outputs: GITHUB_OUTPUT → outputs: → needs')}
<p>An output is the channel for passing a short STRING between two jobs — a version number, a Docker image tag, a "should we deploy" flag. It travels through four stages, and each stage has a place to get it wrong with no error to tell you:</p>
<pre><code class="language-yaml">jobs:
  chuan-bi:
    runs-on: ubuntu-24.04
    outputs:                                    # (3) khai o muc JOB: ten-ngoai: gia-tri
      phien-ban: &#36;{{ steps.pb.outputs.phien_ban }}
      ngay: &#36;{{ steps.pb.outputs.ngay }}
    steps:
      - name: Tinh phien ban
        id: pb                                  # (2) buoc PHAI co id
        run: |
          echo "phien_ban=1.4.$GITHUB_RUN_NUMBER" &gt;&gt; "$GITHUB_OUTPUT"   # (1) ghi vao TEP
          echo "ngay=$(date -u +%F)" &gt;&gt; "$GITHUB_OUTPUT"

  dung:
    needs: chuan-bi                             # (4) phai needs TRUC TIEP
    runs-on: ubuntu-24.04
    steps:
      - run: |
          echo "phien ban : &#36;{{ needs.chuan-bi.outputs.phien-ban }}"
          echo "khong khai: [&#36;{{ needs.chuan-bi.outputs.khong-co }}]"</code></pre>
<div class="out"># job chuan-bi, buoc "Tinh phien ban"
da ghi vao GITHUB_OUTPUT:
phien_ban=1.4.1
ngay=2026-09-24
# job chuan-bi, buoc "Complete job"
Evaluate and set job outputs
Set output 'phien-ban'
Set output 'ngay'

# job dung — log in dong lenh DA THAY bieu thuc:
Run echo "phien ban : 1.4.1"
phien ban : 1.4.1
ngay      : 2026-09-24
khong khai: []</div>
<ol>
<li><strong>The step writes to the FILE</strong> that <code>$GITHUB_OUTPUT</code> points at, as <code>name=value</code>. Not to the screen — the old <code>echo "::set-output name=…"</code> syntax was deprecated by GitHub in 10/2022; when an old tutorial uses it, switch to <code>$GITHUB_OUTPUT</code>.</li>
<li><strong>The step must have an <code>id:</code></strong> — without one there is no way to name it in <code>steps.&lt;id&gt;.outputs</code>.</li>
<li><strong>The job declares <code>outputs:</code></strong>, mapping an outside name (here <code>phien-ban</code>, with a hyphen) to the step&#39;s output (<code>phien_ban</code>, with an underscore). The two names need not match. The value is computed at the end of the job — exactly the "Evaluate and set job outputs" line in "Complete job".</li>
<li><strong>The receiving job must <code>needs:</code> the sending job</strong> and reads it with <code>&#36;{{ needs.chuan-bi.outputs.phien-ban }}</code>.</li>
</ol>
<p>The line <code>khong khai: []</code> is the main lesson: reading an output that does NOT exist is not an error — it yields an empty string, and the job stays green. A typo in an output name goes straight into a deploy command as an empty tag. Notice also the log line <code>Run echo "phien ban : 1.4.1"</code>: GitHub substitutes the <code>&#36;{{ }}</code> expression with its value BEFORE the shell runs, so the log already shows the real value — handy for debugging, and also the reason Chapter 3 forbids putting user-controlled data into <code>run:</code> through <code>&#36;{{ }}</code>.</p>
<div class="kv-grid">
<div class="kv"><span class="k">size limits</span><span class="v">at most 1 MB per job and 50 MB for the whole run ("Workflow syntax" docs, 09/2026). Files go in an artifact</span></div>
<div class="kv"><span class="k">always a string</span><span class="v"><code>true</code> arrives as the text <code>'true'</code>; for a list or a number, write JSON and read it with <code>fromJSON(...)</code> (Chapter 3)</span></div>
<div class="kv"><span class="k">multi-line values</span><span class="v">the heredoc form: <code>echo "notes&lt;&lt;EOF"</code>, the lines, then <code>EOF</code> — the same syntax as <code>$GITHUB_ENV</code> (Lesson 2.4)</span></div>
<div class="kv"><span class="k">contains a secret</span><span class="v">an output the runner suspects contains a secret is DROPPED with the warning "Skip output … since it may contain secret" — the receiving job gets an empty string</span></div>
</div>

<h3>needs only sees direct parents</h3>
${slide('ga-02', 12, 'needs only sees direct dependencies')}
<p>The job <code>bao-cao</code> declares <code>needs: [dung, kiem, deploy]</code>. <code>chuan-bi</code> is its "grandparent" — the parent of <code>dung</code> — so it has certainly finished first. And yet:</p>
<div class="out"># job bao-cao — needs: [dung, kiem, deploy]  (KHONG co chuan-bi)
dung   : success
kiem   : failure
deploy : skipped
chuan-bi (khong needs truc tiep): []
{
  "dung":   { "result": "success", "outputs": {} },
  "kiem":   { "result": "failure", "outputs": {} },
  "deploy": { "result": "skipped", "outputs": {} }
}

$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color .github/workflows/ch02-needs.yml
ch02-needs.yml:46:150: property "khong-co" is not defined in object type {ngay: string; phien-ban: string} [expression]
ch02-needs.yml:83:184: property "chuan-bi" is not defined in object type {deploy: {...}; dung: {...}; kiem: {...}} [expression]</div>
<p>The <code>needs</code> context only contains the jobs listed DIRECTLY in the current job&#39;s <code>needs:</code>. A grandparent&#39;s output is empty, with no error. GitHub does not check this; actionlint does — it knows the type of every output and reports exactly the two lines above. Two fixes: add <code>chuan-bi</code> to <code>bao-cao</code>&#39;s <code>needs:</code> (it slows nothing down, since it is already an ancestor), or have <code>dung</code> re-declare that output to pass it along.</p>

<h3>What <code>needs:</code> actually means when things fail</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a needed job fails</span><span class="lz-lnote">the dependent job is <strong>skipped</strong>, not failed. It reports as skipped and the run is red because of the original failure</span></div>
<div class="lz-layer"><span class="lz-lname">a needed job is skipped</span><span class="lz-lnote">skips propagate. A job whose <code>if:</code> was false skips everything downstream of it, which surprises people building conditional deploy chains</span></div>
<div class="lz-layer"><span class="lz-lname">you want it to run anyway</span><span class="lz-lnote"><code>if: always()</code> runs it regardless; <code>if: &#36;{{ !cancelled() }}</code> runs it unless somebody hit cancel. Use these for reporting and cleanup jobs, never for deploys</span></div>
<div class="lz-layer"><span class="lz-lname">multiple dependencies</span><span class="lz-lnote"><code>needs: [a, b]</code> waits for both. Any one of them failing skips the job — there is no "wait for a, tolerate b" without an explicit <code>if:</code></span></div>
</div>

<div class="callout">
<p><strong>The skipped-not-failed distinction matters when you read a run.</strong> A red run with one failed job and six skipped ones has exactly one thing to investigate. Reading the six skips as six problems is the most common way to waste twenty minutes on a broken pipeline — Chapter 8 builds the reading order properly.</p>
</div>

<h3>Measured on the sandbox: one job failing in the middle of the graph</h3>
${slide('ga-02', 9, 'One job fails: dependants are SKIPPED, not failed')}
<p>The theory above sounds tidy; you only see how it branches on a real graph. <code>ch02-needs.yml</code> has a job <code>kiem</code> that deliberately runs <code>exit 1</code>, and five jobs after it with five different ways of writing <code>if:</code>:</p>
<pre><code class="language-yaml">  kiem:                       # co y hong
    needs: chuan-bi
    steps: [ { run: "exit 1" } ]
  deploy:                     # mac dinh = if: success()
    needs: [dung, kiem]
  sau-deploy:
    needs: deploy
  bao-loi:
    needs: [dung, kiem]
    if: failure()
  bao-cao:
    needs: [dung, kiem, deploy]
    if: always()
  chua-huy:
    needs: deploy
    if: &#36;{{ !cancelled() }}</code></pre>
<p>The result in run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945596" target="_blank" rel="noopener">35989945596</a>: <code>kiem</code> ✗; <code>deploy</code> ⊘ skipped because a parent failed; <code>sau-deploy</code> ⊘ skipped because its parent was skipped (skipping PROPAGATES); <code>bao-loi</code> ✓ ran because an ancestor failed; <code>bao-cao</code> ✓ ran because of <code>always()</code>; and <code>chua-huy</code> ✓ ran even though its only parent, <code>deploy</code>, was skipped — because <code>!cancelled()</code> only asks "did anyone press cancel". The run is red because of exactly ONE job: <code>kiem</code>.</p>

<h3>The job <code>if:</code> decision table — measured, including a cancel</h3>
${slide('ga-02', 10, 'The job if: table — after failure, skip, cancel')}
<p>To fill in the "cancelled" column, the workflow <code>ch02-huy.yml</code> has a job that sleeps for 120 seconds and two jobs after it; run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990301016" target="_blank" rel="noopener">35990301016</a> was cancelled with <code>gh run cancel</code> half-way through:</p>
<div class="out">$ gh run cancel 35990301016          # bam huy luc 10:58:56
# job dai  (cancelled 10:59:12 — 16 giay sau khi bam)
  Viec dai 120s   ##[error]The operation was canceled.
  always()        -&gt; chay   "always() - chay ca khi bi huy"
  !cancelled()    -&gt; skipped
  failure()       -&gt; skipped
  cancelled()     -&gt; chay   "cancelled() - chi chay khi bi huy"
  Complete job    Terminate orphan process: pid (2226) (sleep)
# job sau-always    (needs: dai, if: always())       -&gt; CHAY: "dai = cancelled"
# job sau-chua-huy  (needs: dai, if: !cancelled())   -&gt; cancelled</div>
<p>Two things you cannot guess from the documentation alone. One: cancelling is not instant — 16 seconds from the click until the job fully stopped, because the runner still runs the <code>always()</code>/<code>cancelled()</code> steps and then kills orphan processes. Two: the job <code>sau-chua-huy</code> does not show "skipped" but "cancelled" — in the UI it looks as if it was stopped half-way even though it never ran.</p>
<table>
<tr><th>Job condition</th><th>parents green</th><th>an ancestor ✗</th><th>parent ⊘ skipped</th><th>cancelled</th></tr>
<tr><td>(none) = <code>success()</code></td><td>runs</td><td>skip</td><td>skip</td><td>cancelled</td></tr>
<tr><td><code>failure()</code></td><td>skip</td><td>runs</td><td>only if a ✗ exists above</td><td>skip</td></tr>
<tr><td><code>always()</code></td><td>runs</td><td>runs</td><td>runs</td><td><strong>runs</strong></td></tr>
<tr><td><code>!cancelled()</code></td><td>runs</td><td>runs</td><td>runs</td><td>cancelled</td></tr>
<tr><td><code>cancelled()</code></td><td>skip</td><td>skip</td><td>skip</td><td>runs</td></tr>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Trap — adding a condition and believing you switched off <code>success()</code>.</strong> Write <code>if: github.ref == 'refs/heads/main'</code> on a deploy job and GitHub reads it as <code>success() &amp;&amp; github.ref == 'refs/heads/main'</code>: the <code>success()</code> status function is implicitly added to EVERY condition that mentions no status function. That is right for a deploy. But on a report job, <code>if: github.event_name == 'push'</code> is skipped as soon as any job fails — exactly when you need the report most. To run it after failures too, say so: <code>if: &#36;{{ !cancelled() &amp;&amp; github.event_name == 'push' }}</code>.</p>
</div>

<h3>The shape to aim for</h3>
<p>Two structures cover almost every real workflow, and the difference between them is measurable in wall-clock:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">wide</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">independent jobs, no <code>needs:</code></span><span class="lz-nsub">lint, typecheck, unit tests, build — all start at once. Run length = the slowest single job. This is what <code>ci-lint.yml</code> does with its two jobs</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">deep</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">a chain of <code>needs:</code></span><span class="lz-nsub">check → build → publish. Run length = the sum of the chain. Justified only when each stage genuinely consumes the previous one&#39;s output — as the release workflow does</span></div></div>
</div>
</div>

<p>The failure mode to watch for is a chain that is deep for no reason: a lint job that everything <code>needs:</code>, purely because it feels tidy to check formatting before building. That serialises 72 seconds in front of every other job and buys nothing, since a lint failure and a build failure are both things you want to know about in the same run. Depth should be a data dependency, not a preference about ordering.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>needs:</code> is the only ordering tool, it waits for every job named and for every leg of a matrix, and the price of each edge you add is paid in wall-clock by whichever job is unlucky enough to finish first.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: The <code>deploy</code> job has <code>needs: [build, test]</code>. Test fails. What does deploy do, and what does the UI show?</strong><br>A: Deploy is SKIPPED, not failed, and every job that depends on deploy is skipped too. The run is red because of exactly one job — test. When reading a red run, find the first ✗ and ignore the ⊘s.</p>
<p><strong>Q: How does <code>always()</code> differ from <code>!cancelled()</code>? Which one for a job that sends the test report?</strong><br>A: <code>always()</code> runs even when a user cancels; <code>!cancelled()</code> runs after success and failure but not after a cancel. Reporting and cleanup use <code>!cancelled()</code> (or <code>always()</code> if it truly must run on cancel, such as tearing down temporary infrastructure). A deploy never uses either.</p>
<p><strong>Q: How do you pass a version number computed in the first job to the last job?</strong><br>A: Write <code>name=value</code> to <code>$GITHUB_OUTPUT</code> in a step with an <code>id</code>, map it into the job&#39;s <code>outputs:</code>, then have the receiving job <code>needs:</code> that job DIRECTLY and read <code>needs.&lt;job&gt;.outputs.&lt;name&gt;</code>. A wrong name gives an empty string, not an error — so run actionlint.</p>
<p><strong>Q: A workflow takes 12 minutes. Where do you start optimising?</strong><br>A: Draw the <code>needs</code> graph with each job&#39;s duration and compute the critical path — the longest chain sets the run&#39;s length. Optimising a job off that path saves nothing. Only then: remove <code>needs</code> edges that are not data dependencies, merge small sequential jobs, cache (Chapter 5), split into parallel work (Chapter 7).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are setting up CI for a team project and want: if tests fail, do NOT deploy, but still run a report job; and compute the version number once for every job.</p><ol>
<li>Create a workflow with a job <code>version</code> that writes <code>v=1.0.$GITHUB_RUN_NUMBER</code> to <code>$GITHUB_OUTPUT</code> (in a step with <code>id: v</code>) and declares <code>outputs: { v: &#36;{{ steps.v.outputs.v }} }</code>.</li>
<li>Add <code>test</code> (<code>needs: version</code>, runs <code>exit 1</code>), <code>deploy</code> (<code>needs: [version, test]</code>, prints the version), <code>report</code> (<code>needs: [test, deploy]</code>, <code>if: &#36;{{ !cancelled() }}</code>, prints <code>&#36;{{ toJSON(needs) }}</code>).</li>
<li>Push. Draw the graph on paper with ✓ ✗ ⊘ before you open the Actions tab, then compare.</li>
<li>In <code>report</code>, add a line printing <code>&#36;{{ needs.version.outputs.v }}</code>. What does it print? Run actionlint and see what it says.</li>
<li>Change <code>test</code> to <code>exit 0</code>, push again, and confirm <code>deploy</code> prints the right version.</li></ol>
<p><strong>Done when:</strong> the first run has exactly one ✗ (test), deploy ⊘ and report ✓ with <code>"deploy": {"result": "skipped"}</code> in the JSON; you can explain why <code>needs.version.outputs.v</code> is empty in <code>report</code>; and in the second run deploy prints <code>1.0.&lt;run number&gt;</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>needs:</code></span><span class="v">The list of jobs that must finish first. The ONLY ordering tool between jobs.</span></div>
  <div class="kv"><span class="k">Critical path</span><span class="v">The longest chain of dependent jobs; it sets the length of the whole run.</span></div>
  <div class="kv"><span class="k">Skipped</span><span class="v">A job that did not run because its condition was false or a parent failed/was skipped. Not an error, uses no machine; it propagates downstream.</span></div>
  <div class="kv"><span class="k">Job outputs</span><span class="v">Short strings declared in <code>outputs:</code>, read through <code>needs.&lt;job&gt;.outputs</code>. At most 1 MB per job.</span></div>
  <div class="kv"><span class="k"><code>$GITHUB_OUTPUT</code></span><span class="v">The path of the file a step writes <code>name=value</code> into to create a step output.</span></div>
  <div class="kv"><span class="k">Status check functions</span><span class="v"><code>success()</code>, <code>failure()</code>, <code>always()</code>, <code>cancelled()</code> — decide whether a job/step runs after a failure or a cancel.</span></div>
  <div class="kv"><span class="k">Artifact</span><span class="v">A file uploaded in one job and downloaded in another; the channel for FILES between machines.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>needs:</code> is the only ordering tool; it waits for EVERY named job and every matrix leg. Run length = the critical path — optimising a job off it is pointless.</li>
<li>Each <code>needs</code> edge adds a job creation + machine wait + Set up (measured: 2–4 seconds, before checkout and reinstall). Only split jobs when you need a different machine, can run in parallel, or need different permissions.</li>
<li>An output travels 4 stages: <code>$GITHUB_OUTPUT</code> → a step with an <code>id</code> → the job&#39;s <code>outputs:</code> → <code>needs.X.outputs</code> in the receiving job. A wrong name = an empty string, no error.</li>
<li>The <code>needs</code> context only holds DIRECT parents; a grandparent&#39;s output is empty.</li>
<li>Parent fails → child is SKIPPED, and skipping propagates. <code>failure()</code> for notifications, <code>!cancelled()</code> for reports/cleanup, <code>always()</code> runs even on cancel — never for a deploy.</li>
<li>Every <code>if:</code> that mentions no status function is implicitly <code>success() &amp;&amp; …</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using jobs in a workflow: jobs.&lt;id&gt;.needs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow — the ordering semantics, the skip-propagation rule, and the <code>always()</code> escape hatch.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/upload-artifact and actions/download-artifact</span><span class="lc-sub">github.com/actions/upload-artifact — retention settings, compression level, and the v3-to-v4 change that made artifacts immutable per job (which breaks the old "several jobs append to one artifact" pattern).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Defining outputs for jobs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs — the <code>outputs:</code> / <code>needs.&lt;job&gt;.outputs</code> mechanism and its size limits, for the cases where you need a string rather than a file.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the critical path, and optimising the job that is already waiting</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same measurement discipline applied to a deploy pipeline, including a case where the obvious optimisation target was off the critical path entirely.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2><code>needs:</code>, và 5 phút 12 giây máy dựng xong sớm</h2>
<p class="lead">Mặc định các job chạy song song. <code>needs:</code> là cách bạn nói "cái này thì chưa" — và nó là công cụ SẮP THỨ TỰ duy nhất tồn tại. Hiểu nó đợi cái gì, và nó tốn gì khi đợi, chiếm phần lớn thứ bạn cần để lập luận về một workflow chậm.</p>

<h3>Workflow, và nó khai báo cái gì</h3>
<p>Bản phát hành desktop của kho này khai ba job:</p>

<pre><code>jobs:
  kiem-tra:                 <span class="tok-comment"># khong co needs: -> chay ngay</span>
    runs-on: ubuntu-latest

  dung:
    needs: kiem-tra         <span class="tok-comment"># doi kiem-tra xong</span>
    runs-on: &#36;{{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
          - os: windows-latest
          - os: ubuntu-latest

  cong-bo:
    needs: dung             <span class="tok-comment"># doi TRON ma tran</span>
    runs-on: ubuntu-latest</code></pre>

<p>Ba job khai báo. Lần chạy có năm, vì một ma trận nở ra thành một job cho mỗi tổ hợp — bài 2.5 nói chuyện đó. Chỗ quan trọng ở đây là THỨ TỰ, và cái nhịp thời gian mà API báo cho nó:</p>

<div class="out">BA job dung deu bat dau 19:50:48 (song song).
&#96;cong-bo&#96; co &#96;needs: dung&#96;, tuc doi CA BA.

  Linux xong   19:54:49 -> NGOI CHO 197s = 3m17s
  Windows xong 19:56:11 -> NGOI CHO 115s = 1m55s
  macOS xong   19:58:05 -> KE DINH NHIP, cho 1s

  tong may DUNG XONG ma khong dung duoc: 312s = 5m12s

duong toi han = 72 + 437 + 34 = 543s
run_duration_ms bao 555s (chenh 12s = khoang giao job)</div>

<div class="callout warn">
<p><strong><code>needs:</code> đợi TẤT CẢ, và kẻ chậm nhất định nhịp.</strong> Linux đã có một bản dựng xong xuôi, đúng đắn, nằm sẵn trên đĩa lúc 19:54:49 và không gì dùng được nó suốt ba phút mười bảy giây nữa. Đó không phải lãng phí theo nghĩa một lỗi — bước công bố thật sự cần cả ba bản cài. Đó là HÌNH DẠNG của cái giá, và nó là con số bạn nhắm vào khi muốn workflow nhanh hơn.</p>
</div>

<h3>Đường tới hạn là con số duy nhất có nghĩa</h3>
${slide('ga-02', 13, 'Đường tới hạn: job nhanh ngồi chờ job chậm')}

<p>Cộng tổng thời-gian-máy trong lần chạy ấy được 72 + 241 + 437 + 323 + 34 = 1.107 giây tính toán. Lần chạy mất 555 giây. Chênh lệch chính là sự song song đang phát huy, và lý do lần chạy không nhanh hơn 555 bao nhiêu là vì có một CHUỖI job phụ thuộc dài 543 giây:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kiểm tra mã · 72s</span><span class="lz-d">mọi thứ chờ cái này — không gì khác khởi động được</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dựng macOS · 437s</span><span class="lz-d">chậm nhất trong ba job song song, nên một mình nó định độ dài của chặng này</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Công bố · 34s</span><span class="lz-d">không khởi động được cho tới khi mọi nhánh ma trận xong</span></div>
</div>

<div class="callout ok">
<p><strong>Làm Linux nhanh hơn sẽ KHÔNG đổi được gì.</strong> Nó không nằm trên đường tới hạn — nó vốn đã xong sớm 3m17s. Mọi giây bạn muốn đòi lại đều phải lấy ra từ job kiểm 72 giây, bản dựng macOS 437 giây, hoặc bước công bố 34 giây. Đây là thói quen hữu ích nhất khi tối ưu một workflow: TÍNH CHUỖI trước khi tối ưu bất cứ thứ gì, bởi cái đích trực giác thường là cái job vốn đã ngồi chờ. Chương 7 làm chuyện này cho tử tế với cả ma trận.</p>
</div>

<h3>Mỗi cạnh needs tốn thêm vài giây, kể cả khi mọi job đều nhanh</h3>
${slide('ga-02', 14, 'Mỗi cạnh needs tốn thêm vài giây “giao ca”')}
<p>Đường tới hạn ở trên được đo bằng phút, nên vài giây giữa hai job chìm mất. Ở một đồ thị gồm những job nhỏ thì không. Workflow <code>ch02-needs.yml</code> trên sân tập có ba tầng <code>needs:</code>, mỗi job chỉ chạy vài giây (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945596" target="_blank" rel="noopener">35989945596</a>):</p>
<div class="out">job        tao (created)  nhan may (started)  xong     xep hang  chay
chuan-bi   10:54:35       10:54:37            10:54:42   2s        5s
dung       10:54:42       10:54:45            10:54:48   3s        3s
kiem       10:54:42       10:54:45            10:54:48   3s        3s   (hong)
bao-loi    10:54:48       10:54:52            10:54:56   4s        4s
bao-cao    10:54:49       10:54:52            10:54:56   3s        4s
deploy     10:54:49       -                   -          -         -    (skipped)

push 10:54:34 -&gt; job cuoi xong 10:54:56 = 22s
trong do CHO MAY o 3 tang needs: 2 + 3 + 4 = 9s</div>
<p>Cột "xếp hàng" là cái giá của mỗi cạnh: khi job cha xong, GitHub mới TẠO job con (cột <code>created</code> trùng với lúc cha xong), rồi job con lại phải chờ một máy như mọi job khác, rồi chạy "Set up job", rồi mới tới bước đầu tiên. Ba tầng <code>needs:</code> = 9 giây chờ máy trong một lần chạy 22 giây. Với workflow thật, mỗi job còn phải <code>checkout</code> và cài phụ thuộc lại từ đầu (bài 2.1), nên mỗi cạnh thật ra tốn 10–60 giây chứ không phải 3.</p>
<table>
<tr><th>Tách thành hai JOB khi…</th><th>Gộp thành hai BƯỚC của một job khi…</th></tr>
<tr><td>hai việc cần hai loại máy khác nhau (dựng trên macOS, công bố trên Linux)</td><td>chúng chạy trên cùng loại máy và việc sau dùng tệp của việc trước</td></tr>
<tr><td>hai việc chạy SONG SONG được (lint và test) — tách ra thì nhanh hơn</td><td>chúng buộc phải tuần tự — tách ra chỉ thêm một lần xin máy, checkout, cài lại</td></tr>
<tr><td>việc sau cần quyền khác (job deploy có <code>environment:</code>, secret riêng — Chương 6, 9)</td><td>cả hai dùng cùng quyền, cùng secret</td></tr>
<tr><td>bạn muốn chạy lại riêng một phần khi nó hỏng ("Re-run failed jobs")</td><td>chạy lại cả khối cũng rẻ</td></tr>
</table>

<h3>Chuyển một thứ giữa hai cỗ máy không còn tồn tại</h3>
${slide('ga-02', 15, 'Bốn kênh mang dữ liệu qua ranh giới job')}

<p>Bài 2.1 đã xác lập rằng không gì sống sót qua một job. Nên <code>cong-bo</code> không nhìn thấy được các bản cài mà ba job dựng đã tạo ra — mấy cỗ máy ấy biến mất rồi. Cơ chế là artifact, và cái giá thật của nó hiện ra trong nhịp thời gian từng bước:</p>

<div class="out">Luu ban cai lam artifact (tai LEN):
  Linux    8s
  Windows  6s
  macOS   27s

Tai VE ca ba trong job cong-bo: 12s</div>

<p>Hai chỗ đáng để ý. macOS tải lên chậm gấp ba Windows với đầu ra tương đương — một khác biệt nền tảng mà bài 2.3 đo trên toàn bộ job. Và việc tải VỀ cả ba cùng lúc mất mười hai giây, ít hơn thời gian macOS tải lên đúng một bản của nó.</p>

<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">tải lên và tải về tường minh, sống qua lần chạy, mặc định giữ 90 ngày, thấy được trên giao diện. Đây là cách được hỗ trợ để chuyển một bản dựng giữa các job</span></div>
<div class="kv"><span class="k">output của job</span><span class="v"><code>outputs:</code> trên job, đọc bằng <code>&#36;{{ needs.&lt;job&gt;.outputs.&lt;ten&gt; }}</code>. Chỉ dành cho chuỗi ngắn — một số hiệu phiên bản, một nhãn tính ra — và nó có trần, nên không phải kênh chuyển file</span></div>
<div class="kv"><span class="k">cache</span><span class="v">một công cụ khác cho một bài toán khác: nó tăng tốc việc TẠO LẠI một thứ, nó không CHUYỂN một thứ. Đừng bao giờ dựa vào một lần trúng cache để đảm bảo tính đúng đắn</span></div>
<div class="kv"><span class="k">hệ tệp của runner</span><span class="v">không phải kênh gì cả, giữa các job. Trong cùng một job thì nó ổn và nó miễn phí</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái artifact tốn hơn cả job nó tiết kiệm được.</strong> Tải <code>node_modules</code> lên để job kế khỏi phải chạy <code>npm ci</code> là một cách đáng tin cậy để làm workflow CHẬM đi. Đó là hàng chục nghìn file bé; lượt tải lên nén rồi truyền chúng, lượt tải về làm ngược lại, mà theo số đo ở kho này một lần <code>npm ci</code> tươi mất 12 tới 39 giây tuỳ nền tảng. Artifact dành cho <em>ĐẦU RA</em> của bản dựng — bản cài, gói bundle, bản báo cáo. Với thư viện phụ thuộc, công cụ là cache, và Chương 5 đo cả hai.</p>
</div>

<h3><code>outputs</code>, từng bước một</h3>
${slide('ga-02', 11, 'outputs: GITHUB_OUTPUT → outputs: → needs')}
<p>Output là kênh để chuyển một CHUỖI ngắn giữa hai job — số phiên bản, một tag ảnh Docker, một cờ "có cần deploy không". Nó đi qua bốn chặng, và mỗi chặng có một chỗ để viết sai mà không có lỗi nào báo:</p>
<pre><code class="language-yaml">jobs:
  chuan-bi:
    runs-on: ubuntu-24.04
    outputs:                                    # (3) khai o muc JOB: ten-ngoai: gia-tri
      phien-ban: &#36;{{ steps.pb.outputs.phien_ban }}
      ngay: &#36;{{ steps.pb.outputs.ngay }}
    steps:
      - name: Tinh phien ban
        id: pb                                  # (2) buoc PHAI co id
        run: |
          echo "phien_ban=1.4.$GITHUB_RUN_NUMBER" &gt;&gt; "$GITHUB_OUTPUT"   # (1) ghi vao TEP
          echo "ngay=$(date -u +%F)" &gt;&gt; "$GITHUB_OUTPUT"

  dung:
    needs: chuan-bi                             # (4) phai needs TRUC TIEP
    runs-on: ubuntu-24.04
    steps:
      - run: |
          echo "phien ban : &#36;{{ needs.chuan-bi.outputs.phien-ban }}"
          echo "khong khai: [&#36;{{ needs.chuan-bi.outputs.khong-co }}]"</code></pre>
<div class="out"># job chuan-bi, buoc "Tinh phien ban"
da ghi vao GITHUB_OUTPUT:
phien_ban=1.4.1
ngay=2026-09-24
# job chuan-bi, buoc "Complete job"
Evaluate and set job outputs
Set output 'phien-ban'
Set output 'ngay'

# job dung — log in dong lenh DA THAY bieu thuc:
Run echo "phien ban : 1.4.1"
phien ban : 1.4.1
ngay      : 2026-09-24
khong khai: []</div>
<ol>
<li><strong>Bước ghi vào TỆP</strong> mà biến <code>$GITHUB_OUTPUT</code> trỏ tới, dạng <code>ten=gia-tri</code>. Không phải in ra màn hình — cú pháp cũ <code>echo "::set-output name=…"</code> đã bị GitHub khai tử (deprecated) từ 10/2022; gặp trong tutorial cũ thì đổi sang <code>$GITHUB_OUTPUT</code>.</li>
<li><strong>Bước phải có <code>id:</code></strong> — không có id thì không có cách nào gọi tên nó trong <code>steps.&lt;id&gt;.outputs</code>.</li>
<li><strong>Job khai <code>outputs:</code></strong> ánh xạ tên ra ngoài (ở đây <code>phien-ban</code>, gạch ngang) sang output của bước (<code>phien_ban</code>, gạch dưới). Hai tên không cần giống nhau. Giá trị được tính ở cuối job — đúng dòng "Evaluate and set job outputs" trong "Complete job".</li>
<li><strong>Job nhận phải <code>needs:</code> job gửi</strong> và đọc bằng <code>&#36;{{ needs.chuan-bi.outputs.phien-ban }}</code>.</li>
</ol>
<p>Dòng <code>khong khai: []</code> là bài học chính: đọc một output KHÔNG tồn tại không phải lỗi — nó ra chuỗi rỗng, và job vẫn xanh. Một lỗi chính tả trong tên output sẽ đi thẳng vào lệnh deploy dưới dạng một tag rỗng. Và để ý dòng log <code>Run echo "phien ban : 1.4.1"</code>: biểu thức <code>&#36;{{ }}</code> được GitHub thay bằng giá trị TRƯỚC khi shell chạy, nên log in sẵn giá trị thật — tiện để gỡ lỗi, và cũng là lý do Chương 3 cấm đặt dữ liệu người dùng vào <code>run:</code> qua <code>&#36;{{ }}</code>.</p>
<div class="kv-grid">
<div class="kv"><span class="k">giới hạn kích thước</span><span class="v">tối đa 1 MB mỗi job, 50 MB cả lần chạy (tài liệu "Workflow syntax", 09/2026). Tệp thì dùng artifact</span></div>
<div class="kv"><span class="k">luôn là chuỗi</span><span class="v"><code>true</code> tới nơi là chữ <code>'true'</code>; muốn danh sách hay số thì ghi JSON rồi đọc bằng <code>fromJSON(...)</code> (Chương 3)</span></div>
<div class="kv"><span class="k">giá trị nhiều dòng</span><span class="v">dạng heredoc: <code>echo "ghi-chu&lt;&lt;EOF"</code>, các dòng, rồi <code>EOF</code> — cùng cú pháp với <code>$GITHUB_ENV</code> (bài 2.4)</span></div>
<div class="kv"><span class="k">chứa secret</span><span class="v">output mà runner nghi chứa một secret sẽ bị BỎ với cảnh báo "Skip output … since it may contain secret" — job nhận được chuỗi rỗng</span></div>
</div>

<h3>needs chỉ thấy cha trực tiếp</h3>
${slide('ga-02', 12, 'needs chỉ thấy phụ thuộc trực tiếp')}
<p>Job <code>bao-cao</code> khai <code>needs: [dung, kiem, deploy]</code>. <code>chuan-bi</code> là "ông" của nó — cha của <code>dung</code> — nên chắc chắn đã chạy xong trước. Vậy mà:</p>
<div class="out"># job bao-cao — needs: [dung, kiem, deploy]  (KHONG co chuan-bi)
dung   : success
kiem   : failure
deploy : skipped
chuan-bi (khong needs truc tiep): []
{
  "dung":   { "result": "success", "outputs": {} },
  "kiem":   { "result": "failure", "outputs": {} },
  "deploy": { "result": "skipped", "outputs": {} }
}

$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -no-color .github/workflows/ch02-needs.yml
ch02-needs.yml:46:150: property "khong-co" is not defined in object type {ngay: string; phien-ban: string} [expression]
ch02-needs.yml:83:184: property "chuan-bi" is not defined in object type {deploy: {...}; dung: {...}; kiem: {...}} [expression]</div>
<p>Ngữ cảnh <code>needs</code> chỉ chứa những job ghi TRỰC TIẾP trong <code>needs:</code> của job hiện tại. Output của ông thì rỗng, không báo lỗi. GitHub không kiểm; actionlint thì có — nó biết kiểu của từng output và báo đúng hai dòng trên. Hai cách sửa: thêm <code>chuan-bi</code> vào <code>needs:</code> của <code>bao-cao</code> (không làm chậm gì, vì nó vốn đã là tổ tiên), hoặc cho <code>dung</code> khai lại output đó để chuyển tiếp.</p>

<h3><code>needs:</code> thật ra nghĩa gì khi có thứ hỏng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một job được needs bị hỏng</span><span class="lz-lnote">job phụ thuộc bị <strong>BỎ QUA</strong>, không phải HỎNG. Nó báo cáo là skipped và lần chạy đỏ vì cú hỏng gốc</span></div>
<div class="lz-layer"><span class="lz-lname">một job được needs bị bỏ qua</span><span class="lz-lnote">việc bỏ qua LAN TRUYỀN. Một job có <code>if:</code> sai sẽ bỏ qua mọi thứ nằm sau nó, và điều này làm bất ngờ những ai đang dựng chuỗi deploy có điều kiện</span></div>
<div class="lz-layer"><span class="lz-lname">bạn muốn nó chạy bất chấp</span><span class="lz-lnote"><code>if: always()</code> chạy bất kể; <code>if: &#36;{{ !cancelled() }}</code> chạy trừ khi có người bấm huỷ. Dùng mấy cái này cho job báo cáo và dọn dẹp, đừng bao giờ dùng cho deploy</span></div>
<div class="lz-layer"><span class="lz-lname">nhiều phụ thuộc</span><span class="lz-lnote"><code>needs: [a, b]</code> đợi cả hai. Bất kỳ cái nào hỏng cũng bỏ qua job — không có kiểu "đợi a, chịu đựng b" nếu không viết <code>if:</code> tường minh</span></div>
</div>

<div class="callout">
<p><strong>Chỗ phân biệt bỏ-qua với hỏng có nghĩa khi bạn ĐỌC một lần chạy.</strong> Một lần chạy đỏ với một job hỏng và sáu job bị bỏ qua có đúng MỘT thứ cần điều tra. Đọc sáu cái skip thành sáu vấn đề là cách phổ biến nhất để phí hai mươi phút cho một đường ống hỏng — Chương 8 dựng thứ tự đọc cho tử tế.</p>
</div>

<h3>Đo lại trên sân tập: một job hỏng giữa đồ thị</h3>
${slide('ga-02', 9, 'Một job hỏng: job phụ thuộc bị SKIP, không phải hỏng')}
<p>Lý thuyết ở trên nghe gọn; nhìn trên một đồ thị thật thì mới thấy nó rẽ nhánh thế nào. <code>ch02-needs.yml</code> có một job <code>kiem</code> cố ý <code>exit 1</code>, và năm job phía sau với năm cách viết <code>if:</code> khác nhau:</p>
<pre><code class="language-yaml">  kiem:                       # co y hong
    needs: chuan-bi
    steps: [ { run: "exit 1" } ]
  deploy:                     # mac dinh = if: success()
    needs: [dung, kiem]
  sau-deploy:
    needs: deploy
  bao-loi:
    needs: [dung, kiem]
    if: failure()
  bao-cao:
    needs: [dung, kiem, deploy]
    if: always()
  chua-huy:
    needs: deploy
    if: &#36;{{ !cancelled() }}</code></pre>
<p>Kết quả ở lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945596" target="_blank" rel="noopener">35989945596</a>: <code>kiem</code> ✗; <code>deploy</code> ⊘ skipped vì một cha hỏng; <code>sau-deploy</code> ⊘ skipped vì cha của nó bị skip (việc bỏ qua LAN TRUYỀN); <code>bao-loi</code> ✓ chạy vì có tổ tiên hỏng; <code>bao-cao</code> ✓ chạy vì <code>always()</code>; và <code>chua-huy</code> ✓ chạy dù cha duy nhất của nó, <code>deploy</code>, bị skip — vì <code>!cancelled()</code> chỉ hỏi "có ai bấm huỷ không". Lần chạy báo đỏ vì đúng MỘT job: <code>kiem</code>.</p>

<h3>Bảng quyết định <code>if:</code> của job — đo thật, kể cả khi bấm huỷ</h3>
${slide('ga-02', 10, 'Bảng if: của job — sau hỏng, skip, huỷ')}
<p>Để điền cột "người bấm huỷ", workflow <code>ch02-huy.yml</code> có một job ngủ 120 giây và hai job phía sau; lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990301016" target="_blank" rel="noopener">35990301016</a> bị huỷ bằng <code>gh run cancel</code> giữa chừng:</p>
<div class="out">$ gh run cancel 35990301016          # bam huy luc 10:58:56
# job dai  (cancelled 10:59:12 — 16 giay sau khi bam)
  Viec dai 120s   ##[error]The operation was canceled.
  always()        -&gt; chay   "always() - chay ca khi bi huy"
  !cancelled()    -&gt; skipped
  failure()       -&gt; skipped
  cancelled()     -&gt; chay   "cancelled() - chi chay khi bi huy"
  Complete job    Terminate orphan process: pid (2226) (sleep)
# job sau-always    (needs: dai, if: always())       -&gt; CHAY: "dai = cancelled"
# job sau-chua-huy  (needs: dai, if: !cancelled())   -&gt; cancelled</div>
<p>Hai điều không đoán được nếu chỉ đọc tài liệu. Một: huỷ không tức thì — 16 giây từ lúc bấm tới lúc job dừng hẳn, vì runner còn chạy các bước <code>always()</code>/<code>cancelled()</code> rồi mới giết tiến trình mồ côi. Hai: job <code>sau-chua-huy</code> không hiện "skipped" mà hiện "cancelled" — trên giao diện nó trông như bị huỷ giữa chừng dù chưa bao giờ chạy.</p>
<table>
<tr><th>Điều kiện của job</th><th>cha xanh</th><th>có tổ tiên ✗</th><th>cha bị ⊘ skip</th><th>bấm huỷ</th></tr>
<tr><td>(không ghi) = <code>success()</code></td><td>chạy</td><td>skip</td><td>skip</td><td>huỷ</td></tr>
<tr><td><code>failure()</code></td><td>skip</td><td>chạy</td><td>chỉ khi có ✗ phía trên</td><td>skip</td></tr>
<tr><td><code>always()</code></td><td>chạy</td><td>chạy</td><td>chạy</td><td><strong>chạy</strong></td></tr>
<tr><td><code>!cancelled()</code></td><td>chạy</td><td>chạy</td><td>chạy</td><td>huỷ</td></tr>
<tr><td><code>cancelled()</code></td><td>skip</td><td>skip</td><td>skip</td><td>chạy</td></tr>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thêm một điều kiện và tưởng mình đã tắt <code>success()</code>.</strong> Viết <code>if: github.ref == 'refs/heads/main'</code> cho job deploy thì GitHub tự hiểu là <code>success() &amp;&amp; github.ref == 'refs/heads/main'</code>: hàm trạng thái <code>success()</code> được ngầm thêm vào MỌI điều kiện không nhắc tới hàm trạng thái nào. Điều đó là đúng cho deploy. Nhưng với job báo cáo, <code>if: github.event_name == 'push'</code> sẽ bị skip ngay khi có job hỏng — đúng lúc bạn cần báo cáo nhất. Muốn nó chạy cả sau hỏng thì phải viết rõ: <code>if: &#36;{{ !cancelled() &amp;&amp; github.event_name == 'push' }}</code>.</p>
</div>

<h3>Hình dạng cần nhắm tới</h3>
<p>Hai cấu trúc phủ gần hết mọi workflow thật, và khác biệt giữa chúng đo được bằng thời gian đồng hồ:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">rộng</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">các job độc lập, không <code>needs:</code></span><span class="lz-nsub">lint, kiểm kiểu, unit test, dựng — tất cả khởi động cùng lúc. Độ dài lần chạy = job đơn chậm nhất. Đây là thứ <code>ci-lint.yml</code> làm với hai job của nó</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">sâu</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">một chuỗi <code>needs:</code></span><span class="lz-nsub">kiểm → dựng → công bố. Độ dài lần chạy = tổng của chuỗi. Chỉ chính đáng khi mỗi chặng THẬT SỰ tiêu thụ đầu ra của chặng trước — như workflow phát hành đang làm</span></div></div>
</div>
</div>

<p>Kiểu hỏng cần canh chừng là một chuỗi sâu mà chẳng vì lý do gì: một job lint mà mọi thứ đều <code>needs:</code> nó, thuần tuý vì cảm giác ngăn nắp khi kiểm định dạng trước rồi mới dựng. Cái đó xếp 72 giây thành hàng dọc trước mặt mọi job khác và chẳng mua được gì, bởi một cú hỏng lint và một cú hỏng dựng đều là những thứ bạn muốn biết trong cùng một lần chạy. Độ sâu nên là một phụ thuộc DỮ LIỆU, không phải một sở thích về thứ tự.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>needs:</code> là công cụ sắp thứ tự duy nhất, nó đợi mọi job được nêu tên và mọi nhánh của một ma trận, và cái giá cho mỗi cạnh bạn thêm vào được trả bằng thời gian đồng hồ, bởi cái job xui xẻo nào xong trước.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Job <code>deploy</code> có <code>needs: [build, test]</code>. Test hỏng. Deploy làm gì, và giao diện hiện gì?</strong><br>Đ: Deploy bị SKIP chứ không hỏng, và mọi job phụ thuộc vào deploy cũng bị skip theo. Lần chạy đỏ vì đúng một job — test. Khi đọc một run đỏ, tìm dấu ✗ đầu tiên và bỏ qua các ⊘.</p>
<p><strong>H: <code>always()</code> khác <code>!cancelled()</code> thế nào? Dùng cái nào cho job gửi báo cáo test?</strong><br>Đ: <code>always()</code> chạy cả khi người dùng bấm huỷ; <code>!cancelled()</code> chạy sau thành công lẫn thất bại nhưng không chạy khi bị huỷ. Báo cáo và dọn dẹp dùng <code>!cancelled()</code> (hoặc <code>always()</code> nếu thật sự cần chạy cả khi huỷ, như tháo hạ tầng tạm). Deploy thì không bao giờ dùng cả hai.</p>
<p><strong>H: Làm sao chuyển số phiên bản tính ở job đầu sang job cuối?</strong><br>Đ: Ghi <code>ten=gia-tri</code> vào <code>$GITHUB_OUTPUT</code> ở một bước có <code>id</code>, ánh xạ lên <code>outputs:</code> của job, rồi job nhận khai <code>needs:</code> TRỰC TIẾP tới job đó và đọc <code>needs.&lt;job&gt;.outputs.&lt;ten&gt;</code>. Tên sai thì ra chuỗi rỗng, không lỗi — nên chạy actionlint.</p>
<p><strong>H: Workflow mất 12 phút. Bạn bắt đầu tối ưu từ đâu?</strong><br>Đ: Vẽ đồ thị <code>needs</code> với thời gian từng job và tính đường tới hạn — chuỗi dài nhất quyết định độ dài run. Tối ưu job ngoài đường tới hạn không rút được giây nào. Sau đó mới xét: bỏ các cạnh <code>needs</code> không phải phụ thuộc dữ liệu, gộp các job nhỏ tuần tự, cache (Chương 5), tách song song (Chương 7).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn dựng CI cho đồ án nhóm và muốn: test hỏng thì KHÔNG deploy, nhưng vẫn có một job báo cáo chạy, và số phiên bản tính một lần dùng cho mọi job.</p><ol>
<li>Tạo workflow có job <code>version</code> ghi <code>v=1.0.$GITHUB_RUN_NUMBER</code> vào <code>$GITHUB_OUTPUT</code> (bước có <code>id: v</code>) và khai <code>outputs: { v: &#36;{{ steps.v.outputs.v }} }</code>.</li>
<li>Thêm <code>test</code> (<code>needs: version</code>, chạy <code>exit 1</code>), <code>deploy</code> (<code>needs: [version, test]</code>, in số phiên bản), <code>report</code> (<code>needs: [test, deploy]</code>, <code>if: &#36;{{ !cancelled() }}</code>, in <code>&#36;{{ toJSON(needs) }}</code>).</li>
<li>Push. Vẽ lại đồ thị trên giấy với ✓ ✗ ⊘ trước khi mở tab Actions, rồi so.</li>
<li>Trong <code>report</code>, thêm dòng in <code>&#36;{{ needs.version.outputs.v }}</code>. Nó in gì? Chạy actionlint để xem nó nói gì.</li>
<li>Sửa <code>test</code> thành <code>exit 0</code>, push lại, và xác nhận <code>deploy</code> in đúng số phiên bản.</li></ol>
<p><strong>Đạt khi:</strong> lần chạy thứ nhất có đúng một ✗ (test), deploy ⊘ và report ✓ với <code>"deploy": {"result": "skipped"}</code> trong JSON; bạn giải thích được vì sao <code>needs.version.outputs.v</code> rỗng ở <code>report</code>; lần chạy thứ hai deploy in <code>1.0.&lt;số run&gt;</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>needs:</code> (phụ thuộc)</span><span class="v">Danh sách job phải xong trước. Công cụ sắp thứ tự DUY NHẤT giữa các job.</span></div>
  <div class="kv"><span class="k">Critical path (đường tới hạn)</span><span class="v">Chuỗi job phụ thuộc dài nhất; quyết định độ dài của cả lần chạy.</span></div>
  <div class="kv"><span class="k">Skipped (bị bỏ qua)</span><span class="v">Job không chạy vì điều kiện sai hoặc cha hỏng/skip. Không phải lỗi, không tốn máy; lan truyền xuống dưới.</span></div>
  <div class="kv"><span class="k">Job outputs (đầu ra của job)</span><span class="v">Chuỗi ngắn khai ở <code>outputs:</code>, đọc qua <code>needs.&lt;job&gt;.outputs</code>. Tối đa 1 MB/job.</span></div>
  <div class="kv"><span class="k"><code>$GITHUB_OUTPUT</code></span><span class="v">Đường dẫn tới tệp mà một bước ghi <code>ten=gia-tri</code> vào để tạo output của bước.</span></div>
  <div class="kv"><span class="k">Status check functions (hàm trạng thái)</span><span class="v"><code>success()</code>, <code>failure()</code>, <code>always()</code>, <code>cancelled()</code> — quyết định job/bước có chạy sau hỏng hay huỷ.</span></div>
  <div class="kv"><span class="k">Artifact (sản phẩm dựng)</span><span class="v">Tệp tải lên ở job này, tải về ở job khác; kênh chuyển TỆP giữa các máy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>needs:</code> là công cụ sắp thứ tự duy nhất; nó đợi MỌI job được nêu và mọi nhánh ma trận. Độ dài run = đường tới hạn — tối ưu job ngoài đường ấy là vô ích.</li>
<li>Mỗi cạnh <code>needs</code> tốn thêm một lần tạo job + chờ máy + Set up (đo: 2–4 giây, chưa kể checkout và cài lại). Chỉ tách job khi cần máy khác, chạy song song được, hay cần quyền khác.</li>
<li>Output đi 4 chặng: <code>$GITHUB_OUTPUT</code> → bước có <code>id</code> → <code>outputs:</code> của job → <code>needs.X.outputs</code> ở job nhận. Tên sai = chuỗi rỗng, không lỗi.</li>
<li>Ngữ cảnh <code>needs</code> chỉ có cha TRỰC TIẾP; output của "ông" là rỗng.</li>
<li>Cha hỏng → con SKIP, và skip lan truyền. <code>failure()</code> cho thông báo, <code>!cancelled()</code> cho báo cáo/dọn dẹp, <code>always()</code> chạy cả khi bị huỷ — không bao giờ cho deploy.</li>
<li>Mọi <code>if:</code> không nhắc hàm trạng thái đều ngầm là <code>success() &amp;&amp; …</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using jobs in a workflow: jobs.&lt;id&gt;.needs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow — ngữ nghĩa sắp thứ tự, luật lan truyền việc bỏ qua, và lối thoát <code>always()</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/upload-artifact và actions/download-artifact</span><span class="lc-sub">github.com/actions/upload-artifact — thiết lập thời hạn giữ, mức nén, và thay đổi từ v3 sang v4 khiến artifact thành bất biến theo từng job (làm vỡ khuôn mẫu cũ "nhiều job cùng nối thêm vào một artifact").</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Defining outputs for jobs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs — cơ chế <code>outputs:</code> / <code>needs.&lt;job&gt;.outputs</code> và giới hạn kích thước của nó, cho những lúc bạn cần một chuỗi chứ không phải một tệp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — đường tới hạn, và chuyện tối ưu cái job vốn đã ngồi chờ</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng kỷ luật đo đạc áp lên một đường ống deploy, gồm cả một ca mà đích tối ưu hiển nhiên hoá ra nằm hoàn toàn ngoài đường tới hạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — The same command on three platforms|||2.3 — Cùng một lệnh trên ba nền tảng',
      slug: 'ga-2-3-ba-nen-tang',
      type: 'VIDEO',
      description: 'Cùng một commit, cùng một lệnh, ba runner. Windows chậm hơn Linux 3,2 lần ở `npm ci` nhưng chỉ 1,1 lần ở bước dựng. macOS ngược lại. Không có "hệ số chậm" nào cả — và ở kho riêng tư, macOS chiếm 85% hoá đơn. Cộng: đo lại shell, đường dẫn, CRLF, bash 3.2 trên ba runner thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The same command on three platforms</h2>
<p class="lead">Run 32662461744 is an unusually clean experiment: one commit, one workflow file, three runners executing the same steps in the same order. Everything that differs between the three columns below is the platform and nothing else.</p>

<h3>The measurement</h3>
<div class="out">buoc                 Linux   macOS  Windows    mac/lin win/lin
--------------------------------------------------------------
checkout                7s      6s      11s       0.9x    1.6x
setup-node             13s     11s      22s       0.8x    1.7x
npm ci #1              12s     22s      39s       1.8x    3.2x
npm ci #2              26s     50s      68s       1.9x    2.6x
Dung                  149s    315s     171s       2.1x    1.1x
tai artifact len        8s     27s       6s       3.4x    0.8x
--------------------------------------------------------------
TONG                  215s    431s     317s       2.0x    1.5x

job tong (API):  Linux 241s  macOS 437s (1.81x)  Windows 323s (1.34x)</div>

<div class="callout warn">
<p><strong>Read down the ratio columns, not across the totals.</strong> There is no single number that describes how much slower a platform is. Windows is 3.2× slower at <code>npm ci</code> and 1.1× slower at the build. macOS is the reverse: 2.1× at the build, but <em>faster</em> than Linux at checkout and <code>setup-node</code>. The totals — 2.0× and 1.5× — are averages of things that have nothing to do with each other, and quoting them as "macOS is twice as slow" predicts the wrong number for any specific step.</p>
</div>

<h3>What each platform is actually bad at</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Windows · many small files</span><span class="lz-lnote"><code>npm ci</code> writes tens of thousands of tiny files. 107s total against Linux&#39;s 38s — <strong>2.8×</strong>. NTFS plus per-file antivirus filtering is the standard explanation, and the shape of the number fits it: the operations Windows loses on are the ones counted in file-creations, not in CPU cycles</span></div>
<div class="lz-layer"><span class="lz-lname">macOS · sustained CPU, and upload</span><span class="lz-lnote">the build step is 315s against 149s — <strong>2.1×</strong> — and the artifact upload is 27s against 8s, <strong>3.4×</strong>. The build is compilation and bundling; the upload is network. Both are places where the macOS runner fleet has historically had thinner hardware than the Linux one</span></div>
<div class="lz-layer"><span class="lz-lname">Linux · nothing, here</span><span class="lz-lnote">fastest or joint-fastest on five of six steps. It is also the platform every action is tested against first, so it is the one where things simply work. If a job does not need a specific OS, this is the answer</span></div>
<div class="lz-layer"><span class="lz-lname">the exception worth noticing</span><span class="lz-lnote">macOS beats Linux at <code>checkout</code> (6s vs 7s) and <code>setup-node</code> (11s vs 13s). Small, but it means "macOS runners are slow" is false as stated — they are slow at <em>some things</em></span></div>
</div>

<h3>The cost, which is a completely different ranking</h3>
${slide('ga-02', 20, 'Per-minute price by platform (09/2026)')}

<p>GitHub bills runner minutes at different rates per platform. This repository is public, so the API reports what it actually cost:</p>

<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Zero — public repositories get GitHub-hosted runners free. That makes this run a good place to ask the counterfactual: what would the identical run have cost in a <em>private</em> repository, where every runner minute has its own price per platform — Linux 2-core $0.006, Windows 2-core $0.010, macOS $0.062 (GitHub&#39;s price list as of 09/2026; an earlier version of this lesson used the pre-2026 “multipliers” 1×/2×/10×, which the documentation no longer publishes) — and every job is rounded UP to the minute?</p>

<div class="out">nen tang   giay that  phut tinh tien  gia/phut (09/2026)   thanh tien
----------------------------------------------------------------------
Linux           241s          5 phut   $0.006               $0.030
Windows         323s          6 phut   $0.010               $0.060
macOS           437s          8 phut   $0.062               $0.496
----------------------------------------------------------------------
TONG                                                        $0.586

macOS chiem 85% hoa don, du chi chiem 44% thoi gian that
(quy ra "phut Linux": 5 + 10 + 83 = 98 phut)</div>

<div class="callout warn">
<p><strong>macOS is 44% of the wall-clock and 85% of the bill.</strong> A per-minute price roughly 10× Linux&#39;s does something unintuitive: it makes the <em>slowest</em> platform also the most expensive per second, so the two effects multiply rather than trade off. A ten-minute macOS job on a private repository costs as much as about a hundred minutes of Linux. Any conversation about CI cost that does not separate these two rankings will optimise the wrong job.</p>
</div>

<div class="pitfall">
<p><strong>Trap — putting a platform-independent job on a matrix leg.</strong> If a step&#39;s result cannot differ between platforms — a lint pass, a typecheck, a JSON schema validation, a docs build — running it on all three legs of a matrix triples the wall-clock contribution and, at the multipliers above, multiplies the cost by thirteen for no additional information. Hoist those steps into a single Linux job that the matrix <code>needs:</code>. This repository does exactly that: <code>kiem-tra</code> runs once on Linux in 72 seconds, and only the genuinely platform-specific build fans out.</p>
</div>

<h3>Writing steps that work on all three</h3>
${slide('ga-02', 16, 'One run: line, three different shells')}

<p>The default shell is not the same everywhere, and this is where cross-platform workflows break in ways that are tedious rather than interesting:</p>

<div class="kv-grid">
<div class="kv"><span class="k">default shell</span><span class="v"><code>bash</code> on Linux and macOS; <strong>PowerShell</strong> on Windows. So <code>export FOO=1</code>, <code>&amp;&amp;</code> chains, <code>$(...)</code> and single-quoted strings all behave differently on one leg</span></div>
<div class="kv"><span class="k">the fix</span><span class="v"><code>shell: bash</code> on the step, or <code>defaults.run.shell: bash</code> on the job. Git Bash is present on the Windows runners, so this works — and it makes one shell dialect the whole workflow&#39;s problem instead of three</span></div>
<div class="kv"><span class="k">paths</span><span class="v">use forward slashes everywhere; Windows accepts them. Never build a path by string-concatenating with <code>/</code> or <code>\\\\</code> — use the runner variables (<code>\$GITHUB_WORKSPACE</code>) and let the tool resolve it</span></div>
<div class="kv"><span class="k">line endings</span><span class="v">checkout on Windows DOES apply <code>core.autocrlf=true</code> (measured below: the file arrives with <code>\\r \\n</code>). The runner&#39;s Git Bash still runs a CRLF script — measured below too — but once that file leaves the Windows machine (into a Linux Docker image, an artifact, a server) it fails with a message about <code>\\r</code> that names no file. If a script dies on Linux AFTER a Windows step produced it, check this before anything else</span></div>
<div class="kv"><span class="k">case sensitivity</span><span class="v">Linux is case-sensitive; macOS and Windows are usually not. <code>require('./Utils')</code> for a file named <code>utils.ts</code> passes on two platforms and fails on the third — and Linux is the one that is right</span></div>
</div>

<h3>Measured again on the sandbox: one step, three operating systems</h3>
${slide('ga-02', 18, 'Paths, CRLF and letter case on three platforms')}
<p>The table above measures time. This section measures BEHAVIOUR: the things that do not make a step slower but make it wrong. The sandbox workflow <code>ch02-ba-he.yml</code> runs the same sequence of steps on <code>ubuntu-24.04</code>, <code>macos-15</code> and <code>windows-2025</code>, from the same commit (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945528" target="_blank" rel="noopener">35989945528</a>, and <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990300805" target="_blank" rel="noopener">35990300805</a> for step G). Section 0 already measured the three machines&#39; hardware (cores, RAM, Node&#39;s heap ceiling); here it is shells, paths, line endings and letter case:</p>
<div class="out">buoc                                     ubuntu-24.04        macos-15            windows-2025
------------------------------------------------------------------------------------------------
A. run: (khong shell:)       shell:      /usr/bin/bash -e    /bin/bash -e        pwsh.EXE -command ". '{0}'"
C. shell: bash               $BASH       /usr/bin/bash       /bin/bash           /usr/bin/bash (Git Bash)
                             phien ban   5.2.21              3.2.57              5.3.15
   $GITHUB_WORKSPACE                     /home/runner/work/  /Users/runner/work/ D:\\a\\ga-san-tap\\
                                         ga-san-tap/...      ga-san-tap/...      ga-san-tap
   pwd                                   (nhu tren)          (nhu tren)          /d/a/ga-san-tap/ga-san-tap
   $RUNNER_TEMP                          .../work/_temp      .../work/_temp      D:\\a\\_temp
   $HOME                                 /home/runner        /Users/runner       /c/Users/runneradmin
D. core.autocrlf                         (chua dat)          (chua dat)          true
   od -c ch02/xin-chao.sh                ... b a s h \\n      ... b a s h \\n      ... b a s h \\r \\n
   bash ch02/xin-chao.sh                 chay                chay                chay (Git Bash chiu CRLF)
E. [ -f CH02/XIN-CHAO.SH ]               KHONG thay          THAY                THAY
------------------------------------------------------------------------------------------------
job (API): xep hang / chay               2s / 5s             8s / 8s             3s / 14s
checkout@v7                              0s                  1s                  5s</div>
<p>Row by row:</p>
<ul>
<li><strong>The default shell</strong> is three different things, and the <code>shell:</code> line is printed right under every step&#39;s title in the log — look at it before guessing anything. Even macOS and Linux are not identical: the Mac&#39;s <code>/bin/bash</code> is bash 3.2.</li>
<li><strong>Paths on Windows come in two forms within one step.</strong> Variables set by the runner (<code>$GITHUB_WORKSPACE</code>, <code>$RUNNER_TEMP</code>) are in Windows form <code>D:\\a\\...</code>; Git Bash&#39;s <code>pwd</code> is in the form <code>/d/a/...</code>. Both work inside Git Bash, but comparing them as strings (<code>[ "$(pwd)" = "$GITHUB_WORKSPACE" ]</code>) is always false on Windows.</li>
<li><strong>CRLF is real.</strong> <code>actions/checkout</code> on Windows lets Git use the machine&#39;s <code>core.autocrlf=true</code>, so a <code>.sh</code> file committed with LF arrives with <code>\\r\\n</code>. Git Bash tolerates it and the script still runs — the trap only fires when the file leaves the machine: if a Windows step packs it into an artifact and a Linux job runs it, or <code>docker build</code> copies it into a Linux image, you get <code>/bin/bash^M: bad interpreter</code>.</li>
<li><strong>Letter case:</strong> <code>CH02/XIN-CHAO.SH</code> does not exist, yet macOS and Windows both "see" it. Only Linux answers correctly — and cuongthai.com&#39;s production runs Linux. An <code>import './Utils'</code> with the wrong case is green on two legs and red only on the Linux leg: the red leg is the RIGHT one.</li>
<li><strong>Start-up time:</strong> the Windows job took 14 seconds for exactly the steps Linux ran in 5 — <code>checkout</code> alone 5 seconds against 0, and step B under pwsh 3 seconds. macOS queued longest (8 seconds): the Mac fleet is smaller, and the Free plan allows only 5 concurrent macOS jobs.</li>
</ul>

<h3>Windows: a command fails in the MIDDLE of the script, and the step is green</h3>
${slide('ga-02', 17, 'Windows (pwsh): a mid-script failure, a green step')}
<p>This is the most valuable finding of the measurement, and it is "the pipefail of Windows". Step B runs two <code>node</code> commands, the first exiting 3, with no <code>shell:</code>:</p>
<div class="out"># buoc B — khong ghi shell:, cung hai dong
node -e "process.exit(3)"
node -e "console.log('lenh sau van chay')"

ubuntu-24.04   shell: /usr/bin/bash -e {0}
               ##[error]Process completed with exit code 3.      -&gt; outcome=failure
macos-15       shell: /bin/bash -e {0}
               ##[error]Process completed with exit code 3.      -&gt; outcome=failure
windows-2025   shell: C:\\Program Files\\PowerShell\\7\\pwsh.EXE -command ". '{0}'"
               lenh sau van chay                                  -&gt; outcome=SUCCESS</div>
<p>On Linux and macOS, <code>bash -e</code> stops at the failing command and the step goes red with code 3. On Windows the second command RUNS, and the step is GREEN. The reason is in the "Workflow syntax" documentation if you read closely: for <code>pwsh</code>, GitHub prepends <code>$ErrorActionPreference = 'stop'</code> to the script — but that setting only stops when a POWERSHELL COMMAND reports an error (such as <code>Get-ChildItem</code> on a missing folder). An EXTERNAL program (<code>node</code>, <code>npm</code>, <code>git</code>, <code>dotnet</code>) exiting non-zero is not a "PowerShell error"; it only sets <code>$LASTEXITCODE</code>. GitHub then uses the <code>$LASTEXITCODE</code> of the LAST command as the step&#39;s exit code. The last command succeeded, so the step succeeded.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a "build then test" step on Windows.</strong> <code>npm run build</code> then <code>npm test</code> on two lines of the same <code>run:</code>: the build fails, the tests still run against an OLD or empty build and may pass, and the whole step is green. On Linux the same two lines go red in the right place. Three fixes, best first: <code>defaults: run: shell: bash</code> for the whole workflow; or split each important command into its own step; or, if you must use pwsh, set <code>$PSNativeCommandUseErrorActionPreference = $true</code> (PowerShell 7.3+) at the top of the script, or check <code>if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }</code> after every external command.</p>
</div>

<h3>shell: bash on macOS is bash 3.2 from 2007</h3>
${slide('ga-02', 19, 'shell: bash on macOS is bash 3.2')}
<p>Writing <code>shell: bash</code> seems to bring the three platforms onto one dialect. Almost. The runner picks the first <code>bash</code> on <code>PATH</code>, and on <code>macos-15</code> that is Apple&#39;s <code>/bin/bash</code> — bash 3.2.57, the last release before bash moved to the GPLv3 licence. Step G runs two pieces of bash 4 syntax (2009):</p>
<div class="out"># buoc G — shell: bash, cung mot script
ten="GitHub"; echo "chu thuong: &#36;{ten,,}"; declare -A m=([a]=1); echo "mang ket hop: &#36;{m[a]}"

ubuntu-24.04  (5.2.21)   chu thuong: github
                         mang ket hop: 1
windows-2025  (5.3.15)   chu thuong: github
                         mang ket hop: 1
macos-15      (3.2.57)   /Users/runner/work/_temp/0a80b55c-....sh: line 2: chu thuong: &#36;{ten,,}: bad substitution
                         ##[error]Process completed with exit code 1.</div>
<p>Common things bash 3.2 does NOT have: <code>&#36;{var,,}</code>/<code>&#36;{var^^}</code> (case conversion), <code>declare -A</code> (associative arrays), <code>mapfile</code>/<code>readarray</code>, <code>&amp;&gt;&gt;</code>, <code>|&amp;</code>, <code>globstar</code> (<code>**</code>). The safe approach: a script that runs in all three places uses only bash 3.2 syntax; anything more than a few lines is written in Node or Python — which every runner has and which behave the same on every OS. And print <code>$BASH_VERSION</code> in the first step when in doubt; do not guess.</p>

<h3>Run it step by step: a workflow that works on all three</h3>
<p>Putting everything above together, here is a skeleton for a three-OS matrix that avoids the traps just measured:</p>
<pre><code class="language-yaml">name: kiem ba nen tang
on: [push, pull_request]
defaults:
  run:
    shell: bash                 # MOT phuong ngu shell cho moi buoc, moi he dieu hanh, co pipefail
jobs:
  kiem:                         # viec KHONG phu thuoc nen tang: chay MOT lan, tren Linux
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v7
      - run: npm ci &amp;&amp; npm run lint &amp;&amp; npm run typecheck
  test:
    needs: kiem
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-24.04, windows-2025, macos-15]
    runs-on: &#36;{{ matrix.os }}
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc      # phien ban cong cu la cua KHO, khong phai cua anh may
      - run: npm ci
      - run: npm test
      - run: node scripts/kiem-duong-dan.mjs   # script Node chay giong nhau o ca ba — khong phu thuoc bash 3.2</code></pre>
<pre><code class="language-bash"># .gitattributes — de o goc kho, commit cung ma
*.sh   text eol=lf
*.bash text eol=lf
Dockerfile text eol=lf
*.ps1  text eol=crlf
*.png  binary</code></pre>
<ol>
<li><code>defaults.run.shell: bash</code> at workflow level: one dialect, with <code>pipefail</code>, and Windows no longer swallows exit codes mid-script.</li>
<li>Lint and type-check — things that cannot differ between operating systems — run ONCE on Linux. Only the genuinely platform-dependent work fans out into the matrix.</li>
<li><code>.gitattributes</code> forces LF for every script: Windows checks out LF, and files leaving the machine carry no <code>\\r</code>.</li>
<li>The Node version is read from a file in the repository; complex scripts are written in Node rather than bash.</li>
<li><code>fail-fast: false</code> (Lesson 2.5) so one failing leg does not wipe out the other two legs&#39; results, and <code>timeout-minutes</code> so a hung leg does not hold a machine for 6 hours.</li>
</ol>
<table>
<tr><th>Use a three-OS matrix WHEN…</th><th>Do NOT when…</th></tr>
<tr><td>you ship for all three (an Electron desktop app like this repository&#39;s, a CLI, a library with native code)</td><td>the product only runs on Linux (web, API, container) — testing on Mac/Windows only measures developers&#39; machines, not production</td></tr>
<tr><td>the code touches the filesystem, paths, child processes, line endings</td><td>the code is pure logic with no platform-specific I/O</td></tr>
<tr><td>users or teammates really use Windows (your team has a Windows user)</td><td>just "to be safe": a private repository pays ~10× Linux per minute for macOS</td></tr>
</table>

<h3>The failure this repository actually had</h3>
<p>Run 32400097927: <code>vite build</code> exited <strong>134</strong> on the macOS leg with <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code>. Linux and Windows built fine in the same run. The developer&#39;s own machine built it green in twenty seconds.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what it looked like</span><span class="lz-t">a macOS-only bug</span><span class="lz-d">two platforms green, one red, on the same commit</span></div>
<div class="lz-step"><span class="lz-k">what it was</span><span class="lz-t">a memory ceiling</span><span class="lz-d">the build was near the limit everywhere; macOS was the leg with the least headroom, so it was the one that crossed it first</span></div>
<div class="lz-step"><span class="lz-k">the fix</span><span class="lz-t">raise the heap, drop sourcemaps in CI</span><span class="lz-d"><code>node --max-old-space-size=6144</code> plus disabling sourcemaps when <code>CI</code> is set — verified by reproducing at a squeezed 1600MB heap: with sourcemaps exit 134, without exit 0</span></div>
</div>

<div class="callout ok">
<p><strong>The generalisable part.</strong> A failure on exactly one matrix leg is usually not a bug in that platform. It is a threshold — memory, disk, timing, a race — that the whole workflow was already close to, showing up first on the leg with the least margin. Fixing "the macOS bug" by special-casing macOS leaves the other two legs one dependency upgrade away from the same crash. The reproduction that proves you understood it is the one this repository did: shrink the resource deliberately on a <em>different</em> platform and watch the same failure appear.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Platforms do not have a speed, they have a profile — Windows loses on file counts, macOS on sustained CPU and upload — and the billing multipliers reorder the ranking again, so the cheap job and the fast job are frequently not the same job.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: In one workflow the Linux leg is red and macOS and Windows are green, with <code>Cannot find module './Utils'</code>. Whose bug is it?</strong><br>A: The code&#39;s. Linux is case-sensitive and macOS/Windows usually are not, so a file <code>utils.ts</code> imported as <code>./Utils</code> only fails on Linux — and production usually runs Linux. The red leg is telling the truth; fix the import, do not switch off the Linux leg.</p>
<p><strong>Q: A step runs two commands on Windows; the first fails and the step is still green. Why, and how do you fix it?</strong><br>A: The default shell on Windows is pwsh; <code>$ErrorActionPreference='stop'</code> does not stop when an external program exits non-zero, and the step takes the exit code of the last command. Fix: <code>defaults.run.shell: bash</code>, or split the steps, or check <code>$LASTEXITCODE</code> after every command.</p>
<p><strong>Q: Your company uses private repositories. A matrix runs tests on all three OSes on every PR. How do you cut the cost without losing coverage?</strong><br>A: Platform-independent work (lint, type-check, pure-logic tests) runs on Linux only; the macOS leg runs only when it matters (on push to main, on a schedule, or when platform-dependent code changes); use <code>ubuntu-24.04-arm</code> or <code>ubuntu-slim</code> for small jobs; set <code>timeout-minutes</code>. macOS costs ~10× Linux per minute, so it is often the whole bill.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your teammate uses Windows, you use a Mac, the server is Linux. You want to know BEFORE an incident where the three machines differ.</p><ol>
<li>In a test repository, create a matrix workflow with <code>os: [ubuntu-latest, windows-latest, macos-latest]</code> and <code>fail-fast: false</code>.</li>
<li>Step 1 (no <code>shell:</code>): <code>node -e "process.exit(3)"</code> then <code>node -e "console.log('still runs')"</code>, with <code>continue-on-error: true</code> and <code>id: b1</code>.</li>
<li>Step 2 (<code>shell: bash</code>): print <code>$BASH_VERSION</code>, <code>$GITHUB_WORKSPACE</code>, <code>pwd</code>, <code>git config --get core.autocrlf</code> and <code>od -c</code> of the first two lines of a <code>.sh</code> file in the repository.</li>
<li>Step 3: print <code>&#36;{{ steps.b1.outcome }}</code>.</li>
<li>Add a <code>.gitattributes</code> with <code>*.sh text eol=lf</code>, push again, and look at <code>od -c</code> on Windows.</li></ol>
<p><strong>Done when:</strong> you can fill a 3-column × 5-row table (default shell, step 1&#39;s <code>outcome</code>, bash version, path form, <code>\\r</code> present or not) from real logs; the Windows leg has <code>outcome=success</code> on step 1; macOS prints bash 3.2; and after adding <code>.gitattributes</code>, <code>od -c</code> on Windows shows no <code>\\r</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Default shell</span><span class="v">The shell that runs <code>run:</code> when no <code>shell:</code> is given: <code>bash -e</code> on Linux/macOS, <code>pwsh</code> on Windows.</span></div>
  <div class="kv"><span class="k"><code>defaults.run.shell</code></span><span class="v">Sets the shell for every step of a workflow or job; <code>bash</code> here comes with <code>pipefail</code>.</span></div>
  <div class="kv"><span class="k"><code>$LASTEXITCODE</code></span><span class="v">The exit code of the last external program run in PowerShell; a pwsh step takes the value of the LAST command.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Windows uses <code>\\r\\n</code>, Linux/macOS use <code>\\n</code>. A bash script carrying <code>\\r</code> breaks on Linux.</span></div>
  <div class="kv"><span class="k"><code>core.autocrlf</code></span><span class="v">The Git setting that converts LF↔CRLF on checkout/commit; the Windows runner has it <code>true</code>.</span></div>
  <div class="kv"><span class="k"><code>.gitattributes</code></span><span class="v">A file in the repository that forces line endings by file extension — it wins over the machine&#39;s <code>core.autocrlf</code>.</span></div>
  <div class="kv"><span class="k">Case-sensitive</span><span class="v">Linux treats <code>Utils</code> and <code>utils</code> as two files; macOS/Windows by default do not.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A platform has no single "speed", it has a PROFILE: Windows loses on file count (<code>npm ci</code> 3.2×), macOS on sustained CPU and upload; measured on one commit.</li>
<li>Per-minute price (private repositories, 09/2026): Linux $0.006 · Windows $0.010 · macOS $0.062 — macOS is 44% of the time but 85% of the bill. Public repositories: free.</li>
<li>Default shells: <code>bash -e</code> (Linux, macOS) and <code>pwsh</code> (Windows). Under pwsh, an external command failing in the MIDDLE of a script does not turn the step red — measured.</li>
<li><code>shell: bash</code> on macOS is bash 3.2: no <code>&#36;{x,,}</code>, no <code>declare -A</code>. Complex scripts go in Node/Python.</li>
<li>Windows checks out CRLF and has two path forms; Linux is the only case-sensitive one — a red Linux leg is usually the right one.</li>
<li>The safe skeleton: <code>defaults.run.shell: bash</code>, platform-independent work once on Linux, <code>.gitattributes</code> forcing LF, <code>fail-fast: false</code>, <code>timeout-minutes</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About billing for GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions — the per-platform multipliers, the per-job rounding rule, and the statement that public repositories use standard runners for free.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — hardware specification per platform</span><span class="lc-sub">github.com/actions/runner-images#available-images — the vCPU, RAM and disk actually allocated on each label, which is the first place to look when one matrix leg runs out of something.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.defaults.run.shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#defaultsrun — the available shells per platform and how to force one, which removes most cross-platform step breakage in a single line.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — one image, two libc implementations, and a build that was green and dead</span><span class="lc-sub">/courses/docker/learn${REF} — the same lesson in a different medium: a build succeeding says nothing about whether the artefact runs on the target, and the check that catches it has to happen before the swap.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — the V8 heap limit and what --max-old-space-size does</span><span class="lc-sub">/courses/nodejs/learn${REF} — why exit code 134 means what it means, and why the default heap ceiling is a function of the machine rather than of your code.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Cùng một lệnh trên ba nền tảng</h2>
<p class="lead">Lần chạy 32662461744 là một thí nghiệm sạch hiếm có: một commit, một tệp workflow, ba runner thực thi cùng những bước theo cùng thứ tự. Mọi thứ khác nhau giữa ba cột dưới đây là NỀN TẢNG chứ không gì khác.</p>

<h3>Phép đo</h3>
<div class="out">buoc                 Linux   macOS  Windows    mac/lin win/lin
--------------------------------------------------------------
checkout                7s      6s      11s       0.9x    1.6x
setup-node             13s     11s      22s       0.8x    1.7x
npm ci #1              12s     22s      39s       1.8x    3.2x
npm ci #2              26s     50s      68s       1.9x    2.6x
Dung                  149s    315s     171s       2.1x    1.1x
tai artifact len        8s     27s       6s       3.4x    0.8x
--------------------------------------------------------------
TONG                  215s    431s     317s       2.0x    1.5x

job tong (API):  Linux 241s  macOS 437s (1.81x)  Windows 323s (1.34x)</div>

<div class="callout warn">
<p><strong>Hãy đọc DỌC theo cột tỉ lệ, đừng đọc ngang hàng tổng.</strong> Không có một con số duy nhất nào mô tả được một nền tảng chậm hơn bao nhiêu. Windows chậm hơn 3,2 lần ở <code>npm ci</code> và 1,1 lần ở bước dựng. macOS thì ngược: 2,1 lần ở bước dựng, nhưng <em>NHANH HƠN</em> Linux ở checkout và <code>setup-node</code>. Mấy con số tổng — 2,0 lần và 1,5 lần — là trung bình của những thứ chẳng liên quan gì tới nhau, và đem chúng ra nói "macOS chậm gấp đôi" là dự đoán sai con số cho bất kỳ bước cụ thể nào.</p>
</div>

<h3>Mỗi nền tảng thật ra DỞ ở chỗ nào</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Windows · nhiều file nhỏ</span><span class="lz-lnote"><code>npm ci</code> ghi hàng chục nghìn file tí hon. Tổng 107s so với 38s của Linux — <strong>2,8 lần</strong>. NTFS cộng với việc chống virus lọc từng file là lời giải thích tiêu chuẩn, và hình dạng con số khớp với nó: những thao tác Windows thua đều là thứ đếm bằng số lần TẠO FILE, không phải bằng chu kỳ CPU</span></div>
<div class="lz-layer"><span class="lz-lname">macOS · CPU chạy dài, và tải lên</span><span class="lz-lnote">bước dựng 315s so với 149s — <strong>2,1 lần</strong> — và tải artifact lên 27s so với 8s, <strong>3,4 lần</strong>. Bước dựng là biên dịch và đóng gói; tải lên là mạng. Cả hai đều là chỗ mà đội runner macOS xưa nay có phần cứng mỏng hơn đội Linux</span></div>
<div class="lz-layer"><span class="lz-lname">Linux · không dở gì cả, ở đây</span><span class="lz-lnote">nhanh nhất hoặc đồng nhanh nhất ở năm trên sáu bước. Nó cũng là nền tảng mà mọi action được kiểm thử đầu tiên, nên nó là chỗ mọi thứ đơn giản là CHẠY. Nếu một job không cần một hệ điều hành cụ thể, đây là câu trả lời</span></div>
<div class="lz-layer"><span class="lz-lname">ngoại lệ đáng để ý</span><span class="lz-lnote">macOS thắng Linux ở <code>checkout</code> (6s so 7s) và <code>setup-node</code> (11s so 13s). Nhỏ, nhưng nó nghĩa là câu "runner macOS chậm" SAI như đã phát biểu — chúng chậm ở <em>MỘT SỐ việc</em></span></div>
</div>

<h3>Chi phí, và đó là một bảng xếp hạng hoàn toàn khác</h3>
${slide('ga-02', 20, 'Giá mỗi phút theo nền tảng (09/2026)')}

<p>GitHub tính tiền phút runner theo mức khác nhau tuỳ nền tảng. Kho này công khai, nên API báo cái nó THẬT SỰ tốn:</p>

<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Bằng không — kho công khai được dùng runner do GitHub cấp miễn phí. Điều đó khiến lần chạy này thành chỗ tốt để hỏi câu giả định: lần chạy y hệt ấy sẽ tốn bao nhiêu ở một kho <em>RIÊNG TƯ</em>, nơi mỗi phút runner có giá riêng theo nền tảng — Linux 2 lõi $0,006, Windows 2 lõi $0,010, macOS $0,062 (bảng giá của GitHub, tính đến 09/2026; bản trước của bài này dùng “hệ số” 1×/2×/10× của bảng giá cũ trước 2026, thứ tài liệu hiện không còn công bố) — và mỗi job được làm tròn LÊN phút?</p>

<div class="out">nen tang   giay that  phut tinh tien  gia/phut (09/2026)   thanh tien
----------------------------------------------------------------------
Linux           241s          5 phut   $0.006               $0.030
Windows         323s          6 phut   $0.010               $0.060
macOS           437s          8 phut   $0.062               $0.496
----------------------------------------------------------------------
TONG                                                        $0.586

macOS chiem 85% hoa don, du chi chiem 44% thoi gian that
(quy ra "phut Linux": 5 + 10 + 83 = 98 phut)</div>

<div class="callout warn">
<p><strong>macOS chiếm 44% thời gian đồng hồ và 85% hoá đơn.</strong> Giá mỗi phút gấp khoảng 10 lần Linux làm một chuyện phản trực giác: nó khiến nền tảng <em>CHẬM NHẤT</em> cũng đồng thời đắt nhất tính theo giây, nên hai hiệu ứng NHÂN với nhau chứ không bù trừ. Một job macOS mười phút ở kho riêng tư tốn bằng khoảng một trăm phút Linux. Mọi cuộc bàn về chi phí CI mà không tách hai bảng xếp hạng này ra sẽ đi tối ưu nhầm job.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — đặt một việc không phụ thuộc nền tảng lên một nhánh ma trận.</strong> Nếu kết quả một bước không thể khác nhau giữa các nền tảng — một lượt lint, một lượt kiểm kiểu, một lượt kiểm lược đồ JSON, một bản dựng tài liệu — thì chạy nó trên cả ba nhánh ma trận sẽ nhân ba phần đóng góp vào thời gian đồng hồ và, với các hệ số trên, nhân chi phí lên MƯỜI BA lần mà không thu thêm được thông tin nào. Hãy nhấc mấy bước ấy lên một job Linux duy nhất mà ma trận <code>needs:</code> tới. Kho này làm đúng như thế: <code>kiem-tra</code> chạy MỘT lần trên Linux trong 72 giây, và chỉ bước dựng thật sự phụ thuộc nền tảng mới toả ra.</p>
</div>

<h3>Viết bước chạy được trên cả ba</h3>
${slide('ga-02', 16, 'Cùng một dòng run:, ba shell khác nhau')}

<p>Shell mặc định không giống nhau ở mọi nơi, và đây là chỗ các workflow đa nền tảng vỡ theo kiểu buồn tẻ chứ không thú vị:</p>

<div class="kv-grid">
<div class="kv"><span class="k">shell mặc định</span><span class="v"><code>bash</code> trên Linux và macOS; <strong>PowerShell</strong> trên Windows. Nên <code>export FOO=1</code>, chuỗi <code>&amp;&amp;</code>, <code>$(...)</code> và chuỗi trong nháy đơn đều cư xử khác ở một nhánh</span></div>
<div class="kv"><span class="k">cách vá</span><span class="v"><code>shell: bash</code> trên bước, hoặc <code>defaults.run.shell: bash</code> trên job. Git Bash có sẵn trên runner Windows nên cái này chạy được — và nó biến MỘT phương ngữ shell thành vấn đề của cả workflow thay vì ba</span></div>
<div class="kv"><span class="k">đường dẫn</span><span class="v">dùng gạch chéo xuôi ở mọi nơi; Windows chấp nhận. Đừng bao giờ ghép chuỗi đường dẫn bằng tay với <code>/</code> hay <code>\\\\</code> — dùng biến của runner (<code>\$GITHUB_WORKSPACE</code>) rồi để công cụ tự phân giải</span></div>
<div class="kv"><span class="k">ký tự xuống dòng</span><span class="v">checkout trên Windows CÓ áp <code>core.autocrlf=true</code> (đo ở dưới: tệp tới nơi mang <code>\\r \\n</code>). Git Bash của runner vẫn chạy được script CRLF — cũng đo ở dưới — nhưng một khi tệp đó rời máy Windows (vào một ảnh Docker Linux, một artifact, một máy chủ) thì nó hỏng với một thông báo về <code>\\r</code> chẳng nêu tên tệp nào. Nếu một script chết trên Linux SAU khi một bước Windows tạo ra nó, hãy kiểm chỗ này trước mọi thứ khác</span></div>
<div class="kv"><span class="k">phân biệt hoa thường</span><span class="v">Linux phân biệt; macOS và Windows thường thì không. <code>require('./Utils')</code> cho một file tên <code>utils.ts</code> sẽ qua ở hai nền tảng và hỏng ở cái thứ ba — và Linux mới là cái ĐÚNG</span></div>
</div>

<h3>Đo lại trên sân tập: cùng một bước, ba hệ điều hành</h3>
${slide('ga-02', 18, 'Đường dẫn, CRLF, hoa thường trên ba nền tảng')}
<p>Bảng số ở trên đo thời gian. Phần này đo HÀNH VI: những thứ không làm bước chậm đi mà làm nó sai đi. Workflow <code>ch02-ba-he.yml</code> trên sân tập chạy cùng một chuỗi bước trên <code>ubuntu-24.04</code>, <code>macos-15</code> và <code>windows-2025</code>, cùng một commit (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945528" target="_blank" rel="noopener">35989945528</a>, và <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990300805" target="_blank" rel="noopener">35990300805</a> cho bước G). Mục 0 đã đo phần cứng của ba máy (số lõi, RAM, trần heap của Node); ở đây là shell, đường dẫn, xuống dòng, hoa thường:</p>
<div class="out">buoc                                     ubuntu-24.04        macos-15            windows-2025
------------------------------------------------------------------------------------------------
A. run: (khong shell:)       shell:      /usr/bin/bash -e    /bin/bash -e        pwsh.EXE -command ". '{0}'"
C. shell: bash               $BASH       /usr/bin/bash       /bin/bash           /usr/bin/bash (Git Bash)
                             phien ban   5.2.21              3.2.57              5.3.15
   $GITHUB_WORKSPACE                     /home/runner/work/  /Users/runner/work/ D:\\a\\ga-san-tap\\
                                         ga-san-tap/...      ga-san-tap/...      ga-san-tap
   pwd                                   (nhu tren)          (nhu tren)          /d/a/ga-san-tap/ga-san-tap
   $RUNNER_TEMP                          .../work/_temp      .../work/_temp      D:\\a\\_temp
   $HOME                                 /home/runner        /Users/runner       /c/Users/runneradmin
D. core.autocrlf                         (chua dat)          (chua dat)          true
   od -c ch02/xin-chao.sh                ... b a s h \\n      ... b a s h \\n      ... b a s h \\r \\n
   bash ch02/xin-chao.sh                 chay                chay                chay (Git Bash chiu CRLF)
E. [ -f CH02/XIN-CHAO.SH ]               KHONG thay          THAY                THAY
------------------------------------------------------------------------------------------------
job (API): xep hang / chay               2s / 5s             8s / 8s             3s / 14s
checkout@v7                              0s                  1s                  5s</div>
<p>Đọc theo từng hàng:</p>
<ul>
<li><strong>Shell mặc định</strong> là ba thứ khác nhau, và dòng <code>shell:</code> được in ngay dưới tiêu đề mỗi bước trong log — nhìn nó trước khi đoán bất cứ điều gì. Kể cả macOS với Linux cũng không y hệt: <code>/bin/bash</code> của Mac là bash 3.2.</li>
<li><strong>Đường dẫn trên Windows có hai dạng trong cùng một bước.</strong> Biến do runner đặt (<code>$GITHUB_WORKSPACE</code>, <code>$RUNNER_TEMP</code>) ở dạng Windows <code>D:\\a\\...</code>; <code>pwd</code> của Git Bash ở dạng <code>/d/a/...</code>. Cả hai đều dùng được trong Git Bash, nhưng đem so sánh chuỗi (<code>[ "$(pwd)" = "$GITHUB_WORKSPACE" ]</code>) thì luôn sai trên Windows.</li>
<li><strong>CRLF là thật.</strong> <code>actions/checkout</code> trên Windows để Git dùng <code>core.autocrlf=true</code> của máy, nên tệp <code>.sh</code> commit với LF tới nơi mang <code>\\r\\n</code>. Git Bash chịu được, script vẫn chạy — cái bẫy chỉ nổ khi tệp đó rời máy: nếu bước Windows đóng gói nó vào một artifact rồi một job Linux chạy nó, hoặc <code>docker build</code> chép nó vào một ảnh Linux, bạn nhận <code>/bin/bash^M: bad interpreter</code>.</li>
<li><strong>Hoa thường:</strong> <code>CH02/XIN-CHAO.SH</code> không tồn tại, vậy mà macOS và Windows đều "thấy" nó. Chỉ Linux trả lời đúng — và production của cuongthai.com chạy Linux. Một <code>import './Utils'</code> sai hoa thường sẽ xanh trên hai nhánh và chỉ đỏ trên nhánh Linux: nhánh đỏ là nhánh ĐÚNG.</li>
<li><strong>Thời gian khởi động:</strong> job Windows chạy 14 giây cho đúng những bước mà Linux chạy 5 giây — riêng <code>checkout</code> 5 giây so với 0 giây, và bước B dưới pwsh 3 giây. macOS xếp hàng lâu nhất (8 giây): đội máy Mac nhỏ hơn, và gói Free chỉ cho 5 job macOS chạy cùng lúc.</li>
</ul>

<h3>Windows: một lệnh hỏng ở GIỮA script, bước vẫn xanh</h3>
${slide('ga-02', 17, 'Windows (pwsh): lệnh hỏng ở giữa, bước vẫn xanh')}
<p>Đây là phát hiện đáng giá nhất của phép đo, và nó là "pipefail của Windows". Bước B chạy hai lệnh <code>node</code>, lệnh đầu thoát 3, không ghi <code>shell:</code>:</p>
<div class="out"># buoc B — khong ghi shell:, cung hai dong
node -e "process.exit(3)"
node -e "console.log('lenh sau van chay')"

ubuntu-24.04   shell: /usr/bin/bash -e {0}
               ##[error]Process completed with exit code 3.      -&gt; outcome=failure
macos-15       shell: /bin/bash -e {0}
               ##[error]Process completed with exit code 3.      -&gt; outcome=failure
windows-2025   shell: C:\\Program Files\\PowerShell\\7\\pwsh.EXE -command ". '{0}'"
               lenh sau van chay                                  -&gt; outcome=SUCCESS</div>
<p>Trên Linux và macOS, <code>bash -e</code> dừng ngay ở lệnh hỏng và bước đỏ với mã 3. Trên Windows, lệnh thứ hai CHẠY, và bước XANH. Lý do nằm trong tài liệu "Workflow syntax" nếu đọc kỹ: với <code>pwsh</code>, GitHub chèn <code>$ErrorActionPreference = 'stop'</code> vào đầu script — nhưng thiết lập này chỉ dừng khi một LỆNH POWERSHELL báo lỗi (như <code>Get-ChildItem</code> một thư mục không có). Một chương trình NGOÀI (<code>node</code>, <code>npm</code>, <code>git</code>, <code>dotnet</code>) thoát khác 0 không phải "lỗi PowerShell"; nó chỉ đặt <code>$LASTEXITCODE</code>. GitHub rồi lấy <code>$LASTEXITCODE</code> của lệnh CUỐI CÙNG làm mã thoát của bước. Lệnh cuối thành công, nên bước thành công.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một bước "build rồi test" trên Windows.</strong> <code>npm run build</code> rồi <code>npm test</code> trên hai dòng của cùng một <code>run:</code>: build hỏng, test vẫn chạy trên bản dựng CŨ hay rỗng và có thể xanh, và cả bước xanh. Trên Linux cùng hai dòng ấy đỏ đúng chỗ. Ba cách vá, từ tốt nhất: <code>defaults: run: shell: bash</code> cho cả workflow; hoặc tách mỗi lệnh quan trọng thành một bước riêng; hoặc nếu buộc phải dùng pwsh, đặt <code>$PSNativeCommandUseErrorActionPreference = $true</code> (PowerShell 7.3+) ở đầu script, hay kiểm <code>if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }</code> sau mỗi lệnh ngoài.</p>
</div>

<h3>shell: bash trên macOS là bash 3.2 của năm 2007</h3>
${slide('ga-02', 19, 'shell: bash trên macOS là bash 3.2')}
<p>Viết <code>shell: bash</code> tưởng như đã đưa ba nền tảng về một phương ngữ. Gần đúng. Runner chọn <code>bash</code> đầu tiên trên <code>PATH</code>, và trên <code>macos-15</code> đó là <code>/bin/bash</code> của Apple — bash 3.2.57, bản cuối cùng trước khi bash đổi sang giấy phép GPLv3. Bước G chạy hai cú pháp của bash 4 (2009):</p>
<div class="out"># buoc G — shell: bash, cung mot script
ten="GitHub"; echo "chu thuong: &#36;{ten,,}"; declare -A m=([a]=1); echo "mang ket hop: &#36;{m[a]}"

ubuntu-24.04  (5.2.21)   chu thuong: github
                         mang ket hop: 1
windows-2025  (5.3.15)   chu thuong: github
                         mang ket hop: 1
macos-15      (3.2.57)   /Users/runner/work/_temp/0a80b55c-....sh: line 2: chu thuong: &#36;{ten,,}: bad substitution
                         ##[error]Process completed with exit code 1.</div>
<p>Những thứ hay dùng mà bash 3.2 KHÔNG có: <code>&#36;{var,,}</code>/<code>&#36;{var^^}</code> (đổi hoa thường), <code>declare -A</code> (mảng kết hợp), <code>mapfile</code>/<code>readarray</code>, <code>&amp;&gt;&gt;</code>, <code>|&amp;</code>, <code>globstar</code> (<code>**</code>). Cách an toàn: script chạy ở cả ba nơi thì chỉ dùng cú pháp bash 3.2; việc gì phức tạp hơn vài dòng thì viết bằng Node hoặc Python — hai thứ runner nào cũng có và cư xử giống nhau ở mọi hệ điều hành. Và in <code>$BASH_VERSION</code> ở bước đầu tiên khi nghi ngờ, đừng đoán.</p>

<h3>Chạy thử từng bước: một workflow chạy được ở cả ba</h3>
<p>Gom mọi thứ ở trên lại, đây là khung cho một ma trận ba hệ điều hành không dính những cái bẫy vừa đo:</p>
<pre><code class="language-yaml">name: kiem ba nen tang
on: [push, pull_request]
defaults:
  run:
    shell: bash                 # MOT phuong ngu shell cho moi buoc, moi he dieu hanh, co pipefail
jobs:
  kiem:                         # viec KHONG phu thuoc nen tang: chay MOT lan, tren Linux
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v7
      - run: npm ci &amp;&amp; npm run lint &amp;&amp; npm run typecheck
  test:
    needs: kiem
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-24.04, windows-2025, macos-15]
    runs-on: &#36;{{ matrix.os }}
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc      # phien ban cong cu la cua KHO, khong phai cua anh may
      - run: npm ci
      - run: npm test
      - run: node scripts/kiem-duong-dan.mjs   # script Node chay giong nhau o ca ba — khong phu thuoc bash 3.2</code></pre>
<pre><code class="language-bash"># .gitattributes — de o goc kho, commit cung ma
*.sh   text eol=lf
*.bash text eol=lf
Dockerfile text eol=lf
*.ps1  text eol=crlf
*.png  binary</code></pre>
<ol>
<li><code>defaults.run.shell: bash</code> ở mức workflow: một phương ngữ, có <code>pipefail</code>, và Windows không còn nuốt mã thoát ở giữa.</li>
<li>Lint, kiểm kiểu — những việc không thể khác nhau giữa các hệ điều hành — chạy MỘT lần trên Linux. Chỉ việc thật sự phụ thuộc nền tảng mới toả ra ma trận.</li>
<li><code>.gitattributes</code> ép LF cho mọi script: Windows checkout ra LF, và tệp rời máy không mang <code>\\r</code>.</li>
<li>Phiên bản Node đọc từ tệp của kho; script phức tạp viết bằng Node thay vì bash.</li>
<li><code>fail-fast: false</code> (bài 2.5) để một nhánh hỏng không xoá mất kết quả của hai nhánh kia, và <code>timeout-minutes</code> để một nhánh treo không giữ máy 6 tiếng.</li>
</ol>
<table>
<tr><th>Dùng ma trận ba hệ điều hành KHI…</th><th>KHÔNG dùng khi…</th></tr>
<tr><td>bạn phát hành cho cả ba (app desktop Electron như kho này, một CLI, một thư viện có mã native)</td><td>sản phẩm chỉ chạy trên Linux (web, API, container) — test trên Mac/Windows chỉ đo máy của lập trình viên, không đo production</td></tr>
<tr><td>mã đụng hệ tệp, đường dẫn, tiến trình con, ký tự xuống dòng</td><td>mã thuần logic, không I/O theo nền tảng</td></tr>
<tr><td>người dùng hoặc đồng đội thật sự dùng Windows (nhóm của bạn có người dùng Windows)</td><td>chỉ để "cho chắc": kho riêng tư trả tiền macOS ~10× Linux mỗi phút</td></tr>
</table>

<h3>Cú hỏng kho này thật sự đã gặp</h3>
<p>Lần chạy 32400097927: <code>vite build</code> thoát <strong>134</strong> ở nhánh macOS với <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code>. Linux và Windows dựng ổn trong cùng lần chạy ấy. Máy của chính người viết dựng xanh trong hai mươi giây.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">nó TRÔNG như</span><span class="lz-t">một lỗi chỉ có ở macOS</span><span class="lz-d">hai nền tảng xanh, một đỏ, trên cùng một commit</span></div>
<div class="lz-step"><span class="lz-k">nó THẬT SỰ là</span><span class="lz-t">một trần bộ nhớ</span><span class="lz-d">bản dựng đã sát trần ở mọi nơi; macOS là nhánh còn ít khoảng trống nhất nên nó là cái vượt qua trước</span></div>
<div class="lz-step"><span class="lz-k">cách vá</span><span class="lz-t">nâng heap, bỏ sourcemap ở CI</span><span class="lz-d"><code>node --max-old-space-size=6144</code> cộng với tắt sourcemap khi có biến <code>CI</code> — kiểm chứng bằng cách tái lập ở heap bóp còn 1600MB: có sourcemap thoát 134, không có thoát 0</span></div>
</div>

<div class="callout ok">
<p><strong>Phần khái quát được.</strong> Một cú hỏng ở đúng MỘT nhánh ma trận thường không phải lỗi của nền tảng ấy. Nó là một NGƯỠNG — bộ nhớ, đĩa, thời gian, một cuộc đua — mà cả workflow vốn đã ở sát, và nó lộ ra trước ở cái nhánh còn ít lề nhất. Vá "lỗi macOS" bằng cách xử lý đặc biệt cho macOS thì hai nhánh kia vẫn chỉ cách cùng cú sập đúng một lần nâng cấp thư viện. Phép tái lập chứng minh bạn đã hiểu đúng là phép mà kho này đã làm: BÓP tài nguyên có chủ ý trên một nền tảng <em>KHÁC</em> rồi xem đúng cú hỏng ấy hiện ra.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Các nền tảng không có một TỐC ĐỘ, chúng có một HỒ SƠ — Windows thua ở số lượng file, macOS thua ở CPU chạy dài và ở tải lên — và các hệ số tính tiền còn xáo lại bảng xếp hạng lần nữa, nên job rẻ và job nhanh thường xuyên không phải cùng một job.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Cùng một workflow, nhánh Linux đỏ còn macOS và Windows xanh vì <code>Cannot find module './Utils'</code>. Lỗi của ai?</strong><br>Đ: Của mã. Linux phân biệt hoa thường, macOS/Windows thường thì không, nên tệp <code>utils.ts</code> được import bằng <code>./Utils</code> chỉ hỏng ở Linux — và production thường chạy Linux. Nhánh đỏ đang nói đúng; sửa tên import, đừng tắt nhánh Linux.</p>
<p><strong>H: Một bước chạy hai lệnh trên Windows, lệnh đầu hỏng mà bước vẫn xanh. Vì sao, và sửa thế nào?</strong><br>Đ: Shell mặc định trên Windows là pwsh; <code>$ErrorActionPreference='stop'</code> không dừng khi chương trình ngoài thoát khác 0, và bước lấy mã thoát của lệnh cuối. Sửa: <code>defaults.run.shell: bash</code>, hoặc tách bước, hoặc kiểm <code>$LASTEXITCODE</code> sau mỗi lệnh.</p>
<p><strong>H: Công ty dùng kho riêng tư. Ma trận chạy test trên cả ba hệ điều hành ở mọi PR. Bạn cắt chi phí thế nào mà không mất độ phủ?</strong><br>Đ: Việc không phụ thuộc nền tảng (lint, kiểm kiểu, test logic thuần) chỉ chạy trên Linux; nhánh macOS chỉ chạy khi thật sự cần (khi push vào main, theo lịch, hoặc khi đổi mã phụ thuộc nền tảng); dùng <code>ubuntu-24.04-arm</code> hoặc <code>ubuntu-slim</code> cho việc nhỏ; đặt <code>timeout-minutes</code>. macOS giá mỗi phút ~10 lần Linux, nên nó thường là cả hoá đơn.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm dùng Windows, bạn dùng Mac, server là Linux. Bạn muốn biết TRƯỚC khi có sự cố thì ba máy khác nhau ở đâu.</p><ol>
<li>Trong kho thử, tạo workflow ma trận <code>os: [ubuntu-latest, windows-latest, macos-latest]</code>, <code>fail-fast: false</code>.</li>
<li>Bước 1 (không ghi <code>shell:</code>): <code>node -e "process.exit(3)"</code> rồi <code>node -e "console.log('van chay')"</code>, kèm <code>continue-on-error: true</code> và <code>id: b1</code>.</li>
<li>Bước 2 (<code>shell: bash</code>): in <code>$BASH_VERSION</code>, <code>$GITHUB_WORKSPACE</code>, <code>pwd</code>, <code>git config --get core.autocrlf</code> và <code>od -c</code> hai dòng đầu của một tệp <code>.sh</code> trong kho.</li>
<li>Bước 3: in <code>&#36;{{ steps.b1.outcome }}</code>.</li>
<li>Thêm <code>.gitattributes</code> với <code>*.sh text eol=lf</code>, push lại, và xem <code>od -c</code> trên Windows.</li></ol>
<p><strong>Đạt khi:</strong> bạn điền được một bảng 3 cột × 5 hàng (shell mặc định, <code>outcome</code> của bước 1, phiên bản bash, dạng đường dẫn, có <code>\\r</code> hay không) từ log thật; nhánh Windows có <code>outcome=success</code> ở bước 1; macOS in bash 3.2; và sau khi thêm <code>.gitattributes</code> thì <code>od -c</code> trên Windows không còn <code>\\r</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Default shell (shell mặc định)</span><span class="v">Shell chạy <code>run:</code> khi không ghi <code>shell:</code>: <code>bash -e</code> trên Linux/macOS, <code>pwsh</code> trên Windows.</span></div>
  <div class="kv"><span class="k"><code>defaults.run.shell</code></span><span class="v">Đặt shell cho mọi bước của workflow hoặc job; <code>bash</code> ở đây có kèm <code>pipefail</code>.</span></div>
  <div class="kv"><span class="k"><code>$LASTEXITCODE</code></span><span class="v">Mã thoát của chương trình ngoài chạy gần nhất trong PowerShell; bước pwsh lấy giá trị của lệnh CUỐI.</span></div>
  <div class="kv"><span class="k">CRLF / LF (xuống dòng)</span><span class="v">Windows dùng <code>\\r\\n</code>, Linux/macOS dùng <code>\\n</code>. Script bash mang <code>\\r</code> hỏng trên Linux.</span></div>
  <div class="kv"><span class="k"><code>core.autocrlf</code></span><span class="v">Cấu hình Git đổi LF↔CRLF khi checkout/commit; runner Windows để <code>true</code>.</span></div>
  <div class="kv"><span class="k"><code>.gitattributes</code></span><span class="v">Tệp trong kho ép kiểu xuống dòng theo đuôi tệp — thắng <code>core.autocrlf</code> của máy.</span></div>
  <div class="kv"><span class="k">Case-sensitive (phân biệt hoa thường)</span><span class="v">Linux coi <code>Utils</code> và <code>utils</code> là hai tệp; macOS/Windows mặc định thì không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nền tảng không có một "tốc độ" mà có một HỒ SƠ: Windows thua ở số lượng tệp (<code>npm ci</code> 3,2×), macOS thua ở CPU chạy dài và tải lên; đo trên cùng commit.</li>
<li>Giá mỗi phút (kho riêng tư, 09/2026): Linux $0,006 · Windows $0,010 · macOS $0,062 — macOS 44% thời gian nhưng 85% hoá đơn. Kho công khai: miễn phí.</li>
<li>Shell mặc định: <code>bash -e</code> (Linux, macOS) và <code>pwsh</code> (Windows). Trên pwsh, lệnh ngoài hỏng ở GIỮA script không làm bước đỏ — đo được.</li>
<li><code>shell: bash</code> trên macOS là bash 3.2: không <code>&#36;{x,,}</code>, không <code>declare -A</code>. Script phức tạp viết bằng Node/Python.</li>
<li>Windows checkout ra CRLF và có hai dạng đường dẫn; Linux là nơi duy nhất phân biệt hoa thường — nhánh Linux đỏ thường là nhánh đúng.</li>
<li>Khung an toàn: <code>defaults.run.shell: bash</code>, việc không phụ thuộc nền tảng chạy một lần trên Linux, <code>.gitattributes</code> ép LF, <code>fail-fast: false</code>, <code>timeout-minutes</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About billing for GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions — hệ số nhân theo nền tảng, luật làm tròn theo từng job, và phát biểu rằng kho công khai dùng runner tiêu chuẩn miễn phí.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — cấu hình phần cứng theo nền tảng</span><span class="lc-sub">github.com/actions/runner-images#available-images — số vCPU, RAM và đĩa thật sự được cấp cho từng nhãn, đây là chỗ nhìn đầu tiên khi một nhánh ma trận cạn thứ gì đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.defaults.run.shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#defaultsrun — các shell dùng được theo từng nền tảng và cách ép một cái, thứ gỡ bỏ phần lớn cú vỡ bước đa nền tảng chỉ bằng một dòng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — một ảnh, hai bản libc, và một bản dựng xanh nhưng chết</span><span class="lc-sub">/courses/docker/learn${REF} — cùng bài học ở một môi trường khác: một bản dựng thành công không nói được gì về việc sản phẩm có chạy được trên máy đích hay không, và phép kiểm bắt được nó phải xảy ra TRƯỚC lúc tráo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — trần heap của V8 và --max-old-space-size làm gì</span><span class="lc-sub">/courses/nodejs/learn${REF} — vì sao mã thoát 134 mang nghĩa như thế, và vì sao trần heap mặc định là một hàm của CỖ MÁY chứ không phải của mã bạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Steps, exit codes, and the flag that hides a failure|||2.4 — Bước, mã thoát, và cái cờ giấu mất cú hỏng',
      slug: 'ga-2-4-buoc-ma-thoat',
      type: 'VIDEO',
      description: 'GitHub mặc định `bash -e`; ghi `shell: bash` thì thành `bash -eo pipefail`. Đo thật: cùng một script, mặc định trả 0 (XANH, cú hỏng vô hình), có pipefail trả 127. Cộng năm chỗ `set -e` KHÔNG kích hoạt — và cái bẫy đã cắn chính phép đo của bài này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Steps, exit codes, and the flag that hides a failure</h2>
<p class="lead">A step fails if its process exits non-zero. That rule is simple, complete, and hides an enormous amount, because "its process" means a shell, and which shell you get depends on a line you probably did not write.</p>

<h3>The default shell is not the shell you asked for</h3>
${slide('ga-02', 21, 'No pipefail by default: the step stays GREEN')}

<p>Write <code>run:</code> with no <code>shell:</code> and GitHub runs your script with:</p>

<pre><code><span class="tok-comment"># mac dinh tren Linux va macOS</span>
bash -e {0}

<span class="tok-comment"># khi ban ghi ro shell: bash</span>
bash --noprofile --norc -eo pipefail {0}</code></pre>

<p>The difference is <code>pipefail</code>. Here is what that one flag is worth, measured on a script whose first command in a pipeline fails:</p>

<div class="out">$ cat pipe.sh
lenh-khong-ton-tai | tail -1
echo "ma thoat cua ca ong: $?"

########  bash -e  (MAC DINH)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
ma thoat cua ca ong: 0
&gt;&gt;&gt; exit=0

########  bash -eo pipefail  (shell: bash)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
&gt;&gt;&gt; exit=127</div>

<div class="callout warn">
<p><strong>Same script. Under the default, the step is green.</strong> The command not found message is right there in the log, and the step reports success, because the exit code of a pipeline is the exit code of its <em>last</em> command and <code>tail</code> succeeded at reading nothing. Adding the single line <code>shell: bash</code> turns the same run into exit 127. This is the highest-value one-line change in most workflow files.</p>
</div>

<h3>Measured again on a real runner: one pipeline, two shells</h3>
<p>The measurement above ran on the author&#39;s machine. The sandbox workflow <code>ch02-buoc.yml</code> runs exactly that pipeline on a real <code>ubuntu-24.04</code> runner, twice in a row within one job (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">35989945632</a>):</p>
<div class="out">##[group]Run lenh-khong-ton-tai | tail -1
lenh-khong-ton-tai | tail -1
echo "ma thoat cua ca ong: $?"
shell: /usr/bin/bash -e {0}
##[endgroup]
/home/runner/work/_temp/725fe18e-01ae-496d-b290-caa425eed49a.sh: line 1: lenh-khong-ton-tai: command not found
ma thoat cua ca ong: 0                                   &lt;- buoc 1: XANH

##[group]Run lenh-khong-ton-tai | tail -1
lenh-khong-ton-tai | tail -1
echo "dong nay khong bao gio in"
shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
##[endgroup]
/home/runner/work/_temp/bd30ae82-f0c1-4353-8fe5-e4e77a41483d.sh: line 1: lenh-khong-ton-tai: command not found
##[error]Process completed with exit code 127.            &lt;- buoc 2: DO</div>
<p>Three things you can read from the log without any documentation. One: the <code>shell:</code> line under each step&#39;s title is the evidence — step 1 has no <code>pipefail</code>, step 2 does. Two: <code>{0}</code> is where the runner puts the path to a temporary script file (<code>/home/runner/work/_temp/&lt;uuid&gt;.sh</code>) holding your whole <code>run:</code> block — which is why the error says "line 1" of a file you have never seen. Three: the "command not found" line is present in BOTH steps; only the step&#39;s colour differs. Reading a log by looking only at the ✓ misses it.</p>
<table>
<tr><th><code>shell:</code></th><th>The command the runner actually runs</th><th>Notes</th></tr>
<tr><td>(none, Linux/macOS)</td><td><code>bash -e {0}</code></td><td>NO pipefail</td></tr>
<tr><td><code>bash</code></td><td><code>bash --noprofile --norc -eo pipefail {0}</code></td><td>the one to use</td></tr>
<tr><td><code>sh</code></td><td><code>sh -e {0}</code></td><td>on Ubuntu this is dash — no <code>pipefail</code>, no <code>[[ ]]</code></td></tr>
<tr><td><code>pwsh</code> (Windows default)</td><td><code>pwsh -command ". '{0}'"</code></td><td>an external command failing mid-script does not stop the step (Lesson 2.3)</td></tr>
<tr><td><code>python</code></td><td><code>python {0}</code></td><td>the <code>run:</code> block is Python code</td></tr>
<tr><td>custom: <code>command [options] {0}</code></td><td>exactly what you write</td><td>e.g. adding <code>-u</code>: <code>bash --noprofile --norc -euo pipefail {0}</code></td></tr>
</table>
<pre><code class="language-yaml">defaults:
  run:
    shell: bash                            # ca workflow: bash --noprofile --norc -eo pipefail {0}
jobs:
  vi-du:
    runs-on: ubuntu-24.04
    steps:
      - run: echo "bash, co pipefail"
      - shell: bash --noprofile --norc -euo pipefail {0}   # them -u: bien chua dat = loi
        run: echo "$CHUA_DAT"                               # -&gt; "CHUA_DAT: unbound variable", thoat 1
      - shell: python                                       # python {0}
        run: |
          import os
          print("chay bang python:", os.environ["RUNNER_OS"])
      - working-directory: frontend                          # thay cho cd o moi buoc
        run: npm ci</code></pre>

<h3><code>set -e</code> is weaker than it reads</h3>
<p>Even with <code>-e</code> on, there are contexts where a failing command does not stop the script. Measured, all five in one run:</p>

<div class="out">1. trong if           -> chay tiep
2. ben trai &amp;&amp;        -> chay tiep
3. co ! dang truoc    -> chay tiep
4. trong HAM duoc goi trong if -> CA HAM duoc mien, chay tiep
5. goi TRAN           -> day moi chet (exit 127)</div>

<p>The first three are the documented and reasonable ones: a command being <em>tested</em> is allowed to fail, that is the point of testing it. The fourth is the one that surprises people, and it is worth stating precisely: if a shell function is called from inside an <code>if</code>, then every command inside that function is exempt too — the exemption is inherited, not confined to the call itself. A carefully written function full of error checks can run to completion with all of them ignored, because of where it was called from.</p>

<div class="pitfall">
<p><strong>Trap — the measurement command that hid the answer.</strong> While measuring the list above, the first command written for it was <code>bash -e mien.sh | grep -v "command not found"; echo \$?</code> — and it printed <strong>0</strong>. Read straight, that says <code>set -e</code> never fired at all. It is wrong: <code>\$?</code> there is the exit code of <code>grep</code>, not of the script. Re-run without the pipe:</p>
<p><code>bash -e mien.sh</code> → <strong>127</strong> · <code>bash -e mien.sh | cat</code> → <strong>0</strong> · <code>pipefail</code> + pipe → <strong>127</strong></p>
<p>The trap this lesson is about bit the lesson&#39;s own measurement, which is the most useful demonstration available: it is not an exotic failure mode, it is what happens by default to anyone who pipes a command into anything.</p>
</div>

<h3>Steps, and what carries between them</h3>
${slide('ga-02', 23, 'Each step is a new shell: export, cd, GITHUB_ENV')}

<div class="kv-grid">
<div class="kv"><span class="k">each step is a new process</span><span class="v">variables, shell functions, <code>cd</code>, <code>set -x</code> — none of it reaches the next step. The working directory resets to the job&#39;s <code>working-directory</code> each time</span></div>
<div class="kv"><span class="k">to pass a value forward</span><span class="v"><code>echo "K=V" &gt;&gt; \$GITHUB_ENV</code> for an environment variable, or <code>echo "k=v" &gt;&gt; \$GITHUB_OUTPUT</code> with an <code>id:</code> on the step, read as <code>&#36;{{ steps.&lt;id&gt;.outputs.k }}</code></span></div>
<div class="kv"><span class="k">to pass a multi-line value</span><span class="v">the heredoc form with a random delimiter — a value containing a newline written naively lets anyone who controls it inject arbitrary variables. Chapter 6 measures that</span></div>
<div class="kv"><span class="k">to write to the run summary</span><span class="v"><code>\$GITHUB_STEP_SUMMARY</code> takes Markdown and renders it on the run page. This is the cheapest good thing you can add to a workflow — a table of what actually happened, visible without opening logs</span></div>
</div>

<h3>Measured: export, cd and <code>$GITHUB_ENV</code> between two steps</h3>
<p>The list above says "none of these reach the next step". Here it is, measured in the same job (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990300886" target="_blank" rel="noopener">35990300886</a>):</p>
<div class="out"># buoc 4
export XUAT=co
echo "GHI=co" &gt;&gt; "$GITHUB_ENV"
cd /tmp
echo "trong buoc 4: XUAT=[$XUAT] GHI=[$GHI] thu muc: $PWD"
  -&gt; trong buoc 4: XUAT=[co] GHI=[] thu muc: /tmp

# buoc 5 — tieu de buoc trong log tu in them:
env:
  GHI: co
  -&gt; buoc 5: XUAT=[] GHI=[co] thu muc: /home/runner/work/ga-san-tap/ga-san-tap</div>
<ul>
<li><code>export XUAT=co</code> exists INSIDE step 4 and is gone in step 5 — each step is a new <code>bash</code> process that dies when the step ends.</li>
<li><code>GHI</code> written to <code>$GITHUB_ENV</code> is EMPTY within step 4 itself (the runner only reads that file when the step ends) and present from step 5 on. The log of every later step prints an extra <code>env: GHI: co</code> block under its title — the fastest way to find out where a variable came from.</li>
<li><code>cd /tmp</code> does not carry over: step 5 starts again in the job&#39;s working directory. To run in a subfolder use <code>working-directory:</code> on the step or <code>defaults.run.working-directory</code>, rather than scattering <code>cd</code> across every step.</li>
<li>To make a freshly installed tool available on the <code>PATH</code> of later steps: <code>echo "$HOME/.local/bin" &gt;&gt; "$GITHUB_PATH"</code> — the same file mechanism, the same "from the NEXT step" rule.</li>
</ul>

<h3>Steps that are allowed to fail</h3>
${slide('ga-02', 22, 'continue-on-error: outcome ≠ conclusion')}

<p><code>continue-on-error: true</code> lets a step fail without failing the job. This repository uses it exactly twice, and how it uses it is the point:</p>

<div class="out">"ESLint (informational)"                                  continue-on-error: true
"Next.js ESLint (informational)"                          continue-on-error: true
"Unit tests — money math + payment signature (required)"  KHONG co
"TypeScript type-check (required)"                        KHONG co</div>

<div class="callout ok">
<p><strong>The step names carry the classification.</strong> Anyone reading the log — or the workflow file, or a failing run six months from now — can see at a glance which steps are allowed to be red and which are not, without cross-referencing the YAML. That is what makes this a legitimate use rather than a way of hiding failures: the tolerance is <em>declared in the name</em>, so a green run with a red informational step is honest rather than misleading.</p>
</div>

<div class="pitfall">
<p><strong>Trap — <code>continue-on-error</code> as a way to make CI quiet.</strong> The moment it appears on a step that checks correctness — a test, a typecheck, a security scan — the job&#39;s green tick stops meaning anything, and it stops meaning anything <em>silently</em>, since a passing job is not something anybody opens. If a check is too noisy to block on, the honest options are to fix it, to delete it, or to mark it informational in its own name. Leaving a correctness check nominally present but unable to fail is the worst of the three, because it also removes the pressure to do one of the other two.</p>
</div>

<h3>outcome and conclusion: a step has TWO results</h3>
<p>When a step is allowed to fail, "did it fail" has two answers, and GitHub keeps both. Step 2 of <code>ch02-buoc.yml</code> has <code>id: ong</code>, <code>continue-on-error: true</code>, and exits 127:</p>
<div class="out"># buoc 2 co: id: ong, continue-on-error: true, va hong voi 127
# buoc 3:
echo "outcome    = failure"          &lt;- log in san gia tri da thay
echo "conclusion = success"
outcome    = failure
conclusion = success

$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35989945632/jobs \\
    --jq '.jobs[0].steps[4] | "\\(.number) \\(.name) \\(.conclusion)"'
5 2. Ong, shell bash (co pipefail) success          &lt;- API chi biet conclusion</div>
<div class="kv-grid">
<div class="kv"><span class="k"><code>steps.&lt;id&gt;.outcome</code></span><span class="v">the REAL result, before <code>continue-on-error</code> is applied: <code>success</code>, <code>failure</code>, <code>cancelled</code> or <code>skipped</code></span></div>
<div class="kv"><span class="k"><code>steps.&lt;id&gt;.conclusion</code></span><span class="v">the result AFTER forgiveness: a failed step that is allowed to fail is <code>success</code>. The ✓ in the UI and the API&#39;s <code>conclusion</code> field are both this one</span></div>
<div class="kv"><span class="k">when you need <code>outcome</code></span><span class="v">when a later step must know whether the forgiven step really failed: send a warning, write it into the summary, or decide to run a fallback — <code>if: steps.ong.outcome == 'failure'</code></span></div>
<div class="kv"><span class="k"><code>continue-on-error</code> at JOB level</span><span class="v">forgives the whole job: the job fails but the run is not red because of it, and in a matrix it does not trigger <code>fail-fast</code> (measured in Lesson 2.5)</span></div>
<div class="kv"><span class="k"><code>timeout-minutes</code> at STEP level</span><span class="v">kills just the hung step (at most 360, an integer). Combine with <code>continue-on-error</code> for a "try it, but do not wait more than 2 minutes" step</span></div>
</div>

<h3>Conditions, and the two that get confused</h3>
${slide('ga-02', 24, 'After a failed step, only steps with if: still run')}

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if:</code> on a step</span><span class="lz-lnote">a false condition <strong>skips</strong> the step, which is not a failure. A skipped step costs nothing: measured on this run, the Linux-only system-libraries step took 24s on Linux and 0s on macOS and Windows where it was skipped</span></div>
<div class="lz-layer"><span class="lz-lname">the implicit <code>success()</code></span><span class="lz-lnote">every step has <code>if: success()</code> unless you say otherwise. Once a step fails, later steps skip — which is why cleanup and reporting steps need something explicit</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code></span><span class="lz-lnote">runs even after a failure <em>and</em> after a cancel. Correct for uploading logs and test reports; wrong for anything that acts on the world, because a cancelled run should not deploy</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: &#36;{{ !cancelled() }}</code></span><span class="lz-lnote">runs after a failure but not after a cancel. This is what most people mean when they reach for <code>always()</code>, and it is the safer default of the two</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: failure()</code></span><span class="lz-lnote">runs only when something earlier failed. The right condition for a notification step, and the wrong one for log collection — you want the logs either way</span></div>
</div>

<h3>Measured: after a failed step, which steps still run</h3>
<p>Steps 7–11 of <code>ch02-buoc.yml</code> are the condition table above, run for real (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">35989945632</a>):</p>
<div class="out">buoc                                  dieu kien        ket qua
2.  Ong, shell bash                   (coe: true)      hong 127, duoc THA
7.  Chi khi co buoc hong              failure()        skipped   &lt;- buoc 2 duoc tha KHONG tinh la hong
8.  Hong that                         -                failure   exit 7
9.  Bi bo qua                         (success())      skipped
10. failure()                         failure()        CHAY  "chay vi buoc 8 hong"
11. always()                          always()         CHAY  "luon chay - tai log, bao cao"
Post Run actions/setup-node@v7                         skipped
Post Run actions/checkout@v7                           success</div>
<p>The most notable line is step 7: an <code>if: failure()</code> step placed AFTER step 2 (which failed with 127) is still skipped. The reason: step 2 was forgiven with <code>continue-on-error</code>, so for the status functions it counts as a success (exactly the <code>conclusion</code> above). <code>failure()</code> only fires after step 8, the failure that was not forgiven. And the Post step of <code>setup-node</code> is skipped — that action only cleans up when the job succeeds — while <code>checkout</code>&#39;s Post still runs.</p>
<p>And when a user presses cancel? Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990301016" target="_blank" rel="noopener">35990301016</a> was cancelled in the middle of a <code>sleep 120</code> step: the running step got "The operation was canceled.", the <code>always()</code> step and the <code>cancelled()</code> step ran, the <code>!cancelled()</code> and <code>failure()</code> steps were skipped — and the job took 16 seconds after the click to stop completely. That is the place for tearing down temporary infrastructure (shutting a test machine, deleting a preview environment): <code>if: always()</code> or <code>if: cancelled()</code>.</p>

<h3>The steps you did not write</h3>
<p>Every action with a cleanup phase contributes a post-step, and the API shows both their order and something odder:</p>

<div class="out">thu tu dung:  checkout (buoc 2) -> setup-node (buoc 4)
thu tu don:   Post setup-node (15) -> Post checkout (16)

so hieu buoc KHONG lien tuc:
  job "Kiem tra ma"  di 1..8 roi nhay toi 15
  job "Dung Linux"   di 1..9 roi nhay toi 17</div>

<p>Cleanup runs in reverse order of setup — last set up, first torn down — which is the same discipline as a stack of resources anywhere else, and it matters when one action&#39;s cleanup depends on another action&#39;s still being present. The numbering gap is the runner reserving slots for post-steps it might need; it is observable and harmless, but worth recognising so a jump from step 8 to step 15 in a log does not read as missing output.</p>

<div class="callout">
<p><strong>The one sentence.</strong> A step passes when its shell exits zero, so everything about step reliability reduces to knowing which shell ran and what it did with the exit codes — and the default, without <code>pipefail</code>, will let a failed command inside a pipeline report success.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: The log shows "command not found" but the step is green. What happened?</strong><br>A: Almost certainly the failing command sits BEFORE a <code>|</code>, and the step ran with the default shell <code>bash -e</code> — no <code>pipefail</code>, so the pipeline&#39;s exit code is the last command&#39;s. Fix: <code>shell: bash</code> (or <code>defaults.run.shell: bash</code>), which adds <code>-o pipefail</code>. On Windows with the default pwsh it is worse: an external command failing on any line before the last is swallowed.</p>
<p><strong>Q: How does a later step learn a value an earlier step computed?</strong><br>A: <code>echo "K=V" &gt;&gt; "$GITHUB_ENV"</code> to make it an environment variable for every LATER step; or <code>echo "k=v" &gt;&gt; "$GITHUB_OUTPUT"</code> in a step with an <code>id</code>, then read <code>steps.&lt;id&gt;.outputs.k</code>. <code>export</code> does not cross steps. Multi-line values use the heredoc form with a delimiter.</p>
<p><strong>Q: How is <code>continue-on-error</code> different from <code>if: always()</code> on a later step?</strong><br>A: <code>continue-on-error</code> goes on the FAILING step: it forgives it, the job stays green, <code>outcome=failure</code> but <code>conclusion=success</code>. <code>always()</code> goes on a LATER step: it lets that step run despite an earlier failure, but the job stays red. For "run the report but keep CI red", use the second.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team&#39;s CI has a step <code>npm test | tee test.log</code>, and last week the tests failed while CI stayed green. You want to reproduce it, fix it, and prove it.</p><ol>
<li>Create a one-job workflow with step A (no <code>shell:</code>): <code>node -e "process.exit(1)" | tee out.log</code>. Push and confirm the step is green.</li>
<li>Add <code>defaults: run: shell: bash</code> at the top of the workflow, push, confirm step A is red and the <code>shell:</code> line in the log has <code>pipefail</code>.</li>
<li>Give step A <code>id: a</code> and <code>continue-on-error: true</code>; add step B printing <code>&#36;{{ steps.a.outcome }}</code> and <code>&#36;{{ steps.a.conclusion }}</code>.</li>
<li>Add step C that writes <code>echo "VERSION=1.2.3" &gt;&gt; "$GITHUB_ENV"</code> and then prints <code>$VERSION</code>; step D prints <code>$VERSION</code> again.</li>
<li>Add step E <code>exit 2</code>, step F <code>if: failure()</code>, step G with no condition, step H <code>if: always()</code>.</li></ol>
<p><strong>Done when:</strong> you have two runs proving the same command line went green then red only because of <code>pipefail</code>; step B prints <code>failure</code>/<code>success</code>; step C prints empty and D prints <code>1.2.3</code>; and the E–H results match the measured table in this lesson (F and H run; G is skipped).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit code</span><span class="v">The number a process returns when it ends; 0 = success. A step is red when its shell exits non-zero.</span></div>
  <div class="kv"><span class="k"><code>pipefail</code></span><span class="v">A bash flag: a pipeline fails if ANY command in it fails, not just the last one.</span></div>
  <div class="kv"><span class="k"><code>{0}</code></span><span class="v">Where the runner inserts the path of the temporary script file holding your <code>run:</code> block.</span></div>
  <div class="kv"><span class="k"><code>$GITHUB_ENV</code> / <code>$GITHUB_PATH</code></span><span class="v">Files for setting environment variables / adding to PATH for LATER steps in the same job.</span></div>
  <div class="kv"><span class="k"><code>continue-on-error</code></span><span class="v">A failing step (or job) does not turn the job (or run) red; <code>outcome</code> still records <code>failure</code>.</span></div>
  <div class="kv"><span class="k"><code>outcome</code> / <code>conclusion</code></span><span class="v">A step&#39;s real result / its result after forgiveness.</span></div>
  <div class="kv"><span class="k">Post step</span><span class="v">An action&#39;s cleanup part, added by the runner, run in reverse order of setup.</span></div>
  <div class="kv"><span class="k"><code>$GITHUB_STEP_SUMMARY</code></span><span class="v">A file that takes Markdown and shows it as a summary on the run page.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A step passes when its shell exits 0. The Linux/macOS default is <code>bash -e {0}</code> — no <code>pipefail</code>: measured on a real runner, one pipeline went green then red (127) only because of <code>shell: bash</code>.</li>
<li><code>set -e</code> is exempt inside <code>if</code>, left of <code>&amp;&amp;</code>, after <code>!</code> and inside functions called from a condition; piping a command also hides its exit code.</li>
<li>Each step is a new process: <code>export</code> and <code>cd</code> do not carry over; <code>$GITHUB_ENV</code>/<code>$GITHUB_PATH</code> take effect from the NEXT step; <code>$GITHUB_OUTPUT</code> + <code>id</code> for outputs.</li>
<li><code>continue-on-error</code> gives <code>outcome=failure</code>, <code>conclusion=success</code>; a forgiven step does not trigger <code>failure()</code>. Use it only on steps labelled "(informational)".</li>
<li>After a failed step: ordinary steps skip, <code>failure()</code>/<code>always()</code> run; on cancel: <code>always()</code>/<code>cancelled()</code> run, <code>!cancelled()</code> does not — and a cancel takes several seconds to finish.</li>
<li>Post steps clean up in REVERSE order, and step numbering has gaps — not missing logs.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.steps[*].shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#custom-shell — the exact command line for every shell option on every platform, including the two bash forms measured above. Worth reading once in full; the defaults are not guessable.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — the set builtin, and the exemptions for -e</span><span class="lc-sub">man bash, section on <code>set -e</code> — the authoritative list of contexts where a non-zero status does not cause an exit, including the inherited exemption inside a function called from a condition.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_OUTPUT, GITHUB_ENV, GITHUB_STEP_SUMMARY</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the supported step-to-step channels, the heredoc form for multi-line values, and the Markdown summary that renders on the run page.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — exit codes, pipelines, and why set -e is not enough</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the full treatment of <code>set -euo pipefail</code>, what each flag actually buys, and the cases where the trio still lets a failure through.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — a deploy script that reported success while doing nothing</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same class of bug outside CI, where a missing <code>pipefail</code> let a broken step pass and the deploy carried on to the swap.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Bước, mã thoát, và cái cờ giấu mất cú hỏng</h2>
<p class="lead">Một bước hỏng nếu tiến trình của nó thoát khác không. Quy tắc ấy đơn giản, đầy đủ, và giấu đi một lượng khổng lồ, bởi "tiến trình của nó" nghĩa là MỘT SHELL, và bạn nhận được shell nào thì phụ thuộc vào một dòng mà nhiều phần là bạn không viết.</p>

<h3>Shell mặc định không phải shell bạn tưởng mình xin</h3>
${slide('ga-02', 21, 'Mặc định thiếu pipefail: bước vẫn XANH')}

<p>Viết <code>run:</code> mà không có <code>shell:</code> thì GitHub chạy script của bạn bằng:</p>

<pre><code><span class="tok-comment"># mac dinh tren Linux va macOS</span>
bash -e {0}

<span class="tok-comment"># khi ban ghi ro shell: bash</span>
bash --noprofile --norc -eo pipefail {0}</code></pre>

<p>Khác biệt là <code>pipefail</code>. Đây là giá trị của đúng một cái cờ ấy, đo trên một script mà lệnh đầu tiên trong một đường ống bị hỏng:</p>

<div class="out">$ cat pipe.sh
lenh-khong-ton-tai | tail -1
echo "ma thoat cua ca ong: $?"

########  bash -e  (MAC DINH)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
ma thoat cua ca ong: 0
&gt;&gt;&gt; exit=0

########  bash -eo pipefail  (shell: bash)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
&gt;&gt;&gt; exit=127</div>

<div class="callout warn">
<p><strong>Cùng một script. Dưới mặc định, bước ấy XANH.</strong> Dòng "command not found" nằm sờ sờ trong log, mà bước vẫn báo thành công, vì mã thoát của một đường ống là mã thoát của lệnh <em>CUỐI</em> và <code>tail</code> đã đọc-không-gì-cả một cách thành công. Thêm đúng một dòng <code>shell: bash</code> là biến chính lần chạy ấy thành thoát 127. Đây là thay đổi một dòng đáng giá nhất trong hầu hết các tệp workflow.</p>
</div>

<h3>Đo lại trên runner thật: cùng một đường ống, hai shell</h3>
<p>Phép đo ở trên chạy trên máy của người viết. Workflow <code>ch02-buoc.yml</code> trên sân tập chạy đúng đường ống ấy trên một runner <code>ubuntu-24.04</code> thật, hai lần liền trong một job (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">35989945632</a>):</p>
<div class="out">##[group]Run lenh-khong-ton-tai | tail -1
lenh-khong-ton-tai | tail -1
echo "ma thoat cua ca ong: $?"
shell: /usr/bin/bash -e {0}
##[endgroup]
/home/runner/work/_temp/725fe18e-01ae-496d-b290-caa425eed49a.sh: line 1: lenh-khong-ton-tai: command not found
ma thoat cua ca ong: 0                                   &lt;- buoc 1: XANH

##[group]Run lenh-khong-ton-tai | tail -1
lenh-khong-ton-tai | tail -1
echo "dong nay khong bao gio in"
shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
##[endgroup]
/home/runner/work/_temp/bd30ae82-f0c1-4353-8fe5-e4e77a41483d.sh: line 1: lenh-khong-ton-tai: command not found
##[error]Process completed with exit code 127.            &lt;- buoc 2: DO</div>
<p>Ba điều đọc được từ log mà không cần tài liệu. Một: dòng <code>shell:</code> dưới tiêu đề mỗi bước là bằng chứng — bước 1 không có <code>pipefail</code>, bước 2 có. Hai: <code>{0}</code> là chỗ runner đặt đường dẫn tới một tệp script tạm (<code>/home/runner/work/_temp/&lt;uuid&gt;.sh</code>) chứa nguyên khối <code>run:</code> của bạn — vì thế thông báo lỗi nói "line 1" của một tệp bạn chưa từng thấy. Ba: dòng "command not found" có mặt trong CẢ HAI bước; chỉ màu của bước là khác. Đọc log mà chỉ nhìn dấu ✓ thì bỏ lỡ nó.</p>
<table>
<tr><th><code>shell:</code></th><th>Lệnh thật runner chạy</th><th>Ghi chú</th></tr>
<tr><td>(không ghi, Linux/macOS)</td><td><code>bash -e {0}</code></td><td>KHÔNG có pipefail</td></tr>
<tr><td><code>bash</code></td><td><code>bash --noprofile --norc -eo pipefail {0}</code></td><td>cách nên dùng</td></tr>
<tr><td><code>sh</code></td><td><code>sh -e {0}</code></td><td>trên Ubuntu là dash — không có <code>pipefail</code>, không có <code>[[ ]]</code></td></tr>
<tr><td><code>pwsh</code> (mặc định Windows)</td><td><code>pwsh -command ". '{0}'"</code></td><td>lệnh ngoài hỏng ở giữa không dừng bước (bài 2.3)</td></tr>
<tr><td><code>python</code></td><td><code>python {0}</code></td><td>khối <code>run:</code> là mã Python</td></tr>
<tr><td>tuỳ ý: <code>lenh [tham so] {0}</code></td><td>đúng như bạn viết</td><td>vd thêm <code>-u</code>: <code>bash --noprofile --norc -euo pipefail {0}</code></td></tr>
</table>
<pre><code class="language-yaml">defaults:
  run:
    shell: bash                            # ca workflow: bash --noprofile --norc -eo pipefail {0}
jobs:
  vi-du:
    runs-on: ubuntu-24.04
    steps:
      - run: echo "bash, co pipefail"
      - shell: bash --noprofile --norc -euo pipefail {0}   # them -u: bien chua dat = loi
        run: echo "$CHUA_DAT"                               # -&gt; "CHUA_DAT: unbound variable", thoat 1
      - shell: python                                       # python {0}
        run: |
          import os
          print("chay bang python:", os.environ["RUNNER_OS"])
      - working-directory: frontend                          # thay cho cd o moi buoc
        run: npm ci</code></pre>

<h3><code>set -e</code> yếu hơn vẻ ngoài của nó</h3>
<p>Ngay cả khi đã bật <code>-e</code>, vẫn có những ngữ cảnh mà một lệnh hỏng KHÔNG dừng script. Đo thật, cả năm chỗ trong một lần chạy:</p>

<div class="out">1. trong if           -> chay tiep
2. ben trai &amp;&amp;        -> chay tiep
3. co ! dang truoc    -> chay tiep
4. trong HAM duoc goi trong if -> CA HAM duoc mien, chay tiep
5. goi TRAN           -> day moi chet (exit 127)</div>

<p>Ba chỗ đầu là những chỗ có ghi trong tài liệu và hợp lý: một lệnh đang được <em>KIỂM</em> thì được phép hỏng, đó chính là mục đích của việc kiểm nó. Chỗ thứ tư mới làm người ta bất ngờ, và đáng phát biểu cho chính xác: nếu một hàm shell được gọi từ bên trong một <code>if</code>, thì MỌI lệnh bên trong hàm ấy cũng được miễn — sự miễn trừ được THỪA KẾ, không bị giới hạn ở chính lời gọi. Một hàm viết cẩn thận đầy các phép kiểm lỗi có thể chạy tới hết với mọi phép kiểm bị bỏ qua, chỉ vì chỗ nó được gọi.</p>

<div class="pitfall">
<p><strong>Bẫy — cái lệnh đo đã giấu mất đáp án.</strong> Trong lúc đo cái danh sách trên, lệnh đầu tiên viết ra cho nó là <code>bash -e mien.sh | grep -v "command not found"; echo \$?</code> — và nó in ra <strong>0</strong>. Đọc thẳng thì câu đó bảo <code>set -e</code> chẳng hề kích hoạt lần nào. Sai: <code>\$?</code> ở đó là mã thoát của <code>grep</code>, không phải của script. Chạy lại mà bỏ cái ống đi:</p>
<p><code>bash -e mien.sh</code> → <strong>127</strong> · <code>bash -e mien.sh | cat</code> → <strong>0</strong> · <code>pipefail</code> + ống → <strong>127</strong></p>
<p>Cái bẫy mà bài này đang nói tới đã cắn chính phép đo của bài, và đó là minh hoạ hữu ích nhất có thể có: nó không phải một kiểu hỏng kỳ dị, nó là thứ xảy ra MẶC ĐỊNH với bất kỳ ai đổ một lệnh qua một cái ống.</p>
</div>

<h3>Bước, và cái gì đi được sang bước kế</h3>
${slide('ga-02', 23, 'Mỗi bước là một shell mới: export, cd, GITHUB_ENV')}

<div class="kv-grid">
<div class="kv"><span class="k">mỗi bước là một tiến trình mới</span><span class="v">biến, hàm shell, <code>cd</code>, <code>set -x</code> — không cái nào tới được bước kế. Thư mục làm việc đặt lại về <code>working-directory</code> của job mỗi lần</span></div>
<div class="kv"><span class="k">để chuyển một giá trị đi tiếp</span><span class="v"><code>echo "K=V" &gt;&gt; \$GITHUB_ENV</code> cho một biến môi trường, hoặc <code>echo "k=v" &gt;&gt; \$GITHUB_OUTPUT</code> kèm <code>id:</code> trên bước, đọc bằng <code>&#36;{{ steps.&lt;id&gt;.outputs.k }}</code></span></div>
<div class="kv"><span class="k">để chuyển giá trị nhiều dòng</span><span class="v">dạng heredoc với dấu phân cách ngẫu nhiên — một giá trị chứa ký tự xuống dòng mà viết ngây thơ thì cho phép ai kiểm soát được nó chèn vào biến tuỳ ý. Chương 6 đo chuyện đó</span></div>
<div class="kv"><span class="k">để ghi vào bản tóm tắt lần chạy</span><span class="v"><code>\$GITHUB_STEP_SUMMARY</code> nhận Markdown và hiển thị nó trên trang lần chạy. Đây là thứ tốt rẻ nhất bạn thêm được vào một workflow — một bảng kể chuyện gì đã xảy ra, nhìn thấy được mà không phải mở log</span></div>
</div>

<h3>Đo lại: export, cd, và <code>$GITHUB_ENV</code> giữa hai bước</h3>
<p>Danh sách trên nói "không cái nào tới được bước kế". Đây là nó, đo trên cùng job (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990300886" target="_blank" rel="noopener">35990300886</a>):</p>
<div class="out"># buoc 4
export XUAT=co
echo "GHI=co" &gt;&gt; "$GITHUB_ENV"
cd /tmp
echo "trong buoc 4: XUAT=[$XUAT] GHI=[$GHI] thu muc: $PWD"
  -&gt; trong buoc 4: XUAT=[co] GHI=[] thu muc: /tmp

# buoc 5 — tieu de buoc trong log tu in them:
env:
  GHI: co
  -&gt; buoc 5: XUAT=[] GHI=[co] thu muc: /home/runner/work/ga-san-tap/ga-san-tap</div>
<ul>
<li><code>export XUAT=co</code> có mặt TRONG bước 4 và biến mất ở bước 5 — mỗi bước là một tiến trình <code>bash</code> mới, chết khi bước xong.</li>
<li><code>GHI</code> ghi vào <code>$GITHUB_ENV</code> thì RỖNG ngay trong bước 4 (runner chỉ đọc tệp ấy khi bước kết thúc) và có mặt từ bước 5. Log của mọi bước sau tự in thêm khối <code>env: GHI: co</code> dưới tiêu đề — cách nhanh nhất để biết một biến tới từ đâu.</li>
<li><code>cd /tmp</code> không đi tiếp: bước 5 bắt đầu lại ở thư mục làm việc của job. Cần chạy trong thư mục con thì dùng <code>working-directory:</code> trên bước hoặc <code>defaults.run.working-directory</code>, đừng rải <code>cd</code> ở mọi bước.</li>
<li>Muốn một công cụ vừa cài có mặt trong <code>PATH</code> của các bước sau: <code>echo "$HOME/.local/bin" &gt;&gt; "$GITHUB_PATH"</code> — cùng cơ chế tệp, cùng luật "từ bước SAU".</li>
</ul>

<h3>Những bước được phép hỏng</h3>
${slide('ga-02', 22, 'continue-on-error: outcome ≠ conclusion')}

<p><code>continue-on-error: true</code> cho một bước hỏng mà không làm hỏng job. Kho này dùng nó đúng hai lần, và CÁCH nó dùng mới là điểm chính:</p>

<div class="out">"ESLint (informational)"                                  continue-on-error: true
"Next.js ESLint (informational)"                          continue-on-error: true
"Unit tests — money math + payment signature (required)"  KHONG co
"TypeScript type-check (required)"                        KHONG co</div>

<div class="callout ok">
<p><strong>Chính TÊN BƯỚC mang theo sự phân loại.</strong> Bất cứ ai đọc log — hay đọc tệp workflow, hay đọc một lần chạy hỏng sáu tháng sau — đều thấy ngay bước nào được phép đỏ và bước nào không, mà không phải đối chiếu với YAML. Đó là thứ làm cho đây thành một cách dùng chính đáng chứ không phải một cách giấu cú hỏng: sự dung thứ được <em>KHAI BÁO NGAY TRONG TÊN</em>, nên một lần chạy xanh có kèm một bước informational đỏ là trung thực chứ không đánh lừa.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>continue-on-error</code> như một cách làm CI im mồm.</strong> Ngay khoảnh khắc nó xuất hiện trên một bước KIỂM TÍNH ĐÚNG ĐẮN — một bài test, một lượt kiểm kiểu, một lượt quét bảo mật — thì dấu tick xanh của job thôi mang nghĩa gì, và nó thôi mang nghĩa một cách <em>ÂM THẦM</em>, vì một job đang qua thì chẳng ai đi mở ra xem. Nếu một phép kiểm ồn quá để đem ra chặn, thì các lựa chọn trung thực là vá nó, xoá nó, hoặc đánh dấu nó là informational ngay trong tên của nó. Để một phép kiểm đúng-đắn có mặt trên danh nghĩa mà không thể hỏng được là tệ nhất trong ba, vì nó còn gỡ luôn cái áp lực phải làm một trong hai cách kia.</p>
</div>

<h3>outcome và conclusion: một bước có HAI kết quả</h3>
<p>Khi một bước được phép hỏng, "nó hỏng hay không" có hai câu trả lời, và GitHub giữ cả hai. Bước 2 của <code>ch02-buoc.yml</code> có <code>id: ong</code>, <code>continue-on-error: true</code>, và thoát 127:</p>
<div class="out"># buoc 2 co: id: ong, continue-on-error: true, va hong voi 127
# buoc 3:
echo "outcome    = failure"          &lt;- log in san gia tri da thay
echo "conclusion = success"
outcome    = failure
conclusion = success

$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35989945632/jobs \\
    --jq '.jobs[0].steps[4] | "\\(.number) \\(.name) \\(.conclusion)"'
5 2. Ong, shell bash (co pipefail) success          &lt;- API chi biet conclusion</div>
<div class="kv-grid">
<div class="kv"><span class="k"><code>steps.&lt;id&gt;.outcome</code></span><span class="v">kết quả THẬT, trước khi áp <code>continue-on-error</code>: <code>success</code>, <code>failure</code>, <code>cancelled</code> hoặc <code>skipped</code></span></div>
<div class="kv"><span class="k"><code>steps.&lt;id&gt;.conclusion</code></span><span class="v">kết quả SAU khi tha: bước hỏng mà được tha thì là <code>success</code>. Dấu ✓ trên giao diện và trường <code>conclusion</code> của API đều là cái này</span></div>
<div class="kv"><span class="k">khi nào cần <code>outcome</code></span><span class="v">khi bước sau phải biết bước được tha đã hỏng thật hay chưa: gửi cảnh báo, ghi vào bản tóm tắt, hay quyết định có chạy bước dự phòng — <code>if: steps.ong.outcome == 'failure'</code></span></div>
<div class="kv"><span class="k"><code>continue-on-error</code> ở mức JOB</span><span class="v">tha cả job: job hỏng nhưng lần chạy không đỏ vì nó, và trong ma trận thì nó không kích hoạt <code>fail-fast</code> (bài 2.5 đo)</span></div>
<div class="kv"><span class="k"><code>timeout-minutes</code> ở mức BƯỚC</span><span class="v">giết riêng bước treo (tối đa 360, số nguyên). Kết hợp với <code>continue-on-error</code> cho một bước "thử, nhưng đừng đợi quá 2 phút"</span></div>
</div>

<h3>Điều kiện, và hai cái hay bị lẫn</h3>
${slide('ga-02', 24, 'Sau một bước hỏng, chỉ bước có if: còn chạy')}

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if:</code> trên một bước</span><span class="lz-lnote">điều kiện sai thì <strong>BỎ QUA</strong> bước, và bỏ qua không phải hỏng. Một bước bị bỏ qua không tốn gì: đo trên lần chạy này, "Cài thư viện hệ thống (Linux)" tốn 24s trên Linux và 0s trên macOS với Windows nơi nó bị bỏ qua</span></div>
<div class="lz-layer"><span class="lz-lname"><code>success()</code> ngầm định</span><span class="lz-lnote">mọi bước đều có <code>if: success()</code> trừ khi bạn nói khác. Một khi có bước hỏng, các bước sau bị bỏ qua — và đó là lý do bước dọn dẹp với bước báo cáo cần một điều kiện tường minh</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code></span><span class="lz-lnote">chạy cả sau khi hỏng <em>VÀ</em> sau khi bị huỷ. Đúng cho việc tải log và báo cáo test lên; SAI cho bất cứ thứ gì tác động ra thế giới, vì một lần chạy bị huỷ thì không nên deploy</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: &#36;{{ !cancelled() }}</code></span><span class="lz-lnote">chạy sau khi hỏng nhưng không chạy sau khi bị huỷ. Đây là thứ phần lớn người ta THẬT SỰ muốn khi họ với tay tới <code>always()</code>, và nó là mặc định an toàn hơn trong hai cái</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: failure()</code></span><span class="lz-lnote">chỉ chạy khi có thứ gì trước đó hỏng. Đúng cho một bước gửi thông báo, và SAI cho việc thu thập log — bạn muốn có log trong cả hai trường hợp</span></div>
</div>

<h3>Đo lại: sau một bước hỏng, bước nào còn chạy</h3>
<p>Các bước 7–11 của <code>ch02-buoc.yml</code> là bảng điều kiện ở trên, chạy thật (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">35989945632</a>):</p>
<div class="out">buoc                                  dieu kien        ket qua
2.  Ong, shell bash                   (coe: true)      hong 127, duoc THA
7.  Chi khi co buoc hong              failure()        skipped   &lt;- buoc 2 duoc tha KHONG tinh la hong
8.  Hong that                         -                failure   exit 7
9.  Bi bo qua                         (success())      skipped
10. failure()                         failure()        CHAY  "chay vi buoc 8 hong"
11. always()                          always()         CHAY  "luon chay - tai log, bao cao"
Post Run actions/setup-node@v7                         skipped
Post Run actions/checkout@v7                           success</div>
<p>Dòng đáng chú ý nhất là bước 7: một bước <code>if: failure()</code> đặt SAU bước 2 (đã hỏng 127) mà vẫn bị skip. Lý do: bước 2 được tha bằng <code>continue-on-error</code>, nên với các hàm trạng thái nó tính là thành công (đúng <code>conclusion</code> ở trên). <code>failure()</code> chỉ bật sau bước 8, cú hỏng không được tha. Và bước Post của <code>setup-node</code> bị skip — action ấy chỉ dọn khi job thành công — còn Post của <code>checkout</code> vẫn chạy.</p>
<p>Còn khi người dùng bấm huỷ? Lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35990301016" target="_blank" rel="noopener">35990301016</a> bị huỷ giữa một bước <code>sleep 120</code>: bước đang chạy nhận "The operation was canceled.", bước <code>always()</code> và bước <code>cancelled()</code> chạy, bước <code>!cancelled()</code> và <code>failure()</code> bị skip — và job mất 16 giây sau cú bấm mới dừng hẳn. Đó là chỗ để đặt việc dọn hạ tầng tạm (tắt máy thử, xoá môi trường xem trước): <code>if: always()</code> hoặc <code>if: cancelled()</code>.</p>

<h3>Những bước bạn không viết</h3>
<p>Mỗi action có pha dọn dẹp đều góp một post-step, và API cho thấy cả thứ tự của chúng lẫn một điều lạ hơn:</p>

<div class="out">thu tu dung:  checkout (buoc 2) -> setup-node (buoc 4)
thu tu don:   Post setup-node (15) -> Post checkout (16)

so hieu buoc KHONG lien tuc:
  job "Kiem tra ma"  di 1..8 roi nhay toi 15
  job "Dung Linux"   di 1..9 roi nhay toi 17</div>

<p>Việc dọn chạy NGƯỢC thứ tự dựng — dựng sau cùng thì tháo đầu tiên — cùng một kỷ luật với một chồng tài nguyên ở bất cứ đâu khác, và nó có nghĩa khi phần dọn của action này phụ thuộc vào việc action kia vẫn còn đó. Chỗ trống trong đánh số là runner dành sẵn slot cho những post-step nó có thể cần; nó quan sát được và vô hại, nhưng đáng nhận ra để một cú nhảy từ bước 8 sang bước 15 trong log không bị đọc thành thiếu mất phần đầu ra.</p>

<div class="callout">
<p><strong>Một câu.</strong> Một bước qua khi shell của nó thoát bằng không, nên mọi chuyện về độ tin cậy của bước quy về việc biết shell nào đã chạy và nó đã làm gì với các mã thoát — và cái mặc định, không có <code>pipefail</code>, sẽ để một lệnh hỏng bên trong một đường ống báo cáo thành công.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Log có dòng "command not found" mà bước vẫn xanh. Chuyện gì xảy ra?</strong><br>Đ: Gần như chắc chắn lệnh hỏng nằm TRƯỚC một dấu <code>|</code>, và bước chạy bằng shell mặc định <code>bash -e</code> — không có <code>pipefail</code>, nên mã thoát của đường ống là của lệnh cuối. Sửa: <code>shell: bash</code> (hoặc <code>defaults.run.shell: bash</code>), thứ thêm <code>-o pipefail</code>. Trên Windows mặc định pwsh thì còn tệ hơn: lệnh ngoài hỏng ở bất cứ dòng nào trước dòng cuối đều bị nuốt.</p>
<p><strong>H: Làm sao cho bước sau biết một giá trị bước trước tính ra?</strong><br>Đ: <code>echo "K=V" &gt;&gt; "$GITHUB_ENV"</code> để thành biến môi trường cho mọi bước SAU; hoặc <code>echo "k=v" &gt;&gt; "$GITHUB_OUTPUT"</code> ở bước có <code>id</code> rồi đọc <code>steps.&lt;id&gt;.outputs.k</code>. <code>export</code> không đi qua bước. Giá trị nhiều dòng dùng dạng heredoc với dấu phân cách.</p>
<p><strong>H: <code>continue-on-error</code> khác gì <code>if: always()</code> ở bước sau?</strong><br>Đ: <code>continue-on-error</code> ở bước HỎNG: tha cho nó, job vẫn xanh, <code>outcome=failure</code> nhưng <code>conclusion=success</code>. <code>always()</code> ở bước SAU: cho bước đó chạy dù trước đó có hỏng, nhưng job vẫn đỏ. Muốn "chạy báo cáo nhưng giữ CI đỏ" thì dùng cái thứ hai.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> CI của nhóm có một bước <code>npm test | tee test.log</code>, và tuần trước test hỏng mà CI xanh. Bạn muốn tái hiện, sửa, và chứng minh.</p><ol>
<li>Tạo workflow một job với bước A (không ghi <code>shell:</code>): <code>node -e "process.exit(1)" | tee out.log</code>. Push và xác nhận bước xanh.</li>
<li>Thêm <code>defaults: run: shell: bash</code> ở đầu workflow, push, xác nhận bước A đỏ và dòng <code>shell:</code> trong log có <code>pipefail</code>.</li>
<li>Cho bước A <code>id: a</code> và <code>continue-on-error: true</code>; thêm bước B in <code>&#36;{{ steps.a.outcome }}</code> và <code>&#36;{{ steps.a.conclusion }}</code>.</li>
<li>Thêm bước C ghi <code>echo "PHIEN_BAN=1.2.3" &gt;&gt; "$GITHUB_ENV"</code> rồi in <code>$PHIEN_BAN</code>; bước D in lại <code>$PHIEN_BAN</code>.</li>
<li>Thêm bước E <code>exit 2</code>, bước F <code>if: failure()</code>, bước G không điều kiện, bước H <code>if: always()</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có hai lần chạy chứng minh cùng một dòng lệnh xanh rồi đỏ chỉ vì <code>pipefail</code>; bước B in <code>failure</code>/<code>success</code>; bước C in rỗng còn D in <code>1.2.3</code>; và bảng kết quả E–H khớp với bảng đo trong bài (F, H chạy; G skip).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Số một tiến trình trả về khi kết thúc; 0 = thành công. Bước đỏ khi shell của nó thoát khác 0.</span></div>
  <div class="kv"><span class="k"><code>pipefail</code></span><span class="v">Cờ bash: đường ống hỏng nếu BẤT KỲ lệnh nào trong ống hỏng, không chỉ lệnh cuối.</span></div>
  <div class="kv"><span class="k"><code>{0}</code></span><span class="v">Chỗ runner điền đường dẫn tệp script tạm chứa khối <code>run:</code> của bạn.</span></div>
  <div class="kv"><span class="k"><code>$GITHUB_ENV</code> / <code>$GITHUB_PATH</code></span><span class="v">Tệp để đặt biến môi trường / thêm vào PATH cho các bước SAU trong cùng job.</span></div>
  <div class="kv"><span class="k"><code>continue-on-error</code> (cho phép hỏng)</span><span class="v">Bước (hay job) hỏng không làm job (hay run) đỏ; <code>outcome</code> vẫn ghi <code>failure</code>.</span></div>
  <div class="kv"><span class="k"><code>outcome</code> / <code>conclusion</code></span><span class="v">Kết quả thật / kết quả sau khi tha của một bước.</span></div>
  <div class="kv"><span class="k">Post step (bước dọn)</span><span class="v">Phần dọn của action, runner tự thêm, chạy ngược thứ tự dựng.</span></div>
  <div class="kv"><span class="k"><code>$GITHUB_STEP_SUMMARY</code></span><span class="v">Tệp nhận Markdown, hiện thành bản tóm tắt trên trang lần chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bước qua khi shell thoát 0. Mặc định Linux/macOS là <code>bash -e {0}</code> — thiếu <code>pipefail</code>: đo trên runner thật, cùng một ống xanh rồi đỏ (127) chỉ vì <code>shell: bash</code>.</li>
<li><code>set -e</code> được miễn trong <code>if</code>, bên trái <code>&amp;&amp;</code>, sau <code>!</code> và trong hàm gọi từ điều kiện; đổ lệnh qua ống cũng giấu mã thoát.</li>
<li>Mỗi bước là một tiến trình mới: <code>export</code> và <code>cd</code> không đi tiếp; <code>$GITHUB_ENV</code>/<code>$GITHUB_PATH</code> có hiệu lực từ bước SAU; <code>$GITHUB_OUTPUT</code> + <code>id</code> cho output.</li>
<li><code>continue-on-error</code> đặt <code>outcome=failure</code>, <code>conclusion=success</code>; bước được tha không bật <code>failure()</code>. Chỉ dùng cho bước ghi "(informational)" trong tên.</li>
<li>Sau một bước hỏng: bước thường skip, <code>failure()</code>/<code>always()</code> chạy; khi bị huỷ: <code>always()</code>/<code>cancelled()</code> chạy, <code>!cancelled()</code> thì không — và huỷ mất vài giây mới xong.</li>
<li>Các bước Post dọn theo thứ tự NGƯỢC, và số thứ tự bước có khoảng trống — không phải mất log.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.steps[*].shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#custom-shell — dòng lệnh chính xác cho mọi lựa chọn shell trên mọi nền tảng, gồm cả hai dạng bash vừa đo bên trên. Đáng đọc trọn một lần; các mặc định không đoán ra được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — lệnh dựng sẵn set, và các trường hợp miễn trừ của -e</span><span class="lc-sub">man bash, phần về <code>set -e</code> — danh sách chính thức các ngữ cảnh mà một trạng thái khác không không gây thoát, gồm cả sự miễn trừ được thừa kế bên trong một hàm gọi từ một điều kiện.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_OUTPUT, GITHUB_ENV, GITHUB_STEP_SUMMARY</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — các kênh bước-sang-bước được hỗ trợ, dạng heredoc cho giá trị nhiều dòng, và bản tóm tắt Markdown hiện trên trang lần chạy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mã thoát, đường ống, và vì sao set -e chưa đủ</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phần trình bày đầy đủ về <code>set -euo pipefail</code>, mỗi cờ thật sự mua được gì, và những ca mà cả bộ ba vẫn để lọt một cú hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — một script deploy báo thành công trong khi chẳng làm gì</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng loại lỗi ở ngoài CI, nơi một chỗ thiếu <code>pipefail</code> đã để một bước hỏng đi qua và cuộc deploy cứ thế tiến tới lúc tráo.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — matrix, fail-fast, and why this repository turned it off|||2.5 — matrix, fail-fast, và vì sao kho này tắt nó đi',
      slug: 'ga-2-5-ma-tran',
      type: 'VIDEO',
      description: '3 job khai báo nở thành 5 job chạy. `fail-fast` mặc định BẬT, và nó huỷ những nhánh đang chạy tốt — tính trên số đo thật: mặc định thu về 0 bản cài, tắt đi thu về 2 và tiết kiệm 564 máy-giây cho lần chạy lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2><code>matrix</code>, <code>fail-fast</code>, and why this repository turned it off</h2>
<p class="lead">A matrix is a loop over job definitions. It is the cleanest thing in the whole syntax and it has one default that will, on the day it matters, throw away work that was going fine.</p>

<h3>Three declared jobs, five running jobs</h3>
${slide('ga-02', 25, 'A matrix expands: include adds keys or new combinations')}

<p>The release workflow declares <code>kiem-tra</code>, <code>dung</code> and <code>cong-bo</code>. The run had five jobs, because <code>dung</code> carries this:</p>

<pre><code>  dung:
    name: Dung &#36;{{ matrix.ten }}
    needs: kiem-tra
    runs-on: &#36;{{ matrix.os }}
    timeout-minutes: 40
    strategy:
      <span class="tok-comment"># Mot nen tang hong thi hai nen tang kia VAN dung xong.</span>
      <span class="tok-comment"># Mac dinh cua GitHub la huy het — ma tha co hai ban con hon khong co ban nao.</span>
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            ten: macOS
            lenh: dist:mac
          - os: windows-latest
            ten: Windows
            lenh: dist:win
          - os: ubuntu-latest
            ten: Linux
            lenh: dist:linux</code></pre>

<p>Every key inside a matrix entry becomes available as <code>matrix.&lt;key&gt;</code> anywhere in the job — including in <code>runs-on:</code> and <code>name:</code>, which is what turns one definition into three differently-named jobs on three different machines. The <code>lenh</code> key is not a special word; it is an ordinary value carried through to the build step, so the same job body runs <code>dist:mac</code>, <code>dist:win</code> or <code>dist:linux</code>.</p>

<div class="kv-grid">
<div class="kv"><span class="k">cross-product form</span><span class="v"><code>matrix: {os: [a, b], node: [18, 20]}</code> generates <strong>four</strong> jobs — every combination. Two more values in each list gives sixteen, and that arithmetic is where matrices become expensive without anyone deciding to make them expensive</span></div>
<div class="kv"><span class="k"><code>include:</code></span><span class="v">an explicit list of combinations, as above. Use it when the combinations are not a product — this repository does not want "macOS with dist:win"</span></div>
<div class="kv"><span class="k"><code>exclude:</code></span><span class="v">removes specific combinations from a cross product. Useful for "everything except this one broken pairing"</span></div>
<div class="kv"><span class="k"><code>max-parallel:</code></span><span class="v">caps how many legs run at once. Reach for it when the legs contend over something external — a shared test database, an API rate limit — not to save money, since the total work is unchanged</span></div>
</div>

<h3>Measured on the sandbox: include and exclude, the real rules</h3>
${slide('ga-02', 26, 'The matrix: YAML and 6 real jobs')}
<p>The release repository&#39;s matrix uses only <code>include:</code>. The other two keys — and how they interact — are where people guess wrong, so the sandbox workflow <code>ch02-ma-tran.yml</code> builds a matrix with all three (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945581" target="_blank" rel="noopener">35989945581</a>):</p>
<pre><code class="language-yaml">  tich-cheo:
    name: tich-cheo (&#36;{{ matrix.os }}, node &#36;{{ matrix.node }})
    strategy:
      matrix:
        os: [ubuntu-24.04, ubuntu-24.04-arm]      # 2
        node: [20, 22, 24]                        # x 3 = 6 to hop
        exclude:
          - os: ubuntu-24.04-arm                  # bo 1 to hop -&gt; 5
            node: 24
        include:
          - node: 24                              # khop to hop CO SAN (ubuntu-24.04, 24)
            thu-nghiem: true                      #   -&gt; GAN them khoa, khong them job
          - os: ubuntu-24.04                      # khong khop to hop nao
            node: 25                              #   -&gt; them MOT to hop moi = 6 job
            thu-nghiem: true
    runs-on: &#36;{{ matrix.os }}
    steps:
      - run: echo '&#36;{{ toJSON(matrix) }}'</code></pre>
<div class="out">tich-cheo (ubuntu-24.04, node 20)       {"os": "ubuntu-24.04", "node": 20}
tich-cheo (ubuntu-24.04, node 22)       {"os": "ubuntu-24.04", "node": 22}
tich-cheo (ubuntu-24.04, node 24)       {"os": "ubuntu-24.04", "node": 24, "thu-nghiem": true}
tich-cheo (ubuntu-24.04, node 25)       {"os": "ubuntu-24.04", "node": 25, "thu-nghiem": true}
tich-cheo (ubuntu-24.04-arm, node 20)   {"os": "ubuntu-24.04-arm", "node": 20}
tich-cheo (ubuntu-24.04-arm, node 22)   {"os": "ubuntu-24.04-arm", "node": 22}
# 6 job — (ubuntu-24.04-arm, node 24) da bi exclude, va include "node: 24"
# KHONG hoi sinh no: include chi gan vao to hop CON LAI sau exclude</div>
<ol>
<li><strong>The cross product first:</strong> 2 operating systems × 3 Node versions = 6 combinations.</li>
<li><strong><code>exclude</code> next:</strong> removes every combination that matches ALL the keys in the exclude entry. 5 left.</li>
<li><strong><code>include</code> last, entry by entry:</strong> if the entry matches one or more remaining combinations WITHOUT overwriting any original value (<code>node: 24</code> matches the combination <code>ubuntu-24.04, 24</code>), it ADDS the new keys (<code>thu-nghiem: true</code>) to those combinations — no extra job. If it cannot match any combination without overwriting (<code>node: 25</code> is not in the original list), it becomes a NEW combination.</li>
</ol>
<p>The result is 6 jobs, with one detail worth remembering: <code>include: node 24</code> does not resurrect the excluded combination <code>arm, 24</code> — include only looks at what remains. The ceiling: a matrix generates at most <strong>256 jobs</strong> per workflow run (GitHub&#39;s limits page, 09/2026). GitHub names each job with the matrix values in brackets; write a <code>name:</code> using <code>&#36;{{ matrix.* }}</code> as above to make names readable.</p>

<h3>A dynamic matrix: the list is computed by an earlier job</h3>
<p>A matrix need not be written by hand. An earlier job computes the list, exports it as a JSON string through <code>outputs</code> (Lesson 2.2), and the later job fans out over it with <code>fromJSON</code>. This is how monorepos test only the packages that changed (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35992815073" target="_blank" rel="noopener">35992815073</a>):</p>
<pre><code class="language-yaml">jobs:
  liet-ke:
    runs-on: ubuntu-24.04
    outputs:
      goi: &#36;{{ steps.ds.outputs.goi }}
    steps:
      - uses: actions/checkout@v7
      - id: ds
        run: |
          goi=$(ls ch02/goi | jq -R . | jq -cs .)     # ["api","web","worker"]
          echo "goi=$goi" &gt;&gt; "$GITHUB_OUTPUT"
  kiem:
    needs: liet-ke
    strategy:
      matrix:
        goi: &#36;{{ fromJSON(needs.liet-ke.outputs.goi) }}   # chuoi JSON -&gt; danh sach
    runs-on: ubuntu-24.04
    steps:
      - run: echo "kiem goi &#36;{{ matrix.goi }} — nhanh &#36;{{ strategy.job-index }}/&#36;{{ strategy.job-total }}"</code></pre>
<div class="out">liet-ke        danh sach: ["api","web","worker"]
kiem (api)     kiem goi api — nhanh 0/3
kiem (web)     kiem goi web — nhanh 1/3
kiem (worker)  kiem goi worker — nhanh 2/3</div>
<p>Three packages in the folder, three jobs, and nobody edits YAML when a fourth package is added. The <code>strategy</code> context tells a leg where it is: <code>job-index</code> counts from 0 and <code>job-total</code> is the number of legs — useful for splitting a test suite into N shards (Chapter 7). Two traps: if the list is empty (<code>[]</code>) the matrix job FAILS rather than skipping — guard it with <code>if: needs.liet-ke.outputs.goi != '[]'</code>; and an output is a string, so forgetting <code>fromJSON</code> gives a matrix with exactly one leg holding the whole JSON string.</p>

<h3>The default that costs you</h3>
${slide('ga-02', 27, 'fail-fast on and off, the same failure')}

<p><code>fail-fast</code> defaults to <strong>true</strong>: the moment any leg fails, GitHub cancels every other leg that is still running. The reasoning is sound in the abstract — if the suite is broken, why keep burning machines? Apply it to this repository&#39;s measured timings and the abstraction gets expensive.</p>

<p>Take the real failure this repository had: <code>vite build</code> running out of heap on the macOS leg. It died early. Say at 60 seconds:</p>

<div class="out">### fail-fast: true (MAC DINH cua GitHub)
  macOS hong luc t=60 -> GitHub HUY hai nhanh kia ngay
  Linux dang o 60/241s   -> bi huy, KHONG co ban cai
  Windows dang o 60/323s -> bi huy, KHONG co ban cai
  ket qua: 0 ban cai
  da dot 3 x 60 = 180 may-giay, thu ve 0

### fail-fast: false (kho NAY dat)
  macOS hong luc t=60 -> hai nhanh kia CHAY TIEP
  Linux xong 241s   -> CO ban cai
  Windows xong 323s -> CO ban cai
  ket qua: 2/3 ban cai
  dot 60 + 241 + 323 = 624 may-giay, thu ve 2 ban cai

### lan chay LAI, sau khi va
  fail-fast: true  -> phai dung lai ca ba: 1001 may-giay
  fail-fast: false -> chi dung lai macOS:   437 may-giay
                      tiet kiem 564 may-giay</div>

<div class="callout warn">
<p><strong>The default optimises for the wrong resource.</strong> It saves machine-seconds in the failing run and spends far more of them in the retry, because a cancelled leg has to be redone from scratch. And the machine-seconds are the smaller loss: with <code>fail-fast: true</code> you end the run holding <em>nothing</em>, so you cannot ship a partial release, cannot compare a working platform against a broken one, and cannot tell whether the failure was platform-specific or universal — which is the first question you will want answered.</p>
</div>

<div class="callout ok">
<p><strong>The comment in the workflow file says it in one line</strong> (translated from the Vietnamese in the source): better to have two builds than none. That is the whole decision, and it is written where the next person to read the file will find it.</p>
</div>

<h3>Measured on the sandbox: fail-fast on and off, the same failure</h3>
<p>The arithmetic above is a what-if on the release repository&#39;s numbers. The sandbox runs it for real: two identical matrix jobs, each with three legs sleeping 5, 60 and 90 seconds, the 5-second leg failing on purpose. Only the <code>fail-fast</code> line differs (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945581" target="_blank" rel="noopener">35989945581</a>):</p>
<div class="out">ff-bat (fail-fast mac dinh = true)         ff-tat (fail-fast: false)
cham=5   bat dau 10:54:39                   cham=5   bat dau 10:54:40
         "nhanh 5s HONG"   exit 1                    "nhanh 5s HONG"   exit 1
cham=60  bi huy truoc khi kip in gi          cham=60  bat dau 10:55:15, xong 10:56:15
cham=90  bat dau 10:54:40                   cham=90  bat dau 10:54:39, xong 10:56:09
         ##[error]The operation was canceled.
         Terminate orphan process: (sleep)
         -&gt; job ket thuc 10:54:59 (chay 20s)
ket qua: 1 failure + 2 cancelled            ket qua: 1 failure + 2 success</div>
<p>With the default <code>fail-fast</code>, the 90-second leg had run for 20 seconds when it was cancelled, the runner killed the orphaned <code>sleep</code> process, and the job ended with NO result at all. The 60-second leg had not even printed its first line. With <code>fail-fast: false</code>, the other two legs ran to completion and went green. Two more things from the measurement: cancelling is not instant (the 5-second leg failed at 10:54:45, the 90-second leg fully stopped at 10:54:59), and in the UI a cancelled leg shows "cancelled", not "failure" — when reading a run, do not look for the bug inside a cancelled leg.</p>

<h3>When the default is right</h3>
${slide('ga-02', 28, 'An experimental leg allowed to fail')}

<p><code>fail-fast: true</code> is not a mistake everywhere. It fits when the legs are testing the same thing under different conditions and any failure invalidates the whole answer:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">keep it on — a test matrix over Node versions</span><span class="lz-lnote">if the suite fails on Node 18 you are not shipping regardless of what Node 20 says. Cancelling the rest is a straight saving</span></div>
<div class="lz-layer"><span class="lz-lname">turn it off — a build matrix producing artifacts</span><span class="lz-lnote">each leg produces something independently useful. This repository&#39;s case</span></div>
<div class="lz-layer"><span class="lz-lname">turn it off — a large matrix you are debugging</span><span class="lz-lnote">when four of twelve legs fail, you want to know <em>which four</em>. With fail-fast on, you learn about one and the other eleven are cancelled, so it takes several runs to see a pattern that one run could have shown</span></div>
<div class="lz-layer"><span class="lz-lname">turn it off — legs with wildly different durations</span><span class="lz-lnote">measured here: Linux 241s against macOS 437s. A fast leg failing cancels a slow leg that was 80% done, and that slow leg is the expensive one to redo</span></div>
</div>

<h3>One leg allowed to fail: <code>continue-on-error</code> per matrix entry</h3>
<p>A third way, between "cancel the group" and "cancel nothing": give SOME legs permission to fail. Combine a job-level <code>continue-on-error</code> with a matrix key of your own:</p>
<pre><code class="language-yaml">  thu-nghiem:
    strategy:                        # fail-fast NOT switched off — still true
      matrix:
        loai: [on-dinh, thu-nghiem]
        include:
          - loai: thu-nghiem
            cho-hong: true           # a key of our own, only this leg has it
    continue-on-error: &#36;{{ matrix.cho-hong == true }}
    runs-on: ubuntu-24.04</code></pre>
<div class="out">thu-nghiem (thu-nghiem)   continue-on-error: true    start 10:54:38  "ban thu nghiem HONG" exit 1   -&gt; failure
thu-nghiem (on-dinh)      continue-on-error: false   start 10:55:14  "ban on dinh xong"              -&gt; success
# fail-fast VAN BAT o job nay — nhung nhanh hong co continue-on-error, nen khong kich hoat viec huy</div>
<p>The experimental leg failed at second 5; the stable leg still ran its full 40 seconds to green, even though <code>fail-fast</code> is on. The documentation says exactly this: a leg with <code>continue-on-error: true</code> that fails does not cancel the other legs. This is the standard pattern for "latest Node", "beta OS", "upcoming library version": you want to SEE it break early without letting it block the whole team&#39;s PRs.</p>

<h3>Two things that also come out of the timings</h3>
<p>The desktop release has run twelve recent times. Ten succeeded and two failed:</p>

<div class="out">thanh cong (10 lan): 555, 470, 409, 470, 420, 425, 476, 525, 403, 429  -> TB ~455s
HONG      ( 2 lan): 80, 334                                             -> HONG NHANH HON</div>

<div class="callout">
<p><strong>Failures are faster than successes, and that is worth internalising as a reading habit.</strong> A run that finished in 80 seconds when the normal time is 455 did not go well — it stopped early. So run duration is a usable signal before you open anything: much shorter than usual means something bailed, much longer than usual means something hung or retried. Chapter 8 builds this into a proper triage order.</p>
</div>

<p>The other one is <code>timeout-minutes: 40</code> on the matrix job. Six of this repository&#39;s workflows set an explicit timeout; the default, if you set none, is <strong>360 minutes</strong> — six hours. A hung job with no timeout holds a runner for six hours and, on a private repository at the macOS multiplier, bills 3,600 minutes for producing nothing at all.</p>

<div class="pitfall">
<p><strong>Trap — a matrix that grew by multiplication.</strong> <code>{os: [ubuntu, macos, windows], node: [18, 20, 22]}</code> is nine jobs, which reads as reasonable until you price it: at the platform multipliers from 2.3, the three macOS legs alone would dominate the bill. Matrices grow by <em>multiplication</em> while the config grows by addition, so a one-line change adds three jobs. Before adding a dimension, ask what a leg would tell you that another leg does not — and if the answer is "it would be the same", <code>include:</code> the combinations that matter rather than crossing everything with everything.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A matrix turns one job definition into <em>n</em> real jobs on real machines, and <code>fail-fast: true</code> — the default — trades the results you were about to get for machine-seconds you will spend again anyway on the retry.</p>
</div>

<h3>max-parallel, and the ceiling of the whole account</h3>
${slide('ga-02', 29, 'max-parallel: 1 — three legs one after another')}
<p><code>max-parallel</code> limits how many legs of ONE matrix run at once. The job <code>tung-cai-mot</code> has three legs, each sleeping 10 seconds, with <code>max-parallel: 1</code>:</p>
<div class="out">tung-cai-mot (1)   tao 10:54:35   chay 10:54:38   "nhanh 1 chay luc 10:54:40"
tung-cai-mot (2)   tao 10:54:35   chay 10:54:54   "nhanh 2 chay luc 10:54:55"
tung-cai-mot (3)   tao 10:54:35   chay 10:55:09   "nhanh 3 chay luc 10:55:10"
# max-parallel: 1 -&gt; ca ba duoc TAO cung luc, CHAY lan luot: 3 x ~13s thay vi ~13s</div>
<p>All three were created in the same second but ran one after another — three times the wall-clock, the same total machine minutes. So <code>max-parallel</code> does not save money; you use it when the legs compete for something OUTSIDE: a shared test database, an API rate limit, a staging server that can take only one deploy at a time.</p>
<p>Above it sits a ceiling you do not set: how many jobs the whole account can run at once. According to GitHub&#39;s limits page (09/2026): Free plan <strong>20</strong> jobs, Pro 40, Team 60, Enterprise 500 — and macOS alone only <strong>5</strong> concurrent jobs on every plan except Enterprise (50). A 3-OS × 4-Node matrix has 4 macOS legs; two PRs pushed together make 8 macOS legs, and 3 of them will queue — it looks like "slow CI" but it is the ceiling. An honest note: in the sandbox matrix run, two legs (<code>ff-tat (60)</code>, <code>thu-nghiem (on-dinh)</code>) queued for 39 seconds even though fewer than 20 jobs were running on the account at the time — the cause could not be determined from the API; queue time is not something you fully control.</p>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: A matrix with <code>os: [ubuntu, windows, macos]</code>, <code>node: [20, 22]</code>, and you do not want Node 20 on macOS. How many jobs, and how do you write it?</strong><br>A: 3 × 2 = 6, minus 1 = 5 jobs; add <code>exclude: [{ os: macos, node: 20 }]</code>. To add an odd combination (say Node 24 on Ubuntu only), use <code>include</code> with a value not in the original lists — it becomes a new combination; an include that matches an existing combination only adds keys.</p>
<p><strong>Q: What is <code>fail-fast</code>&#39;s default, and when do you turn it off?</strong><br>A: The default is <code>true</code>: one failing leg cancels every running and queued leg. Turn it off when each leg produces something useful on its own (per-platform builds), when debugging and you need to know WHICH legs fail, or when legs differ a lot in length. Keep it when all legs answer the same question and one failure is enough to decide.</p>
<p><strong>Q: A monorepo has 40 packages and each PR touches 2–3 of them. How do you make CI test only the changed packages?</strong><br>A: A dynamic matrix: the first job computes the list of changed packages (against the base branch) and exports JSON through <code>outputs</code>; the next job uses <code>matrix: pkg: &#36;{{ fromJSON(needs.x.outputs.pkg) }}</code>; guard the empty-list case with <code>if:</code>. Remember the 256-job ceiling per run.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team wants tests on Node 20 and 22, on Ubuntu and Windows, plus an experimental Node 24 leg that may fail, and does not want one failing leg to erase the others&#39; results.</p><ol>
<li>Write a matrix <code>os: [ubuntu-latest, windows-latest]</code>, <code>node: [20, 22]</code>, <code>fail-fast: false</code>; each leg runs <code>echo '&#36;{{ toJSON(matrix) }}'</code>. Before pushing, write down the number of jobs and each job&#39;s name.</li>
<li>Add <code>include: [{ os: ubuntu-latest, node: 24, experimental: true }]</code> and <code>continue-on-error: &#36;{{ matrix.experimental == true }}</code>; make the <code>experimental</code> leg run <code>exit 1</code>.</li>
<li>Add <code>exclude: [{ os: windows-latest, node: 20 }]</code>. Predict the job count again, push, compare with the Actions tab.</li>
<li>Set <code>fail-fast</code> to <code>true</code> and make the <code>ubuntu, 20</code> leg run <code>sleep 5 &amp;&amp; exit 1</code>, the others <code>sleep 60</code>. Push and count the cancelled legs.</li>
<li>Write a job <code>list</code> that exports <code>["a","b","c"]</code> through <code>outputs</code> and a matrix job that uses <code>fromJSON</code> on it; print <code>&#36;{{ strategy.job-index }}</code>.</li></ol>
<p><strong>Done when:</strong> your predictions in steps 1 and 3 match reality (4 in step 1; 4 in step 3 — include adds one new combination, exclude removes one); the experimental leg is red while the run stays green; step 4 has exactly one failure and the other legs cancelled; step 5 creates exactly three jobs with <code>job-index</code> 0, 1, 2.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Matrix</span><span class="v">A loop over a job definition: each combination of values becomes a real job on a real machine. At most 256 jobs per run.</span></div>
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Adds keys to existing combinations when it overwrites no original value; otherwise adds a new combination. Processed AFTER exclude.</span></div>
  <div class="kv"><span class="k"><code>exclude</code></span><span class="v">Removes the combinations matching all the keys in the entry.</span></div>
  <div class="kv"><span class="k"><code>fail-fast</code></span><span class="v">Default <code>true</code>: one failing leg cancels the running/queued legs of that matrix.</span></div>
  <div class="kv"><span class="k"><code>max-parallel</code></span><span class="v">The maximum number of legs of one matrix running at once; total machine minutes unchanged.</span></div>
  <div class="kv"><span class="k">Dynamic matrix</span><span class="v">A matrix whose list comes from an earlier job&#39;s output through <code>fromJSON</code>.</span></div>
  <div class="kv"><span class="k"><code>strategy.job-index</code> / <code>job-total</code></span><span class="v">A leg&#39;s position (from 0) and the number of legs — used to split work into N shards.</span></div>
  <div class="kv"><span class="k">Concurrency limit</span><span class="v">How many jobs the whole account runs at once: Free 20, macOS alone 5.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A matrix expands in order: cross product → <code>exclude</code> → <code>include</code>. Measured: 2×3 − 1 + 1 = 6 jobs; an include matching an existing combination only ADDS keys, otherwise it adds a new combination.</li>
<li>Dynamic matrix: an earlier job exports JSON through <code>outputs</code>, the later job uses <code>fromJSON</code>; guard the empty list; ceiling 256 jobs.</li>
<li><code>fail-fast</code> defaults to <code>true</code>: measured, the 90s leg was cancelled after 20s and the job ended with no result; with <code>false</code> the other two legs finished green.</li>
<li><code>continue-on-error</code> keyed on a matrix value lets one leg fail without triggering fail-fast.</li>
<li><code>max-parallel</code> runs legs one after another (measured: 3 legs in sequence) — for contention on outside resources, not for saving money.</li>
<li>The account ceiling: Free 20 concurrent jobs, macOS 5 — a big matrix plus several PRs will queue.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Running variations of jobs in a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs — the cross-product rules, <code>include</code> and <code>exclude</code> semantics (including the surprising ones where <code>include</code> adds keys to existing combinations), and the 256-job ceiling per workflow run.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.strategy.fail-fast and max-parallel</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast — the default value, and the per-step <code>continue-on-error</code> interaction that lets one leg be tolerated while others are not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — the 360-minute default that applies when you set nothing, and the separate per-step timeout.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — partial success is a result, not a failure</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same argument in a deploy: a rollout that reached two of three nodes is information you want to keep, and a pipeline that discards it on the first error is harder to reason about than one that does not.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2><code>matrix</code>, <code>fail-fast</code>, và vì sao kho này tắt nó đi</h2>
<p class="lead">Một ma trận là một vòng lặp trên các định nghĩa job. Nó là thứ gọn gàng nhất trong cả bộ cú pháp và nó có đúng một cái mặc định mà vào cái ngày nó có ý nghĩa, sẽ vứt đi phần việc vốn đang chạy tốt.</p>

<h3>Ba job khai báo, năm job chạy</h3>
${slide('ga-02', 25, 'Ma trận nở: include gắn khoá hoặc đẻ tổ hợp mới')}

<p>Workflow phát hành khai <code>kiem-tra</code>, <code>dung</code> và <code>cong-bo</code>. Lần chạy có năm job, vì <code>dung</code> mang theo cái này:</p>

<pre><code>  dung:
    name: Dung &#36;{{ matrix.ten }}
    needs: kiem-tra
    runs-on: &#36;{{ matrix.os }}
    timeout-minutes: 40
    strategy:
      <span class="tok-comment"># Mot nen tang hong thi hai nen tang kia VAN dung xong.</span>
      <span class="tok-comment"># Mac dinh cua GitHub la huy het — ma tha co hai ban con hon khong co ban nao.</span>
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            ten: macOS
            lenh: dist:mac
          - os: windows-latest
            ten: Windows
            lenh: dist:win
          - os: ubuntu-latest
            ten: Linux
            lenh: dist:linux</code></pre>

<p>Mọi khoá bên trong một mục ma trận đều trở thành <code>matrix.&lt;khoá&gt;</code> dùng được ở bất cứ đâu trong job — kể cả trong <code>runs-on:</code> và <code>name:</code>, và đó chính là thứ biến một định nghĩa thành ba job mang tên khác nhau trên ba cỗ máy khác nhau. Khoá <code>lenh</code> không phải từ đặc biệt gì; nó là một giá trị bình thường được mang xuống bước dựng, nên cùng một thân job chạy <code>dist:mac</code>, <code>dist:win</code> hoặc <code>dist:linux</code>.</p>

<div class="kv-grid">
<div class="kv"><span class="k">dạng tích chéo</span><span class="v"><code>matrix: {os: [a, b], node: [18, 20]}</code> sinh ra <strong>BỐN</strong> job — mọi tổ hợp. Thêm hai giá trị vào mỗi danh sách là ra mười sáu, và chính phép tính ấy là chỗ ma trận trở nên đắt mà không ai quyết định làm cho nó đắt</span></div>
<div class="kv"><span class="k"><code>include:</code></span><span class="v">một danh sách tổ hợp tường minh, như trên. Dùng khi các tổ hợp KHÔNG phải một tích — kho này không muốn "macOS với dist:win"</span></div>
<div class="kv"><span class="k"><code>exclude:</code></span><span class="v">gỡ các tổ hợp cụ thể khỏi một tích chéo. Hữu ích cho kiểu "tất cả trừ đúng cặp hỏng này"</span></div>
<div class="kv"><span class="k"><code>max-parallel:</code></span><span class="v">chặn số nhánh chạy cùng lúc. Với tay tới nó khi các nhánh tranh nhau một thứ bên ngoài — một cơ sở dữ liệu test dùng chung, một trần gọi API — chứ không phải để tiết kiệm tiền, vì tổng công việc không đổi</span></div>
</div>

<h3>Đo trên sân tập: include và exclude, luật thật</h3>
${slide('ga-02', 26, 'Ma trận: YAML và 6 job thật')}
<p>Ma trận của kho phát hành chỉ dùng <code>include:</code>. Hai khoá kia — và sự tương tác giữa chúng — mới là chỗ người ta hay đoán sai, nên workflow <code>ch02-ma-tran.yml</code> trên sân tập dựng một ma trận có đủ cả ba (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945581" target="_blank" rel="noopener">35989945581</a>):</p>
<pre><code class="language-yaml">  tich-cheo:
    name: tich-cheo (&#36;{{ matrix.os }}, node &#36;{{ matrix.node }})
    strategy:
      matrix:
        os: [ubuntu-24.04, ubuntu-24.04-arm]      # 2
        node: [20, 22, 24]                        # x 3 = 6 to hop
        exclude:
          - os: ubuntu-24.04-arm                  # bo 1 to hop -&gt; 5
            node: 24
        include:
          - node: 24                              # khop to hop CO SAN (ubuntu-24.04, 24)
            thu-nghiem: true                      #   -&gt; GAN them khoa, khong them job
          - os: ubuntu-24.04                      # khong khop to hop nao
            node: 25                              #   -&gt; them MOT to hop moi = 6 job
            thu-nghiem: true
    runs-on: &#36;{{ matrix.os }}
    steps:
      - run: echo '&#36;{{ toJSON(matrix) }}'</code></pre>
<div class="out">tich-cheo (ubuntu-24.04, node 20)       {"os": "ubuntu-24.04", "node": 20}
tich-cheo (ubuntu-24.04, node 22)       {"os": "ubuntu-24.04", "node": 22}
tich-cheo (ubuntu-24.04, node 24)       {"os": "ubuntu-24.04", "node": 24, "thu-nghiem": true}
tich-cheo (ubuntu-24.04, node 25)       {"os": "ubuntu-24.04", "node": 25, "thu-nghiem": true}
tich-cheo (ubuntu-24.04-arm, node 20)   {"os": "ubuntu-24.04-arm", "node": 20}
tich-cheo (ubuntu-24.04-arm, node 22)   {"os": "ubuntu-24.04-arm", "node": 22}
# 6 job — (ubuntu-24.04-arm, node 24) da bi exclude, va include "node: 24"
# KHONG hoi sinh no: include chi gan vao to hop CON LAI sau exclude</div>
<ol>
<li><strong>Tích chéo trước:</strong> 2 hệ điều hành × 3 phiên bản Node = 6 tổ hợp.</li>
<li><strong><code>exclude</code> tiếp theo:</strong> gỡ mọi tổ hợp khớp ĐỦ các khoá ghi trong mục exclude. Còn 5.</li>
<li><strong><code>include</code> sau cùng, từng mục một:</strong> nếu mục ấy khớp với một hay nhiều tổ hợp còn lại mà KHÔNG phải ghi đè giá trị gốc nào (<code>node: 24</code> khớp tổ hợp <code>ubuntu-24.04, 24</code>), nó GẮN thêm các khoá mới (<code>thu-nghiem: true</code>) vào những tổ hợp đó — không thêm job. Nếu không khớp được tổ hợp nào mà không ghi đè (<code>node: 25</code> không có trong danh sách gốc), nó thành một tổ hợp MỚI.</li>
</ol>
<p>Kết quả là 6 job, và một chi tiết đáng nhớ: <code>include: node 24</code> không hồi sinh tổ hợp <code>arm, 24</code> đã bị exclude — include chỉ nhìn những gì còn lại. Trần: một ma trận sinh tối đa <strong>256 job</strong> mỗi lần chạy (trang giới hạn của GitHub, 09/2026). Và GitHub tự đặt tên job bằng các giá trị ma trận trong ngoặc; viết <code>name:</code> có <code>&#36;{{ matrix.* }}</code> như trên để tên đọc được.</p>

<h3>Ma trận động: danh sách tính ra ở job trước</h3>
<p>Ma trận không nhất thiết phải viết tay. Một job trước tính danh sách, xuất ra dạng chuỗi JSON qua <code>outputs</code> (bài 2.2), và job sau nở theo nó bằng <code>fromJSON</code>. Đây là cách các monorepo chỉ kiểm những gói vừa đổi (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35992815073" target="_blank" rel="noopener">35992815073</a>):</p>
<pre><code class="language-yaml">jobs:
  liet-ke:
    runs-on: ubuntu-24.04
    outputs:
      goi: &#36;{{ steps.ds.outputs.goi }}
    steps:
      - uses: actions/checkout@v7
      - id: ds
        run: |
          goi=$(ls ch02/goi | jq -R . | jq -cs .)     # ["api","web","worker"]
          echo "goi=$goi" &gt;&gt; "$GITHUB_OUTPUT"
  kiem:
    needs: liet-ke
    strategy:
      matrix:
        goi: &#36;{{ fromJSON(needs.liet-ke.outputs.goi) }}   # chuoi JSON -&gt; danh sach
    runs-on: ubuntu-24.04
    steps:
      - run: echo "kiem goi &#36;{{ matrix.goi }} — nhanh &#36;{{ strategy.job-index }}/&#36;{{ strategy.job-total }}"</code></pre>
<div class="out">liet-ke        danh sach: ["api","web","worker"]
kiem (api)     kiem goi api — nhanh 0/3
kiem (web)     kiem goi web — nhanh 1/3
kiem (worker)  kiem goi worker — nhanh 2/3</div>
<p>Ba gói trong thư mục, ba job, không ai phải sửa YAML khi thêm gói thứ tư. Ngữ cảnh <code>strategy</code> cho biết vị trí của nhánh: <code>job-index</code> đếm từ 0, <code>job-total</code> là tổng số nhánh — hữu ích để chia bộ test thành N phần (Chương 7). Hai cái bẫy: nếu danh sách rỗng (<code>[]</code>) thì job ma trận HỎNG chứ không skip — hãy chặn bằng <code>if: needs.liet-ke.outputs.goi != '[]'</code>; và output là chuỗi, quên <code>fromJSON</code> thì ma trận có đúng một nhánh mang cả chuỗi JSON.</p>

<h3>Cái mặc định khiến bạn tốn</h3>
${slide('ga-02', 27, 'fail-fast bật và tắt, cùng một ca hỏng')}

<p><code>fail-fast</code> mặc định là <strong>true</strong>: ngay khoảnh khắc bất kỳ nhánh nào hỏng, GitHub HUỶ mọi nhánh còn đang chạy. Lý lẽ nghe hợp lý ở mức trừu tượng — nếu cả bộ đã hỏng, đốt máy tiếp làm gì? Đem áp lên số đo thật của kho này thì cái trừu tượng ấy hoá đắt.</p>

<p>Lấy cú hỏng thật kho này từng gặp: <code>vite build</code> cạn heap ở nhánh macOS. Nó chết sớm. Cứ cho là ở giây thứ 60:</p>

<div class="out">### fail-fast: true (MAC DINH cua GitHub)
  macOS hong luc t=60 -> GitHub HUY hai nhanh kia ngay
  Linux dang o 60/241s   -> bi huy, KHONG co ban cai
  Windows dang o 60/323s -> bi huy, KHONG co ban cai
  ket qua: 0 ban cai
  da dot 3 x 60 = 180 may-giay, thu ve 0

### fail-fast: false (kho NAY dat)
  macOS hong luc t=60 -> hai nhanh kia CHAY TIEP
  Linux xong 241s   -> CO ban cai
  Windows xong 323s -> CO ban cai
  ket qua: 2/3 ban cai
  dot 60 + 241 + 323 = 624 may-giay, thu ve 2 ban cai

### lan chay LAI, sau khi va
  fail-fast: true  -> phai dung lai ca ba: 1001 may-giay
  fail-fast: false -> chi dung lai macOS:   437 may-giay
                      tiet kiem 564 may-giay</div>

<div class="callout warn">
<p><strong>Cái mặc định đang tối ưu nhầm tài nguyên.</strong> Nó tiết kiệm máy-giây trong lần chạy hỏng rồi tiêu tốn nhiều hơn hẳn ở lần chạy lại, bởi một nhánh bị huỷ thì phải làm lại từ đầu. Mà máy-giây còn là mất mát NHỎ hơn: với <code>fail-fast: true</code> bạn kết thúc lần chạy trong tay <em>KHÔNG CÓ GÌ</em>, nên bạn không phát hành được một phần, không đối chiếu được nền tảng chạy tốt với nền tảng hỏng, và không biết được cú hỏng là riêng của nền tảng hay là chung — mà đó lại là câu hỏi đầu tiên bạn sẽ muốn có đáp án.</p>
</div>

<div class="callout ok">
<p><strong>Bình luận trong chính tệp workflow nói gọn trong một dòng:</strong> "thà có hai bản còn hơn không có bản nào". Đó là toàn bộ quyết định, và nó được viết ngay chỗ mà người kế tiếp đọc tệp sẽ thấy.</p>
</div>

<h3>Đo lại trên sân tập: fail-fast bật và tắt, cùng một ca hỏng</h3>
<p>Phép tính ở trên là giả định trên số của kho phát hành. Sân tập chạy nó thật: hai job ma trận giống hệt nhau, mỗi job ba nhánh ngủ 5, 60 và 90 giây, nhánh 5 giây cố ý hỏng. Chỉ khác một dòng <code>fail-fast</code> (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945581" target="_blank" rel="noopener">35989945581</a>):</p>
<div class="out">ff-bat (fail-fast mac dinh = true)         ff-tat (fail-fast: false)
cham=5   bat dau 10:54:39                   cham=5   bat dau 10:54:40
         "nhanh 5s HONG"   exit 1                    "nhanh 5s HONG"   exit 1
cham=60  bi huy truoc khi kip in gi          cham=60  bat dau 10:55:15, xong 10:56:15
cham=90  bat dau 10:54:40                   cham=90  bat dau 10:54:39, xong 10:56:09
         ##[error]The operation was canceled.
         Terminate orphan process: (sleep)
         -&gt; job ket thuc 10:54:59 (chay 20s)
ket qua: 1 failure + 2 cancelled            ket qua: 1 failure + 2 success</div>
<p>Với <code>fail-fast</code> mặc định, nhánh 90 giây đã chạy được 20 giây thì bị huỷ, runner giết tiến trình <code>sleep</code> mồ côi, và job kết thúc KHÔNG có kết quả nào. Nhánh 60 giây còn chưa kịp in dòng đầu tiên. Với <code>fail-fast: false</code>, hai nhánh kia chạy trọn và xanh. Hai điều nữa từ phép đo: huỷ không tức thì (nhánh 5 giây hỏng lúc 10:54:45, nhánh 90 giây dừng hẳn lúc 10:54:59), và trên giao diện nhánh bị huỷ hiện là "cancelled", không phải "failure" — đọc run thì đừng tìm lỗi trong nhánh cancelled.</p>

<h3>Khi nào cái mặc định là ĐÚNG</h3>
${slide('ga-02', 28, 'Nhánh thử nghiệm được phép hỏng')}

<p><code>fail-fast: true</code> không phải sai lầm ở mọi nơi. Nó hợp khi các nhánh đang kiểm CÙNG một thứ dưới những điều kiện khác nhau và bất kỳ cú hỏng nào cũng vô hiệu hoá cả câu trả lời:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">GIỮ bật — một ma trận test qua các phiên bản Node</span><span class="lz-lnote">nếu bộ test hỏng trên Node 18 thì bạn không phát hành, bất kể Node 20 nói gì. Huỷ phần còn lại là một khoản tiết kiệm thẳng</span></div>
<div class="lz-layer"><span class="lz-lname">TẮT — một ma trận dựng sinh ra artifact</span><span class="lz-lnote">mỗi nhánh tạo ra một thứ tự nó đã hữu ích. Ca của kho này</span></div>
<div class="lz-layer"><span class="lz-lname">TẮT — một ma trận lớn mà bạn đang gỡ lỗi</span><span class="lz-lnote">khi bốn trong mười hai nhánh hỏng, bạn muốn biết <em>BỐN CÁI NÀO</em>. Với fail-fast bật, bạn biết được một cái và mười một cái kia bị huỷ, nên phải mấy lần chạy mới thấy được cái quy luật mà một lần chạy đã có thể cho thấy</span></div>
<div class="lz-layer"><span class="lz-lname">TẮT — các nhánh có độ dài chênh nhau dữ dội</span><span class="lz-lnote">đo ở đây: Linux 241s so với macOS 437s. Một nhánh nhanh hỏng sẽ huỷ một nhánh chậm vốn đã xong 80%, và cái nhánh chậm ấy mới là cái đắt để làm lại</span></div>
</div>

<h3>Một nhánh được phép hỏng: <code>continue-on-error</code> theo ma trận</h3>
<p>Cách thứ ba, giữa "huỷ cả nhóm" và "không huỷ gì": cho RIÊNG vài nhánh quyền hỏng. Ghép <code>continue-on-error</code> ở mức job với một khoá ma trận tự đặt:</p>
<pre><code class="language-yaml">  thu-nghiem:
    strategy:                        # fail-fast KHONG tat — van la true
      matrix:
        loai: [on-dinh, thu-nghiem]
        include:
          - loai: thu-nghiem
            cho-hong: true           # khoa tu dat, chi nhanh nay co
    continue-on-error: &#36;{{ matrix.cho-hong == true }}
    runs-on: ubuntu-24.04</code></pre>
<div class="out">thu-nghiem (thu-nghiem)   continue-on-error: true    start 10:54:38  "ban thu nghiem HONG" exit 1   -&gt; failure
thu-nghiem (on-dinh)      continue-on-error: false   start 10:55:14  "ban on dinh xong"              -&gt; success
# fail-fast VAN BAT o job nay — nhung nhanh hong co continue-on-error, nen khong kich hoat viec huy</div>
<p>Nhánh thử nghiệm hỏng ở giây thứ 5; nhánh ổn định vẫn chạy đủ 40 giây tới xanh, dù <code>fail-fast</code> đang bật. Tài liệu nói đúng như vậy: nhánh có <code>continue-on-error: true</code> hỏng thì không làm huỷ các nhánh khác. Đây là khuôn chuẩn cho "Node bản mới nhất", "hệ điều hành bản beta", "phiên bản thư viện sắp ra": bạn muốn THẤY nó hỏng sớm, mà không muốn nó chặn PR của cả nhóm.</p>

<h3>Hai thứ nữa cũng rơi ra từ nhịp thời gian</h3>
<p>Bản phát hành desktop đã chạy mười hai lần gần đây. Mười lần thành công và hai lần hỏng:</p>

<div class="out">thanh cong (10 lan): 555, 470, 409, 470, 420, 425, 476, 525, 403, 429  -> TB ~455s
HONG      ( 2 lan): 80, 334                                             -> HONG NHANH HON</div>

<div class="callout">
<p><strong>Hỏng thì nhanh hơn thành công, và điều đó đáng nội hoá thành một thói quen ĐỌC.</strong> Một lần chạy xong trong 80 giây khi giờ bình thường là 455 thì đã không suôn sẻ — nó dừng sớm. Nên độ dài lần chạy là một tín hiệu dùng được TRƯỚC khi bạn mở bất cứ thứ gì: ngắn hơn hẳn thường lệ nghĩa là có thứ gì đã bỏ cuộc, dài hơn hẳn nghĩa là có thứ gì treo hoặc thử lại. Chương 8 dựng cái này thành một thứ tự phân loại tử tế.</p>
</div>

<p>Cái thứ hai là <code>timeout-minutes: 40</code> trên job ma trận. Sáu trong số workflow của kho này đặt thời hạn tường minh; mặc định, nếu bạn không đặt gì, là <strong>360 phút</strong> — sáu tiếng. Một job treo mà không có thời hạn sẽ giữ một runner suốt sáu tiếng và, ở một kho riêng tư với hệ số macOS, tính tiền 3.600 phút cho việc chẳng tạo ra cái gì.</p>

<div class="pitfall">
<p><strong>Bẫy — một ma trận phình ra bằng phép NHÂN.</strong> <code>{os: [ubuntu, macos, windows], node: [18, 20, 22]}</code> là chín job, đọc lên nghe hợp lý cho tới khi bạn tính tiền cho nó: với các hệ số nền tảng ở bài 2.3, chỉ riêng ba nhánh macOS đã áp đảo hoá đơn. Ma trận lớn lên bằng phép <em>NHÂN</em> trong khi cấu hình lớn lên bằng phép cộng, nên một thay đổi một dòng thêm ba job. Trước khi thêm một chiều, hãy hỏi một nhánh sẽ cho bạn biết điều gì mà nhánh khác không cho — và nếu đáp án là "nó sẽ y hệt", thì hãy <code>include:</code> đúng những tổ hợp có nghĩa thay vì đem mọi thứ nhân với mọi thứ.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một ma trận biến một định nghĩa job thành <em>n</em> job thật trên máy thật, và <code>fail-fast: true</code> — cái mặc định — đem đổi những kết quả bạn sắp có lấy số máy-giây mà rồi bạn cũng sẽ tiêu lại ở lần chạy lại.</p>
</div>

<h3>max-parallel, và trần của cả tài khoản</h3>
${slide('ga-02', 29, 'max-parallel: 1 — ba nhánh chạy lần lượt')}
<p><code>max-parallel</code> giới hạn số nhánh chạy cùng lúc của MỘT ma trận. Job <code>tung-cai-mot</code> có ba nhánh, mỗi nhánh ngủ 10 giây, với <code>max-parallel: 1</code>:</p>
<div class="out">tung-cai-mot (1)   tao 10:54:35   chay 10:54:38   "nhanh 1 chay luc 10:54:40"
tung-cai-mot (2)   tao 10:54:35   chay 10:54:54   "nhanh 2 chay luc 10:54:55"
tung-cai-mot (3)   tao 10:54:35   chay 10:55:09   "nhanh 3 chay luc 10:55:10"
# max-parallel: 1 -&gt; ca ba duoc TAO cung luc, CHAY lan luot: 3 x ~13s thay vi ~13s</div>
<p>Cả ba được tạo cùng giây, nhưng chạy nối đuôi nhau — tổng thời gian đồng hồ gấp ba, tổng phút máy không đổi. Nên <code>max-parallel</code> không tiết kiệm tiền; nó dùng khi các nhánh tranh nhau một thứ BÊN NGOÀI: một cơ sở dữ liệu test chung, một trần gọi API, một máy chủ staging chỉ chịu được một lần deploy.</p>
<p>Phía trên nó còn một trần bạn không đặt: số job chạy cùng lúc của cả tài khoản. Theo trang giới hạn của GitHub (09/2026): gói Free <strong>20</strong> job, Pro 40, Team 60, Enterprise 500 — và riêng macOS chỉ <strong>5</strong> job cùng lúc ở mọi gói trừ Enterprise (50). Một ma trận 3 hệ điều hành × 4 phiên bản Node có 4 nhánh macOS; hai PR đẩy cùng lúc là 8 nhánh macOS, và 3 nhánh sẽ xếp hàng — trông như "CI chậm" mà thật ra là trần. Ghi chú trung thực: ở lần chạy ma trận trên sân tập, hai nhánh (<code>ff-tat (60)</code>, <code>thu-nghiem (on-dinh)</code>) xếp hàng 39 giây dù lúc đó số job đang chạy trên tài khoản chưa tới 20 — nguyên nhân chưa xác định được từ API; thời gian xếp hàng không phải thứ bạn điều khiển được hoàn toàn.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Ma trận <code>os: [ubuntu, windows, macos]</code>, <code>node: [20, 22]</code>, và bạn không muốn chạy Node 20 trên macOS. Bao nhiêu job, viết thế nào?</strong><br>Đ: 3 × 2 = 6, trừ 1 = 5 job; thêm <code>exclude: [{ os: macos, node: 20 }]</code>. Muốn thêm một tổ hợp lẻ (vd Node 24 chỉ trên Ubuntu) thì dùng <code>include</code> với giá trị không có trong danh sách gốc — nó thành tổ hợp mới; còn include khớp tổ hợp có sẵn thì chỉ gắn thêm khoá.</p>
<p><strong>H: <code>fail-fast</code> mặc định là gì, và bạn tắt nó khi nào?</strong><br>Đ: Mặc định <code>true</code>: một nhánh hỏng thì huỷ mọi nhánh đang chạy và đang chờ. Tắt khi mỗi nhánh tự tạo ra thứ có ích (bản dựng từng nền tảng), khi đang gỡ lỗi và cần biết NHÁNH NÀO hỏng, hoặc khi các nhánh dài ngắn chênh nhau nhiều. Giữ khi các nhánh cùng trả lời một câu và một nhánh hỏng là đủ kết luận.</p>
<p><strong>H: Monorepo có 40 gói, mỗi PR chỉ đổi 2–3 gói. Làm sao CI chỉ kiểm gói bị đổi?</strong><br>Đ: Ma trận động: job đầu tính danh sách gói đổi (so với nhánh gốc), xuất JSON qua <code>outputs</code>; job sau dùng <code>matrix: goi: &#36;{{ fromJSON(needs.x.outputs.goi) }}</code>; chặn trường hợp danh sách rỗng bằng <code>if:</code>. Nhớ trần 256 job mỗi run.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn muốn test trên Node 20 và 22, trên Ubuntu và Windows, thêm một nhánh thử Node 24 được phép hỏng, và không muốn một nhánh hỏng xoá kết quả của nhánh khác.</p><ol>
<li>Viết ma trận <code>os: [ubuntu-latest, windows-latest]</code>, <code>node: [20, 22]</code>, <code>fail-fast: false</code>; mỗi nhánh chạy <code>echo '&#36;{{ toJSON(matrix) }}'</code>. Trước khi push, viết ra giấy số job và tên từng job.</li>
<li>Thêm <code>include: [{ os: ubuntu-latest, node: 24, thu-nghiem: true }]</code> và <code>continue-on-error: &#36;{{ matrix.thu-nghiem == true }}</code>; cho nhánh có <code>thu-nghiem</code> chạy <code>exit 1</code>.</li>
<li>Thêm <code>exclude: [{ os: windows-latest, node: 20 }]</code>. Đoán lại số job, push, so với tab Actions.</li>
<li>Đổi <code>fail-fast</code> thành <code>true</code> và cho nhánh <code>ubuntu, 20</code> <code>sleep 5 &amp;&amp; exit 1</code>, các nhánh khác <code>sleep 60</code>. Push và đếm nhánh cancelled.</li>
<li>Viết một job <code>liet-ke</code> xuất <code>["a","b","c"]</code> qua <code>outputs</code> và một job ma trận <code>fromJSON</code> theo nó; in <code>&#36;{{ strategy.job-index }}</code>.</li></ol>
<p><strong>Đạt khi:</strong> số job bạn đoán ở bước 1 và 3 khớp với thực tế (4 ở bước 1; 4 ở bước 3 — include thêm một tổ hợp mới, exclude bớt một); nhánh thử nghiệm đỏ mà run vẫn xanh; ở bước 4 có đúng một failure và các nhánh còn lại cancelled; bước 5 tạo đúng ba job với <code>job-index</code> 0, 1, 2.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Matrix (ma trận)</span><span class="v">Vòng lặp trên định nghĩa job: mỗi tổ hợp giá trị thành một job thật trên một máy thật. Tối đa 256 job/run.</span></div>
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Gắn thêm khoá vào tổ hợp có sẵn nếu không ghi đè giá trị gốc; không thì thêm tổ hợp mới. Xử lý SAU exclude.</span></div>
  <div class="kv"><span class="k"><code>exclude</code></span><span class="v">Gỡ các tổ hợp khớp đủ các khoá ghi trong mục.</span></div>
  <div class="kv"><span class="k"><code>fail-fast</code></span><span class="v">Mặc định <code>true</code>: một nhánh hỏng thì huỷ các nhánh đang chạy/đang chờ của ma trận đó.</span></div>
  <div class="kv"><span class="k"><code>max-parallel</code></span><span class="v">Số nhánh tối đa chạy cùng lúc của một ma trận; không đổi tổng phút máy.</span></div>
  <div class="kv"><span class="k">Dynamic matrix (ma trận động)</span><span class="v">Ma trận lấy danh sách từ output của job trước qua <code>fromJSON</code>.</span></div>
  <div class="kv"><span class="k"><code>strategy.job-index</code> / <code>job-total</code></span><span class="v">Vị trí (đếm từ 0) và tổng số nhánh — dùng để chia việc thành N phần.</span></div>
  <div class="kv"><span class="k">Concurrency limit (trần chạy đồng thời)</span><span class="v">Số job chạy cùng lúc của cả tài khoản: Free 20, riêng macOS 5.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ma trận nở theo thứ tự: tích chéo → <code>exclude</code> → <code>include</code>. Đo: 2×3 − 1 + 1 = 6 job; include khớp tổ hợp có sẵn chỉ GẮN khoá, không khớp thì thêm tổ hợp mới.</li>
<li>Ma trận động: job trước xuất JSON qua <code>outputs</code>, job sau <code>fromJSON</code>; chặn danh sách rỗng; trần 256 job.</li>
<li><code>fail-fast</code> mặc định <code>true</code>: đo thật, nhánh 90s bị huỷ sau 20s và job kết thúc không có kết quả; <code>false</code> thì hai nhánh kia xong xanh.</li>
<li><code>continue-on-error</code> theo khoá ma trận cho riêng một nhánh được hỏng mà không kích hoạt fail-fast.</li>
<li><code>max-parallel</code> xếp nhánh chạy lần lượt (đo: 3 nhánh nối đuôi) — dùng khi tranh tài nguyên ngoài, không phải để tiết kiệm.</li>
<li>Trần tài khoản: Free 20 job cùng lúc, macOS 5 — ma trận lớn cộng nhiều PR sẽ xếp hàng.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Running variations of jobs in a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs — luật tích chéo, ngữ nghĩa <code>include</code> và <code>exclude</code> (gồm cả những chỗ bất ngờ nơi <code>include</code> THÊM khoá vào các tổ hợp có sẵn), và trần 256 job cho mỗi lần chạy workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.strategy.fail-fast và max-parallel</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast — giá trị mặc định, và tương tác với <code>continue-on-error</code> ở mức bước, thứ cho phép dung thứ một nhánh trong khi không dung thứ những nhánh khác.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — mặc định 360 phút áp dụng khi bạn không đặt gì, và thời hạn riêng ở mức từng bước.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — thành công một phần là một KẾT QUẢ, không phải một cú hỏng</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng lập luận ấy trong một cuộc deploy: một lượt triển khai tới được hai trong ba nút là thông tin bạn muốn giữ, và một đường ống vứt nó đi ngay lỗi đầu tiên thì khó lập luận hơn một đường ống không vứt.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'ga-2-6-kiem-tra',
      type: 'QUIZ',
      description: 'Mười câu tình huống trên số đo của chương: tệp không qua được ranh giới job, nhãn gõ sai xếp hàng mãi, needs chỉ thấy cha trực tiếp, Windows nuốt mã thoát giữa script, pipefail, outcome/conclusion, !cancelled(), ma trận 6 job, fail-fast, và 85% hoá đơn macOS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>What Chapter 2 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Every answer comes out of a real run — on this site&#39;s release workflow or on the sandbox branch <code>ch02-job</code> — and every explanation says why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can prove with a log that two jobs chained by <code>needs:</code> run on two different machines, and name the four channels that do cross a job boundary.</li>
<li>I can read a job graph with ✓ ✗ ⊘ and say which jobs run under <code>success()</code>, <code>failure()</code>, <code>always()</code>, <code>!cancelled()</code> and <code>cancelled()</code>.</li>
<li>I can pass a value from one job to another through <code>$GITHUB_OUTPUT</code>, <code>outputs:</code> and <code>needs</code>, and explain why a grandparent&#39;s output is empty.</li>
<li>I know the default shell on each platform, why a pipeline or a Windows script can fail and stay green, and what <code>shell: bash</code> fixes.</li>
<li>I can predict the job count of a matrix with <code>include</code> and <code>exclude</code>, and choose <code>fail-fast</code>, <code>continue-on-error</code> and <code>max-parallel</code> for a situation.</li>
<li>I can explain why a job waits in "queued" with no log, and what a macOS leg costs in a private repository.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Chương 2 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Mọi đáp án ra từ một lần chạy thật — của workflow phát hành trên chính kho của trang này hoặc của nhánh sân tập <code>ch02-job</code> — và mỗi lời giải thích nói vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chứng minh được bằng log rằng hai job nối bằng <code>needs:</code> chạy trên hai cỗ máy khác nhau, và kể được bốn kênh ĐI QUA được ranh giới job.</li>
<li>Tôi đọc được một đồ thị job có ✓ ✗ ⊘ và nói được job nào chạy với <code>success()</code>, <code>failure()</code>, <code>always()</code>, <code>!cancelled()</code> và <code>cancelled()</code>.</li>
<li>Tôi chuyển được một giá trị giữa hai job qua <code>$GITHUB_OUTPUT</code>, <code>outputs:</code> và <code>needs</code>, và giải thích được vì sao output của job "ông" thì rỗng.</li>
<li>Tôi biết shell mặc định trên từng nền tảng, vì sao một đường ống hay một script Windows hỏng mà vẫn xanh, và <code>shell: bash</code> sửa được gì.</li>
<li>Tôi đoán đúng số job của một ma trận có <code>include</code> và <code>exclude</code>, và chọn được <code>fail-fast</code>, <code>continue-on-error</code>, <code>max-parallel</code> cho từng tình huống.</li>
<li>Tôi giải thích được vì sao một job đứng "queued" mà không có log, và một nhánh macOS tốn bao nhiêu ở kho riêng tư.</li>
</ul>
</div>
${slide('ga-02', 31, 'Bảng tra nhanh Chương 2')}
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A job build runs npm run build, producing dist/. The job deploy has needs: build and its first step is ls dist. What happens?|||Job build chạy npm run build, tạo ra dist/. Job deploy có needs: build và bước đầu tiên là ls dist. Chuyện gì xảy ra?',
            options: [
              'It lists the build output, because needs: makes deploy run on the same runner after build|||Nó liệt kê được bản dựng, vì needs: khiến deploy chạy trên cùng runner sau build',
              'It fails with “No such file or directory” — deploy runs on a different machine; the files must travel as an artifact|||Nó hỏng với “No such file or directory” — deploy chạy trên một cỗ máy khác; tệp phải đi qua artifact',
              'It works only if both jobs use the same runs-on label|||Nó chỉ chạy được nếu hai job dùng cùng một nhãn runs-on',
              'It works the first time and fails on re-runs, when the cache has expired|||Nó chạy được lần đầu và hỏng khi chạy lại, lúc cache đã hết hạn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Every job gets its own runner; needs: only orders them. Measured: chuan-bi and dung had different hostnames and machine-ids, and dung could not see chuan-bi’s /tmp file. The tempting “same label” answer is wrong: three jobs with ubuntu-latest got three runner_ids.|||VI: Mỗi job một runner riêng; needs: chỉ sắp THỨ TỰ. Đo: chuan-bi và dung khác hostname, khác machine-id, và dung không thấy tệp /tmp của chuan-bi. Đáp án hấp dẫn “cùng nhãn” sai: ba job ubuntu-latest nhận ba runner_id khác nhau.',
          },
          {
            question: 'A job says runs-on: ubuntu-lastest (typo) and timeout-minutes: 5. What do you see?|||Một job ghi runs-on: ubuntu-lastest (gõ sai) và timeout-minutes: 5. Bạn thấy gì?',
            options: [
              'An “Invalid workflow file” error as soon as you push|||Lỗi “Invalid workflow file” ngay khi push',
              'The job falls back to ubuntu-latest and runs normally|||Job tự lùi về ubuntu-latest và chạy bình thường',
              'The job is cancelled after 5 minutes by timeout-minutes|||Job bị timeout-minutes huỷ sau 5 phút',
              'The job sits in “queued” with no log and no error; timeout-minutes does not count queue time|||Job đứng “queued”, không log, không lỗi; timeout-minutes không đếm thời gian xếp hàng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: GitHub treats an unknown label as a possible self-hosted runner and waits. Measured: still queued after 6m17s despite timeout-minutes: 5, until cancelled by hand. timeout-minutes only counts running time. actionlint catches the typo before the push.|||VI: GitHub coi nhãn lạ có thể là của runner tự host nên CHỜ. Đo: 6m17s vẫn queued dù timeout-minutes: 5, tới khi huỷ tay. timeout-minutes chỉ đếm lúc CHẠY. actionlint bắt lỗi này trước khi push.',
          },
          {
            question: 'Job report has needs: [test, deploy]. deploy itself needs version, which declares an output v. In report, ${{ needs.version.outputs.v }} prints…|||Job report có needs: [test, deploy]. deploy thì needs version, job khai output v. Trong report, ${{ needs.version.outputs.v }} in ra…',
            options: [
              'an empty string, with no error — the needs context only contains DIRECT dependencies|||chuỗi rỗng, không lỗi — ngữ cảnh needs chỉ chứa phụ thuộc TRỰC TIẾP',
              'the value of v, because version is an ancestor that has certainly finished|||giá trị của v, vì version là tổ tiên chắc chắn đã chạy xong',
              'an error that fails the job: property “version” is not defined|||một lỗi làm job hỏng: property “version” is not defined',
              'the value of v, but only if deploy re-declares it with the same name|||giá trị của v, nhưng chỉ khi deploy khai lại đúng tên đó',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured: bao-cao printed “chuan-bi (khong needs truc tiep): []”. GitHub gives an empty string; only actionlint reports “property is not defined”. Re-declaring in deploy would make it available as needs.deploy.outputs.v — not needs.version.|||VI: Đo: bao-cao in “chuan-bi (khong needs truc tiep): []”. GitHub trả chuỗi rỗng; chỉ actionlint báo “property is not defined”. Khai lại ở deploy thì nó thành needs.deploy.outputs.v — không phải needs.version.',
          },
          {
            question: 'On windows-2025, a step with no shell: runs node -e "process.exit(3)" then node -e "console.log("ok")". Result?|||Trên windows-2025, một bước không ghi shell: chạy node -e "process.exit(3)" rồi node -e "console.log("ok")". Kết quả?',
            options: [
              'Red with exit code 3, like on Linux|||Đỏ với mã 3, giống Linux',
              'Red with exit code 1, because PowerShell wraps every error|||Đỏ với mã 1, vì PowerShell bọc mọi lỗi',
              'Green: the second line runs, and pwsh takes the exit code of the LAST command|||Xanh: dòng thứ hai vẫn chạy, và pwsh lấy mã thoát của lệnh CUỐI',
              'It never starts: node is not on PATH in PowerShell|||Không chạy nổi: node không có trong PATH của PowerShell',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: Linux and macOS (bash -e) failed with 3; Windows printed the second line and outcome=success. $ErrorActionPreference="stop" stops on PowerShell errors, not on an external program exiting non-zero. Fix: defaults.run.shell: bash.|||VI: Đo: Linux và macOS (bash -e) đỏ mã 3; Windows in dòng thứ hai và outcome=success. $ErrorActionPreference="stop" chỉ dừng lỗi của lệnh PowerShell, không dừng chương trình ngoài thoát khác 0. Sửa: defaults.run.shell: bash.',
          },
          {
            question: 'On Linux, a step with no shell: runs npm test | tee test.log, and the tests fail. What is the step’s status, and what one line fixes it?|||Trên Linux, một bước không ghi shell: chạy npm test | tee test.log, và test hỏng. Bước có trạng thái gì, và một dòng nào sửa được?',
            options: [
              'Red — set -e stops on any failing command|||Đỏ — set -e dừng ở mọi lệnh hỏng',
              'Red, but only after tee finishes writing the log|||Đỏ, nhưng chỉ sau khi tee ghi xong log',
              'Green — the default is bash -e without pipefail; add shell: bash (which adds -o pipefail)|||Xanh — mặc định là bash -e không có pipefail; thêm shell: bash (nó thêm -o pipefail)',
              'Green — tee always hides errors; replace it with > test.log|||Xanh — tee luôn giấu lỗi; thay bằng > test.log',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured on a real runner: the same pipeline was green under “bash -e {0}” and red (127) under “bash --noprofile --norc -e -o pipefail {0}”. set -e only sees the pipeline’s exit code, which is the LAST command’s. Replacing tee works but loses the live log; pipefail is the general fix.|||VI: Đo trên runner thật: cùng một ống xanh dưới “bash -e {0}” và đỏ (127) dưới “bash --noprofile --norc -e -o pipefail {0}”. set -e chỉ thấy mã thoát của cả ống, tức của lệnh CUỐI. Bỏ tee thì được nhưng mất log trực tiếp; pipefail là cách sửa chung.',
          },
          {
            question: 'Step 2 has continue-on-error: true and fails with 127. Step 3 has if: failure(). Nothing else has failed. Step 3…|||Bước 2 có continue-on-error: true và hỏng với 127. Bước 3 có if: failure(). Chưa có gì khác hỏng. Bước 3…',
            options: [
              'is skipped: a forgiven step counts as success for status functions (outcome=failure, conclusion=success)|||bị skip: bước được tha tính là thành công với các hàm trạng thái (outcome=failure, conclusion=success)',
              'runs, because step 2’s outcome is failure|||chạy, vì outcome của bước 2 là failure',
              'runs, and the job turns red|||chạy, và job chuyển đỏ',
              'is cancelled together with the rest of the job|||bị huỷ cùng phần còn lại của job',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured: step 7 (if: failure()) after the forgiven step was skipped; failure() only fired after an unforgiven exit 7. To react to the forgiven failure, test steps.X.outcome == "failure" explicitly (X = the step id).|||VI: Đo: bước 7 (if: failure()) sau bước được tha bị skip; failure() chỉ bật sau cú exit 7 không được tha. Muốn phản ứng với cú hỏng được tha thì kiểm rõ steps.X.outcome == "failure" (X là id của bước).',
          },
          {
            question: 'You want a job that uploads the test report after success AND after failure, but NOT when someone cancels the run. Which condition?|||Bạn muốn một job tải báo cáo test lên sau khi thành công VÀ sau khi hỏng, nhưng KHÔNG chạy khi có người huỷ run. Điều kiện nào?',
            options: [
              'if: always()|||if: always()',
              'if: failure() || success()  — which is the same as no condition|||if: failure() || success() — tương đương không ghi gì',
              'if: github.event_name == "push" — success() is not added when you write your own condition|||if: github.event_name == "push" — success() không được thêm khi bạn tự viết điều kiện',
              'if: ${{ !cancelled() }}|||if: ${{ !cancelled() }}',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured with gh run cancel: always() ran after the cancel, !cancelled() did not. always() is the tempting answer but also runs on cancel. And any condition without a status function is implicitly success() && …, so option C skips after a failure.|||VI: Đo bằng gh run cancel: always() chạy sau khi huỷ, !cancelled() thì không. always() là đáp án hấp dẫn nhưng chạy cả khi huỷ. Và mọi điều kiện không có hàm trạng thái đều ngầm là success() && …, nên phương án C bị skip khi có hỏng.',
          },
          {
            question: 'os: [ubuntu-24.04, ubuntu-24.04-arm], node: [20, 22, 24], exclude: [{os: ubuntu-24.04-arm, node: 24}], include: [{node: 24, thu-nghiem: true}, {os: ubuntu-24.04, node: 25}]. How many jobs?|||os: [ubuntu-24.04, ubuntu-24.04-arm], node: [20, 22, 24], exclude: [{os: ubuntu-24.04-arm, node: 24}], include: [{node: 24, thu-nghiem: true}, {os: ubuntu-24.04, node: 25}]. Bao nhiêu job?',
            options: [
              '7 — each include entry adds one job|||7 — mỗi mục include thêm một job',
              '6 — 2×3 = 6, exclude removes 1, the node-24 entry only adds a key to an existing combination, the node-25 entry adds 1|||6 — 2×3 = 6, exclude bỏ 1, mục node 24 chỉ gắn khoá vào tổ hợp có sẵn, mục node 25 thêm 1',
              '5 — include cannot add values that are not in the original lists|||5 — include không thêm được giá trị không có trong danh sách gốc',
              '8 — include runs before exclude, so the arm/24 combination comes back and gets the key|||8 — include chạy trước exclude, nên tổ hợp arm/24 quay lại và được gắn khoá',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured (run 35989945581): exactly 6 jobs, and (ubuntu-24.04, 24) carried thu-nghiem: true. exclude is applied before include, and include only extends remaining combinations when it overwrites no original value; otherwise it creates a new one.|||VI: Đo (run 35989945581): đúng 6 job, và (ubuntu-24.04, 24) mang thu-nghiem: true. exclude áp dụng trước include, và include chỉ gắn thêm vào tổ hợp còn lại khi không ghi đè giá trị gốc; không thì tạo tổ hợp mới.',
          },
          {
            question: 'A matrix with the default fail-fast has three legs sleeping 5, 60 and 90 seconds; the 5-second leg fails. What does the run end with?|||Một ma trận với fail-fast mặc định có ba nhánh ngủ 5, 60 và 90 giây; nhánh 5 giây hỏng. Lần chạy kết thúc với gì?',
            options: [
              '1 failure and 2 cancelled legs with no results — the 90-second leg was killed after about 20 seconds|||1 failure và 2 nhánh cancelled không có kết quả — nhánh 90 giây bị giết sau khoảng 20 giây',
              '1 failure and 2 successes — fail-fast only stops legs that have not started yet|||1 failure và 2 success — fail-fast chỉ chặn nhánh chưa bắt đầu',
              '3 failures — fail-fast marks every leg as failed|||3 failure — fail-fast đánh dấu mọi nhánh là hỏng',
              '1 failure; the other two are retried automatically|||1 failure; hai nhánh kia được tự chạy lại',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: fail-fast defaults to true and cancels running AND queued legs. Measured: the 90s leg printed “The operation was canceled.” at 10:54:59, the 60s leg printed nothing; with fail-fast: false both finished green. Cancelled legs show “cancelled”, not “failure”.|||VI: fail-fast mặc định true, huỷ cả nhánh đang chạy lẫn đang chờ. Đo: nhánh 90s in “The operation was canceled.” lúc 10:54:59, nhánh 60s chưa in gì; với fail-fast: false cả hai xong xanh. Nhánh bị huỷ hiện “cancelled”, không phải “failure”.',
          },
          {
            question: 'The release run took Linux 241 s, Windows 323 s, macOS 437 s. In a PRIVATE repository at 09/2026 prices, what is the best first cost cut?|||Lần chạy phát hành mất Linux 241 s, Windows 323 s, macOS 437 s. Ở kho RIÊNG TƯ với giá 09/2026, cắt chi phí đầu tiên ở đâu là đúng nhất?',
            options: [
              'Speed up the Linux job, because it runs most often|||Tăng tốc job Linux, vì nó chạy nhiều nhất',
              'Move the Windows leg to Linux, because Windows is the slowest at npm ci|||Chuyển nhánh Windows sang Linux, vì Windows chậm nhất ở npm ci',
              'Keep only platform-dependent work on macOS: at $0.062/min it is about 85% of this run’s bill|||Chỉ giữ việc thật sự phụ thuộc nền tảng trên macOS: giá $0.062/phút nên nó chiếm khoảng 85% hoá đơn của run này',
              'Nothing: private repositories get the same free minutes as public ones|||Không cần: kho riêng tư được miễn phí như kho công khai',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Rounded up per job: Linux 5 min × $0.006 = $0.03, Windows 6 × $0.010 = $0.06, macOS 8 × $0.062 = $0.50 → macOS ≈ 85% while being 44% of the time. Windows is slow at npm ci but cheap per minute; public repositories are free, private ones are not.|||VI: Làm tròn theo job: Linux 5 phút × $0,006 = $0,03, Windows 6 × $0,010 = $0,06, macOS 8 × $0,062 = $0,50 → macOS ≈ 85% dù chỉ 44% thời gian. Windows chậm ở npm ci nhưng rẻ mỗi phút; kho công khai miễn phí, kho riêng tư thì không.',
          },
        ],
      },
    },
  ],
};
