const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 8: Sống trên một cái máy nhỏ.
 * Mọi số đo là ĐO THẬT: một cgroup v1 memory có giới hạn thật ở
 * /sys/fs/cgroup/memory/thu, OOM killer thật của nhân Linux 6.18 kèm log
 * dmesg, một tệp swap 512 MB bật thật, và hai hệ tệp ext4 loopback dựng
 * riêng để đo cạn khối và cạn inode.
 *
 * Nâng cấp 29/09/2026: bài 8.0 slide (deck dv-08, 32 slide) + slide/🧪/🗂/📌 trong 8.1–8.5; đào sâu đo lại trên
 * cgroup v2 (Docker Desktop, máy ảo Linux 7.0; VPS thí nghiệm dv08-vps = ubuntu:24.04 + systemd 255, --memory 1g):
 * exit 137 + OOMKilled=true + sự kiện oom, docker kill cũng 137 nhưng OOMKilled=false, memory.events/memory.peak,
 * systemd-run MemoryMax → Result: oom-kill, trần từng dịch vụ (3 ca), unit có OOMScoreAdjust/MemoryHigh/MemoryMax,
 * restart + OOM = vòng lặp, swap qua MemorySwapMax, đọc lại 200 vs 400 MB, vmstat si/so, PSI, swapfile từng bước,
 * --memory-swap mặc định gấp đôi, log json-file không xoay (15 → 43 MB), đĩa loop đầy/xoá còn mở/cạn inode,
 * hai `next build` thật song song cùng bị giết 137, Node 18 vs 20/22 đọc trần cgroup, ngân sách RAM VPS 6 GB.
 * ĐÃ SỬA: swapon với tệp 0644 chỉ CẢNH BÁO chứ không từ chối (8.3); bẫy "Node không biết nó ở trong container"
 * chỉ đúng tới Node 18 (8.5); lệnh đọc đỉnh bộ nhớ thêm bản cgroup v2 (memory.peak).
 */
import { gallery, slide } from './_slides.mjs';


