import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 8: Khi CI đỏ.
 * Số đo: bảng mã thoát đo bằng tiến trình thật, cú hỏng 134 của kho này,
 * và thứ tự đọc rút ra từ phương sai 1,60 lần đã đo ở Chương 7.
 */

export default {
  title: 'Chapter 8 — When CI is red|||Chương 8 — Khi CI đỏ',
  slug: 'ga-ch8-do',
  description: 'Mã thoát đo bằng tiến trình thật, không chép tài liệu: 127 là gõ sai tên, 134 là V8 hết heap, 137 là bị giết. Cộng thứ tự đọc một lần chạy đỏ, và cách phân biệt một cú hỏng thật với một lần chạy chậm.',
  sortOrder: 9,
  lessons: [

    /* ─────────────────────────── 8.0 ─────────────────────────── */
    {
      title: '8.0 — Chapter 8 slides: reading a red CI run in pictures|||8.0 — Slide Chương 8: đọc một lần chạy CI đỏ bằng hình',
      slug: 'ga-8-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 8: bảng mã thoát kèm log thật, mười kiểu đỏ trong một run, huỷ và hết giờ không có mã thoát, 20 nhánh test chập chờn và rerun --failed, runner đo thật, act và docker run để tái lập, cây quyết định đọc run đỏ, và ba vòng kiểm một bản vá — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: an exit-code table where every row is a real log line, one run that fails in ten different ways, what a cancel and a timeout really print, twenty legs of one flaky test and what "Re-run failed jobs" did to them, three runners measuring themselves, act and <code>docker run</code> reproducing a red matrix leg on a laptop, a decision tree for reading any red run, and one fix taken from red to green in three rounds.</p>
<p>Slides 3–8 belong to Lesson 8.1, 9–15 to 8.2, 16–20 to 8.3, 21–25 to 8.4 and 26–28 to 8.5. The last three are the chapter&#39;s common mistakes, a cheat sheet, and a 60-minute practice session. Every new log on the slides is real: recorded on 24 September 2026 on GitHub-hosted <code>ubuntu-24.04</code>, <code>macos-15</code> and <code>windows-2025</code> runners in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch08-do</code>, plus act 0.2.89 and Docker on the course&#39;s M1 Mac. The api-backend history comes from read-only <code>gh</code> commands.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: một bảng mã thoát mà mỗi dòng là một dòng log thật, một run đỏ theo mười cách khác nhau, thứ mà một lần huỷ và một lần hết giờ THẬT SỰ in ra, hai mươi nhánh của một bài test chập chờn và điều "Re-run failed jobs" đã làm với chúng, ba runner tự đo mình, act và <code>docker run</code> tái lập một nhánh ma trận đỏ trên laptop, một cây quyết định để đọc bất cứ run đỏ nào, và một bản vá được đưa từ đỏ sang xanh trong ba vòng.</p>
<p>Slide 3–8 thuộc Bài 8.1, 9–15 thuộc 8.2, 16–20 thuộc 8.3, 21–25 thuộc 8.4 và 26–28 thuộc 8.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 60 phút. Mọi log mới trên slide là THẬT: ghi ngày 24/09/2026 trên runner <code>ubuntu-24.04</code>, <code>macos-15</code> và <code>windows-2025</code> của GitHub, trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch08-do</code>, cộng act 0.2.89 và Docker trên máy Mac M1 của khoá. Lịch sử của api-backend lấy từ các lệnh <code>gh</code> chỉ đọc.</p>
</div>
${gallery('ga-08', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Bảng mã thoát kèm log thật'], [4, 'Một run, mười kiểu đỏ'], [5, '127 và 1: gõ sai lệnh, gõ sai script'],
  [6, '126 và 2: thiếu chmod, thiếu fi'], [7, '134 kêu lên, 137 im lặng'], [8, 'Huỷ và hết giờ không có mã thoát'],
  [9, 'Ba kiểu đỏ'], [10, '20 nhánh, 4 đỏ'], [11, 'Phân bố nhị thức'], [12, 'rerun --failed biến run thành xanh'],
  [13, 'Test hẹn giờ phụ thuộc môi trường'], [14, 'Phụ thuộc thứ tự'], [15, 'api-backend: đỏ lặp cùng tên'],
  [16, 'Runner đo thật'], [17, 'In trần heap trong job'], [18, 'act tái lập nhánh Node 20'],
  [19, 'docker run cùng image'], [20, 'act làm được gì'],
  [21, 'Cây quyết định đọc run đỏ'], [22, 'Đồ thị job: đỏ sớm nhất'], [23, 'gh run view --log-failed'],
  [24, 'Dòng lỗi thật nằm phía trên'], [25, 'Chạy lại với debug'],
  [26, 'Ba vòng của một bản vá'], [27, 'Kiểm bản vá theo thứ tự'], [28, 'Re-run chạy lại commit cũ'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh'], [31, 'Thực hành chương 8'],
])}
`,
    },

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Exit codes, measured rather than looked up|||8.1 — Mã thoát, ĐO chứ không tra',
      slug: 'ga-8-1-ma-thoat',
      type: 'VIDEO',
      description: 'Chạy thật từng ca: 127 là gõ sai tên, 126 là thiếu quyền, 134 là abort(), 137 là bị giết. Và V8 hết heap thoát đúng 134 — khớp với cú hỏng thật của kho này. Cộng lần thứ BA cái bẫy ống cắn chính phép đo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Exit codes, measured rather than looked up</h2>
<p class="lead">A step fails because a process exited non-zero, and the number it exited with usually names the cause precisely. The table below is worth having memorised — so rather than copying it from a manual, here it is produced by running each case.</p>

<h3>The measurement</h3>
${slide('ga-08', 3, 'The exit-code table, each row backed by a real log line from run 36011088172')}
<div class="out">lenh                                exit
--------------------------------------------
exit 0                                 0
false                                  1
lenh-khong-ton-tai                   127
tep khong co quyen thuc thi          126
kill -SEGV \$\$                        139
kill -ABRT \$\$                        134
kill -KILL \$\$                        137
kill -TERM \$\$                        143</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — a generic failure</span><span class="lz-lnote">most tools exit 1 for anything that went wrong. It tells you a tool decided to fail, and nothing more. Read the tool&#39;s output</span></div>
<div class="lz-layer"><span class="lz-lname">126 and 127 — the shell could not run it</span><span class="lz-lnote">127 is "command not found": a typo, or a step that was supposed to install it and did not. 126 is "found it, could not execute it": almost always a missing <code>chmod +x</code> on a script in the repository. Neither is a bug in your program, because your program never ran</span></div>
<div class="lz-layer"><span class="lz-lname">128 + n — killed by signal n</span><span class="lz-lnote">this is the family worth recognising on sight, because it means something <em>outside</em> the process ended it. Subtract 128 and you have the signal number</span></div>
<div class="lz-layer"><span class="lz-lname">2 — used wrongly</span><span class="lz-lnote">bash&#39;s code for a syntax error or bad usage. On a CI failure it usually means the script itself is malformed, not that the work failed</span></div>
</div>

<h3>The four signals that appear in CI</h3>
<div class="kv-grid">
<div class="kv"><span class="k">134 = 128 + 6 · SIGABRT</span><span class="v">the process called <code>abort()</code>. For anything Node-based this is almost always V8 hitting its heap limit — measured below</span></div>
<div class="kv"><span class="k">137 = 128 + 9 · SIGKILL</span><span class="v">something killed it and it could not refuse. On a runner that is the OOM killer; in Docker it is also what <code>docker stop</code> escalates to after its grace period. This repository has hit it on the VPS (2026-07-06, <code>Exited(137)</code>)</span></div>
<div class="kv"><span class="k">143 = 128 + 15 · SIGTERM</span><span class="v">a polite request to stop. It appears when something sends SIGTERM and the process dies of it: <code>docker stop</code>, a plain <code>kill</code>, a supervisor shutting down. (This row first said a cancelled workflow job produces 143 — measured below, a cancel sends SIGINT first and the log shows no exit code at all.)</span></div>
<div class="kv"><span class="k">139 = 128 + 11 · SIGSEGV</span><span class="v">a segfault. Rare in a JS toolchain, common in native modules — and a strong signal that a prebuilt binary does not match the platform, which Chapter 2 measured as a real failure mode</span></div>
</div>

<h3>Verifying the one that matters here</h3>
<p>This repository&#39;s most expensive failure exited <strong>134</strong>. Rather than assume that means a heap limit, squeeze a Node process and see:</p>

<div class="out">$ node --max-old-space-size=40 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'
Aborted
exit THAT = 134

&lt;--- Last few GCs ---&gt;
FATAL ERROR: Reached heap limit Allocation failed</div>

<div class="callout ok">
<p><strong>134, matching the real failure exactly.</strong> Run 32400097927 printed <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code> and exited 134 on the macOS leg. So the chain is now established rather than assumed: V8 cannot allocate → V8 calls <code>abort()</code> → SIGABRT → 128 + 6 = 134. Seeing 134 in a Node build log is enough to know what happened before reading a single line of output.</p>
</div>

<div class="callout warn">
<p><strong>134 and 137 look similar and mean opposite things.</strong> 134 is the process deciding it cannot continue — it hit a limit <em>it</em> knows about, which for Node is the V8 heap ceiling and is raised with <code>--max-old-space-size</code>. 137 is the process being killed from outside — the machine ran out of real memory, and raising the V8 limit makes it <em>worse</em>. Reading them the wrong way round leads to exactly the wrong fix.</p>
</div>

<h3>Measured again, on a real runner: one run, ten kinds of red</h3>
${slide('ga-08', 4, 'One workflow, ten jobs, each failing a different way — the annotation already names the exit code')}
<p>The table above was produced on a laptop. A table about CI should be checked on CI, so the sandbox repository got a workflow whose only purpose is to fail in ten different ways, one job each: <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088172" target="_blank" rel="noopener">run 36011088172</a> on branch <code>ch08-do</code>, 24 September 2026, <code>ubuntu-24.04</code> image 20260920.314.1. Every job ran in parallel, so the whole run took under two minutes, and every red cross on it is a real failure you can open.</p>
<pre><code class="language-yaml">defaults:
  run:
    shell: bash                  # adds -e -o pipefail
    working-directory: ch08/app
jobs:
  thieu-lenh:                    # typo in a tool name
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
      - run: eslnt .
  khong-quyen:                   # script committed without the executable bit
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
      - run: ./scripts/chay.sh
  het-heap:                      # V8 hits its own ceiling
    runs-on: ubuntu-24.04
    steps:
      - run: node --max-old-space-size=64 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'
        working-directory: .
  # … and seven more: test-sai, lint, npm-sai-ten, cu-phap, oom-container, het-gio-buoc, het-gio-job</code></pre>
<p>The first useful discovery is where the exit code appears. You do not need to open any log to read it: GitHub turns the last error of each failed job into an <strong>annotation</strong>, and the annotations are listed at the bottom of the run page and printed by <code>gh run view</code>:</p>
<div class="out">ANNOTATIONS
X Process completed with exit code 137.     oom-container: .github#26
X Process completed with exit code 127.     thieu-lenh: .github#6
X Process completed with exit code 1.       test-sai: .github#43
X Process completed with exit code 2.       cu-phap: .github#9
X Process completed with exit code 126.     khong-quyen: .github#6
X Process completed with exit code 134.     het-heap: .github#33
X The action 'Buoc co timeout-minutes 1' has timed out after 1 minutes.   het-gio-buoc
X The job has exceeded the maximum execution time of 1m0s                 het-gio-job</div>
<p>Eight lines, and eight different diagnoses before a single log has been opened. That is the practical meaning of "the exit code names the cause": on a real run page it is the first thing printed, and it is printed for every job at once.</p>

<h3>127 versus 1: who is telling you it failed</h3>
${slide('ga-08', 5, 'A typo in a command name is 127 from the shell; a typo in an npm script name is 1 from npm')}
<p>Two jobs made the same human mistake — a typo — and got different codes. <code>eslnt .</code> exited <strong>127</strong> with the shell&#39;s own message, <code>eslnt: command not found</code>. <code>npm run tset</code> exited <strong>1</strong> with npm&#39;s message, <code>npm error Missing script: "tset"</code>, followed by a helpful "Did you mean this?".</p>
<p>The difference is <em>who</em> noticed. In the first case the shell looked through <code>PATH</code>, found nothing called <code>eslnt</code>, and gave up before any program started — 127 is reserved for exactly that. In the second, the shell found <code>npm</code> without trouble, npm started, read <code>package.json</code>, did not find the script, and chose to exit with its generic failure code. So the exit code tells you whose error message to trust: 127 means read the command line you wrote; 1 means read what the tool printed.</p>
<div class="callout">
<p><strong>The most common real-world 127 is not a typo.</strong> It is a step that uses a tool some earlier step was supposed to install — and that earlier step was skipped by an <code>if:</code>, cached incorrectly, or installed it somewhere not on <code>PATH</code> (a global npm install on a different Node version, a <code>pip install --user</code> whose bin directory is not on the path). When you see 127 for a tool you are sure you installed, print <code>echo "$PATH"</code> and <code>command -v thetool</code> in the failing step before touching anything else.</p>
</div>

<h3>126 and 2: the program never started — but part of the script did</h3>
${slide('ga-08', 6, 'Missing execute bit gives 126; a missing fi gives 2 — and the lines before the syntax error still ran')}
<p><strong>126</strong> came from <code>./scripts/chay.sh: Permission denied</code>. The script is in the repository and the shell found it, but its file mode in Git is <code>100644</code> — no executable bit — so the kernel refused to run it. The cause is almost always that the file was created on a machine or editor that did not set the bit, or that it was committed from Windows, where Git cannot see Unix permissions at all. The repair is not <code>chmod</code> in the workflow; it is fixing the mode in Git so every checkout is right:</p>
<pre><code>git ls-files -s scripts/chay.sh        # 100644 = not executable
git update-index --chmod=+x scripts/chay.sh
git commit -m "make chay.sh executable"  # now 100755</code></pre>
<p>The alternative that avoids the question entirely is <code>run: bash scripts/chay.sh</code> — calling the interpreter explicitly does not need the executable bit. Both are fine; what is not fine is a <code>chmod +x</code> step in CI that makes the pipeline pass while every developer&#39;s checkout still has the broken mode.</p>
<p><strong>2</strong> came from a <code>run:</code> block with an <code>if</code> and no <code>fi</code>. The log is the interesting part, because the workflow&#39;s first line said <em>"this line will NOT be printed, because bash reads the whole block first"</em> — and the log printed it:</p>
<div class="out">/home/runner/work/_temp/44062232-….sh: line 4: syntax error: unexpected end of file
dong nay KHONG duoc in, vi bash doc ca khoi truoc
##[error]Process completed with exit code 2.</div>
<div class="callout warn">
<p><strong>My guess was wrong, and the wrong guess is dangerous.</strong> Bash does not parse a script file completely before running it; it reads and executes one complete command at a time. The <code>echo</code> on line 1 was a complete command, so it ran. Only when bash reached the unterminated <code>if</code> and hit the end of the file did it report the syntax error. In this example the damage is one printed line. In a deploy script, the lines before a syntax error might be <code>docker compose down</code> — executed — followed by a syntax error where <code>docker compose up</code> should have been. (The two lines in the log appear in the "wrong" order because the error went to stderr and the echo to stdout, and the runner interleaves the two streams as they arrive.)</p>
</div>
<p>The cheap defence is to never let a syntax error reach a runner. <code>actionlint</code> runs <code>shellcheck</code> on every <code>run:</code> block, and on this workflow it reported the problem before the push:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest .github/workflows/ch08-kieu-do.yml
ch08-kieu-do.yml:60:9: shellcheck reported issue in this script:
  SC1046:error:2:1: Couldn't find 'fi' for this 'if' [shellcheck]</div>

<h3>134 versus 137, side by side on the same runner</h3>
${slide('ga-08', 7, 'Exit 134 comes with a FATAL ERROR from V8; exit 137 comes with nothing — Docker has to tell you OOMKilled=true')}
<p>The lesson already measured 134 on a laptop. On the runner, the <code>het-heap</code> job printed the same shape: a <code>Last few GCs</code> block, <code>FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory</code>, a native stack trace, bash&#39;s own line <code>Aborted (core dumped)</code>, and <code>exit code 134</code>. Loud, specific and self-explanatory.</p>
<p>137 is the opposite. The <code>oom-container</code> job started a Node container limited to 128 MB and told Node it could use 4 GB of heap. Node believed it; the kernel did not. The job log shows the image being pulled and then, with nothing in between, <code>##[error]Process completed with exit code 137.</code> No error message, no stack, no hint. That silence is the signature: <strong>a process killed by SIGKILL cannot print anything</strong>, because SIGKILL cannot be caught.</p>
<p>So a second run (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012429462" target="_blank" rel="noopener">36012429462</a>) kept the container around long enough to ask Docker who killed it:</p>
<div class="out">exit cua docker run: 137
$ docker inspect ga08-oom --format 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}'
OOMKilled=true ExitCode=137
--- same 128 MB container, heap NOT forced:
heap limit MB: 259
exit khi KHONG ep heap: 137</div>
<p>The last two lines are the surprise worth remembering. Even without <code>--max-old-space-size</code>, Node inside a 128 MB container chose a heap ceiling of 259 MB — larger than the container. Node does read the container&#39;s memory limit (in a 1 GB container on the course machine it chose 524 MB), but there is a floor, and below it V8&#39;s own limit is never reached: the kernel kills the process first, and you get a silent 137 instead of a loud 134. When a Node build in a small container dies with 137, the fix is either more memory for the container or an explicit, <em>smaller</em> <code>--max-old-space-size</code> so that V8 gives up first and tells you why.</p>
<div class="callout">
<p><strong>Where to look for a 137 outside Docker.</strong> On a GitHub-hosted runner you cannot read the host&#39;s kernel log after the job, but inside the job <code>sudo dmesg | tail</code> right after the failing command usually shows an <code>Out of memory: Killed process …</code> line. On your own VPS it is <code>journalctl -k | grep -i oom</code>, and for a container, <code>docker inspect</code> as above — this repository&#39;s <code>Exited(137)</code> on 2026-07-06 was the same question, answered the same way.</p>
</div>

<h3>Cancelled and timed out: there is no exit code at all</h3>
${slide('ga-08', 8, 'Cancel sends SIGINT first, SIGTERM after 7.5 s, then kills the tree 2.5 s later — and the log has no exit code')}
<p>The four-signal table earlier in this lesson says a cancelled job produces 143. That was a guess from the signal table, and the measurement says otherwise. The sandbox job <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171932" target="_blank" rel="noopener">36011171932</a> installed traps for both signals, printed a line every second, and was cancelled from the command line with <code>gh run cancel</code> at 14:14:01:</p>
<div class="out">bat dau 14:13:08, pid 2284
nhan SIGINT luc 14:14:01
##[error]The operation was canceled.
buoc always() van chay sau khi huy? job.status=cancelled
Cleaning up orphan processes</div>
<p>Three facts come out of those five lines. The runner sends <strong>SIGINT</strong> first — the Ctrl-C signal — not SIGTERM; the documentation confirms the sequence: SIGINT to the step&#39;s entry process, SIGTERM if it has not exited after 7,500 ms, and the whole process tree killed 2,500 ms after that. The log line is <strong>"The operation was canceled."</strong> and there is no "Process completed with exit code" line at all, so the exit-code reading in step 4 of lesson 8.4 has nothing to read. And a step with <code>if: always()</code> still runs after a cancel, while an ordinary step does not — which is how cleanup steps survive cancellation.</p>
<p>Timeouts travel the same road. The <code>het-gio-buoc</code> job had a step with <code>timeout-minutes: 1</code> running <code>sleep 150</code>; the <code>het-gio-job</code> job had the same limit on the whole job:</p>
<table>
<thead><tr><th></th><th>Step timeout</th><th>Job timeout</th></tr></thead>
<tbody>
<tr><td>Where the limit is written</td><td><code>steps[*].timeout-minutes: 1</code></td><td><code>jobs.&lt;id&gt;.timeout-minutes: 1</code> (default 360)</td></tr>
<tr><td>Line in the step log</td><td><code>The action 'Buoc co timeout-minutes 1' has timed out after 1 minutes.</code></td><td><code>The operation was canceled.</code></td></tr>
<tr><td>Annotation</td><td>same sentence</td><td><code>The job has exceeded the maximum execution time of 1m0s</code></td></tr>
<tr><td>Measured end of the step</td><td>14:12:42 → 14:13:55 (73 s)</td><td>14:13:03 → 14:14:14 (71 s)</td></tr>
<tr><td>Following steps</td><td>skipped ("-")</td><td>none left</td></tr>
<tr><td>Clean-up line</td><td colspan="2"><code>Terminate orphan process: pid (…) (sleep)</code></td></tr>
</tbody>
</table>
<p>Both limits of one minute ended their steps about 71–73 seconds after the start. That is consistent with the cancellation sequence above: bash was waiting on <code>sleep 150</code> and did not act on SIGINT, SIGTERM came 7.5 s later, the kill 2.5 s after that, and the orphaned <code>sleep</code> was cleaned up at the end. The practical lesson is that a job timeout shows up in the step log only as a cancellation — the explanation is in the annotation, which is one more reason to read annotations first.</p>
<div class="callout warn">
<p><strong>Correction to this lesson&#39;s signal table.</strong> The 143 row originally said "a cancelled workflow job produces this". Measured on 24 September 2026, a cancel sends SIGINT and the log shows no exit code. 143 appears when something sends <em>SIGTERM</em> and the process dies of it — <code>docker stop</code>, <code>kill</code> with no signal name, a supervisor shutting down, or a GitHub cancel whose step ignored SIGINT for 7.5 seconds. And 130 (128 + 2) is what a shell that exits on SIGINT reports — in CI you will rarely see it printed, for the same reason.</p>
</div>
<h3>The pipe trap, for the third time in this course</h3>
<p>The first version of the V8 measurement above was written as <code>node … | tail -3</code>, and it reported <strong>exit 0</strong>:</p>

<div class="out">node --max-old-space-size=40 -e '...'              -> exit 134
node --max-old-space-size=40 -e '...' | tail -1    -> exit 0</div>

<div class="pitfall">
<p><strong>Trap — this is the third time the same trap has caught a measurement in this course.</strong> Lesson 2.4 measured <code>set -e</code> through a <code>| grep</code> and read exit 0. Lesson 6.5&#39;s audit script used <code>grep -c</code> and undercounted by nine. And here, a <code>| tail</code> turned an exit 134 into an exit 0. Three different lessons, three different authors&#39; intentions, one default behaviour: <strong>a pipeline reports the exit code of its last command</strong>. That is why <code>shell: bash</code> — which adds <code>pipefail</code> — is the highest-value one-line change in a workflow file, and why this course keeps saying so.</p>
</div>

<h3>Reading the exit code out of a run</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">in the log</span><span class="lz-t">the last line of the failing step</span><span class="lz-d"><code>##[error]Process completed with exit code 134.</code> — the runner prints it verbatim</span></div>
<div class="lz-step"><span class="lz-k">in your own script</span><span class="lz-t">capture it before it is lost</span><span class="lz-d"><code>lenh; RC=\$?</code> on the very next line. Anything in between — an <code>echo</code>, a pipe — replaces it</span></div>
<div class="lz-step"><span class="lz-k">through a pipeline</span><span class="lz-t"><code>&#36;{PIPESTATUS[@]}</code></span><span class="lz-d">bash keeps every stage&#39;s code in that array. It is the manual version of what <code>pipefail</code> automates</span></div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> The exit code names the cause before the log does — 127 means it was never found, 126 means it was never executable, 134 means it gave up on itself and 137 means something else gave up on it — and all four are lost the moment the command goes through a pipe.</p>
</div>

<h3>A first-response sheet, by exit code</h3>
<table>
<thead><tr><th>You see</th><th>It means</th><th>Do first</th><th>Do not</th></tr></thead>
<tbody>
<tr><td><code>exit code 1</code></td><td>a tool decided to fail</td><td>read that tool&#39;s output above the error line</td><td>assume it is the runner</td></tr>
<tr><td><code>exit code 2</code></td><td>bash syntax / bad usage</td><td>run actionlint on the workflow; check which lines ran before the error</td><td>re-run: a syntax error is 100% reproducible</td></tr>
<tr><td><code>exit code 126</code></td><td>found, not executable</td><td><code>git update-index --chmod=+x</code> or <code>bash script.sh</code></td><td>add <code>chmod +x</code> only in CI</td></tr>
<tr><td><code>exit code 127</code></td><td>command not found</td><td>typo? earlier install step skipped? print <code>$PATH</code></td><td>reinstall everything</td></tr>
<tr><td><code>exit code 134</code></td><td>V8 heap ceiling (for Node)</td><td>print the heap limit; reduce memory use or raise <code>--max-old-space-size</code></td><td>confuse it with 137</td></tr>
<tr><td><code>exit code 137</code></td><td>SIGKILL — almost always out of real memory</td><td><code>docker inspect … OOMKilled</code>, <code>dmesg</code>; give the process less to hold or the machine more RAM</td><td>raise the V8 ceiling</td></tr>
<tr><td><code>exit code 139</code></td><td>segfault in native code</td><td>check that native binaries match the OS/arch (Chapter 2)</td><td>blame JavaScript</td></tr>
<tr><td>"The operation was canceled."</td><td>someone or something cancelled</td><td>who: a person, fail-fast, concurrency, a job timeout (check the annotation)</td><td>look for an exit code</td></tr>
<tr><td>"has timed out after N minutes"</td><td>step timeout</td><td>was it hung or merely slow? compare the duration with the last green runs</td><td>just raise the timeout</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: A CI step fails with exit code 137. What happened and what do you check?</strong><br>A: 137 is 128 + 9, so the process received SIGKILL, which it cannot catch — that is why there is usually no error message. On CI that is almost always the out-of-memory killer. I check memory: in a container, <code>docker inspect</code> shows <code>OOMKilled=true</code>; on a machine, <code>dmesg</code> shows the kill. The fix is less memory use or more memory — not raising a heap flag, which only makes the process grab more before being killed.</p>
<p><strong>Q: What is the difference between exit code 127 and exit code 1?</strong><br>A: 127 comes from the shell: the command was not found, so the program never started — a typo, a missing install step, or a <code>PATH</code> problem. 1 comes from the program itself: it ran and decided to fail, so its own output explains why.</p>
<p><strong>Q: Why can a job show "The operation was canceled." when nobody pressed Cancel?</strong><br>A: Because timeouts, <code>fail-fast</code> in a matrix, and <code>concurrency</code> with <code>cancel-in-progress</code> all cancel jobs the same way. The annotation says which: a job timeout says "exceeded the maximum execution time", fail-fast cancels sibling legs after one fails.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want to be able to read an exit code off a run page as quickly as the chapter does — so you will produce the codes yourself, in your own repository, and read them from the annotations only.</p><ol>
<li>In a test repository, add <code>.github/workflows/do-thu.yml</code> triggered on <code>push</code> with four jobs, each a single <code>run:</code> step: <code>false</code>; <code>eslnt .</code>; <code>node --max-old-space-size=64 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'</code>; and <code>./chay.sh</code> where <code>chay.sh</code> is committed without the executable bit (<code>git update-index --chmod=-x chay.sh</code>).</li>
<li>Push. Without opening any job, run <code>gh run view --log-failed | grep -F "exit code"</code> and write down the four codes.</li>
<li>Add a fifth job with <code>timeout-minutes: 1</code> and <code>sleep 150</code>. Push and read its annotation.</li>
<li>Fix the fourth job properly (<code>git update-index --chmod=+x chay.sh</code>), push, and confirm that job turns green.</li>
<li>Run actionlint locally on a copy of the workflow with an <code>if</code> and no <code>fi</code>, and read the SC1046 line before you push it.</li></ol>
<p><strong>Done when:</strong> your note reads <code>1 · 127 · 134 · 126</code> in the order of the jobs; the timeout job&#39;s annotation says "exceeded the maximum execution time"; and the chmod job is green without any <code>chmod</code> step in the workflow.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">The number a process returns when it ends: 0 success, anything else failure. A step fails when its shell exits non-zero.</span></div>
  <div class="kv"><span class="k">Signal (tín hiệu)</span><span class="v">A message the kernel delivers to a process: SIGINT (2), SIGABRT (6), SIGKILL (9), SIGTERM (15). Death by signal n is reported as 128 + n.</span></div>
  <div class="kv"><span class="k">Annotation (chú thích lỗi)</span><span class="v">A line GitHub attaches to a run (and to files, with <code>::error file=…</code>). The job&#39;s final error — including its exit code — becomes one automatically.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel mechanism that kills a process when memory runs out. It uses SIGKILL, so the victim prints nothing and exits 137.</span></div>
  <div class="kv"><span class="k">Heap ceiling (trần heap)</span><span class="v">The maximum V8 lets JavaScript allocate, set by <code>--max-old-space-size</code> or chosen from the machine&#39;s memory. Reaching it gives 134.</span></div>
  <div class="kv"><span class="k"><code>timeout-minutes</code></span><span class="v">A limit on a step or a job (job default 360). When reached, the runner cancels — no exit code, an annotation instead.</span></div>
  <div class="kv"><span class="k">File mode <code>100755</code> / <code>100644</code></span><span class="v">How Git records whether a file is executable. Changed with <code>git update-index --chmod=±x</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The annotation at the bottom of a run page already prints each failed job&#39;s exit code — read it before any log.</li>
<li>1 is the tool&#39;s verdict; 2, 126 and 127 mean the shell could not run the program at all — and with 2, the lines before the syntax error did run.</li>
<li>134 is V8 giving up loudly; 137 is the kernel killing silently. Their fixes are opposites; <code>docker inspect</code> shows <code>OOMKilled</code>.</li>
<li>Node in a small container can still choose a heap larger than the container, so the kill comes before V8&#39;s error.</li>
<li>Cancel and timeout send SIGINT, then SIGTERM after 7.5 s, then kill — and the log says "The operation was canceled." with no exit code.</li>
<li>Pipes still erase exit codes: <code>shell: bash</code> gives you <code>pipefail</code>.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36011088172 — ten jobs, ten kinds of red</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088172 — exit codes 1, 2, 126, 127, 134, 137 and both kinds of timeout from this lesson, each in its own job.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox runs 36011171932 and 36012429462 — cancel and OOMKilled</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171932 — the SIGINT caught by a trap on cancel; …/runs/36012429462 — <code>docker inspect</code> reporting <code>OOMKilled=true</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow cancellation</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-cancellation — SIGINT, then SIGTERM after 7,500 ms, then the process tree killed after 2,500 ms, and how <code>always()</code> keeps a step running.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — EXIT STATUS</span><span class="lc-sub">man 1 bash — the documented meanings of 126, 127 and 128+n, and the statement that a pipeline&#39;s status is that of its last command unless <code>pipefail</code> is set.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7) — the signal numbers</span><span class="lc-sub">man 7 signal — the table that turns 134, 137, 139 and 143 back into SIGABRT, SIGKILL, SIGSEGV and SIGTERM, and what each one means about who ended the process.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — resource constraints and --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize — the V8 heap ceiling behind every 134 in a Node build, and why the default depends on the machine rather than on your code.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — exit codes, signals, and PIPESTATUS</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the full treatment, including the cases where <code>set -euo pipefail</code> still lets a failure through.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — Exited(137) and what actually killed the container</span><span class="lc-sub">/courses/docker/learn${REF} — the OOM killer versus <code>docker stop</code>, both of which produce 137 and need different responses.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Mã thoát, ĐO chứ không tra</h2>
<p class="lead">Một bước hỏng vì một tiến trình thoát khác không, và con số nó thoát bằng thường gọi tên nguyên nhân rất chính xác. Cái bảng dưới đây đáng thuộc lòng — nên thay vì chép nó từ một trang man, đây là nó được đẻ ra bằng cách CHẠY từng ca.</p>

<h3>Phép đo</h3>
${slide('ga-08', 3, 'Bảng mã thoát, mỗi dòng có một dòng log thật của run 36011088172 làm chứng')}
<div class="out">lenh                                exit
--------------------------------------------
exit 0                                 0
false                                  1
lenh-khong-ton-tai                   127
tep khong co quyen thuc thi          126
kill -SEGV \$\$                        139
kill -ABRT \$\$                        134
kill -KILL \$\$                        137
kill -TERM \$\$                        143</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — một cú hỏng chung chung</span><span class="lz-lnote">phần lớn công cụ thoát 1 cho bất cứ chuyện gì sai. Nó cho bạn biết một công cụ đã quyết định hỏng, và không gì hơn. Hãy đọc đầu ra của công cụ ấy</span></div>
<div class="lz-layer"><span class="lz-lname">126 và 127 — shell KHÔNG chạy được nó</span><span class="lz-lnote">127 là "không tìm thấy lệnh": gõ sai, hoặc một bước lẽ ra phải cài nó mà đã không. 126 là "tìm thấy rồi mà không thực thi được": gần như luôn là thiếu <code>chmod +x</code> trên một script trong kho. Không cái nào là lỗi trong CHƯƠNG TRÌNH bạn, bởi chương trình bạn chưa hề chạy</span></div>
<div class="lz-layer"><span class="lz-lname">128 + n — bị TÍN HIỆU n giết</span><span class="lz-lnote">đây là họ đáng nhận ra ngay khi nhìn, bởi nó nghĩa là có thứ gì <em>BÊN NGOÀI</em> đã kết liễu tiến trình. Trừ 128 đi là ra số hiệu tín hiệu</span></div>
<div class="lz-layer"><span class="lz-lname">2 — dùng SAI CÁCH</span><span class="lz-lnote">mã của bash cho một lỗi cú pháp hoặc dùng sai tham số. Trên một cú hỏng CI, nó thường nghĩa là chính cái SCRIPT bị viết hỏng, chứ không phải phần việc hỏng</span></div>
</div>

<h3>Bốn tín hiệu xuất hiện trong CI</h3>
<div class="kv-grid">
<div class="kv"><span class="k">134 = 128 + 6 · SIGABRT</span><span class="v">tiến trình đã gọi <code>abort()</code>. Với bất cứ thứ gì chạy trên Node thì gần như luôn là V8 chạm trần heap của nó — đo ở dưới</span></div>
<div class="kv"><span class="k">137 = 128 + 9 · SIGKILL</span><span class="v">có thứ gì đó GIẾT nó và nó không từ chối được. Trên một runner thì đó là OOM killer; trong Docker thì đó cũng là thứ mà <code>docker stop</code> leo thang tới sau khoảng ân hạn. Kho này đã dính nó trên VPS (06/07/2026, <code>Exited(137)</code>)</span></div>
<div class="kv"><span class="k">143 = 128 + 15 · SIGTERM</span><span class="v">một lời đề nghị dừng lịch sự. Nó xuất hiện khi có thứ gì gửi SIGTERM và tiến trình chết vì nó: <code>docker stop</code>, một lệnh <code>kill</code> trơn, một trình giám sát đang tắt. (Dòng này lúc đầu ghi một job workflow bị huỷ đẻ ra 143 — đo ở dưới: huỷ thì gửi SIGINT trước và log không hiện mã thoát nào cả.)</span></div>
<div class="kv"><span class="k">139 = 128 + 11 · SIGSEGV</span><span class="v">một cú segfault. Hiếm trong bộ công cụ JS, thường gặp ở các module gốc — và là tín hiệu mạnh rằng một tệp nhị phân dựng sẵn KHÔNG khớp nền tảng, thứ mà Chương 2 đã đo là một kiểu hỏng có thật</span></div>
</div>

<h3>Kiểm chứng cái có ý nghĩa ở đây</h3>
<p>Cú hỏng đắt nhất của kho này thoát bằng <strong>134</strong>. Thay vì cho rằng điều đó nghĩa là chạm trần heap, hãy BÓP một tiến trình Node rồi xem:</p>

<div class="out">$ node --max-old-space-size=40 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'
Aborted
exit THAT = 134

&lt;--- Last few GCs ---&gt;
FATAL ERROR: Reached heap limit Allocation failed</div>

<div class="callout ok">
<p><strong>134, khớp chính xác với cú hỏng thật.</strong> Lần chạy 32400097927 in ra <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code> và thoát 134 ở nhánh macOS. Nên cái chuỗi giờ được XÁC LẬP chứ không còn là phỏng đoán: V8 không cấp phát được nữa → V8 gọi <code>abort()</code> → SIGABRT → 128 + 6 = 134. Nhìn thấy 134 trong một log dựng Node là đủ biết chuyện gì đã xảy ra trước khi đọc một dòng đầu ra nào.</p>
</div>

<div class="callout warn">
<p><strong>134 và 137 trông giống nhau và mang nghĩa NGƯỢC nhau.</strong> 134 là tiến trình TỰ quyết định nó không đi tiếp được — nó chạm một cái trần mà <em>CHÍNH NÓ</em> biết, với Node thì đó là trần heap của V8 và nâng bằng <code>--max-old-space-size</code>. 137 là tiến trình bị GIẾT TỪ BÊN NGOÀI — cỗ máy cạn bộ nhớ thật, và nâng trần V8 lên chỉ làm nó <em>TỆ HƠN</em>. Đọc lẫn hai cái dẫn thẳng tới đúng cách vá sai.</p>
</div>

<h3>Đo lại trên runner thật: một run, mười kiểu đỏ</h3>
${slide('ga-08', 4, 'Một workflow, mười job, mỗi job đỏ một kiểu — annotation đã gọi tên mã thoát')}
<p>Bảng bên trên được đẻ ra trên một cái laptop. Một cái bảng nói về CI thì nên được kiểm trên CI, nên kho sân tập có thêm một workflow chỉ để làm đúng một việc: đỏ theo mười cách khác nhau, mỗi cách một job: <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088172" target="_blank" rel="noopener">run 36011088172</a> trên nhánh <code>ch08-do</code>, ngày 24/09/2026, ảnh <code>ubuntu-24.04</code> bản 20260920.314.1. Mọi job chạy song song nên cả run xong trong chưa tới hai phút, và mỗi dấu ✗ đỏ trên đó là một cú hỏng THẬT mà bạn mở ra xem được.</p>
<pre><code class="language-yaml">defaults:
  run:
    shell: bash                  # thêm -e -o pipefail
    working-directory: ch08/app
jobs:
  thieu-lenh:                    # gõ sai tên công cụ
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
      - run: eslnt .
  khong-quyen:                   # script commit mà thiếu bit thực thi
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
      - run: ./scripts/chay.sh
  het-heap:                      # V8 chạm cái trần của chính nó
    runs-on: ubuntu-24.04
    steps:
      - run: node --max-old-space-size=64 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'
        working-directory: .
  # … và bảy job nữa: test-sai, lint, npm-sai-ten, cu-phap, oom-container, het-gio-buoc, het-gio-job</code></pre>
<p>Phát hiện hữu ích đầu tiên là mã thoát hiện ra Ở ĐÂU. Bạn không cần mở một cái log nào để đọc nó: GitHub biến lỗi cuối cùng của mỗi job hỏng thành một <strong>annotation</strong> (chú thích lỗi), và các annotation được liệt kê ở cuối trang run, và được <code>gh run view</code> in ra:</p>
<div class="out">ANNOTATIONS
X Process completed with exit code 137.     oom-container: .github#26
X Process completed with exit code 127.     thieu-lenh: .github#6
X Process completed with exit code 1.       test-sai: .github#43
X Process completed with exit code 2.       cu-phap: .github#9
X Process completed with exit code 126.     khong-quyen: .github#6
X Process completed with exit code 134.     het-heap: .github#33
X The action 'Buoc co timeout-minutes 1' has timed out after 1 minutes.   het-gio-buoc
X The job has exceeded the maximum execution time of 1m0s                 het-gio-job</div>
<p>Tám dòng, và tám chẩn đoán khác nhau TRƯỚC khi mở một cái log nào. Đó là nghĩa thực dụng của câu "mã thoát gọi tên nguyên nhân": trên một trang run thật, nó là thứ được in ra ĐẦU TIÊN, và được in cho mọi job cùng một lúc.</p>

<h3>127 và 1: AI đang báo cho bạn là hỏng</h3>
${slide('ga-08', 5, 'Gõ sai tên lệnh là 127 từ shell; gõ sai tên script npm là 1 từ npm')}
<p>Hai job mắc CÙNG một lỗi của con người — gõ sai — và nhận hai mã khác nhau. <code>eslnt .</code> thoát <strong>127</strong> kèm lời nhắn của chính shell, <code>eslnt: command not found</code>. <code>npm run tset</code> thoát <strong>1</strong> kèm lời nhắn của npm, <code>npm error Missing script: "tset"</code>, rồi một câu gợi ý tử tế "Did you mean this?".</p>
<p>Khác biệt nằm ở chỗ <em>AI</em> phát hiện. Ở ca đầu, shell lục khắp <code>PATH</code>, không thấy thứ gì tên <code>eslnt</code>, và bỏ cuộc TRƯỚC khi bất cứ chương trình nào khởi động — 127 được dành riêng cho đúng chuyện đó. Ở ca sau, shell tìm thấy <code>npm</code> dễ dàng, npm khởi động, đọc <code>package.json</code>, không thấy script, và TỰ chọn thoát bằng mã hỏng chung chung của nó. Nên mã thoát cho bạn biết nên tin lời nhắn của ai: 127 nghĩa là đọc lại DÒNG LỆNH bạn đã viết; 1 nghĩa là đọc thứ CÔNG CỤ đã in ra.</p>
<div class="callout">
<p><strong>Con 127 hay gặp nhất ngoài đời KHÔNG phải do gõ sai.</strong> Nó là một bước dùng một công cụ mà một bước trước đó lẽ ra phải cài — và bước trước ấy đã bị một <code>if:</code> bỏ qua, bị cache sai, hoặc cài nó vào chỗ không nằm trên <code>PATH</code> (một lệnh <code>npm install -g</code> trên một phiên bản Node khác, một <code>pip install --user</code> mà thư mục bin không nằm trên path). Khi thấy 127 cho một công cụ bạn chắc chắn đã cài, hãy in <code>echo "$PATH"</code> và <code>command -v tencongcu</code> ngay trong bước hỏng trước khi đụng vào bất cứ thứ gì khác.</p>
</div>

<h3>126 và 2: chương trình chưa hề khởi động — nhưng một phần script thì CÓ</h3>
${slide('ga-08', 6, 'Thiếu bit thực thi cho 126; thiếu fi cho 2 — và các dòng trước lỗi cú pháp vẫn đã chạy')}
<p><strong>126</strong> đến từ <code>./scripts/chay.sh: Permission denied</code>. Script có trong kho và shell đã tìm thấy nó, nhưng chế độ tệp của nó trong Git là <code>100644</code> — không có bit thực thi — nên nhân hệ điều hành từ chối chạy. Nguyên nhân gần như luôn là tệp được tạo trên một máy hay một trình soạn thảo không đặt bit ấy, hoặc được commit từ Windows, nơi Git không nhìn thấy quyền kiểu Unix. Cách vá KHÔNG phải <code>chmod</code> trong workflow; mà là sửa chế độ tệp ngay trong Git để mọi lần checkout đều đúng:</p>
<pre><code>git ls-files -s scripts/chay.sh        # 100644 = không thực thi được
git update-index --chmod=+x scripts/chay.sh
git commit -m "cho chay.sh thuc thi duoc"  # giờ là 100755</code></pre>
<p>Cách né hẳn câu hỏi này là <code>run: bash scripts/chay.sh</code> — gọi thẳng trình thông dịch thì không cần bit thực thi. Cả hai đều ổn; thứ KHÔNG ổn là một bước <code>chmod +x</code> trong CI làm pipeline xanh trong khi bản checkout của mọi lập trình viên vẫn mang chế độ hỏng.</p>
<p><strong>2</strong> đến từ một khối <code>run:</code> có <code>if</code> mà không có <code>fi</code>. Phần đáng chú ý là cái log, vì dòng đầu của workflow ghi <em>"dòng này KHÔNG được in, vì bash đọc cả khối trước"</em> — và log đã IN nó ra:</p>
<div class="out">/home/runner/work/_temp/44062232-….sh: line 4: syntax error: unexpected end of file
dong nay KHONG duoc in, vi bash doc ca khoi truoc
##[error]Process completed with exit code 2.</div>
<div class="callout warn">
<p><strong>Phỏng đoán của tôi SAI, và phỏng đoán sai này nguy hiểm.</strong> Bash KHÔNG phân tích hết một tệp script rồi mới chạy; nó đọc và thực thi từng câu lệnh HOÀN CHỈNH một. Lệnh <code>echo</code> ở dòng 1 là một câu lệnh hoàn chỉnh, nên nó CHẠY. Chỉ khi bash tới cái <code>if</code> chưa đóng và đụng cuối tệp thì nó mới báo lỗi cú pháp. Trong ví dụ này thiệt hại là một dòng chữ. Trong một script deploy, các dòng trước một lỗi cú pháp có thể là <code>docker compose down</code> — ĐÃ chạy — rồi tới lỗi cú pháp ngay chỗ lẽ ra là <code>docker compose up</code>. (Hai dòng trong log hiện theo thứ tự "ngược" vì lỗi đi ra stderr còn echo đi ra stdout, và runner trộn hai luồng theo thứ tự chúng tới.)</p>
</div>
<p>Cách phòng thủ rẻ là đừng bao giờ để một lỗi cú pháp tới được runner. <code>actionlint</code> chạy <code>shellcheck</code> trên mọi khối <code>run:</code>, và trên workflow này nó đã báo lỗi TRƯỚC khi push:</p>
<div class="out">$ docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest .github/workflows/ch08-kieu-do.yml
ch08-kieu-do.yml:60:9: shellcheck reported issue in this script:
  SC1046:error:2:1: Couldn't find 'fi' for this 'if' [shellcheck]</div>

<h3>134 và 137, đặt cạnh nhau trên cùng một runner</h3>
${slide('ga-08', 7, 'Exit 134 đi kèm FATAL ERROR của V8; exit 137 không kèm gì — phải hỏi Docker mới thấy OOMKilled=true')}
<p>Bài này đã đo 134 trên laptop. Trên runner, job <code>het-heap</code> in ra đúng hình dạng ấy: một khối <code>Last few GCs</code>, <code>FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory</code>, một stack trace gốc, dòng riêng của bash <code>Aborted (core dumped)</code>, và <code>exit code 134</code>. Ồn ào, cụ thể, tự giải thích.</p>
<p>137 thì ngược lại. Job <code>oom-container</code> chạy một container Node bị giới hạn 128 MB và bảo Node rằng nó được dùng 4 GB heap. Node tin; nhân hệ điều hành thì không. Log của job hiện cảnh kéo ảnh về rồi, không có gì ở giữa, <code>##[error]Process completed with exit code 137.</code> Không lời nhắn, không stack, không gợi ý. Sự IM LẶNG ấy chính là chữ ký: <strong>một tiến trình bị SIGKILL giết thì không in được gì</strong>, vì SIGKILL không bắt được.</p>
<p>Nên một run thứ hai (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012429462" target="_blank" rel="noopener">36012429462</a>) giữ container lại đủ lâu để hỏi Docker xem ai đã giết nó:</p>
<div class="out">exit cua docker run: 137
$ docker inspect ga08-oom --format 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}'
OOMKilled=true ExitCode=137
--- cùng container 128 MB, KHÔNG ép heap:
heap limit MB: 259
exit khi KHONG ep heap: 137</div>
<p>Hai dòng cuối là điều bất ngờ đáng nhớ. Ngay cả khi không có <code>--max-old-space-size</code>, Node trong một container 128 MB vẫn chọn trần heap 259 MB — LỚN HƠN cả container. Node CÓ đọc giới hạn bộ nhớ của container (trong một container 1 GB trên máy của khoá, nó chọn 524 MB), nhưng có một cái sàn, và dưới cái sàn ấy thì trần của V8 không bao giờ được chạm tới: nhân hệ điều hành giết tiến trình trước, và bạn nhận một con 137 im lặng thay vì một con 134 ồn ào. Khi một bản dựng Node trong container nhỏ chết với 137, cách vá là cho container thêm bộ nhớ, hoặc đặt tường minh một <code>--max-old-space-size</code> <em>NHỎ HƠN</em> để V8 bỏ cuộc trước và NÓI cho bạn biết vì sao.</p>
<div class="callout">
<p><strong>Tìm một con 137 ở đâu khi không có Docker.</strong> Trên runner do GitHub cấp, bạn không đọc được log nhân của máy sau khi job xong, nhưng ngay trong job, <code>sudo dmesg | tail</code> đặt ngay sau lệnh hỏng thường hiện một dòng <code>Out of memory: Killed process …</code>. Trên VPS của chính bạn thì là <code>journalctl -k | grep -i oom</code>, còn với container thì <code>docker inspect</code> như trên — cú <code>Exited(137)</code> của kho này ngày 06/07/2026 cũng là đúng câu hỏi ấy, và được trả lời đúng cách ấy.</p>
</div>

<h3>Bị huỷ và hết giờ: hoàn toàn KHÔNG có mã thoát</h3>
${slide('ga-08', 8, 'Huỷ gửi SIGINT trước, SIGTERM sau 7,5 s, rồi giết cả cây 2,5 s sau — và log không có mã thoát')}
<p>Bảng bốn tín hiệu ở đầu bài nói một job bị huỷ đẻ ra 143. Đó là một phỏng đoán suy từ bảng tín hiệu, và phép đo nói khác. Job sân tập <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171932" target="_blank" rel="noopener">36011171932</a> cài bẫy (trap) cho cả hai tín hiệu, mỗi giây in một dòng, và bị huỷ từ dòng lệnh bằng <code>gh run cancel</code> lúc 14:14:01:</p>
<div class="out">bat dau 14:13:08, pid 2284
nhan SIGINT luc 14:14:01
##[error]The operation was canceled.
buoc always() van chay sau khi huy? job.status=cancelled
Cleaning up orphan processes</div>
<p>Năm dòng ấy cho ra ba sự thật. Runner gửi <strong>SIGINT</strong> trước — tín hiệu của Ctrl-C — chứ không phải SIGTERM; tài liệu xác nhận trình tự: SIGINT tới tiến trình đầu vào của bước, SIGTERM nếu sau 7.500 ms nó chưa thoát, và cả cây tiến trình bị giết 2.500 ms sau đó. Dòng log là <strong>"The operation was canceled."</strong> và KHÔNG có dòng "Process completed with exit code" nào, nên việc đọc mã thoát ở bước 4 của bài 8.4 chẳng có gì để đọc. Và một bước có <code>if: always()</code> vẫn chạy sau khi huỷ, còn bước thường thì không — đó là cách các bước dọn dẹp sống sót qua việc huỷ.</p>
<p>Hết giờ cũng đi đúng con đường ấy. Job <code>het-gio-buoc</code> có một bước <code>timeout-minutes: 1</code> chạy <code>sleep 150</code>; job <code>het-gio-job</code> đặt cùng giới hạn cho cả job:</p>
<table>
<thead><tr><th></th><th>Hết giờ của BƯỚC</th><th>Hết giờ của JOB</th></tr></thead>
<tbody>
<tr><td>Giới hạn viết ở đâu</td><td><code>steps[*].timeout-minutes: 1</code></td><td><code>jobs.&lt;id&gt;.timeout-minutes: 1</code> (mặc định 360)</td></tr>
<tr><td>Dòng trong log của bước</td><td><code>The action 'Buoc co timeout-minutes 1' has timed out after 1 minutes.</code></td><td><code>The operation was canceled.</code></td></tr>
<tr><td>Annotation</td><td>cùng câu ấy</td><td><code>The job has exceeded the maximum execution time of 1m0s</code></td></tr>
<tr><td>Bước kết thúc thật lúc</td><td>14:12:42 → 14:13:55 (73 s)</td><td>14:13:03 → 14:14:14 (71 s)</td></tr>
<tr><td>Các bước sau</td><td>bị bỏ qua ("-")</td><td>không còn bước nào</td></tr>
<tr><td>Dòng dọn dẹp</td><td colspan="2"><code>Terminate orphan process: pid (…) (sleep)</code></td></tr>
</tbody>
</table>
<p>Cả hai giới hạn một phút đều kết thúc bước của chúng khoảng 71–73 giây sau lúc bắt đầu. Điều đó khớp với trình tự huỷ bên trên: bash đang chờ <code>sleep 150</code> nên không xử lý SIGINT, SIGTERM tới sau 7,5 s, lệnh giết tới 2,5 s sau nữa, và con <code>sleep</code> mồ côi bị dọn ở cuối. Bài học thực dụng: một cú hết giờ của JOB chỉ hiện trong log của bước như một lần HUỶ — lời giải thích nằm ở annotation, thêm một lý do để đọc annotation trước.</p>
<div class="callout warn">
<p><strong>Đính chính bảng tín hiệu của bài này.</strong> Dòng 143 lúc đầu ghi "một job workflow bị huỷ đẻ ra mã này". Đo ngày 24/09/2026: huỷ thì gửi SIGINT và log không hiện mã thoát nào. 143 xuất hiện khi có thứ gì đó gửi <em>SIGTERM</em> và tiến trình chết vì nó — <code>docker stop</code>, <code>kill</code> không kèm tên tín hiệu, một trình giám sát đang tắt, hoặc một lần huỷ của GitHub mà bước đã lờ SIGINT suốt 7,5 giây. Còn 130 (128 + 2) là thứ một shell thoát vì SIGINT sẽ báo — trong CI bạn hiếm khi thấy nó được in ra, cũng vì lý do ấy.</p>
</div>
<h3>Cái bẫy ống, lần thứ BA trong khoá học này</h3>
<p>Bản đầu tiên của phép đo V8 bên trên được viết là <code>node … | tail -3</code>, và nó báo <strong>exit 0</strong>:</p>

<div class="out">node --max-old-space-size=40 -e '...'              -> exit 134
node --max-old-space-size=40 -e '...' | tail -1    -> exit 0</div>

<div class="pitfall">
<p><strong>Bẫy — đây là lần thứ BA cùng một cái bẫy cắn trúng một phép đo trong khoá này.</strong> Bài 2.4 đo <code>set -e</code> qua một <code>| grep</code> và đọc ra exit 0. Script soát của bài 6.5 dùng <code>grep -c</code> và đếm thiếu chín. Và ở đây, một cái <code>| tail</code> biến exit 134 thành exit 0. Ba bài khác nhau, ba ý định khác nhau của người viết, MỘT hành vi mặc định: <strong>một đường ống báo cáo mã thoát của lệnh CUỐI CÙNG của nó</strong>. Đó là lý do <code>shell: bash</code> — thứ thêm <code>pipefail</code> — là thay đổi một dòng đáng giá nhất trong một tệp workflow, và là lý do khoá học này cứ nói đi nói lại.</p>
</div>

<h3>Đọc mã thoát ra khỏi một lần chạy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">trong log</span><span class="lz-t">dòng cuối của bước hỏng</span><span class="lz-d"><code>##[error]Process completed with exit code 134.</code> — runner in nguyên văn</span></div>
<div class="lz-step"><span class="lz-k">trong script của bạn</span><span class="lz-t">bắt lấy nó trước khi nó mất</span><span class="lz-d"><code>lenh; RC=\$?</code> ở NGAY dòng kế. Bất cứ thứ gì chen vào giữa — một <code>echo</code>, một cái ống — đều thay thế nó</span></div>
<div class="lz-step"><span class="lz-k">qua một đường ống</span><span class="lz-t"><code>&#36;{PIPESTATUS[@]}</code></span><span class="lz-d">bash giữ mã của MỌI chặng trong cái mảng ấy. Nó là bản làm tay của thứ mà <code>pipefail</code> tự động hoá</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mã thoát gọi tên nguyên nhân TRƯỚC cả cái log — 127 nghĩa là chưa bao giờ tìm thấy nó, 126 nghĩa là chưa bao giờ chạy được nó, 134 nghĩa là nó tự bỏ cuộc với chính mình và 137 nghĩa là thứ khác đã bỏ cuộc với nó — và cả bốn đều MẤT ngay khoảnh khắc câu lệnh đi qua một cái ống.</p>
</div>

<h3>Tờ phản ứng đầu tiên, theo mã thoát</h3>
<table>
<thead><tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Làm trước</th><th>Đừng</th></tr></thead>
<tbody>
<tr><td><code>exit code 1</code></td><td>một công cụ tự quyết định hỏng</td><td>đọc đầu ra của công cụ ấy, phía trên dòng lỗi</td><td>cho rằng tại runner</td></tr>
<tr><td><code>exit code 2</code></td><td>bash: cú pháp / dùng sai</td><td>chạy actionlint trên workflow; xem những dòng nào đã chạy trước lỗi</td><td>chạy lại: lỗi cú pháp tái lập 100%</td></tr>
<tr><td><code>exit code 126</code></td><td>thấy tệp, không thực thi được</td><td><code>git update-index --chmod=+x</code> hoặc <code>bash script.sh</code></td><td>chỉ thêm <code>chmod +x</code> trong CI</td></tr>
<tr><td><code>exit code 127</code></td><td>không tìm thấy lệnh</td><td>gõ sai? bước cài bị bỏ? in <code>$PATH</code></td><td>cài lại mọi thứ</td></tr>
<tr><td><code>exit code 134</code></td><td>trần heap V8 (với Node)</td><td>in trần heap; giảm bộ nhớ dùng hoặc nâng <code>--max-old-space-size</code></td><td>nhầm với 137</td></tr>
<tr><td><code>exit code 137</code></td><td>SIGKILL — gần như luôn là hết RAM THẬT</td><td><code>docker inspect … OOMKilled</code>, <code>dmesg</code>; bắt tiến trình giữ ít hơn hoặc cho máy thêm RAM</td><td>nâng trần V8</td></tr>
<tr><td><code>exit code 139</code></td><td>segfault trong mã gốc</td><td>kiểm tệp nhị phân gốc có khớp OS/kiến trúc không (Chương 2)</td><td>đổ tại JavaScript</td></tr>
<tr><td>"The operation was canceled."</td><td>có người/có thứ gì đã huỷ</td><td>ai: một người, fail-fast, concurrency, hết giờ của job (xem annotation)</td><td>đi tìm mã thoát</td></tr>
<tr><td>"has timed out after N minutes"</td><td>bước hết giờ</td><td>nó TREO hay chỉ CHẬM? so thời lượng với các lần xanh gần nhất</td><td>chỉ nâng giới hạn giờ</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Một bước CI hỏng với exit code 137. Chuyện gì đã xảy ra và bạn kiểm gì?</strong><br>Đ: 137 là 128 + 9, nên tiến trình đã nhận SIGKILL — thứ nó không bắt được, và đó là lý do thường không có lời nhắn lỗi nào. Trên CI thì gần như luôn là OOM killer. Tôi kiểm bộ nhớ: trong container, <code>docker inspect</code> hiện <code>OOMKilled=true</code>; trên máy thật, <code>dmesg</code> hiện cú giết. Cách vá là dùng ít bộ nhớ hơn hoặc cho thêm bộ nhớ — không phải nâng một cờ heap, thứ chỉ khiến tiến trình chiếm nhiều hơn trước khi bị giết.</p>
<p><strong>H: Exit code 127 và exit code 1 khác nhau thế nào?</strong><br>Đ: 127 đến từ shell: không tìm thấy lệnh, nên chương trình chưa hề khởi động — gõ sai, thiếu bước cài, hoặc lỗi <code>PATH</code>. 1 đến từ chính chương trình: nó đã chạy và tự quyết định hỏng, nên đầu ra của NÓ giải thích vì sao.</p>
<p><strong>H: Vì sao một job có thể hiện "The operation was canceled." dù không ai bấm Cancel?</strong><br>Đ: Vì hết giờ, <code>fail-fast</code> trong ma trận, và <code>concurrency</code> có <code>cancel-in-progress</code> đều huỷ job theo cùng một cách. Annotation cho biết là cái nào: hết giờ của job thì ghi "exceeded the maximum execution time", còn fail-fast huỷ các nhánh anh em sau khi một nhánh hỏng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn đọc mã thoát trên trang run nhanh như chương này — nên bạn sẽ TỰ đẻ ra các mã ấy, trên kho của chính bạn, và chỉ đọc chúng từ annotation.</p><ol>
<li>Trong một kho thử, thêm <code>.github/workflows/do-thu.yml</code> chạy khi <code>push</code>, có bốn job, mỗi job một bước <code>run:</code>: <code>false</code>; <code>eslnt .</code>; <code>node --max-old-space-size=64 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'</code>; và <code>./chay.sh</code> với <code>chay.sh</code> được commit KHÔNG có bit thực thi (<code>git update-index --chmod=-x chay.sh</code>).</li>
<li>Push. Không mở job nào, chạy <code>gh run view --log-failed | grep -F "exit code"</code> và ghi lại bốn mã.</li>
<li>Thêm job thứ năm có <code>timeout-minutes: 1</code> và <code>sleep 150</code>. Push rồi đọc annotation của nó.</li>
<li>Vá job thứ tư đúng cách (<code>git update-index --chmod=+x chay.sh</code>), push, và xác nhận job ấy chuyển xanh.</li>
<li>Chạy actionlint ở máy trên một bản sao workflow có <code>if</code> mà thiếu <code>fi</code>, và đọc dòng SC1046 TRƯỚC khi push nó.</li></ol>
<p><strong>Đạt khi:</strong> ghi chép của bạn là <code>1 · 127 · 134 · 126</code> theo thứ tự các job; annotation của job hết giờ ghi "exceeded the maximum execution time"; và job chmod xanh mà workflow không có bước <code>chmod</code> nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Con số một tiến trình trả về khi kết thúc: 0 là thành công, mọi số khác là hỏng. Một bước hỏng khi shell của nó thoát khác 0.</span></div>
  <div class="kv"><span class="k">Signal (tín hiệu)</span><span class="v">Thông điệp nhân hệ điều hành gửi tới tiến trình: SIGINT (2), SIGABRT (6), SIGKILL (9), SIGTERM (15). Chết vì tín hiệu n được báo là 128 + n.</span></div>
  <div class="kv"><span class="k">Annotation (chú thích lỗi)</span><span class="v">Một dòng GitHub gắn vào run (và vào tệp, với <code>::error file=…</code>). Lỗi cuối của job — kèm mã thoát — tự thành một annotation.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Cơ chế của nhân giết một tiến trình khi cạn bộ nhớ. Nó dùng SIGKILL, nên nạn nhân không in được gì và thoát 137.</span></div>
  <div class="kv"><span class="k">Heap ceiling (trần heap)</span><span class="v">Mức tối đa V8 cho JavaScript cấp phát, đặt bằng <code>--max-old-space-size</code> hoặc tự chọn theo bộ nhớ máy. Chạm nó thì ra 134.</span></div>
  <div class="kv"><span class="k"><code>timeout-minutes</code> (giới hạn giờ)</span><span class="v">Giới hạn cho một bước hay một job (job mặc định 360). Tới hạn thì runner HUỶ — không có mã thoát, có annotation thay vào.</span></div>
  <div class="kv"><span class="k">Chế độ tệp <code>100755</code> / <code>100644</code></span><span class="v">Cách Git ghi một tệp có thực thi được hay không. Đổi bằng <code>git update-index --chmod=±x</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Annotation ở cuối trang run đã in mã thoát của từng job hỏng — đọc nó trước mọi log.</li>
<li>1 là phán quyết của công cụ; 2, 126 và 127 nghĩa là shell không chạy nổi chương trình — và với 2, các dòng TRƯỚC lỗi cú pháp đã chạy.</li>
<li>134 là V8 bỏ cuộc ồn ào; 137 là nhân giết trong im lặng. Hai cách vá ngược nhau; <code>docker inspect</code> cho thấy <code>OOMKilled</code>.</li>
<li>Node trong container nhỏ vẫn có thể chọn heap lớn hơn container, nên cú giết tới trước lỗi của V8.</li>
<li>Huỷ và hết giờ gửi SIGINT, rồi SIGTERM sau 7,5 s, rồi giết — và log ghi "The operation was canceled." không kèm mã thoát.</li>
<li>Ống vẫn xoá mã thoát: <code>shell: bash</code> cho bạn <code>pipefail</code>.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36011088172 — mười job, mười kiểu đỏ</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088172 — các mã thoát 1, 2, 126, 127, 134, 137 và cả hai kiểu hết giờ của bài này, mỗi cái một job.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36011171932 và 36012429462 — huỷ và OOMKilled</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171932 — SIGINT bị trap bắt khi huỷ; …/runs/36012429462 — <code>docker inspect</code> báo <code>OOMKilled=true</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow cancellation</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-cancellation — SIGINT, rồi SIGTERM sau 7.500 ms, rồi giết cả cây tiến trình sau 2.500 ms, và cách <code>always()</code> giữ một bước tiếp tục chạy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — EXIT STATUS</span><span class="lc-sub">man 1 bash — nghĩa chính thức của 126, 127 và 128+n, và phát biểu rằng trạng thái của một đường ống là trạng thái của lệnh CUỐI trừ khi bật <code>pipefail</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7) — số hiệu các tín hiệu</span><span class="lc-sub">man 7 signal — cái bảng biến 134, 137, 139 và 143 ngược lại thành SIGABRT, SIGKILL, SIGSEGV và SIGTERM, và mỗi cái nói gì về việc AI đã kết liễu tiến trình.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — resource constraints và --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize — cái trần heap của V8 đứng sau mọi con 134 trong một bản dựng Node, và vì sao mặc định của nó phụ thuộc vào CỖ MÁY chứ không phụ thuộc mã bạn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mã thoát, tín hiệu, và PIPESTATUS</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phần trình bày đầy đủ, gồm cả những ca mà <code>set -euo pipefail</code> vẫn để lọt một cú hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — Exited(137) và cái gì THẬT SỰ giết container</span><span class="lc-sub">/courses/docker/learn${REF} — OOM killer so với <code>docker stop</code>, cả hai đều đẻ ra 137 và cần hai cách phản ứng khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Flaky or broken, decided with arithmetic|||8.2 — Flake hay hỏng thật, quyết bằng số học',
      slug: 'ga-8-2-flake',
      type: 'VIDEO',
      description: 'Đo ba kiểu hỏng trên 40 lần chạy: thật 100%, ngẫu nhiên 20%, phụ thuộc thứ tự thì có tính quyết định. Rồi tính: với một bài hỏng 20%, "chạy lại thấy xanh" là kết quả NHIỀU KHẢ NĂNG NHẤT — nên nó không chứng minh gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Flaky or broken, decided with arithmetic</h2>
<p class="lead">"It failed, I re-ran it, it passed" is the most common sentence in CI, and it is used as a conclusion. This lesson measures what it is actually evidence of, and the answer is: usually nothing.</p>

<h3>Three kinds of failure, 40 runs each</h3>
${slide('ga-08', 9, 'Real, probabilistic, order-dependent: three kinds of red, three different diagnoses')}
<div class="out">loai                              hong / 40
--------------------------------------------------
THAT (1+1===3)                    40 / 40  = 100%
NGAU NHIEN (phu thuoc dong ho)     8 / 40  =  20%
PHU THUOC THU TU                  xanh khi chay MOT MINH
                                  do  khi chay SAU bai kia</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a real failure · 100%</span><span class="lz-lnote">deterministic. One green run refutes it completely, because a real failure cannot produce one</span></div>
<div class="lz-layer"><span class="lz-lname">a probabilistic flake · 20%</span><span class="lz-lnote">a clock, a race, a random seed, an external service. The rate is a property of the test and is measurable — which is the whole point of this lesson</span></div>
<div class="lz-layer"><span class="lz-lname">order dependence · not probabilistic at all</span><span class="lz-lnote">green alone, red after another test touched shared state. It has <em>no</em> failure rate; it has a precondition. Re-running changes nothing, and re-running with a different test order changes everything</span></div>
</div>

<div class="callout ok">
<p><strong>The third category is the one most often mislabelled as flake.</strong> It is fully deterministic, so it will fail identically every time the same order occurs — and pass identically otherwise. What makes it look random is that the order varies: a parallel test runner, a matrix leg, a changed file list. Diagnosing it by re-running is hopeless; diagnosing it by running the single test alone takes one command.</p>
</div>

<h3>What "re-ran it and it passed" is worth</h3>
<div class="out">p (ty le hong that)   P(hong roi xanh)   P(xanh 2 lan lien)
------------------------------------------------------------
        100%                  0,0%                 0,0%
         50%                 25,0%                25,0%
         20%                 16,0%                64,0%
          5%                  4,8%                90,2%
          1%                  1,0%                98,0%</div>

<div class="callout warn">
<p><strong>For a test that genuinely fails 20% of the time, the next run passes 80% of the time.</strong> So observing "it failed, then it passed" is the <em>most likely</em> outcome — it is what you would expect to see, and it distinguishes a 20% flake from a 5% flake not at all. The single re-run has almost no information in it, and it is treated as a verdict.</p>
</div>

<h3>How many green runs would actually mean something</h3>
<div class="out">neu ty le hong that su la 20%:  can 14 lan xanh lien tiep de tin 95%
                                can 21 lan xanh lien tiep de tin 99%
neu ty le hong that su la  5%:  can 59 lan xanh lien tiep de tin 95%
                                can 90 lan xanh lien tiep de tin 99%</div>

<div class="callout">
<p><strong>Fourteen consecutive green runs to be 95% confident a 20% flake is gone.</strong> Nobody does that, which is fine — the conclusion is not "run it fourteen times", it is that <em>confirming a fix by re-running is not practical</em>. A flake is fixed by finding the source of non-determinism and removing it, and then the green runs are a sanity check rather than the evidence.</p>
</div>

<h3>The compounding cost</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">one test, 20% failure rate</span><span class="lz-t">100 CI runs</span><span class="lz-d">expect 20 red builds</span></div>
<div class="lz-step"><span class="lz-k">each time, somebody re-runs</span><span class="lz-t">80% see green</span><span class="lz-d">and conclude "flake, ignore" — which is the locally rational decision every single time</span></div>
<div class="lz-step"><span class="lz-k">so the test is never fixed</span><span class="lz-t">and it is not a flake</span><span class="lz-d">it is a real defect that manifests one time in five, hidden behind a re-run button</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the re-run button as a diagnostic.</strong> It is a repair tool, not a measurement: it gets the build green so work continues, which is legitimate. The failure is treating the green run as an answer. If a test has failed intermittently, the number worth having is its failure <em>rate</em> across recent runs — and that number is in the API, not in your memory of how often it feels like it happens.</p>
</div>

<h3>Measured on CI: twenty legs of the same test</h3>
${slide('ga-08', 10, 'Twenty matrix legs running one 20% test: four red, scattered with no pattern')}
<p>The 40-run table at the top of this lesson does not say where it ran. The same experiment on GitHub&#39;s runners looks like this: a matrix of twenty legs, <code>fail-fast: false</code>, every leg running the same test file on the same commit — <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011087956" target="_blank" rel="noopener">run 36011087956</a>. The test stands in for a race condition: it loses when <code>Math.random() &lt; 0.2</code>.</p>
<pre><code class="language-yaml">jobs:
  lan:
    runs-on: ubuntu-24.04
    strategy:
      fail-fast: false            # let every leg finish, so we can count
      matrix:
        lan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 22 }
      - run: npm run test:chap-chon</code></pre>
<p>Legs 1, 3, 8 and 20 went red; the other sixteen went green. A second job in the same run looped the test 200 times on one runner and counted <strong>41 red out of 200</strong> — 20.5%, as close to the designed 20% as a sample that size gets. Notice what the red legs have in common: nothing. Not their position, not their start time, not the machine. That absence of pattern is itself diagnostic — a failure that clusters on one leg, one OS or one shard is not random, and should be read as a difference between machines (lesson 8.3), not as a flake.</p>

<h3>Is four out of twenty a lot? The distribution says no</h3>
${slide('ga-08', 11, 'Binomial distribution for 20 runs at p = 0.2: four red is the single most likely outcome')}
<p>If a test truly fails 20% of the time, the number of red legs in twenty is a binomial distribution, and it is worth seeing its shape once:</p>
<div class="out">do / 20   xac suat (p = 0,2)
   0         1,2%
   1         5,8%
   2        13,7%
   3        20,5%
   4        21,8%   &lt;- da do duoc
   5        17,5%
   6        10,9%
  7+         8,6%</div>
<p>Four is the peak. Three things follow from it, and each one is a sentence you can say in a review:</p>
<ul>
<li><strong>Twenty green runs in a row is strong evidence.</strong> With the bug still present, the chance of that is 1.2%. So the "run it many times" check this lesson called impractical for CI is perfectly practical <em>in a loop on one machine</em>: the runner job that did 200 runs of one test took 35 seconds in total.</li>
<li><strong>Four red legs re-run to four green legs 41% of the time</strong> (0.8<sup>4</sup>). That is not a rare stroke of luck; it is a coin that lands heads four times out of ten. The next section is that exact event, measured.</li>
<li><strong>A single red among many green is expected</strong> at any non-zero rate. The question is never "did it fail once?" but "what is the rate, and is it moving?"</li>
</ul>

<h3>What "Re-run failed jobs" actually does</h3>
${slide('ga-08', 12, 'Re-running the failed legs turned the run green while the 20% bug stayed in the code')}
<p>The four red legs were then re-run with <code>gh run rerun 36011087956 --failed</code> — the command-line version of the "Re-run failed jobs" button. All four came back green, and the run&#39;s conclusion flipped from <code>failure</code> to <code>success</code>. The run page now shows a green tick for a commit that contains a test failing one time in five. Here is what the API says the second attempt consists of:</p>
<div class="out">$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/36011087956/attempts/2/jobs \\
    --jq '.jobs[] | [.name, .conclusion, .started_at] | @tsv'
lan (2)   success  2026-09-24T14:12:34Z    &lt;- copied from attempt 1
lan (4)   success  2026-09-24T14:12:34Z    &lt;- copied from attempt 1
lan (1)   success  2026-09-24T14:17:27Z    &lt;- actually re-executed
…</div>
<p>Four facts are worth knowing precisely, because they decide when the button is appropriate:</p>
<div class="kv-grid">
<div class="kv"><span class="k">only failed jobs and their dependents run</span><span class="v">the successful jobs are carried over into the new attempt with their old timestamps. On the pipeline run 36011088185, re-running the failed Node 20 leg also re-ran <code>build</code> and <code>deploy</code> (skipped again), while <code>lint</code> and the green legs kept their 14:12 start times</span></div>
<div class="kv"><span class="k">same commit, same ref</span><span class="v">the documentation is explicit: a re-run uses the same <code>GITHUB_SHA</code> and <code>GITHUB_REF</code> as the original event. A re-run can never test a fix you pushed afterwards — that needs a new run on the new commit (lesson 8.5)</span></div>
<div class="kv"><span class="k">the old attempt is still there</span><span class="v"><code>gh run view ID --attempt 1</code> shows the red attempt and its logs. The evidence is not destroyed, only hidden behind a green summary — which is exactly how "it was just flaky" becomes the team&#39;s memory</span></div>
<div class="kv"><span class="k">limits (docs, as of 09/2026)</span><span class="v">a run can be re-run for up to 30 days after it first ran, and at most 50 times in total, counting full and partial re-runs</span></div>
</div>
<div class="callout ok">
<p><strong>When the button is the right tool.</strong> When the failure is in the infrastructure, not in your code: the runner lost its connection, the npm registry returned a 503, a Docker Hub pull hit a rate limit. You find that out by reading the failed step first (lesson 8.4) — the error names the external service. Then a re-run is a repair, and a legitimate one. What the button must not be is the first action on a red build.</p>
</div>

<h3>A timing test that never failed on CI — and failed two times in three on the laptop</h3>
${slide('ga-08', 13, 'The same 50 ms timer test: 0/200 on the runner, 0/40 on the Mac, 26/40 in Docker on the Mac, 35/40 at --cpus 0.1')}
<p>The flaky file had a second test, built the way many real ones are built by accident: wait for a 50 ms timer and assert that it finished in under 53 ms. On the runner, in the same 200-iteration loop that caught 41 race failures, it failed <strong>zero</strong> times. On the Mac running Node directly, zero out of forty. Then the same test ran in a Docker container on the same Mac:</p>
<div class="out">docker run --rm --cpus 4   … node:22-slim   hen gio do 26/40
docker run --rm --cpus 0.5 …                 hen gio do 27/40
docker run --rm --cpus 0.1 …                 hen gio do 35/40
  mat 60.4 ms · mat 53.0 ms · mat 58.2 ms · mat 53.8 ms</div>
<p>Two lessons in one table. First, a flake rate belongs to the <em>test plus its environment</em>: the runner is a quiet dedicated VM, while Docker Desktop on a Mac runs Linux inside a virtual machine whose timers overshoot by several milliseconds. A test that is 0% flaky in CI can be 65% flaky on a teammate&#39;s laptop — or the reverse, on the day CI moves to a busier runner. Second, this is a useful reproduction technique: <strong>squeezing CPU turns a rare timing flake into a frequent one</strong>, and a frequent failure is one you can debug. The fix is not a bigger margin (53 → 100 ms just moves the threshold); it is to stop asserting wall-clock durations — use fake timers (<code>mock.timers</code> in <code>node:test</code>, <code>vi.useFakeTimers()</code> in Vitest, <code>jest.useFakeTimers()</code>) so the test controls time instead of measuring it.</p>

<h3>Order dependence, measured: not random at all</h3>
${slide('ga-08', 14, 'The same test: green alone, red after its neighbour — five times out of five')}
<p>The third category from the top of this lesson, run on the runner in the same job:</p>
<div class="out">chay RIENG 'gio moi phai rong': exit 0 · # pass 1 # fail 0
chay CA TEP (sau 'them mon'):   exit 1 · # pass 1 # fail 1
chay 5 lan ca tep:
1 1 1 1 1</div>
<p>Five out of five, every time. The first test pushes an item into a module-level array; the second assumes the array is empty. Run alone (<code>--test-name-pattern='gio moi'</code>), the second test passes; run after the first, it fails. There is no probability anywhere. The only reason tests like this look flaky in real projects is that the <em>order</em> varies — a runner that shuffles, shards split differently when a file is added, parallel workers that share a database. The fix is always the same shape: each test builds the state it needs and cleans it up (<code>beforeEach</code>/<code>afterEach</code>, a fresh object per test, a transaction rolled back per test for a database).</p>
<h3>Deciding which one you have, in order of cost</h3>
<div class="kv-grid">
<div class="kv"><span class="k">read the error, first</span><span class="v">a real failure usually names something specific and repeatable; a flake usually names a timeout, a connection, a timestamp or an ordering. This costs nothing and settles most cases</span></div>
<div class="kv"><span class="k">run the single test in isolation, locally</span><span class="v">green alone but red in the suite is order dependence, settled in one command. This is the highest-yield check and it is almost never the one people try first</span></div>
<div class="kv"><span class="k">run it in a loop</span><span class="v"><code>for i in $(seq 50); do npm test -- -t 'ten bai'; done</code>. Gives a rate. Fifty runs of one test is seconds; fifty CI runs is an afternoon</span></div>
<div class="kv"><span class="k">count it across history</span><span class="v">the workflow-runs API gives conclusions per run. "This job has failed 9 of the last 60 times" is a very different statement from "it seems flaky", and it takes one call</span></div>
</div>

<h3>What this repository&#39;s history looks like</h3>
<div class="out">desktop-release, 12 lan gan nhat:  10 thanh cong, 2 hong
  hong #1: 80s   — hong RAT som
  hong #2: 334s  — hong giua chung
  TB thanh cong: 458s

hong #2 la run 32400097927: vite build exit 134, heap limit, CHI tren macOS</div>

<div class="callout ok">
<p><strong>Two failures out of twelve, and neither was a flake.</strong> One is documented as a heap-limit crash with a specific fix — <code>--max-old-space-size</code> plus dropping sourcemaps in CI — and the repository verified the fix by reproducing the failure at a squeezed heap and watching it go from 134 to 0. That is what settling a failure looks like: reproduce it deliberately, fix it, and reproduce the fix. Not re-run it and see.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A real failure fails 100% of the time and one green run refutes it; a 20% flake passes on re-run 80% of the time, so the re-run tells you nothing — and the third category, order dependence, is not random at all and is diagnosed by running the test alone.</p>
</div>

<h3>This repository, again: eleven reds with one name</h3>
${slide('ga-08', 15, 'api-backend, 18 August 2026: the same unit test red in eleven runs over about nine hours')}
<p>The history above looked at <code>desktop-release</code>. The CI workflow tells a more instructive story. Over its listed history, <code>ci-lint.yml</code> has <strong>741 runs, 40 of them failed (5.4%)</strong>. Taken as one number, 5.4% sounds like a flaky pipeline. Taken by <em>test name</em>, it is not:</p>
<div class="out">$ gh run list -R cuonghoang1103/api-backend -w ci-lint.yml -L 1000 --json conclusion \\
    --jq 'group_by(.conclusion) | map({(.[0].conclusion): length}) | add'
{"failure":40,"success":701}

$ for id in $(gh api "repos/cuonghoang1103/api-backend/actions/runs?status=failure&amp;per_page=100" \\
      --jq '.workflow_runs[] | select(.created_at | startswith("2026-08-18")) | .id'); do
    gh run view "$id" -R cuonghoang1103/api-backend --log-failed | grep -o "not ok [0-9]* - .*" | head -1
  done
not ok 19 - thiếu khoá của nhóm thì LÙI, không trả về model gọi không được
not ok 19 - thiếu khoá của nhóm thì LÙI, …      (× 2 more)
not ok 22 - thiếu khoá của nhóm thì LÙI, …      (× 8, until 19:45 UTC)</div>
<p>Eleven runs on 18 August 2026, from 10:58 to 19:45 UTC, all red on the same step ("Unit tests — money math + payment signature") and the same test. The test number moved from 19 to 22 between commits; the name did not. That is a deterministic failure that lived for nine hours — every push that day was red for the same reason. The next day&#39;s red (run 32243769111) was a different test in the same step. None of it is flake, and counting by name is what shows it. Re-running any of those eleven would have produced a twelfth red.</p>

<h3>Fixing a flake, by cause</h3>
<table>
<thead><tr><th>Cause</th><th>How it shows</th><th>Fix at the source</th></tr></thead>
<tbody>
<tr><td>Wall-clock timing</td><td>"expected &lt; 53 ms, got 60"; worse under load</td><td>fake timers; assert order of events, not durations</td></tr>
<tr><td>Randomness</td><td>different data each run; impossible to repeat</td><td>fixed seed; print the seed on failure so the run can be replayed</td></tr>
<tr><td>Shared state / order</td><td>green alone, red in the suite</td><td>per-test setup and teardown; no module-level mutable state</td></tr>
<tr><td>Race with async work</td><td>"expected 'moi', got 'cu'"; reads before the write lands</td><td>await the real completion signal, never a <code>sleep</code></td></tr>
<tr><td>External service</td><td>timeouts, 429, 503, DNS errors</td><td>mock it in unit tests; in integration tests, retry the <em>call</em> with backoff, not the test</td></tr>
<tr><td>Time of day / date</td><td>red around midnight, month end, DST</td><td>inject the clock; test the boundary dates on purpose</td></tr>
</tbody>
</table>
<div class="pitfall">
<p><strong>Trap — automatic test retries as the fix.</strong> Jest (<code>jest.retryTimes</code>), Vitest (<code>retry</code>) and Playwright (<code>retries</code>) can all re-run a failed test automatically, and a 20% flake with two retries passes 99.2% of the time. That is exactly the problem: the defect is now invisible. Retries are acceptable only if something still <em>reports</em> the retried tests — Playwright, for instance, labels a test that passed on retry as "flaky" in its report — and somebody reads that list. A retry that nobody counts is the re-run button, automated.</p>
</div>

<h3>Quarantine: the honest middle ground</h3>
<p>Sometimes a flake cannot be fixed today and cannot be allowed to block every merge. The disciplined answer is quarantine: move the test to a separate job that runs but does not block (for example <code>continue-on-error: true</code> on that job), open an issue with its measured rate, and give it an owner and a deadline. The main suite stays trustworthy — green means green — and the flake stays visible. The difference from simply deleting or skipping the test is that the measurement continues.</p>
<pre><code class="language-yaml">  test-cach-ly:                  # quarantined tests: run, report, do not block
    runs-on: ubuntu-24.04
    continue-on-error: true
    steps:
      - uses: actions/checkout@v5
      - run: npm run test:cach-ly   # issue #123 · measured 9/60 · owner: Cuong</code></pre>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: A test fails in CI, you re-run and it passes. Is it a flaky test?</strong><br>A: Not necessarily — that observation is what you expect from a flake <em>and</em> from a genuine intermittent bug, and a single re-run carries almost no information. I look at whether the same test name has failed before, run it in a loop locally to get a rate, and run it alone to rule out order dependence. If it is a race or a timing assumption, that is a real defect and gets fixed, not retried.</p>
<p><strong>Q: How would you find the flakiest tests in a repository?</strong><br>A: From history, not memory: list failed runs through the API, extract the failing test names from their logs, and count by name. A name that appears across different commits with green runs in between is flaky; a name that fails on every run for a stretch is a real break.</p>
<p><strong>Q: What does "Re-run failed jobs" do to the commit it tests?</strong><br>A: Nothing — it re-runs the same commit and ref as the original run. It only re-executes the failed jobs and their dependents; successful jobs are copied into the new attempt. To test a fix you need a new run on the new commit.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate says "that test is just flaky, re-run it". You want a number instead of an opinion — on a test you control, then on your real CI.</p><ol>
<li>In a test repository, add a test that fails when <code>Math.random() &lt; 0.2</code>, and a workflow with a 10-leg matrix (<code>lan: [1,…,10]</code>) and <code>fail-fast: false</code>. Push and count the red legs.</li>
<li>Run <code>gh run rerun ID --failed</code>, wait, then compare <code>gh run view ID --attempt 1</code> with <code>gh run view ID</code>. Note which jobs actually re-executed (<code>gh api …/attempts/2/jobs</code>, look at <code>started_at</code>).</li>
<li>Locally, run the test 200 times in a loop and compute the rate: <code>n=0; for i in $(seq 200); do node --test test.js &gt;/dev/null 2&gt;&amp;1 || n=$((n+1)); done; echo $n</code>.</li>
<li>On your real repository, count failures of your CI workflow: <code>gh run list -w &lt;file&gt; -L 200 --json conclusion --jq 'group_by(.conclusion)|map({(.[0].conclusion):length})|add'</code>.</li>
<li>For three of those failures, extract the failing test or step name with <code>gh run view ID --log-failed</code> and write them side by side.</li></ol>
<p><strong>Done when:</strong> you have a rate for the random test from the loop (it should be near 20%); you can say which jobs attempt 2 re-executed and which it copied; and for your real CI you can say whether the failures share a name (a real break) or are scattered (candidates for flake).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flaky test (test chập chờn)</span><span class="v">A test that can pass and fail on the same code. Its failure rate is a property of the test and its environment, and can be measured.</span></div>
  <div class="kv"><span class="k">Order dependence (phụ thuộc thứ tự)</span><span class="v">A test that fails only after another test changed shared state. Deterministic — diagnosed by running the test alone.</span></div>
  <div class="kv"><span class="k">Run attempt (lần chạy thứ n)</span><span class="v">Each re-run creates a new attempt of the same run; earlier attempts stay viewable with <code>--attempt</code>.</span></div>
  <div class="kv"><span class="k">Re-run failed jobs</span><span class="v">Re-executes failed jobs and their dependents on the <em>same</em> commit; successful jobs are copied.</span></div>
  <div class="kv"><span class="k">Binomial distribution (phân bố nhị thức)</span><span class="v">The distribution of the number of failures in n independent runs at rate p — what "4 of 20" should be compared against.</span></div>
  <div class="kv"><span class="k">Fake timers (đồng hồ giả)</span><span class="v">A test utility that replaces real time, so timer-based code is tested without waiting or measuring.</span></div>
  <div class="kv"><span class="k">Quarantine (cách ly)</span><span class="v">Running known-flaky tests in a non-blocking job with an owner and an issue, so they stay visible without blocking merges.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured on CI: 4 of 20 legs and 41 of 200 loop iterations red for a 20% test — scattered, with no pattern.</li>
<li>For p = 0.2, four red in twenty is the most likely outcome; twenty green in a row is 1.2% likely, so a loop of runs <em>is</em> evidence.</li>
<li>Re-run failed jobs re-executes only the red jobs and their dependents, on the same commit — it turned this run green with the bug still in it.</li>
<li>A timing test was 0% flaky on the runner and 65% in Docker on a Mac: rate depends on environment; squeezing CPU reproduces it; fake timers fix it.</li>
<li>Order dependence failed 5 out of 5 — it is deterministic, found by running the test alone.</li>
<li>Count failures by test name: api-backend&#39;s eleven reds on 18 August were one real break, not a flaky pipeline.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36011087956 — twenty legs, the 200-run loop, and attempt 2</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011087956 — four red legs in attempt 1, all green after <code>rerun --failed</code>; the loop job with 41/200 and the order-dependence check.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Re-running workflows and jobs (limits and same SHA)</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs — re-runs within 30 days, at most 50, using the same <code>GITHUB_SHA</code> and <code>GITHUB_REF</code>, and the "Enable debug logging" option.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list workflow runs, filtered by conclusion</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs — <code>?status=failure</code> against recent runs turns "it seems flaky" into a rate, which is the measurement this lesson argues for.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Re-running workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs — including re-running only failed jobs, which is the cheap repair action as distinct from a diagnosis.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — Flaky tests at Google and how we mitigate them</span><span class="lc-sub">testing.googleblog.com — the industry-scale version of this arithmetic, including the observation that a flake rate below a threshold is cheaper to quarantine than to fix, and where that threshold sits.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — test isolation, shared state, and why order matters</span><span class="lc-sub">/courses/nodejs/learn${REF} — the third failure category above, with the module-caching and global-state mechanisms that produce it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — tests that share a database</span><span class="lc-sub">/courses/postgresql/learn${REF} — the most common real source of order dependence in a backend suite, and the transaction-per-test pattern that removes it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Flake hay hỏng thật, quyết bằng số học</h2>
<p class="lead">"Nó hỏng, tôi chạy lại, nó qua" là câu nói phổ biến nhất trong CI, và nó được dùng như một KẾT LUẬN. Bài này đo xem nó thật ra là bằng chứng cho điều gì, và đáp án là: thường thì chẳng cho điều gì cả.</p>

<h3>Ba kiểu hỏng, mỗi kiểu 40 lần chạy</h3>
${slide('ga-08', 9, 'Thật, xác suất, phụ thuộc thứ tự: ba kiểu đỏ, ba cách chẩn đoán khác nhau')}
<div class="out">loai                              hong / 40
--------------------------------------------------
THAT (1+1===3)                    40 / 40  = 100%
NGAU NHIEN (phu thuoc dong ho)     8 / 40  =  20%
PHU THUOC THU TU                  xanh khi chay MOT MINH
                                  do  khi chay SAU bai kia</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một cú hỏng THẬT · 100%</span><span class="lz-lnote">có tính quyết định. MỘT lần chạy xanh bác bỏ nó hoàn toàn, bởi một cú hỏng thật không đẻ ra được một lần xanh nào</span></div>
<div class="lz-layer"><span class="lz-lname">một flake xác suất · 20%</span><span class="lz-lnote">một cái đồng hồ, một cuộc đua, một hạt ngẫu nhiên, một dịch vụ bên ngoài. Cái TỈ LỆ ấy là một tính chất của bài test và ĐO ĐƯỢC — đó là toàn bộ mục đích của bài này</span></div>
<div class="lz-layer"><span class="lz-lname">phụ thuộc thứ tự · KHÔNG hề mang tính xác suất</span><span class="lz-lnote">xanh khi chạy một mình, đỏ khi chạy sau một bài khác đã đụng vào trạng thái chung. Nó KHÔNG có tỉ lệ hỏng; nó có một ĐIỀU KIỆN TIÊN QUYẾT. Chẩn đoán nó bằng cách chạy lại là vô vọng; chẩn đoán bằng cách chạy một mình bài test ấy tốn một câu lệnh</span></div>
</div>

<div class="callout ok">
<p><strong>Loại thứ ba mới là loại hay bị gắn nhầm nhãn "flake" nhất.</strong> Nó hoàn toàn có tính quyết định, nên nó sẽ hỏng Y HỆT mỗi lần cái thứ tự ấy xảy ra — và qua y hệt vào những lần khác. Thứ làm nó TRÔNG như ngẫu nhiên là cái THỨ TỰ thay đổi: một bộ chạy test song song, một nhánh ma trận, một danh sách file đã đổi. Chẩn đoán bằng cách chạy lại thì vô vọng; chẩn đoán bằng cách chạy riêng bài test ấy tốn một câu lệnh.</p>
</div>

<h3>"Chạy lại rồi nó qua" đáng giá bao nhiêu</h3>
<div class="out">p (ty le hong that)   P(hong roi xanh)   P(xanh 2 lan lien)
------------------------------------------------------------
        100%                  0,0%                 0,0%
         50%                 25,0%                25,0%
         20%                 16,0%                64,0%
          5%                  4,8%                90,2%
          1%                  1,0%                98,0%</div>

<div class="callout warn">
<p><strong>Với một bài test THẬT SỰ hỏng 20% số lần, lần chạy kế qua 80% số lần.</strong> Nên quan sát "nó hỏng, rồi nó qua" là kết cục <em>NHIỀU KHẢ NĂNG NHẤT</em> — nó là thứ bạn KỲ VỌNG sẽ thấy, và nó hoàn toàn KHÔNG phân biệt được một flake 20% với một flake 5%. Một lần chạy lại chứa gần như không có thông tin nào, và nó lại đang được coi như một phán quyết.</p>
</div>

<h3>Bao nhiêu lần xanh mới thật sự nghĩa lý gì</h3>
<div class="out">neu ty le hong that su la 20%:  can 14 lan xanh lien tiep de tin 95%
                                can 21 lan xanh lien tiep de tin 99%
neu ty le hong that su la  5%:  can 59 lan xanh lien tiep de tin 95%
                                can 90 lan xanh lien tiep de tin 99%</div>

<div class="callout">
<p><strong>Mười bốn lần xanh liên tiếp mới tin được 95% rằng một flake 20% đã biến mất.</strong> Không ai làm thế, và điều đó ổn — kết luận KHÔNG phải "hãy chạy mười bốn lần", mà là <em>xác nhận một bản vá bằng cách chạy lại thì KHÔNG khả thi</em>. Một flake được vá bằng cách TÌM RA nguồn của tính bất định rồi gỡ nó đi, và khi ấy những lần xanh chỉ là một phép kiểm tỉnh táo chứ không phải BẰNG CHỨNG.</p>
</div>

<h3>Cái giá cộng dồn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một bài test, tỉ lệ hỏng 20%</span><span class="lz-t">100 lần chạy CI</span><span class="lz-d">kỳ vọng 20 bản dựng đỏ</span></div>
<div class="lz-step"><span class="lz-k">mỗi lần, có người chạy lại</span><span class="lz-t">80% thấy xanh</span><span class="lz-d">rồi kết luận "flake, bỏ qua" — mà đó là quyết định hợp lý CỤC BỘ ở từng lần một</span></div>
<div class="lz-step"><span class="lz-k">nên bài test không bao giờ được vá</span><span class="lz-t">và nó KHÔNG phải flake</span><span class="lz-d">nó là một khiếm khuyết THẬT lộ ra một lần trong năm, nấp sau cái nút chạy lại</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng nút chạy lại như một công cụ CHẨN ĐOÁN.</strong> Nó là một công cụ SỬA CHỮA, không phải một phép đo: nó làm bản dựng xanh lại để công việc đi tiếp, và như thế là chính đáng. Chỗ hỏng là coi lần chạy xanh ấy như một CÂU TRẢ LỜI. Nếu một bài test đã hỏng chập chờn, con số đáng có là TỈ LỆ hỏng của nó qua các lần chạy gần đây — và con số ấy nằm trong API, không nằm trong trí nhớ của bạn về việc nó có vẻ hay xảy ra tới mức nào.</p>
</div>

<h3>Đo trên CI: hai mươi nhánh của cùng một bài test</h3>
${slide('ga-08', 10, 'Hai mươi nhánh ma trận chạy một bài test 20%: bốn nhánh đỏ, rải rác không theo quy luật nào')}
<p>Cái bảng 40 lần chạy ở đầu bài không ghi nó chạy ở đâu. Cùng thí nghiệm ấy trên runner của GitHub trông thế này: một ma trận hai mươi nhánh, <code>fail-fast: false</code>, nhánh nào cũng chạy cùng một tệp test trên cùng một commit — <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011087956" target="_blank" rel="noopener">run 36011087956</a>. Bài test đóng vai một cuộc đua (race condition): nó thua khi <code>Math.random() &lt; 0.2</code>.</p>
<pre><code class="language-yaml">jobs:
  lan:
    runs-on: ubuntu-24.04
    strategy:
      fail-fast: false            # để mọi nhánh chạy xong, mới đếm được
      matrix:
        lan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 22 }
      - run: npm run test:chap-chon</code></pre>
<p>Nhánh 1, 3, 8 và 20 đỏ; mười sáu nhánh còn lại xanh. Một job thứ hai trong cùng run chạy vòng lặp bài test 200 lần trên MỘT runner và đếm được <strong>41 lần đỏ trên 200</strong> — 20,5%, sát với con số 20% đã thiết kế hết mức mà một mẫu cỡ ấy cho phép. Để ý xem các nhánh đỏ có điểm chung gì: KHÔNG có gì. Không theo vị trí, không theo giờ bắt đầu, không theo máy. Chính sự vắng mặt quy luật ấy là một dấu hiệu chẩn đoán — một cú hỏng dồn về một nhánh, một hệ điều hành hay một mảnh sharding thì KHÔNG ngẫu nhiên, và nên được đọc như một khác biệt giữa các cỗ máy (bài 8.3), không phải một flake.</p>

<h3>Bốn trên hai mươi có nhiều không? Phân bố nói là không</h3>
${slide('ga-08', 11, 'Phân bố nhị thức cho 20 lần chạy với p = 0,2: bốn nhánh đỏ là kết cục nhiều khả năng nhất')}
<p>Nếu một bài test THẬT SỰ hỏng 20% số lần, thì số nhánh đỏ trong hai mươi nhánh là một phân bố nhị thức, và đáng nhìn hình dạng của nó một lần:</p>
<div class="out">do / 20   xac suat (p = 0,2)
   0         1,2%
   1         5,8%
   2        13,7%
   3        20,5%
   4        21,8%   &lt;- da do duoc
   5        17,5%
   6        10,9%
  7+         8,6%</div>
<p>Bốn là đỉnh. Từ đó suy ra ba điều, và mỗi điều là một câu bạn nói được trong một buổi review:</p>
<ul>
<li><strong>Hai mươi lần xanh liên tiếp là bằng chứng mạnh.</strong> Nếu bug vẫn còn, khả năng ấy chỉ 1,2%. Nên phép kiểm "chạy thật nhiều lần" mà bài này gọi là không khả thi trên CI lại hoàn toàn khả thi <em>trong một vòng lặp trên một máy</em>: cả job chạy 200 lần một bài test trên runner chỉ tốn 35 giây.</li>
<li><strong>Bốn nhánh đỏ chạy lại thành bốn nhánh xanh ở 41% số lần</strong> (0,8<sup>4</sup>). Đó không phải một cú may hiếm hoi; đó là một đồng xu ngửa bốn lần trên mười. Mục kế tiếp chính là sự kiện ấy, đo thật.</li>
<li><strong>Một lần đỏ lẻ giữa nhiều lần xanh là chuyện ĐƯƠNG NHIÊN</strong> ở bất cứ tỉ lệ nào khác 0. Câu hỏi không bao giờ là "nó đã hỏng một lần chưa?" mà là "tỉ lệ là bao nhiêu, và nó có đang dịch chuyển không?"</li>
</ul>

<h3>"Re-run failed jobs" thật ra làm gì</h3>
${slide('ga-08', 12, 'Chạy lại các nhánh đỏ biến cả run thành xanh trong khi bug 20% vẫn nằm trong mã')}
<p>Bốn nhánh đỏ sau đó được chạy lại bằng <code>gh run rerun 36011087956 --failed</code> — bản dòng lệnh của nút "Re-run failed jobs". Cả bốn quay về XANH, và kết luận của run lật từ <code>failure</code> sang <code>success</code>. Trang run giờ hiện một dấu ✓ xanh cho một commit chứa một bài test hỏng một lần trong năm. Đây là thứ API nói về thành phần của lần chạy thứ hai:</p>
<div class="out">$ gh api repos/cuonghoang1103/ga-san-tap/actions/runs/36011087956/attempts/2/jobs \\
    --jq '.jobs[] | [.name, .conclusion, .started_at] | @tsv'
lan (2)   success  2026-09-24T14:12:34Z    &lt;- chép từ lần 1
lan (4)   success  2026-09-24T14:12:34Z    &lt;- chép từ lần 1
lan (1)   success  2026-09-24T14:17:27Z    &lt;- chạy lại thật
…</div>
<p>Bốn sự thật đáng biết CHÍNH XÁC, vì chúng quyết định khi nào cái nút ấy là đúng chỗ:</p>
<div class="kv-grid">
<div class="kv"><span class="k">chỉ job đỏ và job phụ thuộc được chạy</span><span class="v">các job thành công được chép sang lần chạy mới kèm dấu thời gian cũ. Trên run pipeline 36011088185, chạy lại nhánh Node 20 đỏ thì cũng chạy lại <code>build</code> và <code>deploy</code> (lại bị bỏ qua), còn <code>lint</code> và các nhánh xanh giữ nguyên giờ bắt đầu 14:12</span></div>
<div class="kv"><span class="k">cùng commit, cùng ref</span><span class="v">tài liệu nói thẳng: một lần chạy lại dùng CÙNG <code>GITHUB_SHA</code> và <code>GITHUB_REF</code> với sự kiện gốc. Chạy lại không bao giờ kiểm được một bản vá bạn push SAU đó — việc ấy cần một run MỚI trên commit mới (bài 8.5)</span></div>
<div class="kv"><span class="k">lần chạy cũ vẫn còn đó</span><span class="v"><code>gh run view ID --attempt 1</code> hiện lần chạy đỏ cùng log của nó. Bằng chứng không bị huỷ, chỉ bị GIẤU sau một bản tóm tắt xanh — đúng là cách câu "chắc chỉ chập chờn thôi" trở thành trí nhớ của cả nhóm</span></div>
<div class="kv"><span class="k">giới hạn (docs, tính đến 09/2026)</span><span class="v">một run chạy lại được trong tối đa 30 ngày kể từ lần đầu, và tổng cộng tối đa 50 lần, tính cả chạy lại toàn bộ lẫn một phần</span></div>
</div>
<div class="callout ok">
<p><strong>Khi nào cái nút là công cụ ĐÚNG.</strong> Khi cú hỏng nằm ở HẠ TẦNG, không nằm trong mã của bạn: runner mất kết nối, registry npm trả 503, một lần kéo ảnh Docker Hub chạm giới hạn tần suất. Bạn biết điều đó bằng cách ĐỌC bước hỏng trước (bài 8.4) — lời báo lỗi gọi tên dịch vụ bên ngoài. Khi ấy chạy lại là một biện pháp sửa chữa, và là một biện pháp chính đáng. Thứ cái nút KHÔNG được là: hành động đầu tiên trước một bản dựng đỏ.</p>
</div>

<h3>Một bài test hẹn giờ chưa từng đỏ trên CI — mà đỏ hai phần ba trên laptop</h3>
${slide('ga-08', 13, 'Cùng một bài test hẹn giờ 50 ms: 0/200 trên runner, 0/40 trên Mac, 26/40 trong Docker trên Mac, 35/40 với --cpus 0.1')}
<p>Tệp test chập chờn còn một bài thứ hai, dựng theo đúng kiểu nhiều bài test thật vô tình được dựng: chờ một bộ hẹn giờ 50 ms rồi khẳng định nó xong dưới 53 ms. Trên runner, trong cùng vòng lặp 200 lần đã bắt được 41 cú thua cuộc đua, nó đỏ <strong>KHÔNG</strong> lần nào. Trên máy Mac chạy Node trực tiếp, không trên bốn mươi. Rồi cùng bài test ấy chạy trong một container Docker trên CHÍNH cái Mac đó:</p>
<div class="out">docker run --rm --cpus 4   … node:22-slim   hen gio do 26/40
docker run --rm --cpus 0.5 …                 hen gio do 27/40
docker run --rm --cpus 0.1 …                 hen gio do 35/40
  mat 60.4 ms · mat 53.0 ms · mat 58.2 ms · mat 53.8 ms</div>
<p>Hai bài học trong một cái bảng. Thứ nhất, tỉ lệ chập chờn thuộc về <em>bài test CỘNG môi trường của nó</em>: runner là một máy ảo riêng yên tĩnh, còn Docker Desktop trên Mac chạy Linux bên trong một máy ảo mà đồng hồ hẹn giờ trễ vài mili giây. Một bài test chập chờn 0% trên CI có thể chập chờn 65% trên laptop của một đồng đội — hoặc ngược lại, vào cái ngày CI chuyển sang một runner bận rộn hơn. Thứ hai, đây là một kỹ thuật tái lập hữu ích: <strong>bóp CPU biến một flake hẹn giờ hiếm gặp thành một flake hay gặp</strong>, và một cú hỏng hay gặp là cú hỏng bạn gỡ lỗi được. Cách vá KHÔNG phải một biên rộng hơn (53 → 100 ms chỉ dời cái ngưỡng); mà là thôi khẳng định thời lượng theo đồng hồ thật — dùng đồng hồ giả (<code>mock.timers</code> của <code>node:test</code>, <code>vi.useFakeTimers()</code> của Vitest, <code>jest.useFakeTimers()</code>) để bài test ĐIỀU KHIỂN thời gian thay vì ĐO nó.</p>

<h3>Phụ thuộc thứ tự, đo thật: chẳng ngẫu nhiên chút nào</h3>
${slide('ga-08', 14, 'Cùng một bài test: xanh khi chạy một mình, đỏ khi chạy sau bài bên cạnh — năm trên năm lần')}
<p>Loại thứ ba ở đầu bài, chạy trên runner trong cùng job:</p>
<div class="out">chay RIENG 'gio moi phai rong': exit 0 · # pass 1 # fail 0
chay CA TEP (sau 'them mon'):   exit 1 · # pass 1 # fail 1
chay 5 lan ca tep:
1 1 1 1 1</div>
<p>Năm trên năm, lần nào cũng thế. Bài đầu đẩy một món vào một mảng cấp module; bài sau cho rằng mảng ấy rỗng. Chạy một mình (<code>--test-name-pattern='gio moi'</code>), bài sau qua; chạy sau bài đầu, nó hỏng. Không có xác suất nào ở đây cả. Lý do duy nhất khiến những bài test kiểu này TRÔNG chập chờn trong dự án thật là THỨ TỰ thay đổi — một bộ chạy xáo trộn thứ tự, các mảnh bị chia khác đi khi thêm một tệp, các worker song song dùng chung một cơ sở dữ liệu. Cách vá luôn cùng một hình dạng: mỗi bài test tự dựng trạng thái nó cần và tự dọn nó (<code>beforeEach</code>/<code>afterEach</code>, một đối tượng mới cho mỗi bài, một giao dịch rollback sau mỗi bài với cơ sở dữ liệu).</p>
<h3>Quyết xem bạn đang có loại nào, theo thứ tự chi phí</h3>
<div class="kv-grid">
<div class="kv"><span class="k">ĐỌC thông báo lỗi, trước tiên</span><span class="v">một cú hỏng thật thường nêu tên một thứ cụ thể và lặp lại được; một flake thường nêu một timeout, một kết nối, một dấu thời gian hoặc một thứ tự. Chuyện này không tốn gì và giải quyết phần lớn các ca</span></div>
<div class="kv"><span class="k">chạy RIÊNG bài test ấy, ở máy</span><span class="v">xanh khi một mình mà đỏ trong cả bộ là phụ thuộc thứ tự, giải quyết trong một câu lệnh. Đây là phép kiểm cho lợi nhất và gần như không bao giờ là phép người ta thử đầu tiên</span></div>
<div class="kv"><span class="k">chạy nó trong một vòng lặp</span><span class="v"><code>for i in $(seq 50); do npm test -- -t 'ten bai'; done</code>. Cho ra một TỈ LỆ. Năm mươi lần chạy một bài test là vài giây; năm mươi lần chạy CI là một buổi chiều</span></div>
<div class="kv"><span class="k">đếm nó qua lịch sử</span><span class="v">API workflow-runs cho kết luận của từng lần chạy. "Job này đã hỏng 9 trên 60 lần gần nhất" là một phát biểu rất khác với "nó có vẻ chập chờn", và nó tốn một lời gọi</span></div>
</div>

<h3>Lịch sử của kho này trông ra sao</h3>
<div class="out">desktop-release, 12 lan gan nhat:  10 thanh cong, 2 hong
  hong #1: 80s   — hong RAT som
  hong #2: 334s  — hong giua chung
  TB thanh cong: 458s

hong #2 la run 32400097927: vite build exit 134, heap limit, CHI tren macOS</div>

<div class="callout ok">
<p><strong>Hai cú hỏng trên mười hai, và không cái nào là flake.</strong> Một cái có tài liệu ghi là cú sập trần heap kèm một bản vá cụ thể — <code>--max-old-space-size</code> cộng với bỏ sourcemap ở CI — và kho này KIỂM CHỨNG bản vá bằng cách TÁI LẬP cú hỏng ở một heap bị bóp rồi xem nó đi từ 134 về 0. Đó mới là hình dạng của việc giải quyết một cú hỏng: cố ý tái lập nó, vá nó, rồi tái lập bản vá. Không phải chạy lại rồi xem sao.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một cú hỏng thật hỏng 100% số lần và một lần xanh bác bỏ được nó; một flake 20% thì qua khi chạy lại ở 80% số lần, nên lần chạy lại ấy chẳng nói gì với bạn — và loại thứ ba, phụ thuộc thứ tự, hoàn toàn không ngẫu nhiên và được chẩn đoán bằng cách chạy bài test MỘT MÌNH.</p>
</div>

<h3>Lại là kho này: mười một lần đỏ, một cái tên</h3>
${slide('ga-08', 15, 'api-backend, 18/08/2026: cùng một unit test đỏ ở mười một run trong khoảng chín giờ')}
<p>Phần lịch sử bên trên nhìn vào <code>desktop-release</code>. Workflow CI kể một câu chuyện đáng học hơn. Trong lịch sử được liệt kê của nó, <code>ci-lint.yml</code> có <strong>741 lần chạy, 40 lần hỏng (5,4%)</strong>. Nhìn như một con số, 5,4% nghe như một pipeline chập chờn. Nhìn theo <em>TÊN bài test</em>, thì không phải:</p>
<div class="out">$ gh run list -R cuonghoang1103/api-backend -w ci-lint.yml -L 1000 --json conclusion \\
    --jq 'group_by(.conclusion) | map({(.[0].conclusion): length}) | add'
{"failure":40,"success":701}

$ for id in $(gh api "repos/cuonghoang1103/api-backend/actions/runs?status=failure&amp;per_page=100" \\
      --jq '.workflow_runs[] | select(.created_at | startswith("2026-08-18")) | .id'); do
    gh run view "$id" -R cuonghoang1103/api-backend --log-failed | grep -o "not ok [0-9]* - .*" | head -1
  done
not ok 19 - thiếu khoá của nhóm thì LÙI, không trả về model gọi không được
not ok 19 - thiếu khoá của nhóm thì LÙI, …      (× 2 lần nữa)
not ok 22 - thiếu khoá của nhóm thì LÙI, …      (× 8, tới 19:45 UTC)</div>
<p>Mười một run trong ngày 18/08/2026, từ 10:58 tới 19:45 UTC, tất cả đỏ ở CÙNG một bước ("Unit tests — money math + payment signature") và CÙNG một bài test. Số thứ tự của bài test đổi từ 19 sang 22 giữa các commit; cái tên thì không. Đó là một cú hỏng có tính quyết định đã sống chín tiếng đồng hồ — mọi lần push hôm ấy đều đỏ vì cùng một lý do. Lần đỏ hôm sau (run 32243769111) là một bài test KHÁC trong cùng bước. Không cái nào là flake, và chính việc đếm theo tên mới cho thấy điều đó. Chạy lại bất cứ run nào trong mười một run ấy cũng chỉ đẻ ra lần đỏ thứ mười hai.</p>

<h3>Vá một flake, theo nguyên nhân</h3>
<table>
<thead><tr><th>Nguyên nhân</th><th>Lộ ra thế nào</th><th>Vá tận gốc</th></tr></thead>
<tbody>
<tr><td>Đồng hồ thật</td><td>"mong &lt; 53 ms, nhận 60"; tệ hơn khi máy bận</td><td>đồng hồ giả; khẳng định THỨ TỰ sự kiện, không khẳng định thời lượng</td></tr>
<tr><td>Ngẫu nhiên</td><td>dữ liệu khác nhau mỗi lần; không lặp lại được</td><td>cố định hạt (seed); in hạt ra khi hỏng để chạy lại đúng ca ấy</td></tr>
<tr><td>Trạng thái chung / thứ tự</td><td>chạy riêng xanh, chạy cả bộ đỏ</td><td>dựng và dọn theo từng bài; không có trạng thái thay đổi được ở cấp module</td></tr>
<tr><td>Đua với việc bất đồng bộ</td><td>"mong 'moi', nhận 'cu'"; đọc trước khi ghi xong</td><td>await đúng tín hiệu hoàn tất thật, không bao giờ dùng <code>sleep</code></td></tr>
<tr><td>Dịch vụ bên ngoài</td><td>timeout, 429, 503, lỗi DNS</td><td>giả lập nó trong unit test; trong integration test thì thử lại LỜI GỌI có giãn cách, không thử lại cả bài test</td></tr>
<tr><td>Giờ trong ngày / ngày tháng</td><td>đỏ quanh nửa đêm, cuối tháng, đổi giờ mùa hè</td><td>tiêm đồng hồ vào; cố ý test các ngày biên</td></tr>
</tbody>
</table>
<div class="pitfall">
<p><strong>Bẫy — lấy việc tự thử lại test làm cách vá.</strong> Jest (<code>jest.retryTimes</code>), Vitest (<code>retry</code>) và Playwright (<code>retries</code>) đều tự chạy lại được một bài test hỏng, và một flake 20% với hai lần thử lại thì qua 99,2% số lần. Đó chính là vấn đề: khiếm khuyết giờ TÀNG HÌNH. Thử lại chỉ chấp nhận được nếu vẫn có thứ gì <em>BÁO CÁO</em> các bài đã phải thử lại — Playwright chẳng hạn gắn nhãn "flaky" cho bài qua ở lần thử lại trong báo cáo của nó — và có người đọc danh sách ấy. Một cơ chế thử lại không ai đếm chính là cái nút chạy lại, được tự động hoá.</p>
</div>

<h3>Cách ly: điểm giữa trung thực</h3>
<p>Có lúc một flake không vá được trong hôm nay mà cũng không thể để nó chặn mọi lần merge. Câu trả lời có kỷ luật là CÁCH LY (quarantine): chuyển bài test sang một job riêng vẫn chạy nhưng không chặn (ví dụ <code>continue-on-error: true</code> trên job ấy), mở một issue ghi tỉ lệ đã đo, và giao cho nó một người chịu trách nhiệm cùng một hạn chót. Bộ test chính vẫn đáng tin — xanh nghĩa là xanh — còn flake vẫn hiện ra trước mắt. Khác biệt so với việc xoá hay bỏ qua bài test là: phép đo vẫn TIẾP TỤC.</p>
<pre><code class="language-yaml">  test-cach-ly:                  # các bài bị cách ly: vẫn chạy, vẫn báo, không chặn
    runs-on: ubuntu-24.04
    continue-on-error: true
    steps:
      - uses: actions/checkout@v5
      - run: npm run test:cach-ly   # issue #123 · đo 9/60 · người giữ: Cường</code></pre>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Một bài test hỏng trên CI, bạn chạy lại thì nó qua. Nó có phải test chập chờn không?</strong><br>Đ: Chưa chắc — quan sát ấy là thứ bạn kỳ vọng thấy từ một flake <em>VÀ</em> từ một bug chập chờn thật, và một lần chạy lại mang gần như không có thông tin. Tôi xem cùng tên bài test ấy đã từng hỏng chưa, chạy nó trong vòng lặp ở máy để có tỉ lệ, và chạy nó một mình để loại trừ phụ thuộc thứ tự. Nếu là một cuộc đua hay một giả định về thời gian thì đó là khiếm khuyết THẬT và phải được vá, không phải được thử lại.</p>
<p><strong>H: Bạn tìm những bài test chập chờn nhất trong một kho thế nào?</strong><br>Đ: Từ lịch sử, không từ trí nhớ: liệt kê các run hỏng qua API, rút tên bài test hỏng từ log của chúng, và đếm theo tên. Một cái tên xuất hiện qua nhiều commit khác nhau với các lần xanh xen giữa là flake; một cái tên hỏng ở MỌI run trong một khoảng thời gian là một chỗ vỡ thật.</p>
<p><strong>H: "Re-run failed jobs" làm gì với commit mà nó kiểm?</strong><br>Đ: Không gì cả — nó chạy lại đúng commit và ref của run gốc. Nó chỉ thực thi lại các job hỏng và các job phụ thuộc chúng; job thành công được chép sang lần chạy mới. Muốn kiểm một bản vá bạn cần một run mới trên commit mới.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một đồng đội nói "bài đó chỉ chập chờn thôi, chạy lại đi". Bạn muốn một CON SỐ thay cho một ý kiến — trên một bài test bạn kiểm soát, rồi trên CI thật của bạn.</p><ol>
<li>Trong một kho thử, thêm một bài test hỏng khi <code>Math.random() &lt; 0.2</code>, và một workflow có ma trận 10 nhánh (<code>lan: [1,…,10]</code>) với <code>fail-fast: false</code>. Push rồi đếm số nhánh đỏ.</li>
<li>Chạy <code>gh run rerun ID --failed</code>, chờ, rồi so <code>gh run view ID --attempt 1</code> với <code>gh run view ID</code>. Ghi lại job nào đã THẬT SỰ chạy lại (<code>gh api …/attempts/2/jobs</code>, xem <code>started_at</code>).</li>
<li>Ở máy, chạy bài test 200 lần trong vòng lặp và tính tỉ lệ: <code>n=0; for i in $(seq 200); do node --test test.js &gt;/dev/null 2&gt;&amp;1 || n=$((n+1)); done; echo $n</code>.</li>
<li>Trên kho thật của bạn, đếm số lần hỏng của workflow CI: <code>gh run list -w &lt;tệp&gt; -L 200 --json conclusion --jq 'group_by(.conclusion)|map({(.[0].conclusion):length})|add'</code>.</li>
<li>Với ba trong số các lần hỏng ấy, rút tên bài test hoặc tên bước hỏng bằng <code>gh run view ID --log-failed</code> và viết cạnh nhau.</li></ol>
<p><strong>Đạt khi:</strong> bạn có tỉ lệ của bài test ngẫu nhiên từ vòng lặp (nên gần 20%); bạn nói được lần chạy thứ 2 đã thực thi lại job nào và chép job nào; và với CI thật, bạn nói được các lần hỏng có chung một tên (một chỗ vỡ thật) hay rải rác (ứng viên flake).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flaky test (test chập chờn)</span><span class="v">Bài test có thể qua và hỏng trên CÙNG một mã. Tỉ lệ hỏng là tính chất của bài test cộng môi trường, và đo được.</span></div>
  <div class="kv"><span class="k">Order dependence (phụ thuộc thứ tự)</span><span class="v">Bài test chỉ hỏng sau khi một bài khác đổi trạng thái chung. Có tính quyết định — chẩn đoán bằng cách chạy riêng nó.</span></div>
  <div class="kv"><span class="k">Run attempt (lần chạy thứ n)</span><span class="v">Mỗi lần chạy lại tạo một lần chạy mới của CÙNG run; các lần trước vẫn xem được bằng <code>--attempt</code>.</span></div>
  <div class="kv"><span class="k">Re-run failed jobs (chạy lại job hỏng)</span><span class="v">Thực thi lại các job hỏng và job phụ thuộc trên CÙNG commit; job thành công được chép sang.</span></div>
  <div class="kv"><span class="k">Binomial distribution (phân bố nhị thức)</span><span class="v">Phân bố của số lần hỏng trong n lần chạy độc lập với tỉ lệ p — thứ để so với "4 trên 20".</span></div>
  <div class="kv"><span class="k">Fake timers (đồng hồ giả)</span><span class="v">Công cụ test thay thời gian thật, để mã dùng bộ hẹn giờ được kiểm mà không phải chờ hay đo.</span></div>
  <div class="kv"><span class="k">Quarantine (cách ly)</span><span class="v">Chạy các bài đã biết là chập chờn trong một job không chặn, có người giữ và có issue, để chúng vẫn hiện ra mà không chặn merge.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trên CI: 4/20 nhánh và 41/200 vòng lặp đỏ với một bài test 20% — rải rác, không quy luật.</li>
<li>Với p = 0,2, bốn đỏ trên hai mươi là kết cục nhiều khả năng nhất; hai mươi xanh liên tiếp chỉ 1,2% — nên một vòng lặp nhiều lần chạy CHÍNH LÀ bằng chứng.</li>
<li>Re-run failed jobs chỉ thực thi lại job đỏ và job phụ thuộc, trên CÙNG commit — nó đã biến run này thành xanh trong khi bug vẫn còn.</li>
<li>Một bài test hẹn giờ chập chờn 0% trên runner và 65% trong Docker trên Mac: tỉ lệ phụ thuộc môi trường; bóp CPU để tái lập; đồng hồ giả để vá.</li>
<li>Phụ thuộc thứ tự hỏng 5/5 — nó có tính quyết định, tìm ra bằng cách chạy riêng bài test.</li>
<li>Đếm cú hỏng theo tên bài test: mười một lần đỏ ngày 18/08 của api-backend là MỘT chỗ vỡ thật, không phải một pipeline chập chờn.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36011087956 — hai mươi nhánh, vòng lặp 200 lần, và lần chạy thứ 2</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011087956 — bốn nhánh đỏ ở lần 1, xanh hết sau <code>rerun --failed</code>; job vòng lặp với 41/200 và phép kiểm phụ thuộc thứ tự.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Re-running workflows and jobs (giới hạn và cùng SHA)</span><span class="lc-sub">docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs — chạy lại trong 30 ngày, tối đa 50 lần, dùng CÙNG <code>GITHUB_SHA</code> và <code>GITHUB_REF</code>, và tuỳ chọn "Enable debug logging".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list workflow runs, lọc theo conclusion</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs — <code>?status=failure</code> trên các lần chạy gần đây biến "nó có vẻ chập chờn" thành một TỈ LỆ, đúng phép đo mà bài này lập luận.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Re-running workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs — gồm cả việc chỉ chạy lại các job đã hỏng, tức là hành động SỬA CHỮA rẻ tiền, phân biệt với một cuộc CHẨN ĐOÁN.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — Flaky tests at Google and how we mitigate them</span><span class="lc-sub">testing.googleblog.com — bản quy mô công nghiệp của phép số học này, gồm cả nhận xét rằng một tỉ lệ flake dưới một ngưỡng nào đó thì cách ly rẻ hơn là vá, và cái ngưỡng ấy nằm ở đâu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — cách ly test, trạng thái chung, và vì sao thứ tự có ý nghĩa</span><span class="lc-sub">/courses/nodejs/learn${REF} — loại hỏng thứ ba bên trên, cùng những cơ chế cache module và biến toàn cục đẻ ra nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — những bài test dùng chung một cơ sở dữ liệu</span><span class="lc-sub">/courses/postgresql/learn${REF} — nguồn phụ thuộc thứ tự THẬT phổ biến nhất trong một bộ test backend, và khuôn mẫu một-giao-dịch-cho-mỗi-bài gỡ bỏ nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Reproducing it, and the guess the measurement refuted|||8.3 — Tái lập nó, và cái phỏng đoán bị phép đo bác bỏ',
      slug: 'ga-8-3-tai-lap',
      type: 'VIDEO',
      description: 'Cách tái lập một cú hỏng chỉ-có-ở-CI là BÓP tài nguyên ở máy bạn cho khớp. Đo thật trên runner: macOS 7 GB, trần heap V8 mặc định 2.096 MB; Linux 16 GB là 4.144 MB. Cộng act và docker run cùng image để tái lập ở máy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Reproducing it, and the guess the measurement refuted</h2>
<p class="lead">A failure that only happens in CI is a failure whose cause is a difference between two machines. Finding it means naming the difference — and the most productive move is usually to make your machine <em>worse</em> rather than to make CI more verbose.</p>

<h3>The machine this course runs on</h3>
<div class="out">nhan CPU: 4 · RAM: 15Gi · dia trong: 23G / 252G
node v22.22.2</div>

<p>And the runner specifications, which are documentation rather than a measurement — this course cannot inspect a GitHub runner from outside:</p>

<div class="out">nhan  RAM     SSD    nhan hieu
--------------------------------------------
  4   16 GB   14 GB  ubuntu-latest
  4   16 GB   14 GB  windows-latest
  3    7 GB   14 GB  macos-latest   <- IT RAM NHAT</div>

<div class="callout">
<p><strong>The macOS runner has under half the memory of the other two.</strong> That is a plausible explanation for run 32400097927 failing only on the macOS leg — and it is being stated as a hypothesis that fits the numbers, not as something measured. The measurement that would settle it is the one below.</p>
</div>

<h3>The runners, measured rather than looked up</h3>
${slide('ga-08', 16, 'Measured on real runners: macOS has 7 GB and a default V8 heap ceiling of only 2,096 MB')}
<p>The hypothesis above can be tested, because a workflow can print the machine it runs on. The sandbox workflow <code>ch08-may.yml</code> ran the same diagnostic step on all three hosted operating systems at once — <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171685" target="_blank" rel="noopener">run 36011171685</a>, 24 September 2026, a public repository:</p>
<table>
<thead><tr><th>Runner (public repo)</th><th>Image</th><th>Cores</th><th>RAM</th><th>Free disk on /</th><th>Default V8 heap</th></tr></thead>
<tbody>
<tr><td><code>ubuntu-24.04</code> (x64)</td><td>ubuntu24 20260920.314.1</td><td>4</td><td>15,989 MB</td><td>87 GB</td><td><strong>4,144 MB</strong></td></tr>
<tr><td><code>windows-2025</code> (x64)</td><td>win25-vs2026 20260907.229.1</td><td>4</td><td>16,379 MB</td><td>32 GB</td><td><strong>4,144 MB</strong></td></tr>
<tr><td><code>macos-15</code> (arm64)</td><td>macos15 20260907.0337.1</td><td>3</td><td>7,168 MB</td><td>43 GB</td><td><strong>2,096 MB</strong></td></tr>
</tbody>
</table>
<p>All three ran Node v22.23.2. The documentation&#39;s hardware table matches the cores and memory exactly. The disk column is larger than the documented 14 GB SSD — that is spare space on today&#39;s image, not a promise, so do not design a job around it. And the last column settles the hypothesis about run 32400097927 much more directly than "macOS has less RAM": <strong>the same Node version, with no flags, gives a build on macOS half the heap it gets on Linux.</strong> A <code>vite build</code> that peaks at 3 GB is comfortable on the Linux leg and dies with 134 on the macOS leg, and nothing in the code distinguishes them.</p>
<p>The same measurement on the machines around the course fills in how the default is chosen:</p>
<div class="out">may                                   RAM        heap mac dinh
Mac M1 cua khoa (Node 22.21)          32 GB      4.144 MB
Docker Desktop tren Mac (VM)           8 GB      2.096 MB
docker run -m 1g   node:22-slim        1 GB        524 MB
docker run -m 128m node:22-alpine    128 MB        259 MB   (lon hon ca container)</div>
<p>The ceiling scales with the memory Node can see — the machine&#39;s, or the container&#39;s cgroup limit — up to about 4 GB, and it has a floor around 256 MB. That floor is why the 128 MB container in lesson 8.1 died with a silent 137 instead of a loud 134. It also means the one-line check below is not optional decoration: it is the only way to know which ceiling a given runner applied.</p>
<h3>The guess, and the measurement that refuted it</h3>
<p>Before measuring, this lesson was going to state the widely repeated rule that V8&#39;s default heap is about half of RAM, capped near 4 GB — which would have predicted roughly 4,000 MB on a 15 GiB machine. One line checks it:</p>

<div class="out">$ node -e 'console.log(require("v8").getHeapStatistics().heap_size_limit)'
heap_size_limit  = 8.240 MB</div>

<div class="callout warn">
<p><strong>8,240 MB, not 4,000 — on the machine where it was measured.</strong> This callout originally concluded that "Node 22 raised the ceiling" and that the "V8 defaults to about 4 GB" advice is out of date. Re-measured on 24 September 2026, that conclusion does not hold where it matters: Node 22.23 reports <strong>4,144 MB</strong> on GitHub&#39;s 16 GB ubuntu and windows runners, <strong>2,096 MB</strong> on the 7 GB macos-15 runner, and 4,144 MB on this course&#39;s 32 GB Mac (Node 22.21). The 8,240 MB reading could not be reproduced on any machine measured that day. The default ceiling follows the memory of the machine — and of a container&#39;s limit — so "about 4 GB" is right for a standard Linux runner and wrong for macOS. The part of the original point that survives is the method: the check costs one line, so run it on the machine that fails rather than trusting a number from a blog post, or from this lesson.</p>
</div>

<p>The same call confirms that the flag does what it says, which is worth knowing before you rely on it:</p>

<div class="out">--max-old-space-size=512   -> heap_size_limit =   560 MB
--max-old-space-size=2048  -> heap_size_limit = 2.096 MB</div>

<h3>The technique: make your machine worse</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">name the difference</span><span class="lz-t">memory, cores, disk, OS, tool version</span><span class="lz-d">a CI-only failure has one. The exit code usually points at which — 134 says memory, 137 says memory harder, 139 says a native binary</span></div>
<div class="lz-step"><span class="lz-k">constrain locally to match</span><span class="lz-t"><code>--max-old-space-size</code>, <code>ulimit</code>, <code>docker run -m</code>, <code>taskset</code></span><span class="lz-d">this repository did exactly this: squeezed the heap to 1600 MB and watched <code>vite build</code> go from exit 0 to exit 134</span></div>
<div class="lz-step"><span class="lz-k">then verify the fix the same way</span><span class="lz-t">under the constraint, not without it</span><span class="lz-d">with sourcemaps → 134; without → 0. The fix is proven at the constraint that caused the failure</span></div>
</div>

<div class="callout ok">
<p><strong>That reproduction is the whole reason the fix is trustworthy.</strong> Without it, "we added <code>--max-old-space-size=6144</code> and it stopped failing" is indistinguishable from "we changed something and the flake did not recur" — which lesson 8.2 measured as the most likely outcome regardless. Reproducing the failure first is what turns a green run into evidence.</p>
</div>

<h3>The constraint toolkit</h3>
<div class="kv-grid">
<div class="kv"><span class="k">memory · Node</span><span class="v"><code>node --max-old-space-size=&lt;MB&gt;</code>. Verified above to set <code>heap_size_limit</code> directly. The cheapest constraint to apply and the one that reproduces exit 134</span></div>
<div class="kv"><span class="k">memory · whole process</span><span class="v"><code>docker run -m 512m</code>, or a cgroup. This reproduces <strong>137</strong> rather than 134 — the OOM killer rather than V8 giving up, which is the distinction from 8.1</span></div>
<div class="kv"><span class="k">cores</span><span class="v"><code>taskset -c 0,1</code> or <code>docker run --cpus 2</code>. Reproduces timeouts and race conditions that only appear when the machine is slower than yours</span></div>
<div class="kv"><span class="k">disk</span><span class="v">a small loopback filesystem. Reproduces the <code>no space left on device</code> class — which this repository has hit on its VPS, and a runner has 14 GB</span></div>
<div class="kv"><span class="k">the OS itself</span><span class="v">the one you cannot fake. A Linux container does not reproduce a macOS-only failure, and this is where a matrix leg earns its cost</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — adding logging to CI instead of reproducing locally.</strong> The instinct on a CI-only failure is to push a commit that prints more. Each iteration costs a full run — 141 to 555 seconds here — plus the wait, and it changes the thing being debugged. Constraining a local machine gives an iteration time of seconds and a debugger. Add CI logging when you genuinely cannot name the difference; try to name it first.</p>
</div>

<h3>What to print when you do need CI to tell you</h3>
${slide('ga-08', 17, 'One step prints the image, the architecture and the heap ceiling — ask the machine before guessing')}
<pre><code>- name: May nay la may nao
  run: |
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    nproc; free -h 2&gt;/dev/null || vm_stat; df -h /
    node --version
    node -e 'console.log("heap limit MB:",
      (require("v8").getHeapStatistics().heap_size_limit/1048576).toFixed(0))'</code></pre>

<div class="callout">
<p><strong>That last line is the one worth adding permanently.</strong> It costs milliseconds, it prints on every run, and the day a build starts failing with 134 it answers the first question immediately — did the ceiling move, or did the build get bigger? Without it, both hypotheses are equally consistent with the log.</p>
</div>

<h3>What cannot be reproduced locally, and what to do instead</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a specific runner image version</span><span class="lz-lnote">the image is not published as a runnable artifact. The <code>actions/runner-images</code> repository documents what changed between versions, and its announcement issues are the fastest route when a green workflow goes red with no commit — measured in 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">macOS, if you do not have a Mac</span><span class="lz-lnote">no substitute. The practical answer is a matrix leg that fails fast and prints diagnostics, plus <code>fail-fast: false</code> so the other legs still produce artifacts — which is exactly what this repository configured, and 2.5 measured why</span></div>
<div class="lz-layer"><span class="lz-lname">the network from a runner</span><span class="lz-lnote">different egress, different DNS, different rate-limit bucket. A failure that only happens in CI and involves an external service is often this, and the diagnostic is to print the resolved address and the response headers</span></div>
<div class="lz-layer"><span class="lz-lname">a full local runner</span><span class="lz-lnote"><code>act</code> runs workflows locally in Docker. Genuinely useful for iterating on workflow <em>syntax</em> and step wiring; it is not the same OS, not the same image, and not the same resource limits, so it does not reproduce this chapter&#39;s failures</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A CI-only failure is a machine difference, the exit code usually names which one, and reproducing it by constraining your own machine turns a fix from "it stopped happening" into "it fails at this limit and stops failing after this change" — and the heap ceiling behind a 134 is a property of the machine that failed (2,096 MB on the macOS runner, 4,144 MB on Linux), to be printed there rather than quoted.</p>
</div>

<h3>act, measured: it did reproduce this chapter&#39;s matrix failure</h3>
${slide('ga-08', 18, 'act reproduced the red Node 20 matrix leg on a laptop in about 45 seconds, with no push')}
<p>The list above is right that <code>act</code> is not the hosted environment. It is worth being precise about what that rules out, because for one of this chapter&#39;s failures act was the fastest tool available. Lesson 8.5 follows a pipeline whose Node 20 leg went red (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185" target="_blank" rel="noopener">run 36011088185</a>). Here is that exact commit, checked out into a worktree and run with <code>act</code> 0.2.89 on the course&#39;s M1 Mac:</p>
<div class="out">$ act push -W .github/workflows/ch08-duong-ong.yml -j test --matrix node:20 \\
      -P ubuntu-24.04=node:22-bookworm-slim --pull=false --rm
[ch08-duong-ong/lint] 🏁  Job succeeded
[ch08-duong-ong/test] ⭐ Run Main actions/setup-node@v5
[ch08-duong-ong/test]   | node: v20.20.2
[ch08-duong-ong/test]   ✅  Success - Main actions/setup-node@v5 [40.548308125s]
[ch08-duong-ong/test] ⭐ Run Main npm test
[ch08-duong-ong/test]   | &gt; node --test "test-that/*.test.js"
[ch08-duong-ong/test]   | Could not find '…/vong0/ch08/app/test-that/*.test.js'
[ch08-duong-ong/test]   ❌  Failure - Main npm test [167.966583ms]
[ch08-duong-ong/test] exitcode '1': failure
Error: Job 'test' failed</div>
<p>The same error line as the hosted run, in about 45 seconds, 40 of which were <code>setup-node</code> downloading Node 20 into act&#39;s tool cache. Five details from that run are the working knowledge of act:</p>
<div class="kv-grid">
<div class="kv"><span class="k"><code>-P label=image</code></span><span class="v">decides which container plays the runner. Here <code>ubuntu-24.04</code> was mapped to <code>node:22-bookworm-slim</code>, already on the machine. act&#39;s own "medium" images are much larger and closer to the real runner; nothing is identical to it</span></div>
<div class="kv"><span class="k"><code>-j</code> and <code>--matrix</code></span><span class="v">run one job, one matrix leg. act still ran <code>lint</code> first, because <code>test</code> declares <code>needs: lint</code></span></div>
<div class="kv"><span class="k"><code>--rm</code></span><span class="v">removes the job containers when done. act also created a Docker volume <code>act-toolcache</code> for downloaded tools; <code>docker volume rm act-toolcache</code> removes it</span></div>
<div class="kv"><span class="k">the M1 warning</span><span class="v">act warns on Apple silicon that you did not choose <code>--container-architecture</code>. Leaving it native (arm64) was fine for Node; use <code>linux/amd64</code> when a failure depends on x64 binaries</span></div>
<div class="kv"><span class="k">small differences</span><span class="v">act runs <code>run:</code> blocks from its own script file, so a shell error in act says <code>line 2</code> where GitHub says <code>line 1</code> — measured on the <code>eslnt</code> job. Do not chase line-number mismatches</span></div>
</div>

<h3>The cheaper tool: run the same command in the same image</h3>
${slide('ga-08', 19, 'docker run with the failing leg’s image reproduces the error in seconds, and verifies each round of the fix')}
<p>When you already know which step failed and on which version, you do not need a workflow runner at all. The failing leg ran <code>npm test</code> on Node 20, so run <code>npm test</code> on Node 20:</p>
<div class="out">$ docker run --rm -v "$PWD":/app:ro -w /app node:20-slim sh -c 'node --version; npm test'
v20.20.2
Could not find '/app/test-that/*.test.js'</div>
<p>That is the whole reproduction: one line, a few seconds, the same error. The options each do a job: <code>--rm</code> so no container is left behind, <code>:ro</code> so the command cannot write into your working tree (a build that creates <code>node_modules</code> as root inside your folder is its own mess), and an image tag that matches the leg — <code>node:20-slim</code> for a Node 20 leg. Lesson 8.5 uses exactly this command to check each round of the fix before pushing. To imitate a runner&#39;s resources, add them: <code>--cpus 3 -m 7g</code> is roughly the macOS runner&#39;s budget, and <code>-m 7g</code> will also change Node&#39;s default heap, as measured above.</p>

<h3>act, docker run, or the real runner?</h3>
${slide('ga-08', 20, 'act for fast iteration on the workflow, docker run for reproducing a command, the runner for confirmation')}
<table>
<thead><tr><th>Question you are answering</th><th>Best tool</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Does my YAML parse? Is <code>needs:</code>/<code>if:</code>/matrix wired right?</td><td>actionlint, then act</td><td>seconds, no commit, no minutes spent</td></tr>
<tr><td>Why does <code>npm test</code> fail on Node 20?</td><td><code>docker run node:20-slim</code></td><td>the command is the failure; the workflow is irrelevant</td></tr>
<tr><td>Does it fail on the runner&#39;s memory budget?</td><td><code>docker run -m 7g --cpus 3</code>, or <code>--max-old-space-size</code></td><td>squeezes your machine to match (earlier in this lesson)</td></tr>
<tr><td>Is it macOS- or Windows-only?</td><td>the real runner</td><td>nothing local imitates another OS</td></tr>
<tr><td>Does it involve secrets, OIDC, caches, artifacts, concurrency?</td><td>the real runner</td><td>act only simulates these, or needs them passed in by hand (<code>-s NAME</code>)</td></tr>
<tr><td>Is the fix done?</td><td>the real runner, after a local reproduction</td><td>the green run confirms; the local reproduction is the evidence (8.5)</td></tr>
</tbody>
</table>
<div class="pitfall">
<p><strong>Trap — pushing "debug" commits as the reproduction loop.</strong> Every push costs a queue wait plus a full run (141 to 555 seconds in this repository), adds noise to history, and on a shared branch triggers everybody&#39;s workflows. The measured alternatives here took 45 seconds (act) and about a second (docker run, measured at 1.2 s). Push to CI when the question is one only CI can answer — a different OS, a real secret, a real cache — and say so in the commit message.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: A build passes on your machine and fails in CI. How do you approach it?</strong><br>A: I name the difference between the two machines: OS, architecture, tool versions, memory, CPU, network, environment variables. The exit code and the failing step usually point at one. Then I reproduce it locally by making my machine match — the same container image, the same Node version, the same memory limit — and only when I cannot match it (another OS, a real secret) do I iterate on CI, with a diagnostic step that prints the machine.</p>
<p><strong>Q: What is act, and what can it not do?</strong><br>A: act runs GitHub Actions workflows locally in Docker containers. It is good for iterating on workflow structure and for reproducing command failures on Linux. It does not use GitHub&#39;s runner images by default, cannot run macOS or Windows jobs, and only simulates services such as caches, artifacts and OIDC, so a green act run does not prove a green GitHub run.</p>
<p><strong>Q: Why might the same Node build run out of memory only on the macOS runner?</strong><br>A: Because Node&#39;s default heap ceiling follows the machine&#39;s memory. On the standard runners I measured 4,144 MB on Linux and Windows and 2,096 MB on macOS. I would print the ceiling in the job and either reduce peak memory or set <code>--max-old-space-size</code> explicitly within the runner&#39;s RAM.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your CI has a matrix leg you cannot explain. Before your next push, you want to know what machine it runs on and be able to reproduce its command on your laptop.</p><ol>
<li>Add the "which machine is this" step from this lesson (with the heap line) to a workflow in your test repository, with a matrix over <code>ubuntu-24.04</code> and <code>macos-15</code>. Push once and record both heap ceilings.</li>
<li>Add a matrix leg on <code>node-version: 20</code> that runs a test using a Node 22-only feature (for example <code>[1,2].values().map(x =&gt; x).toArray()</code>). Push and confirm that leg is red.</li>
<li>Reproduce it locally in one line: <code>docker run --rm -v "$PWD":/app:ro -w /app node:20-slim npm test</code>.</li>
<li>Optional: install act, run <code>act -j &lt;job&gt; --matrix node-version:20 --rm</code>, and compare its error line with GitHub&#39;s. Afterwards run <code>docker volume rm act-toolcache</code>.</li></ol>
<p><strong>Done when:</strong> you have two heap numbers from real runners (expect about 4,144 and 2,096 MB); the <code>docker run</code> line prints the same error as the red leg; and you did not push any commit whose only purpose was to add logging.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runner image (ảnh runner)</span><span class="v">The OS image a hosted runner boots from, with its preinstalled tools. It has a version (e.g. ubuntu24 20260920.314.1) printed in "Set up job".</span></div>
  <div class="kv"><span class="k">Reproduction (tái lập)</span><span class="v">Making the failure happen on demand, on a machine you control, under the same condition that caused it on CI.</span></div>
  <div class="kv"><span class="k">act</span><span class="v">A tool that runs workflows locally in Docker. Fast for workflow structure; not identical to GitHub&#39;s runners.</span></div>
  <div class="kv"><span class="k"><code>-P</code> platform mapping</span><span class="v">act&#39;s option to choose which container image plays a <code>runs-on</code> label.</span></div>
  <div class="kv"><span class="k">cgroup memory limit</span><span class="v">The memory ceiling a container gets (<code>docker run -m</code>). Node reads it when choosing its default heap.</span></div>
  <div class="kv"><span class="k">Default heap ceiling</span><span class="v">The V8 limit Node picks without flags: 4,144 MB on 16 GB runners, 2,096 MB on the 7 GB macOS runner (measured 09/2026).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured on hosted runners (public repo): ubuntu and windows 4 cores / 16 GB, macOS 3 cores / 7 GB — matching the docs.</li>
<li>Node 22&#39;s default heap is 4,144 MB on Linux/Windows runners and 2,096 MB on macOS; the lesson&#39;s earlier "8,240 MB" was not reproducible and has been corrected.</li>
<li>Print the machine and the heap ceiling in the job — one step, milliseconds, and it answers the first question of every 134.</li>
<li><code>docker run --rm</code> with the failing leg&#39;s image reproduces a command failure in seconds.</li>
<li>act reproduced this chapter&#39;s Node 20 failure in ~45 s; it is still not the hosted image, OS or services.</li>
<li>Push to CI only for what only CI can answer.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36011171685 — three runners describe themselves</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171685 — cores, RAM, free disk, image version and default V8 heap ceiling on ubuntu-24.04, macos-15 and windows-2025.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub-hosted runners reference</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/github-hosted-runners — the standard runner table for public repositories: 4 CPU / 16 GB / 14 GB SSD on Linux and Windows, 3 CPU (M1) / 7 GB on arm64 macOS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — available images and specifications</span><span class="lc-sub">github.com/actions/runner-images#available-images — the per-label hardware table quoted above, and the per-image changelogs that explain no-commit regressions.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — v8.getHeapStatistics()</span><span class="lc-sub">nodejs.org/api/v8.html#v8getheapstatistics — the one-line check that refuted the guess above, and the rest of the heap counters worth printing when a build is near a ceiling.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nektos/act — run workflows locally</span><span class="lc-sub">github.com/nektos/act — useful for iterating on workflow structure without pushing; explicitly not a reproduction of the hosted environment, which is the caveat above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — constraining memory and CPU to reproduce a production failure</span><span class="lc-sub">/courses/docker/learn${REF} — <code>-m</code>, <code>--cpus</code> and cgroups, with a measured case where a 512 MB limit reproduced an incident that a laptop could not.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the small machine, and the swap that hid an OOM</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — measuring memory pressure while it is happening rather than after, including a null result from reading the counters too late.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Tái lập nó, và cái phỏng đoán bị phép đo bác bỏ</h2>
<p class="lead">Một cú hỏng chỉ xảy ra ở CI là một cú hỏng mà nguyên nhân của nó là một KHÁC BIỆT giữa hai cỗ máy. Tìm ra nó nghĩa là GỌI TÊN cái khác biệt ấy — và nước đi hiệu quả nhất thường là làm cho máy bạn <em>TỆ ĐI</em> chứ không phải làm cho CI nói nhiều hơn.</p>

<h3>Cỗ máy chạy khoá học này</h3>
<div class="out">nhan CPU: 4 · RAM: 15Gi · dia trong: 23G / 252G
node v22.22.2</div>

<p>Và cấu hình runner, thứ là TÀI LIỆU chứ không phải một phép đo — khoá học này không soi được một runner của GitHub từ bên ngoài:</p>

<div class="out">nhan  RAM     SSD    nhan hieu
--------------------------------------------
  4   16 GB   14 GB  ubuntu-latest
  4   16 GB   14 GB  windows-latest
  3    7 GB   14 GB  macos-latest   <- IT RAM NHAT</div>

<div class="callout">
<p><strong>Runner macOS có chưa bằng một nửa bộ nhớ của hai cái kia.</strong> Đó là một lời giải thích HỢP LÝ cho việc run 32400097927 chỉ hỏng ở nhánh macOS — và nó đang được nêu như một GIẢ THUYẾT khớp với số liệu, không nêu như một thứ đã đo. Phép đo giải quyết được nó là phép ở ngay dưới.</p>
</div>

<h3>Các runner, ĐO chứ không tra</h3>
${slide('ga-08', 16, 'Đo trên runner thật: macOS có 7 GB và trần heap V8 mặc định chỉ 2.096 MB')}
<p>Giả thuyết bên trên kiểm được, vì một workflow in ra được cỗ máy nó đang chạy. Workflow sân tập <code>ch08-may.yml</code> chạy cùng một bước chẩn đoán trên cả ba hệ điều hành do GitHub cấp cùng lúc — <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171685" target="_blank" rel="noopener">run 36011171685</a>, ngày 24/09/2026, một kho công khai:</p>
<table>
<thead><tr><th>Runner (kho công khai)</th><th>Ảnh</th><th>Nhân</th><th>RAM</th><th>Đĩa trống ở /</th><th>Heap V8 mặc định</th></tr></thead>
<tbody>
<tr><td><code>ubuntu-24.04</code> (x64)</td><td>ubuntu24 20260920.314.1</td><td>4</td><td>15.989 MB</td><td>87 GB</td><td><strong>4.144 MB</strong></td></tr>
<tr><td><code>windows-2025</code> (x64)</td><td>win25-vs2026 20260907.229.1</td><td>4</td><td>16.379 MB</td><td>32 GB</td><td><strong>4.144 MB</strong></td></tr>
<tr><td><code>macos-15</code> (arm64)</td><td>macos15 20260907.0337.1</td><td>3</td><td>7.168 MB</td><td>43 GB</td><td><strong>2.096 MB</strong></td></tr>
</tbody>
</table>
<p>Cả ba chạy Node v22.23.2. Bảng phần cứng của tài liệu khớp CHÍNH XÁC số nhân và bộ nhớ. Cột đĩa lớn hơn con số 14 GB SSD của tài liệu — đó là chỗ trống dư của ảnh hôm nay, không phải một lời hứa, nên đừng thiết kế job dựa vào nó. Và cột cuối giải quyết giả thuyết về run 32400097927 trực tiếp hơn nhiều so với câu "macOS ít RAM hơn": <strong>cùng một phiên bản Node, không cờ nào, cho bản dựng trên macOS một NỬA heap so với trên Linux.</strong> Một lần <code>vite build</code> đạt đỉnh 3 GB thì thoải mái trên nhánh Linux và chết với 134 trên nhánh macOS, và không có gì trong mã phân biệt hai nhánh ấy.</p>
<p>Cùng phép đo ấy trên các cỗ máy quanh khoá học cho thấy mặc định được chọn thế nào:</p>
<div class="out">may                                   RAM        heap mac dinh
Mac M1 cua khoa (Node 22.21)          32 GB      4.144 MB
Docker Desktop tren Mac (VM)           8 GB      2.096 MB
docker run -m 1g   node:22-slim        1 GB        524 MB
docker run -m 128m node:22-alpine    128 MB        259 MB   (lon hon ca container)</div>
<p>Cái trần co giãn theo bộ nhớ mà Node nhìn thấy — của máy, hoặc của giới hạn cgroup của container — lên tới khoảng 4 GB, và có một cái sàn quanh 256 MB. Cái sàn ấy là lý do container 128 MB ở bài 8.1 chết với một con 137 im lặng thay vì một con 134 ồn ào. Nó cũng có nghĩa phép kiểm một dòng bên dưới KHÔNG phải đồ trang trí: nó là cách duy nhất biết một runner cụ thể đã áp cái trần nào.</p>
<h3>Cái phỏng đoán, và phép đo bác bỏ nó</h3>
<p>Trước khi đo, bài này định phát biểu cái quy tắc hay được nhắc lại rằng heap mặc định của V8 khoảng một nửa RAM, trần gần 4 GB — thứ sẽ dự đoán khoảng 4.000 MB trên một máy 15 GiB. Một dòng là kiểm được:</p>

<div class="out">$ node -e 'console.log(require("v8").getHeapStatistics().heap_size_limit)'
heap_size_limit  = 8.240 MB</div>

<div class="callout warn">
<p><strong>8.240 MB, không phải 4.000 — trên cái máy đã đo.</strong> Khung này lúc đầu kết luận rằng "Node 22 đã nâng cái trần" và lời khuyên "V8 mặc định khoảng 4 GB" đã CŨ. Đo lại ngày 24/09/2026, kết luận ấy KHÔNG đứng vững ở đúng chỗ quan trọng: Node 22.23 báo <strong>4.144 MB</strong> trên runner ubuntu và windows 16 GB của GitHub, <strong>2.096 MB</strong> trên runner macos-15 7 GB, và 4.144 MB trên máy Mac 32 GB của khoá (Node 22.21). Con số 8.240 MB không tái lập được trên bất cứ máy nào đo hôm ấy. Trần mặc định chạy THEO bộ nhớ của máy — và theo giới hạn của container — nên "khoảng 4 GB" là ĐÚNG với một runner Linux tiêu chuẩn và SAI với macOS. Phần còn đứng vững của ý ban đầu là PHƯƠNG PHÁP: phép kiểm tốn một dòng, nên hãy chạy nó trên chính cái máy bị hỏng thay vì tin một con số từ một bài blog, hay từ chính bài này.</p>
</div>

<p>Cùng lời gọi ấy xác nhận cái cờ làm đúng thứ nó nói, điều đáng biết trước khi bạn dựa vào nó:</p>

<div class="out">--max-old-space-size=512   -> heap_size_limit =   560 MB
--max-old-space-size=2048  -> heap_size_limit = 2.096 MB</div>

<h3>Kỹ thuật: làm cho máy bạn TỆ ĐI</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">gọi tên cái khác biệt</span><span class="lz-t">bộ nhớ, số nhân, đĩa, hệ điều hành, phiên bản công cụ</span><span class="lz-d">một cú hỏng chỉ-có-ở-CI đều có một cái. Mã thoát thường chỉ ra là cái nào — 134 nói bộ nhớ, 137 nói bộ nhớ nặng hơn, 139 nói một tệp nhị phân gốc</span></div>
<div class="lz-step"><span class="lz-k">bóp ở máy cho khớp</span><span class="lz-t"><code>--max-old-space-size</code>, <code>ulimit</code>, <code>docker run -m</code>, <code>taskset</code></span><span class="lz-d">kho này làm đúng thế: bóp heap còn 1600 MB rồi xem <code>vite build</code> đi từ exit 0 sang exit 134</span></div>
<div class="lz-step"><span class="lz-k">rồi kiểm bản vá theo CÙNG cách</span><span class="lz-t">DƯỚI ràng buộc, không phải khi bỏ nó ra</span><span class="lz-d">có sourcemap → 134; không có → 0. Bản vá được chứng minh tại chính cái ràng buộc đã gây ra cú hỏng</span></div>
</div>

<div class="callout ok">
<p><strong>Chính phép tái lập ấy là toàn bộ lý do bản vá đáng tin.</strong> Không có nó thì "chúng tôi thêm <code>--max-old-space-size=6144</code> và nó thôi hỏng" không phân biệt được với "chúng tôi đổi cái gì đó và cái flake không tái diễn" — mà bài 8.2 đã đo rằng đó là kết cục nhiều khả năng nhất BẤT KỂ thế nào. Tái lập cú hỏng TRƯỚC là thứ biến một lần chạy xanh thành BẰNG CHỨNG.</p>
</div>

<h3>Bộ đồ nghề ràng buộc</h3>
<div class="kv-grid">
<div class="kv"><span class="k">bộ nhớ · Node</span><span class="v"><code>node --max-old-space-size=&lt;MB&gt;</code>. Đã kiểm chứng bên trên là nó đặt thẳng <code>heap_size_limit</code>. Ràng buộc rẻ nhất để áp và là cái tái lập được exit 134</span></div>
<div class="kv"><span class="k">bộ nhớ · cả tiến trình</span><span class="v"><code>docker run -m 512m</code>, hoặc một cgroup. Cái này tái lập <strong>137</strong> chứ không phải 134 — OOM killer chứ không phải V8 tự bỏ cuộc, đúng chỗ phân biệt của bài 8.1</span></div>
<div class="kv"><span class="k">số nhân</span><span class="v"><code>taskset -c 0,1</code> hoặc <code>docker run --cpus 2</code>. Tái lập những cú timeout và những cuộc đua chỉ lộ ra khi cỗ máy chậm hơn máy bạn</span></div>
<div class="kv"><span class="k">đĩa</span><span class="v">một hệ tệp loopback nhỏ. Tái lập lớp <code>no space left on device</code> — thứ kho này đã dính trên VPS, và một runner có 14 GB</span></div>
<div class="kv"><span class="k">chính hệ điều hành</span><span class="v">cái duy nhất bạn KHÔNG giả được. Một container Linux không tái lập được một cú hỏng chỉ-có-trên-macOS, và đó là chỗ một nhánh ma trận tự kiếm được chi phí của nó</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm log vào CI thay vì tái lập ở máy.</strong> Bản năng khi gặp một cú hỏng chỉ-có-ở-CI là đẩy một commit in ra nhiều hơn. Mỗi vòng lặp tốn một lần chạy đầy đủ — 141 tới 555 giây ở đây — cộng thời gian chờ, và nó LÀM THAY ĐỔI chính cái thứ đang được gỡ lỗi. Bóp một cỗ máy cục bộ cho thời gian vòng lặp tính bằng giây và một trình gỡ lỗi. Hãy thêm log vào CI khi bạn THẬT SỰ không gọi tên được cái khác biệt; hãy thử gọi tên nó trước.</p>
</div>

<h3>In gì ra khi bạn THẬT SỰ cần CI nói cho biết</h3>
${slide('ga-08', 17, 'Một bước in ra ảnh, kiến trúc và trần heap — hỏi cỗ máy trước khi đoán')}
<pre><code>- name: May nay la may nao
  run: |
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    nproc; free -h 2&gt;/dev/null || vm_stat; df -h /
    node --version
    node -e 'console.log("heap limit MB:",
      (require("v8").getHeapStatistics().heap_size_limit/1048576).toFixed(0))'</code></pre>

<div class="callout">
<p><strong>Cái dòng cuối là dòng đáng thêm vào VĨNH VIỄN.</strong> Nó tốn vài mili giây, nó in ra ở mọi lần chạy, và cái ngày một bản dựng bắt đầu hỏng với 134 thì nó trả lời câu hỏi đầu tiên ngay lập tức — cái trần đã dịch, hay bản dựng đã phình ra? Không có nó thì cả hai giả thuyết đều nhất quán với cái log như nhau.</p>
</div>

<h3>Thứ KHÔNG tái lập được ở máy, và làm gì thay vào đó</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một phiên bản ảnh runner cụ thể</span><span class="lz-lnote">cái ảnh ấy không được công bố dưới dạng một sản phẩm chạy được. Kho <code>actions/runner-images</code> ghi lại cái gì đổi giữa các phiên bản, và các issue thông báo của nó là đường nhanh nhất khi một workflow xanh bỗng đỏ mà không có commit nào — đo ở bài 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">macOS, nếu bạn không có máy Mac</span><span class="lz-lnote">không có thứ thay thế. Đáp án thực dụng là một nhánh ma trận hỏng nhanh và in ra chẩn đoán, cộng <code>fail-fast: false</code> để các nhánh khác vẫn đẻ ra artifact — đúng thứ kho này đã cấu hình, và bài 2.5 đã đo vì sao</span></div>
<div class="lz-layer"><span class="lz-lname">mạng nhìn từ một runner</span><span class="lz-lnote">lối ra khác, DNS khác, xô giới-hạn-tần-suất khác. Một cú hỏng chỉ có ở CI mà lại dính tới một dịch vụ bên ngoài thì thường là chuyện này, và cách chẩn đoán là in ra địa chỉ đã phân giải cùng các header phản hồi</span></div>
<div class="lz-layer"><span class="lz-lname">một runner đầy đủ chạy ở máy</span><span class="lz-lnote"><code>act</code> chạy workflow cục bộ trong Docker. Thật sự hữu ích để lặp trên <em>CÚ PHÁP</em> workflow và cách nối các bước; nó không cùng hệ điều hành, không cùng ảnh, và không cùng giới hạn tài nguyên, nên nó KHÔNG tái lập được những cú hỏng của chương này</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một cú hỏng chỉ-có-ở-CI là một khác biệt giữa hai cỗ máy, mã thoát thường gọi tên là khác biệt nào, và tái lập nó bằng cách BÓP máy của chính bạn biến một bản vá từ "nó thôi xảy ra" thành "nó hỏng tại giới hạn này và thôi hỏng sau thay đổi này" — và cái trần heap đứng sau một con 134 là tính chất của CHÍNH cỗ máy bị hỏng (2.096 MB trên runner macOS, 4.144 MB trên Linux), phải in ra ở đó chứ không trích từ đâu khác.</p>
</div>

<h3>act, đo thật: nó ĐÃ tái lập được cú đỏ ma trận của chương này</h3>
${slide('ga-08', 18, 'act tái lập nhánh ma trận Node 20 đỏ trên laptop trong khoảng 45 giây, không cần push')}
<p>Danh sách bên trên nói đúng rằng <code>act</code> không phải môi trường do GitHub cấp. Nhưng đáng nói CHÍNH XÁC điều đó loại trừ những gì, vì với một cú hỏng của chương này act lại là công cụ nhanh nhất có trong tay. Bài 8.5 theo dõi một pipeline có nhánh Node 20 đỏ (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185" target="_blank" rel="noopener">run 36011088185</a>). Đây là đúng commit ấy, checkout vào một worktree và chạy bằng <code>act</code> 0.2.89 trên máy Mac M1 của khoá:</p>
<div class="out">$ act push -W .github/workflows/ch08-duong-ong.yml -j test --matrix node:20 \\
      -P ubuntu-24.04=node:22-bookworm-slim --pull=false --rm
[ch08-duong-ong/lint] 🏁  Job succeeded
[ch08-duong-ong/test] ⭐ Run Main actions/setup-node@v5
[ch08-duong-ong/test]   | node: v20.20.2
[ch08-duong-ong/test]   ✅  Success - Main actions/setup-node@v5 [40.548308125s]
[ch08-duong-ong/test] ⭐ Run Main npm test
[ch08-duong-ong/test]   | &gt; node --test "test-that/*.test.js"
[ch08-duong-ong/test]   | Could not find '…/vong0/ch08/app/test-that/*.test.js'
[ch08-duong-ong/test]   ❌  Failure - Main npm test [167.966583ms]
[ch08-duong-ong/test] exitcode '1': failure
Error: Job 'test' failed</div>
<p>Đúng dòng lỗi của run trên GitHub, trong khoảng 45 giây, mà 40 giây trong đó là <code>setup-node</code> tải Node 20 về kho công cụ của act. Năm chi tiết từ lần chạy ấy là vốn hiểu biết làm việc với act:</p>
<div class="kv-grid">
<div class="kv"><span class="k"><code>-P nhãn=ảnh</code></span><span class="v">quyết định container nào đóng vai runner. Ở đây <code>ubuntu-24.04</code> được ánh xạ sang <code>node:22-bookworm-slim</code>, có sẵn trên máy. Các ảnh "medium" của chính act lớn hơn nhiều và gần runner thật hơn; không ảnh nào GIỐNG HỆT nó</span></div>
<div class="kv"><span class="k"><code>-j</code> và <code>--matrix</code></span><span class="v">chạy một job, một nhánh ma trận. act vẫn chạy <code>lint</code> trước, vì <code>test</code> khai <code>needs: lint</code></span></div>
<div class="kv"><span class="k"><code>--rm</code></span><span class="v">xoá các container của job khi xong. act còn tạo một volume Docker <code>act-toolcache</code> cho các công cụ đã tải; <code>docker volume rm act-toolcache</code> xoá nó</span></div>
<div class="kv"><span class="k">lời cảnh báo M1</span><span class="v">act cảnh báo trên chip Apple rằng bạn chưa chọn <code>--container-architecture</code>. Để nguyên kiến trúc gốc (arm64) thì ổn với Node; dùng <code>linux/amd64</code> khi cú hỏng phụ thuộc vào tệp nhị phân x64</span></div>
<div class="kv"><span class="k">khác biệt nhỏ</span><span class="v">act chạy khối <code>run:</code> từ một tệp script riêng của nó, nên một lỗi shell trong act ghi <code>line 2</code> ở chỗ GitHub ghi <code>line 1</code> — đo trên job <code>eslnt</code>. Đừng đuổi theo chuyện lệch số dòng</span></div>
</div>

<h3>Công cụ rẻ hơn: chạy đúng lệnh trong đúng ảnh</h3>
${slide('ga-08', 19, 'docker run với ảnh của nhánh đỏ tái lập lỗi trong vài giây, và kiểm từng vòng vá')}
<p>Khi bạn đã biết bước nào hỏng và trên phiên bản nào, bạn không cần một trình chạy workflow nào cả. Nhánh đỏ chạy <code>npm test</code> trên Node 20, vậy hãy chạy <code>npm test</code> trên Node 20:</p>
<div class="out">$ docker run --rm -v "$PWD":/app:ro -w /app node:20-slim sh -c 'node --version; npm test'
v20.20.2
Could not find '/app/test-that/*.test.js'</div>
<p>Đó là toàn bộ phép tái lập: một dòng, vài giây, cùng một lỗi. Mỗi tuỳ chọn làm một việc: <code>--rm</code> để không để lại container nào, <code>:ro</code> để lệnh không ghi được vào cây làm việc của bạn (một bản dựng tạo <code>node_modules</code> dưới quyền root ngay trong thư mục bạn là một mớ rắc rối riêng), và một thẻ ảnh khớp với nhánh — <code>node:20-slim</code> cho nhánh Node 20. Bài 8.5 dùng đúng lệnh này để kiểm từng vòng vá TRƯỚC khi push. Muốn bắt chước tài nguyên của runner thì thêm vào: <code>--cpus 3 -m 7g</code> xấp xỉ ngân sách của runner macOS, và <code>-m 7g</code> cũng sẽ đổi heap mặc định của Node, như đã đo ở trên.</p>

<h3>act, docker run, hay runner thật?</h3>
${slide('ga-08', 20, 'act để lặp nhanh trên workflow, docker run để tái lập một lệnh, runner để xác nhận')}
<table>
<thead><tr><th>Câu hỏi bạn đang trả lời</th><th>Công cụ tốt nhất</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>YAML có đọc được không? <code>needs:</code>/<code>if:</code>/ma trận có nối đúng không?</td><td>actionlint, rồi act</td><td>vài giây, không commit, không tốn phút</td></tr>
<tr><td>Vì sao <code>npm test</code> hỏng trên Node 20?</td><td><code>docker run node:20-slim</code></td><td>cái LỆNH mới là cú hỏng; workflow không liên quan</td></tr>
<tr><td>Nó có hỏng với ngân sách bộ nhớ của runner không?</td><td><code>docker run -m 7g --cpus 3</code>, hoặc <code>--max-old-space-size</code></td><td>bóp máy bạn cho khớp (phần trên của bài)</td></tr>
<tr><td>Chỉ hỏng trên macOS hay Windows?</td><td>runner thật</td><td>không gì ở máy bắt chước được một hệ điều hành khác</td></tr>
<tr><td>Có dính secret, OIDC, cache, artifact, concurrency không?</td><td>runner thật</td><td>act chỉ mô phỏng các thứ này, hoặc cần bạn tự đưa vào (<code>-s TEN</code>)</td></tr>
<tr><td>Bản vá đã xong chưa?</td><td>runner thật, SAU một lần tái lập ở máy</td><td>lần chạy xanh để xác nhận; lần tái lập ở máy mới là bằng chứng (8.5)</td></tr>
</tbody>
</table>
<div class="pitfall">
<p><strong>Bẫy — đẩy commit "gỡ lỗi" làm vòng lặp tái lập.</strong> Mỗi lần push tốn thời gian chờ hàng đợi cộng một lần chạy đầy đủ (141 tới 555 giây ở kho này), làm bẩn lịch sử, và trên một nhánh dùng chung thì kích hoạt workflow của mọi người. Các cách thay thế đo ở đây tốn 45 giây (act) và khoảng một giây (docker run, đo được 1,2 s). Hãy push lên CI khi câu hỏi là thứ CHỈ CI trả lời được — một hệ điều hành khác, một secret thật, một cache thật — và ghi rõ điều đó trong commit message.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Một bản dựng qua trên máy bạn mà hỏng trên CI. Bạn tiếp cận thế nào?</strong><br>Đ: Tôi gọi tên khác biệt giữa hai cỗ máy: hệ điều hành, kiến trúc, phiên bản công cụ, bộ nhớ, CPU, mạng, biến môi trường. Mã thoát và bước hỏng thường chỉ vào một cái. Rồi tôi tái lập ở máy bằng cách làm máy mình KHỚP — cùng ảnh container, cùng phiên bản Node, cùng giới hạn bộ nhớ — và chỉ khi không khớp được (hệ điều hành khác, secret thật) tôi mới lặp trên CI, với một bước chẩn đoán in ra cỗ máy.</p>
<p><strong>H: act là gì, và nó KHÔNG làm được gì?</strong><br>Đ: act chạy workflow GitHub Actions ở máy trong các container Docker. Nó tốt để lặp trên cấu trúc workflow và để tái lập các cú hỏng của lệnh trên Linux. Mặc định nó không dùng ảnh runner của GitHub, không chạy được job macOS hay Windows, và chỉ mô phỏng các dịch vụ như cache, artifact, OIDC — nên một lần act xanh không chứng minh một lần GitHub xanh.</p>
<p><strong>H: Vì sao cùng một bản dựng Node lại chỉ hết bộ nhớ trên runner macOS?</strong><br>Đ: Vì trần heap mặc định của Node đi theo bộ nhớ máy. Trên các runner tiêu chuẩn tôi đo được 4.144 MB trên Linux và Windows, 2.096 MB trên macOS. Tôi sẽ in trần ấy ra trong job, rồi hoặc giảm đỉnh bộ nhớ, hoặc đặt tường minh <code>--max-old-space-size</code> trong phạm vi RAM của runner.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> CI của bạn có một nhánh ma trận bạn không giải thích được. Trước lần push kế tiếp, bạn muốn biết nó chạy trên cỗ máy nào và tái lập được lệnh của nó trên laptop.</p><ol>
<li>Thêm bước "máy này là máy nào" của bài (kèm dòng heap) vào một workflow trong kho thử, với ma trận <code>ubuntu-24.04</code> và <code>macos-15</code>. Push một lần và ghi lại hai trần heap.</li>
<li>Thêm một nhánh ma trận <code>node-version: 20</code> chạy một bài test dùng tính năng chỉ có từ Node 22 (ví dụ <code>[1,2].values().map(x =&gt; x).toArray()</code>). Push và xác nhận nhánh ấy đỏ.</li>
<li>Tái lập nó ở máy bằng một dòng: <code>docker run --rm -v "$PWD":/app:ro -w /app node:20-slim npm test</code>.</li>
<li>Tuỳ chọn: cài act, chạy <code>act -j &lt;job&gt; --matrix node-version:20 --rm</code>, rồi so dòng lỗi của nó với của GitHub. Xong thì chạy <code>docker volume rm act-toolcache</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có hai con số heap từ runner thật (kỳ vọng khoảng 4.144 và 2.096 MB); dòng <code>docker run</code> in ra ĐÚNG lỗi của nhánh đỏ; và bạn không push commit nào chỉ để thêm log.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runner image (ảnh runner)</span><span class="v">Ảnh hệ điều hành mà runner do GitHub cấp khởi động từ đó, kèm công cụ cài sẵn. Nó có số phiên bản (vd ubuntu24 20260920.314.1) in trong "Set up job".</span></div>
  <div class="kv"><span class="k">Reproduction (tái lập)</span><span class="v">Làm cú hỏng xảy ra theo ý muốn, trên một máy bạn kiểm soát, dưới ĐÚNG điều kiện đã gây ra nó trên CI.</span></div>
  <div class="kv"><span class="k">act</span><span class="v">Công cụ chạy workflow ở máy trong Docker. Nhanh cho cấu trúc workflow; không giống hệt runner của GitHub.</span></div>
  <div class="kv"><span class="k"><code>-P</code> (ánh xạ nền tảng)</span><span class="v">Tuỳ chọn của act để chọn ảnh container nào đóng vai một nhãn <code>runs-on</code>.</span></div>
  <div class="kv"><span class="k">Giới hạn bộ nhớ cgroup</span><span class="v">Trần bộ nhớ một container nhận (<code>docker run -m</code>). Node đọc nó khi chọn heap mặc định.</span></div>
  <div class="kv"><span class="k">Trần heap mặc định</span><span class="v">Giới hạn V8 mà Node tự chọn khi không có cờ: 4.144 MB trên runner 16 GB, 2.096 MB trên runner macOS 7 GB (đo 09/2026).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trên runner do GitHub cấp (kho công khai): ubuntu và windows 4 nhân / 16 GB, macOS 3 nhân / 7 GB — khớp tài liệu.</li>
<li>Heap mặc định của Node 22 là 4.144 MB trên runner Linux/Windows và 2.096 MB trên macOS; con số "8.240 MB" trước đây của bài không tái lập được và đã được đính chính.</li>
<li>In cỗ máy và trần heap ra trong job — một bước, vài mili giây, và nó trả lời câu hỏi đầu tiên của mọi con 134.</li>
<li><code>docker run --rm</code> với ảnh của nhánh đỏ tái lập một cú hỏng của lệnh trong vài giây.</li>
<li>act tái lập cú hỏng Node 20 của chương trong ~45 s; nó vẫn không phải ảnh, hệ điều hành hay dịch vụ của GitHub.</li>
<li>Chỉ push lên CI cho những gì CHỈ CI trả lời được.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36011171685 — ba runner tự khai về mình</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011171685 — số nhân, RAM, đĩa trống, phiên bản ảnh và trần heap V8 mặc định trên ubuntu-24.04, macos-15 và windows-2025.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub-hosted runners reference</span><span class="lc-sub">docs.github.com/en/actions/reference/runners/github-hosted-runners — bảng runner tiêu chuẩn cho kho công khai: 4 CPU / 16 GB / 14 GB SSD trên Linux và Windows, 3 CPU (M1) / 7 GB trên macOS arm64.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — ảnh dùng được và cấu hình</span><span class="lc-sub">github.com/actions/runner-images#available-images — bảng phần cứng theo từng nhãn trích bên trên, và nhật ký thay đổi theo từng ảnh giải thích những cú thoái lui không-có-commit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — v8.getHeapStatistics()</span><span class="lc-sub">nodejs.org/api/v8.html#v8getheapstatistics — lời gọi một dòng đã bác bỏ phỏng đoán bên trên, và những bộ đếm heap khác đáng in ra khi một bản dựng đang ở gần một cái trần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nektos/act — chạy workflow ở máy</span><span class="lc-sub">github.com/nektos/act — hữu ích để lặp trên cấu trúc workflow mà không phải đẩy commit; tường minh KHÔNG phải một bản tái lập môi trường do GitHub cấp, đó là lời lưu ý bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — bóp bộ nhớ và CPU để tái lập một cú hỏng production</span><span class="lc-sub">/courses/docker/learn${REF} — <code>-m</code>, <code>--cpus</code> và cgroup, kèm một ca đo được nơi giới hạn 512 MB tái lập được một sự cố mà một cái laptop thì không.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — cỗ máy nhỏ, và phần swap che mất một cú OOM</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — đo áp lực bộ nhớ TRONG LÚC nó đang xảy ra chứ không phải sau đó, gồm cả một kết quả rỗng do đọc bộ đếm quá muộn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Reading a run in triage order|||8.4 — Đọc một lần chạy theo thứ tự phân loại',
      slug: 'ga-8-4-thu-tu-doc',
      type: 'VIDEO',
      description: 'Không mở log ngay. Thứ tự đúng: nhìn thời lượng, nhìn KHÔNG có gì hỏng, nhìn ma trận, nhìn hai dòng cuối, rồi mới đọc log. Sáu bước, mỗi bước có thể GIẢI QUYẾT XONG cuộc điều tra và tiết kiệm phần đọc phía sau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Reading a run in triage order</h2>
<p class="lead">A red build is a request to read a log, and reading a log is the last thing to do. Six steps come before it, each one cheap enough to run in seconds and any one of which can settle the investigation before it starts.</p>

<h3>The six steps, in order</h3>
${slide('ga-08', 21, 'The decision tree: annotation, first red job, red step, then the real error line above the bottom')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">the duration</span><span class="lz-d">7.3: short means it bailed, normal means it ran, long means it hung. This is one number and it points at where in the log to look</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">what did NOT fail</span><span class="lz-d">skipped jobs propagate from a real failure and are not the story. Their count tells you how far into the chain the failure reached</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">the matrix</span><span class="lz-d">one leg red and others green means a platform difference (8.3). All legs red means a shared cause upstream</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">the exit code, from the last error line</span><span class="lz-d">8.1: 127 was never found, 134 was heap, 137 was killed. This alone often names the fix</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">the diff</span><span class="lz-d">what changed since the last green run. This is the git log entry, not the workflow log</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">the step&#39;s log, only now</span><span class="lz-d">and you already know what to look for</span></div>
</div>

<h3>Applied to the one failure this course has</h3>
<div class="out">Run 32400097927, desktop-release

1. thoi luong: 334s (TB thanh cong 458s)  -> hong GIUA CHUNG, khong som
2. khong hong: kiem tra ma, dung Linux, dung Windows  -> ba job xanh
3. ma tran: CHI macOS do  -> khac biet nen tang, khong phai chung ha nguon
4. ma thoat: 134  -> V8 het heap
5. diff: khong doi buoc dung, khong nang dep
6. log: FATAL ERROR: Reached heap limit — JavaScript heap out of memory</div>

<div class="callout ok">
<p><strong>Steps 1 through 4 arrived at "the macOS build ran out of memory in V8" without opening a log.</strong> Step 6 confirmed it in one line. This is the shape triage should take: each earlier step is cheaper and eliminates a category, so by the time you open the log you know which twenty lines to read.</p>
</div>

<h3>What each step actually looks at</h3>
<div class="kv-grid">
<div class="kv"><span class="k">1 — duration</span><span class="v">on the run list. No click needed. Compare to the median of the last ten runs, not to memory</span></div>
<div class="kv"><span class="k">2 — the run summary</span><span class="v">the top of the run page shows every job with its result. Failed and skipped are different symbols; count each</span></div>
<div class="kv"><span class="k">3 — the matrix column</span><span class="v">if there is a matrix, jobs are grouped by it. One column red is a fingerprint that names the axis: which platform, which Node version, which shard</span></div>
<div class="kv"><span class="k">4 — the failed step</span><span class="v">click into the failed job. The last log group is the one that failed, and the very last line of it is the exit code</span></div>
<div class="kv"><span class="k">5 — the commit range</span><span class="v">the run page shows the head commit. Compare to the last green run on the same branch. Small diff, easy diagnosis; large diff, use bisection</span></div>
<div class="kv"><span class="k">6 — the log, from the bottom</span><span class="v">real errors are near the bottom. The middle of a log is setup, and the top is receipts</span></div>
</div>

<h3>The same order as a decision tree you can use today</h3>
<p>The six steps are the complete method. On most days a shorter path covers it, and the slide above draws it as four levels, each with a branch that can end the investigation early:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">① annotation</span><span class="lz-t">bottom of the run page, or <code>gh run view ID</code></span><span class="lz-d">the exit code or the timeout sentence for every failed job at once. No exit code at all → it was cancelled or timed out; find out who (a person, fail-fast, concurrency, <code>timeout-minutes</code>)</span></div>
<div class="lz-step"><span class="lz-k">② first red job</span><span class="lz-t">the job graph</span><span class="lz-d">skip grey (skipped) jobs and jobs that are red only because of <code>needs:</code>. One matrix leg red while its siblings are green → a platform or version difference; go to lesson 8.3</span></div>
<div class="lz-step"><span class="lz-k">③ red step</span><span class="lz-t">inside that job</span><span class="lz-d">the step with ✗; the steps after it show "-" because they never ran. 127/126/2 here means the program never ran — fix the command, the file mode or the syntax</span></div>
<div class="lz-step"><span class="lz-k">④ the real error line</span><span class="lz-t">above the <code>##[error]</code> line</span><span class="lz-d">the bottom is the summary; the cause is higher up. If the same test name has failed on other runs, it is not a flake — do not press re-run</span></div>
</div>
<p>Only after level ④ does it make sense to open the full log, re-run with debug, or reproduce locally. The next four sections take each level in turn on the sandbox runs from this chapter.</p>

<h3>Level ②: the earliest red, and the grey that follows it</h3>
${slide('ga-08', 22, 'Job graph of run 36011088185: one red matrix leg, two green, and two grey jobs that are only its consequence')}
<p><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185" target="_blank" rel="noopener">Run 36011088185</a> is a small, realistic pipeline: <code>lint</code> → <code>test</code> on a Node 20/22/24 matrix → <code>build</code> → <code>deploy</code>. One box is red — <code>test (20)</code>. <code>build</code> and <code>deploy</code> are grey with the ⊘ symbol: skipped, because a job with <code>needs:</code> runs only when everything it needs succeeded. They are not failures, and there is nothing to read in them. The two green legs matter just as much: they say the code and the test are fine on 22 and 24, so the question is narrowed to "what does Node 20 lack?" before any log is opened.</p>
<p>Notice also what fail-fast did <em>not</em> do. The matrix used the default <code>fail-fast: true</code>, which cancels the remaining legs when one fails. Here the 22 and 24 legs finished in 7 seconds and the 20 leg failed at 11, so there was nothing left to cancel. On a slower suite you would see the siblings marked cancelled instead of green — and then the matrix tells you less, because you no longer know whether they would have passed. When you are diagnosing, <code>fail-fast: false</code> buys information.</p>

<h3>Level ③ from the terminal: <code>gh run view --log-failed</code></h3>
${slide('ga-08', 23, 'gh run view shows the red job and step with annotations; --log-failed prints only the failed steps')}
<p>Everything in levels ①–③ is available without a browser, which matters when you are triaging from a terminal or writing a script:</p>
<div class="out">$ gh run view 36011088185
X test (20) in 11s (ID 107671726176)
  ✓ Set up job
  ✓ Run actions/checkout@v5
  ✓ Run actions/setup-node@v5
  ✓ Run node --version
  X Run npm test
  - Post Run actions/setup-node@v5
- build (ID 107671857421)
- deploy in 0s (ID 107671857718)

ANNOTATIONS
X Process completed with exit code 1.
test (20): .github#10

$ gh run view 36011088185 --log-failed
test (20)  Run npm test  ##[group]Run npm test
test (20)  Run npm test  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
test (20)  Run npm test  &gt; node --test "test-that/*.test.js"
test (20)  Run npm test  Could not find '/home/runner/work/ga-san-tap/ga-san-tap/ch08/app/test-that/*.test.js'
test (20)  Run npm test  ##[error]Process completed with exit code 1.</div>
<p><code>--log-failed</code> printed 10 lines for this run instead of the whole job log — only the steps that failed, each line prefixed with the job and step name. For a larger log, combine it with <code>grep</code>: the line you want is just above <code>##[error]</code>, and <code>grep -F</code> avoids having to escape the brackets:</p>
<pre><code>gh run view RUN_ID --log-failed | grep -F -B 25 "##[error]"      # 25 lines of context above each error
gh run view --job JOB_ID --log | grep -n -F "not ok"             # jump to failing node:test cases
gh api repos/OWNER/REPO/check-runs/JOB_ID/annotations           # the annotations as JSON</code></pre>
<p>The last command returns annotations with file and line. On the <code>lint</code> job of run 36011088172, which turned shellcheck output into <code>::error file=…,line=…::</code> commands, it returned:</p>
<div class="out">.github                          12  failure  Process completed with exit code 1.
ch08/app/scripts/trien-khai.sh   5   failure  Double quote to prevent globbing and word splitting. [SC2086]
ch08/app/scripts/trien-khai.sh   4   failure  Double quote to prevent globbing and word splitting. [SC2086]
ch08/app/scripts/trien-khai.sh   4   failure  Use 'cd ... || exit' or 'cd ... || return' in case cd fails. [SC2164]</div>
<p>That is the most useful trick for making your own failures readable at level ①: any tool that prints file and line can be turned into annotations with one <code>sed</code>, and they then appear on the run page and next to the code in a pull request. The pipe in that step is also the reason this lesson series keeps insisting on <code>shell: bash</code> — without <code>pipefail</code>, <code>shellcheck … | sed …</code> would have exited 0 and the job would have been green with four errors printed.</p>
<pre><code class="language-yaml">      - name: shellcheck, as annotations
        shell: bash          # pipefail: the job fails if shellcheck fails
        run: |
          shellcheck -f gcc scripts/trien-khai.sh \\
            | sed -E 's/^([^:]+):([0-9]+):([0-9]+): ([a-z]+): (.*)$/::error file=\\1,line=\\2,col=\\3::\\5/'</code></pre>

<h3>Level ④: the real error line is above the bottom</h3>
${slide('ga-08', 24, 'A real 502-line log from api-backend: the failing test is at line 116, the bottom only says "# fail 1"')}
<p>The instinct "real errors are near the bottom" from the table above is right for a crash and wrong for a test runner. Here is a real failure from this course&#39;s own repository — api-backend run 32243769111, 19 August 2026, step "Unit tests — money math + payment signature". <code>--log-failed</code> gives 502 lines. The bottom is:</p>
<div class="out"># tests 69
# pass 68
# fail 1
# duration_ms 3341.605258
##[error]Process completed with exit code 1.</div>
<p>That tells you <em>that</em> one of 69 tests failed and nothing about which. The failure itself is at line 116:</p>
<div class="out">not ok 15 - chạm trần token thì VIẾT TIẾP, không trả về câu cụt
  location: '/home/runner/work/api-backend/api-backend/src/services/agent/vietTiepLuot.test.ts:3:230'
  error: &#96;không có khung 'done'. Sự kiện: ["error"]&#96;
  stack: |-
    TestContext.&lt;anonymous&gt; (…/vietTiepLuot.test.ts:63:10)</div>
<p>Every test runner has its own marker for "this one failed", and knowing it is the difference between reading 502 lines and reading one:</p>
<table>
<thead><tr><th>Tool</th><th>Search the log for</th></tr></thead>
<tbody>
<tr><td><code>node --test</code> (TAP)</td><td><code>not ok</code></td></tr>
<tr><td>Jest / Vitest</td><td><code>FAIL</code>, <code>●</code> (Jest), <code>×</code> or <code>AssertionError</code></td></tr>
<tr><td><code>tsc</code></td><td><code>error TS</code></td></tr>
<tr><td>ESLint</td><td><code>error</code> with a file path above it; <code>✖ N problems</code> is the summary</td></tr>
<tr><td>npm itself</td><td><code>npm error</code> (and <code>ERR!</code> in older npm)</td></tr>
<tr><td>Docker build</td><td><code>ERROR [</code> — the stage and step that failed</td></tr>
<tr><td>A crash</td><td>the first <code>Error:</code> or <code>FATAL</code>; everything after it is consequence</td></tr>
</tbody>
</table>
<div class="callout">
<p><strong>"Real errors are near the bottom" and "the real error line is above the bottom" are both true.</strong> The first is about which <em>part</em> of a log to read (not the setup at the top); the second is about which <em>line</em> in that part (not the summary at the end). Read the failed step, from the <code>##[error]</code> line upwards, until you reach the first line that names a specific file, test or command.</p>
</div>

<h3>When the log is not enough: debug logging</h3>
${slide('ga-08', 25, 'Re-running with --debug adds ##[debug] lines: how if: was evaluated, which defaults applied, which shell ran')}
<p>Sometimes levels ①–④ leave you with "the step ran, but not the way I expected": an <code>if:</code> that should have been false, an input that did not arrive, a <code>working-directory</code> you did not intend. That is what debug logging is for. The sandbox pipeline&#39;s failed leg was re-run with <code>gh run rerun 36011088185 --failed --debug</code>, and the failed step gained twelve lines like these:</p>
<div class="out">##[debug]Evaluating condition for step: 'Run npm test'
##[debug]Evaluating: success()
##[debug]Evaluating success:
##[debug]=&gt; true
##[debug]Result: true
##[debug]Starting: Run npm test
##[debug]Loading inputs
##[debug]Loading env
##[debug]Overwrite 'working-directory' base on job defaults.
##[debug]Overwrite 'shell' base on job defaults.
##[debug]/usr/bin/bash --noprofile --norc -e -o pipefail /home/runner/work/_temp/db6d4064-….sh
##[debug]Finishing: Run npm test</div>
<p>Each line answers a question the ordinary log does not: the condition that decided whether the step ran and its value, that the <code>defaults:</code> block supplied the working directory and shell, and the exact command line of the shell. There are three ways to turn it on, per the documentation (as of 09/2026):</p>
<div class="kv-grid">
<div class="kv"><span class="k">for one re-run</span><span class="v">tick "Enable debug logging" in the re-run dialog, or <code>gh run rerun ID --debug</code> (with <code>--failed</code> or <code>--job</code> to narrow it). Nothing is left switched on afterwards — the safest way</span></div>
<div class="kv"><span class="k">for every run: step debug</span><span class="v">a repository secret or variable <code>ACTIONS_STEP_DEBUG</code> set to <code>true</code>. If both exist, the secret wins. Remember to delete it — every run of every workflow in the repository gets louder while it is set</span></div>
<div class="kv"><span class="k">for every run: runner diagnostics</span><span class="v"><code>ACTIONS_RUNNER_DEBUG=true</code> adds two diagnostic log files for the runner and worker processes, downloadable in the run&#39;s log archive. Useful for runner-level trouble, rarely for your code</span></div>
</div>
<div class="callout warn">
<p><strong>Debug logging explains the workflow, not your program.</strong> It will not make a failing test print more; for that, use the tool&#39;s own verbose option (<code>--verbose</code>, <code>DEBUG=*</code>, <code>npm --loglevel verbose</code>). And the repository-wide switches affect everyone&#39;s runs: in a shared repository, prefer the one-off <code>--debug</code> re-run, which is exactly why this chapter used it instead of setting a variable on the shared sandbox.</p>
</div>
<h3>Two shortcuts that break the order</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">opening the log first</span><span class="lz-lnote">the default action, and it produces the reader who spends fifteen minutes on a stack trace from a job that was skipped. Steps 1–3 rule out the skipped jobs before the log tempts you</span></div>
<div class="lz-layer"><span class="lz-lname">re-running before reading</span><span class="lz-lnote">8.2 measured what that tells you: for a 20% flake, nothing. For a real failure, nothing plus one more run. The button is a repair, not a diagnosis</span></div>
<div class="lz-layer"><span class="lz-lname">searching the log for "error"</span><span class="lz-lnote">many green steps print the word. The last <code>##[error]</code> line names the exit code and the failing step, and that is what you want. Search for <code>##[error]</code></span></div>
<div class="lz-layer"><span class="lz-lname">reading someone else&#39;s log first</span><span class="lz-lnote">a similar-looking previous failure is only similar-looking. Read your run first, and only then compare — otherwise you have imported their diagnosis into yours</span></div>
</div>

<h3>Where the six steps break down</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a step exited 0 but wrote errors</span><span class="v">step 4 gives you 0 and nothing to work with. This is the <code>pipefail</code>-missing case from 2.4: the shell hid the failure. The fix is in the shell, not in this run</span></div>
<div class="kv"><span class="k">the job was cancelled</span><span class="v">no exit code at all — the step log says "The operation was canceled." (this row first said exit 143; lesson 8.1 measured the cancel and found SIGINT and no exit code). The "failure" is really "somebody cancelled it, or fail-fast, concurrency or a job timeout did" — the annotation says which. Step 3 reveals the fail-fast case: a leg cancelled while its siblings ran is what fail-fast leaves</span></div>
<div class="kv"><span class="k">the runner died</span><span class="v">no exit code at all, and the log ends abruptly. The run page shows "The runner has received a shutdown signal" — infrastructure, not code. Re-run once</span></div>
<div class="kv"><span class="k">a step timed out</span><span class="v">the runner injects an error and the last line is a timeout notice. Step 1 catches this too — the duration is at the ceiling</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating a failed downstream job as the failure.</strong> A red publish job with three red build jobs upstream has one failure, not four. The build jobs failed for their own reasons; the publish job failed because its <code>needs:</code> did not succeed. Read the earliest failure in the chain, not the loudest one — which is usually the one at the end.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Read the run before the log: the duration says how, the skipped jobs say where the failure did not spread to, the matrix says which axis differs, and the exit code names the cause — so by the time you are looking at text, you are looking at the right twenty lines.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: Walk me through what you do when the CI pipeline goes red on your pull request.</strong><br>A: I read the run before the log. The annotations give me the exit code or timeout for each failed job. In the job graph I find the earliest red job and ignore the skipped ones downstream; if only one matrix leg is red, it is an environment difference. Inside the job I go to the failed step and read upwards from the <code>##[error]</code> line to the first line that names a test, file or command. I check whether that test has failed before. Only then do I reproduce locally or re-run — and I re-run only if the error names infrastructure.</p>
<p><strong>Q: How do you make your own CI failures easier to read?</strong><br>A: I make the failure print where it is: tools that emit file and line become <code>::error file=…,line=…::</code> annotations; I use <code>shell: bash</code> so pipes do not hide failures; I put a short summary in <code>$GITHUB_STEP_SUMMARY</code>; and I add a step that prints the machine and tool versions.</p>
<p><strong>Q: What is <code>ACTIONS_STEP_DEBUG</code>?</strong><br>A: A secret or variable that turns on step debug logging for every run, showing how conditions were evaluated and which defaults applied. For a single investigation I prefer "Re-run with debug logging", which does the same for one attempt and leaves nothing switched on.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want to be able to triage a red run in under two minutes without opening a browser.</p><ol>
<li>Take any red run from your own repository (or from the practice in lesson 8.1). Run <code>gh run view ID</code> and write down: the exit code from the annotation, the first red job, the red step.</li>
<li>Run <code>gh run view ID --log-failed | grep -F -B 25 "##[error]"</code> and find the first line above it that names a specific test, file or command.</li>
<li>Add a lint step that turns <code>shellcheck -f gcc</code> output into <code>::error file=…,line=…::</code> annotations (the YAML in this lesson), push a script with an unquoted variable, and check that the annotation appears on the run page and in <code>gh api …/check-runs/JOB_ID/annotations</code>.</li>
<li>Re-run a failed job with <code>gh run rerun ID --failed --debug</code> and find the <code>##[debug]Evaluating</code> line for the failed step.</li></ol>
<p><strong>Done when:</strong> you can state exit code, job, step and the real error line for a red run using only the terminal; your own annotation shows the file and line of the shellcheck warning; and you found the debug line showing how the failed step&#39;s <code>if:</code> was evaluated.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Triage (phân loại)</span><span class="v">Deciding what kind of failure you have, and where to look, before investigating in depth.</span></div>
  <div class="kv"><span class="k">Job graph (đồ thị job)</span><span class="v">The run page&#39;s diagram of jobs and their <code>needs:</code> edges. Red ✗ failed, grey ⊘ skipped.</span></div>
  <div class="kv"><span class="k"><code>--log-failed</code></span><span class="v"><code>gh run view</code> option that prints only the logs of failed steps, prefixed with job and step names.</span></div>
  <div class="kv"><span class="k"><code>::error file=,line=::</code></span><span class="v">Workflow command that creates an annotation attached to a file and line.</span></div>
  <div class="kv"><span class="k">Debug logging (log gỡ lỗi)</span><span class="v">Extra <code>##[debug]</code> lines from the runner; on for one re-run, or for all runs via <code>ACTIONS_STEP_DEBUG</code>.</span></div>
  <div class="kv"><span class="k"><code>fail-fast</code></span><span class="v">Matrix option (default true) that cancels remaining legs when one fails — turn it off to see every leg&#39;s result.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four levels: annotation → first red job → red step → the real error line above <code>##[error]</code>.</li>
<li>Grey (skipped) jobs are consequences of <code>needs:</code>; one red matrix leg among green ones names an environment difference.</li>
<li><code>gh run view</code> and <code>--log-failed</code> give all of it from a terminal; <code>grep -F -B 25 "##[error]"</code> finds the line.</li>
<li>Test runners summarise at the bottom — search for their failure marker (<code>not ok</code>, <code>FAIL</code>, <code>error TS</code>).</li>
<li>Make your own tools produce annotations, and keep <code>pipefail</code> so a pipe cannot hide the failure.</li>
<li>Debug logging explains the workflow&#39;s decisions; prefer the one-off <code>--debug</code> re-run.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36011088185 — the pipeline with one red matrix leg (attempt 2 with debug logging)</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185 — the job graph used for level ②, and the <code>##[debug]</code> lines of the <code>--debug</code> re-run.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Enabling debug logging</span><span class="lc-sub">docs.github.com/en/actions/how-tos/monitor-workflows/enable-debug-logging — <code>ACTIONS_STEP_DEBUG</code> and <code>ACTIONS_RUNNER_DEBUG</code> as secrets or variables, precedence, and re-running with debug logging.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About monitoring and troubleshooting</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows — the UI features that support the six steps above: the run summary, per-job status, and the log group markers that let you jump to the failure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: ::error:: and ::warning::</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — how a step signals its failure so step 4 finds it, and what to write in your own scripts so the fifth step reader knows what happened.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Downloading logs</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs — the raw log zip, for the rare case that the UI truncates before the interesting line.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — reading an incident from the tail of a log</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same triage order applied to a production incident, including a case where step 1 was enough.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — read from the bottom</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the general log-reading discipline, including why <code>less +G</code> is worth memorising.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Đọc một lần chạy theo thứ tự phân loại</h2>
<p class="lead">Một bản dựng đỏ là một lời đề nghị bạn đọc log, và đọc log là việc CUỐI CÙNG cần làm. Sáu bước tới trước nó, mỗi bước rẻ tới mức làm được trong vài giây và bất cứ bước nào cũng có thể giải quyết xong cuộc điều tra trước khi nó bắt đầu.</p>

<h3>Sáu bước, theo thứ tự</h3>
${slide('ga-08', 21, 'Cây quyết định: annotation, job đỏ đầu tiên, bước đỏ, rồi dòng lỗi thật nằm phía trên đáy')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">thời lượng</span><span class="lz-d">bài 7.3: ngắn nghĩa là bỏ cuộc, bình thường nghĩa là có chạy, dài nghĩa là treo. Đây là một con số và nó chỉ chỗ đọc trong log</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cái gì KHÔNG hỏng</span><span class="lz-d">các job bị bỏ qua LAN TRUYỀN từ một cú hỏng thật và không phải câu chuyện. Số lượng của chúng cho biết cú hỏng lan sâu tới đâu trong chuỗi</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ma trận</span><span class="lz-d">một nhánh đỏ, các nhánh khác xanh nghĩa là khác biệt nền tảng (bài 8.3). Cả ma trận đỏ nghĩa là nguyên nhân CHUNG ở thượng nguồn</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">mã thoát, từ dòng lỗi cuối</span><span class="lz-d">bài 8.1: 127 nghĩa là chưa bao giờ tìm thấy, 134 là heap, 137 là bị giết. Riêng cái này thường gọi tên được bản vá</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">diff</span><span class="lz-d">cái gì đã đổi kể từ lần chạy xanh gần nhất. Đây là mục trong git log, không phải log workflow</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">log của bước, chỉ tới lúc này</span><span class="lz-d">và bạn đã biết mình đang tìm gì</span></div>
</div>

<h3>Áp lên cú hỏng duy nhất khoá học này có</h3>
<div class="out">Run 32400097927, desktop-release

1. thoi luong: 334s (TB thanh cong 458s)  -> hong GIUA CHUNG, khong som
2. khong hong: kiem tra ma, dung Linux, dung Windows  -> ba job xanh
3. ma tran: CHI macOS do  -> khac biet nen tang, khong phai chung ha nguon
4. ma thoat: 134  -> V8 het heap
5. diff: khong doi buoc dung, khong nang dep
6. log: FATAL ERROR: Reached heap limit — JavaScript heap out of memory</div>

<div class="callout ok">
<p><strong>Bước 1 tới 4 đã đưa tới "bản dựng macOS cạn bộ nhớ trong V8" mà không mở một cái log nào.</strong> Bước 6 xác nhận nó bằng một dòng. Đây là hình dạng mà phân loại NÊN có: mỗi bước sớm hơn thì RẺ hơn và loại được một hạng mục, nên tới lúc bạn đang nhìn chữ thì bạn đang nhìn đúng hai mươi dòng cần đọc.</p>
</div>

<h3>Từng bước thật ra nhìn vào đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">1 — thời lượng</span><span class="v">có sẵn trên danh sách lần chạy. Không cần click. So với trung vị của mười lần chạy gần nhất, không so với trí nhớ</span></div>
<div class="kv"><span class="k">2 — bản tóm tắt lần chạy</span><span class="v">phần đầu trang lần chạy hiện MỌI job kèm kết quả. Hỏng và bỏ qua là hai ký hiệu KHÁC NHAU; hãy đếm từng loại</span></div>
<div class="kv"><span class="k">3 — cột ma trận</span><span class="v">nếu có ma trận, các job được nhóm theo nó. Một cột đỏ là một dấu vân tay gọi tên cái trục: nền tảng nào, phiên bản Node nào, mảnh sharding nào</span></div>
<div class="kv"><span class="k">4 — bước hỏng</span><span class="v">click vào job hỏng. Nhóm log CUỐI là nhóm đã hỏng, và dòng CUỐI CÙNG của nó là mã thoát</span></div>
<div class="kv"><span class="k">5 — khoảng commit</span><span class="v">trang lần chạy hiện commit đầu. So với lần chạy xanh gần nhất trên CÙNG nhánh. Diff nhỏ, chẩn đoán dễ; diff lớn, dùng bisection</span></div>
<div class="kv"><span class="k">6 — log, đọc TỪ DƯỚI LÊN</span><span class="v">lỗi thật nằm gần đáy. Giữa log là phần thiết lập, và đầu log là hoá đơn</span></div>
</div>

<h3>Cùng thứ tự ấy, thành một cây quyết định dùng được ngay hôm nay</h3>
<p>Sáu bước là phương pháp đầy đủ. Phần lớn các ngày, một lối ngắn hơn là đủ, và slide bên trên vẽ nó thành bốn bậc, mỗi bậc có một nhánh có thể kết thúc cuộc điều tra sớm:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">① annotation</span><span class="lz-t">cuối trang run, hoặc <code>gh run view ID</code></span><span class="lz-d">mã thoát hoặc câu báo hết giờ của MỌI job hỏng cùng lúc. Không có mã thoát nào → nó bị huỷ hoặc hết giờ; tìm xem ai (một người, fail-fast, concurrency, <code>timeout-minutes</code>)</span></div>
<div class="lz-step"><span class="lz-k">② job đỏ ĐẦU TIÊN</span><span class="lz-t">đồ thị job</span><span class="lz-d">bỏ qua job xám (bị bỏ qua) và job đỏ chỉ vì <code>needs:</code>. Một nhánh ma trận đỏ trong khi anh em nó xanh → khác biệt nền tảng hay phiên bản; sang bài 8.3</span></div>
<div class="lz-step"><span class="lz-k">③ bước đỏ</span><span class="lz-t">bên trong job ấy</span><span class="lz-d">bước có ✗; các bước sau hiện "-" vì chúng chưa hề chạy. 127/126/2 ở đây nghĩa là chương trình chưa hề chạy — sửa lệnh, chế độ tệp, hoặc cú pháp</span></div>
<div class="lz-step"><span class="lz-k">④ dòng lỗi THẬT</span><span class="lz-t">phía TRÊN dòng <code>##[error]</code></span><span class="lz-d">đáy là tổng kết; nguyên nhân nằm cao hơn. Nếu cùng tên bài test ấy đã hỏng ở run khác, nó không phải flake — đừng bấm chạy lại</span></div>
</div>
<p>Chỉ SAU bậc ④ mới đáng mở cả cái log, chạy lại có debug, hay tái lập ở máy. Bốn mục kế tiếp đi qua từng bậc trên các run sân tập của chương này.</p>

<h3>Bậc ②: cái đỏ SỚM nhất, và cái xám đi theo nó</h3>
${slide('ga-08', 22, 'Đồ thị job của run 36011088185: một nhánh ma trận đỏ, hai xanh, và hai job xám chỉ là hệ quả của nó')}
<p><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185" target="_blank" rel="noopener">Run 36011088185</a> là một pipeline nhỏ, sát thực tế: <code>lint</code> → <code>test</code> trên ma trận Node 20/22/24 → <code>build</code> → <code>deploy</code>. Một ô đỏ — <code>test (20)</code>. <code>build</code> và <code>deploy</code> xám với ký hiệu ⊘: bị bỏ qua, vì một job có <code>needs:</code> chỉ chạy khi mọi thứ nó cần đều thành công. Chúng KHÔNG phải cú hỏng, và chẳng có gì để đọc trong chúng. Hai nhánh xanh cũng quan trọng không kém: chúng nói mã và bài test ổn trên 22 và 24, nên câu hỏi đã được thu hẹp thành "Node 20 thiếu cái gì?" trước khi mở bất cứ log nào.</p>
<p>Để ý thêm điều fail-fast đã KHÔNG làm. Ma trận dùng mặc định <code>fail-fast: true</code>, thứ huỷ các nhánh còn lại khi một nhánh hỏng. Ở đây nhánh 22 và 24 xong trong 7 giây còn nhánh 20 hỏng ở giây 11, nên chẳng còn gì để huỷ. Với một bộ test chậm hơn, bạn sẽ thấy các nhánh anh em bị đánh dấu huỷ thay vì xanh — và khi ấy ma trận nói với bạn ít hơn, vì bạn không còn biết chúng lẽ ra có qua hay không. Khi đang chẩn đoán, <code>fail-fast: false</code> mua cho bạn thông tin.</p>

<h3>Bậc ③ từ terminal: <code>gh run view --log-failed</code></h3>
${slide('ga-08', 23, 'gh run view cho thấy job đỏ và bước đỏ kèm annotation; --log-failed chỉ in các bước hỏng')}
<p>Mọi thứ ở bậc ①–③ đều có mà không cần trình duyệt, điều quan trọng khi bạn phân loại từ terminal hoặc viết script:</p>
<div class="out">$ gh run view 36011088185
X test (20) in 11s (ID 107671726176)
  ✓ Set up job
  ✓ Run actions/checkout@v5
  ✓ Run actions/setup-node@v5
  ✓ Run node --version
  X Run npm test
  - Post Run actions/setup-node@v5
- build (ID 107671857421)
- deploy in 0s (ID 107671857718)

ANNOTATIONS
X Process completed with exit code 1.
test (20): .github#10

$ gh run view 36011088185 --log-failed
test (20)  Run npm test  ##[group]Run npm test
test (20)  Run npm test  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
test (20)  Run npm test  &gt; node --test "test-that/*.test.js"
test (20)  Run npm test  Could not find '/home/runner/work/ga-san-tap/ga-san-tap/ch08/app/test-that/*.test.js'
test (20)  Run npm test  ##[error]Process completed with exit code 1.</div>
<p><code>--log-failed</code> in ra 10 dòng cho run này thay vì cả log của job — chỉ các bước đã hỏng, mỗi dòng có tên job và tên bước đứng trước. Với một log dài hơn, kết hợp nó với <code>grep</code>: dòng bạn cần nằm ngay trên <code>##[error]</code>, và <code>grep -F</code> giúp khỏi phải thoát dấu ngoặc vuông:</p>
<pre><code>gh run view RUN_ID --log-failed | grep -F -B 25 "##[error]"      # 25 dòng ngữ cảnh phía trên mỗi lỗi
gh run view --job JOB_ID --log | grep -n -F "not ok"             # nhảy tới các ca node:test hỏng
gh api repos/OWNER/REPO/check-runs/JOB_ID/annotations           # annotation dạng JSON</code></pre>
<p>Lệnh cuối trả về annotation kèm tệp và dòng. Trên job <code>lint</code> của run 36011088172, job đã biến đầu ra của shellcheck thành các lệnh <code>::error file=…,line=…::</code>, nó trả về:</p>
<div class="out">.github                          12  failure  Process completed with exit code 1.
ch08/app/scripts/trien-khai.sh   5   failure  Double quote to prevent globbing and word splitting. [SC2086]
ch08/app/scripts/trien-khai.sh   4   failure  Double quote to prevent globbing and word splitting. [SC2086]
ch08/app/scripts/trien-khai.sh   4   failure  Use 'cd ... || exit' or 'cd ... || return' in case cd fails. [SC2164]</div>
<p>Đó là mẹo hữu ích nhất để làm cho cú hỏng của CHÍNH bạn đọc được ngay ở bậc ①: bất cứ công cụ nào in ra tệp và dòng đều biến được thành annotation bằng một lệnh <code>sed</code>, và khi đó chúng hiện trên trang run và ngay cạnh dòng mã trong pull request. Cái ống trong bước ấy cũng là lý do loạt bài này cứ nhắc <code>shell: bash</code> — thiếu <code>pipefail</code> thì <code>shellcheck … | sed …</code> đã thoát 0 và job đã XANH với bốn lỗi được in ra.</p>
<pre><code class="language-yaml">      - name: shellcheck, thành annotation
        shell: bash          # pipefail: job hỏng nếu shellcheck hỏng
        run: |
          shellcheck -f gcc scripts/trien-khai.sh \\
            | sed -E 's/^([^:]+):([0-9]+):([0-9]+): ([a-z]+): (.*)$/::error file=\\1,line=\\2,col=\\3::\\5/'</code></pre>

<h3>Bậc ④: dòng lỗi THẬT nằm phía trên đáy</h3>
${slide('ga-08', 24, 'Một log thật 502 dòng của api-backend: bài test hỏng ở dòng 116, đáy log chỉ ghi "# fail 1"')}
<p>Bản năng "lỗi thật nằm gần đáy" trong bảng bên trên đúng với một cú sập và SAI với một bộ chạy test. Đây là một cú hỏng thật từ chính kho của khoá học — api-backend run 32243769111, ngày 19/08/2026, bước "Unit tests — money math + payment signature". <code>--log-failed</code> cho 502 dòng. Đáy là:</p>
<div class="out"># tests 69
# pass 68
# fail 1
# duration_ms 3341.605258
##[error]Process completed with exit code 1.</div>
<p>Nó cho bạn biết <em>rằng</em> một trong 69 bài test đã hỏng và không nói gì về bài NÀO. Bản thân cú hỏng nằm ở dòng 116:</p>
<div class="out">not ok 15 - chạm trần token thì VIẾT TIẾP, không trả về câu cụt
  location: '/home/runner/work/api-backend/api-backend/src/services/agent/vietTiepLuot.test.ts:3:230'
  error: &#96;không có khung 'done'. Sự kiện: ["error"]&#96;
  stack: |-
    TestContext.&lt;anonymous&gt; (…/vietTiepLuot.test.ts:63:10)</div>
<p>Mỗi bộ chạy test có dấu hiệu riêng cho "bài này hỏng", và biết nó là khác biệt giữa đọc 502 dòng và đọc một dòng:</p>
<table>
<thead><tr><th>Công cụ</th><th>Tìm trong log</th></tr></thead>
<tbody>
<tr><td><code>node --test</code> (TAP)</td><td><code>not ok</code></td></tr>
<tr><td>Jest / Vitest</td><td><code>FAIL</code>, <code>●</code> (Jest), <code>×</code> hoặc <code>AssertionError</code></td></tr>
<tr><td><code>tsc</code></td><td><code>error TS</code></td></tr>
<tr><td>ESLint</td><td><code>error</code> với một đường dẫn tệp phía trên; <code>✖ N problems</code> là phần tổng kết</td></tr>
<tr><td>Chính npm</td><td><code>npm error</code> (và <code>ERR!</code> ở npm cũ)</td></tr>
<tr><td>Docker build</td><td><code>ERROR [</code> — stage và bước đã hỏng</td></tr>
<tr><td>Một cú sập</td><td><code>Error:</code> hoặc <code>FATAL</code> ĐẦU TIÊN; mọi thứ sau nó là hệ quả</td></tr>
</tbody>
</table>
<div class="callout">
<p><strong>"Lỗi thật nằm gần đáy" và "dòng lỗi thật nằm phía trên đáy" đều đúng.</strong> Câu đầu nói về việc đọc <em>PHẦN</em> nào của log (không phải phần thiết lập ở đầu); câu sau nói về <em>DÒNG</em> nào trong phần ấy (không phải phần tổng kết ở cuối). Hãy đọc bước hỏng, từ dòng <code>##[error]</code> ngược lên, tới dòng đầu tiên gọi tên một tệp, một bài test hay một lệnh cụ thể.</p>
</div>

<h3>Khi log không đủ: log gỡ lỗi (debug logging)</h3>
${slide('ga-08', 25, 'Chạy lại với --debug thêm các dòng ##[debug]: if: được tính thế nào, mặc định nào được áp, shell nào đã chạy')}
<p>Có lúc bậc ①–④ để lại cho bạn câu "bước có chạy, nhưng không theo cách tôi tưởng": một <code>if:</code> lẽ ra phải sai, một input không tới, một <code>working-directory</code> bạn không định dùng. Đó là việc của log gỡ lỗi. Nhánh hỏng của pipeline sân tập được chạy lại bằng <code>gh run rerun 36011088185 --failed --debug</code>, và bước hỏng có thêm mười hai dòng như thế này:</p>
<div class="out">##[debug]Evaluating condition for step: 'Run npm test'
##[debug]Evaluating: success()
##[debug]Evaluating success:
##[debug]=&gt; true
##[debug]Result: true
##[debug]Starting: Run npm test
##[debug]Loading inputs
##[debug]Loading env
##[debug]Overwrite 'working-directory' base on job defaults.
##[debug]Overwrite 'shell' base on job defaults.
##[debug]/usr/bin/bash --noprofile --norc -e -o pipefail /home/runner/work/_temp/db6d4064-….sh
##[debug]Finishing: Run npm test</div>
<p>Mỗi dòng trả lời một câu hỏi mà log thường không trả lời: điều kiện quyết định bước có chạy không và giá trị của nó, rằng khối <code>defaults:</code> đã cấp thư mục làm việc và shell, và dòng lệnh chính xác của shell. Theo tài liệu (tính đến 09/2026) có ba cách bật nó:</p>
<div class="kv-grid">
<div class="kv"><span class="k">cho MỘT lần chạy lại</span><span class="v">tích "Enable debug logging" trong hộp thoại chạy lại, hoặc <code>gh run rerun ID --debug</code> (kèm <code>--failed</code> hoặc <code>--job</code> để thu hẹp). Không có gì bị để bật lại sau đó — cách an toàn nhất</span></div>
<div class="kv"><span class="k">cho MỌI run: debug của bước</span><span class="v">một secret hoặc biến của kho tên <code>ACTIONS_STEP_DEBUG</code> đặt <code>true</code>. Có cả hai thì secret thắng. Nhớ xoá nó — mọi run của mọi workflow trong kho đều ồn hơn khi nó còn bật</span></div>
<div class="kv"><span class="k">cho MỌI run: chẩn đoán runner</span><span class="v"><code>ACTIONS_RUNNER_DEBUG=true</code> thêm hai tệp log chẩn đoán cho tiến trình runner và worker, tải được trong gói log của run. Hữu ích khi trục trặc ở tầng runner, hiếm khi cho mã của bạn</span></div>
</div>
<div class="callout warn">
<p><strong>Log gỡ lỗi giải thích WORKFLOW, không giải thích chương trình của bạn.</strong> Nó không làm một bài test hỏng in thêm gì; muốn thế hãy dùng tuỳ chọn chi tiết của chính công cụ (<code>--verbose</code>, <code>DEBUG=*</code>, <code>npm --loglevel verbose</code>). Và các công tắc cấp kho ảnh hưởng tới run của mọi người: trong một kho dùng chung, hãy ưu tiên lần chạy lại <code>--debug</code> một lần — đúng lý do chương này dùng nó thay vì đặt một biến trên kho sân tập dùng chung.</p>
</div>
<h3>Hai lối tắt phá vỡ thứ tự</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mở log ngay</span><span class="lz-lnote">hành động mặc định, và nó đẻ ra người đọc bỏ mười lăm phút vào một stack trace của một job đã bị bỏ qua. Bước 1–3 loại các job bị bỏ qua TRƯỚC khi log cám dỗ bạn</span></div>
<div class="lz-layer"><span class="lz-lname">chạy lại trước khi đọc</span><span class="lz-lnote">bài 8.2 đã đo điều đó nói lên gì: với một flake 20%, không gì cả. Với một cú hỏng thật, không gì cộng thêm một lần chạy nữa. Cái nút là một biện pháp SỬA CHỮA, không phải một cuộc chẩn đoán</span></div>
<div class="lz-layer"><span class="lz-lname">tìm "error" trong log</span><span class="lz-lnote">nhiều bước xanh cũng in ra từ đó. Dòng <code>##[error]</code> CUỐI gọi tên mã thoát và bước hỏng, và đó là thứ bạn muốn. Hãy tìm <code>##[error]</code></span></div>
<div class="lz-layer"><span class="lz-lname">đọc log của người khác trước</span><span class="lz-lnote">một cú hỏng cũ trông giống nhau thì chỉ TRÔNG giống. Đọc lần chạy của BẠN trước, và chỉ khi đó mới so — nếu không, bạn đã nhập chẩn đoán của họ vào chẩn đoán của mình</span></div>
</div>

<h3>Chỗ sáu bước ấy đổ vỡ</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một bước thoát 0 mà đã ghi ra lỗi</span><span class="v">bước 4 cho bạn 0 và không có gì để làm việc với. Đây là ca thiếu <code>pipefail</code> ở bài 2.4: shell đã che cú hỏng. Cách vá nằm ở SHELL, không nằm trong lần chạy này</span></div>
<div class="kv"><span class="k">job bị huỷ</span><span class="v">hoàn toàn không có mã thoát — log của bước ghi "The operation was canceled." (dòng này lúc đầu ghi exit 143; bài 8.1 đã đo cú huỷ và thấy SIGINT, không có mã thoát). "Cú hỏng" thật ra là "có ai đó huỷ nó, hoặc fail-fast, concurrency hay hết giờ của job đã huỷ" — annotation cho biết là cái nào. Bước 3 phát hiện ca fail-fast: một nhánh bị huỷ trong khi các anh em nó vẫn chạy là thứ fail-fast để lại</span></div>
<div class="kv"><span class="k">runner chết</span><span class="v">không có mã thoát nào cả, và log kết thúc đột ngột. Trang lần chạy hiện "The runner has received a shutdown signal" — hạ tầng, không phải mã. Chạy lại một lần</span></div>
<div class="kv"><span class="k">một bước hết giờ</span><span class="v">runner tiêm vào một lỗi và dòng cuối là một thông báo timeout. Bước 1 cũng bắt được — thời lượng ở đúng trần</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một job phía sau bị hỏng là CÚ HỎNG.</strong> Một job công bố đỏ với ba job dựng đỏ ở thượng nguồn thì có MỘT cú hỏng, không phải bốn. Các job dựng hỏng vì lý do của chúng; job công bố hỏng vì <code>needs:</code> của nó không thành công. Hãy đọc cú hỏng SỚM NHẤT trong chuỗi, không phải cú ồn ào nhất — thứ thường là cú ở cuối.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Hãy đọc LẦN CHẠY trước khi đọc LOG: thời lượng nói CÁCH nó hỏng, các job bị bỏ qua nói cú hỏng KHÔNG lan tới đâu, ma trận nói TRỤC nào khác, và mã thoát gọi tên NGUYÊN NHÂN — nên tới lúc bạn đang nhìn chữ, bạn đang nhìn đúng hai mươi dòng.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Kể cho tôi nghe bạn làm gì khi pipeline CI đỏ trên pull request của bạn.</strong><br>Đ: Tôi đọc RUN trước khi đọc LOG. Annotation cho tôi mã thoát hoặc hết giờ của từng job hỏng. Trong đồ thị job tôi tìm job đỏ SỚM nhất và bỏ qua các job bị bỏ qua phía sau; nếu chỉ một nhánh ma trận đỏ thì đó là khác biệt môi trường. Trong job, tôi tới bước hỏng và đọc ngược lên từ dòng <code>##[error]</code> tới dòng đầu tiên gọi tên một bài test, một tệp hay một lệnh. Tôi kiểm xem bài test ấy đã từng hỏng chưa. Chỉ sau đó tôi mới tái lập ở máy hay chạy lại — và tôi chỉ chạy lại nếu lỗi gọi tên hạ tầng.</p>
<p><strong>H: Bạn làm cách nào để cú hỏng CI của chính mình dễ đọc hơn?</strong><br>Đ: Tôi bắt cú hỏng in ra NƠI nó xảy ra: công cụ nào in tệp và dòng thì biến thành annotation <code>::error file=…,line=…::</code>; tôi dùng <code>shell: bash</code> để ống không che cú hỏng; tôi ghi một bản tóm tắt ngắn vào <code>$GITHUB_STEP_SUMMARY</code>; và tôi thêm một bước in ra cỗ máy cùng phiên bản công cụ.</p>
<p><strong>H: <code>ACTIONS_STEP_DEBUG</code> là gì?</strong><br>Đ: Một secret hoặc biến bật log gỡ lỗi của bước cho mọi run, cho thấy các điều kiện được tính thế nào và mặc định nào được áp. Cho một cuộc điều tra đơn lẻ, tôi ưu tiên "chạy lại với debug logging", thứ làm đúng việc ấy cho một lần chạy và không để lại công tắc nào bật.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn phân loại được một run đỏ trong chưa tới hai phút mà không mở trình duyệt.</p><ol>
<li>Lấy một run đỏ bất kỳ trong kho của bạn (hoặc từ bài thực hành 8.1). Chạy <code>gh run view ID</code> và ghi lại: mã thoát từ annotation, job đỏ đầu tiên, bước đỏ.</li>
<li>Chạy <code>gh run view ID --log-failed | grep -F -B 25 "##[error]"</code> và tìm dòng đầu tiên phía trên gọi tên một bài test, một tệp hay một lệnh cụ thể.</li>
<li>Thêm một bước lint biến đầu ra <code>shellcheck -f gcc</code> thành annotation <code>::error file=…,line=…::</code> (YAML trong bài), push một script có biến không trích dẫn, và kiểm annotation hiện trên trang run và trong <code>gh api …/check-runs/JOB_ID/annotations</code>.</li>
<li>Chạy lại một job hỏng bằng <code>gh run rerun ID --failed --debug</code> và tìm dòng <code>##[debug]Evaluating</code> của bước hỏng.</li></ol>
<p><strong>Đạt khi:</strong> bạn nêu được mã thoát, job, bước và dòng lỗi thật của một run đỏ chỉ bằng terminal; annotation của chính bạn hiện tệp và dòng của cảnh báo shellcheck; và bạn tìm được dòng debug cho thấy <code>if:</code> của bước hỏng đã được tính thế nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Triage (phân loại)</span><span class="v">Quyết định mình đang có loại cú hỏng nào, và nhìn vào đâu, trước khi điều tra sâu.</span></div>
  <div class="kv"><span class="k">Job graph (đồ thị job)</span><span class="v">Sơ đồ job và các cạnh <code>needs:</code> trên trang run. ✗ đỏ là hỏng, ⊘ xám là bị bỏ qua.</span></div>
  <div class="kv"><span class="k"><code>--log-failed</code></span><span class="v">Tuỳ chọn của <code>gh run view</code> chỉ in log của các bước hỏng, có tên job và bước đứng trước.</span></div>
  <div class="kv"><span class="k"><code>::error file=,line=::</code></span><span class="v">Lệnh workflow tạo một annotation gắn vào một tệp và một dòng.</span></div>
  <div class="kv"><span class="k">Debug logging (log gỡ lỗi)</span><span class="v">Các dòng <code>##[debug]</code> thêm từ runner; bật cho một lần chạy lại, hoặc cho mọi run qua <code>ACTIONS_STEP_DEBUG</code>.</span></div>
  <div class="kv"><span class="k"><code>fail-fast</code></span><span class="v">Tuỳ chọn ma trận (mặc định true) huỷ các nhánh còn lại khi một nhánh hỏng — tắt đi để thấy kết quả của mọi nhánh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn bậc: annotation → job đỏ đầu tiên → bước đỏ → dòng lỗi thật phía trên <code>##[error]</code>.</li>
<li>Job xám (bị bỏ qua) là hệ quả của <code>needs:</code>; một nhánh ma trận đỏ giữa các nhánh xanh gọi tên một khác biệt môi trường.</li>
<li><code>gh run view</code> và <code>--log-failed</code> cho bạn tất cả từ terminal; <code>grep -F -B 25 "##[error]"</code> tìm ra dòng cần đọc.</li>
<li>Bộ chạy test tổng kết ở đáy — hãy tìm dấu hiệu hỏng của nó (<code>not ok</code>, <code>FAIL</code>, <code>error TS</code>).</li>
<li>Bắt công cụ của bạn đẻ ra annotation, và giữ <code>pipefail</code> để một cái ống không che được cú hỏng.</li>
<li>Log gỡ lỗi giải thích các quyết định của workflow; ưu tiên lần chạy lại <code>--debug</code> một lần.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36011088185 — pipeline có một nhánh ma trận đỏ (lần chạy 2 có debug logging)</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185 — đồ thị job dùng cho bậc ②, và các dòng <code>##[debug]</code> của lần chạy lại <code>--debug</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Enabling debug logging</span><span class="lc-sub">docs.github.com/en/actions/how-tos/monitor-workflows/enable-debug-logging — <code>ACTIONS_STEP_DEBUG</code> và <code>ACTIONS_RUNNER_DEBUG</code> dạng secret hoặc biến, thứ tự ưu tiên, và chạy lại với debug logging.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About monitoring and troubleshooting</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows — các tính năng giao diện hỗ trợ sáu bước bên trên: bản tóm tắt lần chạy, trạng thái từng job, và các dấu nhóm log cho phép bạn nhảy tới cú hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: ::error:: và ::warning::</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — cách một bước báo hiệu cú hỏng để bước 4 tìm ra, và viết gì trong script của bạn để người đọc ở bước 5 biết chuyện gì đã xảy ra.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Downloading logs</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs — tệp zip log gốc, cho ca hiếm mà giao diện cắt cụt trước cái dòng đáng chú ý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — đọc một sự cố từ ĐÁY log</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng thứ tự phân loại ấy áp lên một sự cố production, gồm cả một ca mà bước 1 là đủ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đọc từ đáy lên</span><span class="lc-sub">/courses/linux-bash/learn${REF} — kỷ luật đọc log tổng quát, gồm cả việc vì sao <code>less +G</code> đáng thuộc.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Verifying a fix, and the acceptance test that saves you|||8.5 — Kiểm chứng bản vá, và bài nghiệm thu cứu bạn',
      slug: 'ga-8-5-kiem-ban-va',
      type: 'VIDEO',
      description: 'Sau khi biết vì sao nó hỏng, câu hỏi thật là: bản vá có ĐỦ không? Đo trên rig: heap 1600 MB, có sourcemap → 134, tắt sourcemap → 0. Đó là bằng chứng. Kèm mẫu bài kiểm nghiệm thu để lỗi tái diễn không sống sót được lần thứ hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Verifying a fix, and the acceptance test that saves you</h2>
<p class="lead">"CI is green now" is the default answer to whether a fix worked, and 8.2 measured what it is worth: a 20% flake goes green on the next run 80% of the time. So the honest evidence has a different shape — reproduce the failure deliberately, apply the fix under the same conditions, and watch it turn green.</p>

<h3>The demonstration this repository did</h3>
<div class="out">reproduction:  node --max-old-space-size=1600  vite build
  co sourcemap  -> exit 134   (FATAL ERROR: Reached heap limit)
  khong          -> exit 0

apply:  set NODE_OPTIONS=--max-old-space-size=6144 in CI, drop sourcemaps when CI is set
verify: run under the 1600 MB constraint again
  co sourcemap  -> exit 134   (unchanged — the fix is the OTHER thing)
  khong          -> exit 0    (fix confirmed)</div>

<div class="callout ok">
<p><strong>The reproduction is not optional.</strong> Without it the sequence is "the build failed; we changed something; the next build was green" — indistinguishable from a flake that resolved itself. With it the sequence is "the build fails at limit X unless we do Y", which is a claim about mechanism. A future regression on Y produces the same failure, in the same log, and gets fixed the same way.</p>
</div>

<h3>The three states a fix can be in</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">reproduced, unfixed</span><span class="lz-lnote">you can make the failure happen on demand. This is the starting position and the useful one — you now hold the failure by its axis</span></div>
<div class="lz-layer"><span class="lz-lname">reproduced, fixed once</span><span class="lz-lnote">applying the change under the constraint turns the failure into a success. Real evidence, but it does not stop the same class recurring three months later when somebody adds a dependency</span></div>
<div class="lz-layer"><span class="lz-lname">reproduced, fixed forever</span><span class="lz-lnote">the constraint is baked into CI as an acceptance test that the build itself must pass. Now a regression fails immediately on the developer&#39;s next commit rather than on the release</span></div>
</div>

<h3>Turning the reproduction into a CI step</h3>
<pre><code>- name: Build phai chay duoc voi heap bop toi 2GB
  env:
    NODE_OPTIONS: --max-old-space-size=2048
  run: |
    npm run build
    <span class="tok-comment"># neu cai nay hong, mot phu thuoc vua nang muc dung heap.</span>
    <span class="tok-comment"># Fix la giam heap use, khong phai nang --max-old-space-size.</span></code></pre>

<div class="callout">
<p><strong>The test asserts a property of the build, not a hardware fact.</strong> A production release has to run on machines the developer does not choose, and this step encodes the smallest such machine as a constraint. If it fails, somebody removed the margin the fix restored — and the fix is to restore it, not to raise the ceiling in the test.</p>
</div>

<h3>What acceptance tests are worth, generalised</h3>
<div class="kv-grid">
<div class="kv"><span class="k">reproduce the exact past failure</span><span class="v">the 1600 MB heap test above. The value is that the specific bug cannot come back silently — it either fixes itself or fails the check</span></div>
<div class="kv"><span class="k">assert the smoke path</span><span class="v">the deploy script&#39;s route-mounted check from Chapter 1&#39;s history: an unauth <code>curl</code> to core routes, failing on any 404. Not comprehensive, and does not need to be</span></div>
<div class="kv"><span class="k">assert file presence in a release</span><span class="v">the release job&#39;s "count files before publishing" from 5.4. Missing <code>latest-mac.yml</code> silently breaks auto-update, so the check counts it — and refuses to publish a release without it</span></div>
<div class="kv"><span class="k">assert what the workflow ITSELF does</span><span class="v">6.5&#39;s audit script. Six greps that keep the repository honest about what its own workflows say</span></div>
</div>

<h3>The verification order, once you have a fix in mind</h3>
${slide('ga-08', 27, 'Verify a fix: red locally, fix, green locally under the same condition, then push, then keep the condition in CI')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">reproduce the failure locally</span><span class="lz-d">under the constraint 8.3 identified. If you cannot reproduce it, you do not know what you are fixing</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">apply the fix under the same constraint</span><span class="lz-d">and watch the failure become a success. This is the evidence</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">codify the constraint as a check</span><span class="lz-d">so the class cannot come back. This is the acceptance test</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">deliberately break something else and watch the check fail</span><span class="lz-d">the "check the checker" pattern from Deploy VPS. A test you have never seen fail is a test you have not tested</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">only now, push and let CI run</span><span class="lz-d">the green run is a confirmation, not the evidence</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the fix that raises the ceiling instead of restoring the margin.</strong> The most tempting reply to "the build ran out of heap" is to add <code>--max-old-space-size=8192</code> and push. It works — until the next dependency raises the peak by another 400 MB and CI is red again, having exchanged an OOM for a silent slow build in production. The reproduction identifies whether the fix should restore the margin or raise the ceiling. Both are legitimate; conflating them is how the class comes back.</p>
</div>

<h3>The same order, run end to end on the sandbox</h3>
${slide('ga-08', 26, 'Three runs of one fix: fixing the first error exposed a second one, and only the third run was green')}
<p>The heap demonstration above happened in this repository months ago. To watch the whole order work on something you can open, the sandbox pipeline from lesson 8.4 was taken from red to green deliberately, one round at a time, with the local reproduction before every push.</p>
<p><strong>Round 0 — the red run.</strong> <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185" target="_blank" rel="noopener">Run 36011088185</a>: only <code>test (20)</code> red, with <code>Could not find '…/test-that/*.test.js'</code>. The pipeline had been written to catch a different bug — <code>tinh.js</code> uses iterator helpers (<code>ds.values().map(…).toArray()</code>), which exist from Node 22 — so the expected failure was a <code>TypeError</code>. The actual failure came earlier: Node 20&#39;s <code>--test</code> does not expand a glob pattern, so it found no test file at all. The first step of verification is therefore to reproduce what <em>actually</em> happened, not what you expected:</p>
<div class="out">$ docker run --rm -v "$PWD":/app:ro -w /app node:20-slim sh -c 'node --version; node --test "test-that/*.test.js"; echo "exit $?"'
v20.20.2
Could not find '/app/test-that/*.test.js'
exit 1</div>
<p><strong>Round 1 — fix the first cause, reproduce again.</strong> The test script was changed from the glob to the explicit path <code>node --test test-that/tinh.test.js</code>, which every Node version accepts. Under the same condition, before pushing:</p>
<div class="out">$ docker run --rm -v "$PWD":/app:ro -w /app node:20-slim sh -c 'npm test'
not ok 2 - nhanDoi [1,2,3]
  name: 'TypeError'
# pass 1
# fail 1</div>
<p>Still red, and that is the point of reproducing each round: the first fix was correct and was not enough. It removed the error that masked the second one. Pushed anyway so the hosted run could confirm the new picture, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012126658" target="_blank" rel="noopener">run 36012126658</a> showed exactly the local result: <code>error: 'ds.values(...).map is not a function'</code>, <code>name: 'TypeError'</code>, at <code>tinh.js:3:44</code>.</p>
<p><strong>Round 2 — fix the second cause, reproduce on every version.</strong> <code>nhanDoi</code> was rewritten as <code>ds.map((x) =&gt; x * 2)</code>. Then, still locally:</p>
<div class="out">v20.20.2 # pass 2 # fail 0
v22.23.1 # pass 2 # fail 0</div>
<p>Only now was the push a confirmation rather than an experiment: <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012290608" target="_blank" rel="noopener">run 36012290608</a>, six jobs, six green, including the Node 24 leg that was not reproduced locally.</p>
<div class="callout ok">
<p><strong>What the three rounds show.</strong> A red CI can hide more than one cause, stacked so that each one only appears when the one in front of it is fixed. If round 1 had been pushed without the local reproduction, the red run 36012126658 would have looked like "the fix did not work" — and a natural next move would have been to revert it. Reproducing each round locally tells you that the fix <em>did</em> work, and that there is a second problem.</p>
</div>

<h3>Why re-running is not verification</h3>
${slide('ga-08', 28, 'A re-run replays the old commit; only a new run on the fixed commit, after a local reproduction, is evidence')}
<p>Lesson 8.2 measured that "Re-run failed jobs" turned a run with a 20% bug green. There is a second, more mechanical reason it cannot verify a fix: a re-run uses the same <code>GITHUB_SHA</code> and <code>GITHUB_REF</code> as the original event (the documentation says so explicitly). The commit with your fix is not in it. A green re-run of commit A says something about the runner or about luck; it says nothing about commit B. The evidence has two halves — the failure reproduced on A, the success reproduced on B, under the same condition — and the CI run on B is the confirmation of the second half.</p>
<div class="pitfall">
<p><strong>Trap — "fixed" by a re-run after pushing the fix.</strong> A common sequence: push a fix, see the old run still red at the top of the list, click re-run on it, watch it go green, close the ticket. The re-run tested the old commit. If it went green, the failure was intermittent all along and your fix has not been tested at all. Always open the run whose head commit is your fix — <code>gh run list --commit $(git rev-parse HEAD)</code> — and read that one.</p>
</div>

<h3>Keeping the condition: the acceptance test for this failure</h3>
<p>Step 5 of the verification order is to keep the condition that caused the failure in CI permanently. For this failure the condition is "the oldest Node version you support", and it costs one line: the Node 20 leg stays in the matrix after it goes green. If the project promises Node 20, <code>package.json</code> should say so too, so that the promise and the test are written in the same place:</p>
<pre><code class="language-yaml">    strategy:
      matrix:
        node: [20, 22, 24]        # 20 = the oldest version in "engines" — keep it
</code></pre>
<pre><code>{
  "engines": { "node": "&gt;=20" }
}</code></pre>
<p>Remove the Node 20 leg to "make CI green" and the next Node-22-only API that slips into the code passes CI and fails on a user&#39;s machine instead — the same bug class, with the evidence moved from your CI log to someone else&#39;s bug report. If Node 20 support is really being dropped, change <code>engines</code> and the matrix together, in one commit that says so.</p>
<div class="callout">
<p><strong>Check the checker.</strong> A condition kept in CI is only worth something if you have seen it fail. This chapter already has that evidence: runs 36011088185 and 36012126658 are the Node 20 leg failing for two different reasons. For a new acceptance test, create the evidence on purpose — revert the fix on a branch, push, watch the check go red, delete the branch.</p>
</div>

<h3>The chapter&#39;s common mistakes in one place</h3>
${slide('ga-08', 29, 'Common mistakes in Chapter 8: re-run before reading, reading only the bottom, confusing 134 and 137, and more')}
<table>
<thead><tr><th>Mistake</th><th>What it costs</th><th>Instead</th></tr></thead>
<tbody>
<tr><td>Re-run before reading</td><td>a 20% bug turned green (8.2) and was never fixed</td><td>read the failed step; re-run only for infrastructure errors</td></tr>
<tr><td>Read only the bottom of the log</td><td>"# fail 1" with no name (8.4)</td><td>search for the runner&#39;s failure marker above <code>##[error]</code></td></tr>
<tr><td>Confuse 134 and 137</td><td>raising the heap makes a 137 worse (8.1)</td><td>134 → heap; 137 → real memory, check <code>OOMKilled</code></td></tr>
<tr><td>Expect an exit code from a cancel</td><td>searching for a number that is not there</td><td>"The operation was canceled." → find who cancelled</td></tr>
<tr><td>Blame the last red job</td><td>time spent on jobs that failed because of <code>needs:</code></td><td>the earliest red in the graph</td></tr>
<tr><td>Quote a heap number from a blog</td><td>wrong by 2× on macOS (8.3)</td><td>print the ceiling on the runner that failed</td></tr>
<tr><td>Push debug commits to reproduce</td><td>minutes per iteration, noisy history</td><td><code>docker run</code> in the leg&#39;s image; act for workflow wiring</td></tr>
<tr><td>Verify with a re-run</td><td>tests the old commit</td><td>local red → fix → local green → new run on the new commit</td></tr>
</tbody>
</table>

<h3>A 60-minute practice for the whole chapter</h3>
${slide('ga-08', 31, 'Chapter 8 practice: produce the exit codes, count a flake, re-run, read with --log-failed, reproduce with docker run')}
<p>The slide lists five exercises that together touch every lesson of the chapter. Do them in one sitting on a test repository; each one reuses the workflow from the previous one, and the completion criteria are on the slide. The single most important habit to leave with is the last exercise: a <code>docker run</code> that prints the CI error on your laptop <em>before</em> the fix, and <code># fail 0</code> after it — and only then a push.</p>
<h3>The green run as a check, not a proof</h3>
<div class="callout warn">
<p><strong>Every fix in this course lives or dies on the same measurement.</strong> A green build after a change is evidence at the strength of the flake rate — which for a 20% flake is 80% likelihood by chance. The evidence is the reproduction: it fails without the fix, it passes with it, under the same constraint, twice. Once for the failure, once for the fix.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A fix is verified when the same constraint produces the failure without it and a success with it — the CI green light is a confirmation of that pair, not a substitute for it.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: How do you know a fix for a CI failure actually worked?</strong><br>A: I reproduce the failure locally first, under the same condition as CI — the same image or Node version, the same memory limit. I apply the fix and run it again under that condition until it passes. Then I push, and the CI run on the new commit is the confirmation. A green re-run of the old run proves nothing, because it replays the old commit.</p>
<p><strong>Q: You fixed a CI failure and CI is still red, with a different error. What does that mean?</strong><br>A: Often that the fix worked and uncovered a second problem the first one was masking. I compare the new error with the old one; if the old error is gone, I keep the fix and treat the new error as a new investigation, rather than reverting.</p>
<p><strong>Q: After fixing it, how do you stop the same class of failure from coming back?</strong><br>A: By keeping the condition that exposed it as a permanent check — the oldest supported Node version in the matrix, a memory-limited build step, a smoke test — and by making sure I have seen that check fail at least once, so I know it can.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a matrix leg on the oldest Node version is red in your project. You want to fix it with evidence, not with a lucky green run.</p><ol>
<li>In a test repository, create a function that uses a Node 22-only API (<code>[1,2,3].values().map(x =&gt; x * 2).toArray()</code>) and a test for it; set up a matrix <code>node: [20, 22]</code>. Push and confirm the Node 20 leg is red.</li>
<li>Reproduce it locally: <code>docker run --rm -v "$PWD":/app:ro -w /app node:20-slim npm test</code>. Record the error line and check it matches the CI log.</li>
<li>Fix the function so it works on both versions. Re-run the same <code>docker run</code> on <code>node:20-slim</code> and <code>node:22-slim</code> until both show <code># fail 0</code>.</li>
<li>Push, then find the run for <em>your</em> commit with <code>gh run list --commit $(git rev-parse HEAD)</code> and confirm it is green.</li>
<li>Add <code>"engines": { "node": "&gt;=20" }</code> to <code>package.json</code>. On a throwaway branch, revert the fix, push, confirm the Node 20 leg goes red again, then delete the branch.</li></ol>
<p><strong>Done when:</strong> you have the same error line from CI and from <code>docker run</code>; <code># fail 0</code> on both versions locally before the push; a green run whose head commit is your fix; and a red run on the throwaway branch proving the check still catches the bug.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Verification (kiểm chứng)</span><span class="v">Evidence that a change fixed a failure: the failure reproduced without it and the success reproduced with it, under the same condition.</span></div>
  <div class="kv"><span class="k">Masked failure (lỗi bị che)</span><span class="v">A second cause that only shows once the first is fixed — round 1 of this lesson.</span></div>
  <div class="kv"><span class="k">Acceptance test (bài nghiệm thu)</span><span class="v">A permanent CI check that encodes the condition of a past failure so it cannot return silently.</span></div>
  <div class="kv"><span class="k"><code>engines</code></span><span class="v">The <code>package.json</code> field declaring which Node versions the project supports — keep it in step with the CI matrix.</span></div>
  <div class="kv"><span class="k">Head commit (commit đầu)</span><span class="v">The commit a run tested. <code>gh run list --commit SHA</code> finds the runs for a given commit.</span></div>
  <div class="kv"><span class="k">Check the checker (kiểm bộ kiểm)</span><span class="v">Deliberately breaking the code once to see the check go red, so you know it can.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Verification is a pair: red without the fix, green with it, under the same condition — reproduced locally before pushing.</li>
<li>The sandbox fix took three runs: a glob error hid a <code>TypeError</code>; reproducing each round showed the first fix worked.</li>
<li>A re-run replays the old commit (same <code>GITHUB_SHA</code>); read the run whose head commit is your fix.</li>
<li>Keep the failing condition in CI — the oldest supported Node in the matrix, in step with <code>engines</code>.</li>
<li>Only trust a check you have seen fail.</li>
<li>The green run on the new commit is the confirmation, not the evidence.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox runs 36011088185 → 36012126658 → 36012290608 — one fix in three rounds</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36012290608 — the glob error, the TypeError it was hiding, and the green run with Node 20, 22 and 24; the two earlier runs are linked in the lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About tests in workflows</span><span class="lc-sub">docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration — the general framing of CI, with the specific note that a test is a claim you can point at when it fails.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size and process resource limits</span><span class="lc-sub">nodejs.org/api/cli.html — the flag used above and the alternatives for constraining resources, which is the toolkit for the reproduction step.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — regression tests and the change that reveals the bug</span><span class="lc-sub">testing.googleblog.com — the practice of writing the failing test first, applied at CI scale rather than unit scale.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the smoke test on core routes, and check the checker</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the deploy-time acceptance tests this course keeps referring back to, including how one of them was itself broken and how that was found.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — the query that had to run under production data volume</span><span class="lc-sub">/courses/postgresql/learn${REF} — the same discipline applied to a database: reproducing the slow path under realistic conditions before claiming the index worked.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Kiểm chứng bản vá, và bài nghiệm thu cứu bạn</h2>
<p class="lead">"Giờ CI xanh rồi" là câu trả lời mặc định cho việc bản vá có tác dụng không, và bài 8.2 đã đo nó đáng gì: một flake 20% qua ở lần chạy kế 80% số lần. Nên bằng chứng trung thực có một HÌNH DẠNG khác — TÁI LẬP cú hỏng có chủ ý, áp bản vá dưới cùng điều kiện, rồi xem nó chuyển xanh.</p>

<h3>Bản trình diễn mà kho này đã làm</h3>
<div class="out">tai lap:  node --max-old-space-size=1600  vite build
  co sourcemap  -> exit 134   (FATAL ERROR: Reached heap limit)
  khong          -> exit 0

ap dung:  dat NODE_OPTIONS=--max-old-space-size=6144 trong CI, tat sourcemap khi co bien CI
kiem:    chay lai duoi rang buoc 1600 MB
  co sourcemap  -> exit 134   (khong doi — ban va la CAI KIA)
  khong          -> exit 0    (ban va duoc xac nhan)</div>

<div class="callout ok">
<p><strong>Phần TÁI LẬP không phải tuỳ chọn.</strong> Không có nó thì chuỗi sự kiện là "bản dựng hỏng; chúng tôi đổi cái gì đó; bản dựng kế xanh" — không phân biệt được với một flake tự nó biến mất. Có nó thì chuỗi là "bản dựng hỏng ở giới hạn X trừ khi chúng tôi làm Y", tức là một LỜI KHẲNG ĐỊNH VỀ CƠ CHẾ. Một cú thoái lui về Y trong tương lai đẻ ra cùng cú hỏng, trong cùng cái log, và được vá theo cùng cách.</p>
</div>

<h3>Ba trạng thái mà một bản vá có thể ở</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đã tái lập, chưa vá</span><span class="lz-lnote">bạn khiến cú hỏng xảy ra theo yêu cầu. Đây là vị trí xuất phát và là vị trí HỮU ÍCH — bạn đang cầm cú hỏng bằng cái trục của nó</span></div>
<div class="lz-layer"><span class="lz-lname">đã tái lập, đã vá một lần</span><span class="lz-lnote">áp thay đổi dưới ràng buộc biến cú hỏng thành cú thành công. Bằng chứng có thật, nhưng nó không ngăn CÙNG LỚP tái diễn ba tháng sau khi có người thêm một phụ thuộc</span></div>
<div class="lz-layer"><span class="lz-lname">đã tái lập, đã vá MÃI MÃI</span><span class="lz-lnote">cái ràng buộc được nướng vào CI dưới dạng một BÀI NGHIỆM THU mà chính bản dựng phải qua. Giờ một cú thoái lui hỏng ngay ở commit kế của người viết chứ không phải ở lúc phát hành</span></div>
</div>

<h3>Biến bản tái lập thành một bước CI</h3>
<pre><code>- name: Build phai chay duoc voi heap bop toi 2GB
  env:
    NODE_OPTIONS: --max-old-space-size=2048
  run: |
    npm run build
    <span class="tok-comment"># neu cai nay hong, mot phu thuoc vua nang muc dung heap.</span>
    <span class="tok-comment"># Fix la giam heap use, khong phai nang --max-old-space-size.</span></code></pre>

<div class="callout">
<p><strong>Bài test khẳng định một TÍNH CHẤT CỦA BẢN DỰNG, không phải một sự thật về phần cứng.</strong> Một bản phát hành production phải chạy được trên những cỗ máy mà người viết KHÔNG chọn, và cái bước này mã hoá cỗ máy NHỎ NHẤT như một ràng buộc. Nếu nó hỏng, có ai đó vừa gỡ mất phần lề mà bản vá đã khôi phục — và cách vá là KHÔI PHỤC LỀ, không phải nâng cái trần trong bài test.</p>
</div>

<h3>Bài nghiệm thu đáng gì, tổng quát</h3>
<div class="kv-grid">
<div class="kv"><span class="k">tái lập ĐÚNG cú hỏng cũ</span><span class="v">bài test heap 1600 MB bên trên. Giá trị là ở chỗ cái BUG CỤ THỂ ấy không quay lại được một cách âm thầm — hoặc nó tự vá, hoặc nó làm phép kiểm hỏng</span></div>
<div class="kv"><span class="k">khẳng định đường smoke</span><span class="v">phép kiểm route-đã-mount của script deploy từ lịch sử Chương 1: một cú <code>curl</code> không xác thực tới các route lõi, hỏng khi có bất kỳ 404 nào. Không toàn diện, và không cần toàn diện</span></div>
<div class="kv"><span class="k">khẳng định tệp có mặt trong bản phát hành</span><span class="v">phép "đếm tệp trước khi công bố" của job phát hành ở bài 5.4. Thiếu <code>latest-mac.yml</code> âm thầm làm vỡ tự-cập-nhật, nên phép kiểm ĐẾM nó — và từ chối công bố một bản phát hành thiếu nó</span></div>
<div class="kv"><span class="k">khẳng định thứ workflow TỰ nó làm</span><span class="v">script soát của bài 6.5. Sáu lệnh grep giữ cho kho trung thực về việc workflow của nó nói gì</span></div>
</div>

<h3>Thứ tự kiểm chứng, khi bạn đã nghĩ tới một bản vá</h3>
${slide('ga-08', 27, 'Kiểm bản vá: đỏ ở máy, vá, xanh ở máy dưới cùng điều kiện, rồi push, rồi giữ điều kiện ấy trong CI')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tái lập cú hỏng ở máy</span><span class="lz-d">dưới ràng buộc mà bài 8.3 nhận diện. Nếu bạn không tái lập được, bạn KHÔNG biết mình đang vá cái gì</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">áp bản vá dưới CÙNG ràng buộc</span><span class="lz-d">rồi xem cú hỏng chuyển thành cú thành công. Đó là BẰNG CHỨNG</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">mã hoá ràng buộc thành một phép kiểm</span><span class="lz-d">để cái LỚP ấy không quay lại được. Đó là BÀI NGHIỆM THU</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">CỐ Ý phá một thứ khác rồi xem phép kiểm HỎNG</span><span class="lz-d">khuôn mẫu "kiểm bộ kiểm" của Deploy VPS. Một phép kiểm bạn chưa bao giờ thấy nó HỎNG là một phép kiểm bạn chưa kiểm thử</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">chỉ tới lúc này, đẩy và để CI chạy</span><span class="lz-d">lần chạy xanh là một XÁC NHẬN, không phải bằng chứng</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — bản vá NÂNG cái trần thay vì KHÔI PHỤC lề.</strong> Đáp trả cám dỗ nhất cho "bản dựng cạn heap" là thêm <code>--max-old-space-size=8192</code> rồi đẩy. Nó chạy — cho tới khi cái phụ thuộc kế nâng đỉnh dùng thêm 400 MB nữa và CI lại đỏ, sau khi vừa đổi một cú OOM lấy một bản dựng chậm âm thầm ở production. Phần tái lập nhận diện được bản vá NÊN khôi phục lề hay nâng trần. Cả hai đều chính đáng; TRỘN chúng là cách lớp lỗi quay lại.</p>
</div>

<h3>Cùng thứ tự ấy, chạy trọn vẹn trên sân tập</h3>
${slide('ga-08', 26, 'Ba lần chạy của một bản vá: vá lỗi thứ nhất làm lộ lỗi thứ hai, và chỉ lần thứ ba mới xanh')}
<p>Bản trình diễn heap bên trên đã xảy ra ở kho này từ nhiều tháng trước. Để xem trọn thứ tự ấy vận hành trên một thứ bạn mở ra được, pipeline sân tập của bài 8.4 được đưa từ đỏ sang xanh một cách CÓ CHỦ Ý, từng vòng một, với lần tái lập ở máy trước MỖI lần push.</p>
<p><strong>Vòng 0 — run đỏ.</strong> <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011088185" target="_blank" rel="noopener">Run 36011088185</a>: chỉ <code>test (20)</code> đỏ, với <code>Could not find '…/test-that/*.test.js'</code>. Pipeline được viết ra để bắt một bug KHÁC — <code>tinh.js</code> dùng iterator helpers (<code>ds.values().map(…).toArray()</code>), thứ chỉ có từ Node 22 — nên cú hỏng được chờ đợi là một <code>TypeError</code>. Cú hỏng thật tới sớm hơn: <code>--test</code> của Node 20 không khai triển mẫu glob, nên nó chẳng tìm thấy tệp test nào. Vậy bước đầu tiên của kiểm chứng là tái lập thứ <em>THẬT SỰ</em> đã xảy ra, không phải thứ bạn chờ đợi:</p>
<div class="out">$ docker run --rm -v "$PWD":/app:ro -w /app node:20-slim sh -c 'node --version; node --test "test-that/*.test.js"; echo "exit $?"'
v20.20.2
Could not find '/app/test-that/*.test.js'
exit 1</div>
<p><strong>Vòng 1 — vá nguyên nhân thứ nhất, tái lập lại.</strong> Script test được đổi từ glob sang đường dẫn tường minh <code>node --test test-that/tinh.test.js</code>, thứ mọi phiên bản Node đều nhận. Dưới cùng điều kiện, TRƯỚC khi push:</p>
<div class="out">$ docker run --rm -v "$PWD":/app:ro -w /app node:20-slim sh -c 'npm test'
not ok 2 - nhanDoi [1,2,3]
  name: 'TypeError'
# pass 1
# fail 1</div>
<p>Vẫn đỏ, và đó CHÍNH là lý do phải tái lập mỗi vòng: bản vá thứ nhất ĐÚNG và CHƯA ĐỦ. Nó gỡ đi cái lỗi đang che lỗi thứ hai. Vẫn push để run trên GitHub xác nhận bức tranh mới, <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012126658" target="_blank" rel="noopener">run 36012126658</a> cho đúng kết quả ở máy: <code>error: 'ds.values(...).map is not a function'</code>, <code>name: 'TypeError'</code>, tại <code>tinh.js:3:44</code>.</p>
<p><strong>Vòng 2 — vá nguyên nhân thứ hai, tái lập trên mọi phiên bản.</strong> <code>nhanDoi</code> được viết lại thành <code>ds.map((x) =&gt; x * 2)</code>. Rồi, vẫn ở máy:</p>
<div class="out">v20.20.2 # pass 2 # fail 0
v22.23.1 # pass 2 # fail 0</div>
<p>Chỉ tới lúc này lần push mới là một phép XÁC NHẬN thay vì một thí nghiệm: <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012290608" target="_blank" rel="noopener">run 36012290608</a>, sáu job, sáu xanh, kể cả nhánh Node 24 không được tái lập ở máy.</p>
<div class="callout ok">
<p><strong>Ba vòng ấy cho thấy gì.</strong> Một CI đỏ có thể giấu nhiều hơn một nguyên nhân, chồng lên nhau sao cho mỗi cái chỉ lộ ra khi cái đứng trước nó được vá. Nếu vòng 1 được push mà không tái lập ở máy, run đỏ 36012126658 sẽ trông như "bản vá không ăn thua" — và nước đi tự nhiên tiếp theo là revert nó. Tái lập ở máy mỗi vòng cho bạn biết bản vá ĐÃ ăn thua, và còn một vấn đề thứ hai.</p>
</div>

<h3>Vì sao chạy lại KHÔNG phải kiểm chứng</h3>
${slide('ga-08', 28, 'Chạy lại là phát lại commit cũ; chỉ một run mới trên commit đã vá, sau khi tái lập ở máy, mới là bằng chứng')}
<p>Bài 8.2 đã đo rằng "Re-run failed jobs" biến một run mang bug 20% thành xanh. Còn một lý do thứ hai, cơ học hơn, khiến nó không thể kiểm chứng một bản vá: một lần chạy lại dùng CÙNG <code>GITHUB_SHA</code> và <code>GITHUB_REF</code> với sự kiện gốc (tài liệu nói thẳng như vậy). Commit chứa bản vá của bạn KHÔNG có trong đó. Một lần chạy lại xanh của commit A nói điều gì đó về runner hoặc về may rủi; nó không nói gì về commit B. Bằng chứng có hai nửa — cú hỏng tái lập trên A, sự thành công tái lập trên B, dưới cùng điều kiện — và run CI trên B là phép xác nhận cho nửa thứ hai.</p>
<div class="pitfall">
<p><strong>Bẫy — "đã vá" nhờ một lần chạy lại sau khi push bản vá.</strong> Một chuỗi hay gặp: push bản vá, thấy run cũ vẫn đỏ ở đầu danh sách, bấm chạy lại nó, thấy nó xanh, đóng ticket. Lần chạy lại ấy kiểm commit CŨ. Nếu nó xanh, thì cú hỏng vốn dĩ đã chập chờn từ đầu và bản vá của bạn CHƯA hề được kiểm. Luôn mở run có commit đầu là bản vá của bạn — <code>gh run list --commit $(git rev-parse HEAD)</code> — và đọc run đó.</p>
</div>

<h3>Giữ lại điều kiện: bài nghiệm thu cho cú hỏng này</h3>
<p>Bước 5 của thứ tự kiểm chứng là giữ VĨNH VIỄN trong CI cái điều kiện đã gây ra cú hỏng. Với cú hỏng này, điều kiện là "phiên bản Node CŨ NHẤT bạn hỗ trợ", và nó tốn một dòng: nhánh Node 20 ở LẠI trong ma trận sau khi đã xanh. Nếu dự án hứa hỗ trợ Node 20, <code>package.json</code> cũng nên nói vậy, để lời hứa và bài kiểm được viết ở cùng một chỗ:</p>
<pre><code class="language-yaml">    strategy:
      matrix:
        node: [20, 22, 24]        # 20 = phiên bản cũ nhất trong "engines" — giữ nó
</code></pre>
<pre><code>{
  "engines": { "node": "&gt;=20" }
}</code></pre>
<p>Bỏ nhánh Node 20 đi để "làm CI xanh", thì API chỉ-có-từ-Node-22 kế tiếp lọt vào mã sẽ qua CI và hỏng trên máy của người dùng — cùng một loại bug, chỉ có bằng chứng bị dời từ log CI của bạn sang báo cáo lỗi của người khác. Nếu thật sự bỏ hỗ trợ Node 20, hãy đổi <code>engines</code> và ma trận CÙNG nhau, trong một commit nói rõ điều đó.</p>
<div class="callout">
<p><strong>Kiểm bộ kiểm.</strong> Một điều kiện giữ trong CI chỉ có giá trị nếu bạn đã thấy nó ĐỎ. Chương này đã có bằng chứng ấy: run 36011088185 và 36012126658 là nhánh Node 20 hỏng vì hai lý do khác nhau. Với một bài nghiệm thu mới, hãy tạo bằng chứng có chủ ý — revert bản vá trên một nhánh, push, xem phép kiểm chuyển đỏ, xoá nhánh.</p>
</div>

<h3>Những sai lầm hay gặp của chương, ở một chỗ</h3>
${slide('ga-08', 29, 'Sai lầm hay gặp ở Chương 8: chạy lại trước khi đọc, chỉ đọc đáy log, nhầm 134 với 137, và hơn thế nữa')}
<table>
<thead><tr><th>Sai lầm</th><th>Cái giá</th><th>Thay vào đó</th></tr></thead>
<tbody>
<tr><td>Chạy lại trước khi đọc</td><td>một bug 20% bị biến thành xanh (8.2) và không bao giờ được vá</td><td>đọc bước hỏng; chỉ chạy lại khi lỗi là của hạ tầng</td></tr>
<tr><td>Chỉ đọc đáy log</td><td>"# fail 1" không kèm tên (8.4)</td><td>tìm dấu hiệu hỏng của bộ chạy test phía trên <code>##[error]</code></td></tr>
<tr><td>Nhầm 134 với 137</td><td>nâng heap làm 137 tệ hơn (8.1)</td><td>134 → heap; 137 → bộ nhớ thật, kiểm <code>OOMKilled</code></td></tr>
<tr><td>Chờ một mã thoát từ lần huỷ</td><td>đi tìm một con số không tồn tại</td><td>"The operation was canceled." → tìm ai đã huỷ</td></tr>
<tr><td>Đổ tội job đỏ cuối cùng</td><td>tốn thời gian vào job hỏng chỉ vì <code>needs:</code></td><td>cái đỏ SỚM nhất trong đồ thị</td></tr>
<tr><td>Trích một con số heap từ blog</td><td>lệch 2 lần trên macOS (8.3)</td><td>in trần heap trên chính runner bị hỏng</td></tr>
<tr><td>Đẩy commit gỡ lỗi để tái lập</td><td>vài phút mỗi vòng, lịch sử bẩn</td><td><code>docker run</code> với ảnh của nhánh; act cho việc nối workflow</td></tr>
<tr><td>Kiểm chứng bằng một lần chạy lại</td><td>kiểm commit CŨ</td><td>đỏ ở máy → vá → xanh ở máy → run mới trên commit mới</td></tr>
</tbody>
</table>

<h3>Buổi thực hành 60 phút cho cả chương</h3>
${slide('ga-08', 31, 'Thực hành Chương 8: tự đẻ ra mã thoát, đếm một flake, chạy lại, đọc bằng --log-failed, tái lập bằng docker run')}
<p>Slide liệt kê năm bài tập cùng nhau chạm vào mọi bài của chương. Làm chúng trong một lần ngồi trên một kho thử; bài sau dùng lại workflow của bài trước, và tiêu chí hoàn thành nằm trên slide. Thói quen quan trọng nhất nên mang theo là bài cuối: một lệnh <code>docker run</code> in ra lỗi của CI trên laptop <em>TRƯỚC</em> khi vá, và <code># fail 0</code> sau khi vá — rồi mới push.</p>
<h3>Lần chạy XANH như một PHÉP KIỂM, không phải một chứng minh</h3>
<div class="callout warn">
<p><strong>Mọi bản vá trong khoá học này sống chết trên cùng một phép đo.</strong> Một bản dựng xanh sau một thay đổi là bằng chứng có SỨC MẠNH ngang với tỉ lệ flake — mà với một flake 20% là 80% xác suất do ngẫu nhiên. Bằng chứng là PHẦN TÁI LẬP: nó hỏng khi không có bản vá, nó qua khi có bản vá, dưới cùng ràng buộc, HAI lần. Một cho cú hỏng, một cho bản vá.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một bản vá được kiểm chứng khi CÙNG một ràng buộc đẻ ra cú hỏng khi KHÔNG có nó và cú thành công khi CÓ nó — cái đèn xanh của CI là một xác nhận của cái CẶP ấy, không phải một thứ THAY THẾ nó.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Làm sao bạn biết một bản vá cho cú hỏng CI thật sự có tác dụng?</strong><br>Đ: Tôi tái lập cú hỏng ở máy trước, dưới cùng điều kiện với CI — cùng ảnh hoặc phiên bản Node, cùng giới hạn bộ nhớ. Tôi áp bản vá và chạy lại dưới điều kiện ấy tới khi qua. Rồi tôi push, và run CI trên commit mới là phép xác nhận. Một lần chạy lại xanh của run cũ không chứng minh gì, vì nó phát lại commit cũ.</p>
<p><strong>H: Bạn đã vá một cú hỏng CI mà CI vẫn đỏ, với một lỗi khác. Điều đó nghĩa là gì?</strong><br>Đ: Thường là bản vá đã có tác dụng và làm lộ ra một vấn đề thứ hai mà vấn đề đầu đang che. Tôi so lỗi mới với lỗi cũ; nếu lỗi cũ đã mất, tôi giữ bản vá và coi lỗi mới là một cuộc điều tra mới, thay vì revert.</p>
<p><strong>H: Vá xong rồi, làm sao để cùng loại cú hỏng ấy không quay lại?</strong><br>Đ: Bằng cách giữ điều kiện đã làm lộ nó thành một phép kiểm vĩnh viễn — phiên bản Node cũ nhất được hỗ trợ trong ma trận, một bước dựng có giới hạn bộ nhớ, một smoke test — và bảo đảm tôi đã thấy phép kiểm ấy đỏ ít nhất một lần, để biết nó CÓ THỂ đỏ.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một nhánh ma trận trên phiên bản Node cũ nhất đang đỏ trong dự án của bạn. Bạn muốn vá nó bằng BẰNG CHỨNG, không phải bằng một lần xanh may mắn.</p><ol>
<li>Trong một kho thử, tạo một hàm dùng API chỉ có từ Node 22 (<code>[1,2,3].values().map(x =&gt; x * 2).toArray()</code>) cùng một bài test cho nó; dựng ma trận <code>node: [20, 22]</code>. Push và xác nhận nhánh Node 20 đỏ.</li>
<li>Tái lập ở máy: <code>docker run --rm -v "$PWD":/app:ro -w /app node:20-slim npm test</code>. Ghi dòng lỗi và kiểm nó khớp với log CI.</li>
<li>Vá hàm để chạy được trên cả hai phiên bản. Chạy lại đúng lệnh <code>docker run</code> ấy trên <code>node:20-slim</code> và <code>node:22-slim</code> tới khi cả hai hiện <code># fail 0</code>.</li>
<li>Push, rồi tìm run của CHÍNH commit bạn bằng <code>gh run list --commit $(git rev-parse HEAD)</code> và xác nhận nó xanh.</li>
<li>Thêm <code>"engines": { "node": "&gt;=20" }</code> vào <code>package.json</code>. Trên một nhánh dùng-xong-bỏ, revert bản vá, push, xác nhận nhánh Node 20 đỏ trở lại, rồi xoá nhánh.</li></ol>
<p><strong>Đạt khi:</strong> bạn có cùng một dòng lỗi từ CI và từ <code>docker run</code>; <code># fail 0</code> trên cả hai phiên bản ở máy TRƯỚC khi push; một run xanh có commit đầu là bản vá của bạn; và một run đỏ trên nhánh dùng-xong-bỏ chứng minh phép kiểm vẫn bắt được bug.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Verification (kiểm chứng)</span><span class="v">Bằng chứng rằng một thay đổi đã vá một cú hỏng: cú hỏng tái lập khi không có nó và sự thành công tái lập khi có nó, dưới cùng điều kiện.</span></div>
  <div class="kv"><span class="k">Masked failure (lỗi bị che)</span><span class="v">Một nguyên nhân thứ hai chỉ lộ ra khi nguyên nhân đầu được vá — vòng 1 của bài này.</span></div>
  <div class="kv"><span class="k">Acceptance test (bài nghiệm thu)</span><span class="v">Một phép kiểm CI vĩnh viễn mã hoá điều kiện của một cú hỏng cũ để nó không quay lại trong im lặng.</span></div>
  <div class="kv"><span class="k"><code>engines</code></span><span class="v">Trường trong <code>package.json</code> khai các phiên bản Node dự án hỗ trợ — giữ nó khớp với ma trận CI.</span></div>
  <div class="kv"><span class="k">Head commit (commit đầu)</span><span class="v">Commit mà một run đã kiểm. <code>gh run list --commit SHA</code> tìm các run của một commit.</span></div>
  <div class="kv"><span class="k">Check the checker (kiểm bộ kiểm)</span><span class="v">Cố ý làm hỏng mã một lần để thấy phép kiểm chuyển đỏ, để biết nó CÓ THỂ đỏ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm chứng là một CẶP: đỏ khi không có bản vá, xanh khi có, dưới cùng điều kiện — tái lập ở máy trước khi push.</li>
<li>Bản vá trên sân tập tốn ba run: một lỗi glob đã giấu một <code>TypeError</code>; tái lập từng vòng cho thấy bản vá đầu ĐÃ có tác dụng.</li>
<li>Chạy lại là phát lại commit cũ (cùng <code>GITHUB_SHA</code>); hãy đọc run có commit đầu là bản vá của bạn.</li>
<li>Giữ điều kiện gây hỏng trong CI — phiên bản Node cũ nhất được hỗ trợ trong ma trận, khớp với <code>engines</code>.</li>
<li>Chỉ tin một phép kiểm bạn đã thấy nó đỏ.</li>
<li>Run xanh trên commit mới là phép XÁC NHẬN, không phải BẰNG CHỨNG.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36011088185 → 36012126658 → 36012290608 — một bản vá trong ba vòng</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36012290608 — lỗi glob, cái TypeError mà nó đang giấu, và run xanh với Node 20, 22 và 24; hai run trước được dẫn trong bài.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About tests in workflows</span><span class="lc-sub">docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration — khung tổng quát của CI, kèm ghi chú cụ thể rằng một bài test là một LỜI KHẲNG ĐỊNH bạn CHỈ VÀO ĐƯỢC khi nó hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size và các giới hạn tài nguyên tiến trình</span><span class="lc-sub">nodejs.org/api/cli.html — cái cờ dùng bên trên và các lựa chọn khác để ràng buộc tài nguyên, tức là bộ đồ nghề cho bước tái lập.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — regression tests và thay đổi bộc lộ bug</span><span class="lc-sub">testing.googleblog.com — thực hành viết BÀI TEST HỎNG TRƯỚC, áp ở tầng CI thay vì tầng unit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke test trên các route lõi, và kiểm bộ kiểm</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — các bài nghiệm thu lúc-deploy mà khoá này cứ nhắc lại, gồm cả cách một trong số đó tự bị hỏng và cách chuyện ấy bị phát hiện.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — truy vấn phải chạy dưới volume dữ liệu production</span><span class="lc-sub">/courses/postgresql/learn${REF} — cùng kỷ luật ấy áp lên một cơ sở dữ liệu: tái lập đường chậm dưới điều kiện thực tế trước khi khẳng định index có tác dụng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
      slug: 'ga-8-6-kiem-tra',
      type: 'QUIZ',
      description: 'Mười câu tình huống: 127 và 137 trên runner thật, huỷ không có mã thoát, 4/20 nhánh chập chờn và rerun --failed, chạy lại là phát lại commit cũ, phụ thuộc thứ tự, trần heap macOS, tái lập bằng docker run, dòng lỗi thật phía trên, và debug logging.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>What Chapter 8 measured</h2>
<p class="lead">Ten situations, fifteen minutes. Every correct answer was measured on the sandbox repository or read from this repository&#39;s own history on 24 September 2026 — so if an option sounds reasonable but contradicts a log you saw in the chapter, trust the log.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read each failed job&#39;s exit code from the annotations and say what 1, 2, 126, 127, 134 and 137 mean.</li>
<li>I can explain why a cancelled or timed-out job has no exit code, and which signal the runner sends first.</li>
<li>I can tell a probabilistic flake from order dependence and from a real, repeated failure.</li>
<li>I know which jobs "Re-run failed jobs" re-executes, and which commit it tests.</li>
<li>I can reproduce a failing matrix leg locally with <code>docker run</code> in the same image, or with act.</li>
<li>I can triage a red run from the terminal: annotation, first red job, red step, real error line.</li>
</ul>
${slide('ga-08', 30, 'Chapter 8 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Chương 8 đã đo được gì</h2>
<p class="lead">Mười tình huống, mười lăm phút. Mọi đáp án đúng đều đã được đo trên kho sân tập hoặc đọc từ lịch sử của chính kho này ngày 24/09/2026 — nên nếu một phương án nghe hợp lý mà trái với một dòng log bạn đã thấy trong chương, hãy tin cái log.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được mã thoát của từng job hỏng từ annotation và nói được 1, 2, 126, 127, 134 và 137 nghĩa là gì.</li>
<li>Tôi giải thích được vì sao một job bị huỷ hoặc hết giờ không có mã thoát, và runner gửi tín hiệu nào trước.</li>
<li>Tôi phân biệt được một flake xác suất với phụ thuộc thứ tự và với một cú hỏng thật lặp lại.</li>
<li>Tôi biết "Re-run failed jobs" thực thi lại những job nào, và nó kiểm commit nào.</li>
<li>Tôi tái lập được một nhánh ma trận đỏ ở máy bằng <code>docker run</code> với cùng ảnh, hoặc bằng act.</li>
<li>Tôi phân loại được một run đỏ từ terminal: annotation, job đỏ đầu tiên, bước đỏ, dòng lỗi thật.</li>
</ul>
${slide('ga-08', 30, 'Bảng tra nhanh Chương 8')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A job with a single step `run: eslnt .` fails. The annotation reads "Process completed with exit code 127." What happened?|||Một job chỉ có một bước `run: eslnt .` bị hỏng. Annotation ghi "Process completed with exit code 127." Chuyện gì đã xảy ra?',
            options: [
              'ESLint ran and found lint errors in the code, so it exited with its error code|||ESLint đã chạy và tìm thấy lỗi lint trong mã, nên nó thoát bằng mã lỗi của nó',
              'The shell found no command called eslnt on PATH, so no program ever started|||Shell không tìm thấy lệnh nào tên eslnt trên PATH, nên không chương trình nào khởi động cả',
              'The runner ran out of memory while linting and the kernel killed the process|||Runner hết bộ nhớ trong lúc lint và nhân hệ điều hành đã giết tiến trình',
              'The step was cancelled by fail-fast because another job in the run failed first|||Bước bị fail-fast huỷ vì một job khác trong run đã hỏng trước',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: 127 is the shell’s own code for "command not found": the log line was "eslnt: command not found" and nothing ran. The tempting option — lint errors — would come from the tool itself, which exits 1 (like `npm run tset`, which exited 1 with npm’s own message). Memory kills are 137, and a cancel produces no exit code at all.|||VI: 127 là mã riêng của shell cho "không tìm thấy lệnh": dòng log là "eslnt: command not found" và không gì chạy cả. Phương án hấp dẫn — lỗi lint — sẽ đến từ chính công cụ, thứ thoát 1 (như `npm run tset` thoát 1 kèm lời nhắn của npm). Bị giết vì bộ nhớ là 137, còn huỷ thì hoàn toàn không có mã thoát.',
          },
          {
            question: 'A Node build runs inside `docker run -m 128m …` and the step ends with "exit code 137" and no error lines at all. What is the right next move?|||Một bản dựng Node chạy trong `docker run -m 128m …` và bước kết thúc với "exit code 137", không có dòng lỗi nào. Nước đi đúng tiếp theo là gì?',
            options: [
              'Add --max-old-space-size=4096 so V8 has enough heap for the build|||Thêm --max-old-space-size=4096 để V8 có đủ heap cho bản dựng',
              'Re-run the job, because a silent failure with no message is usually a runner glitch|||Chạy lại job, vì một cú hỏng im lặng không lời nhắn thường là runner trục trặc',
              'Add set -x to the step so the next run prints which line failed|||Thêm set -x vào bước để lần chạy sau in ra dòng nào hỏng',
              'Confirm OOMKilled with docker inspect, then give the container more memory or set a smaller explicit heap so V8 fails first|||Xác nhận OOMKilled bằng docker inspect, rồi cho container thêm bộ nhớ hoặc đặt heap nhỏ hơn tường minh để V8 hỏng trước',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: 137 = 128 + 9, SIGKILL, which cannot be caught — hence no message. The sandbox measured OOMKilled=true for exactly this setup. Raising the heap is the tempting fix and the wrong one: Node already chose a 259 MB heap inside a 128 MB container, so a bigger heap only lets it grab more before the kernel kills it. set -x would not help, because the process that dies is Node, not the shell.|||VI: 137 = 128 + 9, SIGKILL, thứ không bắt được — nên không có lời nhắn. Sân tập đo được OOMKilled=true với đúng cấu hình này. Nâng heap là cách vá hấp dẫn và SAI: Node đã tự chọn heap 259 MB trong một container 128 MB, nên heap lớn hơn chỉ cho nó chiếm thêm trước khi nhân giết nó. set -x không giúp gì, vì thứ chết là Node chứ không phải shell.',
          },
          {
            question: 'You run `gh run cancel` while a step is in the middle of a long loop. What does the step’s log show?|||Bạn chạy `gh run cancel` khi một bước đang giữa một vòng lặp dài. Log của bước hiện gì?',
            options: [
              '"Process completed with exit code 143." because the runner sends SIGTERM|||"Process completed with exit code 143." vì runner gửi SIGTERM',
              '"Process completed with exit code 130." because the runner sends SIGINT|||"Process completed with exit code 130." vì runner gửi SIGINT',
              '"The operation was canceled." with no exit-code line; the step received SIGINT first|||"The operation was canceled." không có dòng mã thoát nào; bước nhận SIGINT trước',
              'Nothing: the current step always runs to completion and only later steps are skipped|||Không gì cả: bước hiện tại luôn chạy tới cùng và chỉ các bước sau bị bỏ qua',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured in run 36011171932: a trap printed "nhan SIGINT" the second the run was cancelled, and the log said "##[error]The operation was canceled." with no exit code. The docs confirm SIGINT first, SIGTERM after 7,500 ms, then the tree is killed after 2,500 ms. 143 is what this lesson originally claimed — it appears only when a process actually dies of SIGTERM. The step does not run to completion.|||VI: Đo ở run 36011171932: một trap in "nhan SIGINT" ngay giây run bị huỷ, và log ghi "##[error]The operation was canceled." không có mã thoát. Tài liệu xác nhận SIGINT trước, SIGTERM sau 7.500 ms, rồi cả cây bị giết sau 2.500 ms. 143 là thứ bài này lúc đầu khẳng định — nó chỉ xuất hiện khi tiến trình thật sự chết vì SIGTERM. Bước không chạy tới cùng.',
          },
          {
            question: 'A 20-leg matrix runs the same test: 4 legs are red. You click "Re-run failed jobs", all 4 turn green and the run shows success. What can you conclude?|||Một ma trận 20 nhánh chạy cùng một bài test: 4 nhánh đỏ. Bạn bấm "Re-run failed jobs", cả 4 chuyển xanh và run hiện success. Bạn kết luận được gì?',
            options: [
              'Almost nothing: for a test failing 20% of the time, all four passing on re-run happens about 41% of the time|||Gần như không gì: với một bài test hỏng 20% số lần, cả bốn qua khi chạy lại xảy ra khoảng 41% số lần',
              'The flaky test has been fixed, because four independent green runs are strong evidence|||Bài test chập chờn đã được vá, vì bốn lần xanh độc lập là bằng chứng mạnh',
              'The four legs ran on broken runners, since the other sixteen legs were green|||Bốn nhánh ấy chạy trên runner hỏng, vì mười sáu nhánh kia xanh',
              'The re-run included newer commits from the branch, so the green result reflects the latest code|||Lần chạy lại gồm cả các commit mới hơn của nhánh, nên kết quả xanh phản ánh mã mới nhất',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This is run 36011087956: the test loses when Math.random() < 0.2, it was never fixed, and the re-run turned the run green anyway. 0.8^4 ≈ 41%, so the observation is ordinary. Four greens are weak evidence; twenty in a row (1.2% by chance) would be strong. The red legs had no pattern, which argues against broken runners, and a re-run uses the same commit — never newer code.|||VI: Đây là run 36011087956: bài test thua khi Math.random() < 0.2, nó chưa từng được vá, và lần chạy lại vẫn biến run thành xanh. 0,8^4 ≈ 41%, nên quan sát ấy rất bình thường. Bốn lần xanh là bằng chứng yếu; hai mươi lần liên tiếp (1,2% do may rủi) mới mạnh. Các nhánh đỏ không có quy luật, điều đó nói ngược với giả thuyết runner hỏng, và chạy lại dùng cùng commit — không bao giờ là mã mới hơn.',
          },
          {
            question: 'CI failed on commit A. You push a fix as commit B, then click "Re-run" on the old red run of A, and it goes green. What did that re-run test?|||CI hỏng ở commit A. Bạn push bản vá thành commit B, rồi bấm "Re-run" trên run đỏ cũ của A, và nó chuyển xanh. Lần chạy lại ấy đã kiểm cái gì?',
            options: [
              'Commit B, because a re-run always checks out the current head of the branch|||Commit B, vì chạy lại luôn checkout đầu hiện tại của nhánh',
              'Commit A again: a re-run uses the same GITHUB_SHA and GITHUB_REF as the original event|||Lại commit A: chạy lại dùng cùng GITHUB_SHA và GITHUB_REF với sự kiện gốc',
              'A temporary merge of A and B that GitHub builds for re-runs|||Một bản merge tạm của A và B mà GitHub dựng riêng cho việc chạy lại',
              'The default branch, because re-runs are triggered by the repository rather than by the push|||Nhánh mặc định, vì chạy lại do kho kích hoạt chứ không do lần push',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The re-run documentation states it uses the same GITHUB_SHA and GITHUB_REF. So the fix was not tested at all; a green re-run of A only says the failure was intermittent. To verify B, open the run whose head commit is B (gh run list --commit SHA). The "current head" option is the common misconception that makes this trap work.|||VI: Tài liệu về chạy lại nói rõ nó dùng cùng GITHUB_SHA và GITHUB_REF. Nên bản vá chưa hề được kiểm; một lần chạy lại xanh của A chỉ nói rằng cú hỏng vốn chập chờn. Muốn kiểm B, hãy mở run có commit đầu là B (gh run list --commit <sha>). Phương án "đầu hiện tại" chính là ngộ nhận khiến cái bẫy này ăn người.',
          },
          {
            question: 'A test passes when run alone with --test-name-pattern and fails every time (5 out of 5) when the whole file runs. What kind of failure is this?|||Một bài test qua khi chạy riêng bằng --test-name-pattern và hỏng mọi lần (5 trên 5) khi chạy cả tệp. Đây là loại cú hỏng gì?',
            options: [
              'A probabilistic flake that should be handled by adding automatic retries|||Một flake xác suất, nên xử lý bằng cách thêm cơ chế tự thử lại',
              'A slow runner, because a whole file takes longer than a single test|||Runner chậm, vì chạy cả tệp lâu hơn chạy một bài',
              'A timing assumption that fake timers will fix|||Một giả định về thời gian mà đồng hồ giả sẽ vá được',
              'Order dependence: an earlier test changes shared state; fix it with per-test setup and cleanup|||Phụ thuộc thứ tự: một bài chạy trước đổi trạng thái chung; vá bằng dựng và dọn riêng cho từng bài',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured in the chapter: the cart test was green alone and red after "them mon vao gio" five times out of five, because both tests share a module-level array. Nothing about it is random, so retries would either keep failing or — with shuffled order — hide it. Speed and timers play no part.|||VI: Đo trong chương: bài giỏ hàng xanh khi chạy riêng và đỏ sau "them mon vao gio" năm trên năm lần, vì cả hai bài dùng chung một mảng cấp module. Không có gì ngẫu nhiên ở đây, nên thử lại hoặc vẫn đỏ mãi, hoặc — khi thứ tự bị xáo — che mất nó. Tốc độ và đồng hồ không liên quan.',
          },
          {
            question: 'The same Node 22 build, with no heap flags, exits 134 only on the macos-15 matrix leg and passes on ubuntu-24.04. What is the most direct measured explanation?|||Cùng một bản dựng Node 22, không cờ heap nào, thoát 134 chỉ ở nhánh ma trận macos-15 và qua trên ubuntu-24.04. Lời giải thích đã đo trực tiếp nhất là gì?',
            options: [
              'Node’s default heap ceiling follows machine memory: 2,096 MB on the 7 GB macOS runner versus 4,144 MB on the 16 GB Linux runner|||Trần heap mặc định của Node đi theo bộ nhớ máy: 2.096 MB trên runner macOS 7 GB so với 4.144 MB trên runner Linux 16 GB',
              'The macOS runner installs a different major version of Node by default|||Runner macOS mặc định cài một phiên bản Node chính khác',
              'The macOS runner has only 14 GB of disk, and V8 aborts when the disk fills|||Runner macOS chỉ có 14 GB đĩa, và V8 abort khi đĩa đầy',
              'Node 22 always defaults to about 8,240 MB, so the build must contain a macOS-specific bug|||Node 22 luôn mặc định khoảng 8.240 MB, nên bản dựng hẳn có một bug riêng của macOS',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Run 36011171685 printed the heap ceiling on each runner, all on Node v22.23.2: 4,144 MB on ubuntu and windows, 2,096 MB on macos-15. 134 is V8 hitting its own ceiling, so half the ceiling explains a macOS-only 134. The 8,240 MB figure is the lesson’s original claim, which could not be reproduced and was corrected. Disk space is unrelated to 134.|||VI: Run 36011171685 in trần heap trên từng runner, cùng Node v22.23.2: 4.144 MB trên ubuntu và windows, 2.096 MB trên macos-15. 134 là V8 chạm trần của chính nó, nên trần chỉ bằng một nửa giải thích một con 134 chỉ-có-trên-macOS. Con số 8.240 MB là khẳng định ban đầu của bài, không tái lập được và đã được đính chính. Dung lượng đĩa không liên quan tới 134.',
          },
          {
            question: 'Only the Node 20 matrix leg fails at `npm test`. What reproduces it locally fastest, without pushing?|||Chỉ nhánh ma trận Node 20 hỏng ở `npm test`. Cách nào tái lập nó ở máy nhanh nhất, không cần push?',
            options: [
              'Push a commit that adds echo lines around npm test and read the next run|||Push một commit thêm các dòng echo quanh npm test rồi đọc lần chạy kế',
              'Run act with a macOS runner image so the environment matches GitHub exactly|||Chạy act với ảnh runner macOS để môi trường khớp y hệt GitHub',
              'docker run --rm -v "$PWD":/app:ro -w /app node:20-slim npm test|||docker run --rm -v "$PWD":/app:ro -w /app node:20-slim npm test',
              'Re-run the failed job with debug logging enabled|||Chạy lại job hỏng với debug logging được bật',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The failure is the command on a specific Node version, so running that command in that version’s image reproduces it — measured at about 1.2 s, printing the same "Could not find" error as CI. Pushing debug commits costs a full run per iteration; act cannot run macOS images at all; and debug logging explains the workflow’s decisions, not why npm test failed.|||VI: Cú hỏng là LỆNH trên một phiên bản Node cụ thể, nên chạy đúng lệnh ấy trong ảnh của phiên bản ấy là tái lập được — đo khoảng 1,2 s, in đúng lỗi "Could not find" như CI. Push commit gỡ lỗi tốn một lần chạy đầy đủ cho mỗi vòng; act hoàn toàn không chạy được ảnh macOS; còn debug logging giải thích các quyết định của workflow, không giải thích vì sao npm test hỏng.',
          },
          {
            question: 'A failed test step’s log is 502 lines long and ends with "# pass 68 # fail 1 … exit code 1". Where is the information you need?|||Log của một bước test hỏng dài 502 dòng và kết thúc bằng "# pass 68 # fail 1 … exit code 1". Thông tin bạn cần nằm ở đâu?',
            options: [
              'In the last line, because real errors are always at the very bottom of a log|||Ở dòng cuối, vì lỗi thật luôn nằm ở tận đáy log',
              'Above the summary: search the step for the runner’s failure marker, such as "not ok" for node:test|||Phía trên phần tổng kết: tìm trong bước dấu hiệu hỏng của bộ chạy test, như "not ok" với node:test',
              'In the "Set up job" section, which lists the runner image and tool versions|||Trong phần "Set up job", nơi liệt kê ảnh runner và phiên bản công cụ',
              'Only in the runner diagnostic logs that ACTIONS_RUNNER_DEBUG produces|||Chỉ trong log chẩn đoán runner mà ACTIONS_RUNNER_DEBUG sinh ra',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: In api-backend run 32243769111 the bottom only said that one of 69 tests failed; the failing test, file and line were at line 116, marked "not ok 15 - …". A test runner summarises at the end, so read upwards from ##[error]. Set up job and runner diagnostics are about the machine and runner, not the failing assertion.|||VI: Ở run 32243769111 của api-backend, đáy log chỉ nói một trong 69 bài test đã hỏng; bài test, tệp và dòng hỏng nằm ở dòng 116, đánh dấu "not ok 15 - …". Bộ chạy test tổng kết ở cuối, nên hãy đọc ngược lên từ ##[error]. Set up job và log chẩn đoán runner là về cỗ máy và runner, không phải về phép khẳng định bị hỏng.',
          },
          {
            question: 'Which statement about debug logging in GitHub Actions is correct?|||Phát biểu nào về debug logging trong GitHub Actions là đúng?',
            options: [
              'A repository secret or variable ACTIONS_STEP_DEBUG=true enables it for every run until removed; gh run rerun --debug enables it for that attempt only|||Một secret hoặc biến của kho ACTIONS_STEP_DEBUG=true bật nó cho mọi run tới khi bị xoá; gh run rerun --debug chỉ bật cho lần chạy ấy',
              'gh run rerun --debug permanently enables debug logging for the whole repository|||gh run rerun --debug bật debug logging vĩnh viễn cho cả kho',
              'ACTIONS_STEP_DEBUG only works as a secret; setting it as a variable has no effect|||ACTIONS_STEP_DEBUG chỉ có tác dụng khi là secret; đặt nó thành biến thì vô tác dụng',
              'Debug logging makes a failing test print its own verbose output, so it replaces tool flags like --verbose|||Debug logging khiến bài test hỏng in đầu ra chi tiết của chính nó, nên nó thay được các cờ như --verbose',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The docs allow ACTIONS_STEP_DEBUG as a secret or a variable (the secret wins if both exist), and it stays on for every run until deleted; "Re-run with debug logging" / --debug applies to one attempt. What it adds — measured on run 36011088185 — are ##[debug] lines about condition evaluation, defaults and the shell command, not output from your test.|||VI: Tài liệu cho phép ACTIONS_STEP_DEBUG ở dạng secret hoặc biến (có cả hai thì secret thắng), và nó bật cho mọi run tới khi bị xoá; "Re-run with debug logging" / --debug chỉ áp cho một lần chạy. Thứ nó thêm vào — đo trên run 36011088185 — là các dòng ##[debug] về việc tính điều kiện, các mặc định và lệnh shell, không phải đầu ra của bài test.',
          },
        ],
      },
    },
  ],
};
