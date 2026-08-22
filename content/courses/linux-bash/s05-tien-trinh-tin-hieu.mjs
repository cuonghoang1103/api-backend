/**
 * Linux & Bash — Chương 5: Tiến trình, job & tín hiệu.
 * Tiến trình là gì · nhìn máy đang chạy · tín hiệu · job và chạy nền · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 5 — Processes, jobs & signals|||Chương 5 — Tiến trình, job & tín hiệu',
  description: 'ps, top, kill, chạy nền, nohup — Ctrl-C thật ra gửi cái gì và vì sao vài chương trình lờ nó đi. Chương này dạy bạn nhìn ra máy đang thật sự làm gì, và dừng đúng thứ cần dừng mà không phá hỏng dữ liệu đang ghi dở.',
  lessons: [
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
<p>Linux has no "run this program" call. It has two, and they do different halves of the job:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · fork()</span><span class="lz-t">the shell clones ITSELF</span><span class="lz-d">An identical copy: same memory, same open file descriptors, same working directory. Only the PID differs. This is where redirections and pipes get set up — in the child, before the new program exists.</span></div>
  <div class="lz-step"><span class="lz-k">2 · exec()</span><span class="lz-t">the clone REPLACES itself with the new program</span><span class="lz-d">Same PID, same fds, entirely new code and memory. The old shell code is gone.</span></div>
  <div class="lz-step"><span class="lz-k">3 · wait()</span><span class="lz-t">the parent waits for the exit code</span><span class="lz-d">Which becomes <code>\$?</code>. Skip this step — that is what <code>&amp;</code> does — and the parent carries on immediately.</span></div>
</div>
<div class="callout ok">This two-step design is why Lesson 3.1's redirection rules work the way they do. The shell forks, and <em>then</em>, inside the child, opens files and rewires fds 0/1/2 — all before <code>exec</code> loads the program. The program starts life with the streams already pointing where you asked, which is why it never needs to know that a redirection happened. One mechanism, and it explains <code>&gt;</code>, <code>|</code>, <code>2&gt;&amp;1</code> and why <code>sort f &gt; f</code> empties the file.</div>

<h3>ps: two syntaxes, and which to use</h3>
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
<div class="kv-grid">
  <div class="kv"><span class="k">Orphan</span><span class="v">Its parent died first. The kernel immediately re-parents it to PID 1, which will reap it correctly. Harmless — and it is exactly how daemons are traditionally created.</span></div>
  <div class="kv"><span class="k">Zombie (<code>Z</code>, <code>&lt;defunct&gt;</code>)</span><span class="v">It has <em>exited</em>, but its parent has not called <code>wait()</code> to collect the exit code, so the kernel keeps a small entry in the process table. It uses no CPU and no memory — only a PID slot.</span></div>
</div>
<pre><code>ps aux | awk '\$8 ~ /Z/ {print \$2, \$11}'</code></pre>
<div class="out">7412 [python3] &lt;defunct&gt;</div>
<p><strong>You cannot kill a zombie</strong> — it is already dead. <code>kill -9</code> on it does nothing at all. The fix is to deal with the <em>parent</em>: find it with <code>ps -o ppid= -p &lt;zombie-pid&gt;</code> and either fix its code to reap children, or restart it. When the parent dies, the zombie is re-parented to PID 1, which reaps it instantly.</p>
<div class="callout">A handful of zombies is cosmetic. Thousands of them is a real bug — the process table is finite, and exhausting it means the machine can no longer fork, so nothing new can start and even logging in fails. This is the classic failure mode of a container running an application directly as PID 1 without an init: PID 1 has special reaping duties that most applications do not implement, which is why Docker's <code>--init</code> flag and <code>tini</code> exist.</div>

<h3>/proc: the kernel as a filesystem</h3>
<p>Everything <code>ps</code> and <code>top</code> report comes from <code>/proc</code>, a virtual filesystem where each process is a directory named after its PID. You can read it directly:</p>
<pre><code>ls /proc/812/
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
<p>Linux KHÔNG có lời gọi "chạy chương trình này". Nó có hai lời gọi, và mỗi cái làm một nửa công việc:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · fork()</span><span class="lz-t">shell tự NHÂN BẢN CHÍNH MÌNH</span><span class="lz-d">Một bản sao y hệt: cùng bộ nhớ, cùng các bộ mô tả file đang mở, cùng thư mục làm việc. Chỉ khác PID. Đây là chỗ các phép chuyển hướng và ống dẫn được dựng lên — trong tiến trình con, TRƯỚC khi chương trình mới tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">2 · exec()</span><span class="lz-t">bản sao TỰ THAY MÌNH bằng chương trình mới</span><span class="lz-d">Cùng PID, cùng các fd, nhưng mã lệnh và bộ nhớ thì hoàn toàn mới. Mã của shell cũ biến mất.</span></div>
  <div class="lz-step"><span class="lz-k">3 · wait()</span><span class="lz-t">tiến trình cha chờ lấy mã thoát</span><span class="lz-d">Và nó trở thành <code>\$?</code>. Bỏ qua bước này — đó chính là việc dấu <code>&amp;</code> làm — thì tiến trình cha đi tiếp ngay lập tức.</span></div>
</div>
<div class="callout ok">Chính thiết kế hai bước này là lý do các luật chuyển hướng ở Bài 3.1 hoạt động theo cách chúng hoạt động. Shell fork ra, RỒI <em>SAU ĐÓ</em>, bên trong tiến trình con, nó mở file và đấu lại các fd 0/1/2 — tất cả trước khi <code>exec</code> nạp chương trình. Chương trình bắt đầu đời mình với các dòng chuẩn đã chĩa sẵn vào chỗ bạn yêu cầu, và đó là lý do nó không bao giờ cần biết rằng có một phép chuyển hướng nào đã xảy ra. Một cơ chế, và nó giải thích cả <code>&gt;</code>, <code>|</code>, <code>2&gt;&amp;1</code> lẫn chuyện vì sao <code>sort f &gt; f</code> làm rỗng file.</div>

<h3>ps: hai cú pháp, và nên dùng cái nào</h3>
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
<div class="kv-grid">
  <div class="kv"><span class="k">Mồ côi (orphan)</span><span class="v">Tiến trình cha chết trước. Nhân lập tức nhận nó về làm con của PID 1, và PID 1 sẽ thu dọn nó đúng cách. Vô hại — và đó chính là cách truyền thống để tạo ra một daemon.</span></div>
  <div class="kv"><span class="k">Xác sống (<code>Z</code>, <code>&lt;defunct&gt;</code>)</span><span class="v">Nó đã <em>THOÁT</em> rồi, nhưng tiến trình cha chưa gọi <code>wait()</code> để lấy mã thoát về, nên nhân vẫn giữ một mục nhỏ trong bảng tiến trình. Nó không tốn CPU và không tốn bộ nhớ — chỉ chiếm một ô PID.</span></div>
</div>
<pre><code>ps aux | awk '\$8 ~ /Z/ {print \$2, \$11}'</code></pre>
<div class="out">7412 [python3] &lt;defunct&gt;</div>
<p><strong>Bạn KHÔNG giết được một xác sống</strong> — nó chết rồi. <code>kill -9</code> lên nó chẳng làm gì cả. Cách chữa là xử lý cái <em>CHA</em>: tìm ra nó bằng <code>ps -o ppid= -p &lt;pid-xác-sống&gt;</code> rồi hoặc sửa mã của nó để nó thu dọn con, hoặc khởi động lại nó. Khi tiến trình cha chết, cái xác sống được chuyển về làm con của PID 1, và PID 1 dọn nó ngay tức khắc.</p>
<div class="callout">Vài cái xác sống thì chỉ là chuyện thẩm mỹ. Hàng nghìn cái là một lỗi thật — bảng tiến trình có hạn, và làm cạn nó nghĩa là máy không fork được nữa, nên không gì mới khởi động được và ngay cả đăng nhập cũng hỏng. Đây là kiểu hỏng kinh điển của một container chạy ứng dụng trực tiếp ở vị trí PID 1 mà không có init: PID 1 mang những nghĩa vụ thu dọn đặc biệt mà phần lớn ứng dụng không hề cài đặt, và đó là lý do cờ <code>--init</code> của Docker cùng <code>tini</code> tồn tại.</div>

<h3>/proc: nhân dưới dạng một hệ thống file</h3>
<p>Mọi thứ <code>ps</code> và <code>top</code> báo cáo đều đến từ <code>/proc</code>, một hệ thống file ảo nơi mỗi tiến trình là một thư mục đặt tên theo PID của nó. Bạn đọc thẳng nó được:</p>
<pre><code>ls /proc/812/
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
<pre><code>uptime
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
<pre><code>%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 93.9 id,  0.7 wa,  0.0 hi,  0.1 si,  0.0 st</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>us</code> user</span><span class="v">Running your application code. Where you want the time to go.</span></div>
  <div class="kv"><span class="k"><code>sy</code> system</span><span class="v">Inside kernel calls. Consistently high <code>sy</code> suggests heavy syscall traffic — often too many small reads/writes, or context-switch churn.</span></div>
  <div class="kv"><span class="k"><code>id</code> idle</span><span class="v">Doing nothing. High idle plus a high load average means the load is I/O, not CPU.</span></div>
  <div class="kv"><span class="k"><code>wa</code> iowait</span><span class="v"><strong>Waiting for disk.</strong> Above ~10% sustained, storage is your bottleneck. This is the column that explains "the CPU is idle but everything is slow".</span></div>
  <div class="kv"><span class="k"><code>st</code> steal</span><span class="v"><strong>Your VM asked for CPU and the hypervisor gave it to someone else.</strong> Nonzero <code>st</code> on a VPS means you are being throttled or the host is oversubscribed. You cannot fix it from inside — it is a message to your provider.</span></div>
</div>
<div class="callout warn"><code>wa</code> and <code>st</code> are the two most valuable numbers on that line and the two people never look at. A server where everything feels slow, CPU shows 90% idle, and <code>wa</code> sits at 40% is not underused — it is waiting on a disk that cannot keep up, and no amount of application optimisation will help. Chapter 12 covers the follow-up (<code>iostat -x 1</code>, <code>iotop</code>).</div>

<h3>Memory: why "free" is almost zero, and that is correct</h3>
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
<pre><code>sudo dmesg -T | grep -i 'killed process'
sudo journalctl -k | grep -i oom | tail -5</code></pre>
<div class="out">[Fri Aug 22 03:14:52 2026] Out of memory: Killed process 5012 (node)
  total-vm:4210488kB, anon-rss:3841204kB, file-rss:0kB, oom_score_adj:0</div>
<p>When memory truly runs out, the kernel picks a process and kills it — instantly, with <code>SIGKILL</code>, no cleanup and no chance to save anything. It chooses roughly by "largest recent memory consumer", which usually means your application rather than the leak's real cause.</p>
<div class="callout warn">This is the explanation for the most baffling class of production incident: <strong>a service that vanishes with no error in its own logs.</strong> The application did not crash — it was executed. Its log ends mid-sentence because it received no warning. <code>dmesg -T | grep -i 'killed process'</code> takes five seconds and is the first thing to check when a process "disappeared". You met the same mechanism in this project's own history: a parallel Docker build on a 6 GB VPS was OOM-killed and showed up only as <code>Exited(137)</code> — and 137 is exactly 128 + 9, i.e. killed by signal 9.</div>

<h3>Per-process memory, honestly</h3>
<pre><code>ps -eo pid,user,rss,cmd --sort=-rss | head -6
sudo smem -tk -c 'pid user pss rss command' | tail -6</code></pre>
<div class="out">  PID USER       RSS CMD
  901 postgres 412308 postgres: primary
 5012 deploy   298104 node /srv/app/dist/index.js</div>
<p>Summing the <code>RSS</code> column overcounts badly, because shared libraries are counted once per process that maps them — add up RSS on a busy server and you will "find" more memory in use than the machine has. <code>smem</code>'s <code>PSS</code> (Proportional Set Size) divides each shared page among its users, so the column does sum correctly. It is not installed by default; on a machine where memory attribution matters, it is worth the <code>apt install smem</code>.</p>

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
<pre><code>uptime
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
<pre><code>%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 93.9 id,  0.7 wa,  0.0 hi,  0.1 si,  0.0 st</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>us</code> user</span><span class="v">Đang chạy mã ứng dụng của bạn. Chỗ mà bạn MUỐN thời gian đổ vào.</span></div>
  <div class="kv"><span class="k"><code>sy</code> system</span><span class="v">Bên trong các lời gọi của nhân. <code>sy</code> cao dai dẳng gợi ý lưu lượng lời gọi hệ thống lớn — thường là quá nhiều lần đọc/ghi vụn, hoặc chuyển ngữ cảnh liên tục.</span></div>
  <div class="kv"><span class="k"><code>id</code> idle</span><span class="v">Đang không làm gì. Idle cao mà tải trung bình cũng cao nghĩa là tải đến từ I/O, không phải CPU.</span></div>
  <div class="kv"><span class="k"><code>wa</code> iowait</span><span class="v"><strong>Đang chờ đĩa.</strong> Duy trì trên khoảng 10% thì lưu trữ chính là nút thắt của bạn. Đây là cột giải thích câu "CPU rỗi mà mọi thứ vẫn chậm".</span></div>
  <div class="kv"><span class="k"><code>st</code> steal</span><span class="v"><strong>Máy ảo của bạn xin CPU và trình siêu giám sát đem nó cho người khác.</strong> <code>st</code> khác 0 trên một VPS nghĩa là bạn đang bị bóp, hoặc máy chủ vật lý bị bán quá tay. Bạn không chữa được từ bên trong — đó là một thông điệp gửi cho nhà cung cấp.</span></div>
</div>
<div class="callout warn"><code>wa</code> và <code>st</code> là hai con số giá trị nhất trên dòng đó và cũng là hai con số người ta không bao giờ nhìn. Một máy chủ mà mọi thứ đều ì ạch, CPU hiện 90% rỗi, còn <code>wa</code> nằm ở 40% thì không hề đang bị dùng thiếu — nó đang chờ một cái đĩa không theo kịp, và mọi phép tối ưu ứng dụng đều vô ích. Chương 12 nói về bước tiếp theo (<code>iostat -x 1</code>, <code>iotop</code>).</div>

<h3>Bộ nhớ: vì sao "free" gần bằng 0, và đó là ĐÚNG</h3>
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
<pre><code>sudo dmesg -T | grep -i 'killed process'
sudo journalctl -k | grep -i oom | tail -5</code></pre>
<div class="out">[Fri Aug 22 03:14:52 2026] Out of memory: Killed process 5012 (node)
  total-vm:4210488kB, anon-rss:3841204kB, file-rss:0kB, oom_score_adj:0</div>
<p>Khi bộ nhớ thật sự cạn, nhân chọn ra một tiến trình và giết nó — ngay lập tức, bằng <code>SIGKILL</code>, không dọn dẹp và không có cơ hội lưu lại gì. Nó chọn đại khái theo tiêu chí "kẻ tiêu bộ nhớ nhiều nhất gần đây", và điều đó thường nghĩa là ứng dụng của bạn chứ không phải nguyên nhân thật của chỗ rò rỉ.</p>
<div class="callout warn">Đây là lời giải thích cho loại sự cố production khó hiểu nhất: <strong>một dịch vụ biến mất mà không để lại lỗi nào trong log của chính nó.</strong> Ứng dụng KHÔNG sập — nó bị hành quyết. Log của nó kết thúc giữa câu vì nó không hề nhận được cảnh báo nào. Lệnh <code>dmesg -T | grep -i 'killed process'</code> mất năm giây và là thứ đầu tiên cần kiểm khi một tiến trình "biến mất". Bạn đã gặp đúng cơ chế này ngay trong lịch sử của chính dự án này: một lần dựng Docker song song trên VPS 6 GB bị OOM giết và chỉ hiện ra dưới dạng <code>Exited(137)</code> — mà 137 chính là 128 + 9, tức là bị giết bởi tín hiệu số 9.</div>

<h3>Bộ nhớ theo từng tiến trình, một cách trung thực</h3>
<pre><code>ps -eo pid,user,rss,cmd --sort=-rss | head -6
sudo smem -tk -c 'pid user pss rss command' | tail -6</code></pre>
<div class="out">  PID USER       RSS CMD
  901 postgres 412308 postgres: primary
 5012 deploy   298104 node /srv/app/dist/index.js</div>
<p>Cộng dồn cột <code>RSS</code> sẽ đếm thừa rất nhiều, vì thư viện dùng chung bị tính một lần cho MỖI tiến trình có ánh xạ nó — cộng RSS trên một máy chủ bận thì bạn sẽ "tìm thấy" nhiều bộ nhớ đang dùng hơn cả dung lượng máy có. Cột <code>PSS</code> (Proportional Set Size) của <code>smem</code> chia mỗi trang dùng chung cho những kẻ đang dùng nó, nên cột đó cộng lại thì đúng. Nó không có sẵn; trên một cái máy mà việc quy trách nhiệm bộ nhớ là quan trọng, <code>apt install smem</code> rất đáng.</p>

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

<h3>Why some programs ignore Ctrl-C</h3>
<pre><code>vim                <span class="tok-comment"># catches SIGINT — you must :q to leave</span>
sudo apt upgrade   <span class="tok-comment"># blocks it during unpacking, to avoid a half-installed system</span>
sleep 100          <span class="tok-comment"># uses the default action — dies immediately</span></code></pre>
<p>Both catching and ignoring are legitimate. A text editor with unsaved changes should not vanish because you fumbled a key; a package manager mid-unpack should not leave a broken system. When Ctrl-C does nothing, escalate deliberately rather than mashing it — Ctrl-Z to suspend and investigate (Lesson 5.4), then <code>kill</code>, and only then <code>kill -9</code>.</p>

<h3>Sending signals: kill, pkill, killall</h3>
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

<h3>The escalation ladder</h3>
<pre><code><span class="tok-comment"># 1. Ask politely, then wait — this is enough in the overwhelming majority of cases</span>
kill 5012
sleep 5
kill -0 5012 2&gt;/dev/null &amp;&amp; echo "still running" || echo "gone"

<span class="tok-comment"># 2. Only if it is genuinely stuck</span>
kill -9 5012</code></pre>
<div class="callout warn"><strong><code>kill -9</code> is the worst option, not the strongest one.</strong> Because SIGKILL cannot be caught, the process gets no chance to flush its write buffers, finish an in-flight transaction, remove its PID file or close its network connections. That means: a database left needing crash recovery on next start, a half-written file, a stale lock file that blocks the next start entirely, and orphaned child processes. Reach for it only after SIGTERM has been given several seconds and demonstrably failed — and remember that a process in state <code>D</code> (Lesson 5.1) will not die from it either, because it is not running to receive it.</div>

<h3>Graceful shutdown, from the program's side</h3>
<pre><code><span class="tok-comment"># In bash — Chapter 7 covers trap properly</span>
trap 'echo "cleaning up"; rm -f /tmp/work.lock; exit 0' TERM INT
trap 'rm -rf "\$TMPDIR"' EXIT     <span class="tok-comment"># EXIT runs on ANY exit, signal or not</span></code></pre>
<pre><code><span class="tok-comment"># In Node.js — the same idea, and why docker stop needs it</span>
process.on('SIGTERM', async () =&gt; {
  server.close();                 <span class="tok-comment"># stop accepting new connections</span>
  await pool.end();               <span class="tok-comment"># finish in-flight queries</span>
  process.exit(0);
});</code></pre>
<p>This is not academic. <code>docker stop</code> sends SIGTERM, waits ten seconds, then sends SIGKILL. A container that ignores SIGTERM therefore takes ten seconds to stop <em>and</em> dies violently every single deploy. Handling SIGTERM makes deploys both faster and safer, and it is usually five lines.</p>
<div class="callout ok">A subtlety worth knowing: in a container, your app often runs as PID 1, and <strong>PID 1 does not get default signal actions</strong> — the kernel protects it, so a process with no explicit SIGTERM handler will simply not die from <code>docker stop</code>. Combined with the zombie-reaping duty from Lesson 5.1, that is the whole reason for <code>docker run --init</code> and <code>tini</code>. If your container takes exactly ten seconds to stop every time, this is why.</div>

<h3>Reload versus restart</h3>
<pre><code>sudo nginx -t                        <span class="tok-comment"># ALWAYS test the config first</span>
sudo systemctl reload nginx          <span class="tok-comment"># SIGHUP — re-read config, keep serving</span>
sudo systemctl restart nginx         <span class="tok-comment"># stop and start — brief downtime</span>
sudo kill -HUP \$(cat /run/nginx.pid) <span class="tok-comment"># the same reload, by hand</span>
sudo kill -USR1 \$(cat /run/nginx.pid) <span class="tok-comment"># nginx: reopen log files, for rotation</span></code></pre>
<p><code>SIGUSR1</code> and <code>SIGUSR2</code> have no kernel-defined meaning at all — they exist for programs to define. nginx uses USR1 for "reopen logs" and USR2 for "start a new binary alongside the old one", which is how it upgrades itself with zero dropped connections. Check the manual of the specific daemon; there is no general rule, only convention.</p>
<div class="callout warn">Test before you reload. <code>nginx -t</code> validates the config file; skipping it and reloading a broken config leaves the old workers running but means the <em>next</em> restart — possibly at 3am, triggered by something else — fails to start at all. The failure surfaces long after the change, which is the worst kind.</div>

<h3>Seeing what a process does with signals</h3>
<pre><code>grep -E 'SigCgt|SigIgn|SigBlk' /proc/812/status
sudo strace -p 5012 -e trace=signal      <span class="tok-comment"># watch signals arrive, live</span></code></pre>
<div class="out">SigBlk: 0000000000000000
SigIgn: 0000000000001000
SigCgt: 0000000180014a03</div>
<p>Those hex masks list which signals the process ignores (<code>SigIgn</code>) and which it catches with a handler (<code>SigCgt</code>). It is a bit-per-signal field, so bit 0 is signal 1. You will rarely decode it by hand, but when a process refuses to die from SIGTERM, this is the file that proves whether it is ignoring the signal or simply stuck — two very different problems.</p>

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

<h3>Vì sao vài chương trình lờ Ctrl-C đi</h3>
<pre><code>vim                <span class="tok-comment"># bắt SIGINT — bạn phải :q mới ra được</span>
sudo apt upgrade   <span class="tok-comment"># chặn nó trong lúc bung gói, để khỏi có hệ thống cài dở</span>
sleep 100          <span class="tok-comment"># dùng hành động mặc định — chết ngay</span></code></pre>
<p>Cả bắt lẫn lờ đều chính đáng. Một trình soạn thảo có thay đổi chưa lưu không nên biến mất chỉ vì bạn bấm nhầm phím; một trình quản lý gói đang bung dở không nên để lại một hệ thống hỏng. Khi Ctrl-C không có tác dụng, hãy leo thang một cách CÓ CHỦ Ý thay vì bấm loạn lên — Ctrl-Z để treo lại và đi điều tra (Bài 5.4), rồi <code>kill</code>, và chỉ sau đó mới tới <code>kill -9</code>.</p>

<h3>Gửi tín hiệu: kill, pkill, killall</h3>
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

<h3>Thang leo</h3>
<pre><code><span class="tok-comment"># 1. Hỏi một cách lịch sự, rồi chờ — với đại đa số trường hợp thì chừng này là đủ</span>
kill 5012
sleep 5
kill -0 5012 2&gt;/dev/null &amp;&amp; echo "vẫn chạy" || echo "đi rồi"

<span class="tok-comment"># 2. Chỉ khi nó thật sự kẹt cứng</span>
kill -9 5012</code></pre>
<div class="callout warn"><strong><code>kill -9</code> là lựa chọn TỆ nhất, không phải lựa chọn MẠNH nhất.</strong> Vì SIGKILL không bắt được, tiến trình không có cơ hội nào để xả bộ đệm ghi, hoàn tất một giao dịch đang dở, xoá file PID của nó hay đóng các kết nối mạng. Điều đó nghĩa là: một cơ sở dữ liệu phải chạy khôi phục sau sự cố ở lần khởi động sau, một file ghi dở, một file khoá cũ chặn hẳn lần khởi động kế tiếp, và những tiến trình con mồ côi. Chỉ với tay lấy nó SAU KHI đã gửi SIGTERM vài giây và thấy rõ là thất bại — và nhớ rằng một tiến trình ở trạng thái <code>D</code> (Bài 5.1) cũng chẳng chết vì nó, bởi nó có đang chạy đâu mà nhận.</div>

<h3>Tắt êm thấm, nhìn từ phía chương trình</h3>
<pre><code><span class="tok-comment"># Trong bash — Chương 7 nói về trap tử tế</span>
trap 'echo "đang dọn dẹp"; rm -f /tmp/work.lock; exit 0' TERM INT
trap 'rm -rf "\$TMPDIR"' EXIT     <span class="tok-comment"># EXIT chạy khi thoát theo BẤT KỲ đường nào</span></code></pre>
<pre><code><span class="tok-comment"># Trong Node.js — cùng một ý tưởng, và là lý do docker stop cần tới nó</span>
process.on('SIGTERM', async () =&gt; {
  server.close();                 <span class="tok-comment"># ngừng nhận kết nối mới</span>
  await pool.end();               <span class="tok-comment"># chạy nốt các truy vấn đang dở</span>
  process.exit(0);
});</code></pre>
<p>Đây không phải chuyện lý thuyết. <code>docker stop</code> gửi SIGTERM, chờ mười giây, rồi gửi SIGKILL. Một container lờ SIGTERM đi thì mất mười giây mới dừng <em>VÀ</em> chết một cách bạo lực ở mỗi lần deploy. Xử lý SIGTERM làm cho việc deploy vừa nhanh hơn vừa an toàn hơn, và thường chỉ tốn năm dòng.</p>
<div class="callout ok">Một điểm tinh tế đáng biết: trong một container, ứng dụng của bạn thường chạy ở vị trí PID 1, mà <strong>PID 1 KHÔNG nhận hành động tín hiệu mặc định</strong> — nhân bảo vệ nó, nên một tiến trình không có bộ xử lý SIGTERM tường minh sẽ đơn giản là không chết vì <code>docker stop</code>. Ghép với nghĩa vụ thu dọn xác sống ở Bài 5.1, đó là toàn bộ lý do <code>docker run --init</code> và <code>tini</code> tồn tại. Nếu container của bạn lần nào cũng mất đúng mười giây để dừng, lý do là đây.</div>

<h3>Nạp lại so với khởi động lại</h3>
<pre><code>sudo nginx -t                        <span class="tok-comment"># LUÔN kiểm cấu hình trước</span>
sudo systemctl reload nginx          <span class="tok-comment"># SIGHUP — đọc lại cấu hình, vẫn phục vụ</span>
sudo systemctl restart nginx         <span class="tok-comment"># dừng rồi chạy lại — có gián đoạn ngắn</span>
sudo kill -HUP \$(cat /run/nginx.pid) <span class="tok-comment"># cũng chính là nạp lại đó, làm bằng tay</span>
sudo kill -USR1 \$(cat /run/nginx.pid) <span class="tok-comment"># nginx: mở lại file log, phục vụ việc xoay vòng</span></code></pre>
<p><code>SIGUSR1</code> và <code>SIGUSR2</code> hoàn toàn KHÔNG có ý nghĩa nào do nhân định sẵn — chúng tồn tại để chương trình tự định nghĩa. nginx dùng USR1 cho "mở lại log" và USR2 cho "chạy một bản nhị phân mới song song với bản cũ", và đó là cách nó tự nâng cấp mà không rớt một kết nối nào. Hãy tra sách hướng dẫn của đúng cái daemon đó; không có luật chung, chỉ có quy ước.</p>
<div class="callout warn">Hãy kiểm trước khi nạp lại. <code>nginx -t</code> xác thực file cấu hình; bỏ qua nó rồi nạp lại một cấu hình hỏng sẽ để các tiến trình thợ cũ chạy tiếp nhưng đồng nghĩa với việc lần khởi động <em>KẾ TIẾP</em> — có thể là 3 giờ sáng, do một chuyện khác kích hoạt — sẽ không lên nổi. Chỗ hỏng lộ ra rất lâu sau thay đổi, và đó là kiểu tệ nhất.</div>

<h3>Xem một tiến trình làm gì với tín hiệu</h3>
<pre><code>grep -E 'SigCgt|SigIgn|SigBlk' /proc/812/status
sudo strace -p 5012 -e trace=signal      <span class="tok-comment"># xem tín hiệu tới, ngay lúc đó</span></code></pre>
<div class="out">SigBlk: 0000000000000000
SigIgn: 0000000000001000
SigCgt: 0000000180014a03</div>
<p>Mấy con số hệ mười sáu đó liệt kê những tín hiệu mà tiến trình lờ đi (<code>SigIgn</code>) và những tín hiệu nó bắt bằng một bộ xử lý (<code>SigCgt</code>). Đó là một trường mỗi tín hiệu một bit, nên bit 0 là tín hiệu 1. Bạn sẽ hiếm khi giải mã nó bằng tay, nhưng khi một tiến trình từ chối chết vì SIGTERM, đây là file chứng minh được nó đang LỜ tín hiệu đi hay chỉ đơn giản là đang KẸT — hai vấn đề rất khác nhau.</p>

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
<pre><code>./build.sh &amp;                       <span class="tok-comment"># start in the background</span>
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

<h3>Why closing the terminal kills it</h3>
<p>Background is not detached. The job is still a child of your shell, in your shell's <em>session</em>, attached to your terminal:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · You disconnect</span><span class="lz-t">SSH connection drops, or you close the window</span><span class="lz-d">The terminal device goes away.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Kernel notices</span><span class="lz-t">sends SIGHUP to the session leader</span><span class="lz-d">That is your shell. "Hang up" — the modem metaphor from Lesson 5.3.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell forwards it</span><span class="lz-t">SIGHUP to every job it owns</span><span class="lz-d">Foreground AND background alike. Default action for SIGHUP is terminate.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Your build dies</span><span class="lz-t">two hours in, with no output saved</span><span class="lz-d">And nothing tells you why, because the log went to a terminal that no longer exists.</span></div>
</div>
<p>So <code>&amp;</code> answers "can I keep using this terminal", not "will this survive me leaving". Those are different questions with different solutions.</p>

<h3>Three ways to detach — and what each actually does</h3>
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
<div class="out">nohup: ignoring input and appending output to 'nohup.out'
[1]+  ./long-build.sh &amp;
[1]+  Running                 ./long-build.sh &amp;</div>
<div class="callout"><code>disown -h</code> is worth remembering specifically because it works <em>after the fact</em>. You are an hour into a build, realise you need to close the laptop, and it is too late for <code>nohup</code> — Ctrl-Z, <code>bg</code>, <code>disown -h %1</code> and the job survives. Without <code>-h</code>, <code>disown</code> removes the job from the table entirely, which also works but means <code>jobs</code> can no longer see it.</div>

<h3>tmux: the answer you should actually use</h3>
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
<pre><code>sudo systemctl enable --now myapp     <span class="tok-comment"># starts at boot, restarts on crash</span>
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&amp;</code></span><span class="v">"Give me my prompt back." Dies when the terminal closes.</span></div>
  <div class="kv"><span class="k"><code>nohup</code> / <code>disown</code></span><span class="v">"Survive this SSH session." Dies on reboot. No way back to the program.</span></div>
  <div class="kv"><span class="k"><code>tmux</code></span><span class="v">"Survive this SSH session, and let me come back." Dies on reboot. Right for interactive long work.</span></div>
  <div class="kv"><span class="k">systemd unit</span><span class="v">"Run forever, restart on failure, start at boot, log to journald." The only correct answer for a service. Chapter 11.</span></div>
</div>
<div class="callout warn">A production application started with <code>nohup node server.js &amp;</code> works right up until the server reboots — after a kernel update, a power event, or the provider migrating your VM — and then it is simply gone, with nothing configured to bring it back. If a process matters, it belongs in a systemd unit. <code>nohup</code> is for a one-off job you are watching, not for anything that should still be running next week.</div>

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
<pre><code>./build.sh &amp;                       <span class="tok-comment"># khởi động ở hậu cảnh</span>
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

<h3>Vì sao đóng terminal lại giết nó</h3>
<p>Chạy nền KHÔNG phải là tách rời. Cái job vẫn là con của shell của bạn, vẫn nằm trong <em>PHIÊN</em> của shell đó, và vẫn gắn vào terminal của bạn:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn ngắt kết nối</span><span class="lz-t">kết nối SSH rớt, hoặc bạn đóng cửa sổ</span><span class="lz-d">Thiết bị terminal biến mất.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nhân nhận ra</span><span class="lz-t">gửi SIGHUP cho trưởng phiên</span><span class="lz-d">Trưởng phiên chính là shell của bạn. "Gác máy" — phép ẩn dụ modem ở Bài 5.3.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell chuyển tiếp</span><span class="lz-t">SIGHUP tới mọi job nó sở hữu</span><span class="lz-d">Cả tiền cảnh LẪN hậu cảnh. Hành động mặc định của SIGHUP là kết thúc.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Bản dựng của bạn chết</span><span class="lz-t">sau hai tiếng, không lưu lại output nào</span><span class="lz-d">Và chẳng có gì báo cho bạn biết vì sao, vì log đã đổ vào một cái terminal nay không còn tồn tại.</span></div>
</div>
<p>Nên dấu <code>&amp;</code> trả lời câu "tôi có dùng tiếp cái terminal này được không", chứ không trả lời câu "cái này có sống sót khi tôi đi không". Đó là hai câu hỏi khác nhau với hai cách giải khác nhau.</p>

<h3>Ba cách tách rời — và mỗi cách thật ra làm gì</h3>
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
<div class="out">nohup: ignoring input and appending output to 'nohup.out'
[1]+  ./long-build.sh &amp;
[1]+  Running                 ./long-build.sh &amp;</div>
<div class="callout"><code>disown -h</code> đáng nhớ chính vì nó dùng được <em>SAU KHI SỰ ĐÃ RỒI</em>. Bạn đã chạy được một tiếng, nhận ra phải gập máy lại, và đã quá muộn cho <code>nohup</code> — Ctrl-Z, <code>bg</code>, <code>disown -h %1</code>, và cái job sống sót. Không có <code>-h</code>, <code>disown</code> gỡ hẳn job khỏi bảng, cũng chạy được nhưng đồng nghĩa với việc <code>jobs</code> không còn thấy nó nữa.</div>

<h3>tmux: câu trả lời bạn thật sự nên dùng</h3>
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
<pre><code>sudo systemctl enable --now myapp     <span class="tok-comment"># chạy lúc khởi động, tự bật lại khi sập</span>
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&amp;</code></span><span class="v">"Trả lại dấu nhắc cho tôi." Chết khi terminal đóng.</span></div>
  <div class="kv"><span class="k"><code>nohup</code> / <code>disown</code></span><span class="v">"Sống sót qua phiên SSH này." Chết khi khởi động lại máy. Không có đường quay lại với chương trình.</span></div>
  <div class="kv"><span class="k"><code>tmux</code></span><span class="v">"Sống sót qua phiên SSH này, và cho tôi quay lại." Chết khi khởi động lại máy. Đúng cho việc dài cần tương tác.</span></div>
  <div class="kv"><span class="k">unit của systemd</span><span class="v">"Chạy mãi, tự bật lại khi hỏng, lên cùng máy, ghi log vào journald." Câu trả lời ĐÚNG DUY NHẤT cho một dịch vụ. Chương 11.</span></div>
</div>
<div class="callout warn">Một ứng dụng production khởi động bằng <code>nohup node server.js &amp;</code> chạy tốt cho tới đúng lúc máy chủ khởi động lại — sau một bản vá nhân, một sự cố điện, hay khi nhà cung cấp di dời máy ảo của bạn — và rồi nó đơn giản là biến mất, chẳng có gì được cấu hình để dựng nó dậy. Nếu một tiến trình là quan trọng, chỗ của nó là trong một unit của systemd. <code>nohup</code> dành cho một việc chạy một lần mà bạn đang ngồi canh, không dành cho thứ lẽ ra tuần sau vẫn phải đang chạy.</div>

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
      description: 'Tám câu về fork/exec, cột TIME, trạng thái D, tải trung bình, bộ nhớ available, mã thoát 128+N, kill -9, và vì sao & không phải là tách rời.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on processes, monitoring, signals and jobs. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: what load average actually counts (5.2), what exit code 137 means (5.3), and why <code>&amp;</code> does not survive a closed terminal (5.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về tiến trình, giám sát, tín hiệu và job. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: tải trung bình thật ra ĐẾM cái gì (bài 5.2), mã thoát 137 nghĩa là gì (bài 5.3), và vì sao <code>&amp;</code> không sống sót khi terminal đóng (bài 5.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does the shell fork() before exec()ing your command, instead of just running it?|||Vì sao shell fork() trước rồi mới exec() lệnh của bạn, thay vì chạy thẳng nó?',
            options: [
              'To run the command faster by reusing memory|||Để lệnh chạy nhanh hơn nhờ dùng lại bộ nhớ',
              'Because the child can set up redirections and pipes on fds 0/1/2 BEFORE the new program loads — which is why the program never knows a redirection happened|||Vì tiến trình con dựng được các phép chuyển hướng và ống dẫn trên fd 0/1/2 TRƯỚC KHI chương trình mới được nạp — và đó là lý do chương trình không hề biết có chuyển hướng nào xảy ra',
              'Because exec() can only be called by a child process|||Vì exec() chỉ gọi được từ một tiến trình con',
              'To keep the exit code, which would otherwise be lost|||Để giữ lại mã thoát, thứ mà nếu không thì sẽ mất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A process shows STAT "D" and will not die even with kill -9. Why?|||Một tiến trình hiện STAT là "D" và không chết kể cả với kill -9. Vì sao?',
            options: [
              'It is a zombie — already dead, so there is nothing left to kill|||Nó là xác sống — chết rồi, nên chẳng còn gì để giết',
              'It is running as root and ignores signals from your user|||Nó chạy bằng root và lờ đi tín hiệu từ người dùng của bạn',
              'It is in uninterruptible sleep inside a syscall waiting on hardware — usually a disk or a hung network mount — and the kernel will not interrupt it|||Nó đang ngủ không ngắt được bên trong một lời gọi hệ thống chờ phần cứng — thường là đĩa hoặc một mount mạng đã treo — và nhân sẽ không ngắt nó',
              'Its SIGKILL handler ignores the signal|||Bộ xử lý SIGKILL của nó lờ tín hiệu đó đi',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A 4-core server shows "load average: 12.0" but 95% idle CPU. What is happening?|||Một máy chủ 4 nhân hiện "load average: 12.0" nhưng CPU rỗi 95%. Chuyện gì đang xảy ra?',
            options: [
              'The load average is broken and should be ignored|||Tải trung bình bị lỗi và nên bỏ qua',
              'Linux counts uninterruptible (D-state) processes in the load, so this is I/O wait — the disk is the bottleneck, and more CPU would change nothing|||Linux đếm cả tiến trình không ngắt được (trạng thái D) vào tải, nên đây là chờ I/O — đĩa mới là nút thắt, và thêm CPU chẳng thay đổi được gì',
              'Twelve processes are each using 8% of a core|||Mười hai tiến trình, mỗi cái dùng 8% một nhân',
              'The machine is 3x overloaded on CPU and needs more cores|||Máy đang quá tải CPU gấp 3 lần và cần thêm nhân',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'free -h shows only 182Mi free out of 7.8Gi. Should you be worried?|||free -h hiện chỉ còn 182Mi trống trong 7,8Gi. Có nên lo không?',
            options: [
              'Yes — the machine is nearly out of memory and will start swapping|||Có — máy sắp hết bộ nhớ và sắp bắt đầu tráo ra swap',
              'No — Linux uses idle RAM as reclaimable disk cache. Read the "available" column instead; low "free" on a long-running server is healthy|||Không — Linux dùng RAM nhàn rỗi làm bộ nhớ đệm đĩa, thu hồi được. Hãy đọc cột "available"; "free" thấp trên một máy chủ chạy lâu là chuyện KHOẺ MẠNH',
              'Yes — you should run "echo 3 > /proc/sys/vm/drop_caches" to reclaim it|||Có — bạn nên chạy "echo 3 > /proc/sys/vm/drop_caches" để thu hồi lại',
              'Only if swap is also full|||Chỉ khi swap cũng đầy nốt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A container exits with code 137. What does that tell you?|||Một container thoát với mã 137. Điều đó cho bạn biết gì?',
            options: [
              'Application error number 137|||Lỗi ứng dụng số hiệu 137',
              'It was killed by signal 9 (128+9 = SIGKILL) — either the OOM killer, or a docker stop that timed out waiting for SIGTERM|||Nó bị giết bởi tín hiệu 9 (128+9 = SIGKILL) — hoặc do OOM killer, hoặc do một lệnh docker stop hết giờ chờ SIGTERM',
              'The container image is corrupt|||Ảnh container bị hỏng',
              'It received Ctrl-C from the terminal|||Nó nhận Ctrl-C từ terminal',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is "kill -9" the worst option rather than the strongest one?|||Vì sao "kill -9" là lựa chọn TỆ nhất chứ không phải MẠNH nhất?',
            options: [
              'It is slower than kill -15|||Nó chậm hơn kill -15',
              'It requires root, unlike other signals|||Nó cần quyền root, khác với các tín hiệu khác',
              'SIGKILL cannot be caught, so the process gets no chance to flush buffers, finish transactions or remove lock files — and it still will not kill a D-state process or a zombie|||SIGKILL không bắt được, nên tiến trình không có cơ hội xả bộ đệm, hoàn tất giao dịch hay xoá file khoá — mà nó cũng vẫn không giết nổi một tiến trình trạng thái D hay một xác sống',
              'It only works on processes you own|||Nó chỉ dùng được với tiến trình do bạn sở hữu',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You run "./build.sh &" over SSH and close your laptop. The build dies. Why?|||Bạn chạy "./build.sh &" qua SSH rồi gập laptop lại. Bản dựng chết. Vì sao?',
            options: [
              'Background jobs are paused when the terminal is idle|||Job nền bị tạm dừng khi terminal nhàn rỗi',
              '& means "do not block my shell", not "detach" — the job is still in your shell\'s session, so when the terminal closes the kernel sends SIGHUP and the shell forwards it to every job|||& nghĩa là "đừng chặn shell của tôi", không phải "tách rời" — job vẫn nằm trong phiên của shell bạn, nên khi terminal đóng thì nhân gửi SIGHUP và shell chuyển tiếp nó tới mọi job',
              'SSH kills all remote processes on disconnect by design|||SSH cố ý giết mọi tiến trình ở đầu xa khi ngắt kết nối',
              'The build ran out of memory while you were away|||Bản dựng hết bộ nhớ trong lúc bạn đi vắng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which tool is correct for an application that must still be running after the server reboots?|||Công cụ nào ĐÚNG cho một ứng dụng phải vẫn đang chạy sau khi máy chủ khởi động lại?',
            options: [
              'nohup, because it ignores SIGHUP|||nohup, vì nó lờ SIGHUP đi',
              'tmux, because the session survives disconnects|||tmux, vì phiên sống sót qua các lần ngắt kết nối',
              'A systemd unit — nohup and tmux both die on reboot; only a service manager starts it at boot and restarts it on failure|||Một unit của systemd — cả nohup lẫn tmux đều chết khi khởi động lại máy; chỉ một trình quản lý dịch vụ mới cho nó lên cùng máy và bật lại khi hỏng',
              'setsid, because it creates a new session with no controlling terminal|||setsid, vì nó tạo một phiên mới không có terminal điều khiển',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
