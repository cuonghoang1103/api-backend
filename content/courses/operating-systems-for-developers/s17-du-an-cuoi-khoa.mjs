/**
 * Operating Systems for Developers — Chương 17: Dự án cuối khoá — chẩn đoán và dựng (soạn 29/10/2026 theo _HOP-DONG.md).
 * Bốn dự án "bản in" (tờ đề in được: tổng quan · cấu trúc · hợp đồng giao diện · yêu cầu + điểm · mốc · bộ kiểm nghiệm thu
 * · lỗi hay bị trừ · nộp bài), mỗi dự án có LỜI GIẢI MẪU chạy qua đúng bộ kiểm đó trong ảnh os-lab:
 *   17.1 mini shell C          lab/code/ch17/shell/{msh.c,test-shell.sh}    → lab/out/c171-shell     (khởi điểm ctsh.c 0/10 · mẫu 10/10 · cài lỗi 9/10)
 *   17.2 máy chủ HTTP pool     lab/code/ch17/server/{tpserver.c,loadgen.c,test-server.sh} → lab/out/c172-server (--cpus 4; đo Little, cắt tải, CPU vs chờ)
 *   17.3 sự cố cài sẵn         lab/code/ch17/incident/{compose.yml,services/,fixed/,check.sh} → lab/out/c173-cham-loi · c173-chan-doan · c173-cham-sua
 *                              (TỪ MÁY CHỦ bằng ../ch02/phien-host.sh; project compose "os17", container os-17-*, nhãn oslab=1, dọn bằng down -v)
 *   17.4 báo cáo sự cố + CV    (không có lệnh mới — đọc lại số đo 17.1–17.3)
 *   17.5 mở rộng: mini runtime lab/code/ch17/ctr/{minictr.c,test-ctr.sh}    → lab/out/c175-ctr       (--privileged, container vứt đi)
 * Tạo lại: lab/code/ch17/c171-shell.sh · c172-server.sh · c175-ctr.sh (phien trong os-lab) và chay-c173.sh (từ máy chủ).
 * Slug: 4 slug đã seed (os-17-1-shell, os-17-2-server, os-17-3-chan-doan, os-17-4-bao-cao) GIỮ NGUYÊN; thêm os-17-5-container,
 * quiz os-17-6-quiz. Deck slide os-17-1 … os-17-5.
 * Ranh giới: chương này KHÔNG dạy lại — mỗi mốc trỏ về bài đã dạy cơ chế (fork/exec 1.2, tín hiệu 1.4, fd 9.2, ống dẫn 10.1,
 * pool 3.5/4.7, deadlock 6.1, OOM 8.4, đầy đĩa 2.4, fsync 9.3, namespace/cgroup 12.1–12.4, capability 13.4).
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run as run0, src, card, kv, cmd, details } from './_ui.mjs';
/** run() của _ui.mjs, bỏ các dòng chú thích song ngữ "# EN ||| VI" của kịch bản (chúng chỉ là nhãn bước, không phải output). */
const run = (name, prefix, n = 1, o = {}) => run0(name, prefix, n, { drop: /^# .*[|]{3}/, ...o });
import { lab } from './_lab.mjs';
import G171 from './giang/os-17-1.mjs';
import G172 from './giang/os-17-2.mjs';
import G173 from './giang/os-17-3.mjs';
import G174 from './giang/os-17-4.mjs';
import G175 from './giang/os-17-5.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const a = (slug, text) => `<a href="${OS(slug)}">${text}</a>`;
/** Bảng điểm "bản in": [[mã, mục, điểm, kiểm bằng]] */
const rubric = (rows, h) => `<table><tr><th>#</th><th>${h[0]}</th><th>${h[1]}</th><th>${h[2]}</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}<tr><td></td><td><strong>${h[3]}</strong></td><td><strong>10</strong></td><td></td></tr></table>`;

export default {
  title: 'Chapter 17 — Capstone: diagnose and build|||Chương 17 — Dự án cuối khoá: chẩn đoán và dựng',
  description: 'Bốn dự án in thành tờ đề, mỗi cái có đặc tả, mốc, bộ kiểm nghiệm thu chạy thật trong ảnh lab, lời giải mẫu đạt 10/10, thang điểm và gợi ý ghi CV: mini shell bằng C (ống dẫn, chuyển hướng, việc nền, tín hiệu — khởi điểm ctsh.c 0/10, quên một close() là treo), máy chủ HTTP có thread pool (hàng đợi có giới hạn, 503, 408, tắt êm bằng SIGTERM, đo bằng máy tạo tải: định luật Little 64 kết nối ⇒ 182 ms), phòng lab Docker Compose với năm sự cố cài sẵn (rò bộ nhớ ⇒ OOM 137, log làm đầy đĩa kèm file đã xoá vẫn mở, cạn fd, deadlock Java, fsync từng byte) có đáp án ẩn và bộ chấm, báo cáo sự cố không đổ lỗi + câu chuyện phỏng vấn, và mở rộng: tự viết container runtime bằng C (namespace, pivot_root, cgroup, bỏ capability).',
  lessons: [
    /* ───────────────────────── 17.1 — Mini shell ───────────────────────── */
    {
      title: '17.1 — Project 1: a mini shell in C — pipes, redirection, background jobs and signals|||17.1 — Dự án 1: mini shell bằng C — ống dẫn, chuyển hướng, việc chạy nền và tín hiệu',
      slug: 'os-17-1-shell',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tờ đề dự án 1: dựng msh từ ctsh.c của Chương 1 tới một shell có ống dẫn nhiều tầng, < > >> 2> 2>&1, việc chạy nền + jobs + không zombie, Ctrl-C chỉ giết job (nhóm tiến trình riêng); bộ kiểm 15 ca theo 6 mốc chạy trong os-lab (ctsh.c 0/10, lời giải mẫu 10/10, quên một close() ⇒ 9/10), strace từng tiến trình của "seq 3 | wc -l", thang điểm và gợi ý ghi CV.',
      content: `${G171}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Project 1 of 4</span>
<h2>Project 1: a mini shell in C</h2>
<p class="lead">Every <code>RUN</code> line in a Dockerfile, every CI step and every <code>npm run</code> ends in a shell calling <code>fork</code>, <code>pipe</code>, <code>dup2</code>, <code>execve</code> and <code>wait</code>. In Chapter 1 you read <code>ctsh.c</code>, a 40-line shell that can only run one program at a time. The question of this project: <strong>can you grow it into a shell that behaves like bash for the parts you use every day — pipes, redirection, background jobs, Ctrl-C — and prove it with tests that a machine runs?</strong></p>

<h3>How Chapter 17 works</h3>
<p>Chapters 0–16 taught one mechanism at a time. This chapter makes you <em>use</em> them together, the way a job does. Each project is written as a <strong>printable brief</strong> (bản in): overview, required structure, interface contract, functional requirements with marks, milestones, acceptance tests, common deductions and submission. Every brief comes with:</p>
<ul>
<li>an <strong>acceptance test script</strong> that really runs in the course image <code>os-lab</code> and prints <code>PASS/FAIL</code> per milestone and a score out of 10;</li>
<li>a <strong>reference solution</strong> in <code>lab/code/ch17/</code> that scores 10/10 on that script (the output below is from the real run);</li>
<li>a <strong>rubric</strong> mapping each milestone to marks, and a note on <strong>what to put on your CV</strong>.</li>
</ul>
<table>
<tr><th>Project</th><th>Time</th><th>What it proves</th><th>Test it with</th></tr>
<tr><td>17.1 Mini shell (C)</td><td>3–4 days</td><td>processes, fds, pipes, process groups, signals</td><td><code>shell/test-shell.sh</code></td></tr>
<tr><td>17.2 Thread-pool HTTP server (C or Java)</td><td>3–4 days</td><td>threads, bounded queues, timeouts, graceful shutdown, measuring</td><td><code>server/test-server.sh</code></td></tr>
<tr><td>17.3 Diagnose five planted incidents</td><td>1–2 days</td><td>the observation tools of the whole course, under pressure</td><td><code>incident/check.sh</code></td></tr>
<tr><td>17.4 Postmortem + interview story</td><td>half a day</td><td>explaining what you found, without blame</td><td>the template in 17.4</td></tr>
<tr><td>17.5 Stretch: mini container runtime</td><td>2–3 days</td><td>namespaces, pivot_root, cgroups, capabilities</td><td><code>ctr/test-ctr.sh</code></td></tr>
</table>
<p>Work in your own folder, run the test script often, and open the reference solution only after your own version passes — or after you have been stuck on one milestone for a whole session.</p>

<h3>The brief — Project 1: <code>msh</code></h3>
<p><strong>1. Overview.</strong> Build <code>msh</code>, an interactive shell in C, starting from <code>ctsh.c</code> (${a('os-1-2-fork-exec', 'lesson 1.2')}). It reads one line at a time from standard input, runs it, and keeps <code>$?</code>. When standard input is a terminal it prints the prompt <code>msh$ </code>; when it is a file or a pipe (as in the tests) it prints no prompt.</p>
<p><strong>2. Required structure.</strong></p>
${cmd('mine/', '└── msh.c          # one file, compiled with: gcc -Wall -Wextra -Werror -O2 -o msh msh.c')}
<p><strong>3. Interface contract</strong> — the tests rely on these exact strings:</p>
<table>
<tr><th>Input</th><th>Must do</th></tr>
<tr><td><code>cmd a b</code>, <code>'quoted words'</code>, <code>"x y"</code></td><td>run the program with those arguments; quotes group words and are removed</td></tr>
<tr><td><code>$?</code>, <code>$$</code></td><td>exit status of the last command; the shell’s own PID</td></tr>
<tr><td><code>&lt; f</code> · <code>&gt; f</code> · <code>&gt;&gt; f</code> · <code>2&gt; f</code> · <code>2&gt;&amp;1</code></td><td>redirect stdin, stdout (truncate / append), stderr, stderr into stdout</td></tr>
<tr><td><code>a | b | c</code> (up to 16 stages)</td><td>one pipeline; <code>$?</code> = status of the <strong>last</strong> stage</td></tr>
<tr><td><code>cmd &amp;</code></td><td>run in the background, print <code>[n] PID</code>; when it ends print <code>[n] Done (status)⇥cmd</code> before the next prompt</td></tr>
<tr><td><code>a ; b</code></td><td>run one after the other</td></tr>
<tr><td>built-ins</td><td><code>cd [dir]</code>, <code>exit [n]</code>, <code>jobs</code> (<code>[n] Running⇥cmd</code>), <code>fg [%n]</code>, <code>wait</code></td></tr>
<tr><td>unknown program</td><td><code>msh: NAME: No such file or directory</code> on stderr, status 127</td></tr>
<tr><td>job killed by a signal</td><td>print <code>[killed by signal N]</code>, status 128 + N</td></tr>
<tr><td>Ctrl-C (SIGINT)</td><td>kills the foreground job, <strong>never</strong> the shell</td></tr>
</table>
<p><strong>4. Functional requirements and marks</strong> — exactly what <code>test-shell.sh</code> checks:</p>
${rubric([
  ['M1', 'Run programs: arguments, <code>$?</code>, unknown command → 127, <code>cd</code> changes the shell’s own directory', '2', '4 cases'],
  ['M2', 'Redirection: <code>&gt;</code> <code>&lt;</code> <code>&gt;&gt;</code> <code>2&gt;</code> <code>2&gt;&amp;1</code>', '1.5', '3 cases'],
  ['M3', 'Pipelines: quoted args, 5 stages with the last stage’s status, <code>yes | head -3</code> terminates, children see only fds 0 1 2', '2', '4 cases'],
  ['M4', 'Background jobs: <code>&amp;</code>, <code>jobs</code>, <code>Done</code> message, no zombie left', '2', '1 case'],
  ['M5', 'Signals: the job has its own process group; SIGINT to it kills the job (status 130), SIGINT to the shell is ignored', '1.5', '1 case'],
  ['M6', 'Hygiene: <code>exit n</code>; no fd leak in the shell after 200 pipelines', '1', '2 cases'],
], ['Requirement', 'Marks', 'Total'])}
<p><strong>5. Milestones</strong> — one per sitting, each backed by a lesson you have already done:</p>
<ol>
<li><strong>Day 1 — M1 + M2.</strong> Tokenizer with quotes; <code>$?</code>/<code>$$</code>; redirection = <code>open</code> + <code>dup2</code> + <code>close</code> in the <em>child</em>, after <code>fork</code>, before <code>execvp</code> (${a('os-9-5-fd', 'lesson 9.2')}).</li>
<li><strong>Day 2 — M3.</strong> <code>pipe2(O_CLOEXEC)</code> per stage; the child wires its ends with <code>dup2</code>; the <strong>parent closes every end it does not need</strong> (${a('os-10-1-fd', 'lesson 10.1')}).</li>
<li><strong>Day 3 — M4.</strong> A job table; a <code>SIGCHLD</code> handler that only sets a flag; reaping with <code>waitpid(-1, …, WNOHANG)</code> in the main loop (${a('os-1-4-vong-doi', 'lesson 1.4')}).</li>
<li><strong>Day 4 — M5 + M6.</strong> <code>setpgid</code> in both parent and child; the shell ignores SIGINT/SIGQUIT/SIGTSTP, children restore the defaults; <code>tcsetpgrp</code> when interactive; run the tests until 10/10.</li>
</ol>
<p><strong>6. Acceptance tests.</strong> From <code>lab/code</code> of the course repository:</p>
${cmd('mkdir -p ch17/mine && cp ch01/ctsh.c ch17/mine/msh.c          # your starting point', 'docker run --rm --label oslab=1 -v "$PWD":/lab -w /lab/ch17 os-lab shell/test-shell.sh /lab/ch17/mine')}
<p>This is what the untouched <code>ctsh.c</code> scores — it has no redirection, no pipes, no jobs, and prints a prompt the tests do not expect:</p>
${run('c171-shell', 'shell/test-shell.sh /tmp/start')}
<p><strong>7. Common deductions.</strong> A parent that keeps a pipe’s write end open (the reader never sees EOF — the pipeline hangs); redirecting in the parent instead of the child (the shell’s own stdout is gone); calling <code>printf</code> or <code>malloc</code> inside the <code>SIGCHLD</code> handler (not async-signal-safe); <code>waitpid(-1)</code> blocking in the foreground path and stealing a background job’s status; forgetting <code>_exit</code> after a failed <code>execvp</code> (two shells now read the same input).</p>
<p><strong>8. Submission.</strong> <code>msh.c</code> + the output of <code>test-shell.sh</code> + a 10-line README: what works, what does not, one bug you hit and how you found it.</p>

<h3>The reference solution, measured</h3>
<p>The reference <code>msh.c</code> is 221 lines. It passes every case:</p>
${run('c171-shell', 'wc -l shell/msh.c', 2)}
<p>To <em>see</em> what a pipeline is, trace <code>seq 3 | wc -l</code> with one strace file per process (<code>-ff</code>):</p>
${run('c171-shell', "echo 'seq 3 | wc -l' | strace", 2)}
<p>Read it as three columns of work. The shell (1922) makes <strong>one</strong> pipe — fds 3 (read end) and 4 (write end), both close-on-exec — sets the process group of both children, and waits for both; the pipeline’s status is the last one’s. Child 1923 makes itself the leader of a new group (<code>setpgid(0, 0)</code>), puts the write end on its stdout with <code>dup3(4, 1, 0)</code> and becomes <code>seq</code>. Child 1924 joins that group, puts the read end on its stdin with <code>dup3(3, 0, 0)</code> and becomes <code>wc</code>. (The C code calls <code>dup2</code>; on arm64 there is no <code>dup2</code> system call, so glibc issues <code>dup3</code> — Chapter 11’s "wrapper ≠ system call" again.) <code>setpgid</code> appears on <strong>both</strong> sides on purpose: whichever runs first, the group exists before the shell sends a signal to it.</p>
<p>Background jobs and the <code>Done</code> message:</p>
${run('c171-shell', "printf 'sleep 0.2 &")}

<h3>One missing <code>close()</code> is enough to fail</h3>
<p>The most common bug in student shells, planted on purpose: the parent forgets to close the write end of each pipe.</p>
${run('c171-shell', "sed 's|if (pfd", 2)}
<p>Two cases fail, both for the same reason. <code>wc</code> reads until end-of-file, and end-of-file on a pipe only arrives when <strong>every</strong> write end is closed — including the copy the shell still holds. The five-stage pipeline hangs until the test’s 5-second timeout; after 200 pipelines the shell holds 200 leaked fds. <code>yes | head -3</code> still passes: <code>head</code> exits, and <code>yes</code> dies of SIGPIPE because the read end <em>was</em> closed. One line of C, two symptoms, two tests.</p>
${lab('process', 'shell', 'en', 'A shell runs one command: fork, exec in the child, wait in the parent. Your msh does this once per pipeline stage, with a pipe between neighbours and the same process group for all of them.', { tour: 'process-shell' })}
${lab('fdtable', 'redirect', 'en', 'Redirection is just dup2 on the child’s fd table before exec: 2&gt;&amp;1 &gt; f and &gt; f 2&gt;&amp;1 give different tables — the order of your dup2 calls is the order of the operators.')}

<div class="pitfall co-tieu-de">
<p><strong>"[killed by signal 2]" appears AFTER the next command’s output.</strong> It did in the first version of the reference solution. When stdout is a terminal, stdio flushes at every newline; when it is a file or a pipe — as in every test and every CI log — stdio buffers 4 KiB and flushes later, so the shell’s own messages arrive after the output of children that wrote straight to the fd. Fix: <code>setvbuf(stdout, NULL, _IOLBF, 0)</code> at start (or <code>fflush(stdout)</code> before every <code>fork</code>). The same buffer duplicated by <code>fork</code> is what printed lines twice in ${a('os-1-2-fork-exec', 'lesson 1.2')}.</p>
</div>

${details('<strong>Reference solution: msh.c (open after your own version passes, or after a whole stuck session)</strong>', src('ch17/shell/msh.c', 'c'))}

<h3>💼 What to put on your CV</h3>
<ul>
<li><strong>Line:</strong> "Wrote a Unix shell in C (220 lines): N-stage pipelines, I/O redirection, background job control with process groups and SIGCHLD reaping; verified with a 15-case automated acceptance suite (10/10)."</li>
<li><strong>Link:</strong> a repository with <code>msh.c</code>, the test script, its output, and the README — reviewers open the test output first.</li>
<li><strong>Be ready to explain:</strong> why <code>cd</code> must be a built-in; why the parent closes pipe ends; why <code>setpgid</code> is called twice; what exit status 130 means. These are standard interview questions (16.6).</li>
</ul>

<h3>🧪 Practice (one evening, then the four milestones)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a Dockerfile line <code>RUN make build 2&gt;&amp;1 | tee build.log</code> keeps "succeeding" even when <code>make</code> fails, and the team asks why. You want to understand it from the inside by building the part of a shell that runs that line.</p>
<ol>
<li>Copy <code>ctsh.c</code> to <code>ch17/mine/msh.c</code> and run the acceptance tests: confirm 0/10.</li>
<li>Implement M1 and M2 (tokenizer, <code>$?</code>, redirection in the child). Re-run: M1 and M2 must pass.</li>
<li>Implement a two-stage pipe; run <code>ls /nope 2&gt;&amp;1 | wc -l</code> and <code>false | true; echo $?</code> in your shell and in bash.</li>
<li>Explain in two sentences why the Dockerfile line "succeeds" (hint: whose status does a pipeline return?) and how bash’s <code>set -o pipefail</code> changes it.</li>
</ol>
<p><strong>Done when:</strong> <code>test-shell.sh</code> shows M1 and M2 as PASS on your code, and your two-sentence answer names "the status of the last stage" and <code>pipefail</code>.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['pipeline', 'Several processes connected by pipes; the shell creates all of them and returns the exit status of the last one (unless pipefail).'],
  ['dup2(old, new)', 'Makes fd <code>new</code> refer to the same open file as <code>old</code> — the whole mechanism behind &lt;, &gt; and |.'],
  ['O_CLOEXEC', 'Flag that closes an fd automatically at exec, so children do not inherit pipe ends they never use.'],
  ['process group / job', 'A set of processes sharing a PGID; signals from the terminal (Ctrl-C, Ctrl-Z) go to the whole foreground group.'],
  ['SIGCHLD + WNOHANG', 'The kernel tells the shell a child changed state; reaping with waitpid(-1, WNOHANG) in the main loop leaves no zombies.'],
  ['built-in', 'A command the shell runs itself, without fork — required for anything that must change the shell’s own state (cd, exit).'],
  ['acceptance test', 'An automated check written from the specification, run against any implementation; it decides "done", not the author.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A shell is a loop of fork, exec and wait; redirection is dup2 in the child; a pipeline is N children and N−1 pipes.</li>
<li>The parent must close every pipe end it does not use — one forgotten close() hangs pipelines and leaks fds (measured: 9/10).</li>
<li>Jobs need their own process group (setpgid on both sides) so Ctrl-C kills the job, not the shell; status 130 = 128 + SIGINT.</li>
<li>Reap background children with SIGCHLD + waitpid(WNOHANG) in the main loop; no zombie remains.</li>
<li>The reference solution is 221 lines and scores 10/10; the untouched ctsh.c scores 0/10 on the same tests.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/pipe.2.html', '📄', 'pipe(2) — Linux manual page', 'pipe and pipe2, O_CLOEXEC, and what happens when all write ends are closed.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/setpgid.2.html', '📄', 'setpgid(2) — Linux manual page', 'Process groups and sessions: the basis of job control.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Dự án 1 / 4</span>
<h2>Dự án 1: mini shell bằng C</h2>
<p class="lead">Mỗi dòng <code>RUN</code> trong Dockerfile, mỗi bước CI và mỗi lần <code>npm run</code> đều kết thúc ở một shell gọi <code>fork</code>, <code>pipe</code>, <code>dup2</code>, <code>execve</code> và <code>wait</code>. Ở Chương 1 bạn đã đọc <code>ctsh.c</code>, một shell 40 dòng chỉ chạy được một chương trình mỗi lần. Câu hỏi của dự án này: <strong>bạn có nuôi nó lớn thành một shell cư xử như bash ở những phần bạn dùng hằng ngày — ống dẫn, chuyển hướng, việc chạy nền, Ctrl-C — và chứng minh bằng bộ kiểm do máy chạy không?</strong></p>

<h3>Chương 17 làm việc thế nào</h3>
<p>Chương 0–16 dạy từng cơ chế một. Chương này bắt bạn <em>dùng</em> chúng cùng lúc, đúng như khi đi làm. Mỗi dự án được viết thành một <strong>bản in</strong> (tờ đề in được): tổng quan, cấu trúc bắt buộc, hợp đồng giao diện, yêu cầu chức năng kèm điểm, các mốc, bộ kiểm nghiệm thu, lỗi hay bị trừ điểm và cách nộp. Mỗi tờ đề đi kèm:</p>
<ul>
<li>một <strong>kịch bản kiểm nghiệm thu</strong> chạy thật trong ảnh <code>os-lab</code> của khoá, in <code>PASS/FAIL</code> theo từng mốc và điểm trên thang 10;</li>
<li>một <strong>lời giải mẫu</strong> trong <code>lab/code/ch17/</code> đạt 10/10 trên chính kịch bản đó (output bên dưới là lần chạy thật);</li>
<li>một <strong>thang điểm</strong> gắn mỗi mốc với số điểm, và một mục <strong>ghi gì vào CV</strong>.</li>
</ul>
<table>
<tr><th>Dự án</th><th>Thời gian</th><th>Chứng minh được gì</th><th>Kiểm bằng</th></tr>
<tr><td>17.1 Mini shell (C)</td><td>3–4 ngày</td><td>tiến trình, fd, ống dẫn, nhóm tiến trình, tín hiệu</td><td><code>shell/test-shell.sh</code></td></tr>
<tr><td>17.2 Máy chủ HTTP có thread pool (C hoặc Java)</td><td>3–4 ngày</td><td>luồng, hàng đợi có giới hạn, timeout, tắt êm, đo đạc</td><td><code>server/test-server.sh</code></td></tr>
<tr><td>17.3 Chẩn đoán năm sự cố cài sẵn</td><td>1–2 ngày</td><td>bộ công cụ quan sát của cả khoá, dưới áp lực</td><td><code>incident/check.sh</code></td></tr>
<tr><td>17.4 Báo cáo sự cố + câu chuyện phỏng vấn</td><td>nửa ngày</td><td>giải thích điều mình tìm ra, không đổ lỗi</td><td>mẫu trong 17.4</td></tr>
<tr><td>17.5 Mở rộng: mini container runtime</td><td>2–3 ngày</td><td>namespace, pivot_root, cgroup, capability</td><td><code>ctr/test-ctr.sh</code></td></tr>
</table>
<p>Làm trong thư mục riêng của bạn, chạy bộ kiểm thường xuyên, và chỉ mở lời giải mẫu khi bản của bạn đã qua — hoặc khi bạn đã kẹt ở một mốc trọn một buổi.</p>

<h3>Tờ đề — Dự án 1: <code>msh</code></h3>
<p><strong>1. Tổng quan.</strong> Dựng <code>msh</code>, một shell tương tác viết bằng C, bắt đầu từ <code>ctsh.c</code> (${a('os-1-2-fork-exec', 'bài 1.2')}). Nó đọc từng dòng từ đầu vào chuẩn, chạy dòng đó và giữ <code>$?</code>. Khi đầu vào chuẩn là terminal thì in dấu nhắc <code>msh$ </code>; khi là file hay ống dẫn (như trong bộ kiểm) thì không in dấu nhắc.</p>
<p><strong>2. Cấu trúc bắt buộc.</strong></p>
${cmd('mine/', '└── msh.c          # một file, dịch bằng: gcc -Wall -Wextra -Werror -O2 -o msh msh.c')}
<p><strong>3. Hợp đồng giao diện</strong> — bộ kiểm dựa vào đúng các chuỗi này:</p>
<table>
<tr><th>Đầu vào</th><th>Phải làm</th></tr>
<tr><td><code>cmd a b</code>, <code>'nhiều từ'</code>, <code>"x y"</code></td><td>chạy chương trình với các đối số đó; dấu nháy gom từ và bị bỏ đi</td></tr>
<tr><td><code>$?</code>, <code>$$</code></td><td>mã thoát của lệnh trước; PID của chính shell</td></tr>
<tr><td><code>&lt; f</code> · <code>&gt; f</code> · <code>&gt;&gt; f</code> · <code>2&gt; f</code> · <code>2&gt;&amp;1</code></td><td>chuyển hướng stdin, stdout (ghi đè / nối thêm), stderr, stderr vào stdout</td></tr>
<tr><td><code>a | b | c</code> (tối đa 16 tầng)</td><td>một ống dẫn; <code>$?</code> = mã thoát của tầng <strong>cuối</strong></td></tr>
<tr><td><code>cmd &amp;</code></td><td>chạy nền, in <code>[n] PID</code>; khi xong in <code>[n] Done (mã)⇥lệnh</code> trước dấu nhắc kế tiếp</td></tr>
<tr><td><code>a ; b</code></td><td>chạy lần lượt</td></tr>
<tr><td>lệnh dựng sẵn</td><td><code>cd [thư mục]</code>, <code>exit [n]</code>, <code>jobs</code> (<code>[n] Running⇥lệnh</code>), <code>fg [%n]</code>, <code>wait</code></td></tr>
<tr><td>chương trình không tồn tại</td><td><code>msh: TÊN: No such file or directory</code> ra stderr, mã 127</td></tr>
<tr><td>job bị tín hiệu giết</td><td>in <code>[killed by signal N]</code>, mã 128 + N</td></tr>
<tr><td>Ctrl-C (SIGINT)</td><td>giết job đang chạy tiền cảnh, <strong>không bao giờ</strong> giết shell</td></tr>
</table>
<p><strong>4. Yêu cầu chức năng và điểm</strong> — đúng những gì <code>test-shell.sh</code> kiểm:</p>
${rubric([
  ['M1', 'Chạy chương trình: đối số, <code>$?</code>, lệnh lạ → 127, <code>cd</code> đổi thư mục của chính shell', '2', '4 ca'],
  ['M2', 'Chuyển hướng: <code>&gt;</code> <code>&lt;</code> <code>&gt;&gt;</code> <code>2&gt;</code> <code>2&gt;&amp;1</code>', '1.5', '3 ca'],
  ['M3', 'Ống dẫn: đối số có nháy, 5 tầng với mã thoát của tầng cuối, <code>yes | head -3</code> kết thúc, con chỉ thấy fd 0 1 2', '2', '4 ca'],
  ['M4', 'Việc chạy nền: <code>&amp;</code>, <code>jobs</code>, thông báo <code>Done</code>, không còn zombie', '2', '1 ca'],
  ['M5', 'Tín hiệu: job có nhóm tiến trình riêng; SIGINT vào nhóm đó giết job (mã 130), SIGINT vào shell bị bỏ qua', '1.5', '1 ca'],
  ['M6', 'Ngăn nắp: <code>exit n</code>; shell không rò fd sau 200 ống dẫn', '1', '2 ca'],
], ['Yêu cầu', 'Điểm', 'Tổng'])}
<p><strong>5. Các mốc</strong> — mỗi buổi một mốc, mỗi mốc dựa trên một bài bạn đã học:</p>
<ol>
<li><strong>Ngày 1 — M1 + M2.</strong> Bộ tách từ hiểu dấu nháy; <code>$?</code>/<code>$$</code>; chuyển hướng = <code>open</code> + <code>dup2</code> + <code>close</code> trong tiến trình <em>con</em>, sau <code>fork</code>, trước <code>execvp</code> (${a('os-9-5-fd', 'bài 9.2')}).</li>
<li><strong>Ngày 2 — M3.</strong> Mỗi tầng một <code>pipe2(O_CLOEXEC)</code>; con nối các đầu ống bằng <code>dup2</code>; <strong>cha đóng mọi đầu ống nó không dùng</strong> (${a('os-10-1-fd', 'bài 10.1')}).</li>
<li><strong>Ngày 3 — M4.</strong> Bảng job; handler <code>SIGCHLD</code> chỉ bật một cờ; thu dọn bằng <code>waitpid(-1, …, WNOHANG)</code> ở vòng lặp chính (${a('os-1-4-vong-doi', 'bài 1.4')}).</li>
<li><strong>Ngày 4 — M5 + M6.</strong> <code>setpgid</code> ở cả cha lẫn con; shell bỏ qua SIGINT/SIGQUIT/SIGTSTP, con trả về mặc định; <code>tcsetpgrp</code> khi chạy tương tác; chạy bộ kiểm tới khi 10/10.</li>
</ol>
<p><strong>6. Kiểm nghiệm thu.</strong> Từ thư mục <code>lab/code</code> của kho khoá học:</p>
${cmd('mkdir -p ch17/mine && cp ch01/ctsh.c ch17/mine/msh.c          # điểm xuất phát', 'docker run --rm --label oslab=1 -v "$PWD":/lab -w /lab/ch17 os-lab shell/test-shell.sh /lab/ch17/mine')}
<p>Đây là điểm của <code>ctsh.c</code> nguyên bản — nó không có chuyển hướng, không có ống dẫn, không có job, và in dấu nhắc mà bộ kiểm không chờ:</p>
${run('c171-shell', 'shell/test-shell.sh /tmp/start')}
<p><strong>7. Lỗi hay bị trừ điểm.</strong> Cha giữ đầu ghi của ống (người đọc không bao giờ thấy EOF — ống dẫn treo); chuyển hướng trong cha thay vì trong con (stdout của chính shell mất); gọi <code>printf</code> hay <code>malloc</code> trong handler <code>SIGCHLD</code> (không an toàn với tín hiệu); <code>waitpid(-1)</code> chặn ở nhánh tiền cảnh và cướp mất mã thoát của job nền; quên <code>_exit</code> sau khi <code>execvp</code> thất bại (giờ có hai shell cùng đọc một đầu vào).</p>
<p><strong>8. Nộp bài.</strong> <code>msh.c</code> + output của <code>test-shell.sh</code> + README 10 dòng: cái gì chạy, cái gì chưa, một lỗi bạn gặp và cách bạn tìm ra nó.</p>

<h3>Lời giải mẫu, đo thật</h3>
<p><code>msh.c</code> mẫu dài 221 dòng. Nó qua mọi ca:</p>
${run('c171-shell', 'wc -l shell/msh.c', 2)}
<p>Để <em>thấy</em> một ống dẫn là gì, theo dõi <code>seq 3 | wc -l</code> với mỗi tiến trình một file strace (<code>-ff</code>):</p>
${run('c171-shell', "echo 'seq 3 | wc -l' | strace", 2)}
<p>Đọc thành ba cột việc. Shell (1922) tạo <strong>một</strong> ống — fd 3 (đầu đọc) và 4 (đầu ghi), cả hai tự đóng khi exec — đặt nhóm tiến trình cho cả hai con rồi chờ cả hai; mã thoát của ống dẫn là của con cuối. Con 1923 tự làm trưởng một nhóm mới (<code>setpgid(0, 0)</code>), đặt đầu ghi vào stdout bằng <code>dup3(4, 1, 0)</code> rồi thành <code>seq</code>. Con 1924 vào nhóm đó, đặt đầu đọc vào stdin bằng <code>dup3(3, 0, 0)</code> rồi thành <code>wc</code>. (Mã C gọi <code>dup2</code>; trên arm64 không có system call <code>dup2</code>, nên glibc phát <code>dup3</code> — lại là "hàm bọc ≠ system call" của Chương 11.) <code>setpgid</code> xuất hiện ở <strong>cả hai</strong> phía là có chủ đích: ai chạy trước cũng vậy, nhóm đã tồn tại trước khi shell gửi tín hiệu vào nó.</p>
<p>Việc chạy nền và thông báo <code>Done</code>:</p>
${run('c171-shell', "printf 'sleep 0.2 &")}

<h3>Thiếu một <code>close()</code> là đủ trượt</h3>
<p>Lỗi hay gặp nhất trong shell của sinh viên, cài vào có chủ đích: cha quên đóng đầu ghi của mỗi ống.</p>
${run('c171-shell', "sed 's|if (pfd", 2)}
<p>Hai ca trượt, cùng một nguyên nhân. <code>wc</code> đọc tới hết file, mà hết file trên một ống chỉ tới khi <strong>mọi</strong> đầu ghi đã đóng — kể cả bản sao shell còn giữ. Ống dẫn 5 tầng treo tới khi bộ kiểm cắt sau 5 giây; sau 200 ống dẫn shell giữ 200 fd rò. <code>yes | head -3</code> vẫn qua: <code>head</code> thoát, và <code>yes</code> chết vì SIGPIPE vì đầu đọc <em>đã</em> được đóng. Một dòng C, hai triệu chứng, hai ca kiểm.</p>
${lab('process', 'shell', 'vi', 'Shell chạy một lệnh: fork, exec trong con, wait trong cha. msh của bạn làm việc đó một lần cho mỗi tầng của ống dẫn, với một ống giữa hai tầng kề nhau và cùng một nhóm tiến trình cho tất cả.', { tour: 'process-shell' })}
${lab('fdtable', 'redirect', 'vi', 'Chuyển hướng chỉ là dup2 lên bảng fd của con trước exec: 2&gt;&amp;1 &gt; f và &gt; f 2&gt;&amp;1 cho ra hai bảng khác nhau — thứ tự các lời gọi dup2 của bạn chính là thứ tự các toán tử.')}

<div class="pitfall co-tieu-de">
<p><strong>"[killed by signal 2]" hiện ra SAU output của lệnh kế tiếp.</strong> Bản đầu tiên của lời giải mẫu bị đúng như vậy. Khi stdout là terminal, stdio xả ở mỗi dấu xuống dòng; khi là file hay ống dẫn — như trong mọi bộ kiểm và mọi log CI — stdio gom 4 KiB rồi mới xả, nên thông báo của chính shell tới sau output của các con vốn ghi thẳng vào fd. Cách sửa: <code>setvbuf(stdout, NULL, _IOLBF, 0)</code> lúc khởi động (hoặc <code>fflush(stdout)</code> trước mỗi <code>fork</code>). Chính bộ đệm đó bị <code>fork</code> nhân đôi là thứ đã in một dòng hai lần ở ${a('os-1-2-fork-exec', 'bài 1.2')}.</p>
</div>

${details('<strong>Lời giải mẫu: msh.c (mở khi bản của bạn đã qua, hoặc sau trọn một buổi bị kẹt)</strong>', src('ch17/shell/msh.c', 'c'))}

<h3>💼 Ghi gì vào CV</h3>
<ul>
<li><strong>Một dòng:</strong> "Viết một Unix shell bằng C (220 dòng): ống dẫn N tầng, chuyển hướng I/O, quản lý việc chạy nền bằng nhóm tiến trình và thu dọn SIGCHLD; kiểm bằng bộ nghiệm thu tự động 15 ca (10/10)."</li>
<li><strong>Đường dẫn:</strong> một repository có <code>msh.c</code>, kịch bản kiểm, output của nó và README — người tuyển dụng mở output kiểm trước tiên.</li>
<li><strong>Sẵn sàng giải thích:</strong> vì sao <code>cd</code> phải là lệnh dựng sẵn; vì sao cha đóng đầu ống; vì sao gọi <code>setpgid</code> hai lần; mã thoát 130 nghĩa là gì. Đây là các câu phỏng vấn quen thuộc (16.6).</li>
</ul>

<h3>🧪 Thực hành (một buổi tối, rồi bốn mốc)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một dòng Dockerfile <code>RUN make build 2&gt;&amp;1 | tee build.log</code> cứ "thành công" kể cả khi <code>make</code> hỏng, và cả nhóm hỏi vì sao. Bạn muốn hiểu từ bên trong bằng cách tự dựng phần shell chạy dòng đó.</p>
<ol>
<li>Chép <code>ctsh.c</code> thành <code>ch17/mine/msh.c</code> rồi chạy bộ kiểm nghiệm thu: xác nhận 0/10.</li>
<li>Làm M1 và M2 (tách từ, <code>$?</code>, chuyển hướng trong con). Chạy lại: M1 và M2 phải qua.</li>
<li>Làm ống dẫn hai tầng; chạy <code>ls /nope 2&gt;&amp;1 | wc -l</code> và <code>false | true; echo $?</code> trong shell của bạn và trong bash.</li>
<li>Giải thích trong hai câu vì sao dòng Dockerfile "thành công" (gợi ý: ống dẫn trả về mã thoát của ai?) và <code>set -o pipefail</code> của bash đổi điều đó thế nào.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>test-shell.sh</code> cho M1 và M2 là PASS trên mã của bạn, và câu trả lời hai câu của bạn nêu được "mã thoát của tầng cuối" và <code>pipefail</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['pipeline (ống dẫn)', 'Nhiều tiến trình nối bằng ống; shell tạo tất cả và trả về mã thoát của tiến trình cuối (trừ khi bật pipefail).'],
  ['dup2(old, new)', 'Làm fd <code>new</code> trỏ tới cùng file đang mở với <code>old</code> — toàn bộ cơ chế đằng sau &lt;, &gt; và |.'],
  ['O_CLOEXEC', 'Cờ tự đóng fd lúc exec, để con không thừa hưởng những đầu ống nó không bao giờ dùng.'],
  ['process group / job (nhóm tiến trình / job)', 'Tập tiến trình chung một PGID; tín hiệu từ terminal (Ctrl-C, Ctrl-Z) tới cả nhóm tiền cảnh.'],
  ['SIGCHLD + WNOHANG', 'Nhân báo shell một con đổi trạng thái; thu dọn bằng waitpid(-1, WNOHANG) ở vòng lặp chính thì không còn zombie.'],
  ['built-in (lệnh dựng sẵn)', 'Lệnh shell tự chạy, không fork — bắt buộc cho mọi thứ phải đổi trạng thái của chính shell (cd, exit).'],
  ['acceptance test (kiểm nghiệm thu)', 'Phép kiểm tự động viết từ đặc tả, chạy trên mọi bản cài đặt; nó quyết định "xong", không phải tác giả.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Shell là vòng lặp fork, exec, wait; chuyển hướng là dup2 trong con; ống dẫn là N con và N−1 ống.</li>
<li>Cha phải đóng mọi đầu ống nó không dùng — quên một close() là ống dẫn treo và rò fd (đo được: 9/10).</li>
<li>Job cần nhóm tiến trình riêng (setpgid ở cả hai phía) để Ctrl-C giết job chứ không giết shell; mã 130 = 128 + SIGINT.</li>
<li>Thu dọn con chạy nền bằng SIGCHLD + waitpid(WNOHANG) ở vòng lặp chính; không còn zombie.</li>
<li>Lời giải mẫu dài 221 dòng và đạt 10/10; ctsh.c nguyên bản được 0/10 trên cùng bộ kiểm.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/pipe.2.html', '📄', 'pipe(2) — Linux manual page', 'pipe và pipe2, O_CLOEXEC, và chuyện gì xảy ra khi mọi đầu ghi đã đóng.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/setpgid.2.html', '📄', 'setpgid(2) — Linux manual page', 'Nhóm tiến trình và phiên: nền tảng của quản lý job.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 17.2 — Máy chủ HTTP có thread pool ───────────────────────── */
    {
      title: '17.2 — Project 2: a thread-pool HTTP server — bounded queue, timeouts, graceful shutdown, measured under load|||17.2 — Dự án 2: máy chủ HTTP có thread pool — hàng đợi có giới hạn, timeout, tắt êm, đo dưới tải',
      slug: 'os-17-2-server',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tờ đề dự án 2: máy chủ HTTP bằng C (hoặc Java theo cùng hợp đồng dòng lệnh) với N luồng, hàng đợi có giới hạn trả 503 ngay khi đầy, 408 cho khách im lặng, tắt êm bằng SIGTERM (thôi nhận, làm nốt, thoát 0 trong 8 s); bộ kiểm 9 ca chạy trong os-lab (mẫu 10/10; quên close(fd) ⇒ fd 6 → 54; không chặn SIGTERM ⇒ exit 143, request đang chạy mất); đo bằng máy tạo tải tự viết: định luật Little 64 kết nối ⇒ 182 ms, hàng đợi 8 ⇒ p99 32 ms, 32 luồng cho việc chờ ⇒ 2.865 req/s, việc CPU dừng ở số lõi.',
      content: `${G172}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Project 2 of 4</span>
<h2>Project 2: a thread-pool HTTP server</h2>
<p class="lead">Tomcat in Spring Boot, the worker pool behind Node’s <code>fs</code> calls, the database connection pool: every backend you will touch is a fixed set of threads in front of a queue. Chapter 3.5 compared the models and Chapter 4.7 built bounded queues; this project makes you build the whole thing in C and run it under load. The question: <strong>what does a server do when more work arrives than its threads can finish — and can you make it fail fast, stay healthy and shut down without losing a request?</strong></p>

<h3>The brief — Project 2: <code>tpserver</code></h3>
<p><strong>1. Overview.</strong> An HTTP/1.1 server (one request per connection, <code>Connection: close</code>) with one accept thread and a fixed pool of worker threads that take connections from a <strong>bounded</strong> queue. Write it in C with pthreads; Java (<code>ServerSocket</code> + <code>ThreadPoolExecutor</code> + <code>ArrayBlockingQueue</code> + a shutdown hook) is accepted if it follows the same command-line contract, because the tests only talk to it over TCP and signals.</p>
<p><strong>2. Required structure.</strong></p>
${cmd('server/', '├── tpserver.c     # gcc -Wall -Wextra -Werror -O2 -pthread -o tpserver tpserver.c', '├── loadgen.c      # given: N parallel clients for S seconds, prints status counts and p50/p95/p99', '└── test-server.sh # given: the acceptance tests')}
<p><strong>3. Interface contract.</strong> Command line: <code>tpserver PORT --threads N --queue Q --timeout-ms T</code>.</p>
<table>
<tr><th>Request / event</th><th>Must answer</th></tr>
<tr><td><code>GET /</code> · <code>GET /healthz</code></td><td>200 <code>hello</code> · 200 <code>ok</code></td></tr>
<tr><td><code>GET /work?ms=N</code></td><td>sleep N ms (stands for a database or API call), then 200</td></tr>
<tr><td><code>GET /cpu?n=N</code></td><td>spin N million iterations (CPU-bound work), then 200</td></tr>
<tr><td><code>GET /stats</code></td><td>200 with served, rejected, timeouts, queued, busy, threads</td></tr>
<tr><td>anything else</td><td>404</td></tr>
<tr><td>queue already holds Q connections</td><td><strong>503 immediately</strong> with <code>Retry-After: 1</code>, from the accept thread</td></tr>
<tr><td>client sends no complete header within T ms</td><td>408, close, the worker is free again</td></tr>
<tr><td>SIGTERM or SIGINT</td><td>stop accepting (new connections refused), finish running + queued requests, exit 0 within 8 s</td></tr>
</table>
<p><strong>4. Functional requirements and marks</strong> — what <code>test-server.sh</code> checks, each case on a fresh server:</p>
${rubric([
  ['S1', 'HTTP basics: <code>/</code>, <code>/healthz</code>, 404', '1', '1 case'],
  ['S2', 'Exactly N worker threads (<code>/proc/PID/task</code> = N + 1), and they run in parallel: 8 × 500 ms on 4 threads ≈ 1 s', '2.5', '2 cases'],
  ['S3', 'Bounded queue: 2 threads + queue 2, 10 clients ⇒ 4 served, 6 get 503 in under 300 ms', '2', '1 case'],
  ['S4', 'Timeout: a silent client gets 408 after ~T ms and the only worker serves the next request', '1.5', '1 case'],
  ['S5', 'Graceful shutdown: refused after SIGTERM, the in-flight request finishes with 200, exit 0', '2', '3 cases'],
  ['S6', 'No fd leak after thousands of requests (200, 404 and 503 paths)', '1', '1 case'],
], ['Requirement', 'Marks', 'Total'])}
<p><strong>5. Milestones.</strong></p>
<ol>
<li><strong>Day 1 — socket + one thread.</strong> <code>socket/bind/listen/accept</code>, parse the request line, answer with <em>one</em> write (header + body together — the 41 ms Nagle trap of ${a('os-11-2-strace-ltrace', 'lesson 11.3')}). S1 passes.</li>
<li><strong>Day 2 — the pool.</strong> A ring buffer of fds with a mutex and a condition variable (${a('os-5-2-mutex', 'lesson 5.2')}, ${a('os-4-7-pipeline', 'lesson 4.7')}); when it is full, the accept thread answers 503 itself. S2, S3 pass.</li>
<li><strong>Day 3 — timeouts.</strong> Never call a blocking <code>recv</code> without a deadline: <code>poll</code> with the remaining time, or <code>SO_RCVTIMEO</code>. Send with <code>MSG_NOSIGNAL</code> so a vanished client is an <code>EPIPE</code>, not a dead server. S4 passes.</li>
<li><strong>Day 4 — shutdown + measuring.</strong> Block SIGTERM/SIGINT <em>before</em> creating threads and read them from a <code>signalfd</code> polled next to the listening socket (signals and EINTR: ${a('os-11-6-errno-tin-hieu', 'lesson 11.5')}); on signal: close the listening socket, set <code>stopping</code>, broadcast, join with a deadline. Then run <code>loadgen</code> and explain the numbers. S5, S6 pass.</li>
</ol>
<p><strong>6. Acceptance tests.</strong></p>
${cmd('docker run --rm --label oslab=1 -v "$PWD":/lab -w /lab/ch17 os-lab server/test-server.sh                      # C: builds server/tpserver.c', 'docker run --rm --label oslab=1 -v "$PWD":/lab -w /lab/ch17 os-lab server/test-server.sh "java /lab/ch17/mine/Server.java"   # any language')}
<p><strong>7. Common deductions.</strong> An unbounded queue (memory grows, every client waits — measured below); a thread per connection (Chapter 10.4: stacks and context switches); <code>close(fd)</code> missing on one path (often the 404 or 503 path); handling SIGTERM with a handler that calls <code>printf</code>/<code>exit</code> from a signal context; joining threads without a deadline, so <code>docker stop</code> ends in SIGKILL and exit 137 anyway (${a('os-1-5-pid1', 'lesson 1.5')}).</p>
<p><strong>8. Submission.</strong> Code, test output, and a one-page <strong>load report</strong>: the table of the measurements below re-run on your machine, with one sentence per row explaining the number.</p>

<h3>The reference solution, measured</h3>
${run('c172-server', 'wc -l server/tpserver.c', 2)}
<p>Each test starts a fresh server on its own port. S3 is the heart of the project: with 2 threads and a queue of 2, exactly 4 of 10 simultaneous clients are served and 6 are told "busy" at once instead of hanging.</p>
<h3>Two planted bugs, two failing tests</h3>
${run('c172-server', "sed 's|        close(fd);", 2)}
<p>Without <code>close(fd)</code> the server holds 54 fds instead of 6 after a short burst — keep going and <code>accept</code> fails with <code>EMFILE</code> (${a('os-2-5-mang-fd', 'lesson 2.5')}). Without the blocked signal mask, SIGTERM takes its default action: the process dies at once with 143 (128 + 15) and the request that was running gets no answer at all (<code>000</code>). That is exactly what happens to every deploy of a server that ignores SIGTERM.</p>

<h3>Measuring it: Little’s law in front of your eyes</h3>
<p>Four threads, each request "waits for the database" for 10 ms, so the pool can finish at most 4 / 0.010 s = 400 requests per second. Now raise the number of clients:</p>
${run('c172-server', "/tmp/lg 127.0.0.1 8001", 3)}
<p>Throughput stops at ~340/s whatever the load (the rest of the 400 goes to connection setup in a 4-CPU container). What grows is <strong>waiting</strong>: <em>Little’s law</em> says the number in the system L = throughput λ × time in the system W, so with 64 clients W = 64 / 347 ≈ 0.184 s — measured p50: 182 ms. Adding clients to a saturated server adds only latency.</p>
${run('c172-server', "/tmp/lg 127.0.0.1 8002")}
<p>Same 64 clients, queue of 8: every accepted request waits for at most (4 + 8) / 4 × 10 ms ≈ 30 ms — measured p50 31.1 ms, p99 32.3 ms — and everything beyond that gets an immediate 503 the client can retry or show as "busy". Throughput is the same; latency is bounded. This is <strong>load shedding</strong>, and it is why Tomcat has <code>acceptCount</code> and why a database pool has a timeout.</p>
${lab('coordinated-omission', 'conns', 'en', 'loadgen is a closed loop, like hey: each client waits for its answer. With many connections the queueing shows up even “from send” (≈ 190 ms here) — but with few, a stall disappears from the numbers. Read lesson 15.6 before you trust a p99 from your own load test.')}
${run('c172-server', "/tmp/lg 127.0.0.1 8003", 4)}
<p>For work that <em>waits</em>, more threads help: 32 threads give 2,865 req/s (64 clients / 32 threads = two waves of 10 ms ≈ 21 ms). For work that <em>computes</em>, threads beyond the number of cores (<code>nproc</code> = 4 here) only add context switches: 1 thread 190/s, 4 threads 727/s, 16 threads 634/s with a p95 of 75.6 ms instead of 23.4 ms. Size a pool by what its tasks do (${a('os-4-5-so-sanh', 'lesson 4.5')}).</p>
${lab('threadpool', 'overload', 'en', 'More arrivals than the pool can finish: watch the queue grow and latency climb while throughput stays flat — then cap the queue and see 503s replace the wait.')}
${lab('threadpool', 'mm1', 'en', 'Queueing theory in one picture: as utilisation approaches 100 %, waiting time explodes. Your measured 11 → 45 → 182 ms is this curve.')}

<h3>Graceful shutdown, seen from the server’s log</h3>
${run('c172-server', "(for i in 1 2 3; do curl")}
<p>Three 800 ms requests on two threads; SIGTERM arrives 0.2 s in. Two are running and one is queued — the log says so — and all three still get their answer before the process exits 0, 1.4 s after the signal. A container running this server behind <code>docker stop</code> (10 s grace) never loses a request.</p>
${lab('threadpool', 'timeout', 'en', 'A slow downstream holds threads: without timeouts the pool drains and healthy requests queue behind stuck ones. The 408 deadline of this project is the same protection on the client side.')}

<div class="pitfall co-tieu-de">
<p><strong>"I added more threads and it got slower."</strong> Measured above: for CPU-bound requests, 16 threads on 4 cores gave lower throughput (634 vs 727/s) and three times the p95. Threads are not free capacity; cores are. For waiting work the opposite holds — so measure which kind your endpoint is before tuning <code>server.tomcat.threads.max</code> or <code>UV_THREADPOOL_SIZE</code>, and never tune without a load generator and a percentile.</p>
</div>

${details('<strong>Reference solution: tpserver.c (open after your own version passes)</strong>', src('ch17/server/tpserver.c', 'c'))}
${details('<strong>Given: loadgen.c — the load generator used for every number in this lesson</strong>', src('ch17/server/loadgen.c', 'c'))}

<h3>💼 What to put on your CV</h3>
<ul>
<li><strong>Line:</strong> "Built a multithreaded HTTP server in C (pthreads): bounded work queue with 503 load shedding, per-request deadlines (408), graceful SIGTERM drain via signalfd; load-tested with a custom generator (Little’s law validated: 64 clients ⇒ 182 ms p50 at 347 req/s)."</li>
<li><strong>Show:</strong> the load report table — numbers with a sentence each are what makes this stand out from "built a web server".</li>
<li><strong>Be ready for:</strong> "how many threads should a pool have?", "what happens when the queue is full?", "what does docker stop do?" (16.6, 16.7).</li>
</ul>

<h3>🧪 Practice (after the milestones)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the team’s Spring Boot API answers in 30 ms at night and in 4 s at noon, with CPU at 35 %. Someone proposes raising the Tomcat thread count from 200 to 2,000. You want data, not opinions.</p>
<ol>
<li>Run your server with <code>--threads 4 --queue 4096</code> and <code>loadgen … /work?ms=10</code> at 4, 16 and 64 connections. Compute λ × W and compare with the connection count.</li>
<li>Repeat with <code>--queue 8</code>: record p99 and the number of 503s.</li>
<li>Repeat with <code>/cpu?n=2</code> at 1, <code>nproc</code> and 4 × <code>nproc</code> threads.</li>
<li>Write three sentences for the team: is noon latency queueing or computing, what raising threads would do, and what to change instead.</li>
</ol>
<p><strong>Done when:</strong> your table shows throughput flat while latency grows with connections, λ × W within 10 % of the connection count, and your recommendation names the bottleneck (the 10 ms "database" wait, not the threads).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['thread pool', 'A fixed set of threads taking tasks from a queue — caps concurrency, avoids a thread per connection.'],
  ['bounded queue', 'A queue with a capacity; when full, new work is rejected instead of waiting forever.'],
  ['load shedding (503)', 'Refusing work you cannot finish in time, so the work you accept stays fast.'],
  ['Little’s law', 'L = λ × W: items in the system = throughput × time in the system. Holds for any stable queue.'],
  ['request deadline (408)', 'A maximum time to receive a request; stops slow or silent clients from holding threads.'],
  ['graceful shutdown', 'On SIGTERM: stop accepting, finish in-flight and queued work, exit 0 before the orchestrator’s SIGKILL.'],
  ['signalfd', 'A file descriptor that delivers signals as readable events, so a poll loop handles SIGTERM like any input.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A pool of N threads with 10 ms of waiting per request caps throughput at ≈ N / 0.01 s; more clients only add latency (Little’s law: 64 / 347 ≈ 184 ms, measured 182 ms).</li>
<li>A bounded queue trades a few 503s for bounded latency: queue 8 ⇒ p99 32 ms instead of 204 ms.</li>
<li>More threads help waiting work (32 threads: 2,865/s) and hurt computing work beyond the core count (16 threads on 4 cores: 634/s and 3× the p95).</li>
<li>Graceful shutdown = blocked signals + signalfd + close the listener + drain + join with a deadline; without it, SIGTERM means exit 143 and lost requests.</li>
<li>The acceptance tests catch the classic bugs: a missing close(fd) and an unhandled SIGTERM each fail exactly their case.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/signalfd.2.html', '📄', 'signalfd(2) — Linux manual page', 'Receive signals through a file descriptor; why the mask must be blocked in every thread.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html', '📄', 'ThreadPoolExecutor (Java 21)', 'Core/max threads, bounded queues and rejection policies — the same design in Java.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Dự án 2 / 4</span>
<h2>Dự án 2: máy chủ HTTP có thread pool</h2>
<p class="lead">Tomcat trong Spring Boot, pool luồng đứng sau các lời gọi <code>fs</code> của Node, pool kết nối CSDL: mọi backend bạn sẽ đụng tới đều là một nhóm luồng cố định đứng trước một hàng đợi. Bài 3.5 đã so các mô hình và bài 4.7 đã dựng hàng đợi có giới hạn; dự án này bắt bạn dựng trọn bằng C rồi chạy dưới tải. Câu hỏi: <strong>máy chủ làm gì khi việc tới nhiều hơn số việc các luồng của nó làm xong — và bạn có làm nó từ chối nhanh, giữ được sức khoẻ, tắt mà không mất request nào không?</strong></p>

<h3>Tờ đề — Dự án 2: <code>tpserver</code></h3>
<p><strong>1. Tổng quan.</strong> Một máy chủ HTTP/1.1 (mỗi kết nối một request, <code>Connection: close</code>) có một luồng accept và một pool cố định các luồng làm việc lấy kết nối từ một hàng đợi <strong>có giới hạn</strong>. Viết bằng C với pthreads; Java (<code>ServerSocket</code> + <code>ThreadPoolExecutor</code> + <code>ArrayBlockingQueue</code> + shutdown hook) cũng được nhận nếu theo đúng hợp đồng dòng lệnh, vì bộ kiểm chỉ nói chuyện với nó qua TCP và tín hiệu.</p>
<p><strong>2. Cấu trúc bắt buộc.</strong></p>
${cmd('server/', '├── tpserver.c     # gcc -Wall -Wextra -Werror -O2 -pthread -o tpserver tpserver.c', '├── loadgen.c      # cho sẵn: N khách song song trong S giây, in số câu theo mã trạng thái và p50/p95/p99', '└── test-server.sh # cho sẵn: bộ kiểm nghiệm thu')}
<p><strong>3. Hợp đồng giao diện.</strong> Dòng lệnh: <code>tpserver PORT --threads N --queue Q --timeout-ms T</code>.</p>
<table>
<tr><th>Request / sự kiện</th><th>Phải trả lời</th></tr>
<tr><td><code>GET /</code> · <code>GET /healthz</code></td><td>200 <code>hello</code> · 200 <code>ok</code></td></tr>
<tr><td><code>GET /work?ms=N</code></td><td>ngủ N ms (thay cho một lần gọi CSDL hay API), rồi 200</td></tr>
<tr><td><code>GET /cpu?n=N</code></td><td>quay N triệu vòng (việc nặng CPU), rồi 200</td></tr>
<tr><td><code>GET /stats</code></td><td>200 kèm served, rejected, timeouts, queued, busy, threads</td></tr>
<tr><td>còn lại</td><td>404</td></tr>
<tr><td>hàng đợi đã chứa đủ Q kết nối</td><td><strong>503 ngay</strong> kèm <code>Retry-After: 1</code>, từ luồng accept</td></tr>
<tr><td>khách không gửi xong header trong T ms</td><td>408, đóng kết nối, luồng làm việc rảnh trở lại</td></tr>
<tr><td>SIGTERM hoặc SIGINT</td><td>thôi nhận (kết nối mới bị từ chối), làm xong việc đang chạy + đang xếp hàng, thoát 0 trong vòng 8 s</td></tr>
</table>
<p><strong>4. Yêu cầu chức năng và điểm</strong> — những gì <code>test-server.sh</code> kiểm, mỗi ca trên một máy chủ mới:</p>
${rubric([
  ['S1', 'HTTP cơ bản: <code>/</code>, <code>/healthz</code>, 404', '1', '1 ca'],
  ['S2', 'Đúng N luồng làm việc (<code>/proc/PID/task</code> = N + 1), và chúng chạy song song: 8 × 500 ms trên 4 luồng ≈ 1 s', '2.5', '2 ca'],
  ['S3', 'Hàng đợi có giới hạn: 2 luồng + hàng 2, 10 khách ⇒ 4 được phục vụ, 6 nhận 503 trong dưới 300 ms', '2', '1 ca'],
  ['S4', 'Timeout: khách im lặng nhận 408 sau ~T ms và luồng duy nhất phục vụ request kế tiếp', '1.5', '1 ca'],
  ['S5', 'Tắt êm: sau SIGTERM bị từ chối, request đang chạy vẫn xong với 200, thoát 0', '2', '3 ca'],
  ['S6', 'Không rò fd sau hàng nghìn request (cả nhánh 200, 404 và 503)', '1', '1 ca'],
], ['Yêu cầu', 'Điểm', 'Tổng'])}
<p><strong>5. Các mốc.</strong></p>
<ol>
<li><strong>Ngày 1 — socket + một luồng.</strong> <code>socket/bind/listen/accept</code>, tách dòng request, trả lời bằng <em>một</em> lần ghi (header + thân cùng lúc — bẫy Nagle 41 ms của ${a('os-11-2-strace-ltrace', 'bài 11.3')}). Qua S1.</li>
<li><strong>Ngày 2 — pool.</strong> Một vòng đệm fd với mutex và biến điều kiện (${a('os-5-2-mutex', 'bài 5.2')}, ${a('os-4-7-pipeline', 'bài 4.7')}); khi đầy, chính luồng accept trả 503. Qua S2, S3.</li>
<li><strong>Ngày 3 — timeout.</strong> Đừng bao giờ gọi <code>recv</code> chặn mà không có hạn chót: <code>poll</code> với thời gian còn lại, hoặc <code>SO_RCVTIMEO</code>. Gửi bằng <code>MSG_NOSIGNAL</code> để một khách bỏ đi chỉ là <code>EPIPE</code>, không phải máy chủ chết. Qua S4.</li>
<li><strong>Ngày 4 — tắt êm + đo.</strong> Chặn SIGTERM/SIGINT <em>trước</em> khi tạo luồng và đọc chúng từ một <code>signalfd</code> được poll cạnh socket lắng nghe (tín hiệu và EINTR: ${a('os-11-6-errno-tin-hieu', 'bài 11.5')}); khi có tín hiệu: đóng socket lắng nghe, bật <code>stopping</code>, broadcast, join có hạn chót. Rồi chạy <code>loadgen</code> và giải thích các con số. Qua S5, S6.</li>
</ol>
<p><strong>6. Kiểm nghiệm thu.</strong></p>
${cmd('docker run --rm --label oslab=1 -v "$PWD":/lab -w /lab/ch17 os-lab server/test-server.sh                      # C: tự dịch server/tpserver.c', 'docker run --rm --label oslab=1 -v "$PWD":/lab -w /lab/ch17 os-lab server/test-server.sh "java /lab/ch17/mine/Server.java"   # ngôn ngữ bất kỳ')}
<p><strong>7. Lỗi hay bị trừ điểm.</strong> Hàng đợi không giới hạn (bộ nhớ phình, mọi khách đều chờ — đo ở dưới); mỗi kết nối một luồng (bài 10.4: stack và chuyển ngữ cảnh); thiếu <code>close(fd)</code> ở một nhánh (thường là nhánh 404 hay 503); xử lý SIGTERM bằng handler gọi <code>printf</code>/<code>exit</code> trong ngữ cảnh tín hiệu; join luồng không có hạn chót, nên <code>docker stop</code> vẫn kết thúc bằng SIGKILL và exit 137 (${a('os-1-5-pid1', 'bài 1.5')}).</p>
<p><strong>8. Nộp bài.</strong> Mã, output bộ kiểm, và một trang <strong>báo cáo tải</strong>: bảng các phép đo dưới đây chạy lại trên máy bạn, mỗi hàng một câu giải thích con số.</p>

<h3>Lời giải mẫu, đo thật</h3>
${run('c172-server', 'wc -l server/tpserver.c', 2)}
<p>Mỗi ca khởi động một máy chủ mới trên cổng riêng. S3 là trái tim của dự án: với 2 luồng và hàng đợi 2, đúng 4 trong 10 khách cùng lúc được phục vụ và 6 khách được báo "bận" ngay thay vì treo.</p>
<h3>Hai lỗi cài sẵn, hai ca trượt</h3>
${run('c172-server', "sed 's|        close(fd);", 2)}
<p>Thiếu <code>close(fd)</code>, máy chủ giữ 54 fd thay vì 6 sau một loạt request ngắn — cứ thế tiếp là <code>accept</code> báo <code>EMFILE</code> (${a('os-2-5-mang-fd', 'bài 2.5')}). Thiếu mặt nạ chặn tín hiệu, SIGTERM làm hành động mặc định: tiến trình chết ngay với 143 (128 + 15) và request đang chạy không nhận được câu trả lời nào (<code>000</code>). Đó chính là điều xảy ra ở mỗi lần deploy một máy chủ phớt lờ SIGTERM.</p>

<h3>Đo: định luật Little hiện ngay trước mắt</h3>
<p>Bốn luồng, mỗi request "chờ CSDL" 10 ms, nên pool làm xong tối đa 4 / 0,010 s = 400 request mỗi giây. Giờ tăng số khách:</p>
${run('c172-server', "/tmp/lg 127.0.0.1 8001", 3)}
<p>Thông lượng dừng ở ~340/s bất kể tải (phần còn lại của 400 tiêu vào việc dựng kết nối trong một container 4 CPU). Thứ tăng là <strong>thời gian chờ</strong>: <em>định luật Little</em> nói số việc trong hệ L = thông lượng λ × thời gian trong hệ W, nên với 64 khách W = 64 / 347 ≈ 0,184 s — p50 đo được: 182 ms. Thêm khách vào một máy chủ đã bão hoà chỉ thêm độ trễ.</p>
${run('c172-server', "/tmp/lg 127.0.0.1 8002")}
<p>Vẫn 64 khách, hàng đợi 8: mỗi request được nhận chờ tối đa (4 + 8) / 4 × 10 ms ≈ 30 ms — đo được p50 31,1 ms, p99 32,3 ms — và mọi thứ vượt quá đó nhận ngay 503 để khách thử lại hoặc hiện "bận". Thông lượng như cũ; độ trễ có trần. Đây là <strong>cắt tải</strong> (load shedding), và là lý do Tomcat có <code>acceptCount</code> còn pool CSDL có timeout.</p>
${lab('coordinated-omission', 'conns', 'vi', 'loadgen là vòng kín, giống hey: mỗi khách chờ câu trả lời của mình. Với nhiều kết nối, việc xếp hàng hiện ra cả trong số “từ lúc gửi” (≈ 190 ms ở đây) — nhưng với ít kết nối, một lần đứng hình biến mất khỏi số liệu. Đọc bài 15.6 trước khi tin p99 từ bài thử tải của chính bạn.')}
${run('c172-server', "/tmp/lg 127.0.0.1 8003", 4)}
<p>Với việc <em>chờ</em>, thêm luồng có ích: 32 luồng cho 2.865 req/s (64 khách / 32 luồng = hai đợt 10 ms ≈ 21 ms). Với việc <em>tính</em>, luồng vượt quá số lõi (<code>nproc</code> = 4 ở đây) chỉ thêm chuyển ngữ cảnh: 1 luồng 190/s, 4 luồng 727/s, 16 luồng 634/s với p95 75,6 ms thay vì 23,4 ms. Chọn cỡ pool theo việc mà tác vụ của nó làm (${a('os-4-5-so-sanh', 'bài 4.5')}).</p>
${lab('threadpool', 'overload', 'vi', 'Việc tới nhiều hơn số pool làm xong: nhìn hàng đợi dài ra và độ trễ leo lên trong khi thông lượng đứng yên — rồi đặt trần cho hàng đợi và thấy 503 thay chỗ cho việc chờ.')}
${lab('threadpool', 'mm1', 'vi', 'Lý thuyết hàng đợi trong một hình: khi mức sử dụng tiến tới 100 %, thời gian chờ bùng nổ. 11 → 45 → 182 ms bạn đo được chính là đường cong này.')}

<h3>Tắt êm, nhìn từ log của máy chủ</h3>
${run('c172-server', "(for i in 1 2 3; do curl")}
<p>Ba request 800 ms trên hai luồng; SIGTERM tới sau 0,2 s. Hai việc đang chạy và một việc đang xếp hàng — log ghi đúng vậy — và cả ba vẫn nhận câu trả lời trước khi tiến trình thoát 0, 1,4 s sau tín hiệu. Một container chạy máy chủ này sau <code>docker stop</code> (10 s ân hạn) không bao giờ mất request.</p>
${lab('threadpool', 'timeout', 'vi', 'Một dịch vụ phía sau chậm giữ chặt luồng: không có timeout thì pool cạn và request khoẻ phải xếp hàng sau request kẹt. Hạn chót 408 của dự án này là cùng lớp bảo vệ đó ở phía khách.')}

<div class="pitfall co-tieu-de">
<p><strong>"Tôi thêm luồng mà nó lại chậm hơn."</strong> Đo ở trên: với request nặng CPU, 16 luồng trên 4 lõi cho thông lượng thấp hơn (634 so với 727/s) và p95 gấp ba. Luồng không phải năng lực miễn phí; lõi mới là năng lực. Với việc chờ thì ngược lại — nên hãy đo xem endpoint của bạn thuộc loại nào trước khi chỉnh <code>server.tomcat.threads.max</code> hay <code>UV_THREADPOOL_SIZE</code>, và đừng bao giờ chỉnh khi chưa có máy tạo tải và một phân vị.</p>
</div>

${details('<strong>Lời giải mẫu: tpserver.c (mở khi bản của bạn đã qua)</strong>', src('ch17/server/tpserver.c', 'c'))}
${details('<strong>Cho sẵn: loadgen.c — máy tạo tải dùng cho mọi con số trong bài này</strong>', src('ch17/server/loadgen.c', 'c'))}

<h3>💼 Ghi gì vào CV</h3>
<ul>
<li><strong>Một dòng:</strong> "Dựng máy chủ HTTP đa luồng bằng C (pthreads): hàng đợi có giới hạn với cắt tải 503, hạn chót cho từng request (408), tắt êm khi SIGTERM qua signalfd; đo tải bằng máy tạo tải tự viết (kiểm chứng định luật Little: 64 khách ⇒ p50 182 ms ở 347 req/s)."</li>
<li><strong>Cho xem:</strong> bảng báo cáo tải — con số kèm một câu giải thích là thứ làm dự án nổi bật hơn "đã viết một web server".</li>
<li><strong>Sẵn sàng cho:</strong> "pool nên có bao nhiêu luồng?", "hàng đợi đầy thì sao?", "docker stop làm gì?" (16.6, 16.7).</li>
</ul>

<h3>🧪 Thực hành (sau các mốc)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> API Spring Boot của nhóm trả lời trong 30 ms lúc đêm và 4 s lúc trưa, CPU 35 %. Có người đề xuất nâng số luồng Tomcat từ 200 lên 2.000. Bạn muốn dữ liệu, không muốn ý kiến.</p>
<ol>
<li>Chạy máy chủ của bạn với <code>--threads 4 --queue 4096</code> và <code>loadgen … /work?ms=10</code> ở 4, 16 và 64 kết nối. Tính λ × W và so với số kết nối.</li>
<li>Lặp lại với <code>--queue 8</code>: ghi p99 và số câu 503.</li>
<li>Lặp lại với <code>/cpu?n=2</code> ở 1, <code>nproc</code> và 4 × <code>nproc</code> luồng.</li>
<li>Viết ba câu cho nhóm: độ trễ buổi trưa là do xếp hàng hay do tính toán, nâng luồng sẽ làm gì, và nên đổi gì thay vào đó.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy thông lượng đứng yên còn độ trễ tăng theo số kết nối, λ × W lệch không quá 10 % so với số kết nối, và khuyến nghị của bạn gọi đúng tên nút thắt (10 ms chờ "CSDL", không phải số luồng).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['thread pool (pool luồng)', 'Một nhóm luồng cố định lấy việc từ một hàng đợi — giới hạn mức đồng thời, tránh mỗi kết nối một luồng.'],
  ['bounded queue (hàng đợi có giới hạn)', 'Hàng đợi có sức chứa; đầy thì việc mới bị từ chối thay vì chờ mãi.'],
  ['load shedding (cắt tải, 503)', 'Từ chối việc bạn không làm kịp, để việc đã nhận vẫn nhanh.'],
  ['Little’s law (định luật Little)', 'L = λ × W: số việc trong hệ = thông lượng × thời gian trong hệ. Đúng với mọi hàng đợi ổn định.'],
  ['request deadline (hạn chót, 408)', 'Thời gian tối đa để nhận một request; chặn khách chậm hay im lặng giữ luồng.'],
  ['graceful shutdown (tắt êm)', 'Khi SIGTERM: thôi nhận, làm xong việc đang chạy và đang xếp hàng, thoát 0 trước SIGKILL của trình điều phối.'],
  ['signalfd', 'File descriptor trao tín hiệu thành sự kiện đọc được, để vòng poll xử lý SIGTERM như mọi đầu vào khác.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Pool N luồng với 10 ms chờ mỗi request có thông lượng tối đa ≈ N / 0,01 s; thêm khách chỉ thêm độ trễ (Little: 64 / 347 ≈ 184 ms, đo được 182 ms).</li>
<li>Hàng đợi có giới hạn đổi vài câu 503 lấy độ trễ có trần: hàng 8 ⇒ p99 32 ms thay vì 204 ms.</li>
<li>Thêm luồng giúp việc chờ (32 luồng: 2.865/s) và hại việc tính khi vượt số lõi (16 luồng trên 4 lõi: 634/s và p95 gấp 3).</li>
<li>Tắt êm = chặn tín hiệu + signalfd + đóng socket lắng nghe + làm nốt + join có hạn chót; thiếu nó, SIGTERM là exit 143 và mất request.</li>
<li>Bộ kiểm nghiệm thu bắt các lỗi kinh điển: thiếu close(fd) và không xử lý SIGTERM, mỗi lỗi trượt đúng ca của nó.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/signalfd.2.html', '📄', 'signalfd(2) — Linux manual page', 'Nhận tín hiệu qua một file descriptor; vì sao mặt nạ phải được chặn ở mọi luồng.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html', '📄', 'ThreadPoolExecutor (Java 21)', 'Số luồng lõi/tối đa, hàng đợi có giới hạn và chính sách từ chối — cùng thiết kế trong Java.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 17.3 — Chẩn đoán sự cố cài sẵn ───────────────────────── */
    {
      title: '17.3 — Project 3: diagnose five planted incidents — a Docker Compose lab with a hidden answer key|||17.3 — Dự án 3: chẩn đoán năm sự cố cài sẵn — phòng lab Docker Compose có đáp án ẩn',
      slug: 'os-17-3-chan-doan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tờ đề dự án 3: một hệ thống năm dịch vụ (Node, Python, Java) dưới tải giả, cài sẵn năm sự cố — rò bộ nhớ tới OOM 137, log DEBUG làm đầy ổ 64 MiB kèm file đã xoá vẫn mở (df 100 %, du 400K), rò fd tới EMFILE, deadlock bốn luồng Java, fsync từng byte làm audit chậm 25–30 ms và xen byte giữa các dòng; tìm bằng công cụ của khoá (docker events, /proc/PID/fd, df/du, jstack, strace qua container gỡ lỗi), đáp án ẩn, bộ chấm check.sh: bản lỗi 0/10, lời giải mẫu 10/10.',
      content: `${G173}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Project 3 of 4</span>
<h2>Project 3: diagnose five planted incidents</h2>
<p class="lead">Thursday, 14:00. The shop is slow, transfers hang, the reports page shows "error", a background worker fails, and the API keeps restarting. Five tickets, one on-call engineer: you. Chapter 2 gave you the first five minutes, Chapters 3–12 the mechanisms behind each symptom. The question of this project: <strong>can you find the root cause of five incidents running at the same time, using only operating-system evidence, before you read a single line of their source code?</strong></p>

<h3>The brief — Project 3: the <code>os17</code> stack</h3>
<p><strong>1. Overview.</strong> A small shop backend runs in Docker Compose, built from the course image <code>os-lab</code> so every tool of the course is available inside each container. A sixth container plays users and sends traffic to all five services with four independent loops (one stuck service does not slow the others down — like real users). Each service has <strong>one planted OS-level problem</strong>; together they cover memory, disk, file descriptors, locks and I/O.</p>
<table>
<tr><th>Container</th><th>Language</th><th>Does</th><th>Limits set in compose.yml</th></tr>
<tr><td><code>os-17-shop</code></td><td>Node</td><td>product pages with an in-memory cache (port 3000)</td><td><code>mem_limit: 192m</code>, no swap</td></tr>
<tr><td><code>os-17-report</code></td><td>Node</td><td>fills a report template (3001)</td><td><code>ulimits: nofile 256</code></td></tr>
<tr><td><code>os-17-worker</code></td><td>Python</td><td>background jobs, logs to <code>/var/log/app</code> (3002)</td><td>log disk = <code>tmpfs</code> of 64 MiB</td></tr>
<tr><td><code>os-17-billing</code></td><td>Java</td><td>transfers between 4 wallets, a lock per wallet (3003)</td><td>pool of 16 threads</td></tr>
<tr><td><code>os-17-audit</code></td><td>Python</td><td>audit log; every event must be on disk before 200 (3004)</td><td>named volume <code>/data</code></td></tr>
<tr><td><code>os-17-traffic</code></td><td>bash + curl</td><td>simulated users</td><td>—</td></tr>
</table>
<p>Safety by design: the "disk" that fills is a 64 MiB tmpfs, the memory hog is capped at 192 MiB, every container is named <code>os-17-*</code> with the label <code>oslab=1</code>, and <code>down -v</code> removes everything including the volume. Nothing touches the host disk or other containers.</p>
<p><strong>2. Running it</strong> (from <code>lab/code/ch17/incident</code>, on the machine that runs Docker):</p>
${cmd('docker compose -p os17 up -d --build        # start; the first symptoms appear within a minute', 'docker compose -p os17 restart report          # after editing services/report.js (sources are mounted read-only)', 'docker compose -p os17 down -v                 # stop and remove everything', './check.sh                                     # grade: start, 75 s of traffic, 5 checks, stop')}
<p><strong>3. Rules.</strong> Symptom first, source code last. For each incident you must show <em>OS evidence</em> — a command and its output that proves the mechanism — before you open the service’s source. Allowed tools: everything in this course (<code>docker ps/stats/inspect/events/logs/exec</code>, <code>/proc</code>, <code>df/du</code>, <code>ulimit</code>, <code>ls -l /proc/PID/fd</code>, <code>jstack</code>, <code>strace</code>, <code>gdb</code>, cgroup files).</p>
<p><strong>4. Deliverable per incident:</strong> symptom (with a number) → evidence (command + output) → root cause (one sentence naming the mechanism) → fix (diff) → verification (<code>check.sh</code> line turns PASS) → prevention (a limit, an alert or a test).</p>
<p><strong>5. Grading.</strong> Automated, by <code>check.sh</code>, 2 marks per incident:</p>
${rubric([
  ['1', 'shop-api: no OOM kill and no restart during 75 s of traffic, RSS &lt; 150 MiB', '2', '<code>RestartCount</code>, <code>docker events</code> (oom), <code>/stats</code>'],
  ['2', 'report: fds of PID 1 stay below 64, <code>/report</code> answers 200', '2', '<code>/proc/1/fd</code>, HTTP code'],
  ['3', 'worker: log disk below 50 %, no deleted-but-open file, no failed job', '2', '<code>df</code>, <code>/proc/*/fd</code>, health endpoint'],
  ['4', 'billing: 100 simultaneous opposite transfers finish within 10 s, total money unchanged', '2', 'parallel curl, <code>/total</code>'],
  ['5', 'audit: median store time &lt; 10 ms over 30 events, no malformed line in the log', '2', '"stored in" times, regex over <code>/data/audit.log</code>'],
], ['Health condition', 'Marks', 'Measured with'])}
<p>And by hand, for the report you hand in (it feeds the postmortem of 17.4): ☐ every incident has a number in its symptom · ☐ every root cause is backed by OS evidence, not by reading code · ☐ every fix keeps the service’s promise (the audit log must stay durable; the cache must stay a cache) · ☐ every prevention item is concrete (which limit, which alert, which test).</p>
<p><strong>6. Milestones.</strong> Hour 1: triage all five, write one line each. Hours 2–4: one incident at a time — evidence, root cause. Hour 5: fixes, <code>check.sh</code> until 10/10. Day 2: the postmortem (17.4).</p>

<h3>Start: the planted stack scores 0/10</h3>
${run('c173-cham-loi', 'KEEP=1 ./check.sh')}
<p><code>KEEP=1</code> leaves the broken stack running so you can investigate it. Everything below was run on that running stack, from the host.</p>

<h3>Step 0 — triage, two commands</h3>
${run('c173-chan-doan', 'docker ps -a --filter label=com.docker.compose.project=os17', 2)}
<p>Read it the Chapter 2 way, resource by resource. One container is "Up 10 seconds" while its neighbours have been up for a minute — it restarted. One sits at 126.5 of 192 MiB. One burns 76 % CPU while doing background work. Billing holds 39 threads at 0 % CPU — threads that exist but do nothing are waiting for something. Five lines, five leads. Now one incident at a time; each has a hint, the real evidence, and the answer key, all folded so you can try first.</p>
${lab('sysmon', 'mystery', 'en', 'Practise the triage reflex on a simulated machine first: one resource at a time — CPU, memory, disk, I/O — before you guess a cause.', { tour: 'sysmon-read' })}

<h3>Incident 1 — the API keeps restarting</h3>
<p><strong>Symptom:</strong> <code>os-17-shop</code> restarts every ~20 s; users see connection resets.</p>
${details('Hint', '<p>A container that dies without an error in its own log was usually killed from outside. Ask Docker <em>who</em> ended it and with which exit code, then watch the process’s memory over a few seconds (' + a('os-8-4-exit137', 'lesson 8.4') + ').</p>')}
${details('Evidence (real output)', run('c173-chan-doan', 'docker inspect', 4) + '<p>Four restarts — and yet <code>OOMKilled=false</code>: <code>docker inspect</code> describes the <em>current</em> process, started 10 seconds ago, not the one that died. Docker’s event stream keeps the history: <code>oom</code> followed by <code>die exitCode=137</code>, each time. Meanwhile the cache grows by ~290 entries and ~18 MiB every 2 seconds towards a limit of 201,326,592 bytes (192 MiB).</p>')}
${details('Answer key — incident 1', '<p><strong>Root cause:</strong> an unbounded cache keyed by the <em>whole URL</em>, including a random <code>?t=</code> cache-buster the frontend adds. Every request is a miss, and every miss stores a 64 KiB page forever, until the cgroup limit (192 MiB) is reached and the kernel’s OOM killer sends SIGKILL: exit 137. <strong>Fix:</strong> key by what determines the content (the product id) and cap the cache (an LRU of 500 pages ≈ 32 MiB, sized against the container limit). <strong>Prevention:</strong> alert on container restarts and on <code>oom</code> events; every cache needs a maximum size.</p>' + src('ch17/incident/fixed/shop-api.js', 'javascript'))}
${lab('cgroup', 'oom', 'en', 'The kernel side of incident 1: memory.current climbs to memory.max, reclaim fails, the OOM killer picks the process — exit 137.')}

<h3>Incident 2 — the reports page says "error"</h3>
<p><strong>Symptom:</strong> <code>/report</code> worked for half a minute after start, then answers 500 for everyone.</p>
${details('Hint', '<p>Read the service’s own log first, then count what the process is holding open, and compare with its limit (' + a('os-2-5-mang-fd', 'lesson 2.5') + ', ' + a('os-10-1-fd', 'lesson 10.1') + ').</p>')}
${details('Evidence (real output)', run('c173-chan-doan', 'docker logs --tail 2 os-17-report', 2) + '<p><code>EMFILE</code>: the process has hit its limit of 256 open files — 255 are open, and 236 of them point at the same <code>template.html</code>.</p>')}
${details('Answer key — incident 2', '<p><strong>Root cause:</strong> <code>fs.openSync</code> on every request, never <code>closeSync</code> — one leaked fd per request. Node closes nothing for you (an fd is just an integer), so after ~230 requests the process cannot open anything, not even a socket. <strong>Fix:</strong> read the template once at start (it never changes); where a file must be opened per request, close it in <code>finally</code>. <strong>Prevention:</strong> a test that runs 1,000 requests and checks that <code>/proc/PID/fd</code> did not grow; an alert on open fds as a fraction of the limit.</p>' + src('ch17/incident/fixed/report.js', 'javascript'))}
${lab('fdtable', 'emfile', 'en', 'One fd per request, never closed: watch the table fill up to the ulimit and the next open() fail with EMFILE.')}

<h3>Incident 3 — jobs fail: the disk is full, but nothing is on it</h3>
<p><strong>Symptom:</strong> the worker’s health page reports thousands of failed jobs.</p>
${details('Hint', '<p>Compare what <code>df</code> says with what <code>du</code> says. When they disagree, some space belongs to a file that no longer has a name (' + a('os-2-4-dia-io', 'lesson 2.4') + ', ' + a('os-9-1-inode', 'lesson 9.1') + ').</p>')}
${details('Evidence (real output)', run('c173-chan-doan', 'docker exec os-17-traffic curl -s worker:3002/', 4) + '<p><code>ENOSPC</code> (errno 28); <code>df</code> says 64 of 64 MiB used, <code>du</code> finds 400 KiB. The difference is one file: <code>worker.log.1</code>, <em>deleted</em>, still open as fd 3 of the Python process, still growing — the directory has no <code>worker.log</code> at all any more.</p>')}
${details('Answer key — incident 3', '<p><strong>Root cause:</strong> two bugs that only hurt together. (1) The log level was left at <code>DEBUG</code>: 40 lines of ~200 bytes per job, several MB per second into a 64 MiB disk. (2) The home-made rotation renames the log and <em>deletes</em> it while Python still holds it open: the name disappears, the inode and its blocks stay, and Python keeps appending to it — invisible to <code>du</code>, counted by <code>df</code> (lesson 2.4, the night Postgres died). <strong>Fix:</strong> log level from the environment, default <code>INFO</code>; <code>WatchedFileHandler</code> reopens the file when it is renamed; rotation keeps one old file instead of deleting an open one. Emergency fix without a restart: truncate through the fd, <code>: &gt; /proc/PID/fd/3</code>. <strong>Prevention:</strong> in containers, log to stdout and let Docker rotate (<code>--log-opt max-size</code>); alert on disk use and on <code>(deleted)</code> files held open.</p>' + src('ch17/incident/fixed/worker.py', 'python'))}
${lab('fdtable', 'deleted', 'en', 'A deleted file that is still open: the name is gone, the inode and its blocks stay until the last fd closes — df counts them, du cannot see them.', { tour: 'fdtable-deleted' })}

<h3>Incident 4 — transfers hang while the CPU is idle</h3>
<p><strong>Symptom:</strong> <code>/transfer</code> times out; <code>os-17-billing</code> uses 0 % CPU with 39 threads.</p>
${details('Hint', '<p>Busy-and-slow and idle-and-stuck are different diseases. Idle and stuck means threads are waiting — ask the JVM who holds what (' + a('os-6-1-deadlock', 'lesson 6.1') + ').</p>')}
${details('Evidence (real output)', run('c173-chan-doan', 'docker exec os-17-traffic curl -s -m 3 -o /dev/null', 2) + '<p>The request does not even get an error: curl gives up after 3 s (exit 28). <code>jstack</code> finds the deadlock itself and prints the cycle: <code>pool-1-thread-1</code> waits for a wallet held by <code>pool-1-thread-2</code>, which waits for the wallet held by thread 1 — and the stack shows where: <code>Billing.transfer</code>, line 14, the inner <code>synchronized</code>, with the outer lock already taken. Every new transfer that touches those wallets joins the queue, until all 16 pool threads are stuck.</p>')}
${details('Answer key — incident 4', '<p><strong>Root cause:</strong> <code>transfer(from, to)</code> locks the source wallet, then the destination. A transfer 0→1 and a transfer 1→0 at the same time each hold one lock and wait for the other: circular wait, the fourth Coffman condition. <strong>Fix:</strong> always lock in a global order (the lower wallet id first) — a cycle becomes impossible. <strong>Prevention:</strong> a test that fires opposite transfers concurrently (exactly what <code>check.sh</code> does); a lock timeout (<code>tryLock</code>) that fails loudly instead of hanging forever; in a database, the same rule as <code>SELECT … FOR UPDATE</code> in id order (' + a('os-5-4-backend', 'lesson 5.4') + ').</p>' + src('ch17/incident/fixed/Billing.java', 'java'))}
${lab('race', 'deadlock', 'en', 'Two threads, two locks, opposite order: step through until both wait forever — then switch to the ordered preset and watch the cycle become impossible.', { tour: 'race-deadlock' })}

<h3>Incident 5 — the audit log is slow, and its lines are broken</h3>
<p><strong>Symptom:</strong> every audited request takes an extra 25–30 ms; an auditor finds unreadable lines in the log.</p>
${details('Hint', '<p>The container has no debugger and no <code>SYS_PTRACE</code>. Start a throwaway debugging container <em>in its PID namespace</em> and count system calls (' + a('os-11-2-strace-ltrace', 'lesson 11.3') + ', ' + a('os-9-2-fsync', 'lesson 9.3') + ').</p>')}
${details('Evidence (real output)', run('c173-chan-doan', "docker exec os-17-traffic sh -c 'for i in 1 2 3", 3) + '<p><code>--pid=container:os-17-audit</code> puts a fresh <code>os-lab</code> container in the audit service’s PID namespace, so its PID 1 is the Python server; <code>--cap-add SYS_PTRACE</code> is given to the <em>debugger only</em>. In 4 seconds the server made 2,795 <code>write</code> and 2,795 <code>fsync</code> calls for a few dozen events of ~70 bytes: one write and one fsync <strong>per byte</strong>. And the log contains lines whose bytes are interleaved — two requests wrote byte by byte at the same time.</p>')}
${details('Answer key — incident 5', '<p><strong>Root cause:</strong> "write each byte and fsync each byte, to be safe". <code>fsync</code> waits for the device to confirm — the most expensive call in the file system — and here it runs ~80 times per event. Byte-sized <code>write</code>s from several threads also interleave: <code>O_APPEND</code> makes each <em>write</em> atomic, not each line. <strong>Fix:</strong> keep the promise (on disk before 200) but pay for it once: build the line, <strong>one</strong> <code>write</code> with <code>O_APPEND</code>, then a shared <code>fdatasync</code> that covers every event written so far (group commit — the trick PostgreSQL’s WAL uses). Measured after the fix: median 0.7 ms, no malformed line. <strong>Prevention:</strong> a latency budget per endpoint, and a test that writes from many threads and validates every line.</p>' + src('ch17/incident/fixed/audit.py', 'python'))}

<h3>Finish: the reference fixes score 10/10</h3>
${run('c173-cham-sua', './check.sh fixed', 2)}
<p>Same compose file, same limits, same traffic — only the five source files differ (<code>fixed/</code> instead of <code>services/</code>). RSS 68 MiB instead of an OOM loop, 19 fds instead of 255, the log disk at 1 %, 100/100 transfers with the money intact, audit median 0.7 ms instead of ~25 ms. The last line confirms that <code>check.sh</code> left no container behind.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Just restart it" destroys the evidence.</strong> Measured in incident 1: after four OOM kills, <code>docker inspect</code> reported <code>OOMKilled=false</code> — it shows the <em>new</em> process’s state; only <code>docker events</code> still knew. Restarting the report service would empty its fd table; restarting the worker would free the deleted file; restarting billing would clear the deadlock — and you would have five "flaky" services and no root cause. Collect evidence first (<code>docker events</code>, <code>/proc/PID/fd</code>, <code>df</code>, <code>jstack</code>, <code>strace -c</code>), then restart.</p>
</div>

<h3>💼 What to put on your CV</h3>
<ul>
<li><strong>Line:</strong> "Diagnosed five concurrent production-style incidents in a Docker Compose system (OOM kills, file-descriptor exhaustion, deleted-but-open log files filling a disk, a Java deadlock, fsync-bound I/O) from OS-level evidence; fixed all five and verified with an automated health check (0/10 → 10/10)."</li>
<li><strong>Bring:</strong> one incident told as a story, with the command that cracked it — that is the interview answer to "tell me about a hard bug" (17.4 shows how).</li>
</ul>

<h3>🧪 Practice (the project itself, 1–2 days)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are on call for the <code>os17</code> shop. Five tickets are open at once and the team lead asks for root causes, not restarts.</p>
<ol>
<li><code>KEEP=1 ./check.sh</code> — confirm 0/10, leave the stack running.</li>
<li>Triage with <code>docker ps</code> and <code>docker stats</code>; write one line per container.</li>
<li>For each incident, collect one piece of OS evidence before opening its source (use the hints only when stuck).</li>
<li>Fix the five files in <code>services/</code>, restart only the service you changed, and run <code>./check.sh</code> until 10/10.</li>
</ol>
<p><strong>Done when:</strong> <code>check.sh</code> prints <code>SCORE 10/10</code> on your <code>services/</code>, and your report has, for each incident, a symptom with a number, an evidence command with its output, and a one-sentence root cause naming the mechanism.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['triage', 'Ranking problems by resource and impact in the first minutes, before guessing causes.'],
  ['docker events', 'Docker’s event stream (oom, die with exitCode, restart…); keeps evidence that a restart wipes from inspect and the cgroup.'],
  ['EMFILE', '"Too many open files": the process reached its RLIMIT_NOFILE; usually a leak, not a limit that is too low.'],
  ['deleted-but-open file', 'A file whose name was removed while a process still holds it open; its blocks stay allocated (df) but no path leads to it (du).'],
  ['circular wait', 'The Coffman condition behind deadlock: each thread holds a lock the next one needs. A global lock order prevents it.'],
  ['debug sidecar', 'A throwaway container joined to the target’s namespaces (<code>--pid=container:X</code>) carrying the tools and capabilities the target lacks.'],
  ['group commit', 'Many writers share one fsync/fdatasync, keeping durability while paying the device’s latency once per batch.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Triage by resource first: a recent restart, memory near the limit, CPU without progress, idle threads — five lines, five leads.</li>
<li>OOM: <code>docker events</code> shows <code>oom</code> + <code>die 137</code>; the cause was an unbounded cache keyed by a random URL parameter.</li>
<li>EMFILE: 236 of 255 open fds pointed to one template — one fd leaked per request. Disk: df 100 % vs du 400 K = a deleted log still open, filled by forgotten DEBUG logging.</li>
<li>Deadlock: idle CPU + jstack cycle; fixed by locking wallets in id order. Slow I/O: 2,795 fsyncs in 4 s, one per byte; fixed by one write + group commit (median 0.7 ms).</li>
<li>Collect evidence before restarting — after a restart <code>docker inspect</code> said <code>OOMKilled=false</code>; only <code>docker events</code> remembered.</li>
</ul>
${L('https://docs.docker.com/reference/cli/docker/system/events/', '📄', 'docker system events — Docker docs', 'The event stream: oom, die, restart and their attributes such as exitCode.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html', '📄', 'jstack — JDK 21 tool reference', 'Thread dumps and automatic Java-level deadlock detection.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Dự án 3 / 4</span>
<h2>Dự án 3: chẩn đoán năm sự cố cài sẵn</h2>
<p class="lead">Thứ Năm, 14 giờ. Cửa hàng chậm, lệnh chuyển tiền treo, trang báo cáo hiện "error", một tiến trình chạy nền lỗi liên tục, và API cứ khởi động lại. Năm phiếu sự cố, một người trực: bạn. Chương 2 cho bạn năm phút đầu, Chương 3–12 cho bạn cơ chế đằng sau từng triệu chứng. Câu hỏi của dự án này: <strong>bạn có tìm ra nguyên nhân gốc của năm sự cố đang xảy ra cùng lúc, chỉ bằng bằng chứng từ hệ điều hành, trước khi đọc một dòng mã nguồn nào của chúng không?</strong></p>

<h3>Tờ đề — Dự án 3: hệ thống <code>os17</code></h3>
<p><strong>1. Tổng quan.</strong> Backend của một cửa hàng nhỏ chạy bằng Docker Compose, dựng từ ảnh <code>os-lab</code> của khoá nên mọi công cụ của khoá đều có trong từng container. Container thứ sáu đóng vai người dùng, bắn tải vào cả năm dịch vụ bằng bốn vòng lặp độc lập (một dịch vụ treo không làm chậm các dịch vụ khác — giống người dùng thật). Mỗi dịch vụ có <strong>một sự cố tầng hệ điều hành cài sẵn</strong>; gộp lại chúng phủ bộ nhớ, đĩa, file descriptor, khoá và I/O.</p>
<table>
<tr><th>Container</th><th>Ngôn ngữ</th><th>Làm gì</th><th>Giới hạn đặt trong compose.yml</th></tr>
<tr><td><code>os-17-shop</code></td><td>Node</td><td>trang sản phẩm có cache trong bộ nhớ (cổng 3000)</td><td><code>mem_limit: 192m</code>, không swap</td></tr>
<tr><td><code>os-17-report</code></td><td>Node</td><td>điền mẫu báo cáo (3001)</td><td><code>ulimits: nofile 256</code></td></tr>
<tr><td><code>os-17-worker</code></td><td>Python</td><td>việc chạy nền, ghi log vào <code>/var/log/app</code> (3002)</td><td>ổ log = <code>tmpfs</code> 64 MiB</td></tr>
<tr><td><code>os-17-billing</code></td><td>Java</td><td>chuyển tiền giữa 4 ví, mỗi ví một khoá (3003)</td><td>pool 16 luồng</td></tr>
<tr><td><code>os-17-audit</code></td><td>Python</td><td>nhật ký kiểm toán; mỗi sự kiện phải nằm trên đĩa trước khi trả 200 (3004)</td><td>named volume <code>/data</code></td></tr>
<tr><td><code>os-17-traffic</code></td><td>bash + curl</td><td>người dùng giả</td><td>—</td></tr>
</table>
<p>An toàn ngay từ thiết kế: "ổ đĩa" bị lấp đầy là một tmpfs 64 MiB, kẻ ngốn bộ nhớ bị chặn ở 192 MiB, mọi container tên <code>os-17-*</code> mang nhãn <code>oslab=1</code>, và <code>down -v</code> xoá sạch kể cả volume. Không có gì đụng tới đĩa của máy chủ hay container khác.</p>
<p><strong>2. Chạy</strong> (từ <code>lab/code/ch17/incident</code>, trên máy chạy Docker):</p>
${cmd('docker compose -p os17 up -d --build        # bật; triệu chứng đầu tiên lộ ra trong vòng một phút', 'docker compose -p os17 restart report          # sau khi sửa services/report.js (mã nguồn gắn chỉ-đọc)', 'docker compose -p os17 down -v                 # tắt và xoá sạch', './check.sh                                     # chấm: bật, 75 s tải, 5 phép kiểm, tắt')}
<p><strong>3. Luật chơi.</strong> Triệu chứng trước, mã nguồn sau cùng. Với mỗi sự cố bạn phải đưa ra <em>bằng chứng từ hệ điều hành</em> — một lệnh và output của nó chứng minh cơ chế — trước khi mở mã nguồn của dịch vụ. Công cụ được dùng: mọi thứ trong khoá (<code>docker ps/stats/inspect/events/logs/exec</code>, <code>/proc</code>, <code>df/du</code>, <code>ulimit</code>, <code>ls -l /proc/PID/fd</code>, <code>jstack</code>, <code>strace</code>, <code>gdb</code>, file cgroup).</p>
<p><strong>4. Sản phẩm cho mỗi sự cố:</strong> triệu chứng (kèm một con số) → bằng chứng (lệnh + output) → nguyên nhân gốc (một câu gọi tên cơ chế) → cách sửa (diff) → kiểm chứng (dòng <code>check.sh</code> chuyển PASS) → phòng ngừa (một giới hạn, một cảnh báo hay một phép kiểm).</p>
<p><strong>5. Chấm điểm.</strong> Tự động bằng <code>check.sh</code>, 2 điểm mỗi sự cố:</p>
${rubric([
  ['1', 'shop-api: không bị OOM giết, không khởi động lại trong 75 s tải, RSS &lt; 150 MiB', '2', '<code>RestartCount</code>, <code>docker events</code> (oom), <code>/stats</code>'],
  ['2', 'report: fd của PID 1 dưới 64, <code>/report</code> trả 200', '2', '<code>/proc/1/fd</code>, mã HTTP'],
  ['3', 'worker: ổ log dưới 50 %, không có file đã xoá mà vẫn mở, không có việc lỗi', '2', '<code>df</code>, <code>/proc/*/fd</code>, trang sức khoẻ'],
  ['4', 'billing: 100 lệnh chuyển ngược chiều cùng lúc xong trong 10 s, tổng tiền không đổi', '2', 'curl song song, <code>/total</code>'],
  ['5', 'audit: trung vị thời gian lưu &lt; 10 ms trên 30 sự kiện, không có dòng hỏng trong log', '2', 'thời gian "stored in", regex trên <code>/data/audit.log</code>'],
], ['Điều kiện sức khoẻ', 'Điểm', 'Đo bằng'])}
<p>Và chấm tay, cho bản báo cáo bạn nộp (nó là nguyên liệu của báo cáo sự cố ở 17.4): ☐ mỗi sự cố có một con số trong triệu chứng · ☐ mỗi nguyên nhân gốc dựa trên bằng chứng từ hệ điều hành, không phải đọc mã · ☐ mỗi cách sửa giữ đúng lời hứa của dịch vụ (log kiểm toán phải vẫn bền; cache phải vẫn là cache) · ☐ mỗi mục phòng ngừa cụ thể (giới hạn nào, cảnh báo nào, phép kiểm nào).</p>
<p><strong>6. Các mốc.</strong> Giờ 1: phân loại cả năm, mỗi cái một dòng. Giờ 2–4: từng sự cố một — bằng chứng, nguyên nhân gốc. Giờ 5: sửa, chạy <code>check.sh</code> tới 10/10. Ngày 2: báo cáo sự cố (17.4).</p>

<h3>Bắt đầu: hệ thống cài lỗi được 0/10</h3>
${run('c173-cham-loi', 'KEEP=1 ./check.sh')}
<p><code>KEEP=1</code> để hệ thống hỏng tiếp tục chạy cho bạn điều tra. Mọi thứ dưới đây chạy trên chính hệ thống đang chạy đó, từ máy chủ.</p>

<h3>Bước 0 — phân loại, hai lệnh</h3>
${run('c173-chan-doan', 'docker ps -a --filter label=com.docker.compose.project=os17', 2)}
<p>Đọc theo kiểu Chương 2, từng tài nguyên một. Một container "Up 10 seconds" trong khi hàng xóm đã chạy một phút — nó vừa khởi động lại. Một cái đang ở 126,5/192 MiB. Một cái đốt 76 % CPU cho việc chạy nền. Billing giữ 39 luồng ở 0 % CPU — luồng có mà không làm gì thì đang chờ một thứ gì đó. Năm dòng, năm đầu mối. Giờ từng sự cố một; mỗi cái có gợi ý, bằng chứng thật và đáp án, đều được gập lại để bạn thử trước.</p>
${lab('sysmon', 'mystery', 'vi', 'Tập phản xạ phân loại trên một máy mô phỏng trước: từng tài nguyên một — CPU, bộ nhớ, đĩa, I/O — trước khi đoán nguyên nhân.', { tour: 'sysmon-read' })}

<h3>Sự cố 1 — API cứ khởi động lại</h3>
<p><strong>Triệu chứng:</strong> <code>os-17-shop</code> khởi động lại mỗi ~20 s; người dùng thấy kết nối bị cắt.</p>
${details('Gợi ý', '<p>Một container chết mà log của chính nó không có lỗi thường là bị giết từ bên ngoài. Hỏi Docker <em>ai</em> kết thúc nó và với mã thoát nào, rồi theo dõi bộ nhớ của tiến trình trong vài giây (' + a('os-8-4-exit137', 'bài 8.4') + ').</p>')}
${details('Bằng chứng (output thật)', run('c173-chan-doan', 'docker inspect', 4) + '<p>Bốn lần khởi động lại — vậy mà <code>OOMKilled=false</code>: <code>docker inspect</code> mô tả tiến trình <em>hiện tại</em>, vừa bật 10 giây trước, không phải tiến trình đã chết. Luồng sự kiện của Docker giữ lịch sử: <code>oom</code> rồi <code>die exitCode=137</code>, lần nào cũng vậy. Trong lúc đó cache tăng ~290 mục và ~18 MiB mỗi 2 giây, tiến về giới hạn 201.326.592 byte (192 MiB).</p>')}
${details('Đáp án — sự cố 1', '<p><strong>Nguyên nhân gốc:</strong> một cache không giới hạn lấy khoá là <em>cả URL</em>, gồm cả tham số chống cache <code>?t=</code> ngẫu nhiên mà frontend gắn vào. Mọi request đều trượt, và mỗi lần trượt lưu vĩnh viễn một trang 64 KiB, tới khi chạm giới hạn cgroup (192 MiB) và OOM killer của nhân gửi SIGKILL: exit 137. <strong>Sửa:</strong> lấy khoá theo thứ quyết định nội dung (mã sản phẩm) và đặt trần cho cache (LRU 500 trang ≈ 32 MiB, chọn theo giới hạn của container). <strong>Phòng ngừa:</strong> cảnh báo khi container khởi động lại và khi có sự kiện <code>oom</code>; cache nào cũng cần kích thước tối đa.</p>' + src('ch17/incident/fixed/shop-api.js', 'javascript'))}
${lab('cgroup', 'oom', 'vi', 'Phía nhân của sự cố 1: memory.current leo tới memory.max, thu hồi không được, OOM killer chọn tiến trình — exit 137.')}

<h3>Sự cố 2 — trang báo cáo báo "error"</h3>
<p><strong>Triệu chứng:</strong> <code>/report</code> chạy được nửa phút sau khi bật, rồi trả 500 cho mọi người.</p>
${details('Gợi ý', '<p>Đọc log của chính dịch vụ trước, rồi đếm xem tiến trình đang giữ mở bao nhiêu thứ, và so với giới hạn của nó (' + a('os-2-5-mang-fd', 'bài 2.5') + ', ' + a('os-10-1-fd', 'bài 10.1') + ').</p>')}
${details('Bằng chứng (output thật)', run('c173-chan-doan', 'docker logs --tail 2 os-17-report', 2) + '<p><code>EMFILE</code>: tiến trình đã chạm giới hạn 256 file mở — đang mở 255, và 236 trong số đó trỏ vào cùng một <code>template.html</code>.</p>')}
${details('Đáp án — sự cố 2', '<p><strong>Nguyên nhân gốc:</strong> <code>fs.openSync</code> ở mỗi request, không bao giờ <code>closeSync</code> — mỗi request rò một fd. Node không đóng hộ bạn (fd chỉ là một số nguyên), nên sau ~230 request tiến trình không mở được gì nữa, kể cả socket. <strong>Sửa:</strong> đọc mẫu một lần lúc khởi động (nó không bao giờ đổi); chỗ nào buộc phải mở file mỗi request thì đóng nó trong <code>finally</code>. <strong>Phòng ngừa:</strong> một phép kiểm chạy 1.000 request rồi xác nhận <code>/proc/PID/fd</code> không tăng; cảnh báo theo tỉ lệ fd đang mở so với giới hạn.</p>' + src('ch17/incident/fixed/report.js', 'javascript'))}
${lab('fdtable', 'emfile', 'vi', 'Mỗi request một fd, không bao giờ đóng: nhìn bảng đầy dần tới ulimit và lần open() kế tiếp hỏng với EMFILE.')}

<h3>Sự cố 3 — việc lỗi: đĩa đầy mà trên đĩa chẳng có gì</h3>
<p><strong>Triệu chứng:</strong> trang sức khoẻ của worker báo hàng nghìn việc lỗi.</p>
${details('Gợi ý', '<p>So điều <code>df</code> nói với điều <code>du</code> nói. Khi hai bên lệch nhau, một phần chỗ thuộc về một file không còn tên (' + a('os-2-4-dia-io', 'bài 2.4') + ', ' + a('os-9-1-inode', 'bài 9.1') + ').</p>')}
${details('Bằng chứng (output thật)', run('c173-chan-doan', 'docker exec os-17-traffic curl -s worker:3002/', 4) + '<p><code>ENOSPC</code> (errno 28); <code>df</code> báo dùng 64/64 MiB, <code>du</code> chỉ thấy 400 KiB. Phần chênh là một file: <code>worker.log.1</code>, <em>đã xoá</em>, vẫn mở là fd 3 của tiến trình Python, vẫn đang lớn lên — thư mục giờ không còn file <code>worker.log</code> nào cả.</p>')}
${details('Đáp án — sự cố 3', '<p><strong>Nguyên nhân gốc:</strong> hai lỗi chỉ gây hại khi đi cùng nhau. (1) Mức log bị bỏ quên ở <code>DEBUG</code>: 40 dòng ~200 byte mỗi việc, vài MB mỗi giây vào một ổ 64 MiB. (2) Kịch bản xoay log tự chế đổi tên log rồi <em>xoá</em> nó trong khi Python vẫn giữ mở: tên biến mất, inode và các khối của nó ở lại, và Python tiếp tục ghi nối vào đó — <code>du</code> không thấy, <code>df</code> vẫn tính (bài 2.4, cái đêm Postgres chết). <strong>Sửa:</strong> mức log lấy từ biến môi trường, mặc định <code>INFO</code>; <code>WatchedFileHandler</code> mở lại file khi nó bị đổi tên; xoay log giữ một file cũ thay vì xoá một file đang mở. Cứu nguy không cần khởi động lại: cắt file qua fd, <code>: &gt; /proc/PID/fd/3</code>. <strong>Phòng ngừa:</strong> trong container, ghi log ra stdout và để Docker xoay (<code>--log-opt max-size</code>); cảnh báo theo mức dùng đĩa và theo file <code>(deleted)</code> còn bị giữ mở.</p>' + src('ch17/incident/fixed/worker.py', 'python'))}
${lab('fdtable', 'deleted', 'vi', 'Một file đã xoá mà vẫn mở: tên mất, inode và các khối của nó ở lại tới khi fd cuối cùng đóng — df đếm chúng, du không thấy chúng.', { tour: 'fdtable-deleted' })}

<h3>Sự cố 4 — chuyển tiền treo trong khi CPU rảnh</h3>
<p><strong>Triệu chứng:</strong> <code>/transfer</code> quá hạn; <code>os-17-billing</code> dùng 0 % CPU với 39 luồng.</p>
${details('Gợi ý', '<p>Bận-mà-chậm và rảnh-mà-kẹt là hai bệnh khác nhau. Rảnh mà kẹt nghĩa là các luồng đang chờ — hãy hỏi JVM ai đang giữ cái gì (' + a('os-6-1-deadlock', 'bài 6.1') + ').</p>')}
${details('Bằng chứng (output thật)', run('c173-chan-doan', 'docker exec os-17-traffic curl -s -m 3 -o /dev/null', 2) + '<p>Request thậm chí không nhận được lỗi: curl bỏ cuộc sau 3 s (exit 28). <code>jstack</code> tự tìm ra deadlock và in vòng chờ: <code>pool-1-thread-1</code> chờ một ví do <code>pool-1-thread-2</code> giữ, còn luồng 2 chờ ví do luồng 1 giữ — và stack chỉ ra chỗ: <code>Billing.transfer</code>, dòng 14, khối <code>synchronized</code> bên trong, khi khoá bên ngoài đã lấy rồi. Mỗi lệnh chuyển mới đụng tới các ví đó lại nhập hàng chờ, tới khi cả 16 luồng của pool đều kẹt.</p>')}
${details('Đáp án — sự cố 4', '<p><strong>Nguyên nhân gốc:</strong> <code>transfer(from, to)</code> khoá ví nguồn rồi mới khoá ví đích. Lệnh 0→1 và lệnh 1→0 cùng lúc thì mỗi bên giữ một khoá và chờ khoá kia: vòng chờ, điều kiện Coffman thứ tư. <strong>Sửa:</strong> luôn khoá theo một thứ tự toàn cục (ví có id nhỏ trước) — vòng chờ trở nên bất khả. <strong>Phòng ngừa:</strong> một phép kiểm bắn các lệnh chuyển ngược chiều đồng thời (đúng việc <code>check.sh</code> làm); khoá có hạn chờ (<code>tryLock</code>) để hỏng ầm ĩ thay vì treo mãi; trong CSDL, cùng luật đó với <code>SELECT … FOR UPDATE</code> theo thứ tự id (' + a('os-5-4-backend', 'bài 5.4') + ').</p>' + src('ch17/incident/fixed/Billing.java', 'java'))}
${lab('race', 'deadlock', 'vi', 'Hai luồng, hai khoá, thứ tự ngược nhau: đi từng bước tới khi cả hai chờ mãi — rồi đổi sang preset có thứ tự và thấy vòng chờ không thể xảy ra.', { tour: 'race-deadlock' })}

<h3>Sự cố 5 — nhật ký kiểm toán chậm, và các dòng bị hỏng</h3>
<p><strong>Triệu chứng:</strong> mỗi request có kiểm toán chậm thêm 25–30 ms; kiểm toán viên thấy những dòng không đọc được trong log.</p>
${details('Gợi ý', '<p>Container này không có trình gỡ lỗi và không có <code>SYS_PTRACE</code>. Bật một container gỡ lỗi vứt đi <em>trong PID namespace của nó</em> rồi đếm system call (' + a('os-11-2-strace-ltrace', 'bài 11.3') + ', ' + a('os-9-2-fsync', 'bài 9.3') + ').</p>')}
${details('Bằng chứng (output thật)', run('c173-chan-doan', "docker exec os-17-traffic sh -c 'for i in 1 2 3", 3) + '<p><code>--pid=container:os-17-audit</code> đặt một container <code>os-lab</code> mới vào PID namespace của dịch vụ audit, nên PID 1 của nó chính là máy chủ Python; <code>--cap-add SYS_PTRACE</code> chỉ cấp cho <em>trình gỡ lỗi</em>. Trong 4 giây máy chủ gọi 2.795 lần <code>write</code> và 2.795 lần <code>fsync</code> cho vài chục sự kiện dài ~70 byte: một lần ghi và một lần fsync <strong>cho mỗi byte</strong>. Và log có những dòng mà byte bị xen lẫn — hai request cùng ghi từng byte một vào cùng lúc.</p>')}
${details('Đáp án — sự cố 5', '<p><strong>Nguyên nhân gốc:</strong> "ghi từng byte và fsync từng byte cho chắc". <code>fsync</code> chờ thiết bị xác nhận — lời gọi đắt nhất của hệ thống file — và ở đây nó chạy ~80 lần mỗi sự kiện. Các lần <code>write</code> cỡ một byte từ nhiều luồng còn xen vào nhau: <code>O_APPEND</code> làm từng <em>lần write</em> nguyên tử, không làm từng dòng nguyên tử. <strong>Sửa:</strong> giữ lời hứa (nằm trên đĩa trước khi trả 200) nhưng chỉ trả giá một lần: dựng nguyên dòng, <strong>một</strong> <code>write</code> với <code>O_APPEND</code>, rồi một <code>fdatasync</code> dùng chung phủ mọi sự kiện đã ghi tới lúc đó (group commit — mẹo mà WAL của PostgreSQL dùng). Đo sau khi sửa: trung vị 0,7 ms, không còn dòng hỏng. <strong>Phòng ngừa:</strong> ngân sách độ trễ cho từng endpoint, và một phép kiểm ghi từ nhiều luồng rồi kiểm từng dòng.</p>' + src('ch17/incident/fixed/audit.py', 'python'))}

<h3>Kết thúc: lời giải mẫu đạt 10/10</h3>
${run('c173-cham-sua', './check.sh fixed', 2)}
<p>Cùng file compose, cùng giới hạn, cùng tải — chỉ năm file mã nguồn khác nhau (<code>fixed/</code> thay cho <code>services/</code>). RSS 68 MiB thay vì vòng lặp OOM, 19 fd thay vì 255, ổ log ở 1 %, 100/100 lệnh chuyển và tiền nguyên vẹn, trung vị audit 0,7 ms thay vì ~25 ms. Dòng cuối xác nhận <code>check.sh</code> không để lại container nào.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Cứ khởi động lại đi" là xoá sạch bằng chứng.</strong> Đo ở sự cố 1: sau bốn lần bị OOM giết, <code>docker inspect</code> vẫn báo <code>OOMKilled=false</code> — nó cho thấy trạng thái của tiến trình <em>mới</em>; chỉ <code>docker events</code> còn nhớ. Khởi động lại report sẽ làm trống bảng fd của nó; khởi động lại worker sẽ giải phóng file đã xoá; khởi động lại billing sẽ gỡ deadlock — và bạn còn lại năm dịch vụ "chập chờn" mà không có nguyên nhân gốc nào. Thu bằng chứng trước (<code>docker events</code>, <code>/proc/PID/fd</code>, <code>df</code>, <code>jstack</code>, <code>strace -c</code>), rồi mới khởi động lại.</p>
</div>

<h3>💼 Ghi gì vào CV</h3>
<ul>
<li><strong>Một dòng:</strong> "Chẩn đoán năm sự cố kiểu production xảy ra đồng thời trong một hệ Docker Compose (OOM kill, cạn file descriptor, file log đã xoá vẫn mở làm đầy đĩa, deadlock Java, I/O nghẽn vì fsync) từ bằng chứng tầng hệ điều hành; sửa cả năm và kiểm chứng bằng health check tự động (0/10 → 10/10)."</li>
<li><strong>Mang theo:</strong> một sự cố kể thành câu chuyện, kèm lệnh đã phá được nó — đó là câu trả lời phỏng vấn cho "kể về một lỗi khó" (17.4 chỉ cách).</li>
</ul>

<h3>🧪 Thực hành (chính là dự án, 1–2 ngày)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn đang trực cho cửa hàng <code>os17</code>. Năm phiếu sự cố mở cùng lúc và trưởng nhóm muốn nguyên nhân gốc, không muốn khởi động lại.</p>
<ol>
<li><code>KEEP=1 ./check.sh</code> — xác nhận 0/10, để hệ thống tiếp tục chạy.</li>
<li>Phân loại bằng <code>docker ps</code> và <code>docker stats</code>; mỗi container viết một dòng.</li>
<li>Với mỗi sự cố, thu một bằng chứng từ hệ điều hành trước khi mở mã nguồn của nó (chỉ dùng gợi ý khi kẹt).</li>
<li>Sửa năm file trong <code>services/</code>, chỉ khởi động lại dịch vụ bạn vừa sửa, và chạy <code>./check.sh</code> tới khi 10/10.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>check.sh</code> in <code>SCORE 10/10</code> trên <code>services/</code> của bạn, và báo cáo của bạn có, cho mỗi sự cố, một triệu chứng kèm con số, một lệnh bằng chứng kèm output, và một câu nguyên nhân gốc gọi tên cơ chế.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['triage (phân loại sự cố)', 'Xếp hạng vấn đề theo tài nguyên và mức ảnh hưởng trong những phút đầu, trước khi đoán nguyên nhân.'],
  ['docker events', 'Luồng sự kiện của Docker (oom, die kèm exitCode, restart…); giữ bằng chứng mà một lần khởi động lại xoá khỏi inspect và cgroup.'],
  ['EMFILE', '"Too many open files": tiến trình chạm RLIMIT_NOFILE; thường là rò rỉ, không phải giới hạn đặt quá thấp.'],
  ['deleted-but-open file (file đã xoá mà vẫn mở)', 'File bị gỡ tên trong khi một tiến trình vẫn giữ mở; các khối của nó vẫn bị chiếm (df) nhưng không đường dẫn nào tới được (du).'],
  ['circular wait (vòng chờ)', 'Điều kiện Coffman đằng sau deadlock: mỗi luồng giữ một khoá mà luồng kế tiếp cần. Một thứ tự khoá toàn cục ngăn được nó.'],
  ['debug sidecar (container gỡ lỗi đi kèm)', 'Một container vứt đi gia nhập namespace của mục tiêu (<code>--pid=container:X</code>), mang công cụ và capability mà mục tiêu không có.'],
  ['group commit (gom fsync)', 'Nhiều người ghi dùng chung một lần fsync/fdatasync, giữ độ bền mà chỉ trả độ trễ của thiết bị một lần cho mỗi nhóm.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phân loại theo tài nguyên trước: vừa khởi động lại, bộ nhớ sát giới hạn, CPU bận mà không tiến, luồng rảnh — năm dòng, năm đầu mối.</li>
<li>OOM: <code>docker events</code> cho thấy <code>oom</code> + <code>die 137</code>; nguyên nhân là một cache không giới hạn có khoá chứa tham số URL ngẫu nhiên.</li>
<li>EMFILE: 236 trên 255 fd mở trỏ vào một file mẫu — mỗi request rò một fd. Đĩa: df 100 % mà du 400 K = một log đã xoá vẫn mở, bị log DEBUG bỏ quên lấp đầy.</li>
<li>Deadlock: CPU rảnh + vòng chờ trong jstack; sửa bằng khoá ví theo thứ tự id. I/O chậm: 2.795 fsync trong 4 s, mỗi byte một lần; sửa bằng một lần write + gom fsync (trung vị 0,7 ms).</li>
<li>Thu bằng chứng trước khi khởi động lại — sau khi khởi động lại, <code>docker inspect</code> báo <code>OOMKilled=false</code>; chỉ <code>docker events</code> còn nhớ.</li>
</ul>
${L('https://docs.docker.com/reference/cli/docker/system/events/', '📄', 'docker system events — tài liệu Docker', 'Luồng sự kiện: oom, die, restart và các thuộc tính như exitCode.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html', '📄', 'jstack — tài liệu công cụ JDK 21', 'Bản kết xuất luồng và tự động phát hiện deadlock mức Java.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 17.4 — Báo cáo sự cố + câu chuyện phỏng vấn ───────────────────────── */
    {
      title: '17.4 — Write the postmortem and your interview story: blameless, measured, with the whole-course checklist|||17.4 — Viết báo cáo sự cố và câu chuyện phỏng vấn: không đổ lỗi, có số đo, kèm checklist của cả khoá',
      slug: 'os-17-4-bao-cao',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một sự cố chỉ xong khi cả nhóm học được từ nó: mẫu báo cáo sự cố không đổ lỗi (tóm tắt, ảnh hưởng bằng số, dòng thời gian từ bằng chứng, nguyên nhân gốc + yếu tố góp phần, việc cần làm phân loại ngăn/phát hiện/giảm nhẹ), một bản mẫu viết thật cho sự cố đĩa đầy của 17.3, checklist hệ điều hành của cả khoá cho một backend trước khi lên production, và cách kể dự án thành câu chuyện phỏng vấn hai phút có số đo.',
      content: `${G174}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Project 4 of 4</span>
<h2>Write the postmortem and your interview story</h2>
<p class="lead">When <code>check.sh</code> prints 10/10 the service is healthy, but the incident is not finished: the team has not learned anything yet, and the next person will plant the same bug. A <strong>postmortem</strong> turns one bad afternoon into a change in how the team works. The question of this lesson: <strong>how do you write down what happened so that nobody is blamed, every claim is backed by a measurement, and the same failure cannot come back — and how do you retell it in two minutes in an interview?</strong></p>

<h3>The brief — Project 4: one postmortem, one story</h3>
<p><strong>Deliverables:</strong> (1) a postmortem for <em>one</em> incident of 17.3 (or a real one from your own project), using the template below, at most two pages; (2) a two-minute interview story for each project of this chapter; (3) the whole-course checklist below, applied to one service you have built.</p>
${rubric([
  ['P1', 'Impact stated in numbers (requests failed, duration, users), not adjectives', '2', 'reviewer'],
  ['P2', 'Timeline built from evidence (logs, <code>docker events</code>, outputs), each line with its source', '2', 'reviewer'],
  ['P3', 'Root cause names the mechanism; contributing factors explain why the system allowed it', '2', 'reviewer'],
  ['P4', 'No blame: no names, no "human error" as a cause', '1', 'reviewer'],
  ['P5', 'Action items: each has an owner, a date and a type (prevent / detect / mitigate), at least one of each', '2', 'reviewer'],
  ['P6', 'Interview story: under 2 minutes, one number in the problem, one in the result', '1', 'peer, timed'],
], ['Criterion', 'Marks', 'Graded by'])}

<h3>Blameless, but not vague</h3>
<p>"Blameless" comes from site reliability engineering: assume everyone acted reasonably with what they knew at the time, and ask <em>why the system made the mistake easy</em>. A log level left at <code>DEBUG</code> is not a person’s failure; it is a system that ships whatever level was last set, with no alert on disk use and a rotation script nobody reviewed. Blameless is not soft, though: every sentence must survive the question "how do you know?"</p>
<table>
<tr><th>Section</th><th>Answers</th><th>Typical mistake</th></tr>
<tr><td>Summary</td><td>What broke, for whom, how long, in three lines</td><td>a narrative of the investigation instead of the outcome</td></tr>
<tr><td>Impact</td><td>Numbers: failed requests or jobs, duration, data lost or not</td><td>"some users were affected"</td></tr>
<tr><td>Timeline</td><td>What was seen and done, when — each line with its source</td><td>times from memory</td></tr>
<tr><td>Detection</td><td>How we found out; how we <em>should</em> have</td><td>skipping it — this is where alerts come from</td></tr>
<tr><td>Root cause + contributing factors</td><td>The mechanism (OS-level), then why nothing stopped it</td><td>stopping at the first "why"</td></tr>
<tr><td>What went well / badly</td><td>Tools and habits worth keeping or fixing</td><td>only the bad</td></tr>
<tr><td>Action items</td><td>Owner, date, type: prevent · detect · mitigate</td><td>"be more careful"</td></tr>
</table>

<h3>A worked postmortem: incident 3 of 17.3</h3>
<p>Every number below comes from the real run in 17.3:</p>
${run('c173-chan-doan', 'docker exec os-17-traffic curl -s worker:3002/', 4)}
<div class="callout ok">
<p><strong>Summary.</strong> The background worker failed thousands of jobs with <code>ENOSPC</code> (no space left on device) because its 64 MiB log disk was full of a log file that had already been deleted. Restarting fixed it for a minute; the real fixes are a log level from configuration and a rotation that never deletes an open file.</p>
<p><strong>Impact.</strong> At the time of measurement 8,701 jobs had succeeded and several thousand had failed (the health endpoint above). Results of failed jobs were not written; no log line survived the rotation.</p>
<p><strong>Timeline</strong> (relative to <code>docker compose up</code>; source in brackets). T+0 stack started [compose]. Before T+75 s the log disk reached 100 % [<code>df</code>]. T+75 s <code>check.sh</code>: health reports <code>[Errno 28] No space left on device</code> [check output]. T+75 s+ <code>du</code> finds 400 KiB on the disk that <code>df</code> calls full; <code>/proc</code> shows fd 3 → <code>worker.log.1 (deleted)</code> with 66,699,264 bytes of DEBUG lines [commands above].</p>
<p><strong>Detection.</strong> Found by the health check, not by an alert. Should have been: an alert at 80 % disk use and on any <code>(deleted)</code> file held open.</p>
<p><strong>Root cause.</strong> The process kept appending to a file whose name the rotation script had removed; the inode and its blocks stayed allocated until the disk filled. <strong>Contributing factors:</strong> the log level was hard-coded to <code>DEBUG</code> (40 lines per job); the rotation script was written in-house and never reviewed; logs went to a small separate disk with no alert.</p>
<p><strong>What went well:</strong> <code>df</code> vs <code>du</code> pointed at the cause within two commands. <strong>Badly:</strong> the first instinct was to restart, which would have destroyed the evidence.</p>
<p><strong>Action items.</strong> Prevent — read the log level from the environment, default INFO (owner: backend, this sprint). Prevent — log to stdout and let Docker rotate with <code>max-size</code>; delete the home-made script (owner: platform). Detect — alert at 80 % disk and on deleted-but-open files (owner: platform). Mitigate — runbook line: <code>: &gt; /proc/PID/fd/N</code> frees the space without a restart (owner: on-call).</p>
</div>
<p>The real story behind this exercise — the disk that filled under PostgreSQL on this site’s VPS and came back four times — is told in ${a('os-2-4-dia-io', 'lesson 2.4')}; its "came back" is exactly what action items are for.</p>
${lab('sysmon', 'diskfull', 'en', 'The disk-full incident on a simulated machine: watch df climb while the process keeps writing — then find the file holding the space.')}

<div class="pitfall co-tieu-de">
<p><strong>"Root cause: human error."</strong> It is never the root cause, it is where the investigation stopped. Ask the next why: why could one setting fill the disk? Why did nothing alert? Why was a deleted file still growing? Each answer produces an action item that protects the next person; "be more careful" protects no one. The same goes for "the server was overloaded" — overloaded by what, measured how, and why was there no limit (17.2)?</p>
</div>

<h3>The whole-course checklist: before a backend goes to production</h3>
<table>
<tr><th>Resource</th><th>Check</th><th>Tool</th><th>Lesson</th></tr>
<tr><td>Processes</td><td>PID 1 forwards SIGTERM and reaps children; shutdown finishes within the grace period</td><td><code>docker stop</code> + time, <code>ps -o stat</code></td><td>${a('os-1-5-pid1', '1.5')}, 17.2</td></tr>
<tr><td>CPU</td><td>The runtime sees the container’s CPU limit; pools sized by CPU vs waiting work</td><td><code>nproc</code>, <code>cpu.max</code>, load test</td><td>${a('os-3-4-da-loi', '3.4')}, 17.2</td></tr>
<tr><td>Concurrency</td><td>Shared state locked; locks taken in one global order; timeouts on lock waits</td><td>tests with opposite operations, <code>jstack</code></td><td>${a('os-5-1-race', '5.1')}, ${a('os-6-1-deadlock', '6.1')}</td></tr>
<tr><td>Memory</td><td>Heap limit below the container limit; every cache bounded; restart and OOM alerts</td><td><code>memory.max</code>, <code>docker events</code></td><td>${a('os-8-5-gioi-han', '8.5')}, 17.3</td></tr>
<tr><td>Disk</td><td>Logs rotated by size; alerts at 80 %; no deleted-but-open files; inodes</td><td><code>df -h</code>, <code>df -i</code>, <code>lsof +L1</code></td><td>${a('os-2-4-dia-io', '2.4')}</td></tr>
<tr><td>Durability</td><td>Data that must survive is fsynced, written atomically (temp → fsync → rename)</td><td><code>strace -e fsync</code></td><td>${a('os-9-2-fsync', '9.3')}</td></tr>
<tr><td>File descriptors</td><td>Every open has a close on every path; limit known; fds stable under load</td><td><code>/proc/PID/fd</code>, <code>ulimit -n</code></td><td>${a('os-10-1-fd', '10.1')}, 17.3</td></tr>
<tr><td>Network I/O</td><td>Timeouts everywhere (connect, read, pool acquire); backpressure; one write per response</td><td><code>ss</code>, load test</td><td>${a('os-10-8-backpressure', '10.8')}</td></tr>
<tr><td>Containers</td><td>Non-root user, read-only root, dropped capabilities, no <code>docker.sock</code>, limits set</td><td><code>docker inspect</code>, <code>/proc/1/status</code></td><td>${a('os-12-7-pod-dockerfile', '12.7')}, ${a('os-13-4-container-escape', '13.4')}</td></tr>
</table>

<h3>Your interview story: two minutes, two numbers</h3>
<p>Interviewers ask "tell me about a hard bug" or "a project you are proud of" to hear how you think. Use <strong>STAR</strong> (situation, task, action, result) and put a number in the problem and one in the result. Example built from 17.3, incident 4:</p>
<div class="callout ok">
<p><strong>S:</strong> "In a lab system that simulated a shop under load, transfers between wallets started timing out — curl gave up after 3 seconds — while the billing service sat at 0 % CPU with 39 threads." <strong>T:</strong> "I was on call and had to find the cause without restarting it." <strong>A:</strong> "Idle CPU plus stuck requests meant threads waiting, not working, so I took a thread dump with jstack. It reported a Java-level deadlock: four pool threads waiting on each other’s wallet locks, because a transfer locked the source then the destination, and two opposite transfers cross." <strong>R:</strong> "I changed it to lock wallets in id order, which makes a cycle impossible, and added a check that fires 100 opposite transfers at once: all 100 finished within the 10-second check and the total balance stayed at 4,000,000."</p>
</div>
<p>Write one for each project: the shell (one missing <code>close</code> hangs a pipeline), the server (Little’s law: 64 clients ⇒ 182 ms at 347 req/s; a queue of 8 ⇒ p99 32 ms), the incident lab, and the stretch runtime if you built it. Rehearse each with a timer.</p>

<h3>💼 What to put on your CV</h3>
<ul>
<li>A <strong>Projects</strong> section with one line per project (the lines in 17.1–17.3 and 17.5), each with a link to a repository whose README starts with the acceptance-test output.</li>
<li>One postmortem in the repository of 17.3 — few students show they can write one, and every on-call team needs it.</li>
<li>The checklist above, as a <code>PRODUCTION-CHECKLIST.md</code> in your own backend project, with each line checked or explained.</li>
</ul>

<h3>🧪 Practice (half a day)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team lead liked how you fixed the <code>os17</code> incidents and asks for a postmortem the whole team can read on Monday, plus a short talk.</p>
<ol>
<li>Pick one incident of 17.3. Fill in every section of the template, with the source of each timeline line.</li>
<li>Remove every name and every "should have been more careful". Replace each with a system change.</li>
<li>Write three action items: one prevent, one detect, one mitigate — each with an owner and a date.</li>
<li>Record your two-minute STAR story for the same incident and time it.</li>
</ol>
<p><strong>Done when:</strong> a classmate can find, for every claim in your postmortem, the command or log line that proves it; and your story runs under two minutes with one number in the problem and one in the result.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['postmortem', 'A written analysis after an incident: impact, timeline, root cause, contributing factors, action items.'],
  ['blameless', 'Treating the system, not the person, as the thing to fix; people acted reasonably with what they knew.'],
  ['contributing factor', 'A condition that let the root cause turn into an outage (no alert, no limit, no review).'],
  ['action item (prevent / detect / mitigate)', 'A concrete change with an owner and a date: stop it happening, notice it sooner, or limit the damage.'],
  ['runbook', 'Step-by-step instructions for on-call, e.g. how to free a deleted-but-open file without a restart.'],
  ['STAR', 'Situation, Task, Action, Result — a structure for interview stories; put a number in S and in R.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>An incident is finished when the team has learned from it; the postmortem is how.</li>
<li>Blameless means asking why the system allowed the failure — not "human error", not "be more careful".</li>
<li>Every claim needs a source: numbers for impact, logs and command outputs for the timeline.</li>
<li>Action items come in three kinds — prevent, detect, mitigate — each with an owner and a date.</li>
<li>The whole course fits in one checklist per resource; your interview story is STAR with two numbers, under two minutes.</li>
</ul>
${L('https://sre.google/sre-book/postmortem-culture/', '📄', 'Postmortem Culture: Learning from Failure — Google SRE book', 'Blameless postmortems, when to write one, and how to make them stick.', 'Open')}
${L('https://sre.google/sre-book/example-postmortem/', '📄', 'Example postmortem — Google SRE book', 'A complete postmortem with impact, timeline, root cause and action items.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Dự án 4 / 4</span>
<h2>Viết báo cáo sự cố và câu chuyện phỏng vấn</h2>
<p class="lead">Khi <code>check.sh</code> in 10/10 thì dịch vụ đã khoẻ, nhưng sự cố chưa xong: cả nhóm chưa học được gì, và người kế tiếp sẽ cài đúng lỗi đó lần nữa. Một <strong>báo cáo sự cố</strong> (postmortem) biến một buổi chiều tệ thành một thay đổi trong cách cả nhóm làm việc. Câu hỏi của bài: <strong>bạn ghi lại chuyện đã xảy ra thế nào để không ai bị đổ lỗi, mọi khẳng định đều có số đo đứng sau, và lỗi đó không thể quay lại — rồi kể lại nó trong hai phút ở buổi phỏng vấn?</strong></p>

<h3>Tờ đề — Dự án 4: một báo cáo sự cố, một câu chuyện</h3>
<p><strong>Sản phẩm:</strong> (1) một báo cáo sự cố cho <em>một</em> sự cố của 17.3 (hoặc một sự cố thật trong dự án của bạn), theo mẫu bên dưới, tối đa hai trang; (2) một câu chuyện phỏng vấn hai phút cho mỗi dự án của chương này; (3) checklist của cả khoá bên dưới, áp lên một dịch vụ bạn đã dựng.</p>
${rubric([
  ['P1', 'Ảnh hưởng nêu bằng con số (request hỏng, thời lượng, người dùng), không bằng tính từ', '2', 'người chấm'],
  ['P2', 'Dòng thời gian dựng từ bằng chứng (log, <code>docker events</code>, output), mỗi dòng kèm nguồn', '2', 'người chấm'],
  ['P3', 'Nguyên nhân gốc gọi tên cơ chế; các yếu tố góp phần giải thích vì sao hệ thống để nó xảy ra', '2', 'người chấm'],
  ['P4', 'Không đổ lỗi: không tên người, không "lỗi con người" làm nguyên nhân', '1', 'người chấm'],
  ['P5', 'Việc cần làm: mỗi việc có người phụ trách, hạn và loại (ngăn / phát hiện / giảm nhẹ), mỗi loại ít nhất một việc', '2', 'người chấm'],
  ['P6', 'Câu chuyện phỏng vấn: dưới 2 phút, một con số ở vấn đề, một ở kết quả', '1', 'bạn học, bấm giờ'],
], ['Tiêu chí', 'Điểm', 'Ai chấm'])}

<h3>Không đổ lỗi, nhưng không mơ hồ</h3>
<p>"Không đổ lỗi" (blameless) đến từ nghề vận hành tin cậy (SRE): giả định ai cũng đã hành động hợp lý với những gì họ biết lúc đó, và hỏi <em>vì sao hệ thống làm cho sai lầm trở nên dễ dàng</em>. Một mức log bị bỏ quên ở <code>DEBUG</code> không phải thất bại của một người; đó là một hệ thống phát hành bất cứ mức log nào được đặt sau cùng, không có cảnh báo về dung lượng đĩa, và một kịch bản xoay log không ai duyệt. Nhưng không đổ lỗi không có nghĩa là nhẹ tay: câu nào cũng phải sống sót qua câu hỏi "sao bạn biết?"</p>
<table>
<tr><th>Mục</th><th>Trả lời câu hỏi</th><th>Lỗi hay gặp</th></tr>
<tr><td>Tóm tắt</td><td>Cái gì hỏng, ảnh hưởng ai, bao lâu, trong ba dòng</td><td>kể quá trình điều tra thay vì kết quả</td></tr>
<tr><td>Ảnh hưởng</td><td>Con số: request hay việc hỏng, thời lượng, có mất dữ liệu không</td><td>"một số người dùng bị ảnh hưởng"</td></tr>
<tr><td>Dòng thời gian</td><td>Đã thấy gì, làm gì, lúc nào — mỗi dòng kèm nguồn</td><td>giờ giấc theo trí nhớ</td></tr>
<tr><td>Phát hiện</td><td>Ta biết bằng cách nào; <em>lẽ ra</em> phải biết bằng cách nào</td><td>bỏ qua — đây là chỗ cảnh báo được sinh ra</td></tr>
<tr><td>Nguyên nhân gốc + yếu tố góp phần</td><td>Cơ chế (tầng hệ điều hành), rồi vì sao không gì chặn được nó</td><td>dừng ở chữ "vì sao" đầu tiên</td></tr>
<tr><td>Điều làm tốt / chưa tốt</td><td>Công cụ và thói quen nên giữ hay nên sửa</td><td>chỉ kể cái dở</td></tr>
<tr><td>Việc cần làm</td><td>Người phụ trách, hạn, loại: ngăn · phát hiện · giảm nhẹ</td><td>"cẩn thận hơn"</td></tr>
</table>

<h3>Một báo cáo mẫu: sự cố 3 của 17.3</h3>
<p>Mọi con số dưới đây lấy từ lần chạy thật ở 17.3:</p>
${run('c173-chan-doan', 'docker exec os-17-traffic curl -s worker:3002/', 4)}
<div class="callout ok">
<p><strong>Tóm tắt.</strong> Tiến trình chạy nền làm hỏng hàng nghìn việc với <code>ENOSPC</code> (hết chỗ trên thiết bị) vì ổ log 64 MiB của nó đầy một file log đã bị xoá. Khởi động lại thì đỡ được một phút; cách sửa thật là mức log lấy từ cấu hình và một cách xoay log không bao giờ xoá file đang mở.</p>
<p><strong>Ảnh hưởng.</strong> Ở thời điểm đo, 8.701 việc đã thành công và vài nghìn việc hỏng (trang sức khoẻ ở trên). Kết quả của các việc hỏng không được ghi; không dòng log nào sống sót qua lần xoay log.</p>
<p><strong>Dòng thời gian</strong> (tính từ <code>docker compose up</code>; nguồn trong ngoặc). T+0 hệ thống bật [compose]. Trước T+75 s ổ log chạm 100 % [<code>df</code>]. T+75 s <code>check.sh</code>: trang sức khoẻ báo <code>[Errno 28] No space left on device</code> [output check]. Sau T+75 s <code>du</code> chỉ thấy 400 KiB trên cái ổ mà <code>df</code> bảo đầy; <code>/proc</code> cho thấy fd 3 → <code>worker.log.1 (deleted)</code> chứa 66.699.264 byte dòng DEBUG [các lệnh ở trên].</p>
<p><strong>Phát hiện.</strong> Do bộ kiểm sức khoẻ tìm ra, không phải cảnh báo. Lẽ ra phải là: cảnh báo ở 80 % dung lượng đĩa và khi có bất kỳ file <code>(deleted)</code> nào còn bị giữ mở.</p>
<p><strong>Nguyên nhân gốc.</strong> Tiến trình tiếp tục ghi nối vào một file mà kịch bản xoay log đã gỡ tên; inode và các khối của nó vẫn bị chiếm tới khi đĩa đầy. <strong>Yếu tố góp phần:</strong> mức log viết cứng là <code>DEBUG</code> (40 dòng mỗi việc); kịch bản xoay log tự viết và chưa ai duyệt; log ghi vào một ổ riêng nhỏ không có cảnh báo.</p>
<p><strong>Điều làm tốt:</strong> <code>df</code> so với <code>du</code> chỉ ra nguyên nhân sau hai lệnh. <strong>Chưa tốt:</strong> phản xạ đầu tiên là khởi động lại, thứ sẽ xoá sạch bằng chứng.</p>
<p><strong>Việc cần làm.</strong> Ngăn — đọc mức log từ biến môi trường, mặc định INFO (phụ trách: backend, trong sprint này). Ngăn — ghi log ra stdout và để Docker xoay theo <code>max-size</code>; xoá kịch bản tự chế (phụ trách: hạ tầng). Phát hiện — cảnh báo ở 80 % đĩa và khi có file đã xoá còn mở (phụ trách: hạ tầng). Giảm nhẹ — thêm vào sổ tay trực: <code>: &gt; /proc/PID/fd/N</code> giải phóng chỗ mà không cần khởi động lại (phụ trách: người trực).</p>
</div>
<p>Câu chuyện thật đứng sau bài tập này — cái đĩa đầy dưới chân PostgreSQL trên VPS của chính trang này và quay lại bốn lần — được kể ở ${a('os-2-4-dia-io', 'bài 2.4')}; chữ "quay lại" của nó chính là lý do việc cần làm tồn tại.</p>
${lab('sysmon', 'diskfull', 'vi', 'Sự cố đầy đĩa trên một máy mô phỏng: nhìn df leo lên trong khi tiến trình vẫn ghi — rồi tìm ra file đang giữ chỗ.')}

<div class="pitfall co-tieu-de">
<p><strong>"Nguyên nhân gốc: lỗi con người."</strong> Nó không bao giờ là nguyên nhân gốc, nó là chỗ cuộc điều tra dừng lại. Hỏi tiếp chữ vì sao: vì sao một thiết lập lại làm đầy được đĩa? Vì sao không có gì cảnh báo? Vì sao một file đã xoá vẫn lớn lên? Mỗi câu trả lời sinh ra một việc cần làm bảo vệ người kế tiếp; "cẩn thận hơn" chẳng bảo vệ ai. Câu "máy chủ quá tải" cũng vậy — quá tải vì cái gì, đo thế nào, và vì sao không có giới hạn nào (17.2)?</p>
</div>

<h3>Checklist của cả khoá: trước khi một backend lên production</h3>
<table>
<tr><th>Tài nguyên</th><th>Kiểm</th><th>Công cụ</th><th>Bài</th></tr>
<tr><td>Tiến trình</td><td>PID 1 chuyển SIGTERM và thu dọn con; tắt xong trong thời gian ân hạn</td><td><code>docker stop</code> + đo giờ, <code>ps -o stat</code></td><td>${a('os-1-5-pid1', '1.5')}, 17.2</td></tr>
<tr><td>CPU</td><td>Runtime thấy giới hạn CPU của container; pool chọn cỡ theo việc tính hay việc chờ</td><td><code>nproc</code>, <code>cpu.max</code>, đo tải</td><td>${a('os-3-4-da-loi', '3.4')}, 17.2</td></tr>
<tr><td>Đồng thời</td><td>Trạng thái chung được khoá; khoá lấy theo một thứ tự toàn cục; chờ khoá có hạn</td><td>phép kiểm thao tác ngược chiều, <code>jstack</code></td><td>${a('os-5-1-race', '5.1')}, ${a('os-6-1-deadlock', '6.1')}</td></tr>
<tr><td>Bộ nhớ</td><td>Giới hạn heap dưới giới hạn container; cache nào cũng có trần; cảnh báo khởi động lại và OOM</td><td><code>memory.max</code>, <code>docker events</code></td><td>${a('os-8-5-gioi-han', '8.5')}, 17.3</td></tr>
<tr><td>Đĩa</td><td>Log xoay theo dung lượng; cảnh báo ở 80 %; không có file đã xoá mà vẫn mở; inode</td><td><code>df -h</code>, <code>df -i</code>, <code>lsof +L1</code></td><td>${a('os-2-4-dia-io', '2.4')}</td></tr>
<tr><td>Độ bền dữ liệu</td><td>Dữ liệu phải sống sót được fsync, ghi nguyên tử (file tạm → fsync → rename)</td><td><code>strace -e fsync</code></td><td>${a('os-9-2-fsync', '9.3')}</td></tr>
<tr><td>File descriptor</td><td>Mỗi lần mở có một lần đóng ở mọi nhánh; biết giới hạn; số fd ổn định dưới tải</td><td><code>/proc/PID/fd</code>, <code>ulimit -n</code></td><td>${a('os-10-1-fd', '10.1')}, 17.3</td></tr>
<tr><td>I/O mạng</td><td>Timeout ở mọi nơi (kết nối, đọc, lấy từ pool); backpressure; mỗi câu trả lời một lần ghi</td><td><code>ss</code>, đo tải</td><td>${a('os-10-8-backpressure', '10.8')}</td></tr>
<tr><td>Container</td><td>Người dùng không phải root, gốc chỉ-đọc, bỏ capability, không gắn <code>docker.sock</code>, có giới hạn</td><td><code>docker inspect</code>, <code>/proc/1/status</code></td><td>${a('os-12-7-pod-dockerfile', '12.7')}, ${a('os-13-4-container-escape', '13.4')}</td></tr>
</table>

<h3>Câu chuyện phỏng vấn: hai phút, hai con số</h3>
<p>Người phỏng vấn hỏi "kể về một lỗi khó" hay "một dự án bạn tự hào" để nghe cách bạn suy nghĩ. Dùng <strong>STAR</strong> (tình huống, nhiệm vụ, hành động, kết quả) và đặt một con số vào vấn đề, một con số vào kết quả. Ví dụ dựng từ sự cố 4 của 17.3:</p>
<div class="callout ok">
<p><strong>S:</strong> "Trong một hệ thống lab mô phỏng cửa hàng dưới tải, lệnh chuyển tiền giữa các ví bắt đầu quá hạn — curl bỏ cuộc sau 3 giây — trong khi dịch vụ billing nằm ở 0 % CPU với 39 luồng." <strong>T:</strong> "Tôi đang trực và phải tìm nguyên nhân mà không khởi động lại." <strong>A:</strong> "CPU rảnh mà request kẹt nghĩa là luồng đang chờ chứ không làm việc, nên tôi lấy bản kết xuất luồng bằng jstack. Nó báo một deadlock mức Java: bốn luồng của pool chờ khoá ví của nhau, vì lệnh chuyển khoá ví nguồn rồi mới khoá ví đích, và hai lệnh ngược chiều đan chéo nhau." <strong>R:</strong> "Tôi đổi sang khoá ví theo thứ tự id, khiến vòng chờ trở nên bất khả, rồi thêm một phép kiểm bắn 100 lệnh chuyển ngược chiều cùng lúc: cả 100 xong trong 10 giây kiểm và tổng số dư giữ nguyên 4.000.000."</p>
</div>
<p>Viết một câu chuyện cho mỗi dự án: shell (thiếu một <code>close</code> là ống dẫn treo), máy chủ (định luật Little: 64 khách ⇒ 182 ms ở 347 req/s; hàng đợi 8 ⇒ p99 32 ms), phòng lab sự cố, và runtime mở rộng nếu bạn đã dựng. Tập từng câu chuyện với đồng hồ bấm giờ.</p>

<h3>💼 Ghi gì vào CV</h3>
<ul>
<li>Một mục <strong>Dự án</strong> với mỗi dự án một dòng (các dòng ở 17.1–17.3 và 17.5), mỗi dòng kèm đường dẫn tới một repository có README bắt đầu bằng output của bộ kiểm nghiệm thu.</li>
<li>Một báo cáo sự cố đặt trong repository của 17.3 — ít sinh viên cho thấy mình viết được nó, và đội trực nào cũng cần.</li>
<li>Checklist ở trên, thành file <code>PRODUCTION-CHECKLIST.md</code> trong dự án backend của chính bạn, mỗi dòng được đánh dấu hoặc giải thích.</li>
</ul>

<h3>🧪 Thực hành (nửa ngày)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trưởng nhóm thích cách bạn sửa các sự cố của <code>os17</code> và muốn một báo cáo sự cố cả nhóm đọc được vào thứ Hai, kèm một bài nói ngắn.</p>
<ol>
<li>Chọn một sự cố của 17.3. Điền mọi mục của mẫu, ghi nguồn cho từng dòng thời gian.</li>
<li>Xoá mọi tên người và mọi câu "lẽ ra phải cẩn thận hơn". Thay mỗi câu bằng một thay đổi của hệ thống.</li>
<li>Viết ba việc cần làm: một ngăn, một phát hiện, một giảm nhẹ — mỗi việc có người phụ trách và hạn.</li>
<li>Ghi âm câu chuyện STAR hai phút cho cùng sự cố đó và bấm giờ.</li>
</ol>
<p><strong>Đạt khi:</strong> một bạn học tìm được, cho mọi khẳng định trong báo cáo của bạn, lệnh hoặc dòng log chứng minh nó; và câu chuyện của bạn dưới hai phút, có một con số ở vấn đề và một ở kết quả.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['postmortem (báo cáo sự cố)', 'Bản phân tích viết sau sự cố: ảnh hưởng, dòng thời gian, nguyên nhân gốc, yếu tố góp phần, việc cần làm.'],
  ['blameless (không đổ lỗi)', 'Coi hệ thống, không phải con người, là thứ cần sửa; mọi người đã hành động hợp lý với những gì họ biết.'],
  ['contributing factor (yếu tố góp phần)', 'Điều kiện để nguyên nhân gốc biến thành sự cố (không cảnh báo, không giới hạn, không ai duyệt).'],
  ['action item (việc cần làm: ngăn / phát hiện / giảm nhẹ)', 'Một thay đổi cụ thể có người phụ trách và hạn: chặn nó xảy ra, biết sớm hơn, hoặc hạn chế thiệt hại.'],
  ['runbook (sổ tay trực)', 'Hướng dẫn từng bước cho người trực, ví dụ cách giải phóng một file đã xoá mà vẫn mở không cần khởi động lại.'],
  ['STAR', 'Tình huống, Nhiệm vụ, Hành động, Kết quả — khung cho câu chuyện phỏng vấn; đặt con số ở S và ở R.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một sự cố chỉ xong khi cả nhóm học được từ nó; báo cáo sự cố là cách để học.</li>
<li>Không đổ lỗi nghĩa là hỏi vì sao hệ thống để lỗi xảy ra — không phải "lỗi con người", không phải "cẩn thận hơn".</li>
<li>Mọi khẳng định cần nguồn: con số cho ảnh hưởng, log và output lệnh cho dòng thời gian.</li>
<li>Việc cần làm có ba loại — ngăn, phát hiện, giảm nhẹ — mỗi việc có người phụ trách và hạn.</li>
<li>Cả khoá gói trong một checklist theo tài nguyên; câu chuyện phỏng vấn là STAR với hai con số, dưới hai phút.</li>
</ul>
${L('https://sre.google/sre-book/postmortem-culture/', '📄', 'Postmortem Culture: Learning from Failure — sách SRE của Google', 'Báo cáo sự cố không đổ lỗi, khi nào viết, và làm sao để nó có tác dụng thật.', 'Mở')}
${L('https://sre.google/sre-book/example-postmortem/', '📄', 'Example postmortem — sách SRE của Google', 'Một báo cáo sự cố đầy đủ: ảnh hưởng, dòng thời gian, nguyên nhân gốc và việc cần làm.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 17.5 — Mở rộng: mini container runtime ───────────────────────── */
    {
      title: '17.5 — Stretch project: a mini container runtime in C — namespaces, pivot_root, cgroups and dropped capabilities|||17.5 — Dự án mở rộng: mini container runtime bằng C — namespace, pivot_root, cgroup và bỏ capability',
      slug: 'os-17-5-container',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tờ đề dự án mở rộng: minictr, ~120 dòng C làm bằng system call đúng việc mini-container.sh của bài 12.4 — cgroup v2 (memory.max, pids.max, cpu.max) đặt TRƯỚC khi con chạy, clone() năm namespace + unshare(CLONE_NEWCGROUP), pivot_root vào rootfs busybox, /proc và /dev mới, bỏ 12 capability + no_new_privs, báo oom_kill/pids.events, dọn cgroup; bộ kiểm 10 ca trong container lab đặc quyền vứt đi: mẫu 10/10.',
      content: `${G175}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Stretch project</span>
<h2>Stretch: a mini container runtime in C</h2>
<p class="lead">In ${a('os-12-4-mini', 'lesson 12.4')} you built a container with about forty lines of shell: <code>unshare</code>, <code>mount</code>, <code>pivot_root</code>, a cgroup directory. Each of those commands is a thin wrapper around one or two system calls. The question of this stretch project: <strong>can you write the runtime yourself — the program Docker calls <code>runc</code> — in C, so that every isolation a container has is a line of your code that you can point at?</strong></p>

<div class="callout warn">
<p><strong>Safety.</strong> A runtime needs root, mounts and cgroups. Build and test it <strong>only</strong> inside a throwaway lab container started with <code>--privileged --label oslab=1</code>, exactly as in Chapter 12 — never on your laptop’s host or on a server. The tests mount their root file system on a tmpfs, so nothing touches a real disk.</p>
</div>

<h3>The brief — Stretch project: <code>minictr</code></h3>
<p><strong>1. Overview.</strong> <code>minictr [--mem 64M] [--pids 32] [--cpu "50000 100000"] [--hostname box] ROOTFS CMD [ARGS…]</code> runs CMD as PID 1 of a new container whose root is ROOTFS, waits for it, cleans up, and exits with CMD’s exit code.</p>
<p><strong>2. Required structure.</strong></p>
${cmd('ctr/', '├── minictr.c     # gcc -Wall -Wextra -Werror -O2 -o minictr minictr.c', '└── test-ctr.sh   # given: builds a busybox rootfs on a tmpfs and runs 10 checks')}
<p><strong>3. What the runtime must do, in order</strong> — each step is a system call you met in Chapter 12:</p>
<ol>
<li>Create a cgroup <code>/sys/fs/cgroup/minictr-PID</code> and write <code>memory.max</code>, <code>memory.swap.max = 0</code>, <code>pids.max</code>, <code>cpu.max</code> (${a('os-12-2-cgroups', '12.2')}).</li>
<li><code>clone()</code> a child with <code>CLONE_NEWPID | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC | CLONE_NEWNET</code> (${a('os-12-1-namespaces', '12.1')}).</li>
<li>Parent writes the child’s PID into <code>cgroup.procs</code>, <em>then</em> tells the child to continue (a pipe) — the limits apply before any user code runs.</li>
<li>Child: <code>unshare(CLONE_NEWCGROUP)</code> (now its cgroup looks like <code>/</code>), <code>sethostname</code>, make <code>/</code> private, bind-mount ROOTFS on itself, <code>pivot_root</code>, mount a new <code>/proc</code> and a tiny <code>/dev</code>, unmount the old root (${a('os-12-4-mini', '12.4')}).</li>
<li>Child: drop dangerous capabilities from the bounding set and its own sets, set <code>no_new_privs</code>, then <code>execvp</code> (${a('os-13-4-container-escape', '13.4')}).</li>
<li>Parent: <code>waitpid</code>; read <code>memory.events</code> and <code>pids.events</code> and report OOM kills and refused forks; <code>rmdir</code> the cgroup; exit with the child’s status (128 + signal if killed).</li>
</ol>
<p><strong>4. Requirements and marks</strong> — what <code>test-ctr.sh</code> checks:</p>
${rubric([
  ['C1', 'PID namespace: the command sees itself as PID 1', '1.5', '<code>echo $$</code>'],
  ['C2', 'UTS namespace: own hostname, the host’s unchanged', '1', '<code>hostname</code> inside and out'],
  ['C3', 'pivot_root: only the rootfs is visible; host mount table unchanged afterwards', '2', '<code>ls /</code>, <code>findmnt</code> count'],
  ['C4', 'Network namespace: no eth0, no routes, nothing up', '1', '<code>/proc/net/dev</code>, <code>/proc/net/route</code>'],
  ['C5', 'memory.max: a memory hog is killed, exit 137, <code>oom_kill</code> reported', '1.5', '100 MiB through <code>tail</code> under 32M'],
  ['C6', 'pids.max: a fork storm is refused and reported', '1', '20 × <code>sleep &amp;</code> under 10'],
  ['C7', 'Capabilities: <code>CAP_SYS_ADMIN</code> gone, <code>mount</code> refused inside', '1', '<code>CapBnd</code>, <code>mount</code>'],
  ['C8', 'Exit code passed through; every cgroup removed', '1', '<code>exit 7</code>, <code>ls /sys/fs/cgroup</code>'],
], ['Requirement', 'Marks', 'Checked with'])}
<p><strong>5. Milestones.</strong> Day 1: <code>clone</code> with PID + UTS namespaces, run a command, pass C1, C2, C8. Day 2: mount namespace + <code>pivot_root</code> + <code>/proc</code>, pass C3, C4. Day 3: cgroup before exec, capabilities, reports; pass C5–C7.</p>
<p><strong>6. Acceptance tests</strong> — in a throwaway privileged lab container:</p>
${cmd('docker run --rm --privileged --label oslab=1 --name os-ctr -v "$PWD":/lab -w /lab/ch17 os-lab ctr/test-ctr.sh /lab/ch17/mine')}
<p><strong>7. Common deductions.</strong> Joining the cgroup <em>after</em> exec (the program runs unlimited for a moment — and a fork bomb only needs a moment); <code>pivot_root</code> without first making <code>/</code> private (EINVAL, or worse, your mounts leak to the host); <code>CLONE_NEWCGROUP</code> at clone time (the namespace root is fixed before the child moves into its cgroup, so it sees the parent’s path); not reaping the cgroup (<code>rmdir</code> fails while a process is inside, and directories pile up).</p>
<p><strong>8. Submission.</strong> Code, test output, and a table: each row one isolation (PID, mount, network…), the line of your code that provides it, and the test that proves it.</p>

<h3>The reference solution, measured</h3>
${run('c175-ctr', 'wc -l ctr/minictr.c', 2)}
<p>About 120 lines of C replace the shell script of 12.4 line for line. The rootfs is a single static busybox binary plus 276 symbolic links, 1.9 MB on a tmpfs:</p>
${run('c175-ctr', 'ls /box/bin', 2)}
<p>Inside, the shell is PID 1 and <code>ps</code> sees only itself; the hostname is the one we chose; <code>/proc/self/cgroup</code> reads <code>0::/</code> because the cgroup namespace was created <em>after</em> joining the box’s cgroup; and <code>/</code> holds only what the rootfs brought plus the three mount points we created.</p>
${run('c175-ctr', "grep -E 'CapBnd'", 3)}
<p>The capability bounding set drops from <code>000001ffffffffff</code> (all 41) to <code>000001fdb414efff</code>: still root, but <code>mount</code> is refused. A 32 MiB box that pipes 100 MiB through <code>tail</code> is killed by the kernel, the runtime reads <code>oom_kill 2</code> from <code>memory.events</code>, and passes exit 137 on, exactly like Docker.</p>
<h3>The same box, seen from the host</h3>
${run('c175-ctr', 'minictr /box /bin/sleep 30', 4)}
<p>Outside, the box’s <code>sleep</code> is an ordinary process, host PID 768, whose <code>NSpid</code> line shows its second identity: PID 1 inside. It lives in <code>/minictr-766</code> with the limits we wrote, and its six namespaces have different inode numbers from the host’s. When it dies the runtime removes the cgroup: zero left. A container is a process with a different view and a budget — now written by you.</p>
${lab('nslayers', 'unshare', 'en', 'Turn namespaces on one by one and watch what the process inside can still see — the same flags your clone() call sets.', { tour: 'nslayers-views' })}
${lab('cgroup', 'oom', 'en', 'What happens inside memory.max when the box’s tail outgrows 32 MiB: memory.current reaches the limit, reclaim fails, oom_kill increments, exit 137.')}

<div class="pitfall co-tieu-de">
<p><strong>"exec /bin/sh: No such file or directory" — but the file is right there.</strong> It happened while building this lesson. <code>busybox --install -s DIR</code> creates <em>absolute</em> symbolic links to wherever busybox was when you ran it; after <code>pivot_root</code> that path no longer exists, so every link dangles. The fix is relative links (<code>ln -s busybox bin/sh</code>). And when you generate them in a loop, skip <code>busybox</code> itself: linking <code>busybox → busybox</code> replaces the binary with a link to itself and every command fails with "Too many levels of symbolic links". Inside a new root, a path is resolved against <em>that</em> root.</p>
</div>

${details('<strong>Reference solution: minictr.c (open after your own version passes)</strong>', src('ch17/ctr/minictr.c', 'c'))}

<h3>💼 What to put on your CV</h3>
<ul>
<li><strong>Line:</strong> "Implemented a minimal container runtime in C (~120 lines): PID/mount/UTS/IPC/network/cgroup namespaces, pivot_root into a busybox rootfs, cgroup v2 memory/PID/CPU limits applied before exec, capability bounding-set reduction and no_new_privs; 10-case acceptance suite."</li>
<li><strong>Be ready for:</strong> "what is a container?", "why is <code>--privileged</code> dangerous?", "how does Docker limit memory?" — you can now answer with your own code (16.7).</li>
</ul>

<h3>🧪 Practice (after C1–C8 pass)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a classmate says "containers are lightweight virtual machines". You want to show, with your runtime, what a container really is — and what it does <em>not</em> isolate.</p>
<ol>
<li>Run <code>minictr /box /bin/sleep 60 &amp;</code> and, from the lab container, find the process with <code>pgrep</code>; print its <code>NSpid</code>, cgroup and namespace links.</li>
<li>Inside a box, run <code>uname -r</code> and compare with the lab container: same kernel.</li>
<li>Remove <code>CLONE_NEWNET</code> from your clone flags, rebuild, and run <code>cat /proc/net/dev</code> inside: what can the box see now?</li>
<li>Write three lines for your classmate: what a container shares with the host, what it gets its own copy of, and which line of code decides each.</li>
</ol>
<p><strong>Done when:</strong> your three lines name the shared kernel (same <code>uname -r</code>), at least three namespaces with their clone flags, and the cgroup files that set the budget.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['container runtime', 'The low-level program that creates the namespaces, cgroup and root file system and execs the container’s process (runc, crun — here minictr).'],
  ['clone() flags', 'CLONE_NEWPID, NEWNS, NEWUTS, NEWIPC, NEWNET… — each gives the child its own copy of one kind of kernel view.'],
  ['pivot_root', 'Swaps the root mount of the mount namespace for another directory; the old root can then be unmounted.'],
  ['cgroup namespace', 'Makes the process’s own cgroup appear as <code>/</code>; created after joining the cgroup so the box cannot see the host’s tree.'],
  ['capability bounding set', 'The upper limit of capabilities a process and its children can ever have; dropping CAP_SYS_ADMIN removes mount and most escapes.'],
  ['no_new_privs', 'A process flag: execve can never grant more privileges (setuid binaries stop working as escalators).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container runtime is ~120 lines of system calls: cgroup files, clone with namespace flags, pivot_root, new /proc, dropped capabilities, exec.</li>
<li>Order matters: limits before exec; cgroup namespace after joining the cgroup; / private before pivot_root.</li>
<li>Measured: PID 1 inside = host PID 768 outside; six namespaces with new inode numbers; 32 MiB limit ⇒ oom_kill and exit 137; mount refused without CAP_SYS_ADMIN.</li>
<li>The box shares the kernel with the host — a container is a fenced process, not a virtual machine.</li>
<li>Run all of this only in a throwaway privileged lab container.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/clone.2.html', '📄', 'clone(2) — Linux manual page', 'The namespace flags, the child stack, and CLONE_NEWCGROUP.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/pivot_root.2.html', '📄', 'pivot_root(2) — Linux manual page', 'Changing the root mount, its requirements, and the "." "." trick runc uses.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Dự án mở rộng</span>
<h2>Mở rộng: mini container runtime bằng C</h2>
<p class="lead">Ở ${a('os-12-4-mini', 'bài 12.4')} bạn đã dựng một container bằng khoảng bốn mươi dòng shell: <code>unshare</code>, <code>mount</code>, <code>pivot_root</code>, một thư mục cgroup. Mỗi lệnh đó chỉ là lớp vỏ mỏng quanh một hai system call. Câu hỏi của dự án mở rộng: <strong>bạn có tự viết được runtime — chương trình mà Docker gọi là <code>runc</code> — bằng C, để mọi lớp cách ly của một container đều là một dòng mã của chính bạn mà bạn chỉ tay vào được không?</strong></p>

<div class="callout warn">
<p><strong>An toàn.</strong> Một runtime cần root, mount và cgroup. Dựng và kiểm nó <strong>chỉ</strong> trong một container lab vứt đi bật bằng <code>--privileged --label oslab=1</code>, đúng như Chương 12 — không bao giờ trên máy thật của laptop hay trên máy chủ. Bộ kiểm gắn hệ thống file gốc lên một tmpfs, nên không gì đụng tới đĩa thật.</p>
</div>

<h3>Tờ đề — Dự án mở rộng: <code>minictr</code></h3>
<p><strong>1. Tổng quan.</strong> <code>minictr [--mem 64M] [--pids 32] [--cpu "50000 100000"] [--hostname box] ROOTFS CMD [ARGS…]</code> chạy CMD làm PID 1 của một container mới có gốc là ROOTFS, chờ nó, dọn dẹp, rồi thoát với mã thoát của CMD.</p>
<p><strong>2. Cấu trúc bắt buộc.</strong></p>
${cmd('ctr/', '├── minictr.c     # gcc -Wall -Wextra -Werror -O2 -o minictr minictr.c', '└── test-ctr.sh   # cho sẵn: dựng rootfs busybox trên tmpfs và chạy 10 phép kiểm')}
<p><strong>3. Runtime phải làm, theo đúng thứ tự</strong> — mỗi bước là một system call bạn đã gặp ở Chương 12:</p>
<ol>
<li>Tạo cgroup <code>/sys/fs/cgroup/minictr-PID</code> và ghi <code>memory.max</code>, <code>memory.swap.max = 0</code>, <code>pids.max</code>, <code>cpu.max</code> (${a('os-12-2-cgroups', '12.2')}).</li>
<li><code>clone()</code> một con với <code>CLONE_NEWPID | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC | CLONE_NEWNET</code> (${a('os-12-1-namespaces', '12.1')}).</li>
<li>Cha ghi PID của con vào <code>cgroup.procs</code>, <em>rồi mới</em> bảo con chạy tiếp (một ống) — giới hạn có hiệu lực trước khi mã người dùng nào chạy.</li>
<li>Con: <code>unshare(CLONE_NEWCGROUP)</code> (giờ cgroup của nó trông như <code>/</code>), <code>sethostname</code>, đặt <code>/</code> thành private, bind-mount ROOTFS lên chính nó, <code>pivot_root</code>, gắn <code>/proc</code> mới và một <code>/dev</code> tí hon, gỡ gốc cũ (${a('os-12-4-mini', '12.4')}).</li>
<li>Con: bỏ các capability nguy hiểm khỏi tập giới hạn (bounding set) và các tập của chính nó, bật <code>no_new_privs</code>, rồi <code>execvp</code> (${a('os-13-4-container-escape', '13.4')}).</li>
<li>Cha: <code>waitpid</code>; đọc <code>memory.events</code> và <code>pids.events</code> để báo số lần OOM giết và số lần fork bị từ chối; <code>rmdir</code> cgroup; thoát với mã của con (128 + tín hiệu nếu bị giết).</li>
</ol>
<p><strong>4. Yêu cầu và điểm</strong> — những gì <code>test-ctr.sh</code> kiểm:</p>
${rubric([
  ['C1', 'PID namespace: lệnh thấy mình là PID 1', '1.5', '<code>echo $$</code>'],
  ['C2', 'UTS namespace: hostname riêng, của máy chủ không đổi', '1', '<code>hostname</code> trong và ngoài'],
  ['C3', 'pivot_root: chỉ thấy rootfs; bảng mount của máy chủ không đổi sau đó', '2', '<code>ls /</code>, đếm <code>findmnt</code>'],
  ['C4', 'Network namespace: không eth0, không route, không gì UP', '1', '<code>/proc/net/dev</code>, <code>/proc/net/route</code>'],
  ['C5', 'memory.max: kẻ ngốn bộ nhớ bị giết, exit 137, báo <code>oom_kill</code>', '1.5', '100 MiB qua <code>tail</code> dưới 32M'],
  ['C6', 'pids.max: cơn bão fork bị từ chối và được báo', '1', '20 × <code>sleep &amp;</code> dưới 10'],
  ['C7', 'Capability: mất <code>CAP_SYS_ADMIN</code>, <code>mount</code> bị từ chối bên trong', '1', '<code>CapBnd</code>, <code>mount</code>'],
  ['C8', 'Chuyển nguyên mã thoát; mọi cgroup được xoá', '1', '<code>exit 7</code>, <code>ls /sys/fs/cgroup</code>'],
], ['Yêu cầu', 'Điểm', 'Kiểm bằng'])}
<p><strong>5. Các mốc.</strong> Ngày 1: <code>clone</code> với PID + UTS namespace, chạy một lệnh, qua C1, C2, C8. Ngày 2: mount namespace + <code>pivot_root</code> + <code>/proc</code>, qua C3, C4. Ngày 3: cgroup trước exec, capability, các thông báo; qua C5–C7.</p>
<p><strong>6. Kiểm nghiệm thu</strong> — trong một container lab đặc quyền vứt đi:</p>
${cmd('docker run --rm --privileged --label oslab=1 --name os-ctr -v "$PWD":/lab -w /lab/ch17 os-lab ctr/test-ctr.sh /lab/ch17/mine')}
<p><strong>7. Lỗi hay bị trừ điểm.</strong> Vào cgroup <em>sau</em> exec (chương trình chạy không giới hạn trong một khoảnh khắc — và fork bomb chỉ cần một khoảnh khắc); <code>pivot_root</code> mà chưa đặt <code>/</code> thành private (EINVAL, hoặc tệ hơn, mount của bạn rò ra máy chủ); đặt <code>CLONE_NEWCGROUP</code> ngay lúc clone (gốc của namespace bị chốt trước khi con chuyển vào cgroup, nên nó thấy đường dẫn của cha); không dọn cgroup (<code>rmdir</code> hỏng khi còn tiến trình bên trong, và thư mục chất đống).</p>
<p><strong>8. Nộp bài.</strong> Mã, output bộ kiểm, và một bảng: mỗi hàng một lớp cách ly (PID, mount, mạng…), dòng mã của bạn tạo ra nó, và phép kiểm chứng minh nó.</p>

<h3>Lời giải mẫu, đo thật</h3>
${run('c175-ctr', 'wc -l ctr/minictr.c', 2)}
<p>Khoảng 120 dòng C thay từng dòng một cho kịch bản shell của 12.4. Rootfs là một file busybox tĩnh duy nhất cộng 276 liên kết mềm, 1,9 MB trên một tmpfs:</p>
${run('c175-ctr', 'ls /box/bin', 2)}
<p>Bên trong, shell là PID 1 và <code>ps</code> chỉ thấy chính nó; hostname đúng cái ta chọn; <code>/proc/self/cgroup</code> đọc ra <code>0::/</code> vì cgroup namespace được tạo <em>sau</em> khi vào cgroup của hộp; và <code>/</code> chỉ chứa những gì rootfs mang theo cộng ba điểm gắn ta tạo.</p>
${run('c175-ctr', "grep -E 'CapBnd'", 3)}
<p>Tập capability giới hạn tụt từ <code>000001ffffffffff</code> (đủ 41) xuống <code>000001fdb414efff</code>: vẫn là root, nhưng <code>mount</code> bị từ chối. Một hộp 32 MiB đẩy 100 MiB qua <code>tail</code> bị nhân giết, runtime đọc <code>oom_kill 2</code> từ <code>memory.events</code> và chuyển tiếp exit 137, y như Docker.</p>
<h3>Cùng chiếc hộp đó, nhìn từ máy chủ</h3>
${run('c175-ctr', 'minictr /box /bin/sleep 30', 4)}
<p>Bên ngoài, <code>sleep</code> của hộp là một tiến trình bình thường, PID 768 của máy chủ, mà dòng <code>NSpid</code> cho thấy danh tính thứ hai: PID 1 bên trong. Nó sống trong <code>/minictr-766</code> với những giới hạn ta đã ghi, và sáu namespace của nó có số inode khác với của máy chủ. Khi nó chết, runtime xoá cgroup: còn lại 0. Container là một tiến trình với góc nhìn khác và một ngân sách — giờ do chính bạn viết.</p>
${lab('nslayers', 'unshare', 'vi', 'Bật từng namespace một và xem tiến trình bên trong còn thấy được gì — đúng các cờ mà lời gọi clone() của bạn đặt.', { tour: 'nslayers-views' })}
${lab('cgroup', 'oom', 'vi', 'Chuyện gì xảy ra bên trong memory.max khi tail của hộp vượt 32 MiB: memory.current chạm trần, thu hồi không được, oom_kill tăng, exit 137.')}

<div class="pitfall co-tieu-de">
<p><strong>"exec /bin/sh: No such file or directory" — mà file nằm ngay đó.</strong> Chuyện này đã xảy ra khi dựng bài này. <code>busybox --install -s DIR</code> tạo liên kết mềm <em>tuyệt đối</em> trỏ tới chỗ busybox nằm lúc bạn chạy lệnh; sau <code>pivot_root</code> đường dẫn đó không còn, nên mọi liên kết đều lơ lửng. Cách sửa là liên kết tương đối (<code>ln -s busybox bin/sh</code>). Và khi tạo chúng bằng vòng lặp, hãy bỏ qua chính <code>busybox</code>: liên kết <code>busybox → busybox</code> thay file chạy bằng một liên kết tới chính nó và mọi lệnh hỏng với "Too many levels of symbolic links". Bên trong một gốc mới, đường dẫn được tra theo <em>gốc đó</em>.</p>
</div>

${details('<strong>Lời giải mẫu: minictr.c (mở khi bản của bạn đã qua)</strong>', src('ch17/ctr/minictr.c', 'c'))}

<h3>💼 Ghi gì vào CV</h3>
<ul>
<li><strong>Một dòng:</strong> "Tự viết một container runtime tối giản bằng C (~120 dòng): namespace PID/mount/UTS/IPC/mạng/cgroup, pivot_root vào rootfs busybox, giới hạn bộ nhớ/PID/CPU của cgroup v2 áp trước exec, thu hẹp tập capability và no_new_privs; bộ nghiệm thu 10 ca."</li>
<li><strong>Sẵn sàng cho:</strong> "container là gì?", "vì sao <code>--privileged</code> nguy hiểm?", "Docker giới hạn bộ nhớ thế nào?" — giờ bạn trả lời được bằng chính mã của mình (16.7).</li>
</ul>

<h3>🧪 Thực hành (sau khi C1–C8 qua)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn cùng lớp nói "container là máy ảo nhẹ". Bạn muốn cho thấy, bằng runtime của mình, container thật ra là gì — và nó <em>không</em> cách ly những gì.</p>
<ol>
<li>Chạy <code>minictr /box /bin/sleep 60 &amp;</code> và, từ container lab, tìm tiến trình bằng <code>pgrep</code>; in <code>NSpid</code>, cgroup và các liên kết namespace của nó.</li>
<li>Trong một hộp, chạy <code>uname -r</code> và so với container lab: cùng một nhân.</li>
<li>Bỏ <code>CLONE_NEWNET</code> khỏi các cờ clone, dịch lại, và chạy <code>cat /proc/net/dev</code> bên trong: giờ hộp thấy được gì?</li>
<li>Viết ba dòng cho bạn mình: container dùng chung gì với máy chủ, có bản riêng của những gì, và dòng mã nào quyết định từng thứ.</li>
</ol>
<p><strong>Đạt khi:</strong> ba dòng của bạn nêu được nhân dùng chung (cùng <code>uname -r</code>), ít nhất ba namespace kèm cờ clone của chúng, và các file cgroup đặt ngân sách.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['container runtime', 'Chương trình tầng thấp tạo namespace, cgroup và hệ thống file gốc rồi exec tiến trình của container (runc, crun — ở đây là minictr).'],
  ['clone() flags (cờ của clone)', 'CLONE_NEWPID, NEWNS, NEWUTS, NEWIPC, NEWNET… — mỗi cờ cho con một bản riêng của một loại góc nhìn của nhân.'],
  ['pivot_root', 'Đổi điểm gắn gốc của mount namespace sang một thư mục khác; sau đó có thể gỡ gốc cũ.'],
  ['cgroup namespace', 'Làm cgroup của chính tiến trình hiện ra là <code>/</code>; tạo sau khi vào cgroup để hộp không thấy cây của máy chủ.'],
  ['capability bounding set (tập capability giới hạn)', 'Trần capability mà một tiến trình và con của nó có thể có; bỏ CAP_SYS_ADMIN là mất mount và phần lớn lối thoát.'],
  ['no_new_privs', 'Một cờ của tiến trình: execve không bao giờ cấp thêm đặc quyền (file setuid hết leo thang được).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một container runtime là ~120 dòng system call: file cgroup, clone với cờ namespace, pivot_root, /proc mới, bỏ capability, exec.</li>
<li>Thứ tự quan trọng: giới hạn trước exec; cgroup namespace sau khi vào cgroup; / private trước pivot_root.</li>
<li>Đo được: PID 1 bên trong = PID 768 bên ngoài; sáu namespace với số inode mới; giới hạn 32 MiB ⇒ oom_kill và exit 137; mount bị từ chối khi không có CAP_SYS_ADMIN.</li>
<li>Hộp dùng chung nhân với máy chủ — container là một tiến trình được rào lại, không phải máy ảo.</li>
<li>Chỉ chạy tất cả những thứ này trong một container lab đặc quyền vứt đi.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/clone.2.html', '📄', 'clone(2) — Linux manual page', 'Các cờ namespace, stack của con, và CLONE_NEWCGROUP.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/pivot_root.2.html', '📄', 'pivot_root(2) — Linux manual page', 'Đổi điểm gắn gốc, các điều kiện của nó, và mẹo "." "." mà runc dùng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 17.6 — Quiz ───────────────────────── */
    {
      title: '17.6 — Chapter 17 check: the capstone projects|||17.6 — Kiểm tra Chương 17: các dự án cuối khoá',
      slug: 'os-17-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống từ bốn dự án cuối khoá: ống dẫn treo vì một đầu ghi, mã 130 và nhóm tiến trình, định luật Little và hàng đợi có giới hạn, luồng cho việc CPU, SIGTERM không được xử lý, df 100 % mà du 400 K, OOMKilled=false sau bốn lần OOM, deadlock khi CPU rảnh, sửa fsync mà vẫn bền, và thứ tự cgroup trong một container runtime.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Check</span>
<h2>Chapter 17 check: the capstone projects</h2>
<p class="lead">Ten situations taken from the four projects. Every number in them was measured in this chapter; every correct answer is something the acceptance tests or the incident lab actually showed.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain a pipeline as fork, pipe, dup2 and close — and why one forgotten close hangs it.</li>
<li>I can explain job control: process groups, SIGINT to a job, exit status 128 + N.</li>
<li>I can predict a pool’s throughput and latency with Little’s law and explain why a bounded queue keeps latency bounded.</li>
<li>I can find an OOM kill, an fd leak, a deleted-but-open file, a deadlock and an fsync storm from OS evidence.</li>
<li>I can name the order of steps a container runtime must follow, and why.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Kiểm tra</span>
<h2>Kiểm tra Chương 17: các dự án cuối khoá</h2>
<p class="lead">Mười tình huống lấy từ bốn dự án. Mọi con số trong đó đều đo trong chương này; mọi đáp án đúng đều là điều bộ kiểm nghiệm thu hoặc phòng lab sự cố đã thật sự cho thấy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được một ống dẫn bằng fork, pipe, dup2 và close — và vì sao quên một close là nó treo.</li>
<li>Tôi giải thích được quản lý job: nhóm tiến trình, SIGINT tới một job, mã thoát 128 + N.</li>
<li>Tôi dự đoán được thông lượng và độ trễ của một pool bằng định luật Little và giải thích vì sao hàng đợi có giới hạn giữ độ trễ có trần.</li>
<li>Tôi tìm được một lần OOM giết, một chỗ rò fd, một file đã xoá mà vẫn mở, một deadlock và một cơn bão fsync từ bằng chứng của hệ điều hành.</li>
<li>Tôi kể được thứ tự các bước một container runtime phải theo, và vì sao.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'In your mini shell, <code>yes | head -3</code> prints three lines and returns, but <code>seq 3 | wc -l</code> never returns. What is the most likely bug?|||Trong mini shell của bạn, <code>yes | head -3</code> in ba dòng rồi trả về, nhưng <code>seq 3 | wc -l</code> không bao giờ trả về. Lỗi nhiều khả năng nhất là gì?',
            options: ['wc is waiting for input from the terminal because stdin was not redirected|||wc đang chờ đầu vào từ terminal vì stdin chưa được chuyển hướng', 'The shell (parent) still holds the pipe’s write end, so wc never sees end-of-file|||Shell (cha) vẫn giữ đầu ghi của ống, nên wc không bao giờ thấy hết file', 'seq writes too fast and fills the 64 KiB pipe buffer|||seq ghi quá nhanh làm đầy bộ đệm ống 64 KiB', 'The shell forgot to call setpgid for wc|||Shell quên gọi setpgid cho wc'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured in 17.1: removing the parent’s close(pfd[1]) failed exactly the five-stage pipe case (timeout) and the fd-leak case, while yes | head -3 still passed — head exits and yes dies of SIGPIPE because the read end was closed. EOF on a pipe needs every write end closed, including the shell’s copy. A is wrong: wc’s stdin is the pipe (dup3(3, 0, 0) in the trace). C: 3 lines do not fill a pipe. D: a missing setpgid breaks Ctrl-C, not EOF.|||VI: Đo ở 17.1: bỏ close(pfd[1]) của cha làm trượt đúng ca ống dẫn 5 tầng (quá hạn) và ca rò fd, trong khi yes | head -3 vẫn qua — head thoát và yes chết vì SIGPIPE do đầu đọc đã đóng. Hết file trên ống cần mọi đầu ghi đã đóng, kể cả bản sao của shell. A sai: stdin của wc là ống (dup3(3, 0, 0) trong bản theo dõi). C: 3 dòng không làm đầy ống. D: thiếu setpgid làm hỏng Ctrl-C, không làm hỏng EOF.' },
          { question: 'The M5 test sends SIGINT first to the shell, then to the job’s process group. The expected output contains <code>status=130</code> and <code>alive</code>. What do these two prove?|||Ca M5 gửi SIGINT trước vào shell, rồi vào nhóm tiến trình của job. Output mong đợi có <code>status=130</code> và <code>alive</code>. Hai dòng này chứng minh điều gì?',
            options: ['The job exited normally with code 130 and the shell restarted it|||Job thoát bình thường với mã 130 và shell đã khởi động lại nó', 'The shell caught SIGINT and forwarded it to the job|||Shell bắt SIGINT rồi chuyển tiếp nó cho job', 'SIGINT is 130 on Linux and the shell printed it|||SIGINT mang số 130 trên Linux và shell đã in nó ra', 'The job was killed by signal 2 (128 + 2 = 130) while the shell, which ignores SIGINT and runs jobs in their own group, kept running|||Job bị tín hiệu 2 giết (128 + 2 = 130) trong khi shell, vốn bỏ qua SIGINT và chạy job trong nhóm riêng, vẫn chạy tiếp'],
            correctIndex: 3, points: 1,
            explanation: 'EN: 130 = 128 + SIGINT (2), the shell convention for "killed by signal". "alive" is printed by the shell after the job died, proving the first SIGINT (to the shell) was ignored. The shell does not forward the signal (B) — the test sends it to the job’s group directly, as the terminal would. SIGINT is signal 2, not 130 (C). Nothing restarts the job (A).|||VI: 130 = 128 + SIGINT (2), quy ước của shell cho "bị tín hiệu giết". "alive" do shell in ra sau khi job chết, chứng minh SIGINT đầu tiên (vào shell) đã bị bỏ qua. Shell không chuyển tiếp tín hiệu (B) — bộ kiểm gửi thẳng vào nhóm của job, đúng như terminal làm. SIGINT là tín hiệu 2, không phải 130 (C). Không gì khởi động lại job (A).' },
          { question: 'tpserver runs 4 threads; each request waits 10 ms. With 64 clients the load generator measured 347 req/s. Which p50 latency did Little’s law predict, and which was measured?|||tpserver chạy 4 luồng; mỗi request chờ 10 ms. Với 64 khách, máy tạo tải đo được 347 req/s. Định luật Little dự đoán p50 bao nhiêu, và đo được bao nhiêu?',
            options: ['W = L / λ = 64 / 347 ≈ 184 ms; measured p50 182 ms|||W = L / λ = 64 / 347 ≈ 184 ms; đo được p50 182 ms', '10 ms, because each request only waits 10 ms|||10 ms, vì mỗi request chỉ chờ 10 ms', '40 ms = 4 threads × 10 ms|||40 ms = 4 luồng × 10 ms', '640 ms = 64 clients × 10 ms|||640 ms = 64 khách × 10 ms'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Little’s law L = λ × W holds for any stable queue: 64 requests in the system at 347 per second spend 0.184 s each — the measured p50 was 182.2 ms. 10 ms (B) is the service time without queueing (measured with 4 clients: p50 11.3 ms). C and D multiply the wrong quantities: requests are served 4 at a time, not 1 or 64 at a time.|||VI: Định luật Little L = λ × W đúng với mọi hàng đợi ổn định: 64 request trong hệ ở mức 347 mỗi giây thì mỗi cái ở 0,184 s — p50 đo được là 182,2 ms. 10 ms (B) là thời gian phục vụ khi không xếp hàng (đo với 4 khách: p50 11,3 ms). C và D nhân sai đại lượng: request được phục vụ 4 cái một lúc, không phải 1 hay 64.' },
          { question: 'Same 64 clients, but <code>--queue 8</code> instead of 4096. Throughput stayed ~390/s. What else changed, as measured?|||Vẫn 64 khách, nhưng <code>--queue 8</code> thay vì 4096. Thông lượng vẫn ~390/s. Đo được điều gì khác đã thay đổi?',
            options: ['Nothing — the queue size only matters for memory|||Không có gì — cỡ hàng đợi chỉ ảnh hưởng bộ nhớ', 'Latency went up because clients had to retry|||Độ trễ tăng vì khách phải thử lại', 'Accepted requests had p99 ≈ 32 ms instead of ≈ 204 ms; the excess got an immediate 503|||Request được nhận có p99 ≈ 32 ms thay vì ≈ 204 ms; phần dư nhận ngay 503', 'The server crashed when the queue filled|||Máy chủ sập khi hàng đợi đầy'],
            correctIndex: 2, points: 1,
            explanation: 'EN: With 4 running + 8 queued, an accepted request waits at most about (4 + 8) / 4 × 10 ms ≈ 30 ms: measured p50 31.1, p99 32.3 ms, plus 211,271 immediate 503s the client can retry. The unbounded queue had p99 204.4 ms. That is load shedding: same throughput, bounded latency. A ignores latency; B confuses the 503s (answered in microseconds) with the accepted requests; D — the server kept running.|||VI: Với 4 việc đang chạy + 8 đang chờ, một request được nhận chờ tối đa khoảng (4 + 8) / 4 × 10 ms ≈ 30 ms: đo được p50 31,1, p99 32,3 ms, cùng 211.271 câu 503 trả về ngay để khách thử lại. Hàng đợi không giới hạn có p99 204,4 ms. Đó là cắt tải: cùng thông lượng, độ trễ có trần. A bỏ qua độ trễ; B nhầm các câu 503 (trả lời trong vài micro giây) với các request được nhận; D — máy chủ vẫn chạy.' },
          { question: 'For <code>/cpu?n=2</code> in a 4-CPU container, 1, 4 and 16 threads gave 190, 727 and 634 req/s. A teammate wants 64 threads "to be safe". What do you answer?|||Với <code>/cpu?n=2</code> trong một container 4 CPU, 1, 4 và 16 luồng cho 190, 727 và 634 req/s. Một bạn muốn đặt 64 luồng "cho chắc". Bạn trả lời gì?',
            options: ['Yes: more threads always mean more throughput|||Đồng ý: càng nhiều luồng thông lượng càng cao', 'For CPU-bound work, threads beyond the core count only add context switches: 16 threads were slower than 4 and had 3× the p95|||Với việc nặng CPU, luồng vượt số lõi chỉ thêm chuyển ngữ cảnh: 16 luồng chậm hơn 4 và có p95 gấp 3', 'Use 1 thread: it had the lowest latency|||Dùng 1 luồng: nó có độ trễ thấp nhất', 'Threads do not matter, only the queue size does|||Số luồng không quan trọng, chỉ cỡ hàng đợi mới quan trọng'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Throughput peaked at nproc = 4 (727/s); 16 threads dropped to 634/s and p95 rose from 23.4 to 75.6 ms. For waiting work (/work) the opposite holds — 32 threads gave 2,865/s — so the answer depends on what the endpoint does. A contradicts the measurement; C: 1 thread had p50 83 ms, the worst; D: the thread count set both throughput and tail latency.|||VI: Thông lượng đạt đỉnh ở nproc = 4 (727/s); 16 luồng tụt xuống 634/s và p95 tăng từ 23,4 lên 75,6 ms. Với việc chờ (/work) thì ngược lại — 32 luồng cho 2.865/s — nên câu trả lời tuỳ endpoint làm gì. A trái với số đo; C: 1 luồng có p50 83 ms, tệ nhất; D: số luồng quyết định cả thông lượng lẫn độ trễ đuôi.' },
          { question: 'A planted bug removed the signal mask from tpserver. In the S5 test the in-flight request got <code>000</code> and the server exited with 143 after 236 ms. What happened?|||Một lỗi cài sẵn bỏ mặt nạ tín hiệu khỏi tpserver. Trong ca S5, request đang chạy nhận <code>000</code> và máy chủ thoát với 143 sau 236 ms. Chuyện gì đã xảy ra?',
            options: ['SIGTERM took its default action and killed the process at once (128 + 15 = 143); the running request never got an answer|||SIGTERM làm hành động mặc định và giết tiến trình ngay (128 + 15 = 143); request đang chạy không bao giờ nhận được câu trả lời', 'The server drained the queue and then crashed|||Máy chủ đã làm nốt hàng đợi rồi mới sập', '143 means the OOM killer stopped it|||143 nghĩa là OOM killer đã dừng nó', 'curl timed out because the request took 1.5 s|||curl quá hạn vì request mất 1,5 s'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Without SIGTERM blocked and read from signalfd, the default action of SIGTERM is to terminate: exit status 143 = 128 + 15, 236 ms after the signal, long before the 1.5 s request could finish; curl reports 000 (no HTTP response). Draining (B) is exactly what the reference does in 1.4 s with exit 0. OOM kills are SIGKILL = 137 (C). curl’s limit was 10 s (D).|||VI: Không chặn SIGTERM và đọc nó từ signalfd thì hành động mặc định của SIGTERM là kết thúc: mã thoát 143 = 128 + 15, 236 ms sau tín hiệu, rất lâu trước khi request 1,5 s kịp xong; curl báo 000 (không có câu trả lời HTTP). Làm nốt (B) chính là điều bản mẫu làm trong 1,4 s với exit 0. OOM giết bằng SIGKILL = 137 (C). Giới hạn của curl là 10 s (D).' },
          { question: 'In the os17 lab, <code>df</code> shows the worker’s log disk at 100 % while <code>du -sh /var/log/app</code> says 400K. Which command shows where the space is?|||Trong phòng lab os17, <code>df</code> cho ổ log của worker ở 100 % trong khi <code>du -sh /var/log/app</code> báo 400K. Lệnh nào chỉ ra chỗ đang chiếm?',
            options: ['du -sh --apparent-size /var/log/app|||du -sh --apparent-size /var/log/app', 'df -i /var/log/app|||df -i /var/log/app', 'docker system df|||docker system df', 'ls -l /proc/[0-9]*/fd | grep deleted (or lsof +L1) — a deleted log still held open by the process|||ls -l /proc/[0-9]*/fd | grep deleted (hoặc lsof +L1) — một log đã xoá vẫn bị tiến trình giữ mở'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured: fd 3 → /var/log/app/worker.log.1 (deleted), 66,699,264 bytes of DEBUG lines. du walks names, and that file has no name any more; df counts allocated blocks. A still walks names; B counts inodes (the problem is blocks); C reports images and volumes, not a tmpfs inside a container.|||VI: Đo được: fd 3 → /var/log/app/worker.log.1 (deleted), 66.699.264 byte dòng DEBUG. du đi theo tên, mà file đó không còn tên; df đếm khối đã cấp phát. A vẫn đi theo tên; B đếm inode (vấn đề là khối); C báo ảnh và volume, không phải một tmpfs bên trong container.' },
          { question: 'os-17-shop restarted four times, yet <code>docker inspect</code> shows <code>OOMKilled=false</code>. Where is the evidence that the kernel killed it?|||os-17-shop đã khởi động lại bốn lần, vậy mà <code>docker inspect</code> báo <code>OOMKilled=false</code>. Bằng chứng nhân đã giết nó nằm ở đâu?',
            options: ['Nowhere: OOMKilled=false proves it was not an OOM kill|||Không có: OOMKilled=false chứng minh đó không phải OOM', 'In the application’s own log, which prints "out of memory"|||Trong log của chính ứng dụng, nơi in "out of memory"', 'In docker events (oom, then die exitCode=137) — inspect describes only the current process, started after the last kill|||Trong docker events (oom, rồi die exitCode=137) — inspect chỉ mô tả tiến trình hiện tại, bật sau lần bị giết cuối cùng', 'In docker stats, which shows 192 MiB used|||Trong docker stats, nơi cho thấy đã dùng 192 MiB'],
            correctIndex: 2, points: 1,
            explanation: 'EN: docker events kept every oom + die exitCode=137 pair, while inspect showed the new process, started 10 s earlier. A is the trap the pitfall of 17.3 warns about. A SIGKILLed process cannot log anything (B). docker stats showed 126.5 MiB of 192 at that instant — the process had just restarted (D).|||VI: docker events giữ từng cặp oom + die exitCode=137, trong khi inspect cho thấy tiến trình mới, bật 10 s trước đó. A chính là cái bẫy mà mục cảnh báo của 17.3 nhắc. Một tiến trình bị SIGKILL không ghi log được gì (B). docker stats lúc đó cho 126,5/192 MiB — tiến trình vừa khởi động lại (D).' },
          { question: 'The billing service: requests time out, CPU 0.06 %, 39 threads. Which first step fits these symptoms best?|||Dịch vụ billing: request quá hạn, CPU 0,06 %, 39 luồng. Bước đầu tiên nào hợp với triệu chứng nhất?',
            options: ['A thread dump (jstack): idle CPU with stuck requests means threads are waiting, and the JVM reports lock cycles itself|||Kết xuất luồng (jstack): CPU rảnh mà request kẹt nghĩa là luồng đang chờ, và JVM tự báo vòng chờ khoá', 'A CPU profile with perf to find the hot function|||Lấy hồ sơ CPU bằng perf để tìm hàm nóng', 'Raise the pool from 16 to 200 threads|||Nâng pool từ 16 lên 200 luồng', 'Restart the container and watch whether it happens again|||Khởi động lại container và xem nó có lặp lại không'],
            correctIndex: 0, points: 1,
            explanation: 'EN: jstack printed "Found one Java-level deadlock": pool-1-thread-1 and pool-1-thread-2 each waiting for the wallet the other holds, at Billing.transfer line 14. A CPU profile (B) shows nothing when nothing runs. More threads (C) just join the deadlock later. A restart (D) clears it and destroys the evidence.|||VI: jstack in "Found one Java-level deadlock": pool-1-thread-1 và pool-1-thread-2 mỗi bên chờ ví mà bên kia giữ, tại Billing.transfer dòng 14. Hồ sơ CPU (B) không thấy gì khi không có gì chạy. Thêm luồng (C) chỉ là nhập deadlock muộn hơn. Khởi động lại (D) gỡ nó và xoá sạch bằng chứng.' },
          { question: 'The audit service must keep "on disk before 200". Which fix removes the 25–30 ms per event and the corrupted lines without breaking that promise?|||Dịch vụ audit phải giữ luật "nằm trên đĩa trước khi trả 200". Cách sửa nào bỏ được 25–30 ms mỗi sự kiện và các dòng hỏng mà không phá lời hứa đó?',
            options: ['Remove fsync entirely; the page cache is fast enough|||Bỏ hẳn fsync; page cache đủ nhanh', 'One write() of the whole line with O_APPEND, then a shared fdatasync for every event written so far (group commit)|||Một lần write() cả dòng với O_APPEND, rồi một fdatasync dùng chung cho mọi sự kiện đã ghi tới lúc đó (group commit)', 'Keep byte-by-byte writes but put a mutex around each byte|||Giữ ghi từng byte nhưng đặt một mutex quanh từng byte', 'Write to /tmp instead of the volume|||Ghi vào /tmp thay vì volume'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The reference fix still syncs before answering, but one write per line (atomic with O_APPEND) and one fdatasync per batch: median 0.7 ms, 0 malformed lines. A breaks durability (9.3: write() is not on disk). C keeps ~80 fsyncs per event and still lets lines interleave between bytes. D changes where data goes, not what it costs — and /tmp may not survive.|||VI: Cách sửa mẫu vẫn đồng bộ trước khi trả lời, nhưng mỗi dòng một lần write (nguyên tử với O_APPEND) và mỗi nhóm một fdatasync: trung vị 0,7 ms, 0 dòng hỏng. A phá độ bền (9.3: write() chưa phải đã lên đĩa). C vẫn ~80 fsync mỗi sự kiện và vẫn để các dòng xen giữa các byte. D đổi chỗ dữ liệu đi, không đổi cái giá — và /tmp có thể không còn sau khi khởi động lại.' },
        ],
      },
    },
  ],
};
