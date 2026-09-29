/**
 * Linux & Bash — Chương 12: chẩn đoán một máy chủ thật.
 * Phương pháp · nó chết · nó chậm · nó lạ · tổng kết khoá · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 * Nâng cấp 28/09/2026: bài 12.0 slide (deck lx-12, 32 slide) + slide/🧪/🗂/📌 trong 12.1–12.5; đào sâu: USE nhập môn,
 * bảng triệu chứng → lệnh đầu tiên, quét trong container (free/uptime nói về máy chủ), 203/200/217/1 dựng thật bằng
 * systemd 255, refused/timeout/reset/tên (nc -z không thấy reset), bẫy localhost/IPv6 của nginx (đã sửa), mã 126/127/
 * 137/143/255, đĩa đầy + file đã xoá còn mở + inode cạn, hàng chờ accept đầy, zombie + --init, TLS + faketime;
 * sửa: chuyển hướng chỉ gắn lệnh cuối trong script thu bằng chứng, nc -w, CRLF không phải 126. Quiz 10 câu Ch12.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 12 — Diagnosing a real server|||Chương 12 — Chẩn đoán một máy chủ thật',
  description: 'Sách công thức để mở ra GIỮA LÚC SỰ CỐ. Một phương pháp dùng được trên cái máy bạn chưa từng thấy, rồi ba chương công thức theo triệu chứng — nó chết, nó chậm, nó lạ — và cuối cùng là tổng kết cả khoá.',
  lessons: [
    /* ─────────────────────────── 12.0 ─────────────────────────── */
    {
      title: '12.0 — Chapter 12 slides: diagnosing a server in pictures|||12.0 — Slide Chương 12: chẩn đoán máy chủ bằng hình',
      slug: 'lnx-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 12: cây quyết định chết/chậm/lạ, vòng lặp chẩn đoán, cuộc quét 60 giây, USE nhập môn, mã thoát systemd, refused/timeout/reset, 502/504, container 137, load ≠ CPU, vmstat/iostat, đĩa đầy và inode, hàng chờ accept, namei, CRLF, tiến trình chạy bản cũ, TLS và đồng hồ, zombie — mọi sự cố dựng lại thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This chapter is a cookbook, and the slides are its index. Slide 3 is the one to keep: a decision tree that sorts every incident into "it is down", "it is slow" or "it is weird", with the first command for each question. The rest shows each recipe as a picture plus the real output that proves it — because every incident on these slides was deliberately caused in an Ubuntu 24.04 container and diagnosed with the commands you are about to learn.</p>
<p>Slides 3–8 belong to Lesson 12.1 (the loop, the sixty-second sweep, the USE method, "what changed?", evidence before a restart), 9–14 to 12.2 (systemd exit codes, held ports, refused/timeout/reset, 502 versus 504, restarting containers, SSH), 15–20 to 12.3 (load versus CPU, a pinned core, disk wait, memory and OOM, full disks and inodes, a full accept queue), 21–26 to 12.4 (<code>namei</code>, CRLF, stale processes, TLS and the clock, zombies, "works on my machine") and 27 to 12.5 (the four arcs and the four new chapters). The last five are macOS/WSL differences, common mistakes, a two-page cheat sheet — symptom → first command → how to read it — and a 45-minute practice session. Terminals are real output recorded on 28/09/2026 in Ubuntu 24.04 containers (one of them running a real systemd 255), on Docker 29.8 and on a Mac M1; your PIDs and timings will differ, the patterns will not. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Chương này là một cuốn sách công thức, và bộ slide là mục lục của nó. Slide 3 là tấm nên giữ lại: một cây quyết định xếp mọi sự cố vào "nó chết", "nó chậm" hay "nó lạ", kèm câu lệnh đầu tiên cho từng câu hỏi. Phần còn lại vẽ mỗi công thức thành một hình cộng với output THẬT chứng minh nó — vì mọi sự cố trên các slide này đều được cố tình gây ra trong một container Ubuntu 24.04 rồi chẩn đoán bằng đúng những câu lệnh bạn sắp học.</p>
<p>Slide 3–8 thuộc Bài 12.1 (vòng lặp, cuộc quét sáu mươi giây, phương pháp USE, "cái gì đã đổi?", thu bằng chứng trước khi restart), 9–14 thuộc 12.2 (mã thoát systemd, cổng bị chiếm, refused/timeout/reset, 502 so với 504, container quay vòng, SSH), 15–20 thuộc 12.3 (load so với CPU, một nhân kịch trần, chờ đĩa, bộ nhớ và OOM, đĩa đầy và inode, hàng chờ accept đầy), 21–26 thuộc 12.4 (<code>namei</code>, CRLF, tiến trình chạy bản cũ, TLS và đồng hồ, zombie, "máy tôi chạy được") và 27 thuộc 12.5 (bốn cung đường và bốn chương mới). Năm slide cuối là khác biệt trên macOS/WSL, những sai lầm hay gặp, bảng tra nhanh hai trang — triệu chứng → lệnh đầu tiên → đọc output thế nào — và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi ngày 28/09/2026 trong các container Ubuntu 24.04 (một cái chạy systemd 255 thật), trên Docker 29.8 và trên Mac M1; PID và thời gian trên máy bạn sẽ khác, còn quy luật thì không.</p>
</div>
${gallery('lx-12', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Cây quyết định: chết · chậm · lạ'], [4, 'Vòng lặp chẩn đoán 6 bước'], [5, 'Cuộc quét 60 giây'],
  [6, 'USE: dùng · nghẽn · lỗi'], [7, 'Mốc thời gian: cái gì đã đổi'], [8, 'Thu bằng chứng trước khi restart'],
  [9, 'Mã thoát systemd: 203 thì log rỗng'], [10, 'Address already in use'], [11, 'Refused · timeout · reset · tên'],
  [12, '502 so với 504, bẫy localhost/IPv6'], [13, 'Container quay vòng: ExitCode + OOMKilled'], [14, 'Không SSH được'],
  [15, 'Load ≠ CPU: hàng chạy + hàng chờ D'], [16, 'CPU 100%: một luồng kẹt'], [17, 'Chờ đĩa: vmstat + iostat'],
  [18, 'Bộ nhớ: available và OOM'], [19, 'Đĩa đầy: file đã xoá còn mở, inode cạn'], [20, 'Chậm mà rảnh: hàng chờ accept'],
  [21, 'namei: thư mục cha thiếu x'], [22, 'CRLF và mã 126/127'], [23, 'Tiến trình chạy bản cũ'],
  [24, 'TLS và đồng hồ máy khách'], [25, 'Zombie và --init'], [26, '“Máy tôi chạy được”'],
  [27, 'Bốn cung đường + Chương 13–16'], [28, 'macOS và WSL'], [29, 'Sai lầm hay gặp'],
  [30, 'Bảng tra nhanh (1/2): triệu chứng → lệnh'], [31, 'Bảng tra nhanh (2/2): lệnh và cờ'], [32, 'Thực hành Chương 12'],
])}
`,
    },
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — A method for a machine you have never seen|||12.1 — Một phương pháp cho cái máy bạn chưa từng thấy',
      slug: 'lnx-12-1-phuong-phap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vòng lặp chẩn đoán, một cuộc quét sáu mươi giây dán một phát là chạy, ba câu hỏi chẻ đôi bài toán, dựng lại mốc thời gian, và vì sao "khởi động lại thử xem" là câu trả lời tệ thứ hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>A method for a machine you have never seen</h2>
<p class="lead">Somebody sends you an IP address and a sentence: <em>"the site is down"</em>. You have SSH access and nothing else — no dashboard, no context, no idea what runs on this box. Eleven chapters have given you the commands. This one gives you the order to run them in, which is the part that turns a two-hour panic into a ten-minute fix.</p>
<p>The method below is not clever. It is deliberately boring, because clever is what fails at 3am when you are the only person awake.</p>

<h3>The loop</h3>
${slide('lx-12', 4, 'Vòng lặp chẩn đoán 6 bước')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Observe, before touching anything</span><span class="lz-t">the 60-second sweep, below</span><span class="lz-d">Wide and cheap. You are not looking for the cause yet — you are looking for which HALF of the machine is unhappy. Restarting things now destroys the evidence that would have told you.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Establish the timeline</span><span class="lz-t">when did it start, and what changed just before</span><span class="lz-d">"It broke at 14:07" plus "we deployed at 14:05" is a solved incident. Most outages have a cause you can name in the last hour of history.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Narrow to one component</span><span class="lz-t">machine, or network, or app, or data</span><span class="lz-d">Each check should eliminate roughly half of what is left. If a check cannot eliminate anything regardless of its result, do not run it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Form ONE hypothesis and state it out loud</span><span class="lz-t">"nginx is up, the backend is not listening on 3000"</span><span class="lz-d">A hypothesis you can say in a sentence is a hypothesis you can test in a command. If you cannot say it, you are guessing — go back to step 1.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Change ONE thing, and write it down</span><span class="lz-t">then re-test</span><span class="lz-d">Two changes at once means you never learn which one worked, and one of them may be a new bug you will meet next week.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Fix the cause, then the surprise</span><span class="lz-t">why did nothing tell us?</span><span class="lz-d">The incident ends when the service is back. The work ends when the same failure cannot be silent a second time (Lesson 10.3, 11.2).</span></div>
</div>

<h3>The first sixty seconds</h3>
${slide('lx-12', 5, 'Cuộc quét 60 giây: script + output thật')}
<p>One paste, no arguments, safe on any machine — it reads and changes nothing. Run it before you form any opinion at all.</p>
<pre><code class="language-bash">{
  echo "=== who and when ==="; uptime; who; last reboot | head -3
  echo "=== failed units ==="; systemctl --failed --no-legend
  echo "=== errors this boot ==="; journalctl -p err -b --no-pager | tail -15
  echo "=== disk ==="; df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev' | head -3
  echo "=== memory ==="; free -h
  echo "=== top by cpu ==="; ps aux --sort=-%cpu | head -6
  echo "=== top by mem ==="; ps aux --sort=-%mem | head -6
  echo "=== listening ==="; ss -tlnp 2&gt;/dev/null | head -12
  echo "=== kernel ==="; dmesg -T 2&gt;/dev/null | tail -10
} 2&gt;&amp;1 | tee /tmp/sweep-\$(date +%H%M%S).txt</code></pre>
<div class="out">=== who and when ===
 18:41:02 up 12 days,  3:22,  1 user,  load average: 6.84, 4.11, 2.07
deploy   pts/0    203.0.113.55     18:39   still_logged_in
reboot   system boot  6.8.0-45-generic Sun Aug 10 15:19
=== failed units ===
backend.service loaded failed failed Node API
=== errors this boot ===
Aug 22 18:33:41 vps-1 backend[3912]: Error: connect ECONNREFUSED 127.0.0.1:5432
Aug 22 18:33:41 vps-1 systemd[1]: backend.service: Main process exited, code=exited, status=1/FAILURE
Aug 22 18:34:12 vps-1 kernel: Out of memory: Killed process 3401 (postgres)
=== disk ===
/dev/vda1        79G   72G  3.1G  96% /
=== memory ===
               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       1.7Gi        91Mi        12Mi       143Mi       112Mi
Swap:             0B          0B          0B</div>
<p>That sweep took four seconds and the incident is already solved: PostgreSQL was killed by the OOM killer at 18:34, the backend then could not connect and exited, and the machine has no swap and 96% disk. You have not restarted anything, and you can now describe the failure in one sentence — which is the difference between fixing it and making it worse.</p>
<div class="callout ok"><strong><code>tee</code> the sweep to a file.</strong> Ten minutes from now you will want to know what memory looked like <em>before</em> you started changing things, and by then the machine will have moved on. A saved sweep is also the thing you paste into a chat when you ask a colleague, instead of retyping a description that leaves out the one line that mattered.</div>

<h3>Reading the sweep</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">load average: 6.84, 4.11, 2.07</span><span class="v">Rising left to right means it is getting WORSE right now (Lesson 5.2). Compare the numbers to the core count from <code>nproc</code> — 6.8 on 2 cores is a queue; 6.8 on 16 cores is a Tuesday.</span></div>
  <div class="kv"><span class="k">up 12 days</span><span class="v">Rules out "it rebooted". A short uptime you did not expect is itself the finding — check <code>last reboot</code> and <code>journalctl -k -b -1</code> for what happened before it.</span></div>
  <div class="kv"><span class="k">systemctl --failed</span><span class="v">An empty list is a strong signal that the machine is fine and your problem is elsewhere — the network, the database, the client. One line here usually IS the incident.</span></div>
  <div class="kv"><span class="k">Out of memory: Killed process</span><span class="v">The kernel chose a victim (Lesson 5.2). Whatever died is a SYMPTOM; the cause is whatever grew. Look at what was consuming memory just before, not just at what died.</span></div>
  <div class="kv"><span class="k">96% / and Swap: 0B</span><span class="v">Two independent problems, and both make everything else worse. A near-full disk breaks writes, logs and database checkpoints (Lesson 10.1); no swap means memory spikes kill processes instead of merely slowing them (Lesson 11.3).</span></div>
  <div class="kv"><span class="k">ss -tlnp</span><span class="v">Which ports are actually served, and by which process. "The port is not listening" and "the port is listening but refusing" are completely different bugs (Lesson 9.1).</span></div>
</div>

<h3>The USE method, entry level</h3>
${slide('lx-12', 6, 'USE: dùng · nghẽn · lỗi cho từng tài nguyên')}
<p>The sweep tells you which half of the machine is unhappy. When the answer is "the machine itself", you need a way to look at it that does not depend on luck. Brendan Gregg's <strong>USE method</strong> is the simplest one that works: list every <strong>resource</strong> (CPU, memory, disk I/O, disk capacity, network) and ask each one the same three questions.</p>
<table>
<tr><th>Resource</th><th>U — Utilisation: how busy?</th><th>S — Saturation: is work queuing?</th><th>E — Errors: is anything failing?</th></tr>
<tr><td>CPU</td><td><code>vmstat 1</code> → <code>us</code> + <code>sy</code>; <code>top</code></td><td><code>vmstat</code> column <code>r</code> larger than <code>nproc</code>; load ÷ <code>nproc</code></td><td>rare — <code>dmesg</code> machine-check lines</td></tr>
<tr><td>Memory</td><td><code>free -h</code> → <code>available</code></td><td><code>vmstat</code> <code>si</code>/<code>so</code> nonzero; <code>/proc/pressure/memory</code></td><td><code>dmesg | grep -i oom</code>; <code>oom_kill</code> in <code>memory.events</code></td></tr>
<tr><td>Disk I/O</td><td><code>iostat -xz 1</code> → <code>%util</code></td><td><code>aqu-sz</code>, <code>w_await</code>; processes in state <code>D</code></td><td><code>dmesg</code> "I/O error"; a filesystem remounted read-only</td></tr>
<tr><td>Disk capacity</td><td><code>df -h</code> and <code>df -i</code></td><td>—</td><td>"No space left on device"</td></tr>
<tr><td>Network</td><td><code>ip -s link</code>; <code>ss -s</code></td><td><code>ss -lnt</code>: <code>Recv-Q</code> reaching <code>Send-Q</code> on a listener</td><td><code>ip -s link</code> errors / dropped</td></tr>
</table>
<p>Two habits make this work. First, <strong>walk the whole table before digging into any cell</strong> — the point is to find the resource that is exhausted, not the one that is interesting, and people routinely spend an hour on a 60% CPU while the disk queue sits at 74. Second, <strong>treat "every cell is fine" as a result</strong>: it means the machine is innocent and the time is going into waiting on something else, which is Recipe 6 of Lesson 12.3. This is the entry-level version; Chapter 14.2 does USE properly, with <code>mpstat</code>, <code>pidstat</code>, <code>sar</code> and <code>perf</code>.</p>
<h3>Three questions that halve the problem</h3>
${slide('lx-12', 3, 'Cây quyết định: chết · chậm · lạ')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Question 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Is it the machine, or the app?</span><span class="lz-nsub">Can you SSH in? Is load normal, disk fine, memory fine? If yes to all, stop looking at the machine — you are debugging an application, and Chapter 12's later lessons split accordingly.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Question 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Did it EVER work, and what changed?</span><span class="lz-nsub">Never worked = configuration or environment. Worked until 14:07 = something changed at 14:07. These are different investigations, and asking first saves you from running the wrong one.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Question 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Is it everyone, or just you?</span><span class="lz-nsub">Test from the server itself with <code>curl localhost</code> (Lesson 9.2). Working locally but not from outside puts the fault in DNS, TLS, the firewall or the proxy — none of which are the app.</span></div></div>
  </div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Question 3, as three commands — each rules out one layer</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health   <span class="tok-comment"># the app itself</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1/health        <span class="tok-comment"># through nginx</span>
curl -sS -o /dev/null -w '%{http_code}\\n' https://example.com/health     <span class="tok-comment"># through DNS + TLS + firewall</span></code></pre>
<div class="out">200
200
000</div>
<p>App healthy, proxy healthy, the outside world getting nothing. In three seconds you have eliminated everything you were about to spend an hour reading, and the remaining suspects are DNS, TLS, the firewall and the provider's network — a list of four, not a list of everything.</p>

<h3>Build the timeline</h3>
${slide('lx-12', 7, 'Mốc thời gian: cái gì đã đổi')}
<p>Almost every outage has a "just before". Finding it is usually faster than understanding the failure, and it frequently makes understanding the failure unnecessary.</p>
<pre><code class="language-bash"><span class="tok-comment"># When did the machine last change?</span>
journalctl --since '2 hours ago' -p warning --no-pager | head -30
grep -E ' (install|upgrade|remove) ' /var/log/dpkg.log | tail -10   <span class="tok-comment"># packages</span>
ls -lt /etc | head -10                                             <span class="tok-comment"># recently edited config</span>
last -n 10                                                         <span class="tok-comment"># who logged in</span>
sudo journalctl _COMM=sudo --since today | tail -10                <span class="tok-comment"># what they ran with sudo</span>
git -C /srv/app log --oneline -5 --date=iso --pretty='%h %ad %s'   <span class="tok-comment"># what was deployed</span></code></pre>
<div class="out">2026-08-22 14:05:11 +0000 8fbd829 chore: bump image cache TTL to 30d
2026-08-22 09:12:40 +0000 d354882 feat: add /api/v1/reports
$ sudo journalctl _COMM=sudo --since today | tail -3
Aug 22 14:04:58 vps-1 sudo[38801]: deploy : TTY=pts/1 ; PWD=/srv/app ; USER=root ; COMMAND=/usr/bin/systemctl restart backend
Aug 22 14:07:02 vps-1 sudo[38844]: deploy : TTY=pts/1 ; PWD=/etc/nginx ; USER=root ; COMMAND=/usr/bin/nano sites-enabled/app.conf</div>
<p>Somebody edited an nginx config at 14:07 and the symptom started at 14:07. That is not proof, but it is where you look first, and <code>nginx -t</code> plus <code>git diff</code> will confirm or eliminate it in ten seconds.</p>
<div class="callout"><strong><code>ls -lt /etc | head</code> is the single most underrated diagnostic on this page.</strong> Configuration files do not change themselves. A file in <code>/etc</code> with a modification time inside your incident window is either the cause or the failed attempt to fix it, and either way you want to know before you start reading code.</div>

<h3>The rule about restarting</h3>
${slide('lx-12', 8, 'Thu bằng chứng 15 giây + nhật ký sự cố')}
<p>"Have you tried restarting it?" fixes a real percentage of problems, and that is exactly why it is dangerous: it converts a diagnosable failure into an undiagnosable one that will return, usually at a worse hour, with no evidence left behind.</p>
<pre><code class="language-bash"><span class="tok-comment"># If you MUST restart, spend fifteen seconds capturing state first</span>
T=/tmp/evidence-\$(date +%H%M%S); mkdir -p "\$T"
ps auxww                     &gt; "\$T/ps.txt"
ss -tanp                     &gt; "\$T/sockets.txt" 2&gt;/dev/null
{ free -h; df -h; df -i; } &gt; "\$T/resources.txt" 2&gt;&amp;1
sudo journalctl -u backend -n 500 --no-pager &gt; "\$T/backend.log"
sudo journalctl -k -b --no-pager | tail -200 &gt; "\$T/kernel.log"
cp /etc/nginx/sites-enabled/* "\$T/" 2&gt;/dev/null
ls -l "\$T"</code></pre>
<div class="out">total 96
-rw-r--r-- 1 deploy deploy 34981 Aug 22 18:44 backend.log
-rw-r--r-- 1 deploy deploy 11204 Aug 22 18:44 kernel.log
-rw-r--r-- 1 deploy deploy  9633 Aug 22 18:44 ps.txt
-rw-r--r-- 1 deploy deploy   412 Aug 22 18:44 resources.txt
-rw-r--r-- 1 deploy deploy  4118 Aug 22 18:44 sockets.txt</div>
<div class="pitfall co-tieu-de"><strong>A redirection belongs to ONE command, not to the line.</strong> An earlier version of this script had <code>free -h; df -h; df -i &gt; "\$T/resources.txt"</code>. The <code>;</code> splits that into three separate commands, and the <code>&gt;</code> attaches only to the last one: <code>free</code> and <code>df -h</code> printed to your terminal and scrolled away, and the evidence file held nothing but the inode table. Measured in the Ubuntu container: the file started with <code>Filesystem Inodes IUsed IFree</code> and contained no memory line at all. Wrapping the commands in <code>{ …; }</code> makes them one group with one output, which is what the script above now does. The same rule bites in <code>cd /srv &amp;&amp; tar czf - . &gt; /tmp/b.tgz</code> — know which command each arrow belongs to.</div>
<div class="callout warn"><strong>Restarting is a legitimate first action when the outage is costing money and you have the evidence.</strong> The mistake is not restarting — it is restarting <em>instead of</em> looking. Fifteen seconds of capture buys you the ability to explain the incident tomorrow, and "we restarted it and it has not happened again" is not an explanation, it is a countdown.</div>

<h3>Write it down while you work</h3>
<p>An incident log is four columns in a scratch file, and it is what stops the classic failure mode where you make six changes, the problem goes away, and nobody — including you — knows which one did it.</p>
<pre><code>18:41  observed  load 6.8, backend.service failed, OOM killed postgres 18:34, disk 96%
18:43  hypoth.   memory pressure from the 14:05 deploy; no swap so OOM instead of slow
18:45  change    truncate -s 0 /var/log/app/debug.log  (was 41G)  -&gt; disk 44%
18:47  verify    df 44%, postgres started, backend healthy, curl /health = 200
18:52  followup  add swap (11.3), logrotate for app/debug.log (10.3), alert at 80% disk</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Observed</span><span class="lz-lnote">Facts with timestamps, copied from output — not your interpretation of them. "load 6.8", not "the machine is overloaded".</span></div>
  <div class="lz-layer"><span class="lz-lname">Hypothesis</span><span class="lz-lnote">One sentence, testable. Writing it down stops you from quietly switching theories every two minutes and re-checking the same things.</span></div>
  <div class="lz-layer"><span class="lz-lname">Change</span><span class="lz-lnote">The exact command, pasted. This is what you undo if it makes things worse, and what you put in the post-mortem when it makes things better.</span></div>
  <div class="lz-layer"><span class="lz-lname">Verify</span><span class="lz-lnote">The command that PROVES it worked, and its output. "It seems fine now" is how an incident gets reopened forty minutes later.</span></div>
  <div class="lz-layer"><span class="lz-lname">Follow-up</span><span class="lz-lnote">Everything you noticed but did not fix. This list is the real product of an incident; without it you will handle the identical outage again next month.</span></div>
</div>

<h3>Symptom → first command → how to read the output</h3>
${slide('lx-12', 30, 'Bảng tra: triệu chứng → lệnh đầu tiên → đọc gì')}
<p>The rest of this chapter is organised by symptom. This table is the index: the one command worth running first for each, and the part of its output that decides where you go next. Every row was reproduced for real in an Ubuntu 24.04 container while this chapter was written; the lesson number says where the full recipe lives.</p>
<table>
<tr><th>Symptom</th><th>First command</th><th>How to read it</th><th>Recipe</th></tr>
<tr><td>A service will not start</td><td><code>systemctl status X</code></td><td><code>status=203/EXEC</code>, <code>200/CHDIR</code>, <code>217/USER</code> ⇒ the unit is wrong and the app never ran; <code>1/FAILURE</code> ⇒ now read the journal</td><td>12.2 · 1</td></tr>
<tr><td>"Address already in use"</td><td><code>ss -tlnp 'sport = :3000'</code></td><td>the Process column names the PID; PPID 1 in <code>ps</code> means an orphan from an earlier run</td><td>12.2 · 2</td></tr>
<tr><td>"Cannot connect"</td><td><code>nc -vz -w 3 host 3000</code></td><td><code>refused</code> ⇒ server; <code>timed out</code> ⇒ network/firewall; <code>getaddrinfo</code> ⇒ DNS</td><td>12.2 · 3</td></tr>
<tr><td>502 or 504 from nginx</td><td><code>tail /var/log/nginx/error.log</code></td><td><code>111: Connection refused</code> ⇒ app down; <code>upstream timed out</code> ⇒ app slow (504)</td><td>12.2 · 4</td></tr>
<tr><td>Container keeps restarting</td><td><code>docker inspect C --format '{{.State.ExitCode}} {{.State.OOMKilled}}'</code></td><td><code>137 true</code> ⇒ memory limit; <code>1 false</code> ⇒ the app; <code>127</code> ⇒ missing binary</td><td>12.2 · 5</td></tr>
<tr><td>Everything is sluggish</td><td><code>vmstat 1 5</code></td><td><code>r</code> above <code>nproc</code> ⇒ CPU; <code>b</code> and <code>wa</code> high ⇒ disk; <code>si</code>/<code>so</code> nonzero ⇒ memory</td><td>12.3 · 1–4</td></tr>
<tr><td>"No space left on device"</td><td><code>df -h; df -i</code></td><td>bytes or inodes? <code>du</code> smaller than <code>df</code> ⇒ <code>lsof -nP +L1</code></td><td>12.3 · 5</td></tr>
<tr><td>Slow, but nothing is busy</td><td><code>curl -w '…%{time_starttransfer}…'</code></td><td>which phase is long; then <code>ss -lnt</code> for <code>Recv-Q</code> ≥ <code>Send-Q</code></td><td>12.3 · 6</td></tr>
<tr><td>"Permission denied" with correct modes</td><td><code>namei -l /path/to/file</code></td><td>a parent directory missing <code>x</code></td><td>12.4 · 1</td></tr>
<tr><td>Deployed, still old behaviour</td><td><code>ls -l /proc/PID/cwd</code></td><td>process start time (<code>ps -o lstart=</code>) earlier than the file's <code>mtime</code> ⇒ never restarted</td><td>12.4 · 3</td></tr>
</table>
<h3>When you are properly stuck</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Go one layer down</span><span class="v">The app says "connection refused" — so ask the layer below. <code>ss -tlnp</code> for whether anything is listening, <code>curl</code> for whether it answers, <code>journalctl</code> for what it said as it died. Each layer down turns a vague symptom into a specific one.</span></div>
  <div class="kv"><span class="k">Re-read the actual error</span><span class="v">Out loud, in full, including the path and the number. People pattern-match the first four words and miss that the path is <code>/srv/app/dist/dist/index.js</code> or that the port is 3001 rather than 3000.</span></div>
  <div class="kv"><span class="k">Check your assumption, not your logic</span><span class="v">Stuck usually means one "obviously true" fact is false: the file you edited is not the file being read (<code>systemctl cat</code>, <code>sshd -T</code>, <code>nginx -T</code>), or the process running is not the code you deployed (<code>ls -l /proc/\$(pgrep -f app)/cwd</code>).</span></div>
  <div class="kv"><span class="k">Explain it to someone</span><span class="v">Or to a text box. Forcing the problem into full sentences finds the contradiction about half the time before anyone replies — and when it does not, you have already written the question properly.</span></div>
  <div class="kv"><span class="k">Take the machine out of the loop</span><span class="v">Reproduce the failing thing as the smallest possible command, run by hand, as the right user (Lesson 11.2). Most "server bugs" become ordinary bugs the moment you can run them on demand.</span></div>
</div>

<h3>Try it step by step: the sweep in a container, and on a real systemd machine</h3>
<p>You can rehearse the sweep safely in a throwaway container. Do it once — not for the output, but to learn which lines of the sweep are <em>missing</em> or <em>misleading</em> inside a container, because that is exactly what you will meet when you <code>docker exec</code> into a production container during an incident.</p>
<pre><code class="language-bash">docker run --rm -it --memory 512m ubuntu:24.04 bash
<span class="tok-comment"># inside the container:</span>
uptime; systemctl --failed; free -h; ss -tlnp
cat /sys/fs/cgroup/memory.max            <span class="tok-comment"># the limit THIS container really has</span></code></pre>
<div class="out"> 15:49:51 up 4 days, 20:13,  0 user,  load average: 1.02, 1.06, 1.00
bash: line 1: systemctl: command not found
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.8Gi       407Mi        88Mi       4.8Gi       4.9Gi
bash: line 1: ss: command not found
536870912</div>
<p>Read it slowly, because three of those five answers are traps. <code>uptime</code> and <code>free</code> worked, but they describe the <strong>host</strong> (here the 8 GB Docker VM, up four days), not the container: <code>free</code> says 4.9Gi available while the container will be killed at 512 MiB — the <code>memory.max</code> line. <code>systemctl</code> is simply absent, because a container has no systemd; and <code>ss</code> is not installed in the minimal image (<code>apt-get install -y iproute2</code>). Inside a container, the sources of truth are <code>/sys/fs/cgroup/memory.max</code>, <code>memory.events</code> and <code>docker logs</code> / <code>docker inspect</code> from the host.</p>
<p>On a machine that does run systemd — here an Ubuntu 24.04 container booted with a real systemd 255 and a deliberately broken unit — the same sweep takes 0.031 seconds and the failed unit is the first thing it prints:</p>
<div class="out">=== failed units ===
● be-exec.service loaded failed failed Node API (be-exec)
=== errors this boot ===
Sep 28 15:31:40 vps-lab kernel: Memory cgroup out of memory: Killed process 68619 (python3) total-vm:1243200kB, anon-rss:514264kB, …
Sep 28 15:31:59 vps-lab (node)[149]: be-chdir.service: Changing to the requested working directory failed: No such file or directory
=== disk ===
Filesystem      Size  Used Avail Use% Mounted on
overlay         911G   25G  840G   3% /
…
real	0m0.031s</div>
<p>Two lessons from this real run. The kernel lines are there because a privileged container shares the host kernel's log — on your own VPS you would see only your machine's OOM kills, and each one names the victim and how much memory it held (<code>anon-rss:514264kB</code> ≈ 502 MiB, right at a 512 MiB limit). And on a machine where you are <em>not</em> root, a line can be empty for a boring reason: on the Fedora test machine, as an ordinary user, <code>dmesg -T</code> prints <code>dmesg: read kernel buffer failed: Operation not permitted</code>. Use <code>sudo journalctl -k</code> there. A missing line is not a healthy line.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Question</th><th>Ubuntu / WSL2</th><th>macOS (measured on a Mac M1, macOS 27)</th></tr>
<tr><td>Load, cores</td><td><code>uptime</code>, <code>nproc</code></td><td><code>uptime</code>, <code>sysctl -n hw.ncpu</code> — measured: load averages <code>462.70 516.08 651.62</code> on 10 cores, with the CPU still 34% idle and the machine perfectly usable</td></tr>
<tr><td>Who uses CPU</td><td><code>top -b -n1</code>, <code>ps aux --sort=-%cpu</code></td><td><code>top -l 2 -o cpu</code> — the first sample of <code>top -l 1</code> shows 0.0% for every process</td></tr>
<tr><td>Memory</td><td><code>free -h</code>, <code>vmstat 1</code></td><td>neither exists: <code>vm_stat</code> (pages of 16 KB), <code>memory_pressure</code> ("System-wide memory free percentage: 39%")</td></tr>
<tr><td>Listening ports</td><td><code>ss -tlnp</code></td><td>no <code>ss</code>: <code>lsof -nP -iTCP -sTCP:LISTEN</code></td></tr>
<tr><td>System log</td><td><code>journalctl</code>, <code>dmesg -T</code></td><td><code>/usr/bin/log show --last 1h</code> — in zsh a bare <code>log show …</code> fails with <code>zsh:log:1: too many arguments</code>, because zsh has a builtin called <code>log</code></td></tr>
<tr><td>Services</td><td><code>systemctl</code></td><td><code>launchctl</code> (Chapter 15)</td></tr>
</table>
<p>The load figure is the one to remember: macOS counts load differently from Linux, so the "compare load with the number of cores" rule from this lesson does not transfer. On WSL2 every Linux command in this chapter behaves as on Ubuntu, but it describes the WSL virtual machine, not Windows — and <code>systemctl</code> works only if systemd has been enabled in <code>/etc/wsl.conf</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 teammate messages at 23:00: "the demo server is broken, can you look?" Before you touch anything, practise the first ten minutes on a container you control.</p><ol>
<li>Start <code>docker run -d --name lab121 --memory 256m ubuntu:24.04 sleep infinity</code>, then <code>docker exec -it lab121 bash</code> and <code>apt-get update &amp;&amp; apt-get install -y procps iproute2</code>.</li>
<li>Paste the sixty-second sweep from this lesson, including the <code>tee</code>. List which sections printed an error and why (no systemd, no <code>dmesg</code> permission, …).</li>
<li>Compare <code>free -h</code> with <code>cat /sys/fs/cgroup/memory.max</code> and write one sentence explaining why they disagree.</li>
<li>Open an incident log in <code>/tmp/incident.txt</code> with the five columns (observed, hypothesis, change, verify, follow-up) and fill the "observed" line from the saved sweep file only.</li>
<li>Run the fixed evidence script from "The rule about restarting" and confirm <code>resources.txt</code> now contains the memory line.</li></ol>
<p><strong>Done when:</strong> <code>ls /tmp/sweep-*.txt</code> shows a saved sweep, <code>grep -c Mem: "\$T/resources.txt"</code> prints <code>1</code>, and your "observed" line quotes numbers copied from output rather than adjectives. Clean up with <code>docker rm -f lab121</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Incident</span><span class="v">Anything that stops users from getting what they need, from "site down" to "one page is slow".</span></div>
  <div class="kv"><span class="k">Hypothesis</span><span class="v">One testable sentence about the cause, checked by one command.</span></div>
  <div class="kv"><span class="k">Root cause</span><span class="v">The finding with nothing upstream of it; the others are symptoms or contributing conditions.</span></div>
  <div class="kv"><span class="k">Sweep</span><span class="v">A fixed, read-only batch of commands run before forming any opinion.</span></div>
  <div class="kv"><span class="k">USE method</span><span class="v">For every resource: Utilisation, Saturation, Errors — walk the whole table first.</span></div>
  <div class="kv"><span class="k">Saturation</span><span class="v">Work that is waiting because a resource is full: a run queue, a disk queue, a full accept backlog.</span></div>
  <div class="kv"><span class="k">Post-mortem</span><span class="v">The written account after an incident: timeline, cause, fix and follow-ups, without blame.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Observe before you touch: a read-only sweep saved with <code>tee</code> is the evidence every later step depends on.</li>
<li>Pick the branch first — dead, slow or weird — and let the symptom table choose the first command.</li>
<li>"What changed?" (<code>ls -lt /etc</code>, <code>dpkg.log</code>, <code>journalctl _COMM=sudo</code>, <code>git log</code>) often solves the incident before you understand it.</li>
<li>USE walks every resource through Utilisation, Saturation and Errors; "all fine" means the machine is innocent.</li>
<li>If you must restart, capture evidence first — and remember a <code>&gt;</code> belongs to one command, so group with <code>{ …; }</code>.</li>
<li>Inside containers, <code>free</code> and <code>uptime</code> describe the host; the limit lives in <code>/sys/fs/cgroup/memory.max</code>.</li>
</ul>
<a class="link-card" href="https://www.brendangregg.com/USEmethod/use-linux.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — the USE method for Linux</span><span class="lc-sub">Utilisation, Saturation, Errors: a checklist over every resource, so you find the exhausted one instead of the interesting one. The reference for structured performance diagnosis.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2015-12-03/linux-perf-60s.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Linux performance analysis in 60 seconds</span><span class="lc-sub">The original ten-command sweep this lesson adapts. Worth reading for WHY each command is on the list — that reasoning is what lets you drop one when it is not installed.</span></span>
</a>
<a class="link-card" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">Free online. The hypothesis-and-bisect loop, common traps, and why "what changed" beats "what is broken" as an opening question.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read a sweep and name the fault</span><span class="lc-sub">Graded exercises: four real sweeps from broken machines — say what is wrong, which single command you would run next, and which finding is a symptom rather than a cause.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> fixing the first thing you see. The sweep above showed a failed backend, an OOM kill, a 96% disk and no swap — four findings, of which exactly one is the root cause and the rest are consequences or contributing conditions. Restarting the backend "fixes" it for ninety seconds. The habit that prevents this: for every finding, ask "could this be caused by one of the others?" and put it aside if the answer is yes. The root cause is the finding with nothing upstream of it — here, a 41GB debug log that filled the disk.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Observe before you touch: a four-second sweep, saved to a file, is worth more than the first twenty minutes of guessing. Ask what changed before you ask what is broken, because <code>ls -lt /etc</code> and the deploy log solve more incidents than any amount of reading source code. And change exactly one thing at a time and write it down — otherwise the outage ends without anyone learning anything, which means it has not really ended.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Một phương pháp cho cái máy bạn chưa từng thấy</h2>
<p class="lead">Ai đó gửi cho bạn một địa chỉ IP và một câu: <em>"trang web sập rồi"</em>. Bạn có quyền SSH và không có gì khác — không bảng điều khiển, không bối cảnh, không biết cái máy này chạy những gì. Mười một chương vừa rồi đã cho bạn các câu lệnh. Chương này cho bạn THỨ TỰ chạy chúng, và chính phần đó biến hai giờ hoảng loạn thành mười phút sửa xong.</p>
<p>Phương pháp dưới đây không thông minh. Nó buồn tẻ một cách có chủ ý, vì thông minh chính là thứ đổ vỡ lúc 3 giờ sáng khi bạn là người duy nhất còn thức.</p>

<h3>Cái vòng lặp</h3>
${slide('lx-12', 4, 'Vòng lặp chẩn đoán 6 bước')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Quan sát, trước khi đụng vào bất cứ thứ gì</span><span class="lz-t">cuộc quét 60 giây, ở dưới</span><span class="lz-d">Rộng và rẻ. Bạn chưa đi tìm nguyên nhân — bạn đang tìm xem NỬA NÀO của cái máy đang khó ở. Khởi động lại thứ gì lúc này là phá đúng cái bằng chứng lẽ ra đã nói cho bạn biết.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Dựng lại mốc thời gian</span><span class="lz-t">nó bắt đầu lúc nào, và ngay trước đó có gì đổi</span><span class="lz-d">"Hỏng lúc 14:07" cộng "chúng ta deploy lúc 14:05" là một sự cố đã giải xong. Phần lớn sự cố có một nguyên nhân gọi tên được nằm trong một giờ lịch sử gần nhất.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Thu hẹp về MỘT thành phần</span><span class="lz-t">máy, hay mạng, hay ứng dụng, hay dữ liệu</span><span class="lz-d">Mỗi phép kiểm nên loại bỏ được khoảng một nửa phần còn lại. Nếu một phép kiểm dù ra kết quả nào cũng không loại bỏ được gì thì đừng chạy nó.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Lập MỘT giả thuyết và nói to nó ra</span><span class="lz-t">"nginx còn sống, backend không lắng nghe ở cổng 3000"</span><span class="lz-d">Một giả thuyết nói được thành một câu là một giả thuyết kiểm được bằng một câu lệnh. Nếu bạn không nói ra được thì bạn đang ĐOÁN — hãy quay về bước 1.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Đổi MỘT thứ, và ghi nó lại</span><span class="lz-t">rồi kiểm lại</span><span class="lz-d">Đổi hai thứ cùng lúc nghĩa là bạn không bao giờ biết cái nào có tác dụng, và một trong hai có thể là con bọ mới bạn sẽ gặp vào tuần sau.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Sửa nguyên nhân, rồi sửa sự bất ngờ</span><span class="lz-t">tại sao không có gì báo cho chúng ta?</span><span class="lz-d">Sự cố kết thúc khi dịch vụ sống lại. CÔNG VIỆC kết thúc khi cùng cú hỏng đó không thể im lặng thêm lần thứ hai (Bài 10.3, 11.2).</span></div>
</div>

<h3>Sáu mươi giây đầu tiên</h3>
${slide('lx-12', 5, 'Cuộc quét 60 giây: script + output thật')}
<p>Dán một phát, không tham số, an toàn trên mọi máy — nó chỉ đọc và không đổi gì. Hãy chạy nó TRƯỚC khi bạn hình thành bất kỳ ý kiến nào.</p>
<pre><code class="language-bash">{
  echo "=== ai và khi nào ==="; uptime; who; last reboot | head -3
  echo "=== unit hỏng ==="; systemctl --failed --no-legend
  echo "=== lỗi từ lúc khởi động ==="; journalctl -p err -b --no-pager | tail -15
  echo "=== đĩa ==="; df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev' | head -3
  echo "=== bộ nhớ ==="; free -h
  echo "=== ngốn CPU nhất ==="; ps aux --sort=-%cpu | head -6
  echo "=== ngốn RAM nhất ==="; ps aux --sort=-%mem | head -6
  echo "=== đang lắng nghe ==="; ss -tlnp 2&gt;/dev/null | head -12
  echo "=== nhân ==="; dmesg -T 2&gt;/dev/null | tail -10
} 2&gt;&amp;1 | tee /tmp/sweep-\$(date +%H%M%S).txt</code></pre>
<div class="out">=== ai và khi nào ===
 18:41:02 up 12 days,  3:22,  1 user,  load average: 6.84, 4.11, 2.07
deploy   pts/0    203.0.113.55     18:39   still_logged_in
reboot   system boot  6.8.0-45-generic Sun Aug 10 15:19
=== unit hỏng ===
backend.service loaded failed failed Node API
=== lỗi từ lúc khởi động ===
Aug 22 18:33:41 vps-1 backend[3912]: Error: connect ECONNREFUSED 127.0.0.1:5432
Aug 22 18:33:41 vps-1 systemd[1]: backend.service: Main process exited, code=exited, status=1/FAILURE
Aug 22 18:34:12 vps-1 kernel: Out of memory: Killed process 3401 (postgres)
=== đĩa ===
/dev/vda1        79G   72G  3.1G  96% /
=== bộ nhớ ===
               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       1.7Gi        91Mi        12Mi       143Mi       112Mi
Swap:             0B          0B          0B</div>
<p>Cuộc quét đó tốn bốn giây và sự cố đã sáng tỏ: PostgreSQL bị kẻ giết OOM hạ lúc 18:34, backend sau đó không nối được nên thoát, và cái máy thì không có swap cùng đĩa 96%. Bạn chưa khởi động lại thứ gì, và giờ bạn mô tả được cú hỏng trong đúng một câu — đó là khác biệt giữa SỬA nó và LÀM NÓ TỆ HƠN.</p>
<div class="callout ok"><strong>Hãy <code>tee</code> cuộc quét ra một file.</strong> Mười phút nữa bạn sẽ muốn biết bộ nhớ trông thế nào <em>TRƯỚC KHI</em> bạn bắt đầu đổi các thứ, và tới lúc đó cái máy đã đi tiếp rồi. Một cuộc quét đã lưu cũng chính là thứ bạn dán vào khung chat khi hỏi đồng nghiệp, thay vì gõ lại một mô tả bỏ sót đúng cái dòng quan trọng.</div>

<h3>Đọc cuộc quét</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">load average: 6.84, 4.11, 2.07</span><span class="v">Tăng dần từ trái sang phải nghĩa là nó đang TỆ ĐI ngay lúc này (Bài 5.2). Hãy so mấy con số đó với số nhân lấy từ <code>nproc</code> — 6,8 trên 2 nhân là một hàng đợi; 6,8 trên 16 nhân là một ngày thứ Ba bình thường.</span></div>
  <div class="kv"><span class="k">up 12 days</span><span class="v">Loại trừ khả năng "nó vừa khởi động lại". Một uptime ngắn mà bạn không ngờ tới thì tự nó đã là một phát hiện — hãy xem <code>last reboot</code> và <code>journalctl -k -b -1</code> để biết chuyện gì xảy ra trước đó.</span></div>
  <div class="kv"><span class="k">systemctl --failed</span><span class="v">Danh sách rỗng là dấu hiệu mạnh rằng cái máy vẫn ổn và vấn đề của bạn nằm ở chỗ khác — mạng, cơ sở dữ liệu, phía máy khách. Một dòng ở đây thì thường CHÍNH LÀ sự cố.</span></div>
  <div class="kv"><span class="k">Out of memory: Killed process</span><span class="v">Nhân đã chọn một nạn nhân (Bài 5.2). Thứ chết đi là TRIỆU CHỨNG; nguyên nhân là thứ đã PHÌNH RA. Hãy nhìn xem cái gì đang ngốn bộ nhớ ngay trước đó, đừng chỉ nhìn cái đã chết.</span></div>
  <div class="kv"><span class="k">96% / và Swap: 0B</span><span class="v">Hai vấn đề độc lập, và cả hai đều làm mọi thứ khác tệ hơn. Đĩa sắp đầy phá vỡ việc ghi, việc ghi log và checkpoint của cơ sở dữ liệu (Bài 10.1); không swap nghĩa là những cơn tăng vọt bộ nhớ GIẾT tiến trình thay vì chỉ làm chậm chúng (Bài 11.3).</span></div>
  <div class="kv"><span class="k">ss -tlnp</span><span class="v">Cổng nào thật sự đang được phục vụ, và bởi tiến trình nào. "Cổng không lắng nghe" và "cổng có lắng nghe nhưng từ chối" là hai con bọ hoàn toàn khác nhau (Bài 9.1).</span></div>
</div>

<h3>Phương pháp USE, mức nhập môn</h3>
${slide('lx-12', 6, 'USE: dùng · nghẽn · lỗi cho từng tài nguyên')}
<p>Cuộc quét cho bạn biết nửa nào của cái máy đang khó ở. Khi câu trả lời là "chính cái máy", bạn cần một cách nhìn không phụ thuộc vào may mắn. <strong>Phương pháp USE</strong> của Brendan Gregg là cách đơn giản nhất mà vẫn hiệu quả: liệt kê mọi <strong>tài nguyên</strong> (CPU, bộ nhớ, I/O đĩa, dung lượng đĩa, mạng) và hỏi mỗi cái đúng ba câu giống nhau.</p>
<table>
<tr><th>Tài nguyên</th><th>U — Utilisation (mức dùng): bận cỡ nào?</th><th>S — Saturation (mức bão hoà): việc có đang xếp hàng?</th><th>E — Errors (lỗi): có gì đang hỏng?</th></tr>
<tr><td>CPU</td><td><code>vmstat 1</code> → <code>us</code> + <code>sy</code>; <code>top</code></td><td>cột <code>r</code> của <code>vmstat</code> lớn hơn <code>nproc</code>; load ÷ <code>nproc</code></td><td>hiếm — dòng machine-check trong <code>dmesg</code></td></tr>
<tr><td>Bộ nhớ</td><td><code>free -h</code> → <code>available</code></td><td><code>si</code>/<code>so</code> của <code>vmstat</code> khác 0; <code>/proc/pressure/memory</code></td><td><code>dmesg | grep -i oom</code>; <code>oom_kill</code> trong <code>memory.events</code></td></tr>
<tr><td>I/O đĩa</td><td><code>iostat -xz 1</code> → <code>%util</code></td><td><code>aqu-sz</code>, <code>w_await</code>; tiến trình ở trạng thái <code>D</code></td><td>"I/O error" trong <code>dmesg</code>; hệ thống file bị gắn lại chỉ-đọc</td></tr>
<tr><td>Dung lượng đĩa</td><td><code>df -h</code> và <code>df -i</code></td><td>—</td><td>"No space left on device"</td></tr>
<tr><td>Mạng</td><td><code>ip -s link</code>; <code>ss -s</code></td><td><code>ss -lnt</code>: <code>Recv-Q</code> chạm <code>Send-Q</code> trên một cổng đang nghe</td><td>errors / dropped trong <code>ip -s link</code></td></tr>
</table>
<p>Hai thói quen làm cho nó có tác dụng. Thứ nhất, <strong>đi hết cả bảng TRƯỚC khi đào sâu vào một ô nào</strong> — mục đích là tìm tài nguyên ĐÃ CẠN chứ không phải tài nguyên THÚ VỊ, và người ta rất hay mất một tiếng vào cái CPU 60% trong khi hàng chờ đĩa đang đứng ở 74. Thứ hai, <strong>coi "mọi ô đều ổn" là một KẾT QUẢ</strong>: nó nghĩa là cái máy vô can và thời gian đang đổ vào việc CHỜ một thứ khác — đó là Công thức 6 của Bài 12.3. Đây là bản nhập môn; Chương 14.2 làm USE đầy đủ, với <code>mpstat</code>, <code>pidstat</code>, <code>sar</code> và <code>perf</code>.</p>
<h3>Ba câu hỏi chẻ đôi bài toán</h3>
${slide('lx-12', 3, 'Cây quyết định: chết · chậm · lạ')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Câu hỏi 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Là cái máy, hay là ứng dụng?</span><span class="lz-nsub">SSH vào được không? Tải bình thường, đĩa ổn, bộ nhớ ổn? Nếu tất cả đều "có" thì thôi đừng nhìn cái máy nữa — bạn đang gỡ lỗi một ỨNG DỤNG, và các bài sau của Chương 12 chia ra đúng theo hướng đó.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Câu hỏi 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nó ĐÃ TỪNG chạy được chưa, và cái gì đã đổi?</span><span class="lz-nsub">Chưa từng chạy = cấu hình hoặc môi trường. Chạy tốt tới 14:07 = có thứ gì đó đổi lúc 14:07. Đó là hai cuộc điều tra khác nhau, và hỏi trước giúp bạn khỏi chạy nhầm cuộc.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Câu hỏi 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Là tất cả mọi người, hay chỉ mình bạn?</span><span class="lz-nsub">Hãy thử từ chính máy chủ bằng <code>curl localhost</code> (Bài 9.2). Chạy được ở trong mà không được từ ngoài thì lỗi nằm ở DNS, TLS, tường lửa hoặc proxy — không cái nào là ứng dụng cả.</span></div></div>
  </div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Câu hỏi 3, dưới dạng ba câu lệnh — mỗi câu loại một tầng</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health   <span class="tok-comment"># chính ứng dụng</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1/health        <span class="tok-comment"># qua nginx</span>
curl -sS -o /dev/null -w '%{http_code}\\n' https://example.com/health     <span class="tok-comment"># qua DNS + TLS + tường lửa</span></code></pre>
<div class="out">200
200
000</div>
<p>Ứng dụng khoẻ, proxy khoẻ, thế giới bên ngoài không nhận được gì. Trong ba giây bạn đã loại bỏ mọi thứ mà bạn sắp bỏ ra một tiếng để đọc, và danh sách nghi phạm còn lại là DNS, TLS, tường lửa và mạng của nhà cung cấp — một danh sách bốn món, không phải một danh sách vô tận.</p>

<h3>Dựng lại mốc thời gian</h3>
${slide('lx-12', 7, 'Mốc thời gian: cái gì đã đổi')}
<p>Gần như mọi sự cố đều có một cái "ngay trước đó". Tìm ra nó thường nhanh hơn hiểu cú hỏng, và rất hay khiến việc hiểu cú hỏng trở nên không cần thiết.</p>
<pre><code class="language-bash"><span class="tok-comment"># Cái máy đổi lần cuối lúc nào?</span>
journalctl --since '2 hours ago' -p warning --no-pager | head -30
grep -E ' (install|upgrade|remove) ' /var/log/dpkg.log | tail -10   <span class="tok-comment"># gói phần mềm</span>
ls -lt /etc | head -10                                             <span class="tok-comment"># cấu hình vừa bị sửa</span>
last -n 10                                                         <span class="tok-comment"># ai đã đăng nhập</span>
sudo journalctl _COMM=sudo --since today | tail -10                <span class="tok-comment"># họ chạy gì bằng sudo</span>
git -C /srv/app log --oneline -5 --date=iso --pretty='%h %ad %s'   <span class="tok-comment"># đã deploy cái gì</span></code></pre>
<div class="out">2026-08-22 14:05:11 +0000 8fbd829 chore: bump image cache TTL to 30d
2026-08-22 09:12:40 +0000 d354882 feat: add /api/v1/reports
$ sudo journalctl _COMM=sudo --since today | tail -3
Aug 22 14:04:58 vps-1 sudo[38801]: deploy : TTY=pts/1 ; PWD=/srv/app ; USER=root ; COMMAND=/usr/bin/systemctl restart backend
Aug 22 14:07:02 vps-1 sudo[38844]: deploy : TTY=pts/1 ; PWD=/etc/nginx ; USER=root ; COMMAND=/usr/bin/nano sites-enabled/app.conf</div>
<p>Có người sửa một file cấu hình nginx lúc 14:07 và triệu chứng bắt đầu lúc 14:07. Đó không phải bằng chứng, nhưng đó là chỗ bạn nhìn đầu tiên, và <code>nginx -t</code> cộng <code>git diff</code> sẽ xác nhận hoặc loại trừ nó trong mười giây.</p>
<div class="callout"><strong><code>ls -lt /etc | head</code> là phép chẩn đoán bị đánh giá thấp nhất trong cả trang này.</strong> File cấu hình không tự đổi. Một file trong <code>/etc</code> có thời gian sửa nằm trong khoảng sự cố của bạn thì hoặc là nguyên nhân, hoặc là một nỗ lực sửa bất thành — và kiểu nào bạn cũng muốn biết TRƯỚC KHI bắt đầu đọc mã nguồn.</div>

<h3>Luật về chuyện khởi động lại</h3>
${slide('lx-12', 8, 'Thu bằng chứng 15 giây + nhật ký sự cố')}
<p>"Thử khởi động lại xem?" quả thật chữa được một tỷ lệ vấn đề có thật, và chính vì thế nó nguy hiểm: nó biến một cú hỏng CHẨN ĐOÁN ĐƯỢC thành một cú hỏng KHÔNG CHẨN ĐOÁN ĐƯỢC, mà lại sẽ quay lại, thường vào một giờ tệ hơn, và không còn bằng chứng nào.</p>
<pre><code class="language-bash"><span class="tok-comment"># Nếu BUỘC PHẢI khởi động lại, hãy bỏ mười lăm giây thu giữ hiện trạng trước</span>
T=/tmp/evidence-\$(date +%H%M%S); mkdir -p "\$T"
ps auxww                     &gt; "\$T/ps.txt"
ss -tanp                     &gt; "\$T/sockets.txt" 2&gt;/dev/null
{ free -h; df -h; df -i; } &gt; "\$T/resources.txt" 2&gt;&amp;1
sudo journalctl -u backend -n 500 --no-pager &gt; "\$T/backend.log"
sudo journalctl -k -b --no-pager | tail -200 &gt; "\$T/kernel.log"
cp /etc/nginx/sites-enabled/* "\$T/" 2&gt;/dev/null
ls -l "\$T"</code></pre>
<div class="out">total 96
-rw-r--r-- 1 deploy deploy 34981 Aug 22 18:44 backend.log
-rw-r--r-- 1 deploy deploy 11204 Aug 22 18:44 kernel.log
-rw-r--r-- 1 deploy deploy  9633 Aug 22 18:44 ps.txt
-rw-r--r-- 1 deploy deploy   412 Aug 22 18:44 resources.txt
-rw-r--r-- 1 deploy deploy  4118 Aug 22 18:44 sockets.txt</div>
<div class="pitfall co-tieu-de"><strong>Chuyển hướng thuộc về MỘT lệnh, không thuộc về cả dòng.</strong> Bản trước của script này viết <code>free -h; df -h; df -i &gt; "\$T/resources.txt"</code>. Dấu <code>;</code> tách dòng đó thành ba lệnh riêng, và <code>&gt;</code> chỉ gắn vào lệnh CUỐI: <code>free</code> và <code>df -h</code> in ra màn hình rồi trôi mất, còn file bằng chứng chỉ chứa bảng inode. Đo thật trong container Ubuntu: file mở đầu bằng <code>Filesystem Inodes IUsed IFree</code> và không có một dòng bộ nhớ nào. Bọc các lệnh trong <code>{ …; }</code> biến chúng thành một nhóm có chung một đầu ra — đó là cách script ở trên giờ đã viết. Cùng luật ấy cắn cả ở <code>cd /srv &amp;&amp; tar czf - . &gt; /tmp/b.tgz</code> — hãy biết mỗi mũi tên thuộc về lệnh nào.</div>
<div class="callout warn"><strong>Khởi động lại là hành động đầu tiên CHÍNH ĐÁNG khi sự cố đang tiêu tiền và bạn đã có bằng chứng.</strong> Sai lầm không nằm ở việc khởi động lại — nó nằm ở việc khởi động lại <em>THAY VÌ</em> nhìn. Mười lăm giây thu giữ mua cho bạn khả năng giải thích được sự cố vào ngày mai, và "chúng tôi khởi động lại rồi và nó chưa tái diễn" không phải một lời giải thích, đó là một cái đồng hồ đếm ngược.</div>

<h3>Vừa làm vừa ghi</h3>
<p>Một nhật ký sự cố là bốn cột trong một file nháp, và nó là thứ chặn cái kiểu hỏng kinh điển: bạn đổi sáu thứ, vấn đề biến mất, và không ai — kể cả bạn — biết cái nào đã có tác dụng.</p>
<pre><code>18:41  quan sát  load 6,8, backend.service failed, OOM giết postgres 18:34, đĩa 96%
18:43  giả thuyết  bộ nhớ bị ép từ bản deploy 14:05; không swap nên OOM thay vì chậm
18:45  thay đổi  truncate -s 0 /var/log/app/debug.log  (đang 41G)  -&gt; đĩa 44%
18:47  xác nhận  df 44%, postgres lên, backend khoẻ, curl /health = 200
18:52  việc sau  thêm swap (11.3), logrotate cho app/debug.log (10.3), cảnh báo khi đĩa 80%</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Quan sát</span><span class="lz-lnote">Sự kiện kèm mốc thời gian, CHÉP từ output — không phải cách bạn diễn giải chúng. "load 6,8", chứ không phải "cái máy đang quá tải".</span></div>
  <div class="lz-layer"><span class="lz-lname">Giả thuyết</span><span class="lz-lnote">Một câu, kiểm được. Viết nó ra chặn bạn khỏi việc âm thầm đổi lý thuyết mỗi hai phút rồi kiểm lại đúng những thứ đã kiểm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thay đổi</span><span class="lz-lnote">Đúng câu lệnh, dán nguyên. Đây là thứ bạn hoàn tác nếu nó làm mọi chuyện tệ hơn, và là thứ bạn đưa vào biên bản khi nó làm mọi chuyện tốt hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xác nhận</span><span class="lz-lnote">Câu lệnh CHỨNG MINH là nó chạy được, kèm output. "Giờ có vẻ ổn rồi" là cách một sự cố được mở lại sau bốn mươi phút.</span></div>
  <div class="lz-layer"><span class="lz-lname">Việc sau</span><span class="lz-lnote">Mọi thứ bạn để ý thấy mà chưa sửa. Danh sách này mới là sản phẩm thật của một sự cố; không có nó thì tháng sau bạn sẽ xử lý y hệt sự cố đó lần nữa.</span></div>
</div>

<h3>Triệu chứng → lệnh đầu tiên → đọc output thế nào</h3>
${slide('lx-12', 30, 'Bảng tra: triệu chứng → lệnh đầu tiên → đọc gì')}
<p>Phần còn lại của chương xếp theo triệu chứng. Bảng này là mục lục: với mỗi triệu chứng, câu lệnh đáng chạy ĐẦU TIÊN, và phần nào trong output của nó quyết định bạn đi tiếp hướng nào. Mọi dòng đều được dựng lại thật trong một container Ubuntu 24.04 lúc viết chương này; cột cuối chỉ chỗ có công thức đầy đủ.</p>
<table>
<tr><th>Triệu chứng</th><th>Lệnh đầu tiên</th><th>Đọc output thế nào</th><th>Công thức</th></tr>
<tr><td>Dịch vụ không chịu lên</td><td><code>systemctl status X</code></td><td><code>status=203/EXEC</code>, <code>200/CHDIR</code>, <code>217/USER</code> ⇒ unit sai và app chưa từng chạy; <code>1/FAILURE</code> ⇒ giờ mới đọc journal</td><td>12.2 · 1</td></tr>
<tr><td>"Address already in use"</td><td><code>ss -tlnp 'sport = :3000'</code></td><td>cột Process gọi tên PID; PPID 1 trong <code>ps</code> nghĩa là mồ côi từ một lần chạy trước</td><td>12.2 · 2</td></tr>
<tr><td>"Không kết nối được"</td><td><code>nc -vz -w 3 host 3000</code></td><td><code>refused</code> ⇒ máy chủ; <code>timed out</code> ⇒ mạng/tường lửa; <code>getaddrinfo</code> ⇒ DNS</td><td>12.2 · 3</td></tr>
<tr><td>nginx trả 502 hoặc 504</td><td><code>tail /var/log/nginx/error.log</code></td><td><code>111: Connection refused</code> ⇒ app chết; <code>upstream timed out</code> ⇒ app chậm (504)</td><td>12.2 · 4</td></tr>
<tr><td>Container khởi động lại mãi</td><td><code>docker inspect C --format '{{.State.ExitCode}} {{.State.OOMKilled}}'</code></td><td><code>137 true</code> ⇒ trần bộ nhớ; <code>1 false</code> ⇒ lỗi app; <code>127</code> ⇒ thiếu chương trình</td><td>12.2 · 5</td></tr>
<tr><td>Mọi thứ ì ạch</td><td><code>vmstat 1 5</code></td><td><code>r</code> lớn hơn <code>nproc</code> ⇒ CPU; <code>b</code> và <code>wa</code> cao ⇒ đĩa; <code>si</code>/<code>so</code> khác 0 ⇒ bộ nhớ</td><td>12.3 · 1–4</td></tr>
<tr><td>"No space left on device"</td><td><code>df -h; df -i</code></td><td>hết byte hay hết inode? <code>du</code> nhỏ hơn <code>df</code> ⇒ <code>lsof -nP +L1</code></td><td>12.3 · 5</td></tr>
<tr><td>Chậm mà chẳng gì bận</td><td><code>curl -w '…%{time_starttransfer}…'</code></td><td>pha nào dài; rồi <code>ss -lnt</code> xem <code>Recv-Q</code> ≥ <code>Send-Q</code></td><td>12.3 · 6</td></tr>
<tr><td>"Permission denied" mà quyền đúng</td><td><code>namei -l /đường/tới/file</code></td><td>một thư mục cha thiếu <code>x</code></td><td>12.4 · 1</td></tr>
<tr><td>Deploy rồi mà hành vi vẫn cũ</td><td><code>ls -l /proc/PID/cwd</code></td><td>giờ tiến trình khởi động (<code>ps -o lstart=</code>) sớm hơn <code>mtime</code> của file ⇒ chưa từng restart</td><td>12.4 · 3</td></tr>
</table>
<h3>Khi bạn bí thật sự</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đi xuống một tầng</span><span class="v">Ứng dụng nói "connection refused" — vậy hãy hỏi cái tầng dưới nó. <code>ss -tlnp</code> xem có gì đang lắng nghe không, <code>curl</code> xem nó có trả lời không, <code>journalctl</code> xem nó nói gì lúc chết. Mỗi tầng đi xuống biến một triệu chứng mơ hồ thành một triệu chứng cụ thể.</span></div>
  <div class="kv"><span class="k">Đọc lại đúng cái thông báo lỗi</span><span class="v">Đọc to, đọc đủ, gồm cả đường dẫn và con số. Người ta khớp mẫu bốn chữ đầu rồi bỏ sót rằng đường dẫn là <code>/srv/app/dist/dist/index.js</code>, hay rằng cổng là 3001 chứ không phải 3000.</span></div>
  <div class="kv"><span class="k">Hãy kiểm GIẢ ĐỊNH của bạn, đừng kiểm lập luận</span><span class="v">Bí thường nghĩa là có một điều "hiển nhiên đúng" đang sai: file bạn vừa sửa không phải file đang được đọc (<code>systemctl cat</code>, <code>sshd -T</code>, <code>nginx -T</code>), hoặc tiến trình đang chạy không phải mã bạn vừa deploy (<code>ls -l /proc/\$(pgrep -f app)/cwd</code>).</span></div>
  <div class="kv"><span class="k">Giải thích cho ai đó nghe</span><span class="v">Hoặc cho một khung soạn thảo. Ép bài toán thành những câu hoàn chỉnh tìm ra chỗ mâu thuẫn khoảng một nửa số lần TRƯỚC KHI có ai kịp trả lời — và khi không tìm ra, bạn cũng đã viết xong một câu hỏi tử tế.</span></div>
  <div class="kv"><span class="k">Đưa cái máy ra khỏi vòng lặp</span><span class="v">Tái hiện thứ đang hỏng dưới dạng câu lệnh NHỎ NHẤT có thể, chạy tay, dưới đúng người dùng (Bài 11.2). Phần lớn "bọ máy chủ" biến thành bọ bình thường ngay khoảnh khắc bạn gọi chúng ra được theo ý muốn.</span></div>
</div>

<h3>Chạy thử từng bước: cuộc quét trong container, và trên một máy có systemd thật</h3>
<p>Bạn có thể tập cuộc quét một cách an toàn trong một container vứt đi. Hãy làm một lần — không phải vì output, mà để biết dòng nào của cuộc quét sẽ <em>thiếu</em> hoặc <em>đánh lừa</em> bạn khi ở trong container, vì đó đúng là thứ bạn sẽ gặp khi <code>docker exec</code> vào một container production giữa lúc sự cố.</p>
<pre><code class="language-bash">docker run --rm -it --memory 512m ubuntu:24.04 bash
<span class="tok-comment"># bên trong container:</span>
uptime; systemctl --failed; free -h; ss -tlnp
cat /sys/fs/cgroup/memory.max            <span class="tok-comment"># trần THẬT của container này</span></code></pre>
<div class="out"> 15:49:51 up 4 days, 20:13,  0 user,  load average: 1.02, 1.06, 1.00
bash: line 1: systemctl: command not found
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.8Gi       407Mi        88Mi       4.8Gi       4.9Gi
bash: line 1: ss: command not found
536870912</div>
<p>Đọc chậm thôi, vì ba trong năm câu trả lời đó là bẫy. <code>uptime</code> và <code>free</code> chạy được, nhưng chúng mô tả <strong>máy chủ bên dưới</strong> (ở đây là máy ảo Docker 8 GB, đã chạy bốn ngày), không phải container: <code>free</code> báo còn 4,9Gi available trong khi container sẽ bị giết ở 512 MiB — dòng <code>memory.max</code>. <code>systemctl</code> không có, vì container không có systemd; còn <code>ss</code> thì ảnh tối giản không cài sẵn (<code>apt-get install -y iproute2</code>). Trong container, nguồn sự thật là <code>/sys/fs/cgroup/memory.max</code>, <code>memory.events</code>, và <code>docker logs</code> / <code>docker inspect</code> chạy từ máy chủ.</p>
<p>Trên một máy CÓ chạy systemd — ở đây là một container Ubuntu 24.04 khởi động bằng systemd 255 thật, với một unit cố tình hỏng — cùng cuộc quét đó tốn 0,031 giây và cái unit hỏng là thứ đầu tiên nó in ra:</p>
<div class="out">=== failed units ===
● be-exec.service loaded failed failed Node API (be-exec)
=== errors this boot ===
Sep 28 15:31:40 vps-lab kernel: Memory cgroup out of memory: Killed process 68619 (python3) total-vm:1243200kB, anon-rss:514264kB, …
Sep 28 15:31:59 vps-lab (node)[149]: be-chdir.service: Changing to the requested working directory failed: No such file or directory
=== disk ===
Filesystem      Size  Used Avail Use% Mounted on
overlay         911G   25G  840G   3% /
…
real	0m0.031s</div>
<p>Hai bài học từ lần chạy thật này. Những dòng của nhân có mặt vì container đặc quyền dùng chung log nhân với máy chủ — trên VPS của bạn, bạn chỉ thấy các cú giết OOM của chính máy mình, và mỗi dòng gọi tên nạn nhân cùng lượng bộ nhớ nó đang giữ (<code>anon-rss:514264kB</code> ≈ 502 MiB, sát trần 512 MiB). Và trên một máy mà bạn KHÔNG phải root, một dòng có thể trống vì một lý do rất tầm thường: trên máy Fedora thử nghiệm, với tư cách người dùng thường, <code>dmesg -T</code> in ra <code>dmesg: read kernel buffer failed: Operation not permitted</code>. Ở đó hãy dùng <code>sudo journalctl -k</code>. Một dòng bị thiếu không phải là một dòng khoẻ mạnh.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Câu hỏi</th><th>Ubuntu / WSL2</th><th>macOS (đo trên Mac M1, macOS 27)</th></tr>
<tr><td>Tải, số nhân</td><td><code>uptime</code>, <code>nproc</code></td><td><code>uptime</code>, <code>sysctl -n hw.ncpu</code> — đo thật: load <code>462.70 516.08 651.62</code> trên 10 nhân, CPU vẫn rảnh 34% và máy dùng vẫn mượt</td></tr>
<tr><td>Ai ngốn CPU</td><td><code>top -b -n1</code>, <code>ps aux --sort=-%cpu</code></td><td><code>top -l 2 -o cpu</code> — mẫu đầu tiên của <code>top -l 1</code> cho mọi tiến trình 0.0%</td></tr>
<tr><td>Bộ nhớ</td><td><code>free -h</code>, <code>vmstat 1</code></td><td>không có cả hai: <code>vm_stat</code> (trang 16 KB), <code>memory_pressure</code> ("System-wide memory free percentage: 39%")</td></tr>
<tr><td>Cổng đang nghe</td><td><code>ss -tlnp</code></td><td>không có <code>ss</code>: <code>lsof -nP -iTCP -sTCP:LISTEN</code></td></tr>
<tr><td>Log hệ thống</td><td><code>journalctl</code>, <code>dmesg -T</code></td><td><code>/usr/bin/log show --last 1h</code> — trong zsh, gõ trần <code>log show …</code> sẽ hỏng với <code>zsh:log:1: too many arguments</code>, vì zsh có một lệnh dựng sẵn tên <code>log</code></td></tr>
<tr><td>Dịch vụ</td><td><code>systemctl</code></td><td><code>launchctl</code> (Chương 15)</td></tr>
</table>
<p>Con số tải là thứ cần nhớ: macOS đếm load khác Linux, nên luật "so load với số nhân" của bài này không mang sang được. Trên WSL2, mọi lệnh Linux trong chương này chạy như trên Ubuntu, nhưng chúng mô tả MÁY ẢO WSL chứ không phải Windows — và <code>systemctl</code> chỉ chạy khi systemd đã được bật trong <code>/etc/wsl.conf</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> 23 giờ, bạn cùng nhóm SWP391 nhắn: "server demo hỏng rồi, xem giúp với?". Trước khi đụng vào bất cứ thứ gì, hãy tập mười phút đầu trên một container do bạn làm chủ.</p><ol>
<li>Chạy <code>docker run -d --name lab121 --memory 256m ubuntu:24.04 sleep infinity</code>, rồi <code>docker exec -it lab121 bash</code> và <code>apt-get update &amp;&amp; apt-get install -y procps iproute2</code>.</li>
<li>Dán cuộc quét sáu mươi giây của bài này, gồm cả <code>tee</code>. Liệt kê phần nào báo lỗi và vì sao (không có systemd, không có quyền <code>dmesg</code>, …).</li>
<li>So <code>free -h</code> với <code>cat /sys/fs/cgroup/memory.max</code> và viết một câu giải thích vì sao chúng lệch nhau.</li>
<li>Mở nhật ký sự cố <code>/tmp/incident.txt</code> với năm cột (quan sát, giả thuyết, thay đổi, xác nhận, việc sau) và điền dòng "quan sát" CHỈ từ file quét đã lưu.</li>
<li>Chạy script thu bằng chứng đã sửa ở phần "Luật về chuyện khởi động lại" và xác nhận <code>resources.txt</code> giờ có dòng bộ nhớ.</li></ol>
<p><strong>Đạt khi:</strong> <code>ls /tmp/sweep-*.txt</code> thấy một file quét, <code>grep -c Mem: "\$T/resources.txt"</code> in <code>1</code>, và dòng "quan sát" của bạn trích con số chép từ output chứ không phải tính từ. Dọn bằng <code>docker rm -f lab121</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Incident (sự cố)</span><span class="v">Bất cứ thứ gì khiến người dùng không nhận được thứ họ cần, từ "sập web" tới "một trang bị chậm".</span></div>
  <div class="kv"><span class="k">Hypothesis (giả thuyết)</span><span class="v">Một câu kiểm được về nguyên nhân, kiểm bằng một câu lệnh.</span></div>
  <div class="kv"><span class="k">Root cause (nguyên nhân gốc)</span><span class="v">Phát hiện không có gì đứng trước nó; phần còn lại là triệu chứng hay điều kiện góp phần.</span></div>
  <div class="kv"><span class="k">Sweep (cuộc quét)</span><span class="v">Một loạt lệnh cố định, chỉ đọc, chạy trước khi có bất kỳ ý kiến nào.</span></div>
  <div class="kv"><span class="k">USE method (phương pháp USE)</span><span class="v">Với mọi tài nguyên: mức dùng, mức bão hoà, lỗi — đi hết cả bảng trước.</span></div>
  <div class="kv"><span class="k">Saturation (bão hoà)</span><span class="v">Việc phải xếp hàng vì tài nguyên đã đầy: hàng chạy, hàng chờ đĩa, hàng chờ accept đầy.</span></div>
  <div class="kv"><span class="k">Post-mortem (biên bản sau sự cố)</span><span class="v">Bản ghi sau sự cố: mốc thời gian, nguyên nhân, cách sửa và việc cần làm, không đổ lỗi cho ai.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Quan sát trước khi đụng: một cuộc quét chỉ đọc, lưu bằng <code>tee</code>, là bằng chứng mà mọi bước sau dựa vào.</li>
<li>Chọn nhánh trước — chết, chậm hay lạ — rồi để bảng triệu chứng chọn lệnh đầu tiên.</li>
<li>"Cái gì đã đổi?" (<code>ls -lt /etc</code>, <code>dpkg.log</code>, <code>journalctl _COMM=sudo</code>, <code>git log</code>) thường giải xong sự cố trước cả khi bạn hiểu nó.</li>
<li>USE đưa mọi tài nguyên qua ba câu: dùng, nghẽn, lỗi; "tất cả đều ổn" nghĩa là cái máy vô can.</li>
<li>Buộc phải restart thì thu bằng chứng trước — và nhớ <code>&gt;</code> chỉ thuộc về một lệnh, muốn gom thì bọc <code>{ …; }</code>.</li>
<li>Trong container, <code>free</code> và <code>uptime</code> mô tả máy chủ bên dưới; trần thật nằm ở <code>/sys/fs/cgroup/memory.max</code>.</li>
</ul>
<a class="link-card" href="https://www.brendangregg.com/USEmethod/use-linux.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — phương pháp USE cho Linux</span><span class="lc-sub">Mức dùng, mức bão hoà, lỗi: một danh sách kiểm quét qua mọi tài nguyên, để bạn tìm ra cái ĐÃ CẠN thay vì cái THÚ VỊ. Tài liệu tham chiếu cho chẩn đoán hiệu năng có cấu trúc.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2015-12-03/linux-perf-60s.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Phân tích hiệu năng Linux trong 60 giây</span><span class="lc-sub">Bản quét mười lệnh gốc mà bài này phỏng theo. Đáng đọc để hiểu VÌ SAO mỗi lệnh có mặt trong danh sách — chính lý lẽ đó cho phép bạn bỏ bớt một lệnh khi máy không cài nó.</span></span>
</a>
<a class="link-card" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">Đọc miễn phí trên web. Vòng lặp giả thuyết-và-chia đôi, những cái bẫy thường gặp, và vì sao "cái gì đã đổi" là câu mở đầu tốt hơn "cái gì đang hỏng".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc một cuộc quét và gọi tên cái hỏng</span><span class="lc-sub">Bài chấm điểm: bốn cuộc quét thật từ những cái máy đang hỏng — nói xem sai ở đâu, câu lệnh DUY NHẤT bạn sẽ chạy tiếp theo, và phát hiện nào là triệu chứng chứ không phải nguyên nhân.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> sửa cái đầu tiên bạn nhìn thấy. Cuộc quét ở trên cho ra một backend hỏng, một cú giết OOM, một cái đĩa 96% và không có swap — bốn phát hiện, trong đó đúng MỘT cái là nguyên nhân gốc còn lại là hệ quả hoặc điều kiện góp phần. Khởi động lại backend "sửa" được nó trong chín mươi giây. Thói quen chặn chuyện này: với mỗi phát hiện, hãy hỏi "cái này có thể do một trong mấy cái kia gây ra không?" và gạt nó sang bên nếu câu trả lời là có. Nguyên nhân gốc là phát hiện KHÔNG CÓ GÌ ĐỨNG TRƯỚC nó — ở đây là một file log gỡ lỗi 41GB đã làm đầy đĩa.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Quan sát trước khi đụng vào: một cuộc quét bốn giây, lưu ra file, đáng giá hơn hai mươi phút đoán mò đầu tiên. Hãy hỏi CÁI GÌ ĐÃ ĐỔI trước khi hỏi CÁI GÌ ĐANG HỎNG, vì <code>ls -lt /etc</code> và nhật ký deploy giải được nhiều sự cố hơn bất kỳ lượng mã nguồn nào bạn đọc. Và hãy đổi đúng một thứ mỗi lần rồi ghi lại — không thì sự cố kết thúc mà không ai học được gì, tức là nó chưa thật sự kết thúc.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Cookbook: it is down|||12.2 — Sách công thức: nó chết',
      slug: 'lnx-12-2-no-chet',
      type: 'LESSON',
      description: 'Dịch vụ không lên và các mã thoát của systemd, cổng đã bị chiếm, refused với timeout với reset, 502 của nginx, container quay vòng khởi động lại, và không SSH vào được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Cookbook: it is down</h2>
<p class="lead">Six recipes for the failures where something is simply not answering. Each one is a symptom, what it actually means, a ladder of commands, and the fix. Read them out of order; that is what a cookbook is for.</p>

<h3>Recipe 1 — the service will not start</h3>
${slide('lx-12', 9, 'Mã thoát systemd: 203 thì log rỗng')}
<pre><code class="language-bash">systemctl status backend --no-pager -l        <span class="tok-comment"># the headline and the last few log lines</span>
journalctl -u backend -n 50 --no-pager        <span class="tok-comment"># the real story</span>
systemctl cat backend                         <span class="tok-comment"># the unit AS LOADED, drop-ins included</span></code></pre>
<div class="out">× backend.service - Node API
     Loaded: loaded (/etc/systemd/system/backend.service; enabled)
     Active: failed (Result: exit-code) since Fri 2026-08-22 19:02:11 UTC; 8s ago
    Process: 44120 ExecStart=/usr/bin/node dist/index.js (code=exited, status=203/EXEC)
   Main PID: 44120 (code=exited, status=203/EXEC)</div>
<p>The exit code is the whole diagnosis. systemd's are specific and they save you from reading logs that do not exist yet, because the process never got as far as producing any:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">203/EXEC</span><span class="v">The binary could not be executed: wrong path, not executable, or a relative path (systemd does not search <code>PATH</code>). Check with <code>ls -l</code> on the exact string in <code>ExecStart=</code>.</span></div>
  <div class="kv"><span class="k">200/CHDIR</span><span class="v"><code>WorkingDirectory=</code> does not exist, or the <code>User=</code> cannot traverse into it (needs <code>x</code> on every parent — Lesson 4.1).</span></div>
  <div class="kv"><span class="k">217/USER</span><span class="v">The <code>User=</code> does not exist. Typo, or the account was never created on this machine.</span></div>
  <div class="kv"><span class="k">226/NAMESPACE</span><span class="v">A sandboxing directive cannot be satisfied — usually <code>ProtectSystem=strict</code> plus a path the service must write to. Add a <code>ReadWritePaths=</code>.</span></div>
  <div class="kv"><span class="k">1/FAILURE</span><span class="v">The program RAN and exited non-zero. Now the journal has something worth reading: this is an application error, not a unit error.</span></div>
  <div class="kv"><span class="k">143 / 137</span><span class="v">Killed by SIGTERM (normal shutdown) or SIGKILL. A 137 with no <code>stop</code> command from you means the OOM killer or a timeout — check <code>dmesg -T | tail</code> (Lesson 5.3).</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Read the exit code</span><span class="lz-t">systemctl status</span><span class="lz-d">If it is 203/200/217/226 the problem is the UNIT and the logs will be empty. Stop reading application logs.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Run ExecStart by hand, as the User</span><span class="lz-t">sudo -u deploy /usr/bin/node /srv/app/dist/index.js</span><span class="lz-d">Five seconds, and it separates "systemd is configured wrong" from "the app is broken" completely.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Check what it actually loaded</span><span class="lz-t">systemctl cat backend · systemctl show backend -p ExecStart -p User -p Environment</span><span class="lz-d">A drop-in you forgot, or an edit you made without <code>daemon-reload</code> (Lesson 11.1), makes the file on disk and the unit in memory different documents.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Check the environment it gets</span><span class="lz-t">EnvironmentFile= exists? readable by User=? no quotes around values?</span><span class="lz-d">A missing <code>EnvironmentFile</code> is a hard failure; a present-but-unreadable one is the same. And systemd does NOT strip quotes the way a shell does.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Now read the journal</span><span class="lz-t">journalctl -u backend --since '10 min ago'</span><span class="lz-d">Only once the unit itself is proven correct. Otherwise you are looking for an error message the process was never alive enough to write.</span></div>
</div>

<h3>Recipe 2 — "address already in use"</h3>
${slide('lx-12', 10, 'Cổng bị chiếm: ss · fuser · lsof · TERM')}
<pre><code>sudo ss -tlnp | grep ':3000'         <span class="tok-comment"># who is listening, and their PID</span>
sudo fuser -n tcp 3000               <span class="tok-comment"># same answer, shorter</span>
sudo lsof -i :3000                   <span class="tok-comment"># if lsof is installed</span>
ps -fp \$(sudo ss -tlnpH 'sport = :3000' | grep -oP 'pid=\\K[0-9]+' | head -1)</code></pre>
<div class="out">LISTEN 0 511 0.0.0.0:3000 0.0.0.0:* users:(("node",pid=41288,fd=21))
UID    PID  PPID  C STIME TTY   STAT   TIME CMD
deploy 41288 1    0 14:05 ?     Ssl    0:41 node /srv/app/dist/index.js</div>
<p>An orphaned process from a previous run, still holding the port. It is parented to PID 1, which means whatever started it is gone — a <code>tmux</code> session that died, a manual <code>node</code> from a debugging session, or a service that was replaced without being stopped.</p>
<pre><code>sudo kill 41288                      <span class="tok-comment"># SIGTERM first, ALWAYS (Lesson 5.3)</span>
sleep 2; sudo ss -tlnp | grep ':3000' || echo "port free"
<span class="tok-comment"># only if it refuses to die:</span>
sudo kill -9 41288</code></pre>
<div class="callout"><strong>Two lookalikes that are NOT a held port.</strong> First, sockets in <code>TIME_WAIT</code>: <code>ss -tan | grep 3000</code> shows dozens, nothing is listening, and a normal server binds fine — <code>SO_REUSEADDR</code> handles it and your app almost certainly sets it. Second, binding to an address that does not exist: <code>EADDRNOTAVAIL</code> looks similar in a stack trace but means the IP is not on this machine (<code>ip addr</code>), not that the port is taken. Read the errno, not the summary line.</div>

<h3>Recipe 3 — refused, timeout, or reset?</h3>
${slide('lx-12', 11, 'Refused · timeout · reset · tên: gói tin dừng ở đâu')}
<p>Three different failures that people describe with the same words. Telling them apart is the single highest-value distinction in network debugging, because each points at a different layer.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Connection refused</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You reached the machine; nothing is listening</span><span class="lz-nsub">The host actively said no (a TCP RST). Good news — the network works. The service is down, crashed, or bound to a different port or to 127.0.0.1 only. Fix on the SERVER.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection timed out</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nothing answered at all</span><span class="lz-nsub">Packets went into a hole: a firewall DROPping silently, a security group, wrong IP, or the machine is off. Fix in the NETWORK — <code>ufw status</code>, the provider's firewall, <code>ip addr</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection reset by peer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Something answered, then hung up mid-conversation</span><span class="lz-nsub">The connection was established. A proxy timed out, the app crashed mid-request, TLS was expected and plain HTTP arrived, or a body exceeded a limit. Fix in the APPLICATION or the proxy.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Name or service not known</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You never got an IP</span><span class="lz-nsub">Pure DNS (Lesson 9.1). Nothing was attempted; check <code>dig +short name</code> and <code>/etc/resolv.conf</code> before touching anything else.</span></div></div>
  </div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Which one is it? -m 5 so a timeout does not make you wait 2 minutes</span>
curl -sS -m 5 -o /dev/null -w '%{http_code} %{time_total}s\\n' http://10.0.0.9:3000/health
nc -vz -w 3 10.0.0.9 3000            <span class="tok-comment"># TCP only, no HTTP — isolates the layer; -w 3 = give up after 3 s</span></code></pre>
<div class="out">$ nc -vz -w 3 10.0.0.9 3000
nc: connect to 10.0.0.9 port 3000 (tcp) failed: Connection refused
$ nc -vz -w 3 10.0.0.9 5432
nc: connect to 10.0.0.9 port 5432 (tcp) timed out: Operation now in progress</div>
<p>Port 3000: refused, so the machine is reachable and the service is down — server problem. Port 5432: timed out, so a firewall is dropping it — network problem. Same machine, two different investigations, distinguished in four seconds by one flag.</p>
<div class="callout warn"><strong>Always give <code>nc</code> a timeout.</strong> Without <code>-w</code>, a dropped packet makes <code>nc</code> wait for the operating system's own TCP timeout. Measured in the lab container against an address that drops everything, <code>nc -vz 10.255.255.1 5432</code> sat silent for <strong>1 minute 15 seconds</strong> before giving up; with <code>-w 3</code> it printed <code>timed out: Operation now in progress</code> after three. The message itself is also a clue: "timed out" only appears when YOU set the limit. An earlier version of this recipe showed that message for a command without <code>-w</code>; the command above is now the one that actually produces it.</div>

<h3>Recipe 4 — nginx returns 502 Bad Gateway</h3>
${slide('lx-12', 12, '502 so với 504, và bẫy localhost/IPv6')}
<p>502 means nginx could not get a valid response from the thing behind it. nginx is working — that is what makes 502 useful. Its error log names the reason precisely:</p>
<pre><code class="language-bash">sudo tail -20 /var/log/nginx/error.log
sudo ss -tlnp | grep -E ':(3000|8080)'
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health
sudo nginx -T | grep -A3 proxy_pass          <span class="tok-comment"># what nginx REALLY has loaded</span></code></pre>
<div class="out">2026/08/22 19:14:02 [error] 812#812: *4471 connect() failed (111: Connection refused)
  while connecting to upstream, client: 203.0.113.55, server: example.com,
  request: "GET /api/v1/posts HTTP/1.1", upstream: "http://127.0.0.1:3000/api/v1/posts"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">111: Connection refused</span><span class="v">The upstream is not listening. Recipe 1 — the app is down. This is the common case by a wide margin.</span></div>
  <div class="kv"><span class="k">110: Connection timed out</span><span class="v">The app accepted the connection and never replied. It is alive but stuck: check for a blocked event loop, a hung database query, or an exhausted connection pool.</span></div>
  <div class="kv"><span class="k">13: Permission denied</span><span class="v">Unix-socket upstreams. The socket exists but <code>www-data</code> cannot open it — check the socket's mode and the directory's <code>x</code> bit (Lesson 4.1).</span></div>
  <div class="kv"><span class="k">upstream prematurely closed connection</span><span class="v">The app crashed mid-response. The reason is in the APP's log, at the same second — <code>journalctl -u backend --since</code> that timestamp.</span></div>
  <div class="kv"><span class="k">no live upstreams</span><span class="v">Every server in an upstream block is marked down after repeated failures. Fix the backends; nginx re-tries them on its own schedule.</span></div>
  <div class="kv"><span class="k">504 instead of 502</span><span class="v">Not the same bug. 504 is <code>proxy_read_timeout</code> expiring — the app is SLOW, not dead. Go to Lesson 12.3.</span></div>
</div>
<div class="pitfall"><strong>Pitfall:</strong> <code>localhost</code> in <code>proxy_pass</code> on a dual-stack machine. <code>localhost</code> resolves to both <code>::1</code> and <code>127.0.0.1</code>, and nginx turns the two addresses into a small upstream group. With <code>proxy_pass http://localhost:3000</code> and an app that listens on IPv4 only, nginx tries IPv6 first, gets refused, logs it, and <em>passes the request on</em> to <code>127.0.0.1</code> — so users get a 200 while <code>curl http://127.0.0.1:3000</code> also works, and the only evidence is one error-log line per request: <code>upstream: "http://[::1]:3000/…"</code>. Measured with nginx 1.24 on Ubuntu 24.04: three requests, three <code>200</code>s, three <code>connect() failed (111: Connection refused)</code> lines. (An earlier version of this lesson said you get a 502 here — you do not, and that wrong belief sends people hunting for a crash that is not happening.) The version that really returns <strong>502</strong> is the mirror image, also measured: an app listening on <code>[::1]</code> only, behind <code>proxy_pass http://127.0.0.1:3000</code>. Recent Node.js versions can end up exactly there when told to listen on <code>'localhost'</code>. Either way, write one explicit address — <code>127.0.0.1</code> — in <code>proxy_pass</code> and make the app bind that same address.</div>

<h3>Recipe 5 — the container restarts forever</h3>
${slide('lx-12', 13, 'Container quay vòng: ExitCode + OOMKilled')}
<pre><code class="language-bash">docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}'
docker logs --tail 50 --timestamps cuonghoangdev_backend
docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</code></pre>
<div class="out">NAMES                     STATUS                          IMAGE
cuonghoangdev_backend     Restarting (1) 3 seconds ago    cuonghoangdev-backend:latest
$ docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'
1 false 47</div>
<div class="kv-grid">
  <div class="kv"><span class="k">ExitCode 1, OOMKilled false</span><span class="v">The application itself is failing at startup. <code>docker logs</code> has the reason — usually a missing env var or an unreachable dependency.</span></div>
  <div class="kv"><span class="k">OOMKilled true (exit 137)</span><span class="v">The container hit its memory limit, or the host ran out. <code>docker stats</code> and the host's <code>dmesg -T</code>. Raise the limit or fix the leak — a restart just repeats it.</span></div>
  <div class="kv"><span class="k">Exit 127</span><span class="v">Command not found INSIDE the image. The entrypoint references a binary the image does not have — very common after switching base images.</span></div>
  <div class="kv"><span class="k">Exit 126</span><span class="v">Found but not executable: a missing <code>+x</code> on an entrypoint script, or a filesystem mounted <code>noexec</code>. (A script with CRLF line endings is a different failure: the kernel looks for an interpreter named <code>/bin/sh\\r</code>, does not find it, and reports "no such file or directory" — exit 127 in a shell, not 126. An earlier version of this card lumped the two together. On Docker 29 both of these entrypoint mistakes show up as exit <strong>255</strong>; see the measured table below.)</span></div>
  <div class="kv"><span class="k">Starts, then dies with no log</span><span class="v">The wrong architecture or libc. This project's own history: an image built from the wrong <code>Dockerfile</code> put glibc Prisma engines on a musl Alpine base — green build, green push, endless restarts, API down for seven minutes.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Get a shell in the image WITHOUT the entrypoint — the fastest way to look around</span>
docker run --rm -it --entrypoint sh cuonghoangdev-backend:latest
<span class="tok-comment"># inside: ls -l /app/dist, node -v, ldd \$(which node) | head</span></code></pre>

<h3>Measured: what each container failure looks like</h3>
<p>Four containers broken on purpose on Docker 29.8, each read the same way — <code>docker ps</code> for the status, <code>docker logs</code> for the last words, <code>docker inspect</code> for the three numbers that matter:</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. the app exits at startup, with a restart policy</span>
docker run -d --name lx12-loop --memory 64m --restart on-failure:5 ubuntu:24.04 \\
  bash -c 'echo "\$(date +%T) backend starting"; [ -n "\$DATABASE_URL" ] || { echo "Error: DATABASE_URL is not set" &gt;&amp;2; exit 1; }'
docker ps -a --format 'table {{.Names}}\\t{{.Status}}'
docker logs --tail 2 lx12-loop
docker inspect lx12-loop --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</code></pre>
<div class="out">NAMES       STATUS
lx12-loop   Restarting (1) Less than a second ago
15:24:58 backend starting
Error: DATABASE_URL is not set
1 false 5</div>
<table>
<tr><th>Broken on purpose</th><th><code>docker ps</code> / CLI</th><th>ExitCode · OOMKilled</th><th>What it means</th></tr>
<tr><td>app exits 1 at startup (above)</td><td><code>Restarting (1)</code>, then <code>Exited (1)</code> after 5 tries</td><td><code>1 false</code></td><td>read <code>docker logs</code>: the app told you</td></tr>
<tr><td><code>--memory 64m</code> + a shell loop doubling a string</td><td><code>Exited (137) 5 seconds ago</code></td><td><code>137 true</code></td><td>the memory limit; <code>docker logs</code> shows only the last normal line</td></tr>
<tr><td><code>docker run ubuntu:24.04 node dist/index.js</code></td><td><code>exec: "node": executable file not found in \$PATH</code></td><td>CLI exit <code>127</code></td><td>the binary is not in the image</td></tr>
<tr><td>entrypoint script with CRLF</td><td><code>exec /entry.sh: no such file or directory</code></td><td><code>255</code></td><td>the <code>\\r</code> in the shebang — <code>cat -A</code> (12.4)</td></tr>
<tr><td>entrypoint script without <code>+x</code></td><td><code>exec /entry.sh: permission denied</code></td><td><code>255</code></td><td><code>chmod +x</code> in the Dockerfile</td></tr>
</table>
<p>Two things surprised us when measuring. First, a shell script that dies from <code>\${DATABASE_URL:?}</code> exits with <strong>127</strong>, not 1 — so "127 = command not found" is a strong hint, not a law; read <code>docker logs</code> before concluding. Second, on current Docker the two entrypoint mistakes both surface as <strong>255</strong> with only the <code>exec …</code> line to tell them apart; older tables that promise 126 for "not executable" describe older Docker versions. The error text is the reliable part.</p>
<h3>Recipe 6 — you cannot SSH in at all</h3>
${slide('lx-12', 14, 'Không SSH được: phía máy chủ nói rõ')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Is the machine there?</span><span class="lz-t">ping -c3 IP · then the provider's console</span><span class="lz-d">No ping proves little (ICMP is often blocked), but a reply proves the host is up and routed — that alone eliminates half the possibilities.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Is the port open?</span><span class="lz-t">nc -vz IP 22</span><span class="lz-d">Refused = sshd is down; the machine is fine. Timed out = firewall or security group. Two different fixes, and neither involves your key.</span></div>
  <div class="lz-step"><span class="lz-k">3 · What does the client say?</span><span class="lz-t">ssh -vvv user@IP 2&gt;&amp;1 | tail -30</span><span class="lz-d">Verbose mode names the exact step that failed: which keys it offered, whether the server accepted the username, whether it fell through to password.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Permission denied (publickey)</span><span class="lz-t">check modes on the SERVER, via the console</span><span class="lz-d">Almost always <code>~/.ssh</code> or <code>authorized_keys</code> permissions (Lesson 11.3), a wrong <code>AllowUsers</code>, or a key added to the wrong user's file.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Use the provider's console</span><span class="lz-t">the web VNC / serial console</span><span class="lz-d">This is what it is for. Log in there, run <code>systemctl status ssh</code> and <code>sshd -T</code>, fix, and get out. If the console needs a password you never set, reset it from the provider's panel first.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># The server side of a rejected key — the message you cannot see from the client</span>
sudo journalctl -u ssh -n 20 --no-pager | grep -iE 'refused|invalid|denied'</code></pre>
<div class="out">Aug 22 19:22:31 vps-1 sshd[45012]: Authentication refused: bad ownership or modes for directory /home/deploy/.ssh
Aug 22 19:22:31 vps-1 sshd[45012]: Connection closed by authenticating user deploy 203.0.113.55 port 51992 [preauth]</div>
<p>The client said "Permission denied (publickey)" — a message that describes nothing. The server said exactly what is wrong. Whenever you can reach the server another way, its log is worth more than any amount of client-side <code>-vvv</code>.</p>

<h3>Try it step by step: four broken units on a real systemd</h3>
<p>The exit-code table becomes obvious once you have caused each code yourself. This was run in an Ubuntu 24.04 container booted with systemd 255 (<code>--privileged</code>, deleted afterwards — do not do this on a machine you care about). One unit template, four deliberate mistakes:</p>
<pre><code><span class="tok-comment"># /etc/systemd/system/be-exec.service  (the other three differ in one line)</span>
[Unit]
Description=Node API (be-exec)
[Service]
User=deploy
WorkingDirectory=/srv/app
ExecStart=/usr/local/bin/node dist/index.js   <span class="tok-comment"># node is really /usr/bin/node</span></code></pre>
<pre><code class="language-bash">systemctl daemon-reload
for u in be-exec be-chdir be-user be-fail backend; do systemctl start \$u; done
for u in be-exec be-chdir be-user be-fail backend; do
  echo "\$u: \$(systemctl show \$u -p ExecMainStatus -p ActiveState -p Result --value | tr '\\n' ' ')"
done</code></pre>
<div class="out">be-exec: exit-code 203 failed
be-chdir: exit-code 200 failed
be-user: exit-code 217 failed
be-fail: exit-code 1 failed
backend: success 0 active</div>
<table>
<tr><th>Unit</th><th>The one wrong line</th><th>Status</th><th>What the journal adds</th></tr>
<tr><td><code>be-exec</code></td><td><code>ExecStart=/usr/local/bin/node …</code></td><td><code>203/EXEC</code></td><td><strong>nothing</strong> — only "Main process exited, code=exited, status=203/EXEC"</td></tr>
<tr><td><code>be-chdir</code></td><td><code>WorkingDirectory=/srv/api</code></td><td><code>200/CHDIR</code></td><td><code>Changing to the requested working directory failed: No such file or directory</code></td></tr>
<tr><td><code>be-user</code></td><td><code>User=deplyo</code></td><td><code>217/USER</code></td><td><code>Failed to determine user credentials: No such process</code></td></tr>
<tr><td><code>be-fail</code></td><td><code>ExecStart=/usr/bin/node dist/missing.js</code></td><td><code>1/FAILURE</code></td><td>Node's own stack trace: <code>code: 'MODULE_NOT_FOUND'</code></td></tr>
</table>
<p>The row to remember is the first: for <code>203/EXEC</code> the journal contains no reason at all, so the only useful next command is <code>ls -l</code> on the exact path in <code>ExecStart=</code>. Only <code>1/FAILURE</code> means the application ran — that is the one case where reading the application's log is the right move. And <code>systemctl show backend -p ExecStart</code> prints what systemd actually resolved (<code>path=/usr/bin/node ; argv[]=/usr/bin/node dist/index.js</code>), which is how you catch a drop-in overriding the file you edited.</p>

<h3>Exit codes above 128: the signal is in the number</h3>
<pre><code>sleep 100 &amp; kill -9 \$!; wait \$!; echo "exit=\$?"
sleep 100 &amp; kill \$!;    wait \$!; echo "exit=\$?"</code></pre>
<div class="out">bash: line 1:  3974 Killed                  sleep 100
exit=137
exit=143</div>
<p>When a process dies from a signal, the shell, systemd and Docker all report <strong>128 + the signal number</strong>: 137 = 128 + 9 (SIGKILL), 143 = 128 + 15 (SIGTERM), 130 = 128 + 2 (Ctrl-C). So 143 after a deploy is a normal shutdown; 137 that nobody asked for is the OOM killer or a stop timeout (systemd sends SIGKILL after <code>TimeoutStopSec</code>, 90 s by default). And note who printed <code>Killed</code>: the shell, on behalf of a program that never got the chance to say anything.</p>

<h3>Measured: four ways to fail to connect</h3>
<pre><code class="language-bash">nc -vz -w 3 127.0.0.1 19121             <span class="tok-comment"># nothing listening</span>
nc -vz -w 3 10.255.255.1 5432           <span class="tok-comment"># an address that drops packets</span>
nc -vz -w 3 127.0.0.1 19122             <span class="tok-comment"># a server that accepts, then resets</span>
nc -vz -w 3 db.khong-ton-tai.example 5432
curl -sS -m 3 http://127.0.0.1:19122/; echo "exit=\$?"</code></pre>
<div class="out">nc: connect to 127.0.0.1 port 19121 (tcp) failed: Connection refused
nc: connect to 10.255.255.1 port 5432 (tcp) timed out: Operation now in progress
Connection to 127.0.0.1 19122 port [tcp/*] succeeded!
nc: getaddrinfo for host "db.khong-ton-tai.example" port 5432: Name or service not known
curl: (56) Recv failure: Connection reset by peer
exit=56</div>
<p>The third line is the trap. The server on 19122 accepts every connection and then slams it shut with a reset; <code>nc -z</code> only completes the TCP handshake, so it happily reports <code>succeeded!</code>, while every real request fails with <code>curl: (56) … reset by peer</code>. "The port is open" is not "the service works". The matching curl exit codes are 7 (refused), 28 (timed out), 56 (reset) and 6 (name) — Lesson 9.2 has the full list.</p>

<h3>Flag table: the commands of this lesson</h3>
<table>
<tr><th>Command and flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>systemctl status -l --no-pager</code></td><td>full lines, no pager — for pasting</td><td><code>systemctl status backend -l --no-pager</code></td></tr>
<tr><td><code>systemctl show -p Prop --value</code></td><td>one property, value only</td><td><code>systemctl show backend -p ExecMainStatus --value</code></td></tr>
<tr><td><code>journalctl -u unit -n N --since</code></td><td>one unit, last N lines, from a time</td><td><code>journalctl -u backend -n 50 --since '10 min ago'</code></td></tr>
<tr><td><code>ss -t -l -n -p</code> + filter</td><td>TCP, listening, numeric, with process</td><td><code>ss -tlnp 'sport = :3000'</code></td></tr>
<tr><td><code>fuser -v -n tcp PORT</code></td><td>who holds the port; <code>-k</code> would kill it</td><td><code>fuser -v -n tcp 3000</code></td></tr>
<tr><td><code>lsof -nP -iTCP:PORT -sTCP:LISTEN</code></td><td>no DNS/port names, TCP only, listeners only</td><td><code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code></td></tr>
<tr><td><code>nc -v -z -w N</code></td><td>verbose, connect-only, give up after N s</td><td><code>nc -vz -w 3 10.0.0.9 5432</code></td></tr>
<tr><td><code>curl -sS -m N -o /dev/null -w</code></td><td>quiet but show errors, max time, print a variable</td><td><code>curl -sS -m 5 -o /dev/null -w '%{http_code}\\n' URL</code></td></tr>
<tr><td><code>docker inspect --format</code></td><td>Go template over the container's JSON</td><td><code>--format '{{.State.ExitCode}} {{.State.OOMKilled}}'</code></td></tr>
<tr><td><code>ssh -v</code> / <code>-vvv</code></td><td>client-side debug, more v = more detail</td><td><code>ssh -v deploy@IP true</code></td></tr>
</table>

<h3>On macOS and WSL: what is different</h3>
<p>On a Mac there is no <code>ss</code> and no <code>systemctl</code>. "Who holds this port" is <code>lsof</code>, and it gives a real surprise on a fresh macOS — measured on the Mac used for this course:</p>
<pre><code>lsof -nP -iTCP -sTCP:LISTEN | grep -E ':5000|:7000'</code></pre>
<div class="out">ControlCe  1307 admin    9u  IPv4 0x5ac95fdc38fdd071      0t0  TCP *:7000 (LISTEN)
ControlCe  1307 admin   10u  IPv6 0x2ae742b87b5bffb0      0t0  TCP *:7000 (LISTEN)
ControlCe  1307 admin   11u  IPv4 0x38e6a7466b04f758      0t0  TCP *:5000 (LISTEN)</div>
<p>Control Center (the AirPlay Receiver) owns ports 5000 and 7000, so a Flask or Express app told to use 5000 fails with "address already in use" on a Mac and works on the VPS. macOS does have <code>fuser</code>, but a BSD one with different flags (<code>fuser -c /</code> lists processes using a mount). For connection tests, BSD <code>nc</code> uses <code>-G</code> for the connect timeout (<code>nc -vz -G 3 host 22</code>). On WSL2 the Linux commands behave as in this lesson; the thing that differs is Docker Desktop: the containers run in a VM, so a port "in use" on Windows and a port in use inside WSL are two different lists.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the night before the SWP391 demo, the API "just stopped". Reproduce three of this lesson's outages in one throwaway container and diagnose each from the first command only.</p><ol>
<li><code>docker run -d --name lab122 ubuntu:24.04 sleep infinity</code>, then inside: <code>apt-get update &amp;&amp; apt-get install -y python3 iproute2 psmisc netcat-openbsd curl</code>.</li>
<li>Start <code>python3 -m http.server 19120 &amp;</code>, then run the same command again. Find the holder with <code>ss -tlnp 'sport = :19120'</code> and <code>fuser -v -n tcp 19120</code>, stop it with plain <code>kill</code>, and prove the port is free.</li>
<li>Run <code>nc -vz -w 3 127.0.0.1 19121</code>, <code>nc -vz -w 3 10.255.255.1 5432</code> and <code>nc -vz -w 3 no-such-host.example 80</code>. Write the layer (server / network / DNS) next to each.</li>
<li>From the host, run the <code>lx12-loop</code> example from "Measured: what each container failure looks like" and read its three numbers with <code>docker inspect</code>.</li></ol>
<p><strong>Done when:</strong> step 2 ends with <code>port free</code> and no <code>kill -9</code> in your history, step 3 has three different words (refused / timed out / getaddrinfo) mapped to three layers, and step 4 prints <code>1 false 5</code>. Clean up with <code>docker rm -f lab122 lx12-loop</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit code / status</span><span class="v">The number a process leaves behind; 0 is success, 128+N means killed by signal N.</span></div>
  <div class="kv"><span class="k">Unit</span><span class="v">A systemd object (service, timer, socket) described by a file and loaded into memory.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">The server nginx forwards to — your app behind the proxy.</span></div>
  <div class="kv"><span class="k">RST (reset)</span><span class="v">A TCP packet meaning "no" (refused) or "hang up now" (reset by peer).</span></div>
  <div class="kv"><span class="k">Orphan process</span><span class="v">A process whose parent exited; it is re-parented to PID 1 and keeps running.</span></div>
  <div class="kv"><span class="k">Restart loop</span><span class="v">A container or service that dies at startup and is restarted again and again by its policy.</span></div>
  <div class="kv"><span class="k">Provider console</span><span class="v">The web-based screen/keyboard of your VPS — the way in when SSH is broken.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read the exit code first: <code>203</code>, <code>200</code>, <code>217</code> mean the unit is wrong and the app never ran — the journal will not explain <code>203</code>.</li>
<li>"Address already in use": <code>ss -tlnp</code> or <code>fuser</code> names the PID; <code>kill</code> first, <code>-9</code> only if it refuses.</li>
<li>Refused = server, timed out = network, name not known = DNS, reset = the application — and <code>nc -z</code> cannot see a reset.</li>
<li>Always put a timeout on probes (<code>nc -w 3</code>, <code>curl -m 5</code>); without one, a drop costs you over a minute.</li>
<li>502 with <code>111: Connection refused</code> is a dead app; 504 is a slow one; <code>localhost</code> upstreams log <code>[::1]</code> errors.</li>
<li>For containers read ExitCode + OOMKilled + logs together: <code>137 true</code> is memory, <code>1 false</code> is the app, 255 is a broken entrypoint.</li>
</ul>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#Process%20Exit%20Codes" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">systemd process exit codes</span><span class="lc-sub">The authoritative table for 200–242: CHDIR, EXEC, USER, NAMESPACE and the rest. Bookmark it — these codes tell you the answer before any log does.</span></span>
</a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">Where <code>proxy_pass</code>, <code>proxy_read_timeout</code> and <code>proxy_next_upstream</code> are defined. The reference for turning a 502 or 504 into a specific configuration line.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: six machines, six outages</span><span class="lc-sub">Graded exercises: name the fault from an exit code alone, free a held port without <code>kill -9</code>, tell refused from timeout from reset given only <code>nc</code> output, and find the 502 whose cause is IPv6.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating "it works from the server" as proof the service is fine. <code>curl http://127.0.0.1:3000</code> succeeding while the outside world gets nothing usually means the app is bound to the loopback interface only. Check the Address column of <code>ss -tlnp</code>: <code>127.0.0.1:3000</code> is reachable from the machine and from nowhere else, while <code>0.0.0.0:3000</code> is reachable from everywhere. Behind nginx, loopback-only is CORRECT and deliberate; without a proxy in front, it is the bug.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The exit code is the diagnosis — 203/EXEC and 217/USER tell you the unit is wrong and the logs are empty, so do not go looking for an error message that was never written. Refused, timed out and reset are three different problems in three different layers; one <code>nc -vz</code> tells you which, and it costs four seconds. And when a client-side error message is vague, get to the server's log — <code>Permission denied (publickey)</code> means nothing, while <code>bad ownership or modes for directory /home/deploy/.ssh</code> is the entire answer.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Sách công thức: nó chết</h2>
<p class="lead">Sáu công thức cho những cú hỏng mà có thứ gì đó đơn giản là không trả lời. Mỗi công thức gồm một triệu chứng, ý nghĩa THẬT của nó, một cái thang các câu lệnh, và cách sửa. Cứ đọc lộn xộn; sách công thức sinh ra để dùng như vậy.</p>

<h3>Công thức 1 — dịch vụ không chịu lên</h3>
${slide('lx-12', 9, 'Mã thoát systemd: 203 thì log rỗng')}
<pre><code class="language-bash">systemctl status backend --no-pager -l        <span class="tok-comment"># dòng tiêu đề và vài dòng log cuối</span>
journalctl -u backend -n 50 --no-pager        <span class="tok-comment"># câu chuyện thật</span>
systemctl cat backend                         <span class="tok-comment"># unit NHƯ ĐÃ NẠP, gồm cả drop-in</span></code></pre>
<div class="out">× backend.service - Node API
     Loaded: loaded (/etc/systemd/system/backend.service; enabled)
     Active: failed (Result: exit-code) since Fri 2026-08-22 19:02:11 UTC; 8s ago
    Process: 44120 ExecStart=/usr/bin/node dist/index.js (code=exited, status=203/EXEC)
   Main PID: 44120 (code=exited, status=203/EXEC)</div>
<p>Cái mã thoát chính là toàn bộ chẩn đoán. Mã của systemd rất cụ thể và chúng cứu bạn khỏi việc đọc những dòng log CHƯA HỀ TỒN TẠI, bởi vì tiến trình chưa đi được xa tới mức sinh ra log nào:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">203/EXEC</span><span class="v">Không chạy được cái chương trình: sai đường dẫn, không có bit thực thi, hoặc đường dẫn tương đối (systemd KHÔNG tra <code>PATH</code>). Kiểm bằng <code>ls -l</code> lên đúng cái chuỗi trong <code>ExecStart=</code>.</span></div>
  <div class="kv"><span class="k">200/CHDIR</span><span class="v"><code>WorkingDirectory=</code> không tồn tại, hoặc cái <code>User=</code> không đi xuyên vào được (cần bit <code>x</code> trên mọi thư mục cha — Bài 4.1).</span></div>
  <div class="kv"><span class="k">217/USER</span><span class="v">Cái <code>User=</code> không tồn tại. Gõ sai, hoặc tài khoản đó chưa từng được tạo trên máy này.</span></div>
  <div class="kv"><span class="k">226/NAMESPACE</span><span class="v">Một chỉ thị hộp cát không thoả mãn được — thường là <code>ProtectSystem=strict</code> cộng một đường dẫn mà dịch vụ buộc phải ghi vào. Hãy thêm một <code>ReadWritePaths=</code>.</span></div>
  <div class="kv"><span class="k">1/FAILURE</span><span class="v">Chương trình ĐÃ CHẠY và thoát khác 0. Giờ thì journal có thứ đáng đọc: đây là lỗi ỨNG DỤNG, không phải lỗi unit.</span></div>
  <div class="kv"><span class="k">143 / 137</span><span class="v">Bị SIGTERM giết (tắt bình thường) hoặc SIGKILL. Một mã 137 mà bạn không hề gõ <code>stop</code> nghĩa là kẻ giết OOM hoặc một cú hết giờ — hãy xem <code>dmesg -T | tail</code> (Bài 5.3).</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đọc mã thoát</span><span class="lz-t">systemctl status</span><span class="lz-d">Nếu là 203/200/217/226 thì vấn đề nằm ở UNIT và log sẽ rỗng. Thôi đừng đọc log ứng dụng nữa.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chạy tay ExecStart, dưới đúng User</span><span class="lz-t">sudo -u deploy /usr/bin/node /srv/app/dist/index.js</span><span class="lz-d">Năm giây, và nó tách bạch hoàn toàn "systemd cấu hình sai" với "ứng dụng hỏng".</span></div>
  <div class="lz-step"><span class="lz-k">3 · Kiểm xem nó thật sự nạp cái gì</span><span class="lz-t">systemctl cat backend · systemctl show backend -p ExecStart -p User -p Environment</span><span class="lz-d">Một drop-in bạn quên, hoặc một lần sửa mà không <code>daemon-reload</code> (Bài 11.1), khiến file trên đĩa và unit trong bộ nhớ là hai văn bản khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm môi trường nó nhận được</span><span class="lz-t">EnvironmentFile= có tồn tại? User= đọc được? giá trị có bị bọc nháy?</span><span class="lz-d">Thiếu <code>EnvironmentFile</code> là hỏng cứng; có mà không đọc được thì cũng vậy. Và systemd KHÔNG bóc dấu nháy như shell làm.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Giờ mới đọc journal</span><span class="lz-t">journalctl -u backend --since '10 min ago'</span><span class="lz-d">Chỉ khi chính cái unit đã được chứng minh là đúng. Không thì bạn đang đi tìm một thông báo lỗi mà tiến trình chưa từng sống đủ lâu để viết ra.</span></div>
</div>

<h3>Công thức 2 — "address already in use"</h3>
${slide('lx-12', 10, 'Cổng bị chiếm: ss · fuser · lsof · TERM')}
<pre><code>sudo ss -tlnp | grep ':3000'         <span class="tok-comment"># ai đang lắng nghe, và PID của nó</span>
sudo fuser -n tcp 3000               <span class="tok-comment"># cùng câu trả lời, ngắn hơn</span>
sudo lsof -i :3000                   <span class="tok-comment"># nếu máy có cài lsof</span>
ps -fp \$(sudo ss -tlnpH 'sport = :3000' | grep -oP 'pid=\\K[0-9]+' | head -1)</code></pre>
<div class="out">LISTEN 0 511 0.0.0.0:3000 0.0.0.0:* users:(("node",pid=41288,fd=21))
UID    PID  PPID  C STIME TTY   STAT   TIME CMD
deploy 41288 1    0 14:05 ?     Ssl    0:41 node /srv/app/dist/index.js</div>
<p>Một tiến trình mồ côi từ lần chạy trước, vẫn đang giữ cái cổng. Cha của nó là PID 1, nghĩa là thứ khởi chạy nó đã biến mất — một phiên <code>tmux</code> đã chết, một lệnh <code>node</code> gõ tay lúc gỡ lỗi, hoặc một dịch vụ bị thay mà không được dừng.</p>
<pre><code>sudo kill 41288                      <span class="tok-comment"># SIGTERM trước, LUÔN LUÔN (Bài 5.3)</span>
sleep 2; sudo ss -tlnp | grep ':3000' || echo "cổng đã trống"
<span class="tok-comment"># chỉ khi nó nhất định không chết:</span>
sudo kill -9 41288</code></pre>
<div class="callout"><strong>Hai thứ TRÔNG GIỐNG mà KHÔNG phải cổng bị giữ.</strong> Thứ nhất, socket ở trạng thái <code>TIME_WAIT</code>: <code>ss -tan | grep 3000</code> hiện ra hàng chục cái, không có gì đang lắng nghe, và một server bình thường vẫn bind được — <code>SO_REUSEADDR</code> lo chuyện đó và ứng dụng của bạn gần như chắc chắn có bật nó. Thứ hai, bind vào một địa chỉ không tồn tại: <code>EADDRNOTAVAIL</code> trông na ná trong vết ngăn xếp nhưng nghĩa là cái IP đó không có trên máy này (<code>ip addr</code>), chứ không phải cổng bị chiếm. Hãy đọc mã lỗi, đừng đọc dòng tóm tắt.</div>

<h3>Công thức 3 — refused, timeout, hay reset?</h3>
${slide('lx-12', 11, 'Refused · timeout · reset · tên: gói tin dừng ở đâu')}
<p>Ba cú hỏng khác nhau mà người ta mô tả bằng cùng một câu chữ. Phân biệt được chúng là phân biệt giá trị nhất trong việc gỡ lỗi mạng, vì mỗi cái chỉ vào một TẦNG khác nhau.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Connection refused</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn TỚI ĐƯỢC máy; không có gì đang lắng nghe</span><span class="lz-nsub">Máy chủ chủ động nói không (một gói TCP RST). Tin tốt — mạng chạy tốt. Dịch vụ đang chết, đã sập, hoặc bind vào cổng khác hay chỉ vào 127.0.0.1. Sửa ở phía MÁY CHỦ.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection timed out</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không có gì trả lời hết</span><span class="lz-nsub">Gói tin rơi vào một cái hố: một tường lửa đang DROP im lặng, một security group, sai IP, hoặc máy đang tắt. Sửa ở phía MẠNG — <code>ufw status</code>, tường lửa của nhà cung cấp, <code>ip addr</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection reset by peer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Có thứ trả lời, rồi cúp máy giữa chừng</span><span class="lz-nsub">Kết nối đã được thiết lập. Một proxy hết giờ, ứng dụng sập giữa request, phía kia chờ TLS mà nhận HTTP thường, hoặc thân request vượt giới hạn. Sửa ở ỨNG DỤNG hoặc proxy.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Name or service not known</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn chưa từng lấy được một địa chỉ IP</span><span class="lz-nsub">Thuần DNS (Bài 9.1). Chưa có gì được thử cả; hãy kiểm <code>dig +short tên</code> và <code>/etc/resolv.conf</code> trước khi đụng vào bất cứ thứ gì khác.</span></div></div>
  </div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Là cái nào? -m 5 để một cú timeout không bắt bạn chờ 2 phút</span>
curl -sS -m 5 -o /dev/null -w '%{http_code} %{time_total}s\\n' http://10.0.0.9:3000/health
nc -vz -w 3 10.0.0.9 3000            <span class="tok-comment"># chỉ TCP, không HTTP — cô lập đúng tầng; -w 3 = bỏ cuộc sau 3 giây</span></code></pre>
<div class="out">$ nc -vz -w 3 10.0.0.9 3000
nc: connect to 10.0.0.9 port 3000 (tcp) failed: Connection refused
$ nc -vz -w 3 10.0.0.9 5432
nc: connect to 10.0.0.9 port 5432 (tcp) timed out: Operation now in progress</div>
<p>Cổng 3000: refused, nên máy tới được và dịch vụ đang chết — vấn đề của máy chủ. Cổng 5432: timed out, nên có tường lửa đang thả gói — vấn đề của mạng. Cùng một cái máy, hai cuộc điều tra khác nhau, phân biệt trong bốn giây bằng đúng một cái cờ.</p>
<div class="callout warn"><strong>Luôn cho <code>nc</code> một giới hạn thời gian.</strong> Không có <code>-w</code>, một gói tin bị vứt khiến <code>nc</code> chờ tới hết thời hạn TCP của chính hệ điều hành. Đo thật trong container thí nghiệm với một địa chỉ vứt mọi gói, <code>nc -vz 10.255.255.1 5432</code> im lặng <strong>1 phút 15 giây</strong> rồi mới bỏ cuộc; có <code>-w 3</code> thì nó in <code>timed out: Operation now in progress</code> sau ba giây. Chính câu thông báo cũng là manh mối: chữ "timed out" chỉ xuất hiện khi BẠN đặt giới hạn. Bản trước của công thức này in câu đó cho một lệnh không có <code>-w</code>; lệnh ở trên giờ mới đúng là lệnh sinh ra nó.</div>

<h3>Công thức 4 — nginx trả về 502 Bad Gateway</h3>
${slide('lx-12', 12, '502 so với 504, và bẫy localhost/IPv6')}
<p>502 nghĩa là nginx không lấy được một phản hồi hợp lệ từ cái nằm sau nó. nginx VẪN CHẠY — chính điều đó làm cho 502 hữu ích. Log lỗi của nó gọi tên lý do rất chính xác:</p>
<pre><code class="language-bash">sudo tail -20 /var/log/nginx/error.log
sudo ss -tlnp | grep -E ':(3000|8080)'
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health
sudo nginx -T | grep -A3 proxy_pass          <span class="tok-comment"># thứ nginx THẬT SỰ đã nạp</span></code></pre>
<div class="out">2026/08/22 19:14:02 [error] 812#812: *4471 connect() failed (111: Connection refused)
  while connecting to upstream, client: 203.0.113.55, server: example.com,
  request: "GET /api/v1/posts HTTP/1.1", upstream: "http://127.0.0.1:3000/api/v1/posts"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">111: Connection refused</span><span class="v">Upstream không lắng nghe. Về Công thức 1 — ứng dụng đang chết. Đây là trường hợp phổ biến hơn hẳn phần còn lại.</span></div>
  <div class="kv"><span class="k">110: Connection timed out</span><span class="v">Ứng dụng nhận kết nối rồi không bao giờ trả lời. Nó còn sống nhưng đang kẹt: hãy xem vòng lặp sự kiện có bị chặn, một truy vấn cơ sở dữ liệu treo, hay bể kết nối đã cạn.</span></div>
  <div class="kv"><span class="k">13: Permission denied</span><span class="v">Upstream kiểu socket Unix. Socket có tồn tại nhưng <code>www-data</code> không mở được — hãy kiểm quyền của socket và bit <code>x</code> của thư mục (Bài 4.1).</span></div>
  <div class="kv"><span class="k">upstream prematurely closed connection</span><span class="v">Ứng dụng sập giữa lúc trả lời. Lý do nằm trong log của CHÍNH ỨNG DỤNG, ở đúng cái giây đó — <code>journalctl -u backend --since</code> ngay mốc thời gian ấy.</span></div>
  <div class="kv"><span class="k">no live upstreams</span><span class="v">Mọi server trong khối upstream đều bị đánh dấu chết sau nhiều lần hỏng liên tiếp. Hãy sửa các backend; nginx tự thử lại theo lịch của nó.</span></div>
  <div class="kv"><span class="k">504 chứ không phải 502</span><span class="v">KHÔNG cùng một con bọ. 504 là <code>proxy_read_timeout</code> hết giờ — ứng dụng CHẬM, không phải chết. Hãy sang Bài 12.3.</span></div>
</div>
<div class="pitfall"><strong>Bẫy:</strong> <code>localhost</code> trong <code>proxy_pass</code> trên một máy chạy song song hai ngăn xếp IPv4/IPv6. <code>localhost</code> phân giải ra CẢ <code>::1</code> lẫn <code>127.0.0.1</code>, và nginx biến hai địa chỉ đó thành một nhóm upstream nhỏ. Với <code>proxy_pass http://localhost:3000</code> và một ứng dụng chỉ lắng nghe IPv4, nginx thử IPv6 trước, bị từ chối, ghi log, rồi <em>chuyển request sang</em> <code>127.0.0.1</code> — nên người dùng vẫn nhận 200, <code>curl http://127.0.0.1:3000</code> cũng chạy, và bằng chứng duy nhất là mỗi request một dòng trong log lỗi: <code>upstream: "http://[::1]:3000/…"</code>. Đo thật với nginx 1.24 trên Ubuntu 24.04: ba request, ba mã <code>200</code>, ba dòng <code>connect() failed (111: Connection refused)</code>. (Bản trước của bài này nói bạn sẽ nhận 502 ở đây — không phải vậy, và niềm tin sai đó khiến người ta đi săn một cú sập không hề xảy ra.) Trường hợp trả <strong>502</strong> thật là hình ảnh phản chiếu, cũng đo thật: ứng dụng chỉ nghe <code>[::1]</code>, đứng sau <code>proxy_pass http://127.0.0.1:3000</code>. Node.js đời mới có thể rơi đúng vào đó khi bạn bảo nó nghe <code>'localhost'</code>. Kiểu nào thì cách chữa cũng giống nhau: ghi MỘT địa chỉ tường minh — <code>127.0.0.1</code> — trong <code>proxy_pass</code> và cho ứng dụng bind đúng địa chỉ đó.</div>

<h3>Công thức 5 — container khởi động lại mãi không thôi</h3>
${slide('lx-12', 13, 'Container quay vòng: ExitCode + OOMKilled')}
<pre><code class="language-bash">docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}'
docker logs --tail 50 --timestamps cuonghoangdev_backend
docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</code></pre>
<div class="out">NAMES                     STATUS                          IMAGE
cuonghoangdev_backend     Restarting (1) 3 seconds ago    cuonghoangdev-backend:latest
$ docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'
1 false 47</div>
<div class="kv-grid">
  <div class="kv"><span class="k">ExitCode 1, OOMKilled false</span><span class="v">Chính ứng dụng hỏng lúc khởi động. <code>docker logs</code> có lý do — thường là thiếu một biến môi trường hoặc một thứ phụ thuộc không nối tới được.</span></div>
  <div class="kv"><span class="k">OOMKilled true (thoát 137)</span><span class="v">Container chạm trần bộ nhớ của nó, hoặc máy chủ hết RAM. Xem <code>docker stats</code> và <code>dmesg -T</code> của máy chủ. Hãy nâng trần hoặc sửa chỗ rò — khởi động lại chỉ lặp lại y hệt.</span></div>
  <div class="kv"><span class="k">Thoát 127</span><span class="v">Không tìm thấy câu lệnh BÊN TRONG ảnh. Entrypoint trỏ tới một chương trình mà ảnh không có — rất hay gặp sau khi đổi ảnh nền.</span></div>
  <div class="kv"><span class="k">Thoát 126</span><span class="v">Tìm thấy nhưng không chạy được: thiếu <code>+x</code> trên script entrypoint, hoặc hệ thống file được gắn <code>noexec</code>. (Script có ký tự xuống dòng CRLF là một cú hỏng KHÁC: nhân đi tìm trình thông dịch tên là <code>/bin/sh\\r</code>, không thấy, và báo "no such file or directory" — trong shell là mã 127, không phải 126. Bản trước của ô này gộp hai thứ làm một. Trên Docker 29 cả hai lỗi entrypoint này đều hiện ra thành mã <strong>255</strong>; xem bảng đo thật ở dưới.)</span></div>
  <div class="kv"><span class="k">Lên rồi chết mà không có log</span><span class="v">Sai kiến trúc hoặc sai libc. Chính lịch sử của dự án này: một ảnh dựng từ nhầm <code>Dockerfile</code> đã đặt engine Prisma bản glibc lên nền Alpine musl — build xanh, đẩy xanh, restart vô tận, và API chết bảy phút.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Mở một shell trong ảnh mà KHÔNG chạy entrypoint — cách nhanh nhất để ngó quanh</span>
docker run --rm -it --entrypoint sh cuonghoangdev-backend:latest
<span class="tok-comment"># bên trong: ls -l /app/dist, node -v, ldd \$(which node) | head</span></code></pre>

<h3>Đo thật: mỗi kiểu hỏng container trông ra sao</h3>
<p>Bốn container được cố tình làm hỏng trên Docker 29.8, mỗi cái đọc theo cùng một cách — <code>docker ps</code> xem trạng thái, <code>docker logs</code> xem lời trăng trối, <code>docker inspect</code> lấy ba con số quan trọng:</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. app thoát ngay lúc khởi động, có chính sách restart</span>
docker run -d --name lx12-loop --memory 64m --restart on-failure:5 ubuntu:24.04 \\
  bash -c 'echo "\$(date +%T) backend starting"; [ -n "\$DATABASE_URL" ] || { echo "Error: DATABASE_URL is not set" &gt;&amp;2; exit 1; }'
docker ps -a --format 'table {{.Names}}\\t{{.Status}}'
docker logs --tail 2 lx12-loop
docker inspect lx12-loop --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</code></pre>
<div class="out">NAMES       STATUS
lx12-loop   Restarting (1) Less than a second ago
15:24:58 backend starting
Error: DATABASE_URL is not set
1 false 5</div>
<table>
<tr><th>Cố tình làm hỏng</th><th><code>docker ps</code> / dòng lệnh</th><th>ExitCode · OOMKilled</th><th>Nghĩa là</th></tr>
<tr><td>app thoát 1 lúc khởi động (ở trên)</td><td><code>Restarting (1)</code>, rồi <code>Exited (1)</code> sau 5 lần thử</td><td><code>1 false</code></td><td>đọc <code>docker logs</code>: app đã nói rồi</td></tr>
<tr><td><code>--memory 64m</code> + vòng lặp shell nhân đôi một chuỗi</td><td><code>Exited (137) 5 seconds ago</code></td><td><code>137 true</code></td><td>trần bộ nhớ; <code>docker logs</code> chỉ còn dòng bình thường cuối cùng</td></tr>
<tr><td><code>docker run ubuntu:24.04 node dist/index.js</code></td><td><code>exec: "node": executable file not found in \$PATH</code></td><td>dòng lệnh thoát <code>127</code></td><td>chương trình không có trong ảnh</td></tr>
<tr><td>script entrypoint dính CRLF</td><td><code>exec /entry.sh: no such file or directory</code></td><td><code>255</code></td><td><code>\\r</code> trong dòng shebang — <code>cat -A</code> (12.4)</td></tr>
<tr><td>script entrypoint thiếu <code>+x</code></td><td><code>exec /entry.sh: permission denied</code></td><td><code>255</code></td><td><code>chmod +x</code> trong Dockerfile</td></tr>
</table>
<p>Hai điều làm chúng tôi bất ngờ khi đo. Một, script shell chết vì <code>\${DATABASE_URL:?}</code> thoát với mã <strong>127</strong>, không phải 1 — nên "127 = không tìm thấy lệnh" là một gợi ý mạnh chứ không phải định luật; hãy đọc <code>docker logs</code> trước khi kết luận. Hai, trên Docker hiện nay cả hai lỗi entrypoint đều hiện thành <strong>255</strong>, chỉ có dòng <code>exec …</code> là phân biệt được; những bảng cũ hứa 126 cho "không chạy được" là mô tả các bản Docker cũ. Phần chữ của thông báo lỗi mới là phần đáng tin.</p>
<h3>Công thức 6 — bạn không SSH vào được</h3>
${slide('lx-12', 14, 'Không SSH được: phía máy chủ nói rõ')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Cái máy còn đó không?</span><span class="lz-t">ping -c3 IP · rồi tới console của nhà cung cấp</span><span class="lz-d">Không ping được thì chứng minh được ít (ICMP hay bị chặn), nhưng có phản hồi thì chứng minh máy còn sống và định tuyến tới được — riêng điều đó đã loại một nửa khả năng.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cổng có mở không?</span><span class="lz-t">nc -vz IP 22</span><span class="lz-d">Refused = sshd đang chết; máy vẫn ổn. Timed out = tường lửa hoặc security group. Hai cách sửa khác nhau, và không cách nào dính tới cái khoá của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Phía máy khách nói gì?</span><span class="lz-t">ssh -vvv user@IP 2&gt;&amp;1 | tail -30</span><span class="lz-d">Chế độ chi tiết gọi tên đúng bước đã hỏng: nó chào những khoá nào, máy chủ có chấp nhận tên người dùng không, có rơi xuống mật khẩu không.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Permission denied (publickey)</span><span class="lz-t">kiểm quyền trên MÁY CHỦ, qua console</span><span class="lz-d">Gần như luôn là quyền của <code>~/.ssh</code> hay <code>authorized_keys</code> (Bài 11.3), một <code>AllowUsers</code> sai, hoặc khoá thêm nhầm vào file của người dùng khác.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Dùng console của nhà cung cấp</span><span class="lz-t">console VNC / nối tiếp trên web</span><span class="lz-d">Nó sinh ra để dùng cho đúng lúc này. Đăng nhập ở đó, chạy <code>systemctl status ssh</code> và <code>sshd -T</code>, sửa, rồi thoát. Nếu console đòi một mật khẩu bạn chưa từng đặt thì hãy đặt lại nó từ bảng điều khiển của nhà cung cấp trước.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Phía máy chủ của một cái khoá bị từ chối — thông báo mà máy khách không thấy được</span>
sudo journalctl -u ssh -n 20 --no-pager | grep -iE 'refused|invalid|denied'</code></pre>
<div class="out">Aug 22 19:22:31 vps-1 sshd[45012]: Authentication refused: bad ownership or modes for directory /home/deploy/.ssh
Aug 22 19:22:31 vps-1 sshd[45012]: Connection closed by authenticating user deploy 203.0.113.55 port 51992 [preauth]</div>
<p>Máy khách nói "Permission denied (publickey)" — một thông báo chẳng mô tả gì cả. Máy chủ thì nói chính xác cái gì sai. Bất cứ khi nào bạn tới được máy chủ bằng đường khác, log của nó đáng giá hơn mọi lượng <code>-vvv</code> phía máy khách.</p>

<h3>Chạy thử từng bước: bốn unit hỏng trên systemd thật</h3>
<p>Bảng mã thoát trở nên hiển nhiên khi chính tay bạn gây ra từng mã. Phần này chạy trong một container Ubuntu 24.04 khởi động bằng systemd 255 (<code>--privileged</code>, xoá ngay sau đó — đừng làm vậy trên máy bạn quý). Một mẫu unit, bốn lỗi cố tình:</p>
<pre><code><span class="tok-comment"># /etc/systemd/system/be-exec.service  (ba cái kia khác đúng một dòng)</span>
[Unit]
Description=Node API (be-exec)
[Service]
User=deploy
WorkingDirectory=/srv/app
ExecStart=/usr/local/bin/node dist/index.js   <span class="tok-comment"># node thật ra ở /usr/bin/node</span></code></pre>
<pre><code class="language-bash">systemctl daemon-reload
for u in be-exec be-chdir be-user be-fail backend; do systemctl start \$u; done
for u in be-exec be-chdir be-user be-fail backend; do
  echo "\$u: \$(systemctl show \$u -p ExecMainStatus -p ActiveState -p Result --value | tr '\\n' ' ')"
done</code></pre>
<div class="out">be-exec: exit-code 203 failed
be-chdir: exit-code 200 failed
be-user: exit-code 217 failed
be-fail: exit-code 1 failed
backend: success 0 active</div>
<table>
<tr><th>Unit</th><th>Dòng sai duy nhất</th><th>Trạng thái</th><th>Journal nói thêm gì</th></tr>
<tr><td><code>be-exec</code></td><td><code>ExecStart=/usr/local/bin/node …</code></td><td><code>203/EXEC</code></td><td><strong>không gì cả</strong> — chỉ "Main process exited, code=exited, status=203/EXEC"</td></tr>
<tr><td><code>be-chdir</code></td><td><code>WorkingDirectory=/srv/api</code></td><td><code>200/CHDIR</code></td><td><code>Changing to the requested working directory failed: No such file or directory</code></td></tr>
<tr><td><code>be-user</code></td><td><code>User=deplyo</code></td><td><code>217/USER</code></td><td><code>Failed to determine user credentials: No such process</code></td></tr>
<tr><td><code>be-fail</code></td><td><code>ExecStart=/usr/bin/node dist/missing.js</code></td><td><code>1/FAILURE</code></td><td>vết ngăn xếp của chính Node: <code>code: 'MODULE_NOT_FOUND'</code></td></tr>
</table>
<p>Dòng cần nhớ là dòng đầu: với <code>203/EXEC</code>, journal KHÔNG có lấy một lý do, nên câu lệnh tiếp theo có ích duy nhất là <code>ls -l</code> lên đúng đường dẫn trong <code>ExecStart=</code>. Chỉ <code>1/FAILURE</code> mới nghĩa là ứng dụng ĐÃ chạy — đó là trường hợp duy nhất mà đọc log ứng dụng là nước đi đúng. Còn <code>systemctl show backend -p ExecStart</code> in ra thứ systemd thật sự đã hiểu (<code>path=/usr/bin/node ; argv[]=/usr/bin/node dist/index.js</code>) — cách để bắt một drop-in đang đè lên cái file bạn vừa sửa.</p>

<h3>Mã thoát trên 128: tín hiệu nằm trong con số</h3>
<pre><code>sleep 100 &amp; kill -9 \$!; wait \$!; echo "exit=\$?"
sleep 100 &amp; kill \$!;    wait \$!; echo "exit=\$?"</code></pre>
<div class="out">bash: line 1:  3974 Killed                  sleep 100
exit=137
exit=143</div>
<p>Khi một tiến trình chết vì tín hiệu, shell, systemd và Docker đều báo <strong>128 + số hiệu tín hiệu</strong>: 137 = 128 + 9 (SIGKILL), 143 = 128 + 15 (SIGTERM), 130 = 128 + 2 (Ctrl-C). Vậy 143 sau khi deploy là tắt bình thường; còn 137 mà không ai yêu cầu là kẻ giết OOM hoặc một cú hết giờ khi dừng (systemd gửi SIGKILL sau <code>TimeoutStopSec</code>, mặc định 90 giây). Và để ý ai in ra chữ <code>Killed</code>: là SHELL, thay cho một chương trình chưa kịp nói gì.</p>

<h3>Đo thật: bốn cách không kết nối được</h3>
<pre><code class="language-bash">nc -vz -w 3 127.0.0.1 19121             <span class="tok-comment"># không ai nghe</span>
nc -vz -w 3 10.255.255.1 5432           <span class="tok-comment"># địa chỉ vứt mọi gói</span>
nc -vz -w 3 127.0.0.1 19122             <span class="tok-comment"># server nhận rồi reset</span>
nc -vz -w 3 db.khong-ton-tai.example 5432
curl -sS -m 3 http://127.0.0.1:19122/; echo "exit=\$?"</code></pre>
<div class="out">nc: connect to 127.0.0.1 port 19121 (tcp) failed: Connection refused
nc: connect to 10.255.255.1 port 5432 (tcp) timed out: Operation now in progress
Connection to 127.0.0.1 19122 port [tcp/*] succeeded!
nc: getaddrinfo for host "db.khong-ton-tai.example" port 5432: Name or service not known
curl: (56) Recv failure: Connection reset by peer
exit=56</div>
<p>Dòng thứ ba là cái bẫy. Server ở cổng 19122 nhận mọi kết nối rồi đóng sập bằng một gói reset; <code>nc -z</code> chỉ làm xong cái bắt tay TCP, nên nó vui vẻ báo <code>succeeded!</code>, trong khi mọi request thật đều hỏng với <code>curl: (56) … reset by peer</code>. "Cổng đang mở" không có nghĩa là "dịch vụ chạy được". Mã thoát tương ứng của curl là 7 (refused), 28 (timed out), 56 (reset) và 6 (tên) — Bài 9.2 có danh sách đầy đủ.</p>

<h3>Bảng cờ: các lệnh của bài này</h3>
<table>
<tr><th>Lệnh và cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>systemctl status -l --no-pager</code></td><td>dòng đầy đủ, không phân trang — để dán đi</td><td><code>systemctl status backend -l --no-pager</code></td></tr>
<tr><td><code>systemctl show -p Prop --value</code></td><td>một thuộc tính, chỉ lấy giá trị</td><td><code>systemctl show backend -p ExecMainStatus --value</code></td></tr>
<tr><td><code>journalctl -u unit -n N --since</code></td><td>một unit, N dòng cuối, từ một mốc giờ</td><td><code>journalctl -u backend -n 50 --since '10 min ago'</code></td></tr>
<tr><td><code>ss -t -l -n -p</code> + bộ lọc</td><td>TCP, đang nghe, dạng số, kèm tiến trình</td><td><code>ss -tlnp 'sport = :3000'</code></td></tr>
<tr><td><code>fuser -v -n tcp CỔNG</code></td><td>ai giữ cổng; <code>-k</code> thì giết luôn</td><td><code>fuser -v -n tcp 3000</code></td></tr>
<tr><td><code>lsof -nP -iTCP:CỔNG -sTCP:LISTEN</code></td><td>không tra tên, chỉ TCP, chỉ cổng đang nghe</td><td><code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code></td></tr>
<tr><td><code>nc -v -z -w N</code></td><td>nói nhiều, chỉ kết nối, bỏ cuộc sau N giây</td><td><code>nc -vz -w 3 10.0.0.9 5432</code></td></tr>
<tr><td><code>curl -sS -m N -o /dev/null -w</code></td><td>im lặng nhưng vẫn báo lỗi, hạn giờ, in một biến</td><td><code>curl -sS -m 5 -o /dev/null -w '%{http_code}\\n' URL</code></td></tr>
<tr><td><code>docker inspect --format</code></td><td>mẫu Go chạy trên JSON của container</td><td><code>--format '{{.State.ExitCode}} {{.State.OOMKilled}}'</code></td></tr>
<tr><td><code>ssh -v</code> / <code>-vvv</code></td><td>gỡ lỗi phía máy khách, càng nhiều v càng chi tiết</td><td><code>ssh -v deploy@IP true</code></td></tr>
</table>

<h3>Trên macOS và WSL khác gì</h3>
<p>Trên Mac không có <code>ss</code> và không có <code>systemctl</code>. "Ai đang giữ cổng này" là việc của <code>lsof</code>, và nó cho một bất ngờ thật trên macOS mới cài — đo trên chính chiếc Mac dùng soạn khoá này:</p>
<pre><code>lsof -nP -iTCP -sTCP:LISTEN | grep -E ':5000|:7000'</code></pre>
<div class="out">ControlCe  1307 admin    9u  IPv4 0x5ac95fdc38fdd071      0t0  TCP *:7000 (LISTEN)
ControlCe  1307 admin   10u  IPv6 0x2ae742b87b5bffb0      0t0  TCP *:7000 (LISTEN)
ControlCe  1307 admin   11u  IPv4 0x38e6a7466b04f758      0t0  TCP *:5000 (LISTEN)</div>
<p>Control Center (tính năng AirPlay Receiver) chiếm cổng 5000 và 7000, nên một app Flask hay Express chọn cổng 5000 sẽ hỏng với "address already in use" trên Mac mà lại chạy tốt trên VPS. macOS CÓ <code>fuser</code>, nhưng là bản BSD với cờ khác (<code>fuser -c /</code> liệt kê tiến trình đang dùng một điểm gắn). Để thử kết nối, <code>nc</code> của BSD dùng <code>-G</code> cho hạn giờ kết nối (<code>nc -vz -G 3 host 22</code>). Trên WSL2 các lệnh Linux chạy như trong bài; thứ khác là Docker Desktop: container chạy trong một máy ảo, nên cổng "đang bận" phía Windows và cổng đang bận trong WSL là hai danh sách khác nhau.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> đêm trước buổi demo SWP391, API "tự dưng không chạy". Dựng lại ba sự cố của bài này trong một container vứt đi và chẩn đoán từng cái chỉ bằng câu lệnh đầu tiên.</p><ol>
<li><code>docker run -d --name lab122 ubuntu:24.04 sleep infinity</code>, rồi bên trong: <code>apt-get update &amp;&amp; apt-get install -y python3 iproute2 psmisc netcat-openbsd curl</code>.</li>
<li>Chạy <code>python3 -m http.server 19120 &amp;</code>, rồi chạy lại đúng lệnh đó lần nữa. Tìm kẻ giữ cổng bằng <code>ss -tlnp 'sport = :19120'</code> và <code>fuser -v -n tcp 19120</code>, dừng nó bằng <code>kill</code> thường, và chứng minh cổng đã trống.</li>
<li>Chạy <code>nc -vz -w 3 127.0.0.1 19121</code>, <code>nc -vz -w 3 10.255.255.1 5432</code> và <code>nc -vz -w 3 no-such-host.example 80</code>. Ghi tầng (máy chủ / mạng / DNS) cạnh từng cái.</li>
<li>Từ máy của bạn, chạy ví dụ <code>lx12-loop</code> ở phần "Đo thật: mỗi kiểu hỏng container trông ra sao" và đọc ba con số của nó bằng <code>docker inspect</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 kết thúc bằng <code>port free</code> và lịch sử lệnh không có <code>kill -9</code>, bước 3 có ba chữ khác nhau (refused / timed out / getaddrinfo) ứng với ba tầng, và bước 4 in <code>1 false 5</code>. Dọn bằng <code>docker rm -f lab122 lx12-loop</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit code / status (mã thoát)</span><span class="v">Con số một tiến trình để lại; 0 là thành công, 128+N là bị tín hiệu N giết.</span></div>
  <div class="kv"><span class="k">Unit (đơn vị systemd)</span><span class="v">Một đối tượng của systemd (service, timer, socket) mô tả bằng một file và nạp vào bộ nhớ.</span></div>
  <div class="kv"><span class="k">Upstream (máy phía sau)</span><span class="v">Máy chủ mà nginx chuyển request tới — ứng dụng của bạn nằm sau proxy.</span></div>
  <div class="kv"><span class="k">RST (gói reset)</span><span class="v">Gói TCP mang nghĩa "không" (refused) hoặc "cúp máy ngay" (reset by peer).</span></div>
  <div class="kv"><span class="k">Orphan process (tiến trình mồ côi)</span><span class="v">Tiến trình mà cha đã thoát; nó được PID 1 nhận nuôi và vẫn chạy tiếp.</span></div>
  <div class="kv"><span class="k">Restart loop (vòng khởi động lại)</span><span class="v">Container hay dịch vụ chết ngay lúc lên và bị chính sách của nó khởi động lại mãi.</span></div>
  <div class="kv"><span class="k">Provider console (console nhà cung cấp)</span><span class="v">Màn hình/bàn phím qua web của VPS — lối vào khi SSH hỏng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc mã thoát trước: <code>203</code>, <code>200</code>, <code>217</code> nghĩa là unit sai và app chưa từng chạy — journal sẽ không giải thích <code>203</code>.</li>
<li>"Address already in use": <code>ss -tlnp</code> hoặc <code>fuser</code> gọi tên PID; <code>kill</code> trước, <code>-9</code> chỉ khi nó không chịu chết.</li>
<li>Refused = máy chủ, timed out = mạng, name not known = DNS, reset = ứng dụng — và <code>nc -z</code> không thấy được reset.</li>
<li>Luôn đặt hạn giờ cho phép thử (<code>nc -w 3</code>, <code>curl -m 5</code>); không có thì một gói bị vứt tốn của bạn hơn một phút.</li>
<li>502 kèm <code>111: Connection refused</code> là app chết; 504 là app chậm; upstream <code>localhost</code> đẻ ra dòng lỗi <code>[::1]</code>.</li>
<li>Với container, đọc ExitCode + OOMKilled + log cùng lúc: <code>137 true</code> là bộ nhớ, <code>1 false</code> là app, 255 là entrypoint hỏng.</li>
</ul>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#Process%20Exit%20Codes" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Mã thoát tiến trình của systemd</span><span class="lc-sub">Bảng chuẩn cho dải 200–242: CHDIR, EXEC, USER, NAMESPACE và phần còn lại. Hãy đánh dấu trang này — mấy mã đó cho bạn câu trả lời trước cả log.</span></span>
</a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">Nơi định nghĩa <code>proxy_pass</code>, <code>proxy_read_timeout</code> và <code>proxy_next_upstream</code>. Tài liệu để biến một cú 502 hay 504 thành một dòng cấu hình cụ thể.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sáu cái máy, sáu sự cố</span><span class="lc-sub">Bài chấm điểm: gọi tên cái hỏng chỉ từ một mã thoát, giải phóng một cổng bị giữ mà không dùng <code>kill -9</code>, phân biệt refused với timeout với reset khi chỉ có output của <code>nc</code>, và tìm ra cú 502 mà nguyên nhân là IPv6.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi "chạy được từ trên máy chủ" là bằng chứng dịch vụ vẫn ổn. <code>curl http://127.0.0.1:3000</code> thành công trong khi thế giới bên ngoài không nhận được gì thường có nghĩa là ứng dụng chỉ bind vào giao diện loopback. Hãy nhìn cột Address của <code>ss -tlnp</code>: <code>127.0.0.1:3000</code> chỉ tới được từ chính cái máy và không từ đâu khác, còn <code>0.0.0.0:3000</code> thì tới được từ mọi nơi. Nằm sau nginx thì chỉ-loopback là ĐÚNG và có chủ ý; không có proxy đứng trước thì đó chính là con bọ.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mã thoát chính là chẩn đoán — 203/EXEC và 217/USER nói cho bạn biết cái unit sai và log thì rỗng, nên đừng đi tìm một thông báo lỗi chưa từng được viết ra. Refused, timed out và reset là ba vấn đề khác nhau ở ba tầng khác nhau; một lệnh <code>nc -vz</code> nói cho bạn biết là cái nào, và nó tốn bốn giây. Và khi thông báo lỗi phía máy khách mơ hồ, hãy tới log của máy chủ — <code>Permission denied (publickey)</code> chẳng nghĩa gì, còn <code>bad ownership or modes for directory /home/deploy/.ssh</code> là trọn vẹn câu trả lời.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — Cookbook: it is slow|||12.3 — Sách công thức: nó chậm',
      slug: 'lnx-12-3-no-cham',
      type: 'LESSON',
      description: 'Tải cao nghĩa là gì, CPU kịch trần, chờ I/O, sức ép bộ nhớ và available so với free, đĩa đầy giữa lúc sự cố, và trường hợp khó nhất: chậm mà không có gì bận.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Cookbook: it is slow</h2>
<p class="lead">"Down" is easy — something is not answering and you go find it. "Slow" is harder, because everything is technically working and the machine will happily tell you it is fine. Six recipes for finding the resource that has run out, including the case where none of them have.</p>

<h3>Recipe 1 — what "load" actually means</h3>
${slide('lx-12', 15, 'Load = hàng chạy + hàng chờ D')}
<pre><code class="language-bash">uptime; nproc
cat /proc/pressure/cpu /proc/pressure/io /proc/pressure/memory   <span class="tok-comment"># PSI, kernel 4.20+</span></code></pre>
<div class="out">$ uptime
 19:31:44 up 12 days, 4:12, 1 user, load average: 8.21, 7.94, 6.02
$ nproc
2
$ cat /proc/pressure/io
some avg10=61.44 avg60=58.02 avg300=41.17 total=884213004
full avg10=44.10 avg60=42.55 avg300=30.09 total=612004112</div>
<p>Load average on Linux is <strong>not</strong> a CPU percentage. It counts processes that are running <em>plus</em> processes stuck in uninterruptible sleep — almost always waiting on disk or network storage. That is why a load of 8 on 2 cores can mean "the CPU is on fire" or "the CPU is idle and the disk is dying", and the number alone cannot tell you which.</p>
<p><code>/proc/pressure</code> settles it in one read. <code>io.full avg10=44</code> means that for 44% of the last ten seconds, <em>every</em> runnable task was blocked on I/O. That is a disk problem, definitively, before you have opened a single monitoring tool.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">High load + high %us</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">CPU-bound — real work or a runaway loop</span><span class="lz-nsub">Find the process (<code>top</code>, <code>ps aux --sort=-%cpu</code>). One process at 100% of one core is usually a bug; everything at 60% is usually genuine traffic.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">High load + high %wa</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">I/O-bound — the disk is the ceiling</span><span class="lz-nsub">CPU is idle and waiting. Recipe 3. On a VPS this is also how a noisy neighbour or a throttled volume looks.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">High load + high %sy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kernel time — syscalls, context switches, network</span><span class="lz-nsub">Often a process making millions of tiny reads, or a container storage driver. <code>strace -c -p PID</code> for ten seconds names the syscall.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">High load, everything idle</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Processes stuck in D state</span><span class="lz-nsub"><code>ps -eo state,pid,cmd | grep '^D'</code>. Uninterruptible sleep: a hung NFS mount, a failing disk, or a stuck kernel driver. These cannot even be killed.</span></div></div>
  </div>
</div>

<h3>Recipe 2 — CPU pinned</h3>
${slide('lx-12', 16, 'CPU 100%: một luồng kẹt vĩnh viễn')}
<pre><code>top -b -n1 | head -12                       <span class="tok-comment"># snapshot, script-friendly</span>
ps -eo pid,ppid,%cpu,%mem,etime,cmd --sort=-%cpu | head -6
top -H -p 41288 -b -n1 | head -14           <span class="tok-comment"># per THREAD inside one process</span>
sudo strace -c -f -p 41288 &amp; sleep 10; kill %1   <span class="tok-comment"># which syscall dominates</span></code></pre>
<div class="out">%Cpu(s): 97.2 us,  2.1 sy,  0.0 ni,  0.5 id,  0.0 wa
  PID  PPID %CPU %MEM     ELAPSED CMD
41288     1 99.4  6.1    05:12:44 node /srv/app/dist/index.js
  812     1  1.1  0.8  12-04:11:02 nginx: worker process</div>
<p>One process, one core, 99%, and it has been alive five hours. Two questions decide what to do: is the CPU time <em>growing</em> (a leak or an infinite loop) or <em>steady</em> (real work)? And did it start at a deploy?</p>
<pre><code><span class="tok-comment"># Is it stuck, or working? Compare CPU seconds over 10s</span>
for i in 1 2 3; do ps -o etimes=,times= -p 41288; sleep 5; done</code></pre>
<div class="out">18764 18701
18769 18706
18774 18711</div>
<p>Five seconds of wall clock, five seconds of CPU, every interval: this process is burning a whole core continuously, not doing bursts of work. For Node.js that means a blocked event loop — a synchronous regex, a giant <code>JSON.parse</code>, or a loop that never exits. The fix is in the code, and the diagnosis took fifteen seconds.</p>
<div class="callout"><strong><code>%CPU</code> over 100 is normal and not a bug.</strong> <code>top</code> and <code>ps</code> report per-CPU percentages, so a process using four cores fully shows 400%. Press <code>1</code> in <code>top</code> to see cores individually. What matters is the ratio to <code>nproc</code>: 100% on a 16-core box is one saturated thread inside an otherwise idle machine — a latency problem for the requests hitting that thread, not a capacity problem for the server.</div>

<p><strong>Measured.</strong> The classic way to pin a core without an infinite loop is a regular expression that backtracks exponentially. In the lab container a Python worker thread ran <code>re.match(r"(a+)+\$", "a" * 40 + "!")</code>; twenty seconds later:</p>
<div class="out">$ top -b -n1 | head -8
…
%Cpu(s):  9.4 us,  0.9 sy,  0.0 ni, 89.6 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
…
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   3845 root      20   0   88600   9664   5612 S  90.9   0.1   0:20.30 python3
$ top -H -b -n1 -p 3845 | tail -2
   3847 root      20   0   88600   9664   5612 R  99.9   0.1   0:20.41 python3
   3845 root      20   0   88600   9664   5612 S   0.0   0.1   0:00.10 python3
$ for i in 1 2 3; do ps -o etimes=,times= -p 3845; sleep 5; done
     20       20
     25       25
     30       30</div>
<p>Read it the way this recipe says. The whole machine is 89.6% idle because it has 10 cores and one of them is full — 1 ÷ 10 ≈ 10% — which is exactly why a single stuck request thread hides so well in a dashboard. <code>top -H</code> splits the process into threads: 3847 is in state <code>R</code> and owns all the CPU, while the main thread 3845 sleeps. And CPU seconds advancing exactly as fast as wall-clock seconds is the signature of a thread that never waits for anything.</p>
<h3>Recipe 3 — waiting on the disk</h3>
${slide('lx-12', 17, 'Chờ đĩa: vmstat + iostat đọc từng cột')}
<pre><code>vmstat 1 5                        <span class="tok-comment"># the wa column, and bi/bo</span>
iostat -xz 1 3                    <span class="tok-comment"># apt install sysstat</span>
sudo iotop -bon2 | head -12       <span class="tok-comment"># which process, if iotop is installed</span></code></pre>
<div class="out">Device  r/s     w/s   rkB/s    wkB/s  r_await w_await  aqu-sz  %util
vda    2.10  412.00   16.80  51488.00     0.81   181.44   74.82  99.60</div>
<div class="kv-grid">
  <div class="kv"><span class="k">%util near 100</span><span class="v">The device is busy essentially all the time. On an SSD or a network volume this is less damning than it sounds — they handle parallel requests — so read it together with <code>await</code>.</span></div>
  <div class="kv"><span class="k">w_await 181ms</span><span class="v">This is the real finding. A write is taking 181 milliseconds; a healthy SSD is under 5. Either the device is saturated or the provider is throttling you (burst IOPS credits are a common cause on cloud volumes).</span></div>
  <div class="kv"><span class="k">aqu-sz 74</span><span class="v">Seventy-four requests queued at all times. Every one of those is a process in D state, and every one of them counts toward load average.</span></div>
  <div class="kv"><span class="k">wkB/s 51488</span><span class="v">50MB/s of writes, sustained. Find the writer — a runaway log (Lesson 10.1), a database checkpoint storm, a backup running in the foreground, or a build.</span></div>
  <div class="kv"><span class="k">r/s tiny, w/s huge</span><span class="v">Write-dominated. Logs and databases. If reads dominate instead, suspect a cold cache after a restart, or a query doing full table scans.</span></div>
</div>
<pre><code><span class="tok-comment"># Who is writing? Two ways, no extra packages needed for the second</span>
sudo iotop -bon2 -o | head
<span class="tok-comment"># run as root (sudo -i first): /proc/PID/io of other users' processes is unreadable otherwise</span>
for f in /proc/[0-9]*/io; do
  p=\${f%/io}; w=\$(awk '/^write_bytes/{print \$2}' "\$f" 2&gt;/dev/null)
  [ "\${w:-0}" -gt 1000000000 ] &amp;&amp; printf '%s %sMB %s\\n' "\${p#/proc/}" "\$((w/1024/1024))" "\$(tr '\\0' ' ' &lt; "\$p/cmdline" | head -c60)"
done | sort -k2 -rn | head -5</code></pre>
<div class="out">41288 62914MB node /srv/app/dist/index.js
3401 8211MB postgres: checkpointer</div>

<div class="pitfall co-tieu-de"><strong>Two bugs this lesson used to have, and why they matter at 3am.</strong> The "who is writing?" loop above used to be <code>sudo find /proc … | while read f</code> with <code>tr -d '\\0'</code>. Measured in the lab with a process that wrote 60 MB, that version printed <code>python3/root/w.py 60MB</code>: <code>sudo</code> applied only to <code>find</code>, so the loop itself could not read other users' <code>/proc/PID/io</code>; deleting the NUL bytes glued the arguments together; and no PID was printed, so you could not act on the result. The corrected loop prints <code>4303 60MB python3 /root/w.py</code> — PID first, the number you sort by second, the command last. The same kind of slip hid in the RSS one-liner below: without <code>--no-headers</code>, <code>awk</code> turns the header into <code>PID 0MB ELAPSED CMD</code>. A diagnostic command that prints the wrong thing is worse than none, so test yours on a machine you control before you need it.</div>
<h3>Recipe 4 — memory pressure</h3>
${slide('lx-12', 18, 'Bộ nhớ: available, và OOM giết im lặng')}
<pre><code class="language-bash">free -h
vmstat 1 5                    <span class="tok-comment"># si/so columns = swap in/out</span>
ps aux --sort=-%mem | head -6
cat /sys/fs/cgroup/memory.pressure 2&gt;/dev/null
dmesg -T | grep -i 'out of memory' | tail -5</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           7.8Gi       2.1Gi       197Mi       88Mi       5.5Gi       5.3Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<div class="callout warn"><strong>Read the <code>available</code> column, never <code>free</code>.</strong> 197Mi "free" looks alarming and is completely healthy: Linux uses spare RAM as page cache, and that 5.5Gi of <code>buff/cache</code> is handed back the instant a process asks for memory. <code>available</code> — 5.3Gi here — is the honest number. A machine with a low <code>free</code> and a high <code>available</code> is a machine using its memory correctly, and "we added RAM because free was low" is a fix for a problem nobody had.</div>
<pre><code><span class="tok-comment"># Real pressure looks like this instead — nonzero si/so, sustained</span>
vmstat 1 5</code></pre>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  6 2010112  61204   1128  74112 4812 5104  9822 11044 4218 9911 12  9  6 73  0</div>
<p>4.8MB/s swapping in and 5.1MB/s out, six processes blocked, 73% I/O wait. This machine is thrashing: it is spending its time moving memory to and from disk instead of working. Adding swap does not fix this — swap is what turned an instant OOM kill into a slow death. The fix is less memory usage or more RAM.</p>
<pre><code><span class="tok-comment"># Which process grew? RSS in MB, biggest first</span>
ps -eo pid,rss,etimes,cmd --sort=-rss --no-headers | head -5 | awk '{\$2=int(\$2/1024)"MB"; print}'</code></pre>
<div class="out">41288 1842MB 18774 node /srv/app/dist/index.js
3401 402MB 1042118 /usr/lib/postgresql/16/bin/postgres
812 21MB 1051862 nginx: master process</div>
<div class="callout"><strong>Growing RSS plus a long <code>etimes</code> is the signature of a leak.</strong> Sample it three times ten minutes apart; a leak climbs monotonically while normal usage plateaus. Restarting buys you time proportional to how fast it climbs — useful during an incident, useless as a fix, and worth writing in the follow-up column (Lesson 12.1).</div>

<h3>Recipe 5 — the disk filled up mid-incident</h3>
${slide('lx-12', 19, 'Đĩa đầy: file đã xoá còn mở, inode cạn')}
<p>Chapter 10 covered this properly. Mid-incident you want the three commands that find the cause fastest, in order:</p>
<pre><code>df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev'
sudo du -x --max-depth=1 / 2&gt;/dev/null | sort -rn | head -8      <span class="tok-comment"># -x: stay on one filesystem</span>
sudo lsof -nP +L1 2&gt;/dev/null | awk '\$7&gt;1073741824' | head       <span class="tok-comment"># deleted but still open</span></code></pre>
<div class="out">/dev/vda1  79G  79G  0  100% /
14680064  14012431  667633  96% /
41287632  /var
38911204  /var/log
38904112  /var/log/app
COMMAND  PID   USER FD TYPE DEVICE     SIZE/OFF NLINK NODE NAME
node    41288 deploy 9w REG  253,1  44023414784     0  918 /var/log/app/debug.log (deleted)</div>
<p>Somebody already ran <code>rm</code> on the 41GB log and freed nothing, because node still holds the file open (Lesson 10.1). <code>lsof +L1</code> lists exactly those: link count zero, size enormous. Restarting the writer releases it instantly — and next time, <code>truncate -s 0</code> instead of <code>rm</code>.</p>
<div class="pitfall"><strong>Pitfall:</strong> "the disk is not full, so it is not a disk problem" — with 96% of inodes used and a normal-looking <code>df -h</code>. Every write then fails with <code>No space left on device</code> while gigabytes remain free, and the usual culprit is millions of tiny files: a session directory, a cache, or a mail spool. <code>df -i</code> belongs next to <code>df -h</code> in every sweep, which is why it is in the one in Lesson 12.1.</div>

<h3>Recipe 6 — slow, but nothing is busy</h3>
${slide('lx-12', 20, 'Chậm mà rảnh: curl -w và hàng chờ accept')}
<p>The hardest and most common case: requests take eight seconds, CPU is 4%, disk is idle, memory is fine. Nothing is busy because nothing is <em>working</em> — everything is waiting on something else.</p>
<pre><code class="language-bash"><span class="tok-comment"># Break one request into its phases — this is the whole diagnosis</span>
curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n' \\
  https://example.com/api/v1/posts</code></pre>
<div class="out">dns=0.004 connect=0.021 tls=0.061 ttfb=8.402 total=8.409</div>
<div class="kv-grid">
  <div class="kv"><span class="k">dns high</span><span class="v">Resolver problems. Check <code>/etc/resolv.conf</code> and time a lookup with <code>dig</code> (Lesson 9.1). A dead secondary nameserver adds a fixed 5s timeout to everything.</span></div>
  <div class="kv"><span class="k">connect high</span><span class="v">Network or a full accept queue. <code>ss -lnt</code> shows <code>Recv-Q</code> against <code>Send-Q</code> (the backlog); a <code>Recv-Q</code> at the limit means connections are queuing before your app ever sees them.</span></div>
  <div class="kv"><span class="k">tls high</span><span class="v">Handshake cost, or OCSP stapling fetching from a slow CA. Rare, but it shows up as a fixed penalty on every new connection.</span></div>
  <div class="kv"><span class="k">ttfb high, everything else fast</span><span class="v">The application is thinking — or waiting on a database, a cache, or an upstream API. This is the common case, and it means the machine is innocent.</span></div>
  <div class="kv"><span class="k">total ≫ ttfb</span><span class="v">The response body is slow to transfer: a huge payload, a slow client, or bandwidth throttling. Look at response size before blaming the server.</span></div>
</div>
<pre><code><span class="tok-comment"># Where is the app waiting? Look at its connections, not its CPU</span>
ss -tanp state established | grep -c 5432          <span class="tok-comment"># open DB connections</span>
ss -tanp state established '( dport = :443 )' | head <span class="tok-comment"># outbound API calls in flight</span>
ss -lnt | head -5                                   <span class="tok-comment"># accept-queue backlog</span></code></pre>
<div class="out">$ ss -tanp state established | grep -c 5432
100
$ ss -lnt | head -3
State  Recv-Q Send-Q Local Address:Port
LISTEN 511    511          0.0.0.0:3000
LISTEN 0      511          0.0.0.0:80</div>
<p>Exactly 100 database connections — a suspiciously round number, which means it is a configured pool limit, not a coincidence. And <code>Recv-Q 511</code> equal to <code>Send-Q 511</code> on port 3000 means the accept queue is completely full: new connections are queuing in the kernel while every worker waits for a database connection that will not come. The machine is idle because it is deadlocked on a pool, and no amount of CPU or RAM would help.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Split the request</span><span class="lz-t">curl -w timings</span><span class="lz-d">DNS, connect, TLS, TTFB, total. One command tells you which of five layers owns the delay.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Confirm the machine is innocent</span><span class="lz-t">load, %wa, available memory, %util</span><span class="lz-d">If all four are calm while requests are slow, stop looking at the OS. You are debugging waiting, not resources.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Look at what it is waiting ON</span><span class="lz-t">ss -tanp state established</span><span class="lz-d">Count connections per destination port. A round number is a pool limit; a growing number is a leak; zero to the database is the answer on its own.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Check the queue in front</span><span class="lz-t">ss -lnt · nginx active connections</span><span class="lz-d">A full accept queue means the symptom is one layer downstream of where users feel it.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Time the dependency directly</span><span class="lz-t">psql -c '\\timing' · curl the upstream API</span><span class="lz-d">Cut your app out of the loop. If the database answers in 4 seconds from the shell, the investigation has moved and your app was never the problem.</span></div>
</div>

<h3>Reading vmstat, column by column</h3>
<p><code>vmstat 1 5</code> is the most information per keystroke on a Linux box, and it is unreadable until someone walks you through it once. This is a real run in the lab while four <code>dd</code> processes wrote with <code>oflag=direct,dsync</code> (the first line is an average since boot — always ignore it):</p>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 2  1 437832 401068 1565936 3471760    6    8    75   318 1131    1  0  0 99  0  0  0
 5  0 437832 400060 1572788 3471764    0    0     0 49532 24482 29865 10  7 66 17  0  0
 2  1 437832 395524 1579384 3471768    0    0     0 46968 24054 28398 10  7 67 16  0  0
 1  3 437832 390988 1584160 3471768    0    0     0 35828 18969 21948 10  6 67 17  0  0</div>
<table>
<tr><th>Column</th><th>Meaning</th><th>Worry when…</th></tr>
<tr><td><code>r</code></td><td>runnable: running or waiting for a CPU</td><td>consistently above <code>nproc</code></td></tr>
<tr><td><code>b</code></td><td>blocked in uninterruptible sleep (state <code>D</code>), almost always on I/O</td><td>nonzero every second</td></tr>
<tr><td><code>swpd</code> · <code>free</code> · <code>buff</code> · <code>cache</code></td><td>KiB of swap used, idle RAM, buffers, page cache</td><td>not on their own — see <code>si</code>/<code>so</code></td></tr>
<tr><td><code>si</code> · <code>so</code></td><td>KiB/s swapped in from / out to disk</td><td>nonzero for more than a few seconds = thrashing</td></tr>
<tr><td><code>bi</code> · <code>bo</code></td><td>blocks/s read from / written to disks</td><td>high <code>bo</code> with high <code>wa</code>: find the writer</td></tr>
<tr><td><code>in</code> · <code>cs</code></td><td>interrupts and context switches per second</td><td>sudden jumps: many tiny syscalls, lock contention</td></tr>
<tr><td><code>us</code> · <code>sy</code> · <code>id</code> · <code>wa</code></td><td>% CPU in user code, kernel, idle, idle-while-waiting-for-I/O</td><td><code>us</code>+<code>sy</code> near 100 = CPU; <code>wa</code> above ~10 = disk</td></tr>
<tr><td><code>st</code></td><td>steal: time the hypervisor gave your vCPU to another guest</td><td>above ~10 on a VPS: noisy neighbour, not your code</td></tr>
<tr><td><code>gu</code></td><td>time spent running a guest VM (new in procps-ng 4)</td><td>only matters if this machine hosts VMs</td></tr>
</table>
<p>Here: 66% idle, 17% <code>wa</code>, <code>b</code> up to 3, ~45 MB/s in <code>bo</code> — "the CPU is waiting for the disk", in one line. <code>top</code>'s <code>%Cpu(s)</code> header uses the same abbreviations plus <code>ni</code> (niced user code), <code>hi</code> and <code>si</code> (hardware and software interrupts — note that <code>si</code> means something different in <code>top</code> and in <code>vmstat</code>).</p>

<h3>Try it step by step: a full disk, a disk that only looks full, and an idle machine that is slow</h3>
<p>All three were reproduced in an Ubuntu 24.04 container started with two small RAM disks, so that "full" takes seconds and nothing real is at risk:</p>
<pre><code class="language-bash">docker run -d --name lx12-u --memory 512m \\
  --tmpfs /day:size=40m --tmpfs /inode:size=40m,nr_inodes=2000 ubuntu:24.04 sleep infinity</code></pre>
<p><strong>1 · Deleted but still open.</strong> A Python process appends 64 KB blocks to <code>/day/logs/app.log</code> and keeps the file open, like a Node app with a log stream:</p>
<div class="out">$ df -h /day
tmpfs            40M   40M     0 100% /day
$ echo "test" &gt; /day/new.txt
bash: line 1: echo: write error: No space left on device
$ rm /day/logs/app.log
$ df -h /day
tmpfs            40M   40M     0 100% /day
$ du -sh /day
0	/day
$ lsof -nP +L1
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 3682 root    3w   REG  0,113 41943040     0   11 /day/logs/app.log (deleted)
$ : &gt; /proc/3682/fd/3
$ df -h /day
tmpfs            40M   68K   40M   1% /day</div>
<p><code>du</code> adds up names it can find; <code>df</code> asks the filesystem how many blocks are allocated. After <code>rm</code> the name is gone (<code>NLINK 0</code>) but the open file descriptor keeps the blocks, so the two disagree — and that disagreement is itself the diagnosis. Truncating through <code>/proc/PID/fd/N</code> frees the space without restarting the writer; restarting it works too.</p>
<p><strong>2 · Out of inodes, not out of bytes.</strong> A loop creates empty session files until the filesystem refuses:</p>
<div class="out">$ echo hello &gt; /inode/report.txt
bash: line 1: /inode/report.txt: No space left on device
$ df -h /inode
tmpfs            40M     0   40M   0% /inode
$ df -i /inode
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000  2000     0  100% /inode
$ find /inode -xdev -type f | cut -d/ -f1-3 | sort | uniq -c | sort -rn | head -3
   1998 /inode/sessions</div>
<p>Zero bytes used, "No space left on device" anyway. Every file needs one inode however small it is; the <code>find | cut | uniq -c</code> line counts files per top-level directory and names the culprit in one pass.</p>
<p><strong>3 · Slow while idle: a full accept queue.</strong> A single-threaded Python app (listen backlog 5) answers <code>/slow</code> in 3 seconds and <code>/</code> instantly. Fifteen requests to <code>/slow</code> arrive at once:</p>
<div class="out">$ curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\\n' http://127.0.0.1:19125/slow
dns=0.000997 connect=0.001589 ttfb=3.691853 total=3.695036
$ ss -lnt 'sport = :19125'
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 6      5          127.0.0.1:19125      0.0.0.0:*
$ ss -tan state syn-sent '( dport = :19125 )' | tail -n +2 | wc -l
8
$ top -b -n1 | sed -n 3p
%Cpu(s): 10.2 us,  0.9 sy,  0.0 ni, 88.0 id,  0.0 wa,  0.0 hi,  0.9 si,  0.0 st
$ curl -sS -o /dev/null -w 'connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\\n' -m 60 http://127.0.0.1:19125/
connect=7.199762 ttfb=24.818435 total=24.818498</div>
<p>The endpoint that answers in zero milliseconds took <strong>24.8 seconds</strong>, on a machine that is 88% idle. <code>Recv-Q 6</code> above <code>Send-Q 5</code> says the kernel's accept queue is over its limit; eight more clients are stuck in <code>SYN-SENT</code>, still waiting for the handshake — which is why <code>connect</code> alone took 7.2 s. Nothing here would show up in CPU, memory or disk graphs. The fix is more workers or a faster <code>/slow</code>, never a bigger server.</p>

<h3>Flag table: the commands of this lesson</h3>
<table>
<tr><th>Command and flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>vmstat N COUNT</code></td><td>a line every N seconds, COUNT times; ignore line 1</td><td><code>vmstat 1 5</code></td></tr>
<tr><td><code>iostat -x -z N</code></td><td>extended columns, hide idle devices (package <code>sysstat</code>)</td><td><code>iostat -xz 1 3</code></td></tr>
<tr><td><code>top -b -n1</code></td><td>batch mode, one iteration — for scripts and pasting</td><td><code>top -b -n1 | head -15</code></td></tr>
<tr><td><code>top -H -p PID</code></td><td>threads of one process</td><td><code>top -H -b -n1 -p 41288</code></td></tr>
<tr><td><code>ps -eo … --sort=-KEY --no-headers</code></td><td>choose columns, sort descending, no header line</td><td><code>ps -eo pid,rss,cmd --sort=-rss --no-headers</code></td></tr>
<tr><td><code>ps -o etimes=,times=</code></td><td>wall-clock vs CPU seconds, no header</td><td><code>ps -o etimes=,times= -p 41288</code></td></tr>
<tr><td><code>free -h</code></td><td>human units; read <code>available</code></td><td><code>free -h</code></td></tr>
<tr><td><code>df -h</code> · <code>df -i</code></td><td>bytes · inodes per filesystem</td><td><code>df -i /var</code></td></tr>
<tr><td><code>du -x -h -d1</code></td><td>stay on one filesystem, human units, one level deep</td><td><code>du -xh -d1 / | sort -rh | head</code></td></tr>
<tr><td><code>lsof -nP +L1</code></td><td>open files with link count below 1 (deleted but open)</td><td><code>lsof -nP +L1 | awk '\$7 &gt; 1e9'</code></td></tr>
<tr><td><code>ss -lnt</code></td><td>listening TCP sockets: <code>Recv-Q</code> = waiting to be accepted, <code>Send-Q</code> = backlog limit</td><td><code>ss -lnt 'sport = :3000'</code></td></tr>
</table>

<h3>On macOS and WSL: what is different</h3>
<p>macOS has none of <code>free</code>, <code>vmstat</code> or <code>/proc</code>. The equivalents, measured on the Mac used for this course: <code>vm_stat</code> prints raw page counts (<code>page size of 16384 bytes</code>, so multiply by 16 KB), <code>memory_pressure</code> ends with a single useful line (<code>System-wide memory free percentage: 39%</code>), and <code>top -l 2 -o cpu</code> lists the busiest processes — use two samples, because every process shows <code>0.0</code> in the first. <code>iostat</code> exists but is the BSD one, with KB/t, tps and MB/s per disk instead of <code>await</code> and <code>%util</code>. The load average is not comparable at all: this Mac reported <code>462.70 516.08 651.62</code> on 10 cores while <code>top</code> showed the CPU 34% idle. On WSL2 everything in this lesson works as on Ubuntu, but <code>free</code> and <code>vmstat</code> describe the WSL VM, whose memory ceiling is set in <code>.wslconfig</code> on the Windows side — a Windows machine with 16 GB can still OOM inside WSL.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team's log volume "filled up again", but <code>du</code> swears it is empty. Build the same trap and get out of it without restarting anything.</p><ol>
<li><code>docker run -d --name lab123 --tmpfs /data:size=20m ubuntu:24.04 sleep infinity</code>; inside, <code>apt-get update &amp;&amp; apt-get install -y lsof procps</code>.</li>
<li>Start a writer that keeps its file open on descriptor 3 (a subshell that never closes it — like a Node app with a log stream): <code>( exec 3&gt;&gt;/data/app.log; while :; do head -c 65536 /dev/zero &gt;&amp;3 2&gt;/dev/null; sleep 0.01; done ) &amp;</code> — wait until <code>df -h /data</code> shows 100%.</li>
<li><code>rm /data/app.log</code>, then show that <code>df</code> and <code>du -sh /data</code> disagree.</li>
<li>Find the file with <code>lsof -nP +L1</code> and free the space through <code>/proc/PID/fd/N</code>.</li>
<li>Prove the writer is still alive (<code>ps -o pid,stat,cmd -p PID</code>) and that writing works again: <code>echo test &gt; /data/new.txt</code>.</li></ol>
<p><strong>Done when:</strong> <code>lsof +L1</code> showed <code>(deleted)</code> with <code>NLINK 0</code>, <code>df -h /data</code> drops back to about 1% <em>while the writer is still running</em> (a tmpfs lives in RAM, so do not expect <code>vmstat</code>'s <code>bo</code> to move here). Clean up with <code>docker rm -f lab123</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load average</span><span class="v">Average number of tasks running or waiting (CPU queue + uninterruptible sleep) over 1, 5 and 15 minutes.</span></div>
  <div class="kv"><span class="k">D state</span><span class="v">Uninterruptible sleep — waiting inside the kernel, usually for I/O; cannot be killed while in it.</span></div>
  <div class="kv"><span class="k">I/O wait (<code>wa</code>)</span><span class="v">CPU time spent idle because every runnable task is waiting for the disk.</span></div>
  <div class="kv"><span class="k">PSI</span><span class="v">Pressure Stall Information: the share of time tasks were stalled on CPU, memory or I/O.</span></div>
  <div class="kv"><span class="k">Page cache</span><span class="v">Spare RAM used to cache files; given back instantly, which is why <code>available</code> matters, not <code>free</code>.</span></div>
  <div class="kv"><span class="k">Thrashing</span><span class="v">Constant swapping in and out; the machine spends its time moving memory instead of working.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The record every file needs, however small; a filesystem can run out of them before it runs out of bytes.</span></div>
  <div class="kv"><span class="k">Accept queue (backlog)</span><span class="v">Connections the kernel has completed but the app has not accepted yet; full = new clients wait.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Load average counts runnable <em>and</em> D-state tasks; compare it with <code>nproc</code> and check <code>wa</code> or <code>/proc/pressure/io</code> before blaming the CPU.</li>
<li>One thread at 100% shows as 10% on a 10-core machine; <code>top -H</code> and <code>etimes</code> vs <code>times</code> expose it.</li>
<li><code>vmstat 1 5</code>: <code>r</code> for CPU, <code>b</code>/<code>wa</code> for disk, <code>si</code>/<code>so</code> for memory, <code>st</code> for a noisy VPS neighbour.</li>
<li>Read <code>available</code>, never <code>free</code>; the OOM killer's victim says nothing — the kernel log does.</li>
<li><code>df</code> full but <code>du</code> small ⇒ <code>lsof +L1</code>; "No space" with free bytes ⇒ <code>df -i</code>.</li>
<li>Slow while idle is waiting: split the request with <code>curl -w</code> and look for <code>Recv-Q</code> reaching <code>Send-Q</code>.</li>
</ul>
<a class="link-card" href="https://docs.kernel.org/accounting/psi.html" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">PSI — Pressure Stall Information</span><span class="lc-sub">The kernel documentation for <code>/proc/pressure/*</code>. It answers "how much time was lost waiting for CPU / IO / memory", which load average cannot. Underused and available on every modern kernel.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Linux load averages: solving the mystery</span><span class="lc-sub">Why Linux counts uninterruptible sleep in load and other Unixes do not — including the 1993 patch that did it. This is the article that makes the number finally make sense.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/iostat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">💽</span>
  <span class="lc-body"><span class="lc-title">iostat(1) — every column explained</span><span class="lc-sub">What <code>await</code>, <code>aqu-sz</code> and <code>%util</code> actually measure, and why <code>%util</code> alone is misleading on SSDs and virtualised storage.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: four slow machines</span><span class="lc-sub">Graded exercises: separate CPU-bound from I/O-bound from D-state using only <code>vmstat</code>, read a <code>curl -w</code> breakdown and name the guilty layer, and spot the exhausted connection pool from <code>ss</code> output alone.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> optimising the thing you can see instead of the thing that is slow. A CPU at 60% during an eight-second request is not the cause — it is what the machine does while waiting. Before you tune anything, get the phase breakdown from <code>curl -w</code> and confirm which layer owns the time. Most "server is slow" incidents end at a database query, an upstream API, or a connection pool, and every hour spent on kernel parameters first is an hour the actual cause kept running.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Load average is not CPU — read <code>/proc/pressure</code> or the <code>%wa</code> column to find out whether the machine is computing or waiting. Read <code>available</code>, not <code>free</code>: page cache is not memory you have lost, and the real signature of memory trouble is sustained <code>si</code>/<code>so</code> in <code>vmstat</code>. And when nothing is busy but everything is slow, stop looking at resources and start counting connections — the answer is almost always something your machine is waiting for, not something it is doing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Sách công thức: nó chậm</h2>
<p class="lead">"Chết" thì dễ — có thứ gì đó không trả lời và bạn đi tìm nó. "Chậm" thì khó hơn, vì về mặt kỹ thuật mọi thứ đều đang chạy và cái máy sẽ vui vẻ báo với bạn rằng nó vẫn ổn. Sáu công thức để tìm ra cái tài nguyên đã cạn, kể cả trường hợp KHÔNG CÁI NÀO cạn cả.</p>

<h3>Công thức 1 — "load" thật ra nghĩa là gì</h3>
${slide('lx-12', 15, 'Load = hàng chạy + hàng chờ D')}
<pre><code class="language-bash">uptime; nproc
cat /proc/pressure/cpu /proc/pressure/io /proc/pressure/memory   <span class="tok-comment"># PSI, nhân 4.20 trở lên</span></code></pre>
<div class="out">$ uptime
 19:31:44 up 12 days, 4:12, 1 user, load average: 8.21, 7.94, 6.02
$ nproc
2
$ cat /proc/pressure/io
some avg10=61.44 avg60=58.02 avg300=41.17 total=884213004
full avg10=44.10 avg60=42.55 avg300=30.09 total=612004112</div>
<p>Load average trên Linux <strong>KHÔNG</strong> phải phần trăm CPU. Nó đếm những tiến trình đang chạy <em>CỘNG VỚI</em> những tiến trình kẹt trong giấc ngủ không ngắt được — gần như luôn là đang chờ đĩa hoặc chờ ổ lưu trữ qua mạng. Vì thế load 8 trên 2 nhân có thể nghĩa là "CPU đang bốc cháy" hoặc "CPU rảnh rỗi còn cái đĩa thì đang hấp hối", và riêng con số đó không nói được là cái nào.</p>
<p><code>/proc/pressure</code> giải quyết chuyện đó trong một lần đọc. <code>io.full avg10=44</code> nghĩa là trong 44% của mười giây vừa rồi, <em>MỌI</em> tác vụ có thể chạy đều đang bị chặn ở I/O. Đó là một vấn đề về đĩa, dứt khoát, trước cả khi bạn mở một công cụ giám sát nào.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Load cao + %us cao</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nghẽn ở CPU — việc thật hoặc một vòng lặp mất kiểm soát</span><span class="lz-nsub">Hãy tìm tiến trình (<code>top</code>, <code>ps aux --sort=-%cpu</code>). Một tiến trình chiếm 100% của một nhân thường là con bọ; mọi thứ ở mức 60% thì thường là lưu lượng thật.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Load cao + %wa cao</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nghẽn ở I/O — cái đĩa là trần</span><span class="lz-nsub">CPU rảnh và đang chờ. Công thức 3. Trên VPS thì đây cũng là dáng vẻ của một hàng xóm ồn ào hoặc một ổ đĩa bị bóp băng thông.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Load cao + %sy cao</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thời gian trong nhân — lời gọi hệ thống, chuyển ngữ cảnh, mạng</span><span class="lz-nsub">Thường là một tiến trình đọc hàng triệu mẩu tí xíu, hoặc trình điều khiển lưu trữ của container. <code>strace -c -p PID</code> trong mười giây sẽ gọi tên lời gọi hệ thống đó.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Load cao, mọi thứ đều rảnh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tiến trình kẹt ở trạng thái D</span><span class="lz-nsub"><code>ps -eo state,pid,cmd | grep '^D'</code>. Giấc ngủ không ngắt được: một điểm gắn NFS treo, một cái đĩa đang hỏng, hoặc một trình điều khiển trong nhân bị kẹt. Những cái này còn không giết được.</span></div></div>
  </div>
</div>

<h3>Công thức 2 — CPU kịch trần</h3>
${slide('lx-12', 16, 'CPU 100%: một luồng kẹt vĩnh viễn')}
<pre><code>top -b -n1 | head -12                       <span class="tok-comment"># chụp một phát, hợp với script</span>
ps -eo pid,ppid,%cpu,%mem,etime,cmd --sort=-%cpu | head -6
top -H -p 41288 -b -n1 | head -14           <span class="tok-comment"># theo TỪNG LUỒNG trong một tiến trình</span>
sudo strace -c -f -p 41288 &amp; sleep 10; kill %1   <span class="tok-comment"># lời gọi hệ thống nào áp đảo</span></code></pre>
<div class="out">%Cpu(s): 97.2 us,  2.1 sy,  0.0 ni,  0.5 id,  0.0 wa
  PID  PPID %CPU %MEM     ELAPSED CMD
41288     1 99.4  6.1    05:12:44 node /srv/app/dist/index.js
  812     1  1.1  0.8  12-04:11:02 nginx: worker process</div>
<p>Một tiến trình, một nhân, 99%, và nó đã sống năm tiếng. Hai câu hỏi quyết định phải làm gì: thời gian CPU có đang <em>TĂNG</em> (rò rỉ hay vòng lặp vô hạn) hay <em>ĐỀU</em> (việc thật)? Và nó bắt đầu từ một bản deploy phải không?</p>
<pre><code><span class="tok-comment"># Nó kẹt hay đang làm việc? So số giây CPU qua 10 giây</span>
for i in 1 2 3; do ps -o etimes=,times= -p 41288; sleep 5; done</code></pre>
<div class="out">18764 18701
18769 18706
18774 18711</div>
<p>Năm giây đồng hồ treo tường, năm giây CPU, ở mọi khoảng đo: tiến trình này đang đốt trọn một nhân LIÊN TỤC, không phải làm việc theo từng đợt. Với Node.js thì điều đó nghĩa là vòng lặp sự kiện bị chặn — một biểu thức chính quy chạy đồng bộ, một cú <code>JSON.parse</code> khổng lồ, hoặc một vòng lặp không bao giờ thoát. Cách sửa nằm trong mã nguồn, và phần chẩn đoán tốn mười lăm giây.</p>
<div class="callout"><strong><code>%CPU</code> vượt quá 100 là bình thường và không phải lỗi.</strong> <code>top</code> và <code>ps</code> báo phần trăm theo TỪNG CPU, nên một tiến trình dùng trọn bốn nhân hiện ra 400%. Bấm <code>1</code> trong <code>top</code> để thấy từng nhân riêng. Thứ có ý nghĩa là tỷ lệ so với <code>nproc</code>: 100% trên một máy 16 nhân là MỘT luồng bão hoà bên trong một cái máy còn lại rảnh rỗi — đó là vấn đề độ trễ cho những request rơi trúng luồng đó, không phải vấn đề sức chứa của máy chủ.</div>

<p><strong>Đo thật.</strong> Cách kinh điển để làm kịch một nhân mà không cần vòng lặp vô tận là một biểu thức chính quy quay lui theo cấp số nhân. Trong container thí nghiệm, một luồng Python chạy <code>re.match(r"(a+)+\$", "a" * 40 + "!")</code>; hai mươi giây sau:</p>
<div class="out">$ top -b -n1 | head -8
…
%Cpu(s):  9.4 us,  0.9 sy,  0.0 ni, 89.6 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
…
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   3845 root      20   0   88600   9664   5612 S  90.9   0.1   0:20.30 python3
$ top -H -b -n1 -p 3845 | tail -2
   3847 root      20   0   88600   9664   5612 R  99.9   0.1   0:20.41 python3
   3845 root      20   0   88600   9664   5612 S   0.0   0.1   0:00.10 python3
$ for i in 1 2 3; do ps -o etimes=,times= -p 3845; sleep 5; done
     20       20
     25       25
     30       30</div>
<p>Đọc đúng như công thức này dạy. Cả máy rảnh 89,6% vì nó có 10 nhân và chỉ một nhân đầy — 1 ÷ 10 ≈ 10% — chính vì thế mà một luồng request bị kẹt trốn rất giỏi trong bảng giám sát. <code>top -H</code> tách tiến trình ra thành từng luồng: 3847 ở trạng thái <code>R</code> và giữ toàn bộ CPU, còn luồng chính 3845 thì ngủ. Và giây CPU tăng đúng bằng giây đồng hồ là chữ ký của một luồng không bao giờ chờ bất cứ thứ gì.</p>
<h3>Công thức 3 — đang chờ cái đĩa</h3>
${slide('lx-12', 17, 'Chờ đĩa: vmstat + iostat đọc từng cột')}
<pre><code>vmstat 1 5                        <span class="tok-comment"># cột wa, và bi/bo</span>
iostat -xz 1 3                    <span class="tok-comment"># apt install sysstat</span>
sudo iotop -bon2 | head -12       <span class="tok-comment"># tiến trình nào, nếu máy có cài iotop</span></code></pre>
<div class="out">Device  r/s     w/s   rkB/s    wkB/s  r_await w_await  aqu-sz  %util
vda    2.10  412.00   16.80  51488.00     0.81   181.44   74.82  99.60</div>
<div class="kv-grid">
  <div class="kv"><span class="k">%util gần 100</span><span class="v">Thiết bị bận gần như suốt thời gian. Trên SSD hay ổ đĩa qua mạng thì điều này không nặng nề như nghe có vẻ — chúng xử lý song song nhiều yêu cầu — nên hãy đọc nó CÙNG với <code>await</code>.</span></div>
  <div class="kv"><span class="k">w_await 181ms</span><span class="v">Đây mới là phát hiện thật. Một lần ghi mất 181 mili giây; một SSD khoẻ mạnh thì dưới 5. Hoặc thiết bị đã bão hoà, hoặc nhà cung cấp đang bóp bạn (hết tín dụng IOPS bùng nổ là nguyên nhân phổ biến trên ổ đĩa đám mây).</span></div>
  <div class="kv"><span class="k">aqu-sz 74</span><span class="v">Bảy mươi tư yêu cầu xếp hàng ở mọi thời điểm. Mỗi cái trong số đó là một tiến trình ở trạng thái D, và mỗi cái đều được tính vào load average.</span></div>
  <div class="kv"><span class="k">wkB/s 51488</span><span class="v">50MB/s ghi, liên tục. Hãy tìm kẻ đang ghi — một file log mất kiểm soát (Bài 10.1), một cơn bão checkpoint của cơ sở dữ liệu, một bản sao lưu chạy tiền cảnh, hay một lượt build.</span></div>
  <div class="kv"><span class="k">r/s bé tí, w/s khổng lồ</span><span class="v">Ghi áp đảo. Log và cơ sở dữ liệu. Nếu ngược lại là đọc áp đảo thì hãy nghi bộ đệm nguội sau một lần khởi động lại, hoặc một truy vấn đang quét toàn bảng.</span></div>
</div>
<pre><code><span class="tok-comment"># Ai đang ghi? Hai cách, cách thứ hai không cần cài thêm gói nào</span>
sudo iotop -bon2 -o | head
<span class="tok-comment"># chạy bằng root (sudo -i trước): không thì không đọc được /proc/PID/io của người dùng khác</span>
for f in /proc/[0-9]*/io; do
  p=\${f%/io}; w=\$(awk '/^write_bytes/{print \$2}' "\$f" 2&gt;/dev/null)
  [ "\${w:-0}" -gt 1000000000 ] &amp;&amp; printf '%s %sMB %s\\n' "\${p#/proc/}" "\$((w/1024/1024))" "\$(tr '\\0' ' ' &lt; "\$p/cmdline" | head -c60)"
done | sort -k2 -rn | head -5</code></pre>
<div class="out">41288 62914MB node /srv/app/dist/index.js
3401 8211MB postgres: checkpointer</div>

<div class="pitfall co-tieu-de"><strong>Hai con bọ bài này từng có, và vì sao chúng quan trọng lúc 3 giờ sáng.</strong> Vòng "ai đang ghi?" ở trên trước đây là <code>sudo find /proc … | while read f</code> với <code>tr -d '\\0'</code>. Đo thật trong phòng thí nghiệm với một tiến trình ghi 60 MB, bản đó in ra <code>python3/root/w.py 60MB</code>: <code>sudo</code> chỉ áp cho <code>find</code>, nên chính vòng lặp không đọc được <code>/proc/PID/io</code> của người dùng khác; xoá byte NUL làm các tham số dính liền vào nhau; và không có PID nào được in, nên bạn chẳng làm gì được với kết quả. Vòng đã sửa in <code>4303 60MB python3 /root/w.py</code> — PID trước, con số để sắp xếp ở giữa, câu lệnh ở cuối. Cùng kiểu sơ suất nấp trong câu lệnh RSS ở dưới: thiếu <code>--no-headers</code> thì <code>awk</code> biến dòng tiêu đề thành <code>PID 0MB ELAPSED CMD</code>. Một lệnh chẩn đoán in sai còn tệ hơn không có lệnh nào, nên hãy thử lệnh của bạn trên một máy bạn làm chủ TRƯỚC khi cần tới nó.</div>
<h3>Công thức 4 — sức ép bộ nhớ</h3>
${slide('lx-12', 18, 'Bộ nhớ: available, và OOM giết im lặng')}
<pre><code class="language-bash">free -h
vmstat 1 5                    <span class="tok-comment"># cột si/so = swap vào/ra</span>
ps aux --sort=-%mem | head -6
cat /sys/fs/cgroup/memory.pressure 2&gt;/dev/null
dmesg -T | grep -i 'out of memory' | tail -5</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           7.8Gi       2.1Gi       197Mi       88Mi       5.5Gi       5.3Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<div class="callout warn"><strong>Hãy đọc cột <code>available</code>, đừng bao giờ đọc <code>free</code>.</strong> 197Mi "free" trông đáng báo động và thật ra hoàn toàn khoẻ mạnh: Linux dùng RAM thừa làm bộ đệm trang, và 5,5Gi <code>buff/cache</code> kia được trả lại NGAY khoảnh khắc một tiến trình xin bộ nhớ. <code>available</code> — 5,3Gi ở đây — mới là con số trung thực. Một cái máy có <code>free</code> thấp và <code>available</code> cao là một cái máy đang dùng bộ nhớ ĐÚNG CÁCH, và "chúng tôi mua thêm RAM vì free thấp" là cách chữa cho một vấn đề không ai có.</div>
<pre><code><span class="tok-comment"># Sức ép THẬT thì trông như thế này — si/so khác 0, liên tục</span>
vmstat 1 5</code></pre>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  6 2010112  61204   1128  74112 4812 5104  9822 11044 4218 9911 12  9  6 73  0</div>
<p>4,8MB/s swap vào và 5,1MB/s swap ra, sáu tiến trình bị chặn, 73% chờ I/O. Cái máy này đang giãy giụa: nó dành thời gian chuyển bộ nhớ ra đĩa rồi lại vào thay vì làm việc. Thêm swap KHÔNG chữa được chuyện này — chính swap đã biến một cú OOM tức thì thành một cái chết chậm. Cách chữa là dùng ít bộ nhớ hơn hoặc mua thêm RAM.</p>
<pre><code><span class="tok-comment"># Tiến trình nào phình ra? RSS theo MB, lớn nhất trước</span>
ps -eo pid,rss,etimes,cmd --sort=-rss --no-headers | head -5 | awk '{\$2=int(\$2/1024)"MB"; print}'</code></pre>
<div class="out">41288 1842MB 18774 node /srv/app/dist/index.js
3401 402MB 1042118 /usr/lib/postgresql/16/bin/postgres
812 21MB 1051862 nginx: master process</div>
<div class="callout"><strong>RSS tăng dần cộng với <code>etimes</code> dài là chữ ký của một chỗ rò rỉ.</strong> Hãy lấy mẫu ba lần cách nhau mười phút; chỗ rò thì leo đơn điệu còn mức dùng bình thường thì đi ngang. Khởi động lại mua cho bạn thời gian tỷ lệ với tốc độ nó leo — hữu ích trong lúc sự cố, vô dụng với tư cách một cách chữa, và đáng ghi vào cột việc-sau (Bài 12.1).</div>

<h3>Công thức 5 — đĩa đầy ngay giữa lúc sự cố</h3>
${slide('lx-12', 19, 'Đĩa đầy: file đã xoá còn mở, inode cạn')}
<p>Chương 10 đã nói kỹ chuyện này. Giữa lúc sự cố thì bạn cần ba câu lệnh tìm ra nguyên nhân nhanh nhất, theo đúng thứ tự này:</p>
<pre><code>df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev'
sudo du -x --max-depth=1 / 2&gt;/dev/null | sort -rn | head -8      <span class="tok-comment"># -x: ở lại một hệ thống file</span>
sudo lsof -nP +L1 2&gt;/dev/null | awk '\$7&gt;1073741824' | head       <span class="tok-comment"># đã xoá mà vẫn mở</span></code></pre>
<div class="out">/dev/vda1  79G  79G  0  100% /
14680064  14012431  667633  96% /
41287632  /var
38911204  /var/log
38904112  /var/log/app
COMMAND  PID   USER FD TYPE DEVICE     SIZE/OFF NLINK NODE NAME
node    41288 deploy 9w REG  253,1  44023414784     0  918 /var/log/app/debug.log (deleted)</div>
<p>Có người đã <code>rm</code> cái log 41GB rồi mà chẳng giải phóng được gì, vì node vẫn đang giữ file đó mở (Bài 10.1). <code>lsof +L1</code> liệt kê đúng những cái đó: số liên kết bằng không, kích thước khổng lồ. Khởi động lại kẻ đang ghi là nhả ra ngay — và lần sau, hãy <code>truncate -s 0</code> thay vì <code>rm</code>.</p>
<div class="pitfall"><strong>Bẫy:</strong> "đĩa chưa đầy, nên không phải vấn đề về đĩa" — trong khi 96% inode đã dùng và <code>df -h</code> trông vẫn bình thường. Sau đó mọi lệnh ghi đều hỏng với <code>No space left on device</code> trong lúc còn hàng gigabyte trống, và thủ phạm thường gặp là hàng triệu file tí hon: một thư mục phiên, một bộ đệm, hay một hòm thư. <code>df -i</code> phải đứng cạnh <code>df -h</code> trong mọi cuộc quét, và đó là lý do nó có mặt trong cuộc quét ở Bài 12.1.</div>

<h3>Công thức 6 — chậm, mà chẳng có gì bận</h3>
${slide('lx-12', 20, 'Chậm mà rảnh: curl -w và hàng chờ accept')}
<p>Trường hợp khó nhất và phổ biến nhất: request mất tám giây, CPU 4%, đĩa rảnh, bộ nhớ ổn. Không có gì bận bởi vì không có gì đang <em>LÀM VIỆC</em> — tất cả đều đang chờ một thứ khác.</p>
<pre><code class="language-bash"><span class="tok-comment"># Chẻ một request ra thành các pha — đây chính là toàn bộ phần chẩn đoán</span>
curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n' \\
  https://example.com/api/v1/posts</code></pre>
<div class="out">dns=0.004 connect=0.021 tls=0.061 ttfb=8.402 total=8.409</div>
<div class="kv-grid">
  <div class="kv"><span class="k">dns cao</span><span class="v">Vấn đề của trình phân giải. Hãy kiểm <code>/etc/resolv.conf</code> và bấm giờ một lượt tra bằng <code>dig</code> (Bài 9.1). Một máy chủ tên phụ đã chết cộng thêm đúng 5 giây hết-giờ vào MỌI THỨ.</span></div>
  <div class="kv"><span class="k">connect cao</span><span class="v">Mạng, hoặc hàng đợi nhận kết nối đã đầy. <code>ss -lnt</code> cho thấy <code>Recv-Q</code> so với <code>Send-Q</code> (độ dài hàng đợi); <code>Recv-Q</code> chạm trần nghĩa là các kết nối đang xếp hàng TRƯỚC KHI ứng dụng của bạn kịp thấy chúng.</span></div>
  <div class="kv"><span class="k">tls cao</span><span class="v">Chi phí bắt tay, hoặc OCSP stapling đang đi lấy dữ liệu từ một CA chậm. Hiếm, nhưng nó hiện ra dưới dạng một khoản phạt cố định trên mọi kết nối mới.</span></div>
  <div class="kv"><span class="k">ttfb cao, mọi thứ khác nhanh</span><span class="v">Ứng dụng đang NGHĨ — hoặc đang chờ một cơ sở dữ liệu, một bộ nhớ đệm, hay một API bên trên. Đây là trường hợp phổ biến, và nó nghĩa là cái máy vô can.</span></div>
  <div class="kv"><span class="k">total ≫ ttfb</span><span class="v">Thân phản hồi truyền chậm: gói dữ liệu khổng lồ, máy khách chậm, hoặc băng thông bị bóp. Hãy nhìn kích thước phản hồi trước khi đổ lỗi cho máy chủ.</span></div>
</div>
<pre><code><span class="tok-comment"># Ứng dụng đang chờ ở đâu? Hãy nhìn các kết nối của nó, đừng nhìn CPU</span>
ss -tanp state established | grep -c 5432          <span class="tok-comment"># số kết nối DB đang mở</span>
ss -tanp state established '( dport = :443 )' | head <span class="tok-comment"># lời gọi API ra ngoài đang bay</span>
ss -lnt | head -5                                   <span class="tok-comment"># hàng đợi nhận kết nối</span></code></pre>
<div class="out">$ ss -tanp state established | grep -c 5432
100
$ ss -lnt | head -3
State  Recv-Q Send-Q Local Address:Port
LISTEN 511    511          0.0.0.0:3000
LISTEN 0      511          0.0.0.0:80</div>
<p>Đúng 100 kết nối cơ sở dữ liệu — một con số tròn đáng ngờ, nghĩa là nó là trần của một bể kết nối đã cấu hình, không phải trùng hợp. Và <code>Recv-Q 511</code> bằng đúng <code>Send-Q 511</code> ở cổng 3000 nghĩa là hàng đợi nhận kết nối đã đầy hoàn toàn: kết nối mới đang xếp hàng trong nhân trong khi mọi worker đều chờ một kết nối cơ sở dữ liệu sẽ không bao giờ tới. Cái máy rảnh rỗi vì nó đang bế tắc ở một cái bể, và bao nhiêu CPU hay RAM cũng không giúp được.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Chẻ request ra</span><span class="lz-t">curl -w với các mốc thời gian</span><span class="lz-d">DNS, connect, TLS, TTFB, total. Một câu lệnh nói cho bạn biết tầng nào trong năm tầng đang giữ độ trễ.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Xác nhận cái máy vô can</span><span class="lz-t">load, %wa, bộ nhớ available, %util</span><span class="lz-d">Nếu cả bốn đều êm ả trong khi request chậm thì thôi đừng nhìn hệ điều hành nữa. Bạn đang gỡ lỗi việc CHỜ, không phải tài nguyên.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Nhìn xem nó đang chờ CÁI GÌ</span><span class="lz-t">ss -tanp state established</span><span class="lz-d">Đếm số kết nối theo từng cổng đích. Một con số tròn là trần của bể; một con số tăng dần là chỗ rò; con số 0 tới cơ sở dữ liệu thì tự nó đã là câu trả lời.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm cái hàng đợi phía trước</span><span class="lz-t">ss -lnt · số kết nối đang hoạt động của nginx</span><span class="lz-d">Hàng đợi nhận kết nối đầy nghĩa là triệu chứng nằm ở tầng SAU cái chỗ mà người dùng cảm nhận nó.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Bấm giờ thẳng cái thứ phụ thuộc</span><span class="lz-t">psql -c '\\timing' · curl thẳng cái API bên trên</span><span class="lz-d">Cắt ứng dụng của bạn ra khỏi vòng lặp. Nếu cơ sở dữ liệu trả lời trong 4 giây ngay từ shell thì cuộc điều tra đã chuyển chỗ và ứng dụng của bạn chưa từng là vấn đề.</span></div>
</div>

<h3>Đọc vmstat, từng cột một</h3>
<p><code>vmstat 1 5</code> cho nhiều thông tin nhất trên mỗi phím gõ ở một máy Linux, và nó không đọc nổi cho tới khi có ai dắt bạn qua một lần. Đây là một lần chạy thật trong phòng thí nghiệm lúc bốn tiến trình <code>dd</code> đang ghi với <code>oflag=direct,dsync</code> (dòng đầu là trung bình kể từ lúc khởi động — luôn bỏ qua nó):</p>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 2  1 437832 401068 1565936 3471760    6    8    75   318 1131    1  0  0 99  0  0  0
 5  0 437832 400060 1572788 3471764    0    0     0 49532 24482 29865 10  7 66 17  0  0
 2  1 437832 395524 1579384 3471768    0    0     0 46968 24054 28398 10  7 67 16  0  0
 1  3 437832 390988 1584160 3471768    0    0     0 35828 18969 21948 10  6 67 17  0  0</div>
<table>
<tr><th>Cột</th><th>Nghĩa</th><th>Đáng lo khi…</th></tr>
<tr><td><code>r</code></td><td>runnable: đang chạy hoặc đang chờ CPU</td><td>liên tục lớn hơn <code>nproc</code></td></tr>
<tr><td><code>b</code></td><td>bị chặn trong giấc ngủ không ngắt được (trạng thái <code>D</code>), gần như luôn là chờ I/O</td><td>khác 0 ở mọi giây</td></tr>
<tr><td><code>swpd</code> · <code>free</code> · <code>buff</code> · <code>cache</code></td><td>KiB swap đã dùng, RAM rảnh, buffer, bộ đệm trang</td><td>đừng xét riêng — xem <code>si</code>/<code>so</code></td></tr>
<tr><td><code>si</code> · <code>so</code></td><td>KiB/giây tráo vào từ đĩa / tráo ra đĩa</td><td>khác 0 quá vài giây = đang quằn quại (thrashing)</td></tr>
<tr><td><code>bi</code> · <code>bo</code></td><td>khối/giây đọc từ đĩa / ghi ra đĩa</td><td><code>bo</code> cao kèm <code>wa</code> cao: đi tìm kẻ đang ghi</td></tr>
<tr><td><code>in</code> · <code>cs</code></td><td>số ngắt và số lần chuyển ngữ cảnh mỗi giây</td><td>nhảy vọt: hàng loạt syscall nhỏ, tranh khoá</td></tr>
<tr><td><code>us</code> · <code>sy</code> · <code>id</code> · <code>wa</code></td><td>% CPU cho mã người dùng, cho nhân, rảnh, rảnh-vì-chờ-I/O</td><td><code>us</code>+<code>sy</code> gần 100 = CPU; <code>wa</code> trên ~10 = đĩa</td></tr>
<tr><td><code>st</code></td><td>steal: thời gian trình ảo hoá đưa vCPU của bạn cho máy khách khác</td><td>trên ~10 ở VPS: hàng xóm ồn ào, không phải mã của bạn</td></tr>
<tr><td><code>gu</code></td><td>thời gian chạy máy ảo khách (mới có ở procps-ng 4)</td><td>chỉ quan trọng nếu máy này chứa máy ảo</td></tr>
</table>
<p>Ở đây: rảnh 66%, <code>wa</code> 17%, <code>b</code> lên tới 3, <code>bo</code> ~45 MB/s — "CPU đang chờ cái đĩa", trong một dòng. Dòng tiêu đề <code>%Cpu(s)</code> của <code>top</code> dùng cùng các chữ viết tắt, thêm <code>ni</code> (mã người dùng đã hạ ưu tiên), <code>hi</code> và <code>si</code> (ngắt phần cứng và ngắt mềm — để ý <code>si</code> trong <code>top</code> và trong <code>vmstat</code> là hai thứ khác nhau).</p>

<h3>Chạy thử từng bước: đĩa đầy, đĩa chỉ TRÔNG đầy, và một cái máy rảnh mà chậm</h3>
<p>Cả ba được dựng lại trong một container Ubuntu 24.04 khởi động với hai ổ RAM nhỏ, để "đầy" chỉ tốn vài giây và không có gì thật bị đe doạ:</p>
<pre><code class="language-bash">docker run -d --name lx12-u --memory 512m \\
  --tmpfs /day:size=40m --tmpfs /inode:size=40m,nr_inodes=2000 ubuntu:24.04 sleep infinity</code></pre>
<p><strong>1 · Đã xoá mà vẫn mở.</strong> Một tiến trình Python nối các khối 64 KB vào <code>/day/logs/app.log</code> và giữ file mở, giống một app Node có luồng ghi log:</p>
<div class="out">$ df -h /day
tmpfs            40M   40M     0 100% /day
$ echo "test" &gt; /day/new.txt
bash: line 1: echo: write error: No space left on device
$ rm /day/logs/app.log
$ df -h /day
tmpfs            40M   40M     0 100% /day
$ du -sh /day
0	/day
$ lsof -nP +L1
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 3682 root    3w   REG  0,113 41943040     0   11 /day/logs/app.log (deleted)
$ : &gt; /proc/3682/fd/3
$ df -h /day
tmpfs            40M   68K   40M   1% /day</div>
<p><code>du</code> cộng dồn những cái TÊN nó tìm được; <code>df</code> hỏi hệ thống file có bao nhiêu khối đã cấp. Sau <code>rm</code>, cái tên biến mất (<code>NLINK 0</code>) nhưng bộ mô tả file đang mở vẫn giữ các khối, nên hai lệnh cãi nhau — và chính sự cãi nhau đó là chẩn đoán. Cắt cụt qua <code>/proc/PID/fd/N</code> giải phóng chỗ mà không phải khởi động lại kẻ đang ghi; khởi động lại nó cũng được.</p>
<p><strong>2 · Hết inode, chứ không hết byte.</strong> Một vòng lặp tạo file phiên rỗng cho tới khi hệ thống file từ chối:</p>
<div class="out">$ echo hello &gt; /inode/report.txt
bash: line 1: /inode/report.txt: No space left on device
$ df -h /inode
tmpfs            40M     0   40M   0% /inode
$ df -i /inode
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000  2000     0  100% /inode
$ find /inode -xdev -type f | cut -d/ -f1-3 | sort | uniq -c | sort -rn | head -3
   1998 /inode/sessions</div>
<p>Không dùng byte nào, vậy mà vẫn "No space left on device". File nào dù nhỏ tới đâu cũng cần một inode; dòng <code>find | cut | uniq -c</code> đếm số file theo thư mục cấp một và gọi tên thủ phạm trong một lượt.</p>
<p><strong>3 · Rảnh mà chậm: hàng chờ accept đầy.</strong> Một app Python một luồng (backlog 5) trả lời <code>/slow</code> trong 3 giây và <code>/</code> tức thì. Mười lăm request vào <code>/slow</code> tới cùng lúc:</p>
<div class="out">$ curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\\n' http://127.0.0.1:19125/slow
dns=0.000997 connect=0.001589 ttfb=3.691853 total=3.695036
$ ss -lnt 'sport = :19125'
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 6      5          127.0.0.1:19125      0.0.0.0:*
$ ss -tan state syn-sent '( dport = :19125 )' | tail -n +2 | wc -l
8
$ top -b -n1 | sed -n 3p
%Cpu(s): 10.2 us,  0.9 sy,  0.0 ni, 88.0 id,  0.0 wa,  0.0 hi,  0.9 si,  0.0 st
$ curl -sS -o /dev/null -w 'connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\\n' -m 60 http://127.0.0.1:19125/
connect=7.199762 ttfb=24.818435 total=24.818498</div>
<p>Cái endpoint trả lời trong không mili giây đã tốn <strong>24,8 giây</strong>, trên một cái máy rảnh 88%. <code>Recv-Q 6</code> vượt <code>Send-Q 5</code> nghĩa là hàng chờ accept của nhân đã quá giới hạn; thêm tám máy khách kẹt ở <code>SYN-SENT</code>, vẫn đang chờ bắt tay — vì thế riêng <code>connect</code> đã mất 7,2 giây. Không thứ nào ở đây hiện lên biểu đồ CPU, bộ nhớ hay đĩa. Cách chữa là thêm worker hoặc làm <code>/slow</code> nhanh lên, không bao giờ là thuê máy to hơn.</p>

<h3>Bảng cờ: các lệnh của bài này</h3>
<table>
<tr><th>Lệnh và cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>vmstat N SỐ-LẦN</code></td><td>mỗi N giây một dòng, SỐ-LẦN lần; bỏ qua dòng 1</td><td><code>vmstat 1 5</code></td></tr>
<tr><td><code>iostat -x -z N</code></td><td>cột mở rộng, ẩn thiết bị đang rảnh (gói <code>sysstat</code>)</td><td><code>iostat -xz 1 3</code></td></tr>
<tr><td><code>top -b -n1</code></td><td>chế độ lô, một vòng — để dùng trong script và dán đi</td><td><code>top -b -n1 | head -15</code></td></tr>
<tr><td><code>top -H -p PID</code></td><td>các luồng của một tiến trình</td><td><code>top -H -b -n1 -p 41288</code></td></tr>
<tr><td><code>ps -eo … --sort=-KHOÁ --no-headers</code></td><td>chọn cột, sắp giảm dần, bỏ dòng tiêu đề</td><td><code>ps -eo pid,rss,cmd --sort=-rss --no-headers</code></td></tr>
<tr><td><code>ps -o etimes=,times=</code></td><td>giây đồng hồ so với giây CPU, không tiêu đề</td><td><code>ps -o etimes=,times= -p 41288</code></td></tr>
<tr><td><code>free -h</code></td><td>đơn vị dễ đọc; đọc cột <code>available</code></td><td><code>free -h</code></td></tr>
<tr><td><code>df -h</code> · <code>df -i</code></td><td>byte · inode của từng hệ thống file</td><td><code>df -i /var</code></td></tr>
<tr><td><code>du -x -h -d1</code></td><td>chỉ trong một hệ thống file, đơn vị dễ đọc, sâu một cấp</td><td><code>du -xh -d1 / | sort -rh | head</code></td></tr>
<tr><td><code>lsof -nP +L1</code></td><td>file đang mở có số liên kết dưới 1 (đã xoá mà còn mở)</td><td><code>lsof -nP +L1 | awk '\$7 &gt; 1e9'</code></td></tr>
<tr><td><code>ss -lnt</code></td><td>socket TCP đang nghe: <code>Recv-Q</code> = đang chờ được accept, <code>Send-Q</code> = trần backlog</td><td><code>ss -lnt 'sport = :3000'</code></td></tr>
</table>

<h3>Trên macOS và WSL khác gì</h3>
<p>macOS không có <code>free</code>, <code>vmstat</code> lẫn <code>/proc</code>. Thứ tương đương, đo trên chiếc Mac dùng soạn khoá này: <code>vm_stat</code> in số trang thô (<code>page size of 16384 bytes</code>, nên nhân với 16 KB), <code>memory_pressure</code> kết thúc bằng đúng một dòng có ích (<code>System-wide memory free percentage: 39%</code>), và <code>top -l 2 -o cpu</code> liệt kê các tiến trình bận nhất — dùng hai mẫu, vì ở mẫu đầu mọi tiến trình đều hiện <code>0.0</code>. <code>iostat</code> có, nhưng là bản BSD, cho KB/t, tps và MB/s từng đĩa thay vì <code>await</code> và <code>%util</code>. Load average thì hoàn toàn không so được: chiếc Mac này báo <code>462.70 516.08 651.62</code> trên 10 nhân trong khi <code>top</code> cho thấy CPU còn rảnh 34%. Trên WSL2, mọi thứ trong bài chạy như Ubuntu, nhưng <code>free</code> và <code>vmstat</code> mô tả máy ảo WSL, mà trần bộ nhớ của nó đặt trong <code>.wslconfig</code> phía Windows — một máy Windows 16 GB vẫn có thể OOM bên trong WSL.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ổ chứa log của nhóm "lại đầy", nhưng <code>du</code> thề là nó trống. Dựng lại đúng cái bẫy đó và thoát ra mà không khởi động lại thứ gì.</p><ol>
<li><code>docker run -d --name lab123 --tmpfs /data:size=20m ubuntu:24.04 sleep infinity</code>; bên trong, <code>apt-get update &amp;&amp; apt-get install -y lsof procps</code>.</li>
<li>Chạy một kẻ ghi giữ file mở ở bộ mô tả số 3 (một subshell không bao giờ đóng nó — giống app Node có luồng ghi log): <code>( exec 3&gt;&gt;/data/app.log; while :; do head -c 65536 /dev/zero &gt;&amp;3 2&gt;/dev/null; sleep 0.01; done ) &amp;</code> — chờ tới khi <code>df -h /data</code> báo 100%.</li>
<li><code>rm /data/app.log</code>, rồi chỉ ra rằng <code>df</code> và <code>du -sh /data</code> cãi nhau.</li>
<li>Tìm file bằng <code>lsof -nP +L1</code> và giải phóng chỗ qua <code>/proc/PID/fd/N</code>.</li>
<li>Chứng minh kẻ ghi vẫn còn sống (<code>ps -o pid,stat,cmd -p PID</code>) và việc ghi đã chạy lại được: <code>echo test &gt; /data/new.txt</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>lsof +L1</code> hiện <code>(deleted)</code> với <code>NLINK 0</code>, <code>df -h /data</code> tụt về khoảng 1% <em>trong khi kẻ ghi vẫn đang chạy</em> (tmpfs nằm trong RAM, nên đừng chờ cột <code>bo</code> của <code>vmstat</code> nhúc nhích ở đây). Dọn bằng <code>docker rm -f lab123</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load average (tải trung bình)</span><span class="v">Số tác vụ trung bình đang chạy hoặc đang chờ (hàng CPU + ngủ không ngắt được) trong 1, 5 và 15 phút.</span></div>
  <div class="kv"><span class="k">D state (trạng thái D)</span><span class="v">Ngủ không ngắt được — đang chờ bên trong nhân, thường là chờ I/O; không giết được trong lúc đó.</span></div>
  <div class="kv"><span class="k">I/O wait — <code>wa</code> (chờ I/O)</span><span class="v">Thời gian CPU rảnh vì mọi tác vụ chạy được đều đang chờ đĩa.</span></div>
  <div class="kv"><span class="k">PSI (thông tin nghẽn do sức ép)</span><span class="v">Tỉ lệ thời gian các tác vụ bị kẹt vì CPU, bộ nhớ hay I/O.</span></div>
  <div class="kv"><span class="k">Page cache (bộ đệm trang)</span><span class="v">RAM rảnh dùng để đệm file; trả lại ngay khi cần, nên phải đọc <code>available</code>, không đọc <code>free</code>.</span></div>
  <div class="kv"><span class="k">Thrashing (quằn quại tráo trang)</span><span class="v">Tráo vào tráo ra liên tục; máy dành thời gian chuyển bộ nhớ thay vì làm việc.</span></div>
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Bản ghi mà file nào cũng cần dù nhỏ tới đâu; hệ thống file có thể hết inode trước khi hết byte.</span></div>
  <div class="kv"><span class="k">Accept queue / backlog (hàng chờ accept)</span><span class="v">Kết nối nhân đã bắt tay xong mà app chưa nhận; đầy thì máy khách mới phải chờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Load average đếm cả tác vụ chạy được LẪN tác vụ ở trạng thái D; so với <code>nproc</code> và xem <code>wa</code> hoặc <code>/proc/pressure/io</code> trước khi đổ cho CPU.</li>
<li>Một luồng 100% chỉ hiện thành 10% trên máy 10 nhân; <code>top -H</code> và <code>etimes</code> so với <code>times</code> lật tẩy nó.</li>
<li><code>vmstat 1 5</code>: <code>r</code> cho CPU, <code>b</code>/<code>wa</code> cho đĩa, <code>si</code>/<code>so</code> cho bộ nhớ, <code>st</code> cho hàng xóm ồn ào trên VPS.</li>
<li>Đọc <code>available</code>, đừng đọc <code>free</code>; nạn nhân của kẻ giết OOM không nói gì — log của nhân thì có.</li>
<li><code>df</code> đầy mà <code>du</code> nhỏ ⇒ <code>lsof +L1</code>; "No space" mà còn byte ⇒ <code>df -i</code>.</li>
<li>Rảnh mà chậm là đang CHỜ: tách request bằng <code>curl -w</code> và tìm <code>Recv-Q</code> chạm <code>Send-Q</code>.</li>
</ul>
<a class="link-card" href="https://docs.kernel.org/accounting/psi.html" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">PSI — Pressure Stall Information</span><span class="lc-sub">Tài liệu nhân cho <code>/proc/pressure/*</code>. Nó trả lời "mất bao nhiêu thời gian để chờ CPU / IO / bộ nhớ", điều mà load average không làm được. Ít người dùng và có sẵn trên mọi nhân hiện đại.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Load average của Linux: giải mã bí ẩn</span><span class="lc-sub">Vì sao Linux tính cả giấc ngủ không ngắt được vào load còn các dòng Unix khác thì không — kèm cả bản vá năm 1993 đã làm chuyện đó. Đây là bài viết khiến con số ấy cuối cùng cũng có nghĩa.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/iostat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">💽</span>
  <span class="lc-body"><span class="lc-title">iostat(1) — giải thích từng cột</span><span class="lc-sub"><code>await</code>, <code>aqu-sz</code> và <code>%util</code> thật ra đo cái gì, và vì sao riêng <code>%util</code> thì gây hiểu nhầm trên SSD và trên ổ đĩa ảo hoá.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: bốn cái máy chậm</span><span class="lc-sub">Bài chấm điểm: phân tách nghẽn-CPU với nghẽn-I/O với trạng thái D chỉ bằng <code>vmstat</code>, đọc một bản chẻ pha của <code>curl -w</code> và gọi tên tầng có tội, và nhận ra cái bể kết nối đã cạn chỉ từ output của <code>ss</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tối ưu cái bạn NHÌN THẤY thay vì cái đang chậm. Một CPU ở mức 60% trong một request tám giây không phải nguyên nhân — đó là thứ cái máy làm trong lúc chờ. Trước khi tinh chỉnh bất cứ thứ gì, hãy lấy bản chẻ pha từ <code>curl -w</code> và xác nhận tầng nào đang giữ thời gian. Phần lớn sự cố "máy chủ chậm" kết thúc ở một truy vấn cơ sở dữ liệu, một API bên trên, hoặc một bể kết nối, và mỗi giờ bỏ ra chỉnh tham số nhân trước là một giờ nguyên nhân thật vẫn đang chạy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Load average không phải CPU — hãy đọc <code>/proc/pressure</code> hoặc cột <code>%wa</code> để biết cái máy đang TÍNH hay đang CHỜ. Hãy đọc <code>available</code>, đừng đọc <code>free</code>: bộ đệm trang không phải bộ nhớ bạn đã mất, và chữ ký thật của rắc rối bộ nhớ là <code>si</code>/<code>so</code> khác 0 liên tục trong <code>vmstat</code>. Và khi chẳng có gì bận mà mọi thứ đều chậm, hãy thôi nhìn tài nguyên và bắt đầu ĐẾM KẾT NỐI — câu trả lời gần như luôn là một thứ cái máy đang chờ, chứ không phải một thứ nó đang làm.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Cookbook: it is weird|||12.4 — Sách công thức: nó lạ',
      slug: 'lnx-12-4-no-la',
      type: 'LESSON',
      description: 'Permission denied mà quyền vẫn đúng, command not found với file có thật, bản dựng cũ trả 404, chứng chỉ TLS và lệch đồng hồ, DNS chạy bằng IP mà không chạy bằng tên, và "máy tôi chạy được".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Cookbook: it is weird</h2>
<p class="lead">The failures in this lesson share one property: the obvious explanation is wrong. The permissions are correct and it still says denied. The file exists and the shell says not found. The code is deployed and the old behaviour persists. Six recipes for the bugs that make people distrust the machine.</p>

<h3>Recipe 1 — "Permission denied" with correct permissions</h3>
${slide('lx-12', 21, 'namei -l: thủ phạm ở thư mục cha')}
<pre><code class="language-bash">ls -l /srv/app/run.sh
namei -l /srv/app/run.sh          <span class="tok-comment"># EVERY component of the path, with modes</span>
findmnt -T /srv/app               <span class="tok-comment"># mount options for this path</span>
sudo dmesg -T | grep -iE 'apparmor|audit|denied' | tail -5</code></pre>
<div class="out">$ ls -l /srv/app/run.sh
-rwxr-xr-x 1 deploy deploy 412 Aug 22 14:05 /srv/app/run.sh
$ namei -l /srv/app/run.sh
f: /srv/app/run.sh
drwxr-xr-x root  root  /
drwxr-x--- root  root  srv
drwxr-xr-x deploy deploy app
-rwxr-xr-x deploy deploy run.sh</div>
<p>The file is world-executable and the failure is two levels up: <code>/srv</code> is <code>drwxr-x---</code> owned by <code>root:root</code>, so a user who is not root and not in group <code>root</code> cannot traverse into it (Lesson 4.1). <code>ls -l</code> on the file can never show you this; <code>namei -l</code> shows the whole chain at once and is the fastest permission tool on the machine.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A parent directory lacks <code>x</code></span><span class="v">The classic. Every directory in the path needs the execute bit for the user to pass through it. <code>namei -l</code> finds it in one command.</span></div>
  <div class="kv"><span class="k">Mounted <code>noexec</code></span><span class="v"><code>findmnt -T</code> shows the options. Scripts under <code>/tmp</code> or <code>/home</code> on a hardened server frequently cannot be executed at all, regardless of mode bits.</span></div>
  <div class="kv"><span class="k">Mounted read-only</span><span class="v">A filesystem remounts read-only after an I/O error. Writes fail with <code>EROFS</code>, which many programs report as a permission problem. Check <code>dmesg -T</code> for the error that caused it.</span></div>
  <div class="kv"><span class="k">systemd sandboxing</span><span class="v"><code>ProtectSystem=strict</code>, <code>ProtectHome=</code>, <code>ReadWritePaths=</code> — the service sees a different filesystem than your shell does (Lesson 11.1). Exit code 226/NAMESPACE, or plain <code>EACCES</code> at runtime.</span></div>
  <div class="kv"><span class="k">AppArmor</span><span class="v">Ubuntu's default MAC layer. <code>dmesg</code> shows <code>apparmor="DENIED"</code> with the profile name. It applies to specific programs — <code>mysqld</code>, <code>nginx</code>, snaps — and is invisible to <code>ls</code>.</span></div>
  <div class="kv"><span class="k">Immutable attribute</span><span class="v"><code>lsattr file</code> showing <code>----i---------</code> means even root cannot modify it until <code>chattr -i</code>. Rare, memorable, and it makes people question reality for twenty minutes.</span></div>
</div>

<h3>Recipe 2 — "command not found" for a file that exists</h3>
${slide('lx-12', 22, 'CRLF trong shebang và mã 126/127')}
<pre><code class="language-bash">ls -l ./deploy.sh &amp;&amp; ./deploy.sh
file ./deploy.sh
head -c 40 ./deploy.sh | cat -A | head -2       <span class="tok-comment"># -A shows \\r as ^M</span>
ldd \$(command -v node) | grep 'not found'</code></pre>
<div class="out">$ ./deploy.sh
bash: ./deploy.sh: cannot execute: required file not found
$ head -c 40 ./deploy.sh | cat -A | head -1
#!/bin/bash^M\$</div>
<p>The shebang line ends in <code>^M</code> — a carriage return, from a file edited on Windows or checked out with the wrong git line-ending setting. The kernel dutifully looks for an interpreter literally named <code>/bin/bash\\r</code>, does not find it, and reports "required file not found" while pointing at your script. The error names the script; the missing file is the interpreter.</p>
<pre><code class="language-bash">sed -i 's/\\r\$//' ./deploy.sh          <span class="tok-comment"># or: dos2unix ./deploy.sh</span>
file ./deploy.sh</code></pre>
<div class="out">./deploy.sh: Bourne-Again shell script, ASCII text executable</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CRLF in the shebang</span><span class="v">"cannot execute: required file not found" on a file you can see. <code>cat -A</code> proves it in one line.</span></div>
  <div class="kv"><span class="k">Wrong architecture</span><span class="v"><code>file</code> says <code>ARM aarch64</code> on an x86 machine. Common with binaries built on an Apple Silicon laptop and copied to a VPS.</span></div>
  <div class="kv"><span class="k">Missing shared library</span><span class="v"><code>ldd</code> prints <code>=&gt; not found</code>. The binary exists and cannot start. Install the package, or you built against a libc the target does not have — the musl/glibc trap from this project's own deploy history.</span></div>
  <div class="kv"><span class="k">Not on PATH at all</span><span class="v">The boring answer, and still the most common. <code>command -v x</code>, then <code>echo "\$PATH" | tr ':' '\\n'</code> (Lesson 8.1). Remember that <code>sudo</code> and cron have different PATHs than you do.</span></div>
  <div class="kv"><span class="k">A stale shell hash</span><span class="v">You moved a binary and bash still remembers the old location. <code>hash -r</code> clears it. Symptom: the error names a path that no longer exists.</span></div>
</div>

<h3>Recipe 3 — the code is deployed and the old behaviour persists</h3>
${slide('lx-12', 23, 'Tiến trình vẫn đứng trong bản cũ')}
<p>A route returns 404 after you added it; a fix does not appear; a bug you deleted still happens. In every case, the question is not "is the code right" but <strong>"is this process running the code I think it is?"</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Is the route mounted at all? 401/200 = live, 404 = stale build</span>
curl -s -o /dev/null -w '%{http_code}\\n' https://example.com/api/v1/reports

<span class="tok-comment"># What is the running process actually executing?</span>
pgrep -af 'node|python' | head
sudo ls -l /proc/41288/cwd /proc/41288/exe
sudo stat -c '%y %n' /srv/app/dist/index.js
ps -o lstart= -p 41288                         <span class="tok-comment"># when did it start?</span></code></pre>
<div class="out">404
41288 node /srv/app/dist/index.js
lrwxrwxrwx 1 deploy deploy 0 Aug 22 19:52 /proc/41288/cwd -> /srv/releases/2026-08-19
2026-08-22 14:05:11.000000000 +0000 /srv/app/dist/index.js
Mon Aug 19 09:12:44 2026</div>
<p>Three facts and the mystery is over: the build on disk is from 22 August, the process started on 19 August, and its working directory is an old release directory. The deploy copied new files and nobody restarted the service. The code is correct and irrelevant.</p>
<div class="callout ok"><strong>Diagnose "is it live?" with an unauthenticated <code>curl</code>, never with the browser.</strong> <strong>401</strong> means the route is mounted and wants auth. <strong>200</strong> means mounted and public. <strong>404</strong> means the route does not exist in the running process — a stale or partial build. The browser adds caches, service workers and cookies to a question that has a one-word answer, and this project's own history includes a day lost to "the GIF picker is broken" that was a stale <code>dist/index.js</code> not mounting a route.</div>
<div class="pitfall"><strong>Pitfall:</strong> a static asset server that indexed its files at startup. Next.js decides what exists under <code>public/</code> when the <em>server process starts</em>; rebuild the assets while it runs and it returns 404 for files that are visibly on disk — no error, no log line, just a page that never finishes loading because its JavaScript never arrives. Anything under <code>public/</code> changing means restarting the server. And kill it by PORT (<code>lsof -ti:3000 | xargs -r kill -9</code>), because Node renames its own process to <code>next-server</code> and every <code>pkill -f</code> pattern you would naturally try silently matches nothing.</div>

<h3>Recipe 4 — TLS and the clock</h3>
${slide('lx-12', 24, 'Lỗi chứng chỉ = lỗi đồng hồ máy khách')}
<pre><code class="language-bash">curl -vI https://example.com 2&gt;&amp;1 | grep -E 'expire|subject|issuer|SSL'
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject -issuer
timedatectl | head -4</code></pre>
<div class="out">notBefore=Aug  9 00:00:00 2026 GMT
notAfter=Nov  7 23:59:59 2026 GMT
subject=CN = example.com
issuer=C = US, O = Let's Encrypt, CN = R11</div>
<div class="kv-grid">
  <div class="kv"><span class="k">certificate has expired</span><span class="v">Check <code>notAfter</code> against the real date. Then check the renewal timer that should have prevented it: <code>systemctl list-timers | grep certbot</code> (Lesson 11.2). An expired certificate is nearly always a broken renewal job, not a certificate problem.</span></div>
  <div class="kv"><span class="k">certificate is not yet valid</span><span class="v">Almost never the certificate — it is the CLIENT's clock. A container or VM with a wrong date rejects perfectly good certificates. <code>timedatectl</code> on the machine doing the complaining.</span></div>
  <div class="kv"><span class="k">unable to get local issuer certificate</span><span class="v">The chain is incomplete: the server is serving the leaf without its intermediate. Browsers often paper over this by caching intermediates; <code>curl</code> and your backend do not, which is why "it works in Chrome" is not a test.</span></div>
  <div class="kv"><span class="k">hostname mismatch</span><span class="v">Compare <code>subject</code>/SAN with the name you requested. Usually the wrong vhost answered — pass <code>-servername</code> to <code>openssl s_client</code>, or you will test the default certificate instead of the one you meant.</span></div>
  <div class="kv"><span class="k">Works with curl, fails in the app</span><span class="v">Different trust store. Node has its own CA bundle; a container may have none installed at all (<code>ca-certificates</code>). The system trusting a certificate does not mean your runtime does.</span></div>
  <div class="kv"><span class="k">JWTs "expired" immediately</span><span class="v">Clock skew again. A machine minutes ahead issues tokens that another machine considers already dead. Fix NTP (Lesson 11.3), not the token lifetime.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Days until expiry, as one number — worth putting in a monitor</span>
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2 \\
  | { read d; echo \$(( (\$(date -d "\$d" +%s) - \$(date +%s)) / 86400 )) days; }</code></pre>
<div class="out">77 days</div>

<h3>Recipe 5 — works by IP, not by name</h3>
<pre><code class="language-bash">dig +short api.example.com
dig +short api.example.com @1.1.1.1        <span class="tok-comment"># bypass the local resolver</span>
cat /etc/resolv.conf; cat /etc/hosts
getent hosts api.example.com               <span class="tok-comment"># what the SYSTEM resolves, not just DNS</span>
resolvectl status | head -20</code></pre>
<div class="out">$ dig +short api.example.com
10.0.0.9
$ dig +short api.example.com @1.1.1.1
203.0.113.44
$ getent hosts api.example.com
10.0.0.9        api.example.com</div>
<p>Two different answers for the same name. The local resolver returns a private address that a public resolver does not know about — either a deliberate split-horizon setup, a leftover <code>/etc/hosts</code> entry from someone's testing, or a VPN's DNS. <code>getent hosts</code> is the important one: it follows <code>/etc/nsswitch.conf</code> exactly as your application will, including <code>/etc/hosts</code>, which <code>dig</code> ignores entirely.</p>
<div class="callout"><strong><code>dig</code> and your app do not resolve names the same way.</strong> <code>dig</code> talks to a DNS server. Your application calls <code>getaddrinfo()</code>, which consults <code>/etc/hosts</code> first, then possibly mDNS, then DNS, in the order given by <code>/etc/nsswitch.conf</code>. When <code>dig</code> gives the right answer and the app still connects to the wrong place, the difference is a <code>hosts</code> entry — and <code>getent hosts</code> is the command that sees it.</div>

<h3>Recipe 6 — "but it works on my machine"</h3>
${slide('lx-12', 26, 'Sáu thứ khác nhau giữa hai máy')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Case sensitivity</span><span class="lz-lnote">macOS filesystems are case-INSENSITIVE by default; Linux is not. <code>import './Button'</code> resolving a file named <code>button.tsx</code> works locally and fails in the container. It is the single most common cause of "the build passed on my laptop".</span></div>
  <div class="lz-layer"><span class="lz-lname">Locale</span><span class="lz-lnote"><code>LANG</code> and <code>LC_ALL</code> change how <code>sort</code> orders, how <code>printf</code> formats decimals, and how some tools parse dates. Servers often run <code>C.UTF-8</code>; your terminal does not. Set <code>LC_ALL=C</code> in scripts that parse output (Lesson 8.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Timezone</span><span class="lz-lnote">Your machine is local time, the server is UTC. Every date-boundary bug, every "the report is empty" at the wrong hour, and every off-by-seven-hours cron (Lesson 11.2) starts here.</span></div>
  <div class="lz-layer"><span class="lz-lname">Environment variables</span><span class="lz-lnote">Your shell has fifty that the service does not — because systemd and cron read none of your startup files (Lesson 8.2). <code>systemctl show app -p Environment</code> shows what the service really gets.</span></div>
  <div class="lz-layer"><span class="lz-lname">Version drift</span><span class="lz-lnote">Node 22 locally, Node 18 in the image; a different OpenSSL; a different libc. <code>node -v</code>, <code>openssl version</code> and <code>ldd --version</code> in BOTH places, side by side.</span></div>
  <div class="lz-layer"><span class="lz-lname">Files git does not carry</span><span class="lz-lnote"><code>.env</code>, generated clients, symlinks, an <code>uploads/</code> directory that exists only on your disk. <code>git status --ignored</code> shows what your working copy has that a fresh clone would not.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Run this on both machines and diff the output — twenty seconds, ends most arguments</span>
{ uname -srm; . /etc/os-release 2&gt;/dev/null &amp;&amp; echo "\$PRETTY_NAME"
  node -v 2&gt;/dev/null; npm -v 2&gt;/dev/null; openssl version
  echo "TZ=\$(timedatectl show -p Timezone --value 2&gt;/dev/null)"
  echo "LANG=\$LANG LC_ALL=\$LC_ALL"; locale charmap
  echo "case-sensitive: \$(touch /tmp/A_ 2&gt;/dev/null; [ -e /tmp/a_ ] &amp;&amp; echo NO || echo YES; rm -f /tmp/A_)"
} 2&gt;&amp;1</code></pre>
<div class="out">Linux 6.8.0-45-generic x86_64
Ubuntu 24.04.1 LTS
v22.11.0
10.9.0
OpenSSL 3.0.13 30 Jan 2024
TZ=Etc/UTC
LANG=C.UTF-8 LC_ALL=
UTF-8
case-sensitive: YES</div>

<h3>Recipe 7 — a pile of &lt;defunct&gt; processes that <code>kill -9</code> cannot remove</h3>
${slide('lx-12', 25, 'Zombie: sửa ở tiến trình cha, hoặc --init')}
<p>Chapter 5 explained what a zombie is: a process that has exited but whose parent has not yet collected its exit code with <code>wait()</code>. The diagnostic question is different — you meet them as a symptom. While this chapter's lab was being built, zombies appeared on their own, which makes them a perfect real example:</p>
<pre><code class="language-bash">ps -eo stat,pid,ppid,etime,cmd | awk 'NR==1 || \$1 ~ /^Z/'
ps -o pid,cmd -p 1
kill -9 3630; ps -o stat,pid,cmd -p 3630
grep -E '^(State|PPid)' /proc/3630/status</code></pre>
<div class="out">STAT     PID    PPID     ELAPSED CMD
Z       3630       1       04:10 [python3] &lt;defunct&gt;
Z       3664       1       03:46 [python3] &lt;defunct&gt;
Z       3682       1       03:36 [python3] &lt;defunct&gt;
    PID CMD
      1 sleep infinity
STAT     PID CMD
Z       3630 [python3] &lt;defunct&gt;
State:	Z (zombie)
PPid:	1</div>
<p>Read it as a chain. The three dead Python writers (from the disk-full experiment in Lesson 12.3) were started by a shell script that has since exited, so they were re-parented to PID 1. On a normal machine PID 1 is systemd, which reaps orphans immediately. In this container PID 1 was <code>sleep infinity</code> — a program that never calls <code>wait()</code> — so the zombies stay forever. <code>kill -9</code> does nothing because there is no process left to kill; only the parent can clear the entry.</p>
<table>
<tr><th>You see</th><th>It means</th><th>Do this</th></tr>
<tr><td>a few <code>Z</code> with a live parent that is not PID 1</td><td>the parent is slow to reap or buggy</td><td>usually harmless; restart or fix the parent (<code>wait()</code>, a <code>SIGCHLD</code> handler)</td></tr>
<tr><td>the count keeps growing</td><td>a parent spawns children and never reaps them</td><td>find it with the PPID column; fix it before the PID table (<code>/proc/sys/kernel/pid_max</code>) fills</td></tr>
<tr><td><code>Z</code> with PPID 1 inside a container</td><td>PID 1 is your app or <code>sleep</code>, not an init</td><td><code>docker run --init</code> or <code>init: true</code> in Compose</td></tr>
<tr><td>state <code>D</code>, not <code>Z</code></td><td>alive but stuck in the kernel (I/O)</td><td>Lesson 12.3 — the disk, NFS or a driver</td></tr>
</table>
<p>The container fix, measured with the same experiment in two fresh containers — one plain, one with <code>--init</code>, each starting a background <code>sleep</code> from a shell that exits and then killing it:</p>
<div class="out"># docker run … ubuntu:24.04 sleep infinity
      1 sleep infinity
STAT     PID    PPID CMD
Zs        11       1 [sleep] &lt;defunct&gt;
# docker run --init … ubuntu:24.04 sleep infinity
      1 /sbin/docker-init -- sleep infinity
STAT     PID    PPID CMD</div>
<p>With <code>--init</code>, Docker puts a tiny init (tini) at PID 1, and the zombie line simply never appears. A zombie costs one row in the process table and no memory or CPU — a handful is cosmetic, thousands will stop the machine from starting new processes.</p>

<h3>Try it step by step: three impossible bugs in five minutes</h3>
<p>All three were reproduced in the lab container (Ubuntu 24.04, util-linux 2.39.3, bash 5.2.21). As root inside a throwaway container:</p>
<pre><code class="language-bash">apt-get install -y file; useradd -m -s /bin/bash deploy; mkdir -p /srv/app
printf '#!/bin/bash\\necho "app ok"\\n' &gt; /srv/app/run.sh
chown -R deploy:deploy /srv/app; chmod 755 /srv/app/run.sh; chmod 750 /srv
su deploy -c /srv/app/run.sh; namei -l /srv/app/run.sh</code></pre>
<div class="out">bash: line 1: /srv/app/run.sh: Permission denied
f: /srv/app/run.sh
drwxr-xr-x root   root   /
drwxr-x--- root   root   srv
drwxr-xr-x deploy deploy app
-rwxr-xr-x deploy deploy run.sh</div>
<p>The file is <code>755</code> and owned by <code>deploy</code>; <code>/srv</code> is <code>750 root:root</code>, so <code>deploy</code> — neither the owner nor in group <code>root</code> — has no <code>x</code> on it and cannot pass through. <code>chmod 755 /srv</code> and the same command prints <code>app ok</code>. (<code>namei -m</code> shows the modes without owners if the line is too wide.)</p>
<pre><code>printf '#!/bin/bash\\r\\necho "deploying"\\r\\n' &gt; deploy.sh; chmod +x deploy.sh
./deploy.sh; echo "exit=\$?"
file deploy.sh
head -1 deploy.sh | od -c | head -2</code></pre>
<div class="out">bash: line 7: ./deploy.sh: cannot execute: required file not found
exit=127
deploy.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators
0000000   #   !   /   b   i   n   /   b   a   s   h  \\r  \\n
0000015</div>
<p><code>file</code> says it outright (<em>with CRLF line terminators</em>) and <code>od -c</code> shows the <code>\\r</code> byte by byte. Running it as <code>bash deploy.sh</code> skips the shebang and fails later, line by line: <code>cd: \$'/srv/app\\r': No such file or directory</code> and <code>\$'ls\\r': command not found</code> — that <code>\$'…\\r'</code> is bash showing you the invisible character. Which shell reports it matters too: with <code>useradd -m deploy</code> (no <code>-s</code>) the user's shell is <code>/bin/sh</code>, which is <code>dash</code> on Ubuntu, and the same CRLF script run through <code>su deploy -c</code> fails with just <code>sh: 1: /srv/app/deploy.sh: not found</code> — measured. Measured exit codes for the look-alikes:</p>
<table>
<tr><th>What you typed</th><th>Message</th><th>Exit</th></tr>
<tr><td>a command not on <code>PATH</code></td><td><code>khongcolenh: command not found</code></td><td>127</td></tr>
<tr><td>a path that does not exist</td><td><code>./khong-co.sh: No such file or directory</code></td><td>127</td></tr>
<tr><td>a file whose interpreter or loader does not exist (CRLF shebang; a glibc binary on musl Alpine)</td><td><code>cannot execute: required file not found</code></td><td>127</td></tr>
<tr><td>a file without <code>x</code>, or on a <code>noexec</code> mount</td><td><code>./noexec.sh: Permission denied</code></td><td>126</td></tr>
</table>
<p>Last, the stale process. A release is started from <code>/srv/releases/v1</code>, then the <code>current</code> symlink is switched to <code>v2</code> without a restart:</p>
<div class="out">$ ls -l /srv/app/current
lrwxrwxrwx 1 root root 16 Sep 28 15:28 /srv/app/current -&gt; /srv/releases/v2
$ ls -l /proc/4004/cwd
lrwxrwxrwx 1 root root 0 Sep 28 15:28 /proc/4004/cwd -&gt; /srv/releases/v1
$ ps -o pid,lstart,etime,cmd -p 4004
    PID                  STARTED     ELAPSED CMD
   4004 Mon Sep 28 15:28:28 2026       00:02 python3 app.py 0.0.0.0 19127</div>
<p>The symlink says v2, the process's working directory says v1, and its start time is earlier than the new file's <code>mtime</code> (<code>15:28:31</code>). A process resolves its paths when it starts; changing a symlink later changes nothing for it.</p>

<h3>Measured: the clock breaks TLS in both directions</h3>
<pre><code class="language-bash">apt-get install -y faketime            <span class="tok-comment"># fakes the time for ONE command</span>
faketime '2020-01-01' curl -sS -o /dev/null https://example.com/
faketime '2030-01-01' curl -sS -o /dev/null https://example.com/
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -checkend \$((30*86400)); echo "exit=\$?"</code></pre>
<div class="out">curl: (60) SSL certificate problem: certificate is not yet valid
curl: (60) SSL certificate problem: certificate has expired
Certificate will not expire
exit=0</div>
<p>The same valid certificate (<code>notBefore=Sep 26 2026</code>, <code>notAfter=Dec 25 2026</code>) is "not yet valid" to a client that thinks it is 2020 and "expired" to one that thinks it is 2030. Nothing about the server changed — which is the whole point of Recipe 4. <code>-checkend N</code> is the monitor-friendly form: exit 0 if the certificate is still valid N seconds from now, 1 if not.</p>

<h3>Flag table: the commands of this lesson</h3>
<table>
<tr><th>Command and flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>namei -l</code> / <code>-m</code></td><td>every path component with owner+mode / mode only</td><td><code>namei -l /srv/app/run.sh</code></td></tr>
<tr><td><code>findmnt -T PATH</code></td><td>the mount a path lives on, with its options</td><td><code>findmnt -T /tmp</code> → look for <code>noexec</code>, <code>ro</code></td></tr>
<tr><td><code>lsattr</code> / <code>chattr -i</code></td><td>show / clear the immutable attribute</td><td><code>lsattr /etc/resolv.conf</code></td></tr>
<tr><td><code>file</code></td><td>what the bytes are: script, ELF arch, CRLF</td><td><code>file deploy.sh node</code></td></tr>
<tr><td><code>cat -A</code> · <code>od -c</code></td><td>show invisible characters (<code>^M</code>, <code>\\r</code>)</td><td><code>head -1 f | cat -A</code></td></tr>
<tr><td><code>ldd</code></td><td>shared libraries a binary needs</td><td><code>ldd \$(command -v node) | grep 'not found'</code></td></tr>
<tr><td><code>ls -l /proc/PID/{cwd,exe}</code></td><td>where the process runs, which binary it is</td><td><code>ls -l /proc/4004/cwd</code></td></tr>
<tr><td><code>ps -o lstart= -p PID</code></td><td>exact start time, no header</td><td><code>ps -o lstart= -p 4004</code></td></tr>
<tr><td><code>openssl s_client -servername</code></td><td>connect with SNI, so you test the right certificate</td><td><code>openssl s_client -connect h:443 -servername h</code></td></tr>
<tr><td><code>openssl x509 -noout -dates -checkend N</code></td><td>print validity; exit 1 if expiring within N s</td><td><code>… | openssl x509 -noout -checkend 2592000</code></td></tr>
<tr><td><code>getent hosts NAME</code></td><td>resolve like the application (<code>/etc/hosts</code> first)</td><td><code>getent hosts api.example.com</code></td></tr>
</table>

<h3>On macOS and WSL: what is different</h3>
<p>Three differences bit while this lesson was written, all measured on the course Mac. <strong>The filesystem ignores case:</strong> <code>touch Report_A.txt; ls report_a.txt</code> prints <code>report_a.txt</code> — the import that works on your Mac and fails in the Linux container. <strong>There is no <code>namei</code></strong>: walk the path by hand with <code>ls -ld / /srv /srv/app</code>. <strong>GNU <code>date -d</code> does not exist</strong>: the "days until expiry" pipeline in Recipe 4 fails with <code>date: illegal option -- d</code>; the BSD form is <code>date -j -f "%b %d %T %Y %Z" "Dec 25 22:56:35 2026 GMT" +%s</code>, which printed <code>1798239395</code> — the same number GNU <code>date -d</code> gives in the container. And there are two <code>openssl</code>s on a Mac with Homebrew: <code>/opt/homebrew/bin/openssl</code> (OpenSSL 3.6.4) and <code>/usr/bin/openssl</code> (LibreSSL 3.3.6), with different flags and defaults — run <code>which openssl; openssl version</code> before trusting a result. On WSL2 the Linux behaviour holds, with one extra case-sensitivity trap: files under <code>/mnt/c</code> live on the Windows filesystem, where case is ignored by default.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate on Windows pushed <code>deploy.sh</code> and it "does nothing" on the server; the service user also cannot run it. Reproduce and fix both, then prove a restart is needed after a deploy.</p><ol>
<li>In <code>docker run --rm -it ubuntu:24.04 bash</code>: <code>apt-get update &amp;&amp; apt-get install -y file</code>, <code>useradd -m -s /bin/bash deploy</code>, create <code>/srv/app/deploy.sh</code> with <code>printf '#!/bin/bash\\r\\necho deploying\\r\\n'</code>, <code>chmod 755</code> it and <code>chmod 750 /srv</code>.</li>
<li>Run it as <code>deploy</code> (<code>su deploy -c /srv/app/deploy.sh</code>) and use <code>namei -l</code> to name the first fault.</li>
<li>Fix the directory, run again, and use <code>file</code> + <code>cat -A</code> to name the second fault; fix it with <code>sed -i 's/\\r\$//'</code>.</li>
<li>Start <code>sleep 1000 &amp;</code> from inside <code>/srv/app</code>, then <code>mv /srv/app /srv/app.old; mkdir /srv/app</code> and show with <code>ls -l /proc/\$!/cwd</code> which directory the process is really in.</li></ol>
<p><strong>Done when:</strong> <code>su deploy -c /srv/app/deploy.sh</code> prints <code>deploying</code>, <code>file</code> no longer mentions CRLF, and step 4 shows <code>/srv/app.old</code> for the running process.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Traverse (search) bit</span><span class="v">The <code>x</code> on a directory: permission to pass through it to reach anything inside.</span></div>
  <div class="kv"><span class="k">Shebang</span><span class="v">The first line <code>#!/bin/bash</code> telling the kernel which interpreter runs the file.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line ending <code>\\r\\n</code>; the stray <code>\\r</code> breaks shebangs and commands on Linux.</span></div>
  <div class="kv"><span class="k">Stale process</span><span class="v">A process still running code or a directory from before the deploy because nobody restarted it.</span></div>
  <div class="kv"><span class="k">Clock skew</span><span class="v">The difference between a machine's clock and real time; breaks TLS, tokens and cron.</span></div>
  <div class="kv"><span class="k">Zombie</span><span class="v">A process that has exited but whose exit status has not been collected by its parent.</span></div>
  <div class="kv"><span class="k">Init / reaper</span><span class="v">PID 1's job of collecting orphaned children; <code>docker run --init</code> adds one to a container.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Denied" with a correct file mode: <code>namei -l</code> finds the parent directory without <code>x</code>; then check mounts, sandboxing, AppArmor.</li>
<li>"Required file not found" on a visible file is the interpreter: <code>file</code> and <code>cat -A</code> expose CRLF; 127 vs 126 separates missing from not-executable.</li>
<li>Old behaviour after a deploy: <code>/proc/PID/cwd</code>, <code>/proc/PID/exe</code> and <code>ps -o lstart=</code> prove which code is running.</li>
<li>"Not yet valid" or "expired" on a certificate that works elsewhere: check the clock of the machine that complains.</li>
<li>Zombies cannot be killed; fix or restart the parent, and give containers an init with <code>--init</code>.</li>
<li>On a Mac: case-insensitive files, no <code>namei</code>, BSD <code>date -j</code>, and two different <code>openssl</code> binaries.</li>
</ul>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/namei.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">namei(1)</span><span class="lc-sub">Walks a path and prints the mode of every component, including symlinks. The right first command for any "permission denied" where the file's own mode looks fine.</span></span>
</a>
<a class="link-card" href="https://www.openssl.org/docs/man3.0/man1/openssl-s_client.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">openssl s_client</span><span class="lc-sub">The tool for looking at a live TLS connection: chain, dates, SNI, protocol version. <code>-servername</code> is the flag people forget, and forgetting it tests the wrong certificate.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/how-to-use-apparmor" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">AppArmor on Ubuntu</span><span class="lc-sub">How profiles work, how to read a DENIED line from <code>dmesg</code>, and how to put one profile in complain mode while you investigate — without disabling the whole system.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: six impossible bugs</span><span class="lc-sub">Graded exercises: find the traversal bit with <code>namei</code>, diagnose a CRLF shebang from the error message alone, prove a running process is executing an old release, and explain why <code>dig</code> and the app disagree.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> concluding "the machine is broken" or "it must be a caching thing". Neither is ever the finding. Every recipe here is a mundane mechanism that is simply invisible from where you were looking — a mode bit two directories up, a carriage return, a process older than its own code, a clock. When a system seems to be behaving impossibly, one of your assumptions is false, and the fastest way forward is to verify the assumption you have not checked because it is "obviously" true.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>namei -l</code> before you argue about permissions — the answer is usually a parent directory, and <code>ls -l</code> on the file cannot show it. Before you debug behaviour, prove the process is running the code you think it is: <code>/proc/PID/cwd</code>, <code>/proc/PID/exe</code> and the start time answer that in three commands. And when something is impossible, the false assumption is the one you never tested — the clock, the line endings, the resolver, the case of a filename.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Sách công thức: nó lạ</h2>
<p class="lead">Những cú hỏng trong bài này có chung một tính chất: lời giải thích hiển nhiên thì SAI. Quyền đúng cả rồi mà nó vẫn nói denied. File có thật mà shell bảo không tìm thấy. Mã đã deploy rồi mà hành vi cũ vẫn còn. Sáu công thức cho những con bọ khiến người ta mất lòng tin vào cái máy.</p>

<h3>Công thức 1 — "Permission denied" trong khi quyền vẫn đúng</h3>
${slide('lx-12', 21, 'namei -l: thủ phạm ở thư mục cha')}
<pre><code class="language-bash">ls -l /srv/app/run.sh
namei -l /srv/app/run.sh          <span class="tok-comment"># MỌI thành phần của đường dẫn, kèm quyền</span>
findmnt -T /srv/app               <span class="tok-comment"># tuỳ chọn gắn cho đường dẫn này</span>
sudo dmesg -T | grep -iE 'apparmor|audit|denied' | tail -5</code></pre>
<div class="out">$ ls -l /srv/app/run.sh
-rwxr-xr-x 1 deploy deploy 412 Aug 22 14:05 /srv/app/run.sh
$ namei -l /srv/app/run.sh
f: /srv/app/run.sh
drwxr-xr-x root  root  /
drwxr-x--- root  root  srv
drwxr-xr-x deploy deploy app
-rwxr-xr-x deploy deploy run.sh</div>
<p>Cái file thì ai cũng chạy được, còn chỗ hỏng nằm cao hơn hai tầng: <code>/srv</code> là <code>drwxr-x---</code> thuộc <code>root:root</code>, nên một người dùng không phải root và không thuộc nhóm <code>root</code> thì không đi xuyên vào được (Bài 4.1). <code>ls -l</code> lên cái file không bao giờ cho bạn thấy điều đó; <code>namei -l</code> bày ra cả chuỗi cùng một lúc và là công cụ kiểm quyền nhanh nhất trên máy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Một thư mục cha thiếu bit <code>x</code></span><span class="v">Kinh điển. Mọi thư mục trên đường dẫn đều cần bit thực thi thì người dùng mới đi qua được. <code>namei -l</code> tìm ra nó bằng một câu lệnh.</span></div>
  <div class="kv"><span class="k">Gắn với <code>noexec</code></span><span class="v"><code>findmnt -T</code> cho thấy các tuỳ chọn. Script nằm dưới <code>/tmp</code> hay <code>/home</code> trên một máy chủ đã gia cố thường KHÔNG chạy được, bất kể bit quyền là gì.</span></div>
  <div class="kv"><span class="k">Gắn ở chế độ chỉ đọc</span><span class="v">Một hệ thống file tự gắn lại thành chỉ-đọc sau một lỗi I/O. Lệnh ghi hỏng với <code>EROFS</code>, và nhiều chương trình báo cái đó thành lỗi quyền. Hãy xem <code>dmesg -T</code> tìm lỗi đã gây ra nó.</span></div>
  <div class="kv"><span class="k">Hộp cát của systemd</span><span class="v"><code>ProtectSystem=strict</code>, <code>ProtectHome=</code>, <code>ReadWritePaths=</code> — dịch vụ nhìn thấy một hệ thống file KHÁC với cái shell của bạn nhìn thấy (Bài 11.1). Mã thoát 226/NAMESPACE, hoặc một cú <code>EACCES</code> thuần lúc chạy.</span></div>
  <div class="kv"><span class="k">AppArmor</span><span class="v">Tầng kiểm soát truy cập bắt buộc mặc định của Ubuntu. <code>dmesg</code> hiện <code>apparmor="DENIED"</code> kèm tên hồ sơ. Nó áp cho những chương trình cụ thể — <code>mysqld</code>, <code>nginx</code>, snap — và vô hình với <code>ls</code>.</span></div>
  <div class="kv"><span class="k">Thuộc tính bất biến</span><span class="v"><code>lsattr file</code> hiện <code>----i---------</code> nghĩa là ngay cả root cũng không sửa được cho tới khi <code>chattr -i</code>. Hiếm, dễ nhớ, và nó khiến người ta nghi ngờ thực tại trong hai mươi phút.</span></div>
</div>

<h3>Công thức 2 — "command not found" với một file CÓ THẬT</h3>
${slide('lx-12', 22, 'CRLF trong shebang và mã 126/127')}
<pre><code class="language-bash">ls -l ./deploy.sh &amp;&amp; ./deploy.sh
file ./deploy.sh
head -c 40 ./deploy.sh | cat -A | head -2       <span class="tok-comment"># -A hiện \\r thành ^M</span>
ldd \$(command -v node) | grep 'not found'</code></pre>
<div class="out">$ ./deploy.sh
bash: ./deploy.sh: cannot execute: required file not found
$ head -c 40 ./deploy.sh | cat -A | head -1
#!/bin/bash^M\$</div>
<p>Dòng shebang kết thúc bằng <code>^M</code> — một ký tự xuống dòng kiểu Windows, từ một file soạn trên Windows hoặc lấy về với cấu hình xuống dòng sai của git. Nhân ngoan ngoãn đi tìm một trình thông dịch có tên đúng nghĩa đen là <code>/bin/bash\\r</code>, không thấy, rồi báo "required file not found" trong khi chỉ tay vào script của bạn. Thông báo gọi tên cái script; cái file thiếu là TRÌNH THÔNG DỊCH.</p>
<pre><code class="language-bash">sed -i 's/\\r\$//' ./deploy.sh          <span class="tok-comment"># hoặc: dos2unix ./deploy.sh</span>
file ./deploy.sh</code></pre>
<div class="out">./deploy.sh: Bourne-Again shell script, ASCII text executable</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CRLF trong shebang</span><span class="v">"cannot execute: required file not found" trên một file bạn nhìn thấy rành rành. <code>cat -A</code> chứng minh nó trong một dòng.</span></div>
  <div class="kv"><span class="k">Sai kiến trúc</span><span class="v"><code>file</code> nói <code>ARM aarch64</code> trên một cái máy x86. Hay gặp với chương trình dựng trên laptop Apple Silicon rồi chép lên VPS.</span></div>
  <div class="kv"><span class="k">Thiếu thư viện chia sẻ</span><span class="v"><code>ldd</code> in ra <code>=&gt; not found</code>. File có thật mà không khởi động được. Hãy cài gói đó, hoặc bạn đã dựng dựa trên một libc mà máy đích không có — chính cái bẫy musl/glibc trong lịch sử deploy của dự án này.</span></div>
  <div class="kv"><span class="k">Đơn giản là không có trên PATH</span><span class="v">Câu trả lời buồn tẻ, và vẫn là phổ biến nhất. <code>command -v x</code>, rồi <code>echo "\$PATH" | tr ':' '\\n'</code> (Bài 8.1). Nhớ rằng <code>sudo</code> và cron có PATH KHÁC với bạn.</span></div>
  <div class="kv"><span class="k">Bộ nhớ băm cũ của shell</span><span class="v">Bạn dời một chương trình đi mà bash vẫn nhớ chỗ cũ. <code>hash -r</code> xoá nó đi. Triệu chứng: thông báo lỗi gọi tên một đường dẫn không còn tồn tại.</span></div>
</div>

<h3>Công thức 3 — mã đã deploy mà hành vi cũ vẫn còn</h3>
${slide('lx-12', 23, 'Tiến trình vẫn đứng trong bản cũ')}
<p>Một route trả 404 sau khi bạn vừa thêm nó; một bản vá không hiện ra; một con bọ bạn đã xoá vẫn xảy ra. Trong mọi trường hợp, câu hỏi không phải "mã có đúng không" mà là <strong>"tiến trình này có đang chạy đúng cái mã tôi nghĩ không?"</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Route đã được gắn chưa? 401/200 = còn sống, 404 = bản dựng cũ</span>
curl -s -o /dev/null -w '%{http_code}\\n' https://example.com/api/v1/reports

<span class="tok-comment"># Tiến trình đang chạy thật ra đang thực thi cái gì?</span>
pgrep -af 'node|python' | head
sudo ls -l /proc/41288/cwd /proc/41288/exe
sudo stat -c '%y %n' /srv/app/dist/index.js
ps -o lstart= -p 41288                         <span class="tok-comment"># nó khởi động lúc nào?</span></code></pre>
<div class="out">404
41288 node /srv/app/dist/index.js
lrwxrwxrwx 1 deploy deploy 0 Aug 22 19:52 /proc/41288/cwd -> /srv/releases/2026-08-19
2026-08-22 14:05:11.000000000 +0000 /srv/app/dist/index.js
Mon Aug 19 09:12:44 2026</div>
<p>Ba sự kiện và bí ẩn kết thúc: bản dựng trên đĩa là ngày 22 tháng 8, tiến trình khởi động ngày 19 tháng 8, và thư mục làm việc của nó là một thư mục phát hành cũ. Bản deploy đã chép file mới lên và không ai khởi động lại dịch vụ. Mã thì đúng và chẳng liên quan gì.</p>
<div class="callout ok"><strong>Hãy chẩn đoán "nó còn sống không?" bằng một lệnh <code>curl</code> không xác thực, đừng bao giờ bằng trình duyệt.</strong> <strong>401</strong> nghĩa là route đã được gắn và đòi xác thực. <strong>200</strong> nghĩa là đã gắn và công khai. <strong>404</strong> nghĩa là route KHÔNG tồn tại trong tiến trình đang chạy — một bản dựng cũ hoặc dở dang. Trình duyệt thêm bộ đệm, service worker và cookie vào một câu hỏi vốn chỉ có một từ để trả lời, và lịch sử của chính dự án này có một ngày mất trắng cho "cái chọn ảnh GIF hỏng rồi" mà thật ra là một <code>dist/index.js</code> cũ không gắn route.</div>
<div class="pitfall"><strong>Bẫy:</strong> một máy chủ tài nguyên tĩnh chốt danh sách file lúc khởi động. Next.js quyết định có những gì dưới <code>public/</code> ngay khi <em>TIẾN TRÌNH SERVER KHỞI ĐỘNG</em>; dựng lại tài nguyên trong lúc nó đang chạy thì nó trả 404 cho những file nằm sờ sờ trên đĩa — không lỗi, không dòng log nào, chỉ có một trang không bao giờ tải xong vì JavaScript của nó không bao giờ tới. Đổi bất cứ thứ gì dưới <code>public/</code> thì phải khởi động lại server. Và hãy diệt nó theo CỔNG (<code>lsof -ti:3000 | xargs -r kill -9</code>), bởi vì Node tự đổi tên tiến trình của nó thành <code>next-server</code> và mọi mẫu <code>pkill -f</code> bạn thử một cách tự nhiên đều khớp trúng con số không.</div>

<h3>Công thức 4 — TLS và cái đồng hồ</h3>
${slide('lx-12', 24, 'Lỗi chứng chỉ = lỗi đồng hồ máy khách')}
<pre><code class="language-bash">curl -vI https://example.com 2&gt;&amp;1 | grep -E 'expire|subject|issuer|SSL'
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject -issuer
timedatectl | head -4</code></pre>
<div class="out">notBefore=Aug  9 00:00:00 2026 GMT
notAfter=Nov  7 23:59:59 2026 GMT
subject=CN = example.com
issuer=C = US, O = Let's Encrypt, CN = R11</div>
<div class="kv-grid">
  <div class="kv"><span class="k">certificate has expired</span><span class="v">Hãy đối chiếu <code>notAfter</code> với ngày thật. Rồi kiểm cái timer gia hạn lẽ ra đã phải ngăn chuyện đó: <code>systemctl list-timers | grep certbot</code> (Bài 11.2). Một chứng chỉ hết hạn gần như luôn là một công việc gia hạn hỏng, không phải một vấn đề về chứng chỉ.</span></div>
  <div class="kv"><span class="k">certificate is not yet valid</span><span class="v">Gần như không bao giờ là chứng chỉ — đó là ĐỒNG HỒ CỦA MÁY KHÁCH. Một container hay máy ảo sai ngày sẽ từ chối những chứng chỉ hoàn toàn tốt. Hãy chạy <code>timedatectl</code> trên cái máy đang phàn nàn.</span></div>
  <div class="kv"><span class="k">unable to get local issuer certificate</span><span class="v">Chuỗi chứng chỉ thiếu: máy chủ chỉ đưa lá cuối mà không kèm chứng chỉ trung gian. Trình duyệt hay che lấp chuyện này bằng cách lưu sẵn trung gian; <code>curl</code> và backend của bạn thì không, và đó là lý do "trên Chrome chạy được" không phải một phép kiểm.</span></div>
  <div class="kv"><span class="k">hostname mismatch</span><span class="v">Hãy so <code>subject</code>/SAN với cái tên bạn vừa yêu cầu. Thường là nhầm vhost trả lời — hãy truyền <code>-servername</code> cho <code>openssl s_client</code>, không thì bạn đang kiểm chứng chỉ mặc định chứ không phải cái bạn định kiểm.</span></div>
  <div class="kv"><span class="k">curl chạy được, ứng dụng thì không</span><span class="v">Kho tin cậy khác nhau. Node có bộ CA riêng của nó; một container có thể chẳng cài cái nào (<code>ca-certificates</code>). Hệ thống tin một chứng chỉ không có nghĩa là môi trường chạy của bạn cũng tin.</span></div>
  <div class="kv"><span class="k">JWT "hết hạn" ngay lập tức</span><span class="v">Lại là lệch đồng hồ. Một cái máy chạy nhanh vài phút phát ra token mà máy khác coi là đã chết. Hãy sửa NTP (Bài 11.3), đừng sửa thời hạn của token.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Còn bao nhiêu ngày nữa hết hạn, dưới dạng một con số — đáng đưa vào hệ giám sát</span>
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2 \\
  | { read d; echo \$(( (\$(date -d "\$d" +%s) - \$(date +%s)) / 86400 )) ngày; }</code></pre>
<div class="out">77 ngày</div>

<h3>Công thức 5 — chạy bằng IP, không chạy bằng tên</h3>
<pre><code class="language-bash">dig +short api.example.com
dig +short api.example.com @1.1.1.1        <span class="tok-comment"># đi vòng qua trình phân giải cục bộ</span>
cat /etc/resolv.conf; cat /etc/hosts
getent hosts api.example.com               <span class="tok-comment"># thứ HỆ THỐNG phân giải ra, không chỉ DNS</span>
resolvectl status | head -20</code></pre>
<div class="out">$ dig +short api.example.com
10.0.0.9
$ dig +short api.example.com @1.1.1.1
203.0.113.44
$ getent hosts api.example.com
10.0.0.9        api.example.com</div>
<p>Hai câu trả lời khác nhau cho cùng một cái tên. Trình phân giải cục bộ trả về một địa chỉ riêng tư mà trình phân giải công cộng không biết tới — hoặc là một thiết lập split-horizon có chủ ý, hoặc một dòng <code>/etc/hosts</code> còn sót từ lúc ai đó thử nghiệm, hoặc DNS của một VPN. <code>getent hosts</code> mới là cái quan trọng: nó đi theo <code>/etc/nsswitch.conf</code> ĐÚNG như ứng dụng của bạn sẽ làm, gồm cả <code>/etc/hosts</code>, thứ mà <code>dig</code> hoàn toàn phớt lờ.</p>
<div class="callout"><strong><code>dig</code> và ứng dụng của bạn KHÔNG phân giải tên theo cùng một cách.</strong> <code>dig</code> nói chuyện với một máy chủ DNS. Ứng dụng của bạn gọi <code>getaddrinfo()</code>, hàm này tra <code>/etc/hosts</code> trước, rồi có thể tới mDNS, rồi mới tới DNS, theo đúng thứ tự ghi trong <code>/etc/nsswitch.conf</code>. Khi <code>dig</code> cho câu trả lời đúng mà ứng dụng vẫn nối tới nhầm chỗ, khác biệt nằm ở một dòng trong <code>hosts</code> — và <code>getent hosts</code> là câu lệnh nhìn thấy nó.</div>

<h3>Công thức 6 — "nhưng máy tôi chạy được mà"</h3>
${slide('lx-12', 26, 'Sáu thứ khác nhau giữa hai máy')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Phân biệt hoa thường</span><span class="lz-lnote">Hệ thống file của macOS mặc định KHÔNG phân biệt hoa thường; Linux thì có. <code>import './Button'</code> khớp trúng một file tên <code>button.tsx</code> thì chạy ngon ở máy bạn và hỏng trong container. Đây là nguyên nhân số một của "bản build qua được trên laptop tôi mà".</span></div>
  <div class="lz-layer"><span class="lz-lname">Bản địa (locale)</span><span class="lz-lnote"><code>LANG</code> và <code>LC_ALL</code> đổi cách <code>sort</code> sắp xếp, cách <code>printf</code> định dạng số thập phân, và cách vài công cụ đọc ngày tháng. Máy chủ thường chạy <code>C.UTF-8</code>; terminal của bạn thì không. Hãy đặt <code>LC_ALL=C</code> trong những script phải đọc output (Bài 8.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Múi giờ</span><span class="lz-lnote">Máy bạn là giờ địa phương, máy chủ là UTC. Mọi con bọ ở ranh giới ngày, mọi lần "báo cáo rỗng" vào sai giờ, và mọi cái cron lệch bảy tiếng (Bài 11.2) đều bắt đầu từ đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Biến môi trường</span><span class="lz-lnote">Shell của bạn có năm mươi biến mà dịch vụ thì không — vì systemd và cron chẳng đọc file khởi động nào của bạn (Bài 8.2). <code>systemctl show app -p Environment</code> cho thấy dịch vụ thật sự nhận được gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lệch phiên bản</span><span class="lz-lnote">Node 22 ở máy bạn, Node 18 trong ảnh; một OpenSSL khác; một libc khác. Hãy chạy <code>node -v</code>, <code>openssl version</code> và <code>ldd --version</code> ở CẢ HAI nơi, đặt cạnh nhau.</span></div>
  <div class="lz-layer"><span class="lz-lname">Những file git không mang theo</span><span class="lz-lnote"><code>.env</code>, client được sinh ra, liên kết mềm, một thư mục <code>uploads/</code> chỉ tồn tại trên đĩa của bạn. <code>git status --ignored</code> cho thấy bản làm việc của bạn có gì mà một bản clone mới thì không.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Chạy cái này ở CẢ HAI máy rồi so output — hai mươi giây, kết thúc phần lớn cuộc tranh cãi</span>
{ uname -srm; . /etc/os-release 2&gt;/dev/null &amp;&amp; echo "\$PRETTY_NAME"
  node -v 2&gt;/dev/null; npm -v 2&gt;/dev/null; openssl version
  echo "TZ=\$(timedatectl show -p Timezone --value 2&gt;/dev/null)"
  echo "LANG=\$LANG LC_ALL=\$LC_ALL"; locale charmap
  echo "phan biet hoa thuong: \$(touch /tmp/A_ 2&gt;/dev/null; [ -e /tmp/a_ ] &amp;&amp; echo KHONG || echo CO; rm -f /tmp/A_)"
} 2&gt;&amp;1</code></pre>
<div class="out">Linux 6.8.0-45-generic x86_64
Ubuntu 24.04.1 LTS
v22.11.0
10.9.0
OpenSSL 3.0.13 30 Jan 2024
TZ=Etc/UTC
LANG=C.UTF-8 LC_ALL=
UTF-8
phan biet hoa thuong: CO</div>

<h3>Công thức 7 — một đống tiến trình &lt;defunct&gt; mà <code>kill -9</code> không xoá được</h3>
${slide('lx-12', 25, 'Zombie: sửa ở tiến trình cha, hoặc --init')}
<p>Chương 5 đã giải thích zombie là gì: một tiến trình đã thoát nhưng tiến trình cha chưa "nhận" mã thoát của nó bằng <code>wait()</code>. Câu hỏi chẩn đoán thì khác — bạn gặp chúng như một TRIỆU CHỨNG. Trong lúc dựng phòng thí nghiệm của chương này, zombie tự xuất hiện, nên chúng là một ví dụ thật hoàn hảo:</p>
<pre><code class="language-bash">ps -eo stat,pid,ppid,etime,cmd | awk 'NR==1 || \$1 ~ /^Z/'
ps -o pid,cmd -p 1
kill -9 3630; ps -o stat,pid,cmd -p 3630
grep -E '^(State|PPid)' /proc/3630/status</code></pre>
<div class="out">STAT     PID    PPID     ELAPSED CMD
Z       3630       1       04:10 [python3] &lt;defunct&gt;
Z       3664       1       03:46 [python3] &lt;defunct&gt;
Z       3682       1       03:36 [python3] &lt;defunct&gt;
    PID CMD
      1 sleep infinity
STAT     PID CMD
Z       3630 [python3] &lt;defunct&gt;
State:	Z (zombie)
PPid:	1</div>
<p>Đọc nó như một chuỗi. Ba tiến trình Python ghi log đã chết (từ thí nghiệm đĩa đầy ở Bài 12.3) được khởi chạy bởi một script shell giờ đã thoát, nên chúng được PID 1 nhận nuôi. Trên một máy bình thường PID 1 là systemd, thứ dọn trẻ mồ côi ngay lập tức. Trong container này PID 1 lại là <code>sleep infinity</code> — một chương trình không bao giờ gọi <code>wait()</code> — nên zombie nằm đó mãi. <code>kill -9</code> chẳng làm gì vì không còn tiến trình nào để giết; chỉ tiến trình cha mới xoá được dòng đó.</p>
<table>
<tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Làm gì</th></tr>
<tr><td>vài dòng <code>Z</code> có cha còn sống, cha không phải PID 1</td><td>cha dọn chậm hoặc có bọ</td><td>thường vô hại; restart hoặc sửa cha (<code>wait()</code>, bắt <code>SIGCHLD</code>)</td></tr>
<tr><td>số lượng cứ tăng mãi</td><td>một tiến trình cha đẻ con mà không bao giờ dọn</td><td>tìm nó qua cột PPID; sửa trước khi bảng PID (<code>/proc/sys/kernel/pid_max</code>) đầy</td></tr>
<tr><td><code>Z</code> có PPID 1 trong container</td><td>PID 1 là app của bạn hoặc <code>sleep</code>, không phải một init</td><td><code>docker run --init</code> hoặc <code>init: true</code> trong Compose</td></tr>
<tr><td>trạng thái <code>D</code>, không phải <code>Z</code></td><td>còn sống nhưng kẹt trong nhân (I/O)</td><td>Bài 12.3 — đĩa, NFS hoặc driver</td></tr>
</table>
<p>Cách chữa cho container, đo bằng cùng một thí nghiệm trên hai container mới — một thường, một có <code>--init</code>, mỗi cái chạy một <code>sleep</code> nền từ một shell đã thoát rồi giết nó:</p>
<div class="out"># docker run … ubuntu:24.04 sleep infinity
      1 sleep infinity
STAT     PID    PPID CMD
Zs        11       1 [sleep] &lt;defunct&gt;
# docker run --init … ubuntu:24.04 sleep infinity
      1 /sbin/docker-init -- sleep infinity
STAT     PID    PPID CMD</div>
<p>Có <code>--init</code>, Docker đặt một init tí hon (tini) làm PID 1, và dòng zombie đơn giản là không bao giờ xuất hiện. Một zombie tốn đúng một dòng trong bảng tiến trình, không tốn bộ nhớ hay CPU — vài cái chỉ là chuyện thẩm mỹ, hàng nghìn cái sẽ khiến máy không tạo nổi tiến trình mới.</p>

<h3>Chạy thử từng bước: ba con bọ "không thể nào" trong năm phút</h3>
<p>Cả ba được dựng lại trong container thí nghiệm (Ubuntu 24.04, util-linux 2.39.3, bash 5.2.21). Với quyền root trong một container vứt đi:</p>
<pre><code class="language-bash">apt-get install -y file; useradd -m -s /bin/bash deploy; mkdir -p /srv/app
printf '#!/bin/bash\\necho "app ok"\\n' &gt; /srv/app/run.sh
chown -R deploy:deploy /srv/app; chmod 755 /srv/app/run.sh; chmod 750 /srv
su deploy -c /srv/app/run.sh; namei -l /srv/app/run.sh</code></pre>
<div class="out">bash: line 1: /srv/app/run.sh: Permission denied
f: /srv/app/run.sh
drwxr-xr-x root   root   /
drwxr-x--- root   root   srv
drwxr-xr-x deploy deploy app
-rwxr-xr-x deploy deploy run.sh</div>
<p>File có quyền <code>755</code> và thuộc về <code>deploy</code>; <code>/srv</code> lại là <code>750 root:root</code>, nên <code>deploy</code> — không phải chủ, cũng không thuộc nhóm <code>root</code> — không có <code>x</code> trên nó và không đi xuyên qua được. <code>chmod 755 /srv</code> và cùng câu lệnh đó in ra <code>app ok</code>. (<code>namei -m</code> chỉ in quyền, bỏ chủ sở hữu, khi dòng quá dài.)</p>
<pre><code>printf '#!/bin/bash\\r\\necho "deploying"\\r\\n' &gt; deploy.sh; chmod +x deploy.sh
./deploy.sh; echo "exit=\$?"
file deploy.sh
head -1 deploy.sh | od -c | head -2</code></pre>
<div class="out">bash: line 7: ./deploy.sh: cannot execute: required file not found
exit=127
deploy.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators
0000000   #   !   /   b   i   n   /   b   a   s   h  \\r  \\n
0000015</div>
<p><code>file</code> nói thẳng ra (<em>with CRLF line terminators</em>) và <code>od -c</code> cho thấy byte <code>\\r</code> từng cái một. Chạy bằng <code>bash deploy.sh</code> thì bỏ qua shebang và hỏng muộn hơn, từng dòng một: <code>cd: \$'/srv/app\\r': No such file or directory</code> và <code>\$'ls\\r': command not found</code> — cái <code>\$'…\\r'</code> đó là bash đang chỉ cho bạn ký tự vô hình. Shell nào báo lỗi cũng quan trọng: với <code>useradd -m deploy</code> (không có <code>-s</code>), shell của người dùng là <code>/bin/sh</code>, mà trên Ubuntu đó là <code>dash</code>, và cùng script CRLF chạy qua <code>su deploy -c</code> chỉ báo vỏn vẹn <code>sh: 1: /srv/app/deploy.sh: not found</code> — đo thật. Mã thoát đo thật của những trường hợp trông giống nhau:</p>
<table>
<tr><th>Bạn đã gõ</th><th>Thông báo</th><th>Mã thoát</th></tr>
<tr><td>một lệnh không có trong <code>PATH</code></td><td><code>khongcolenh: command not found</code></td><td>127</td></tr>
<tr><td>một đường dẫn không tồn tại</td><td><code>./khong-co.sh: No such file or directory</code></td><td>127</td></tr>
<tr><td>một file mà trình thông dịch hay bộ nạp của nó không tồn tại (shebang dính CRLF; chương trình glibc trên Alpine musl)</td><td><code>cannot execute: required file not found</code></td><td>127</td></tr>
<tr><td>một file không có <code>x</code>, hoặc nằm trên phân vùng <code>noexec</code></td><td><code>./noexec.sh: Permission denied</code></td><td>126</td></tr>
</table>
<p>Cuối cùng là tiến trình cũ. Một bản phát hành được khởi động từ <code>/srv/releases/v1</code>, rồi symlink <code>current</code> được chuyển sang <code>v2</code> mà không restart:</p>
<div class="out">$ ls -l /srv/app/current
lrwxrwxrwx 1 root root 16 Sep 28 15:28 /srv/app/current -&gt; /srv/releases/v2
$ ls -l /proc/4004/cwd
lrwxrwxrwx 1 root root 0 Sep 28 15:28 /proc/4004/cwd -&gt; /srv/releases/v1
$ ps -o pid,lstart,etime,cmd -p 4004
    PID                  STARTED     ELAPSED CMD
   4004 Mon Sep 28 15:28:28 2026       00:02 python3 app.py 0.0.0.0 19127</div>
<p>Symlink nói v2, thư mục làm việc của tiến trình nói v1, và giờ khởi động của nó sớm hơn <code>mtime</code> của file mới (<code>15:28:31</code>). Một tiến trình phân giải đường dẫn lúc nó KHỞI ĐỘNG; đổi symlink về sau chẳng thay đổi gì với nó.</p>

<h3>Đo thật: đồng hồ làm hỏng TLS theo cả hai chiều</h3>
<pre><code class="language-bash">apt-get install -y faketime            <span class="tok-comment"># làm giả giờ cho MỘT câu lệnh</span>
faketime '2020-01-01' curl -sS -o /dev/null https://example.com/
faketime '2030-01-01' curl -sS -o /dev/null https://example.com/
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -checkend \$((30*86400)); echo "exit=\$?"</code></pre>
<div class="out">curl: (60) SSL certificate problem: certificate is not yet valid
curl: (60) SSL certificate problem: certificate has expired
Certificate will not expire
exit=0</div>
<p>Cùng một chứng chỉ hợp lệ (<code>notBefore=Sep 26 2026</code>, <code>notAfter=Dec 25 2026</code>) là "chưa có hiệu lực" với một máy khách tưởng đang năm 2020, và "đã hết hạn" với một máy khách tưởng đang năm 2030. Máy chủ không đổi gì cả — đó chính là toàn bộ ý của Công thức 4. <code>-checkend N</code> là dạng hợp với giám sát: thoát 0 nếu chứng chỉ vẫn còn hạn sau N giây nữa, 1 nếu không.</p>

<h3>Bảng cờ: các lệnh của bài này</h3>
<table>
<tr><th>Lệnh và cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>namei -l</code> / <code>-m</code></td><td>từng thành phần đường dẫn kèm chủ+quyền / chỉ quyền</td><td><code>namei -l /srv/app/run.sh</code></td></tr>
<tr><td><code>findmnt -T ĐƯỜNG-DẪN</code></td><td>điểm gắn chứa đường dẫn đó, kèm tuỳ chọn</td><td><code>findmnt -T /tmp</code> → tìm <code>noexec</code>, <code>ro</code></td></tr>
<tr><td><code>lsattr</code> / <code>chattr -i</code></td><td>xem / gỡ thuộc tính bất biến</td><td><code>lsattr /etc/resolv.conf</code></td></tr>
<tr><td><code>file</code></td><td>các byte là gì: script, kiến trúc ELF, CRLF</td><td><code>file deploy.sh node</code></td></tr>
<tr><td><code>cat -A</code> · <code>od -c</code></td><td>hiện ký tự vô hình (<code>^M</code>, <code>\\r</code>)</td><td><code>head -1 f | cat -A</code></td></tr>
<tr><td><code>ldd</code></td><td>thư viện dùng chung mà một chương trình cần</td><td><code>ldd \$(command -v node) | grep 'not found'</code></td></tr>
<tr><td><code>ls -l /proc/PID/{cwd,exe}</code></td><td>tiến trình chạy ở đâu, là chương trình nào</td><td><code>ls -l /proc/4004/cwd</code></td></tr>
<tr><td><code>ps -o lstart= -p PID</code></td><td>giờ khởi động chính xác, không tiêu đề</td><td><code>ps -o lstart= -p 4004</code></td></tr>
<tr><td><code>openssl s_client -servername</code></td><td>kết nối kèm SNI, để thử đúng chứng chỉ</td><td><code>openssl s_client -connect h:443 -servername h</code></td></tr>
<tr><td><code>openssl x509 -noout -dates -checkend N</code></td><td>in hạn dùng; thoát 1 nếu hết hạn trong N giây</td><td><code>… | openssl x509 -noout -checkend 2592000</code></td></tr>
<tr><td><code>getent hosts TÊN</code></td><td>phân giải như ứng dụng (<code>/etc/hosts</code> trước)</td><td><code>getent hosts api.example.com</code></td></tr>
</table>

<h3>Trên macOS và WSL khác gì</h3>
<p>Ba khác biệt đã cắn trong lúc viết bài này, đều đo trên chiếc Mac của khoá. <strong>Hệ thống file không phân biệt hoa thường:</strong> <code>touch Report_A.txt; ls report_a.txt</code> in ra <code>report_a.txt</code> — đúng cái import chạy trên Mac mà hỏng trong container Linux. <strong>Không có <code>namei</code></strong>: đi tay từng cấp bằng <code>ls -ld / /srv /srv/app</code>. <strong>Không có <code>date -d</code> của GNU</strong>: đường ống "còn bao nhiêu ngày" ở Công thức 4 hỏng với <code>date: illegal option -- d</code>; dạng BSD là <code>date -j -f "%b %d %T %Y %Z" "Dec 25 22:56:35 2026 GMT" +%s</code>, in ra <code>1798239395</code> — đúng con số mà <code>date -d</code> của GNU cho trong container. Và Mac có Homebrew thì có HAI <code>openssl</code>: <code>/opt/homebrew/bin/openssl</code> (OpenSSL 3.6.4) và <code>/usr/bin/openssl</code> (LibreSSL 3.3.6), cờ và mặc định khác nhau — hãy chạy <code>which openssl; openssl version</code> trước khi tin một kết quả. Trên WSL2 hành vi Linux giữ nguyên, thêm một bẫy hoa thường: file dưới <code>/mnt/c</code> nằm trên hệ thống file Windows, nơi mặc định không phân biệt hoa thường.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm dùng Windows đẩy <code>deploy.sh</code> lên và nó "chẳng làm gì" trên máy chủ; người dùng dịch vụ cũng không chạy được nó. Dựng lại và sửa cả hai, rồi chứng minh vì sao phải restart sau khi deploy.</p><ol>
<li>Trong <code>docker run --rm -it ubuntu:24.04 bash</code>: <code>apt-get update &amp;&amp; apt-get install -y file</code>, <code>useradd -m -s /bin/bash deploy</code>, tạo <code>/srv/app/deploy.sh</code> bằng <code>printf '#!/bin/bash\\r\\necho deploying\\r\\n'</code>, <code>chmod 755</code> nó và <code>chmod 750 /srv</code>.</li>
<li>Chạy nó dưới quyền <code>deploy</code> (<code>su deploy -c /srv/app/deploy.sh</code>) và dùng <code>namei -l</code> để gọi tên lỗi thứ nhất.</li>
<li>Sửa thư mục, chạy lại, dùng <code>file</code> + <code>cat -A</code> gọi tên lỗi thứ hai; sửa bằng <code>sed -i 's/\\r\$//'</code>.</li>
<li>Chạy <code>sleep 1000 &amp;</code> từ bên trong <code>/srv/app</code>, rồi <code>mv /srv/app /srv/app.old; mkdir /srv/app</code> và chỉ ra bằng <code>ls -l /proc/\$!/cwd</code> tiến trình thật sự đang ở thư mục nào.</li></ol>
<p><strong>Đạt khi:</strong> <code>su deploy -c /srv/app/deploy.sh</code> in <code>deploying</code>, <code>file</code> không còn nhắc CRLF, và bước 4 cho thấy <code>/srv/app.old</code> với tiến trình đang chạy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Traverse / search bit (bit đi xuyên)</span><span class="v">Chữ <code>x</code> trên một thư mục: quyền đi qua nó để tới được bất cứ thứ gì bên trong.</span></div>
  <div class="kv"><span class="k">Shebang (dòng #!)</span><span class="v">Dòng đầu <code>#!/bin/bash</code> báo cho nhân biết trình thông dịch nào chạy file.</span></div>
  <div class="kv"><span class="k">CRLF (xuống dòng kiểu Windows)</span><span class="v">Kết thúc dòng <code>\\r\\n</code>; chữ <code>\\r</code> thừa làm hỏng shebang và câu lệnh trên Linux.</span></div>
  <div class="kv"><span class="k">Stale process (tiến trình cũ)</span><span class="v">Tiến trình vẫn chạy mã hoặc thư mục từ trước lần deploy vì không ai restart nó.</span></div>
  <div class="kv"><span class="k">Clock skew (lệch đồng hồ)</span><span class="v">Chênh lệch giữa đồng hồ của máy và giờ thật; làm hỏng TLS, token và cron.</span></div>
  <div class="kv"><span class="k">Zombie (tiến trình xác sống)</span><span class="v">Tiến trình đã thoát nhưng mã thoát chưa được tiến trình cha thu về.</span></div>
  <div class="kv"><span class="k">Init / reaper (tiến trình dọn xác)</span><span class="v">Việc của PID 1: thu dọn các con mồ côi; <code>docker run --init</code> thêm một cái vào container.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Denied" mà quyền file đúng: <code>namei -l</code> tìm ra thư mục cha thiếu <code>x</code>; rồi mới xét điểm gắn, hộp cát, AppArmor.</li>
<li>"Required file not found" với một file nhìn thấy được là do trình thông dịch: <code>file</code> và <code>cat -A</code> lật tẩy CRLF; 127 với 126 phân biệt "không có" với "không chạy được".</li>
<li>Hành vi cũ sau deploy: <code>/proc/PID/cwd</code>, <code>/proc/PID/exe</code> và <code>ps -o lstart=</code> chứng minh mã nào đang chạy.</li>
<li>"Not yet valid" hay "expired" với một chứng chỉ chạy tốt ở chỗ khác: kiểm đồng hồ của chính cái máy đang phàn nàn.</li>
<li>Zombie không giết được; hãy sửa hoặc restart tiến trình cha, và cho container một init bằng <code>--init</code>.</li>
<li>Trên Mac: file không phân biệt hoa thường, không có <code>namei</code>, <code>date -j</code> kiểu BSD, và hai chương trình <code>openssl</code> khác nhau.</li>
</ul>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/namei.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">namei(1)</span><span class="lc-sub">Đi dọc một đường dẫn và in quyền của từng thành phần, gồm cả liên kết mềm. Câu lệnh đầu tiên đúng đắn cho mọi cú "permission denied" mà quyền của chính cái file thì trông vẫn ổn.</span></span>
</a>
<a class="link-card" href="https://www.openssl.org/docs/man3.0/man1/openssl-s_client.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">openssl s_client</span><span class="lc-sub">Công cụ để soi một kết nối TLS đang sống: chuỗi chứng chỉ, ngày tháng, SNI, phiên bản giao thức. <code>-servername</code> là cái cờ người ta hay quên, và quên nó là kiểm nhầm chứng chỉ.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/how-to-use-apparmor" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">AppArmor trên Ubuntu</span><span class="lc-sub">Hồ sơ hoạt động thế nào, đọc một dòng DENIED trong <code>dmesg</code> ra sao, và cách chuyển MỘT hồ sơ sang chế độ chỉ-ghi-nhận trong lúc bạn điều tra — mà không phải tắt cả hệ thống.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sáu con bọ bất khả thi</span><span class="lc-sub">Bài chấm điểm: tìm ra bit đi-xuyên bằng <code>namei</code>, chẩn đoán một shebang dính CRLF chỉ từ thông báo lỗi, chứng minh một tiến trình đang chạy bản phát hành cũ, và giải thích vì sao <code>dig</code> với ứng dụng lại bất đồng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> kết luận "cái máy hỏng rồi" hoặc "chắc tại bộ đệm gì đó". Không cái nào từng là một phát hiện cả. Mọi công thức ở đây đều là một cơ chế TẦM THƯỜNG, chỉ là nó vô hình từ cái chỗ bạn đang đứng nhìn — một bit quyền cách hai thư mục, một ký tự về đầu dòng, một tiến trình già hơn chính mã của nó, một cái đồng hồ. Khi một hệ thống có vẻ đang hành xử bất khả thi thì một giả định nào đó của bạn đang sai, và cách đi tiếp nhanh nhất là kiểm chính cái giả định bạn chưa kiểm vì nó "hiển nhiên" đúng.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Hãy <code>namei -l</code> trước khi tranh cãi về quyền — câu trả lời thường là một thư mục cha, và <code>ls -l</code> lên cái file không cho thấy được. Trước khi gỡ lỗi hành vi, hãy CHỨNG MINH tiến trình đang chạy đúng cái mã bạn nghĩ: <code>/proc/PID/cwd</code>, <code>/proc/PID/exe</code> và thời điểm khởi động trả lời chuyện đó bằng ba câu lệnh. Và khi một chuyện là bất khả thi thì giả định sai chính là cái bạn chưa bao giờ kiểm — cái đồng hồ, ký tự xuống dòng, trình phân giải tên, hay chữ hoa chữ thường của một cái tên file.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — What you can do now, and what to learn next|||12.5 — Giờ bạn làm được gì, và học tiếp cái gì',
      slug: 'lnx-12-5-tong-ket',
      type: 'LESSON',
      description: 'Tổng kết cả khoá theo bốn cung đường, một thẻ tra cứu các câu lệnh gánh phần lớn công việc, năm thói quen phân biệt người thạo terminal, và lộ trình học tiếp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What you can do now, and what to learn next</h2>
<p class="lead">Sixty-something lessons ago this course opened with a claim: that a terminal is not a place where you memorise incantations, but a place where a small number of ideas compose into everything else. This lesson is the receipt. It is a map of what you covered, a reference card for the commands that carry most of the work, and an honest answer to "what now".</p>
<div class="callout ok"><strong>Update (September 2026): the course no longer ends here.</strong> This lesson still closes the original twelve chapters, and everything below remains true. But four new chapters now follow it — advanced Bash, Linux in depth, your Linux skills on macOS and Windows, and a capstone project with the real final exam. The section "Inside this course: Chapters 13–16" further down says what each one adds and in which order to take them.</div>

<h3>The four arcs</h3>
${slide('lx-12', 27, 'Bốn cung đường + bốn chương nâng cao')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Arc 1 · Chapters 0–2 — Moving around</span><span class="lz-lnote">What a shell is, the filesystem as one tree, paths, and creating, copying, moving and deleting files without fear. The arc that turns the terminal from a black box into a place you can navigate.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arc 2 · Chapters 3–6 — Composing</span><span class="lz-lnote">Streams, pipes and redirection; <code>grep</code>, <code>sed</code>, <code>awk</code>; permissions and users; processes and signals; variables, quoting and expansion. This is the arc where the shell stops being a file browser and becomes a language.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arc 3 · Chapters 7–9 — Building and reaching out</span><span class="lz-lnote">Scripts that fail loudly instead of silently; <code>PATH</code> and startup files; networking, SSH, <code>curl</code>, <code>rsync</code> and firewalls. The arc that lets you automate work and operate machines you cannot touch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arc 4 · Chapters 10–12 — Running things for real</span><span class="lz-lnote">Disk, packages and logs; services, schedules and hardening; and a diagnostic method that works on a machine you have never seen. The arc that separates "I can use Linux" from "I can be responsible for a server".</span></div>
</div>
<p>If you can open a terminal on an unfamiliar server, find out what it runs, read why something failed, fix it, and leave behind a change that will still be correct after a reboot — that is the whole course, and it is a genuinely portable skill. Nothing here expires with a framework.</p>

<h3>The commands that carry the work</h3>
${slide('lx-12', 31, 'Bảng tra nhanh: lệnh và cờ của chương chẩn đoán')}
<p>There are thousands of commands on a Linux box. In practice a few dozen do almost everything. Keep this card; the rest you can look up.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Move and look</span><span class="v"><code>cd</code> · <code>ls -la</code> · <code>pwd</code> · <code>tree -L 2</code> · <code>less</code> · <code>tail -f</code> · <code>file</code> · <code>stat</code> · <code>realpath</code></span></div>
  <div class="kv"><span class="k">Find</span><span class="v"><code>find . -name … -mtime …</code> · <code>grep -rn</code> · <code>which</code> / <code>command -v</code> · <code>locate</code> · <code>namei -l</code></span></div>
  <div class="kv"><span class="k">Change files</span><span class="v"><code>cp -a</code> · <code>mv</code> · <code>rm -i</code> · <code>mkdir -p</code> · <code>ln -s</code> · <code>tar czf</code> / <code>tar xzf</code> · <code>install -d -m</code></span></div>
  <div class="kv"><span class="k">Text</span><span class="v"><code>cat</code> · <code>head</code>/<code>tail</code> · <code>sort</code> · <code>uniq -c</code> · <code>cut</code> · <code>tr</code> · <code>wc -l</code> · <code>sed -i</code> · <code>awk '{print \$2}'</code> · <code>jq</code></span></div>
  <div class="kv"><span class="k">Permissions</span><span class="v"><code>chmod</code> · <code>chown</code> · <code>umask</code> · <code>sudo -u</code> · <code>id</code> · <code>groups</code> · <code>visudo</code></span></div>
  <div class="kv"><span class="k">Processes</span><span class="v"><code>ps aux --sort=-%cpu</code> · <code>top</code>/<code>htop</code> · <code>pgrep -af</code> · <code>kill</code> · <code>jobs</code>/<code>bg</code>/<code>fg</code> · <code>nohup</code> · <code>timeout</code></span></div>
  <div class="kv"><span class="k">Resources</span><span class="v"><code>df -h</code> · <code>df -i</code> · <code>du -xh --max-depth=1</code> · <code>free -h</code> · <code>vmstat 1</code> · <code>iostat -xz 1</code> · <code>uptime</code></span></div>
  <div class="kv"><span class="k">Network</span><span class="v"><code>ss -tlnp</code> · <code>curl -sS -w</code> · <code>dig +short</code> · <code>getent hosts</code> · <code>nc -vz</code> · <code>ssh</code> · <code>scp</code> · <code>rsync -avz</code> · <code>ufw</code></span></div>
  <div class="kv"><span class="k">Services and logs</span><span class="v"><code>systemctl status/cat/show</code> · <code>journalctl -u -p -b --since</code> · <code>systemctl --failed</code> · <code>systemd-analyze calendar</code></span></div>
  <div class="kv"><span class="k">Scripting</span><span class="v"><code>set -Eeuo pipefail</code> · <code>trap</code> · <code>mktemp</code> · <code>flock</code> · <code>\${var:?}</code> · <code>case</code> · <code>while read -r</code> · <code>shellcheck</code></span></div>
</div>
<div class="callout ok"><strong>You are not expected to remember flags.</strong> You are expected to remember that the capability exists — that <code>df</code> has an inode mode, that <code>curl</code> can print timings, that <code>ss</code> can filter by state. Knowing a thing is possible is the hard part; <code>man</code>, <code>--help</code> and <code>tldr</code> supply the rest in five seconds. Every experienced person you have watched work fast is doing exactly this.</div>

<h3>Five habits worth more than any command</h3>
${slide('lx-12', 29, 'Sai lầm hay gặp — mặt trái của năm thói quen')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Look before you change</span><span class="lz-t">ls before rm · --dry-run before rsync · print before delete</span><span class="lz-d">Every destructive command has a rehearsal mode. Using it costs two seconds and has saved more data than every backup system ever written.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Make failure loud</span><span class="lz-t">set -Eeuo pipefail · exit codes · check the return value</span><span class="lz-d">The default in shell is to carry on after an error. Almost every scripting disaster in Chapter 7 is a script that kept going after step three failed.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Prefer the boring, verifiable answer</span><span class="lz-t">sshd -T over reading the config · curl over the browser · systemctl cat over the file</span><span class="lz-d">Ask the system what it actually resolved, not what you believe you configured. Files lie by omission; resolved state does not.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Leave it better documented than you found it</span><span class="lz-t">a comment in the unit · a line in the README · a follow-up note</span><span class="lz-d">The next person to debug this is you, in eight months, with no memory of any of it.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Never close the working session</span><span class="lz-t">the second terminal, before a risky change</span><span class="lz-d">Firewall rules, sshd config, permission changes on a home directory. Ten seconds of preparation is the difference between an oops and a rebuild.</span></div>
</div>

<h3>Inside this course: Chapters 13–16</h3>
<p>The first twelve chapters taught you to use Linux and to be responsible for a server. The four new ones go in three directions — deeper into the language, deeper into the machine, and sideways onto the laptops your team actually uses — and then make you build the whole thing once, end to end.</p>
<table>
<tr><th>Chapter</th><th>What it adds</th><th>Commands you will meet</th><th>Take it when…</th></tr>
<tr><td><strong>13 · Advanced Bash: data structures, streams &amp; speed</strong></td><td>indexed and associative arrays, process substitution, file descriptors and named pipes, parallel jobs, and scripts at a professional level — plus the honest line where Bash should hand over to Python</td><td><code>declare -A</code>, <code>mapfile</code>, <code>&lt;(…)</code>, <code>exec 3&gt;</code>, <code>mkfifo</code>, <code>xargs -P</code>, <code>wait -n</code>, <code>getopts</code>, <code>trap ERR</code>, <code>bats</code>, <code>shfmt</code></td><td>your <code>deploy.sh</code> has grown past a hundred lines</td></tr>
<tr><td><strong>14 · Linux in depth: kernel, performance, storage &amp; security</strong></td><td>what a container really is (namespaces, cgroups), the full USE method this chapter only introduced, disks and LVM on loop files, and hardening that you verify rather than believe</td><td><code>strace -c</code>, <code>unshare</code>, <code>systemd-run -p MemoryMax=</code>, <code>mpstat</code>, <code>pidstat</code>, <code>perf</code>, <code>lsblk</code>, <code>lvextend</code>, <code>nft</code>, <code>sshd -T</code></td><td>you run a VPS, or Chapter 12 left you wanting the "why" behind the numbers</td></tr>
<tr><td><strong>15 · Your Linux skills on macOS and Windows</strong></td><td>zsh versus bash, BSD versus GNU tools (every <code>date -d</code> and <code>sed -i</code> surprise in one table), Homebrew and launchd, WSL2 and CRLF, and PowerShell for people who know Bash</td><td><code>brew</code>, <code>launchctl</code>, <code>gsed</code>, <code>wsl -l -v</code>, <code>wslpath</code>, <code>dos2unix</code>, <code>Get-ChildItem</code>, <code>Select-String</code></td><td>your team mixes a Mac, Windows and a Linux server — which is almost every student team</td></tr>
<tr><td><strong>16 · Capstone: build, automate and run a real server</strong></td><td>one small appointment-booking API taken from an empty Ubuntu machine to a hardened, deployed, monitored service, then a first week of eight classic incidents</td><td><code>bootstrap.sh</code>, <code>deploy.sh</code> with <code>flock</code> and release symlinks, systemd units and timers, <code>logrotate</code></td><td>after the others — it uses all of them. It ends with the <strong>20-question final exam</strong> of the whole course</td></tr>
</table>
<p>None of the four is required to use what you have already learned, and you can take 13, 14 and 15 in any order. The quiz right after this lesson now checks Chapter 12 only; the course-wide exam lives at the end of Chapter 16.</p>
<h3>Where to go next</h3>
<p>Three directions, depending on what you want to be able to do. None of them require finishing the others first.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Run things</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Containers, proxies, deployment</span><span class="lz-nsub">Docker gives you reproducible environments; nginx or Caddy puts them behind TLS; a CI pipeline builds and ships them. Everything in Chapter 11 and 12 applies unchanged — a container is a process with a restricted view.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Store things</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Databases, backups, migrations</span><span class="lz-nsub">PostgreSQL is the default answer and worth learning deeply. The operational half — backups you have restored, migrations that roll forward, connection pools that do not deadlock — is where Chapter 12's Recipe 6 comes back.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">See things</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Monitoring and observability</span><span class="lz-nsub">Prometheus, Grafana, structured logs, alerts that fire before users notice. Every "why did nothing tell us?" in this chapter is answered here, and it is the highest-leverage thing to learn after this course.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Go deeper in the shell</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bash mastery, then when to stop</span><span class="lz-nsub">Arrays, associative arrays, coprocesses, <code>shellcheck</code> as a habit. And the judgement to move to Python when a script passes about two hundred lines — knowing the boundary is part of knowing the tool.</span></div></div>
  </div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are about to be "the Linux person" on your SWP391 team. Turn this chapter into a kit you can carry to any machine.</p><ol>
<li>In your practice folder, save the sixty-second sweep from Lesson 12.1 as <code>~/thu-linux/sweep.sh</code>, with <code>#!/usr/bin/env bash</code> on the first line and <em>without</em> <code>set -e</code> — a sweep must keep going when one command is missing.</li>
<li><code>chmod +x</code> it, check it with <code>bash -n sweep.sh</code> (and <code>shellcheck sweep.sh</code> if installed), then run it in a throwaway container: <code>docker run --rm -v ~/thu-linux:/k ubuntu:24.04 bash /k/sweep.sh</code>.</li>
<li>Start <code>~/thu-linux/snippets.md</code> and copy in the five commands from this chapter you are least likely to remember — with one line each saying which symptom they answer.</li>
<li>Write one sentence per new chapter (13–16) saying which of your real projects it would help, and pick the one you will start with.</li></ol>
<p><strong>Done when:</strong> the container run prints all nine <code>=== … ===</code> headers even though some commands fail (a bare <code>ubuntu:24.04</code> answers <code>systemctl: command not found</code> and <code>journalctl: command not found</code> — that is the point), and <code>snippets.md</code> has five commands, each tied to a symptom.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Composition</span><span class="v">Building behaviour by joining small tools with pipes instead of writing one big program.</span></div>
  <div class="kv"><span class="k">Resolved / effective state</span><span class="v">What the system actually uses after all files and overrides — <code>sshd -T</code>, <code>systemctl cat</code>, <code>nginx -T</code>.</span></div>
  <div class="kv"><span class="k">Rehearsal mode</span><span class="v">A dry run: <code>--dry-run</code>, <code>-n</code>, <code>echo</code> before <code>rm</code> — seeing what would happen first.</span></div>
  <div class="kv"><span class="k">Snippets file</span><span class="v">Your own plain-text list of hard-won commands, each tied to the problem it solved.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">The final project that uses every chapter at once (Chapter 16).</span></div>
  <div class="kv"><span class="k">Runbook</span><span class="v">A written, step-by-step procedure for a known situation — the sweep and symptom table are the start of yours.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Twelve chapters, four arcs: moving around, composing, building and reaching out, running things for real.</li>
<li>A few dozen commands carry nearly all the work; remember that a capability exists and look up the flags.</li>
<li>Five habits beat any command: look before you change, fail loudly, verify resolved state, document, keep the second terminal.</li>
<li>Chapters 13–16 add advanced Bash, Linux internals, macOS/Windows, and a capstone that ends with the course-wide exam.</li>
<li>Keep the skill by running something real, reading your own logs weekly and maintaining a snippets file.</li>
</ul>
<a class="link-card codelab" href="/courses/nodejs/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Node.js — the full course on this site</span><span class="lc-sub">The application layer that sits on top of everything you just learned: processes, streams, event loop, HTTP, deployment. Chapter 11's service units run exactly this.</span></span>
</a>
<a class="link-card codelab" href="/courses/postgresql/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL — the full course on this site</span><span class="lc-sub">Schema design, indexes, transactions, and the operational side: backups, <code>EXPLAIN</code>, connection limits. The natural companion to this course.</span></span>
</a>
<a class="link-card codelab" href="/courses/git/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Git & GitHub — the full course on this site</span><span class="lc-sub">If Chapter 12's "what changed at 14:07" made you wish for better history, this is that skill: branches, rebases, bisect, and reading a repository like a log.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey</span><span class="lc-sub">Free, short, well-sequenced lessons that overlap this course and go further into kernel internals, networking and filesystems. A good second pass on anything that stayed fuzzy.</span></span>
</a>
<a class="link-card" href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener">
  <span class="lc-ico">🎮</span>
  <span class="lc-body"><span class="lc-title">OverTheWire — Bandit</span><span class="lc-sub">Thirty-odd levels solved entirely over SSH, each one a small puzzle in finding and reading files. The single best way to make Chapters 1–3 automatic rather than remembered.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">explainshell.com</span><span class="lc-sub">Paste any command line and it annotates every flag with the relevant man-page fragment. The fastest way to understand a command you found in someone else's script instead of pasting it blind.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck</span><span class="lc-sub">Static analysis for shell scripts, in the browser or as <code>apt install shellcheck</code>. It catches unquoted variables, useless <code>cat</code>s and the pipeline exit-code traps from Chapter 7 — automatically, every time.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the whole course, one lab at a time</span><span class="lc-sub">Every chapter's graded exercises in one place. If you skipped them while reading, this is the version of the course that actually sticks — reading about <code>awk</code> and using <code>awk</code> are different skills.</span></span>
</a>

<h3>How to keep it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Own a server</span><span class="v">The cheapest VPS you can find, for the price of a coffee a month. Break it, harden it, rebuild it. Nothing in this course becomes real until something you care about is running on a machine you are responsible for.</span></div>
  <div class="kv"><span class="k">Do the boring thing with a script</span><span class="v">Every task you do twice by hand is a script. It does not need to be good — it needs to exist, with <code>set -Eeuo pipefail</code> at the top. Ten small scripts teach more than one large one.</span></div>
  <div class="kv"><span class="k">Read your own logs</span><span class="v">Once a week, <code>journalctl -p warning --since '7 days ago'</code> on something you run. You will find things nobody reported, and you will learn what normal looks like — which is the only way to recognise abnormal.</span></div>
  <div class="kv"><span class="k">Keep a snippets file</span><span class="v">One plain-text file of commands that took you more than five minutes to work out. It beats searching the internet again, and re-reading it occasionally is genuine revision.</span></div>
  <div class="kv"><span class="k">Teach one thing</span><span class="v">Explain pipes, or permissions, or why <code>rm</code> on an open log frees nothing, to somebody who does not know. The gaps show up instantly, and they are always the parts you thought you understood.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> treating "I finished the course" as the finish line. The skill decays if it is never used, and it consolidates fast if it is: two weeks of running something real will fix more of what stayed fuzzy than re-reading any chapter. The failure mode is not forgetting commands — commands are searchable. It is losing the confidence to open a terminal on an unfamiliar machine and start looking, and that only comes back by doing it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Composition is the whole idea: small tools, one job each, joined by pipes — that is why sixty lessons fit in a few dozen commands. Verified state beats configuration you believe in, whether that is <code>sshd -T</code>, <code>systemctl cat</code> or an unauthenticated <code>curl</code>. And the most valuable habit in this entire course costs two seconds: look before you change, and keep the second terminal open.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Giờ bạn làm được gì, và học tiếp cái gì</h2>
<p class="lead">Hơn sáu mươi bài trước, khoá học này mở đầu bằng một lời khẳng định: terminal không phải chỗ để thuộc lòng những câu thần chú, mà là nơi một số ít ý tưởng ghép lại thành mọi thứ còn lại. Bài này là cái biên nhận. Nó là bản đồ những gì bạn đã đi qua, một thẻ tra cứu các câu lệnh gánh phần lớn công việc, và một câu trả lời thành thật cho "giờ thì sao".</p>
<div class="callout ok"><strong>Cập nhật (tháng 9/2026): khoá học không còn kết thúc ở đây.</strong> Bài này vẫn khép lại mười hai chương ban đầu, và mọi điều bên dưới vẫn đúng. Nhưng giờ có bốn chương mới nối tiếp — Bash nâng cao, Linux chuyên sâu, dùng kỹ năng Linux trên macOS và Windows, và một dự án cuối khoá kèm bài thi cuối khoá thật. Mục "Ngay trong khoá này: Chương 13–16" ở phía dưới nói mỗi chương thêm được gì và nên học theo thứ tự nào.</div>

<h3>Bốn cung đường</h3>
${slide('lx-12', 27, 'Bốn cung đường + bốn chương nâng cao')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cung 1 · Chương 0–2 — Đi lại được</span><span class="lz-lnote">Shell là gì, hệ thống file như MỘT cái cây, đường dẫn, và tạo/chép/dời/xoá file mà không sợ. Cung đường biến terminal từ một cái hộp đen thành một nơi bạn đi lại được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cung 2 · Chương 3–6 — Ghép nối</span><span class="lz-lnote">Luồng, ống dẫn và chuyển hướng; <code>grep</code>, <code>sed</code>, <code>awk</code>; quyền hạn và người dùng; tiến trình và tín hiệu; biến, dấu nháy và khai triển. Đây là cung đường mà shell thôi làm một trình duyệt file và trở thành một NGÔN NGỮ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cung 3 · Chương 7–9 — Dựng và vươn ra</span><span class="lz-lnote">Script hỏng thì kêu to chứ không hỏng trong im lặng; <code>PATH</code> và file khởi động; mạng, SSH, <code>curl</code>, <code>rsync</code> và tường lửa. Cung đường cho phép bạn tự động hoá công việc và vận hành những cái máy bạn không chạm tay vào được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cung 4 · Chương 10–12 — Chạy thật</span><span class="lz-lnote">Đĩa, gói phần mềm và log; dịch vụ, lịch chạy và gia cố; và một phương pháp chẩn đoán dùng được trên cái máy bạn chưa từng thấy. Cung đường tách "tôi biết dùng Linux" khỏi "tôi chịu trách nhiệm được cho một máy chủ".</span></div>
</div>
<p>Nếu bạn mở được một terminal trên một máy chủ lạ, tìm ra nó chạy những gì, đọc được vì sao có thứ hỏng, sửa nó, và để lại một thay đổi vẫn còn đúng sau khi máy khởi động lại — thì đó là toàn bộ khoá học, và đó là một kỹ năng MANG ĐI ĐƯỢC thật sự. Không có gì ở đây hết hạn cùng một framework.</p>

<h3>Những câu lệnh gánh phần lớn công việc</h3>
${slide('lx-12', 31, 'Bảng tra nhanh: lệnh và cờ của chương chẩn đoán')}
<p>Một máy Linux có hàng nghìn câu lệnh. Trên thực tế vài chục cái làm gần như mọi thứ. Hãy giữ cái thẻ này; phần còn lại tra cứu được.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đi lại và nhìn</span><span class="v"><code>cd</code> · <code>ls -la</code> · <code>pwd</code> · <code>tree -L 2</code> · <code>less</code> · <code>tail -f</code> · <code>file</code> · <code>stat</code> · <code>realpath</code></span></div>
  <div class="kv"><span class="k">Tìm</span><span class="v"><code>find . -name … -mtime …</code> · <code>grep -rn</code> · <code>which</code> / <code>command -v</code> · <code>locate</code> · <code>namei -l</code></span></div>
  <div class="kv"><span class="k">Đổi file</span><span class="v"><code>cp -a</code> · <code>mv</code> · <code>rm -i</code> · <code>mkdir -p</code> · <code>ln -s</code> · <code>tar czf</code> / <code>tar xzf</code> · <code>install -d -m</code></span></div>
  <div class="kv"><span class="k">Văn bản</span><span class="v"><code>cat</code> · <code>head</code>/<code>tail</code> · <code>sort</code> · <code>uniq -c</code> · <code>cut</code> · <code>tr</code> · <code>wc -l</code> · <code>sed -i</code> · <code>awk '{print \$2}'</code> · <code>jq</code></span></div>
  <div class="kv"><span class="k">Quyền hạn</span><span class="v"><code>chmod</code> · <code>chown</code> · <code>umask</code> · <code>sudo -u</code> · <code>id</code> · <code>groups</code> · <code>visudo</code></span></div>
  <div class="kv"><span class="k">Tiến trình</span><span class="v"><code>ps aux --sort=-%cpu</code> · <code>top</code>/<code>htop</code> · <code>pgrep -af</code> · <code>kill</code> · <code>jobs</code>/<code>bg</code>/<code>fg</code> · <code>nohup</code> · <code>timeout</code></span></div>
  <div class="kv"><span class="k">Tài nguyên</span><span class="v"><code>df -h</code> · <code>df -i</code> · <code>du -xh --max-depth=1</code> · <code>free -h</code> · <code>vmstat 1</code> · <code>iostat -xz 1</code> · <code>uptime</code></span></div>
  <div class="kv"><span class="k">Mạng</span><span class="v"><code>ss -tlnp</code> · <code>curl -sS -w</code> · <code>dig +short</code> · <code>getent hosts</code> · <code>nc -vz</code> · <code>ssh</code> · <code>scp</code> · <code>rsync -avz</code> · <code>ufw</code></span></div>
  <div class="kv"><span class="k">Dịch vụ và log</span><span class="v"><code>systemctl status/cat/show</code> · <code>journalctl -u -p -b --since</code> · <code>systemctl --failed</code> · <code>systemd-analyze calendar</code></span></div>
  <div class="kv"><span class="k">Viết script</span><span class="v"><code>set -Eeuo pipefail</code> · <code>trap</code> · <code>mktemp</code> · <code>flock</code> · <code>\${var:?}</code> · <code>case</code> · <code>while read -r</code> · <code>shellcheck</code></span></div>
</div>
<div class="callout ok"><strong>Không ai đòi bạn thuộc lòng mấy cái cờ.</strong> Thứ bạn cần nhớ là KHẢ NĂNG ĐÓ CÓ TỒN TẠI — rằng <code>df</code> có chế độ đếm inode, rằng <code>curl</code> in được các mốc thời gian, rằng <code>ss</code> lọc được theo trạng thái. Biết một chuyện là làm được mới là phần khó; <code>man</code>, <code>--help</code> và <code>tldr</code> lo nốt phần còn lại trong năm giây. Mọi người có kinh nghiệm mà bạn từng thấy làm việc nhanh đều đang làm đúng như vậy.</div>

<h3>Năm thói quen đáng giá hơn mọi câu lệnh</h3>
${slide('lx-12', 29, 'Sai lầm hay gặp — mặt trái của năm thói quen')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Nhìn trước khi đổi</span><span class="lz-t">ls trước rm · --dry-run trước rsync · in ra trước khi xoá</span><span class="lz-d">Mọi câu lệnh có tính phá huỷ đều có một chế độ diễn thử. Dùng nó tốn hai giây và đã cứu được nhiều dữ liệu hơn mọi hệ thống sao lưu từng được viết ra.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cho cái hỏng kêu to</span><span class="lz-t">set -Eeuo pipefail · mã thoát · kiểm giá trị trả về</span><span class="lz-d">Mặc định của shell là ĐI TIẾP sau khi có lỗi. Gần như mọi thảm hoạ script trong Chương 7 đều là một script cứ chạy tiếp sau khi bước ba đã hỏng.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Ưu tiên câu trả lời buồn tẻ nhưng KIỂM ĐƯỢC</span><span class="lz-t">sshd -T thay vì đọc file cấu hình · curl thay vì trình duyệt · systemctl cat thay vì cái file</span><span class="lz-d">Hãy hỏi hệ thống nó thật sự hiểu thành gì, đừng hỏi thứ bạn tin là mình đã cấu hình. File nói dối bằng cách bỏ sót; trạng thái đã được giải quyết thì không.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Để lại chỗ đó có tài liệu hơn lúc bạn tới</span><span class="lz-t">một dòng chú thích trong unit · một dòng trong README · một ghi chú việc-sau</span><span class="lz-d">Người tiếp theo gỡ lỗi chỗ này là BẠN, tám tháng nữa, không nhớ nổi một chút gì.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Đừng bao giờ đóng cái phiên đang chạy được</span><span class="lz-t">cái terminal thứ hai, trước một thay đổi rủi ro</span><span class="lz-d">Luật tường lửa, cấu hình sshd, đổi quyền trên một thư mục nhà. Mười giây chuẩn bị là khác biệt giữa một tiếng "ối" và một lần dựng lại từ đầu.</span></div>
</div>

<h3>Ngay trong khoá này: Chương 13–16</h3>
<p>Mười hai chương đầu dạy bạn DÙNG Linux và CHỊU TRÁCH NHIỆM cho một máy chủ. Bốn chương mới đi theo ba hướng — sâu hơn vào ngôn ngữ, sâu hơn vào cái máy, và rẽ ngang sang những chiếc laptop mà nhóm bạn thật sự dùng — rồi bắt bạn tự dựng trọn vẹn mọi thứ một lần, từ đầu tới cuối.</p>
<table>
<tr><th>Chương</th><th>Thêm được gì</th><th>Lệnh sẽ gặp</th><th>Nên học khi…</th></tr>
<tr><td><strong>13 · Bash nâng cao: cấu trúc dữ liệu, luồng &amp; tốc độ</strong></td><td>mảng chỉ số và mảng kết hợp, process substitution (thay thế tiến trình), bộ mô tả file và ống có tên, chạy song song, và script ở mức chuyên nghiệp — cộng với ranh giới thẳng thắn nơi Bash nên nhường việc cho Python</td><td><code>declare -A</code>, <code>mapfile</code>, <code>&lt;(…)</code>, <code>exec 3&gt;</code>, <code>mkfifo</code>, <code>xargs -P</code>, <code>wait -n</code>, <code>getopts</code>, <code>trap ERR</code>, <code>bats</code>, <code>shfmt</code></td><td><code>deploy.sh</code> của bạn đã dài quá trăm dòng</td></tr>
<tr><td><strong>14 · Linux chuyên sâu: nhân, hiệu năng, lưu trữ &amp; bảo mật</strong></td><td>container thật ra là gì (namespaces, cgroups), phương pháp USE đầy đủ mà chương này mới giới thiệu, đĩa và LVM trên file loop, và gia cố mà bạn KIỂM CHỨNG chứ không phải tin</td><td><code>strace -c</code>, <code>unshare</code>, <code>systemd-run -p MemoryMax=</code>, <code>mpstat</code>, <code>pidstat</code>, <code>perf</code>, <code>lsblk</code>, <code>lvextend</code>, <code>nft</code>, <code>sshd -T</code></td><td>bạn đang chạy một VPS, hoặc Chương 12 khiến bạn muốn biết "vì sao" đằng sau các con số</td></tr>
<tr><td><strong>15 · Dùng kỹ năng Linux trên macOS và Windows</strong></td><td>zsh so với bash, công cụ BSD so với GNU (mọi bất ngờ kiểu <code>date -d</code> và <code>sed -i</code> gom trong một bảng), Homebrew và launchd, WSL2 và CRLF, và PowerShell cho người đã biết Bash</td><td><code>brew</code>, <code>launchctl</code>, <code>gsed</code>, <code>wsl -l -v</code>, <code>wslpath</code>, <code>dos2unix</code>, <code>Get-ChildItem</code>, <code>Select-String</code></td><td>nhóm bạn trộn Mac, Windows và một máy chủ Linux — tức là gần như mọi nhóm sinh viên</td></tr>
<tr><td><strong>16 · Dự án cuối khoá: dựng, tự động hoá và vận hành một máy chủ thật</strong></td><td>một API đặt lịch nhỏ, đưa từ một máy Ubuntu trống tới một dịch vụ đã gia cố, đã deploy, có giám sát, rồi một tuần đầu với tám sự cố kinh điển</td><td><code>bootstrap.sh</code>, <code>deploy.sh</code> có <code>flock</code> và symlink bản phát hành, unit và timer systemd, <code>logrotate</code></td><td>sau cùng — nó dùng tới tất cả các chương kia. Nó kết thúc bằng <strong>bài thi cuối khoá 20 câu</strong> của cả khoá học</td></tr>
</table>
<p>Không chương nào trong bốn chương này là bắt buộc để dùng được những gì bạn đã học, và bạn học 13, 14, 15 theo thứ tự nào cũng được. Bài kiểm tra ngay sau bài này giờ chỉ kiểm Chương 12; bài thi toàn khoá nằm ở cuối Chương 16.</p>
<h3>Đi tiếp hướng nào</h3>
<p>Ba hướng, tuỳ vào việc bạn muốn làm được gì. Không hướng nào bắt bạn học xong hướng kia trước.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Chạy các thứ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Container, proxy, triển khai</span><span class="lz-nsub">Docker cho bạn môi trường tái lập được; nginx hay Caddy đặt chúng sau TLS; một quy trình CI dựng và đưa chúng đi. Mọi thứ trong Chương 11 và 12 áp dụng nguyên vẹn — một container là một tiến trình với tầm nhìn bị hạn chế.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lưu các thứ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cơ sở dữ liệu, sao lưu, migration</span><span class="lz-nsub">PostgreSQL là câu trả lời mặc định và đáng học sâu. Nửa vận hành của nó — những bản sao lưu bạn ĐÃ phục hồi, những migration tiến tới được, những bể kết nối không bế tắc — chính là chỗ Công thức 6 của Chương 12 quay lại.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nhìn thấy các thứ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Giám sát và khả quan sát</span><span class="lz-nsub">Prometheus, Grafana, log có cấu trúc, cảnh báo nổ trước khi người dùng nhận ra. Mọi câu "tại sao không có gì báo cho chúng ta?" trong chương này được trả lời ở đây, và đó là thứ đáng học nhất ngay sau khoá này.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Đi sâu hơn vào shell</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thạo Bash, rồi biết khi nào dừng</span><span class="lz-nsub">Mảng, mảng liên kết, coprocess, <code>shellcheck</code> thành thói quen. Và cái phán đoán để chuyển sang Python khi một script vượt khoảng hai trăm dòng — biết cái ranh giới đó cũng là một phần của việc biết dùng công cụ.</span></div></div>
  </div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn sắp trở thành "đứa rành Linux" của nhóm SWP391. Biến chương này thành một bộ đồ nghề mang tới máy nào cũng dùng được.</p><ol>
<li>Trong thư mục thực hành, lưu cuộc quét sáu mươi giây ở Bài 12.1 thành <code>~/thu-linux/sweep.sh</code>, dòng đầu là <code>#!/usr/bin/env bash</code> và <em>không</em> có <code>set -e</code> — cuộc quét phải chạy tiếp khi thiếu một lệnh.</li>
<li><code>chmod +x</code> nó, kiểm bằng <code>bash -n sweep.sh</code> (và <code>shellcheck sweep.sh</code> nếu đã cài), rồi chạy trong một container vứt đi: <code>docker run --rm -v ~/thu-linux:/k ubuntu:24.04 bash /k/sweep.sh</code>.</li>
<li>Mở <code>~/thu-linux/snippets.md</code> và chép vào năm câu lệnh của chương này mà bạn dễ quên nhất — mỗi câu kèm một dòng nói nó trả lời triệu chứng nào.</li>
<li>Viết một câu cho mỗi chương mới (13–16) nói nó giúp được dự án thật nào của bạn, rồi chọn chương bạn sẽ học trước.</li></ol>
<p><strong>Đạt khi:</strong> lần chạy trong container in đủ chín tiêu đề <code>=== … ===</code> dù vài lệnh báo lỗi (một <code>ubuntu:24.04</code> trần sẽ trả lời <code>systemctl: command not found</code> và <code>journalctl: command not found</code> — đó chính là mục đích), và <code>snippets.md</code> có năm câu lệnh, câu nào cũng gắn với một triệu chứng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Composition (ghép nối)</span><span class="v">Tạo ra hành vi bằng cách nối các công cụ nhỏ qua ống dẫn thay vì viết một chương trình lớn.</span></div>
  <div class="kv"><span class="k">Resolved / effective state (trạng thái đã phân giải)</span><span class="v">Thứ hệ thống thật sự dùng sau mọi file và mọi lớp đè — <code>sshd -T</code>, <code>systemctl cat</code>, <code>nginx -T</code>.</span></div>
  <div class="kv"><span class="k">Rehearsal / dry run (chạy thử)</span><span class="v"><code>--dry-run</code>, <code>-n</code>, <code>echo</code> trước <code>rm</code> — xem điều gì sẽ xảy ra trước đã.</span></div>
  <div class="kv"><span class="k">Snippets file (sổ mẩu lệnh)</span><span class="v">Danh sách văn bản thuần của riêng bạn gồm những lệnh khó mới có, mỗi lệnh gắn với vấn đề nó đã giải.</span></div>
  <div class="kv"><span class="k">Capstone (dự án cuối khoá)</span><span class="v">Dự án cuối dùng tới mọi chương cùng lúc (Chương 16).</span></div>
  <div class="kv"><span class="k">Runbook (sổ tay vận hành)</span><span class="v">Quy trình viết sẵn từng bước cho một tình huống đã biết — cuộc quét và bảng triệu chứng là trang đầu của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mười hai chương, bốn cung đường: đi lại được, ghép nối, dựng và vươn ra, chạy thật.</li>
<li>Vài chục câu lệnh gánh gần hết công việc; hãy nhớ rằng khả năng đó có tồn tại, còn cờ thì tra.</li>
<li>Năm thói quen hơn mọi câu lệnh: nhìn trước khi đổi, hỏng thì kêu to, kiểm trạng thái đã phân giải, ghi tài liệu, giữ terminal thứ hai.</li>
<li>Chương 13–16 thêm Bash nâng cao, ruột của Linux, macOS/Windows, và một dự án cuối khoá kết thúc bằng bài thi toàn khoá.</li>
<li>Giữ kỹ năng bằng cách chạy một thứ có thật, đọc log của chính mình hằng tuần và nuôi một sổ mẩu lệnh.</li>
</ul>
<a class="link-card codelab" href="/courses/nodejs/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Node.js — khoá đầy đủ trên trang này</span><span class="lc-sub">Tầng ứng dụng nằm trên mọi thứ bạn vừa học: tiến trình, luồng, vòng lặp sự kiện, HTTP, triển khai. Những unit dịch vụ ở Chương 11 chạy chính xác cái này.</span></span>
</a>
<a class="link-card codelab" href="/courses/postgresql/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL — khoá đầy đủ trên trang này</span><span class="lc-sub">Thiết kế lược đồ, chỉ mục, giao dịch, và mặt vận hành: sao lưu, <code>EXPLAIN</code>, giới hạn kết nối. Người bạn đồng hành tự nhiên của khoá này.</span></span>
</a>
<a class="link-card codelab" href="/courses/git/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Git & GitHub — khoá đầy đủ trên trang này</span><span class="lc-sub">Nếu câu "cái gì đã đổi lúc 14:07" ở Chương 12 khiến bạn ước gì lịch sử tốt hơn thì đây chính là kỹ năng đó: nhánh, rebase, bisect, và đọc một kho mã như đọc một cuốn nhật ký.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey</span><span class="lc-sub">Miễn phí, ngắn, sắp xếp mạch lạc, chồng lấn với khoá này và đi xa hơn vào ruột nhân, mạng và hệ thống file. Một lượt đọc thứ hai tốt cho bất cứ chỗ nào còn mờ.</span></span>
</a>
<a class="link-card" href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener">
  <span class="lc-ico">🎮</span>
  <span class="lc-body"><span class="lc-title">OverTheWire — Bandit</span><span class="lc-sub">Hơn ba mươi màn giải HOÀN TOÀN qua SSH, mỗi màn là một câu đố nhỏ về việc tìm và đọc file. Cách tốt nhất để biến Chương 1–3 thành phản xạ thay vì thành trí nhớ.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">explainshell.com</span><span class="lc-sub">Dán một dòng lệnh bất kỳ vào và nó chú giải từng cái cờ bằng đúng mẩu man tương ứng. Cách nhanh nhất để HIỂU một câu lệnh bạn nhặt trong script của người khác thay vì dán nó vào một cách mù quáng.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck</span><span class="lc-sub">Phân tích tĩnh cho script shell, chạy trên trình duyệt hoặc <code>apt install shellcheck</code>. Nó bắt biến không bọc nháy, những cú <code>cat</code> vô ích và các bẫy mã thoát của ống dẫn ở Chương 7 — tự động, lần nào cũng vậy.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: cả khoá học, từng phòng lab một</span><span class="lc-sub">Toàn bộ bài chấm điểm của mọi chương gom về một chỗ. Nếu bạn bỏ qua chúng trong lúc đọc thì đây mới là phiên bản khoá học ĐỌNG LẠI — đọc về <code>awk</code> và DÙNG <code>awk</code> là hai kỹ năng khác nhau.</span></span>
</a>

<h3>Làm sao để giữ được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sở hữu một máy chủ</span><span class="v">Cái VPS rẻ nhất bạn tìm được, giá bằng một ly cà phê mỗi tháng. Phá nó, gia cố nó, dựng lại nó. Không có gì trong khoá này trở thành THẬT cho tới khi có một thứ bạn quan tâm đang chạy trên một cái máy bạn chịu trách nhiệm.</span></div>
  <div class="kv"><span class="k">Làm cái việc buồn tẻ bằng một script</span><span class="v">Mọi việc bạn làm tay tới lần thứ hai đều là một script. Nó không cần hay — nó cần TỒN TẠI, với <code>set -Eeuo pipefail</code> ở đầu. Mười script nhỏ dạy nhiều hơn một script lớn.</span></div>
  <div class="kv"><span class="k">Đọc log của chính mình</span><span class="v">Mỗi tuần một lần, <code>journalctl -p warning --since '7 days ago'</code> trên một thứ bạn đang chạy. Bạn sẽ thấy những chuyện chẳng ai báo, và bạn sẽ học được thế nào là BÌNH THƯỜNG — cách duy nhất để nhận ra thứ bất thường.</span></div>
  <div class="kv"><span class="k">Giữ một file mẩu lệnh</span><span class="v">Một file văn bản thuần chứa những câu lệnh khiến bạn mất hơn năm phút để nghĩ ra. Nó hơn việc đi tìm lại trên internet, và đọc lại nó thi thoảng chính là ôn tập thật sự.</span></div>
  <div class="kv"><span class="k">Dạy một thứ</span><span class="v">Hãy giải thích ống dẫn, hoặc quyền hạn, hoặc vì sao <code>rm</code> lên một file log đang mở chẳng giải phóng được gì, cho một người chưa biết. Những chỗ hổng lộ ra ngay lập tức, và chúng luôn là những phần bạn tưởng mình đã hiểu.</span></div>
</div>

<div class="pitfall"><strong>Bẫy:</strong> coi "tôi học xong khoá rồi" là vạch đích. Kỹ năng này rơi rụng nếu không dùng, và nó đóng rắn rất nhanh nếu có dùng: hai tuần vận hành một thứ có thật sẽ chữa được nhiều chỗ còn mờ hơn là đọc lại bất cứ chương nào. Kiểu hỏng ở đây không phải quên câu lệnh — câu lệnh thì tra được. Nó là mất đi sự tự tin để mở một terminal trên một cái máy lạ và bắt đầu nhìn, và thứ đó chỉ quay lại bằng cách LÀM.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> GHÉP NỐI là toàn bộ ý tưởng: công cụ nhỏ, mỗi cái một việc, nối với nhau bằng ống dẫn — đó là lý do sáu mươi bài học gói gọn trong vài chục câu lệnh. Trạng thái đã kiểm chứng thắng cấu hình mà bạn tin tưởng, dù đó là <code>sshd -T</code>, <code>systemctl cat</code> hay một lệnh <code>curl</code> không xác thực. Và thói quen giá trị nhất trong cả khoá này tốn hai giây: nhìn trước khi đổi, và giữ cái terminal thứ hai luôn mở.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Chapter 12 check|||12.6 — Kiểm tra Chương 12',
      slug: 'lnx-12-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu về Chương 12: df với du, 203/EXEC, nc -z và reset, vmstat chờ đĩa, free trong container, 504, mã 137, CRLF, tiến trình chạy bản cũ, zombie.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Check</span>
<h2>Chapter 12 check: diagnosing a real server</h2>
<p class="lead">Ten questions, written the way incidents arrive: a symptom and some real output, and you decide what it means and what to run next. Every output in these questions was produced in the chapter's lab. (The course-wide final exam is now at the end of Chapter 16.)</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can run a read-only sweep, save it with <code>tee</code>, and say which branch — down, slow or weird — the incident belongs to.</li>
<li>I can read a systemd status code and know when the journal will be empty (<code>203/EXEC</code>) and when it will have the answer (<code>1/FAILURE</code>).</li>
<li>I can tell refused, timed out, reset and "name not known" apart, and I know <code>nc -z</code> cannot see a reset.</li>
<li>I can read <code>vmstat</code>, <code>free</code> and <code>df</code>/<code>df -i</code> and say whether the machine is computing, waiting, or out of space.</li>
<li>I can prove which code a process is running with <code>/proc/PID/cwd</code> and <code>ps -o lstart=</code>.</li>
<li>I know why <code>kill -9</code> does nothing to a zombie, and what <code>--init</code> fixes.</li>
</ul>
${slide('lx-12', 30, 'Bảng tra nhanh Chương 12')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Kiểm tra Chương 12: chẩn đoán một máy chủ thật</h2>
<p class="lead">Mười câu, viết theo đúng cách sự cố ập tới: một triệu chứng và một ít output thật, còn bạn quyết định nó nghĩa là gì và chạy gì tiếp theo. Mọi output trong các câu hỏi đều sinh ra trong phòng thí nghiệm của chương. (Bài thi cuối khoá toàn khoá giờ nằm ở cuối Chương 16.)</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy được một cuộc quét chỉ đọc, lưu nó bằng <code>tee</code>, và nói được sự cố thuộc nhánh nào — chết, chậm hay lạ.</li>
<li>Tôi đọc được mã trạng thái systemd và biết khi nào journal sẽ rỗng (<code>203/EXEC</code>), khi nào nó có câu trả lời (<code>1/FAILURE</code>).</li>
<li>Tôi phân biệt được refused, timed out, reset và "name not known", và biết <code>nc -z</code> không nhìn thấy reset.</li>
<li>Tôi đọc được <code>vmstat</code>, <code>free</code> và <code>df</code>/<code>df -i</code> để nói cái máy đang tính, đang chờ, hay đã hết chỗ.</li>
<li>Tôi chứng minh được một tiến trình đang chạy mã nào bằng <code>/proc/PID/cwd</code> và <code>ps -o lstart=</code>.</li>
<li>Tôi biết vì sao <code>kill -9</code> chẳng làm gì được zombie, và <code>--init</code> sửa được gì.</li>
</ul>
${slide('lx-12', 30, 'Bảng tra nhanh Chương 12')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'df -h /var shows 100% on a 40G disk, but du -sh /var reports only 2.1G. The team already deleted a huge log an hour ago. What do you run first?|||df -h /var báo 100% trên một đĩa 40G, nhưng du -sh /var chỉ ra 2,1G. Nhóm đã xoá một file log khổng lồ từ một tiếng trước. Bạn chạy gì đầu tiên?',
            options: [
              'sudo du -sh /* again, because du missed a directory|||sudo du -sh /* lần nữa, vì du đã bỏ sót một thư mục',
              'df -i /var, because the disk is out of inodes|||df -i /var, vì đĩa đã hết inode',
              'sudo lsof -nP +L1 — a process still holds the deleted file open, so its blocks are allocated but have no name|||sudo lsof -nP +L1 — một tiến trình vẫn giữ file đã xoá, nên các khối vẫn được cấp mà không còn tên',
              'rm -rf /var/log/* to free more space|||rm -rf /var/log/* để giải phóng thêm chỗ',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: df counts allocated blocks, du counts files it can reach by name. A large gap right after deleting a log is the signature of a deleted-but-open file: lsof +L1 lists it with NLINK 0 and "(deleted)", and truncating via /proc/PID/fd/N or restarting the writer frees it. df -i is tempting, but inode exhaustion shows as "No space" while df -h is NOT full — here df -h itself says 100%.|||VI: df đếm khối đã cấp, du đếm những file nó tìm thấy qua TÊN. Khoảng chênh lớn ngay sau khi xoá log là chữ ký của file đã xoá mà còn mở: lsof +L1 liệt kê nó với NLINK 0 và "(deleted)", cắt cụt qua /proc/PID/fd/N hoặc restart kẻ ghi là giải phóng. df -i hấp dẫn, nhưng hết inode biểu hiện thành "No space" trong khi df -h KHÔNG đầy — còn ở đây chính df -h báo 100%.',
          },
          {
            question: 'systemctl status api shows "status=203/EXEC" and journalctl -u api contains no line from the application at all. What is the fastest correct next step?|||systemctl status api hiện "status=203/EXEC" và journalctl -u api không có lấy một dòng nào từ ứng dụng. Bước tiếp theo đúng và nhanh nhất là gì?',
            options: [
              'ls -l the exact path in ExecStart= — it must exist, be absolute and executable; the app never ran, so there is no log to read|||ls -l đúng đường dẫn trong ExecStart= — nó phải tồn tại, là đường dẫn tuyệt đối và chạy được; app chưa từng chạy nên chẳng có log nào để đọc',
              'Raise the application log level and restart to get more detail|||Tăng mức log của ứng dụng rồi restart để có thêm chi tiết',
              'Run systemctl daemon-reload; 203 means the unit file is cached|||Chạy systemctl daemon-reload; 203 nghĩa là file unit đang bị đệm',
              'Check the database connection string in the .env file|||Kiểm chuỗi kết nối CSDL trong file .env',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 203/EXEC means systemd could not execute the file named in ExecStart — measured in the lab, the journal then says only "status=203/EXEC", nothing more. A higher log level cannot help a program that never started, and daemon-reload only matters after you edit the unit. Database problems show up as 1/FAILURE, after the app has run.|||VI: 203/EXEC nghĩa là systemd không chạy được file ghi trong ExecStart — đo thật trong phòng thí nghiệm, journal khi đó chỉ nói "status=203/EXEC", không hơn. Tăng mức log không giúp được một chương trình chưa từng khởi động, còn daemon-reload chỉ có ý nghĩa sau khi bạn sửa unit. Lỗi CSDL hiện ra thành 1/FAILURE, tức là sau khi app đã chạy.',
          },
          {
            question: 'nc -vz -w 3 127.0.0.1 19122 prints "Connection to 127.0.0.1 19122 port [tcp/*] succeeded!", yet curl http://127.0.0.1:19122/ prints "curl: (56) Recv failure: Connection reset by peer". What is going on?|||nc -vz -w 3 127.0.0.1 19122 in "Connection to 127.0.0.1 19122 port [tcp/*] succeeded!", vậy mà curl http://127.0.0.1:19122/ in "curl: (56) Recv failure: Connection reset by peer". Chuyện gì đang xảy ra?',
            options: [
              'A firewall is dropping the HTTP packets but not the TCP handshake|||Tường lửa đang vứt gói HTTP nhưng để lọt cái bắt tay TCP',
              'DNS resolves 127.0.0.1 to the wrong machine|||DNS phân giải 127.0.0.1 ra nhầm máy',
              'Nothing is listening on 19122; nc is caching an old result|||Không có gì nghe ở 19122; nc đang dùng kết quả cũ',
              'Something listens and completes the TCP handshake, then resets the connection mid-conversation — nc -z only tests the handshake, so look at the app or proxy log|||Có thứ đang nghe và làm xong bắt tay TCP, rồi reset kết nối giữa chừng — nc -z chỉ thử cái bắt tay, nên hãy xem log của app hoặc proxy',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: "succeeded" proves only that a TCP connection could be established; "reset by peer" (curl exit 56) means the other side hung up after that. This exact pair was measured against a server that accepts and then resets. A dropping firewall gives "timed out", nothing listening gives "refused" — neither would let nc succeed.|||VI: "succeeded" chỉ chứng minh thiết lập được kết nối TCP; "reset by peer" (curl thoát 56) nghĩa là phía bên kia cúp máy SAU đó. Đúng cặp này đã được đo với một server nhận kết nối rồi reset. Tường lửa vứt gói cho ra "timed out", không ai nghe cho ra "refused" — cả hai đều không để nc báo succeeded.',
          },
          {
            question: 'On a 10-core server that feels sluggish, vmstat 1 shows lines like "r=1 b=3 … us=10 sy=6 id=67 wa=17". Which resource is the bottleneck?|||Trên một máy chủ 10 nhân đang ì ạch, vmstat 1 cho những dòng kiểu "r=1 b=3 … us=10 sy=6 id=67 wa=17". Tài nguyên nào đang là nút thắt?',
            options: [
              'CPU — load is high, so the processors are saturated|||CPU — tải cao nên các nhân đã bão hoà',
              'Disk I/O — tasks are blocked (b=3) and the CPU idles while waiting for the disk (wa=17), with r far below the core count|||I/O đĩa — các tác vụ đang bị chặn (b=3) và CPU rảnh vì chờ đĩa (wa=17), còn r thấp xa so với số nhân',
              'Memory — the machine is swapping heavily|||Bộ nhớ — máy đang tráo trang dữ dội',
              'Network — wa means waiting for network packets|||Mạng — wa nghĩa là đang chờ gói tin mạng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: b counts tasks in uninterruptible sleep (usually disk), and wa is CPU time spent idle because of it; r=1 on 10 cores means the CPU is not the limit. This is the real line recorded while four dd processes wrote with O_DIRECT. Swapping would show nonzero si/so; wa is specifically I/O wait, not network.|||VI: b đếm tác vụ đang ngủ không ngắt được (thường là chờ đĩa), còn wa là thời gian CPU rảnh vì lý do đó; r=1 trên 10 nhân nghĩa là CPU không phải giới hạn. Đây là dòng thật ghi lại khi bốn tiến trình dd ghi với O_DIRECT. Tráo trang thì si/so phải khác 0; wa là chờ I/O, không phải chờ mạng.',
          },
          {
            question: 'Inside a container, free -h reports 4.9Gi available, yet the container keeps dying with exit 137 and docker inspect shows OOMKilled true. How can both be true?|||Bên trong một container, free -h báo còn 4,9Gi available, vậy mà container cứ chết với mã 137 và docker inspect cho OOMKilled true. Làm sao cả hai cùng đúng được?',
            options: [
              'free reads the host kernel and shows the whole machine; the container’s own limit is in /sys/fs/cgroup/memory.max, and exceeding it kills the process|||free đọc từ nhân của máy chủ nên hiện cả cái máy; trần riêng của container nằm ở /sys/fs/cgroup/memory.max, vượt nó là tiến trình bị giết',
              'free is broken inside containers and should be reinstalled|||free bị hỏng trong container và cần cài lại',
              'Exit 137 means SIGTERM, so the container was stopped normally|||Mã 137 nghĩa là SIGTERM, nên container chỉ bị dừng bình thường',
              'The host has no swap, so available memory is not usable|||Máy chủ không có swap, nên bộ nhớ available không dùng được',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured in the lab: free -h inside a --memory 512m container showed the 7.7Gi Docker VM, while memory.max said 536870912 and a 1.2 GB allocation was "Killed" with exit 137 and oom_kill 1 in memory.events. 137 is 128 + 9, SIGKILL — SIGTERM would be 143.|||VI: Đo thật trong phòng thí nghiệm: free -h trong một container --memory 512m hiện ra máy ảo Docker 7,7Gi, trong khi memory.max ghi 536870912 và một lần xin 1,2 GB bị "Killed" với mã 137 và oom_kill 1 trong memory.events. 137 là 128 + 9, tức SIGKILL — SIGTERM thì là 143.',
          },
          {
            question: 'Users get an error page and nginx’s error.log says "upstream timed out (110: Connection timed out) while reading response header from upstream". Which status code are they seeing, and what does it mean?|||Người dùng nhận trang lỗi và error.log của nginx ghi "upstream timed out (110: Connection timed out) while reading response header from upstream". Họ đang thấy mã nào, và nó nghĩa là gì?',
            options: [
              '502 — the application is down and refusing connections|||502 — ứng dụng đang chết và từ chối kết nối',
              '403 — nginx is denying access to the upstream|||403 — nginx đang chặn truy cập tới upstream',
              '504 — the app accepted the request but did not answer within proxy_read_timeout: it is alive but slow, so go to the "slow" recipes|||504 — app đã nhận request nhưng không trả lời trong proxy_read_timeout: nó còn sống nhưng chậm, nên hãy sang các công thức "nó chậm"',
              '500 — nginx itself crashed|||500 — chính nginx bị sập',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: In the lab, a /slow endpoint behind proxy_read_timeout 1s produced exactly this log line and a 504. A dead app gives 502 with "connect() failed (111: Connection refused)" instead — a different investigation. "while reading response header" is the tell: the connection worked, the answer never came.|||VI: Trong phòng thí nghiệm, một endpoint /slow đứng sau proxy_read_timeout 1s sinh ra đúng dòng log này và mã 504. App chết thì cho 502 kèm "connect() failed (111: Connection refused)" — một cuộc điều tra khác hẳn. Cụm "while reading response header" là manh mối: kết nối đã thông, còn câu trả lời thì không bao giờ tới.',
          },
          {
            question: 'What does this print on the last line? sleep 100 & kill -9 $!; wait $!; echo $?|||Dòng cuối của lệnh này in ra gì? sleep 100 & kill -9 $!; wait $!; echo $?',
            options: [
              '0',
              '9',
              '143',
              '137',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A process killed by a signal reports 128 + the signal number; SIGKILL is 9, so 137 (measured, with "Killed" printed by the shell just before). 143 is what plain kill (SIGTERM, 15) gives. 0 would mean it exited normally, and 9 is the signal, not the status.|||VI: Tiến trình bị tín hiệu giết sẽ báo 128 + số hiệu tín hiệu; SIGKILL là 9, nên ra 137 (đo thật, kèm chữ "Killed" do shell in ngay trước đó). 143 là thứ kill thường (SIGTERM, 15) cho ra. 0 nghĩa là thoát bình thường, còn 9 là tín hiệu chứ không phải mã trạng thái.',
          },
          {
            question: './deploy.sh fails with "cannot execute: required file not found" even though ls shows it, and file deploy.sh ends with "with CRLF line terminators". Which fix addresses the cause?|||./deploy.sh hỏng với "cannot execute: required file not found" dù ls vẫn thấy nó, và file deploy.sh kết thúc bằng "with CRLF line terminators". Cách sửa nào chạm đúng nguyên nhân?',
            options: [
              'chmod +x deploy.sh|||chmod +x deploy.sh',
              'Strip the carriage returns (sed -i "s/\\r$//" deploy.sh or dos2unix) and stop them coming back with core.autocrlf / .gitattributes "*.sh text eol=lf"|||Bỏ ký tự về đầu dòng (sed -i "s/\\r$//" deploy.sh hoặc dos2unix) và chặn nó quay lại bằng core.autocrlf / .gitattributes "*.sh text eol=lf"',
              'Run it with sudo|||Chạy nó bằng sudo',
              'Reinstall bash, because /bin/bash is missing|||Cài lại bash, vì /bin/bash bị mất',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The shebang is "#!/bin/bash\\r", so the kernel looks for an interpreter literally named /bin/bash\\r — the missing "required file" is that interpreter, not your script (exit 127, measured). chmod is irrelevant because the file is already executable (that would be 126, "Permission denied"), and /bin/bash itself is fine.|||VI: Dòng shebang là "#!/bin/bash\\r", nên nhân đi tìm một trình thông dịch tên đúng nghĩa đen là /bin/bash\\r — cái "required file" bị thiếu chính là trình thông dịch đó, không phải script của bạn (mã 127, đo thật). chmod không liên quan vì file đã chạy được (thiếu x thì là 126, "Permission denied"), còn /bin/bash vẫn nguyên vẹn.',
          },
          {
            question: 'You switched the /srv/app/current symlink to the new release 20 minutes ago, but users still see the old behaviour. ls -l /proc/4004/cwd shows /srv/releases/v1. What is the correct conclusion?|||Bạn đã chuyển symlink /srv/app/current sang bản phát hành mới từ 20 phút trước, nhưng người dùng vẫn thấy hành vi cũ. ls -l /proc/4004/cwd cho ra /srv/releases/v1. Kết luận đúng là gì?',
            options: [
              'The symlink change failed and must be repeated|||Việc đổi symlink đã thất bại và phải làm lại',
              'The browser is caching the old JavaScript|||Trình duyệt đang đệm JavaScript cũ',
              'The process resolved its working directory when it started and still runs v1; restart the service, then confirm with ps -o lstart=|||Tiến trình phân giải thư mục làm việc lúc nó khởi động và vẫn đang chạy v1; hãy restart dịch vụ, rồi xác nhận bằng ps -o lstart=',
              'The kernel caches symlinks for an hour|||Nhân đệm symlink trong một tiếng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: In the lab, ls -l /srv/app/current pointed to v2 while /proc/PID/cwd still pointed to v1 and the process start time was earlier than the new file’s mtime. The symlink worked; a running process simply never looks at it again. There is no hour-long symlink cache, and the browser cannot change a server process’s cwd.|||VI: Trong phòng thí nghiệm, ls -l /srv/app/current trỏ sang v2 trong khi /proc/PID/cwd vẫn trỏ v1 và giờ khởi động của tiến trình sớm hơn mtime của file mới. Symlink đã đổi thành công; chỉ là một tiến trình đang chạy không bao giờ nhìn lại nó. Không có bộ đệm symlink một tiếng nào cả, và trình duyệt không thể đổi thư mục làm việc của một tiến trình máy chủ.',
          },
          {
            question: 'Inside a container whose PID 1 is "node server.js", ps shows 40 lines "Z … [python3] <defunct>" with PPID 1, and kill -9 on them changes nothing. What is the right fix?|||Trong một container có PID 1 là "node server.js", ps cho thấy 40 dòng "Z … [python3] <defunct>" với PPID 1, và kill -9 lên chúng không đổi được gì. Cách sửa đúng là gì?',
            options: [
              'Run the container with an init as PID 1 (docker run --init, or init: true in Compose) so orphaned children are reaped|||Chạy container với một init làm PID 1 (docker run --init, hoặc init: true trong Compose) để các con mồ côi được dọn',
              'Run kill -9 again with sudo|||Chạy lại kill -9 bằng sudo',
              'Raise the container’s memory limit|||Nâng trần bộ nhớ của container',
              'Give the container more CPU so it can finish them|||Cho container thêm CPU để nó làm xong chúng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A zombie has already exited; only its parent can collect it with wait(). Orphans are re-parented to PID 1, and node (like sleep in the lab) never reaps them. Measured: the same experiment left "[sleep] <defunct>" in a plain container and nothing with --init, where /sbin/docker-init is PID 1. sudo cannot kill what is already dead, and zombies use no memory or CPU.|||VI: Zombie đã thoát rồi; chỉ tiến trình cha mới thu nó bằng wait(). Con mồ côi được PID 1 nhận nuôi, và node (giống sleep trong phòng thí nghiệm) không bao giờ dọn chúng. Đo thật: cùng thí nghiệm để lại "[sleep] <defunct>" trong container thường và không còn gì khi có --init, lúc /sbin/docker-init là PID 1. sudo không giết được thứ đã chết, còn zombie không tốn bộ nhớ hay CPU.',
          },
        ],
      },
    },
  ],
};
