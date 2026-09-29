/**
 * Linux & Bash — Chương 5: Tiến trình, job & tín hiệu.
 * Tiến trình là gì · nhìn máy đang chạy · tín hiệu · job và chạy nền · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * Nâng cấp 28/09/2026: bài 5.0 slide (deck lx-05, 30 slide) + slide/🧪/🗂/📌 trong 5.1–5.4; đào sâu: strace
 * fork/dup3/exec, năm trạng thái + bảng cờ ps, xác sống dưới PID 1 không init, nice/renice, ulimit (Too many open
 * files, prlimit, LimitNOFILE), 128+N đo thật + job nền lờ SIGINT trong script, pgrep -f tự khớp, diệt theo cổng,
 * ai sống sót khi SIGHUP (pty thật), wait trần làm quên PID; "Chạy thử từng bước" + "macOS/WSL khác gì" mỗi bài;
 * quiz 10 câu. Output MỚI chạy thật trong container ubuntu:24.04 (arm64), trên Fedora 44 và Mac M1 (macOS 27).
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 5 — Processes, jobs & signals|||Chương 5 — Tiến trình, job & tín hiệu',
  description: 'ps, top, kill, chạy nền, nohup — Ctrl-C thật ra gửi cái gì và vì sao vài chương trình lờ nó đi. Chương này dạy bạn nhìn ra máy đang thật sự làm gì, và dừng đúng thứ cần dừng mà không phá hỏng dữ liệu đang ghi dở.',
  lessons: [
    /* ─────────────────────────── 5.0 ─────────────────────────── */
    {
      title: '5.0 — Chapter 5 slides: processes, signals and jobs in pictures|||5.0 — Slide Chương 5: tiến trình, tín hiệu và job bằng hình',
      slug: 'lnx-5-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Chương 5: cây tiến trình, fork/exec đo bằng strace, năm trạng thái R/S/D/T/Z, xác sống và PID 1, top/load/bộ nhớ/OOM/ulimit, bảng tín hiệu và 128+N, diệt theo cổng, job control, SIGHUP và tmux.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Slides</span>
<h2>The whole chapter in 30 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the process tree, fork and exec on a timeline recorded with <code>strace</code>, the life cycle of the five states, the load-average queue, the path a <code>Ctrl-C</code> takes, and who survives when a terminal hangs up.</p>
<p>Slides 3–8 belong to Lesson 5.1, 9–14 to 5.2 (including the new part on <code>nice</code> and <code>ulimit</code>), 15–20 to 5.3 (including killing by port) and 21–25 to 5.4. The last five are the chapter's common mistakes, a macOS/Fedora/WSL comparison, a two-page cheat sheet and a 40-minute practice session. Every terminal is real output recorded on 28/09/2026 in an Ubuntu 24.04 container, on a Fedora 44 machine and on a Mac M1; keystrokes like <code>Ctrl-Z</code> were typed into a real pseudo-terminal. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Slide</span>
<h2>Cả chương trong 30 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: cây tiến trình, fork và exec trên một trục thời gian ghi bằng <code>strace</code>, vòng đời năm trạng thái, hàng đợi của tải trung bình, đường đi của một cú <code>Ctrl-C</code>, và ai sống sót khi terminal "gác máy".</p>
<p>Slide 3–8 thuộc Bài 5.1, 9–14 thuộc 5.2 (gồm phần mới về <code>nice</code> và <code>ulimit</code>), 15–20 thuộc 5.3 (gồm cách diệt theo cổng) và 21–25 thuộc 5.4. Năm slide cuối là những sai lầm hay gặp, bảng so sánh macOS/Fedora/WSL, bảng tra nhanh hai trang và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04, trên máy Fedora 44 và trên Mac M1; các phím như <code>Ctrl-Z</code> được gõ vào một terminal giả (pty) thật — con số trên máy bạn sẽ khác, quy luật thì không.</p>
</div>
${gallery('lx-05', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Cả máy là một cây tiến trình'], [4, 'fork → dup3 → exec → wait'], [5, 'ps aux: đọc từng cột'],
  [6, 'Năm trạng thái R S D T Z'], [7, 'Xác sống và PID 1'], [8, '/proc/PID'],
  [9, 'top: năm dòng đầu'], [10, 'Load average là hàng đợi'], [11, 'Dòng %Cpu và nice'],
  [12, 'free: đọc available'], [13, 'OOM killer và mã 137'], [14, 'ulimit và Too many open files'],
  [15, 'Bảng tín hiệu'], [16, 'Ctrl-C và 128+N'], [17, 'Leo thang TERM → KILL, docker stop'],
  [18, 'trap và mặt nạ tín hiệu'], [19, 'pkill -f tự khớp chính nó'], [20, 'Diệt theo cổng: lsof -ti'],
  [21, 'Ctrl-Z, bg, fg'], [22, '& , $! và wait từng PID'], [23, 'SIGHUP: ai sống sót'],
  [24, 'nohup · disown · setsid · tmux · systemd'], [25, 'tmux'],
  [26, 'Sai lầm hay gặp'], [27, 'Ubuntu · Fedora · macOS · WSL'], [28, 'Bảng tra nhanh (1/2)'], [29, 'Bảng tra nhanh (2/2)'], [30, 'Thực hành chương 5'],
])}
`,
    },
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — What a process is, and how to look at one|||5.1 — Tiến trình là gì, và nhìn vào nó bằng cách nào',
      slug: 'lnx-5-1-tien-trinh-la-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'PID và PPID, fork/exec — mọi tiến trình sinh ra từ đâu, cây tiến trình, hai cú pháp của ps và cái nào nên dùng, trạng thái tiến trình, tiến trình mồ côi và tiến trình xác sống, và /proc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>What a process is</h2>
<p class="lead">A program is a file on disk. A <em>process</em> is that program running: a copy of the code, its own memory, a set of open file descriptors (Lesson 3.1), a user identity (Chapter 4), a working directory, and a number. Everything in this chapter — killing, backgrounding, signalling — is an operation on that number.</p>

<h3>Every process has a parent</h3>
${slide('lx-05', 3, 'Cả máy là một cây tiến trình, gốc là PID 1')}
<pre><code>echo \$\$          <span class="tok-comment"># PID of your shell</span>
echo \$PPID       <span class="tok-comment"># PID of whatever started your shell</span>
ps -o pid,ppid,user,comm -p \$\$</code></pre>
<div class="out">4821
4102
    PID    PPID USER     COMMAND
   4821    4102 deploy   bash</div>
<p>Your shell was started by something, which was started by something else, all the way up to PID 1. There is exactly one root, and the whole system is a single tree:</p>
<pre><code>pstree -p | head -20</code></pre>
<div class="out">systemd(1)─┬─containerd(742)─┬─{containerd}(743)
           ├─nginx(812)─┬─nginx(813)
           │            └─nginx(814)
           ├─postgres(901)─┬─postgres(912)
           │               └─postgres(913)
           ├─sshd(1043)───sshd(4102)───bash(4821)───pstree(5219)
           └─systemd-journald(388)</div>
<p>Read the last branch: <code>sshd</code> accepted your connection, forked a child <code>sshd</code> for your session, which started <code>bash</code>, which started <code>pstree</code>. That is your entire login, and it explains why closing an SSH connection kills what you launched from it — a topic Lesson 5.4 returns to.</p>

<h3>fork and exec: how a new process appears</h3>
${slide('lx-05', 4, 'fork → dup3 → exec → wait, đo bằng strace')}
<p>Linux has no "run this program" call. It has two, and they do different halves of the job:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · fork()</span><span class="lz-t">the shell clones ITSELF</span><span class="lz-d">An identical copy: same memory, same open file descriptors, same working directory. Only the PID differs. This is where redirections and pipes get set up — in the child, before the new program exists.</span></div>
  <div class="lz-step"><span class="lz-k">2 · exec()</span><span class="lz-t">the clone REPLACES itself with the new program</span><span class="lz-d">Same PID, same fds, entirely new code and memory. The old shell code is gone.</span></div>
  <div class="lz-step"><span class="lz-k">3 · wait()</span><span class="lz-t">the parent waits for the exit code</span><span class="lz-d">Which becomes <code>\$?</code>. Skip this step — that is what <code>&amp;</code> does — and the parent carries on immediately.</span></div>
</div>
<div class="callout ok">This two-step design is why Lesson 3.1's redirection rules work the way they do. The shell forks, and <em>then</em>, inside the child, opens files and rewires fds 0/1/2 — all before <code>exec</code> loads the program. The program starts life with the streams already pointing where you asked, which is why it never needs to know that a redirection happened. One mechanism, and it explains <code>&gt;</code>, <code>|</code>, <code>2&gt;&amp;1</code> and why <code>sort f &gt; f</code> empties the file.</div>

<h3>Watching fork and exec happen</h3>
<p>You do not have to take the three steps on trust. <code>strace</code> (Chapter 12) prints every system call a program makes; <code>-f</code> follows the children too. Here is bash running <code>ls &gt; ds.txt</code>, filtered to the five calls that matter:</p>
<pre><code>strace -f -e trace=clone,openat,dup3,execve,wait4 bash -c "ls &gt; ds.txt; echo xong"</code></pre>
<div class="out">clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD) = 2923
[pid  2922] wait4(-1,  &lt;unfinished ...&gt;
[pid  2923] openat(AT_FDCWD, "ds.txt", O_WRONLY|O_CREAT|O_TRUNC, 0666) = 3
[pid  2923] dup3(3, 1, 0)               = 1
[pid  2923] execve("/usr/bin/ls", ["ls"], …) = 0
[pid  2923] +++ exited with 0 +++
&lt;... wait4 resumed&gt;[{WIFEXITED(s) &amp;&amp; WEXITSTATUS(s) == 0}], 0, NULL) = 2923
xong</div>
<p>Read it line by line: the parent (2922) <code>clone</code>s — Linux's modern form of <code>fork</code> — and immediately sleeps in <code>wait4</code>. The child (2923) is still bash: it opens <code>ds.txt</code> as fd 3, copies fd 3 onto fd 1 (<code>dup3(3, 1)</code> — "stdout now points at the file"), and only then calls <code>execve</code> to become <code>ls</code>, with the same PID. When <code>ls</code> exits, the parent wakes up with status 0, which becomes <code>\$?</code>. (Recorded in an Ubuntu 24.04 arm64 container; on x86-64 you will see <code>dup2</code> instead of <code>dup3</code>, and the dynamic-linker lines were filtered out.)</p>
<h3>ps: two syntaxes, and which to use</h3>
${slide('lx-05', 5, 'ps aux: đọc từng cột')}
<p><code>ps</code> carries thirty years of history and accepts both BSD-style flags (no dash) and UNIX-style flags (with dash), which behave differently. In practice you need two invocations:</p>
<pre><code>ps aux                  <span class="tok-comment"># BSD: everything, with CPU/memory — the one to memorise</span>
ps -ef                  <span class="tok-comment"># UNIX: everything, with PPID and start time</span>
ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu | head
ps -o pid,stat,cmd -p 812
ps -u www-data          <span class="tok-comment"># only this user's processes</span>
ps -C nginx             <span class="tok-comment"># only this command</span></code></pre>
<div class="out">USER  PID %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND
root  812  0.0  0.1 141240  8452 ?    Ss   09:14   0:00 nginx: master process
www-  813  1.2  0.4 142108 34120 ?    S    09:14   0:31 nginx: worker process
depl 4821  0.0  0.0  10240  5104 pts/1 Ss  11:02   0:00 bash</div>
<div class="kv-grid">
  <div class="kv"><span class="k">VSZ</span><span class="v">Virtual size — everything the process has <em>mapped</em>, including shared libraries and memory it never touched. Almost always misleading; ignore it.</span></div>
  <div class="kv"><span class="k">RSS</span><span class="v">Resident Set Size — physical RAM actually in use. This is the number you want, though shared libraries are counted in every process that maps them, so summing RSS overcounts.</span></div>
  <div class="kv"><span class="k">TTY</span><span class="v">The terminal it is attached to. A <code>?</code> means none — it is a daemon, or was detached (Lesson 5.4).</span></div>
  <div class="kv"><span class="k">STAT</span><span class="v">State plus flags. <code>S</code> sleeping, <code>R</code> running, <code>D</code> uninterruptible (waiting on disk), <code>Z</code> zombie, <code>T</code> stopped. Suffixes: <code>s</code> session leader, <code>+</code> foreground, <code>&lt;</code> high priority, <code>N</code> low.</span></div>
  <div class="kv"><span class="k">TIME</span><span class="v">Cumulative CPU time consumed, <strong>not</strong> how long it has been running. Use <code>etime</code> for wall-clock age.</span></div>
</div>
<div class="callout warn">A process in state <code>D</code> — uninterruptible sleep — <strong>cannot be killed</strong>, not even with <code>kill -9</code>. It is blocked inside a system call waiting on hardware, usually a disk or a hung network filesystem, and the kernel will not interrupt it. Several <code>D</code> processes with a rising load average and no CPU use is the signature of failing storage or a dead NFS mount, not of a busy machine. Chapter 12 covers what to do; for now, recognising it saves you from typing <code>kill -9</code> twenty times.</div>

<h3>The five states, and what moves a process between them</h3>
${slide('lx-05', 6, 'Vòng đời trạng thái R · S · D · T · Z')}
<p>The <code>STAT</code> letter is not decoration; it tells you what the process is doing <em>right now</em> and which tools can still reach it. A process is born by <code>fork</code> into <code>R</code>, and from there it moves between states in response to events:</p>
<table>
<tr><th>State</th><th>Meaning</th><th>Gets there by</th><th>Leaves by</th></tr>
<tr><td><code>R</code> running</td><td>on a CPU, or queued waiting for one</td><td>being created, or its wait ending</td><td>blocking, being stopped, exiting</td></tr>
<tr><td><code>S</code> sleeping</td><td>waiting for an event: network data, a key, a timer</td><td>calling something that blocks</td><td>the event arriving — or any signal</td></tr>
<tr><td><code>D</code> disk sleep</td><td>blocked inside the kernel on I/O; signals wait</td><td>reading/writing a slow or hung device</td><td>only the I/O finishing</td></tr>
<tr><td><code>T</code> stopped</td><td>frozen, 0% CPU, memory kept</td><td><code>Ctrl-Z</code> (SIGTSTP) or <code>kill -STOP</code></td><td><code>kill -CONT</code>, <code>fg</code>, <code>bg</code></td></tr>
<tr><td><code>Z</code> zombie</td><td>already exited; only its exit status remains</td><td>calling <code>exit()</code></td><td>its parent calling <code>wait()</code></td></tr>
</table>
<p>Four of them are easy to create on purpose, which is the fastest way to recognise them later. In an Ubuntu container, one script started <code>sleep 1000</code> (sleeping), stopped a second <code>sleep</code>, ran a busy loop, and left a child that nobody waited for:</p>
<pre><code>ps -o pid,ppid,stat,cmd -u an</code></pre>
<div class="out">    PID    PPID STAT CMD
   2961    2955 S    sleep 1000
   2962    2955 T    sleep 1001
   2966    2955 S    python3 -m http.server 19050
   2967    2965 R    sh -c while :; do :; done
   2968    2964 Z    [sleep] &lt;defunct&gt;</div>
<p>Note that a zombie's command is shown in square brackets with <code>&lt;defunct&gt;</code>, and its memory columns are zero: there is no program left, only an entry in the process table. <code>D</code> is the one state you cannot easily stage — and the one that matters most on a sick server, because it is the only state that also inflates the load average without using CPU (Lesson 5.2).</p>
<h3>ps flags you will actually type</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>a</code> <code>u</code> <code>x</code> (BSD)</td><td>all users · user-oriented columns · include processes with no terminal</td><td><code>ps aux</code></td></tr>
<tr><td><code>-e</code> / <code>-A</code></td><td>every process (UNIX style)</td><td><code>ps -e</code></td></tr>
<tr><td><code>-f</code></td><td>full format: UID, PPID, start time, full command</td><td><code>ps -ef</code></td></tr>
<tr><td><code>-o</code></td><td>choose the columns yourself</td><td><code>ps -o pid,ppid,stat,etime,cmd</code></td></tr>
<tr><td><code>-p</code> · <code>--ppid</code></td><td>these PIDs · children of this PID</td><td><code>ps --ppid 1</code></td></tr>
<tr><td><code>-u</code> · <code>-C</code></td><td>owned by a user · by command name</td><td><code>ps -C nginx</code></td></tr>
<tr><td><code>--sort</code></td><td>sort by a column, <code>-</code> = descending (GNU)</td><td><code>ps aux --sort=-rss</code></td></tr>
<tr><td><code>--forest</code></td><td>draw the parent–child tree with ASCII art (GNU)</td><td><code>ps -ef --forest</code></td></tr>
<tr><td><code>-o col=</code></td><td>a trailing <code>=</code> removes the header — handy in scripts</td><td><code>ps -o ppid= -p 2968</code></td></tr>
</table>
<h3>Finding the process you care about</h3>
<pre><code>pgrep -a nginx                   <span class="tok-comment"># PIDs matching a name, -a shows the full command</span>
pgrep -u deploy -a node          <span class="tok-comment"># narrowed by user</span>
pidof nginx                      <span class="tok-comment"># just the PIDs, space-separated</span>
ps aux | grep '[n]ginx'          <span class="tok-comment"># the bracket trick — excludes the grep itself</span>
sudo ss -tulpn | grep :3000      <span class="tok-comment"># which process holds a PORT</span>
sudo lsof -i :3000               <span class="tok-comment"># same question, more detail</span>
sudo lsof -p 812                 <span class="tok-comment"># every file THIS process has open</span></code></pre>
<div class="out">812 nginx: master process /usr/sbin/nginx
813 nginx: worker process

tcp LISTEN 0 511 0.0.0.0:3000 users:(("node",pid=5012,fd=21))</div>
<p>The bracket in <code>grep '[n]ginx'</code> is a small classic: the pattern matches the text <code>nginx</code>, but the <code>grep</code> process's own command line contains <code>[n]ginx</code>, which does not match itself. <code>pgrep</code> avoids the problem entirely and is what you should reach for.</p>
<div class="callout ok"><code>sudo ss -tulpn | grep :3000</code> is the answer to "address already in use" — it names the exact process holding the port, so you can decide whether to stop it rather than rebooting. Chapter 9 covers <code>ss</code> properly; this one line is worth learning now.</div>

<h3>Orphans and zombies</h3>
${slide('lx-05', 7, 'Xác sống dưới một PID 1 không biết dọn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Orphan</span><span class="v">Its parent died first. The kernel immediately re-parents it to PID 1, which will reap it correctly. Harmless — and it is exactly how daemons are traditionally created.</span></div>
  <div class="kv"><span class="k">Zombie (<code>Z</code>, <code>&lt;defunct&gt;</code>)</span><span class="v">It has <em>exited</em>, but its parent has not called <code>wait()</code> to collect the exit code, so the kernel keeps a small entry in the process table. It uses no CPU and no memory — only a PID slot.</span></div>
</div>
<pre><code>ps aux | awk '\$8 ~ /Z/ {print \$2, \$11}'</code></pre>
<div class="out">7412 [python3] &lt;defunct&gt;</div>
<p><strong>You cannot kill a zombie</strong> — it is already dead. <code>kill -9</code> on it does nothing at all. The fix is to deal with the <em>parent</em>: find it with <code>ps -o ppid= -p &lt;zombie-pid&gt;</code> and either fix its code to reap children, or restart it. When the parent dies, the zombie is re-parented to PID 1, which reaps it instantly.</p>
<div class="callout">A handful of zombies is cosmetic. Thousands of them is a real bug — the process table is finite, and exhausting it means the machine can no longer fork, so nothing new can start and even logging in fails. This is the classic failure mode of a container running an application directly as PID 1 without an init: PID 1 has special reaping duties that most applications do not implement, which is why Docker's <code>--init</code> flag and <code>tini</code> exist.</div>

<h3>Seen for real: a PID 1 that never reaps</h3>
<p>The container used for this chapter was started with <code>docker run … ubuntu:24.04 sleep infinity</code>, so its PID 1 is plain <code>sleep</code> — a program that has never heard of <code>wait()</code>. Killing every process of user <code>an</code> re-parented their children to PID 1, and nobody ever collected them:</p>
<pre><code>pkill -KILL -u an
ps -o pid,ppid,stat,cmd --ppid 1 | head -5
ps -eo stat | grep -c ^Z</code></pre>
<div class="out">    PID    PPID STAT CMD
   2930       1 Z    [sleep] &lt;defunct&gt;
   2931       1 Z    [bash] &lt;defunct&gt;
   2932       1 Z    [sleep] &lt;defunct&gt;
   2933       1 Z    [timeout] &lt;defunct&gt;
8</div>
<p>The same experiment in a container started with <code>--init</code> leaves nothing behind: PID 1 becomes <code>/sbin/docker-init -- sleep infinity</code> (that is <code>tini</code>), which calls <code>wait()</code> on every orphan it inherits. That is the whole argument for <code>init: true</code> in a compose file, measured rather than asserted.</p>
<h3>/proc: the kernel as a filesystem</h3>
${slide('lx-05', 8, '/proc/PID: hồ sơ sống của tiến trình')}
<p>Everything <code>ps</code> and <code>top</code> report comes from <code>/proc</code>, a virtual filesystem where each process is a directory named after its PID. You can read it directly:</p>
<pre><code class="language-bash">ls /proc/812/
cat /proc/812/cmdline | tr '\\0' ' '; echo    <span class="tok-comment"># NUL-separated arguments</span>
cat /proc/812/status | head -12
ls -l /proc/812/cwd                          <span class="tok-comment"># its working directory</span>
ls -l /proc/812/exe                          <span class="tok-comment"># the binary it is running</span>
ls -l /proc/812/fd/                          <span class="tok-comment"># every open file descriptor</span>
cat /proc/812/environ | tr '\\0' '\\n'          <span class="tok-comment"># its environment (needs privilege)</span></code></pre>
<div class="out">Name:   nginx
State:  S (sleeping)
Tgid:   812
Pid:    812
PPid:   1
Uid:    0       0       0       0
VmRSS:     8452 kB
Threads:        1

lrwxrwxrwx 1 root root 0 Aug 22 12:31 /proc/812/exe -> /usr/sbin/nginx
lrwx------ 1 root root 64 Aug 22 12:31 /proc/812/fd/6 -> /var/log/nginx/access.log</div>
<div class="callout ok"><code>/proc/&lt;pid&gt;/fd/</code> is the tool that solves Lesson 1.4's puzzle. When a deleted file still consumes disk, this directory shows which process is holding it open — the symlink target ends in <code>(deleted)</code>. <code>sudo ls -l /proc/*/fd/* 2&gt;/dev/null | grep deleted</code> finds every case on the machine, and restarting that one process frees the space without a reboot.</div>

<h3>Try it step by step</h3>
<p>Nine lines in a throwaway container (<code>docker run --rm -it ubuntu:24.04 bash</code>, then <code>apt-get update &amp;&amp; apt-get install -y procps</code>). Predict each output before you press Enter.</p>
<pre><code>echo \$\$
bash
echo \$\$ \$PPID
sleep 1000 &amp;
ps -o pid,ppid,stat,cmd --forest
kill -STOP \$!; ps -o pid,stat,cmd -p \$!
kill -CONT \$!; ps -o pid,stat,cmd -p \$!
readlink /proc/\$!/exe /proc/\$!/cwd
kill \$!; exit</code></pre>
<div class="out">3736
3739 3736
[1] 3744
    PID    PPID STAT CMD
   3736    3735 S     \\_ bash --norc -i
   3739    3736 S         \\_ bash
   3744    3739 S             \\_ sleep 1000
   3746    3739 R+            \\_ ps -o pid,ppid,stat,cmd --forest
    PID STAT CMD
   3744 T    sleep 1000
    PID STAT CMD
   3744 S    sleep 1000
/usr/bin/sleep
/home/an</div>
<p>What to notice: the inner <code>bash</code>'s <code>\$PPID</code> is exactly the outer shell's <code>\$\$</code>; <code>--forest</code> draws the same chain; <code>ps</code> itself is <code>R+</code> (running, foreground) because it is the one thing on the CPU while it looks; <code>kill -STOP</code> turns <code>S</code> into <code>T</code> and <code>kill -CONT</code> turns it back; and <code>/proc/PID/exe</code> and <code>cwd</code> are symlinks you can read like any other. (Recorded in a real pseudo-terminal in an Ubuntu 24.04 container, user <code>an</code>; one line of the forest for the outer <code>sh</code> is omitted.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL2</th><th>macOS (BSD tools)</th></tr>
<tr><td>PID 1</td><td><code>systemd</code> (WSL2: when enabled in <code>/etc/wsl.conf</code>)</td><td><code>launchd</code> — <code>ps -o pid,comm -p 1</code> prints <code>/sbin/launchd</code></td></tr>
<tr><td><code>/proc</code></td><td>present</td><td>absent: <code>ls: /proc: No such file or directory</code>. Use <code>ps -o …</code>, <code>lsof -p PID</code>, Activity Monitor</td></tr>
<tr><td><code>ps --sort</code>, <code>--forest</code></td><td>work (GNU procps)</td><td><code>ps: illegal option -- -</code>. Sort with <code>ps aux -r</code> (CPU) or <code>-m</code> (memory)</td></tr>
<tr><td><code>ps aux</code>, <code>ps -ef</code>, <code>ps -o</code></td><td>work</td><td>work, with slightly different column names (<code>TT</code>, <code>STARTED</code>)</td></tr>
<tr><td><code>pstree</code>, <code>pidof</code></td><td>present (<code>psmisc</code>, <code>procps</code>)</td><td>absent (<code>brew install pstree</code>)</td></tr>
<tr><td><code>pgrep -a</code></td><td>print the full command line</td><td>means "include ancestors"! Use <code>pgrep -lf</code></td></tr>
</table>
<p>WSL2 runs a real Linux kernel, so everything in this lesson behaves exactly as on the VPS. The Mac is where habits break — most often a GNU long option that "does not exist".</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate's container "fills up with defunct processes" and they want to <code>kill -9</code> them. Show them why that fails and what actually works — in your own throwaway container.</p><ol>
<li>Start one without an init: <code>docker run -d --name lab51 ubuntu:24.04 sleep infinity</code>, then <code>docker exec -it lab51 bash</code> and <code>apt-get update &amp;&amp; apt-get install -y procps</code>.</li>
<li>Create a zombie: <code>bash -c 'sleep 1 &amp; exec sleep 600' &amp;</code>, wait two seconds, then find it with <code>ps -eo pid,ppid,stat,cmd | awk '\$3 ~ /Z/'</code>.</li>
<li>Try <code>kill -9 &lt;zombie PID&gt;</code> and look again. Then find its parent with <code>ps -o ppid= -p &lt;zombie PID&gt;</code> and read that parent's <code>/proc/&lt;PPID&gt;/cmdline</code>.</li>
<li>Kill the parent. Where does the zombie go, and does it disappear? Repeat steps 2–4 in a container started with <code>--init</code> and compare.</li></ol>
<p><strong>Done when:</strong> you can show that <code>kill -9</code> leaves the <code>Z</code> line unchanged, that killing the parent makes the zombie's PPID become 1, and that under <code>--init</code> it vanishes while under plain <code>sleep</code> it stays. Clean up with <code>docker rm -f lab51</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Process / PID</span><span class="v">A program while it runs, and the number the kernel gives it.</span></div>
  <div class="kv"><span class="k">PPID</span><span class="v">The PID of the parent — whoever forked this process.</span></div>
  <div class="kv"><span class="k">fork / exec / wait</span><span class="v">Clone the caller · replace the clone with a new program · collect a child's exit status.</span></div>
  <div class="kv"><span class="k">System call</span><span class="v">A request a program makes to the kernel; <code>strace</code> prints them.</span></div>
  <div class="kv"><span class="k">State (STAT)</span><span class="v"><code>R</code> running, <code>S</code> sleeping, <code>D</code> blocked on I/O, <code>T</code> stopped, <code>Z</code> zombie.</span></div>
  <div class="kv"><span class="k">Zombie / orphan</span><span class="v">Exited but not yet waited for · still running but its parent died first.</span></div>
  <div class="kv"><span class="k">Reap</span><span class="v">To call <code>wait()</code> on a dead child so its process-table entry is freed.</span></div>
  <div class="kv"><span class="k">/proc</span><span class="v">A virtual filesystem where each running process is a directory named after its PID.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every process has a PID and a parent; the whole machine is one tree rooted at PID 1.</li>
<li>A new program starts as <code>fork</code> (clone), redirections in the child, <code>exec</code> (replace), and the parent's <code>wait</code>.</li>
<li><code>ps aux</code> for everything, <code>ps -o</code> for the columns you want; RSS is real memory, TIME is CPU seconds.</li>
<li><code>D</code> cannot be killed until its I/O finishes; <code>Z</code> is already dead and only its parent can clear it.</li>
<li>A PID 1 that never calls <code>wait()</code> piles up zombies — the reason for <code>--init</code>.</li>
<li><code>/proc/PID/</code> answers "what is it running, from where, with which files open" without any tool — but not on a Mac.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/proc.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">proc(5) — every file under /proc explained</span><span class="lc-sub">Enormous, but skim the per-process section once. Knowing that <code>status</code>, <code>cmdline</code>, <code>fd/</code> and <code>cwd</code> exist changes how you debug.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man2/fork.2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">fork(2) and execve(2)</span><span class="lc-sub">What exactly is inherited across a fork — file descriptors, working directory, umask, environment — which is precisely the list that explains shell behaviour.</span></span>
</a>
<a class="link-card" href="https://biriukov.dev/docs/fd-pipe-session-terminal/0-fd-pipe-session-terminal-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">File descriptors, pipes, sessions and terminals</span><span class="lc-sub">A deep, readable series tying together fds, process groups, sessions and controlling terminals — the model behind both this chapter and Chapter 3.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the process</span><span class="lc-sub">Graded tasks: identify what holds a port, what is using the most memory, which process keeps a deleted file open, and which parent is leaking zombies.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> reading <code>TIME</code> in <code>ps aux</code> as uptime. A process showing <code>0:31</code> has consumed 31 seconds of <em>CPU</em>, which might be over three months of wall-clock life. Conversely a process started ten seconds ago can show <code>0:38</code> if it ran on four cores. For "how long has this been up", use <code>ps -o etime= -p &lt;pid&gt;</code> or <code>ps -eo pid,etime,cmd</code>. Mixing the two is how people conclude a healthy daemon is spinning.</div>
<p class="note-ct"><strong>Three commands to keep:</strong> <code>ps aux --sort=-%cpu | head</code> for "what is eating this machine", <code>pgrep -a &lt;name&gt;</code> for "is it running and with what arguments", and <code>sudo ss -tulpn</code> for "what is on that port". Between them they answer most process questions without opening an interactive tool — which matters when you are on a slow SSH connection, and matters more when you want the answer in a script.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Tiến trình là gì</h2>
<p class="lead">Một chương trình là một file trên đĩa. Một <em>TIẾN TRÌNH</em> là chương trình đó đang chạy: một bản sao của mã lệnh, bộ nhớ riêng của nó, một tập bộ mô tả file đang mở (Bài 3.1), một danh tính người dùng (Chương 4), một thư mục làm việc, và một con số. Mọi thứ trong chương này — giết, đẩy xuống nền, gửi tín hiệu — đều là thao tác lên con số đó.</p>

<h3>Mọi tiến trình đều có cha</h3>
${slide('lx-05', 3, 'Cả máy là một cây tiến trình, gốc là PID 1')}
<pre><code>echo \$\$          <span class="tok-comment"># PID của shell bạn đang dùng</span>
echo \$PPID       <span class="tok-comment"># PID của thứ đã khởi động cái shell đó</span>
ps -o pid,ppid,user,comm -p \$\$</code></pre>
<div class="out">4821
4102
    PID    PPID USER     COMMAND
   4821    4102 deploy   bash</div>
<p>Shell của bạn được khởi động bởi một thứ gì đó, thứ đó lại được khởi động bởi thứ khác, cứ thế ngược lên tới PID 1. Có đúng một cái gốc, và cả hệ thống là MỘT cái cây duy nhất:</p>
<pre><code>pstree -p | head -20</code></pre>
<div class="out">systemd(1)─┬─containerd(742)─┬─{containerd}(743)
           ├─nginx(812)─┬─nginx(813)
           │            └─nginx(814)
           ├─postgres(901)─┬─postgres(912)
           │               └─postgres(913)
           ├─sshd(1043)───sshd(4102)───bash(4821)───pstree(5219)
           └─systemd-journald(388)</div>
<p>Hãy đọc nhánh cuối: <code>sshd</code> nhận kết nối của bạn, rẽ ra một <code>sshd</code> con cho phiên của bạn, cái đó khởi động <code>bash</code>, và <code>bash</code> khởi động <code>pstree</code>. Đó là toàn bộ lần đăng nhập của bạn, và nó giải thích vì sao đóng một kết nối SSH lại giết luôn thứ bạn vừa khởi chạy từ đó — chủ đề mà Bài 5.4 sẽ quay lại.</p>

<h3>fork và exec: một tiến trình mới xuất hiện thế nào</h3>
${slide('lx-05', 4, 'fork → dup3 → exec → wait, đo bằng strace')}
<p>Linux KHÔNG có lời gọi "chạy chương trình này". Nó có hai lời gọi, và mỗi cái làm một nửa công việc:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · fork()</span><span class="lz-t">shell tự NHÂN BẢN CHÍNH MÌNH</span><span class="lz-d">Một bản sao y hệt: cùng bộ nhớ, cùng các bộ mô tả file đang mở, cùng thư mục làm việc. Chỉ khác PID. Đây là chỗ các phép chuyển hướng và ống dẫn được dựng lên — trong tiến trình con, TRƯỚC khi chương trình mới tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">2 · exec()</span><span class="lz-t">bản sao TỰ THAY MÌNH bằng chương trình mới</span><span class="lz-d">Cùng PID, cùng các fd, nhưng mã lệnh và bộ nhớ thì hoàn toàn mới. Mã của shell cũ biến mất.</span></div>
  <div class="lz-step"><span class="lz-k">3 · wait()</span><span class="lz-t">tiến trình cha chờ lấy mã thoát</span><span class="lz-d">Và nó trở thành <code>\$?</code>. Bỏ qua bước này — đó chính là việc dấu <code>&amp;</code> làm — thì tiến trình cha đi tiếp ngay lập tức.</span></div>
</div>
<div class="callout ok">Chính thiết kế hai bước này là lý do các luật chuyển hướng ở Bài 3.1 hoạt động theo cách chúng hoạt động. Shell fork ra, RỒI <em>SAU ĐÓ</em>, bên trong tiến trình con, nó mở file và đấu lại các fd 0/1/2 — tất cả trước khi <code>exec</code> nạp chương trình. Chương trình bắt đầu đời mình với các dòng chuẩn đã chĩa sẵn vào chỗ bạn yêu cầu, và đó là lý do nó không bao giờ cần biết rằng có một phép chuyển hướng nào đã xảy ra. Một cơ chế, và nó giải thích cả <code>&gt;</code>, <code>|</code>, <code>2&gt;&amp;1</code> lẫn chuyện vì sao <code>sort f &gt; f</code> làm rỗng file.</div>

<h3>Nhìn tận mắt fork và exec xảy ra</h3>
<p>Bạn không phải tin suông ba bước trên. <code>strace</code> (Chương 12) in ra mọi lời gọi hệ thống (system call — yêu cầu chương trình gửi cho nhân) mà một chương trình thực hiện; cờ <code>-f</code> theo dõi luôn các tiến trình con. Đây là bash chạy <code>ls &gt; ds.txt</code>, lọc còn đúng năm lời gọi quan trọng:</p>
<pre><code>strace -f -e trace=clone,openat,dup3,execve,wait4 bash -c "ls &gt; ds.txt; echo xong"</code></pre>
<div class="out">clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD) = 2923
[pid  2922] wait4(-1,  &lt;unfinished ...&gt;
[pid  2923] openat(AT_FDCWD, "ds.txt", O_WRONLY|O_CREAT|O_TRUNC, 0666) = 3
[pid  2923] dup3(3, 1, 0)               = 1
[pid  2923] execve("/usr/bin/ls", ["ls"], …) = 0
[pid  2923] +++ exited with 0 +++
&lt;... wait4 resumed&gt;[{WIFEXITED(s) &amp;&amp; WEXITSTATUS(s) == 0}], 0, NULL) = 2923
xong</div>
<p>Đọc từng dòng: tiến trình cha (2922) gọi <code>clone</code> — dạng hiện đại của <code>fork</code> trên Linux — rồi lập tức ngủ trong <code>wait4</code>. Tiến trình con (2923) lúc này VẪN là bash: nó mở <code>ds.txt</code> thành fd 3, chép fd 3 đè lên fd 1 (<code>dup3(3, 1)</code> — "từ giờ stdout chĩa vào file"), và chỉ SAU ĐÓ mới gọi <code>execve</code> để biến thành <code>ls</code>, vẫn giữ nguyên PID. Khi <code>ls</code> thoát, cha thức dậy với trạng thái 0, và con số đó thành <code>\$?</code>. (Ghi trong container Ubuntu 24.04 arm64; trên máy x86-64 bạn sẽ thấy <code>dup2</code> thay cho <code>dup3</code>; các dòng nạp thư viện đã được lọc bỏ.)</p>
<h3>ps: hai cú pháp, và nên dùng cái nào</h3>
${slide('lx-05', 5, 'ps aux: đọc từng cột')}
<p><code>ps</code> mang trên lưng ba mươi năm lịch sử và nhận cả cờ kiểu BSD (không có gạch ngang) lẫn cờ kiểu UNIX (có gạch ngang), và chúng hành xử khác nhau. Thực tế thì bạn chỉ cần hai cách gọi:</p>
<pre><code>ps aux                  <span class="tok-comment"># BSD: mọi thứ, kèm CPU/bộ nhớ — cái đáng học thuộc</span>
ps -ef                  <span class="tok-comment"># UNIX: mọi thứ, kèm PPID và giờ khởi động</span>
ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu | head
ps -o pid,stat,cmd -p 812
ps -u www-data          <span class="tok-comment"># chỉ tiến trình của người dùng này</span>
ps -C nginx             <span class="tok-comment"># chỉ lệnh này</span></code></pre>
<div class="out">USER  PID %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND
root  812  0.0  0.1 141240  8452 ?    Ss   09:14   0:00 nginx: master process
www-  813  1.2  0.4 142108 34120 ?    S    09:14   0:31 nginx: worker process
depl 4821  0.0  0.0  10240  5104 pts/1 Ss  11:02   0:00 bash</div>
<div class="kv-grid">
  <div class="kv"><span class="k">VSZ</span><span class="v">Kích thước ảo — mọi thứ tiến trình đã <em>ÁNH XẠ</em> vào, kể cả thư viện dùng chung và cả phần bộ nhớ nó chưa hề chạm tới. Gần như luôn gây hiểu nhầm; hãy bỏ qua nó.</span></div>
  <div class="kv"><span class="k">RSS</span><span class="v">Resident Set Size — RAM vật lý đang thật sự dùng. Đây là con số bạn cần, dù thư viện dùng chung bị đếm ở mọi tiến trình có ánh xạ nó, nên cộng dồn RSS sẽ đếm thừa.</span></div>
  <div class="kv"><span class="k">TTY</span><span class="v">Terminal mà nó gắn vào. Dấu <code>?</code> nghĩa là không có — nó là một daemon, hoặc đã được tách ra (Bài 5.4).</span></div>
  <div class="kv"><span class="k">STAT</span><span class="v">Trạng thái kèm cờ. <code>S</code> đang ngủ, <code>R</code> đang chạy, <code>D</code> ngủ không ngắt được (đang chờ đĩa), <code>Z</code> xác sống, <code>T</code> đã dừng. Hậu tố: <code>s</code> trưởng phiên, <code>+</code> ở tiền cảnh, <code>&lt;</code> ưu tiên cao, <code>N</code> ưu tiên thấp.</span></div>
  <div class="kv"><span class="k">TIME</span><span class="v">Tổng thời gian CPU đã tiêu, <strong>KHÔNG PHẢI</strong> nó đã chạy được bao lâu. Muốn tuổi theo đồng hồ thì dùng <code>etime</code>.</span></div>
</div>
<div class="callout warn">Một tiến trình ở trạng thái <code>D</code> — ngủ không ngắt được — thì <strong>KHÔNG GIẾT ĐƯỢC</strong>, kể cả bằng <code>kill -9</code>. Nó đang bị chặn bên trong một lời gọi hệ thống để chờ phần cứng, thường là đĩa hoặc một hệ thống file mạng đã treo, và nhân sẽ không ngắt nó. Vài tiến trình <code>D</code> đi kèm tải trung bình tăng dần mà CPU thì rỗi chính là dấu hiệu của lưu trữ đang hỏng hoặc một mount NFS đã chết, không phải dấu hiệu máy đang bận. Chương 12 nói về việc phải làm gì; còn lúc này, nhận ra nó giúp bạn khỏi gõ <code>kill -9</code> hai mươi lần.</div>

<h3>Năm trạng thái, và thứ gì đẩy tiến trình qua lại giữa chúng</h3>
${slide('lx-05', 6, 'Vòng đời trạng thái R · S · D · T · Z')}
<p>Chữ cái ở cột <code>STAT</code> không phải để trang trí; nó cho biết tiến trình đang làm gì <em>NGAY LÚC NÀY</em> và công cụ nào còn với tới được nó. Một tiến trình sinh ra bằng <code>fork</code> ở trạng thái <code>R</code>, và từ đó đi qua lại giữa các trạng thái theo sự kiện:</p>
<table>
<tr><th>Trạng thái</th><th>Nghĩa</th><th>Vào trạng thái này khi</th><th>Rời đi khi</th></tr>
<tr><td><code>R</code> running (đang chạy)</td><td>đang ở trên một nhân CPU, hoặc xếp hàng chờ nhân</td><td>vừa được tạo, hoặc hết phải chờ</td><td>bị chặn, bị dừng, thoát</td></tr>
<tr><td><code>S</code> sleeping (ngủ)</td><td>chờ một sự kiện: dữ liệu mạng, phím gõ, hẹn giờ</td><td>gọi một thứ phải chờ</td><td>sự kiện tới — hoặc bất kỳ tín hiệu nào</td></tr>
<tr><td><code>D</code> disk sleep (ngủ không ngắt được)</td><td>bị chặn trong nhân vì I/O; tín hiệu phải xếp hàng chờ</td><td>đọc/ghi một thiết bị chậm hoặc đã treo</td><td>chỉ khi I/O xong</td></tr>
<tr><td><code>T</code> stopped (dừng)</td><td>đóng băng, 0% CPU, bộ nhớ vẫn giữ</td><td><code>Ctrl-Z</code> (SIGTSTP) hoặc <code>kill -STOP</code></td><td><code>kill -CONT</code>, <code>fg</code>, <code>bg</code></td></tr>
<tr><td><code>Z</code> zombie (xác sống)</td><td>đã thoát rồi; chỉ còn lại mã thoát</td><td>gọi <code>exit()</code></td><td>cha gọi <code>wait()</code></td></tr>
</table>
<p>Bốn trong số đó dựng ra được một cách có chủ ý, và đó là cách nhanh nhất để sau này nhìn là nhận ra. Trong một container Ubuntu, một script khởi động <code>sleep 1000</code> (ngủ), dừng một <code>sleep</code> thứ hai, chạy một vòng lặp đốt CPU, và để lại một đứa con không ai chờ:</p>
<pre><code>ps -o pid,ppid,stat,cmd -u an</code></pre>
<div class="out">    PID    PPID STAT CMD
   2961    2955 S    sleep 1000
   2962    2955 T    sleep 1001
   2966    2955 S    python3 -m http.server 19050
   2967    2965 R    sh -c while :; do :; done
   2968    2964 Z    [sleep] &lt;defunct&gt;</div>
<p>Để ý: lệnh của xác sống hiện trong ngoặc vuông kèm <code>&lt;defunct&gt;</code> (đã chết), và các cột bộ nhớ của nó bằng 0 — chẳng còn chương trình nào, chỉ còn một dòng trong bảng tiến trình. <code>D</code> là trạng thái duy nhất khó dựng ra — và lại là cái quan trọng nhất trên một máy chủ đang ốm, vì nó là trạng thái duy nhất làm tải trung bình phình lên mà không tốn CPU (Bài 5.2).</p>
<h3>Những cờ của ps bạn thật sự sẽ gõ</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>a</code> <code>u</code> <code>x</code> (kiểu BSD)</td><td>mọi người dùng · cột hướng người dùng · kể cả tiến trình không gắn terminal</td><td><code>ps aux</code></td></tr>
<tr><td><code>-e</code> / <code>-A</code></td><td>mọi tiến trình (kiểu UNIX)</td><td><code>ps -e</code></td></tr>
<tr><td><code>-f</code></td><td>dạng đầy đủ: UID, PPID, giờ khởi động, cả dòng lệnh</td><td><code>ps -ef</code></td></tr>
<tr><td><code>-o</code></td><td>tự chọn cột</td><td><code>ps -o pid,ppid,stat,etime,cmd</code></td></tr>
<tr><td><code>-p</code> · <code>--ppid</code></td><td>các PID này · con của PID này</td><td><code>ps --ppid 1</code></td></tr>
<tr><td><code>-u</code> · <code>-C</code></td><td>của một người dùng · theo tên lệnh</td><td><code>ps -C nginx</code></td></tr>
<tr><td><code>--sort</code></td><td>sắp theo một cột, <code>-</code> = giảm dần (GNU)</td><td><code>ps aux --sort=-rss</code></td></tr>
<tr><td><code>--forest</code></td><td>vẽ cây cha–con bằng ký tự (GNU)</td><td><code>ps -ef --forest</code></td></tr>
<tr><td><code>-o cột=</code></td><td>dấu <code>=</code> ở cuối bỏ dòng tiêu đề — tiện trong script</td><td><code>ps -o ppid= -p 2968</code></td></tr>
</table>
<h3>Tìm cho ra cái tiến trình bạn quan tâm</h3>
<pre><code>pgrep -a nginx                   <span class="tok-comment"># PID khớp với một cái tên, -a hiện cả dòng lệnh</span>
pgrep -u deploy -a node          <span class="tok-comment"># thu hẹp theo người dùng</span>
pidof nginx                      <span class="tok-comment"># chỉ các PID, cách nhau bằng dấu cách</span>
ps aux | grep '[n]ginx'          <span class="tok-comment"># mẹo ngoặc vuông — loại chính lệnh grep ra</span>
sudo ss -tulpn | grep :3000      <span class="tok-comment"># tiến trình nào đang giữ một CỔNG</span>
sudo lsof -i :3000               <span class="tok-comment"># cùng câu hỏi, chi tiết hơn</span>
sudo lsof -p 812                 <span class="tok-comment"># mọi file mà CHÍNH tiến trình này đang mở</span></code></pre>
<div class="out">812 nginx: master process /usr/sbin/nginx
813 nginx: worker process

tcp LISTEN 0 511 0.0.0.0:3000 users:(("node",pid=5012,fd=21))</div>
<p>Cặp ngoặc vuông trong <code>grep '[n]ginx'</code> là một mẹo kinh điển nho nhỏ: cái mẫu khớp với chữ <code>nginx</code>, nhưng dòng lệnh của chính tiến trình <code>grep</code> lại chứa <code>[n]ginx</code>, thứ không khớp với chính nó. <code>pgrep</code> tránh hẳn vấn đề này và mới là thứ bạn nên với tay lấy.</p>
<div class="callout ok"><code>sudo ss -tulpn | grep :3000</code> chính là câu trả lời cho lỗi "address already in use" — nó nêu đích danh tiến trình đang giữ cổng, để bạn quyết định có nên dừng nó không thay vì khởi động lại cả máy. Chương 9 nói về <code>ss</code> tử tế; riêng dòng này thì đáng học ngay bây giờ.</div>

<h3>Tiến trình mồ côi và tiến trình xác sống</h3>
${slide('lx-05', 7, 'Xác sống dưới một PID 1 không biết dọn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Mồ côi (orphan)</span><span class="v">Tiến trình cha chết trước. Nhân lập tức nhận nó về làm con của PID 1, và PID 1 sẽ thu dọn nó đúng cách. Vô hại — và đó chính là cách truyền thống để tạo ra một daemon.</span></div>
  <div class="kv"><span class="k">Xác sống (<code>Z</code>, <code>&lt;defunct&gt;</code>)</span><span class="v">Nó đã <em>THOÁT</em> rồi, nhưng tiến trình cha chưa gọi <code>wait()</code> để lấy mã thoát về, nên nhân vẫn giữ một mục nhỏ trong bảng tiến trình. Nó không tốn CPU và không tốn bộ nhớ — chỉ chiếm một ô PID.</span></div>
</div>
<pre><code>ps aux | awk '\$8 ~ /Z/ {print \$2, \$11}'</code></pre>
<div class="out">7412 [python3] &lt;defunct&gt;</div>
<p><strong>Bạn KHÔNG giết được một xác sống</strong> — nó chết rồi. <code>kill -9</code> lên nó chẳng làm gì cả. Cách chữa là xử lý cái <em>CHA</em>: tìm ra nó bằng <code>ps -o ppid= -p &lt;pid-xác-sống&gt;</code> rồi hoặc sửa mã của nó để nó thu dọn con, hoặc khởi động lại nó. Khi tiến trình cha chết, cái xác sống được chuyển về làm con của PID 1, và PID 1 dọn nó ngay tức khắc.</p>
<div class="callout">Vài cái xác sống thì chỉ là chuyện thẩm mỹ. Hàng nghìn cái là một lỗi thật — bảng tiến trình có hạn, và làm cạn nó nghĩa là máy không fork được nữa, nên không gì mới khởi động được và ngay cả đăng nhập cũng hỏng. Đây là kiểu hỏng kinh điển của một container chạy ứng dụng trực tiếp ở vị trí PID 1 mà không có init: PID 1 mang những nghĩa vụ thu dọn đặc biệt mà phần lớn ứng dụng không hề cài đặt, và đó là lý do cờ <code>--init</code> của Docker cùng <code>tini</code> tồn tại.</div>

<h3>Thấy tận mắt: một PID 1 không bao giờ dọn xác</h3>
<p>Container dùng cho chương này được khởi động bằng <code>docker run … ubuntu:24.04 sleep infinity</code>, nên PID 1 của nó là <code>sleep</code> trơn — một chương trình chưa từng biết tới <code>wait()</code>. Giết mọi tiến trình của người dùng <code>an</code> làm các con của chúng được chuyển về làm con PID 1, và không ai thu dọn chúng cả:</p>
<pre><code>pkill -KILL -u an
ps -o pid,ppid,stat,cmd --ppid 1 | head -5
ps -eo stat | grep -c ^Z</code></pre>
<div class="out">    PID    PPID STAT CMD
   2930       1 Z    [sleep] &lt;defunct&gt;
   2931       1 Z    [bash] &lt;defunct&gt;
   2932       1 Z    [sleep] &lt;defunct&gt;
   2933       1 Z    [timeout] &lt;defunct&gt;
8</div>
<p>Cùng thí nghiệm đó trong một container khởi động với <code>--init</code> thì không để lại gì: PID 1 thành <code>/sbin/docker-init -- sleep infinity</code> (chính là <code>tini</code>), và nó gọi <code>wait()</code> cho mọi đứa mồ côi nó nhận về. Đó là toàn bộ lý lẽ cho dòng <code>init: true</code> trong file compose — đo được, chứ không chỉ nói suông.</p>
<h3>/proc: nhân dưới dạng một hệ thống file</h3>
${slide('lx-05', 8, '/proc/PID: hồ sơ sống của tiến trình')}
<p>Mọi thứ <code>ps</code> và <code>top</code> báo cáo đều đến từ <code>/proc</code>, một hệ thống file ảo nơi mỗi tiến trình là một thư mục đặt tên theo PID của nó. Bạn đọc thẳng nó được:</p>
<pre><code class="language-bash">ls /proc/812/
cat /proc/812/cmdline | tr '\\0' ' '; echo    <span class="tok-comment"># tham số phân cách bằng NUL</span>
cat /proc/812/status | head -12
ls -l /proc/812/cwd                          <span class="tok-comment"># thư mục làm việc của nó</span>
ls -l /proc/812/exe                          <span class="tok-comment"># file chương trình nó đang chạy</span>
ls -l /proc/812/fd/                          <span class="tok-comment"># mọi bộ mô tả file đang mở</span>
cat /proc/812/environ | tr '\\0' '\\n'          <span class="tok-comment"># môi trường của nó (cần đặc quyền)</span></code></pre>
<div class="out">Name:   nginx
State:  S (sleeping)
Tgid:   812
Pid:    812
PPid:   1
Uid:    0       0       0       0
VmRSS:     8452 kB
Threads:        1

lrwxrwxrwx 1 root root 0 Aug 22 12:31 /proc/812/exe -> /usr/sbin/nginx
lrwx------ 1 root root 64 Aug 22 12:31 /proc/812/fd/6 -> /var/log/nginx/access.log</div>
<div class="callout ok"><code>/proc/&lt;pid&gt;/fd/</code> chính là công cụ giải câu đố ở Bài 1.4. Khi một file đã xoá vẫn còn ăn đĩa, thư mục này cho thấy tiến trình nào đang giữ nó mở — đích của liên kết tượng trưng kết thúc bằng chữ <code>(deleted)</code>. Lệnh <code>sudo ls -l /proc/*/fd/* 2&gt;/dev/null | grep deleted</code> tìm ra mọi trường hợp trên máy, và khởi động lại đúng một tiến trình đó là giải phóng được chỗ trống mà không cần khởi động lại máy.</div>

<h3>Chạy thử từng bước</h3>
<p>Chín dòng trong một container vứt đi (<code>docker run --rm -it ubuntu:24.04 bash</code>, rồi <code>apt-get update &amp;&amp; apt-get install -y procps</code>). Đoán output của từng dòng TRƯỚC khi bấm Enter.</p>
<pre><code>echo \$\$
bash
echo \$\$ \$PPID
sleep 1000 &amp;
ps -o pid,ppid,stat,cmd --forest
kill -STOP \$!; ps -o pid,stat,cmd -p \$!
kill -CONT \$!; ps -o pid,stat,cmd -p \$!
readlink /proc/\$!/exe /proc/\$!/cwd
kill \$!; exit</code></pre>
<div class="out">3736
3739 3736
[1] 3744
    PID    PPID STAT CMD
   3736    3735 S     \\_ bash --norc -i
   3739    3736 S         \\_ bash
   3744    3739 S             \\_ sleep 1000
   3746    3739 R+            \\_ ps -o pid,ppid,stat,cmd --forest
    PID STAT CMD
   3744 T    sleep 1000
    PID STAT CMD
   3744 S    sleep 1000
/usr/bin/sleep
/home/an</div>
<p>Cần để ý: <code>\$PPID</code> của <code>bash</code> bên trong đúng bằng <code>\$\$</code> của shell bên ngoài; <code>--forest</code> vẽ lại đúng chuỗi đó; chính <code>ps</code> mang trạng thái <code>R+</code> (đang chạy, ở tiền cảnh) vì nó là thứ duy nhất đang dùng CPU lúc nó nhìn; <code>kill -STOP</code> biến <code>S</code> thành <code>T</code> và <code>kill -CONT</code> trả lại; còn <code>/proc/PID/exe</code> và <code>cwd</code> là liên kết tượng trưng đọc được như mọi liên kết khác. (Ghi trong một pseudo-terminal — terminal giả — thật, container Ubuntu 24.04, người dùng <code>an</code>; đã bỏ một dòng của cây cho <code>sh</code> ngoài cùng.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL2</th><th>macOS (công cụ BSD)</th></tr>
<tr><td>PID 1</td><td><code>systemd</code> (WSL2: khi bật trong <code>/etc/wsl.conf</code>)</td><td><code>launchd</code> — <code>ps -o pid,comm -p 1</code> in ra <code>/sbin/launchd</code></td></tr>
<tr><td><code>/proc</code></td><td>có</td><td>KHÔNG có: <code>ls: /proc: No such file or directory</code>. Dùng <code>ps -o …</code>, <code>lsof -p PID</code>, Activity Monitor</td></tr>
<tr><td><code>ps --sort</code>, <code>--forest</code></td><td>chạy (GNU procps)</td><td><code>ps: illegal option -- -</code>. Sắp bằng <code>ps aux -r</code> (theo CPU) hoặc <code>-m</code> (theo bộ nhớ)</td></tr>
<tr><td><code>ps aux</code>, <code>ps -ef</code>, <code>ps -o</code></td><td>chạy</td><td>chạy, tên cột hơi khác (<code>TT</code>, <code>STARTED</code>)</td></tr>
<tr><td><code>pstree</code>, <code>pidof</code></td><td>có (<code>psmisc</code>, <code>procps</code>)</td><td>không có (<code>brew install pstree</code>)</td></tr>
<tr><td><code>pgrep -a</code></td><td>in cả dòng lệnh</td><td>nghĩa là "kèm cả tổ tiên"! Dùng <code>pgrep -lf</code></td></tr>
</table>
<p>WSL2 chạy một nhân Linux thật, nên mọi thứ trong bài này hành xử y như trên VPS. Mac mới là chỗ thói quen gãy — hay gặp nhất là một cờ dài của GNU "không tồn tại".</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> container của bạn cùng nhóm SWP391 "đầy tiến trình defunct" và bạn ấy định <code>kill -9</code> từng cái. Hãy chứng minh vì sao cách đó thất bại và cách nào thật sự ăn — trong một container vứt đi của chính bạn.</p><ol>
<li>Khởi động một container KHÔNG có init: <code>docker run -d --name lab51 ubuntu:24.04 sleep infinity</code>, rồi <code>docker exec -it lab51 bash</code> và <code>apt-get update &amp;&amp; apt-get install -y procps</code>.</li>
<li>Tạo một xác sống: <code>bash -c 'sleep 1 &amp; exec sleep 600' &amp;</code>, chờ hai giây, rồi tìm nó bằng <code>ps -eo pid,ppid,stat,cmd | awk '\$3 ~ /Z/'</code>.</li>
<li>Thử <code>kill -9 &lt;PID xác sống&gt;</code> rồi nhìn lại. Sau đó tìm cha của nó bằng <code>ps -o ppid= -p &lt;PID xác sống&gt;</code> và đọc <code>/proc/&lt;PPID&gt;/cmdline</code> của cha.</li>
<li>Giết tiến trình cha. Xác sống đi đâu, có biến mất không? Lặp lại bước 2–4 trong một container khởi động với <code>--init</code> rồi so sánh.</li></ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được <code>kill -9</code> để nguyên dòng <code>Z</code>; giết cha thì PPID của xác sống thành 1; và dưới <code>--init</code> nó biến mất còn dưới <code>sleep</code> trơn thì nằm lại. Dọn bằng <code>docker rm -f lab51</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Process / PID (tiến trình / số hiệu tiến trình)</span><span class="v">Một chương trình lúc đang chạy, và con số nhân cấp cho nó.</span></div>
  <div class="kv"><span class="k">PPID (PID của cha)</span><span class="v">PID của tiến trình đã fork ra tiến trình này.</span></div>
  <div class="kv"><span class="k">fork / exec / wait (nhân bản / thay thế / chờ)</span><span class="v">Sao chép chính mình · thay bản sao bằng chương trình mới · lấy mã thoát của con.</span></div>
  <div class="kv"><span class="k">System call (lời gọi hệ thống)</span><span class="v">Yêu cầu chương trình gửi cho nhân; <code>strace</code> in chúng ra.</span></div>
  <div class="kv"><span class="k">State — STAT (trạng thái)</span><span class="v"><code>R</code> chạy, <code>S</code> ngủ, <code>D</code> kẹt I/O, <code>T</code> dừng, <code>Z</code> xác sống.</span></div>
  <div class="kv"><span class="k">Zombie / orphan (xác sống / mồ côi)</span><span class="v">Đã thoát mà chưa được chờ · vẫn chạy nhưng cha đã chết trước.</span></div>
  <div class="kv"><span class="k">Reap (thu dọn xác)</span><span class="v">Gọi <code>wait()</code> cho một con đã chết để giải phóng ô của nó trong bảng tiến trình.</span></div>
  <div class="kv"><span class="k">/proc (hệ thống file ảo)</span><span class="v">Nơi mỗi tiến trình đang chạy là một thư mục đặt tên theo PID.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi tiến trình có một PID và một cha; cả máy là một cây với gốc là PID 1.</li>
<li>Một chương trình mới ra đời qua <code>fork</code> (nhân bản), chuyển hướng trong con, <code>exec</code> (thay thế), và <code>wait</code> của cha.</li>
<li><code>ps aux</code> để xem tất cả, <code>ps -o</code> để chọn cột; RSS là RAM thật, TIME là giây CPU.</li>
<li><code>D</code> không giết được cho tới khi I/O xong; <code>Z</code> đã chết rồi và chỉ cha nó dọn được.</li>
<li>Một PID 1 không bao giờ gọi <code>wait()</code> sẽ chất đống xác sống — lý do có <code>--init</code>.</li>
<li><code>/proc/PID/</code> trả lời "nó chạy gì, từ đâu, đang mở file nào" mà không cần công cụ — nhưng Mac không có.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/proc.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">proc(5) — giải thích mọi file dưới /proc</span><span class="lc-sub">Đồ sộ, nhưng hãy lướt qua phần dành cho từng tiến trình một lần. Biết rằng <code>status</code>, <code>cmdline</code>, <code>fd/</code> và <code>cwd</code> tồn tại sẽ đổi hẳn cách bạn gỡ lỗi.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man2/fork.2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">fork(2) và execve(2)</span><span class="lc-sub">Chính xác những gì được thừa kế qua một lần fork — bộ mô tả file, thư mục làm việc, umask, môi trường — và đó đúng là danh sách giải thích hành vi của shell.</span></span>
</a>
<a class="link-card" href="https://biriukov.dev/docs/fd-pipe-session-terminal/0-fd-pipe-session-terminal-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">File descriptor, ống dẫn, phiên và terminal</span><span class="lc-sub">Một loạt bài sâu và dễ đọc, nối liền fd, nhóm tiến trình, phiên và terminal điều khiển — chính là mô hình nằm sau cả chương này lẫn Chương 3.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm cho ra cái tiến trình</span><span class="lc-sub">Bài chấm điểm: xác định cái gì đang giữ một cổng, cái gì ngốn nhiều bộ nhớ nhất, tiến trình nào giữ một file đã xoá, và tiến trình cha nào đang rò xác sống.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đọc cột <code>TIME</code> trong <code>ps aux</code> như thời gian sống. Một tiến trình hiện <code>0:31</code> đã tiêu 31 giây <em>CPU</em>, mà quãng đó có thể trải suốt ba tháng theo đồng hồ. Ngược lại một tiến trình khởi động mười giây trước vẫn có thể hiện <code>0:38</code> nếu nó chạy trên bốn nhân. Muốn biết "cái này lên được bao lâu rồi", hãy dùng <code>ps -o etime= -p &lt;pid&gt;</code> hoặc <code>ps -eo pid,etime,cmd</code>. Lẫn lộn hai cột là cách người ta kết luận một daemon khoẻ mạnh đang quay cuồng.</div>
<p class="note-ct"><strong>Ba lệnh nên giữ:</strong> <code>ps aux --sort=-%cpu | head</code> cho câu "cái gì đang ăn cái máy này", <code>pgrep -a &lt;tên&gt;</code> cho câu "nó có chạy không và chạy với tham số gì", và <code>sudo ss -tulpn</code> cho câu "cái gì đang nằm trên cổng đó". Ba cái đó trả lời được phần lớn câu hỏi về tiến trình mà không cần mở một công cụ tương tác — điều đó quan trọng khi bạn đang ở trên một đường SSH chậm, và còn quan trọng hơn khi bạn muốn có câu trả lời ngay trong một script.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Watching a live system: top, load average and memory|||5.2 — Nhìn một hệ thống đang chạy: top, tải trung bình và bộ nhớ',
      slug: 'lnx-5-2-top-tai-bo-nho',
      type: 'LESSON',
      description: 'Đọc top và htop cho đúng, tải trung bình thật ra đo cái gì (và vì sao nó không phải phần trăm), cột CPU wa/st, vì sao "free" gần bằng 0 là chuyện BÌNH THƯỜNG, và OOM killer.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Watching a live system</h2>
<p class="lead">Two numbers on a Linux server are almost universally misread: the load average, and free memory. Both look alarming when the machine is healthy and calm when it is not. This lesson is how to read them correctly — which is most of what "is this server in trouble?" actually requires.</p>

<h3>top: the standard view</h3>
${slide('lx-05', 9, 'top: năm dòng đầu là sức khoẻ của máy')}
<pre><code>top</code></pre>
<div class="out">top - 12:41:03 up 41 days,  3:12,  2 users,  load average: 0.94, 1.20, 1.31
Tasks: 214 total,   1 running, 213 sleeping,   0 stopped,   0 zombie
%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 93.9 id,  0.7 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :   7938.4 total,    182.6 free,   2104.9 used,   5650.9 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5488.1 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  901 postgres  20   0 1284916 412308  98244 S   8.3   5.1  14:21.09 postgres
 5012 deploy    20   0 1104228 298104  41208 S   2.7   3.7   4:02.71 node</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Keys inside top</span><span class="v"><code>M</code> sort by memory · <code>P</code> by CPU · <code>1</code> show each core separately · <code>c</code> full command line · <code>u</code> filter by user · <code>k</code> kill a PID · <code>h</code> help · <code>q</code> quit.</span></div>
  <div class="kv"><span class="k">Non-interactive</span><span class="v"><code>top -bn1</code> prints one snapshot and exits — the form you use in a script or over a slow link. <code>top -bn1 | head -12</code> is a fine health check.</span></div>
</div>
<div class="callout ok"><code>htop</code> is the same information with colour, mouse support, per-core bars and a searchable tree view (<code>F5</code>). Install it (<code>apt install htop</code>) and use it interactively; keep <code>top -bn1</code> for scripts, because it is always present.</div>

<h3>Load average: not a percentage</h3>
${slide('lx-05', 10, 'Load average là hàng đợi — chia cho nproc')}
<pre><code class="language-bash">uptime
cat /proc/loadavg
nproc</code></pre>
<div class="out"> 12:41:03 up 41 days,  3:12,  2 users,  load average: 0.94, 1.20, 1.31
0.94 1.20 1.31 2/214 5219
4</div>
<p>The three numbers are averages over <strong>1, 5 and 15 minutes</strong> of the number of processes that are either <em>running</em> or <em>waiting to run</em> — plus, on Linux uniquely, processes in uninterruptible sleep (state <code>D</code>, waiting on disk). It is a count of demand, not a percentage of capacity, and it has no upper bound.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">load 1.0 on 1 core</span><span class="lz-t">exactly saturated</span><span class="lz-d">One process always wants the CPU and gets it. Nothing is queued. This is 100% utilised and perfectly healthy.</span></div>
  <div class="lz-step"><span class="lz-k">load 4.0 on 4 cores</span><span class="lz-t">also exactly saturated</span><span class="lz-d">The same situation, four times over. A load of 4 on a 4-core box is NOT four times overloaded — it is fully used with nothing waiting.</span></div>
  <div class="lz-step"><span class="lz-k">load 8.0 on 4 cores</span><span class="lz-t">twice the demand as capacity</span><span class="lz-d">On average four processes are queued at all times. Everything is roughly twice as slow as it could be.</span></div>
  <div class="lz-step"><span class="lz-k">load 12 with 0% CPU</span><span class="lz-t">not a CPU problem at all</span><span class="lz-d">Those are D-state processes blocked on I/O. The disk, or a hung network mount, is the bottleneck — adding CPU would change nothing.</span></div>
</div>
<div class="callout"><strong>Always divide by <code>nproc</code>.</strong> "Load is 6" means nothing until you know whether the machine has 2 cores or 32. And the trend across the three numbers is often more useful than any one of them: <code>0.94 1.20 1.31</code> is a load that has been falling for a quarter of an hour, while <code>4.10 1.30 0.90</code> is something that started going wrong about a minute ago.</div>

<h3>The CPU line, and the two columns people skip</h3>
${slide('lx-05', 11, 'Dòng %Cpu: wa và st, cùng nice/renice')}
<pre><code>%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 93.9 id,  0.7 wa,  0.0 hi,  0.1 si,  0.0 st</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>us</code> user</span><span class="v">Running your application code. Where you want the time to go.</span></div>
  <div class="kv"><span class="k"><code>sy</code> system</span><span class="v">Inside kernel calls. Consistently high <code>sy</code> suggests heavy syscall traffic — often too many small reads/writes, or context-switch churn.</span></div>
  <div class="kv"><span class="k"><code>id</code> idle</span><span class="v">Doing nothing. High idle plus a high load average means the load is I/O, not CPU.</span></div>
  <div class="kv"><span class="k"><code>wa</code> iowait</span><span class="v"><strong>Waiting for disk.</strong> Above ~10% sustained, storage is your bottleneck. This is the column that explains "the CPU is idle but everything is slow".</span></div>
  <div class="kv"><span class="k"><code>st</code> steal</span><span class="v"><strong>Your VM asked for CPU and the hypervisor gave it to someone else.</strong> Nonzero <code>st</code> on a VPS means you are being throttled or the host is oversubscribed. You cannot fix it from inside — it is a message to your provider.</span></div>
</div>
<div class="callout warn"><code>wa</code> and <code>st</code> are the two most valuable numbers on that line and the two people never look at. A server where everything feels slow, CPU shows 90% idle, and <code>wa</code> sits at 40% is not underused — it is waiting on a disk that cannot keep up, and no amount of application optimisation will help. Chapter 12 covers the follow-up (<code>iostat -x 1</code>, <code>iotop</code>).</div>

<h3>nice and renice: asking to go last</h3>
<p>The <code>ni</code> column and top's <code>NI</code> column are the <em>niceness</em> of a process: a number from <strong>-20</strong> (greediest, scheduled first) to <strong>19</strong> (most polite). Everything starts at 0. A higher number does not slow a process down on an idle machine — it only decides who yields when several processes want the CPU at once, which is exactly what you want for a backup or a log compression running next to a live website.</p>
<pre><code>nice -n 10 sleep 600 &amp;                <span class="tok-comment"># start with niceness 10</span>
ps -o pid,ni,stat,cmd -p \$!
renice -n 15 -p 3580                  <span class="tok-comment"># make a running process even nicer</span>
renice -n 5 -p 3580                   <span class="tok-comment"># try to take it back</span></code></pre>
<div class="out">    PID  NI STAT CMD
   3580  10 SN   sleep 600
3580 (process ID) old priority 10, new priority 15
renice: failed to set priority for 3580 (process ID): Permission denied</div>
<p>Two details are visible in that real output. The <code>N</code> in <code>SN</code> is the "low priority" flag from Lesson 5.1's STAT table. And an ordinary user may only move <em>towards</em> 19: lowering your own niceness again, or going below 0, needs root (<code>sudo renice -n -5 -p 3580</code>). In <code>top</code>, press <code>r</code> and type a PID to do the same thing interactively. For disk-heavy jobs, <code>ionice -c3</code> is the I/O equivalent — it matters when <code>wa</code>, not <code>us</code>, is the problem.</p>
<h3>Memory: why "free" is almost zero, and that is correct</h3>
${slide('lx-05', 12, 'free: đọc available, không đọc free')}
<pre><code>free -h</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:            7.8Gi       2.1Gi       182Mi        68Mi       5.5Gi       5.4Gi
Swap:           2.0Gi          0B       2.0Gi</div>
<p>Only 182 MiB free out of 7.8 GiB looks like a machine about to die. It is not. Linux uses every otherwise-idle byte as disk cache, because unused RAM is wasted RAM — and that cache is instantly reclaimable the moment a program asks for memory.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">used</span><span class="lz-lnote">Actually held by processes. This is the number that matters.</span></div>
  <div class="lz-layer"><span class="lz-lname">buff/cache</span><span class="lz-lnote">Cached file contents and metadata. Looks "used", is really "borrowed" — handed back on demand.</span></div>
  <div class="lz-layer"><span class="lz-lname">free</span><span class="lz-lnote">Never touched. On a long-running server this trends to near zero and that is <strong>healthy</strong>.</span></div>
  <div class="lz-layer"><span class="lz-lname">available</span><span class="lz-lnote"><strong>The one to read.</strong> An estimate of what a new program could get without swapping — free plus reclaimable cache. Here: 5.4 GiB, i.e. plenty.</span></div>
</div>
<div class="callout ok">The rule: <strong>ignore <code>free</code>, read <code>available</code>.</strong> A monitoring alert built on "free memory below 10%" will page you every day on a perfectly healthy machine and stay silent when one is genuinely about to be killed. Build alerts on <code>available</code> and on swap activity instead.</div>

<h3>Swap: the number that actually predicts trouble</h3>
<pre><code>free -h | grep Swap
vmstat 1 5</code></pre>
<div class="out">Swap:           2.0Gi        1.2Gi       800Mi

procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  1 1258291 187364  41208 512044  412  680  1840  2210 4021 8210 12  8 42 38  0</div>
<p>Swap being <em>used</em> is not itself a problem — pages that nothing has touched for hours are better off on disk. Swap being <em>actively traded</em> is. The <code>si</code> and <code>so</code> columns of <code>vmstat</code> are swap-in and swap-out per second; sustained nonzero values mean the machine is thrashing, and you can see it here alongside 38% iowait. That combination is the signature of a machine with too little RAM for its workload, and it is far more predictive than any memory percentage.</p>

<h3>The OOM killer</h3>
${slide('lx-05', 13, 'OOM killer: SIGKILL và mã 137, dựng thật')}
<pre><code class="language-bash">sudo dmesg -T | grep -i 'killed process'
sudo journalctl -k | grep -i oom | tail -5</code></pre>
<div class="out">[Fri Aug 22 03:14:52 2026] Out of memory: Killed process 5012 (node)
  total-vm:4210488kB, anon-rss:3841204kB, file-rss:0kB, oom_score_adj:0</div>
<p>When memory truly runs out, the kernel picks a process and kills it — instantly, with <code>SIGKILL</code>, no cleanup and no chance to save anything. It chooses roughly by "largest recent memory consumer", which usually means your application rather than the leak's real cause.</p>
<div class="callout warn">This is the explanation for the most baffling class of production incident: <strong>a service that vanishes with no error in its own logs.</strong> The application did not crash — it was executed. Its log ends mid-sentence because it received no warning. <code>dmesg -T | grep -i 'killed process'</code> takes five seconds and is the first thing to check when a process "disappeared". You met the same mechanism in this project's own history: a parallel Docker build on a 6 GB VPS was OOM-killed and showed up only as <code>Exited(137)</code> — and 137 is exactly 128 + 9, i.e. killed by signal 9.</div>

<h3>Reproducing an OOM kill in 64 MB</h3>
<p>You can watch the kernel do this safely inside a container with a memory ceiling. <code>tail -n 1</code> keeps the whole current line in memory until it sees a newline, and <code>/dev/zero</code> never sends one — so it grows until the cgroup limit is hit:</p>
<pre><code class="language-bash">docker run --name lx05-oom --memory 64m --memory-swap 64m ubuntu:24.04 bash -c \\
  'echo "bắt đầu ăn RAM"; head -c 300M /dev/zero | tail -n 1 &gt;/dev/null'
echo \$?
docker inspect -f '{{.State.OOMKilled}}' lx05-oom</code></pre>
<div class="out">bắt đầu ăn RAM
bash: line 1:     6 Broken pipe             head -c 300M /dev/zero
         7 Killed                  | tail -n 1 &gt; /dev/null
137
true</div>
<p>The only words the victim "said" are <code>Killed</code> — printed by the <em>shell</em>, not by <code>tail</code>, which never got a chance to say anything. <code>head</code> then died of <code>Broken pipe</code> (Lesson 3.2) because its reader was gone, the pipeline's status became 137, and Docker records <code>OOMKilled=true</code>. Remove the container with <code>docker rm lx05-oom</code>.</p>
<h3>Per-process memory, honestly</h3>
<pre><code>ps -eo pid,user,rss,cmd --sort=-rss | head -6
sudo smem -tk -c 'pid user pss rss command' | tail -6</code></pre>
<div class="out">  PID USER       RSS CMD
  901 postgres 412308 postgres: primary
 5012 deploy   298104 node /srv/app/dist/index.js</div>
<p>Summing the <code>RSS</code> column overcounts badly, because shared libraries are counted once per process that maps them — add up RSS on a busy server and you will "find" more memory in use than the machine has. <code>smem</code>'s <code>PSS</code> (Proportional Set Size) divides each shared page among its users, so the column does sum correctly. It is not installed by default; on a machine where memory attribution matters, it is worth the <code>apt install smem</code>.</p>

<h3>ulimit: every process has ceilings</h3>
${slide('lx-05', 14, 'ulimit: trần mềm, trần cứng và Errno 24')}
<p>Memory is not the only thing a process can run out of. The kernel keeps per-process <strong>resource limits</strong> — how many files it may have open, how many processes its user may run, how big its stack may grow — and <code>ulimit</code> is the bash builtin that shows and sets them for the current shell and everything started from it. The one you will actually hit is <strong>open files</strong>, because on Linux a network connection is a file descriptor too: a Node or Postgres server with 1,000 clients needs 1,000+ descriptors.</p>
<pre><code>ulimit -n          <span class="tok-comment"># soft limit on open files</span>
ulimit -Hn         <span class="tok-comment"># hard limit</span></code></pre>
<div class="out">1024
524288</div>
<p>That is a Fedora 44 SSH session; Ubuntu servers are typically the same 1024. Every process has two numbers: the <strong>soft</strong> limit, which is enforced, and the <strong>hard</strong> limit, a ceiling the soft one may be raised to. An ordinary user may raise soft up to hard and may lower hard; only root may raise hard. Cross the soft limit and every <code>open()</code> fails with <code>EMFILE</code>, which programs print as <em>Too many open files</em>:</p>
<pre><code>( ulimit -n 16; python3 -c "
fs=[]
while True: fs.append(open('/etc/hostname'))" )
ulimit -Sn 1024; ulimit -Hn 4096; ulimit -Hn 8192</code></pre>
<div class="out">OSError: [Errno 24] Too many open files: '/etc/hostname'
bash: line 1: ulimit: open files: cannot modify limit: Operation not permitted</div>
<p>The parentheses matter: they run the experiment in a subshell (Lesson 3.3), so the limit of 16 dies with it. The second line lowers hard to 4096 and then tries to raise it again as a normal user — refused. (Try lowering hard <em>below</em> the current soft value and bash answers <code>Invalid argument</code> instead: lower soft first.)</p>
<table>
<tr><th>Flag</th><th>Limit</th><th>Example</th></tr>
<tr><td><code>-a</code></td><td>show everything</td><td><code>ulimit -a</code></td></tr>
<tr><td><code>-n</code></td><td>open file descriptors</td><td><code>ulimit -n 4096</code></td></tr>
<tr><td><code>-u</code></td><td>processes for this user (fork bombs stop here)</td><td><code>ulimit -u</code></td></tr>
<tr><td><code>-s</code></td><td>stack size in KB (8192 by default)</td><td><code>ulimit -s</code></td></tr>
<tr><td><code>-c</code></td><td>core dump size (0 = no core files)</td><td><code>ulimit -c unlimited</code></td></tr>
<tr><td><code>-S</code> / <code>-H</code></td><td>act on the soft / hard value</td><td><code>ulimit -Hn</code></td></tr>
</table>
<p>A running process keeps the limits it started with, so <code>ulimit</code> in your shell does nothing for a server that is already up. Read its real limits in <code>/proc/PID/limits</code>, and change them live with <code>prlimit</code>:</p>
<pre><code class="language-bash">grep "open files" /proc/2966/limits
prlimit --pid 2966 --nofile=2048:1048576
prlimit --pid 2966 --nofile
ls /proc/2966/fd | wc -l            <span class="tok-comment"># how many it has open right now</span></code></pre>
<div class="out">Max open files            1048576              1048576              files
RESOURCE DESCRIPTION              SOFT    HARD UNITS
NOFILE   max number of open files 2048 1048576 files
4</div>
<div class="callout warn"><strong>Where the fix really goes.</strong> A service started by systemd ignores your shell's <code>ulimit</code>; set <code>LimitNOFILE=65536</code> in its unit (Chapter 11). A container takes <code>docker run --ulimit nofile=256:512</code> or <code>ulimits:</code> in compose — and note that inside Docker the default is already 1048576, which is why the same app can fail on a bare VPS and work in a container. Before raising anything, check <code>ls /proc/PID/fd | wc -l</code> over a few minutes: a number that only ever grows is a descriptor leak, and a bigger limit only postpones the crash.</div>

<h3>Try it step by step</h3>
<p>Six read-only commands, in the order you would use them on a server you have never seen. Inside a container the numbers describe Docker's virtual machine, not the container, which is itself a useful lesson.</p>
<pre><code class="language-bash">nproc
cat /proc/loadavg
free -h
vmstat 1 3
ulimit -n; ulimit -Hn
grep -i "open files" /proc/\$\$/limits</code></pre>
<div class="out">10
0.16 0.17 0.20 1/707 3762
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.9Gi       1.8Gi        88Mi       3.3Gi       4.8Gi
Swap:          1.0Gi       427Mi       596Mi
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 0  0 437836 1907744 1358740 2067396    6    8    76   311 1131    1  0  0 99  0  0  0
 0  0 437836 1912196 1358740 2067396    0    0     0     0  823  801  0  0 100  0  0  0
 2  0 437836 1912196 1358740 2067396    0    0     0     0  626  578  0  0 99  0  0  0
1048576
1048576
Max open files            1048576              1048576              files</div>
<p>Read it as a diagnosis: load 0.16 on 10 CPUs is idle; 4.8 GiB <em>available</em> is plenty although only 1.8 GiB is "free"; 427 MiB of swap is <em>used</em> but <code>si</code>/<code>so</code> are 0 after the first line, so nothing is swapping now (the first <code>vmstat</code> line is an average since boot — always read from the second); and the open-files limit is Docker's generous default rather than a bare server's 1024. (Ubuntu 24.04 container on a Mac M1, 28/09/2026.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Question</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td>How many CPUs?</td><td><code>nproc</code></td><td><code>sysctl -n hw.ncpu</code> (no <code>nproc</code>)</td></tr>
<tr><td>Load average</td><td><code>uptime</code>, <code>/proc/loadavg</code></td><td><code>uptime</code>, <code>sysctl -n vm.loadavg</code> → <code>{ 236.23 247.99 265.92 }</code> on a 10-core Mac mid-Xcode-build</td></tr>
<tr><td>One snapshot of top</td><td><code>top -bn1</code></td><td><code>top -l 1</code> (first line: <code>Processes: 1730 total, 210 running…</code>)</td></tr>
<tr><td>Memory</td><td><code>free -h</code>, <code>vmstat</code></td><td>no <code>free</code>: <code>vm_stat</code>, <code>memory_pressure</code>, Activity Monitor → Memory</td></tr>
<tr><td>Open-file limit</td><td><code>ulimit -n</code> (1024 on a typical server)</td><td><code>ulimit -n</code> depends on how the shell was started; <code>launchctl limit maxfiles</code> shows launchd's <code>256 unlimited</code></td></tr>
</table>
<p>Under WSL2 the "machine" is a lightweight virtual machine: <code>free</code> and <code>nproc</code> describe what Windows has given that VM, not the whole PC.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group's API "randomly" dies at night with nothing in its log, and in the morning someone sees <code>Too many open files</code> in another service. Rehearse both diagnoses in a throwaway container (<code>docker run --rm -it --memory 128m ubuntu:24.04 bash</code>, then <code>apt-get update &amp;&amp; apt-get install -y procps python3</code>).</p><ol>
<li>Take the 30-second triage: <code>nproc</code>, <code>cat /proc/loadavg</code>, <code>free -h</code>, <code>vmstat 1 3</code>. Write one sentence: CPU-bound, I/O-bound, short on memory, or idle?</li>
<li>Start a polite background job with <code>nice -n 15 sleep 900 &amp;</code> and confirm <code>NI</code> and the <code>N</code> flag with <code>ps -o pid,ni,stat,cmd -p \$!</code>.</li>
<li>In a subshell, set <code>ulimit -n 16</code> and make Python open files until it fails; note the errno.</li>
<li>Read <code>/proc/\$\$/limits</code>, then use <code>prlimit --pid \$\$ --nofile=512:1024</code> on your own shell and read it again.</li></ol>
<p><strong>Done when:</strong> your triage sentence cites three real numbers, <code>ps</code> shows <code>NI 15</code> with <code>SN</code>, Python prints <code>[Errno 24] Too many open files</code>, and <code>/proc/\$\$/limits</code> shows <code>512</code> / <code>1024</code> on the "Max open files" line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load average</span><span class="v">Average number of tasks running or waiting (including D-state) over 1, 5 and 15 minutes.</span></div>
  <div class="kv"><span class="k">iowait (wa) / steal (st)</span><span class="v">CPU idle while waiting for disk · CPU taken away by the hypervisor.</span></div>
  <div class="kv"><span class="k">Niceness</span><span class="v">Scheduling politeness from -20 to 19; higher yields the CPU to others.</span></div>
  <div class="kv"><span class="k">Available memory</span><span class="v">What a new program could get without swapping: free plus reclaimable cache.</span></div>
  <div class="kv"><span class="k">Swap-in / swap-out (si/so)</span><span class="v">Pages moving between RAM and disk; sustained non-zero means thrashing.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel's last resort: it picks a process and SIGKILLs it when memory runs out.</span></div>
  <div class="kv"><span class="k">Resource limit (soft / hard)</span><span class="v">A per-process ceiling; soft is enforced, hard is how far soft may be raised.</span></div>
  <div class="kv"><span class="k">File descriptor limit (nofile)</span><span class="v">Maximum open files and sockets; exceeding it gives <code>Too many open files</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five lines of <code>top</code> answer most "is this server OK?" questions — read them before the process list.</li>
<li>Load average counts a queue, not a percentage: divide by <code>nproc</code> and read the trend across the three numbers.</li>
<li><code>wa</code> means the disk is the bottleneck, <code>st</code> means your provider is; neither is fixed by optimising code.</li>
<li><code>nice</code>/<code>renice</code> let background work yield; only root can raise priority back.</li>
<li>Read <code>available</code>, not <code>free</code>; a service that vanishes with exit 137 was probably OOM-killed — check <code>dmesg</code>.</li>
<li><code>ulimit -n</code> caps open files per process; fix it where the service starts (<code>LimitNOFILE=</code>, <code>--ulimit</code>) and check for leaks first.</li>
</ul>

<a class="link-card" href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — Linux Load Averages: Solving the Mystery</span><span class="lc-sub">Traces why Linux counts D-state processes in the load, with the original 1993 patch. The definitive answer to "what does load average actually mean".</span></span>
</a>
<a class="link-card" href="https://www.linuxatemyram.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Linux ate my RAM!</span><span class="lc-sub">One short page explaining the buff/cache confusion better than any manual. Send it to anyone who panics about free memory.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Linux Performance Analysis in 60 Seconds</span><span class="lc-sub">Netflix's checklist: ten commands, in order, to triage an unfamiliar server. Chapter 12 builds on exactly this.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read four sick servers</span><span class="lc-sub">Four <code>top</code> snapshots — CPU-bound, I/O-bound, memory-starved, and stolen CPU. Diagnose each from the numbers alone.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> comparing load average across machines without dividing by core count, or treating it as a percentage. "Load 8" is a crisis on a 2-core VPS and a quiet afternoon on a 32-core server. Worse, a load of 12 with 95% idle CPU is not a CPU problem at all — it is disk wait, and every "optimisation" applied to the application will change nothing. Read load, <code>nproc</code>, and the <code>wa</code> column together or not at all.</div>
<p class="note-ct"><strong>The 30-second triage:</strong> <code>uptime</code> (load, and its trend), <code>nproc</code> (what that load means), <code>top -bn1 | head -5</code> (where the time goes — watch <code>wa</code> and <code>st</code>), <code>free -h</code> (read <code>available</code>, not <code>free</code>), and <code>dmesg -T | tail</code> (did the kernel kill something). Five commands, and they separate "CPU-bound", "I/O-bound", "out of memory" and "throttled by the host" — which are four completely different fixes.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Nhìn một hệ thống đang chạy</h2>
<p class="lead">Hai con số trên một máy chủ Linux gần như luôn bị đọc sai: tải trung bình, và bộ nhớ còn trống. Cả hai đều trông đáng báo động khi máy đang khoẻ, và trông bình yên khi máy thì không. Bài này dạy cách đọc chúng cho đúng — và đó cũng chính là phần lớn những gì câu hỏi "máy chủ này có đang gặp chuyện không?" thật sự cần.</p>

<h3>top: khung nhìn chuẩn</h3>
${slide('lx-05', 9, 'top: năm dòng đầu là sức khoẻ của máy')}
<pre><code>top</code></pre>
<div class="out">top - 12:41:03 up 41 days,  3:12,  2 users,  load average: 0.94, 1.20, 1.31
Tasks: 214 total,   1 running, 213 sleeping,   0 stopped,   0 zombie
%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 93.9 id,  0.7 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :   7938.4 total,    182.6 free,   2104.9 used,   5650.9 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5488.1 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  901 postgres  20   0 1284916 412308  98244 S   8.3   5.1  14:21.09 postgres
 5012 deploy    20   0 1104228 298104  41208 S   2.7   3.7   4:02.71 node</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Phím bên trong top</span><span class="v"><code>M</code> sắp theo bộ nhớ · <code>P</code> theo CPU · <code>1</code> hiện từng nhân riêng · <code>c</code> hiện đầy đủ dòng lệnh · <code>u</code> lọc theo người dùng · <code>k</code> giết một PID · <code>h</code> trợ giúp · <code>q</code> thoát.</span></div>
  <div class="kv"><span class="k">Không tương tác</span><span class="v"><code>top -bn1</code> in ra một lát cắt rồi thoát — dạng bạn dùng trong script hoặc trên một đường truyền chậm. <code>top -bn1 | head -12</code> là một phép kiểm sức khoẻ tốt.</span></div>
</div>
<div class="callout ok"><code>htop</code> là cùng chừng đó thông tin nhưng có màu, dùng được chuột, có thanh cho từng nhân và một khung nhìn dạng cây tìm kiếm được (<code>F5</code>). Hãy cài nó (<code>apt install htop</code>) và dùng khi làm việc tương tác; giữ <code>top -bn1</code> cho script, vì nó luôn có sẵn.</div>

<h3>Tải trung bình: KHÔNG phải phần trăm</h3>
${slide('lx-05', 10, 'Load average là hàng đợi — chia cho nproc')}
<pre><code class="language-bash">uptime
cat /proc/loadavg
nproc</code></pre>
<div class="out"> 12:41:03 up 41 days,  3:12,  2 users,  load average: 0.94, 1.20, 1.31
0.94 1.20 1.31 2/214 5219
4</div>
<p>Ba con số đó là trung bình trong <strong>1, 5 và 15 phút</strong> của SỐ LƯỢNG tiến trình đang <em>CHẠY</em> hoặc <em>CHỜ ĐƯỢC CHẠY</em> — cộng thêm, và đây là điểm riêng của Linux, những tiến trình đang ngủ không ngắt được (trạng thái <code>D</code>, chờ đĩa). Nó là một phép ĐẾM NHU CẦU, không phải phần trăm của năng lực, và nó không có trần trên.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">tải 1,0 trên 1 nhân</span><span class="lz-t">bão hoà vừa khít</span><span class="lz-d">Luôn có một tiến trình muốn CPU và nó được CPU. Không có gì phải xếp hàng. Đây là 100% công suất và hoàn toàn khoẻ mạnh.</span></div>
  <div class="lz-step"><span class="lz-k">tải 4,0 trên 4 nhân</span><span class="lz-t">cũng bão hoà vừa khít</span><span class="lz-d">Y hệt tình huống trên, nhân lên bốn lần. Tải 4 trên máy 4 nhân KHÔNG PHẢI là quá tải gấp bốn — đó là dùng hết công suất mà không ai phải chờ.</span></div>
  <div class="lz-step"><span class="lz-k">tải 8,0 trên 4 nhân</span><span class="lz-t">nhu cầu gấp đôi năng lực</span><span class="lz-d">Trung bình lúc nào cũng có bốn tiến trình đang xếp hàng. Mọi thứ chậm đi khoảng gấp đôi so với mức nó có thể đạt.</span></div>
  <div class="lz-step"><span class="lz-k">tải 12 mà CPU 0%</span><span class="lz-t">hoàn toàn không phải chuyện CPU</span><span class="lz-d">Đó là những tiến trình trạng thái D đang bị chặn vì I/O. Đĩa, hoặc một mount mạng đã treo, mới là nút thắt cổ chai — thêm CPU vào chẳng thay đổi được gì.</span></div>
</div>
<div class="callout"><strong>Luôn chia cho <code>nproc</code>.</strong> Câu "tải đang là 6" chẳng có nghĩa gì cho tới khi bạn biết máy có 2 nhân hay 32 nhân. Và XU HƯỚNG qua ba con số thường hữu ích hơn bất kỳ con số đơn lẻ nào: <code>0,94 1,20 1,31</code> là một cái tải đã giảm suốt mười lăm phút, còn <code>4,10 1,30 0,90</code> là một chuyện gì đó vừa bắt đầu hỏng khoảng một phút trước.</div>

<h3>Dòng CPU, và hai cột người ta hay bỏ qua</h3>
${slide('lx-05', 11, 'Dòng %Cpu: wa và st, cùng nice/renice')}
<pre><code>%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 93.9 id,  0.7 wa,  0.0 hi,  0.1 si,  0.0 st</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>us</code> user</span><span class="v">Đang chạy mã ứng dụng của bạn. Chỗ mà bạn MUỐN thời gian đổ vào.</span></div>
  <div class="kv"><span class="k"><code>sy</code> system</span><span class="v">Bên trong các lời gọi của nhân. <code>sy</code> cao dai dẳng gợi ý lưu lượng lời gọi hệ thống lớn — thường là quá nhiều lần đọc/ghi vụn, hoặc chuyển ngữ cảnh liên tục.</span></div>
  <div class="kv"><span class="k"><code>id</code> idle</span><span class="v">Đang không làm gì. Idle cao mà tải trung bình cũng cao nghĩa là tải đến từ I/O, không phải CPU.</span></div>
  <div class="kv"><span class="k"><code>wa</code> iowait</span><span class="v"><strong>Đang chờ đĩa.</strong> Duy trì trên khoảng 10% thì lưu trữ chính là nút thắt của bạn. Đây là cột giải thích câu "CPU rỗi mà mọi thứ vẫn chậm".</span></div>
  <div class="kv"><span class="k"><code>st</code> steal</span><span class="v"><strong>Máy ảo của bạn xin CPU và trình siêu giám sát đem nó cho người khác.</strong> <code>st</code> khác 0 trên một VPS nghĩa là bạn đang bị bóp, hoặc máy chủ vật lý bị bán quá tay. Bạn không chữa được từ bên trong — đó là một thông điệp gửi cho nhà cung cấp.</span></div>
</div>
<div class="callout warn"><code>wa</code> và <code>st</code> là hai con số giá trị nhất trên dòng đó và cũng là hai con số người ta không bao giờ nhìn. Một máy chủ mà mọi thứ đều ì ạch, CPU hiện 90% rỗi, còn <code>wa</code> nằm ở 40% thì không hề đang bị dùng thiếu — nó đang chờ một cái đĩa không theo kịp, và mọi phép tối ưu ứng dụng đều vô ích. Chương 12 nói về bước tiếp theo (<code>iostat -x 1</code>, <code>iotop</code>).</div>

<h3>nice và renice: xin được đi sau</h3>
<p>Cột <code>ni</code> trên dòng CPU và cột <code>NI</code> trong top là <em>độ nhã nhặn</em> (niceness) của một tiến trình: một con số từ <strong>-20</strong> (tham nhất, được chia CPU trước) tới <strong>19</strong> (lịch sự nhất). Mọi thứ khởi đầu ở 0. Con số cao hơn KHÔNG làm tiến trình chậm đi trên một máy đang rảnh — nó chỉ quyết định ai nhường khi nhiều tiến trình cùng muốn CPU một lúc, và đó đúng là thứ bạn cần cho một bản sao lưu hay một lần nén log chạy song song với trang web đang phục vụ người dùng.</p>
<pre><code>nice -n 10 sleep 600 &amp;                <span class="tok-comment"># khởi động với độ nhã nhặn 10</span>
ps -o pid,ni,stat,cmd -p \$!
renice -n 15 -p 3580                  <span class="tok-comment"># làm một tiến trình đang chạy nhã nhặn hơn nữa</span>
renice -n 5 -p 3580                   <span class="tok-comment"># thử lấy lại ưu tiên</span></code></pre>
<div class="out">    PID  NI STAT CMD
   3580  10 SN   sleep 600
3580 (process ID) old priority 10, new priority 15
renice: failed to set priority for 3580 (process ID): Permission denied</div>
<p>Output thật đó cho thấy hai điều. Chữ <code>N</code> trong <code>SN</code> chính là cờ "ưu tiên thấp" ở bảng STAT của Bài 5.1. Và một người dùng thường chỉ được đi <em>VỀ PHÍA</em> 19: hạ độ nhã nhặn của chính mình xuống lại, hay xuống dưới 0, phải cần root (<code>sudo renice -n -5 -p 3580</code>). Trong <code>top</code>, bấm <code>r</code> rồi gõ PID để làm y hệt theo kiểu tương tác. Với việc nặng về đĩa, <code>ionice -c3</code> là phiên bản dành cho I/O — nó có ý nghĩa khi thủ phạm là <code>wa</code> chứ không phải <code>us</code>.</p>
<h3>Bộ nhớ: vì sao "free" gần bằng 0, và đó là ĐÚNG</h3>
${slide('lx-05', 12, 'free: đọc available, không đọc free')}
<pre><code>free -h</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:            7.8Gi       2.1Gi       182Mi        68Mi       5.5Gi       5.4Gi
Swap:           2.0Gi          0B       2.0Gi</div>
<p>Chỉ còn 182 MiB trống trong 7,8 GiB trông như một cái máy sắp chết. Không phải vậy. Linux dùng mọi byte nhàn rỗi làm bộ nhớ đệm cho đĩa, vì RAM không dùng là RAM lãng phí — và cái đệm đó thu hồi được ngay tức khắc vào khoảnh khắc một chương trình xin bộ nhớ.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">used</span><span class="lz-lnote">Thật sự đang bị các tiến trình giữ. Đây là con số có ý nghĩa.</span></div>
  <div class="lz-layer"><span class="lz-lname">buff/cache</span><span class="lz-lnote">Nội dung file và siêu dữ liệu được đệm lại. TRÔNG như "đã dùng", thật ra là "đang mượn" — trả lại ngay khi có người cần.</span></div>
  <div class="lz-layer"><span class="lz-lname">free</span><span class="lz-lnote">Chưa hề bị chạm tới. Trên một máy chủ chạy lâu, con số này dần về gần 0 và đó là chuyện <strong>KHOẺ MẠNH</strong>.</span></div>
  <div class="lz-layer"><span class="lz-lname">available</span><span class="lz-lnote"><strong>Con số cần đọc.</strong> Ước lượng phần mà một chương trình mới có thể lấy được mà không phải tráo ra swap — free cộng phần đệm thu hồi được. Ở đây: 5,4 GiB, tức là dư dả.</span></div>
</div>
<div class="callout ok">Quy tắc: <strong>bỏ qua <code>free</code>, đọc <code>available</code>.</strong> Một cảnh báo giám sát dựng trên "bộ nhớ trống dưới 10%" sẽ gọi bạn dậy mỗi ngày trên một cái máy hoàn toàn khoẻ mạnh, và sẽ im lặng đúng lúc một cái máy sắp bị giết thật. Hãy dựng cảnh báo trên <code>available</code> và trên hoạt động của swap.</div>

<h3>Swap: con số thật sự dự báo được rắc rối</h3>
<pre><code>free -h | grep Swap
vmstat 1 5</code></pre>
<div class="out">Swap:           2.0Gi        1.2Gi       800Mi

procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  1 1258291 187364  41208 512044  412  680  1840  2210 4021 8210 12  8 42 38  0</div>
<p>Swap ĐANG ĐƯỢC DÙNG tự nó không phải vấn đề — những trang bộ nhớ mà hàng giờ rồi không ai chạm tới thì nằm trên đĩa còn tốt hơn. Swap đang bị TRAO ĐỔI QUA LẠI LIÊN TỤC mới là vấn đề. Hai cột <code>si</code> và <code>so</code> của <code>vmstat</code> là số lần tráo vào và tráo ra mỗi giây; giá trị khác 0 kéo dài nghĩa là máy đang giãy giụa, và bạn thấy nó ở đây đi kèm 38% iowait. Tổ hợp đó là dấu hiệu của một cái máy có quá ít RAM so với khối lượng việc của nó, và nó dự báo tốt hơn nhiều so với bất kỳ tỉ lệ phần trăm bộ nhớ nào.</p>

<h3>OOM killer</h3>
${slide('lx-05', 13, 'OOM killer: SIGKILL và mã 137, dựng thật')}
<pre><code class="language-bash">sudo dmesg -T | grep -i 'killed process'
sudo journalctl -k | grep -i oom | tail -5</code></pre>
<div class="out">[Fri Aug 22 03:14:52 2026] Out of memory: Killed process 5012 (node)
  total-vm:4210488kB, anon-rss:3841204kB, file-rss:0kB, oom_score_adj:0</div>
<p>Khi bộ nhớ thật sự cạn, nhân chọn ra một tiến trình và giết nó — ngay lập tức, bằng <code>SIGKILL</code>, không dọn dẹp và không có cơ hội lưu lại gì. Nó chọn đại khái theo tiêu chí "kẻ tiêu bộ nhớ nhiều nhất gần đây", và điều đó thường nghĩa là ứng dụng của bạn chứ không phải nguyên nhân thật của chỗ rò rỉ.</p>
<div class="callout warn">Đây là lời giải thích cho loại sự cố production khó hiểu nhất: <strong>một dịch vụ biến mất mà không để lại lỗi nào trong log của chính nó.</strong> Ứng dụng KHÔNG sập — nó bị hành quyết. Log của nó kết thúc giữa câu vì nó không hề nhận được cảnh báo nào. Lệnh <code>dmesg -T | grep -i 'killed process'</code> mất năm giây và là thứ đầu tiên cần kiểm khi một tiến trình "biến mất". Bạn đã gặp đúng cơ chế này ngay trong lịch sử của chính dự án này: một lần dựng Docker song song trên VPS 6 GB bị OOM giết và chỉ hiện ra dưới dạng <code>Exited(137)</code> — mà 137 chính là 128 + 9, tức là bị giết bởi tín hiệu số 9.</div>

<h3>Dựng lại một vụ OOM trong 64 MB</h3>
<p>Bạn có thể xem nhân làm việc này một cách an toàn bên trong một container có trần bộ nhớ. <code>tail -n 1</code> giữ nguyên dòng hiện tại trong bộ nhớ cho tới khi gặp ký tự xuống dòng, mà <code>/dev/zero</code> thì không bao giờ gửi ký tự đó — nên nó phình mãi cho tới khi chạm trần của cgroup (nhóm kiểm soát tài nguyên):</p>
<pre><code class="language-bash">docker run --name lx05-oom --memory 64m --memory-swap 64m ubuntu:24.04 bash -c \\
  'echo "bắt đầu ăn RAM"; head -c 300M /dev/zero | tail -n 1 &gt;/dev/null'
echo \$?
docker inspect -f '{{.State.OOMKilled}}' lx05-oom</code></pre>
<div class="out">bắt đầu ăn RAM
bash: line 1:     6 Broken pipe             head -c 300M /dev/zero
         7 Killed                  | tail -n 1 &gt; /dev/null
137
true</div>
<p>Chữ duy nhất nạn nhân "nói" được là <code>Killed</code> — mà chữ đó do <em>SHELL</em> in ra, không phải <code>tail</code>, thứ chẳng kịp nói gì. Sau đó <code>head</code> chết vì <code>Broken pipe</code> (Bài 3.2) do người đọc của nó đã mất, trạng thái của cả ống thành 137, và Docker ghi lại <code>OOMKilled=true</code>. Dọn container bằng <code>docker rm lx05-oom</code>.</p>
<h3>Bộ nhớ theo từng tiến trình, một cách trung thực</h3>
<pre><code>ps -eo pid,user,rss,cmd --sort=-rss | head -6
sudo smem -tk -c 'pid user pss rss command' | tail -6</code></pre>
<div class="out">  PID USER       RSS CMD
  901 postgres 412308 postgres: primary
 5012 deploy   298104 node /srv/app/dist/index.js</div>
<p>Cộng dồn cột <code>RSS</code> sẽ đếm thừa rất nhiều, vì thư viện dùng chung bị tính một lần cho MỖI tiến trình có ánh xạ nó — cộng RSS trên một máy chủ bận thì bạn sẽ "tìm thấy" nhiều bộ nhớ đang dùng hơn cả dung lượng máy có. Cột <code>PSS</code> (Proportional Set Size) của <code>smem</code> chia mỗi trang dùng chung cho những kẻ đang dùng nó, nên cột đó cộng lại thì đúng. Nó không có sẵn; trên một cái máy mà việc quy trách nhiệm bộ nhớ là quan trọng, <code>apt install smem</code> rất đáng.</p>

<h3>ulimit: mỗi tiến trình đều có trần</h3>
${slide('lx-05', 14, 'ulimit: trần mềm, trần cứng và Errno 24')}
<p>Bộ nhớ không phải thứ duy nhất một tiến trình có thể cạn. Nhân giữ những <strong>giới hạn tài nguyên</strong> (resource limit) cho từng tiến trình — được mở bao nhiêu file, người dùng của nó được chạy bao nhiêu tiến trình, ngăn xếp (stack) được phình tới đâu — và <code>ulimit</code> là lệnh dựng sẵn của bash để xem và đặt các giới hạn đó cho shell hiện tại cùng mọi thứ khởi động từ nó. Cái bạn sẽ thật sự đụng phải là <strong>số file đang mở</strong>, vì trên Linux mỗi kết nối mạng cũng là một bộ mô tả file: một server Node hay Postgres phục vụ 1.000 khách cần hơn 1.000 bộ mô tả.</p>
<pre><code>ulimit -n          <span class="tok-comment"># trần MỀM số file mở</span>
ulimit -Hn         <span class="tok-comment"># trần CỨNG</span></code></pre>
<div class="out">1024
524288</div>
<p>Đó là một phiên SSH vào Fedora 44; máy chủ Ubuntu thường cũng là 1024. Mỗi tiến trình có hai con số: trần <strong>mềm</strong> (soft), cái bị áp dụng thật, và trần <strong>cứng</strong> (hard), mức tối đa mà trần mềm được nâng tới. Người dùng thường được nâng mềm lên tới cứng và được hạ cứng xuống; chỉ root mới nâng được trần cứng. Vượt trần mềm là mọi lệnh <code>open()</code> thất bại với mã <code>EMFILE</code>, mà chương trình in ra thành <em>Too many open files</em> (quá nhiều file đang mở):</p>
<pre><code>( ulimit -n 16; python3 -c "
fs=[]
while True: fs.append(open('/etc/hostname'))" )
ulimit -Sn 1024; ulimit -Hn 4096; ulimit -Hn 8192</code></pre>
<div class="out">OSError: [Errno 24] Too many open files: '/etc/hostname'
bash: line 1: ulimit: open files: cannot modify limit: Operation not permitted</div>
<p>Cặp ngoặc tròn quan trọng: nó chạy thí nghiệm trong một subshell (shell con — Bài 3.3), nên cái trần 16 chết theo subshell. Dòng thứ hai hạ trần cứng xuống 4096 rồi thử nâng lại với tư cách người thường — bị từ chối. (Thử hạ trần cứng xuống <em>DƯỚI</em> trần mềm hiện tại thì bash trả lời <code>Invalid argument</code>: phải hạ trần mềm trước.)</p>
<table>
<tr><th>Cờ</th><th>Giới hạn</th><th>Ví dụ</th></tr>
<tr><td><code>-a</code></td><td>xem tất cả</td><td><code>ulimit -a</code></td></tr>
<tr><td><code>-n</code></td><td>số bộ mô tả file đang mở</td><td><code>ulimit -n 4096</code></td></tr>
<tr><td><code>-u</code></td><td>số tiến trình của người dùng này (fork bomb dừng ở đây)</td><td><code>ulimit -u</code></td></tr>
<tr><td><code>-s</code></td><td>cỡ ngăn xếp tính bằng KB (mặc định 8192)</td><td><code>ulimit -s</code></td></tr>
<tr><td><code>-c</code></td><td>cỡ file core dump (0 = không ghi core)</td><td><code>ulimit -c unlimited</code></td></tr>
<tr><td><code>-S</code> / <code>-H</code></td><td>tác động lên trần mềm / cứng</td><td><code>ulimit -Hn</code></td></tr>
</table>
<p>Một tiến trình đang chạy giữ nguyên giới hạn nó mang theo lúc khởi động, nên gõ <code>ulimit</code> trong shell của bạn chẳng làm gì cho một server đã chạy sẵn. Đọc giới hạn thật của nó trong <code>/proc/PID/limits</code>, và đổi nóng bằng <code>prlimit</code>:</p>
<pre><code class="language-bash">grep "open files" /proc/2966/limits
prlimit --pid 2966 --nofile=2048:1048576
prlimit --pid 2966 --nofile
ls /proc/2966/fd | wc -l            <span class="tok-comment"># ngay lúc này nó đang mở bao nhiêu</span></code></pre>
<div class="out">Max open files            1048576              1048576              files
RESOURCE DESCRIPTION              SOFT    HARD UNITS
NOFILE   max number of open files 2048 1048576 files
4</div>
<div class="callout warn"><strong>Chỗ sửa thật sự nằm ở đâu.</strong> Một dịch vụ do systemd khởi động không đếm xỉa gì tới <code>ulimit</code> của shell bạn; hãy đặt <code>LimitNOFILE=65536</code> trong unit của nó (Chương 11). Container thì dùng <code>docker run --ulimit nofile=256:512</code> hoặc khoá <code>ulimits:</code> trong compose — và để ý rằng trong Docker mặc định đã là 1048576, nên cùng một ứng dụng có thể hỏng trên VPS trần mà chạy ngon trong container. Trước khi nâng bất cứ thứ gì, hãy kiểm <code>ls /proc/PID/fd | wc -l</code> trong vài phút: một con số chỉ tăng mà không bao giờ giảm là rò rỉ bộ mô tả file, và nâng trần chỉ hoãn cú sập lại mà thôi.</div>

<h3>Chạy thử từng bước</h3>
<p>Sáu lệnh chỉ đọc, theo đúng thứ tự bạn sẽ dùng trên một máy chủ lạ. Trong container, các con số mô tả máy ảo của Docker chứ không phải riêng container — tự điều đó đã là một bài học.</p>
<pre><code class="language-bash">nproc
cat /proc/loadavg
free -h
vmstat 1 3
ulimit -n; ulimit -Hn
grep -i "open files" /proc/\$\$/limits</code></pre>
<div class="out">10
0.16 0.17 0.20 1/707 3762
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.9Gi       1.8Gi        88Mi       3.3Gi       4.8Gi
Swap:          1.0Gi       427Mi       596Mi
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 0  0 437836 1907744 1358740 2067396    6    8    76   311 1131    1  0  0 99  0  0  0
 0  0 437836 1912196 1358740 2067396    0    0     0     0  823  801  0  0 100  0  0  0
 2  0 437836 1912196 1358740 2067396    0    0     0     0  626  578  0  0 99  0  0  0
1048576
1048576
Max open files            1048576              1048576              files</div>
<p>Đọc nó như một lần chẩn đoán: tải 0,16 trên 10 CPU là rảnh; 4,8 GiB <em>available</em> là dư dả dù chỉ 1,8 GiB "free"; 427 MiB swap ĐÃ dùng nhưng <code>si</code>/<code>so</code> bằng 0 từ dòng thứ hai, nên lúc này không có gì đang tráo (dòng đầu của <code>vmstat</code> là trung bình kể từ lúc khởi động — luôn đọc từ dòng thứ hai); và trần số file mở là mức rộng rãi mặc định của Docker chứ không phải 1024 của một máy chủ trần. (Container Ubuntu 24.04 trên Mac M1, 28/09/2026.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Câu hỏi</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td>Bao nhiêu CPU?</td><td><code>nproc</code></td><td><code>sysctl -n hw.ncpu</code> (không có <code>nproc</code>)</td></tr>
<tr><td>Tải trung bình</td><td><code>uptime</code>, <code>/proc/loadavg</code></td><td><code>uptime</code>, <code>sysctl -n vm.loadavg</code> → <code>{ 236.23 247.99 265.92 }</code> trên một Mac 10 nhân đang build Xcode</td></tr>
<tr><td>Một lát cắt của top</td><td><code>top -bn1</code></td><td><code>top -l 1</code> (dòng đầu: <code>Processes: 1730 total, 210 running…</code>)</td></tr>
<tr><td>Bộ nhớ</td><td><code>free -h</code>, <code>vmstat</code></td><td>không có <code>free</code>: <code>vm_stat</code>, <code>memory_pressure</code>, Activity Monitor → Memory</td></tr>
<tr><td>Trần số file mở</td><td><code>ulimit -n</code> (1024 trên máy chủ thông thường)</td><td><code>ulimit -n</code> tuỳ shell được khởi động thế nào; <code>launchctl limit maxfiles</code> cho thấy của launchd là <code>256 unlimited</code></td></tr>
</table>
<p>Trên WSL2, "cái máy" là một máy ảo nhẹ: <code>free</code> và <code>nproc</code> mô tả phần Windows cấp cho máy ảo đó, không phải cả chiếc PC.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> API của nhóm "tự dưng" chết lúc nửa đêm mà log không có gì, và sáng ra có người thấy <code>Too many open files</code> ở một dịch vụ khác. Tập trước cả hai lần chẩn đoán trong một container vứt đi (<code>docker run --rm -it --memory 128m ubuntu:24.04 bash</code>, rồi <code>apt-get update &amp;&amp; apt-get install -y procps python3</code>).</p><ol>
<li>Phân loại nhanh 30 giây: <code>nproc</code>, <code>cat /proc/loadavg</code>, <code>free -h</code>, <code>vmstat 1 3</code>. Viết một câu: nghẽn CPU, nghẽn I/O, thiếu bộ nhớ, hay đang rảnh?</li>
<li>Khởi động một job nền lịch sự bằng <code>nice -n 15 sleep 900 &amp;</code> rồi xác nhận <code>NI</code> và cờ <code>N</code> bằng <code>ps -o pid,ni,stat,cmd -p \$!</code>.</li>
<li>Trong một subshell, đặt <code>ulimit -n 16</code> rồi cho Python mở file tới khi hỏng; ghi lại số errno.</li>
<li>Đọc <code>/proc/\$\$/limits</code>, rồi dùng <code>prlimit --pid \$\$ --nofile=512:1024</code> lên chính shell của bạn và đọc lại.</li></ol>
<p><strong>Đạt khi:</strong> câu chẩn đoán của bạn dẫn ra ba con số thật, <code>ps</code> hiện <code>NI 15</code> cùng <code>SN</code>, Python in <code>[Errno 24] Too many open files</code>, và <code>/proc/\$\$/limits</code> hiện <code>512</code> / <code>1024</code> ở dòng "Max open files".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load average (tải trung bình)</span><span class="v">Số việc trung bình đang chạy hoặc chờ (kể cả trạng thái D) trong 1, 5 và 15 phút.</span></div>
  <div class="kv"><span class="k">iowait — wa / steal — st (chờ đĩa / bị lấy mất)</span><span class="v">CPU rỗi vì chờ đĩa · CPU bị trình siêu giám sát đem cho máy ảo khác.</span></div>
  <div class="kv"><span class="k">Niceness (độ nhã nhặn)</span><span class="v">Mức ưu tiên từ -20 tới 19; càng cao càng nhường CPU cho người khác.</span></div>
  <div class="kv"><span class="k">Available memory (bộ nhớ khả dụng)</span><span class="v">Phần một chương trình mới lấy được mà không phải tráo swap: free cộng bộ đệm thu hồi được.</span></div>
  <div class="kv"><span class="k">Swap-in / swap-out — si/so (tráo vào / tráo ra)</span><span class="v">Trang nhớ chuyển giữa RAM và đĩa; khác 0 liên tục nghĩa là máy đang giãy.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Phương án cuối của nhân: chọn một tiến trình và SIGKILL nó khi cạn RAM.</span></div>
  <div class="kv"><span class="k">Resource limit — soft / hard (trần mềm / cứng)</span><span class="v">Giới hạn theo từng tiến trình; mềm được áp dụng, cứng là mức mềm được nâng tới.</span></div>
  <div class="kv"><span class="k">File descriptor limit — nofile (trần số file mở)</span><span class="v">Số file và socket tối đa được mở; vượt thì ra <code>Too many open files</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm dòng đầu của <code>top</code> trả lời phần lớn câu "máy này có ổn không" — đọc chúng trước danh sách tiến trình.</li>
<li>Tải trung bình đếm một hàng đợi, không phải phần trăm: chia cho <code>nproc</code> và đọc xu hướng qua ba con số.</li>
<li><code>wa</code> nghĩa là đĩa là nút thắt, <code>st</code> nghĩa là nhà cung cấp là nút thắt; tối ưu mã không chữa được cái nào.</li>
<li><code>nice</code>/<code>renice</code> cho việc nền biết nhường; chỉ root mới nâng ưu tiên trở lại.</li>
<li>Đọc <code>available</code>, không đọc <code>free</code>; dịch vụ biến mất với mã 137 nhiều khả năng bị OOM giết — kiểm <code>dmesg</code>.</li>
<li><code>ulimit -n</code> chặn số file mở của mỗi tiến trình; sửa ở nơi dịch vụ khởi động (<code>LimitNOFILE=</code>, <code>--ulimit</code>) và kiểm rò rỉ trước.</li>
</ul>

<a class="link-card" href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — Linux Load Averages: Solving the Mystery</span><span class="lc-sub">Truy ngược lý do Linux đếm cả tiến trình trạng thái D vào tải, kèm cả bản vá gốc từ năm 1993. Câu trả lời dứt khoát cho "tải trung bình thật ra nghĩa là gì".</span></span>
</a>
<a class="link-card" href="https://www.linuxatemyram.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Linux ate my RAM!</span><span class="lc-sub">Một trang ngắn giải thích chuyện rối rắm buff/cache hay hơn mọi sách hướng dẫn. Hãy gửi nó cho bất kỳ ai hoảng lên vì bộ nhớ trống.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Linux Performance Analysis in 60 Seconds</span><span class="lc-sub">Bảng kiểm của Netflix: mười lệnh, theo đúng thứ tự, để phân loại nhanh một máy chủ lạ. Chương 12 dựng thẳng lên cái này.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc bốn máy chủ đang ốm</span><span class="lc-sub">Bốn lát cắt <code>top</code> — nghẽn CPU, nghẽn I/O, đói bộ nhớ, và bị cướp CPU. Chẩn đoán từng cái chỉ bằng các con số.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> so tải trung bình giữa các máy mà không chia cho số nhân, hoặc coi nó là phần trăm. "Tải 8" là khủng hoảng trên một VPS 2 nhân và là một buổi chiều yên ả trên máy chủ 32 nhân. Tệ hơn, tải 12 với CPU rỗi 95% thì hoàn toàn không phải chuyện CPU — đó là chờ đĩa, và mọi "tối ưu" áp vào ứng dụng sẽ chẳng thay đổi được gì. Hãy đọc tải, <code>nproc</code> và cột <code>wa</code> CÙNG NHAU, không thì thà đừng đọc.</div>
<p class="note-ct"><strong>Phân loại nhanh trong 30 giây:</strong> <code>uptime</code> (tải, và xu hướng của nó), <code>nproc</code> (cái tải đó nghĩa là gì), <code>top -bn1 | head -5</code> (thời gian đổ đi đâu — nhìn <code>wa</code> và <code>st</code>), <code>free -h</code> (đọc <code>available</code>, không đọc <code>free</code>), và <code>dmesg -T | tail</code> (nhân có giết thứ gì không). Năm lệnh, và chúng phân tách được "nghẽn CPU", "nghẽn I/O", "hết bộ nhớ" và "bị máy chủ vật lý bóp" — bốn thứ có bốn cách chữa hoàn toàn khác nhau.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Signals: what Ctrl-C actually sends|||5.3 — Tín hiệu: Ctrl-C thật ra gửi cái gì',
      slug: 'lnx-5-3-tin-hieu',
      type: 'LESSON',
      description: 'SIGINT/SIGTERM/SIGKILL/SIGHUP khác nhau ở đâu, vì sao kill -9 là lựa chọn TỆ nhất chứ không phải mạnh nhất, kill/pkill/killall, mã thoát 128+N, và cách tắt máy êm thấm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Signals</h2>
<p class="lead">A signal is a one-byte message the kernel delivers to a process: no payload, no reply, just a number. Pressing Ctrl-C sends one. So does <code>kill</code>, closing a terminal, a segmentation fault, and the OOM killer. Understanding the half-dozen that matter is what separates "stopping a service" from "corrupting its data".</p>

<h3>The signals you will actually meet</h3>
${slide('lx-05', 15, 'Bảng tín hiệu: chỉ KILL và STOP không bắt được')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SIGINT</code> · 2</span><span class="v"><strong>Ctrl-C.</strong> "Please stop." Catchable and ignorable. A well-written program cleans up and exits.</span></div>
  <div class="kv"><span class="k"><code>SIGTERM</code> · 15</span><span class="v"><strong>The default of <code>kill</code>.</strong> "Please terminate." Also catchable — this is how a service is asked to finish requests, flush buffers and close files before exiting.</span></div>
  <div class="kv"><span class="k"><code>SIGKILL</code> · 9</span><span class="v"><strong>Cannot be caught, blocked or ignored.</strong> The kernel destroys the process immediately. No cleanup, no flush, no chance to save. The last resort, not the first.</span></div>
  <div class="kv"><span class="k"><code>SIGHUP</code> · 1</span><span class="v">"Hang up" — originally a dropped modem line. Sent when a terminal closes. Daemons repurposed it to mean "reload your config", which is why <code>kill -HUP nginx</code> re-reads config without dropping connections.</span></div>
  <div class="kv"><span class="k"><code>SIGSTOP</code> · 19 · <code>SIGCONT</code> · 18</span><span class="v">Freeze and resume. <code>SIGSTOP</code> is the other uncatchable one. Ctrl-Z sends the catchable cousin <code>SIGTSTP</code> — Lesson 5.4.</span></div>
  <div class="kv"><span class="k"><code>SIGSEGV</code> · 11 · <code>SIGPIPE</code> · 13</span><span class="v">Invalid memory access, and writing to a pipe with no reader (Lesson 3.2). Both usually fatal, both usually a bug — or, for SIGPIPE, entirely normal.</span></div>
</div>
<pre><code>kill -l                    <span class="tok-comment"># every signal on this system</span>
kill -l 15                 <span class="tok-comment"># what is signal 15 called?</span>
man 7 signal               <span class="tok-comment"># the full table with default actions</span></code></pre>
<div class="out">TERM</div>

<h3>What happens when you press Ctrl-C</h3>
${slide('lx-05', 16, 'Đường đi của Ctrl-C, và 128+N đo thật')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Terminal driver</span><span class="lz-t">sees the 0x03 byte</span><span class="lz-d">The terminal, not the program, interprets Ctrl-C. That mapping is configurable: <code>stty -a</code> shows it as <code>intr = ^C</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Kernel</span><span class="lz-t">sends SIGINT to the FOREGROUND PROCESS GROUP</span><span class="lz-d">Not to one process — to the whole foreground group. That is why Ctrl-C on a pipeline stops every stage at once.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Each process decides</span><span class="lz-t">default action, custom handler, or ignore</span><span class="lz-d">Default is "terminate". A handler can save state first. Ignoring it is legal — which is why some programs shrug off Ctrl-C.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Shell reports</span><span class="lz-t">exit status 130</span><span class="lz-d">128 + 2, where 2 is SIGINT. Every signal death follows this rule.</span></div>
</div>
<pre><code>sleep 100
<span class="tok-comment"># press Ctrl-C</span>
echo \$?</code></pre>
<div class="out">130</div>
<div class="callout ok"><strong>Exit codes 128+N mean "killed by signal N".</strong> This is the decoder ring for a whole class of confusing failures: <code>130</code> = Ctrl-C, <code>143</code> = SIGTERM (128+15, a normal <code>docker stop</code> or <code>systemctl stop</code>), <code>137</code> = SIGKILL (128+9 — a <code>docker stop</code> that timed out, or the OOM killer from Lesson 5.2), <code>139</code> = segfault. When CI reports "exited with code 137", it is not a mysterious application error; something ran out of memory or was force-killed.</div>

<h3>Measured: 128 + N for six signals — and a trap inside scripts</h3>
<p>The rule is easy to check. This loop starts a <code>sleep</code>, sends it one signal, and prints the status <code>wait</code> collects:</p>
<pre><code class="language-bash">set -m
for s in INT TERM KILL HUP QUIT SEGV; do
  sleep 100 &amp; p=\$!; sleep 0.2; kill -\$s \$p; wait \$p
  echo "SIG\$s → \\\$? = \$?"
done 2&gt;/dev/null</code></pre>
<div class="out">SIGINT → $? = 130
SIGTERM → $? = 143
SIGKILL → $? = 137
SIGHUP → $? = 129
SIGQUIT → $? = 131
SIGSEGV → $? = 139</div>
<p>Why the <code>set -m</code>? Run the same loop in a script <em>without</em> it and the first line becomes <code>SIGINT → \$? = 0</code>, one hundred seconds later. In a non-interactive shell, bash starts background jobs with <strong>SIGINT and SIGQUIT ignored</strong> — so that a <code>Ctrl-C</code> meant for the script's foreground command does not also kill its helpers. You can see it in the kernel's own bookkeeping: a background <code>python3</code> started from a script showed <code>SigIgn: 0000000001001006</code>, whose bits 1 and 2 are signals 2 (INT) and 3 (QUIT). <code>set -m</code> turns job control on and restores normal behaviour. Remember this the day a script's background worker "refuses" to die on <code>kill -INT</code>; <code>kill -TERM</code> still works. And <code>kill -l 143</code> prints <code>TERM</code>: bash's <code>kill -l</code> understands exit codes, so you never need to do the subtraction by hand.</p>
<h3>Why some programs ignore Ctrl-C</h3>
<pre><code class="language-bash">vim                <span class="tok-comment"># catches SIGINT — you must :q to leave</span>
sudo apt upgrade   <span class="tok-comment"># blocks it during unpacking, to avoid a half-installed system</span>
sleep 100          <span class="tok-comment"># uses the default action — dies immediately</span></code></pre>
<p>Both catching and ignoring are legitimate. A text editor with unsaved changes should not vanish because you fumbled a key; a package manager mid-unpack should not leave a broken system. When Ctrl-C does nothing, escalate deliberately rather than mashing it — Ctrl-Z to suspend and investigate (Lesson 5.4), then <code>kill</code>, and only then <code>kill -9</code>.</p>

<h3>Sending signals: kill, pkill, killall</h3>
${slide('lx-05', 19, 'pkill -f khớp cả dòng lệnh của chính bạn')}
<pre><code>kill 5012                  <span class="tok-comment"># SIGTERM — the polite default</span>
kill -TERM 5012            <span class="tok-comment"># identical, explicit</span>
kill -15 5012              <span class="tok-comment"># identical again</span>
kill -HUP 812              <span class="tok-comment"># reload config</span>
kill -9 5012               <span class="tok-comment"># SIGKILL — last resort</span>

pkill -f 'node dist/index' <span class="tok-comment"># by full command line — -f matches ARGUMENTS too</span>
pkill -u deploy node       <span class="tok-comment"># narrowed by user</span>
killall nginx              <span class="tok-comment"># by exact process NAME, all of them</span>
kill -0 5012 &amp;&amp; echo alive <span class="tok-comment"># signal 0 sends nothing — just tests existence</span></code></pre>
<div class="callout warn"><code>pkill -f</code> matches against the whole command line, which is powerful and dangerous. <code>pkill -f node</code> on a server running several Node services kills all of them, and <code>pkill -f "python .*backup"</code> can match your own <code>grep</code> or editor. <strong>Always run <code>pgrep -af &lt;pattern&gt;</code> first</strong> and read the list — the two commands take identical arguments, so what <code>pgrep</code> shows is exactly what <code>pkill</code> will kill.</div>

<h3>pgrep -f can match your own command line</h3>
<p>With <code>-f</code>, the pattern is searched in the <em>whole command line</em> of every process — and that includes the shell that is running <code>pgrep</code>, whenever the pattern appears in that shell's own arguments. <code>pgrep</code> is careful to exclude itself, but not its parent:</p>
<pre><code>bash -c 'pgrep -af "sleep 1000"; echo ---'
bash -c 'pkill -f "sleep 9999"; echo "dòng này có in không?"'
echo \$?</code></pre>
<div class="out">2961 sleep 1000
3041 bash -c pgrep -af "sleep 1000"; echo ---
---
143</div>
<p>The first command found the real <code>sleep</code> <em>and</em> the <code>bash -c</code> that contained the pattern. The second is worse: <code>pkill</code> found no <code>sleep 9999</code> at all — but it did find its own shell, sent it SIGTERM, and the <code>echo</code> never ran (status 143). The same mechanism produces a "wait until the deploy has finished" loop that waits forever, because the loop's own <code>bash -c "… deploy …"</code> always matches. (Curiously, <code>bash -c 'pgrep -af "sleep 1000"'</code> with a <em>single</em> command does not show the shell: bash replaces itself with that last command instead of forking, so there is no <code>bash</code> left to match.)</p>
<ul>
<li>Match the program name exactly when you can: <code>pgrep -x nginx</code>.</li>
<li>Put the pattern in a script file or a variable, not literally in a <code>bash -c</code> or <code>ssh host '…'</code> string.</li>
<li>If you must, use the bracket trick in a command of its own: <code>pgrep -af "[s]leep 1000"</code>.</li>
<li>Better still, use something unambiguous: a PID file, <code>systemctl</code>, or the port.</li>
</ul>

<h3>When the name lies: find it by port</h3>
${slide('lx-05', 20, 'Tiến trình đổi tên thì pkill hụt — diệt theo cổng')}
<p>Programs may rename themselves. Node exposes <code>process.title</code>, and Next.js sets it to <code>next-server (vX.Y.Z)</code>, which rewrites what <code>ps</code> shows — so the pattern you would naturally type matches nothing. The same thing, reproduced on a Mac with a three-line <code>start.js</code> that sets that title and listens on port 19051:</p>
<pre><code class="language-bash">node start.js --port 19051 &amp;
pkill -f "next start"; echo "rc=\$?"
ps -o pid,comm,args -p \$(lsof -ti:19051)
lsof -ti:19051 | xargs kill; lsof -ti:19051 || echo "cổng trống"</code></pre>
<div class="out">rc=1
  PID COMM             ARGS
78187 next-server (v15 next-server (v15.5.4)
cổng trống</div>
<p><code>pkill</code> returns 1, "nothing matched", while the old server keeps the port and the new one dies with <code>EADDRINUSE</code> — the real incident behind this lesson. A port, unlike a name, has exactly one owner. <code>lsof -t</code> prints only PIDs, <code>-i:19051</code> selects connections on that port, and <code>xargs -r kill</code> sends SIGTERM only if something was found (<code>-r</code> is GNU; macOS's <code>xargs</code> already skips empty input). On Linux, <code>ss -ltnp 'sport = :3000'</code> and <code>fuser -k 3000/tcp</code> (package <code>psmisc</code>) do the same job.</p>
<table>
<tr><th>Command / flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>kill -SIG PID</code></td><td>send a signal by name (portable) or number</td><td><code>kill -TERM 5012</code></td></tr>
<tr><td><code>kill -0 PID</code></td><td>send nothing; exit 0 if the process exists and you may signal it</td><td><code>kill -0 5012 &amp;&amp; echo alive</code></td></tr>
<tr><td><code>kill -l [N]</code></td><td>list signals, or name a number / exit code</td><td><code>kill -l 137</code> → <code>KILL</code></td></tr>
<tr><td><code>pgrep</code> / <code>pkill</code> <code>-x</code></td><td>exact process name</td><td><code>pkill -x nginx</code></td></tr>
<tr><td><code>-f</code></td><td>match the full command line (dangerous)</td><td><code>pgrep -af "node dist"</code></td></tr>
<tr><td><code>-u</code> · <code>-P</code></td><td>owned by user · children of PID</td><td><code>pkill -P \$\$</code></td></tr>
<tr><td><code>-n</code> · <code>-o</code></td><td>only the newest · only the oldest match</td><td><code>pgrep -n node</code></td></tr>
<tr><td><code>-a</code> (Linux) / <code>-l</code></td><td>print the command line / the name next to the PID</td><td><code>pgrep -a sshd</code></td></tr>
<tr><td><code>killall NAME</code></td><td>every process with that exact name</td><td><code>killall -HUP nginx</code></td></tr>
<tr><td><code>lsof -ti:PORT</code></td><td>PIDs holding a port</td><td><code>lsof -ti:3000 | xargs -r kill</code></td></tr>
</table>
<h3>The escalation ladder</h3>
${slide('lx-05', 17, 'Leo thang TERM → chờ → KILL; docker stop đo thật')}
<pre><code><span class="tok-comment"># 1. Ask politely, then wait — this is enough in the overwhelming majority of cases</span>
kill 5012
sleep 5
kill -0 5012 2&gt;/dev/null &amp;&amp; echo "still running" || echo "gone"

<span class="tok-comment"># 2. Only if it is genuinely stuck</span>
kill -9 5012</code></pre>
<div class="callout warn"><strong><code>kill -9</code> is the worst option, not the strongest one.</strong> Because SIGKILL cannot be caught, the process gets no chance to flush its write buffers, finish an in-flight transaction, remove its PID file or close its network connections. That means: a database left needing crash recovery on next start, a half-written file, a stale lock file that blocks the next start entirely, and orphaned child processes. Reach for it only after SIGTERM has been given several seconds and demonstrably failed — and remember that a process in state <code>D</code> (Lesson 5.1) will not die from it either, because it is not running to receive it.</div>

<h3>docker stop, measured</h3>
<p><code>docker stop</code> is this ladder automated: SIGTERM, a grace period, then SIGKILL. Three containers, stopped with <code>docker stop -t 10</code>:</p>
<table>
<tr><th>PID 1 of the container</th><th>Time to stop</th><th>Exit code</th></tr>
<tr><td><code>sleep 300</code> — no handler, no init</td><td>10.2 s</td><td>137 (SIGKILL after the grace period)</td></tr>
<tr><td><code>sleep 300</code> with <code>--init</code></td><td>0.1 s</td><td>143 (tini forwarded TERM, sleep died of it)</td></tr>
<tr><td><code>bash</code> with <code>trap "…; exit 0" TERM</code></td><td>0.1 s</td><td>0 (clean shutdown)</td></tr>
</table>
<p>Docker's documentation gives 10 seconds as the default grace period for Linux containers; on this Mac's Docker Desktop, a <code>docker stop</code> <em>without</em> <code>-t</code> killed after about 3 seconds. Do not build on the default — set <code>-t</code> or <code>stop_grace_period</code>, and make the program handle TERM.</p>
<h3>Graceful shutdown, from the program's side</h3>
${slide('lx-05', 18, 'trap và mặt nạ SigIgn/SigCgt')}
<pre><code><span class="tok-comment"># In bash — Chapter 7 covers trap properly</span>
trap 'echo "cleaning up"; rm -f /tmp/work.lock; exit 0' TERM INT
trap 'rm -rf "\$TMPDIR"' EXIT     <span class="tok-comment"># EXIT runs on ANY exit, signal or not</span></code></pre>
<pre><code class="language-bash"><span class="tok-comment"># In Node.js — the same idea, and why docker stop needs it</span>
process.on('SIGTERM', async () =&gt; {
  server.close();                 <span class="tok-comment"># stop accepting new connections</span>
  await pool.end();               <span class="tok-comment"># finish in-flight queries</span>
  process.exit(0);
});</code></pre>
<p>This is not academic. <code>docker stop</code> sends SIGTERM, waits ten seconds, then sends SIGKILL. A container that ignores SIGTERM therefore takes ten seconds to stop <em>and</em> dies violently every single deploy. Handling SIGTERM makes deploys both faster and safer, and it is usually five lines.</p>
<div class="callout ok">A subtlety worth knowing: in a container, your app often runs as PID 1, and <strong>PID 1 does not get default signal actions</strong> — the kernel protects it, so a process with no explicit SIGTERM handler will simply not die from <code>docker stop</code>. Combined with the zombie-reaping duty from Lesson 5.1, that is the whole reason for <code>docker run --init</code> and <code>tini</code>. If your container takes exactly ten seconds to stop every time, this is why.</div>

<h3>Reload versus restart</h3>
<pre><code class="language-bash">sudo nginx -t                        <span class="tok-comment"># ALWAYS test the config first</span>
sudo systemctl reload nginx          <span class="tok-comment"># SIGHUP — re-read config, keep serving</span>
sudo systemctl restart nginx         <span class="tok-comment"># stop and start — brief downtime</span>
sudo kill -HUP \$(cat /run/nginx.pid) <span class="tok-comment"># the same reload, by hand</span>
sudo kill -USR1 \$(cat /run/nginx.pid) <span class="tok-comment"># nginx: reopen log files, for rotation</span></code></pre>
<p><code>SIGUSR1</code> and <code>SIGUSR2</code> have no kernel-defined meaning at all — they exist for programs to define. nginx uses USR1 for "reopen logs" and USR2 for "start a new binary alongside the old one", which is how it upgrades itself with zero dropped connections. Check the manual of the specific daemon; there is no general rule, only convention.</p>
<div class="callout warn">Test before you reload. <code>nginx -t</code> validates the config file; skipping it and reloading a broken config leaves the old workers running but means the <em>next</em> restart — possibly at 3am, triggered by something else — fails to start at all. The failure surfaces long after the change, which is the worst kind.</div>

<h3>Seeing what a process does with signals</h3>
<pre><code class="language-bash">grep -E 'SigCgt|SigIgn|SigBlk' /proc/812/status
sudo strace -p 5012 -e trace=signal      <span class="tok-comment"># watch signals arrive, live</span></code></pre>
<div class="out">SigBlk: 0000000000000000
SigIgn: 0000000000001000
SigCgt: 0000000180014a03</div>
<p>Those hex masks list which signals the process ignores (<code>SigIgn</code>) and which it catches with a handler (<code>SigCgt</code>). It is a bit-per-signal field, so bit 0 is signal 1. You will rarely decode it by hand, but when a process refuses to die from SIGTERM, this is the file that proves whether it is ignoring the signal or simply stuck — two very different problems.</p>

<h3>Try it step by step</h3>
<p>A ten-line script that cleans up after itself, and four commands that prove each <code>trap</code> line does what it says. Save it as <code>don.sh</code> in <code>~/thu-linux/ch5</code> and <code>chmod +x</code> it.</p>
<pre><code class="language-bash">#!/bin/bash
lock=/tmp/deploy.lock
don_dep() {
  echo "nhận tín hiệu — dọn dẹp"
  rm -f "\$lock"
}
trap don_dep EXIT
trap 'exit 143' TERM INT
trap '' HUP
touch "\$lock"; sleep 300 &amp; wait</code></pre>
<pre><code class="language-bash">./don.sh &amp; p=\$!
kill -HUP \$p; sleep 0.3; kill -0 \$p &amp;&amp; echo "HUP: vẫn sống"
kill \$p; wait \$p; echo "mã thoát: \$?"
ls /tmp/deploy.lock</code></pre>
<div class="out">HUP: vẫn sống
nhận tín hiệu — dọn dẹp
mã thoát: 143
ls: cannot access '/tmp/deploy.lock': No such file or directory</div>
<p>HUP is ignored (<code>trap '' HUP</code>), so the script survives it. TERM runs <code>exit 143</code>, and exiting fires the <code>EXIT</code> trap, which removes the lock — that is the pattern: signal traps decide <em>whether</em> to exit, one EXIT trap does the cleanup. The <code>&amp; wait</code> matters: bash runs a trap only between commands, so a script blocked in a foreground <code>sleep 300</code> would not clean up until the sleep ended; <code>wait</code> is interrupted by the signal immediately. One more thing to notice: the child <code>sleep 300</code> is still running afterwards — kill your own children in the cleanup (<code>kill \$(jobs -p)</code>) if they must not outlive you. (Ubuntu 24.04 container.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Linux / WSL2</th><th>macOS</th></tr>
<tr><td>Signal numbers</td><td>STOP 19 · TSTP 20 · CONT 18 · USR1 10 · CHLD 17</td><td><code>kill -l 17 18 19 30</code> → <code>STOP TSTP CONT USR1</code>. Numbers differ — <strong>always use names</strong></td></tr>
<tr><td>HUP · INT · QUIT · KILL · TERM</td><td>1 · 2 · 3 · 9 · 15</td><td>the same</td></tr>
<tr><td><code>pgrep -a</code></td><td>show the command line</td><td>"include ancestors"; use <code>pgrep -lf</code></td></tr>
<tr><td><code>pidof</code>, <code>fuser -k PORT/tcp</code></td><td>present</td><td>no <code>pidof</code>; <code>fuser</code> exists but has no <code>-k PORT/tcp</code> form — use <code>lsof -ti:PORT</code></td></tr>
<tr><td><code>/proc/PID/status</code> (SigIgn/SigCgt)</td><td>present</td><td>absent</td></tr>
</table>
<p>The Mac's bash is 3.2, but <code>trap</code>, <code>kill -0</code> and <code>kill -l</code> behave the same there. Under WSL2 everything is Linux — with one twist: closing the Windows Terminal tab hangs up the shell exactly like an SSH drop (Lesson 5.4).</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your deploy script leaves a stale <code>/tmp/deploy.lock</code> whenever someone presses <code>Ctrl-C</code>, and the next deploy refuses to start. Fix the script, then prove it — in <code>~/thu-linux/ch5</code> or a throwaway container.</p><ol>
<li>Write <code>khoa.sh</code> that creates <code>/tmp/deploy.lock</code>, then <code>sleep 300 &amp; wait</code>, with <strong>no</strong> trap. Run it in the background, <code>kill</code> it, and confirm the lock is left behind and <code>\$?</code> is 143.</li>
<li>Add an <code>EXIT</code> trap that removes the lock and a <code>TERM INT</code> trap that exits; repeat and confirm the lock is gone.</li>
<li>Start the script again and stop it with <code>kill -INT</code>. <code>kill -l</code> names 143 as TERM although you sent INT — explain why by reading your own trap line.</li>
<li>Start <code>python3 -m http.server 19050 &amp;</code> (or any server) and stop it <em>by port</em> with <code>lsof -ti:19050 | xargs -r kill</code>, then verify the port is free.</li></ol>
<p><strong>Done when:</strong> without the trap the lock survives a <code>kill</code>; with it the lock disappears on both TERM and INT; you can explain why INT still ends with 143; and <code>lsof -ti:19050</code> prints nothing at the end.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signal</span><span class="v">A small numbered notification the kernel delivers to a process.</span></div>
  <div class="kv"><span class="k">SIGTERM / SIGKILL</span><span class="v">"Please exit" (catchable, 15) · "die now" (uncatchable, 9).</span></div>
  <div class="kv"><span class="k">SIGINT / SIGHUP</span><span class="v">Sent by <code>Ctrl-C</code> (2) · sent when the terminal hangs up, reused as "reload" (1).</span></div>
  <div class="kv"><span class="k">Handler / trap</span><span class="v">Code a program runs when a signal arrives; in bash, set with <code>trap</code>.</span></div>
  <div class="kv"><span class="k">Ignore mask (SigIgn/SigCgt)</span><span class="v">Bitmaps in <code>/proc/PID/status</code>: signals ignored · signals caught.</span></div>
  <div class="kv"><span class="k">Foreground process group</span><span class="v">The set of processes a terminal delivers <code>Ctrl-C</code> to — a whole pipeline.</span></div>
  <div class="kv"><span class="k">Grace period</span><span class="v">The time between SIGTERM and SIGKILL in <code>docker stop</code>, <code>systemctl stop</code>, Kubernetes.</span></div>
  <div class="kv"><span class="k">Exit code 128+N</span><span class="v">How a shell reports "killed by signal N": 130, 137, 143…</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Only SIGKILL and SIGSTOP cannot be caught or ignored; everything else is a request the program may handle.</li>
<li><code>Ctrl-C</code> is SIGINT to the whole foreground pipeline; death by signal N shows as exit code 128+N.</li>
<li>Background jobs of a non-interactive script ignore SIGINT and SIGQUIT — use TERM to stop them.</li>
<li>Escalate on purpose: TERM, wait, check with <code>kill -0</code>, and only then KILL.</li>
<li><code>pgrep -f</code>/<code>pkill -f</code> can match your own shell and miss renamed programs; kill by port with <code>lsof -ti:PORT</code>.</li>
<li>Trap TERM/INT to decide to exit and EXIT to clean up; use signal names, because numbers differ on macOS.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">signal(7) — the complete table</span><span class="lc-sub">Every signal, its number, its default action, and whether it can be caught. The one page to bookmark from this lesson.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Signals.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Signals and trap</span><span class="lc-sub">How bash handles signals in scripts and interactively, and the exact semantics of <code>trap</code>, including the pseudo-signals EXIT and ERR.</span></span>
</a>
<a class="link-card" href="https://cloud.google.com/blog/topics/developers-practitioners/kubernetes-best-practices-terminating-with-grace" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Terminating with grace</span><span class="lc-sub">The SIGTERM → grace period → SIGKILL sequence as containers and orchestrators implement it, with the timing diagrams. Explains exit code 137 for good.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: stop it properly</span><span class="lc-sub">Graded tasks: a script that traps SIGTERM and cleans up, a stuck process to escalate on, and reading exit codes 130 / 137 / 143 back to their causes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> reaching for <code>kill -9</code> first because it "always works". It does not always work — a process in uninterruptible sleep ignores it, and a zombie is already dead — and when it does work it skips every cleanup the program was going to do. The habit costs real data: half-written files, databases that need recovery on next boot, and lock files that block the following start. <code>kill</code>, wait five seconds, check with <code>kill -0</code>, and only then escalate. If you find yourself needing <code>-9</code> routinely, the bug is that the program does not handle SIGTERM — fix that instead.</div>
<p class="note-ct"><strong>Two things worth memorising outright.</strong> <strong>128 + N</strong>: an exit code above 128 names the signal that killed the process — 130 Ctrl-C, 137 SIGKILL/OOM, 143 SIGTERM — and that one arithmetic fact decodes a large share of "mysterious" CI and container failures. And <strong><code>pgrep</code> before <code>pkill</code></strong>: identical arguments, so the list you read is exactly the list you are about to kill.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Tín hiệu</h2>
<p class="lead">Một tín hiệu là một thông điệp dài một byte mà nhân chuyển tới một tiến trình: không có nội dung kèm theo, không có hồi đáp, chỉ là một con số. Nhấn Ctrl-C là gửi một cái. <code>kill</code> cũng vậy, đóng một terminal cũng vậy, một lỗi truy cập bộ nhớ cũng vậy, và OOM killer cũng vậy. Hiểu được nửa tá tín hiệu quan trọng chính là thứ phân biệt "dừng một dịch vụ" với "làm hỏng dữ liệu của nó".</p>

<h3>Những tín hiệu bạn thật sự sẽ gặp</h3>
${slide('lx-05', 15, 'Bảng tín hiệu: chỉ KILL và STOP không bắt được')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SIGINT</code> · 2</span><span class="v"><strong>Ctrl-C.</strong> "Làm ơn dừng lại." Bắt được và lờ đi được. Một chương trình viết tử tế sẽ dọn dẹp rồi thoát.</span></div>
  <div class="kv"><span class="k"><code>SIGTERM</code> · 15</span><span class="v"><strong>Mặc định của <code>kill</code>.</strong> "Làm ơn kết thúc." Cũng bắt được — đây là cách một dịch vụ được YÊU CẦU xử nốt các yêu cầu đang dở, xả bộ đệm và đóng file trước khi thoát.</span></div>
  <div class="kv"><span class="k"><code>SIGKILL</code> · 9</span><span class="v"><strong>Không bắt được, không chặn được, không lờ được.</strong> Nhân huỷ tiến trình ngay lập tức. Không dọn dẹp, không xả bộ đệm, không có cơ hội lưu lại gì. Là phương án CUỐI, không phải phương án đầu.</span></div>
  <div class="kv"><span class="k"><code>SIGHUP</code> · 1</span><span class="v">"Gác máy" — ban đầu là một đường modem bị rớt. Được gửi khi một terminal đóng lại. Các daemon dùng lại nó với nghĩa "nạp lại cấu hình", và đó là lý do <code>kill -HUP nginx</code> đọc lại cấu hình mà không rớt kết nối nào.</span></div>
  <div class="kv"><span class="k"><code>SIGSTOP</code> · 19 · <code>SIGCONT</code> · 18</span><span class="v">Đóng băng và chạy tiếp. <code>SIGSTOP</code> là cái không bắt được thứ hai. Ctrl-Z gửi người anh em bắt được của nó là <code>SIGTSTP</code> — Bài 5.4.</span></div>
  <div class="kv"><span class="k"><code>SIGSEGV</code> · 11 · <code>SIGPIPE</code> · 13</span><span class="v">Truy cập bộ nhớ không hợp lệ, và ghi vào một ống không còn người đọc (Bài 3.2). Cả hai thường gây chết, cả hai thường là lỗi — hoặc, với SIGPIPE, là chuyện hoàn toàn bình thường.</span></div>
</div>
<pre><code>kill -l                    <span class="tok-comment"># mọi tín hiệu trên hệ thống này</span>
kill -l 15                 <span class="tok-comment"># tín hiệu 15 tên là gì?</span>
man 7 signal               <span class="tok-comment"># bảng đầy đủ kèm hành động mặc định</span></code></pre>
<div class="out">TERM</div>

<h3>Chuyện gì xảy ra khi bạn nhấn Ctrl-C</h3>
${slide('lx-05', 16, 'Đường đi của Ctrl-C, và 128+N đo thật')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Trình điều khiển terminal</span><span class="lz-t">thấy byte 0x03</span><span class="lz-d">TERMINAL diễn giải Ctrl-C, không phải chương trình. Ánh xạ đó cấu hình được: <code>stty -a</code> hiện nó ra thành <code>intr = ^C</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nhân</span><span class="lz-t">gửi SIGINT tới CẢ NHÓM TIẾN TRÌNH TIỀN CẢNH</span><span class="lz-d">Không phải tới một tiến trình — mà tới cả nhóm tiền cảnh. Đó là lý do Ctrl-C trên một chuỗi ống dừng mọi khâu cùng một lúc.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Mỗi tiến trình tự quyết</span><span class="lz-t">hành động mặc định, bộ xử lý riêng, hoặc lờ đi</span><span class="lz-d">Mặc định là "kết thúc". Một bộ xử lý có thể lưu trạng thái trước đã. Lờ nó đi là hợp lệ — và đó là lý do vài chương trình nhún vai trước Ctrl-C.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Shell báo lại</span><span class="lz-t">mã thoát 130</span><span class="lz-d">128 + 2, với 2 là SIGINT. Mọi cái chết vì tín hiệu đều theo luật này.</span></div>
</div>
<pre><code>sleep 100
<span class="tok-comment"># nhấn Ctrl-C</span>
echo \$?</code></pre>
<div class="out">130</div>
<div class="callout ok"><strong>Mã thoát 128+N nghĩa là "bị giết bởi tín hiệu N".</strong> Đây là chiếc chìa giải mã cho cả một lớp lỗi khó hiểu: <code>130</code> = Ctrl-C, <code>143</code> = SIGTERM (128+15, một lệnh <code>docker stop</code> hay <code>systemctl stop</code> bình thường), <code>137</code> = SIGKILL (128+9 — một <code>docker stop</code> hết giờ chờ, hoặc OOM killer ở Bài 5.2), <code>139</code> = lỗi truy cập bộ nhớ. Khi CI báo "exited with code 137", đó không phải một lỗi ứng dụng bí ẩn; có thứ gì đó đã cạn bộ nhớ hoặc bị giết bằng vũ lực.</div>

<h3>Đo thật: 128 + N cho sáu tín hiệu — và một cái bẫy trong script</h3>
<p>Luật này kiểm được rất dễ. Vòng lặp dưới đây khởi động một <code>sleep</code>, gửi cho nó một tín hiệu, rồi in trạng thái mà <code>wait</code> thu về:</p>
<pre><code class="language-bash">set -m
for s in INT TERM KILL HUP QUIT SEGV; do
  sleep 100 &amp; p=\$!; sleep 0.2; kill -\$s \$p; wait \$p
  echo "SIG\$s → \\\$? = \$?"
done 2&gt;/dev/null</code></pre>
<div class="out">SIGINT → $? = 130
SIGTERM → $? = 143
SIGKILL → $? = 137
SIGHUP → $? = 129
SIGQUIT → $? = 131
SIGSEGV → $? = 139</div>
<p>Vì sao cần <code>set -m</code>? Chạy đúng vòng lặp đó trong một script mà KHÔNG có nó thì dòng đầu thành <code>SIGINT → \$? = 0</code>, sau một trăm giây. Trong một shell không tương tác, bash khởi động job nền với <strong>SIGINT và SIGQUIT bị LỜ ĐI</strong> — để một cú <code>Ctrl-C</code> nhắm vào lệnh tiền cảnh của script không giết lây sang các tiến trình phụ của nó. Bạn thấy được điều đó ngay trong sổ sách của nhân: một <code>python3</code> chạy nền khởi động từ script hiện <code>SigIgn: 0000000001001006</code>, với bit 1 và bit 2 là tín hiệu 2 (INT) và 3 (QUIT). <code>set -m</code> bật điều khiển job (job control) và trả lại hành vi bình thường. Hãy nhớ điều này vào cái ngày một tiến trình phụ chạy nền của script "không chịu" chết vì <code>kill -INT</code>; <code>kill -TERM</code> thì vẫn ăn. Và <code>kill -l 143</code> in ra <code>TERM</code>: <code>kill -l</code> của bash hiểu cả mã thoát, nên bạn chẳng bao giờ cần tự làm phép trừ.</p>
<h3>Vì sao vài chương trình lờ Ctrl-C đi</h3>
<pre><code class="language-bash">vim                <span class="tok-comment"># bắt SIGINT — bạn phải :q mới ra được</span>
sudo apt upgrade   <span class="tok-comment"># chặn nó trong lúc bung gói, để khỏi có hệ thống cài dở</span>
sleep 100          <span class="tok-comment"># dùng hành động mặc định — chết ngay</span></code></pre>
<p>Cả bắt lẫn lờ đều chính đáng. Một trình soạn thảo có thay đổi chưa lưu không nên biến mất chỉ vì bạn bấm nhầm phím; một trình quản lý gói đang bung dở không nên để lại một hệ thống hỏng. Khi Ctrl-C không có tác dụng, hãy leo thang một cách CÓ CHỦ Ý thay vì bấm loạn lên — Ctrl-Z để treo lại và đi điều tra (Bài 5.4), rồi <code>kill</code>, và chỉ sau đó mới tới <code>kill -9</code>.</p>

<h3>Gửi tín hiệu: kill, pkill, killall</h3>
${slide('lx-05', 19, 'pkill -f khớp cả dòng lệnh của chính bạn')}
<pre><code>kill 5012                  <span class="tok-comment"># SIGTERM — mặc định lịch sự</span>
kill -TERM 5012            <span class="tok-comment"># y hệt, viết rõ ra</span>
kill -15 5012              <span class="tok-comment"># cũng y hệt</span>
kill -HUP 812              <span class="tok-comment"># nạp lại cấu hình</span>
kill -9 5012               <span class="tok-comment"># SIGKILL — phương án cuối</span>

pkill -f 'node dist/index' <span class="tok-comment"># theo cả dòng lệnh — -f khớp cả THAM SỐ</span>
pkill -u deploy node       <span class="tok-comment"># thu hẹp theo người dùng</span>
killall nginx              <span class="tok-comment"># theo đúng TÊN tiến trình, giết hết</span>
kill -0 5012 &amp;&amp; echo còn sống <span class="tok-comment"># tín hiệu 0 không gửi gì — chỉ để thử xem còn tồn tại không</span></code></pre>
<div class="callout warn"><code>pkill -f</code> khớp với cả dòng lệnh, thứ vừa mạnh vừa nguy hiểm. <code>pkill -f node</code> trên một máy chủ chạy vài dịch vụ Node sẽ giết sạch tất cả, và <code>pkill -f "python .*backup"</code> có thể khớp trúng chính lệnh <code>grep</code> hay trình soạn thảo của bạn. <strong>Hãy LUÔN chạy <code>pgrep -af &lt;mẫu&gt;</code> trước</strong> và đọc danh sách — hai lệnh nhận tham số giống hệt nhau, nên thứ <code>pgrep</code> hiện ra chính xác là thứ <code>pkill</code> sẽ giết.</div>

<h3>pgrep -f có thể khớp trúng dòng lệnh của chính bạn</h3>
<p>Với <code>-f</code>, mẫu được tìm trong <em>TOÀN BỘ DÒNG LỆNH</em> của mọi tiến trình — kể cả cái shell đang chạy <code>pgrep</code>, mỗi khi mẫu nằm ngay trong tham số của shell đó. <code>pgrep</code> cẩn thận loại chính nó ra, nhưng không loại cha nó:</p>
<pre><code>bash -c 'pgrep -af "sleep 1000"; echo ---'
bash -c 'pkill -f "sleep 9999"; echo "dòng này có in không?"'
echo \$?</code></pre>
<div class="out">2961 sleep 1000
3041 bash -c pgrep -af "sleep 1000"; echo ---
---
143</div>
<p>Lệnh đầu tìm ra <code>sleep</code> thật <em>VÀ</em> cái <code>bash -c</code> chứa mẫu. Lệnh thứ hai còn tệ hơn: <code>pkill</code> không hề thấy <code>sleep 9999</code> nào — nhưng nó thấy chính shell của nó, gửi SIGTERM, và <code>echo</code> không bao giờ chạy (trạng thái 143). Cùng cơ chế đó sinh ra một vòng "chờ tới khi deploy xong" chờ mãi mãi, vì <code>bash -c "… deploy …"</code> của chính vòng lặp luôn khớp. (Lạ một điều: <code>bash -c 'pgrep -af "sleep 1000"'</code> với <em>MỘT</em> lệnh duy nhất lại không hiện shell: bash tự thay mình bằng lệnh cuối cùng đó thay vì fork, nên chẳng còn <code>bash</code> nào để khớp.)</p>
<ul>
<li>Khớp đúng tên chương trình khi có thể: <code>pgrep -x nginx</code>.</li>
<li>Đặt mẫu trong file script hoặc biến, đừng viết thẳng vào chuỗi <code>bash -c</code> hay <code>ssh host '…'</code>.</li>
<li>Bắt buộc phải dùng thì dùng mẹo ngoặc vuông trong một lệnh RIÊNG: <code>pgrep -af "[s]leep 1000"</code>.</li>
<li>Tốt hơn hết là dùng thứ không thể nhầm: file PID, <code>systemctl</code>, hoặc cổng.</li>
</ul>

<h3>Khi cái tên nói dối: tìm theo cổng</h3>
${slide('lx-05', 20, 'Tiến trình đổi tên thì pkill hụt — diệt theo cổng')}
<p>Chương trình có thể tự đổi tên. Node cho phép đặt <code>process.title</code>, và Next.js đặt nó thành <code>next-server (vX.Y.Z)</code>, thứ viết lại những gì <code>ps</code> hiện ra — nên cái mẫu bạn gõ một cách tự nhiên khớp trúng con số không. Dựng lại đúng chuyện đó trên Mac với một file <code>start.js</code> ba dòng đặt tên như vậy rồi nghe cổng 19051:</p>
<pre><code class="language-bash">node start.js --port 19051 &amp;
pkill -f "next start"; echo "rc=\$?"
ps -o pid,comm,args -p \$(lsof -ti:19051)
lsof -ti:19051 | xargs kill; lsof -ti:19051 || echo "cổng trống"</code></pre>
<div class="out">rc=1
  PID COMM             ARGS
78187 next-server (v15 next-server (v15.5.4)
cổng trống</div>
<p><code>pkill</code> trả 1, "không khớp gì", trong khi server cũ vẫn giữ cổng còn server mới chết vì <code>EADDRINUSE</code> (cổng đang bị dùng) — đó là sự cố thật đằng sau bài này. Một cổng, khác với một cái tên, chỉ có đúng một chủ. <code>lsof -t</code> chỉ in PID, <code>-i:19051</code> chọn các kết nối ở cổng đó, và <code>xargs -r kill</code> chỉ gửi SIGTERM nếu tìm thấy gì (<code>-r</code> là của GNU; <code>xargs</code> của macOS vốn đã bỏ qua đầu vào rỗng). Trên Linux, <code>ss -ltnp 'sport = :3000'</code> và <code>fuser -k 3000/tcp</code> (gói <code>psmisc</code>) làm được y hệt.</p>
<table>
<tr><th>Lệnh / cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>kill -SIG PID</code></td><td>gửi tín hiệu theo tên (chạy mọi nơi) hoặc theo số</td><td><code>kill -TERM 5012</code></td></tr>
<tr><td><code>kill -0 PID</code></td><td>không gửi gì; mã 0 nếu tiến trình tồn tại và bạn có quyền gửi</td><td><code>kill -0 5012 &amp;&amp; echo còn sống</code></td></tr>
<tr><td><code>kill -l [N]</code></td><td>liệt kê tín hiệu, hoặc gọi tên một số / mã thoát</td><td><code>kill -l 137</code> → <code>KILL</code></td></tr>
<tr><td><code>pgrep</code> / <code>pkill</code> <code>-x</code></td><td>đúng tên tiến trình</td><td><code>pkill -x nginx</code></td></tr>
<tr><td><code>-f</code></td><td>khớp cả dòng lệnh (nguy hiểm)</td><td><code>pgrep -af "node dist"</code></td></tr>
<tr><td><code>-u</code> · <code>-P</code></td><td>của người dùng · con của PID</td><td><code>pkill -P \$\$</code></td></tr>
<tr><td><code>-n</code> · <code>-o</code></td><td>chỉ cái mới nhất · chỉ cái cũ nhất</td><td><code>pgrep -n node</code></td></tr>
<tr><td><code>-a</code> (Linux) / <code>-l</code></td><td>in dòng lệnh / in tên bên cạnh PID</td><td><code>pgrep -a sshd</code></td></tr>
<tr><td><code>killall TÊN</code></td><td>mọi tiến trình có đúng tên đó</td><td><code>killall -HUP nginx</code></td></tr>
<tr><td><code>lsof -ti:CỔNG</code></td><td>PID đang giữ một cổng</td><td><code>lsof -ti:3000 | xargs -r kill</code></td></tr>
</table>
<h3>Thang leo</h3>
${slide('lx-05', 17, 'Leo thang TERM → chờ → KILL; docker stop đo thật')}
<pre><code><span class="tok-comment"># 1. Hỏi một cách lịch sự, rồi chờ — với đại đa số trường hợp thì chừng này là đủ</span>
kill 5012
sleep 5
kill -0 5012 2&gt;/dev/null &amp;&amp; echo "vẫn chạy" || echo "đi rồi"

<span class="tok-comment"># 2. Chỉ khi nó thật sự kẹt cứng</span>
kill -9 5012</code></pre>
<div class="callout warn"><strong><code>kill -9</code> là lựa chọn TỆ nhất, không phải lựa chọn MẠNH nhất.</strong> Vì SIGKILL không bắt được, tiến trình không có cơ hội nào để xả bộ đệm ghi, hoàn tất một giao dịch đang dở, xoá file PID của nó hay đóng các kết nối mạng. Điều đó nghĩa là: một cơ sở dữ liệu phải chạy khôi phục sau sự cố ở lần khởi động sau, một file ghi dở, một file khoá cũ chặn hẳn lần khởi động kế tiếp, và những tiến trình con mồ côi. Chỉ với tay lấy nó SAU KHI đã gửi SIGTERM vài giây và thấy rõ là thất bại — và nhớ rằng một tiến trình ở trạng thái <code>D</code> (Bài 5.1) cũng chẳng chết vì nó, bởi nó có đang chạy đâu mà nhận.</div>

<h3>docker stop, đo thật</h3>
<p><code>docker stop</code> chính là cái thang này được tự động hoá: SIGTERM, một khoảng ân hạn (grace period), rồi SIGKILL. Ba container, dừng bằng <code>docker stop -t 10</code>:</p>
<table>
<tr><th>PID 1 của container</th><th>Mất bao lâu để dừng</th><th>Mã thoát</th></tr>
<tr><td><code>sleep 300</code> — không bộ xử lý, không init</td><td>10,2 giây</td><td>137 (SIGKILL sau khoảng ân hạn)</td></tr>
<tr><td><code>sleep 300</code> kèm <code>--init</code></td><td>0,1 giây</td><td>143 (tini chuyển TERM, sleep chết vì nó)</td></tr>
<tr><td><code>bash</code> có <code>trap "…; exit 0" TERM</code></td><td>0,1 giây</td><td>0 (tắt sạch sẽ)</td></tr>
</table>
<p>Tài liệu Docker ghi khoảng ân hạn mặc định cho container Linux là 10 giây; trên Docker Desktop của chiếc Mac này, <code>docker stop</code> KHÔNG kèm <code>-t</code> đã giết sau khoảng 3 giây. Đừng dựa vào con số mặc định — hãy đặt <code>-t</code> hoặc <code>stop_grace_period</code>, và làm cho chương trình xử lý TERM.</p>
<h3>Tắt êm thấm, nhìn từ phía chương trình</h3>
${slide('lx-05', 18, 'trap và mặt nạ SigIgn/SigCgt')}
<pre><code><span class="tok-comment"># Trong bash — Chương 7 nói về trap tử tế</span>
trap 'echo "đang dọn dẹp"; rm -f /tmp/work.lock; exit 0' TERM INT
trap 'rm -rf "\$TMPDIR"' EXIT     <span class="tok-comment"># EXIT chạy khi thoát theo BẤT KỲ đường nào</span></code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Trong Node.js — cùng một ý tưởng, và là lý do docker stop cần tới nó</span>
process.on('SIGTERM', async () =&gt; {
  server.close();                 <span class="tok-comment"># ngừng nhận kết nối mới</span>
  await pool.end();               <span class="tok-comment"># chạy nốt các truy vấn đang dở</span>
  process.exit(0);
});</code></pre>
<p>Đây không phải chuyện lý thuyết. <code>docker stop</code> gửi SIGTERM, chờ mười giây, rồi gửi SIGKILL. Một container lờ SIGTERM đi thì mất mười giây mới dừng <em>VÀ</em> chết một cách bạo lực ở mỗi lần deploy. Xử lý SIGTERM làm cho việc deploy vừa nhanh hơn vừa an toàn hơn, và thường chỉ tốn năm dòng.</p>
<div class="callout ok">Một điểm tinh tế đáng biết: trong một container, ứng dụng của bạn thường chạy ở vị trí PID 1, mà <strong>PID 1 KHÔNG nhận hành động tín hiệu mặc định</strong> — nhân bảo vệ nó, nên một tiến trình không có bộ xử lý SIGTERM tường minh sẽ đơn giản là không chết vì <code>docker stop</code>. Ghép với nghĩa vụ thu dọn xác sống ở Bài 5.1, đó là toàn bộ lý do <code>docker run --init</code> và <code>tini</code> tồn tại. Nếu container của bạn lần nào cũng mất đúng mười giây để dừng, lý do là đây.</div>

<h3>Nạp lại so với khởi động lại</h3>
<pre><code class="language-bash">sudo nginx -t                        <span class="tok-comment"># LUÔN kiểm cấu hình trước</span>
sudo systemctl reload nginx          <span class="tok-comment"># SIGHUP — đọc lại cấu hình, vẫn phục vụ</span>
sudo systemctl restart nginx         <span class="tok-comment"># dừng rồi chạy lại — có gián đoạn ngắn</span>
sudo kill -HUP \$(cat /run/nginx.pid) <span class="tok-comment"># cũng chính là nạp lại đó, làm bằng tay</span>
sudo kill -USR1 \$(cat /run/nginx.pid) <span class="tok-comment"># nginx: mở lại file log, phục vụ việc xoay vòng</span></code></pre>
<p><code>SIGUSR1</code> và <code>SIGUSR2</code> hoàn toàn KHÔNG có ý nghĩa nào do nhân định sẵn — chúng tồn tại để chương trình tự định nghĩa. nginx dùng USR1 cho "mở lại log" và USR2 cho "chạy một bản nhị phân mới song song với bản cũ", và đó là cách nó tự nâng cấp mà không rớt một kết nối nào. Hãy tra sách hướng dẫn của đúng cái daemon đó; không có luật chung, chỉ có quy ước.</p>
<div class="callout warn">Hãy kiểm trước khi nạp lại. <code>nginx -t</code> xác thực file cấu hình; bỏ qua nó rồi nạp lại một cấu hình hỏng sẽ để các tiến trình thợ cũ chạy tiếp nhưng đồng nghĩa với việc lần khởi động <em>KẾ TIẾP</em> — có thể là 3 giờ sáng, do một chuyện khác kích hoạt — sẽ không lên nổi. Chỗ hỏng lộ ra rất lâu sau thay đổi, và đó là kiểu tệ nhất.</div>

<h3>Xem một tiến trình làm gì với tín hiệu</h3>
<pre><code class="language-bash">grep -E 'SigCgt|SigIgn|SigBlk' /proc/812/status
sudo strace -p 5012 -e trace=signal      <span class="tok-comment"># xem tín hiệu tới, ngay lúc đó</span></code></pre>
<div class="out">SigBlk: 0000000000000000
SigIgn: 0000000000001000
SigCgt: 0000000180014a03</div>
<p>Mấy con số hệ mười sáu đó liệt kê những tín hiệu mà tiến trình lờ đi (<code>SigIgn</code>) và những tín hiệu nó bắt bằng một bộ xử lý (<code>SigCgt</code>). Đó là một trường mỗi tín hiệu một bit, nên bit 0 là tín hiệu 1. Bạn sẽ hiếm khi giải mã nó bằng tay, nhưng khi một tiến trình từ chối chết vì SIGTERM, đây là file chứng minh được nó đang LỜ tín hiệu đi hay chỉ đơn giản là đang KẸT — hai vấn đề rất khác nhau.</p>

<h3>Chạy thử từng bước</h3>
<p>Một script mười dòng tự dọn dẹp sau khi chết, và bốn lệnh chứng minh từng dòng <code>trap</code> làm đúng điều nó nói. Lưu thành <code>don.sh</code> trong <code>~/thu-linux/ch5</code> rồi <code>chmod +x</code>.</p>
<pre><code class="language-bash">#!/bin/bash
lock=/tmp/deploy.lock
don_dep() {
  echo "nhận tín hiệu — dọn dẹp"
  rm -f "\$lock"
}
trap don_dep EXIT
trap 'exit 143' TERM INT
trap '' HUP
touch "\$lock"; sleep 300 &amp; wait</code></pre>
<pre><code class="language-bash">./don.sh &amp; p=\$!
kill -HUP \$p; sleep 0.3; kill -0 \$p &amp;&amp; echo "HUP: vẫn sống"
kill \$p; wait \$p; echo "mã thoát: \$?"
ls /tmp/deploy.lock</code></pre>
<div class="out">HUP: vẫn sống
nhận tín hiệu — dọn dẹp
mã thoát: 143
ls: cannot access '/tmp/deploy.lock': No such file or directory</div>
<p>HUP bị lờ (<code>trap '' HUP</code>), nên script sống sót qua nó. TERM chạy <code>exit 143</code>, và việc thoát kích hoạt trap <code>EXIT</code>, thứ xoá file khoá — đó chính là khuôn mẫu: các trap tín hiệu quyết định <em>CÓ</em> thoát hay không, còn một trap EXIT lo dọn dẹp. Cụm <code>&amp; wait</code> quan trọng: bash chỉ chạy trap ở giữa hai lệnh, nên một script đang bị chặn trong một <code>sleep 300</code> ở tiền cảnh sẽ không dọn dẹp cho tới khi sleep xong; còn <code>wait</code> thì bị tín hiệu ngắt ngay lập tức. Một điều nữa đáng để ý: tiến trình con <code>sleep 300</code> vẫn đang chạy sau đó — hãy giết con của mình trong phần dọn dẹp (<code>kill \$(jobs -p)</code>) nếu chúng không được sống lâu hơn bạn. (Container Ubuntu 24.04.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Linux / WSL2</th><th>macOS</th></tr>
<tr><td>Số hiệu tín hiệu</td><td>STOP 19 · TSTP 20 · CONT 18 · USR1 10 · CHLD 17</td><td><code>kill -l 17 18 19 30</code> → <code>STOP TSTP CONT USR1</code>. Số KHÁC — <strong>luôn dùng tên</strong></td></tr>
<tr><td>HUP · INT · QUIT · KILL · TERM</td><td>1 · 2 · 3 · 9 · 15</td><td>giống hệt</td></tr>
<tr><td><code>pgrep -a</code></td><td>hiện dòng lệnh</td><td>"kèm tổ tiên"; dùng <code>pgrep -lf</code></td></tr>
<tr><td><code>pidof</code>, <code>fuser -k CỔNG/tcp</code></td><td>có</td><td>không có <code>pidof</code>; <code>fuser</code> có nhưng không có dạng <code>-k CỔNG/tcp</code> — dùng <code>lsof -ti:CỔNG</code></td></tr>
<tr><td><code>/proc/PID/status</code> (SigIgn/SigCgt)</td><td>có</td><td>không có</td></tr>
</table>
<p>bash của Mac là bản 3.2, nhưng <code>trap</code>, <code>kill -0</code> và <code>kill -l</code> hành xử y hệt. Trên WSL2 mọi thứ là Linux — với một điểm đáng nhớ: đóng tab Windows Terminal làm shell "gác máy" y như SSH rớt (Bài 5.4).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> script deploy của nhóm để lại một file <code>/tmp/deploy.lock</code> cũ mỗi khi có người bấm <code>Ctrl-C</code>, và lần deploy sau từ chối khởi động. Sửa script, rồi chứng minh — trong <code>~/thu-linux/ch5</code> hoặc một container vứt đi.</p><ol>
<li>Viết <code>khoa.sh</code> tạo <code>/tmp/deploy.lock</code>, rồi <code>sleep 300 &amp; wait</code>, <strong>KHÔNG</strong> có trap. Chạy nó ở nền, <code>kill</code> nó, và xác nhận file khoá nằm lại còn <code>\$?</code> là 143.</li>
<li>Thêm một trap <code>EXIT</code> xoá file khoá và một trap <code>TERM INT</code> để thoát; lặp lại và xác nhận file khoá đã mất.</li>
<li>Chạy lại script rồi dừng nó bằng <code>kill -INT</code>. <code>kill -l</code> gọi 143 là TERM dù bạn gửi INT — giải thích vì sao bằng cách đọc lại chính dòng trap của bạn.</li>
<li>Khởi động <code>python3 -m http.server 19050 &amp;</code> (hoặc server bất kỳ) rồi dừng nó <em>THEO CỔNG</em> bằng <code>lsof -ti:19050 | xargs -r kill</code>, rồi kiểm lại cổng đã trống.</li></ol>
<p><strong>Đạt khi:</strong> không có trap thì file khoá sống sót qua <code>kill</code>; có trap thì file khoá biến mất với cả TERM lẫn INT; bạn giải thích được vì sao INT vẫn kết thúc bằng 143; và cuối cùng <code>lsof -ti:19050</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signal (tín hiệu)</span><span class="v">Một thông báo nhỏ có số hiệu mà nhân chuyển tới một tiến trình.</span></div>
  <div class="kv"><span class="k">SIGTERM / SIGKILL (xin tắt / giết ngay)</span><span class="v">"Làm ơn thoát" (bắt được, 15) · "chết ngay" (không bắt được, 9).</span></div>
  <div class="kv"><span class="k">SIGINT / SIGHUP (ngắt / gác máy)</span><span class="v">Gửi bởi <code>Ctrl-C</code> (2) · gửi khi terminal mất, được dùng lại với nghĩa "nạp lại" (1).</span></div>
  <div class="kv"><span class="k">Handler / trap (bộ xử lý / bẫy)</span><span class="v">Đoạn mã chương trình chạy khi tín hiệu tới; trong bash đặt bằng <code>trap</code>.</span></div>
  <div class="kv"><span class="k">Signal mask — SigIgn/SigCgt (mặt nạ tín hiệu)</span><span class="v">Bản đồ bit trong <code>/proc/PID/status</code>: tín hiệu bị lờ · tín hiệu có hàm bắt.</span></div>
  <div class="kv"><span class="k">Foreground process group (nhóm tiến trình tiền cảnh)</span><span class="v">Nhóm mà terminal gửi <code>Ctrl-C</code> tới — cả một chuỗi ống.</span></div>
  <div class="kv"><span class="k">Grace period (khoảng ân hạn)</span><span class="v">Thời gian giữa SIGTERM và SIGKILL trong <code>docker stop</code>, <code>systemctl stop</code>, Kubernetes.</span></div>
  <div class="kv"><span class="k">Exit code 128+N (mã thoát 128+N)</span><span class="v">Cách shell báo "chết vì tín hiệu N": 130, 137, 143…</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ SIGKILL và SIGSTOP là không bắt, không lờ được; mọi tín hiệu khác là một lời yêu cầu chương trình có quyền tự xử lý.</li>
<li><code>Ctrl-C</code> là SIGINT gửi tới cả chuỗi ống ở tiền cảnh; chết vì tín hiệu N hiện thành mã thoát 128+N.</li>
<li>Job nền của một script không tương tác lờ SIGINT và SIGQUIT — dùng TERM để dừng chúng.</li>
<li>Leo thang có chủ ý: TERM, chờ, kiểm bằng <code>kill -0</code>, rồi mới tới KILL.</li>
<li><code>pgrep -f</code>/<code>pkill -f</code> có thể khớp chính shell của bạn và hụt chương trình đã đổi tên; diệt theo cổng bằng <code>lsof -ti:CỔNG</code>.</li>
<li>Bẫy TERM/INT để quyết định thoát, bẫy EXIT để dọn dẹp; dùng tên tín hiệu, vì số hiệu khác nhau trên macOS.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">signal(7) — bảng đầy đủ</span><span class="lc-sub">Mọi tín hiệu, số hiệu, hành động mặc định, và có bắt được hay không. Trang duy nhất đáng đánh dấu lại từ bài này.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Signals.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Signals và trap</span><span class="lc-sub">Bash xử lý tín hiệu trong script và khi tương tác ra sao, cùng ngữ nghĩa chính xác của <code>trap</code>, gồm cả các tín hiệu giả EXIT và ERR.</span></span>
</a>
<a class="link-card" href="https://cloud.google.com/blog/topics/developers-practitioners/kubernetes-best-practices-terminating-with-grace" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Terminating with grace</span><span class="lc-sub">Chuỗi SIGTERM → thời gian ân hạn → SIGKILL đúng như container và bộ điều phối cài đặt nó, kèm sơ đồ thời gian. Giải thích dứt điểm mã thoát 137.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dừng nó cho đúng cách</span><span class="lc-sub">Bài chấm điểm: một script bẫy SIGTERM rồi dọn dẹp, một tiến trình kẹt cần leo thang, và đọc ngược các mã thoát 130 / 137 / 143 về đúng nguyên nhân.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> với tay lấy <code>kill -9</code> đầu tiên vì nó "lúc nào cũng ăn". Nó KHÔNG phải lúc nào cũng ăn — một tiến trình đang ngủ không ngắt được thì lờ nó đi, còn một xác sống thì chết rồi — và khi nó ăn thật thì nó bỏ qua mọi việc dọn dẹp mà chương trình định làm. Thói quen đó trả giá bằng dữ liệu thật: file ghi dở, cơ sở dữ liệu phải khôi phục ở lần khởi động sau, và file khoá chặn lần chạy kế tiếp. Hãy <code>kill</code>, chờ năm giây, kiểm bằng <code>kill -0</code>, rồi mới leo thang. Nếu bạn thấy mình phải dùng <code>-9</code> như cơm bữa thì lỗi nằm ở chỗ chương trình không xử lý SIGTERM — hãy sửa chỗ đó.</div>
<p class="note-ct"><strong>Hai thứ đáng học thuộc hẳn.</strong> <strong>128 + N</strong>: một mã thoát lớn hơn 128 gọi tên chính cái tín hiệu đã giết tiến trình — 130 Ctrl-C, 137 SIGKILL/OOM, 143 SIGTERM — và riêng phép tính ấy giải mã được một phần lớn những lỗi "bí ẩn" của CI và container. Và <strong><code>pgrep</code> trước <code>pkill</code></strong>: tham số giống hệt nhau, nên danh sách bạn vừa đọc chính xác là danh sách bạn sắp giết.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Jobs, background, and surviving a closed terminal|||5.4 — Job, chạy nền, và sống sót khi terminal đóng lại',
      slug: 'lnx-5-4-job-chay-nen',
      type: 'LESSON',
      description: 'Ctrl-Z, jobs, fg, bg, & và $!; vì sao đóng SSH lại giết tiến trình đang chạy nền; nohup, disown và setsid khác nhau ra sao; và vì sao tmux mới là câu trả lời thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Jobs, background, and surviving a closed terminal</h2>
<p class="lead">You start a long build over SSH, your laptop sleeps, the connection drops — and the build is dead. Understanding why takes one concept, the <em>session</em>, and fixing it properly takes one tool, <code>tmux</code>. This lesson covers both, plus the job-control commands that make a single terminal behave like several.</p>

<h3>Foreground, background, suspended</h3>
${slide('lx-05', 21, 'Ctrl-Z, bg, fg — gõ phím thật vào một pty')}
<pre><code>./long-build.sh              <span class="tok-comment"># foreground: the shell waits, your terminal is busy</span>
<span class="tok-comment"># press Ctrl-Z</span></code></pre>
<div class="out">[1]+  Stopped                 ./long-build.sh</div>
<pre><code>jobs                         <span class="tok-comment"># what this shell is managing</span>
bg                           <span class="tok-comment"># resume it in the BACKGROUND</span>
fg                           <span class="tok-comment"># bring it back to the FOREGROUND</span>
fg %1                        <span class="tok-comment"># by job number</span>
kill %1                      <span class="tok-comment"># signal a JOB rather than a PID</span></code></pre>
<div class="out">[1]+  Stopped                 ./long-build.sh
[1]+  ./long-build.sh &amp;
[1]+  ./long-build.sh</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Foreground</span><span class="lz-lnote">Owns the terminal. Receives your keystrokes, and receives Ctrl-C. The shell blocks until it exits.</span></div>
  <div class="lz-layer"><span class="lz-lname">Background (<code>&amp;</code>)</span><span class="lz-lnote">Running, but the shell does not wait. Its output still lands in your terminal — which is why background jobs interleave messily unless you redirect. Reading from stdin stops it with <code>SIGTTIN</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Suspended (Ctrl-Z)</span><span class="lz-lnote">Frozen, using no CPU. Sends <code>SIGTSTP</code> — the catchable cousin of SIGSTOP (Lesson 5.3). Resume with <code>fg</code> or <code>bg</code>.</span></div>
</div>
<div class="callout ok">Ctrl-Z is the most under-used key in the terminal. Stuck in <code>vim</code> and need one command? Ctrl-Z, run it, then <code>fg</code>. Started a huge <code>grep</code> and want your prompt back without losing it? Ctrl-Z then <code>bg</code>. It beats opening a second SSH connection, and it is two keystrokes.</div>

<h3>Starting in the background, and \$!</h3>
${slide('lx-05', 22, '&, $! và wait từng PID')}
<pre><code class="language-bash">./build.sh &amp;                       <span class="tok-comment"># start in the background</span>
echo \$!                            <span class="tok-comment"># PID of the most recent background job</span>
wait \$!                            <span class="tok-comment"># block until it finishes</span>
echo \$?                            <span class="tok-comment"># and get its exit code</span>

<span class="tok-comment"># Run three things in parallel and wait for all of them</span>
./task-a.sh &amp; ./task-b.sh &amp; ./task-c.sh &amp;
wait
echo "all three finished"</code></pre>
<div class="out">[1] 5219
[1]+  Done                    ./build.sh
0
all three finished</div>
<p>That last pattern is real parallelism in three lines, and it is how a deploy script builds two images at once. Chapter 7 adds error handling to it; the catch to know now is that a bare <code>wait</code> returns 0 regardless of what the jobs did — you must collect each PID and <code>wait</code> on it individually if you care whether they succeeded.</p>
<div class="callout warn">Always redirect a background job's output. <code>./build.sh &amp;</code> keeps writing to your terminal, so its output interleaves with whatever you type next, and you cannot tell which line came from where. <code>./build.sh &gt; build.log 2&gt;&amp;1 &amp;</code> is the form to use — and note the <code>2&gt;&amp;1</code> goes before the <code>&amp;</code>, per Lesson 3.1.</div>

<h3>The bare-wait trap, measured</h3>
<p>The warning above is worth seeing once, because the failure is silent. Three jobs, one of which fails with status 3:</p>
<pre><code class="language-bash">( sleep 1; echo "build-api xong" )    &amp; p1=\$!
( sleep 2; echo "build-web xong" )    &amp; p2=\$!
( sleep 1; echo "test hỏng"; exit 3 ) &amp; p3=\$!
loi=0
for p in \$p1 \$p2 \$p3; do
  wait "\$p" || { echo "PID \$p hỏng, mã \$?"; loi=1; }
done; echo "tổng kết → \$loi"</code></pre>
<div class="out">build-api xong
test hỏng
build-web xong
PID 3680 hỏng, mã 3
tổng kết → 1</div>
<p>Now insert a plain <code>wait; echo "wait trần → \$?"</code> <em>before</em> the <code>for</code> loop and run it again. It prints <code>wait trần  → 0</code>, and then every <code>wait "\$p"</code> fails with <code>bash: line 7: wait: pid 3665 is not a child of this shell</code> and status 127: a bare <code>wait</code> not only returns 0, it also makes bash <em>forget</em> the jobs it collected, so the per-PID statuses are gone for good. Wait on each PID, and only on each PID. (Ubuntu 24.04 container, both versions run for real.)</p>
<h3>Why closing the terminal kills it</h3>
${slide('lx-05', 23, 'SIGHUP cho cả phiên: ai sống sót')}
<p>Background is not detached. The job is still a child of your shell, in your shell's <em>session</em>, attached to your terminal:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · You disconnect</span><span class="lz-t">SSH connection drops, or you close the window</span><span class="lz-d">The terminal device goes away.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Kernel notices</span><span class="lz-t">sends SIGHUP to the session leader</span><span class="lz-d">That is your shell. "Hang up" — the modem metaphor from Lesson 5.3.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell forwards it</span><span class="lz-t">SIGHUP to every job it owns</span><span class="lz-d">Foreground AND background alike. Default action for SIGHUP is terminate.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Your build dies</span><span class="lz-t">two hours in, with no output saved</span><span class="lz-d">And nothing tells you why, because the log went to a terminal that no longer exists.</span></div>
</div>
<p>So <code>&amp;</code> answers "can I keep using this terminal", not "will this survive me leaving". Those are different questions with different solutions.</p>

<h3>Three ways to detach — and what each actually does</h3>
${slide('lx-05', 24, 'nohup · disown · setsid · tmux · systemd sống tới đâu')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>nohup cmd &amp;</code></span><span class="v">Makes the process <strong>ignore</strong> SIGHUP, and redirects output to <code>nohup.out</code> if you did not redirect it yourself. Decide before you start.</span></div>
  <div class="kv"><span class="k"><code>disown -h %1</code></span><span class="v">Removes the job from the shell's table so the shell <strong>never sends</strong> SIGHUP. Works on something already running — the rescue when you forgot <code>nohup</code>.</span></div>
  <div class="kv"><span class="k"><code>setsid cmd</code></span><span class="v">Starts the process in a <strong>brand-new session</strong> with no controlling terminal. The cleanest break, and how daemons are traditionally created.</span></div>
</div>
<pre><code><span class="tok-comment"># Decided in advance</span>
nohup ./long-build.sh &gt; build.log 2&gt;&amp;1 &amp;

<span class="tok-comment"># Forgot, and it is already running — rescue it</span>
<span class="tok-comment"># Ctrl-Z, then:</span>
bg
disown -h %1

<span class="tok-comment"># Fully detached, output to a file, no terminal at all</span>
setsid ./long-build.sh &gt; build.log 2&gt;&amp;1 &lt; /dev/null &amp;</code></pre>
<div class="out">(the terminal stays silent: with &gt; build.log 2&gt;&amp;1, nohup's own "nohup: ignoring input" goes into build.log)
[1]+  ./long-build.sh &amp;
[1]+  Running                 ./long-build.sh &amp;</div>
<div class="callout"><code>disown -h</code> is worth remembering specifically because it works <em>after the fact</em>. You are an hour into a build, realise you need to close the laptop, and it is too late for <code>nohup</code> — Ctrl-Z, <code>bg</code>, <code>disown -h %1</code> and the job survives. Without <code>-h</code>, <code>disown</code> removes the job from the table entirely, which also works but means <code>jobs</code> can no longer see it.</div>

<h3>Proving it: who survives a hang-up</h3>
<p>This was typed into a real pseudo-terminal running <code>bash -i</code> in an Ubuntu container. Four sleeps, one per method, then the shell receives SIGHUP — exactly what the kernel sends when an SSH connection drops:</p>
<pre><code>sleep 501 &amp;
nohup sleep 502 &amp;
sleep 503 &amp;
disown -h %3
setsid sleep 504 &amp;
kill -HUP \$\$</code></pre>
<p>From another shell afterwards:</p>
<pre><code>ps -o pid,ppid,sid,tty,stat,cmd -C sleep</code></pre>
<div class="out">   3507       1    3504 ?        Z    [sleep] &lt;defunct&gt;
   3509       1    3504 ?        S    sleep 502
   3510       1    3504 ?        S    sleep 503
   3515       1    3515 ?        Ss   sleep 504</div>
<p>The plain <code>&amp;</code> job died (it shows as a zombie only because this container's PID 1 does not reap — Lesson 5.1). The <code>nohup</code> and <code>disown -h</code> jobs survived <em>inside</em> the old session 3504; the <code>setsid</code> one survived in its own session 3515 — the <code>SID</code> column is the proof. Two small surprises from the same session: <code>jobs</code> reported the <code>setsid</code> job as <code>Done</code> immediately, because when <code>setsid</code> is already a process-group leader it forks and lets the original exit, so the shell loses track of the real <code>sleep</code>; and with <code>nohup … &gt; build.log 2&gt;&amp;1</code>, the <code>nohup: ignoring input</code> message lands in <code>build.log</code>, not on your screen.</p>
<h3>tmux: the answer you should actually use</h3>
${slide('lx-05', 25, 'tmux: tách ra rồi gắn lại')}
<p>All three tricks above share a flaw: once you disconnect, <strong>you cannot get back to the program</strong>. You can read its log file, but you cannot answer its prompt, scroll its output, or Ctrl-C it. A terminal multiplexer keeps a real terminal alive on the server, and lets you attach and detach from it at will.</p>
<pre><code>tmux new -s deploy           <span class="tok-comment"># create a named session</span>
<span class="tok-comment"># … run anything, however long …</span>
<span class="tok-comment"># Ctrl-B then D to detach. The connection can now drop safely.</span>

tmux ls                      <span class="tok-comment"># what sessions exist</span>
tmux attach -t deploy        <span class="tok-comment"># come back, from any machine</span>
tmux kill-session -t deploy  <span class="tok-comment"># when done</span></code></pre>
<div class="out">deploy: 1 windows (created Fri Aug 22 13:02:11 2026) [80x24]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-B D</span><span class="v">Detach. The session keeps running on the server.</span></div>
  <div class="kv"><span class="k">Ctrl-B C</span><span class="v">New window. Ctrl-B then a number switches between them.</span></div>
  <div class="kv"><span class="k">Ctrl-B %</span><span class="v">Split vertically · <code>Ctrl-B "</code> horizontally · <code>Ctrl-B</code> + arrow keys to move.</span></div>
  <div class="kv"><span class="k">Ctrl-B [</span><span class="v">Scroll mode — page up through output. <code>q</code> to leave. This alone justifies tmux over <code>nohup</code>.</span></div>
</div>
<div class="callout ok"><strong>The habit worth building: run <code>tmux attach || tmux new</code> the moment you SSH into a server, before doing anything else.</strong> Then no command you start is ever at the mercy of your network. A dropped Wi-Fi connection becomes an inconvenience rather than a two-hour build lost, and you can reattach from your phone to the exact screen you left. <code>screen</code> is the older equivalent and is fine if it is what the server has; the concept is identical.</div>

<h3>When none of these is right</h3>
<p>If a program should keep running <em>across reboots</em>, none of these tools is the answer — they all die when the machine restarts. That is what a service manager is for:</p>
<pre><code class="language-bash">sudo systemctl enable --now myapp     <span class="tok-comment"># starts at boot, restarts on crash</span>
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&amp;</code></span><span class="v">"Give me my prompt back." Dies when the terminal closes.</span></div>
  <div class="kv"><span class="k"><code>nohup</code> / <code>disown</code></span><span class="v">"Survive this SSH session." Dies on reboot. No way back to the program.</span></div>
  <div class="kv"><span class="k"><code>tmux</code></span><span class="v">"Survive this SSH session, and let me come back." Dies on reboot. Right for interactive long work.</span></div>
  <div class="kv"><span class="k">systemd unit</span><span class="v">"Run forever, restart on failure, start at boot, log to journald." The only correct answer for a service. Chapter 11.</span></div>
</div>
<div class="callout warn">A production application started with <code>nohup node server.js &amp;</code> works right up until the server reboots — after a kernel update, a power event, or the provider migrating your VM — and then it is simply gone, with nothing configured to bring it back. If a process matters, it belongs in a systemd unit. <code>nohup</code> is for a one-off job you are watching, not for anything that should still be running next week.</div>

<h3>Try it step by step</h3>
<p>Type these into an interactive shell, pressing the keys where the comments say — job control needs a real terminal, so this does not work inside a script.</p>
<pre><code>sleep 300            <span class="tok-comment"># then press Ctrl-Z</span>
jobs -l
bg
sleep 400 &amp;
jobs
fg %1                <span class="tok-comment"># then press Ctrl-C</span>
echo \$?
kill %2; sleep 0.2; jobs</code></pre>
<div class="out">^Z
[1]+  Stopped                 sleep 300
[1]+  3475 Stopped                 sleep 300
[1]+ sleep 300 &amp;
[2] 3480
[1]-  Running                 sleep 300 &amp;
[2]+  Running                 sleep 400 &amp;
sleep 300
^C
130
[2]+  Terminated              sleep 400</div>
<p>Read the markers: <code>+</code> is the "current" job that a bare <code>fg</code>/<code>bg</code> acts on, <code>-</code> the previous one. <code>fg</code> prints the command it resumes; <code>Ctrl-C</code> on the foreground job gives 130 = 128 + SIGINT; <code>kill %2</code> sends SIGTERM to a job without needing its PID, and <code>jobs</code> reports <code>Terminated</code> the next time it runs. (Keystrokes typed into a real pty, Ubuntu 24.04 container.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td><code>Ctrl-Z</code>, <code>jobs</code>, <code>fg</code>, <code>bg</code>, <code>disown</code></td><td>bash</td><td>the same in zsh (the default shell) and in <code>/bin/bash</code> 3.2</td></tr>
<tr><td><code>nohup</code></td><td>coreutils</td><td>present (<code>/usr/bin/nohup</code>)</td></tr>
<tr><td><code>setsid</code></td><td>util-linux</td><td>absent — <code>setsid not found</code></td></tr>
<tr><td><code>tmux</code></td><td><code>apt install tmux</code></td><td><code>brew install tmux</code>; the terminal app's own tabs are not a substitute</td></tr>
<tr><td>Closing the window</td><td>SIGHUP to the shell</td><td>the same; zsh additionally sends HUP to its jobs by default (option <code>HUP</code>)</td></tr>
</table>
<p>On WSL2, closing the Windows Terminal tab is a hang-up; and shutting down the WSL VM (<code>wsl --shutdown</code>, or Windows restarting) is a reboot for everything inside, tmux included.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are about to run a 20-minute database import on the team's VPS over the school Wi-Fi, which drops every so often. Rehearse on your own machine or in a container with <code>tmux</code> installed.</p><ol>
<li>Start <code>sleep 1200</code> in the foreground, realise you need the prompt, and move it to the background without restarting it (<code>Ctrl-Z</code>, <code>bg</code>). Confirm with <code>jobs -l</code>.</li>
<li>Make that <em>running</em> job survive a hang-up: <code>disown -h %1</code>. Start a second job with <code>nohup sleep 1201 &gt; import.log 2&gt;&amp;1 &amp;</code>.</li>
<li>Simulate the Wi-Fi drop with <code>kill -HUP \$\$</code> (this closes your shell). Open a new shell and check which sleeps are still alive with <code>ps -o pid,sid,tty,stat,cmd -C sleep</code>.</li>
<li>Do it properly: <code>tmux new -s import</code>, run <code>sleep 1202</code> inside, detach with <code>Ctrl-B d</code>, list with <code>tmux ls</code>, reattach with <code>tmux attach -t import</code>, and finally <code>tmux kill-session -t import</code>.</li></ol>
<p><strong>Done when:</strong> after the hang-up both <code>sleep 1200</code> and <code>sleep 1201</code> are still listed (with <code>?</code> in the TTY column), <code>import.log</code> contains <code>nohup: ignoring input</code>, and you reattached to the tmux session and saw <code>sleep 1202</code> still running in it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job</span><span class="v">A command (or pipeline) the shell started and is tracking, numbered <code>%1</code>, <code>%2</code>….</span></div>
  <div class="kv"><span class="k">Foreground / background</span><span class="v">Owns the terminal and receives keys · runs while the shell gives you the prompt back.</span></div>
  <div class="kv"><span class="k">Suspend (Ctrl-Z)</span><span class="v">Freeze a foreground job with SIGTSTP; resume with <code>fg</code> or <code>bg</code>.</span></div>
  <div class="kv"><span class="k">Session / session leader</span><span class="v">A group of process groups attached to one terminal; the login shell leads it.</span></div>
  <div class="kv"><span class="k">Controlling terminal</span><span class="v">The terminal whose hang-up sends SIGHUP to the session.</span></div>
  <div class="kv"><span class="k">Hang-up (SIGHUP)</span><span class="v">Signal 1, sent when the terminal disappears — SSH drop, window closed.</span></div>
  <div class="kv"><span class="k">Detach</span><span class="v">Leave something running without your terminal: nohup, disown, setsid, or tmux's <code>Ctrl-B d</code>.</span></div>
  <div class="kv"><span class="k">Terminal multiplexer (tmux)</span><span class="v">Keeps real terminals alive on the server so you can reattach from anywhere.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>Ctrl-Z</code> freezes, <code>bg</code> resumes in the background, <code>fg</code> brings back; <code>%N</code> names a job.</li>
<li><code>&amp;</code> returns the prompt; <code>\$!</code> is that job's PID; wait on each PID to get each exit code — a bare <code>wait</code> returns 0 and forgets them.</li>
<li>Background is not detached: a hang-up sends SIGHUP to the session and the shell forwards it to every job.</li>
<li><code>nohup</code> (decide before), <code>disown -h</code> (rescue after) and <code>setsid</code> (new session) each survive a hang-up, and none survives a reboot.</li>
<li>tmux is the only one that lets you come back to the program itself; make <code>tmux attach || tmux new</code> a habit.</li>
<li>Anything that must survive a reboot belongs in a systemd unit, not in any of the above.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Job-Control.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Job Control</span><span class="lc-sub">The exact semantics of <code>jobs</code>, <code>fg</code>, <code>bg</code>, <code>%</code> specifiers and <code>disown</code>, including the <code>huponexit</code> option that changes the whole behaviour.</span></span>
</a>
<a class="link-card" href="https://tmuxcheatsheet.com/" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">tmux cheat sheet</span><span class="lc-sub">Every binding on one page. Print it, use it for a week, and you will stop needing it.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/credentials.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">credentials(7) — sessions and process groups</span><span class="lc-sub">The kernel's definition of session leader, process group and controlling terminal — the model that explains exactly why SIGHUP reaches your background job.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: keep it running</span><span class="lc-sub">Graded tasks: suspend and background a running job, rescue a forgotten one with <code>disown</code>, and detach a tmux session then reattach and read its scrollback.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming <code>&amp;</code> means "detached". It means "do not block my shell" and nothing more — the job is still your shell's child, still in your session, and still gets SIGHUP when the terminal closes. The version of this that hurts is <code>ssh vps './deploy.sh &amp;'</code>: the SSH command returns immediately, the remote shell exits, SIGHUP goes out, and the deploy dies partway through — leaving a half-updated server and an SSH command that reported success. Use <code>ssh vps 'nohup ./deploy.sh &gt; deploy.log 2&gt;&amp;1 &amp;'</code>, or better, <code>ssh vps 'tmux new -d -s deploy ./deploy.sh'</code> so you can attach later and see what happened.</div>
<p class="note-ct"><strong>One habit replaces this entire lesson:</strong> type <code>tmux attach || tmux new</code> as the first command after every SSH login. Everything you then start is immune to network drops, reachable again from anywhere, and scrollable after the fact. Keep <code>Ctrl-Z</code> / <code>fg</code> / <code>bg</code> for moving things around inside one terminal, and keep <code>nohup</code> for the day you forgot — but the default should be tmux.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Job, chạy nền, và sống sót khi terminal đóng lại</h2>
<p class="lead">Bạn khởi động một bản dựng dài qua SSH, laptop ngủ, kết nối rớt — và bản dựng chết. Hiểu vì sao chỉ cần một khái niệm, cái <em>PHIÊN</em>, và chữa nó cho tử tế chỉ cần một công cụ, <code>tmux</code>. Bài này nói cả hai, cộng thêm những lệnh điều khiển job làm cho một cái terminal duy nhất hành xử như nhiều cái.</p>

<h3>Tiền cảnh, hậu cảnh, treo lại</h3>
${slide('lx-05', 21, 'Ctrl-Z, bg, fg — gõ phím thật vào một pty')}
<pre><code>./long-build.sh              <span class="tok-comment"># tiền cảnh: shell ngồi chờ, terminal của bạn bị chiếm</span>
<span class="tok-comment"># nhấn Ctrl-Z</span></code></pre>
<div class="out">[1]+  Stopped                 ./long-build.sh</div>
<pre><code>jobs                         <span class="tok-comment"># shell này đang quản những gì</span>
bg                           <span class="tok-comment"># cho nó chạy tiếp ở HẬU CẢNH</span>
fg                           <span class="tok-comment"># kéo nó về TIỀN CẢNH</span>
fg %1                        <span class="tok-comment"># theo số hiệu job</span>
kill %1                      <span class="tok-comment"># gửi tín hiệu cho một JOB thay vì một PID</span></code></pre>
<div class="out">[1]+  Stopped                 ./long-build.sh
[1]+  ./long-build.sh &amp;
[1]+  ./long-build.sh</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tiền cảnh</span><span class="lz-lnote">Sở hữu cái terminal. Nhận các phím bạn gõ, và nhận cả Ctrl-C. Shell bị chặn cho tới khi nó thoát.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hậu cảnh (<code>&amp;</code>)</span><span class="lz-lnote">Đang chạy, nhưng shell không chờ. Output của nó VẪN đổ ra terminal của bạn — và đó là lý do các job nền xen kẽ lộn xộn trừ khi bạn chuyển hướng. Nếu nó đọc stdin thì nó bị dừng bằng <code>SIGTTIN</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Treo lại (Ctrl-Z)</span><span class="lz-lnote">Đóng băng, không tốn CPU. Gửi <code>SIGTSTP</code> — người anh em bắt được của SIGSTOP (Bài 5.3). Chạy tiếp bằng <code>fg</code> hoặc <code>bg</code>.</span></div>
</div>
<div class="callout ok">Ctrl-Z là cái phím bị dùng ít nhất trong terminal. Đang kẹt trong <code>vim</code> mà cần chạy một lệnh? Ctrl-Z, chạy nó, rồi <code>fg</code>. Vừa khởi động một lệnh <code>grep</code> khổng lồ và muốn lấy lại dấu nhắc mà không mất nó? Ctrl-Z rồi <code>bg</code>. Nó hơn hẳn việc mở thêm một kết nối SSH thứ hai, mà chỉ tốn hai phím.</div>

<h3>Khởi động thẳng ở hậu cảnh, và \$!</h3>
${slide('lx-05', 22, '&, $! và wait từng PID')}
<pre><code class="language-bash">./build.sh &amp;                       <span class="tok-comment"># khởi động ở hậu cảnh</span>
echo \$!                            <span class="tok-comment"># PID của job nền gần nhất</span>
wait \$!                            <span class="tok-comment"># chặn lại cho tới khi nó xong</span>
echo \$?                            <span class="tok-comment"># và lấy mã thoát của nó</span>

<span class="tok-comment"># Chạy ba việc song song rồi chờ cả ba</span>
./task-a.sh &amp; ./task-b.sh &amp; ./task-c.sh &amp;
wait
echo "cả ba đã xong"</code></pre>
<div class="out">[1] 5219
[1]+  Done                    ./build.sh
0
cả ba đã xong</div>
<p>Khuôn mẫu cuối đó là song song hoá thật sự gói trong ba dòng, và nó chính là cách một script deploy dựng hai ảnh cùng lúc. Chương 7 sẽ thêm phần xử lý lỗi vào; cái bẫy cần biết ngay lúc này là một lệnh <code>wait</code> trần trả về 0 bất kể các job đã làm gì — muốn quan tâm chúng có thành công không thì bạn phải thu từng PID và <code>wait</code> lên từng cái một.</p>
<div class="callout warn">Luôn chuyển hướng output của một job nền. <code>./build.sh &amp;</code> vẫn cứ ghi ra terminal của bạn, nên output của nó xen kẽ với những gì bạn gõ tiếp theo, và bạn không phân biệt nổi dòng nào từ đâu ra. Dạng nên dùng là <code>./build.sh &gt; build.log 2&gt;&amp;1 &amp;</code> — và để ý <code>2&gt;&amp;1</code> đứng TRƯỚC dấu <code>&amp;</code>, theo đúng Bài 3.1.</div>

<h3>Cái bẫy wait trần, đo thật</h3>
<p>Lời cảnh báo ở trên đáng được nhìn tận mắt một lần, vì cú hỏng này im lặng. Ba job, một cái hỏng với trạng thái 3:</p>
<pre><code class="language-bash">( sleep 1; echo "build-api xong" )    &amp; p1=\$!
( sleep 2; echo "build-web xong" )    &amp; p2=\$!
( sleep 1; echo "test hỏng"; exit 3 ) &amp; p3=\$!
loi=0
for p in \$p1 \$p2 \$p3; do
  wait "\$p" || { echo "PID \$p hỏng, mã \$?"; loi=1; }
done; echo "tổng kết → \$loi"</code></pre>
<div class="out">build-api xong
test hỏng
build-web xong
PID 3680 hỏng, mã 3
tổng kết → 1</div>
<p>Giờ chèn một dòng <code>wait; echo "wait trần → \$?"</code> trơn <em>TRƯỚC</em> vòng <code>for</code> rồi chạy lại. Nó in <code>wait trần  → 0</code>, và sau đó mọi <code>wait "\$p"</code> đều hỏng với <code>bash: line 7: wait: pid 3665 is not a child of this shell</code> cùng trạng thái 127: một lệnh <code>wait</code> trần không chỉ trả về 0, nó còn làm bash <em>QUÊN</em> những job nó đã thu về, nên trạng thái của từng PID mất vĩnh viễn. Hãy chờ từng PID, và chỉ chờ từng PID. (Container Ubuntu 24.04, cả hai phiên bản đều chạy thật.)</p>
<h3>Vì sao đóng terminal lại giết nó</h3>
${slide('lx-05', 23, 'SIGHUP cho cả phiên: ai sống sót')}
<p>Chạy nền KHÔNG phải là tách rời. Cái job vẫn là con của shell của bạn, vẫn nằm trong <em>PHIÊN</em> của shell đó, và vẫn gắn vào terminal của bạn:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn ngắt kết nối</span><span class="lz-t">kết nối SSH rớt, hoặc bạn đóng cửa sổ</span><span class="lz-d">Thiết bị terminal biến mất.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nhân nhận ra</span><span class="lz-t">gửi SIGHUP cho trưởng phiên</span><span class="lz-d">Trưởng phiên chính là shell của bạn. "Gác máy" — phép ẩn dụ modem ở Bài 5.3.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell chuyển tiếp</span><span class="lz-t">SIGHUP tới mọi job nó sở hữu</span><span class="lz-d">Cả tiền cảnh LẪN hậu cảnh. Hành động mặc định của SIGHUP là kết thúc.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Bản dựng của bạn chết</span><span class="lz-t">sau hai tiếng, không lưu lại output nào</span><span class="lz-d">Và chẳng có gì báo cho bạn biết vì sao, vì log đã đổ vào một cái terminal nay không còn tồn tại.</span></div>
</div>
<p>Nên dấu <code>&amp;</code> trả lời câu "tôi có dùng tiếp cái terminal này được không", chứ không trả lời câu "cái này có sống sót khi tôi đi không". Đó là hai câu hỏi khác nhau với hai cách giải khác nhau.</p>

<h3>Ba cách tách rời — và mỗi cách thật ra làm gì</h3>
${slide('lx-05', 24, 'nohup · disown · setsid · tmux · systemd sống tới đâu')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>nohup lệnh &amp;</code></span><span class="v">Làm cho tiến trình <strong>LỜ ĐI</strong> SIGHUP, và chuyển hướng output vào <code>nohup.out</code> nếu bạn không tự chuyển hướng. Phải quyết định TRƯỚC khi khởi động.</span></div>
  <div class="kv"><span class="k"><code>disown -h %1</code></span><span class="v">Gỡ job khỏi bảng của shell để shell <strong>KHÔNG BAO GIỜ GỬI</strong> SIGHUP. Dùng được với thứ ĐANG chạy — cứu tinh cho lúc bạn quên <code>nohup</code>.</span></div>
  <div class="kv"><span class="k"><code>setsid lệnh</code></span><span class="v">Khởi động tiến trình trong một <strong>PHIÊN HOÀN TOÀN MỚI</strong> không có terminal điều khiển. Cách cắt đứt sạch sẽ nhất, và là cách truyền thống để tạo ra một daemon.</span></div>
</div>
<pre><code><span class="tok-comment"># Quyết định từ trước</span>
nohup ./long-build.sh &gt; build.log 2&gt;&amp;1 &amp;

<span class="tok-comment"># Quên mất, mà nó đang chạy rồi — cứu nó</span>
<span class="tok-comment"># Ctrl-Z, rồi:</span>
bg
disown -h %1

<span class="tok-comment"># Tách rời hoàn toàn, output vào file, không terminal nào cả</span>
setsid ./long-build.sh &gt; build.log 2&gt;&amp;1 &lt; /dev/null &amp;</code></pre>
<div class="out">(terminal im lặng: khi đã &gt; build.log 2&gt;&amp;1, chính dòng "nohup: ignoring input" của nohup nằm trong build.log)
[1]+  ./long-build.sh &amp;
[1]+  Running                 ./long-build.sh &amp;</div>
<div class="callout"><code>disown -h</code> đáng nhớ chính vì nó dùng được <em>SAU KHI SỰ ĐÃ RỒI</em>. Bạn đã chạy được một tiếng, nhận ra phải gập máy lại, và đã quá muộn cho <code>nohup</code> — Ctrl-Z, <code>bg</code>, <code>disown -h %1</code>, và cái job sống sót. Không có <code>-h</code>, <code>disown</code> gỡ hẳn job khỏi bảng, cũng chạy được nhưng đồng nghĩa với việc <code>jobs</code> không còn thấy nó nữa.</div>

<h3>Chứng minh: ai sống sót khi "gác máy"</h3>
<p>Đoạn sau được gõ vào một pseudo-terminal (terminal giả) thật đang chạy <code>bash -i</code> trong container Ubuntu. Bốn lệnh sleep, mỗi cách một cái, rồi shell nhận SIGHUP — đúng thứ nhân gửi khi một kết nối SSH rớt:</p>
<pre><code>sleep 501 &amp;
nohup sleep 502 &amp;
sleep 503 &amp;
disown -h %3
setsid sleep 504 &amp;
kill -HUP \$\$</code></pre>
<p>Sau đó, từ một shell khác:</p>
<pre><code>ps -o pid,ppid,sid,tty,stat,cmd -C sleep</code></pre>
<div class="out">   3507       1    3504 ?        Z    [sleep] &lt;defunct&gt;
   3509       1    3504 ?        S    sleep 502
   3510       1    3504 ?        S    sleep 503
   3515       1    3515 ?        Ss   sleep 504</div>
<p>Job <code>&amp;</code> trơn đã chết (nó hiện thành xác sống chỉ vì PID 1 của container này không biết dọn — Bài 5.1). Job <code>nohup</code> và <code>disown -h</code> sống sót <em>BÊN TRONG</em> phiên cũ 3504; còn job <code>setsid</code> sống trong phiên riêng 3515 của nó — cột <code>SID</code> (số phiên) là bằng chứng. Hai bất ngờ nhỏ từ cùng phiên đó: <code>jobs</code> báo job <code>setsid</code> là <code>Done</code> ngay tức thì, vì khi <code>setsid</code> đã là trưởng nhóm tiến trình thì nó fork ra một bản rồi để bản gốc thoát, nên shell mất dấu cái <code>sleep</code> thật; và với <code>nohup … &gt; build.log 2&gt;&amp;1</code>, dòng <code>nohup: ignoring input</code> nằm trong <code>build.log</code>, không hiện lên màn hình.</p>
<h3>tmux: câu trả lời bạn thật sự nên dùng</h3>
${slide('lx-05', 25, 'tmux: tách ra rồi gắn lại')}
<p>Cả ba mẹo trên đều chung một khiếm khuyết: một khi đã ngắt kết nối, <strong>bạn không quay lại được với chương trình</strong>. Bạn đọc được file log của nó, nhưng không trả lời được câu hỏi nó đưa ra, không cuộn lại output được, không Ctrl-C được nó. Một bộ ghép kênh terminal giữ cho một cái terminal THẬT sống trên máy chủ, và cho bạn gắn vào rồi tách ra tuỳ ý.</p>
<pre><code>tmux new -s deploy           <span class="tok-comment"># tạo một phiên có tên</span>
<span class="tok-comment"># … chạy bất cứ thứ gì, dài bao lâu cũng được …</span>
<span class="tok-comment"># Ctrl-B rồi D để tách ra. Giờ kết nối rớt cũng chẳng sao.</span>

tmux ls                      <span class="tok-comment"># đang có những phiên nào</span>
tmux attach -t deploy        <span class="tok-comment"># quay lại, từ bất kỳ máy nào</span>
tmux kill-session -t deploy  <span class="tok-comment"># khi xong việc</span></code></pre>
<div class="out">deploy: 1 windows (created Fri Aug 22 13:02:11 2026) [80x24]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-B D</span><span class="v">Tách ra. Phiên vẫn chạy tiếp trên máy chủ.</span></div>
  <div class="kv"><span class="k">Ctrl-B C</span><span class="v">Cửa sổ mới. Ctrl-B rồi một con số để chuyển qua lại.</span></div>
  <div class="kv"><span class="k">Ctrl-B %</span><span class="v">Chia dọc · <code>Ctrl-B "</code> chia ngang · <code>Ctrl-B</code> + phím mũi tên để di chuyển.</span></div>
  <div class="kv"><span class="k">Ctrl-B [</span><span class="v">Chế độ cuộn — lật ngược lại xem output. <code>q</code> để thoát. Riêng cái này đã đủ để chọn tmux thay vì <code>nohup</code>.</span></div>
</div>
<div class="callout ok"><strong>Thói quen đáng xây: gõ <code>tmux attach || tmux new</code> ngay khoảnh khắc bạn SSH vào một máy chủ, trước khi làm bất cứ việc gì.</strong> Rồi thì không lệnh nào bạn khởi động còn phụ thuộc vào đường mạng nữa. Một lần rớt Wi-Fi trở thành chuyện phiền toái thay vì một bản dựng hai tiếng đi tong, và bạn gắn lại được từ điện thoại vào đúng cái màn hình vừa bỏ dở. <code>screen</code> là bản cũ tương đương và vẫn ổn nếu đó là thứ máy chủ có sẵn; khái niệm y hệt nhau.</div>

<h3>Khi không cái nào trong số này là đúng</h3>
<p>Nếu một chương trình phải chạy tiếp <em>QUA CẢ NHỮNG LẦN KHỞI ĐỘNG LẠI MÁY</em>, không công cụ nào ở trên là câu trả lời — tất cả đều chết khi máy khởi động lại. Đó là việc của một trình quản lý dịch vụ:</p>
<pre><code class="language-bash">sudo systemctl enable --now myapp     <span class="tok-comment"># chạy lúc khởi động, tự bật lại khi sập</span>
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&amp;</code></span><span class="v">"Trả lại dấu nhắc cho tôi." Chết khi terminal đóng.</span></div>
  <div class="kv"><span class="k"><code>nohup</code> / <code>disown</code></span><span class="v">"Sống sót qua phiên SSH này." Chết khi khởi động lại máy. Không có đường quay lại với chương trình.</span></div>
  <div class="kv"><span class="k"><code>tmux</code></span><span class="v">"Sống sót qua phiên SSH này, và cho tôi quay lại." Chết khi khởi động lại máy. Đúng cho việc dài cần tương tác.</span></div>
  <div class="kv"><span class="k">unit của systemd</span><span class="v">"Chạy mãi, tự bật lại khi hỏng, lên cùng máy, ghi log vào journald." Câu trả lời ĐÚNG DUY NHẤT cho một dịch vụ. Chương 11.</span></div>
</div>
<div class="callout warn">Một ứng dụng production khởi động bằng <code>nohup node server.js &amp;</code> chạy tốt cho tới đúng lúc máy chủ khởi động lại — sau một bản vá nhân, một sự cố điện, hay khi nhà cung cấp di dời máy ảo của bạn — và rồi nó đơn giản là biến mất, chẳng có gì được cấu hình để dựng nó dậy. Nếu một tiến trình là quan trọng, chỗ của nó là trong một unit của systemd. <code>nohup</code> dành cho một việc chạy một lần mà bạn đang ngồi canh, không dành cho thứ lẽ ra tuần sau vẫn phải đang chạy.</div>

<h3>Chạy thử từng bước</h3>
<p>Gõ những dòng này vào một shell tương tác, bấm phím đúng chỗ chú thích bảo — điều khiển job cần một terminal thật, nên không chạy được bên trong script.</p>
<pre><code>sleep 300            <span class="tok-comment"># rồi bấm Ctrl-Z</span>
jobs -l
bg
sleep 400 &amp;
jobs
fg %1                <span class="tok-comment"># rồi bấm Ctrl-C</span>
echo \$?
kill %2; sleep 0.2; jobs</code></pre>
<div class="out">^Z
[1]+  Stopped                 sleep 300
[1]+  3475 Stopped                 sleep 300
[1]+ sleep 300 &amp;
[2] 3480
[1]-  Running                 sleep 300 &amp;
[2]+  Running                 sleep 400 &amp;
sleep 300
^C
130
[2]+  Terminated              sleep 400</div>
<p>Đọc các dấu: <code>+</code> là job "hiện tại" mà <code>fg</code>/<code>bg</code> trơn sẽ tác động, <code>-</code> là job trước đó. <code>fg</code> in lại lệnh nó cho chạy tiếp; <code>Ctrl-C</code> lên job tiền cảnh cho ra 130 = 128 + SIGINT; <code>kill %2</code> gửi SIGTERM tới một job mà không cần biết PID, và <code>jobs</code> báo <code>Terminated</code> ở lần chạy kế tiếp. (Phím gõ vào một pty thật, container Ubuntu 24.04.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td><code>Ctrl-Z</code>, <code>jobs</code>, <code>fg</code>, <code>bg</code>, <code>disown</code></td><td>bash</td><td>y hệt trong zsh (shell mặc định) lẫn <code>/bin/bash</code> 3.2</td></tr>
<tr><td><code>nohup</code></td><td>coreutils</td><td>có (<code>/usr/bin/nohup</code>)</td></tr>
<tr><td><code>setsid</code></td><td>util-linux</td><td>KHÔNG có — <code>setsid not found</code></td></tr>
<tr><td><code>tmux</code></td><td><code>apt install tmux</code></td><td><code>brew install tmux</code>; các tab của ứng dụng terminal không thay thế được nó</td></tr>
<tr><td>Đóng cửa sổ</td><td>SIGHUP tới shell</td><td>y hệt; zsh còn mặc định gửi HUP cho các job của nó (tuỳ chọn <code>HUP</code>)</td></tr>
</table>
<p>Trên WSL2, đóng tab Windows Terminal là một lần "gác máy"; còn tắt máy ảo WSL (<code>wsl --shutdown</code>, hoặc Windows khởi động lại) là một lần khởi động lại với mọi thứ bên trong, kể cả tmux.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn sắp chạy một lần nhập cơ sở dữ liệu dài 20 phút trên VPS của nhóm qua Wi-Fi trường, thứ thỉnh thoảng lại rớt. Tập trước trên máy mình hoặc trong một container có cài <code>tmux</code>.</p><ol>
<li>Chạy <code>sleep 1200</code> ở tiền cảnh, chợt nhận ra cần dấu nhắc, và đẩy nó xuống nền mà không phải chạy lại (<code>Ctrl-Z</code>, <code>bg</code>). Xác nhận bằng <code>jobs -l</code>.</li>
<li>Làm cho job <em>ĐANG CHẠY</em> đó sống sót qua một lần gác máy: <code>disown -h %1</code>. Khởi động job thứ hai bằng <code>nohup sleep 1201 &gt; import.log 2&gt;&amp;1 &amp;</code>.</li>
<li>Giả lập Wi-Fi rớt bằng <code>kill -HUP \$\$</code> (lệnh này đóng shell của bạn). Mở một shell mới và kiểm xem sleep nào còn sống bằng <code>ps -o pid,sid,tty,stat,cmd -C sleep</code>.</li>
<li>Làm cho tử tế: <code>tmux new -s import</code>, chạy <code>sleep 1202</code> bên trong, tách ra bằng <code>Ctrl-B d</code>, liệt kê bằng <code>tmux ls</code>, gắn lại bằng <code>tmux attach -t import</code>, và cuối cùng <code>tmux kill-session -t import</code>.</li></ol>
<p><strong>Đạt khi:</strong> sau lần gác máy cả <code>sleep 1200</code> lẫn <code>sleep 1201</code> vẫn còn trong danh sách (cột TTY là <code>?</code>), <code>import.log</code> chứa dòng <code>nohup: ignoring input</code>, và bạn đã gắn lại vào phiên tmux thấy <code>sleep 1202</code> vẫn chạy trong đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job (việc do shell quản)</span><span class="v">Một lệnh (hay chuỗi ống) shell đã khởi động và đang theo dõi, đánh số <code>%1</code>, <code>%2</code>….</span></div>
  <div class="kv"><span class="k">Foreground / background (tiền cảnh / hậu cảnh)</span><span class="v">Giữ terminal và nhận phím · chạy trong khi shell trả dấu nhắc lại cho bạn.</span></div>
  <div class="kv"><span class="k">Suspend — Ctrl-Z (treo lại)</span><span class="v">Đóng băng job tiền cảnh bằng SIGTSTP; chạy tiếp bằng <code>fg</code> hoặc <code>bg</code>.</span></div>
  <div class="kv"><span class="k">Session / session leader (phiên / trưởng phiên)</span><span class="v">Một nhóm các nhóm tiến trình gắn với một terminal; shell đăng nhập đứng đầu nó.</span></div>
  <div class="kv"><span class="k">Controlling terminal (terminal điều khiển)</span><span class="v">Terminal mà khi "gác máy" sẽ gửi SIGHUP cho cả phiên.</span></div>
  <div class="kv"><span class="k">Hang-up — SIGHUP (gác máy)</span><span class="v">Tín hiệu 1, gửi khi terminal biến mất — SSH rớt, đóng cửa sổ.</span></div>
  <div class="kv"><span class="k">Detach (tách rời)</span><span class="v">Để một thứ chạy tiếp mà không cần terminal của bạn: nohup, disown, setsid, hoặc <code>Ctrl-B d</code> của tmux.</span></div>
  <div class="kv"><span class="k">Terminal multiplexer — tmux (bộ ghép kênh terminal)</span><span class="v">Giữ terminal thật sống trên máy chủ để bạn gắn lại từ bất cứ đâu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Ctrl-Z</code> đóng băng, <code>bg</code> cho chạy tiếp ở nền, <code>fg</code> kéo về; <code>%N</code> gọi tên một job.</li>
<li><code>&amp;</code> trả lại dấu nhắc; <code>\$!</code> là PID của job đó; chờ từng PID để lấy từng mã thoát — <code>wait</code> trần trả 0 và quên sạch.</li>
<li>Chạy nền không phải tách rời: gác máy thì phiên nhận SIGHUP và shell chuyển tiếp nó tới mọi job.</li>
<li><code>nohup</code> (quyết từ trước), <code>disown -h</code> (cứu sau khi đã chạy) và <code>setsid</code> (phiên mới) đều sống qua gác máy, và không cái nào sống qua khởi động lại máy.</li>
<li>tmux là cách duy nhất cho bạn quay lại chính chương trình; hãy biến <code>tmux attach || tmux new</code> thành thói quen.</li>
<li>Thứ gì phải sống qua khởi động lại máy thì chỗ của nó là một unit systemd, không phải cách nào ở trên.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Job-Control.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Job Control</span><span class="lc-sub">Ngữ nghĩa chính xác của <code>jobs</code>, <code>fg</code>, <code>bg</code>, các ký hiệu <code>%</code> và <code>disown</code>, gồm cả tuỳ chọn <code>huponexit</code> làm đổi toàn bộ hành vi.</span></span>
</a>
<a class="link-card" href="https://tmuxcheatsheet.com/" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">tmux cheat sheet</span><span class="lc-sub">Mọi tổ hợp phím gói trong một trang. In ra, dùng một tuần, rồi bạn sẽ thôi cần tới nó.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/credentials.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">credentials(7) — phiên và nhóm tiến trình</span><span class="lc-sub">Định nghĩa của nhân về trưởng phiên, nhóm tiến trình và terminal điều khiển — chính là mô hình giải thích vì sao SIGHUP với tới được job nền của bạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: giữ cho nó chạy tiếp</span><span class="lc-sub">Bài chấm điểm: treo rồi đẩy một job đang chạy xuống nền, cứu một job đã quên bằng <code>disown</code>, và tách một phiên tmux rồi gắn lại đọc phần đã cuộn qua.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>&amp;</code> nghĩa là "đã tách rời". Nó nghĩa là "đừng chặn shell của tôi", không hơn — cái job vẫn là con của shell bạn, vẫn nằm trong phiên của bạn, và vẫn lãnh SIGHUP khi terminal đóng. Phiên bản gây đau của chuyện này là <code>ssh vps './deploy.sh &amp;'</code>: lệnh SSH trả về ngay, shell ở đầu kia thoát, SIGHUP bay ra, và lần deploy chết giữa chừng — để lại một máy chủ cập nhật dở dang cùng một lệnh SSH đã báo thành công. Hãy dùng <code>ssh vps 'nohup ./deploy.sh &gt; deploy.log 2&gt;&amp;1 &amp;'</code>, hoặc tốt hơn, <code>ssh vps 'tmux new -d -s deploy ./deploy.sh'</code> để sau đó gắn vào xem chuyện gì đã xảy ra.</div>
<p class="note-ct"><strong>Một thói quen thay được cả bài này:</strong> gõ <code>tmux attach || tmux new</code> làm lệnh đầu tiên sau mỗi lần đăng nhập SSH. Mọi thứ bạn khởi động sau đó đều miễn nhiễm với việc rớt mạng, với tới lại được từ bất cứ đâu, và cuộn lại xem được sau khi sự đã rồi. Hãy giữ <code>Ctrl-Z</code> / <code>fg</code> / <code>bg</code> cho việc xoay xở bên trong một terminal, và giữ <code>nohup</code> cho cái ngày bạn lỡ quên — nhưng mặc định thì nên là tmux.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.5 Quiz ─────────────────────────── */
    {
      title: '5.5 — Chapter 5 quiz|||5.5 — Kiểm tra Chương 5',
      slug: 'lnx-5-5-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: pkill tự giết shell của mình, xác sống dưới PID 1, đọc tải và bộ nhớ, Too many open files, job nền lờ SIGINT, diệt theo cổng, ai sống sót khi SIGHUP, wait trần và docker stop.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from real terminals — every output quoted in these questions was recorded while writing the chapter. Most ask what a command prints or which command fixes a problem; reading commands is the skill this course is building.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read <code>ps -o pid,ppid,stat,cmd</code> and name each state R, S, D, T, Z.</li>
<li>I can explain why <code>kill -9</code> does nothing to a zombie and what does.</li>
<li>I can read load average against <code>nproc</code>, and memory from the <code>available</code> column.</li>
<li>I can decode 130, 137 and 143, and stop a process with TERM before KILL.</li>
<li>I can stop a server by its port when its name does not match.</li>
<li>I know which of <code>&amp;</code>, <code>nohup</code>, <code>disown -h</code>, <code>setsid</code>, tmux and systemd survives a hang-up or a reboot.</li>
</ul>
${slide('lx-05', 28, 'Bảng tra nhanh Chương 5 (1/2)')}
${slide('lx-05', 29, 'Bảng tra nhanh Chương 5 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ terminal thật — mọi output trích trong câu hỏi đều được ghi lại lúc viết chương này. Phần lớn hỏi một lệnh in ra gì hoặc lệnh nào sửa được lỗi; đọc lệnh là kỹ năng khoá này đang xây cho bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được <code>ps -o pid,ppid,stat,cmd</code> và gọi đúng tên từng trạng thái R, S, D, T, Z.</li>
<li>Tôi giải thích được vì sao <code>kill -9</code> chẳng làm gì một xác sống, và cái gì mới làm được.</li>
<li>Tôi đọc được tải trung bình so với <code>nproc</code>, và đọc bộ nhớ ở cột <code>available</code>.</li>
<li>Tôi giải mã được 130, 137 và 143, và dừng tiến trình bằng TERM trước khi dùng KILL.</li>
<li>Tôi dừng được một server theo cổng của nó khi cái tên không khớp.</li>
<li>Tôi biết trong <code>&amp;</code>, <code>nohup</code>, <code>disown -h</code>, <code>setsid</code>, tmux và systemd, cái nào sống qua gác máy và cái nào sống qua khởi động lại.</li>
</ul>
${slide('lx-05', 28, 'Bảng tra nhanh Chương 5 (1/2)')}
${slide('lx-05', 29, 'Bảng tra nhanh Chương 5 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "You run: bash -c 'pkill -f \"sleep 9999\"; echo done' — and no process called “sleep 9999” exists. What happens?|||Bạn chạy: bash -c 'pkill -f \"sleep 9999\"; echo done' — và không hề có tiến trình nào tên “sleep 9999”. Chuyện gì xảy ra?",
            options: [
              'It prints "done" and the exit status is 0|||In ra "done" và trạng thái thoát là 0',
              'It prints "pkill: no process found", then "done"|||In ra "pkill: no process found", rồi "done"',
              'Nothing is printed and the status is 143 — pkill matched the bash -c whose command line contains the pattern, and sent it SIGTERM|||Không in gì cả và trạng thái là 143 — pkill khớp trúng chính cái bash -c có dòng lệnh chứa mẫu, và gửi SIGTERM cho nó',
              'It prints "done" and the status is 1 because nothing matched|||In ra "done" và trạng thái là 1 vì không khớp gì',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: -f searches whole command lines, and the parent bash -c carries "sleep 9999" in its arguments. pkill excludes itself but not its parent, so it TERMs the shell before echo runs: no output, status 128+15 = 143. "Status 1, nothing matched" is what you would expect — and is exactly the trap.|||VI: -f tìm trong cả dòng lệnh, mà bash -c cha mang "sleep 9999" trong tham số của nó. pkill loại chính nó ra nhưng không loại cha, nên nó gửi TERM cho shell trước khi echo kịp chạy: không in gì, trạng thái 128+15 = 143. "Trạng thái 1, không khớp gì" là điều bạn sẽ đoán — và đó chính là cái bẫy.',
          },
          {
            question: 'In a container started with "docker run … sleep infinity", ps shows eight lines like "2930  1 Z [sleep] <defunct>", all with PPID 1. What actually removes them for good?|||Trong một container khởi động bằng "docker run … sleep infinity", ps hiện tám dòng kiểu "2930  1 Z [sleep] <defunct>", tất cả có PPID 1. Cái gì mới dọn được chúng vĩnh viễn?',
            options: [
              'Recreate the container with --init (or init: true), so PID 1 is tini, which calls wait() on every orphan|||Tạo lại container với --init (hoặc init: true), để PID 1 là tini, thứ gọi wait() cho mọi đứa mồ côi',
              'kill -9 each zombie PID|||kill -9 từng PID xác sống',
              'kill -CONT each zombie so it can finish exiting|||kill -CONT từng xác sống để nó thoát cho xong',
              'Raise ulimit -u so the process table has more room|||Nâng ulimit -u để bảng tiến trình có thêm chỗ',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A zombie has already exited; only its parent calling wait() frees it. Their parent is PID 1 = sleep, which never waits. With --init, tini is PID 1 and reaps them — measured in this chapter. kill -9 is the tempting answer and does nothing: there is nothing left to kill.|||VI: Xác sống đã thoát rồi; chỉ cha của nó gọi wait() mới giải phóng được. Cha của chúng là PID 1 = sleep, thứ không bao giờ wait. Với --init, tini làm PID 1 và dọn chúng — đã đo trong chương này. kill -9 là đáp án hấp dẫn và chẳng làm gì: không còn gì để giết.',
          },
          {
            question: 'A server shows "load average: 6.0, 6.2, 5.9", nproc prints 12, and the %Cpu line shows 45 us, 0.0 wa, 0.0 st. What is the right reading?|||Một máy chủ hiện "load average: 6.0, 6.2, 5.9", nproc in 12, và dòng %Cpu cho 45 us, 0.0 wa, 0.0 st. Đọc thế nào mới đúng?',
            options: [
              'Overloaded six times — add CPUs|||Quá tải sáu lần — thêm CPU',
              'An I/O bottleneck, because the load is above 1|||Nghẽn I/O, vì tải lớn hơn 1',
              'Something started failing one minute ago|||Có gì đó vừa bắt đầu hỏng một phút trước',
              'About half the cores are busy, steadily, with no waiting on disk — healthy|||Khoảng một nửa số nhân đang bận, đều đặn, không chờ đĩa — khoẻ mạnh',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Load counts runnable (and D-state) tasks: 6 on 12 CPUs is half capacity; the three numbers are flat, and wa = 0 rules out disk. "Overloaded six times" forgets to divide by nproc; a spike one minute ago would look like 6.0, 1.3, 0.9.|||VI: Tải đếm số việc đang chạy được (và trạng thái D): 6 trên 12 CPU là một nửa công suất; ba con số đi ngang, và wa = 0 loại trừ đĩa. "Quá tải sáu lần" là quên chia cho nproc; một cú tăng từ một phút trước sẽ trông như 6.0, 1.3, 0.9.',
          },
          {
            question: 'free -h shows: total 31Gi, used 13Gi, free 884Mi, buff/cache 16Gi, available 17Gi. Which number should a monitoring alert watch?|||free -h hiện: total 31Gi, used 13Gi, free 884Mi, buff/cache 16Gi, available 17Gi. Cảnh báo giám sát nên theo dõi con số nào?',
            options: [
              'free — 884Mi is under 3%, so alert now|||free — 884Mi là dưới 3%, nên báo động ngay',
              'available — what a new program can get without swapping; 17Gi is plenty|||available — phần một chương trình mới lấy được mà không phải tráo swap; 17Gi là dư dả',
              'buff/cache — it should be dropped to free memory|||buff/cache — nên xả nó đi để có bộ nhớ trống',
              'used plus buff/cache, because both are in use|||used cộng buff/cache, vì cả hai đều đang bị dùng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Linux lends idle RAM to the disk cache and takes it back instantly, so "free" drifts towards zero on any healthy long-running machine. "available" is free plus reclaimable cache. An alert on "free" would page you every day on this healthy Fedora box (the output is real).|||VI: Linux cho bộ đệm đĩa mượn RAM rỗi và lấy lại ngay tức khắc, nên "free" dần về gần 0 trên mọi máy khoẻ mạnh chạy lâu. "available" là free cộng phần đệm thu hồi được. Cảnh báo dựa trên "free" sẽ gọi bạn dậy mỗi ngày trên chiếc máy Fedora khoẻ mạnh này (output là thật).',
          },
          {
            question: 'An API run by systemd logs "OSError: [Errno 24] Too many open files" under load. On that server, "ulimit -n" in your SSH session prints 1024. What is the correct fix?|||Một API chạy bởi systemd ghi log "OSError: [Errno 24] Too many open files" khi tải cao. Trên máy đó, "ulimit -n" trong phiên SSH của bạn in ra 1024. Cách sửa đúng là gì?',
            options: [
              'Run "ulimit -n 65535" in your SSH session and restart nothing|||Chạy "ulimit -n 65535" trong phiên SSH của bạn và không khởi động lại gì',
              'Check /proc/PID/fd for a leak, then set LimitNOFILE= in the service unit and restart it|||Kiểm /proc/PID/fd xem có rò rỉ không, rồi đặt LimitNOFILE= trong unit của dịch vụ và khởi động lại nó',
              'Add RAM, because Errno 24 means the machine is out of memory|||Thêm RAM, vì Errno 24 nghĩa là máy hết bộ nhớ',
              'Send kill -HUP so the service reloads with a new limit|||Gửi kill -HUP để dịch vụ nạp lại với trần mới',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Limits are per process and inherited at start. Your shell’s ulimit affects your shell and its children, not a service systemd already started; its limit comes from LimitNOFILE= (read the live value in /proc/PID/limits). Errno 24 is EMFILE — descriptors, not memory — and a steadily growing fd count means a leak a bigger limit only postpones.|||VI: Giới hạn là theo từng tiến trình và được thừa kế lúc khởi động. ulimit trong shell của bạn chỉ tác động shell đó và con của nó, không phải một dịch vụ systemd đã khởi động sẵn; giới hạn của nó đến từ LimitNOFILE= (đọc giá trị thật trong /proc/PID/limits). Errno 24 là EMFILE — bộ mô tả file, không phải bộ nhớ — và số fd tăng đều nghĩa là rò rỉ, nâng trần chỉ hoãn cú sập.',
          },
          {
            question: 'A script (not an interactive shell, no set -m) runs: sleep 100 & p=$!; kill -INT $p; wait $p; echo $? — what is printed, and when?|||Một script (không phải shell tương tác, không có set -m) chạy: sleep 100 & p=$!; kill -INT $p; wait $p; echo $? — nó in gì, và khi nào?',
            options: [
              '130, immediately|||130, ngay lập tức',
              '2, immediately|||2, ngay lập tức',
              '143, immediately|||143, ngay lập tức',
              '0, after about 100 seconds — background jobs of a non-interactive shell start with SIGINT ignored|||0, sau khoảng 100 giây — job nền của một shell không tương tác khởi động với SIGINT bị lờ đi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured while writing this chapter: without job control, bash starts background jobs with SIGINT and SIGQUIT ignored (visible in SigIgn), so the sleep simply finishes and exits 0. With set -m, or from an interactive shell, the same code prints 130 = 128+2 — the tempting answer. Use TERM to stop a script’s helpers.|||VI: Đo thật khi viết chương này: không có điều khiển job, bash khởi động job nền với SIGINT và SIGQUIT bị lờ (thấy được trong SigIgn), nên sleep cứ thế chạy hết và thoát với 0. Có set -m, hoặc từ shell tương tác, cùng đoạn mã in ra 130 = 128+2 — đáp án hấp dẫn. Hãy dùng TERM để dừng tiến trình phụ của script.',
          },
          {
            question: "Your Next.js server holds port 3000. pkill -f 'next start' returns 1 and the port is still busy. Which command stops it?|||Server Next.js của bạn giữ cổng 3000. pkill -f 'next start' trả về 1 và cổng vẫn bận. Lệnh nào dừng được nó?",
            options: [
              'lsof -ti:3000 | xargs -r kill|||lsof -ti:3000 | xargs -r kill',
              'pkill -f "next start" -9|||pkill -f "next start" -9',
              'killall next|||killall next',
              'kill -l 3000|||kill -l 3000',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The process renamed itself (process.title = "next-server (v…)"), so no pattern containing "next start" matches — adding -9 changes the signal, not the match, and killall needs the exact name. A port has exactly one owner: lsof -t prints its PID and xargs -r sends TERM only if one was found. kill -l 3000 just asks for a signal name.|||VI: Tiến trình đã tự đổi tên (process.title = "next-server (v…)"), nên mẫu nào chứa "next start" cũng không khớp — thêm -9 chỉ đổi tín hiệu chứ không đổi việc khớp, còn killall cần đúng tên. Một cổng chỉ có đúng một chủ: lsof -t in PID của nó và xargs -r chỉ gửi TERM khi tìm thấy. kill -l 3000 chỉ hỏi tên một tín hiệu.',
          },
          {
            question: 'In an interactive bash you start: "sleep 501 &", "nohup sleep 502 &", "sleep 503 &" followed by "disown -h %3", and "setsid sleep 504 &". Then the terminal hangs up (SIGHUP). Which sleeps are still running?|||Trong bash tương tác bạn chạy: "sleep 501 &", "nohup sleep 502 &", "sleep 503 &" rồi "disown -h %3", và "setsid sleep 504 &". Sau đó terminal gác máy (SIGHUP). Những sleep nào còn chạy?',
            options: [
              'None — a hang-up kills everything started from that terminal|||Không cái nào — gác máy giết mọi thứ khởi động từ terminal đó',
              'Only 504, because only setsid really detaches|||Chỉ 504, vì chỉ setsid mới thật sự tách rời',
              '502, 503 and 504 — only the plain & job dies|||502, 503 và 504 — chỉ job & trơn là chết',
              'All four, because background jobs do not receive SIGHUP|||Cả bốn, vì job nền không nhận SIGHUP',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Recorded in a real pty: bash forwards SIGHUP to its jobs; nohup makes 502 ignore it, disown -h stops bash from sending it to 503, and setsid put 504 in a session of its own. Only 501 died. "All four" is the classic misconception that & means detached.|||VI: Ghi trong một pty thật: bash chuyển tiếp SIGHUP tới các job của nó; nohup làm 502 lờ nó đi, disown -h khiến bash không gửi nó tới 503, còn setsid đặt 504 vào một phiên riêng. Chỉ 501 chết. "Cả bốn" là ngộ nhận kinh điển rằng & nghĩa là đã tách rời.',
          },
          {
            question: 'A script starts three background jobs saving p1, p2, p3 from $!, then runs a bare "wait", then "wait $p3" (p3 exited with status 3). What does "wait $p3" do?|||Một script khởi động ba job nền, lưu p1, p2, p3 từ $!, rồi chạy "wait" trần, rồi "wait $p3" (p3 đã thoát với trạng thái 3). "wait $p3" làm gì?',
            options: [
              'Returns 3, the status of p3|||Trả về 3, trạng thái của p3',
              'Prints "wait: pid … is not a child of this shell" and returns 127|||In "wait: pid … is not a child of this shell" và trả về 127',
              'Returns 0, like the bare wait|||Trả về 0, giống wait trần',
              'Blocks forever, because p3 has already finished|||Chặn mãi mãi, vì p3 đã xong từ trước',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured: the bare wait returned 0 and made bash forget the jobs it collected, so the later wait $p3 failed with "not a child of this shell", status 127. Without the bare wait, wait $p3 does return 3 — the tempting answer. Wait on each PID, and only on each PID.|||VI: Đo thật: wait trần trả 0 và làm bash quên những job nó đã thu về, nên wait $p3 sau đó hỏng với "not a child of this shell", trạng thái 127. Không có wait trần thì wait $p3 đúng là trả về 3 — đáp án hấp dẫn. Hãy chờ từng PID, và chỉ chờ từng PID.',
          },
          {
            question: 'A container whose PID 1 is "sleep 300" (no --init, no signal handler) is stopped with "docker stop -t 10". What do you observe?|||Một container có PID 1 là "sleep 300" (không --init, không bộ xử lý tín hiệu) bị dừng bằng "docker stop -t 10". Bạn quan sát thấy gì?',
            options: [
              'It takes the full 10 seconds and exits with 137|||Nó mất trọn 10 giây và thoát với mã 137',
              'It stops at once with 143|||Nó dừng ngay với mã 143',
              'It stops at once with 0|||Nó dừng ngay với mã 0',
              'It stops at once with 130|||Nó dừng ngay với mã 130',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The kernel drops signals sent to PID 1 when PID 1 has no handler, so SIGTERM does nothing; after the grace period Docker sends SIGKILL: 10.2 s, exit 137 (measured). 143 in 0.1 s is what you get with --init, 0 in 0.1 s with a trap that exits cleanly.|||VI: Nhân vứt bỏ tín hiệu gửi tới PID 1 khi PID 1 không có bộ xử lý, nên SIGTERM chẳng làm gì; hết khoảng ân hạn Docker gửi SIGKILL: 10,2 giây, mã 137 (đo thật). 143 trong 0,1 giây là khi có --init, còn 0 trong 0,1 giây là khi có trap thoát sạch sẽ.',
          },
        ],
      },
    },
  ],
};
