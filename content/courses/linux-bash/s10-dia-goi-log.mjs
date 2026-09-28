/**
 * Linux & Bash — Chương 10: Đĩa, gói phần mềm & log.
 * Đĩa đầy · thiết bị khối và mount · quản lý gói · log và journalctl · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 * Nâng cấp 28/09/2026: bài 10.0 slide (deck lx-10, 28 slide) + slide/🧪/🗂/📌 trong 10.1–10.3; đào sâu: bảng cờ df/du,
 * đo thật ba chỗ "vô hình" (hết inode trên tmpfs 2000 inode, file đã xoá còn mở + cắt trắng qua /proc, ổ gắn đè +
 * mount --bind), bẫy df -BG làm tròn lên trong chốt deploy, 4 chặng của apt, dpkg -l hai chữ cái, apt-mark hold đo
 * thật, chuỗi tin cậy InRelease → Packages → .deb (gpgv + sha256 thật), sha256sum -c / gpg --verify (mới), bảng
 * apt/dnf/brew, journalctl đo trong container có systemd (-p err bỏ sót OOM mức 5, dấu + chỉ giữa TRƯỜNG=giá trị),
 * journald mặc định chặn 4G, logrotate ba cách đo thật, UTC vs +07 và TZ không có tzdata; quiz 10 câu.
 * Câu chữ cũ đã sửa vì SAI: output du --max-depth=1 (thư mục con lọt vào tầng 1), output find -type f (in ra một
 * thư mục), apt-key "đã gỡ" (Ubuntu 24.04 vẫn còn, chỉ cảnh báo), journalctl "-u a + -u b" (lỗi thật), journald
 * "8 GB trên đĩa 80 GB" (chặn 4G), cấu hình logrotate của nginx (bản thật của Ubuntu 24.04), định dạng dòng OOM.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 10 — Disk, packages & logs|||Chương 10 — Đĩa, gói phần mềm & log',
  description: 'df khác du ra sao, tìm ra thứ làm đầy đĩa, apt/dnf, journalctl và việc xoay vòng log. Ba thứ chiếm phần lớn công việc bảo trì một máy chủ, và cả ba đều có những cái bẫy chỉ lộ ra lúc 3 giờ sáng.',
  lessons: [
    /* ─────────────────────────── 10.0 ─────────────────────────── */
    {
      title: '10.0 — Chapter 10 slides: disks, packages and logs in pictures|||10.0 — Slide Chương 10: đĩa, gói phần mềm và log bằng hình',
      slug: 'lnx-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 28 slide của Chương 10: vì sao df khác du, đọc df từng cột, lần theo nhánh lớn nhất bằng du | sort -h, hết inode, file đã xoá còn mở, ổ gắn đè, sự cố cache build 7,6 GB, bốn chặng của apt, remove/purge, dpkg -S/-L và apt policy, chuỗi tin cậy và sha256sum/gpg, journalctl theo bốn trục, mức ưu tiên và OOM, logrotate, UTC và +07.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Slides</span>
<h2>The whole chapter in 28 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: why <code>df</code> and <code>du</code> disagree and the three kinds of invisible space, <code>df</code> read column by column, four <code>du</code> commands that walk from a whole machine down to a 77 MB build cache, an inode table filled on a disk that is still empty, a deleted log file that keeps its space, a mount hiding data underneath it, the four stages of <code>apt</code>, a chain of trust from one signing key to one <code>.deb</code>, and <code>journalctl</code> catching an out-of-memory kill that <code>-p err</code> misses.</p>
<p>Slides 3–9 belong to Lesson 10.1 (disk space, including the real incident where a 7.6 GB build cache and a Postgres database shared one disk), 10–16 to 10.2 (packages, trust and checksums) and 17–23 to 10.3 (the journal, log rotation and time zones). The last five are the chapter's common mistakes, an Ubuntu/Fedora/macOS/WSL comparison, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 28/09/2026 — in Ubuntu 24.04 containers (one of them running systemd so that <code>journalctl</code> has real services to read), on a Fedora 44 machine, and on a Mac. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Slide</span>
<h2>Cả chương trong 28 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: vì sao <code>df</code> và <code>du</code> bất đồng và ba loại chỗ trống "vô hình", <code>df</code> đọc từng cột, bốn lệnh <code>du</code> đi từ cả cái máy xuống đúng 77 MB bộ đệm dựng, một bảng inode đầy trên một cái đĩa vẫn còn trống, một file log đã xoá mà vẫn giữ chỗ, một ổ gắn đè che dữ liệu bên dưới, bốn chặng của <code>apt</code>, một chuỗi tin cậy đi từ một khoá ký tới một file <code>.deb</code>, và <code>journalctl</code> bắt được một lần bị giết vì hết bộ nhớ mà <code>-p err</code> bỏ sót.</p>
<p>Slide 3–9 thuộc Bài 10.1 (dung lượng đĩa, gồm cả sự cố thật khi 7,6 GB bộ đệm dựng và cơ sở dữ liệu Postgres ở chung một cái đĩa), 10–16 thuộc 10.2 (gói phần mềm, sự tin cậy và mã băm) và 17–23 thuộc 10.3 (journal, xoay vòng log và múi giờ). Năm slide cuối là những sai lầm hay gặp, bảng so sánh Ubuntu/Fedora/macOS/WSL, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 — trong các container Ubuntu 24.04 (một cái chạy cả systemd để <code>journalctl</code> có dịch vụ thật mà đọc), trên máy Fedora 44, và trên Mac — con số trên máy bạn sẽ khác, quy luật thì không.</p>
</div>
${gallery('lx-10', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'df đếm khối, du cộng file nó thấy'], [4, 'Đọc df từng cột, df -i'], [5, 'du -d1 | sort -h: lần theo nhánh lớn nhất'],
  [6, 'Hết inode khi đĩa còn trống'], [7, 'rm file log đang mở'], [8, 'Ổ gắn đè và mount --bind'], [9, 'Sự cố cache build 7,6 GB và thứ tự dọn'],
  [10, 'apt đi 4 chặng'], [11, 'update và upgrade'], [12, 'remove, purge, dpkg -l'], [13, 'dpkg -S/-L, apt policy, apt-mark hold'],
  [14, 'Chuỗi tin cậy và signed-by'], [15, 'sha256sum -c và gpg --verify'], [16, 'apt · dnf · brew'],
  [17, 'Hai đường của log'], [18, 'journalctl theo 4 trục'], [19, 'Mức ưu tiên 0–7 và OOM'], [20, '-o json và các trường'],
  [21, 'Giới hạn journal'], [22, 'logrotate: ba cách xoay vòng'], [23, 'UTC trong container, +07 trên máy'],
  [24, 'Sai lầm hay gặp'], [25, 'Ubuntu · Fedora · macOS · WSL'], [26, 'Bảng tra nhanh (1/2)'], [27, 'Bảng tra nhanh (2/2)'], [28, 'Thực hành chương 10'],
])}
`,
    },
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
${slide('lx-10', 3, 'df đếm khối đã cấp, du cộng file nó thấy — khoảng chênh là manh mối')}
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

<h3>Reading df and du, column by column and flag by flag</h3>
${slide('lx-10', 4, 'Đọc df từng cột; df -i; bẫy -BG làm tròn lên')}
<p>Most people glance at <code>Use%</code> and stop. Each column answers a different question, and two of them hide a trap:</p>
<table>
<tr><th>Column</th><th>Meaning</th><th>Watch out</th></tr>
<tr><td><code>Filesystem</code></td><td>the device or partition (<code>/dev/vda1</code>), or a virtual one (<code>tmpfs</code>, <code>overlay</code> inside a container)</td><td>two mount points with the same device are ONE disk: filling one fills the other</td></tr>
<tr><td><code>Size</code> · <code>Used</code></td><td>total blocks · blocks allocated</td><td><code>Used</code> counts files with no name too (deleted but open)</td></tr>
<tr><td><code>Avail</code></td><td>what an <em>ordinary user</em> can still write</td><td>smaller than <code>Size − Used</code>: the difference is the root reserve (ext4 default 5%)</td></tr>
<tr><td><code>Use%</code></td><td><code>Used ÷ (Used + Avail)</code>, rounded up</td><td>100% for users while root can still write</td></tr>
<tr><td><code>Mounted on</code></td><td>where the filesystem is attached</td><td>ask <code>df</code> about a path (<code>df -h /var/lib/docker</code>) and it answers for the filesystem holding that path</td></tr>
</table>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>df -h</code></td><td>human-readable sizes (powers of 1024)</td><td><code>df -h /</code></td></tr>
<tr><td><code>df -i</code></td><td>inodes instead of bytes — the "other" full</td><td><code>df -i /</code></td></tr>
<tr><td><code>df -T</code></td><td>add a Type column (ext4, xfs, btrfs, tmpfs, overlay)</td><td><code>df -hT</code></td></tr>
<tr><td><code>df -x TYPE</code></td><td>hide a filesystem type</td><td><code>df -h -x tmpfs -x devtmpfs</code></td></tr>
<tr><td><code>df --output=…</code></td><td>choose columns — the script-friendly form</td><td><code>df --output=avail,pcent,ipcent /</code></td></tr>
<tr><td><code>df -BM</code> · <code>-B1</code></td><td>fixed unit (MB, bytes) for scripts</td><td><code>df -BM --output=avail /</code></td></tr>
<tr><td><code>du -s</code> · <code>-h</code></td><td>one total per argument · human sizes</td><td><code>du -sh /var/log</code></td></tr>
<tr><td><code>du -d N</code> = <code>--max-depth=N</code></td><td>show totals only N levels down</td><td><code>du -h -d1 /var</code></td></tr>
<tr><td><code>du -x</code></td><td>stay on one filesystem (do not cross mounts)</td><td><code>du -xh -d1 /</code></td></tr>
<tr><td><code>du -c</code></td><td>add a grand total line</td><td><code>du -ch *.log</code></td></tr>
<tr><td><code>du --apparent-size</code></td><td>the size files <em>claim</em>, not blocks used</td><td>sparse VM images, database files</td></tr>
<tr><td><code>du --inodes</code></td><td>count files instead of bytes (GNU)</td><td><code>du --inodes -x -d1 /var | sort -n</code></td></tr>
</table>
<pre><code>truncate -s 1G /tmp/sparse          <span class="tok-comment"># a SPARSE file: a size, but no blocks yet</span>
ls -lh /tmp/sparse
du -h /tmp/sparse; du -h --apparent-size /tmp/sparse</code></pre>
<div class="out">-rw-r--r-- 1 root root 1.0G Sep 28 15:20 /tmp/sparse
0	/tmp/sparse
1.0G	/tmp/sparse</div>
<p>Measured in an Ubuntu 24.04 container: the gap can also go the other way. A sparse file — a virtual machine disk image, some database files — declares a size it has not filled, so <code>ls</code> and <code>du --apparent-size</code> say 1 GB while <code>du</code> and <code>df</code> count zero blocks. When <code>df</code> shows <em>more</em> than <code>du</code>, something is holding space without a name; when <code>ls</code> shows more than <code>du</code>, a file is sparse.</p>
<pre><code>df -BG --output=avail /data          <span class="tok-comment"># a tmpfs with 2 MB really free</span>
df -BM --output=avail /data</code></pre>
<div class="out">Avail
   1G
Avail
   2M</div>
<div class="callout warn"><strong>Measured: <code>-BG</code> rounds UP.</strong> A filesystem with 2 MB free printed <code>1G</code>. That matters for the deploy guard at the end of this lesson: a check written as <code>df -BG … (( free_gb &gt;= 5 ))</code> lets through a disk with 4.01 GB free, because it prints <code>5G</code>. Compare in megabytes (<code>-BM</code>) or bytes (<code>-B1</code>) whenever a script makes a decision on the number.</div>

<h3>Finding the big directories</h3>
${slide('lx-10', 5, 'du -d1 | sort -h: bốn lệnh từ cả máy xuống đúng thủ phạm')}
<pre><code>du -h --max-depth=1 / 2&gt;/dev/null | sort -h | tail -15</code></pre>
<div class="out">1.1G    /home
4.8G    /usr
69G     /var
75G     /</div>
<pre><code><span class="tok-comment"># Then follow the biggest one down</span>
du -h --max-depth=1 /var/lib/docker | sort -h | tail
du -h --max-depth=1 /var/lib/docker/overlay2 | sort -h | tail -5

<span class="tok-comment"># The 20 biggest individual files</span>
find / -xdev -type f -printf '%s\\t%p\\n' 2&gt;/dev/null \\
  | sort -rn | head -20 | numfmt --field=1 --to=iec</code></pre>
<div class="out">4.2G /var/lib/docker/overlay2/8f2a.../diff/app/uploads/backup.tar
2.1G /var/log/journal/9c1b.../system.journal
1.8G /var/log/nginx/access.log</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-x</code> / <code>-xdev</code></span><span class="v">Stay on ONE filesystem. Without it, <code>du /</code> also walks network mounts and <code>/proc</code>, which is slow and gives meaningless numbers.</span></div>
  <div class="kv"><span class="k"><code>sort -h</code></span><span class="v">Sorts human-readable sizes correctly: <code>2.3G</code> after <code>900M</code>. Plain <code>sort</code> puts <code>900M</code> last (Lesson 3.4).</span></div>
  <div class="kv"><span class="k"><code>2&gt;/dev/null</code></span><span class="v">Silences the permission-denied noise so the real output is readable (Lesson 3.1).</span></div>
</div>
<pre><code>sudo apt install ncdu
sudo ncdu -x /</code></pre>
<div class="callout ok"><code>ncdu</code> is worth installing on every server before you need it. It gives you an interactive, sorted tree you navigate with arrow keys, showing each directory's share of the total — so finding the offending 40 GB takes three keypresses instead of five <code>du</code> commands. Press <code>d</code> to delete from inside it, though on a production machine reading first is wiser.</div>

<h3>Measured: four commands from the whole machine to the culprit</h3>
<p>A tree built to look like a small VPS (real files of the right sizes, in an Ubuntu 24.04 container). The method is the same on a real server: at each level read only the <strong>last</strong> line — <code>sort -h</code> puts the biggest there — and descend into it.</p>
<pre><code>cd /vps
du -h --max-depth=1 . | sort -h
du -h --max-depth=1 var | sort -h
du -h -d1 var/lib | sort -h
du -h -d1 var/lib/docker | sort -h</code></pre>
<div class="out">12M	./home
49M	./usr
207M	./var
266M	.
3.1M	var/cache
40M	var/log
165M	var/lib
207M	var
23M	var/lib/postgresql
143M	var/lib/docker
165M	var/lib
67M	var/lib/docker/overlay2
77M	var/lib/docker/buildkit
143M	var/lib/docker</div>
<p>Four steps from 266 MB for the whole "machine" to the 77 MB <code>buildkit</code> directory — Docker's build cache, the same culprit as in the real incident at the end of this lesson. Two details decide whether this works. First, the <code>-h</code> on <code>sort</code> must match the <code>-h</code> on <code>du</code>; without it <code>sort</code> compares text:</p>
<pre><code>du -h -d1 var | sort          <span class="tok-comment"># forgot -h on sort</span></code></pre>
<div class="out">165M	var/lib
207M	var
3.1M	var/cache
40M	var/log</div>
<p>"3.1M" sorts after "207M" because the character <code>3</code> comes after <code>2</code>, so the 3 MB directory looks like the biggest. Second, on a real server always add <code>-x</code> to <code>du /</code>: it stops at filesystem boundaries, so the numbers describe the disk that is full and not <code>/proc</code>, a network share or a second disk mounted under <code>/mnt</code>.</p>
<pre><code><span class="tok-comment"># Individual big files, newest first — "what grew overnight?"</span>
sudo find / -xdev -type f -size +500M -mtime -1 -exec ls -lh {} + 2&gt;/dev/null</code></pre>
<p><code>-size +500M</code> means "larger than 500 MiB", <code>-mtime -1</code> "modified within the last 24 hours", <code>-xdev</code> the same "one filesystem" rule as <code>du -x</code>, and <code>-exec ls -lh {} +</code> prints them with readable sizes in one <code>ls</code> call (Lesson 2.3).</p>

<h3>Case one: inodes, not bytes</h3>
${slide('lx-10', 6, 'Hết inode: còn 64M trống mà không tạo nổi file')}
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
<h3>Measured: filling the inode table on an empty disk</h3>
<p>Docker can create a small in-memory filesystem with a fixed number of inodes (<code>--tmpfs /data:size=64m,nr_inodes=2000</code>), which reproduces this failure in seconds without touching a real disk:</p>
<pre><code>df -h /data; df -i /data
mkdir -p /data/sess
i=0; while touch /data/sess/s$i; do i=$((i+1)); done; echo "created $i files"
df -h /data | tail -1; df -i /data | tail -1
echo x &gt; /data/moi.txt
du --inodes -x /data | sort -n | tail -3</code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
tmpfs            64M     0   64M   0% /data
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000     1  1999    1% /data
touch: cannot touch 'sess/s1998': No space left on device
created 1998 files
tmpfs            64M     0   64M   0% /data
tmpfs            2000  2000     0  100% /data
bash: /data/moi.txt: No space left on device
1999	/data/sess
2000	/data</div>
<p>Read the two <code>tail -1</code> lines side by side: <strong>0% of the bytes, 100% of the inodes</strong>, and every write fails with exactly the message you would get from a full disk. 1998 empty files is all it took (the directory itself and <code>sess/</code> used the other two). <code>du --inodes</code> (GNU coreutils) is the quick way to find the directory holding them; the <code>find … -exec sh -c</code> loop above does the same on systems without it. On Fedora's default btrfs the question does not arise the same way: btrfs allocates inodes on demand, and <code>df -i</code> shows <code>0</code> and <code>-</code> there (measured on Fedora 44).</p>

<h3>Case two: deleted files that are still open</h3>
${slide('lx-10', 7, 'rm một file log đang mở: tên mất, inode còn, df không nhúc nhích')}
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
<h3>Measured: rm, lsof +L1, and truncating through /proc</h3>
<pre><code>mkdir -p /data/log &amp;&amp; head -c 40M /dev/urandom &gt; /data/log/access.log
sleep 3000 3&gt;&gt;/data/log/access.log &amp;       <span class="tok-comment"># a "daemon" holding the log open on fd 3</span>
df -h /data
rm /data/log/access.log
df -h /data | tail -1; du -sh /data
lsof -nP +L1
truncate -s 0 /proc/5748/fd/3              <span class="tok-comment"># 5748 = the PID lsof printed</span>
df -h /data | tail -1</code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
tmpfs            64M   40M   24M  63% /data
tmpfs            64M   40M   24M  63% /data
0	/data
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
sleep   5748 root    3w   REG   0,94 41943040     0 2003 /data/log/access.log (deleted)
tmpfs            64M     0   64M   0% /data</div>
<p>Everything in the story shows up in real output: after <code>rm</code>, <code>df</code> still says 40M used while <code>du</code> finds nothing; <code>lsof +L1</code> ("files with fewer than 1 link") names the process, its file descriptor (<code>3w</code> = fd 3, open for writing), the size and <code>NLINK 0</code>; and emptying the file through <code>/proc/PID/fd/3</code> hands the 40 MB back instantly, without stopping the process. Read the <code>lsof</code> columns this way: <code>FD</code> is the descriptor number plus its mode (<code>r</code>/<code>w</code>/<code>u</code>), <code>SIZE/OFF</code> the size in bytes, <code>NLINK</code> how many names the file still has — 0 means none.</p>

<h3>Case three: something mounted over a full directory</h3>
${slide('lx-10', 8, 'Ổ gắn đè che dữ liệu cũ — mount --bind để nhìn xuống')}
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
<h3>Measured: looking underneath a mount without unmounting it</h3>
<p>Unmounting <code>/var/lib/docker</code> on a running server means stopping Docker. There is a gentler way: a <strong>bind mount</strong> of the parent filesystem somewhere else. A plain <code>mount --bind</code> (not <code>--rbind</code>) does not carry the mounts nested inside it, so through the new path you see what is really stored <em>under</em> the mount point. Reproduced with two tmpfs filesystems in a short-lived container:</p>
<pre><code>mount -t tmpfs -o size=100m tmpfs /srv
mkdir -p /srv/docker
head -c 30M /dev/zero &gt; /srv/docker/cu-truoc-khi-gan.img    <span class="tok-comment"># written BEFORE the next mount</span>
mount -t tmpfs -o size=200m tmpfs /srv/docker                <span class="tok-comment"># the "data disk" arrives</span>
head -c 5M /dev/zero &gt; /srv/docker/moi.img
du -sh /srv; du -shx /srv
df -h /srv /srv/docker
mkdir -p /mnt/goc &amp;&amp; mount --bind /srv /mnt/goc
du -sh /mnt/goc/docker</code></pre>
<div class="out">5.0M	/srv
0	/srv
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           100M   30M   70M  30% /srv
tmpfs           200M  5.0M  195M   3% /srv/docker
30M	/mnt/goc/docker</div>
<p><code>df /srv</code> says 30M used; <code>du</code> can find only the new disk's 5M (or nothing at all with <code>-x</code>). Through the bind mount, the hidden 30M appears. On a real server the equivalent is <code>sudo mount --bind / /mnt/goc</code> followed by <code>sudo du -xh -d1 /mnt/goc/var/lib/docker</code>; remove it afterwards with <code>sudo umount /mnt/goc</code>. The usual cause is a service that started writing before the data disk was mounted — at boot, or because an <code>/etc/fstab</code> line was wrong.</p>

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
${slide('lx-10', 9, 'Sự cố thật: cache build 7,6 GB và Postgres chung một đĩa; thứ tự dọn')}
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
<h3>The guard, written so that it cannot round its way past you</h3>
<p>The guard above uses <code>-BG</code>, and the measurement earlier in this lesson showed that <code>-BG</code> rounds up: 4.01 GB free prints as <code>5G</code> and passes a "at least 5 GB" test. Compare in megabytes instead, name the path, and return an error the caller can act on:</p>
<pre><code>can_deploy() {                                  <span class="tok-comment"># usage: can_deploy NEED_MB PATH</span>
  local need_mb=$1 path=$2 avail_mb
  avail_mb=$(df -BM --output=avail "$path" | tail -1 | tr -dc 0-9)
  if (( avail_mb &lt; need_mb )); then
    echo "refused: $path has \${avail_mb}MB, needs \${need_mb}MB" &gt;&amp;2
    return 1
  fi
  echo "ok: \${avail_mb}MB free"
}
can_deploy 40 /data; echo "rc=$?"
can_deploy 10 /data; echo "rc=$?"</code></pre>
<div class="out">refused: /data has 26MB, needs 40MB
rc=1
ok: 26MB free
rc=0</div>
<p>How the real project fixed the incident, for the record: images are now built on a different machine and only pulled by the VPS (so it keeps no build cache at all), a weekly job reclaims disk, and the deploy script refuses to start below a free-space floor. Three layers, because each one alone had already failed once.</p>

<h3>Try it step by step</h3>
<p>All three invisible cases on your own machine in ten minutes, inside a throw-away container (Docker Desktop on Mac/Windows, or Docker on Linux). Nothing touches your real disk:</p>
<pre><code>docker run -it --rm --tmpfs /data:rw,size=64m,nr_inodes=2000 ubuntu:24.04 bash
<span class="tok-comment"># inside the container:</span>
apt-get update -qq &amp;&amp; apt-get install -y -qq lsof &gt;/dev/null
df -h /data; df -i /data                                   <span class="tok-comment"># 1. two different "full"s</span>
mkdir /data/s; i=0; while touch /data/s/f$i 2&gt;/dev/null; do i=$((i+1)); done
df -h /data | tail -1; df -i /data | tail -1; rm -rf /data/s
mkdir /data/log; head -c 40M /dev/urandom &gt; /data/log/a.log  <span class="tok-comment"># 2. deleted but open</span>
sleep 3000 3&gt;&gt;/data/log/a.log &amp;
rm /data/log/a.log; df -h /data | tail -1; lsof -nP +L1
truncate -s 0 /proc/$!/fd/3; df -h /data | tail -1
exit</code></pre>
<p><code>$!</code> is the PID of the last background job (Lesson 5.4), so you do not need to copy it from <code>lsof</code>. The mount-over case needs a container started with <code>--cap-add SYS_ADMIN</code>, because mounting is a privileged operation; repeat the commands from "Measured: looking underneath a mount" in it.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Task</th><th>Ubuntu / WSL2</th><th>macOS (measured on macOS 27)</th></tr>
<tr><td>Totals one level down</td><td><code>du -h --max-depth=1</code> or <code>du -h -d1</code></td><td><code>du -h -d 1</code> only — <code>--max-depth</code> gives "unrecognized option"</td></tr>
<tr><td>Sort human sizes</td><td><code>sort -h</code></td><td><code>sort -h</code> works (Apple sort 2.3)</td></tr>
<tr><td>Inodes</td><td><code>df -i</code>, <code>du --inodes</code></td><td><code>df</code> already prints <code>iused</code>/<code>ifree</code>; no <code>du --inodes</code></td></tr>
<tr><td>Which filesystem is "the disk"</td><td><code>/</code></td><td><code>/</code> is a read-only system snapshot (13 GiB used); your files live on <code>/System/Volumes/Data</code> (493 GiB used on this Mac)</td></tr>
<tr><td>Deleted but open</td><td><code>lsof +L1</code></td><td><code>lsof +L1</code> works the same</td></tr>
<tr><td>Interactive tree</td><td><code>ncdu</code></td><td><code>brew install ncdu</code></td></tr>
</table>
<p>Measured on the Mac: <code>df -h /</code> reports <code>13Gi</code> used on a disk that is really more than half full, because <code>/</code> is the sealed system volume; <code>df -h /System/Volumes/Data</code> is the honest number, and it shares free space with <code>/</code> (both said <code>396Gi</code> available). On WSL2, <code>df -h /</code> inside Linux describes the distribution's virtual disk, which Microsoft documents as growing on demand up to a default maximum of 1 TB — so its "Size" is that ceiling, not the free space left on drive C:. Check Windows itself (Explorer, or <code>Get-PSDrive C</code> in PowerShell) when WSL says there is plenty of room.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's deploy on the SWP391 server fails with "No space left on device". Rebuild the situation in a container and find which of the two "fulls" it is — before deleting anything.</p><ol>
<li>Start <code>docker run -it --rm --tmpfs /data:rw,size=64m,nr_inodes=2000 ubuntu:24.04 bash</code> and build the app: <code>mkdir -p /data/app/{logs,cache,uploads}; head -c 30M /dev/zero &gt; /data/app/cache/build.bin; head -c 8M /dev/zero &gt; /data/app/logs/app.log; for i in $(seq 1 1900); do : &gt; /data/app/uploads/thumb$i.jpg; done</code>.</li>
<li>Run <code>df -h /data</code> and <code>df -i /data</code>. Which one is closer to 100%?</li>
<li>Find the culprit for each: <code>du -h -d1 /data/app | sort -h</code> and <code>du --inodes -d1 /data/app | sort -n</code>.</li>
<li>Paste the <code>can_deploy</code> function from this lesson, then run <code>can_deploy 40 /data</code> and <code>can_deploy 10 /data</code>, printing <code>$?</code> after each.</li></ol>
<p><strong>Done when:</strong> you can say "bytes 60%, inodes 96% — the uploads directory with 1901 inodes is the problem, while <code>cache</code> is the biggest by bytes (30M)", and the guard refuses 40 MB (<code>rc=1</code>) but accepts 10 MB (<code>rc=0</code>).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filesystem</span><span class="v">The structure on a disk or partition that turns blocks into files and directories (ext4, xfs, btrfs, tmpfs).</span></div>
  <div class="kv"><span class="k">Block</span><span class="v">The unit a filesystem hands out space in; <code>df</code> counts allocated blocks.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The record describing one file (size, owner, where its data is). A filesystem has a fixed number on ext4.</span></div>
  <div class="kv"><span class="k">Mount point</span><span class="v">The directory where a filesystem is attached; anything already inside it is hidden while the mount is there.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">Attaching an existing directory at a second path — here, a way to see under a mount point.</span></div>
  <div class="kv"><span class="k">Deleted but open</span><span class="v">A file with no name left (NLINK 0) whose data survives because a process still has it open.</span></div>
  <div class="kv"><span class="k">Sparse file</span><span class="v">A file whose declared size is larger than the blocks it really uses.</span></div>
  <div class="kv"><span class="k">Reserved blocks</span><span class="v">Space ext4 keeps for root (5% by default) so the administrator can still work on a full disk.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>df</code> counts blocks the filesystem allocated; <code>du</code> adds up files it can see — the gap between them is the clue.</li>
<li>Always run <code>df -h</code> and <code>df -i</code> together: a disk can be 0% full in bytes and 100% full in inodes.</li>
<li>Walk down with <code>du -xh -d1 | sort -h</code>, reading only the last line at each level, and keep the <code>-h</code> on both sides of the pipe.</li>
<li>A deleted file that a process holds open keeps its space: <code>lsof +L1</code> finds it, <code>truncate -s 0</code> (through <code>/proc/PID/fd</code> if needed) frees it.</li>
<li>Data written before a mount hides underneath it; a plain <code>mount --bind</code> of the parent shows it without unmounting.</li>
<li>Scripts that decide on free space must use <code>df -BM</code> or <code>-B1</code>: <code>-BG</code> rounds up.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-10', 3, 'df đếm khối đã cấp, du cộng file nó thấy — khoảng chênh là manh mối')}
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

<h3>Đọc df và du, từng cột và từng cờ</h3>
${slide('lx-10', 4, 'Đọc df từng cột; df -i; bẫy -BG làm tròn lên')}
<p>Phần lớn mọi người liếc cột <code>Use%</code> rồi thôi. Mỗi cột trả lời một câu hỏi khác nhau, và hai trong số đó giấu một cái bẫy:</p>
<table>
<tr><th>Cột</th><th>Nghĩa</th><th>Coi chừng</th></tr>
<tr><td><code>Filesystem</code></td><td>thiết bị hay phân vùng (<code>/dev/vda1</code>), hoặc một hệ thống file ảo (<code>tmpfs</code>, <code>overlay</code> bên trong container)</td><td>hai điểm gắn cùng một thiết bị là MỘT cái đĩa: làm đầy cái này là đầy cả cái kia</td></tr>
<tr><td><code>Size</code> · <code>Used</code></td><td>tổng số khối · số khối đã cấp phát</td><td><code>Used</code> tính cả những file không còn tên (đã xoá mà vẫn mở)</td></tr>
<tr><td><code>Avail</code></td><td>phần mà một <em>người dùng thường</em> còn ghi được</td><td>nhỏ hơn <code>Size − Used</code>: phần chênh là chỗ dự trữ cho root (ext4 mặc định 5%)</td></tr>
<tr><td><code>Use%</code></td><td><code>Used ÷ (Used + Avail)</code>, làm tròn lên</td><td>100% với người thường trong khi root vẫn còn ghi được</td></tr>
<tr><td><code>Mounted on</code></td><td>hệ thống file được gắn vào đâu</td><td>hỏi <code>df</code> về một đường dẫn (<code>df -h /var/lib/docker</code>) thì nó trả lời cho hệ thống file đang chứa đường dẫn đó</td></tr>
</table>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>df -h</code></td><td>kích thước dễ đọc (luỹ thừa của 1024)</td><td><code>df -h /</code></td></tr>
<tr><td><code>df -i</code></td><td>đếm inode thay cho byte — cái "đầy" thứ hai</td><td><code>df -i /</code></td></tr>
<tr><td><code>df -T</code></td><td>thêm cột Type (ext4, xfs, btrfs, tmpfs, overlay)</td><td><code>df -hT</code></td></tr>
<tr><td><code>df -x LOẠI</code></td><td>giấu một loại hệ thống file</td><td><code>df -h -x tmpfs -x devtmpfs</code></td></tr>
<tr><td><code>df --output=…</code></td><td>chọn cột — dạng tiện cho script</td><td><code>df --output=avail,pcent,ipcent /</code></td></tr>
<tr><td><code>df -BM</code> · <code>-B1</code></td><td>đơn vị cố định (MB, byte) cho script</td><td><code>df -BM --output=avail /</code></td></tr>
<tr><td><code>du -s</code> · <code>-h</code></td><td>một con số tổng cho mỗi đối số · kích thước dễ đọc</td><td><code>du -sh /var/log</code></td></tr>
<tr><td><code>du -d N</code> = <code>--max-depth=N</code></td><td>chỉ in tổng tới N tầng bên dưới</td><td><code>du -h -d1 /var</code></td></tr>
<tr><td><code>du -x</code></td><td>ở lại trên một hệ thống file (không đi qua điểm gắn)</td><td><code>du -xh -d1 /</code></td></tr>
<tr><td><code>du -c</code></td><td>thêm một dòng tổng cộng</td><td><code>du -ch *.log</code></td></tr>
<tr><td><code>du --apparent-size</code></td><td>kích thước file <em>khai</em>, không phải số khối thật</td><td>ảnh đĩa máy ảo thưa, file cơ sở dữ liệu</td></tr>
<tr><td><code>du --inodes</code></td><td>đếm số file thay cho số byte (GNU)</td><td><code>du --inodes -x -d1 /var | sort -n</code></td></tr>
</table>
<pre><code>truncate -s 1G /tmp/sparse          <span class="tok-comment"># một file THƯA: có kích thước, chưa có khối nào</span>
ls -lh /tmp/sparse
du -h /tmp/sparse; du -h --apparent-size /tmp/sparse</code></pre>
<div class="out">-rw-r--r-- 1 root root 1.0G Sep 28 15:20 /tmp/sparse
0	/tmp/sparse
1.0G	/tmp/sparse</div>
<p>Đo thật trong container Ubuntu 24.04: khoảng chênh còn có thể đi theo chiều ngược lại. Một file thưa (sparse file) — ảnh đĩa của máy ảo, vài loại file cơ sở dữ liệu — khai một kích thước mà nó chưa lấp đầy, nên <code>ls</code> và <code>du --apparent-size</code> nói 1 GB trong khi <code>du</code> và <code>df</code> đếm được không khối nào. Khi <code>df</code> cho thấy NHIỀU hơn <code>du</code> là có thứ đang giữ chỗ mà không có tên; khi <code>ls</code> cho thấy nhiều hơn <code>du</code> là có một file thưa.</p>
<pre><code>df -BG --output=avail /data          <span class="tok-comment"># một tmpfs thật sự còn trống 2 MB</span>
df -BM --output=avail /data</code></pre>
<div class="out">Avail
   1G
Avail
   2M</div>
<div class="callout warn"><strong>Đo thật: <code>-BG</code> làm tròn LÊN.</strong> Một hệ thống file còn trống 2 MB in ra <code>1G</code>. Điều đó quan trọng với cái chốt chặn deploy ở cuối bài này: một phép kiểm viết kiểu <code>df -BG … (( free_gb &gt;= 5 ))</code> sẽ cho qua một cái đĩa còn 4,01 GB, vì nó in ra <code>5G</code>. Hãy so bằng megabyte (<code>-BM</code>) hoặc byte (<code>-B1</code>) mỗi khi một script ra quyết định dựa trên con số đó.</div>

<h3>Tìm ra những thư mục lớn</h3>
${slide('lx-10', 5, 'du -d1 | sort -h: bốn lệnh từ cả máy xuống đúng thủ phạm')}
<pre><code>du -h --max-depth=1 / 2&gt;/dev/null | sort -h | tail -15</code></pre>
<div class="out">1.1G    /home
4.8G    /usr
69G     /var
75G     /</div>
<pre><code><span class="tok-comment"># Rồi lần xuống theo nhánh lớn nhất</span>
du -h --max-depth=1 /var/lib/docker | sort -h | tail
du -h --max-depth=1 /var/lib/docker/overlay2 | sort -h | tail -5

<span class="tok-comment"># 20 file đơn lẻ lớn nhất</span>
find / -xdev -type f -printf '%s\\t%p\\n' 2&gt;/dev/null \\
  | sort -rn | head -20 | numfmt --field=1 --to=iec</code></pre>
<div class="out">4.2G /var/lib/docker/overlay2/8f2a.../diff/app/uploads/backup.tar
2.1G /var/log/journal/9c1b.../system.journal
1.8G /var/log/nginx/access.log</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-x</code> / <code>-xdev</code></span><span class="v">Ở lại trên MỘT hệ thống file. Thiếu nó, <code>du /</code> đi cả vào các mount mạng và <code>/proc</code>, vừa chậm vừa cho ra những con số vô nghĩa.</span></div>
  <div class="kv"><span class="k"><code>sort -h</code></span><span class="v">Sắp xếp đúng những kích thước cho người đọc: <code>2.3G</code> đứng sau <code>900M</code>. <code>sort</code> trần thì đẩy <code>900M</code> xuống cuối (Bài 3.4).</span></div>
  <div class="kv"><span class="k"><code>2&gt;/dev/null</code></span><span class="v">Dập tiếng đám nhiễu permission-denied để phần output thật đọc được (Bài 3.1).</span></div>
</div>
<pre><code>sudo apt install ncdu
sudo ncdu -x /</code></pre>
<div class="callout ok"><code>ncdu</code> đáng được cài lên mọi máy chủ TRƯỚC khi bạn cần tới nó. Nó cho bạn một cây thư mục tương tác đã sắp xếp, đi lại bằng phím mũi tên, hiện phần chiếm của từng thư mục trong tổng số — nên tìm ra chỗ 40 GB đang gây chuyện chỉ tốn ba lần bấm phím thay vì năm lệnh <code>du</code>. Nhấn <code>d</code> để xoá ngay từ bên trong nó, dù trên một máy production thì đọc trước vẫn khôn ngoan hơn.</div>

<h3>Đo thật: bốn lệnh từ cả cái máy xuống đúng thủ phạm</h3>
<p>Một cây thư mục dựng cho giống một VPS nhỏ (file thật, đúng kích thước, trong container Ubuntu 24.04). Trên máy chủ thật cách làm y hệt: ở mỗi tầng chỉ đọc dòng <strong>CUỐI</strong> — <code>sort -h</code> đặt cái lớn nhất ở đó — rồi đi xuống nó.</p>
<pre><code>cd /vps
du -h --max-depth=1 . | sort -h
du -h --max-depth=1 var | sort -h
du -h -d1 var/lib | sort -h
du -h -d1 var/lib/docker | sort -h</code></pre>
<div class="out">12M	./home
49M	./usr
207M	./var
266M	.
3.1M	var/cache
40M	var/log
165M	var/lib
207M	var
23M	var/lib/postgresql
143M	var/lib/docker
165M	var/lib
67M	var/lib/docker/overlay2
77M	var/lib/docker/buildkit
143M	var/lib/docker</div>
<p>Bốn bước đi từ 266 MB của cả "cái máy" xuống thư mục <code>buildkit</code> 77 MB — bộ đệm dựng (build cache) của Docker, đúng thủ phạm của sự cố thật ở cuối bài này. Có hai chi tiết quyết định cách này chạy hay không. Thứ nhất, cờ <code>-h</code> của <code>sort</code> phải đi đôi với <code>-h</code> của <code>du</code>; thiếu nó thì <code>sort</code> so theo CHỮ:</p>
<pre><code>du -h -d1 var | sort          <span class="tok-comment"># quên -h ở sort</span></code></pre>
<div class="out">165M	var/lib
207M	var
3.1M	var/cache
40M	var/log</div>
<p>"3.1M" đứng sau "207M" vì ký tự <code>3</code> đứng sau <code>2</code>, nên cái thư mục 3 MB trông như là lớn nhất. Thứ hai, trên máy chủ thật hãy luôn thêm <code>-x</code> cho <code>du /</code>: nó dừng ở ranh giới hệ thống file, nên các con số mô tả đúng cái đĩa đang đầy chứ không phải <code>/proc</code>, một ổ mạng hay một đĩa thứ hai gắn dưới <code>/mnt</code>.</p>
<pre><code><span class="tok-comment"># Từng file lớn, sửa gần đây — "cái gì phình ra qua đêm?"</span>
sudo find / -xdev -type f -size +500M -mtime -1 -exec ls -lh {} + 2&gt;/dev/null</code></pre>
<p><code>-size +500M</code> nghĩa là "lớn hơn 500 MiB", <code>-mtime -1</code> là "được sửa trong 24 giờ qua", <code>-xdev</code> là đúng luật "một hệ thống file" như <code>du -x</code>, còn <code>-exec ls -lh {} +</code> in chúng ra với kích thước dễ đọc chỉ trong một lần gọi <code>ls</code> (Bài 2.3).</p>

<h3>Trường hợp một: hết inode, không phải hết byte</h3>
${slide('lx-10', 6, 'Hết inode: còn 64M trống mà không tạo nổi file')}
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
<h3>Đo thật: làm đầy bảng inode trên một cái đĩa trống</h3>
<p>Docker tạo được một hệ thống file nhỏ trong bộ nhớ với số inode cố định (<code>--tmpfs /data:size=64m,nr_inodes=2000</code>), nhờ đó dựng lại kiểu hỏng này trong vài giây mà không đụng tới đĩa thật nào:</p>
<pre><code>df -h /data; df -i /data
mkdir -p /data/sess
i=0; while touch /data/sess/s$i; do i=$((i+1)); done; echo "tạo được $i file"
df -h /data | tail -1; df -i /data | tail -1
echo x &gt; /data/moi.txt
du --inodes -x /data | sort -n | tail -3</code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
tmpfs            64M     0   64M   0% /data
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000     1  1999    1% /data
touch: cannot touch 'sess/s1998': No space left on device
tạo được 1998 file
tmpfs            64M     0   64M   0% /data
tmpfs            2000  2000     0  100% /data
bash: /data/moi.txt: No space left on device
1999	/data/sess
2000	/data</div>
<p>Đặt hai dòng <code>tail -1</code> cạnh nhau mà đọc: <strong>0% số byte, 100% số inode</strong>, và mọi lệnh ghi đều hỏng với đúng câu báo lỗi mà một cái đĩa đầy vẫn đưa ra. Chỉ cần 1998 file rỗng (thư mục gốc và <code>sess/</code> dùng hai inode còn lại). <code>du --inodes</code> (GNU coreutils) là cách nhanh để tìm thư mục đang giữ chúng; vòng <code>find … -exec sh -c</code> ở trên làm được việc tương tự trên hệ thống không có cờ đó. Trên btrfs mặc định của Fedora thì câu hỏi này không đặt ra theo cùng kiểu: btrfs cấp inode theo nhu cầu, và <code>df -i</code> ở đó hiện <code>0</code> và <code>-</code> (đo trên Fedora 44).</p>

<h3>Trường hợp hai: file đã xoá mà vẫn đang mở</h3>
${slide('lx-10', 7, 'rm một file log đang mở: tên mất, inode còn, df không nhúc nhích')}
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
<h3>Đo thật: rm, lsof +L1, và cắt trắng qua /proc</h3>
<pre><code>mkdir -p /data/log &amp;&amp; head -c 40M /dev/urandom &gt; /data/log/access.log
sleep 3000 3&gt;&gt;/data/log/access.log &amp;       <span class="tok-comment"># một "daemon" giữ file log mở ở fd 3</span>
df -h /data
rm /data/log/access.log
df -h /data | tail -1; du -sh /data
lsof -nP +L1
truncate -s 0 /proc/5748/fd/3              <span class="tok-comment"># 5748 = PID mà lsof in ra</span>
df -h /data | tail -1</code></pre>
<div class="out">Filesystem      Size  Used Avail Use% Mounted on
tmpfs            64M   40M   24M  63% /data
tmpfs            64M   40M   24M  63% /data
0	/data
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
sleep   5748 root    3w   REG   0,94 41943040     0 2003 /data/log/access.log (deleted)
tmpfs            64M     0   64M   0% /data</div>
<p>Mọi chi tiết của câu chuyện đều hiện ra trong output thật: sau <code>rm</code>, <code>df</code> vẫn nói dùng 40M trong khi <code>du</code> chẳng tìm thấy gì; <code>lsof +L1</code> ("những file có ít hơn 1 liên kết") gọi tên tiến trình, bộ mô tả file (file descriptor) của nó (<code>3w</code> = fd 3, mở để ghi), kích thước và <code>NLINK 0</code>; còn cắt trắng file qua <code>/proc/PID/fd/3</code> trả lại 40 MB ngay lập tức, không phải dừng tiến trình. Đọc các cột của <code>lsof</code> thế này: <code>FD</code> là số bộ mô tả kèm chế độ mở (<code>r</code>/<code>w</code>/<code>u</code>), <code>SIZE/OFF</code> là kích thước tính bằng byte, <code>NLINK</code> là file còn bao nhiêu cái tên — 0 là không còn cái nào.</p>

<h3>Trường hợp ba: có thứ được gắn đè lên một thư mục đã có dữ liệu</h3>
${slide('lx-10', 8, 'Ổ gắn đè che dữ liệu cũ — mount --bind để nhìn xuống')}
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
<h3>Đo thật: nhìn xuống bên dưới một điểm gắn mà không phải tháo nó ra</h3>
<p>Tháo <code>/var/lib/docker</code> trên một máy chủ đang chạy nghĩa là phải dừng Docker. Có một cách nhẹ nhàng hơn: gắn kiểu <strong>bind</strong> (bind mount) hệ thống file cha vào một chỗ khác. Một lệnh <code>mount --bind</code> trần (không phải <code>--rbind</code>) KHÔNG mang theo các điểm gắn lồng bên trong, nên qua đường dẫn mới bạn thấy được thứ thật sự nằm <em>DƯỚI</em> điểm gắn. Dựng lại bằng hai tmpfs trong một container ngắn hạn:</p>
<pre><code>mount -t tmpfs -o size=100m tmpfs /srv
mkdir -p /srv/docker
head -c 30M /dev/zero &gt; /srv/docker/cu-truoc-khi-gan.img    <span class="tok-comment"># ghi TRƯỚC lần gắn kế tiếp</span>
mount -t tmpfs -o size=200m tmpfs /srv/docker                <span class="tok-comment"># "ổ dữ liệu" tới</span>
head -c 5M /dev/zero &gt; /srv/docker/moi.img
du -sh /srv; du -shx /srv
df -h /srv /srv/docker
mkdir -p /mnt/goc &amp;&amp; mount --bind /srv /mnt/goc
du -sh /mnt/goc/docker</code></pre>
<div class="out">5.0M	/srv
0	/srv
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           100M   30M   70M  30% /srv
tmpfs           200M  5.0M  195M   3% /srv/docker
30M	/mnt/goc/docker</div>
<p><code>df /srv</code> nói đã dùng 30M; <code>du</code> chỉ tìm được 5M của ổ mới (hoặc chẳng thấy gì với <code>-x</code>). Qua điểm gắn bind, 30M bị che lộ ra. Trên máy chủ thật, cách tương đương là <code>sudo mount --bind / /mnt/goc</code> rồi <code>sudo du -xh -d1 /mnt/goc/var/lib/docker</code>; xong thì gỡ bằng <code>sudo umount /mnt/goc</code>. Nguyên nhân thường gặp là một dịch vụ đã bắt đầu ghi trước khi ổ dữ liệu được gắn — lúc khởi động, hoặc vì một dòng trong <code>/etc/fstab</code> bị sai.</p>

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
${slide('lx-10', 9, 'Sự cố thật: cache build 7,6 GB và Postgres chung một đĩa; thứ tự dọn')}
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
<div class="callout">Phép kiểm đó tồn tại vì một kiểu hỏng có thật: một bản dựng hết chỗ giữa chừng để lại một ảnh ghi dở, một bộ đệm lớp bị hỏng, hoặc — tệ hơn — một cơ sở dữ liệu không xả được bộ đệm. Ngày 18/08/2026 chính dự án này dính đúng chuyện đó: bộ đệm dựng đã phình lên 7,6 GB trên cùng cái đĩa chứa Postgres, một lần deploy chết với <code>no space left on device</code> ngay lúc <code>next build</code> đang chạy, và đĩa tụt xuống còn 1,8 GB. Năm dòng điều kiện tiên quyết lẽ ra đã biến một sự cố thành một lời từ chối.</div>
<h3>Cái chốt chặn, viết sao cho nó không thể làm tròn mà lọt qua</h3>
<p>Chốt chặn ở trên dùng <code>-BG</code>, và phép đo ở đầu bài đã cho thấy <code>-BG</code> làm tròn lên: còn 4,01 GB trống thì in ra <code>5G</code> và qua được phép kiểm "ít nhất 5 GB". Hãy so bằng megabyte, nêu rõ đường dẫn, và trả về một mã lỗi mà nơi gọi xử lý được:</p>
<pre><code>can_deploy() {                                  <span class="tok-comment"># cách dùng: can_deploy SỐ_MB_CẦN ĐƯỜNG_DẪN</span>
  local need_mb=$1 path=$2 avail_mb
  avail_mb=$(df -BM --output=avail "$path" | tail -1 | tr -dc 0-9)
  if (( avail_mb &lt; need_mb )); then
    echo "từ chối: $path còn \${avail_mb}MB, cần \${need_mb}MB" &gt;&amp;2
    return 1
  fi
  echo "ok: còn \${avail_mb}MB"
}
can_deploy 40 /data; echo "rc=$?"
can_deploy 10 /data; echo "rc=$?"</code></pre>
<div class="out">từ chối: /data còn 26MB, cần 40MB
rc=1
ok: còn 26MB
rc=0</div>
<p>Dự án thật đã sửa sự cố này thế nào, để ghi lại: ảnh giờ được dựng trên một máy khác và VPS chỉ việc kéo về (nên nó không còn giữ bộ đệm dựng nào), một việc chạy hằng tuần dọn đĩa, và script deploy từ chối chạy khi chỗ trống xuống dưới một mức sàn. Ba lớp, vì mỗi lớp đứng một mình đều đã từng hỏng một lần.</p>

<h3>Chạy thử từng bước</h3>
<p>Cả ba trường hợp "vô hình" ngay trên máy bạn trong mười phút, bên trong một container vứt đi (Docker Desktop trên Mac/Windows, hoặc Docker trên Linux). Không có gì đụng tới đĩa thật của bạn:</p>
<pre><code>docker run -it --rm --tmpfs /data:rw,size=64m,nr_inodes=2000 ubuntu:24.04 bash
<span class="tok-comment"># bên trong container:</span>
apt-get update -qq &amp;&amp; apt-get install -y -qq lsof &gt;/dev/null
df -h /data; df -i /data                                   <span class="tok-comment"># 1. hai kiểu "đầy" khác nhau</span>
mkdir /data/s; i=0; while touch /data/s/f$i 2&gt;/dev/null; do i=$((i+1)); done
df -h /data | tail -1; df -i /data | tail -1; rm -rf /data/s
mkdir /data/log; head -c 40M /dev/urandom &gt; /data/log/a.log  <span class="tok-comment"># 2. đã xoá mà vẫn mở</span>
sleep 3000 3&gt;&gt;/data/log/a.log &amp;
rm /data/log/a.log; df -h /data | tail -1; lsof -nP +L1
truncate -s 0 /proc/$!/fd/3; df -h /data | tail -1
exit</code></pre>
<p><code>$!</code> là PID của công việc chạy nền gần nhất (Bài 5.4), nên bạn không phải chép nó từ <code>lsof</code>. Trường hợp ổ gắn đè cần một container chạy với <code>--cap-add SYS_ADMIN</code>, vì gắn ổ là thao tác đặc quyền; hãy lặp lại các lệnh ở mục "Đo thật: nhìn xuống bên dưới một điểm gắn" trong đó.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Việc</th><th>Ubuntu / WSL2</th><th>macOS (đo trên macOS 27)</th></tr>
<tr><td>Tổng theo một tầng</td><td><code>du -h --max-depth=1</code> hoặc <code>du -h -d1</code></td><td>chỉ có <code>du -h -d 1</code> — <code>--max-depth</code> báo "unrecognized option"</td></tr>
<tr><td>Sắp xếp kích thước dễ đọc</td><td><code>sort -h</code></td><td><code>sort -h</code> chạy được (Apple sort 2.3)</td></tr>
<tr><td>Inode</td><td><code>df -i</code>, <code>du --inodes</code></td><td><code>df</code> in sẵn <code>iused</code>/<code>ifree</code>; không có <code>du --inodes</code></td></tr>
<tr><td>Hệ thống file nào mới là "cái đĩa"</td><td><code>/</code></td><td><code>/</code> là một bản chụp hệ thống chỉ-đọc (dùng 13 GiB); file của bạn nằm trên <code>/System/Volumes/Data</code> (dùng 493 GiB trên chiếc Mac này)</td></tr>
<tr><td>Đã xoá mà vẫn mở</td><td><code>lsof +L1</code></td><td><code>lsof +L1</code> chạy y hệt</td></tr>
<tr><td>Cây tương tác</td><td><code>ncdu</code></td><td><code>brew install ncdu</code></td></tr>
</table>
<p>Đo trên Mac: <code>df -h /</code> báo dùng <code>13Gi</code> trên một cái đĩa thật ra đã đầy quá nửa, vì <code>/</code> là ổ hệ thống đã niêm phong; <code>df -h /System/Volumes/Data</code> mới là con số thật, và nó dùng chung chỗ trống với <code>/</code> (cả hai cùng báo còn <code>396Gi</code>). Trên WSL2, <code>df -h /</code> bên trong Linux mô tả ổ đĩa ảo của bản phân phối, thứ mà Microsoft ghi rõ là tự phình theo nhu cầu tới mức tối đa mặc định 1 TB — nên cột "Size" của nó là cái trần ấy, không phải chỗ trống còn lại trên ổ C:. Khi WSL nói còn thừa chỗ, hãy kiểm chính Windows (Explorer, hoặc <code>Get-PSDrive C</code> trong PowerShell).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lần deploy của nhóm trên máy chủ SWP391 hỏng với "No space left on device". Hãy dựng lại tình huống trong một container và tìm ra đó là kiểu "đầy" nào trong hai kiểu — trước khi xoá bất cứ thứ gì.</p><ol>
<li>Chạy <code>docker run -it --rm --tmpfs /data:rw,size=64m,nr_inodes=2000 ubuntu:24.04 bash</code> rồi dựng cái app: <code>mkdir -p /data/app/{logs,cache,uploads}; head -c 30M /dev/zero &gt; /data/app/cache/build.bin; head -c 8M /dev/zero &gt; /data/app/logs/app.log; for i in $(seq 1 1900); do : &gt; /data/app/uploads/thumb$i.jpg; done</code>.</li>
<li>Chạy <code>df -h /data</code> và <code>df -i /data</code>. Cái nào gần 100% hơn?</li>
<li>Tìm thủ phạm cho từng cái: <code>du -h -d1 /data/app | sort -h</code> và <code>du --inodes -d1 /data/app | sort -n</code>.</li>
<li>Dán hàm <code>can_deploy</code> của bài này vào, rồi chạy <code>can_deploy 40 /data</code> và <code>can_deploy 10 /data</code>, in <code>$?</code> sau mỗi lệnh.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được "byte 60%, inode 96% — thư mục uploads với 1901 inode mới là vấn đề, trong khi <code>cache</code> lớn nhất tính theo byte (30M)", và cái chốt từ chối 40 MB (<code>rc=1</code>) nhưng chấp nhận 10 MB (<code>rc=0</code>).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filesystem (hệ thống file)</span><span class="v">Cấu trúc trên một đĩa hay phân vùng biến các khối thành file và thư mục (ext4, xfs, btrfs, tmpfs).</span></div>
  <div class="kv"><span class="k">Block (khối)</span><span class="v">Đơn vị mà hệ thống file dùng để cấp chỗ; <code>df</code> đếm số khối đã cấp.</span></div>
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Bản ghi mô tả một file (kích thước, chủ, dữ liệu nằm đâu). Trên ext4 số lượng của nó là cố định.</span></div>
  <div class="kv"><span class="k">Mount point (điểm gắn)</span><span class="v">Thư mục nơi một hệ thống file được gắn vào; thứ có sẵn bên trong bị che khuất khi ổ còn gắn đó.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn kiểu bind)</span><span class="v">Gắn một thư mục có sẵn vào đường dẫn thứ hai — ở đây là cách để nhìn xuống dưới một điểm gắn.</span></div>
  <div class="kv"><span class="k">Deleted but open (đã xoá mà vẫn mở)</span><span class="v">File không còn cái tên nào (NLINK 0) nhưng dữ liệu còn sống vì một tiến trình vẫn đang mở nó.</span></div>
  <div class="kv"><span class="k">Sparse file (file thưa)</span><span class="v">File có kích thước khai báo lớn hơn số khối nó thật sự dùng.</span></div>
  <div class="kv"><span class="k">Reserved blocks (khối dự trữ)</span><span class="v">Phần chỗ ext4 để dành cho root (mặc định 5%) để người quản trị vẫn làm việc được trên một đĩa đầy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>df</code> đếm khối mà hệ thống file đã cấp; <code>du</code> cộng các file nó nhìn thấy — khoảng chênh giữa hai cái chính là manh mối.</li>
<li>Luôn chạy <code>df -h</code> và <code>df -i</code> cùng nhau: một cái đĩa có thể đầy 0% theo byte và 100% theo inode.</li>
<li>Lần xuống bằng <code>du -xh -d1 | sort -h</code>, mỗi tầng chỉ đọc dòng cuối, và giữ <code>-h</code> ở cả hai phía của ống dẫn.</li>
<li>File đã xoá mà một tiến trình còn mở vẫn giữ chỗ: <code>lsof +L1</code> tìm ra nó, <code>truncate -s 0</code> (qua <code>/proc/PID/fd</code> nếu cần) trả chỗ lại.</li>
<li>Dữ liệu ghi trước khi gắn ổ sẽ bị che bên dưới; một lệnh <code>mount --bind</code> trần của thư mục cha cho thấy nó mà không phải tháo ổ.</li>
<li>Script ra quyết định dựa trên chỗ trống phải dùng <code>df -BM</code> hoặc <code>-B1</code>: <code>-BG</code> làm tròn lên.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-10', 10, 'apt đi 4 chặng: kho → danh mục → .deb → dpkg')}
${slide('lx-10', 11, 'update làm mới danh mục — upgrade mới là cài')}
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

<h3>Measured: the four stages on a real Ubuntu 24.04</h3>
<p>"apt" is really four places on disk, and knowing them explains every command in this lesson: <strong>sources</strong> (where to download from), the <strong>catalogue</strong> (what exists, in which version), the <strong>download cache</strong> (the <code>.deb</code> files) and <strong>dpkg's database</strong> (what is installed, and which file belongs to which package).</p>
<pre><code>cat /etc/apt/sources.list.d/ubuntu.sources      <span class="tok-comment"># 1. sources</span>
du -sh /var/lib/apt/lists                       <span class="tok-comment"># 2. catalogue, filled by apt update</span>
ls /var/cache/apt/archives                      <span class="tok-comment"># 3. downloaded .deb files</span>
grep -c '^Package:' /var/lib/dpkg/status         <span class="tok-comment"># 4. what dpkg has installed</span>
ls /var/lib/dpkg/info/jq*</code></pre>
<div class="out">Types: deb
URIs: http://ports.ubuntu.com/ubuntu-ports/
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
…
55M	/var/lib/apt/lists
lock  partial
157
/var/lib/dpkg/info/jq.list
/var/lib/dpkg/info/jq.md5sums</div>
<p>Three things in that output are worth knowing. Ubuntu 24.04 describes its repositories in the <strong>deb822</strong> format (<code>.sources</code> files with <code>Types:</code>, <code>URIs:</code>, <code>Suites:</code>, <code>Signed-By:</code>); the old one-line <code>/etc/apt/sources.list</code> still exists but contains only a comment. The catalogue is 55 MB of indexes, which is why a Dockerfile deletes <code>/var/lib/apt/lists/*</code> in the same <code>RUN</code>. And the download cache is empty: the <code>ubuntu:24.04</code> image ships <code>/etc/apt/apt.conf.d/docker-clean</code>, which deletes every <code>.deb</code> right after installing — on a normal server they accumulate until <code>apt clean</code>. <code>jq.list</code> is the list of files the package installed (what <code>dpkg -L</code> prints), and <code>jq.md5sums</code> the checksum of each (what <code>dpkg --verify</code> compares against).</p>
<pre><code>apt update</code></pre>
<div class="out">Hit:1 http://ports.ubuntu.com/ubuntu-ports noble InRelease
Hit:2 http://ports.ubuntu.com/ubuntu-ports noble-updates InRelease
Hit:3 http://ports.ubuntu.com/ubuntu-ports noble-backports InRelease
Hit:4 http://ports.ubuntu.com/ubuntu-ports noble-security InRelease
Reading package lists...
Building dependency tree...
Reading state information...
3 packages can be upgraded. Run 'apt list --upgradable' to see them.</div>
<p><code>Hit</code> means "that index has not changed since last time", <code>Get</code> means "downloaded a newer one", and <code>Ign</code> "skipped, not an error". The last line is only a count; nothing has been installed.</p>

<h3>Installing and removing</h3>
${slide('lx-10', 12, 'remove giữ cấu hình, purge xoá, dữ liệu thì không ai xoá; dpkg -l')}
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
<h3>Measured: remove, autoremove, purge — and the two letters of dpkg -l</h3>
<pre><code>apt-get remove -y nginx-light
dpkg -l | grep nginx
apt-get autoremove --purge -y
ls -d /etc/nginx</code></pre>
<div class="out">The following packages were automatically installed and are no longer required:
  iproute2 libbpf1 libcap2-bin libelf1t64 libmnl0 libnginx-mod-http-echo
  libxtables12 nginx nginx-common
Use 'apt autoremove' to remove them.
The following packages will be REMOVED:
  nginx-light
…
Removing nginx-light (1.24.0-2ubuntu7.18) ...
ii  libnginx-mod-http-echo      1:0.63-6build2                    arm64        Bring echo and more shell style goodies to Nginx
ii  nginx                       1.24.0-2ubuntu7.18                arm64        small, powerful, scalable web/proxy server
ii  nginx-common                1.24.0-2ubuntu7.18                all          small, powerful, scalable web/proxy server - common files
Removing libnginx-mod-http-echo (1:0.63-6build2) ...
Removing nginx (1.24.0-2ubuntu7.18) ...
Removing nginx-common (1.24.0-2ubuntu7.18) ...
…
Purging configuration files for nginx-common (1.24.0-2ubuntu7.18) ...
Purging configuration files for libnginx-mod-http-echo (1:0.63-6build2) ...
ls: cannot access '/etc/nginx': No such file or directory</div>
<p>Removing the package you asked for (<code>nginx-light</code>) left the packages it had pulled in still installed, with their configuration — <code>apt</code> only <em>suggests</em> <code>autoremove</code>. That is how servers collect dead packages. The first two characters of every <code>dpkg -l</code> line are the state:</p>
<table>
<tr><th>Letters</th><th>Desired · actual</th><th>Seen when</th></tr>
<tr><td><code>ii</code></td><td>install · installed and configured</td><td>the normal case</td></tr>
<tr><td><code>rc</code></td><td>remove · only the <strong>config files</strong> remain</td><td>after <code>remove</code>; <code>purge</code> clears it</td></tr>
<tr><td><code>un</code></td><td>unknown · not installed</td><td>measured: <code>dpkg -l systemd-sysv</code> before installing it</td></tr>
<tr><td><code>iU</code> · <code>iF</code></td><td>install · unpacked / half-configured</td><td>an interrupted install ⇒ <code>sudo dpkg --configure -a</code></td></tr>
</table>
<pre><code>dpkg -l | awk '/^rc/ {print $2}'                 <span class="tok-comment"># packages that left config behind</span>
sudo apt purge $(dpkg -l | awk '/^rc/ {print $2}')  <span class="tok-comment"># clean them up, after reading the list</span></code></pre>

<h3>Finding things</h3>
${slide('lx-10', 13, 'dpkg -S/-L, apt policy, apt-mark hold')}
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
<h3>Reading apt policy and dpkg -S, measured</h3>
<pre><code>apt policy nginx
dpkg -S /usr/sbin/nginx /etc/nginx/nginx.conf
dpkg -S /usr/local/bin/foo; echo "rc=$?"</code></pre>
<div class="out">nginx:
  Installed: 1.24.0-2ubuntu7.18
  Candidate: 1.24.0-2ubuntu7.18
  Version table:
 *** 1.24.0-2ubuntu7.18 500
        500 http://ports.ubuntu.com/ubuntu-ports noble-updates/main arm64 Packages
        500 http://ports.ubuntu.com/ubuntu-ports noble-security/main arm64 Packages
        100 /var/lib/dpkg/status
     1.24.0-2ubuntu7 500
        500 http://ports.ubuntu.com/ubuntu-ports noble/main arm64 Packages
nginx: /usr/sbin/nginx
nginx-common: /etc/nginx/nginx.conf
dpkg-query: no path found matching pattern /usr/local/bin/foo
rc=1</div>
<table>
<tr><th>In the output</th><th>Meaning</th></tr>
<tr><td><code>Installed</code> / <code>Candidate</code></td><td>the version you have / the version <code>install</code> or <code>upgrade</code> would pick. Different ⇒ an upgrade is waiting.</td></tr>
<tr><td><code>***</code></td><td>marks the installed version in the table.</td></tr>
<tr><td><code>500</code></td><td>the priority of a repository. Normal repositories are 500; the highest priority wins, and among equals the newest version.</td></tr>
<tr><td><code>100 /var/lib/dpkg/status</code></td><td>"this version is what is installed" — priority 100 so that a real repository can replace it.</td></tr>
<tr><td>two lines under one version</td><td>the same version is offered by two pockets (<code>-updates</code> and <code>-security</code>): a security fix.</td></tr>
</table>
<p><code>dpkg -S</code> answers with the package name and the path, one line per match, and exits 1 when nothing owns the file. That exit code makes a useful audit: anything under <code>/usr/bin</code> that no package owns was put there by hand. <code>/usr/local</code> is meant for exactly that, which is why it is normal for <code>dpkg -S</code> to find nothing there.</p>

<h3>Pinning a version</h3>
<pre><code>sudo apt-mark hold nginx     <span class="tok-comment"># do not upgrade this one</span>
sudo apt-mark unhold nginx
apt-mark showhold</code></pre>
<div class="out">nginx
docker-ce</div>
<div class="callout warn">A hold is a promise to yourself that you will revisit it. Held packages stop receiving <strong>security updates</strong>, and unattended-upgrades skips them silently — so a hold placed to work around a bug in March is still there in December, quietly accumulating vulnerabilities. Record why in a comment or a ticket, and check <code>apt-mark showhold</code> whenever you audit a server.</div>
<h3>Measured: a hold really does block a security fix</h3>
<pre><code>apt-mark hold perl-base
apt-get -s upgrade            <span class="tok-comment"># -s: simulate</span>
apt-mark unhold perl-base</code></pre>
<div class="out">perl-base set on hold.
The following packages have been kept back:
  perl-base
The following packages will be upgraded:
  libaudit-common libaudit1
2 upgraded, 0 newly installed, 0 to remove and 1 not upgraded.
…
Canceled hold on perl-base.</div>
<p>The update waiting for <code>perl-base</code> came from <code>noble-security</code> (the <code>apt list --upgradable</code> line said <code>noble-updates,noble-security</code>), and the hold stopped it as quietly as it stops any other update: one line, "kept back". On Fedora the equivalent is <code>dnf versionlock add</code> (built into dnf5); on Homebrew, <code>brew pin</code>.</p>

<h3>Third-party repositories and keys</h3>
${slide('lx-10', 14, 'Một chữ ký bảo vệ cả chuỗi — signed-by giới hạn khoá')}
<pre><code><span class="tok-comment"># The modern, correct way: a keyring file plus a signed-by line</span>
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>signed-by=</code></span><span class="v">Scopes the key to <em>this repository only</em>. Without it, a compromised third-party key could sign a fake <code>openssh-server</code> and apt would accept it.</span></div>
  <div class="kv"><span class="k"><code>apt-key add</code></span><span class="v"><strong>Deprecated.</strong> It added keys to a global trust store with exactly the problem above. Ubuntu 24.04 (apt 2.8) still ships it but prints <code>Warning: apt-key is deprecated</code>; the apt in Debian 13 no longer has it at all. Any tutorial still using it is out of date.</span></div>
  <div class="kv"><span class="k"><code>add-apt-repository ppa:…</code></span><span class="v">Fine for Ubuntu PPAs — it handles the keyring correctly. Remember a PPA is a stranger's build server with root-equivalent trust on your machine.</span></div>
</div>
<pre><code>ls /etc/apt/sources.list.d/          <span class="tok-comment"># which third parties this machine trusts</span>
grep -r '^deb' /etc/apt/sources.list /etc/apt/sources.list.d/</code></pre>
<div class="callout">Running that on a server you inherit is a two-second audit worth doing. Every line is a party that can install software as root on the next <code>apt upgrade</code>. A repository added years ago for one tool, whose domain has since changed hands, is a real supply-chain risk — and it is also the usual cause of <code>apt update</code> failing with a signature error nobody can explain.</div>
<h3>The chain of trust, measured</h3>
<p>Why does one signing key protect thousands of packages? Because apt checks a chain, and every link can be checked by hand with ordinary tools:</p>
<pre><code>cd /var/lib/apt/lists
gpgv --keyring /usr/share/keyrings/ubuntu-archive-keyring.gpg \\
  ports.ubuntu.com_ubuntu-ports_dists_noble-security_InRelease
apt-get download jq                              <span class="tok-comment"># fetch the .deb without installing</span>
sha256sum jq_1.7.1-3ubuntu0.24.04.2_arm64.deb</code></pre>
<div class="out">gpgv: Signature made Mon Sep 28 14:43:42 2026 UTC
gpgv:                using RSA key F6ECB3762474EDA9D21B7022871920D1991BC93C
gpgv: Good signature from "Ubuntu Archive Automatic Signing Key (2018) &lt;ftpmaster@ubuntu.com&gt;"
W: Download is performed unsandboxed as root as file '/var/lib/apt/lists/jq_1.7.1-3ubuntu0.24.04.2_arm64.deb' couldn't be accessed by user '_apt'. …
d26709d728bf14016eac6ec5e56f88027b1751dffe1471e8cda3f6f8a0c8c1dc  jq_1.7.1-3ubuntu0.24.04.2_arm64.deb</div>
<p>The <code>InRelease</code> file is signed by the key that <code>Signed-By</code> points to, and it lists the SHA-256 of every <code>Packages</code> index. Each <code>Packages</code> index lists, for every package, its file name and SHA-256 — for jq, <code>SHA256: d26709d7…c8c1dc</code>, exactly the hash computed above. So a tampered <code>.deb</code> fails the hash, a tampered index fails the hash in <code>InRelease</code>, and a tampered <code>InRelease</code> fails the signature. That is also why <code>signed-by</code> matters: it decides <em>which key</em> is allowed to sign the top of each chain.</p>
<h3>PPAs: when one is acceptable</h3>
<p>A PPA (Personal Package Archive) is a repository on Launchpad built from one person's or one team's uploads. <code>sudo add-apt-repository ppa:owner/name</code> adds it correctly (on 24.04 it writes a deb822 <code>.sources</code> file with its own key), but correct installation is not the same as trust: every package in it installs as root, and it can replace an Ubuntu package with a higher version number. Before adding one, check four things: it is run by the project itself (the upstream developers' official PPA, not "someone's build"), it has been updated recently, it publishes for your Ubuntu release (<code>noble</code>), and you have written down why it is there. When a vendor offers an official repository (Docker, PostgreSQL, Node.js), prefer that with <code>signed-by</code>; when it offers neither, a container image or a single verified download is often safer than a new repository.</p>

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
${slide('lx-10', 16, 'Cùng việc, bốn trình quản lý gói: apt · dnf · brew')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>apt update</code></span><span class="v"><code>dnf check-update</code> — dnf usually refreshes metadata automatically.</span></div>
  <div class="kv"><span class="k"><code>apt upgrade</code></span><span class="v"><code>dnf upgrade</code></span></div>
  <div class="kv"><span class="k"><code>apt install X</code></span><span class="v"><code>dnf install X</code></span></div>
  <div class="kv"><span class="k"><code>apt purge X</code></span><span class="v"><code>dnf remove X</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -S file</code></span><span class="v"><code>rpm -qf file</code> · <code>dnf provides /path/to/file</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -L pkg</code></span><span class="v"><code>rpm -ql pkg</code></span></div>
</div>
<p>dnf has one feature apt lacks and it is a good one: <code>dnf history</code> lists every transaction, and <code>dnf history undo &lt;id&gt;</code> reverses it. On Debian and Ubuntu the nearest equivalent is reading <code>/var/log/apt/history.log</code> and undoing it by hand.</p>
<pre><code><span class="tok-comment"># Fedora 44, dnf5 — measured, as an ordinary user</span>
rpm -qf /usr/bin/bash
dnf history list | head -3</code></pre>
<div class="out">bash-5.3.9-3.fc44.x86_64
ID Command line                           Date and time       Action(s) Altered
30 dnf install -y tailscale               2026-09-19 13:15:21                 1
29 dnf install -y tesseract               2026-08-24 09:43:19                 5</div>
<p>Fedora 44 runs <strong>dnf5</strong> (<code>dnf --version</code> prints <code>dnf5 version 5.4.2.1</code>), a rewrite in C++; the commands you type are the same, and <code>versionlock</code> is now built in rather than a plugin. On macOS the equivalent is Homebrew: <code>brew install</code>, <code>brew upgrade</code>, <code>brew list jq</code> (files of a package), <code>brew pin</code> (hold) and <code>brew cleanup</code> (clear the download cache). Homebrew installs into its own prefix (<code>/opt/homebrew</code> on Apple silicon) and never touches the system's <code>/usr</code>.</p>

<h3>What not to install globally</h3>
<h3>Verifying a download: sha256sum and gpg</h3>
${slide('lx-10', 15, 'File tải về: sha256sum -c, rồi gpg --verify file tổng')}
<p>Not everything comes from apt. A binary from GitHub Releases, an ISO, an installer script — each arrives with no chain of trust unless you check it yourself. Projects publish a <strong>checksum file</strong> (a list of SHA-256 hashes) next to the downloads, and serious ones also <strong>sign</strong> that file. Two commands cover both.</p>
<pre><code>curl -fLO https://github.com/jqlang/jq/releases/download/jq-1.8.1/jq-linux-arm64
curl -fLO https://github.com/jqlang/jq/releases/download/jq-1.8.1/sha256sum.txt
sha256sum -c --ignore-missing sha256sum.txt; echo "exit=$?"
printf x &gt;&gt; jq-linux-arm64                     <span class="tok-comment"># simulate a corrupted or swapped file</span>
sha256sum -c --ignore-missing sha256sum.txt; echo "exit=$?"</code></pre>
<div class="out">jq-linux-arm64: OK
exit=0
sha256sum: WARNING: 1 computed checksum did NOT match
sha256sum: sha256sum.txt: no file was verified
jq-linux-arm64: FAILED
exit=1</div>
<table>
<tr><th>Form</th><th>What it does</th></tr>
<tr><td><code>sha256sum FILE</code></td><td>prints the hash and the name: <code>6bc62f25…  jq-linux-arm64</code></td></tr>
<tr><td><code>sha256sum -c LIST</code></td><td>re-computes every file named in LIST and prints OK/FAILED; exit 1 if any fails or is missing</td></tr>
<tr><td><code>--ignore-missing</code></td><td>skip entries for files you did not download (the jq list has 26 lines, one per platform) — without it, measured: exit 1 because 25 files are "missing"</td></tr>
<tr><td><code>echo "HASH  FILE" | sha256sum -c -</code></td><td>check one hash copied from a web page (two spaces between hash and name; <code>-</code> = read the list from stdin)</td></tr>
<tr><td><code>--quiet</code> · <code>--status</code></td><td>print only failures · print nothing, use the exit code</td></tr>
</table>
<p>A checksum only proves the file matches the list. If an attacker controls the download server, they replace both. A <strong>signature</strong> on the list closes that gap, because the attacker does not have the signing key. Ubuntu's own ISO list is the classic example:</p>
<pre><code>curl -fLO https://releases.ubuntu.com/24.04/SHA256SUMS
curl -fLO https://releases.ubuntu.com/24.04/SHA256SUMS.gpg
gpg --verify SHA256SUMS.gpg SHA256SUMS                 <span class="tok-comment"># first try: no key yet</span>
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 843938DF228D22F7B3742BC0D94AA3F0EFE21092
gpg --verify SHA256SUMS.gpg SHA256SUMS</code></pre>
<div class="out">gpg: Signature made Tue Sep 15 19:11:12 2026 UTC
gpg:                using RSA key 843938DF228D22F7B3742BC0D94AA3F0EFE21092
gpg: Can't check signature: No public key
gpg: key D94AA3F0EFE21092: public key "Ubuntu CD Image Automatic Signing Key (2012) &lt;cdimage@ubuntu.com&gt;" imported
gpg: Good signature from "Ubuntu CD Image Automatic Signing Key (2012) &lt;cdimage@ubuntu.com&gt;" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 8439 38DF 228D 22F7 B374  2BC0 D94A A3F0 EFE2 1092</div>
<p>"Good signature" means the list was signed by that key and has not changed since. The WARNING that follows is normal and honest: gpg has no way of knowing whether the key really belongs to Ubuntu. That is your job, once — compare the fingerprint with the one published on Ubuntu's own verification page. Then run <code>sha256sum -c --ignore-missing SHA256SUMS</code> next to the ISO. Measured the other way round, changing one character of <code>SHA256SUMS</code> turns the result into <code>gpg: BAD signature from "Ubuntu CD Image Automatic Signing Key (2012) …"</code>.</p>
<div class="callout warn"><strong>On a Mac, use <code>shasum -a 256 -c</code>.</strong> macOS 27 does have a <code>sha256sum</code> (<code>/sbin/sha256sum</code>, BSD, "sha256sum (Darwin) 1.0"), and it checks lists in the GNU format — but measured with <code>--ignore-missing</code> and a list in which no file was present, it printed nothing and exited <strong>0</strong>, where GNU prints "no file was verified" and exits 1. A script that trusts that exit code would accept a download that was never checked. <code>shasum -a 256 -c --ignore-missing</code> behaves like GNU (exit 1).</div>

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

<h3>Flag table: apt, apt-get, dpkg</h3>
<table>
<tr><th>Command / flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>apt-get -y</code></td><td>answer yes to prompts (scripts, Dockerfiles)</td><td><code>apt-get install -y jq</code></td></tr>
<tr><td><code>-s</code> / <code>--simulate</code></td><td>print what would happen, change nothing</td><td><code>apt-get -s upgrade</code></td></tr>
<tr><td><code>--no-install-recommends</code></td><td>install only hard dependencies</td><td>smaller images and servers</td></tr>
<tr><td><code>-qq</code></td><td>quiet: only errors</td><td><code>apt-get update -qq</code></td></tr>
<tr><td><code>DEBIAN_FRONTEND=noninteractive</code></td><td>never open a question dialog</td><td>every unattended install</td></tr>
<tr><td><code>apt list --installed</code> · <code>--upgradable</code></td><td>what is installed · what can be upgraded</td><td><code>apt list --upgradable</code></td></tr>
<tr><td><code>apt-mark showmanual</code></td><td>packages someone asked for explicitly</td><td>measured: 91 in a fresh <code>ubuntu:24.04</code></td></tr>
<tr><td><code>apt-get download X</code></td><td>fetch the <code>.deb</code> into the current directory</td><td>inspect before installing</td></tr>
<tr><td><code>dpkg -l [X]</code></td><td>installed packages with their two-letter state</td><td><code>dpkg -l | grep '^rc'</code></td></tr>
<tr><td><code>dpkg -L X</code> · <code>dpkg -S PATH</code></td><td>files of a package · package of a file</td><td><code>dpkg -S $(which jq)</code></td></tr>
<tr><td><code>dpkg -c file.deb</code></td><td>list what a <code>.deb</code> would install, without installing</td><td>before a manual <code>dpkg -i</code></td></tr>
<tr><td><code>dpkg --verify X</code></td><td>compare installed files against <code>md5sums</code></td><td>measured: a modified file shows <code>??5??????</code>; the exit code stayed 0, so read the output</td></tr>
</table>

<h3>Try it step by step</h3>
<pre><code>docker run -it --rm ubuntu:24.04 bash
<span class="tok-comment"># inside:</span>
apt-get update -qq
apt list --upgradable 2&gt;/dev/null | head -5
apt-get install -y -qq --no-install-recommends jq &gt;/dev/null
dpkg -S "$(command -v jq)"; dpkg -L jq | head -5
apt policy jq
pkg=$(apt list --upgradable 2&gt;/dev/null | sed -n '2s,/.*,,p'); echo "$pkg"
apt-mark hold "$pkg"; apt-get -s upgrade | grep -A1 'kept back'; apt-mark unhold "$pkg"
cat /var/log/apt/history.log | tail -5
exit</code></pre>
<p>Each line is one idea from this lesson: refresh the catalogue, look before upgrading, install without extras, map file ⇄ package, read the policy, hold the first upgradable package and watch it be kept back, and find the history of what was done. The container disappears on <code>exit</code>, so nothing you try here can damage your system.</p>

<h3>On macOS and WSL: what is different</h3>
<p>WSL2 runs a real Ubuntu, so everything in this lesson applies unchanged inside it — including <code>apt</code>, <code>dpkg</code> and <code>signed-by</code>. Two WSL habits to avoid: installing Linux tools into Windows paths (<code>/mnt/c/…</code>) and mixing Windows <code>node</code>/<code>python</code> with the Linux ones (check with <code>which -a node</code>; the Linux one should come first). On macOS there is no system package manager for command-line tools; Homebrew fills the role (Homebrew 7.0.6 measured), with the table on slide 16 as the translation. For downloads, remember the measured difference: <code>shasum -a 256 -c</code>, not the BSD <code>sha256sum</code>, when a script depends on the exit code.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you inherit your team's old Ubuntu server and must write a one-page audit of "what software is on it and who can change it" before the next deploy. Do it on a throw-away <code>ubuntu:24.04</code> container.</p><ol>
<li>List who can install software as root: <code>ls /etc/apt/sources.list.d/</code> and <code>grep -rhE '^(URIs|Suites|Signed-By)' /etc/apt/sources.list.d/ | sort -u</code>. Is every source scoped with <code>Signed-By</code>?</li>
<li>Create a file nobody manages: <code>printf '#!/bin/sh\\n' &gt; /usr/local/bin/tool; chmod +x /usr/local/bin/tool</code>. Then for <code>/usr/bin/curl</code> (install curl first) and <code>/usr/local/bin/tool</code> run <code>dpkg -S</code> and print "no package" when it fails.</li>
<li>Check holds and hand-installed packages: <code>apt-mark showhold</code>, <code>apt-mark showmanual | wc -l</code>.</li>
<li>Download jq 1.8.1 and its <code>sha256sum.txt</code> from GitHub Releases, verify with <code>sha256sum -c --ignore-missing</code>, then append one byte and verify again.</li></ol>
<p><strong>Done when:</strong> your audit has four lines — sources (one, signed by the Ubuntu archive key), <code>curl: /usr/bin/curl</code> versus "no package: /usr/local/bin/tool", the number of holds and manual packages — and you have seen <code>jq-linux-arm64: OK</code> (exit 0) followed by <code>FAILED</code> (exit 1).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Repository</span><span class="v">A server of packages plus signed indexes; configured in <code>/etc/apt/sources.list.d/</code>.</span></div>
  <div class="kv"><span class="k">Catalogue / index</span><span class="v">The downloaded lists of available packages and versions in <code>/var/lib/apt/lists</code>; <code>apt update</code> refreshes it.</span></div>
  <div class="kv"><span class="k">Dependency</span><span class="v">Another package a package needs; apt installs it automatically and marks it "automatic".</span></div>
  <div class="kv"><span class="k">Conffile</span><span class="v">A configuration file shipped by a package, kept by <code>remove</code> and deleted by <code>purge</code>.</span></div>
  <div class="kv"><span class="k">Hold / pin</span><span class="v">Telling the package manager to keep a package at its current version — including skipping security fixes.</span></div>
  <div class="kv"><span class="k">Checksum (hash)</span><span class="v">A short fingerprint of a file's content; SHA-256 changes completely if one byte changes.</span></div>
  <div class="kv"><span class="k">Signature</span><span class="v">Proof, made with a private key, that a file comes from the key's owner and has not changed.</span></div>
  <div class="kv"><span class="k">Fingerprint</span><span class="v">The unique identifier of a public key; compare it with the official one before trusting a key.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>apt works in four stages — sources, catalogue, <code>.deb</code> cache, dpkg's database — and <code>apt update</code> only refreshes the catalogue.</li>
<li><code>remove</code> keeps configuration (state <code>rc</code>), <code>purge</code> deletes it, <code>autoremove</code> cleans orphans, and no package command deletes your data.</li>
<li><code>dpkg -S</code> / <code>dpkg -L</code> map files and packages; <code>apt policy</code> explains which version wins and from which repository.</li>
<li>A hold stops security fixes too: audit with <code>apt-mark showhold</code>.</li>
<li>Scope every third-party key with <code>signed-by</code>; one signature on <code>InRelease</code> protects the whole chain down to each <code>.deb</code>.</li>
<li>For downloads: <code>sha256sum -c --ignore-missing</code>, then <code>gpg --verify</code> of the checksum list and a fingerprint compared by eye; on a Mac, <code>shasum -a 256 -c</code>.</li>
</ul>

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
<a class="link-card" href="https://ubuntu.com/tutorials/how-to-verify-ubuntu" target="_blank" rel="noopener">
  <span class="lc-ico">🔏</span>
  <span class="lc-body"><span class="lc-title">Ubuntu — how to verify your download</span><span class="lc-sub">The official walk-through of <code>SHA256SUMS</code>, <code>SHA256SUMS.gpg</code> and the key fingerprint to compare against.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/sha256sum.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">sha256sum(1)</span><span class="lc-sub"><code>-c</code>, <code>--ignore-missing</code>, <code>--quiet</code>, <code>--status</code> and the exact format of a checksum line.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-10', 10, 'apt đi 4 chặng: kho → danh mục → .deb → dpkg')}
${slide('lx-10', 11, 'update làm mới danh mục — upgrade mới là cài')}
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

<h3>Đo thật: bốn chặng trên một Ubuntu 24.04 thật</h3>
<p>"apt" thật ra là bốn chỗ trên đĩa, và biết bốn chỗ đó là giải thích được mọi lệnh trong bài này: <strong>nguồn</strong> (tải từ đâu), <strong>danh mục</strong> (có gì, bản nào), <strong>bộ đệm tải về</strong> (các file <code>.deb</code>) và <strong>cơ sở dữ liệu của dpkg</strong> (cái gì đã cài, file nào thuộc gói nào).</p>
<pre><code>cat /etc/apt/sources.list.d/ubuntu.sources      <span class="tok-comment"># 1. nguồn</span>
du -sh /var/lib/apt/lists                       <span class="tok-comment"># 2. danh mục, do apt update đổ đầy</span>
ls /var/cache/apt/archives                      <span class="tok-comment"># 3. các file .deb đã tải</span>
grep -c '^Package:' /var/lib/dpkg/status         <span class="tok-comment"># 4. dpkg đã cài những gì</span>
ls /var/lib/dpkg/info/jq*</code></pre>
<div class="out">Types: deb
URIs: http://ports.ubuntu.com/ubuntu-ports/
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
…
55M	/var/lib/apt/lists
lock  partial
157
/var/lib/dpkg/info/jq.list
/var/lib/dpkg/info/jq.md5sums</div>
<p>Có ba điều đáng biết trong output đó. Ubuntu 24.04 mô tả các kho của nó theo định dạng <strong>deb822</strong> (file <code>.sources</code> với <code>Types:</code>, <code>URIs:</code>, <code>Suites:</code>, <code>Signed-By:</code>); file một-dòng-một-kho <code>/etc/apt/sources.list</code> kiểu cũ vẫn còn nhưng chỉ chứa một dòng chú thích. Danh mục là 55 MB chỉ mục, và đó là lý do một Dockerfile xoá <code>/var/lib/apt/lists/*</code> ngay trong cùng lệnh <code>RUN</code>. Còn bộ đệm tải về thì rỗng: ảnh <code>ubuntu:24.04</code> có sẵn <code>/etc/apt/apt.conf.d/docker-clean</code>, thứ xoá mọi file <code>.deb</code> ngay sau khi cài — trên một máy chủ bình thường chúng tích lại cho tới khi bạn <code>apt clean</code>. <code>jq.list</code> là danh sách file mà gói đã cài ra (thứ <code>dpkg -L</code> in ra), còn <code>jq.md5sums</code> là mã băm của từng file (thứ <code>dpkg --verify</code> đem ra so).</p>
<pre><code>apt update</code></pre>
<div class="out">Hit:1 http://ports.ubuntu.com/ubuntu-ports noble InRelease
Hit:2 http://ports.ubuntu.com/ubuntu-ports noble-updates InRelease
Hit:3 http://ports.ubuntu.com/ubuntu-ports noble-backports InRelease
Hit:4 http://ports.ubuntu.com/ubuntu-ports noble-security InRelease
Reading package lists...
Building dependency tree...
Reading state information...
3 packages can be upgraded. Run 'apt list --upgradable' to see them.</div>
<p><code>Hit</code> nghĩa là "chỉ mục đó không đổi từ lần trước", <code>Get</code> là "đã tải bản mới hơn", còn <code>Ign</code> là "bỏ qua, không phải lỗi". Dòng cuối chỉ là một con số đếm; chưa có gì được cài cả.</p>

<h3>Cài và gỡ</h3>
${slide('lx-10', 12, 'remove giữ cấu hình, purge xoá, dữ liệu thì không ai xoá; dpkg -l')}
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
<h3>Đo thật: remove, autoremove, purge — và hai chữ cái của dpkg -l</h3>
<pre><code>apt-get remove -y nginx-light
dpkg -l | grep nginx
apt-get autoremove --purge -y
ls -d /etc/nginx</code></pre>
<div class="out">The following packages were automatically installed and are no longer required:
  iproute2 libbpf1 libcap2-bin libelf1t64 libmnl0 libnginx-mod-http-echo
  libxtables12 nginx nginx-common
Use 'apt autoremove' to remove them.
The following packages will be REMOVED:
  nginx-light
…
Removing nginx-light (1.24.0-2ubuntu7.18) ...
ii  libnginx-mod-http-echo      1:0.63-6build2                    arm64        Bring echo and more shell style goodies to Nginx
ii  nginx                       1.24.0-2ubuntu7.18                arm64        small, powerful, scalable web/proxy server
ii  nginx-common                1.24.0-2ubuntu7.18                all          small, powerful, scalable web/proxy server - common files
Removing libnginx-mod-http-echo (1:0.63-6build2) ...
Removing nginx (1.24.0-2ubuntu7.18) ...
Removing nginx-common (1.24.0-2ubuntu7.18) ...
…
Purging configuration files for nginx-common (1.24.0-2ubuntu7.18) ...
Purging configuration files for libnginx-mod-http-echo (1:0.63-6build2) ...
ls: cannot access '/etc/nginx': No such file or directory</div>
<p>Gỡ đúng cái gói bạn yêu cầu (<code>nginx-light</code>) vẫn để lại những gói mà nó đã kéo theo, còn nguyên, kèm cả cấu hình — <code>apt</code> chỉ <em>GỢI Ý</em> <code>autoremove</code>. Máy chủ gom dần gói chết theo đúng cách đó. Hai ký tự đầu của mỗi dòng <code>dpkg -l</code> là trạng thái:</p>
<table>
<tr><th>Hai chữ</th><th>Mong muốn · thực tế</th><th>Gặp khi</th></tr>
<tr><td><code>ii</code></td><td>cài · đã cài và cấu hình xong</td><td>trường hợp bình thường</td></tr>
<tr><td><code>rc</code></td><td>gỡ · chỉ còn lại <strong>file cấu hình</strong></td><td>sau <code>remove</code>; <code>purge</code> dọn nốt</td></tr>
<tr><td><code>un</code></td><td>không rõ · chưa cài</td><td>đo thật: <code>dpkg -l systemd-sysv</code> trước khi cài nó</td></tr>
<tr><td><code>iU</code> · <code>iF</code></td><td>cài · mới giải nén / cấu hình dở</td><td>một lần cài bị ngắt ⇒ <code>sudo dpkg --configure -a</code></td></tr>
</table>
<pre><code>dpkg -l | awk '/^rc/ {print $2}'                 <span class="tok-comment"># những gói còn bỏ lại cấu hình</span>
sudo apt purge $(dpkg -l | awk '/^rc/ {print $2}')  <span class="tok-comment"># dọn chúng, sau khi đã đọc danh sách</span></code></pre>

<h3>Tìm mọi thứ</h3>
${slide('lx-10', 13, 'dpkg -S/-L, apt policy, apt-mark hold')}
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
<h3>Đọc apt policy và dpkg -S, đo thật</h3>
<pre><code>apt policy nginx
dpkg -S /usr/sbin/nginx /etc/nginx/nginx.conf
dpkg -S /usr/local/bin/foo; echo "rc=$?"</code></pre>
<div class="out">nginx:
  Installed: 1.24.0-2ubuntu7.18
  Candidate: 1.24.0-2ubuntu7.18
  Version table:
 *** 1.24.0-2ubuntu7.18 500
        500 http://ports.ubuntu.com/ubuntu-ports noble-updates/main arm64 Packages
        500 http://ports.ubuntu.com/ubuntu-ports noble-security/main arm64 Packages
        100 /var/lib/dpkg/status
     1.24.0-2ubuntu7 500
        500 http://ports.ubuntu.com/ubuntu-ports noble/main arm64 Packages
nginx: /usr/sbin/nginx
nginx-common: /etc/nginx/nginx.conf
dpkg-query: no path found matching pattern /usr/local/bin/foo
rc=1</div>
<table>
<tr><th>Trong output</th><th>Nghĩa</th></tr>
<tr><td><code>Installed</code> / <code>Candidate</code></td><td>bản bạn đang có / bản mà <code>install</code> hay <code>upgrade</code> sẽ chọn. Khác nhau ⇒ đang có một bản nâng cấp chờ.</td></tr>
<tr><td><code>***</code></td><td>đánh dấu bản đang cài trong bảng.</td></tr>
<tr><td><code>500</code></td><td>độ ưu tiên của một kho. Kho bình thường là 500; ưu tiên cao nhất thắng, và giữa những cái bằng nhau thì bản mới nhất thắng.</td></tr>
<tr><td><code>100 /var/lib/dpkg/status</code></td><td>"bản này là bản đang cài" — ưu tiên 100 để một kho thật có thể thay nó.</td></tr>
<tr><td>hai dòng dưới một phiên bản</td><td>cùng phiên bản đó được hai ngăn kho (<code>-updates</code> và <code>-security</code>) cùng cung cấp: một bản vá an ninh.</td></tr>
</table>
<p><code>dpkg -S</code> trả lời bằng tên gói và đường dẫn, mỗi kết quả một dòng, và thoát 1 khi không gói nào sở hữu file đó. Mã thoát ấy làm nên một phép rà soát hữu ích: thứ gì trong <code>/usr/bin</code> mà không gói nào sở hữu là do ai đó tự tay đặt vào. <code>/usr/local</code> sinh ra chính cho việc đó, nên <code>dpkg -S</code> không tìm thấy gì ở đó là bình thường.</p>

<h3>Ghim một phiên bản</h3>
<pre><code>sudo apt-mark hold nginx     <span class="tok-comment"># đừng nâng cấp cái này</span>
sudo apt-mark unhold nginx
apt-mark showhold</code></pre>
<div class="out">nginx
docker-ce</div>
<div class="callout warn">Một lệnh giữ (hold) là một lời hứa với chính mình rằng bạn sẽ quay lại xem xét nó. Gói bị giữ thì THÔI NHẬN <strong>bản vá an ninh</strong>, và unattended-upgrades bỏ qua chúng trong im lặng — nên một lệnh giữ đặt ra hồi tháng Ba để né một cái lỗi thì tới tháng Mười Hai vẫn còn đó, lặng lẽ tích luỹ lỗ hổng. Hãy ghi lý do vào một dòng chú thích hay một cái ticket, và hãy kiểm <code>apt-mark showhold</code> mỗi lần bạn rà soát một máy chủ.</div>
<h3>Đo thật: một lệnh giữ chặn luôn cả bản vá an ninh</h3>
<pre><code>apt-mark hold perl-base
apt-get -s upgrade            <span class="tok-comment"># -s: chỉ mô phỏng</span>
apt-mark unhold perl-base</code></pre>
<div class="out">perl-base set on hold.
The following packages have been kept back:
  perl-base
The following packages will be upgraded:
  libaudit-common libaudit1
2 upgraded, 0 newly installed, 0 to remove and 1 not upgraded.
…
Canceled hold on perl-base.</div>
<p>Bản cập nhật đang chờ cho <code>perl-base</code> đến từ <code>noble-security</code> (dòng <code>apt list --upgradable</code> ghi <code>noble-updates,noble-security</code>), và lệnh giữ chặn nó lặng lẽ y như chặn mọi bản cập nhật khác: đúng một dòng, "kept back". Trên Fedora thứ tương đương là <code>dnf versionlock add</code> (có sẵn trong dnf5); trên Homebrew là <code>brew pin</code>.</p>

<h3>Kho của bên thứ ba và khoá GPG</h3>
${slide('lx-10', 14, 'Một chữ ký bảo vệ cả chuỗi — signed-by giới hạn khoá')}
<pre><code><span class="tok-comment"># Cách đời mới và đúng: một file keyring cộng với một dòng signed-by</span>
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>signed-by=</code></span><span class="v">Giới hạn cái khoá đó vào <em>ĐÚNG KHO NÀY</em>. Không có nó, một khoá bên thứ ba bị chiếm có thể ký một gói <code>openssh-server</code> giả và apt sẽ chấp nhận.</span></div>
  <div class="kv"><span class="k"><code>apt-key add</code></span><span class="v"><strong>Đã khai tử.</strong> Nó thêm khoá vào một kho tin cậy TOÀN CỤC với đúng cái vấn đề ở trên. Ubuntu 24.04 (apt 2.8) vẫn còn kèm lệnh này nhưng in ra <code>Warning: apt-key is deprecated</code>; apt của Debian 13 thì không còn nó nữa. Mọi bài hướng dẫn còn dùng nó là đã lỗi thời.</span></div>
  <div class="kv"><span class="k"><code>add-apt-repository ppa:…</code></span><span class="v">Ổn với PPA của Ubuntu — nó xử lý phần keyring cho đúng. Hãy nhớ một PPA là máy chủ dựng của một người lạ, mang mức tin cậy ngang root trên máy bạn.</span></div>
</div>
<pre><code>ls /etc/apt/sources.list.d/          <span class="tok-comment"># máy này đang tin những bên thứ ba nào</span>
grep -r '^deb' /etc/apt/sources.list /etc/apt/sources.list.d/</code></pre>
<div class="callout">Chạy dòng đó trên một máy chủ bạn tiếp quản là một phép rà soát hai giây rất đáng làm. Mỗi dòng là một bên có thể cài phần mềm với quyền root ở lần <code>apt upgrade</code> kế tiếp. Một cái kho thêm vào từ nhiều năm trước cho một công cụ nào đó, mà tên miền của nó từ đó đã đổi chủ, là một rủi ro chuỗi cung ứng có thật — và nó cũng là nguyên nhân thường gặp của việc <code>apt update</code> hỏng với một lỗi chữ ký mà chẳng ai giải thích nổi.</div>
<h3>Chuỗi tin cậy, đo thật</h3>
<p>Vì sao một khoá ký lại bảo vệ được hàng nghìn gói? Vì apt kiểm theo một CHUỖI, và mắt xích nào cũng tự tay kiểm lại được bằng công cụ bình thường:</p>
<pre><code>cd /var/lib/apt/lists
gpgv --keyring /usr/share/keyrings/ubuntu-archive-keyring.gpg \\
  ports.ubuntu.com_ubuntu-ports_dists_noble-security_InRelease
apt-get download jq                              <span class="tok-comment"># lấy file .deb về mà không cài</span>
sha256sum jq_1.7.1-3ubuntu0.24.04.2_arm64.deb</code></pre>
<div class="out">gpgv: Signature made Mon Sep 28 14:43:42 2026 UTC
gpgv:                using RSA key F6ECB3762474EDA9D21B7022871920D1991BC93C
gpgv: Good signature from "Ubuntu Archive Automatic Signing Key (2018) &lt;ftpmaster@ubuntu.com&gt;"
W: Download is performed unsandboxed as root as file '/var/lib/apt/lists/jq_1.7.1-3ubuntu0.24.04.2_arm64.deb' couldn't be accessed by user '_apt'. …
d26709d728bf14016eac6ec5e56f88027b1751dffe1471e8cda3f6f8a0c8c1dc  jq_1.7.1-3ubuntu0.24.04.2_arm64.deb</div>
<p>File <code>InRelease</code> được ký bằng đúng cái khoá mà <code>Signed-By</code> trỏ tới, và nó ghi mã SHA-256 của từng chỉ mục <code>Packages</code>. Mỗi chỉ mục <code>Packages</code> lại ghi, cho từng gói, tên file và mã SHA-256 — với jq là <code>SHA256: d26709d7…c8c1dc</code>, đúng y mã băm vừa tính ở trên. Vậy nên một file <code>.deb</code> bị sửa thì trượt mã băm, một chỉ mục bị sửa thì trượt mã băm ghi trong <code>InRelease</code>, còn một <code>InRelease</code> bị sửa thì trượt chữ ký. Đó cũng là lý do <code>signed-by</code> quan trọng: nó quyết định <em>KHOÁ NÀO</em> được phép ký đầu mỗi chuỗi.</p>
<h3>PPA: khi nào chấp nhận được</h3>
<p>Một PPA (Personal Package Archive — kho gói cá nhân) là một kho trên Launchpad, dựng từ những gói do một người hay một nhóm tải lên. <code>sudo add-apt-repository ppa:chủ/tên</code> thêm nó cho đúng cách (trên 24.04 nó ghi một file <code>.sources</code> kiểu deb822 kèm khoá riêng), nhưng thêm đúng cách không có nghĩa là đáng tin: mọi gói trong đó cài với quyền root, và nó thay được một gói của Ubuntu bằng một số phiên bản cao hơn. Trước khi thêm, hãy kiểm bốn điều: nó do chính dự án đó vận hành (PPA chính thức của nhóm phát triển gốc, không phải "bản dựng của ai đó"), còn được cập nhật gần đây, có phát hành cho đúng bản Ubuntu của bạn (<code>noble</code>), và bạn đã ghi lại lý do nó ở đó. Khi nhà cung cấp có kho chính thức (Docker, PostgreSQL, Node.js) thì ưu tiên kho đó kèm <code>signed-by</code>; khi chẳng có cái nào, một ảnh container hay một file tải về đã kiểm thường an toàn hơn một cái kho mới.</p>

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
${slide('lx-10', 16, 'Cùng việc, bốn trình quản lý gói: apt · dnf · brew')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>apt update</code></span><span class="v"><code>dnf check-update</code> — dnf thường tự làm mới siêu dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>apt upgrade</code></span><span class="v"><code>dnf upgrade</code></span></div>
  <div class="kv"><span class="k"><code>apt install X</code></span><span class="v"><code>dnf install X</code></span></div>
  <div class="kv"><span class="k"><code>apt purge X</code></span><span class="v"><code>dnf remove X</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -S file</code></span><span class="v"><code>rpm -qf file</code> · <code>dnf provides /đường/dẫn</code></span></div>
  <div class="kv"><span class="k"><code>dpkg -L pkg</code></span><span class="v"><code>rpm -ql pkg</code></span></div>
</div>
<p>dnf có một tính năng mà apt không có, và đó là một tính năng tốt: <code>dnf history</code> liệt kê mọi giao dịch, còn <code>dnf history undo &lt;id&gt;</code> đảo ngược nó. Trên Debian và Ubuntu thì thứ gần nhất là đọc <code>/var/log/apt/history.log</code> rồi tự tay hoàn tác.</p>
<pre><code><span class="tok-comment"># Fedora 44, dnf5 — đo thật, bằng người dùng thường</span>
rpm -qf /usr/bin/bash
dnf history list | head -3</code></pre>
<div class="out">bash-5.3.9-3.fc44.x86_64
ID Command line                           Date and time       Action(s) Altered
30 dnf install -y tailscale               2026-09-19 13:15:21                 1
29 dnf install -y tesseract               2026-08-24 09:43:19                 5</div>
<p>Fedora 44 chạy <strong>dnf5</strong> (<code>dnf --version</code> in ra <code>dnf5 version 5.4.2.1</code>), một bản viết lại bằng C++; các lệnh bạn gõ vẫn như cũ, và <code>versionlock</code> giờ có sẵn chứ không còn là plugin. Trên macOS thứ tương đương là Homebrew: <code>brew install</code>, <code>brew upgrade</code>, <code>brew list jq</code> (file của một gói), <code>brew pin</code> (giữ bản) và <code>brew cleanup</code> (dọn bộ đệm tải về). Homebrew cài vào tiền tố riêng của nó (<code>/opt/homebrew</code> trên chip Apple) và không bao giờ đụng tới <code>/usr</code> của hệ thống.</p>

<h3>Thứ không nên cài toàn cục</h3>
<h3>Kiểm một file tải về: sha256sum và gpg</h3>
${slide('lx-10', 15, 'File tải về: sha256sum -c, rồi gpg --verify file tổng')}
<p>Không phải thứ gì cũng tới từ apt. Một file chạy lấy từ GitHub Releases, một file ISO, một script cài đặt — mỗi thứ đến tay bạn mà không có chuỗi tin cậy nào, trừ khi bạn tự kiểm. Các dự án công bố một <strong>file mã băm</strong> (checksum — danh sách mã SHA-256) cạnh các file tải về, và dự án nghiêm túc còn <strong>ký</strong> file đó. Hai lệnh lo được cả hai.</p>
<pre><code>curl -fLO https://github.com/jqlang/jq/releases/download/jq-1.8.1/jq-linux-arm64
curl -fLO https://github.com/jqlang/jq/releases/download/jq-1.8.1/sha256sum.txt
sha256sum -c --ignore-missing sha256sum.txt; echo "exit=$?"
printf x &gt;&gt; jq-linux-arm64                     <span class="tok-comment"># giả lập một file hỏng hay bị tráo</span>
sha256sum -c --ignore-missing sha256sum.txt; echo "exit=$?"</code></pre>
<div class="out">jq-linux-arm64: OK
exit=0
sha256sum: WARNING: 1 computed checksum did NOT match
sha256sum: sha256sum.txt: no file was verified
jq-linux-arm64: FAILED
exit=1</div>
<table>
<tr><th>Dạng lệnh</th><th>Làm gì</th></tr>
<tr><td><code>sha256sum FILE</code></td><td>in mã băm và tên file: <code>6bc62f25…  jq-linux-arm64</code></td></tr>
<tr><td><code>sha256sum -c DANH_SÁCH</code></td><td>tính lại mọi file có tên trong danh sách và in OK/FAILED; thoát 1 nếu có file hỏng hay thiếu</td></tr>
<tr><td><code>--ignore-missing</code></td><td>bỏ qua những dòng của file bạn không tải (danh sách của jq có 26 dòng, mỗi nền tảng một dòng) — thiếu cờ này, đo thật: thoát 1 vì 25 file bị coi là "thiếu"</td></tr>
<tr><td><code>echo "MÃ  FILE" | sha256sum -c -</code></td><td>kiểm một mã băm chép từ trang web (hai dấu cách giữa mã và tên; <code>-</code> = đọc danh sách từ stdin)</td></tr>
<tr><td><code>--quiet</code> · <code>--status</code></td><td>chỉ in chỗ hỏng · không in gì, dùng mã thoát</td></tr>
</table>
<p>Mã băm chỉ chứng minh file khớp với danh sách. Nếu kẻ tấn công chiếm được máy chủ tải về, hắn thay cả hai. Một <strong>chữ ký</strong> trên danh sách lấp chỗ hổng đó, vì hắn không có khoá ký. Danh sách ISO của chính Ubuntu là ví dụ kinh điển:</p>
<pre><code>curl -fLO https://releases.ubuntu.com/24.04/SHA256SUMS
curl -fLO https://releases.ubuntu.com/24.04/SHA256SUMS.gpg
gpg --verify SHA256SUMS.gpg SHA256SUMS                 <span class="tok-comment"># lần đầu: chưa có khoá</span>
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 843938DF228D22F7B3742BC0D94AA3F0EFE21092
gpg --verify SHA256SUMS.gpg SHA256SUMS</code></pre>
<div class="out">gpg: Signature made Tue Sep 15 19:11:12 2026 UTC
gpg:                using RSA key 843938DF228D22F7B3742BC0D94AA3F0EFE21092
gpg: Can't check signature: No public key
gpg: key D94AA3F0EFE21092: public key "Ubuntu CD Image Automatic Signing Key (2012) &lt;cdimage@ubuntu.com&gt;" imported
gpg: Good signature from "Ubuntu CD Image Automatic Signing Key (2012) &lt;cdimage@ubuntu.com&gt;" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 8439 38DF 228D 22F7 B374  2BC0 D94A A3F0 EFE2 1092</div>
<p>"Good signature" nghĩa là danh sách được ký bằng khoá đó và chưa hề thay đổi từ lúc ký. Dòng WARNING theo sau là bình thường và trung thực: gpg không có cách nào biết cái khoá đó có thật sự là của Ubuntu hay không. Đó là việc của bạn, làm một lần — so vân tay (fingerprint) với vân tay công bố trên chính trang hướng dẫn kiểm file của Ubuntu. Rồi chạy <code>sha256sum -c --ignore-missing SHA256SUMS</code> ngay cạnh file ISO. Đo theo chiều ngược lại, sửa một ký tự của <code>SHA256SUMS</code> là kết quả biến thành <code>gpg: BAD signature from "Ubuntu CD Image Automatic Signing Key (2012) …"</code>.</p>
<div class="callout warn"><strong>Trên Mac, hãy dùng <code>shasum -a 256 -c</code>.</strong> macOS 27 CÓ lệnh <code>sha256sum</code> (<code>/sbin/sha256sum</code>, bản BSD, "sha256sum (Darwin) 1.0"), và nó đọc được danh sách theo định dạng GNU — nhưng đo thật với <code>--ignore-missing</code> và một danh sách trong đó không file nào có mặt, nó chẳng in gì và thoát <strong>0</strong>, trong khi GNU in "no file was verified" và thoát 1. Một script tin vào mã thoát đó sẽ chấp nhận một file chưa hề được kiểm. <code>shasum -a 256 -c --ignore-missing</code> hành xử giống GNU (thoát 1).</div>

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

<h3>Bảng cờ: apt, apt-get, dpkg</h3>
<table>
<tr><th>Lệnh / cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>apt-get -y</code></td><td>tự trả lời "có" cho mọi câu hỏi (script, Dockerfile)</td><td><code>apt-get install -y jq</code></td></tr>
<tr><td><code>-s</code> / <code>--simulate</code></td><td>in ra chuyện sẽ xảy ra, không đổi gì</td><td><code>apt-get -s upgrade</code></td></tr>
<tr><td><code>--no-install-recommends</code></td><td>chỉ cài phụ thuộc bắt buộc</td><td>ảnh và máy chủ gọn hơn</td></tr>
<tr><td><code>-qq</code></td><td>im lặng: chỉ in lỗi</td><td><code>apt-get update -qq</code></td></tr>
<tr><td><code>DEBIAN_FRONTEND=noninteractive</code></td><td>không bao giờ mở hộp thoại hỏi</td><td>mọi lần cài không người trông</td></tr>
<tr><td><code>apt list --installed</code> · <code>--upgradable</code></td><td>đã cài gì · nâng cấp được gì</td><td><code>apt list --upgradable</code></td></tr>
<tr><td><code>apt-mark showmanual</code></td><td>những gói có người yêu cầu cài tường minh</td><td>đo thật: 91 trong một <code>ubuntu:24.04</code> mới tinh</td></tr>
<tr><td><code>apt-get download X</code></td><td>tải file <code>.deb</code> về thư mục hiện tại</td><td>soi trước khi cài</td></tr>
<tr><td><code>dpkg -l [X]</code></td><td>gói đã cài kèm trạng thái hai chữ</td><td><code>dpkg -l | grep '^rc'</code></td></tr>
<tr><td><code>dpkg -L X</code> · <code>dpkg -S ĐƯỜNG_DẪN</code></td><td>file của một gói · gói của một file</td><td><code>dpkg -S $(which jq)</code></td></tr>
<tr><td><code>dpkg -c file.deb</code></td><td>liệt kê thứ một <code>.deb</code> sẽ cài, mà không cài</td><td>trước một lần <code>dpkg -i</code> bằng tay</td></tr>
<tr><td><code>dpkg --verify X</code></td><td>so các file đã cài với <code>md5sums</code></td><td>đo thật: file bị sửa hiện <code>??5??????</code>; mã thoát vẫn là 0, nên hãy đọc output</td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<pre><code>docker run -it --rm ubuntu:24.04 bash
<span class="tok-comment"># bên trong:</span>
apt-get update -qq
apt list --upgradable 2&gt;/dev/null | head -5
apt-get install -y -qq --no-install-recommends jq &gt;/dev/null
dpkg -S "$(command -v jq)"; dpkg -L jq | head -5
apt policy jq
pkg=$(apt list --upgradable 2&gt;/dev/null | sed -n '2s,/.*,,p'); echo "$pkg"
apt-mark hold "$pkg"; apt-get -s upgrade | grep -A1 'kept back'; apt-mark unhold "$pkg"
cat /var/log/apt/history.log | tail -5
exit</code></pre>
<p>Mỗi dòng là một ý của bài này: làm mới danh mục, nhìn trước khi nâng cấp, cài không kèm thứ thừa, ánh xạ file ⇄ gói, đọc policy, giữ gói đầu tiên đang chờ nâng cấp và xem nó bị "kept back", và tìm lịch sử những gì đã làm. Container biến mất khi <code>exit</code>, nên chẳng thứ gì bạn thử ở đây làm hỏng được hệ thống của bạn.</p>

<h3>Trên macOS và WSL khác gì</h3>
<p>WSL2 chạy một Ubuntu thật, nên mọi thứ trong bài này áp dụng y nguyên bên trong nó — kể cả <code>apt</code>, <code>dpkg</code> và <code>signed-by</code>. Hai thói quen WSL nên tránh: cài công cụ Linux vào đường dẫn của Windows (<code>/mnt/c/…</code>), và trộn <code>node</code>/<code>python</code> của Windows với bản của Linux (kiểm bằng <code>which -a node</code>; bản Linux phải đứng đầu). Trên macOS không có trình quản lý gói hệ thống cho công cụ dòng lệnh; Homebrew đóng vai đó (đo thật Homebrew 7.0.6), với bảng ở slide 16 làm bảng dịch. Với file tải về, nhớ khác biệt đã đo: dùng <code>shasum -a 256 -c</code>, không phải <code>sha256sum</code> bản BSD, khi một script dựa vào mã thoát.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn tiếp quản cái máy chủ Ubuntu cũ của nhóm và phải viết một trang rà soát "trên máy có phần mềm gì và ai đổi được nó" trước lần deploy tới. Làm trên một container <code>ubuntu:24.04</code> vứt đi.</p><ol>
<li>Liệt kê ai cài được phần mềm với quyền root: <code>ls /etc/apt/sources.list.d/</code> và <code>grep -rhE '^(URIs|Suites|Signed-By)' /etc/apt/sources.list.d/ | sort -u</code>. Nguồn nào cũng được giới hạn bằng <code>Signed-By</code> chưa?</li>
<li>Tạo một file không ai quản lý: <code>printf '#!/bin/sh\\n' &gt; /usr/local/bin/tool; chmod +x /usr/local/bin/tool</code>. Rồi với <code>/usr/bin/curl</code> (cài curl trước) và <code>/usr/local/bin/tool</code>, chạy <code>dpkg -S</code> và in "không gói nào" khi nó hỏng.</li>
<li>Kiểm gói bị giữ và gói cài tay: <code>apt-mark showhold</code>, <code>apt-mark showmanual | wc -l</code>.</li>
<li>Tải jq 1.8.1 và file <code>sha256sum.txt</code> của nó từ GitHub Releases, kiểm bằng <code>sha256sum -c --ignore-missing</code>, rồi nối thêm một byte và kiểm lại.</li></ol>
<p><strong>Đạt khi:</strong> bản rà soát của bạn có bốn dòng — nguồn (một, ký bằng khoá kho của Ubuntu), <code>curl: /usr/bin/curl</code> so với "không gói nào: /usr/local/bin/tool", số gói bị giữ và số gói cài tay — và bạn đã thấy <code>jq-linux-arm64: OK</code> (thoát 0) rồi tới <code>FAILED</code> (thoát 1).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Repository (kho gói)</span><span class="v">Một máy chủ chứa gói kèm các chỉ mục có chữ ký; khai trong <code>/etc/apt/sources.list.d/</code>.</span></div>
  <div class="kv"><span class="k">Index (danh mục, chỉ mục)</span><span class="v">Các danh sách gói và phiên bản đã tải về trong <code>/var/lib/apt/lists</code>; <code>apt update</code> làm mới nó.</span></div>
  <div class="kv"><span class="k">Dependency (phụ thuộc)</span><span class="v">Một gói khác mà gói này cần; apt tự cài và đánh dấu nó là "automatic".</span></div>
  <div class="kv"><span class="k">Conffile (file cấu hình của gói)</span><span class="v">File cấu hình đi kèm gói, được <code>remove</code> giữ lại và bị <code>purge</code> xoá.</span></div>
  <div class="kv"><span class="k">Hold / pin (giữ bản)</span><span class="v">Bảo trình quản lý gói giữ nguyên phiên bản hiện tại của một gói — kể cả bỏ qua bản vá an ninh.</span></div>
  <div class="kv"><span class="k">Checksum / hash (mã băm)</span><span class="v">Một "dấu vân" ngắn của nội dung file; SHA-256 đổi hoàn toàn khi chỉ một byte thay đổi.</span></div>
  <div class="kv"><span class="k">Signature (chữ ký số)</span><span class="v">Bằng chứng, tạo bằng khoá bí mật, rằng một file đến từ chủ khoá và chưa bị sửa.</span></div>
  <div class="kv"><span class="k">Fingerprint (vân tay khoá)</span><span class="v">Mã định danh duy nhất của một khoá công khai; so nó với bản chính thức trước khi tin một khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>apt làm việc qua bốn chặng — nguồn, danh mục, bộ đệm <code>.deb</code>, cơ sở dữ liệu của dpkg — và <code>apt update</code> chỉ làm mới danh mục.</li>
<li><code>remove</code> giữ cấu hình (trạng thái <code>rc</code>), <code>purge</code> xoá nó, <code>autoremove</code> dọn gói mồ côi, và không lệnh gói nào xoá dữ liệu của bạn.</li>
<li><code>dpkg -S</code> / <code>dpkg -L</code> ánh xạ file và gói; <code>apt policy</code> giải thích bản nào thắng và từ kho nào.</li>
<li>Một lệnh giữ chặn luôn cả bản vá an ninh: rà bằng <code>apt-mark showhold</code>.</li>
<li>Giới hạn mọi khoá bên thứ ba bằng <code>signed-by</code>; một chữ ký trên <code>InRelease</code> bảo vệ cả chuỗi xuống tới từng <code>.deb</code>.</li>
<li>Với file tải về: <code>sha256sum -c --ignore-missing</code>, rồi <code>gpg --verify</code> file danh sách và so vân tay bằng mắt; trên Mac dùng <code>shasum -a 256 -c</code>.</li>
</ul>

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
<a class="link-card" href="https://ubuntu.com/tutorials/how-to-verify-ubuntu" target="_blank" rel="noopener">
  <span class="lc-ico">🔏</span>
  <span class="lc-body"><span class="lc-title">Ubuntu — cách kiểm file tải về</span><span class="lc-sub">Hướng dẫn chính thức từng bước với <code>SHA256SUMS</code>, <code>SHA256SUMS.gpg</code> và vân tay khoá để đem ra so.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/sha256sum.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">sha256sum(1)</span><span class="lc-sub"><code>-c</code>, <code>--ignore-missing</code>, <code>--quiet</code>, <code>--status</code> và định dạng chính xác của một dòng mã băm.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-10', 17, 'Hai đường của log: journald hứng, file tự ghi')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">journald</span><span class="lz-lnote">A structured binary store, indexed and queryable. Everything systemd starts logs here automatically — anything a service writes to stdout or stderr is captured. Read with <code>journalctl</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Plain files in /var/log</span><span class="lz-lnote">What applications write themselves: <code>nginx/access.log</code>, <code>mysql/error.log</code>, your own app. Read with <code>less</code>, <code>tail</code>, <code>grep</code> (Chapter 3). Rotated by <code>logrotate</code>.</span></div>
</div>
<pre><code>ls /var/log/</code></pre>
<div class="out">auth.log      dpkg.log     journal/     nginx/       syslog
auth.log.1    dpkg.log.1   kern.log     postgresql/  syslog.1
auth.log.2.gz              kern.log.1                syslog.2.gz</div>
<p>Note the pattern: <code>auth.log</code> is current, <code>.1</code> is yesterday's, <code>.2.gz</code> and older are compressed. That is <code>logrotate</code>, and it means <code>grep</code> alone misses history — use <code>zgrep</code> (Lesson 3.4) to search the compressed ones too.</p>
<p>On an Ubuntu <em>server</em> the two systems overlap: the <code>rsyslog</code> package receives every journal line (Ubuntu ships a drop-in, <code>/usr/lib/systemd/journald.conf.d/syslog.conf</code>, that sets <code>ForwardToSyslog=yes</code> — measured) and writes the same lines as text into <code>/var/log/syslog</code> and <code>/var/log/auth.log</code>. So an SSH login appears in both <code>journalctl -u ssh</code> and <code>auth.log</code> — two views of one event, not two events. On Fedora the journal is the primary system log (1.7 GB of it on the machine measured for this lesson) and rsyslog is an optional extra.</p>

<h3>journalctl: the filters that matter</h3>
${slide('lx-10', 18, 'journalctl lọc theo 4 trục: unit · thời gian · mức · theo dõi')}
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

<h3>Measured: one crashing service, read four ways</h3>
<p>To get real output, this lesson ran systemd inside a short-lived Ubuntu 24.04 container (host name <code>vps</code>) with one small service: a Python program that prints a startup line, a warning and an error, then exits with code 3, and <code>Restart=on-failure</code> restarts it two seconds later. A program marks the priority of a line by starting it with <code>&lt;4&gt;</code> (warning) or <code>&lt;3&gt;</code> (error); journald strips the marker and stores the number.</p>
<pre><code>journalctl -u myapp -p err --no-pager</code></pre>
<div class="out">Sep 28 15:22:54 vps python3[163]: ERROR connection refused (db:5432)
Sep 28 15:22:59 vps python3[170]: ERROR connection refused (db:5432)
Sep 28 15:23:04 vps python3[175]: ERROR connection refused (db:5432)</div>
<pre><code>journalctl -u myapp --since "15:22:55" --until "15:23:00" --no-pager</code></pre>
<div class="out">Sep 28 15:22:55 vps systemd[1]: myapp.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
Sep 28 15:22:55 vps systemd[1]: myapp.service: Failed with result 'exit-code'.
Sep 28 15:22:57 vps systemd[1]: myapp.service: Scheduled restart job, restart counter is at 1.
Sep 28 15:22:57 vps systemd[1]: Started myapp.service - Demo app cho Bai 10.3.
Sep 28 15:22:57 vps python3[170]: listening on 127.0.0.1:3000
Sep 28 15:22:58 vps python3[170]: slow query: 2300 ms (SELECT * FROM posts)
Sep 28 15:22:59 vps python3[170]: ERROR connection refused (db:5432)</div>
<pre><code>journalctl -u myapp -p warning..err -o cat --no-pager | head -4</code></pre>
<div class="out">slow query: 2300 ms (SELECT * FROM posts)
ERROR connection refused (db:5432)
myapp.service: Failed with result 'exit-code'.
slow query: 2300 ms (SELECT * FROM posts)</div>
<p>Four things to read off these outputs. The PID in brackets changes on every restart (163, 170, 175) — that is how you <em>see</em> a restart loop in a log. <code>-p err</code> shows only the program's own error line; systemd's "Failed with result" is logged at warning (4), so it appears only once you widen to <code>warning..err</code>. <code>--since</code>/<code>--until</code> accept a bare time, meaning today, in the machine's time zone. And <code>-o cat</code> drops date, host and PID, which is what you want before <code>sort | uniq -c</code>.</p>

<h3>Priorities, and the out-of-memory kill that -p err misses</h3>
${slide('lx-10', 19, 'Mức ưu tiên 0–7: -p err bỏ sót cả lần bị OOM giết')}
<p>A second service in the same container was given <code>MemoryMax=60M</code> and a program that allocates memory until it is stopped. The journal records each line with a <code>PRIORITY</code> field, which <code>-o json</code> exposes:</p>
<pre><code>journalctl -u anram -o json | jq -r '[.PRIORITY, .MESSAGE] | @tsv'
journalctl -u anram -p err
journalctl -k | grep 'Killed process'</code></pre>
<div class="out">6	Started anram.service - Tien trinh an RAM (demo OOM).
6	bat dau nap du lieu
5	anram.service: A process of this unit has been killed by the OOM killer.
4	anram.service: Main process exited, code=killed, status=9/KILL
4	anram.service: Failed with result 'oom-kill'.
-- No entries --
Sep 28 15:22:57 vps kernel: Memory cgroup out of memory: Killed process 64868 (python3) total-vm:75860kB, anon-rss:61232kB, file-rss:5832kB, shmem-rss:0kB, UID:0 pgtables:176kB oom_score_adj:0</div>
<p>The most important line of the whole incident — "killed by the OOM killer" — is logged by systemd at <strong>notice (5)</strong>, and the exit lines at warning (4). A triage habit of <code>-u anram -p err</code> returns <em>No entries</em> for a service that died. The kernel's own line (<code>journalctl -k</code>) is at err level and names the process, but it lives outside the unit's log. The rule that follows: use <code>-p</code> to cut noise when you are hunting an error message, and drop it — or read <code>-k</code> — when a service stopped without one. (The PID in the kernel line differs from the one inside the container because the kernel counts PIDs for the whole machine.)</p>
<table>
<tr><th>Number</th><th>Name</th><th>Typical line</th></tr>
<tr><td>0 · 1 · 2</td><td><code>emerg</code> · <code>alert</code> · <code>crit</code></td><td>rare; the system itself is in trouble</td></tr>
<tr><td>3</td><td><code>err</code></td><td>an application error; the kernel's OOM kill line</td></tr>
<tr><td>4</td><td><code>warning</code></td><td>systemd "Failed with result …", "Main process exited"</td></tr>
<tr><td>5</td><td><code>notice</code></td><td>systemd "killed by the OOM killer"; normal but significant</td></tr>
<tr><td>6</td><td><code>info</code></td><td>"Started …", ordinary output on stdout</td></tr>
<tr><td>7</td><td><code>debug</code></td><td>verbose detail, often not stored</td></tr>
</table>

<h3>Beyond units: other selectors</h3>
${slide('lx-10', 20, '-o json: mỗi dòng log là một bản ghi có trường')}
<pre><code>journalctl _PID=5012                   <span class="tok-comment"># one process</span>
journalctl _UID=1001                   <span class="tok-comment"># one user</span>
journalctl /usr/sbin/nginx             <span class="tok-comment"># one executable</span>
journalctl _SYSTEMD_UNIT=ssh.service _PID=743   <span class="tok-comment"># several fields, ANDed</span>
journalctl -u nginx -u postgresql      <span class="tok-comment"># several -u: either unit (OR)</span>
journalctl _SYSTEMD_UNIT=nginx.service + _SYSTEMD_UNIT=postgresql.service   <span class="tok-comment"># + is OR between FIELD=value terms</span>
journalctl -F _SYSTEMD_UNIT | head     <span class="tok-comment"># what units exist in the journal</span></code></pre>
<p>Because the journal is structured rather than plain text, every line carries fields — the unit, the PID, the UID, the executable, the boot ID. <code>-o verbose</code> shows them all, and any of them can be a filter. This is the real advantage over text logs: you can ask "everything this PID logged" without a regex that also matches the PID appearing inside a message.</p>
<h3>Measured: fields, the + operator, and jq</h3>
<pre><code>journalctl -t deploy -p err -o json-pretty -n 1</code></pre>
<div class="out">{
	"__REALTIME_TIMESTAMP" : "1790611498019750",
	…
	"_EXE" : "/usr/bin/logger",
	"SYSLOG_IDENTIFIER" : "deploy",
	…
	"_HOSTNAME" : "vps",
	…
	"_BOOT_ID" : "6057b14370764ba893825ba704227696",
	…
	"MESSAGE" : "rollback: healthcheck 502",
	"_PID" : "362",
	…
	"_TRANSPORT" : "syslog",
	…
	"PRIORITY" : "3",
	…
}</div>
<p>Fields starting with an underscore (<code>_PID</code>, <code>_HOSTNAME</code>, <code>_SYSTEMD_UNIT</code>) are added by journald itself and cannot be faked by the program; the others (<code>MESSAGE</code>, <code>PRIORITY</code>, <code>SYSLOG_IDENTIFIER</code>) come from the sender. <code>__REALTIME_TIMESTAMP</code> is microseconds since 1970 in UTC — the journal always stores UTC, and only the display is converted. An earlier version of this lesson showed <code>journalctl -u nginx + -u postgresql</code>; measured on systemd 255 it fails:</p>
<pre><code>journalctl -u myapp + -u nginx
journalctl _SYSTEMD_UNIT=myapp.service + SYSLOG_IDENTIFIER=deploy -n 4 --no-pager</code></pre>
<div class="out">"+" can only be used between terms
Sep 28 15:23:25 vps python3[201]: ERROR connection refused (db:5432)
Sep 28 15:23:28 vps python3[203]: listening on 127.0.0.1:3000
Sep 28 15:23:29 vps python3[203]: slow query: 2300 ms (SELECT * FROM posts)
Sep 28 15:23:30 vps python3[203]: ERROR connection refused (db:5432)</div>
<p>The rules, precisely: several <code>-u</code> options are already OR (either unit); different fields are AND (<code>_SYSTEMD_UNIT=… _PID=…</code> means both); and <code>+</code> is an OR placed between <code>FIELD=value</code> terms, not between options. For counting and grouping, pipe <code>-o json</code> into <code>jq</code> (the JSON tool; <code>apt install jq</code>): <code>journalctl -u myapp -o json --since today | jq -r 'select(.PRIORITY=="3") | .MESSAGE' | sort | uniq -c | sort -rn</code> counts error messages by text.</p>

<h3>Keeping the journal from eating the disk</h3>
${slide('lx-10', 21, 'Journal cần trần: mặc định 10% đĩa, tối đa 4G')}
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
<div class="callout warn">By default journald uses up to <strong>10% of the filesystem, capped at 4 GB</strong> — so on an 80 GB disk the cap, 4 GB, is what applies (measured on a container with no configuration at all: <code>max 4.0G</code>). That is fine until it shares a disk with a database, at which point the journal quietly grows into the space Postgres needed. Set <code>SystemMaxUse</code> explicitly on every server; it takes four lines and it removes a whole class of 3am disk-full incident (Lesson 10.1).</div>
<pre><code><span class="tok-comment"># Is the journal even persistent?</span>
ls -d /var/log/journal 2&gt;/dev/null || echo "volatile — logs are lost on reboot"</code></pre>
<p>If <code>/var/log/journal</code> does not exist, journald keeps everything in <code>/run</code> — memory — and the entire log history disappears on reboot. That is the default in many container images and on some minimal installs, and it is a nasty surprise when you reboot to fix something and then cannot investigate what happened. <code>sudo mkdir -p /var/log/journal &amp;&amp; sudo systemctl restart systemd-journald</code> makes it persistent.</p>
<h3>Measured: the limit journald actually applies</h3>
<pre><code>journalctl -u systemd-journald | grep 'System Journal'     <span class="tok-comment"># no drop-in: the default</span>
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\\nSystemMaxUse=500M\\nMaxRetentionSec=1month\\n' | sudo tee /etc/systemd/journald.conf.d/10-gioi-han.conf
sudo systemctl restart systemd-journald
journalctl -u systemd-journald -n 3 | grep 'System Journal'
systemd-analyze cat-config systemd/journald.conf | tail -4</code></pre>
<div class="out">… systemd-journald[302]: System Journal (/var/log/journal/c938a30667f84ea6a797b3bac282f673) is 8.0M, max 4.0G, 3.9G free.
… systemd-journald[290]: System Journal (/var/log/journal/c938a30667f84ea6a797b3bac282f673) is 8.0M, max 500.0M, 492.0M free.
# /etc/systemd/journald.conf.d/10-gioi-han.conf
[Journal]
SystemMaxUse=500M
MaxRetentionSec=1month</div>
<p>journald announces the limit it is using every time it starts — <code>max 4.0G</code> with no configuration on a large disk, <code>max 500.0M</code> after the drop-in — so that line is the proof the setting took effect, better than re-reading the file you just wrote. <code>systemd-analyze cat-config</code> prints the main file plus every drop-in in the order they apply. <code>--vacuum-size</code> deletes only <em>archived</em> journal files; the active one stays, which is why measured here a vacuum to 1M freed 4.4M and still left 8.0M in use.</p>

<h3>logrotate: for the file-based logs</h3>
${slide('lx-10', 22, 'logrotate đổi tên file — app vẫn ghi vào inode cũ')}
<pre><code>cat /etc/logrotate.d/nginx                   <span class="tok-comment"># Ubuntu 24.04, nginx 1.24</span></code></pre>
<div class="out">/var/log/nginx/*.log {
        daily
        missingok
        rotate 14
        compress
        delaycompress
        notifempty
        create 0640 www-data adm
        sharedscripts
        prerotate
                if [ -d /etc/logrotate.d/httpd-prerotate ]; then \\
                        run-parts /etc/logrotate.d/httpd-prerotate; \\
                fi \\
        endscript
        postrotate
                invoke-rc.d nginx rotate &gt;/dev/null 2&gt;&amp;1
        endscript
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>daily</code> · <code>size 100M</code></span><span class="v">When to rotate: by schedule, or by size. <code>size</code> is safer for a log that can spike.</span></div>
  <div class="kv"><span class="k"><code>rotate 14</code></span><span class="v">How many old files to keep. This is your retention policy, and the number that decides how much disk logs may consume.</span></div>
  <div class="kv"><span class="k"><code>compress</code> · <code>delaycompress</code></span><span class="v">gzip old files; delay by one cycle so a process still writing to the just-rotated file is not confused.</span></div>
  <div class="kv"><span class="k"><code>postrotate</code></span><span class="v">Tell the process to reopen its log — here <code>invoke-rc.d nginx rotate</code>, whose init script sends nginx <code>SIGUSR1</code> (<code>start-stop-daemon --stop --signal USR1</code>), exactly the signal from Lesson 5.3. Without this the process keeps writing to the renamed file (Lesson 10.1's deleted-but-open problem).</span></div>
  <div class="kv"><span class="k"><code>copytruncate</code></span><span class="v">For programs that cannot be told to reopen: copy the file, then truncate the original in place. Simpler, but lines written during the copy are lost.</span></div>
</div>
<pre><code>sudo logrotate -d /etc/logrotate.d/nginx     <span class="tok-comment"># -d: debug, changes nothing</span>
sudo logrotate -f /etc/logrotate.d/nginx     <span class="tok-comment"># -f: force a rotation now</span>
cat /var/lib/logrotate/status | grep nginx   <span class="tok-comment"># when it last rotated</span></code></pre>
<div class="callout ok">The <code>postrotate</code> versus <code>copytruncate</code> choice is the whole design problem of log rotation. Renaming a file the process has open does not disturb it — it keeps writing into the same inode, now called <code>access.log.1</code>, and the new <code>access.log</code> stays empty forever. <code>postrotate</code> solves it properly by asking the process to reopen; <code>copytruncate</code> avoids the question at the cost of a small race. When your own application's logs stop appearing after a rotation, this is why — and the fix is to handle <code>SIGUSR1</code> or <code>SIGHUP</code>, or to log to stdout and let journald handle it.</div>
<h3>Measured: three ways to rotate a file that is still open</h3>
<p>A small script plays the application: it opens <code>app.log</code> once on file descriptor 3 and writes a line every 0.2 seconds — exactly how nginx or a Node.js logger behaves. Each rotation was forced with <code>logrotate -f</code> and a private state file (<code>-s</code>), so nothing on the system's real schedule was touched.</p>
<pre><code><span class="tok-comment"># the "app"</span>
exec 3&gt;&gt;/srv/app/log/app.log
i=0; while :; do i=$((i+1)); echo "$(date +%T) request $i" &gt;&amp;3; sleep 0.2; done</code></pre>
<pre><code><span class="tok-comment"># /srv/app/lr-create.conf — rename + create, NO postrotate</span>
/srv/app/log/app.log {
    rotate 3
    create 0640 root root
    missingok
    notifempty
}</code></pre>
<pre><code>logrotate -f -s /tmp/st1 lr-create.conf; sleep 1; wc -l log/*; sleep 2; wc -l log/*</code></pre>
<div class="out">  0 log/app.log
 10 log/app.log.1
 10 total
  0 log/app.log
 20 log/app.log.1</div>
<p>The new <code>app.log</code> stays at 0 lines while <code>app.log.1</code> keeps growing: the program is still writing to the inode that is now called <code>.1</code>. With <code>copytruncate</code> instead, logrotate copies the content and then truncates the <em>same</em> inode, so the program carries on in <code>app.log</code> (measured: 10 lines in <code>app.log</code>, 5 in the copy). With <code>create</code> plus a <code>postrotate</code> that sends the program a signal it handles by reopening the file, the result is the same without the copy:</p>
<pre><code><span class="tok-comment"># the app, version 2: write its PID, reopen fd 3 on SIGUSR1</span>
echo $$ &gt; /run/ghi.pid
mo(){ exec 3&gt;&gt;/srv/app/log/app.log; }
mo; trap mo USR1

<span class="tok-comment"># lr-post.conf</span>
/srv/app/log/app.log {
    rotate 3
    create 0640 root root
    postrotate
        kill -USR1 "$(cat /run/ghi.pid)"
    endscript
}</code></pre>
<pre><code>logrotate -v -f -s /tmp/st3 lr-post.conf 2&gt;&amp;1 | grep -iE 'renaming|creating new|running postrotate'
sleep 2; wc -l log/* | head -2</code></pre>
<div class="out">renaming /srv/app/log/app.log to /srv/app/log/app.log.1
creating new /srv/app/log/app.log mode = 0640 uid = 0 gid = 0
running postrotate script
 10 log/app.log
  5 log/app.log.1</div>
<div class="callout warn"><strong>A trap met while measuring:</strong> the first version of that <code>postrotate</code> said <code>pkill -USR1 -f ghi2.sh</code>. logrotate answered <code>error running non-shared postrotate script</code>: <code>pkill -f</code> matches full command lines, and the shell running the postrotate script had <code>ghi2.sh</code> in its own command line — so it signalled itself. It is the same family of bug as the course's <code>pkill -f "next start"</code> story (Lesson 5.3). A PID file, as above, or <code>systemctl kill -s USR1 app.service</code>, names exactly one process.</div>
<pre><code>logrotate -d -s /tmp/st lr-create.conf          <span class="tok-comment"># -d: debug = plan only</span></code></pre>
<div class="out">warning: logrotate in debug mode does nothing except printing debug messages!  Consider using verbose mode (-v) instead if this is not what you want.
reading config file lr-create.conf
…
considering log /srv/app/log/app.log
  Now: 2026-09-28 15:24
  Last rotated at 2026-09-28 15:00
  log does not need rotating (log size is below the 'size' threshold)</div>
<p><code>-d</code> prints the plan and changes nothing — the first thing to run on a new configuration. Why "does not need rotating"? The file had no schedule (<code>daily</code>/<code>weekly</code>) or <code>size</code> line of its own, so it fell back to a size threshold it had not reached; <code>-f</code> forces a rotation regardless. On a real server logrotate runs once a day from a systemd timer (<code>systemctl list-timers logrotate.timer</code>); Chapter 16 builds a complete rotation and retention setup.</p>

<h3>Writing to the log from a script</h3>
<pre><code>logger "deploy started"                        <span class="tok-comment"># goes to the journal</span>
logger -t deploy -p user.info "release v1.4"
logger -t deploy -p user.err "rollback triggered"

journalctl -t deploy --since today</code></pre>
<div class="out">Aug 22 16:02:11 vps deploy[6120]: release v1.4
Aug 22 16:09:44 vps deploy[6188]: rollback triggered</div>
<p>A cron job or deploy script that uses <code>logger</code> ends up in the same timeline as everything else, so you can correlate "the deploy ran at 16:02" with "nginx started erroring at 16:03" without cross-referencing two files. It costs one command and it is far better than a stray log file nobody rotates.</p>
<p><code>-t deploy</code> sets the tag (<code>SYSLOG_IDENTIFIER</code>) you later filter on with <code>journalctl -t deploy</code>; <code>-p user.err</code> sets the facility and the priority, stored as <code>PRIORITY 3</code> (the JSON above came from exactly that line). Without systemd — in most containers — <code>logger</code> has nowhere to send the line; there, write to stdout and let <code>docker logs</code> collect it.</p>

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
<div class="out">Aug 22 03:14:52 vps kernel: Out of memory: Killed process 5012 (node) total-vm:…, anon-rss:…
Aug 22 03:14:52 vps kernel: oom_reaper: reaped process 5012 (node), now anon-rss:0kB, …</div>
<div class="callout warn">That kernel line is the answer to the most confusing incident there is: <strong>a service whose own log simply stops mid-sentence, with no error.</strong> The application did not crash — it was killed (Lesson 5.2), so it had no chance to log anything. Step 4 finds in one second what step 1 can never find, and skipping it is why people spend an hour reading application logs that contain nothing because there was nothing to write.</div>

<h3>What to look at where</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Failed logins, sudo</span><span class="v"><code>journalctl -u ssh</code> · <code>/var/log/auth.log</code> — who got in, who tried, what was run with sudo (Lesson 4.4).</span></div>
  <div class="kv"><span class="k">Package changes</span><span class="v"><code>/var/log/apt/history.log</code> — exactly what was installed or upgraded, and when. The first thing to check when "it worked yesterday".</span></div>
  <div class="kv"><span class="k">Kernel, hardware, OOM</span><span class="v"><code>journalctl -k</code> or <code>dmesg -T</code>. Disk errors and read-only remounts show up here and nowhere else.</span></div>
  <div class="kv"><span class="k">Boot problems</span><span class="v"><code>journalctl -b -1 -p err</code> plus <code>systemd-analyze blame</code> for what was slow.</span></div>
  <div class="kv"><span class="k">Web traffic</span><span class="v"><code>/var/log/nginx/access.log</code> — and Chapter 3's pipeline: <code>awk '{print \$1}' … | sort | uniq -c | sort -rn | head</code>.</span></div>
</div>

<h3>UTC in the container, +07 on your machine</h3>
${slide('lx-10', 23, 'Container giờ UTC, máy +07: lệch đúng 7 tiếng')}
<p>The course's own incident list includes a cron job that ran seven hours off. The cause is visible in two commands:</p>
<pre><code>date                                            <span class="tok-comment"># on the Mac</span>
docker run --rm ubuntu:24.04 date
docker run --rm -e TZ=Asia/Ho_Chi_Minh ubuntu:24.04 date
docker run --rm -e TZ=UTC-7 ubuntu:24.04 date
docker run --rm -e TZ=UTC+7 ubuntu:24.04 date</code></pre>
<div class="out">Mon Sep 28 22:23:52 +07 2026
Mon Sep 28 15:23:52 UTC 2026
Mon Sep 28 15:23:57 Asia 2026
Mon Sep 28 22:23:57 UTC 2026
Mon Sep 28 08:23:57 UTC 2026</div>
<p>Three separate lessons in five lines. Containers run in UTC unless told otherwise. The <code>ubuntu:24.04</code> image has no <code>tzdata</code> package, so <code>TZ=Asia/Ho_Chi_Minh</code> silently does nothing — the time is still UTC, labelled "Asia", with no error. And the POSIX form without tzdata has its sign <em>reversed</em>: <code>UTC-7</code> means "seven hours ahead of UTC" (and still prints the label UTC), while <code>UTC+7</code> puts you 14 hours away from Vietnam. The reliable fix is to install <code>tzdata</code> in the image and set <code>ENV TZ=Asia/Ho_Chi_Minh</code>; on a server, <code>sudo timedatectl set-timezone Asia/Ho_Chi_Minh</code>.</p>
<pre><code><span class="tok-comment"># the same journal entry, machine set to Asia/Ho_Chi_Minh</span>
journalctl -t deploy -n 1
journalctl -t deploy -n 1 --utc
journalctl -t deploy -n 1 -o short-iso</code></pre>
<div class="out">Sep 28 22:22:57 vps deploy[168]: rollback: healthcheck 502
Sep 28 15:22:57 vps deploy[168]: rollback: healthcheck 502
2026-09-28T22:22:57+07:00 vps deploy[168]: rollback: healthcheck 502</div>
<p>The journal stores UTC and converts only for display, so changing the time zone does not rewrite history — but it changes what <code>--since "22:00"</code> means. When you compare a log from a container with one from the host, or paste times into a bug report, use <code>--utc</code> or <code>-o short-iso</code> (which prints the offset) so nobody has to guess. For cron inside a UTC container, "07:00 Vietnam time" is <code>0 0 * * *</code>.</p>

<h3>Flag table: journalctl</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-u UNIT</code></td><td>one service (repeat for OR)</td><td><code>-u nginx -u php8.3-fpm</code></td></tr>
<tr><td><code>-t TAG</code></td><td>lines with this identifier (<code>logger -t</code>, <code>systemd-cat -t</code>)</td><td><code>-t deploy</code></td></tr>
<tr><td><code>-p LEVEL</code> · <code>-p A..B</code></td><td>this priority and more severe · a range</td><td><code>-p warning..err</code></td></tr>
<tr><td><code>--since</code> · <code>--until</code></td><td>time window (local time unless <code>--utc</code>)</td><td><code>--since "30 min ago"</code></td></tr>
<tr><td><code>-b</code> · <code>-b -1</code> · <code>--list-boots</code></td><td>this boot · previous boot · list boots</td><td>after an unexplained reboot</td></tr>
<tr><td><code>-k</code></td><td>kernel messages only</td><td>OOM kills, I/O errors</td></tr>
<tr><td><code>-n N</code> · <code>-r</code></td><td>last N lines · newest first</td><td><code>-n 50</code></td></tr>
<tr><td><code>-f</code></td><td>follow new lines</td><td>during a deploy</td></tr>
<tr><td><code>-o FORMAT</code></td><td><code>short</code>, <code>short-iso</code>, <code>cat</code>, <code>json</code>, <code>json-pretty</code>, <code>verbose</code></td><td><code>-o json | jq</code></td></tr>
<tr><td><code>--utc</code></td><td>show times in UTC</td><td>comparing with containers</td></tr>
<tr><td><code>--no-pager</code></td><td>print directly, do not open <code>less</code></td><td>in scripts</td></tr>
<tr><td><code>-F FIELD</code></td><td>list the values a field has</td><td><code>-F _SYSTEMD_UNIT</code></td></tr>
<tr><td><code>--user</code></td><td>your own user services (no sudo)</td><td><code>journalctl --user -u x</code></td></tr>
<tr><td><code>--disk-usage</code> · <code>--vacuum-size/-time</code></td><td>space used · delete archived files</td><td><code>--vacuum-time=14d</code></td></tr>
</table>

<h3>Try it step by step</h3>
<p>You do not need root or a server to practise <code>journalctl</code>: any Linux with systemd (Fedora, Ubuntu desktop, WSL2 with systemd enabled) runs short services for your own user. Measured on Fedora 44 as an ordinary user:</p>
<pre><code>systemd-run --user --unit=lx10-thu bash -c 'echo bat dau; echo "&lt;4&gt;cham: 2300 ms"; echo "&lt;3&gt;ERROR ket noi db" &gt;&amp;2; sleep 1; exit 3'
journalctl --user -u lx10-thu --no-pager
journalctl --user -u lx10-thu -p err --no-pager
journalctl --user -u lx10-thu -o json --no-pager | jq -r '[.PRIORITY, .MESSAGE] | @tsv'
systemd-cat -t lx10-deploy -p err echo "rollback: healthcheck 502"
journalctl --user -t lx10-deploy -n 1 --no-pager
systemctl --user reset-failed lx10-thu</code></pre>
<div class="out">… systemd[1609]: Started lx10-thu.service - [systemd-run] /usr/bin/bash -c …
… bash[1700775]: bat dau
… bash[1700775]: cham: 2300 ms
… bash[1700775]: ERROR ket noi db
… systemd[1609]: lx10-thu.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
… systemd[1609]: lx10-thu.service: Failed with result 'exit-code'.
… bash[1700775]: ERROR ket noi db
6	Started lx10-thu.service - [systemd-run] /usr/bin/bash -c …
6	bat dau
4	cham: 2300 ms
3	ERROR ket noi db
5	lx10-thu.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
4	lx10-thu.service: Failed with result 'exit-code'.
… lx10-deploy[1700874]: rollback: healthcheck 502</div>
<p><code>systemd-run --user</code> starts a command as a temporary service, so everything it prints lands in your user journal with a unit name; <code>systemd-cat</code> is the pipe-friendly cousin of <code>logger</code>. The last command clears the "failed" state so the unit name can be reused.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Task</th><th>Ubuntu / WSL2</th><th>macOS (measured on macOS 27)</th></tr>
<tr><td>System log</td><td><code>journalctl</code></td><td>no journalctl: unified log, <code>log show --last 1h --predicate 'process == "sshd-session"'</code>, <code>log stream</code> to follow</td></tr>
<tr><td>Text logs</td><td><code>/var/log/*.log</code></td><td><code>/var/log</code> (<code>/var</code> is a link to <code>/private/var</code>), with few files in it</td></tr>
<tr><td>Rotation</td><td>logrotate</td><td>newsyslog (<code>/etc/newsyslog.conf</code>)</td></tr>
<tr><td>Time zone</td><td><code>timedatectl</code></td><td>System Settings, or <code>sudo systemsetup -settimezone</code></td></tr>
</table>
<p>One Mac detail that bites: <code>log</code> is also a shell built-in in zsh (it lists logins), so typing <code>log show …</code> in zsh answers "too many arguments" — measured. Call the program by its full path, <code>/usr/bin/log show --last 30s --style compact</code>. On WSL2, systemd and therefore <code>journalctl</code> only exist when enabled in <code>/etc/wsl.conf</code> (<code>[boot]</code> <code>systemd=true</code>); without it, services are not running under systemd and the journal is empty.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's backend "died last night with nothing in its log". Rehearse the investigation on your own Linux machine (Fedora, Ubuntu, or WSL2 with systemd), without sudo, using a user service that logs and then fails.</p><ol>
<li>Start it: <code>systemd-run --user --unit=lx10-bai bash -c 'echo khoi dong; echo "&lt;4&gt;cham 2300 ms"; echo "&lt;3&gt;ERROR ket noi db" &gt;&amp;2; exit 3'</code>, then log a fake deploy with <code>systemd-cat -t lx10-deploy -p err echo "deploy v1.5 rollback"</code>.</li>
<li>Read it three ways: <code>journalctl --user -u lx10-bai --no-pager</code>, with <code>-p err</code>, and with <code>-p warning..err -o cat</code>. Which lines disappear at each step, and why?</li>
<li>Put both sources on one timeline: <code>journalctl --user _SYSTEMD_USER_UNIT=lx10-bai.service + SYSLOG_IDENTIFIER=lx10-deploy -o short-iso --no-pager</code>.</li>
<li>Show the same entries in UTC with <code>--utc</code>, and check what the container thinks the time is: <code>docker run --rm ubuntu:24.04 date</code> next to <code>date</code>.</li></ol>
<p><strong>Done when:</strong> you can explain that <code>-p err</code> keeps only "ERROR ket noi db" (priority 3) while systemd's "Failed with result" needs <code>warning</code>; the <code>short-iso</code> timeline shows both sources with a <code>+07:00</code> offset; and you can state the exact hour difference between the container and your machine. Clean up with <code>systemctl --user reset-failed lx10-bai</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">journald / journal</span><span class="v">systemd's log service and its indexed binary store, read with <code>journalctl</code>.</span></div>
  <div class="kv"><span class="k">Unit</span><span class="v">Anything systemd manages (a service, a timer…); <code>-u</code> filters by it.</span></div>
  <div class="kv"><span class="k">Priority / severity</span><span class="v">A number 0–7 on every line; lower is more severe. <code>-p err</code> means 0–3.</span></div>
  <div class="kv"><span class="k">Field</span><span class="v">A named value attached to a journal entry (<code>_PID</code>, <code>MESSAGE</code>); any field can be a filter.</span></div>
  <div class="kv"><span class="k">Volatile vs persistent</span><span class="v">A journal kept in memory (<code>/run/log/journal</code>, lost on reboot) versus on disk (<code>/var/log/journal</code>).</span></div>
  <div class="kv"><span class="k">Log rotation</span><span class="v">Renaming, compressing and eventually deleting old log files on a schedule so they cannot fill the disk.</span></div>
  <div class="kv"><span class="k">copytruncate</span><span class="v">Rotating by copying the log and emptying the original in place, for programs that cannot reopen files.</span></div>
  <div class="kv"><span class="k">UTC / time zone</span><span class="v">The universal reference time; Vietnam is UTC+07 (<code>Asia/Ho_Chi_Minh</code>). Store in UTC, display locally.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Bound every journal query by unit, time and priority first: <code>journalctl -u X --since "30 min ago" -p err</code>.</li>
<li>Several <code>-u</code> are OR; <code>+</code> works only between <code>FIELD=value</code> terms; <code>-o json</code> plus <code>jq</code> turns the journal into data.</li>
<li><code>-p err</code> hides systemd's OOM line (notice) and exit lines (warning): when a service died silently, drop <code>-p</code> and read <code>journalctl -k</code>.</li>
<li>journald's default ceiling is 10% of the filesystem capped at 4 GB; set <code>SystemMaxUse</code> and confirm it in the "System Journal … max" line.</li>
<li>Renaming an open log changes nothing for the writer: use <code>postrotate</code> with a signal the program handles, or <code>copytruncate</code>.</li>
<li>Containers run in UTC and <code>ubuntu:24.04</code> has no tzdata: install it and set <code>TZ</code>, and compare logs with <code>--utc</code> or <code>-o short-iso</code>.</li>
</ul>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journalctl.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">journalctl(1)</span><span class="lc-sub">Every filter, every output format, and the full list of journal fields you can match on. The EXAMPLES section is genuinely good.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journald.conf.html" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">journald.conf(5)</span><span class="lc-sub"><code>SystemMaxUse</code>, <code>Storage</code>, retention and rate limiting — the settings that decide whether the journal fills your disk.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/logrotate.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Every directive, and the precise difference between <code>postrotate</code> and <code>copytruncate</code> including the race the latter accepts.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-10', 17, 'Hai đường của log: journald hứng, file tự ghi')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">journald</span><span class="lz-lnote">Một kho nhị phân CÓ CẤU TRÚC, được đánh chỉ mục và truy vấn được. Mọi thứ systemd khởi động đều tự động ghi log vào đây — bất cứ thứ gì một dịch vụ ghi ra stdout hay stderr đều được hứng lại. Đọc bằng <code>journalctl</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">File thường trong /var/log</span><span class="lz-lnote">Thứ do chính ứng dụng tự ghi: <code>nginx/access.log</code>, <code>mysql/error.log</code>, ứng dụng của bạn. Đọc bằng <code>less</code>, <code>tail</code>, <code>grep</code> (Chương 3). Do <code>logrotate</code> xoay vòng.</span></div>
</div>
<pre><code>ls /var/log/</code></pre>
<div class="out">auth.log      dpkg.log     journal/     nginx/       syslog
auth.log.1    dpkg.log.1   kern.log     postgresql/  syslog.1
auth.log.2.gz              kern.log.1                syslog.2.gz</div>
<p>Hãy để ý cái khuôn mẫu: <code>auth.log</code> là bản hiện tại, <code>.1</code> là của hôm qua, còn <code>.2.gz</code> trở đi thì đã nén. Đó là <code>logrotate</code>, và nó nghĩa là chỉ dùng mỗi <code>grep</code> thì bỏ sót lịch sử — hãy dùng <code>zgrep</code> (Bài 3.4) để tìm cả trong những file đã nén.</p>
<p>Trên một Ubuntu <em>máy chủ</em>, hai hệ thống chồng lên nhau: gói <code>rsyslog</code> nhận mọi dòng của journal (Ubuntu kèm sẵn một drop-in, <code>/usr/lib/systemd/journald.conf.d/syslog.conf</code>, đặt <code>ForwardToSyslog=yes</code> — đo thật) rồi ghi lại đúng những dòng đó dạng văn bản vào <code>/var/log/syslog</code> và <code>/var/log/auth.log</code>. Nên một lần đăng nhập SSH hiện ra ở cả <code>journalctl -u ssh</code> lẫn <code>auth.log</code> — hai góc nhìn của MỘT sự kiện, không phải hai sự kiện. Trên Fedora, journal là log hệ thống chính (1,7 GB trên chính cái máy đo cho bài này) còn rsyslog chỉ là phần thêm tuỳ chọn.</p>

<h3>journalctl: những bộ lọc có ý nghĩa</h3>
${slide('lx-10', 18, 'journalctl lọc theo 4 trục: unit · thời gian · mức · theo dõi')}
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

<h3>Đo thật: một dịch vụ hay sập, đọc theo bốn cách</h3>
<p>Để có output thật, bài này chạy systemd bên trong một container Ubuntu 24.04 ngắn hạn (tên máy <code>vps</code>) với một dịch vụ nhỏ: một chương trình Python in một dòng khởi động, một cảnh báo và một lỗi, rồi thoát với mã 3, và <code>Restart=on-failure</code> khởi động lại nó sau hai giây. Chương trình đánh dấu mức ưu tiên của một dòng bằng cách mở đầu dòng bằng <code>&lt;4&gt;</code> (warning) hay <code>&lt;3&gt;</code> (error); journald gỡ dấu đó ra và cất con số lại.</p>
<pre><code>journalctl -u myapp -p err --no-pager</code></pre>
<div class="out">Sep 28 15:22:54 vps python3[163]: ERROR connection refused (db:5432)
Sep 28 15:22:59 vps python3[170]: ERROR connection refused (db:5432)
Sep 28 15:23:04 vps python3[175]: ERROR connection refused (db:5432)</div>
<pre><code>journalctl -u myapp --since "15:22:55" --until "15:23:00" --no-pager</code></pre>
<div class="out">Sep 28 15:22:55 vps systemd[1]: myapp.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
Sep 28 15:22:55 vps systemd[1]: myapp.service: Failed with result 'exit-code'.
Sep 28 15:22:57 vps systemd[1]: myapp.service: Scheduled restart job, restart counter is at 1.
Sep 28 15:22:57 vps systemd[1]: Started myapp.service - Demo app cho Bai 10.3.
Sep 28 15:22:57 vps python3[170]: listening on 127.0.0.1:3000
Sep 28 15:22:58 vps python3[170]: slow query: 2300 ms (SELECT * FROM posts)
Sep 28 15:22:59 vps python3[170]: ERROR connection refused (db:5432)</div>
<pre><code>journalctl -u myapp -p warning..err -o cat --no-pager | head -4</code></pre>
<div class="out">slow query: 2300 ms (SELECT * FROM posts)
ERROR connection refused (db:5432)
myapp.service: Failed with result 'exit-code'.
slow query: 2300 ms (SELECT * FROM posts)</div>
<p>Có bốn điều đọc được từ những output này. PID trong ngoặc đổi sau mỗi lần khởi động lại (163, 170, 175) — đó là cách bạn <em>NHÌN THẤY</em> một vòng lặp khởi động lại trong log. <code>-p err</code> chỉ hiện dòng lỗi của chính chương trình; câu "Failed with result" của systemd được ghi ở mức warning (4), nên nó chỉ hiện ra khi bạn nới tới <code>warning..err</code>. <code>--since</code>/<code>--until</code> nhận cả một giờ trần, hiểu là của hôm nay, theo múi giờ của máy. Và <code>-o cat</code> bỏ ngày, tên máy và PID, đúng thứ bạn cần trước khi <code>sort | uniq -c</code>.</p>

<h3>Mức ưu tiên, và lần bị giết vì hết bộ nhớ mà -p err bỏ sót</h3>
${slide('lx-10', 19, 'Mức ưu tiên 0–7: -p err bỏ sót cả lần bị OOM giết')}
<p>Một dịch vụ thứ hai trong cùng container được đặt <code>MemoryMax=60M</code> và chạy một chương trình xin bộ nhớ cho tới khi bị chặn lại. Journal ghi mỗi dòng kèm một trường <code>PRIORITY</code>, thứ mà <code>-o json</code> phơi ra:</p>
<pre><code>journalctl -u anram -o json | jq -r '[.PRIORITY, .MESSAGE] | @tsv'
journalctl -u anram -p err
journalctl -k | grep 'Killed process'</code></pre>
<div class="out">6	Started anram.service - Tien trinh an RAM (demo OOM).
6	bat dau nap du lieu
5	anram.service: A process of this unit has been killed by the OOM killer.
4	anram.service: Main process exited, code=killed, status=9/KILL
4	anram.service: Failed with result 'oom-kill'.
-- No entries --
Sep 28 15:22:57 vps kernel: Memory cgroup out of memory: Killed process 64868 (python3) total-vm:75860kB, anon-rss:61232kB, file-rss:5832kB, shmem-rss:0kB, UID:0 pgtables:176kB oom_score_adj:0</div>
<p>Dòng quan trọng nhất của cả sự cố — "killed by the OOM killer" — được systemd ghi ở mức <strong>notice (5)</strong>, còn các dòng thoát ở mức warning (4). Thói quen phân loại bằng <code>-u anram -p err</code> trả về <em>No entries</em> cho một dịch vụ đã chết. Dòng của chính nhân (<code>journalctl -k</code>) ở mức err và gọi tên tiến trình, nhưng nó nằm ngoài log của unit. Quy tắc rút ra: dùng <code>-p</code> để cắt nhiễu khi bạn đang săn một câu báo lỗi, và bỏ nó đi — hoặc đọc <code>-k</code> — khi một dịch vụ dừng mà không có câu báo lỗi nào. (PID trong dòng của nhân khác với PID bên trong container vì nhân đếm PID cho cả cái máy.)</p>
<table>
<tr><th>Số</th><th>Tên</th><th>Dòng điển hình</th></tr>
<tr><td>0 · 1 · 2</td><td><code>emerg</code> · <code>alert</code> · <code>crit</code></td><td>hiếm; chính hệ thống đang gặp nạn</td></tr>
<tr><td>3</td><td><code>err</code></td><td>lỗi của ứng dụng; dòng OOM của nhân</td></tr>
<tr><td>4</td><td><code>warning</code></td><td>systemd "Failed with result …", "Main process exited"</td></tr>
<tr><td>5</td><td><code>notice</code></td><td>systemd "killed by the OOM killer"; bình thường nhưng đáng chú ý</td></tr>
<tr><td>6</td><td><code>info</code></td><td>"Started …", output bình thường trên stdout</td></tr>
<tr><td>7</td><td><code>debug</code></td><td>chi tiết dài dòng, thường không được lưu</td></tr>
</table>

<h3>Ngoài unit: những bộ chọn khác</h3>
${slide('lx-10', 20, '-o json: mỗi dòng log là một bản ghi có trường')}
<pre><code>journalctl _PID=5012                   <span class="tok-comment"># một tiến trình</span>
journalctl _UID=1001                   <span class="tok-comment"># một người dùng</span>
journalctl /usr/sbin/nginx             <span class="tok-comment"># một chương trình</span>
journalctl _SYSTEMD_UNIT=ssh.service _PID=743   <span class="tok-comment"># nhiều trường, nối bằng VÀ</span>
journalctl -u nginx -u postgresql      <span class="tok-comment"># nhiều -u: unit này HOẶC unit kia</span>
journalctl _SYSTEMD_UNIT=nginx.service + _SYSTEMD_UNIT=postgresql.service   <span class="tok-comment"># dấu + là HOẶC giữa các TRƯỜNG=giá trị</span>
journalctl -F _SYSTEMD_UNIT | head     <span class="tok-comment"># journal đang có những unit nào</span></code></pre>
<p>Vì journal có CẤU TRÚC chứ không phải văn bản thuần, mỗi dòng đều mang theo các trường — unit, PID, UID, chương trình, mã lần khởi động. <code>-o verbose</code> hiện ra tất cả, và bất kỳ trường nào cũng làm bộ lọc được. Đây mới là lợi thế thật so với log dạng văn bản: bạn hỏi được "mọi thứ mà PID này đã ghi" mà không cần một cái regex vốn cũng sẽ khớp trúng cái PID xuất hiện bên trong một thông điệp.</p>
<h3>Đo thật: các trường, toán tử +, và jq</h3>
<pre><code>journalctl -t deploy -p err -o json-pretty -n 1</code></pre>
<div class="out">{
	"__REALTIME_TIMESTAMP" : "1790611498019750",
	…
	"_EXE" : "/usr/bin/logger",
	"SYSLOG_IDENTIFIER" : "deploy",
	…
	"_HOSTNAME" : "vps",
	…
	"_BOOT_ID" : "6057b14370764ba893825ba704227696",
	…
	"MESSAGE" : "rollback: healthcheck 502",
	"_PID" : "362",
	…
	"_TRANSPORT" : "syslog",
	…
	"PRIORITY" : "3",
	…
}</div>
<p>Những trường bắt đầu bằng gạch dưới (<code>_PID</code>, <code>_HOSTNAME</code>, <code>_SYSTEMD_UNIT</code>) do chính journald thêm vào và chương trình không làm giả được; những trường còn lại (<code>MESSAGE</code>, <code>PRIORITY</code>, <code>SYSLOG_IDENTIFIER</code>) do bên gửi cung cấp. <code>__REALTIME_TIMESTAMP</code> là số micro giây kể từ 1970 theo UTC — journal luôn LƯU giờ UTC, chỉ phần HIỂN THỊ mới được đổi. Một phiên bản trước của bài này có dòng <code>journalctl -u nginx + -u postgresql</code>; đo thật trên systemd 255 thì nó hỏng:</p>
<pre><code>journalctl -u myapp + -u nginx
journalctl _SYSTEMD_UNIT=myapp.service + SYSLOG_IDENTIFIER=deploy -n 4 --no-pager</code></pre>
<div class="out">"+" can only be used between terms
Sep 28 15:23:25 vps python3[201]: ERROR connection refused (db:5432)
Sep 28 15:23:28 vps python3[203]: listening on 127.0.0.1:3000
Sep 28 15:23:29 vps python3[203]: slow query: 2300 ms (SELECT * FROM posts)
Sep 28 15:23:30 vps python3[203]: ERROR connection refused (db:5432)</div>
<p>Luật, nói cho chính xác: nhiều cờ <code>-u</code> vốn đã là HOẶC (unit này hoặc unit kia); các trường khác nhau là VÀ (<code>_SYSTEMD_UNIT=… _PID=…</code> nghĩa là cả hai); còn <code>+</code> là một phép HOẶC đặt giữa các vế <code>TRƯỜNG=giá trị</code>, không phải giữa các cờ. Để đếm và gom nhóm, hãy đưa <code>-o json</code> qua ống vào <code>jq</code> (công cụ xử lý JSON; <code>apt install jq</code>): <code>journalctl -u myapp -o json --since today | jq -r 'select(.PRIORITY=="3") | .MESSAGE' | sort | uniq -c | sort -rn</code> đếm các câu báo lỗi theo nội dung.</p>

<h3>Giữ journal khỏi ăn hết đĩa</h3>
${slide('lx-10', 21, 'Journal cần trần: mặc định 10% đĩa, tối đa 4G')}
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
<div class="callout warn">Mặc định journald dùng tới <strong>10% hệ thống file, chặn trên ở 4 GB</strong> — nên trên một cái đĩa 80 GB thì mức chặn 4 GB mới là thứ có hiệu lực (đo trên một container không cấu hình gì: <code>max 4.0G</code>). Chuyện đó không sao cho tới khi nó dùng chung đĩa với một cơ sở dữ liệu, và lúc ấy cái journal lặng lẽ phình vào đúng phần chỗ mà Postgres cần. Hãy đặt <code>SystemMaxUse</code> một cách tường minh trên mọi máy chủ; nó tốn bốn dòng và gỡ bỏ cả một lớp sự cố đĩa-đầy lúc 3 giờ sáng (Bài 10.1).</div>
<pre><code><span class="tok-comment"># Journal có được lưu lâu dài không đã?</span>
ls -d /var/log/journal 2&gt;/dev/null || echo "chỉ trong bộ nhớ — log mất khi khởi động lại"</code></pre>
<p>Nếu <code>/var/log/journal</code> không tồn tại, journald giữ mọi thứ trong <code>/run</code> — tức bộ nhớ — và toàn bộ lịch sử log biến mất khi khởi động lại. Đó là mặc định trong nhiều ảnh container và trên vài bản cài tối giản, và nó là một bất ngờ khó chịu khi bạn khởi động lại để chữa một thứ gì đó rồi sau đó không điều tra được chuyện đã xảy ra. Lệnh <code>sudo mkdir -p /var/log/journal &amp;&amp; sudo systemctl restart systemd-journald</code> làm nó lưu lâu dài.</p>
<h3>Đo thật: mức trần mà journald thật sự áp dụng</h3>
<pre><code>journalctl -u systemd-journald | grep 'System Journal'     <span class="tok-comment"># chưa có drop-in: mặc định</span>
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\\nSystemMaxUse=500M\\nMaxRetentionSec=1month\\n' | sudo tee /etc/systemd/journald.conf.d/10-gioi-han.conf
sudo systemctl restart systemd-journald
journalctl -u systemd-journald -n 3 | grep 'System Journal'
systemd-analyze cat-config systemd/journald.conf | tail -4</code></pre>
<div class="out">… systemd-journald[302]: System Journal (/var/log/journal/c938a30667f84ea6a797b3bac282f673) is 8.0M, max 4.0G, 3.9G free.
… systemd-journald[290]: System Journal (/var/log/journal/c938a30667f84ea6a797b3bac282f673) is 8.0M, max 500.0M, 492.0M free.
# /etc/systemd/journald.conf.d/10-gioi-han.conf
[Journal]
SystemMaxUse=500M
MaxRetentionSec=1month</div>
<p>journald công bố mức trần nó đang dùng mỗi lần khởi động — <code>max 4.0G</code> khi không cấu hình gì trên một đĩa lớn, <code>max 500.0M</code> sau khi có drop-in — nên chính dòng đó là bằng chứng thiết lập đã có hiệu lực, tốt hơn việc đọc lại cái file bạn vừa ghi. <code>systemd-analyze cat-config</code> in ra file chính cộng mọi drop-in theo đúng thứ tự áp dụng. <code>--vacuum-size</code> chỉ xoá những file journal <em>ĐÃ LƯU TRỮ</em>; file đang ghi thì ở lại, đó là lý do trong phép đo ở đây một lần vacuum xuống 1M giải phóng 4,4M mà vẫn còn 8,0M đang dùng.</p>

<h3>logrotate: cho những file log dạng file</h3>
${slide('lx-10', 22, 'logrotate đổi tên file — app vẫn ghi vào inode cũ')}
<pre><code>cat /etc/logrotate.d/nginx                   <span class="tok-comment"># Ubuntu 24.04, nginx 1.24</span></code></pre>
<div class="out">/var/log/nginx/*.log {
        daily
        missingok
        rotate 14
        compress
        delaycompress
        notifempty
        create 0640 www-data adm
        sharedscripts
        prerotate
                if [ -d /etc/logrotate.d/httpd-prerotate ]; then \\
                        run-parts /etc/logrotate.d/httpd-prerotate; \\
                fi \\
        endscript
        postrotate
                invoke-rc.d nginx rotate &gt;/dev/null 2&gt;&amp;1
        endscript
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>daily</code> · <code>size 100M</code></span><span class="v">Khi nào xoay vòng: theo lịch, hay theo kích thước. <code>size</code> an toàn hơn với một file log có thể vọt lên đột ngột.</span></div>
  <div class="kv"><span class="k"><code>rotate 14</code></span><span class="v">Giữ lại bao nhiêu file cũ. Đây chính là chính sách lưu trữ của bạn, và là con số quyết định log được phép ăn bao nhiêu đĩa.</span></div>
  <div class="kv"><span class="k"><code>compress</code> · <code>delaycompress</code></span><span class="v">gzip những file cũ; hoãn lại một chu kỳ để một tiến trình vẫn đang ghi vào file vừa xoay không bị rối.</span></div>
  <div class="kv"><span class="k"><code>postrotate</code></span><span class="v">Bảo tiến trình MỞ LẠI file log của nó — ở đây là <code>invoke-rc.d nginx rotate</code>, mà script khởi động của nó gửi cho nginx tín hiệu <code>SIGUSR1</code> (<code>start-stop-daemon --stop --signal USR1</code>) — đúng cái tín hiệu ở Bài 5.3. Không có nó, tiến trình cứ ghi tiếp vào file đã đổi tên (chính là vấn đề đã-xoá-mà-vẫn-mở ở Bài 10.1).</span></div>
  <div class="kv"><span class="k"><code>copytruncate</code></span><span class="v">Dành cho chương trình không bảo được là hãy mở lại: chép file ra, rồi cắt trắng bản gốc tại chỗ. Đơn giản hơn, nhưng những dòng ghi ra trong lúc đang chép thì mất.</span></div>
</div>
<pre><code>sudo logrotate -d /etc/logrotate.d/nginx     <span class="tok-comment"># -d: gỡ lỗi, không đổi gì</span>
sudo logrotate -f /etc/logrotate.d/nginx     <span class="tok-comment"># -f: ép xoay vòng ngay</span>
cat /var/lib/logrotate/status | grep nginx   <span class="tok-comment"># lần xoay vòng gần nhất là khi nào</span></code></pre>
<div class="callout ok">Lựa chọn giữa <code>postrotate</code> và <code>copytruncate</code> chính là toàn bộ bài toán thiết kế của việc xoay vòng log. Đổi tên một file mà tiến trình đang mở thì KHÔNG làm nó bận tâm — nó cứ ghi tiếp vào đúng cái inode đó, nay mang tên <code>access.log.1</code>, còn file <code>access.log</code> mới thì rỗng mãi mãi. <code>postrotate</code> giải quyết chuyện đó cho tử tế bằng cách YÊU CẦU tiến trình mở lại; <code>copytruncate</code> né hẳn câu hỏi với cái giá là một tình huống tranh chấp nhỏ. Khi log của chính ứng dụng bạn thôi xuất hiện sau một lần xoay vòng, lý do là đây — và cách chữa là xử lý <code>SIGUSR1</code> hoặc <code>SIGHUP</code>, hoặc ghi ra stdout rồi để journald lo.</div>
<h3>Đo thật: ba cách xoay vòng một file đang mở</h3>
<p>Một script nhỏ đóng vai ứng dụng: nó mở <code>app.log</code> đúng một lần ở bộ mô tả file 3 và cứ 0,2 giây ghi một dòng — y như cách nginx hay một bộ ghi log của Node.js hành xử. Mỗi lần xoay vòng được ép bằng <code>logrotate -f</code> với một file trạng thái riêng (<code>-s</code>), nên chẳng đụng gì tới lịch chạy thật của hệ thống.</p>
<pre><code><span class="tok-comment"># "ứng dụng"</span>
exec 3&gt;&gt;/srv/app/log/app.log
i=0; while :; do i=$((i+1)); echo "$(date +%T) request $i" &gt;&amp;3; sleep 0.2; done</code></pre>
<pre><code><span class="tok-comment"># /srv/app/lr-create.conf — đổi tên + create, KHÔNG có postrotate</span>
/srv/app/log/app.log {
    rotate 3
    create 0640 root root
    missingok
    notifempty
}</code></pre>
<pre><code>logrotate -f -s /tmp/st1 lr-create.conf; sleep 1; wc -l log/*; sleep 2; wc -l log/*</code></pre>
<div class="out">  0 log/app.log
 10 log/app.log.1
 10 total
  0 log/app.log
 20 log/app.log.1</div>
<p><code>app.log</code> mới đứng yên ở 0 dòng trong khi <code>app.log.1</code> cứ lớn dần: chương trình vẫn ghi vào cái inode giờ mang tên <code>.1</code>. Dùng <code>copytruncate</code> thay vào, logrotate chép nội dung ra rồi cắt trắng CHÍNH inode đó, nên chương trình cứ thế ghi tiếp vào <code>app.log</code> (đo thật: 10 dòng trong <code>app.log</code>, 5 dòng trong bản chép). Dùng <code>create</code> cộng một <code>postrotate</code> gửi cho chương trình một tín hiệu mà nó xử lý bằng cách mở lại file, kết quả cũng thế mà không phải chép:</p>
<pre><code><span class="tok-comment"># ứng dụng, phiên bản 2: ghi PID ra file, mở lại fd 3 khi nhận SIGUSR1</span>
echo $$ &gt; /run/ghi.pid
mo(){ exec 3&gt;&gt;/srv/app/log/app.log; }
mo; trap mo USR1

<span class="tok-comment"># lr-post.conf</span>
/srv/app/log/app.log {
    rotate 3
    create 0640 root root
    postrotate
        kill -USR1 "$(cat /run/ghi.pid)"
    endscript
}</code></pre>
<pre><code>logrotate -v -f -s /tmp/st3 lr-post.conf 2&gt;&amp;1 | grep -iE 'renaming|creating new|running postrotate'
sleep 2; wc -l log/* | head -2</code></pre>
<div class="out">renaming /srv/app/log/app.log to /srv/app/log/app.log.1
creating new /srv/app/log/app.log mode = 0640 uid = 0 gid = 0
running postrotate script
 10 log/app.log
  5 log/app.log.1</div>
<div class="callout warn"><strong>Một cái bẫy gặp ngay lúc đo:</strong> phiên bản đầu của <code>postrotate</code> đó viết <code>pkill -USR1 -f ghi2.sh</code>. logrotate đáp lại <code>error running non-shared postrotate script</code>: <code>pkill -f</code> khớp theo CẢ dòng lệnh, và cái shell đang chạy script postrotate có chữ <code>ghi2.sh</code> ngay trong dòng lệnh của chính nó — nên nó tự gửi tín hiệu cho chính mình. Cùng họ lỗi với câu chuyện <code>pkill -f "next start"</code> của khoá này (Bài 5.3). Một file PID như trên, hoặc <code>systemctl kill -s USR1 app.service</code>, gọi đúng một tiến trình duy nhất.</div>
<pre><code>logrotate -d -s /tmp/st lr-create.conf          <span class="tok-comment"># -d: gỡ lỗi = chỉ in kế hoạch</span></code></pre>
<div class="out">warning: logrotate in debug mode does nothing except printing debug messages!  Consider using verbose mode (-v) instead if this is not what you want.
reading config file lr-create.conf
…
considering log /srv/app/log/app.log
  Now: 2026-09-28 15:24
  Last rotated at 2026-09-28 15:00
  log does not need rotating (log size is below the 'size' threshold)</div>
<p><code>-d</code> in kế hoạch mà không đổi gì — thứ đầu tiên nên chạy với một cấu hình mới. Vì sao "does not need rotating"? File đó không có dòng lịch (<code>daily</code>/<code>weekly</code>) hay dòng <code>size</code> của riêng nó, nên rơi về một ngưỡng kích thước mà nó chưa chạm tới; <code>-f</code> ép xoay vòng bất kể. Trên máy chủ thật, logrotate chạy mỗi ngày một lần từ một systemd timer (<code>systemctl list-timers logrotate.timer</code>); Chương 16 dựng một bộ xoay vòng và lưu giữ hoàn chỉnh.</p>

<h3>Ghi vào log từ một script</h3>
<pre><code>logger "bắt đầu deploy"                        <span class="tok-comment"># đi thẳng vào journal</span>
logger -t deploy -p user.info "phát hành v1.4"
logger -t deploy -p user.err "đã kích hoạt quay lui"

journalctl -t deploy --since today</code></pre>
<div class="out">Aug 22 16:02:11 vps deploy[6120]: phát hành v1.4
Aug 22 16:09:44 vps deploy[6188]: đã kích hoạt quay lui</div>
<p>Một công việc cron hay một script deploy dùng <code>logger</code> sẽ nằm trên cùng một dòng thời gian với mọi thứ khác, nên bạn đối chiếu được "lần deploy chạy lúc 16:02" với "nginx bắt đầu báo lỗi lúc 16:03" mà không phải tra chéo hai file. Nó tốn một lệnh và tốt hơn hẳn một file log lạc chỗ mà chẳng ai xoay vòng.</p>
<p><code>-t deploy</code> đặt thẻ (<code>SYSLOG_IDENTIFIER</code>) mà sau này bạn lọc bằng <code>journalctl -t deploy</code>; <code>-p user.err</code> đặt nhóm nguồn (facility) và mức ưu tiên, được lưu thành <code>PRIORITY 3</code> (đoạn JSON ở trên đến từ đúng dòng đó). Không có systemd — ở phần lớn container — thì <code>logger</code> chẳng có chỗ nào để gửi; ở đó, hãy ghi ra stdout rồi để <code>docker logs</code> thu gom.</p>

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
<div class="out">Aug 22 03:14:52 vps kernel: Out of memory: Killed process 5012 (node) total-vm:…, anon-rss:…
Aug 22 03:14:52 vps kernel: oom_reaper: reaped process 5012 (node), now anon-rss:0kB, …</div>
<div class="callout warn">Dòng của nhân đó chính là câu trả lời cho loại sự cố khó hiểu nhất từng có: <strong>một dịch vụ mà log của chính nó đơn giản là dừng lại giữa câu, không có lỗi nào.</strong> Ứng dụng KHÔNG sập — nó bị GIẾT (Bài 5.2), nên nó chẳng có cơ hội nào để ghi lại gì. Bước 4 tìm ra trong một giây cái mà bước 1 không bao giờ tìm được, và bỏ qua nó chính là lý do người ta ngồi cả tiếng đọc log ứng dụng vốn chẳng chứa gì, bởi vì có gì đâu mà ghi.</div>

<h3>Nhìn vào đâu để tìm gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đăng nhập hỏng, sudo</span><span class="v"><code>journalctl -u ssh</code> · <code>/var/log/auth.log</code> — ai vào được, ai đã thử, ai chạy gì bằng sudo (Bài 4.4).</span></div>
  <div class="kv"><span class="k">Thay đổi về gói</span><span class="v"><code>/var/log/apt/history.log</code> — chính xác cái gì đã được cài hay nâng cấp, và lúc nào. Thứ đầu tiên cần kiểm khi "hôm qua nó vẫn chạy".</span></div>
  <div class="kv"><span class="k">Nhân, phần cứng, OOM</span><span class="v"><code>journalctl -k</code> hoặc <code>dmesg -T</code>. Lỗi đĩa và những lần gắn lại ở chế độ chỉ-đọc hiện ra ở đây và không ở đâu khác.</span></div>
  <div class="kv"><span class="k">Vấn đề lúc khởi động</span><span class="v"><code>journalctl -b -1 -p err</code> cộng với <code>systemd-analyze blame</code> để biết cái gì chậm.</span></div>
  <div class="kv"><span class="k">Lưu lượng web</span><span class="v"><code>/var/log/nginx/access.log</code> — và cái chuỗi ống ở Chương 3: <code>awk '{print \$1}' … | sort | uniq -c | sort -rn | head</code>.</span></div>
</div>

<h3>Container giờ UTC, máy bạn giờ +07</h3>
${slide('lx-10', 23, 'Container giờ UTC, máy +07: lệch đúng 7 tiếng')}
<p>Danh sách sự cố của chính khoá này có một công việc cron chạy lệch bảy tiếng. Nguyên nhân hiện ra chỉ trong hai lệnh:</p>
<pre><code>date                                            <span class="tok-comment"># trên Mac</span>
docker run --rm ubuntu:24.04 date
docker run --rm -e TZ=Asia/Ho_Chi_Minh ubuntu:24.04 date
docker run --rm -e TZ=UTC-7 ubuntu:24.04 date
docker run --rm -e TZ=UTC+7 ubuntu:24.04 date</code></pre>
<div class="out">Mon Sep 28 22:23:52 +07 2026
Mon Sep 28 15:23:52 UTC 2026
Mon Sep 28 15:23:57 Asia 2026
Mon Sep 28 22:23:57 UTC 2026
Mon Sep 28 08:23:57 UTC 2026</div>
<p>Ba bài học riêng trong năm dòng. Container chạy giờ UTC nếu không ai bảo khác. Ảnh <code>ubuntu:24.04</code> không có gói <code>tzdata</code>, nên <code>TZ=Asia/Ho_Chi_Minh</code> lặng lẽ chẳng làm gì — giờ vẫn là UTC, dán nhãn "Asia", không báo lỗi. Và dạng POSIX khi không có tzdata thì dấu bị <em>NGƯỢC</em>: <code>UTC-7</code> nghĩa là "đi trước UTC bảy tiếng" (mà nhãn vẫn in là UTC), còn <code>UTC+7</code> đẩy bạn lệch 14 tiếng so với Việt Nam. Cách sửa chắc chắn là cài <code>tzdata</code> vào ảnh rồi đặt <code>ENV TZ=Asia/Ho_Chi_Minh</code>; trên máy chủ thì <code>sudo timedatectl set-timezone Asia/Ho_Chi_Minh</code>.</p>
<pre><code><span class="tok-comment"># cùng một dòng journal, máy đặt múi giờ Asia/Ho_Chi_Minh</span>
journalctl -t deploy -n 1
journalctl -t deploy -n 1 --utc
journalctl -t deploy -n 1 -o short-iso</code></pre>
<div class="out">Sep 28 22:22:57 vps deploy[168]: rollback: healthcheck 502
Sep 28 15:22:57 vps deploy[168]: rollback: healthcheck 502
2026-09-28T22:22:57+07:00 vps deploy[168]: rollback: healthcheck 502</div>
<p>Journal lưu giờ UTC và chỉ đổi khi hiển thị, nên đổi múi giờ không viết lại lịch sử — nhưng nó đổi nghĩa của <code>--since "22:00"</code>. Khi bạn so một log của container với log của máy chủ, hay dán giờ vào một báo cáo lỗi, hãy dùng <code>--utc</code> hoặc <code>-o short-iso</code> (thứ in cả độ lệch) để không ai phải đoán. Với cron bên trong một container giờ UTC, "7 giờ sáng giờ Việt Nam" là <code>0 0 * * *</code>.</p>

<h3>Bảng cờ: journalctl</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-u UNIT</code></td><td>một dịch vụ (lặp lại để lấy HOẶC)</td><td><code>-u nginx -u php8.3-fpm</code></td></tr>
<tr><td><code>-t THẺ</code></td><td>các dòng mang định danh này (<code>logger -t</code>, <code>systemd-cat -t</code>)</td><td><code>-t deploy</code></td></tr>
<tr><td><code>-p MỨC</code> · <code>-p A..B</code></td><td>mức này và nghiêm trọng hơn · một khoảng</td><td><code>-p warning..err</code></td></tr>
<tr><td><code>--since</code> · <code>--until</code></td><td>khung thời gian (giờ địa phương trừ khi có <code>--utc</code>)</td><td><code>--since "30 min ago"</code></td></tr>
<tr><td><code>-b</code> · <code>-b -1</code> · <code>--list-boots</code></td><td>lần khởi động này · lần trước · liệt kê các lần</td><td>sau một lần khởi động lại khó hiểu</td></tr>
<tr><td><code>-k</code></td><td>chỉ thông điệp của nhân</td><td>OOM, lỗi I/O</td></tr>
<tr><td><code>-n N</code> · <code>-r</code></td><td>N dòng cuối · mới nhất lên đầu</td><td><code>-n 50</code></td></tr>
<tr><td><code>-f</code></td><td>theo dõi dòng mới</td><td>trong lúc deploy</td></tr>
<tr><td><code>-o ĐỊNH_DẠNG</code></td><td><code>short</code>, <code>short-iso</code>, <code>cat</code>, <code>json</code>, <code>json-pretty</code>, <code>verbose</code></td><td><code>-o json | jq</code></td></tr>
<tr><td><code>--utc</code></td><td>hiện giờ theo UTC</td><td>khi so với container</td></tr>
<tr><td><code>--no-pager</code></td><td>in thẳng ra, không mở <code>less</code></td><td>trong script</td></tr>
<tr><td><code>-F TRƯỜNG</code></td><td>liệt kê các giá trị một trường đang có</td><td><code>-F _SYSTEMD_UNIT</code></td></tr>
<tr><td><code>--user</code></td><td>dịch vụ của riêng bạn (không cần sudo)</td><td><code>journalctl --user -u x</code></td></tr>
<tr><td><code>--disk-usage</code> · <code>--vacuum-size/-time</code></td><td>đang chiếm bao nhiêu · xoá file đã lưu trữ</td><td><code>--vacuum-time=14d</code></td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Bạn không cần root hay máy chủ để luyện <code>journalctl</code>: Linux nào có systemd (Fedora, Ubuntu desktop, WSL2 đã bật systemd) cũng chạy được dịch vụ ngắn cho chính người dùng của bạn. Đo thật trên Fedora 44 bằng người dùng thường:</p>
<pre><code>systemd-run --user --unit=lx10-thu bash -c 'echo bat dau; echo "&lt;4&gt;cham: 2300 ms"; echo "&lt;3&gt;ERROR ket noi db" &gt;&amp;2; sleep 1; exit 3'
journalctl --user -u lx10-thu --no-pager
journalctl --user -u lx10-thu -p err --no-pager
journalctl --user -u lx10-thu -o json --no-pager | jq -r '[.PRIORITY, .MESSAGE] | @tsv'
systemd-cat -t lx10-deploy -p err echo "rollback: healthcheck 502"
journalctl --user -t lx10-deploy -n 1 --no-pager
systemctl --user reset-failed lx10-thu</code></pre>
<div class="out">… systemd[1609]: Started lx10-thu.service - [systemd-run] /usr/bin/bash -c …
… bash[1700775]: bat dau
… bash[1700775]: cham: 2300 ms
… bash[1700775]: ERROR ket noi db
… systemd[1609]: lx10-thu.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
… systemd[1609]: lx10-thu.service: Failed with result 'exit-code'.
… bash[1700775]: ERROR ket noi db
6	Started lx10-thu.service - [systemd-run] /usr/bin/bash -c …
6	bat dau
4	cham: 2300 ms
3	ERROR ket noi db
5	lx10-thu.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
4	lx10-thu.service: Failed with result 'exit-code'.
… lx10-deploy[1700874]: rollback: healthcheck 502</div>
<p><code>systemd-run --user</code> chạy một lệnh dưới dạng một dịch vụ tạm, nên mọi thứ nó in ra đều rơi vào journal của người dùng kèm một tên unit; <code>systemd-cat</code> là người anh em hợp với ống dẫn của <code>logger</code>. Lệnh cuối xoá trạng thái "failed" để cái tên unit dùng lại được.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Việc</th><th>Ubuntu / WSL2</th><th>macOS (đo trên macOS 27)</th></tr>
<tr><td>Log hệ thống</td><td><code>journalctl</code></td><td>không có journalctl: unified log, <code>log show --last 1h --predicate 'process == "sshd-session"'</code>, <code>log stream</code> để theo dõi</td></tr>
<tr><td>Log văn bản</td><td><code>/var/log/*.log</code></td><td><code>/var/log</code> (<code>/var</code> là liên kết tới <code>/private/var</code>), ít file</td></tr>
<tr><td>Xoay vòng</td><td>logrotate</td><td>newsyslog (<code>/etc/newsyslog.conf</code>)</td></tr>
<tr><td>Múi giờ</td><td><code>timedatectl</code></td><td>System Settings, hoặc <code>sudo systemsetup -settimezone</code></td></tr>
</table>
<p>Một chi tiết của Mac hay cắn: <code>log</code> cũng là một lệnh dựng sẵn của zsh (nó liệt kê các lần đăng nhập), nên gõ <code>log show …</code> trong zsh sẽ nhận câu "too many arguments" — đo thật. Hãy gọi chương trình bằng đường dẫn đầy đủ, <code>/usr/bin/log show --last 30s --style compact</code>. Trên WSL2, systemd và vì thế <code>journalctl</code> chỉ có khi được bật trong <code>/etc/wsl.conf</code> (<code>[boot]</code> <code>systemd=true</code>); không bật thì dịch vụ không chạy dưới systemd và journal rỗng.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> backend của nhóm "chết đêm qua mà log chẳng có gì". Hãy tập điều tra trên chính máy Linux của bạn (Fedora, Ubuntu, hoặc WSL2 có systemd), không cần sudo, bằng một dịch vụ người dùng ghi log rồi hỏng.</p><ol>
<li>Khởi động nó: <code>systemd-run --user --unit=lx10-bai bash -c 'echo khoi dong; echo "&lt;4&gt;cham 2300 ms"; echo "&lt;3&gt;ERROR ket noi db" &gt;&amp;2; exit 3'</code>, rồi ghi một lần deploy giả bằng <code>systemd-cat -t lx10-deploy -p err echo "deploy v1.5 rollback"</code>.</li>
<li>Đọc theo ba cách: <code>journalctl --user -u lx10-bai --no-pager</code>, thêm <code>-p err</code>, và thêm <code>-p warning..err -o cat</code>. Dòng nào biến mất ở mỗi bước, và vì sao?</li>
<li>Đặt cả hai nguồn lên một dòng thời gian: <code>journalctl --user _SYSTEMD_USER_UNIT=lx10-bai.service + SYSLOG_IDENTIFIER=lx10-deploy -o short-iso --no-pager</code>.</li>
<li>Hiện cùng những dòng đó theo UTC bằng <code>--utc</code>, và kiểm xem container nghĩ bây giờ là mấy giờ: <code>docker run --rm ubuntu:24.04 date</code> đặt cạnh <code>date</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn giải thích được rằng <code>-p err</code> chỉ giữ "ERROR ket noi db" (mức 3) còn câu "Failed with result" của systemd cần tới <code>warning</code>; dòng thời gian <code>short-iso</code> hiện cả hai nguồn kèm độ lệch <code>+07:00</code>; và bạn nói được chính xác container lệch máy bạn mấy tiếng. Dọn bằng <code>systemctl --user reset-failed lx10-bai</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">journald / journal (nhật ký hệ thống)</span><span class="v">Dịch vụ log của systemd và kho nhị phân có chỉ mục của nó, đọc bằng <code>journalctl</code>.</span></div>
  <div class="kv"><span class="k">Unit (đơn vị systemd)</span><span class="v">Bất cứ thứ gì systemd quản lý (dịch vụ, bộ hẹn giờ…); <code>-u</code> lọc theo nó.</span></div>
  <div class="kv"><span class="k">Priority / severity (mức ưu tiên / độ nghiêm trọng)</span><span class="v">Con số 0–7 trên mỗi dòng; càng nhỏ càng nghiêm trọng. <code>-p err</code> nghĩa là 0–3.</span></div>
  <div class="kv"><span class="k">Field (trường)</span><span class="v">Một giá trị có tên gắn với một dòng journal (<code>_PID</code>, <code>MESSAGE</code>); trường nào cũng làm bộ lọc được.</span></div>
  <div class="kv"><span class="k">Volatile / persistent (tạm thời / lưu lâu dài)</span><span class="v">Journal giữ trong bộ nhớ (<code>/run/log/journal</code>, mất khi khởi động lại) so với trên đĩa (<code>/var/log/journal</code>).</span></div>
  <div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Đổi tên, nén và cuối cùng xoá các file log cũ theo lịch để chúng không làm đầy đĩa.</span></div>
  <div class="kv"><span class="k">copytruncate (chép rồi cắt trắng)</span><span class="v">Xoay vòng bằng cách chép log ra rồi làm rỗng bản gốc tại chỗ, cho chương trình không mở lại file được.</span></div>
  <div class="kv"><span class="k">UTC / time zone (giờ quốc tế / múi giờ)</span><span class="v">Mốc giờ chung toàn cầu; Việt Nam là UTC+07 (<code>Asia/Ho_Chi_Minh</code>). Lưu theo UTC, hiển thị theo giờ địa phương.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chặn mọi truy vấn journal theo unit, thời gian và mức ưu tiên trước tiên: <code>journalctl -u X --since "30 min ago" -p err</code>.</li>
<li>Nhiều <code>-u</code> là HOẶC; <code>+</code> chỉ dùng giữa các vế <code>TRƯỜNG=giá trị</code>; <code>-o json</code> cộng <code>jq</code> biến journal thành dữ liệu.</li>
<li><code>-p err</code> giấu dòng OOM của systemd (notice) và các dòng thoát (warning): khi một dịch vụ chết im lặng, bỏ <code>-p</code> và đọc <code>journalctl -k</code>.</li>
<li>Trần mặc định của journald là 10% hệ thống file, chặn ở 4 GB; hãy đặt <code>SystemMaxUse</code> và xác nhận ở dòng "System Journal … max".</li>
<li>Đổi tên một file log đang mở chẳng thay đổi gì với bên ghi: dùng <code>postrotate</code> gửi một tín hiệu mà chương trình xử lý, hoặc <code>copytruncate</code>.</li>
<li>Container chạy giờ UTC và <code>ubuntu:24.04</code> không có tzdata: cài nó rồi đặt <code>TZ</code>, và so log bằng <code>--utc</code> hoặc <code>-o short-iso</code>.</li>
</ul>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journalctl.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">journalctl(1)</span><span class="lc-sub">Mọi bộ lọc, mọi định dạng đầu ra, và danh sách đầy đủ các trường của journal mà bạn khớp được. Mục EXAMPLES thật sự tốt.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/journald.conf.html" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">journald.conf(5)</span><span class="lc-sub"><code>SystemMaxUse</code>, <code>Storage</code>, thời gian giữ và giới hạn tần suất — những thiết lập quyết định journal có làm đầy đĩa của bạn hay không.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/logrotate.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Mọi chỉ thị, và khác biệt chính xác giữa <code>postrotate</code> với <code>copytruncate</code>, gồm cả tình huống tranh chấp mà cái sau chấp nhận.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
      description: 'Mười câu tình huống: hết inode, cắt trắng file đã xoá qua /proc, sort thiếu -h, df -BG làm tròn lên, autoremove --purge, apt-mark hold chặn bản vá, sha256sum của macOS, -p err bỏ sót OOM, logrotate không postrotate, và TZ trong container không có tzdata.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from real terminals — every output quoted in these questions was recorded while writing the chapter, in Ubuntu 24.04 containers (one of them running systemd), on Fedora 44 and on a Mac. Most ask what a command prints or which fix is right; reading output before deleting anything is the habit this chapter builds.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I run <code>df -h</code> and <code>df -i</code> together and can explain a disk that is 0% full in bytes and 100% in inodes.</li>
<li>I can walk down with <code>du -xh -d1 | sort -h</code>, find a deleted-but-open file with <code>lsof +L1</code>, and see under a mount with <code>mount --bind</code>.</li>
<li>I can write a free-space guard that does not round its way past me (<code>df -BM</code>).</li>
<li>I can explain apt's four stages, read <code>apt policy</code> and the two letters of <code>dpkg -l</code>, and say what a hold costs.</li>
<li>I can verify a download with <code>sha256sum -c</code> and a signed checksum list with <code>gpg --verify</code>.</li>
<li>I can bound <code>journalctl</code> by unit, time and priority, know what <code>-p err</code> hides, rotate an open log without losing it, and compare logs across time zones.</li>
</ul>
${slide('lx-10', 26, 'Bảng tra nhanh Chương 10 (1/2)')}
${slide('lx-10', 27, 'Bảng tra nhanh Chương 10 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ terminal thật — mọi output trích trong câu hỏi đều được ghi lại lúc viết chương này, trong container Ubuntu 24.04 (một cái chạy cả systemd), trên Fedora 44 và trên Mac. Phần lớn hỏi một lệnh in ra gì hoặc cách sửa nào đúng; đọc output trước khi xoá bất cứ thứ gì là thói quen chương này xây cho bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy <code>df -h</code> và <code>df -i</code> cùng nhau và giải thích được một cái đĩa đầy 0% theo byte mà 100% theo inode.</li>
<li>Tôi lần xuống được bằng <code>du -xh -d1 | sort -h</code>, tìm file đã xoá mà vẫn mở bằng <code>lsof +L1</code>, và nhìn xuống dưới một điểm gắn bằng <code>mount --bind</code>.</li>
<li>Tôi viết được một chốt kiểm chỗ trống không bị làm tròn mà lọt qua (<code>df -BM</code>).</li>
<li>Tôi giải thích được bốn chặng của apt, đọc được <code>apt policy</code> và hai chữ cái của <code>dpkg -l</code>, và nói được một lệnh giữ bản phải trả giá gì.</li>
<li>Tôi kiểm được một file tải về bằng <code>sha256sum -c</code> và một danh sách mã băm có chữ ký bằng <code>gpg --verify</code>.</li>
<li>Tôi chặn được <code>journalctl</code> theo unit, thời gian và mức ưu tiên, biết <code>-p err</code> giấu gì, xoay vòng một file log đang mở mà không mất nó, và so được log giữa các múi giờ.</li>
</ul>
${slide('lx-10', 26, 'Bảng tra nhanh Chương 10 (1/2)')}
${slide('lx-10', 27, 'Bảng tra nhanh Chương 10 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On the server, touch /data/sess/new fails with "No space left on device", yet df -h /data prints "tmpfs 64M 0 64M 0% /data". Which command shows the cause?|||Trên máy chủ, touch /data/sess/new hỏng với "No space left on device", vậy mà df -h /data in ra "tmpfs 64M 0 64M 0% /data". Lệnh nào cho thấy nguyên nhân?',
            options: [
              'du -sh /data — it will show which files use the 64M|||du -sh /data — nó sẽ cho thấy file nào đang dùng 64M',
              'lsof +L1 — a deleted file is still open|||lsof +L1 — có một file đã xoá mà vẫn đang mở',
              'df -i /data — it prints IUse% 100%: the inode table is full while the bytes are free|||df -i /data — nó in IUse% 100%: bảng inode đầy trong khi byte còn trống',
              'sudo tune2fs -m 1 — the root reserve is blocking ordinary users|||sudo tune2fs -m 1 — phần dự trữ cho root đang chặn người dùng thường',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured on a tmpfs with 2000 inodes: 1998 empty files later, df -h still said 0% while df -i said 2000 2000 0 100%. Every file needs an inode, so writes fail although no bytes are used. lsof +L1 is the right tool when df is HIGH and du is low — here nothing is using bytes at all; and tune2fs does not even apply to tmpfs.|||VI: Đo trên một tmpfs 2000 inode: sau 1998 file rỗng, df -h vẫn nói 0% trong khi df -i nói 2000 2000 0 100%. File nào cũng cần một inode, nên lệnh ghi hỏng dù chẳng byte nào bị dùng. lsof +L1 là công cụ đúng khi df CAO mà du thấp — ở đây chẳng có byte nào bị dùng cả; còn tune2fs thậm chí không áp dụng cho tmpfs.',
          },
          {
            question: 'You removed a 40 MB log with rm, df still shows 40M used, and lsof -nP +L1 prints "sleep 5748 root 3w REG … 41943040 0 2003 /data/log/access.log (deleted)". How do you get the space back without stopping PID 5748?|||Bạn đã rm một file log 40 MB, df vẫn báo dùng 40M, và lsof -nP +L1 in ra "sleep 5748 root 3w REG … 41943040 0 2003 /data/log/access.log (deleted)". Làm sao lấy lại chỗ mà không dừng PID 5748?',
            options: [
              'truncate -s 0 /proc/5748/fd/3|||truncate -s 0 /proc/5748/fd/3',
              'rm -f /proc/5748/fd/3|||rm -f /proc/5748/fd/3',
              'sync; echo 3 > /proc/sys/vm/drop_caches|||sync; echo 3 > /proc/sys/vm/drop_caches',
              'touch /data/log/access.log so the process writes to a named file again|||touch /data/log/access.log để tiến trình lại ghi vào một file có tên',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 3w means file descriptor 3, open for writing. Truncating through /proc/5748/fd/3 empties that very inode, and df went from 40M to 0 in the measurement while the process kept running. The /proc entry is only a view of the descriptor — measured, rm on it fails with "Operation not permitted" and the space stays used; dropping caches frees page cache, not file data; and a new file with the same name is a different inode, which the process never sees.|||VI: 3w nghĩa là bộ mô tả file 3, mở để ghi. Cắt trắng qua /proc/5748/fd/3 làm rỗng đúng cái inode đó, và trong phép đo df đi từ 40M về 0 trong khi tiến trình vẫn chạy. Mục trong /proc chỉ là một góc nhìn vào bộ mô tả — đo thật, rm lên nó hỏng với "Operation not permitted" và chỗ vẫn bị chiếm; drop_caches giải phóng bộ đệm trang, không phải dữ liệu file; còn một file mới cùng tên là một inode khác mà tiến trình không bao giờ thấy.',
          },
          {
            question: 'A cleanup script picks the biggest directory with: du -h -d1 var | sort | tail -1. The real sizes are var/cache 3.1M, var/log 40M, var/lib 165M (and var itself 207M). What does the line print?|||Một script dọn dẹp chọn thư mục lớn nhất bằng: du -h -d1 var | sort | tail -1. Kích thước thật là var/cache 3.1M, var/log 40M, var/lib 165M (và chính var là 207M). Dòng đó in ra gì?',
            options: [
              '207M var|||207M var',
              '165M var/lib|||165M var/lib',
              '3.1M var/cache|||3.1M var/cache',
              '40M var/log|||40M var/log',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Without -h, sort compares text character by character: "1…" < "2…" < "3…" < "4…", so the measured order was 165M, 207M, 3.1M, 40M and tail -1 takes 40M var/log. "207M var" is what sort -h would put last (the total), and 165M var/lib is the real answer the script wanted. Use sort -h whenever du -h produced the sizes.|||VI: Thiếu -h, sort so theo CHỮ từng ký tự: "1…" < "2…" < "3…" < "4…", nên thứ tự đo được là 165M, 207M, 3.1M, 40M và tail -1 lấy 40M var/log. "207M var" là thứ sort -h sẽ đặt cuối (dòng tổng), còn 165M var/lib mới là đáp án script muốn tìm. Hễ du -h sinh ra kích thước thì dùng sort -h.',
          },
          {
            question: 'The deploy guard is: free_gb=$(df -BG --output=avail / | tail -1 | tr -dc 0-9); (( free_gb >= 5 )) || die "only ${free_gb}GB". The disk has 4.01 GB free. What happens?|||Chốt chặn deploy là: free_gb=$(df -BG --output=avail / | tail -1 | tr -dc 0-9); (( free_gb >= 5 )) || die "only ${free_gb}GB". Đĩa còn 4,01 GB trống. Chuyện gì xảy ra?',
            options: [
              'die runs: "only 4GB"|||die chạy: "only 4GB"',
              'The guard passes: df -BG rounds up and prints 5G|||Chốt cho qua: df -BG làm tròn lên và in ra 5G',
              'bash reports a syntax error because 4.01 is not an integer|||bash báo lỗi cú pháp vì 4.01 không phải số nguyên',
              'df prints 4.01G and tr turns it into 401, so the guard passes|||df in 4.01G và tr biến nó thành 401, nên chốt cho qua',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: GNU df rounds block counts UP to the unit: measured, a filesystem with 2 MB free printed "1G" with -BG and "2M" with -BM. So 4.01 GB becomes 5, the test passes and the deploy starts on a disk that may fill mid-build. df -BG never prints decimals, which rules out the other two. Compare in MB (-BM) or bytes (-B1).|||VI: GNU df làm tròn số khối LÊN theo đơn vị: đo thật, một hệ thống file còn 2 MB in "1G" với -BG và "2M" với -BM. Nên 4,01 GB thành 5, phép kiểm qua và deploy khởi chạy trên một cái đĩa có thể đầy giữa lúc dựng. df -BG không bao giờ in số thập phân, nên hai phương án còn lại bị loại. Hãy so bằng MB (-BM) hoặc byte (-B1).',
          },
          {
            question: 'After apt-get remove -y nginx-light, dpkg -l still lists "ii nginx" and "ii nginx-common", and /etc/nginx still exists. Which one command removes those leftover packages AND their configuration?|||Sau apt-get remove -y nginx-light, dpkg -l vẫn còn "ii nginx" và "ii nginx-common", và /etc/nginx vẫn còn đó. Lệnh nào gỡ được các gói còn sót ĐỒNG THỜI cả cấu hình của chúng?',
            options: [
              'apt-get remove -y nginx-light again|||apt-get remove -y nginx-light thêm lần nữa',
              'apt clean|||apt clean',
              'apt-get autoremove --purge -y|||apt-get autoremove --purge -y',
              'apt update && apt upgrade|||apt update && apt upgrade',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: nginx and nginx-common were pulled in automatically, so removing nginx-light only made them orphans ("no longer required … Use apt autoremove"). autoremove removes orphans and --purge deletes their conffiles: measured, "Purging configuration files for nginx-common" and /etc/nginx disappeared. apt clean only empties the .deb download cache.|||VI: nginx và nginx-common được kéo vào tự động, nên gỡ nginx-light chỉ biến chúng thành gói mồ côi ("no longer required … Use apt autoremove"). autoremove gỡ gói mồ côi còn --purge xoá file cấu hình của chúng: đo thật, "Purging configuration files for nginx-common" và /etc/nginx biến mất. apt clean chỉ dọn bộ đệm .deb đã tải.',
          },
          {
            question: 'A teammate ran apt-mark hold perl-base months ago. Today apt list --upgradable shows "perl-base/noble-updates,noble-security 5.38.2-3.2ubuntu0.6" and apt-get -s upgrade prints "The following packages have been kept back: perl-base". What does this mean?|||Một bạn cùng nhóm đã chạy apt-mark hold perl-base từ mấy tháng trước. Hôm nay apt list --upgradable hiện "perl-base/noble-updates,noble-security 5.38.2-3.2ubuntu0.6" và apt-get -s upgrade in "The following packages have been kept back: perl-base". Điều đó nghĩa là gì?',
            options: [
              'Nothing serious: holds apply to apt upgrade, but unattended-upgrades still installs security fixes|||Không sao: lệnh giữ chỉ áp cho apt upgrade, còn unattended-upgrades vẫn cài bản vá an ninh',
              'A dependency conflict; apt full-upgrade will resolve it automatically|||Xung đột phụ thuộc; apt full-upgrade sẽ tự giải quyết',
              'The hold expired at the last apt update, so the next upgrade will install it|||Lệnh giữ đã hết hạn ở lần apt update gần nhất, nên lần upgrade tới sẽ cài nó',
              'A security fix from noble-security is blocked until someone runs apt-mark unhold perl-base|||Một bản vá an ninh từ noble-security đang bị chặn cho tới khi có người chạy apt-mark unhold perl-base',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The version is offered by noble-security, and "kept back" is exactly how a hold looks in the measurement. Holds never expire and unattended-upgrades skips held packages too, so the fix waits for a human. full-upgrade also respects holds; "kept back" can mean a dependency problem in general, but here the hold is the known cause. Audit with apt-mark showhold.|||VI: Phiên bản đó do noble-security cung cấp, và "kept back" chính là hình dạng của một lệnh giữ trong phép đo. Lệnh giữ không bao giờ hết hạn và unattended-upgrades cũng bỏ qua gói bị giữ, nên bản vá chờ một con người. full-upgrade cũng tôn trọng lệnh giữ; "kept back" nói chung có thể do phụ thuộc, nhưng ở đây nguyên nhân đã biết là lệnh giữ. Hãy rà bằng apt-mark showhold.',
          },
          {
            question: 'On a Mac, a script runs: sha256sum -c --ignore-missing SHA256SUMS && echo "OK, flashing the ISO". Because of a typo, none of the files named in SHA256SUMS is present. What happens (measured on macOS 27)?|||Trên Mac, một script chạy: sha256sum -c --ignore-missing SHA256SUMS && echo "OK, flashing the ISO". Do gõ nhầm, không file nào có tên trong SHA256SUMS có mặt. Chuyện gì xảy ra (đo trên macOS 27)?',
            options: [
              'sha256sum prints "no file was verified", exits 1, and the echo does not run|||sha256sum in "no file was verified", thoát 1, và echo không chạy',
              'sha256sum prints nothing, exits 0, and "OK, flashing the ISO" is printed|||sha256sum chẳng in gì, thoát 0, và "OK, flashing the ISO" được in ra',
              'sha256sum prints FAILED for every line and exits 1|||sha256sum in FAILED cho từng dòng và thoát 1',
              'sha256sum: unrecognized option --ignore-missing|||sha256sum: unrecognized option --ignore-missing',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: macOS has a BSD sha256sum (/sbin/sha256sum, "sha256sum (Darwin) 1.0") that accepts GNU-format lists; measured with --ignore-missing and no file present, it printed nothing and exited 0. Option A is what GNU sha256sum on Linux does — which is why the difference is dangerous. On a Mac use shasum -a 256 -c --ignore-missing, which exits 1 ("no file was verified").|||VI: macOS có một sha256sum bản BSD (/sbin/sha256sum, "sha256sum (Darwin) 1.0") đọc được danh sách định dạng GNU; đo với --ignore-missing và không file nào có mặt, nó không in gì và thoát 0. Phương án A là thứ GNU sha256sum trên Linux làm — chính vì vậy khác biệt này nguy hiểm. Trên Mac hãy dùng shasum -a 256 -c --ignore-missing, lệnh này thoát 1 ("no file was verified").',
          },
          {
            question: 'The worker service died overnight. journalctl -u worker -p err prints "-- No entries --", and the service is inactive. What is the most likely explanation, and the next command?|||Dịch vụ worker chết trong đêm. journalctl -u worker -p err in "-- No entries --", và dịch vụ đang inactive. Giải thích khả dĩ nhất và lệnh tiếp theo là gì?',
            options: [
              'The journal is volatile and was lost; nothing can be recovered|||Journal chỉ nằm trong RAM và đã mất; chẳng khôi phục được gì',
              'The service logs to a file, so journalctl cannot see it; read /var/log/worker.log|||Dịch vụ ghi ra file nên journalctl không thấy; hãy đọc /var/log/worker.log',
              'It was killed, and systemd logs the OOM kill at notice (5) and the exit at warning (4); drop -p, and check journalctl -k|||Nó bị giết, và systemd ghi lần OOM ở mức notice (5), dòng thoát ở mức warning (4); bỏ -p, và kiểm journalctl -k',
              'journalctl needs sudo to show error-level lines|||journalctl cần sudo mới hiện được các dòng mức lỗi',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured with MemoryMax=60M: the unit log had "killed by the OOM killer" at priority 5 and "Failed with result "oom-kill"" at 4, so -p err returned No entries; the kernel’s "Memory cgroup out of memory: Killed process … (python3)" line was at err in journalctl -k. A killed process has no chance to write an error. The other options are possible in general, but the unit log exists here — only the priority filter hides it.|||VI: Đo với MemoryMax=60M: log của unit có "killed by the OOM killer" ở mức 5 và "Failed with result "oom-kill"" ở mức 4, nên -p err trả về No entries; dòng "Memory cgroup out of memory: Killed process … (python3)" của nhân ở mức err trong journalctl -k. Một tiến trình bị giết không kịp ghi lỗi. Các phương án khác nói chung có thể xảy ra, nhưng ở đây log của unit vẫn còn — chỉ có bộ lọc mức ưu tiên giấu nó đi.',
          },
          {
            question: 'Your app opens app.log once and keeps writing. logrotate uses "rotate 3 / create 0640 root root" with no postrotate. After a forced rotation, wc -l shows app.log at 0 lines and app.log.1 growing from 10 to 20. What fixes it?|||Ứng dụng của bạn mở app.log một lần rồi cứ thế ghi. logrotate dùng "rotate 3 / create 0640 root root" và không có postrotate. Sau một lần ép xoay vòng, wc -l cho thấy app.log đứng ở 0 dòng còn app.log.1 tăng từ 10 lên 20. Cách nào sửa được?',
            options: [
              'Add a postrotate that sends the app a signal it handles by reopening the file (or use copytruncate)|||Thêm một postrotate gửi cho ứng dụng một tín hiệu mà nó xử lý bằng cách mở lại file (hoặc dùng copytruncate)',
              'Add compress so the old file stops growing|||Thêm compress để file cũ thôi lớn lên',
              'Change create 0640 to create 0666 so the app can write to the new file|||Đổi create 0640 thành create 0666 để ứng dụng ghi được vào file mới',
              'Add missingok and notifempty|||Thêm missingok và notifempty',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Renaming does not touch the open descriptor: the app keeps writing to the inode now named app.log.1, and the fresh app.log is a different inode. Measured, create + postrotate (kill -USR1 with a PID file, the app reopening fd 3 in a trap) gave app.log 10 lines, and copytruncate did too. Permissions are not the problem (the app never opens the new file); compress would even gzip a file still being written to.|||VI: Đổi tên không đụng tới bộ mô tả đang mở: ứng dụng cứ ghi vào cái inode giờ mang tên app.log.1, còn app.log mới là một inode khác. Đo thật, create + postrotate (kill -USR1 qua file PID, ứng dụng mở lại fd 3 trong một trap) cho app.log 10 dòng, và copytruncate cũng vậy. Quyền không phải vấn đề (ứng dụng có bao giờ mở file mới đâu); còn compress thậm chí sẽ gzip một file vẫn đang bị ghi.',
          },
          {
            question: 'A backup job in a container has cron "0 7 * * *", meant for 07:00 Vietnam time, but runs at 14:00. docker run --rm -e TZ=Asia/Ho_Chi_Minh ubuntu:24.04 date prints "Mon Sep 28 15:23:57 Asia 2026" while the Mac says 22:23. What is going on?|||Một việc sao lưu trong container có cron "0 7 * * *", định chạy lúc 07:00 giờ Việt Nam, nhưng lại chạy lúc 14:00. docker run --rm -e TZ=Asia/Ho_Chi_Minh ubuntu:24.04 date in "Mon Sep 28 15:23:57 Asia 2026" trong khi Mac báo 22:23. Chuyện gì đang xảy ra?',
            options: [
              'The image has no tzdata, so TZ=Asia/Ho_Chi_Minh is silently ignored and the clock stays UTC; install tzdata (or write the cron in UTC: 0 0 * * *)|||Ảnh không có tzdata, nên TZ=Asia/Ho_Chi_Minh bị lặng lẽ bỏ qua và đồng hồ vẫn là UTC; cài tzdata (hoặc viết cron theo UTC: 0 0 * * *)',
              'The time zone is right; "Asia" is just how date abbreviates it|||Múi giờ đúng rồi; "Asia" chỉ là cách date viết tắt nó',
              'TZ only takes effect after the container restarts twice|||TZ chỉ có hiệu lực sau khi container khởi động lại hai lần',
              'Use TZ=UTC+7, the POSIX way to say Vietnam time|||Dùng TZ=UTC+7, cách viết giờ Việt Nam theo POSIX',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 15:23 is exactly UTC when the Mac shows 22:23 (+07), so nothing was converted — the label "Asia" appears because the zone file does not exist and date falls back to UTC with no error. 07:00 UTC is 14:00 in Vietnam, which matches the symptom. TZ=UTC+7 is the tempting trap: POSIX signs are reversed, and it measured 08:23, fourteen hours away from Vietnam.|||VI: 15:23 đúng bằng giờ UTC khi Mac hiện 22:23 (+07), nên chẳng có gì được đổi — nhãn "Asia" hiện ra vì file múi giờ không tồn tại và date rơi về UTC mà không báo lỗi. 07:00 UTC là 14:00 ở Việt Nam, khớp đúng triệu chứng. TZ=UTC+7 là cái bẫy hấp dẫn: dấu của POSIX bị ngược, và đo ra 08:23, lệch mười bốn tiếng so với Việt Nam.',
          },
        ],
      },
    },
  ],
};
