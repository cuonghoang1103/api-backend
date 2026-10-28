/**
 * Operating Systems for Developers — Chương 7: Bộ nhớ — bộ nhớ ảo và phân trang (soạn 28/10/2026 theo _HOP-DONG.md).
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch07/*.sh → lab/out/c71-kgdc, c72-trang, c73-fault, c74-cap-phat) và trong
 * một container vứt đi `redis:7` (os-redis7 → lab/out/c73-redis) — cùng bộ chạy `phien`.
 * Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, VM 7,9 GB, nhân 7.0 linuxkit, trang 4 KiB, bảng trang 4 cấp,
 * THP = always), gcc 15 / glibc 2.43, Java 21, Node 22, Redis 7.4.
 *
 * Chạy lại output (từ thư mục lab/):
 *   docker run --rm --label oslab=1 --hostname oslab [cờ] -v "$PWD/code/ch07":/lab/ch07 -w /lab/ch07 os-lab bash -c "phien <kb>.sh 2>&1" > out/<kb>.out.txt
 *   cờ: c71-kgdc --security-opt seccomp=unconfined (setarch -R) · c72-trang, c73-fault --cap-add SYS_ADMIN --cap-add PERFMON
 *       --security-opt seccomp=unconfined (PFN trong pagemap + perf) · c74-cap-phat: không cờ
 *   c73-redis: xem dòng đầu lab/code/ch07/c73-redis.sh (redis:7, gắn phien.sh).
 * Ranh giới: page cache / swap / OOM / giới hạn bộ nhớ container chỉ TRỎ sang Chương 8.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G71 from './giang/os-07-1.mjs';
import G72 from './giang/os-07-2.mjs';
import G73 from './giang/os-07-3.mjs';
import G74 from './giang/os-07-4.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OSG31 = '/courses/operating-systems/learn?lessonSlug=osg202-3-1-phan-trang';
const OSG32 = '/courses/operating-systems/learn?lessonSlug=osg202-3-2-thay-trang';
const OSG33 = '/courses/operating-systems/learn?lessonSlug=osg202-3-3-tlb-dia-chi';

export default {
  title: 'Chapter 7 — Memory: virtual memory and paging|||Chương 7 — Bộ nhớ: bộ nhớ ảo và phân trang',
  description: 'Mỗi tiến trình tưởng mình có cả bộ nhớ: bố cục stack/heap/data/text/mmap đọc từ /proc/<pid>/maps và pmap, ASLR bật/tắt, RSS vs VSZ vs PSS; phân trang, bảng trang 4 cấp, TLB và huge page đo thật; page fault minor/major, nạp trang theo yêu cầu, copy-on-write sau fork kiểu Redis BGSAVE, mmap vs read, thay trang FIFO/LRU/Clock; rồi malloc, arena, phân mảnh, bộ gom rác của V8 và JVM, và săn rò rỉ bằng valgrind/ASan/heap của Node.',
  lessons: [
    /* ───────────────────────── 7.1 — Address spaces ───────────────────────── */
    {
      title: '7.1 — Address spaces: stack, heap, code, mmap, ASLR — and RSS vs VSZ vs PSS|||7.1 — Không gian địa chỉ: stack, heap, code, mmap, ASLR — và RSS vs VSZ vs PSS',
      slug: 'os-7-1-khong-gian',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một chương trình C in địa chỉ của từng vùng nhớ; đọc /proc/<pid>/maps và pmap -x; ASLR bật/tắt bằng setarch -R và -no-pie; stack 8 MiB chết ở độ sâu 7.941 với exit 139; VSZ 4,8 GB của JVM so với RSS 77 MB; và vì sao cộng RSS bốn worker ra 801 MiB trong khi PSS nói thật là 200.',
      content: `${G71}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Every process thinks it owns the whole memory</h2>
<p class="lead">Your Node server, your PostgreSQL and your shell can all have a variable at the very same address — and never touch each other's data. <code>ps</code> says your Java service uses 4.8 GB while the machine has 2 GB free and nothing is swapping. Your monitoring dashboard adds up the memory of four workers and gets more than the machine has. All three puzzles have one answer: every process lives in its own <strong>virtual address space</strong>, and the numbers you read are counting different things. This lesson draws that space, region by region, from a real process — then tells you which memory number to believe.</p>

<h3>One program, nine addresses</h3>
<p>The quickest way to see an address space is to ask a program where its things are. This one creates one thing in every region — code, a read-only string, an initialised global, a zero global, a small and a big <code>malloc</code>, a file mapping, a library function, a local variable — and prints each address:</p>
${src('ch07/layout.c', 'c')}
${run('c71-kgdc', 'uname -m', 1)}
${run('c71-kgdc', './layout', 1)}
<p>Read it from the bottom up, because addresses grow upward:</p>
<ul>
<li><strong>text</strong> (<code>0xaaaa…0b68</code>) — the machine code of <code>main</code>. Right after it, <strong>rodata</strong>: the constant string <code>"hello"</code>. Both come straight from the executable file and are read-only.</li>
<li><strong>data</strong> and <strong>bss</strong> (<code>0xaaaa…0010</code>, <code>…0024</code>) — globals. <code>.data</code> holds the ones with an initial value (42 is stored in the file); <code>.bss</code> holds the zero ones (the file only records "this many zero bytes").</li>
<li><strong>heap</strong> (<code>0xaaaa d608…</code>) — <code>malloc(32)</code>. The heap starts just above the program and grows upward.</li>
<li>a long empty gap, then the <strong>mmap region</strong> (<code>0xffff bd…</code>): the 8 MiB <code>malloc</code>, the mapped file <code>/etc/hostname</code> and <code>printf</code> inside the C library. Anything big, any library, any file you map lands here.</li>
<li><strong>stack</strong> (<code>0xffff e4b1…</code>) — the local variable, near the very top, growing <em>down</em>.</li>
</ul>
<p>Two facts hide in those numbers. First, every address fits in 48 bits (<code>0xffff ffff ffff</code> is the top): on x86-64 and on this arm64 machine a user process gets 2<sup>48</sup> bytes = 256 TiB of addresses, on a VM with 7.9 GB of RAM. Second, nothing here is a RAM address. The CPU and the kernel translate each one, page by page, to wherever the data really sits (lesson 7.2) — which is why two processes can both use <code>0xaaaa…0010</code> without colliding. Click through the same regions, then re-run the program with ASLR on and off:</p>
${lab('memory', 'layout', 'en', 'text, data, bss, heap, mmap and stack of one process, with the addresses a real run prints. Toggle ASLR and press "Run the program again".')}

<h3>The kernel's own map: /proc/&lt;pid&gt;/maps and pmap</h3>
<p>The program can print its own map (this is a second run, so the numbers differ — keep that in mind for the ASLR section):</p>
${run('c71-kgdc', './layout maps', 1)}
<p>Each line is one <strong>mapping</strong> (the kernel calls it a VMA, virtual memory area): an address range, permissions, the offset in the file, the device and inode, and the file name. Things to spot:</p>
<ul>
<li>the program file <code>/lab/ch07/layout</code> appears three times: <code>r-xp</code> (code — executable, never writable), <code>r--p</code> (read-only data), <code>rw-p</code> (globals). The kernel enforces these: writing to code is a SIGSEGV, not a silent change.</li>
<li><code>libc.so.6</code> appears four times, including a <code>---p</code> region with no permissions at all — a guard gap so that running off the end of one part faults instead of reading the next.</li>
<li><code>[heap]</code>, <code>[stack]</code>, and the <code>[vdso]</code> page you met in Chapter 1 (the clock you can read without a syscall).</li>
<li>a bare <code>rw-p … 0</code> line of 8 MiB + 4 KiB with no name: that is our big <code>malloc</code> — anonymous memory, backed by no file.</li>
</ul>
<p><code>pmap -x</code> shows the same list with one extra, crucial column — how much of each mapping is actually in RAM:</p>
${run('c71-kgdc', 'pmap -x', 1)}
<p>The 8 MiB <code>malloc</code> is 8196 kB <em>mapped</em> but 4 kB <em>resident</em>. libc is 1700 kB mapped, 1060 kB resident. The whole process maps 10.9 MB and holds 1.3 MB of RAM. "Mapped" means "these addresses are valid"; "resident" means "there is a physical page behind them right now". Keep that distinction — the rest of the lesson, and Chapter 8, are built on it.</p>

<h3>ASLR: the map moves every run</h3>
${run('c71-kgdc', 'cat /proc/sys/kernel/randomize_va_space', 1)}
${run('c71-kgdc', 'for i in 1 2 3; do ./layout short', 1)}
<p><code>2</code> means full <strong>ASLR</strong> (address space layout randomisation): program, heap, libraries and stack each get a random base at every <code>exec</code>. Three runs, three different layouts. Now turn it off for one command with <code>setarch -R</code> (it sets a per-process flag; the lab container needs <code>--security-opt seccomp=unconfined</code> to allow it):</p>
${run('c71-kgdc', 'for i in 1 2 3; do setarch -R', 1)}
<p>Identical every time. That is also where the famous <code>0xaaaa…</code> prefix comes from: with randomisation off, Linux loads a position-independent program at roughly two-thirds of the 48-bit space (<code>0xaaaa aaaa 0000</code> here); ASLR then shifts it by a random number of pages. Look at the last three hex digits of <code>main</code>, the heap and libc in all six runs: <code>b68</code>, <code>010</code>, <code>8a0</code> never change. Randomisation moves whole 4 KiB pages, so the offset inside the page stays (only the stack gets an extra small shift inside its page, which is why its last digits do vary) — a detail that matters when you read exploit write-ups in Chapter 13.</p>
<p>ASLR can only move the program itself if it was compiled as <strong>PIE</strong> (position-independent executable). Build it without:</p>
${run('c71-kgdc', 'gcc -O0 -no-pie', 2)}
<p><code>main</code> is now at <code>0x400a6c</code> in every run, while heap, libc and stack still move. A fixed code address is a gift to an attacker (they know where every instruction is), which is why Ubuntu, Debian and Fedora build everything PIE by default. Debuggers turn ASLR off for the program they start — convenient for comparing addresses between runs, and the reason a memory bug sometimes "disappears under gdb".</p>

<h3>The stack is small, and it has a hard edge</h3>
<p>The heap can grow to gigabytes; the main thread's stack is limited by <code>ulimit -s</code>:</p>
${run('c71-kgdc', 'ulimit -s', 1)}
<p>8192 KiB = 8 MiB. This program recurses with 1 KiB of locals per call and catches the crash on a separate emergency stack, so it can say where it died:</p>
${src('ch07/rec.c', 'c')}
${run('c71-kgdc', './rec;', 1)}
${run('c71-kgdc', '(ulimit -s 2048', 1)}
<p>Depth 7,941 — about 8,190 KiB below the first frame — then <strong>SIGSEGV</strong> and exit code <strong>139</strong> = 128 + 11, exactly as in Chapter 1. Below the stack sits a guard area that is not mapped; touching it is a fault the kernel cannot fix, so the process dies. Shrink the limit to 2 MiB and it dies at depth 1,981: the depth is just the limit divided by the frame size. Managed runtimes put their own, smaller limit in front of that edge so they can throw instead of crash:</p>
${run('c71-kgdc', 'node -e', 1)}
${run('c71-kgdc', 'java Deep', 2)}
<p>Node (V8 stops at a stack of about 1 MB by default) throws a catchable <code>RangeError</code>; Java throws <code>StackOverflowError</code>, and <code>-Xss256k</code> — a smaller stack per thread — cuts the depth from 47,616 to 1,629. In backend code this is the "recursive function on user input" bug: a deeply nested JSON body, a comment tree, a self-referencing category. Walk the frames of a real call stack here:</p>
${lab('memory', 'stack', 'en', 'Each call pushes a frame (return address, saved registers, locals); the stack grows down toward the guard area.')}

<div class="pitfall co-tieu-de">
<p><strong>Never recurse on data a user controls without a depth limit.</strong> A JSON parser or a tree walker that recurses once per nesting level dies at a few thousand levels — 7,941 here in C, 9,158 in Node — and in C that is a SIGSEGV that kills the whole server process, not one request. Cap the depth (most JSON libraries have an option), or rewrite the walk with an explicit stack/queue on the heap.</p>
</div>

<h3>VSZ, RSS, PSS — which memory number to believe</h3>
<p>Ask for 1 GiB, write only 100 MiB of it:</p>
${src('ch07/reserve.c', 'c')}
${run('c71-kgdc', './reserve 1024 100', 1)}
${run('c71-kgdc', 'ps -o pid,vsz,rss,comm', 1)}
<p><code>malloc(1 GiB)</code> moved <strong>VSZ</strong> (<code>VmSize</code>, virtual size: all mapped addresses) up by a gigabyte and <strong>RSS</strong> (<code>VmRSS</code>, resident set size: pages in RAM) by nothing. Writing 100 MiB moved RSS by 100 MiB. RAM is handed out page by page on first touch — the mechanism, the page fault, is lesson 7.3. Real runtimes rely on this all the time:</p>
${run('c71-kgdc', 'ps -o pid,vsz,rss,nlwp,comm', 1)}
<p>An idle Node process: 485 MB VSZ, 45 MB RSS. An idle JVM: <strong>4.8 GB VSZ</strong>, 77 MB RSS, 18 threads. The JVM reserved address space for its maximum heap (a quarter of RAM by default — lesson 7.4), its code cache and every thread's stack, up front; it costs nothing until used. VSZ tells you almost nothing about memory use. RSS is the right number for <em>one</em> process. But RSS counts every page the process can reach in RAM — including pages it <em>shares</em> with other processes, like libraries, or memory inherited across <code>fork</code>. Add RSS up across processes and you count the shared pages again and again:</p>
${src('ch07/pss.c', 'c')}
${run('c71-kgdc', './pss 200 3', 1)}
<p>One parent wrote 200 MiB and forked three children that never touch it. Every process shows <strong>RSS 200 MiB</strong>; the sum says 801 MiB. But the 200 MiB exist once in RAM — the column <code>Shared</code> says so and <code>Private</code> is 0. <strong>PSS</strong> (proportional set size) splits each shared page evenly between the processes that share it: 200 / 4 = 50 MiB each, and the PSS column <em>adds up</em> to the true 200. That is exactly the shape of a Gunicorn, PHP-FPM, Puma or Node <code>cluster</code> deployment, and of PostgreSQL's backends sharing <code>shared_buffers</code>. The kernel publishes all of these per process in <code>/proc/&lt;pid&gt;/smaps_rollup</code>:</p>
${run('c71-kgdc', "grep -E '^(Rss", 1)}

<div class="pitfall co-tieu-de">
<p><strong>Two classic false alarms.</strong> (1) "The Java service uses 4.8 GB, it must be leaking!" — that is VSZ, reserved address space; look at RSS. (2) "The four workers use 3.2 GB on a 2 GB box!" — that is the sum of RSS, counting shared pages four times; sum PSS instead. Before you page anyone about memory, say which of the three numbers you are looking at.</p>
</div>

<h3>If you have done OSG202 lesson 3.1</h3>
<p>There you saw logical vs physical addresses and why each process gets its own address space, as diagrams. Here is the same thing in a running process: a 48-bit map with real regions and permissions, a layout that moves at every run, and three memory numbers that disagree for good reasons. The exam asks for the vocabulary; production asks you to read <code>maps</code> and <code>smaps_rollup</code>.</p>
${L(OSG31, '🎓', 'OSG202 · 3.1 — Paging &amp; virtual memory', 'Logical vs physical addresses and the address space, as in the course textbook.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your teammate's Grafana panel sums the RSS of the four Gunicorn workers of the API and shows 3.2 GB on a VPS with 2 GB of RAM — and nothing has crashed. The lead asks you whether the panel is wrong and what the real number is.</p>
<ol>
<li>In the lab, compile <code>pss.c</code> and run <code>./pss 200 3</code>, then <code>./pss 200 7</code>. Write down the RSS sum and the PSS sum for each.</li>
<li>Run <code>./layout wait &amp;</code>, then <code>grep -E '^(Rss|Pss|Shared|Private)' /proc/$!/smaps_rollup</code> and <code>pmap -x $!</code>. Which mapping holds most of the resident memory?</li>
<li>Run <code>./layout short</code> three times, then <code>setarch -R ./layout short</code> three times. Which hex digits never change, and why?</li>
<li>Run <code>./rec</code> with <code>ulimit -s 4096</code> in a subshell. Predict the depth before you run it.</li>
</ol>
<p><strong>Done when:</strong> you can explain to the lead, with your two measured tables, why the RSS sum is bigger than RAM, which number to plot instead (PSS), and your <code>ulimit -s 4096</code> prediction was within 5% of the measured depth.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['virtual address space', 'The private range of addresses one process sees (256 TiB here); translated to RAM page by page.'],
  ['mapping / VMA', 'One line of /proc/&lt;pid&gt;/maps: a range with permissions, backed by a file or anonymous.'],
  ['text / data / bss / heap / stack', 'Code; initialised globals; zero globals; malloc memory growing up; call frames growing down.'],
  ['ASLR', 'Random bases for program, heap, libraries and stack at every exec; randomize_va_space = 2.'],
  ['PIE', 'Position-independent executable: lets ASLR move the program code too.'],
  ['VSZ', 'All mapped addresses, touched or not. Says almost nothing about memory use.'],
  ['RSS', 'Pages of the process that are in RAM now, including shared ones.'],
  ['PSS', 'RSS with each shared page divided among its sharers; adds up correctly across processes.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A process sees a private 48-bit address space: text, data/bss, heap (up), a large mmap region (libraries, files, big mallocs), stack (down).</li>
<li><code>/proc/&lt;pid&gt;/maps</code> and <code>pmap -x</code> list every mapping with permissions; "mapped" and "resident" are different numbers.</li>
<li>ASLR moves every region at each run (page-granular, so the last 12 bits stay); <code>-no-pie</code> pins the code.</li>
<li>The 8 MiB stack has a guard edge: 1 KiB frames died at depth 7,941 with exit 139; Node and Java throw first.</li>
<li>VSZ ≠ memory use (JVM: 4.8 GB VSZ, 77 MB RSS); RSS double-counts shared pages (sum 801 MiB vs PSS 200 MiB).</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc_pid_maps.5.html', '📄', 'man 5 proc_pid_maps', 'Every column of /proc/&lt;pid&gt;/maps explained.', 'Open')}
${L('https://www.kernel.org/doc/html/latest/filesystems/proc.html', '🐧', 'kernel.org — The /proc filesystem', 'smaps and smaps_rollup: Rss, Pss, Shared, Private, AnonHugePages.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Tiến trình nào cũng tưởng mình sở hữu cả bộ nhớ</h2>
<p class="lead">Máy chủ Node, PostgreSQL và shell của bạn đều có thể có một biến nằm ở đúng cùng một địa chỉ — mà không bao giờ đụng vào dữ liệu của nhau. <code>ps</code> nói dịch vụ Java dùng 4,8 GB trong khi máy còn trống 2 GB và không có gì bị swap. Bảng giám sát cộng bộ nhớ của bốn worker lại và ra một số lớn hơn RAM của máy. Ba câu đố có chung một lời giải: mỗi tiến trình sống trong <strong>không gian địa chỉ ảo (virtual address space)</strong> của riêng nó, và các con số bạn đọc đang đếm những thứ khác nhau. Bài này vẽ không gian đó, từng vùng một, từ một tiến trình thật — rồi chỉ cho bạn nên tin con số bộ nhớ nào.</p>

<h3>Một chương trình, chín địa chỉ</h3>
<p>Cách nhanh nhất để nhìn thấy một không gian địa chỉ là hỏi chương trình xem đồ của nó nằm ở đâu. Chương trình này tạo đúng một thứ trong mỗi vùng — mã, một chuỗi chỉ-đọc, một biến toàn cục có giá trị đầu, một biến toàn cục bằng 0, một <code>malloc</code> nhỏ và một <code>malloc</code> lớn, một ánh xạ file, một hàm thư viện, một biến cục bộ — rồi in địa chỉ của từng thứ:</p>
${src('ch07/layout.c', 'c')}
${run('c71-kgdc', 'uname -m', 1)}
${run('c71-kgdc', './layout', 1)}
<p>Đọc từ dưới lên, vì địa chỉ tăng dần lên trên:</p>
<ul>
<li><strong>text</strong> (<code>0xaaaa…0b68</code>) — mã máy của <code>main</code>. Ngay sau là <strong>rodata</strong>: chuỗi hằng <code>"hello"</code>. Cả hai lấy thẳng từ file thực thi và chỉ được đọc.</li>
<li><strong>data</strong> và <strong>bss</strong> (<code>0xaaaa…0010</code>, <code>…0024</code>) — biến toàn cục. <code>.data</code> giữ những biến có giá trị đầu (số 42 được lưu trong file); <code>.bss</code> giữ những biến bằng 0 (file chỉ ghi "chừng này byte số 0").</li>
<li><strong>heap (vùng cấp phát)</strong> (<code>0xaaaa d608…</code>) — <code>malloc(32)</code>. Heap bắt đầu ngay trên chương trình và lớn dần lên.</li>
<li>một khoảng trống dài, rồi tới <strong>vùng mmap</strong> (<code>0xffff bd…</code>): <code>malloc</code> 8 MiB, file được ánh xạ <code>/etc/hostname</code> và hàm <code>printf</code> nằm trong thư viện C. Thứ gì to, thư viện nào, file nào bạn ánh xạ đều rơi vào đây.</li>
<li><strong>stack (ngăn xếp)</strong> (<code>0xffff e4b1…</code>) — biến cục bộ, gần sát đỉnh, lớn dần <em>xuống</em>.</li>
</ul>
<p>Hai sự thật nằm trong mấy con số đó. Một, địa chỉ nào cũng vừa trong 48 bit (<code>0xffff ffff ffff</code> là đỉnh): trên x86-64 và trên máy arm64 này, một tiến trình người dùng có 2<sup>48</sup> byte = 256 TiB địa chỉ, trên một VM chỉ có 7,9 GB RAM. Hai, không có địa chỉ nào ở đây là địa chỉ RAM. CPU và nhân dịch từng địa chỉ, theo từng trang, tới chỗ dữ liệu thật sự nằm (bài 7.2) — nên hai tiến trình cùng dùng <code>0xaaaa…0010</code> mà không đụng nhau. Bấm qua đúng những vùng đó, rồi chạy lại chương trình với ASLR bật và tắt:</p>
${lab('memory', 'layout', 'vi', 'text, data, bss, heap, mmap và stack của một tiến trình, kèm địa chỉ một lần chạy thật in ra. Bật/tắt ASLR rồi bấm "Chạy lại chương trình".')}

<h3>Bản đồ của chính nhân: /proc/&lt;pid&gt;/maps và pmap</h3>
<p>Chương trình có thể tự in bản đồ của nó (đây là lần chạy thứ hai, nên các số khác đi — nhớ điều này cho phần ASLR):</p>
${run('c71-kgdc', './layout maps', 1)}
<p>Mỗi dòng là một <strong>ánh xạ (mapping)</strong> — nhân gọi là VMA, virtual memory area: một khoảng địa chỉ, quyền, vị trí trong file, thiết bị và inode, và tên file. Những thứ cần nhận ra:</p>
<ul>
<li>file chương trình <code>/lab/ch07/layout</code> xuất hiện ba lần: <code>r-xp</code> (mã — được chạy, không bao giờ được ghi), <code>r--p</code> (dữ liệu chỉ-đọc), <code>rw-p</code> (biến toàn cục). Nhân thực thi các quyền này: ghi vào vùng mã là SIGSEGV, không phải một thay đổi lặng lẽ.</li>
<li><code>libc.so.6</code> xuất hiện bốn lần, trong đó có một vùng <code>---p</code> không có quyền gì — một khe chắn để chạy lố khỏi đuôi phần này thì bị lỗi chứ không đọc nhầm sang phần kế.</li>
<li><code>[heap]</code>, <code>[stack]</code>, và trang <code>[vdso]</code> bạn đã gặp ở Chương 1 (đồng hồ đọc được mà không cần syscall).</li>
<li>một dòng <code>rw-p … 0</code> trơn, dài 8 MiB + 4 KiB, không có tên: đó là <code>malloc</code> lớn của ta — bộ nhớ ẩn danh (anonymous), không có file nào đứng sau.</li>
</ul>
<p><code>pmap -x</code> cho cùng danh sách đó kèm thêm một cột cực kỳ quan trọng — mỗi ánh xạ thật sự nằm trong RAM bao nhiêu:</p>
${run('c71-kgdc', 'pmap -x', 1)}
<p><code>malloc</code> 8 MiB được <em>ánh xạ</em> 8196 kB nhưng chỉ <em>thường trú</em> 4 kB. libc ánh xạ 1700 kB, thường trú 1060 kB. Cả tiến trình ánh xạ 10,9 MB và giữ 1,3 MB RAM. "Ánh xạ" nghĩa là "những địa chỉ này hợp lệ"; "thường trú (resident)" nghĩa là "ngay lúc này có một trang vật lý đứng sau chúng". Giữ lấy sự phân biệt đó — phần còn lại của bài, và cả Chương 8, đều dựng trên nó.</p>

<h3>ASLR: bản đồ dịch chuyển mỗi lần chạy</h3>
${run('c71-kgdc', 'cat /proc/sys/kernel/randomize_va_space', 1)}
${run('c71-kgdc', 'for i in 1 2 3; do ./layout short', 1)}
<p><code>2</code> nghĩa là <strong>ASLR</strong> đầy đủ (address space layout randomisation — ngẫu nhiên hoá bố cục không gian địa chỉ): chương trình, heap, thư viện và stack mỗi thứ nhận một gốc ngẫu nhiên ở mỗi lần <code>exec</code>. Ba lần chạy, ba bố cục khác nhau. Giờ tắt nó cho một lệnh bằng <code>setarch -R</code> (nó bật một cờ riêng cho tiến trình; container lab cần <code>--security-opt seccomp=unconfined</code> mới cho phép):</p>
${run('c71-kgdc', 'for i in 1 2 3; do setarch -R', 1)}
<p>Lần nào cũng y hệt. Đó cũng là gốc của tiền tố <code>0xaaaa…</code> nổi tiếng: khi tắt ngẫu nhiên hoá, Linux nạp chương trình độc lập vị trí ở khoảng hai phần ba không gian 48 bit (ở đây là <code>0xaaaa aaaa 0000</code>); ASLR sau đó dời nó đi một số trang ngẫu nhiên. Nhìn ba chữ số hex cuối của <code>main</code>, heap và libc trong cả sáu lần chạy: <code>b68</code>, <code>010</code>, <code>8a0</code> không bao giờ đổi. Ngẫu nhiên hoá dời nguyên các trang 4 KiB, nên vị trí bên trong trang giữ nguyên (riêng stack được dời thêm một chút bên trong trang của nó, nên mấy chữ số cuối của stack vẫn đổi) — chi tiết này quan trọng khi bạn đọc các bài phân tích khai thác lỗ hổng ở Chương 13.</p>
<p>ASLR chỉ dời được chính chương trình nếu nó được biên dịch thành <strong>PIE</strong> (position-independent executable — file thực thi độc lập vị trí). Biên dịch không có nó:</p>
${run('c71-kgdc', 'gcc -O0 -no-pie', 2)}
<p><code>main</code> giờ nằm ở <code>0x400a6c</code> trong mọi lần chạy, còn heap, libc và stack vẫn di chuyển. Một địa chỉ mã cố định là món quà cho kẻ tấn công (họ biết từng lệnh nằm ở đâu), nên Ubuntu, Debian và Fedora mặc định biên dịch mọi thứ thành PIE. Trình gỡ lỗi tắt ASLR cho chương trình nó khởi chạy — tiện để so địa chỉ giữa các lần chạy, và là lý do một lỗi bộ nhớ đôi khi "biến mất khi chạy trong gdb".</p>

<h3>Stack nhỏ, và có một bờ vực cứng</h3>
<p>Heap có thể lớn tới hàng gigabyte; stack của luồng chính bị giới hạn bởi <code>ulimit -s</code>:</p>
${run('c71-kgdc', 'ulimit -s', 1)}
<p>8192 KiB = 8 MiB. Chương trình này đệ quy, mỗi lần gọi đặt 1 KiB biến cục bộ, và bắt cú sập trên một stack dự phòng riêng, nên nó nói được mình chết ở đâu:</p>
${src('ch07/rec.c', 'c')}
${run('c71-kgdc', './rec;', 1)}
${run('c71-kgdc', '(ulimit -s 2048', 1)}
<p>Độ sâu 7.941 — khoảng 8.190 KiB dưới khung đầu tiên — rồi <strong>SIGSEGV</strong> và mã thoát <strong>139</strong> = 128 + 11, đúng như Chương 1. Bên dưới stack là một vùng chắn không được ánh xạ; chạm vào đó là lỗi mà nhân không sửa được, nên tiến trình chết. Thu giới hạn còn 2 MiB thì nó chết ở độ sâu 1.981: độ sâu chỉ là giới hạn chia cho cỡ khung. Các runtime có quản lý đặt một giới hạn riêng, nhỏ hơn, trước bờ vực đó để ném lỗi thay vì sập:</p>
${run('c71-kgdc', 'node -e', 1)}
${run('c71-kgdc', 'java Deep', 2)}
<p>Node (V8 mặc định dừng ở stack khoảng 1 MB) ném một <code>RangeError</code> bắt được; Java ném <code>StackOverflowError</code>, và <code>-Xss256k</code> — stack nhỏ hơn cho mỗi luồng — cắt độ sâu từ 47.616 xuống 1.629. Trong code backend đây là lỗi "hàm đệ quy trên dữ liệu người dùng": một thân JSON lồng sâu, một cây bình luận, một danh mục tự trỏ vào chính nó. Đi qua từng khung của một stack lời gọi thật ở đây:</p>
${lab('memory', 'stack', 'vi', 'Mỗi lời gọi đẩy một khung (địa chỉ trả về, thanh ghi đã lưu, biến cục bộ); stack lớn dần xuống phía vùng chắn.')}

<div class="pitfall co-tieu-de">
<p><strong>Đừng bao giờ đệ quy trên dữ liệu người dùng kiểm soát mà không giới hạn độ sâu.</strong> Một bộ phân tích JSON hay một hàm duyệt cây đệ quy một lần cho mỗi tầng lồng sẽ chết ở vài nghìn tầng — 7.941 ở đây với C, 9.158 với Node — và với C đó là SIGSEGV giết cả tiến trình máy chủ, không phải một yêu cầu. Hãy chặn độ sâu (đa số thư viện JSON có tuỳ chọn), hoặc viết lại phép duyệt bằng một stack/hàng đợi tường minh trên heap.</p>
</div>

<h3>VSZ, RSS, PSS — tin con số bộ nhớ nào</h3>
<p>Xin 1 GiB, chỉ ghi 100 MiB trong đó:</p>
${src('ch07/reserve.c', 'c')}
${run('c71-kgdc', './reserve 1024 100', 1)}
${run('c71-kgdc', 'ps -o pid,vsz,rss,comm', 1)}
<p><code>malloc(1 GiB)</code> đẩy <strong>VSZ</strong> (<code>VmSize</code>, cỡ ảo: mọi địa chỉ đã ánh xạ) lên một gigabyte và <strong>RSS</strong> (<code>VmRSS</code>, resident set size: các trang nằm trong RAM) chẳng nhích chút nào. Ghi 100 MiB thì RSS tăng 100 MiB. RAM được phát từng trang, ở lần chạm đầu tiên — cơ chế đó, page fault, là bài 7.3. Các runtime thật dựa vào điều này suốt:</p>
${run('c71-kgdc', 'ps -o pid,vsz,rss,nlwp,comm', 1)}
<p>Một tiến trình Node rảnh: 485 MB VSZ, 45 MB RSS. Một JVM rảnh: <strong>4,8 GB VSZ</strong>, 77 MB RSS, 18 luồng. JVM đặt chỗ sẵn không gian địa chỉ cho heap tối đa (mặc định một phần tư RAM — bài 7.4), cho vùng mã đã biên dịch và cho stack của từng luồng; chưa dùng thì không tốn gì. VSZ gần như không nói gì về bộ nhớ đang dùng. RSS là con số đúng cho <em>một</em> tiến trình. Nhưng RSS đếm mọi trang mà tiến trình với tới được trong RAM — kể cả các trang nó <em>dùng chung</em> với tiến trình khác, như thư viện, hay bộ nhớ thừa kế qua <code>fork</code>. Cộng RSS của nhiều tiến trình lại là đếm đi đếm lại các trang dùng chung:</p>
${src('ch07/pss.c', 'c')}
${run('c71-kgdc', './pss 200 3', 1)}
<p>Một tiến trình cha ghi 200 MiB rồi fork ba con không bao giờ đụng tới vùng đó. Tiến trình nào cũng hiện <strong>RSS 200 MiB</strong>; tổng là 801 MiB. Nhưng 200 MiB đó chỉ tồn tại một lần trong RAM — cột <code>Shared</code> nói vậy và <code>Private</code> bằng 0. <strong>PSS</strong> (proportional set size — cỡ chia theo tỉ lệ) chia đều mỗi trang dùng chung cho các tiến trình cùng dùng nó: 200 / 4 = 50 MiB mỗi tiến trình, và cột PSS <em>cộng lại</em> đúng bằng 200 thật. Đó chính là hình dạng của một triển khai Gunicorn, PHP-FPM, Puma hay Node <code>cluster</code>, và của các backend PostgreSQL dùng chung <code>shared_buffers</code>. Nhân công bố tất cả các số này cho từng tiến trình trong <code>/proc/&lt;pid&gt;/smaps_rollup</code>:</p>
${run('c71-kgdc', "grep -E '^(Rss", 1)}

<div class="pitfall co-tieu-de">
<p><strong>Hai báo động giả kinh điển.</strong> (1) "Dịch vụ Java dùng 4,8 GB, chắc chắn đang rò rỉ!" — đó là VSZ, không gian địa chỉ đặt chỗ; hãy nhìn RSS. (2) "Bốn worker dùng 3,2 GB trên máy 2 GB!" — đó là tổng RSS, đếm trang dùng chung bốn lần; hãy cộng PSS. Trước khi gọi ai dậy vì bộ nhớ, hãy nói rõ bạn đang nhìn con số nào trong ba con số.</p>
</div>

<h3>Nếu bạn đã học OSG202 bài 3.1</h3>
<p>Ở đó bạn thấy địa chỉ logic với địa chỉ vật lý và vì sao mỗi tiến trình có không gian địa chỉ riêng, dưới dạng sơ đồ. Ở đây là đúng thứ đó trong một tiến trình đang chạy: một bản đồ 48 bit với vùng và quyền thật, một bố cục dời đi mỗi lần chạy, và ba con số bộ nhớ không khớp nhau vì những lý do chính đáng. Đề thi hỏi từ vựng; production bắt bạn đọc <code>maps</code> và <code>smaps_rollup</code>.</p>
${L(OSG31, '🎓', 'OSG202 · 3.1 — Phân trang &amp; bộ nhớ ảo', 'Địa chỉ logic và vật lý, không gian địa chỉ, theo giáo trình môn học.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bảng Grafana của bạn cùng nhóm cộng RSS của bốn worker Gunicorn chạy API và hiện 3,2 GB trên một VPS có 2 GB RAM — vậy mà chẳng có gì sập. Trưởng nhóm hỏi bạn bảng đó sai chỗ nào và con số thật là bao nhiêu.</p>
<ol>
<li>Trong lab, biên dịch <code>pss.c</code> và chạy <code>./pss 200 3</code>, rồi <code>./pss 200 7</code>. Ghi lại tổng RSS và tổng PSS của mỗi lần.</li>
<li>Chạy <code>./layout wait &amp;</code>, rồi <code>grep -E '^(Rss|Pss|Shared|Private)' /proc/$!/smaps_rollup</code> và <code>pmap -x $!</code>. Ánh xạ nào giữ phần lớn bộ nhớ thường trú?</li>
<li>Chạy <code>./layout short</code> ba lần, rồi <code>setarch -R ./layout short</code> ba lần. Những chữ số hex nào không bao giờ đổi, và vì sao?</li>
<li>Chạy <code>./rec</code> với <code>ulimit -s 4096</code> trong một subshell. Đoán độ sâu trước khi chạy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được với trưởng nhóm, bằng hai bảng tự đo, vì sao tổng RSS lớn hơn RAM, nên vẽ con số nào thay thế (PSS), và dự đoán độ sâu với <code>ulimit -s 4096</code> lệch không quá 5% so với số đo.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['virtual address space (không gian địa chỉ ảo)', 'Dải địa chỉ riêng mà một tiến trình nhìn thấy (ở đây 256 TiB); được dịch sang RAM theo từng trang.'],
  ['mapping / VMA (ánh xạ)', 'Một dòng của /proc/&lt;pid&gt;/maps: một khoảng địa chỉ có quyền, đứng sau là một file hoặc bộ nhớ ẩn danh.'],
  ['text / data / bss / heap / stack', 'Mã; biến toàn cục có giá trị đầu; biến toàn cục bằng 0; bộ nhớ malloc lớn dần lên; khung lời gọi lớn dần xuống.'],
  ['ASLR (ngẫu nhiên hoá bố cục)', 'Gốc ngẫu nhiên cho chương trình, heap, thư viện và stack ở mỗi lần exec; randomize_va_space = 2.'],
  ['PIE (file thực thi độc lập vị trí)', 'Cho phép ASLR dời được cả mã của chương trình.'],
  ['VSZ (cỡ ảo)', 'Mọi địa chỉ đã ánh xạ, chạm hay chưa. Gần như không nói gì về bộ nhớ đang dùng.'],
  ['RSS (bộ nhớ thường trú)', 'Các trang của tiến trình đang nằm trong RAM, kể cả trang dùng chung.'],
  ['PSS (cỡ chia theo tỉ lệ)', 'RSS nhưng mỗi trang dùng chung được chia cho số tiến trình dùng nó; cộng qua nhiều tiến trình vẫn đúng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một tiến trình thấy một không gian địa chỉ 48 bit riêng: text, data/bss, heap (lớn lên), một vùng mmap rộng (thư viện, file, malloc lớn), stack (lớn xuống).</li>
<li><code>/proc/&lt;pid&gt;/maps</code> và <code>pmap -x</code> liệt kê mọi ánh xạ kèm quyền; "đã ánh xạ" và "thường trú" là hai con số khác nhau.</li>
<li>ASLR dời mọi vùng ở mỗi lần chạy (theo đơn vị trang, nên 12 bit cuối giữ nguyên); <code>-no-pie</code> ghim cố định phần mã.</li>
<li>Stack 8 MiB có một bờ vực chắn: khung 1 KiB chết ở độ sâu 7.941 với exit 139; Node và Java ném lỗi trước đó.</li>
<li>VSZ ≠ bộ nhớ đang dùng (JVM: VSZ 4,8 GB, RSS 77 MB); RSS đếm trùng trang dùng chung (tổng 801 MiB so với PSS 200 MiB).</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc_pid_maps.5.html', '📄', 'man 5 proc_pid_maps', 'Giải thích từng cột của /proc/&lt;pid&gt;/maps.', 'Mở')}
${L('https://www.kernel.org/doc/html/latest/filesystems/proc.html', '🐧', 'kernel.org — Hệ thống file /proc', 'smaps và smaps_rollup: Rss, Pss, Shared, Private, AnonHugePages.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 7.2 — Paging, page tables, TLB ───────────────────────── */
    {
      title: '7.2 — Paging, page tables and the TLB — and when huge pages pay off|||7.2 — Phân trang, bảng trang và TLB — và khi nào huge page đáng dùng',
      slug: 'os-7-2-phan-trang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Trang 4 KiB và địa chỉ 48 bit tách thành bốn chỉ số bảng trang; tự dịch địa chỉ ảo ra khung vật lý bằng /proc/self/pagemap; 2 MB bảng trang cho mỗi GiB; TLB đo bằng pointer-chasing (64 MiB: 47 ns với trang 4 KiB, 19 ns với trang 2 MiB); perf trên VM và bộ đếm phần cứng; THP, HugeTLB và PostgreSQL.',
      content: `${G72}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Every memory access is translated. Why isn't everything twice as slow?</h2>
<p class="lead">Lesson 7.1 ended with a promise: none of those <code>0xaaaa…</code> addresses is a RAM address. Something turns each one into a physical location, on every load and every store, billions of times a second. This lesson does one translation by hand on a real process, measures what the translation tables cost in memory, and then measures the cache that makes it fast — the TLB — by watching the same loop get 2.5× faster when only the page size changes.</p>

<h3>Pages and frames</h3>
<p>Memory is managed in fixed-size blocks. A block of virtual addresses is a <strong>page</strong>; a block of physical RAM is a <strong>frame</strong>; the kernel keeps, per process, a table saying which page sits in which frame. On this machine:</p>
${run('c72-trang', 'getconf PAGESIZE', 1)}
${run('c72-trang', 'zcat /proc/config.gz', 1)}
<p>Pages are 4,096 bytes = 2<sup>12</sup>, so the lowest 12 bits of an address are the <strong>offset</strong> inside the page and pass through translation unchanged. The other 36 bits (of 48) are the <strong>virtual page number</strong>. The kernel is built for 48-bit virtual addresses and <strong>4 levels</strong> of page tables — the same shape as x86-64 (Linux names the levels PGD, PUD, PMD and PTE; the textbook says "multi-level page table").</p>

<h3>Translate an address by hand</h3>
<p>Each level is indexed by 9 bits: 9 + 9 + 9 + 9 + 12 = 48. A table of 2<sup>9</sup> = 512 entries of 8 bytes fills exactly one 4 KiB page. This program splits a few real addresses into the four indexes and the offset, then asks the kernel for the true answer: <code>/proc/self/pagemap</code> has one 64-bit entry per virtual page, with a "present in RAM" bit and the physical frame number (PFN).</p>
${src('ch07/xlate.c', 'c')}
${run('c72-trang', './xlate', 1)}
<p>Read the <code>code main()</code> row: the CPU uses 341 to pick an entry in the top table, 171 in the next, then 330 and 128, and lands on frame <code>0x12be6d</code>; physical address = frame × 4096 + offset = <code>0x12be6d880</code>. The offset <code>0x880</code> is identical on both sides. The stack starts with 511, 511 — the very top of the space. Two rows show demand paging (lesson 7.3) before we name it: <code>mmap page 1</code>, written once, has a frame; <code>mmap page 2</code>, never touched, is not in RAM at all. Its virtual address is valid; there is simply nothing behind it yet.</p>
<p>Run the same program as an ordinary user:</p>
${run('c72-trang', 'setpriv', 1)}
<p>Present bits still work, but every PFN reads 0. Since 2015 (Linux 4.0, refined in 4.2) only <code>CAP_SYS_ADMIN</code> may see physical frame numbers, because knowing them helped Rowhammer attacks aim at specific RAM rows (the lab ran this lesson with <code>--cap-add SYS_ADMIN</code>). Now step through the walk yourself — address → TLB → page-table entry → frame — on a small 16-page machine:</p>
${lab('vm', 'walk', 'en', 'Walk an array on the heap: watch the virtual page number index the page table, the TLB fill up, and the hits once the same page is reused.', { tour: 'vm-translate' })}

<h3>Why four levels instead of one big table</h3>
<p>A single flat table for 48-bit addresses needs 2<sup>36</sup> entries × 8 bytes = <strong>512 GiB per process</strong>. A tree only allocates the branches that are used: an empty process needs a handful of table pages, and the cost grows with the memory you actually touch. Measured — touch N MiB of 4 KiB pages and read <code>VmPTE</code> (the size of the process's page tables) from <code>/proc/self/status</code>:</p>
${src('ch07/touch.c', 'c')}
${run('c72-trang', 'for m in 64 256 1024; do ./touch $m nohuge', 1)}
<p>172 kB → 556 kB → 2,096 kB: about <strong>2 MB of page tables per GiB</strong>, because 1 GiB / 4 KiB = 262,144 entries × 8 bytes = 2 MiB. That is small for one process — and real money for a PostgreSQL server with 300 backends that each map a 32 GB <code>shared_buffers</code> with 4 KiB pages: every backend builds its own tables for the same memory (that is one reason PostgreSQL wants huge pages, below). Notice also the fault column: 262,146 faults to write 262,144 pages — one per page. Hold that number for lesson 7.3.</p>

<h3>The TLB: the cache that makes translation free (most of the time)</h3>
<p>A four-level walk is four dependent memory reads before the real read can start. Doing that on every access would make memory several times slower. So every core keeps a small cache of recent translations, the <strong>TLB</strong> (translation lookaside buffer): typically tens of entries in the first level and one to a few thousand in the second. A hit costs nothing extra; a miss means a hardware page walk. What matters is the <strong>TLB reach</strong> = entries × page size: with ~2,000 entries of 4 KiB you cover about 8 MiB. Beyond that, a program jumping between pages misses constantly.</p>
<p>This program measures exactly that. It touches <em>one cache line per 4 KiB page</em>, in random page order, each load depending on the previous one (pointer chasing, so the CPU cannot overlap them):</p>
${src('ch07/tlb.c', 'c')}
${run('c72-trang', 'for m in 1 8 64 1024', 1)}
<ul>
<li><strong>1 MiB</strong> (256 pages): 3 ns either way — every translation fits in the TLB and every line fits in the CPU cache.</li>
<li><strong>8 MiB</strong> (2,048 pages): ~8 ns — near the edge of what the TLB covers; the data still fits in cache.</li>
<li><strong>64 MiB</strong> (16,384 pages): <strong>47.3 ns with 4 KiB pages, 19.3 ns with 2 MiB pages</strong> — same data, same loop, 2.5× faster. With 2 MiB pages the whole 64 MiB is 32 TLB entries.</li>
<li><strong>1 GiB</strong>: 199 vs 156 ns. Now every access also misses the data caches and goes to DRAM, which huge pages cannot fix — but they still remove ~40 ns of page walking per access.</li>
</ul>
<p>Two honest notes. These numbers move ±20% between runs (other work on the Mac, the VM's own scheduling), so compare within a run. And this lab is a virtual machine: a TLB miss inside a VM walks the guest's page tables <em>and</em> the hypervisor's second-level tables, so misses cost more here than on bare metal — one more reason the same code is slower in a VM than on a dedicated server. The same mechanism is why Chapter 3 said a context switch between processes is dearer than between threads: a new process means new page tables, and translations cached for the old one are useless.</p>

<h3>Counting it with perf — and what a VM won't tell you</h3>
${run('c72-trang', 'perf stat -e page-faults,dTLB-loads', 1)}
${run('c72-trang', 'perf stat -e cycles', 1)}
<p><code>page-faults</code> and <code>cpu-clock</code> are <strong>software events</strong>: the kernel counts them itself, so they work anywhere. <code>dTLB-loads</code>, <code>dTLB-load-misses</code>, <code>cycles</code> and <code>instructions</code> are <strong>hardware events</strong>: the CPU has a few performance-monitoring counter registers (the PMU) that it increments on events like "TLB miss" or "page walk completed", and <code>perf</code> programs and reads them. Docker Desktop's VM does not pass the PMU through, hence <code>&lt;not supported&gt;</code>. On a Linux server or VPS that exposes it, <code>perf stat -e dTLB-loads,dTLB-load-misses ./tlb 64 nohuge</code> gives you the miss ratio directly (on Intel, <code>dtlb_load_misses.walk_completed</code> counts finished page walks). In this lab, the timing table above is your TLB counter.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>&lt;not supported&gt;</code> is not zero.</strong> When <code>perf stat</code> prints <code>&lt;not supported&gt;</code> or <code>&lt;not counted&gt;</code>, the counter does not exist in that environment — containers, many cloud VMs, Docker Desktop. It does not mean "no TLB misses". Say "unmeasured", fall back to timing experiments like <code>tlb.c</code>, and re-run on hardware that exposes the PMU before you conclude anything.</p>
</div>

<h3>Huge pages: THP and HugeTLB</h3>
<p>The CPU can also map a whole 2 MiB block with a single entry one level up (skipping the last level). Linux offers this two ways. <strong>Transparent Huge Pages (THP)</strong> — the kernel uses 2 MiB pages for anonymous memory automatically when it can:</p>
${run('c72-trang', 'cat /sys/kernel/mm/transparent_hugepage/enabled', 1)}
${run('c72-trang', 'cat /sys/kernel/mm/transparent_hugepage/defrag', 1)}
${run('c72-trang', "grep -E 'AnonHugePages", 1)}
<p>The bracket marks the active choice: THP is <code>always</code> on here (many distributions default to <code>madvise</code>: only regions that ask with <code>madvise(MADV_HUGEPAGE)</code>), and <code>defrag</code> is <code>madvise</code>: the kernel only stalls to assemble a free 2 MiB block for regions that asked. 1.1 GB of the VM's anonymous memory is already in huge pages. Same 256 MiB, both ways:</p>
${run('c72-trang', 'for h in nohuge huge', 1)}
<p>65,538 page faults versus <strong>130</strong>, and 61.5 ms versus 5.1 ms to touch it all: one fault now brings in 2 MiB. (<code>page tables</code> stays the same because Linux keeps one spare table page per huge page, ready in case it must split it back into 4 KiB pages.) The other way is <strong>HugeTLB</strong>: you reserve huge pages explicitly (<code>vm.nr_hugepages</code>; <code>HugePages_Total</code> in <code>/proc/meminfo</code> is 0 here) and a program maps them on purpose. PostgreSQL does exactly this for <code>shared_buffers</code> with its <code>huge_pages</code> setting (default <code>try</code>): fewer TLB misses, and far smaller page tables in every backend.</p>
<p>Huge pages are not free. THP can make memory "bigger" — touching one byte of a fresh 2 MiB region can make 2 MiB resident (you will see this inflate glibc's arenas in lesson 7.4); assembling 2 MiB blocks can stall a process during compaction; and a database with random small writes may prefer to opt out. That is why Redis turns THP off for itself (lesson 7.3) and PostgreSQL uses explicit HugeTLB instead of THP. Measure on your workload, as above.</p>

<h3>If you have done OSG202 lesson 3.3</h3>
<p>There you computed page numbers and offsets, two-level tables and the effective access time with a TLB hit ratio. Here those formulas have real numbers: 4 levels × 9 bits + 12, a PFN read from the kernel, 2 MB of tables per GiB, and a TLB miss worth about 28 ns (47.3 − 19.3) on this machine.</p>
${L(OSG33, '🎓', 'OSG202 · 3.3 — Address translation: page tables &amp; the TLB', 'Multi-level tables and effective access time, as in the course textbook.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an analytics endpoint keeps a 1 GB in-memory index and jumps around it at random; its latency is fine in a small test and poor in production. A colleague says "turn on huge pages" and another says "that's cargo cult". You will settle it with numbers.</p>
<ol>
<li>Compile <code>tlb.c</code> and run it for 8, 64, 256 and 1024 MiB, with <code>nohuge</code> and <code>huge</code>. Put the ns per access in a table.</li>
<li>Run <code>./touch 256 huge</code> and <code>./touch 256 nohuge</code>; compare faults and time. Then check <code>AnonHugePages</code> in <code>/proc/meminfo</code> before and after.</li>
<li>Run <code>./xlate</code> as root and as <code>dev</code> (<code>setpriv --reuid=1001 --regid=1001 --clear-groups ./xlate</code>). Check one row by hand: physical = PFN × 4096 + offset.</li>
<li>Compute the TLB reach you would need for 1 GiB with 4 KiB pages and with 2 MiB pages.</li>
</ol>
<p><strong>Done when:</strong> your table shows where the curves split (around the TLB reach), you can state the speed-up at 64 MiB and at 1 GiB, and you can explain why 1 GiB stays slow even with huge pages.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['page / frame', 'A fixed block of virtual addresses / of physical RAM (4 KiB here); the page table maps one to the other.'],
  ['offset', 'The low 12 bits of an address: the byte inside the page; unchanged by translation.'],
  ['multi-level page table', 'A tree of 512-entry tables (4 levels for 48-bit addresses) so unused ranges cost nothing.'],
  ['PFN', 'Physical frame number; /proc/&lt;pid&gt;/pagemap shows it only to CAP_SYS_ADMIN.'],
  ['TLB', 'Per-core cache of recent translations; a miss triggers a hardware page walk.'],
  ['TLB reach', 'Entries × page size: how much memory the TLB covers without missing.'],
  ['THP / HugeTLB', 'Automatic 2 MiB pages for anonymous memory / explicitly reserved huge pages.'],
  ['hardware vs software event', 'PMU counters inside the CPU (cycles, dTLB misses) vs counts the kernel keeps (page-faults).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A 48-bit address = four 9-bit table indexes + a 12-bit offset; <code>pagemap</code> showed the real frame behind each page.</li>
<li>Page tables are a tree so empty space is free; touched 4 KiB pages cost ~2 MB of tables per GiB.</li>
<li>The TLB caches translations; past its reach, the same loop went from 19.3 to 47.3 ns per access at 64 MiB with 4 KiB pages.</li>
<li>Huge pages cut faults 500× (65,538 → 130) and TLB misses — but can inflate RSS and stall on compaction; measure first.</li>
<li>In a VM, hardware perf counters may be <code>&lt;not supported&gt;</code>: that means unmeasured, not zero.</li>
</ul>
${L('https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html', '🐧', 'kernel.org — Transparent Hugepage Support', 'enabled/defrag modes, madvise, khugepaged and how to monitor THP.', 'Open')}
${L('https://www.postgresql.org/docs/current/kernel-resources.html#LINUX-HUGE-PAGES', '🐘', 'PostgreSQL — Linux huge pages', 'How PostgreSQL uses huge_pages for shared memory and how to size vm.nr_hugepages.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Mọi lần truy cập bộ nhớ đều được dịch. Sao mọi thứ không chậm đi gấp đôi?</h2>
<p class="lead">Bài 7.1 kết thúc bằng một lời hứa: không địa chỉ <code>0xaaaa…</code> nào là địa chỉ RAM. Có thứ gì đó biến mỗi địa chỉ thành một vị trí vật lý, ở mỗi lần nạp và mỗi lần ghi, hàng tỉ lần mỗi giây. Bài này tự tay dịch một địa chỉ trên một tiến trình thật, đo xem các bảng dịch tốn bao nhiêu bộ nhớ, rồi đo cái cache làm phép dịch nhanh — TLB — bằng cách nhìn cùng một vòng lặp nhanh lên 2,5 lần khi chỉ đổi cỡ trang.</p>

<h3>Trang và khung</h3>
<p>Bộ nhớ được quản lý theo các khối cỡ cố định. Một khối địa chỉ ảo là một <strong>trang (page)</strong>; một khối RAM vật lý là một <strong>khung (frame)</strong>; với mỗi tiến trình, nhân giữ một bảng ghi trang nào nằm ở khung nào. Trên máy này:</p>
${run('c72-trang', 'getconf PAGESIZE', 1)}
${run('c72-trang', 'zcat /proc/config.gz', 1)}
<p>Trang cỡ 4.096 byte = 2<sup>12</sup>, nên 12 bit thấp nhất của địa chỉ là <strong>độ lệch (offset)</strong> bên trong trang và đi qua phép dịch mà không đổi. 36 bit còn lại (trong 48) là <strong>số trang ảo (virtual page number)</strong>. Nhân được dựng cho địa chỉ ảo 48 bit và <strong>4 cấp</strong> bảng trang — cùng dáng với x86-64 (Linux gọi các cấp là PGD, PUD, PMD và PTE; giáo trình gọi là "bảng trang nhiều cấp").</p>

<h3>Tự tay dịch một địa chỉ</h3>
<p>Mỗi cấp được chọn bằng 9 bit: 9 + 9 + 9 + 9 + 12 = 48. Một bảng 2<sup>9</sup> = 512 mục, mỗi mục 8 byte, lấp vừa khít một trang 4 KiB. Chương trình này tách vài địa chỉ thật thành bốn chỉ số và độ lệch, rồi hỏi nhân đáp án thật: <code>/proc/self/pagemap</code> có một mục 64 bit cho mỗi trang ảo, gồm một bit "đang có trong RAM" và số khung vật lý (PFN — physical frame number).</p>
${src('ch07/xlate.c', 'c')}
${run('c72-trang', './xlate', 1)}
<p>Đọc dòng <code>code main()</code>: CPU dùng 341 để chọn một mục trong bảng trên cùng, 171 ở bảng kế, rồi 330 và 128, và đáp xuống khung <code>0x12be6d</code>; địa chỉ vật lý = khung × 4096 + độ lệch = <code>0x12be6d880</code>. Độ lệch <code>0x880</code> giống hệt ở hai phía. Stack bắt đầu bằng 511, 511 — đúng đỉnh không gian. Hai dòng cho thấy nạp trang theo yêu cầu (bài 7.3) trước cả khi ta gọi tên nó: <code>mmap page 1</code>, được ghi một lần, có khung; <code>mmap page 2</code>, chưa từng chạm, hoàn toàn không có trong RAM. Địa chỉ ảo của nó hợp lệ; chỉ là chưa có gì đứng sau.</p>
<p>Chạy cùng chương trình với tư cách người dùng thường:</p>
${run('c72-trang', 'setpriv', 1)}
<p>Bit "có mặt" vẫn đúng, nhưng PFN nào cũng đọc ra 0. Từ năm 2015 (Linux 4.0, chỉnh lại ở 4.2) chỉ <code>CAP_SYS_ADMIN</code> được thấy số khung vật lý, vì biết chúng giúp tấn công Rowhammer nhắm vào đúng hàng RAM (lab chạy bài này với <code>--cap-add SYS_ADMIN</code>). Giờ tự bước qua phép duyệt — địa chỉ → TLB → mục bảng trang → khung — trên một cỗ máy nhỏ 16 trang:</p>
${lab('vm', 'walk', 'vi', 'Duyệt một mảng trên heap: nhìn số trang ảo chọn mục trong bảng trang, TLB đầy dần, và các lần trúng TLB khi cùng một trang được dùng lại.', { tour: 'vm-translate' })}

<h3>Vì sao bốn cấp thay vì một bảng to</h3>
<p>Một bảng phẳng duy nhất cho địa chỉ 48 bit cần 2<sup>36</sup> mục × 8 byte = <strong>512 GiB cho mỗi tiến trình</strong>. Một cái cây chỉ cấp phát những nhánh đang dùng: một tiến trình trống chỉ cần vài trang bảng, và chi phí lớn theo lượng bộ nhớ bạn thật sự chạm. Đo thật — chạm N MiB bằng trang 4 KiB rồi đọc <code>VmPTE</code> (cỡ bảng trang của tiến trình) trong <code>/proc/self/status</code>:</p>
${src('ch07/touch.c', 'c')}
${run('c72-trang', 'for m in 64 256 1024; do ./touch $m nohuge', 1)}
<p>172 kB → 556 kB → 2.096 kB: khoảng <strong>2 MB bảng trang cho mỗi GiB</strong>, vì 1 GiB / 4 KiB = 262.144 mục × 8 byte = 2 MiB. Với một tiến trình thì nhỏ — nhưng thành tiền thật với một máy chủ PostgreSQL có 300 backend cùng ánh xạ một <code>shared_buffers</code> 32 GB bằng trang 4 KiB: mỗi backend tự dựng bảng riêng cho cùng một vùng nhớ (đó là một lý do PostgreSQL muốn huge page, ở dưới). Để ý cả cột fault: 262.146 fault để ghi 262.144 trang — mỗi trang một lần. Giữ con số đó cho bài 7.3.</p>

<h3>TLB: cái cache làm phép dịch gần như miễn phí</h3>
<p>Duyệt bốn cấp là bốn lần đọc bộ nhớ nối đuôi nhau trước khi lần đọc thật được bắt đầu. Làm vậy ở mọi lần truy cập thì bộ nhớ chậm đi nhiều lần. Nên mỗi lõi giữ một cache nhỏ các phép dịch gần đây, gọi là <strong>TLB</strong> (translation lookaside buffer — bộ đệm tra cứu dịch địa chỉ): thường vài chục mục ở tầng thứ nhất và một tới vài nghìn mục ở tầng thứ hai. Trúng thì không tốn thêm gì; trượt thì phần cứng phải duyệt bảng trang. Điều quan trọng là <strong>tầm phủ TLB (TLB reach)</strong> = số mục × cỡ trang: khoảng 2.000 mục trang 4 KiB phủ được chừng 8 MiB. Vượt quá đó, một chương trình nhảy qua lại giữa các trang sẽ trượt liên tục.</p>
<p>Chương trình này đo đúng điều đó. Nó chạm <em>một dòng cache trên mỗi trang 4 KiB</em>, theo thứ tự trang ngẫu nhiên, lần nạp sau phụ thuộc lần nạp trước (pointer chasing — đuổi con trỏ, nên CPU không chạy chồng được):</p>
${src('ch07/tlb.c', 'c')}
${run('c72-trang', 'for m in 1 8 64 1024', 1)}
<ul>
<li><strong>1 MiB</strong> (256 trang): 3 ns cả hai cách — mọi phép dịch vừa trong TLB và mọi dòng vừa trong cache CPU.</li>
<li><strong>8 MiB</strong> (2.048 trang): ~8 ns — sát mép tầm phủ của TLB; dữ liệu vẫn vừa cache.</li>
<li><strong>64 MiB</strong> (16.384 trang): <strong>47,3 ns với trang 4 KiB, 19,3 ns với trang 2 MiB</strong> — cùng dữ liệu, cùng vòng lặp, nhanh hơn 2,5 lần. Với trang 2 MiB cả 64 MiB chỉ là 32 mục TLB.</li>
<li><strong>1 GiB</strong>: 199 so với 156 ns. Giờ mọi lần truy cập còn trượt cả cache dữ liệu và phải xuống DRAM, điều huge page không sửa được — nhưng nó vẫn bớt khoảng 40 ns duyệt bảng trang mỗi lần.</li>
</ul>
<p>Hai lưu ý trung thực. Các số này xê dịch ±20% giữa các lần chạy (việc khác trên Mac, lịch chạy của chính VM), nên hãy so trong cùng một lần chạy. Và lab này là một máy ảo: một lần trượt TLB trong VM phải duyệt bảng trang của máy khách <em>và</em> bảng cấp hai của hypervisor, nên trượt ở đây đắt hơn trên máy thật — thêm một lý do cùng code chạy trong VM chậm hơn trên máy chủ riêng. Cũng chính cơ chế này là lý do Chương 3 nói chuyển ngữ cảnh giữa hai tiến trình đắt hơn giữa hai luồng: tiến trình mới nghĩa là bảng trang mới, và các phép dịch đã cache cho tiến trình cũ trở nên vô dụng.</p>

<h3>Đếm bằng perf — và điều một VM không chịu nói</h3>
${run('c72-trang', 'perf stat -e page-faults,dTLB-loads', 1)}
${run('c72-trang', 'perf stat -e cycles', 1)}
<p><code>page-faults</code> và <code>cpu-clock</code> là <strong>sự kiện phần mềm (software event)</strong>: chính nhân đếm, nên chạy ở đâu cũng được. <code>dTLB-loads</code>, <code>dTLB-load-misses</code>, <code>cycles</code> và <code>instructions</code> là <strong>sự kiện phần cứng (hardware event)</strong>: CPU có vài thanh ghi bộ đếm giám sát hiệu năng (PMU) tự tăng mỗi khi có sự kiện như "trượt TLB" hay "duyệt xong bảng trang", và <code>perf</code> lập trình rồi đọc chúng. VM của Docker Desktop không chuyển PMU vào trong, nên hiện <code>&lt;not supported&gt;</code>. Trên một máy chủ Linux hay VPS có lộ PMU, <code>perf stat -e dTLB-loads,dTLB-load-misses ./tlb 64 nohuge</code> cho bạn ngay tỉ lệ trượt (trên Intel, <code>dtlb_load_misses.walk_completed</code> đếm số lần duyệt bảng trang hoàn tất). Trong lab này, bảng thời gian ở trên chính là bộ đếm TLB của bạn.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>&lt;not supported&gt;</code> không phải là số 0.</strong> Khi <code>perf stat</code> in <code>&lt;not supported&gt;</code> hay <code>&lt;not counted&gt;</code>, bộ đếm đó không tồn tại trong môi trường ấy — container, nhiều VM đám mây, Docker Desktop. Nó không có nghĩa "không có lần trượt TLB nào". Hãy nói "chưa đo được", dùng thí nghiệm đo thời gian như <code>tlb.c</code> thay thế, và chạy lại trên phần cứng có lộ PMU trước khi kết luận điều gì.</p>
</div>

<h3>Huge page: THP và HugeTLB</h3>
<p>CPU còn ánh xạ được nguyên một khối 2 MiB bằng một mục duy nhất ở cấp phía trên (bỏ qua cấp cuối). Linux cho dùng theo hai cách. <strong>Transparent Huge Pages (THP — trang lớn trong suốt)</strong> — nhân tự dùng trang 2 MiB cho bộ nhớ ẩn danh khi làm được:</p>
${run('c72-trang', 'cat /sys/kernel/mm/transparent_hugepage/enabled', 1)}
${run('c72-trang', 'cat /sys/kernel/mm/transparent_hugepage/defrag', 1)}
${run('c72-trang', "grep -E 'AnonHugePages", 1)}
<p>Dấu ngoặc vuông đánh dấu lựa chọn đang bật: THP ở đây là <code>always</code> (nhiều bản phân phối mặc định là <code>madvise</code>: chỉ những vùng tự xin bằng <code>madvise(MADV_HUGEPAGE)</code>), và <code>defrag</code> là <code>madvise</code>: nhân chỉ dừng lại gom một khối trống 2 MiB cho những vùng đã xin. 1,1 GB bộ nhớ ẩn danh của VM đã nằm trong huge page. Cùng 256 MiB, theo hai cách:</p>
${run('c72-trang', 'for h in nohuge huge', 1)}
<p>65.538 page fault so với <strong>130</strong>, và 61,5 ms so với 5,1 ms để chạm hết: một fault giờ mang về 2 MiB. (<code>page tables</code> không giảm vì Linux giữ sẵn một trang bảng dự phòng cho mỗi huge page, phòng khi phải tách nó lại thành các trang 4 KiB.) Cách kia là <strong>HugeTLB</strong>: bạn đặt trước các huge page một cách tường minh (<code>vm.nr_hugepages</code>; <code>HugePages_Total</code> trong <code>/proc/meminfo</code> ở đây là 0) và chương trình chủ động ánh xạ chúng. PostgreSQL làm đúng như vậy cho <code>shared_buffers</code> với thiết lập <code>huge_pages</code> (mặc định <code>try</code>): ít trượt TLB hơn, và bảng trang trong từng backend nhỏ đi rất nhiều.</p>
<p>Huge page không miễn phí. THP có thể làm bộ nhớ "phình" — chạm một byte của một vùng 2 MiB mới có thể khiến cả 2 MiB thường trú (bạn sẽ thấy nó thổi phồng arena của glibc ở bài 7.4); việc gom khối 2 MiB có thể làm tiến trình khựng lại khi nhân nén bộ nhớ (compaction); và một CSDL ghi nhỏ ngẫu nhiên có thể muốn tắt nó. Đó là lý do Redis tự tắt THP cho chính mình (bài 7.3) và PostgreSQL dùng HugeTLB tường minh thay vì THP. Hãy đo trên đúng khối việc của bạn, như ở trên.</p>

<h3>Nếu bạn đã học OSG202 bài 3.3</h3>
<p>Ở đó bạn tính số trang và độ lệch, bảng hai cấp và thời gian truy cập hiệu dụng theo tỉ lệ trúng TLB. Ở đây các công thức đó có số thật: 4 cấp × 9 bit + 12, một PFN đọc từ nhân, 2 MB bảng cho mỗi GiB, và một lần trượt TLB đáng khoảng 28 ns (47,3 − 19,3) trên máy này.</p>
${L(OSG33, '🎓', 'OSG202 · 3.3 — Dịch địa chỉ: bảng trang &amp; TLB', 'Bảng trang nhiều cấp và thời gian truy cập hiệu dụng, theo giáo trình môn học.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một endpoint phân tích giữ một chỉ mục 1 GB trong bộ nhớ và nhảy lung tung bên trong nó; trong bài test nhỏ thì độ trễ ổn, lên production thì tệ. Một đồng nghiệp bảo "bật huge page đi", người khác bảo "làm theo phong trào thôi". Bạn sẽ phân xử bằng số đo.</p>
<ol>
<li>Biên dịch <code>tlb.c</code> và chạy với 8, 64, 256 và 1024 MiB, cả <code>nohuge</code> lẫn <code>huge</code>. Ghi số ns mỗi lần truy cập vào một bảng.</li>
<li>Chạy <code>./touch 256 huge</code> và <code>./touch 256 nohuge</code>; so số fault và thời gian. Rồi xem <code>AnonHugePages</code> trong <code>/proc/meminfo</code> trước và sau.</li>
<li>Chạy <code>./xlate</code> bằng root và bằng <code>dev</code> (<code>setpriv --reuid=1001 --regid=1001 --clear-groups ./xlate</code>). Tự kiểm một dòng: địa chỉ vật lý = PFN × 4096 + độ lệch.</li>
<li>Tính tầm phủ TLB cần có để phủ 1 GiB với trang 4 KiB và với trang 2 MiB.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy chỗ hai đường tách nhau (quanh tầm phủ TLB), bạn nói được mức tăng tốc ở 64 MiB và ở 1 GiB, và giải thích được vì sao 1 GiB vẫn chậm kể cả khi có huge page.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['page / frame (trang / khung)', 'Một khối cố định địa chỉ ảo / RAM vật lý (ở đây 4 KiB); bảng trang ánh xạ cái này sang cái kia.'],
  ['offset (độ lệch)', '12 bit thấp của địa chỉ: byte bên trong trang; không đổi qua phép dịch.'],
  ['multi-level page table (bảng trang nhiều cấp)', 'Một cây các bảng 512 mục (4 cấp cho địa chỉ 48 bit) để vùng không dùng không tốn gì.'],
  ['PFN (số khung vật lý)', 'Số thứ tự khung RAM; /proc/&lt;pid&gt;/pagemap chỉ cho CAP_SYS_ADMIN thấy.'],
  ['TLB', 'Cache các phép dịch gần đây của từng lõi; trượt thì phần cứng phải duyệt bảng trang.'],
  ['TLB reach (tầm phủ TLB)', 'Số mục × cỡ trang: lượng bộ nhớ TLB phủ được mà không trượt.'],
  ['THP / HugeTLB', 'Trang 2 MiB tự động cho bộ nhớ ẩn danh / huge page đặt trước tường minh.'],
  ['hardware vs software event (sự kiện phần cứng/phần mềm)', 'Bộ đếm PMU trong CPU (cycles, trượt dTLB) so với số đếm do nhân giữ (page-faults).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một địa chỉ 48 bit = bốn chỉ số bảng 9 bit + độ lệch 12 bit; <code>pagemap</code> cho thấy khung thật đứng sau mỗi trang.</li>
<li>Bảng trang là một cây nên vùng trống không tốn gì; trang 4 KiB đã chạm tốn khoảng 2 MB bảng cho mỗi GiB.</li>
<li>TLB cache các phép dịch; vượt tầm phủ của nó, cùng vòng lặp ở 64 MiB chậm từ 19,3 lên 47,3 ns mỗi lần truy cập với trang 4 KiB.</li>
<li>Huge page giảm fault 500 lần (65.538 → 130) và giảm trượt TLB — nhưng có thể thổi phồng RSS và khựng khi nén bộ nhớ; hãy đo trước.</li>
<li>Trong VM, bộ đếm perf phần cứng có thể là <code>&lt;not supported&gt;</code>: nghĩa là chưa đo được, không phải bằng 0.</li>
</ul>
${L('https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html', '🐧', 'kernel.org — Transparent Hugepage Support', 'Các chế độ enabled/defrag, madvise, khugepaged và cách theo dõi THP.', 'Mở')}
${L('https://www.postgresql.org/docs/current/kernel-resources.html#LINUX-HUGE-PAGES', '🐘', 'PostgreSQL — Linux huge pages', 'PostgreSQL dùng huge_pages cho bộ nhớ chia sẻ ra sao và cách tính vm.nr_hugepages.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 7.3 — Page faults, demand paging, COW ───────────────────────── */
    {
      title: '7.3 — Page faults, demand paging and copy-on-write: what Redis BGSAVE does to your RAM|||7.3 — Page fault, nạp trang theo yêu cầu và copy-on-write: Redis BGSAVE làm gì với RAM của bạn',
      slug: 'os-7-3-page-fault',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đếm page fault bằng /usr/bin/time -v và perf stat; nạp trang theo yêu cầu (đọc trang chưa ghi chỉ trỏ vào trang số 0); major fault đo thật: 65.536 lần đọc đĩa mất 3,4 giây so với 11,6 ms khi đã có trong page cache; mmap vs read; copy-on-write nhìn bằng số khung vật lý; Redis BGSAVE thật chép 124 MB vì 30.000 lệnh SET; và thay trang FIFO/LRU/Clock/OPT.',
      content: `${G73}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>RAM is handed out on first touch — and sometimes a touch costs 50 µs</h2>
<p class="lead"><code>malloc(1 GiB)</code> returns instantly. <code>fork()</code> of a 512 MiB process takes 4 ms. A memory access normally costs ~100 ns, yet sometimes the same kind of access costs 50,000 ns. All of it comes from one event you never call yourself: the <strong>page fault</strong>. This lesson counts page faults with the standard tools, separates the cheap ones from the expensive ones, watches copy-on-write move a single page to a new frame, and then measures what Redis's background save really costs in RAM.</p>

<h3>Counting page faults</h3>
<p>A <strong>page fault</strong> is the CPU saying "this virtual page has no valid translation (or not for this kind of access)". It traps into the kernel, which decides: give the page a frame and retry, or kill the process (SIGSEGV). The touch program from lesson 7.2 writes one byte in each of 65,536 pages:</p>
${run('c73-fault', '/usr/bin/time -v ./touch', 1)}
${run('c73-fault', 'perf stat -e page-faults,minor-faults', 1)}
<p>Two tools, one answer: about 65,600 faults — one per page, plus a few dozen for starting the program. GNU <code>/usr/bin/time -v</code> (the binary, not the shell keyword <code>time</code>) splits them the way the kernel does:</p>
<ul>
<li><strong>Minor</strong> ("reclaiming a frame") — the data needed no disk I/O: a fresh zero page, or a page already in RAM (the page cache, another process's shared page). Costs on the order of a microsecond or less.</li>
<li><strong>Major</strong> ("requiring I/O") — the kernel had to read from disk (a file, or swap) before the access could continue. Costs what the disk costs.</li>
</ul>
<p>Here: 65,589 minor, 1–2 major (loading part of the program itself). <code>ps -o min_flt,maj_flt -p PID</code> shows the same two counters for a running process.</p>

<h3>Demand paging: nothing is real until you touch it</h3>
<p>Lesson 7.1 showed RSS not moving after <code>malloc(1 GiB)</code>. Here is the mechanism, step by step, using <code>pagemap</code>'s present bit from 7.2:</p>
${src('ch07/demand.c', 'c')}
${run('c73-fault', './demand', 1)}
<ul>
<li><strong>After <code>mmap</code></strong>: 0 of 16,384 pages present. The kernel only wrote down "this range is valid, read-write, anonymous".</li>
<li><strong>After reading every page</strong>: all 16,384 present, 16,393 more faults — yet RSS grew by only 324 kB. Reading memory nobody has written must return zeros, so the kernel maps every page to one shared, read-only <strong>zero page</strong>. Present, but not yours.</li>
<li><strong>After writing every page</strong>: another 16,386 faults, and now RSS +64 MiB. Each write hit the read-only zero page, faulted, and the kernel gave the page its own zeroed frame — copy-on-write from the zero page.</li>
</ul>
<p>This is <strong>demand paging</strong>: memory is promised at <code>mmap</code>/<code>malloc</code> time and delivered at first touch, a page at a time. It is why VSZ can be 4.8 GB while RSS is 77 MB, and also why "malloc succeeded" does not mean the memory exists — Linux may promise more than it has, and the bill arrives on first touch (overcommit and the OOM killer are Chapter 8). Step through faults of every kind here — code, data, heap, stack, and a bad pointer that ends in SIGSEGV:</p>
${lab('vm', 'program', 'en', 'A program starts: fetching main(), pushing frames, reading a global, malloc + write, and one bad pointer. Watch minor and major faults and the SIGSEGV.', { tour: 'vm-translate' })}

<h3>Major faults, measured: when one access costs 50 µs</h3>
<p>Major faults need a page that is on disk and not in RAM. This program maps a 256 MiB file and reads it in different ways; <code>evict</code> uses <code>posix_fadvise(DONTNEED)</code> to drop the file's pages from the page cache, so we can start cold without root:</p>
${src('ch07/filemap.c', 'c')}
${run('c73-fault', './filemap make', 2)}
${run('c73-fault', './filemap evict /tmp/data; ./filemap cached', 1)}
<p>Cold file, touched in random page order with read-ahead switched off (<code>MADV_RANDOM</code>) — the access pattern of a database index lookup:</p>
${run('c73-fault', '/usr/bin/time -v ./filemap rand', 1)}
${run('c73-fault', './filemap rand', 1)}
<p><strong>65,536 major faults, 3.4 seconds</strong> — about 52 µs each, every one a disk read the process had to sleep through. Run it again: the pages are now in the page cache, 0 major faults, <strong>11.6 ms</strong>. Same code, same data, ~300× faster, purely because of where the pages were. (The 4,098 minor faults of the warm run are 65,536 / 16: on a fault the kernel maps up to 16 neighbouring pages that are already cached — "fault-around".) And this VM's "disk" is a file on a fast Mac SSD; on a cloud volume each major fault can cost several times more.</p>
${lab('pagecache', 'random', 'en', 'Random reads of a cold file, page by page: read-ahead cannot guess the next page, so every page is a trip to the disk — a major fault you sleep through. Compare the disk-read counter with the sequential read below.')}
<p>Sequential access hides most of this:</p>
${run('c73-fault', './filemap evict /tmp/data; ./filemap mmap', 1)}
<p>Cold, read front to back: <strong>one</strong> major fault and 35 ms. The first fault noticed a sequential pattern and started <strong>read-ahead</strong>: the kernel fetched the following pages in the background, so later faults found them already arriving and counted as minor. Random access defeats read-ahead — and that is why a database whose working set does not fit in RAM is slow, and why the size of the page cache (Chapter 8) matters so much.</p>
${lab('pagecache', 'seq', 'en', 'A sequential read of a cold file: after the first miss the kernel detects the pattern and reads ahead in growing windows — 4, 8, 16, 32 pages — so later accesses find their page already arriving.')}

<h3>mmap or read?</h3>
${run('c73-fault', './filemap evict /tmp/data; ./filemap read', 1)}
<p>Two ways to get file data. <code>read()</code> asks the kernel to <em>copy</em> bytes from the page cache into your buffer: no page faults on the file at all (the 259 minor faults are the 1 MiB buffer), one syscall per chunk. <code>mmap()</code> maps the page-cache pages <em>directly</em> into your address space: no copy and no syscalls, but a page fault per (group of) page(s) on first touch, page-table entries and TLB pressure. Warm, mmap won here (19.4 vs 23.4 ms); cold, they tied (~34 ms) because both waited for the same disk. Real systems pick both ways: SQLite (optional <code>mmap_size</code>), LMDB, Lucene/Elasticsearch and Prometheus's TSDB map files; PostgreSQL deliberately uses <code>read</code>/<code>write</code> into its own <code>shared_buffers</code>, to control exactly when a page is written and flushed.</p>
${lab('pagecache', 'mmap', 'en', 'read() vs mmap() on a warm file: read copies each page from the page cache into your buffer (a syscall plus a 4 KiB memcpy); mmap maps the cache page itself, so the first touch is a minor fault and the rest are plain loads — zero copies.')}

<div class="pitfall co-tieu-de">
<p><strong>With mmap, an I/O error is a signal, not a return code.</strong> <code>read()</code> returns −1 and sets <code>errno</code> when the disk fails. A mapped file that hits a bad sector, or that another process truncated, delivers <strong>SIGBUS</strong> to whichever line of code touched the page — usually somewhere deep in a loop that "only reads memory". Unhandled, the process dies (exit 135 = 128 + 7). If you mmap files that can change or live on network storage, plan for that, or use <code>read</code>/<code>pread</code>.</p>
</div>

<h3>Copy-on-write: one page, watched by its frame number</h3>
<p>Chapter 1 promised that <code>fork()</code> does not copy memory. Here is the proof at the level of one page:</p>
${src('ch07/cowpfn.c', 'c')}
${run('c73-fault', './cowpfn', 1)}
<p>Right after <code>fork</code>, parent and child map the same virtual address to the <strong>same physical frame</strong> <code>0x10f8f5</code>: one copy in RAM, marked read-only in both page tables. The child's first write faults (exactly 1 page fault); the kernel copies that one page into a new frame <code>0x115db4</code>, points the child's page table at it and lets the write proceed. The parent still sees <code>'P'</code> in the original frame. Nothing else was copied.</p>
${lab('cow', 'fork', 'en', 'fork() with copy-on-write: the parent’s and child’s page tables point at the same frames, marked read-only. Make one of them write: one fault, one 4 KiB page copied, everything else still shared.')}

<h3>The Redis BGSAVE pattern</h3>
<p>Redis saves a snapshot by forking: the child writes the dataset to disk while the parent keeps serving writes. The child sees a frozen copy for free — until the parent writes. This program reproduces that with 512 MiB and a parent that rewrites one byte in W% of the pages while the "save" runs:</p>
${src('ch07/cow.c', 'c')}
${run('c73-fault', 'for w in 0 1 10 50 100', 1)}
<ul>
<li><code>fork</code> of 512 MiB took <strong>~4 ms</strong>: the kernel copies page tables (131,072 entries), not data.</li>
<li>Each first write to a shared page = one fault = one 4 KiB copy: 10% of pages written ⇒ 51 MiB copied; 100% ⇒ the full 512 MiB is now duplicated. <strong>The memory cost of a snapshot is proportional to the pages written during it, not the bytes.</strong></li>
</ul>
${lab('cow', 'bgsave', 'en', 'The BGSAVE calculator: dataset size × writes per second × save duration ⇒ how many pages get touched and how many MiB are copied. The cost follows pages written, not bytes — try a write-heavy minute against a quiet one.')}
${run('c73-fault', './cow 512 10 huge', 1)}
<p>With 2 MiB pages the fork took 0.3 ms (512 entries to copy instead of 131,072), and writing 10% of the 4 KiB slices still copied 51 MiB, not the whole huge pages. Since Linux 5.8, a write to a shared transparent huge page splits it and copies only the 4 KiB that changed; on older kernels it copied the whole 2 MiB, which is why Redis's docs and logs have long warned about THP. Now the real thing — Redis 7.4 in a throw-away container, 260 k keys of 1 KiB, a background save, and 30,000 <code>SET</code>s while it runs:</p>
${lab('cow', 'hugepage', 'en', 'The behaviour Redis warns about — kernels before 5.8, where a write to a shared transparent huge page copied the whole 2 MiB: the same writes now duplicate almost the entire dataset. Toggle the page size between 4 KiB and 2 MiB and compare the MiB copied.')}
${run('c73-redis', 'redis-benchmark -q -t set -n 600000', 3)}
${run('c73-redis', 'redis-cli BGSAVE', 2)}
${run('c73-redis', 'redis-cli INFO persistence', 3)}
<p>The fork took 2,967 µs for a 336 MB dataset. The 30,000 writes — about 11% as many as there are keys, ~30 MB of new values — and the save had to keep <strong>124 MB</strong> of copied pages alive (<code>rdb_last_cow_size</code>), more than a third of the dataset. Each <code>SET</code> touches several scattered pages (the hash-table entry, the old value being freed, allocator metadata), and every first touch of a shared page copies all 4 KiB of it. Redis also checked THP for you:</p>
${run('c73-redis', 'redis-cli CONFIG GET disable-thp', 1)}
<p><code>disable-thp yes</code> (on by default) makes Redis switch THP off for its own process, for the reason above. The production rule: a Redis that forks needs free RAM for <em>dataset × fraction of pages rewritten during the save</em>, on top of the dataset. If that headroom is not there, the copies come from somewhere — swap, or the OOM killer (Chapter 8).</p>

<h3>When RAM is full: page replacement</h3>
<p>So far every fault found a free frame. When none is free, the kernel must <strong>evict</strong> a page — drop it if it is a clean file page, write it to swap if it is dirty anonymous memory — and the choice of victim decides how many future faults you pay. The textbook algorithms, run on the classic exam strings:</p>
${run('c73-fault', 'python3 repl.py 3 7', 1)}
${run('c73-fault', 'for n in 3 4', 1)}
${run('c73-fault', 'for n in 4 5', 1)}
<ul>
<li><strong>OPT</strong> (evict the page needed farthest in the future) is the floor — 9 faults — but needs to know the future. <strong>LRU</strong> (least recently used) gets 12, <strong>FIFO</strong> 15. <strong>Clock</strong> approximates LRU with one "referenced" bit per page; this version (a newly loaded page also gets its bit set, as in the lab) scores 14 here.</li>
<li><strong>Bélády's anomaly</strong>: FIFO with 3 frames makes 9 faults, with 4 frames <strong>10</strong> — more RAM, more faults. LRU and OPT never do this.</li>
<li><strong>The working-set cliff</strong>: a loop over 5 pages with 4 frames faults on <strong>every one</strong> of the 20 references under FIFO, LRU and Clock; with 5 frames, only the first 5. One frame short and every access goes to disk — that is thrashing in miniature.</li>
</ul>
<p>Linux uses an LRU approximation (active/inactive lists, and the multi-generational LRU in newer kernels), not any of these exactly. Run the exam string yourself, change the frame count, and try Bélády's string with 3 then 4 frames:</p>
${lab('vm', 'exam', 'en', 'The Silberschatz reference string with 3 frames: switch FIFO / LRU / Clock / OPT and compare the faults.')}
${lab('vm', 'belady', 'en', "Bélády's anomaly: run FIFO with 3 frames, then 4 — the fault count goes up.")}
${lab('vm', 'loop', 'en', 'A loop over 5 pages: drag the frames slider from 5 to 4 and watch every access become a fault.', { tour: 'vm-thrash' })}
<p>What happens to a whole machine when that happens to everything — swap, thrashing, pressure stall information, and finally the OOM killer — is Chapter 8. Get a feel for it first with the RAM-pressure preset:</p>
${lab('vm', 'pressure', 'en', 'RAM pressure: 5 pages share 3 frames. Every fault now evicts someone; watch the time per access climb.')}

<h3>If you have done OSG202 lesson 3.2</h3>
<p>There you traced FIFO, LRU and OPT by hand and met Bélády's anomaly. The fault counts above are the same answers your exam expects (15 / 12 / 9 for the classic string with 3 frames) — run <code>repl.py</code> to check your own hand traces. What the exam does not show: one major fault cost ~52 µs here against ~0.2 µs for a warm one.</p>
${L(OSG32, '🎓', 'OSG202 · 3.2 — Page faults &amp; replacement', 'FIFO, LRU, OPT and Bélády’s anomaly as in the course textbook.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your Redis (2.5 GB of data) runs on a 4 GB VPS with <code>save 900 1</code>. A few times a week, the box gets slow and once Redis was killed — always during a background save, during the evening peak of writes. You need to explain why and how much headroom is needed.</p>
<ol>
<li>Compile <code>cow.c</code> and run <code>./cow 512 W nohuge</code> for W = 5, 20 and 40. Plot copied MiB against W.</li>
<li>Run the Redis script (<code>c73-redis.sh</code> in a <code>redis:7</code> container) twice: with 30,000 and with 90,000 <code>SET</code>s during the save. Read <code>rdb_last_cow_size</code> each time.</li>
<li>Run <code>./filemap rand</code> cold and warm; compute the cost of one major fault on your machine.</li>
<li>Write the formula for peak memory during a save, and fill it in for the 2.5 GB Redis if 30% of its pages are written during a save.</li>
</ol>
<p><strong>Done when:</strong> your numbers show COW growing with the pages written (not the bytes), and your estimate for the VPS (2.5 GB + 0.3 × 2.5 GB ≈ 3.25 GB, plus the OS) explains why 4 GB is too tight during evening saves.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['page fault', 'A trap when a virtual page has no valid translation for the access; the kernel fixes it or sends SIGSEGV.'],
  ['minor fault', 'Resolved without disk I/O: zero page, page already in RAM/page cache. Around a microsecond.'],
  ['major fault', 'Needs a disk read (file or swap) first. Measured here: ~52 µs each.'],
  ['demand paging', 'Frames are assigned at first touch, not at malloc/mmap time.'],
  ['zero page', 'One shared read-only page of zeros that unwritten anonymous memory reads from.'],
  ['copy-on-write (COW)', 'After fork, pages are shared read-only; the first write copies just that page.'],
  ['read-ahead', 'The kernel fetching the next pages of a file early when it sees sequential access.'],
  ['page replacement', 'Choosing a victim page when RAM is full: OPT, LRU, FIFO, Clock; Linux approximates LRU.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>/usr/bin/time -v</code> and <code>perf stat -e minor-faults,major-faults</code> count faults: one per touched 4 KiB page.</li>
<li>Demand paging: <code>mmap</code> promises; reads map the zero page; the first write gets a real frame.</li>
<li>A cold random read of 65,536 pages took 3.4 s of major faults; warm, 11.6 ms. Read-ahead hides cold sequential reads.</li>
<li>COW shares frames after fork and copies per page on write: a real Redis save kept 124 MB of copies after 30,000 SETs.</li>
<li>When RAM is full, the replacement policy decides the faults; one frame short of the working set and every access faults.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/mmap.2.html', '📄', 'man 2 mmap', 'MAP_PRIVATE vs MAP_SHARED, file mappings, SIGBUS and SIGSEGV.', 'Open')}
${L('https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/', '🧰', 'Redis — Persistence', 'How RDB snapshots fork, copy-on-write and why memory headroom matters.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>RAM được phát ở lần chạm đầu tiên — và có khi một lần chạm tốn 50 µs</h2>
<p class="lead"><code>malloc(1 GiB)</code> trả về tức thì. <code>fork()</code> một tiến trình 512 MiB mất 4 ms. Một lần truy cập bộ nhớ thường tốn ~100 ns, vậy mà có lúc cùng kiểu truy cập đó tốn 50.000 ns. Tất cả đến từ một sự kiện bạn không bao giờ tự gọi: <strong>page fault (lỗi trang)</strong>. Bài này đếm page fault bằng các công cụ chuẩn, tách loại rẻ khỏi loại đắt, nhìn copy-on-write dời đúng một trang sang khung mới, rồi đo xem lần lưu nền của Redis thật sự tốn bao nhiêu RAM.</p>

<h3>Đếm page fault</h3>
<p><strong>Page fault</strong> là lúc CPU báo "trang ảo này không có phép dịch hợp lệ (hoặc không hợp lệ cho kiểu truy cập này)". Nó sập bẫy vào nhân, và nhân quyết định: cấp cho trang một khung rồi thử lại, hay giết tiến trình (SIGSEGV). Chương trình touch của bài 7.2 ghi một byte vào mỗi trang trong 65.536 trang:</p>
${run('c73-fault', '/usr/bin/time -v ./touch', 1)}
${run('c73-fault', 'perf stat -e page-faults,minor-faults', 1)}
<p>Hai công cụ, một đáp án: khoảng 65.600 fault — mỗi trang một lần, cộng vài chục lần để khởi động chương trình. <code>/usr/bin/time -v</code> của GNU (là file chương trình, không phải từ khoá <code>time</code> của shell) tách chúng như cách nhân tách:</p>
<ul>
<li><strong>Minor (nhẹ)</strong> ("reclaiming a frame") — dữ liệu không cần đọc đĩa: một trang số 0 mới, hoặc một trang đã có sẵn trong RAM (page cache, trang dùng chung của tiến trình khác). Tốn cỡ một micro giây hoặc ít hơn.</li>
<li><strong>Major (nặng)</strong> ("requiring I/O") — nhân phải đọc từ đĩa (một file, hoặc swap) trước khi lần truy cập được tiếp tục. Tốn đúng bằng giá của đĩa.</li>
</ul>
<p>Ở đây: 65.589 minor, 1–2 major (nạp một phần chính chương trình). <code>ps -o min_flt,maj_flt -p PID</code> cho đúng hai bộ đếm đó của một tiến trình đang chạy.</p>

<h3>Nạp trang theo yêu cầu: chưa chạm thì chưa có gì thật</h3>
<p>Bài 7.1 cho thấy RSS không nhúc nhích sau <code>malloc(1 GiB)</code>. Đây là cơ chế, từng bước, dùng bit "có mặt" của <code>pagemap</code> từ bài 7.2:</p>
${src('ch07/demand.c', 'c')}
${run('c73-fault', './demand', 1)}
<ul>
<li><strong>Sau <code>mmap</code></strong>: 0 trên 16.384 trang có mặt. Nhân chỉ ghi lại "dải này hợp lệ, đọc-ghi, ẩn danh".</li>
<li><strong>Sau khi đọc mọi trang</strong>: đủ 16.384 trang có mặt, thêm 16.393 fault — vậy mà RSS chỉ tăng 324 kB. Đọc vùng nhớ chưa ai ghi thì phải ra số 0, nên nhân ánh xạ mọi trang tới một <strong>trang số 0 (zero page)</strong> duy nhất, dùng chung, chỉ-đọc. Có mặt, nhưng không phải của bạn.</li>
<li><strong>Sau khi ghi mọi trang</strong>: thêm 16.386 fault nữa, và giờ RSS +64 MiB. Mỗi lần ghi đụng trang số 0 chỉ-đọc, gây fault, và nhân cấp cho trang đó một khung riêng đã xoá về 0 — copy-on-write từ trang số 0.</li>
</ul>
<p>Đó là <strong>nạp trang theo yêu cầu (demand paging)</strong>: bộ nhớ được hứa lúc <code>mmap</code>/<code>malloc</code> và được giao ở lần chạm đầu, từng trang một. Nó là lý do VSZ có thể 4,8 GB trong khi RSS 77 MB, và cũng là lý do "malloc thành công" không có nghĩa bộ nhớ đã tồn tại — Linux có thể hứa nhiều hơn mình có, và hoá đơn tới ở lần chạm đầu (overcommit và OOM killer là Chương 8). Bước qua đủ các loại fault ở đây — mã, dữ liệu, heap, stack, và một con trỏ hỏng kết thúc bằng SIGSEGV:</p>
${lab('vm', 'program', 'vi', 'Một chương trình khởi động: lấy lệnh main(), đẩy khung stack, đọc biến toàn cục, malloc rồi ghi, và một con trỏ hỏng. Nhìn fault nhẹ, fault nặng và SIGSEGV.', { tour: 'vm-translate' })}

<h3>Major fault, đo thật: khi một lần truy cập tốn 50 µs</h3>
<p>Major fault cần một trang đang nằm trên đĩa và không có trong RAM. Chương trình này ánh xạ một file 256 MiB và đọc nó theo nhiều cách; <code>evict</code> dùng <code>posix_fadvise(DONTNEED)</code> để đẩy các trang của file ra khỏi page cache, nên ta bắt đầu "nguội" được mà không cần root:</p>
${src('ch07/filemap.c', 'c')}
${run('c73-fault', './filemap make', 2)}
${run('c73-fault', './filemap evict /tmp/data; ./filemap cached', 1)}
<p>File nguội, chạm theo thứ tự trang ngẫu nhiên, tắt đọc trước (<code>MADV_RANDOM</code>) — đúng kiểu truy cập của một lần tra chỉ mục trong CSDL:</p>
${run('c73-fault', '/usr/bin/time -v ./filemap rand', 1)}
${run('c73-fault', './filemap rand', 1)}
<p><strong>65.536 major fault, 3,4 giây</strong> — khoảng 52 µs mỗi lần, lần nào cũng là một lần đọc đĩa mà tiến trình phải ngủ chờ. Chạy lại: các trang giờ đã nằm trong page cache, 0 major fault, <strong>11,6 ms</strong>. Cùng code, cùng dữ liệu, nhanh hơn ~300 lần, chỉ vì các trang nằm ở đâu. (4.098 minor fault của lần chạy "ấm" là 65.536 / 16: khi có fault, nhân ánh xạ luôn tới 16 trang lân cận đã có trong cache — "fault-around".) Và "đĩa" của VM này là một file trên SSD nhanh của Mac; trên ổ đĩa đám mây, mỗi major fault có thể đắt gấp vài lần.</p>
${lab('pagecache', 'random', 'vi', 'Đọc ngẫu nhiên một file nguội, từng trang một: read-ahead không đoán được trang kế nên trang nào cũng là một chuyến xuống đĩa — một major fault bạn phải ngủ chờ. So bộ đếm lần đọc đĩa với lần đọc tuần tự bên dưới.')}
<p>Truy cập tuần tự che đi phần lớn chuyện này:</p>
${run('c73-fault', './filemap evict /tmp/data; ./filemap mmap', 1)}
<p>Nguội, đọc từ đầu tới cuối: <strong>một</strong> major fault và 35 ms. Fault đầu tiên nhận ra kiểu tuần tự và khởi động <strong>đọc trước (read-ahead)</strong>: nhân lấy các trang tiếp theo ở chế độ nền, nên các fault sau thấy trang đang tới và được tính là minor. Truy cập ngẫu nhiên vô hiệu hoá đọc trước — đó là lý do một CSDL có tập dữ liệu làm việc không vừa RAM sẽ chậm, và vì sao cỡ page cache (Chương 8) quan trọng tới vậy.</p>
${lab('pagecache', 'seq', 'vi', 'Đọc tuần tự một file nguội: sau lần trượt đầu tiên nhân nhận ra kiểu truy cập và đọc trước theo cửa sổ lớn dần — 4, 8, 16, 32 trang — nên các lần sau thấy trang của mình đã đang tới.')}

<h3>mmap hay read?</h3>
${run('c73-fault', './filemap evict /tmp/data; ./filemap read', 1)}
<p>Hai cách lấy dữ liệu file. <code>read()</code> nhờ nhân <em>chép</em> byte từ page cache vào bộ đệm của bạn: không có page fault nào trên file (259 minor fault là của bộ đệm 1 MiB), mỗi khúc một syscall. <code>mmap()</code> ánh xạ <em>thẳng</em> các trang page cache vào không gian địa chỉ của bạn: không chép, không syscall, nhưng mỗi (nhóm) trang tốn một page fault ở lần chạm đầu, cộng mục bảng trang và áp lực lên TLB. Khi ấm, mmap thắng ở đây (19,4 so với 23,4 ms); khi nguội, hai bên ngang nhau (~34 ms) vì cùng chờ một cái đĩa. Hệ thống thật chọn cả hai: SQLite (tuỳ chọn <code>mmap_size</code>), LMDB, Lucene/Elasticsearch và TSDB của Prometheus ánh xạ file; PostgreSQL cố ý dùng <code>read</code>/<code>write</code> vào <code>shared_buffers</code> của riêng nó, để kiểm soát chính xác lúc một trang được ghi và đẩy xuống đĩa.</p>
${lab('pagecache', 'mmap', 'vi', 'read() so với mmap() trên file ấm: read chép từng trang từ page cache vào bộ đệm của bạn (một syscall cộng một lần memcpy 4 KiB); mmap ánh xạ thẳng trang cache, nên lần chạm đầu là một minor fault, còn lại là lệnh nạp bộ nhớ thường — không chép lần nào.')}

<div class="pitfall co-tieu-de">
<p><strong>Với mmap, lỗi I/O là một tín hiệu, không phải mã trả về.</strong> <code>read()</code> trả −1 và đặt <code>errno</code> khi đĩa hỏng. Một file đã ánh xạ gặp sector hỏng, hay bị tiến trình khác cắt ngắn, sẽ giao <strong>SIGBUS</strong> cho đúng dòng code chạm vào trang đó — thường nằm sâu trong một vòng lặp "chỉ đọc bộ nhớ". Không xử lý thì tiến trình chết (exit 135 = 128 + 7). Nếu bạn mmap những file có thể đổi hoặc nằm trên ổ mạng, hãy tính trước chuyện đó, hoặc dùng <code>read</code>/<code>pread</code>.</p>
</div>

<h3>Copy-on-write: một trang, theo dõi bằng số khung</h3>
<p>Chương 1 hứa rằng <code>fork()</code> không chép bộ nhớ. Đây là bằng chứng ở mức một trang:</p>
${src('ch07/cowpfn.c', 'c')}
${run('c73-fault', './cowpfn', 1)}
<p>Ngay sau <code>fork</code>, cha và con ánh xạ cùng địa chỉ ảo tới <strong>cùng một khung vật lý</strong> <code>0x10f8f5</code>: một bản trong RAM, đánh dấu chỉ-đọc trong cả hai bảng trang. Lần ghi đầu của con gây fault (đúng 1 page fault); nhân chép đúng trang đó sang khung mới <code>0x115db4</code>, trỏ bảng trang của con vào đó và cho lần ghi đi tiếp. Cha vẫn thấy <code>'P'</code> trong khung gốc. Không có gì khác bị chép.</p>
${lab('cow', 'fork', 'vi', 'fork() với copy-on-write: bảng trang của cha và con trỏ chung các khung, đánh dấu chỉ đọc. Cho một bên ghi: một fault, một trang 4 KiB được chép, phần còn lại vẫn dùng chung.')}

<h3>Kiểu BGSAVE của Redis</h3>
<p>Redis lưu ảnh chụp bằng cách fork: tiến trình con ghi tập dữ liệu xuống đĩa trong khi cha tiếp tục phục vụ lệnh ghi. Con thấy một bản đóng băng miễn phí — cho tới khi cha ghi. Chương trình này tái hiện điều đó với 512 MiB và một tiến trình cha ghi lại một byte trong W% số trang trong lúc "lưu":</p>
${src('ch07/cow.c', 'c')}
${run('c73-fault', 'for w in 0 1 10 50 100', 1)}
<ul>
<li><code>fork</code> 512 MiB tốn <strong>~4 ms</strong>: nhân chép bảng trang (131.072 mục), không chép dữ liệu.</li>
<li>Mỗi lần ghi đầu vào một trang dùng chung = một fault = chép 4 KiB: ghi 10% số trang ⇒ chép 51 MiB; 100% ⇒ cả 512 MiB giờ bị nhân đôi. <strong>Giá bộ nhớ của một ảnh chụp tỉ lệ với số trang bị ghi trong lúc chụp, không phải số byte.</strong></li>
</ul>
${lab('cow', 'bgsave', 'vi', 'Máy tính BGSAVE: cỡ dữ liệu × số lệnh ghi mỗi giây × thời gian lưu ⇒ bao nhiêu trang bị chạm và bao nhiêu MiB bị chép. Tốn bộ nhớ theo số trang bị ghi, không theo số byte — thử một phút ghi dồn dập so với một phút yên ả.')}
${run('c73-fault', './cow 512 10 huge', 1)}
<p>Với trang 2 MiB, fork chỉ mất 0,3 ms (chép 512 mục thay vì 131.072), và ghi 10% các lát 4 KiB vẫn chỉ chép 51 MiB, không phải nguyên các huge page. Từ Linux 5.8, ghi vào một transparent huge page dùng chung sẽ tách nó ra và chỉ chép 4 KiB bị đổi; nhân cũ hơn chép nguyên 2 MiB, nên tài liệu và log của Redis từ lâu đã cảnh báo về THP. Giờ tới đồ thật — Redis 7.4 trong một container vứt đi, 260 nghìn khoá 1 KiB, một lần lưu nền, và 30.000 lệnh <code>SET</code> trong lúc nó chạy:</p>
${lab('cow', 'hugepage', 'vi', 'Hành vi Redis cảnh báo — nhân trước 5.8, khi một lần ghi vào trang lớn trong suốt dùng chung chép nguyên 2 MiB: cùng số lệnh ghi giờ nhân đôi gần hết dữ liệu. Đổi cỡ trang giữa 4 KiB và 2 MiB và so số MiB bị chép.')}
${run('c73-redis', 'redis-benchmark -q -t set -n 600000', 3)}
${run('c73-redis', 'redis-cli BGSAVE', 2)}
${run('c73-redis', 'redis-cli INFO persistence', 3)}
<p>Fork tốn 2.967 µs cho tập dữ liệu 336 MB. 30.000 lệnh ghi — bằng khoảng 11% số khoá, ~30 MB giá trị mới — vậy mà lần lưu phải giữ sống <strong>124 MB</strong> trang bị chép (<code>rdb_last_cow_size</code>), hơn một phần ba tập dữ liệu. Mỗi lệnh <code>SET</code> chạm vài trang nằm rải rác (mục trong bảng băm, giá trị cũ đang được giải phóng, siêu dữ liệu của bộ cấp phát), và lần chạm đầu vào một trang dùng chung nào cũng chép nguyên 4 KiB của nó. Redis còn tự kiểm THP giúp bạn:</p>
${run('c73-redis', 'redis-cli CONFIG GET disable-thp', 1)}
<p><code>disable-thp yes</code> (bật sẵn theo mặc định) khiến Redis tự tắt THP cho tiến trình của nó, vì lý do ở trên. Luật cho production: một Redis có fork cần RAM trống bằng <em>cỡ dữ liệu × tỉ lệ trang bị ghi lại trong lúc lưu</em>, cộng thêm vào cỡ dữ liệu. Không có khoảng dư đó thì các bản chép phải lấy từ đâu đó — swap, hoặc OOM killer (Chương 8).</p>

<h3>Khi RAM đầy: thay trang</h3>
<p>Tới giờ, fault nào cũng tìm được khung trống. Khi không còn khung trống, nhân phải <strong>đuổi (evict)</strong> một trang — bỏ đi nếu là trang file sạch, ghi ra swap nếu là bộ nhớ ẩn danh đã bẩn — và việc chọn nạn nhân quyết định bạn sẽ trả bao nhiêu fault sau này. Các thuật toán trong giáo trình, chạy trên những chuỗi đề thi kinh điển:</p>
${run('c73-fault', 'python3 repl.py 3 7', 1)}
${run('c73-fault', 'for n in 3 4', 1)}
${run('c73-fault', 'for n in 4 5', 1)}
<ul>
<li><strong>OPT</strong> (đuổi trang sẽ được cần tới muộn nhất trong tương lai) là sàn — 9 fault — nhưng cần biết trước tương lai. <strong>LRU</strong> (lâu nhất chưa dùng) được 12, <strong>FIFO</strong> 15. <strong>Clock</strong> xấp xỉ LRU bằng một bit "đã tham chiếu" cho mỗi trang; phiên bản này (trang vừa nạp cũng được bật bit, như trong lab) ra 14 ở đây.</li>
<li><strong>Nghịch lý Bélády</strong>: FIFO với 3 khung gây 9 fault, với 4 khung lại <strong>10</strong> — nhiều RAM hơn, nhiều fault hơn. LRU và OPT không bao giờ bị vậy.</li>
<li><strong>Bờ vực working set</strong>: một vòng lặp qua 5 trang với 4 khung gây fault ở <strong>mọi</strong> lần trong 20 lần tham chiếu với FIFO, LRU và Clock; với 5 khung, chỉ 5 lần đầu. Thiếu một khung là mọi lần truy cập đều phải xuống đĩa — đó là thrashing thu nhỏ.</li>
</ul>
<p>Linux dùng một phép xấp xỉ LRU (danh sách active/inactive, và multi-generational LRU ở các nhân mới), không dùng đúng thuật toán nào ở trên. Tự chạy chuỗi đề thi, đổi số khung, và thử chuỗi Bélády với 3 rồi 4 khung:</p>
${lab('vm', 'exam', 'vi', 'Chuỗi tham chiếu của Silberschatz với 3 khung: đổi FIFO / LRU / Clock / OPT và so số fault.')}
${lab('vm', 'belady', 'vi', 'Nghịch lý Bélády: chạy FIFO với 3 khung, rồi 4 khung — số fault lại tăng.')}
${lab('vm', 'loop', 'vi', 'Vòng lặp qua 5 trang: kéo thanh số khung từ 5 về 4 và nhìn mọi lần truy cập biến thành fault.', { tour: 'vm-thrash' })}
<p>Chuyện gì xảy ra với cả một cỗ máy khi điều đó xảy ra với mọi thứ — swap, thrashing, pressure stall information, và cuối cùng là OOM killer — là Chương 8. Cảm nhận nó trước bằng preset thiếu RAM:</p>
${lab('vm', 'pressure', 'vi', 'Thiếu RAM: 5 trang chia nhau 3 khung. Giờ fault nào cũng phải đuổi ai đó; nhìn thời gian mỗi lần truy cập leo lên.')}

<h3>Nếu bạn đã học OSG202 bài 3.2</h3>
<p>Ở đó bạn lần tay FIFO, LRU và OPT và gặp nghịch lý Bélády. Số fault ở trên chính là đáp án đề thi mong đợi (15 / 12 / 9 cho chuỗi kinh điển với 3 khung) — chạy <code>repl.py</code> để kiểm bài lần tay của bạn. Điều đề thi không cho thấy: một major fault ở đây tốn ~52 µs, so với ~0,2 µs cho một lần "ấm".</p>
${L(OSG32, '🎓', 'OSG202 · 3.2 — Lỗi trang &amp; thay trang', 'FIFO, LRU, OPT và nghịch lý Bélády theo giáo trình môn học.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> Redis của bạn (2,5 GB dữ liệu) chạy trên một VPS 4 GB với <code>save 900 1</code>. Vài lần mỗi tuần máy chậm hẳn và đã một lần Redis bị giết — lần nào cũng trong lúc lưu nền, vào giờ cao điểm ghi buổi tối. Bạn cần giải thích vì sao và cần dư bao nhiêu.</p>
<ol>
<li>Biên dịch <code>cow.c</code> và chạy <code>./cow 512 W nohuge</code> với W = 5, 20 và 40. Vẽ số MiB bị chép theo W.</li>
<li>Chạy kịch bản Redis (<code>c73-redis.sh</code> trong container <code>redis:7</code>) hai lần: với 30.000 và với 90.000 lệnh <code>SET</code> trong lúc lưu. Đọc <code>rdb_last_cow_size</code> mỗi lần.</li>
<li>Chạy <code>./filemap rand</code> nguội và ấm; tính giá một major fault trên máy bạn.</li>
<li>Viết công thức bộ nhớ đỉnh trong lúc lưu, và điền số cho Redis 2,5 GB nếu 30% số trang bị ghi trong lúc lưu.</li>
</ol>
<p><strong>Đạt khi:</strong> số đo của bạn cho thấy COW tăng theo số trang bị ghi (không theo số byte), và ước lượng cho VPS (2,5 GB + 0,3 × 2,5 GB ≈ 3,25 GB, cộng hệ điều hành) giải thích được vì sao 4 GB là quá sát vào giờ lưu buổi tối.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['page fault (lỗi trang)', 'Một lần sập bẫy khi trang ảo không có phép dịch hợp lệ cho kiểu truy cập; nhân sửa hoặc gửi SIGSEGV.'],
  ['minor fault (lỗi trang nhẹ)', 'Giải quyết không cần đọc đĩa: trang số 0, trang đã có trong RAM/page cache. Cỡ một micro giây.'],
  ['major fault (lỗi trang nặng)', 'Phải đọc đĩa (file hoặc swap) trước. Đo ở đây: ~52 µs mỗi lần.'],
  ['demand paging (nạp trang theo yêu cầu)', 'Khung được cấp ở lần chạm đầu, không phải lúc malloc/mmap.'],
  ['zero page (trang số 0)', 'Một trang toàn số 0, dùng chung, chỉ-đọc, mà bộ nhớ ẩn danh chưa ghi sẽ đọc từ đó.'],
  ['copy-on-write (COW — chép khi ghi)', 'Sau fork, các trang dùng chung chỉ-đọc; lần ghi đầu chỉ chép đúng trang đó.'],
  ['read-ahead (đọc trước)', 'Nhân lấy sớm các trang tiếp theo của file khi thấy truy cập tuần tự.'],
  ['page replacement (thay trang)', 'Chọn trang nạn nhân khi RAM đầy: OPT, LRU, FIFO, Clock; Linux xấp xỉ LRU.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>/usr/bin/time -v</code> và <code>perf stat -e minor-faults,major-faults</code> đếm fault: mỗi trang 4 KiB được chạm một lần.</li>
<li>Nạp theo yêu cầu: <code>mmap</code> chỉ hứa; đọc thì trỏ vào trang số 0; lần ghi đầu mới có khung thật.</li>
<li>Đọc ngẫu nhiên 65.536 trang nguội tốn 3,4 giây major fault; ấm thì 11,6 ms. Đọc trước che được đọc tuần tự nguội.</li>
<li>COW dùng chung khung sau fork và chép từng trang khi ghi: một lần lưu Redis thật giữ 124 MB bản chép sau 30.000 lệnh SET.</li>
<li>Khi RAM đầy, chính sách thay trang quyết định số fault; thiếu một khung so với working set là lần truy cập nào cũng fault.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/mmap.2.html', '📄', 'man 2 mmap', 'MAP_PRIVATE và MAP_SHARED, ánh xạ file, SIGBUS và SIGSEGV.', 'Mở')}
${L('https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/', '🧰', 'Redis — Persistence', 'Ảnh chụp RDB fork thế nào, copy-on-write và vì sao cần dư bộ nhớ.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 7.4 — Allocators and garbage collectors ───────────────────────── */
    {
      title: '7.4 — Allocators and garbage collectors: malloc, arenas, fragmentation, V8, JVM — and finding leaks|||7.4 — Bộ cấp phát và bộ gom rác: malloc, arena, phân mảnh, V8, JVM — và tìm rò rỉ bộ nhớ',
      slug: 'os-7-4-allocator',
      type: 'LESSON',
      isFreePreview: true,
      description: 'malloc là thư viện chứ không phải syscall: brk, mmap và ngưỡng động nhìn bằng strace; 100 luồng tạo 80 arena glibc, RSS 164 MB cho 293 kB dữ liệu; phân mảnh làm RSS kẹt ở 120 MB khi dữ liệu sống là 0; heap V8 và --max-old-space-size (exit 134), heap snapshot; G1 vs ZGC đo thật; và tìm rò rỉ bằng valgrind, ASan và heapUsed của Node.',
      content: `${G74}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>free() did not give the memory back — and that is not always a leak</h2>
<p class="lead">You free everything and RSS stays at 120 MB. A Java service with <code>-Xmx512m</code> sits at 1 GB of RSS. A Node API dies with "JavaScript heap out of memory" while the machine has gigabytes free. These are the everyday memory puzzles of a backend developer, and none of them is answered by the kernel alone: between your code and the pages of lessons 7.1–7.3 sits an <strong>allocator</strong> (C's <code>malloc</code>) or a <strong>garbage collector</strong> (V8, the JVM). This lesson watches each of them talk to the kernel, measures their overheads, and then hunts real leaks with valgrind, AddressSanitizer and Node's own heap numbers.</p>

<h3>malloc is a library, not a system call</h3>
<p>The kernel only hands out memory in pages, through two syscalls: <code>brk</code> (move the end of the heap) and <code>mmap</code> (map a new region). <code>malloc</code> is glibc code that gets big chunks from those two and cuts them into the small pieces you ask for. Watch it with <code>strace</code>:</p>
${src('ch07/mal.c', 'c')}
${run('c74-cap-phat', 'strace -e trace=brk', 1)}
<ul>
<li>The first <code>malloc(100)</code> grows the heap with <code>brk</code> — here by about 1.1 MB, up to a 2 MiB boundary (the glibc 2.43 in this lab rounds the end of the heap up to a huge-page-sized boundary). The second <code>malloc(100)</code> makes <strong>no syscall at all</strong>: it is cut from what is already there. Most allocations never reach the kernel.</li>
<li><code>malloc(200 KiB)</code> also fits in the heap's free top, so no syscall either.</li>
<li><code>malloc(4 MiB)</code> does not fit: glibc gives big requests their own <code>mmap</code> (threshold 128 KiB by default), and <code>free</code> hands them straight back with <code>munmap</code>.</li>
<li>The second <code>malloc(4 MiB)</code> comes from <code>brk</code>! glibc's threshold is <strong>dynamic</strong>: after you free an mmapped block, it raises the threshold to that size (up to 32 MiB), betting that you will ask again and that the heap is cheaper. Your mental model "big ⇒ mmap" is only a default.</li>
</ul>
<p>See where the two kinds of memory live in the address space:</p>
${lab('memory', 'layout', 'en', 'The heap (brk, grows up from the program) and the mmap region (big mallocs, libraries, files). Run it again and watch both move with ASLR.')}

<h3>Arenas: why threads multiply your memory</h3>
<p>If every thread used one heap, every <code>malloc</code> would fight for one lock. So glibc gives threads separate <strong>arenas</strong> — independent heaps — up to 8 × the number of cores, each reserving a 64 MiB region of address space:</p>
${src('ch07/arena.c', 'c')}
${run('c74-cap-phat', 'for n in 1 4 16 100', 1)}
${run('c74-cap-phat', 'MALLOC_ARENA_MAX=2', 1)}
<p>100 threads that each <code>malloc</code> a single kilobyte: <strong>80 arenas</strong> (8 × 10 cores), 6 GB of VSZ — and <strong>164 MB of RSS for 293 kB of data</strong>. The column in parentheses says why the RSS is real: each arena's first touched block became a 2 MiB transparent huge page (lesson 7.2). With <code>MALLOC_ARENA_MAX=2</code> the same program needs 4.3 MB. This is the classic "JVM RSS far above <code>-Xmx</code>" problem: a Spring Boot service has a couple of hundred threads, and native code under the JVM (Netty, zip, TLS, JNI libraries) mallocs from every one of them. Setting <code>MALLOC_ARENA_MAX=2</code> (or switching the process to jemalloc) is the usual fix — trading a little lock contention for a lot of memory.</p>

<h3>Fragmentation: free memory you cannot give back</h3>
${src('ch07/frag.c', 'c')}
${run('c74-cap-phat', './frag', 1)}
<ol>
<li>One million 100-byte blocks = 100 MB of data, 118.7 MB of RSS: each block carries a header and is rounded up to 112 bytes.</li>
<li>Free every other block: half the data is gone, RSS does not move. Every 4 KiB page still holds live blocks, so no page can be returned.</li>
<li><code>malloc_trim(0)</code> — "give everything you can back" — changes nothing, for the same reason.</li>
<li>Now ask for 500,000 blocks of 200 bytes. There are 50 MB of free holes, but each hole is 112 bytes: a 200-byte block does not fit. glibc takes <strong>new</strong> memory: RSS 220.6 MB for 150 MB of data. That is <strong>fragmentation</strong>.</li>
<li>Free everything except the very last 100-byte block: live data is ~0, RSS is still 120.6 MB. The heap can only shrink from its top (<code>brk</code> moves one way), and the last block sits at the top, pinning everything below it.</li>
<li><code>malloc_trim(0)</code> now returns the free pages in the middle (it uses <code>madvise</code> on them): RSS 13.8 MB.</li>
</ol>
<p>This is why a long-running server's RSS climbs after a traffic peak and stays there even though nothing leaks: the allocator holds freed memory in a shape it cannot return. Allocators designed for servers (jemalloc, tcmalloc, mimalloc) fight it with size classes and by returning pages actively; Redis has <code>activedefrag</code>; garbage-collected runtimes solve it differently — by <em>moving</em> live objects together.</p>

<div class="pitfall co-tieu-de">
<p><strong>"RSS went up and never came down" is not proof of a leak.</strong> In the runs above, RSS stayed at 120 MB with no live data (fragmentation), and 100 threads cost 164 MB for 293 kB of data (arenas + THP). A leak is memory your program still references but will never use again, and its signature is that the live data <em>after garbage collection</em> keeps growing with the amount of work done. Measure that number before you go hunting.</p>
</div>

<h3>Garbage collectors: V8</h3>
<p>Node never calls <code>free</code>. V8 allocates objects in its own heap (new objects in a small young space, survivors moved to an old space) and periodically finds which objects are still reachable and reclaims the rest. Its heap has a hard ceiling:</p>
${src('ch07/gc.js', 'javascript')}
${run('c74-cap-phat', 'node gc.js limits', 1)}
${run('c74-cap-phat', 'node --max-old-space-size=64', 1)}
<p>By default V8 picked a 2,096 MB limit from the machine's RAM; <code>--max-old-space-size=64</code> sets the old space to 64 MB (the reported limit of 112 MB includes the young generation). Now keep allocating and never let go:</p>
${run('c74-cap-phat', 'node --max-old-space-size=64 gc.js grow', 1)}
<p>As <code>heapUsed</code> approaches the limit, V8 runs ever longer full collections (mark-compact) that free nothing, then gives up: <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code> and exit code <strong>134</strong> = 128 + 6, SIGABRT — V8 aborts itself. Note this happened with gigabytes of RAM free: it is V8's limit, not the kernel's. Note also that <code>rss</code> (138 MB) is far above <code>heapUsed</code> (62 MB): RSS also contains V8's code, the young generation, Node's own C++ memory and buffers. In a container with a memory limit the race goes the other way — if the limit is below what V8 thinks it may use, the kernel kills the process first with exit 137 (Chapter 8).</p>
<p>When the heap grows, a <strong>heap snapshot</strong> tells you what it is made of:</p>
${run('c74-cap-phat', 'node gc.js snapshot', 1)}
<p>A 31 MB file describing 453,202 objects; the top lines already name the suspect: 100,000 <code>Session</code> objects. Open the same file (<code>v8.writeHeapSnapshot()</code>, or <code>node --heapsnapshot-signal=SIGUSR2</code> on a running server) in Chrome DevTools → Memory, and the "Retainers" panel shows the chain that keeps them alive — here, the <code>sessions</code> Map.</p>

<h3>Garbage collectors: the JVM, G1 and ZGC</h3>
${src('ch07/Gc.java', 'java')}
${run('c74-cap-phat', 'java -XX:+PrintFlagsFinal', 1)}
<p>Without <code>-Xmx</code> the JVM takes <strong>25% of RAM</strong> as the maximum heap (<code>MaxRAMPercentage</code>: 1,984 MiB of this 7.9 GB VM) and picks G1 as the collector. Same program, 256 MB heap, two collectors:</p>
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseG1GC Gc', 1)}
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseG1GC -Xlog', 1)}
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseZGC -XX:+ZGenerational Gc', 1)}
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseZGC -XX:+ZGenerational -Xlog', 1)}
<ul>
<li><strong>G1</strong> (default): 100 young collections, about 1 ms each, 97 ms of stop-the-world pauses in total. During a pause every application thread waits — that is the latency your API's p99 sees.</li>
<li><strong>ZGC</strong> (generational, Java 21): pauses of <strong>5–12 µs</strong>, about 1 ms in total over 348 pauses, because almost all work happens <em>concurrently</em> with the program: 292 + 247 ms of GC work ran on GC threads beside your code. ZGC buys tiny pauses with extra CPU and memory headroom.</li>
</ul>
<p>Rule of thumb for Spring Boot: G1 is a good default; ZGC when p99 latency matters more than CPU; and always set the heap deliberately in containers (Chapter 8 measures what <code>-XX:MaxRAMPercentage</code> and a container limit do together). Every collector needs <strong>free space to work in</strong> — a heap that is always 95% full spends its life collecting.</p>

<h3>Finding real leaks: valgrind, ASan, and Node's heap</h3>
<p>Here is a C request handler that forgets to <code>free</code>, plus (with an argument) one that uses memory after freeing it:</p>
${src('ch07/leak.c', 'c')}
${run('c74-cap-phat', 'valgrind', 1)}
<p><strong>valgrind</strong> runs the program on a simulated CPU, tracks every allocation and, at exit, reports blocks nobody points to any more: 100,000 bytes in 1,000 blocks, allocated at <code>leak.c:7</code> inside <code>handle_request</code>. It needs no recompilation, but runs the program 10–50× slower. <strong>AddressSanitizer</strong> (ASan) is compiled in with <code>-fsanitize=address</code>, costs about 2× and includes LeakSanitizer:</p>
${run('c74-cap-phat', './leak-asan 2', 1)}
${run('c74-cap-phat', './leak-asan uaf', 1)}
<p>Same leak, same line. And ASan stops a <strong>use-after-free</strong> on the exact read (<code>leak.c:20</code>) and tells you where the block was freed (<code>leak.c:19</code>) — the kind of bug that otherwise reads stale data silently, or becomes a security hole (Chapter 13). Every out-of-bounds write is caught the same way; this lab shows what such a write overwrites when nothing checks it:</p>
${lab('memory', 'overflow', 'en', 'A 30-byte input into a 16-byte stack buffer: watch it run over the canary and the return address. ASan stops the first byte past the buffer.')}
<p>In a garbage-collected language a leak is an object you still <em>reference</em>, so valgrind cannot see it. The classic Node version is a module-level cache keyed by something unique per request:</p>
${src('ch07/leak.js', 'javascript')}
${run('c74-cap-phat', 'node --expose-gc leak.js bug', 1)}
${run('c74-cap-phat', 'node --expose-gc leak.js fixed', 1)}
<p>The method: force a collection first (<code>global.gc()</code> under <code>--expose-gc</code>), then read <code>heapUsed</code>. With the bug it grows <strong>in proportion to the requests served</strong> — 14 → 25 → 38 → 47 MB — and <code>cache.size</code> equals the request count. With a bound of 1,000 entries it is flat at 3.7 MB. In production you get the same signal from a heap-used-after-GC metric; then you take two heap snapshots a few minutes apart and use DevTools' "Comparison" view to see which constructor grew.</p>

<h3>If you have done OSG202 Chapter 3</h3>
<p>OSG202 covers memory from the kernel's side: frames, pages, tables, replacement. This lesson is the layer above that the exam skips and production never does — the allocator and the garbage collector that decide when your program asks the kernel for pages and when it gives them back.</p>
${L(OSG31, '🎓', 'OSG202 · 3.1 — Paging &amp; virtual memory', 'The kernel-side view that malloc and the GC are built on.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your Node API container restarts every two days; the memory graph is a slow ramp. One teammate says "it's a leak", another says "Node just doesn't give memory back". You will decide with measurements before anyone changes code.</p>
<ol>
<li>Run <code>node --expose-gc leak.js bug</code> and <code>fixed</code>. Write down <code>heapUsed</code> after GC at each step and the slope in MB per 50,000 requests.</li>
<li>Run <code>node gc.js snapshot</code>, then change it to keep 300,000 sessions. Which line of the summary grows, and by how much?</li>
<li>Run <code>./frag</code> and explain step 5 in one sentence. Then run <code>./arena 100</code> with and without <code>MALLOC_ARENA_MAX=2</code>.</li>
<li>Compile <code>leak.c</code> with <code>-fsanitize=address</code>, run it with and without <code>uaf</code>, and match each report to a line of the source.</li>
</ol>
<p><strong>Done when:</strong> you can state the rule you would apply to the production graph — "leak if heap-used-after-GC grows with traffic; fragmentation/arenas if RSS grows but heap-used-after-GC is flat" — and back each half with one of your measurements.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['allocator (malloc)', 'Library code that gets pages from the kernel (brk, mmap) and cuts them into the blocks you request.'],
  ['brk / mmap threshold', 'Small requests come from the brk heap; large ones get their own mmap (128 KiB by default, adjusted dynamically).'],
  ['arena', 'An independent glibc heap for a group of threads; up to 8 × cores; MALLOC_ARENA_MAX caps it.'],
  ['fragmentation', 'Free memory split into pieces too small or too scattered to reuse or return to the OS.'],
  ['garbage collector', 'Runtime component that finds unreachable objects and reclaims them (V8, G1, ZGC).'],
  ['stop-the-world pause', 'Time all application threads wait while the GC works: G1 ~1 ms here, ZGC ~10 µs.'],
  ['heap snapshot', 'A dump of every object on a V8 heap with sizes and references, for DevTools.'],
  ['valgrind / ASan', 'Leak and memory-error detectors: simulated CPU (slow, no rebuild) / compiled-in checks (~2×).'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>malloc</code> makes syscalls rarely: <code>brk</code> for the heap, <code>mmap</code> for big blocks, with a threshold that adapts.</li>
<li>glibc arenas let threads allocate without contention but multiply RSS: 100 threads, 80 arenas, 164 MB for 293 kB; <code>MALLOC_ARENA_MAX=2</code> → 4.3 MB.</li>
<li>Fragmentation keeps freed memory resident (120.6 MB with nothing live) until <code>malloc_trim</code> or the shape allows it.</li>
<li>V8 dies at its own heap limit (exit 134); G1 pauses ~1 ms, generational ZGC ~10 µs at the cost of concurrent CPU.</li>
<li>Find leaks with valgrind/ASan in C and with heap-used-after-GC + snapshots in Node; RSS alone does not prove a leak.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/mallopt.3.html', '📄', 'man 3 mallopt', 'M_MMAP_THRESHOLD, M_ARENA_MAX and the MALLOC_* environment variables.', 'Open')}
${L('https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot', '🟢', 'Node.js — Using heap snapshots', 'Taking and comparing heap snapshots to find what keeps memory alive.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>free() không trả bộ nhớ lại — và đó không phải lúc nào cũng là rò rỉ</h2>
<p class="lead">Bạn free hết mà RSS vẫn ở 120 MB. Một dịch vụ Java với <code>-Xmx512m</code> ngồi ở 1 GB RSS. Một API Node chết với "JavaScript heap out of memory" trong khi máy còn trống hàng gigabyte. Đó là những câu đố bộ nhớ thường ngày của lập trình viên backend, và không câu nào trả lời được chỉ bằng nhân: nằm giữa code của bạn và các trang của bài 7.1–7.3 là một <strong>bộ cấp phát (allocator)</strong> (<code>malloc</code> của C) hoặc một <strong>bộ gom rác (garbage collector)</strong> (V8, JVM). Bài này nhìn từng thứ nói chuyện với nhân, đo phần chi phí phụ của chúng, rồi săn rò rỉ thật bằng valgrind, AddressSanitizer và chính các con số heap của Node.</p>

<h3>malloc là thư viện, không phải lời gọi hệ thống</h3>
<p>Nhân chỉ phát bộ nhớ theo trang, qua hai syscall: <code>brk</code> (dời điểm cuối của heap) và <code>mmap</code> (ánh xạ một vùng mới). <code>malloc</code> là code của glibc lấy những khối lớn qua hai đường đó rồi cắt thành những mẩu nhỏ bạn xin. Nhìn nó bằng <code>strace</code>:</p>
${src('ch07/mal.c', 'c')}
${run('c74-cap-phat', 'strace -e trace=brk', 1)}
<ul>
<li><code>malloc(100)</code> đầu tiên nới heap bằng <code>brk</code> — ở đây khoảng 1,1 MB, tới một mốc 2 MiB (glibc 2.43 trong lab này làm tròn điểm cuối heap lên một mốc cỡ huge page). <code>malloc(100)</code> thứ hai <strong>không gọi syscall nào</strong>: nó được cắt từ phần đã có. Phần lớn lần cấp phát không bao giờ chạm tới nhân.</li>
<li><code>malloc(200 KiB)</code> cũng vừa phần trống ở đỉnh heap, nên cũng không có syscall.</li>
<li><code>malloc(4 MiB)</code> không vừa: glibc cho các yêu cầu lớn một <code>mmap</code> riêng (ngưỡng mặc định 128 KiB), và <code>free</code> trả thẳng lại bằng <code>munmap</code>.</li>
<li><code>malloc(4 MiB)</code> lần hai lại đến từ <code>brk</code>! Ngưỡng của glibc là <strong>động</strong>: sau khi bạn free một khối đã mmap, nó nâng ngưỡng lên bằng cỡ đó (tối đa 32 MiB), cược rằng bạn sẽ xin lại và heap thì rẻ hơn. Hình dung "to ⇒ mmap" của bạn chỉ là mặc định.</li>
</ul>
<p>Xem hai loại bộ nhớ đó nằm ở đâu trong không gian địa chỉ:</p>
${lab('memory', 'layout', 'vi', 'Heap (brk, lớn dần lên từ chương trình) và vùng mmap (malloc lớn, thư viện, file). Chạy lại và nhìn cả hai dời đi theo ASLR.')}

<h3>Arena: vì sao luồng nhân bộ nhớ lên</h3>
<p>Nếu mọi luồng dùng chung một heap, mọi lần <code>malloc</code> sẽ tranh nhau một cái khoá. Nên glibc cho các luồng những <strong>arena</strong> riêng — các heap độc lập — tối đa 8 × số lõi, mỗi arena đặt chỗ một vùng 64 MiB không gian địa chỉ:</p>
${src('ch07/arena.c', 'c')}
${run('c74-cap-phat', 'for n in 1 4 16 100', 1)}
${run('c74-cap-phat', 'MALLOC_ARENA_MAX=2', 1)}
<p>100 luồng, mỗi luồng <code>malloc</code> đúng một kilobyte: <strong>80 arena</strong> (8 × 10 lõi), 6 GB VSZ — và <strong>164 MB RSS cho 293 kB dữ liệu</strong>. Cột trong ngoặc cho biết vì sao RSS là thật: khối đầu tiên được chạm của mỗi arena trở thành một transparent huge page 2 MiB (bài 7.2). Với <code>MALLOC_ARENA_MAX=2</code>, cùng chương trình chỉ cần 4,3 MB. Đây là bài toán kinh điển "RSS của JVM vượt xa <code>-Xmx</code>": một dịch vụ Spring Boot có vài trăm luồng, và code native bên dưới JVM (Netty, zip, TLS, thư viện JNI) malloc từ luồng nào cũng có. Đặt <code>MALLOC_ARENA_MAX=2</code> (hoặc chuyển tiến trình sang jemalloc) là cách sửa quen thuộc — đổi một chút tranh chấp khoá lấy rất nhiều bộ nhớ.</p>

<h3>Phân mảnh: bộ nhớ trống mà không trả lại được</h3>
${src('ch07/frag.c', 'c')}
${run('c74-cap-phat', './frag', 1)}
<ol>
<li>Một triệu khối 100 byte = 100 MB dữ liệu, 118,7 MB RSS: mỗi khối mang thêm phần đầu và được làm tròn lên 112 byte.</li>
<li>Free cách một khối: một nửa dữ liệu đã mất, RSS không nhích. Trang 4 KiB nào cũng vẫn còn khối sống, nên không trang nào trả lại được.</li>
<li><code>malloc_trim(0)</code> — "trả hết những gì trả được" — không đổi gì, vì cùng lý do.</li>
<li>Giờ xin 500.000 khối 200 byte. Có 50 MB lỗ trống, nhưng mỗi lỗ 112 byte: khối 200 byte không lọt. glibc lấy bộ nhớ <strong>mới</strong>: RSS 220,6 MB cho 150 MB dữ liệu. Đó là <strong>phân mảnh (fragmentation)</strong>.</li>
<li>Free hết trừ đúng khối 100 byte cuối cùng: dữ liệu sống ~0, RSS vẫn 120,6 MB. Heap chỉ co lại được từ đỉnh (<code>brk</code> chỉ dời một chiều), và khối cuối nằm ngay ở đỉnh, ghim chặt mọi thứ bên dưới.</li>
<li>Lúc này <code>malloc_trim(0)</code> trả được các trang trống ở giữa (nó gọi <code>madvise</code> lên chúng): RSS 13,8 MB.</li>
</ol>
<p>Đó là lý do RSS của một máy chủ chạy lâu leo lên sau một đợt cao điểm rồi nằm luôn ở đó dù chẳng rò rỉ gì: bộ cấp phát giữ bộ nhớ đã free ở một hình dạng không trả lại được. Các bộ cấp phát thiết kế cho máy chủ (jemalloc, tcmalloc, mimalloc) chống lại nó bằng các lớp kích cỡ và chủ động trả trang; Redis có <code>activedefrag</code>; còn các runtime có bộ gom rác giải quyết theo cách khác — <em>dời</em> các đối tượng sống lại gần nhau.</p>

<div class="pitfall co-tieu-de">
<p><strong>"RSS tăng rồi không bao giờ giảm" không chứng minh được rò rỉ.</strong> Ở các lần chạy trên, RSS nằm ở 120 MB khi không còn dữ liệu sống (phân mảnh), và 100 luồng tốn 164 MB cho 293 kB dữ liệu (arena + THP). Rò rỉ là bộ nhớ chương trình vẫn còn tham chiếu nhưng sẽ không bao giờ dùng lại, và dấu hiệu của nó là dữ liệu sống <em>sau khi gom rác</em> cứ tăng theo lượng việc đã làm. Hãy đo con số đó trước khi đi săn.</p>
</div>

<h3>Bộ gom rác: V8</h3>
<p>Node không bao giờ gọi <code>free</code>. V8 cấp đối tượng trong heap riêng của nó (đối tượng mới ở một vùng trẻ nhỏ, đối tượng sống sót được dời sang vùng già) và định kỳ tìm xem đối tượng nào còn với tới được rồi thu hồi phần còn lại. Heap của nó có trần cứng:</p>
${src('ch07/gc.js', 'javascript')}
${run('c74-cap-phat', 'node gc.js limits', 1)}
${run('c74-cap-phat', 'node --max-old-space-size=64', 1)}
<p>Mặc định V8 tự chọn trần 2.096 MB dựa trên RAM của máy; <code>--max-old-space-size=64</code> đặt vùng già còn 64 MB (trần báo ra là 112 MB vì gồm cả thế hệ trẻ). Giờ cứ cấp phát và không bao giờ buông:</p>
${run('c74-cap-phat', 'node --max-old-space-size=64 gc.js grow', 1)}
<p>Khi <code>heapUsed</code> tiến sát trần, V8 chạy những lần gom toàn phần (mark-compact) ngày càng lâu mà chẳng giải phóng được gì, rồi bỏ cuộc: <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code> và mã thoát <strong>134</strong> = 128 + 6, SIGABRT — V8 tự huỷ. Để ý chuyện này xảy ra khi RAM còn trống hàng gigabyte: đó là trần của V8, không phải của nhân. Để ý thêm <code>rss</code> (138 MB) cao hơn hẳn <code>heapUsed</code> (62 MB): RSS còn chứa mã của V8, thế hệ trẻ, bộ nhớ C++ của chính Node và các buffer. Trong một container có giới hạn bộ nhớ thì cuộc đua đi theo chiều ngược lại — nếu giới hạn thấp hơn mức V8 nghĩ mình được dùng, nhân sẽ giết tiến trình trước với exit 137 (Chương 8).</p>
<p>Khi heap lớn dần, một <strong>heap snapshot (ảnh chụp heap)</strong> cho biết nó được làm từ gì:</p>
${run('c74-cap-phat', 'node gc.js snapshot', 1)}
<p>Một file 31 MB mô tả 453.202 đối tượng; mấy dòng đầu đã gọi tên nghi phạm: 100.000 đối tượng <code>Session</code>. Mở chính file đó (<code>v8.writeHeapSnapshot()</code>, hoặc <code>node --heapsnapshot-signal=SIGUSR2</code> trên một máy chủ đang chạy) trong Chrome DevTools → Memory, và bảng "Retainers" chỉ ra chuỗi đang giữ chúng sống — ở đây là Map <code>sessions</code>.</p>

<h3>Bộ gom rác: JVM, G1 và ZGC</h3>
${src('ch07/Gc.java', 'java')}
${run('c74-cap-phat', 'java -XX:+PrintFlagsFinal', 1)}
<p>Không có <code>-Xmx</code>, JVM lấy <strong>25% RAM</strong> làm heap tối đa (<code>MaxRAMPercentage</code>: 1.984 MiB của VM 7,9 GB này) và chọn G1 làm bộ gom. Cùng chương trình, heap 256 MB, hai bộ gom:</p>
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseG1GC Gc', 1)}
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseG1GC -Xlog', 1)}
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseZGC -XX:+ZGenerational Gc', 1)}
${run('c74-cap-phat', 'java -Xmx256m -XX:+UseZGC -XX:+ZGenerational -Xlog', 1)}
<ul>
<li><strong>G1</strong> (mặc định): 100 lần gom thế hệ trẻ, mỗi lần khoảng 1 ms, tổng 97 ms dừng toàn bộ (stop-the-world). Trong một lần dừng, mọi luồng ứng dụng đều phải chờ — đó là độ trễ mà p99 của API bạn nhìn thấy.</li>
<li><strong>ZGC</strong> (thế hệ, Java 21): các lần dừng chỉ <strong>5–12 µs</strong>, tổng khoảng 1 ms qua 348 lần dừng, vì gần như mọi việc chạy <em>đồng thời</em> với chương trình: 292 + 247 ms công gom rác chạy trên các luồng GC bên cạnh code của bạn. ZGC mua những lần dừng tí hon bằng thêm CPU và thêm khoảng dư bộ nhớ.</li>
</ul>
<p>Kinh nghiệm cho Spring Boot: G1 là mặc định tốt; chọn ZGC khi độ trễ p99 quan trọng hơn CPU; và trong container luôn đặt cỡ heap có chủ đích (Chương 8 đo <code>-XX:MaxRAMPercentage</code> và giới hạn container tác động lên nhau ra sao). Bộ gom nào cũng cần <strong>khoảng trống để làm việc</strong> — một heap lúc nào cũng đầy 95% sẽ dành cả đời để gom rác.</p>

<h3>Tìm rò rỉ thật: valgrind, ASan, và heap của Node</h3>
<p>Đây là một handler C quên <code>free</code>, cộng thêm (khi có tham số) một chỗ dùng bộ nhớ sau khi đã free:</p>
${src('ch07/leak.c', 'c')}
${run('c74-cap-phat', 'valgrind', 1)}
<p><strong>valgrind</strong> chạy chương trình trên một CPU giả lập, theo dõi mọi lần cấp phát và, khi thoát, báo các khối không còn ai trỏ tới: 100.000 byte trong 1.000 khối, cấp ở <code>leak.c:7</code> bên trong <code>handle_request</code>. Nó không cần biên dịch lại, nhưng chạy chậm 10–50 lần. <strong>AddressSanitizer</strong> (ASan) được biên dịch vào bằng <code>-fsanitize=address</code>, tốn khoảng 2 lần và có kèm LeakSanitizer:</p>
${run('c74-cap-phat', './leak-asan 2', 1)}
${run('c74-cap-phat', './leak-asan uaf', 1)}
<p>Cùng chỗ rò rỉ, cùng dòng. Và ASan chặn một lần <strong>dùng sau khi free (use-after-free)</strong> ngay đúng lần đọc (<code>leak.c:20</code>) và chỉ ra khối đó đã bị free ở đâu (<code>leak.c:19</code>) — loại lỗi mà bình thường sẽ lặng lẽ đọc dữ liệu cũ, hoặc thành lỗ hổng bảo mật (Chương 13). Mọi lần ghi lố biên cũng bị bắt theo cùng cách; lab này cho thấy một lần ghi như thế đè lên cái gì khi không ai kiểm tra:</p>
${lab('memory', 'overflow', 'vi', 'Dữ liệu vào 30 byte cho một bộ đệm stack 16 byte: nhìn nó tràn qua canary và địa chỉ trả về. ASan chặn ngay byte đầu tiên vượt khỏi bộ đệm.')}
<p>Trong ngôn ngữ có bộ gom rác, rò rỉ là một đối tượng bạn vẫn còn <em>tham chiếu</em>, nên valgrind không thấy được. Phiên bản Node kinh điển là một cache cấp module có khoá là thứ gì đó khác nhau ở mỗi yêu cầu:</p>
${src('ch07/leak.js', 'javascript')}
${run('c74-cap-phat', 'node --expose-gc leak.js bug', 1)}
${run('c74-cap-phat', 'node --expose-gc leak.js fixed', 1)}
<p>Phương pháp: ép gom rác trước (<code>global.gc()</code> với <code>--expose-gc</code>), rồi mới đọc <code>heapUsed</code>. Có lỗi thì nó tăng <strong>tỉ lệ với số yêu cầu đã phục vụ</strong> — 14 → 25 → 38 → 47 MB — và <code>cache.size</code> bằng đúng số yêu cầu. Có giới hạn 1.000 mục thì nó nằm phẳng ở 3,7 MB. Trên production bạn có cùng tín hiệu đó từ chỉ số heap-đã-dùng-sau-GC; rồi chụp hai heap snapshot cách nhau vài phút và dùng chế độ "Comparison" của DevTools để xem constructor nào phình ra.</p>

<h3>Nếu bạn đã học Chương 3 của OSG202</h3>
<p>OSG202 nói về bộ nhớ từ phía nhân: khung, trang, bảng, thay trang. Bài này là tầng nằm trên mà đề thi bỏ qua còn production thì không bao giờ: bộ cấp phát và bộ gom rác quyết định khi nào chương trình của bạn xin trang từ nhân và khi nào trả lại.</p>
${L(OSG31, '🎓', 'OSG202 · 3.1 — Phân trang &amp; bộ nhớ ảo', 'Góc nhìn từ phía nhân mà malloc và bộ gom rác được dựng lên trên.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> container API Node của bạn khởi động lại mỗi hai ngày; biểu đồ bộ nhớ là một con dốc thoai thoải. Một người bảo "rò rỉ rồi", người khác bảo "Node vốn không trả bộ nhớ". Bạn sẽ phân xử bằng số đo trước khi ai đụng vào code.</p>
<ol>
<li>Chạy <code>node --expose-gc leak.js bug</code> và <code>fixed</code>. Ghi <code>heapUsed</code> sau GC ở từng bước và độ dốc tính bằng MB trên 50.000 yêu cầu.</li>
<li>Chạy <code>node gc.js snapshot</code>, rồi sửa cho nó giữ 300.000 phiên. Dòng nào trong bản tóm tắt tăng, và tăng bao nhiêu?</li>
<li>Chạy <code>./frag</code> và giải thích bước 5 trong một câu. Rồi chạy <code>./arena 100</code> có và không có <code>MALLOC_ARENA_MAX=2</code>.</li>
<li>Biên dịch <code>leak.c</code> với <code>-fsanitize=address</code>, chạy có và không có <code>uaf</code>, và khớp từng báo cáo với một dòng trong mã nguồn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn phát biểu được luật sẽ áp lên biểu đồ production — "rò rỉ nếu heap-đã-dùng-sau-GC tăng theo lưu lượng; phân mảnh/arena nếu RSS tăng mà heap-đã-dùng-sau-GC phẳng" — và chống lưng mỗi nửa bằng một số đo của chính bạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['allocator (bộ cấp phát — malloc)', 'Code thư viện lấy trang từ nhân (brk, mmap) và cắt thành các khối bạn xin.'],
  ['brk / ngưỡng mmap', 'Yêu cầu nhỏ lấy từ heap brk; yêu cầu lớn được mmap riêng (mặc định 128 KiB, tự điều chỉnh).'],
  ['arena', 'Một heap glibc độc lập cho một nhóm luồng; tối đa 8 × số lõi; MALLOC_ARENA_MAX đặt trần.'],
  ['fragmentation (phân mảnh)', 'Bộ nhớ trống bị chia thành mẩu quá nhỏ hoặc quá rải rác để dùng lại hay trả cho hệ điều hành.'],
  ['garbage collector (bộ gom rác)', 'Thành phần của runtime tìm đối tượng không còn với tới được và thu hồi (V8, G1, ZGC).'],
  ['stop-the-world pause (lần dừng toàn bộ)', 'Thời gian mọi luồng ứng dụng phải chờ trong lúc GC làm việc: G1 ~1 ms ở đây, ZGC ~10 µs.'],
  ['heap snapshot (ảnh chụp heap)', 'Bản kết xuất mọi đối tượng trên heap V8 kèm cỡ và tham chiếu, để mở trong DevTools.'],
  ['valgrind / ASan', 'Bộ dò rò rỉ và lỗi bộ nhớ: CPU giả lập (chậm, không cần build lại) / kiểm tra biên dịch kèm (~2 lần).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>malloc</code> hiếm khi gọi syscall: <code>brk</code> cho heap, <code>mmap</code> cho khối lớn, với một ngưỡng tự thích nghi.</li>
<li>Arena của glibc giúp các luồng cấp phát không tranh chấp nhưng nhân RSS lên: 100 luồng, 80 arena, 164 MB cho 293 kB; <code>MALLOC_ARENA_MAX=2</code> → 4,3 MB.</li>
<li>Phân mảnh giữ bộ nhớ đã free ở lại RAM (120,6 MB khi không còn gì sống) cho tới khi <code>malloc_trim</code> hoặc hình dạng cho phép.</li>
<li>V8 chết ở trần heap của chính nó (exit 134); G1 dừng ~1 ms, ZGC thế hệ ~10 µs với cái giá là CPU chạy đồng thời.</li>
<li>Tìm rò rỉ bằng valgrind/ASan với C và bằng heap-đã-dùng-sau-GC + snapshot với Node; chỉ RSS thôi không chứng minh được rò rỉ.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/mallopt.3.html', '📄', 'man 3 mallopt', 'M_MMAP_THRESHOLD, M_ARENA_MAX và các biến môi trường MALLOC_*.', 'Mở')}
${L('https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot', '🟢', 'Node.js — Using heap snapshots', 'Chụp và so sánh heap snapshot để tìm thứ đang giữ bộ nhớ sống.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 7.5 — Quiz ───────────────────────── */
    {
      title: '7.5 — Chapter 7 check|||7.5 — Kiểm tra Chương 7',
      slug: 'os-7-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về bộ nhớ ảo: VSZ vs RSS vs PSS, TLB và huge page, perf trên VM, trang số 0, major fault, copy-on-write của Redis BGSAVE, nghịch lý Bélády, arena của glibc và heap V8 hết trần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Can you read a memory number and say what it really means?</h2>
<p class="lead">Ten scenario questions, every one built on a number measured in this chapter. Most ask "what explains this output" — because in an incident, the first mistake is usually believing the wrong memory number.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read /proc/&lt;pid&gt;/maps and say which line is code, heap, stack, a library or an anonymous mapping.</li>
<li>I know when to quote VSZ, RSS or PSS, and why summing RSS over workers overstates memory.</li>
<li>I can explain a page walk, the TLB and TLB reach, and when huge pages help.</li>
<li>I can tell a minor from a major fault, and explain demand paging and copy-on-write after fork.</li>
<li>I can tell fragmentation or arenas from a real leak, in C and in Node.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Bạn có đọc được một con số bộ nhớ và nói nó thật sự nghĩa là gì không?</h2>
<p class="lead">Mười câu tình huống, câu nào cũng dựng trên một con số đã đo trong chương này. Phần lớn hỏi "điều gì giải thích output này" — vì khi có sự cố, sai lầm đầu tiên thường là tin nhầm con số bộ nhớ.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được /proc/&lt;pid&gt;/maps và nói được dòng nào là mã, heap, stack, thư viện hay ánh xạ ẩn danh.</li>
<li>Tôi biết khi nào dùng VSZ, RSS hay PSS, và vì sao cộng RSS của các worker lại thổi phồng bộ nhớ.</li>
<li>Tôi giải thích được việc duyệt bảng trang, TLB và tầm phủ TLB, và khi nào huge page có ích.</li>
<li>Tôi phân biệt được fault nhẹ với fault nặng, và giải thích được nạp trang theo yêu cầu và copy-on-write sau fork.</li>
<li>Tôi phân biệt được phân mảnh hay arena với rò rỉ thật, trong C và trong Node.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'On a server with 8 GB of RAM, <code>ps -o pid,vsz,rss,comm</code> shows an idle Spring Boot JVM at <code>VSZ 4818476</code> and <code>RSS 77568</code> (kB). The on-call engineer wants to restart it "before it eats all the RAM". How much RAM is it actually using?|||Trên một máy chủ 8 GB RAM, <code>ps -o pid,vsz,rss,comm</code> cho thấy một JVM Spring Boot đang rảnh có <code>VSZ 4818476</code> và <code>RSS 77568</code> (kB). Người trực muốn khởi động lại nó "trước khi nó ăn hết RAM". Thật ra nó đang dùng bao nhiêu RAM?',
            options: ['About 4.8 GB — VSZ is the real usage|||Khoảng 4,8 GB — VSZ là mức dùng thật', 'About 77 MB — VSZ counts reserved address space (max heap, code cache, thread stacks) that has no RAM behind it yet|||Khoảng 77 MB — VSZ đếm không gian địa chỉ đã đặt chỗ (heap tối đa, vùng mã, stack các luồng) mà chưa có RAM nào đứng sau', 'About 4.9 GB — VSZ plus RSS|||Khoảng 4,9 GB — VSZ cộng RSS', 'It cannot be known without a heap dump|||Không thể biết nếu không có heap dump'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The JVM reserves address space for its maximum heap (25% of RAM by default), the code cache and every thread stack up front; pages get RAM only when touched (demand paging). RSS — pages in RAM now — is 77 MB, exactly what we measured for an idle JVM. VSZ + RSS double-counts and means nothing.|||VI: JVM đặt chỗ sẵn không gian địa chỉ cho heap tối đa (mặc định 25% RAM), vùng mã và stack của mọi luồng; trang chỉ có RAM khi được chạm (nạp theo yêu cầu). RSS — các trang đang trong RAM — là 77 MB, đúng như ta đo với một JVM rảnh. VSZ cộng RSS là đếm trùng và vô nghĩa.' },
          { question: 'A parent process fills 200 MiB, then forks 3 workers that only read it. Each of the 4 processes shows RSS ≈ 200 MiB, and your dashboard sums them to 801 MiB. What is the real RAM in use and which metric shows it?|||Một tiến trình cha ghi đầy 200 MiB rồi fork 3 worker chỉ đọc vùng đó. Mỗi tiến trình trong 4 cái hiện RSS ≈ 200 MiB, và bảng giám sát cộng lại ra 801 MiB. RAM thật đang dùng là bao nhiêu và chỉ số nào cho thấy nó?',
            options: ['801 MiB — RSS is always additive|||801 MiB — RSS lúc nào cũng cộng được', '50 MiB — only the parent owns the pages|||50 MiB — chỉ tiến trình cha sở hữu các trang', '0 MiB — the workers never wrote, so nothing is resident|||0 MiB — các worker không ghi gì nên không có gì thường trú', 'About 200 MiB — shared pages are counted in every RSS; PSS (50 MiB each) splits them and adds up correctly|||Khoảng 200 MiB — trang dùng chung bị đếm trong mọi RSS; PSS (50 MiB mỗi tiến trình) chia chúng ra và cộng lại đúng'],
            correctIndex: 3, points: 1,
            explanation: 'EN: After fork the pages are shared copy-on-write; nobody wrote, so they exist once. smaps_rollup showed Shared ≈ 200 and Private 0 for every process, and PSS = 200 / 4 = 50 MiB each, summing to 200. The pages are resident (the parent wrote them), so 0 is wrong; and they are shared, not owned by the parent alone.|||VI: Sau fork các trang được dùng chung kiểu copy-on-write; không ai ghi nên chúng chỉ tồn tại một lần. smaps_rollup cho thấy Shared ≈ 200 và Private 0 với mọi tiến trình, và PSS = 200 / 4 = 50 MiB mỗi cái, cộng lại 200. Các trang đều thường trú (cha đã ghi), nên 0 là sai; và chúng được dùng chung, không thuộc riêng tiến trình cha.' },
          { question: '<code>tlb.c</code> chases pointers through 64 MiB, one cache line per page, in random page order: 47.3 ns per access with 4 KiB pages, 19.3 ns with 2 MiB pages. At 1 MiB both were 3.0 ns. What explains the 64 MiB gap?|||<code>tlb.c</code> đuổi con trỏ qua 64 MiB, mỗi trang một dòng cache, theo thứ tự trang ngẫu nhiên: 47,3 ns mỗi lần truy cập với trang 4 KiB, 19,3 ns với trang 2 MiB. Ở 1 MiB cả hai đều 3,0 ns. Điều gì giải thích khoảng cách ở 64 MiB?',
            options: ['16,384 pages of 4 KiB exceed the TLB reach, so most accesses need a page walk; with 2 MiB pages the whole 64 MiB fits in 32 TLB entries|||16.384 trang 4 KiB vượt tầm phủ TLB, nên phần lớn lần truy cập phải duyệt bảng trang; với trang 2 MiB cả 64 MiB vừa trong 32 mục TLB', 'Huge pages are stored in faster RAM chips|||Huge page được lưu trên chip RAM nhanh hơn', 'With 4 KiB pages every access is a page fault|||Với trang 4 KiB mọi lần truy cập đều là page fault', 'The 4 KiB run read 512 times more data|||Lần chạy 4 KiB đọc nhiều dữ liệu hơn 512 lần'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Same data, same loop — only the translation changed. Pages were faulted in before timing (memset), so there were no page faults in the loop. Past the TLB reach each new page costs a hardware page walk (~28 ns here); a 2 MiB page covers 512 small pages with one entry. RAM is the same RAM either way.|||VI: Cùng dữ liệu, cùng vòng lặp — chỉ phép dịch thay đổi. Các trang đã được nạp trước khi đo (memset), nên trong vòng lặp không có page fault nào. Vượt tầm phủ TLB, mỗi trang mới tốn một lần phần cứng duyệt bảng trang (~28 ns ở đây); một trang 2 MiB phủ 512 trang nhỏ bằng một mục. RAM thì vẫn là RAM đó.' },
          { question: 'In the Docker Desktop lab, <code>perf stat -e page-faults,dTLB-loads,dTLB-load-misses ./tlb 64 nohuge</code> prints 16468 page-faults and <code>&lt;not supported&gt;</code> for both dTLB events. What is the correct conclusion?|||Trong lab Docker Desktop, <code>perf stat -e page-faults,dTLB-loads,dTLB-load-misses ./tlb 64 nohuge</code> in 16468 page-faults và <code>&lt;not supported&gt;</code> cho cả hai sự kiện dTLB. Kết luận đúng là gì?',
            options: ['The program had no TLB misses|||Chương trình không có lần trượt TLB nào', 'The program never used the TLB because it ran in a container|||Chương trình không dùng TLB vì chạy trong container', 'TLB misses were not measured: those are hardware PMU events the VM does not expose; page-faults is a software event counted by the kernel, so it works|||Trượt TLB chưa được đo: đó là sự kiện PMU phần cứng mà VM không lộ ra; page-faults là sự kiện phần mềm do nhân đếm, nên vẫn chạy', 'perf is broken and its page-fault count cannot be trusted either|||perf bị hỏng và số page-fault của nó cũng không tin được'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Hardware events come from performance-counter registers inside the CPU; Docker Desktop’s VM does not pass them through (even cycles and instructions were not supported). Software events like page-faults and cpu-clock are kept by the kernel and are reliable. "Not supported" means unmeasured, not zero — the timing table is the evidence of TLB misses here.|||VI: Sự kiện phần cứng đến từ các thanh ghi bộ đếm hiệu năng trong CPU; VM của Docker Desktop không chuyển chúng vào (ngay cả cycles và instructions cũng không hỗ trợ). Sự kiện phần mềm như page-faults và cpu-clock do nhân giữ và đáng tin. "Not supported" nghĩa là chưa đo, không phải bằng 0 — bảng thời gian mới là bằng chứng của trượt TLB ở đây.' },
          { question: '<code>demand.c</code> maps 64 MiB (16,384 pages) and reads one byte from every page. pagemap now shows all 16,384 pages present and the process took ~16,400 page faults — but RSS grew by only 324 kB. Why?|||<code>demand.c</code> ánh xạ 64 MiB (16.384 trang) và đọc một byte ở mọi trang. pagemap giờ báo đủ 16.384 trang có mặt và tiến trình đã chịu ~16.400 page fault — nhưng RSS chỉ tăng 324 kB. Vì sao?',
            options: ['The reads were served from the CPU cache, so no page was mapped|||Các lần đọc được phục vụ từ cache CPU nên không trang nào được ánh xạ', 'Reading never-written anonymous memory maps every page to the single shared, read-only zero page; a real frame is only allocated on the first write|||Đọc bộ nhớ ẩn danh chưa từng ghi sẽ ánh xạ mọi trang tới một trang số 0 duy nhất, dùng chung, chỉ-đọc; khung thật chỉ được cấp ở lần ghi đầu', 'The kernel swapped the pages out immediately|||Nhân đẩy các trang ra swap ngay lập tức', 'RSS is only updated when the process exits|||RSS chỉ được cập nhật khi tiến trình thoát'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Unwritten anonymous memory must read as zeros, so the kernel points every page at one zero page (present, but not counted as this process’s RSS). The following write pass took another 16,386 faults and RSS jumped by 64 MiB: each write copied the zero page into a private frame. Nothing was swapped, and RSS is live, not computed at exit.|||VI: Bộ nhớ ẩn danh chưa ghi phải đọc ra số 0, nên nhân trỏ mọi trang vào một trang số 0 (có mặt, nhưng không tính vào RSS của tiến trình). Lượt ghi tiếp theo chịu thêm 16.386 fault và RSS nhảy 64 MiB: mỗi lần ghi chép trang số 0 sang một khung riêng. Không có gì bị swap, và RSS là số sống, không phải tính lúc thoát.' },
          { question: 'A service reads a 256 MiB file at random offsets via mmap. Right after a deploy (cold): 65,536 major faults, 3,416 ms. A minute later, the same run: 0 major faults, 11.6 ms. What changed?|||Một dịch vụ đọc một file 256 MiB ở các vị trí ngẫu nhiên qua mmap. Ngay sau khi deploy (nguội): 65.536 major fault, 3.416 ms. Một phút sau, đúng lần chạy đó: 0 major fault, 11,6 ms. Cái gì đã thay đổi?',
            options: ['The file’s pages are now in the page cache, so each fault is resolved from RAM instead of a ~52 µs disk read|||Các trang của file giờ đã nằm trong page cache, nên mỗi fault được giải từ RAM thay vì một lần đọc đĩa ~52 µs', 'The JIT compiler optimised the loop|||Trình biên dịch JIT đã tối ưu vòng lặp', 'The kernel switched the file to huge pages|||Nhân đã chuyển file sang huge page', 'mmap became read() after the first run|||mmap đã thành read() sau lần chạy đầu'],
            correctIndex: 0, points: 1,
            explanation: 'EN: A major fault means the kernel had to read the page from disk first: 3,416 ms / 65,536 ≈ 52 µs each. Afterwards the pages stay in the page cache, so faults are minor (4,098 of them, thanks to fault-around) and the run takes 11.6 ms — about 300× faster. The program is C (no JIT) and it never switched to read().|||VI: Major fault nghĩa là nhân phải đọc trang từ đĩa trước: 3.416 ms / 65.536 ≈ 52 µs mỗi lần. Sau đó các trang ở lại page cache, nên fault là minor (4.098 lần, nhờ fault-around) và lần chạy chỉ mất 11,6 ms — nhanh hơn khoảng 300 lần. Chương trình là C (không có JIT) và nó không hề chuyển sang read().' },
          { question: 'A Redis holding 336 MB starts a BGSAVE; during the save, clients send 30,000 <code>SET</code>s of 1 KiB values (~30 MB of new data). The log says <code>Fork CoW for RDB: current 124 MB</code>. Why is it four times the data written?|||Một Redis giữ 336 MB bắt đầu BGSAVE; trong lúc lưu, client gửi 30.000 lệnh <code>SET</code> giá trị 1 KiB (~30 MB dữ liệu mới). Log ghi <code>Fork CoW for RDB: current 124 MB</code>. Vì sao gấp bốn lần lượng dữ liệu đã ghi?',
            options: ['The child process copied the whole dataset at fork time|||Tiến trình con đã chép cả tập dữ liệu lúc fork', 'Redis stores every value twice during a save|||Redis lưu mỗi giá trị hai lần trong lúc lưu', 'Transparent huge pages made each write copy 2 MiB|||Transparent huge page khiến mỗi lần ghi chép 2 MiB', 'Copy-on-write copies whole 4 KiB pages, and each SET touches several scattered pages (hash entry, old value, allocator metadata), so the copied memory follows pages touched, not bytes written|||Copy-on-write chép nguyên trang 4 KiB, và mỗi SET chạm vài trang rải rác (mục bảng băm, giá trị cũ, siêu dữ liệu bộ cấp phát), nên bộ nhớ bị chép theo số trang bị chạm, không theo số byte ghi'],
            correctIndex: 3, points: 1,
            explanation: 'EN: fork copied only page tables (2,967 µs), not data. Afterwards every first write to a still-shared page copies that 4 KiB page; scattered small writes touch many pages. THP is not the cause: Redis runs with disable-thp yes, and our cow.c showed that on this kernel a write to a shared huge page copies only 4 KiB.|||VI: fork chỉ chép bảng trang (2.967 µs), không chép dữ liệu. Sau đó lần ghi đầu vào mỗi trang còn dùng chung sẽ chép nguyên trang 4 KiB đó; các lần ghi nhỏ rải rác chạm rất nhiều trang. THP không phải nguyên nhân: Redis chạy với disable-thp yes, và cow.c của ta cho thấy trên nhân này ghi vào một huge page dùng chung chỉ chép 4 KiB.' },
          { question: 'For the reference string <code>1 2 3 4 1 2 5 1 2 3 4 5</code>, FIFO makes 9 page faults with 3 frames and 10 with 4 frames. What is this, and which algorithm can never show it?|||Với chuỗi tham chiếu <code>1 2 3 4 1 2 5 1 2 3 4 5</code>, FIFO gây 9 page fault với 3 khung và 10 với 4 khung. Đây là gì, và thuật toán nào không bao giờ bị như vậy?',
            options: ['Thrashing; Clock never shows it|||Thrashing; Clock không bao giờ bị', 'A bug in the simulator; FIFO cannot get worse with more frames|||Lỗi của bộ mô phỏng; FIFO không thể tệ hơn khi có thêm khung', 'Bélády’s anomaly; LRU (and OPT) never fault more with more frames|||Nghịch lý Bélády; LRU (và OPT) không bao giờ fault nhiều hơn khi có thêm khung', 'The working-set cliff; OPT shows it too|||Bờ vực working set; OPT cũng bị'],
            correctIndex: 2, points: 1,
            explanation: 'EN: More RAM causing more faults is Bélády’s anomaly, possible for FIFO. LRU and OPT are "stack algorithms": the pages kept with n frames are always a subset of those kept with n+1, so faults can only fall (measured: LRU 10 → 8, OPT 7 → 6). Clock behaves like FIFO here (9 → 10). Thrashing is too few frames for the working set, not this.|||VI: Thêm RAM mà fault nhiều hơn là nghịch lý Bélády, có thể xảy ra với FIFO. LRU và OPT là "thuật toán ngăn xếp": các trang giữ với n khung luôn là tập con của các trang giữ với n+1 khung, nên số fault chỉ có thể giảm (đo được: LRU 10 → 8, OPT 7 → 6). Clock ở đây cư xử như FIFO (9 → 10). Thrashing là thiếu khung cho working set, không phải hiện tượng này.' },
          { question: 'A C service with 100 worker threads, each doing small mallocs, shows 80 glibc arenas, VSZ 6 GB and RSS 164 MB — but only 293 kB are actually allocated. Which change cut RSS to 4.3 MB in the lab, and why?|||Một dịch vụ C có 100 luồng worker, mỗi luồng malloc vài khối nhỏ, cho thấy 80 arena glibc, VSZ 6 GB và RSS 164 MB — nhưng chỉ 293 kB thật sự được cấp. Thay đổi nào cắt RSS xuống 4,3 MB trong lab, và vì sao?',
            options: ['<code>MALLOC_ARENA_MAX=2</code>: threads share 2 arenas instead of 80, so there are 78 fewer heaps each holding at least a 2 MiB huge page of RSS|||<code>MALLOC_ARENA_MAX=2</code>: các luồng dùng chung 2 arena thay vì 80, nên bớt 78 heap mà mỗi heap giữ ít nhất một huge page 2 MiB RSS', 'Calling <code>malloc_trim(0)</code> after each request|||Gọi <code>malloc_trim(0)</code> sau mỗi yêu cầu', '<code>ulimit -s 1024</code> to shrink thread stacks|||<code>ulimit -s 1024</code> để thu nhỏ stack của luồng', 'Turning ASLR off|||Tắt ASLR'],
            correctIndex: 0, points: 1,
            explanation: 'EN: glibc creates up to 8 × cores arenas (80 on 10 cores) to avoid lock contention; each reserves 64 MiB of address space (the VSZ) and its first touched block became a 2 MiB transparent huge page (158 MB of the RSS was huge pages). Capping arenas removes those heaps. Thread stacks are mostly untouched VSZ, malloc_trim cannot free the live arena headers, and ASLR does not change sizes.|||VI: glibc tạo tối đa 8 × số lõi arena (80 trên 10 lõi) để tránh tranh chấp khoá; mỗi arena đặt chỗ 64 MiB không gian địa chỉ (phần VSZ) và khối được chạm đầu tiên của nó thành một transparent huge page 2 MiB (158 MB trong RSS là huge page). Đặt trần arena là bỏ được các heap đó. Stack luồng phần lớn là VSZ chưa chạm, malloc_trim không giải phóng được phần đầu arena còn sống, và ASLR không đổi kích cỡ.' },
          { question: 'A Node API started with <code>--max-old-space-size=64</code> dies with <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code>, exit code 134, while the host has gigabytes free. Logging <code>heapUsed</code> right after <code>global.gc()</code> shows 14 → 25 → 38 → 47 MB every 50,000 requests. What is going on?|||Một API Node chạy với <code>--max-old-space-size=64</code> chết với <code>FATAL ERROR: Reached heap limit … JavaScript heap out of memory</code>, mã thoát 134, trong khi máy còn trống hàng gigabyte. Ghi <code>heapUsed</code> ngay sau <code>global.gc()</code> cho thấy 14 → 25 → 38 → 47 MB sau mỗi 50.000 yêu cầu. Chuyện gì đang xảy ra?',
            options: ['The kernel’s OOM killer killed Node (exit 134 = OOM)|||OOM killer của nhân đã giết Node (exit 134 = OOM)', 'A real leak: live objects after GC grow with requests (e.g. an unbounded cache), and V8 aborted itself (SIGABRT, 128 + 6) at its own heap limit|||Rò rỉ thật: đối tượng sống sau GC tăng theo số yêu cầu (vd. một cache không giới hạn), và V8 tự huỷ (SIGABRT, 128 + 6) ở trần heap của chính nó', 'Fragmentation in glibc malloc: RSS never shrinks|||Phân mảnh trong malloc của glibc: RSS không bao giờ co lại', 'The heap limit is too low; any program would crash at 64 MB|||Trần heap quá thấp; chương trình nào cũng sẽ chết ở 64 MB'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Exit 134 is SIGABRT from V8 itself; the kernel’s OOM kill is SIGKILL, exit 137. Heap-used after a forced GC growing in proportion to requests is the signature of a leak — our bug version grew to 47 MB with cache.size equal to the request count, while the bounded version stayed flat at 3.7 MB with the same limit. Fragmentation shows up in RSS with flat heap-used, not like this.|||VI: Exit 134 là SIGABRT do chính V8; OOM của nhân là SIGKILL, exit 137. Heap-đã-dùng sau một lần GC ép buộc tăng tỉ lệ với số yêu cầu là dấu hiệu của rò rỉ — bản có lỗi của ta tăng tới 47 MB với cache.size bằng số yêu cầu, còn bản có giới hạn nằm phẳng ở 3,7 MB với cùng trần. Phân mảnh lộ ra ở RSS khi heap-đã-dùng phẳng, không như thế này.' },
        ],
      },
    },
  ],
};
