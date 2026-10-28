/**
 * Operating Systems for Developers — Chương 8: Áp lực bộ nhớ — swap, cgroup, OOM (soạn 28/10/2026 theo _HOP-DONG.md).
 * Output CHẠY THẬT trong ảnh `os-lab`, mọi phép làm đầy bộ nhớ đều trong container vứt đi CÓ GIỚI HẠN (--memory 128m…1g):
 *   lab/code/ch08/c81-cache.sh  → lab/out/c81-cache   (--privileged --memory 1g: page cache, free/available, drop_caches)
 *   lab/code/ch08/c82-swap.sh   → lab/out/c82-swap    (--privileged --memory 128m --memory-swap 384m: swappiness, thrashing)
 *   lab/code/ch08/c82-file.sh   → lab/out/c82-file    (--memory 128m --memory-swap 128m: thrashing không cần swap, PSI)
 *   lab/code/ch08/c83-oom.sh    → lab/out/c83-oom     (--memory 256m --memory-swap 256m --cap-add SYSLOG --cap-add SYS_RESOURCE)
 *   lab/code/ch08/c84-high.sh   → lab/out/c84-high    (--privileged --memory 512m, bash -c "exec phien …": cgroup con memory.high/max)
 *   lab/code/ch08/c84-host.sh, c85-host.sh → lab/out/c84-host, c85-host (gõ TỪ MÁY CHỦ bằng phien-host.sh: docker run/inspect)
 *   lab/code/ch08/c85-lim.sh    → lab/out/c85-lim     (--memory 128m --memory-swap 128m: Buffer ngoài heap, mini-oomd)
 * Dòng đầu mỗi kịch bản ghi đúng lệnh docker run. Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, VM 7,9 GB + swap
 * 1 GiB, nhân 7.0 linuxkit, cgroup v2, overcommit_memory = 1), Node 22, Java 21 (Temurin 21.0.12.1).
 * KHÔNG đổi sysctl toàn cục (overcommit_memory, zswap, zram): VM dùng chung với container khác ⇒ chỉ mô tả, ghi rõ "không đo".
 * Ranh giới: bố cục bộ nhớ, phân trang, page fault, malloc/GC ở Chương 7 (chỉ trỏ sang); cgroup v2 tổng quát ở Chương 12.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, code } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G81 from './giang/os-08-1.mjs';
import G82 from './giang/os-08-2.mjs';
import G83 from './giang/os-08-3.mjs';
import G84 from './giang/os-08-4.mjs';
import G85 from './giang/os-08-5.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OSG34 = '/courses/operating-systems/learn?lessonSlug=osg202-3-4-thrashing';
const OSG32 = '/courses/operating-systems/learn?lessonSlug=osg202-3-2-thay-trang';

export default {
  title: 'Chapter 8 — Memory pressure: swap, cgroups, OOM|||Chương 8 — Áp lực bộ nhớ: swap, cgroup, OOM',
  description: 'Khi RAM không đủ, nhân chọn ai phải chết: page cache và vì sao free gần bằng 0 (available mới là thật), reclaim, kswapd và watermark; swap, swappiness, thrashing đo từng trang, PSI, zram/zswap; overcommit, oom_score/oom_score_adj, OOM killer chọn PostgreSQL thay vì kẻ rò rỉ; sự cố exit 137 của chính dự án tái hiện trong container 512 MiB, memory.high → throttling → memory.max; và giới hạn bộ nhớ cho Node, JVM, Docker, Kubernetes, systemd-oomd.',
  lessons: [
    /* ───────────────────────── 8.1 — Page cache ───────────────────────── */
    {
      title: '8.1 — Page cache and why "free" memory is near zero|||8.1 — Page cache và vì sao bộ nhớ "free" gần bằng 0',
      slug: 'os-8-1-page-cache',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc free và /proc/meminfo cho đúng (available, không phải free); vì sao free trong container in cả VM 7,9 GB; ghi một file là lấp page cache; đọc nguội 0,044 s vs ấm 0,003 s; đọc 1 GB làm free tụt 827 MB mà available chỉ nhích 13 MB; cache dưới giới hạn cgroup không bao giờ gây OOM; kswapd, watermark và direct reclaim; drop_caches thật ra làm gì.',
      content: `${G81}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>A server with almost no free memory is usually a healthy server</h2>
<p class="lead">You open <code>free -m</code> on the VPS, the <em>free</em> column says a few hundred MB, and someone in the group chat says "we are out of RAM, upgrade the plan". Usually they are wrong — but sometimes they are right, and you need to know which in ten seconds. This lesson answers one question: <strong>where did the "free" memory go, and which number actually means "running out"?</strong> The answer is the page cache, and the number is <em>available</em>. Chapter 7 showed how one process sees memory; this chapter is about the whole machine running short of it.</p>

<h3>Four columns, one that matters</h3>
${run('c81-cache', 'free -m', 1)}
<p>This is the lab VM (7,934 MiB) as seen from inside our lab container. Read the columns from left to right:</p>
<ul>
<li><strong>used</strong> (2,950) — memory that processes and the kernel are holding and cannot simply give back: heaps, stacks, page tables, kernel data.</li>
<li><strong>free</strong> (3,682) — RAM that holds <em>nothing at all</em>. An idle page of RAM is wasted RAM, so Linux tries to keep this small. On a server that has been up for days, a few hundred MB here is normal.</li>
<li><strong>buff/cache</strong> (1,656) — file data the kernel keeps in RAM after you read or wrote it: the <strong>page cache</strong>. It is reused for free the next time anyone reads the same file, and it can be dropped the moment a program needs the RAM.</li>
<li><strong>available</strong> (4,984) — the kernel's estimate of how much a new program could get <em>without swapping</em>: roughly free plus the part of the cache it can reclaim. <strong>This is the number to watch.</strong></li>
</ul>
<p>If you took Chapter 2's lesson on reading <code>free</code> for triage, this is the mechanism under that rule.</p>

<h3>/proc/meminfo: where free gets its numbers</h3>
${run('c81-cache', "grep -E '^(MemTotal", 1)}
<p><code>free</code> only reformats this file. <code>MemAvailable</code> (5,103,160 kB = the 4,984 MiB above) is computed by the kernel from <code>MemFree</code> plus the reclaimable part of <code>Active(file)</code> + <code>Inactive(file)</code> (about 1.26 GB of cached file pages here) plus reclaimable kernel slab, minus a reserve it always keeps. <code>Active(anon)</code> + <code>Inactive(anon)</code> — 2.5 GB — is process memory: heap and stack pages that have no file behind them and can only leave RAM through swap (lesson 8.2). <code>Dirty</code> is cached data written by programs but not yet on disk.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>free</code> and <code>top</code> inside a container describe the wrong machine.</strong> This container is limited to 1 GiB, but <code>free</code> above printed the VM's 7,934 MiB, because <code>/proc/meminfo</code> is not per container. A Node or Java process that sizes itself from it will believe it owns the host. The container's real numbers live in its cgroup:</p>
${run('c81-cache', 'cat /sys/fs/cgroup/memory.max', 2)}
<p><code>memory.max</code> is the limit (1,073,741,824 = 1 GiB), <code>memory.current</code> what is charged right now, and <code>memory.stat</code> splits it into <code>anon</code> and <code>file</code> — the same distinction as the anon/file lines of meminfo, for this container only.</p>
</div>

<h3>Writing a file fills the page cache</h3>
<p>To see the cache we need to ask which pages of a file are in RAM. This small tool does it with <code>mincore()</code> (the same idea as <code>fincore</code> or <code>vmtouch</code>), and can also ask the kernel to drop one file's clean pages with <code>posix_fadvise(DONTNEED)</code>:</p>
${src('ch08/incore.c', 'c')}
${run('c81-cache', 'dd if=/dev/urandom', 1)}
${run('c81-cache', './incore /tmp/big', 1)}
${run('c81-cache', "grep -E '^(anon|file|file_dirty) '", 2)}
<p>We wrote 200 MiB and all 51,200 pages of the file are now in RAM. <code>memory.stat</code> agrees: <code>file</code> went from 118 kB to 209,907,712 bytes = 200 MiB, charged to this container. The page cache is not a separate pool of memory; it is ordinary RAM that the kernel lends to files while nobody else needs it. After <code>sync</code>, <code>file_dirty</code> is 0: the data is safely on disk <em>and</em> still cached.</p>

<h3>Cold vs warm: why the cache exists</h3>
${run('c81-cache', './incore /tmp/big evict', 4)}
<p>Evict only this file, read it cold: 0.044 s. Read it again warm: 0.003 s, about 15× faster. The gap is small here because this VM's disk is a file on the Mac that macOS caches in its own RAM. On a VPS SSD or network disk the gap is what Chapter 7 measured for random reads: ~52 µs per 4 KiB page from disk versus ~0.2 µs from cache. That ratio is why the kernel keeps every byte of file data it can.</p>
${lab('pagecache', 'warm', 'en', 'The same random reads, cold then warm: once the file is in the page cache there is zero disk I/O. Switch to the seq preset to watch read-ahead hide a cold sequential read.')}

<h3>Read 1 GB: free drops, available does not</h3>
${run('c81-cache', 'free -m | head -2', 3)}
<p>Reading a 1 GB file moved <strong>827 MiB out of free</strong> (3,478 → 2,651) and about the same into buff/cache (1,856 → 2,671). <strong>available moved by 13 MiB</strong> (4,980 → 4,967). Nothing was lost: the RAM is still there for any program that asks — it just holds a copy of the file meanwhile. A server whose <em>free</em> is low and whose <em>available</em> is high is doing its job.</p>

<h3>Under a cgroup limit, cache alone never gets you killed</h3>
${run('c81-cache', './incore /tmp/big; ./incore /tmp/huge', 1)}
${run('c81-cache', 'cat /sys/fs/cgroup/memory.current', 1)}
${run('c81-cache', 'cat /sys/fs/cgroup/memory.events', 1)}
<p>We pushed 1.2 GB of files through a 1 GiB container. <code>memory.current</code> sits at 1,071,300,608 bytes — right at the limit, <code>memory.peak</code> touched it exactly — and the kernel kept only 51% of the first file and 90% of the second. <code>memory.events</code> says <code>max 427</code>: 427 times the group hit its limit and had to reclaim. And <code>oom 0</code>. Clean page cache can always be dropped, so a container full of cache is never OOM-killed for it. When a container dies of OOM, it is anonymous memory that filled it.</p>
${lab('cgroup', 'cache', 'en', 'No leak, a service streaming a 4 GB file: memory.current sits at the ceiling, memory.stat says file, and no OOM ever comes.')}

<h3>Who reclaims, and when: kswapd and the watermarks</h3>
${run('c81-cache', "grep -E '^(pgscan|pgsteal", 1)}
${run('c81-cache', "grep -A5 'zone", 1)}
${run('c81-cache', "grep -E '^(pgscan_kswapd", 1)}
<p><strong>Reclaim</strong> is the kernel taking pages back: scanning the LRU lists (<code>pgscan</code>) and freeing pages (<code>pgsteal</code>). Two actors do it:</p>
<ul>
<li><strong>kswapd</strong>, one kernel thread per memory node, works in the background. Each zone has three <strong>watermarks</strong> — here zone Normal: <code>min</code> 8,136 pages (31.8 MiB), <code>low</code> 10,170 (39.7 MiB), <code>high</code> 12,204 (47.7 MiB), derived from <code>vm.min_free_kbytes</code>. When free memory drops below <em>low</em>, kswapd wakes and reclaims until it is back above <em>high</em>. Nobody waits for it.</li>
<li><strong>Direct reclaim</strong>: if free memory falls below <em>min</em> anyway, the task that is allocating must reclaim pages itself before its allocation succeeds — your request handler stalls in the kernel. <code>allocstall_*</code> counts those events (589 on this VM since boot).</li>
</ul>
<p>Look at the two sets of counters. On the whole VM since boot, kswapd scanned 738,648 pages and direct reclaim 119,569: most global pressure is absorbed in the background. Inside our container it is the opposite: <code>pgscan_kswapd 0</code>, <code>pgscan_direct 134,910</code>. A cgroup at its <code>memory.max</code> is not a global shortage, so kswapd is not involved — <strong>every page reclaimed inside a full container is reclaimed by the process that wanted memory</strong>, on its own time. That is one reason a container near its limit feels slow before anything breaks. <code>workingset_refault_file</code> (76,823) counts evicted pages that were needed again: the cache was too small for what was being read.</p>

<h3>What gets reclaimed first: the LRU lists</h3>
<p>The kernel keeps pages on four lists: active and inactive, for file and for anon pages. New pages start inactive; touched again, they are promoted to active; reclaim takes from the inactive lists and demotes active pages to refill them. So the order is roughly: clean <strong>inactive file</strong> pages (drop, re-read later if needed) → <strong>dirty file</strong> pages (write back first) → <strong>anon</strong> pages, which can only go to swap, at a price set by swappiness (8.2). Recent kernels can use MGLRU — the same idea with several generations instead of two lists. The page-replacement algorithms you met in Chapter 7 (LRU, Clock) are exactly what these lists approximate.</p>
${lab('pagecache', 'lru', 'en', 'A 200-page cache and a loop over 256 pages, twice: plain LRU evicts exactly the page needed next. Two lists (active/inactive) exist partly to resist this.')}

<h3>drop_caches: what it really does</h3>
${run('c81-cache', 'sync; echo 1 > /proc/sys/vm/drop_caches', 2)}
<p>Writing <code>1</code> to <code>/proc/sys/vm/drop_caches</code> throws away all <em>clean</em> page cache (<code>2</code> = kernel dentry/inode caches, <code>3</code> = both; <code>sync</code> first so dirty pages become clean). free jumped from 2,651 to 4,447 MiB and buff/cache fell to 864. <strong>available stayed at 4,956</strong> — it had already counted that cache as yours. We ran it in a throw-away <code>--privileged</code> container, but the knob is global: it emptied the cache of the whole VM, including other containers.</p>

<div class="pitfall co-tieu-de">
<p><strong>Never put drop_caches in a cron job "to free RAM".</strong> It does not free anything you could not already get — it only throws away work, so every hot file (your binaries, your database's data files) is read from disk again and the server is slower for minutes. The only legitimate use is measuring a cold read on a test machine — and for that, evicting one file (<code>./incore file evict</code>, i.e. <code>posix_fadvise(DONTNEED)</code>) is cleaner because it touches nothing else.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate posts a screenshot: the team VPS shows <code>free 180</code> in <code>free -m</code> and wants to buy a bigger plan today. You have five minutes and a lab container to show, with numbers, whether that is needed.</p>
<ol>
<li>Start <code>docker run -it --rm --label oslab=1 --memory 512m os-lab</code>, build <code>incore.c</code>, and record <code>free -m</code> and <code>/sys/fs/cgroup/memory.stat</code> (<code>anon</code>, <code>file</code>).</li>
<li>Write a 400 MiB file with <code>dd</code>, run <code>./incore</code> on it, and read <code>memory.current</code> and <code>memory.events</code>. Did the container hit its limit? Did anything die?</li>
<li>Evict the file, time a cold <code>cat</code>, then a warm one. Compute the ratio.</li>
<li>Write down what you would check on the real VPS instead of <em>free</em>: <code>available</code>, and whether <code>anon</code> (not <code>file</code>) is close to the limit.</li>
</ol>
<p><strong>Done when:</strong> your reply contains three measured numbers — memory.current at the limit, <code>oom 0</code> in memory.events, and your cold/warm ratio — and one sentence saying which column decides whether the VPS needs more RAM.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['page cache', 'File data kept in RAM after a read or write; reused by later reads, reclaimable on demand.'],
  ['free vs available', 'free = RAM holding nothing; available = what a new program can get without swapping (free + reclaimable cache).'],
  ['anon vs file pages', 'Process memory with no file behind it (heap, stack) vs pages that are copies of a file.'],
  ['memory.current / memory.stat', 'A cgroup’s charged memory and its breakdown (anon, file, reclaim counters) — the container’s truth.'],
  ['reclaim', 'The kernel taking pages back: scan the LRU lists, drop clean pages, write back dirty ones, swap anon.'],
  ['kswapd', 'Background reclaim thread: wakes below the low watermark, sleeps above high.'],
  ['watermarks (min/low/high)', 'Per-zone thresholds of free memory that decide when background and direct reclaim run.'],
  ['direct reclaim', 'Reclaim done by the allocating task itself, so its request waits; always the case at a cgroup’s memory.max.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Watch <strong>available</strong>, not free: free trending to zero is normal, the page cache uses idle RAM.</li>
<li>Reading 1 GB moved 827 MiB from free to cache while available moved 13 MiB; drop_caches gave it back and available did not change.</li>
<li>In a container, <code>free</code> shows the host: read <code>memory.max</code>, <code>memory.current</code>, <code>memory.stat</code>.</li>
<li>Cache under a cgroup limit is reclaimed (max 427, oom 0); only anonymous memory can fill a container to death.</li>
<li>kswapd reclaims between the low and high watermarks; below min, or at memory.max, the allocating task reclaims itself.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc_meminfo.5.html', '📄', 'man 5 proc_meminfo', 'Every line of /proc/meminfo, including MemAvailable and the active/inactive lists.', 'Open')}
${L('https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html', '🐧', 'kernel.org — Concepts overview (memory management)', 'Page cache, anonymous memory, reclaim and the OOM killer, from the kernel documentation.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Máy chủ gần như hết bộ nhớ "free" thường là một máy chủ khoẻ mạnh</h2>
<p class="lead">Bạn mở <code>free -m</code> trên VPS, cột <em>free</em> chỉ còn vài trăm MB, và ai đó trong nhóm chat nói "hết RAM rồi, nâng gói đi". Thường thì họ sai — nhưng có lúc họ đúng, và bạn cần biết là trường hợp nào trong mười giây. Bài này trả lời một câu hỏi: <strong>bộ nhớ "free" đã đi đâu, và con số nào mới thật sự nghĩa là "sắp cạn"?</strong> Câu trả lời là page cache, và con số đó là <em>available</em>. Chương 7 cho thấy một tiến trình nhìn bộ nhớ thế nào; chương này nói về cả cỗ máy khi thiếu bộ nhớ.</p>

<h3>Bốn cột, một cột quan trọng</h3>
${run('c81-cache', 'free -m', 1)}
<p>Đây là VM lab (7.934 MiB) nhìn từ trong container lab của ta. Đọc các cột từ trái sang phải:</p>
<ul>
<li><strong>used</strong> (2.950) — bộ nhớ tiến trình và nhân đang giữ, không thể cứ thế trả lại: heap, stack, bảng trang, dữ liệu của nhân.</li>
<li><strong>free</strong> (3.682) — RAM <em>không chứa gì cả</em>. Một trang RAM để không là RAM phí, nên Linux cố giữ cột này nhỏ. Trên một máy chủ đã chạy nhiều ngày, vài trăm MB ở đây là bình thường.</li>
<li><strong>buff/cache</strong> (1.656) — dữ liệu file nhân giữ lại trong RAM sau khi bạn đọc hoặc ghi: <strong>page cache</strong>. Lần sau có ai đọc đúng file đó thì dùng lại miễn phí, và nó có thể bị bỏ đi ngay khi một chương trình cần RAM.</li>
<li><strong>available</strong> (4.984) — ước lượng của nhân về lượng bộ nhớ một chương trình mới lấy được <em>mà không phải swap</em>: xấp xỉ free cộng phần cache thu hồi được. <strong>Đây là con số cần theo dõi.</strong></li>
</ul>
<p>Nếu bạn đã học bài đọc <code>free</code> để phân loại sự cố ở Chương 2, thì đây là cơ chế nằm bên dưới quy tắc đó.</p>

<h3>/proc/meminfo: nơi free lấy số</h3>
${run('c81-cache', "grep -E '^(MemTotal", 1)}
<p><code>free</code> chỉ định dạng lại file này. <code>MemAvailable</code> (5.103.160 kB = 4.984 MiB ở trên) được nhân tính từ <code>MemFree</code> cộng phần thu hồi được của <code>Active(file)</code> + <code>Inactive(file)</code> (khoảng 1,26 GB trang file đang cache ở đây) cộng phần slab của nhân thu hồi được, trừ đi một khoản dự trữ nó luôn giữ. <code>Active(anon)</code> + <code>Inactive(anon)</code> — 2,5 GB — là bộ nhớ của tiến trình: các trang heap và stack không có file nào đứng sau, chỉ rời RAM được qua swap (bài 8.2). <code>Dirty</code> là dữ liệu chương trình đã ghi vào cache nhưng chưa xuống đĩa.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>free</code> và <code>top</code> trong container mô tả nhầm máy.</strong> Container này bị giới hạn 1 GiB, nhưng <code>free</code> ở trên in ra 7.934 MiB của cả VM, vì <code>/proc/meminfo</code> không tách theo container. Một tiến trình Node hay Java tự chọn kích cỡ dựa vào nó sẽ tưởng mình sở hữu cả máy chủ. Con số thật của container nằm trong cgroup của nó:</p>
${run('c81-cache', 'cat /sys/fs/cgroup/memory.max', 2)}
<p><code>memory.max</code> là giới hạn (1.073.741.824 = 1 GiB), <code>memory.current</code> là lượng đang bị tính ngay lúc này, và <code>memory.stat</code> tách nó thành <code>anon</code> và <code>file</code> — đúng sự phân biệt anon/file của meminfo, nhưng chỉ cho container này.</p>
</div>

<h3>Ghi một file là lấp page cache</h3>
<p>Muốn thấy cache, ta phải hỏi trang nào của một file đang nằm trong RAM. Công cụ nhỏ này làm việc đó bằng <code>mincore()</code> (cùng ý tưởng với <code>fincore</code> hay <code>vmtouch</code>), và còn xin được nhân bỏ các trang sạch của riêng một file bằng <code>posix_fadvise(DONTNEED)</code>:</p>
${src('ch08/incore.c', 'c')}
${run('c81-cache', 'dd if=/dev/urandom', 1)}
${run('c81-cache', './incore /tmp/big', 1)}
${run('c81-cache', "grep -E '^(anon|file|file_dirty) '", 2)}
<p>Ta ghi 200 MiB và cả 51.200 trang của file giờ nằm trong RAM. <code>memory.stat</code> khớp: <code>file</code> tăng từ 118 kB lên 209.907.712 byte = 200 MiB, tính cho container này. Page cache không phải một kho bộ nhớ riêng; nó là RAM bình thường mà nhân cho file mượn khi chưa ai khác cần. Sau <code>sync</code>, <code>file_dirty</code> bằng 0: dữ liệu đã nằm an toàn trên đĩa <em>và</em> vẫn còn trong cache.</p>

<h3>Đọc nguội và đọc ấm: vì sao cần cache</h3>
${run('c81-cache', './incore /tmp/big evict', 4)}
<p>Đuổi riêng file này ra, đọc nguội: 0,044 s. Đọc lại khi ấm: 0,003 s, nhanh hơn khoảng 15 lần. Khoảng cách nhỏ vì đĩa của VM này là một file trên máy Mac mà macOS cache trong RAM của chính nó. Trên SSD của VPS hay đĩa mạng, khoảng cách là thứ Chương 7 đã đo với đọc ngẫu nhiên: ~52 µs mỗi trang 4 KiB từ đĩa so với ~0,2 µs từ cache. Tỉ lệ đó là lý do nhân giữ lại từng byte dữ liệu file mà nó giữ được.</p>
${lab('pagecache', 'warm', 'vi', 'Cùng những lần đọc ngẫu nhiên, nguội rồi ấm: khi file đã nằm trong page cache thì không còn I/O đĩa nào. Chuyển sang preset seq để xem đọc trước che đi một lần đọc tuần tự nguội.')}

<h3>Đọc 1 GB: free tụt, available thì không</h3>
${run('c81-cache', 'free -m | head -2', 3)}
<p>Đọc một file 1 GB đã chuyển <strong>827 MiB ra khỏi free</strong> (3.478 → 2.651) và chừng đó vào buff/cache (1.856 → 2.671). <strong>available chỉ nhích 13 MiB</strong> (4.980 → 4.967). Không mất gì cả: RAM vẫn ở đó cho bất kỳ chương trình nào xin — chỉ là trong lúc chờ nó giữ một bản sao của file. Máy chủ có <em>free</em> thấp và <em>available</em> cao là máy đang làm đúng việc của nó.</p>

<h3>Dưới giới hạn cgroup, chỉ riêng cache không bao giờ khiến bạn bị giết</h3>
${run('c81-cache', './incore /tmp/big; ./incore /tmp/huge', 1)}
${run('c81-cache', 'cat /sys/fs/cgroup/memory.current', 1)}
${run('c81-cache', 'cat /sys/fs/cgroup/memory.events', 1)}
<p>Ta đẩy 1,2 GB file qua một container 1 GiB. <code>memory.current</code> nằm ở 1.071.300.608 byte — sát giới hạn, <code>memory.peak</code> chạm đúng giới hạn — và nhân chỉ giữ lại 51% file thứ nhất và 90% file thứ hai. <code>memory.events</code> ghi <code>max 427</code>: 427 lần nhóm chạm giới hạn và phải thu hồi. Và <code>oom 0</code>. Page cache sạch luôn bỏ được, nên một container đầy cache không bao giờ bị OOM kill vì nó. Khi một container chết vì OOM, thứ làm đầy nó là bộ nhớ ẩn danh.</p>
${lab('cgroup', 'cache', 'vi', 'Không rò rỉ, một dịch vụ đọc tuần tự file 4 GB: memory.current nằm sát trần, memory.stat ghi file, và không bao giờ có OOM.')}

<h3>Ai thu hồi, và khi nào: kswapd và các watermark</h3>
${run('c81-cache', "grep -E '^(pgscan|pgsteal", 1)}
${run('c81-cache', "grep -A5 'zone", 1)}
${run('c81-cache', "grep -E '^(pgscan_kswapd", 1)}
<p><strong>Thu hồi (reclaim)</strong> là việc nhân lấy lại trang: quét các danh sách LRU (<code>pgscan</code>) và giải phóng trang (<code>pgsteal</code>). Có hai bên làm việc đó:</p>
<ul>
<li><strong>kswapd</strong>, mỗi nút bộ nhớ một luồng nhân, làm ở chế độ nền. Mỗi zone có ba <strong>watermark (mốc nước)</strong> — ở đây zone Normal: <code>min</code> 8.136 trang (31,8 MiB), <code>low</code> 10.170 (39,7 MiB), <code>high</code> 12.204 (47,7 MiB), suy ra từ <code>vm.min_free_kbytes</code>. Khi bộ nhớ trống tụt dưới <em>low</em>, kswapd thức dậy và thu hồi cho tới khi lại vượt <em>high</em>. Không ai phải chờ nó.</li>
<li><strong>Thu hồi trực tiếp (direct reclaim)</strong>: nếu bộ nhớ trống vẫn tụt dưới <em>min</em>, tác vụ đang cấp phát phải tự thu hồi trang trước khi lần cấp phát của nó thành công — hàm xử lý yêu cầu của bạn bị kẹt trong nhân. <code>allocstall_*</code> đếm những lần như vậy (589 trên VM này kể từ lúc khởi động).</li>
</ul>
<p>Nhìn hai bộ đếm. Trên cả VM kể từ lúc khởi động, kswapd quét 738.648 trang và thu hồi trực tiếp 119.569: phần lớn áp lực toàn cục được hấp thụ ở chế độ nền. Trong container của ta thì ngược lại: <code>pgscan_kswapd 0</code>, <code>pgscan_direct 134.910</code>. Một cgroup chạm <code>memory.max</code> không phải là thiếu bộ nhớ toàn cục, nên kswapd không dính vào — <strong>mọi trang được thu hồi trong một container đầy đều do chính tiến trình muốn bộ nhớ thu hồi</strong>, bằng thời gian của nó. Đó là một lý do container sát giới hạn có cảm giác chậm trước khi có gì hỏng. <code>workingset_refault_file</code> (76.823) đếm các trang đã bị đuổi nhưng lại cần đến: cache quá nhỏ so với thứ đang được đọc.</p>

<h3>Cái gì bị thu hồi trước: các danh sách LRU</h3>
<p>Nhân giữ trang trên bốn danh sách: active và inactive, cho trang file và cho trang anon. Trang mới bắt đầu ở inactive; được chạm lại thì lên active; việc thu hồi lấy từ danh sách inactive và hạ trang active xuống để bù. Nên thứ tự đại khái là: trang <strong>file inactive</strong> sạch (bỏ, cần thì đọc lại) → trang <strong>file bẩn</strong> (ghi về trước) → trang <strong>anon</strong>, chỉ đi ra swap được, với cái giá do swappiness đặt (8.2). Nhân mới có thể dùng MGLRU — cùng ý tưởng nhưng có nhiều thế hệ thay vì hai danh sách. Các thuật toán thay trang bạn gặp ở Chương 7 (LRU, Clock) chính là thứ những danh sách này xấp xỉ.</p>
${lab('pagecache', 'lru', 'vi', 'Cache 200 trang và một vòng lặp qua 256 trang, hai lần: LRU thuần đuổi đúng trang sắp cần. Hai danh sách (active/inactive) sinh ra một phần để chống chuyện này.')}

<h3>drop_caches thật ra làm gì</h3>
${run('c81-cache', 'sync; echo 1 > /proc/sys/vm/drop_caches', 2)}
<p>Ghi <code>1</code> vào <code>/proc/sys/vm/drop_caches</code> vứt bỏ toàn bộ page cache <em>sạch</em> (<code>2</code> = cache dentry/inode của nhân, <code>3</code> = cả hai; <code>sync</code> trước để trang bẩn thành sạch). free nhảy từ 2.651 lên 4.447 MiB và buff/cache tụt còn 864. <strong>available vẫn ở 4.956</strong> — nó vốn đã tính phần cache đó là của bạn. Ta chạy lệnh trong một container <code>--privileged</code> vứt đi, nhưng núm này là toàn cục: nó làm rỗng cache của cả VM, kể cả của container khác.</p>

<div class="pitfall co-tieu-de">
<p><strong>Đừng bao giờ đặt drop_caches vào cron "để giải phóng RAM".</strong> Nó không giải phóng thứ gì bạn chưa lấy được sẵn — nó chỉ vứt bỏ công sức, nên mọi file đang nóng (file thực thi của bạn, file dữ liệu của CSDL) lại phải đọc từ đĩa và máy chủ chậm đi nhiều phút. Công dụng chính đáng duy nhất là đo một lần đọc nguội trên máy thử — và cho việc đó, đuổi riêng một file (<code>./incore file evict</code>, tức <code>posix_fadvise(DONTNEED)</code>) sạch hơn vì không đụng tới thứ khác.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn trong nhóm gửi ảnh chụp: VPS của nhóm hiện <code>free 180</code> trong <code>free -m</code> và muốn mua gói lớn hơn ngay hôm nay. Bạn có năm phút và một container lab để chứng minh, bằng số đo, việc đó có cần hay không.</p>
<ol>
<li>Chạy <code>docker run -it --rm --label oslab=1 --memory 512m os-lab</code>, biên dịch <code>incore.c</code>, rồi ghi lại <code>free -m</code> và <code>/sys/fs/cgroup/memory.stat</code> (<code>anon</code>, <code>file</code>).</li>
<li>Ghi một file 400 MiB bằng <code>dd</code>, chạy <code>./incore</code> trên nó, rồi đọc <code>memory.current</code> và <code>memory.events</code>. Container có chạm giới hạn không? Có gì chết không?</li>
<li>Đuổi file đó ra, bấm giờ một lần <code>cat</code> nguội, rồi một lần ấm. Tính tỉ lệ.</li>
<li>Ghi ra bạn sẽ kiểm gì trên VPS thật thay cho <em>free</em>: <code>available</code>, và <code>anon</code> (không phải <code>file</code>) có sát giới hạn không.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời của bạn có ba con số tự đo — memory.current chạm giới hạn, <code>oom 0</code> trong memory.events, và tỉ lệ nguội/ấm — cùng một câu nói rõ cột nào quyết định VPS có cần thêm RAM.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['page cache (bộ đệm trang)', 'Dữ liệu file giữ trong RAM sau khi đọc hoặc ghi; lần đọc sau dùng lại, thu hồi được khi cần.'],
  ['free vs available', 'free = RAM không chứa gì; available = lượng một chương trình mới lấy được mà không phải swap (free + cache thu hồi được).'],
  ['anon vs file (trang ẩn danh vs trang file)', 'Bộ nhớ tiến trình không có file đứng sau (heap, stack) vs trang là bản sao của một file.'],
  ['memory.current / memory.stat', 'Lượng bộ nhớ tính cho một cgroup và bảng chi tiết (anon, file, bộ đếm thu hồi) — sự thật của container.'],
  ['reclaim (thu hồi)', 'Nhân lấy lại trang: quét danh sách LRU, bỏ trang sạch, ghi về trang bẩn, đẩy trang anon ra swap.'],
  ['kswapd', 'Luồng thu hồi nền: thức dậy dưới mốc low, ngủ khi vượt high.'],
  ['watermark min/low/high (mốc nước)', 'Ngưỡng bộ nhớ trống của mỗi zone, quyết định khi nào thu hồi nền và thu hồi trực tiếp chạy.'],
  ['direct reclaim (thu hồi trực tiếp)', 'Thu hồi do chính tác vụ đang cấp phát làm, nên yêu cầu của nó phải chờ; luôn là vậy khi cgroup chạm memory.max.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Theo dõi <strong>available</strong>, không phải free: free tiến về 0 là bình thường, page cache dùng phần RAM đang rảnh.</li>
<li>Đọc 1 GB chuyển 827 MiB từ free sang cache trong khi available chỉ nhích 13 MiB; drop_caches trả lại và available không đổi.</li>
<li>Trong container, <code>free</code> cho thấy máy chủ: hãy đọc <code>memory.max</code>, <code>memory.current</code>, <code>memory.stat</code>.</li>
<li>Cache dưới giới hạn cgroup được thu hồi (max 427, oom 0); chỉ bộ nhớ ẩn danh mới làm đầy một container tới chết.</li>
<li>kswapd thu hồi giữa mốc low và high; dưới min, hoặc ở memory.max, chính tác vụ đang cấp phát phải tự thu hồi.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc_meminfo.5.html', '📄', 'man 5 proc_meminfo', 'Từng dòng của /proc/meminfo, gồm MemAvailable và các danh sách active/inactive.', 'Mở')}
${L('https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html', '🐧', 'kernel.org — Concepts overview (quản lý bộ nhớ)', 'Page cache, bộ nhớ ẩn danh, thu hồi và OOM killer, theo tài liệu của nhân.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 8.2 — Swap ───────────────────────── */
    {
      title: '8.2 — Swap, swappiness and thrashing, measured|||8.2 — Swap, swappiness và thrashing, đo thật',
      slug: 'os-8-2-swap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao chỉ trang ẩn danh cần swap; swappiness là một mức giá (memory.reclaim với swappiness=0 từ chối bằng EAGAIN, 200 đẩy 11 MiB ra swap); thrashing đo được: 12 ns → ~35 µs mỗi trang khi working set vượt RAM; swap có ích khi giữ bộ nhớ rảnh; thrashing không cần swap (1 ms mỗi trang, 91 triệu lần đọc lại, oom 0); PSI; zram/zswap; đĩa Mac đầy 27/10.',
      content: `${G82}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Swap does not add memory — it decides where memory can wait</h2>
<p class="lead">"Swap used: 900 MB" on a dashboard sends half the team into a panic and makes the other half say "swap is fine". Some servers become unusable without ever killing anything; others crash the moment swap is turned off. Three questions explain all of it: <strong>which pages can leave RAM at all, how does the kernel choose between them, and what does it cost when the pages you need are not in RAM?</strong> We answer each with a measurement in a container that has 128 MiB of RAM and 256 MiB of swap.</p>

<h3>Only anonymous pages need swap</h3>
<p>Lesson 8.1 split memory into file pages and anonymous pages. When RAM is full, a <em>clean file page</em> can simply be dropped — the file on disk is its backup, it can be read back later. A <em>dirty</em> file page is written back first, then dropped. An <strong>anonymous page</strong> — malloc memory, a thread stack, the V8 heap, the JVM heap — has no file behind it. Without somewhere to write it, the kernel can never take it out of RAM. That somewhere is <strong>swap</strong>: a file or partition reserved for anonymous pages. It is not extra RAM; it is a parking lot about a thousand times slower than RAM.</p>
${run('c82-swap', 'swapon --show', 1)}
${run('c82-swap', 'cat /proc/sys/vm/swappiness', 1)}
${run('c82-swap', 'cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max', 1)}
<p>The lab VM has a 1 GiB swap file and the default <code>vm.swappiness</code> of 60. Our container was started with <code>--memory 128m --memory-swap 384m</code>: <code>--memory-swap</code> is the <em>total</em> of RAM and swap, so this container may use 256 MiB of that swap file — the kernel enforces it as <code>memory.swap.max</code>.</p>

<h3>swappiness is a price, not a percentage</h3>
<p>The most quoted and most misunderstood knob. <code>vm.swappiness</code> (0–200) is the <em>relative cost</em> the reclaim code assigns to swapping an anonymous page versus dropping a file page. It is not "start swapping when RAM is 60% full". cgroup v2 lets us ask for reclaim on one cgroup with an explicit swappiness, so we can watch the price at work. A process holds 40 MiB of anonymous memory, and the container has some file cache:</p>
${run('c82-swap', './hold 40 &', 2)}
${run('c82-swap', 'echo "200M swappiness=0"', 2)}
<p>We asked for 200 MiB at swappiness 0. The kernel dropped <strong>every</strong> file page (file 40,472,576 → 0) and then refused with <code>EAGAIN</code> (os error 11): the remaining memory is anonymous, and at swappiness 0 anonymous pages are not for sale. The process's 41 MiB did not move.</p>
${run('c82-swap', 'echo "10M swappiness=200"', 2)}
<p>At swappiness 200 anonymous pages cost the same as file pages. There is no cache left, so the 10 MiB comes out of the process: anon 43.3 → 31.9 MB, and 11.5 MB appear in swap.</p>
${run('c82-swap', 'dd if=/dev/zero of=/tmp/f', 4)}
<p>Give it 20 MiB of fresh cache and ask again at swappiness 0: the file pages pay (20 → 10 MiB), anon and swap do not change. The default 60 sits in between: cache goes first, anonymous memory is swapped only when cache is scarce or cold anonymous pages are clearly cheaper. On cgroup v2 this is a global setting — Docker's <code>--memory-swappiness</code> is ignored with a warning, which lesson 8.5 shows.</p>

<h3>Thrashing, measured page by page</h3>
<p>Now the cost. This program builds a working set of N MiB and touches one byte of every page per pass, in random or sequential order, timing each pass and counting major faults — page faults that had to read from swap or disk (Chapter 7):</p>
${src('ch08/ws.c', 'c')}
${run('c82-swap', './ws 64 3 rand', 1)}
${run('c82-swap', './ws 160 3 rand', 1)}
${run('c82-swap', "grep -E '^(pswpin", 1)}
<p>64 MiB fits in 128 MiB of RAM: after the first pass, about <strong>12 ns per page</strong> and no major faults. 160 MiB does not fit: every pass needs <strong>15,000–19,000 major faults</strong> — that many 4 KiB pages read back from swap — and costs <strong>30–38 µs per page</strong>, about three thousand times more. <code>pswpin</code>/<code>pswpout</code> count pages swapped in and out of this cgroup. This is <strong>thrashing</strong>: the working set — the pages the program touches again and again — is bigger than the RAM it gets, so it spends its time moving pages instead of computing. The cliff is not gradual: the same code, 2.5× more data, three orders of magnitude slower. You met the same cliff as a page-replacement exercise in Chapter 7; slide RAM away and watch it here:</p>
${lab('vm', 'pressure', 'en', 'Five pages, three frames: every reference evicts something the next reference needs. Drag the RAM slider down and watch the fault rate.')}
${lab('vm', 'loop', 'en', 'A loop over 5 pages with 4 frames: LRU faults on every single reference. One frame short is as bad as having none.', { tour: 'vm-thrash' })}
${run('c82-swap', './ws 160 3 seq', 1)}
<p>Sequential order needs fewer major faults (6,000–8,000 per pass: swap read-ahead brings in neighbouring pages) but is not much faster: each fault is still a trip to the swap device, and the kernel keeps evicting the pages it will need next pass.</p>

<h3>Swap that helps: idle memory out, hot memory in</h3>
${run('c82-swap', './hold 150 &', 3)}
<p>A 150 MiB process that never touches its memory again, next to an 80 MiB hot loop, in 128 MiB of RAM. Together they need 230 MiB. The kernel parked <strong>109,216 kB (107 MiB)</strong> of the idle process in swap and the hot loop ran at full speed, ~15 ns per page, zero major faults. This is what swap is for: memory that was allocated once and is rarely touched — start-up data, a big library loaded "just in case", a tab nobody looks at — goes to disk, and RAM goes to the pages being used. <strong>Without swap this exact pair is an OOM kill</strong>: those 150 MiB are anonymous and have nowhere else to go.</p>
${lab('cgroup', 'swap', 'en', 'A leaking service with memory.swap.max = 200M: anonymous pages go to swap first, so the kill comes later — and the extra seconds are very slow.')}

<div class="pitfall co-tieu-de">
<p><strong>"Swap used" is not an alarm.</strong> The 107 MiB above sit in swap and cost nothing, because nobody reads them. What hurts is swap <em>traffic</em> on pages that are needed: rising <code>pswpin</code>, major faults, and the pressure numbers below. Alert on those, not on how full swap is.</p>
</div>

<h3>No swap does not mean no thrashing</h3>
<p>Turning swap off feels safe: no slow disk for anonymous memory. But file pages still have to be read back when evicted. The same test, swap off, on a 200 MiB <em>file</em> mapped into a 128 MiB container:</p>
${run('c82-file', 'cat /sys/fs/cgroup/memory.swap.max', 1)}
${run('c82-file', './ws 64 3 rand', 1)}
${run('c82-file', './ws 200 3 rand', 1)}
${run('c82-file', "grep -E '^(workingset", 1)}
<p>64 MiB of file fits: one cold pass, then 8 ns per page. 200 MiB does not: <strong>about a millisecond per page, a full minute per pass</strong>. The kernel re-read evicted pages 91,379,236 times for 153,600 touches — around 600 for each page the program asked for — because read-ahead pulls neighbouring pages in and a cgroup this small evicts them before they are used. And the container was never killed:</p>
${run('c82-file', 'cat /sys/fs/cgroup/memory.events', 1)}
<p><code>max 1,782,535</code> limit hits, <code>oom 0</code>. Everything here is reclaimable, so the OOM killer has no reason to act. This is the classic "the server froze for twenty minutes and then came back" incident: the executables and libraries of every process are file pages too, and on a box with too little RAM they are evicted and re-read on every request.</p>

<h3>PSI: one number for "how bad is it"</h3>
${run('c82-file', 'cat /sys/fs/cgroup/memory.pressure', 1)}
<p><strong>Pressure stall information</strong> answers the question no other counter answers: how much time is lost waiting for memory. <code>some</code> is the share of wall time in which at least one task was stalled on memory (reclaim, refaulting a recently evicted page, swap-in); <code>full</code> is the share in which <em>all</em> non-idle tasks were stalled, so nothing useful ran. <code>avg10</code>, <code>avg60</code>, <code>avg300</code> are moving averages over 10 s, 1 min and 5 min; <code>total</code> is microseconds stalled since the cgroup was created. In the file-thrash run above, <strong>35% of every second</strong> was lost, for minutes — while memory.events still said <code>oom 0</code>. The same file exists for the whole machine as <code>/proc/pressure/memory</code>.</p>
${run('c82-swap', 'cat /sys/fs/cgroup/memory.pressure', 1)}
<p>The swap-thrash run shows how to read it: <code>avg10</code> is only 3.44 because the run lasted about four seconds and the 10-second average had not caught up, but <code>total</code> says 456,959 µs — almost half a second of those four was spent stalled. For short events read the total; for alerts use avg10/avg60 over minutes.</p>
${lab('cgroup', 'high', 'en', 'memory.pressure on a timeline: with memory.high = 384M under a leak, the kernel reclaims and throttles above the soft limit — the service slows down and pressure rises long before memory.max kills it. That rise is the early warning PSI gives you.')}

<h3>zram and zswap: compress before you swap</h3>
${run('c82-swap', 'cat /sys/module/zswap/parameters/enabled', 1)}
<ul>
<li><strong>zram</strong> is a block device in RAM that compresses whatever is written to it; used as swap, an idle page compressed 3:1 frees two thirds of its RAM without any disk I/O. It is the default swap on Fedora (since 33), ChromeOS and Android, and a good choice for small VPSes with slow disks.</li>
<li><strong>zswap</strong> is a compressed cache <em>in front of</em> a real swap device: pages are compressed into a RAM pool first and only the coldest are written to disk. cgroup v2 can cap it per group (<code>memory.zswap.max</code>).</li>
</ul>
<p>On this lab VM zswap is built in but disabled (<code>N</code>) and there is no zram device. Enabling either is a change to the whole Docker VM, shared with other containers, so we describe them here and did <strong>not</strong> measure them.</p>

<div class="pitfall co-tieu-de">
<p><strong>Swap and the VM disk live on disk — keep the disk free.</strong> On 27/10/2026 the Mac that builds this course ran down to 350 MB of free disk, mostly 25 GB of rendered videos plus a 46 GB <code>Docker.raw</code> (the Docker Desktop VM's disk, which does not shrink when you prune). Commands failed with ENOSPC and Docker Desktop hung. macOS swaps to files on the same disk, and the Linux VM inside Docker keeps its own disk and swap file on it too: with no free disk, memory pressure has nowhere to go. Watch <code>df</code> next to memory — the two run out together.</p>
</div>

<h3>If you have done OSG202 lesson 3.4</h3>
<p>OSG202 defines thrashing with the working-set model and the page-fault-frequency curve. Here is the same curve as three real numbers — 12 ns, ~35 µs, ~1 ms per page — and the counters that show it on a live server.</p>
${L(OSG34, '🎓', 'OSG202 · 3.4 — Thrashing', 'Working sets, page-fault frequency and why adding processes can make a machine slower.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the team's Spring Boot service gets slow every afternoon. Grafana shows "swap used 900 MB" and one teammate wants to set <code>swapoff -a</code> on the VPS. You will decide with measurements whether swap is the problem.</p>
<ol>
<li>Start <code>docker run -it --rm --label oslab=1 --memory 128m --memory-swap 384m os-lab</code>, build <code>ws.c</code> and <code>hold.c</code>.</li>
<li>Run <code>./ws 64 3 rand</code>, <code>./ws 100 3 rand</code>, <code>./ws 160 3 rand</code>. Plot ns/page against working-set size and find the cliff.</li>
<li>Run <code>./hold 150 &amp;</code> then <code>./ws 80 3 rand</code>; read <code>VmSwap</code> of hold and <code>memory.pressure</code>.</li>
<li>Restart with <code>--memory-swap 128m</code> (no swap) and run the same pair. What happens to hold?</li>
</ol>
<p><strong>Done when:</strong> you can tell the teammate, with your numbers, that "swap used" was harmless in step 3, that removing swap turned it into an OOM kill in step 4, and that the metric to alert on is PSI or swap-in rate, not swap used.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['swap', 'Disk space (file or partition) that gives anonymous pages somewhere to go when RAM is needed.'],
  ['--memory-swap', 'Docker: TOTAL of RAM + swap for the container; equal to --memory means no swap.'],
  ['swappiness', '0–200: relative cost of reclaiming anon (swap) vs file pages. 0 = file only; 200 = equal.'],
  ['thrashing', 'Working set bigger than RAM: the system spends its time moving pages instead of working.'],
  ['working set', 'The pages a program touches repeatedly within a short window.'],
  ['major fault / swap-in', 'A page fault that must read from disk or swap; pswpin counts swap-ins.'],
  ['PSI (pressure stall information)', 'Share of time tasks were stalled on memory: some (at least one) and full (all).'],
  ['zram / zswap', 'Compressed RAM used as swap / compressed cache in front of a real swap device.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>File pages can always be dropped; anonymous pages leave RAM only through swap.</li>
<li>swappiness prices anon against file: at 0 reclaim refused (EAGAIN) rather than swap; at 200 it swapped 11 MiB.</li>
<li>Past the working-set cliff a page costs ~35 µs instead of ~12 ns, with 15,000–19,000 swap-ins per pass.</li>
<li>Swap helps by holding idle memory (107 MiB parked, hot loop unaffected); without it that pair is an OOM kill.</li>
<li>Without swap, file pages thrash instead (~1 ms per page, oom 0); PSI measures the damage.</li>
</ul>
${L('https://docs.kernel.org/accounting/psi.html', '🐧', 'kernel.org — PSI: Pressure Stall Information', 'some/full, the averages, and how to set pressure triggers.', 'Open')}
${L('https://docs.kernel.org/admin-guide/sysctl/vm.html', '📄', 'kernel.org — /proc/sys/vm (swappiness and friends)', 'swappiness, min_free_kbytes, overcommit and the other VM tunables.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Swap không thêm bộ nhớ — nó quyết định bộ nhớ được chờ ở đâu</h2>
<p class="lead">"Swap used: 900 MB" trên bảng giám sát khiến một nửa nhóm hoảng loạn và nửa kia bảo "swap thì kệ nó". Có máy chủ trở nên không dùng được mà chẳng giết ai; có máy lại sập ngay khi tắt swap. Ba câu hỏi giải thích hết: <strong>trang nào được phép rời RAM, nhân chọn giữa chúng thế nào, và cái giá là bao nhiêu khi trang bạn cần không nằm trong RAM?</strong> Ta trả lời từng câu bằng số đo trong một container có 128 MiB RAM và 256 MiB swap.</p>

<h3>Chỉ trang ẩn danh mới cần swap</h3>
<p>Bài 8.1 chia bộ nhớ thành trang file và trang ẩn danh. Khi RAM đầy, một <em>trang file sạch</em> có thể bỏ luôn — file trên đĩa là bản sao lưu của nó, cần thì đọc lại. Trang file <em>bẩn</em> được ghi về trước, rồi bỏ. Một <strong>trang ẩn danh (anonymous)</strong> — bộ nhớ malloc, stack của luồng, heap của V8, heap của JVM — không có file nào đứng sau. Không có chỗ nào để ghi nó ra, nhân không bao giờ lấy nó khỏi RAM được. Chỗ đó chính là <strong>swap</strong>: một file hay phân vùng dành riêng cho trang ẩn danh. Nó không phải RAM thêm; nó là một bãi đỗ xe chậm hơn RAM cỡ một nghìn lần.</p>
${run('c82-swap', 'swapon --show', 1)}
${run('c82-swap', 'cat /proc/sys/vm/swappiness', 1)}
${run('c82-swap', 'cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max', 1)}
<p>VM lab có một file swap 1 GiB và <code>vm.swappiness</code> mặc định là 60. Container của ta khởi động với <code>--memory 128m --memory-swap 384m</code>: <code>--memory-swap</code> là <em>tổng</em> RAM và swap, nên container này được dùng 256 MiB của file swap đó — nhân áp nó thành <code>memory.swap.max</code>.</p>

<h3>swappiness là một mức giá, không phải phần trăm</h3>
<p>Núm vặn được trích dẫn nhiều nhất và hiểu sai nhiều nhất. <code>vm.swappiness</code> (0–200) là <em>chi phí tương đối</em> mà mã thu hồi gán cho việc swap một trang ẩn danh so với bỏ một trang file. Nó không phải "bắt đầu swap khi RAM đầy 60%". cgroup v2 cho phép xin thu hồi trên một cgroup với swappiness ghi rõ, nên ta xem được mức giá hoạt động. Một tiến trình giữ 40 MiB bộ nhớ ẩn danh, và container có một ít cache file:</p>
${run('c82-swap', './hold 40 &', 2)}
${run('c82-swap', 'echo "200M swappiness=0"', 2)}
<p>Ta xin 200 MiB ở swappiness 0. Nhân bỏ <strong>mọi</strong> trang file (file 40.472.576 → 0) rồi từ chối bằng <code>EAGAIN</code> (os error 11): phần còn lại là bộ nhớ ẩn danh, và ở swappiness 0 trang ẩn danh không được đem bán. 41 MiB của tiến trình không nhúc nhích.</p>
${run('c82-swap', 'echo "10M swappiness=200"', 2)}
<p>Ở swappiness 200, trang ẩn danh rẻ ngang trang file. Cache không còn, nên 10 MiB phải lấy từ tiến trình: anon 43,3 → 31,9 MB, và 11,5 MB xuất hiện trong swap.</p>
${run('c82-swap', 'dd if=/dev/zero of=/tmp/f', 4)}
<p>Cho nó 20 MiB cache mới rồi xin lại ở swappiness 0: trang file trả giá (20 → 10 MiB), anon và swap không đổi. Mức mặc định 60 nằm giữa: cache đi trước, bộ nhớ ẩn danh chỉ bị swap khi cache khan hiếm hoặc trang ẩn danh nguội rõ ràng rẻ hơn. Trên cgroup v2 đây là thiết lập toàn cục — cờ <code>--memory-swappiness</code> của Docker bị bỏ qua kèm cảnh báo, bài 8.5 cho thấy.</p>

<h3>Thrashing, đo từng trang</h3>
<p>Giờ tới cái giá. Chương trình này dựng một working set N MiB và chạm một byte ở mỗi trang mỗi lượt, theo thứ tự ngẫu nhiên hoặc tuần tự, bấm giờ từng lượt và đếm major fault — các page fault phải đọc từ swap hoặc đĩa (Chương 7):</p>
${src('ch08/ws.c', 'c')}
${run('c82-swap', './ws 64 3 rand', 1)}
${run('c82-swap', './ws 160 3 rand', 1)}
${run('c82-swap', "grep -E '^(pswpin", 1)}
<p>64 MiB vừa trong 128 MiB RAM: sau lượt đầu, khoảng <strong>12 ns mỗi trang</strong> và không có major fault. 160 MiB không vừa: mỗi lượt cần <strong>15.000–19.000 major fault</strong> — chừng đó trang 4 KiB đọc lại từ swap — và tốn <strong>30–38 µs mỗi trang</strong>, đắt hơn khoảng ba nghìn lần. <code>pswpin</code>/<code>pswpout</code> đếm số trang swap vào và ra của cgroup này. Đây là <strong>thrashing</strong>: working set — các trang chương trình chạm đi chạm lại — lớn hơn lượng RAM nó được, nên nó tiêu thời gian vào việc dời trang thay vì tính toán. Bờ vực không thoai thoải: cùng một đoạn mã, dữ liệu nhiều hơn 2,5 lần, chậm đi ba bậc độ lớn. Bạn đã gặp đúng bờ vực này dưới dạng bài tập thay trang ở Chương 7; kéo bớt RAM và nhìn nó ở đây:</p>
${lab('vm', 'pressure', 'vi', 'Năm trang, ba khung: lần tham chiếu nào cũng đuổi thứ mà lần sau cần. Kéo thanh RAM xuống và nhìn tỉ lệ fault.')}
${lab('vm', 'loop', 'vi', 'Vòng lặp qua 5 trang với 4 khung: LRU fault ở mọi lần tham chiếu. Thiếu một khung cũng tệ như không có khung nào.', { tour: 'vm-thrash' })}
${run('c82-swap', './ws 160 3 seq', 1)}
<p>Thứ tự tuần tự cần ít major fault hơn (6.000–8.000 mỗi lượt: swap đọc trước các trang lân cận) nhưng không nhanh hơn bao nhiêu: mỗi fault vẫn là một chuyến tới thiết bị swap, và nhân cứ đuổi các trang mà lượt sau sẽ cần.</p>

<h3>Swap có ích: bộ nhớ rảnh ra ngoài, bộ nhớ nóng ở lại</h3>
${run('c82-swap', './hold 150 &', 3)}
<p>Một tiến trình 150 MiB không bao giờ chạm lại bộ nhớ của nó, cạnh một vòng lặp nóng 80 MiB, trong 128 MiB RAM. Cộng lại cần 230 MiB. Nhân gửi <strong>109.216 kB (107 MiB)</strong> của tiến trình rảnh ra swap và vòng lặp nóng chạy hết tốc độ, ~15 ns mỗi trang, không major fault nào. Đây là việc swap sinh ra để làm: bộ nhớ cấp một lần rồi hiếm khi chạm — dữ liệu lúc khởi động, một thư viện to nạp "phòng khi cần", một tab không ai nhìn — đi xuống đĩa, còn RAM dành cho trang đang được dùng. <strong>Không có swap thì đúng cặp này là một lần OOM kill</strong>: 150 MiB đó là bộ nhớ ẩn danh, không còn chỗ nào khác để đi.</p>
${lab('cgroup', 'swap', 'vi', 'Một dịch vụ rò rỉ với memory.swap.max = 200M: trang ẩn danh ra swap trước, nên cú giết tới muộn hơn — và những giây thêm đó rất chậm.')}

<div class="pitfall co-tieu-de">
<p><strong>"Swap used" không phải chuông báo động.</strong> 107 MiB ở trên nằm trong swap và chẳng tốn gì, vì không ai đọc chúng. Thứ gây hại là <em>lưu lượng</em> swap trên những trang đang cần: <code>pswpin</code> tăng, major fault, và các con số áp lực bên dưới. Hãy cảnh báo theo những thứ đó, không theo việc swap đầy bao nhiêu.</p>
</div>

<h3>Không có swap không có nghĩa là không thrashing</h3>
<p>Tắt swap nghe có vẻ an toàn: không còn đĩa chậm cho bộ nhớ ẩn danh. Nhưng trang file vẫn phải đọc lại khi bị đuổi. Cùng bài kiểm, tắt swap, trên một <em>file</em> 200 MiB ánh xạ vào container 128 MiB:</p>
${run('c82-file', 'cat /sys/fs/cgroup/memory.swap.max', 1)}
${run('c82-file', './ws 64 3 rand', 1)}
${run('c82-file', './ws 200 3 rand', 1)}
${run('c82-file', "grep -E '^(workingset", 1)}
<p>64 MiB file vừa: một lượt nguội, rồi 8 ns mỗi trang. 200 MiB thì không: <strong>khoảng một mili giây mỗi trang, trọn một phút mỗi lượt</strong>. Nhân đọc lại các trang vừa bị đuổi 91.379.236 lần cho 153.600 lần chạm — khoảng 600 lần cho mỗi trang chương trình xin — vì cơ chế đọc trước kéo các trang lân cận vào và một cgroup nhỏ như thế đuổi chúng ra trước khi kịp dùng. Và container không hề bị giết:</p>
${run('c82-file', 'cat /sys/fs/cgroup/memory.events', 1)}
<p><code>max 1.782.535</code> lần chạm giới hạn, <code>oom 0</code>. Mọi thứ ở đây đều thu hồi được, nên OOM killer không có lý do gì để ra tay. Đây là sự cố kinh điển "máy chủ đứng hình hai mươi phút rồi tự hồi lại": file thực thi và thư viện của mọi tiến trình cũng là trang file, và trên một máy quá ít RAM chúng bị đuổi rồi đọc lại ở mỗi yêu cầu.</p>

<h3>PSI: một con số cho "tệ tới mức nào"</h3>
${run('c82-file', 'cat /sys/fs/cgroup/memory.pressure', 1)}
<p><strong>PSI (pressure stall information — thông tin kẹt vì áp lực)</strong> trả lời câu hỏi mà không bộ đếm nào khác trả lời được: bao nhiêu thời gian bị mất vì chờ bộ nhớ. <code>some</code> là tỉ lệ thời gian thực có ít nhất một tác vụ bị kẹt vì bộ nhớ (thu hồi, đọc lại trang vừa bị đuổi, swap vào); <code>full</code> là tỉ lệ thời gian <em>mọi</em> tác vụ đang chạy đều bị kẹt, tức không có việc gì hữu ích được làm. <code>avg10</code>, <code>avg60</code>, <code>avg300</code> là trung bình trượt trên 10 giây, 1 phút và 5 phút; <code>total</code> là số micro giây bị kẹt kể từ khi cgroup được tạo. Trong lần thrash file ở trên, <strong>35% mỗi giây</strong> bị mất, suốt nhiều phút — trong khi memory.events vẫn báo <code>oom 0</code>. Cùng file đó cho cả máy là <code>/proc/pressure/memory</code>.</p>
${run('c82-swap', 'cat /sys/fs/cgroup/memory.pressure', 1)}
<p>Lần thrash swap cho thấy cách đọc nó: <code>avg10</code> chỉ 3,44 vì lần chạy kéo dài chừng bốn giây và trung bình 10 giây chưa kịp đuổi theo, nhưng <code>total</code> ghi 456.959 µs — gần nửa giây trong bốn giây đó bị kẹt. Với sự kiện ngắn hãy đọc total; với cảnh báo hãy dùng avg10/avg60 trong nhiều phút.</p>
${lab('cgroup', 'high', 'vi', 'memory.pressure trên dòng thời gian: với memory.high = 384M và một lỗi rò, nhân thu hồi và hãm tốc khi vượt trần mềm — dịch vụ chậm lại và áp lực tăng lâu trước khi memory.max giết nó. Cú tăng đó là cảnh báo sớm mà PSI cho bạn.')}

<h3>zram và zswap: nén trước khi swap</h3>
${run('c82-swap', 'cat /sys/module/zswap/parameters/enabled', 1)}
<ul>
<li><strong>zram</strong> là một thiết bị khối nằm trong RAM, nén mọi thứ ghi vào nó; dùng làm swap, một trang rảnh nén 3:1 giải phóng hai phần ba RAM của nó mà không cần I/O đĩa. Nó là swap mặc định trên Fedora (từ bản 33), ChromeOS và Android, và là lựa chọn tốt cho VPS nhỏ có đĩa chậm.</li>
<li><strong>zswap</strong> là một bộ đệm nén nằm <em>trước</em> thiết bị swap thật: trang được nén vào một vùng RAM trước, chỉ những trang nguội nhất mới xuống đĩa. cgroup v2 giới hạn được nó theo từng nhóm (<code>memory.zswap.max</code>).</li>
</ul>
<p>Trên VM lab này zswap có sẵn trong nhân nhưng đang tắt (<code>N</code>) và không có thiết bị zram nào. Bật cái nào cũng là thay đổi trên cả VM Docker dùng chung với container khác, nên ở đây ta mô tả và <strong>không</strong> đo.</p>

<div class="pitfall co-tieu-de">
<p><strong>Swap và đĩa của VM đều nằm trên đĩa — hãy giữ đĩa còn trống.</strong> Ngày 27/10/2026 máy Mac dùng để làm khoá học này tụt xuống còn 350 MB đĩa trống, phần lớn vì 25 GB video đã dựng cộng một file <code>Docker.raw</code> 46 GB (đĩa của VM Docker Desktop, không tự co lại khi prune). Lệnh nào cũng hỏng với ENOSPC và Docker Desktop treo. macOS swap ra các file trên cùng ổ đĩa đó, và VM Linux bên trong Docker cũng để đĩa và file swap của nó ở đó: hết đĩa trống thì áp lực bộ nhớ không còn đường nào để đi. Hãy theo dõi <code>df</code> cạnh bộ nhớ — hai thứ cạn cùng nhau.</p>
</div>

<h3>Nếu bạn đã học OSG202 bài 3.4</h3>
<p>OSG202 định nghĩa thrashing bằng mô hình working set và đường cong tần suất page fault. Ở đây là đúng đường cong đó dưới dạng ba con số thật — 12 ns, ~35 µs, ~1 ms mỗi trang — và các bộ đếm cho thấy nó trên một máy chủ đang chạy.</p>
${L(OSG34, '🎓', 'OSG202 · 3.4 — Thrashing', 'Working set, tần suất page fault và vì sao thêm tiến trình có thể khiến máy chậm hơn.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> dịch vụ Spring Boot của nhóm cứ chiều là chậm. Grafana hiện "swap used 900 MB" và một bạn muốn chạy <code>swapoff -a</code> trên VPS. Bạn sẽ quyết định bằng số đo xem swap có phải vấn đề không.</p>
<ol>
<li>Chạy <code>docker run -it --rm --label oslab=1 --memory 128m --memory-swap 384m os-lab</code>, biên dịch <code>ws.c</code> và <code>hold.c</code>.</li>
<li>Chạy <code>./ws 64 3 rand</code>, <code>./ws 100 3 rand</code>, <code>./ws 160 3 rand</code>. Vẽ ns/trang theo cỡ working set và tìm bờ vực.</li>
<li>Chạy <code>./hold 150 &amp;</code> rồi <code>./ws 80 3 rand</code>; đọc <code>VmSwap</code> của hold và <code>memory.pressure</code>.</li>
<li>Khởi động lại với <code>--memory-swap 128m</code> (không swap) và chạy đúng cặp đó. Chuyện gì xảy ra với hold?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được với bạn kia, bằng số của chính mình, rằng "swap used" ở bước 3 là vô hại, rằng bỏ swap biến nó thành một lần OOM kill ở bước 4, và rằng chỉ số cần cảnh báo là PSI hoặc tốc độ swap vào, không phải swap đã dùng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['swap (vùng hoán đổi)', 'Chỗ trên đĩa (file hoặc phân vùng) cho trang ẩn danh một nơi để đi khi cần RAM.'],
  ['--memory-swap', 'Docker: TỔNG RAM + swap của container; bằng --memory nghĩa là không có swap.'],
  ['swappiness', '0–200: chi phí tương đối giữa thu hồi trang anon (swap) và trang file. 0 = chỉ file; 200 = ngang nhau.'],
  ['thrashing', 'Working set lớn hơn RAM: hệ thống tiêu thời gian vào dời trang thay vì làm việc.'],
  ['working set', 'Các trang một chương trình chạm đi chạm lại trong một khoảng thời gian ngắn.'],
  ['major fault / swap-in', 'Page fault phải đọc từ đĩa hoặc swap; pswpin đếm số lần swap vào.'],
  ['PSI (thông tin kẹt vì áp lực)', 'Tỉ lệ thời gian tác vụ bị kẹt vì bộ nhớ: some (ít nhất một) và full (tất cả).'],
  ['zram / zswap', 'RAM có nén dùng làm swap / bộ đệm nén nằm trước một thiết bị swap thật.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trang file luôn bỏ được; trang ẩn danh chỉ rời RAM qua swap.</li>
<li>swappiness định giá anon so với file: ở 0 việc thu hồi thà từ chối (EAGAIN) chứ không swap; ở 200 nó swap 11 MiB.</li>
<li>Qua bờ vực working set, một trang tốn ~35 µs thay vì ~12 ns, với 15.000–19.000 lần swap vào mỗi lượt.</li>
<li>Swap giúp bằng cách giữ bộ nhớ rảnh (107 MiB đỗ ra swap, vòng lặp nóng không hề hấn gì); không có nó cặp đó là OOM kill.</li>
<li>Không có swap, trang file thrash thay (~1 ms mỗi trang, oom 0); PSI đo mức thiệt hại.</li>
</ul>
${L('https://docs.kernel.org/accounting/psi.html', '🐧', 'kernel.org — PSI: Pressure Stall Information', 'some/full, các trung bình, và cách đặt trigger theo áp lực.', 'Mở')}
${L('https://docs.kernel.org/admin-guide/sysctl/vm.html', '📄', 'kernel.org — /proc/sys/vm (swappiness và các tham số khác)', 'swappiness, min_free_kbytes, overcommit và các núm khác của bộ nhớ ảo.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 8.3 — OOM killer ───────────────────────── */
    {
      title: '8.3 — The OOM killer: overcommit, oom_score and how it picks a victim|||8.3 — OOM killer: overcommit, oom_score và cách nó chọn nạn nhân',
      slug: 'os-8-3-oom',
      type: 'LESSON',
      isFreePreview: true,
      description: 'malloc hứa, page fault trả: overcommit_memory 0/1/2, malloc 4 TiB thành công trên VM 8 GB, CommitLimit vs Committed_AS; thất bại sớm (ulimit -v ⇒ NULL) hay chết muộn; oom_score = (1000 + adj + phần nghìn bộ nhớ) × 2/3; thí nghiệm thật: OOM killer giết "postgres" 140 MiB thay vì "api" đang rò rỉ, đọc từng dòng dmesg; oom_score_adj −1000 đảo kết quả; bảo vệ PostgreSQL theo đúng tài liệu của nó.',
      content: `${G83}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>When memory truly runs out, the kernel kills the biggest — not the guilty</h2>
<p class="lead">Your API has a leak. It grows, the box runs out of memory, and the process that dies is… PostgreSQL. Every query fails, the site is down, and the leaking API keeps running. This is not bad luck; it is the rule the kernel follows. This lesson answers: <strong>why can't the kernel just return an error, how does it choose whom to kill, and how do you make sure it never chooses your database?</strong></p>

<h3>malloc promises, page faults deliver</h3>
<p>Chapter 7 showed that <code>malloc</code> only reserves address space; RAM is handed out one page at a time on first touch. So the moment of truth is not the <code>malloc</code> call — it is a later, ordinary memory write that faults and needs a frame. If no frame can be found even after reclaiming cache and swapping (lessons 8.1–8.2), there is no system call in progress and no error code to return: the program is in the middle of <code>p[i] = x</code>. The only way to free memory now is to kill a process. That is the <strong>OOM killer</strong> (out of memory). The kernel's willingness to promise more than it has is called <strong>overcommit</strong>:</p>
${src('ch08/overc.c', 'c')}
${run('c83-oom', 'cat /proc/sys/vm/overcommit', 1)}
${run('c83-oom', "grep -E '^(MemTotal", 1)}
${run('c83-oom', './overc 64', 2)}
<p>On a VM with 7.9 GB of RAM and 1 GiB of swap, <code>malloc(64 GiB)</code> succeeds — and so does <code>malloc(4096 GiB)</code>, four tebibytes. Nothing was touched, so nothing was used. <code>Committed_AS</code>, the kernel's running total of everything it has promised, jumped by exactly 4 TiB. Whether such a promise is allowed is set by <code>vm.overcommit_memory</code>:</p>
<ul>
<li><strong>0 — heuristic</strong> (the default on Ubuntu, Debian and most VPS images): refuse only requests that obviously cannot fit, roughly larger than RAM + swap. The 64 GiB malloc would fail here; a 2 GiB one on a 2 GB box would pass.</li>
<li><strong>1 — always</strong>: never refuse. This VM (Docker Desktop) runs in mode 1, as shown above. Redis recommends it so that the <code>fork()</code> for a background save (Chapter 7) never fails.</li>
<li><strong>2 — strict</strong>: refuse once <code>Committed_AS</code> would exceed <code>CommitLimit</code> = swap + <code>overcommit_ratio</code>% of RAM. Here that is 1,048,572 + 50% × 8,124,516 = <strong>5,110,828 kB (4,991 MiB)</strong>, and 4,911 MiB was already promised before our test — only about 80 MiB of headroom for the whole VM.</li>
</ul>
${lab('cow', 'bgsave', 'en', 'Why Redis wants mode 1: fork() for BGSAVE promises a full copy of the dataset, but copy-on-write only pays for the pages written during the save.')}

<h3>Fail early, or die late</h3>
${run('c83-oom', '(ulimit -v', 1)}
<p>With a hard limit — here <code>ulimit -v</code>, the address-space limit of this one shell — <code>malloc</code> returns <code>NULL</code> at the exact line that asked, with <code>ENOMEM</code>. The program can log, refuse the request, shed load or exit cleanly. With overcommit, <code>malloc</code> succeeds and the program carries on until some later page fault finds no RAM; then it is killed by SIGKILL, with no log line and no stack trace. Mode 2, <code>ulimit -v</code>, a JVM's <code>-Xmx</code> and V8's heap limit are all ways of choosing "fail early".</p>

<div class="pitfall co-tieu-de">
<p><strong>Do not flip a shared machine to <code>overcommit_memory=2</code> to "be safe".</strong> We did not switch this VM to mode 2, and you should not do it casually on a server: the sysctl is global, and with Committed_AS at 98% of CommitLimit, every container on the box would start getting <code>ENOMEM</code> from ordinary allocations — JVMs reserve gigabytes of address space at start-up and would refuse to boot. Mode 2 is a deliberate choice for dedicated database servers (PostgreSQL's documentation suggests it there), made after sizing swap and <code>overcommit_ratio</code>.</p>
</div>

<h3>oom_score: every process has a number</h3>
${run('c83-oom', 'cat /proc/self/oom_score_adj', 1)}
${run('c83-oom', './postgres 140 &', 2)}
<p>Each process has an <strong>oom_score</strong> (read-only) and an <strong>oom_score_adj</strong> (−1000 to +1000, writable). The kernel prints the score as (1000 + oom_score_adj + 1000 × memory used / (RAM + swap)) × 2/3. Memory used means RSS + swap + page tables. A tiny shell: (1000 + 0 + ~0) × 2/3 = <strong>666</strong>. Our "postgres", a C program holding 140 MiB of 8.7 GiB RAM + swap: (1000 + 0 + 15) × 2/3 = <strong>676</strong>. <code>oom_score_adj = -1000</code> makes the score 0 and the process is never chosen; <code>+1000</code> makes it the first choice. The score is how the kernel will rank processes when the whole machine runs out; inside a cgroup the same rule is applied with the cgroup's limit as the denominator.</p>

<h3>The experiment: a database and a leaky API</h3>
<p>A 256 MiB container without swap. "postgres" holds 140 MiB, like a database with a warm buffer cache. "api" is the <code>fill</code> program from lesson 8.4 — it grows to 200 MiB, like a leaking request handler. Who dies?</p>
${run('c83-oom', './api 200 16 q', 2)}
<p>Watch the api's own log: at 64 MiB the cgroup is at 208 MiB; at 128 MiB <code>oom_kill</code> has become 1 and <code>current</code> dropped to 131 MiB. The api finished its 200 MiB and exited 0. The shell reports the other process: <strong>postgres was Killed</strong>. The api caused the shortage — and the database paid for it. The kernel's log says exactly why:</p>
${run('c83-oom', 'dmesg | grep -E', 1)}
<ul>
<li><code>api invoked oom-killer</code> — who was allocating when memory ran out. The <code>gfp_mask</code> describes the request (here a zeroed page for user memory, charged to the cgroup). <strong>The process that invokes the killer is not necessarily the one that dies.</strong></li>
<li>The task table — one row per candidate: <code>rss</code> in 4 KiB pages (postgres 36,219 = 141 MiB, api 29,243 = 114 MiB), split into anon/file/shmem, page-table bytes, swap entries and <code>oom_score_adj</code>.</li>
<li><code>oom-kill:constraint=CONSTRAINT_MEMCG</code> — a cgroup's limit ran out, not the whole machine (that would be <code>CONSTRAINT_NONE</code>). We trimmed the long cgroup paths with <code>sed</code>.</li>
<li><code>Memory cgroup out of memory: Killed process … (postgres)</code> — the victim, its total virtual size and its anonymous RSS (143,452 kB) at the moment of death.</li>
</ul>
${lab('process', 'oom137', 'en', 'The kernel’s OOM killer picks the process with the highest score and sends SIGKILL — no error message from the victim, the shell just reports 137.')}
${lab('cgroup', 'oom', 'en', 'A leak inside docker run -m 512m: memory.current climbs into memory.max, reclaim finds nothing, the OOM killer fires and memory.events counts oom_kill.')}

<h3>Why postgres: the biggest score loses</h3>
<p>Inside the cgroup, each candidate's badness is its rss + swap + page tables, as a share of the 256 MiB limit (65,536 pages): postgres about 554 thousandths, api about 447. Both had <code>oom_score_adj 0</code>, so the larger one was chosen. The rule is "free the most memory with one kill", which is usually the right rule — and is exactly wrong when the largest process is the one you most need.</p>

<div class="pitfall co-tieu-de">
<p><strong>The OOM killer is not a leak detector.</strong> It does not look at who is growing, who allocated last or who is "guilty". On a VPS where PostgreSQL holds the most memory (shared_buffers + backends), any leak anywhere ends with the database being killed. If the database matters more than the app, you must tell the kernel so — with cgroups and oom_score_adj — before the incident.</p>
</div>
${lab('sysmon', 'memleak', 'en', 'A live machine with a leaking process: watch RES grow in top, available shrink in free, until the kernel steps in. Find the leaker before the killer picks someone else.')}

<h3>oom_score_adj −1000: now the leaker dies</h3>
${run('c83-oom', 'echo -1000 > /proc', 4)}
${run('c83-oom', "dmesg | grep -E 'Killed process", 1)}
${run('c83-oom', 'cat /sys/fs/cgroup/memory.events', 1)}
<p>Same container, same programs. With postgres at <code>-1000</code> its score is 0, so the only candidate left is the api: killed with exit 137 at its first check, postgres survives. memory.events now counts <code>oom 2</code>, <code>oom_kill 2</code>. Lowering a score needs <code>CAP_SYS_RESOURCE</code> (we added it to this container); raising it is allowed to anyone, which is how a process can volunteer to die first. Docker exposes the same knob as <code>--oom-score-adj</code> and Compose as <code>oom_score_adj:</code>.</p>

<h3>Protecting PostgreSQL for real</h3>
<ul>
<li><strong>Its own cgroup first.</strong> This project's <code>docker-compose.yml</code> gives postgres <code>deploy.resources.limits.memory: 2G</code> and the backend its own 2G. A leak in the backend then hits the backend's <code>memory.max</code> and is killed inside its own cgroup (<code>CONSTRAINT_MEMCG</code>), never touching Postgres. The compose file does not set <code>oom_score_adj</code>; the isolation is the protection. It only fails when the whole machine runs out — when the limits add up to more than RAM.</li>
<li><strong>−1000 for the postmaster, 0 for backends.</strong> PostgreSQL's documentation recommends running the postmaster with <code>OOMScoreAdjust=-1000</code> (systemd) and setting <code>PG_OOM_ADJUST_FILE=/proc/self/oom_score_adj</code> so that each backend it forks resets itself to <code>PG_OOM_ADJUST_VALUE</code> (default 0). A runaway query can still be killed; the server process that holds everything together cannot.</li>
<li><strong>Know what a kill costs.</strong> If any backend dies by SIGKILL, the postmaster cannot trust shared memory any more: it terminates every other session and runs crash recovery. If the postmaster itself dies, the database is down until something restarts it.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Marking everything −1000 protects nothing.</strong> If every process in a cgroup (or on a machine) is unkillable, the OOM killer has no candidate: the group stays stuck at its limit with tasks waiting for memory that will never come, instead of recovering by losing one process. Protect the one or two processes whose death is a disaster, and let the rest be killable.</p>
</div>

<h3>Rules of the killing order</h3>
<ul>
<li><strong>Scope</strong>: a machine-wide OOM considers every process; a cgroup OOM only the tasks inside that cgroup — which is why container limits are the first and best defence.</li>
<li><strong>Score</strong>: the largest rss + swap + page tables wins, shifted by oom_score_adj. Not the newest, not the one that asked, not the one with a leak.</li>
<li><strong>One or all</strong>: by default one process is killed. <code>memory.oom.group = 1</code> kills every process in the cgroup together, so a half-dead service does not limp on. Docker leaves it at 0 (lesson 8.4 measures what that means); Kubernetes sets it to 1 on cgroup v2 since 1.28.</li>
<li><strong>Where to look afterwards</strong>: <code>dmesg</code> / <code>journalctl -k</code> for "invoked oom-killer", the task table and "Killed process" (Chapter 2 shows how to search them), and <code>memory.events</code> for the cgroup's own count.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after last night's incident the lead asks you to prove, in the lab, which process the kernel kills when the API leaks on a box shared with PostgreSQL — and to show one setting that changes the answer.</p>
<ol>
<li>Start <code>docker run -it --rm --label oslab=1 --memory 256m --memory-swap 256m --cap-add SYSLOG --cap-add SYS_RESOURCE os-lab</code>; build <code>hold.c</code> as <code>postgres</code> and <code>fill.c</code> as <code>api</code>.</li>
<li>Start <code>./postgres 140 &amp;</code>, read its <code>oom_score</code>, then run <code>./api 200 16 q</code>. Find the four dmesg lines and write down the victim and both rss values.</li>
<li>Repeat with <code>echo -1000 &gt; /proc/$(pidof postgres)/oom_score_adj</code>. Then try <code>echo 500</code> on the api instead and predict the result first.</li>
<li>Run <code>./overc 64</code> and <code>(ulimit -v 1048576; ./overc 2)</code> and explain the difference in one sentence.</li>
</ol>
<p><strong>Done when:</strong> you have two "Killed process" lines naming different victims, the oom_score values you read before each run, and a two-line recommendation for your compose file (separate limits; oom_score_adj only on the database's main process).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['overcommit', 'Promising more memory than exists, because most allocations are never fully touched.'],
  ['vm.overcommit_memory', '0 heuristic (refuse the absurd), 1 always yes, 2 strict (Committed_AS ≤ CommitLimit).'],
  ['CommitLimit / Committed_AS', 'Mode-2 ceiling = swap + ratio% × RAM / total memory promised so far.'],
  ['OOM killer', 'Kernel code that frees memory by SIGKILLing a process when reclaim cannot.'],
  ['oom_score', 'Read-only rank: (1000 + adj + usage‰) × 2/3; the highest is killed first.'],
  ['oom_score_adj', '−1000 … +1000: your bias; −1000 = never kill (lowering needs CAP_SYS_RESOURCE).'],
  ['CONSTRAINT_MEMCG', 'dmesg tag: the OOM was a cgroup limit, and only that cgroup’s tasks were candidates.'],
  ['memory.oom.group', 'cgroup v2 switch: kill the whole group on OOM instead of one process.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>malloc reserves address space; RAM is paid on first touch, so an OOM happens in the middle of an ordinary write.</li>
<li>Mode 0 refuses the absurd, 1 refuses nothing (malloc 4 TiB "OK"), 2 enforces CommitLimit; hard limits fail early with NULL.</li>
<li>oom_score = (1000 + adj + usage‰) × 2/3: 666 for a tiny shell, 676 for 140 MiB.</li>
<li>The killer chose postgres (141 MiB) over the leaking api (114 MiB); with adj −1000 the api died with 137 instead.</li>
<li>Protect a database with its own cgroup first, then −1000 on the postmaster only.</li>
</ul>
${L('https://docs.kernel.org/mm/overcommit-accounting.html', '🐧', 'kernel.org — Overcommit accounting', 'The three overcommit modes, CommitLimit and Committed_AS.', 'Open')}
${L('https://www.postgresql.org/docs/current/kernel-resources.html', '🐘', 'PostgreSQL — Managing kernel resources: Linux memory overcommit', 'OOMScoreAdjust, PG_OOM_ADJUST_FILE and when to use overcommit_memory = 2.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Khi bộ nhớ thật sự cạn, nhân giết kẻ lớn nhất — không phải kẻ có lỗi</h2>
<p class="lead">API của bạn bị rò rỉ. Nó phình ra, máy hết bộ nhớ, và tiến trình chết lại là… PostgreSQL. Mọi truy vấn hỏng, trang web sập, còn API rò rỉ vẫn chạy tiếp. Đây không phải xui xẻo; đó là quy tắc nhân tuân theo. Bài này trả lời: <strong>vì sao nhân không thể chỉ trả về một lỗi, nó chọn giết ai thế nào, và làm sao để nó không bao giờ chọn cơ sở dữ liệu của bạn?</strong></p>

<h3>malloc hứa, page fault trả</h3>
<p>Chương 7 đã cho thấy <code>malloc</code> chỉ giữ chỗ không gian địa chỉ; RAM được phát từng trang ở lần chạm đầu. Nên khoảnh khắc quyết định không phải lời gọi <code>malloc</code> — mà là một lệnh ghi bộ nhớ bình thường về sau gây fault và cần một khung. Nếu thu hồi cache và swap (bài 8.1–8.2) rồi mà vẫn không tìm được khung nào, lúc đó chẳng có lời gọi hệ thống nào đang chạy và không có mã lỗi nào để trả: chương trình đang ở giữa câu lệnh <code>p[i] = x</code>. Cách duy nhất để có bộ nhớ lúc này là giết một tiến trình. Đó là <strong>OOM killer</strong> (out of memory — hết bộ nhớ). Việc nhân sẵn lòng hứa nhiều hơn những gì nó có gọi là <strong>overcommit (hứa vượt)</strong>:</p>
${src('ch08/overc.c', 'c')}
${run('c83-oom', 'cat /proc/sys/vm/overcommit', 1)}
${run('c83-oom', "grep -E '^(MemTotal", 1)}
${run('c83-oom', './overc 64', 2)}
<p>Trên một VM có 7,9 GB RAM và 1 GiB swap, <code>malloc(64 GiB)</code> thành công — và <code>malloc(4096 GiB)</code>, bốn tebibyte, cũng thành công. Chưa chạm gì thì chưa dùng gì. <code>Committed_AS</code>, tổng số nhân đã hứa, nhảy lên đúng 4 TiB. Lời hứa như thế có được phép không là do <code>vm.overcommit_memory</code>:</p>
<ul>
<li><strong>0 — dựa theo kinh nghiệm (heuristic)</strong> (mặc định trên Ubuntu, Debian và đa số ảnh VPS): chỉ từ chối yêu cầu hiển nhiên không thể vừa, đại khái lớn hơn RAM + swap. malloc 64 GiB sẽ hỏng ở đây; malloc 2 GiB trên máy 2 GB thì qua.</li>
<li><strong>1 — luôn đồng ý</strong>: không bao giờ từ chối. VM này (Docker Desktop) chạy chế độ 1, như ở trên. Redis khuyên dùng nó để lời gọi <code>fork()</code> khi lưu nền (Chương 7) không bao giờ hỏng.</li>
<li><strong>2 — nghiêm ngặt</strong>: từ chối khi <code>Committed_AS</code> sắp vượt <code>CommitLimit</code> = swap + <code>overcommit_ratio</code>% RAM. Ở đây là 1.048.572 + 50% × 8.124.516 = <strong>5.110.828 kB (4.991 MiB)</strong>, và 4.911 MiB đã được hứa sẵn trước phép thử của ta — cả VM chỉ còn chừng 80 MiB khoảng trống.</li>
</ul>
${lab('cow', 'bgsave', 'vi', 'Vì sao Redis muốn chế độ 1: fork() khi BGSAVE hứa một bản sao trọn tập dữ liệu, nhưng copy-on-write chỉ trả tiền cho các trang bị ghi trong lúc lưu.')}

<h3>Thất bại sớm, hay chết muộn</h3>
${run('c83-oom', '(ulimit -v', 1)}
<p>Có giới hạn cứng — ở đây là <code>ulimit -v</code>, giới hạn không gian địa chỉ của riêng shell này — <code>malloc</code> trả <code>NULL</code> đúng tại dòng xin, kèm <code>ENOMEM</code>. Chương trình còn ghi log, từ chối yêu cầu, giảm tải hoặc thoát gọn gàng được. Với overcommit, <code>malloc</code> thành công và chương trình chạy tiếp cho tới khi một page fault về sau không tìm ra RAM; lúc đó nó bị giết bằng SIGKILL, không một dòng log, không stack trace. Chế độ 2, <code>ulimit -v</code>, <code>-Xmx</code> của JVM và trần heap của V8 đều là những cách chọn "thất bại sớm".</p>

<div class="pitfall co-tieu-de">
<p><strong>Đừng chuyển một máy dùng chung sang <code>overcommit_memory=2</code> cho "an toàn".</strong> Ta không chuyển VM này sang chế độ 2, và bạn cũng đừng làm vậy tuỳ tiện trên máy chủ: sysctl này là toàn cục, và với Committed_AS đã ở 98% CommitLimit, mọi container trên máy sẽ bắt đầu nhận <code>ENOMEM</code> từ những lần cấp phát bình thường — JVM giữ chỗ hàng gigabyte không gian địa chỉ lúc khởi động và sẽ không chịu chạy. Chế độ 2 là lựa chọn có chủ đích cho máy chủ dành riêng cho CSDL (tài liệu PostgreSQL gợi ý nó ở đó), sau khi đã tính kích cỡ swap và <code>overcommit_ratio</code>.</p>
</div>

<h3>oom_score: tiến trình nào cũng có một con số</h3>
${run('c83-oom', 'cat /proc/self/oom_score_adj', 1)}
${run('c83-oom', './postgres 140 &', 2)}
<p>Mỗi tiến trình có một <strong>oom_score</strong> (chỉ đọc) và một <strong>oom_score_adj</strong> (−1000 tới +1000, ghi được). Nhân in điểm bằng (1000 + oom_score_adj + 1000 × bộ nhớ đang dùng / (RAM + swap)) × 2/3. Bộ nhớ đang dùng là RSS + swap + bảng trang. Một shell bé xíu: (1000 + 0 + ~0) × 2/3 = <strong>666</strong>. "postgres" của ta, một chương trình C giữ 140 MiB trên 8,7 GiB RAM + swap: (1000 + 0 + 15) × 2/3 = <strong>676</strong>. <code>oom_score_adj = -1000</code> khiến điểm bằng 0 và tiến trình không bao giờ bị chọn; <code>+1000</code> khiến nó thành lựa chọn đầu tiên. Điểm này là cách nhân xếp hạng tiến trình khi cả máy hết bộ nhớ; bên trong một cgroup, cùng quy tắc đó được áp với mẫu số là giới hạn của cgroup.</p>

<h3>Thí nghiệm: một cơ sở dữ liệu và một API rò rỉ</h3>
<p>Một container 256 MiB không có swap. "postgres" giữ 140 MiB, như một CSDL có bộ đệm đã ấm. "api" là chương trình <code>fill</code> của bài 8.4 — nó phình lên 200 MiB, như một hàm xử lý yêu cầu bị rò rỉ. Ai chết?</p>
${run('c83-oom', './api 200 16 q', 2)}
<p>Nhìn log của chính api: ở 64 MiB cgroup đang ở 208 MiB; ở 128 MiB <code>oom_kill</code> đã thành 1 và <code>current</code> tụt còn 131 MiB. api làm xong 200 MiB của nó và thoát 0. Shell báo về tiến trình kia: <strong>postgres đã bị Killed</strong>. api gây ra sự thiếu hụt — và cơ sở dữ liệu trả giá. Nhật ký của nhân nói rõ vì sao:</p>
${run('c83-oom', 'dmesg | grep -E', 1)}
<ul>
<li><code>api invoked oom-killer</code> — ai đang cấp phát khi bộ nhớ cạn. <code>gfp_mask</code> mô tả yêu cầu đó (ở đây là một trang đã xoá về 0 cho bộ nhớ người dùng, tính vào cgroup). <strong>Tiến trình gọi tới killer không nhất thiết là tiến trình phải chết.</strong></li>
<li>Bảng tác vụ — mỗi ứng viên một dòng: <code>rss</code> tính bằng trang 4 KiB (postgres 36.219 = 141 MiB, api 29.243 = 114 MiB), tách thành anon/file/shmem, số byte bảng trang, số mục swap và <code>oom_score_adj</code>.</li>
<li><code>oom-kill:constraint=CONSTRAINT_MEMCG</code> — giới hạn của một cgroup đã cạn, không phải cả máy (cả máy thì là <code>CONSTRAINT_NONE</code>). Ta cắt bớt đường dẫn cgroup dài bằng <code>sed</code>.</li>
<li><code>Memory cgroup out of memory: Killed process … (postgres)</code> — nạn nhân, tổng kích cỡ ảo và RSS ẩn danh (143.452 kB) của nó lúc chết.</li>
</ul>
${lab('process', 'oom137', 'vi', 'OOM killer của nhân chọn tiến trình có điểm cao nhất và gửi SIGKILL — nạn nhân không kịp báo lỗi, shell chỉ báo 137.')}
${lab('cgroup', 'oom', 'vi', 'Rò rỉ trong docker run -m 512m: memory.current leo tới memory.max, thu hồi không được gì, OOM killer ra tay và memory.events đếm oom_kill.')}

<h3>Vì sao là postgres: điểm lớn nhất thì thua</h3>
<p>Trong cgroup, độ "tệ" của mỗi ứng viên là rss + swap + bảng trang, tính theo phần của giới hạn 256 MiB (65.536 trang): postgres khoảng 554 phần nghìn, api khoảng 447. Cả hai đều có <code>oom_score_adj 0</code>, nên kẻ lớn hơn bị chọn. Quy tắc là "giải phóng nhiều bộ nhớ nhất bằng một cú giết", thường là đúng — và sai hoàn toàn khi tiến trình lớn nhất lại là thứ bạn cần nhất.</p>

<div class="pitfall co-tieu-de">
<p><strong>OOM killer không phải máy dò rò rỉ.</strong> Nó không xem ai đang phình, ai cấp phát sau cùng hay ai "có lỗi". Trên một VPS mà PostgreSQL giữ nhiều bộ nhớ nhất (shared_buffers + các backend), rò rỉ ở bất kỳ đâu cũng kết thúc bằng việc CSDL bị giết. Nếu CSDL quan trọng hơn ứng dụng, bạn phải nói điều đó với nhân — bằng cgroup và oom_score_adj — trước khi sự cố xảy ra.</p>
</div>
${lab('sysmon', 'memleak', 'vi', 'Một máy đang chạy có tiến trình rò rỉ: nhìn RES tăng trong top, available giảm trong free, cho tới khi nhân ra tay. Tìm kẻ rò rỉ trước khi killer chọn người khác.')}

<h3>oom_score_adj −1000: giờ kẻ rò rỉ mới chết</h3>
${run('c83-oom', 'echo -1000 > /proc', 4)}
${run('c83-oom', "dmesg | grep -E 'Killed process", 1)}
${run('c83-oom', 'cat /sys/fs/cgroup/memory.events', 1)}
<p>Cùng container, cùng chương trình. Đặt postgres ở <code>-1000</code> thì điểm của nó bằng 0, nên ứng viên duy nhất còn lại là api: bị giết với exit 137 ngay lần báo đầu, postgres sống sót. memory.events giờ đếm <code>oom 2</code>, <code>oom_kill 2</code>. Hạ điểm cần <code>CAP_SYS_RESOURCE</code> (ta đã thêm cho container này); nâng điểm thì ai cũng được, đó là cách một tiến trình tự nguyện chết trước. Docker đưa cùng núm này ra thành <code>--oom-score-adj</code>, còn Compose là <code>oom_score_adj:</code>.</p>

<h3>Bảo vệ PostgreSQL thật sự</h3>
<ul>
<li><strong>Cgroup riêng trước tiên.</strong> <code>docker-compose.yml</code> của dự án này cho postgres <code>deploy.resources.limits.memory: 2G</code> và backend 2G riêng. Rò rỉ ở backend khi đó chạm <code>memory.max</code> của backend và bị giết bên trong cgroup của nó (<code>CONSTRAINT_MEMCG</code>), không bao giờ đụng tới Postgres. File compose không đặt <code>oom_score_adj</code>; sự cô lập chính là lớp bảo vệ. Nó chỉ thất bại khi cả máy hết bộ nhớ — khi tổng các giới hạn lớn hơn RAM.</li>
<li><strong>−1000 cho postmaster, 0 cho các backend.</strong> Tài liệu PostgreSQL khuyên chạy postmaster với <code>OOMScoreAdjust=-1000</code> (systemd) và đặt <code>PG_OOM_ADJUST_FILE=/proc/self/oom_score_adj</code> để mỗi backend nó fork ra tự đặt lại về <code>PG_OOM_ADJUST_VALUE</code> (mặc định 0). Một truy vấn chạy loạn vẫn có thể bị giết; tiến trình chủ giữ mọi thứ với nhau thì không.</li>
<li><strong>Biết một cú giết tốn gì.</strong> Nếu bất kỳ backend nào chết vì SIGKILL, postmaster không còn tin được bộ nhớ dùng chung: nó chấm dứt mọi phiên khác và chạy khôi phục sau sự cố (crash recovery). Nếu chính postmaster chết, CSDL ngừng hẳn cho tới khi có gì đó khởi động lại nó.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Đánh dấu tất cả −1000 là không bảo vệ gì cả.</strong> Nếu mọi tiến trình trong một cgroup (hay trên một máy) đều không giết được, OOM killer không còn ứng viên nào: nhóm kẹt ở giới hạn với các tác vụ chờ một lượng bộ nhớ không bao giờ tới, thay vì hồi phục bằng cách mất một tiến trình. Hãy bảo vệ một hai tiến trình mà cái chết của chúng là thảm hoạ, và để phần còn lại giết được.</p>
</div>

<h3>Các quy tắc về thứ tự giết</h3>
<ul>
<li><strong>Phạm vi</strong>: OOM toàn máy xét mọi tiến trình; OOM của cgroup chỉ xét các tác vụ bên trong cgroup đó — nên giới hạn container là tuyến phòng thủ đầu tiên và tốt nhất.</li>
<li><strong>Điểm</strong>: rss + swap + bảng trang lớn nhất thì "thắng", sau khi cộng oom_score_adj. Không phải kẻ mới nhất, không phải kẻ đã xin, không phải kẻ bị rò rỉ.</li>
<li><strong>Một hay tất cả</strong>: mặc định giết một tiến trình. <code>memory.oom.group = 1</code> giết mọi tiến trình trong cgroup cùng lúc, để một dịch vụ dở sống dở chết không lết tiếp. Docker để 0 (bài 8.4 đo xem điều đó nghĩa là gì); Kubernetes đặt 1 trên cgroup v2 từ bản 1.28.</li>
<li><strong>Xem ở đâu sau đó</strong>: <code>dmesg</code> / <code>journalctl -k</code> tìm "invoked oom-killer", bảng tác vụ và "Killed process" (Chương 2 chỉ cách tìm), và <code>memory.events</code> cho số đếm riêng của cgroup.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau sự cố đêm qua, trưởng nhóm yêu cầu bạn chứng minh trong lab xem nhân giết tiến trình nào khi API rò rỉ trên một máy dùng chung với PostgreSQL — và chỉ ra một thiết lập làm thay đổi câu trả lời.</p>
<ol>
<li>Chạy <code>docker run -it --rm --label oslab=1 --memory 256m --memory-swap 256m --cap-add SYSLOG --cap-add SYS_RESOURCE os-lab</code>; biên dịch <code>hold.c</code> thành <code>postgres</code> và <code>fill.c</code> thành <code>api</code>.</li>
<li>Chạy <code>./postgres 140 &amp;</code>, đọc <code>oom_score</code> của nó, rồi chạy <code>./api 200 16 q</code>. Tìm bốn dòng dmesg và ghi lại nạn nhân cùng hai giá trị rss.</li>
<li>Làm lại với <code>echo -1000 &gt; /proc/$(pidof postgres)/oom_score_adj</code>. Rồi thử <code>echo 500</code> cho api thay vào đó và đoán kết quả trước.</li>
<li>Chạy <code>./overc 64</code> và <code>(ulimit -v 1048576; ./overc 2)</code> rồi giải thích sự khác nhau trong một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hai dòng "Killed process" nêu tên hai nạn nhân khác nhau, các giá trị oom_score đã đọc trước mỗi lần chạy, và một khuyến nghị hai dòng cho file compose (giới hạn riêng; oom_score_adj chỉ cho tiến trình chính của CSDL).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['overcommit (hứa vượt)', 'Hứa nhiều bộ nhớ hơn thực có, vì phần lớn lần cấp phát không bao giờ được chạm hết.'],
  ['vm.overcommit_memory', '0 kinh nghiệm (từ chối điều phi lý), 1 luôn đồng ý, 2 nghiêm ngặt (Committed_AS ≤ CommitLimit).'],
  ['CommitLimit / Committed_AS', 'Trần của chế độ 2 = swap + ratio% × RAM / tổng bộ nhớ đã hứa tới giờ.'],
  ['OOM killer', 'Mã của nhân giải phóng bộ nhớ bằng cách SIGKILL một tiến trình khi thu hồi không đủ.'],
  ['oom_score', 'Hạng chỉ đọc: (1000 + adj + phần nghìn bộ nhớ) × 2/3; cao nhất bị giết trước.'],
  ['oom_score_adj', '−1000 … +1000: độ lệch của bạn; −1000 = không bao giờ giết (hạ cần CAP_SYS_RESOURCE).'],
  ['CONSTRAINT_MEMCG', 'Nhãn trong dmesg: OOM do giới hạn của một cgroup, chỉ tác vụ của cgroup đó là ứng viên.'],
  ['memory.oom.group', 'Công tắc cgroup v2: khi OOM thì giết cả nhóm thay vì một tiến trình.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>malloc giữ chỗ không gian địa chỉ; RAM được trả ở lần chạm đầu, nên OOM xảy ra giữa một lệnh ghi bình thường.</li>
<li>Chế độ 0 từ chối điều phi lý, 1 không từ chối gì (malloc 4 TiB "OK"), 2 áp CommitLimit; giới hạn cứng thất bại sớm bằng NULL.</li>
<li>oom_score = (1000 + adj + phần nghìn bộ nhớ) × 2/3: 666 với shell bé xíu, 676 với 140 MiB.</li>
<li>Killer chọn postgres (141 MiB) thay vì api đang rò rỉ (114 MiB); với adj −1000 thì api chết với 137.</li>
<li>Bảo vệ CSDL bằng cgroup riêng trước, rồi −1000 chỉ cho postmaster.</li>
</ul>
${L('https://docs.kernel.org/mm/overcommit-accounting.html', '🐧', 'kernel.org — Overcommit accounting', 'Ba chế độ overcommit, CommitLimit và Committed_AS.', 'Mở')}
${L('https://www.postgresql.org/docs/current/kernel-resources.html', '🐘', 'PostgreSQL — Managing kernel resources: Linux memory overcommit', 'OOMScoreAdjust, PG_OOM_ADJUST_FILE và khi nào dùng overcommit_memory = 2.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 8.4 — Exit 137 ───────────────────────── */
    {
      title: '8.4 — The exit-137 incident, measured: parallel builds, memory.high and the kill|||8.4 — Sự cố exit 137, đo thật: build song song, memory.high và cú giết',
      slug: 'os-8-4-exit137',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sự cố thật của dự án: next build bị giết exit 137 trên VPS 6 GB khi hai ảnh build song song (deploy.sh, 06–07/07/2026); tái hiện trong container 512 MiB: song song đỉnh 512 MiB cả hai chết, tuần tự đỉnh 310 MiB; container thoát 0 mà OOMKilled=true; phân biệt 133/134/137 (heap V8 vs nhân); dòng thời gian memory.high → thu hồi → hãm tốc 7–43 s mỗi mẩu → memory.max giết, PSI 99,76%; dự án đã sửa ra sao.',
      content: `${G84}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Exit 137 on the VPS: the incident, reproduced and timed</h2>
<p class="lead">A deploy of this very website died with <code>exit 137</code> in the middle of <code>next build</code>. No stack trace, no "out of memory" from Node — the build output simply stopped. Chapter 1 taught you that 137 = 128 + 9 = SIGKILL. This lesson goes from that number to the cause and the fix: <strong>what was using the memory, why one build at a time fixed it, how to tell the kernel's kill (137) from Node's own heap limit (134), and what the minutes before the kill look like.</strong></p>

<h3>The incident, as the repository remembers it</h3>
<p>Every incident in this project left a dated comment next to the code that fixed it. Step 2a of <code>deploy.sh</code>:</p>
${code('# ── Step 2a: Build images ONE AT A TIME (OOM guard) ───────────────\n# The VPS has 6GB RAM shared with the live stack. When the build cache\n# is cold (it is pruned at the end of every deploy), building backend\n# and frontend in parallel peaks above available RAM and the kernel\n# kills `next build` (exit 137, seen 2026-07-06). Building sequentially\n# keeps the peak to one image at a time; with a warm cache each build\n# is a fast no-op, so normal deploys lose no time.', 'bash')}
<p>And one day later, a few lines further down:</p>
${code('# Do NOT pass `--build` here: compose bake treats it as a fresh\n# parallel build of BOTH images (observed 2026-07-07 — it re-ran\n# `next build` alongside the backend export and the kernel OOM-killed\n# it, exit 137), defeating the sequential OOM guard above.', 'bash')}
<p>The facts: a 6 GB VPS that is <em>also serving the live site</em> (PostgreSQL, Redis, the backend, nginx); two cold image builds at once; the kernel kills the biggest process, which is <code>next build</code>. The second day shows how easy it is to reintroduce: <code>docker compose up --build</code> quietly builds every image in parallel.</p>

<h3>Reproduce it: two "builds" in a 512 MiB box</h3>
<p>A real <code>next build</code> needs gigabytes; we scale the incident down by about 1/12. The "VPS" is a container with <code>--memory 512m</code> and no swap; each "build" is a Node script whose memory climbs to 300 MB and then finishes. It allocates <code>Buffer</code>s, which live outside the V8 heap, so only the cgroup limit can stop it:</p>
${src('ch08/build.js', 'javascript')}
${run('c84-host', 'docker run --name os-c84a', 3)}
<p>Both builds reach 192 MB together, and together they are past 512 MiB: <strong>both were killed with 137</strong>, <code>memory.peak</code> touched the limit exactly, <code>oom_kill 2</code>. (In another run of the same command only A died and B finished — the kernel kills whichever is biggest at that instant, so the outcome is a race.) Now the same two builds, one after the other:</p>
${run('c84-host', 'docker run --name os-c84b', 2)}
<p>Both finish. <code>memory.peak</code> 310 MiB, <code>oom_kill 0</code>. The amount of work is identical — 2 × 300 MB. What changed is the <strong>peak</strong>: memory limits are about how much is in use at one instant, not about the total. That is the whole fix in Step 2a, and it is why "just run them in parallel, it is faster" is wrong on a small box.</p>
${lab('process', 'oom137', 'en', 'bash forks node for next build, a second build pushes the box past its memory, the kernel SIGKILLs node and the shell reports 137.')}

<h3>Exit 0 and OOMKilled=true at the same time</h3>
${run('c84-host', 'docker run --name os-c84c', 3)}
<p>When the process that is killed is the container's PID 1, the container dies: exit 137 and <code>OOMKilled=true</code>, the case you saw in Chapter 1. But look again at the parallel run above: there the two builds were children of a bash script that was PID 1. The kernel killed the children, bash survived, printed the exit codes and ended normally — <strong>container exit 0, and Docker still reports OOMKilled=true</strong> because an OOM kill happened inside its cgroup.</p>

<div class="pitfall co-tieu-de">
<p><strong>A green exit code can hide an OOM kill.</strong> A CI job, a wrapper script, <code>npm run</code> with several workers, a supervisor inside the container: if PID 1 survives, the exit code is whatever it decides to return. Check all three — the exit code, <code>docker inspect -f '{{.State.OOMKilled}}'</code>, and the cgroup's <code>memory.events</code> (<code>oom_kill</code>) — and make your wrappers fail when a child dies by signal.</p>
</div>
${lab('cgroup', 'restart', 'en', 'restart: always: killed, restarted, killed again — the restart count climbs and the logs say nothing. Only OOMKilled and memory.events tell the story.')}

<h3>Who killed it? 133, 134 or 137</h3>
<p>Not every memory death is the kernel's. Node has its own limit, the V8 heap (Chapter 7, lesson 7.4). This script grows the JS heap with ordinary objects:</p>
${src('ch08/grow.js', 'javascript')}
${run('c84-host', 'docker run --rm --name os-c84d', 1)}
${run('c84-host', 'docker run --rm --init', 1)}
${run('c84-host', 'docker run --rm --name os-c84e', 2)}
${run('c84-host', 'docker run --rm --name os-c84f', 2)}
<ul>
<li><strong>134</strong> (SIGABRT): with a 64 MB heap, V8 reaches its own limit first, prints <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code> and aborts. Readable: you know it was the JS heap.</li>
<li><strong>133</strong> (SIGTRAP): the same death when node is the container's PID 1 without <code>--init</code>. PID 1 ignores signals it has no handler for — including the SIGABRT it sends itself — so glibc's <code>abort()</code> falls back to a trap instruction, which on this arm64 machine is SIGTRAP. With <code>--init</code> the same command exits 134. (On x86-64 the fallback instruction differs, and so does the number; the cure is the same: run under an init, Chapter 1 lesson 1.5.)</li>
<li><strong>137</strong> (SIGKILL): with <code>--max-old-space-size=8192</code> in a 256 MiB box, the heap could never reach its limit; the cgroup limit came first and the kernel killed node silently at about 200 MB of heap. And with <strong>no flag at all</strong> the result is the same: Node 22 sized its default heap at 259 MB — more than the 256 MiB container (lesson 8.5 explains why).</li>
</ul>
<p>One detail: <code>rss</code> reached 270 MB in a 256 MiB container. RSS also counts the node binary's file pages, which are in the page cache but were charged to the cgroup that first read them, not to this one. The cgroup's <code>memory.current</code> is the number that is compared with the limit.</p>

<div class="pitfall co-tieu-de">
<p><strong>Raising --max-old-space-size does not fix a 137 — it hides the next 134.</strong> 137 means the <em>container</em> ran out, and a bigger heap ceiling only lets the heap grow further into it (the 8192 run above). Raise the heap only when the error is 134 ("Reached heap limit"), and raise the container limit with it. This project does exactly that: the frontend Dockerfile's heap went 3072 → 4096 (2026-07-23) → 6144 (2026-09-24), each time after an exit <strong>134</strong>, and a local cold <code>next build</code> today needs <code>NODE_OPTIONS=--max-old-space-size=8192</code> — on a machine that has the RAM for it.</p>
</div>

<h3>memory.high → reclaim → throttling → memory.max, timed</h3>
<p>Docker's <code>--memory</code> sets only <code>memory.max</code>: the hard wall where the OOM killer acts. cgroup v2 also has <code>memory.high</code>, a soft limit: above it the kernel reclaims hard and then <em>throttles</em> the group — puts its allocating tasks to sleep — but does not kill. systemd's <code>MemoryHigh=</code> writes it, and Kubernetes' Memory QoS feature uses it. To watch the stages we create a child cgroup inside a privileged throw-away container (its own cgroup namespace, so we only touch the container's subtree) with <code>memory.high</code> 96 MiB, <code>memory.max</code> 160 MiB and 32 MiB of swap:</p>
${run('c84-high', 'cat /proc/self/cgroup', 1)}
${run('c84-high', 'mkdir /sys/fs/cgroup/init', 5)}
<p>(The shell first moves itself into <code>init</code>: cgroup v2 only lets a group hand controllers to its children when it has no processes of its own. That is also why this script was started with <code>bash -c "exec phien …"</code> — the shell must be PID 1, the only process in the container's root group.) Then <code>fill</code> allocates 8 MiB at a time, timing each chunk and reading its own cgroup's counters:</p>
${src('ch08/fill.c', 'c')}
${run('c84-high', "sh -c 'echo", 1)}
<ol>
<li><strong>0–88 MiB, under memory.high</strong>: each 8 MiB chunk takes ~1 ms. Nothing happens.</li>
<li><strong>96–120 MiB, over memory.high, swap available</strong>: <code>current</code> stays pinned at ~93–96 MiB, the kernel reclaims by swapping the program's own older pages out (swap 4 → 27 MiB), and each chunk costs 7–10 ms. <code>high</code> events start counting.</li>
<li><strong>128 MiB onwards, swap full (32 MiB)</strong>: nothing left to reclaim, so the kernel <strong>throttles</strong>: 167 ms, then 7.2 s, 25.6 s, 43.0 s, ~25 s per 8 MiB chunk. <code>current</code> creeps over <code>high</code> (105 → 153 MiB) a few MiB at a time.</li>
<li><strong>Next chunk would pass memory.max (160 MiB)</strong>: OOM kill, exit 137 — about three minutes after the first warning.</li>
</ol>
${run('c84-high', 'cat /sys/fs/cgroup/job/memory.events', 3)}
<p><code>high 1948</code> times over the soft limit, <code>max 35</code> times at the hard one, then one <code>oom_kill</code>. PSI for the group: <strong>99.76%</strong> of the last 10 seconds stalled, 203 seconds stalled in total. For three minutes this process looked hung — consuming no CPU, making no progress — before it died. A build that "freezes" and is killed minutes later on a busy box is this timeline.</p>
<p>The useful side of <code>memory.high</code>: set it below <code>memory.max</code> and pressure becomes <em>slowness you can measure</em> (high events, PSI) instead of a sudden kill — time for a user-space agent (lesson 8.5) or a human to react.</p>
${lab('cgroup', 'high', 'en', 'memory.high = 384M under the same leak: reclaim and throttling slow the service and memory.pressure rises — the early warning — before memory.max finally kills.')}

<h3>How this project fixed it</h3>
<ul>
<li><strong>One image at a time</strong> on the VPS (deploy.sh Step 2a), and never <code>compose up --build</code>.</li>
<li><strong>One static-generation worker</strong>: <code>experimental.cpus: 1</code> in <code>frontend/next.config.js</code>, whose comment says the default of (CPU count − 1) workers, "each inheriting NODE_OPTIONS heap", OOM-killed the build on the 6 GB VPS (exit 137).</li>
<li><strong>Heap raised only for 134s</strong>, as above, and made a build argument (6144 for the VPS fallback path).</li>
<li><strong>Build somewhere else</strong>: since 2026-08-18, <code>deploy-nha.sh</code> builds both images on a 31 GB home machine with a 12,288 MB heap and the VPS only pulls and swaps them — it no longer needs build memory at all. (The VPS itself was upgraded from 6 to 8 GB on 2026-07-14.)</li>
</ul>

<h3>The next time you see 137</h3>
<ol>
<li><strong>Exit code and OOMKilled</strong>: <code>docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' NAME</code>. 137 + true = memory; 137 + false = something else sent SIGKILL (e.g. <code>docker stop</code> timing out, Chapter 1).</li>
<li><strong>memory.events</strong> of the cgroup: <code>oom_kill</code> &gt; 0? <code>high</code> climbing?</li>
<li><strong>The kernel log</strong>: <code>dmesg</code> / <code>journalctl -k</code> — "invoked oom-killer", the task table, "Killed process" (lesson 8.3).</li>
<li><strong>memory.peak vs memory.max</strong>, and what else ran at the same time.</li>
<li><strong>PSI before the kill</strong>: was it throttled for minutes first?</li>
</ol>
${lab('sysmon', 'mystery', 'en', 'A machine with one or two hidden culprits: use the five checks above (and the USE method from Chapter 2) to name the cause with a line of evidence.')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your group's CI job builds the frontend and the backend in parallel on a 2 GB runner and fails about one time in three with "Killed". The leader asks: retry, or change something?</p>
<ol>
<li>Run the parallel and sequential commands of this lesson with <code>--memory 512m</code>, then with <code>--memory 640m</code>. Record <code>memory.peak</code>, the exit codes and <code>OOMKilled</code> each time.</li>
<li>Run the parallel version three times. Is the victim always the same?</li>
<li>Run <code>grow.js</code> with <code>--max-old-space-size=64</code>, with and without <code>--init</code>, and with no flag in a 256 MiB box. Write the exit code and who killed it next to each.</li>
<li>Reproduce the memory.high timeline with <code>memory.high</code> 64M and <code>memory.max</code> 128M. How long from the first <code>high</code> event to the kill?</li>
</ol>
<p><strong>Done when:</strong> you can answer the leader with measured peaks ("parallel needs X MiB, the runner has Y"), explain why a retry sometimes passes (the kill is a race), and name which exit code would justify raising the heap instead.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['exit 137', '128 + 9: killed by SIGKILL — on a container, almost always the kernel’s OOM killer.'],
  ['exit 134 / 133', 'SIGABRT from V8 at its own heap limit; 133 (SIGTRAP) is the same death as PID 1 on arm64.'],
  ['OOMKilled', 'Docker flag: an OOM kill happened in the container’s cgroup — even if PID 1 survived.'],
  ['memory.peak', 'Highest memory.current the cgroup has reached: the number to compare with the limit.'],
  ['memory.high', 'Soft limit: above it the kernel reclaims, then throttles the group — no kill.'],
  ['memory.max', 'Hard limit: if reclaim cannot get the group under it, the OOM killer acts.'],
  ['throttling', 'The kernel putting a cgroup’s allocating tasks to sleep while it is over memory.high.'],
  ['memory.events', 'Counters: low, high, max, oom, oom_kill, oom_group_kill — the cgroup’s incident log.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The real incident: two cold builds in parallel on a 6 GB VPS that also served the site; the kernel killed next build (137).</li>
<li>Reproduced: parallel peak 512 MiB, both builds killed; sequential peak 310 MiB, none — same work, different peak.</li>
<li>A child OOM can leave exit 0 with OOMKilled=true; check code, flag and memory.events together.</li>
<li>134/133 = V8’s own heap limit (raise the heap); 137 = the cgroup limit (raising the heap makes it worse).</li>
<li>memory.high throttled for ~3 minutes (7–43 s per 8 MiB, PSI 99.76%) before memory.max killed.</li>
</ul>
${L('https://docs.kernel.org/admin-guide/cgroup-v2.html', '🐧', 'kernel.org — Control Group v2 (memory controller)', 'memory.high, memory.max, memory.events, memory.peak, memory.oom.group.', 'Open')}
${L('https://docs.docker.com/engine/containers/resource_constraints/', '🐳', 'Docker — Resource constraints', 'What --memory, --memory-swap and --oom-score-adj do, and how OOM kills appear.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Exit 137 trên VPS: sự cố, tái hiện và bấm giờ</h2>
<p class="lead">Một lần deploy chính trang web này chết với <code>exit 137</code> giữa chừng <code>next build</code>. Không stack trace, không một lời "out of memory" từ Node — output của bản build cứ thế dừng lại. Chương 1 đã dạy bạn 137 = 128 + 9 = SIGKILL. Bài này đi từ con số đó tới nguyên nhân và cách sửa: <strong>thứ gì đang dùng bộ nhớ, vì sao build từng ảnh một lại chữa được, làm sao phân biệt cú giết của nhân (137) với trần heap của chính Node (134), và những phút trước cú giết trông như thế nào.</strong></p>

<h3>Sự cố, theo trí nhớ của kho mã</h3>
<p>Mỗi sự cố trong dự án này để lại một chú thích có ngày tháng cạnh đoạn mã sửa nó. Bước 2a của <code>deploy.sh</code>:</p>
${code('# ── Step 2a: Build images ONE AT A TIME (OOM guard) ───────────────\n# The VPS has 6GB RAM shared with the live stack. When the build cache\n# is cold (it is pruned at the end of every deploy), building backend\n# and frontend in parallel peaks above available RAM and the kernel\n# kills `next build` (exit 137, seen 2026-07-06). Building sequentially\n# keeps the peak to one image at a time; with a warm cache each build\n# is a fast no-op, so normal deploys lose no time.', 'bash')}
<p>Và một ngày sau, cách đó vài dòng:</p>
${code('# Do NOT pass `--build` here: compose bake treats it as a fresh\n# parallel build of BOTH images (observed 2026-07-07 — it re-ran\n# `next build` alongside the backend export and the kernel OOM-killed\n# it, exit 137), defeating the sequential OOM guard above.', 'bash')}
<p>Sự thật: một VPS 6 GB <em>đồng thời đang phục vụ trang web thật</em> (PostgreSQL, Redis, backend, nginx); hai lần build ảnh nguội cùng lúc; nhân giết tiến trình lớn nhất, tức <code>next build</code>. Ngày thứ hai cho thấy lỗi quay lại dễ thế nào: <code>docker compose up --build</code> lặng lẽ build mọi ảnh song song.</p>

<h3>Tái hiện: hai "bản build" trong một hộp 512 MiB</h3>
<p>Một <code>next build</code> thật cần hàng gigabyte; ta thu nhỏ sự cố khoảng 1/12. "VPS" là một container <code>--memory 512m</code> không swap; mỗi "bản build" là một script Node có bộ nhớ leo tới 300 MB rồi kết thúc. Nó cấp phát <code>Buffer</code>, nằm ngoài heap V8, nên chỉ giới hạn cgroup mới chặn được nó:</p>
${src('ch08/build.js', 'javascript')}
${run('c84-host', 'docker run --name os-c84a', 3)}
<p>Hai bản build cùng lên 192 MB, và cộng lại đã vượt 512 MiB: <strong>cả hai bị giết với 137</strong>, <code>memory.peak</code> chạm đúng giới hạn, <code>oom_kill 2</code>. (Ở một lần chạy khác của đúng lệnh này chỉ A chết còn B xong — nhân giết kẻ lớn nhất ngay khoảnh khắc đó, nên kết quả là một cuộc đua.) Giờ đúng hai bản build đó, lần lượt:</p>
${run('c84-host', 'docker run --name os-c84b', 2)}
<p>Cả hai xong. <code>memory.peak</code> 310 MiB, <code>oom_kill 0</code>. Khối lượng việc y hệt — 2 × 300 MB. Thứ thay đổi là <strong>đỉnh</strong>: giới hạn bộ nhớ là chuyện bao nhiêu đang được dùng tại một thời điểm, không phải tổng. Đó là toàn bộ cách sửa ở Bước 2a, và là lý do "cứ chạy song song cho nhanh" là sai trên một máy nhỏ.</p>
${lab('process', 'oom137', 'vi', 'bash fork node để chạy next build, một bản build thứ hai đẩy máy vượt bộ nhớ, nhân SIGKILL node và shell báo 137.')}

<h3>Exit 0 và OOMKilled=true cùng một lúc</h3>
${run('c84-host', 'docker run --name os-c84c', 3)}
<p>Khi tiến trình bị giết là PID 1 của container, container chết: exit 137 và <code>OOMKilled=true</code>, đúng trường hợp bạn thấy ở Chương 1. Nhưng nhìn lại lần chạy song song ở trên: ở đó hai bản build là con của một script bash làm PID 1. Nhân giết các con, bash sống sót, in mã thoát và kết thúc bình thường — <strong>container thoát 0, mà Docker vẫn báo OOMKilled=true</strong> vì trong cgroup của nó đã có một lần OOM kill.</p>

<div class="pitfall co-tieu-de">
<p><strong>Mã thoát xanh có thể che một lần OOM kill.</strong> Một job CI, một script bọc ngoài, <code>npm run</code> với nhiều worker, một trình giám sát bên trong container: nếu PID 1 sống sót, mã thoát là thứ nó quyết định trả về. Hãy kiểm cả ba — mã thoát, <code>docker inspect -f '{{.State.OOMKilled}}'</code>, và <code>memory.events</code> của cgroup (<code>oom_kill</code>) — và cho script bọc ngoài báo lỗi khi một tiến trình con chết vì tín hiệu.</p>
</div>
${lab('cgroup', 'restart', 'vi', 'restart: always: bị giết, chạy lại, lại bị giết — số lần restart tăng còn log chẳng nói gì. Chỉ OOMKilled và memory.events kể lại câu chuyện.')}

<h3>Ai giết nó? 133, 134 hay 137</h3>
<p>Không phải cái chết bộ nhớ nào cũng do nhân. Node có giới hạn riêng, heap V8 (Chương 7, bài 7.4). Script này làm phình heap JS bằng các đối tượng bình thường:</p>
${src('ch08/grow.js', 'javascript')}
${run('c84-host', 'docker run --rm --name os-c84d', 1)}
${run('c84-host', 'docker run --rm --init', 1)}
${run('c84-host', 'docker run --rm --name os-c84e', 2)}
${run('c84-host', 'docker run --rm --name os-c84f', 2)}
<ul>
<li><strong>134</strong> (SIGABRT): với heap 64 MB, V8 chạm trần của chính nó trước, in <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code> rồi tự huỷ. Đọc được: bạn biết đó là heap JS.</li>
<li><strong>133</strong> (SIGTRAP): cùng cái chết đó khi node là PID 1 của container mà không có <code>--init</code>. PID 1 bỏ qua những tín hiệu nó không có hàm xử lý — kể cả SIGABRT nó tự gửi cho mình — nên <code>abort()</code> của glibc lùi về một lệnh bẫy, mà trên máy arm64 này là SIGTRAP. Có <code>--init</code>, đúng lệnh đó thoát 134. (Trên x86-64 lệnh lùi đó khác, nên con số cũng khác; cách chữa vẫn vậy: chạy dưới một init, Chương 1 bài 1.5.)</li>
<li><strong>137</strong> (SIGKILL): với <code>--max-old-space-size=8192</code> trong hộp 256 MiB, heap không bao giờ chạm trần; giới hạn cgroup tới trước và nhân lặng lẽ giết node khi heap khoảng 200 MB. Và khi <strong>không đặt cờ nào</strong> kết quả cũng vậy: Node 22 tự đặt heap mặc định 259 MB — lớn hơn container 256 MiB (bài 8.5 giải thích vì sao).</li>
</ul>
<p>Một chi tiết: <code>rss</code> lên tới 270 MB trong container 256 MiB. RSS còn đếm các trang file của chính file node, nằm trong page cache nhưng đã bị tính cho cgroup đọc nó đầu tiên, không phải cgroup này. Con số được so với giới hạn là <code>memory.current</code> của cgroup.</p>

<div class="pitfall co-tieu-de">
<p><strong>Nâng --max-old-space-size không chữa được 137 — nó chỉ giấu lần 134 tiếp theo.</strong> 137 nghĩa là <em>container</em> đã cạn, và trần heap cao hơn chỉ để heap lấn sâu hơn vào đó (lần chạy 8192 ở trên). Chỉ nâng heap khi lỗi là 134 ("Reached heap limit"), và nâng giới hạn container cùng lúc. Dự án này làm đúng như vậy: heap trong Dockerfile của frontend đi từ 3072 → 4096 (23/07/2026) → 6144 (24/09/2026), mỗi lần đều sau một exit <strong>134</strong>, và một lần <code>next build</code> nguội ở máy local hôm nay cần <code>NODE_OPTIONS=--max-old-space-size=8192</code> — trên một máy có đủ RAM cho nó.</p>
</div>

<h3>memory.high → thu hồi → hãm tốc → memory.max, có bấm giờ</h3>
<p><code>--memory</code> của Docker chỉ đặt <code>memory.max</code>: bức tường cứng nơi OOM killer ra tay. cgroup v2 còn có <code>memory.high</code>, một giới hạn mềm: vượt nó, nhân thu hồi mạnh rồi <em>hãm tốc (throttle)</em> cả nhóm — cho các tác vụ đang cấp phát ngủ — nhưng không giết. <code>MemoryHigh=</code> của systemd ghi vào nó, và tính năng Memory QoS của Kubernetes dùng nó. Để nhìn các giai đoạn, ta tạo một cgroup con bên trong một container vứt đi có quyền cao (cgroup namespace riêng, nên ta chỉ đụng vào cây con của container) với <code>memory.high</code> 96 MiB, <code>memory.max</code> 160 MiB và 32 MiB swap:</p>
${run('c84-high', 'cat /proc/self/cgroup', 1)}
${run('c84-high', 'mkdir /sys/fs/cgroup/init', 5)}
<p>(Shell tự chuyển mình vào <code>init</code> trước: cgroup v2 chỉ cho một nhóm giao bộ điều khiển cho các nhóm con khi bản thân nó không chứa tiến trình nào. Đó cũng là lý do script này được khởi động bằng <code>bash -c "exec phien …"</code> — shell phải là PID 1, tiến trình duy nhất trong nhóm gốc của container.) Rồi <code>fill</code> cấp phát mỗi lần 8 MiB, bấm giờ từng mẩu và đọc bộ đếm của chính cgroup mình:</p>
${src('ch08/fill.c', 'c')}
${run('c84-high', "sh -c 'echo", 1)}
<ol>
<li><strong>0–88 MiB, dưới memory.high</strong>: mỗi mẩu 8 MiB mất ~1 ms. Không có gì xảy ra.</li>
<li><strong>96–120 MiB, vượt memory.high, còn swap</strong>: <code>current</code> bị ghim ở ~93–96 MiB, nhân thu hồi bằng cách đẩy các trang cũ của chính chương trình ra swap (swap 4 → 27 MiB), và mỗi mẩu tốn 7–10 ms. Sự kiện <code>high</code> bắt đầu được đếm.</li>
<li><strong>Từ 128 MiB, swap đầy (32 MiB)</strong>: không còn gì để thu hồi, nên nhân <strong>hãm tốc</strong>: 167 ms, rồi 7,2 s, 25,6 s, 43,0 s, ~25 s mỗi mẩu 8 MiB. <code>current</code> nhích dần quá <code>high</code> (105 → 153 MiB) vài MiB một lần.</li>
<li><strong>Mẩu tiếp theo sẽ vượt memory.max (160 MiB)</strong>: OOM kill, exit 137 — khoảng ba phút sau cảnh báo đầu tiên.</li>
</ol>
${run('c84-high', 'cat /sys/fs/cgroup/job/memory.events', 3)}
<p><code>high 1948</code> lần vượt giới hạn mềm, <code>max 35</code> lần chạm giới hạn cứng, rồi một <code>oom_kill</code>. PSI của nhóm: <strong>99,76%</strong> của 10 giây cuối bị kẹt, tổng cộng 203 giây bị kẹt. Suốt ba phút tiến trình này trông như treo — không dùng CPU, không tiến triển — trước khi chết. Một lần build "đứng hình" rồi bị giết vài phút sau trên một máy đang bận chính là dòng thời gian này.</p>
<p>Mặt có ích của <code>memory.high</code>: đặt nó dưới <code>memory.max</code> thì áp lực trở thành <em>sự chậm đo được</em> (sự kiện high, PSI) thay vì một cú giết bất ngờ — có thời gian cho một tác tử ở không gian người dùng (bài 8.5) hoặc con người phản ứng.</p>
${lab('cgroup', 'high', 'vi', 'memory.high = 384M với cùng lỗi rò: thu hồi và hãm tốc làm dịch vụ chậm lại và memory.pressure tăng — tín hiệu báo sớm — trước khi memory.max cuối cùng ra tay.')}

<h3>Dự án này đã sửa ra sao</h3>
<ul>
<li><strong>Build từng ảnh một</strong> trên VPS (deploy.sh Bước 2a), và không bao giờ <code>compose up --build</code>.</li>
<li><strong>Một worker sinh trang tĩnh</strong>: <code>experimental.cpus: 1</code> trong <code>frontend/next.config.js</code>, với chú thích nói rằng mặc định (số CPU − 1) worker, "mỗi worker thừa hưởng heap của NODE_OPTIONS", đã khiến bản build bị OOM kill trên VPS 6 GB (exit 137).</li>
<li><strong>Chỉ nâng heap khi gặp 134</strong>, như ở trên, và biến nó thành tham số build (6144 cho đường lùi trên VPS).</li>
<li><strong>Build ở nơi khác</strong>: từ 18/08/2026, <code>deploy-nha.sh</code> build cả hai ảnh trên một máy ở nhà 31 GB với heap 12.288 MB, còn VPS chỉ kéo ảnh về và tráo — nó không còn cần bộ nhớ cho việc build nữa. (Bản thân VPS đã được nâng từ 6 lên 8 GB ngày 14/07/2026.)</li>
</ul>

<h3>Lần tới khi bạn thấy 137</h3>
<ol>
<li><strong>Mã thoát và OOMKilled</strong>: <code>docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' TÊN</code>. 137 + true = bộ nhớ; 137 + false = thứ khác gửi SIGKILL (vd <code>docker stop</code> hết giờ, Chương 1).</li>
<li><strong>memory.events</strong> của cgroup: <code>oom_kill</code> &gt; 0? <code>high</code> đang tăng?</li>
<li><strong>Nhật ký nhân</strong>: <code>dmesg</code> / <code>journalctl -k</code> — "invoked oom-killer", bảng tác vụ, "Killed process" (bài 8.3).</li>
<li><strong>memory.peak so với memory.max</strong>, và còn gì chạy cùng lúc.</li>
<li><strong>PSI trước cú giết</strong>: nó có bị hãm tốc nhiều phút trước không?</li>
</ol>
${lab('sysmon', 'mystery', 'vi', 'Một máy có một hai thủ phạm giấu sẵn: dùng năm bước kiểm ở trên (và phương pháp USE của Chương 2) để gọi tên nguyên nhân kèm một dòng bằng chứng.')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> job CI của nhóm build frontend và backend song song trên một runner 2 GB và cứ ba lần thì hỏng một lần với "Killed". Trưởng nhóm hỏi: chạy lại, hay phải sửa gì?</p>
<ol>
<li>Chạy lệnh song song và tuần tự của bài này với <code>--memory 512m</code>, rồi với <code>--memory 640m</code>. Ghi <code>memory.peak</code>, các mã thoát và <code>OOMKilled</code> mỗi lần.</li>
<li>Chạy bản song song ba lần. Nạn nhân có luôn là một không?</li>
<li>Chạy <code>grow.js</code> với <code>--max-old-space-size=64</code>, có và không có <code>--init</code>, và không cờ nào trong hộp 256 MiB. Ghi mã thoát và ai đã giết nó cạnh mỗi lần.</li>
<li>Tái hiện dòng thời gian memory.high với <code>memory.high</code> 64M và <code>memory.max</code> 128M. Từ sự kiện <code>high</code> đầu tiên tới cú giết mất bao lâu?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn trả lời trưởng nhóm bằng các đỉnh đã đo ("song song cần X MiB, runner có Y"), giải thích được vì sao chạy lại đôi khi qua (cú giết là một cuộc đua), và nêu được mã thoát nào mới đáng để nâng heap.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['exit 137', '128 + 9: bị SIGKILL giết — với container, gần như luôn là OOM killer của nhân.'],
  ['exit 134 / 133', 'SIGABRT do V8 ở trần heap của chính nó; 133 (SIGTRAP) là cùng cái chết đó khi là PID 1 trên arm64.'],
  ['OOMKilled', 'Cờ của Docker: đã có một lần OOM kill trong cgroup của container — kể cả khi PID 1 sống sót.'],
  ['memory.peak', 'memory.current cao nhất cgroup từng đạt: con số để so với giới hạn.'],
  ['memory.high', 'Giới hạn mềm: vượt nó nhân thu hồi, rồi hãm tốc nhóm — không giết.'],
  ['memory.max', 'Giới hạn cứng: nếu thu hồi không kéo được nhóm xuống dưới nó, OOM killer ra tay.'],
  ['throttling (hãm tốc)', 'Nhân cho các tác vụ đang cấp phát của một cgroup ngủ khi nó đang vượt memory.high.'],
  ['memory.events', 'Bộ đếm: low, high, max, oom, oom_kill, oom_group_kill — sổ sự cố của cgroup.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sự cố thật: hai lần build nguội song song trên VPS 6 GB đang phục vụ web; nhân giết next build (137).</li>
<li>Tái hiện: song song đỉnh 512 MiB, cả hai bản build bị giết; tuần tự đỉnh 310 MiB, không ai chết — cùng việc, khác đỉnh.</li>
<li>OOM của tiến trình con có thể để lại exit 0 với OOMKilled=true; kiểm cả mã, cờ và memory.events.</li>
<li>134/133 = trần heap của chính V8 (nâng heap); 137 = giới hạn cgroup (nâng heap còn tệ hơn).</li>
<li>memory.high hãm tốc ~3 phút (7–43 s mỗi 8 MiB, PSI 99,76%) trước khi memory.max giết.</li>
</ul>
${L('https://docs.kernel.org/admin-guide/cgroup-v2.html', '🐧', 'kernel.org — Control Group v2 (bộ điều khiển bộ nhớ)', 'memory.high, memory.max, memory.events, memory.peak, memory.oom.group.', 'Mở')}
${L('https://docs.docker.com/engine/containers/resource_constraints/', '🐳', 'Docker — Resource constraints', '--memory, --memory-swap và --oom-score-adj làm gì, và OOM kill hiện ra thế nào.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 8.5 — Limits for runtimes ───────────────────────── */
    {
      title: '8.5 — Memory limits for Node, JVM, containers and Kubernetes|||8.5 — Giới hạn bộ nhớ cho Node, JVM, container và Kubernetes',
      slug: 'os-8-5-gioi-han',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mỗi cờ docker run --memory* ghi gì vào cgroup (đo thật); heap mặc định của Node 22 ≈ ½ giới hạn với sàn 259 MB (lớn hơn hộp 256 MiB); Buffer nằm ngoài heap; backend của dự án: heap 1536 trong container 2G; JVM đọc cgroup, MaxRAMPercentage, -Xmx1g ⇒ 137 vs OutOfMemoryError (exit 1) vs ExitOnOutOfMemoryError (exit 3); Kubernetes requests vs limits, QoS, eviction; systemd-oomd/earlyoom và một mini-oomd 7 dòng theo PSI.',
      content: `${G85}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Two limits must fit together: the container’s and the runtime’s</h2>
<p class="lead">A container limit is only half of the story. Inside it, Node has a heap limit, the JVM has a heap limit, and both have memory that no heap limit counts. If the runtime's limit is above the container's, you get a silent 137 instead of a readable error; if it is far below, you waste the RAM you pay for. This lesson answers: <strong>what exactly does each memory flag set, how do Node and the JVM size themselves inside a container, and how do you leave room for everything that is not heap?</strong></p>

<h3>What docker run actually writes</h3>
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m os-lab cat', 1)}
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swap', 1)}
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-reservation', 1)}
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swappiness', 1)}
<ul>
<li><code>--memory 256m</code> → <code>memory.max</code> = 268,435,456. Without <code>--memory-swap</code>, <code>memory.swap.max</code> is <em>also</em> 256 MiB: the container may use as much swap again. Many people do not know their containers can swap.</li>
<li><code>--memory-swap 256m</code> equal to <code>--memory</code> → <code>memory.swap.max</code> = 0: no swap at all (what the earlier OOM experiments used). <code>-1</code> means unlimited swap.</li>
<li><code>--memory-reservation 128m</code> → <code>memory.low</code>: a soft protection — under global pressure the kernel reclaims from this cgroup only after others. <code>memory.high</code> stays <code>max</code>: Docker has no flag for it.</li>
<li><code>--oom-score-adj 500</code> → <code>oom_score_adj</code> of PID 1 (lesson 8.3).</li>
<li><code>--memory-swappiness 10</code> → a warning and nothing: cgroup v2 has no per-cgroup swappiness, so the container still sees the global 60 (lesson 8.2).</li>
</ul>

<h3>Node: the default heap follows the container — almost</h3>
${run('c85-host', 'for m in 256m', 1)}
<p>Node 22 reads the cgroup limit and sizes the V8 heap at roughly <strong>half of it</strong>: 524 MB in 1 GiB, 1,048 MB in 2 GiB, 2,096 MB in 4 GiB. But there is a <strong>floor of 259 MB</strong>: in a 256 MiB container the default heap is <em>larger than the container</em>. That is why the no-flag run in lesson 8.4 died with 137 rather than a heap error: the kernel's limit will always be reached first. In small containers, set <code>--max-old-space-size</code> yourself.</p>

<h3>Buffers live outside the heap</h3>
${src('ch08/buf.js', 'javascript')}
${run('c85-lim', 'node --max-old-space-size=64 buf.js', 2)}
<p>A 64 MB heap limit, a 128 MiB container, and a script that allocates <code>Buffer</code>s: <code>heapUsed</code> stays at 3–4 MB while <code>external</code> and <code>rss</code> climb to 97 and 151 MB — then SIGKILL, <code>oom_kill 1</code>. The heap limit never fired, because Buffers, typed arrays, images in <code>sharp</code>, native addons and ML models are <strong>external memory</strong>. <code>process.memoryUsage()</code> shows them; <code>--max-old-space-size</code> does not limit them.</p>

<h3>Sizing a real Node service: this project's backend</h3>
<p>The backend image of this site sets its heap like this (<code>Dockerfile.backend</code>):</p>
${code('# Node old-space heap cap. MUST stay BELOW the backend container\u0027s memory\n# limit in docker-compose.yml or the kernel OOM-kills the container (exit 137)\n# once the heap grows past the cgroup limit. Sized for the 8 GB VPS (upgraded\n# 2026-07-14): compose limit is now 2G, so 1536 MB heap ≈ 75%, leaving ~512 MB\n# for non-heap (buffers, sharp, the embeddings ONNX model, stack, code).\n# Raise BOTH this value and the compose memory limit together if you grow it.\nENV NODE_OPTIONS=--max-old-space-size=1536', 'bash')}
<p>That comment is the whole method: container limit 2G; heap 75% of it; the remaining ~512 MB for Buffers, the image library, an ONNX embeddings model, thread stacks and code; and the two numbers move together. Measure the non-heap part (<code>rss − heapTotal</code> under real load) before you pick the percentage.</p>

<h3>The JVM reads the cgroup too</h3>
${run('c85-host', 'docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XshowSettings', 1)}
${run('c85-host', 'docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:+PrintFlags', 1)}
${run('c85-host', 'docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:MaxRAMPercentage=75', 1)}
<p>Java 21 sees the cgroup v2 limit (512 MiB) and by default gives the heap <strong>25%</strong> of it: <code>MaxHeapSize</code> 134,217,728 = 128 MiB. Safe, but three quarters of the container are left for a heap that cannot use them. <code>-XX:MaxRAMPercentage=75</code> makes it 402,653,184 = 384 MiB and keeps scaling if the limit changes. (Old Java 8 builds before 8u191 ignored cgroups and sized the heap from the host's RAM — the root of many "Java in Docker" horror stories.)</p>

<h3>137 or OutOfMemoryError: you choose</h3>
${src('ch08/Hog.java', 'java')}
${run('c85-host', 'docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -Xmx1g', 2)}
${run('c85-host', 'docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 Hog', 2)}
${run('c85-host', 'docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 -XX:+Exit', 1)}
<ul>
<li><code>-Xmx1g</code> in a 256 MiB box: the JVM believes it may use 989 MB, grows past 192 MB of heap and is killed by the kernel: <strong>137</strong>, no stack trace.</li>
<li><code>MaxRAMPercentage=75</code>: max heap 185 MB; at 160 MB the JVM throws <code>java.lang.OutOfMemoryError: Java heap space</code> with the line number (<code>Hog.java:13</code>) and exits <strong>1</strong>. Readable.</li>
<li>plus <code>-XX:+ExitOnOutOfMemoryError</code>: "Terminating due to …", exit <strong>3</strong>. In production you usually want this: an OOME leaves a JVM in an unknown state, and a clean exit lets Docker or Kubernetes restart it.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Never copy an -Xmx from a laptop into a container.</strong> <code>-Xmx1g</code> was fine on a 16 GB machine; in a 256 MiB pod it turns every heap problem into a silent 137. Use <code>MaxRAMPercentage</code> so the heap follows the box, and keep it at 70–80%, not 100%: metaspace, the JIT's code cache, one stack per platform thread (up to 1 MB each with the default <code>-Xss</code>), NIO direct buffers and the garbage collector's own structures all live outside the heap. A Spring Boot app with 200 Tomcat threads needs that headroom.</p>
</div>

<h3>Kubernetes: requests schedule, limits kill</h3>
<p>The same ideas, one level up (conceptual — this lab has no cluster):</p>
<ul>
<li><strong><code>resources.requests.memory</code></strong> is for the scheduler: a pod is placed only on a node with that much unrequested memory. It is not enforced as a cap.</li>
<li><strong><code>resources.limits.memory</code></strong> becomes the container's <code>memory.max</code>. Cross it and the container is OOM-killed by the kernel: status <code>OOMKilled</code>, exit code 137, and the pod restarts.</li>
<li><strong>QoS classes set oom_score_adj</strong>: Guaranteed (requests = limits) gets −997; BestEffort (none set) gets 1000; Burstable gets 1000 − 1000 × request / node memory, clamped to 2…999. Under node-wide OOM, BestEffort pods die first.</li>
<li><strong>Node-pressure eviction</strong>: before the kernel has to kill, the kubelet watches node memory and evicts pods that use more than they requested (default hard threshold <code>memory.available &lt; 100Mi</code>). And on cgroup v2, since Kubernetes 1.28 the kubelet sets <code>memory.oom.group = 1</code>, so an OOM kills the whole container, not one of its processes.</li>
</ul>
<p>The practical rule: set requests to what the service really uses under normal load and limits to its measured peak plus headroom; for anything stateful, make them equal (Guaranteed).</p>
${lab('cgroup', 'restart', 'en', 'What a pod over its limit looks like from inside: OOM kill, restart, OOM kill — CrashLoopBackOff with an empty log. Read the restart reason, not the log.')}

<h3>Kill on pressure, before the kernel has to</h3>
<p>Lessons 8.2 and 8.4 showed the weakness of the kernel's OOM killer: it acts only when nothing can be reclaimed, so a thrashing or throttled system can crawl for minutes first. User-space killers act earlier:</p>
<ul>
<li><strong>systemd-oomd</strong> watches PSI per cgroup (by default, kill when memory pressure stays above 60% for 30 seconds on units that opt in with <code>ManagedOOMMemoryPressure=kill</code>) and swap usage, and kills a whole cgroup. Fedora and Ubuntu desktops enable it.</li>
<li><strong>earlyoom</strong> is a tiny daemon: SIGTERM to the largest process when available memory <em>and</em> free swap both drop under 10%, SIGKILL under 5%.</li>
</ul>
<p>The idea fits in seven lines of bash. Here it watches the file-thrashing reader of lesson 8.2 (no swap, 128 MiB) and kills it when <code>some avg10</code> reaches 20%:</p>
${run('c85-lim', './ws 200 50', 3)}
<p>Pressure rose as the 10-second average caught up — 4%, 9%, 13%, 17%, 20.4% — and at ten seconds our watcher killed the reader. <code>oom_kill</code> is still 1, the count left by the Buffer test: <strong>the kernel never decided to kill anything</strong>, and without the watcher this reader would have crawled at a minute per pass indefinitely. That is the gap systemd-oomd fills on desktops and Kubernetes eviction fills on clusters.</p>
${lab('vm', 'loop', 'en', 'A limit just one frame too small: the loop over 5 pages faults on every reference with 4 frames. Too-tight limits create the crawl that pressure-based killers exist for.', { tour: 'vm-thrash' })}

<h3>Too tight hurts too</h3>
<p>The limits this project runs with, from its <code>docker-compose.yml</code>: postgres 2G, redis 512M (with <code>--maxmemory 256mb</code> inside, so Redis evicts keys long before the cgroup kills it), backend 2G (heap 1536), frontend 2G, tts 2560M, coturn and nginx 256M each. The tts limit is a good example of sizing: the compose comment records a measured 973 MB while reading text, raised to 2.5G because voice cloning also loads torch and torchaudio. Rules of thumb:</p>
<ul>
<li>limit = measured <code>memory.peak</code> under real load + 20–30% headroom;</li>
<li>a limit right at the working set does not fail fast — it thrashes (lesson 8.2: ~1 ms per page, oom 0);</li>
<li>alert on PSI or set <code>memory.high</code> below <code>memory.max</code>, so pressure is visible before the kill;</li>
<li>keep the sum of all limits below the machine's RAM, or the cgroups protect nobody when the whole box runs out.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team moves its Spring Boot API and its Node worker into containers with 512 MiB each. The Java service was started with <code>-Xmx1g</code> "like on the laptop", and the Node worker resizes images with Buffers. Before deploy, prove which settings will die how.</p>
<ol>
<li>For <code>--memory 512m</code>, read the default heap of Node (<code>node -p "require('v8').getHeapStatistics().heap_size_limit"</code>) and of Java (<code>-XX:+PrintFlagsFinal</code>).</li>
<li>Run <code>Hog</code> with <code>-Xmx1g</code>, then with <code>-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError</code>. Record exit codes.</li>
<li>Run <code>buf.js</code> with <code>--max-old-space-size=256</code>. At what RSS is it killed, and what is <code>heapUsed</code> then?</li>
<li>Write the two lines you would put in each Dockerfile and the compose memory limits, with one sentence on the non-heap headroom.</li>
</ol>
<p><strong>Done when:</strong> you have three measured exit codes (137, 1 or 3, 137 for buf.js) with a cause next to each, and a sizing note of the form "limit X, heap Y (Z%), non-heap measured W".</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['memory.max / memory.swap.max', 'Hard RAM limit / swap limit of a cgroup; Docker --memory and (--memory-swap − --memory).'],
  ['memory.low', 'Soft protection: reclaimed only after other cgroups; Docker --memory-reservation.'],
  ['--max-old-space-size', 'V8 heap limit in MB; Node 22’s default ≈ half the cgroup limit, never below 259 MB.'],
  ['external memory', 'Memory a JS program uses outside the V8 heap: Buffers, typed arrays, native addons.'],
  ['MaxRAMPercentage', 'JVM heap as a share of the container limit (default 25%); usually set to 70–80.'],
  ['ExitOnOutOfMemoryError', 'JVM flag: exit (code 3) on the first OOME so the orchestrator restarts a clean process.'],
  ['requests vs limits', 'Kubernetes: what the scheduler reserves vs the memory.max that triggers OOMKilled.'],
  ['systemd-oomd / earlyoom', 'User-space killers that act on pressure or low free memory before the kernel OOM killer.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>--memory</code> → memory.max; without <code>--memory-swap</code> the container gets as much swap again; <code>--memory-swappiness</code> is ignored on cgroup v2.</li>
<li>Node 22’s default heap ≈ ½ of the limit with a 259 MB floor — bigger than a 256 MiB box; Buffers are outside it.</li>
<li>Size like this project’s backend: heap 1536 in a 2G container, ~512 MB for non-heap, change both together.</li>
<li>JVM: MaxRAMPercentage 75 turns a silent 137 into OutOfMemoryError (exit 1) or a clean exit 3.</li>
<li>Kubernetes requests schedule and limits kill; systemd-oomd, earlyoom and kubelet eviction act on pressure before the kernel.</li>
</ul>
${L('https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/', '☸️', 'Kubernetes — Resource management for pods and containers', 'Requests vs limits, and what happens when a container exceeds its memory limit.', 'Open')}
${L('https://www.freedesktop.org/software/systemd/man/latest/systemd-oomd.service.html', '🐧', 'systemd-oomd.service', 'The PSI- and swap-based user-space OOM killer and its settings.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Hai giới hạn phải khớp nhau: của container và của runtime</h2>
<p class="lead">Giới hạn của container mới là một nửa câu chuyện. Bên trong nó, Node có trần heap, JVM có trần heap, và cả hai đều có phần bộ nhớ mà không trần heap nào đếm. Nếu giới hạn của runtime cao hơn của container, bạn nhận một 137 im lặng thay vì một lỗi đọc được; nếu thấp hơn quá nhiều, bạn phí phần RAM mình trả tiền. Bài này trả lời: <strong>mỗi cờ bộ nhớ đặt chính xác cái gì, Node và JVM tự chọn kích cỡ ra sao bên trong container, và làm sao chừa chỗ cho mọi thứ không phải heap?</strong></p>

<h3>docker run thật ra ghi gì</h3>
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m os-lab cat', 1)}
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swap', 1)}
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-reservation', 1)}
${run('c85-host', 'docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swappiness', 1)}
<ul>
<li><code>--memory 256m</code> → <code>memory.max</code> = 268.435.456. Không có <code>--memory-swap</code> thì <code>memory.swap.max</code> <em>cũng</em> là 256 MiB: container được dùng thêm chừng đó swap. Nhiều người không biết container của mình có thể swap.</li>
<li><code>--memory-swap 256m</code> bằng <code>--memory</code> → <code>memory.swap.max</code> = 0: không có swap (đúng thứ các thí nghiệm OOM trước đã dùng). <code>-1</code> nghĩa là swap không giới hạn.</li>
<li><code>--memory-reservation 128m</code> → <code>memory.low</code>: một lớp bảo vệ mềm — khi cả máy thiếu bộ nhớ, nhân chỉ thu hồi từ cgroup này sau khi đã lấy của các nhóm khác. <code>memory.high</code> vẫn là <code>max</code>: Docker không có cờ cho nó.</li>
<li><code>--oom-score-adj 500</code> → <code>oom_score_adj</code> của PID 1 (bài 8.3).</li>
<li><code>--memory-swappiness 10</code> → một cảnh báo và không gì cả: cgroup v2 không có swappiness theo từng cgroup, nên container vẫn thấy 60 toàn cục (bài 8.2).</li>
</ul>

<h3>Node: heap mặc định đi theo container — gần như vậy</h3>
${run('c85-host', 'for m in 256m', 1)}
<p>Node 22 đọc giới hạn cgroup và đặt heap V8 khoảng <strong>một nửa</strong>: 524 MB trong 1 GiB, 1.048 MB trong 2 GiB, 2.096 MB trong 4 GiB. Nhưng có một <strong>mức sàn 259 MB</strong>: trong container 256 MiB, heap mặc định <em>lớn hơn cả container</em>. Đó là lý do lần chạy không cờ ở bài 8.4 chết với 137 chứ không phải lỗi heap: giới hạn của nhân luôn bị chạm trước. Trong container nhỏ, hãy tự đặt <code>--max-old-space-size</code>.</p>

<h3>Buffer nằm ngoài heap</h3>
${src('ch08/buf.js', 'javascript')}
${run('c85-lim', 'node --max-old-space-size=64 buf.js', 2)}
<p>Trần heap 64 MB, container 128 MiB, và một script cấp phát <code>Buffer</code>: <code>heapUsed</code> đứng ở 3–4 MB trong khi <code>external</code> và <code>rss</code> leo lên 97 và 151 MB — rồi SIGKILL, <code>oom_kill 1</code>. Trần heap không bao giờ bật, vì Buffer, typed array, ảnh trong <code>sharp</code>, addon native và model ML đều là <strong>bộ nhớ ngoài (external)</strong>. <code>process.memoryUsage()</code> cho thấy chúng; <code>--max-old-space-size</code> không giới hạn chúng.</p>

<h3>Chọn cỡ cho một dịch vụ Node thật: backend của dự án này</h3>
<p>Ảnh backend của trang web này đặt heap như sau (<code>Dockerfile.backend</code>):</p>
${code('# Node old-space heap cap. MUST stay BELOW the backend container\u0027s memory\n# limit in docker-compose.yml or the kernel OOM-kills the container (exit 137)\n# once the heap grows past the cgroup limit. Sized for the 8 GB VPS (upgraded\n# 2026-07-14): compose limit is now 2G, so 1536 MB heap ≈ 75%, leaving ~512 MB\n# for non-heap (buffers, sharp, the embeddings ONNX model, stack, code).\n# Raise BOTH this value and the compose memory limit together if you grow it.\nENV NODE_OPTIONS=--max-old-space-size=1536', 'bash')}
<p>Chú thích đó là toàn bộ phương pháp: giới hạn container 2G; heap 75% của nó; ~512 MB còn lại cho Buffer, thư viện ảnh, một model embeddings ONNX, stack của luồng và mã; và hai con số luôn đi cùng nhau. Hãy đo phần ngoài heap (<code>rss − heapTotal</code> dưới tải thật) trước khi chọn tỉ lệ.</p>

<h3>JVM cũng đọc cgroup</h3>
${run('c85-host', 'docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XshowSettings', 1)}
${run('c85-host', 'docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:+PrintFlags', 1)}
${run('c85-host', 'docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:MaxRAMPercentage=75', 1)}
<p>Java 21 thấy giới hạn cgroup v2 (512 MiB) và mặc định cho heap <strong>25%</strong>: <code>MaxHeapSize</code> 134.217.728 = 128 MiB. An toàn, nhưng ba phần tư container bị bỏ trống cho một heap không dùng được chúng. <code>-XX:MaxRAMPercentage=75</code> biến nó thành 402.653.184 = 384 MiB và tiếp tục co giãn nếu giới hạn đổi. (Các bản Java 8 cũ trước 8u191 bỏ qua cgroup và chọn heap theo RAM của máy chủ — gốc rễ của rất nhiều chuyện kinh dị "Java trong Docker".)</p>

<h3>137 hay OutOfMemoryError: bạn chọn</h3>
${src('ch08/Hog.java', 'java')}
${run('c85-host', 'docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -Xmx1g', 2)}
${run('c85-host', 'docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 Hog', 2)}
${run('c85-host', 'docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 -XX:+Exit', 1)}
<ul>
<li><code>-Xmx1g</code> trong hộp 256 MiB: JVM tưởng mình được dùng 989 MB, phình quá 192 MB heap và bị nhân giết: <strong>137</strong>, không stack trace.</li>
<li><code>MaxRAMPercentage=75</code>: heap tối đa 185 MB; tới 160 MB JVM ném <code>java.lang.OutOfMemoryError: Java heap space</code> kèm số dòng (<code>Hog.java:13</code>) và thoát <strong>1</strong>. Đọc được.</li>
<li>thêm <code>-XX:+ExitOnOutOfMemoryError</code>: "Terminating due to …", thoát <strong>3</strong>. Trên production thường bạn muốn cái này: một OOME để lại JVM ở trạng thái không rõ, và một lần thoát gọn cho phép Docker hay Kubernetes khởi động lại nó.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Đừng bao giờ chép -Xmx từ laptop vào container.</strong> <code>-Xmx1g</code> ổn trên máy 16 GB; trong một pod 256 MiB nó biến mọi vấn đề heap thành một 137 im lặng. Hãy dùng <code>MaxRAMPercentage</code> để heap đi theo hộp, và giữ nó ở 70–80%, không phải 100%: metaspace, vùng mã của JIT, một stack cho mỗi luồng nền tảng (tới 1 MB mỗi luồng với <code>-Xss</code> mặc định), direct buffer của NIO và cấu trúc riêng của bộ gom rác đều nằm ngoài heap. Một ứng dụng Spring Boot có 200 luồng Tomcat cần phần chừa đó.</p>
</div>

<h3>Kubernetes: request để xếp lịch, limit để giết</h3>
<p>Cùng những ý đó, ở tầng cao hơn (khái niệm — lab này không có cụm):</p>
<ul>
<li><strong><code>resources.requests.memory</code></strong> dành cho bộ xếp lịch: pod chỉ được đặt lên một node còn chừng đó bộ nhớ chưa ai xin. Nó không bị ép như một cái trần.</li>
<li><strong><code>resources.limits.memory</code></strong> trở thành <code>memory.max</code> của container. Vượt nó thì container bị nhân OOM kill: trạng thái <code>OOMKilled</code>, mã thoát 137, và pod khởi động lại.</li>
<li><strong>Lớp QoS đặt oom_score_adj</strong>: Guaranteed (requests = limits) được −997; BestEffort (không đặt gì) là 1000; Burstable là 1000 − 1000 × request / bộ nhớ node, kẹp trong 2…999. Khi cả node OOM, pod BestEffort chết trước.</li>
<li><strong>Đuổi pod khi node thiếu bộ nhớ (eviction)</strong>: trước khi nhân phải giết, kubelet theo dõi bộ nhớ của node và đuổi các pod dùng nhiều hơn mức đã xin (ngưỡng cứng mặc định <code>memory.available &lt; 100Mi</code>). Và trên cgroup v2, từ Kubernetes 1.28 kubelet đặt <code>memory.oom.group = 1</code>, nên một lần OOM giết cả container chứ không chỉ một tiến trình của nó.</li>
</ul>
<p>Quy tắc thực tế: đặt request bằng mức dịch vụ thật sự dùng khi tải bình thường và limit bằng đỉnh đo được cộng phần dư; với bất cứ thứ gì có trạng thái, cho hai số bằng nhau (Guaranteed).</p>
${lab('cgroup', 'restart', 'vi', 'Một pod vượt giới hạn nhìn từ bên trong: OOM kill, khởi động lại, OOM kill — CrashLoopBackOff với log trống. Hãy đọc lý do restart, đừng đọc log.')}

<h3>Giết theo áp lực, trước khi nhân phải ra tay</h3>
<p>Bài 8.2 và 8.4 cho thấy điểm yếu của OOM killer trong nhân: nó chỉ hành động khi không còn gì thu hồi được, nên một hệ thống đang thrash hay bị hãm tốc có thể bò nhiều phút trước đó. Các bộ giết ở không gian người dùng ra tay sớm hơn:</p>
<ul>
<li><strong>systemd-oomd</strong> theo dõi PSI của từng cgroup (mặc định: giết khi áp lực bộ nhớ ở trên 60% suốt 30 giây, với các unit chọn tham gia bằng <code>ManagedOOMMemoryPressure=kill</code>) và mức dùng swap, rồi giết cả một cgroup. Fedora và Ubuntu bản desktop bật sẵn nó.</li>
<li><strong>earlyoom</strong> là một daemon nhỏ xíu: SIGTERM tiến trình lớn nhất khi bộ nhớ available <em>và</em> swap trống đều tụt dưới 10%, SIGKILL khi dưới 5%.</li>
</ul>
<p>Ý tưởng gói gọn trong bảy dòng bash. Ở đây nó canh tiến trình đọc file đang thrash của bài 8.2 (không swap, 128 MiB) và giết nó khi <code>some avg10</code> đạt 20%:</p>
${run('c85-lim', './ws 200 50', 3)}
<p>Áp lực tăng dần khi trung bình 10 giây đuổi kịp — 4%, 9%, 13%, 17%, 20,4% — và ở giây thứ mười bộ canh của ta giết tiến trình đọc. <code>oom_kill</code> vẫn là 1, con số còn lại từ bài thử Buffer: <strong>nhân không hề quyết định giết gì</strong>, và nếu không có bộ canh, tiến trình đọc này sẽ bò mãi với một phút mỗi lượt. Đó là khoảng trống mà systemd-oomd lấp trên máy desktop và cơ chế eviction của Kubernetes lấp trên cụm.</p>
${lab('vm', 'loop', 'vi', 'Một giới hạn chỉ thiếu đúng một khung: vòng lặp qua 5 trang fault ở mọi lần tham chiếu khi có 4 khung. Giới hạn quá chặt tạo ra cơn bò mà các bộ giết theo áp lực sinh ra để xử lý.', { tour: 'vm-thrash' })}

<h3>Quá chặt cũng gây hại</h3>
<p>Các giới hạn dự án này đang chạy, lấy từ <code>docker-compose.yml</code>: postgres 2G, redis 512M (kèm <code>--maxmemory 256mb</code> bên trong, nên Redis tự đuổi khoá từ lâu trước khi cgroup giết nó), backend 2G (heap 1536), frontend 2G, tts 2560M, coturn và nginx mỗi cái 256M. Giới hạn của tts là ví dụ tốt về cách chọn cỡ: chú thích trong compose ghi lại mức đo được 973 MB lúc đọc văn bản, nâng lên 2,5G vì nhân bản giọng còn nạp thêm torch và torchaudio. Quy tắc kinh nghiệm:</p>
<ul>
<li>giới hạn = <code>memory.peak</code> đo được dưới tải thật + 20–30% phần dư;</li>
<li>một giới hạn sát working set không hỏng nhanh — nó thrash (bài 8.2: ~1 ms mỗi trang, oom 0);</li>
<li>cảnh báo theo PSI hoặc đặt <code>memory.high</code> dưới <code>memory.max</code>, để áp lực lộ ra trước cú giết;</li>
<li>giữ tổng mọi giới hạn dưới RAM của máy, không thì khi cả máy cạn, các cgroup chẳng bảo vệ được ai.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm bạn chuyển API Spring Boot và worker Node vào container, mỗi cái 512 MiB. Dịch vụ Java được chạy với <code>-Xmx1g</code> "như trên laptop", và worker Node thu phóng ảnh bằng Buffer. Trước khi deploy, hãy chứng minh thiết lập nào sẽ chết ra sao.</p>
<ol>
<li>Với <code>--memory 512m</code>, đọc heap mặc định của Node (<code>node -p "require('v8').getHeapStatistics().heap_size_limit"</code>) và của Java (<code>-XX:+PrintFlagsFinal</code>).</li>
<li>Chạy <code>Hog</code> với <code>-Xmx1g</code>, rồi với <code>-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError</code>. Ghi mã thoát.</li>
<li>Chạy <code>buf.js</code> với <code>--max-old-space-size=256</code>. Nó bị giết ở RSS bao nhiêu, và lúc đó <code>heapUsed</code> là bao nhiêu?</li>
<li>Viết hai dòng bạn sẽ đặt vào mỗi Dockerfile và giới hạn bộ nhớ trong compose, kèm một câu về phần chừa cho bộ nhớ ngoài heap.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có ba mã thoát đã đo (137, 1 hoặc 3, 137 cho buf.js) với nguyên nhân cạnh mỗi cái, và một ghi chú chọn cỡ dạng "giới hạn X, heap Y (Z%), phần ngoài heap đo được W".</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['memory.max / memory.swap.max', 'Giới hạn RAM cứng / giới hạn swap của một cgroup; Docker --memory và (--memory-swap − --memory).'],
  ['memory.low', 'Bảo vệ mềm: chỉ bị thu hồi sau các cgroup khác; Docker --memory-reservation.'],
  ['--max-old-space-size', 'Trần heap V8 tính bằng MB; mặc định của Node 22 ≈ nửa giới hạn cgroup, không dưới 259 MB.'],
  ['external memory (bộ nhớ ngoài heap)', 'Bộ nhớ chương trình JS dùng ngoài heap V8: Buffer, typed array, addon native.'],
  ['MaxRAMPercentage', 'Heap JVM tính theo phần trăm giới hạn container (mặc định 25%); thường đặt 70–80.'],
  ['ExitOnOutOfMemoryError', 'Cờ JVM: thoát (mã 3) ngay OOME đầu tiên để bộ điều phối khởi động lại một tiến trình sạch.'],
  ['requests vs limits', 'Kubernetes: phần bộ xếp lịch giữ chỗ vs memory.max kích hoạt OOMKilled.'],
  ['systemd-oomd / earlyoom', 'Bộ giết ở không gian người dùng, hành động theo áp lực hoặc bộ nhớ trống thấp, trước OOM killer của nhân.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>--memory</code> → memory.max; không có <code>--memory-swap</code> thì container được thêm chừng đó swap; <code>--memory-swappiness</code> bị bỏ qua trên cgroup v2.</li>
<li>Heap mặc định của Node 22 ≈ ½ giới hạn với sàn 259 MB — lớn hơn một hộp 256 MiB; Buffer nằm ngoài nó.</li>
<li>Chọn cỡ như backend của dự án: heap 1536 trong container 2G, ~512 MB cho phần ngoài heap, đổi thì đổi cả hai.</li>
<li>JVM: MaxRAMPercentage 75 biến một 137 im lặng thành OutOfMemoryError (exit 1) hoặc một lần thoát gọn mã 3.</li>
<li>Kubernetes: request để xếp lịch, limit để giết; systemd-oomd, earlyoom và eviction của kubelet ra tay theo áp lực trước nhân.</li>
</ul>
${L('https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/', '☸️', 'Kubernetes — Resource management for pods and containers', 'Requests vs limits, và chuyện gì xảy ra khi container vượt giới hạn bộ nhớ.', 'Mở')}
${L('https://www.freedesktop.org/software/systemd/man/latest/systemd-oomd.service.html', '🐧', 'systemd-oomd.service', 'Bộ giết OOM ở không gian người dùng dựa trên PSI và swap, cùng các thiết lập của nó.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 8.6 — Quiz ───────────────────────── */
    {
      title: '8.6 — Chapter 8 check|||8.6 — Kiểm tra Chương 8',
      slug: 'os-8-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về áp lực bộ nhớ: free vs available, free trong container, thrashing, swappiness, thrashing không swap và PSI, OOM killer chọn ai, oom_score, exit 0 kèm OOMKilled, exit 133/134/137, và -Xmx trong container.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>When memory runs short, can you say what is happening — and who will die?</h2>
<p class="lead">Ten scenario questions, each built on a number measured in this chapter. Most give you an output and ask what it means, because in an incident the first mistake is reading the wrong memory number or blaming the wrong process.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read free, /proc/meminfo and a cgroup’s memory.stat, and say whether a box is really short of memory.</li>
<li>I can explain swap, swappiness and thrashing, and read PSI.</li>
<li>I can predict which process the OOM killer will choose and change it with oom_score_adj.</li>
<li>I can tell exit 137 from 134/133, and know why a container can exit 0 with OOMKilled=true.</li>
<li>I can size the heap of Node and the JVM inside a container limit.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Khi bộ nhớ thiếu, bạn có nói được chuyện gì đang xảy ra — và ai sẽ chết không?</h2>
<p class="lead">Mười câu tình huống, câu nào cũng dựng trên một con số đã đo trong chương này. Phần lớn đưa cho bạn một output và hỏi nó nghĩa là gì, vì khi có sự cố, sai lầm đầu tiên thường là đọc nhầm con số bộ nhớ hoặc đổ lỗi nhầm tiến trình.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được free, /proc/meminfo và memory.stat của một cgroup, và nói được máy có thật sự thiếu bộ nhớ không.</li>
<li>Tôi giải thích được swap, swappiness và thrashing, và đọc được PSI.</li>
<li>Tôi đoán được OOM killer sẽ chọn tiến trình nào và đổi được điều đó bằng oom_score_adj.</li>
<li>Tôi phân biệt được exit 137 với 134/133, và biết vì sao container có thể thoát 0 mà OOMKilled=true.</li>
<li>Tôi chọn được cỡ heap của Node và JVM trong giới hạn của container.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'On the team’s 8 GB VPS, <code>free -m</code> shows <code>free 120</code>, <code>buff/cache 5100</code>, <code>available 5300</code>. A teammate wants to buy a bigger plan today. What do you answer?|||Trên VPS 8 GB của nhóm, <code>free -m</code> hiện <code>free 120</code>, <code>buff/cache 5100</code>, <code>available 5300</code>. Một bạn muốn mua gói lớn hơn ngay hôm nay. Bạn trả lời gì?',
            options: ['Yes — only 120 MB is free, the server is about to run out|||Đúng — chỉ còn 120 MB free, máy sắp cạn', 'No — most of the RAM is page cache that the kernel reclaims on demand; available 5.3 GB is what new programs can get|||Không — phần lớn RAM là page cache nhân thu hồi khi cần; available 5,3 GB mới là lượng chương trình mới lấy được', 'Run drop_caches every hour so free stays high|||Chạy drop_caches mỗi giờ để free luôn cao', 'Add swap: free is low because swap is missing|||Thêm swap: free thấp vì thiếu swap'],
            correctIndex: 1, points: 1,
            explanation: 'EN: free counts RAM holding nothing; the kernel deliberately fills idle RAM with page cache. In our test, reading 1 GB moved 827 MiB from free to cache while available moved 13 MiB, and drop_caches gave free back without changing available. drop_caches only throws away cached work; swap has nothing to do with a low free column.|||VI: free đếm RAM không chứa gì; nhân cố ý lấp RAM rảnh bằng page cache. Trong phép thử của ta, đọc 1 GB chuyển 827 MiB từ free sang cache trong khi available chỉ nhích 13 MiB, và drop_caches trả lại free mà available không đổi. drop_caches chỉ vứt bỏ công sức đã cache; swap chẳng liên quan gì tới cột free thấp.' },
          { question: 'Inside a container started with <code>--memory 1g</code>, <code>free -m</code> prints <code>total 7934</code>. A Node service sizes its caches from <code>os.totalmem()</code>. What is the problem and where is the real limit?|||Bên trong một container khởi động với <code>--memory 1g</code>, <code>free -m</code> in <code>total 7934</code>. Một dịch vụ Node chọn kích cỡ cache theo <code>os.totalmem()</code>. Vấn đề là gì và giới hạn thật nằm ở đâu?',
            options: ['Docker failed to apply the limit; restart the container|||Docker đã không áp được giới hạn; khởi động lại container', 'The VM has 7.9 GB, so the service may safely use it|||VM có 7,9 GB, nên dịch vụ cứ dùng thoải mái', 'free rounds to the nearest gigabyte|||free làm tròn tới gigabyte gần nhất', '/proc/meminfo is not per container; the limit is in the cgroup — /sys/fs/cgroup/memory.max (and memory.current, memory.stat)|||/proc/meminfo không tách theo container; giới hạn nằm trong cgroup — /sys/fs/cgroup/memory.max (và memory.current, memory.stat)'],
            correctIndex: 3, points: 1,
            explanation: 'EN: free and os.totalmem() read /proc/meminfo, which describes the whole machine. The limit was applied: memory.max read 1,073,741,824 and memory.current stopped right at it while we read 1.2 GB of files. Sizing from the host’s RAM inside a container is how runtimes walk into 137.|||VI: free và os.totalmem() đọc /proc/meminfo, mô tả cả máy. Giới hạn đã được áp: memory.max là 1.073.741.824 và memory.current dừng sát nó khi ta đọc 1,2 GB file. Chọn kích cỡ theo RAM của máy chủ khi ở trong container là cách các runtime tự đi vào 137.' },
          { question: 'In a container with 128 MiB of RAM and 256 MiB of swap, <code>./ws 64 3 rand</code> costs ~12 ns per page; <code>./ws 160 3 rand</code> costs ~30–38 µs per page with 15,000–19,000 major faults per pass. What is happening?|||Trong một container có 128 MiB RAM và 256 MiB swap, <code>./ws 64 3 rand</code> tốn ~12 ns mỗi trang; <code>./ws 160 3 rand</code> tốn ~30–38 µs mỗi trang với 15.000–19.000 major fault mỗi lượt. Chuyện gì đang xảy ra?',
            options: ['Thrashing: the working set is bigger than the RAM, so every pass reads thousands of pages back from swap|||Thrashing: working set lớn hơn RAM, nên mỗi lượt phải đọc lại hàng nghìn trang từ swap', 'The CPU cache is too small for 160 MiB|||Cache CPU quá nhỏ cho 160 MiB', 'The program leaks memory between passes|||Chương trình rò rỉ bộ nhớ giữa các lượt', 'The OOM killer is restarting the program each pass|||OOM killer khởi động lại chương trình mỗi lượt'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Major faults mean pages read from disk or swap, and pswpin confirmed swap-ins. A CPU-cache effect would be nanoseconds, not tens of microseconds, with zero major faults. The program allocates once; and nothing was killed — the same process printed all three passes.|||VI: Major fault nghĩa là trang phải đọc từ đĩa hoặc swap, và pswpin xác nhận có swap vào. Hiệu ứng cache CPU chỉ cỡ nano giây, không phải hàng chục micro giây, và không có major fault. Chương trình chỉ cấp phát một lần; và không có gì bị giết — cùng một tiến trình in cả ba lượt.' },
          { question: 'A process holds 41 MiB of anonymous memory; the container has 39 MiB of file cache. <code>echo "200M swappiness=0" | tee /sys/fs/cgroup/memory.reclaim</code> fails with <code>Resource temporarily unavailable</code>, and afterwards memory.stat shows <code>file 0</code>, anon unchanged, swap 0. Why?|||Một tiến trình giữ 41 MiB bộ nhớ ẩn danh; container có 39 MiB cache file. <code>echo "200M swappiness=0" | tee /sys/fs/cgroup/memory.reclaim</code> hỏng với <code>Resource temporarily unavailable</code>, và sau đó memory.stat cho thấy <code>file 0</code>, anon không đổi, swap 0. Vì sao?',
            options: ['The container has no swap configured|||Container không được cấu hình swap', 'memory.reclaim only works when the cgroup is at memory.max|||memory.reclaim chỉ chạy khi cgroup đang ở memory.max', 'At swappiness 0 only file pages may be reclaimed; it took all of them and refused to swap anonymous memory to reach 200M|||Ở swappiness 0 chỉ trang file được thu hồi; nó lấy hết trang file rồi từ chối swap bộ nhớ ẩn danh để đủ 200M', 'The kernel ignores swappiness on cgroup v2|||Nhân bỏ qua swappiness trên cgroup v2'],
            correctIndex: 2, points: 1,
            explanation: 'EN: The container had 256 MiB of swap, and the very next request, 10M at swappiness=200, swapped 11 MiB of the process out — so swap existed and reclaim worked below the limit. swappiness is the price of anon vs file pages: at 0 anon is not for sale. What cgroup v2 lacks is a per-cgroup swappiness file (Docker’s flag is ignored), not swappiness itself.|||VI: Container có 256 MiB swap, và ngay yêu cầu kế tiếp, 10M ở swappiness=200, đã đẩy 11 MiB của tiến trình ra swap — nên swap có, và thu hồi chạy được khi chưa chạm giới hạn. swappiness là giá của trang anon so với trang file: ở 0 trang anon không được bán. Thứ cgroup v2 thiếu là file swappiness riêng cho từng cgroup (cờ của Docker bị bỏ qua), không phải bản thân swappiness.' },
          { question: 'A 128 MiB container with no swap reads a 200 MiB file at random: ~1 ms per page, a minute per pass. memory.pressure shows <code>some avg10=34.87</code>, and memory.events shows <code>oom 0</code>. What is the right reading?|||Một container 128 MiB không swap đọc ngẫu nhiên một file 200 MiB: ~1 ms mỗi trang, một phút mỗi lượt. memory.pressure hiện <code>some avg10=34.87</code>, còn memory.events hiện <code>oom 0</code>. Đọc thế nào là đúng?',
            options: ['Thrashing on file pages: everything is reclaimable, so the kernel never OOM-kills, while 35% of the time is lost to memory stalls — a job for PSI alerts or a pressure-based killer|||Thrashing trên trang file: mọi thứ đều thu hồi được, nên nhân không bao giờ OOM kill, trong khi 35% thời gian bị mất vì kẹt bộ nhớ — việc của cảnh báo PSI hoặc bộ giết theo áp lực', 'The disk is slow; memory is not involved because oom is 0|||Đĩa chậm; bộ nhớ không liên quan vì oom bằng 0', 'Turn swap on: thrashing without swap is impossible|||Bật swap: không thể thrashing khi không có swap', 'PSI 35% means 35% of RAM is used|||PSI 35% nghĩa là đã dùng 35% RAM'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Our run re-read evicted pages 91 million times and memory.events counted 1.78 million limit hits with oom 0 — the OOM killer only acts when nothing can be reclaimed, and clean file pages always can. PSI some is the share of time at least one task was stalled on memory, not a RAM percentage. The "slow disk" reading misses that the disk is slow only because the cache is too small.|||VI: Lần chạy của ta đọc lại các trang vừa bị đuổi 91 triệu lần và memory.events đếm 1,78 triệu lần chạm giới hạn mà oom 0 — OOM killer chỉ ra tay khi không còn gì thu hồi được, mà trang file sạch thì luôn thu hồi được. PSI some là tỉ lệ thời gian ít nhất một tác vụ bị kẹt vì bộ nhớ, không phải phần trăm RAM. Cách đọc "đĩa chậm" bỏ sót rằng đĩa chỉ chậm vì cache quá nhỏ.' },
          { question: 'In a 256 MiB container without swap, a process named postgres holds 140 MiB (oom_score_adj 0). A process named api grows to 200 MiB. Which process is killed, and why?|||Trong một container 256 MiB không swap, một tiến trình tên postgres giữ 140 MiB (oom_score_adj 0). Một tiến trình tên api phình lên 200 MiB. Tiến trình nào bị giết, và vì sao?',
            options: ['api — the OOM killer always kills the process that triggered the shortage|||api — OOM killer luôn giết tiến trình gây ra sự thiếu hụt', 'api — it is the newest process|||api — nó là tiến trình mới nhất', 'postgres — at the moment of OOM it had the largest rss + swap + page tables (36,219 pages vs 29,243), and both had adj 0|||postgres — lúc OOM nó có rss + swap + bảng trang lớn nhất (36.219 trang so với 29.243), và cả hai đều adj 0', 'Both — a cgroup OOM always kills every process in the group|||Cả hai — OOM của cgroup luôn giết mọi tiến trình trong nhóm'],
            correctIndex: 2, points: 1,
            explanation: 'EN: dmesg named api as the one that "invoked oom-killer" and postgres as "Killed process". The kernel ranks by memory freed per kill, not by guilt or age; api then finished its 200 MiB with exit 0. Killing the whole group happens only with memory.oom.group = 1, which Docker leaves at 0.|||VI: dmesg ghi api là kẻ "invoked oom-killer" và postgres là "Killed process". Nhân xếp hạng theo lượng bộ nhớ giải phóng được mỗi cú giết, không theo tội hay tuổi; sau đó api làm xong 200 MiB và thoát 0. Giết cả nhóm chỉ xảy ra khi memory.oom.group = 1, mà Docker để 0.' },
          { question: '<code>cat /proc/self/oom_score_adj /proc/self/oom_score</code> in a tiny shell prints <code>0</code> and <code>666</code>. Why is the score 666 and not close to 0?|||<code>cat /proc/self/oom_score_adj /proc/self/oom_score</code> trong một shell bé xíu in <code>0</code> và <code>666</code>. Vì sao điểm là 666 chứ không gần 0?',
            options: ['The shell is using two thirds of RAM|||Shell đang dùng hai phần ba RAM', '666 is a random value assigned at fork|||666 là giá trị ngẫu nhiên gán lúc fork', 'Containers add 666 to every process|||Container cộng 666 cho mọi tiến trình', 'The kernel prints (1000 + oom_score_adj + memory‰) × 2/3, so a process using almost nothing with adj 0 shows ~666|||Nhân in (1000 + oom_score_adj + phần nghìn bộ nhớ) × 2/3, nên một tiến trình gần như không dùng gì với adj 0 hiện ~666'],
            correctIndex: 3, points: 1,
            explanation: 'EN: The printed scale runs from 0 (adj −1000) to 1333 (adj +1000 using everything). Our 140 MiB postgres on 8.7 GiB of RAM + swap showed (1000 + 15) × 2/3 = 676, and 0 after oom_score_adj −1000. Nothing about it is random or container-specific.|||VI: Thang được in chạy từ 0 (adj −1000) tới 1333 (adj +1000 và dùng hết). postgres 140 MiB của ta trên 8,7 GiB RAM + swap hiện (1000 + 15) × 2/3 = 676, và 0 sau khi oom_score_adj −1000. Không có gì ngẫu nhiên hay riêng cho container ở đây.' },
          { question: 'A CI container runs a bash script that starts two builds in parallel. The job is green: the container exited 0. But <code>docker inspect</code> shows <code>OOMKilled=true ExitCode=0</code>. What happened?|||Một container CI chạy một script bash khởi động hai bản build song song. Job xanh: container thoát 0. Nhưng <code>docker inspect</code> hiện <code>OOMKilled=true ExitCode=0</code>. Chuyện gì đã xảy ra?',
            options: ['Docker reports OOMKilled=true whenever the memory limit is set|||Docker báo OOMKilled=true bất cứ khi nào có đặt giới hạn bộ nhớ', 'A child process was OOM-killed inside the container’s cgroup while PID 1 (the bash script) survived and exited 0|||Một tiến trình con bị OOM kill trong cgroup của container trong khi PID 1 (script bash) sống sót và thoát 0', 'The kernel retried the build after the OOM|||Nhân đã chạy lại bản build sau OOM', 'OOMKilled=true with exit 0 means the OOM was prevented|||OOMKilled=true với exit 0 nghĩa là OOM đã được ngăn chặn'],
            correctIndex: 1, points: 1,
            explanation: 'EN: In our parallel run both builds died with 137 inside the container, bash printed their codes and ended normally, and Docker still flagged OOMKilled=true. The sequential run of the same work showed OOMKilled=false, so the flag is not automatic. Nothing retries a killed process for you.|||VI: Trong lần chạy song song của ta, cả hai bản build chết với 137 bên trong container, bash in mã của chúng rồi kết thúc bình thường, và Docker vẫn gắn OOMKilled=true. Lần chạy tuần tự cùng khối việc hiện OOMKilled=false, nên cờ này không tự động. Không có gì chạy lại tiến trình bị giết giùm bạn.' },
          { question: '<code>node --max-old-space-size=64 grow.js</code> as the container’s PID 1 prints <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code> and exits <strong>133</strong>; with <code>docker run --init</code> it exits 134. Why 133?|||<code>node --max-old-space-size=64 grow.js</code> làm PID 1 của container in <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code> và thoát <strong>133</strong>; với <code>docker run --init</code> nó thoát 134. Vì sao 133?',
            options: ['V8 hit its own heap limit and called abort(); as PID 1 the process ignores its own SIGABRT, so glibc fell back to a trap instruction — SIGTRAP (5), 128 + 5 = 133 on this arm64 machine|||V8 chạm trần heap của chính nó và gọi abort(); là PID 1, tiến trình bỏ qua SIGABRT của chính mình, nên glibc lùi về một lệnh bẫy — SIGTRAP (5), 128 + 5 = 133 trên máy arm64 này', 'The kernel OOM killer killed node with a different signal because it was PID 1|||OOM killer của nhân giết node bằng một tín hiệu khác vì nó là PID 1', '133 means the container ran out of memory|||133 nghĩa là container hết bộ nhớ', 'Node exits 133 whenever it is started without --init|||Node luôn thoát 133 khi khởi động không có --init'],
            correctIndex: 0, points: 1,
            explanation: 'EN: The FATAL ERROR line proves it was V8’s heap limit (the container had 512 MiB), not the kernel, whose OOM kill is always SIGKILL = 137 and prints nothing. Signals with default action are not delivered to PID 1 in its namespace, so abort()’s SIGABRT did nothing and the trap instruction did. Node without --init exits normally (0) when nothing goes wrong.|||VI: Dòng FATAL ERROR chứng tỏ đó là trần heap của V8 (container có 512 MiB), không phải nhân — cú OOM kill của nhân luôn là SIGKILL = 137 và không in gì. Tín hiệu có hành động mặc định không được giao cho PID 1 trong namespace của nó, nên SIGABRT của abort() không làm gì và lệnh bẫy mới có tác dụng. Node không có --init vẫn thoát bình thường (0) khi không có gì hỏng.' },
          { question: 'A Spring Boot service is moved into a 256 MiB container with the <code>-Xmx1g</code> it used on a laptop. It dies with 137 and no stack trace. Which change makes it fail readably instead?|||Một dịch vụ Spring Boot được chuyển vào container 256 MiB với <code>-Xmx1g</code> đã dùng trên laptop. Nó chết với 137 và không có stack trace. Thay đổi nào khiến nó hỏng một cách đọc được?',
            options: ['Raise -Xmx to 2g so the heap never fills|||Nâng -Xmx lên 2g để heap không bao giờ đầy', 'Add --memory-swappiness 0 to the container|||Thêm --memory-swappiness 0 cho container', 'Replace -Xmx with -XX:MaxRAMPercentage=75 (and -XX:+ExitOnOutOfMemoryError): the heap fits inside the container, so it throws OutOfMemoryError (exit 1) or exits cleanly with 3|||Thay -Xmx bằng -XX:MaxRAMPercentage=75 (và -XX:+ExitOnOutOfMemoryError): heap vừa trong container, nên nó ném OutOfMemoryError (exit 1) hoặc thoát gọn với mã 3', 'Set oom_score_adj −1000 on the JVM|||Đặt oom_score_adj −1000 cho JVM'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured: -Xmx1g let the heap grow past 192 MB and the kernel killed it (137); MaxRAMPercentage=75 gave a 185 MB heap, an OutOfMemoryError at Hog.java:13 and exit 1; adding ExitOnOutOfMemoryError gave exit 3. A bigger -Xmx goes further past the limit; --memory-swappiness is ignored on cgroup v2; and −1000 on the only process leaves the OOM killer no victim, so the group stays stuck instead of failing cleanly.|||VI: Đã đo: -Xmx1g để heap phình quá 192 MB và nhân giết nó (137); MaxRAMPercentage=75 cho heap 185 MB, một OutOfMemoryError tại Hog.java:13 và exit 1; thêm ExitOnOutOfMemoryError cho exit 3. -Xmx lớn hơn chỉ vượt giới hạn xa hơn; --memory-swappiness bị bỏ qua trên cgroup v2; và −1000 cho tiến trình duy nhất khiến OOM killer không còn nạn nhân, nên nhóm bị kẹt thay vì hỏng gọn.' },
        ],
      },
    },
  ],
};