export default {
  title: 'Chapter 8 — Living on a small machine: memory, the OOM killer, and disk|||Chương 8 — Sống trên một cái máy nhỏ: bộ nhớ, OOM killer, và đĩa',
  slug: 'deploy-ch8-may-nho',
  description: 'Mã thoát 137 là chữ ký của OOM killer, và nó không chọn thủ phạm — nó chọn cái TO NHẤT. Đo thật: một bản dựng chạy xong sạch sẽ trong khi cơ sở dữ liệu bị giết. Rồi phần đĩa: 162 MB trống mà vẫn "No space left on device".',
  sortOrder: 9,
  lessons: [

    /* ─────────────────────────── 8.0 ─────────────────────────── */
    {
      title: '8.0 — Chapter 8 slides: memory, the OOM killer and disk on a small machine|||8.0 — Slide Chương 8: bộ nhớ, OOM killer và đĩa trên một cái máy nhỏ',
      slug: 'deploy-8-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 8: mã 137 và OOMKilled=true, OOM killer chọn cái to nhất, trần cho từng dịch vụ, swap mua gì và trả gì, đĩa đầy/tệp xoá còn mở/cạn inode/log Docker không xoay, hai next build thật bị giết khi chạy song song, và ngân sách RAM cho VPS 6 GB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: an exit code with nothing in the application log, the kernel line that names the victim, a build that exits 0 while the database dies, a RAM ceiling that stays flat while swap grows behind it, a disk that is full three different ways, and two real <code>next build</code> runs killed together because they were started together.</p>
<p>Slides 3–7 belong to Lesson 8.1 (exit 137, <code>OOMKilled</code>, <code>dmesg</code>, <code>memory.events</code>), 8–12 to 8.2 (who the OOM killer takes, <code>oom_score_adj</code>, a ceiling per service, a systemd unit with soft and hard limits), 13–17 to 8.3 (swap, its cost, a swap file step by step, what <code>--memory-swap</code> really means, PSI), 18–22 to 8.4 (ENOSPC, deleted-but-open files, inodes, Docker logs that never rotate, what grows on a VPS) and 23–28 to 8.5 (parallel builds, moving the build off the server, Node's heap inside a container, a RAM budget for a 6 GB VPS, <code>docker stats</code>). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026: Docker Desktop on a Mac M1 (a Linux 7.0 VM with cgroup v2, 8 GB), an Ubuntu 24.04 container running real systemd 255 as the lab VPS, limited to 1 GiB, and small ext4 filesystems on loop devices inside it for the disk experiments. A real VPS has slower disks and fewer CPUs, so its milliseconds are usually larger; the shape of every result is the same. The slides are in Vietnamese; the diagrams, commands and output read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: một mã thoát mà log ứng dụng không có một chữ nào, dòng log của nhân gọi tên nạn nhân, một bản dựng thoát 0 trong khi cơ sở dữ liệu chết, một cái trần RAM nằm phẳng trong khi swap lớn dần phía sau, một cái đĩa đầy theo ba kiểu khác nhau, và hai lần <code>next build</code> thật bị giết cùng lúc vì được khởi động cùng lúc.</p>
<p>Slide 3–7 thuộc Bài 8.1 (mã 137, <code>OOMKilled</code>, <code>dmesg</code>, <code>memory.events</code>), 8–12 thuộc 8.2 (OOM killer bắt ai, <code>oom_score_adj</code>, trần cho từng dịch vụ, một unit systemd có trần mềm và trần cứng), 13–17 thuộc 8.3 (swap, cái giá của nó, swap file từng bước, <code>--memory-swap</code> thật ra nghĩa là gì, PSI), 18–22 thuộc 8.4 (ENOSPC, tệp đã xoá còn mở, inode, log Docker không bao giờ xoay, thứ lớn dần trên VPS) và 23–28 thuộc 8.5 (dựng song song, dời việc dựng khỏi máy chủ, heap của Node trong container, ngân sách RAM cho VPS 6 GB, <code>docker stats</code>). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT ghi ngày 29/09/2026: Docker Desktop trên Mac M1 (máy ảo Linux 7.0 chạy cgroup v2, 8 GB), một container Ubuntu 24.04 chạy systemd 255 thật làm VPS thí nghiệm, giới hạn 1 GiB, và các hệ tệp ext4 nhỏ trên thiết bị loop bên trong nó cho các thí nghiệm đĩa. VPS thật có đĩa chậm hơn và ít CPU hơn nên số mili giây thường lớn hơn; hình dạng của mọi kết quả thì y như vậy.</p>
</div>
${gallery('dv-08', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, '137 = 128 + 9'], [4, 'Đo thật: 137 và OOMKilled=true'], [5, 'dmesg gọi tên nạn nhân'], [6, 'systemd và memory.events'], [7, 'Bốn bộ quần áo; free nói dối'],
  [8, 'OOM killer chọn cái to nhất'], [9, 'Bản dựng thoát 0, CSDL chết'], [10, 'Thang oom_score_adj'], [11, 'Trần cho từng dịch vụ'], [12, 'Unit systemd và vòng lặp restart'],
  [13, 'Có swap: 137 thành 0'], [14, 'Cái giá của swap'], [15, 'Tạo swap file'], [16, '--memory-swap là tổng'], [17, 'Ba trạng thái và PSI'],
  [18, 'Đĩa đầy: ghi hỏng, xoá được'], [19, 'Tệp đã xoá còn mở'], [20, 'Cạn inode'], [21, 'Log Docker không xoay'], [22, 'Thứ lớn dần trên VPS'],
  [23, 'Hai next build song song: 137'], [24, 'Tuần tự và song song'], [25, 'Dời bản dựng khỏi VPS'], [26, 'Heap của Node trong container'], [27, 'Ngân sách RAM VPS 6 GB'], [28, 'docker stats và mem_limit'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2): RAM và OOM'], [31, 'Bảng tra nhanh (2/2): đĩa'], [32, 'Thực hành chương 8'],
])}
`,
    },

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Exit 137, and what the kernel writes down|||8.1 — Mã thoát 137, và thứ nhân hệ điều hành ghi lại',
      slug: 'deploy-8-1-ma-137',
      type: 'VIDEO',
      description: 'Một tiến trình xin 500 MB trong một giới hạn 256 MB, đo trong một cgroup THẬT. Nó chết sau 401 mili giây với mã 137 — và nhân hệ điều hành ghi lại chính xác vì sao, ở một chỗ mà log ứng dụng của bạn không bao giờ nhìn tới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Exit 137, and what the kernel writes down</h2>
<p class="lead">Your application did not crash. It did not throw. It did not log anything, because it was not asked to stop — it was removed. Exit code 137 is not an error your code produced; it is the kernel telling you it made a decision on your behalf.</p>

<h3>What 137 means</h3>
${slide('dv-08', 3, '137 = 128 + 9: bị gỡ đi, không phải vỡ')}
<p>A shell reports a process killed by signal <em>N</em> as exit code <strong>128 + N</strong>. Signal 9 is <code>SIGKILL</code>, which cannot be caught, blocked, or handled. So:</p>

<div class="kv-grid">
<div class="kv"><span class="k">137 = 128 + 9</span><span class="v">SIGKILL — almost always the OOM killer on a server</span></div>
<div class="kv"><span class="k">143 = 128 + 15</span><span class="v">SIGTERM — something asked politely; your handler ran (Chapter 3)</span></div>
<div class="kv"><span class="k">139 = 128 + 11</span><span class="v">SIGSEGV — a segmentation fault, usually native code</span></div>
<div class="kv"><span class="k">130 = 128 + 2</span><span class="v">SIGINT — somebody pressed Ctrl-C</span></div>
</div>

<p>The difference between 137 and 143 is the whole story. A 143 means your shutdown handler ran, connections drained, and the process chose to exit. A 137 means it was gone between one instruction and the next.</p>

<h3>Measuring it properly</h3>
${slide('dv-08', 4, 'Đo thật với Docker: exit 137 và OOMKilled=true')}
<p>The sandbox this course is written in has 16 GB of RAM, which is no use for measuring what happens on a 1 GB VPS. So the measurements below use a real control group with a real limit — the same mechanism Docker uses for <code>--memory</code>, and the same mechanism a cheap VPS uses to give you the slice you paid for:</p>

<pre><code class="language-bash">CG=/sys/fs/cgroup/memory/thu
mkdir -p \$CG
echo \$((256*1024*1024)) > \$CG/memory.limit_in_bytes
echo \$((256*1024*1024)) > \$CG/memory.memsw.limit_in_bytes   <span class="tok-comment"># khong cho tran sang swap</span>

<span class="tok-comment"># dua chinh shell nay vao cgroup, roi exec — tien trinh con thua ke</span>
( echo \$BASHPID > \$CG/cgroup.procs; exec node an-ram.mjs 500 )</code></pre>

<p>The program allocates one megabyte at a time and prints its RSS every fifty. Outside the cgroup it finishes cleanly. Inside:</p>

<div class="out">=== chay TRONG cgroup 256 MB: xin 500 MB ===
  da cap 0 MB, rss=43 MB
  da cap 50 MB, rss=96 MB
  da cap 100 MB, rss=146 MB
  da cap 150 MB, rss=197 MB
  da cap 200 MB, rss=247 MB
  ma thoat: 137 | mat 401 ms</div>

<p>It printed at 200 MB, and there is no line for 250. No error, no stack trace, no "out of memory" from Node. The last thing in the log is a normal progress message.</p>

<div class="callout warn">
<p><strong>This is why "the app just disappeared" is such a common bug report.</strong> Nothing in your application logs will ever mention it, because the process had no opportunity to write anything. If you go looking for the cause in the application log, the answer is not there and never will be. It is in the kernel ring buffer.</p>
</div>

<h3>Where the kernel writes it down</h3>
${slide('dv-08', 5, 'dmesg: constraint, oom_memcg, Killed process')}
<pre><code>dmesg | tail -20
<span class="tok-comment"># hoac tren may co systemd: journalctl -k --since "10 min ago"</span></code></pre>

<div class="out">[22651.337175] Tasks state (memory values in pages):
[22651.338131] [  pid  ]   uid  tgid total_vm      rss ... oom_score_adj name
[22651.340394] [   5046]     0  5046   316916    75022 ...              0 node
[22651.342618] oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=/,
               mems_allowed=0,oom_memcg=/thu,task_memcg=/thu,task=node,pid=5046,uid=0
[22651.345303] Memory cgroup out of memory: Killed process 5046 (node)
               total-vm:1267664kB, anon-rss:260556kB, file-rss:39532kB,
               shmem-rss:0kB, UID:0 pgtables:1092kB oom_score_adj:0</div>

<p>Every question you have is answered in those lines. <strong>Which process</strong>: pid 5046, named <code>node</code>. <strong>How much it was using</strong>: <code>anon-rss:260556kB</code>, about 254 MB of its own allocations plus 39 MB of file-backed pages. <strong>Why it was chosen</strong>: <code>oom_score_adj:0</code>, the default — 8.2 is about that number. And critically, <strong>which limit it hit</strong>:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">constraint=CONSTRAINT_MEMCG</span><span class="lz-lnote">a cgroup limit — your container or slice ran out, the machine may have plenty free</span></div>
<div class="lz-layer"><span class="lz-lname">constraint=CONSTRAINT_NONE</span><span class="lz-lnote">the whole machine ran out; this is the serious one</span></div>
<div class="lz-layer"><span class="lz-lname">constraint=CONSTRAINT_CPUSET / MEMORY_POLICY</span><span class="lz-lnote">NUMA placement; rare outside large servers</span></div>
</div>

<p>That distinction decides what you do next. <code>CONSTRAINT_MEMCG</code> and <code>free -m</code> showing gigabytes available means the fix is a container limit, not more RAM. <code>CONSTRAINT_NONE</code> means the machine genuinely ran out and something has to shrink.</p>

<h3>The cgroup keeps its own counters</h3>
${slide('dv-08', 6, 'systemd báo oom-kill; memory.events đếm cộng dồn')}
<pre><code>cat \$CG/memory.max_usage_in_bytes    <span class="tok-comment"># dinh cao nhat tung cham toi</span>
cat \$CG/memory.oom_control           <span class="tok-comment"># dem so lan bi giet</span>
cat \$CG/memory.stat                  <span class="tok-comment"># rss, cache, swap … tach ra</span></code></pre>

<div class="out">  memory.max_usage    : 256 MB
oom_kill_disable 0
under_oom 0
oom_kill 1</div>

<p><code>oom_kill 1</code> is a counter, not a flag — it accumulates. Reading it after a deploy tells you whether anything was killed during it, even if nobody was watching at the time. On a machine using cgroups v2 the equivalent lines live in <code>memory.events</code> as <code>oom</code> and <code>oom_kill</code>.</p>

<div class="pitfall">
<p><strong>Trap — <code>dmesg</code> is a ring buffer, so the evidence expires.</strong> It has a fixed size (often 1 MB or less) and old lines are overwritten by new ones. On a busy machine the OOM record from this morning may simply be gone by the afternoon, and you will be left with a mystery restart and no explanation. If a machine has systemd, <code>journalctl -k</code> reads the persisted copy; if it does not, arrange for the kernel log to be collected somewhere before you need it. Chapter 9 covers what to keep and for how long.</p>
</div>

<h3>Recognising it in the wild</h3>
${slide('dv-08', 7, 'Bốn bộ quần áo của một cú giết; free nói dối trong container')}
<p>Different tools show you the same event in different clothes:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">docker ps -a</span><span class="lz-t">Exited (137)</span><span class="lz-d">plus <code>OOMKilled: true</code> in <code>docker inspect</code></span></div>
<div class="lz-step"><span class="lz-k">systemd</span><span class="lz-t">Main process exited, code=killed, status=9/KILL</span><span class="lz-d">then a restart if <code>Restart=</code> is set</span></div>
<div class="lz-step"><span class="lz-k">a bash script</span><span class="lz-t">exit 137</span><span class="lz-d">and <code>Killed</code> printed by the shell&#39;s job control</span></div>
<div class="lz-step"><span class="lz-k">your application log</span><span class="lz-t">nothing at all</span><span class="lz-d">the last line is whatever it happened to be doing</span></div>
</div>

<p>This repository&#39;s own notes record it in the third form, twice: a parallel container build on a 6 GB VPS killed <code>next build</code> with exit 137, and a backend recreate race left a container in <code>Exited(137)</code> with orphans beside it. 8.5 reproduces the first of those on purpose.</p>


<h3>Run it yourself: the same kill on cgroup v2, through Docker</h3>
<p>The measurements above were taken on a cgroup v1 machine by writing the limit files by hand. Ubuntu 24.04 — the VPS this course targets — uses <strong>cgroup v2</strong>, and on it you almost never write those files yourself: Docker and systemd write them for you. Re-measured on 29/09/2026 in Docker Desktop on a Mac M1 (a Linux 7.0 virtual machine with cgroup v2), with the same kind of script — <code>an-ram.js</code> allocates one megabyte at a time and prints its RSS every fifty:</p>
<pre><code class="language-javascript">// an-ram.js &lt;MB&gt; — xin bộ nhớ từng 1 MB, in RSS mỗi 50 MB
const muc = Number(process.argv[2] || 500), giu = [];
for (let i = 0; i &lt;= muc; i++) {
  if (i % 50 === 0) console.log('da cap ' + i + ' MB, rss=' + Math.round(process.memoryUsage().rss / 2**20) + ' MB');
  giu.push(Buffer.alloc(2**20, 1));
}
console.log('XONG ' + muc + ' MB');</code></pre>
<pre><code class="language-bash">docker run --name dv08-oom --memory 256m --memory-swap 256m \\
  -v "$PWD":/w:ro node:22-alpine node /w/an-ram.js 500; echo "exit=$?"
docker inspect -f 'ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}' dv08-oom
docker events --since 3m --until 0s --filter container=dv08-oom</code></pre>
<div class="out">da cap 0 MB, rss=45 MB
da cap 50 MB, rss=98 MB
da cap 100 MB, rss=148 MB
da cap 150 MB, rss=199 MB
da cap 200 MB, rss=238 MB
exit=137
ExitCode=137 OOMKilled=true
… oom
… die exitCode=137</div>
<table><thead><tr><th>Flag / field</th><th>What it actually does</th></tr></thead><tbody>
<tr><td><code>--memory 256m</code></td><td>writes 256 MiB into the container's <code>memory.max</code> — the hard ceiling for RAM</td></tr>
<tr><td><code>--memory-swap 256m</code></td><td>the <em>total</em> of RAM plus swap. Equal to <code>--memory</code> means zero swap; leave it out and Docker allows as much swap again as RAM (Lesson 8.3 measures this)</td></tr>
<tr><td><code>.State.OOMKilled</code></td><td><code>true</code> only when the kernel's OOM killer killed a process in this container</td></tr>
<tr><td><code>docker events</code></td><td>an <code>oom</code> event arrives right before <code>die exitCode=137</code> — useful when nobody was watching</td></tr>
</tbody></table>
<p><code>OOMKilled</code> is the field that separates two causes with the same exit code. Measured on the same machine: a container stopped with <code>docker kill -s KILL</code> also exits <strong>137</strong>, but reports <code>OOMKilled=false</code>. Exit 137 says "SIGKILL"; only <code>OOMKilled=true</code> (or a kernel log line) says "for memory".</p>

<h3>Where the counters live on cgroup v2</h3>
<p>The file names changed between the two cgroup versions. What you will find on Ubuntu 22.04 and later:</p>
<table><thead><tr><th>cgroup v1 (used above)</th><th>cgroup v2 (Ubuntu 22.04+)</th><th>Meaning</th></tr></thead><tbody>
<tr><td><code>memory.limit_in_bytes</code></td><td><code>memory.max</code></td><td>hard RAM ceiling</td></tr>
<tr><td><code>memory.memsw.limit_in_bytes</code></td><td><code>memory.swap.max</code></td><td>v1: RAM + swap together · v2: swap alone</td></tr>
<tr><td><code>memory.max_usage_in_bytes</code></td><td><code>memory.peak</code></td><td>highest usage ever reached</td></tr>
<tr><td><code>memory.oom_control</code> → <code>oom_kill</code></td><td><code>memory.events</code> → <code>oom_kill</code></td><td>cumulative count of OOM kills</td></tr>
<tr><td>—</td><td><code>memory.high</code></td><td>soft ceiling: throttle and reclaim instead of kill</td></tr>
</tbody></table>
<p>Inside a container, <code>/sys/fs/cgroup/</code> <em>is</em> the container's own cgroup. For a systemd service the directory is <code>/sys/fs/cgroup/system.slice/&lt;name&gt;.service/</code>. Measured inside the lab VPS (a container limited to 1 GiB) after one kill:</p>
<pre><code class="language-bash">cd /sys/fs/cgroup
echo "memory.max  = $(cat memory.max)"; echo "memory.peak = $(cat memory.peak)"
cat memory.events</code></pre>
<div class="out">memory.max  = 1073741824
memory.peak = 173756416
low 0
high 0
max 37
oom 1
oom_kill 1
oom_group_kill 0
sock_throttled 0</div>
<p><code>max 37</code> counts how many times usage hit the ceiling and the kernel had to reclaim; <code>oom</code> counts how often reclaim failed; <code>oom_kill</code> counts processes actually killed. A deploy script can read <code>oom_kill</code> before and after and fail loudly if it grew.</p>

<h3>The same kill, reported by systemd</h3>
<p>On the lab VPS (Ubuntu 24.04 with systemd 255 running for real), <code>systemd-run</code> puts one command in its own temporary unit with a ceiling — no unit file needed:</p>
<pre><code class="language-bash">sudo systemd-run --unit=thu-oom -p MemoryMax=128M -p MemorySwapMax=0 --wait \\
  /usr/bin/node /home/deploy/an-ram.js 300
sudo journalctl -u thu-oom -o short-precise | tail -3</code></pre>
<div class="out">Running as unit: thu-oom.service; invocation ID: 72d808ae5f05417293da05bc94482dbe
Finished with result: oom-kill
Main processes terminated with: code=killed/status=KILL
Service runtime: 265ms
…
Memory peak: 128.0M
…
Sep 29 05:49:18.543356 cffcaaa5d26c systemd[1]: thu-oom.service: A process of this unit has been killed by the OOM killer.
Sep 29 05:49:18.558251 cffcaaa5d26c systemd[1]: thu-oom.service: Main process exited, code=killed, status=9/KILL
Sep 29 05:49:18.558337 cffcaaa5d26c systemd[1]: thu-oom.service: Failed with result 'oom-kill'.</div>
<p><code>--unit</code> names the temporary unit so you can query it afterwards; <code>-p MemoryMax=128M</code> is the ceiling; <code>-p MemorySwapMax=0</code> forbids swap so the result does not depend on whether the machine has any; <code>--wait</code> blocks until it finishes and prints the summary. systemd names the cause in plain words — <code>Result: oom-kill</code> — which is more than the application ever will.</p>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>Docker Desktop (Mac and Windows) runs containers inside a Linux virtual machine.</strong> Its memory setting (Settings → Resources) is the ceiling for everything; on the Mac used here <code>docker info</code> reported about 8 GB. A container with no <code>--memory</code> may use all of it, and an OOM then happens <em>in the VM</em> — it can take your local Postgres container with it.</li>
<li><strong><code>dmesg</code> on the Mac shows nothing about containers.</strong> The kernel that killed the process is the VM's. Read it through a short-lived privileged container: <code>docker run --rm --privileged alpine dmesg | grep -iE "oom-kill:|Killed process"</code> — that is how the kernel log on the slide above was captured.</li>
<li><strong>WSL 2</strong> is also a VM. By default it gets 50% of Windows' RAM and swap of 25% of that, rounded up to a whole GB (Microsoft's documentation, as of 09/2026); set <code>memory=</code> and <code>swap=</code> under <code>[wsl2]</code> in <code>%UserProfile%\\.wslconfig</code>. A teammate on Windows whose build "randomly dies" in WSL may simply be hitting that ceiling.</li>
<li><strong>Inside any container, <code>free</code> lies.</strong> Measured in the lab VPS container limited to 1 GiB: <code>free -m</code> reported a total of 7,934 MB — the whole VM — while <code>/sys/fs/cgroup/memory.max</code> said 1073741824. On a real KVM VPS, <code>free</code> describes the VPS truthfully; inside a container, read <code>memory.max</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, the team's backend container keeps disappearing. <code>docker ps -a</code> shows <code>Exited (137)</code>, the log ends on an ordinary line, and one teammate insists "the code didn't crash". Prove what killed it and which ceiling it hit — on the lab machine, not on the demo server.</p>
<ol>
<li>Save <code>an-ram.js</code> from this lesson into an empty folder and run it with <code>--memory 256m --memory-swap 256m</code> as above (name the container <code>dv08-oom</code>). Write down the last line it printed and the exit code.</li>
<li><code>docker inspect -f '{{.State.OOMKilled}}' dv08-oom</code> and <code>docker events --since 5m --until 0s --filter container=dv08-oom</code>. Find the <code>oom</code> event.</li>
<li>Read the kernel's side: <code>docker run --rm --privileged alpine dmesg | grep -iE "oom-kill:|Killed process" | tail -2</code>. Copy out <code>constraint=</code>, the process name and <code>anon-rss</code>.</li>
<li>Control experiment: <code>docker run -d --name dv08-k alpine sleep 300</code>, then <code>docker kill -s KILL dv08-k</code>, then inspect it the same way. Clean up with <code>docker rm dv08-oom dv08-k</code>.</li>
</ol>
<p><strong>Done when:</strong> you have four facts for the OOM run — exit 137, <code>OOMKilled=true</code>, an <code>oom</code> event, a <code>Killed process … (node)</code> line with <code>CONSTRAINT_MEMCG</code> — plus the control run showing exit 137 with <code>OOMKilled=false</code>, and one sentence explaining why the application log has no error in it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SIGKILL (9)</span><span class="v">The signal that cannot be caught; a shell reports it as exit 128 + 9 = 137.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel routine that picks a process to kill when memory cannot be reclaimed.</span></div>
  <div class="kv"><span class="k">cgroup</span><span class="v">A group of processes with shared limits; every container and every systemd service is one.</span></div>
  <div class="kv"><span class="k">memory.max</span><span class="v">The hard RAM ceiling of a cgroup v2 group; reaching it without reclaim means an OOM kill inside the group.</span></div>
  <div class="kv"><span class="k">memory.events</span><span class="v">cgroup v2 counters: <code>max</code>, <code>oom</code>, <code>oom_kill</code> — cumulative, so read them before and after.</span></div>
  <div class="kv"><span class="k">OOMKilled</span><span class="v">Docker's field that is true only when the kill was for memory; exit 137 alone is not proof.</span></div>
  <div class="kv"><span class="k">CONSTRAINT_MEMCG</span><span class="v">The kernel's note that a group's ceiling was hit, not the whole machine's memory.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Exit 137 is SIGKILL (128 + 9): the process was removed, it did not crash, and it wrote nothing about it.</li>
<li>The explanation lives in the kernel log (<code>dmesg</code>, <code>journalctl -k</code>), in <code>OOMKilled=true</code>, and in systemd's <code>Result: oom-kill</code> — never in the application log.</li>
<li><code>constraint=CONSTRAINT_MEMCG</code> means a container or unit ceiling was hit; <code>CONSTRAINT_NONE</code> means the whole machine ran out.</li>
<li>On cgroup v2 the ceiling is <code>memory.max</code>, the peak is <code>memory.peak</code>, and <code>memory.events</code> counts kills cumulatively.</li>
<li>Exit 137 alone is not proof of an OOM — <code>docker kill -s KILL</code> gives the same code with <code>OOMKilled=false</code>.</li>
<li>Inside a container <code>free</code> reports the host; the real ceiling is in <code>/sys/fs/cgroup/memory.max</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man 7 signal — the numbered signal table behind 128+N, and the note that SIGKILL and SIGSTOP cannot be caught or ignored.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Memory Resource Controller (cgroup v1)</span><span class="lc-sub">kernel.org/doc/Documentation/cgroup-v1/memory.txt — <code>memory.limit_in_bytes</code>, <code>memory.memsw.limit_in_bytes</code>, <code>memory.oom_control</code>: exactly the files used above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Control Group v2, memory.events</span><span class="lc-sub">docs.kernel.org/admin-guide/cgroup-v2.html — the v2 equivalents, including <code>memory.max</code>, <code>memory.high</code> and the <code>oom_kill</code> counter.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — runtime options for memory</span><span class="lc-sub">docs.docker.com/engine/containers/resource_constraints/ — <code>--memory</code> and <code>--memory-swap</code> are thin wrappers over the two cgroup files used in this lesson.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 5: processes, jobs &amp; signals</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the full signal table, <code>kill -l</code>, and why SIGKILL and SIGSTOP are the two a process can never handle.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — resource limits and what a container actually sees</span><span class="lc-sub">/courses/docker/learn${REF} — why a process inside a limited container still reads the host&#39;s total RAM from <code>/proc/meminfo</code>, and what that breaks.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Mã thoát 137, và thứ nhân hệ điều hành ghi lại</h2>
<p class="lead">Ứng dụng của bạn KHÔNG vỡ. Nó không ném lỗi. Nó không ghi log gì cả, vì nó không được YÊU CẦU dừng — nó bị GỠ ĐI. Mã thoát 137 không phải một lỗi do mã của bạn sinh ra; nó là nhân hệ điều hành báo cho bạn biết nó vừa ra một quyết định thay bạn.</p>

<h3>137 nghĩa là gì</h3>
${slide('dv-08', 3, '137 = 128 + 9: bị gỡ đi, không phải vỡ')}
<p>Một cái shell báo một tiến trình bị giết bởi tín hiệu <em>N</em> thành mã thoát <strong>128 + N</strong>. Tín hiệu 9 là <code>SIGKILL</code>, thứ không bắt được, không chặn được, không xử lý được. Vậy nên:</p>

<div class="kv-grid">
<div class="kv"><span class="k">137 = 128 + 9</span><span class="v">SIGKILL — trên một máy chủ thì gần như luôn là OOM killer</span></div>
<div class="kv"><span class="k">143 = 128 + 15</span><span class="v">SIGTERM — có ai đó hỏi lịch sự; handler của bạn ĐÃ chạy (Chương 3)</span></div>
<div class="kv"><span class="k">139 = 128 + 11</span><span class="v">SIGSEGV — lỗi phân đoạn, thường là mã gốc</span></div>
<div class="kv"><span class="k">130 = 128 + 2</span><span class="v">SIGINT — có người bấm Ctrl-C</span></div>
</div>

<p>Khác biệt giữa 137 và 143 chính là toàn bộ câu chuyện. 143 nghĩa là handler tắt máy của bạn đã chạy, các kết nối đã rút hết, và tiến trình CHỌN việc thoát. 137 nghĩa là nó biến mất giữa lệnh này và lệnh kế tiếp.</p>

<h3>Đo cho đàng hoàng</h3>
${slide('dv-08', 4, 'Đo thật với Docker: exit 137 và OOMKilled=true')}
<p>Cái hộp cát viết khoá học này có 16 GB RAM, chẳng dùng được gì cho việc đo xem chuyện gì xảy ra trên một VPS 1 GB. Nên các phép đo dưới đây dùng một control group THẬT với một giới hạn THẬT — đúng cái cơ chế Docker dùng cho <code>--memory</code>, và đúng cái cơ chế một VPS rẻ tiền dùng để cấp cho bạn phần bạn đã trả tiền:</p>

<pre><code class="language-bash">CG=/sys/fs/cgroup/memory/thu
mkdir -p \$CG
echo \$((256*1024*1024)) > \$CG/memory.limit_in_bytes
echo \$((256*1024*1024)) > \$CG/memory.memsw.limit_in_bytes   <span class="tok-comment"># khong cho tran sang swap</span>

<span class="tok-comment"># dua chinh shell nay vao cgroup, roi exec — tien trinh con thua ke</span>
( echo \$BASHPID > \$CG/cgroup.procs; exec node an-ram.mjs 500 )</code></pre>

<p>Chương trình cấp phát mỗi lần một megabyte và in RSS của nó sau mỗi năm mươi lần. Ngoài cgroup thì nó chạy xong êm. Bên trong:</p>

<div class="out">=== chay TRONG cgroup 256 MB: xin 500 MB ===
  da cap 0 MB, rss=43 MB
  da cap 50 MB, rss=96 MB
  da cap 100 MB, rss=146 MB
  da cap 150 MB, rss=197 MB
  da cap 200 MB, rss=247 MB
  ma thoat: 137 | mat 401 ms</div>

<p>Nó in ở mốc 200 MB, và KHÔNG có dòng nào cho mốc 250. Không lỗi, không vết ngăn xếp, không có "out of memory" nào từ Node. Thứ cuối cùng trong log là một dòng tiến độ bình thường.</p>

<div class="callout warn">
<p><strong>Đây là lý do "ứng dụng tự dưng biến mất" là một báo lỗi phổ biến tới thế.</strong> Sẽ KHÔNG có gì trong log ứng dụng của bạn nhắc tới nó, vì tiến trình không có cơ hội nào để ghi bất cứ thứ gì. Nếu bạn đi tìm nguyên nhân trong log ứng dụng, thì câu trả lời không ở đó và sẽ chẳng bao giờ ở đó. Nó nằm trong vòng đệm log của nhân hệ điều hành.</p>
</div>

<h3>Nhân hệ điều hành ghi nó ở đâu</h3>
${slide('dv-08', 5, 'dmesg: constraint, oom_memcg, Killed process')}
<pre><code>dmesg | tail -20
<span class="tok-comment"># hoac tren may co systemd: journalctl -k --since "10 min ago"</span></code></pre>

<div class="out">[22651.337175] Tasks state (memory values in pages):
[22651.338131] [  pid  ]   uid  tgid total_vm      rss ... oom_score_adj name
[22651.340394] [   5046]     0  5046   316916    75022 ...              0 node
[22651.342618] oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=/,
               mems_allowed=0,oom_memcg=/thu,task_memcg=/thu,task=node,pid=5046,uid=0
[22651.345303] Memory cgroup out of memory: Killed process 5046 (node)
               total-vm:1267664kB, anon-rss:260556kB, file-rss:39532kB,
               shmem-rss:0kB, UID:0 pgtables:1092kB oom_score_adj:0</div>

<p>Mọi câu hỏi bạn có đều được trả lời trong mấy dòng đó. <strong>Tiến trình nào</strong>: pid 5046, tên <code>node</code>. <strong>Nó đang dùng bao nhiêu</strong>: <code>anon-rss:260556kB</code>, khoảng 254 MB do chính nó cấp phát cộng 39 MB trang có tệp phía sau. <strong>Vì sao nó bị chọn</strong>: <code>oom_score_adj:0</code>, mặc định — bài 8.2 nói về con số đó. Và quan trọng nhất, <strong>nó chạm phải giới hạn NÀO</strong>:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">constraint=CONSTRAINT_MEMCG</span><span class="lz-lnote">một giới hạn cgroup — container hay lát cắt của bạn hết chỗ, cái máy có thể vẫn còn thừa mứa</span></div>
<div class="lz-layer"><span class="lz-lname">constraint=CONSTRAINT_NONE</span><span class="lz-lnote">CẢ CÁI MÁY hết chỗ; đây mới là cái nghiêm trọng</span></div>
<div class="lz-layer"><span class="lz-lname">constraint=CONSTRAINT_CPUSET / MEMORY_POLICY</span><span class="lz-lnote">bố trí NUMA; hiếm gặp ngoài các máy chủ lớn</span></div>
</div>

<p>Cái phân biệt đó quyết định bạn làm gì tiếp. <code>CONSTRAINT_MEMCG</code> mà <code>free -m</code> lại cho thấy còn hàng gigabyte nghĩa là cách chữa nằm ở giới hạn container, không phải ở việc mua thêm RAM. <code>CONSTRAINT_NONE</code> nghĩa là cái máy thật sự hết chỗ và phải có thứ gì đó nhỏ lại.</p>

<h3>Bản thân cgroup cũng giữ sổ riêng</h3>
${slide('dv-08', 6, 'systemd báo oom-kill; memory.events đếm cộng dồn')}
<pre><code>cat \$CG/memory.max_usage_in_bytes    <span class="tok-comment"># dinh cao nhat tung cham toi</span>
cat \$CG/memory.oom_control           <span class="tok-comment"># dem so lan bi giet</span>
cat \$CG/memory.stat                  <span class="tok-comment"># rss, cache, swap … tach ra</span></code></pre>

<div class="out">  memory.max_usage    : 256 MB
oom_kill_disable 0
under_oom 0
oom_kill 1</div>

<p><code>oom_kill 1</code> là một BỘ ĐẾM, không phải một cờ — nó cộng dồn. Đọc nó sau một lần deploy sẽ cho bạn biết có gì bị giết trong lúc đó không, kể cả khi lúc ấy chẳng ai ngồi nhìn. Trên một máy dùng cgroup v2 thì các dòng tương đương nằm ở <code>memory.events</code> dưới tên <code>oom</code> và <code>oom_kill</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>dmesg</code> là một vòng đệm, nên bằng chứng có HẠN SỬ DỤNG.</strong> Nó có kích thước cố định (thường 1 MB hoặc ít hơn) và dòng cũ bị dòng mới ghi đè. Trên một cái máy bận rộn, bản ghi OOM của sáng nay có thể đơn giản là đã biến mất vào buổi chiều, và bạn còn lại một cú khởi động lại bí ẩn không lời giải thích. Nếu máy có systemd, <code>journalctl -k</code> đọc bản đã lưu; nếu không, hãy thu xếp gom log nhân hệ điều hành về đâu đó TRƯỚC khi bạn cần tới. Chương 9 nói về việc giữ cái gì và giữ bao lâu.</p>
</div>

<h3>Nhận ra nó ngoài đời</h3>
${slide('dv-08', 7, 'Bốn bộ quần áo của một cú giết; free nói dối trong container')}
<p>Các công cụ khác nhau cho bạn xem cùng một sự kiện trong những bộ quần áo khác nhau:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">docker ps -a</span><span class="lz-t">Exited (137)</span><span class="lz-d">cộng <code>OOMKilled: true</code> trong <code>docker inspect</code></span></div>
<div class="lz-step"><span class="lz-k">systemd</span><span class="lz-t">Main process exited, code=killed, status=9/KILL</span><span class="lz-d">rồi một cú khởi động lại nếu có đặt <code>Restart=</code></span></div>
<div class="lz-step"><span class="lz-k">một script bash</span><span class="lz-t">exit 137</span><span class="lz-d">và chữ <code>Killed</code> do bộ điều khiển tác vụ của shell in ra</span></div>
<div class="lz-step"><span class="lz-k">log ứng dụng của bạn</span><span class="lz-t">KHÔNG GÌ CẢ</span><span class="lz-d">dòng cuối là bất cứ thứ gì nó tình cờ đang làm</span></div>
</div>

<p>Ghi chú của chính kho này lưu lại nó ở dạng thứ ba, hai lần: một lần dựng container song song trên VPS 6 GB đã giết <code>next build</code> với mã thoát 137, và một cuộc đua khi tạo lại backend để một container ở trạng thái <code>Exited(137)</code> kèm mấy cái mồ côi bên cạnh. Bài 8.5 tái hiện cái thứ nhất một cách có chủ đích.</p>


<h3>Tự chạy: đúng cú giết ấy trên cgroup v2, qua Docker</h3>
<p>Các số đo ở trên lấy trên một máy cgroup v1 bằng cách ghi tay vào các tệp giới hạn. Ubuntu 24.04 — cái VPS mà khoá này nhắm tới — dùng <strong>cgroup v2</strong>, và trên đó bạn gần như không bao giờ tự ghi các tệp ấy: Docker và systemd ghi hộ. Đo lại ngày 29/09/2026 trong Docker Desktop trên Mac M1 (một máy ảo Linux 7.0 chạy cgroup v2), với cùng kiểu script — <code>an-ram.js</code> xin bộ nhớ từng một megabyte và in RSS mỗi năm mươi:</p>
<pre><code class="language-javascript">// an-ram.js &lt;MB&gt; — xin bộ nhớ từng 1 MB, in RSS mỗi 50 MB
const muc = Number(process.argv[2] || 500), giu = [];
for (let i = 0; i &lt;= muc; i++) {
  if (i % 50 === 0) console.log('da cap ' + i + ' MB, rss=' + Math.round(process.memoryUsage().rss / 2**20) + ' MB');
  giu.push(Buffer.alloc(2**20, 1));
}
console.log('XONG ' + muc + ' MB');</code></pre>
<pre><code class="language-bash">docker run --name dv08-oom --memory 256m --memory-swap 256m \\
  -v "$PWD":/w:ro node:22-alpine node /w/an-ram.js 500; echo "exit=$?"
docker inspect -f 'ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}' dv08-oom
docker events --since 3m --until 0s --filter container=dv08-oom</code></pre>
<div class="out">da cap 0 MB, rss=45 MB
da cap 50 MB, rss=98 MB
da cap 100 MB, rss=148 MB
da cap 150 MB, rss=199 MB
da cap 200 MB, rss=238 MB
exit=137
ExitCode=137 OOMKilled=true
… oom
… die exitCode=137</div>
<table><thead><tr><th>Cờ / trường</th><th>Nó thật sự làm gì</th></tr></thead><tbody>
<tr><td><code>--memory 256m</code></td><td>ghi 256 MiB vào <code>memory.max</code> của container — trần CỨNG cho RAM</td></tr>
<tr><td><code>--memory-swap 256m</code></td><td><em>TỔNG</em> RAM cộng swap. Bằng <code>--memory</code> nghĩa là không swap; bỏ trống thì Docker cho thêm chừng ấy swap nữa (Bài 8.3 đo chuyện này)</td></tr>
<tr><td><code>.State.OOMKilled</code></td><td><code>true</code> CHỈ khi OOM killer của nhân giết một tiến trình trong container này</td></tr>
<tr><td><code>docker events</code></td><td>sự kiện <code>oom</code> tới ngay trước <code>die exitCode=137</code> — có ích khi lúc đó không ai nhìn</td></tr>
</tbody></table>
<p><code>OOMKilled</code> là trường tách hai nguyên nhân có CÙNG mã thoát. Đo trên cùng máy: một container bị dừng bằng <code>docker kill -s KILL</code> cũng thoát <strong>137</strong>, nhưng báo <code>OOMKilled=false</code>. Mã 137 chỉ nói "SIGKILL"; chỉ <code>OOMKilled=true</code> (hoặc một dòng log của nhân) mới nói "vì bộ nhớ".</p>

<h3>Các bộ đếm nằm ở đâu trên cgroup v2</h3>
<p>Tên tệp đã đổi giữa hai phiên bản cgroup. Thứ bạn sẽ gặp trên Ubuntu 22.04 trở về sau:</p>
<table><thead><tr><th>cgroup v1 (dùng ở trên)</th><th>cgroup v2 (Ubuntu 22.04+)</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td><code>memory.limit_in_bytes</code></td><td><code>memory.max</code></td><td>trần RAM cứng</td></tr>
<tr><td><code>memory.memsw.limit_in_bytes</code></td><td><code>memory.swap.max</code></td><td>v1: RAM + swap gộp · v2: RIÊNG swap</td></tr>
<tr><td><code>memory.max_usage_in_bytes</code></td><td><code>memory.peak</code></td><td>mức dùng cao nhất từng chạm</td></tr>
<tr><td><code>memory.oom_control</code> → <code>oom_kill</code></td><td><code>memory.events</code> → <code>oom_kill</code></td><td>số lần OOM giết, cộng dồn</td></tr>
<tr><td>—</td><td><code>memory.high</code></td><td>trần MỀM: bóp chậm và thu hồi thay vì giết</td></tr>
</tbody></table>
<p>Bên trong một container, <code>/sys/fs/cgroup/</code> CHÍNH LÀ cgroup của container đó. Với một dịch vụ systemd, thư mục là <code>/sys/fs/cgroup/system.slice/&lt;tên&gt;.service/</code>. Đo bên trong VPS thí nghiệm (một container giới hạn 1 GiB) sau một cú giết:</p>
<pre><code class="language-bash">cd /sys/fs/cgroup
echo "memory.max  = $(cat memory.max)"; echo "memory.peak = $(cat memory.peak)"
cat memory.events</code></pre>
<div class="out">memory.max  = 1073741824
memory.peak = 173756416
low 0
high 0
max 37
oom 1
oom_kill 1
oom_group_kill 0
sock_throttled 0</div>
<p><code>max 37</code> đếm số lần mức dùng chạm trần và nhân phải thu hồi; <code>oom</code> đếm số lần thu hồi thất bại; <code>oom_kill</code> đếm số tiến trình THẬT SỰ bị giết. Một script deploy đọc được <code>oom_kill</code> trước và sau, và báo hỏng thật to nếu nó tăng.</p>

<h3>Đúng cú giết ấy, do systemd báo</h3>
<p>Trên VPS thí nghiệm (Ubuntu 24.04, systemd 255 chạy thật), <code>systemd-run</code> đặt một lệnh vào một unit tạm có trần — không cần viết tệp unit:</p>
<pre><code class="language-bash">sudo systemd-run --unit=thu-oom -p MemoryMax=128M -p MemorySwapMax=0 --wait \\
  /usr/bin/node /home/deploy/an-ram.js 300
sudo journalctl -u thu-oom -o short-precise | tail -3</code></pre>
<div class="out">Running as unit: thu-oom.service; invocation ID: 72d808ae5f05417293da05bc94482dbe
Finished with result: oom-kill
Main processes terminated with: code=killed/status=KILL
Service runtime: 265ms
…
Memory peak: 128.0M
…
Sep 29 05:49:18.543356 cffcaaa5d26c systemd[1]: thu-oom.service: A process of this unit has been killed by the OOM killer.
Sep 29 05:49:18.558251 cffcaaa5d26c systemd[1]: thu-oom.service: Main process exited, code=killed, status=9/KILL
Sep 29 05:49:18.558337 cffcaaa5d26c systemd[1]: thu-oom.service: Failed with result 'oom-kill'.</div>
<p><code>--unit</code> đặt tên cho unit tạm để hỏi lại sau; <code>-p MemoryMax=128M</code> là trần; <code>-p MemorySwapMax=0</code> cấm swap để kết quả không phụ thuộc máy có swap hay không; <code>--wait</code> chờ tới khi xong rồi in bản tóm tắt. systemd gọi tên nguyên nhân bằng chữ thường — <code>Result: oom-kill</code> — nhiều hơn những gì ứng dụng từng nói.</p>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Docker Desktop (Mac lẫn Windows) chạy container bên trong một máy ảo Linux.</strong> Mức bộ nhớ trong phần cài đặt (Settings → Resources) là trần của TẤT CẢ; trên chiếc Mac dùng ở đây <code>docker info</code> báo khoảng 8 GB. Một container không có <code>--memory</code> được dùng hết chỗ đó, và khi OOM xảy ra thì nó xảy ra <em>trong máy ảo</em> — có thể kéo theo luôn container Postgres cục bộ của bạn.</li>
<li><strong><code>dmesg</code> trên Mac không nói gì về container.</strong> Nhân đã giết tiến trình là nhân của máy ảo. Đọc nó qua một container đặc quyền chạy chốc lát: <code>docker run --rm --privileged alpine dmesg | grep -iE "oom-kill:|Killed process"</code> — đó chính là cách log của nhân trên slide ở trên được lấy ra.</li>
<li><strong>WSL 2</strong> cũng là một máy ảo. Mặc định nó được 50% RAM của Windows và swap bằng 25% chỗ đó, làm tròn lên GB (tài liệu của Microsoft, tính đến 09/2026); đặt <code>memory=</code> và <code>swap=</code> dưới <code>[wsl2]</code> trong <code>%UserProfile%\\.wslconfig</code>. Bạn cùng nhóm dùng Windows mà bản dựng trong WSL "tự dưng chết" có khi chỉ là chạm trần đó.</li>
<li><strong>Bên trong mọi container, <code>free</code> nói dối.</strong> Đo trong container VPS thí nghiệm giới hạn 1 GiB: <code>free -m</code> báo tổng 7.934 MB — cả máy ảo — trong khi <code>/sys/fs/cgroup/memory.max</code> nói 1073741824. Trên một VPS KVM thật, <code>free</code> mô tả đúng cái VPS; bên trong container thì đọc <code>memory.max</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, container backend của nhóm cứ biến mất. <code>docker ps -a</code> báo <code>Exited (137)</code>, log kết thúc ở một dòng bình thường, và một bạn khăng khăng "code có crash đâu". Chứng minh cái gì đã giết nó và nó chạm trần nào — trên máy thí nghiệm, không phải trên máy chủ demo.</p>
<ol>
<li>Lưu <code>an-ram.js</code> của bài này vào một thư mục trống rồi chạy với <code>--memory 256m --memory-swap 256m</code> như trên (đặt tên container <code>dv08-oom</code>). Ghi lại dòng cuối nó in và mã thoát.</li>
<li><code>docker inspect -f '{{.State.OOMKilled}}' dv08-oom</code> và <code>docker events --since 5m --until 0s --filter container=dv08-oom</code>. Tìm sự kiện <code>oom</code>.</li>
<li>Đọc phía nhân: <code>docker run --rm --privileged alpine dmesg | grep -iE "oom-kill:|Killed process" | tail -2</code>. Chép ra <code>constraint=</code>, tên tiến trình và <code>anon-rss</code>.</li>
<li>Thí nghiệm đối chứng: <code>docker run -d --name dv08-k alpine sleep 300</code>, rồi <code>docker kill -s KILL dv08-k</code>, rồi inspect y như trên. Dọn bằng <code>docker rm dv08-oom dv08-k</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> có bốn sự thật cho lần OOM — mã 137, <code>OOMKilled=true</code>, một sự kiện <code>oom</code>, một dòng <code>Killed process … (node)</code> kèm <code>CONSTRAINT_MEMCG</code> — cộng lần đối chứng ra mã 137 với <code>OOMKilled=false</code>, và một câu giải thích vì sao log ứng dụng không có lỗi nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SIGKILL (tín hiệu giết, số 9)</span><span class="v">Tín hiệu không bắt được; shell báo nó thành mã thoát 128 + 9 = 137.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Đoạn mã của nhân chọn một tiến trình để giết khi không thu hồi được bộ nhớ.</span></div>
  <div class="kv"><span class="k">cgroup (nhóm kiểm soát)</span><span class="v">Một nhóm tiến trình chung giới hạn; mỗi container và mỗi dịch vụ systemd là một nhóm.</span></div>
  <div class="kv"><span class="k">memory.max (trần bộ nhớ)</span><span class="v">Trần RAM cứng của một nhóm cgroup v2; chạm nó mà không thu hồi được là một cú OOM TRONG nhóm.</span></div>
  <div class="kv"><span class="k">memory.events (sổ sự kiện bộ nhớ)</span><span class="v">Bộ đếm cgroup v2: <code>max</code>, <code>oom</code>, <code>oom_kill</code> — cộng dồn, nên đọc trước và sau.</span></div>
  <div class="kv"><span class="k">OOMKilled (bị OOM giết)</span><span class="v">Trường của Docker chỉ true khi cú giết là vì bộ nhớ; riêng mã 137 chưa phải bằng chứng.</span></div>
  <div class="kv"><span class="k">CONSTRAINT_MEMCG (ràng buộc nhóm bộ nhớ)</span><span class="v">Ghi chú của nhân rằng trần của MỘT NHÓM bị chạm, không phải cả máy hết bộ nhớ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã thoát 137 là SIGKILL (128 + 9): tiến trình bị gỡ đi, không phải vỡ, và nó không kịp viết gì về chuyện đó.</li>
<li>Lời giải thích nằm trong log của nhân (<code>dmesg</code>, <code>journalctl -k</code>), trong <code>OOMKilled=true</code>, và trong <code>Result: oom-kill</code> của systemd — không bao giờ trong log ứng dụng.</li>
<li><code>constraint=CONSTRAINT_MEMCG</code> nghĩa là trần của một container/unit bị chạm; <code>CONSTRAINT_NONE</code> nghĩa là cả máy hết.</li>
<li>Trên cgroup v2, trần là <code>memory.max</code>, đỉnh là <code>memory.peak</code>, và <code>memory.events</code> đếm số lần giết theo kiểu cộng dồn.</li>
<li>Riêng mã 137 không chứng minh OOM — <code>docker kill -s KILL</code> cho đúng mã ấy với <code>OOMKilled=false</code>.</li>
<li>Trong container, <code>free</code> báo số của máy chủ; trần thật nằm ở <code>/sys/fs/cgroup/memory.max</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man 7 signal — bảng tín hiệu đánh số nằm sau công thức 128+N, và ghi chú rằng SIGKILL với SIGSTOP thì không bắt và không bỏ qua được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Memory Resource Controller (cgroup v1)</span><span class="lc-sub">kernel.org/doc/Documentation/cgroup-v1/memory.txt — <code>memory.limit_in_bytes</code>, <code>memory.memsw.limit_in_bytes</code>, <code>memory.oom_control</code>: đúng những tệp dùng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Control Group v2, memory.events</span><span class="lc-sub">docs.kernel.org/admin-guide/cgroup-v2.html — các thứ tương đương ở v2, kể cả <code>memory.max</code>, <code>memory.high</code> và bộ đếm <code>oom_kill</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — tuỳ chọn runtime cho bộ nhớ</span><span class="lc-sub">docs.docker.com/engine/containers/resource_constraints/ — <code>--memory</code> và <code>--memory-swap</code> là lớp bọc mỏng lên hai tệp cgroup dùng trong bài này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 5: tiến trình, job &amp; tín hiệu</span><span class="lc-sub">/courses/linux-bash/learn${REF} — bảng tín hiệu đầy đủ, <code>kill -l</code>, và vì sao SIGKILL với SIGSTOP là hai tín hiệu một tiến trình không bao giờ xử lý được.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — giới hạn tài nguyên, và một container THẬT SỰ nhìn thấy gì</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao một tiến trình bên trong container bị giới hạn vẫn đọc ra tổng RAM của máy chủ từ <code>/proc/meminfo</code>, và chuyện đó làm hỏng cái gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Who the OOM killer takes|||8.2 — OOM killer bắt AI',
      slug: 'deploy-8-2-giet-ai',
      type: 'VIDEO',
      description: 'Bản dựng chạy XONG với mã thoát 0, và cơ sở dữ liệu bị giết. Đo thật hai lần theo hai chiều, rồi một dòng oom_score_adj đảo ngược kết quả: bản dựng chết, cơ sở dữ liệu sống.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Who the OOM killer takes</h2>
<p class="lead">The kernel is not looking for the process that caused the problem. It is looking for the one whose death frees the most memory. Those are usually not the same process, and on a small server they are almost never the same process.</p>

<h3>The measurement, in the harmless direction first</h3>
<p>A 256 MB cgroup holding a small, innocent process (20 MB, pretending to be a cache) and a growing one. The growing one is killed:</p>

<div class="out">  csdl pid=5439, giu 20 MB
  app ma thoat: 137
  csdl con song? CO</div>

<p>That looks like justice — the greedy process died, the small one lived. It is not justice, it is arithmetic: the growing process was simply the biggest thing in the group. Now reverse the sizes, which is what a real server looks like.</p>

<h3>The same rule, pointed the other way</h3>
${slide('dv-08', 8, 'Nhân giết cái TO NHẤT: csdl chết, bản dựng thoát 0')}
<p>Now the database is the big process — 180 MB of buffers, exactly as a database should be — and a build script asks for 120 MB on top of the 188 MB already resident:</p>

<div class="out">  csdl bao pid cua chinh no = 6998
  cgroup dung 188 MB / 256 MB
--- ban dung xin 120 MB ---
  build ma thoat : 0
  csdl /proc/6998  : DA BI GIET
  cgroup con dung: 0 MB

  [22736.696886] Memory cgroup out of memory: Killed process 6998 (node)
                 total-vm:1197276kB, anon-rss:191472kB ... oom_score_adj:0</div>

<div class="callout warn">
<p><strong>Read the two lines together.</strong> The build <strong>succeeded</strong> — exit code 0, it got its memory, it finished its job. The database was <strong>killed</strong>. The process that triggered the shortage walked away clean, and the process that was doing its job correctly, using memory exactly the way a database is supposed to, was the one removed. Nothing about that is a bug; it is the OOM killer working exactly as designed.</p>
</div>

<p>This is the shape of a real incident. Somebody runs a build, or a data export, or a one-off script on the production box. The script works. Twenty seconds later the site is down, and the person who ran the script has no reason to connect the two — their thing exited 0.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what you would want</span><span class="lz-t">kill the newcomer</span><span class="lz-d">the build is the thing that can be re-run at no cost</span></div>
<div class="lz-step"><span class="lz-k">what happens</span><span class="lz-t">kill the biggest</span><span class="lz-d">the database, because killing it frees the most at once</span></div>
<div class="lz-step"><span class="lz-k">why</span><span class="lz-t">the kernel needs memory NOW</span><span class="lz-d">it optimises for freeing pages, not for assigning blame</span></div>
</div>

<h3>The number that decides it</h3>
${slide('dv-08', 10, 'Thang oom_score_adj và các điểm đo thật')}
<p>Every process has a score, visible per-process and adjustable:</p>

<pre><code class="language-bash">cat /proc/&lt;pid&gt;/oom_score         <span class="tok-comment"># diem tinh ra, cang cao cang de bi giet</span>
cat /proc/&lt;pid&gt;/oom_score_adj     <span class="tok-comment"># -1000 … +1000, do BAN dat</span></code></pre>

<div class="out">  csdl pid=7782  oom_score=676  adj=0</div>

<p>The score is derived mostly from how much memory the process uses, as a proportion of what is available to it. <code>oom_score_adj</code> is your thumb on the scale: <strong>−1000</strong> means never pick this one if there is any alternative, <strong>+1000</strong> means pick this one first.</p>

<h3>Fixing it, measured</h3>
${slide('dv-08', 9, 'Đo lại trên cgroup v2: adj=0 thì csdl chết, adj=1000 thì bản dựng chết')}
<p>The textbook fix is to protect the database with <code>-1000</code>. In this sandbox that write was refused — lowering the value requires a privilege the container does not have:</p>

<div class="out">echo -1000 > /proc/7394/oom_score_adj
/bin/bash: line 21: echo: write error: Permission denied</div>

<p>So the measurement uses the same lever from the other end, which any process can do to itself: the build raises <em>its own</em> score before it starts allocating.</p>

<pre><code class="language-bash"><span class="tok-comment"># trong script dung, TRUOC khi cap phat gi:</span>
echo 1000 > /proc/self/oom_score_adj
exec node dung.mjs</code></pre>

<div class="out">  csdl pid=7782  oom_score=676  adj=0
--- ban dung tu NANG diem cua chinh no len 1000 truoc khi cap phat ---
  build ma thoat : 137    da cap 50 MB, rss=95 MB
  csdl /proc/7782  : CON SONG ← duoc cuu

  [22768.290223] Memory cgroup out of memory: Killed process 7795 (node)
                 total-vm:1075944kB, anon-rss:68208kB ... oom_score_adj:1000</div>

<p>Exactly reversed. The build died with 137, the database survived, and the kernel log records <code>oom_score_adj:1000</code> as the reason it chose that process despite it being the <em>smaller</em> one — 68 MB against the database&#39;s 191 MB.</p>

<div class="callout ok">
<p><strong>The rule to take away.</strong> Anything that runs <em>temporarily</em> on a production machine — a build, an import, a migration script, a backup job — should raise its own <code>oom_score_adj</code> before it starts. It costs one line, it needs no privileges, and it converts "the database died" into "the batch job died", which is a problem you can solve by running it again.</p>
</div>


<h3>Measured again on cgroup v2: the reversal, in Docker</h3>
<p>The same two experiments, repeated on 29/09/2026 in a <code>node:22-alpine</code> container limited to 256 MB with no swap. <code>giu.js</code> plays the database (it allocates N MB and then sits still); <code>an-ram.js</code> from Lesson 8.1 plays the build. The whole experiment is one small script:</p>
<pre><code class="language-bash">#!/bin/sh
# ai-chet.sh [adj_build] — CSDL 140 MB + bản dựng xin 120 MB trong cgroup 256 MB
node /w/giu.js 140 &amp; DB=$!
sleep 1.5
echo "truoc: csdl oom_score=$(cat /proc/$DB/oom_score) adj=$(cat /proc/$DB/oom_score_adj)"
echo "cgroup dung $(( $(cat /sys/fs/cgroup/memory.current) / 1048576 )) MB / $(( $(cat /sys/fs/cgroup/memory.max) / 1048576 )) MB"
echo "--- ban dung xin 120 MB (adj=\${1:-0}) ---"
timeout 20 sh -c "echo \${1:-0} &gt; /proc/self/oom_score_adj; exec node /w/an-ram.js 120" &gt; /tmp/b.log 2&gt;&amp;1
echo "  build ma thoat : $?   (dong cuoi: $(grep -E "da cap|XONG" /tmp/b.log | tail -1))"
if kill -0 $DB 2&gt;/dev/null; then echo "  csdl pid $DB   : CON SONG"; else echo "  csdl pid $DB   : DA BI GIET"; fi</code></pre>
<pre><code class="language-bash">docker run --rm --memory 256m --memory-swap 256m -v "$PWD":/w:ro node:22-alpine sh /w/ai-chet.sh 0
docker run --rm --memory 256m --memory-swap 256m -v "$PWD":/w:ro node:22-alpine sh /w/ai-chet.sh 1000</code></pre>
<div class="out">csdl pid=8 giu 140 MB
truoc: csdl oom_score=680 adj=0
cgroup dung 178 MB / 256 MB
--- ban dung xin 120 MB (adj=0) ---
  build ma thoat : 0   (dong cuoi: XONG 120 MB)
  csdl pid 8   : DA BI GIET

csdl pid=8 giu 140 MB
truoc: csdl oom_score=680 adj=0
cgroup dung 178 MB / 256 MB
--- ban dung xin 120 MB (adj=1000) ---
  build ma thoat : 137   (dong cuoi: da cap 50 MB, rss=98 MB)
  csdl pid 8   : CON SONG</div>
<p>Same shape as the v1 measurement, on a different kernel (7.0 instead of 6.18) and on cgroup v2: the build exits 0 and the database dies; one line of <code>oom_score_adj</code> swaps the outcome. Two details worth reading slowly. <code>timeout 20</code> is there because the first attempt, with a 180 MB "database", did not finish at all: the group sat at 255 of 256 MB and the build neither progressed nor died for two minutes — the kernel kept evicting the file pages of the <code>node</code> binary itself and reading them back. That frozen state is the no-swap cousin of the thrashing measured in 8.3, and it is why a machine at its limit can look hung rather than broken. And the <code>(dong cuoi: …)</code> column shows the build's last words: <code>XONG</code> when it won, an ordinary progress line when it was the one removed.</p>
<h3>Doing it properly with systemd</h3>
${slide('dv-08', 12, 'Unit systemd có trần mềm, trần cứng, điểm OOM; restart + OOM = vòng lặp')}
<p>If the machine has systemd, the setting belongs in the unit rather than in a script:</p>

<pre><code>[Service]
OOMScoreAdjust=-500        <span class="tok-comment"># for the service you do NOT want to lose</span>
MemoryMax=512M             <span class="tok-comment"># tran cung: vuot la bi giet</span>
MemoryHigh=400M            <span class="tok-comment"># tran mem: vuot thi bi bop cho cham lai truoc</span></code></pre>

<p><code>MemoryHigh</code> is worth knowing about specifically because it is the gentle version: a process over that line gets throttled and pushed to reclaim, rather than killed. A service that briefly spikes gets slowed down instead of removed, which is almost always what you want for something you cannot afford to lose.</p>

<div class="pitfall">
<p><strong>Trap — <code>Restart=always</code> plus an OOM turns a spike into a loop.</strong> The service is killed, systemd restarts it, it allocates its way back to the same ceiling, and it is killed again. Every restart drops connections and rebuilds caches, so each cycle is <em>more</em> expensive than the last and the machine degrades under a load it could otherwise have absorbed. Set <code>StartLimitIntervalSec</code> and <code>StartLimitBurst</code> so the unit gives up and stays down rather than thrashing — a service that is honestly down is easier to diagnose than one that is up for four seconds at a time.</p>
</div>


<h3>Per-service ceilings: keeping the OOM in its own pen (measured)</h3>
<p>Scores decide <em>who</em> dies once the kernel is choosing. Ceilings decide <em>who is even on the list</em>. When a process hits the ceiling of its own group, the kernel only looks inside that group (<code>CONSTRAINT_MEMCG</code>, 8.1) — the database in another group is not a candidate at all. Measured on the lab VPS, a container limited to 1 GiB playing the whole machine: a fake database runs as a systemd service holding 550 MB, then a "build" asks for 600 MB — more than fits beside it.</p>
<pre><code class="language-bash"># vps-ai.sh — rút gọn: csdl là một dịch vụ systemd, bản dựng là một unit tạm
sudo systemd-run --quiet --unit=csdl $CSDL_OPT /usr/bin/node /home/deploy/giu.js 550
sudo systemd-run --unit=build --wait "$@" /usr/bin/node /home/deploy/an-ram.js 600
systemctl show csdl -p ActiveState -p Result --value

./vps-ai.sh                                          # A: không trần nào
./vps-ai.sh -p MemoryMax=300M -p MemorySwapMax=0     # B: trần cho bản dựng
CSDL_OPT="-p OOMScoreAdjust=-900" ./vps-ai.sh        # C: điểm âm cho csdl</code></pre>
<div class="out">── A ──
csdl: 503 0  oom_score=710
  build: Finished with result: success
  build: Main processes terminated with: code=exited/status=0
  csdl : oom-kill failed
Killed process 11493 (node) total-vm:1171752kB, anon-rss:576896kB
── B ──
  build: Finished with result: oom-kill
  build: Memory peak: 300.0M
  csdl : success active
Killed process 11580 (node) total-vm:899748kB, anon-rss:305720kB
── C ──
csdl: 631 -900  oom_score=111
  build: Finished with result: oom-kill
  build: Memory peak: 444.8M
  csdl : success active
Killed process 11644 (node) total-vm:1049304kB, anon-rss:453380kB</div>
<p>Run A is 8.2 on a whole machine: the build succeeds and the 563 MB database is killed. Run B never let the build near the database: at 300 MB it was killed inside its own unit, and the database did not even get a score comparison. Run C also saves the database, but only after the build had eaten 445 MB of shared memory — the whole machine was under pressure for longer. The practical rule is to use both: <strong>a ceiling on everything temporary, a negative score on the thing that holds data.</strong></p>
<p>Docker gives you the pen for free: every container is its own cgroup. A <code>mem_limit</code> on every service in <code>compose.yaml</code> turns "the machine ran out, the kernel picks the biggest" into "the backend ran out, the backend restarts" — which is the failure you can survive.</p>
<h3>The thing you cannot fix with scores</h3>
<p>All of this is triage. If the machine genuinely does not have enough memory for the work, adjusting who dies first only changes which failure you get. The real questions are the ones 8.5 measures: does this work need to run on this machine at all, does it need to run at the same time as everything else, and is the peak it hits actually necessary?</p>

<div class="kv-grid">
<div class="kv"><span class="k">oom_score_adj +1000</span><span class="v">on anything temporary; one line, no privileges</span></div>
<div class="kv"><span class="k">oom_score_adj −1000</span><span class="v">on the database; needs privilege, so put it in the systemd unit</span></div>
<div class="kv"><span class="k">MemoryHigh</span><span class="v">throttle before killing — the gentler ceiling</span></div>
<div class="kv"><span class="k">the check afterwards</span><span class="v"><code>dmesg | grep -i oom</code> and the cgroup&#39;s own <code>oom_kill</code> counter, after every deploy</span></div>
</div>


<h3>Every memory knob, in systemd and in Docker</h3>
<table><thead><tr><th>systemd unit</th><th>docker run / compose</th><th>What it does</th></tr></thead><tbody>
<tr><td><code>MemoryMax=512M</code></td><td><code>--memory 512m</code> / <code>mem_limit: 512m</code></td><td>hard ceiling; crossing it without reclaim = OOM kill <em>inside</em> the group</td></tr>
<tr><td><code>MemoryHigh=400M</code></td><td>—</td><td>soft ceiling: the group is throttled and pushed to reclaim, not killed</td></tr>
<tr><td><code>MemorySwapMax=0</code></td><td><code>--memory-swap</code> / <code>memswap_limit</code> (the TOTAL, see 8.3)</td><td>how much swap the group may use</td></tr>
<tr><td><code>OOMScoreAdjust=-900</code></td><td><code>--oom-score-adj -900</code> / <code>oom_score_adj: -900</code></td><td>thumb on the scale; set from outside, so no privilege is needed inside</td></tr>
<tr><td><code>Restart=on-failure</code> + <code>StartLimitBurst=3</code></td><td><code>--restart on-failure:3</code> / <code>restart:</code></td><td>restart after a kill — and give up after a few, instead of looping</td></tr>
</tbody></table>
<p>Measured on the lab VPS with the unit from the slide above (a fake database holding 200 MB):</p>
<pre><code class="language-bash">systemctl show csdl-thu -p MemoryMax -p MemoryHigh -p MemorySwapMax -p OOMScoreAdjust
PID=$(systemctl show csdl-thu -p MainPID --value)
cat /proc/$PID/oom_score_adj /proc/$PID/oom_score</code></pre>
<div class="out">MemoryHigh=419430400
MemoryMax=536870912
MemorySwapMax=0
OOMScoreAdjust=-900
-900
70</div>
<p>And the loop the pitfall above warns about, measured with Docker's equivalent of <code>Restart=always</code>: a container limited to 128 MB whose program always wants 300 MB, with <code>--restart unless-stopped</code>. Fifteen seconds later:</p>
<div class="out">NAMES       STATUS
dv08-loop   Restarting (137) Less than a second ago
RestartCount=8 OOMKilled=true ExitCode=137</div>
<p>Eight kills in fifteen seconds, and <code>docker ps</code> at any given instant shows a container that is "Restarting" rather than down. That is the state in which a site is unreachable while every "is the container there?" check says yes. <code>RestartCount</code> and <code>OOMKilled</code> in <code>docker inspect</code> are the two fields that tell the truth.</p>

<h3>When to use which</h3>
<ul>
<li><strong>A one-off job on a production machine</strong> (build, import, backup): raise its own <code>oom_score_adj</code> to 1000 <em>and</em> run it under a ceiling (<code>systemd-run --scope -p MemoryMax=…</code> or a container with <code>--memory</code>). One line each.</li>
<li><strong>The database</strong>: a ceiling generous enough for its <code>shared_buffers</code> plus connections, and a negative score (−500 to −900) set from outside. Not −1000 as a reflex — a database that leaks and can never be chosen leaves the kernel killing everything around it.</li>
<li><strong>Stateless services</strong> (API, Next.js server): a ceiling and a restart policy with a limit. Losing one is a restart; losing the database is an incident.</li>
<li><strong>Never</strong> "fix" OOM kills by removing ceilings. It moves the kill from a small group to the whole machine, where the biggest process — the database — is the one chosen.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate runs <code>npm run build</code> directly on the group's demo VPS "just to check". It prints "Compiled successfully", and twenty seconds later the site returns 500s because PostgreSQL is gone. Show the team, with numbers, why the build's exit 0 does not make it innocent — and how to make the same mistake harmless.</p>
<ol>
<li>Save <code>giu.js</code> (allocate N MB with <code>Buffer.alloc</code>, then <code>setInterval(() =&gt; {}, 1e6)</code>) and <code>ai-chet.sh</code> from this lesson next to <code>an-ram.js</code>. Run <code>ai-chet.sh 0</code> and <code>ai-chet.sh 1000</code> in <code>--memory 256m --memory-swap 256m</code>.</li>
<li>On the lab VPS (<code>ssh -i khoa -p 19082 deploy@127.0.0.1</code>, systemd running): run the three cases of <code>vps-ai.sh</code> and fill in a table: who died, what <code>Result</code> each unit reported.</li>
<li>Write <code>csdl-thu.service</code> with <code>OOMScoreAdjust=-900</code>, <code>MemoryHigh=400M</code>, <code>MemoryMax=512M</code>, start it, and confirm with <code>systemctl show</code> and <code>/proc/&lt;pid&gt;/oom_score_adj</code>.</li>
<li>Try <code>echo -1000 &gt; /proc/self/oom_score_adj</code> as a normal user and as root inside a default container; note which one is refused and why.</li>
</ol>
<p><strong>Done when:</strong> your table shows A → database killed while the build exits 0, B and C → build killed while the database stays <code>active</code>; <code>systemctl show</code> prints <code>OOMScoreAdjust=-900</code>; and you can explain in two sentences why a ceiling is a stronger protection than a score.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">oom_score</span><span class="v">The kernel's current badness score for a process; higher is chosen first.</span></div>
  <div class="kv"><span class="k">oom_score_adj</span><span class="v">Your adjustment, −1000 to +1000; raising is free, lowering needs <code>CAP_SYS_RESOURCE</code>.</span></div>
  <div class="kv"><span class="k">OOMScoreAdjust=</span><span class="v">The systemd directive that sets the adjustment from outside, at start.</span></div>
  <div class="kv"><span class="k">MemoryHigh=</span><span class="v">Soft ceiling: over it, the group is slowed and reclaimed rather than killed.</span></div>
  <div class="kv"><span class="k">MemoryMax=</span><span class="v">Hard ceiling: over it, a process in that group is killed.</span></div>
  <div class="kv"><span class="k">Restart loop</span><span class="v">Kill → restart → same peak → kill; stop it with <code>StartLimitBurst</code> or a retry limit.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">How much dies when something fails; per-service ceilings keep it to one service.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The OOM killer picks the process whose death frees the most memory, not the one that caused the shortage — on a VPS that is usually the database.</li>
<li>Measured on two kernels and both cgroup versions: the build exits 0 and the database dies; raising the build's own <code>oom_score_adj</code> to 1000 reverses it.</li>
<li>A ceiling per service (<code>MemoryMax</code>, <code>mem_limit</code>) keeps the kill inside the group that overran, so the database is never a candidate.</li>
<li>Lowering a score needs privilege, so set it from outside: <code>OOMScoreAdjust=</code>, <code>--oom-score-adj</code>, <code>oom_score_adj:</code>.</li>
<li>Restart plus an OOM is a loop — 8 kills in 15 seconds measured; cap retries and watch <code>RestartCount</code>.</li>
<li>Scores and ceilings are triage; the real fix for a build is not running it on the production machine (8.5).</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/[pid]/oom_score and oom_score_adj</span><span class="lc-sub">man 5 proc — the documented range, and the note that lowering the value requires CAP_SYS_RESOURCE, which is exactly the refusal measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — OOM killer implementation notes</span><span class="lc-sub">docs.kernel.org/admin-guide/mm/concepts.html and <code>mm/oom_kill.c</code> — how <code>oom_badness()</code> combines RSS, swap and page tables into the score.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.resource-control(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.resource-control.html — <code>MemoryMax</code>, <code>MemoryHigh</code>, <code>OOMScoreAdjust</code> and <code>OOMPolicy</code>, the declarative form of everything in this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Linux memory overcommit</span><span class="lc-sub">postgresql.org/docs/current/kernel-resources.html#LINUX-MEMORY-OVERCOMMIT — PostgreSQL&#39;s own advice on protecting the postmaster from the OOM killer, and why it sets its children&#39;s scores differently.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 11: systemd &amp; cron</span><span class="lc-sub">/courses/linux-bash/learn${REF} — writing unit files, <code>systemctl show</code>, and restart policies, the machinery every directive above plugs into.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — shared_buffers, work_mem and where the memory goes</span><span class="lc-sub">/courses/postgresql/learn${REF} — why the database is legitimately the largest process on the box, which is what makes it the default target.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>OOM killer bắt AI</h2>
<p class="lead">Nhân hệ điều hành KHÔNG đi tìm cái tiến trình gây ra vấn đề. Nó đi tìm cái mà giết đi thì giải phóng được nhiều bộ nhớ nhất. Hai cái đó thường không phải một, và trên một máy chủ nhỏ thì gần như không bao giờ là một.</p>

<h3>Phép đo, theo chiều vô hại trước</h3>
<p>Một cgroup 256 MB chứa một tiến trình nhỏ, vô tội (20 MB, giả làm bộ đệm) và một tiến trình đang phình. Cái đang phình bị giết:</p>

<div class="out">  csdl pid=5439, giu 20 MB
  app ma thoat: 137
  csdl con song? CO</div>

<p>Trông như công lý — tiến trình tham lam chết, tiến trình nhỏ sống. Nó không phải công lý, nó là SỐ HỌC: tiến trình đang phình đơn giản là thứ TO NHẤT trong nhóm. Giờ đảo ngược kích thước lại, và đó mới là hình dạng của một máy chủ thật.</p>

<h3>Cùng một luật, chĩa theo hướng khác</h3>
${slide('dv-08', 8, 'Nhân giết cái TO NHẤT: csdl chết, bản dựng thoát 0')}
<p>Giờ cơ sở dữ liệu là tiến trình to — 180 MB bộ đệm, đúng như một cơ sở dữ liệu NÊN thế — và một script dựng xin thêm 120 MB nữa lên trên 188 MB đã thường trú:</p>

<div class="out">  csdl bao pid cua chinh no = 6998
  cgroup dung 188 MB / 256 MB
--- ban dung xin 120 MB ---
  build ma thoat : 0
  csdl /proc/6998  : DA BI GIET
  cgroup con dung: 0 MB

  [22736.696886] Memory cgroup out of memory: Killed process 6998 (node)
                 total-vm:1197276kB, anon-rss:191472kB ... oom_score_adj:0</div>

<div class="callout warn">
<p><strong>Đọc hai dòng đó cùng nhau.</strong> Bản dựng <strong>THÀNH CÔNG</strong> — mã thoát 0, nó lấy được bộ nhớ, nó làm xong việc. Cơ sở dữ liệu <strong>BỊ GIẾT</strong>. Cái tiến trình gây ra sự thiếu hụt thì bước đi sạch sẽ, còn cái tiến trình đang làm đúng việc của nó, dùng bộ nhớ đúng theo cách một cơ sở dữ liệu phải dùng, lại là cái bị gỡ đi. Chẳng có gì trong đó là một con bọ; đó là OOM killer chạy đúng như thiết kế.</p>
</div>

<p>Đây là hình dạng của một sự cố thật. Có người chạy một bản dựng, hoặc một cú xuất dữ liệu, hoặc một script một-lần trên chính máy production. Cái script chạy được. Hai mươi giây sau website sập, và người chạy cái script chẳng có lý do gì để nối hai chuyện lại — cái của họ thoát 0 mà.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">thứ bạn MUỐN</span><span class="lz-t">giết thằng mới tới</span><span class="lz-d">bản dựng là thứ chạy lại chẳng tốn gì</span></div>
<div class="lz-step"><span class="lz-k">thứ XẢY RA</span><span class="lz-t">giết thằng TO NHẤT</span><span class="lz-d">cơ sở dữ liệu, vì giết nó giải phóng được nhiều nhất trong một lần</span></div>
<div class="lz-step"><span class="lz-k">vì sao</span><span class="lz-t">nhân cần bộ nhớ NGAY</span><span class="lz-d">nó tối ưu cho việc giải phóng trang, không phải cho việc quy trách nhiệm</span></div>
</div>

<h3>Con số quyết định chuyện đó</h3>
${slide('dv-08', 10, 'Thang oom_score_adj và các điểm đo thật')}
<p>Mọi tiến trình đều có một điểm số, xem được theo từng tiến trình và chỉnh được:</p>

<pre><code class="language-bash">cat /proc/&lt;pid&gt;/oom_score         <span class="tok-comment"># diem tinh ra, cang cao cang de bi giet</span>
cat /proc/&lt;pid&gt;/oom_score_adj     <span class="tok-comment"># -1000 … +1000, do BAN dat</span></code></pre>

<div class="out">  csdl pid=7782  oom_score=676  adj=0</div>

<p>Điểm số phần lớn suy ra từ việc tiến trình dùng bao nhiêu bộ nhớ, tính theo tỷ lệ trên phần khả dụng của nó. <code>oom_score_adj</code> là ngón tay cái của bạn đặt lên cái cân: <strong>−1000</strong> nghĩa là ĐỪNG BAO GIỜ chọn cái này nếu còn lựa chọn khác, <strong>+1000</strong> nghĩa là chọn cái này TRƯỚC.</p>

<h3>Chữa nó, đo thật</h3>
${slide('dv-08', 9, 'Đo lại trên cgroup v2: adj=0 thì csdl chết, adj=1000 thì bản dựng chết')}
<p>Cách chữa trong sách là bảo vệ cơ sở dữ liệu bằng <code>-1000</code>. Trong hộp cát này lệnh ghi đó bị TỪ CHỐI — hạ giá trị xuống đòi một đặc quyền mà container không có:</p>

<div class="out">echo -1000 > /proc/7394/oom_score_adj
/bin/bash: line 21: echo: write error: Permission denied</div>

<p>Nên phép đo dùng đúng cái đòn bẩy ấy từ đầu kia, thứ mà mọi tiến trình đều tự làm được với chính nó: bản dựng NÂNG điểm của <em>CHÍNH NÓ</em> lên trước khi bắt đầu cấp phát.</p>

<pre><code class="language-bash"><span class="tok-comment"># trong script dung, TRUOC khi cap phat gi:</span>
echo 1000 > /proc/self/oom_score_adj
exec node dung.mjs</code></pre>

<div class="out">  csdl pid=7782  oom_score=676  adj=0
--- ban dung tu NANG diem cua chinh no len 1000 truoc khi cap phat ---
  build ma thoat : 137    da cap 50 MB, rss=95 MB
  csdl /proc/7782  : CON SONG ← duoc cuu

  [22768.290223] Memory cgroup out of memory: Killed process 7795 (node)
                 total-vm:1075944kB, anon-rss:68208kB ... oom_score_adj:1000</div>

<p>Đảo ngược hoàn toàn. Bản dựng chết với 137, cơ sở dữ liệu sống, và log của nhân ghi lại <code>oom_score_adj:1000</code> như lý do nó chọn tiến trình đó dù nó là cái <em>NHỎ HƠN</em> — 68 MB so với 191 MB của cơ sở dữ liệu.</p>

<div class="callout ok">
<p><strong>Quy tắc mang về.</strong> Bất cứ thứ gì chạy <em>TẠM THỜI</em> trên một máy production — một bản dựng, một cú nhập liệu, một script migration, một tác vụ sao lưu — đều nên tự nâng <code>oom_score_adj</code> của nó lên trước khi bắt đầu. Nó tốn một dòng, nó không cần đặc quyền, và nó biến "cơ sở dữ liệu chết" thành "tác vụ lô chết", một vấn đề bạn giải bằng cách chạy lại.</p>
</div>


<h3>Đo lại trên cgroup v2: cú đảo ngược, trong Docker</h3>
<p>Đúng hai thí nghiệm ấy, làm lại ngày 29/09/2026 trong một container <code>node:22-alpine</code> giới hạn 256 MB, không swap. <code>giu.js</code> đóng vai cơ sở dữ liệu (xin N MB rồi ngồi yên); <code>an-ram.js</code> của Bài 8.1 đóng vai bản dựng. Cả thí nghiệm là một script nhỏ:</p>
<pre><code class="language-bash">#!/bin/sh
# ai-chet.sh [adj_build] — CSDL 140 MB + bản dựng xin 120 MB trong cgroup 256 MB
node /w/giu.js 140 &amp; DB=$!
sleep 1.5
echo "truoc: csdl oom_score=$(cat /proc/$DB/oom_score) adj=$(cat /proc/$DB/oom_score_adj)"
echo "cgroup dung $(( $(cat /sys/fs/cgroup/memory.current) / 1048576 )) MB / $(( $(cat /sys/fs/cgroup/memory.max) / 1048576 )) MB"
echo "--- ban dung xin 120 MB (adj=\${1:-0}) ---"
timeout 20 sh -c "echo \${1:-0} &gt; /proc/self/oom_score_adj; exec node /w/an-ram.js 120" &gt; /tmp/b.log 2&gt;&amp;1
echo "  build ma thoat : $?   (dong cuoi: $(grep -E "da cap|XONG" /tmp/b.log | tail -1))"
if kill -0 $DB 2&gt;/dev/null; then echo "  csdl pid $DB   : CON SONG"; else echo "  csdl pid $DB   : DA BI GIET"; fi</code></pre>
<pre><code class="language-bash">docker run --rm --memory 256m --memory-swap 256m -v "$PWD":/w:ro node:22-alpine sh /w/ai-chet.sh 0
docker run --rm --memory 256m --memory-swap 256m -v "$PWD":/w:ro node:22-alpine sh /w/ai-chet.sh 1000</code></pre>
<div class="out">csdl pid=8 giu 140 MB
truoc: csdl oom_score=680 adj=0
cgroup dung 178 MB / 256 MB
--- ban dung xin 120 MB (adj=0) ---
  build ma thoat : 0   (dong cuoi: XONG 120 MB)
  csdl pid 8   : DA BI GIET

csdl pid=8 giu 140 MB
truoc: csdl oom_score=680 adj=0
cgroup dung 178 MB / 256 MB
--- ban dung xin 120 MB (adj=1000) ---
  build ma thoat : 137   (dong cuoi: da cap 50 MB, rss=98 MB)
  csdl pid 8   : CON SONG</div>
<p>Cùng hình dạng với số đo trên v1, trên một nhân khác (7.0 thay vì 6.18) và trên cgroup v2: bản dựng thoát 0 còn cơ sở dữ liệu chết; một dòng <code>oom_score_adj</code> đảo ngược kết quả. Hai chi tiết đáng đọc chậm. <code>timeout 20</code> có mặt vì lần thử ĐẦU, với "cơ sở dữ liệu" 180 MB, không kết thúc nổi: nhóm đứng ở 255 trên 256 MB và bản dựng không tiến cũng không chết suốt hai phút — nhân cứ đuổi các trang tệp của chính chương trình <code>node</code> ra khỏi RAM rồi lại đọc vào. Trạng thái đứng hình đó là anh em không-swap của cái thrashing đo ở 8.3, và là lý do một cái máy chạm trần có thể trông như TREO chứ không phải hỏng. Còn cột <code>(dong cuoi: …)</code> là lời cuối của bản dựng: <code>XONG</code> khi nó thắng, một dòng tiến độ bình thường khi nó là kẻ bị gỡ.</p>
<h3>Làm cho đàng hoàng bằng systemd</h3>
${slide('dv-08', 12, 'Unit systemd có trần mềm, trần cứng, điểm OOM; restart + OOM = vòng lặp')}
<p>Nếu máy có systemd, thiết lập này thuộc về cái unit chứ không phải một script:</p>

<pre><code>[Service]
OOMScoreAdjust=-500        <span class="tok-comment"># cho dich vu bạn KHONG muon mat</span>
MemoryMax=512M             <span class="tok-comment"># tran cung: vuot la bi giet</span>
MemoryHigh=400M            <span class="tok-comment"># tran mem: vuot thi bi bop cho cham lai truoc</span></code></pre>

<p><code>MemoryHigh</code> đáng biết riêng vì nó là bản NHẸ NHÀNG: một tiến trình vượt qua vạch đó sẽ bị bóp lại và bị đẩy đi thu hồi bộ nhớ, chứ không bị giết. Một dịch vụ vọt lên trong chốc lát sẽ bị làm chậm lại thay vì bị gỡ đi, mà đó gần như luôn là thứ bạn muốn cho một thứ bạn không kham nổi việc mất.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>Restart=always</code> cộng một cú OOM biến một cú vọt thành một VÒNG LẶP.</strong> Dịch vụ bị giết, systemd khởi động lại, nó cấp phát trở lại đúng cái trần ấy, và bị giết tiếp. Mỗi lần khởi động lại là rơi kết nối và dựng lại bộ đệm, nên mỗi vòng lại <em>ĐẮT HƠN</em> vòng trước và cái máy suy sụp dưới một mức tải mà lẽ ra nó hấp thụ được. Hãy đặt <code>StartLimitIntervalSec</code> và <code>StartLimitBurst</code> để cái unit bỏ cuộc và nằm im thay vì quẫy đạp — một dịch vụ chết một cách thành thật thì dễ chẩn đoán hơn một dịch vụ sống mỗi lần bốn giây.</p>
</div>


<h3>Trần cho TỪNG dịch vụ: nhốt OOM trong chuồng của nó (đo thật)</h3>
<p>Điểm số quyết định <em>ai</em> chết khi nhân đã phải chọn. Trần quyết định <em>ai có tên trong danh sách</em>. Khi một tiến trình chạm trần của CHÍNH nhóm nó, nhân chỉ nhìn bên trong nhóm đó (<code>CONSTRAINT_MEMCG</code>, 8.1) — cơ sở dữ liệu ở nhóm khác hoàn toàn không phải ứng viên. Đo trên VPS thí nghiệm, một container giới hạn 1 GiB đóng vai cả cái máy: một cơ sở dữ liệu giả chạy như dịch vụ systemd giữ 550 MB, rồi một "bản dựng" xin 600 MB — nhiều hơn chỗ còn lại bên cạnh nó.</p>
<pre><code class="language-bash"># vps-ai.sh — rút gọn: csdl là một dịch vụ systemd, bản dựng là một unit tạm
sudo systemd-run --quiet --unit=csdl $CSDL_OPT /usr/bin/node /home/deploy/giu.js 550
sudo systemd-run --unit=build --wait "$@" /usr/bin/node /home/deploy/an-ram.js 600
systemctl show csdl -p ActiveState -p Result --value

./vps-ai.sh                                          # A: không trần nào
./vps-ai.sh -p MemoryMax=300M -p MemorySwapMax=0     # B: trần cho bản dựng
CSDL_OPT="-p OOMScoreAdjust=-900" ./vps-ai.sh        # C: điểm âm cho csdl</code></pre>
<div class="out">── A ──
csdl: 503 0  oom_score=710
  build: Finished with result: success
  build: Main processes terminated with: code=exited/status=0
  csdl : oom-kill failed
Killed process 11493 (node) total-vm:1171752kB, anon-rss:576896kB
── B ──
  build: Finished with result: oom-kill
  build: Memory peak: 300.0M
  csdl : success active
Killed process 11580 (node) total-vm:899748kB, anon-rss:305720kB
── C ──
csdl: 631 -900  oom_score=111
  build: Finished with result: oom-kill
  build: Memory peak: 444.8M
  csdl : success active
Killed process 11644 (node) total-vm:1049304kB, anon-rss:453380kB</div>
<p>Lần A là 8.2 trên cả một cái máy: bản dựng thành công và cơ sở dữ liệu 563 MB bị giết. Lần B không bao giờ để bản dựng lại gần cơ sở dữ liệu: tới 300 MB nó bị giết ngay trong unit của nó, và cơ sở dữ liệu còn chẳng bị đem ra so điểm. Lần C cũng cứu được cơ sở dữ liệu, nhưng chỉ sau khi bản dựng đã ăn 445 MB bộ nhớ dùng chung — cả máy chịu áp lực lâu hơn. Luật thực hành là dùng cả hai: <strong>trần cho mọi thứ tạm thời, điểm âm cho thứ giữ dữ liệu.</strong></p>
<p>Docker cho bạn cái chuồng miễn phí: mỗi container là một cgroup riêng. Một <code>mem_limit</code> cho mọi service trong <code>compose.yaml</code> biến "cả máy hết, nhân chọn cái to nhất" thành "backend hết, backend khởi động lại" — kiểu hỏng mà bạn sống sót được.</p>
<h3>Thứ bạn KHÔNG chữa được bằng điểm số</h3>
<p>Tất cả những cái trên là phân loại thương binh. Nếu cái máy thật sự không đủ bộ nhớ cho khối việc đó, thì chỉnh xem ai chết trước chỉ đổi xem bạn nhận được cú hỏng nào. Câu hỏi thật là những câu bài 8.5 đem đi đo: khối việc này có cần chạy trên chính cái máy này không, nó có cần chạy CÙNG LÚC với mọi thứ khác không, và cái đỉnh nó chạm tới có thật sự cần thiết không?</p>

<div class="kv-grid">
<div class="kv"><span class="k">oom_score_adj +1000</span><span class="v">cho mọi thứ tạm thời; một dòng, không cần đặc quyền</span></div>
<div class="kv"><span class="k">oom_score_adj −1000</span><span class="v">cho cơ sở dữ liệu; cần đặc quyền, nên đặt trong unit systemd</span></div>
<div class="kv"><span class="k">MemoryHigh</span><span class="v">bóp lại trước khi giết — cái trần nhẹ nhàng hơn</span></div>
<div class="kv"><span class="k">phép kiểm sau đó</span><span class="v"><code>dmesg | grep -i oom</code> và bộ đếm <code>oom_kill</code> của chính cgroup, sau MỖI lần deploy</span></div>
</div>


<h3>Mọi núm vặn bộ nhớ, trong systemd và trong Docker</h3>
<table><thead><tr><th>unit systemd</th><th>docker run / compose</th><th>Nó làm gì</th></tr></thead><tbody>
<tr><td><code>MemoryMax=512M</code></td><td><code>--memory 512m</code> / <code>mem_limit: 512m</code></td><td>trần cứng; vượt mà không thu hồi được = OOM giết <em>trong</em> nhóm</td></tr>
<tr><td><code>MemoryHigh=400M</code></td><td>—</td><td>trần mềm: nhóm bị bóp chậm và ép thu hồi, không bị giết</td></tr>
<tr><td><code>MemorySwapMax=0</code></td><td><code>--memory-swap</code> / <code>memswap_limit</code> (là TỔNG, xem 8.3)</td><td>nhóm được dùng bao nhiêu swap</td></tr>
<tr><td><code>OOMScoreAdjust=-900</code></td><td><code>--oom-score-adj -900</code> / <code>oom_score_adj: -900</code></td><td>ngón tay đặt lên cân; đặt từ bên ngoài nên bên trong không cần đặc quyền</td></tr>
<tr><td><code>Restart=on-failure</code> + <code>StartLimitBurst=3</code></td><td><code>--restart on-failure:3</code> / <code>restart:</code></td><td>khởi động lại sau cú giết — và bỏ cuộc sau vài lần thay vì lặp mãi</td></tr>
</tbody></table>
<p>Đo trên VPS thí nghiệm với unit trên slide ở trên (một cơ sở dữ liệu giả giữ 200 MB):</p>
<pre><code class="language-bash">systemctl show csdl-thu -p MemoryMax -p MemoryHigh -p MemorySwapMax -p OOMScoreAdjust
PID=$(systemctl show csdl-thu -p MainPID --value)
cat /proc/$PID/oom_score_adj /proc/$PID/oom_score</code></pre>
<div class="out">MemoryHigh=419430400
MemoryMax=536870912
MemorySwapMax=0
OOMScoreAdjust=-900
-900
70</div>
<p>Còn cái vòng lặp mà bẫy ở trên cảnh báo, đo bằng thứ tương đương <code>Restart=always</code> của Docker: một container giới hạn 128 MB mà chương trình trong đó lúc nào cũng muốn 300 MB, với <code>--restart unless-stopped</code>. Mười lăm giây sau:</p>
<div class="out">NAMES       STATUS
dv08-loop   Restarting (137) Less than a second ago
RestartCount=8 OOMKilled=true ExitCode=137</div>
<p>Tám lần bị giết trong mười lăm giây, và <code>docker ps</code> ở bất kỳ khoảnh khắc nào cũng cho thấy một container "Restarting" chứ không phải đã chết. Đó là trạng thái mà trang web không vào được trong khi mọi phép kiểm "container có ở đó không?" đều nói có. <code>RestartCount</code> và <code>OOMKilled</code> trong <code>docker inspect</code> là hai trường nói thật.</p>

<h3>Khi nào dùng cái nào</h3>
<ul>
<li><strong>Một việc chạy một lần trên máy production</strong> (dựng bản, nhập liệu, sao lưu): tự nâng <code>oom_score_adj</code> của nó lên 1000 <em>và</em> chạy nó dưới một cái trần (<code>systemd-run --scope -p MemoryMax=…</code> hoặc một container có <code>--memory</code>). Mỗi thứ một dòng.</li>
<li><strong>Cơ sở dữ liệu</strong>: một cái trần đủ rộng cho <code>shared_buffers</code> cộng các kết nối, và một điểm âm (−500 tới −900) đặt từ bên ngoài. Đừng theo phản xạ đặt −1000 — một cơ sở dữ liệu rò bộ nhớ mà không bao giờ bị chọn sẽ khiến nhân đi giết mọi thứ xung quanh nó.</li>
<li><strong>Dịch vụ không giữ trạng thái</strong> (API, máy chủ Next.js): một cái trần và một chính sách restart có giới hạn. Mất một cái là một lần khởi động lại; mất cơ sở dữ liệu là một sự cố.</li>
<li><strong>Đừng bao giờ</strong> "chữa" OOM bằng cách bỏ trần. Nó dời cú giết từ một nhóm nhỏ ra cả cái máy, nơi tiến trình to nhất — cơ sở dữ liệu — là cái bị chọn.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm chạy thẳng <code>npm run build</code> trên VPS demo của nhóm "cho chắc". Nó in "Compiled successfully", và hai mươi giây sau trang web trả 500 vì PostgreSQL đã biến mất. Chỉ cho cả nhóm, bằng con số, vì sao mã thoát 0 của bản dựng không làm nó vô tội — và cách làm cho đúng lỗi ấy trở nên vô hại.</p>
<ol>
<li>Lưu <code>giu.js</code> (xin N MB bằng <code>Buffer.alloc</code>, rồi <code>setInterval(() =&gt; {}, 1e6)</code>) và <code>ai-chet.sh</code> của bài này cạnh <code>an-ram.js</code>. Chạy <code>ai-chet.sh 0</code> và <code>ai-chet.sh 1000</code> trong <code>--memory 256m --memory-swap 256m</code>.</li>
<li>Trên VPS thí nghiệm (<code>ssh -i khoa -p 19082 deploy@127.0.0.1</code>, có systemd chạy): chạy ba ca của <code>vps-ai.sh</code> rồi điền bảng: ai chết, mỗi unit báo <code>Result</code> gì.</li>
<li>Viết <code>csdl-thu.service</code> với <code>OOMScoreAdjust=-900</code>, <code>MemoryHigh=400M</code>, <code>MemoryMax=512M</code>, khởi động nó, rồi xác nhận bằng <code>systemctl show</code> và <code>/proc/&lt;pid&gt;/oom_score_adj</code>.</li>
<li>Thử <code>echo -1000 &gt; /proc/self/oom_score_adj</code> với người dùng thường và với root bên trong một container mặc định; ghi lại cái nào bị từ chối và vì sao.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho A → cơ sở dữ liệu bị giết trong khi bản dựng thoát 0, B và C → bản dựng bị giết trong khi cơ sở dữ liệu vẫn <code>active</code>; <code>systemctl show</code> in <code>OOMScoreAdjust=-900</code>; và bạn giải thích được trong hai câu vì sao một cái trần là cách bảo vệ mạnh hơn một điểm số.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">oom_score (điểm bị chọn)</span><span class="v">Điểm "tệ" hiện tại nhân tính cho một tiến trình; cao hơn thì bị chọn trước.</span></div>
  <div class="kv"><span class="k">oom_score_adj (điểm chỉnh tay)</span><span class="v">Phần bạn chỉnh, từ −1000 tới +1000; nâng thì tự do, hạ thì cần <code>CAP_SYS_RESOURCE</code>.</span></div>
  <div class="kv"><span class="k">OOMScoreAdjust= (chỉ thị chỉnh điểm)</span><span class="v">Chỉ thị systemd đặt phần chỉnh ấy từ bên ngoài, lúc khởi động.</span></div>
  <div class="kv"><span class="k">MemoryHigh= (trần mềm)</span><span class="v">Vượt nó thì nhóm bị làm chậm và thu hồi chứ không bị giết.</span></div>
  <div class="kv"><span class="k">MemoryMax= (trần cứng)</span><span class="v">Vượt nó thì một tiến trình trong nhóm bị giết.</span></div>
  <div class="kv"><span class="k">Restart loop (vòng lặp khởi động lại)</span><span class="v">Giết → khởi động lại → cùng đỉnh → giết; chặn bằng <code>StartLimitBurst</code> hoặc giới hạn số lần thử.</span></div>
  <div class="kv"><span class="k">Blast radius (bán kính thiệt hại)</span><span class="v">Bao nhiêu thứ chết theo khi một thứ hỏng; trần cho từng dịch vụ giữ nó ở một dịch vụ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>OOM killer chọn tiến trình mà giết đi thì giải phóng nhiều nhất, không phải cái gây thiếu — trên VPS đó thường là cơ sở dữ liệu.</li>
<li>Đo trên hai nhân và cả hai phiên bản cgroup: bản dựng thoát 0 còn cơ sở dữ liệu chết; nâng <code>oom_score_adj</code> của chính bản dựng lên 1000 thì đảo ngược.</li>
<li>Một cái trần cho từng dịch vụ (<code>MemoryMax</code>, <code>mem_limit</code>) giữ cú giết bên trong nhóm đã vượt, nên cơ sở dữ liệu không bao giờ là ứng viên.</li>
<li>Hạ điểm cần đặc quyền, nên đặt từ bên ngoài: <code>OOMScoreAdjust=</code>, <code>--oom-score-adj</code>, <code>oom_score_adj:</code>.</li>
<li>Restart cộng OOM là một vòng lặp — đo được 8 lần giết trong 15 giây; giới hạn số lần thử và theo dõi <code>RestartCount</code>.</li>
<li>Điểm số và trần chỉ là sơ cứu; cách chữa thật cho bản dựng là không chạy nó trên máy production (8.5).</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/[pid]/oom_score và oom_score_adj</span><span class="lc-sub">man 5 proc — khoảng giá trị được ghi tài liệu, và ghi chú rằng HẠ giá trị xuống thì cần CAP_SYS_RESOURCE, đúng cái lời từ chối đo được ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — ghi chú cài đặt OOM killer</span><span class="lc-sub">docs.kernel.org/admin-guide/mm/concepts.html và <code>mm/oom_kill.c</code> — <code>oom_badness()</code> gộp RSS, swap và bảng trang thành điểm số ra sao.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.resource-control(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.resource-control.html — <code>MemoryMax</code>, <code>MemoryHigh</code>, <code>OOMScoreAdjust</code> và <code>OOMPolicy</code>, dạng khai báo của mọi thứ trong bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Linux memory overcommit</span><span class="lc-sub">postgresql.org/docs/current/kernel-resources.html#LINUX-MEMORY-OVERCOMMIT — lời khuyên của chính PostgreSQL về việc bảo vệ postmaster khỏi OOM killer, và vì sao nó đặt điểm cho các tiến trình con khác đi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 11: systemd &amp; cron</span><span class="lc-sub">/courses/linux-bash/learn${REF} — viết tệp unit, <code>systemctl show</code>, và chính sách khởi động lại, bộ máy mà mọi chỉ thị ở trên cắm vào.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — shared_buffers, work_mem và bộ nhớ đi đâu</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao cơ sở dữ liệu ĐÚNG LÝ là tiến trình lớn nhất trên máy, và đó là thứ khiến nó thành mục tiêu mặc định.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Swap: what it buys and what it costs|||8.3 — Swap: mua được gì và trả giá gì',
      slug: 'deploy-8-3-swap',
      type: 'VIDEO',
      description: 'Đúng khối việc vừa bị giết ở 8.1 chạy XONG khi có swap. Đo thật cả hai vế: swap cứu tiến trình khỏi mã 137, và cùng lúc làm việc đọc lại bộ nhớ chậm đi vài trăm lần. Kèm một kết quả rỗng của chính tôi và lý do phép đo không nhìn thấy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Swap: what it buys and what it costs</h2>
<p class="lead">Swap is disk pretending to be memory. On a small VPS it is the difference between a process that dies and a process that is merely slow — and both of those are real outcomes you have to choose between deliberately.</p>

<h3>The same workload, with swap</h3>
${slide('dv-08', 13, 'Có swap: 137 thành 0, RAM ghim ở trần, swap lớn dần')}
<p>Lesson 8.1 measured a 500 MB allocation inside a 256 MB cgroup being killed at 401 ms. Adding a 512 MB swap file and raising the group&#39;s combined memory+swap ceiling to 768 MB:</p>

<pre><code class="language-bash">fallocate -l 512M /swap-thu
chmod 600 /swap-thu          <span class="tok-comment"># bat buoc: swapon TU CHOI tep ai cung doc duoc</span>
mkswap /swap-thu &amp;&amp; swapon /swap-thu

echo \$((768*1024*1024)) > \$CG/memory.memsw.limit_in_bytes</code></pre>

<div class="out">=== xin 500 MB trong cgroup RAM 256 MB + swap 512 MB ===
  da cap 400 MB, rss=230 MB
  da cap 450 MB, rss=281 MB
XONG 500 MB — KHONG bi giet
  ma thoat: 0 | mat 1011 ms</div>

<p>Exit 0 instead of 137. The process that was killed in 8.1 now finishes.</p>

<div class="pitfall">
<p><strong>Trap — my first reading of this said swap was never used, and that was my mistake.</strong> I checked <code>memory.stat</code> after the process exited and saw <code>swap 0</code>, and briefly concluded the allocation had somehow fit in RAM. It had not: the counter is per-cgroup and the pages were freed the moment the process died, so by the time I read it there was nothing to count. Sampling <em>during</em> the run shows what actually happened:</p>
</div>

<div class="out">  t=0.25s  cgroup_rss=164 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=0.50s  cgroup_rss=216 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=0.75s  cgroup_rss=254 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=1.00s  cgroup_rss=254 MB  cgroup_swap=58 MB   he_thong_swap=63 MB
  t=1.25s  cgroup_rss=254 MB  cgroup_swap=122 MB  he_thong_swap=128 MB
  t=1.50s  cgroup_rss=253 MB  cgroup_swap=189 MB  he_thong_swap=195 MB</div>

<p>RSS climbs to 254 MB — the ceiling — and then stops dead while swap grows behind it: 58, 122, 189 MB. The limit was enforced exactly; the overflow went to disk. That is swap doing its entire job, visible in six samples.</p>


<h3>Measured again on cgroup v2, sampled while it runs</h3>
<p>On cgroup v2 the two ceilings are independent — <code>memory.max</code> for RAM, <code>memory.swap.max</code> for swap — and systemd exposes them as <code>MemoryMax=</code> and <code>MemorySwapMax=</code>. The lab VPS on 29/09/2026, same 500 MB request, same 256 MB of RAM, swap forbidden and then allowed:</p>
<pre><code class="language-bash">for sw in 0 512M; do
  echo "== MemoryMax=256M MemorySwapMax=$sw : xin 500 MB"
  sudo systemd-run --unit=thu-swap -p MemoryMax=256M -p MemorySwapMax=$sw --wait \\
    /usr/bin/node /home/deploy/an-ram.js 500 2&gt;&amp;1 | grep -E "result|peak|runtime"
  sudo journalctl -u thu-swap -o cat -q --no-pager | grep -E "XONG|da cap" | tail -1
  sudo systemctl reset-failed thu-swap
done</code></pre>
<div class="out">== MemoryMax=256M MemorySwapMax=0 : xin 500 MB
Finished with result: oom-kill
Service runtime: 1.034s
…
da cap 200 MB, rss=247 MB
== MemoryMax=256M MemorySwapMax=512M : xin 500 MB
Finished with result: success
Service runtime: 1.041s
…
XONG 500 MB</div>
<p>This time the samples were taken <em>while</em> the process ran — the lesson of the pitfall above — reading the unit's own cgroup every quarter of a second:</p>
<pre><code class="language-bash"># mau.sh — chạy an-ram.js trong một unit có trần, lấy mẫu RAM/swap của CHÍNH unit đó mỗi 0,25 s
sudo systemd-run --quiet --unit=thu-swap -p MemoryMax=256M -p MemorySwapMax=512M \\
  /usr/bin/node /home/deploy/an-ram.js 500
CG=/sys/fs/cgroup/system.slice/thu-swap.service; t=0
while [ -d $CG ]; do
  printf "  t=%.2fs  ram=%3d MB  swap=%3d MB\\n" $t \\
    $(( $(cat $CG/memory.current 2&gt;/dev/null || echo 0)/1048576 )) \\
    $(( $(cat $CG/memory.swap.current 2&gt;/dev/null || echo 0)/1048576 ))
  sleep 0.25; t=$(python3 -c "print($t+0.25)")
done
echo "  $(systemctl show thu-swap -p Result --value) | $(sudo journalctl -u thu-swap -o cat -q | grep -E 'XONG|da cap' | tail -1)"</code></pre>
<div class="out">  t=0.00s  ram=  1 MB  swap=  0 MB
  t=0.25s  ram= 54 MB  swap=  0 MB
  t=0.50s  ram=255 MB  swap= 31 MB
  t=0.75s  ram=255 MB  swap= 89 MB
  t=1.00s  ram=255 MB  swap=231 MB
  t=1.25s  ram=  4 MB  swap=  4 MB
  success | XONG 500 MB</div>
<p>RAM climbs to 255 MB and stays pinned there; swap grows behind it — 31, 89, 231 MB — and both drop to almost nothing the moment the process exits, which is exactly why the "after" reading in the pitfall said zero.</p>
<h3>Now the bill</h3>
${slide('dv-08', 14, 'Cái giá: đọc lại chậm hàng trăm lần; vmstat si/so')}
<p>A program that allocates a block of memory and then reads back through all of it three times. Two sizes, same 256 MB ceiling: one that fits, one that does not.</p>

<div class="out">=== VUA RAM: 200 MB trong gioi han 256 MB ===
  doc lai 3 luot 200 MB: 0.277527 ms
  doc lai 3 luot 200 MB: 0.142962 ms
=== TRAN SANG SWAP: 400 MB trong gioi han 256 MB ===
  doc lai 3 luot 400 MB: 66.199207 ms
  doc lai 3 luot 400 MB: 56.482304 ms</div>

<p>0.14–0.28 ms against 56–66 ms. Twice the data, four hundred times the time.</p>

<div class="callout warn">
<p><strong>What that measurement is and is not.</strong> The loop touches two bytes per megabyte, so it is not measuring throughput — it is measuring <strong>page faults</strong>, which is precisely the cost swap imposes. Every touched page that lives on disk has to be read back in before the instruction can complete, and the process is stopped while that happens. Normalised per megabyte touched, that is roughly 120–235× slower. Do not read the raw 400× as a throughput ratio; read it as "the first touch of a swapped-out page is enormously expensive, and your application does nothing at all while it waits".</p>
</div>


<h3>The bill, re-measured: touching every page</h3>
<p>The measurement above touched two bytes per megabyte. A harsher version touches every 4 KB page, three passes, with the same 256 MB of RAM and 512 MB of swap allowed — <code>doc-lai.js</code> allocates N MB and times each pass:</p>
<pre><code class="language-javascript">// doc-lai.js &lt;MB&gt; — cấp N MB, rồi đọc lại MỌI trang 4 KB, 3 lượt; in thời gian từng lượt
const n = Number(process.argv[2]), g = [];
for (let i = 0; i &lt; n; i++) g.push(Buffer.alloc(2**20, 1));
for (let l = 1; l &lt;= 3; l++) {
  const t = process.hrtime.bigint(); let s = 0;
  for (const b of g) for (let o = 0; o &lt; b.length; o += 4096) s += b[o];
  console.log('luot ' + l + ': doc lai ' + n + ' MB mat ' + (Number(process.hrtime.bigint() - t) / 1e6).toFixed(1) + ' ms');
}</code></pre>
<pre><code class="language-bash">for n in 200 400; do
  sudo systemd-run --unit=thu-doc -p MemoryMax=256M -p MemorySwapMax=512M --wait \\
    /usr/bin/node /home/deploy/doc-lai.js $n &gt;/dev/null 2&gt;&amp;1
  sudo journalctl -u thu-doc -o cat | grep luot | tail -3
done</code></pre>
<div class="out">luot 1: doc lai 200 MB mat 16.0 ms
luot 2: doc lai 200 MB mat 13.3 ms
luot 3: doc lai 200 MB mat 1.2 ms
luot 1: doc lai 400 MB mat 7238.3 ms
luot 2: doc lai 400 MB mat 5223.2 ms
luot 3: doc lai 400 MB mat 4576.0 ms</div>
<p>Per megabyte: about 0.065 ms when everything is in RAM against about 12 ms when a third of the data lives in swap — roughly two hundred times slower, measured on a Mac's SSD. And while the second run was going, <code>vmstat</code> showed what a machine in that state looks like from the outside (columns cut):</p>
<div class="out"> r  b   swpd   free  …      si     so
 0  1 653032 772408  …  152160 153088
 1  0 654148 772168  …  179080 176240
 1  0 653844 774892  …   78784  78252
 2  0 656424 774892  …  158848 158340</div>
<p><code>si</code> and <code>so</code> — kilobytes per second swapped in and out — both around 150,000 at the same time. That is the signature of thrashing: pages are read back in only to be pushed out again a moment later. <code>swpd</code> barely moves, which is why alerting on "swap used" misses it.</p>
<h3>Why "slow" is sometimes worse than "dead"</h3>
${slide('dv-08', 17, 'Ba trạng thái: chết, swap nhẹ, thrashing; đo bằng PSI')}
<p>A killed process is obvious: exit 137, the supervisor restarts it, monitoring notices, someone looks. A swapping process is not obvious at all. It answers every request, correctly, eventually. Response times go from 40 ms to 4 seconds, timeouts start firing upstream, the connection pool fills with requests that are technically still running, and every dashboard says the service is up.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">no swap</span><span class="lz-t">exit 137</span><span class="lz-d">loud, immediate, obvious in the kernel log</span></div>
<div class="lz-step"><span class="lz-k">swap, light use</span><span class="lz-t">fine</span><span class="lz-d">idle pages evicted, nobody notices, this is swap working well</span></div>
<div class="lz-step"><span class="lz-k">swap, heavy use</span><span class="lz-t">thrashing</span><span class="lz-d">the worst state: alive, answering, unusably slow, and every health check green</span></div>
</div>


<h3>Measuring "slow" directly: pressure stall information</h3>
<p>Linux can report how much time tasks spent <em>stalled waiting for memory</em> — PSI (pressure stall information). Every cgroup v2 group has a <code>memory.pressure</code> file; <code>/proc/pressure/memory</code> covers the whole machine. Read five seconds into the 400 MB run above:</p>
<pre><code class="language-bash">cat /sys/fs/cgroup/system.slice/thu-doc.service/memory.pressure</code></pre>
<div class="out">some avg10=3.04 avg60=0.60 avg300=0.12 total=480289
full avg10=3.04 avg60=0.60 avg300=0.12 total=480289</div>
<p><code>some avg10=3.04</code> means that over the last ten seconds, some task in the group was stalled on memory 3% of the time; <code>total</code> is the cumulative stall in microseconds (0.48 s here). The number is a percentage of time lost, which is what users feel — unlike "RAM used", which is high on every healthy server because the page cache fills whatever is free.</p>
<h3>What to actually do</h3>
<div class="kv-grid">
<div class="kv"><span class="k">have some swap</span><span class="v">even 512 MB–1 GB. It lets genuinely idle pages leave RAM, which on a small box is real headroom for free</span></div>
<div class="kv"><span class="k">do not size it as a second RAM</span><span class="v">8 GB of swap on a 1 GB machine does not give you 9 GB; it gives you a machine that thrashes for a very long time before dying</span></div>
<div class="kv"><span class="k">tune <code>vm.swappiness</code></span><span class="v">default 60. Lower (10–20) on a server: prefer dropping file cache over evicting a running process&#39;s pages</span></div>
<div class="kv"><span class="k">alert on the RATE</span><span class="v">not on swap used. Steady swap usage is fine; <code>si</code>/<code>so</code> columns in <code>vmstat 1</code> moving constantly is thrashing</span></div>
</div>

<pre><code>vmstat 1 5
<span class="tok-comment"># cot si = swap-in KB/s, so = swap-out KB/s.</span>
<span class="tok-comment"># ca hai o 0 trong khi 'swpd' lon = LANH MANH: trang nhan roi da roi khoi RAM.</span>
<span class="tok-comment"># ca hai chay lien tuc = THRASHING, du 'swpd' co the khong doi.</span></code></pre>

<div class="pitfall">
<p><strong>Trap — a swap file needs <code>chmod 600</code>, and <code>swapon</code> will tell you so.</strong> Swap holds whatever was in memory: session tokens, decrypted secrets, request bodies. A world-readable swap file is a plaintext dump of your process memory sitting on disk, which is why <code>swapon</code> prints "insecure permissions" — though, measured with the util-linux of Ubuntu 24.04, it only <em>warns</em>: the file is enabled anyway and the command exits 0 (see the step-by-step section below). Do not treat that message as a safety net. This is also the reason Chapter 4&#39;s advice about secrets in environment variables has a caveat — an environment variable can be swapped to disk like anything else.</p>
</div>


<h3>Creating a swap file on the VPS, step by step</h3>
<pre><code class="language-bash">sudo fallocate -l 2G /swapfile          # giữ chỗ 2 GB trên đĩa
sudo chmod 600 /swapfile                # CHỈ root đọc được — làm TRƯỚC mkswap
sudo mkswap /swapfile                   # ghi phần đầu vùng swap
sudo swapon /swapfile                   # bật ngay
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab     # bật lại sau reboot
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf  # giữ qua reboot
sudo sysctl vm.swappiness=10            # áp dụng ngay
swapon --show; free -m                  # kiểm lại</code></pre>
<p>What happens if you get the order wrong, measured on the lab VPS (the swap file sits on a small ext4 filesystem mounted from a loop device, because a swap file cannot live on the container's overlay filesystem):</p>
<pre><code class="language-bash">sudo chmod 644 /mnt/dia/swapfile
sudo mkswap /mnt/dia/swapfile
sudo swapon /mnt/dia/swapfile; echo "swapon exit=$?"
swapon --show</code></pre>
<div class="out">mkswap: /mnt/dia/swapfile: insecure permissions 0644, fix with: chmod 0600 /mnt/dia/swapfile
Setting up swapspace version 1, size = 256 MiB (268431360 bytes)
no label, UUID=4a8200b9-f555-489e-8c45-7503dda33924
swapon: /mnt/dia/swapfile: insecure permissions 0644, 0600 suggested.
swapon exit=0
NAME              TYPE  SIZE   USED PRIO
/var/lib/swap     file 1024M 476.6M   -1
/mnt/dia/swapfile file  256M     0B   -1</div>
<p>Both tools complain, and both carry on: the world-readable file is now live swap, and <code>swapon</code> returned 0 — a deploy script checking <code>$?</code> would call it a success. (The <code>/var/lib/swap</code> line is Docker Desktop's own VM swap; enabling swap in a privileged container adds it to the whole VM, so <code>swapoff</code> it when you are done.)</p>
<table><thead><tr><th>Step</th><th>Why</th></tr></thead><tbody>
<tr><td><code>fallocate -l 2G</code></td><td>reserves the blocks at once; on filesystems where it is not supported for swap, <code>dd if=/dev/zero of=/swapfile bs=1M count=2048</code> is the slow but safe fallback</td></tr>
<tr><td><code>chmod 600</code> first</td><td>swap holds process memory — tokens, secrets, request bodies; the warning will not stop you</td></tr>
<tr><td><code>/etc/fstab</code> line</td><td>without it the swap is gone after the next reboot, and you find out during the next spike</td></tr>
<tr><td><code>vm.swappiness=10</code></td><td>default is 60; lower prefers dropping file cache over pushing a running process's pages out</td></tr>
<tr><td>size 1–2 GB on a 6 GB VPS</td><td>room for idle pages and short spikes; a swap as big as RAM only lets the machine thrash longer before it dies</td></tr>
</tbody></table>
<h3>Where the cgroup accounting bites</h3>
${slide('dv-08', 16, '--memory-swap là TỔNG; mem_limit trơn cho thêm chừng ấy swap')}
<p>On cgroup v1 there are two ceilings, and the second one is easy to miss:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">memory.limit_in_bytes</span><span class="lz-lnote">RAM only</span></div>
<div class="lz-layer"><span class="lz-lname">memory.memsw.limit_in_bytes</span><span class="lz-lnote">RAM <em>plus</em> swap, combined. Set equal to the first and the group cannot swap at all — which is exactly how 8.1 produced a kill on a machine that had swap available</span></div>
<div class="lz-layer"><span class="lz-lname">cgroup v2: memory.max + memory.swap.max</span><span class="lz-lnote">two independent numbers, which is clearer; <code>memory.swap.max=0</code> disables swap for the group</span></div>
</div>

<p>Docker exposes this as <code>--memory</code> and <code>--memory-swap</code>, and the same trap applies: setting them to the same value disables swap for that container entirely.</p>


<h3>Measured: what Compose gives you when you only set <code>mem_limit</code></h3>
<p>A four-service Compose project in the lab (PostgreSQL 16, Redis 7, a Node backend, nginx), with <code>mem_limit</code> on every service but <code>memswap_limit</code> only on PostgreSQL:</p>
<pre><code class="language-bash">F='{{.Name}} Memory={{.HostConfig.Memory}}'
F="$F MemorySwap={{.HostConfig.MemorySwap}}"
docker inspect -f "$F" $(docker compose ps -q)</code></pre>
<div class="out">/dv08-backend-1 Memory=805306368 MemorySwap=1610612736
/dv08-nginx-1 Memory=134217728 MemorySwap=268435456
/dv08-postgres-1 Memory=1610612736 MemorySwap=1610612736
/dv08-redis-1 Memory=268435456 MemorySwap=536870912</div>
<p><code>MemorySwap</code> is the total of RAM plus swap. Every service without <code>memswap_limit</code> got <strong>twice</strong> its <code>mem_limit</code>: the backend limited to 768 MB may grow to 1.5 GB if the host has swap, and will get <em>slow</em> long before it gets killed. Only PostgreSQL, with <code>memswap_limit</code> equal to <code>mem_limit</code>, has no swap at all. Decide per service: a database you would rather restart than have crawl gets the two values equal; a service where a slow minute beats a restart can keep the default.</p>

<h3>On other machines: zram, systemd-oomd, and WSL</h3>
<ul>
<li><strong>Fedora (and many desktop distributions) swap to compressed RAM, not disk.</strong> Read on a Fedora 44 machine with 32 GB: <code>swapon --show</code> printed <code>/dev/zram0 partition 8G 8G 100</code> — a compressed block device in memory, completely full at the time — and <code>systemctl is-active systemd-oomd</code> printed <code>active</code>. <code>oomctl</code> showed its rules: <code>Swap Used Limit: 90.00%</code>, <code>Default Memory Pressure Limit: 60.00%</code>, <code>Default Memory Pressure Duration: 20s</code>. systemd-oomd is a <em>userspace</em> killer that acts on PSI before the kernel's OOM killer has to; the Ubuntu server image for a VPS does not ship it by default, so what you measure on your laptop is not what your VPS will do.</li>
<li><strong>WSL 2</strong> gets a swap file of 25% of its memory by default (Microsoft's documentation, 09/2026), stored as <code>swap.vhdx</code> in the Windows temp folder; set <code>swap=0</code> in <code>.wslconfig</code> to reproduce a VPS with none.</li>
<li><strong>Docker Desktop on a Mac</strong> has its own VM swap — the <code>/var/lib/swap</code> line above, 1 GB here. That is why a container without <code>--memory-swap</code> on your Mac can swap even though the Mac's own swap has nothing to do with it.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's 1 GB demo VPS has no swap, and the backend is killed with 137 during every traffic spike from the class. One teammate says "just add 4 GB of swap", another says "swap is evil". Settle it with measurements on the lab VPS, not opinions.</p>
<ol>
<li>On the lab VPS: <code>systemd-run</code> with <code>MemoryMax=256M</code> and <code>MemorySwapMax=0</code>, then <code>512M</code>, running <code>an-ram.js 500</code>. Record the <code>Result</code> of each.</li>
<li>Run the sampling loop from this lesson against the unit's cgroup while <code>an-ram.js 500</code> runs with swap allowed. Note the RAM plateau and the swap figures.</li>
<li>Run <code>doc-lai.js 200</code> and <code>doc-lai.js 400</code> under the same limits; in a second SSH session keep <code>vmstat 1</code> open. Compute ms per MB for both.</li>
<li>On a loop-mounted ext4 inside the lab VPS, create a 256 MB swap file with <code>chmod 644</code>, run <code>mkswap</code> and <code>swapon</code>, and check <code>$?</code>. Then <code>swapoff</code> it.</li>
</ol>
<p><strong>Done when:</strong> you have oom-kill vs success for the same workload, a RAM plateau at the ceiling with swap growing behind it, a per-MB slowdown factor of your own machine (in the hundreds is normal), si/so numbers from the thrash, and <code>swapon exit=0</code> for a 0644 file — plus a one-paragraph recommendation for the group's VPS.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Swap</span><span class="v">Disk (or compressed RAM) used to hold memory pages that do not fit in RAM.</span></div>
  <div class="kv"><span class="k">Page fault</span><span class="v">Touching a page that is not in RAM; if it is in swap, the process waits for a disk read.</span></div>
  <div class="kv"><span class="k">Thrashing</span><span class="v">Pages swapped in and out continuously; the machine is alive but spends its time on paging.</span></div>
  <div class="kv"><span class="k">si / so</span><span class="v"><code>vmstat</code> columns: KB per second swapped in / out — the rate that matters.</span></div>
  <div class="kv"><span class="k">vm.swappiness</span><span class="v">Kernel knob (default 60) weighing file cache against process pages when reclaiming.</span></div>
  <div class="kv"><span class="k">PSI</span><span class="v">Pressure stall information: the share of time tasks were stalled waiting for memory.</span></div>
  <div class="kv"><span class="k">zram</span><span class="v">A compressed block device in RAM used as swap; the default on Fedora.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Swap turns an OOM kill into a slower success: the same 500 MB request went from <code>oom-kill</code> to <code>success</code>, with RAM pinned at 255 MB and swap growing behind it.</li>
<li>The price is paid on every page that lives on disk — measured about two hundred times slower per megabyte on an SSD.</li>
<li>Thrashing shows up as <code>si</code>/<code>so</code> both high at once, and as PSI stall time; "swap used" hides it.</li>
<li>A swap file must be <code>chmod 600</code> before <code>mkswap</code> — <code>swapon</code> only warns about 0644 and still exits 0.</li>
<li><code>--memory-swap</code> is the total of RAM and swap, and a Compose service with only <code>mem_limit</code> gets as much swap again as RAM.</li>
<li>Have a modest swap (1–2 GB on 6 GB), lower <code>vm.swappiness</code>, and alert on the swap rate, not the swap size.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">swapon(8) and mkswap(8)</span><span class="lc-sub">man 8 swapon — including the permission check that warns about — but does not block — a world-readable swap file, and <code>--priority</code> for multiple swap areas.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — vm.swappiness</span><span class="lc-sub">docs.kernel.org/admin-guide/sysctl/vm.html — what the number actually weighs (anonymous pages versus file-backed cache), which is not "how eager to swap" as commonly described.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8)</span><span class="lc-sub">man 8 vmstat — the <code>si</code>/<code>so</code> columns and why the first line of output is an average since boot rather than a current reading.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chris Down — In defence of swap</span><span class="lc-sub">chrisdown.name/2018/01/02/in-defence-of-swap.html — the clearest argument that swap is about reclaim behaviour rather than emergency capacity, from a kernel memory-management maintainer.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 14: Linux in depth</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the kernel side of this lesson: page cache, reclaim, swap and pressure stall information, measured on a real machine.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — reading free, vmstat and /proc/meminfo</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why "available" is the only column in <code>free</code> worth looking at, and what buff/cache really is.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Swap: mua được gì và trả giá gì</h2>
<p class="lead">Swap là ĐĨA giả làm bộ nhớ. Trên một VPS nhỏ nó là khác biệt giữa một tiến trình CHẾT và một tiến trình chỉ CHẬM — và cả hai đều là kết cục thật mà bạn phải chọn một cách có chủ đích.</p>

<h3>Đúng khối việc ấy, khi có swap</h3>
${slide('dv-08', 13, 'Có swap: 137 thành 0, RAM ghim ở trần, swap lớn dần')}
<p>Bài 8.1 đo một cú cấp phát 500 MB trong cgroup 256 MB bị giết ở mốc 401 ms. Thêm một tệp swap 512 MB và nâng trần bộ-nhớ-cộng-swap của nhóm lên 768 MB:</p>

<pre><code class="language-bash">fallocate -l 512M /swap-thu
chmod 600 /swap-thu          <span class="tok-comment"># bat buoc: swapon TU CHOI tep ai cung doc duoc</span>
mkswap /swap-thu &amp;&amp; swapon /swap-thu

echo \$((768*1024*1024)) > \$CG/memory.memsw.limit_in_bytes</code></pre>

<div class="out">=== xin 500 MB trong cgroup RAM 256 MB + swap 512 MB ===
  da cap 400 MB, rss=230 MB
  da cap 450 MB, rss=281 MB
XONG 500 MB — KHONG bi giet
  ma thoat: 0 | mat 1011 ms</div>

<p>Thoát 0 thay vì 137. Cái tiến trình bị giết ở 8.1 giờ chạy xong.</p>

<div class="pitfall">
<p><strong>Bẫy — lần đọc ĐẦU của tôi kết luận swap không hề được dùng, và đó là lỗi của tôi.</strong> Tôi xem <code>memory.stat</code> SAU khi tiến trình đã thoát và thấy <code>swap 0</code>, rồi thoáng kết luận rằng cú cấp phát bằng cách nào đó vừa lọt RAM. Không phải: bộ đếm đó là theo cgroup và các trang được giải phóng ngay khoảnh khắc tiến trình chết, nên tới lúc tôi đọc thì chẳng còn gì để đếm. Lấy mẫu <em>TRONG LÚC</em> chạy mới cho thấy chuyện thật sự xảy ra:</p>
</div>

<div class="out">  t=0.25s  cgroup_rss=164 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=0.50s  cgroup_rss=216 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=0.75s  cgroup_rss=254 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=1.00s  cgroup_rss=254 MB  cgroup_swap=58 MB   he_thong_swap=63 MB
  t=1.25s  cgroup_rss=254 MB  cgroup_swap=122 MB  he_thong_swap=128 MB
  t=1.50s  cgroup_rss=253 MB  cgroup_swap=189 MB  he_thong_swap=195 MB</div>

<p>RSS leo lên 254 MB — cái trần — rồi đứng sững tại đó trong khi swap lớn dần phía sau: 58, 122, 189 MB. Giới hạn được thực thi CHÍNH XÁC; phần tràn đi xuống đĩa. Đó là swap làm trọn việc của nó, nhìn thấy được trong sáu lần lấy mẫu.</p>


<h3>Đo lại trên cgroup v2, lấy mẫu TRONG LÚC nó chạy</h3>
<p>Trên cgroup v2 hai cái trần độc lập nhau — <code>memory.max</code> cho RAM, <code>memory.swap.max</code> cho swap — và systemd đưa chúng ra thành <code>MemoryMax=</code> và <code>MemorySwapMax=</code>. VPS thí nghiệm ngày 29/09/2026, cùng yêu cầu 500 MB, cùng 256 MB RAM, cấm swap rồi cho swap:</p>
<pre><code class="language-bash">for sw in 0 512M; do
  echo "== MemoryMax=256M MemorySwapMax=$sw : xin 500 MB"
  sudo systemd-run --unit=thu-swap -p MemoryMax=256M -p MemorySwapMax=$sw --wait \\
    /usr/bin/node /home/deploy/an-ram.js 500 2&gt;&amp;1 | grep -E "result|peak|runtime"
  sudo journalctl -u thu-swap -o cat -q --no-pager | grep -E "XONG|da cap" | tail -1
  sudo systemctl reset-failed thu-swap
done</code></pre>
<div class="out">== MemoryMax=256M MemorySwapMax=0 : xin 500 MB
Finished with result: oom-kill
Service runtime: 1.034s
…
da cap 200 MB, rss=247 MB
== MemoryMax=256M MemorySwapMax=512M : xin 500 MB
Finished with result: success
Service runtime: 1.041s
…
XONG 500 MB</div>
<p>Lần này mẫu được lấy <em>trong lúc</em> tiến trình chạy — đúng bài học của cái bẫy ở trên — đọc cgroup riêng của unit mỗi một phần tư giây:</p>
<pre><code class="language-bash"># mau.sh — chạy an-ram.js trong một unit có trần, lấy mẫu RAM/swap của CHÍNH unit đó mỗi 0,25 s
sudo systemd-run --quiet --unit=thu-swap -p MemoryMax=256M -p MemorySwapMax=512M \\
  /usr/bin/node /home/deploy/an-ram.js 500
CG=/sys/fs/cgroup/system.slice/thu-swap.service; t=0
while [ -d $CG ]; do
  printf "  t=%.2fs  ram=%3d MB  swap=%3d MB\\n" $t \\
    $(( $(cat $CG/memory.current 2&gt;/dev/null || echo 0)/1048576 )) \\
    $(( $(cat $CG/memory.swap.current 2&gt;/dev/null || echo 0)/1048576 ))
  sleep 0.25; t=$(python3 -c "print($t+0.25)")
done
echo "  $(systemctl show thu-swap -p Result --value) | $(sudo journalctl -u thu-swap -o cat -q | grep -E 'XONG|da cap' | tail -1)"</code></pre>
<div class="out">  t=0.00s  ram=  1 MB  swap=  0 MB
  t=0.25s  ram= 54 MB  swap=  0 MB
  t=0.50s  ram=255 MB  swap= 31 MB
  t=0.75s  ram=255 MB  swap= 89 MB
  t=1.00s  ram=255 MB  swap=231 MB
  t=1.25s  ram=  4 MB  swap=  4 MB
  success | XONG 500 MB</div>
<p>RAM leo lên 255 MB rồi bị GHIM ở đó; swap lớn dần phía sau — 31, 89, 231 MB — và cả hai rơi về gần như không ngay khi tiến trình thoát, đó chính là lý do lần đọc "sau khi xong" trong cái bẫy ở trên ra số 0.</p>
<h3>Giờ tới hoá đơn</h3>
${slide('dv-08', 14, 'Cái giá: đọc lại chậm hàng trăm lần; vmstat si/so')}
<p>Một chương trình cấp phát một khối bộ nhớ rồi ĐỌC LẠI hết khối đó ba lượt. Hai kích thước, cùng cái trần 256 MB: một cái vừa, một cái không.</p>

<div class="out">=== VUA RAM: 200 MB trong gioi han 256 MB ===
  doc lai 3 luot 200 MB: 0.277527 ms
  doc lai 3 luot 200 MB: 0.142962 ms
=== TRAN SANG SWAP: 400 MB trong gioi han 256 MB ===
  doc lai 3 luot 400 MB: 66.199207 ms
  doc lai 3 luot 400 MB: 56.482304 ms</div>

<p>0,14–0,28 ms so với 56–66 ms. Gấp đôi dữ liệu, gấp bốn trăm lần thời gian.</p>

<div class="callout warn">
<p><strong>Phép đo đó LÀ gì và KHÔNG PHẢI là gì.</strong> Vòng lặp chạm hai byte mỗi megabyte, nên nó KHÔNG đo thông lượng — nó đo <strong>LỖI TRANG</strong>, mà đó chính xác là cái giá swap bắt trả. Mọi trang được chạm mà đang nằm trên đĩa đều phải được đọc ngược vào trước khi lệnh hoàn tất, và tiến trình bị DỪNG trong lúc đó. Chuẩn hoá theo mỗi megabyte được chạm thì nó chậm hơn khoảng 120–235 lần. Đừng đọc con số 400 lần thô như một tỷ số thông lượng; hãy đọc nó là "lần chạm ĐẦU TIÊN vào một trang đã bị đẩy ra đĩa thì cực kỳ đắt, và ứng dụng của bạn không làm gì cả trong lúc chờ".</p>
</div>


<h3>Hoá đơn, đo lại: chạm vào MỌI trang</h3>
<p>Phép đo ở trên chạm hai byte mỗi megabyte. Một bản khắc nghiệt hơn chạm mọi trang 4 KB, ba lượt, cùng 256 MB RAM và cho phép 512 MB swap — <code>doc-lai.js</code> xin N MB rồi bấm giờ từng lượt:</p>
<pre><code class="language-javascript">// doc-lai.js &lt;MB&gt; — cấp N MB, rồi đọc lại MỌI trang 4 KB, 3 lượt; in thời gian từng lượt
const n = Number(process.argv[2]), g = [];
for (let i = 0; i &lt; n; i++) g.push(Buffer.alloc(2**20, 1));
for (let l = 1; l &lt;= 3; l++) {
  const t = process.hrtime.bigint(); let s = 0;
  for (const b of g) for (let o = 0; o &lt; b.length; o += 4096) s += b[o];
  console.log('luot ' + l + ': doc lai ' + n + ' MB mat ' + (Number(process.hrtime.bigint() - t) / 1e6).toFixed(1) + ' ms');
}</code></pre>
<pre><code class="language-bash">for n in 200 400; do
  sudo systemd-run --unit=thu-doc -p MemoryMax=256M -p MemorySwapMax=512M --wait \\
    /usr/bin/node /home/deploy/doc-lai.js $n &gt;/dev/null 2&gt;&amp;1
  sudo journalctl -u thu-doc -o cat | grep luot | tail -3
done</code></pre>
<div class="out">luot 1: doc lai 200 MB mat 16.0 ms
luot 2: doc lai 200 MB mat 13.3 ms
luot 3: doc lai 200 MB mat 1.2 ms
luot 1: doc lai 400 MB mat 7238.3 ms
luot 2: doc lai 400 MB mat 5223.2 ms
luot 3: doc lai 400 MB mat 4576.0 ms</div>
<p>Tính theo megabyte: khoảng 0,065 ms khi mọi thứ ở trong RAM so với khoảng 12 ms khi một phần ba dữ liệu nằm trong swap — chậm hơn chừng hai trăm lần, đo trên SSD của một chiếc Mac. Và trong lúc lần chạy thứ hai diễn ra, <code>vmstat</code> cho thấy một cái máy ở trạng thái đó trông ra sao từ bên ngoài (đã cắt cột):</p>
<div class="out"> r  b   swpd   free  …      si     so
 0  1 653032 772408  …  152160 153088
 1  0 654148 772168  …  179080 176240
 1  0 653844 774892  …   78784  78252
 2  0 656424 774892  …  158848 158340</div>
<p><code>si</code> và <code>so</code> — số kilobyte mỗi giây đọc vào và đẩy ra swap — cùng lúc quanh 150.000. Đó là chữ ký của thrashing: trang được đọc ngược vào chỉ để bị đẩy ra lại ngay sau đó. <code>swpd</code> gần như không nhúc nhích, nên báo động theo "swap đã dùng" sẽ bỏ lỡ nó.</p>
<h3>Vì sao "chậm" đôi khi tệ hơn "chết"</h3>
${slide('dv-08', 17, 'Ba trạng thái: chết, swap nhẹ, thrashing; đo bằng PSI')}
<p>Một tiến trình bị giết thì hiển nhiên: mã thoát 137, bộ giám sát khởi động lại nó, hệ theo dõi nhận ra, có người đi xem. Một tiến trình đang swap thì chẳng hiển nhiên chút nào. Nó trả lời MỌI request, ĐÚNG, và CUỐI CÙNG thì cũng xong. Thời gian phản hồi đi từ 40 ms lên 4 giây, các hạn giờ bắt đầu nổ ở phía trên, bể kết nối đầy những request về mặt kỹ thuật vẫn đang chạy, và mọi bảng điều khiển đều nói dịch vụ đang sống.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">không swap</span><span class="lz-t">thoát 137</span><span class="lz-d">ồn ào, tức thì, hiển nhiên trong log nhân</span></div>
<div class="lz-step"><span class="lz-k">swap, dùng nhẹ</span><span class="lz-t">ổn</span><span class="lz-d">trang nhàn rỗi bị đẩy ra, không ai nhận ra, đây là swap chạy TỐT</span></div>
<div class="lz-step"><span class="lz-k">swap, dùng nặng</span><span class="lz-t">quẫy đạp</span><span class="lz-d">trạng thái tệ nhất: sống, có trả lời, chậm tới mức không dùng được, và mọi chốt kiểm sức khoẻ đều XANH</span></div>
</div>


<h3>Đo "chậm" một cách trực tiếp: PSI</h3>
<p>Linux báo được các tác vụ đã mất bao nhiêu thời gian <em>đứng chờ bộ nhớ</em> — PSI (pressure stall information, thông tin về thời gian bị áp lực làm đứng). Mỗi nhóm cgroup v2 có một tệp <code>memory.pressure</code>; <code>/proc/pressure/memory</code> là của cả máy. Đọc ở giây thứ năm của lần chạy 400 MB ở trên:</p>
<pre><code class="language-bash">cat /sys/fs/cgroup/system.slice/thu-doc.service/memory.pressure</code></pre>
<div class="out">some avg10=3.04 avg60=0.60 avg300=0.12 total=480289
full avg10=3.04 avg60=0.60 avg300=0.12 total=480289</div>
<p><code>some avg10=3.04</code> nghĩa là trong mười giây vừa qua, có tác vụ nào đó trong nhóm đứng chờ bộ nhớ 3% thời gian; <code>total</code> là tổng thời gian đứng tính bằng micro giây (ở đây 0,48 s). Con số này là phần trăm THỜI GIAN BỊ MẤT, đúng cái người dùng cảm thấy — khác với "RAM đã dùng", thứ lúc nào cũng cao trên mọi máy chủ khoẻ mạnh vì bộ đệm trang lấp đầy mọi chỗ trống.</p>
<h3>Thật ra nên làm gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CÓ swap</span><span class="v">dù chỉ 512 MB–1 GB. Nó cho các trang thật sự nhàn rỗi rời khỏi RAM, mà trên một máy nhỏ đó là chỗ thở thật, miễn phí</span></div>
<div class="kv"><span class="k">ĐỪNG đặt nó như một cái RAM thứ hai</span><span class="v">8 GB swap trên một máy 1 GB KHÔNG cho bạn 9 GB; nó cho bạn một cái máy quẫy đạp rất lâu rồi mới chết</span></div>
<div class="kv"><span class="k">chỉnh <code>vm.swappiness</code></span><span class="v">mặc định 60. Hạ xuống (10–20) trên máy chủ: ưu tiên vứt bộ đệm tệp hơn là đẩy trang của một tiến trình đang chạy ra</span></div>
<div class="kv"><span class="k">báo động theo TỐC ĐỘ</span><span class="v">không phải theo lượng swap đã dùng. Swap dùng ổn định là bình thường; hai cột <code>si</code>/<code>so</code> trong <code>vmstat 1</code> chạy liên tục mới là quẫy đạp</span></div>
</div>

<pre><code>vmstat 1 5
<span class="tok-comment"># cot si = swap-in KB/s, so = swap-out KB/s.</span>
<span class="tok-comment"># ca hai o 0 trong khi 'swpd' lon = LANH MANH: trang nhan roi da roi khoi RAM.</span>
<span class="tok-comment"># ca hai chay lien tuc = THRASHING, du 'swpd' co the khong doi.</span></code></pre>

<div class="pitfall">
<p><strong>Bẫy — một tệp swap CẦN <code>chmod 600</code>, và <code>swapon</code> sẽ nói cho bạn biết.</strong> Swap giữ bất cứ thứ gì từng nằm trong bộ nhớ: token phiên, bí mật đã giải mã, thân request. Một tệp swap ai cũng đọc được là một bản đổ bộ nhớ tiến trình của bạn dưới dạng văn bản thuần nằm trên đĩa, và đó là lý do <code>swapon</code> in ra "insecure permissions" — dù vậy, đo với util-linux của Ubuntu 24.04, nó chỉ <em>cảnh báo</em>: tệp vẫn được bật và lệnh thoát 0 (xem phần từng bước ở dưới). Đừng coi dòng cảnh báo đó là lưới an toàn. Đây cũng là lý do lời khuyên của Chương 4 về bí mật trong biến môi trường có một điều kiện kèm theo — một biến môi trường có thể bị đẩy xuống đĩa như mọi thứ khác.</p>
</div>


<h3>Tạo một swap file trên VPS, từng bước</h3>
<pre><code class="language-bash">sudo fallocate -l 2G /swapfile          # giữ chỗ 2 GB trên đĩa
sudo chmod 600 /swapfile                # CHỈ root đọc được — làm TRƯỚC mkswap
sudo mkswap /swapfile                   # ghi phần đầu vùng swap
sudo swapon /swapfile                   # bật ngay
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab     # bật lại sau reboot
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf  # giữ qua reboot
sudo sysctl vm.swappiness=10            # áp dụng ngay
swapon --show; free -m                  # kiểm lại</code></pre>
<p>Chuyện gì xảy ra nếu làm sai thứ tự, đo trên VPS thí nghiệm (swap file nằm trên một hệ tệp ext4 nhỏ gắn từ thiết bị loop, vì swap file không thể nằm trên hệ tệp overlay của container):</p>
<pre><code class="language-bash">sudo chmod 644 /mnt/dia/swapfile
sudo mkswap /mnt/dia/swapfile
sudo swapon /mnt/dia/swapfile; echo "swapon exit=$?"
swapon --show</code></pre>
<div class="out">mkswap: /mnt/dia/swapfile: insecure permissions 0644, fix with: chmod 0600 /mnt/dia/swapfile
Setting up swapspace version 1, size = 256 MiB (268431360 bytes)
no label, UUID=4a8200b9-f555-489e-8c45-7503dda33924
swapon: /mnt/dia/swapfile: insecure permissions 0644, 0600 suggested.
swapon exit=0
NAME              TYPE  SIZE   USED PRIO
/var/lib/swap     file 1024M 476.6M   -1
/mnt/dia/swapfile file  256M     0B   -1</div>
<p>Cả hai công cụ đều phàn nàn, và cả hai đều làm tiếp: tệp ai cũng đọc được giờ là swap đang chạy, và <code>swapon</code> trả về 0 — một script deploy kiểm <code>$?</code> sẽ gọi đó là thành công. (Dòng <code>/var/lib/swap</code> là swap của chính máy ảo Docker Desktop; bật swap trong một container đặc quyền là thêm nó cho CẢ máy ảo, nên xong thì <code>swapoff</code>.)</p>
<table><thead><tr><th>Bước</th><th>Vì sao</th></tr></thead><tbody>
<tr><td><code>fallocate -l 2G</code></td><td>giữ chỗ ngay lập tức; trên hệ tệp không hỗ trợ cách này cho swap thì <code>dd if=/dev/zero of=/swapfile bs=1M count=2048</code> là đường lùi chậm mà chắc</td></tr>
<tr><td><code>chmod 600</code> trước</td><td>swap giữ bộ nhớ tiến trình — token, bí mật, thân request; dòng cảnh báo sẽ không chặn bạn</td></tr>
<tr><td>dòng trong <code>/etc/fstab</code></td><td>thiếu nó thì swap biến mất sau lần khởi động lại kế tiếp, và bạn phát hiện ra vào đợt tăng tải kế tiếp</td></tr>
<tr><td><code>vm.swappiness=10</code></td><td>mặc định 60; thấp hơn thì ưu tiên bỏ bộ đệm tệp thay vì đẩy trang của tiến trình đang chạy ra ngoài</td></tr>
<tr><td>cỡ 1–2 GB cho VPS 6 GB</td><td>đủ chỗ cho trang nhàn rỗi và đợt tăng ngắn; swap to bằng RAM chỉ cho cái máy thrash lâu hơn trước khi chết</td></tr>
</tbody></table>
<h3>Chỗ kế toán cgroup cắn bạn</h3>
${slide('dv-08', 16, '--memory-swap là TỔNG; mem_limit trơn cho thêm chừng ấy swap')}
<p>Trên cgroup v1 có HAI cái trần, và cái thứ hai rất dễ bỏ sót:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">memory.limit_in_bytes</span><span class="lz-lnote">CHỈ RAM</span></div>
<div class="lz-layer"><span class="lz-lname">memory.memsw.limit_in_bytes</span><span class="lz-lnote">RAM <em>CỘNG</em> swap, gộp lại. Đặt bằng cái thứ nhất là nhóm đó KHÔNG swap được chút nào — mà đó chính xác là cách bài 8.1 tạo ra một cú giết trên một cái máy CÓ swap</span></div>
<div class="lz-layer"><span class="lz-lname">cgroup v2: memory.max + memory.swap.max</span><span class="lz-lnote">hai con số độc lập, rõ ràng hơn; <code>memory.swap.max=0</code> tắt swap cho nhóm đó</span></div>
</div>

<p>Docker phơi cái này ra thành <code>--memory</code> và <code>--memory-swap</code>, và cùng cái bẫy đó áp dụng: đặt chúng bằng nhau là tắt swap hoàn toàn cho container ấy.</p>


<h3>Đo thật: Compose cho bạn gì khi bạn chỉ đặt <code>mem_limit</code></h3>
<p>Một dự án Compose bốn dịch vụ trong phòng thí nghiệm (PostgreSQL 16, Redis 7, một backend Node, nginx), có <code>mem_limit</code> cho mọi dịch vụ nhưng chỉ PostgreSQL có <code>memswap_limit</code>:</p>
<pre><code class="language-bash">F='{{.Name}} Memory={{.HostConfig.Memory}}'
F="$F MemorySwap={{.HostConfig.MemorySwap}}"
docker inspect -f "$F" $(docker compose ps -q)</code></pre>
<div class="out">/dv08-backend-1 Memory=805306368 MemorySwap=1610612736
/dv08-nginx-1 Memory=134217728 MemorySwap=268435456
/dv08-postgres-1 Memory=1610612736 MemorySwap=1610612736
/dv08-redis-1 Memory=268435456 MemorySwap=536870912</div>
<p><code>MemorySwap</code> là TỔNG RAM cộng swap. Mọi dịch vụ không có <code>memswap_limit</code> đều được <strong>gấp đôi</strong> <code>mem_limit</code> của nó: backend giới hạn 768 MB có thể phình tới 1,5 GB nếu máy có swap, và sẽ <em>chậm</em> rất lâu trước khi bị giết. Chỉ PostgreSQL, với <code>memswap_limit</code> bằng <code>mem_limit</code>, hoàn toàn không có swap. Quyết định theo từng dịch vụ: một cơ sở dữ liệu mà bạn thà khởi động lại còn hơn để nó bò thì cho hai giá trị bằng nhau; một dịch vụ mà một phút chậm vẫn hơn một lần khởi động lại thì giữ mặc định.</p>

<h3>Trên các máy khác: zram, systemd-oomd, và WSL</h3>
<ul>
<li><strong>Fedora (và nhiều bản phân phối cho máy bàn) swap vào RAM nén, không phải đĩa.</strong> Đọc trên một máy Fedora 44 có 32 GB: <code>swapon --show</code> in <code>/dev/zram0 partition 8G 8G 100</code> — một thiết bị khối nén nằm trong bộ nhớ, lúc đó đầy hoàn toàn — và <code>systemctl is-active systemd-oomd</code> in <code>active</code>. <code>oomctl</code> cho thấy luật của nó: <code>Swap Used Limit: 90.00%</code>, <code>Default Memory Pressure Limit: 60.00%</code>, <code>Default Memory Pressure Duration: 20s</code>. systemd-oomd là một kẻ giết ở <em>không gian người dùng</em>, ra tay theo PSI trước khi OOM killer của nhân phải làm; ảnh Ubuntu server cho VPS không cài sẵn nó, nên thứ bạn đo trên laptop không phải thứ VPS của bạn sẽ làm.</li>
<li><strong>WSL 2</strong> mặc định có một swap file bằng 25% bộ nhớ của nó (tài liệu của Microsoft, 09/2026), lưu thành <code>swap.vhdx</code> trong thư mục tạm của Windows; đặt <code>swap=0</code> trong <code>.wslconfig</code> để tái hiện một VPS không có swap.</li>
<li><strong>Docker Desktop trên Mac</strong> có swap riêng của máy ảo — dòng <code>/var/lib/swap</code> ở trên, 1 GB ở đây. Đó là lý do một container không có <code>--memory-swap</code> trên Mac của bạn vẫn swap được dù swap của chính macOS chẳng liên quan gì.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS demo 1 GB của nhóm không có swap, và backend bị giết với mã 137 mỗi lần cả lớp vào xem cùng lúc. Một bạn nói "thêm 4 GB swap là xong", bạn khác nói "swap là tà đạo". Phân xử bằng số đo trên VPS thí nghiệm, không bằng ý kiến.</p>
<ol>
<li>Trên VPS thí nghiệm: <code>systemd-run</code> với <code>MemoryMax=256M</code> và <code>MemorySwapMax=0</code>, rồi <code>512M</code>, chạy <code>an-ram.js 500</code>. Ghi lại <code>Result</code> của từng lần.</li>
<li>Chạy vòng lấy mẫu của bài này vào cgroup của unit trong khi <code>an-ram.js 500</code> chạy có swap. Ghi lại cái "trần phẳng" của RAM và các con số swap.</li>
<li>Chạy <code>doc-lai.js 200</code> và <code>doc-lai.js 400</code> dưới cùng giới hạn; ở một phiên SSH thứ hai để <code>vmstat 1</code> chạy. Tính ms mỗi MB cho cả hai.</li>
<li>Trên một ext4 gắn qua loop bên trong VPS thí nghiệm, tạo swap file 256 MB với <code>chmod 644</code>, chạy <code>mkswap</code> và <code>swapon</code>, rồi kiểm <code>$?</code>. Sau đó <code>swapoff</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> có oom-kill so với success cho cùng một khối việc, một trần phẳng của RAM với swap lớn dần phía sau, hệ số chậm mỗi MB của chính máy bạn (hàng trăm lần là bình thường), số si/so lúc thrash, và <code>swapon exit=0</code> cho tệp 0644 — cộng một đoạn khuyến nghị cho VPS của nhóm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Swap (vùng tráo)</span><span class="v">Đĩa (hoặc RAM nén) dùng để giữ các trang bộ nhớ không vừa RAM.</span></div>
  <div class="kv"><span class="k">Page fault (lỗi trang)</span><span class="v">Chạm vào một trang không có trong RAM; nếu nó ở swap, tiến trình phải chờ một lần đọc đĩa.</span></div>
  <div class="kv"><span class="k">Thrashing (quẫy đạp)</span><span class="v">Trang bị đọc vào đẩy ra liên tục; máy còn sống nhưng dành thời gian để chuyển trang.</span></div>
  <div class="kv"><span class="k">si / so (vào / ra swap)</span><span class="v">Cột của <code>vmstat</code>: KB mỗi giây đọc vào / đẩy ra swap — tốc độ mới là thứ quan trọng.</span></div>
  <div class="kv"><span class="k">vm.swappiness (độ ưa swap)</span><span class="v">Núm của nhân (mặc định 60) cân giữa bộ đệm tệp và trang của tiến trình khi thu hồi.</span></div>
  <div class="kv"><span class="k">PSI (thông tin đứng vì áp lực)</span><span class="v">Phần thời gian các tác vụ bị đứng chờ bộ nhớ.</span></div>
  <div class="kv"><span class="k">zram (RAM nén)</span><span class="v">Một thiết bị khối nén trong RAM dùng làm swap; mặc định trên Fedora.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Swap biến một cú OOM thành một lần thành công chậm hơn: cùng yêu cầu 500 MB đi từ <code>oom-kill</code> sang <code>success</code>, RAM ghim ở 255 MB và swap lớn dần phía sau.</li>
<li>Cái giá trả cho MỌI trang nằm trên đĩa — đo được chậm khoảng hai trăm lần mỗi megabyte trên SSD.</li>
<li>Thrashing hiện ra khi <code>si</code>/<code>so</code> cùng cao một lúc, và trong thời gian đứng của PSI; "swap đã dùng" che mất nó.</li>
<li>Swap file phải <code>chmod 600</code> trước <code>mkswap</code> — <code>swapon</code> chỉ cảnh báo tệp 0644 rồi vẫn thoát 0.</li>
<li><code>--memory-swap</code> là tổng RAM và swap, và một dịch vụ Compose chỉ có <code>mem_limit</code> được thêm chừng ấy swap nữa.</li>
<li>Giữ một swap vừa phải (1–2 GB cho 6 GB), hạ <code>vm.swappiness</code>, và báo động theo tốc độ swap chứ không theo dung lượng swap.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">swapon(8) và mkswap(8)</span><span class="lc-sub">man 8 swapon — kể cả phép kiểm quyền cảnh báo — nhưng không chặn — một tệp swap ai cũng đọc được, và <code>--priority</code> cho nhiều vùng swap.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — vm.swappiness</span><span class="lc-sub">docs.kernel.org/admin-guide/sysctl/vm.html — con số đó THẬT SỰ cân cái gì (trang vô danh so với bộ đệm có tệp phía sau), chứ không phải "mức hăng hái swap" như người ta hay mô tả.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8)</span><span class="lc-sub">man 8 vmstat — hai cột <code>si</code>/<code>so</code> và vì sao DÒNG ĐẦU của output là trung bình kể từ lúc khởi động chứ không phải số đo hiện tại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chris Down — In defence of swap</span><span class="lc-sub">chrisdown.name/2018/01/02/in-defence-of-swap.html — lập luận rõ nhất rằng swap là chuyện HÀNH VI THU HỒI chứ không phải sức chứa dự phòng, viết bởi một người bảo trì phần quản lý bộ nhớ của nhân.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 14: Linux chuyên sâu</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phía nhân của bài này: bộ đệm trang, thu hồi, swap và PSI, đo trên một máy thật.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đọc free, vmstat và /proc/meminfo</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao "available" là cột DUY NHẤT trong <code>free</code> đáng nhìn, và buff/cache thật ra là gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — ENOSPC, and the two disks that are full without being full|||8.4 — ENOSPC, và hai cái đĩa ĐẦY mà không đầy',
      slug: 'deploy-8-4-day-dia',
      type: 'VIDEO',
      description: 'Một bộ đệm dựng làm đầy đĩa và lệnh ghi WAL trả errno 28. Dọn mất 8 mili giây. Rồi hai ca khó hơn nhiều: df nói 141 MB dùng còn du nói 41 MB, và một hệ tệp còn 162 MB TRỐNG vẫn từ chối tạo tệp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>ENOSPC, and the two disks that are full without being full</h2>
<p class="lead">A full disk does not degrade — it stops. And unlike memory pressure, the process is not killed: it stays alive, receiving errors it very often does not handle, which is how a full disk becomes a corrupted database rather than an outage.</p>

<h3>The straightforward case</h3>
${slide('dv-08', 18, 'Đĩa đầy: ghi WAL hỏng, rm thì chạy — đo trên ext4 loop')}
<p>A 172 MB filesystem with a 41 MB "database" on it, and a build that writes its cache to the same disk:</p>

<div class="out">=== mot 'ban dung' do bo dem vao cung dia ===
127+0 records out
133169152 bytes (133 MB, 127 MiB) copied, 0.906044 s, 147 MB/s
  dd ma thoat: 1 | mat 910 ms
/dev/loop0      172M  168M     0 100% /mnt/dia</div>

<p>The build itself failed — <code>dd</code> exited 1 after writing 127 of the 200 MB it wanted. Now the database tries to write:</p>

<div class="out">=== gio thu GHI vao 'co so du lieu' khi dia da day ===
  append ma thoat: 0
  ghi WAL 1 MB: HONG — errno 28 No space left on device</div>

<div class="callout warn">
<p><strong>Look at those two lines carefully.</strong> The small append <em>succeeded</em> — it fit in an already-allocated block. The 1 MB write failed with <strong>ENOSPC (errno 28)</strong>. That is the shape of a full disk in practice: not a clean stop, but an arbitrary boundary where some writes work and some do not, depending on their size and where they land. Every piece of software on the machine crosses that boundary at a different moment, which is why a full disk produces a scattering of unrelated-looking errors rather than one clear failure.</p>
</div>

<h3>Recovery is fast, and this surprises people</h3>
<div class="out">=== dia bao 0 con trong. Nhung XOA co chay khong? ===
  rm ma thoat: 0 | mat 8 ms
/dev/loop0      172M   41M  118M  26% /mnt/dia
  ghi WAL 1 MB sau khi xoa: THANH CONG</div>

<p>Eight milliseconds to delete the build cache, 118 MB free immediately, and the write that failed a second ago now succeeds. Deleting works when writing does not — removing a directory entry does not need a new block — and the freed space is usable at once. A machine reporting 100% disk is almost never unrecoverable; it is one <code>rm</code> away from working.</p>

<h3>The 5% you did not know you had</h3>
<pre><code>tune2fs -l /dev/sdX | grep -E 'Reserved block count|Block count'</code></pre>

<div class="out">Block count:              51200
Reserved block count:     2560
Block size:               4096
  → du tru = 10.0 MB (5.0%)</div>

<p>ext4 reserves 5% of the filesystem for root by default. On a data disk that is wasted space you can reclaim with <code>tune2fs -m 1</code>; on the root filesystem it is deliberate, and it is the reason a "full" server still lets you log in and delete something. Set it to zero on <code>/</code> and a runaway log file locks you out of your own machine.</p>

<h3>Case one: df and du disagree</h3>
${slide('dv-08', 19, 'Tệp đã xoá còn mở: df 93%, du 21M, lsof +L1, cắt qua /proc')}
<p>A process writes a 100 MB log file and keeps it open. Something deletes the file — logrotate, a cleanup script, a person:</p>

<div class="out">=== gio XOA cai log do (giong logrotate lam) ===
  df noi : 141M dung, 18M trong
  du noi : 41M
  → df va du LECH NHAU. Tep da xoa nhung mot tien trinh van GIU no mo.</div>

<p>A hundred megabytes that <code>du</code> cannot see and <code>df</code> insists is in use. The file has no name any more, but the inode survives as long as one file descriptor still points at it. You will never find it by walking the filesystem, because there is nothing left to walk to.</p>

<pre><code>lsof -nP +L1     <span class="tok-comment"># +L1 = chi tep co so lien ket &lt; 1, tuc la DA XOA ma con mo</span></code></pre>

<div class="out">COMMAND   PID USER  FD  TYPE  SIZE/OFF NLINK  NODE NAME
python3 10903 root   3w  REG  104857600     0    14 /mnt/dia/cache/log-lon.log (deleted)</div>

<p><code>NLINK 0</code>, 104,857,600 bytes, and the exact process holding it. Two ways out, both measured:</p>

<div class="out">=== cach chua 1: cat cut tep qua /proc/PID/fd ===
/dev/loop0      172M  141M   18M  90% /mnt/dia
  truncate OK
/dev/loop0      172M   41M  118M  26% /mnt/dia

=== cach chua 2: giet tien trinh ===
  tep da xoa con mo tren /mnt/dia: 0</div>

<p><code>: > /proc/&lt;pid&gt;/fd/3</code> truncated the file through the still-open descriptor and returned all 100 MB <em>without restarting anything</em>. That is the move worth remembering: when the process holding a deleted file is your database, you do not want the other option.</p>

<div class="pitfall">
<p><strong>Trap — this is why <code>rm big.log</code> on a running service frees nothing.</strong> The instinct during a disk emergency is to delete the biggest file, and if a process has it open you get exactly zero bytes back while <code>du</code> now shows the space as gone. Truncate instead of deleting — <code>: &gt; big.log</code> or <code>truncate -s 0 big.log</code> — which frees the blocks immediately and leaves the writer with a valid, empty file. This is also precisely what <code>logrotate</code>&#39;s <code>copytruncate</code> option exists for, and why the alternative requires signalling the process to reopen its log.</p>
</div>

<h3>Case two: free space, and still ENOSPC</h3>
${slide('dv-08', 20, 'Cạn inode: 52 MB trống vẫn No space left on device')}
<p>A filesystem formatted with few inodes, then filled with small files:</p>

<div class="out">  dung o tep thu 2004: errno 28 No space left on device
  df -h : 7.9M dung, 162M TRONG, 5% day
  df -i : 2016 inode dung, 0 trong, 100% day
  → 169 MB TRONG, va van bao 'No space left on device'.</div>

<p>The same errno 28, the same message, and <code>df -h</code> reporting the disk is 5% full. Every file needs an inode; run out of inodes and the filesystem is full regardless of how many free blocks remain. On a real server this comes from mail spools, session files, tiny cache entries — anything that produces millions of small files.</p>

<div class="kv-grid">
<div class="kv"><span class="k">df -h says full</span><span class="v">blocks exhausted — delete or truncate something large</span></div>
<div class="kv"><span class="k">df -i says full</span><span class="v">inodes exhausted — delete <em>many</em> files; size is irrelevant</span></div>
<div class="kv"><span class="k">df full, du not</span><span class="v">a deleted file still held open — <code>lsof +L1</code>, then truncate through <code>/proc</code></span></div>
<div class="kv"><span class="k">the first command</span><span class="v"><code>df -h; df -i; lsof -nP +L1 | head</code> — three lines that separate all three cases</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — an attempt at measuring inode exhaustion that measured something else.</strong> My first run created one-byte files on a default ext4 filesystem expecting to run out of inodes. It stopped at 32,394 files with <code>df -i</code> showing only <strong>64%</strong> of inodes used — it had run out of <em>blocks</em>, because ext4 allocates a minimum of one 4 KB block per file. 32,394 one-byte files consumed 127 MB, an amplification of about 4,000×. That failed measurement is worth more than the one I was aiming for: on a real server, "the disk is full and I only have a few hundred megabytes of actual data" is usually this, not inodes. I had to format a second filesystem with <code>mkfs.ext4 -N 2000</code> to produce genuine inode exhaustion.</p>
</div>


<h3>Run it yourself: a disk you are allowed to fill</h3>
<p>Never practise this on a real disk. A filesystem in a file, mounted through a loop device, fills in a second and disappears with one <code>umount</code>. On the lab VPS (a privileged container, so it may create loop devices) on 29/09/2026:</p>
<pre><code class="language-bash">sudo truncate -s 64M /dia.img                    # một "đĩa" 64 MB trong một tệp
sudo mkfs.ext4 -q -m 0 /dia.img                  # -m 0: không giữ 5% cho root
sudo mkdir -p /mnt/dia &amp;&amp; sudo mount -o loop /dia.img /mnt/dia
sudo chown deploy /mnt/dia
mkdir /mnt/dia/pg /mnt/dia/cache; head -c 20M /dev/urandom &gt; /mnt/dia/pg/data
dd if=/dev/zero of=/mnt/dia/cache/layer bs=1M count=100 status=none; echo "dd exit=$?"
df -h /mnt/dia | tail -1
head -c 1M /dev/urandom &gt;&gt; /mnt/dia/pg/wal; echo "ghi WAL 1 MB exit=$?"
rm -rf /mnt/dia/cache; df -h /mnt/dia | tail -1</code></pre>
<div class="out">dd exit=1
dd: error writing '/mnt/dia/cache/layer': No space left on device
/dev/loop0       56M   55M  664K  99% /mnt/dia
head: error writing 'standard output': No space left on device
ghi WAL 1 MB exit=1
/dev/loop0       56M   21M   35M  38% /mnt/dia</div>
<p>(The <code>dd exit=1</code> line appears before the error only because stdout and stderr travel separately over SSH.) A 64 MB image gives 56 MB of usable space after ext4's own metadata. The "build cache" hits the wall, then the "database" cannot append 1 MB to its WAL — and <code>rm</code> of the cache brings the disk straight back to 38%. Then the other two cases, on the same lab:</p>
<pre><code class="language-bash"># xoa-mo.sh — một tiến trình giữ mở một log 30 MB, rồi log bị xoá
python3 -c 'import time; f=open("/mnt/dia/app.log","w"); f.write("x"*30*2**20); f.flush(); time.sleep(40)' &amp;
sleep 1
df -h /mnt/dia | tail -1; rm /mnt/dia/app.log; echo "--- da rm app.log"
df -h /mnt/dia | tail -1; sudo du -sh /mnt/dia
lsof -nP +L1 | grep -E "COMMAND|deleted"
P=$(lsof -nP +L1 | awk '/deleted/ {print $2; exit}')
: &gt; /proc/$P/fd/3; echo "--- da cat cut qua /proc/$P/fd/3"; df -h /mnt/dia | tail -1; kill $P</code></pre>
<div class="out">/dev/loop0       56M   51M  4.1M  93% /mnt/dia
--- da rm app.log
/dev/loop0       56M   51M  4.1M  93% /mnt/dia
21M	/mnt/dia
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 2408 deploy    3w   REG    7,0 31457280     0   13 /mnt/dia/app.log (deleted)
--- da cat cut qua /proc/2408/fd/3
/dev/loop0       56M   21M   35M  38% /mnt/dia</div>
<pre><code class="language-bash">sudo truncate -s 64M /inode.img &amp;&amp; sudo mkfs.ext4 -q -N 1024 /inode.img   # chỉ 1024 inode
sudo mkdir -p /mnt/ino &amp;&amp; sudo mount -o loop /inode.img /mnt/ino &amp;&amp; sudo chown deploy /mnt/ino
i=0; while head -c 100 /dev/zero &gt; /mnt/ino/s$i 2&gt;/tmp/e; do i=$((i+1)); done
df -h /mnt/ino | tail -1; df -i /mnt/ino | tail -1</code></pre>
<div class="out">bash: line 10: /mnt/ino/s1013: No space left on device
/dev/loop1       60M  4.0M   52M   8% /mnt/ino
/dev/loop1       1024  1024     0  100% /mnt/ino</div>
<p>Three different disks, one error message. The first command during any disk incident is therefore the one that tells them apart: <code>df -h; df -i; lsof -nP +L1 | head</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>The first measurement went wrong, and the mistake is instructive.</strong> The script that found the deleted file first used <code>pgrep -f "app.log"</code> to get its process ID — and matched the <em>shell running the script</em>, whose own command line also contained "app.log". The truncation went to a non-existent descriptor, and the final <code>kill</code> killed the SSH session instead of the Python process. <code>lsof +L1</code> names the process that actually holds the deleted file; use its PID, not a text search over command lines.</p></div>

<h3>Docker's own logs: the file nobody rotates (measured)</h3>
<p>Every line a container prints to stdout is kept by Docker in <code>/var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log</code>, and with the default <code>json-file</code> driver <strong>nothing limits its size</strong>. Measured in Docker Desktop: a container printing 400,000 short access-log lines, first with the defaults, then with a cap:</p>
<pre><code class="language-bash">docker run -d --name dv08-log alpine sh -c \\
  'i=0; while [ $i -lt 400000 ]; do echo "GET /api/v1/feed 200 12ms user=$i"; i=$((i+1)); done; sleep 30'
docker run -d --name dv08-log --log-opt max-size=5m --log-opt max-file=2 alpine sh -c '…cùng vòng lặp…'
# đọc kích thước tệp log bên trong máy ảo Docker Desktop (sau ~12 giây):
ID=$(docker inspect -f '{{.Id}}' dv08-log)
docker run --rm --privileged --pid=host alpine nsenter -t 1 -m -- \\
  sh -c "ls -la /var/lib/docker/containers/$ID/ | grep json.log | awk '{print \\$5, \\$9}'"
# kích thước chữ app thật sự in ra, để so:
docker run --rm alpine sh -c '…cùng vòng lặp… | wc -c'</code></pre>
<div class="out">43051196 11b2758d…-json.log
3040250 71d38d84…-json.log
5000008 71d38d84…-json.log.1
15088890</div>
<p>The first line is the uncapped run, the next two the capped run, the last the plain byte count of the text itself. 15.1 MB of text became <strong>43.1 MB</strong> on disk — every line is wrapped in JSON with its stream name and a nanosecond timestamp, about 2.85 times the original. With <code>max-size=5m</code> and <code>max-file=2</code> the same output stays at 8 MB: one full file of 5,000,008 bytes plus the current one. A chatty backend at debug level on a small VPS can fill gigabytes this way in days, on the same disk as the database.</p>
<table><thead><tr><th>Where</th><th>What to write</th><th>Applies to</th></tr></thead><tbody>
<tr><td><code>compose.yaml</code>, per service</td><td><code>logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }</code></td><td>that service, on the next <code>up</code></td></tr>
<tr><td><code>/etc/docker/daemon.json</code></td><td><code>{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }</code></td><td>containers <em>created</em> after <code>dockerd</code> restarts — existing ones keep their old setting</td></tr>
<tr><td><code>/etc/systemd/journald.conf</code></td><td><code>SystemMaxUse=500M</code></td><td>the system journal (then <code>systemctl restart systemd-journald</code>)</td></tr>
</tbody></table>
<p><code>docker logs</code> reads these files, so capping them also caps how far back <code>docker logs</code> can go. Keep what you need elsewhere (Chapter 9).</p>
<h3>The disk that takes the database with it</h3>
${slide('dv-08', 22, 'Cache build, ảnh cũ, log, bản phát hành — cùng đĩa với CSDL')}
<p>This repository&#39;s notes record the version of this that matters: the Docker build cache grew to <strong>7.6 GB on the same disk as PostgreSQL</strong>, and one deploy died mid-run with <em>no space left on device</em> — the disk had dropped to 1.8 GB free while <code>next build</code> was running. The fix was structural, not a cleanup: builds moved off the VPS entirely so the build cache never lands there, and a weekly cron reclaims disk as a backstop.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what fills a VPS</span><span class="lz-t">build cache, images, logs, old releases</span><span class="lz-d">all four grow monotonically unless something removes them</span></div>
<div class="lz-step"><span class="lz-k">what it kills</span><span class="lz-t">whatever writes next</span><span class="lz-d">usually the database, because it writes constantly</span></div>
<div class="lz-step"><span class="lz-k">the real fix</span><span class="lz-t">do not put growth on the data disk</span><span class="lz-d">build elsewhere; cap logs; bound release retention (6.1)</span></div>
</div>

<pre><code class="language-bash"><span class="tok-comment"># bon cho gan nhu chac chan la thu pham, theo thu tu hay gap:</span>
docker system df                      <span class="tok-comment"># bo dem dung + anh mo coi</span>
du -sh /var/log/* | sort -h | tail    <span class="tok-comment"># log khong gioi han</span>
du -sh /srv/*/ban/* | sort -h | tail  <span class="tok-comment"># ban phat hanh cu (6.1)</span>
journalctl --disk-usage               <span class="tok-comment"># journal khong dat SystemMaxUse</span></code></pre>

<div class="callout ok">
<p><strong>Alert on the trend, not the threshold.</strong> "Disk 90% full" fires when you have hours left, at whatever hour that happens to be. "Disk will be full in three days at the current rate" fires while it is still office hours and the fix is unhurried. The second is one line of arithmetic over two <code>df</code> samples, and it is the single most useful thing in Chapter 9.</p>
</div>


<h3>What is growing on your disk right now</h3>
<p>For scale, the development Mac this course was written on, read on 29/09/2026 — a machine where nothing had ever been pruned deliberately:</p>
<pre><code class="language-bash">docker system df</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          27        19        13.47GB   2.238GB (16%)
Containers      37        11        975.9MB   553.7MB (56%)
Local Volumes   83        25        13.38GB   8.347GB (62%)
Build Cache     117       15        5.685GB   2.337GB</div>
<p>5.7 GB of build cache on a laptop is harmless; the same number on a 6 GB-RAM VPS whose disk also holds PostgreSQL is the incident this repository recorded. When you do clean, clean by age and never by "everything":</p>
<pre><code class="language-bash">docker builder prune -f --filter until=168h     # cache dựng cũ hơn 7 ngày
docker image prune -f --filter until=168h       # ảnh lơ lửng cũ hơn 7 ngày
journalctl --disk-usage &amp;&amp; sudo journalctl --vacuum-size=200M</code></pre>
<div class="pitfall co-tieu-de"><p><strong>What you must never delete in a disk emergency.</strong> At 100% disk, the instinct is to delete the biggest things you can see. On a database server the biggest things are often exactly the ones that must not go: PostgreSQL's <code>pg_wal</code> directory (deleting WAL files by hand corrupts the database — they are not logs in the "application log" sense), and Docker volumes (<code>docker volume prune</code> or any prune with <code>--volumes</code> can remove the volume that <em>is</em> your database — for example while the stack is down and nothing is using it). Delete from the list above — build cache, old images, container logs, journal, old releases — and leave data directories alone.</p></div>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>Docker Desktop keeps images, containers, volumes and build cache inside one virtual disk</strong>, with its own size limit in Settings → Resources. When it fills, a build fails with the same <code>no space left on device</code> while Finder still shows plenty of free space on the Mac. <code>docker system df</code> reports usage inside that virtual disk, which is the number that matters.</li>
<li><strong>WSL 2 stores its Linux filesystem in a virtual disk file</strong> on the Windows drive; <code>df -h /</code> inside WSL shows the virtual disk, not drive C:.</li>
<li><strong><code>du</code> on macOS</strong> (BSD) has no <code>--max-depth</code>; use <code>du -d 1 -h</code>. On the VPS, GNU <code>du -xh --max-depth=1 /</code> works and <code>-x</code> keeps it on one filesystem.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a week after the demo, the group's VPS starts answering with 500s. The backend log shows <code>ENOSPC</code>, PostgreSQL refuses writes, and someone already deleted "the big log file" without any disk coming back. Rehearse all three cases on a disk you are allowed to break.</p>
<ol>
<li>On the lab VPS, build the 64 MB ext4 image, mount it, fill it with a "cache", and confirm a 1 MB append to <code>pg/wal</code> fails. Recover with <code>rm</code> and read <code>df -h</code> again.</li>
<li>Run <code>xoa-mo.sh</code>: observe <code>df</code> and <code>du</code> disagreeing, find the file with <code>lsof -nP +L1</code>, and free the space through <code>/proc/&lt;pid&gt;/fd</code> without killing anything.</li>
<li>Format a second image with <code>-N 1024</code>, create small files until it fails, and read <code>df -h</code> and <code>df -i</code> side by side.</li>
<li>On your own machine, run the 400,000-line container once without and once with <code>--log-opt max-size=5m --log-opt max-file=2</code>; compare the log file sizes (on Docker Desktop read them through a privileged container).</li>
</ol>
<p><strong>Done when:</strong> you have one diagnostic command for each case (<code>df -h</code>, <code>lsof +L1</code>, <code>df -i</code>), you recovered the deleted-but-open space with the process still alive, your log experiment shows the uncapped file several times larger than the text printed, and you have unmounted both images and removed the containers.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ENOSPC (errno 28)</span><span class="v">"No space left on device" — returned for missing blocks <em>and</em> for missing inodes.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The record every file needs; a filesystem can run out of them with blocks to spare.</span></div>
  <div class="kv"><span class="k">Loop device</span><span class="v">A file presented as a disk, so a filesystem can be made and filled safely.</span></div>
  <div class="kv"><span class="k">Reserved blocks</span><span class="v">ext4's default 5% kept for root, so an admin can still log in to a full disk.</span></div>
  <div class="kv"><span class="k">Deleted but open</span><span class="v">A file with no name whose space is held by a process's descriptor (<code>NLINK 0</code>).</span></div>
  <div class="kv"><span class="k">json-file driver</span><span class="v">Docker's default log store; unbounded unless <code>max-size</code>/<code>max-file</code> are set.</span></div>
  <div class="kv"><span class="k">Log rotation</span><span class="v">Capping and cycling log files so they cannot grow without end.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A full disk does not kill processes — it makes their writes fail, and the database is the one that writes all the time.</li>
<li>Deleting works on a full disk and the space is usable at once; the question is only what to delete.</li>
<li><code>df</code> full while <code>du</code> is not means a deleted file still held open: <code>lsof +L1</code>, then truncate through <code>/proc/&lt;pid&gt;/fd</code>.</li>
<li>Free blocks with ENOSPC means inodes ran out: <code>df -i</code>, then delete many small files.</li>
<li>Docker's json-file logs are unbounded by default — measured 15 MB of text becoming 43 MB — so set <code>max-size</code>/<code>max-file</code>.</li>
<li>The structural fix is to keep growth off the database's disk: no builds on the VPS, capped logs, bounded releases, pruning by age.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ENOSPC</span><span class="lc-sub">man 3 errno — errno 28, and the neighbouring EDQUOT (quota) and EFBIG (file too large), which produce similar symptoms from different causes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — the +L option</span><span class="lc-sub">man 8 lsof — <code>+L1</code> filters to files with a link count below 1, which is exactly the deleted-but-open case measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tune2fs(8) and mkfs.ext4(8)</span><span class="lc-sub">man 8 tune2fs — <code>-m</code> for the reserved percentage, and <code>mkfs.ext4 -N</code> / <code>-i</code> for inode count, the flag used to reproduce inode exhaustion.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8) — copytruncate</span><span class="lc-sub">man 8 logrotate — the two strategies for rotating a log a process has open, and the small window of lost lines that <code>copytruncate</code> accepts.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 10: disk, packages &amp; logs</span><span class="lc-sub">/courses/linux-bash/learn${REF} — <code>df</code>, <code>du</code>, <code>journalctl</code> and <code>logrotate</code> from the ground up, including the full-disk drill.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — images, layers and what system prune actually removes</span><span class="lc-sub">/courses/docker/learn${REF} — where the build cache lives, and why <code>docker system df</code> and <code>du</code> report different numbers for it.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>ENOSPC, và hai cái đĩa ĐẦY mà không đầy</h2>
<p class="lead">Một cái đĩa đầy KHÔNG suy giảm dần — nó DỪNG. Và khác với sức ép bộ nhớ, tiến trình không bị giết: nó vẫn sống, nhận về những lỗi mà rất thường là nó không xử lý, và đó là cách một cái đĩa đầy biến thành một cơ sở dữ liệu hỏng chứ không phải một lần gián đoạn.</p>

<h3>Ca đơn giản</h3>
${slide('dv-08', 18, 'Đĩa đầy: ghi WAL hỏng, rm thì chạy — đo trên ext4 loop')}
<p>Một hệ tệp 172 MB có một "cơ sở dữ liệu" 41 MB trên đó, và một bản dựng ghi bộ đệm của nó vào cùng cái đĩa:</p>

<div class="out">=== mot 'ban dung' do bo dem vao cung dia ===
127+0 records out
133169152 bytes (133 MB, 127 MiB) copied, 0.906044 s, 147 MB/s
  dd ma thoat: 1 | mat 910 ms
/dev/loop0      172M  168M     0 100% /mnt/dia</div>

<p>Bản thân bản dựng hỏng — <code>dd</code> thoát 1 sau khi ghi 127 trên 200 MB nó muốn. Giờ cơ sở dữ liệu thử ghi:</p>

<div class="out">=== gio thu GHI vao 'co so du lieu' khi dia da day ===
  append ma thoat: 0
  ghi WAL 1 MB: HONG — errno 28 No space left on device</div>

<div class="callout warn">
<p><strong>Nhìn kỹ hai dòng đó.</strong> Cú nối thêm nhỏ thì <em>THÀNH CÔNG</em> — nó lọt vào một khối đã cấp phát sẵn. Cú ghi 1 MB thì hỏng với <strong>ENOSPC (errno 28)</strong>. Đó là hình dạng thực tế của một cái đĩa đầy: không phải một cú dừng sạch sẽ, mà là một ranh giới tuỳ tiện nơi có lệnh ghi chạy được và có lệnh không, tuỳ vào kích thước và chỗ nó rơi vào. Mọi phần mềm trên cái máy đó vượt qua ranh giới ấy ở một khoảnh khắc khác nhau, và đó là lý do một cái đĩa đầy đẻ ra một mớ lỗi trông chẳng liên quan gì tới nhau thay vì một cú hỏng rõ ràng.</p>
</div>

<h3>Phục hồi thì NHANH, và chuyện này làm người ta ngạc nhiên</h3>
<div class="out">=== dia bao 0 con trong. Nhung XOA co chay khong? ===
  rm ma thoat: 0 | mat 8 ms
/dev/loop0      172M   41M  118M  26% /mnt/dia
  ghi WAL 1 MB sau khi xoa: THANH CONG</div>

<p>Tám mili giây để xoá bộ đệm dựng, 118 MB trống ngay lập tức, và cái lệnh ghi vừa hỏng một giây trước giờ chạy được. XOÁ chạy được trong khi GHI thì không — gỡ một mục thư mục không cần khối mới — và chỗ trống ra dùng được ngay. Một cái máy báo đĩa 100% thì gần như không bao giờ là không cứu được; nó cách một lệnh <code>rm</code> là chạy lại.</p>

<h3>5% mà bạn không biết là mình có</h3>
<pre><code>tune2fs -l /dev/sdX | grep -E 'Reserved block count|Block count'</code></pre>

<div class="out">Block count:              51200
Reserved block count:     2560
Block size:               4096
  → du tru = 10.0 MB (5.0%)</div>

<p>ext4 mặc định dành 5% hệ tệp cho root. Trên một đĩa dữ liệu thì đó là chỗ phí bạn đòi lại được bằng <code>tune2fs -m 1</code>; trên hệ tệp gốc thì nó là CỐ Ý, và nó là lý do một máy chủ "đầy" vẫn cho bạn đăng nhập vào và xoá thứ gì đó. Đặt nó về không trên <code>/</code> và một tệp log mất kiểm soát sẽ khoá bạn ra khỏi chính cái máy của mình.</p>

<h3>Ca một: df và du không đồng ý với nhau</h3>
${slide('dv-08', 19, 'Tệp đã xoá còn mở: df 93%, du 21M, lsof +L1, cắt qua /proc')}
<p>Một tiến trình ghi một tệp log 100 MB rồi GIỮ nó mở. Có thứ gì đó xoá cái tệp — logrotate, một script dọn dẹp, một con người:</p>

<div class="out">=== gio XOA cai log do (giong logrotate lam) ===
  df noi : 141M dung, 18M trong
  du noi : 41M
  → df va du LECH NHAU. Tep da xoa nhung mot tien trinh van GIU no mo.</div>

<p>Một trăm megabyte mà <code>du</code> không thấy được và <code>df</code> thì khăng khăng là đang dùng. Cái tệp không còn TÊN nữa, nhưng cái inode vẫn sống chừng nào còn một mô tả tệp trỏ vào nó. Bạn sẽ không bao giờ tìm ra nó bằng cách đi khắp hệ tệp, vì chẳng còn gì để đi tới.</p>

<pre><code>lsof -nP +L1     <span class="tok-comment"># +L1 = chi tep co so lien ket &lt; 1, tuc la DA XOA ma con mo</span></code></pre>

<div class="out">COMMAND   PID USER  FD  TYPE  SIZE/OFF NLINK  NODE NAME
python3 10903 root   3w  REG  104857600     0    14 /mnt/dia/cache/log-lon.log (deleted)</div>

<p><code>NLINK 0</code>, 104.857.600 byte, và đúng cái tiến trình đang giữ nó. Hai đường ra, đo cả hai:</p>

<div class="out">=== cach chua 1: cat cut tep qua /proc/PID/fd ===
/dev/loop0      172M  141M   18M  90% /mnt/dia
  truncate OK
/dev/loop0      172M   41M  118M  26% /mnt/dia

=== cach chua 2: giet tien trinh ===
  tep da xoa con mo tren /mnt/dia: 0</div>

<p><code>: > /proc/&lt;pid&gt;/fd/3</code> cắt cụt cái tệp qua chính cái mô tả còn mở và trả lại đủ 100 MB mà <em>KHÔNG khởi động lại thứ gì</em>. Đó là nước đi đáng nhớ: khi cái tiến trình đang giữ tệp đã xoá là cơ sở dữ liệu của bạn, bạn KHÔNG muốn dùng lựa chọn còn lại.</p>

<div class="pitfall">
<p><strong>Bẫy — đây là lý do <code>rm big.log</code> trên một dịch vụ đang chạy chẳng giải phóng được gì.</strong> Phản xạ giữa lúc đĩa khẩn cấp là xoá cái tệp to nhất, và nếu có tiến trình đang mở nó thì bạn lấy lại được đúng KHÔNG byte trong khi <code>du</code> lúc này lại báo chỗ đó đã đi rồi. Hãy CẮT CỤT thay vì xoá — <code>: &gt; big.log</code> hoặc <code>truncate -s 0 big.log</code> — nó giải phóng khối ngay và để lại cho bên ghi một cái tệp hợp lệ, rỗng. Đây cũng chính xác là lý do tuỳ chọn <code>copytruncate</code> của <code>logrotate</code> tồn tại, và vì sao lựa chọn còn lại đòi phải gửi tín hiệu cho tiến trình mở lại log của nó.</p>
</div>

<h3>Ca hai: còn chỗ trống, và vẫn ENOSPC</h3>
${slide('dv-08', 20, 'Cạn inode: 52 MB trống vẫn No space left on device')}
<p>Một hệ tệp định dạng với ít inode, rồi nhồi đầy tệp nhỏ:</p>

<div class="out">  dung o tep thu 2004: errno 28 No space left on device
  df -h : 7.9M dung, 162M TRONG, 5% day
  df -i : 2016 inode dung, 0 trong, 100% day
  → 169 MB TRONG, va van bao 'No space left on device'.</div>

<p>Cùng errno 28, cùng dòng thông báo, và <code>df -h</code> báo đĩa mới đầy 5%. Mọi tệp đều cần một inode; hết inode là hệ tệp ĐẦY, bất kể còn bao nhiêu khối trống. Trên một máy chủ thật, chuyện này tới từ hộp thư, tệp phiên, mục bộ đệm tí hon — bất cứ thứ gì đẻ ra hàng triệu tệp nhỏ.</p>

<div class="kv-grid">
<div class="kv"><span class="k">df -h báo đầy</span><span class="v">cạn KHỐI — xoá hoặc cắt cụt thứ gì đó lớn</span></div>
<div class="kv"><span class="k">df -i báo đầy</span><span class="v">cạn INODE — xoá <em>NHIỀU</em> tệp; kích thước không liên quan</span></div>
<div class="kv"><span class="k">df đầy, du thì không</span><span class="v">một tệp đã xoá còn bị giữ mở — <code>lsof +L1</code>, rồi cắt cụt qua <code>/proc</code></span></div>
<div class="kv"><span class="k">lệnh đầu tiên</span><span class="v"><code>df -h; df -i; lsof -nP +L1 | head</code> — ba dòng tách bạch được cả ba ca</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một nỗ lực đo cạn inode mà lại đo trúng thứ khác.</strong> Lần chạy đầu của tôi tạo các tệp một-byte trên một hệ tệp ext4 mặc định, kỳ vọng sẽ cạn inode. Nó dừng ở tệp thứ 32.394 với <code>df -i</code> chỉ cho thấy <strong>64%</strong> inode được dùng — nó đã cạn <em>KHỐI</em>, vì ext4 cấp tối thiểu một khối 4 KB cho mỗi tệp. 32.394 tệp một byte ngốn 127 MB, một hệ số khuếch đại khoảng 4.000 lần. Cái phép đo thất bại đó đáng giá hơn cái tôi định nhắm tới: trên một máy chủ thật, "đĩa đầy mà tôi chỉ có vài trăm megabyte dữ liệu thật" thường là chuyện NÀY, không phải inode. Tôi phải định dạng một hệ tệp thứ hai bằng <code>mkfs.ext4 -N 2000</code> mới tạo ra được cạn inode thật.</p>
</div>


<h3>Tự chạy: một cái đĩa bạn ĐƯỢC PHÉP làm đầy</h3>
<p>Đừng bao giờ tập chuyện này trên một đĩa thật. Một hệ tệp nằm trong một tệp, gắn qua thiết bị loop, đầy trong một giây và biến mất bằng một lệnh <code>umount</code>. Trên VPS thí nghiệm (một container đặc quyền, nên được tạo thiết bị loop) ngày 29/09/2026:</p>
<pre><code class="language-bash">sudo truncate -s 64M /dia.img                    # một "đĩa" 64 MB trong một tệp
sudo mkfs.ext4 -q -m 0 /dia.img                  # -m 0: không giữ 5% cho root
sudo mkdir -p /mnt/dia &amp;&amp; sudo mount -o loop /dia.img /mnt/dia
sudo chown deploy /mnt/dia
mkdir /mnt/dia/pg /mnt/dia/cache; head -c 20M /dev/urandom &gt; /mnt/dia/pg/data
dd if=/dev/zero of=/mnt/dia/cache/layer bs=1M count=100 status=none; echo "dd exit=$?"
df -h /mnt/dia | tail -1
head -c 1M /dev/urandom &gt;&gt; /mnt/dia/pg/wal; echo "ghi WAL 1 MB exit=$?"
rm -rf /mnt/dia/cache; df -h /mnt/dia | tail -1</code></pre>
<div class="out">dd exit=1
dd: error writing '/mnt/dia/cache/layer': No space left on device
/dev/loop0       56M   55M  664K  99% /mnt/dia
head: error writing 'standard output': No space left on device
ghi WAL 1 MB exit=1
/dev/loop0       56M   21M   35M  38% /mnt/dia</div>
<p>(Dòng <code>dd exit=1</code> hiện trước dòng lỗi chỉ vì stdout và stderr đi riêng qua SSH.) Một ảnh 64 MB cho 56 MB dùng được sau phần siêu dữ liệu của ext4. "Bộ đệm dựng" đâm vào tường, rồi "cơ sở dữ liệu" không nối thêm nổi 1 MB vào WAL — và <code>rm</code> bộ đệm đưa đĩa về ngay 38%. Rồi hai ca còn lại, trên cùng phòng thí nghiệm:</p>
<pre><code class="language-bash"># xoa-mo.sh — một tiến trình giữ mở một log 30 MB, rồi log bị xoá
python3 -c 'import time; f=open("/mnt/dia/app.log","w"); f.write("x"*30*2**20); f.flush(); time.sleep(40)' &amp;
sleep 1
df -h /mnt/dia | tail -1; rm /mnt/dia/app.log; echo "--- da rm app.log"
df -h /mnt/dia | tail -1; sudo du -sh /mnt/dia
lsof -nP +L1 | grep -E "COMMAND|deleted"
P=$(lsof -nP +L1 | awk '/deleted/ {print $2; exit}')
: &gt; /proc/$P/fd/3; echo "--- da cat cut qua /proc/$P/fd/3"; df -h /mnt/dia | tail -1; kill $P</code></pre>
<div class="out">/dev/loop0       56M   51M  4.1M  93% /mnt/dia
--- da rm app.log
/dev/loop0       56M   51M  4.1M  93% /mnt/dia
21M	/mnt/dia
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 2408 deploy    3w   REG    7,0 31457280     0   13 /mnt/dia/app.log (deleted)
--- da cat cut qua /proc/2408/fd/3
/dev/loop0       56M   21M   35M  38% /mnt/dia</div>
<pre><code class="language-bash">sudo truncate -s 64M /inode.img &amp;&amp; sudo mkfs.ext4 -q -N 1024 /inode.img   # chỉ 1024 inode
sudo mkdir -p /mnt/ino &amp;&amp; sudo mount -o loop /inode.img /mnt/ino &amp;&amp; sudo chown deploy /mnt/ino
i=0; while head -c 100 /dev/zero &gt; /mnt/ino/s$i 2&gt;/tmp/e; do i=$((i+1)); done
df -h /mnt/ino | tail -1; df -i /mnt/ino | tail -1</code></pre>
<div class="out">bash: line 10: /mnt/ino/s1013: No space left on device
/dev/loop1       60M  4.0M   52M   8% /mnt/ino
/dev/loop1       1024  1024     0  100% /mnt/ino</div>
<p>Ba cái đĩa khác nhau, một thông báo lỗi. Vì thế lệnh ĐẦU TIÊN trong mọi sự cố đĩa là lệnh tách được chúng ra: <code>df -h; df -i; lsof -nP +L1 | head</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Lần đo đầu đã hỏng, và cái sai ấy đáng học.</strong> Script tìm tệp đã xoá lúc đầu dùng <code>pgrep -f "app.log"</code> để lấy mã tiến trình — và khớp trúng <em>cái shell đang chạy script</em>, vì dòng lệnh của chính nó cũng chứa "app.log". Lệnh cắt cụt đi vào một mô tả tệp không tồn tại, và <code>kill</code> cuối cùng giết luôn phiên SSH thay vì tiến trình Python. <code>lsof +L1</code> gọi đúng tên tiến trình đang giữ tệp đã xoá; dùng PID của nó, đừng tìm theo chữ trong dòng lệnh.</p></div>

<h3>Log của chính Docker: cái tệp không ai xoay vòng (đo thật)</h3>
<p>Mỗi dòng một container in ra stdout đều được Docker giữ trong <code>/var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log</code>, và với driver mặc định <code>json-file</code> thì <strong>không có gì giới hạn kích thước của nó</strong>. Đo trong Docker Desktop: một container in 400.000 dòng log truy cập ngắn, lần đầu để mặc định, lần sau có trần:</p>
<pre><code class="language-bash">docker run -d --name dv08-log alpine sh -c \\
  'i=0; while [ $i -lt 400000 ]; do echo "GET /api/v1/feed 200 12ms user=$i"; i=$((i+1)); done; sleep 30'
docker run -d --name dv08-log --log-opt max-size=5m --log-opt max-file=2 alpine sh -c '…cùng vòng lặp…'
# đọc kích thước tệp log bên trong máy ảo Docker Desktop (sau ~12 giây):
ID=$(docker inspect -f '{{.Id}}' dv08-log)
docker run --rm --privileged --pid=host alpine nsenter -t 1 -m -- \\
  sh -c "ls -la /var/lib/docker/containers/$ID/ | grep json.log | awk '{print \\$5, \\$9}'"
# kích thước chữ app thật sự in ra, để so:
docker run --rm alpine sh -c '…cùng vòng lặp… | wc -c'</code></pre>
<div class="out">43051196 11b2758d…-json.log
3040250 71d38d84…-json.log
5000008 71d38d84…-json.log.1
15088890</div>
<p>Dòng đầu là lần chạy không trần, hai dòng sau là lần có trần, dòng cuối là số byte trơn của chính phần chữ. 15,1 MB chữ thành <strong>43,1 MB</strong> trên đĩa — mỗi dòng được bọc trong JSON kèm tên luồng và một mốc thời gian tới nano giây, khoảng 2,85 lần bản gốc. Với <code>max-size=5m</code> và <code>max-file=2</code>, đúng output ấy nằm yên ở 8 MB: một tệp đầy 5.000.008 byte cộng tệp đang ghi. Một backend lắm lời ở mức debug trên một VPS nhỏ có thể lấp đầy vài gigabyte kiểu này trong vài ngày, trên cùng cái đĩa với cơ sở dữ liệu.</p>
<table><thead><tr><th>Ở đâu</th><th>Viết gì</th><th>Áp cho</th></tr></thead><tbody>
<tr><td><code>compose.yaml</code>, từng service</td><td><code>logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }</code></td><td>service đó, ở lần <code>up</code> kế tiếp</td></tr>
<tr><td><code>/etc/docker/daemon.json</code></td><td><code>{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }</code></td><td>các container <em>tạo mới</em> sau khi <code>dockerd</code> khởi động lại — container cũ giữ cấu hình cũ</td></tr>
<tr><td><code>/etc/systemd/journald.conf</code></td><td><code>SystemMaxUse=500M</code></td><td>journal của hệ thống (rồi <code>systemctl restart systemd-journald</code>)</td></tr>
</tbody></table>
<p><code>docker logs</code> đọc chính các tệp này, nên đặt trần cho chúng cũng là đặt trần cho việc <code>docker logs</code> lùi được bao xa. Thứ cần giữ lâu thì giữ ở chỗ khác (Chương 9).</p>
<h3>Cái đĩa kéo cơ sở dữ liệu chết theo</h3>
${slide('dv-08', 22, 'Cache build, ảnh cũ, log, bản phát hành — cùng đĩa với CSDL')}
<p>Ghi chú của kho này lưu lại phiên bản đáng kể của chuyện này: bộ đệm dựng Docker phình lên <strong>7,6 GB trên CÙNG cái đĩa chứa PostgreSQL</strong>, và một lần deploy chết giữa chừng với <em>no space left on device</em> — đĩa đã tụt xuống còn 1,8 GB trống trong lúc <code>next build</code> đang chạy. Cách chữa là CẤU TRÚC, không phải một cú dọn: việc dựng chuyển hẳn ra khỏi VPS để bộ đệm dựng không bao giờ rơi xuống đó, và một cron hằng tuần đòi lại đĩa như một lưới đỡ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">cái gì làm đầy một VPS</span><span class="lz-t">bộ đệm dựng, ảnh, log, bản cũ</span><span class="lz-d">cả bốn đều chỉ tăng, trừ khi có thứ gì đó gỡ chúng đi</span></div>
<div class="lz-step"><span class="lz-k">nó giết cái gì</span><span class="lz-t">thứ nào ghi tiếp theo</span><span class="lz-d">thường là cơ sở dữ liệu, vì nó ghi liên tục</span></div>
<div class="lz-step"><span class="lz-k">cách chữa thật</span><span class="lz-t">đừng đặt thứ tăng trưởng lên đĩa dữ liệu</span><span class="lz-d">dựng ở chỗ khác; chặn trần log; giới hạn số bản giữ (6.1)</span></div>
</div>

<pre><code class="language-bash"><span class="tok-comment"># bon cho gan nhu chac chan la thu pham, theo thu tu hay gap:</span>
docker system df                      <span class="tok-comment"># bo dem dung + anh mo coi</span>
du -sh /var/log/* | sort -h | tail    <span class="tok-comment"># log khong gioi han</span>
du -sh /srv/*/ban/* | sort -h | tail  <span class="tok-comment"># ban phat hanh cu (6.1)</span>
journalctl --disk-usage               <span class="tok-comment"># journal khong dat SystemMaxUse</span></code></pre>

<div class="callout ok">
<p><strong>Báo động theo XU HƯỚNG, không theo ngưỡng.</strong> "Đĩa đầy 90%" nổ khi bạn còn vài giờ, vào bất cứ giờ nào chuyện đó xảy ra. "Đĩa sẽ đầy sau ba ngày với tốc độ hiện tại" nổ khi vẫn đang giờ hành chính và cách chữa thì thong thả. Cái thứ hai là một dòng số học trên hai lần lấy mẫu <code>df</code>, và nó là thứ hữu dụng nhất trong Chương 9.</p>
</div>


<h3>Thứ đang lớn dần trên đĩa của bạn ngay lúc này</h3>
<p>Để hình dung cỡ, chính chiếc Mac dùng để viết khoá này, đọc ngày 29/09/2026 — một cái máy chưa từng được dọn có chủ đích lần nào:</p>
<pre><code class="language-bash">docker system df</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          27        19        13.47GB   2.238GB (16%)
Containers      37        11        975.9MB   553.7MB (56%)
Local Volumes   83        25        13.38GB   8.347GB (62%)
Build Cache     117       15        5.685GB   2.337GB</div>
<p>5,7 GB bộ đệm dựng trên một chiếc laptop thì vô hại; đúng con số ấy trên một VPS 6 GB RAM mà đĩa của nó còn chứa PostgreSQL chính là sự cố kho mã này đã ghi lại. Khi dọn, hãy dọn theo TUỔI, đừng bao giờ dọn "tất cả":</p>
<pre><code class="language-bash">docker builder prune -f --filter until=168h     # cache dựng cũ hơn 7 ngày
docker image prune -f --filter until=168h       # ảnh lơ lửng cũ hơn 7 ngày
journalctl --disk-usage &amp;&amp; sudo journalctl --vacuum-size=200M</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Thứ bạn KHÔNG BAO GIỜ được xoá khi đĩa đầy.</strong> Ở 100% đĩa, phản xạ là xoá những thứ to nhất nhìn thấy. Trên máy chủ cơ sở dữ liệu, những thứ to nhất lại thường chính là thứ không được đụng: thư mục <code>pg_wal</code> của PostgreSQL (xoá tay tệp WAL là làm hỏng cơ sở dữ liệu — chúng không phải "log" theo nghĩa log ứng dụng), và các volume Docker (<code>docker volume prune</code> hay bất kỳ lệnh prune nào có <code>--volumes</code> có thể gỡ đúng cái volume LÀ cơ sở dữ liệu của bạn — chẳng hạn lúc cả cụm đang tắt và không container nào dùng nó). Xoá theo danh sách ở trên — bộ đệm dựng, ảnh cũ, log container, journal, bản phát hành cũ — và để yên các thư mục dữ liệu.</p></div>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Docker Desktop giữ ảnh, container, volume và bộ đệm dựng trong MỘT đĩa ảo</strong>, có trần kích thước riêng trong Settings → Resources. Khi nó đầy, một lần dựng hỏng với đúng <code>no space left on device</code> trong khi Finder vẫn báo Mac còn nhiều chỗ. <code>docker system df</code> báo mức dùng bên trong đĩa ảo đó, đó mới là con số đáng nhìn.</li>
<li><strong>WSL 2 lưu hệ tệp Linux của nó trong một tệp đĩa ảo</strong> trên ổ Windows; <code>df -h /</code> bên trong WSL cho thấy đĩa ảo, không phải ổ C:.</li>
<li><strong><code>du</code> trên macOS</strong> (bản BSD) không có <code>--max-depth</code>; dùng <code>du -d 1 -h</code>. Trên VPS, <code>du -xh --max-depth=1 /</code> của GNU chạy được và <code>-x</code> giữ nó trong một hệ tệp.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một tuần sau buổi demo, VPS của nhóm bắt đầu trả 500. Log backend báo <code>ENOSPC</code>, PostgreSQL từ chối ghi, và ai đó đã xoá "cái log to" mà đĩa không trống ra chút nào. Diễn tập cả ba ca trên một cái đĩa bạn được phép làm hỏng.</p>
<ol>
<li>Trên VPS thí nghiệm, dựng ảnh ext4 64 MB, gắn vào, lấp đầy bằng một "cache", rồi xác nhận lệnh nối 1 MB vào <code>pg/wal</code> hỏng. Cứu bằng <code>rm</code> rồi đọc lại <code>df -h</code>.</li>
<li>Chạy <code>xoa-mo.sh</code>: quan sát <code>df</code> và <code>du</code> bất đồng, tìm tệp bằng <code>lsof -nP +L1</code>, và giải phóng chỗ qua <code>/proc/&lt;pid&gt;/fd</code> mà không giết gì.</li>
<li>Định dạng ảnh thứ hai với <code>-N 1024</code>, tạo tệp nhỏ tới khi hỏng, rồi đọc <code>df -h</code> và <code>df -i</code> cạnh nhau.</li>
<li>Trên máy của bạn, chạy container 400.000 dòng một lần không trần và một lần có <code>--log-opt max-size=5m --log-opt max-file=2</code>; so kích thước tệp log (trên Docker Desktop thì đọc qua một container đặc quyền).</li>
</ol>
<p><strong>Đạt khi:</strong> có một lệnh chẩn đoán cho mỗi ca (<code>df -h</code>, <code>lsof +L1</code>, <code>df -i</code>), lấy lại được chỗ của tệp đã-xoá-còn-mở trong khi tiến trình vẫn sống, thí nghiệm log cho thấy tệp không trần lớn gấp mấy lần chữ đã in, và đã gỡ cả hai ảnh cùng các container.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ENOSPC (hết chỗ, errno 28)</span><span class="v">"No space left on device" — trả về khi thiếu khối <em>và</em> khi thiếu inode.</span></div>
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Bản ghi mà tệp nào cũng cần; hệ tệp có thể cạn inode trong khi khối vẫn thừa.</span></div>
  <div class="kv"><span class="k">Loop device (thiết bị vòng)</span><span class="v">Một tệp được trình ra như một đĩa, để tạo và làm đầy hệ tệp một cách an toàn.</span></div>
  <div class="kv"><span class="k">Reserved blocks (khối dự trữ)</span><span class="v">5% mặc định ext4 giữ cho root, để quản trị viên vẫn đăng nhập được vào đĩa đầy.</span></div>
  <div class="kv"><span class="k">Deleted but open (xoá mà còn mở)</span><span class="v">Tệp không còn tên nhưng chỗ vẫn bị mô tả tệp của một tiến trình giữ (<code>NLINK 0</code>).</span></div>
  <div class="kv"><span class="k">json-file driver (driver log tệp JSON)</span><span class="v">Nơi lưu log mặc định của Docker; không giới hạn nếu không đặt <code>max-size</code>/<code>max-file</code>.</span></div>
  <div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Đặt trần và luân phiên tệp log để chúng không lớn mãi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đĩa đầy không giết tiến trình — nó làm các lệnh ghi hỏng, và cơ sở dữ liệu là thứ ghi liên tục.</li>
<li>Xoá vẫn chạy trên đĩa đầy và chỗ trống dùng được ngay; câu hỏi chỉ là xoá CÁI GÌ.</li>
<li><code>df</code> đầy mà <code>du</code> không nghĩa là một tệp đã xoá vẫn đang được mở: <code>lsof +L1</code>, rồi cắt cụt qua <code>/proc/&lt;pid&gt;/fd</code>.</li>
<li>Còn khối trống mà vẫn ENOSPC nghĩa là cạn inode: <code>df -i</code>, rồi xoá NHIỀU tệp nhỏ.</li>
<li>Log json-file của Docker mặc định không giới hạn — đo được 15 MB chữ thành 43 MB — nên đặt <code>max-size</code>/<code>max-file</code>.</li>
<li>Cách chữa tận gốc là giữ những thứ lớn dần ra khỏi đĩa của cơ sở dữ liệu: không dựng trên VPS, log có trần, giới hạn số bản phát hành, dọn theo tuổi.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ENOSPC</span><span class="lc-sub">man 3 errno — errno 28, và hai anh em hàng xóm EDQUOT (hạn ngạch) với EFBIG (tệp quá lớn), thứ tạo ra triệu chứng giống nhau từ nguyên nhân khác nhau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — tuỳ chọn +L</span><span class="lc-sub">man 8 lsof — <code>+L1</code> lọc ra các tệp có số liên kết dưới 1, đúng cái ca đã-xoá-mà-còn-mở đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tune2fs(8) và mkfs.ext4(8)</span><span class="lc-sub">man 8 tune2fs — <code>-m</code> cho phần trăm dự trữ, và <code>mkfs.ext4 -N</code> / <code>-i</code> cho số inode, cái cờ dùng để tái hiện cạn inode.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8) — copytruncate</span><span class="lc-sub">man 8 logrotate — hai chiến lược xoay vòng một tệp log mà tiến trình đang mở, và cái cửa sổ nhỏ mất dòng mà <code>copytruncate</code> chấp nhận.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 10: đĩa, gói phần mềm &amp; log</span><span class="lc-sub">/courses/linux-bash/learn${REF} — <code>df</code>, <code>du</code>, <code>journalctl</code> và <code>logrotate</code> từ gốc, kể cả bài diễn tập đĩa đầy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — ảnh, lớp, và system prune thật ra gỡ cái gì</span><span class="lc-sub">/courses/docker/learn${REF} — bộ đệm dựng nằm ở đâu, và vì sao <code>docker system df</code> với <code>du</code> báo hai con số khác nhau cho nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Building on a machine that also serves traffic|||8.5 — Dựng bản trên cái máy ĐANG phục vụ khách',
      slug: 'deploy-8-5-dung-tren-may-nho',
      type: 'VIDEO',
      description: 'Song song nhanh hơn 3,6 lần và đỉnh bộ nhớ gấp đôi. Hạ trần xuống mức của một VPS thật rồi đo lại: tuần tự chạy xong, song song chết với mã 137. Chính là sự cố mà kho này ghi lại, tái hiện có chủ đích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Building on a machine that also serves traffic</h2>
<p class="lead">Everything in this chapter so far has been about surviving pressure. This lesson is about the most common way people create it on purpose: running the build on the same box that is serving the site.</p>

<h3>Parallel is faster, and that is the problem</h3>
<p>Two build processes, each peaking around 170 MB RSS, in a 300 MB cgroup. First sequentially, then together:</p>

<div class="out">=== TUAN TU: backend roi frontend ===
  [backend] xong, dinh rss=173 MB
  [frontend] xong, dinh rss=173 MB
  tong 779 ms | dinh cgroup: 138 MB

=== SONG SONG: hai ban dung cung luc ===
  backend  ma thoat 0    dinh rss=172 MB
  frontend ma thoat 0    dinh rss=172 MB
  tong 216 ms | dinh cgroup: 270 MB / 300 MB</div>

<p>Parallel finished 3.6× faster and the group&#39;s peak went from 138 MB to 270 MB — almost exactly double, because the two peaks now overlap instead of following one another. Both succeeded, because 270 fits under 300.</p>

<h3>Now the machine people actually rent</h3>
<p>Same two builds, ceiling lowered to 200 MB, and swap turned off for the group — which is how a plain VPS with no swap file behaves:</p>

<div class="out">gioi han: 200 MB RAM, KHONG swap
=== TUAN TU ===
  backend 0 / frontend 0 | 283 ms | dinh 138 MB
=== SONG SONG ===
  backend 0 / frontend 137 | 632 ms | dinh 200 MB

  [22965.065665] Memory cgroup out of memory: Killed process 13839 (node)
                 total-vm:1141320kB, anon-rss:133236kB ... oom_score_adj:0</div>

<div class="callout warn">
<p><strong>Sequential: both succeed, peak 138 MB, 283 ms. Parallel: the frontend build dies with 137, and the whole thing takes 632 ms — more than twice as long as the sequential run it was supposed to beat.</strong> That last part is the detail worth sitting with. Parallelism did not trade memory for speed here; it lost on both, because a killed build is wasted work and the wall-clock includes the time spent doing it.</p>
</div>

<p>This is the incident this repository documents, reproduced deliberately. Its notes are unambiguous about the conclusion it reached the expensive way: builds are sequential in the deploy script as <em>an OOM guard for the 6 GB VPS</em>, because parallel cold builds killed <code>next build</code> with exit 137. And the note adds the part people forget — with a warm cache both builds are near-instant no-ops anyway, so sequencing them costs almost nothing on the runs where speed would have mattered.</p>


<h3>The same measurement with two real <code>next build</code> runs</h3>
${slide('dv-08', 23, 'Hai next build thật song song trong 800 MB: cả hai 137')}
<p>The numbers above come from a program that only allocates memory. To be sure the conclusion survives contact with a real toolchain, the incident was reproduced on 29/09/2026 with the real thing: two minimal Next.js 15 apps, <code>a</code> and <code>b</code> (one page rendering two hundred paragraphs; <code>npm i next@15 react@19 react-dom@19</code>, 331.5 MB of <code>node_modules</code> each), kept in a Docker volume and built by <code>npx next build</code> inside a <code>node:22-alpine</code> container — first with a generous 3 GB ceiling, then with 800 MB and no swap:</p>
<pre><code class="language-bash">#!/bin/sh
# hai-ban.sh — dựng HAI app Next (a, b) tuần tự rồi song song, trong cùng một cgroup
ms() { node -e 'console.log(Date.now())'; }
dung() { cd /app/$1 &amp;&amp; rm -rf .next &amp;&amp; npx next build &gt; /tmp/$1.log 2&gt;&amp;1; echo "$1 exit=$?"; }
echo "gioi han: $(( $(cat /sys/fs/cgroup/memory.max)/1048576 )) MB, swap: $(cat /sys/fs/cgroup/memory.swap.max)"
echo "=== TUAN TU ==="; S=$(ms); dung a; dung b; E=$(ms)
echo "  $((E-S)) ms | dinh $(( $(cat /sys/fs/cgroup/memory.peak)/1048576 )) MB | oom_kill $(grep oom_kill /sys/fs/cgroup/memory.events | head -1 | cut -d' ' -f2)"
echo "=== SONG SONG ==="; S=$(ms); dung a &amp; dung b &amp; wait; E=$(ms)
echo "  $((E-S)) ms | dinh $(( $(cat /sys/fs/cgroup/memory.peak)/1048576 )) MB | oom_kill $(grep oom_kill /sys/fs/cgroup/memory.events | head -1 | cut -d' ' -f2)"
for x in a b; do grep -iE "killed|error|SIGKILL|heap" /tmp/$x.log | head -3 | sed "s/^/  [$x] /"; done</code></pre>
<pre><code class="language-bash">docker run --rm --memory 3g   --memory-swap 3g   -e NEXT_TELEMETRY_DISABLED=1 \\
  -v dv08-next:/app -v "$PWD"/hai-ban.sh:/hai-ban.sh:ro node:22-alpine sh /hai-ban.sh
docker run --rm --memory 800m --memory-swap 800m -e NEXT_TELEMETRY_DISABLED=1 \\
  -v dv08-next:/app -v "$PWD"/hai-ban.sh:/hai-ban.sh:ro node:22-alpine sh /hai-ban.sh</code></pre>
<div class="out">gioi han: 3072 MB, swap: 0
=== TUAN TU ===
a exit=0
b exit=0
  39373 ms | dinh 668 MB | oom_kill 0
=== SONG SONG ===
a exit=0
b exit=0
  23440 ms | dinh 1139 MB | oom_kill 0

gioi han: 800 MB, swap: 0
=== TUAN TU ===
a exit=0
b exit=0
  38342 ms | dinh 541 MB | oom_kill 0
=== SONG SONG ===
b exit=137
a exit=137
  16300 ms | dinh 800 MB | oom_kill 2
  [a] Killed
  [b] Killed</div>
<div class="out">[459647.872789] Memory cgroup out of memory: Killed process 17039 (node) total-vm:21740568kB, anon-rss:108228kB, file-rss:90560kB, shmem-rss:0kB, UID:0 pgtables:3532kB oom_score_adj:0
[459647.884579] Memory cgroup out of memory: Killed process 17040 (node) total-vm:21734072kB, anon-rss:101192kB, file-rss:90696kB, shmem-rss:0kB, UID:0 pgtables:3228kB oom_score_adj:0</div>

<p>With room to spare, parallel saves 16 seconds out of 39 but the group's peak goes from 668 MB to 1,139 MB — the two peaks stack. Under 800 MB, sequential still succeeds (peak 541 MB: with less room, the kernel reclaimed more page cache along the way), while the parallel run lasts 16.3 seconds and ends with <em>both</em> builds killed, twelve milliseconds apart, <code>oom_kill 2</code>. The kernel log shows why the victims look small — about 100 MB of anonymous memory each: <code>next build</code> spreads its work over several <code>node</code> processes, and, judging by their size, the kernel killed one worker process in each build rather than a whole build. The build scripts then report <code>Killed</code> and exit 137. This is the 06/07 incident, reproduced on purpose: a VPS with 6 GB that builds backend and frontend at the same time with a cold cache.</p>

${slide('dv-08', 24, 'Tuần tự và song song: thời gian, đỉnh bộ nhớ, kết cục')}
<h3>The four options, in order of preference</h3>
${slide('dv-08', 25, 'Dời bản dựng khỏi VPS: máy nhà dựng, GHCR, VPS chỉ kéo về')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1. build somewhere else entirely</span><span class="lz-lnote">the artifact arrives finished (Chapter 1). Nothing on the server allocates, nothing competes, and the build cache never lands on the data disk (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">2. build on the server, sequentially</span><span class="lz-lnote">halves the peak. Measured above: 138 MB against 270 MB</span></div>
<div class="lz-layer"><span class="lz-lname">3. build on the server with a raised oom_score_adj</span><span class="lz-lnote">if it must compete, at least it loses (8.2). One line, no privileges</span></div>
<div class="lz-layer"><span class="lz-lname">4. build on the server in parallel</span><span class="lz-lnote">measured to be both slower and fatal on a small box</span></div>
</div>

<p>This repository moved from 2 to 1 and recorded the numbers: builds on the VPS took about fifteen minutes and were forced to run sequentially precisely because parallel builds were OOM-killed; the same two images built in parallel on a bigger machine take three to six minutes. Roughly 3× faster — and the reason the note gives as more important is the second one: <strong>the VPS no longer holds a build cache at all.</strong></p>

<h3>Capping the build instead of hoping</h3>
${slide('dv-08', 26, 'Node 18 định heap theo cả máy; Node 20/22 lấy nửa trần cgroup')}
<p>If a build must run on the small machine, bound it explicitly rather than letting it find the ceiling by hitting it:</p>

<pre><code class="language-bash"><span class="tok-comment"># Node: dat tran vung nho cu the, va no NEM loi thay vi bi giet</span>
NODE_OPTIONS=--max-old-space-size=384 npm run build

<span class="tok-comment"># cgroup/systemd: bop truoc khi giet</span>
systemd-run --scope -p MemoryHigh=400M -p MemoryMax=512M npm run build

<span class="tok-comment"># Docker: hai co, va nho bay o 8.3 — dat bang nhau la TAT swap</span>
docker build --memory=512m --memory-swap=1g .</code></pre>

<div class="callout ok">
<p><strong>Why <code>--max-old-space-size</code> is worth setting even when it does not prevent anything.</strong> A V8 heap limit produces <code>FATAL ERROR: JavaScript heap out of memory</code> with a stack trace, and exit code 134. The OOM killer produces exit 137 and nothing at all (8.1). The first tells you which build step was allocating; the second tells you only that something died. Setting the heap ceiling <em>below</em> the cgroup limit converts an unexplainable kill into a readable error, and that alone is worth the line.</p>
</div>

<div class="pitfall">
<p><strong>Trap — Node up to version 18 does not know it is in a container.</strong> Without an explicit limit, V8 sizes its default heap from the <em>host&#39;s</em> total RAM, read from <code>/proc/meminfo</code> — which inside a container still reports the whole machine. On a 16 GB host with a 512 MB container limit, Node will happily plan for a multi-gigabyte heap and get killed long before it ever considers a garbage collection. This is the single most common cause of "it works on my machine, it exits 137 in the container", and <code>--max-old-space-size</code> is the fix. <em>Corrected on 29/09/2026 after measuring:</em> this is true of Node 18 and older, not of current Node. In a container limited to 512 MB, <code>v8.getHeapStatistics().heap_size_limit</code> was 2,096 MB on Node 18.20.8 — sized from the whole 8 GB machine — but 259 MB on Node 20.20.2 and 22.23.2, about half the container ceiling (1,048 MB under a 2 GB limit). On Node 20+ the trap is smaller but not gone: the heap is only part of the process — Buffers, native code and the worker processes of <code>next build</code> live outside it — and "half the limit" is a default you did not choose. An explicit <code>--max-old-space-size</code> is still how you know what you get.</p>
</div>


<h3>Measured: how much heap Node plans for inside a container</h3>
<pre><code class="language-bash">for v in 18 20 22; do
  docker run --rm --memory 512m node:$v-alpine node -e \\
    'console.log("node",process.version,"heap_size_limit =",Math.round(require("v8").getHeapStatistics().heap_size_limit/2**20),"MB")'
done</code></pre>
<div class="out">node v18.20.8 heap_size_limit = 2096 MB
node v20.20.2 heap_size_limit = 259 MB
node v22.23.2 heap_size_limit = 259 MB</div>

<p>Same 512 MB container, three Node versions, one of them still sizing its heap from the 8 GB machine it cannot use. The project in this course runs Node 22, where an unset heap limit becomes roughly half of <code>mem_limit</code> — 384 MB for a 768 MB service. And when a <code>docker build</code> itself is capped (<code>docker build --memory=256m --memory-swap=256m</code>, measured with a <code>RUN</code> step that allocates 600 MB), BuildKit does not print 137 at all:</p>
<div class="out">#5 0.234 268435456
#5 ERROR: process "/bin/sh -c echo $N; cat /sys/fs/cgroup/memory.max; node -e …" did not complete successfully: cannot allocate memory</div>
<p>The first line is the build step reading its own <code>memory.max</code> (256 MiB). "cannot allocate memory" in a build log is the same kill in a third set of clothes.</p>
<h3>What else is running while you build</h3>
${slide('dv-08', 28, 'docker stats đo từng container; mem_limit trong compose')}
<p>The build is not the only thing competing. On a small VPS the resident set at rest is usually: the database (largest, by design), the application, nginx, and the log shipper. A build lands on top of all of it, and 8.2 established who loses.</p>

<pre><code class="language-bash"><span class="tok-comment"># truoc khi dung, xem con bao nhieu cho thuc su:</span>
free -m                      <span class="tok-comment"># cot 'available', KHONG phai 'free'</span>
ps -eo rss,comm --sort=-rss | head -8
cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes   <span class="tok-comment"># dinh da tung cham</span>
cat /sys/fs/cgroup/memory.peak                        <span class="tok-comment"># cgroup v2 (Ubuntu 22.04+): dinh da tung cham</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">the number that matters</span><span class="v"><code>available</code> in <code>free -m</code> — it counts reclaimable cache, which <code>free</code> does not</span></div>
<div class="kv"><span class="k">the number to record</span><span class="v"><code>memory.max_usage_in_bytes</code> (cgroup v1) or <code>memory.peak</code> (cgroup v2) after a deploy — the peak you actually reached, not the average</span></div>
<div class="kv"><span class="k">the safety margin</span><span class="v">peak + database + app should leave room; if it does not, the build belongs elsewhere</span></div>
<div class="kv"><span class="k">the check after every deploy</span><span class="v"><code>dmesg | grep -ci oom</code> — a number that grew means something was killed and nobody noticed</span></div>
</div>


<h3>Measured at rest: what each service really uses</h3>
<p>A four-service Compose project in the lab, each service with a <code>mem_limit</code>, read with <code>docker stats</code> — idle first, then PostgreSQL after ten seconds of <code>pgbench</code> with ten connections:</p>
<pre><code class="language-bash">F='table {{.Name}}\\t{{.MemUsage}}\\t{{.MemPerc}}\\t{{.CPUPerc}}'
docker stats --no-stream --format "$F" $(docker compose ps -q)
docker exec dv08-postgres-1 sh -c 'pgbench -U postgres -i -s 20 -q postgres &gt;/dev/null 2&gt;&amp;1;
  pgbench -U postgres -c 10 -T 10 -S postgres 2&gt;&amp;1 | grep -E "tps|clients"'
docker stats --no-stream --format 'table {{.Name}}\\t{{.MemUsage}}\\t{{.MemPerc}}' dv08-postgres-1</code></pre>
<div class="out">NAME              MEM USAGE / LIMIT   MEM %     CPU %
dv08-backend-1    102.6MiB / 768MiB   13.36%    0.00%
dv08-nginx-1      18.05MiB / 128MiB   14.11%    0.00%
dv08-postgres-1   69.04MiB / 1.5GiB   4.49%     0.12%
dv08-redis-1      34.33MiB / 256MiB   13.41%    2.06%
number of clients: 10
tps = 33886.603309 (without initial connection time)
NAME              MEM USAGE / LIMIT   MEM %
dv08-postgres-1   213.8MiB / 1.5GiB   13.92%</div>

<p>PostgreSQL grew from 69 MiB idle to 214 MiB after a short read-only load with the default 128 MB <code>shared_buffers</code> — a database's memory is a function of its workload and its configuration, not a constant. nginx's 18 MiB comes from ten worker processes, one per CPU of the Docker VM; on a 2–4 vCPU VPS there are fewer. The <code>LIMIT</code> column shows the ceiling you set; a service without one shows the whole machine there.</p>

<h3>A RAM budget for a 6 GB VPS</h3>
${slide('dv-08', 27, 'Ngân sách RAM cho VPS 6 GB: trần từng dịch vụ và chỗ dư')}
<p>The stack in this course — PostgreSQL, Redis, the Express backend, the Next.js server and nginx on one 6 GB VPS — needs a written budget, because the kernel will otherwise make one for you at the worst moment. A plan, with the lab measurement each line leans on (this is a budget of ceilings, not a measurement of production):</p>
<table><thead><tr><th>Component</th><th>Ceiling (plan)</th><th>What it leans on</th></tr></thead><tbody>
<tr><td>OS, dockerd, containerd, sshd, journald</td><td>~500 MB, no ceiling</td><td>measured in the Docker Desktop VM: dockerd 84–271 MB, containerd 55–72 MB; journald 15 MB on the lab VPS</td></tr>
<tr><td>PostgreSQL 16</td><td><code>mem_limit: 1536m</code>, <code>memswap_limit</code> equal</td><td>69 → 214 MiB under a small load with 128 MB <code>shared_buffers</code>; room to raise it and for connections</td></tr>
<tr><td>Redis 7</td><td><code>256m</code> with <code>--maxmemory 200mb</code></td><td>34 MiB idle; <code>maxmemory</code> keeps Redis evicting keys below the container ceiling instead of being killed at it</td></tr>
<tr><td>Backend (Node 22)</td><td><code>768m</code></td><td>103 MiB idle; heap defaults to about half the ceiling on Node 22</td></tr>
<tr><td>Next.js server</td><td><code>768m</code></td><td>same reasoning as the backend</td></tr>
<tr><td>nginx</td><td><code>128m</code></td><td>18 MiB idle with ten workers</td></tr>
<tr><td><strong>Builds</strong></td><td><strong>0 — not on this machine</strong></td><td>one minimal <code>next build</code> peaked at 541–668 MB; two at once at 1,139 MB</td></tr>
<tr><td>Headroom</td><td>~2 GB</td><td>page cache (PostgreSQL reads through it), and a second copy of the backend while a blue-green swap runs (Chapter 3)</td></tr>
</tbody></table>
<p>The ceilings add up to about 4 GB, leaving roughly 2 GB that is not waste: the page cache makes the database fast, and during a swap two versions of a service run side by side. A budget that forgot the second copy is a budget that OOMs on deploy day — which is exactly when you are watching least.</p>
<h3>The same argument applies to disk</h3>
<p>Chapter 6 measured the disk cost of keeping releases: 29 MB of <code>node_modules</code> per release, about 145 MB for five and 580 MB for twenty. 8.4 measured what happens when that plus a build cache fills the disk the database lives on. The two pressures have the same structural fix, and it is the one Chapter 1 argued for on completely different grounds: <strong>the server should receive finished artifacts, not raw material.</strong> Everything in this chapter is a consequence of ignoring that.</p>


<h3>On macOS and Windows</h3>
<ul>
<li><strong>Your laptop is a bad model of the VPS.</strong> Docker Desktop on the Mac used here had a 10-CPU, 8 GB VM; the same <code>next build</code> that takes 20 seconds there takes much longer on 2 vCPUs, and a build that "fits" in 8 GB says nothing about 6 GB shared with a database. Reproduce the VPS with <code>--memory</code> and <code>--cpus</code> on the container, as in this lesson.</li>
<li><strong>Building for the VPS on an Apple Silicon Mac</strong> produces arm64 images unless you ask for <code>--platform linux/amd64</code>; the home build machine in this project is an x86-64 Fedora box, the same architecture as a typical VPS, so it needs no cross-building.</li>
<li><strong>On Windows</strong>, a build inside WSL 2 is capped by the WSL VM (50% of RAM by default, 8.1); on a 16 GB laptop that is 8 GB for Docker, the editor's language servers and the browser together.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's VPS has 6 GB and runs everything. To "save time", a teammate wants the deploy script to build backend and frontend images in parallel on the VPS. Show, with a reproduction and a budget, why the answer is "build elsewhere" — the conclusion this project reached after 06/07.</p>
<ol>
<li>Create two minimal Next.js apps in a Docker volume (<code>npm i next@15 react@19 react-dom@19</code>, one <code>app/page.js</code>, one <code>app/layout.js</code>). Copy <code>hai-ban.sh</code> from this lesson.</li>
<li>Run it in <code>--memory 3g --memory-swap 3g</code>, then in <code>--memory 800m --memory-swap 800m</code>. Record time, peak and <code>oom_kill</code> for sequential and parallel.</li>
<li>Read the kernel log through a privileged container and find the two <code>Killed process … (node)</code> lines of the parallel run.</li>
<li>Check <code>heap_size_limit</code> for Node 18, 20 and 22 in a 512 MB container.</li>
<li>Write your group's RAM budget table for the real VPS: ceiling per service, the system share, room for a second backend during a swap, and "builds: 0".</li>
</ol>
<p><strong>Done when:</strong> your own numbers show sequential passing and parallel failing under the lower ceiling, you can point at the two kernel lines, and your budget adds up to less than the VPS's RAM with at least one service's worth of headroom. Clean up with <code>docker volume rm dv08-next</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Peak memory</span><span class="v">The highest usage reached (<code>memory.peak</code>); ceilings must be sized for peaks, not averages.</span></div>
  <div class="kv"><span class="k">Sequential vs parallel</span><span class="v">One after another adds times; at the same time adds peaks.</span></div>
  <div class="kv"><span class="k">heap_size_limit</span><span class="v">The V8 heap ceiling; Node 20+ derives it from the cgroup limit, Node 18 from the host.</span></div>
  <div class="kv"><span class="k">--max-old-space-size</span><span class="v">Node flag that sets the heap ceiling explicitly, turning a silent 137 into a readable 134.</span></div>
  <div class="kv"><span class="k">Memory budget</span><span class="v">A written table of ceilings per service that must sum to less than the machine.</span></div>
  <div class="kv"><span class="k">Headroom</span><span class="v">Deliberately unallocated RAM: page cache and a second copy during a swap.</span></div>
  <div class="kv"><span class="k">Build/run separation</span><span class="v">Building on one machine, running the finished artifact on another (Twelve-Factor V).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Running two builds at once adds their peaks: measured 668 MB sequential against 1,139 MB parallel for two real <code>next build</code> runs.</li>
<li>Under an 800 MB ceiling both parallel builds were killed with 137 after 16 seconds, while the sequential run finished — the 06/07 incident on purpose.</li>
<li>The best option is not to build on the server at all: the home machine builds in parallel in minutes, the VPS only pulls and swaps, and it keeps no build cache.</li>
<li>Node 20 and 22 size their heap at about half the container ceiling; Node 18 sizes it from the host — set <code>--max-old-space-size</code> either way.</li>
<li>A 6 GB VPS needs a written RAM budget: ceilings per service, ~500 MB for the system, and headroom for page cache and a second copy during a swap.</li>
<li>Measure with <code>docker stats</code> and <code>memory.peak</code>, not with <code>free</code> inside a container.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — CLI options, --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib — and the note that the default is derived from available system memory, which is the container trap above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd-run(1)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd-run.html — <code>--scope -p MemoryMax=</code> puts an ad-hoc command under a resource limit without writing a unit file.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — build-time resource constraints</span><span class="lc-sub">docs.docker.com/reference/cli/docker/buildx/build/ — memory limits during build, which are separate from the runtime limits on the resulting container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — the separation this whole lesson is a practical argument for: the run stage should not be doing build work.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — multi-stage builds and why the final image is smaller</span><span class="lc-sub">/courses/docker/learn${REF} — how to keep the build toolchain out of the artifact that ships, which is the other half of keeping the server small.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Dựng bản trên cái máy ĐANG phục vụ khách</h2>
<p class="lead">Mọi thứ trong chương này tới giờ là chuyện SỐNG SÓT qua sức ép. Bài này nói về cách phổ biến nhất mà người ta TỰ TẠO RA sức ép ấy: chạy bản dựng ngay trên cái máy đang phục vụ website.</p>

<h3>Song song thì nhanh hơn, và đó chính là vấn đề</h3>
<p>Hai tiến trình dựng, mỗi cái đỉnh khoảng 170 MB RSS, trong một cgroup 300 MB. Trước là tuần tự, rồi cùng lúc:</p>

<div class="out">=== TUAN TU: backend roi frontend ===
  [backend] xong, dinh rss=173 MB
  [frontend] xong, dinh rss=173 MB
  tong 779 ms | dinh cgroup: 138 MB

=== SONG SONG: hai ban dung cung luc ===
  backend  ma thoat 0    dinh rss=172 MB
  frontend ma thoat 0    dinh rss=172 MB
  tong 216 ms | dinh cgroup: 270 MB / 300 MB</div>

<p>Song song xong nhanh hơn 3,6 lần và đỉnh của nhóm đi từ 138 MB lên 270 MB — gần như đúng gấp đôi, vì hai cái đỉnh giờ CHỒNG lên nhau thay vì nối đuôi nhau. Cả hai đều thành công, vì 270 lọt dưới 300.</p>

<h3>Giờ tới cái máy người ta THẬT SỰ đi thuê</h3>
<p>Vẫn hai bản dựng đó, hạ trần xuống 200 MB, và tắt swap cho nhóm — đúng cách một VPS trơn không có tệp swap hành xử:</p>

<div class="out">gioi han: 200 MB RAM, KHONG swap
=== TUAN TU ===
  backend 0 / frontend 0 | 283 ms | dinh 138 MB
=== SONG SONG ===
  backend 0 / frontend 137 | 632 ms | dinh 200 MB

  [22965.065665] Memory cgroup out of memory: Killed process 13839 (node)
                 total-vm:1141320kB, anon-rss:133236kB ... oom_score_adj:0</div>

<div class="callout warn">
<p><strong>Tuần tự: cả hai thành công, đỉnh 138 MB, 283 ms. Song song: bản dựng frontend chết với 137, và cả cuộc mất 632 ms — hơn gấp đôi cái lần chạy tuần tự mà nó lẽ ra phải đánh bại.</strong> Cái vế cuối mới đáng ngồi lại mà ngẫm. Ở đây song song KHÔNG đánh đổi bộ nhớ lấy tốc độ; nó THUA cả hai, vì một bản dựng bị giết là công sức đổ sông và thời gian đồng hồ vẫn tính cả phần đã bỏ ra làm nó.</p>
</div>

<p>Đây chính là sự cố mà kho này ghi lại, tái hiện có chủ đích. Ghi chú của nó nói không úp mở về cái kết luận nó rút ra bằng con đường đắt đỏ: các bản dựng chạy TUẦN TỰ trong script deploy như <em>một lưới chắn OOM cho cái VPS 6 GB</em>, vì các bản dựng nguội chạy song song đã giết <code>next build</code> với mã thoát 137. Và ghi chú thêm cái phần người ta hay quên — với bộ đệm ấm thì cả hai bản dựng gần như là việc-không-làm-gì tức thì, nên xếp chúng nối đuôi nhau gần như chẳng tốn gì ở đúng những lần mà tốc độ mới đáng kể.</p>


<h3>Cùng phép đo đó với hai lần <code>next build</code> THẬT</h3>
${slide('dv-08', 23, 'Hai next build thật song song trong 800 MB: cả hai 137')}
<p>Các con số ở trên đến từ một chương trình chỉ biết xin bộ nhớ. Để chắc kết luận còn đứng vững khi gặp một bộ công cụ thật, sự cố được tái hiện ngày 29/09/2026 bằng chính đồ thật: hai app Next.js 15 tối giản, <code>a</code> và <code>b</code> (một trang in hai trăm đoạn văn; <code>npm i next@15 react@19 react-dom@19</code>, mỗi app 331,5 MB <code>node_modules</code>), để trong một volume Docker và dựng bằng <code>npx next build</code> bên trong một container <code>node:22-alpine</code> — lần đầu với trần rộng rãi 3 GB, rồi với 800 MB không swap:</p>
<pre><code class="language-bash">#!/bin/sh
# hai-ban.sh — dựng HAI app Next (a, b) tuần tự rồi song song, trong cùng một cgroup
ms() { node -e 'console.log(Date.now())'; }
dung() { cd /app/$1 &amp;&amp; rm -rf .next &amp;&amp; npx next build &gt; /tmp/$1.log 2&gt;&amp;1; echo "$1 exit=$?"; }
echo "gioi han: $(( $(cat /sys/fs/cgroup/memory.max)/1048576 )) MB, swap: $(cat /sys/fs/cgroup/memory.swap.max)"
echo "=== TUAN TU ==="; S=$(ms); dung a; dung b; E=$(ms)
echo "  $((E-S)) ms | dinh $(( $(cat /sys/fs/cgroup/memory.peak)/1048576 )) MB | oom_kill $(grep oom_kill /sys/fs/cgroup/memory.events | head -1 | cut -d' ' -f2)"
echo "=== SONG SONG ==="; S=$(ms); dung a &amp; dung b &amp; wait; E=$(ms)
echo "  $((E-S)) ms | dinh $(( $(cat /sys/fs/cgroup/memory.peak)/1048576 )) MB | oom_kill $(grep oom_kill /sys/fs/cgroup/memory.events | head -1 | cut -d' ' -f2)"
for x in a b; do grep -iE "killed|error|SIGKILL|heap" /tmp/$x.log | head -3 | sed "s/^/  [$x] /"; done</code></pre>
<pre><code class="language-bash">docker run --rm --memory 3g   --memory-swap 3g   -e NEXT_TELEMETRY_DISABLED=1 \\
  -v dv08-next:/app -v "$PWD"/hai-ban.sh:/hai-ban.sh:ro node:22-alpine sh /hai-ban.sh
docker run --rm --memory 800m --memory-swap 800m -e NEXT_TELEMETRY_DISABLED=1 \\
  -v dv08-next:/app -v "$PWD"/hai-ban.sh:/hai-ban.sh:ro node:22-alpine sh /hai-ban.sh</code></pre>
<div class="out">gioi han: 3072 MB, swap: 0
=== TUAN TU ===
a exit=0
b exit=0
  39373 ms | dinh 668 MB | oom_kill 0
=== SONG SONG ===
a exit=0
b exit=0
  23440 ms | dinh 1139 MB | oom_kill 0

gioi han: 800 MB, swap: 0
=== TUAN TU ===
a exit=0
b exit=0
  38342 ms | dinh 541 MB | oom_kill 0
=== SONG SONG ===
b exit=137
a exit=137
  16300 ms | dinh 800 MB | oom_kill 2
  [a] Killed
  [b] Killed</div>
<div class="out">[459647.872789] Memory cgroup out of memory: Killed process 17039 (node) total-vm:21740568kB, anon-rss:108228kB, file-rss:90560kB, shmem-rss:0kB, UID:0 pgtables:3532kB oom_score_adj:0
[459647.884579] Memory cgroup out of memory: Killed process 17040 (node) total-vm:21734072kB, anon-rss:101192kB, file-rss:90696kB, shmem-rss:0kB, UID:0 pgtables:3228kB oom_score_adj:0</div>

<p>Khi dư chỗ, song song tiết kiệm 16 trên 39 giây nhưng đỉnh của nhóm đi từ 668 MB lên 1.139 MB — hai cái đỉnh chồng lên nhau. Dưới 800 MB, tuần tự vẫn thành công (đỉnh 541 MB: ít chỗ hơn thì nhân thu hồi bộ đệm trang nhiều hơn trên đường đi), còn lần chạy song song kéo dài 16,3 giây rồi kết thúc với <em>cả hai</em> bản dựng bị giết, cách nhau mười hai mili giây, <code>oom_kill 2</code>. Log của nhân cho thấy vì sao nạn nhân trông nhỏ — mỗi cái chừng 100 MB bộ nhớ vô danh: <code>next build</code> chia việc ra nhiều tiến trình <code>node</code>, và, xét theo kích thước, nhân đã giết một tiến trình worker ở mỗi bản dựng chứ không giết cả bản dựng. Script dựng sau đó báo <code>Killed</code> và thoát 137. Đây chính là sự cố 06/07, tái hiện có chủ đích: một VPS 6 GB dựng backend và frontend cùng lúc với bộ đệm lạnh.</p>

${slide('dv-08', 24, 'Tuần tự và song song: thời gian, đỉnh bộ nhớ, kết cục')}
<h3>Bốn lựa chọn, theo thứ tự nên chọn</h3>
${slide('dv-08', 25, 'Dời bản dựng khỏi VPS: máy nhà dựng, GHCR, VPS chỉ kéo về')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1. dựng HẲN ở chỗ khác</span><span class="lz-lnote">tạo tác tới nơi đã hoàn chỉnh (Chương 1). Không có gì trên máy chủ cấp phát, không có gì tranh giành, và bộ đệm dựng không bao giờ rơi xuống đĩa dữ liệu (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">2. dựng trên máy chủ, TUẦN TỰ</span><span class="lz-lnote">giảm đỉnh đi một nửa. Đo ở trên: 138 MB so với 270 MB</span></div>
<div class="lz-layer"><span class="lz-lname">3. dựng trên máy chủ kèm oom_score_adj nâng lên</span><span class="lz-lnote">nếu buộc phải tranh giành, thì ít nhất cho nó THUA (8.2). Một dòng, không cần đặc quyền</span></div>
<div class="lz-layer"><span class="lz-lname">4. dựng trên máy chủ, SONG SONG</span><span class="lz-lnote">đo được là vừa chậm hơn vừa chết người trên một cái máy nhỏ</span></div>
</div>

<p>Kho này đã chuyển từ 2 sang 1 và ghi lại các con số: dựng trên VPS mất khoảng mười lăm phút và BUỘC phải chạy tuần tự chính vì các bản dựng song song bị OOM giết; cũng hai cái ảnh đó dựng song song trên một máy lớn hơn mất ba tới sáu phút. Nhanh hơn khoảng 3 lần — và cái lý do mà ghi chú ấy nói là QUAN TRỌNG HƠN lại là cái thứ hai: <strong>VPS không còn giữ bộ đệm dựng nào nữa.</strong></p>

<h3>Chặn trần cho bản dựng thay vì hy vọng</h3>
${slide('dv-08', 26, 'Node 18 định heap theo cả máy; Node 20/22 lấy nửa trần cgroup')}
<p>Nếu một bản dựng buộc phải chạy trên cái máy nhỏ, hãy chặn nó một cách tường minh chứ đừng để nó tìm ra cái trần bằng cách đâm vào:</p>

<pre><code class="language-bash"><span class="tok-comment"># Node: dat tran vung nho cu the, va no NEM loi thay vi bi giet</span>
NODE_OPTIONS=--max-old-space-size=384 npm run build

<span class="tok-comment"># cgroup/systemd: bop truoc khi giet</span>
systemd-run --scope -p MemoryHigh=400M -p MemoryMax=512M npm run build

<span class="tok-comment"># Docker: hai co, va nho bay o 8.3 — dat bang nhau la TAT swap</span>
docker build --memory=512m --memory-swap=1g .</code></pre>

<div class="callout ok">
<p><strong>Vì sao <code>--max-old-space-size</code> đáng đặt kể cả khi nó chẳng ngăn được gì.</strong> Một giới hạn heap của V8 đẻ ra <code>FATAL ERROR: JavaScript heap out of memory</code> kèm vết ngăn xếp, và mã thoát 134. OOM killer đẻ ra mã thoát 137 và KHÔNG GÌ CẢ (8.1). Cái thứ nhất nói cho bạn biết bước dựng nào đang cấp phát; cái thứ hai chỉ nói cho bạn biết có thứ gì đó đã chết. Đặt trần heap THẤP HƠN giới hạn cgroup sẽ biến một cú giết không giải thích được thành một lỗi đọc được, và riêng chuyện đó đã đáng cái dòng lệnh.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — Node tới bản 18 KHÔNG biết là nó đang ở trong container.</strong> Không có giới hạn tường minh, V8 tính heap mặc định từ tổng RAM của <em>MÁY CHỦ</em>, đọc từ <code>/proc/meminfo</code> — mà bên trong container thì tệp đó vẫn báo cả cái máy. Trên một máy chủ 16 GB với giới hạn container 512 MB, Node sẽ vui vẻ lên kế hoạch cho một cái heap vài gigabyte và bị giết từ lâu trước khi nó nghĩ tới chuyện dọn rác. Đây là nguyên nhân phổ biến nhất của "trên máy tôi chạy được, trong container thì thoát 137", và <code>--max-old-space-size</code> là cách chữa. <em>Đã sửa ngày 29/09/2026 sau khi đo:</em> điều này đúng với Node 18 trở về trước, không đúng với Node hiện nay. Trong một container giới hạn 512 MB, <code>v8.getHeapStatistics().heap_size_limit</code> là 2.096 MB trên Node 18.20.8 — tính theo cả cái máy 8 GB — nhưng là 259 MB trên Node 20.20.2 và 22.23.2, khoảng một nửa trần container (1.048 MB dưới trần 2 GB). Trên Node 20 trở lên, cái bẫy nhỏ đi nhưng chưa mất: heap chỉ là MỘT PHẦN của tiến trình — Buffer, mã native và các tiến trình worker của <code>next build</code> nằm ngoài nó — và "một nửa trần" là mặc định bạn không hề chọn. Đặt <code>--max-old-space-size</code> tường minh vẫn là cách để biết mình được gì.</p>
</div>


<h3>Đo thật: Node định bao nhiêu heap bên trong container</h3>
<pre><code class="language-bash">for v in 18 20 22; do
  docker run --rm --memory 512m node:$v-alpine node -e \\
    'console.log("node",process.version,"heap_size_limit =",Math.round(require("v8").getHeapStatistics().heap_size_limit/2**20),"MB")'
done</code></pre>
<div class="out">node v18.20.8 heap_size_limit = 2096 MB
node v20.20.2 heap_size_limit = 259 MB
node v22.23.2 heap_size_limit = 259 MB</div>

<p>Cùng container 512 MB, ba phiên bản Node, một trong số đó vẫn định heap theo cái máy 8 GB mà nó không được dùng. Dự án trong khoá này chạy Node 22, nơi heap không đặt trần sẽ thành khoảng một nửa <code>mem_limit</code> — 384 MB cho một dịch vụ 768 MB. Và khi chính <code>docker build</code> bị đặt trần (<code>docker build --memory=256m --memory-swap=256m</code>, đo bằng một bước <code>RUN</code> xin 600 MB), BuildKit không hề in 137:</p>
<div class="out">#5 0.234 268435456
#5 ERROR: process "/bin/sh -c echo $N; cat /sys/fs/cgroup/memory.max; node -e …" did not complete successfully: cannot allocate memory</div>
<p>Dòng đầu là bước dựng tự đọc <code>memory.max</code> của nó (256 MiB). "cannot allocate memory" trong log dựng là đúng cú giết ấy trong bộ quần áo thứ ba.</p>
<h3>Còn thứ gì đang chạy trong lúc bạn dựng</h3>
${slide('dv-08', 28, 'docker stats đo từng container; mem_limit trong compose')}
<p>Bản dựng không phải thứ duy nhất tranh giành. Trên một VPS nhỏ, phần thường trú lúc nghỉ thường là: cơ sở dữ liệu (to nhất, theo thiết kế), ứng dụng, nginx, và bộ gửi log. Một bản dựng đáp xuống trên tất cả những thứ đó, và bài 8.2 đã xác lập ai là người thua.</p>

<pre><code class="language-bash"><span class="tok-comment"># truoc khi dung, xem con bao nhieu cho thuc su:</span>
free -m                      <span class="tok-comment"># cot 'available', KHONG phai 'free'</span>
ps -eo rss,comm --sort=-rss | head -8
cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes   <span class="tok-comment"># dinh da tung cham</span>
cat /sys/fs/cgroup/memory.peak                        <span class="tok-comment"># cgroup v2 (Ubuntu 22.04+): dinh da tung cham</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">con số quan trọng</span><span class="v"><code>available</code> trong <code>free -m</code> — nó tính cả bộ đệm thu hồi được, thứ mà <code>free</code> thì không</span></div>
<div class="kv"><span class="k">con số cần ghi lại</span><span class="v"><code>memory.max_usage_in_bytes</code> (cgroup v1) hoặc <code>memory.peak</code> (cgroup v2) sau một lần deploy — cái ĐỈNH bạn thật sự chạm tới, không phải trung bình</span></div>
<div class="kv"><span class="k">biên an toàn</span><span class="v">đỉnh + cơ sở dữ liệu + ứng dụng phải còn chừa chỗ; nếu không thì chỗ của bản dựng là nơi khác</span></div>
<div class="kv"><span class="k">phép kiểm sau mỗi lần deploy</span><span class="v"><code>dmesg | grep -ci oom</code> — một con số lớn lên nghĩa là có thứ bị giết mà không ai nhận ra</span></div>
</div>


<h3>Đo lúc nghỉ: mỗi dịch vụ thật sự dùng bao nhiêu</h3>
<p>Một dự án Compose bốn dịch vụ trong phòng thí nghiệm, mỗi dịch vụ có <code>mem_limit</code>, đọc bằng <code>docker stats</code> — lúc nghỉ trước, rồi PostgreSQL sau mười giây <code>pgbench</code> với mười kết nối:</p>
<pre><code class="language-bash">F='table {{.Name}}\\t{{.MemUsage}}\\t{{.MemPerc}}\\t{{.CPUPerc}}'
docker stats --no-stream --format "$F" $(docker compose ps -q)
docker exec dv08-postgres-1 sh -c 'pgbench -U postgres -i -s 20 -q postgres &gt;/dev/null 2&gt;&amp;1;
  pgbench -U postgres -c 10 -T 10 -S postgres 2&gt;&amp;1 | grep -E "tps|clients"'
docker stats --no-stream --format 'table {{.Name}}\\t{{.MemUsage}}\\t{{.MemPerc}}' dv08-postgres-1</code></pre>
<div class="out">NAME              MEM USAGE / LIMIT   MEM %     CPU %
dv08-backend-1    102.6MiB / 768MiB   13.36%    0.00%
dv08-nginx-1      18.05MiB / 128MiB   14.11%    0.00%
dv08-postgres-1   69.04MiB / 1.5GiB   4.49%     0.12%
dv08-redis-1      34.33MiB / 256MiB   13.41%    2.06%
number of clients: 10
tps = 33886.603309 (without initial connection time)
NAME              MEM USAGE / LIMIT   MEM %
dv08-postgres-1   213.8MiB / 1.5GiB   13.92%</div>

<p>PostgreSQL lớn từ 69 MiB lúc nghỉ lên 214 MiB sau một đợt tải chỉ-đọc ngắn với <code>shared_buffers</code> mặc định 128 MB — bộ nhớ của một cơ sở dữ liệu là hàm của khối việc và cấu hình, không phải hằng số. 18 MiB của nginx đến từ mười tiến trình worker, mỗi CPU của máy ảo Docker một cái; trên VPS 2–4 vCPU thì ít hơn. Cột <code>LIMIT</code> cho thấy trần bạn đặt; dịch vụ không có trần thì chỗ đó hiện cả cái máy.</p>

<h3>Ngân sách RAM cho một VPS 6 GB</h3>
${slide('dv-08', 27, 'Ngân sách RAM cho VPS 6 GB: trần từng dịch vụ và chỗ dư')}
<p>Bộ máy trong khoá này — PostgreSQL, Redis, backend Express, máy chủ Next.js và nginx trên một VPS 6 GB — cần một bản ngân sách viết ra giấy, vì nếu không thì nhân sẽ lập hộ bạn một bản vào đúng lúc tệ nhất. Một kế hoạch, kèm số đo phòng thí nghiệm mà từng dòng dựa vào (đây là ngân sách TRẦN, không phải số đo production):</p>
<table><thead><tr><th>Thành phần</th><th>Trần (kế hoạch)</th><th>Dựa vào đâu</th></tr></thead><tbody>
<tr><td>Hệ điều hành, dockerd, containerd, sshd, journald</td><td>~500 MB, không trần</td><td>đo trong máy ảo Docker Desktop: dockerd 84–271 MB, containerd 55–72 MB; journald 15 MB trên VPS thí nghiệm</td></tr>
<tr><td>PostgreSQL 16</td><td><code>mem_limit: 1536m</code>, <code>memswap_limit</code> bằng</td><td>69 → 214 MiB dưới tải nhẹ với <code>shared_buffers</code> 128 MB; còn chỗ để nâng nó và cho các kết nối</td></tr>
<tr><td>Redis 7</td><td><code>256m</code> kèm <code>--maxmemory 200mb</code></td><td>34 MiB lúc nghỉ; <code>maxmemory</code> giữ Redis tự đuổi khoá dưới trần container thay vì bị giết khi chạm nó</td></tr>
<tr><td>Backend (Node 22)</td><td><code>768m</code></td><td>103 MiB lúc nghỉ; heap mặc định khoảng một nửa trần trên Node 22</td></tr>
<tr><td>Máy chủ Next.js</td><td><code>768m</code></td><td>lập luận như backend</td></tr>
<tr><td>nginx</td><td><code>128m</code></td><td>18 MiB lúc nghỉ với mười worker</td></tr>
<tr><td><strong>Bản dựng</strong></td><td><strong>0 — không ở máy này</strong></td><td>một <code>next build</code> tối giản đạt đỉnh 541–668 MB; hai cái cùng lúc 1.139 MB</td></tr>
<tr><td>Chỗ dư</td><td>~2 GB</td><td>bộ đệm trang (PostgreSQL đọc qua nó), và bản thứ hai của backend trong lúc tráo xanh-lam (Chương 3)</td></tr>
</tbody></table>
<p>Các trần cộng lại khoảng 4 GB, chừa chừng 2 GB mà không phải lãng phí: bộ đệm trang làm cơ sở dữ liệu nhanh, và trong lúc tráo, hai phiên bản của một dịch vụ chạy cạnh nhau. Một bản ngân sách quên bản thứ hai là bản ngân sách OOM vào ngày deploy — đúng lúc bạn ít để mắt nhất.</p>
<h3>Cùng lập luận đó áp cho đĩa</h3>
<p>Chương 6 đo giá đĩa của việc giữ các bản phát hành: 29 MB <code>node_modules</code> mỗi bản, khoảng 145 MB cho năm bản và 580 MB cho hai mươi. Bài 8.4 đo chuyện gì xảy ra khi ngần ấy cộng với một bộ đệm dựng làm đầy cái đĩa mà cơ sở dữ liệu đang sống trên đó. Hai sức ép đó có CÙNG một cách chữa cấu trúc, và nó đúng là cái mà Chương 1 đã lập luận vì những lý do hoàn toàn khác: <strong>máy chủ nên NHẬN tạo tác đã hoàn chỉnh, không phải nguyên liệu thô.</strong> Mọi thứ trong chương này là hệ quả của việc phớt lờ điều đó.</p>


<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Laptop của bạn là một mô hình TỒI của VPS.</strong> Docker Desktop trên chiếc Mac dùng ở đây có máy ảo 10 CPU, 8 GB; cùng lần <code>next build</code> mất 20 giây ở đó sẽ lâu hơn nhiều trên 2 vCPU, và một bản dựng "vừa" trong 8 GB chẳng nói gì về 6 GB chia với một cơ sở dữ liệu. Tái hiện VPS bằng <code>--memory</code> và <code>--cpus</code> trên container, như trong bài này.</li>
<li><strong>Dựng cho VPS trên một Mac Apple Silicon</strong> sẽ ra ảnh arm64 trừ khi bạn yêu cầu <code>--platform linux/amd64</code>; máy dựng ở nhà trong dự án này là một máy Fedora x86-64, cùng kiến trúc với một VPS điển hình, nên không phải dựng chéo kiến trúc.</li>
<li><strong>Trên Windows</strong>, một bản dựng trong WSL 2 bị trần của máy ảo WSL chặn (mặc định 50% RAM, 8.1); trên laptop 16 GB đó là 8 GB cho Docker, các language server của trình soạn thảo và trình duyệt cộng lại.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của nhóm có 6 GB và chạy mọi thứ. Để "đỡ tốn thời gian", một bạn muốn script deploy dựng ảnh backend và frontend song song trên VPS. Chỉ ra, bằng một lần tái hiện và một bản ngân sách, vì sao câu trả lời là "dựng ở chỗ khác" — đúng kết luận dự án này rút ra sau 06/07.</p>
<ol>
<li>Tạo hai app Next.js tối giản trong một volume Docker (<code>npm i next@15 react@19 react-dom@19</code>, một <code>app/page.js</code>, một <code>app/layout.js</code>). Chép <code>hai-ban.sh</code> của bài này.</li>
<li>Chạy nó trong <code>--memory 3g --memory-swap 3g</code>, rồi trong <code>--memory 800m --memory-swap 800m</code>. Ghi thời gian, đỉnh và <code>oom_kill</code> của tuần tự và song song.</li>
<li>Đọc log nhân qua một container đặc quyền và tìm hai dòng <code>Killed process … (node)</code> của lần chạy song song.</li>
<li>Kiểm <code>heap_size_limit</code> của Node 18, 20 và 22 trong một container 512 MB.</li>
<li>Viết bảng ngân sách RAM cho VPS thật của nhóm: trần từng dịch vụ, phần của hệ thống, chỗ cho backend thứ hai lúc tráo, và "bản dựng: 0".</li>
</ol>
<p><strong>Đạt khi:</strong> số của chính bạn cho thấy tuần tự qua và song song hỏng dưới trần thấp, bạn chỉ ra được hai dòng của nhân, và bản ngân sách cộng lại nhỏ hơn RAM của VPS với ít nhất một dịch vụ làm chỗ dư. Dọn bằng <code>docker volume rm dv08-next</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Peak memory (đỉnh bộ nhớ)</span><span class="v">Mức dùng cao nhất từng chạm (<code>memory.peak</code>); trần phải tính theo đỉnh, không theo trung bình.</span></div>
  <div class="kv"><span class="k">Sequential vs parallel (tuần tự và song song)</span><span class="v">Lần lượt thì cộng thời gian; cùng lúc thì cộng đỉnh.</span></div>
  <div class="kv"><span class="k">heap_size_limit (trần heap)</span><span class="v">Trần heap của V8; Node 20+ suy ra từ giới hạn cgroup, Node 18 từ cả máy.</span></div>
  <div class="kv"><span class="k">--max-old-space-size (cờ trần heap)</span><span class="v">Cờ của Node đặt trần heap tường minh, biến một mã 137 câm thành một mã 134 đọc được.</span></div>
  <div class="kv"><span class="k">Memory budget (ngân sách bộ nhớ)</span><span class="v">Một bảng trần cho từng dịch vụ, cộng lại phải nhỏ hơn cái máy.</span></div>
  <div class="kv"><span class="k">Headroom (chỗ dư)</span><span class="v">RAM cố ý không phân cho ai: bộ đệm trang và bản thứ hai lúc tráo.</span></div>
  <div class="kv"><span class="k">Build/run separation (tách dựng và chạy)</span><span class="v">Dựng ở một máy, chạy tạo tác đã xong ở máy khác (Twelve-Factor V).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chạy hai bản dựng cùng lúc là cộng hai đỉnh: đo được 668 MB khi tuần tự so với 1.139 MB khi song song cho hai lần <code>next build</code> thật.</li>
<li>Dưới trần 800 MB cả hai bản dựng song song bị giết với mã 137 sau 16 giây, trong khi lần tuần tự chạy xong — sự cố 06/07 tái hiện có chủ đích.</li>
<li>Lựa chọn tốt nhất là không dựng trên máy chủ: máy nhà dựng song song trong vài phút, VPS chỉ kéo về và tráo, và không giữ bộ đệm dựng nào.</li>
<li>Node 20 và 22 định heap khoảng một nửa trần container; Node 18 định theo cả máy — dù bản nào cũng nên đặt <code>--max-old-space-size</code>.</li>
<li>VPS 6 GB cần một bản ngân sách RAM viết ra: trần từng dịch vụ, ~500 MB cho hệ thống, và chỗ dư cho bộ đệm trang và bản thứ hai lúc tráo.</li>
<li>Đo bằng <code>docker stats</code> và <code>memory.peak</code>, đừng đo bằng <code>free</code> bên trong container.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — tuỳ chọn CLI, --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib — và ghi chú rằng mặc định được suy ra từ bộ nhớ hệ thống khả dụng, đúng cái bẫy container ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd-run(1)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd-run.html — <code>--scope -p MemoryMax=</code> đặt một lệnh tuỳ hứng dưới một giới hạn tài nguyên mà không cần viết tệp unit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — ràng buộc tài nguyên lúc dựng</span><span class="lc-sub">docs.docker.com/reference/cli/docker/buildx/build/ — giới hạn bộ nhớ TRONG LÚC dựng, tách biệt với giới hạn runtime của cái container tạo ra.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — sự tách bạch mà cả bài này là một lập luận thực hành cho nó: giai đoạn CHẠY không nên đi làm việc của giai đoạn DỰNG.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — dựng nhiều tầng và vì sao ảnh cuối nhỏ hơn</span><span class="lc-sub">/courses/docker/learn${REF} — cách giữ bộ công cụ dựng ở ngoài cái tạo tác được gửi đi, nửa còn lại của việc giữ cho máy chủ nhỏ gọn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Quiz: the small machine|||8.6 — Quiz: cái máy nhỏ',
      slug: 'deploy-8-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống: một mã 137 với OOMKilled=false, một bản dựng thoát 0 trong khi cơ sở dữ liệu chết, --memory-swap là tổng, swapon chỉ cảnh báo tệp 0644, tệp đã xoá còn mở, log Docker không xoay, next build song song và heap của Node trong container.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.6</span>
<h2>Quiz: the small machine</h2>
<p class="lead">Ten situations from a VPS that ran out of something — memory, swap, disk, or patience. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> A 500 MB allocation inside a real 256 MB cgroup was killed at 401 ms with exit <strong>137</strong> (128+9, SIGKILL) and wrote nothing to the application log — the explanation lived only in <code>dmesg</code>, which named the pid, the RSS, the <code>oom_score_adj</code>, and <code>constraint=CONSTRAINT_MEMCG</code> (8.1). Pointed the other way, a build asking for 120 MB on top of a 188 MB database finished with exit <strong>0</strong> while the database was killed, because the kernel picks the biggest rather than the culprit; raising the build&#39;s own <code>oom_score_adj</code> to 1000 reversed it exactly — build killed, database alive (8.2). Adding swap let the same 8.1 workload finish with exit 0, with RSS pinned at 254 MB while swap grew to 189 MB — though my first reading said <code>swap 0</code> because I sampled after the process exited — and reading back memory that had spilled cost 56–66 ms against 0.14–0.28 ms in RAM (8.3). A full disk returned <strong>ENOSPC</strong> for a 1 MB write while a small append still succeeded, and <code>rm</code> recovered 118 MB in 8 ms; then two disks that were full without being full: <code>df</code> 141 MB against <code>du</code> 41 MB from a deleted-but-open file, recovered by truncating through <code>/proc/&lt;pid&gt;/fd</code>, and a filesystem with 162 MB free that refused to create a file because inodes were exhausted (8.4). And two builds run in parallel peaked at 270 MB against 138 MB sequentially; lowering the ceiling to 200 MB with no swap made the parallel run die with 137 <em>and</em> take 632 ms against the sequential run&#39;s 283 (8.5). Re-measured on cgroup v2 on 29/09/2026, every one of these held — and two real <code>next build</code> runs in parallel were both killed under 800 MB while the sequential pair finished.</p>
</div>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell an OOM kill from any other SIGKILL using <code>OOMKilled</code>, <code>docker events</code> or the kernel log.</li>
<li>I can explain why a build that exits 0 can still be the reason the database died.</li>
<li>I can put a memory ceiling on a container, a systemd service and a one-off command.</li>
<li>I can read <code>--memory-swap</code> and <code>memswap_limit</code> correctly and create a swap file safely.</li>
<li>I can separate a full disk, a deleted-but-open file and inode exhaustion with three commands, and cap Docker&#39;s logs.</li>
<li>I can write a RAM budget for a 6 GB VPS and explain why builds are not in it.</li>
</ul>
${slide('dv-08', 30, 'Bảng tra nhanh Chương 8')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.6</span>
<h2>Quiz: cái máy nhỏ</h2>
<p class="lead">Mười tình huống từ một cái VPS vừa cạn một thứ gì đó — bộ nhớ, swap, đĩa, hay sự kiên nhẫn. Mỗi lời giải thích nói vì sao đáp án đúng là đúng và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một cú cấp phát 500 MB trong một cgroup THẬT 256 MB bị giết ở mốc 401 ms với mã thoát <strong>137</strong> (128+9, SIGKILL) và không ghi gì vào log ứng dụng — lời giải thích chỉ sống trong <code>dmesg</code>, nơi gọi tên pid, RSS, <code>oom_score_adj</code>, và <code>constraint=CONSTRAINT_MEMCG</code> (8.1). Chĩa theo hướng ngược lại, một bản dựng xin 120 MB đè lên một cơ sở dữ liệu 188 MB đã chạy xong với mã thoát <strong>0</strong> trong khi cơ sở dữ liệu bị giết, vì nhân chọn cái TO NHẤT chứ không chọn thủ phạm; nâng <code>oom_score_adj</code> của chính bản dựng lên 1000 đảo ngược y hệt — bản dựng chết, cơ sở dữ liệu sống (8.2). Thêm swap thì đúng khối việc của 8.1 chạy xong với mã 0, RSS ghim ở 254 MB trong khi swap lớn lên 189 MB — dù lần đọc ĐẦU của tôi báo <code>swap 0</code> vì tôi lấy mẫu SAU khi tiến trình thoát — và đọc lại phần bộ nhớ đã tràn tốn 56–66 ms so với 0,14–0,28 ms trong RAM (8.3). Một cái đĩa đầy trả <strong>ENOSPC</strong> cho lệnh ghi 1 MB trong khi cú nối thêm nhỏ vẫn chạy được, và <code>rm</code> lấy lại 118 MB trong 8 ms; rồi hai cái đĩa đầy mà không đầy: <code>df</code> 141 MB so với <code>du</code> 41 MB do một tệp đã-xoá-còn-mở, cứu được bằng cách cắt cụt qua <code>/proc/&lt;pid&gt;/fd</code>, và một hệ tệp còn 162 MB trống vẫn từ chối tạo tệp vì cạn inode (8.4). Và hai bản dựng chạy song song đạt đỉnh 270 MB so với 138 MB khi tuần tự; hạ trần xuống 200 MB không swap thì lần chạy song song vừa chết với 137 <em>vừa</em> tốn 632 ms so với 283 ms của lần tuần tự (8.5). Đo lại trên cgroup v2 ngày 29/09/2026, mọi điều trên vẫn đứng vững — và hai lần <code>next build</code> thật chạy song song đều bị giết dưới trần 800 MB trong khi cặp chạy tuần tự vẫn xong.</p>
</div>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phân biệt được một cú OOM với mọi SIGKILL khác bằng <code>OOMKilled</code>, <code>docker events</code> hoặc log của nhân.</li>
<li>Tôi giải thích được vì sao một bản dựng thoát 0 vẫn có thể là lý do cơ sở dữ liệu chết.</li>
<li>Tôi đặt được trần bộ nhớ cho một container, một dịch vụ systemd và một lệnh chạy lẻ.</li>
<li>Tôi đọc đúng <code>--memory-swap</code> và <code>memswap_limit</code>, và tạo được swap file an toàn.</li>
<li>Tôi tách được đĩa đầy, tệp đã xoá còn mở và cạn inode bằng ba lệnh, và đặt trần cho log của Docker.</li>
<li>Tôi viết được bản ngân sách RAM cho VPS 6 GB và giải thích được vì sao bản dựng không có mặt trong đó.</li>
</ul>
${slide('dv-08', 30, 'Bảng tra nhanh Chương 8')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The backend container shows "Exited (137)", its last log line is an ordinary request, and docker inspect reports OOMKilled=false. What is the most likely cause?|||Container backend báo "Exited (137)", dòng log cuối là một request bình thường, và docker inspect báo OOMKilled=false. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The OOM killer — 137 always means out of memory|||OOM killer — mã 137 lúc nào cũng là hết bộ nhớ',
              'A segmentation fault in a native module|||Một lỗi phân đoạn trong module native',
              'Something sent SIGKILL: docker kill, or docker stop after the process ignored SIGTERM for the grace period|||Có thứ gì đó gửi SIGKILL: docker kill, hoặc docker stop sau khi tiến trình lờ SIGTERM suốt thời gian ân hạn',
              'The disk filled up and the kernel stopped the container|||Đĩa đầy và nhân dừng container',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: 137 is 128 + 9, SIGKILL, from any source. Measured in this chapter: docker kill -s KILL gives exit 137 with OOMKilled=false, while a real OOM gives 137 with OOMKilled=true, an oom event and a "Killed process" kernel line. "137 always means OOM" is the tempting shortcut and exactly what OOMKilled=false rules out; a segfault would be 139, and a full disk makes writes fail rather than killing processes.|||VI: 137 là 128 + 9, SIGKILL, từ BẤT KỲ nguồn nào. Đo trong chương: docker kill -s KILL cho mã 137 với OOMKilled=false, còn một cú OOM thật cho 137 với OOMKilled=true, một sự kiện oom và một dòng "Killed process" của nhân. "137 luôn là OOM" là lối tắt hấp dẫn và chính là thứ OOMKilled=false loại trừ; lỗi phân đoạn là 139, còn đĩa đầy làm lệnh ghi hỏng chứ không giết tiến trình.',
          },
          {
            question: 'A teammate runs npm run build directly on the demo VPS. It prints "Compiled successfully" and exits 0; twenty seconds later the site returns 500 and dmesg shows "Killed process … (postgres)". Why was PostgreSQL killed?|||Một bạn chạy thẳng npm run build trên VPS demo. Nó in "Compiled successfully" và thoát 0; hai mươi giây sau web trả 500 và dmesg báo "Killed process … (postgres)". Vì sao PostgreSQL bị giết?',
            options: [
              'The OOM killer picks the process whose death frees the most memory — the database — not the one that caused the shortage|||OOM killer chọn tiến trình mà giết đi thì giải phóng nhiều bộ nhớ nhất — cơ sở dữ liệu — chứ không chọn cái gây ra thiếu hụt',
              'The build had a bug that corrupted PostgreSQL’s memory|||Bản dựng có lỗi làm hỏng bộ nhớ của PostgreSQL',
              'PostgreSQL ran out of max_connections and shut itself down|||PostgreSQL hết max_connections nên tự tắt',
              'Without swap, the kernel always kills databases first by design|||Không có swap thì nhân theo thiết kế luôn giết cơ sở dữ liệu trước',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured on both cgroup versions: a build asking for memory on top of a database exits 0 while the database is killed, because the kernel scores by size. The exit 0 is the trap — the build got its memory by taking it from the biggest process. Nothing in the kernel prefers databases as such; with a different size ratio the build dies instead.|||VI: Đo trên cả hai phiên bản cgroup: một bản dựng xin bộ nhớ đè lên một cơ sở dữ liệu thì thoát 0 trong khi cơ sở dữ liệu bị giết, vì nhân chấm điểm theo kích thước. Mã 0 chính là cái bẫy — bản dựng có được bộ nhớ bằng cách lấy nó từ tiến trình to nhất. Nhân không hề ưu tiên giết cơ sở dữ liệu theo kiểu "vì nó là CSDL"; tỉ lệ kích thước khác đi thì bản dựng chết.',
          },
          {
            question: 'Which single change guarantees that a one-off build on the VPS can never cause the database to be OOM-killed, even if the build wants far too much?|||Thay đổi DUY NHẤT nào đảm bảo một bản dựng chạy lẻ trên VPS không bao giờ khiến cơ sở dữ liệu bị OOM giết, kể cả khi bản dựng đòi quá nhiều?',
            options: [
              'Add 8 GB of swap so the build always fits|||Thêm 8 GB swap để bản dựng lúc nào cũng vừa',
              'Set OOMScoreAdjust=-1000 on the build|||Đặt OOMScoreAdjust=-1000 cho bản dựng',
              'Give the database restart: always|||Cho cơ sở dữ liệu restart: always',
              'Run the build under its own ceiling (systemd-run -p MemoryMax=… or docker --memory) so an OOM stays inside its group|||Chạy bản dựng dưới cái trần riêng của nó (systemd-run -p MemoryMax=… hoặc docker --memory) để OOM ở lại trong nhóm của nó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: With a ceiling, the build hits the limit of its own cgroup and the kernel only considers processes inside that group (CONSTRAINT_MEMCG) — measured case B: build oom-kill, database active. -1000 on the build is the wrong direction: it protects the build and guarantees something else dies. Swap only postpones the problem into thrashing, and restart: always brings the database back after it has already died.|||VI: Có trần, bản dựng chạm giới hạn của chính cgroup nó và nhân chỉ xét các tiến trình trong nhóm đó (CONSTRAINT_MEMCG) — ca B đo được: bản dựng oom-kill, cơ sở dữ liệu active. -1000 cho bản dựng là sai chiều: nó bảo vệ bản dựng và đảm bảo thứ khác phải chết. Swap chỉ hoãn vấn đề thành thrashing, còn restart: always chỉ dựng lại cơ sở dữ liệu sau khi nó đã chết.',
          },
          {
            question: 'In compose.yaml the backend has only mem_limit: 768m. docker inspect shows Memory=805306368 and MemorySwap=1610612736. What does that mean?|||Trong compose.yaml, backend chỉ có mem_limit: 768m. docker inspect báo Memory=805306368 và MemorySwap=1610612736. Điều đó nghĩa là gì?',
            options: [
              'A Compose bug: the swap value should be 0|||Lỗi của Compose: giá trị swap lẽ ra phải là 0',
              'The container may use 768 MB of RAM plus up to 768 MB of swap (1.5 GB total); set memswap_limit: 768m to forbid swap|||Container được dùng 768 MB RAM cộng tới 768 MB swap (tổng 1,5 GB); đặt memswap_limit: 768m để cấm swap',
              'Swap is disabled because MemorySwap is larger than Memory|||Swap bị tắt vì MemorySwap lớn hơn Memory',
              'The RAM limit is actually 1.5 GB|||Trần RAM thật ra là 1,5 GB',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: MemorySwap is the TOTAL of RAM plus swap. Measured in the lab: every service with only mem_limit got exactly twice its limit, while PostgreSQL with memswap_limit equal to mem_limit got none. The tempting reading "the RAM limit is 1.5 GB" is wrong — RAM stays capped at 768 MB (memory.max); the extra is swap, which makes the service slow long before it is killed.|||VI: MemorySwap là TỔNG RAM cộng swap. Đo trong phòng thí nghiệm: mọi dịch vụ chỉ có mem_limit đều được đúng gấp đôi trần, còn PostgreSQL với memswap_limit bằng mem_limit thì không có chút nào. Cách đọc hấp dẫn "trần RAM là 1,5 GB" là sai — RAM vẫn bị chặn ở 768 MB (memory.max); phần dư là swap, thứ làm dịch vụ chậm rất lâu trước khi nó bị giết.',
          },
          {
            question: 'vmstat 1 shows si and so both around 150,000 KB/s, swpd barely changing; every health check is green but pages take four seconds. What is happening?|||vmstat 1 cho si và so cùng quanh 150.000 KB/s, swpd gần như không đổi; mọi health check đều xanh nhưng trang mất bốn giây mới tải. Chuyện gì đang xảy ra?',
            options: [
              'Thrashing: pages are swapped in and out continuously, so everything works but waits on the disk|||Thrashing: trang bị đọc vào đẩy ra liên tục, nên mọi thứ vẫn chạy nhưng phải chờ đĩa',
              'The disk is full and writes are being retried|||Đĩa đầy và các lệnh ghi đang được thử lại',
              'A network problem between nginx and the backend|||Một sự cố mạng giữa nginx và backend',
              'Swap is healthy; only swpd matters|||Swap vẫn khoẻ; chỉ swpd là quan trọng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured during the 400 MB read-back in a 256 MB ceiling: si and so both at 78,000–179,000 KB/s while swpd hardly moved, and each pass took 4.6–7.2 s instead of milliseconds. "Only swpd matters" is the tempting wrong answer: a large, stable swpd with si/so near 0 is healthy; the RATE is what shows thrashing, and PSI measures the time lost.|||VI: Đo trong lúc đọc lại 400 MB dưới trần 256 MB: si và so cùng ở 78.000–179.000 KB/s trong khi swpd gần như đứng yên, và mỗi lượt mất 4,6–7,2 giây thay vì mili giây. "Chỉ swpd là quan trọng" là đáp án sai hấp dẫn: swpd lớn mà đứng yên với si/so gần 0 là lành mạnh; TỐC ĐỘ mới cho thấy thrashing, còn PSI đo thời gian bị mất.',
          },
          {
            question: 'You created /swapfile, forgot chmod 600, ran mkswap and swapon, and the deploy script checked $? and reported success. What actually happened?|||Bạn tạo /swapfile, quên chmod 600, chạy mkswap và swapon, và script deploy kiểm $? rồi báo thành công. Thật ra chuyện gì đã xảy ra?',
            options: [
              'swapon refused the file, so there is no swap and the script is wrong|||swapon từ chối tệp, nên không có swap và script đã sai',
              'Nothing risky: the kernel encrypts swap automatically|||Không có gì rủi ro: nhân tự mã hoá swap',
              'Swap is active with only a warning; the world-readable file can expose process memory, so chmod 600 it|||Swap đang chạy chỉ kèm một dòng cảnh báo; tệp ai cũng đọc được có thể lộ bộ nhớ tiến trình, nên phải chmod 600',
              'mkswap failed, so swapon had nothing to enable|||mkswap hỏng, nên swapon chẳng có gì để bật',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured on Ubuntu 24.04: both mkswap and swapon print "insecure permissions 0644" and carry on; swapon exits 0 and swapon --show lists the file. "swapon refuses it" is the tempting answer — and an earlier version of this very lesson said so; the measurement corrected it. Swap holds whatever was in memory (tokens, secrets), so permissions are the only protection.|||VI: Đo trên Ubuntu 24.04: cả mkswap lẫn swapon đều in "insecure permissions 0644" rồi làm tiếp; swapon thoát 0 và swapon --show liệt kê tệp. "swapon từ chối" là đáp án hấp dẫn — và một bản cũ của chính bài học này đã viết như vậy; phép đo đã sửa lại. Swap giữ mọi thứ từng nằm trong bộ nhớ (token, bí mật), nên quyền truy cập là lớp bảo vệ duy nhất.',
          },
          {
            question: 'df -h shows the disk at 93%, du -sh shows only 21 MB, and deleting app.log freed nothing. How do you get the space back without restarting anything?|||df -h báo đĩa 93%, du -sh chỉ báo 21 MB, và xoá app.log không giải phóng được gì. Làm sao lấy lại chỗ mà không khởi động lại gì?',
            options: [
              'Run fsck, because df and du disagreeing means corruption|||Chạy fsck, vì df và du lệch nhau nghĩa là hệ tệp hỏng',
              'tune2fs -m 0 to release the reserved 5%|||tune2fs -m 0 để nhả 5% dự trữ',
              'Delete more files until df goes down|||Xoá thêm tệp tới khi df giảm',
              'lsof -nP +L1 to find the process holding the deleted file, then truncate it through /proc/<pid>/fd/<n>|||lsof -nP +L1 để tìm tiến trình đang giữ tệp đã xoá, rồi cắt cụt nó qua /proc/<pid>/fd/<n>',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A deleted file that a process still holds open keeps its blocks: measured, df stayed at 93% after rm, lsof +L1 showed python3 with NLINK 0, and ": > /proc/2408/fd/3" brought the disk back to 38% with the process still running. fsck is the tempting wrong answer — nothing is corrupt; df and du simply count different things. Deleting more files only repeats the mistake.|||VI: Một tệp đã xoá mà tiến trình vẫn mở sẽ giữ nguyên các khối của nó: đo được df vẫn 93% sau rm, lsof +L1 cho thấy python3 với NLINK 0, và ": > /proc/2408/fd/3" đưa đĩa về 38% trong khi tiến trình vẫn chạy. fsck là đáp án sai hấp dẫn — không có gì hỏng; df và du chỉ đếm hai thứ khác nhau. Xoá thêm tệp chỉ lặp lại đúng sai lầm.',
          },
          {
            question: 'A backend at debug log level has been running for a week and /var/lib/docker/containers keeps growing. What is the right fix?|||Một backend để log ở mức debug đã chạy một tuần và /var/lib/docker/containers cứ lớn dần. Cách sửa đúng là gì?',
            options: [
              'docker system prune -a --volumes to clear everything|||docker system prune -a --volumes để dọn sạch mọi thứ',
              'Set logging max-size and max-file for the service (or in daemon.json for new containers) and recreate the container|||Đặt max-size và max-file trong logging của service (hoặc trong daemon.json cho container mới) rồi tạo lại container',
              'rm the *-json.log file every night with cron|||rm tệp *-json.log mỗi đêm bằng cron',
              'Move the VPS to a bigger disk|||Chuyển VPS sang một đĩa lớn hơn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The json-file driver has no size limit by default — measured, 15.1 MB of printed text became a 43.1 MB log file, while max-size=5m max-file=2 held the same output at 8 MB. Deleting the file with cron is the tempting shortcut, but dockerd keeps it open: it is the deleted-but-open case, and the space does not come back. prune --volumes can delete the database volume itself.|||VI: Driver json-file mặc định không có trần kích thước — đo được 15,1 MB chữ in ra thành tệp log 43,1 MB, còn max-size=5m max-file=2 giữ đúng output ấy ở 8 MB. Xoá tệp bằng cron là lối tắt hấp dẫn, nhưng dockerd vẫn giữ nó mở: đó chính là ca tệp-đã-xoá-còn-mở, và chỗ trống không quay lại. Còn prune --volumes có thể xoá luôn volume của cơ sở dữ liệu.',
          },
          {
            question: 'Two next build runs started in parallel under an 800 MB ceiling were both killed with 137 after 16 s; the same two built one after the other finished. What is the best long-term fix for a 6 GB production VPS?|||Hai lần next build khởi động song song dưới trần 800 MB đều bị giết với mã 137 sau 16 giây; đúng hai bản đó dựng lần lượt thì xong. Cách sửa lâu dài tốt nhất cho một VPS production 6 GB là gì?',
            options: [
              'Add 8 GB of swap so both builds fit|||Thêm 8 GB swap để cả hai bản dựng đều vừa',
              'Give PostgreSQL oom_score_adj -1000 and keep building in parallel|||Cho PostgreSQL oom_score_adj -1000 rồi cứ dựng song song',
              'Build elsewhere (a home machine or CI), push the image to a registry, and let the VPS only pull and swap|||Dựng ở chỗ khác (máy nhà hoặc CI), đẩy ảnh lên registry, và để VPS chỉ kéo về rồi tráo',
              'Keep parallel builds but set --max-old-space-size lower|||Giữ dựng song song nhưng đặt --max-old-space-size thấp hơn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The project did exactly this after 06/07: first sequential builds on the VPS (about 15 minutes), then builds moved to a 12-core home machine (3–6 minutes in parallel) with the VPS only pulling from GHCR — which also removed the build cache that had filled the disk to 1.8 GB free on 18/08. Swap is the tempting answer, but it trades the kill for thrashing next to a live database and does nothing for the disk.|||VI: Dự án đã làm đúng như vậy sau 06/07: trước hết dựng tuần tự trên VPS (khoảng 15 phút), rồi dời việc dựng về một máy nhà 12 nhân (song song 3–6 phút) và VPS chỉ kéo từ GHCR — việc đó cũng gỡ luôn bộ đệm dựng từng làm đĩa chỉ còn 1,8 GB trống ngày 18/08. Swap là đáp án hấp dẫn, nhưng nó đổi cú giết lấy thrashing ngay cạnh một cơ sở dữ liệu đang chạy và chẳng giúp gì cho đĩa.',
          },
          {
            question: 'A Node 22 service runs in a container with mem_limit: 768m and no NODE_OPTIONS. Roughly what heap ceiling does V8 use, and should you still set one?|||Một dịch vụ Node 22 chạy trong container có mem_limit: 768m và không có NODE_OPTIONS. V8 dùng trần heap khoảng bao nhiêu, và có nên vẫn đặt trần không?',
            options: [
              'About 384 MB — half the cgroup limit — but set --max-old-space-size anyway, because the heap is only part of the process|||Khoảng 384 MB — một nửa trần cgroup — nhưng vẫn nên đặt --max-old-space-size, vì heap chỉ là một phần của tiến trình',
              'About 2 GB, sized from the host machine, so a flag is mandatory|||Khoảng 2 GB, tính theo máy chủ, nên bắt buộc phải có cờ',
              'Exactly 768 MB, so no flag is needed|||Đúng 768 MB, nên không cần cờ',
              'Unlimited until the OOM killer steps in|||Không giới hạn cho tới khi OOM killer ra tay',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured in a 512 MB container: heap_size_limit was 259 MB on Node 20 and 22 (about half), 1,048 MB under 2 GB — but 2,096 MB on Node 18, sized from the whole machine. "About 2 GB from the host" is the tempting answer because it was true, and it is what older advice (including an earlier version of this chapter) says. Even on Node 22, Buffers and native memory live outside the heap, so an explicit limit is how you know what you get.|||VI: Đo trong container 512 MB: heap_size_limit là 259 MB trên Node 20 và 22 (khoảng một nửa), 1.048 MB dưới trần 2 GB — nhưng 2.096 MB trên Node 18, tính theo cả cái máy. "Khoảng 2 GB theo máy chủ" là đáp án hấp dẫn vì nó TỪNG đúng, và là điều lời khuyên cũ (kể cả một bản trước của chương này) vẫn nói. Ngay cả trên Node 22, Buffer và bộ nhớ native nằm ngoài heap, nên một trần tường minh là cách để biết mình được gì.',
          },
        ],
      },
    },
  ],
};
