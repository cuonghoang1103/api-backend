/**
 * Linux & Bash — Chương 10: Đĩa, gói phần mềm & log.
 * Đĩa đầy · thiết bị khối và mount · quản lý gói · log và journalctl · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 10 — Disk, packages & logs|||Chương 10 — Đĩa, gói phần mềm & log',
  description: 'df khác du ra sao, tìm ra thứ làm đầy đĩa, apt/dnf, journalctl và việc xoay vòng log. Ba thứ chiếm phần lớn công việc bảo trì một máy chủ, và cả ba đều có những cái bẫy chỉ lộ ra lúc 3 giờ sáng.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — The disk is full: finding out what filled it|||10.1 — Đĩa đầy: tìm ra cái gì làm nó đầy',
      slug: 'lnx-10-1-dia-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'df với du khác nhau ở đâu và vì sao chúng bất đồng, ncdu để tìm nhanh, hết inode trong khi df báo còn trống, file đã xoá mà vẫn chiếm chỗ, và một quy trình dọn dẹp theo thứ tự an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The disk is full</h2>
<p class="lead">A full disk breaks things in ways that look like other problems: a database refuses writes, a deploy fails halfway, logging stops silently, and the machine may not even let you log in. This lesson is the sequence that finds the cause in about a minute — including the two cases where <code>df</code> tells you there is plenty of space and there is not.</p>

<h3>df and du answer different questions</h3>
<pre><code>df -h                       <span class="tok-comment"># what the FILESYSTEM reports</span>
du -sh /var/log             <span class="tok-comment"># what the FILES in a directory add up to</span></code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        79G   75G  1.8G  98% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/vda15      105M  6.1M   99M   6% /boot/efi

2.3G    /var/log</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>df</code></span><span class="v">Asks the filesystem how many blocks are allocated. Fast, authoritative, and includes space held by things you cannot see in a directory listing.</span></div>
  <div class="kv"><span class="k"><code>du</code></span><span class="v">Walks a directory tree and adds up file sizes. Slow on a big tree, and it can only count files it can <em>see</em>.</span></div>
</div>
<div class="callout"><strong>When they disagree, the difference is the interesting part.</strong> <code>df</code> saying 75 GB used while <code>du -sh /</code> totals 40 GB means 35 GB is held by something not visible as a file: a deleted-but-open file, a filesystem mounted over a directory that still has data underneath, or reserved blocks. All three appear below, and the gap is the clue.</div>

<h3>Finding the big directories</h3>
<pre><code>du -h --max-depth=1 / 2&gt;/dev/null | sort -h | tail -15</code></pre>
<div class="out">1.1G    /home
2.3G    /var
4.8G    /usr
66G     /var/lib/docker
75G     /</div>
<pre><code><span class="tok-comment"># Then follow the biggest one down</span>
du -h --max-depth=1 /var/lib/docker | sort -h | tail
du -h --max-depth=1 /var/lib/docker/overlay2 | sort -h | tail -5

<span class="tok-comment"># The 20 biggest individual files</span>
find / -xdev -type f -printf '%s\\t%p\\n' 2&gt;/dev/null \\
  | sort -rn | head -20 | numfmt --field=1 --to=iec</code></pre>
<div class="out">4.2G    /var/lib/docker/overlay2/8f2a.../diff/app/node_modules
2.1G    /var/log/journal/9c1b.../system.journal
1.8G    /var/log/nginx/access.log</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-x</code> / <code>-xdev</code></span><span class="v">Stay on ONE filesystem. Without it, <code>du /</code> also walks network mounts and <code>/proc</code>, which is slow and gives meaningless numbers.</span></div>
  <div class="kv"><span class="k"><code>sort -h</code></span><span class="v">Sorts human-readable sizes correctly: <code>2.3G</code> after <code>900M</code>. Plain <code>sort</code> puts <code>900M</code> last (Lesson 3.4).</span></div>
  <div class="kv"><span class="k"><code>2&gt;/dev/null</code></span><span class="v">Silences the permission-denied noise so the real output is readable (Lesson 3.1).</span></div>
</div>
<pre><code>sudo apt install ncdu
sudo ncdu -x /</code></pre>
<div class="callout ok"><code>ncdu</code> is worth installing on every server before you need it. It gives you an interactive, sorted tree you navigate with arrow keys, showing each directory's share of the total — so finding the offending 40 GB takes three keypresses instead of five <code>du</code> commands. Press <code>d</code> to delete from inside it, though on a production machine reading first is wiser.</div>

<h3>Case one: inodes, not bytes</h3>
<pre><code>df -h /                     <span class="tok-comment"># 42% used — plenty of room</span>
df -i /                     <span class="tok-comment"># the OTHER number</span></code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        79G   33G   43G  42% /

Filesystem      Inodes  IUsed IFree IUse% Mounted on
/dev/vda1      5242880 5242880     0  100% /</div>
<p>Every file and directory consumes one inode (Lesson 2.4), and a filesystem is created with a fixed number of them. Millions of tiny files — a session directory, a cache, unrotated mail, one <code>node_modules</code> per deploy — exhaust the inode table while using barely any space. The symptom is <code>No space left on device</code> from every write while <code>df -h</code> insists there are 43 GB free.</p>
<pre><code><span class="tok-comment"># Which directories hold the most FILES (not the most bytes)</span>
sudo find / -xdev -type d -exec sh -c 'echo "\$(ls -A "\$1" 2&gt;/dev/null | wc -l) \$1"' _ {} \\; 2&gt;/dev/null \\
  | sort -rn | head -10</code></pre>
<div class="out">1841203 /var/spool/postfix/maildrop
  84210 /tmp
  41022 /var/lib/php/sessions</div>
<div class="callout warn">Inode exhaustion cannot be fixed by deleting a few large files — you must delete <em>many</em> files, or recreate the filesystem with more inodes. It is also a case where <code>df -h</code> actively misleads, so make <code>df -i</code> part of your reflex: whenever a write fails with "no space" and <code>df -h</code> looks fine, run <code>df -i</code> before anything else.</div>

<h3>Case two: deleted files that are still open</h3>
<pre><code>df -h /                     <span class="tok-comment"># 98% used</span>
du -sh /* 2&gt;/dev/null | sort -h | tail -3   <span class="tok-comment"># adds up to far less</span>

sudo lsof +L1 2&gt;/dev/null | head</code></pre>
<div class="out">COMMAND   PID  USER  FD  TYPE  SIZE/OFF  NLINK  NODE NAME
nginx     812  root  8w  REG   32212254720  0  4021 /var/log/nginx/access.log (deleted)</div>
<p>Someone ran <code>rm access.log</code> to free space. The <em>name</em> is gone, so <code>du</code> cannot see it — but nginx still holds the file open, so the 30 GB is still allocated (Lesson 2.4: <code>unlink()</code> removes a name, and the data survives until the last name <em>and</em> the last open handle go). The space returns only when that process closes the file or exits.</p>
<pre><code>sudo lsof +L1                              <span class="tok-comment"># NLINK 0 = deleted but open</span>
sudo ls -l /proc/*/fd/* 2&gt;/dev/null | grep deleted | head

<span class="tok-comment"># The fix, in order of preference</span>
sudo systemctl reload nginx                <span class="tok-comment"># many daemons reopen their logs on reload</span>
sudo kill -USR1 812                        <span class="tok-comment"># nginx: reopen log files (Lesson 5.3)</span>
sudo truncate -s 0 /proc/812/fd/8          <span class="tok-comment"># last resort: empty it through the fd</span></code></pre>
<div class="callout ok"><strong>Never delete an active log file — truncate it instead.</strong> <code>sudo truncate -s 0 /var/log/nginx/access.log</code> frees the space immediately, keeps the inode, and the writing process carries on with no reload and no gap. <code>rm</code> on an open log gives you the worst of both: the space stays used <em>and</em> the process keeps writing into a file nobody can read. Better still, let <code>logrotate</code> handle it — Lesson 10.3.</div>

<h3>Case three: something mounted over a full directory</h3>
<pre><code>df -h /var/lib/docker
mount | grep -E ' / | /var'
findmnt -t ext4,xfs,btrfs</code></pre>
<div class="out">/dev/vdb1  200G  12G  178G   7% /var/lib/docker</div>
<p>If a filesystem is mounted at <code>/var/lib/docker</code>, anything that was in that directory <em>before</em> the mount is still on the root filesystem, invisible and consuming space. <code>du</code> shows the mounted volume's contents; <code>df /</code> counts the hidden data underneath. Unmount the volume and look, or check <code>du -sh</code> against <code>df</code> for that path.</p>
<pre><code>lsblk                                <span class="tok-comment"># the block devices and their mount points</span>
findmnt                              <span class="tok-comment"># the mount tree, readable</span>
cat /etc/fstab                       <span class="tok-comment"># what mounts at boot</span></code></pre>
<div class="out">NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
vda    252:0    0   80G  0 disk
├─vda1 252:1    0 78.9G  0 part /
└─vda15 252:15  0  106M  0 part /boot/efi
vdb    252:16   0  200G  0 disk
└─vdb1 252:17   0  200G  0 part /var/lib/docker</div>

<h3>The reserved 5%</h3>
<pre><code>sudo tune2fs -l /dev/vda1 | grep -i 'reserved block'</code></pre>
<div class="out">Reserved block count:     1024000
Reserved GDT blocks:      1024</div>
<p>ext4 reserves 5% of the filesystem for root by default. That is why an ordinary user gets "No space left on device" while <code>df</code> shows a few percent free, and why root can still log in and fix things on a "full" disk — which is the entire point of the reservation. On a 200 GB data volume that is 10 GB set aside for no benefit; reducing it is reasonable there, and a bad idea on the root filesystem.</p>
<pre><code>sudo tune2fs -m 1 /dev/vdb1          <span class="tok-comment"># 5% → 1% on a DATA volume only</span></code></pre>

<h3>What actually fills a server</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Docker</span><span class="lz-lnote">Images, stopped containers, dangling build cache, unused volumes. Usually the largest single consumer. <code>docker system df</code> shows the breakdown.</span></div>
  <div class="lz-layer"><span class="lz-lname">Logs</span><span class="lz-lnote">An unrotated <code>access.log</code>, or a journal with no size limit. <code>journalctl --disk-usage</code> and <code>/var/log</code> (Lesson 10.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Package cache</span><span class="lz-lnote"><code>/var/cache/apt/archives</code> keeps every <code>.deb</code> ever downloaded. <code>apt clean</code> (Lesson 10.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">Old kernels</span><span class="lz-lnote"><code>/boot</code> is small and fills with a handful of kernels — which then breaks the <em>next</em> upgrade. <code>apt autoremove</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Backups and uploads</span><span class="lz-lnote">A backup script with no retention, or user uploads with no lifecycle. Both grow forever by design unless someone stops them.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build artefacts</span><span class="lz-lnote"><code>node_modules</code> per release, <code>target/</code>, <code>.next/</code>. One per deploy adds up quickly if old releases are never pruned.</span></div>
</div>
<pre><code>docker system df                     <span class="tok-comment"># images / containers / volumes / build cache</span>
docker system prune -a --volumes      <span class="tok-comment"># DESTRUCTIVE — read the next callout</span>
journalctl --disk-usage
sudo journalctl --vacuum-size=500M
sudo apt clean &amp;&amp; sudo apt autoremove --purge</code></pre>
<div class="callout warn"><code>docker system prune -a --volumes</code> removes <strong>every</strong> image not used by a running container, and <code>--volumes</code> removes unused volumes — which includes database volumes whose container happens to be stopped. That has destroyed production data. Use <code>docker image prune -a</code> and <code>docker builder prune</code> first; they reclaim most of the space and cannot touch a volume. Only add <code>--volumes</code> when you have confirmed with <code>docker volume ls</code> that nothing there matters.</div>

<h3>A clean-up order that is safe</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Measure</span><span class="lz-t">df -h · df -i · du --max-depth=1</span><span class="lz-d">Bytes or inodes? Which directory? Never delete before you know — the first guess is usually wrong.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Reclaim caches</span><span class="lz-t">apt clean · docker builder prune · journal vacuum</span><span class="lz-d">Zero risk: all of it regenerates. Often enough on its own, and it buys room to work.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Truncate logs</span><span class="lz-t">truncate -s 0, never rm</span><span class="lz-d">Frees space immediately without breaking the writing process. Then fix the rotation so it does not recur.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Prune images</span><span class="lz-t">docker image prune -a</span><span class="lz-d">Safe for data; costs a re-pull. Check nothing you need is only local and untagged first.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Old releases and backups</span><span class="lz-t">find /srv/releases -mtime +30 -delete</span><span class="lz-d">Print before deleting (Lesson 2.3). This is where a retention policy should have existed already.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Only then, data</span><span class="lz-t">and only with a backup you have verified</span><span class="lz-d">If it has come to this, add monitoring afterwards: a full disk should never be a surprise twice.</span></div>
</div>
<pre><code><span class="tok-comment"># A guard worth adding to any deploy script (Chapter 7)</span>
free_gb=\$(df --output=avail -BG / | tail -1 | tr -dc '0-9')
(( free_gb &gt;= 5 )) || die "only \${free_gb}GB free — refusing to deploy"</code></pre>
<div class="callout">That check exists because of a real failure mode: a build that runs out of space partway leaves a half-written image, a corrupted layer cache, or — worse — a database that could not flush. On 2026-08-18 this project hit exactly that: build cache had grown to 7.6 GB on the same disk as Postgres, a deploy died with <code>no space left on device</code> while <code>next build</code> was running, and the disk was down to 1.8 GB. Five lines of precondition would have turned an outage into a refusal.</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/du.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">du(1) and df(1)</span><span class="lc-sub">Including <code>--max-depth</code>, <code>-x</code>, <code>--apparent-size</code> and the <code>--output</code> columns that make <code>df</code> scriptable.</span></span>
</a>
<a class="link-card" href="https://dev.yorhel.nl/ncdu" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">ncdu — interactive disk usage</span><span class="lc-sub">Install it before you need it. The <code>-x</code> flag and the export/import mode for analysing a remote server's tree locally.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pruning/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — pruning unused objects</span><span class="lc-sub">Exactly what each prune command removes, and the warning about <code>--volumes</code>. Read it before running the one that deletes data.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reclaim the disk</span><span class="lc-sub">Four full-disk scenarios: a huge log, exhausted inodes, a deleted-but-open file, and a volume mounted over existing data. Diagnose each before deleting anything.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>rm</code> on a log file that a process has open. The disk stays exactly as full as it was — <code>df</code> does not move — because the data is only released when the last open handle closes (Lesson 2.4). Meanwhile the process keeps writing into a file with no name, so you have lost the log <em>and</em> the space. People then delete more things, which does not help either, and eventually reboot. <code>truncate -s 0 file</code> is the correct action: instant, keeps the inode, no restart, and the process never notices.</div>
<p class="note-ct"><strong>Run <code>df -h</code> and <code>df -i</code> together, always.</strong> One of the two failure modes in this lesson is invisible to the first command, and checking both takes one extra second. After that, <code>du --max-depth=1</code> down the biggest branch finds the cause in three or four steps — and if <code>du</code> and <code>df</code> disagree by more than a few percent, the answer is a deleted-but-open file and <code>lsof +L1</code> names it immediately.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Đĩa đầy</h2>
<p class="lead">Một cái đĩa đầy làm hỏng mọi thứ theo những kiểu trông giống hệt vấn đề khác: cơ sở dữ liệu từ chối ghi, một lần deploy hỏng giữa chừng, việc ghi log ngừng trong im lặng, và cái máy có thể còn không cho bạn đăng nhập. Bài này là cái trình tự tìm ra nguyên nhân trong khoảng một phút — kể cả hai trường hợp mà <code>df</code> nói với bạn rằng còn thừa chỗ trong khi thật ra thì không.</p>

<h3>df và du trả lời hai câu hỏi khác nhau</h3>
<pre><code>df -h                       <span class="tok-comment"># thứ HỆ THỐNG FILE báo cáo</span>
du -sh /var/log             <span class="tok-comment"># tổng kích thước các FILE trong một thư mục</span></code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        79G   75G  1.8G  98% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/vda15      105M  6.1M   99M   6% /boot/efi

2.3G    /var/log</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>df</code></span><span class="v">Hỏi hệ thống file xem bao nhiêu khối đang được cấp phát. Nhanh, có thẩm quyền, và tính cả phần chỗ bị những thứ bạn KHÔNG nhìn thấy trong danh sách thư mục chiếm giữ.</span></div>
  <div class="kv"><span class="k"><code>du</code></span><span class="v">Đi khắp một cây thư mục và cộng kích thước file lại. Chậm trên cây lớn, và nó chỉ đếm được những file nó <em>NHÌN THẤY</em>.</span></div>
</div>
<div class="callout"><strong>Khi hai cái bất đồng, chính phần chênh lệch mới là phần đáng quan tâm.</strong> <code>df</code> nói dùng 75 GB trong khi <code>du -sh /</code> cộng lại chỉ ra 40 GB nghĩa là 35 GB đang bị một thứ không hiện ra dưới dạng file chiếm giữ: một file đã xoá mà vẫn đang mở, một hệ thống file được gắn đè lên một thư mục vốn vẫn còn dữ liệu bên dưới, hoặc phần khối dự trữ. Cả ba đều xuất hiện bên dưới, và khoảng chênh chính là manh mối.</div>

<h3>Tìm ra những thư mục lớn</h3>
<pre><code>du -h --max-depth=1 / 2&gt;/dev/null | sort -h | tail -15</code></pre>
<div class="out">1.1G    /home
2.3G    /var
4.8G    /usr
66G     /var/lib/docker
75G     /</div>
<pre><code><span class="tok-comment"># Rồi lần xuống theo nhánh lớn nhất</span>
du -h --max-depth=1 /var/lib/docker | sort -h | tail
du -h --max-depth=1 /var/lib/docker/overlay2 | sort -h | tail -5

<span class="tok-comment"># 20 file đơn lẻ lớn nhất</span>
find / -xdev -type f -printf '%s\\t%p\\n' 2&gt;/dev/null \\
  | sort -rn | head -20 | numfmt --field=1 --to=iec</code></pre>
<div class="out">4.2G    /var/lib/docker/overlay2/8f2a.../diff/app/node_modules
2.1G    /var/log/journal/9c1b.../system.journal
1.8G    /var/log/nginx/access.log</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-x</code> / <code>-xdev</code></span><span class="v">Ở lại trên MỘT hệ thống file. Thiếu nó, <code>du /</code> đi cả vào các mount mạng và <code>/proc</code>, vừa chậm vừa cho ra những con số vô nghĩa.</span></div>
  <div class="kv"><span class="k"><code>sort -h</code></span><span class="v">Sắp xếp đúng những kích thước cho người đọc: <code>2.3G</code> đứng sau <code>900M</code>. <code>sort</code> trần thì đẩy <code>900M</code> xuống cuối (Bài 3.4).</span></div>
  <div class="kv"><span class="k"><code>2&gt;/dev/null</code></span><span class="v">Dập tiếng đám nhiễu permission-denied để phần output thật đọc được (Bài 3.1).</span></div>
</div>
<pre><code>sudo apt install ncdu
sudo ncdu -x /</code></pre>
<div class="callout ok"><code>ncdu</code> đáng được cài lên mọi máy chủ TRƯỚC khi bạn cần tới nó. Nó cho bạn một cây thư mục tương tác đã sắp xếp, đi lại bằng phím mũi tên, hiện phần chiếm của từng thư mục trong tổng số — nên tìm ra chỗ 40 GB đang gây chuyện chỉ tốn ba lần bấm phím thay vì năm lệnh <code>du</code>. Nhấn <code>d</code> để xoá ngay từ bên trong nó, dù trên một máy production thì đọc trước vẫn khôn ngoan hơn.</div>

<h3>Trường hợp một: hết inode, không phải hết byte</h3>
<pre><code>df -h /                     <span class="tok-comment"># dùng 42% — còn thừa chỗ</span>
df -i /                     <span class="tok-comment"># con số CÒN LẠI</span></code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        79G   33G   43G  42% /

Filesystem      Inodes  IUsed IFree IUse% Mounted on
/dev/vda1      5242880 5242880     0  100% /</div>
<p>Mỗi file và mỗi thư mục đều tiêu một inode (Bài 2.4), và một hệ thống file được tạo ra với một số inode CỐ ĐỊNH. Hàng triệu file tí hon — một thư mục phiên, một bộ đệm, thư chưa xoay vòng, mỗi lần deploy một <code>node_modules</code> — làm cạn bảng inode trong khi gần như không tốn chỗ. Triệu chứng là mọi lệnh ghi đều báo <code>No space left on device</code> trong khi <code>df -h</code> khăng khăng rằng còn 43 GB trống.</p>
<pre><code><span class="tok-comment"># Thư mục nào giữ nhiều FILE nhất (không phải nhiều byte nhất)</span>
sudo find / -xdev -type d -exec sh -c 'echo "\$(ls -A "\$1" 2&gt;/dev/null | wc -l) \$1"' _ {} \\; 2&gt;/dev/null \\
  | sort -rn | head -10</code></pre>
<div class="out">1841203 /var/spool/postfix/maildrop
  84210 /tmp
  41022 /var/lib/php/sessions</div>
<div class="callout warn">Hết inode thì KHÔNG chữa được bằng cách xoá vài file lớn — bạn phải xoá THẬT NHIỀU file, hoặc tạo lại hệ thống file với nhiều inode hơn. Đây cũng là trường hợp mà <code>df -h</code> chủ động gây hiểu nhầm, nên hãy đưa <code>df -i</code> vào phản xạ: mỗi khi một lệnh ghi hỏng với lỗi "no space" mà <code>df -h</code> trông vẫn ổn, hãy chạy <code>df -i</code> trước mọi thứ khác.</div>

<h3>Trường hợp hai: file đã xoá mà vẫn đang mở</h3>
<pre><code>df -h /                     <span class="tok-comment"># dùng 98%</span>
du -sh /* 2&gt;/dev/null | sort -h | tail -3   <span class="tok-comment"># cộng lại ra ít hơn nhiều</span>

sudo lsof +L1 2&gt;/dev/null | head</code></pre>
<div class="out">COMMAND   PID  USER  FD  TYPE  SIZE/OFF  NLINK  NODE NAME
nginx     812  root  8w  REG   32212254720  0  4021 /var/log/nginx/access.log (deleted)</div>
<p>Ai đó đã chạy <code>rm access.log</code> để giải phóng chỗ. CÁI TÊN thì mất rồi nên <code>du</code> không thấy nó — nhưng nginx vẫn đang giữ file đó mở, nên 30 GB kia vẫn đang được cấp phát (Bài 2.4: <code>unlink()</code> gỡ một CÁI TÊN, còn dữ liệu sống tiếp cho tới khi cái tên cuối cùng <em>VÀ</em> cái tay cầm cuối cùng cùng biến mất). Chỗ trống chỉ quay lại khi tiến trình đó đóng file hoặc thoát.</p>
<pre><code>sudo lsof +L1                              <span class="tok-comment"># NLINK 0 = đã xoá mà vẫn mở</span>
sudo ls -l /proc/*/fd/* 2&gt;/dev/null | grep deleted | head

<span class="tok-comment"># Cách chữa, xếp theo thứ tự ưu tiên</span>
sudo systemctl reload nginx                <span class="tok-comment"># nhiều daemon mở lại log khi được reload</span>
sudo kill -USR1 812                        <span class="tok-comment"># nginx: mở lại file log (Bài 5.3)</span>
sudo truncate -s 0 /proc/812/fd/8          <span class="tok-comment"># phương án cuối: làm rỗng nó qua chính cái fd</span></code></pre>
<div class="callout ok"><strong>Đừng bao giờ XOÁ một file log đang hoạt động — hãy CẮT TRẮNG nó.</strong> <code>sudo truncate -s 0 /var/log/nginx/access.log</code> giải phóng chỗ ngay lập tức, giữ nguyên inode, và tiến trình đang ghi cứ thế chạy tiếp mà không cần reload và không có khoảng đứt. <code>rm</code> lên một file log đang mở cho bạn cái tệ của cả hai phía: chỗ vẫn bị chiếm <em>VÀ</em> tiến trình vẫn ghi vào một file mà không ai đọc được. Tốt hơn nữa là để <code>logrotate</code> lo — Bài 10.3.</div>

<h3>Trường hợp ba: có thứ được gắn đè lên một thư mục đã có dữ liệu</h3>
<pre><code>df -h /var/lib/docker
mount | grep -E ' / | /var'
findmnt -t ext4,xfs,btrfs</code></pre>
<div class="out">/dev/vdb1  200G  12G  178G   7% /var/lib/docker</div>
<p>Nếu một hệ thống file được gắn tại <code>/var/lib/docker</code>, thì mọi thứ từng nằm trong thư mục đó <em>TRƯỚC</em> lần gắn vẫn còn nguyên trên hệ thống file gốc, vô hình và vẫn chiếm chỗ. <code>du</code> hiện ra nội dung của cái ổ đã gắn; <code>df /</code> thì tính cả phần dữ liệu ẩn bên dưới. Hãy tháo cái ổ ra rồi nhìn, hoặc đối chiếu <code>du -sh</code> với <code>df</code> cho đúng đường dẫn đó.</p>
<pre><code>lsblk                                <span class="tok-comment"># các thiết bị khối và điểm gắn của chúng</span>
findmnt                              <span class="tok-comment"># cây mount, dễ đọc</span>
cat /etc/fstab                       <span class="tok-comment"># cái gì được gắn lúc khởi động</span></code></pre>
<div class="out">NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
vda    252:0    0   80G  0 disk
├─vda1 252:1    0 78.9G  0 part /
└─vda15 252:15  0  106M  0 part /boot/efi
vdb    252:16   0  200G  0 disk
└─vdb1 252:17   0  200G  0 part /var/lib/docker</div>

<h3>Phần 5% dự trữ</h3>
<pre><code>sudo tune2fs -l /dev/vda1 | grep -i 'reserved block'</code></pre>
<div class="out">Reserved block count:     1024000
Reserved GDT blocks:      1024</div>
<p>ext4 mặc định dự trữ 5% hệ thống file cho root. Đó là lý do một người dùng thường nhận được "No space left on device" trong khi <code>df</code> hiện ra còn vài phần trăm trống, và là lý do root vẫn đăng nhập được để đi sửa chữa trên một cái đĩa "đã đầy" — mà đó chính là toàn bộ mục đích của phần dự trữ. Trên một ổ dữ liệu 200 GB thì đó là 10 GB để không mà chẳng được lợi gì; giảm nó ở đó là hợp lý, còn trên hệ thống file gốc thì là một ý tồi.</p>
<pre><code>sudo tune2fs -m 1 /dev/vdb1          <span class="tok-comment"># 5% → 1%, CHỈ trên ổ dữ liệu</span></code></pre>

<h3>Thứ gì thật sự làm đầy một máy chủ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Docker</span><span class="lz-lnote">Ảnh, container đã dừng, bộ đệm dựng mồ côi, ổ đĩa không dùng. Thường là kẻ tiêu thụ đơn lẻ lớn nhất. <code>docker system df</code> cho bảng phân tách.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log</span><span class="lz-lnote">Một file <code>access.log</code> chưa xoay vòng, hoặc một journal không đặt giới hạn kích thước. <code>journalctl --disk-usage</code> và <code>/var/log</code> (Bài 10.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ đệm gói</span><span class="lz-lnote"><code>/var/cache/apt/archives</code> giữ mọi file <code>.deb</code> từng tải về. <code>apt clean</code> (Bài 10.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhân cũ</span><span class="lz-lnote"><code>/boot</code> thì nhỏ và đầy lên chỉ với dăm cái nhân — rồi nó làm hỏng lần nâng cấp <em>KẾ TIẾP</em>. <code>apt autoremove</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Sao lưu và file tải lên</span><span class="lz-lnote">Một script sao lưu không có chính sách giữ lại, hay file người dùng tải lên không có vòng đời. Cả hai lớn lên mãi mãi theo đúng thiết kế, trừ khi có người dừng chúng lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệp phẩm của bản dựng</span><span class="lz-lnote">Mỗi bản phát hành một <code>node_modules</code>, rồi <code>target/</code>, <code>.next/</code>. Mỗi lần deploy một bộ thì cộng dồn rất nhanh nếu các bản cũ không bao giờ được tỉa.</span></div>
</div>
<pre><code>docker system df                     <span class="tok-comment"># ảnh / container / ổ đĩa / bộ đệm dựng</span>
docker system prune -a --volumes      <span class="tok-comment"># PHÁ HUỶ — đọc phần cảnh báo ngay dưới</span>
journalctl --disk-usage
sudo journalctl --vacuum-size=500M
sudo apt clean &amp;&amp; sudo apt autoremove --purge</code></pre>
<div class="callout warn"><code>docker system prune -a --volumes</code> gỡ bỏ <strong>MỌI</strong> ảnh không được một container đang chạy dùng tới, và <code>--volumes</code> gỡ luôn những ổ đĩa không dùng — trong đó có cả ổ đĩa cơ sở dữ liệu mà container của nó tình cờ đang dừng. Chuyện đó đã huỷ dữ liệu production. Hãy dùng <code>docker image prune -a</code> và <code>docker builder prune</code> trước; chúng thu về phần lớn chỗ trống và không thể đụng tới một ổ đĩa nào. Chỉ thêm <code>--volumes</code> khi bạn đã xác nhận bằng <code>docker volume ls</code> rằng ở đó chẳng có gì quan trọng.</div>

<h3>Một thứ tự dọn dẹp an toàn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đo</span><span class="lz-t">df -h · df -i · du --max-depth=1</span><span class="lz-d">Hết byte hay hết inode? Thư mục nào? Đừng bao giờ xoá trước khi biết — lần đoán đầu tiên thường sai.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Thu hồi bộ đệm</span><span class="lz-t">apt clean · docker builder prune · vacuum journal</span><span class="lz-d">Không rủi ro: tất cả đều tự sinh lại được. Thường là đủ, và nó mua cho bạn chỗ trống để xoay xở.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Cắt trắng log</span><span class="lz-t">truncate -s 0, đừng bao giờ rm</span><span class="lz-d">Giải phóng chỗ ngay mà không phá tiến trình đang ghi. Rồi hãy sửa phần xoay vòng để nó không tái diễn.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Tỉa ảnh</span><span class="lz-t">docker image prune -a</span><span class="lz-d">An toàn với dữ liệu; cái giá là phải kéo lại. Hãy kiểm trước rằng không có thứ gì bạn cần chỉ tồn tại ở máy này và không có tag.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Bản phát hành cũ và sao lưu</span><span class="lz-t">find /srv/releases -mtime +30 -delete</span><span class="lz-d">In ra trước khi xoá (Bài 2.3). Đây là chỗ lẽ ra đã phải có sẵn một chính sách giữ lại.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Chỉ tới lúc đó mới tới dữ liệu</span><span class="lz-t">và chỉ khi có một bản sao lưu bạn đã KIỂM CHỨNG</span><span class="lz-d">Nếu đã tới nước này thì hãy thêm giám sát sau đó: một cái đĩa đầy không bao giờ nên là bất ngờ tới lần thứ hai.</span></div>
</div>
<pre><code><span class="tok-comment"># Một chốt chặn đáng thêm vào mọi script deploy (Chương 7)</span>
free_gb=\$(df --output=avail -BG / | tail -1 | tr -dc '0-9')
(( free_gb &gt;= 5 )) || die "chỉ còn \${free_gb}GB trống — từ chối deploy"</code></pre>
<div class="callout">Phép kiểm đó tồn tại vì một kiểu hỏng có thật: một bản dựng hết chỗ giữa chừng để lại một ảnh ghi dở, một bộ đệm lớp bị hỏng, hoặc — tệ hơn — một cơ sở dữ liệu không xả được bộ đệm. Ngày 18/08/2026 chính dự án này dính đúng chuyện đó: bộ đệm dựng đã phình lên 7,6 GB trên cùng cái đĩa chứa Postgres, một lần deploy chết với <code>no space left on device</code> ngay lúc <code>next build</code> đang chạy, và đĩa tụt xuống còn 1,8 GB. Năm dòng điều kiện tiên quyết đã biến một sự cố thành một lời từ chối.</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/du.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">du(1) và df(1)</span><span class="lc-sub">Gồm cả <code>--max-depth</code>, <code>-x</code>, <code>--apparent-size</code> và các cột của <code>--output</code> giúp <code>df</code> dùng được trong script.</span></span>
</a>
<a class="link-card" href="https://dev.yorhel.nl/ncdu" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">ncdu — xem dung lượng theo lối tương tác</span><span class="lc-sub">Hãy cài nó trước khi cần tới. Có cờ <code>-x</code> và chế độ xuất/nhập để phân tích cây thư mục của một máy chủ ở xa ngay trên máy mình.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pruning/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — tỉa bỏ các đối tượng không dùng</span><span class="lc-sub">Chính xác từng lệnh prune gỡ bỏ những gì, và lời cảnh báo về <code>--volumes</code>. Hãy đọc trước khi chạy cái lệnh có thể xoá dữ liệu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đòi lại cái đĩa</span><span class="lc-sub">Bốn tình huống đĩa đầy: một file log khổng lồ, cạn inode, một file đã xoá mà vẫn mở, và một ổ đĩa gắn đè lên dữ liệu có sẵn. Hãy chẩn đoán từng cái TRƯỚC KHI xoá bất cứ thứ gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy <code>rm</code> lên một file log mà một tiến trình đang mở. Cái đĩa vẫn đầy y như cũ — <code>df</code> không nhúc nhích — vì dữ liệu chỉ được giải phóng khi cái tay cầm cuối cùng đóng lại (Bài 2.4). Trong khi đó tiến trình vẫn ghi tiếp vào một file không còn tên, nên bạn mất cả file log <em>LẪN</em> chỗ trống. Rồi người ta xoá thêm nhiều thứ nữa, cũng chẳng ăn thua, và cuối cùng khởi động lại máy. <code>truncate -s 0 file</code> mới là hành động đúng: tức thì, giữ nguyên inode, không cần restart, và tiến trình không hề hay biết.</div>
<p class="note-ct"><strong>Hãy chạy <code>df -h</code> và <code>df -i</code> cùng nhau, luôn luôn.</strong> Một trong hai kiểu hỏng của bài này là vô hình với lệnh đầu tiên, và kiểm cả hai chỉ tốn thêm một giây. Sau đó, <code>du --max-depth=1</code> lần xuống theo nhánh lớn nhất sẽ tìm ra nguyên nhân trong ba bốn bước — còn nếu <code>du</code> và <code>df</code> chênh nhau quá vài phần trăm thì câu trả lời là một file đã xoá mà vẫn mở, và <code>lsof +L1</code> gọi tên nó ngay lập tức.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Packages: apt, dnf, and what not to install globally|||10.2 — Gói phần mềm: apt, dnf, và thứ không nên cài toàn cục',
      slug: 'lnx-10-2-goi-phan-mem',
      type: 'LESSON',
      description: 'update khác upgrade ra sao, remove khác purge, giữ một gói lại, kho phần mềm và khoá GPG, dpkg khi apt bó tay, và vì sao sudo pip/npm -g là một sai lầm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Packages</h2>
<p class="lead">A package manager does three things: it knows what is available, it resolves dependencies, and it records what it installed so it can be removed cleanly. Everything that goes wrong with packages is a violation of the third property — usually because something was installed outside the package manager and it no longer knows the truth.</p>

<h3>update is not upgrade</h3>
<pre><code>sudo apt update              <span class="tok-comment"># refresh the CATALOGUE. Installs nothing.</span>
sudo apt upgrade             <span class="tok-comment"># install newer versions of what you have</span>
sudo apt full-upgrade        <span class="tok-comment"># …and allow removing packages to do it</span></code></pre>
<div class="out">Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
Fetched 126 kB in 1s (98.4 kB/s)
23 packages can be upgraded. Run 'apt list --upgradable' to see them.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>update</code></span><span class="v">Downloads the list of available versions. Nothing on your system changes. Always run it first — an <code>install</code> against a stale catalogue fetches a version that may no longer exist and fails with a 404.</span></div>
  <div class="kv"><span class="k"><code>upgrade</code></span><span class="v">Upgrades installed packages, but never removes one to satisfy a dependency. Safe and conservative.</span></div>
  <div class="kv"><span class="k"><code>full-upgrade</code></span><span class="v">Will remove packages if that is what the upgrade needs. Required across a distribution release; think before running it on a production box.</span></div>
</div>
<pre><code>apt list --upgradable                 <span class="tok-comment"># what would change</span>
apt-get -s upgrade                    <span class="tok-comment"># -s: simulate, change nothing</span>
apt changelog nginx                   <span class="tok-comment"># why it changed</span></code></pre>
<div class="callout ok">Two conventions worth knowing. <strong><code>apt</code> is for humans</strong> — colours, progress bars, and an interface that may change between releases. <strong><code>apt-get</code> is for scripts</strong> — a stable interface the maintainers promise not to break, which is why every Dockerfile uses it. In a script, also add <code>DEBIAN_FRONTEND=noninteractive</code> so a package that wants to ask a question fails instead of hanging forever waiting for input nobody will provide.</div>

<h3>Installing and removing</h3>
<pre><code>sudo apt install nginx
sudo apt install nginx=1.24.0-2ubuntu7   <span class="tok-comment"># a specific version</span>
sudo apt install --no-install-recommends nginx   <span class="tok-comment"># skip optional extras</span>
sudo apt install -y --no-install-recommends nginx curl jq

sudo apt remove nginx        <span class="tok-comment"># binaries go, CONFIG STAYS</span>
sudo apt purge nginx         <span class="tok-comment"># binaries and system config both go</span>
sudo apt autoremove --purge  <span class="tok-comment"># dependencies nothing needs any more</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>remove</code></span><span class="v">Keeps <code>/etc</code> configuration. Reinstalling later restores your settings — which is what you want when troubleshooting.</span></div>
  <div class="kv"><span class="k"><code>purge</code></span><span class="v">Deletes system configuration too. Use when a broken config is the problem, or when you genuinely want a clean slate.</span></div>
  <div class="kv"><span class="k"><code>autoremove</code></span><span class="v">Removes automatically-installed dependencies that nothing needs now. This is also what clears out old kernels from a full <code>/boot</code>.</span></div>
</div>
<div class="callout warn">Neither <code>remove</code> nor <code>purge</code> touches <strong>data</strong>. Purging <code>postgresql</code> leaves <code>/var/lib/postgresql</code> intact — deliberately, because deleting a database during a package operation would be indefensible. That is good news when you did not mean it and a surprise when you were trying to reclaim disk space. Data directories are yours to remove, explicitly, after taking a backup.</div>

<h3>Finding things</h3>
<pre><code>apt search nginx             <span class="tok-comment"># search names and descriptions</span>
apt show nginx               <span class="tok-comment"># version, size, dependencies, description</span>
apt policy nginx             <span class="tok-comment"># installed vs available, and from which repo</span>
apt list --installed | wc -l
dpkg -l | grep nginx         <span class="tok-comment"># the low-level installed list</span>

dpkg -L nginx-common         <span class="tok-comment"># every FILE this package installed</span>
dpkg -S /usr/sbin/nginx      <span class="tok-comment"># which package owns this FILE</span>
apt-file search bin/htpasswd <span class="tok-comment"># which package WOULD provide it (apt install apt-file)</span></code></pre>
<div class="out">nginx:
  Installed: 1.24.0-2ubuntu7
  Candidate: 1.24.0-2ubuntu7.3
  Version table:
     1.24.0-2ubuntu7.3 500
        500 http://archive.ubuntu.com/ubuntu noble-updates/main amd64 Packages
 *** 1.24.0-2ubuntu7 100
        100 /var/lib/dpkg/status</div>
<div class="callout ok"><code>apt policy</code> is the command that answers "why is it installing that version". It lists every repository offering the package with a priority number, and the one with the highest priority wins. When a machine keeps installing an old version despite a newer one existing, or pulls from an unexpected third-party repo, this output shows exactly why in five lines.</div>

<h3>Pinning a version</h3>
<pre><code>sudo apt-mark hold nginx     <span class="tok-comment"># do not upgrade this one</span>
sudo apt-mark unhold nginx
apt-mark showhold</code></pre>
<div class="out">nginx
docker-ce</div>
<div class="callout warn">A hold is a promise to yourself that you will revisit it. Held packages stop receiving <strong>security updates</strong>, and unattended-upgrades skips them silently — so a hold placed to work around a bug in March is still there in December, quietly accumulating vulnerabilities. Record why in a comment or a ticket, and check <code>apt-mark showhold</code> whenever you audit a server.</div>

<h3>Third-party repositories and keys</h3>
<pre><code><span class="tok-comment"># The modern, correct way: a keyring file plus a signed-by line</span>
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>signed-by=</code></span><span class="v">Scopes the key to <em>this repository only</em>. Without it, a compromised third-party key could sign a fake <code>openssh-server</code> and apt would accept it.</span></div>
  <div class="kv"><span class="k"><code>apt-key add</code></span><span class="v"><strong>Deprecated and removed.</strong> It added keys to a global trust store with exactly the problem above. Any tutorial still using it is out of date.</span></div>
  <div class="kv"><span class="k"><code>add-apt-repository ppa:…</code></span><span class="v">Fine for Ubuntu PPAs — it handles the keyring correctly. Remember a PPA is a stranger's build server with root-equivalent trust on your machine.</span></div>
</div>
<pre><code>ls /etc/apt/sources.list.d/          <span class="tok-comment"># which third parties this machine trusts</span>
grep -r '^deb' /etc/apt/sources.list /etc/apt/sources.list.d/</code></pre>
<div class="callout">Running that on a server you inherit is a two-second audit worth doing. Every line is a party that can install software as root on the next <code>apt upgrade</code>. A repository added years ago for one tool, whose domain has since changed hands, is a real supply-chain risk — and it is also the usual cause of <code>apt update</code> failing with a signature error nobody can explain.</div>

<h3>When apt gets stuck</h3>
<pre><code><span class="tok-comment"># "Could not get lock /var/lib/dpkg/lock-frontend"</span>
sudo fuser -v /var/lib/dpkg/lock-frontend      <span class="tok-comment"># WHO holds it</span>
ps aux | grep -E 'apt|dpkg|unattended'</code></pre>
<div class="out">                     USER   PID ACCESS COMMAND
/var/lib/dpkg/lock-frontend:
                     root  1842 F.... unattended-upgr</div>
<p>Almost always the answer is <code>unattended-upgrades</code> doing its job in the background. Wait for it. Deleting the lock file while another process holds it is how a package database gets corrupted — and the corruption surfaces days later as an upgrade that cannot proceed.</p>
<pre><code><span class="tok-comment"># A genuinely interrupted install (power cut, OOM kill)</span>
sudo dpkg --configure -a          <span class="tok-comment"># finish what was half-done</span>
sudo apt --fix-broken install     <span class="tok-comment"># resolve missing dependencies</span>
sudo apt clean &amp;&amp; sudo apt update <span class="tok-comment"># clear a corrupted cache</span></code></pre>
<div class="callout warn"><strong>Never delete <code>/var/lib/dpkg/lock*</code> to "fix" a lock error unless you have confirmed no apt or dpkg process is running.</strong> The lock exists precisely to stop two package operations from interleaving, and removing it mid-operation leaves the package database inconsistent — half-configured packages, files claimed by nothing, and an <code>apt</code> that refuses to do anything until someone repairs it by hand. <code>fuser</code> first; wait; then, if the process really is dead, remove the lock.</div>

<h3>Unattended upgrades</h3>
<pre><code>sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
cat /etc/apt/apt.conf.d/50unattended-upgrades | grep -v '^//' | grep -v '^\$'
sudo unattended-upgrade --dry-run --debug</code></pre>
<div class="callout ok">Security updates applied automatically are, for most servers, clearly better than security updates applied never. The default configuration installs only from the <code>-security</code> pocket and does not reboot — a reasonable balance. Enable <code>Unattended-Upgrade::Remove-Unused-Kernel-Packages</code> as well, or <code>/boot</code> will fill and the next kernel upgrade will fail at the worst moment.</div>

<h3>dnf, briefly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>apt update</code></span><span class="v"><code>dnf check-update</code> — dnf usually refreshes metadata automatically.</span></div>
  <div class="kv"><span class="k"><code>apt upgrade</code></span><span class="v"><code>dnf upgrade</code></span></div>
  <div class="kv"><span class="k"><code>apt install X</code></span><span class="v"><code>dnf install X</code></span></div>
  <div class="kv"><span class="k"><code>apt purge X</code></span><span class="v"><code>dnf remove X</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -S file</code></span><span class="v"><code>rpm -qf file</code> · <code>dnf provides /path/to/file</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -L pkg</code></span><span class="v"><code>rpm -ql pkg</code></span></div>
</div>
<p>dnf has one feature apt lacks and it is a good one: <code>dnf history</code> lists every transaction, and <code>dnf history undo &lt;id&gt;</code> reverses it. On Debian and Ubuntu the nearest equivalent is reading <code>/var/log/apt/history.log</code> and undoing it by hand.</p>

<h3>What not to install globally</h3>
<pre><code>sudo npm install -g typescript        <span class="tok-comment"># DON'T</span>
sudo pip install requests             <span class="tok-comment"># DON'T</span>
sudo gem install rails                <span class="tok-comment"># DON'T</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It writes where the package manager owns</span><span class="lz-lnote">Files appear in <code>/usr/lib/python3</code> or <code>/usr/lib/node_modules</code> that <code>dpkg</code> does not know about. A later system upgrade overwrites or conflicts with them, and the error message points nowhere useful.</span></div>
  <div class="lz-layer"><span class="lz-lname">It runs install hooks as root</span><span class="lz-lnote">npm and pip packages execute code at install time. <code>sudo</code> hands an arbitrary package from the internet full control of your machine — a supply-chain risk you took on for convenience.</span></div>
  <div class="lz-layer"><span class="lz-lname">Modern Python refuses outright</span><span class="lz-lnote">PEP 668: <code>error: externally-managed-environment</code>. The distribution is telling you that <code>/usr/lib/python3</code> belongs to <code>apt</code>. Use a virtualenv or <code>pipx</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Do this instead</span>
python3 -m venv .venv &amp;&amp; . .venv/bin/activate &amp;&amp; pip install requests
pipx install black                    <span class="tok-comment"># CLI tools, each isolated</span>

npm install -D typescript             <span class="tok-comment"># per project, in package.json</span>
npm config set prefix ~/.npm-global   <span class="tok-comment"># if you truly want a user-global tool</span>
export PATH="\$HOME/.npm-global/bin:\$PATH"</code></pre>
<div class="callout ok">The principle behind all of this: <strong>one directory, one owner.</strong> <code>apt</code> owns <code>/usr</code>; <code>/usr/local</code> is for things you install manually; <code>~/.local</code> is yours; and a project's dependencies belong inside the project. Mixing them produces the class of failure where an upgrade breaks a tool that was working, and nothing in the error mentions the actual cause.</div>

<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/en/man8/apt.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">apt(8) and apt-get(8)</span><span class="lc-sub">Including the note that <code>apt</code>'s interface is not stable for scripts, and the full list of what <code>full-upgrade</code> may do.</span></span>
</a>
<a class="link-card" href="https://wiki.debian.org/DebianRepository/UseThirdParty" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Debian — using third-party repositories safely</span><span class="lc-sub">Why <code>apt-key</code> was removed and how <code>signed-by</code> scopes trust to one repository. The canonical explanation.</span></span>
</a>
<a class="link-card" href="https://peps.python.org/pep-0668/" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">PEP 668 — externally managed environments</span><span class="lc-sub">The reasoning behind the error you get from <code>sudo pip install</code>, and the sanctioned alternatives.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: manage packages properly</span><span class="lc-sub">Graded tasks: find which package owns a file, add a third-party repo with <code>signed-by</code>, diagnose a dpkg lock, and reclaim space from the package cache.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>apt install</code> without <code>apt update</code> first, in a Dockerfile. The image layer caches the package list from whenever the image was last built, so a later build tries to fetch a version that has since been superseded and fails with a 404 — a build that worked yesterday and fails today with no code change. The fix is the standard one-liner: <code>apt-get update &amp;&amp; apt-get install -y --no-install-recommends … &amp;&amp; rm -rf /var/lib/apt/lists/*</code>, all in a <em>single</em> <code>RUN</code> so the update and the install share a layer and the cache does not ship in the image.</div>
<p class="note-ct"><strong>Two rules carry most of this lesson.</strong> Let the package manager own what it installed — never write into <code>/usr</code> by hand, and never <code>sudo pip</code> or <code>sudo npm -g</code>, because the resulting breakage appears months later with an error that names the wrong thing. And know your third-party repositories: <code>ls /etc/apt/sources.list.d/</code> lists every party that can install software as root on your machine, and on a server you inherited, that list deserves reading.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Gói phần mềm</h2>
<p class="lead">Một trình quản lý gói làm ba việc: nó biết cái gì đang có sẵn, nó giải quyết các thứ phụ thuộc, và nó GHI LẠI thứ nó đã cài để sau này gỡ ra cho sạch. Mọi chuyện hỏng hóc liên quan tới gói đều là sự vi phạm tính chất thứ ba — thường là vì có thứ gì đó được cài NGOÀI trình quản lý gói và nó không còn biết sự thật nữa.</p>

<h3>update không phải upgrade</h3>
<pre><code>sudo apt update              <span class="tok-comment"># làm mới DANH MỤC. Không cài gì cả.</span>
sudo apt upgrade             <span class="tok-comment"># cài bản mới hơn cho những gì bạn đang có</span>
sudo apt full-upgrade        <span class="tok-comment"># …và cho phép GỠ gói nếu cần để làm được việc đó</span></code></pre>
<div class="out">Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
Fetched 126 kB in 1s (98.4 kB/s)
23 packages can be upgraded. Run 'apt list --upgradable' to see them.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>update</code></span><span class="v">Tải về danh sách các phiên bản đang có. Không có gì trên hệ thống bạn thay đổi. Hãy luôn chạy nó trước — một lệnh <code>install</code> dựa trên danh mục cũ sẽ đi lấy một phiên bản có thể đã không còn tồn tại và hỏng với mã 404.</span></div>
  <div class="kv"><span class="k"><code>upgrade</code></span><span class="v">Nâng cấp các gói đã cài, nhưng không bao giờ GỠ một gói nào để thoả một thứ phụ thuộc. An toàn và thận trọng.</span></div>
  <div class="kv"><span class="k"><code>full-upgrade</code></span><span class="v">SẼ gỡ gói nếu việc nâng cấp cần thế. Bắt buộc khi đi qua một bản phát hành mới của bản phân phối; hãy nghĩ kỹ trước khi chạy nó trên một máy production.</span></div>
</div>
<pre><code>apt list --upgradable                 <span class="tok-comment"># cái gì sẽ đổi</span>
apt-get -s upgrade                    <span class="tok-comment"># -s: mô phỏng, không đổi gì</span>
apt changelog nginx                   <span class="tok-comment"># vì sao nó đổi</span></code></pre>
<div class="callout ok">Hai quy ước đáng biết. <strong><code>apt</code> dành cho CON NGƯỜI</strong> — có màu, có thanh tiến độ, và một giao diện có thể thay đổi giữa các bản phát hành. <strong><code>apt-get</code> dành cho SCRIPT</strong> — một giao diện ổn định mà những người bảo trì cam kết không phá vỡ, và đó là lý do mọi Dockerfile đều dùng nó. Trong script, hãy thêm cả <code>DEBIAN_FRONTEND=noninteractive</code> để một gói muốn hỏi câu gì đó sẽ HỎNG thay vì treo mãi mãi chờ một câu trả lời mà chẳng ai đưa.</div>

<h3>Cài và gỡ</h3>
<pre><code>sudo apt install nginx
sudo apt install nginx=1.24.0-2ubuntu7   <span class="tok-comment"># một phiên bản cụ thể</span>
sudo apt install --no-install-recommends nginx   <span class="tok-comment"># bỏ qua phần kèm thêm tuỳ chọn</span>
sudo apt install -y --no-install-recommends nginx curl jq

sudo apt remove nginx        <span class="tok-comment"># chương trình đi, CẤU HÌNH Ở LẠI</span>
sudo apt purge nginx         <span class="tok-comment"># cả chương trình lẫn cấu hình hệ thống cùng đi</span>
sudo apt autoremove --purge  <span class="tok-comment"># những thứ phụ thuộc mà giờ chẳng ai cần nữa</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>remove</code></span><span class="v">Giữ lại cấu hình trong <code>/etc</code>. Cài lại sau đó thì thiết lập của bạn quay về — và đó là thứ bạn muốn khi đang gỡ rối.</span></div>
  <div class="kv"><span class="k"><code>purge</code></span><span class="v">Xoá cả cấu hình hệ thống. Dùng khi chính cấu hình hỏng mới là vấn đề, hoặc khi bạn thật sự muốn làm lại từ đầu.</span></div>
  <div class="kv"><span class="k"><code>autoremove</code></span><span class="v">Gỡ những thứ phụ thuộc được cài tự động mà giờ không ai cần. Đây cũng là thứ dọn sạch những nhân cũ khỏi một <code>/boot</code> đã đầy.</span></div>
</div>
<div class="callout warn">Cả <code>remove</code> lẫn <code>purge</code> đều KHÔNG đụng tới <strong>DỮ LIỆU</strong>. Purge <code>postgresql</code> vẫn để nguyên <code>/var/lib/postgresql</code> — một cách có chủ ý, vì xoá một cơ sở dữ liệu trong lúc thao tác gói là điều không thể biện hộ. Đó là tin tốt khi bạn không cố ý, và là điều bất ngờ khi bạn đang cố đòi lại chỗ trống trên đĩa. Thư mục dữ liệu là của bạn, và phải do bạn xoá một cách tường minh, sau khi đã sao lưu.</div>

<h3>Tìm mọi thứ</h3>
<pre><code>apt search nginx             <span class="tok-comment"># tìm trong tên và mô tả</span>
apt show nginx               <span class="tok-comment"># phiên bản, kích thước, phụ thuộc, mô tả</span>
apt policy nginx             <span class="tok-comment"># đã cài với đang có, và từ kho nào</span>
apt list --installed | wc -l
dpkg -l | grep nginx         <span class="tok-comment"># danh sách đã cài ở mức thấp</span>

dpkg -L nginx-common         <span class="tok-comment"># mọi FILE mà gói này đã cài ra</span>
dpkg -S /usr/sbin/nginx      <span class="tok-comment"># gói nào sở hữu FILE này</span>
apt-file search bin/htpasswd <span class="tok-comment"># gói nào SẼ cung cấp nó (apt install apt-file)</span></code></pre>
<div class="out">nginx:
  Installed: 1.24.0-2ubuntu7
  Candidate: 1.24.0-2ubuntu7.3
  Version table:
     1.24.0-2ubuntu7.3 500
        500 http://archive.ubuntu.com/ubuntu noble-updates/main amd64 Packages
 *** 1.24.0-2ubuntu7 100
        100 /var/lib/dpkg/status</div>
<div class="callout ok"><code>apt policy</code> là cái lệnh trả lời câu "vì sao nó lại cài đúng cái phiên bản đó". Nó liệt kê mọi kho có cung cấp gói đó kèm một con số ưu tiên, và cái có ưu tiên cao nhất thắng. Khi một cái máy cứ cài mãi một phiên bản cũ dù đã có bản mới hơn, hoặc kéo về từ một kho bên thứ ba không ngờ tới, output này cho thấy chính xác vì sao chỉ trong năm dòng.</div>

<h3>Ghim một phiên bản</h3>
<pre><code>sudo apt-mark hold nginx     <span class="tok-comment"># đừng nâng cấp cái này</span>
sudo apt-mark unhold nginx
apt-mark showhold</code></pre>
<div class="out">nginx
docker-ce</div>
<div class="callout warn">Một lệnh giữ (hold) là một lời hứa với chính mình rằng bạn sẽ quay lại xem xét nó. Gói bị giữ thì THÔI NHẬN <strong>bản vá an ninh</strong>, và unattended-upgrades bỏ qua chúng trong im lặng — nên một lệnh giữ đặt ra hồi tháng Ba để né một cái lỗi thì tới tháng Mười Hai vẫn còn đó, lặng lẽ tích luỹ lỗ hổng. Hãy ghi lý do vào một dòng chú thích hay một cái ticket, và hãy kiểm <code>apt-mark showhold</code> mỗi lần bạn rà soát một máy chủ.</div>

<h3>Kho của bên thứ ba và khoá GPG</h3>
<pre><code><span class="tok-comment"># Cách đời mới và đúng: một file keyring cộng với một dòng signed-by</span>
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>signed-by=</code></span><span class="v">Giới hạn cái khoá đó vào <em>ĐÚNG KHO NÀY</em>. Không có nó, một khoá bên thứ ba bị chiếm có thể ký một gói <code>openssh-server</code> giả và apt sẽ chấp nhận.</span></div>
  <div class="kv"><span class="k"><code>apt-key add</code></span><span class="v"><strong>Đã khai tử và đã gỡ bỏ.</strong> Nó thêm khoá vào một kho tin cậy TOÀN CỤC với đúng cái vấn đề ở trên. Mọi bài hướng dẫn còn dùng nó là đã lỗi thời.</span></div>
  <div class="kv"><span class="k"><code>add-apt-repository ppa:…</code></span><span class="v">Ổn với PPA của Ubuntu — nó xử lý phần keyring cho đúng. Hãy nhớ một PPA là máy chủ dựng của một người lạ, mang mức tin cậy ngang root trên máy bạn.</span></div>
</div>
<pre><code>ls /etc/apt/sources.list.d/          <span class="tok-comment"># máy này đang tin những bên thứ ba nào</span>
grep -r '^deb' /etc/apt/sources.list /etc/apt/sources.list.d/</code></pre>
<div class="callout">Chạy dòng đó trên một máy chủ bạn tiếp quản là một phép rà soát hai giây rất đáng làm. Mỗi dòng là một bên có thể cài phần mềm với quyền root ở lần <code>apt upgrade</code> kế tiếp. Một cái kho thêm vào từ nhiều năm trước cho một công cụ nào đó, mà tên miền của nó từ đó đã đổi chủ, là một rủi ro chuỗi cung ứng có thật — và nó cũng là nguyên nhân thường gặp của việc <code>apt update</code> hỏng với một lỗi chữ ký mà chẳng ai giải thích nổi.</div>

<h3>Khi apt bị kẹt</h3>
<pre><code><span class="tok-comment"># "Could not get lock /var/lib/dpkg/lock-frontend"</span>
sudo fuser -v /var/lib/dpkg/lock-frontend      <span class="tok-comment"># AI đang giữ nó</span>
ps aux | grep -E 'apt|dpkg|unattended'</code></pre>
<div class="out">                     USER   PID ACCESS COMMAND
/var/lib/dpkg/lock-frontend:
                     root  1842 F.... unattended-upgr</div>
<p>Gần như luôn luôn, câu trả lời là <code>unattended-upgrades</code> đang làm việc của nó ở dưới nền. Hãy chờ nó. Xoá file khoá trong lúc một tiến trình khác đang giữ nó chính là cách làm hỏng cơ sở dữ liệu gói — và chỗ hỏng đó lộ ra vài ngày sau dưới dạng một lần nâng cấp không tài nào chạy được.</p>
<pre><code><span class="tok-comment"># Một lần cài THẬT SỰ bị ngắt giữa chừng (mất điện, bị OOM giết)</span>
sudo dpkg --configure -a          <span class="tok-comment"># hoàn tất phần làm dở</span>
sudo apt --fix-broken install     <span class="tok-comment"># giải quyết các thứ phụ thuộc còn thiếu</span>
sudo apt clean &amp;&amp; sudo apt update <span class="tok-comment"># xoá một bộ đệm đã hỏng</span></code></pre>
<div class="callout warn"><strong>Đừng bao giờ xoá <code>/var/lib/dpkg/lock*</code> để "chữa" một lỗi khoá, trừ khi bạn đã xác nhận là không có tiến trình apt hay dpkg nào đang chạy.</strong> Cái khoá tồn tại chính là để ngăn hai thao tác gói xen kẽ vào nhau, và gỡ nó ra giữa chừng để lại một cơ sở dữ liệu gói không nhất quán — những gói cấu hình dở, những file chẳng thuộc về đâu, và một <code>apt</code> từ chối làm bất cứ việc gì cho tới khi có người sửa tay. <code>fuser</code> trước; chờ; rồi, nếu tiến trình đó thật sự đã chết, mới gỡ khoá.</div>

<h3>Nâng cấp không cần trông</h3>
<pre><code>sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
cat /etc/apt/apt.conf.d/50unattended-upgrades | grep -v '^//' | grep -v '^\$'
sudo unattended-upgrade --dry-run --debug</code></pre>
<div class="callout ok">Bản vá an ninh được áp dụng TỰ ĐỘNG, với phần lớn máy chủ, rõ ràng tốt hơn bản vá an ninh KHÔNG BAO GIỜ được áp dụng. Cấu hình mặc định chỉ cài từ kho <code>-security</code> và không khởi động lại máy — một sự cân bằng hợp lý. Hãy bật thêm <code>Unattended-Upgrade::Remove-Unused-Kernel-Packages</code>, không thì <code>/boot</code> sẽ đầy và lần nâng cấp nhân kế tiếp sẽ hỏng vào đúng lúc tệ nhất.</div>

<h3>dnf, nói ngắn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>apt update</code></span><span class="v"><code>dnf check-update</code> — dnf thường tự làm mới siêu dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>apt upgrade</code></span><span class="v"><code>dnf upgrade</code></span></div>
  <div class="kv"><span class="k"><code>apt install X</code></span><span class="v"><code>dnf install X</code></span></div>
  <div class="kv"><span class="k"><code>apt purge X</code></span><span class="v"><code>dnf remove X</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -S file</code></span><span class="v"><code>rpm -qf file</code> · <code>dnf provides /đường/dẫn</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -L pkg</code></span><span class="v"><code>rpm -ql pkg</code></span></div>
</div>
<p>dnf có một tính năng mà apt không có, và đó là một tính năng tốt: <code>dnf history</code> liệt kê mọi giao dịch, còn <code>dnf history undo &lt;id&gt;</code> đảo ngược nó. Trên Debian và Ubuntu thì thứ gần nhất là đọc <code>/var/log/apt/history.log</code> rồi tự tay hoàn tác.</p>

<h3>Thứ không nên cài toàn cục</h3>
<pre><code>sudo npm install -g typescript        <span class="tok-comment"># ĐỪNG</span>
sudo pip install requests             <span class="tok-comment"># ĐỪNG</span>
sudo gem install rails                <span class="tok-comment"># ĐỪNG</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó ghi vào chỗ mà trình quản lý gói sở hữu</span><span class="lz-lnote">Những file xuất hiện trong <code>/usr/lib/python3</code> hay <code>/usr/lib/node_modules</code> mà <code>dpkg</code> không hề biết tới. Một lần nâng cấp hệ thống sau đó ghi đè lên chúng hoặc xung đột với chúng, và thông báo lỗi thì chỉ vào chỗ chẳng hữu ích gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó chạy các móc cài đặt với quyền root</span><span class="lz-lnote">Các gói npm và pip THỰC THI mã lúc cài. <code>sudo</code> trao cho một gói tuỳ ý lấy từ internet toàn quyền trên máy bạn — một rủi ro chuỗi cung ứng bạn nhận lấy để đổi lấy sự tiện lợi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Python đời mới từ chối thẳng</span><span class="lz-lnote">PEP 668: <code>error: externally-managed-environment</code>. Bản phân phối đang nói với bạn rằng <code>/usr/lib/python3</code> thuộc về <code>apt</code>. Hãy dùng virtualenv hoặc <code>pipx</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Hãy làm thế này thay vào</span>
python3 -m venv .venv &amp;&amp; . .venv/bin/activate &amp;&amp; pip install requests
pipx install black                    <span class="tok-comment"># công cụ dòng lệnh, mỗi cái một chỗ riêng</span>

npm install -D typescript             <span class="tok-comment"># theo từng dự án, ghi vào package.json</span>
npm config set prefix ~/.npm-global   <span class="tok-comment"># nếu bạn thật sự muốn một công cụ toàn cục cho người dùng</span>
export PATH="\$HOME/.npm-global/bin:\$PATH"</code></pre>
<div class="callout ok">Nguyên tắc đằng sau tất cả những điều trên: <strong>một thư mục, một người sở hữu.</strong> <code>apt</code> sở hữu <code>/usr</code>; <code>/usr/local</code> dành cho những thứ bạn tự tay cài; <code>~/.local</code> là của bạn; và các thứ phụ thuộc của một dự án thì thuộc về bên trong dự án đó. Trộn chúng lại sinh ra đúng cái lớp hỏng hóc mà một lần nâng cấp làm vỡ một công cụ vốn đang chạy tốt, và chẳng có gì trong thông báo lỗi nhắc tới nguyên nhân thật.</div>

<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/en/man8/apt.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">apt(8) và apt-get(8)</span><span class="lc-sub">Gồm cả ghi chú rằng giao diện của <code>apt</code> KHÔNG ổn định để dùng trong script, và danh sách đầy đủ những gì <code>full-upgrade</code> có thể làm.</span></span>
</a>
<a class="link-card" href="https://wiki.debian.org/DebianRepository/UseThirdParty" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Debian — dùng kho bên thứ ba một cách an toàn</span><span class="lc-sub">Vì sao <code>apt-key</code> bị gỡ bỏ và <code>signed-by</code> giới hạn sự tin cậy vào một kho ra sao. Lời giải thích chuẩn mực.</span></span>
</a>
<a class="link-card" href="https://peps.python.org/pep-0668/" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">PEP 668 — môi trường do bên ngoài quản lý</span><span class="lc-sub">Lý lẽ đằng sau cái lỗi bạn nhận được từ <code>sudo pip install</code>, và những phương án được chấp thuận.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: quản lý gói cho tử tế</span><span class="lc-sub">Bài chấm điểm: tìm gói nào sở hữu một file, thêm một kho bên thứ ba bằng <code>signed-by</code>, chẩn đoán một lỗi khoá dpkg, và đòi lại chỗ trống từ bộ đệm gói.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy <code>apt install</code> mà không <code>apt update</code> trước, trong một Dockerfile. Lớp ảnh lưu tạm danh sách gói từ lần dựng ảnh gần nhất, nên một lần dựng sau đó đi lấy một phiên bản từ lúc ấy đã bị thay thế và hỏng với mã 404 — một bản dựng hôm qua chạy được và hôm nay thì hỏng mà chẳng có thay đổi mã nào. Cách chữa là dòng lệnh chuẩn mực: <code>apt-get update &amp;&amp; apt-get install -y --no-install-recommends … &amp;&amp; rm -rf /var/lib/apt/lists/*</code>, tất cả trong MỘT lệnh <code>RUN</code> duy nhất để phần update và phần install dùng chung một lớp và bộ đệm không đi theo vào trong ảnh.</div>
<p class="note-ct"><strong>Hai quy tắc gánh phần lớn bài này.</strong> Hãy để trình quản lý gói sở hữu thứ nó đã cài — đừng bao giờ tự tay ghi vào <code>/usr</code>, và đừng bao giờ <code>sudo pip</code> hay <code>sudo npm -g</code>, vì chỗ hỏng do đó gây ra sẽ hiện ra sau nhiều tháng với một thông báo lỗi gọi tên nhầm thủ phạm. Và hãy biết rõ những kho bên thứ ba của mình: <code>ls /etc/apt/sources.list.d/</code> liệt kê mọi bên có thể cài phần mềm với quyền root lên máy bạn, và trên một máy chủ bạn vừa tiếp quản thì cái danh sách ấy đáng để đọc.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Logs: journalctl, /var/log and rotation|||10.3 — Log: journalctl, /var/log và việc xoay vòng',
      slug: 'lnx-10-3-log-journalctl',
      type: 'LESSON',
      description: 'journalctl với đủ bộ lọc để tìm ra thứ cần tìm, log dạng file cũ ở /var/log, logrotate và vì sao copytruncate tồn tại, giữ journal khỏi ăn hết đĩa, và cách đọc log lúc đang có sự cố.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Logs</h2>
<p class="lead">When something breaks, the log already contains the answer — the difficulty is that it also contains four hundred thousand other lines. This lesson is about filtering: by service, by time, by priority, and by following along live. Get those four right and reading logs stops being archaeology.</p>

<h3>Two systems, side by side</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">journald</span><span class="lz-lnote">A structured binary store, indexed and queryable. Everything systemd starts logs here automatically — anything a service writes to stdout or stderr is captured. Read with <code>journalctl</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Plain files in /var/log</span><span class="lz-lnote">What applications write themselves: <code>nginx/access.log</code>, <code>mysql/error.log</code>, your own app. Read with <code>less</code>, <code>tail</code>, <code>grep</code> (Chapter 3). Rotated by <code>logrotate</code>.</span></div>
</div>
<pre><code>ls /var/log/</code></pre>
<div class="out">auth.log      dpkg.log     journal/     nginx/       syslog
auth.log.1    dpkg.log.1   kern.log     postgresql/  syslog.1
auth.log.2.gz              kern.log.1                syslog.2.gz</div>
<p>Note the pattern: <code>auth.log</code> is current, <code>.1</code> is yesterday's, <code>.2.gz</code> and older are compressed. That is <code>logrotate</code>, and it means <code>grep</code> alone misses history — use <code>zgrep</code> (Lesson 3.4) to search the compressed ones too.</p>

<h3>journalctl: the filters that matter</h3>
<pre><code>journalctl -u nginx                    <span class="tok-comment"># one unit</span>
journalctl -u nginx -f                 <span class="tok-comment"># follow, like tail -f</span>
journalctl -u nginx -n 50              <span class="tok-comment"># last 50 lines</span>
journalctl -u nginx --since today
journalctl -u nginx --since '10 min ago'
journalctl --since '2026-08-22 14:00' --until '2026-08-22 15:00'
journalctl -p err                      <span class="tok-comment"># errors and worse</span>
journalctl -p warning..err             <span class="tok-comment"># a priority RANGE</span>
journalctl -k                          <span class="tok-comment"># kernel messages only (= dmesg)</span>
journalctl -b                          <span class="tok-comment"># since this boot</span>
journalctl -b -1                       <span class="tok-comment"># the PREVIOUS boot — after a crash</span>
journalctl -u myapp -o json-pretty | head -40</code></pre>
<div class="out">Aug 22 14:12:03 vps systemd[1]: Started myapp.service.
Aug 22 14:12:04 vps myapp[5012]: listening on 127.0.0.1:3000
Aug 22 14:31:11 vps myapp[5012]: ERROR connection refused (db:5432)</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-u UNIT</code></span><span class="v">The single most useful flag. Without it you are reading everything on the machine.</span></div>
  <div class="kv"><span class="k"><code>--since</code> / <code>--until</code></span><span class="v">Accepts natural language: <code>today</code>, <code>yesterday</code>, <code>'2 hours ago'</code>, <code>'09:00'</code>. Bounding the window is what makes a large journal usable.</span></div>
  <div class="kv"><span class="k"><code>-p</code></span><span class="v">Priority: <code>emerg</code> 0, <code>alert</code>, <code>crit</code>, <code>err</code>, <code>warning</code>, <code>notice</code>, <code>info</code>, <code>debug</code> 7. <code>-p err</code> means "err and above" — the fastest triage there is.</span></div>
  <div class="kv"><span class="k"><code>-b -1</code></span><span class="v">The previous boot. After an unexplained reboot, this is where the reason is — the current boot's log starts <em>after</em> whatever happened.</span></div>
  <div class="kv"><span class="k"><code>-o</code></span><span class="v">Output format: <code>short</code>, <code>json</code>, <code>json-pretty</code>, <code>cat</code> (message only), <code>verbose</code> (every field). <code>cat</code> is good for piping into other tools.</span></div>
</div>
<pre><code><span class="tok-comment"># Combine freely — filters are ANDed</span>
journalctl -u myapp -p err --since '1 hour ago' -o cat
journalctl -u myapp --since today | grep -c ERROR
journalctl -u myapp -f | grep --line-buffered ERROR     <span class="tok-comment"># Lesson 3.2!</span></code></pre>
<div class="callout ok">That last line needs <code>--line-buffered</code> for exactly the reason in Lesson 3.2: <code>grep</code> writing into a pipe switches to block buffering, so a live-following filter appears to hang for minutes and then emits everything at once. It is the same trap, and it bites hardest here — during an incident, when a monitoring pipeline that shows nothing looks identical to no errors.</div>

<h3>Beyond units: other selectors</h3>
<pre><code>journalctl _PID=5012                   <span class="tok-comment"># one process</span>
journalctl _UID=1001                   <span class="tok-comment"># one user</span>
journalctl /usr/sbin/nginx             <span class="tok-comment"># one executable</span>
journalctl _SYSTEMD_UNIT=ssh.service _PID=743   <span class="tok-comment"># several fields, ANDed</span>
journalctl -u nginx + -u postgresql    <span class="tok-comment"># the + is OR</span>
journalctl -F _SYSTEMD_UNIT | head     <span class="tok-comment"># what units exist in the journal</span></code></pre>
<p>Because the journal is structured rather than plain text, every line carries fields — the unit, the PID, the UID, the executable, the boot ID. <code>-o verbose</code> shows them all, and any of them can be a filter. This is the real advantage over text logs: you can ask "everything this PID logged" without a regex that also matches the PID appearing inside a message.</p>

<h3>Keeping the journal from eating the disk</h3>
<pre><code>journalctl --disk-usage</code></pre>
<div class="out">Archived and active journals take up 2.1G in the file system.</div>
<pre><code>sudo journalctl --vacuum-size=500M     <span class="tok-comment"># trim to 500 MB now</span>
sudo journalctl --vacuum-time=14d      <span class="tok-comment"># drop anything older than 14 days</span>

<span class="tok-comment"># /etc/systemd/journald.conf.d/size.conf — the permanent fix</span>
[Journal]
SystemMaxUse=500M
SystemMaxFileSize=50M
MaxRetentionSec=1month</code></pre>
<pre><code>sudo systemctl restart systemd-journald</code></pre>
<div class="callout warn">By default journald uses up to <strong>10% of the filesystem</strong> — 8 GB on an 80 GB disk. That is fine until it shares a disk with a database, at which point the journal quietly grows into the space Postgres needed. Set <code>SystemMaxUse</code> explicitly on every server; it takes four lines and it removes a whole class of 3am disk-full incident (Lesson 10.1).</div>
<pre><code><span class="tok-comment"># Is the journal even persistent?</span>
ls -d /var/log/journal 2&gt;/dev/null || echo "volatile — logs are lost on reboot"</code></pre>
<p>If <code>/var/log/journal</code> does not exist, journald keeps everything in <code>/run</code> — memory — and the entire log history disappears on reboot. That is the default in many container images and on some minimal installs, and it is a nasty surprise when you reboot to fix something and then cannot investigate what happened. <code>sudo mkdir -p /var/log/journal &amp;&amp; sudo systemctl restart systemd-journald</code> makes it persistent.</p>

<h3>logrotate: for the file-based logs</h3>
<pre><code>cat /etc/logrotate.d/nginx</code></pre>
<div class="out">/var/log/nginx/*.log {
        daily
        missingok
        rotate 14
        compress
        delaycompress
        notifempty
        create 0640 www-data adm
        sharedscripts
        postrotate
                [ -f /run/nginx.pid ] &amp;&amp; kill -USR1 &#96;cat /run/nginx.pid&#96;
        endscript
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>daily</code> · <code>size 100M</code></span><span class="v">When to rotate: by schedule, or by size. <code>size</code> is safer for a log that can spike.</span></div>
  <div class="kv"><span class="k"><code>rotate 14</code></span><span class="v">How many old files to keep. This is your retention policy, and the number that decides how much disk logs may consume.</span></div>
  <div class="kv"><span class="k"><code>compress</code> · <code>delaycompress</code></span><span class="v">gzip old files; delay by one cycle so a process still writing to the just-rotated file is not confused.</span></div>
  <div class="kv"><span class="k"><code>postrotate</code></span><span class="v">Tell the process to reopen its log — here <code>kill -USR1</code>, exactly the signal from Lesson 5.3. Without this the process keeps writing to the renamed file (Lesson 10.1's deleted-but-open problem).</span></div>
  <div class="kv"><span class="k"><code>copytruncate</code></span><span class="v">For programs that cannot be told to reopen: copy the file, then truncate the original in place. Simpler, but lines written during the copy are lost.</span></div>
</div>
<pre><code>sudo logrotate -d /etc/logrotate.d/nginx     <span class="tok-comment"># -d: debug, changes nothing</span>
sudo logrotate -f /etc/logrotate.d/nginx     <span class="tok-comment"># -f: force a rotation now</span>
cat /var/lib/logrotate/status | grep nginx   <span class="tok-comment"># when it last rotated</span></code></pre>
<div class="callout ok">The <code>postrotate</code> versus <code>copytruncate</code> choice is the whole design problem of log rotation. Renaming a file the process has open does not disturb it — it keeps writing into the same inode, now called <code>access.log.1</code>, and the new <code>access.log</code> stays empty forever. <code>postrotate</code> solves it properly by asking the process to reopen; <code>copytruncate</code> avoids the question at the cost of a small race. When your own application's logs stop appearing after a rotation, this is why — and the fix is to handle <code>SIGUSR1</code> or <code>SIGHUP</code>, or to log to stdout and let journald handle it.</div>

<h3>Writing to the log from a script</h3>
<pre><code>logger "deploy started"                        <span class="tok-comment"># goes to the journal</span>
logger -t deploy -p user.info "release v1.4"
logger -t deploy -p user.err "rollback triggered"

journalctl -t deploy --since today</code></pre>
<div class="out">Aug 22 16:02:11 vps deploy[6120]: release v1.4
Aug 22 16:09:44 vps deploy[6188]: rollback triggered</div>
<p>A cron job or deploy script that uses <code>logger</code> ends up in the same timeline as everything else, so you can correlate "the deploy ran at 16:02" with "nginx started erroring at 16:03" without cross-referencing two files. It costs one command and it is far better than a stray log file nobody rotates.</p>

<h3>Reading logs during an incident</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bound the time</span><span class="lz-t">--since '30 min ago'</span><span class="lz-d">Never read from the beginning. Start from just before the symptom and widen only if needed.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Raise the priority floor</span><span class="lz-t">-p err</span><span class="lz-d">Errors first. If there are none, the failure may not be an error at all — a restart loop, an OOM kill, a config reload.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Widen to the whole machine</span><span class="lz-t">journalctl --since '30 min ago' -p warning</span><span class="lz-d">Drop the -u. The cause is often a DIFFERENT service — the database, the disk, the kernel.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Check the kernel</span><span class="lz-t">journalctl -k --since '30 min ago'</span><span class="lz-d">OOM kills, I/O errors, filesystems remounted read-only. None of these appear in an application's own log.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Read AROUND the first error</span><span class="lz-t">the ten lines before it</span><span class="lz-d">The first error is usually a symptom. What the service was doing immediately before is usually the cause.</span></div>
</div>
<pre><code><span class="tok-comment"># The four commands, as one paste-able block</span>
journalctl -u myapp --since '30 min ago' -p err -o cat
journalctl --since '30 min ago' -p warning | tail -50
journalctl -k --since '30 min ago' | grep -iE 'oom|error|remount'
journalctl -u myapp --since '30 min ago' | grep -B10 -m1 ERROR</code></pre>
<div class="out">[Fri Aug 22 03:14:52 2026] Out of memory: Killed process 5012 (node)
[Fri Aug 22 03:14:52 2026] oom_reaper: reaped process 5012 (node)</div>
<div class="callout warn">That kernel line is the answer to the most confusing incident there is: <strong>a service whose own log simply stops mid-sentence, with no error.</strong> The application did not crash — it was killed (Lesson 5.2), so it had no chance to log anything. Step 4 finds in one second what step 1 can never find, and skipping it is why people spend an hour reading application logs that contain nothing because there was nothing to write.</div>

<h3>What to look at where</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Failed logins, sudo</span><span class="v"><code>journalctl -u ssh</code> · <code>/var/log/auth.log</code> — who got in, who tried, what was run with sudo (Lesson 4.4).</span></div>
  <div class="kv"><span class="k">Package changes</span><span class="v"><code>/var/log/apt/history.log</code> — exactly what was installed or upgraded, and when. The first thing to check when "it worked yesterday".</span></div>
  <div class="kv"><span class="k">Kernel, hardware, OOM</span><span class="v"><code>journalctl -k</code> or <code>dmesg -T</code>. Disk errors and read-only remounts show up here and nowhere else.</span></div>
  <div class="kv"><span class="k">Boot problems</span><span class="v"><code>journalctl -b -1 -p err</code> plus <code>systemd-analyze blame</code> for what was slow.</span></div>
  <div class="kv"><span class="k">Web traffic</span><span class="v"><code>/var/log/nginx/access.log</code> — and Chapter 3's pipeline: <code>awk '{print \$1}' … | sort | uniq -c | sort -rn | head</code>.</span></div>
</div>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journalctl.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">journalctl(1)</span><span class="lc-sub">Every filter, every output format, and the full list of journal fields you can match on. The EXAMPLES section is genuinely good.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journald.conf.html" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">journald.conf(5)</span><span class="lc-sub"><code>SystemMaxUse</code>, <code>Storage</code>, retention and rate limiting — the settings that decide whether the journal fills your disk.</span></span>
</a>
<a class="link-card" href="https://linux.die.net/man/8/logrotate" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Every directive, and the precise difference between <code>postrotate</code> and <code>copytruncate</code> including the race the latter accepts.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find it in the journal</span><span class="lc-sub">Graded tasks: locate an OOM kill, correlate a deploy with an error spike, bound a query by time and priority, and write a logrotate config that does not lose lines.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> a journal that is volatile, discovered after the reboot. If <code>/var/log/journal</code> does not exist, journald stores everything in memory and the whole history is gone the moment the machine restarts — so the standard incident response of "reboot it, then investigate" destroys the evidence. This is the default in many container images and some minimal installs. Check for the directory on every server you inherit, create it if missing, and remember that on a machine where logs are volatile you must copy the journal out (<code>journalctl -b &gt; /tmp/boot.log</code>) <em>before</em> restarting anything.</div>
<p class="note-ct"><strong>Two habits.</strong> Always bound a journal query by time and priority before anything else — <code>-u UNIT --since '30 min ago' -p err</code> turns an unusable stream into a readable page. And when an application's log stops with no error, go straight to <code>journalctl -k</code>: the kernel logs the OOM kills, the disk errors and the read-only remounts that the application was never alive to report.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Log</h2>
<p class="lead">Khi có gì đó hỏng, file log ĐÃ chứa sẵn câu trả lời — cái khó là nó cũng chứa thêm bốn trăm nghìn dòng khác. Bài này nói về việc LỌC: theo dịch vụ, theo thời gian, theo mức ưu tiên, và theo dõi trực tiếp. Làm đúng bốn thứ đó thì việc đọc log thôi giống công việc khảo cổ.</p>

<h3>Hai hệ thống, đặt cạnh nhau</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">journald</span><span class="lz-lnote">Một kho nhị phân CÓ CẤU TRÚC, được đánh chỉ mục và truy vấn được. Mọi thứ systemd khởi động đều tự động ghi log vào đây — bất cứ thứ gì một dịch vụ ghi ra stdout hay stderr đều được hứng lại. Đọc bằng <code>journalctl</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">File thường trong /var/log</span><span class="lz-lnote">Thứ do chính ứng dụng tự ghi: <code>nginx/access.log</code>, <code>mysql/error.log</code>, ứng dụng của bạn. Đọc bằng <code>less</code>, <code>tail</code>, <code>grep</code> (Chương 3). Do <code>logrotate</code> xoay vòng.</span></div>
</div>
<pre><code>ls /var/log/</code></pre>
<div class="out">auth.log      dpkg.log     journal/     nginx/       syslog
auth.log.1    dpkg.log.1   kern.log     postgresql/  syslog.1
auth.log.2.gz              kern.log.1                syslog.2.gz</div>
<p>Hãy để ý cái khuôn mẫu: <code>auth.log</code> là bản hiện tại, <code>.1</code> là của hôm qua, còn <code>.2.gz</code> trở đi thì đã nén. Đó là <code>logrotate</code>, và nó nghĩa là chỉ dùng mỗi <code>grep</code> thì bỏ sót lịch sử — hãy dùng <code>zgrep</code> (Bài 3.4) để tìm cả trong những file đã nén.</p>

<h3>journalctl: những bộ lọc có ý nghĩa</h3>
<pre><code>journalctl -u nginx                    <span class="tok-comment"># một unit</span>
journalctl -u nginx -f                 <span class="tok-comment"># theo dõi, như tail -f</span>
journalctl -u nginx -n 50              <span class="tok-comment"># 50 dòng cuối</span>
journalctl -u nginx --since today
journalctl -u nginx --since '10 min ago'
journalctl --since '2026-08-22 14:00' --until '2026-08-22 15:00'
journalctl -p err                      <span class="tok-comment"># lỗi trở lên</span>
journalctl -p warning..err             <span class="tok-comment"># một KHOẢNG mức ưu tiên</span>
journalctl -k                          <span class="tok-comment"># chỉ thông điệp của nhân (= dmesg)</span>
journalctl -b                          <span class="tok-comment"># kể từ lần khởi động này</span>
journalctl -b -1                       <span class="tok-comment"># lần khởi động TRƯỚC — sau một lần sập</span>
journalctl -u myapp -o json-pretty | head -40</code></pre>
<div class="out">Aug 22 14:12:03 vps systemd[1]: Started myapp.service.
Aug 22 14:12:04 vps myapp[5012]: listening on 127.0.0.1:3000
Aug 22 14:31:11 vps myapp[5012]: ERROR connection refused (db:5432)</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-u UNIT</code></span><span class="v">Cái cờ hữu ích nhất. Thiếu nó thì bạn đang đọc MỌI THỨ trên cái máy.</span></div>
  <div class="kv"><span class="k"><code>--since</code> / <code>--until</code></span><span class="v">Nhận cả ngôn ngữ tự nhiên: <code>today</code>, <code>yesterday</code>, <code>'2 hours ago'</code>, <code>'09:00'</code>. Giới hạn cửa sổ thời gian chính là thứ làm một cái journal khổng lồ trở nên dùng được.</span></div>
  <div class="kv"><span class="k"><code>-p</code></span><span class="v">Mức ưu tiên: <code>emerg</code> 0, <code>alert</code>, <code>crit</code>, <code>err</code>, <code>warning</code>, <code>notice</code>, <code>info</code>, <code>debug</code> 7. <code>-p err</code> nghĩa là "err trở lên" — cách phân loại nhanh nhất từng có.</span></div>
  <div class="kv"><span class="k"><code>-b -1</code></span><span class="v">Lần khởi động trước. Sau một lần khởi động lại không rõ lý do, đây là chỗ chứa nguyên nhân — log của lần khởi động HIỆN TẠI bắt đầu <em>SAU</em> khi chuyện đó đã xảy ra.</span></div>
  <div class="kv"><span class="k"><code>-o</code></span><span class="v">Định dạng đầu ra: <code>short</code>, <code>json</code>, <code>json-pretty</code>, <code>cat</code> (chỉ thông điệp), <code>verbose</code> (mọi trường). <code>cat</code> tiện để đưa qua ống vào công cụ khác.</span></div>
</div>
<pre><code><span class="tok-comment"># Ghép thoải mái — các bộ lọc nối với nhau bằng VÀ</span>
journalctl -u myapp -p err --since '1 hour ago' -o cat
journalctl -u myapp --since today | grep -c ERROR
journalctl -u myapp -f | grep --line-buffered ERROR     <span class="tok-comment"># Bài 3.2!</span></code></pre>
<div class="callout ok">Dòng cuối cần <code>--line-buffered</code> đúng vì lý do ở Bài 3.2: <code>grep</code> ghi vào một cái ống sẽ chuyển sang đệm theo khối, nên một bộ lọc theo dõi trực tiếp trông như treo suốt mấy phút rồi mới phun ra tất cả cùng lúc. Vẫn là cái bẫy đó, và nó cắn đau nhất ở đây — ngay giữa lúc có sự cố, khi một chuỗi giám sát chẳng hiện gì trông y hệt như là không có lỗi nào.</div>

<h3>Ngoài unit: những bộ chọn khác</h3>
<pre><code>journalctl _PID=5012                   <span class="tok-comment"># một tiến trình</span>
journalctl _UID=1001                   <span class="tok-comment"># một người dùng</span>
journalctl /usr/sbin/nginx             <span class="tok-comment"># một chương trình</span>
journalctl _SYSTEMD_UNIT=ssh.service _PID=743   <span class="tok-comment"># nhiều trường, nối bằng VÀ</span>
journalctl -u nginx + -u postgresql    <span class="tok-comment"># dấu + là HOẶC</span>
journalctl -F _SYSTEMD_UNIT | head     <span class="tok-comment"># journal đang có những unit nào</span></code></pre>
<p>Vì journal có CẤU TRÚC chứ không phải văn bản thuần, mỗi dòng đều mang theo các trường — unit, PID, UID, chương trình, mã lần khởi động. <code>-o verbose</code> hiện ra tất cả, và bất kỳ trường nào cũng làm bộ lọc được. Đây mới là lợi thế thật so với log dạng văn bản: bạn hỏi được "mọi thứ mà PID này đã ghi" mà không cần một cái regex vốn cũng sẽ khớp trúng cái PID xuất hiện bên trong một thông điệp.</p>

<h3>Giữ journal khỏi ăn hết đĩa</h3>
<pre><code>journalctl --disk-usage</code></pre>
<div class="out">Archived and active journals take up 2.1G in the file system.</div>
<pre><code>sudo journalctl --vacuum-size=500M     <span class="tok-comment"># cắt xuống 500 MB ngay</span>
sudo journalctl --vacuum-time=14d      <span class="tok-comment"># bỏ mọi thứ cũ hơn 14 ngày</span>

<span class="tok-comment"># /etc/systemd/journald.conf.d/size.conf — cách chữa lâu dài</span>
[Journal]
SystemMaxUse=500M
SystemMaxFileSize=50M
MaxRetentionSec=1month</code></pre>
<pre><code>sudo systemctl restart systemd-journald</code></pre>
<div class="callout warn">Mặc định journald dùng tới <strong>10% hệ thống file</strong> — tức 8 GB trên một cái đĩa 80 GB. Chuyện đó không sao cho tới khi nó dùng chung đĩa với một cơ sở dữ liệu, và lúc ấy cái journal lặng lẽ phình vào đúng phần chỗ mà Postgres cần. Hãy đặt <code>SystemMaxUse</code> một cách tường minh trên mọi máy chủ; nó tốn bốn dòng và gỡ bỏ cả một lớp sự cố đĩa-đầy lúc 3 giờ sáng (Bài 10.1).</div>
<pre><code><span class="tok-comment"># Journal có được lưu lâu dài không đã?</span>
ls -d /var/log/journal 2&gt;/dev/null || echo "chỉ trong bộ nhớ — log mất khi khởi động lại"</code></pre>
<p>Nếu <code>/var/log/journal</code> không tồn tại, journald giữ mọi thứ trong <code>/run</code> — tức bộ nhớ — và toàn bộ lịch sử log biến mất khi khởi động lại. Đó là mặc định trong nhiều ảnh container và trên vài bản cài tối giản, và nó là một bất ngờ khó chịu khi bạn khởi động lại để chữa một thứ gì đó rồi sau đó không điều tra được chuyện đã xảy ra. Lệnh <code>sudo mkdir -p /var/log/journal &amp;&amp; sudo systemctl restart systemd-journald</code> làm nó lưu lâu dài.</p>

<h3>logrotate: cho những file log dạng file</h3>
<pre><code>cat /etc/logrotate.d/nginx</code></pre>
<div class="out">/var/log/nginx/*.log {
        daily
        missingok
        rotate 14
        compress
        delaycompress
        notifempty
        create 0640 www-data adm
        sharedscripts
        postrotate
                [ -f /run/nginx.pid ] &amp;&amp; kill -USR1 &#96;cat /run/nginx.pid&#96;
        endscript
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>daily</code> · <code>size 100M</code></span><span class="v">Khi nào xoay vòng: theo lịch, hay theo kích thước. <code>size</code> an toàn hơn với một file log có thể vọt lên đột ngột.</span></div>
  <div class="kv"><span class="k"><code>rotate 14</code></span><span class="v">Giữ lại bao nhiêu file cũ. Đây chính là chính sách lưu trữ của bạn, và là con số quyết định log được phép ăn bao nhiêu đĩa.</span></div>
  <div class="kv"><span class="k"><code>compress</code> · <code>delaycompress</code></span><span class="v">gzip những file cũ; hoãn lại một chu kỳ để một tiến trình vẫn đang ghi vào file vừa xoay không bị rối.</span></div>
  <div class="kv"><span class="k"><code>postrotate</code></span><span class="v">Bảo tiến trình MỞ LẠI file log của nó — ở đây là <code>kill -USR1</code>, đúng cái tín hiệu ở Bài 5.3. Không có nó, tiến trình cứ ghi tiếp vào file đã đổi tên (chính là vấn đề đã-xoá-mà-vẫn-mở ở Bài 10.1).</span></div>
  <div class="kv"><span class="k"><code>copytruncate</code></span><span class="v">Dành cho chương trình không bảo được là hãy mở lại: chép file ra, rồi cắt trắng bản gốc tại chỗ. Đơn giản hơn, nhưng những dòng ghi ra trong lúc đang chép thì mất.</span></div>
</div>
<pre><code>sudo logrotate -d /etc/logrotate.d/nginx     <span class="tok-comment"># -d: gỡ lỗi, không đổi gì</span>
sudo logrotate -f /etc/logrotate.d/nginx     <span class="tok-comment"># -f: ép xoay vòng ngay</span>
cat /var/lib/logrotate/status | grep nginx   <span class="tok-comment"># lần xoay vòng gần nhất là khi nào</span></code></pre>
<div class="callout ok">Lựa chọn giữa <code>postrotate</code> và <code>copytruncate</code> chính là toàn bộ bài toán thiết kế của việc xoay vòng log. Đổi tên một file mà tiến trình đang mở thì KHÔNG làm nó bận tâm — nó cứ ghi tiếp vào đúng cái inode đó, nay mang tên <code>access.log.1</code>, còn file <code>access.log</code> mới thì rỗng mãi mãi. <code>postrotate</code> giải quyết chuyện đó cho tử tế bằng cách YÊU CẦU tiến trình mở lại; <code>copytruncate</code> né hẳn câu hỏi với cái giá là một tình huống tranh chấp nhỏ. Khi log của chính ứng dụng bạn thôi xuất hiện sau một lần xoay vòng, lý do là đây — và cách chữa là xử lý <code>SIGUSR1</code> hoặc <code>SIGHUP</code>, hoặc ghi ra stdout rồi để journald lo.</div>

<h3>Ghi vào log từ một script</h3>
<pre><code>logger "bắt đầu deploy"                        <span class="tok-comment"># đi thẳng vào journal</span>
logger -t deploy -p user.info "phát hành v1.4"
logger -t deploy -p user.err "đã kích hoạt quay lui"

journalctl -t deploy --since today</code></pre>
<div class="out">Aug 22 16:02:11 vps deploy[6120]: phát hành v1.4
Aug 22 16:09:44 vps deploy[6188]: đã kích hoạt quay lui</div>
<p>Một công việc cron hay một script deploy dùng <code>logger</code> sẽ nằm trên cùng một dòng thời gian với mọi thứ khác, nên bạn đối chiếu được "lần deploy chạy lúc 16:02" với "nginx bắt đầu báo lỗi lúc 16:03" mà không phải tra chéo hai file. Nó tốn một lệnh và tốt hơn hẳn một file log lạc chỗ mà chẳng ai xoay vòng.</p>

<h3>Đọc log khi đang có sự cố</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Chặn khung thời gian</span><span class="lz-t">--since '30 min ago'</span><span class="lz-d">Đừng bao giờ đọc từ đầu. Hãy bắt đầu từ ngay trước triệu chứng và chỉ mở rộng ra khi cần.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nâng sàn ưu tiên</span><span class="lz-t">-p err</span><span class="lz-d">Lỗi trước đã. Nếu không có lỗi nào thì chỗ hỏng có thể hoàn toàn không phải một lỗi — một vòng lặp khởi động lại, một lần bị OOM giết, một lần nạp lại cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Mở rộng ra cả máy</span><span class="lz-t">journalctl --since '30 min ago' -p warning</span><span class="lz-d">Bỏ cờ -u đi. Nguyên nhân thường nằm ở một dịch vụ KHÁC — cơ sở dữ liệu, cái đĩa, cái nhân.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm phần nhân</span><span class="lz-t">journalctl -k --since '30 min ago'</span><span class="lz-d">OOM giết, lỗi I/O, hệ thống file bị gắn lại ở chế độ chỉ-đọc. Không cái nào xuất hiện trong log của chính ứng dụng.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Đọc QUANH cái lỗi đầu tiên</span><span class="lz-t">mười dòng ngay trước nó</span><span class="lz-d">Lỗi đầu tiên thường là TRIỆU CHỨNG. Thứ dịch vụ đang làm ngay trước đó thường mới là NGUYÊN NHÂN.</span></div>
</div>
<pre><code><span class="tok-comment"># Bốn lệnh, gói thành một khối dán được</span>
journalctl -u myapp --since '30 min ago' -p err -o cat
journalctl --since '30 min ago' -p warning | tail -50
journalctl -k --since '30 min ago' | grep -iE 'oom|error|remount'
journalctl -u myapp --since '30 min ago' | grep -B10 -m1 ERROR</code></pre>
<div class="out">[Fri Aug 22 03:14:52 2026] Out of memory: Killed process 5012 (node)
[Fri Aug 22 03:14:52 2026] oom_reaper: reaped process 5012 (node)</div>
<div class="callout warn">Dòng của nhân đó chính là câu trả lời cho loại sự cố khó hiểu nhất từng có: <strong>một dịch vụ mà log của chính nó đơn giản là dừng lại giữa câu, không có lỗi nào.</strong> Ứng dụng KHÔNG sập — nó bị GIẾT (Bài 5.2), nên nó chẳng có cơ hội nào để ghi lại gì. Bước 4 tìm ra trong một giây cái mà bước 1 không bao giờ tìm được, và bỏ qua nó chính là lý do người ta ngồi cả tiếng đọc log ứng dụng vốn chẳng chứa gì, bởi vì có gì đâu mà ghi.</div>

<h3>Nhìn vào đâu để tìm gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đăng nhập hỏng, sudo</span><span class="v"><code>journalctl -u ssh</code> · <code>/var/log/auth.log</code> — ai vào được, ai đã thử, ai chạy gì bằng sudo (Bài 4.4).</span></div>
  <div class="kv"><span class="k">Thay đổi về gói</span><span class="v"><code>/var/log/apt/history.log</code> — chính xác cái gì đã được cài hay nâng cấp, và lúc nào. Thứ đầu tiên cần kiểm khi "hôm qua nó vẫn chạy".</span></div>
  <div class="kv"><span class="k">Nhân, phần cứng, OOM</span><span class="v"><code>journalctl -k</code> hoặc <code>dmesg -T</code>. Lỗi đĩa và những lần gắn lại ở chế độ chỉ-đọc hiện ra ở đây và không ở đâu khác.</span></div>
  <div class="kv"><span class="k">Vấn đề lúc khởi động</span><span class="v"><code>journalctl -b -1 -p err</code> cộng với <code>systemd-analyze blame</code> để biết cái gì chậm.</span></div>
  <div class="kv"><span class="k">Lưu lượng web</span><span class="v"><code>/var/log/nginx/access.log</code> — và cái chuỗi ống ở Chương 3: <code>awk '{print \$1}' … | sort | uniq -c | sort -rn | head</code>.</span></div>
</div>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journalctl.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">journalctl(1)</span><span class="lc-sub">Mọi bộ lọc, mọi định dạng đầu ra, và danh sách đầy đủ các trường của journal mà bạn khớp được. Mục EXAMPLES thật sự tốt.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journald.conf.html" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">journald.conf(5)</span><span class="lc-sub"><code>SystemMaxUse</code>, <code>Storage</code>, thời gian giữ và giới hạn tần suất — những thiết lập quyết định journal có làm đầy đĩa của bạn hay không.</span></span>
</a>
<a class="link-card" href="https://linux.die.net/man/8/logrotate" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Mọi chỉ thị, và khác biệt chính xác giữa <code>postrotate</code> với <code>copytruncate</code>, gồm cả tình huống tranh chấp mà cái sau chấp nhận.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm cho ra trong journal</span><span class="lc-sub">Bài chấm điểm: định vị một lần bị OOM giết, đối chiếu một lần deploy với một đợt lỗi tăng vọt, chặn khung truy vấn theo thời gian và mức ưu tiên, và viết một cấu hình logrotate không làm mất dòng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một cái journal chỉ nằm trong bộ nhớ, và bạn phát hiện ra điều đó SAU khi đã khởi động lại. Nếu <code>/var/log/journal</code> không tồn tại, journald lưu mọi thứ trong bộ nhớ và toàn bộ lịch sử biến mất ngay khoảnh khắc máy khởi động lại — nên cái phản ứng sự cố tiêu chuẩn "khởi động lại đi rồi điều tra sau" chính là thứ huỷ mất bằng chứng. Đây là mặc định trong nhiều ảnh container và vài bản cài tối giản. Hãy kiểm cái thư mục đó trên mọi máy chủ bạn tiếp quản, tạo nó nếu chưa có, và nhớ rằng trên một cái máy mà log chỉ nằm trong bộ nhớ thì bạn phải chép journal ra ngoài (<code>journalctl -b &gt; /tmp/boot.log</code>) <em>TRƯỚC KHI</em> khởi động lại bất cứ thứ gì.</div>
<p class="note-ct"><strong>Hai thói quen.</strong> Hãy luôn chặn một truy vấn journal theo thời gian và mức ưu tiên trước mọi thứ khác — <code>-u UNIT --since '30 min ago' -p err</code> biến một dòng chảy không dùng nổi thành một trang đọc được. Và khi log của một ứng dụng dừng lại mà không có lỗi nào, hãy đi thẳng tới <code>journalctl -k</code>: nhân mới là nơi ghi lại những lần OOM giết, những lỗi đĩa và những lần gắn lại chỉ-đọc mà ứng dụng thì đã không còn sống để mà báo cáo.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.4 Quiz ─────────────────────────── */
    {
      title: '10.4 — Chapter 10 quiz|||10.4 — Kiểm tra Chương 10',
      slug: 'lnx-10-4-quiz',
      type: 'QUIZ',
      description: 'Tám câu về df với du, hết inode, file đã xoá mà vẫn mở, apt update với upgrade, remove với purge, sudo pip, journal chỉ nằm trong bộ nhớ, và postrotate.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on disk space, packages and logs. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: why <code>rm</code> on an open log frees nothing (10.1), why <code>df -i</code> belongs next to <code>df -h</code> (10.1), and where to look when a service's log stops with no error (10.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về dung lượng đĩa, gói phần mềm và log. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: vì sao <code>rm</code> lên một file log đang mở chẳng giải phóng được gì (bài 10.1), vì sao <code>df -i</code> phải đi kèm <code>df -h</code> (bài 10.1), và nhìn vào đâu khi log của một dịch vụ dừng lại mà không có lỗi nào (bài 10.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'df says 75G used; du -sh / totals 40G. What explains the 35G gap?|||df báo dùng 75G; du -sh / cộng lại ra 40G. Cái gì giải thích khoảng chênh 35G?',
            options: [
              'du is simply inaccurate on large trees|||du đơn giản là thiếu chính xác trên cây thư mục lớn',
              'Space held by something du cannot SEE: a deleted-but-open file, data hidden under a mount point, or reserved blocks|||Chỗ bị một thứ mà du KHÔNG NHÌN THẤY chiếm giữ: một file đã xoá mà vẫn mở, dữ liệu bị che dưới một điểm gắn, hoặc các khối dự trữ',
              'df counts compressed files at their uncompressed size|||df tính file đã nén theo kích thước lúc chưa nén',
              'The filesystem needs fsck|||Hệ thống file cần chạy fsck',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Every write fails with "No space left on device" but df -h shows 43G free. What should you check?|||Mọi lệnh ghi đều hỏng với "No space left on device" nhưng df -h hiện còn 43G trống. Bạn nên kiểm cái gì?',
            options: [
              'df -i — the inode table may be full, which df -h never shows|||df -i — bảng inode có thể đã đầy, và df -h không bao giờ cho thấy điều đó',
              'The disk is failing; check SMART|||Đĩa đang hỏng; hãy kiểm SMART',
              'Restart the filesystem service|||Khởi động lại dịch vụ hệ thống file',
              'Nothing — the message is spurious when df shows free space|||Không cần kiểm gì — thông báo đó là giả khi df còn báo chỗ trống',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You rm a 30GB nginx access.log to free space, but df does not move. Why, and what is the fix?|||Bạn rm một file access.log 30GB của nginx để lấy chỗ, nhưng df không nhúc nhích. Vì sao, và cách chữa là gì?',
            options: [
              'The filesystem caches deletions; wait for the next sync|||Hệ thống file lưu tạm việc xoá; hãy chờ lần đồng bộ kế tiếp',
              'nginx still holds the file open, so the data is only freed when the last handle closes — truncate -s 0 instead of rm|||nginx vẫn đang giữ file đó mở, nên dữ liệu chỉ được giải phóng khi cái tay cầm cuối cùng đóng lại — hãy dùng truncate -s 0 thay cho rm',
              'rm needs sudo to free space on a root-owned file|||rm cần sudo mới giải phóng được chỗ với một file thuộc root',
              'The file was on a different filesystem|||File đó nằm trên một hệ thống file khác',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between apt update and apt upgrade?|||apt update khác apt upgrade ở chỗ nào?',
            options: [
              'update installs security patches; upgrade installs everything|||update cài bản vá an ninh; upgrade cài mọi thứ',
              'update refreshes the CATALOGUE of available versions and installs nothing; upgrade installs newer versions of what is already there|||update làm mới DANH MỤC các phiên bản đang có và không cài gì cả; upgrade thì cài bản mới hơn cho những gì đã có sẵn',
              'They are aliases for the same operation|||Chúng là hai tên gọi của cùng một thao tác',
              'update works on one package; upgrade works on all of them|||update làm việc trên một gói; upgrade làm trên tất cả',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You purge postgresql to reclaim disk space. What happens to /var/lib/postgresql?|||Bạn purge postgresql để đòi lại chỗ trên đĩa. Chuyện gì xảy ra với /var/lib/postgresql?',
            options: [
              'It is deleted along with the package|||Nó bị xoá cùng với gói',
              'It is left intact — purge removes binaries and system config, never DATA. You must remove it yourself, after a backup|||Nó được để nguyên — purge gỡ chương trình và cấu hình hệ thống, không bao giờ gỡ DỮ LIỆU. Bạn phải tự xoá nó, sau khi đã sao lưu',
              'It is moved to /var/backups automatically|||Nó tự động được chuyển sang /var/backups',
              'It is deleted only if you also run autoremove|||Nó chỉ bị xoá nếu bạn chạy thêm autoremove',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is "sudo pip install requests" a bad idea on a system Python?|||Vì sao "sudo pip install requests" là một ý tồi với Python của hệ thống?',
            options: [
              'pip is slower than apt|||pip chậm hơn apt',
              'It writes into directories apt owns, and runs the package\'s install hooks as root — modern Python refuses it outright (PEP 668)|||Nó ghi vào những thư mục do apt sở hữu, và chạy các móc cài đặt của gói với quyền root — Python đời mới từ chối thẳng (PEP 668)',
              'requests is already provided by the distribution|||requests vốn đã được bản phân phối cung cấp sẵn',
              'pip cannot resolve dependencies correctly|||pip không giải quyết đúng các thứ phụ thuộc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A service\'s log stops mid-sentence with no error, and the process is gone. Where do you look?|||Log của một dịch vụ dừng giữa câu mà không có lỗi nào, và tiến trình thì biến mất. Bạn nhìn vào đâu?',
            options: [
              'The application log, further back — the error must be there|||Log của ứng dụng, lùi về trước nữa — cái lỗi chắc chắn nằm ở đó',
              'journalctl -k (or dmesg) — an OOM kill or an I/O error is logged by the KERNEL, and the process was never alive to report it|||journalctl -k (hoặc dmesg) — một lần bị OOM giết hay một lỗi I/O do NHÂN ghi lại, còn tiến trình thì đã không còn sống để mà báo cáo',
              'The nginx access log|||Log truy cập của nginx',
              '/var/log/apt/history.log|||/var/log/apt/history.log',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After a log rotation, your app\'s new log file stays empty forever. Why?|||Sau một lần xoay vòng log, file log mới của ứng dụng cứ rỗng mãi mãi. Vì sao?',
            options: [
              'logrotate created the file with the wrong permissions|||logrotate tạo file với quyền sai',
              'Renaming does not disturb an open file — the process keeps writing to the same inode, now called access.log.1. It must be told to reopen (postrotate + SIGUSR1) or use copytruncate|||Việc đổi tên không làm phiền một file đang mở — tiến trình cứ ghi tiếp vào đúng cái inode đó, nay mang tên access.log.1. Phải BẢO nó mở lại (postrotate + SIGUSR1) hoặc dùng copytruncate',
              'compress corrupted the new file|||compress làm hỏng file mới',
              'The rotation schedule is set to weekly|||Lịch xoay vòng đang đặt là hằng tuần',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
