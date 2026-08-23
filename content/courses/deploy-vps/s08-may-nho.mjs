const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 8: Sống trên một cái máy nhỏ.
 * Mọi số đo là ĐO THẬT: một cgroup v1 memory có giới hạn thật ở
 * /sys/fs/cgroup/memory/thu, OOM killer thật của nhân Linux 6.18 kèm log
 * dmesg, một tệp swap 512 MB bật thật, và hai hệ tệp ext4 loopback dựng
 * riêng để đo cạn khối và cạn inode.
 */

export default {
  title: 'Chapter 8 — Living on a small machine: memory, the OOM killer, and disk|||Chương 8 — Sống trên một cái máy nhỏ: bộ nhớ, OOM killer, và đĩa',
  slug: 'deploy-ch8-may-nho',
  description: 'Mã thoát 137 là chữ ký của OOM killer, và nó không chọn thủ phạm — nó chọn cái TO NHẤT. Đo thật: một bản dựng chạy xong sạch sẽ trong khi cơ sở dữ liệu bị giết. Rồi phần đĩa: 162 MB trống mà vẫn "No space left on device".',
  sortOrder: 9,
  lessons: [

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
<p>A shell reports a process killed by signal <em>N</em> as exit code <strong>128 + N</strong>. Signal 9 is <code>SIGKILL</code>, which cannot be caught, blocked, or handled. So:</p>

<div class="kv-grid">
<div class="kv"><span class="k">137 = 128 + 9</span><span class="v">SIGKILL — almost always the OOM killer on a server</span></div>
<div class="kv"><span class="k">143 = 128 + 15</span><span class="v">SIGTERM — something asked politely; your handler ran (Chapter 3)</span></div>
<div class="kv"><span class="k">139 = 128 + 11</span><span class="v">SIGSEGV — a segmentation fault, usually native code</span></div>
<div class="kv"><span class="k">130 = 128 + 2</span><span class="v">SIGINT — somebody pressed Ctrl-C</span></div>
</div>

<p>The difference between 137 and 143 is the whole story. A 143 means your shutdown handler ran, connections drained, and the process chose to exit. A 137 means it was gone between one instruction and the next.</p>

<h3>Measuring it properly</h3>
<p>The sandbox this course is written in has 16 GB of RAM, which is no use for measuring what happens on a 1 GB VPS. So the measurements below use a real control group with a real limit — the same mechanism Docker uses for <code>--memory</code>, and the same mechanism a cheap VPS uses to give you the slice you paid for:</p>

<pre><code>CG=/sys/fs/cgroup/memory/thu
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
<pre><code>cat \$CG/memory.max_usage_in_bytes    <span class="tok-comment"># dinh cao nhat tung cham toi</span>
cat \$CG/memory.oom_control           <span class="tok-comment"># dem so lan bi giet</span>
cat \$CG/memory.stat                  <span class="tok-comment"># rss, cache, swap … tach ra</span></code></pre>

<div class="out">  memory.max_usage    : 256 MB
oom_kill_disable 0
under_oom 0
oom_kill 1</div>

<p><code>oom_kill 1</code> is a counter, not a flag — it accumulates. Reading it after a deploy tells you whether anything was killed during it, even if nobody was watching at the time. On a machine using cgroups v2 the equivalent lines live in <code>memory.events</code> as <code>oom</code> and <code>oom_kill</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>dmesg</code> is a ring buffer, so the evidence expires.</strong> It has a fixed size (often 1 MB or less) and old lines are overwritten by new ones. On a busy machine the OOM record from this morning may simply be gone by the afternoon, and you will be left with a mystery restart and no explanation. If a machine has systemd, <code>journalctl -k</code> reads the persisted copy; if it does not, arrange for the kernel log to be collected somewhere before you need it. Chapter 9 covers what to keep and for how long.</p>
</div>

<h3>Recognising it in the wild</h3>
<p>Different tools show you the same event in different clothes:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">docker ps -a</span><span class="lz-t">Exited (137)</span><span class="lz-d">plus <code>OOMKilled: true</code> in <code>docker inspect</code></span></div>
<div class="lz-step"><span class="lz-k">systemd</span><span class="lz-t">Main process exited, code=killed, status=9/KILL</span><span class="lz-d">then a restart if <code>Restart=</code> is set</span></div>
<div class="lz-step"><span class="lz-k">a bash script</span><span class="lz-t">exit 137</span><span class="lz-d">and <code>Killed</code> printed by the shell&#39;s job control</span></div>
<div class="lz-step"><span class="lz-k">your application log</span><span class="lz-t">nothing at all</span><span class="lz-d">the last line is whatever it happened to be doing</span></div>
</div>

<p>This repository&#39;s own notes record it in the third form, twice: a parallel container build on a 6 GB VPS killed <code>next build</code> with exit 137, and a backend recreate race left a container in <code>Exited(137)</code> with orphans beside it. 8.5 reproduces the first of those on purpose.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man 7 signal — the numbered signal table behind 128+N, and the note that SIGKILL and SIGSTOP cannot be caught or ignored.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Memory Resource Controller (cgroup v1)</span><span class="lc-sub">kernel.org/doc/Documentation/cgroup-v1/memory.txt — <code>memory.limit_in_bytes</code>, <code>memory.memsw.limit_in_bytes</code>, <code>memory.oom_control</code>: exactly the files used above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Control Group v2, memory.events</span><span class="lc-sub">docs.kernel.org/admin-guide/cgroup-v2.html — the v2 equivalents, including <code>memory.max</code>, <code>memory.high</code> and the <code>oom_kill</code> counter.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — runtime options for memory</span><span class="lc-sub">docs.docker.com/engine/containers/resource_constraints/ — <code>--memory</code> and <code>--memory-swap</code> are thin wrappers over the two cgroup files used in this lesson.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — resource limits and what a container actually sees</span><span class="lc-sub">/courses/docker/learn${REF} — why a process inside a limited container still reads the host&#39;s total RAM from <code>/proc/meminfo</code>, and what that breaks.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Mã thoát 137, và thứ nhân hệ điều hành ghi lại</h2>
<p class="lead">Ứng dụng của bạn KHÔNG vỡ. Nó không ném lỗi. Nó không ghi log gì cả, vì nó không được YÊU CẦU dừng — nó bị GỠ ĐI. Mã thoát 137 không phải một lỗi do mã của bạn sinh ra; nó là nhân hệ điều hành báo cho bạn biết nó vừa ra một quyết định thay bạn.</p>

<h3>137 nghĩa là gì</h3>
<p>Một cái shell báo một tiến trình bị giết bởi tín hiệu <em>N</em> thành mã thoát <strong>128 + N</strong>. Tín hiệu 9 là <code>SIGKILL</code>, thứ không bắt được, không chặn được, không xử lý được. Vậy nên:</p>

<div class="kv-grid">
<div class="kv"><span class="k">137 = 128 + 9</span><span class="v">SIGKILL — trên một máy chủ thì gần như luôn là OOM killer</span></div>
<div class="kv"><span class="k">143 = 128 + 15</span><span class="v">SIGTERM — có ai đó hỏi lịch sự; handler của bạn ĐÃ chạy (Chương 3)</span></div>
<div class="kv"><span class="k">139 = 128 + 11</span><span class="v">SIGSEGV — lỗi phân đoạn, thường là mã gốc</span></div>
<div class="kv"><span class="k">130 = 128 + 2</span><span class="v">SIGINT — có người bấm Ctrl-C</span></div>
</div>

<p>Khác biệt giữa 137 và 143 chính là toàn bộ câu chuyện. 143 nghĩa là handler tắt máy của bạn đã chạy, các kết nối đã rút hết, và tiến trình CHỌN việc thoát. 137 nghĩa là nó biến mất giữa lệnh này và lệnh kế tiếp.</p>

<h3>Đo cho đàng hoàng</h3>
<p>Cái hộp cát viết khoá học này có 16 GB RAM, chẳng dùng được gì cho việc đo xem chuyện gì xảy ra trên một VPS 1 GB. Nên các phép đo dưới đây dùng một control group THẬT với một giới hạn THẬT — đúng cái cơ chế Docker dùng cho <code>--memory</code>, và đúng cái cơ chế một VPS rẻ tiền dùng để cấp cho bạn phần bạn đã trả tiền:</p>

<pre><code>CG=/sys/fs/cgroup/memory/thu
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
<p>Các công cụ khác nhau cho bạn xem cùng một sự kiện trong những bộ quần áo khác nhau:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">docker ps -a</span><span class="lz-t">Exited (137)</span><span class="lz-d">cộng <code>OOMKilled: true</code> trong <code>docker inspect</code></span></div>
<div class="lz-step"><span class="lz-k">systemd</span><span class="lz-t">Main process exited, code=killed, status=9/KILL</span><span class="lz-d">rồi một cú khởi động lại nếu có đặt <code>Restart=</code></span></div>
<div class="lz-step"><span class="lz-k">một script bash</span><span class="lz-t">exit 137</span><span class="lz-d">và chữ <code>Killed</code> do bộ điều khiển tác vụ của shell in ra</span></div>
<div class="lz-step"><span class="lz-k">log ứng dụng của bạn</span><span class="lz-t">KHÔNG GÌ CẢ</span><span class="lz-d">dòng cuối là bất cứ thứ gì nó tình cờ đang làm</span></div>
</div>

<p>Ghi chú của chính kho này lưu lại nó ở dạng thứ ba, hai lần: một lần dựng container song song trên VPS 6 GB đã giết <code>next build</code> với mã thoát 137, và một cuộc đua khi tạo lại backend để một container ở trạng thái <code>Exited(137)</code> kèm mấy cái mồ côi bên cạnh. Bài 8.5 tái hiện cái thứ nhất một cách có chủ đích.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man 7 signal — bảng tín hiệu đánh số nằm sau công thức 128+N, và ghi chú rằng SIGKILL với SIGSTOP thì không bắt và không bỏ qua được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Memory Resource Controller (cgroup v1)</span><span class="lc-sub">kernel.org/doc/Documentation/cgroup-v1/memory.txt — <code>memory.limit_in_bytes</code>, <code>memory.memsw.limit_in_bytes</code>, <code>memory.oom_control</code>: đúng những tệp dùng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Control Group v2, memory.events</span><span class="lc-sub">docs.kernel.org/admin-guide/cgroup-v2.html — các thứ tương đương ở v2, kể cả <code>memory.max</code>, <code>memory.high</code> và bộ đếm <code>oom_kill</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — tuỳ chọn runtime cho bộ nhớ</span><span class="lc-sub">docs.docker.com/engine/containers/resource_constraints/ — <code>--memory</code> và <code>--memory-swap</code> là lớp bọc mỏng lên hai tệp cgroup dùng trong bài này.</span></span></div>
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
<p>Every process has a score, visible per-process and adjustable:</p>

<pre><code>cat /proc/&lt;pid&gt;/oom_score         <span class="tok-comment"># diem tinh ra, cang cao cang de bi giet</span>
cat /proc/&lt;pid&gt;/oom_score_adj     <span class="tok-comment"># -1000 … +1000, do BAN dat</span></code></pre>

<div class="out">  csdl pid=7782  oom_score=676  adj=0</div>

<p>The score is derived mostly from how much memory the process uses, as a proportion of what is available to it. <code>oom_score_adj</code> is your thumb on the scale: <strong>−1000</strong> means never pick this one if there is any alternative, <strong>+1000</strong> means pick this one first.</p>

<h3>Fixing it, measured</h3>
<p>The textbook fix is to protect the database with <code>-1000</code>. In this sandbox that write was refused — lowering the value requires a privilege the container does not have:</p>

<div class="out">echo -1000 > /proc/7394/oom_score_adj
/bin/bash: line 21: echo: write error: Permission denied</div>

<p>So the measurement uses the same lever from the other end, which any process can do to itself: the build raises <em>its own</em> score before it starts allocating.</p>

<pre><code><span class="tok-comment"># trong script dung, TRUOC khi cap phat gi:</span>
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

<h3>Doing it properly with systemd</h3>
<p>If the machine has systemd, the setting belongs in the unit rather than in a script:</p>

<pre><code>[Service]
OOMScoreAdjust=-500        <span class="tok-comment"># cho dich vu bạn KHONG muon mat</span>
MemoryMax=512M             <span class="tok-comment"># tran cung: vuot la bi giet</span>
MemoryHigh=400M            <span class="tok-comment"># tran mem: vuot thi bi bop cho cham lai truoc</span></code></pre>

<p><code>MemoryHigh</code> is worth knowing about specifically because it is the gentle version: a process over that line gets throttled and pushed to reclaim, rather than killed. A service that briefly spikes gets slowed down instead of removed, which is almost always what you want for something you cannot afford to lose.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>Restart=always</code> plus an OOM turns a spike into a loop.</strong> The service is killed, systemd restarts it, it allocates its way back to the same ceiling, and it is killed again. Every restart drops connections and rebuilds caches, so each cycle is <em>more</em> expensive than the last and the machine degrades under a load it could otherwise have absorbed. Set <code>StartLimitIntervalSec</code> and <code>StartLimitBurst</code> so the unit gives up and stays down rather than thrashing — a service that is honestly down is easier to diagnose than one that is up for four seconds at a time.</p>
</div>

<h3>The thing you cannot fix with scores</h3>
<p>All of this is triage. If the machine genuinely does not have enough memory for the work, adjusting who dies first only changes which failure you get. The real questions are the ones 8.5 measures: does this work need to run on this machine at all, does it need to run at the same time as everything else, and is the peak it hits actually necessary?</p>

<div class="kv-grid">
<div class="kv"><span class="k">oom_score_adj +1000</span><span class="v">on anything temporary; one line, no privileges</span></div>
<div class="kv"><span class="k">oom_score_adj −1000</span><span class="v">on the database; needs privilege, so put it in the systemd unit</span></div>
<div class="kv"><span class="k">MemoryHigh</span><span class="v">throttle before killing — the gentler ceiling</span></div>
<div class="kv"><span class="k">the check afterwards</span><span class="v"><code>dmesg | grep -i oom</code> and the cgroup&#39;s own <code>oom_kill</code> counter, after every deploy</span></div>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/[pid]/oom_score and oom_score_adj</span><span class="lc-sub">man 5 proc — the documented range, and the note that lowering the value requires CAP_SYS_RESOURCE, which is exactly the refusal measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — OOM killer implementation notes</span><span class="lc-sub">docs.kernel.org/admin-guide/mm/concepts.html and <code>mm/oom_kill.c</code> — how <code>oom_badness()</code> combines RSS, swap and page tables into the score.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.resource-control(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.resource-control.html — <code>MemoryMax</code>, <code>MemoryHigh</code>, <code>OOMScoreAdjust</code> and <code>OOMPolicy</code>, the declarative form of everything in this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Linux memory overcommit</span><span class="lc-sub">postgresql.org/docs/current/kernel-resources.html#LINUX-MEMORY-OVERCOMMIT — PostgreSQL&#39;s own advice on protecting the postmaster from the OOM killer, and why it sets its children&#39;s scores differently.</span></span></div>
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
<p>Mọi tiến trình đều có một điểm số, xem được theo từng tiến trình và chỉnh được:</p>

<pre><code>cat /proc/&lt;pid&gt;/oom_score         <span class="tok-comment"># diem tinh ra, cang cao cang de bi giet</span>
cat /proc/&lt;pid&gt;/oom_score_adj     <span class="tok-comment"># -1000 … +1000, do BAN dat</span></code></pre>

<div class="out">  csdl pid=7782  oom_score=676  adj=0</div>

<p>Điểm số phần lớn suy ra từ việc tiến trình dùng bao nhiêu bộ nhớ, tính theo tỷ lệ trên phần khả dụng của nó. <code>oom_score_adj</code> là ngón tay cái của bạn đặt lên cái cân: <strong>−1000</strong> nghĩa là ĐỪNG BAO GIỜ chọn cái này nếu còn lựa chọn khác, <strong>+1000</strong> nghĩa là chọn cái này TRƯỚC.</p>

<h3>Chữa nó, đo thật</h3>
<p>Cách chữa trong sách là bảo vệ cơ sở dữ liệu bằng <code>-1000</code>. Trong hộp cát này lệnh ghi đó bị TỪ CHỐI — hạ giá trị xuống đòi một đặc quyền mà container không có:</p>

<div class="out">echo -1000 > /proc/7394/oom_score_adj
/bin/bash: line 21: echo: write error: Permission denied</div>

<p>Nên phép đo dùng đúng cái đòn bẩy ấy từ đầu kia, thứ mà mọi tiến trình đều tự làm được với chính nó: bản dựng NÂNG điểm của <em>CHÍNH NÓ</em> lên trước khi bắt đầu cấp phát.</p>

<pre><code><span class="tok-comment"># trong script dung, TRUOC khi cap phat gi:</span>
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

<h3>Làm cho đàng hoàng bằng systemd</h3>
<p>Nếu máy có systemd, thiết lập này thuộc về cái unit chứ không phải một script:</p>

<pre><code>[Service]
OOMScoreAdjust=-500        <span class="tok-comment"># cho dich vu bạn KHONG muon mat</span>
MemoryMax=512M             <span class="tok-comment"># tran cung: vuot la bi giet</span>
MemoryHigh=400M            <span class="tok-comment"># tran mem: vuot thi bi bop cho cham lai truoc</span></code></pre>

<p><code>MemoryHigh</code> đáng biết riêng vì nó là bản NHẸ NHÀNG: một tiến trình vượt qua vạch đó sẽ bị bóp lại và bị đẩy đi thu hồi bộ nhớ, chứ không bị giết. Một dịch vụ vọt lên trong chốc lát sẽ bị làm chậm lại thay vì bị gỡ đi, mà đó gần như luôn là thứ bạn muốn cho một thứ bạn không kham nổi việc mất.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>Restart=always</code> cộng một cú OOM biến một cú vọt thành một VÒNG LẶP.</strong> Dịch vụ bị giết, systemd khởi động lại, nó cấp phát trở lại đúng cái trần ấy, và bị giết tiếp. Mỗi lần khởi động lại là rơi kết nối và dựng lại bộ đệm, nên mỗi vòng lại <em>ĐẮT HƠN</em> vòng trước và cái máy suy sụp dưới một mức tải mà lẽ ra nó hấp thụ được. Hãy đặt <code>StartLimitIntervalSec</code> và <code>StartLimitBurst</code> để cái unit bỏ cuộc và nằm im thay vì quẫy đạp — một dịch vụ chết một cách thành thật thì dễ chẩn đoán hơn một dịch vụ sống mỗi lần bốn giây.</p>
</div>

<h3>Thứ bạn KHÔNG chữa được bằng điểm số</h3>
<p>Tất cả những cái trên là phân loại thương binh. Nếu cái máy thật sự không đủ bộ nhớ cho khối việc đó, thì chỉnh xem ai chết trước chỉ đổi xem bạn nhận được cú hỏng nào. Câu hỏi thật là những câu bài 8.5 đem đi đo: khối việc này có cần chạy trên chính cái máy này không, nó có cần chạy CÙNG LÚC với mọi thứ khác không, và cái đỉnh nó chạm tới có thật sự cần thiết không?</p>

<div class="kv-grid">
<div class="kv"><span class="k">oom_score_adj +1000</span><span class="v">cho mọi thứ tạm thời; một dòng, không cần đặc quyền</span></div>
<div class="kv"><span class="k">oom_score_adj −1000</span><span class="v">cho cơ sở dữ liệu; cần đặc quyền, nên đặt trong unit systemd</span></div>
<div class="kv"><span class="k">MemoryHigh</span><span class="v">bóp lại trước khi giết — cái trần nhẹ nhàng hơn</span></div>
<div class="kv"><span class="k">phép kiểm sau đó</span><span class="v"><code>dmesg | grep -i oom</code> và bộ đếm <code>oom_kill</code> của chính cgroup, sau MỖI lần deploy</span></div>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/[pid]/oom_score và oom_score_adj</span><span class="lc-sub">man 5 proc — khoảng giá trị được ghi tài liệu, và ghi chú rằng HẠ giá trị xuống thì cần CAP_SYS_RESOURCE, đúng cái lời từ chối đo được ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — ghi chú cài đặt OOM killer</span><span class="lc-sub">docs.kernel.org/admin-guide/mm/concepts.html và <code>mm/oom_kill.c</code> — <code>oom_badness()</code> gộp RSS, swap và bảng trang thành điểm số ra sao.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.resource-control(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.resource-control.html — <code>MemoryMax</code>, <code>MemoryHigh</code>, <code>OOMScoreAdjust</code> và <code>OOMPolicy</code>, dạng khai báo của mọi thứ trong bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Linux memory overcommit</span><span class="lc-sub">postgresql.org/docs/current/kernel-resources.html#LINUX-MEMORY-OVERCOMMIT — lời khuyên của chính PostgreSQL về việc bảo vệ postmaster khỏi OOM killer, và vì sao nó đặt điểm cho các tiến trình con khác đi.</span></span></div>
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
<p>Lesson 8.1 measured a 500 MB allocation inside a 256 MB cgroup being killed at 401 ms. Adding a 512 MB swap file and raising the group&#39;s combined memory+swap ceiling to 768 MB:</p>

<pre><code>fallocate -l 512M /swap-thu
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
<p><strong>Bẫy — my first reading of this said swap was never used, and that was my mistake.</strong> I checked <code>memory.stat</code> after the process exited and saw <code>swap 0</code>, and briefly concluded the allocation had somehow fit in RAM. It had not: the counter is per-cgroup and the pages were freed the moment the process died, so by the time I read it there was nothing to count. Sampling <em>during</em> the run shows what actually happened:</p>
</div>

<div class="out">  t=0.25s  cgroup_rss=164 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=0.50s  cgroup_rss=216 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=0.75s  cgroup_rss=254 MB  cgroup_swap=0 MB    he_thong_swap=0 MB
  t=1.00s  cgroup_rss=254 MB  cgroup_swap=58 MB   he_thong_swap=63 MB
  t=1.25s  cgroup_rss=254 MB  cgroup_swap=122 MB  he_thong_swap=128 MB
  t=1.50s  cgroup_rss=253 MB  cgroup_swap=189 MB  he_thong_swap=195 MB</div>

<p>RSS climbs to 254 MB — the ceiling — and then stops dead while swap grows behind it: 58, 122, 189 MB. The limit was enforced exactly; the overflow went to disk. That is swap doing its entire job, visible in six samples.</p>

<h3>Now the bill</h3>
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

<h3>Why "slow" is sometimes worse than "dead"</h3>
<p>A killed process is obvious: exit 137, the supervisor restarts it, monitoring notices, someone looks. A swapping process is not obvious at all. It answers every request, correctly, eventually. Response times go from 40 ms to 4 seconds, timeouts start firing upstream, the connection pool fills with requests that are technically still running, and every dashboard says the service is up.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">no swap</span><span class="lz-t">exit 137</span><span class="lz-d">loud, immediate, obvious in the kernel log</span></div>
<div class="lz-step"><span class="lz-k">swap, light use</span><span class="lz-t">fine</span><span class="lz-d">idle pages evicted, nobody notices, this is swap working well</span></div>
<div class="lz-step"><span class="lz-k">swap, heavy use</span><span class="lz-t">thrashing</span><span class="lz-d">the worst state: alive, answering, unusably slow, and every health check green</span></div>
</div>

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
<p><strong>Bẫy — a swap file needs <code>chmod 600</code>, and <code>swapon</code> will tell you so.</strong> Swap holds whatever was in memory: session tokens, decrypted secrets, request bodies. A world-readable swap file is a plaintext dump of your process memory sitting on disk, which is why <code>swapon</code> prints "insecure permissions" and refuses. This is also the reason Chapter 4&#39;s advice about secrets in environment variables has a caveat — an environment variable can be swapped to disk like anything else.</p>
</div>

<h3>Where the cgroup accounting bites</h3>
<p>On cgroup v1 there are two ceilings, and the second one is easy to miss:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">memory.limit_in_bytes</span><span class="lz-lnote">RAM only</span></div>
<div class="lz-layer"><span class="lz-lname">memory.memsw.limit_in_bytes</span><span class="lz-lnote">RAM <em>plus</em> swap, combined. Set equal to the first and the group cannot swap at all — which is exactly how 8.1 produced a kill on a machine that had swap available</span></div>
<div class="lz-layer"><span class="lz-lname">cgroup v2: memory.max + memory.swap.max</span><span class="lz-lnote">two independent numbers, which is clearer; <code>memory.swap.max=0</code> disables swap for the group</span></div>
</div>

<p>Docker exposes this as <code>--memory</code> and <code>--memory-swap</code>, and the same trap applies: setting them to the same value disables swap for that container entirely.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">swapon(8) and mkswap(8)</span><span class="lc-sub">man 8 swapon — including the permission check that refuses a world-readable swap file, and <code>--priority</code> for multiple swap areas.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — vm.swappiness</span><span class="lc-sub">docs.kernel.org/admin-guide/sysctl/vm.html — what the number actually weighs (anonymous pages versus file-backed cache), which is not "how eager to swap" as commonly described.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8)</span><span class="lc-sub">man 8 vmstat — the <code>si</code>/<code>so</code> columns and why the first line of output is an average since boot rather than a current reading.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chris Down — In defence of swap</span><span class="lc-sub">chrisdown.name/2018/01/02/in-defence-of-swap.html — the clearest argument that swap is about reclaim behaviour rather than emergency capacity, from a kernel memory-management maintainer.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — reading free, vmstat and /proc/meminfo</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why "available" is the only column in <code>free</code> worth looking at, and what buff/cache really is.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Swap: mua được gì và trả giá gì</h2>
<p class="lead">Swap là ĐĨA giả làm bộ nhớ. Trên một VPS nhỏ nó là khác biệt giữa một tiến trình CHẾT và một tiến trình chỉ CHẬM — và cả hai đều là kết cục thật mà bạn phải chọn một cách có chủ đích.</p>

<h3>Đúng khối việc ấy, khi có swap</h3>
<p>Bài 8.1 đo một cú cấp phát 500 MB trong cgroup 256 MB bị giết ở mốc 401 ms. Thêm một tệp swap 512 MB và nâng trần bộ-nhớ-cộng-swap của nhóm lên 768 MB:</p>

<pre><code>fallocate -l 512M /swap-thu
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

<h3>Giờ tới hoá đơn</h3>
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

<h3>Vì sao "chậm" đôi khi tệ hơn "chết"</h3>
<p>Một tiến trình bị giết thì hiển nhiên: mã thoát 137, bộ giám sát khởi động lại nó, hệ theo dõi nhận ra, có người đi xem. Một tiến trình đang swap thì chẳng hiển nhiên chút nào. Nó trả lời MỌI request, ĐÚNG, và CUỐI CÙNG thì cũng xong. Thời gian phản hồi đi từ 40 ms lên 4 giây, các hạn giờ bắt đầu nổ ở phía trên, bể kết nối đầy những request về mặt kỹ thuật vẫn đang chạy, và mọi bảng điều khiển đều nói dịch vụ đang sống.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">không swap</span><span class="lz-t">thoát 137</span><span class="lz-d">ồn ào, tức thì, hiển nhiên trong log nhân</span></div>
<div class="lz-step"><span class="lz-k">swap, dùng nhẹ</span><span class="lz-t">ổn</span><span class="lz-d">trang nhàn rỗi bị đẩy ra, không ai nhận ra, đây là swap chạy TỐT</span></div>
<div class="lz-step"><span class="lz-k">swap, dùng nặng</span><span class="lz-t">quẫy đạp</span><span class="lz-d">trạng thái tệ nhất: sống, có trả lời, chậm tới mức không dùng được, và mọi chốt kiểm sức khoẻ đều XANH</span></div>
</div>

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
<p><strong>Bẫy — một tệp swap CẦN <code>chmod 600</code>, và <code>swapon</code> sẽ nói cho bạn biết.</strong> Swap giữ bất cứ thứ gì từng nằm trong bộ nhớ: token phiên, bí mật đã giải mã, thân request. Một tệp swap ai cũng đọc được là một bản đổ bộ nhớ tiến trình của bạn dưới dạng văn bản thuần nằm trên đĩa, và đó là lý do <code>swapon</code> in ra "insecure permissions" rồi từ chối. Đây cũng là lý do lời khuyên của Chương 4 về bí mật trong biến môi trường có một điều kiện kèm theo — một biến môi trường có thể bị đẩy xuống đĩa như mọi thứ khác.</p>
</div>

<h3>Chỗ kế toán cgroup cắn bạn</h3>
<p>Trên cgroup v1 có HAI cái trần, và cái thứ hai rất dễ bỏ sót:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">memory.limit_in_bytes</span><span class="lz-lnote">CHỈ RAM</span></div>
<div class="lz-layer"><span class="lz-lname">memory.memsw.limit_in_bytes</span><span class="lz-lnote">RAM <em>CỘNG</em> swap, gộp lại. Đặt bằng cái thứ nhất là nhóm đó KHÔNG swap được chút nào — mà đó chính xác là cách bài 8.1 tạo ra một cú giết trên một cái máy CÓ swap</span></div>
<div class="lz-layer"><span class="lz-lname">cgroup v2: memory.max + memory.swap.max</span><span class="lz-lnote">hai con số độc lập, rõ ràng hơn; <code>memory.swap.max=0</code> tắt swap cho nhóm đó</span></div>
</div>

<p>Docker phơi cái này ra thành <code>--memory</code> và <code>--memory-swap</code>, và cùng cái bẫy đó áp dụng: đặt chúng bằng nhau là tắt swap hoàn toàn cho container ấy.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">swapon(8) và mkswap(8)</span><span class="lc-sub">man 8 swapon — kể cả phép kiểm quyền từ chối một tệp swap ai cũng đọc được, và <code>--priority</code> cho nhiều vùng swap.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — vm.swappiness</span><span class="lc-sub">docs.kernel.org/admin-guide/sysctl/vm.html — con số đó THẬT SỰ cân cái gì (trang vô danh so với bộ đệm có tệp phía sau), chứ không phải "mức hăng hái swap" như người ta hay mô tả.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8)</span><span class="lc-sub">man 8 vmstat — hai cột <code>si</code>/<code>so</code> và vì sao DÒNG ĐẦU của output là trung bình kể từ lúc khởi động chứ không phải số đo hiện tại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chris Down — In defence of swap</span><span class="lc-sub">chrisdown.name/2018/01/02/in-defence-of-swap.html — lập luận rõ nhất rằng swap là chuyện HÀNH VI THU HỒI chứ không phải sức chứa dự phòng, viết bởi một người bảo trì phần quản lý bộ nhớ của nhân.</span></span></div>
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
<p><strong>Bẫy — this is why <code>rm big.log</code> on a running service frees nothing.</strong> The instinct during a disk emergency is to delete the biggest file, and if a process has it open you get exactly zero bytes back while <code>du</code> now shows the space as gone. Truncate instead of deleting — <code>: &gt; big.log</code> or <code>truncate -s 0 big.log</code> — which frees the blocks immediately and leaves the writer with a valid, empty file. This is also precisely what <code>logrotate</code>&#39;s <code>copytruncate</code> option exists for, and why the alternative requires signalling the process to reopen its log.</p>
</div>

<h3>Case two: free space, and still ENOSPC</h3>
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
<p><strong>Bẫy — an attempt at measuring inode exhaustion that measured something else.</strong> My first run created one-byte files on a default ext4 filesystem expecting to run out of inodes. It stopped at 32,394 files with <code>df -i</code> showing only <strong>64%</strong> of inodes used — it had run out of <em>blocks</em>, because ext4 allocates a minimum of one 4 KB block per file. 32,394 one-byte files consumed 127 MB, an amplification of about 4,000×. That failed measurement is worth more than the one I was aiming for: on a real server, "the disk is full and I only have a few hundred megabytes of actual data" is usually this, not inodes. I had to format a second filesystem with <code>mkfs.ext4 -N 2000</code> to produce genuine inode exhaustion.</p>
</div>

<h3>The disk that takes the database with it</h3>
<p>This repository&#39;s notes record the version of this that matters: the Docker build cache grew to <strong>7.6 GB on the same disk as PostgreSQL</strong>, and one deploy died mid-run with <em>no space left on device</em> — the disk had dropped to 1.8 GB free while <code>next build</code> was running. The fix was structural, not a cleanup: builds moved off the VPS entirely so the build cache never lands there, and a weekly cron reclaims disk as a backstop.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what fills a VPS</span><span class="lz-t">build cache, images, logs, old releases</span><span class="lz-d">all four grow monotonically unless something removes them</span></div>
<div class="lz-step"><span class="lz-k">what it kills</span><span class="lz-t">whatever writes next</span><span class="lz-d">usually the database, because it writes constantly</span></div>
<div class="lz-step"><span class="lz-k">the real fix</span><span class="lz-t">do not put growth on the data disk</span><span class="lz-d">build elsewhere; cap logs; bound release retention (6.1)</span></div>
</div>

<pre><code><span class="tok-comment"># bon cho gan nhu chac chan la thu pham, theo thu tu hay gap:</span>
docker system df                      <span class="tok-comment"># bo dem dung + anh mo coi</span>
du -sh /var/log/* | sort -h | tail    <span class="tok-comment"># log khong gioi han</span>
du -sh /srv/*/ban/* | sort -h | tail  <span class="tok-comment"># ban phat hanh cu (6.1)</span>
journalctl --disk-usage               <span class="tok-comment"># journal khong dat SystemMaxUse</span></code></pre>

<div class="callout ok">
<p><strong>Alert on the trend, not the threshold.</strong> "Disk 90% full" fires when you have hours left, at whatever hour that happens to be. "Disk will be full in three days at the current rate" fires while it is still office hours and the fix is unhurried. The second is one line of arithmetic over two <code>df</code> samples, and it is the single most useful thing in Chapter 9.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ENOSPC</span><span class="lc-sub">man 3 errno — errno 28, and the neighbouring EDQUOT (quota) and EFBIG (file too large), which produce similar symptoms from different causes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — the +L option</span><span class="lc-sub">man 8 lsof — <code>+L1</code> filters to files with a link count below 1, which is exactly the deleted-but-open case measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tune2fs(8) and mkfs.ext4(8)</span><span class="lc-sub">man 8 tune2fs — <code>-m</code> for the reserved percentage, and <code>mkfs.ext4 -N</code> / <code>-i</code> for inode count, the flag used to reproduce inode exhaustion.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8) — copytruncate</span><span class="lc-sub">man 8 logrotate — the two strategies for rotating a log a process has open, and the small window of lost lines that <code>copytruncate</code> accepts.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — images, layers and what system prune actually removes</span><span class="lc-sub">/courses/docker/learn${REF} — where the build cache lives, and why <code>docker system df</code> and <code>du</code> report different numbers for it.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>ENOSPC, và hai cái đĩa ĐẦY mà không đầy</h2>
<p class="lead">Một cái đĩa đầy KHÔNG suy giảm dần — nó DỪNG. Và khác với sức ép bộ nhớ, tiến trình không bị giết: nó vẫn sống, nhận về những lỗi mà rất thường là nó không xử lý, và đó là cách một cái đĩa đầy biến thành một cơ sở dữ liệu hỏng chứ không phải một lần gián đoạn.</p>

<h3>Ca đơn giản</h3>
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

<h3>Cái đĩa kéo cơ sở dữ liệu chết theo</h3>
<p>Ghi chú của kho này lưu lại phiên bản đáng kể của chuyện này: bộ đệm dựng Docker phình lên <strong>7,6 GB trên CÙNG cái đĩa chứa PostgreSQL</strong>, và một lần deploy chết giữa chừng với <em>no space left on device</em> — đĩa đã tụt xuống còn 1,8 GB trống trong lúc <code>next build</code> đang chạy. Cách chữa là CẤU TRÚC, không phải một cú dọn: việc dựng chuyển hẳn ra khỏi VPS để bộ đệm dựng không bao giờ rơi xuống đó, và một cron hằng tuần đòi lại đĩa như một lưới đỡ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">cái gì làm đầy một VPS</span><span class="lz-t">bộ đệm dựng, ảnh, log, bản cũ</span><span class="lz-d">cả bốn đều chỉ tăng, trừ khi có thứ gì đó gỡ chúng đi</span></div>
<div class="lz-step"><span class="lz-k">nó giết cái gì</span><span class="lz-t">thứ nào ghi tiếp theo</span><span class="lz-d">thường là cơ sở dữ liệu, vì nó ghi liên tục</span></div>
<div class="lz-step"><span class="lz-k">cách chữa thật</span><span class="lz-t">đừng đặt thứ tăng trưởng lên đĩa dữ liệu</span><span class="lz-d">dựng ở chỗ khác; chặn trần log; giới hạn số bản giữ (6.1)</span></div>
</div>

<pre><code><span class="tok-comment"># bon cho gan nhu chac chan la thu pham, theo thu tu hay gap:</span>
docker system df                      <span class="tok-comment"># bo dem dung + anh mo coi</span>
du -sh /var/log/* | sort -h | tail    <span class="tok-comment"># log khong gioi han</span>
du -sh /srv/*/ban/* | sort -h | tail  <span class="tok-comment"># ban phat hanh cu (6.1)</span>
journalctl --disk-usage               <span class="tok-comment"># journal khong dat SystemMaxUse</span></code></pre>

<div class="callout ok">
<p><strong>Báo động theo XU HƯỚNG, không theo ngưỡng.</strong> "Đĩa đầy 90%" nổ khi bạn còn vài giờ, vào bất cứ giờ nào chuyện đó xảy ra. "Đĩa sẽ đầy sau ba ngày với tốc độ hiện tại" nổ khi vẫn đang giờ hành chính và cách chữa thì thong thả. Cái thứ hai là một dòng số học trên hai lần lấy mẫu <code>df</code>, và nó là thứ hữu dụng nhất trong Chương 9.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ENOSPC</span><span class="lc-sub">man 3 errno — errno 28, và hai anh em hàng xóm EDQUOT (hạn ngạch) với EFBIG (tệp quá lớn), thứ tạo ra triệu chứng giống nhau từ nguyên nhân khác nhau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — tuỳ chọn +L</span><span class="lc-sub">man 8 lsof — <code>+L1</code> lọc ra các tệp có số liên kết dưới 1, đúng cái ca đã-xoá-mà-còn-mở đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tune2fs(8) và mkfs.ext4(8)</span><span class="lc-sub">man 8 tune2fs — <code>-m</code> cho phần trăm dự trữ, và <code>mkfs.ext4 -N</code> / <code>-i</code> cho số inode, cái cờ dùng để tái hiện cạn inode.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8) — copytruncate</span><span class="lc-sub">man 8 logrotate — hai chiến lược xoay vòng một tệp log mà tiến trình đang mở, và cái cửa sổ nhỏ mất dòng mà <code>copytruncate</code> chấp nhận.</span></span></div>
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

<h3>The four options, in order of preference</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1. build somewhere else entirely</span><span class="lz-lnote">the artifact arrives finished (Chapter 1). Nothing on the server allocates, nothing competes, and the build cache never lands on the data disk (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">2. build on the server, sequentially</span><span class="lz-lnote">halves the peak. Measured above: 138 MB against 270 MB</span></div>
<div class="lz-layer"><span class="lz-lname">3. build on the server with a raised oom_score_adj</span><span class="lz-lnote">if it must compete, at least it loses (8.2). One line, no privileges</span></div>
<div class="lz-layer"><span class="lz-lname">4. build on the server in parallel</span><span class="lz-lnote">measured to be both slower and fatal on a small box</span></div>
</div>

<p>This repository moved from 2 to 1 and recorded the numbers: builds on the VPS took about fifteen minutes and were forced to run sequentially precisely because parallel builds were OOM-killed; the same two images built in parallel on a bigger machine take three to six minutes. Roughly 3× faster — and the reason the note gives as more important is the second one: <strong>the VPS no longer holds a build cache at all.</strong></p>

<h3>Capping the build instead of hoping</h3>
<p>If a build must run on the small machine, bound it explicitly rather than letting it find the ceiling by hitting it:</p>

<pre><code><span class="tok-comment"># Node: dat tran vung nho cu the, va no NEM loi thay vi bi giet</span>
NODE_OPTIONS=--max-old-space-size=384 npm run build

<span class="tok-comment"># cgroup/systemd: bop truoc khi giet</span>
systemd-run --scope -p MemoryHigh=400M -p MemoryMax=512M npm run build

<span class="tok-comment"># Docker: hai co, va nho bay o 8.3 — dat bang nhau la TAT swap</span>
docker build --memory=512m --memory-swap=1g .</code></pre>

<div class="callout ok">
<p><strong>Why <code>--max-old-space-size</code> is worth setting even when it does not prevent anything.</strong> A V8 heap limit produces <code>FATAL ERROR: JavaScript heap out of memory</code> with a stack trace, and exit code 134. The OOM killer produces exit 137 and nothing at all (8.1). The first tells you which build step was allocating; the second tells you only that something died. Setting the heap ceiling <em>below</em> the cgroup limit converts an unexplainable kill into a readable error, and that alone is worth the line.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — Node does not know it is in a container.</strong> Without an explicit limit, V8 sizes its default heap from the <em>host&#39;s</em> total RAM, read from <code>/proc/meminfo</code> — which inside a container still reports the whole machine. On a 16 GB host with a 512 MB container limit, Node will happily plan for a multi-gigabyte heap and get killed long before it ever considers a garbage collection. This is the single most common cause of "it works on my machine, it exits 137 in the container", and <code>--max-old-space-size</code> is the fix.</p>
</div>

<h3>What else is running while you build</h3>
<p>The build is not the only thing competing. On a small VPS the resident set at rest is usually: the database (largest, by design), the application, nginx, and the log shipper. A build lands on top of all of it, and 8.2 established who loses.</p>

<pre><code><span class="tok-comment"># truoc khi dung, xem con bao nhieu cho thuc su:</span>
free -m                      <span class="tok-comment"># cot 'available', KHONG phai 'free'</span>
ps -eo rss,comm --sort=-rss | head -8
cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes   <span class="tok-comment"># dinh da tung cham</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">the number that matters</span><span class="v"><code>available</code> in <code>free -m</code> — it counts reclaimable cache, which <code>free</code> does not</span></div>
<div class="kv"><span class="k">the number to record</span><span class="v"><code>memory.max_usage_in_bytes</code> after a deploy — the peak you actually reached, not the average</span></div>
<div class="kv"><span class="k">the safety margin</span><span class="v">peak + database + app should leave room; if it does not, the build belongs elsewhere</span></div>
<div class="kv"><span class="k">the check after every deploy</span><span class="v"><code>dmesg | grep -ci oom</code> — a number that grew means something was killed and nobody noticed</span></div>
</div>

<h3>The same argument applies to disk</h3>
<p>Chapter 6 measured the disk cost of keeping releases: 29 MB of <code>node_modules</code> per release, about 145 MB for five and 580 MB for twenty. 8.4 measured what happens when that plus a build cache fills the disk the database lives on. The two pressures have the same structural fix, and it is the one Chapter 1 argued for on completely different grounds: <strong>the server should receive finished artifacts, not raw material.</strong> Everything in this chapter is a consequence of ignoring that.</p>

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

<h3>Bốn lựa chọn, theo thứ tự nên chọn</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1. dựng HẲN ở chỗ khác</span><span class="lz-lnote">tạo tác tới nơi đã hoàn chỉnh (Chương 1). Không có gì trên máy chủ cấp phát, không có gì tranh giành, và bộ đệm dựng không bao giờ rơi xuống đĩa dữ liệu (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">2. dựng trên máy chủ, TUẦN TỰ</span><span class="lz-lnote">giảm đỉnh đi một nửa. Đo ở trên: 138 MB so với 270 MB</span></div>
<div class="lz-layer"><span class="lz-lname">3. dựng trên máy chủ kèm oom_score_adj nâng lên</span><span class="lz-lnote">nếu buộc phải tranh giành, thì ít nhất cho nó THUA (8.2). Một dòng, không cần đặc quyền</span></div>
<div class="lz-layer"><span class="lz-lname">4. dựng trên máy chủ, SONG SONG</span><span class="lz-lnote">đo được là vừa chậm hơn vừa chết người trên một cái máy nhỏ</span></div>
</div>

<p>Kho này đã chuyển từ 2 sang 1 và ghi lại các con số: dựng trên VPS mất khoảng mười lăm phút và BUỘC phải chạy tuần tự chính vì các bản dựng song song bị OOM giết; cũng hai cái ảnh đó dựng song song trên một máy lớn hơn mất ba tới sáu phút. Nhanh hơn khoảng 3 lần — và cái lý do mà ghi chú ấy nói là QUAN TRỌNG HƠN lại là cái thứ hai: <strong>VPS không còn giữ bộ đệm dựng nào nữa.</strong></p>

<h3>Chặn trần cho bản dựng thay vì hy vọng</h3>
<p>Nếu một bản dựng buộc phải chạy trên cái máy nhỏ, hãy chặn nó một cách tường minh chứ đừng để nó tìm ra cái trần bằng cách đâm vào:</p>

<pre><code><span class="tok-comment"># Node: dat tran vung nho cu the, va no NEM loi thay vi bi giet</span>
NODE_OPTIONS=--max-old-space-size=384 npm run build

<span class="tok-comment"># cgroup/systemd: bop truoc khi giet</span>
systemd-run --scope -p MemoryHigh=400M -p MemoryMax=512M npm run build

<span class="tok-comment"># Docker: hai co, va nho bay o 8.3 — dat bang nhau la TAT swap</span>
docker build --memory=512m --memory-swap=1g .</code></pre>

<div class="callout ok">
<p><strong>Vì sao <code>--max-old-space-size</code> đáng đặt kể cả khi nó chẳng ngăn được gì.</strong> Một giới hạn heap của V8 đẻ ra <code>FATAL ERROR: JavaScript heap out of memory</code> kèm vết ngăn xếp, và mã thoát 134. OOM killer đẻ ra mã thoát 137 và KHÔNG GÌ CẢ (8.1). Cái thứ nhất nói cho bạn biết bước dựng nào đang cấp phát; cái thứ hai chỉ nói cho bạn biết có thứ gì đó đã chết. Đặt trần heap THẤP HƠN giới hạn cgroup sẽ biến một cú giết không giải thích được thành một lỗi đọc được, và riêng chuyện đó đã đáng cái dòng lệnh.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — Node KHÔNG biết là nó đang ở trong container.</strong> Không có giới hạn tường minh, V8 tính heap mặc định từ tổng RAM của <em>MÁY CHỦ</em>, đọc từ <code>/proc/meminfo</code> — mà bên trong container thì tệp đó vẫn báo cả cái máy. Trên một máy chủ 16 GB với giới hạn container 512 MB, Node sẽ vui vẻ lên kế hoạch cho một cái heap vài gigabyte và bị giết từ lâu trước khi nó nghĩ tới chuyện dọn rác. Đây là nguyên nhân phổ biến nhất của "trên máy tôi chạy được, trong container thì thoát 137", và <code>--max-old-space-size</code> là cách chữa.</p>
</div>

<h3>Còn thứ gì đang chạy trong lúc bạn dựng</h3>
<p>Bản dựng không phải thứ duy nhất tranh giành. Trên một VPS nhỏ, phần thường trú lúc nghỉ thường là: cơ sở dữ liệu (to nhất, theo thiết kế), ứng dụng, nginx, và bộ gửi log. Một bản dựng đáp xuống trên tất cả những thứ đó, và bài 8.2 đã xác lập ai là người thua.</p>

<pre><code><span class="tok-comment"># truoc khi dung, xem con bao nhieu cho thuc su:</span>
free -m                      <span class="tok-comment"># cot 'available', KHONG phai 'free'</span>
ps -eo rss,comm --sort=-rss | head -8
cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes   <span class="tok-comment"># dinh da tung cham</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">con số quan trọng</span><span class="v"><code>available</code> trong <code>free -m</code> — nó tính cả bộ đệm thu hồi được, thứ mà <code>free</code> thì không</span></div>
<div class="kv"><span class="k">con số cần ghi lại</span><span class="v"><code>memory.max_usage_in_bytes</code> sau một lần deploy — cái ĐỈNH bạn thật sự chạm tới, không phải trung bình</span></div>
<div class="kv"><span class="k">biên an toàn</span><span class="v">đỉnh + cơ sở dữ liệu + ứng dụng phải còn chừa chỗ; nếu không thì chỗ của bản dựng là nơi khác</span></div>
<div class="kv"><span class="k">phép kiểm sau mỗi lần deploy</span><span class="v"><code>dmesg | grep -ci oom</code> — một con số lớn lên nghĩa là có thứ bị giết mà không ai nhận ra</span></div>
</div>

<h3>Cùng lập luận đó áp cho đĩa</h3>
<p>Chương 6 đo giá đĩa của việc giữ các bản phát hành: 29 MB <code>node_modules</code> mỗi bản, khoảng 145 MB cho năm bản và 580 MB cho hai mươi. Bài 8.4 đo chuyện gì xảy ra khi ngần ấy cộng với một bộ đệm dựng làm đầy cái đĩa mà cơ sở dữ liệu đang sống trên đó. Hai sức ép đó có CÙNG một cách chữa cấu trúc, và nó đúng là cái mà Chương 1 đã lập luận vì những lý do hoàn toàn khác: <strong>máy chủ nên NHẬN tạo tác đã hoàn chỉnh, không phải nguyên liệu thô.</strong> Mọi thứ trong chương này là hệ quả của việc phớt lờ điều đó.</p>

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
      description: 'Tám câu về một mã thoát không có log nào giải thích, một bản dựng thoát 0 trong khi cơ sở dữ liệu chết, swap chậm hơn bốn trăm lần, và một hệ tệp còn 162 MB trống vẫn nói No space left on device.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.6</span>
<h2>Quiz: the small machine</h2>
<p class="lead">Eight questions from the chapter where the kernel makes the decisions, the innocent process dies, and the disk lies twice.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> A 500 MB allocation inside a real 256 MB cgroup was killed at 401 ms with exit <strong>137</strong> (128+9, SIGKILL) and wrote nothing to the application log — the explanation lived only in <code>dmesg</code>, which named the pid, the RSS, the <code>oom_score_adj</code>, and <code>constraint=CONSTRAINT_MEMCG</code> (8.1). Pointed the other way, a build asking for 120 MB on top of a 188 MB database finished with exit <strong>0</strong> while the database was killed, because the kernel picks the biggest rather than the culprit; raising the build&#39;s own <code>oom_score_adj</code> to 1000 reversed it exactly — build killed, database alive (8.2). Adding swap let the same 8.1 workload finish with exit 0, with RSS pinned at 254 MB while swap grew to 189 MB — though my first reading said <code>swap 0</code> because I sampled after the process exited — and reading back memory that had spilled cost 56–66 ms against 0.14–0.28 ms in RAM (8.3). A full disk returned <strong>ENOSPC</strong> for a 1 MB write while a small append still succeeded, and <code>rm</code> recovered 118 MB in 8 ms; then two disks that were full without being full: <code>df</code> 141 MB against <code>du</code> 41 MB from a deleted-but-open file, recovered by truncating through <code>/proc/&lt;pid&gt;/fd</code>, and a filesystem with 162 MB free that refused to create a file because inodes were exhausted (8.4). And two builds run in parallel peaked at 270 MB against 138 MB sequentially; lowering the ceiling to 200 MB with no swap made the parallel run die with 137 <em>and</em> take 632 ms against the sequential run&#39;s 283 (8.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.6</span>
<h2>Quiz: cái máy nhỏ</h2>
<p class="lead">Tám câu ra từ cái chương mà nhân hệ điều hành ra quyết định, tiến trình vô tội thì chết, và cái đĩa nói dối hai lần.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một cú cấp phát 500 MB trong một cgroup THẬT 256 MB bị giết ở mốc 401 ms với mã thoát <strong>137</strong> (128+9, SIGKILL) và không ghi gì vào log ứng dụng — lời giải thích chỉ sống trong <code>dmesg</code>, nơi gọi tên pid, RSS, <code>oom_score_adj</code>, và <code>constraint=CONSTRAINT_MEMCG</code> (8.1). Chĩa theo hướng ngược lại, một bản dựng xin 120 MB đè lên một cơ sở dữ liệu 188 MB đã chạy xong với mã thoát <strong>0</strong> trong khi cơ sở dữ liệu bị giết, vì nhân chọn cái TO NHẤT chứ không chọn thủ phạm; nâng <code>oom_score_adj</code> của chính bản dựng lên 1000 đảo ngược y hệt — bản dựng chết, cơ sở dữ liệu sống (8.2). Thêm swap thì đúng khối việc của 8.1 chạy xong với mã 0, RSS ghim ở 254 MB trong khi swap lớn lên 189 MB — dù lần đọc ĐẦU của tôi báo <code>swap 0</code> vì tôi lấy mẫu SAU khi tiến trình thoát — và đọc lại phần bộ nhớ đã tràn tốn 56–66 ms so với 0,14–0,28 ms trong RAM (8.3). Một cái đĩa đầy trả <strong>ENOSPC</strong> cho lệnh ghi 1 MB trong khi cú nối thêm nhỏ vẫn chạy được, và <code>rm</code> lấy lại 118 MB trong 8 ms; rồi hai cái đĩa đầy mà không đầy: <code>df</code> 141 MB so với <code>du</code> 41 MB do một tệp đã-xoá-còn-mở, cứu được bằng cách cắt cụt qua <code>/proc/&lt;pid&gt;/fd</code>, và một hệ tệp còn 162 MB trống vẫn từ chối tạo tệp vì cạn inode (8.4). Và hai bản dựng chạy song song đạt đỉnh 270 MB so với 138 MB khi tuần tự; hạ trần xuống 200 MB không swap thì lần chạy song song vừa chết với 137 <em>vừa</em> tốn 632 ms so với 283 ms của lần tuần tự (8.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A process exits 137 and its own log says nothing. Where is the explanation?|||Một tiến trình thoát 137 và log của chính nó không nói gì. Lời giải thích nằm ở đâu?',
            options: [
              'In the application log, at a higher verbosity|||Trong log ứng dụng, ở mức chi tiết cao hơn',
              'In the kernel ring buffer — dmesg or journalctl -k — because SIGKILL cannot be caught, so the process had no chance to write anything|||Trong vòng đệm log của nhân — dmesg hoặc journalctl -k — vì SIGKILL không bắt được, nên tiến trình không có cơ hội ghi gì cả',
              'In the systemd unit file|||Trong tệp unit của systemd',
              'Nowhere; exit 137 is undiagnosable|||Không đâu cả; mã 137 không chẩn đoán được',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'What is the difference between exit 137 and exit 143?|||Khác biệt giữa mã thoát 137 và mã thoát 143 là gì?',
            options: [
              'They are the same thing reported by different shells|||Cùng một chuyện, do các shell khác nhau báo lại',
              '137 is 128+9 SIGKILL — removed with no chance to react; 143 is 128+15 SIGTERM — the shutdown handler ran and the process chose to exit|||137 là 128+9 SIGKILL — bị gỡ đi không có cơ hội phản ứng; 143 là 128+15 SIGTERM — handler tắt máy đã chạy và tiến trình CHỌN việc thoát',
              '137 is a segfault, 143 is out of memory|||137 là lỗi phân đoạn, 143 là hết bộ nhớ',
              '143 means the disk was full|||143 nghĩa là đĩa đầy',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A build asked for 120 MB, exited 0, and the database was killed. Why did the kernel choose the database?|||Một bản dựng xin 120 MB, thoát 0, và cơ sở dữ liệu bị giết. Vì sao nhân chọn cơ sở dữ liệu?',
            options: [
              'The database had a bug|||Cơ sở dữ liệu có lỗi',
              'The OOM killer optimises for freeing the most pages at once, so it picks the largest process — not the one that caused the shortage|||OOM killer tối ưu cho việc giải phóng nhiều trang nhất trong một lần, nên nó chọn tiến trình LỚN NHẤT — không phải cái gây ra sự thiếu hụt',
              'The build had already finished so it could not be killed|||Bản dựng đã xong rồi nên không giết được',
              'Databases always have a higher oom_score_adj|||Cơ sở dữ liệu lúc nào cũng có oom_score_adj cao hơn',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'What is the cheapest reliable protection for a database against a one-off build or import script?|||Cách bảo vệ rẻ và đáng tin nhất cho cơ sở dữ liệu trước một script dựng hay nhập liệu chạy một lần là gì?',
            options: [
              'Add more RAM|||Mua thêm RAM',
              'Have the temporary job raise its own oom_score_adj to 1000 before allocating — one line, no privileges, and it makes the batch job lose instead of the database|||Bắt tác vụ tạm thời tự nâng oom_score_adj của nó lên 1000 trước khi cấp phát — một dòng, không cần đặc quyền, và nó làm cho tác vụ lô thua thay vì cơ sở dữ liệu',
              'Set Restart=always on the database|||Đặt Restart=always cho cơ sở dữ liệu',
              'Disable the OOM killer|||Tắt hẳn OOM killer',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Reading back memory that had spilled to swap took 56-66 ms against 0.14-0.28 ms in RAM. What is that actually measuring?|||Đọc lại phần bộ nhớ đã tràn sang swap mất 56-66 ms so với 0,14-0,28 ms trong RAM. Đó thật ra đang đo cái gì?',
            options: [
              'Disk throughput|||Thông lượng đĩa',
              'Page faults — every touched page on disk must be read back before the instruction completes, and the process is stopped while it waits|||LỖI TRANG — mọi trang được chạm mà đang nằm trên đĩa đều phải đọc ngược vào trước khi lệnh hoàn tất, và tiến trình bị DỪNG trong lúc chờ',
              'CPU contention|||Tranh giành CPU',
              'Garbage collection|||Việc dọn rác',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why is a heavily swapping service often worse than one that gets OOM-killed?|||Vì sao một dịch vụ đang swap nặng thường TỆ HƠN một dịch vụ bị OOM giết?',
            options: [
              'It is not; swapping is always preferable|||Không phải; swap lúc nào cũng đáng chọn hơn',
              'A kill is loud and obvious; a swapping service answers every request correctly but slowly, so timeouts cascade upstream while every health check stays green|||Một cú giết thì ồn ào và hiển nhiên; một dịch vụ đang swap trả lời MỌI request ĐÚNG nhưng CHẬM, nên các hạn giờ đổ dây chuyền lên phía trên trong khi mọi chốt kiểm sức khoẻ vẫn xanh',
              'Swap corrupts data|||Swap làm hỏng dữ liệu',
              'Swapping uses more CPU than a restart|||Swap tốn CPU hơn một lần khởi động lại',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'df reports 141 MB used, du reports 41 MB, and nothing large is visible on the filesystem. What happened, and what recovers the space without a restart?|||df báo 141 MB đã dùng, du báo 41 MB, và không thấy tệp lớn nào trên hệ tệp. Chuyện gì đã xảy ra, và cái gì lấy lại chỗ mà không cần khởi động lại?',
            options: [
              'The filesystem is corrupt; run fsck|||Hệ tệp hỏng; chạy fsck',
              'A file was deleted while a process still had it open, so the inode survives with no name; lsof -nP +L1 finds it and truncating through /proc/<pid>/fd frees it|||Một tệp bị xoá trong khi một tiến trình vẫn đang mở nó, nên inode sống tiếp mà không còn tên; lsof -nP +L1 tìm ra nó và cắt cụt qua /proc/<pid>/fd thì giải phóng được',
              'du is simply less accurate than df|||du đơn giản là kém chính xác hơn df',
              'The space is in the 5% root reserve|||Chỗ đó nằm trong phần 5% dự trữ cho root',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Two builds run in parallel peaked at 270 MB and, under a 200 MB no-swap ceiling, took 632 ms while dying with 137 — against 283 ms sequentially. What is the lesson?|||Hai bản dựng chạy song song đạt đỉnh 270 MB và, dưới trần 200 MB không swap, tốn 632 ms trong khi chết với mã 137 — so với 283 ms khi tuần tự. Bài học là gì?',
            options: [
              'Parallelism is always slower|||Song song lúc nào cũng chậm hơn',
              'On a machine too small for the combined peak, parallelism loses on both axes: the killed build is wasted work that still costs wall-clock time|||Trên một cái máy quá nhỏ so với cái đỉnh gộp lại, song song THUA trên cả hai trục: bản dựng bị giết là công sức đổ sông mà vẫn tính vào thời gian đồng hồ',
              'Node builds cannot be parallelised|||Không thể chạy song song các bản dựng Node',
              'The ceiling should have been raised|||Lẽ ra phải nâng cái trần lên',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
