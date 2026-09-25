import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 13 (MỚI, 09/2026): Runner của riêng bạn.
 * Nối tiếp bài 2.1 (máy mới mỗi job, gõ sai runs-on thì chờ) và 7.x (self-hosted đổi phép tính) — KHÔNG lặp lại.
 * Mọi log là run THẬT 24/09/2026 trên sân tập công khai github.com/cuonghoang1103/ga-san-tap, nhánh ch13-runner
 * (runner 2.337.0, ubuntu-24.04 image 20260920.314.1): 36074805297 · 36074652076 · 36074706877 · 36074652145 · 36074652000.
 * Job self-hosted (ch13-tu-host.yml) CHƯA chạy thật: phiên dựng bài không có Docker daemon, không có token đăng ký
 * runner (API cần quyền admin kho), và dispatch trả 404 vì tệp chưa có trên main — xem các chỗ CHAY-O-MAY.
 * Docs kiểm từ mã nguồn github/docs (commit f71cc2a, 24/09/2026); giá từ content/billing/reference/actions-runner-pricing.md
 * và mô tả REST API (rest-api-description) cùng ngày.
 */

const RUN = (id, t) => `<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/${id}" target="_blank" rel="noopener">${t || id}</a>`;

export default {
  title: 'Chapter 13 — Your own runners: self-hosted, containers & scaling|||Chương 13 — Runner của riêng bạn: self-hosted, container & mở rộng',
  slug: 'ga-ch13-runner',
  description: 'Runner làm việc thế nào (kéo việc qua một kết nối ra ngoài, nhật ký _diag, thư mục _work), tự dựng một runner ephemeral trong container, bảo mật self-hosted, container job và service Postgres, và cách mở rộng bằng ARC — mọi log là run thật trên sân tập.',
  sortOrder: 14,
  lessons: [

    /* ─────────────────────────── 13.0 ─────────────────────────── */
    {
      title: '13.0 — Chapter 13 slides: your own runners in pictures|||13.0 — Slide Chương 13: runner của riêng bạn bằng hình',
      slug: 'ga-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 27 slide của Chương 13: runner kéo việc về qua một kết nối ra ngoài, ba lớp tiến trình và nhật ký _diag của một runner thật, giá hosted so với self-hosted, ảnh runner ephemeral và ba lỗi đăng ký, máy sạch và máy bẩn, docker.sock trong container job, service Postgres và health-check, ARC và máy nhà làm runner build.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Slides</span>
<h2>The whole chapter in 27 slides</h2>
<p class="lead">Every chapter so far ran on machines GitHub lends you for the length of a job. This one opens the machine up — what the runner program does, where it keeps its files, what it logs — and then asks the question a team eventually asks: should some of these machines be ours? Skim the slides first; come back after the quiz to revise.</p>
<p>Slides 3–8 belong to Lesson 13.1 (how a runner works, prices, labels and groups), 9–14 to 13.2 (building an ephemeral runner in a container), 15–20 to 13.3 (security of self-hosted runners, container jobs and service containers), and 21–24 to 13.4 (scaling: ARC, autoscaling, the home build machine). The last three are the chapter&#39;s common mistakes, a cheat sheet and a 60-minute practice session. Every log on the slides is real: recorded on 24 September 2026 on GitHub-hosted runners (runner 2.337.0, <code>ubuntu-24.04</code> and <code>ubuntu-24.04-arm</code>) in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch13-runner</code>. One thing is deliberately marked as <em>not yet run</em>: registering an actual self-hosted runner needs an admin token and a Docker daemon that the session writing this chapter did not have. Slide 13 says exactly what is missing and which script does it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Slide</span>
<h2>Cả chương trong 27 slide</h2>
<p class="lead">Mọi chương tới giờ đều chạy trên những cỗ máy GitHub cho bạn mượn trong đúng thời gian một job. Chương này mở cỗ máy ấy ra — chương trình runner làm gì, cất tệp ở đâu, ghi nhật ký những gì — rồi hỏi câu mà một đội sớm muộn cũng hỏi: có nên để vài cỗ máy trong số đó là của mình không? Lướt bộ slide trước; làm xong bài kiểm tra thì quay lại đây để ôn.</p>
<p>Slide 3–8 thuộc Bài 13.1 (runner làm việc thế nào, giá, nhãn và nhóm), 9–14 thuộc 13.2 (dựng runner ephemeral trong container), 15–20 thuộc 13.3 (bảo mật runner self-hosted, container job và service container), 21–24 thuộc 13.4 (mở rộng: ARC, tự co giãn, máy nhà làm máy build). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 60 phút. Mọi log trên slide là THẬT: ghi ngày 24/09/2026 trên runner của GitHub (runner 2.337.0, <code>ubuntu-24.04</code> và <code>ubuntu-24.04-arm</code>) trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch13-runner</code>. Có đúng một phần được ghi rõ là <em>chưa chạy thật</em>: đăng ký một runner self-hosted thật cần token quyền admin và một Docker daemon mà phiên soạn chương này không có. Slide 13 ghi chính xác thiếu gì và kịch bản nào làm việc đó.</p>
</div>
${gallery('ga-13', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Runner kéo việc về'], [4, 'Ba lớp tiến trình, không cổng nghe'], [5, 'Nhật ký _diag'],
  [6, 'Thư mục _work'], [7, 'Hosted hay self-hosted: giá'], [8, 'runs-on, nhãn và nhóm'],
  [9, 'Vòng đời runner ephemeral'], [10, 'Ảnh runner'], [11, 'khoi-dong.sh'],
  [12, 'Ba lỗi đăng ký'], [13, 'Một buổi chạy thật trên Mac'], [14, 'Bền hay ephemeral'],
  [15, 'Kho public + self-hosted'], [16, 'Máy hosted sạch sau mỗi job'], [17, 'Log che, ps thì không'],
  [18, 'container: và docker.sock'], [19, 'services: Postgres'], [20, 'Không health-check'],
  [21, 'ARC'], [22, 'Ba cách tự co giãn'], [23, 'Máy nhà làm runner build'], [24, 'Khi nào đáng tự host'],
  [25, 'Sai lầm hay gặp'], [26, 'Bảng tra nhanh'], [27, 'Thực hành chương 13'],
])}
`,
    },

    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — How a runner works: pulling jobs, its processes, its logs, and what it costs|||13.1 — Runner làm việc thế nào: kéo việc về, tiến trình, nhật ký, và cái giá',
      slug: 'ga-13-1-runner-hoat-dong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Mở một runner thật ra xem: Listener giữ một kết nối HTTPS ra ngoài và nhận job trong 1 giây, Worker nhận nguyên văn script vào nhật ký _diag, thư mục _work nằm lại nếu máy còn sống; rồi so giá hosted, larger và self-hosted (09/2026), nhãn cộng dồn, nhóm runner và job chờ 24 giờ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>How a runner works: pulling jobs, its processes, its logs, and what it costs</h2>
<p class="lead">A runner is not a server GitHub connects to. It is a small program on a machine that opens <em>one outbound HTTPS connection</em> to GitHub, waits on it, and runs whatever job comes back. That single design decision explains why a laptop behind a home router can be a runner, why a typo in <code>runs-on</code> waits instead of failing, and why a self-hosted machine keeps everything the previous job left on it.</p>

<p>Lesson 2.1 established that every GitHub-hosted job gets a fresh machine, and Lesson 7 mentioned in one line that self-hosting "changes the arithmetic". This lesson opens the machine: the processes of the runner application, the files it writes, the log it keeps, the network connections it holds. All of it was measured on 24 September 2026 in the sandbox — workflow <code>ch13-ben-trong.yml</code>, run ${RUN(36074805297)}, one job on <code>ubuntu-24.04</code> (x64) and one on <code>ubuntu-24.04-arm</code>. Then we put numbers on the choice between GitHub's machines and yours.</p>

<h3>Pull, not push: how a job reaches a runner</h3>
${slide('ga-13', 3, 'A runner pulls work over an outbound connection; no inbound port is opened')}
<p>The runner application is open source (<code>github.com/actions/runner</code>) and ships as a tarball with two scripts you will meet in Lesson 13.2: <code>config.sh</code> registers the machine with a repository or organisation, and <code>run.sh</code> starts the long-running process. From then on the order of events is always the same:</p>
<ol>
<li><strong>The runner connects out.</strong> <code>Runner.Listener</code> opens a session with GitHub&#39;s Actions service over HTTPS on port 443 and <em>holds the request open</em> — a "long poll". Nothing on the machine listens for incoming connections.</li>
<li><strong>An event creates a run.</strong> A push, a pull request or a manual dispatch produces jobs, each with a <code>runs-on</code> value.</li>
<li><strong>GitHub matches labels.</strong> If an online, idle runner has every label the job asks for, the job is handed to it inside the connection the runner already holds. The docs add two timeouts: a runner that does not pick up an assigned job within <strong>60 seconds</strong> loses it and the job is re-queued; a job that finds no matching runner simply stays queued, and on self-hosted runners it is cancelled after <strong>24 hours</strong>.</li>
<li><strong>The Listener spawns a Worker.</strong> <code>Runner.Worker</code> receives the job description, runs the steps in the work directory, streams logs back, and exits when the job ends.</li>
</ol>
<p>Two practical consequences follow from the direction of that arrow. First, a runner needs only <strong>outbound</strong> access: the docs list HTTPS on port 443 to GitHub&#39;s domains and at least 70 kbit/s up and down — no port forwarding, no public IP, which is why a machine behind NAT at home works. Second, GitHub cannot "push" a job to a runner that is switched off; the job waits, and nothing turns red while it does.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "queued" is not an error.</strong> A self-hosted job whose runner is offline, or whose <code>runs-on</code> asks for a label no runner has, shows a yellow dot and no log for up to 24 hours. <code>timeout-minutes</code> does not help — it only counts running time, which Lesson 2.1 measured (still queued after 6 min 17 s with <code>timeout-minutes: 5</code>). When a job has no log at all, read its <code>runs-on</code> before anything else.</div>

<h3>Looking inside a real runner: three layers of processes, no listening port</h3>
${slide('ga-13', 4, 'A real runner: three layers of processes and no listening port')}
<p>The job <code>soi (ubuntu-24.04)</code> printed the process tree of its own machine, filtered to the runner:</p>
<div class="out">   1840       1 runner   01:06 /opt/hca/hosted-compute-agent
   1854    1840 root     01:06  \\_ sudo -n PROVJOBD_E2E=1 /tmp/provjobd1996634848
   1857    1854 root     01:06  |   \\_ /tmp/provjobd1996634848
   1869    1840 runner   00:04  \\_ /home/runner/actions-runner/cached/2.337.0/bin/Runner.Listener run
   1888    1869 runner   00:02      \\_ /home/runner/actions-runner/cached/2.337.0/bin/Runner.Worker spawnclient 142 145</div>
<ul>
<li><strong><code>Runner.Listener</code> is the long-lived half.</strong> On your own machine it runs for weeks. Here its elapsed time was <strong>4 seconds</strong>: GitHub started it only when this job was already waiting for it.</li>
<li><strong><code>Runner.Worker</code> is born for one job.</strong> Its parent is the Listener; the two numbers after <code>spawnclient</code> are the pipe handles they use to talk. When the job ends, the Worker exits.</li>
<li><strong><code>hosted-compute-agent</code> is GitHub&#39;s own layer</strong> — the machinery that provisions a clean VM per job. It had been alive for 1 minute 6 seconds: the machine was prepared <em>before</em> the job arrived, which is why Lesson 2.1 measured queue times of two or three seconds. The "Set up job" log of the same machine names it too: <code>Runner Image Provisioner · Hosted Compute Agent · Version: 20260828.587 · Azure Region: eastus2</code>. A self-hosted machine has only the bottom two lines of this tree.</li>
</ul>
<p>The network view confirms the direction of the arrow in the diagram above. Every established connection owned by the runner went <em>out</em> to port 443, and nothing listened:</p>
<div class="out">$ sudo ss -tnp state established | grep -i -E "Runner|dotnet"
[::ffff:10.1.0.230]:46716 [::ffff:20.209.178.193]:443
[::ffff:10.1.0.230]:53068 [::ffff:140.82.114.21]:443
[::ffff:10.1.0.230]:54106 [::ffff:140.82.114.22]:443
… 7 connections in total, all to port 443
$ sudo ss -tlnp | grep -i runner
(khong co — runner khong mo cong nao)</div>
<p>The arm64 job (<code>soi (ubuntu-24.04-arm)</code>) showed the same shape with one difference worth knowing when you read logs from both: its runner lives in <code>/home/runner/extracted/bin/</code> instead of <code>/home/runner/actions-runner/cached/2.337.0/bin/</code>. The image also carries two runner versions side by side (<code>cached/2.336.0</code> and <code>cached/2.337.0</code>), so a runner update does not require a new image on GitHub&#39;s side.</p>

<h3>The runner&#39;s own diary: the _diag directory</h3>
${slide('ga-13', 5, '_diag: from "Listening for Jobs" to a received job in one second')}
<p>Everything the runner does is also written to its diagnostic directory, <code>_diag</code>, next to the runner binaries. On this machine: <code>/home/runner/actions-runner/cached/2.337.0/_diag</code>, containing <code>Runner_20260924-235138-utc.log</code> (the Listener) and <code>Worker_20260924-235140-utc.log</code> (the Worker). A filtered read of both, in the same run:</p>
<div class="out">[2026-09-24 23:51:38Z INFO Runner] Using BrokerMessageListener
[2026-09-24 23:51:38Z INFO BrokerMessageListener] Attempt to create session.
[2026-09-24 23:51:38Z INFO BrokerMessageListener] Connecting to the Broker Server...
[2026-09-24 23:51:39Z INFO BrokerMessageListener] Session created.
[2026-09-24 23:51:39Z INFO Terminal] WRITE LINE: 2026-09-24 23:51:39Z: Listening for Jobs
[2026-09-24 23:51:39Z INFO BrokerMessageListener] Acknowledging runner request 'eade6ae5-…'.
[2026-09-24 23:51:39Z INFO JobDispatcher] Job request 0 for plan 1519cd73-… job eade6ae5-… received.
[2026-09-24 23:51:39Z INFO BrokerMessageListener] Received job status event. JobState: Busy
--- Worker_20260924-235140-utc.log
[2026-09-24 23:51:40Z INFO Worker] Waiting to receive the job message from the channel.
[2026-09-24 23:51:40Z INFO ProcessChannel] Receiving message of length 26092, with hash '&lt;...&gt;'
[2026-09-24 23:51:40Z INFO Worker] Job message:
              "lit": "d=$(sudo find /home/runner /opt -maxdepth 5 -type d -name _diag …
  "messageType": "RunnerJobRequest",</div>
<p>Read it as a timeline. At 23:51:38 the Listener creates a session with the "Broker"; at 23:51:39 it prints <code>Listening for Jobs</code> — the line you will see in your own terminal when you run <code>run.sh</code> — and in the <em>same second</em> a job request arrives. One second later the Worker receives a 26 KB message: the entire job, including the literal text of every <code>run:</code> script (that <code>"lit"</code> field is the very step that was printing this log).</p>
<p>Keep two facts from this. <strong>For debugging:</strong> when a self-hosted job misbehaves before its first step, the answer is in <code>_diag</code>, not in the Actions tab — a Listener that cannot create a session, a job that was received but never started. <strong>For security:</strong> the Worker log stores the job&#39;s scripts on the runner&#39;s disk, and on your own machine nothing deletes it. Lesson 13.3 returns to this, and to the docs&#39; advice that ephemeral runners should ship these logs somewhere else before the machine disappears.</p>

<h3>The work directory: what a job leaves on the disk</h3>
${slide('ga-13', 6, 'The _work directory stays for the next job if the machine survives')}
<p>The step <code>Thu muc cua runner</code> printed where a job lives:</p>
<div class="out">RUNNER_WORKSPACE=/home/runner/work/ga-san-tap
GITHUB_WORKSPACE=/home/runner/work/ga-san-tap/ga-san-tap
RUNNER_TEMP=/home/runner/work/_temp
RUNNER_TOOL_CACHE=/opt/hostedtoolcache
--- ls /home/runner/work
_PipelineMapping  _actions  _temp  ga-san-tap
--- ls _temp
1c8b5701-9a50-43e1-9d71-db070b313b67.sh   (475 bytes)
7366bd6a-4373-4e4b-b32d-6cd97afb526a.sh   (327 bytes)
94349770-04b6-45ba-b54e-f2c3a07019dd.sh   (146 bytes)
_github_workflow  _runner_file_commands</div>
<table>
<thead><tr><th>Path</th><th>What it holds</th><th>On a self-hosted runner</th></tr></thead>
<tbody>
<tr><td><code>_work/&lt;repo&gt;/&lt;repo&gt;</code></td><td><code>GITHUB_WORKSPACE</code>: your checkout and everything the build wrote</td><td>stays; <code>actions/checkout</code> cleans it at the start of the next job by default, but files your steps wrote elsewhere do not</td></tr>
<tr><td><code>_work/_temp</code></td><td><code>RUNNER_TEMP</code>: one <code>&lt;uuid&gt;.sh</code> per <code>run:</code> step, the files behind <code>GITHUB_OUTPUT</code>/<code>GITHUB_ENV</code>, the event payload</td><td>the docs say it is emptied at the start and end of each job</td></tr>
<tr><td><code>_work/_actions</code></td><td>every action downloaded by <code>uses:</code></td><td>stays and is reused</td></tr>
<tr><td><code>_work/_PipelineMapping</code></td><td>which repository maps to which directory</td><td>stays</td></tr>
<tr><td><code>RUNNER_TOOL_CACHE</code></td><td>Node, Python… installed by <code>setup-*</code> actions</td><td>stays — the main reason self-hosted jobs start faster</td></tr>
<tr><td><code>_diag/</code></td><td>Listener and Worker logs</td><td>accumulates</td></tr>
</tbody>
</table>
<p>Those three <code>.sh</code> files are worth a second look: they are the <code>run:</code> blocks of the three steps that had executed so far, written to disk and then executed by <code>bash -e</code>. On a GitHub machine they vanish with the VM. On a machine you own, whatever the <em>next</em> job can read in <code>_work</code>, <code>/tmp</code> and the home directory is decided only by who else runs jobs there — the whole of Lesson 13.3.</p>

<h3>GitHub-hosted, larger, self-hosted: what each one costs</h3>
${slide('ga-13', 7, 'Hosted or self-hosted: pay per minute, or pay with your own work')}
<p>The prices below come from GitHub&#39;s billing reference as of 09/2026. Minutes are rounded <strong>up to the whole minute per job</strong>, and a reusable workflow is always billed to the caller.</p>
<table>
<thead><tr><th>Runner</th><th>Public repository</th><th>Private repository</th></tr></thead>
<tbody>
<tr><td>Standard GitHub-hosted (<code>ubuntu-latest</code>, <code>windows-latest</code>, <code>macos-latest</code>…)</td><td><strong>free</strong>, and a bigger machine: 4 CPU / 16 GB for Linux x64</td><td>included minutes first (2,000/month on Free, 3,000 on Pro), then Linux 2-core $0.006/min, Linux arm64 2-core $0.005, Windows $0.010, macOS $0.062; a 1-core Linux (<code>ubuntu-slim</code>) is $0.002</td></tr>
<tr><td>Larger runners (GitHub-hosted, configured by an org)</td><td><strong>not free</strong>, even for public repositories</td><td>no included minutes; e.g. Linux 4-core $0.012, 8-core $0.022, 16-core $0.042, up to 96-core $0.252; GPU Linux $0.052</td></tr>
<tr><td>Self-hosted</td><td>free as far as Actions is concerned</td><td>free as far as Actions is concerned</td></tr>
</tbody>
</table>
<p>"Free" in the last row is the most misleading word in the table. GitHub does not charge minutes, but the machine, its electricity, its network and — above all — the person who patches its operating system and updates the runner are yours. The docs are strict about the last part: automatic updates happen when a job is assigned or within a week of a release, and if you turn them off, you must update within <strong>30 days</strong> of a new version or GitHub stops sending jobs to the runner.</p>
<p>Put numbers on it for a private repository. A team that burns 3,000 Linux minutes and 2,000 Windows minutes beyond its allowance pays $18 + $20 = $38 for the month — the same worked example GitHub&#39;s billing page uses. A spare machine running all month costs more than that in electricity and attention unless it does something the hosted runner cannot: more RAM than 16 GB, a GPU, access to a private network, a warm Docker cache worth minutes per build, or hardware you already own and pay for. For a public repository the calculation is even simpler: standard runners cost nothing, and — as 13.3 explains — a self-hosted runner on a public repository is a security problem, not a saving.</p>

<table>
<thead><tr><th></th><th>GitHub-hosted</th><th>Self-hosted</th></tr></thead>
<tbody>
<tr><td>Clean machine per job</td><td>yes, destroyed after the job</td><td>no, unless you build it that way (13.2)</td></tr>
<tr><td>Warm caches</td><td>no — download every time</td><td>yes — tool cache, Docker layers, <code>node_modules</code> survive</td></tr>
<tr><td>Reaches your LAN / VPS / database</td><td>no (larger runners can join an Azure private network)</td><td>yes, it is already inside</td></tr>
<tr><td>Scales with demand</td><td>automatically</td><td>only if you build autoscaling (13.4)</td></tr>
<tr><td>Maximum job length</td><td>6 hours</td><td>5 days</td></tr>
<tr><td>Maintenance</td><td>GitHub&#39;s</td><td>yours: OS patches, runner updates, disk space, logs</td></tr>
</tbody>
</table>

<h3>runs-on, labels and runner groups</h3>
${slide('ga-13', 8, 'runs-on: labels add up; nobody matching means waiting up to 24 hours')}
<p>A job chooses a runner only by labels and, in organisations, by group:</p>
<pre><code class="language-yaml">runs-on: ubuntu-24.04                        # one GitHub-hosted label
runs-on: [self-hosted, linux, x64, gpu]      # a runner must have ALL four
runs-on:
  group: nha-build                           # a runner group (organisations)
  labels: [self-hosted, ch13-tam-thoi]       # ...and these labels inside it</code></pre>
<ul>
<li><strong>Labels are cumulative.</strong> A list means "has every one of these", not "any of these". A self-hosted runner gets three default labels when it registers — <code>self-hosted</code>, the OS (<code>Linux</code>) and the architecture (<code>X64</code>) — plus whatever you pass with <code>--labels</code>; <code>--no-default-labels</code> removes the three. The <code>config.sh --help</code> output in 13.2 prints exactly this.</li>
<li><strong>Give each purpose its own label.</strong> <code>runs-on: self-hosted</code> alone means "any of my runners", which is how a job meant for the build box ends up on the machine that holds production secrets. This chapter&#39;s sandbox runner uses the label <code>ch13-tam-thoi</code> and exactly one workflow asks for it.</li>
<li><strong>Runner groups are an organisation feature</strong> (on GitHub.com, organisations on the Team plan and above). A group is a security boundary: it lists which repositories may send jobs to its runners, and by default a group is open only to <em>private</em> repositories. A personal repository — like the sandbox, or a student&#39;s own account — has no groups; its runners are attached straight to the repository.</li>
<li><strong>Tell actionlint about your labels.</strong> Linting <code>ch13-tu-host.yml</code> without configuration printed <code>label "ch13-tam-thoi" is unknown … if it is a custom label for self-hosted runner, set list of labels in actionlint.yaml config file [runner-label]</code>. The sandbox fixes it with a four-line <code>.github/actionlint.yaml</code> (<code>self-hosted-runner: labels: [ch13-tam-thoi]</code>) — and in exchange actionlint now catches a mistyped label <em>before</em> the job sits in a queue for a day.</li>
</ul>

<h3>Run it step by step: look inside your own runner</h3>
<ol>
<li>In a test repository, create <code>.github/workflows/soi-runner.yml</code> with <code>on: push</code> and one job on <code>ubuntu-24.04</code>.</li>
<li>Add a step that prints <code>$RUNNER_NAME</code>, <code>$RUNNER_ENVIRONMENT</code>, <code>$ImageOS</code>, <code>$ImageVersion</code>, <code>nproc</code> and <code>free -g</code>.</li>
<li>Add a step: <code>ps -eo pid,ppid,user,etime,args --forest | grep -E "Runner\\.(Listener|Worker)|hosted" | grep -v grep</code>.</li>
<li>Add a step: <code>sudo ss -tnp state established | grep -i runner</code> and <code>sudo ss -tlnp | grep -i runner || echo "no listening port"</code>.</li>
<li>Add a step that finds <code>_diag</code> under <code>/home/runner</code> (<code>sudo find /home/runner -maxdepth 5 -type d -name _diag</code>) and greps the Runner log for <code>Listening for Jobs</code> and <code>Job request</code>. Keep the <code>find</code> narrow: the first version of the sandbox workflow searched <code>/</code> and had to be cancelled by hand after several minutes.</li>
<li>Push, open the run, and compare the job&#39;s <code>created_at</code> and <code>started_at</code> in the API (<code>gh api repos/OWNER/REPO/actions/runs/RUN_ID/jobs</code>) with the time on the <code>Listening for Jobs</code> line.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Our self-hosted runner sits behind a corporate firewall with no inbound ports. How does it receive jobs?</strong><br>A: The runner connects out. <code>Runner.Listener</code> opens an HTTPS session to GitHub on port 443 and long-polls; jobs come back on that connection. The machine needs outbound access to GitHub&#39;s domains only. If the firewall inspects TLS or allow-lists hosts, <code>./run.sh --check</code> tests each required endpoint.</p>
<p><strong>Q: A job has been "Queued" for twenty minutes with no log. What do you check?</strong><br>A: That a runner with <em>all</em> the labels in <code>runs-on</code> exists, is online and idle; that the repository may use its group; that the runner has not fallen more than 30 days behind on updates; then concurrency limits. A missing match never fails immediately — on self-hosted runners it is cancelled after 24 hours.</p>
<p><strong>Q: Self-hosted runners are free. Why not use them for everything?</strong><br>A: The minutes are free; the machine is not. You own patching, runner updates, disk, logs, capacity at peak times, and isolation between jobs, which GitHub-hosted runners give you by destroying the VM. They are worth it for things hosted runners cannot do — private network access, special hardware, warm caches for heavy builds — and almost never for public repositories.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a colleague says "the runner is a server that GitHub SSHes into". Prove or disprove it from a run in your own repository.</p><ol>
<li>Do the six steps of "Run it step by step" above in your repository (or copy <code>.github/workflows/ch13-ben-trong.yml</code> from the sandbox branch <code>ch13-runner</code>).</li>
<li>From the process tree, write down the elapsed time of <code>Runner.Listener</code> and of <code>Runner.Worker</code>, and say which one would be weeks old on a machine you own.</li>
<li>From <code>ss</code>, count the runner&#39;s connections and their destination ports; note whether anything listens.</li>
<li>From <code>_diag</code>, copy the <code>Listening for Jobs</code> and <code>Job request … received</code> lines and compute the gap.</li>
</ol><p><strong>Done when:</strong> your run shows a Listener → Worker tree, only outbound connections to port 443, no listening port, and a <code>_diag</code> timeline; and you can explain in two sentences why that disproves the "GitHub connects in" idea.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">runner (máy chạy)</span><span class="v">the <code>actions/runner</code> program plus the machine it runs on; it executes the jobs of a workflow</span></div>
<div class="kv"><span class="k"><code>Runner.Listener</code></span><span class="v">the long-lived process: holds the session with GitHub and waits for jobs</span></div>
<div class="kv"><span class="k"><code>Runner.Worker</code></span><span class="v">a process started for one job; runs its steps and exits</span></div>
<div class="kv"><span class="k">long poll (chờ kéo dài)</span><span class="v">an outbound request held open until the server has something to say — how a runner receives jobs without an open port</span></div>
<div class="kv"><span class="k"><code>_diag</code></span><span class="v">the runner&#39;s diagnostic logs: <code>Runner_*.log</code> and <code>Worker_*.log</code>, including the job message</span></div>
<div class="kv"><span class="k"><code>_work</code></span><span class="v">the work directory: workspace, <code>_temp</code>, downloaded actions; persists on a self-hosted machine</span></div>
<div class="kv"><span class="k">label (nhãn)</span><span class="v">a tag on a runner; <code>runs-on</code> lists labels and a runner must have all of them</span></div>
<div class="kv"><span class="k">runner group (nhóm runner)</span><span class="v">an organisation-level set of runners with a list of repositories allowed to use it</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A runner pulls jobs: the Listener keeps one outbound HTTPS connection to GitHub; nothing listens on the machine.</li>
<li>Measured: the Listener printed <code>Listening for Jobs</code> and received the job in the same second; the Worker got the whole job, scripts included, 1 second later.</li>
<li><code>_diag</code> is where a runner explains itself — and where job scripts end up on disk.</li>
<li><code>_work</code>, tool cache and <code>_diag</code> survive between jobs on a self-hosted machine; <code>_temp</code> does not.</li>
<li>Standard hosted runners are free for public repositories; private ones pay $0.006/min for Linux after the allowance; larger runners are never free; self-hosted costs no minutes but all your maintenance.</li>
<li><code>runs-on</code> labels add up; groups are an organisation boundary; an unmatched job waits (24 hours on self-hosted) instead of failing.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Self-hosted runners reference</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/self-hosted-runners — supported systems, routing precedence (60 seconds, 24 hours), communication requirements, automatic updates.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Actions runner pricing</span><span class="lc-sub">docs.github.com/en/billing/reference/actions-runner-pricing — per-minute rates for standard and larger runners (09/2026), rounding per job.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Runner groups</span><span class="lc-sub">docs.github.com/en/actions/concepts/runners/runner-groups — what a group restricts and who can create one.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Actions limits</span><span class="lc-sub">docs.github.com/en/actions/reference/limits — 6 hours per hosted job, 5 days per self-hosted job, 24 hours in the queue.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch13-runner</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner — <code>ch13-ben-trong.yml</code> and its run 36074805297.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; networking on a VPS</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — processes, ports and firewalls on the machine you would turn into a runner.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Runner làm việc thế nào: kéo việc về, tiến trình, nhật ký, và cái giá</h2>
<p class="lead">Runner (máy chạy) không phải một máy chủ để GitHub kết nối vào. Nó là một chương trình nhỏ trên một cỗ máy, mở <em>một kết nối HTTPS đi ra</em> tới GitHub, nằm chờ trên kết nối đó, và chạy bất cứ job nào được trả về. Chỉ một quyết định thiết kế ấy giải thích được vì sao một chiếc laptop sau router ở nhà làm runner được, vì sao gõ sai <code>runs-on</code> thì job chờ chứ không đỏ, và vì sao một máy self-hosted (tự lo) giữ lại mọi thứ job trước để lại.</p>

<p>Bài 2.1 đã chốt rằng mỗi job trên máy của GitHub được một cỗ máy mới, và Chương 7 nhắc một dòng rằng tự dựng runner "đổi phép tính". Bài này mở cỗ máy ra: tiến trình của ứng dụng runner, tệp nó ghi, nhật ký nó giữ, kết nối mạng nó mở. Tất cả được đo ngày 24/09/2026 trên sân tập — workflow <code>ch13-ben-trong.yml</code>, run ${RUN(36074805297)}, một job trên <code>ubuntu-24.04</code> (x64) và một job trên <code>ubuntu-24.04-arm</code>. Sau đó ta đặt con số vào lựa chọn giữa máy của GitHub và máy của bạn.</p>

<h3>Kéo, không phải đẩy: một job tới được runner bằng cách nào</h3>
${slide('ga-13', 3, 'Runner kéo việc về qua một kết nối đi ra; không mở cổng nào để nhận vào')}
<p>Ứng dụng runner là mã nguồn mở (<code>github.com/actions/runner</code>), phát hành dưới dạng một tệp nén có hai script bạn sẽ gặp ở Bài 13.2: <code>config.sh</code> đăng ký cỗ máy với một kho hoặc một tổ chức, còn <code>run.sh</code> khởi động tiến trình chạy lâu dài. Từ đó trở đi, thứ tự sự việc luôn như nhau:</p>
<ol>
<li><strong>Runner kết nối ra.</strong> <code>Runner.Listener</code> mở một phiên với dịch vụ Actions của GitHub qua HTTPS cổng 443 và <em>giữ yêu cầu mở</em> — kiểu "long poll" (chờ kéo dài). Trên máy không có gì nghe kết nối đi vào.</li>
<li><strong>Một sự kiện tạo ra run.</strong> Một lần push, một pull request hay một lần chạy tay sinh ra các job, mỗi job có một giá trị <code>runs-on</code>.</li>
<li><strong>GitHub so nhãn.</strong> Nếu có một runner đang online, đang rảnh và có đủ mọi nhãn job yêu cầu, job được trao cho nó ngay trong kết nối runner đang giữ. Docs thêm hai mốc thời gian: runner được giao job mà không nhận trong <strong>60 giây</strong> thì mất job, job quay lại hàng chờ; job không tìm được runner khớp thì cứ nằm trong hàng, và trên runner self-hosted nó bị huỷ sau <strong>24 giờ</strong>.</li>
<li><strong>Listener sinh ra một Worker.</strong> <code>Runner.Worker</code> nhận bản mô tả job, chạy các bước trong thư mục làm việc, gửi log ngược về, và thoát khi job xong.</li>
</ol>
<p>Hướng của mũi tên ấy kéo theo hai hệ quả thực tế. Một, runner chỉ cần truy cập <strong>đi ra</strong>: docs liệt kê HTTPS cổng 443 tới các tên miền của GitHub và tốc độ tối thiểu 70 kbit/s mỗi chiều — không cần mở cổng trên router, không cần IP công khai, nên một cỗ máy sau NAT ở nhà vẫn chạy được. Hai, GitHub không thể "đẩy" job tới một runner đang tắt; job nằm chờ, và trong lúc chờ không có gì chuyển đỏ.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "queued" không phải là lỗi.</strong> Một job self-hosted mà runner đang offline, hoặc <code>runs-on</code> xin một nhãn không runner nào có, sẽ hiện chấm vàng và không có dòng log nào, tới 24 giờ. <code>timeout-minutes</code> không cứu được — nó chỉ đếm thời gian ĐANG CHẠY, đúng như Bài 2.1 đã đo (vẫn queued sau 6 phút 17 giây với <code>timeout-minutes: 5</code>). Khi một job không có log nào, đọc <code>runs-on</code> của nó trước mọi thứ khác.</div>

<h3>Nhìn vào một runner thật: ba lớp tiến trình, không cổng nào nghe</h3>
${slide('ga-13', 4, 'Một runner thật: ba lớp tiến trình và không cổng nào nghe')}
<p>Job <code>soi (ubuntu-24.04)</code> in ra cây tiến trình của chính cỗ máy nó đang chạy, lọc theo runner:</p>
<div class="out">   1840       1 runner   01:06 /opt/hca/hosted-compute-agent
   1854    1840 root     01:06  \\_ sudo -n PROVJOBD_E2E=1 /tmp/provjobd1996634848
   1857    1854 root     01:06  |   \\_ /tmp/provjobd1996634848
   1869    1840 runner   00:04  \\_ /home/runner/actions-runner/cached/2.337.0/bin/Runner.Listener run
   1888    1869 runner   00:02      \\_ /home/runner/actions-runner/cached/2.337.0/bin/Runner.Worker spawnclient 142 145</div>
<ul>
<li><strong><code>Runner.Listener</code> là nửa sống lâu.</strong> Trên máy của bạn nó chạy hàng tuần. Ở đây thời gian sống của nó là <strong>4 giây</strong>: GitHub chỉ bật nó lên khi job này đã đứng chờ sẵn.</li>
<li><strong><code>Runner.Worker</code> sinh ra cho một job.</strong> Cha của nó là Listener; hai con số sau <code>spawnclient</code> là hai đầu ống (pipe) để chúng nói chuyện với nhau. Job xong, Worker thoát.</li>
<li><strong><code>hosted-compute-agent</code> là lớp riêng của GitHub</strong> — bộ máy dựng một VM sạch cho mỗi job. Nó đã sống 1 phút 6 giây: cỗ máy được chuẩn bị <em>trước</em> khi job tới, đó là lý do Bài 2.1 đo được thời gian xếp hàng chỉ hai, ba giây. Log "Set up job" của cùng cỗ máy cũng gọi tên nó: <code>Runner Image Provisioner · Hosted Compute Agent · Version: 20260828.587 · Azure Region: eastus2</code>. Máy self-hosted chỉ có hai dòng dưới cùng của cây này.</li>
</ul>
<p>Góc nhìn mạng xác nhận hướng mũi tên trong sơ đồ trên. Mọi kết nối đang mở của runner đều đi <em>ra</em> cổng 443, và không có gì nghe:</p>
<div class="out">$ sudo ss -tnp state established | grep -i -E "Runner|dotnet"
[::ffff:10.1.0.230]:46716 [::ffff:20.209.178.193]:443
[::ffff:10.1.0.230]:53068 [::ffff:140.82.114.21]:443
[::ffff:10.1.0.230]:54106 [::ffff:140.82.114.22]:443
… tổng cộng 7 kết nối, tất cả tới cổng 443
$ sudo ss -tlnp | grep -i runner
(khong co — runner khong mo cong nao)</div>
<p>Job arm64 (<code>soi (ubuntu-24.04-arm)</code>) cho cùng hình dạng, chỉ khác một điểm đáng biết khi bạn đọc log của cả hai: runner của nó nằm ở <code>/home/runner/extracted/bin/</code> thay vì <code>/home/runner/actions-runner/cached/2.337.0/bin/</code>. Ảnh máy cũng mang sẵn hai phiên bản runner cạnh nhau (<code>cached/2.336.0</code> và <code>cached/2.337.0</code>), nên GitHub cập nhật runner mà không phải dựng ảnh mới.</p>

<h3>Nhật ký riêng của runner: thư mục _diag</h3>
${slide('ga-13', 5, '_diag: từ "Listening for Jobs" tới lúc nhận job — một giây')}
<p>Mọi việc runner làm còn được ghi vào thư mục chẩn đoán <code>_diag</code>, cạnh các tệp chạy của runner. Trên cỗ máy này: <code>/home/runner/actions-runner/cached/2.337.0/_diag</code>, chứa <code>Runner_20260924-235138-utc.log</code> (của Listener) và <code>Worker_20260924-235140-utc.log</code> (của Worker). Đọc lọc cả hai, trong cùng run:</p>
<div class="out">[2026-09-24 23:51:38Z INFO Runner] Using BrokerMessageListener
[2026-09-24 23:51:38Z INFO BrokerMessageListener] Attempt to create session.
[2026-09-24 23:51:38Z INFO BrokerMessageListener] Connecting to the Broker Server...
[2026-09-24 23:51:39Z INFO BrokerMessageListener] Session created.
[2026-09-24 23:51:39Z INFO Terminal] WRITE LINE: 2026-09-24 23:51:39Z: Listening for Jobs
[2026-09-24 23:51:39Z INFO BrokerMessageListener] Acknowledging runner request 'eade6ae5-…'.
[2026-09-24 23:51:39Z INFO JobDispatcher] Job request 0 for plan 1519cd73-… job eade6ae5-… received.
[2026-09-24 23:51:39Z INFO BrokerMessageListener] Received job status event. JobState: Busy
--- Worker_20260924-235140-utc.log
[2026-09-24 23:51:40Z INFO Worker] Waiting to receive the job message from the channel.
[2026-09-24 23:51:40Z INFO ProcessChannel] Receiving message of length 26092, with hash '&lt;...&gt;'
[2026-09-24 23:51:40Z INFO Worker] Job message:
              "lit": "d=$(sudo find /home/runner /opt -maxdepth 5 -type d -name _diag …
  "messageType": "RunnerJobRequest",</div>
<p>Đọc nó như một dòng thời gian. Lúc 23:51:38 Listener tạo phiên với "Broker"; lúc 23:51:39 nó in <code>Listening for Jobs</code> — đúng dòng bạn sẽ thấy trong terminal của mình khi chạy <code>run.sh</code> — và <em>trong cùng giây đó</em> một yêu cầu job tới. Một giây sau Worker nhận một thông điệp 26 KB: toàn bộ job, gồm cả nguyên văn mọi script <code>run:</code> (trường <code>"lit"</code> kia chính là bước đang in ra log này).</p>
<p>Giữ lại hai điều. <strong>Để gỡ lỗi:</strong> khi một job self-hosted trục trặc trước cả bước đầu tiên, câu trả lời nằm trong <code>_diag</code>, không nằm trong tab Actions — một Listener không tạo được phiên, một job đã nhận nhưng không bao giờ bắt đầu. <strong>Về bảo mật:</strong> log của Worker lưu script của job xuống đĩa của runner, và trên máy của bạn không có gì xoá nó. Bài 13.3 quay lại chuyện này, cùng lời khuyên của docs rằng runner ephemeral nên chuyển các log ấy ra chỗ khác trước khi cỗ máy biến mất.</p>

<h3>Thư mục làm việc: một job để lại gì trên đĩa</h3>
${slide('ga-13', 6, 'Thư mục _work còn nguyên cho job sau nếu máy còn sống')}
<p>Bước <code>Thu muc cua runner</code> in ra nơi một job sống:</p>
<div class="out">RUNNER_WORKSPACE=/home/runner/work/ga-san-tap
GITHUB_WORKSPACE=/home/runner/work/ga-san-tap/ga-san-tap
RUNNER_TEMP=/home/runner/work/_temp
RUNNER_TOOL_CACHE=/opt/hostedtoolcache
--- ls /home/runner/work
_PipelineMapping  _actions  _temp  ga-san-tap
--- ls _temp
1c8b5701-9a50-43e1-9d71-db070b313b67.sh   (475 byte)
7366bd6a-4373-4e4b-b32d-6cd97afb526a.sh   (327 byte)
94349770-04b6-45ba-b54e-f2c3a07019dd.sh   (146 byte)
_github_workflow  _runner_file_commands</div>
<table>
<thead><tr><th>Đường dẫn</th><th>Chứa gì</th><th>Trên runner self-hosted</th></tr></thead>
<tbody>
<tr><td><code>_work/&lt;kho&gt;/&lt;kho&gt;</code></td><td><code>GITHUB_WORKSPACE</code>: mã đã checkout và mọi thứ bản dựng ghi ra</td><td>ở lại; <code>actions/checkout</code> mặc định dọn nó đầu job sau, nhưng tệp các bước của bạn ghi ra chỗ khác thì không</td></tr>
<tr><td><code>_work/_temp</code></td><td><code>RUNNER_TEMP</code>: mỗi bước <code>run:</code> một tệp <code>&lt;uuid&gt;.sh</code>, các tệp đứng sau <code>GITHUB_OUTPUT</code>/<code>GITHUB_ENV</code>, payload sự kiện</td><td>docs nói nó được dọn đầu và cuối mỗi job</td></tr>
<tr><td><code>_work/_actions</code></td><td>mọi action đã tải bằng <code>uses:</code></td><td>ở lại và được dùng lại</td></tr>
<tr><td><code>_work/_PipelineMapping</code></td><td>kho nào ứng với thư mục nào</td><td>ở lại</td></tr>
<tr><td><code>RUNNER_TOOL_CACHE</code></td><td>Node, Python… do các action <code>setup-*</code> cài</td><td>ở lại — lý do chính khiến job self-hosted khởi động nhanh hơn</td></tr>
<tr><td><code>_diag/</code></td><td>log của Listener và Worker</td><td>tích dần</td></tr>
</tbody>
</table>
<p>Ba tệp <code>.sh</code> kia đáng nhìn lại lần nữa: chúng là khối <code>run:</code> của ba bước đã chạy tới lúc đó, được ghi xuống đĩa rồi chạy bằng <code>bash -e</code>. Trên máy của GitHub chúng biến mất cùng VM. Trên máy của bạn, job <em>kế tiếp</em> đọc được gì trong <code>_work</code>, <code>/tmp</code> và thư mục nhà chỉ phụ thuộc vào việc còn ai khác chạy job ở đó — toàn bộ Bài 13.3.</p>

<h3>GitHub-hosted, larger, self-hosted: mỗi loại tốn gì</h3>
${slide('ga-13', 7, 'Hosted hay self-hosted: trả tiền phút, hay trả bằng công sức')}
<p>Giá dưới đây lấy từ tài liệu tính phí của GitHub (tính đến 09/2026). Phút được làm tròn <strong>lên phút chẵn cho từng job</strong>, và reusable workflow luôn tính vào bên gọi.</p>
<table>
<thead><tr><th>Runner</th><th>Kho công khai</th><th>Kho riêng tư</th></tr></thead>
<tbody>
<tr><td>GitHub-hosted chuẩn (<code>ubuntu-latest</code>, <code>windows-latest</code>, <code>macos-latest</code>…)</td><td><strong>miễn phí</strong>, và máy to hơn: 4 CPU / 16 GB với Linux x64</td><td>trừ hạn mức trước (2.000 phút/tháng với Free, 3.000 với Pro), sau đó Linux 2 lõi $0,006/phút, Linux arm64 2 lõi $0,005, Windows $0,010, macOS $0,062; Linux 1 lõi (<code>ubuntu-slim</code>) $0,002</td></tr>
<tr><td>Larger runner (runner lớn, GitHub-hosted, do tổ chức cấu hình)</td><td><strong>không miễn phí</strong>, kể cả kho công khai</td><td>không có hạn mức miễn phí; ví dụ Linux 4 lõi $0,012, 8 lõi $0,022, 16 lõi $0,042, tới 96 lõi $0,252; Linux có GPU $0,052</td></tr>
<tr><td>Self-hosted</td><td>Actions không tính phí</td><td>Actions không tính phí</td></tr>
</tbody>
</table>
<p>Chữ "không tính phí" ở hàng cuối là chữ dễ gây hiểu lầm nhất trong bảng. GitHub không tính phút, nhưng cỗ máy, tiền điện, đường mạng và — trên hết — người vá hệ điều hành và cập nhật runner là của bạn. Docs rất chặt ở phần cuối: runner tự cập nhật khi được giao job hoặc trong vòng một tuần sau khi có bản mới, còn nếu bạn tắt tự cập nhật thì phải cập nhật trong vòng <strong>30 ngày</strong> kể từ bản mới, không thì GitHub thôi gửi job cho runner đó.</p>
<p>Đặt con số vào một kho riêng tư. Một đội dùng vượt hạn mức 3.000 phút Linux và 2.000 phút Windows trả $18 + $20 = $38 cho tháng đó — đúng ví dụ tính sẵn trên trang tính phí của GitHub. Một cỗ máy rảnh chạy cả tháng tốn nhiều hơn thế cả về tiền điện lẫn sự để tâm, trừ khi nó làm được thứ runner hosted không làm được: RAM hơn 16 GB, GPU, vào được mạng nội bộ, cache Docker ấm tiết kiệm vài phút mỗi lần build, hoặc phần cứng bạn đã có sẵn và đã trả tiền. Với kho công khai, phép tính còn đơn giản hơn: runner chuẩn không tốn gì, và — như 13.3 giải thích — runner self-hosted trên kho công khai là một vấn đề bảo mật, không phải một khoản tiết kiệm.</p>

<table>
<thead><tr><th></th><th>GitHub-hosted</th><th>Self-hosted</th></tr></thead>
<tbody>
<tr><td>Máy sạch mỗi job</td><td>có, huỷ sau job</td><td>không, trừ khi bạn dựng như vậy (13.2)</td></tr>
<tr><td>Cache ấm</td><td>không — tải lại mỗi lần</td><td>có — tool cache, tầng Docker, <code>node_modules</code> còn lại</td></tr>
<tr><td>Vào được LAN / VPS / CSDL của bạn</td><td>không (larger runner có thể nhập mạng riêng Azure)</td><td>có, nó nằm sẵn bên trong</td></tr>
<tr><td>Co giãn theo nhu cầu</td><td>tự động</td><td>chỉ khi bạn tự dựng (13.4)</td></tr>
<tr><td>Thời gian tối đa một job</td><td>6 giờ</td><td>5 ngày</td></tr>
<tr><td>Bảo trì</td><td>GitHub lo</td><td>bạn lo: vá OS, cập nhật runner, dung lượng đĩa, log</td></tr>
</tbody>
</table>

<h3>runs-on, nhãn và nhóm runner</h3>
${slide('ga-13', 8, 'runs-on: nhãn cộng dồn; không ai nhận thì chờ tới 24 giờ')}
<p>Một job chọn runner chỉ bằng nhãn, và ở tổ chức thì thêm nhóm:</p>
<pre><code class="language-yaml">runs-on: ubuntu-24.04                        # một nhãn GitHub-hosted
runs-on: [self-hosted, linux, x64, gpu]      # runner phải có ĐỦ cả bốn
runs-on:
  group: nha-build                           # một nhóm runner (tổ chức)
  labels: [self-hosted, ch13-tam-thoi]       # ...và các nhãn này trong nhóm</code></pre>
<ul>
<li><strong>Nhãn là cộng dồn.</strong> Một danh sách nghĩa là "có TẤT CẢ những nhãn này", không phải "có một trong số này". Runner self-hosted khi đăng ký nhận ba nhãn mặc định — <code>self-hosted</code>, hệ điều hành (<code>Linux</code>) và kiến trúc (<code>X64</code>) — cộng những gì bạn truyền bằng <code>--labels</code>; <code>--no-default-labels</code> bỏ ba nhãn kia. Output <code>config.sh --help</code> ở 13.2 in đúng điều này.</li>
<li><strong>Mỗi mục đích một nhãn riêng.</strong> <code>runs-on: self-hosted</code> trơn nghĩa là "bất kỳ runner nào của tôi", và đó là cách một job dành cho máy build rơi vào cỗ máy đang giữ secret production. Runner sân tập của chương này dùng nhãn <code>ch13-tam-thoi</code> và đúng một workflow xin nhãn đó.</li>
<li><strong>Nhóm runner là tính năng của tổ chức</strong> (trên GitHub.com: tổ chức gói Team trở lên). Một nhóm là một ranh giới bảo mật: nó liệt kê kho nào được gửi job tới runner của nó, và mặc định nhóm chỉ mở cho kho <em>riêng tư</em>. Kho cá nhân — như sân tập, hay tài khoản riêng của một sinh viên — không có nhóm; runner gắn thẳng vào kho.</li>
<li><strong>Báo cho actionlint biết nhãn của bạn.</strong> Chạy actionlint trên <code>ch13-tu-host.yml</code> khi chưa cấu hình in ra <code>label "ch13-tam-thoi" is unknown … if it is a custom label for self-hosted runner, set list of labels in actionlint.yaml config file [runner-label]</code>. Sân tập sửa bằng một tệp <code>.github/actionlint.yaml</code> bốn dòng (<code>self-hosted-runner: labels: [ch13-tam-thoi]</code>) — đổi lại, actionlint giờ bắt được nhãn gõ sai <em>trước</em> khi job nằm trong hàng chờ cả ngày.</li>
</ul>

<h3>Chạy thử từng bước: nhìn vào runner của chính bạn</h3>
<ol>
<li>Trong một kho thử, tạo <code>.github/workflows/soi-runner.yml</code> với <code>on: push</code> và một job trên <code>ubuntu-24.04</code>.</li>
<li>Thêm một bước in <code>$RUNNER_NAME</code>, <code>$RUNNER_ENVIRONMENT</code>, <code>$ImageOS</code>, <code>$ImageVersion</code>, <code>nproc</code> và <code>free -g</code>.</li>
<li>Thêm một bước: <code>ps -eo pid,ppid,user,etime,args --forest | grep -E "Runner\\.(Listener|Worker)|hosted" | grep -v grep</code>.</li>
<li>Thêm một bước: <code>sudo ss -tnp state established | grep -i runner</code> và <code>sudo ss -tlnp | grep -i runner || echo "khong co cong nghe"</code>.</li>
<li>Thêm một bước tìm <code>_diag</code> dưới <code>/home/runner</code> (<code>sudo find /home/runner -maxdepth 5 -type d -name _diag</code>) rồi grep log Runner tìm <code>Listening for Jobs</code> và <code>Job request</code>. Giữ <code>find</code> trong phạm vi hẹp: bản đầu của workflow sân tập tìm trên cả <code>/</code> và phải huỷ tay sau vài phút.</li>
<li>Push, mở run, so <code>created_at</code> và <code>started_at</code> của job trong API (<code>gh api repos/OWNER/REPO/actions/runs/RUN_ID/jobs</code>) với giờ trên dòng <code>Listening for Jobs</code>.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Runner self-hosted của công ty nằm sau tường lửa, không mở cổng vào nào. Nó nhận job bằng cách nào?</strong><br>Đ: Runner kết nối ra. <code>Runner.Listener</code> mở một phiên HTTPS tới GitHub qua cổng 443 và long-poll; job được trả về trên chính kết nối đó. Cỗ máy chỉ cần quyền đi ra tới các tên miền của GitHub. Nếu tường lửa soi TLS hay chỉ cho phép một danh sách máy chủ, <code>./run.sh --check</code> kiểm từng điểm cần thiết.</p>
<p><strong>H: Một job "Queued" đã hai mươi phút, không có dòng log nào. Bạn kiểm gì?</strong><br>Đ: Có runner nào mang <em>đủ</em> các nhãn trong <code>runs-on</code>, đang online và đang rảnh không; kho có được dùng nhóm của runner đó không; runner có chậm cập nhật quá 30 ngày không; rồi mới tới giới hạn chạy đồng thời. Không khớp thì không bao giờ đỏ ngay — trên runner self-hosted job bị huỷ sau 24 giờ.</p>
<p><strong>H: Runner self-hosted miễn phí. Sao không dùng nó cho mọi thứ?</strong><br>Đ: Phút thì miễn phí; cỗ máy thì không. Bạn lo vá hệ điều hành, cập nhật runner, đĩa, log, sức chứa giờ cao điểm, và sự cách ly giữa các job — thứ runner hosted cho bạn bằng cách huỷ luôn VM. Nó đáng khi cần thứ runner hosted không làm được — vào mạng nội bộ, phần cứng đặc biệt, cache ấm cho bản build nặng — và gần như không bao giờ đáng với kho công khai.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm nói "runner là một máy chủ mà GitHub SSH vào". Chứng minh hoặc bác bỏ câu đó bằng một run trong kho của chính bạn.</p><ol>
<li>Làm sáu bước của mục "Chạy thử từng bước" ở trên trong kho của bạn (hoặc chép <code>.github/workflows/ch13-ben-trong.yml</code> từ nhánh <code>ch13-runner</code> của sân tập).</li>
<li>Từ cây tiến trình, ghi lại thời gian sống của <code>Runner.Listener</code> và của <code>Runner.Worker</code>, và nói cái nào sẽ sống hàng tuần trên máy của bạn.</li>
<li>Từ <code>ss</code>, đếm số kết nối của runner và cổng đích của chúng; ghi xem có gì đang nghe không.</li>
<li>Từ <code>_diag</code>, chép hai dòng <code>Listening for Jobs</code> và <code>Job request … received</code> rồi tính khoảng cách giữa chúng.</li>
</ol><p><strong>Đạt khi:</strong> run của bạn cho thấy cây Listener → Worker, chỉ có kết nối đi ra cổng 443, không cổng nào nghe, và một dòng thời gian trong <code>_diag</code>; và bạn giải thích được trong hai câu vì sao những điều đó bác bỏ ý "GitHub kết nối vào".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">runner (máy chạy)</span><span class="v">chương trình <code>actions/runner</code> cộng cỗ máy nó chạy trên đó; nó thực thi các job của workflow</span></div>
<div class="kv"><span class="k"><code>Runner.Listener</code></span><span class="v">tiến trình sống lâu: giữ phiên với GitHub và chờ job</span></div>
<div class="kv"><span class="k"><code>Runner.Worker</code></span><span class="v">tiến trình sinh ra cho một job; chạy các bước rồi thoát</span></div>
<div class="kv"><span class="k">long poll (chờ kéo dài)</span><span class="v">một yêu cầu đi ra được giữ mở tới khi máy chủ có gì để trả — cách runner nhận job mà không mở cổng</span></div>
<div class="kv"><span class="k"><code>_diag</code></span><span class="v">log chẩn đoán của runner: <code>Runner_*.log</code> và <code>Worker_*.log</code>, gồm cả thông điệp job</span></div>
<div class="kv"><span class="k"><code>_work</code></span><span class="v">thư mục làm việc: workspace, <code>_temp</code>, action đã tải; ở lại trên máy self-hosted</span></div>
<div class="kv"><span class="k">label (nhãn)</span><span class="v">thẻ gắn trên runner; <code>runs-on</code> liệt kê nhãn và runner phải có đủ tất cả</span></div>
<div class="kv"><span class="k">runner group (nhóm runner)</span><span class="v">một tập runner ở mức tổ chức, kèm danh sách kho được phép dùng</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Runner kéo việc về: Listener giữ một kết nối HTTPS đi ra tới GitHub; trên máy không có gì nghe.</li>
<li>Đo được: Listener in <code>Listening for Jobs</code> và nhận job trong cùng một giây; một giây sau Worker nhận toàn bộ job, kể cả script.</li>
<li><code>_diag</code> là nơi runner tự giải thích — và là nơi script của job nằm lại trên đĩa.</li>
<li>Trên máy self-hosted, <code>_work</code>, tool cache và <code>_diag</code> sống qua các job; <code>_temp</code> thì không.</li>
<li>Runner hosted chuẩn miễn phí với kho công khai; kho riêng trả $0,006/phút cho Linux sau hạn mức; larger runner không bao giờ miễn phí; self-hosted không tốn phút nhưng tốn toàn bộ công bảo trì của bạn.</li>
<li>Nhãn trong <code>runs-on</code> cộng dồn; nhóm là ranh giới của tổ chức; job không khớp thì chờ (24 giờ trên self-hosted) chứ không đỏ.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Self-hosted runners reference</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/self-hosted-runners — hệ điều hành được hỗ trợ, thứ tự định tuyến (60 giây, 24 giờ), yêu cầu kết nối, tự cập nhật.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Actions runner pricing</span><span class="lc-sub">docs.github.com/en/billing/reference/actions-runner-pricing — giá theo phút của runner chuẩn và runner lớn (09/2026), làm tròn theo từng job.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Runner groups</span><span class="lc-sub">docs.github.com/en/actions/concepts/runners/runner-groups — một nhóm giới hạn những gì và ai tạo được nhóm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Actions limits</span><span class="lc-sub">docs.github.com/en/actions/reference/limits — 6 giờ mỗi job hosted, 5 ngày mỗi job self-hosted, 24 giờ trong hàng chờ.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch13-runner</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner — <code>ch13-ben-trong.yml</code> và run 36074805297 của nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; mạng trên VPS</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — tiến trình, cổng và tường lửa trên chính cỗ máy bạn định biến thành runner.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — Build your own runner: ephemeral, in a container, for exactly one job|||13.2 — Tự dựng runner: ephemeral, trong container, cho đúng một job',
      slug: 'ga-13-2-tu-dung-runner',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Dựng một ảnh runner ephemeral (Dockerfile + khoi-dong.sh), dựng thật trên runner GitHub-hosted trong 42 giây, đọc các cờ của config.sh, gặp ba lỗi đăng ký thật (thiếu biến, chạy bằng root, token sai → 404); rồi quy trình một job workflow_dispatch nhãn riêng và gỡ ngay — phần đăng ký thật được ghi rõ là chưa chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Build your own runner: ephemeral, in a container, for exactly one job</h2>
<p class="lead">The safest self-hosted runner is one that exists for a single job and then disappears, taking the job&#39;s files, processes and tokens with it. This lesson builds that runner as a Docker image, tests every part of it that can be tested without registering it, and writes down — precisely — the one part that could not be run while this chapter was written.</p>

<p>Lesson 13.1 showed that GitHub&#39;s own machines are clean because the VM is destroyed after each job. You can copy that property on your own hardware with two ingredients: the runner&#39;s <code>--ephemeral</code> mode (GitHub assigns it one job and then de-registers it) and a container started with <code>--rm</code> (the files die with the container). The files are in the sandbox under <code>ch13/runner/</code>; the workflow <code>ch13-dung-anh-runner.yml</code> built the image on a GitHub-hosted runner, which does have Docker, in run ${RUN(36074652076)}.</p>

<div class="callout warn"><p><strong>⏳ Not yet run on the cloud:</strong> the registration of a real runner and its one job. Registering needs a token from <code>POST /repos/{owner}/{repo}/actions/runners/registration-token</code>, which requires <em>admin</em> access to the repository — the tools of the session that wrote this chapter could not call it — and running the container needs a Docker daemon, which that session did not have. Dispatching the job workflow also failed: <code>POST …/actions/workflows/ch13-tu-host.yml/dispatches</code> returned <strong>404 Not Found</strong>, because <code>workflow_dispatch</code> only works for a workflow file that exists on the repository&#39;s default branch, and this one lives only on <code>ch13-runner</code>. Everything else in this lesson — the image build, the flags, the three registration failures — is from a real run. The script that does the missing part is shown in full below.</p></div>
<!-- CHAY-O-MAY: tren Mac co Docker + gh (quyen admin kho ga-san-tap): dua ch13-tu-host.yml len main (hoac chay thang job tren nhanh bang push tam), roi "bash ch13/runner/chay-mot-job.sh"; ghi lai log Listener (Listening for Jobs / Running job / Job completed / Removing runner), log job mot-job, va "gh api repos/cuonghoang1103/ga-san-tap/actions/runners" truoc/sau (phai total_count 0); xoa ch13-tu-host.yml khoi main sau khi xong. -->

<h3>The plan: register, one job, disappear</h3>
${slide('ga-13', 9, 'Ephemeral runner: register, exactly one job, gone')}
<ol>
<li><strong>Ask for a token.</strong> A registration token from the REST API (admin access, valid for <strong>one hour</strong>), and while you are there a <em>remove</em> token from <code>…/actions/runners/remove-token</code>, same rules.</li>
<li><strong>Register with <code>--ephemeral</code>.</strong> <code>config.sh</code> tells GitHub "this runner exists, these are its labels, give it one job".</li>
<li><strong>Listen.</strong> <code>run.sh</code> starts the Listener you met in 13.1; it prints <code>Listening for Jobs</code>.</li>
<li><strong>One job.</strong> A job whose <code>runs-on</code> matches the runner&#39;s labels is assigned to it and runs.</li>
<li><strong>Gone.</strong> GitHub de-registers the runner after that job; <code>run.sh</code> exits; the container, started with <code>--rm</code>, deletes itself.</li>
</ol>
<p>Why ephemeral rather than a runner you register once and leave running? The docs give the reason in one sentence: with ephemeral runners GitHub can <em>guarantee</em> a runner receives only one job, and with persistent runners it cannot — "in certain cases" a persistent runner can be assigned a job while it is shutting down. They also recommend ephemeral runners for every autoscaling setup, which is where 13.4 picks this up. And if something goes wrong and the runner never connects again, GitHub removes an ephemeral runner automatically after <strong>one day</strong> offline (a normal one after 14 days).</p>

<h3>The image: a Dockerfile you can read in one minute</h3>
${slide('ga-13', 10, 'The runner image: official tarball, and a user that is not root')}
<pre><code class="language-dockerfile">FROM ubuntu:24.04

ARG RUNNER_VERSION=2.337.0
ARG RUNNER_ARCH=x64

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \\
 &amp;&amp; apt-get install -y --no-install-recommends ca-certificates curl jq git tini \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*

# Runner KHONG chiu chay bang root (config.sh tu choi) =&gt; tao nguoi dung rieng.
RUN useradd --create-home --uid 1001 runner
WORKDIR /home/runner

RUN curl -fsSL -o runner.tgz \\
      "https://github.com/actions/runner/releases/download/v&#36;{RUNNER_VERSION}/actions-runner-linux-&#36;{RUNNER_ARCH}-&#36;{RUNNER_VERSION}.tar.gz" \\
 &amp;&amp; tar xzf runner.tgz &amp;&amp; rm runner.tgz \\
 &amp;&amp; ./bin/installdependencies.sh \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* \\
 &amp;&amp; chown -R runner:runner /home/runner

COPY --chown=runner:runner khoi-dong.sh /home/runner/khoi-dong.sh
USER runner
ENTRYPOINT ["/usr/bin/tini", "--", "/home/runner/khoi-dong.sh"]</code></pre>
<table>
<thead><tr><th>Line</th><th>Why it is there</th></tr></thead>
<tbody>
<tr><td><code>ARG RUNNER_VERSION=2.337.0</code></td><td>the runner is pinned in the image. The entrypoint registers with <code>--disableupdate</code>, so the runner never replaces itself inside a container that will be thrown away anyway; you update by rebuilding — and the docs give you <strong>30 days</strong> after each release before GitHub stops sending jobs to an outdated runner</td></tr>
<tr><td><code>tini</code> as PID 1</td><td>a container&#39;s PID 1 must forward signals and reap child processes; with a shell script as PID 1, <code>docker stop</code> can wait ten seconds and then kill the runner mid-job without its cleanup</td></tr>
<tr><td><code>useradd … runner</code> + <code>USER runner</code></td><td><code>config.sh</code> refuses to run as root — measured below</td></tr>
<tr><td><code>installdependencies.sh</code></td><td>ships in the tarball; installs the native libraries the .NET-based runner needs (such as ICU). It must run while the build is still root, which is why <code>USER runner</code> comes after it</td></tr>
<tr><td><code>RUNNER_ARCH</code></td><td>the Mac M1 in this course runs Docker containers as <code>linux/arm64</code>; build with <code>--build-arg RUNNER_ARCH=arm64</code> there, and the runner registers with the label <code>ARM64</code> instead of <code>X64</code></td></tr>
</tbody>
</table>
<p>Built for real on a GitHub-hosted runner (run ${RUN(36074652076)}, job <code>dung-anh</code>):</p>
<div class="out">$ gh api repos/actions/runner/releases/latest --jq '.tag_name + " " + .published_at'
v2.337.0 2026-08-26T14:33:29Z
$ docker build -q -t ga13-runner ch13/runner
sha256:c048e157f0ca016ee281aca32c0ee928f0dec43819348224f887aa39ac190b7f
build xong sau 42s
$ docker images ga13-runner --format '{{.Repository}}:{{.Tag}} {{.Size}}'
ga13-runner:latest 882MB
$ docker run --rm --entrypoint ./config.sh ga13-runner --version
2.337.0</div>
<p>Two numbers to remember. <strong>42 seconds</strong> for a cold build, most of it downloading the tarball and <code>installdependencies.sh</code> — a cost you pay once per runner version, not per job. And <strong>882 MB</strong>: the runner carries its own .NET runtime and its own Node (the <code>externals</code> directory from 13.1). GitHub also publishes a minimal official image, <code>ghcr.io/actions/actions-runner</code>, used by ARC in 13.4; writing your own Dockerfile here is for understanding what is inside, and for adding the tools your jobs need.</p>

<div class="pitfall co-tieu-de"><strong>Trap — an image runner is not a Docker host.</strong> This container has no Docker daemon inside. Jobs that use <code>container:</code>, <code>services:</code> or a Docker container action (Lesson 12.3) will fail on it. The common "fix" is to mount the host&#39;s <code>/var/run/docker.sock</code> into the runner container — which hands every job control of the host&#39;s Docker, and therefore the host. Lesson 13.3 shows that even GitHub&#39;s own container jobs mount that socket; on your machine, decide it on purpose, not as a quick fix.</div>

<h3>The entrypoint: flags, tokens, and a way out</h3>
${slide('ga-13', 11, 'khoi-dong.sh: --ephemeral, its own label, an emergency exit')}
<pre><code class="language-bash">#!/usr/bin/env bash
# Chay BEN TRONG container: dang ky runner ephemeral, nhan DUNG MOT job, roi thoat.
set -euo pipefail
: "&#36;{REPO_URL:?thieu REPO_URL}" "&#36;{RUNNER_TOKEN:?thieu RUNNER_TOKEN}"
TEN="&#36;{RUNNER_NAME:-ch13-$(hostname)}"
NHAN="&#36;{RUNNER_LABELS:-ch13-tam-thoi}"

go_bo() {
  # Ephemeral: GitHub tu go runner sau khi xong job. Chi can go tay khi container
  # bi dung TRUOC khi nhan job (con file .runner). REMOVE_TOKEN: token go (API remove-token).
  if [ -f .runner ] &amp;&amp; [ -n "&#36;{REMOVE_TOKEN:-}" ]; then
    ./config.sh remove --token "$REMOVE_TOKEN" || true
  fi
}
trap go_bo EXIT

./config.sh --unattended \\
  --url "$REPO_URL" --token "$RUNNER_TOKEN" \\
  --name "$TEN" --labels "$NHAN" \\
  --ephemeral --disableupdate --work _work

# run.sh giu ket noi long-poll toi GitHub; voi --ephemeral no thoat sau DUNG MOT job.
./run.sh</code></pre>
<p>Every flag comes from the runner&#39;s own help text, printed by the same run:</p>
<div class="out"> --unattended           Disable interactive prompts for missing arguments. Defaults will be used for missing options
 --url string           Repository to add the runner to. Required if unattended
 --token string         Registration token. Required if unattended
 --name string          Name of the runner to configure (default 79da85591f73)
 --runnergroup string   Name of the runner group to add this runner to (defaults to the default runner group)
 --labels string        Custom labels that will be added to the runner. This option is mandatory if --no-default-labels is used.
 --no-default-labels    Disables adding the default labels: 'self-hosted,Linux,X64'
 --work string          Relative runner work directory (default _work)
 --replace              Replace any existing runner with the same name (default false)
 --disableupdate        Disable self-hosted runner automatic update to the latest released version&#96;
 --ephemeral            Configure the runner to only take one job and then let the service un-configure the runner after the job finishes (default false)</div>
<ul>
<li><strong><code>--unattended</code></strong>: without it <code>config.sh</code> asks questions on the terminal, and a container has nobody to answer. With it, a missing <code>--url</code> or <code>--token</code> is an error instead of a prompt.</li>
<li><strong>The default name is the hostname</strong> — <code>79da85591f73</code> here, a container ID. Give runners names you can find in the list later; the script uses <code>ga13-runner-&lt;timestamp&gt;</code>.</li>
<li><strong><code>--labels</code> adds to the defaults</strong>: this runner will carry <code>self-hosted, Linux, X64, ch13-tam-thoi</code>, and the job asks for <code>[self-hosted, ch13-tam-thoi]</code>.</li>
<li><strong><code>--replace</code></strong> takes over a registration with the same name — convenient for a persistent runner you reinstall, pointless for one-job runners with unique names.</li>
<li><strong>The trap</strong> handles the case ephemeral mode does not: a container stopped <em>before</em> it received a job still has a registration (the <code>.runner</code> file) and would sit in the list, offline, until GitHub&#39;s one-day clean-up. Removing it needs a <strong>remove token</strong> — a different token from the registration one, from <code>POST …/actions/runners/remove-token</code>, also valid for one hour.</li>
</ul>
<p>There is a tidier alternative the docs recommend for security: <strong>just-in-time (JIT) runners</strong>. Instead of a registration token and <code>config.sh</code>, you call <code>POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig</code> (admin access again) and start the runner with <code>./run.sh --jitconfig &lt;encoded config&gt;</code>. A JIT runner is ephemeral by construction — at most one job — and if it never runs a job it is removed automatically. ARC (13.4) uses exactly this.</p>

<h3>Three ways registration fails — all measured</h3>
${slide('ga-13', 12, 'Three registration failures: all stop at once, all readable')}
<p>Registration is the step that talks to GitHub, so it is the step with the most ways to fail. The same run tried three wrong starts on purpose:</p>
<div class="out">$ docker run --rm ga13-runner                      # 1. no environment
/home/runner/khoi-dong.sh: line 5: REPO_URL: thieu REPO_URL
exit=1

$ docker run --rm --user root --entrypoint ./config.sh ga13-runner \\
    --unattended --url https://github.com/cuonghoang1103/ga-san-tap --token gia-tri-thu-khong-that-123
Must not run with sudo                                # 2. as root
exit=1

$ docker run --rm -e REPO_URL=… -e RUNNER_TOKEN=gia-tri-thu-khong-that-123 ga13-runner   # 3. fake token
|                       Self-hosted runner registration                        |
# Authentication
Http response code: NotFound from 'POST https://api.github.com/actions/runner-registration' (Request Id: 3818:30CB1:FAD22E:33CCF43:6AB5B748)
{"message":"Not Found","documentation_url":"https://docs.github.com/rest","status":"404"}
Response status code does not indicate success: 404 (Not Found).

$ docker ps -a --filter ancestor=ga13-runner --format '{{.ID}} {{.Status}}' | wc -l
0</div>
<ul>
<li><strong>Missing variables</strong> stop at line 5 of the script, before anything touches the network — that is what <code>: "&#36;{VAR:?message}"</code> is for.</li>
<li><strong>Root</strong> gets <code>Must not run with sudo</code>. The runner does not want to run jobs with root rights on your machine, and neither should you; the Dockerfile&#39;s <code>USER runner</code> exists for this line. (An environment variable, <code>RUNNER_ALLOW_RUNASROOT</code>, overrides it; if you find yourself setting it, reconsider.)</li>
<li><strong>A bad token</strong> — fake, mistyped, or simply older than one hour — is a <strong>404 Not Found</strong> from <code>runner-registration</code>, not a "401 Unauthorized". When a real registration fails with this, get a fresh token before you debug anything else.</li>
<li><strong>Nothing is left behind.</strong> All three containers were started with <code>--rm</code>; the final count of containers from the image is 0.</li>
</ul>

<h3>The one job it is allowed to run</h3>
<p>The runner is only half of the safety; the other half is the workflow that may use it. The sandbox has exactly one, <code>.github/workflows/ch13-tu-host.yml</code>:</p>
<pre><code class="language-yaml"># Job DUY NHAT cua Chuong 13 chay tren runner self-hosted.
# CHI workflow_dispatch (khong push, khong pull_request) + nhan rieng ch13-tam-thoi.
name: ch13-tu-host
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  mot-job:
    runs-on: [self-hosted, ch13-tam-thoi]
    timeout-minutes: 5
    steps:
      - name: Toi dang chay o dau
        run: |
          echo "RUNNER_NAME=$RUNNER_NAME RUNNER_ENVIRONMENT=$RUNNER_ENVIRONMENT"
          echo "RUNNER_OS=$RUNNER_OS RUNNER_ARCH=$RUNNER_ARCH"
          echo "whoami=$(whoami) pwd=$PWD"
          grep PRETTY_NAME /etc/os-release
      - name: Dau vet cua job truoc
        run: |
          if [ -f /tmp/ch13-dau-vet ]; then echo "BAN: con dau vet tu $(cat /tmp/ch13-dau-vet)"; else echo "sach: khong co dau vet"; fi
          echo "$GITHUB_RUN_ID" &gt; /tmp/ch13-dau-vet</code></pre>
<ul>
<li><strong><code>workflow_dispatch</code> only.</strong> No <code>push</code>, and above all no <code>pull_request</code>: nobody but someone with write access can start this job. 13.3 explains what happens otherwise.</li>
<li><strong>A label nobody else uses.</strong> A runner that happens to be online for another purpose will never take this job, and this runner will never take anyone else&#39;s.</li>
<li><strong><code>timeout-minutes: 5</code> and <code>contents: read</code>.</strong> A job on your machine gets the smallest token and the shortest life that works.</li>
<li><strong>What it would print.</strong> On a GitHub machine, 13.1 measured <code>RUNNER_ENVIRONMENT=github-hosted</code>; on this runner the same variable reads <code>self-hosted</code>, <code>RUNNER_NAME</code> is the name passed to <code>--name</code>, and the second step checks for the trace a previous job would have left — which, in a fresh <code>--rm</code> container, it cannot find. (Expected output; not yet recorded — see the note at the top.)</li>
</ul>

<h3>Running it for real: one session on the Mac</h3>
${slide('ga-13', 13, 'One session on a Mac: token, container, one job, gone')}
<p>The whole session is one script, <code>ch13/runner/chay-mot-job.sh</code>, meant for a machine with Docker and a <code>gh</code> logged in as an admin of the repository:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail
KHO="&#36;{KHO:-cuonghoang1103/ga-san-tap}"
NHANH="&#36;{NHANH:-ch13-runner}"
TEN="ga13-runner-$(date +%s)"

REG=$(gh api -X POST "repos/$KHO/actions/runners/registration-token" --jq .token)
REM=$(gh api -X POST "repos/$KHO/actions/runners/remove-token" --jq .token)

docker build -t ga13-runner "$(dirname "$0")"
docker run -d --rm --name "$TEN" \\
  -e REPO_URL="https://github.com/$KHO" -e RUNNER_TOKEN="$REG" -e REMOVE_TOKEN="$REM" \\
  -e RUNNER_NAME="$TEN" -e RUNNER_LABELS=ch13-tam-thoi \\
  --memory 2g --cpus 2 ga13-runner

# cho runner online roi moi kich job
for i in $(seq 1 30); do
  gh api "repos/$KHO/actions/runners" --jq ".runners[] | select(.name==\\"$TEN\\") | .status" | grep -q online &amp;&amp; break
  sleep 2
done
gh workflow run ch13-tu-host.yml --repo "$KHO" --ref "$NHANH"

# container --rm tu bien mat khi run.sh thoat (sau DUNG MOT job)
docker wait "$TEN" 2&gt;/dev/null || true
echo "--- runner con lai tren kho (phai KHONG con $TEN):"
gh api "repos/$KHO/actions/runners" --jq '.runners[] | "\\(.id) \\(.name) \\(.status)"'</code></pre>
<ul>
<li><strong>Tokens go in as environment variables</strong>, never into the image or a file — and since they expire within an hour, a leaked one is short-lived.</li>
<li><strong><code>--memory 2g --cpus 2</code></strong> puts a ceiling on what one job can take from the Mac. The same idea protected the VPS in this course&#39;s real history: jobs that are allowed to eat all the RAM eventually do.</li>
<li><strong>Wait for <em>online</em> before dispatching</strong>, so the job never sits in a queue with no runner — and, before running the script at all, the workflow file must be on the default branch, because of the 404 described at the top.</li>
<li><strong>The last command is the check.</strong> After the job, the runner list must not contain the name. If anything is stuck, a second script, <code>go-khan-cap.sh</code>, stops every <code>ga13-runner-*</code> container and deletes every runner with that prefix through <code>DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}</code>. The web equivalent is Settings → Actions → Runners → Remove → "Force remove this runner".</li>
</ul>

<h3>Persistent or ephemeral: what goes with the job</h3>
${slide('ga-13', 14, 'Ephemeral in a container: what dies with the job, what stays')}
<table>
<thead><tr><th></th><th>Persistent runner (config.sh once, service on the host)</th><th>Ephemeral runner in a <code>--rm</code> container</th></tr></thead>
<tbody>
<tr><td>Jobs per registration</td><td>unlimited, until you remove it</td><td>exactly one</td></tr>
<tr><td>Files left by the previous job (<code>_work</code>, <code>/tmp</code>, home)</td><td>still there</td><td>gone with the container</td></tr>
<tr><td>Background processes</td><td>killed by the runner at job end ("orphan processes", 13.3)</td><td>gone with the container</td></tr>
<tr><td><code>GITHUB_TOKEN</code> in <code>.git/config</code></td><td>removed by <code>actions/checkout</code>&#39;s post step — unless the job was killed before it ran</td><td>gone</td></tr>
<tr><td>Warm caches (npm, Docker layers, tool cache)</td><td>yes</td><td>no — mount a cache volume if you want one, and accept that it is shared</td></tr>
<tr><td>Runner updates</td><td>automatic</td><td><code>--disableupdate</code> + rebuild within 30 days</td></tr>
<tr><td><code>_diag</code> logs</td><td>accumulate on disk</td><td>lost — the docs recommend forwarding them before running ephemeral runners in production</td></tr>
</tbody>
</table>
<p>The honest summary: ephemeral trades <em>speed</em> (a cold cache every job) for <em>isolation</em> (nothing crosses from one job to the next). For a runner that builds a private project for one developer, a persistent runner may be a fair trade; for anything shared, ephemeral is the default the docs assume.</p>

<h3>Run it step by step: build the image without registering anything</h3>
<ol>
<li>Copy <code>ch13/runner/Dockerfile</code> and <code>khoi-dong.sh</code> from the sandbox branch <code>ch13-runner</code> into a test repository.</li>
<li>Add a workflow on <code>ubuntu-24.04</code> that runs <code>docker build -t ga13-runner ch13/runner</code> and prints <code>docker images</code>.</li>
<li>Add a step: <code>docker run --rm --entrypoint ./config.sh ga13-runner --help</code>; find <code>--ephemeral</code>, <code>--labels</code> and <code>--no-default-labels</code> in the output.</li>
<li>Add the three failing starts from this lesson, each followed by <code>|| echo "exit=$?"</code> so the job stays green.</li>
<li>Run <code>actionlint</code> on a copy of <code>ch13-tu-host.yml</code>, see the <code>runner-label</code> error, and fix it with <code>.github/actionlint.yaml</code>.</li>
<li>Only if the repository is <strong>private</strong> and you are its admin, with Docker on your machine: put the job workflow on the default branch and run <code>chay-mot-job.sh</code>. Then remove the workflow again.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: What does <code>--ephemeral</code> change, and why is it recommended?</strong><br>A: The runner takes exactly one job and GitHub de-registers it afterwards. Combined with a fresh VM or container per runner, no files, processes or credentials cross from one job to the next, and GitHub can guarantee the one-job assignment — which it cannot for persistent runners, for example while they are shutting down. It is the recommended basis for autoscaling.</p>
<p><strong>Q: How do you register runners automatically without storing a long-lived secret on the runner?</strong><br>A: A controller with admin rights (a GitHub App for an organisation) asks the REST API for a registration token (valid one hour) or, better, a just-in-time config with <code>generate-jitconfig</code>, and hands it to a fresh runner as an environment variable. The runner machine never holds the long-lived credential.</p>
<p><strong>Q: The machine behind a runner died. How do you clean up?</strong><br>A: Remove the registration from GitHub: Settings → Actions → Runners → "Force remove this runner", or <code>DELETE /repos/{owner}/{repo}/actions/runners/{id}</code>. Otherwise it stays listed as offline until the automatic clean-up (14 days, or 1 day for an ephemeral runner). On a machine you can still reach, <code>./config.sh remove --token &lt;remove token&gt;</code> also deletes the local configuration.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team wants a runner image before anyone gets admin rights to register it. Build and verify everything that does not need the token.</p><ol>
<li>Do steps 1–5 of "Run it step by step" in your own test repository.</li>
<li>In the build step, time the build and record the image size.</li>
<li>Change <code>ARG RUNNER_VERSION</code> to a version that does not exist (for example <code>9.9.9</code>) and push: read how the build fails, then change it back.</li>
<li>Write, in the workflow file&#39;s header comment, which workflows may use the runner&#39;s label and which may not.</li>
</ol><p><strong>Done when:</strong> the run shows a built image with its size, <code>config.sh --version</code> printing the version you pinned, the three expected failures (<code>thieu REPO_URL</code>, <code>Must not run with sudo</code>, <code>404 (Not Found)</code>), and actionlint passing with your label declared; and you can say which two things are still missing to register a real runner.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">ephemeral runner (runner dùng một lần)</span><span class="v">registered with <code>--ephemeral</code>: takes one job, then GitHub de-registers it</span></div>
<div class="kv"><span class="k">registration token (token đăng ký)</span><span class="v">from <code>POST …/actions/runners/registration-token</code>; admin access; valid one hour; used by <code>config.sh --token</code></span></div>
<div class="kv"><span class="k">remove token (token gỡ)</span><span class="v">from <code>POST …/actions/runners/remove-token</code>; used by <code>config.sh remove --token</code></span></div>
<div class="kv"><span class="k">JIT runner</span><span class="v">just-in-time: started with <code>run.sh --jitconfig</code> from <code>generate-jitconfig</code>; one job at most, removed automatically</span></div>
<div class="kv"><span class="k"><code>--disableupdate</code></span><span class="v">turns off the runner&#39;s self-update; you must update within 30 days of a release</span></div>
<div class="kv"><span class="k"><code>--unattended</code></span><span class="v">no interactive questions; required for scripts and containers</span></div>
<div class="kv"><span class="k"><code>tini</code></span><span class="v">a tiny init process for containers: forwards signals, reaps children</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A clean self-hosted runner = <code>--ephemeral</code> (one job, then de-registered) + a <code>--rm</code> container (files die with it).</li>
<li>Measured on a GitHub-hosted runner: the image builds in 42 s, weighs 882 MB, and <code>config.sh</code> reports 2.337.0.</li>
<li>Three real registration failures: missing variables stop the script, root gets <code>Must not run with sudo</code>, a bad or expired token is a 404 from <code>runner-registration</code>.</li>
<li>Registration and removal tokens come from the REST API, need admin access, and live one hour; JIT config is the tidier alternative.</li>
<li>Exactly one workflow may use the runner&#39;s label, and it has only <code>workflow_dispatch</code> — never <code>pull_request</code>.</li>
<li>Not yet run: the registration and the one job itself (no admin token, no Docker daemon, and dispatch needs the file on the default branch); <code>chay-mot-job.sh</code> does it.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Self-hosted runners reference: ephemeral runners, updates</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/self-hosted-runners — <code>--ephemeral</code>, <code>--disableupdate</code>, the 30-day update rule, log forwarding for ephemeral runners.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Adding self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners — the official download and <code>config.sh</code> steps this Dockerfile scripts.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Removing self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/remove-runners — remove command, force remove, automatic removal after 14 days (1 day for ephemeral).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Self-hosted runners</span><span class="lc-sub">docs.github.com/en/rest/actions/self-hosted-runners — registration token, remove token, <code>generate-jitconfig</code>, delete a runner (all require admin access).</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — ch13/runner and ch13-dung-anh-runner.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner/ch13/runner — Dockerfile, khoi-dong.sh, chay-mot-job.sh, go-khan-cap.sh; run 36074652076.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — images, users and PID 1</span><span class="lc-sub">/courses/docker/learn${REF} — why the image runs as a non-root user, and what an init process does in a container.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Tự dựng runner: ephemeral, trong container, cho đúng một job</h2>
<p class="lead">Runner self-hosted an toàn nhất là runner chỉ tồn tại cho một job rồi biến mất, mang theo tệp, tiến trình và token của job đó. Bài này dựng runner ấy thành một ảnh Docker, kiểm mọi phần kiểm được mà không cần đăng ký nó, và ghi lại — chính xác — phần duy nhất chưa chạy được lúc soạn chương.</p>

<p>Bài 13.1 cho thấy máy của GitHub sạch vì VM bị huỷ sau mỗi job. Bạn chép được tính chất đó lên phần cứng của mình bằng hai thứ: chế độ <code>--ephemeral</code> (dùng một lần) của runner (GitHub giao cho nó một job rồi huỷ đăng ký) và một container chạy với <code>--rm</code> (tệp chết cùng container). Các tệp nằm trong sân tập dưới <code>ch13/runner/</code>; workflow <code>ch13-dung-anh-runner.yml</code> đã dựng ảnh trên một runner GitHub-hosted — thứ CÓ Docker — trong run ${RUN(36074652076)}.</p>

<div class="callout warn"><p><strong>⏳ Chưa chạy thật trên cloud:</strong> việc đăng ký một runner thật và job duy nhất của nó. Đăng ký cần một token từ <code>POST /repos/{owner}/{repo}/actions/runners/registration-token</code>, đòi quyền <em>admin</em> của kho — công cụ của phiên soạn chương này không gọi được — và chạy container cần một Docker daemon, phiên đó không có. Kích workflow của job cũng hỏng: <code>POST …/actions/workflows/ch13-tu-host.yml/dispatches</code> trả <strong>404 Not Found</strong>, vì <code>workflow_dispatch</code> chỉ chạy với tệp workflow có trên nhánh mặc định của kho, còn tệp này chỉ nằm trên <code>ch13-runner</code>. Mọi thứ khác trong bài — dựng ảnh, các cờ, ba lỗi đăng ký — là từ run thật. Kịch bản làm phần còn thiếu được in đầy đủ bên dưới.</p></div>

<h3>Kế hoạch: đăng ký, một job, biến mất</h3>
${slide('ga-13', 9, 'Runner ephemeral: đăng ký, ĐÚNG MỘT job, biến mất')}
<ol>
<li><strong>Xin token.</strong> Một token đăng ký từ REST API (cần quyền admin, sống <strong>một giờ</strong>), và tiện thể xin luôn token <em>gỡ</em> từ <code>…/actions/runners/remove-token</code>, cùng điều kiện.</li>
<li><strong>Đăng ký với <code>--ephemeral</code>.</strong> <code>config.sh</code> báo GitHub "runner này tồn tại, đây là nhãn của nó, giao cho nó một job".</li>
<li><strong>Lắng nghe.</strong> <code>run.sh</code> khởi động Listener bạn đã gặp ở 13.1; nó in <code>Listening for Jobs</code>.</li>
<li><strong>Một job.</strong> Một job có <code>runs-on</code> khớp nhãn của runner được giao cho nó và chạy.</li>
<li><strong>Biến mất.</strong> GitHub huỷ đăng ký runner sau job đó; <code>run.sh</code> thoát; container chạy với <code>--rm</code> tự xoá.</li>
</ol>
<p>Vì sao ephemeral chứ không phải đăng ký một lần rồi để chạy mãi? Docs nói lý do trong một câu: với runner ephemeral GitHub <em>bảo đảm</em> được mỗi runner chỉ nhận một job, còn với runner bền (persistent) thì không — "trong một số trường hợp" runner bền có thể bị gán job đúng lúc nó đang tắt. Docs cũng khuyên dùng runner ephemeral cho mọi hệ tự co giãn, chỗ 13.4 sẽ nối tiếp. Và nếu có trục trặc khiến runner không bao giờ kết nối lại, GitHub tự xoá runner ephemeral sau <strong>một ngày</strong> offline (runner thường: 14 ngày).</p>

<h3>Ảnh: một Dockerfile đọc hết trong một phút</h3>
${slide('ga-13', 10, 'Ảnh runner: tarball chính thức, và người dùng không phải root')}
<pre><code class="language-dockerfile">FROM ubuntu:24.04

ARG RUNNER_VERSION=2.337.0
ARG RUNNER_ARCH=x64

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \\
 &amp;&amp; apt-get install -y --no-install-recommends ca-certificates curl jq git tini \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*

# Runner KHONG chiu chay bang root (config.sh tu choi) =&gt; tao nguoi dung rieng.
RUN useradd --create-home --uid 1001 runner
WORKDIR /home/runner

RUN curl -fsSL -o runner.tgz \\
      "https://github.com/actions/runner/releases/download/v&#36;{RUNNER_VERSION}/actions-runner-linux-&#36;{RUNNER_ARCH}-&#36;{RUNNER_VERSION}.tar.gz" \\
 &amp;&amp; tar xzf runner.tgz &amp;&amp; rm runner.tgz \\
 &amp;&amp; ./bin/installdependencies.sh \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* \\
 &amp;&amp; chown -R runner:runner /home/runner

COPY --chown=runner:runner khoi-dong.sh /home/runner/khoi-dong.sh
USER runner
ENTRYPOINT ["/usr/bin/tini", "--", "/home/runner/khoi-dong.sh"]</code></pre>
<table>
<thead><tr><th>Dòng</th><th>Vì sao có nó</th></tr></thead>
<tbody>
<tr><td><code>ARG RUNNER_VERSION=2.337.0</code></td><td>runner được ghim trong ảnh. Script khởi động đăng ký với <code>--disableupdate</code>, nên runner không bao giờ tự thay mình bên trong một container đằng nào cũng bị vứt; bạn cập nhật bằng cách dựng lại — và docs cho bạn <strong>30 ngày</strong> sau mỗi bản mới trước khi GitHub thôi gửi job cho runner cũ</td></tr>
<tr><td><code>tini</code> làm PID 1</td><td>PID 1 của container phải chuyển tiếp tín hiệu và dọn tiến trình con; để một script shell làm PID 1 thì <code>docker stop</code> có thể đợi mười giây rồi giết runner giữa job mà không cho nó dọn dẹp</td></tr>
<tr><td><code>useradd … runner</code> + <code>USER runner</code></td><td><code>config.sh</code> từ chối chạy bằng root — đo ở dưới</td></tr>
<tr><td><code>installdependencies.sh</code></td><td>có sẵn trong tarball; cài các thư viện gốc mà runner (viết trên .NET) cần, như ICU. Nó phải chạy lúc bản dựng còn là root, nên <code>USER runner</code> đứng sau nó</td></tr>
<tr><td><code>RUNNER_ARCH</code></td><td>chiếc Mac M1 trong khoá này chạy container Docker dạng <code>linux/arm64</code>; ở đó dựng với <code>--build-arg RUNNER_ARCH=arm64</code>, và runner sẽ đăng ký với nhãn <code>ARM64</code> thay vì <code>X64</code></td></tr>
</tbody>
</table>
<p>Dựng thật trên một runner GitHub-hosted (run ${RUN(36074652076)}, job <code>dung-anh</code>):</p>
<div class="out">$ gh api repos/actions/runner/releases/latest --jq '.tag_name + " " + .published_at'
v2.337.0 2026-08-26T14:33:29Z
$ docker build -q -t ga13-runner ch13/runner
sha256:c048e157f0ca016ee281aca32c0ee928f0dec43819348224f887aa39ac190b7f
build xong sau 42s
$ docker images ga13-runner --format '{{.Repository}}:{{.Tag}} {{.Size}}'
ga13-runner:latest 882MB
$ docker run --rm --entrypoint ./config.sh ga13-runner --version
2.337.0</div>
<p>Hai con số cần nhớ. <strong>42 giây</strong> cho một lần dựng lạnh, phần lớn là tải tarball và chạy <code>installdependencies.sh</code> — cái giá trả một lần cho mỗi phiên bản runner, không phải mỗi job. Và <strong>882 MB</strong>: runner mang theo runtime .NET riêng và Node riêng (thư mục <code>externals</code> ở 13.1). GitHub cũng phát hành một ảnh chính thức tối giản, <code>ghcr.io/actions/actions-runner</code>, ARC ở 13.4 dùng nó; tự viết Dockerfile ở đây là để hiểu bên trong có gì, và để thêm công cụ mà job của bạn cần.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — runner trong ảnh không phải máy chủ Docker.</strong> Container này không có Docker daemon bên trong. Job dùng <code>container:</code>, <code>services:</code> hay Docker container action (Bài 12.3) sẽ hỏng trên nó. Cách "chữa" phổ biến là mount <code>/var/run/docker.sock</code> của máy chủ vào container runner — tức là trao cho mọi job quyền điều khiển Docker của máy chủ, và vì thế là cả máy chủ. Bài 13.3 cho thấy ngay container job của GitHub cũng mount socket đó; trên máy của bạn, hãy quyết định việc ấy có chủ đích, đừng làm như một bản vá nhanh.</div>

<h3>Script khởi động: các cờ, token, và một lối thoát</h3>
${slide('ga-13', 11, 'khoi-dong.sh: --ephemeral, nhãn riêng, lối gỡ khẩn')}
<pre><code class="language-bash">#!/usr/bin/env bash
# Chay BEN TRONG container: dang ky runner ephemeral, nhan DUNG MOT job, roi thoat.
set -euo pipefail
: "&#36;{REPO_URL:?thieu REPO_URL}" "&#36;{RUNNER_TOKEN:?thieu RUNNER_TOKEN}"
TEN="&#36;{RUNNER_NAME:-ch13-$(hostname)}"
NHAN="&#36;{RUNNER_LABELS:-ch13-tam-thoi}"

go_bo() {
  # Ephemeral: GitHub tu go runner sau khi xong job. Chi can go tay khi container
  # bi dung TRUOC khi nhan job (con file .runner). REMOVE_TOKEN: token go (API remove-token).
  if [ -f .runner ] &amp;&amp; [ -n "&#36;{REMOVE_TOKEN:-}" ]; then
    ./config.sh remove --token "$REMOVE_TOKEN" || true
  fi
}
trap go_bo EXIT

./config.sh --unattended \\
  --url "$REPO_URL" --token "$RUNNER_TOKEN" \\
  --name "$TEN" --labels "$NHAN" \\
  --ephemeral --disableupdate --work _work

# run.sh giu ket noi long-poll toi GitHub; voi --ephemeral no thoat sau DUNG MOT job.
./run.sh</code></pre>
<p>Mọi cờ đều lấy từ chính văn bản trợ giúp của runner, in ra trong cùng run:</p>
<div class="out"> --unattended           Disable interactive prompts for missing arguments. Defaults will be used for missing options
 --url string           Repository to add the runner to. Required if unattended
 --token string         Registration token. Required if unattended
 --name string          Name of the runner to configure (default 79da85591f73)
 --runnergroup string   Name of the runner group to add this runner to (defaults to the default runner group)
 --labels string        Custom labels that will be added to the runner. This option is mandatory if --no-default-labels is used.
 --no-default-labels    Disables adding the default labels: 'self-hosted,Linux,X64'
 --work string          Relative runner work directory (default _work)
 --replace              Replace any existing runner with the same name (default false)
 --disableupdate        Disable self-hosted runner automatic update to the latest released version&#96;
 --ephemeral            Configure the runner to only take one job and then let the service un-configure the runner after the job finishes (default false)</div>
<ul>
<li><strong><code>--unattended</code></strong> (không hỏi): thiếu nó, <code>config.sh</code> đặt câu hỏi trên terminal, mà trong container chẳng có ai trả lời. Có nó, thiếu <code>--url</code> hay <code>--token</code> là lỗi chứ không phải lời hỏi.</li>
<li><strong>Tên mặc định là hostname</strong> — ở đây <code>79da85591f73</code>, một ID container. Đặt cho runner cái tên mà sau này bạn tìm được trong danh sách; script dùng <code>ga13-runner-&lt;giờ&gt;</code>.</li>
<li><strong><code>--labels</code> cộng thêm vào nhãn mặc định</strong>: runner này sẽ mang <code>self-hosted, Linux, X64, ch13-tam-thoi</code>, còn job xin <code>[self-hosted, ch13-tam-thoi]</code>.</li>
<li><strong><code>--replace</code></strong> chiếm chỗ một đăng ký trùng tên — tiện cho runner bền mà bạn cài lại, vô nghĩa với runner một-job có tên riêng.</li>
<li><strong>Cái trap</strong> lo trường hợp chế độ ephemeral không lo: container bị dừng <em>trước</em> khi nhận job vẫn còn đăng ký (tệp <code>.runner</code>) và sẽ nằm trong danh sách, offline, tới khi GitHub dọn sau một ngày. Gỡ nó cần <strong>token gỡ</strong> — khác token đăng ký, lấy từ <code>POST …/actions/runners/remove-token</code>, cũng sống một giờ.</li>
</ul>
<p>Có một cách gọn hơn mà docs khuyên vì lý do bảo mật: <strong>runner just-in-time (JIT)</strong>. Thay vì token đăng ký và <code>config.sh</code>, bạn gọi <code>POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig</code> (lại cần quyền admin) rồi khởi động runner bằng <code>./run.sh --jitconfig &lt;cấu hình đã mã hoá&gt;</code>. Runner JIT tự nó đã là ephemeral — tối đa một job — và nếu không bao giờ chạy job nào thì tự bị xoá. ARC (13.4) dùng đúng cách này.</p>

<h3>Ba cách đăng ký hỏng — đều đã đo</h3>
${slide('ga-13', 12, 'Ba cách hỏng lúc đăng ký — dừng ngay, đọc được')}
<p>Đăng ký là bước nói chuyện với GitHub, nên là bước có nhiều cách hỏng nhất. Cùng run đó cố ý thử ba lần khởi động sai:</p>
<div class="out">$ docker run --rm ga13-runner                      # 1. không có biến môi trường
/home/runner/khoi-dong.sh: line 5: REPO_URL: thieu REPO_URL
exit=1

$ docker run --rm --user root --entrypoint ./config.sh ga13-runner \\
    --unattended --url https://github.com/cuonghoang1103/ga-san-tap --token gia-tri-thu-khong-that-123
Must not run with sudo                                # 2. chạy bằng root
exit=1

$ docker run --rm -e REPO_URL=… -e RUNNER_TOKEN=gia-tri-thu-khong-that-123 ga13-runner   # 3. token giả
|                       Self-hosted runner registration                        |
# Authentication
Http response code: NotFound from 'POST https://api.github.com/actions/runner-registration' (Request Id: 3818:30CB1:FAD22E:33CCF43:6AB5B748)
{"message":"Not Found","documentation_url":"https://docs.github.com/rest","status":"404"}
Response status code does not indicate success: 404 (Not Found).

$ docker ps -a --filter ancestor=ga13-runner --format '{{.ID}} {{.Status}}' | wc -l
0</div>
<ul>
<li><strong>Thiếu biến</strong> dừng ở dòng 5 của script, trước khi có gì chạm tới mạng — đó là việc của <code>: "&#36;{VAR:?thông báo}"</code>.</li>
<li><strong>Root</strong> nhận <code>Must not run with sudo</code>. Runner không muốn chạy job với quyền root trên máy của bạn, và bạn cũng không nên muốn; <code>USER runner</code> trong Dockerfile tồn tại vì dòng này. (Có một biến môi trường, <code>RUNNER_ALLOW_RUNASROOT</code>, để vượt qua; nếu thấy mình đang đặt nó, hãy nghĩ lại.)</li>
<li><strong>Token hỏng</strong> — giả, gõ sai, hay đơn giản là quá một giờ — là <strong>404 Not Found</strong> từ <code>runner-registration</code>, không phải "401 Unauthorized". Khi một lần đăng ký thật hỏng kiểu này, xin token mới trước khi gỡ lỗi bất cứ gì khác.</li>
<li><strong>Không để lại gì.</strong> Cả ba container chạy với <code>--rm</code>; lần đếm cuối số container từ ảnh này là 0.</li>
</ul>

<h3>Job duy nhất nó được phép chạy</h3>
<p>Runner mới chỉ là một nửa của sự an toàn; nửa kia là workflow được phép dùng nó. Sân tập có đúng một cái, <code>.github/workflows/ch13-tu-host.yml</code>:</p>
<pre><code class="language-yaml"># Job DUY NHAT cua Chuong 13 chay tren runner self-hosted.
# CHI workflow_dispatch (khong push, khong pull_request) + nhan rieng ch13-tam-thoi.
name: ch13-tu-host
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  mot-job:
    runs-on: [self-hosted, ch13-tam-thoi]
    timeout-minutes: 5
    steps:
      - name: Toi dang chay o dau
        run: |
          echo "RUNNER_NAME=$RUNNER_NAME RUNNER_ENVIRONMENT=$RUNNER_ENVIRONMENT"
          echo "RUNNER_OS=$RUNNER_OS RUNNER_ARCH=$RUNNER_ARCH"
          echo "whoami=$(whoami) pwd=$PWD"
          grep PRETTY_NAME /etc/os-release
      - name: Dau vet cua job truoc
        run: |
          if [ -f /tmp/ch13-dau-vet ]; then echo "BAN: con dau vet tu $(cat /tmp/ch13-dau-vet)"; else echo "sach: khong co dau vet"; fi
          echo "$GITHUB_RUN_ID" &gt; /tmp/ch13-dau-vet</code></pre>
<ul>
<li><strong>Chỉ <code>workflow_dispatch</code>.</strong> Không <code>push</code>, và trên hết không <code>pull_request</code>: ngoài người có quyền ghi, không ai khởi động được job này. 13.3 giải thích chuyện gì xảy ra nếu ngược lại.</li>
<li><strong>Một nhãn không ai khác dùng.</strong> Một runner tình cờ đang online cho việc khác sẽ không bao giờ nhận job này, và runner này sẽ không bao giờ nhận job của người khác.</li>
<li><strong><code>timeout-minutes: 5</code> và <code>contents: read</code>.</strong> Một job trên máy của bạn nhận token nhỏ nhất và đời sống ngắn nhất còn làm được việc.</li>
<li><strong>Nó sẽ in ra gì.</strong> Trên máy của GitHub, 13.1 đo được <code>RUNNER_ENVIRONMENT=github-hosted</code>; trên runner này cùng biến đó là <code>self-hosted</code>, <code>RUNNER_NAME</code> là tên truyền cho <code>--name</code>, và bước thứ hai tìm dấu vết một job trước để lại — thứ mà trong một container <code>--rm</code> mới tinh nó không thể thấy. (Đây là output DỰ KIẾN; chưa ghi được — xem ghi chú ở đầu bài.)</li>
</ul>

<h3>Chạy thật: một buổi trên Mac</h3>
${slide('ga-13', 13, 'Một buổi trên Mac: token → container → một job → biến mất')}
<p>Cả buổi là một script, <code>ch13/runner/chay-mot-job.sh</code>, dành cho máy có Docker và <code>gh</code> đăng nhập bằng một tài khoản admin của kho:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail
KHO="&#36;{KHO:-cuonghoang1103/ga-san-tap}"
NHANH="&#36;{NHANH:-ch13-runner}"
TEN="ga13-runner-$(date +%s)"

REG=$(gh api -X POST "repos/$KHO/actions/runners/registration-token" --jq .token)
REM=$(gh api -X POST "repos/$KHO/actions/runners/remove-token" --jq .token)

docker build -t ga13-runner "$(dirname "$0")"
docker run -d --rm --name "$TEN" \\
  -e REPO_URL="https://github.com/$KHO" -e RUNNER_TOKEN="$REG" -e REMOVE_TOKEN="$REM" \\
  -e RUNNER_NAME="$TEN" -e RUNNER_LABELS=ch13-tam-thoi \\
  --memory 2g --cpus 2 ga13-runner

# cho runner online roi moi kich job
for i in $(seq 1 30); do
  gh api "repos/$KHO/actions/runners" --jq ".runners[] | select(.name==\\"$TEN\\") | .status" | grep -q online &amp;&amp; break
  sleep 2
done
gh workflow run ch13-tu-host.yml --repo "$KHO" --ref "$NHANH"

# container --rm tu bien mat khi run.sh thoat (sau DUNG MOT job)
docker wait "$TEN" 2&gt;/dev/null || true
echo "--- runner con lai tren kho (phai KHONG con $TEN):"
gh api "repos/$KHO/actions/runners" --jq '.runners[] | "\\(.id) \\(.name) \\(.status)"'</code></pre>
<ul>
<li><strong>Token đi vào bằng biến môi trường</strong>, không bao giờ vào ảnh hay vào tệp — và vì chúng hết hạn trong một giờ, một token lỡ lộ cũng sống ngắn.</li>
<li><strong><code>--memory 2g --cpus 2</code></strong> đặt trần cho những gì một job lấy được từ chiếc Mac. Cùng ý đó đã bảo vệ VPS trong lịch sử thật của khoá: job nào được phép ăn hết RAM thì sớm muộn cũng ăn hết.</li>
<li><strong>Chờ <em>online</em> rồi mới kích job</strong>, để job không bao giờ nằm trong hàng mà không có runner — và trước khi chạy script, tệp workflow phải có trên nhánh mặc định, vì cái 404 đã nói ở đầu bài.</li>
<li><strong>Lệnh cuối là phép kiểm.</strong> Sau job, danh sách runner không được còn cái tên đó. Nếu có gì kẹt, script thứ hai, <code>go-khan-cap.sh</code>, dừng mọi container <code>ga13-runner-*</code> và xoá mọi runner mang tiền tố đó qua <code>DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}</code>. Cách làm tương đương trên web: Settings → Actions → Runners → Remove → "Force remove this runner".</li>
</ul>

<h3>Bền hay ephemeral: cái gì đi theo job</h3>
${slide('ga-13', 14, 'Ephemeral trong container: thứ gì mất theo job, thứ gì còn')}
<table>
<thead><tr><th></th><th>Runner bền (config.sh một lần, chạy như dịch vụ trên máy)</th><th>Runner ephemeral trong container <code>--rm</code></th></tr></thead>
<tbody>
<tr><td>Số job mỗi lần đăng ký</td><td>vô hạn, tới khi bạn gỡ</td><td>đúng một</td></tr>
<tr><td>Tệp job trước để lại (<code>_work</code>, <code>/tmp</code>, thư mục nhà)</td><td>vẫn còn</td><td>mất cùng container</td></tr>
<tr><td>Tiến trình chạy nền</td><td>runner giết cuối job ("orphan processes", 13.3)</td><td>mất cùng container</td></tr>
<tr><td><code>GITHUB_TOKEN</code> trong <code>.git/config</code></td><td>bước post của <code>actions/checkout</code> gỡ nó — trừ khi job bị giết trước khi bước đó chạy</td><td>mất</td></tr>
<tr><td>Cache ấm (npm, tầng Docker, tool cache)</td><td>có</td><td>không — muốn có thì gắn một volume cache, và chấp nhận nó là thứ dùng chung</td></tr>
<tr><td>Cập nhật runner</td><td>tự động</td><td><code>--disableupdate</code> + dựng lại trong 30 ngày</td></tr>
<tr><td>Log <code>_diag</code></td><td>tích dần trên đĩa</td><td>mất — docs khuyên chuyển log ra ngoài trước khi đưa runner ephemeral lên production</td></tr>
</tbody>
</table>
<p>Tóm lại cho thật: ephemeral đổi <em>tốc độ</em> (cache lạnh mỗi job) lấy <em>sự cách ly</em> (không gì đi được từ job này sang job sau). Với runner build một dự án riêng tư cho một lập trình viên, runner bền có thể là cuộc đổi chác chấp nhận được; với bất cứ thứ gì dùng chung, ephemeral là mặc định mà docs ngầm giả định.</p>

<h3>Chạy thử từng bước: dựng ảnh mà không đăng ký gì</h3>
<ol>
<li>Chép <code>ch13/runner/Dockerfile</code> và <code>khoi-dong.sh</code> từ nhánh <code>ch13-runner</code> của sân tập vào một kho thử.</li>
<li>Thêm một workflow trên <code>ubuntu-24.04</code> chạy <code>docker build -t ga13-runner ch13/runner</code> rồi in <code>docker images</code>.</li>
<li>Thêm một bước: <code>docker run --rm --entrypoint ./config.sh ga13-runner --help</code>; tìm <code>--ephemeral</code>, <code>--labels</code> và <code>--no-default-labels</code> trong output.</li>
<li>Thêm ba lần khởi động sai của bài này, mỗi lần kèm <code>|| echo "exit=$?"</code> để job vẫn xanh.</li>
<li>Chạy <code>actionlint</code> trên một bản chép của <code>ch13-tu-host.yml</code>, thấy lỗi <code>runner-label</code>, rồi sửa bằng <code>.github/actionlint.yaml</code>.</li>
<li>Chỉ khi kho là <strong>riêng tư</strong>, bạn là admin của nó và máy có Docker: đưa workflow của job lên nhánh mặc định rồi chạy <code>chay-mot-job.sh</code>. Xong thì gỡ workflow đi.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: <code>--ephemeral</code> thay đổi gì, và vì sao được khuyên dùng?</strong><br>Đ: Runner nhận đúng một job và GitHub huỷ đăng ký nó sau đó. Đi kèm một VM hay container mới cho mỗi runner, không tệp, tiến trình hay thông tin xác thực nào đi từ job này sang job sau, và GitHub bảo đảm được việc giao đúng một job — điều nó không bảo đảm được với runner bền, chẳng hạn lúc runner đang tắt. Đây là nền được khuyên dùng cho mọi hệ tự co giãn.</p>
<p><strong>H: Làm sao đăng ký runner tự động mà không cất một secret sống lâu trên runner?</strong><br>Đ: Một bộ điều khiển có quyền admin (với tổ chức là một GitHub App) xin REST API một token đăng ký (sống một giờ) hoặc, tốt hơn, một cấu hình just-in-time bằng <code>generate-jitconfig</code>, rồi trao cho runner mới dưới dạng biến môi trường. Máy runner không bao giờ giữ thông tin xác thực sống lâu.</p>
<p><strong>H: Cỗ máy đứng sau một runner đã chết. Dọn dẹp thế nào?</strong><br>Đ: Gỡ đăng ký khỏi GitHub: Settings → Actions → Runners → "Force remove this runner", hoặc <code>DELETE /repos/{owner}/{repo}/actions/runners/{id}</code>. Không thì nó nằm trong danh sách ở trạng thái offline tới lần tự dọn (14 ngày, hoặc 1 ngày với runner ephemeral). Với máy còn vào được, <code>./config.sh remove --token &lt;token gỡ&gt;</code> xoá luôn cấu hình trên máy.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> đội bạn muốn có ảnh runner trước khi ai đó được cấp quyền admin để đăng ký. Dựng và kiểm mọi thứ không cần token.</p><ol>
<li>Làm bước 1–5 của mục "Chạy thử từng bước" trong kho thử của bạn.</li>
<li>Trong bước dựng, đo thời gian dựng và ghi lại kích thước ảnh.</li>
<li>Đổi <code>ARG RUNNER_VERSION</code> thành một phiên bản không tồn tại (ví dụ <code>9.9.9</code>) rồi push: đọc xem bản dựng hỏng thế nào, rồi đổi lại.</li>
<li>Viết vào chú thích đầu tệp workflow: workflow nào được dùng nhãn của runner, workflow nào không.</li>
</ol><p><strong>Đạt khi:</strong> run cho thấy ảnh đã dựng kèm kích thước, <code>config.sh --version</code> in đúng phiên bản bạn ghim, ba lỗi dự kiến (<code>thieu REPO_URL</code>, <code>Must not run with sudo</code>, <code>404 (Not Found)</code>), và actionlint qua khi nhãn đã được khai; và bạn nói được còn thiếu hai thứ gì để đăng ký một runner thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">ephemeral runner (runner dùng một lần)</span><span class="v">đăng ký với <code>--ephemeral</code>: nhận một job, rồi GitHub huỷ đăng ký</span></div>
<div class="kv"><span class="k">registration token (token đăng ký)</span><span class="v">từ <code>POST …/actions/runners/registration-token</code>; cần quyền admin; sống một giờ; dùng cho <code>config.sh --token</code></span></div>
<div class="kv"><span class="k">remove token (token gỡ)</span><span class="v">từ <code>POST …/actions/runners/remove-token</code>; dùng cho <code>config.sh remove --token</code></span></div>
<div class="kv"><span class="k">JIT runner</span><span class="v">just-in-time: khởi động bằng <code>run.sh --jitconfig</code> từ <code>generate-jitconfig</code>; tối đa một job, tự bị xoá</span></div>
<div class="kv"><span class="k"><code>--disableupdate</code></span><span class="v">tắt tự cập nhật của runner; bạn phải cập nhật trong 30 ngày sau mỗi bản mới</span></div>
<div class="kv"><span class="k"><code>--unattended</code></span><span class="v">không hỏi gì; bắt buộc cho script và container</span></div>
<div class="kv"><span class="k"><code>tini</code></span><span class="v">một tiến trình init tí hon cho container: chuyển tín hiệu, dọn tiến trình con</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Runner self-hosted sạch = <code>--ephemeral</code> (một job rồi bị huỷ đăng ký) + container <code>--rm</code> (tệp chết theo).</li>
<li>Đo trên runner GitHub-hosted: ảnh dựng trong 42 giây, nặng 882 MB, <code>config.sh</code> báo 2.337.0.</li>
<li>Ba lỗi đăng ký thật: thiếu biến thì script dừng, root nhận <code>Must not run with sudo</code>, token sai hoặc hết hạn là 404 từ <code>runner-registration</code>.</li>
<li>Token đăng ký và token gỡ lấy từ REST API, cần quyền admin, sống một giờ; cấu hình JIT là lối gọn hơn.</li>
<li>Đúng một workflow được dùng nhãn của runner, và nó chỉ có <code>workflow_dispatch</code> — không bao giờ <code>pull_request</code>.</li>
<li>Chưa chạy: đăng ký thật và chính job đó (thiếu token admin, thiếu Docker daemon, và dispatch cần tệp trên nhánh mặc định); <code>chay-mot-job.sh</code> làm việc đó.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Self-hosted runners reference: ephemeral, cập nhật</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/self-hosted-runners — <code>--ephemeral</code>, <code>--disableupdate</code>, luật cập nhật 30 ngày, chuyển log của runner ephemeral ra ngoài.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Adding self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners — các bước tải và <code>config.sh</code> chính thức mà Dockerfile này viết thành script.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Removing self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/remove-runners — lệnh gỡ, force remove, tự xoá sau 14 ngày (1 ngày với ephemeral).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Self-hosted runners</span><span class="lc-sub">docs.github.com/en/rest/actions/self-hosted-runners — token đăng ký, token gỡ, <code>generate-jitconfig</code>, xoá runner (đều cần quyền admin).</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — ch13/runner và ch13-dung-anh-runner.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner/ch13/runner — Dockerfile, khoi-dong.sh, chay-mot-job.sh, go-khan-cap.sh; run 36074652076.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — ảnh, người dùng và PID 1</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao ảnh chạy bằng người dùng không phải root, và tiến trình init làm gì trong container.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Self-hosted security, container jobs and service containers|||13.3 — Bảo mật self-hosted, container job và service container',
      slug: 'ga-13-3-bao-mat-self-hosted',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao không đặt runner self-hosted sau kho công khai, cài đặt duyệt PR từ fork, máy sạch và máy bẩn đo bằng hai job, log che secret nhưng ps thì không; rồi container job (docker.sock vẫn được mount vào) và service container Postgres chạy thật — có health-check và không có (bước đầu tới sớm 1,1 giây).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Self-hosted security, container jobs and service containers</h2>
<p class="lead">A self-hosted runner executes whatever the job tells it to, on your machine, with whatever that machine can reach. Three questions decide whether that is safe: <em>whose code</em> can reach the runner, <em>what the previous job left</em> on it, and <em>how far a job can see</em> beyond its own workspace. This lesson answers each with a measurement — and then uses the same measurements to explain the two container features every CI pipeline uses: <code>container:</code> and <code>services:</code>.</p>

<p>The sandbox workflows are <code>ch13-ban.yml</code> (clean or dirty machines, run ${RUN(36074706877)} and its failed first version ${RUN(36074652145)}) and <code>ch13-dich-vu.yml</code> (Postgres as a service container, run ${RUN(36074652000)}). Every secret-looking value in them is a fake string, <code>gia-tri-thu-khong-that-123</code>; the point is to show <em>where</em> a value travels, and how to stop it.</p>

<h3>Why not a self-hosted runner behind a public repository</h3>
${slide('ga-13', 15, 'Public repository + self-hosted runner = your machine runs a stranger’s code')}
<p>GitHub&#39;s docs are unusually blunt here: <em>"We recommend that you only use self-hosted runners with private repositories. This is because forks of your public repository can potentially run dangerous code on your self-hosted runner machine by creating a pull request that executes the code in a workflow."</em> The hardening guide goes further — self-hosted runners should "almost never be used for public repositories".</p>
<p>The mechanism needs no clever trick. A <code>pull_request</code> workflow runs the code <em>in the pull request</em>: its test files, its <code>package.json</code> scripts, its build configuration, even its edited copy of the workflow. On a GitHub-hosted runner that code lands on a throwaway VM with a read-only token and no secrets (Lesson 6). On a self-hosted runner it lands on <strong>your</strong> machine: inside your home network or next to your VPS, with your Docker, your SSH keys, and — on a persistent runner — the files of every later job.</p>
<p>GitHub offers one brake: the repository setting <strong>Approval for running fork pull request workflows from contributors</strong> (Settings → Actions → General). Its three levels, from the docs:</p>
<table>
<thead><tr><th>Setting</th><th>Who needs approval before their PR&#39;s workflows run</th><th>Catch</th></tr></thead>
<tbody>
<tr><td>Require approval for first-time contributors who are new to GitHub</td><td>new GitHub accounts that never had a commit or PR merged here</td><td>the weakest level</td></tr>
<tr><td>Require approval for first-time contributors (the default)</td><td>anyone who never had a commit or PR merged into this repository</td><td>the docs warn: getting one harmless typo fix merged is enough to skip approval from then on</td></tr>
<tr><td>Require approval for all external contributors</td><td>everyone who is not a member, owner or collaborator</td><td>the only level worth considering next to a self-hosted runner</td></tr>
</tbody>
</table>
<p>And even the strictest level is a brake, not a wall. The docs say it explicitly: these policies exist mainly to protect GitHub-hosted <em>compute</em>; on self-hosted runners, user-controlled code "will execute automatically if the user is allowed to bypass approval … or if the pull request is approved". An approval is a human reading a diff — and a build script can hide a lot from a tired reader. Workflows on <code>pull_request_target</code> are not covered at all: they always run, with the base repository&#39;s secrets, which is why Lesson 14.2 treats that event on its own.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "it is private, so it is fine".</strong> The docs&#39; warning continues past public repositories: on private and internal repositories, <em>anyone who can fork and open a pull request</em> — usually everyone with read access — can run code on the runner, and reach its secrets and its <code>GITHUB_TOKEN</code>. In a team, the question is not public or private; it is "who can make this runner execute their code, and what can that code reach from there?"</div>

<p>The rules that follow, and the ones this chapter&#39;s sandbox obeys:</p>
<ul>
<li><strong>No <code>pull_request</code> (or <code>pull_request_target</code>) workflow may use a self-hosted label.</strong> Self-hosted jobs start from <code>push</code> to protected branches, <code>workflow_dispatch</code>, or <code>schedule</code> — events only trusted people can cause.</li>
<li><strong>One label per trust level.</strong> The runner that holds deploy keys is not the runner that builds pull requests.</li>
<li><strong>In an organisation, use runner groups</strong> to restrict which repositories may send jobs to which runners, and the organisation setting that disables repository-level self-hosted runners altogether if nobody should add one on their own.</li>
<li><strong>Keep the machine poor.</strong> The docs ask two questions of every runner machine: what sensitive information lives on it (SSH keys, API tokens), and what sensitive services can it reach (cloud metadata endpoints, databases). The answer to both should be "as little as possible".</li>
</ul>

<h3>Clean or dirty: measured with two jobs</h3>
${slide('ga-13', 16, 'Hosted is clean after every job: two jobs, two machines, no trace')}
<p><code>ch13-ban.yml</code> has two jobs. The first, <code>de-lai</code>, leaves traces on purpose: a file in <code>/tmp</code>, a file in the home directory, and a background process that should outlive its step. The second, <code>xem-lai</code>, <code>needs</code> the first and looks for them. Run ${RUN(36074706877)}:</p>
<div class="out">--- job de-lai (RUNNER_NAME=GitHub Actions 1000004724)
tu job de-lai, run 36074706877              -&gt; /tmp/ch13-dau-vet and ~/ch13-dau-vet
da chay nen sleep 600, pid 2048
…
Cleaning up orphan processes
Terminate orphan process: pid (2048) (sleep)
Terminate orphan process: pid (2052) (bash)
Terminate orphan process: pid (2054) (sleep)

--- job xem-lai (RUNNER_NAME=GitHub Actions 1000004727)
sach: khong co /tmp/ch13-dau-vet
sach: khong co /home/runner/ch13-dau-vet
khong co tien trinh sleep nao</div>
<p>Two different mechanisms are visible here, and it matters which is which:</p>
<ul>
<li><strong>The runner itself kills orphan processes.</strong> "Cleaning up orphan processes" is printed by the runner program at the end of every job — hosted or self-hosted. The <code>sleep 600</code> meant to outlive its step was terminated when the <em>job</em> ended. That part of the clean-up you get on your own machine too.</li>
<li><strong>The files are gone only because the machine is gone.</strong> Job two ran on a different runner (<code>…4727</code> instead of <code>…4724</code>), a new VM. Nothing deleted <code>/tmp/ch13-dau-vet</code>; it simply never existed there. On a persistent self-hosted runner the second job runs on the <em>same</em> disk, and both files are still waiting for it.</li>
</ul>
<p>Now picture a real workflow of this course&#39;s repository on such a runner. <code>e2e-message-button.yml</code> in api-backend decodes the VPS deploy key into <code>~/.ssh/deploy_key</code> and writes <code>~/.ssh/config</code> with the VPS host and user. On a GitHub machine that file dies with the VM a minute later. On a persistent self-hosted runner, it would sit in the runner user&#39;s home directory for every job that runs there afterwards — including jobs that have nothing to do with deploying.</p>

<h3>What a shared machine gives away: arguments, logs, tokens</h3>
${slide('ga-13', 17, 'On a shared machine the log hides a secret, ps does not')}
<p>The docs&#39; hardening section names one leak precisely: <em>"Some jobs will use secrets as command-line arguments which can be seen by another job running on the same runner, such as <code>ps x -w</code>."</em> The sandbox reproduces the harmless half of that sentence — a job reading its <em>own</em> process list — with a fake value that is registered as a mask first:</p>
<div class="out">##[group]Run bash -c 'sleep 20; true' ch13 --token=*** &amp;
…
ps thay (log da che):
   2052 runner   bash -c sleep 20; true ch13 --token=***
so tien trinh co chuoi that trong doi so: 2</div>
<p>The log shows <code>***</code> twice, and it would be easy to stop there. But the last line counts processes whose command line contains the <em>real</em> string: two (the <code>bash</code>, and the <code>grep</code> that searched for it). Masking rewrites the log on its way to GitHub; it does nothing to <code>/proc</code>, where every process on the machine can read every other process&#39;s arguments. On a GitHub-hosted runner the only other processes are yours. On a shared self-hosted runner — or two runners on one machine — they are not.</p>
<p>The first version of this workflow (run ${RUN(36074652145)}) taught a second lesson by accident. It registered the mask and used the value <em>in the same step</em>, and the log&#39;s echo of that step&#39;s script — printed before the step ran — showed the literal value, because the mask did not exist yet. The fixed version registers the mask in a step of its own. (The same run also failed for an unrelated reason: <code>bash -c 'sleep 20'</code> with a single command replaces itself with <code>sleep</code> and the arguments vanish; <code>'sleep 20; true'</code> keeps them.)</p>
<p>Two more places where a job&#39;s secrets reach a runner&#39;s disk, both from 13.1 and 13.2:</p>
<ul>
<li><strong><code>_diag/Worker_*.log</code></strong> stores the job message, including the literal text of every <code>run:</code> script. A secret pasted into a script (instead of passed through <code>&#36;{{ secrets.X }}</code> into an <code>env:</code>) is on disk.</li>
<li><strong><code>.git/config</code></strong>: <code>actions/checkout</code> writes the job token into <code>http.https://github.com/.extraheader</code> and its post step removes it — every checkout log in this chapter ends with <code>git config --local --unset-all http.https://github.com/.extraheader</code>. A job killed before its post step (a crash, a cancelled run, a stopped container) leaves the header behind; on a persistent runner, <code>persist-credentials: false</code> avoids writing it in the first place.</li>
</ul>
<table>
<thead><tr><th>Leak on a shared runner</th><th>How to close it</th></tr></thead>
<tbody>
<tr><td>secret in command-line arguments</td><td>pass it in an environment variable, on stdin, or in a file under <code>$RUNNER_TEMP</code> — never as an argument</td></tr>
<tr><td>files in <code>/tmp</code>, home, workspace</td><td>ephemeral runner (13.2); on a persistent one, a clean-up step with <code>if: always()</code> — but it will not run if the job is killed</td></tr>
<tr><td>token in <code>.git/config</code></td><td><code>persist-credentials: false</code> on checkout when later steps do not need to push</td></tr>
<tr><td>scripts in <code>_diag</code></td><td>secrets only through <code>secrets.*</code> → <code>env:</code>; rotate <code>_diag</code>; forward logs off the machine</td></tr>
<tr><td>two trust levels on one machine</td><td>one runner (and one machine or VM) per trust level; separate labels and groups</td></tr>
</tbody>
</table>

<h3>container: — running the steps inside an image</h3>
${slide('ga-13', 18, 'container: is not a boundary — docker.sock is mounted into it')}
<p><code>jobs.&lt;id&gt;.container</code> runs every <code>run:</code> step of a job inside a container of your choosing, on a Linux runner with Docker. It is the easiest way to pin the environment — a Debian image with Node 22 regardless of what the runner image has this week — and it is available on both hosted and self-hosted runners. The sandbox job <code>trong-container</code>:</p>
<pre><code class="language-yaml">trong-container:
  runs-on: ubuntu-24.04
  container:
    image: node:22-bookworm-slim
  services:
    csdl:
      image: postgres:17-alpine
      env:
        POSTGRES_PASSWORD: gia-tri-thu-khong-that-123
      options: &gt;-
        --health-cmd "pg_isready -U postgres"
        --health-interval 2s --health-timeout 3s --health-retries 15</code></pre>
<p>The step "Initialize containers" (11 seconds here, most of it pulling two images) prints the exact command the runner uses to create the job container:</p>
<div class="out">/usr/bin/docker create --name 89323a6f3e9a45aebdaed8e98c303e8f_node22bookwormslim_76a707 --label 0db56a
  --workdir /__w/ga-san-tap/ga-san-tap --network github_network_d4f5dabd6c1e4f15b30dd3f42758743b
  -e "HOME=/github/home" -e GITHUB_ACTIONS=true -e CI=true
  -v "/var/run/docker.sock":"/var/run/docker.sock"
  -v "/home/runner/work":"/__w"
  -v "/home/runner/actions-runner/cached/2.337.0/externals":"/__e":ro
  -v "/home/runner/work/_temp":"/__w/_temp" -v "/home/runner/work/_actions":"/__w/_actions"
  -v "/opt/hostedtoolcache":"/__t"
  -v "/home/runner/work/_temp/_github_home":"/github/home"
  -v "/home/runner/work/_temp/_github_workflow":"/github/workflow"
  --entrypoint "tail" node:22-bookworm-slim "-f" "/dev/null"</div>
<p>And the first step, inside it:</p>
<div class="out">shell: sh -e {0}
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
whoami=root
GITHUB_WORKSPACE=/__w/ga-san-tap/ga-san-tap
PID 1 = tail -f /dev/null
node v22.23.3
172.18.0.3      csdl</div>
<ul>
<li><strong>The container just idles.</strong> Its entrypoint is <code>tail -f /dev/null</code>; the runner <code>docker exec</code>s each step into it. That is why PID 1 is <code>tail</code> and why the container lives for the whole job.</li>
<li><strong>Paths change.</strong> The runner&#39;s <code>/home/runner/work</code> is mounted at <code>/__w</code>, the tool cache at <code>/__t</code>, the runner&#39;s own Node (used to execute JavaScript actions inside the container) at <code>/__e</code>. Scripts that hard-code <code>/home/runner/work</code> break here — use <code>$GITHUB_WORKSPACE</code>.</li>
<li><strong>The default shell is <code>sh</code>, and you are root.</strong> The step ran with <code>sh -e {0}</code>, not the <code>bash -e</code> of every other job in this course, because the image decides. Bash syntax in a <code>run:</code> fails in images without bash; set <code>defaults.run.shell: bash</code> when the image has it. Files the job writes into the workspace are owned by root on the host — a classic source of "permission denied" on the next job of a persistent self-hosted runner.</li>
<li><strong><code>docker.sock</code> is mounted in.</strong> Any step in the "isolated" container can talk to the <em>host&#39;s</em> Docker daemon, start a privileged container and reach the host&#39;s file system. A container job is a way to choose an environment, <strong>not a security boundary</strong>. On a GitHub-hosted VM that does not matter; on your own machine it means a container job is as trusted as a job run directly on the host.</li>
</ul>

<h3>services: — a real Postgres for the tests, destroyed after the job</h3>
${slide('ga-13', 19, 'services: Postgres — the runner waits for the health check')}
<p>Service containers are the other half: extra containers that run next to the job — a database, Redis, a mock API — started before the first step and removed after the last. api-backend needs exactly this and does not have it: its CI runs unit tests without a database (<code>npm test</code> covers money maths and payment signatures), and its end-to-end workflow <code>e2e-message-button.yml</code> tests by creating and deleting a user in the <em>production</em> database over SSH. A service container gives such a test its own Postgres. The sandbox job <code>tren-may</code> runs the steps directly on the runner:</p>
<pre><code class="language-yaml">tren-may:
  runs-on: ubuntu-24.04
  services:
    csdl:
      image: postgres:17-alpine
      env:
        POSTGRES_PASSWORD: gia-tri-thu-khong-that-123   # real password: &#36;{{ secrets.X }}
        POSTGRES_DB: phongkham
      ports: ['5432:5432']
      options: &gt;-
        --health-cmd "pg_isready -U postgres"
        --health-interval 2s --health-timeout 3s --health-retries 15
  env:
    PGHOST: localhost
    PGUSER: postgres
    PGPASSWORD: gia-tri-thu-khong-that-123
    PGDATABASE: phongkham
  steps:
    - run: docker ps --format '{{.Names}} | {{.Image}} | {{.Status}} | {{.Ports}}'
    - run: |
        psql -c "create table lich (id serial primary key, benh_nhan text, gio timestamptz default now())"
        psql -c "insert into lich (benh_nhan) values ('An'), ('Binh')"
        psql -tAc "select count(*) || ' lich hen' from lich"</code></pre>
<p>What the runner did, in order (run ${RUN(36074652000)}, job <code>tren-may</code>):</p>
<div class="out">/usr/bin/docker create --name 1062a75d664f4e639fdb6190cb280f7d_postgres17alpine_97d309 --label ac7ab2
  --network github_network_4ee53f4b507a46a4b01c72bf27498356 --network-alias csdl -p 5432:5432
  --health-cmd "pg_isready -U postgres" --health-interval 2s --health-timeout 3s --health-retries 15
  -e "POSTGRES_PASSWORD=gia-tri-thu-khong-that-123" -e "POSTGRES_DB=phongkham" -e GITHUB_ACTIONS=true -e CI=true postgres:17-alpine
… Up Less than a second (health: starting)
5432/tcp -&gt; 0.0.0.0:5432
##[group]Waiting for all services to be ready
starting
csdl service is starting, waiting 2 seconds before checking again.
healthy
csdl service is healthy.
--- steps
1062a75d…_postgres17alpine_97d309 | postgres:17-alpine | Up 2 seconds (healthy) | 0.0.0.0:5432-&gt;5432/tcp
CREATE TABLE
INSERT 0 2
2 lich hen
17.11
--- after the last step
Print service container logs: 1062a75d…_postgres17alpine_97d309
Stop and remove container: 1062a75d…_postgres17alpine_97d309
Remove container network: github_network_4ee53f4b507a46a4b01c72bf27498356</div>
<table>
<thead><tr><th>Job runs…</th><th>Service address</th><th>Needs <code>ports:</code>?</th><th>Measured</th></tr></thead>
<tbody>
<tr><td>directly on the runner (<code>tren-may</code>)</td><td><code>localhost:5432</code></td><td>yes — the port is published on the host</td><td><code>psql</code> via localhost, <code>2 lich hen</code>, server 17.11</td></tr>
<tr><td>in a <code>container:</code> (<code>trong-container</code>)</td><td><code>csdl:5432</code> — the service&#39;s key is its hostname</td><td>no — both are on the same Docker network</td><td><code>172.18.0.3 csdl</code>; Node <code>pg</code> connected in <code>15 ms</code> to <code>PostgreSQL 17.11</code></td></tr>
</tbody>
</table>
<ul>
<li><strong>The runner waits for health checks.</strong> With <code>--health-cmd</code> in <code>options</code>, "Initialize containers" polls <code>docker inspect</code> every 2 seconds until the service is <code>healthy</code>, and only then starts step one. That wait is included in the 8 seconds the step took.</li>
<li><strong>Service logs are printed for free</strong> after the last step ("Print service container logs") — the first place to look when a test failed because the database refused something.</li>
<li><strong>Values in a service&#39;s <code>env:</code> are printed verbatim</strong> in the <code>docker create</code> line. Here that is a fake password; a real one must come from <code>&#36;{{ secrets.* }}</code>, which the log masks.</li>
<li><strong>Service containers need Docker on a Linux runner</strong> — on GitHub-hosted Ubuntu they simply work; on a self-hosted runner they need a Docker daemon the runner user can use, which brings back the socket question from the previous section.</li>
</ul>

<h3>Without a health check: the first step arrives 1.1 seconds early</h3>
${slide('ga-13', 20, 'No health check: the first step arrives before Postgres, by 1.1 s')}
<p>The third job, <code>khong-cho</code>, declares the same service <em>without</em> the <code>--health-*</code> options. The runner still printed <code>csdl service is healthy.</code> — with no health check defined, <code>docker inspect</code> returns an empty health status and the runner treats the service as ready at once. The first step then counted how long Postgres really took:</p>
<div class="out">san sang sau 5 lan thu, 1145 ms ke tu buoc dau tien</div>
<p>The step started at 23:49:59.666; the Postgres log says <code>database system is ready to accept connections</code> at 23:50:00.801. For about 1.1 seconds, a test suite or a <code>prisma migrate deploy</code> in step one would have met a refused connection — a failure that appears on some runs and not others, depending on how fast the image started that day. That is the definition of a flaky test (Lesson 10), manufactured by one missing line of YAML. Every database service gets a health check; if an image has no health command of its own, give it one (<code>pg_isready</code>, <code>redis-cli ping</code>, <code>mysqladmin ping</code>).</p>

<h3>Run it step by step: a test job with its own Postgres</h3>
<ol>
<li>In a repository with a Node project, add a job with <code>services: { csdl: { image: postgres:17-alpine, … } }</code> and the health-check options above.</li>
<li>Give the password through a repository secret (<code>&#36;{{ secrets.PG_TEST_PASSWORD }}</code>, a throwaway value) and build <code>DATABASE_URL=postgresql://postgres:$PGPASSWORD@localhost:5432/test</code> in <code>env:</code>.</li>
<li>Run your migrations (<code>npx prisma migrate deploy</code> for a Prisma project) and then the tests.</li>
<li>Copy the job into a second one with <code>container: node:22-bookworm-slim</code>, remove <code>ports:</code>, and change the host to <code>csdl</code>. Add <code>defaults: { run: { shell: bash } }</code> if your scripts use bash syntax.</li>
<li>Push; compare the two jobs&#39; "Initialize containers" times and read the service logs at the end of each.</li>
<li>Remove the health check from one job, push twice, and see whether step one ever fails. Put it back.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Why should you not attach a self-hosted runner to a public repository?</strong><br>A: Anyone can fork it and open a pull request, and a <code>pull_request</code> workflow runs the PR&#39;s own code. On a self-hosted runner that code runs on your machine, with its network and files, and on a persistent runner it can leave something behind for later jobs. Approval settings reduce the risk but rely on a reviewer spotting the problem; <code>pull_request_target</code> bypasses them. Use GitHub-hosted runners for public repositories.</p>
<p><strong>Q: Is <code>container:</code> a sandbox for untrusted code?</strong><br>A: No. The runner mounts the host&#39;s <code>/var/run/docker.sock</code>, the work directory and the tool cache into the job container, and steps run as root by default. It pins the environment; it does not isolate the host. Isolation comes from an ephemeral VM or machine per job.</p>
<p><strong>Q: How does a test job get a database in GitHub Actions?</strong><br>A: A service container: <code>services:</code> with the image, credentials from secrets, and a health check. The job reaches it at <code>localhost</code> with <code>ports:</code> when it runs on the runner, or at the service name when the job itself runs in a container. The runner waits for the health check, prints the service logs at the end and removes everything.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your project&#39;s tests need Postgres, and a teammate proposes running them on the office machine "because it already has Postgres". Show the alternative and its costs.</p><ol>
<li>Do steps 1–5 of "Run it step by step" in your repository.</li>
<li>Copy <code>ch13-ban.yml</code> from the sandbox; confirm that the second job finds no trace, and find the "Terminate orphan process" lines in the first.</li>
<li>In your repository settings, read the current value of "Approval for running fork pull request workflows from contributors" and write down which level it is.</li>
<li>Write three sentences for your teammate: what would stay on the office machine after a test job, and which of the leaks in this lesson would apply.</li>
</ol><p><strong>Done when:</strong> both service jobs are green (one via <code>localhost</code>, one via the service name), you have both "Initialize containers" times, <code>ch13-ban</code>&#39;s second job prints <code>sach</code> twice, and your three sentences name at least the workspace files, the processes and the secrets on disk.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">fork pull request (PR từ fork)</span><span class="v">a PR from a copy of the repository under another account; its workflows run the PR&#39;s code</span></div>
<div class="kv"><span class="k">approval for fork PR workflows</span><span class="v">repository setting that holds workflow runs from outside contributors until someone with write access approves</span></div>
<div class="kv"><span class="k">orphan process (tiến trình mồ côi)</span><span class="v">a process started by a step that is still alive when the job ends; the runner terminates it</span></div>
<div class="kv"><span class="k">container job</span><span class="v"><code>jobs.&lt;id&gt;.container</code>: steps run by <code>docker exec</code> inside an image; Linux runners with Docker only</span></div>
<div class="kv"><span class="k">service container</span><span class="v"><code>services:</code>: a container (database, cache…) that lives for the job and is reachable by name or by a published port</span></div>
<div class="kv"><span class="k">health check</span><span class="v"><code>--health-cmd</code> and friends in <code>options</code>; the runner waits for <code>healthy</code> before step one</span></div>
<div class="kv"><span class="k"><code>docker.sock</code></span><span class="v">the Docker daemon&#39;s control socket; whoever can use it controls the host</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Docs: self-hosted runners belong with private repositories; a fork PR on a public one runs a stranger&#39;s code on your machine.</li>
<li>Approval settings are a brake, not a wall; <code>pull_request_target</code> ignores them; never let a <code>pull_request</code> workflow use a self-hosted label.</li>
<li>Measured: the runner kills orphan processes at job end, but only a new machine removes files — two jobs, two VMs, no trace.</li>
<li>Masking protects logs, not <code>/proc</code>: secrets in arguments are visible to every process on a shared machine; <code>_diag</code> and <code>.git/config</code> can hold more.</li>
<li><code>container:</code> pins the environment but mounts <code>docker.sock</code>, runs as root and uses <code>sh</code> by default — not a security boundary.</li>
<li><code>services:</code> gives each job its own Postgres; add a health check, or step one can arrive 1.1 s before the database.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secure use reference: hardening for self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/reference/security/secure-use — public repositories, <code>ps x -w</code>, just-in-time runners, what to keep off the machine.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Approving workflow runs from forks</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks — the three approval levels and their warnings.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating PostgreSQL service containers</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers — runner jobs vs container jobs, health options.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;job_id&gt;.container and services</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — <code>image</code>, <code>credentials</code>, <code>ports</code>, <code>volumes</code>, <code>options</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — ch13-ban.yml and ch13-dich-vu.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner — runs 36074706877, 36074652145 and 36074652000.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — networks, health checks and the socket</span><span class="lc-sub">/courses/docker/learn${REF} — the same network aliases, health checks and <code>docker.sock</code> risks, outside CI.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Bảo mật self-hosted, container job và service container</h2>
<p class="lead">Runner self-hosted thực thi bất cứ gì job bảo nó, trên máy của bạn, với bất cứ thứ gì cỗ máy đó với tới được. Ba câu hỏi quyết định việc đó có an toàn không: <em>mã của ai</em> tới được runner, <em>job trước để lại gì</em> trên nó, và <em>một job nhìn xa được tới đâu</em> ngoài workspace của mình. Bài này trả lời từng câu bằng một phép đo — rồi dùng chính các phép đo đó để giải thích hai tính năng container mà pipeline CI nào cũng dùng: <code>container:</code> và <code>services:</code>.</p>

<p>Workflow sân tập là <code>ch13-ban.yml</code> (máy sạch hay máy bẩn, run ${RUN(36074706877)} và bản đầu bị đỏ ${RUN(36074652145)}) và <code>ch13-dich-vu.yml</code> (Postgres làm service container, run ${RUN(36074652000)}). Mọi giá trị trông giống secret trong đó đều là chuỗi giả, <code>gia-tri-thu-khong-that-123</code>; mục đích là cho thấy một giá trị đi <em>tới đâu</em>, và cách chặn nó.</p>

<h3>Vì sao không đặt runner self-hosted sau một kho công khai</h3>
${slide('ga-13', 15, 'Kho PUBLIC + self-hosted = máy của bạn chạy mã của người lạ')}
<p>Docs của GitHub nói thẳng hiếm thấy ở chỗ này: <em>"Chúng tôi khuyên chỉ dùng runner self-hosted với kho riêng tư. Lý do là các bản fork của kho công khai có thể chạy mã nguy hiểm trên máy runner self-hosted của bạn bằng cách tạo một pull request thực thi mã đó trong một workflow."</em> Hướng dẫn gia cố còn đi xa hơn — runner self-hosted "gần như không bao giờ nên dùng cho kho công khai".</p>
<p>Cơ chế không cần mánh khoé gì. Một workflow <code>pull_request</code> chạy mã <em>nằm trong pull request</em>: tệp test của nó, các script trong <code>package.json</code> của nó, cấu hình build của nó, kể cả bản workflow đã bị sửa của nó. Trên runner GitHub-hosted, mã đó rơi vào một VM dùng xong vứt, với token chỉ đọc và không có secret (Chương 6). Trên runner self-hosted, nó rơi vào máy <strong>của bạn</strong>: trong mạng nhà bạn hoặc cạnh VPS của bạn, với Docker của bạn, khoá SSH của bạn, và — trên runner bền — tệp của mọi job chạy sau.</p>
<p>GitHub đưa ra một cái phanh: cài đặt của kho <strong>Approval for running fork pull request workflows from contributors</strong> (Settings → Actions → General). Ba mức của nó, theo docs:</p>
<table>
<thead><tr><th>Cài đặt</th><th>Ai phải được duyệt trước khi workflow trong PR của họ chạy</th><th>Chỗ hở</th></tr></thead>
<tbody>
<tr><td>Require approval for first-time contributors who are new to GitHub</td><td>tài khoản GitHub mới, chưa từng có commit hay PR nào được merge vào kho này</td><td>mức yếu nhất</td></tr>
<tr><td>Require approval for first-time contributors (mặc định)</td><td>bất kỳ ai chưa từng có commit hay PR được merge vào kho này</td><td>docs cảnh báo: chỉ cần một PR sửa lỗi chính tả vô hại được merge là từ đó về sau khỏi phải duyệt</td></tr>
<tr><td>Require approval for all external contributors</td><td>mọi người không phải thành viên, chủ hay cộng tác viên</td><td>mức duy nhất đáng cân nhắc khi cạnh đó có runner self-hosted</td></tr>
</tbody>
</table>
<p>Và ngay cả mức chặt nhất cũng là cái phanh, không phải bức tường. Docs nói rõ: các chính sách này tồn tại chủ yếu để bảo vệ <em>tài nguyên tính toán</em> của GitHub; trên runner self-hosted, mã do người dùng điều khiển "sẽ tự động chạy nếu người đó được phép bỏ qua bước duyệt … hoặc nếu pull request được duyệt". Một lần duyệt là một con người đọc một bản diff — và một script build giấu được nhiều thứ trước một người đọc đang mệt. Workflow trên <code>pull_request_target</code> hoàn toàn không bị cài đặt này chặn: chúng luôn chạy, với secret của kho gốc, vì thế Bài 14.2 bàn riêng về sự kiện đó.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "kho riêng tư thì không sao".</strong> Lời cảnh báo của docs không dừng ở kho công khai: với kho riêng tư và kho internal, <em>bất kỳ ai fork được và mở được pull request</em> — thường là mọi người có quyền đọc — đều chạy được mã trên runner, và với tới secret cùng <code>GITHUB_TOKEN</code> của nó. Trong một đội, câu hỏi không phải công khai hay riêng tư; mà là "ai khiến được runner này chạy mã của họ, và từ đó mã ấy với tới được gì?"</div>

<p>Những luật rút ra, và cũng là luật sân tập của chương này tuân theo:</p>
<ul>
<li><strong>Không workflow <code>pull_request</code> (hay <code>pull_request_target</code>) nào được dùng nhãn self-hosted.</strong> Job self-hosted khởi động từ <code>push</code> lên nhánh được bảo vệ, <code>workflow_dispatch</code>, hoặc <code>schedule</code> — những sự kiện chỉ người đáng tin mới gây ra được.</li>
<li><strong>Mỗi mức tin cậy một nhãn.</strong> Runner giữ khoá deploy không phải là runner build pull request.</li>
<li><strong>Trong tổ chức, dùng nhóm runner</strong> để giới hạn kho nào được gửi job tới runner nào, và dùng cài đặt của tổ chức để tắt hẳn runner self-hosted cấp kho nếu không ai được tự ý thêm.</li>
<li><strong>Giữ cỗ máy "nghèo".</strong> Docs đặt hai câu hỏi cho mọi máy runner: trên nó có thông tin nhạy cảm gì (khoá SSH, token API), và nó với tới được dịch vụ nhạy cảm nào (endpoint metadata của cloud, cơ sở dữ liệu). Câu trả lời cho cả hai phải là "càng ít càng tốt".</li>
</ul>

<h3>Sạch hay bẩn: đo bằng hai job</h3>
${slide('ga-13', 16, 'Hosted sạch sau mỗi job: hai job, hai máy, không dấu vết')}
<p><code>ch13-ban.yml</code> có hai job. Job đầu, <code>de-lai</code>, cố ý để lại dấu vết: một tệp trong <code>/tmp</code>, một tệp trong thư mục nhà, và một tiến trình chạy nền lẽ ra sống lâu hơn bước của nó. Job thứ hai, <code>xem-lai</code>, <code>needs</code> job đầu và đi tìm chúng. Run ${RUN(36074706877)}:</p>
<div class="out">--- job de-lai (RUNNER_NAME=GitHub Actions 1000004724)
tu job de-lai, run 36074706877              -&gt; /tmp/ch13-dau-vet và ~/ch13-dau-vet
da chay nen sleep 600, pid 2048
…
Cleaning up orphan processes
Terminate orphan process: pid (2048) (sleep)
Terminate orphan process: pid (2052) (bash)
Terminate orphan process: pid (2054) (sleep)

--- job xem-lai (RUNNER_NAME=GitHub Actions 1000004727)
sach: khong co /tmp/ch13-dau-vet
sach: khong co /home/runner/ch13-dau-vet
khong co tien trinh sleep nao</div>
<p>Ở đây thấy được hai cơ chế khác nhau, và phân biệt được cái nào là cái nào rất quan trọng:</p>
<ul>
<li><strong>Chính runner giết các tiến trình mồ côi.</strong> "Cleaning up orphan processes" do chương trình runner in ra ở cuối mọi job — hosted hay self-hosted. Cái <code>sleep 600</code> định sống lâu hơn bước của nó bị kết liễu khi <em>job</em> kết thúc. Phần dọn dẹp này bạn cũng có trên máy của mình.</li>
<li><strong>Tệp biến mất chỉ vì cỗ máy biến mất.</strong> Job hai chạy trên một runner khác (<code>…4727</code> thay vì <code>…4724</code>), một VM mới. Không gì xoá <code>/tmp/ch13-dau-vet</code>; chỉ là nó chưa bao giờ tồn tại ở đó. Trên runner self-hosted bền, job hai chạy trên <em>cùng</em> một ổ đĩa, và cả hai tệp vẫn nằm chờ nó.</li>
</ul>
<p>Giờ hình dung một workflow thật của repo khoá này trên một runner như vậy. <code>e2e-message-button.yml</code> trong api-backend giải mã khoá deploy VPS vào <code>~/.ssh/deploy_key</code> và ghi <code>~/.ssh/config</code> kèm máy và người dùng của VPS. Trên máy của GitHub, tệp đó chết cùng VM một phút sau. Trên runner self-hosted bền, nó sẽ nằm trong thư mục nhà của người dùng runner cho mọi job chạy ở đó về sau — kể cả những job chẳng liên quan gì tới deploy.</p>

<h3>Một cỗ máy dùng chung để lộ gì: đối số, log, token</h3>
${slide('ga-13', 17, 'Máy dùng chung: log che secret, còn ps thì không')}
<p>Phần gia cố của docs gọi đích danh một chỗ rò: <em>"Một số job dùng secret làm đối số dòng lệnh, thứ mà một job khác chạy trên cùng runner nhìn thấy được, chẳng hạn bằng <code>ps x -w</code>."</em> Sân tập tái hiện nửa vô hại của câu đó — một job đọc danh sách tiến trình của <em>chính mình</em> — với một giá trị giả đã được đăng ký che (mask) từ trước:</p>
<div class="out">##[group]Run bash -c 'sleep 20; true' ch13 --token=*** &amp;
…
ps thay (log da che):
   2052 runner   bash -c sleep 20; true ch13 --token=***
so tien trinh co chuoi that trong doi so: 2</div>
<p>Log hiện <code>***</code> hai lần, và dừng ở đó thì rất dễ. Nhưng dòng cuối đếm số tiến trình có dòng lệnh chứa chuỗi <em>thật</em>: hai (cái <code>bash</code>, và chính cái <code>grep</code> đi tìm nó). Mask viết lại log trên đường gửi về GitHub; nó không làm gì với <code>/proc</code>, nơi mọi tiến trình trên máy đọc được đối số của mọi tiến trình khác. Trên runner GitHub-hosted, tiến trình khác duy nhất là của bạn. Trên runner self-hosted dùng chung — hay hai runner trên cùng một máy — thì không.</p>
<p>Bản đầu của workflow này (run ${RUN(36074652145)}) dạy thêm một bài một cách tình cờ. Nó đăng ký mask và dùng giá trị <em>trong cùng một bước</em>, và dòng log in lại script của bước đó — in ra trước khi bước chạy — hiện nguyên giá trị, vì lúc đó mask chưa tồn tại. Bản sửa đăng ký mask trong một bước riêng. (Cùng run đó còn đỏ vì một lý do khác: <code>bash -c 'sleep 20'</code> chỉ có một lệnh thì bash tự thay mình bằng <code>sleep</code> và đối số biến mất; <code>'sleep 20; true'</code> giữ được chúng.)</p>
<p>Còn hai chỗ nữa secret của job xuống tới đĩa runner, cả hai đều từ 13.1 và 13.2:</p>
<ul>
<li><strong><code>_diag/Worker_*.log</code></strong> lưu thông điệp job, gồm nguyên văn mọi script <code>run:</code>. Một secret dán thẳng vào script (thay vì đi qua <code>&#36;{{ secrets.X }}</code> vào <code>env:</code>) là nằm trên đĩa.</li>
<li><strong><code>.git/config</code></strong>: <code>actions/checkout</code> ghi token của job vào <code>http.https://github.com/.extraheader</code> và bước post của nó gỡ ra — mọi log checkout trong chương này đều kết thúc bằng <code>git config --local --unset-all http.https://github.com/.extraheader</code>. Một job bị giết trước bước post (sập, run bị huỷ, container bị dừng) để lại header đó; trên runner bền, <code>persist-credentials: false</code> tránh ghi nó ngay từ đầu.</li>
</ul>
<table>
<thead><tr><th>Chỗ rò trên runner dùng chung</th><th>Cách bịt</th></tr></thead>
<tbody>
<tr><td>secret nằm trong đối số dòng lệnh</td><td>truyền qua biến môi trường, qua stdin, hoặc qua tệp dưới <code>$RUNNER_TEMP</code> — không bao giờ làm đối số</td></tr>
<tr><td>tệp trong <code>/tmp</code>, thư mục nhà, workspace</td><td>runner ephemeral (13.2); với runner bền, một bước dọn có <code>if: always()</code> — nhưng nó không chạy nếu job bị giết</td></tr>
<tr><td>token trong <code>.git/config</code></td><td><code>persist-credentials: false</code> ở checkout khi các bước sau không cần push</td></tr>
<tr><td>script trong <code>_diag</code></td><td>secret chỉ đi qua <code>secrets.*</code> → <code>env:</code>; xoay vòng <code>_diag</code>; chuyển log khỏi máy</td></tr>
<tr><td>hai mức tin cậy trên một máy</td><td>mỗi mức tin cậy một runner (và một máy hay VM); nhãn và nhóm riêng</td></tr>
</tbody>
</table>

<h3>container: — chạy các bước bên trong một ảnh</h3>
${slide('ga-13', 18, 'container: không phải ranh giới — docker.sock được mount')}
<p><code>jobs.&lt;id&gt;.container</code> chạy mọi bước <code>run:</code> của một job bên trong một container bạn chọn, trên runner Linux có Docker. Đây là cách dễ nhất để ghim môi trường — một ảnh Debian có Node 22 bất kể ảnh runner tuần này có gì — và dùng được trên cả runner hosted lẫn self-hosted. Job sân tập <code>trong-container</code>:</p>
<pre><code class="language-yaml">trong-container:
  runs-on: ubuntu-24.04
  container:
    image: node:22-bookworm-slim
  services:
    csdl:
      image: postgres:17-alpine
      env:
        POSTGRES_PASSWORD: gia-tri-thu-khong-that-123
      options: &gt;-
        --health-cmd "pg_isready -U postgres"
        --health-interval 2s --health-timeout 3s --health-retries 15</code></pre>
<p>Bước "Initialize containers" (ở đây 11 giây, phần lớn là kéo hai ảnh) in ra đúng lệnh runner dùng để tạo container của job:</p>
<div class="out">/usr/bin/docker create --name 89323a6f3e9a45aebdaed8e98c303e8f_node22bookwormslim_76a707 --label 0db56a
  --workdir /__w/ga-san-tap/ga-san-tap --network github_network_d4f5dabd6c1e4f15b30dd3f42758743b
  -e "HOME=/github/home" -e GITHUB_ACTIONS=true -e CI=true
  -v "/var/run/docker.sock":"/var/run/docker.sock"
  -v "/home/runner/work":"/__w"
  -v "/home/runner/actions-runner/cached/2.337.0/externals":"/__e":ro
  -v "/home/runner/work/_temp":"/__w/_temp" -v "/home/runner/work/_actions":"/__w/_actions"
  -v "/opt/hostedtoolcache":"/__t"
  -v "/home/runner/work/_temp/_github_home":"/github/home"
  -v "/home/runner/work/_temp/_github_workflow":"/github/workflow"
  --entrypoint "tail" node:22-bookworm-slim "-f" "/dev/null"</div>
<p>Và bước đầu tiên, bên trong nó:</p>
<div class="out">shell: sh -e {0}
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
whoami=root
GITHUB_WORKSPACE=/__w/ga-san-tap/ga-san-tap
PID 1 = tail -f /dev/null
node v22.23.3
172.18.0.3      csdl</div>
<ul>
<li><strong>Container chỉ ngồi không.</strong> Entrypoint của nó là <code>tail -f /dev/null</code>; runner <code>docker exec</code> từng bước vào đó. Vì thế PID 1 là <code>tail</code> và container sống suốt job.</li>
<li><strong>Đường dẫn đổi.</strong> <code>/home/runner/work</code> của runner được mount vào <code>/__w</code>, tool cache vào <code>/__t</code>, Node riêng của runner (dùng để chạy action JavaScript bên trong container) vào <code>/__e</code>. Script nào viết cứng <code>/home/runner/work</code> là hỏng ở đây — dùng <code>$GITHUB_WORKSPACE</code>.</li>
<li><strong>Shell mặc định là <code>sh</code>, và bạn là root.</strong> Bước chạy bằng <code>sh -e {0}</code>, không phải <code>bash -e</code> như mọi job khác trong khoá, vì ảnh quyết định. Cú pháp bash trong <code>run:</code> sẽ hỏng với ảnh không có bash; đặt <code>defaults.run.shell: bash</code> khi ảnh có. Tệp job ghi vào workspace thuộc về root trên máy chủ — nguồn kinh điển của lỗi "permission denied" ở job sau trên runner self-hosted bền.</li>
<li><strong><code>docker.sock</code> được mount vào.</strong> Bất kỳ bước nào trong cái container "cách ly" ấy cũng nói chuyện được với Docker daemon của <em>máy chủ</em>, khởi động được container đặc quyền và với tới hệ thống tệp của máy chủ. Container job là cách chọn môi trường, <strong>không phải ranh giới bảo mật</strong>. Trên VM của GitHub điều đó không quan trọng; trên máy của bạn, nó nghĩa là một container job đáng tin đúng bằng một job chạy thẳng trên máy chủ.</li>
</ul>

<h3>services: — một Postgres thật cho bộ test, huỷ sau job</h3>
${slide('ga-13', 19, 'services: Postgres — runner tự chờ health-check')}
<p>Service container là nửa còn lại: các container phụ chạy cạnh job — một cơ sở dữ liệu, Redis, một API giả — khởi động trước bước đầu và bị gỡ sau bước cuối. api-backend cần đúng thứ này mà chưa có: CI của nó chạy unit test không có cơ sở dữ liệu (<code>npm test</code> chỉ phủ phép tính tiền và chữ ký thanh toán), còn workflow end-to-end <code>e2e-message-button.yml</code> thì kiểm bằng cách tạo rồi xoá một người dùng trong cơ sở dữ liệu <em>production</em> qua SSH. Một service container cho bài test ấy một Postgres của riêng nó. Job sân tập <code>tren-may</code> chạy các bước thẳng trên runner:</p>
<pre><code class="language-yaml">tren-may:
  runs-on: ubuntu-24.04
  services:
    csdl:
      image: postgres:17-alpine
      env:
        POSTGRES_PASSWORD: gia-tri-thu-khong-that-123   # mật khẩu thật: &#36;{{ secrets.X }}
        POSTGRES_DB: phongkham
      ports: ['5432:5432']
      options: &gt;-
        --health-cmd "pg_isready -U postgres"
        --health-interval 2s --health-timeout 3s --health-retries 15
  env:
    PGHOST: localhost
    PGUSER: postgres
    PGPASSWORD: gia-tri-thu-khong-that-123
    PGDATABASE: phongkham
  steps:
    - run: docker ps --format '{{.Names}} | {{.Image}} | {{.Status}} | {{.Ports}}'
    - run: |
        psql -c "create table lich (id serial primary key, benh_nhan text, gio timestamptz default now())"
        psql -c "insert into lich (benh_nhan) values ('An'), ('Binh')"
        psql -tAc "select count(*) || ' lich hen' from lich"</code></pre>
<p>Runner đã làm gì, theo thứ tự (run ${RUN(36074652000)}, job <code>tren-may</code>):</p>
<div class="out">/usr/bin/docker create --name 1062a75d664f4e639fdb6190cb280f7d_postgres17alpine_97d309 --label ac7ab2
  --network github_network_4ee53f4b507a46a4b01c72bf27498356 --network-alias csdl -p 5432:5432
  --health-cmd "pg_isready -U postgres" --health-interval 2s --health-timeout 3s --health-retries 15
  -e "POSTGRES_PASSWORD=gia-tri-thu-khong-that-123" -e "POSTGRES_DB=phongkham" -e GITHUB_ACTIONS=true -e CI=true postgres:17-alpine
… Up Less than a second (health: starting)
5432/tcp -&gt; 0.0.0.0:5432
##[group]Waiting for all services to be ready
starting
csdl service is starting, waiting 2 seconds before checking again.
healthy
csdl service is healthy.
--- các bước
1062a75d…_postgres17alpine_97d309 | postgres:17-alpine | Up 2 seconds (healthy) | 0.0.0.0:5432-&gt;5432/tcp
CREATE TABLE
INSERT 0 2
2 lich hen
17.11
--- sau bước cuối
Print service container logs: 1062a75d…_postgres17alpine_97d309
Stop and remove container: 1062a75d…_postgres17alpine_97d309
Remove container network: github_network_4ee53f4b507a46a4b01c72bf27498356</div>
<table>
<thead><tr><th>Job chạy…</th><th>Địa chỉ của service</th><th>Cần <code>ports:</code>?</th><th>Đo được</th></tr></thead>
<tbody>
<tr><td>thẳng trên runner (<code>tren-may</code>)</td><td><code>localhost:5432</code></td><td>có — cổng được mở ra trên máy chủ</td><td><code>psql</code> qua localhost, <code>2 lich hen</code>, máy chủ 17.11</td></tr>
<tr><td>trong <code>container:</code> (<code>trong-container</code>)</td><td><code>csdl:5432</code> — khoá của service chính là hostname</td><td>không — cả hai cùng một mạng Docker</td><td><code>172.18.0.3 csdl</code>; <code>pg</code> của Node kết nối trong <code>15 ms</code> tới <code>PostgreSQL 17.11</code></td></tr>
</tbody>
</table>
<ul>
<li><strong>Runner chờ health-check.</strong> Có <code>--health-cmd</code> trong <code>options</code>, bước "Initialize containers" hỏi <code>docker inspect</code> mỗi 2 giây tới khi service <code>healthy</code>, rồi mới bắt đầu bước một. Khoảng chờ đó nằm trong 8 giây của bước này.</li>
<li><strong>Log của service được in miễn phí</strong> sau bước cuối ("Print service container logs") — chỗ nhìn đầu tiên khi một bài test hỏng vì cơ sở dữ liệu từ chối điều gì đó.</li>
<li><strong>Giá trị trong <code>env:</code> của service bị in nguyên văn</strong> trong dòng <code>docker create</code>. Ở đây là mật khẩu giả; mật khẩu thật phải lấy từ <code>&#36;{{ secrets.* }}</code>, thứ mà log sẽ che.</li>
<li><strong>Service container cần Docker trên runner Linux</strong> — trên Ubuntu của GitHub chúng cứ thế mà chạy; trên runner self-hosted chúng cần một Docker daemon mà người dùng runner dùng được, và câu hỏi về socket ở mục trước quay lại.</li>
</ul>

<h3>Không health-check: bước đầu tới sớm 1,1 giây</h3>
${slide('ga-13', 20, 'Không health-check: bước đầu tới TRƯỚC Postgres 1,1 giây')}
<p>Job thứ ba, <code>khong-cho</code>, khai cùng service đó nhưng <em>không có</em> các option <code>--health-*</code>. Runner vẫn in <code>csdl service is healthy.</code> — không định nghĩa health-check thì <code>docker inspect</code> trả trạng thái rỗng, và runner coi service là sẵn sàng ngay. Bước đầu tiên khi đó đếm xem Postgres thật sự mất bao lâu:</p>
<div class="out">san sang sau 5 lan thu, 1145 ms ke tu buoc dau tien</div>
<p>Bước bắt đầu lúc 23:49:59.666; log của Postgres ghi <code>database system is ready to accept connections</code> lúc 23:50:00.801. Trong khoảng 1,1 giây đó, một bộ test hay một lệnh <code>prisma migrate deploy</code> ở bước một sẽ gặp kết nối bị từ chối — một lỗi xuất hiện ở lần chạy này mà không ở lần khác, tuỳ hôm đó ảnh khởi động nhanh hay chậm. Đó chính là định nghĩa của một bài test chập chờn (flaky, Chương 10), được sản xuất ra từ một dòng YAML bị thiếu. Service cơ sở dữ liệu nào cũng phải có health-check; ảnh nào không có lệnh kiểm riêng thì tự thêm cho nó (<code>pg_isready</code>, <code>redis-cli ping</code>, <code>mysqladmin ping</code>).</p>

<h3>Chạy thử từng bước: một job test có Postgres riêng</h3>
<ol>
<li>Trong một kho có dự án Node, thêm một job với <code>services: { csdl: { image: postgres:17-alpine, … } }</code> và các option health-check ở trên.</li>
<li>Đưa mật khẩu qua một secret của kho (<code>&#36;{{ secrets.PG_TEST_PASSWORD }}</code>, một giá trị dùng xong vứt) và dựng <code>DATABASE_URL=postgresql://postgres:$PGPASSWORD@localhost:5432/test</code> trong <code>env:</code>.</li>
<li>Chạy migration (<code>npx prisma migrate deploy</code> với dự án Prisma) rồi chạy test.</li>
<li>Chép job đó thành job thứ hai có <code>container: node:22-bookworm-slim</code>, bỏ <code>ports:</code>, đổi host thành <code>csdl</code>. Thêm <code>defaults: { run: { shell: bash } }</code> nếu script của bạn dùng cú pháp bash.</li>
<li>Push; so thời gian "Initialize containers" của hai job và đọc log service ở cuối mỗi job.</li>
<li>Bỏ health-check khỏi một job, push hai lần, xem bước một có lần nào hỏng không. Rồi trả nó lại.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Vì sao không nên gắn runner self-hosted vào một kho công khai?</strong><br>Đ: Ai cũng fork được và mở pull request được, và một workflow <code>pull_request</code> chạy chính mã của PR. Trên runner self-hosted, mã đó chạy trên máy của bạn, với mạng và tệp của nó, và trên runner bền nó có thể để lại thứ gì đó cho các job sau. Cài đặt duyệt giảm rủi ro nhưng dựa vào việc người duyệt nhìn ra vấn đề; <code>pull_request_target</code> thì bỏ qua chúng. Kho công khai dùng runner GitHub-hosted.</p>
<p><strong>H: <code>container:</code> có phải hộp cát cho mã không đáng tin không?</strong><br>Đ: Không. Runner mount <code>/var/run/docker.sock</code> của máy chủ, thư mục làm việc và tool cache vào container của job, và mặc định các bước chạy bằng root. Nó ghim môi trường; nó không cách ly máy chủ. Sự cách ly đến từ một VM hay một cỗ máy mới cho mỗi job.</p>
<p><strong>H: Trong GitHub Actions, job test lấy cơ sở dữ liệu ở đâu?</strong><br>Đ: Từ service container: <code>services:</code> với ảnh, thông tin đăng nhập lấy từ secret, và một health-check. Job với tới nó ở <code>localhost</code> kèm <code>ports:</code> khi chạy trên runner, hoặc bằng tên service khi chính job chạy trong container. Runner chờ health-check, in log của service ở cuối và gỡ mọi thứ.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bộ test của dự án cần Postgres, và một bạn trong nhóm đề xuất chạy chúng trên máy ở phòng lab "vì máy đó có sẵn Postgres rồi". Chỉ ra phương án thay thế và cái giá của nó.</p><ol>
<li>Làm bước 1–5 của mục "Chạy thử từng bước" trong kho của bạn.</li>
<li>Chép <code>ch13-ban.yml</code> từ sân tập; xác nhận job hai không thấy dấu vết nào, và tìm các dòng "Terminate orphan process" trong job một.</li>
<li>Trong cài đặt kho của bạn, đọc giá trị hiện tại của "Approval for running fork pull request workflows from contributors" và ghi lại nó là mức nào.</li>
<li>Viết ba câu cho bạn cùng nhóm: sau một job test, thứ gì sẽ nằm lại trên máy phòng lab, và những chỗ rò nào trong bài này áp dụng.</li>
</ol><p><strong>Đạt khi:</strong> cả hai job service đều xanh (một qua <code>localhost</code>, một qua tên service), bạn có cả hai con số "Initialize containers", job hai của <code>ch13-ban</code> in <code>sach</code> hai lần, và ba câu của bạn gọi tên ít nhất tệp workspace, tiến trình và secret trên đĩa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">fork pull request (PR từ fork)</span><span class="v">PR từ một bản sao của kho dưới tài khoản khác; workflow của nó chạy mã của PR</span></div>
<div class="kv"><span class="k">duyệt workflow của PR từ fork</span><span class="v">cài đặt của kho giữ các run từ người đóng góp bên ngoài lại tới khi người có quyền ghi duyệt</span></div>
<div class="kv"><span class="k">orphan process (tiến trình mồ côi)</span><span class="v">tiến trình do một bước khởi động mà vẫn sống khi job kết thúc; runner kết liễu nó</span></div>
<div class="kv"><span class="k">container job</span><span class="v"><code>jobs.&lt;id&gt;.container</code>: các bước chạy bằng <code>docker exec</code> bên trong một ảnh; chỉ trên runner Linux có Docker</span></div>
<div class="kv"><span class="k">service container</span><span class="v"><code>services:</code>: một container (CSDL, cache…) sống trong đời của job, với tới bằng tên hoặc qua cổng mở ra</span></div>
<div class="kv"><span class="k">health check (kiểm sức khoẻ)</span><span class="v"><code>--health-cmd</code> và các option cùng họ trong <code>options</code>; runner chờ <code>healthy</code> rồi mới chạy bước một</span></div>
<div class="kv"><span class="k"><code>docker.sock</code></span><span class="v">socket điều khiển của Docker daemon; ai dùng được nó là điều khiển được máy chủ</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Docs: runner self-hosted đi với kho riêng tư; một PR từ fork trên kho công khai chạy mã người lạ trên máy của bạn.</li>
<li>Cài đặt duyệt là cái phanh, không phải bức tường; <code>pull_request_target</code> bỏ qua nó; không bao giờ để workflow <code>pull_request</code> dùng nhãn self-hosted.</li>
<li>Đo được: runner giết tiến trình mồ côi cuối job, nhưng chỉ một cỗ máy mới mới xoá được tệp — hai job, hai VM, không dấu vết.</li>
<li>Mask bảo vệ log, không bảo vệ <code>/proc</code>: secret trong đối số thì mọi tiến trình trên máy dùng chung đều thấy; <code>_diag</code> và <code>.git/config</code> còn giữ thêm.</li>
<li><code>container:</code> ghim môi trường nhưng mount <code>docker.sock</code>, chạy bằng root và mặc định dùng <code>sh</code> — không phải ranh giới bảo mật.</li>
<li><code>services:</code> cho mỗi job một Postgres riêng; thêm health-check, không thì bước một có thể tới trước cơ sở dữ liệu 1,1 giây.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secure use reference: hardening for self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/reference/security/secure-use — kho công khai, <code>ps x -w</code>, runner just-in-time, những gì không nên để trên máy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Approving workflow runs from forks</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks — ba mức duyệt và các lời cảnh báo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating PostgreSQL service containers</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers — job trên runner và job trong container, option health.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;job_id&gt;.container và services</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — <code>image</code>, <code>credentials</code>, <code>ports</code>, <code>volumes</code>, <code>options</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — ch13-ban.yml và ch13-dich-vu.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch13-runner — run 36074706877, 36074652145 và 36074652000.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — mạng, health-check và socket</span><span class="lc-sub">/courses/docker/learn${REF} — cùng những network alias, health-check và rủi ro <code>docker.sock</code>, bên ngoài CI.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Scaling runners: ARC, autoscaling, and the home build machine|||13.4 — Mở rộng runner: ARC, tự co giãn, và máy build ở nhà',
      slug: 'ga-13-4-mo-rong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tự co giãn cần giải bài toán gì (dữ liệu job thật từ API), Actions Runner Controller trên Kubernetes theo từng bước của docs, Runner Scale Set Client và webhook workflow_job, rồi áp vào đúng bối cảnh của người học: biến máy nhà 12 nhân thành runner build cho api-backend — được gì, mất gì, và khi nào không đáng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Scaling runners: ARC, autoscaling, and the home build machine</h2>
<p class="lead">One runner is a machine that waits. A fleet is a machine-shaped cost that has to grow when fifty jobs arrive at 9 a.m. and shrink to nothing at night. This lesson explains what autoscaling actually has to solve, how GitHub&#39;s own answer — Actions Runner Controller on Kubernetes — solves it step by step, the lighter alternatives, and then applies all of it to a real, small case: the home machine that already builds this course&#39;s own website.</p>

<p>No Kubernetes cluster was run for this lesson; ARC is described from GitHub&#39;s documentation (09/2026), and every command shown for it is the documented one. The job data in the first section, and everything about api-backend, is real.</p>

<h3>What autoscaling has to solve</h3>
<p>GitHub-hosted runners scale by themselves: every job in Lesson 13.1 got its own VM a couple of seconds after it was queued. Once you own the machines, three questions become yours:</p>
<ul>
<li><strong>How many runners now?</strong> Enough that queued jobs do not wait, few enough that idle machines do not burn money. The only reliable input is the queue itself.</li>
<li><strong>How does a new runner get registered?</strong> Without a human pasting a token — so something with admin rights must ask the API for a registration token or JIT config (13.2) on the runner&#39;s behalf.</li>
<li><strong>When may a runner be destroyed?</strong> Only when it is not in the middle of a job — which is exactly what ephemeral runners make easy, and why the docs recommend them for autoscaling and warn that persistent runners can be assigned a job while shutting down.</li>
</ul>
<p>What an autoscaler reads about a job is ordinary API data. Here is what the Actions API returned for one of this chapter&#39;s jobs (run 36074805297):</p>
<div class="out">"name": "soi (ubuntu-24.04)",
"status": "completed", "conclusion": "success",
"labels": ["ubuntu-24.04"],
"runner_id": 1000004738,
"runner_name": "GitHub Actions 1000004738",
"runner_group_name": "GitHub Actions",
"created_at": "2026-09-24T23:51:37Z",
"started_at": "2026-09-24T23:51:39Z"</div>
<p>A queued job has the same shape with <code>status: "queued"</code> and no runner yet. The <code>labels</code> array is what an autoscaler matches against its pool; <code>created_at → started_at</code> (2 seconds here) is the number it exists to keep small. GitHub delivers the same information as the <code>workflow_job</code> webhook, whose <code>action</code> moves through <code>queued</code>, <code>in_progress</code> and <code>completed</code>.</p>

<h3>Actions Runner Controller: the reference design</h3>
${slide('ga-13', 21, 'ARC: one long-polling listener, runner pods equal to jobs waiting')}
<p>ARC is GitHub&#39;s Kubernetes operator for runners, described by the docs as "the reference implementation of GitHub&#39;s scale set APIs and the recommended Kubernetes-based solution for autoscaling self-hosted runners". Its "runner scale set" mode works like this, following the numbered steps of the docs&#39; architecture page:</p>
<ol>
<li>You install two Helm charts: the <strong>controller</strong> (once per cluster) and a <strong>runner scale set</strong> (once per group of identical runners). The scale set&#39;s installation name becomes the value of <code>runs-on</code>.</li>
<li>The controller asks GitHub for the runner group and creates the scale set on GitHub&#39;s side.</li>
<li>A <strong>listener pod</strong> starts and opens an HTTPS long-poll to GitHub — the same outbound-only pattern as a single runner in 13.1. It idles until it receives a "Job Available" message.</li>
<li>A workflow runs; GitHub routes jobs whose <code>runs-on</code> matches the scale set to it.</li>
<li>The listener checks it may scale up, acknowledges the message, and patches the <strong>EphemeralRunnerSet</strong> with the new number of replicas.</li>
<li>For each new runner the controller requests a <strong>just-in-time config</strong> and creates a runner pod (retrying up to five times if the pod fails). If no runner accepts the job, GitHub unassigns it after 24 hours.</li>
<li>The runner in the pod registers with its JIT config, long-polls, receives the job, runs it and streams its logs.</li>
<li>When the job completes, the controller checks with GitHub that the runner can be deleted, and deletes it.</li>
</ol>
<p>Installing it, as the docs&#39; quickstart shows (a cluster from minikube or kind is enough to try):</p>
<pre><code class="language-bash">NAMESPACE="arc-systems"
helm install arc \\
    --namespace "&#36;{NAMESPACE}" \\
    --create-namespace \\
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

INSTALLATION_NAME="arc-runner-set"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/&lt;your_org_or_repo&gt;"
helm install "&#36;{INSTALLATION_NAME}" \\
    --namespace "&#36;{NAMESPACE}" \\
    --create-namespace \\
    --set githubConfigUrl="&#36;{GITHUB_CONFIG_URL}" \\
    --set githubConfigSecret.github_token="&#36;{GITHUB_PAT}" \\
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set</code></pre>
<pre><code class="language-yaml"># a workflow that uses it
jobs:
  build:
    runs-on: arc-runner-set        # the installation name (or runnerScaleSetName)</code></pre>
<table>
<thead><tr><th>Setting (values.yaml)</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>minRunners</code></td><td>idle runners kept warm; the target is <code>minRunners</code> + jobs assigned. <code>0</code> = nothing runs when there is no work, and the first job waits for a pod to start</td></tr>
<tr><td><code>maxRunners</code></td><td>the ceiling — your cost cap. Leaving both unset scales with the number of jobs and down to zero</td></tr>
<tr><td><code>containerMode.type</code></td><td><code>dind</code> or <code>kubernetes</code> — required if jobs use <code>container:</code>, <code>services:</code> or Docker actions. The default <code>docker:dind</code> image runs the Docker daemon as root; the docs point to a rootless variant</td></tr>
<tr><td><code>githubConfigSecret</code></td><td>credentials: the docs recommend a <strong>GitHub App</strong> for repository and organisation scale sets; a classic PAT is required only at enterprise level</td></tr>
<tr><td><code>runnerScaleSetLabels</code></td><td>extra labels, so <code>runs-on</code> can use more than the installation name</td></tr>
</tbody>
</table>
<p>Two sentences from the docs are worth copying into any ARC plan. ARC "does not support scheduled maximum and minimum configurations" — if you want five warm runners during office hours and zero at night, a cron job has to change the values. And, as for single ephemeral runners, collect and keep the logs of the controller, the listeners and the runners <em>before</em> production, because an ephemeral pod takes its <code>_diag</code> with it.</p>

<h3>Three ways to scale — pick by the infrastructure you already have</h3>
${slide('ga-13', 22, 'Three ways to autoscale — choose by the infrastructure you already run')}
<table>
<thead><tr><th>Approach</th><th>Runs on</th><th>Mechanism</th><th>Fits when</th></tr></thead>
<tbody>
<tr><td><strong>ARC</strong></td><td>Kubernetes, via Helm</td><td>listener long-poll → replica count → ephemeral runner pods with JIT config</td><td>you already run a cluster and have people who operate it</td></tr>
<tr><td><strong>Runner Scale Set Client</strong></td><td>VMs, containers, bare metal; Linux, Windows, macOS</td><td>an open-source Go module (<code>github.com/actions/scaleset</code>) that speaks the same scale set API; you write how machines are created and destroyed</td><td>no Kubernetes, and you want control over provisioning</td></tr>
<tr><td><strong><code>workflow_job</code> webhook</strong></td><td>anything that can receive HTTP</td><td><code>queued</code> → create a runner; <code>completed</code> → remove it</td><td>small setups; the docs warn it depends on timely webhook delivery and suggest ARC or the client for larger volumes</td></tr>
<tr><td><strong>No autoscaling</strong></td><td>one or two fixed machines</td><td><code>config.sh</code> once, <code>svc.sh install</code> as a systemd service</td><td>one person or a small team, few jobs, a job that needs a strong machine</td></tr>
</tbody>
</table>
<p>The last row is not a failure to be sophisticated. Most teams that need a self-hosted runner need it for <em>one kind of job</em> — a heavy build, a job that must reach a private network — and a single well-labelled machine is the right size. Scale when the queue says so: when <code>started_at − created_at</code> for self-hosted jobs regularly grows beyond what the team tolerates, not before.</p>

<h3>The home machine as a build runner</h3>
${slide('ga-13', 23, 'The home machine as a build runner: SSH replaced by long-poll?')}
<p>This course&#39;s own website already runs a self-hosted build machine — it just does not call it a runner. Since 18 August 2026 the standard deploy is <code>bash deploy-nha.sh</code>, run by hand from the laptop: the committed code is pushed into a bare repository on the Fedora machine at home, which builds the backend and frontend images <em>in parallel</em> (12 cores, 31 GB of RAM, about 3–6 minutes), pushes them to GHCR, and the VPS only pulls and swaps. The project notes record why: building on the 6 GB VPS had to be sequential (about 15 minutes), a parallel build there was once killed with exit code 137, and the build cache grew to 7.6 GB on the same disk as Postgres until a deploy died with <code>no space left on device</code>.</p>
<p>A self-hosted runner on that machine would replace the SSH half of the script with the long-poll of 13.1:</p>
<pre><code class="language-yaml"># .github/workflows/build-nha.yml (sketch for the PRIVATE api-backend repository)
name: build-nha
on:
  workflow_dispatch:                 # started deliberately, like deploy-nha.sh today
permissions:
  contents: read
  packages: write                    # push images to GHCR with GITHUB_TOKEN
concurrency:
  group: build-nha                   # never two builds on one machine at once
  cancel-in-progress: false
jobs:
  build:
    runs-on: [self-hosted, linux, nha-build]
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@&lt;full SHA&gt;    # pinned, Lesson 12.4
        with:
          persist-credentials: false
      - run: docker buildx bake --push      # both images in parallel, warm cache on the local disk</code></pre>
<table>
<thead><tr><th></th><th>Today: <code>deploy-nha.sh</code> over SSH</th><th>With a runner labelled <code>nha-build</code></th></tr></thead>
<tbody>
<tr><td>Who starts it</td><td>the laptop, which must reach the home machine over SSH (via the VPS)</td><td>anyone with write access, from the Actions tab or <code>gh workflow run</code> — from any network</td></tr>
<tr><td>Network needed</td><td>port 22 (or the 993 workaround of 18/09/2026, when the school network blocked 22)</td><td>only outbound 443 from the home machine</td></tr>
<tr><td>Log</td><td>the laptop&#39;s terminal</td><td>the run page, kept with the commit</td></tr>
<tr><td>Warm Docker cache</td><td>yes</td><td>yes — a persistent runner is chosen here precisely for it</td></tr>
<tr><td>Home machine switched off</td><td>the script falls back to <code>deploy.sh</code> by itself</td><td>the job waits in the queue (up to 24 hours) — keep the fallback as a separate path</td></tr>
<tr><td>Checks before pushing</td><td>the script runs tsc, tests and evals itself</td><td>the same commands as steps; the log shows which one failed</td></tr>
</tbody>
</table>
<p>The conditions matter more than the YAML. <strong>The repository is private</strong> — the runner is registered on api-backend, never on a public repository. <strong>Only <code>workflow_dispatch</code></strong> (or a push to <code>main</code> by people who can already deploy) uses the label. <strong>A dedicated user</strong> runs the service, with no access to the owner&#39;s SSH keys; it does need Docker, and membership of the <code>docker</code> group is equivalent to root on that machine — so the home machine becomes a machine whose security the deploy depends on, exactly as it already is with <code>deploy-nha.sh</code>. <strong>Never on the VPS itself</strong>: a build job on the production machine competes with Postgres for the same RAM and disk that failed twice in this project&#39;s history.</p>

<h3>When it is worth hosting your own</h3>
${slide('ga-13', 24, 'When self-hosting is worth it — five questions before switching one on')}
<table>
<thead><tr><th>Question</th><th>If yes</th><th>If no</th></tr></thead>
<tbody>
<tr><td>Is the repository public?</td><td>stop — use GitHub-hosted runners</td><td>go on</td></tr>
<tr><td>Do jobs need something hosted runners lack (GPU, LAN access, more than 16 GB RAM, data that must not leave, a warm multi-GB cache)?</td><td>self-hosted, or a larger runner</td><td>standard hosted runners are enough</td></tr>
<tr><td>Are hosted minutes actually expensive (a private repository, thousands of minutes a month)?</td><td>compare machine + power + your hours with $0.006/min</td><td>hosted is cheaper than your time</td></tr>
<tr><td>Will someone patch the OS, update the runner within 30 days and read <code>_diag</code>?</td><td>go on</td><td>stay on hosted</td></tr>
<tr><td>Can you make it ephemeral (a VM or container per job)?</td><td>do it</td><td>accept a persistent machine only for a private repository and one team that trusts each other</td></tr>
</tbody>
</table>

<h3>Run it step by step: size a runner from your own numbers</h3>
<ol>
<li>List the last 50 runs of your busiest workflow: <code>gh run list --workflow ci.yml --limit 50 --json databaseId,createdAt,updatedAt</code>.</li>
<li>For five of them, read the jobs (<code>gh api repos/OWNER/REPO/actions/runs/ID/jobs</code>) and write down <code>labels</code>, <code>created_at</code>, <code>started_at</code> and <code>completed_at</code>.</li>
<li>Compute queue time and run time per job, and the total minutes per month (for a private repository, multiply by the per-minute price).</li>
<li>Answer the five questions of the table above for that workflow.</li>
<li>If the answer is "self-hosted": write the <code>runs-on</code> line, the label, the trigger events allowed to use it, and whether the runner is ephemeral or persistent — and why.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How would you autoscale self-hosted runners?</strong><br>A: With ephemeral runners, driven by the job queue. On Kubernetes, Actions Runner Controller: a listener long-polls GitHub, scales an ephemeral runner set to the number of jobs within <code>minRunners</code>/<code>maxRunners</code>, each pod registers with a just-in-time config and is deleted after its job. Without Kubernetes, the Runner Scale Set Client on VMs, or — for small setups — the <code>workflow_job</code> webhook. Authenticate with a GitHub App, and ship runner logs off the pods.</p>
<p><strong>Q: Why ephemeral runners for autoscaling?</strong><br>A: Scaling down means destroying machines, and only an ephemeral runner is guaranteed not to be in the middle of a job when you do — GitHub cannot guarantee that for persistent runners. They also give every job a clean environment.</p>
<p><strong>Q: A team asks for a self-hosted runner "to save money". What do you ask first?</strong><br>A: Is the repository public (then no)? Is the problem minutes or something hosted runners cannot do? Who maintains the machine, updates the runner within 30 days and handles isolation? For a private repository, compare the real monthly minutes times $0.006 with the machine and the hours — the cheaper option is often the hosted one, or a larger hosted runner for the one heavy job.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group&#39;s capstone repository is private, CI takes 9 minutes on hosted runners, and one member offers a gaming PC as a runner. Decide, with numbers.</p><ol>
<li>Do steps 1–3 of "Run it step by step" on your own busiest repository (or on the sandbox&#39;s <code>ch13-*</code> runs if yours has none).</li>
<li>Fill the five-question table for the scenario.</li>
<li>Write the <code>runs-on</code>, trigger and <code>concurrency</code> lines you would use if the answer is yes — or the one-sentence reason if it is no.</li>
</ol><p><strong>Done when:</strong> you have a queue-time and run-time figure per job, a monthly minutes estimate with its price, a completed table, and a decision that names the label, the allowed events and ephemeral vs persistent.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">autoscaling (tự co giãn)</span><span class="v">adding and removing runners automatically from the job queue</span></div>
<div class="kv"><span class="k">ARC</span><span class="v">Actions Runner Controller: GitHub&#39;s Kubernetes operator for self-hosted runners</span></div>
<div class="kv"><span class="k">runner scale set</span><span class="v">a group of identical runners that GitHub scales through the scale set API; its name is used in <code>runs-on</code></span></div>
<div class="kv"><span class="k">listener pod</span><span class="v">the ARC pod that long-polls GitHub and asks for more runner pods</span></div>
<div class="kv"><span class="k"><code>minRunners</code> / <code>maxRunners</code></span><span class="v">warm runners kept idle, and the cost ceiling</span></div>
<div class="kv"><span class="k"><code>workflow_job</code></span><span class="v">webhook sent when a job is queued, starts and completes</span></div>
<div class="kv"><span class="k"><code>svc.sh</code></span><span class="v">script created by <code>config.sh</code> on Linux/macOS to install the runner as a service</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Autoscaling answers three questions: how many runners now, how they register without a human, and when they may be destroyed.</li>
<li>The input is the job queue — the same <code>labels</code>, <code>created_at</code>, <code>started_at</code> the API returns, or the <code>workflow_job</code> webhook.</li>
<li>ARC: listener long-polls, scales an ephemeral runner set between <code>minRunners</code> and <code>maxRunners</code>, pods register with JIT config and are deleted after one job.</li>
<li>Without Kubernetes: the Runner Scale Set Client, or webhooks for small setups; or simply one well-labelled machine.</li>
<li>The home build machine fits a persistent runner on a private repository, dispatch-only, with a dedicated user — and a fallback for when it is off.</li>
<li>Never self-host for a public repository; never put the build runner on the production VPS.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Actions Runner Controller</span><span class="lc-sub">docs.github.com/en/actions/concepts/runners/actions-runner-controller — the architecture steps, resources and runner image.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Get started with Actions Runner Controller</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-actions-runner-controller/get-started — the two Helm installs and a first workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deploying runner scale sets</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/use-actions-runner-controller/deploy-runner-scale-sets — <code>minRunners</code>, <code>maxRunners</code>, container modes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Self-hosted runners reference: autoscaling</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/self-hosted-runners — ARC, the Scale Set Client, ephemeral runners, <code>workflow_job</code> webhooks.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Configuring the runner application as a service</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application — <code>svc.sh install</code> on systemd.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — building off the server</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — why the build moved off the 6 GB VPS, and how images travel through GHCR.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Mở rộng runner: ARC, tự co giãn, và máy build ở nhà</h2>
<p class="lead">Một runner là một cỗ máy ngồi chờ. Một đàn runner là một khoản chi phí có hình cỗ máy, phải lớn lên khi năm mươi job ập tới lúc 9 giờ sáng và co về không lúc nửa đêm. Bài này giải thích tự co giãn (autoscaling) thật ra phải giải bài toán gì, lời giải của chính GitHub — Actions Runner Controller trên Kubernetes — giải nó từng bước ra sao, các lựa chọn nhẹ hơn, rồi áp tất cả vào một trường hợp nhỏ và thật: cỗ máy ở nhà đang build chính website của khoá học này.</p>

<p>Bài này không chạy cụm Kubernetes nào; ARC được mô tả theo tài liệu của GitHub (09/2026), và mọi lệnh cho nó là lệnh trong tài liệu. Dữ liệu job ở mục đầu, và mọi thứ về api-backend, là thật.</p>

<h3>Tự co giãn phải giải bài toán gì</h3>
<p>Runner GitHub-hosted tự co giãn: mọi job ở Bài 13.1 đều có VM riêng chỉ vài giây sau khi vào hàng. Khi máy là của bạn, ba câu hỏi thành việc của bạn:</p>
<ul>
<li><strong>Bây giờ cần bao nhiêu runner?</strong> Đủ để job trong hàng không phải chờ, đủ ít để máy rảnh không đốt tiền. Đầu vào đáng tin duy nhất là chính hàng chờ.</li>
<li><strong>Runner mới được đăng ký bằng cách nào?</strong> Không cần người dán token — nên phải có một thứ có quyền admin xin API token đăng ký hay cấu hình JIT (13.2) thay cho runner.</li>
<li><strong>Khi nào được huỷ một runner?</strong> Chỉ khi nó không đang giữa một job — đúng thứ mà runner ephemeral làm cho dễ, và là lý do docs khuyên dùng chúng cho tự co giãn, đồng thời cảnh báo runner bền có thể bị giao job đúng lúc đang tắt.</li>
</ul>
<p>Thứ một bộ tự co giãn đọc về một job là dữ liệu API bình thường. Đây là thứ API của Actions trả về cho một job của chương này (run 36074805297):</p>
<div class="out">"name": "soi (ubuntu-24.04)",
"status": "completed", "conclusion": "success",
"labels": ["ubuntu-24.04"],
"runner_id": 1000004738,
"runner_name": "GitHub Actions 1000004738",
"runner_group_name": "GitHub Actions",
"created_at": "2026-09-24T23:51:37Z",
"started_at": "2026-09-24T23:51:39Z"</div>
<p>Một job đang chờ có cùng hình dạng, với <code>status: "queued"</code> và chưa có runner. Mảng <code>labels</code> là thứ bộ tự co giãn so với đàn máy của nó; khoảng <code>created_at → started_at</code> (ở đây 2 giây) là con số nó tồn tại để giữ cho nhỏ. GitHub gửi cùng thông tin đó qua webhook <code>workflow_job</code>, với trường <code>action</code> đi qua <code>queued</code>, <code>in_progress</code> rồi <code>completed</code>.</p>

<h3>Actions Runner Controller: thiết kế tham chiếu</h3>
${slide('ga-13', 21, 'ARC: một listener long-poll, số runner pod bằng số job đang chờ')}
<p>ARC là operator Kubernetes cho runner của GitHub, được docs mô tả là "bản hiện thực tham chiếu của API scale set của GitHub và giải pháp trên Kubernetes được khuyên dùng để tự co giãn runner self-hosted". Chế độ "runner scale set" của nó chạy như sau, theo đúng các bước đánh số trên trang kiến trúc của docs:</p>
<ol>
<li>Bạn cài hai Helm chart: <strong>controller</strong> (mỗi cụm một lần) và một <strong>runner scale set</strong> (mỗi nhóm runner giống nhau một lần). Tên cài đặt của scale set trở thành giá trị của <code>runs-on</code>.</li>
<li>Controller hỏi GitHub nhóm runner rồi tạo scale set ở phía GitHub.</li>
<li>Một <strong>listener pod</strong> khởi động và mở một long-poll HTTPS tới GitHub — đúng kiểu chỉ-đi-ra như một runner đơn ở 13.1. Nó ngồi chờ tới khi nhận thông điệp "Job Available".</li>
<li>Một workflow chạy; GitHub đưa các job có <code>runs-on</code> khớp scale set tới nó.</li>
<li>Listener kiểm xem có được tăng không, xác nhận thông điệp, và patch <strong>EphemeralRunnerSet</strong> với số bản sao mới.</li>
<li>Với mỗi runner mới, controller xin một <strong>cấu hình just-in-time</strong> và tạo một runner pod (thử lại tới năm lần nếu pod hỏng). Nếu không runner nào nhận job, GitHub bỏ giao job sau 24 giờ.</li>
<li>Runner trong pod đăng ký bằng cấu hình JIT, long-poll, nhận job, chạy nó và gửi log về.</li>
<li>Job xong, controller hỏi GitHub xem runner xoá được chưa, rồi xoá nó.</li>
</ol>
<p>Cài đặt, như phần bắt đầu nhanh của docs (một cụm từ minikube hay kind là đủ để thử):</p>
<pre><code class="language-bash">NAMESPACE="arc-systems"
helm install arc \\
    --namespace "&#36;{NAMESPACE}" \\
    --create-namespace \\
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

INSTALLATION_NAME="arc-runner-set"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/&lt;to_chuc_hoac_kho&gt;"
helm install "&#36;{INSTALLATION_NAME}" \\
    --namespace "&#36;{NAMESPACE}" \\
    --create-namespace \\
    --set githubConfigUrl="&#36;{GITHUB_CONFIG_URL}" \\
    --set githubConfigSecret.github_token="&#36;{GITHUB_PAT}" \\
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set</code></pre>
<pre><code class="language-yaml"># workflow dùng nó
jobs:
  build:
    runs-on: arc-runner-set        # tên cài đặt (hoặc runnerScaleSetName)</code></pre>
<table>
<thead><tr><th>Cài đặt (values.yaml)</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>minRunners</code></td><td>số runner rảnh được giữ ấm; mục tiêu là <code>minRunners</code> + số job được giao. <code>0</code> = không có việc thì không chạy gì, và job đầu tiên phải chờ một pod khởi động</td></tr>
<tr><td><code>maxRunners</code></td><td>trần — mức chặn chi phí của bạn. Bỏ trống cả hai thì co giãn theo số job và co về không</td></tr>
<tr><td><code>containerMode.type</code></td><td><code>dind</code> hoặc <code>kubernetes</code> — bắt buộc nếu job dùng <code>container:</code>, <code>services:</code> hay Docker action. Ảnh <code>docker:dind</code> mặc định chạy Docker daemon bằng root; docs chỉ tới một biến thể rootless</td></tr>
<tr><td><code>githubConfigSecret</code></td><td>thông tin xác thực: docs khuyên dùng <strong>GitHub App</strong> cho scale set cấp kho và cấp tổ chức; PAT kiểu classic chỉ bắt buộc ở cấp enterprise</td></tr>
<tr><td><code>runnerScaleSetLabels</code></td><td>nhãn thêm, để <code>runs-on</code> dùng được nhiều hơn tên cài đặt</td></tr>
</tbody>
</table>
<p>Hai câu trong docs đáng chép vào mọi kế hoạch ARC. ARC "không hỗ trợ cấu hình tối đa và tối thiểu theo lịch" — muốn năm runner ấm giờ hành chính và không cái nào ban đêm thì phải có một cron job đổi giá trị. Và, cũng như runner ephemeral đơn lẻ, hãy thu và giữ log của controller, listener và runner <em>trước khi</em> lên production, vì pod ephemeral mang <code>_diag</code> của nó đi theo.</p>

<h3>Ba cách co giãn — chọn theo hạ tầng bạn đang có</h3>
${slide('ga-13', 22, 'Ba cách tự co giãn runner — chọn theo hạ tầng bạn ĐANG có')}
<table>
<thead><tr><th>Cách</th><th>Chạy ở đâu</th><th>Cơ chế</th><th>Hợp khi</th></tr></thead>
<tbody>
<tr><td><strong>ARC</strong></td><td>Kubernetes, qua Helm</td><td>listener long-poll → số bản sao → runner pod ephemeral với cấu hình JIT</td><td>bạn đã chạy một cụm và có người vận hành nó</td></tr>
<tr><td><strong>Runner Scale Set Client</strong></td><td>VM, container, máy thật; Linux, Windows, macOS</td><td>một module Go mã nguồn mở (<code>github.com/actions/scaleset</code>) nói cùng API scale set; bạn tự viết cách tạo và huỷ máy</td><td>không có Kubernetes, và muốn tự điều khiển việc cấp máy</td></tr>
<tr><td><strong>Webhook <code>workflow_job</code></strong></td><td>bất cứ đâu nhận được HTTP</td><td><code>queued</code> → tạo một runner; <code>completed</code> → gỡ nó</td><td>hệ nhỏ; docs cảnh báo nó phụ thuộc vào webhook tới đúng lúc và gợi ý ARC hay client khi lưu lượng lớn</td></tr>
<tr><td><strong>Không co giãn</strong></td><td>một hai máy cố định</td><td><code>config.sh</code> một lần, <code>svc.sh install</code> thành dịch vụ systemd</td><td>một người hoặc đội nhỏ, ít job, một job cần máy mạnh</td></tr>
</tbody>
</table>
<p>Hàng cuối không phải là thất bại trong việc làm cho tinh vi. Hầu hết các đội cần runner self-hosted là cần cho <em>một loại job</em> — một bản build nặng, một job phải vào được mạng riêng — và một cỗ máy gắn nhãn cẩn thận là đúng cỡ. Hãy mở rộng khi hàng chờ bảo thế: khi <code>started_at − created_at</code> của các job self-hosted thường xuyên vượt quá mức đội chịu được, chứ không phải trước đó.</p>

<h3>Máy nhà làm runner build</h3>
${slide('ga-13', 23, 'Máy nhà làm runner build: thay SSH bằng long-poll?')}
<p>Chính website của khoá này đã có một cỗ máy build tự lo — chỉ là chưa gọi nó là runner. Từ 18/08/2026, đường deploy chuẩn là <code>bash deploy-nha.sh</code>, chạy tay từ laptop: mã đã commit được đẩy vào một kho trần trên máy Fedora ở nhà, máy đó build ảnh backend và frontend <em>song song</em> (12 nhân, 31 GB RAM, khoảng 3–6 phút), đẩy lên GHCR, còn VPS chỉ kéo về và tráo. Ghi chép của dự án nói rõ vì sao: build trên VPS 6 GB phải tuần tự (khoảng 15 phút), một lần build song song ở đó từng bị giết với mã thoát 137, và cache build phình tới 7,6 GB trên cùng ổ đĩa với Postgres cho tới khi một lần deploy chết vì <code>no space left on device</code>.</p>
<p>Một runner self-hosted trên cỗ máy đó sẽ thay nửa SSH của script bằng long-poll ở 13.1:</p>
<pre><code class="language-yaml"># .github/workflows/build-nha.yml (bản phác cho kho RIÊNG TƯ api-backend)
name: build-nha
on:
  workflow_dispatch:                 # khởi động có chủ đích, như deploy-nha.sh hôm nay
permissions:
  contents: read
  packages: write                    # đẩy ảnh lên GHCR bằng GITHUB_TOKEN
concurrency:
  group: build-nha                   # không bao giờ hai bản build trên một máy cùng lúc
  cancel-in-progress: false
jobs:
  build:
    runs-on: [self-hosted, linux, nha-build]
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@&lt;SHA đầy đủ&gt;    # ghim, Bài 12.4
        with:
          persist-credentials: false
      - run: docker buildx bake --push      # hai ảnh song song, cache ấm trên đĩa máy nhà</code></pre>
<table>
<thead><tr><th></th><th>Hôm nay: <code>deploy-nha.sh</code> qua SSH</th><th>Với một runner nhãn <code>nha-build</code></th></tr></thead>
<tbody>
<tr><td>Ai khởi động</td><td>laptop, phải SSH được tới máy nhà (qua VPS)</td><td>bất kỳ ai có quyền ghi, từ tab Actions hoặc <code>gh workflow run</code> — từ mạng nào cũng được</td></tr>
<tr><td>Mạng cần có</td><td>cổng 22 (hoặc đường vòng 993 từ 18/09/2026, khi mạng trường chặn cổng 22)</td><td>chỉ 443 đi ra từ máy nhà</td></tr>
<tr><td>Log</td><td>terminal của laptop</td><td>trang run, gắn với commit</td></tr>
<tr><td>Cache Docker ấm</td><td>có</td><td>có — ở đây chọn runner bền chính vì điều này</td></tr>
<tr><td>Máy nhà tắt</td><td>script tự lùi về <code>deploy.sh</code></td><td>job nằm chờ trong hàng (tới 24 giờ) — giữ đường lùi thành một lối riêng</td></tr>
<tr><td>Kiểm trước khi đẩy</td><td>script tự chạy tsc, test và eval</td><td>đúng các lệnh đó thành các bước; log chỉ ra bước nào hỏng</td></tr>
</tbody>
</table>
<p>Điều kiện quan trọng hơn YAML. <strong>Kho là riêng tư</strong> — runner đăng ký vào api-backend, không bao giờ vào kho công khai. <strong>Chỉ <code>workflow_dispatch</code></strong> (hoặc push lên <code>main</code> bởi những người vốn đã được deploy) dùng nhãn đó. <strong>Một người dùng riêng</strong> chạy dịch vụ, không đụng được khoá SSH của chủ máy; nó vẫn cần Docker, và thuộc nhóm <code>docker</code> tương đương root trên máy đó — nên máy nhà trở thành cỗ máy mà sự an toàn của deploy phụ thuộc vào, y như hiện giờ với <code>deploy-nha.sh</code>. <strong>Không bao giờ đặt trên chính VPS</strong>: một job build trên máy production tranh RAM và đĩa với Postgres — đúng hai thứ đã hỏng hai lần trong lịch sử dự án này.</p>

<h3>Khi nào đáng tự host</h3>
${slide('ga-13', 24, 'Khi nào đáng tự host — hỏi năm câu trước khi bật một runner')}
<table>
<thead><tr><th>Câu hỏi</th><th>Nếu "có"</th><th>Nếu "không"</th></tr></thead>
<tbody>
<tr><td>Kho có công khai không?</td><td>dừng — dùng runner GitHub-hosted</td><td>đi tiếp</td></tr>
<tr><td>Job có cần thứ runner hosted không có (GPU, vào LAN, hơn 16 GB RAM, dữ liệu không được rời máy, cache ấm vài GB)?</td><td>self-hosted, hoặc larger runner</td><td>runner hosted chuẩn là đủ</td></tr>
<tr><td>Phút hosted có thật sự đắt không (kho riêng tư, hàng nghìn phút mỗi tháng)?</td><td>so máy + điện + giờ công của bạn với $0,006/phút</td><td>hosted rẻ hơn thời gian của bạn</td></tr>
<tr><td>Có ai vá OS, cập nhật runner trong 30 ngày và đọc <code>_diag</code> không?</td><td>đi tiếp</td><td>ở lại với hosted</td></tr>
<tr><td>Làm được ephemeral không (một VM hay container mỗi job)?</td><td>làm</td><td>chỉ chấp nhận máy bền cho kho riêng tư và một đội tin nhau</td></tr>
</tbody>
</table>

<h3>Chạy thử từng bước: định cỡ runner từ số liệu của chính bạn</h3>
<ol>
<li>Liệt kê 50 run gần nhất của workflow bận nhất: <code>gh run list --workflow ci.yml --limit 50 --json databaseId,createdAt,updatedAt</code>.</li>
<li>Với năm run trong số đó, đọc các job (<code>gh api repos/OWNER/REPO/actions/runs/ID/jobs</code>) và ghi <code>labels</code>, <code>created_at</code>, <code>started_at</code>, <code>completed_at</code>.</li>
<li>Tính thời gian chờ và thời gian chạy mỗi job, và tổng số phút mỗi tháng (với kho riêng tư, nhân với giá mỗi phút).</li>
<li>Trả lời năm câu hỏi trong bảng trên cho workflow đó.</li>
<li>Nếu câu trả lời là "self-hosted": viết dòng <code>runs-on</code>, nhãn, các sự kiện kích hoạt được phép dùng nó, và runner là ephemeral hay bền — kèm lý do.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn tự co giãn runner self-hosted thế nào?</strong><br>Đ: Bằng runner ephemeral, lái theo hàng chờ job. Trên Kubernetes dùng Actions Runner Controller: một listener long-poll GitHub, co giãn một ephemeral runner set theo số job trong khoảng <code>minRunners</code>/<code>maxRunners</code>, mỗi pod đăng ký bằng cấu hình just-in-time và bị xoá sau job của nó. Không có Kubernetes thì dùng Runner Scale Set Client trên VM, hoặc — với hệ nhỏ — webhook <code>workflow_job</code>. Xác thực bằng GitHub App, và chuyển log runner ra khỏi pod.</p>
<p><strong>H: Vì sao tự co giãn lại dùng runner ephemeral?</strong><br>Đ: Co lại nghĩa là huỷ máy, và chỉ runner ephemeral mới chắc chắn không đang giữa một job khi bạn huỷ — GitHub không bảo đảm được điều đó với runner bền. Nó còn cho mỗi job một môi trường sạch.</p>
<p><strong>H: Một đội xin runner self-hosted "để tiết kiệm tiền". Bạn hỏi gì trước?</strong><br>Đ: Kho có công khai không (thì không)? Vấn đề là số phút hay là thứ runner hosted không làm được? Ai bảo trì máy, cập nhật runner trong 30 ngày và lo cách ly? Với kho riêng tư, so số phút thật mỗi tháng nhân $0,006 với tiền máy và giờ công — lựa chọn rẻ hơn thường là hosted, hoặc một larger runner cho đúng cái job nặng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> kho đồ án của nhóm bạn là riêng tư, CI mất 9 phút trên runner hosted, và một bạn đề nghị lấy máy chơi game làm runner. Quyết định, bằng con số.</p><ol>
<li>Làm bước 1–3 của mục "Chạy thử từng bước" trên kho bận nhất của bạn (hoặc trên các run <code>ch13-*</code> của sân tập nếu kho bạn chưa có).</li>
<li>Điền bảng năm câu hỏi cho tình huống này.</li>
<li>Viết các dòng <code>runs-on</code>, trigger và <code>concurrency</code> bạn sẽ dùng nếu câu trả lời là có — hoặc một câu lý do nếu là không.</li>
</ol><p><strong>Đạt khi:</strong> bạn có số liệu thời gian chờ và thời gian chạy cho từng job, ước tính số phút mỗi tháng kèm giá, một bảng đã điền, và một quyết định có gọi tên nhãn, các sự kiện được phép và ephemeral hay bền.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">autoscaling (tự co giãn)</span><span class="v">tự thêm và bớt runner theo hàng chờ job</span></div>
<div class="kv"><span class="k">ARC</span><span class="v">Actions Runner Controller: operator Kubernetes cho runner self-hosted của GitHub</span></div>
<div class="kv"><span class="k">runner scale set</span><span class="v">một nhóm runner giống nhau mà GitHub co giãn qua API scale set; tên của nó dùng trong <code>runs-on</code></span></div>
<div class="kv"><span class="k">listener pod</span><span class="v">pod của ARC long-poll GitHub và xin thêm runner pod</span></div>
<div class="kv"><span class="k"><code>minRunners</code> / <code>maxRunners</code></span><span class="v">số runner ấm giữ sẵn, và trần chi phí</span></div>
<div class="kv"><span class="k"><code>workflow_job</code></span><span class="v">webhook gửi khi một job vào hàng, bắt đầu và kết thúc</span></div>
<div class="kv"><span class="k"><code>svc.sh</code></span><span class="v">script do <code>config.sh</code> tạo trên Linux/macOS để cài runner thành dịch vụ</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tự co giãn trả lời ba câu: bây giờ bao nhiêu runner, chúng đăng ký thế nào không cần người, và khi nào được huỷ.</li>
<li>Đầu vào là hàng chờ job — chính các trường <code>labels</code>, <code>created_at</code>, <code>started_at</code> API trả về, hoặc webhook <code>workflow_job</code>.</li>
<li>ARC: listener long-poll, co giãn một ephemeral runner set trong khoảng <code>minRunners</code>–<code>maxRunners</code>, pod đăng ký bằng cấu hình JIT và bị xoá sau một job.</li>
<li>Không có Kubernetes: Runner Scale Set Client, hoặc webhook với hệ nhỏ; hoặc đơn giản là một cỗ máy gắn nhãn cẩn thận.</li>
<li>Máy build ở nhà hợp với một runner bền trên kho riêng tư, chỉ dispatch, người dùng riêng — và một đường lùi khi máy tắt.</li>
<li>Không bao giờ tự host cho kho công khai; không bao giờ đặt runner build lên VPS production.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Actions Runner Controller</span><span class="lc-sub">docs.github.com/en/actions/concepts/runners/actions-runner-controller — các bước kiến trúc, tài nguyên và ảnh runner.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Get started with Actions Runner Controller</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-actions-runner-controller/get-started — hai lần cài Helm và workflow đầu tiên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deploying runner scale sets</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/use-actions-runner-controller/deploy-runner-scale-sets — <code>minRunners</code>, <code>maxRunners</code>, các chế độ container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Self-hosted runners reference: autoscaling</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/self-hosted-runners — ARC, Scale Set Client, runner ephemeral, webhook <code>workflow_job</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Configuring the runner application as a service</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application — <code>svc.sh install</code> trên systemd.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — build ngoài máy chủ</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — vì sao việc build rời khỏi VPS 6 GB, và ảnh đi qua GHCR thế nào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra Chương 13',
      slug: 'ga-13-5-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 13 đã đo: runner kéo việc qua kết nối đi ra, nhật ký _diag, giá hosted và self-hosted, nhãn cộng dồn, --ephemeral, lỗi đăng ký 404, PR từ fork, mask và ps, docker.sock trong container job, và service không health-check.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>What Chapter 13 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Most answers come from a run in the sandbox — a process tree, a <code>_diag</code> line, a <code>docker create</code> command — and the rest from GitHub&#39;s documentation as of 09/2026. Several wrong options are what people commonly believe about runners; the explanations say which run disproves them.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain how a job reaches a runner without any inbound port, and where the runner logs it.</li>
<li>I can compare GitHub-hosted, larger and self-hosted runners on price, cleanliness and maintenance.</li>
<li>I can write a <code>runs-on</code> that targets exactly one self-hosted runner, and tell actionlint about its label.</li>
<li>I can build an ephemeral runner image, name the tokens it needs, and recognise its three common registration failures.</li>
<li>I can explain why a public repository and a self-hosted runner do not mix, and what a shared runner leaks.</li>
<li>I can run tests against a Postgres service container, with a health check, both on the runner and inside a container job.</li>
</ul>
${slide('ga-13', 26, 'Chapter 13 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Chương 13 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Phần lớn đáp án lấy từ một run trên sân tập — một cây tiến trình, một dòng <code>_diag</code>, một lệnh <code>docker create</code> — phần còn lại từ tài liệu của GitHub tính đến 09/2026. Nhiều phương án sai là điều người ta hay tin về runner; phần giải thích nói run nào bác bỏ chúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được một job tới runner thế nào mà không cần cổng vào nào, và runner ghi lại việc đó ở đâu.</li>
<li>Tôi so được runner GitHub-hosted, larger và self-hosted về giá, độ sạch và công bảo trì.</li>
<li>Tôi viết được một <code>runs-on</code> nhắm đúng một runner self-hosted, và báo cho actionlint biết nhãn của nó.</li>
<li>Tôi dựng được ảnh runner ephemeral, gọi tên được các token nó cần, và nhận ra ba lỗi đăng ký hay gặp.</li>
<li>Tôi giải thích được vì sao kho công khai và runner self-hosted không đi cùng nhau, và một runner dùng chung để lộ những gì.</li>
<li>Tôi chạy được test với service container Postgres có health-check, cả trên runner lẫn trong container job.</li>
</ul>
${slide('ga-13', 26, 'Bảng tra nhanh Chương 13')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your self-hosted runner sits in a home network behind NAT, with no port forwarding and no public IP. It shows as Idle in Settings and picks up jobs. How does a job reach it?|||Runner self-hosted của bạn nằm trong mạng nhà sau NAT, không mở cổng, không có IP công khai. Nó hiện Idle trong Settings và vẫn nhận job. Job tới được nó bằng cách nào?',
            options: [
              'GitHub opens a websocket into the machine through UPnP on the router|||GitHub mở một websocket vào máy qua UPnP trên router',
              'Runner.Listener holds an outbound HTTPS session to GitHub on port 443 and the job comes back on it|||Runner.Listener giữ một phiên HTTPS đi ra tới GitHub qua cổng 443 và job được trả về trên đó',
              'GitHub SSHes into the machine with the key created by config.sh|||GitHub SSH vào máy bằng khoá do config.sh tạo',
              'The runner checks the Actions API every five minutes for new jobs|||Runner hỏi API của Actions năm phút một lần xem có job mới không',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A runner pulls work: the Listener creates a session with the Broker and long-polls. Run 36074805297 showed seven established connections owned by the runner, all to port 443, and no listening port; its _diag log went from "Listening for Jobs" to "Job request … received" within the same second. The five-minute polling option is tempting because it also explains "no inbound port", but the measured assignment was immediate, which a periodic poll cannot give.|||VI: Runner kéo việc về: Listener tạo phiên với Broker rồi long-poll. Run 36074805297 cho thấy bảy kết nối đang mở của runner, tất cả tới cổng 443, và không cổng nào nghe; log _diag đi từ "Listening for Jobs" tới "Job request … received" trong cùng một giây. Phương án hỏi năm phút một lần hấp dẫn vì nó cũng giải thích được "không cổng vào", nhưng việc giao job đo được là tức thì, điều mà hỏi định kỳ không cho được.',
          },
          {
            question: 'A job on a persistent self-hosted runner failed before its first step, and the Actions tab shows almost nothing. Where do you look first on the machine?|||Một job trên runner self-hosted bền hỏng trước cả bước đầu tiên, và tab Actions gần như không có gì. Trên máy, bạn nhìn đâu trước?',
            options: [
              'The _diag directory next to the runner binaries: Runner_*.log and Worker_*.log|||Thư mục _diag cạnh các tệp chạy của runner: Runner_*.log và Worker_*.log',
              'The _work/_temp directory, where each step keeps its own log file|||Thư mục _work/_temp, nơi mỗi bước giữ một tệp log riêng',
              '/var/log/syslog, because the runner writes only to the system journal|||/var/log/syslog, vì runner chỉ ghi vào nhật ký hệ thống',
              'Nowhere — the runner keeps no local logs; only GitHub has them|||Không đâu cả — runner không giữ log cục bộ; chỉ GitHub có',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The runner writes its own diary into _diag: the Listener log (session, "Listening for Jobs", job received) and a Worker log per job (the job message, including scripts). That is where a failure before step one is explained. _work/_temp is tempting because it is also the runner’s, but run 36074805297 showed it holds step scripts (uuid.sh) and file-command files, not logs — and it is emptied at the start and end of each job.|||VI: Runner ghi nhật ký riêng vào _diag: log Listener (phiên, "Listening for Jobs", nhận job) và mỗi job một log Worker (thông điệp job, gồm cả script). Lỗi trước bước một được giải thích ở đó. _work/_temp hấp dẫn vì nó cũng là của runner, nhưng run 36074805297 cho thấy nó chứa script các bước (uuid.sh) và tệp file-command, không phải log — và nó bị dọn đầu và cuối mỗi job.',
          },
          {
            question: 'A private repository uses 3,000 Linux minutes and 2,000 Windows minutes beyond its included allowance this month, on standard GitHub-hosted runners (prices as of 09/2026). What is the bill for those minutes?|||Một kho riêng tư dùng vượt hạn mức 3.000 phút Linux và 2.000 phút Windows trong tháng, trên runner GitHub-hosted chuẩn (giá tính đến 09/2026). Hoá đơn cho số phút đó là bao nhiêu?',
            options: [
              '$0 — standard runners are always free|||$0 — runner chuẩn luôn miễn phí',
              '$30 — every standard minute costs $0.006|||$30 — mọi phút chuẩn đều giá $0,006',
              '$58 — Windows is billed at twice the Linux rate plus a platform fee|||$58 — Windows tính gấp đôi Linux cộng phí nền tảng',
              '$38 — $18 for Linux at $0.006 and $20 for Windows at $0.010|||$38 — $18 cho Linux giá $0,006 và $20 cho Windows giá $0,010',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: 3,000 × $0.006 = $18 and 2,000 × $0.010 = $20, $38 in total — the same worked example GitHub’s billing page uses. "Always free" is tempting but true only for public repositories; private ones spend an allowance (2,000 min on Free, 3,000 on Pro) and then pay per minute, rounded up per job. A single rate for all systems is also wrong: Windows and macOS cost more.|||VI: 3.000 × $0,006 = $18 và 2.000 × $0,010 = $20, tổng $38 — đúng ví dụ tính sẵn trên trang tính phí của GitHub. "Luôn miễn phí" hấp dẫn nhưng chỉ đúng với kho công khai; kho riêng tư tiêu hạn mức (2.000 phút với Free, 3.000 với Pro) rồi trả theo phút, làm tròn lên cho từng job. Một giá chung cho mọi hệ cũng sai: Windows và macOS đắt hơn.',
          },
          {
            question: 'A job says runs-on: [self-hosted, linux, gpu]. Your only online runner has the labels self-hosted, Linux, X64. What happens?|||Một job ghi runs-on: [self-hosted, linux, gpu]. Runner online duy nhất của bạn có các nhãn self-hosted, Linux, X64. Chuyện gì xảy ra?',
            options: [
              'The runner takes the job, because two of the three labels match|||Runner nhận job, vì khớp hai trên ba nhãn',
              'The run fails at once with "no runner matches labels"|||Run hỏng ngay với "no runner matches labels"',
              'The job stays queued with no log until a runner with all three labels appears, and is cancelled after 24 hours|||Job nằm chờ, không có log, tới khi có runner mang đủ ba nhãn, và bị huỷ sau 24 giờ',
              'GitHub falls back to a GitHub-hosted Linux runner|||GitHub lùi về một runner Linux của GitHub',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Labels in runs-on are cumulative: a runner needs every one of them. No match is not an error; the job waits, and on self-hosted runners it is cancelled after 24 hours (timeout-minutes does not count queue time — Lesson 2.1 measured a job still queued after 6 min 17 s). "Fails at once" is tempting because that is what most people expect from a typo, which is exactly why actionlint’s runner-label check (with your labels declared in .github/actionlint.yaml) is worth having.|||VI: Nhãn trong runs-on là cộng dồn: runner phải có tất cả. Không khớp không phải là lỗi; job chờ, và trên runner self-hosted bị huỷ sau 24 giờ (timeout-minutes không tính thời gian chờ — Bài 2.1 đo được job vẫn queued sau 6 phút 17 giây). "Hỏng ngay" hấp dẫn vì đó là điều phần lớn mọi người chờ đợi khi gõ sai, và chính vì thế phép kiểm runner-label của actionlint (với nhãn của bạn khai trong .github/actionlint.yaml) đáng có.',
          },
          {
            question: 'You register a runner with ./config.sh --unattended --url … --token … --ephemeral inside a container started with docker run --rm. What does --ephemeral add that --rm alone does not?|||Bạn đăng ký runner bằng ./config.sh --unattended --url … --token … --ephemeral bên trong một container chạy bằng docker run --rm. --ephemeral thêm được gì mà riêng --rm không có?',
            options: [
              'GitHub assigns the runner exactly one job and then de-registers it, so run.sh exits and the container ends|||GitHub giao cho runner đúng một job rồi huỷ đăng ký nó, nên run.sh thoát và container kết thúc',
              'It deletes the container’s files after each job|||Nó xoá tệp của container sau mỗi job',
              'It makes the runner skip automatic updates|||Nó khiến runner bỏ qua việc tự cập nhật',
              'It lets the runner run as root inside the container|||Nó cho runner chạy bằng root bên trong container',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: config.sh’s own help text (run 36074652076): "--ephemeral Configure the runner to only take one job and then let the service un-configure the runner after the job finishes". --rm deletes files, but only when the container stops — without --ephemeral, run.sh would keep listening and the same container would take job after job. Skipping updates is --disableupdate, a different flag; and no flag makes config.sh run as root: it answered "Must not run with sudo".|||VI: Chính văn bản trợ giúp của config.sh (run 36074652076): "--ephemeral Configure the runner to only take one job and then let the service un-configure the runner after the job finishes". --rm xoá tệp, nhưng chỉ khi container dừng — không có --ephemeral, run.sh sẽ nghe tiếp và cùng container đó nhận hết job này tới job khác. Bỏ cập nhật là --disableupdate, một cờ khác; và không cờ nào khiến config.sh chạy bằng root: nó trả lời "Must not run with sudo".',
          },
          {
            question: 'Your registration script fails with "Http response code: NotFound from POST https://api.github.com/actions/runner-registration" and "404 (Not Found)". The URL is correct. What is the most likely cause?|||Script đăng ký của bạn hỏng với "Http response code: NotFound from POST https://api.github.com/actions/runner-registration" và "404 (Not Found)". URL đúng. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The runner version is too old for GitHub|||Phiên bản runner quá cũ với GitHub',
              'The machine has no inbound port open for GitHub|||Máy không mở cổng vào nào cho GitHub',
              'The container is running as root|||Container đang chạy bằng root',
              'The registration token is wrong or older than one hour — get a fresh one|||Token đăng ký sai hoặc đã quá một giờ — xin token mới',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Run 36074652076 produced exactly this output with a fake token. A registration token comes from POST /repos/{owner}/{repo}/actions/runners/registration-token (admin access) and expires after one hour, so an old or mistyped token looks like "Not Found", not "Unauthorized". Root is tempting because it also fails registration, but it fails earlier and differently: "Must not run with sudo". No inbound port is ever needed.|||VI: Run 36074652076 cho ra đúng output này với một token giả. Token đăng ký lấy từ POST /repos/{owner}/{repo}/actions/runners/registration-token (cần quyền admin) và hết hạn sau một giờ, nên token cũ hay gõ sai trông như "Not Found", không phải "Unauthorized". Root hấp dẫn vì nó cũng làm hỏng việc đăng ký, nhưng hỏng sớm hơn và khác: "Must not run with sudo". Không bao giờ cần cổng vào.',
          },
          {
            question: 'An open-source project wants faster CI and proposes a self-hosted runner for its pull_request workflow, with "Require approval for first-time contributors" enabled. Why is this still unsafe?|||Một dự án mã nguồn mở muốn CI nhanh hơn và đề xuất runner self-hosted cho workflow pull_request, có bật "Require approval for first-time contributors". Vì sao vẫn không an toàn?',
            options: [
              'Because fork PRs receive all repository secrets on self-hosted runners|||Vì PR từ fork nhận mọi secret của kho khi chạy trên runner self-hosted',
              'Because self-hosted runners cannot run pull_request workflows at all|||Vì runner self-hosted hoàn toàn không chạy được workflow pull_request',
              'Because the workflow runs the PR’s own code on your machine; approval depends on a reviewer spotting it, and one merged typo fix exempts a contributor|||Vì workflow chạy chính mã của PR trên máy bạn; việc duyệt phụ thuộc người duyệt nhìn ra, và một PR sửa chính tả được merge là người đóng góp khỏi phải duyệt',
              'Because approval settings apply only to GitHub-hosted runners|||Vì cài đặt duyệt chỉ áp dụng cho runner GitHub-hosted',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The docs recommend self-hosted runners only for private repositories because a fork PR can execute its code on your machine. Approval is a brake: the default level exempts anyone who has had one commit merged, and even approved code runs automatically once approved; pull_request_target ignores approval altogether. The "all secrets" option is tempting but wrong — fork PRs do not get secrets on pull_request; the danger is the machine itself and what later jobs leave on it.|||VI: Docs khuyên chỉ dùng runner self-hosted với kho riêng tư vì một PR từ fork có thể chạy mã của nó trên máy bạn. Việc duyệt là cái phanh: mức mặc định miễn cho bất kỳ ai đã có một commit được merge, và mã đã được duyệt thì tự chạy; pull_request_target bỏ qua hẳn việc duyệt. Phương án "mọi secret" hấp dẫn nhưng sai — PR từ fork không nhận secret trên pull_request; nguy hiểm là chính cỗ máy và thứ các job sau để lại trên nó.',
          },
          {
            question: 'A step registers ::add-mask:: for a value, then starts a process with --token=<value> as an argument. The log shows --token=***. On a runner shared with other jobs, what is still true?|||Một bước đăng ký ::add-mask:: cho một giá trị, rồi khởi động một tiến trình với đối số --token=<giá trị>. Log hiện --token=***. Trên một runner dùng chung với job khác, điều gì vẫn đúng?',
            options: [
              'Nothing leaks: masking also hides the value from the process list|||Không gì rò: mask cũng che giá trị khỏi danh sách tiến trình',
              'The real value is readable by other processes on the machine, e.g. with ps; masking only rewrites the log|||Giá trị thật đọc được bởi tiến trình khác trên máy, ví dụ bằng ps; mask chỉ viết lại log',
              'The value is visible only to root, so a non-root runner user is enough|||Giá trị chỉ root mới thấy, nên người dùng runner không phải root là đủ',
              'The runner rejects secrets in arguments and fails the step|||Runner từ chối secret nằm trong đối số và làm hỏng bước',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Run 36074706877 printed "bash -c sleep 20; true ch13 --token=***" in the log, and in the same step counted 2 processes whose command line contained the real (fake) string. The docs name this leak: another job on the same runner can see secret arguments with ps x -w. The "only root" option is tempting, but process arguments are readable by ordinary users on a normal Linux system. Pass secrets through environment variables, stdin or a file instead.|||VI: Run 36074706877 in "bash -c sleep 20; true ch13 --token=***" trong log, và cùng bước đó đếm được 2 tiến trình có dòng lệnh chứa chuỗi thật (giả). Docs gọi tên chỗ rò này: một job khác trên cùng runner thấy được đối số chứa secret bằng ps x -w. Phương án "chỉ root" hấp dẫn, nhưng trên một hệ Linux bình thường người dùng thường đọc được đối số của tiến trình. Hãy truyền secret qua biến môi trường, stdin hoặc tệp.',
          },
          {
            question: 'A teammate moves an untrusted build into a job with container: node:22-bookworm-slim, saying "now it is isolated from the runner machine". What did the docker create line in run 36074652000 show?|||Một bạn chuyển một bản build không đáng tin vào job có container: node:22-bookworm-slim, nói "giờ nó đã cách ly khỏi máy runner". Dòng docker create trong run 36074652000 cho thấy gì?',
            options: [
              'The host’s /var/run/docker.sock, work directory and tool cache are mounted into the container, and steps run as root — it is not a security boundary|||docker.sock, thư mục làm việc và tool cache của máy chủ được mount vào container, và các bước chạy bằng root — nó không phải ranh giới bảo mật',
              'The container runs with --read-only and no network, so the claim is right|||Container chạy với --read-only và không có mạng, nên câu đó đúng',
              'The container is a separate VM, so only the workspace is shared|||Container là một VM riêng, nên chỉ workspace là dùng chung',
              'The runner copies the workspace into the image, so nothing on the host is reachable|||Runner chép workspace vào ảnh, nên không gì trên máy chủ với tới được',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The runner created the job container with -v "/var/run/docker.sock":"/var/run/docker.sock", -v "/home/runner/work":"/__w", the tool cache at /__t and the runner’s externals at /__e, and the step reported whoami=root. Whoever can use the Docker socket controls the host. "A separate VM" is tempting because containers feel like VMs, but this is a container on the same host that simply idles (tail -f /dev/null) while steps are docker-exec’d into it.|||VI: Runner tạo container của job với -v "/var/run/docker.sock":"/var/run/docker.sock", -v "/home/runner/work":"/__w", tool cache ở /__t và externals của runner ở /__e, và bước báo whoami=root. Ai dùng được socket Docker là điều khiển được máy chủ. "Một VM riêng" hấp dẫn vì container trông giống VM, nhưng đây là container trên cùng máy chủ, chỉ ngồi chờ (tail -f /dev/null) trong khi các bước được docker exec vào.',
          },
          {
            question: 'A job declares a Postgres service without any --health-* options, and its first step runs prisma migrate deploy. Sometimes it fails with "connection refused". What did the sandbox measure?|||Một job khai service Postgres không có option --health-* nào, và bước đầu tiên chạy prisma migrate deploy. Thỉnh thoảng nó hỏng với "connection refused". Sân tập đã đo được gì?',
            options: [
              'The runner always waits 30 seconds for services, so the failure must be a wrong password|||Runner luôn chờ service 30 giây, nên lỗi hẳn là sai mật khẩu',
              'Services only start after the first step, so every job without a health check fails|||Service chỉ khởi động sau bước đầu, nên job nào không có health-check cũng hỏng',
              'The runner reported "csdl service is healthy." at once, and the first step began about 1.1 s before Postgres accepted connections|||Runner báo ngay "csdl service is healthy.", và bước đầu bắt đầu khoảng 1,1 giây trước khi Postgres nhận kết nối',
              'Postgres cannot run as a service container without ports: mapping|||Postgres không chạy được làm service container nếu thiếu ánh xạ ports:',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: In job khong-cho of run 36074652000, with no health check the runner still printed "csdl service is healthy." (docker inspect had no health status to wait for); the first step needed 5 retries and 1,145 ms before pg_isready succeeded, and Postgres logged "ready to accept connections" about 1.1 s after the step began. That is a race, hence the intermittent failure. With --health-cmd the runner polls every interval until "healthy". The "every job fails" option is tempting but wrong: services do start before step one — they are just not ready yet.|||VI: Ở job khong-cho của run 36074652000, không có health-check mà runner vẫn in "csdl service is healthy." (docker inspect không có trạng thái sức khoẻ nào để chờ); bước đầu cần 5 lần thử và 1.145 ms thì pg_isready mới thành công, và Postgres ghi "ready to accept connections" khoảng 1,1 giây sau khi bước bắt đầu. Đó là một cuộc đua, nên lỗi lúc có lúc không. Có --health-cmd thì runner hỏi theo chu kỳ tới khi "healthy". Phương án "job nào cũng hỏng" hấp dẫn nhưng sai: service có khởi động trước bước một — chỉ là chưa sẵn sàng.',
          },
        ],
      },
    },
  ],
};
