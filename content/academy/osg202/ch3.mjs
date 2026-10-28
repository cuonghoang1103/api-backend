/**
 * OSG202 · Chương 3 — Memory Management (osg3: 3.A 1–29, 3.B 30–56).
 * Bài 📑 học theo từng slide: osg3 (tmp_03.pptx, slide 1–56).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch3.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch3).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 3.A — 📑 Slide by slide · Memory: address spaces, swapping, paging, TLB, page tables, page replacement (slides 1–29) ───────── */
const L_osg3_1 = {
  title: '3.A — 📑 Slide by slide · Memory: address spaces, swapping, paging, TLB, page tables, page replacement (slides 1–29)|||3.A — 📑 Học theo từng slide · Bộ nhớ: không gian địa chỉ, swapping, phân trang, TLB, bảng trang, thay trang (slide 1–29)',
  slug: 'osg202-slide-osg3-1',
  type: 'VIDEO',
  description: 'Giảng đủ 29 slide đầu của Chương 3 (Tanenbaum, Modern Operating Systems 4e): bộ nhớ không trừu tượng và bài toán tái định vị, thanh ghi cơ sở và giới hạn, swapping, theo dõi bộ nhớ trống bằng bitmap và danh sách liên kết, first/next/best/worst fit, bộ nhớ ảo, MMU và phân trang, mục bảng trang, TLB, bảng trang nhiều mức và nghịch đảo, chín thuật toán thay trang (OPT, NRU, FIFO, second chance, clock, LRU, NFU/aging, working set, WSClock) — mỗi hình do bộ mô phỏng tính lại (dịch địa chỉ từng bit, TLB, đặt chỗ, thay trang, aging, WSClock) và mọi ý nhìn được trên Linux đều có chương trình C chạy thật (địa chỉ vật lý qua pagemap, bit có mặt và bit bẩn, swap trong container 64 MB, đo TLB với trang 4 KB và 2 MB, bảng trang tốn bao nhiêu), kèm chỗ slide sai và lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.A · deck "Chapter 3 · Memory Management", slides 1–29</span>
<h2>How the OS shares one physical memory between many programs</h2>
<p class="lead">The first half of the deck follows Tanenbaum's sections 3.1–3.4: life without a memory abstraction, the address space (base and limit registers, swapping, tracking free memory), virtual memory with paging, the TLB and page tables, and then the page replacement algorithms that decide which page to throw out when memory is full. Every figure is recomputed by a simulator (so the numbers are produced by the algorithm, not copied), and every idea that exists on a real Linux is shown with a C program run in the course container — including one that prints the real physical address of a variable.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>3.1 No memory abstraction · 3.2.1 base and limit</td><td>explain the relocation problem and translate with base/limit registers</td></tr>
<tr><td>6–10</td><td>3.2.2 Swapping · 3.2.3 managing free memory</td><td>track holes with a bitmap or a list and run first/next/best/worst fit by hand</td></tr>
<tr><td>11–19</td><td>3.3 Virtual memory</td><td>split an address into page and offset, translate it with a page table, use a TLB, size single-, multi-level and inverted page tables</td></tr>
<tr><td>20–29</td><td>3.4 Page replacement algorithms</td><td>count page faults for OPT, FIFO, LRU, clock and explain NRU, second chance, aging, working set and WSClock</td></tr>
</tbody>
</table>
<div class="callout">The older web lessons 3.1–3.4 further down stay as summaries; this lesson refers to them instead of repeating them — for example lesson 3.3 has the effective-access-time (EAT) formula worked out, lesson 3.2 the FIFO-vs-LRU example, lesson 3.4 thrashing.</div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.A · deck "Chapter 3 · Memory Management", slide 1–29</span>
<h2>HĐH chia một bộ nhớ vật lý cho nhiều chương trình như thế nào</h2>
<p class="lead">Nửa đầu bộ slide đi theo mục 3.1–3.4 của Tanenbaum: sống khi không có trừu tượng bộ nhớ, không gian địa chỉ (thanh ghi cơ sở và giới hạn, swapping, theo dõi bộ nhớ trống), bộ nhớ ảo với phân trang, TLB và bảng trang, rồi các thuật toán thay trang quyết định đuổi trang nào ra khi bộ nhớ đầy. Hình nào cũng được bộ mô phỏng tính lại (con số do thuật toán sinh ra, không chép), và ý nào có trên Linux thật đều có chương trình C chạy trong container của môn — kể cả một chương trình in ra địa chỉ VẬT LÝ thật của một biến.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>3.1 Không trừu tượng bộ nhớ · 3.2.1 cơ sở và giới hạn</td><td>giải thích bài toán tái định vị và dịch địa chỉ bằng thanh ghi cơ sở/giới hạn</td></tr>
<tr><td>6–10</td><td>3.2.2 Swapping · 3.2.3 quản lý bộ nhớ trống</td><td>theo dõi lỗ trống bằng bitmap hoặc danh sách và tự chạy first/next/best/worst fit</td></tr>
<tr><td>11–19</td><td>3.3 Bộ nhớ ảo</td><td>tách địa chỉ thành trang và độ dời, dịch bằng bảng trang, dùng TLB, tính cỡ bảng trang một mức, nhiều mức, nghịch đảo</td></tr>
<tr><td>20–29</td><td>3.4 Các thuật toán thay trang</td><td>đếm lỗi trang với OPT, FIFO, LRU, clock và giải thích NRU, second chance, aging, working set, WSClock</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ 3.1–3.4 phía dưới vẫn giữ làm bản tóm tắt; bài này dẫn sang chúng thay vì lặp lại — ví dụ bài 3.3 có công thức thời gian truy cập hiệu dụng (EAT) giải sẵn, bài 3.2 có ví dụ FIFO so với LRU, bài 3.4 có thrashing.</div>`),
    walkHead('osg3', 1, 29),
    walk('osg3', [
      [1, 'Memory Management',
        `<p class="y-chinh">🎯 Chapter 3 of <em>Modern Operating Systems</em> (4th edition): <strong>memory management</strong> — how the OS gives every running program its own memory while all of them share one physical RAM. Syllabus sessions on Chapter 3, outcome CLO3; the FE always has calculation questions from it (address translation, page faults, placement algorithms).</p>
<p>The part of the OS that does this job is the <strong>memory manager</strong>. It has three tasks that the whole chapter keeps coming back to: keep track of which parts of memory are in use and which are free; give memory to processes when they need it and take it back when they finish; and, when RAM is not big enough, move data between RAM and disk without the programs noticing.</p>
<p>The chapter climbs a ladder of ideas, each one fixing the problem of the previous one: no abstraction (slides 3–4) → one address space per process with base and limit (5) → swapping whole processes (6–10) → virtual memory with paging (11–19) → choosing which page to evict (20–29) → design and implementation details (30–41) → segmentation (42–55).</p>
<p class="meo">🧠 Chapter 3 in one sentence: <em>every address a program uses is a virtual address; the MMU hardware translates it, page by page, using tables the OS keeps — and the OS decides which pages live in RAM.</em></p>`,
        `<p class="y-chinh">🎯 Chương 3 của <em>Modern Operating Systems</em> (bản 4): <strong>quản lý bộ nhớ (memory management)</strong> — HĐH cho mỗi chương trình đang chạy bộ nhớ riêng của nó như thế nào trong khi tất cả cùng dùng chung một RAM vật lý. Các buổi Chương 3 trong đề cương, chuẩn đầu ra CLO3; đề FE lần nào cũng có câu tính toán từ chương này (dịch địa chỉ, lỗi trang, thuật toán đặt chỗ).</p>
<p>Phần của HĐH làm việc này gọi là <strong>bộ quản lý bộ nhớ (memory manager)</strong>. Nó có ba việc mà cả chương cứ quay lại: theo dõi phần nào của bộ nhớ đang dùng, phần nào trống; cấp bộ nhớ cho tiến trình khi cần và thu lại khi chúng kết thúc; và khi RAM không đủ, chuyển dữ liệu giữa RAM và đĩa mà chương trình không hề hay biết.</p>
<p>Chương này leo một chiếc thang ý tưởng, mỗi bậc chữa vấn đề của bậc trước: không trừu tượng (slide 3–4) → mỗi tiến trình một không gian địa chỉ với cơ sở và giới hạn (5) → swapping nguyên tiến trình (6–10) → bộ nhớ ảo với phân trang (11–19) → chọn trang nào để đuổi (20–29) → chi tiết thiết kế và cài đặt (30–41) → phân đoạn (42–55).</p>
<p class="meo">🧠 Chương 3 trong một câu: <em>mọi địa chỉ chương trình dùng là địa chỉ ảo; phần cứng MMU dịch nó, từng trang một, bằng các bảng do HĐH giữ — và HĐH quyết định trang nào được ở trong RAM.</em></p>`],
      [2, 'Memory',
        `<p class="y-chinh">🎯 Two points: <strong>Parkinson's law</strong>, paraphrased — "programs expand to fill the memory available to hold them" — and a growth fact: an average home computer has (the slide says) 10,000 times more memory than the IBM 7094, the largest computer in the world in the early 1960s.</p>
<p>The joke behind Parkinson's law (originally "work expands to fill the time available", C. N. Parkinson, 1955) is serious for an OS designer: memory is never "enough". However much RAM you buy, browsers, IDEs, databases and containers grow until it is full, so the OS must always share a resource that is scarce.</p>
<p>➕ Is "10,000 times" still true? The IBM 7094 had 32,768 words of 36 bits = 147,456 bytes. Let the course machine compute the ratio:</p>
<div class="out"># How much memory does this machine have, compared with the IBM 7094 of the slide?<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
# IBM 7094 (1962): 32,768 words of 36 bits = 147,456 bytes<br>
$ awk '/MemTotal/ { printf "this machine / IBM 7094 = %.0f times\\n", $2 * 1024 / 147456 }' /proc/meminfo<br>
this machine / IBM 7094 = 56420 times<br>
# a 16 GB laptop, the same comparison<br>
$ echo "16 GB laptop / IBM 7094 = $(( 16 * 1024 * 1024 * 1024 / 147456 )) times"<br>
16 GB laptop / IBM 7094 = 116508 times</div>
<p>The course's virtual machine alone has about <strong>56,000 times</strong> the memory of the 7094, and an ordinary 16 GB laptop about <strong>116,000 times</strong>. The slide's number is from an older edition and is <strong>out of date</strong> by an order of magnitude — which only proves Parkinson right: memory grew more than ten-fold and is still not enough.</p>
<p class="meo">🧠 Memory hierarchy reminder (Chapter 1, slide 14): registers → cache → <strong>main memory (RAM)</strong> → disk. This chapter is about the RAM level and the disk below it.</p>`,
        `<p class="y-chinh">🎯 Hai ý: <strong>định luật Parkinson</strong> phát biểu lại — "chương trình phình ra cho tới khi lấp đầy bộ nhớ có sẵn để chứa chúng" — và một sự thật về tăng trưởng: máy tính gia đình trung bình có (theo slide) bộ nhớ gấp 10.000 lần IBM 7094, chiếc máy tính lớn nhất thế giới đầu thập niên 1960.</p>
<p>Câu đùa của Parkinson (gốc là "công việc phình ra cho tới khi lấp đầy thời gian có sẵn", C. N. Parkinson, 1955) lại rất nghiêm túc với người thiết kế HĐH: bộ nhớ không bao giờ "đủ". Mua bao nhiêu RAM thì trình duyệt, IDE, cơ sở dữ liệu và container cũng lớn tới khi đầy, nên HĐH lúc nào cũng phải chia một tài nguyên khan hiếm.</p>
<p>➕ "10.000 lần" còn đúng không? IBM 7094 có 32.768 từ (word) 36 bit = 147.456 byte. Để máy của môn tự tính tỉ lệ:</p>
<div class="out"># Máy này có bao nhiêu bộ nhớ, so với IBM 7094 trên slide?<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
# IBM 7094 (1962): 32.768 từ 36 bit = 147.456 byte<br>
$ awk '/MemTotal/ { printf "this machine / IBM 7094 = %.0f times\\n", $2 * 1024 / 147456 }' /proc/meminfo<br>
this machine / IBM 7094 = 56420 times<br>
# laptop 16 GB, cùng phép so<br>
$ echo "16 GB laptop / IBM 7094 = $(( 16 * 1024 * 1024 * 1024 / 147456 )) times"<br>
16 GB laptop / IBM 7094 = 116508 times</div>
<p>Chỉ riêng máy ảo của môn đã có bộ nhớ gấp khoảng <strong>56.000 lần</strong> 7094, còn một laptop 16 GB bình thường gấp khoảng <strong>116.000 lần</strong>. Con số trên slide là của một lần xuất bản cũ hơn và đã <strong>lỗi thời</strong> cả một bậc độ lớn — chỉ chứng minh Parkinson đúng: bộ nhớ tăng hơn mười lần mà vẫn không đủ.</p>
<p class="meo">🧠 Nhắc lại phân cấp bộ nhớ (Chương 1, slide 14): thanh ghi → cache → <strong>bộ nhớ chính (RAM)</strong> → đĩa. Chương này nói về tầng RAM và tầng đĩa ngay dưới nó.</p>`],
      [3, 'No Memory Abstraction',
        `<p class="y-chinh">🎯 Figure 3-1: with <strong>no memory abstraction</strong>, every program sees the <strong>physical memory</strong> directly. Three classic layouts for one OS + one user program: (a) OS in RAM at the bottom (early mainframes and minicomputers), (b) OS in ROM at the top (some handheld and embedded systems), (c) device drivers in ROM at the top and the rest of the OS in RAM below (early PCs: the BIOS in ROM, MS-DOS in RAM).</p>
<p>"No abstraction" means an instruction <code>MOV REGISTER1, 1000</code> moves the contents of physical memory location 1000 — there is no translation at all. Consequences: only one program can be in memory at a time (two programs would overwrite each other), and in layouts (a) and (c) a bug in the user program can wipe out the operating system itself. When the user types a command, the OS copies the program from disk into memory and runs it; when it finishes, the next one is loaded on top of it.</p>
<p>➕ The physical address map still exists underneath everything today. Only root may read it; this is the course machine's:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># The PHYSICAL address map of the machine (root only): where RAM, the kernel and device registers really are<br>
$ grep -v '^ &nbsp;' /proc/iomem<br>
10000000-1000ffff : GICD<br>
10010000-1014ffff : GICR<br>
20050000-20050fff : pl031<br>
20060000-20060fff : pl061<br>
40000000-4fffffff : PCI ECAM<br>
50000000-6ffdffff : pci<br>
70000000-26fffffff : System RAM<br>
280000000-67fffffff : pci<br>
$ grep -E 'Kernel (code|data)' /proc/iomem<br>
&nbsp;&nbsp;70000000-7202ffff : Kernel code<br>
&nbsp;&nbsp;72260000-725fffff : Kernel data</div>
<p>Physical RAM starts at <code>0x70000000</code> and the <strong>kernel code and data sit at the very bottom of RAM</strong> — layout (a) of the figure, still. Below RAM are <strong>device registers</strong> (GIC interrupt controller, <code>pl031</code> real-time clock, <code>pl061</code> GPIO, PCI): reading those addresses talks to hardware, not memory (memory-mapped I/O, Chapter 5). User programs never see any of these addresses — that is exactly the abstraction this chapter builds.</p>
<p class="meo">🧠 Where "no abstraction" survives: small embedded systems (washing machines, microcontrollers) still run one program on physical addresses — Chapter 1's "ontogeny recapitulates phylogeny".</p>`,
        `<p class="y-chinh">🎯 Hình 3-1: khi <strong>không có trừu tượng bộ nhớ (no memory abstraction)</strong>, mọi chương trình nhìn thẳng vào <strong>bộ nhớ vật lý (physical memory)</strong>. Ba cách bố trí kinh điển cho một HĐH + một chương trình người dùng: (a) HĐH trong RAM ở đáy (máy lớn và máy mini đời đầu), (b) HĐH trong ROM ở đỉnh (một số máy cầm tay và hệ nhúng), (c) trình điều khiển thiết bị trong ROM ở đỉnh, phần còn lại của HĐH trong RAM bên dưới (PC đời đầu: BIOS trong ROM, MS-DOS trong RAM).</p>
<p>"Không trừu tượng" nghĩa là lệnh <code>MOV REGISTER1, 1000</code> chuyển nội dung ô nhớ vật lý số 1000 — không có phép dịch nào cả. Hệ quả: mỗi lúc chỉ một chương trình được nằm trong bộ nhớ (hai chương trình sẽ ghi đè lên nhau), và với cách (a) và (c), một lỗi của chương trình người dùng có thể xoá luôn cả hệ điều hành. Khi người dùng gõ lệnh, HĐH chép chương trình từ đĩa vào bộ nhớ rồi chạy; chạy xong, chương trình kế tiếp được nạp đè lên chỗ đó.</p>
<p>➕ Bản đồ địa chỉ vật lý vẫn tồn tại bên dưới mọi thứ ngày nay. Chỉ root mới đọc được; đây là của máy môn học:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bản đồ địa chỉ VẬT LÝ của máy (chỉ root): RAM, nhân và thanh ghi thiết bị thật sự nằm ở đâu<br>
$ grep -v '^ &nbsp;' /proc/iomem<br>
10000000-1000ffff : GICD<br>
10010000-1014ffff : GICR<br>
20050000-20050fff : pl031<br>
20060000-20060fff : pl061<br>
40000000-4fffffff : PCI ECAM<br>
50000000-6ffdffff : pci<br>
70000000-26fffffff : System RAM<br>
280000000-67fffffff : pci<br>
$ grep -E 'Kernel (code|data)' /proc/iomem<br>
&nbsp;&nbsp;70000000-7202ffff : Kernel code<br>
&nbsp;&nbsp;72260000-725fffff : Kernel data</div>
<p>RAM vật lý bắt đầu ở <code>0x70000000</code> và <strong>mã cùng dữ liệu của nhân nằm ngay đáy RAM</strong> — vẫn là cách (a) của hình. Bên dưới RAM là <strong>thanh ghi thiết bị</strong> (bộ điều khiển ngắt GIC, đồng hồ thời gian thực <code>pl031</code>, GPIO <code>pl061</code>, PCI): đọc những địa chỉ đó là nói chuyện với phần cứng chứ không phải bộ nhớ (I/O ánh xạ bộ nhớ, Chương 5). Chương trình người dùng không bao giờ thấy các địa chỉ này — đó chính là sự trừu tượng mà chương này xây dựng.</p>
<p class="meo">🧠 "Không trừu tượng" còn sống ở đâu: hệ nhúng nhỏ (máy giặt, vi điều khiển) vẫn chạy một chương trình trên địa chỉ vật lý — đúng câu "ontogeny recapitulates phylogeny" của Chương 1.</p>`],
      [4, 'Running Multiple Programs Without a Memory Abstraction',
        `<p class="y-chinh">🎯 Figure 3-2, the <strong>relocation problem</strong>: (a) a 16-KB program starting with <code>JMP 24</code>, (b) another 16-KB program starting with <code>JMP 28</code>, (c) both loaded one after the other. Program (b) now lives at 16384–32767, but its first instruction still says "jump to 28" — which is in the middle of the first program.</p>
<p>Even without an abstraction, several programs can share memory if each one is protected from the others. The IBM 360 did it with <strong>protection keys</strong>: memory was split into 2-KB blocks, each with a 4-bit key, and the CPU refused any access whose key did not match the key in the PSW. Protection worked — but the addresses inside program (b) were still wrong, because both programs were written as if they started at address 0. The simulator shows what happens:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/def1b61f76f3ce7aa450f3e3fe63c5593193ae72.svg" alt="Without relocation, JMP 28 of program B lands on the ADD inside program A" loading="lazy" /><p class="chu-thich">🧮 Without relocation, JMP 28 of program B lands on the ADD inside program A</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BASE = 16384, LIMIT = 16384;
/** Phần cứng base/limit: kiểm TRƯỚC (địa chỉ &lt; limit), rồi cộng base. */
function dich(ao, coBase) {
  if (!coBase) return { vatLy: ao, ok: true };
  if (ao &lt; 0 || ao &gt;= LIMIT) return { vatLy: null, ok: false };
  return { vatLy: BASE + ao, ok: true };
}
const THU = [28, 0, 16383, 16384, 20000];       // virtual addresses program B uses</code></pre></details>
<p>The IBM 360's fix was <strong>static relocation</strong>: while loading program (b) at 16384, the loader adds 16384 to every address constant in it (<code>JMP 28</code> becomes <code>JMP 16412</code>). That slows loading and needs extra information telling which words are addresses and which are just numbers (<code>MOV REGISTER1, 28</code> must NOT be changed). ➕ Modern Linux still relocates at load time, in a cleaner way: a <strong>position-independent executable</strong> (PIE) is loaded at a random base each run, while a non-PIE one sits at a fixed address:</p>
<div class="out"># One tiny program, linked two ways: at a FIXED address (no-pie) and relocatable (pie)<br>
$ cat &gt; dau.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) { printf("main is at %p\\n", (void *)main); return 0; }<br>
&gt; X<br>
$ gcc -no-pie dau.c -o co-dinh<br>
$ gcc -pie -fPIE dau.c -o di-dong<br>
$ file co-dinh di-dong | cut -c1-60<br>
co-dinh: ELF 64-bit LSB executable, ARM aarch64, version 1 (<br>
di-dong: ELF 64-bit LSB pie executable, ARM aarch64, version<br>
# run each twice<br>
$ ./co-dinh; ./co-dinh<br>
main is at 0x400684<br>
main is at 0x400684<br>
$ ./di-dong; ./di-dong<br>
main is at 0xaaaae3b00754<br>
main is at 0xaaaad2350754</div>
<p>The fixed binary always has <code>main</code> at <code>0x400684</code>; the PIE binary's <code>main</code> moves every run (address space layout randomization), yet its last three hex digits <code>754</code> never change — the base is always a multiple of the page size, a detail that will matter on slide 13.</p>
<p class="pitfall">⚠️ FE wording: "relocation" = adjusting addresses for where the program is loaded; "protection" = stopping a program from touching memory that is not its own. Protection keys gave protection without relocation.</p>`,
        `<p class="y-chinh">🎯 Hình 3-2, <strong>bài toán tái định vị (relocation problem)</strong>: (a) một chương trình 16 KB mở đầu bằng <code>JMP 24</code>, (b) một chương trình 16 KB khác mở đầu bằng <code>JMP 28</code>, (c) cả hai được nạp nối tiếp nhau. Chương trình (b) giờ nằm ở 16384–32767, nhưng lệnh đầu tiên của nó vẫn nói "nhảy tới 28" — mà 28 lại nằm giữa chương trình thứ nhất.</p>
<p>Dù không có trừu tượng, nhiều chương trình vẫn có thể dùng chung bộ nhớ nếu mỗi chương trình được bảo vệ khỏi các chương trình kia. IBM 360 làm bằng <strong>khoá bảo vệ (protection key)</strong>: bộ nhớ chia thành khối 2 KB, mỗi khối một khoá 4 bit, và CPU từ chối mọi truy cập có khoá không khớp khoá trong PSW. Bảo vệ thì được — nhưng các địa chỉ bên trong chương trình (b) vẫn sai, vì cả hai chương trình đều được viết như thể chúng bắt đầu ở địa chỉ 0. Bộ mô phỏng cho thấy chuyện gì xảy ra:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/aa7ef48928561aaec661f5423548df6e91444168.svg" alt="Không tái định vị, JMP 28 của chương trình B rơi vào lệnh ADD giữa chương trình A" loading="lazy" /><p class="chu-thich">🧮 Không tái định vị, JMP 28 của chương trình B rơi vào lệnh ADD giữa chương trình A</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BASE = 16384, LIMIT = 16384;
/** Phần cứng base/limit: kiểm TRƯỚC (địa chỉ &lt; limit), rồi cộng base. */
function dich(ao, coBase) {
  if (!coBase) return { vatLy: ao, ok: true };
  if (ao &lt; 0 || ao &gt;= LIMIT) return { vatLy: null, ok: false };
  return { vatLy: BASE + ao, ok: true };
}
const THU = [28, 0, 16383, 16384, 20000];       // virtual addresses program B uses</code></pre></details>
<p>Cách IBM 360 chữa là <strong>tái định vị tĩnh (static relocation)</strong>: khi nạp chương trình (b) ở 16384, bộ nạp cộng 16384 vào mọi hằng địa chỉ trong nó (<code>JMP 28</code> thành <code>JMP 16412</code>). Việc đó làm chậm lúc nạp và cần thông tin phụ cho biết từ nào là địa chỉ, từ nào chỉ là con số (<code>MOV REGISTER1, 28</code> thì KHÔNG được sửa). ➕ Linux hiện đại vẫn tái định vị lúc nạp, theo cách gọn hơn: một <strong>tệp thực thi độc lập vị trí (PIE — position-independent executable)</strong> được nạp ở một địa chỉ gốc ngẫu nhiên mỗi lần chạy, còn tệp không-PIE nằm ở địa chỉ cố định:</p>
<div class="out"># Một chương trình nhỏ, liên kết hai kiểu: ở địa chỉ CỐ ĐỊNH (no-pie) và tái định vị được (pie)<br>
$ cat &gt; dau.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) { printf("main is at %p\\n", (void *)main); return 0; }<br>
&gt; X<br>
$ gcc -no-pie dau.c -o co-dinh<br>
$ gcc -pie -fPIE dau.c -o di-dong<br>
$ file co-dinh di-dong | cut -c1-60<br>
co-dinh: ELF 64-bit LSB executable, ARM aarch64, version 1 (<br>
di-dong: ELF 64-bit LSB pie executable, ARM aarch64, version<br>
# chạy mỗi bản hai lần<br>
$ ./co-dinh; ./co-dinh<br>
main is at 0x400684<br>
main is at 0x400684<br>
$ ./di-dong; ./di-dong<br>
main is at 0xaaaae3b00754<br>
main is at 0xaaaad2350754</div>
<p>Bản cố định lúc nào cũng có <code>main</code> ở <code>0x400684</code>; <code>main</code> của bản PIE đổi chỗ mỗi lần chạy (ngẫu nhiên hoá bố cục không gian địa chỉ — ASLR), vậy mà ba chữ số hex cuối <code>754</code> không bao giờ đổi — địa chỉ gốc luôn là bội của kích thước trang, một chi tiết sẽ quan trọng ở slide 13.</p>
<p class="pitfall">⚠️ Cách dùng chữ trong FE: "relocation" (tái định vị) = chỉnh địa chỉ theo chỗ chương trình được nạp; "protection" (bảo vệ) = ngăn chương trình chạm vào bộ nhớ không phải của nó. Khoá bảo vệ cho bảo vệ mà không cho tái định vị.</p>`],
      [5, 'Base and Limit Registers',
        `<p class="y-chinh">🎯 Figure 3-3: <strong>base and limit registers</strong> give each process its own <strong>address space</strong>. When program (b) runs, the base register holds 16384 (where it was loaded) and the limit register holds 16384 (its length). Every address the program issues is first <strong>compared with the limit</strong>, then <strong>added to the base</strong> — so <code>JMP 28</code> goes to 16412, automatically.</p>
<p>An <strong>address space</strong> is the set of addresses a process may use, private to it — like a phone number that means one thing in one country and another thing elsewhere. Base and limit are the simplest way to build it: <strong>dynamic relocation</strong>, done by the hardware on every memory reference, so the program needs no changes when loaded. Only the OS may load the two registers (privileged instructions). The CDC 6600 had this; the Intel 8088 in the first IBM PC had base registers (its segment registers) but no limit.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9b35071f94ac611df2397f6d0091aa48de3bbad6.svg" alt="Base 16384, limit 16384: each virtual address of program B is checked, then relocated" loading="lazy" /><p class="chu-thich">🧮 Base 16384, limit 16384: each virtual address of program B is checked, then relocated</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BASE = 16384, LIMIT = 16384;
/** Phần cứng base/limit: kiểm TRƯỚC (địa chỉ &lt; limit), rồi cộng base. */
function dich(ao, coBase) {
  if (!coBase) return { vatLy: ao, ok: true };
  if (ao &lt; 0 || ao &gt;= LIMIT) return { vatLy: null, ok: false };
  return { vatLy: BASE + ao, ok: true };
}
const THU = [28, 0, 16383, 16384, 20000];       // virtual addresses program B uses</code></pre></details>
<p>Virtual 16383 is the last valid byte (16384 + 16383 = 32767); 16384 and anything larger is outside the address space, so the hardware traps to the OS instead of touching program A. The price: an <strong>addition and a comparison on every memory reference</strong>. Comparisons are fast, but an addition is slow because the carry must ripple through all bits unless special adder circuits are used.</p>
<p class="pitfall">⚠️ FE6 question 15 (dạng câu FE): P1 = 8 KB, P2 = 4 KB, P3 = 16 KB loaded one after another from 0 — base of P3 = 8 + 4 = <strong>12 KB</strong>, limit = its size <strong>16 KB</strong> (in Tanenbaum the limit is the LENGTH, not the end address 28 KB).</p>`,
        `<p class="y-chinh">🎯 Hình 3-3: <strong>thanh ghi cơ sở và giới hạn (base and limit registers)</strong> cho mỗi tiến trình một <strong>không gian địa chỉ (address space)</strong> riêng. Khi chương trình (b) chạy, thanh ghi cơ sở giữ 16384 (chỗ nó được nạp) và thanh ghi giới hạn giữ 16384 (độ dài của nó). Mọi địa chỉ chương trình phát ra trước hết được <strong>so với giới hạn</strong>, rồi <strong>cộng với cơ sở</strong> — nên <code>JMP 28</code> tự động tới 16412.</p>
<p><strong>Không gian địa chỉ</strong> là tập các địa chỉ một tiến trình được dùng, riêng của nó — như số điện thoại có nghĩa này ở nước này và nghĩa khác ở nước khác. Cơ sở và giới hạn là cách đơn giản nhất để dựng nó: <strong>tái định vị động (dynamic relocation)</strong>, do phần cứng làm ở mỗi lần truy cập bộ nhớ, nên chương trình không phải sửa gì khi nạp. Chỉ HĐH được nạp hai thanh ghi đó (lệnh đặc quyền). Máy CDC 6600 có cơ chế này; Intel 8088 trong chiếc IBM PC đầu tiên có thanh ghi cơ sở (các thanh ghi đoạn) nhưng không có giới hạn.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a020c8842b71156d41b006f2fc1f225095fb7e21.svg" alt="Cơ sở 16384, giới hạn 16384: mỗi địa chỉ ảo của chương trình B được kiểm rồi mới tái định vị" loading="lazy" /><p class="chu-thich">🧮 Cơ sở 16384, giới hạn 16384: mỗi địa chỉ ảo của chương trình B được kiểm rồi mới tái định vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BASE = 16384, LIMIT = 16384;
/** Phần cứng base/limit: kiểm TRƯỚC (địa chỉ &lt; limit), rồi cộng base. */
function dich(ao, coBase) {
  if (!coBase) return { vatLy: ao, ok: true };
  if (ao &lt; 0 || ao &gt;= LIMIT) return { vatLy: null, ok: false };
  return { vatLy: BASE + ao, ok: true };
}
const THU = [28, 0, 16383, 16384, 20000];       // virtual addresses program B uses</code></pre></details>
<p>Ảo 16383 là byte hợp lệ cuối cùng (16384 + 16383 = 32767); 16384 trở lên là ngoài không gian địa chỉ, nên phần cứng bẫy vào HĐH thay vì chạm vào chương trình A. Cái giá: <strong>một phép cộng và một phép so sánh ở mỗi lần truy cập bộ nhớ</strong>. So sánh thì nhanh, nhưng phép cộng chậm vì bit nhớ (carry) phải lan qua mọi bit, trừ khi dùng mạch cộng đặc biệt.</p>
<p class="pitfall">⚠️ FE6 câu 15 (dạng câu FE): P1 = 8 KB, P2 = 4 KB, P3 = 16 KB nạp nối tiếp từ 0 — cơ sở của P3 = 8 + 4 = <strong>12 KB</strong>, giới hạn = kích thước của nó <strong>16 KB</strong> (theo Tanenbaum, giới hạn là ĐỘ DÀI, không phải địa chỉ kết thúc 28 KB).</p>`],
      [6, 'Swapping (1)',
        `<p class="y-chinh">🎯 Figure 3-4, <strong>swapping</strong>: memory allocation changes as processes come in and leave. (a) only A is in memory; (b)–(c) B and C are brought in; (d) A is swapped out to disk; (e)–(f) D comes in and B goes out; (g) A comes back — at a <strong>different place</strong> than before. Shaded regions are unused memory.</p>
<p><strong>Swapping</strong> = bring in each process in its entirety, run it for a while, then put it back on the disk. Idle processes cost no RAM. Because A returns at a new address, its addresses must be relocated — in software at swap-in time, or (better) in hardware with base and limit. Over time the free memory breaks into many small <strong>holes</strong>; they could be combined by moving all processes down (<strong>memory compaction</strong>), but copying all of memory takes seconds, so it is rarely done.</p>
<p>➕ Swapping lives on in Linux, at page granularity rather than whole processes. Here a program uses 150 MB inside a container that may only keep 64 MB in RAM but is allowed to swap:</p>
<pre><code class="language-c">// Use 150 MB in a container whose RAM limit is 64 MB but which may swap
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

static void show(const char *when) {                    // VmRSS = in RAM, VmSwap = moved out to the swap area
    FILE *f = fopen("/proc/self/status", "r");
    char line[256];
    printf("%-28s", when);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, "VmRSS", 5) || !strncmp(line, "VmSwap", 6)) {
            line[strcspn(line, "\\n")] = 0;
            printf("  %s", line);
        }
    printf("\\n");
    fclose(f);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    size_t mb = 150;
    char *p = malloc(mb &lt;&lt; 20);
    show("after malloc(150 MB):");
    for (size_t i = 0; i &lt; (mb &lt;&lt; 20); i += 4096) p[i] = 1;     // touch every page
    show("after touching 150 MB:");
    long sum = 0;
    for (size_t i = 0; i &lt; (mb &lt;&lt; 20); i += 4096) sum += p[i];  // read it all again: pages come back
    show("after reading it again:");
    printf("sum = %ld (every page still holds its 1)\\n", sum);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m --memory-swap=256m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread hoan-doi.c -o hoan-doi &amp;&amp; ./hoan-doi<br>
after malloc(150 MB): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VmRSS:	 &nbsp;&nbsp;&nbsp;1220 kB &nbsp;VmSwap:	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 kB<br>
after touching 150 MB: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VmRSS:	 &nbsp;&nbsp;59480 kB &nbsp;VmSwap:	 &nbsp;&nbsp;95336 kB<br>
after reading it again: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VmRSS:	 &nbsp;&nbsp;64160 kB &nbsp;VmSwap:	 &nbsp;&nbsp;90656 kB<br>
sum = 38400 (every page still holds its 1)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>After touching 150 MB, only about 60 MB is resident (<code>VmRSS</code>); about 90 MB was moved to the swap area (<code>VmSwap</code>). Reading everything again still gives the right sum: swapped-out pages were brought back on demand, invisibly. Without swap the same container would be killed — the OOM experiment of lesson "Start here".</p>
<p class="pitfall">⚠️ FE2 question 12 = FE10 question 21: swapping out a low-priority process so a higher-priority one can run, then swapping it back, is called <strong>roll out, roll in</strong>. And "who swaps processes in and out?" — the <strong>memory manager</strong> (FE10 question 26).</p>`,
        `<p class="y-chinh">🎯 Hình 3-4, <strong>swapping (hoán đổi)</strong>: cách cấp phát bộ nhớ thay đổi khi các tiến trình vào và ra. (a) chỉ có A trong bộ nhớ; (b)–(c) B và C được đưa vào; (d) A bị đẩy ra đĩa; (e)–(f) D vào và B ra; (g) A quay lại — ở <strong>một chỗ khác</strong> lúc trước. Vùng gạch chéo là bộ nhớ chưa dùng.</p>
<p><strong>Swapping</strong> = đưa cả tiến trình vào nguyên vẹn, cho chạy một lúc, rồi trả nó về đĩa. Tiến trình đang ngồi không thì không tốn RAM. Vì A quay lại ở địa chỉ mới, các địa chỉ của nó phải được tái định vị — bằng phần mềm lúc đưa vào, hoặc (tốt hơn) bằng phần cứng với cơ sở và giới hạn. Lâu dần bộ nhớ trống vỡ thành nhiều <strong>lỗ (hole)</strong> nhỏ; có thể gộp chúng lại bằng cách dời mọi tiến trình xuống dưới (<strong>dồn bộ nhớ — memory compaction</strong>), nhưng chép toàn bộ bộ nhớ tốn hàng giây, nên hiếm khi làm.</p>
<p>➕ Swapping vẫn sống trong Linux, nhưng theo từng trang chứ không theo cả tiến trình. Đây là một chương trình dùng 150 MB trong container chỉ được giữ 64 MB trong RAM nhưng được phép swap:</p>
<pre><code class="language-c">// Dùng 150 MB trong container chỉ được 64 MB RAM nhưng được phép swap
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

static void show(const char *when) {                    // VmRSS = đang ở RAM, VmSwap = đã bị đẩy ra vùng swap
    FILE *f = fopen("/proc/self/status", "r");
    char line[256];
    printf("%-28s", when);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, "VmRSS", 5) || !strncmp(line, "VmSwap", 6)) {
            line[strcspn(line, "\\n")] = 0;
            printf("  %s", line);
        }
    printf("\\n");
    fclose(f);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    size_t mb = 150;
    char *p = malloc(mb &lt;&lt; 20);
    show("after malloc(150 MB):");
    for (size_t i = 0; i &lt; (mb &lt;&lt; 20); i += 4096) p[i] = 1;     // chạm từng trang
    show("after touching 150 MB:");
    long sum = 0;
    for (size_t i = 0; i &lt; (mb &lt;&lt; 20); i += 4096) sum += p[i];  // đọc lại hết: các trang quay về
    show("after reading it again:");
    printf("sum = %ld (every page still holds its 1)\\n", sum);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m --memory-swap=256m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread hoan-doi.c -o hoan-doi &amp;&amp; ./hoan-doi<br>
after malloc(150 MB): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VmRSS:	 &nbsp;&nbsp;&nbsp;1220 kB &nbsp;VmSwap:	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 kB<br>
after touching 150 MB: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VmRSS:	 &nbsp;&nbsp;59480 kB &nbsp;VmSwap:	 &nbsp;&nbsp;95336 kB<br>
after reading it again: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VmRSS:	 &nbsp;&nbsp;64160 kB &nbsp;VmSwap:	 &nbsp;&nbsp;90656 kB<br>
sum = 38400 (every page still holds its 1)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Sau khi chạm 150 MB, chỉ khoảng 60 MB còn ở RAM (<code>VmRSS</code>); khoảng 90 MB đã bị chuyển ra vùng swap (<code>VmSwap</code>). Đọc lại hết vẫn ra tổng đúng: các trang đã bị đẩy ra được đưa về theo yêu cầu, không ai thấy. Nếu không có swap, cũng container đó sẽ bị giết — thí nghiệm OOM của bài "Bắt đầu tại đây".</p>
<p class="pitfall">⚠️ FE2 câu 12 = FE10 câu 21: đẩy một tiến trình ưu tiên thấp ra để tiến trình ưu tiên cao chạy, rồi đưa nó trở lại, được gọi là <strong>roll out, roll in</strong>. Và "ai đưa tiến trình ra vào bộ nhớ?" — <strong>bộ quản lý bộ nhớ (memory manager)</strong> (FE10 câu 26).</p>`],
      [7, 'Swapping (2)',
        `<p class="y-chinh">🎯 Figure 3-5: processes <strong>grow</strong>. (a) Leave some room for a growing data segment; (b) a process with a stack growing <strong>down</strong> and a data segment (heap) growing <strong>up</strong> gets one gap between them that either can use.</p>
<p>If a process is placed with no free space next to it and its data grows, it must be moved to a hole big enough, or other processes must be swapped out to make room, or — if nothing works — it must wait or be killed. Allocating a little extra memory up front avoids most of these moves; when the process is swapped out, only the memory actually in use needs to be written, not the gap.</p>
<p>➕ Layout (b) is exactly how a Linux process looks today: the heap grows up from the program's data, the stack grows down from the top. A program can watch both directions:</p>
<pre><code class="language-c">// The two parts of a process that GROW: the heap (data) grows up, the stack grows down
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;stdint.h&gt;
#include &lt;unistd.h&gt;

static void depth(int n, uintptr_t prev) {
    int local;                                           // one local variable per call
    uintptr_t me = (uintptr_t)&amp;local;
    if (prev) printf("  call depth %d: its local variable is %ld bytes BELOW the previous one\\n", n, (long)(prev - me));
    if (n &lt; 3) depth(n + 1, me);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    uintptr_t b0 = (uintptr_t)sbrk(0);                   // the "program break" = top of the heap
    void *x = malloc(100000);
    uintptr_t b1 = (uintptr_t)sbrk(0);
    printf("heap: the program break moved UP by %lu bytes for malloc(100000)\\n", (unsigned long)(b1 - b0));
    void *y = malloc(1000000);
    printf("malloc(1000000) came from %s\\n", (uintptr_t)y &gt; b1 ? "a separate mmap region, not the heap" : "the heap");
    printf("stack:\\n");
    depth(1, 0);
    free(x); free(y);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread heap-stack.c -o heap-stack &amp;&amp; ./heap-stack<br>
heap: the program break moved UP by 135168 bytes for malloc(100000)<br>
malloc(1000000) came from a separate mmap region, not the heap<br>
stack:<br>
&nbsp;&nbsp;call depth 2: its local variable is 48 bytes BELOW the previous one<br>
&nbsp;&nbsp;call depth 3: its local variable is 48 bytes BELOW the previous one</div>
<p>The <strong>program break</strong> (the top of the heap, read with <code>sbrk(0)</code>) moved up by 135,168 bytes for a 100,000-byte <code>malloc</code> — glibc rounds the growth up to whole pages plus a 128-KB pad, the "room for growth" of the figure. Each nested call put its local variable 48 bytes <strong>lower</strong>: the stack grows down. A 1-MB <code>malloc</code> did not come from the heap at all but from a separate <code>mmap</code> region — modern address spaces have more than two growing parts.</p>
<p class="meo">🧠 Heap = memory from <code>malloc</code>/<code>new</code> (grows up); stack = local variables and return addresses (grows down). Running out of the gap between them is a "stack overflow" — Java's <code>StackOverflowError</code> on deep recursion.</p>`,
        `<p class="y-chinh">🎯 Hình 3-5: tiến trình <strong>lớn lên</strong>. (a) Chừa sẵn chỗ cho đoạn dữ liệu đang lớn; (b) tiến trình có ngăn xếp lớn <strong>xuống dưới</strong> và đoạn dữ liệu (heap) lớn <strong>lên trên</strong> được một khoảng trống chung ở giữa, bên nào cũng dùng được.</p>
<p>Nếu tiến trình được đặt ở chỗ không có khoảng trống bên cạnh mà dữ liệu của nó lớn lên, nó phải bị dời sang một lỗ đủ lớn, hoặc phải đẩy bớt tiến trình khác ra để lấy chỗ, hoặc — nếu không cách nào được — phải chờ hay bị giết. Cấp dư một chút ngay từ đầu tránh được phần lớn những lần dời đó; khi tiến trình bị đẩy ra đĩa, chỉ phần bộ nhớ đang thật sự dùng mới cần ghi, không ghi khoảng trống.</p>
<p>➕ Cách (b) đúng là hình dáng một tiến trình Linux ngày nay: heap lớn lên từ dữ liệu của chương trình, ngăn xếp lớn xuống từ đỉnh. Một chương trình có thể tự quan sát cả hai chiều:</p>
<pre><code class="language-c">// Hai phần của tiến trình biết LỚN LÊN: heap (dữ liệu) lớn lên trên, ngăn xếp lớn xuống dưới
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;stdint.h&gt;
#include &lt;unistd.h&gt;

static void depth(int n, uintptr_t prev) {
    int local;                                           // mỗi lần gọi một biến cục bộ
    uintptr_t me = (uintptr_t)&amp;local;
    if (prev) printf("  call depth %d: its local variable is %ld bytes BELOW the previous one\\n", n, (long)(prev - me));
    if (n &lt; 3) depth(n + 1, me);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    uintptr_t b0 = (uintptr_t)sbrk(0);                   // "program break" = đỉnh của heap
    void *x = malloc(100000);
    uintptr_t b1 = (uintptr_t)sbrk(0);
    printf("heap: the program break moved UP by %lu bytes for malloc(100000)\\n", (unsigned long)(b1 - b0));
    void *y = malloc(1000000);
    printf("malloc(1000000) came from %s\\n", (uintptr_t)y &gt; b1 ? "a separate mmap region, not the heap" : "the heap");
    printf("stack:\\n");
    depth(1, 0);
    free(x); free(y);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread heap-stack.c -o heap-stack &amp;&amp; ./heap-stack<br>
heap: the program break moved UP by 135168 bytes for malloc(100000)<br>
malloc(1000000) came from a separate mmap region, not the heap<br>
stack:<br>
&nbsp;&nbsp;call depth 2: its local variable is 48 bytes BELOW the previous one<br>
&nbsp;&nbsp;call depth 3: its local variable is 48 bytes BELOW the previous one</div>
<p><strong>Program break</strong> (đỉnh của heap, đọc bằng <code>sbrk(0)</code>) dời lên 135.168 byte cho một lần <code>malloc</code> 100.000 byte — glibc làm tròn phần nới lên thành số trang chẵn cộng một khoảng đệm 128 KB, chính là "chỗ để lớn" (room for growth) của hình. Mỗi lần gọi lồng nhau đặt biến cục bộ của nó <strong>thấp hơn</strong> 48 byte: ngăn xếp lớn xuống. Một <code>malloc</code> 1 MB lại không lấy từ heap mà từ một vùng <code>mmap</code> riêng — không gian địa chỉ hiện đại có nhiều hơn hai phần biết lớn.</p>
<p class="meo">🧠 Heap = bộ nhớ của <code>malloc</code>/<code>new</code> (lớn lên trên); ngăn xếp (stack) = biến cục bộ và địa chỉ trở về (lớn xuống dưới). Hết khoảng trống giữa hai bên là "tràn ngăn xếp" — <code>StackOverflowError</code> của Java khi đệ quy quá sâu.</p>`],
      [8, 'Memory Management with Bitmaps',
        `<p class="y-chinh">🎯 Figure 3-6: two ways to <strong>keep track of free memory</strong>. Memory is divided into <strong>allocation units</strong>; (b) a <strong>bitmap</strong> holds one bit per unit (1 = in use, 0 = free); (c) a <strong>linked list</strong> holds one entry per segment: P (process) or H (hole), start, length.</p>
<p>The simulator rebuilds both structures from a single table "unit → owner" taken from the figure, so you can check that they really describe the same memory:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/08c448325b4fae5042053f011be8471dd0ca1dec.svg" alt="Figure 3-6 recomputed: the same 32 units as a bitmap and as a list" loading="lazy" /><p class="chu-thich">🧮 Figure 3-6 recomputed: the same 32 units as a bitmap and as a list</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU = 'AAAAA...BBBBBBCCCC..DDDDDDEEE...';   // 32 allocation units, '.' = free
/** Bitmap: 1 = đang dùng, 0 = trống (8 đơn vị mỗi byte). */
const bitmap = (chu) =&gt; [...chu].map((c) =&gt; (c === '.' ? 0 : 1));
/** Danh sách liên kết: mỗi đoạn liên tục cùng chủ = một mục { loai: 'P' | 'H', bat, dai, ten }. */
function danhSach(chu) {
  const ds = [];
  for (let i = 0; i &lt; chu.length;) {
    let j = i; while (j &lt; chu.length &amp;&amp; chu[j] === chu[i]) j++;
    ds.push({ loai: chu[i] === '.' ? 'H' : 'P', bat: i, dai: j - i, ten: chu[i] });
    i = j;
  }
  return ds;
}
/** Tiến trình ten kết thúc: đoạn của nó thành lỗ, rồi gộp với lỗ kề trái/phải (đúng việc của danh sách liên kết). */
function ketThuc(ds, ten) {
  const ra = ds.map((d) =&gt; (d.ten === ten ? { ...d, loai: 'H', ten: '.' } : { ...d }));
  const gop = [];
  for (const d of ra) {
    const truoc = gop[gop.length - 1];
    if (truoc &amp;&amp; truoc.loai === 'H' &amp;&amp; d.loai === 'H') truoc.dai += d.dai; else gop.push(d);
  }
  return gop;
}
const CA = { a: 'AXB', b: 'AX.', c: '.XB', d: '.X.' };   // Figure 3-7 (a)–(d)</code></pre></details>
<p>Bitmap trade-offs: the <strong>allocation unit size</strong> is the key design choice. Small units → big bitmap; with 4-byte units, 32 bits of memory need 1 bit of map, so the bitmap takes 1/32 of memory. Large units → small bitmap, but a process that is not an exact multiple of the unit wastes the rest of its last unit. The real weakness: to place a process of k units, the memory manager must <strong>search the bitmap for k consecutive 0 bits</strong> — slow, because runs may cross word boundaries.</p>
<p class="pitfall">⚠️ FE6 question 16 = FE8 question 16 = FE12 question 16: "a binary representation where each bit corresponds to an allocation unit" = <strong>bitmap</strong>. FE3 question 12 "which method is used to track memory?" — <strong>linked lists</strong> (best fit is an allocation algorithm, not a tracking method).</p>`,
        `<p class="y-chinh">🎯 Hình 3-6: hai cách <strong>theo dõi bộ nhớ trống</strong>. Bộ nhớ chia thành các <strong>đơn vị cấp phát (allocation unit)</strong>; (b) một <strong>bitmap</strong> giữ mỗi đơn vị một bit (1 = đang dùng, 0 = trống); (c) một <strong>danh sách liên kết (linked list)</strong> giữ mỗi đoạn một mục: P (tiến trình) hay H (lỗ trống), vị trí bắt đầu, độ dài.</p>
<p>Bộ mô phỏng dựng lại cả hai cấu trúc từ đúng một bảng "đơn vị → chủ" lấy từ hình, để bạn kiểm được chúng thật sự mô tả cùng một bộ nhớ:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4e9e9895867ae955c941762a540c4d0820e60089.svg" alt="Hình 3-6 tính lại: cùng 32 đơn vị dạng bitmap và dạng danh sách" loading="lazy" /><p class="chu-thich">🧮 Hình 3-6 tính lại: cùng 32 đơn vị dạng bitmap và dạng danh sách</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU = 'AAAAA...BBBBBBCCCC..DDDDDDEEE...';   // 32 allocation units, '.' = free
/** Bitmap: 1 = đang dùng, 0 = trống (8 đơn vị mỗi byte). */
const bitmap = (chu) =&gt; [...chu].map((c) =&gt; (c === '.' ? 0 : 1));
/** Danh sách liên kết: mỗi đoạn liên tục cùng chủ = một mục { loai: 'P' | 'H', bat, dai, ten }. */
function danhSach(chu) {
  const ds = [];
  for (let i = 0; i &lt; chu.length;) {
    let j = i; while (j &lt; chu.length &amp;&amp; chu[j] === chu[i]) j++;
    ds.push({ loai: chu[i] === '.' ? 'H' : 'P', bat: i, dai: j - i, ten: chu[i] });
    i = j;
  }
  return ds;
}
/** Tiến trình ten kết thúc: đoạn của nó thành lỗ, rồi gộp với lỗ kề trái/phải (đúng việc của danh sách liên kết). */
function ketThuc(ds, ten) {
  const ra = ds.map((d) =&gt; (d.ten === ten ? { ...d, loai: 'H', ten: '.' } : { ...d }));
  const gop = [];
  for (const d of ra) {
    const truoc = gop[gop.length - 1];
    if (truoc &amp;&amp; truoc.loai === 'H' &amp;&amp; d.loai === 'H') truoc.dai += d.dai; else gop.push(d);
  }
  return gop;
}
const CA = { a: 'AXB', b: 'AX.', c: '.XB', d: '.X.' };   // Figure 3-7 (a)–(d)</code></pre></details>
<p>Được và mất của bitmap: <strong>kích thước đơn vị cấp phát</strong> là lựa chọn thiết kế then chốt. Đơn vị nhỏ → bitmap lớn; với đơn vị 4 byte, 32 bit bộ nhớ cần 1 bit bitmap, nên bitmap chiếm 1/32 bộ nhớ. Đơn vị lớn → bitmap nhỏ, nhưng tiến trình không vừa bội số đơn vị sẽ phí phần còn lại của đơn vị cuối. Điểm yếu thật sự: để đặt một tiến trình k đơn vị, bộ quản lý bộ nhớ phải <strong>dò trong bitmap k bit 0 liên tiếp</strong> — chậm, vì dãy bit đó có thể vắt qua ranh giới từ (word).</p>
<p class="pitfall">⚠️ FE6 câu 16 = FE8 câu 16 = FE12 câu 16: "biểu diễn nhị phân, mỗi bit ứng với một đơn vị cấp phát" = <strong>bitmap</strong>. FE3 câu 12 "phương pháp nào dùng để theo dõi bộ nhớ?" — <strong>linked lists</strong> (best fit là thuật toán cấp phát, không phải cách theo dõi).</p>`],
      [9, 'Memory Management with Linked Lists',
        `<p class="y-chinh">🎯 Figure 3-7: with a list sorted by address, a terminating process X has four possible neighbour combinations: (a) process–X–process: X just becomes a hole; (b) process–X–hole and (c) hole–X–process: X <strong>merges</strong> with the hole next to it; (d) hole–X–hole: three entries merge into one.</p>
<p>Keeping the list <strong>sorted by address</strong> makes this merging trivial: the neighbours of X are the previous and next entries. A <strong>doubly linked list</strong> makes it even easier, because finding the previous entry no longer needs a search. The simulator runs a real merge function on the four cases:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/020a983cf10cf16391594515ee0006d60f3ff6a8.svg" alt="X terminates: free neighbours merge, the list shrinks" loading="lazy" /><p class="chu-thich">🧮 X terminates: free neighbours merge, the list shrinks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU = 'AAAAA...BBBBBBCCCC..DDDDDDEEE...';   // 32 allocation units, '.' = free
/** Bitmap: 1 = đang dùng, 0 = trống (8 đơn vị mỗi byte). */
const bitmap = (chu) =&gt; [...chu].map((c) =&gt; (c === '.' ? 0 : 1));
/** Danh sách liên kết: mỗi đoạn liên tục cùng chủ = một mục { loai: 'P' | 'H', bat, dai, ten }. */
function danhSach(chu) {
  const ds = [];
  for (let i = 0; i &lt; chu.length;) {
    let j = i; while (j &lt; chu.length &amp;&amp; chu[j] === chu[i]) j++;
    ds.push({ loai: chu[i] === '.' ? 'H' : 'P', bat: i, dai: j - i, ten: chu[i] });
    i = j;
  }
  return ds;
}
/** Tiến trình ten kết thúc: đoạn của nó thành lỗ, rồi gộp với lỗ kề trái/phải (đúng việc của danh sách liên kết). */
function ketThuc(ds, ten) {
  const ra = ds.map((d) =&gt; (d.ten === ten ? { ...d, loai: 'H', ten: '.' } : { ...d }));
  const gop = [];
  for (const d of ra) {
    const truoc = gop[gop.length - 1];
    if (truoc &amp;&amp; truoc.loai === 'H' &amp;&amp; d.loai === 'H') truoc.dai += d.dai; else gop.push(d);
  }
  return gop;
}
const CA = { a: 'AXB', b: 'AX.', c: '.XB', d: '.X.' };   // Figure 3-7 (a)–(d)</code></pre></details>
<p>Without merging, memory would slowly fill up with tiny adjacent holes that no process can use even though together they are large — the list would say "no hole of 3 units" while three 1-unit holes sit side by side. ➕ Real allocators do the same: glibc <code>free()</code> coalesces a freed chunk with free neighbours, and the Linux kernel's page allocator (the <strong>buddy system</strong>, visible in <code>/proc/buddyinfo</code>) merges two free "buddies" into a block twice as big.</p>
<p class="meo">🧠 Each list entry needs: P or H, start, length, pointer to the next (and the previous) entry. The process table entry of a process can point to its list entry so that freeing is quick.</p>`,
        `<p class="y-chinh">🎯 Hình 3-7: với danh sách sắp theo địa chỉ, khi tiến trình X kết thúc có bốn kiểu hàng xóm: (a) tiến trình–X–tiến trình: X chỉ đơn giản thành một lỗ; (b) tiến trình–X–lỗ và (c) lỗ–X–tiến trình: X <strong>gộp</strong> với lỗ bên cạnh; (d) lỗ–X–lỗ: ba mục gộp thành một.</p>
<p>Giữ danh sách <strong>sắp theo địa chỉ</strong> làm việc gộp trở nên dễ: hàng xóm của X chính là mục trước và mục sau nó. Dùng <strong>danh sách liên kết đôi (doubly linked list)</strong> còn dễ hơn nữa, vì tìm mục đứng trước không cần duyệt lại. Bộ mô phỏng chạy một hàm gộp thật trên bốn trường hợp:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3bcc6dfdbb223463fe3d328b08583f9db54f974f.svg" alt="X kết thúc: hàng xóm trống được gộp, danh sách ngắn lại" loading="lazy" /><p class="chu-thich">🧮 X kết thúc: hàng xóm trống được gộp, danh sách ngắn lại</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU = 'AAAAA...BBBBBBCCCC..DDDDDDEEE...';   // 32 allocation units, '.' = free
/** Bitmap: 1 = đang dùng, 0 = trống (8 đơn vị mỗi byte). */
const bitmap = (chu) =&gt; [...chu].map((c) =&gt; (c === '.' ? 0 : 1));
/** Danh sách liên kết: mỗi đoạn liên tục cùng chủ = một mục { loai: 'P' | 'H', bat, dai, ten }. */
function danhSach(chu) {
  const ds = [];
  for (let i = 0; i &lt; chu.length;) {
    let j = i; while (j &lt; chu.length &amp;&amp; chu[j] === chu[i]) j++;
    ds.push({ loai: chu[i] === '.' ? 'H' : 'P', bat: i, dai: j - i, ten: chu[i] });
    i = j;
  }
  return ds;
}
/** Tiến trình ten kết thúc: đoạn của nó thành lỗ, rồi gộp với lỗ kề trái/phải (đúng việc của danh sách liên kết). */
function ketThuc(ds, ten) {
  const ra = ds.map((d) =&gt; (d.ten === ten ? { ...d, loai: 'H', ten: '.' } : { ...d }));
  const gop = [];
  for (const d of ra) {
    const truoc = gop[gop.length - 1];
    if (truoc &amp;&amp; truoc.loai === 'H' &amp;&amp; d.loai === 'H') truoc.dai += d.dai; else gop.push(d);
  }
  return gop;
}
const CA = { a: 'AXB', b: 'AX.', c: '.XB', d: '.X.' };   // Figure 3-7 (a)–(d)</code></pre></details>
<p>Không gộp thì bộ nhớ dần đầy những lỗ tí hon nằm sát nhau mà không tiến trình nào dùng được dù gộp lại thì lớn — danh sách sẽ nói "không có lỗ 3 đơn vị" trong khi ba lỗ 1 đơn vị nằm cạnh nhau. ➕ Bộ cấp phát thật cũng làm y vậy: <code>free()</code> của glibc gộp khối vừa giải phóng với hàng xóm trống, và bộ cấp phát trang của nhân Linux (<strong>hệ thống bạn thân — buddy system</strong>, xem được trong <code>/proc/buddyinfo</code>) gộp hai "bạn thân" trống thành một khối lớn gấp đôi.</p>
<p class="meo">🧠 Mỗi mục danh sách cần: P hay H, vị trí bắt đầu, độ dài, con trỏ tới mục sau (và mục trước). Mục bảng tiến trình của một tiến trình có thể trỏ thẳng vào mục danh sách của nó để giải phóng cho nhanh.</p>`],
      [10, 'Memory Management Algorithms',
        `<p class="y-chinh">🎯 Five ways to pick a hole for a new process: <strong>first fit</strong> (the first hole big enough), <strong>next fit</strong> (like first fit, but start where the last search stopped), <strong>best fit</strong> (the smallest hole that is big enough), <strong>worst fit</strong> (the largest hole), <strong>quick fit</strong> (separate lists for commonly requested sizes).</p>
<p>The hole is usually <strong>split</strong>: the request takes the beginning, the rest stays a smaller hole at the same place. The simulator runs all four searching algorithms on the book's own exercise (holes 10, 4, 20, 18, 7, 9, 12, 15 MB in memory order; requests 12, 10, 9 MB) and reproduces the book's answers — first fit 20, 10, 18; best fit 12, 10, 9; worst fit 20, 18, 15; next fit 20, 18, 9:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/30f9b4e9270ee5f2cbf1f2cb2234bfcf0014bcb3.svg" alt="The book's exercise: the hole each algorithm takes for 12, 10 and 9 MB" loading="lazy" /><p class="chu-thich">🧮 The book's exercise: the hole each algorithm takes for 12, 10 and 9 MB</p></div>
<table><tr><th>algorithm</th><th>holes taken for 12, 10, 9 MB</th></tr><tr><td>First fit</td><td>20, 10, 18</td></tr><tr><td>Next fit</td><td>20, 18, 9</td></tr><tr><td>Best fit</td><td>12, 10, 9</td></tr><tr><td>Worst fit</td><td>20, 18, 15</td></tr></table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a1c6cba80966decb99ac24290b73bcd325da4713.svg" alt="Next fit step by step: the search continues from the hole used last time" loading="lazy" /><p class="chu-thich">🧮 Next fit step by step: the search continues from the hole used last time</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<p>What simulations found (book §3.2.3): first fit is fast and good; next fit is slightly worse than first fit (Bays, 1977); best fit is slower (it searches the whole list) and, surprisingly, <strong>wastes more memory</strong>, because it leaves many tiny useless holes; worst fit was tried to avoid tiny holes and is not a good idea either. Quick fit finds a hole of a common size instantly, but merging neighbours after a free is expensive. ➕ Real-life check — which one does glibc <code>malloc</code> use?</p>
<pre><code class="language-c">// Which hole does glibc malloc choose? Three freed blocks: 5000, 2500 and 9000 bytes, then malloc(2000)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;stdint.h&gt;

int main(void) {
    char *h1 = malloc(5000), *s1 = malloc(100);         // s1, s2, s3 keep the holes apart
    char *h2 = malloc(2500), *s2 = malloc(100);
    char *h3 = malloc(9000), *s3 = malloc(100);
    uintptr_t b = (uintptr_t)h1, a1 = (uintptr_t)h1, a2 = (uintptr_t)h2, a3 = (uintptr_t)h3;   // remember the addresses as numbers
    printf("future holes: H1 = 5000 B at +%ld, H2 = 2500 B at +%ld, H3 = 9000 B at +%ld\\n", (long)(a1 - b), (long)(a2 - b), (long)(a3 - b));
    free(h1); free(h2); free(h3);
    uintptr_t x = (uintptr_t)malloc(2000);
    printf("malloc(2000) -&gt; +%ld = %s\\n", (long)(x - b),
           x == a1 ? "H1 (first fit)" : x == a2 ? "H2: the SMALLEST hole that fits (best fit)" : x == a3 ? "H3 (worst fit)" : "somewhere else");
    uintptr_t big = (uintptr_t)malloc(200000);           // above the mmap threshold (128 KB)
    printf("malloc(200000) -&gt; %s\\n", (big &gt; b + 1000000 || big &lt; b) ? "its own mmap region, outside the heap" : "the heap");
    (void)s1; (void)s2; (void)s3;
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread malloc-lo.c -o malloc-lo &amp;&amp; ./malloc-lo<br>
future holes: H1 = 5000 B at +0, H2 = 2500 B at +5120, H3 = 9000 B at +7744<br>
malloc(2000) -&gt; +5120 = H2: the SMALLEST hole that fits (best fit)<br>
malloc(200000) -&gt; its own mmap region, outside the heap</div>
<p>With holes of 5000, 2500 and 9000 bytes, <code>malloc(2000)</code> took the 2500-byte hole: <strong>best fit</strong>, exactly as glibc's own source says ("for large (≥ 512 bytes) requests, it is a pure best-fit allocator"). For small sizes glibc keeps per-size free lists (tcache, fastbins) — that is quick fit. Big requests (≥ 128 KB by default) skip the holes entirely and get their own <code>mmap</code> region.</p>
<p class="pitfall">⚠️ FE traps: FE8 question 17 / FE13 question 16 (holes 10, 4, 15, 18, 7, 9, 13, 20 KB, 12 KB put into 20 KB) = <strong>worst fit</strong>; FE19 question 14 / FE23 question 34 / FE24 question 4 (addresses 4075/105, 5225/5, 6785/600, 7560/20, 7600/205, 10250/4050; request 200): first fit <strong>6785</strong>, best fit <strong>7600</strong>, worst fit <strong>10250</strong>. FE27 question 4 "best in storage utilization" = best fit (the exam's answer, although the simulations above say it leaves useless holes). Practice lesson 3.C has the FE data sets.</p>`,
        `<p class="y-chinh">🎯 Năm cách chọn lỗ cho tiến trình mới: <strong>first fit</strong> (lỗ đầu tiên đủ lớn), <strong>next fit</strong> (như first fit, nhưng bắt đầu tìm từ chỗ lần trước dừng), <strong>best fit</strong> (lỗ nhỏ nhất mà vẫn đủ lớn), <strong>worst fit</strong> (lỗ lớn nhất), <strong>quick fit</strong> (danh sách riêng cho các kích thước hay được xin).</p>
<p>Lỗ thường được <strong>tách (split)</strong>: yêu cầu lấy phần đầu, phần dư vẫn là một lỗ nhỏ hơn ở cùng chỗ. Bộ mô phỏng chạy cả bốn thuật toán tìm kiếm trên chính bài tập của sách (lỗ 10, 4, 20, 18, 7, 9, 12, 15 MB theo thứ tự địa chỉ; yêu cầu 12, 10, 9 MB) và ra đúng đáp án của sách — first fit 20, 10, 18; best fit 12, 10, 9; worst fit 20, 18, 15; next fit 20, 18, 9:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e8bb0259705a7953c1bef577246ed1f28a7e34c9.svg" alt="Bài tập của sách: lỗ mỗi thuật toán lấy cho 12, 10 và 9 MB" loading="lazy" /><p class="chu-thich">🧮 Bài tập của sách: lỗ mỗi thuật toán lấy cho 12, 10 và 9 MB</p></div>
<table><tr><th>thuật toán</th><th>lỗ được chọn cho 12, 10, 9 MB</th></tr><tr><td>First fit</td><td>20, 10, 18</td></tr><tr><td>Next fit</td><td>20, 18, 9</td></tr><tr><td>Best fit</td><td>12, 10, 9</td></tr><tr><td>Worst fit</td><td>20, 18, 15</td></tr></table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2e215c803939c79f9902bcf5c8a186139c6c253e.svg" alt="Next fit từng bước: lần tìm sau tiếp tục từ lỗ dùng lần trước" loading="lazy" /><p class="chu-thich">🧮 Next fit từng bước: lần tìm sau tiếp tục từ lỗ dùng lần trước</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<p>Kết quả mô phỏng (sách §3.2.3): first fit nhanh và tốt; next fit kém first fit một chút (Bays, 1977); best fit chậm hơn (phải duyệt hết danh sách) và, bất ngờ thay, <strong>phí bộ nhớ hơn</strong>, vì để lại rất nhiều lỗ tí hon vô dụng; worst fit được thử để tránh lỗ tí hon và cũng không phải ý hay. Quick fit tìm lỗ cỡ thông dụng tức thì, nhưng gộp hàng xóm sau khi giải phóng thì tốn kém. ➕ Kiểm ngoài đời thật — <code>malloc</code> của glibc dùng cách nào?</p>
<pre><code class="language-c">// malloc của glibc chọn lỗ nào? Ba khối đã giải phóng: 5000, 2500, 9000 byte, rồi malloc(2000)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;stdint.h&gt;

int main(void) {
    char *h1 = malloc(5000), *s1 = malloc(100);         // s1, s2, s3 giữ các lỗ tách rời nhau
    char *h2 = malloc(2500), *s2 = malloc(100);
    char *h3 = malloc(9000), *s3 = malloc(100);
    uintptr_t b = (uintptr_t)h1, a1 = (uintptr_t)h1, a2 = (uintptr_t)h2, a3 = (uintptr_t)h3;   // nhớ địa chỉ dưới dạng số
    printf("future holes: H1 = 5000 B at +%ld, H2 = 2500 B at +%ld, H3 = 9000 B at +%ld\\n", (long)(a1 - b), (long)(a2 - b), (long)(a3 - b));
    free(h1); free(h2); free(h3);
    uintptr_t x = (uintptr_t)malloc(2000);
    printf("malloc(2000) -&gt; +%ld = %s\\n", (long)(x - b),
           x == a1 ? "H1 (first fit)" : x == a2 ? "H2: the SMALLEST hole that fits (best fit)" : x == a3 ? "H3 (worst fit)" : "somewhere else");
    uintptr_t big = (uintptr_t)malloc(200000);           // trên ngưỡng mmap (128 KB)
    printf("malloc(200000) -&gt; %s\\n", (big &gt; b + 1000000 || big &lt; b) ? "its own mmap region, outside the heap" : "the heap");
    (void)s1; (void)s2; (void)s3;
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread malloc-lo.c -o malloc-lo &amp;&amp; ./malloc-lo<br>
future holes: H1 = 5000 B at +0, H2 = 2500 B at +5120, H3 = 9000 B at +7744<br>
malloc(2000) -&gt; +5120 = H2: the SMALLEST hole that fits (best fit)<br>
malloc(200000) -&gt; its own mmap region, outside the heap</div>
<p>Với các lỗ 5000, 2500 và 9000 byte, <code>malloc(2000)</code> lấy lỗ 2500 byte: <strong>best fit</strong>, đúng như chính mã nguồn glibc viết ("với yêu cầu lớn (≥ 512 byte), nó là bộ cấp phát best-fit thuần"). Với cỡ nhỏ, glibc giữ danh sách trống theo từng cỡ (tcache, fastbin) — đó là quick fit. Yêu cầu lớn (mặc định ≥ 128 KB) bỏ qua các lỗ và được một vùng <code>mmap</code> riêng.</p>
<p class="pitfall">⚠️ Bẫy FE: FE8 câu 17 / FE13 câu 16 (lỗ 10, 4, 15, 18, 7, 9, 13, 20 KB, tiến trình 12 KB được đặt vào lỗ 20 KB) = <strong>worst fit</strong>; FE19 câu 14 / FE23 câu 34 / FE24 câu 4 (địa chỉ 4075/105, 5225/5, 6785/600, 7560/20, 7600/205, 10250/4050; yêu cầu 200): first fit <strong>6785</strong>, best fit <strong>7600</strong>, worst fit <strong>10250</strong>. FE27 câu 4 "tốt nhất về tận dụng bộ nhớ" = best fit (đáp án của đề, dù mô phỏng ở trên cho thấy nó để lại lỗ vô dụng). Bài thực hành 3.C có đủ bộ dữ liệu FE.</p>`],
      [11, 'Virtual Memory',
        `<p class="y-chinh">🎯 Programs became too large to fit in memory. The 1960s fix was <strong>overlays</strong>: the programmer split the program into pieces kept on disk and swapped in and out by an overlay manager. The lasting fix is <strong>virtual memory</strong>: each program has its own address space, broken up into chunks called <strong>pages</strong>; not all pages need to be in RAM at the same time.</p>
<p>With overlays, overlay 0 started first and, when done, told the overlay manager to load overlay 1 — either above it or on top of it. The OS did the swapping, but <strong>the programmer did the splitting</strong>, which was slow, boring and error-prone. Virtual memory (proposed by Fotheringham in 1961 for the Atlas computer) makes the hardware and OS do it automatically: each page is a contiguous range of addresses; pages are <strong>mapped</strong> onto physical memory, and when the program touches a page that is not in RAM, the OS gets it from disk and re-runs the instruction.</p>
<p>➕ The defining property, measured: a program reserves <strong>64 GB</strong> of virtual memory on a machine with 8 GB of RAM:</p>
<pre><code class="language-c">// Virtual memory larger than RAM: reserve 64 GB on a machine with 8 GB
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;unistd.h&gt;

static long vm(const char *key) {                        // a field of /proc/self/status, in kB
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long v = -1; size_t n = strlen(key);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, key, n)) sscanf(line + n + 1, "%ld", &amp;v);
    fclose(f);
    return v;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    printf("page size: %ld bytes\\n", sysconf(_SC_PAGESIZE));
    long size0 = vm("VmSize"), rss0 = vm("VmRSS");
    size_t sz = 64UL &lt;&lt; 30;
    char *p = mmap(NULL, sz, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    if (p == MAP_FAILED) { perror("mmap"); return 1; }
    madvise(p, sz, MADV_NOHUGEPAGE);                     // plain 4 KB pages, no 2 MB huge pages
    printf("mmap 64 GB:   virtual size +%ld MB, resident in RAM +%ld kB\\n", (vm("VmSize") - size0) / 1024, vm("VmRSS") - rss0);
    p[0] = 1; p[sz / 2] = 2; p[sz - 1] = 3;              // touch three bytes: first, middle, last
    printf("touch 3 bytes: virtual size +%ld MB, resident in RAM +%ld kB\\n", (vm("VmSize") - size0) / 1024, vm("VmRSS") - rss0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ao-lon-hon-that.c -o ao-lon-hon-that &amp;&amp; ./ao-lon-hon-that<br>
page size: 4096 bytes<br>
mmap 64 GB: &nbsp;&nbsp;virtual size +65536 MB, resident in RAM +0 kB<br>
touch 3 bytes: virtual size +65536 MB, resident in RAM +12 kB</div>
<p>The virtual size grew by 65,536 MB, but resident memory grew by 0 kB — reserving address space costs no RAM. Touching three bytes in three distant places made the process use exactly 12 kB = <strong>three 4-KB pages</strong>: memory is given out page by page, only when used (<strong>demand paging</strong>). Virtual memory also works well with multiprogramming: while a process waits for its page to come from disk, the CPU runs another one.</p>
<p class="pitfall">⚠️ FE6 question 18: "a solution adopted in the 1960s was to split programs into little pieces called ___" = <strong>overlays</strong> (the slide's own words). FE7 question 19 and FE9 question 23 ask the same sentence but their key says "pages" — that key contradicts the slide; answer <strong>overlays</strong>. FE6 question 17 / FE9 question 26: virtual memory "allows a larger address space than the physical memory, by using RAM and disk".</p>`,
        `<p class="y-chinh">🎯 Chương trình lớn tới mức không vừa bộ nhớ. Cách chữa thập niên 1960 là <strong>overlay (lớp phủ)</strong>: lập trình viên chia chương trình thành nhiều mảnh để trên đĩa, một trình quản lý overlay đưa chúng ra vào bộ nhớ. Cách chữa lâu dài là <strong>bộ nhớ ảo (virtual memory)</strong>: mỗi chương trình có không gian địa chỉ riêng, chia thành các khúc gọi là <strong>trang (page)</strong>; không cần mọi trang cùng nằm trong RAM một lúc.</p>
<p>Với overlay, overlay 0 chạy trước và khi xong thì bảo trình quản lý overlay nạp overlay 1 — đặt phía trên nó hoặc đè lên nó. HĐH lo việc đưa ra đưa vào, nhưng <strong>lập trình viên phải tự chia mảnh</strong> — chậm, chán và dễ sai. Bộ nhớ ảo (Fotheringham đề xuất năm 1961 cho máy Atlas) để phần cứng và HĐH làm tự động: mỗi trang là một dải địa chỉ liên tục; các trang được <strong>ánh xạ (map)</strong> vào bộ nhớ vật lý, và khi chương trình chạm vào một trang chưa có trong RAM, HĐH lấy nó từ đĩa về rồi cho lệnh chạy lại.</p>
<p>➕ Tính chất cốt lõi, đo thật: một chương trình giữ chỗ <strong>64 GB</strong> bộ nhớ ảo trên máy chỉ có 8 GB RAM:</p>
<pre><code class="language-c">// Bộ nhớ ảo lớn hơn RAM: giữ chỗ 64 GB trên máy có 8 GB
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;unistd.h&gt;

static long vm(const char *key) {                        // một trường của /proc/self/status, đơn vị kB
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long v = -1; size_t n = strlen(key);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, key, n)) sscanf(line + n + 1, "%ld", &amp;v);
    fclose(f);
    return v;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    printf("page size: %ld bytes\\n", sysconf(_SC_PAGESIZE));
    long size0 = vm("VmSize"), rss0 = vm("VmRSS");
    size_t sz = 64UL &lt;&lt; 30;
    char *p = mmap(NULL, sz, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    if (p == MAP_FAILED) { perror("mmap"); return 1; }
    madvise(p, sz, MADV_NOHUGEPAGE);                     // trang 4 KB thường, không dùng trang lớn 2 MB
    printf("mmap 64 GB:   virtual size +%ld MB, resident in RAM +%ld kB\\n", (vm("VmSize") - size0) / 1024, vm("VmRSS") - rss0);
    p[0] = 1; p[sz / 2] = 2; p[sz - 1] = 3;              // chạm ba byte: đầu, giữa, cuối
    printf("touch 3 bytes: virtual size +%ld MB, resident in RAM +%ld kB\\n", (vm("VmSize") - size0) / 1024, vm("VmRSS") - rss0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ao-lon-hon-that.c -o ao-lon-hon-that &amp;&amp; ./ao-lon-hon-that<br>
page size: 4096 bytes<br>
mmap 64 GB: &nbsp;&nbsp;virtual size +65536 MB, resident in RAM +0 kB<br>
touch 3 bytes: virtual size +65536 MB, resident in RAM +12 kB</div>
<p>Kích thước ảo tăng 65.536 MB, nhưng bộ nhớ thường trú (ở trong RAM) tăng 0 kB — giữ chỗ không gian địa chỉ không tốn RAM. Chạm ba byte ở ba nơi xa nhau làm tiến trình dùng đúng 12 kB = <strong>ba trang 4 KB</strong>: bộ nhớ được cấp từng trang một, chỉ khi dùng tới (<strong>phân trang theo yêu cầu — demand paging</strong>). Bộ nhớ ảo cũng hợp với đa chương trình: trong lúc một tiến trình chờ trang của nó về từ đĩa, CPU chạy tiến trình khác.</p>
<p class="pitfall">⚠️ FE6 câu 18: "một giải pháp từ thập niên 1960 là chia chương trình thành những mảnh nhỏ gọi là ___" = <strong>overlays</strong> (đúng chữ của slide). FE7 câu 19 và FE9 câu 23 hỏi đúng câu này nhưng khoá ghi "pages" — khoá đó trái với slide; hãy chọn <strong>overlays</strong>. FE6 câu 17 / FE9 câu 26: bộ nhớ ảo "cho không gian địa chỉ lớn hơn bộ nhớ vật lý, nhờ kết hợp RAM và đĩa".</p>`],
      [12, 'Paging (1)',
        `<p class="y-chinh">🎯 Figure 3-8: the CPU sends <strong>virtual addresses</strong> to the <strong>MMU</strong> (memory management unit); the MMU sends <strong>physical addresses</strong> onto the bus to memory. Today the MMU is part of the CPU chip; logically it could be a separate chip, as it was years ago.</p>
<p>Every address a program generates — with an indexed load, a stack push, an instruction fetch — is a <strong>virtual address</strong>, and together they form the <strong>virtual address space</strong>. On a computer with no virtual memory the address goes straight onto the bus; with virtual memory it goes through the MMU, which maps it to a physical memory address. Disk and other devices on the bus see only physical addresses (that is why DMA controllers use physical memory addresses — FE6 question 34).</p>
<p>➕ We can watch the MMU's result for one real variable. With root privileges, <code>/proc/self/pagemap</code> tells which physical page frame holds each virtual page of the process:</p>
<pre><code class="language-c">// Translate a REAL virtual address to its physical address with /proc/self/pagemap (root: frame numbers are hidden from normal users)
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int counter = 42;                                        // a global variable: it lives in the data segment

int main(void) {
    long ps = sysconf(_SC_PAGESIZE);
    uintptr_t va = (uintptr_t)&amp;counter;
    printf("page size: %ld bytes\\n", ps);
    printf("virtual address  = %#lx\\n", (unsigned long)va);
    printf("  page number    = %#lx, offset = %#lx (%lu)\\n", (unsigned long)(va / ps), (unsigned long)(va % ps), (unsigned long)(va % ps));
    int fd = open("/proc/self/pagemap", O_RDONLY);       // one 8-byte entry per virtual page
    uint64_t e;
    pread(fd, &amp;e, sizeof e, (va / ps) * sizeof e);
    uint64_t present = e &gt;&gt; 63, pfn = e &amp; ((1ULL &lt;&lt; 55) - 1);   // bit 63 = present, bits 0-54 = page frame number
    uint64_t pa = pfn * ps + va % ps;
    printf("pagemap entry    : present = %lu, page frame number = %#lx\\n", (unsigned long)present, (unsigned long)pfn);
    printf("physical address = %#lx = frame * %ld + offset\\n", (unsigned long)pa, ps);
    printf("same offset: %s\\n", (pa % ps) == (va % ps) ? "yes" : "no");
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread dich-dia-chi.c -o dich-dia-chi &amp;&amp; ./dich-dia-chi<br>
page size: 4096 bytes<br>
virtual address &nbsp;= 0xaaaaaac10050<br>
&nbsp;&nbsp;page number &nbsp;&nbsp;&nbsp;= 0xaaaaaac10, offset = 0x50 (80)<br>
pagemap entry &nbsp;&nbsp;&nbsp;: present = 1, page frame number = 0x11e82b<br>
physical address = 0x11e82b050 = frame * 4096 + offset<br>
same offset: yes</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The variable <code>counter</code> has a virtual address around <code>0xaaaaaac10050</code>; the kernel's table says that page sits in physical frame <code>0x11e82b</code>, so the physical address is frame × 4096 + offset. The two addresses look nothing alike, yet the <strong>last 12 bits (<code>0x050</code>) are identical</strong>: the MMU replaces only the page number. (Normal users see frame number 0: since Linux 4.0 physical addresses are hidden, because they help attacks such as Rowhammer — the program needs <code>--privileged</code> in the container.)</p>
<p class="pitfall">⚠️ FE2 question 14 / FE6 question 14: the role of the MMU = <strong>translates virtual addresses into physical addresses</strong>. It does not decide which page to evict (that is the OS) and it is hardware, not "a data structure".</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Slide 12 as a running program: each memory access goes through the page table, and a page not in RAM causes a fault.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-program os-lab-t-vm-translate"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> virtual pages, physical frames and a page fault <a href="/os-lab?sim=vm&amp;preset=program&amp;lang=en&amp;tour=vm-translate" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Step the accesses and say for each one: page number, hit or fault, which frame.</li><li>Find the first page fault and what the OS has to do before the instruction can run again.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Hình 3-8: CPU gửi <strong>địa chỉ ảo (virtual address)</strong> tới <strong>MMU</strong> (memory management unit — bộ quản lý bộ nhớ); MMU gửi <strong>địa chỉ vật lý (physical address)</strong> lên bus tới bộ nhớ. Ngày nay MMU nằm ngay trên chip CPU; về logic nó có thể là chip riêng, như nhiều năm trước.</p>
<p>Mọi địa chỉ chương trình sinh ra — khi nạp có chỉ số, khi đẩy vào ngăn xếp, khi nạp lệnh — đều là <strong>địa chỉ ảo</strong>, và gộp lại thành <strong>không gian địa chỉ ảo</strong>. Trên máy không có bộ nhớ ảo, địa chỉ đi thẳng lên bus; có bộ nhớ ảo thì nó đi qua MMU để được ánh xạ thành địa chỉ bộ nhớ vật lý. Đĩa và các thiết bị khác trên bus chỉ thấy địa chỉ vật lý (vì thế bộ điều khiển DMA dùng địa chỉ bộ nhớ vật lý — FE6 câu 34).</p>
<p>➕ Ta xem được kết quả của MMU cho một biến thật. Với quyền root, <code>/proc/self/pagemap</code> cho biết khung trang vật lý nào đang chứa từng trang ảo của tiến trình:</p>
<pre><code class="language-c">// Dịch một địa chỉ ảo THẬT sang địa chỉ vật lý bằng /proc/self/pagemap (cần root: người thường không thấy số khung)
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int counter = 42;                                        // biến toàn cục: nằm trong đoạn dữ liệu

int main(void) {
    long ps = sysconf(_SC_PAGESIZE);
    uintptr_t va = (uintptr_t)&amp;counter;
    printf("page size: %ld bytes\\n", ps);
    printf("virtual address  = %#lx\\n", (unsigned long)va);
    printf("  page number    = %#lx, offset = %#lx (%lu)\\n", (unsigned long)(va / ps), (unsigned long)(va % ps), (unsigned long)(va % ps));
    int fd = open("/proc/self/pagemap", O_RDONLY);       // mỗi trang ảo một mục 8 byte
    uint64_t e;
    pread(fd, &amp;e, sizeof e, (va / ps) * sizeof e);
    uint64_t present = e &gt;&gt; 63, pfn = e &amp; ((1ULL &lt;&lt; 55) - 1);   // bit 63 = có mặt, bit 0-54 = số khung trang
    uint64_t pa = pfn * ps + va % ps;
    printf("pagemap entry    : present = %lu, page frame number = %#lx\\n", (unsigned long)present, (unsigned long)pfn);
    printf("physical address = %#lx = frame * %ld + offset\\n", (unsigned long)pa, ps);
    printf("same offset: %s\\n", (pa % ps) == (va % ps) ? "yes" : "no");
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread dich-dia-chi.c -o dich-dia-chi &amp;&amp; ./dich-dia-chi<br>
page size: 4096 bytes<br>
virtual address &nbsp;= 0xaaaaaac10050<br>
&nbsp;&nbsp;page number &nbsp;&nbsp;&nbsp;= 0xaaaaaac10, offset = 0x50 (80)<br>
pagemap entry &nbsp;&nbsp;&nbsp;: present = 1, page frame number = 0x11e82b<br>
physical address = 0x11e82b050 = frame * 4096 + offset<br>
same offset: yes</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Biến <code>counter</code> có địa chỉ ảo khoảng <code>0xaaaaaac10050</code>; bảng của nhân nói trang đó nằm ở khung vật lý <code>0x11e82b</code>, nên địa chỉ vật lý = khung × 4096 + độ dời. Hai địa chỉ trông chẳng giống nhau, vậy mà <strong>12 bit cuối (<code>0x050</code>) y hệt</strong>: MMU chỉ thay số hiệu trang. (Người dùng thường chỉ thấy số khung 0: từ Linux 4.0, địa chỉ vật lý bị giấu vì nó giúp các kiểu tấn công như Rowhammer — chương trình cần <code>--privileged</code> trong container.)</p>
<p class="pitfall">⚠️ FE2 câu 14 / FE6 câu 14: vai trò của MMU = <strong>dịch địa chỉ ảo thành địa chỉ vật lý</strong>. Nó không quyết định đuổi trang nào (đó là việc của HĐH) và nó là phần cứng, không phải "một cấu trúc dữ liệu".</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Slide 12 thành một chương trình đang chạy: mỗi lần truy cập bộ nhớ đi qua bảng trang, và trang không ở RAM gây lỗi trang.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-program os-lab-t-vm-translate"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> trang ảo, khung vật lý và lỗi trang <a href="/os-lab?sim=vm&amp;preset=program&amp;lang=vi&amp;tour=vm-translate" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Bấm từng lần truy cập và nói với mỗi lần: số trang, trúng hay lỗi, khung nào.</li><li>Tìm lỗi trang đầu tiên và việc HĐH phải làm trước khi lệnh chạy lại được.</li></ol></div>
</div>`],
      [13, 'Paging (2)',
        `<p class="y-chinh">🎯 Figure 3-9: a computer with 16-bit addresses (a 64-KB virtual address space) but only 32 KB of physical memory. The virtual space is divided into 16 <strong>pages</strong> of 4 KB, physical memory into 8 <strong>page frames</strong> of 4 KB; the <strong>page table</strong> says which frame holds each page — X means "not in memory". Every page starts at a multiple of 4096: "4K–8K" means 4096–8191.</p>
<p>Pages and page frames always have the <strong>same size</strong> (here 4 KB; real systems use 512 bytes to 1 GB, 4 KB being the classic). Transfers between RAM and disk are always whole pages. A 64-KB program can run on this 32-KB machine, but not all of it can be in memory at once — the rest stays on disk. The simulator replays the book's translations; the first one, <code>MOV REG,20500</code>:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5907fd52e4325b2a0f57dfc2f11c03aba95ff627.svg" alt="Virtual 20500 = page 5, offset 20 → frame 3 → 12308" loading="lazy" /><p class="chu-thich">🧮 Virtual 20500 = page 5, offset 20 → frame 3 → 12308</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TRANG = 4096;
const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-9 (X = null)</code></pre></details>
<p>The book's other examples, with the same table: <code>MOV REG,0</code> → page 0 → frame 2 → <strong>8192</strong>; <code>MOV REG,8192</code> → page 2 → frame 6 → <strong>24576</strong>. And address 32780 falls in page 8, which is marked X:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/abdcb24271b51488c1e06c98ae6e5c7d4b8f1a03.svg" alt="Virtual 32780 = page 8, which is absent: page fault" loading="lazy" /><p class="chu-thich">🧮 Virtual 32780 = page 8, which is absent: page fault</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TRANG = 4096;
const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-9 (X = null)</code></pre></details>
<p>A reference to an unmapped page makes the MMU trap to the OS — a <strong>page fault</strong>. The OS picks a little-used frame, writes its contents back to disk if needed, loads the referenced page into it, updates the table and restarts the trapped instruction. ⚠️ FE12 question 17: the physical units are called <strong>page frames</strong>; FE11 question 17: the fixed-length virtual unit is a <strong>page</strong>; FE4 question 15: the address memory sees is the <strong>physical address</strong>.</p>
<p class="meo">🧠 Recipe: page = address div page size, offset = address mod page size, physical = frame × page size + offset. Old lesson 3.3 has one more worked example (0x2A3F → 0x9A3F).</p>`,
        `<p class="y-chinh">🎯 Hình 3-9: một máy có địa chỉ 16 bit (không gian địa chỉ ảo 64 KB) nhưng chỉ có 32 KB bộ nhớ vật lý. Không gian ảo chia thành 16 <strong>trang (page)</strong> 4 KB, bộ nhớ vật lý thành 8 <strong>khung trang (page frame)</strong> 4 KB; <strong>bảng trang (page table)</strong> cho biết khung nào chứa trang nào — X nghĩa là "không ở bộ nhớ". Mỗi trang bắt đầu ở bội số của 4096: "4K–8K" nghĩa là 4096–8191.</p>
<p>Trang và khung trang luôn có <strong>cùng kích thước</strong> (ở đây 4 KB; hệ thống thật dùng từ 512 byte tới 1 GB, 4 KB là cỡ kinh điển). Việc chuyển giữa RAM và đĩa luôn theo nguyên trang. Một chương trình 64 KB chạy được trên máy 32 KB này, nhưng không thể nằm hết trong bộ nhớ cùng lúc — phần còn lại ở trên đĩa. Bộ mô phỏng chạy lại các phép dịch của sách; phép đầu tiên, <code>MOV REG,20500</code>:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c1913ca482ce9e64a56571a1ac6ddbdcb316e8f0.svg" alt="Ảo 20500 = trang 5, độ dời 20 → khung 3 → 12308" loading="lazy" /><p class="chu-thich">🧮 Ảo 20500 = trang 5, độ dời 20 → khung 3 → 12308</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TRANG = 4096;
const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-9 (X = null)</code></pre></details>
<p>Các ví dụ khác của sách, cùng bảng: <code>MOV REG,0</code> → trang 0 → khung 2 → <strong>8192</strong>; <code>MOV REG,8192</code> → trang 2 → khung 6 → <strong>24576</strong>. Còn địa chỉ 32780 rơi vào trang 8, đang đánh dấu X:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/05dc771d95823d2d14a6cba8a19c15e821ef464d.svg" alt="Ảo 32780 = trang 8 đang vắng mặt: lỗi trang" loading="lazy" /><p class="chu-thich">🧮 Ảo 32780 = trang 8 đang vắng mặt: lỗi trang</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TRANG = 4096;
const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-9 (X = null)</code></pre></details>
<p>Tham chiếu tới trang chưa được ánh xạ khiến MMU bẫy vào HĐH — một <strong>lỗi trang (page fault)</strong>. HĐH chọn một khung ít dùng, ghi nội dung của nó về đĩa nếu cần, nạp trang được tham chiếu vào khung đó, sửa bảng rồi cho lệnh bị bẫy chạy lại. ⚠️ FE12 câu 17: đơn vị vật lý gọi là <strong>page frames</strong>; FE11 câu 17: đơn vị ảo cố định là <strong>page</strong>; FE4 câu 15: địa chỉ mà bộ nhớ nhìn thấy là <strong>physical address</strong>.</p>
<p class="meo">🧠 Công thức: trang = địa chỉ div cỡ trang, độ dời = địa chỉ mod cỡ trang, vật lý = khung × cỡ trang + độ dời. Bài cũ 3.3 có thêm một ví dụ giải sẵn (0x2A3F → 0x9A3F).</p>`],
      [14, 'Paging (3)',
        `<p class="y-chinh">🎯 Figure 3-10: the internal operation of the MMU with 16 pages of 4 KB. The 16-bit virtual address 8196 is split into a <strong>4-bit page number</strong> (2) and a <strong>12-bit offset</strong> (4). The page number indexes the page table; entry 2 holds frame 110 (6) with its present bit 1; the 3-bit frame number is joined to the unchanged offset → physical address 24580.</p>
<p>Why 4 + 12? A page is 4096 = 2¹² bytes, so 12 bits are needed to name a byte inside a page; the remaining high bits name the page. This is why page sizes are always powers of two: the MMU never divides, it just <strong>splits the bit string</strong> and copies the low part. The simulator draws it bit by bit:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f656c900e6710095497310d16718f98cbfbf79c3.svg" alt="Inside the MMU: 0010|000000000100 → page 2 → frame 110 → 110|000000000100 = 24580" loading="lazy" /><p class="chu-thich">🧮 Inside the MMU: 0010|000000000100 → page 2 → frame 110 → 110|000000000100 = 24580</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-10 (same mapping as 3-9)</code></pre></details>
<p>The output is 15 bits (8 frames × 4 KB = 32 KB of physical memory) while the input is 16 bits (64 KB of virtual memory): virtual and physical address sizes are independent. If the present bit had been 0 (pages 6, 7, 8, 10, 12–15), the MMU would have trapped instead of producing an address.</p>
<p class="pitfall">⚠️ FE5 question 20 = FE16 question 24: 16-bit virtual address, 4-KB pages → offset 12 bits, page number 4 bits → a one-level page table has <strong>16</strong> entries. FE17 question 37 / FE18 question 11 / FE21 question 11: page size 2¹² words means the last 3 hex digits are the offset, so virtual 0x12345678 is in page <strong>0x12345</strong>, 0x123456 in page <strong>0x123</strong>, 0x1234567 in page <strong>0x1234</strong>.</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>The MMU of slide 14 does one thing first: split the virtual address into bits. Practise the split the way the FE asks it.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-split os-lab-t-addr-split-walk"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> split an address into page number and offset <a href="/os-lab?sim=addr-split&amp;preset=split&amp;lang=en&amp;tour=addr-split-walk" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Read how 0x12345678 splits 10/10/12 into 72 / 837 / 1656 on the coloured binary.</li><li>Type your own address and bit widths (try 4/12 bits as in Figure 3-10) and check each field.</li><li>Say why reading hex digits directly gives the wrong page number.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Hình 3-10: hoạt động bên trong MMU với 16 trang 4 KB. Địa chỉ ảo 16 bit 8196 được tách thành <strong>4 bit số trang</strong> (2) và <strong>12 bit độ dời (offset)</strong> (4). Số trang làm chỉ số vào bảng trang; mục 2 giữ khung 110 (6) với bit có mặt bằng 1; 3 bit số khung ghép với độ dời giữ nguyên → địa chỉ vật lý 24580.</p>
<p>Vì sao 4 + 12? Một trang là 4096 = 2¹² byte, nên cần 12 bit để gọi tên một byte trong trang; các bit cao còn lại gọi tên trang. Vì thế kích thước trang luôn là luỹ thừa của 2: MMU không bao giờ chia, nó chỉ <strong>cắt chuỗi bit</strong> và chép phần thấp. Bộ mô phỏng vẽ từng bit:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/90a5c9d709ff0487d19cb56e76aba23675c9eea8.svg" alt="Bên trong MMU: 0010|000000000100 → trang 2 → khung 110 → 110|000000000100 = 24580" loading="lazy" /><p class="chu-thich">🧮 Bên trong MMU: 0010|000000000100 → trang 2 → khung 110 → 110|000000000100 = 24580</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-10 (same mapping as 3-9)</code></pre></details>
<p>Đầu ra 15 bit (8 khung × 4 KB = 32 KB bộ nhớ vật lý) trong khi đầu vào 16 bit (64 KB bộ nhớ ảo): cỡ địa chỉ ảo và vật lý độc lập với nhau. Nếu bit có mặt bằng 0 (trang 6, 7, 8, 10, 12–15), MMU sẽ bẫy thay vì sinh ra địa chỉ.</p>
<p class="pitfall">⚠️ FE5 câu 20 = FE16 câu 24: địa chỉ ảo 16 bit, trang 4 KB → độ dời 12 bit, số trang 4 bit → bảng trang một mức có <strong>16</strong> mục. FE17 câu 37 / FE18 câu 11 / FE21 câu 11: cỡ trang 2¹² từ nghĩa là 3 chữ số hex cuối là độ dời, nên địa chỉ ảo 0x12345678 thuộc trang <strong>0x12345</strong>, 0x123456 thuộc trang <strong>0x123</strong>, 0x1234567 thuộc trang <strong>0x1234</strong>.</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>MMU của slide 14 làm trước một việc: tách địa chỉ ảo thành các nhóm bit. Luyện phép tách đúng kiểu đề FE hỏi.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-split os-lab-t-addr-split-walk"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> tách địa chỉ thành số trang và độ dời <a href="/os-lab?sim=addr-split&amp;preset=split&amp;lang=vi&amp;tour=addr-split-walk" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Đọc cách 0x12345678 tách 10/10/12 thành 72 / 837 / 1656 trên dãy nhị phân tô màu.</li><li>Gõ địa chỉ và số bit của bạn (thử 4/12 bit như Hình 3-10) rồi kiểm từng trường.</li><li>Nói vì sao đọc thẳng chữ số hex cho ra số trang sai.</li></ol></div>
</div>`],
      [15, 'Structure of a Page Table Entry',
        `<p class="y-chinh">🎯 Figure 3-11: a typical <strong>page table entry</strong> (PTE): the <strong>page frame number</strong> (the most important field), the <strong>present/absent</strong> bit, <strong>protection</strong> bits (what kinds of access are allowed), the <strong>modified</strong> (dirty) bit, the <strong>referenced</strong> bit, and <strong>caching disabled</strong>.</p>
<p>What each bit is for: <strong>present/absent</strong> = 1 means the entry is valid and usable; 0 → page fault. <strong>Protection</strong>: 1 bit (read/write vs read-only) or 3 bits (read, write, execute). <strong>Modified (M)</strong>: set by the hardware on a write; when the page is evicted, a dirty page must be written back to disk, a clean one can simply be dropped. <strong>Referenced (R)</strong>: set on every read or write — the page replacement algorithms of slides 20–28 live on it. <strong>Caching disabled</strong>: for pages that map device registers, so the CPU reads the device, not a stale cached copy (Chapter 5). The <strong>disk address</strong> of a page that is not in memory is not in the PTE — the OS keeps it in its own tables.</p>
<p>➕ Three of these bits, observed from a C program (present bits from <code>pagemap</code>, the dirty state from <code>smaps</code>, protection with <code>mprotect</code>):</p>
<pre><code class="language-c">// Three page-table bits seen from user space: Present (pagemap), Modified (dirty kB in smaps), Protection (a write to a read-only page)
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;setjmp.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;
#define N 8

static char *p;
static void present_bits(const char *when) {
    int fd = open("/proc/self/pagemap", O_RDONLY);
    printf("%-30s present bits of the 8 pages: ", when);
    for (int i = 0; i &lt; N; i++) {
        uint64_t e;
        pread(fd, &amp;e, 8, ((uintptr_t)(p + i * 4096) / 4096) * 8);
        putchar((e &gt;&gt; 63) ? '1' : '0');                  // bit 63 of the pagemap entry
    }
    putchar('\\n');
    close(fd);
}
static long dirty_kb(void) {                             // Shared_Dirty + Private_Dirty of our mapping in /proc/self/smaps
    FILE *f = fopen("/proc/self/smaps", "r");
    char line[512]; int in = 0; long d = 0, x;
    unsigned long lo, hi;
    while (fgets(line, sizeof line, f)) {
        if (sscanf(line, "%lx-%lx ", &amp;lo, &amp;hi) == 2) in = (lo == (unsigned long)(uintptr_t)p);   // a new mapping starts
        if (in &amp;&amp; (sscanf(line, "Shared_Dirty: %ld", &amp;x) == 1 || sscanf(line, "Private_Dirty: %ld", &amp;x) == 1)) d += x;
    }
    fclose(f);
    return d;
}
static sigjmp_buf back;
static void on_segv(int sig) { (void)sig; siglongjmp(back, 1); }

int main(void) {
    // 1. Present/absent: a fresh anonymous mapping has NO frames until it is touched (demand paging)
    p = mmap(NULL, N * 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    present_bits("fresh mmap of 8 pages:");
    p[1 * 4096] = 1; p[3 * 4096] = 1; p[4 * 4096] = 1;
    present_bits("after writing pages 1, 3, 4:");
    munmap(p, N * 4096);

    // 2. Modified (dirty): a page of a FILE mapping becomes dirty when written, clean again after it is saved
    int fd = open("/tmp/data.bin", O_RDWR | O_CREAT | O_TRUNC, 0644);
    ftruncate(fd, N * 4096);
    p = mmap(NULL, N * 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    volatile char c = 0;
    for (int i = 0; i &lt; N; i++) c += p[i * 4096];
    printf("read all 8 pages:              dirty = %ld kB\\n", dirty_kb());
    p[2 * 4096] = 'x'; p[6 * 4096] = 'y';
    printf("write pages 2 and 6:           dirty = %ld kB\\n", dirty_kb());
    msync(p, N * 4096, MS_SYNC);
    printf("msync (written back to file):  dirty = %ld kB\\n", dirty_kb());

    // 3. Protection: make page 5 read-only, then try to write it
    mprotect(p + 5 * 4096, 4096, PROT_READ);
    signal(SIGSEGV, on_segv);
    if (sigsetjmp(back, 1) == 0) { p[5 * 4096] = 'z'; puts("write to read-only page: allowed?!"); }
    else puts("write to read-only page 5:    SIGSEGV (protection fault)");
    (void)c;
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bit-co.c -o bit-co &amp;&amp; ./bit-co<br>
fresh mmap of 8 pages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;present bits of the 8 pages: 00000000<br>
after writing pages 1, 3, 4: &nbsp;&nbsp;present bits of the 8 pages: 01011000<br>
read all 8 pages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dirty = 0 kB<br>
write pages 2 and 6: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dirty = 8 kB<br>
msync (written back to file): &nbsp;dirty = 0 kB<br>
write to read-only page 5: &nbsp;&nbsp;&nbsp;SIGSEGV (protection fault)</div>
<p>A fresh 8-page mapping has <strong>no</strong> present page: frames are attached only when pages are touched (pages 1, 3, 4 → <code>01011000</code>). Reading a file mapping leaves it clean; writing pages 2 and 6 makes 8 kB dirty (M = 1); <code>msync</code> writes them back and they are clean again. A write to a page made read-only is stopped by the protection bits (SIGSEGV). ➕ Real x86-64 PTEs add an <strong>NX</strong> (no-execute) bit and a user/supervisor bit; ARM64 has an access flag (its R bit), access-permission bits and execute-never bits.</p>
<p class="pitfall">⚠️ FE5 question 49 (= FE7 q15, FE8 q14, FE11 q13, FE13 q13, FE14 q16): the bit telling which kinds of access are permitted = <strong>protection</strong>. "Which bit indicates locked pages?" (FE20 q20, FE21 q40, FE25 q24, FE28 q12) has four DIFFERENT keys in the bank (Referenced, Present/absent, Caching disabled, Present/absent): Figure 3-11 has no lock bit at all — locking (pinning) pages is a separate mechanism (§3.6.5). Don't trust that question's key.</p>`,
        `<p class="y-chinh">🎯 Hình 3-11: một <strong>mục bảng trang (page table entry — PTE)</strong> điển hình: <strong>số khung trang</strong> (trường quan trọng nhất), bit <strong>có mặt/vắng (present/absent)</strong>, các bit <strong>bảo vệ (protection)</strong> (cho phép kiểu truy cập nào), bit <strong>đã sửa (modified, dirty)</strong>, bit <strong>đã tham chiếu (referenced)</strong>, và <strong>cấm cache (caching disabled)</strong>.</p>
<p>Mỗi bit để làm gì: <strong>có mặt/vắng</strong> = 1 nghĩa là mục hợp lệ, dùng được; 0 → lỗi trang. <strong>Bảo vệ</strong>: 1 bit (đọc/ghi hay chỉ đọc) hoặc 3 bit (đọc, ghi, thực thi). <strong>Đã sửa (M)</strong>: phần cứng bật khi có ghi; khi đuổi trang, trang bẩn (dirty) phải ghi lại xuống đĩa, trang sạch thì cứ bỏ đi. <strong>Đã tham chiếu (R)</strong>: bật ở mỗi lần đọc hay ghi — các thuật toán thay trang của slide 20–28 sống nhờ nó. <strong>Cấm cache</strong>: cho các trang ánh xạ thanh ghi thiết bị, để CPU đọc thẳng thiết bị chứ không đọc bản sao cũ trong cache (Chương 5). <strong>Địa chỉ trên đĩa</strong> của một trang không ở bộ nhớ không nằm trong PTE — HĐH giữ nó trong bảng riêng.</p>
<p>➕ Ba trong số các bit này, quan sát từ một chương trình C (bit có mặt từ <code>pagemap</code>, trạng thái bẩn từ <code>smaps</code>, bảo vệ bằng <code>mprotect</code>):</p>
<pre><code class="language-c">// Ba bit của mục bảng trang nhìn từ không gian người dùng: Có mặt (pagemap), Đã sửa (kB bẩn trong smaps), Bảo vệ (ghi vào trang chỉ đọc)
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;setjmp.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;
#define N 8

static char *p;
static void present_bits(const char *when) {
    int fd = open("/proc/self/pagemap", O_RDONLY);
    printf("%-30s present bits of the 8 pages: ", when);
    for (int i = 0; i &lt; N; i++) {
        uint64_t e;
        pread(fd, &amp;e, 8, ((uintptr_t)(p + i * 4096) / 4096) * 8);
        putchar((e &gt;&gt; 63) ? '1' : '0');                  // bit 63 của mục pagemap
    }
    putchar('\\n');
    close(fd);
}
static long dirty_kb(void) {                             // Shared_Dirty + Private_Dirty của vùng ánh xạ trong /proc/self/smaps
    FILE *f = fopen("/proc/self/smaps", "r");
    char line[512]; int in = 0; long d = 0, x;
    unsigned long lo, hi;
    while (fgets(line, sizeof line, f)) {
        if (sscanf(line, "%lx-%lx ", &amp;lo, &amp;hi) == 2) in = (lo == (unsigned long)(uintptr_t)p);   // bắt đầu một vùng mới
        if (in &amp;&amp; (sscanf(line, "Shared_Dirty: %ld", &amp;x) == 1 || sscanf(line, "Private_Dirty: %ld", &amp;x) == 1)) d += x;
    }
    fclose(f);
    return d;
}
static sigjmp_buf back;
static void on_segv(int sig) { (void)sig; siglongjmp(back, 1); }

int main(void) {
    // 1. Có mặt/vắng: vùng mới ánh xạ CHƯA có khung nào cho tới khi bị chạm (phân trang theo yêu cầu)
    p = mmap(NULL, N * 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    present_bits("fresh mmap of 8 pages:");
    p[1 * 4096] = 1; p[3 * 4096] = 1; p[4 * 4096] = 1;
    present_bits("after writing pages 1, 3, 4:");
    munmap(p, N * 4096);

    // 2. Đã sửa (dirty): trang của vùng ánh xạ TỆP thành bẩn khi bị ghi, sạch lại khi đã lưu
    int fd = open("/tmp/data.bin", O_RDWR | O_CREAT | O_TRUNC, 0644);
    ftruncate(fd, N * 4096);
    p = mmap(NULL, N * 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    volatile char c = 0;
    for (int i = 0; i &lt; N; i++) c += p[i * 4096];
    printf("read all 8 pages:              dirty = %ld kB\\n", dirty_kb());
    p[2 * 4096] = 'x'; p[6 * 4096] = 'y';
    printf("write pages 2 and 6:           dirty = %ld kB\\n", dirty_kb());
    msync(p, N * 4096, MS_SYNC);
    printf("msync (written back to file):  dirty = %ld kB\\n", dirty_kb());

    // 3. Bảo vệ: cho trang 5 chỉ đọc, rồi thử ghi vào nó
    mprotect(p + 5 * 4096, 4096, PROT_READ);
    signal(SIGSEGV, on_segv);
    if (sigsetjmp(back, 1) == 0) { p[5 * 4096] = 'z'; puts("write to read-only page: allowed?!"); }
    else puts("write to read-only page 5:    SIGSEGV (protection fault)");
    (void)c;
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bit-co.c -o bit-co &amp;&amp; ./bit-co<br>
fresh mmap of 8 pages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;present bits of the 8 pages: 00000000<br>
after writing pages 1, 3, 4: &nbsp;&nbsp;present bits of the 8 pages: 01011000<br>
read all 8 pages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dirty = 0 kB<br>
write pages 2 and 6: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dirty = 8 kB<br>
msync (written back to file): &nbsp;dirty = 0 kB<br>
write to read-only page 5: &nbsp;&nbsp;&nbsp;SIGSEGV (protection fault)</div>
<p>Một vùng 8 trang vừa ánh xạ <strong>chưa có</strong> trang nào có mặt: khung chỉ được gắn khi trang bị chạm (trang 1, 3, 4 → <code>01011000</code>). Đọc một vùng ánh xạ tệp thì nó vẫn sạch; ghi trang 2 và 6 làm 8 kB thành bẩn (M = 1); <code>msync</code> ghi chúng về tệp và chúng sạch trở lại. Ghi vào trang đã đặt chỉ đọc bị các bit bảo vệ chặn (SIGSEGV). ➕ PTE thật của x86-64 có thêm bit <strong>NX</strong> (cấm thực thi) và bit người dùng/giám sát; ARM64 có cờ truy cập (access flag — chính là bit R của nó), các bit quyền truy cập và các bit cấm thực thi.</p>
<p class="pitfall">⚠️ FE5 câu 49 (= FE7 c15, FE8 c14, FE11 c13, FE13 c13, FE14 c16): bit cho biết kiểu truy cập nào được phép = <strong>protection</strong>. Câu "bit nào chỉ trang bị khoá (locked)?" (FE20 c20, FE21 c40, FE25 c24, FE28 c12) có tới bốn khoá KHÁC NHAU trong ngân hàng (Referenced, Present/absent, Caching disabled, Present/absent): Hình 3-11 không hề có bit khoá — khoá (ghim) trang là một cơ chế riêng (§3.6.5). Đừng tin khoá của câu đó.</p>`],
      [16, 'Speeding Up Paging',
        `<p class="y-chinh">🎯 Two major issues of any paging system: (1) the mapping from virtual to physical address <strong>must be fast</strong>; (2) if the virtual address space is large, <strong>the page table will be large</strong>.</p>
<p>Issue 1: translation happens on <strong>every</strong> memory reference — every instruction fetch and most loads and stores. If an instruction takes 1 ns, a page-table lookup must take well under 1 ns, or paging becomes the bottleneck. Issue 2: with 32-bit addresses and 4-KB pages there are 2²⁰ = one million pages, and every process needs its own table; with 48-bit addresses it is 2³⁶ entries. The two simplest designs are both bad: keep the whole table in fast <strong>hardware registers</strong> (no memory reference during translation, but every context switch reloads the whole table — FE23 question 12 calls this the "simplest design"); or keep it <strong>entirely in memory</strong> with one register pointing to it (cheap context switch — just reload that register, CR3 on x86, TTBR0 on ARM64 — but one or more extra memory references per access).</p>
<p>➕ How big is "large"? The simulator counts the memory needed for a small process (20 pages used):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8c7de1b760c4b5e9d2fb7aba8d7c7ba9a4f0a4af.svg" alt="One-level vs multilevel page table for a process using 20 pages" loading="lazy" /><p class="chu-thich">🧮 One-level vs multilevel page table for a process using 20 pages</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VD = {
  32: { dc: 0x00403004, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  fe: { dc: 0x00403008, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  x64: { dc: 0xaaaad4d70754, rong: [9, 9, 9, 9, 12], ten: ['L0 (PGD)', 'L1 (PUD)', 'L2 (PMD)', 'L3 (PTE)', 'offset'] },
};
/** Số bảng cần ở mỗi mức cho tập trang ảo đã dùng: mức i cần một bảng cho mỗi giá trị khác nhau của các trường phía trên nó. */
function soBang(trangDung, rong) {
  const muc = rong.length - 1;               // số mức bảng (trường cuối là offset)
  const ra = [];
  for (let i = 0; i &lt; muc; i++) {
    const s = new Set(trangDung.map((dc) =&gt; tachBit(dc, rong).slice(0, i).join('.')));
    ra.push(s.size);
  }
  return ra;
}
const VUNG32 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0xFFFFF000 - 4096 * i));
const VUNG48 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0x7FFFFFFFF000 - 4096 * i));</code></pre></details>
<p>A one-level table would need 4 MB per process on a 32-bit machine and an absurd 512 GB on a 48-bit one. The rest of the section are the fixes: the <strong>TLB</strong> for issue 1 (slide 17), <strong>multilevel</strong> (slide 18) and <strong>inverted</strong> (slide 19) tables for issue 2.</p>
<p class="pitfall">⚠️ FE20 question 5 = FE28 question 23: 32-bit address, 16-KB pages, 4-byte entries → 2³² / 2¹⁴ = 2¹⁸ entries × 4 B = <strong>1 MB</strong>. FE19 question 1: pages that are too small give <strong>very long page tables</strong>; FE3 question 13: bigger pages → <strong>more</strong> internal fragmentation.</p>`,
        `<p class="y-chinh">🎯 Hai vấn đề lớn của mọi hệ thống phân trang: (1) ánh xạ từ địa chỉ ảo sang vật lý <strong>phải nhanh</strong>; (2) nếu không gian địa chỉ ảo lớn thì <strong>bảng trang sẽ lớn</strong>.</p>
<p>Vấn đề 1: phép dịch diễn ra ở <strong>mọi</strong> lần truy cập bộ nhớ — mọi lần nạp lệnh và phần lớn lệnh nạp/ghi. Nếu một lệnh tốn 1 ns thì tra bảng trang phải dưới 1 ns nhiều, không thì phân trang thành nút thắt. Vấn đề 2: địa chỉ 32 bit với trang 4 KB có 2²⁰ = một triệu trang, và mỗi tiến trình cần một bảng riêng; địa chỉ 48 bit là 2³⁶ mục. Hai thiết kế đơn giản nhất đều dở: giữ cả bảng trong <strong>thanh ghi phần cứng</strong> nhanh (dịch không cần truy cập bộ nhớ, nhưng mỗi lần chuyển ngữ cảnh phải nạp lại cả bảng — FE23 câu 12 gọi đây là "thiết kế đơn giản nhất"); hoặc giữ nó <strong>hoàn toàn trong bộ nhớ</strong> với một thanh ghi trỏ tới (chuyển ngữ cảnh rẻ — chỉ nạp lại thanh ghi đó, CR3 trên x86, TTBR0 trên ARM64 — nhưng mỗi lần truy cập tốn thêm một hay nhiều lần đọc bộ nhớ).</p>
<p>➕ "Lớn" là bao nhiêu? Bộ mô phỏng đếm bộ nhớ cần cho một tiến trình nhỏ (dùng 20 trang):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6f2cf997e6be61c5cac360602ff0bd20dcebf67a.svg" alt="Bảng trang một mức vs nhiều mức cho tiến trình dùng 20 trang" loading="lazy" /><p class="chu-thich">🧮 Bảng trang một mức vs nhiều mức cho tiến trình dùng 20 trang</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VD = {
  32: { dc: 0x00403004, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  fe: { dc: 0x00403008, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  x64: { dc: 0xaaaad4d70754, rong: [9, 9, 9, 9, 12], ten: ['L0 (PGD)', 'L1 (PUD)', 'L2 (PMD)', 'L3 (PTE)', 'offset'] },
};
/** Số bảng cần ở mỗi mức cho tập trang ảo đã dùng: mức i cần một bảng cho mỗi giá trị khác nhau của các trường phía trên nó. */
function soBang(trangDung, rong) {
  const muc = rong.length - 1;               // số mức bảng (trường cuối là offset)
  const ra = [];
  for (let i = 0; i &lt; muc; i++) {
    const s = new Set(trangDung.map((dc) =&gt; tachBit(dc, rong).slice(0, i).join('.')));
    ra.push(s.size);
  }
  return ra;
}
const VUNG32 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0xFFFFF000 - 4096 * i));
const VUNG48 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0x7FFFFFFFF000 - 4096 * i));</code></pre></details>
<p>Bảng một mức cần 4 MB mỗi tiến trình trên máy 32 bit và tới 512 GB vô lý trên máy 48 bit. Phần còn lại của mục là các cách chữa: <strong>TLB</strong> cho vấn đề 1 (slide 17), bảng <strong>nhiều mức</strong> (slide 18) và <strong>nghịch đảo</strong> (slide 19) cho vấn đề 2.</p>
<p class="pitfall">⚠️ FE20 câu 5 = FE28 câu 23: địa chỉ 32 bit, trang 16 KB, mục 4 byte → 2³² / 2¹⁴ = 2¹⁸ mục × 4 B = <strong>1 MB</strong>. FE19 câu 1: trang quá nhỏ sinh ra <strong>bảng trang rất dài</strong>; FE3 câu 13: trang lớn hơn → phân mảnh trong <strong>nhiều hơn</strong>.</p>`],
      [17, 'Translation Lookaside Buffers',
        `<p class="y-chinh">🎯 Figure 3-12: a <strong>TLB</strong> (translation lookaside buffer, also called associative memory) — a small hardware table inside the MMU caching recent translations: valid bit, virtual page, modified bit, protection, page frame. The example program loops in code pages 19–21, uses data pages 129, 130, 140, and stack pages 860–861.</p>
<p>Most programs make a large number of references to a small number of pages, so a few dozen entries catch almost all of them. On a reference, the MMU compares the virtual page number with <strong>all entries in parallel</strong>: a hit gives the frame without touching the page table (a protection violation still traps); a miss means walking the page table, then evicting a TLB entry and loading the new one. The simulator runs a 4-entry TLB (LRU replacement) over the page table of Figure 3-9:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a50a86aab624e580ae949febdeb844ae85826000.svg" alt="Eleven references through a 4-entry TLB: hit, miss, page fault" loading="lazy" /><p class="chu-thich">🧮 Eleven references through a 4-entry TLB: hit, miss, page fault</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];
const VIDU = [8196, 8200, 20500, 4100, 8204, 32780, 20504, 45060, 4104, 12300, 8208];
const T_TLB = 2, T_MEM = 100;
const eat = (h) =&gt; h * (T_TLB + T_MEM) + (1 - h) * (T_TLB + 2 * T_MEM);
/** 64 trang đều có mặt (khung = trang) cho các kiểu truy cập dài. */
const BANG64 = Array.from({ length: 64 }, (_, i) =&gt; i);
const quet = Array.from({ length: 3072 }, (_, i) =&gt; 4 * i);                 // int a[3072]: 12 KB, 4 bytes each
let x = 12345;
const nhay = Array.from({ length: 3072 }, () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return (Math.floor(x / 65536) % 64) * 4096 + (Math.floor(x / 256) % 1024) * 4; });</code></pre></details>
<p>Hit ratio decides the cost. Using the effective-access-time formula of old lesson 3.3 (TLB 2 ns, memory 100 ns):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2038f899177494ad7e027ce763a33df8a374af36.svg" alt="Locality decides the hit ratio — sequential scan 99.9%, random jumps about 6%" loading="lazy" /><p class="chu-thich">🧮 Locality decides the hit ratio — sequential scan 99.9%, random jumps about 6%</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];
const VIDU = [8196, 8200, 20500, 4100, 8204, 32780, 20504, 45060, 4104, 12300, 8208];
const T_TLB = 2, T_MEM = 100;
const eat = (h) =&gt; h * (T_TLB + T_MEM) + (1 - h) * (T_TLB + 2 * T_MEM);
/** 64 trang đều có mặt (khung = trang) cho các kiểu truy cập dài. */
const BANG64 = Array.from({ length: 64 }, (_, i) =&gt; i);
const quet = Array.from({ length: 3072 }, (_, i) =&gt; 4 * i);                 // int a[3072]: 12 KB, 4 bytes each
let x = 12345;
const nhay = Array.from({ length: 3072 }, () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return (Math.floor(x / 65536) % 64) * 4096 + (Math.floor(x / 256) % 1024) * 4; });</code></pre></details>
<p>➕ Measured for real: the same 512-MB pointer chase with ordinary 4-KB pages (131,072 pages, far more than any TLB holds) and with 2-MB <strong>huge pages</strong> (256 pages, which fit):</p>
<pre><code class="language-c">// TLB reach: the same 512 MB pointer chase with 4 KB pages and with 2 MB (huge) pages
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;sys/mman.h&gt;
#define SZ (512UL &lt;&lt; 20)
#define PG 4096UL

static double chase(int huge, size_t *huge_kb) {
    char *p = mmap(NULL, SZ, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(p, SZ, huge ? MADV_HUGEPAGE : MADV_NOHUGEPAGE);   // ask for 2 MB pages, or forbid them
    memset(p, 0, SZ);
    size_t n = SZ / PG, *perm = malloc(n * sizeof *perm);
    for (size_t i = 0; i &lt; n; i++) perm[i] = i;
    srand(7);
    for (size_t i = n - 1; i &gt; 0; i--) { size_t j = (size_t)rand() % i, t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (size_t i = 0; i &lt; n; i++)                        // one pointer in every 4 KB page, to a random other page
        *(char **)(p + i * PG + (i % 64) * 64) = p + perm[i] * PG + (perm[i] % 64) * 64;
    char *q = p;
    size_t steps = 10000000;
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (size_t s = 0; s &lt; steps; s++) q = *(char **)q;  // every load needs a NEW translation
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    FILE *f = fopen("/proc/self/smaps_rollup", "r");
    char line[256]; *huge_kb = 0;
    while (fgets(line, sizeof line, f)) sscanf(line, "AnonHugePages: %zu", huge_kb);
    fclose(f);
    munmap(p, SZ); free(perm);
    if (q == NULL) puts("");
    return ((b.tv_sec - a.tv_sec) * 1e9 + (b.tv_nsec - a.tv_nsec)) / steps;
}

int main(void) {
    size_t h;
    double small = chase(0, &amp;h);
    printf("4 KB pages: %6.1f ns per load  (131072 pages to translate, huge pages used: %zu kB)\\n", small, h);
    double big = chase(1, &amp;h);
    printf("2 MB pages: %6.1f ns per load  (256 pages to translate,    huge pages used: %zu kB)\\n", big, h);
    printf("the 4 KB run is %.1fx slower: the difference is mostly page-table walks after TLB misses\\n", small / big);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -O2 tlb-trang-lon.c -o tlb-trang-lon &amp;&amp; ./tlb-trang-lon<br>
4 KB pages: &nbsp;210.6 ns per load &nbsp;(131072 pages to translate, huge pages used: 0 kB)<br>
2 MB pages: &nbsp;150.3 ns per load &nbsp;(256 pages to translate, &nbsp;&nbsp;&nbsp;huge pages used: 524288 kB)<br>
the 4 KB run is 1.4x slower: the difference is mostly page-table walks after TLB misses</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Same data, same cache misses — only the number of translations changed, and every load got tens of nanoseconds faster. That is why PostgreSQL (<code>huge_pages</code>), the JVM (<code>-XX:+UseLargePages</code>) and Linux's transparent huge pages exist. ➕ Book §3.3.3 vocabulary: a <strong>soft miss</strong> (page in RAM, only the TLB lacks it) vs a <strong>hard miss</strong> (page must come from disk); some CPUs (MIPS, old SPARC) leave TLB misses to software. Modern TLBs tag entries with an address-space ID (ASID on ARM, PCID on x86) so a context switch need not flush them.</p>
<p class="pitfall">⚠️ FE5 question 17: the percentage of times a page number is found in the TLB = <strong>hit ratio</strong>. FE17 question 26: the TLB does NOT remove the need for a page table in memory; FE19 question 9: a TLB miss does NOT imply a disk operation (only a page-table walk, unless the page is absent).</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Why the TLB matters, in numbers: the effective access time for a given hit rate, memory time and number of table levels.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-tlb os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> effective access time with a TLB <a href="/os-lab?sim=addr-split&amp;preset=tlb&amp;lang=en&amp;tour=addr-split-size" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Drag the hit rate from 98 % down to 80 % and watch EAT grow.</li><li>Change the number of table levels from 1 to 4: a miss now costs one access per level.</li><li>Compare the TLB reach with 4 KiB pages and with 2 MiB pages.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Hình 3-12: một <strong>TLB</strong> (translation lookaside buffer — bộ đệm tra cứu dịch địa chỉ, còn gọi là bộ nhớ kết hợp) — một bảng phần cứng nhỏ trong MMU lưu các phép dịch gần đây: bit hợp lệ, trang ảo, bit đã sửa, bảo vệ, khung trang. Chương trình ví dụ chạy vòng lặp trong các trang mã 19–21, dùng trang dữ liệu 129, 130, 140 và trang ngăn xếp 860–861.</p>
<p>Phần lớn chương trình tham chiếu rất nhiều lần vào một số ít trang, nên vài chục mục đã bắt được gần hết. Mỗi lần tham chiếu, MMU so số trang ảo với <strong>mọi mục cùng lúc (song song)</strong>: trúng (hit) thì có khung ngay, không đụng bảng trang (vi phạm bảo vệ vẫn bị bẫy); trượt (miss) thì phải đi tra bảng trang, rồi đuổi một mục TLB và nạp mục mới. Bộ mô phỏng chạy một TLB 4 mục (thay LRU) trên bảng trang của Hình 3-9:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/aeaaa967aff08f9b09ae5af8e7237ce038bfd095.svg" alt="Mười một tham chiếu qua TLB 4 mục: trúng, trượt, lỗi trang" loading="lazy" /><p class="chu-thich">🧮 Mười một tham chiếu qua TLB 4 mục: trúng, trượt, lỗi trang</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];
const VIDU = [8196, 8200, 20500, 4100, 8204, 32780, 20504, 45060, 4104, 12300, 8208];
const T_TLB = 2, T_MEM = 100;
const eat = (h) =&gt; h * (T_TLB + T_MEM) + (1 - h) * (T_TLB + 2 * T_MEM);
/** 64 trang đều có mặt (khung = trang) cho các kiểu truy cập dài. */
const BANG64 = Array.from({ length: 64 }, (_, i) =&gt; i);
const quet = Array.from({ length: 3072 }, (_, i) =&gt; 4 * i);                 // int a[3072]: 12 KB, 4 bytes each
let x = 12345;
const nhay = Array.from({ length: 3072 }, () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return (Math.floor(x / 65536) % 64) * 4096 + (Math.floor(x / 256) % 1024) * 4; });</code></pre></details>
<p>Tỉ lệ trúng quyết định chi phí. Dùng công thức thời gian truy cập hiệu dụng của bài cũ 3.3 (TLB 2 ns, bộ nhớ 100 ns):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5de0da2f9d041bb6a25a53abe474b1d1bbc62915.svg" alt="Tính cục bộ quyết định tỉ lệ trúng — quét tuần tự 99,9%, nhảy ngẫu nhiên khoảng 6%" loading="lazy" /><p class="chu-thich">🧮 Tính cục bộ quyết định tỉ lệ trúng — quét tuần tự 99,9%, nhảy ngẫu nhiên khoảng 6%</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];
const VIDU = [8196, 8200, 20500, 4100, 8204, 32780, 20504, 45060, 4104, 12300, 8208];
const T_TLB = 2, T_MEM = 100;
const eat = (h) =&gt; h * (T_TLB + T_MEM) + (1 - h) * (T_TLB + 2 * T_MEM);
/** 64 trang đều có mặt (khung = trang) cho các kiểu truy cập dài. */
const BANG64 = Array.from({ length: 64 }, (_, i) =&gt; i);
const quet = Array.from({ length: 3072 }, (_, i) =&gt; 4 * i);                 // int a[3072]: 12 KB, 4 bytes each
let x = 12345;
const nhay = Array.from({ length: 3072 }, () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return (Math.floor(x / 65536) % 64) * 4096 + (Math.floor(x / 256) % 1024) * 4; });</code></pre></details>
<p>➕ Đo thật: cùng một lần đi chuỗi con trỏ qua 512 MB với trang 4 KB thường (131.072 trang, nhiều hơn xa sức chứa của mọi TLB) và với <strong>trang lớn (huge page)</strong> 2 MB (256 trang, vừa TLB):</p>
<pre><code class="language-c">// Tầm phủ của TLB: cùng một lần đi chuỗi con trỏ qua 512 MB với trang 4 KB và trang lớn 2 MB
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;sys/mman.h&gt;
#define SZ (512UL &lt;&lt; 20)
#define PG 4096UL

static double chase(int huge, size_t *huge_kb) {
    char *p = mmap(NULL, SZ, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(p, SZ, huge ? MADV_HUGEPAGE : MADV_NOHUGEPAGE);   // xin trang 2 MB, hoặc cấm chúng
    memset(p, 0, SZ);
    size_t n = SZ / PG, *perm = malloc(n * sizeof *perm);
    for (size_t i = 0; i &lt; n; i++) perm[i] = i;
    srand(7);
    for (size_t i = n - 1; i &gt; 0; i--) { size_t j = (size_t)rand() % i, t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (size_t i = 0; i &lt; n; i++)                        // mỗi trang 4 KB một con trỏ, trỏ tới một trang ngẫu nhiên khác
        *(char **)(p + i * PG + (i % 64) * 64) = p + perm[i] * PG + (perm[i] % 64) * 64;
    char *q = p;
    size_t steps = 10000000;
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (size_t s = 0; s &lt; steps; s++) q = *(char **)q;  // mỗi lần đọc cần một bản dịch MỚI
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    FILE *f = fopen("/proc/self/smaps_rollup", "r");
    char line[256]; *huge_kb = 0;
    while (fgets(line, sizeof line, f)) sscanf(line, "AnonHugePages: %zu", huge_kb);
    fclose(f);
    munmap(p, SZ); free(perm);
    if (q == NULL) puts("");
    return ((b.tv_sec - a.tv_sec) * 1e9 + (b.tv_nsec - a.tv_nsec)) / steps;
}

int main(void) {
    size_t h;
    double small = chase(0, &amp;h);
    printf("4 KB pages: %6.1f ns per load  (131072 pages to translate, huge pages used: %zu kB)\\n", small, h);
    double big = chase(1, &amp;h);
    printf("2 MB pages: %6.1f ns per load  (256 pages to translate,    huge pages used: %zu kB)\\n", big, h);
    printf("the 4 KB run is %.1fx slower: the difference is mostly page-table walks after TLB misses\\n", small / big);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -O2 tlb-trang-lon.c -o tlb-trang-lon &amp;&amp; ./tlb-trang-lon<br>
4 KB pages: &nbsp;210.6 ns per load &nbsp;(131072 pages to translate, huge pages used: 0 kB)<br>
2 MB pages: &nbsp;150.3 ns per load &nbsp;(256 pages to translate, &nbsp;&nbsp;&nbsp;huge pages used: 524288 kB)<br>
the 4 KB run is 1.4x slower: the difference is mostly page-table walks after TLB misses</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cùng dữ liệu, cùng số lần trượt cache — chỉ số phép dịch thay đổi, mà mỗi lần đọc nhanh hơn hàng chục nano giây. Đó là lý do có <code>huge_pages</code> của PostgreSQL, <code>-XX:+UseLargePages</code> của JVM và transparent huge pages của Linux. ➕ Từ vựng của sách §3.3.3: <strong>soft miss</strong> (trang đang ở RAM, chỉ TLB thiếu) và <strong>hard miss</strong> (trang phải lấy từ đĩa); một số CPU (MIPS, SPARC đời cũ) để phần mềm xử lý trượt TLB. TLB hiện đại gắn mỗi mục một mã không gian địa chỉ (ASID trên ARM, PCID trên x86) để chuyển ngữ cảnh không phải xoá sạch TLB.</p>
<p class="pitfall">⚠️ FE5 câu 17: phần trăm số lần tìm thấy số trang trong TLB = <strong>hit ratio</strong>. FE17 câu 26: TLB KHÔNG bỏ được bảng trang trong bộ nhớ; FE19 câu 9: trượt TLB KHÔNG có nghĩa là sẽ có thao tác đĩa (chỉ là đi tra bảng trang, trừ khi trang vắng mặt).</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Vì sao TLB quan trọng, bằng con số: thời gian truy cập hiệu dụng theo tỉ lệ trúng, thời gian bộ nhớ và số mức bảng.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-tlb os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> thời gian truy cập hiệu dụng có TLB <a href="/os-lab?sim=addr-split&amp;preset=tlb&amp;lang=vi&amp;tour=addr-split-size" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Kéo tỉ lệ trúng từ 98 % xuống 80 % và xem EAT tăng.</li><li>Đổi số mức bảng từ 1 lên 4: một lần trượt giờ tốn một lần truy cập cho mỗi mức.</li><li>So TLB reach với trang 4 KiB và trang 2 MiB.</li></ol></div>
</div>`],
      [18, 'Multilevel Page Tables',
        `<p class="y-chinh">🎯 Figure 3-13: (a) a 32-bit address split into a 10-bit <strong>PT1</strong> field, a 10-bit <strong>PT2</strong> field and a 12-bit offset; (b) a <strong>two-level page table</strong>: the top-level table has 1024 entries, each covering 4 MB and pointing to a second-level table whose 1024 entries point to 4-KB page frames.</p>
<p>The secret: <strong>avoid keeping all the page tables in memory all the time</strong>. A process with 4 MB of code at the bottom, 4 MB of data above it and 4 MB of stack at the top needs the top-level table plus just three second-level tables; the other 1021 top-level entries are marked absent and cost nothing. The book's example, virtual address 0x00403004 (4,206,596):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/67fc626c33ccad64e8e815ee5c4340af5f398ba8.svg" alt="0x00403004 → PT1 = 1 (the 4M–8M region), PT2 = 3, offset = 4" loading="lazy" /><p class="chu-thich">🧮 0x00403004 → PT1 = 1 (the 4M–8M region), PT2 = 3, offset = 4</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VD = {
  32: { dc: 0x00403004, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  fe: { dc: 0x00403008, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  x64: { dc: 0xaaaad4d70754, rong: [9, 9, 9, 9, 12], ten: ['L0 (PGD)', 'L1 (PUD)', 'L2 (PMD)', 'L3 (PTE)', 'offset'] },
};
/** Số bảng cần ở mỗi mức cho tập trang ảo đã dùng: mức i cần một bảng cho mỗi giá trị khác nhau của các trường phía trên nó. */
function soBang(trangDung, rong) {
  const muc = rong.length - 1;               // số mức bảng (trường cuối là offset)
  const ra = [];
  for (let i = 0; i &lt; muc; i++) {
    const s = new Set(trangDung.map((dc) =&gt; tachBit(dc, rong).slice(0, i).join('.')));
    ra.push(s.size);
  }
  return ra;
}
const VUNG32 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0xFFFFF000 - 4096 * i));
const VUNG48 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0x7FFFFFFFF000 - 4096 * i));</code></pre></details>
<p>PT1 = 1 selects the second-level table for 4M–8M; PT2 = 3 selects its entry 3 (bytes 12288–16383 of that region); the address is byte 12,292 of the 4-MB chunk. ➕ Today's 64-bit CPUs simply add levels. x86-64 and ARM64 with 4-KB pages both use <strong>four levels of 9 bits + a 12-bit offset = 48 bits</strong> (256 TiB); Intel's 5-level paging (Linux 4.14+) reaches 57 bits (128 PiB). A real address from the course container:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1a6c4b4eeff1d32267f459fec0f1b2f7c51152ea.svg" alt="A real 48-bit address split for a 4-level page table" loading="lazy" /><p class="chu-thich">🧮 A real 48-bit address split for a 4-level page table</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VD = {
  32: { dc: 0x00403004, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  fe: { dc: 0x00403008, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  x64: { dc: 0xaaaad4d70754, rong: [9, 9, 9, 9, 12], ten: ['L0 (PGD)', 'L1 (PUD)', 'L2 (PMD)', 'L3 (PTE)', 'offset'] },
};
/** Số bảng cần ở mỗi mức cho tập trang ảo đã dùng: mức i cần một bảng cho mỗi giá trị khác nhau của các trường phía trên nó. */
function soBang(trangDung, rong) {
  const muc = rong.length - 1;               // số mức bảng (trường cuối là offset)
  const ra = [];
  for (let i = 0; i &lt; muc; i++) {
    const s = new Set(trangDung.map((dc) =&gt; tachBit(dc, rong).slice(0, i).join('.')));
    ra.push(s.size);
  }
  return ra;
}
const VUNG32 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0xFFFFF000 - 4096 * i));
const VUNG48 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0x7FFFFFFFF000 - 4096 * i));</code></pre></details>
<p>And the memory saving, measured: the same 16 MB of data touched densely, then spread one page every 16 MB:</p>
<pre><code class="language-c">// Multilevel page tables cost memory only where memory is used: 16 MB touched densely vs one page every 16 MB
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;

static long vm(const char *key) {                        // VmRSS = data in RAM, VmPTE = memory used by our page tables (kB)
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long v = -1; size_t n = strlen(key);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, key, n)) sscanf(line + n + 1, "%ld", &amp;v);
    fclose(f);
    return v;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    long r0 = vm("VmRSS"), t0 = vm("VmPTE");
    size_t G = 1UL &lt;&lt; 30;
    char *a = mmap(NULL, G, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    madvise(a, G, MADV_NOHUGEPAGE);
    for (size_t i = 0; i &lt; (16UL &lt;&lt; 20); i += 4096) a[i] = 1;          // 4096 pages next to each other
    long r1 = vm("VmRSS"), t1 = vm("VmPTE");
    printf("A: 4096 pages side by side (16 MB):  data +%ld MB, page tables +%ld kB\\n", (r1 - r0 + 512) / 1024, t1 - t0);
    char *b = mmap(NULL, 64 * G, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    madvise(b, 64 * G, MADV_NOHUGEPAGE);
    for (size_t i = 0; i &lt; 64 * G; i += (16UL &lt;&lt; 20)) b[i] = 1;        // 4096 pages, one every 16 MB
    long r2 = vm("VmRSS"), t2 = vm("VmPTE");
    printf("B: 4096 pages, one every 16 MB:      data +%ld MB, page tables +%ld kB\\n", (r2 - r1 + 512) / 1024, t2 - t1);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-trang-ton.c -o bang-trang-ton &amp;&amp; ./bang-trang-ton<br>
A: 4096 pages side by side (16 MB): &nbsp;data +16 MB, page tables +36 kB<br>
B: 4096 pages, one every 16 MB: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data +16 MB, page tables +16640 kB</div>
<p>Dense: 36 kB of page tables. Sparse: 16,640 kB — every scattered page needed its own last-level table (4096 tables × 4 KB). Multilevel tables are cheap only when memory is used in clusters, which is what real programs do.</p>
<p class="pitfall">⚠️ FE4 question 17 = FE12 q18 = FE14 q23: 0x00403008 → <strong>PT1 = 1, PT2 = 3, offset = 8</strong> (verified by the simulator, variant <code>fe</code>). FE3 q16 = FE4 q18 (10-bit + 12-bit fields): offset = 32 − 22 = 10 bits → <strong>1-KB</strong> pages; 9 + 11 → 12 bits → 4 KB (FE21 q32); 10 + 11 → 2 KB (FE22 q43); 9 + 12 → 2 KB (FE29 q16); 9 + 11 + 12 → 2²⁰ pages (FE17 q2). FE9 q20: multilevel tables reduce the <strong>size of the page table</strong>.</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>The reason for multilevel page tables (slide 18): a sparse process needs only a few small tables instead of one huge one.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-table os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> one-level vs multilevel page tables <a href="/os-lab?sim=addr-split&amp;preset=table&amp;lang=en&amp;tour=addr-split-size" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Read the size of the one-level table for a 32-bit address, 4 KiB pages and 4-byte entries.</li><li>Compare it with the tables a sparse process really needs on two levels.</li><li>Change the page size and the entry size and predict the new numbers before you look.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Hình 3-13: (a) địa chỉ 32 bit chia thành trường <strong>PT1</strong> 10 bit, trường <strong>PT2</strong> 10 bit và độ dời 12 bit; (b) <strong>bảng trang hai mức (two-level page table)</strong>: bảng mức trên có 1024 mục, mỗi mục phủ 4 MB và trỏ tới một bảng mức hai, mà 1024 mục của nó trỏ tới các khung trang 4 KB.</p>
<p>Bí quyết: <strong>không giữ mọi bảng trang trong bộ nhớ mọi lúc</strong>. Một tiến trình có 4 MB mã ở dưới cùng, 4 MB dữ liệu phía trên và 4 MB ngăn xếp ở trên cùng chỉ cần bảng mức trên cộng đúng ba bảng mức hai; 1021 mục mức trên còn lại đánh dấu vắng mặt và không tốn gì. Ví dụ của sách, địa chỉ ảo 0x00403004 (4.206.596):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fceadadabc07708fef31bbef8bbd726330ead114.svg" alt="0x00403004 → PT1 = 1 (vùng 4M–8M), PT2 = 3, độ dời = 4" loading="lazy" /><p class="chu-thich">🧮 0x00403004 → PT1 = 1 (vùng 4M–8M), PT2 = 3, độ dời = 4</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VD = {
  32: { dc: 0x00403004, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  fe: { dc: 0x00403008, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  x64: { dc: 0xaaaad4d70754, rong: [9, 9, 9, 9, 12], ten: ['L0 (PGD)', 'L1 (PUD)', 'L2 (PMD)', 'L3 (PTE)', 'offset'] },
};
/** Số bảng cần ở mỗi mức cho tập trang ảo đã dùng: mức i cần một bảng cho mỗi giá trị khác nhau của các trường phía trên nó. */
function soBang(trangDung, rong) {
  const muc = rong.length - 1;               // số mức bảng (trường cuối là offset)
  const ra = [];
  for (let i = 0; i &lt; muc; i++) {
    const s = new Set(trangDung.map((dc) =&gt; tachBit(dc, rong).slice(0, i).join('.')));
    ra.push(s.size);
  }
  return ra;
}
const VUNG32 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0xFFFFF000 - 4096 * i));
const VUNG48 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0x7FFFFFFFF000 - 4096 * i));</code></pre></details>
<p>PT1 = 1 chọn bảng mức hai của vùng 4M–8M; PT2 = 3 chọn mục 3 của nó (byte 12288–16383 của vùng); địa chỉ là byte thứ 12.292 của khúc 4 MB đó. ➕ CPU 64 bit ngày nay chỉ việc thêm mức. x86-64 và ARM64 với trang 4 KB đều dùng <strong>bốn mức 9 bit + độ dời 12 bit = 48 bit</strong> (256 TiB); phân trang 5 mức của Intel (Linux 4.14 trở đi) lên 57 bit (128 PiB). Một địa chỉ thật lấy từ container của môn:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1983eb21964624dd492dc4bfef129038787acbb4.svg" alt="Một địa chỉ 48 bit thật tách cho bảng trang 4 mức" loading="lazy" /><p class="chu-thich">🧮 Một địa chỉ 48 bit thật tách cho bảng trang 4 mức</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VD = {
  32: { dc: 0x00403004, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  fe: { dc: 0x00403008, rong: [10, 10, 12], ten: ['PT1', 'PT2', 'offset'] },
  x64: { dc: 0xaaaad4d70754, rong: [9, 9, 9, 9, 12], ten: ['L0 (PGD)', 'L1 (PUD)', 'L2 (PMD)', 'L3 (PTE)', 'offset'] },
};
/** Số bảng cần ở mỗi mức cho tập trang ảo đã dùng: mức i cần một bảng cho mỗi giá trị khác nhau của các trường phía trên nó. */
function soBang(trangDung, rong) {
  const muc = rong.length - 1;               // số mức bảng (trường cuối là offset)
  const ra = [];
  for (let i = 0; i &lt; muc; i++) {
    const s = new Set(trangDung.map((dc) =&gt; tachBit(dc, rong).slice(0, i).join('.')));
    ra.push(s.size);
  }
  return ra;
}
const VUNG32 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0xFFFFF000 - 4096 * i));
const VUNG48 = [...Array(4).keys()].map((i) =&gt; 0x00400000 + 4096 * i)
  .concat([...Array(8).keys()].map((i) =&gt; 0x00800000 + 4096 * i))
  .concat([...Array(8).keys()].map((i) =&gt; 0x7FFFFFFFF000 - 4096 * i));</code></pre></details>
<p>Và phần bộ nhớ tiết kiệm được, đo thật: cùng 16 MB dữ liệu chạm liền nhau, rồi rải mỗi 16 MB một trang:</p>
<pre><code class="language-c">// Bảng trang nhiều mức chỉ tốn bộ nhớ ở chỗ có dùng: chạm 16 MB liền nhau vs mỗi 16 MB một trang
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;

static long vm(const char *key) {                        // VmRSS = dữ liệu trong RAM, VmPTE = bộ nhớ bảng trang của ta (kB)
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long v = -1; size_t n = strlen(key);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, key, n)) sscanf(line + n + 1, "%ld", &amp;v);
    fclose(f);
    return v;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    long r0 = vm("VmRSS"), t0 = vm("VmPTE");
    size_t G = 1UL &lt;&lt; 30;
    char *a = mmap(NULL, G, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    madvise(a, G, MADV_NOHUGEPAGE);
    for (size_t i = 0; i &lt; (16UL &lt;&lt; 20); i += 4096) a[i] = 1;          // 4096 trang liền nhau
    long r1 = vm("VmRSS"), t1 = vm("VmPTE");
    printf("A: 4096 pages side by side (16 MB):  data +%ld MB, page tables +%ld kB\\n", (r1 - r0 + 512) / 1024, t1 - t0);
    char *b = mmap(NULL, 64 * G, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    madvise(b, 64 * G, MADV_NOHUGEPAGE);
    for (size_t i = 0; i &lt; 64 * G; i += (16UL &lt;&lt; 20)) b[i] = 1;        // 4096 trang, mỗi 16 MB một trang
    long r2 = vm("VmRSS"), t2 = vm("VmPTE");
    printf("B: 4096 pages, one every 16 MB:      data +%ld MB, page tables +%ld kB\\n", (r2 - r1 + 512) / 1024, t2 - t1);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-trang-ton.c -o bang-trang-ton &amp;&amp; ./bang-trang-ton<br>
A: 4096 pages side by side (16 MB): &nbsp;data +16 MB, page tables +36 kB<br>
B: 4096 pages, one every 16 MB: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data +16 MB, page tables +16640 kB</div>
<p>Liền nhau: 36 kB bảng trang. Rải rác: 16.640 kB — mỗi trang lẻ loi cần một bảng mức cuối riêng (4096 bảng × 4 KB). Bảng nhiều mức chỉ rẻ khi bộ nhớ được dùng thành từng cụm — mà chương trình thật đúng là dùng như vậy.</p>
<p class="pitfall">⚠️ FE4 câu 17 = FE12 c18 = FE14 c23: 0x00403008 → <strong>PT1 = 1, PT2 = 3, offset = 8</strong> (bộ mô phỏng kiểm, biến thể <code>fe</code>). FE3 c16 = FE4 c18 (trường 10 bit + 12 bit): độ dời = 32 − 22 = 10 bit → trang <strong>1 KB</strong>; 9 + 11 → 12 bit → 4 KB (FE21 c32); 10 + 11 → 2 KB (FE22 c43); 9 + 12 → 2 KB (FE29 c16); 9 + 11 + 12 → 2²⁰ trang (FE17 c2). FE9 c20: bảng nhiều mức giảm <strong>kích thước bảng trang</strong>.</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Lý do có bảng trang nhiều mức (slide 18): một tiến trình thưa chỉ cần vài bảng nhỏ thay cho một bảng khổng lồ.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-table os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> bảng trang một mức vs nhiều mức <a href="/os-lab?sim=addr-split&amp;preset=table&amp;lang=vi&amp;tour=addr-split-size" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Đọc cỡ bảng một mức cho địa chỉ 32 bit, trang 4 KiB và mục 4 byte.</li><li>So với số bảng mà một tiến trình thưa thật sự cần khi chia hai mức.</li><li>Đổi cỡ trang và cỡ mục, đoán con số mới trước khi nhìn.</li></ol></div>
</div>`],
      [19, 'Inverted Page Tables',
        `<p class="y-chinh">🎯 Figure 3-14: a traditional page table has one entry per <strong>virtual page</strong> (2⁵² entries for 64-bit addresses and 4-KB pages); an <strong>inverted page table</strong> has one entry per <strong>page frame</strong> of physical memory (2¹⁸ entries for 1 GB of RAM), found through a <strong>hash table</strong> indexed by a hash of the virtual page.</p>
<p>Each inverted entry says which (process, virtual page) occupies that frame. The saving is huge, but translation gets hard: the virtual page can no longer be used as an index — the MMU must <strong>search</strong> the table for the pair (process n, virtual page p), on every reference. The fixes: the TLB (on a hit, no search at all), and a hash table on the virtual address so all pages with the same hash value are chained together. The numbers, computed:</p>
<pre><code class="language-javascript">// Page-table sizes: a normal table grows with the VIRTUAL space, an inverted table with the PHYSICAL memory
const KB = 2 ** 10, MB = 2 ** 20, GB = 2 ** 30, TB = 2 ** 40, PB = 2 ** 50;
const human = (b) =&gt; (b &gt;= PB ? &#96;&#36;{b / PB} PB&#96; : b &gt;= TB ? &#96;&#36;{b / TB} TB&#96; : b &gt;= GB ? &#96;&#36;{b / GB} GB&#96; : b &gt;= MB ? &#96;&#36;{b / MB} MB&#96; : &#96;&#36;{b / KB} KB&#96;);
const page = 4 * KB;
for (const [bits, entry] of [[32, 4], [48, 8], [64, 8]]) {
  const entries = 2 ** bits / page;
  console.log(&#96;one-level table, &#36;{bits}-bit virtual space: 2^&#36;{Math.log2(entries)} entries x &#36;{entry} B = &#36;{human(entries * entry)} per process&#96;);
}
for (const ram of [1 * GB, 16 * GB, 256 * GB]) {
  const frames = ram / page;
  console.log(&#96;inverted table, &#36;{human(ram)} of RAM: 2^&#36;{Math.log2(frames)} frames x 16 B = &#36;{human(frames * 16)} for the whole machine&#96;);
}</code></pre>
<div class="out">$ node bang-nghich-dao.js<br>
one-level table, 32-bit virtual space: 2^20 entries x 4 B = 4 MB per process<br>
one-level table, 48-bit virtual space: 2^36 entries x 8 B = 512 GB per process<br>
one-level table, 64-bit virtual space: 2^52 entries x 8 B = 32 PB per process<br>
inverted table, 1 GB of RAM: 2^18 frames x 16 B = 4 MB for the whole machine<br>
inverted table, 16 GB of RAM: 2^22 frames x 16 B = 64 MB for the whole machine<br>
inverted table, 256 GB of RAM: 2^26 frames x 16 B = 1 GB for the whole machine</div>
<p>A normal table grows with the <strong>virtual</strong> space and is per process; an inverted table grows with the <strong>physical</strong> RAM and there is one for the whole machine. Inverted tables were used on 64-bit machines such as PowerPC, UltraSPARC and Itanium; x86-64 and ARM64 chose multilevel tables instead.</p>
<p class="pitfall">⚠️ FE21 question 47 = FE23 question 5: an inverted page table entry contains the pair <strong>(process, virtual page)</strong> mapped into the corresponding page frame — not (process, offset), not segments.</p>`,
        `<p class="y-chinh">🎯 Hình 3-14: bảng trang truyền thống có một mục cho mỗi <strong>trang ảo</strong> (2⁵² mục với địa chỉ 64 bit và trang 4 KB); <strong>bảng trang nghịch đảo (inverted page table)</strong> có một mục cho mỗi <strong>khung trang</strong> của bộ nhớ vật lý (2¹⁸ mục cho 1 GB RAM), tìm qua một <strong>bảng băm (hash table)</strong> theo giá trị băm của trang ảo.</p>
<p>Mỗi mục nghịch đảo ghi cặp (tiến trình, trang ảo) nào đang chiếm khung đó. Tiết kiệm khổng lồ, nhưng dịch địa chỉ trở nên khó: không thể dùng trang ảo làm chỉ số nữa — MMU phải <strong>tìm</strong> trong bảng cặp (tiến trình n, trang ảo p), ở mỗi lần tham chiếu. Cách chữa: TLB (trúng thì khỏi tìm), và một bảng băm theo địa chỉ ảo để các trang cùng giá trị băm được xâu lại với nhau. Các con số, do máy tính:</p>
<pre><code class="language-javascript">// Cỡ bảng trang: bảng thường lớn theo không gian ẢO, bảng nghịch đảo lớn theo bộ nhớ VẬT LÝ
const KB = 2 ** 10, MB = 2 ** 20, GB = 2 ** 30, TB = 2 ** 40, PB = 2 ** 50;
const human = (b) =&gt; (b &gt;= PB ? &#96;&#36;{b / PB} PB&#96; : b &gt;= TB ? &#96;&#36;{b / TB} TB&#96; : b &gt;= GB ? &#96;&#36;{b / GB} GB&#96; : b &gt;= MB ? &#96;&#36;{b / MB} MB&#96; : &#96;&#36;{b / KB} KB&#96;);
const page = 4 * KB;
for (const [bits, entry] of [[32, 4], [48, 8], [64, 8]]) {
  const entries = 2 ** bits / page;
  console.log(&#96;one-level table, &#36;{bits}-bit virtual space: 2^&#36;{Math.log2(entries)} entries x &#36;{entry} B = &#36;{human(entries * entry)} per process&#96;);
}
for (const ram of [1 * GB, 16 * GB, 256 * GB]) {
  const frames = ram / page;
  console.log(&#96;inverted table, &#36;{human(ram)} of RAM: 2^&#36;{Math.log2(frames)} frames x 16 B = &#36;{human(frames * 16)} for the whole machine&#96;);
}</code></pre>
<div class="out">$ node bang-nghich-dao.js<br>
one-level table, 32-bit virtual space: 2^20 entries x 4 B = 4 MB per process<br>
one-level table, 48-bit virtual space: 2^36 entries x 8 B = 512 GB per process<br>
one-level table, 64-bit virtual space: 2^52 entries x 8 B = 32 PB per process<br>
inverted table, 1 GB of RAM: 2^18 frames x 16 B = 4 MB for the whole machine<br>
inverted table, 16 GB of RAM: 2^22 frames x 16 B = 64 MB for the whole machine<br>
inverted table, 256 GB of RAM: 2^26 frames x 16 B = 1 GB for the whole machine</div>
<p>Bảng thường lớn theo không gian <strong>ảo</strong> và mỗi tiến trình một bảng; bảng nghịch đảo lớn theo RAM <strong>vật lý</strong> và cả máy chỉ có một bảng. Bảng nghịch đảo từng được dùng trên các máy 64 bit như PowerPC, UltraSPARC và Itanium; x86-64 và ARM64 thì chọn bảng nhiều mức.</p>
<p class="pitfall">⚠️ FE21 câu 47 = FE23 câu 5: một mục bảng trang nghịch đảo chứa cặp <strong>(process, virtual page)</strong> ánh xạ vào khung trang tương ứng — không phải (process, offset), không phải đoạn.</p>`],
      [20, 'Page Replacement Algorithms',
        `<p class="y-chinh">🎯 When a page fault occurs and memory is full, the OS must choose a page to <strong>evict</strong>. The algorithms of this section: <strong>optimal</strong>, <strong>not recently used</strong>, <strong>FIFO</strong>, <strong>second chance</strong>, <strong>clock</strong>, <strong>least recently used</strong> (with its software cousins NFU and aging), <strong>working set</strong> and <strong>WSClock</strong>.</p>
<p>If the evicted page was modified, it must first be written to disk; if not, the copy on disk is still good and the frame can be reused at once. Evicting a heavily used page is a mistake that costs another fault soon. The <strong>optimal</strong> algorithm (Belady's OPT) removes the page whose <strong>next use is farthest in the future</strong> — impossible to implement (the OS cannot see the future), but a perfect benchmark: run a program once, record its references, and compare real algorithms with OPT on the same string. <strong>FIFO</strong> removes the page that was loaded earliest — a queue, like a supermarket dropping the product it began selling first, even if it is bread. Both on the classic 20-reference string, 3 frames:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0b79f6df2fa66ac52f5e7e8f354fed794dd04394.svg" alt="OPT: 9 page faults — no algorithm can do better on this string" loading="lazy" /><p class="chu-thich">🧮 OPT: 9 page faults — no algorithm can do better on this string</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9dfafb4fe4e974e333858a56180835bd84f9679f.svg" alt="FIFO: 15 page faults — it evicts page 0 again and again although 0 keeps coming back" loading="lazy" /><p class="chu-thich">🧮 FIFO: 15 page faults — it evicts page 0 again and again although 0 keeps coming back</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<p>Read the tables column by column: the reference on top, the three frames below (yellow = page just loaded), F = fault. Every algorithm also pays the <strong>compulsory</strong> faults at the start, when frames are empty — FE questions always count them ("frames initially empty").</p>
<p class="pitfall">⚠️ Exam strings checked by the simulator: FE3 q17 = FE7 q22 = FE11 q20 = FE14 q26 (FIFO, 4 frames, 0172327103) → <strong>6</strong>; FE4 q20 = FE13 q19 = FE14 q27 (OPT, 4 frames, 7,0,1,2,0,3,0) → <strong>5</strong>; FE6 q20 = FE8 q21 = FE15 q24 (FIFO, 3 frames, 1,2,3,4,1,2) → <strong>6</strong>; FE4 q14 (FIFO, 3 frames, 1,2,3,4,1,2,5): loading 5 evicts page <strong>4</strong>. FE5 q8: FIFO is implemented with a <strong>queue</strong>.</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>The page-replacement table of slides 20–29, filled column by column for any reference string you type.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-exam"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> FIFO, LRU, OPT and Clock on any reference string <a href="/os-lab?sim=vm&amp;preset=exam&amp;lang=en" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Type a reference string from a past FE, pick FIFO and the frame count, and count the faults on paper first.</li><li>Run the simulator and compare column by column.</li><li>Repeat with LRU and OPT on the same string and rank the three.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Khi có lỗi trang mà bộ nhớ đã đầy, HĐH phải chọn một trang để <strong>đuổi (evict)</strong>. Các thuật toán của mục này: <strong>tối ưu (optimal)</strong>, <strong>NRU — chưa dùng gần đây</strong>, <strong>FIFO</strong>, <strong>cơ hội thứ hai (second chance)</strong>, <strong>đồng hồ (clock)</strong>, <strong>LRU — lâu nhất chưa dùng</strong> (cùng hai "anh em" phần mềm NFU và aging), <strong>tập làm việc (working set)</strong> và <strong>WSClock</strong>.</p>
<p>Nếu trang bị đuổi đã bị sửa, nó phải được ghi xuống đĩa trước; nếu chưa, bản trên đĩa vẫn còn đúng và khung dùng lại được ngay. Đuổi một trang đang dùng nhiều là sai lầm phải trả bằng một lần lỗi nữa ngay sau đó. Thuật toán <strong>tối ưu</strong> (OPT của Belady) đuổi trang mà <strong>lần dùng kế tiếp xa nhất trong tương lai</strong> — không cài đặt được (HĐH không nhìn thấy tương lai), nhưng là chuẩn so sánh hoàn hảo: chạy chương trình một lần, ghi lại chuỗi tham chiếu, rồi so các thuật toán thật với OPT trên cùng chuỗi. <strong>FIFO</strong> đuổi trang được nạp sớm nhất — một hàng đợi, như siêu thị bỏ món hàng bán lâu nhất, kể cả khi đó là bánh mì. Cả hai trên chuỗi kinh điển 20 tham chiếu, 3 khung:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/501d7e7a11df943c519b494de453df86c58dcdcb.svg" alt="OPT: 9 lỗi trang — không thuật toán nào làm tốt hơn trên chuỗi này" loading="lazy" /><p class="chu-thich">🧮 OPT: 9 lỗi trang — không thuật toán nào làm tốt hơn trên chuỗi này</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cac48d6f733e07edd557a273953d93851e6c119f.svg" alt="FIFO: 15 lỗi trang — nó đuổi trang 0 hết lần này tới lần khác dù 0 cứ quay lại" loading="lazy" /><p class="chu-thich">🧮 FIFO: 15 lỗi trang — nó đuổi trang 0 hết lần này tới lần khác dù 0 cứ quay lại</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<p>Đọc bảng theo từng cột: tham chiếu ở trên, ba khung bên dưới (ô vàng = trang vừa nạp), F = lỗi. Thuật toán nào cũng phải trả các lỗi <strong>bắt buộc (compulsory)</strong> lúc đầu, khi khung còn trống — câu FE luôn tính chúng ("frames initially empty").</p>
<p class="pitfall">⚠️ Chuỗi trong đề đã kiểm bằng mô phỏng: FE3 c17 = FE7 c22 = FE11 c20 = FE14 c26 (FIFO, 4 khung, 0172327103) → <strong>6</strong>; FE4 c20 = FE13 c19 = FE14 c27 (OPT, 4 khung, 7,0,1,2,0,3,0) → <strong>5</strong>; FE6 c20 = FE8 c21 = FE15 c24 (FIFO, 3 khung, 1,2,3,4,1,2) → <strong>6</strong>; FE4 c14 (FIFO, 3 khung, 1,2,3,4,1,2,5): nạp 5 thì trang <strong>4</strong> bị đuổi. FE5 c8: FIFO được cài bằng <strong>hàng đợi (queue)</strong>.</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Bảng thay trang của slide 20–29, điền từng cột cho bất kỳ chuỗi tham chiếu nào bạn gõ.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-exam"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> FIFO, LRU, OPT và Clock trên chuỗi tham chiếu bất kỳ <a href="/os-lab?sim=vm&amp;preset=exam&amp;lang=vi" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Gõ một chuỗi tham chiếu từ đề FE cũ, chọn FIFO và số khung, rồi tự đếm lỗi trang trên giấy trước.</li><li>Chạy mô phỏng và so từng cột.</li><li>Làm lại với LRU và OPT trên cùng chuỗi rồi xếp hạng ba thuật toán.</li></ol></div>
</div>`],
      [21, 'Not Recently Used Algorithm',
        `<p class="y-chinh">🎯 <strong>NRU</strong>: at a page fault, the OS inspects all pages and puts each into one of four classes using its R and M bits — class 0: not referenced, not modified; class 1: not referenced, modified; class 2: referenced, not modified; class 3: referenced, modified. It evicts a page (at random) from the <strong>lowest non-empty class</strong>.</p>
<p>The R and M bits come from the page table entries (slide 15). Periodically — on each clock interrupt — the R bits are <strong>cleared</strong>, so R = 1 means "used recently", not "used once long ago". That is how class 1 can exist (modified but not referenced): a class 3 page whose R bit was cleared by the clock. The rule prefers to evict a modified page that has not been used in the last tick over a clean page that is in heavy use. The simulator plays it on a string of reads (r) and writes (w), with a clock tick every 4 references (marked "|"):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/31335cac42ad5b91a39b57b4049f7b02be4bec5f.svg" alt="NRU with 3 frames: the classes at each fault decide the victim" loading="lazy" /><p class="chu-thich">🧮 NRU with 3 frames: the classes at each fault decide the victim</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = '0r 1w 2r 0r 3r 1r 0w 4r 2w 3r 1r 5r'.split(' ').map((s) =&gt; ({ trang: Number(s[0]), ghi: s[1] === 'w' }));
const KHUNG = 3, NHIP = 4;</code></pre></details>
<p>Look at the fault on <code>0w</code>: the classes are 2, 3, 0 — frame 2 holds a page with R = 0, M = 0 (class 0), so it goes. On <code>|2w</code> the tick has just cleared every R, so the classes are 0, 1, 1 and the clean page wins. (The book picks "at random" inside a class; the simulator takes the lowest frame number to be repeatable.) NRU is easy to understand, cheap, and "adequate" — a very crude approximation of LRU (slide 29).</p>
<p class="meo">🧠 Class = 2 × R + M. Lower class = better victim. The dirty bit only breaks ties between pages that are equally "not recently used".</p>`,
        `<p class="y-chinh">🎯 <strong>NRU (Not Recently Used — chưa dùng gần đây)</strong>: khi lỗi trang, HĐH xem mọi trang và xếp mỗi trang vào một trong bốn lớp theo bit R và M của nó — lớp 0: không tham chiếu, không sửa; lớp 1: không tham chiếu, đã sửa; lớp 2: đã tham chiếu, không sửa; lớp 3: đã tham chiếu, đã sửa. Nó đuổi một trang (ngẫu nhiên) của <strong>lớp thấp nhất còn trang</strong>.</p>
<p>Bit R và M lấy từ mục bảng trang (slide 15). Định kỳ — ở mỗi ngắt đồng hồ — các bit R bị <strong>xoá về 0</strong>, nên R = 1 nghĩa là "mới dùng gần đây", chứ không phải "từng dùng lâu rồi". Nhờ vậy mới có lớp 1 (đã sửa nhưng không tham chiếu): một trang lớp 3 bị đồng hồ xoá bit R. Luật này thà đuổi một trang đã sửa nhưng không dùng trong nhịp vừa qua còn hơn đuổi một trang sạch đang được dùng nhiều. Bộ mô phỏng chạy trên một chuỗi đọc (r) và ghi (w), cứ 4 tham chiếu một ngắt đồng hồ (đánh dấu "|"):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4d68b95bfc0abfe20e2e589fd2444f703d61f696.svg" alt="NRU với 3 khung: lớp của các trang lúc lỗi quyết định nạn nhân" loading="lazy" /><p class="chu-thich">🧮 NRU với 3 khung: lớp của các trang lúc lỗi quyết định nạn nhân</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = '0r 1w 2r 0r 3r 1r 0w 4r 2w 3r 1r 5r'.split(' ').map((s) =&gt; ({ trang: Number(s[0]), ghi: s[1] === 'w' }));
const KHUNG = 3, NHIP = 4;</code></pre></details>
<p>Xem lần lỗi ở <code>0w</code>: các lớp là 2, 3, 0 — khung 2 giữ trang có R = 0, M = 0 (lớp 0), nên nó bị đuổi. Ở <code>|2w</code> đồng hồ vừa xoá mọi bit R, nên các lớp là 0, 1, 1 và trang sạch bị chọn. (Sách chọn "ngẫu nhiên" trong một lớp; bộ mô phỏng lấy khung số nhỏ nhất để chạy lại ra y hệt.) NRU dễ hiểu, rẻ và "tạm đủ" — một xấp xỉ rất thô của LRU (slide 29).</p>
<p class="meo">🧠 Lớp = 2 × R + M. Lớp càng thấp càng nên đuổi. Bit bẩn chỉ phân xử giữa các trang "chưa dùng gần đây" ngang nhau.</p>`],
      [22, 'Second-Chance Algorithm',
        `<p class="y-chinh">🎯 Figure 3-15, <strong>second chance</strong>: FIFO, but before evicting the oldest page look at its R bit. (a) Pages sorted in FIFO order, load times above them; (b) a page fault at time 20 when A has R = 1: A is not evicted — its R bit is cleared and it is put at the end of the list <strong>as if it had just been loaded</strong> (time 20), and the search continues with B.</p>
<p>The idea fixes FIFO's worst habit — throwing out a page that is in heavy use just because it is old. If every page has been referenced, second chance clears all the R bits while cycling through the whole list, comes back to the original head (now R = 0) and evicts it: it degenerates into pure FIFO. The simulator replays the figure, assuming the other pages have R = 0:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fe51fde455c636d290b97475a86bc4fa8bffb6a8.svg" alt="Second chance at time 20: A goes to the tail, B is evicted" loading="lazy" /><p class="chu-thich">🧮 Second chance at time 20: A goes to the tail, B is evicted</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const DS = 'ABCDEFGH'.split('').map((trang, i) =&gt; ({ trang, nap: [0, 3, 7, 8, 12, 14, 15, 18][i], R: trang === 'A' ? 1 : 0 }));
const LUC = 20;</code></pre></details>
<p>What second chance looks for is an old page that has not been referenced in the most recent clock interval. If all pages are old and unused, it simply picks the oldest. Its cost: pages are constantly <strong>moved around</strong> the list — a linked-list unlink and append on every second chance. Slide 23 removes exactly that cost.</p>
<p class="pitfall">⚠️ FE23 question 11 = FE24 question 2: second chance "moves pages found at the head of a FIFO queue with the referenced bit on <strong>back to the tail</strong>"; "searches a circular list and replaces the first page with R off" is the description of <strong>clock</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 3-15, <strong>cơ hội thứ hai (second chance)</strong>: FIFO, nhưng trước khi đuổi trang cũ nhất thì xem bit R của nó. (a) Các trang xếp theo thứ tự FIFO, thời điểm nạp ghi phía trên; (b) lỗi trang lúc 20 khi A có R = 1: A không bị đuổi — bit R của nó bị xoá và nó được đặt xuống cuối danh sách <strong>như thể vừa được nạp</strong> (lúc 20), rồi việc tìm tiếp tục với B.</p>
<p>Ý tưởng này sửa thói xấu nhất của FIFO — vứt bỏ một trang đang dùng nhiều chỉ vì nó cũ. Nếu mọi trang đều đã được tham chiếu, second chance xoá hết bit R trong lúc đi hết một vòng danh sách, quay về đầu cũ (giờ R = 0) và đuổi nó: thoái hoá thành FIFO thuần. Bộ mô phỏng chạy lại hình, giả định các trang khác có R = 0:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/87ba7d21b97206da0e94d6a38a29b8a02f0a6863.svg" alt="Cơ hội thứ hai lúc 20: A xuống cuối, B bị đuổi" loading="lazy" /><p class="chu-thich">🧮 Cơ hội thứ hai lúc 20: A xuống cuối, B bị đuổi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const DS = 'ABCDEFGH'.split('').map((trang, i) =&gt; ({ trang, nap: [0, 3, 7, 8, 12, 14, 15, 18][i], R: trang === 'A' ? 1 : 0 }));
const LUC = 20;</code></pre></details>
<p>Thứ second chance tìm là một trang cũ chưa được tham chiếu trong khoảng đồng hồ gần nhất. Nếu mọi trang đều cũ và không dùng, nó đơn giản chọn trang cũ nhất. Cái giá: các trang liên tục bị <strong>dời chỗ</strong> trong danh sách — tháo khỏi danh sách liên kết rồi nối vào cuối ở mỗi lần cho cơ hội. Slide 23 bỏ đúng chi phí đó.</p>
<p class="pitfall">⚠️ FE23 câu 11 = FE24 câu 2: second chance "chuyển trang ở đầu hàng đợi FIFO có bit tham chiếu bật <strong>xuống cuối hàng</strong>"; còn "duyệt danh sách vòng và thay trang đầu tiên có R tắt" là mô tả của <strong>clock</strong>.</p>`],
      [23, 'Clock Page Replacement Algorithm',
        `<p class="y-chinh">🎯 Figure 3-16, <strong>clock</strong>: keep all page frames on a circular list like a clock face, with a <strong>hand</strong> pointing to the oldest page. On a page fault, inspect the page under the hand: <strong>R = 0 → evict it</strong>, put the new page there and advance the hand; <strong>R = 1 → clear R and advance the hand</strong>, repeat.</p>
<p>Clock makes exactly the same decisions as second chance, but nothing moves: only the hand advances. In the simulator, the extra rows show the R bit of every frame and where the hand points after each step:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6de6bec366edf4c6db330a3272acf01e0d364c08.svg" alt="Clock on the classic string, 3 frames: 14 faults (FIFO had 15, OPT 9)" loading="lazy" /><p class="chu-thich">🧮 Clock on the classic string, 3 frames: 14 faults (FIFO had 15, OPT 9)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<p>On a hit only the R bit of that frame is set; the hand does not move. On a fault the hand sweeps, clearing 1s until it finds a 0. Second chance in queue form gives the same 14 faults (the comparison chart of slide 29 counts them together). Clock is the base of what real kernels do: Linux's page reclaim approximates LRU with reference bits and lists, BSD used a two-handed clock.</p>
<p class="pitfall">⚠️ FE2 question 17 = FE6 q19 = FE10 q27 = FE11 q22: the advantage of clock over second chance = <strong>it eliminates the need to move pages around</strong> (less overhead) — NOT "fewer page faults": on any string they make the same choices.</p>`,
        `<p class="y-chinh">🎯 Hình 3-16, <strong>đồng hồ (clock)</strong>: giữ mọi khung trang trên một danh sách vòng như mặt đồng hồ, với một <strong>kim</strong> chỉ vào trang cũ nhất. Khi lỗi trang, xét trang dưới kim: <strong>R = 0 → đuổi nó</strong>, đặt trang mới vào đó và cho kim tiến; <strong>R = 1 → xoá R và cho kim tiến</strong>, lặp lại.</p>
<p>Clock ra quyết định y hệt second chance, nhưng không gì phải dời chỗ: chỉ có kim đi. Trong mô phỏng, các hàng phụ cho thấy bit R của từng khung và kim chỉ vào đâu sau mỗi bước:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1b859d0ffc40e6f01f5261aa50d69152dbcbc2b9.svg" alt="Clock trên chuỗi kinh điển, 3 khung: 14 lỗi (FIFO 15, OPT 9)" loading="lazy" /><p class="chu-thich">🧮 Clock trên chuỗi kinh điển, 3 khung: 14 lỗi (FIFO 15, OPT 9)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<p>Khi trúng, chỉ bit R của khung đó được bật; kim không đi. Khi lỗi, kim quét, xoá các bit 1 cho tới khi gặp một bit 0. Second chance dạng hàng đợi cũng ra đúng 14 lỗi (biểu đồ so sánh ở slide 29 tính chung hai cái). Clock là nền của thứ nhân thật đang làm: cơ chế thu hồi trang của Linux xấp xỉ LRU bằng bit tham chiếu và các danh sách, BSD dùng đồng hồ hai kim.</p>
<p class="pitfall">⚠️ FE2 câu 17 = FE6 c19 = FE10 c27 = FE11 c22: ưu điểm của clock so với second chance = <strong>không phải dời các trang đi lại</strong> (ít chi phí) — KHÔNG phải "ít lỗi trang hơn": trên mọi chuỗi chúng chọn giống nhau.</p>`],
      [24, 'Simulating LRU in Software',
        `<p class="y-chinh">🎯 Figure 3-17, <strong>aging</strong>: each page has an 8-bit software counter. At every clock tick each counter is <strong>shifted right one bit</strong> and the page's R bit is added as the <strong>leftmost bit</strong>; then R is cleared. On a page fault the page with the <strong>lowest counter</strong> is evicted. The figure shows six pages over five ticks (a)–(e).</p>
<p><strong>LRU</strong> — evict the page unused for the longest time — is an excellent policy but expensive to do exactly: the list of pages ordered by last use would have to be updated on <strong>every memory reference</strong>. Hardware solutions (a 64-bit counter copied into the PTE on every reference; an n × n bit matrix) are rare. Software approximations: <strong>NFU</strong> (not frequently used) adds R to a counter at every tick — but it never forgets, so a page used heavily long ago looks "important" forever. <strong>Aging</strong> fixes that by shifting, so recent ticks weigh more than old ones. The simulator recomputes the whole figure from its R bits:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/af01e9c92646cef9e295500803643ea10f0e7ff1.svg" alt="Aging recomputed from the R bits of Figure 3-17 — the red cell is a printing error of the slide" loading="lazy" /><p class="chu-thich">🧮 Aging recomputed from the R bits of Figure 3-17 — the red cell is a printing error of the slide</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const R = [[1, 0, 1, 0, 1, 1], [1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0], [0, 1, 1, 0, 0, 0]];
const SLIDE_E = ['01111000', '10110000', '10010000', '00100000', '01011000', '00101000'];   // as printed on slide 24 (e)</code></pre></details>
<p>Every value matches the slide except one: in column (e), page 2 is printed as <code>10010000</code>, but from (d) <code>00010000</code> shifted right gives <code>00001000</code>, and the tick-4 R bit of page 2 is 1, so the correct value is <strong><code>10001000</code></strong>. The decision is unaffected: page 3 (<code>00100000</code>) has the smallest counter and is the one to evict. Two limits of aging versus true LRU: within one tick it cannot tell which reference came first (pages 3 and 5 at (e) were both last used two ticks ago), and with 8 bits a page unused for more than 8 ticks looks the same as one unused for 1000.</p>
<p class="pitfall">⚠️ FE27 q28 = FE28 q28 = FE29 q28: "the best page to remove is the one that has been <strong>unused the longest</strong>" = <strong>LRU</strong>; FE19 q22: "the one that has been in memory the longest" = <strong>FIFO</strong>. Don't mix them.</p>`,
        `<p class="y-chinh">🎯 Hình 3-17, <strong>aging (lão hoá)</strong>: mỗi trang có một bộ đếm phần mềm 8 bit. Ở mỗi nhịp đồng hồ, mỗi bộ đếm <strong>dịch phải một bit</strong> và bit R của trang được chèn vào làm <strong>bit trái nhất</strong>; rồi R bị xoá. Khi lỗi trang, trang có <strong>bộ đếm nhỏ nhất</strong> bị đuổi. Hình cho sáu trang qua năm nhịp (a)–(e).</p>
<p><strong>LRU</strong> — đuổi trang lâu nhất chưa được dùng — là chính sách rất tốt nhưng làm chính xác thì tốn kém: danh sách trang xếp theo lần dùng cuối phải được cập nhật ở <strong>mỗi lần truy cập bộ nhớ</strong>. Giải pháp phần cứng (bộ đếm 64 bit chép vào PTE ở mỗi lần tham chiếu; ma trận bit n × n) hiếm khi có. Xấp xỉ bằng phần mềm: <strong>NFU</strong> (not frequently used — ít dùng thường xuyên) cộng R vào bộ đếm ở mỗi nhịp — nhưng nó không bao giờ quên, nên một trang từng được dùng nhiều từ lâu trông "quan trọng" mãi mãi. <strong>Aging</strong> chữa bằng phép dịch, để các nhịp gần đây nặng ký hơn nhịp cũ. Bộ mô phỏng tính lại cả hình từ các bit R của nó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5b28220043695463fddde40be57ae479342c5637.svg" alt="Aging tính lại từ các bit R của Hình 3-17 — ô đỏ là lỗi in của slide" loading="lazy" /><p class="chu-thich">🧮 Aging tính lại từ các bit R của Hình 3-17 — ô đỏ là lỗi in của slide</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const R = [[1, 0, 1, 0, 1, 1], [1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0], [0, 1, 1, 0, 0, 0]];
const SLIDE_E = ['01111000', '10110000', '10010000', '00100000', '01011000', '00101000'];   // as printed on slide 24 (e)</code></pre></details>
<p>Mọi giá trị khớp slide trừ một: ở cột (e), trang 2 được in là <code>10010000</code>, nhưng từ (d) <code>00010000</code> dịch phải ra <code>00001000</code>, và bit R của trang 2 ở nhịp 4 bằng 1, nên giá trị đúng là <strong><code>10001000</code></strong>. Quyết định không đổi: trang 3 (<code>00100000</code>) có bộ đếm nhỏ nhất và là trang bị đuổi. Hai giới hạn của aging so với LRU thật: trong cùng một nhịp nó không biết tham chiếu nào xảy ra trước (trang 3 và 5 ở (e) đều được dùng lần cuối cách đây hai nhịp), và với 8 bit thì trang không dùng hơn 8 nhịp trông y như trang không dùng 1000 nhịp.</p>
<p class="pitfall">⚠️ FE27 c28 = FE28 c28 = FE29 c28: "trang nên đuổi là trang <strong>lâu nhất chưa được dùng</strong>" = <strong>LRU</strong>; FE19 c22: "trang ở trong bộ nhớ lâu nhất" = <strong>FIFO</strong>. Đừng lẫn hai câu.</p>`],
      [25, 'Working Set Algorithm (1)',
        `<p class="y-chinh">🎯 Figure 3-18: the <strong>working set</strong> is the set of pages used by the <strong>k most recent memory references</strong>; the function <strong>w(k, t)</strong> is its size at time t. As k grows, w(k, t) rises quickly and then flattens: a program uses a small set of pages intensively and others only now and then.</p>
<p>Pure <strong>demand paging</strong> starts a process with no pages and lets it fault them in one by one; after a while it has most of what it needs. This works because of <strong>locality of reference</strong>: during any phase of execution a process references only a small fraction of its pages. If the whole working set fits in memory, the process runs with few faults; if memory cannot hold it, the process causes many faults and runs slowly — <strong>thrashing</strong> (a program "causing page faults every few instructions", FE11 question 21). Many systems therefore track each process's working set and load it <em>before</em> letting the process run: <strong>prepaging</strong>. The simulator measures w(k, t) on a reference string with locality (hot, warm and cold pages):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c0e5ff7ceade46b30a9c1fb4902bbf5f04f8acad.svg" alt="w(k, t) climbs to about 8 pages fast, then grows slowly as rare pages appear" loading="lazy" /><p class="chu-thich">🧮 w(k, t) climbs to about 8 pages fast, then grows slowly as rare pages appear</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">let x = 2024;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const NONG = [20, 21, 22], AM = [23, 24, 25, 26, 27], LANH = Array.from({ length: 12 }, (_, i) =&gt; 100 + i);
const REF = Array.from({ length: 2000 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return NONG[q % NONG.length];
  if (p &lt; 970) return AM[q % AM.length];
  return LANH[q % LANH.length];
});
const T = REF.length - 1;
const KS = Array.from({ length: 100 }, (_, i) =&gt; 1 + i * 6);</code></pre></details>
<p>About 8 pages (the hot and warm ones) cover the last 50–170 references; looking further back only adds rarely used pages. That flat part is why the working set changes slowly, and why it can be estimated: instead of "the last k references" (too expensive to track), real implementations use "<strong>pages used during the last τ seconds of execution time</strong>" — slide 26.</p>
<p class="pitfall">⚠️ FE2 question 18: the goal of the working set model = <strong>reduce the page fault rate by keeping a process's active pages in memory</strong>; FE28 question 9: it finds the minimum number of frames a job needs to run <strong>without thrashing</strong>. Old lesson 3.4 has the full thrashing story.</p>`,
        `<p class="y-chinh">🎯 Hình 3-18: <strong>tập làm việc (working set)</strong> là tập các trang được dùng trong <strong>k lần tham chiếu bộ nhớ gần nhất</strong>; hàm <strong>w(k, t)</strong> là kích thước của nó tại thời điểm t. Khi k tăng, w(k, t) tăng nhanh rồi thoải dần: chương trình dùng dồn dập một tập nhỏ các trang, còn các trang khác chỉ thỉnh thoảng.</p>
<p><strong>Phân trang theo yêu cầu (demand paging)</strong> thuần cho tiến trình khởi đầu không có trang nào và để nó gây lỗi nạp từng trang; một lúc sau nó đã có gần đủ thứ cần. Cách này chạy được nhờ <strong>tính cục bộ của tham chiếu (locality of reference)</strong>: trong mỗi pha thực thi, tiến trình chỉ tham chiếu một phần nhỏ các trang của nó. Nếu cả tập làm việc vừa bộ nhớ, tiến trình chạy với ít lỗi; nếu bộ nhớ không chứa nổi, tiến trình gây rất nhiều lỗi và chạy chậm — <strong>thrashing (trì trệ do phân trang)</strong> (chương trình "gây lỗi trang sau mỗi vài lệnh", FE11 câu 21). Vì thế nhiều hệ thống theo dõi tập làm việc của từng tiến trình và nạp sẵn nó <em>trước khi</em> cho tiến trình chạy: <strong>nạp trước (prepaging)</strong>. Bộ mô phỏng đo w(k, t) trên một chuỗi tham chiếu có tính cục bộ (trang nóng, ấm và lạnh):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8d0d98ac9ab3ab4d1440caaa240fa70e22c71735.svg" alt="w(k, t) leo nhanh tới khoảng 8 trang, rồi tăng chậm khi các trang hiếm xuất hiện" loading="lazy" /><p class="chu-thich">🧮 w(k, t) leo nhanh tới khoảng 8 trang, rồi tăng chậm khi các trang hiếm xuất hiện</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">let x = 2024;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const NONG = [20, 21, 22], AM = [23, 24, 25, 26, 27], LANH = Array.from({ length: 12 }, (_, i) =&gt; 100 + i);
const REF = Array.from({ length: 2000 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return NONG[q % NONG.length];
  if (p &lt; 970) return AM[q % AM.length];
  return LANH[q % LANH.length];
});
const T = REF.length - 1;
const KS = Array.from({ length: 100 }, (_, i) =&gt; 1 + i * 6);</code></pre></details>
<p>Khoảng 8 trang (nhóm nóng và ấm) phủ 50–170 tham chiếu gần nhất; nhìn xa hơn chỉ thêm những trang hiếm dùng. Đoạn bằng phẳng đó là lý do tập làm việc đổi chậm, và lý do có thể ước lượng nó: thay vì "k tham chiếu gần nhất" (theo dõi quá tốn), cài đặt thật dùng "<strong>các trang được dùng trong τ giây thời gian thực thi vừa qua</strong>" — slide 26.</p>
<p class="pitfall">⚠️ FE2 câu 18: mục tiêu của mô hình tập làm việc = <strong>giảm tỉ lệ lỗi trang bằng cách giữ các trang đang hoạt động của tiến trình trong bộ nhớ</strong>; FE28 câu 9: nó tìm số khung tối thiểu một job cần để chạy <strong>không bị thrashing</strong>. Bài cũ 3.4 có đầy đủ câu chuyện thrashing.</p>`],
      [26, 'Working Set Algorithm (2)',
        `<p class="y-chinh">🎯 Figure 3-19, the <strong>working set algorithm</strong>: each page table entry holds the <strong>time of last use</strong> and the R bit; the current virtual time is 2204. At a page fault the OS scans all pages: R = 1 → set the time of last use to the current virtual time; R = 0 and age > τ → remove this page; R = 0 and age ≤ τ → remember the page with the smallest time.</p>
<p><strong>Current virtual time</strong> = the CPU time the process has actually used since it started (time while other processes run does not count). Age = current virtual time − time of last use. A page whose age exceeds τ has fallen out of the working set and is a good victim. The book gives no τ; with τ = 600 the scan of the figure's eight pages goes like this:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8a755dbe39473ef2cee9463eeef2330b9898f9d0.svg" alt="The working set scan at virtual time 2204, τ = 600: the page last used at 1213 is removed" loading="lazy" /><p class="chu-thich">🧮 The working set scan at virtual time 2204, τ = 600: the page last used at 1213 is removed</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const HIEN_TAI = 2204, TAU = 600;
const BANG = [[2084, 1], [2003, 1], [1980, 1], [1213, 0], [2014, 1], [2020, 1], [2032, 1], [1620, 0]].map(([dung, R], i) =&gt; ({ trang: i, dung, R }));
// vòng WSClock theo chiều kim đồng hồ từ đỉnh (Hình 3-20): 1620, 2032, 2020, 2014, 1213, 1980, 2003, 2084
const VONG = [[1620, 0], [2032, 1], [2020, 1], [2014, 1], [1213, 0], [1980, 1], [2003, 1], [2084, 1]].map(([dung, R]) =&gt; ({ dung, R, M: 0 }));</code></pre></details>
<p>Page 1213 is out of the working set (age 991 > 600) and is evicted. Page 1620 (age 584) is still inside the working set; if no page had been older than τ, the oldest such R = 0 page would be evicted. If all pages had R = 1 — every page in the working set — one is chosen at random, preferably a clean one. The R bits are cleared on every clock tick, so R = 1 means "used during the current tick". The weakness: <strong>the whole page table is scanned at every fault</strong> — slide 27 fixes it.</p>
<p class="meo">🧠 Working set algorithm = "evict a page not used in the last τ of my own CPU time". τ spans several clock ticks.</p>`,
        `<p class="y-chinh">🎯 Hình 3-19, <strong>thuật toán tập làm việc</strong>: mỗi mục bảng trang giữ <strong>thời điểm dùng cuối (time of last use)</strong> và bit R; thời điểm ảo hiện tại là 2204. Khi lỗi trang, HĐH quét mọi trang: R = 1 → ghi thời điểm dùng cuối bằng thời điểm ảo hiện tại; R = 0 và tuổi > τ → loại trang này; R = 0 và tuổi ≤ τ → nhớ trang có thời điểm nhỏ nhất.</p>
<p><strong>Thời điểm ảo hiện tại (current virtual time)</strong> = thời gian CPU mà tiến trình thật sự đã dùng từ lúc bắt đầu (lúc các tiến trình khác chạy thì không tính). Tuổi = thời điểm ảo hiện tại − thời điểm dùng cuối. Trang có tuổi vượt τ đã rơi khỏi tập làm việc và là nạn nhân tốt. Sách không cho τ; với τ = 600, việc quét tám trang của hình diễn ra thế này:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/268c8668ad5052f6e86df1007c32331cdbf1020a.svg" alt="Quét working set ở thời điểm ảo 2204, τ = 600: trang dùng cuối lúc 1213 bị loại" loading="lazy" /><p class="chu-thich">🧮 Quét working set ở thời điểm ảo 2204, τ = 600: trang dùng cuối lúc 1213 bị loại</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const HIEN_TAI = 2204, TAU = 600;
const BANG = [[2084, 1], [2003, 1], [1980, 1], [1213, 0], [2014, 1], [2020, 1], [2032, 1], [1620, 0]].map(([dung, R], i) =&gt; ({ trang: i, dung, R }));
// vòng WSClock theo chiều kim đồng hồ từ đỉnh (Hình 3-20): 1620, 2032, 2020, 2014, 1213, 1980, 2003, 2084
const VONG = [[1620, 0], [2032, 1], [2020, 1], [2014, 1], [1213, 0], [1980, 1], [2003, 1], [2084, 1]].map(([dung, R]) =&gt; ({ dung, R, M: 0 }));</code></pre></details>
<p>Trang 1213 đã ra khỏi tập làm việc (tuổi 991 > 600) và bị đuổi. Trang 1620 (tuổi 584) vẫn trong tập làm việc; nếu không trang nào già hơn τ, trang R = 0 cũ nhất như vậy sẽ bị đuổi. Nếu mọi trang đều có R = 1 — tất cả trong tập làm việc — chọn ngẫu nhiên một trang, ưu tiên trang sạch. Bit R bị xoá ở mỗi nhịp đồng hồ, nên R = 1 nghĩa là "được dùng trong nhịp hiện tại". Điểm yếu: <strong>phải quét cả bảng trang ở mỗi lần lỗi</strong> — slide 27 chữa việc đó.</p>
<p class="meo">🧠 Thuật toán tập làm việc = "đuổi trang không được dùng trong τ thời gian CPU gần nhất của chính tôi". τ dài bằng vài nhịp đồng hồ.</p>`],
      [27, 'WSClock Algorithm (1)',
        `<p class="y-chinh">🎯 Figure 3-20 (a)–(b), <strong>WSClock</strong>: the working set algorithm organized as a <strong>clock</strong> — a circular list of page frames, each entry with its time of last use and R bit. At a page fault the page under the hand is examined first. Here R = 1 (page 2014): it was used during the current tick, so it is not a good candidate — R is set to 0, the hand advances, and the algorithm repeats with the next page.</p>
<p>WSClock keeps the working set idea (age compared with τ) but replaces the full scan by a hand that stops as soon as it finds a victim — simple to implement and good in performance, which is why the book calls it the algorithm widely used in practice. Same eight pages and τ = 600 as on slide 26:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c4a0198bee66f7fbc328518bc601d8cf0cb84989.svg" alt="WSClock, hand on 2014 with R = 1: clear R, move on" loading="lazy" /><p class="chu-thich">🧮 WSClock, hand on 2014 with R = 1: clear R, move on</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const HIEN_TAI = 2204, TAU = 600;
const BANG = [[2084, 1], [2003, 1], [1980, 1], [1213, 0], [2014, 1], [2020, 1], [2032, 1], [1620, 0]].map(([dung, R], i) =&gt; ({ trang: i, dung, R }));
// vòng WSClock theo chiều kim đồng hồ từ đỉnh (Hình 3-20): 1620, 2032, 2020, 2014, 1213, 1980, 2003, 2084
const VONG = [[1620, 0], [2032, 1], [2020, 1], [2014, 1], [1213, 0], [1980, 1], [2003, 1], [2084, 1]].map(([dung, R]) =&gt; ({ dung, R, M: 0 }));</code></pre></details>
<p>Note: Figure 3-20(b) leaves the time field at 2014 after clearing R, and the simulator keeps it that way; an implementation may also record the current time there, as the plain working set algorithm does — the decision on this fault is the same.</p>
<p class="meo">🧠 WSClock = clock (a hand, no moving pages) + working set (age vs τ) + care for dirty pages (slide 28).</p>`,
        `<p class="y-chinh">🎯 Hình 3-20 (a)–(b), <strong>WSClock</strong>: thuật toán tập làm việc tổ chức thành <strong>đồng hồ</strong> — danh sách vòng các khung trang, mỗi mục có thời điểm dùng cuối và bit R. Khi lỗi trang, trang dưới kim được xét trước. Ở đây R = 1 (trang 2014): nó được dùng trong nhịp hiện tại nên không phải ứng viên tốt — R bị đặt về 0, kim tiến, và thuật toán lặp lại với trang kế.</p>
<p>WSClock giữ ý tưởng tập làm việc (so tuổi với τ) nhưng thay việc quét cả bảng bằng một cây kim dừng ngay khi tìm được nạn nhân — cài đặt đơn giản và hiệu năng tốt, vì thế sách gọi nó là thuật toán được dùng rộng rãi trong thực tế. Cùng tám trang và τ = 600 như slide 26:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/79d82d7ccc9f0f206db73046a40c718530b14394.svg" alt="WSClock, kim ở 2014 với R = 1: xoá R, đi tiếp" loading="lazy" /><p class="chu-thich">🧮 WSClock, kim ở 2014 với R = 1: xoá R, đi tiếp</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const HIEN_TAI = 2204, TAU = 600;
const BANG = [[2084, 1], [2003, 1], [1980, 1], [1213, 0], [2014, 1], [2020, 1], [2032, 1], [1620, 0]].map(([dung, R], i) =&gt; ({ trang: i, dung, R }));
// vòng WSClock theo chiều kim đồng hồ từ đỉnh (Hình 3-20): 1620, 2032, 2020, 2014, 1213, 1980, 2003, 2084
const VONG = [[1620, 0], [2032, 1], [2020, 1], [2014, 1], [1213, 0], [1980, 1], [2003, 1], [2084, 1]].map(([dung, R]) =&gt; ({ dung, R, M: 0 }));</code></pre></details>
<p>Lưu ý: Hình 3-20(b) vẫn ghi 2014 ở ô thời điểm sau khi xoá R, và bộ mô phỏng giữ nguyên như vậy; một cài đặt cũng có thể ghi thời điểm hiện tại vào đó, như thuật toán tập làm việc thường — quyết định ở lần lỗi này không đổi.</p>
<p class="meo">🧠 WSClock = clock (một cây kim, không dời trang) + working set (tuổi so với τ) + chăm lo trang bẩn (slide 28).</p>`],
      [28, 'WSClock Algorithm (2)',
        `<p class="y-chinh">🎯 Figure 3-20 (c)–(d): now the hand is on page 1213 with <strong>R = 0</strong>. Its age (2204 − 1213 = 991) is greater than τ, and the page is <strong>clean</strong>: it is not in the working set and a valid copy exists on disk, so the frame is claimed and the new page (time 2204, R = 1) is put there.</p>
<p>The full rule when the hand points to a page with R = 0 and age > τ: if the page is <strong>clean</strong>, evict it; if it is <strong>dirty</strong>, it cannot be claimed immediately (no valid copy on disk) — a write to disk is <strong>scheduled</strong> and the hand moves on, hoping to find a clean page; the write will finish later. What if the hand goes all the way around? (1) At least one write was scheduled: keep moving until a write completes and that page is clean. (2) No write was scheduled: all pages are in the working set — claim any clean page, or the current page if none.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d8e2b474d077496c46ef199d4cadac34d9c7ebb9.svg" alt="WSClock, hand on 1213 with R = 0, age 991 &gt; τ, clean: it is replaced by the new page" loading="lazy" /><p class="chu-thich">🧮 WSClock, hand on 1213 with R = 0, age 991 > τ, clean: it is replaced by the new page</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const HIEN_TAI = 2204, TAU = 600;
const BANG = [[2084, 1], [2003, 1], [1980, 1], [1213, 0], [2014, 1], [2020, 1], [2032, 1], [1620, 0]].map(([dung, R], i) =&gt; ({ trang: i, dung, R }));
// vòng WSClock theo chiều kim đồng hồ từ đỉnh (Hình 3-20): 1620, 2032, 2020, 2014, 1213, 1980, 2003, 2084
const VONG = [[1620, 0], [2032, 1], [2020, 1], [2014, 1], [1213, 0], [1980, 1], [2003, 1], [2084, 1]].map(([dung, R]) =&gt; ({ dung, R, M: 0 }));</code></pre></details>
<p>➕ To avoid hammering the disk, a real implementation limits the number of writes scheduled per pass (say, n pages). Backend analogy: a database buffer pool does the same thing — a background writer cleans dirty pages so that an eviction usually finds a clean one (PostgreSQL's <code>bgwriter</code>).</p>
<p class="pitfall">⚠️ In WSClock (and every algorithm) a clean page is cheaper to evict than a dirty one: no disk write. That is the role of the M bit — NRU uses it in its classes, WSClock uses it to schedule writes.</p>`,
        `<p class="y-chinh">🎯 Hình 3-20 (c)–(d): giờ kim chỉ trang 1213 với <strong>R = 0</strong>. Tuổi của nó (2204 − 1213 = 991) lớn hơn τ, và trang <strong>sạch</strong>: nó không thuộc tập làm việc và trên đĩa có bản sao hợp lệ, nên khung được lấy và trang mới (thời điểm 2204, R = 1) được đặt vào đó.</p>
<p>Luật đầy đủ khi kim chỉ trang có R = 0 và tuổi > τ: nếu trang <strong>sạch</strong>, đuổi nó; nếu trang <strong>bẩn</strong>, chưa lấy ngay được (trên đĩa chưa có bản hợp lệ) — một lệnh ghi đĩa được <strong>lên lịch</strong> và kim đi tiếp, mong tìm được trang sạch; việc ghi sẽ xong sau. Nếu kim đi hết một vòng thì sao? (1) Đã lên lịch ít nhất một lệnh ghi: cứ đi tiếp tới khi một lệnh ghi xong và trang đó sạch. (2) Không lên lịch lệnh ghi nào: mọi trang đều trong tập làm việc — lấy một trang sạch bất kỳ, không có thì lấy trang hiện tại.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3c73d6bd6549a13bfea8a0c673abf3a9e80db19d.svg" alt="WSClock, kim ở 1213 với R = 0, tuổi 991 &gt; τ, sạch: bị thay bằng trang mới" loading="lazy" /><p class="chu-thich">🧮 WSClock, kim ở 1213 với R = 0, tuổi 991 > τ, sạch: bị thay bằng trang mới</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const HIEN_TAI = 2204, TAU = 600;
const BANG = [[2084, 1], [2003, 1], [1980, 1], [1213, 0], [2014, 1], [2020, 1], [2032, 1], [1620, 0]].map(([dung, R], i) =&gt; ({ trang: i, dung, R }));
// vòng WSClock theo chiều kim đồng hồ từ đỉnh (Hình 3-20): 1620, 2032, 2020, 2014, 1213, 1980, 2003, 2084
const VONG = [[1620, 0], [2032, 1], [2020, 1], [2014, 1], [1213, 0], [1980, 1], [2003, 1], [2084, 1]].map(([dung, R]) =&gt; ({ dung, R, M: 0 }));</code></pre></details>
<p>➕ Để khỏi dồn dập đĩa, cài đặt thật giới hạn số lệnh ghi được lên lịch mỗi vòng (chẳng hạn n trang). So sánh với backend: vùng đệm của cơ sở dữ liệu làm đúng điều này — một tiến trình ghi nền làm sạch trang bẩn để lần đuổi trang thường gặp được trang sạch (<code>bgwriter</code> của PostgreSQL).</p>
<p class="pitfall">⚠️ Trong WSClock (và mọi thuật toán), đuổi trang sạch rẻ hơn trang bẩn: không phải ghi đĩa. Đó là vai trò của bit M — NRU dùng nó để chia lớp, WSClock dùng nó để lên lịch ghi.</p>`],
      [29, 'Summary of Page Replacement Algorithms',
        `<p class="y-chinh">🎯 Figure 3-21: Optimal — not implementable, useful as a benchmark; NRU — very crude approximation of LRU; FIFO — might throw out important pages; second chance — big improvement over FIFO; clock — realistic; LRU — excellent, but difficult to implement exactly; NFU — fairly crude approximation to LRU; aging — efficient algorithm that approximates LRU well; working set — somewhat expensive to implement; WSClock — good efficient algorithm. (The slide's "Second, chance" is a typo.)</p>
<p>The book's conclusion: the two best algorithms are <strong>aging and WSClock</strong> (based on LRU and on the working set). The simulator puts six of them on the same 400 references with locality, 6 frames:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/97638c9b01f2aaa545b41fb0e3a2139ae6b4b1ff.svg" alt="400 references, 6 frames: OPT 52, LRU 73, aging 75, clock 88, NRU 95, FIFO 110 faults" loading="lazy" /><p class="chu-thich">🧮 400 references, 6 frames: OPT 52, LRU 73, aging 75, clock 88, NRU 95, FIFO 110 faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const GHI = REF.map((trang, i) =&gt; ({ trang, ghi: i % 5 === 4 }));
function chay(f) {
  return [
    ['OPT', thayTrang(REF, f, 'opt').soLoi],
    ['LRU', thayTrang(REF, f, 'lru').soLoi],
    ['Aging', agingThay(REF, f, { nhip: 4 }).soLoi],
    ['Clock / second chance', thayTrang(REF, f, 'clock').soLoi],
    ['NRU', nru(GHI, f, { nhip: 4 }).soLoi],
    ['FIFO', thayTrang(REF, f, 'fifo').soLoi],
  ];
}</code></pre></details>
<p>The ranking is the table's: OPT &lt; LRU ≈ aging &lt; clock/second chance &lt; NRU &lt; FIFO. (With 4 frames NRU happened to beat LRU on this string — real data is noisy, which is why the book speaks of simulations over many programs.) Working set and WSClock are not in the chart because they do not use a fixed number of frames. ➕ And Linux today? It runs an LRU approximation with reference bits; since 6.1 the <strong>multi-generational LRU</strong> (MGLRU) can replace the classic active/inactive lists — and it is switched on in the course kernel:</p>
<div class="out"># Which replacement policy does THIS Linux use? Multi-Gen LRU (since 6.1) on, plus the classic active/inactive lists<br>
$ uname -r<br>
7.0.12-linuxkit<br>
$ cat /sys/kernel/mm/lru_gen/enabled<br>
0x0001<br>
$ grep -E '^(Active|Inactive)\\((anon|file)\\)' /proc/meminfo<br>
Active(anon): &nbsp;&nbsp;&nbsp;&nbsp;957536 kB<br>
Inactive(anon): &nbsp;2164856 kB<br>
Active(file): &nbsp;&nbsp;&nbsp;&nbsp;703496 kB<br>
Inactive(file): &nbsp;2875716 kB</div>
<p class="pitfall">⚠️ FE9 question 19: the primary goal of a page replacement algorithm = <strong>minimize disk I/O</strong> (each fault on a dirty page costs writes and reads). 🧭 Backend: Redis with <code>maxmemory-policy allkeys-lru</code> does exactly this chapter's trade-off — it approximates LRU by sampling a few keys (<code>maxmemory-samples</code>, default 5) instead of keeping an exact LRU list, the same reason the kernel uses clock/aging.</p>`,
        `<p class="y-chinh">🎯 Hình 3-21: Optimal — không cài được, dùng làm chuẩn so; NRU — xấp xỉ LRU rất thô; FIFO — có thể vứt trang quan trọng; second chance — cải thiện lớn so với FIFO; clock — thực tế; LRU — rất tốt, nhưng khó cài chính xác; NFU — xấp xỉ LRU khá thô; aging — thuật toán hiệu quả, xấp xỉ LRU tốt; working set — cài hơi tốn; WSClock — thuật toán tốt, hiệu quả. (Chữ "Second, chance" trên slide là lỗi gõ.)</p>
<p>Kết luận của sách: hai thuật toán tốt nhất là <strong>aging và WSClock</strong> (dựa trên LRU và trên tập làm việc). Bộ mô phỏng đặt sáu thuật toán lên cùng 400 tham chiếu có tính cục bộ, 6 khung:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1ee4b481691565c20d40233b2b98a945db2cca51.svg" alt="400 tham chiếu, 6 khung: OPT 52, LRU 73, aging 75, clock 88, NRU 95, FIFO 110 lỗi" loading="lazy" /><p class="chu-thich">🧮 400 tham chiếu, 6 khung: OPT 52, LRU 73, aging 75, clock 88, NRU 95, FIFO 110 lỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const GHI = REF.map((trang, i) =&gt; ({ trang, ghi: i % 5 === 4 }));
function chay(f) {
  return [
    ['OPT', thayTrang(REF, f, 'opt').soLoi],
    ['LRU', thayTrang(REF, f, 'lru').soLoi],
    ['Aging', agingThay(REF, f, { nhip: 4 }).soLoi],
    ['Clock / second chance', thayTrang(REF, f, 'clock').soLoi],
    ['NRU', nru(GHI, f, { nhip: 4 }).soLoi],
    ['FIFO', thayTrang(REF, f, 'fifo').soLoi],
  ];
}</code></pre></details>
<p>Thứ hạng khớp bảng: OPT &lt; LRU ≈ aging &lt; clock/second chance &lt; NRU &lt; FIFO. (Với 4 khung, NRU tình cờ thắng LRU trên chuỗi này — dữ liệu thật có nhiễu, vì thế sách nói tới mô phỏng trên rất nhiều chương trình.) Working set và WSClock không có trong biểu đồ vì chúng không dùng số khung cố định. ➕ Còn Linux ngày nay? Nó chạy một xấp xỉ LRU bằng bit tham chiếu; từ 6.1, <strong>LRU đa thế hệ (multi-generational LRU — MGLRU)</strong> có thể thay hai danh sách active/inactive cổ điển — và nó đang bật trong nhân của môn:</p>
<div class="out"># Linux NÀY dùng chính sách thay trang nào? Multi-Gen LRU (từ 6.1) đang bật, cùng hai danh sách active/inactive cổ điển<br>
$ uname -r<br>
7.0.12-linuxkit<br>
$ cat /sys/kernel/mm/lru_gen/enabled<br>
0x0001<br>
$ grep -E '^(Active|Inactive)\\((anon|file)\\)' /proc/meminfo<br>
Active(anon): &nbsp;&nbsp;&nbsp;&nbsp;957536 kB<br>
Inactive(anon): &nbsp;2164856 kB<br>
Active(file): &nbsp;&nbsp;&nbsp;&nbsp;703496 kB<br>
Inactive(file): &nbsp;2875716 kB</div>
<p class="pitfall">⚠️ FE9 câu 19: mục tiêu chính của thuật toán thay trang = <strong>giảm thiểu I/O đĩa</strong> (mỗi lần lỗi với trang bẩn tốn cả ghi lẫn đọc). 🧭 Backend: Redis với <code>maxmemory-policy allkeys-lru</code> làm đúng sự đánh đổi của chương này — nó xấp xỉ LRU bằng cách lấy mẫu vài khoá (<code>maxmemory-samples</code>, mặc định 5) thay vì giữ một danh sách LRU chính xác, cùng lý do nhân dùng clock/aging.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 3, sections 3.1–3.4, Figures 3-1 to 3-21', 'Chương 3, mục 3.1–3.4, Hình 3-1 tới 3-21'],
      ['ostep', 'Chapters 13–23: address spaces, base and bounds, free-space management, paging, TLBs, smaller tables, swapping policies', 'Chương 13–23: không gian địa chỉ, base and bounds, quản lý chỗ trống, phân trang, TLB, bảng nhỏ hơn, chính sách swap'],
      ['man7', 'proc(5) (/proc/pid/pagemap, smaps, status), mmap(2), madvise(2), sbrk(2), getrusage(2), malloc(3)', 'proc(5) (/proc/pid/pagemap, smaps, status), mmap(2), madvise(2), sbrk(2), getrusage(2), malloc(3)'],
      ['kernelDocs', 'admin-guide/mm/pagemap.html, admin-guide/mm/transhuge.html, admin-guide/mm/multigen_lru.html, arch/x86/x86_64/5level-paging.html', 'admin-guide/mm/pagemap.html, admin-guide/mm/transhuge.html, admin-guide/mm/multigen_lru.html, arch/x86/x86_64/5level-paging.html'],
      ['mchoes', 'Chapters 2–3 (early memory management, paging, demand paging and replacement policies) — a gentler second explanation', 'Chương 2–3 (quản lý bộ nhớ thời đầu, phân trang, phân trang theo yêu cầu và chính sách thay trang) — cách giảng thứ hai, nhẹ nhàng hơn'],
    ]),
  ].join('\n'),
};

/* ───────── 3.B — 📑 Slide by slide · Memory: paging design, page faults, sharing, segmentation, MULTICS and x86 (slides 30–56) ───────── */
const L_osg3_2 = {
  title: '3.B — 📑 Slide by slide · Memory: paging design, page faults, sharing, segmentation, MULTICS and x86 (slides 30–56)|||3.B — 📑 Học theo từng slide · Bộ nhớ: thiết kế phân trang, lỗi trang, chia sẻ, phân đoạn, MULTICS và x86 (slide 30–56)',
  slug: 'osg202-slide-osg3-2',
  type: 'VIDEO',
  description: 'Giảng đủ 27 slide cuối Chương 3: cấp phát cục bộ và toàn cục, tần suất lỗi trang và nghịch lý Belady, tách không gian lệnh và dữ liệu, trang và thư viện dùng chung, xử lý lỗi trang mười bước, chạy lại lệnh, kho dự phòng (swap), tách chính sách khỏi cơ chế với bộ phân trang ngoài, phân đoạn thuần và bàn cờ, phân đoạn có phân trang của MULTICS và Intel x86 — mỗi hình do bộ mô phỏng tính lại, và chương trình C chạy thật cho thấy giới hạn bộ nhớ của container, copy-on-write sau fork, libc dùng chung, đếm lỗi trang nhẹ và nặng, một lệnh bị lỗi trang rồi chạy lại, bộ phân trang viết ở không gian người dùng, bộ chọn đoạn thật của Linux x86-64 và thanh ghi bộ nhớ riêng của luồng trên ARM64.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.B · deck "Chapter 3 · Memory Management", slides 30–56</span>
<h2>Making paging work in a real OS, and the other road: segmentation</h2>
<p class="lead">Lesson 3.A gave the mechanisms (MMU, page tables, TLB) and the policies (which page to evict). The second half follows sections 3.5–3.7: the design decisions around them (whose pages to take, how many frames, separate code and data, sharing), the implementation (what exactly happens on a page fault, restarting an instruction, where pages live on disk, policy versus mechanism), and segmentation — the alternative that gives each table its own address space — ending with how MULTICS and the Intel x86 combined segments with pages.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>30–34</td><td>3.5 Design issues for paging systems</td><td>compare local and global replacement, explain PFF and Belady, I/D spaces, shared pages, copy-on-write and shared libraries</td></tr>
<tr><td>35–41</td><td>3.6 Implementation issues</td><td>walk through the 10 steps of a page fault, explain instruction backup, swap areas and an external pager</td></tr>
<tr><td>42–46</td><td>3.7.1 Segmentation, 3.7.2 pure segmentation</td><td>translate (segment, offset), compare paging and segmentation, explain checkerboarding</td></tr>
<tr><td>47–55</td><td>3.7.3–3.7.4 MULTICS and Intel x86</td><td>split a MULTICS address, decode an x86 selector, follow selector + offset → linear → physical</td></tr>
</tbody>
</table>
<div class="callout">Older web lessons 3.2 (thrashing, Belady) and 3.4 (working set, frame allocation, PFF, OOM killer) stay below as summaries; this lesson adds the figures and real runs.</div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.B · deck "Chapter 3 · Memory Management", slide 30–56</span>
<h2>Cho phân trang chạy được trong HĐH thật, và con đường còn lại: phân đoạn</h2>
<p class="lead">Bài 3.A đã cho cơ chế (MMU, bảng trang, TLB) và chính sách (đuổi trang nào). Nửa sau đi theo mục 3.5–3.7: các quyết định thiết kế quanh chúng (lấy trang của ai, bao nhiêu khung, tách mã và dữ liệu, chia sẻ), phần cài đặt (chính xác điều gì xảy ra khi lỗi trang, chạy lại một lệnh, trang nằm ở đâu trên đĩa, chính sách và cơ chế), và phân đoạn — lối đi khác, cho mỗi bảng một không gian địa chỉ riêng — kết thúc bằng cách MULTICS và Intel x86 kết hợp đoạn với trang.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>30–34</td><td>3.5 Vấn đề thiết kế của hệ phân trang</td><td>so sánh thay cục bộ và toàn cục, giải thích PFF và Belady, không gian I/D, trang dùng chung, copy-on-write và thư viện dùng chung</td></tr>
<tr><td>35–41</td><td>3.6 Vấn đề cài đặt</td><td>đi qua 10 bước của một lỗi trang, giải thích chạy lại lệnh, vùng swap và bộ phân trang ngoài</td></tr>
<tr><td>42–46</td><td>3.7.1 Phân đoạn, 3.7.2 phân đoạn thuần</td><td>dịch (đoạn, độ dời), so sánh phân trang và phân đoạn, giải thích bàn cờ</td></tr>
<tr><td>47–55</td><td>3.7.3–3.7.4 MULTICS và Intel x86</td><td>tách địa chỉ MULTICS, giải mã bộ chọn x86, lần theo bộ chọn + độ dời → tuyến tính → vật lý</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ 3.2 (thrashing, Belady) và 3.4 (tập làm việc, cấp phát khung, PFF, OOM killer) vẫn ở phía dưới làm bản tóm tắt; bài này bổ sung các hình và lần chạy thật.</div>`),
    walkHead('osg3', 30, 56),
    walk('osg3', [
      [30, 'Local versus Global Allocation Policies (1)',
        `<p class="y-chinh">🎯 Figure 3-22: (a) three processes A, B, C with an age value next to each page; A gets a fault on page A6. (b) <strong>Local</strong> page replacement looks only at A's six pages and evicts A5 (age 3). (c) <strong>Global</strong> page replacement looks at all pages in memory and evicts B3 (age 2), the oldest of all.</p>
<p>The age values come from an LRU approximation such as aging (slide 24): smallest = least recently used. Local algorithms give each process a <strong>fixed</strong> number of frames; global algorithms let the number of frames per process <strong>change dynamically</strong>. The simulator recomputes both choices from the figure's data:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fc3d417eb21a1435b7a8c7bdd7f151c67d28220a.svg" alt="Local replacement takes A5 from A itself; global replacement takes B3 from B" loading="lazy" /><p class="chu-thich">🧮 Local replacement takes A5 from A itself; global replacement takes B3 from B</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TRANG = [['A0', 10], ['A1', 7], ['A2', 5], ['A3', 4], ['A4', 6], ['A5', 3], ['B0', 9], ['B1', 4], ['B2', 6], ['B3', 2],
  ['B4', 5], ['B5', 6], ['B6', 12], ['C1', 3], ['C2', 5], ['C3', 6]];
const nhoNhat = (ds) =&gt; ds.reduce((a, b) =&gt; (b[1] &lt; a[1] ? b : a));
const cucBo = nhoNhat(TRANG.filter(([p]) =&gt; p[0] === 'A'))[0];
const toanCuc = nhoNhat(TRANG)[0];</code></pre></details>
<p>Global algorithms work better in general, especially when working set sizes change during a run: with a local policy, a growing process thrashes even if memory is free elsewhere, and a shrinking one wastes frames. But a global policy needs a way to decide how many frames each process deserves — equal shares, shares <strong>proportional to process size</strong>, or the PFF algorithm of slide 31 — and it lets one greedy process steal frames from everyone. ➕ Linux replaces pages globally across the whole machine, but containers add a <strong>local limit</strong>: each cgroup has its own <code>memory.max</code>, and when a container hits it, the kernel reclaims (or OOM-kills) inside that container only:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m --memory-swap=64m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># The whole machine replaces pages GLOBALLY, but a container gets its own LOCAL limit (cgroup v2)<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ cat /sys/fs/cgroup/memory.max<br>
67108864<br>
$ echo $(( $(cat /sys/fs/cgroup/memory.max) / 1024 / 1024 )) MB<br>
64 MB<br>
$ cat /sys/fs/cgroup/memory.swap.max<br>
0</div>
<p class="meo">🧠 🧭 On a real server: Kubernetes "limits.memory" and <code>docker run --memory</code> are this local policy. A JVM in a container must size its heap to the cgroup limit, not to the host's RAM — modern JDKs read the cgroup limit automatically (<code>-XX:MaxRAMPercentage</code>).</p>`,
        `<p class="y-chinh">🎯 Hình 3-22: (a) ba tiến trình A, B, C, cạnh mỗi trang là một giá trị tuổi (age); A bị lỗi trang ở trang A6. (b) Thay trang <strong>cục bộ (local)</strong> chỉ xét sáu trang của A và đuổi A5 (age 3). (c) Thay trang <strong>toàn cục (global)</strong> xét mọi trang trong bộ nhớ và đuổi B3 (age 2), trang cũ nhất trong tất cả.</p>
<p>Giá trị age đến từ một xấp xỉ LRU như aging (slide 24): nhỏ nhất = lâu nhất chưa dùng. Thuật toán cục bộ cho mỗi tiến trình một số khung <strong>cố định</strong>; thuật toán toàn cục để số khung của mỗi tiến trình <strong>thay đổi động</strong>. Bộ mô phỏng tính lại hai lựa chọn từ dữ liệu của hình:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/91bcb8d41efa73dc76e1a614c72998f243c087b8.svg" alt="Thay cục bộ lấy A5 của chính A; thay toàn cục lấy B3 của B" loading="lazy" /><p class="chu-thich">🧮 Thay cục bộ lấy A5 của chính A; thay toàn cục lấy B3 của B</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TRANG = [['A0', 10], ['A1', 7], ['A2', 5], ['A3', 4], ['A4', 6], ['A5', 3], ['B0', 9], ['B1', 4], ['B2', 6], ['B3', 2],
  ['B4', 5], ['B5', 6], ['B6', 12], ['C1', 3], ['C2', 5], ['C3', 6]];
const nhoNhat = (ds) =&gt; ds.reduce((a, b) =&gt; (b[1] &lt; a[1] ? b : a));
const cucBo = nhoNhat(TRANG.filter(([p]) =&gt; p[0] === 'A'))[0];
const toanCuc = nhoNhat(TRANG)[0];</code></pre></details>
<p>Nói chung thuật toán toàn cục chạy tốt hơn, nhất là khi kích thước tập làm việc thay đổi trong lúc chạy: với chính sách cục bộ, tiến trình đang lớn bị thrashing dù chỗ khác còn bộ nhớ trống, còn tiến trình đang nhỏ lại thì phí khung. Nhưng chính sách toàn cục cần một cách quyết định mỗi tiến trình đáng được bao nhiêu khung — chia đều, chia <strong>tỉ lệ theo kích thước tiến trình</strong>, hay thuật toán PFF của slide 31 — và nó cho phép một tiến trình tham lam giành khung của mọi người. ➕ Linux thay trang toàn cục trên cả máy, nhưng container thêm một <strong>giới hạn cục bộ</strong>: mỗi cgroup có <code>memory.max</code> riêng, và khi container chạm tới đó, nhân chỉ thu hồi (hoặc OOM-kill) trong chính container đó:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m --memory-swap=64m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Cả máy thay trang TOÀN CỤC, nhưng mỗi container có giới hạn CỤC BỘ riêng (cgroup v2)<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ cat /sys/fs/cgroup/memory.max<br>
67108864<br>
$ echo $(( $(cat /sys/fs/cgroup/memory.max) / 1024 / 1024 )) MB<br>
64 MB<br>
$ cat /sys/fs/cgroup/memory.swap.max<br>
0</div>
<p class="meo">🧠 🧭 Trên server thật: "limits.memory" của Kubernetes và <code>docker run --memory</code> chính là chính sách cục bộ này. JVM trong container phải đặt cỡ heap theo giới hạn cgroup, không theo RAM của máy chủ — JDK hiện đại tự đọc giới hạn cgroup (<code>-XX:MaxRAMPercentage</code>).</p>`],
      [31, 'Local versus Global Allocation Policies (2)',
        `<p class="y-chinh">🎯 Figure 3-23: the <strong>page fault rate</strong> as a function of the <strong>number of page frames assigned</strong>: it drops steeply at first, then flattens. Line A marks an unacceptably high fault rate, line B a rate so low that the process probably has more memory than it needs.</p>
<p>This curve is the basis of the <strong>PFF (page fault frequency)</strong> algorithm: measure each process's fault rate (for example faults per second, or faults per reference); above A → give the process more frames; below B → take some away and give them to others. PFF tells <strong>how many</strong> frames a process should have, not which page to replace. The simulator measures the curve with LRU on 400 references:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c3cc744359e3a9145f329d2505cec91328a19bc3.svg" alt="Fault rate vs frames with the PFF thresholds A = 30% and B = 10%: 5 to 10 frames is the comfortable zone" loading="lazy" /><p class="chu-thich">🧮 Fault rate vs frames with the PFF thresholds A = 30% and B = 10%: 5 to 10 frames is the comfortable zone</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const A = 30, B = 10;</code></pre></details>
<p>If the sum of all processes' needs exceeds memory even after PFF, the system thrashes — the only cure is to <strong>reduce the number of processes</strong> competing (swap some out entirely). ➕ One exception to "more frames, fewer faults": with FIFO, the fault count can <strong>increase</strong> when frames are added — <strong>Belady's anomaly</strong>:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/93ab4e788feebbe0ef58137d40718539b838186b.svg" alt="Belady's anomaly: FIFO 9 faults with 3 frames, 10 with 4 frames; LRU never goes up" loading="lazy" /><p class="chu-thich">🧮 Belady's anomaly: FIFO 9 faults with 3 frames, 10 with 4 frames; LRU never goes up</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const A = 30, B = 10;</code></pre></details>
<p>LRU and OPT are <strong>stack algorithms</strong>: the set of pages in memory with n frames is always a subset of the set with n + 1 frames, so adding frames can never add faults. FIFO is not.</p>
<p class="pitfall">⚠️ FE4 q19 = FE12 q19 = FE13 q20: the algorithm whose fault rate can increase with more frames = <strong>FIFO</strong>. FE7 q21: Belady happens <strong>when the number of frames allocated to a process increases</strong>. FE9 q17: thrashing = a process <strong>spends more time paging than executing</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 3-23: <strong>tỉ lệ lỗi trang</strong> theo <strong>số khung trang được cấp</strong>: lúc đầu giảm dốc, sau đó thoải dần. Đường A đánh dấu tỉ lệ lỗi cao không chấp nhận được, đường B đánh dấu tỉ lệ thấp tới mức có lẽ tiến trình đang có nhiều bộ nhớ hơn nó cần.</p>
<p>Đường cong này là nền của thuật toán <strong>PFF (page fault frequency — tần suất lỗi trang)</strong>: đo tỉ lệ lỗi của từng tiến trình (chẳng hạn số lỗi mỗi giây, hoặc số lỗi trên mỗi tham chiếu); trên A → cấp thêm khung cho tiến trình; dưới B → thu bớt khung đưa cho tiến trình khác. PFF cho biết tiến trình nên có <strong>bao nhiêu</strong> khung, không cho biết thay trang nào. Bộ mô phỏng đo đường cong với LRU trên 400 tham chiếu:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4c0306a77b358c86ad696d0ec4f38650a5bf0c79.svg" alt="Tỉ lệ lỗi theo số khung với ngưỡng PFF A = 30% và B = 10%: 5 tới 10 khung là vùng dễ chịu" loading="lazy" /><p class="chu-thich">🧮 Tỉ lệ lỗi theo số khung với ngưỡng PFF A = 30% và B = 10%: 5 tới 10 khung là vùng dễ chịu</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const A = 30, B = 10;</code></pre></details>
<p>Nếu tổng nhu cầu của mọi tiến trình vẫn vượt bộ nhớ dù đã có PFF, hệ thống bị thrashing — cách chữa duy nhất là <strong>giảm số tiến trình</strong> đang tranh nhau (đẩy hẳn một số ra đĩa). ➕ Một ngoại lệ của "thêm khung, bớt lỗi": với FIFO, số lỗi có thể <strong>tăng</strong> khi thêm khung — <strong>nghịch lý Belady (Belady's anomaly)</strong>:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/846a127fd41d868da1d655024adc46f70a2af92f.svg" alt="Nghịch lý Belady: FIFO 9 lỗi với 3 khung, 10 lỗi với 4 khung; LRU không bao giờ tăng" loading="lazy" /><p class="chu-thich">🧮 Nghịch lý Belady: FIFO 9 lỗi với 3 khung, 10 lỗi với 4 khung; LRU không bao giờ tăng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const A = 30, B = 10;</code></pre></details>
<p>LRU và OPT là <strong>thuật toán ngăn xếp (stack algorithm)</strong>: tập trang trong bộ nhớ với n khung luôn là tập con của tập trang với n + 1 khung, nên thêm khung không bao giờ thêm lỗi. FIFO thì không như vậy.</p>
<p class="pitfall">⚠️ FE4 c19 = FE12 c19 = FE13 c20: thuật toán mà tỉ lệ lỗi có thể tăng khi thêm khung = <strong>FIFO</strong>. FE7 c21: Belady xảy ra <strong>khi số khung cấp cho tiến trình tăng lên</strong>. FE9 c17: thrashing = tiến trình <strong>tốn thời gian phân trang nhiều hơn thực thi</strong>.</p>`],
      [32, 'Separate Instruction and Data Spaces',
        `<p class="y-chinh">🎯 Figure 3-24: (a) <strong>one address space</strong> (2³² bytes here) holding both the program and its data; (b) <strong>separate I and D spaces</strong>: an instruction space for the program text and a data space for the data, each going from 0 to its own maximum, each with its own page table.</p>
<p>Separate spaces were invented (PDP-11) to double the usable address space: when an address space is too small, give code and data one each. The linker must know which addresses are in which space; the hardware uses the I-space page table for instruction fetches and the D-space table for data references. Both spaces are paged independently. ➕ Today address spaces are huge, so separate I and D <em>address spaces</em> disappeared, but the idea survives in two forms: L1 caches and TLBs are split into instruction and data halves, and pages carry <strong>execute permission</strong> separately from write permission (W^X: no page is both writable and executable):</p>
<pre><code class="language-c">// Separate I and D today: code pages are r-x, data pages rw- — writing into your own code is a protection fault
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int data = 1;

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    FILE *f = fopen("/proc/self/maps", "r");
    char line[512];
    while (fgets(line, sizeof line, f))                  // only the mappings of our own executable
        if (strstr(line, "/ghi-vao-ma")) { char *sp = strchr(line, ' '); printf("%.*s%.6s %s", (int)(sp - line), line, sp, strrchr(line, '/') + 1); }
    fclose(f);
    printf("writing to data:  ok, data = %d\\n", ++data);
    unsigned char *code = (unsigned char *)main;
    printf("writing to the code of main() ...\\n");
    code[0] = 0;                                         // the page is r-x: the MMU refuses
    printf("never printed\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ghi-vao-ma.c -o ghi-vao-ma &amp;&amp; ./ghi-vao-ma<br>
aaaacec10000-aaaacec11000 r-xp &nbsp;ghi-vao-ma<br>
aaaacec2f000-aaaacec30000 r--p &nbsp;ghi-vao-ma<br>
aaaacec30000-aaaacec31000 rw-p &nbsp;ghi-vao-ma<br>
writing to data: &nbsp;ok, data = 2<br>
writing to the code of main() ...<br>
Segmentation fault<br>
[exit code 139]</div>
<p>The program's own mappings: code <code>r-xp</code> (read + execute, no write), read-only data <code>r--p</code>, writable data <code>rw-p</code>. Writing a global variable works; writing one byte into the code of <code>main</code> is a protection fault (signal 11, exit code 139). This separation is what stops many attacks from injecting machine code into a program — Chapter 9.</p>
<p class="meo">🧠 The <code>p</code> at the end of <code>r-xp</code> means <strong>private</strong> (copy-on-write, slide 33); <code>s</code> would mean shared.</p>`,
        `<p class="y-chinh">🎯 Hình 3-24: (a) <strong>một không gian địa chỉ</strong> (ở đây 2³² byte) chứa cả chương trình lẫn dữ liệu; (b) <strong>không gian lệnh và dữ liệu riêng (separate I and D spaces)</strong>: một không gian lệnh cho mã chương trình và một không gian dữ liệu cho dữ liệu, mỗi cái đi từ 0 tới mức tối đa riêng, mỗi cái một bảng trang riêng.</p>
<p>Không gian riêng được nghĩ ra (máy PDP-11) để nhân đôi không gian địa chỉ dùng được: khi không gian địa chỉ quá nhỏ, cho mã một cái và dữ liệu một cái. Trình liên kết phải biết địa chỉ nào thuộc không gian nào; phần cứng dùng bảng trang của không gian I khi nạp lệnh và bảng của không gian D khi truy cập dữ liệu. Hai không gian được phân trang độc lập. ➕ Ngày nay không gian địa chỉ rất lớn nên <em>không gian địa chỉ</em> I và D riêng đã biến mất, nhưng ý tưởng còn sống dưới hai dạng: cache L1 và TLB được tách thành nửa lệnh và nửa dữ liệu, và trang mang <strong>quyền thực thi</strong> tách khỏi quyền ghi (W^X: không trang nào vừa ghi được vừa thực thi được):</p>
<pre><code class="language-c">// Tách I và D ngày nay: trang mã là r-x, trang dữ liệu rw- — ghi vào chính mã của mình là lỗi bảo vệ
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int data = 1;

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    FILE *f = fopen("/proc/self/maps", "r");
    char line[512];
    while (fgets(line, sizeof line, f))                  // chỉ các vùng của chính tệp thực thi
        if (strstr(line, "/ghi-vao-ma")) { char *sp = strchr(line, ' '); printf("%.*s%.6s %s", (int)(sp - line), line, sp, strrchr(line, '/') + 1); }
    fclose(f);
    printf("writing to data:  ok, data = %d\\n", ++data);
    unsigned char *code = (unsigned char *)main;
    printf("writing to the code of main() ...\\n");
    code[0] = 0;                                         // trang là r-x: MMU từ chối
    printf("never printed\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ghi-vao-ma.c -o ghi-vao-ma &amp;&amp; ./ghi-vao-ma<br>
aaaacec10000-aaaacec11000 r-xp &nbsp;ghi-vao-ma<br>
aaaacec2f000-aaaacec30000 r--p &nbsp;ghi-vao-ma<br>
aaaacec30000-aaaacec31000 rw-p &nbsp;ghi-vao-ma<br>
writing to data: &nbsp;ok, data = 2<br>
writing to the code of main() ...<br>
Segmentation fault<br>
[exit code 139]</div>
<p>Các vùng của chính chương trình: mã <code>r-xp</code> (đọc + thực thi, không ghi), dữ liệu chỉ đọc <code>r--p</code>, dữ liệu ghi được <code>rw-p</code>. Ghi vào biến toàn cục thì được; ghi một byte vào mã của <code>main</code> là lỗi bảo vệ (tín hiệu 11, mã thoát 139). Sự tách biệt này chặn được nhiều kiểu tấn công chèn mã máy vào chương trình — Chương 9.</p>
<p class="meo">🧠 Chữ <code>p</code> cuối <code>r-xp</code> nghĩa là <strong>private (riêng)</strong> (copy-on-write, slide 33); <code>s</code> sẽ là shared (dùng chung).</p>`],
      [33, 'Shared Pages',
        `<p class="y-chinh">🎯 Figure 3-25: two processes running the same program <strong>share its pages</strong> — even its page table for the program part — while each has its own data pages (Data 1, Data 2).</p>
<p>Sharing read-only pages such as program text is easy and saves a lot of memory (hundreds of users running the same editor). Data pages are trickier. The book's problem: if process A is swapped out or terminates and its pages are evicted, process B, which shares them, suddenly faults — so the OS must know which pages are shared (a separate data structure, because searching all page tables would be too slow). Sharing data is also possible: after a <code>fork</code>, parent and child share all pages, all marked <strong>read-only</strong>; the first time either one writes to a page, a trap occurs and the OS makes a private copy of that one page. This is <strong>copy-on-write</strong> (COW) — pages never written are never copied. Measured for real, counting page faults with <code>getrusage</code>:</p>
<pre><code class="language-c">// Shared pages after fork: parent and child share every page until one of them WRITES (copy-on-write)
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;
#define PAGES 1000

static long faults(void) { struct rusage u; getrusage(RUSAGE_SELF, &amp;u); return u.ru_minflt; }   // minor page faults so far
static long r10(long n) { return (n + 5) / 10 * 10; }    // to the nearest 10: the C library itself adds a fault or two

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    char *a = mmap(NULL, PAGES * 4096L, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(a, PAGES * 4096L, MADV_NOHUGEPAGE);
    long f = faults();
    for (int i = 0; i &lt; PAGES; i++) a[i * 4096] = 1;
    printf("parent: first write to %d pages   -&gt; ~%ld page faults (one per page: demand paging)\\n", PAGES, r10(faults() - f));
    f = faults();
    for (int i = 0; i &lt; PAGES; i++) a[i * 4096] = 2;
    printf("parent: write them again          -&gt; ~%ld page faults\\n", r10(faults() - f));
    if (fork() == 0) {
        long g = faults(), s = 0;
        for (int i = 0; i &lt; PAGES; i++) s += a[i * 4096];
        printf("child : first read of %d pages    -&gt; ~%ld page faults (sum %ld)\\n", PAGES, r10(faults() - g), s);
        g = faults();
        for (int i = 0; i &lt; PAGES; i++) s += a[i * 4096];
        printf("child : read them again           -&gt; ~%ld page faults\\n", r10(faults() - g));
        g = faults();
        for (int i = 0; i &lt; PAGES; i++) a[i * 4096] = 3;
        printf("child : write %d shared pages     -&gt; ~%ld page faults (each one = copy the page)\\n", PAGES, r10(faults() - g));
        _exit(0);
    }
    wait(NULL);
    printf("parent: my pages still hold %d — the child wrote to its own copies\\n", a[0]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cow.c -o cow &amp;&amp; ./cow<br>
parent: first write to 1000 pages &nbsp;&nbsp;-&gt; ~1000 page faults (one per page: demand paging)<br>
parent: write them again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ~0 page faults<br>
child : first read of 1000 pages &nbsp;&nbsp;&nbsp;-&gt; ~1000 page faults (sum 2000)<br>
child : read them again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ~0 page faults<br>
child : write 1000 shared pages &nbsp;&nbsp;&nbsp;&nbsp;-&gt; ~1000 page faults (each one = copy the page)<br>
parent: my pages still hold 2 — the child wrote to its own copies</div>
<p>Writing 1,000 pages after <code>fork</code> costs the child <strong>1,000 faults — one copy per page</strong>, while the parent still sees its own values: the copies are private. Two more details are real Linux: the child's first <em>read</em> also faulted 1,000 times because the kernel marks every copied entry "not referenced" in the child (<code>pte_mkold</code> in <code>mm/memory.c</code>), and on this ARM64 virtual machine the first access to such an entry traps so the kernel can set the access flag (R bit) — on CPUs that set the R bit in hardware, such as x86-64, those reads cost no fault. Reading a second time: 0 faults.</p>
<p class="meo">🧠 🧭 COW is why <code>fork()</code> of a 2-GB process is fast, why Redis can save a snapshot with <code>BGSAVE</code> (fork, the child writes the data while the parent keeps serving), and why that snapshot can still double memory use if the parent writes heavily during it.</p>`,
        `<p class="y-chinh">🎯 Hình 3-25: hai tiến trình chạy cùng một chương trình <strong>dùng chung các trang</strong> của nó — thậm chí dùng chung cả bảng trang cho phần chương trình — trong khi mỗi tiến trình có trang dữ liệu riêng (Data 1, Data 2).</p>
<p>Chia sẻ trang chỉ đọc như mã chương trình thì dễ và tiết kiệm rất nhiều bộ nhớ (hàng trăm người dùng chạy cùng một trình soạn thảo). Trang dữ liệu khó hơn. Vấn đề của sách: nếu tiến trình A bị đẩy ra hoặc kết thúc và các trang của nó bị đuổi, tiến trình B đang dùng chung chúng bỗng bị lỗi trang — nên HĐH phải biết trang nào đang dùng chung (một cấu trúc dữ liệu riêng, vì duyệt mọi bảng trang thì quá chậm). Chia sẻ dữ liệu cũng làm được: sau <code>fork</code>, cha và con dùng chung mọi trang, tất cả đánh dấu <strong>chỉ đọc</strong>; lần đầu một bên ghi vào một trang, xảy ra bẫy và HĐH tạo bản sao riêng của đúng trang đó. Đây là <strong>copy-on-write (chép khi ghi — COW)</strong> — trang nào không bao giờ bị ghi thì không bao giờ bị chép. Đo thật, đếm lỗi trang bằng <code>getrusage</code>:</p>
<pre><code class="language-c">// Trang dùng chung sau fork: cha và con dùng chung mọi trang cho tới khi một bên GHI (copy-on-write)
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;
#define PAGES 1000

static long faults(void) { struct rusage u; getrusage(RUSAGE_SELF, &amp;u); return u.ru_minflt; }   // số lỗi trang nhẹ tới giờ
static long r10(long n) { return (n + 5) / 10 * 10; }    // làm tròn tới chục: chính thư viện C thỉnh thoảng thêm một hai lỗi

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    char *a = mmap(NULL, PAGES * 4096L, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(a, PAGES * 4096L, MADV_NOHUGEPAGE);
    long f = faults();
    for (int i = 0; i &lt; PAGES; i++) a[i * 4096] = 1;
    printf("parent: first write to %d pages   -&gt; ~%ld page faults (one per page: demand paging)\\n", PAGES, r10(faults() - f));
    f = faults();
    for (int i = 0; i &lt; PAGES; i++) a[i * 4096] = 2;
    printf("parent: write them again          -&gt; ~%ld page faults\\n", r10(faults() - f));
    if (fork() == 0) {
        long g = faults(), s = 0;
        for (int i = 0; i &lt; PAGES; i++) s += a[i * 4096];
        printf("child : first read of %d pages    -&gt; ~%ld page faults (sum %ld)\\n", PAGES, r10(faults() - g), s);
        g = faults();
        for (int i = 0; i &lt; PAGES; i++) s += a[i * 4096];
        printf("child : read them again           -&gt; ~%ld page faults\\n", r10(faults() - g));
        g = faults();
        for (int i = 0; i &lt; PAGES; i++) a[i * 4096] = 3;
        printf("child : write %d shared pages     -&gt; ~%ld page faults (each one = copy the page)\\n", PAGES, r10(faults() - g));
        _exit(0);
    }
    wait(NULL);
    printf("parent: my pages still hold %d — the child wrote to its own copies\\n", a[0]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cow.c -o cow &amp;&amp; ./cow<br>
parent: first write to 1000 pages &nbsp;&nbsp;-&gt; ~1000 page faults (one per page: demand paging)<br>
parent: write them again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ~0 page faults<br>
child : first read of 1000 pages &nbsp;&nbsp;&nbsp;-&gt; ~1000 page faults (sum 2000)<br>
child : read them again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ~0 page faults<br>
child : write 1000 shared pages &nbsp;&nbsp;&nbsp;&nbsp;-&gt; ~1000 page faults (each one = copy the page)<br>
parent: my pages still hold 2 — the child wrote to its own copies</div>
<p>Ghi 1.000 trang sau <code>fork</code> tốn của tiến trình con <strong>1.000 lỗi — mỗi trang một bản sao</strong>, trong khi tiến trình cha vẫn thấy giá trị của mình: các bản sao là riêng. Thêm hai chi tiết của Linux thật: lần <em>đọc</em> đầu tiên của con cũng lỗi 1.000 lần vì nhân đánh dấu mọi mục được chép là "chưa tham chiếu" ở tiến trình con (<code>pte_mkold</code> trong <code>mm/memory.c</code>), và trên máy ảo ARM64 này lần truy cập đầu vào mục như thế bị bẫy để nhân bật cờ truy cập (bit R) — trên CPU tự bật bit R bằng phần cứng, như x86-64, những lần đọc đó không tốn lỗi nào. Đọc lần hai: 0 lỗi.</p>
<p class="meo">🧠 🧭 COW là lý do <code>fork()</code> một tiến trình 2 GB vẫn nhanh, lý do Redis lưu được ảnh chụp bằng <code>BGSAVE</code> (fork, con ghi dữ liệu trong khi cha vẫn phục vụ), và lý do ảnh chụp đó vẫn có thể làm bộ nhớ tăng gấp đôi nếu cha ghi dồn dập trong lúc chụp.</p>`],
      [34, 'Shared Libraries',
        `<p class="y-chinh">🎯 Figure 3-26: a <strong>shared library</strong> used by two processes. One copy sits in RAM; process 1 maps it at virtual address 36K, process 2 at 12K — the same physical pages appear at different virtual addresses.</p>
<p>Every program uses the same standard libraries (I/O, graphics…). Linked statically, each binary would carry its own copy, both on disk and in RAM. With a shared library (Windows calls it a DLL — dynamic link library), the linker includes only a small stub; the library is loaded at run time and shared by all programs that use it. Advantages: smaller executables, one copy in memory, and a bug fix in the library is picked up by every program without relinking. The catch is the figure's: because the library lands at different addresses in different processes, it cannot contain absolute addresses — it is compiled as <strong>position-independent code</strong> (only relative offsets), the same idea as the PIE executable of slide 4. Two processes, two looks at their own maps:</p>
<div class="out"># One copy of libc in RAM, mapped by every process — at a different virtual address each time (ASLR)<br>
$ ldd /bin/cat | grep libc<br>
	libc.so.6 =&gt; /lib/aarch64-linux-gnu/libc.so.6 (0x0000ffffb4680000)<br>
# two separate processes, two looks at their own memory map<br>
$ grep 'libc.so' /proc/self/maps | head -2 | awk '{print $1, $2, $5, $6}'<br>
ffff98970000-ffff98afc000 r-xp 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff98afc000-ffff98b0c000 ---p 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
$ grep 'libc.so' /proc/self/maps | head -2 | awk '{print $1, $2, $5, $6}'<br>
ffff83490000-ffff8361c000 r-xp 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff8361c000-ffff8362c000 ---p 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
# same file (same inode, column 3) but different addresses (column 1)</div>
<p>Both processes map the same file <code>libc.so.6</code> — the same inode, so the same pages in the page cache — but at different virtual addresses (ASLR randomizes them each run). The code part is <code>r-xp</code>: read-only and private, so it can be shared safely; if a process ever wrote to it, copy-on-write would give that process its own copy.</p>
<p class="meo">🧠 <strong>Memory-mapped files</strong> are the general form: <code>mmap</code> a file and its pages become part of your address space, backed by the file itself; shared libraries are just mapped files.</p>`,
        `<p class="y-chinh">🎯 Hình 3-26: một <strong>thư viện dùng chung (shared library)</strong> được hai tiến trình dùng. Một bản nằm trong RAM; tiến trình 1 ánh xạ nó ở địa chỉ ảo 36K, tiến trình 2 ở 12K — cùng các trang vật lý xuất hiện ở những địa chỉ ảo khác nhau.</p>
<p>Chương trình nào cũng dùng các thư viện chuẩn giống nhau (I/O, đồ hoạ…). Liên kết tĩnh thì mỗi tệp thực thi mang một bản riêng, cả trên đĩa lẫn trong RAM. Với thư viện dùng chung (Windows gọi là DLL — dynamic link library), trình liên kết chỉ đưa vào một đoạn mã nhỏ (stub); thư viện được nạp lúc chạy và dùng chung cho mọi chương trình cần nó. Lợi ích: tệp thực thi nhỏ hơn, một bản trong bộ nhớ, và sửa lỗi trong thư viện là mọi chương trình được hưởng mà không phải liên kết lại. Cái khó chính là cái hình nói: vì thư viện rơi vào những địa chỉ khác nhau ở các tiến trình khác nhau, nó không được chứa địa chỉ tuyệt đối — nó được biên dịch thành <strong>mã độc lập vị trí (position-independent code)</strong> (chỉ dùng độ dời tương đối), cùng ý tưởng với tệp PIE ở slide 4. Hai tiến trình, hai lần nhìn bản đồ bộ nhớ của mình:</p>
<div class="out"># Một bản libc trong RAM, mọi tiến trình cùng ánh xạ — mỗi lần ở một địa chỉ ảo khác (ASLR)<br>
$ ldd /bin/cat | grep libc<br>
	libc.so.6 =&gt; /lib/aarch64-linux-gnu/libc.so.6 (0x0000ffffb4680000)<br>
# hai tiến trình riêng, hai lần nhìn bản đồ bộ nhớ của chính chúng<br>
$ grep 'libc.so' /proc/self/maps | head -2 | awk '{print $1, $2, $5, $6}'<br>
ffff98970000-ffff98afc000 r-xp 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff98afc000-ffff98b0c000 ---p 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
$ grep 'libc.so' /proc/self/maps | head -2 | awk '{print $1, $2, $5, $6}'<br>
ffff83490000-ffff8361c000 r-xp 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff8361c000-ffff8362c000 ---p 235186 /usr/lib/aarch64-linux-gnu/libc.so.6<br>
# cùng tệp (cùng inode, cột 3) nhưng khác địa chỉ (cột 1)</div>
<p>Hai tiến trình cùng ánh xạ một tệp <code>libc.so.6</code> — cùng inode, nên cùng các trang trong page cache — nhưng ở những địa chỉ ảo khác nhau (ASLR xáo chúng mỗi lần chạy). Phần mã là <code>r-xp</code>: chỉ đọc và riêng, nên dùng chung an toàn; nếu có tiến trình nào ghi vào nó, copy-on-write sẽ cho tiến trình đó một bản riêng.</p>
<p class="meo">🧠 <strong>Tệp ánh xạ bộ nhớ (memory-mapped file)</strong> là dạng tổng quát: <code>mmap</code> một tệp thì các trang của nó thành một phần không gian địa chỉ của bạn, lấy chính tệp làm chỗ dựa; thư viện dùng chung chỉ là tệp được ánh xạ.</p>`],
      [35, 'Page Fault Handling (1)',
        `<p class="y-chinh">🎯 Steps 1–4 of the 10 steps of page fault handling (book §3.6.2): (1) the hardware traps to the kernel, saving the program counter on the stack; (2) an assembly-code routine saves the general registers and other volatile information; (3) the OS discovers that a page fault has occurred and tries to find which virtual page is needed; (4) once the faulting address is known, it checks that the address is valid and the access consistent with the protection.</p>
<p>Step 1 is pure hardware: on most machines some CPU state (the PC, and sometimes more) is saved by the trap itself. Step 2 cannot be written in C, because C code would itself use the registers that must be saved — so a short assembly routine runs first, then calls a C routine. Step 3: often a hardware register holds the faulting virtual address (CR2 on x86, FAR_EL1 on ARM64); if not, the OS must fetch the PC, read the instruction and work out in software what it was doing when it faulted. Step 4: an invalid address or a protection violation does not load anything — the process gets a signal (SIGSEGV on UNIX) or is killed. The whole sequence as a diagram:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/fda7f8c8eaacd534cf69ad44b0414089cd82a12e.svg" alt="The 10 steps of page fault handling — the faulting instruction runs again at the end" loading="lazy" /><p class="chu-thich">🧩 The 10 steps of page fault handling — the faulting instruction runs again at the end</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' The 10 steps of page fault handling (MOS 4e §3.6.2, slides 35–37)
participant "User program" as U
participant "MMU\\n(hardware)" as M
participant "Kernel: assembly\\nentry + fault handler" as K
participant "Disk" as D
participant "Scheduler" as S
U -&gt; M : load / store to a page\\nwhose present bit = 0
M -&gt; K : 1. TRAP: save the PC\\n2. assembly routine saves registers
K -&gt; K : 3. which virtual page? (faulting address\\nregister: CR2 on x86, FAR_EL1 on ARM64)\\n4. address valid? access allowed?\\n(no ⇒ SIGSEGV) · pick a free frame
alt 5. the chosen frame is dirty (M = 1)
  K -&gt; D : write the old page back
  K -&gt; S : context switch: run another process
  D --&gt; K : write done
end
K -&gt; D : 6. read the needed page from its disk address
K -&gt; S : the faulting process stays blocked
D --&gt; K : 7. disk interrupt: page arrived\\n→ update page table, frame normal
K -&gt; K : 8. back up the faulting instruction,\\nreset the PC
K -&gt; S : 9. faulting process is ready again
K --&gt; U : 10. restore registers, return to user mode:\\nthe SAME instruction runs again, now it hits
@enduml</code></pre></details>
<p class="pitfall">⚠️ FE3 question 19: after the page fault trap, the general-purpose registers and volatile state are saved by an <strong>assembly-language routine</strong> (not the disk controller, not the scheduler). ⚠️ The deck numbers these steps 1–4, then "5, 5, 5", then "8, 8, 8" — the slide numbering is broken; the book's list is 1–10.</p>`,
        `<p class="y-chinh">🎯 Bước 1–4 trong 10 bước xử lý lỗi trang (sách §3.6.2): (1) phần cứng bẫy vào nhân, lưu bộ đếm chương trình lên ngăn xếp; (2) một thủ tục hợp ngữ lưu các thanh ghi chung và các thông tin dễ mất khác; (3) HĐH phát hiện có lỗi trang và tìm xem trang ảo nào đang cần; (4) khi đã biết địa chỉ gây lỗi, nó kiểm địa chỉ có hợp lệ và kiểu truy cập có phù hợp quyền bảo vệ không.</p>
<p>Bước 1 hoàn toàn là phần cứng: ở hầu hết máy, một phần trạng thái CPU (PC, đôi khi nhiều hơn) được chính lệnh bẫy lưu lại. Bước 2 không viết bằng C được, vì mã C sẽ dùng luôn các thanh ghi đang cần lưu — nên một thủ tục hợp ngữ ngắn chạy trước, rồi mới gọi thủ tục C. Bước 3: thường có một thanh ghi phần cứng giữ địa chỉ ảo gây lỗi (CR2 trên x86, FAR_EL1 trên ARM64); không có thì HĐH phải lấy PC, đọc lệnh và tự suy ra bằng phần mềm lệnh đó đang làm gì lúc lỗi. Bước 4: địa chỉ không hợp lệ hoặc vi phạm bảo vệ thì không nạp gì cả — tiến trình nhận một tín hiệu (SIGSEGV trên UNIX) hoặc bị giết. Cả chuỗi dưới dạng sơ đồ:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/fda7f8c8eaacd534cf69ad44b0414089cd82a12e.svg" alt="10 bước xử lý lỗi trang — cuối cùng lệnh gây lỗi được chạy lại" loading="lazy" /><p class="chu-thich">🧩 10 bước xử lý lỗi trang — cuối cùng lệnh gây lỗi được chạy lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' 10 bước xử lý lỗi trang (MOS 4e §3.6.2, slide 35–37)
participant "User program" as U
participant "MMU\\n(hardware)" as M
participant "Kernel: assembly\\nentry + fault handler" as K
participant "Disk" as D
participant "Scheduler" as S
U -&gt; M : load / store to a page\\nwhose present bit = 0
M -&gt; K : 1. TRAP: save the PC\\n2. assembly routine saves registers
K -&gt; K : 3. which virtual page? (faulting address\\nregister: CR2 on x86, FAR_EL1 on ARM64)\\n4. address valid? access allowed?\\n(no ⇒ SIGSEGV) · pick a free frame
alt 5. the chosen frame is dirty (M = 1)
  K -&gt; D : write the old page back
  K -&gt; S : context switch: run another process
  D --&gt; K : write done
end
K -&gt; D : 6. read the needed page from its disk address
K -&gt; S : the faulting process stays blocked
D --&gt; K : 7. disk interrupt: page arrived\\n→ update page table, frame normal
K -&gt; K : 8. back up the faulting instruction,\\nreset the PC
K -&gt; S : 9. faulting process is ready again
K --&gt; U : 10. restore registers, return to user mode:\\nthe SAME instruction runs again, now it hits
@enduml</code></pre></details>
<p class="pitfall">⚠️ FE3 câu 19: sau bẫy lỗi trang, các thanh ghi đa dụng và trạng thái dễ mất được lưu bởi một <strong>thủ tục hợp ngữ (assembly-language routine)</strong> (không phải bộ điều khiển đĩa, không phải bộ lập lịch). ⚠️ Bộ slide đánh số các bước 1–4, rồi "5, 5, 5", rồi "8, 8, 8" — cách đánh số trên slide bị hỏng; danh sách của sách là 1–10.</p>`],
      [36, 'Page Fault Handling (2)',
        `<p class="y-chinh">🎯 Steps 5–7: (5) if the frame selected is dirty, the page is scheduled for transfer to disk and a context switch takes place, suspending the faulting process; (6) as soon as the frame is clean, the OS looks up the disk address where the needed page is and schedules a disk operation to bring it in; (7) when the disk interrupt says the page has arrived, the page tables are updated and the frame is marked normal.</p>
<p>Before step 5 the OS has found a free frame or run the replacement algorithm. While a dirty frame is written out, the frame is marked <strong>busy</strong> so that it is not taken for another purpose, and other processes run — the faulting process is blocked, just like any process waiting for I/O. In step 6 the faulting process is still suspended, and another user process runs if one is ready. ➕ How many faults does a real program take, and how many need the disk? Linux counts both:</p>
<pre><code class="language-c">// Count page faults for real: minor (page already in RAM, only the table is filled) and major (the page must be READ FROM DISK)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;

static void counts(long *maj, long *min) { struct rusage u; getrusage(RUSAGE_SELF, &amp;u); *maj = u.ru_majflt; *min = u.ru_minflt; }
static long r10(long n) { return (n + 5) / 10 * 10; }    // to the nearest 10: the C library itself adds a fault or two

static void read_file(const char *what, int fd, off_t n) {
    char *p = mmap(NULL, n, PROT_READ, MAP_PRIVATE, fd, 0);
    madvise(p, n, MADV_RANDOM);                          // no read-ahead: one fault per page
    long M0, m0, M1, m1, s = 0;
    counts(&amp;M0, &amp;m0);
    for (off_t i = 0; i &lt; n; i += 4096) s += p[i];
    counts(&amp;M1, &amp;m1);
    printf("%-36s major faults %4ld, minor faults ~%ld\\n", what, M1 - M0, r10(m1 - m0));
    munmap(p, n);
    if (s == 1) puts("");
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    // 1. anonymous memory: 1000 new pages
    long M0, m0, M1, m1;
    char *a = mmap(NULL, 1000 * 4096L, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(a, 1000 * 4096L, MADV_NOHUGEPAGE);
    counts(&amp;M0, &amp;m0);
    for (int i = 0; i &lt; 1000; i++) a[i * 4096] = 1;
    counts(&amp;M1, &amp;m1);
    printf("%-36s major faults %4ld, minor faults ~%ld\\n", "touch 1000 new anonymous pages:", M1 - M0, r10(m1 - m0));
    // 2. a file of 8 MB = 2048 pages, first NOT in the page cache, then in it
    int fd = open("/tmp/du-lieu.bin", O_RDWR | O_CREAT | O_TRUNC, 0644);
    char buf[4096];
    for (int i = 0; i &lt; 4096; i++) buf[i] = (char)i;
    for (int i = 0; i &lt; 2048; i++) write(fd, buf, sizeof buf);
    fsync(fd);
    posix_fadvise(fd, 0, 0, POSIX_FADV_DONTNEED);        // drop THIS file from the page cache
    read_file("read 2048 file pages, cold cache:", fd, 2048 * 4096L);
    read_file("read them again, warm cache:", fd, 2048 * 4096L);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread loi-trang.c -o loi-trang &amp;&amp; ./loi-trang<br>
touch 1000 new anonymous pages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;major faults &nbsp;&nbsp;&nbsp;0, minor faults ~1000<br>
read 2048 file pages, cold cache: &nbsp;&nbsp;&nbsp;major faults 2048, minor faults ~0<br>
read them again, warm cache: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;major faults &nbsp;&nbsp;&nbsp;0, minor faults ~130</div>
<p><strong>Minor faults</strong>: the page is not mapped yet but no disk read is needed — a brand-new anonymous page (filled with zeros), or a file page already in the page cache. <strong>Major faults</strong>: the page must be read from disk — the 8-MB file after it was dropped from the cache gave 2,048 major faults, one per page. Reading it again (warm cache) needed no disk at all and only about 130 minor faults — 2,048 / 16 = 128, because Linux maps 16 neighbouring cached pages per fault ("fault-around"). (Counts are rounded to the nearest ten: the C library itself adds a fault or two now and then.) Book §3.3.3 uses the same words: <strong>minor page fault</strong> vs <strong>major page fault</strong>.</p>
<p class="meo">🧠 Try it on any command: <code>/usr/bin/time -v ls</code> prints "Major (requiring I/O) page faults" and "Minor (reclaiming a frame) page faults" — practice lesson 3.C, exercise 7.</p>`,
        `<p class="y-chinh">🎯 Bước 5–7: (5) nếu khung được chọn đang bẩn, trang được lên lịch ghi xuống đĩa và diễn ra chuyển ngữ cảnh, treo tiến trình bị lỗi; (6) ngay khi khung sạch, HĐH tra địa chỉ trên đĩa của trang cần dùng và lên lịch một thao tác đĩa để đưa nó vào; (7) khi ngắt đĩa báo trang đã về, các bảng trang được cập nhật và khung được đánh dấu bình thường.</p>
<p>Trước bước 5, HĐH đã tìm được khung trống hoặc đã chạy thuật toán thay trang. Trong lúc ghi khung bẩn ra đĩa, khung được đánh dấu <strong>bận (busy)</strong> để không bị lấy cho việc khác, và các tiến trình khác được chạy — tiến trình bị lỗi bị chặn, y như mọi tiến trình đang chờ I/O. Ở bước 6, tiến trình bị lỗi vẫn bị treo, và một tiến trình người dùng khác chạy nếu có tiến trình sẵn sàng. ➕ Một chương trình thật bị bao nhiêu lỗi, và bao nhiêu lỗi cần tới đĩa? Linux đếm cả hai:</p>
<pre><code class="language-c">// Đếm lỗi trang thật: nhẹ (trang đã ở RAM, chỉ cần điền bảng) và nặng (phải ĐỌC TỪ ĐĨA)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;

static void counts(long *maj, long *min) { struct rusage u; getrusage(RUSAGE_SELF, &amp;u); *maj = u.ru_majflt; *min = u.ru_minflt; }
static long r10(long n) { return (n + 5) / 10 * 10; }    // làm tròn tới chục: chính thư viện C thỉnh thoảng thêm một hai lỗi

static void read_file(const char *what, int fd, off_t n) {
    char *p = mmap(NULL, n, PROT_READ, MAP_PRIVATE, fd, 0);
    madvise(p, n, MADV_RANDOM);                          // không đọc trước: mỗi trang một lỗi
    long M0, m0, M1, m1, s = 0;
    counts(&amp;M0, &amp;m0);
    for (off_t i = 0; i &lt; n; i += 4096) s += p[i];
    counts(&amp;M1, &amp;m1);
    printf("%-36s major faults %4ld, minor faults ~%ld\\n", what, M1 - M0, r10(m1 - m0));
    munmap(p, n);
    if (s == 1) puts("");
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    // 1. bộ nhớ ẩn danh: 1000 trang mới
    long M0, m0, M1, m1;
    char *a = mmap(NULL, 1000 * 4096L, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(a, 1000 * 4096L, MADV_NOHUGEPAGE);
    counts(&amp;M0, &amp;m0);
    for (int i = 0; i &lt; 1000; i++) a[i * 4096] = 1;
    counts(&amp;M1, &amp;m1);
    printf("%-36s major faults %4ld, minor faults ~%ld\\n", "touch 1000 new anonymous pages:", M1 - M0, r10(m1 - m0));
    // 2. tệp 8 MB = 2048 trang, lần đầu KHÔNG ở page cache, lần sau thì có
    int fd = open("/tmp/du-lieu.bin", O_RDWR | O_CREAT | O_TRUNC, 0644);
    char buf[4096];
    for (int i = 0; i &lt; 4096; i++) buf[i] = (char)i;
    for (int i = 0; i &lt; 2048; i++) write(fd, buf, sizeof buf);
    fsync(fd);
    posix_fadvise(fd, 0, 0, POSIX_FADV_DONTNEED);        // đuổi RIÊNG tệp này khỏi page cache
    read_file("read 2048 file pages, cold cache:", fd, 2048 * 4096L);
    read_file("read them again, warm cache:", fd, 2048 * 4096L);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread loi-trang.c -o loi-trang &amp;&amp; ./loi-trang<br>
touch 1000 new anonymous pages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;major faults &nbsp;&nbsp;&nbsp;0, minor faults ~1000<br>
read 2048 file pages, cold cache: &nbsp;&nbsp;&nbsp;major faults 2048, minor faults ~0<br>
read them again, warm cache: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;major faults &nbsp;&nbsp;&nbsp;0, minor faults ~130</div>
<p><strong>Lỗi nhẹ (minor fault)</strong>: trang chưa được ánh xạ nhưng không cần đọc đĩa — một trang ẩn danh hoàn toàn mới (điền số 0), hoặc một trang tệp đã có trong page cache. <strong>Lỗi nặng (major fault)</strong>: trang phải đọc từ đĩa — tệp 8 MB sau khi bị đuổi khỏi cache cho 2.048 lỗi nặng, mỗi trang một lỗi. Đọc lại (cache đã ấm) thì không cần đĩa và chỉ khoảng 130 lỗi nhẹ — 2.048 / 16 = 128, vì Linux ánh xạ luôn 16 trang hàng xóm đã có trong cache ở mỗi lần lỗi ("fault-around"). (Số được làm tròn tới chục: chính thư viện C thỉnh thoảng thêm một hai lỗi.) Sách §3.3.3 dùng đúng hai chữ này: <strong>minor page fault</strong> và <strong>major page fault</strong>.</p>
<p class="meo">🧠 Thử với lệnh bất kỳ: <code>/usr/bin/time -v ls</code> in ra "Major (requiring I/O) page faults" và "Minor (reclaiming a frame) page faults" — bài thực hành 3.C, bài 7.</p>`],
      [37, 'Page Fault Handling (3)',
        `<p class="y-chinh">🎯 Steps 8–10: (8) the faulting instruction is backed up to the state it had when it began and the program counter is reset to point to it; (9) the faulting process is scheduled, and the OS returns to the assembly routine that called it; (10) this routine reloads the registers and other state information and returns to user space to continue execution, as if no fault had occurred.</p>
<p>The point of step 10 is the illusion: the program never knows it was interrupted. The instruction that faulted is executed <strong>again from the beginning</strong>, and this time the page is present, so it completes. Making that restart possible is the hardware's job and is surprisingly hard on some machines — slide 38. A complete user-level replay of steps 1–10, with a signal handler playing the OS:</p>
<pre><code class="language-c">// Instruction backup for real: a page fault stops a store in the middle, the "OS" (our handler) fixes the page, the SAME instruction runs again
#include &lt;stdio.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;

static char *page;
static int faults = 0;

static void handler(int sig, siginfo_t *info, void *ctx) {
    (void)sig; (void)ctx;
    faults++;
    char *addr = info-&gt;si_addr;                          // the faulting address, like CR2 / FAR_EL1
    printf("  page fault #%d at offset %ld of the page -&gt; make the page writable, then return\\n", faults, (long)(addr - page));
    mprotect(page, 4096, PROT_READ | PROT_WRITE);        // "bring the page in"
}                                                        // returning = the faulting instruction is executed AGAIN

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    page = mmap(NULL, 4096, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);   // not accessible yet
    struct sigaction sa = {0};
    sa.sa_sigaction = handler;
    sa.sa_flags = SA_SIGINFO;
    sigaction(SIGSEGV, &amp;sa, NULL);
    printf("store 42 into page[100] ...\\n");
    page[100] = 42;                                      // faults once, then completes on the restart
    printf("back in main: page[100] = %d, faults = %d\\n", page[100], faults);
    page[200] = 7;                                       // the page is now mapped: no fault
    printf("store into page[200]: faults still = %d\\n", faults);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread lam-lai-lenh.c -o lam-lai-lenh &amp;&amp; ./lam-lai-lenh<br>
store 42 into page[100] ...<br>
&nbsp;&nbsp;page fault #1 at offset 100 of the page -&gt; make the page writable, then return<br>
back in main: page[100] = 42, faults = 1<br>
store into page[200]: faults still = 1</div>
<p>The store <code>page[100] = 42</code> hit a page with no access rights (like "present = 0"); the kernel delivered SIGSEGV with the faulting address (step 3: 100 bytes into the page); the handler made the page accessible ("loaded" it) and returned; returning re-executed the <strong>same store</strong>, which now succeeded — <code>main</code> reads 42 and never saw a thing. The next store hits the same page: no fault. Garbage collectors and user-level distributed shared memory use exactly this trick.</p>
<p class="meo">🧠 The 10 steps in one line: trap → save → find address → check → (write dirty) → read page → update table → back up instruction → reschedule → restore and retry.</p>`,
        `<p class="y-chinh">🎯 Bước 8–10: (8) lệnh gây lỗi được lùi về trạng thái lúc nó bắt đầu và bộ đếm chương trình được đặt lại trỏ vào nó; (9) tiến trình bị lỗi được đưa vào lập lịch, và HĐH trở về thủ tục hợp ngữ đã gọi nó; (10) thủ tục này nạp lại thanh ghi và các thông tin trạng thái khác rồi trở về không gian người dùng để chạy tiếp, như thể chưa hề có lỗi.</p>
<p>Ý nghĩa của bước 10 là sự ảo giác: chương trình không bao giờ biết mình bị ngắt. Lệnh gây lỗi được thi hành <strong>lại từ đầu</strong>, và lần này trang đã có mặt nên nó chạy xong. Làm được việc chạy lại đó là việc của phần cứng, và trên một số máy khó bất ngờ — slide 38. Một lần dựng lại đủ bước 1–10 ở mức người dùng, với trình xử lý tín hiệu đóng vai HĐH:</p>
<pre><code class="language-c">// Chạy lại lệnh, thật: lỗi trang chặn lệnh ghi giữa chừng, "HĐH" (trình xử lý của ta) sửa trang, CÙNG lệnh đó chạy lại
#include &lt;stdio.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;

static char *page;
static int faults = 0;

static void handler(int sig, siginfo_t *info, void *ctx) {
    (void)sig; (void)ctx;
    faults++;
    char *addr = info-&gt;si_addr;                          // địa chỉ gây lỗi, như CR2 / FAR_EL1
    printf("  page fault #%d at offset %ld of the page -&gt; make the page writable, then return\\n", faults, (long)(addr - page));
    mprotect(page, 4096, PROT_READ | PROT_WRITE);        // "nạp trang vào"
}                                                        // trở về = lệnh gây lỗi được chạy LẠI

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    page = mmap(NULL, 4096, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);   // chưa được phép truy cập
    struct sigaction sa = {0};
    sa.sa_sigaction = handler;
    sa.sa_flags = SA_SIGINFO;
    sigaction(SIGSEGV, &amp;sa, NULL);
    printf("store 42 into page[100] ...\\n");
    page[100] = 42;                                      // lỗi một lần, rồi hoàn tất khi chạy lại
    printf("back in main: page[100] = %d, faults = %d\\n", page[100], faults);
    page[200] = 7;                                       // trang đã được ánh xạ: không lỗi
    printf("store into page[200]: faults still = %d\\n", faults);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread lam-lai-lenh.c -o lam-lai-lenh &amp;&amp; ./lam-lai-lenh<br>
store 42 into page[100] ...<br>
&nbsp;&nbsp;page fault #1 at offset 100 of the page -&gt; make the page writable, then return<br>
back in main: page[100] = 42, faults = 1<br>
store into page[200]: faults still = 1</div>
<p>Lệnh ghi <code>page[100] = 42</code> chạm vào một trang không có quyền truy cập (như "present = 0"); nhân gửi SIGSEGV kèm địa chỉ gây lỗi (bước 3: cách đầu trang 100 byte); trình xử lý cho trang truy cập được ("nạp" nó) rồi trở về; trở về là thi hành lại <strong>đúng lệnh ghi đó</strong>, lần này thành công — <code>main</code> đọc được 42 và không hề hay biết. Lệnh ghi kế tiếp chạm cùng trang: không lỗi. Bộ thu gom rác và bộ nhớ chia sẻ phân tán mức người dùng dùng đúng mẹo này.</p>
<p class="meo">🧠 Mười bước trong một dòng: bẫy → lưu → tìm địa chỉ → kiểm → (ghi trang bẩn) → đọc trang → sửa bảng → lùi lệnh → lập lịch lại → khôi phục và chạy lại.</p>`],
      [38, 'Instruction Backup',
        `<p class="y-chinh">🎯 Figure 3-27: an instruction causing a page fault — <code>MOVE.L #6(A1), 2(A0)</code> on the Motorola 680x0, three 16-bit words at addresses 1000 (opcode), 1002 (first operand), 1004 (second operand). If it faults, where should the OS restart it?</p>
<p>The value of the PC at the time of the trap depends on which operand faulted and on how the microcode is implemented: it could be 1000, 1002 or 1004. The OS often cannot tell where the instruction began — worse, with auto-increment addressing (<code>(A0)+</code>) a register may already have been incremented before the fault, and the OS must undo that. The book's fix (680x0): a hidden internal register into which the PC is copied <strong>just before each instruction is executed</strong>, plus a register telling which registers were auto-incremented and by how much. ➕ Modern CPUs make faults <strong>precise</strong> (Chapter 1, slide 12; Chapter 5): the saved PC points exactly at the faulting instruction and nothing from it has taken effect, so restarting is simple — the run on slide 37 relied on exactly this. ARM64 loads and stores are single, fixed-length instructions, which removes most of the 680x0 headache.</p>
<p class="pitfall">⚠️ The four properties of a precise interrupt (FE1 question 10) are what make instruction backup trivial: PC saved in a known place; all instructions before it completed; none after it finished; the state of the one at the PC is known.</p>`,
        `<p class="y-chinh">🎯 Hình 3-27: một lệnh gây lỗi trang — <code>MOVE.L #6(A1), 2(A0)</code> trên Motorola 680x0, ba từ 16 bit ở địa chỉ 1000 (mã lệnh), 1002 (toán hạng thứ nhất), 1004 (toán hạng thứ hai). Nếu nó bị lỗi, HĐH phải cho chạy lại từ đâu?</p>
<p>Giá trị PC lúc bẫy tuỳ vào toán hạng nào gây lỗi và vi mã (microcode) được cài thế nào: có thể là 1000, 1002 hoặc 1004. HĐH thường không biết lệnh bắt đầu ở đâu — tệ hơn, với chế độ địa chỉ tự tăng (<code>(A0)+</code>), một thanh ghi có thể đã bị tăng trước khi lỗi, và HĐH phải hoàn tác việc đó. Cách chữa của sách (680x0): một thanh ghi nội bộ ẩn được chép PC vào <strong>ngay trước khi mỗi lệnh thực thi</strong>, cộng một thanh ghi cho biết thanh ghi nào đã tự tăng và tăng bao nhiêu. ➕ CPU hiện đại làm lỗi thành <strong>chính xác (precise)</strong> (Chương 1, slide 12; Chương 5): PC được lưu chỉ đúng lệnh gây lỗi và chưa có gì của lệnh đó có hiệu lực, nên chạy lại rất đơn giản — lần chạy ở slide 37 dựa đúng vào điều này. Lệnh nạp/ghi của ARM64 là một lệnh duy nhất, độ dài cố định, nên gần như hết cái đau đầu của 680x0.</p>
<p class="pitfall">⚠️ Bốn tính chất của ngắt chính xác (FE1 câu 10) chính là thứ làm việc lùi lệnh trở nên dễ: PC lưu ở chỗ đã biết; mọi lệnh trước nó đã xong; không lệnh nào sau nó đã xong; trạng thái của lệnh tại PC là xác định.</p>`],
      [39, 'Backing Store',
        `<p class="y-chinh">🎯 Figure 3-28: where pages live on disk. (a) <strong>Paging to a static swap area</strong>: each process gets a chunk of the swap partition as big as its address space; page k is always at (start of the process's area) + k. (b) <strong>Backing up pages dynamically</strong>: no fixed place; a page gets a disk location only when it is swapped out, and a <strong>disk map</strong> per process remembers where each page is.</p>
<p>In (a), the address of a page on disk is pure arithmetic — only the start of the process's swap area must be kept in its process table entry — and every page in memory always has a <strong>shadow copy</strong> on disk (possibly out of date). In (b) the disk map must be stored in memory, with one disk address per page (or a marker "not on disk"), but swap space is used only for pages that are really out. Pages of program text and other mapped files need no swap at all: their backing store is the file itself. Linux uses a mix:</p>
<div class="out"># Backing store on this Linux: one swap FILE for anonymous pages; code and file pages are backed by their own files<br>
$ cat /proc/swaps<br>
Filename				Type		Size		Used		Priority<br>
/var/lib/swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file		1048572		20540		-1<br>
$ grep -E '^Swap(Total|Free)' /proc/meminfo<br>
SwapTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048572 kB<br>
SwapFree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1028032 kB<br>
# which mappings of a process have a file behind them (column 6), which are anonymous?<br>
$ cat /proc/self/maps | grep -E '/usr/bin/cat|libc|heap|stack' | awk '{print $1, $2, $6}'<br>
aaaae3f30000-aaaae3f39000 r-xp /usr/bin/cat<br>
aaaae3f4f000-aaaae3f50000 r--p /usr/bin/cat<br>
aaaae3f50000-aaaae3f51000 rw-p /usr/bin/cat<br>
aaaae61f7000-aaaae6218000 rw-p [heap]<br>
ffff99310000-ffff9949c000 r-xp /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff9949c000-ffff994ac000 ---p /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff994ac000-ffff994b0000 r--p /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff994b0000-ffff994b2000 rw-p /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffc5f24000-ffffc5f45000 rw-p [stack]</div>
<p>The course machine has one swap <strong>file</strong> of 1 GB (Linux also accepts swap partitions; several can be active with priorities). Anonymous memory (<code>[heap]</code>, <code>[stack]</code>) has no file behind it, so it goes to swap when evicted; the mappings of <code>/usr/bin/cat</code> and libc are backed by their files — a clean code page is simply dropped and re-read later.</p>
<p class="pitfall">⚠️ FE18 question 40: which is NOT true of paging to a static swap area? — "<strong>requires a disk map in memory</strong>" (that is the dynamic scheme b). FE9 question 22: data in secondary storage not currently in main memory = <strong>swap space</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 3-28: trang nằm ở đâu trên đĩa. (a) <strong>Phân trang vào vùng swap tĩnh</strong>: mỗi tiến trình được một khúc của phân vùng swap lớn bằng không gian địa chỉ của nó; trang k luôn ở (đầu vùng của tiến trình) + k. (b) <strong>Sao lưu trang động</strong>: không có chỗ cố định; một trang chỉ được cấp chỗ trên đĩa khi bị đẩy ra, và mỗi tiến trình có một <strong>bản đồ đĩa (disk map)</strong> nhớ từng trang nằm đâu.</p>
<p>Ở (a), địa chỉ của trang trên đĩa chỉ là phép tính — chỉ cần lưu điểm đầu vùng swap của tiến trình trong mục bảng tiến trình — và mọi trang trong bộ nhớ luôn có một <strong>bản sao bóng (shadow copy)</strong> trên đĩa (có thể đã cũ). Ở (b) bản đồ đĩa phải nằm trong bộ nhớ, mỗi trang một địa chỉ đĩa (hoặc dấu "không có trên đĩa"), nhưng chỗ swap chỉ dùng cho trang thật sự bị đẩy ra. Trang mã chương trình và các tệp được ánh xạ khác không cần swap: kho dự phòng của chúng chính là tệp. Linux dùng kiểu pha trộn:</p>
<div class="out"># Kho dự phòng trên Linux này: một TỆP swap cho trang ẩn danh; trang mã và trang tệp có tệp gốc của chúng làm chỗ dựa<br>
$ cat /proc/swaps<br>
Filename				Type		Size		Used		Priority<br>
/var/lib/swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file		1048572		20540		-1<br>
$ grep -E '^Swap(Total|Free)' /proc/meminfo<br>
SwapTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048572 kB<br>
SwapFree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1028032 kB<br>
# vùng nào của một tiến trình có tệp đứng sau (cột 6), vùng nào ẩn danh?<br>
$ cat /proc/self/maps | grep -E '/usr/bin/cat|libc|heap|stack' | awk '{print $1, $2, $6}'<br>
aaaae3f30000-aaaae3f39000 r-xp /usr/bin/cat<br>
aaaae3f4f000-aaaae3f50000 r--p /usr/bin/cat<br>
aaaae3f50000-aaaae3f51000 rw-p /usr/bin/cat<br>
aaaae61f7000-aaaae6218000 rw-p [heap]<br>
ffff99310000-ffff9949c000 r-xp /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff9949c000-ffff994ac000 ---p /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff994ac000-ffff994b0000 r--p /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff994b0000-ffff994b2000 rw-p /usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffc5f24000-ffffc5f45000 rw-p [stack]</div>
<p>Máy của môn có một <strong>tệp</strong> swap 1 GB (Linux cũng nhận phân vùng swap; nhiều vùng có thể cùng bật với độ ưu tiên). Bộ nhớ ẩn danh (<code>[heap]</code>, <code>[stack]</code>) không có tệp đứng sau, nên bị đuổi thì đi vào swap; các vùng của <code>/usr/bin/cat</code> và libc có tệp của chúng làm chỗ dựa — trang mã sạch chỉ việc bỏ đi rồi đọc lại khi cần.</p>
<p class="pitfall">⚠️ FE18 câu 40: điều nào KHÔNG đúng với phân trang vào vùng swap tĩnh? — "<strong>cần một bản đồ đĩa trong bộ nhớ</strong>" (đó là kiểu động b). FE9 câu 22: dữ liệu ở bộ nhớ phụ hiện không nằm trong bộ nhớ chính = <strong>swap space</strong>.</p>`],
      [40, 'Separation of Policy and Mechanism (1)',
        `<p class="y-chinh">🎯 The memory management system can be divided into three parts: (1) a low-level <strong>MMU handler</strong>; (2) a <strong>page fault handler</strong> that is part of the kernel; (3) an <strong>external pager</strong> running in user space.</p>
<p>"Separate policy from mechanism" is a general design principle (Chapter 12): the kernel provides the <strong>mechanism</strong> — loading the MMU, catching the fault, mapping a page — while the <strong>policy</strong> — where pages come from, which ones to keep — can live in a replaceable user-level program. The MMU handler hides all the machine-dependent details of the MMU and is rewritten for each new platform; the page fault handler is machine-independent and contains most of the paging mechanism; the external pager decides. Mach introduced this split. The advantage: more modular code, more flexibility (a database could provide its own pager). The disadvantage: crossing the user–kernel boundary several times per fault, and messages between the parts — slower.</p>
<p>A subtle point in the book: where does the replacement <em>algorithm</em> go? In the pager it is the cleanest, but the pager has no access to the R and M bits of the pages; the alternative is to keep the algorithm in the kernel and let the pager only do the disk transfers.</p>
<p class="meo">🧠 Policy = "what to do", mechanism = "how to do it". Same split in a backend: a framework provides the cache mechanism, you configure the eviction policy.</p>`,
        `<p class="y-chinh">🎯 Hệ quản lý bộ nhớ có thể chia làm ba phần: (1) một <strong>trình xử lý MMU</strong> mức thấp; (2) một <strong>trình xử lý lỗi trang</strong> thuộc nhân; (3) một <strong>bộ phân trang ngoài (external pager)</strong> chạy ở không gian người dùng.</p>
<p>"Tách chính sách khỏi cơ chế" là một nguyên tắc thiết kế chung (Chương 12): nhân cung cấp <strong>cơ chế (mechanism)</strong> — nạp MMU, bắt lỗi, ánh xạ trang — còn <strong>chính sách (policy)</strong> — trang lấy từ đâu, giữ trang nào — có thể nằm trong một chương trình mức người dùng thay được. Trình xử lý MMU giấu mọi chi tiết phụ thuộc máy của MMU và phải viết lại cho mỗi nền tảng mới; trình xử lý lỗi trang thì độc lập máy và chứa phần lớn cơ chế phân trang; bộ phân trang ngoài thì ra quyết định. Mach đưa ra cách chia này. Lợi: mã mô-đun hơn, linh hoạt hơn (một cơ sở dữ liệu có thể tự mang bộ phân trang riêng). Hại: mỗi lần lỗi phải vượt ranh giới người dùng–nhân nhiều lần, và các phần nhắn tin cho nhau — chậm hơn.</p>
<p>Một điểm tinh tế trong sách: đặt <em>thuật toán</em> thay trang ở đâu? Đặt trong bộ phân trang là gọn nhất, nhưng bộ phân trang không đọc được bit R và M của các trang; cách khác là giữ thuật toán trong nhân và để bộ phân trang chỉ lo chuyển dữ liệu với đĩa.</p>
<p class="meo">🧠 Chính sách = "làm gì", cơ chế = "làm thế nào". Trong backend cũng tách y vậy: framework cho cơ chế cache, bạn cấu hình chính sách đuổi.</p>`],
      [41, 'Separation of Policy and Mechanism (2)',
        `<p class="y-chinh">🎯 Figure 3-29, page fault handling with an external pager: (1) the user process faults; the kernel's fault handler (2) asks the external pager for the needed page; the pager (3) requests it from disk and (4) receives it; (5) gives it back to the fault handler, which (6) tells the MMU handler to map it in.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/f71169854c3f0952a1a7bd3bc1267b61c6f94ffc.svg" alt="Figure 3-29 as a sequence diagram: policy in user space, mechanism in the kernel" loading="lazy" /><p class="chu-thich">🧩 Figure 3-29 as a sequence diagram: policy in user space, mechanism in the kernel</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 3-29: page fault handling with an external pager (Mach)
box "User space" #F0F9FF
participant "User process" as U
participant "External pager\\n(policy: where pages live)" as P
end box
box "Kernel space" #FEF2F2
participant "Fault handler" as F
participant "MMU handler\\n(mechanism)" as M
end box
database "Disk" as D
U -&gt; F : 1. page fault
F -&gt; P : 2. needed page
P -&gt; D : 3. request page
D --&gt; P : 4. page arrives
P --&gt; F : 5. here is page
F -&gt; M : 6. map page in
M --&gt; U : the instruction is restarted
@enduml</code></pre></details>
<p>➕ Linux's modern version of this design is <strong>userfaultfd</strong> (man7 userfaultfd(2): since Linux 4.3): a process registers a memory range, and page faults in it are delivered as events to a user-space thread, which supplies the page contents — used by QEMU for live migration of virtual machines and by CRIU to restore checkpointed processes. The course kernel was built without it, so the program first asks, then builds the same idea with what is available — a SIGSEGV handler acting as the pager, a file acting as the disk:</p>
<pre><code class="language-c">// A user-space pager (Figure 3-29): the kernel reports the fault, a USER routine decides where the page comes from
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/syscall.h&gt;
#define PAGES 4

static char *region;
static int store;                                        // our "backing store" file

static void pager(int sig, siginfo_t *info, void *ctx) { // steps 2-6 of Figure 3-29
    (void)sig; (void)ctx;
    long n = ((char *)info-&gt;si_addr - region) / 4096;
    char buf[4096];
    pread(store, buf, sizeof buf, n * 4096);             // 3-4. fetch the page from the store
    mprotect(region + n * 4096, 4096, PROT_READ | PROT_WRITE);
    memcpy(region + n * 4096, buf, sizeof buf);          // 5-6. "here is the page", map it in
    printf("  [pager] fault on page %ld -&gt; loaded from the store\\n", n);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    long r = syscall(SYS_userfaultfd, 0);                // Linux's real API for this (4.3+), if the kernel has it
    printf("userfaultfd(): %s\\n", r &lt; 0 ? strerror(errno) : "available");
    store = open("kho.bin", O_RDWR | O_CREAT | O_TRUNC, 0644);
    for (int i = 0; i &lt; PAGES; i++) { char buf[4096]; memset(buf, 0, sizeof buf); snprintf(buf, sizeof buf, "this is page %d, from the store", i); write(store, buf, sizeof buf); }
    region = mmap(NULL, PAGES * 4096, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    struct sigaction sa = {0};
    sa.sa_sigaction = pager; sa.sa_flags = SA_SIGINFO;
    sigaction(SIGSEGV, &amp;sa, NULL);
    int order[] = {2, 0, 2, 3};
    for (int k = 0; k &lt; 4; k++) {
        int i = order[k];
        printf("read page %d: \\"%s\\"\\n", i, region + i * 4096);   // 1. the access that may fault
    }
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread pager-ngoai.c -o pager-ngoai &amp;&amp; ./pager-ngoai<br>
userfaultfd(): Function not implemented<br>
&nbsp;&nbsp;[pager] fault on page 2 -&gt; loaded from the store<br>
read page 2: "this is page 2, from the store"<br>
&nbsp;&nbsp;[pager] fault on page 0 -&gt; loaded from the store<br>
read page 0: "this is page 0, from the store"<br>
read page 2: "this is page 2, from the store"<br>
&nbsp;&nbsp;[pager] fault on page 3 -&gt; loaded from the store<br>
read page 3: "this is page 3, from the store"</div>
<p><code>userfaultfd()</code> answers "Function not implemented" (ENOSYS) on this kernel. The hand-made pager then serves each first touch of a page from the store file (steps 2–6), and the second read of page 2 needs no pager at all. Order of faults: 2, 0, 3 — exactly the order the program first touched them.</p>
<p class="meo">🧠 External pager = the page fault is a <em>message</em> to whoever owns the memory. Same pattern as an "on cache miss, call the loader" function in a backend cache library.</p>`,
        `<p class="y-chinh">🎯 Hình 3-29, xử lý lỗi trang với bộ phân trang ngoài: (1) tiến trình người dùng bị lỗi trang; trình xử lý lỗi của nhân (2) hỏi bộ phân trang ngoài trang cần dùng; bộ phân trang (3) xin trang từ đĩa và (4) nhận được nó; (5) trả lại cho trình xử lý lỗi, rồi trình này (6) bảo trình xử lý MMU ánh xạ nó vào.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/f71169854c3f0952a1a7bd3bc1267b61c6f94ffc.svg" alt="Hình 3-29 dạng sơ đồ tuần tự: chính sách ở không gian người dùng, cơ chế trong nhân" loading="lazy" /><p class="chu-thich">🧩 Hình 3-29 dạng sơ đồ tuần tự: chính sách ở không gian người dùng, cơ chế trong nhân</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 3-29: xử lý lỗi trang với bộ phân trang ngoài (Mach)
box "User space" #F0F9FF
participant "User process" as U
participant "External pager\\n(policy: where pages live)" as P
end box
box "Kernel space" #FEF2F2
participant "Fault handler" as F
participant "MMU handler\\n(mechanism)" as M
end box
database "Disk" as D
U -&gt; F : 1. page fault
F -&gt; P : 2. needed page
P -&gt; D : 3. request page
D --&gt; P : 4. page arrives
P --&gt; F : 5. here is page
F -&gt; M : 6. map page in
M --&gt; U : the instruction is restarted
@enduml</code></pre></details>
<p>➕ Phiên bản hiện đại của thiết kế này trong Linux là <strong>userfaultfd</strong> (man7 userfaultfd(2): có từ Linux 4.3): tiến trình đăng ký một vùng nhớ, và lỗi trang trong vùng đó được gửi thành sự kiện tới một luồng ở không gian người dùng, luồng này cung cấp nội dung trang — QEMU dùng để di chuyển máy ảo đang chạy, CRIU dùng để khôi phục tiến trình đã chụp lại. Nhân của môn được dựng không có nó, nên chương trình hỏi trước, rồi dựng cùng ý tưởng bằng thứ có sẵn — trình xử lý SIGSEGV đóng vai bộ phân trang, một tệp đóng vai đĩa:</p>
<pre><code class="language-c">// Bộ phân trang ở không gian người dùng (Hình 3-29): nhân báo lỗi, một thủ tục NGƯỜI DÙNG quyết định trang lấy từ đâu
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/syscall.h&gt;
#define PAGES 4

static char *region;
static int store;                                        // tệp "kho dự phòng" của ta

static void pager(int sig, siginfo_t *info, void *ctx) { // bước 2-6 của Hình 3-29
    (void)sig; (void)ctx;
    long n = ((char *)info-&gt;si_addr - region) / 4096;
    char buf[4096];
    pread(store, buf, sizeof buf, n * 4096);             // 3-4. lấy trang từ kho
    mprotect(region + n * 4096, 4096, PROT_READ | PROT_WRITE);
    memcpy(region + n * 4096, buf, sizeof buf);          // 5-6. "trang đây", ánh xạ vào
    printf("  [pager] fault on page %ld -&gt; loaded from the store\\n", n);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    long r = syscall(SYS_userfaultfd, 0);                // API thật của Linux cho việc này (4.3+), nếu nhân có
    printf("userfaultfd(): %s\\n", r &lt; 0 ? strerror(errno) : "available");
    store = open("kho.bin", O_RDWR | O_CREAT | O_TRUNC, 0644);
    for (int i = 0; i &lt; PAGES; i++) { char buf[4096]; memset(buf, 0, sizeof buf); snprintf(buf, sizeof buf, "this is page %d, from the store", i); write(store, buf, sizeof buf); }
    region = mmap(NULL, PAGES * 4096, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    struct sigaction sa = {0};
    sa.sa_sigaction = pager; sa.sa_flags = SA_SIGINFO;
    sigaction(SIGSEGV, &amp;sa, NULL);
    int order[] = {2, 0, 2, 3};
    for (int k = 0; k &lt; 4; k++) {
        int i = order[k];
        printf("read page %d: \\"%s\\"\\n", i, region + i * 4096);   // 1. lần truy cập có thể gây lỗi
    }
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread pager-ngoai.c -o pager-ngoai &amp;&amp; ./pager-ngoai<br>
userfaultfd(): Function not implemented<br>
&nbsp;&nbsp;[pager] fault on page 2 -&gt; loaded from the store<br>
read page 2: "this is page 2, from the store"<br>
&nbsp;&nbsp;[pager] fault on page 0 -&gt; loaded from the store<br>
read page 0: "this is page 0, from the store"<br>
read page 2: "this is page 2, from the store"<br>
&nbsp;&nbsp;[pager] fault on page 3 -&gt; loaded from the store<br>
read page 3: "this is page 3, from the store"</div>
<p><code>userfaultfd()</code> trả lời "Function not implemented" (ENOSYS) trên nhân này. Bộ phân trang tự làm sau đó phục vụ lần chạm đầu tiên của mỗi trang từ tệp kho (bước 2–6), còn lần đọc thứ hai của trang 2 không cần bộ phân trang nữa. Thứ tự lỗi: 2, 0, 3 — đúng thứ tự chương trình chạm tới chúng lần đầu.</p>
<p class="meo">🧠 Bộ phân trang ngoài = lỗi trang là một <em>thông điệp</em> gửi cho người sở hữu vùng nhớ. Cùng khuôn với hàm "khi trượt cache thì gọi loader" của thư viện cache trong backend.</p>`],
      [42, 'Segmentation (1)',
        `<p class="y-chinh">🎯 A compiler builds many tables that grow and shrink while it runs: (1) the source text saved for the printed listing; (2) the symbol table, with names and attributes of variables; (3) the table of integer and floating-point constants used; (4) the parse tree, the syntactic analysis of the program; (5) the stack used for procedure calls within the compiler.</p>
<p>Paging gives every process <strong>one</strong> virtual address space — one long line of addresses from 0 to the maximum. That is fine for most programs, but a program with several growing and shrinking data structures, like this compiler, has a problem: each table needs room to grow, and it is impossible to know in advance how much each will need. The first four tables grow as the source is read; the stack grows and shrinks all the time.</p>
<p>The idea of <strong>segmentation</strong> (book §3.7): instead of one address space, give the program <strong>many completely independent address spaces</strong>, called <strong>segments</strong> — one per table. Each segment is a linear sequence of addresses from 0 to some maximum, and its length can change during execution. An address now has two parts: <strong>(segment number, address within the segment)</strong>.</p>
<p class="pitfall">⚠️ FE5 question 25 = FE11 question 24: "a straightforward and quite general solution is to provide the machine with many completely independent address spaces, which is called ___" = <strong>segments</strong>. FE20 q47 = FE28 q18: an address in segmented memory has the form <strong>&lt;segment-number, offset&gt;</strong>.</p>`,
        `<p class="y-chinh">🎯 Một trình biên dịch dựng nhiều bảng lớn lên và nhỏ đi trong lúc chạy: (1) văn bản nguồn lưu lại để in bản liệt kê; (2) bảng ký hiệu, chứa tên và thuộc tính của biến; (3) bảng các hằng số nguyên và số thực được dùng; (4) cây cú pháp, kết quả phân tích cú pháp chương trình; (5) ngăn xếp dùng cho các lời gọi thủ tục bên trong trình biên dịch.</p>
<p>Phân trang cho mỗi tiến trình <strong>một</strong> không gian địa chỉ ảo — một dải địa chỉ dài từ 0 tới tối đa. Thế là ổn với phần lớn chương trình, nhưng một chương trình có nhiều cấu trúc dữ liệu lớn lên nhỏ đi, như trình biên dịch này, gặp rắc rối: bảng nào cũng cần chỗ để lớn, và không thể biết trước mỗi bảng cần bao nhiêu. Bốn bảng đầu lớn dần khi đọc mã nguồn; ngăn xếp thì lớn nhỏ liên tục.</p>
<p>Ý tưởng của <strong>phân đoạn (segmentation)</strong> (sách §3.7): thay vì một không gian địa chỉ, cho chương trình <strong>nhiều không gian địa chỉ hoàn toàn độc lập</strong>, gọi là <strong>đoạn (segment)</strong> — mỗi bảng một đoạn. Mỗi đoạn là một dãy địa chỉ tuyến tính từ 0 tới một mức tối đa nào đó, và độ dài của nó thay đổi được trong lúc chạy. Địa chỉ giờ có hai phần: <strong>(số đoạn, địa chỉ trong đoạn)</strong>.</p>
<p class="pitfall">⚠️ FE5 câu 25 = FE11 câu 24: "một giải pháp thẳng thắn và khá tổng quát là cho máy rất nhiều không gian địa chỉ hoàn toàn độc lập, gọi là ___" = <strong>segments</strong>. FE20 c47 = FE28 c18: địa chỉ trong bộ nhớ phân đoạn có dạng <strong>&lt;segment-number, offset&gt;</strong>.</p>`],
      [43, 'Segmentation (2)',
        `<p class="y-chinh">🎯 Figure 3-30: in a <strong>one-dimensional</strong> address space with growing tables, one table may <strong>bump into another</strong>. Here the symbol table has grown until it ran into the source-text table, while there is still plenty of free space elsewhere (above the constant table, above the parse tree).</p>
<p>With one linear address space, the compiler would have to place the five tables at fixed positions with gaps between them. Whatever gaps it chooses, some program will overflow one table while another has space to spare: a program with many variables but few constants fills the symbol table and stops with "too many variables", though memory is free. The programmer — or the compiler writer — could move tables around by hand, the way overlays were managed: tedious, and exactly the kind of bookkeeping an OS should do. Paging does not help here: paging makes the single address space <em>large</em>, but it is still one line, and tables placed on it still collide.</p>
<p>➕ Today a process's virtual space is so large (128 TiB for user space on x86-64 and ARM64) that the OS simply places each growing region far apart: Linux puts the heap after the program, the stack near the top, and every <code>mmap</code> region (libraries, thread stacks, Java heap) in between, with gigabytes of empty addresses separating them — slide 7's run showed the heap and a separate <code>mmap</code> region. Huge sparse address spaces solved Figure 3-30 the cheap way.</p>
<p class="meo">🧠 The collision of Figure 3-30 is a problem of <em>address space</em>, not of physical memory: physical frames are allocated page by page anyway.</p>`,
        `<p class="y-chinh">🎯 Hình 3-30: trong không gian địa chỉ <strong>một chiều</strong> có các bảng đang lớn, một bảng có thể <strong>đâm vào bảng khác</strong>. Ở đây bảng ký hiệu đã lớn tới mức chạm vào bảng văn bản nguồn, trong khi chỗ khác còn rất nhiều khoảng trống (phía trên bảng hằng, phía trên cây cú pháp).</p>
<p>Với một không gian địa chỉ tuyến tính, trình biên dịch phải đặt năm bảng ở các vị trí cố định có khoảng hở giữa chúng. Chừa khoảng hở thế nào thì cũng có chương trình làm tràn một bảng trong khi bảng khác dư chỗ: chương trình nhiều biến mà ít hằng sẽ lấp đầy bảng ký hiệu rồi dừng với lỗi "quá nhiều biến", dù bộ nhớ vẫn còn trống. Lập trình viên — hay người viết trình biên dịch — có thể tự dời các bảng, kiểu quản lý overlay: tẻ nhạt, và đúng loại sổ sách mà HĐH nên làm. Phân trang không giúp được ở đây: phân trang làm không gian địa chỉ duy nhất trở nên <em>lớn</em>, nhưng nó vẫn là một dải, và các bảng đặt trên đó vẫn va nhau.</p>
<p>➕ Ngày nay không gian ảo của tiến trình lớn tới mức (128 TiB cho phần người dùng trên x86-64 và ARM64) HĐH chỉ việc đặt mỗi vùng biết lớn cách xa nhau: Linux đặt heap sau chương trình, ngăn xếp gần đỉnh, và mọi vùng <code>mmap</code> (thư viện, ngăn xếp của luồng, heap của Java) ở giữa, cách nhau hàng gigabyte địa chỉ trống — lần chạy ở slide 7 đã cho thấy heap và một vùng <code>mmap</code> riêng. Không gian địa chỉ khổng lồ, thưa thớt đã giải Hình 3-30 theo cách rẻ tiền.</p>
<p class="meo">🧠 Cú va của Hình 3-30 là vấn đề của <em>không gian địa chỉ</em>, không phải của bộ nhớ vật lý: khung vật lý vẫn được cấp từng trang một.</p>`],
      [44, 'Segmentation (3)',
        `<p class="y-chinh">🎯 Figure 3-31: a segmented memory lets each table <strong>grow or shrink independently</strong>: segment 0 = symbol table (up to 20K), 1 = source text, 2 = constants (small), 3 = parse tree, 4 = call stack. Each segment starts at its own address 0.</p>
<p>A segment is a <strong>logical entity</strong>, which the programmer knows about and uses as a logical entity: it might hold a procedure, an array, a stack, a collection of variables — but usually not a mixture. Benefits beyond growth: (1) <strong>linking is simpler</strong> — if each procedure is in its own segment starting at 0, a call goes to (segment n, 0), and recompiling procedure n does not shift any other procedure's addresses; (2) <strong>sharing</strong> — a shared library can be one segment shared by many processes; (3) <strong>protection</strong> per segment — a procedure segment can be execute-only, an array segment read/write, which catches many bugs. Translation uses a <strong>segment table</strong>: each entry has the segment's <strong>base</strong> (where it starts in physical memory) and its <strong>limit</strong> (its length). The simulator runs the segment table of a real exam:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0844c2ed8d17a87dffff7730aada4c7fb2624eb2.svg" alt="FE2 (SP26-RE) question 45: (2, 50) → 90 + 50 = 140; (4, 112) traps because 112 ≥ 96" loading="lazy" /><p class="chu-thich">🧮 FE2 (SP26-RE) question 45: (2, 50) → 90 + 50 = 140; (4, 112) traps because 112 ≥ 96</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BANG_DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const THU = [[2, 50], [0, 430], [1, 10], [3, 400], [4, 112]];
/** Bộ nhớ = danh sách khối từ địa chỉ 0 lên: { ten | null (lỗ), co (K) }. thay(): đoạn mới vào CHỖ đoạn cũ, phần dư thành lỗ. */
function thay(mem, cu, moi, co) {
  const ra = [];
  for (const b of mem) {
    if (b.ten !== cu) { ra.push({ ...b }); continue; }
    ra.push({ ten: moi, co });
    if (b.co - co &gt; 0) ra.push({ ten: null, co: b.co - co });
  }
  return ra;
}
const don = (mem) =&gt; { const s = mem.filter((b) =&gt; b.ten !== null), lo = mem.filter((b) =&gt; b.ten === null).reduce((a, b) =&gt; a + b.co, 0); return [...s, ...(lo ? [{ ten: null, co: lo }] : [])]; };
const A = [{ ten: 0, co: 4 }, { ten: 1, co: 8 }, { ten: 2, co: 5 }, { ten: 3, co: 8 }, { ten: 4, co: 7 }];
const B = thay(A, 1, 7, 5), C = thay(B, 4, 5, 4), D = thay(C, 3, 6, 4), E = don(D);</code></pre></details>
<p>It is base-and-limit from slide 5, once per segment: check offset &lt; limit first, then add the base. Offset 112 in segment 4 is past its 96-byte length — an addressing error, trap to the OS.</p>
<p class="pitfall">⚠️ FE2 question 45: (2, 50) → <strong>140</strong>. FE10 question 22: the purpose of a segment table = <strong>map segment numbers to physical addresses</strong>. FE1 q26 = FE3 q46: NOT a benefit of segmentation = "segment addresses automatically optimize CPU scheduling".</p>`,
        `<p class="y-chinh">🎯 Hình 3-31: bộ nhớ phân đoạn cho mỗi bảng <strong>lớn lên hay nhỏ đi độc lập</strong>: đoạn 0 = bảng ký hiệu (tới 20K), 1 = văn bản nguồn, 2 = hằng (nhỏ), 3 = cây cú pháp, 4 = ngăn xếp lời gọi. Mỗi đoạn bắt đầu từ địa chỉ 0 của riêng nó.</p>
<p>Đoạn là một <strong>thực thể logic</strong>, lập trình viên biết tới và dùng như một thực thể logic: nó có thể chứa một thủ tục, một mảng, một ngăn xếp, một nhóm biến — nhưng thường không trộn lẫn. Lợi ích ngoài chuyện lớn lên: (1) <strong>liên kết đơn giản hơn</strong> — nếu mỗi thủ tục nằm trong đoạn riêng bắt đầu từ 0, lời gọi đi tới (đoạn n, 0), và biên dịch lại thủ tục n không làm xê dịch địa chỉ của thủ tục nào khác; (2) <strong>chia sẻ</strong> — một thư viện dùng chung có thể là một đoạn nhiều tiến trình cùng dùng; (3) <strong>bảo vệ</strong> theo từng đoạn — đoạn thủ tục chỉ được thực thi, đoạn mảng được đọc/ghi, bắt được nhiều lỗi. Phép dịch dùng một <strong>bảng đoạn (segment table)</strong>: mỗi mục có <strong>cơ sở (base)</strong> của đoạn (nơi nó bắt đầu trong bộ nhớ vật lý) và <strong>giới hạn (limit)</strong> (độ dài của nó). Bộ mô phỏng chạy bảng đoạn của một đề thi thật:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4935ca9e570fa8e2610bd7816b039e25a763c7b7.svg" alt="FE2 (SP26-RE) câu 45: (2, 50) → 90 + 50 = 140; (4, 112) bị bẫy vì 112 ≥ 96" loading="lazy" /><p class="chu-thich">🧮 FE2 (SP26-RE) câu 45: (2, 50) → 90 + 50 = 140; (4, 112) bị bẫy vì 112 ≥ 96</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BANG_DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const THU = [[2, 50], [0, 430], [1, 10], [3, 400], [4, 112]];
/** Bộ nhớ = danh sách khối từ địa chỉ 0 lên: { ten | null (lỗ), co (K) }. thay(): đoạn mới vào CHỖ đoạn cũ, phần dư thành lỗ. */
function thay(mem, cu, moi, co) {
  const ra = [];
  for (const b of mem) {
    if (b.ten !== cu) { ra.push({ ...b }); continue; }
    ra.push({ ten: moi, co });
    if (b.co - co &gt; 0) ra.push({ ten: null, co: b.co - co });
  }
  return ra;
}
const don = (mem) =&gt; { const s = mem.filter((b) =&gt; b.ten !== null), lo = mem.filter((b) =&gt; b.ten === null).reduce((a, b) =&gt; a + b.co, 0); return [...s, ...(lo ? [{ ten: null, co: lo }] : [])]; };
const A = [{ ten: 0, co: 4 }, { ten: 1, co: 8 }, { ten: 2, co: 5 }, { ten: 3, co: 8 }, { ten: 4, co: 7 }];
const B = thay(A, 1, 7, 5), C = thay(B, 4, 5, 4), D = thay(C, 3, 6, 4), E = don(D);</code></pre></details>
<p>Đây là cơ sở-giới hạn của slide 5, mỗi đoạn một cặp: kiểm độ dời &lt; giới hạn trước, rồi cộng cơ sở. Độ dời 112 trong đoạn 4 vượt quá độ dài 96 byte của nó — lỗi địa chỉ, bẫy vào HĐH.</p>
<p class="pitfall">⚠️ FE2 câu 45: (2, 50) → <strong>140</strong>. FE10 câu 22: mục đích của bảng đoạn = <strong>ánh xạ số đoạn sang địa chỉ vật lý</strong>. FE1 c26 = FE3 c46: KHÔNG phải lợi ích của phân đoạn = "địa chỉ đoạn tự động tối ưu lập lịch CPU".</p>`],
      [45, 'Segmentation (4)',
        `<p class="y-chinh">🎯 Figure 3-32, <strong>comparison of paging and segmentation</strong>, question by question.</p>
<table>
<thead><tr><th>Consideration</th><th>Paging</th><th>Segmentation</th></tr></thead>
<tbody>
<tr><td>Need the programmer be aware that this technique is being used?</td><td>No</td><td>Yes</td></tr>
<tr><td>How many linear address spaces are there?</td><td>1</td><td>Many</td></tr>
<tr><td>Can the total address space exceed the size of physical memory?</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Can procedures and data be distinguished and separately protected?</td><td>No</td><td>Yes</td></tr>
<tr><td>Can tables whose size fluctuates be accommodated easily?</td><td>No</td><td>Yes</td></tr>
<tr><td>Is sharing of procedures between users facilitated?</td><td>No</td><td>Yes</td></tr>
<tr><td>Why was this technique invented?</td><td>to get a large linear address space without having to buy more physical memory</td><td>to allow programs and data to be broken up into logically independent address spaces and to aid sharing and protection</td></tr>
</tbody>
</table>
<p>How to read it: paging is <strong>invisible</strong> to the programmer and solves the size problem; segmentation is <strong>visible</strong> and solves the structure problem (growth, sharing, protection by logical unit). Paging's pages have a fixed size, so it has <strong>internal fragmentation</strong> (on average half a page wasted per process — FE18 q27: the last page is partly empty); segments have variable size, so pure segmentation has <strong>external fragmentation</strong> — slide 46. That is why real systems combined them (slides 47–55).</p>
<p class="pitfall">⚠️ FE14 question 30: the DISADVANTAGE of segmentation = <strong>it can have external fragmentation</strong>. FE2 question 13: data structures that change size + simple sharing → <strong>segmentation with paging</strong>. FE4 q23 / FE8 q23 / FE13 q23 key "advantage of segmentation over paging = efficient use of memory space" is weak — the table's real answer is logical separation, growth and sharing/protection; pick it only because the other options are wrong.</p>`,
        `<p class="y-chinh">🎯 Hình 3-32, <strong>so sánh phân trang và phân đoạn</strong>, từng câu hỏi một.</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Phân trang</th><th>Phân đoạn</th></tr></thead>
<tbody>
<tr><td>Lập trình viên có cần biết kỹ thuật này đang được dùng?</td><td>Không</td><td>Có</td></tr>
<tr><td>Có bao nhiêu không gian địa chỉ tuyến tính?</td><td>1</td><td>Nhiều</td></tr>
<tr><td>Tổng không gian địa chỉ có thể vượt bộ nhớ vật lý?</td><td>Có</td><td>Có</td></tr>
<tr><td>Thủ tục và dữ liệu có tách được và bảo vệ riêng không?</td><td>Không</td><td>Có</td></tr>
<tr><td>Bảng có kích thước thay đổi có chứa dễ dàng không?</td><td>Không</td><td>Có</td></tr>
<tr><td>Có dễ chia sẻ thủ tục giữa những người dùng không?</td><td>Không</td><td>Có</td></tr>
<tr><td>Vì sao kỹ thuật này được phát minh?</td><td>để có không gian địa chỉ tuyến tính lớn mà không phải mua thêm bộ nhớ vật lý</td><td>để chia chương trình và dữ liệu thành các không gian địa chỉ độc lập về logic, hỗ trợ chia sẻ và bảo vệ</td></tr>
</tbody>
</table>
<p>Đọc thế nào: phân trang <strong>vô hình</strong> với lập trình viên và giải bài toán kích thước; phân đoạn <strong>hữu hình</strong> và giải bài toán cấu trúc (lớn lên, chia sẻ, bảo vệ theo đơn vị logic). Trang có cỡ cố định nên phân trang có <strong>phân mảnh trong (internal fragmentation)</strong> (trung bình mỗi tiến trình phí nửa trang — FE18 c27: trang cuối chỉ đầy một phần); đoạn có cỡ thay đổi nên phân đoạn thuần có <strong>phân mảnh ngoài (external fragmentation)</strong> — slide 46. Vì thế hệ thống thật kết hợp hai cách (slide 47–55).</p>
<p class="pitfall">⚠️ FE14 câu 30: NHƯỢC ĐIỂM của phân đoạn = <strong>có thể bị phân mảnh ngoài</strong>. FE2 câu 13: cấu trúc dữ liệu đổi cỡ + chia sẻ đơn giản → <strong>phân đoạn có phân trang (segmentation with paging)</strong>. Khoá của FE4 c23 / FE8 c23 / FE13 c23 "ưu điểm của phân đoạn so với phân trang = dùng bộ nhớ hiệu quả" là yếu — câu trả lời thật của bảng là tách logic, lớn lên được, chia sẻ/bảo vệ; chỉ chọn nó vì các phương án kia sai.</p>`],
      [46, 'Implementation of Pure Segmentation',
        `<p class="y-chinh">🎯 Figure 3-33: (a)–(d) development of <strong>checkerboarding</strong> — as segments are replaced by smaller ones, memory fills with holes between segments; (e) removal of the checkerboarding by <strong>compaction</strong>.</p>
<p>Pure segmentation differs from paging in one essential way: pages are all the same size, segments are not. When a segment is replaced by a smaller one, the leftover becomes a hole. After a while memory is divided into chunks, some holding segments and some holding holes — <strong>checkerboarding</strong> or <strong>external fragmentation</strong>. The simulator replays the figure in a 32-KB memory:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e59e70551bfdbb786c52caaf804ed6f4cef1922b.svg" alt="Checkerboarding: 10K free in three holes, but a 5K segment does not fit; compaction joins them" loading="lazy" /><p class="chu-thich">🧮 Checkerboarding: 10K free in three holes, but a 5K segment does not fit; compaction joins them</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BANG_DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const THU = [[2, 50], [0, 430], [1, 10], [3, 400], [4, 112]];
/** Bộ nhớ = danh sách khối từ địa chỉ 0 lên: { ten | null (lỗ), co (K) }. thay(): đoạn mới vào CHỖ đoạn cũ, phần dư thành lỗ. */
function thay(mem, cu, moi, co) {
  const ra = [];
  for (const b of mem) {
    if (b.ten !== cu) { ra.push({ ...b }); continue; }
    ra.push({ ten: moi, co });
    if (b.co - co &gt; 0) ra.push({ ten: null, co: b.co - co });
  }
  return ra;
}
const don = (mem) =&gt; { const s = mem.filter((b) =&gt; b.ten !== null), lo = mem.filter((b) =&gt; b.ten === null).reduce((a, b) =&gt; a + b.co, 0); return [...s, ...(lo ? [{ ten: null, co: lo }] : [])]; };
const A = [{ ten: 0, co: 4 }, { ten: 1, co: 8 }, { ten: 2, co: 5 }, { ten: 3, co: 8 }, { ten: 4, co: 7 }];
const B = thay(A, 1, 7, 5), C = thay(B, 4, 5, 4), D = thay(C, 3, 6, 4), E = don(D);</code></pre></details>
<p>After (d), 10 KB are free, but the biggest hole is only 4 KB — a 5-KB segment cannot be placed. Compaction (e) moves all segments together so the free space becomes one 10-KB hole; it costs copying, which is why pure segmentation is rare. Placing segments in holes uses the same first/best/worst fit choices as slide 10. ➕ The same problem appears in user space: a long-running process that <code>malloc</code>s and <code>free</code>s objects of many sizes fragments its heap — one reason Java and .NET use <strong>compacting garbage collectors</strong> that move objects together.</p>
<p class="meo">🧠 Internal fragmentation = waste <em>inside</em> a fixed-size block (paging). External fragmentation = waste <em>between</em> variable-size blocks (segmentation, contiguous allocation).</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Segmentation the way the FE asks it: check the offset against the limit first, then add the base.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-seg os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> segment table: base + offset, or a trap <a href="/os-lab?sim=addr-split&amp;preset=seg&amp;lang=en&amp;tour=addr-split-size" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Read (2, 250) ⇒ 900 + 250 = 1150 and (1, 130) ⇒ TRAP, because 130 is not below the limit 120.</li><li>Try other (segment, offset) pairs and say the answer before the page shows it.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Hình 3-33: (a)–(d) sự hình thành <strong>bàn cờ (checkerboarding)</strong> — khi các đoạn bị thay bằng đoạn nhỏ hơn, bộ nhớ đầy những lỗ xen giữa các đoạn; (e) xoá bàn cờ bằng <strong>dồn bộ nhớ (compaction)</strong>.</p>
<p>Phân đoạn thuần khác phân trang ở một điểm cốt lõi: trang đều cùng cỡ, đoạn thì không. Khi một đoạn bị thay bằng đoạn nhỏ hơn, phần dư thành một lỗ. Lâu dần bộ nhớ chia thành nhiều khúc, khúc thì chứa đoạn, khúc thì là lỗ — gọi là <strong>bàn cờ</strong> hay <strong>phân mảnh ngoài (external fragmentation)</strong>. Bộ mô phỏng chạy lại hình trong bộ nhớ 32 KB:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/76855127add251b404d2945a53105c4ae17b5d6d.svg" alt="Bàn cờ: trống 10K chia ba lỗ, nhưng đoạn 5K không vừa; dồn bộ nhớ gom chúng lại" loading="lazy" /><p class="chu-thich">🧮 Bàn cờ: trống 10K chia ba lỗ, nhưng đoạn 5K không vừa; dồn bộ nhớ gom chúng lại</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BANG_DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const THU = [[2, 50], [0, 430], [1, 10], [3, 400], [4, 112]];
/** Bộ nhớ = danh sách khối từ địa chỉ 0 lên: { ten | null (lỗ), co (K) }. thay(): đoạn mới vào CHỖ đoạn cũ, phần dư thành lỗ. */
function thay(mem, cu, moi, co) {
  const ra = [];
  for (const b of mem) {
    if (b.ten !== cu) { ra.push({ ...b }); continue; }
    ra.push({ ten: moi, co });
    if (b.co - co &gt; 0) ra.push({ ten: null, co: b.co - co });
  }
  return ra;
}
const don = (mem) =&gt; { const s = mem.filter((b) =&gt; b.ten !== null), lo = mem.filter((b) =&gt; b.ten === null).reduce((a, b) =&gt; a + b.co, 0); return [...s, ...(lo ? [{ ten: null, co: lo }] : [])]; };
const A = [{ ten: 0, co: 4 }, { ten: 1, co: 8 }, { ten: 2, co: 5 }, { ten: 3, co: 8 }, { ten: 4, co: 7 }];
const B = thay(A, 1, 7, 5), C = thay(B, 4, 5, 4), D = thay(C, 3, 6, 4), E = don(D);</code></pre></details>
<p>Sau (d), có 10 KB trống, nhưng lỗ lớn nhất chỉ 4 KB — không đặt được đoạn 5 KB. Dồn bộ nhớ (e) dời mọi đoạn sát nhau để chỗ trống thành một lỗ 10 KB; cái giá là chép dữ liệu, vì thế phân đoạn thuần hiếm gặp. Đặt đoạn vào lỗ dùng đúng các lựa chọn first/best/worst fit của slide 10. ➕ Bài toán y hệt xuất hiện ở không gian người dùng: một tiến trình chạy lâu, <code>malloc</code> và <code>free</code> đủ loại kích thước sẽ làm phân mảnh heap của nó — một lý do Java và .NET dùng <strong>bộ thu gom rác có dồn (compacting GC)</strong>, dời các đối tượng sát lại với nhau.</p>
<p class="meo">🧠 Phân mảnh trong = phí <em>bên trong</em> một khối cỡ cố định (phân trang). Phân mảnh ngoài = phí <em>giữa</em> các khối cỡ thay đổi (phân đoạn, cấp phát liên tục).</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Phân đoạn đúng kiểu đề FE hỏi: so độ dời với limit trước, rồi mới cộng base.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-seg os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> bảng đoạn: base + độ dời, hoặc trap <a href="/os-lab?sim=addr-split&amp;preset=seg&amp;lang=vi&amp;tour=addr-split-size" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Đọc (2, 250) ⇒ 900 + 250 = 1150 và (1, 130) ⇒ TRAP, vì 130 không nhỏ hơn limit 120.</li><li>Thử các cặp (đoạn, độ dời) khác và nói đáp án trước khi trang hiện ra.</li></ol></div>
</div>`],
      [47, 'Segmentation with Paging: MULTICS (1)',
        `<p class="y-chinh">🎯 Figure 3-34(a), the MULTICS virtual memory: each process has a <strong>descriptor segment</strong> — a table with one 36-bit descriptor per segment (segment 0, 1, 2, …). Each descriptor points to the <strong>page table of its segment</strong>: every segment is itself paged.</p>
<p>MULTICS (designed at MIT from the mid-1960s, running until 2000) wanted both worlds: segmentation's logical structure and paging's freedom from external fragmentation. Large segments are a problem for pure segmentation — a segment must fit entirely in memory. The answer: <strong>page the segments</strong>. Only the pages of a segment that are actually needed are in memory. A MULTICS program could have up to 2¹⁸ = 262,144 segments, each up to 65,536 (36-bit) words long. The descriptor segment itself was paged too.</p>
<p>The road from address to word therefore has two tables: the segment number selects a descriptor in the descriptor segment; the descriptor gives the page table of that segment; the page number selects a page frame; the offset selects the word (slide 50). MULTICS was hugely influential: its ideas (hierarchical file system, protection rings, dynamic linking) reappear all over UNIX — whose name is a pun on MULTICS.</p>
<p class="pitfall">⚠️ FE6 question 22 = FE7 q25 = FE12 q23: segmentation with paging = <strong>a method that combines the flexibility of segmentation with the efficiency of paging</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 3-34(a), bộ nhớ ảo của MULTICS: mỗi tiến trình có một <strong>đoạn mô tả (descriptor segment)</strong> — một bảng, mỗi đoạn một bộ mô tả 36 bit (đoạn 0, 1, 2, …). Mỗi bộ mô tả trỏ tới <strong>bảng trang của đoạn đó</strong>: mỗi đoạn tự nó lại được phân trang.</p>
<p>MULTICS (thiết kế ở MIT từ giữa thập niên 1960, chạy tới năm 2000) muốn cả hai thế giới: cấu trúc logic của phân đoạn và sự thoát khỏi phân mảnh ngoài của phân trang. Đoạn lớn là rắc rối với phân đoạn thuần — đoạn phải nằm trọn trong bộ nhớ. Lời giải: <strong>phân trang các đoạn</strong>. Chỉ những trang của đoạn thật sự cần mới nằm trong bộ nhớ. Một chương trình MULTICS có thể có tới 2¹⁸ = 262.144 đoạn, mỗi đoạn dài tới 65.536 từ (36 bit). Bản thân đoạn mô tả cũng được phân trang.</p>
<p>Đường đi từ địa chỉ tới từ nhớ vì thế có hai bảng: số đoạn chọn một bộ mô tả trong đoạn mô tả; bộ mô tả cho bảng trang của đoạn đó; số trang chọn một khung trang; độ dời chọn từ nhớ (slide 50). MULTICS có ảnh hưởng rất lớn: các ý tưởng của nó (hệ thống tệp phân cấp, vòng bảo vệ, liên kết động) xuất hiện khắp UNIX — cái tên UNIX vốn là một cách chơi chữ với MULTICS.</p>
<p class="pitfall">⚠️ FE6 câu 22 = FE7 c25 = FE12 c23: phân đoạn có phân trang = <strong>phương pháp kết hợp sự linh hoạt của phân đoạn với hiệu quả của phân trang</strong>.</p>`],
      [48, 'Segmentation with Paging: MULTICS (2)',
        `<p class="y-chinh">🎯 Figure 3-34(b), a MULTICS <strong>segment descriptor</strong> (36 bits): 18-bit main memory address of the page table, 9-bit segment length (in pages), 1 bit page size (0 = 1024 words, 1 = 64 words), 1 bit "0 = segment is paged, 1 = not paged", one unused bit, 3 miscellaneous bits, 3 protection bits.</p>
<p>Field by field: the <strong>page table address</strong> has only 18 bits although physical addresses were 24 bits, because page tables were aligned on 64-word boundaries (the low 6 bits are always 0). The <strong>segment length in pages</strong> lets the hardware check that the page number is inside the segment (a limit check, as in slide 5, but counted in pages). Two <strong>page sizes</strong> existed — 1,024 words for normal segments, 64 words for small ones — and a segment could even be <strong>unpaged</strong> (stored contiguously). The <strong>protection</strong> bits say whether the segment can be read, written, executed.</p>
<table>
<thead><tr><th>Field</th><th>Bits</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>main memory address of the page table</td><td>18</td><td>where this segment's page table starts</td></tr>
<tr><td>segment length</td><td>9</td><td>in pages (up to 2⁹ = 512 pages — see note)</td></tr>
<tr><td>page size</td><td>1</td><td>0 = 1024-word pages, 1 = 64-word pages</td></tr>
<tr><td>paged?</td><td>1</td><td>0 = segment is paged, 1 = not paged</td></tr>
<tr><td>miscellaneous / protection</td><td>3 + 3</td><td>access rights and housekeeping</td></tr>
</tbody>
</table>
<p>Note: a 9-bit length in 1024-word pages would allow 512K words, but addresses inside a segment have only 16 bits (6-bit page + 10-bit offset, slide 49), so a segment is limited to 64 pages = 65,536 words.</p>
<p class="meo">🧠 A descriptor = base (where its page table is) + limit (how long) + protection. The same three things appear in the x86 descriptor of slide 53.</p>`,
        `<p class="y-chinh">🎯 Hình 3-34(b), một <strong>bộ mô tả đoạn (segment descriptor)</strong> của MULTICS (36 bit): 18 bit địa chỉ bộ nhớ chính của bảng trang, 9 bit độ dài đoạn (tính theo trang), 1 bit cỡ trang (0 = 1024 từ, 1 = 64 từ), 1 bit "0 = đoạn được phân trang, 1 = không phân trang", một bit bỏ trống, 3 bit linh tinh, 3 bit bảo vệ.</p>
<p>Từng trường: <strong>địa chỉ bảng trang</strong> chỉ có 18 bit dù địa chỉ vật lý dài 24 bit, vì bảng trang được canh theo ranh giới 64 từ (6 bit thấp luôn bằng 0). <strong>Độ dài đoạn tính theo trang</strong> cho phần cứng kiểm số trang có nằm trong đoạn không (kiểm giới hạn như slide 5, nhưng đếm bằng trang). Có hai <strong>cỡ trang</strong> — 1.024 từ cho đoạn thường, 64 từ cho đoạn nhỏ — và một đoạn thậm chí có thể <strong>không phân trang</strong> (lưu liên tục). Các bit <strong>bảo vệ</strong> cho biết đoạn được đọc, ghi, thực thi hay không.</p>
<table>
<thead><tr><th>Trường</th><th>Số bit</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td>địa chỉ bộ nhớ chính của bảng trang</td><td>18</td><td>bảng trang của đoạn này bắt đầu ở đâu</td></tr>
<tr><td>độ dài đoạn</td><td>9</td><td>tính bằng trang (tới 2⁹ = 512 trang — xem chú ý)</td></tr>
<tr><td>cỡ trang</td><td>1</td><td>0 = trang 1024 từ, 1 = trang 64 từ</td></tr>
<tr><td>có phân trang?</td><td>1</td><td>0 = đoạn được phân trang, 1 = không</td></tr>
<tr><td>linh tinh / bảo vệ</td><td>3 + 3</td><td>quyền truy cập và việc quản lý</td></tr>
</tbody>
</table>
<p>Chú ý: 9 bit độ dài với trang 1024 từ cho phép 512K từ, nhưng địa chỉ bên trong đoạn chỉ có 16 bit (6 bit trang + 10 bit độ dời, slide 49), nên một đoạn tối đa 64 trang = 65.536 từ.</p>
<p class="meo">🧠 Một bộ mô tả = cơ sở (bảng trang của nó ở đâu) + giới hạn (dài bao nhiêu) + bảo vệ. Đúng ba thứ đó lại xuất hiện trong bộ mô tả x86 ở slide 53.</p>`],
      [49, 'Segmentation with Paging: MULTICS (3)',
        `<p class="y-chinh">🎯 Figure 3-35: a <strong>34-bit MULTICS virtual address</strong> = an 18-bit <strong>segment number</strong> + an "address within the segment" made of a 6-bit <strong>page number</strong> and a 10-bit <strong>offset within the page</strong>.</p>
<p>The numbers fit together: 18 bits → 2¹⁸ = 262,144 segments; 6 + 10 = 16 bits → 2¹⁶ = 65,536 words per segment = 64 pages of 1,024 words. The machine word was 36 bits, so a segment held up to 65,536 × 36 bits ≈ 288 KB — tiny today, generous in 1965. The simulator splits an address and looks it up in the MULTICS TLB of slide 51:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a6ba6a5384500530b00db691af928f2a0ece7c7b.svg" alt="A 34-bit MULTICS address split 18 | 6 | 10, then looked up in the TLB of Figure 3-37" loading="lazy" /><p class="chu-thich">🧮 A 34-bit MULTICS address split 18 | 6 | 10, then looked up in the TLB of Figure 3-37</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TLB_MULTICS = [  // Figure 3-37: segment, virtual page, page frame, protection, age
  { doan: 4, trang: 1, khung: 7, bv: 'Read/write', tuoi: 13 }, { doan: 6, trang: 0, khung: 2, bv: 'Read only', tuoi: 10 },
  { doan: 12, trang: 3, khung: 1, bv: 'Read/write', tuoi: 2 }, { doan: 2, trang: 1, khung: 0, bv: 'Execute only', tuoi: 7 },
  { doan: 2, trang: 2, khung: 12, bv: 'Execute only', tuoi: 9 },
];
const THU = [[2, 2, 100], [4, 1, 7], [6, 1, 0], [12, 3, 1023]];
const SELECTOR = [0x33, 0x2b, 0x10];
const TUYEN = 0x0804A123;</code></pre></details>
<p>(2, 2, 100) is segment 2, page 2, word 100 — as one 34-bit number, 2 × 2¹⁶ + 2 × 2¹⁰ + 100 = 133,220. Splitting by bit fields is the same skill as slide 14 and slide 18, just with a segment field in front.</p>
<p class="meo">🧠 Count bits, not words: field width w ⇒ 2ʷ possible values. Segment field 18 bits ⇒ 262,144 segments; offset 10 bits ⇒ 1,024-word pages.</p>`,
        `<p class="y-chinh">🎯 Hình 3-35: một <strong>địa chỉ ảo MULTICS 34 bit</strong> = 18 bit <strong>số đoạn</strong> + "địa chỉ trong đoạn" gồm 6 bit <strong>số trang</strong> và 10 bit <strong>độ dời trong trang</strong>.</p>
<p>Các con số ăn khớp: 18 bit → 2¹⁸ = 262.144 đoạn; 6 + 10 = 16 bit → 2¹⁶ = 65.536 từ mỗi đoạn = 64 trang 1.024 từ. Từ máy dài 36 bit, nên một đoạn chứa tới 65.536 × 36 bit ≈ 288 KB — tí hon bây giờ, rộng rãi năm 1965. Bộ mô phỏng tách một địa chỉ và tra nó trong TLB MULTICS của slide 51:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ce7e53317a692fca1d8a0244005979179c257a48.svg" alt="Một địa chỉ MULTICS 34 bit tách 18 | 6 | 10, rồi tra trong TLB của Hình 3-37" loading="lazy" /><p class="chu-thich">🧮 Một địa chỉ MULTICS 34 bit tách 18 | 6 | 10, rồi tra trong TLB của Hình 3-37</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TLB_MULTICS = [  // Figure 3-37: segment, virtual page, page frame, protection, age
  { doan: 4, trang: 1, khung: 7, bv: 'Read/write', tuoi: 13 }, { doan: 6, trang: 0, khung: 2, bv: 'Read only', tuoi: 10 },
  { doan: 12, trang: 3, khung: 1, bv: 'Read/write', tuoi: 2 }, { doan: 2, trang: 1, khung: 0, bv: 'Execute only', tuoi: 7 },
  { doan: 2, trang: 2, khung: 12, bv: 'Execute only', tuoi: 9 },
];
const THU = [[2, 2, 100], [4, 1, 7], [6, 1, 0], [12, 3, 1023]];
const SELECTOR = [0x33, 0x2b, 0x10];
const TUYEN = 0x0804A123;</code></pre></details>
<p>(2, 2, 100) là đoạn 2, trang 2, từ thứ 100 — viết thành một số 34 bit, 2 × 2¹⁶ + 2 × 2¹⁰ + 100 = 133.220. Tách theo trường bit là cùng kỹ năng của slide 14 và slide 18, chỉ thêm trường đoạn ở phía trước.</p>
<p class="meo">🧠 Đếm bit, không đếm từ: trường rộng w bit ⇒ 2ʷ giá trị. Trường đoạn 18 bit ⇒ 262.144 đoạn; độ dời 10 bit ⇒ trang 1.024 từ.</p>`],
      [50, 'Segmentation with Paging: MULTICS (4)',
        `<p class="y-chinh">🎯 Figure 3-36: converting a two-part MULTICS address into a main memory address: the <strong>segment number</strong> selects a <strong>descriptor</strong> in the descriptor segment; the descriptor locates the segment's <strong>page table</strong>; the <strong>page number</strong> selects the <strong>page frame</strong>; the <strong>offset</strong> selects the <strong>word</strong> in the page.</p>
<p>The book's step-by-step version: (1) use the segment number to find the segment descriptor; (2) check whether the segment's page table is in memory — if it is, locate it; if not, a <strong>segment fault</strong> occurs; if there is a protection violation, a fault (trap) occurs; (3) examine the page table entry for the requested virtual page — if the page itself is not in memory, a <strong>page fault</strong> occurs; if it is, the start of the page in main memory is taken from the entry; (4) add the offset to the page origin to get the main memory address; (5) the read or store finally takes place.</p>
<p>Done literally, that is three memory references (descriptor, page table entry, the word) for every instruction operand — far too slow. So MULTICS, like every paged machine, put a <strong>TLB</strong> in front of the whole procedure: slide 51.</p>
<p class="meo">🧠 Two kinds of fault on MULTICS: segment fault (the segment's page table is not in memory) and page fault (the page is not in memory). Plus protection faults, as everywhere.</p>`,
        `<p class="y-chinh">🎯 Hình 3-36: đổi một địa chỉ MULTICS hai phần thành địa chỉ bộ nhớ chính: <strong>số đoạn</strong> chọn một <strong>bộ mô tả</strong> trong đoạn mô tả; bộ mô tả chỉ ra <strong>bảng trang</strong> của đoạn; <strong>số trang</strong> chọn <strong>khung trang</strong>; <strong>độ dời</strong> chọn <strong>từ nhớ</strong> trong trang.</p>
<p>Phiên bản từng bước của sách: (1) dùng số đoạn để tìm bộ mô tả đoạn; (2) kiểm bảng trang của đoạn có trong bộ nhớ không — có thì tìm nó; không thì xảy ra <strong>lỗi đoạn (segment fault)</strong>; vi phạm bảo vệ thì xảy ra lỗi (bẫy); (3) xem mục bảng trang của trang ảo được yêu cầu — nếu chính trang đó không ở bộ nhớ thì xảy ra <strong>lỗi trang</strong>; nếu có, lấy điểm đầu của trang trong bộ nhớ chính từ mục đó; (4) cộng độ dời vào điểm đầu trang để có địa chỉ bộ nhớ chính; (5) cuối cùng việc đọc hay ghi mới diễn ra.</p>
<p>Làm đúng từng chữ như vậy thì mỗi toán hạng của mỗi lệnh tốn ba lần truy cập bộ nhớ (bộ mô tả, mục bảng trang, từ nhớ) — quá chậm. Vì thế MULTICS, như mọi máy phân trang, đặt một <strong>TLB</strong> trước toàn bộ quy trình: slide 51.</p>
<p class="meo">🧠 MULTICS có hai loại lỗi: lỗi đoạn (bảng trang của đoạn không ở bộ nhớ) và lỗi trang (trang không ở bộ nhớ). Cộng thêm lỗi bảo vệ, như ở mọi nơi.</p>`],
      [51, 'Segmentation with Paging: MULTICS (5)',
        `<p class="y-chinh">🎯 Figure 3-37: a simplified MULTICS <strong>TLB</strong>: each entry holds a comparison field (segment number + virtual page), the page frame, the protection, an age, and an "is this entry used?" bit. The existence of two page sizes made the real TLB more complicated.</p>
<p>The MULTICS hardware had a 16-entry high-speed TLB searched in parallel. On a reference, the hardware first checks whether the (segment, page) pair is in the TLB; if so, the page frame comes directly from it and the descriptor/page-table walk of slide 50 is skipped. If not, the walk is done and the result replaces the entry with the <strong>oldest age</strong> — the age field is for LRU-style replacement inside the TLB. The simulator ran four addresses through the figure's TLB (slide 49): (2, 2, 100) hits with frame 12 and execute-only protection; (6, 1, 0) misses, because the TLB has segment 6 page 0 but not page 1.</p>
<p>Because programs have locality, a small TLB achieves a very high hit rate — the same reason the 4-entry TLB of slide 17 caught almost everything in a sequential scan. ➕ The "is this entry used?" bit is the valid bit of Figure 3-12; modern TLBs add an address-space ID instead of being flushed on every process switch.</p>
<p class="meo">🧠 Every serious paging design ends with a TLB, because walking tables on every reference costs 2–5 extra memory reads.</p>`,
        `<p class="y-chinh">🎯 Hình 3-37: một <strong>TLB</strong> MULTICS rút gọn: mỗi mục giữ trường so sánh (số đoạn + trang ảo), khung trang, bảo vệ, tuổi, và một bit "mục này có đang dùng?". Việc có hai cỡ trang làm TLB thật phức tạp hơn.</p>
<p>Phần cứng MULTICS có một TLB tốc độ cao 16 mục, tìm song song. Ở mỗi lần tham chiếu, phần cứng trước hết kiểm cặp (đoạn, trang) có trong TLB không; có thì lấy khung trang ngay từ đó và bỏ qua việc đi qua bộ mô tả/bảng trang của slide 50. Không có thì đi hết quy trình và kết quả thay vào mục có <strong>tuổi lớn nhất (cũ nhất)</strong> — trường tuổi để thay kiểu LRU ngay trong TLB. Bộ mô phỏng đã chạy bốn địa chỉ qua TLB của hình (slide 49): (2, 2, 100) trúng với khung 12 và bảo vệ chỉ-thực-thi; (6, 1, 0) trượt, vì TLB có đoạn 6 trang 0 chứ không có trang 1.</p>
<p>Vì chương trình có tính cục bộ, một TLB nhỏ vẫn đạt tỉ lệ trúng rất cao — cùng lý do TLB 4 mục ở slide 17 bắt được gần hết khi quét tuần tự. ➕ Bit "mục này có đang dùng?" chính là bit hợp lệ của Hình 3-12; TLB hiện đại thêm mã không gian địa chỉ thay vì bị xoá sạch mỗi lần chuyển tiến trình.</p>
<p class="meo">🧠 Thiết kế phân trang nghiêm túc nào cũng kết thúc bằng một TLB, vì đi qua các bảng ở mỗi lần tham chiếu tốn thêm 2–5 lần đọc bộ nhớ.</p>`],
      [52, 'Segmentation with Paging: The Intel x86 (1)',
        `<p class="y-chinh">🎯 Figure 3-38: an x86 <strong>selector</strong> — a 16-bit value loaded into a segment register (CS, DS, …): a 13-bit <strong>index</strong>, 1 bit for the table (<strong>0 = GDT</strong>, 1 = LDT) and a 2-bit <strong>privilege level</strong> (0–3).</p>
<p>The x86 virtual memory (from the 80386 until x86-64) resembled MULTICS: segments, and paging underneath. Its heart is two tables: the <strong>LDT</strong> (local descriptor table, one per program: its code, data, stack…) and the <strong>GDT</strong> (global descriptor table, one for the whole system: mostly OS segments). To use a segment, a program loads its selector into one of the six segment registers — CS holds the code selector, DS the data selector. With 13 index bits, each table can hold up to 2¹³ = 8,192 descriptors. The selector is not decoded by hand on real systems, but here are the three values Linux on x86-64 really loads, from the kernel source:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d1e41ecb5ff995e40b8f97a9ac3cd1ce2c24e369.svg" alt="Linux x86-64 selectors: 0x33 = GDT entry 6, privilege 3 (user code); 0x2b = entry 5 (user data); 0x10 = entry 2, privilege 0 (kernel code)" loading="lazy" /><p class="chu-thich">🧮 Linux x86-64 selectors: 0x33 = GDT entry 6, privilege 3 (user code); 0x2b = entry 5 (user data); 0x10 = entry 2, privilege 0 (kernel code)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TLB_MULTICS = [  // Figure 3-37: segment, virtual page, page frame, protection, age
  { doan: 4, trang: 1, khung: 7, bv: 'Read/write', tuoi: 13 }, { doan: 6, trang: 0, khung: 2, bv: 'Read only', tuoi: 10 },
  { doan: 12, trang: 3, khung: 1, bv: 'Read/write', tuoi: 2 }, { doan: 2, trang: 1, khung: 0, bv: 'Execute only', tuoi: 7 },
  { doan: 2, trang: 2, khung: 12, bv: 'Execute only', tuoi: 9 },
];
const THU = [[2, 2, 100], [4, 1, 7], [6, 1, 0], [12, 3, 1023]];
const SELECTOR = [0x33, 0x2b, 0x10];
const TUYEN = 0x0804A123;</code></pre></details>
<p>The privilege level in the selector is the "ring": 0 = kernel, 3 = user. The x86 ring numbers are why "ring 0" means kernel mode in security articles (Chapter 1's mode bit, in its x86 form; Chapter 9).</p>
<p class="pitfall">⚠️ FE3 question 11: x86-64 has no real segmentation (only a vestige, slide 55); the key's answer is "<strong>the lack of real segmentation simplifies memory management but limits the flexibility to handle changing memory requirements</strong>". Slides 52–55 describe the 32-bit design; 64-bit OSs use a flat model with paging.</p>`,
        `<p class="y-chinh">🎯 Hình 3-38: một <strong>bộ chọn (selector)</strong> của x86 — giá trị 16 bit nạp vào một thanh ghi đoạn (CS, DS, …): 13 bit <strong>chỉ số</strong>, 1 bit chọn bảng (<strong>0 = GDT</strong>, 1 = LDT) và 2 bit <strong>mức đặc quyền</strong> (0–3).</p>
<p>Bộ nhớ ảo x86 (từ 80386 cho tới x86-64) giống MULTICS: có đoạn, bên dưới là phân trang. Trái tim của nó là hai bảng: <strong>LDT</strong> (local descriptor table — bảng mô tả cục bộ, mỗi chương trình một bảng: mã, dữ liệu, ngăn xếp… của nó) và <strong>GDT</strong> (global descriptor table — bảng mô tả toàn cục, cả hệ thống một bảng: chủ yếu là các đoạn của HĐH). Muốn dùng một đoạn, chương trình nạp bộ chọn của nó vào một trong sáu thanh ghi đoạn — CS giữ bộ chọn mã, DS giữ bộ chọn dữ liệu. Với 13 bit chỉ số, mỗi bảng chứa tới 2¹³ = 8.192 bộ mô tả. Trên hệ thống thật không ai giải mã bộ chọn bằng tay, nhưng đây là ba giá trị Linux trên x86-64 thật sự nạp, lấy từ mã nguồn nhân:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9101e5081b7b114dcf4c45ab799faec6fa0bb8b3.svg" alt="Bộ chọn của Linux x86-64: 0x33 = mục GDT 6, đặc quyền 3 (mã người dùng); 0x2b = mục 5 (dữ liệu người dùng); 0x10 = mục 2, đặc quyền 0 (mã nhân)" loading="lazy" /><p class="chu-thich">🧮 Bộ chọn của Linux x86-64: 0x33 = mục GDT 6, đặc quyền 3 (mã người dùng); 0x2b = mục 5 (dữ liệu người dùng); 0x10 = mục 2, đặc quyền 0 (mã nhân)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TLB_MULTICS = [  // Figure 3-37: segment, virtual page, page frame, protection, age
  { doan: 4, trang: 1, khung: 7, bv: 'Read/write', tuoi: 13 }, { doan: 6, trang: 0, khung: 2, bv: 'Read only', tuoi: 10 },
  { doan: 12, trang: 3, khung: 1, bv: 'Read/write', tuoi: 2 }, { doan: 2, trang: 1, khung: 0, bv: 'Execute only', tuoi: 7 },
  { doan: 2, trang: 2, khung: 12, bv: 'Execute only', tuoi: 9 },
];
const THU = [[2, 2, 100], [4, 1, 7], [6, 1, 0], [12, 3, 1023]];
const SELECTOR = [0x33, 0x2b, 0x10];
const TUYEN = 0x0804A123;</code></pre></details>
<p>Mức đặc quyền trong bộ chọn chính là "vòng (ring)": 0 = nhân, 3 = người dùng. Số vòng của x86 là lý do "ring 0" nghĩa là chế độ nhân trong các bài viết bảo mật (bit chế độ của Chương 1, dưới dạng x86; Chương 9).</p>
<p class="pitfall">⚠️ FE3 câu 11: x86-64 không còn phân đoạn thật (chỉ còn dấu vết, slide 55); đáp án của khoá là "<strong>thiếu phân đoạn thật làm quản lý bộ nhớ đơn giản hơn nhưng hạn chế sự linh hoạt khi nhu cầu bộ nhớ thay đổi</strong>". Slide 52–55 mô tả thiết kế 32 bit; HĐH 64 bit dùng mô hình phẳng với phân trang.</p>`],
      [53, 'Segmentation with Paging: The Intel x86 (2)',
        `<p class="y-chinh">🎯 Figure 3-39: an x86 <strong>code segment descriptor</strong>, 8 bytes (data segments differ slightly): a 32-bit <strong>base</strong> split into three pieces (0–15, 16–23, 24–31), a 20-bit <strong>limit</strong> split into two (0–15, 16–19), and control bits: <strong>G</strong> (0 = limit in bytes, 1 = limit in 4-KB pages), <strong>D</strong> (16- or 32-bit segment), <strong>P</strong> (present in memory), <strong>DPL</strong> (privilege level 0–3), <strong>S</strong> (system or application) and <strong>Type</strong> (segment type and protection).</p>
<p>When a selector is loaded into a segment register, the CPU fetches the matching descriptor from the LDT or GDT (index × 8 = its byte offset in the table) and keeps it in hidden internal registers, so it is not read again on every access. The strange split of base and limit is history: the 80286 had 24-bit bases and 16-bit limits, and the 80386 kept compatibility by putting the new high bits elsewhere. A 20-bit limit allows at most 2²⁰ bytes = 1 MB — so the <strong>G (granularity)</strong> bit switches the unit to 4-KB pages, giving 2²⁰ × 2¹² = 2³² bytes = <strong>4 GB</strong>. If <strong>P = 0</strong> the segment is not in memory and any use of it traps (the segment-level page fault of slide 50).</p>
<table>
<thead><tr><th>Field</th><th>Bits</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Base 0–15, 16–23, 24–31</td><td>32</td><td>where the segment starts in the linear address space</td></tr>
<tr><td>Limit 0–15, 16–19</td><td>20</td><td>segment length − 1, in bytes (G = 0) or in 4-KB pages (G = 1)</td></tr>
<tr><td>G</td><td>1</td><td>granularity: bytes or pages</td></tr>
<tr><td>D</td><td>1</td><td>16-bit or 32-bit operations and addresses</td></tr>
<tr><td>P</td><td>1</td><td>segment present in memory?</td></tr>
<tr><td>DPL</td><td>2</td><td>privilege level 0–3 needed to use it</td></tr>
<tr><td>S, Type</td><td>1 + 4</td><td>system or application segment; code/data, read/write/execute</td></tr>
</tbody>
</table>
<p class="meo">🧠 Descriptor = base + limit + protection, again (slide 48). The selector says WHICH descriptor; the descriptor says WHERE and HOW BIG.</p>`,
        `<p class="y-chinh">🎯 Hình 3-39: một <strong>bộ mô tả đoạn mã (code segment descriptor)</strong> của x86, 8 byte (đoạn dữ liệu hơi khác): <strong>cơ sở (base)</strong> 32 bit tách làm ba mảnh (0–15, 16–23, 24–31), <strong>giới hạn (limit)</strong> 20 bit tách làm hai (0–15, 16–19), và các bit điều khiển: <strong>G</strong> (0 = giới hạn tính bằng byte, 1 = tính bằng trang 4 KB), <strong>D</strong> (đoạn 16 hay 32 bit), <strong>P</strong> (có mặt trong bộ nhớ), <strong>DPL</strong> (mức đặc quyền 0–3), <strong>S</strong> (hệ thống hay ứng dụng) và <strong>Type</strong> (loại đoạn và bảo vệ).</p>
<p>Khi một bộ chọn được nạp vào thanh ghi đoạn, CPU lấy bộ mô tả tương ứng từ LDT hay GDT (chỉ số × 8 = vị trí byte của nó trong bảng) và giữ trong các thanh ghi nội bộ ẩn, để không phải đọc lại ở mỗi lần truy cập. Cách tách lạ lùng của base và limit là do lịch sử: 80286 có base 24 bit và limit 16 bit, và 80386 giữ tương thích bằng cách đặt các bit cao mới ở chỗ khác. Limit 20 bit chỉ cho tối đa 2²⁰ byte = 1 MB — nên bit <strong>G (độ mịn — granularity)</strong> đổi đơn vị thành trang 4 KB, được 2²⁰ × 2¹² = 2³² byte = <strong>4 GB</strong>. Nếu <strong>P = 0</strong>, đoạn không ở bộ nhớ và mọi lần dùng nó đều bị bẫy (lỗi mức đoạn, như slide 50).</p>
<table>
<thead><tr><th>Trường</th><th>Số bit</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td>Base 0–15, 16–23, 24–31</td><td>32</td><td>đoạn bắt đầu ở đâu trong không gian địa chỉ tuyến tính</td></tr>
<tr><td>Limit 0–15, 16–19</td><td>20</td><td>độ dài đoạn − 1, tính bằng byte (G = 0) hay trang 4 KB (G = 1)</td></tr>
<tr><td>G</td><td>1</td><td>độ mịn: byte hay trang</td></tr>
<tr><td>D</td><td>1</td><td>phép toán và địa chỉ 16 bit hay 32 bit</td></tr>
<tr><td>P</td><td>1</td><td>đoạn có đang ở bộ nhớ không?</td></tr>
<tr><td>DPL</td><td>2</td><td>mức đặc quyền 0–3 cần có để dùng nó</td></tr>
<tr><td>S, Type</td><td>1 + 4</td><td>đoạn hệ thống hay ứng dụng; mã/dữ liệu, đọc/ghi/thực thi</td></tr>
</tbody>
</table>
<p class="meo">🧠 Bộ mô tả = cơ sở + giới hạn + bảo vệ, lại một lần nữa (slide 48). Bộ chọn nói dùng bộ mô tả NÀO; bộ mô tả nói Ở ĐÂU và LỚN BAO NHIÊU.</p>`],
      [54, 'Segmentation with Paging: The Intel x86 (3)',
        `<p class="y-chinh">🎯 Figure 3-40: conversion of a <strong>(selector, offset)</strong> pair to a <strong>32-bit linear address</strong>: the selector picks the descriptor; the hardware checks the offset against the limit, then adds the descriptor's <strong>base address</strong> to the offset.</p>
<p>That is base-and-limit (slide 5) once more, per segment. Two cases follow. If <strong>paging is disabled</strong>, the linear address is the physical address: pure segmentation. If <strong>paging is enabled</strong>, the linear address is a virtual address that is then translated by the page tables (slide 55) — segmentation and paging stacked on top of each other. The design was general enough that almost every OS ignored half of it: OS/2 and some early systems used segments seriously, but UNIX and Windows chose the <strong>flat model</strong> — every segment register gets a descriptor with base 0 and limit 4 GB, so the linear address simply equals the offset and only paging matters.</p>
<p>➕ In 64-bit mode Intel made the flat model mandatory: for CS, DS, ES and SS the base is treated as 0 and the limit is not checked (Intel SDM, volume 3A, "segmentation in IA-32e mode"). Only <strong>FS and GS</strong> keep a usable base — and operating systems use that base for one job: pointing at the current thread's private data (slide 55).</p>
<p class="pitfall">⚠️ x86 address names: <strong>logical</strong> address = (selector, offset) · <strong>linear</strong> address = after segmentation · <strong>physical</strong> address = after paging. FE15 question 7: a logical address is generated by the CPU, "also known as a virtual address".</p>`,
        `<p class="y-chinh">🎯 Hình 3-40: đổi một cặp <strong>(bộ chọn, độ dời)</strong> thành <strong>địa chỉ tuyến tính (linear address) 32 bit</strong>: bộ chọn chọn bộ mô tả; phần cứng so độ dời với giới hạn, rồi cộng <strong>địa chỉ cơ sở</strong> của bộ mô tả với độ dời.</p>
<p>Lại là cơ sở-giới hạn (slide 5), mỗi đoạn một bộ. Kéo theo hai trường hợp. Nếu <strong>tắt phân trang</strong>, địa chỉ tuyến tính chính là địa chỉ vật lý: phân đoạn thuần. Nếu <strong>bật phân trang</strong>, địa chỉ tuyến tính là một địa chỉ ảo, sau đó được bảng trang dịch tiếp (slide 55) — phân đoạn và phân trang chồng lên nhau. Thiết kế tổng quát tới mức gần như mọi HĐH bỏ qua một nửa: OS/2 và vài hệ đời đầu dùng đoạn thật sự, còn UNIX và Windows chọn <strong>mô hình phẳng (flat model)</strong> — mọi thanh ghi đoạn được một bộ mô tả có cơ sở 0 và giới hạn 4 GB, nên địa chỉ tuyến tính đơn giản bằng độ dời và chỉ phân trang là đáng kể.</p>
<p>➕ Ở chế độ 64 bit, Intel biến mô hình phẳng thành bắt buộc: với CS, DS, ES và SS, cơ sở được coi là 0 và giới hạn không được kiểm (Intel SDM, tập 3A, "segmentation in IA-32e mode"). Chỉ <strong>FS và GS</strong> còn giữ cơ sở dùng được — và HĐH dùng cơ sở đó cho đúng một việc: trỏ tới dữ liệu riêng của luồng hiện tại (slide 55).</p>
<p class="pitfall">⚠️ Tên các loại địa chỉ của x86: địa chỉ <strong>logic (logical)</strong> = (bộ chọn, độ dời) · địa chỉ <strong>tuyến tính (linear)</strong> = sau phân đoạn · địa chỉ <strong>vật lý (physical)</strong> = sau phân trang. FE15 câu 7: địa chỉ logic do CPU sinh ra, "còn gọi là địa chỉ ảo".</p>`],
      [55, 'Segmentation with Paging: The Intel x86 (4)',
        `<p class="y-chinh">🎯 Figure 3-41: mapping of a linear address onto a physical address: (a) the 32-bit linear address = <strong>Dir</strong> (10 bits) | <strong>Page</strong> (10 bits) | <strong>Offset</strong> (12 bits); (b) Dir indexes the <strong>page directory</strong> (1024 entries) whose entry points to a <strong>page table</strong>; Page indexes that table, whose entry points to the <strong>page frame</strong>; Offset selects the byte.</p>
<p>This is exactly the two-level table of slide 18 (PT1 = Dir, PT2 = Page). Each page table covers 1024 × 4 KB = 4 MB; the page directory is located by a global register (CR3). A short program uses only a few page tables, and the TLB caches the most recently used Dir–Page combinations so the two table reads are usually skipped. The simulator splits a typical 32-bit Linux code address:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b45b801b90122de29715a664ca573ee17776ff2a.svg" alt="Linear 0x0804A123 = Dir 32 | Page 74 | Offset 0x123" loading="lazy" /><p class="chu-thich">🧮 Linear 0x0804A123 = Dir 32 | Page 74 | Offset 0x123</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TLB_MULTICS = [  // Figure 3-37: segment, virtual page, page frame, protection, age
  { doan: 4, trang: 1, khung: 7, bv: 'Read/write', tuoi: 13 }, { doan: 6, trang: 0, khung: 2, bv: 'Read only', tuoi: 10 },
  { doan: 12, trang: 3, khung: 1, bv: 'Read/write', tuoi: 2 }, { doan: 2, trang: 1, khung: 0, bv: 'Execute only', tuoi: 7 },
  { doan: 2, trang: 2, khung: 12, bv: 'Execute only', tuoi: 9 },
];
const THU = [[2, 2, 100], [4, 1, 7], [6, 1, 0], [12, 3, 1023]];
const SELECTOR = [0x33, 0x2b, 0x10];
const TUYEN = 0x0804A123;</code></pre></details>
<p>➕ What changed since the slide: 32-bit x86 later added PAE (three levels, 36-bit physical addresses), and x86-64 uses <strong>four</strong> levels of 9 bits (48-bit virtual addresses), optionally <strong>five</strong> (57 bits, Linux 4.14+) — slide 18. Segmentation shrank to one survivor, the FS/GS base for thread-local storage. ARM64, the course machine, has no segmentation at all and does the same job with a register, <code>TPIDR_EL0</code>:</p>
<pre><code class="language-c">// What survived of x86 segmentation: FS/GS hold the base of thread-local storage. ARM64 has a register for the same job: TPIDR_EL0
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;pthread.h&gt;

__thread int counter = 0;                                // one copy PER THREAD
static pthread_barrier_t both_alive;                      // so the two threads exist at the same time
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t c = PTHREAD_COND_INITIALIZER;
static int turn = 1;                                      // print in a fixed order

static void show(const char *name) {
    uintptr_t tp;
    __asm__ volatile("mrs %0, tpidr_el0" : "=r"(tp));    // on x86-64 the same base sits in the FS segment register
    counter += 1;
    printf("%-8s base register = %#lx   &amp;counter = %p (base + %ld)   counter = %d\\n",
           name, (unsigned long)tp, (void *)&amp;counter, (long)((uintptr_t)&amp;counter - tp), counter);
}

static void *run(void *arg) {
    int me = *(int *)arg;
    pthread_barrier_wait(&amp;both_alive);
    pthread_mutex_lock(&amp;m);
    while (turn != me) pthread_cond_wait(&amp;c, &amp;m);
    show(me == 1 ? "thread1" : "thread2");
    turn++;
    pthread_cond_broadcast(&amp;c);
    pthread_mutex_unlock(&amp;m);
    return NULL;
}

int main(void) {
    pthread_t a, b;
    int one = 1, two = 2;
    show("main");
    pthread_barrier_init(&amp;both_alive, NULL, 2);
    pthread_create(&amp;a, NULL, run, &amp;one);
    pthread_create(&amp;b, NULL, run, &amp;two);
    pthread_join(a, NULL); pthread_join(b, NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tls.c -o tls &amp;&amp; ./tls<br>
main &nbsp;&nbsp;&nbsp;&nbsp;base register = 0xffff8c9f36e0 &nbsp;&nbsp;&amp;counter = 0xffff8c9f36f0 (base + 16) &nbsp;&nbsp;counter = 1<br>
thread1 &nbsp;base register = 0xffff8c7ff8c0 &nbsp;&nbsp;&amp;counter = 0xffff8c7ff8d0 (base + 16) &nbsp;&nbsp;counter = 1<br>
thread2 &nbsp;base register = 0xffff8bfef8c0 &nbsp;&nbsp;&amp;counter = 0xffff8bfef8d0 (base + 16) &nbsp;&nbsp;counter = 1</div>
<p>Each thread has its own base register value, and the <code>__thread</code> variable <code>counter</code> always sits at base + 16 — so the same instruction reaches a different copy in each thread, and every thread's counter is 1. On x86-64 the identical program would load the base from FS. 🧭 This is how Java's <code>ThreadLocal</code> and the per-thread request context of Spring end up as plain memory accesses.</p>`,
        `<p class="y-chinh">🎯 Hình 3-41: ánh xạ một địa chỉ tuyến tính thành địa chỉ vật lý: (a) địa chỉ tuyến tính 32 bit = <strong>Dir</strong> (10 bit) | <strong>Page</strong> (10 bit) | <strong>Offset</strong> (12 bit); (b) Dir làm chỉ số vào <strong>thư mục trang (page directory)</strong> (1024 mục), mục đó trỏ tới một <strong>bảng trang</strong>; Page làm chỉ số vào bảng đó, mục của nó trỏ tới <strong>khung trang</strong>; Offset chọn byte.</p>
<p>Đây đúng là bảng hai mức của slide 18 (PT1 = Dir, PT2 = Page). Mỗi bảng trang phủ 1024 × 4 KB = 4 MB; thư mục trang được tìm qua một thanh ghi toàn cục (CR3). Chương trình ngắn chỉ dùng vài bảng trang, và TLB lưu các tổ hợp Dir–Page mới dùng để hai lần đọc bảng thường được bỏ qua. Bộ mô phỏng tách một địa chỉ mã điển hình của Linux 32 bit:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9f99c89873cee6e7e3b31a89e06b63fa40bfbcf8.svg" alt="Tuyến tính 0x0804A123 = Dir 32 | Page 74 | Offset 0x123" loading="lazy" /><p class="chu-thich">🧮 Tuyến tính 0x0804A123 = Dir 32 | Page 74 | Offset 0x123</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TLB_MULTICS = [  // Figure 3-37: segment, virtual page, page frame, protection, age
  { doan: 4, trang: 1, khung: 7, bv: 'Read/write', tuoi: 13 }, { doan: 6, trang: 0, khung: 2, bv: 'Read only', tuoi: 10 },
  { doan: 12, trang: 3, khung: 1, bv: 'Read/write', tuoi: 2 }, { doan: 2, trang: 1, khung: 0, bv: 'Execute only', tuoi: 7 },
  { doan: 2, trang: 2, khung: 12, bv: 'Execute only', tuoi: 9 },
];
const THU = [[2, 2, 100], [4, 1, 7], [6, 1, 0], [12, 3, 1023]];
const SELECTOR = [0x33, 0x2b, 0x10];
const TUYEN = 0x0804A123;</code></pre></details>
<p>➕ Điều đã đổi kể từ slide: x86 32 bit sau đó thêm PAE (ba mức, địa chỉ vật lý 36 bit), và x86-64 dùng <strong>bốn</strong> mức 9 bit (địa chỉ ảo 48 bit), tuỳ chọn <strong>năm</strong> mức (57 bit, Linux 4.14 trở đi) — slide 18. Phân đoạn co lại còn đúng một kẻ sống sót, cơ sở FS/GS cho bộ nhớ riêng của luồng. ARM64, máy của môn, không có phân đoạn nào cả và làm cùng việc đó bằng một thanh ghi, <code>TPIDR_EL0</code>:</p>
<pre><code class="language-c">// Thứ còn sống sót của phân đoạn x86: FS/GS giữ địa chỉ gốc của bộ nhớ riêng từng luồng. ARM64 có thanh ghi làm đúng việc đó: TPIDR_EL0
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;pthread.h&gt;

__thread int counter = 0;                                // mỗi LUỒNG một bản
static pthread_barrier_t both_alive;                      // để hai luồng cùng tồn tại một lúc
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t c = PTHREAD_COND_INITIALIZER;
static int turn = 1;                                      // in theo thứ tự cố định

static void show(const char *name) {
    uintptr_t tp;
    __asm__ volatile("mrs %0, tpidr_el0" : "=r"(tp));    // trên x86-64, địa chỉ gốc này nằm trong thanh ghi đoạn FS
    counter += 1;
    printf("%-8s base register = %#lx   &amp;counter = %p (base + %ld)   counter = %d\\n",
           name, (unsigned long)tp, (void *)&amp;counter, (long)((uintptr_t)&amp;counter - tp), counter);
}

static void *run(void *arg) {
    int me = *(int *)arg;
    pthread_barrier_wait(&amp;both_alive);
    pthread_mutex_lock(&amp;m);
    while (turn != me) pthread_cond_wait(&amp;c, &amp;m);
    show(me == 1 ? "thread1" : "thread2");
    turn++;
    pthread_cond_broadcast(&amp;c);
    pthread_mutex_unlock(&amp;m);
    return NULL;
}

int main(void) {
    pthread_t a, b;
    int one = 1, two = 2;
    show("main");
    pthread_barrier_init(&amp;both_alive, NULL, 2);
    pthread_create(&amp;a, NULL, run, &amp;one);
    pthread_create(&amp;b, NULL, run, &amp;two);
    pthread_join(a, NULL); pthread_join(b, NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tls.c -o tls &amp;&amp; ./tls<br>
main &nbsp;&nbsp;&nbsp;&nbsp;base register = 0xffff8c9f36e0 &nbsp;&nbsp;&amp;counter = 0xffff8c9f36f0 (base + 16) &nbsp;&nbsp;counter = 1<br>
thread1 &nbsp;base register = 0xffff8c7ff8c0 &nbsp;&nbsp;&amp;counter = 0xffff8c7ff8d0 (base + 16) &nbsp;&nbsp;counter = 1<br>
thread2 &nbsp;base register = 0xffff8bfef8c0 &nbsp;&nbsp;&amp;counter = 0xffff8bfef8d0 (base + 16) &nbsp;&nbsp;counter = 1</div>
<p>Mỗi luồng có giá trị thanh ghi gốc riêng, và biến <code>__thread</code> <code>counter</code> luôn nằm ở gốc + 16 — nên cùng một lệnh với tới bản sao khác nhau ở mỗi luồng, và bộ đếm của luồng nào cũng bằng 1. Trên x86-64, đúng chương trình này sẽ nạp địa chỉ gốc từ FS. 🧭 Đây là cách <code>ThreadLocal</code> của Java và ngữ cảnh request theo luồng của Spring rốt cuộc chỉ là các lần truy cập bộ nhớ bình thường.</p>`],
      [56, 'End',
        `<p class="y-chinh">🎯 End of Chapter 3 — from "every program sees physical memory" to virtual memory with paging, page tables, the TLB, page replacement, and segmentation.</p>
<p>Check yourself before moving on: translate a virtual address with a page table (slides 13–14) and split one for a two-level table (slide 18); explain what a TLB miss costs (slide 17); count page faults for FIFO, LRU and OPT on a reference string (slides 20–24) and show Belady's anomaly (slide 31); run first/best/worst fit on a list of holes (slide 10); describe the 10 steps of a page fault (slides 35–37); translate (segment, offset) with a segment table (slide 44). Then do the 🧪 practice lesson 3.C and the Chapter 3 quiz.</p>
<p class="meo">🧠 Next: Chapter 4 (file systems) reuses this chapter's tools — blocks instead of pages, free-block bitmaps and lists, a buffer cache with LRU — and Progress Test 1 covers Chapters 1–3.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 3 — từ "mọi chương trình nhìn thẳng bộ nhớ vật lý" tới bộ nhớ ảo với phân trang, bảng trang, TLB, thay trang, và phân đoạn.</p>
<p>Tự kiểm trước khi đi tiếp: dịch được một địa chỉ ảo bằng bảng trang (slide 13–14) và tách được một địa chỉ cho bảng hai mức (slide 18); giải thích được trượt TLB tốn gì (slide 17); đếm được số lỗi trang của FIFO, LRU và OPT trên một chuỗi tham chiếu (slide 20–24) và chỉ ra được nghịch lý Belady (slide 31); chạy được first/best/worst fit trên một danh sách lỗ (slide 10); kể được 10 bước của một lỗi trang (slide 35–37); dịch được (đoạn, độ dời) bằng bảng đoạn (slide 44). Rồi làm bài 🧪 thực hành 3.C và quiz Chương 3.</p>
<p class="meo">🧠 Tiếp theo: Chương 4 (hệ thống tệp) dùng lại đồ nghề của chương này — khối thay cho trang, bitmap và danh sách khối trống, bộ đệm với LRU — và Progress Test 1 ôn Chương 1–3.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 3, sections 3.5–3.7, Figures 3-22 to 3-41', 'Chương 3, mục 3.5–3.7, Hình 3-22 tới 3-41'],
      ['ostep', 'Chapters 16 (segmentation), 17 (free-space management), 21–22 (swapping mechanisms and policies), 23 (complete VM systems: VAX/VMS and Linux)', 'Chương 16 (phân đoạn), 17 (quản lý chỗ trống), 21–22 (cơ chế và chính sách swap), 23 (hệ VM hoàn chỉnh: VAX/VMS và Linux)'],
      ['man7', 'fork(2) (copy-on-write), getrusage(2) (ru_minflt, ru_majflt), userfaultfd(2), sigaction(2) (si_addr), mprotect(2), ld.so(8), proc(5) /proc/pid/maps', 'fork(2) (copy-on-write), getrusage(2) (ru_minflt, ru_majflt), userfaultfd(2), sigaction(2) (si_addr), mprotect(2), ld.so(8), proc(5) /proc/pid/maps'],
      ['kernelDocs', 'admin-guide/cgroup-v2.html (memory.max, memory.swap.max), admin-guide/mm/userfaultfd.html, arch/x86/x86_64/5level-paging.html', 'admin-guide/cgroup-v2.html (memory.max, memory.swap.max), admin-guide/mm/userfaultfd.html, arch/x86/x86_64/5level-paging.html'],
      ['mchoes', 'Chapter 3 (segmented and segmented/demand paged memory allocation)', 'Chương 3 (cấp phát bộ nhớ phân đoạn và phân đoạn/phân trang theo yêu cầu)'],
    ]),
  ].join('\n'),
};

/* ───────── 3.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 3: address translation, page tables, placement, page replacement ───────── */
const L_on_ch3 = {
  title: '3.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 3: address translation, page tables, placement, page replacement|||3.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 3: dịch địa chỉ, bảng trang, đặt chỗ, thay trang',
  slug: 'osg202-on-ch3',
  type: 'VIDEO',
  description: '7 bài tập Chương 3 có lời giải chạy thật: dịch địa chỉ ảo bằng bảng trang, tách địa chỉ cho bảng trang nhiều mức và tính cỡ trang, cỡ bảng trang, thời gian truy cập hiệu dụng, first/next/best/worst fit trên đúng dữ liệu đề FE (kể cả câu có hai quy ước), đếm lỗi trang FIFO/LRU/OPT/Clock trên chuỗi của đề, tự tìm nghịch lý Belady, aging và NRU bằng tay, và hai bài Linux đo thật (đổi thứ tự lặp ma trận làm chậm hàng chục lần, /usr/bin/time -v đếm lỗi trang của một lệnh); kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.C · Practice &amp; review</span>
<h2>Seven exercises: the FE's favourite calculations, plus memory on a real Linux</h2>
<p class="lead">Chapter 3 is where the FE puts its calculation questions: translate an address, split it for a page table, choose a hole, count page faults. Every one of them is mechanical once you know the recipe — so do each exercise on paper first (the time is a target), then open the solution: answers come from the simulators of lessons 3.A–3.B and from C/JavaScript programs run in the course container, not from mental arithmetic. Exercise 7 shows why all this matters to a programmer.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>translate virtual addresses with a page table</td><td>3.A slides 13–14</td></tr>
<tr><td>2</td><td>split addresses, page size, page-table size, EAT</td><td>3.A slides 14, 16–18</td></tr>
<tr><td>3</td><td>first / next / best / worst fit on FE data</td><td>3.A slide 10</td></tr>
<tr><td>4</td><td>count page faults: FIFO, LRU, OPT, clock</td><td>3.A slides 20–23</td></tr>
<tr><td>5</td><td>Belady's anomaly</td><td>3.B slide 31</td></tr>
<tr><td>6</td><td>aging and NRU by hand</td><td>3.A slides 21, 24</td></tr>
<tr><td>7</td><td>loop order and page faults on Linux</td><td>3.A slides 17, 3.B slide 36</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: các phép tính FE ưa thích, cộng bộ nhớ trên Linux thật</h2>
<p class="lead">Chương 3 là nơi đề FE đặt các câu tính toán: dịch một địa chỉ, tách nó cho bảng trang, chọn một lỗ, đếm lỗi trang. Câu nào cũng máy móc khi đã nắm công thức — nên làm từng bài trên giấy trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải: đáp án lấy từ các bộ mô phỏng của bài 3.A–3.B và từ chương trình C/JavaScript chạy trong container của môn, không tính nhẩm. Bài 7 cho thấy vì sao tất cả chuyện này quan trọng với người viết chương trình.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>dịch địa chỉ ảo bằng bảng trang</td><td>3.A slide 13–14</td></tr>
<tr><td>2</td><td>tách địa chỉ, cỡ trang, cỡ bảng trang, EAT</td><td>3.A slide 14, 16–18</td></tr>
<tr><td>3</td><td>first / next / best / worst fit trên dữ liệu FE</td><td>3.A slide 10</td></tr>
<tr><td>4</td><td>đếm lỗi trang: FIFO, LRU, OPT, clock</td><td>3.A slide 20–23</td></tr>
<tr><td>5</td><td>nghịch lý Belady</td><td>3.B slide 31</td></tr>
<tr><td>6</td><td>aging và NRU bằng tay</td><td>3.A slide 21, 24</td></tr>
<tr><td>7</td><td>thứ tự vòng lặp và lỗi trang trên Linux</td><td>3.A slide 17, 3.B slide 36</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — translate addresses with a page table (10 min)</h3>
<p>Use the page table of Figure 3-9 (4-KB pages; page 0→frame 2, 1→1, 2→6, 3→0, 4→4, 5→3, 9→5, 11→7, every other page absent). Translate the virtual addresses 0, 8192, 20500, 32780, 45060, 4095 and 4096. Which ones cause a page fault?</p>
<details><summary>Solution — a C program doing the MMU's job</summary>
<pre><code class="language-c">// Translate virtual addresses with the page table of Figure 3-9 (4 KB pages): exactly what the MMU does
#include &lt;stdio.h&gt;

#define PAGE 4096
static const int table[16] = {2, 1, 6, 0, 4, 3, -1, -1, -1, 5, -1, 7, -1, -1, -1, -1};   // -1 = absent (X)

static void translate(unsigned va) {
    unsigned page = va / PAGE, offset = va % PAGE;      // = va &gt;&gt; 12 and va &amp; 0xFFF
    if (table[page] &lt; 0) { printf("%6u = page %2u offset %4u -&gt; page fault\\n", va, page, offset); return; }
    printf("%6u = page %2u offset %4u -&gt; frame %u -&gt; %u\\n", va, page, offset, table[page], table[page] * PAGE + offset);
}

int main(void) {
    unsigned list[] = {0, 8192, 20500, 32780, 45060, 4095, 4096};
    for (int i = 0; i &lt; 7; i++) translate(list[i]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dich-tay.c -o dich-tay &amp;&amp; ./dich-tay<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 = page &nbsp;0 offset &nbsp;&nbsp;&nbsp;0 -&gt; frame 2 -&gt; 8192<br>
&nbsp;&nbsp;8192 = page &nbsp;2 offset &nbsp;&nbsp;&nbsp;0 -&gt; frame 6 -&gt; 24576<br>
&nbsp;20500 = page &nbsp;5 offset &nbsp;&nbsp;20 -&gt; frame 3 -&gt; 12308<br>
&nbsp;32780 = page &nbsp;8 offset &nbsp;&nbsp;12 -&gt; page fault<br>
&nbsp;45060 = page 11 offset &nbsp;&nbsp;&nbsp;4 -&gt; frame 7 -&gt; 28676<br>
&nbsp;&nbsp;4095 = page &nbsp;0 offset 4095 -&gt; frame 2 -&gt; 12287<br>
&nbsp;&nbsp;4096 = page &nbsp;1 offset &nbsp;&nbsp;&nbsp;0 -&gt; frame 1 -&gt; 4096</div>
<p>Recipe: page = address div 4096, offset = address mod 4096, physical = frame × 4096 + offset. 32780 is in page 8 (32768–36863), which is absent → <strong>page fault</strong>. 45060 = 11 × 4096 + 4 → frame 7 → 28676. Watch the edges: 4095 is the LAST byte of page 0 (→ 8192 + 4095 = 12287), 4096 the FIRST byte of page 1. The simulator draws the 45060 case:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/61e021d4b8e3217f28af1d1746c4e2fbacad2fa0.svg" alt="Virtual 45060 = page 11, offset 4 → frame 7 → 28676" loading="lazy" /><p class="chu-thich">🧮 Virtual 45060 = page 11, offset 4 → frame 7 → 28676</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TRANG = 4096;
const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-9 (X = null)</code></pre></details>
</details>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>After you have worked the exercise on paper, check every field here.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-split os-lab-t-addr-split-walk"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> check your split and your translation <a href="/os-lab?sim=addr-split&amp;preset=split&amp;lang=en&amp;tour=addr-split-walk" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Type the addresses of the exercise with the same bit widths.</li><li>Compare page number and offset with your paper, then follow the page walk.</li></ol></div>
</div>`,
    `<h3>🧪 Bài 1 — dịch địa chỉ bằng bảng trang (10 phút)</h3>
<p>Dùng bảng trang của Hình 3-9 (trang 4 KB; trang 0→khung 2, 1→1, 2→6, 3→0, 4→4, 5→3, 9→5, 11→7, các trang khác vắng mặt). Dịch các địa chỉ ảo 0, 8192, 20500, 32780, 45060, 4095 và 4096. Địa chỉ nào gây lỗi trang?</p>
<details><summary>Lời giải — một chương trình C làm việc của MMU</summary>
<pre><code class="language-c">// Dịch địa chỉ ảo bằng bảng trang của Hình 3-9 (trang 4 KB): đúng việc MMU làm
#include &lt;stdio.h&gt;

#define PAGE 4096
static const int table[16] = {2, 1, 6, 0, 4, 3, -1, -1, -1, 5, -1, 7, -1, -1, -1, -1};   // -1 = vắng mặt (X)

static void translate(unsigned va) {
    unsigned page = va / PAGE, offset = va % PAGE;      // = va &gt;&gt; 12 và va &amp; 0xFFF
    if (table[page] &lt; 0) { printf("%6u = page %2u offset %4u -&gt; page fault\\n", va, page, offset); return; }
    printf("%6u = page %2u offset %4u -&gt; frame %u -&gt; %u\\n", va, page, offset, table[page], table[page] * PAGE + offset);
}

int main(void) {
    unsigned list[] = {0, 8192, 20500, 32780, 45060, 4095, 4096};
    for (int i = 0; i &lt; 7; i++) translate(list[i]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dich-tay.c -o dich-tay &amp;&amp; ./dich-tay<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 = page &nbsp;0 offset &nbsp;&nbsp;&nbsp;0 -&gt; frame 2 -&gt; 8192<br>
&nbsp;&nbsp;8192 = page &nbsp;2 offset &nbsp;&nbsp;&nbsp;0 -&gt; frame 6 -&gt; 24576<br>
&nbsp;20500 = page &nbsp;5 offset &nbsp;&nbsp;20 -&gt; frame 3 -&gt; 12308<br>
&nbsp;32780 = page &nbsp;8 offset &nbsp;&nbsp;12 -&gt; page fault<br>
&nbsp;45060 = page 11 offset &nbsp;&nbsp;&nbsp;4 -&gt; frame 7 -&gt; 28676<br>
&nbsp;&nbsp;4095 = page &nbsp;0 offset 4095 -&gt; frame 2 -&gt; 12287<br>
&nbsp;&nbsp;4096 = page &nbsp;1 offset &nbsp;&nbsp;&nbsp;0 -&gt; frame 1 -&gt; 4096</div>
<p>Công thức: trang = địa chỉ div 4096, độ dời = địa chỉ mod 4096, vật lý = khung × 4096 + độ dời. 32780 thuộc trang 8 (32768–36863), đang vắng mặt → <strong>lỗi trang</strong>. 45060 = 11 × 4096 + 4 → khung 7 → 28676. Cẩn thận ở mép: 4095 là byte CUỐI của trang 0 (→ 8192 + 4095 = 12287), 4096 là byte ĐẦU của trang 1. Bộ mô phỏng vẽ trường hợp 45060:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/41782ed090d733aac31f4827ff2a7c579528caec.svg" alt="Ảo 45060 = trang 11, độ dời 4 → khung 7 → 28676" loading="lazy" /><p class="chu-thich">🧮 Ảo 45060 = trang 11, độ dời 4 → khung 7 → 28676</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TRANG = 4096;
const BANG = [2, 1, 6, 0, 4, 3, null, null, null, 5, null, 7, null, null, null, null];   // Figure 3-9 (X = null)</code></pre></details>
</details>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Làm bài trên giấy xong rồi kiểm từng trường ở đây.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-split os-lab-t-addr-split-walk"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> kiểm phép tách và phép dịch của bạn <a href="/os-lab?sim=addr-split&amp;preset=split&amp;lang=vi&amp;tour=addr-split-walk" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Gõ các địa chỉ của bài với đúng số bit đó.</li><li>So số trang và độ dời với bài làm, rồi đi theo bước tra bảng trang.</li></ol></div>
</div>`),
    bi(`<h3>🧪 Exercise 2 — split, size, count (15 min)</h3>
<p>(a) A 32-bit address uses a two-level table with 10-bit PT1 and 10-bit PT2. Split 0x00403008. (b) For 32-bit addresses, what is the page size and the number of pages when the two table fields are 10 + 12, 9 + 11, 10 + 11, 9 + 12 bits? (c) 32-bit addresses, 16-KB pages, 4-byte entries: size of a one-level page table? (d) 2³² words, 2¹²-word pages: page number of 0x12345678? (e) TLB 20 ns, memory 100 ns: effective access time at 80% and 98% hit ratio?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// The chapter's calculations, FE style: address splits, page sizes, page-table sizes, effective access time
const split = (addr, widths) =&gt; {             // split an address into fields, left to right
  let v = BigInt(addr); const out = [];
  for (const w of [...widths].reverse()) { out.unshift(Number(v &amp; ((1n &lt;&lt; BigInt(w)) - 1n))); v &gt;&gt;= BigInt(w); }
  return out;
};
const [pt1, pt2, off] = split(0x00403008, [10, 10, 12]);
console.log(&#96;(a) 0x00403008 with 10|10|12 bits: PT1=&#36;{pt1}, PT2=&#36;{pt2}, offset=&#36;{off}&#96;);
for (const [a, b] of [[10, 12], [9, 11], [10, 11], [9, 12]]) {
  const offBits = 32 - a - b;
  console.log(&#96;(b) 32-bit, &#36;{a}-bit + &#36;{b}-bit table fields: offset &#36;{offBits} bits -&gt; page size &#36;{2 ** offBits} B, 2^&#36;{a + b} pages&#96;);
}
console.log(&#96;(c) 32-bit, 16 KB pages, 4-byte entries: 2^&#36;{32 - 14} entries x 4 B = &#36;{2 ** (32 - 14) * 4 / 2 ** 20} MB&#96;);
console.log(&#96;(d) 2^32 words, 2^12-word pages, address 0x12345678: page number 0x&#36;{(0x12345678 &gt;&gt;&gt; 12).toString(16)}&#96;);
const eat = (h, tlb, mem) =&gt; h * (tlb + mem) + (1 - h) * (tlb + 2 * mem);
console.log(&#96;(e) TLB 20 ns, memory 100 ns: EAT at 80% hits = &#36;{eat(0.8, 20, 100)} ns, at 98% = &#36;{eat(0.98, 20, 100).toFixed(1)} ns, no TLB = 200 ns&#96;);</code></pre>
<div class="out">$ node tinh-toan.js<br>
(a) 0x00403008 with 10|10|12 bits: PT1=1, PT2=3, offset=8<br>
(b) 32-bit, 10-bit + 12-bit table fields: offset 10 bits -&gt; page size 1024 B, 2^22 pages<br>
(b) 32-bit, 9-bit + 11-bit table fields: offset 12 bits -&gt; page size 4096 B, 2^20 pages<br>
(b) 32-bit, 10-bit + 11-bit table fields: offset 11 bits -&gt; page size 2048 B, 2^21 pages<br>
(b) 32-bit, 9-bit + 12-bit table fields: offset 11 bits -&gt; page size 2048 B, 2^21 pages<br>
(c) 32-bit, 16 KB pages, 4-byte entries: 2^18 entries x 4 B = 1 MB<br>
(d) 2^32 words, 2^12-word pages, address 0x12345678: page number 0x12345<br>
(e) TLB 20 ns, memory 100 ns: EAT at 80% hits = 140 ns, at 98% = 122.0 ns, no TLB = 200 ns</div>
<ul>
<li>(a) <strong>PT1 = 1, PT2 = 3, offset = 8</strong> (FE4 q17, FE12 q18, FE14 q23). Write the hex in binary and cut 10 | 10 | 12.</li>
<li>(b) offset bits = 32 − (field1 + field2): 10 + 12 → 10 bits → <strong>1 KB</strong> (FE3 q16, FE4 q18, FE8 q19, FE11 q19, FE16 q22, FE19 q4); 9 + 11 → <strong>4 KB</strong> and <strong>2²⁰ pages</strong> (FE21 q32, FE17 q2, FE26 q38); 10 + 11 → <strong>2 KB</strong> (FE22 q43); 9 + 12 → <strong>2 KB</strong> (FE29 q16). The number of pages is 2^(field1 + field2): 10 + 12 → <strong>2²²</strong> (FE28 q33).</li>
<li>(c) 2³² / 2¹⁴ = 2¹⁸ entries × 4 B = <strong>1 MB</strong> (FE20 q5, FE28 q23).</li>
<li>(d) 12 offset bits = 3 hex digits, so drop them: <strong>0x12345</strong> (FE17 q37).</li>
<li>(e) EAT = h(t<sub>TLB</sub> + t<sub>mem</sub>) + (1 − h)(t<sub>TLB</sub> + 2t<sub>mem</sub>) = 0.8 × 120 + 0.2 × 220 = <strong>140 ns</strong>; at 98%, 122 ns. Same formula as old lesson 3.3.</li>
</ul>
</details>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Check your sizes: number of pages, entries per table and bytes, one level versus many.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-table os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> page-table size from address bits, page size and entry size <a href="/os-lab?sim=addr-split&amp;preset=table&amp;lang=en&amp;tour=addr-split-size" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Set the address bits, page size and entry size of the exercise.</li><li>Compare each number with your paper; if one differs, find the power of two you missed.</li></ol></div>
</div>`,
    `<h3>🧪 Bài 2 — tách, cỡ, đếm (15 phút)</h3>
<p>(a) Địa chỉ 32 bit dùng bảng hai mức với PT1 10 bit và PT2 10 bit. Tách 0x00403008. (b) Với địa chỉ 32 bit, cỡ trang và số trang là bao nhiêu khi hai trường bảng là 10 + 12, 9 + 11, 10 + 11, 9 + 12 bit? (c) Địa chỉ 32 bit, trang 16 KB, mục 4 byte: cỡ bảng trang một mức? (d) 2³² từ, trang 2¹² từ: số trang của 0x12345678? (e) TLB 20 ns, bộ nhớ 100 ns: thời gian truy cập hiệu dụng khi tỉ lệ trúng 80% và 98%?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Các phép tính của chương theo kiểu FE: tách địa chỉ, cỡ trang, cỡ bảng trang, thời gian truy cập hiệu dụng
const split = (addr, widths) =&gt; {             // tách địa chỉ thành các trường, trái sang phải
  let v = BigInt(addr); const out = [];
  for (const w of [...widths].reverse()) { out.unshift(Number(v &amp; ((1n &lt;&lt; BigInt(w)) - 1n))); v &gt;&gt;= BigInt(w); }
  return out;
};
const [pt1, pt2, off] = split(0x00403008, [10, 10, 12]);
console.log(&#96;(a) 0x00403008 with 10|10|12 bits: PT1=&#36;{pt1}, PT2=&#36;{pt2}, offset=&#36;{off}&#96;);
for (const [a, b] of [[10, 12], [9, 11], [10, 11], [9, 12]]) {
  const offBits = 32 - a - b;
  console.log(&#96;(b) 32-bit, &#36;{a}-bit + &#36;{b}-bit table fields: offset &#36;{offBits} bits -&gt; page size &#36;{2 ** offBits} B, 2^&#36;{a + b} pages&#96;);
}
console.log(&#96;(c) 32-bit, 16 KB pages, 4-byte entries: 2^&#36;{32 - 14} entries x 4 B = &#36;{2 ** (32 - 14) * 4 / 2 ** 20} MB&#96;);
console.log(&#96;(d) 2^32 words, 2^12-word pages, address 0x12345678: page number 0x&#36;{(0x12345678 &gt;&gt;&gt; 12).toString(16)}&#96;);
const eat = (h, tlb, mem) =&gt; h * (tlb + mem) + (1 - h) * (tlb + 2 * mem);
console.log(&#96;(e) TLB 20 ns, memory 100 ns: EAT at 80% hits = &#36;{eat(0.8, 20, 100)} ns, at 98% = &#36;{eat(0.98, 20, 100).toFixed(1)} ns, no TLB = 200 ns&#96;);</code></pre>
<div class="out">$ node tinh-toan.js<br>
(a) 0x00403008 with 10|10|12 bits: PT1=1, PT2=3, offset=8<br>
(b) 32-bit, 10-bit + 12-bit table fields: offset 10 bits -&gt; page size 1024 B, 2^22 pages<br>
(b) 32-bit, 9-bit + 11-bit table fields: offset 12 bits -&gt; page size 4096 B, 2^20 pages<br>
(b) 32-bit, 10-bit + 11-bit table fields: offset 11 bits -&gt; page size 2048 B, 2^21 pages<br>
(b) 32-bit, 9-bit + 12-bit table fields: offset 11 bits -&gt; page size 2048 B, 2^21 pages<br>
(c) 32-bit, 16 KB pages, 4-byte entries: 2^18 entries x 4 B = 1 MB<br>
(d) 2^32 words, 2^12-word pages, address 0x12345678: page number 0x12345<br>
(e) TLB 20 ns, memory 100 ns: EAT at 80% hits = 140 ns, at 98% = 122.0 ns, no TLB = 200 ns</div>
<ul>
<li>(a) <strong>PT1 = 1, PT2 = 3, offset = 8</strong> (FE4 c17, FE12 c18, FE14 c23). Viết hex ra nhị phân rồi cắt 10 | 10 | 12.</li>
<li>(b) số bit độ dời = 32 − (trường 1 + trường 2): 10 + 12 → 10 bit → <strong>1 KB</strong> (FE3 c16, FE4 c18, FE8 c19, FE11 c19, FE16 c22, FE19 c4); 9 + 11 → <strong>4 KB</strong> và <strong>2²⁰ trang</strong> (FE21 c32, FE17 c2, FE26 c38); 10 + 11 → <strong>2 KB</strong> (FE22 c43); 9 + 12 → <strong>2 KB</strong> (FE29 c16). Số trang là 2^(trường 1 + trường 2): 10 + 12 → <strong>2²²</strong> (FE28 c33).</li>
<li>(c) 2³² / 2¹⁴ = 2¹⁸ mục × 4 B = <strong>1 MB</strong> (FE20 c5, FE28 c23).</li>
<li>(d) 12 bit độ dời = 3 chữ số hex, bỏ chúng đi: <strong>0x12345</strong> (FE17 c37).</li>
<li>(e) EAT = h(t<sub>TLB</sub> + t<sub>mem</sub>) + (1 − h)(t<sub>TLB</sub> + 2t<sub>mem</sub>) = 0,8 × 120 + 0,2 × 220 = <strong>140 ns</strong>; ở 98% là 122 ns. Cùng công thức của bài cũ 3.3.</li>
</ul>
</details>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Kiểm các con số của bạn: số trang, số mục mỗi bảng và số byte, một mức so với nhiều mức.</p>
<div class="os-lab os-lab-sim-addr-split os-lab-p-table os-lab-t-addr-split-size"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> cỡ bảng trang từ số bit địa chỉ, cỡ trang và cỡ mục <a href="/os-lab?sim=addr-split&amp;preset=table&amp;lang=vi&amp;tour=addr-split-size" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Đặt số bit địa chỉ, cỡ trang và cỡ mục của bài.</li><li>So từng số với bài làm; số nào lệch thì tìm lũy thừa của 2 bạn bỏ sót.</li></ol></div>
</div>`),
    bi(`<h3>🧪 Exercise 3 — choose the hole (15 min)</h3>
<p>(a) Holes 10, 18, 9, 14 MB (memory order); best fit for requests 11, 2, 9, 8 MB (FE3 q23 = FE5 q30). (b) Holes as (start, size): 4075/105, 5225/5, 6785/600, 7560/20, 7600/205, 10250/4050; a request of 200: start address under first, best and worst fit (FE19 q14, FE23 q34, FE24 q4). (c) Holes 10, 4, 20, 15, 9 K; worst fit for 8, 12, 10 K (FE18 q21). (d) Blocks 300, 600, 380, 200, 750, 125 KB; best fit for 115, 500, 358, 200, 375 KB — where does P5 go (FE5 q19)?</p>
<details><summary>Solution — run by the placement simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b8d32cf416521c06c7b6abf8f606c699fee2aa3c.svg" alt="(a) Best fit: 14, then the 3 left over from it, then 9, then 10" loading="lazy" /><p class="chu-thich">🧮 (a) Best fit: 14, then the 3 left over from it, then 9, then 10</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/77df53a8cda175a57e9b2c83a4647dd845903911.svg" alt="(b) First fit 6785, best fit 7600, worst fit 10250" loading="lazy" /><p class="chu-thich">🧮 (b) First fit 6785, best fit 7600, worst fit 10250</p></div>
<table><tr><th>algorithm</th><th>holes taken for 200 </th></tr><tr><td>First fit</td><td>6785</td></tr><tr><td>Next fit</td><td>6785</td></tr><tr><td>Best fit</td><td>7600</td></tr><tr><td>Worst fit</td><td>10250</td></tr></table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/73ee4f8bcd3af671ac2765e5e8d212f4ed6fc4c2.svg" alt="(c) Worst fit WITH splitting (as in the book): 20, 15, then the 12 K left in the 20 K hole" loading="lazy" /><p class="chu-thich">🧮 (c) Worst fit WITH splitting (as in the book): 20, 15, then the 12 K left in the 20 K hole</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/eaee2a5c4958aee8a575e6e1bfc39df6d8f06f8c.svg" alt="(c) Worst fit WITHOUT splitting (a hole is taken whole): 20, 15, 10 — the bank's key" loading="lazy" /><p class="chu-thich">🧮 (c) Worst fit WITHOUT splitting (a hole is taken whole): 20, 15, 10 — the bank's key</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/05dbbbf7ff8c5bc3e9b94f2e8f7027ca0884e6e9.svg" alt="(d) Best fit with fixed blocks: P5 (375 KB) goes to B5" loading="lazy" /><p class="chu-thich">🧮 (d) Best fit with fixed blocks: P5 (375 KB) goes to B5</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<p>(a) <strong>14, 3, 9, 10</strong> — the "3 MB" is the remainder of the 14-MB hole after 11 MB, the smallest hole that fits a 2-MB request. (b) <strong>6785 / 7600 / 10250</strong>. (c) The exam's answer "20K, 15K, 10K" is right only if a whole hole is consumed by each request; splitting like the book gives 20K, 15K and then the <strong>12-K remainder of the 20-K hole</strong> — a known inconsistency of the bank (question (a) does split). In the exam, pick "20K, 15K, 10K", the only option that can be meant. (d) <strong>B5</strong>.</p>
</details>`,
    `<h3>🧪 Bài 3 — chọn lỗ (15 phút)</h3>
<p>(a) Lỗ 10, 18, 9, 14 MB (theo thứ tự bộ nhớ); best fit cho yêu cầu 11, 2, 9, 8 MB (FE3 c23 = FE5 c30). (b) Lỗ dạng (đầu, cỡ): 4075/105, 5225/5, 6785/600, 7560/20, 7600/205, 10250/4050; yêu cầu 200: địa chỉ đầu với first, best và worst fit (FE19 c14, FE23 c34, FE24 c4). (c) Lỗ 10, 4, 20, 15, 9 K; worst fit cho 8, 12, 10 K (FE18 c21). (d) Khối 300, 600, 380, 200, 750, 125 KB; best fit cho 115, 500, 358, 200, 375 KB — P5 vào đâu (FE5 c19)?</p>
<details><summary>Lời giải — bộ mô phỏng đặt chỗ chạy</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3b1f94697f3447603f2b14f8b97507c9d8f9625f.svg" alt="(a) Best fit: 14, rồi phần dư 3 của nó, rồi 9, rồi 10" loading="lazy" /><p class="chu-thich">🧮 (a) Best fit: 14, rồi phần dư 3 của nó, rồi 9, rồi 10</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c66ed8f6c492f2e9d8d3e4a1ae23047e0be71968.svg" alt="(b) First fit 6785, best fit 7600, worst fit 10250" loading="lazy" /><p class="chu-thich">🧮 (b) First fit 6785, best fit 7600, worst fit 10250</p></div>
<table><tr><th>thuật toán</th><th>lỗ được chọn cho 200 </th></tr><tr><td>First fit</td><td>6785</td></tr><tr><td>Next fit</td><td>6785</td></tr><tr><td>Best fit</td><td>7600</td></tr><tr><td>Worst fit</td><td>10250</td></tr></table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/61cf887f9cde250d1cc901997fe1991545a753fb.svg" alt="(c) Worst fit CÓ tách lỗ (như sách): 20, 15, rồi phần dư 12 K của lỗ 20 K" loading="lazy" /><p class="chu-thich">🧮 (c) Worst fit CÓ tách lỗ (như sách): 20, 15, rồi phần dư 12 K của lỗ 20 K</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b4f1f1714927073feb3b5ba0b8d8991ef87bfd45.svg" alt="(c) Worst fit KHÔNG tách lỗ (lấy trọn lỗ): 20, 15, 10 — khoá của ngân hàng" loading="lazy" /><p class="chu-thich">🧮 (c) Worst fit KHÔNG tách lỗ (lấy trọn lỗ): 20, 15, 10 — khoá của ngân hàng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cd1e0d22ec1a442c94c1960d4b98fbea4ddaffd4.svg" alt="(d) Best fit với khối cố định: P5 (375 KB) vào B5" loading="lazy" /><p class="chu-thich">🧮 (d) Best fit với khối cố định: P5 (375 KB) vào B5</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: { lo: [10, 4, 20, 18, 7, 9, 12, 15], yc: [12, 10, 9], dv: 'MB' },
  fe3: { lo: [10, 18, 9, 14], yc: [11, 2, 9, 8], dv: 'MB' },
  fe18: { lo: [10, 4, 20, 15, 9], yc: [8, 12, 10], dv: 'K' },
  fe19: { lo: [{ bat: 4075, co: 105 }, { bat: 5225, co: 5 }, { bat: 6785, co: 600 }, { bat: 7560, co: 20 }, { bat: 7600, co: 205 }, { bat: 10250, co: 4050 }], yc: [200], dv: '' },
  fe5: { lo: [300, 600, 380, 200, 750, 125], yc: [115, 500, 358, 200, 375], dv: 'KB', khoi: true },
};</code></pre></details>
<p>(a) <strong>14, 3, 9, 10</strong> — "3 MB" là phần dư của lỗ 14 MB sau khi cấp 11 MB, lỗ nhỏ nhất vừa yêu cầu 2 MB. (b) <strong>6785 / 7600 / 10250</strong>. (c) Đáp án "20K, 15K, 10K" của đề chỉ đúng nếu mỗi yêu cầu lấy trọn một lỗ; tách như sách thì ra 20K, 15K rồi <strong>phần dư 12 K của lỗ 20 K</strong> — một chỗ không nhất quán của ngân hàng (câu (a) thì có tách). Đi thi hãy chọn "20K, 15K, 10K", phương án duy nhất có thể là ý của đề. (d) <strong>B5</strong>.</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — count the page faults (15 min)</h3>
<p>Frames start empty. (a) FIFO, 4 frames: 0, 1, 7, 2, 3, 2, 7, 1, 0, 3 (FE3 q17). (b) LRU, 3 frames: 4, 7, 6, 1, 7, 6, 1, 2, 7, 2 (FE5 q22). (c) OPT, 4 frames: 7, 0, 1, 2, 0, 3, 0 (FE4 q20). (d) FIFO, 3 frames: 1, 2, 3, 4, 1, 2, 5 — which page is replaced when 5 is loaded (FE4 q14)? (e) Clock on the classic string 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 with 3 frames.</p>
<details><summary>Solution — tables from the replacement simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/748e61dc22426738f8b889da61031ed45096ee32.svg" alt="(a) FIFO, 4 frames: 6 faults" loading="lazy" /><p class="chu-thich">🧮 (a) FIFO, 4 frames: 6 faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e5a5afb42fa078aa4b9304941657730e23a3c0d0.svg" alt="(b) LRU, 3 frames: 6 faults" loading="lazy" /><p class="chu-thich">🧮 (b) LRU, 3 frames: 6 faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bad97c9db0d88906e6917d6fb421f81aecdb05a5.svg" alt="(c) OPT, 4 frames: 5 faults" loading="lazy" /><p class="chu-thich">🧮 (c) OPT, 4 frames: 5 faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e4f60347ee9c6ae6257aac1280ce46c9844afef3.svg" alt="(d) FIFO: loading 5 evicts page 4" loading="lazy" /><p class="chu-thich">🧮 (d) FIFO: loading 5 evicts page 4</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<p>(a) <strong>6</strong>, (b) <strong>6</strong>, (c) <strong>5</strong>, (d) page <strong>4</strong> — all four match the bank's keys. (e) clock gives <strong>14</strong> (slide 23's table). Method for paper: write the frames as columns, mark F on every miss, and for LRU keep a small "last used at" note per frame; for OPT look ahead in the string; for FIFO only the load order matters — a hit changes nothing.</p>
</details>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Check your fault count for every algorithm of the exercise.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-exam"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> fill the frame table column by column <a href="/os-lab?sim=vm&amp;preset=exam&amp;lang=en" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Type the reference string and the number of frames.</li><li>Run FIFO, LRU and OPT and compare each column, not only the total.</li></ol></div>
</div>`,
    `<h3>🧪 Bài 4 — đếm lỗi trang (15 phút)</h3>
<p>Khung ban đầu trống. (a) FIFO, 4 khung: 0, 1, 7, 2, 3, 2, 7, 1, 0, 3 (FE3 c17). (b) LRU, 3 khung: 4, 7, 6, 1, 7, 6, 1, 2, 7, 2 (FE5 c22). (c) OPT, 4 khung: 7, 0, 1, 2, 0, 3, 0 (FE4 c20). (d) FIFO, 3 khung: 1, 2, 3, 4, 1, 2, 5 — nạp 5 thì trang nào bị thay (FE4 c14)? (e) Clock trên chuỗi kinh điển 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 với 3 khung.</p>
<details><summary>Lời giải — bảng của bộ mô phỏng thay trang</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/31f25b595c224d1c9cafb555ff0fedac9a2bdd06.svg" alt="(a) FIFO, 4 khung: 6 lỗi" loading="lazy" /><p class="chu-thich">🧮 (a) FIFO, 4 khung: 6 lỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/733d51fa5e9363c06991c138f3eb2e8e3bf2984b.svg" alt="(b) LRU, 3 khung: 6 lỗi" loading="lazy" /><p class="chu-thich">🧮 (b) LRU, 3 khung: 6 lỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/13243f5e9b8cb5f40c22b8cc8de36f10665cb400.svg" alt="(c) OPT, 4 khung: 5 lỗi" loading="lazy" /><p class="chu-thich">🧮 (c) OPT, 4 khung: 5 lỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/395d8ce7f05f5a6f3ea75385292018442b8904a0.svg" alt="(d) FIFO: nạp 5 thì trang 4 bị thay" loading="lazy" /><p class="chu-thich">🧮 (d) FIFO: nạp 5 thì trang 4 bị thay</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<p>(a) <strong>6</strong>, (b) <strong>6</strong>, (c) <strong>5</strong>, (d) trang <strong>4</strong> — cả bốn khớp khoá của ngân hàng. (e) clock ra <strong>14</strong> (bảng của slide 23). Cách làm trên giấy: viết các khung thành cột, đánh F ở mỗi lần trượt, với LRU ghi chú nhỏ "dùng lần cuối lúc" cho từng khung; với OPT nhìn về phía trước trong chuỗi; với FIFO chỉ thứ tự nạp là quan trọng — trúng thì không đổi gì.</p>
</details>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Kiểm số lỗi trang của bạn cho từng thuật toán của bài.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-exam"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> điền bảng khung từng cột <a href="/os-lab?sim=vm&amp;preset=exam&amp;lang=vi" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Gõ chuỗi tham chiếu và số khung.</li><li>Chạy FIFO, LRU và OPT rồi so từng cột, không chỉ tổng.</li></ol></div>
</div>`),
    bi(`<h3>🧪 Exercise 5 — find Belady's anomaly (10 min)</h3>
<p>Run FIFO on 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 with 3 frames and with 4 frames. Then run LRU with the same frame counts. What is strange, and why can it never happen to LRU?</p>
<details><summary>Solution</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9d69d1877a17be1ed76dd75a956d8a018059107c.svg" alt="FIFO with 3 frames: 9 faults" loading="lazy" /><p class="chu-thich">🧮 FIFO with 3 frames: 9 faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e8757a171dcae95e1a06a11fbcaf71684cb06cb3.svg" alt="FIFO with 4 frames: 10 faults — one more frame, one more fault" loading="lazy" /><p class="chu-thich">🧮 FIFO with 4 frames: 10 faults — one more frame, one more fault</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/93ab4e788feebbe0ef58137d40718539b838186b.svg" alt="Faults vs frames for FIFO and LRU" loading="lazy" /><p class="chu-thich">🧮 Faults vs frames for FIFO and LRU</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const A = 30, B = 10;</code></pre></details>
<p>FIFO: 3 frames → <strong>9</strong> faults, 4 frames → <strong>10</strong>. LRU: 10 → 8, never up. LRU is a <strong>stack algorithm</strong>: with n + 1 frames it keeps every page it would keep with n frames, plus one more, so it can only fault less. FIFO's choice depends on load order, which changes completely with the number of frames. (FE4 q19, FE7 q21, FE12 q19, FE13 q20.)</p>
</details>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Belady’s anomaly on the classic string: more frames, more faults.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-belady"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> FIFO with 3 frames, then 4 <a href="/os-lab?sim=vm&amp;preset=belady&amp;lang=en" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Run FIFO with 3 frames, then 4, and write both fault counts.</li><li>Run LRU with the same frames and explain why a stack algorithm can never do this.</li></ol></div>
</div>`,
    `<h3>🧪 Bài 5 — tìm nghịch lý Belady (10 phút)</h3>
<p>Chạy FIFO trên 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 với 3 khung và 4 khung. Rồi chạy LRU với cùng số khung. Có gì lạ, và vì sao LRU không bao giờ bị?</p>
<details><summary>Lời giải</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/64f60943b9c129234acc64c7753cef62d50db150.svg" alt="FIFO 3 khung: 9 lỗi" loading="lazy" /><p class="chu-thich">🧮 FIFO 3 khung: 9 lỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0c27f19664f3824283c8d0e5fdd230f545409958.svg" alt="FIFO 4 khung: 10 lỗi — thêm một khung, thêm một lỗi" loading="lazy" /><p class="chu-thich">🧮 FIFO 4 khung: 10 lỗi — thêm một khung, thêm một lỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  cu: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe4: { ref: [7, 0, 1, 2, 0, 3, 0], khung: 4 },
  fe4b: { ref: [1, 2, 3, 4, 1, 2, 5], khung: 3 },
  fe5: { ref: [4, 7, 6, 1, 7, 6, 1, 2, 7, 2], khung: 3 },
  fe5b: { ref: [7, 0, 1, 2, 0, 3], khung: 3 },
  fe6: { ref: [1, 2, 3, 4, 1, 2], khung: 3 },
  bel3: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 3 },
  bel4: { ref: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], khung: 4 },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/846a127fd41d868da1d655024adc46f70a2af92f.svg" alt="Số lỗi theo số khung của FIFO và LRU" loading="lazy" /><p class="chu-thich">🧮 Số lỗi theo số khung của FIFO và LRU</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">let x = 7;
const lcg = () =&gt; { x = (x * 1103515245 + 12345) % 2147483648; return Math.floor(x / 65536) % 1000; };
const REF = Array.from({ length: 400 }, () =&gt; {
  const p = lcg(), q = lcg();
  if (p &lt; 700) return [1, 2, 3][q % 3];
  if (p &lt; 950) return [4, 5, 6, 7, 8][q % 5];
  return 10 + (q % 12);
});
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const A = 30, B = 10;</code></pre></details>
<p>FIFO: 3 khung → <strong>9</strong> lỗi, 4 khung → <strong>10</strong>. LRU: 10 → 8, không bao giờ tăng. LRU là <strong>thuật toán ngăn xếp</strong>: với n + 1 khung nó giữ mọi trang nó sẽ giữ với n khung, cộng thêm một, nên chỉ có thể lỗi ít đi. Lựa chọn của FIFO phụ thuộc thứ tự nạp, mà thứ tự đó đổi hẳn khi số khung đổi. (FE4 c19, FE7 c21, FE12 c19, FE13 c20.)</p>
</details>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Nghịch lý Belady trên chuỗi kinh điển: thêm khung, thêm lỗi trang.</p>
<div class="os-lab os-lab-sim-vm os-lab-p-belady"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> FIFO với 3 khung, rồi 4 khung <a href="/os-lab?sim=vm&amp;preset=belady&amp;lang=vi" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Chạy FIFO với 3 khung rồi 4 khung, ghi cả hai số lỗi trang.</li><li>Chạy LRU với cùng số khung và giải thích vì sao thuật toán ngăn xếp không bao giờ bị như vậy.</li></ol></div>
</div>`),
    bi(`<h3>🧪 Exercise 6 — aging and NRU by hand (15 min)</h3>
<p>Four pages, 8-bit aging counters starting at 0. R bits per tick (pages 0–3): tick 0: 1100, tick 1: 0110, tick 2: 1001, tick 3: 0100. After tick 3, which page does aging evict? At the same moment (R = the bits of tick 3) the M bits are 0, 1, 1, 0: which class is each page in for NRU, and which pages may NRU evict?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Aging and NRU by hand on 4 pages: R bits for 4 clock ticks, M bits at the end
const R = [[1, 1, 0, 0], [0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 0, 0]];   // R[tick][page]
const M = [0, 1, 1, 0];
let c = [0, 0, 0, 0];
R.forEach((bits, t) =&gt; {
  c = c.map((v, p) =&gt; (v &gt;&gt; 1) | (bits[p] &lt;&lt; 7));        // shift right, R into the leftmost of 8 bits
  console.log(&#96;after tick &#36;{t}: &#96; + c.map((v, p) =&gt; &#96;page &#36;{p} = &#36;{v.toString(2).padStart(8, '0')}&#96;).join('  '));
});
const victim = c.indexOf(Math.min(...c));
console.log(&#96;aging evicts page &#36;{victim}&#96;);
// NRU right after tick 3 (R = the bits of tick 3, before they are cleared)
const cls = R[3].map((r, p) =&gt; 2 * r + M[p]);
console.log(&#96;NRU classes (2R + M): &#36;{cls.map((k, p) =&gt; &#96;page &#36;{p} = class &#36;{k}&#96;).join(', ')}&#96;);
const low = Math.min(...cls);
console.log(&#96;NRU evicts a page from class &#36;{low}: page(s) &#36;{cls.map((k, p) =&gt; (k === low ? p : -1)).filter((p) =&gt; p &gt;= 0).join(', ')}&#96;);</code></pre>
<div class="out">$ node aging-nru.js<br>
after tick 0: page 0 = 10000000 &nbsp;page 1 = 10000000 &nbsp;page 2 = 00000000 &nbsp;page 3 = 00000000<br>
after tick 1: page 0 = 01000000 &nbsp;page 1 = 11000000 &nbsp;page 2 = 10000000 &nbsp;page 3 = 00000000<br>
after tick 2: page 0 = 10100000 &nbsp;page 1 = 01100000 &nbsp;page 2 = 01000000 &nbsp;page 3 = 10000000<br>
after tick 3: page 0 = 01010000 &nbsp;page 1 = 10110000 &nbsp;page 2 = 00100000 &nbsp;page 3 = 01000000<br>
aging evicts page 2<br>
NRU classes (2R + M): page 0 = class 0, page 1 = class 3, page 2 = class 1, page 3 = class 0<br>
NRU evicts a page from class 0: page(s) 0, 3</div>
<p>Aging evicts <strong>page 2</strong> (<code>00100000</code>: used at tick 1 only). NRU classes = 2R + M: page 0 → 0, page 1 → 3, page 2 → 1, page 3 → 0, so NRU picks <strong>page 0 or page 3</strong> — a different answer from aging, because NRU only looks at the last tick while aging remembers 8 ticks. That is slide 29's "NRU: very crude approximation, aging: approximates LRU well".</p>
</details>`,
    `<h3>🧪 Bài 6 — aging và NRU bằng tay (15 phút)</h3>
<p>Bốn trang, bộ đếm aging 8 bit bắt đầu từ 0. Bit R mỗi nhịp (trang 0–3): nhịp 0: 1100, nhịp 1: 0110, nhịp 2: 1001, nhịp 3: 0100. Sau nhịp 3, aging đuổi trang nào? Cùng lúc đó (R = các bit của nhịp 3), bit M là 0, 1, 1, 0: mỗi trang thuộc lớp nào với NRU, và NRU được đuổi những trang nào?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Aging và NRU bằng tay trên 4 trang: bit R qua 4 nhịp đồng hồ, bit M ở cuối
const R = [[1, 1, 0, 0], [0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 0, 0]];   // R[nhịp][trang]
const M = [0, 1, 1, 0];
let c = [0, 0, 0, 0];
R.forEach((bits, t) =&gt; {
  c = c.map((v, p) =&gt; (v &gt;&gt; 1) | (bits[p] &lt;&lt; 7));        // dịch phải, R vào bit trái nhất của 8 bit
  console.log(&#96;after tick &#36;{t}: &#96; + c.map((v, p) =&gt; &#96;page &#36;{p} = &#36;{v.toString(2).padStart(8, '0')}&#96;).join('  '));
});
const victim = c.indexOf(Math.min(...c));
console.log(&#96;aging evicts page &#36;{victim}&#96;);
// NRU ngay sau nhịp 3 (R = bit của nhịp 3, trước khi bị xoá)
const cls = R[3].map((r, p) =&gt; 2 * r + M[p]);
console.log(&#96;NRU classes (2R + M): &#36;{cls.map((k, p) =&gt; &#96;page &#36;{p} = class &#36;{k}&#96;).join(', ')}&#96;);
const low = Math.min(...cls);
console.log(&#96;NRU evicts a page from class &#36;{low}: page(s) &#36;{cls.map((k, p) =&gt; (k === low ? p : -1)).filter((p) =&gt; p &gt;= 0).join(', ')}&#96;);</code></pre>
<div class="out">$ node aging-nru.js<br>
after tick 0: page 0 = 10000000 &nbsp;page 1 = 10000000 &nbsp;page 2 = 00000000 &nbsp;page 3 = 00000000<br>
after tick 1: page 0 = 01000000 &nbsp;page 1 = 11000000 &nbsp;page 2 = 10000000 &nbsp;page 3 = 00000000<br>
after tick 2: page 0 = 10100000 &nbsp;page 1 = 01100000 &nbsp;page 2 = 01000000 &nbsp;page 3 = 10000000<br>
after tick 3: page 0 = 01010000 &nbsp;page 1 = 10110000 &nbsp;page 2 = 00100000 &nbsp;page 3 = 01000000<br>
aging evicts page 2<br>
NRU classes (2R + M): page 0 = class 0, page 1 = class 3, page 2 = class 1, page 3 = class 0<br>
NRU evicts a page from class 0: page(s) 0, 3</div>
<p>Aging đuổi <strong>trang 2</strong> (<code>00100000</code>: chỉ được dùng ở nhịp 1). Lớp NRU = 2R + M: trang 0 → 0, trang 1 → 3, trang 2 → 1, trang 3 → 0, nên NRU chọn <strong>trang 0 hoặc trang 3</strong> — khác đáp án của aging, vì NRU chỉ nhìn nhịp cuối còn aging nhớ 8 nhịp. Đó chính là câu của slide 29: "NRU: xấp xỉ rất thô, aging: xấp xỉ LRU tốt".</p>
</details>`),
    bi(`<h3>🧪 Exercise 7 — memory facts of a real program (20 min)</h3>
<p>(a) A 4096 × 4096 matrix of <code>int</code> (64 MB) is summed twice: row by row, then column by column. Predict which is faster and by roughly how much. (b) Run a real command under <code>/usr/bin/time -v</code> and find its peak memory and its page faults.</p>
<details><summary>Solution — measured in the course container</summary>
<pre><code class="language-c">// Same sum, two loop orders over a 64 MB matrix: row by row (neighbouring bytes) vs column by column (a new page every step)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#define N 4096                                            // 4096 x 4096 ints = 64 MB; one row = 16 KB = 4 pages

static double ms(struct timespec a, struct timespec b) { return (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6; }

int main(void) {
    int *m = malloc(sizeof(int) * N * N);
    for (long i = 0; i &lt; (long)N * N; i++) m[i] = 1;
    struct timespec a, b;
    long s = 0;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (int i = 0; i &lt; N; i++) for (int j = 0; j &lt; N; j++) s += m[(long)i * N + j];   // row-major
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    printf("by rows:    %8.1f ms  (sum %ld)\\n", ms(a, b), s);
    s = 0;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (int j = 0; j &lt; N; j++) for (int i = 0; i &lt; N; i++) s += m[(long)i * N + j];   // column-major: jumps 16 KB each step
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    printf("by columns: %8.1f ms  (sum %ld)\\n", ms(a, b), s);
    free(m);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -O1 thu-tu-duyet.c -o thu-tu-duyet &amp;&amp; ./thu-tu-duyet<br>
by rows: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.1 ms &nbsp;(sum 16777216)<br>
by columns: &nbsp;&nbsp;&nbsp;160.0 ms &nbsp;(sum 16777216)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>(a) Row by row reads neighbouring bytes: each 64-byte cache line serves 16 ints and each 4-KB page 1,024 ints, so the TLB and the caches are almost always hit. Column by column jumps 16 KB (one row) at every step: every access touches a different page and a different cache line — many times slower here (the exact factor varies by machine). Same work, same result, only the order changed. 🧭 Backend lesson: iterate over arrays in memory order; in Java, a <code>int[][]</code> is an array of row arrays, so <code>a[i][j]</code> with <code>j</code> in the inner loop is the fast way.</p>
<div class="out"># Ask /usr/bin/time for the memory facts of a real command: peak RAM, major and minor page faults<br>
$ wc -l so.txt<br>
300000 so.txt<br>
$ /usr/bin/time -v sort -n so.txt -o sx.txt 2&gt;&amp;1 | grep -E 'Maximum resident|page faults'<br>
	Maximum resident set size (kbytes): 32824<br>
	Major (requiring I/O) page faults: 0<br>
	Minor (reclaiming a frame) page faults: 791<br>
$ head -3 sx.txt<br>
1<br>
2<br>
3</div>
<p>(b) <code>sort</code> on 300,000 numbers peaked at about 32 MB resident and took hundreds of <strong>minor</strong> faults but <strong>0 major</strong> faults — the input file was still in the page cache, so nothing had to be read from disk (slide 36). Run it on your own WSL or laptop: the numbers differ, the meaning does not.</p>
</details>`,
    `<h3>🧪 Bài 7 — số liệu bộ nhớ của chương trình thật (20 phút)</h3>
<p>(a) Một ma trận <code>int</code> 4096 × 4096 (64 MB) được cộng hai lần: theo hàng, rồi theo cột. Đoán cách nào nhanh hơn và nhanh hơn khoảng bao nhiêu. (b) Chạy một lệnh thật dưới <code>/usr/bin/time -v</code> và tìm bộ nhớ đỉnh cùng số lỗi trang của nó.</p>
<details><summary>Lời giải — đo trong container của môn</summary>
<pre><code class="language-c">// Cùng một tổng, hai thứ tự lặp qua ma trận 64 MB: theo hàng (byte kề nhau) vs theo cột (mỗi bước một trang mới)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#define N 4096                                            // một hàng = 16 KB = 4 trang

static double ms(struct timespec a, struct timespec b) { return (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6; }

int main(void) {
    int *m = malloc(sizeof(int) * N * N);
    for (long i = 0; i &lt; (long)N * N; i++) m[i] = 1;
    struct timespec a, b;
    long s = 0;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (int i = 0; i &lt; N; i++) for (int j = 0; j &lt; N; j++) s += m[(long)i * N + j];   // theo hàng
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    printf("by rows:    %8.1f ms  (sum %ld)\\n", ms(a, b), s);
    s = 0;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (int j = 0; j &lt; N; j++) for (int i = 0; i &lt; N; i++) s += m[(long)i * N + j];   // theo cột: mỗi bước nhảy 16 KB
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    printf("by columns: %8.1f ms  (sum %ld)\\n", ms(a, b), s);
    free(m);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -O1 thu-tu-duyet.c -o thu-tu-duyet &amp;&amp; ./thu-tu-duyet<br>
by rows: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.1 ms &nbsp;(sum 16777216)<br>
by columns: &nbsp;&nbsp;&nbsp;160.0 ms &nbsp;(sum 16777216)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>(a) Theo hàng là đọc các byte kề nhau: mỗi dòng cache 64 byte phục vụ 16 số int và mỗi trang 4 KB phục vụ 1.024 số int, nên TLB và cache gần như luôn trúng. Theo cột thì mỗi bước nhảy 16 KB (một hàng): lần truy cập nào cũng chạm một trang khác và một dòng cache khác — ở đây chậm hơn nhiều lần (hệ số chính xác tuỳ máy). Cùng khối lượng việc, cùng kết quả, chỉ đổi thứ tự. 🧭 Bài học backend: duyệt mảng theo thứ tự trong bộ nhớ; trong Java, <code>int[][]</code> là mảng các mảng hàng, nên <code>a[i][j]</code> với <code>j</code> ở vòng trong là cách nhanh.</p>
<div class="out"># Hỏi /usr/bin/time các số liệu bộ nhớ của một lệnh thật: RAM đỉnh, lỗi trang nặng và nhẹ<br>
$ wc -l so.txt<br>
300000 so.txt<br>
$ /usr/bin/time -v sort -n so.txt -o sx.txt 2&gt;&amp;1 | grep -E 'Maximum resident|page faults'<br>
	Maximum resident set size (kbytes): 32824<br>
	Major (requiring I/O) page faults: 0<br>
	Minor (reclaiming a frame) page faults: 791<br>
$ head -3 sx.txt<br>
1<br>
2<br>
3</div>
<p>(b) <code>sort</code> trên 300.000 số dùng đỉnh khoảng 32 MB thường trú và tốn vài trăm lỗi <strong>nhẹ</strong> nhưng <strong>0 lỗi nặng</strong> — tệp đầu vào vẫn ở trong page cache nên không phải đọc gì từ đĩa (slide 36). Chạy trên WSL hay laptop của bạn: con số khác, ý nghĩa thì không.</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>virtual address / physical address</strong></td><td>địa chỉ ảo / địa chỉ vật lý</td><td>The address a program uses, versus the address the memory hardware sees after translation.</td></tr>
<tr><td><strong>address space</strong></td><td>không gian địa chỉ</td><td>The set of addresses a process may use, private to that process.</td></tr>
<tr><td><strong>base and limit registers</strong></td><td>thanh ghi cơ sở và giới hạn</td><td>Dynamic relocation: every address is checked against the limit and added to the base.</td></tr>
<tr><td><strong>swapping</strong></td><td>hoán đổi (swapping)</td><td>Moving whole processes (or pages) between memory and disk.</td></tr>
<tr><td><strong>bitmap / free list</strong></td><td>bitmap / danh sách trống</td><td>Two ways to track free memory: one bit per allocation unit, or a list of process and hole segments.</td></tr>
<tr><td><strong>first / next / best / worst fit</strong></td><td>vừa đầu tiên / kế tiếp / khít nhất / lỗ lớn nhất</td><td>Rules for choosing a hole: the first big enough, the next from the last position, the smallest that fits, the largest.</td></tr>
<tr><td><strong>virtual memory</strong></td><td>bộ nhớ ảo</td><td>Each program gets its own address space split into pages; only the pages in use need to be in RAM.</td></tr>
<tr><td><strong>page / page frame</strong></td><td>trang / khung trang</td><td>Fixed-size unit of virtual memory / the same-size unit of physical memory that holds it.</td></tr>
<tr><td><strong>MMU</strong></td><td>bộ quản lý bộ nhớ (MMU)</td><td>Hardware that translates virtual addresses to physical ones using the page tables.</td></tr>
<tr><td><strong>page table / page table entry</strong></td><td>bảng trang / mục bảng trang</td><td>Table mapping page numbers to frames; each entry has the frame number and present, protection, modified, referenced, caching bits.</td></tr>
<tr><td><strong>page fault</strong></td><td>lỗi trang</td><td>Trap caused by touching a page that is not in memory; minor if no disk read is needed, major if it is.</td></tr>
<tr><td><strong>TLB</strong></td><td>bộ đệm dịch địa chỉ (TLB)</td><td>Small associative cache of recent page-to-frame translations inside the MMU.</td></tr>
<tr><td><strong>multilevel / inverted page table</strong></td><td>bảng trang nhiều mức / nghịch đảo</td><td>Tables split by address fields so unused regions cost nothing / one entry per physical frame, searched by hash.</td></tr>
<tr><td><strong>page replacement (OPT, FIFO, LRU, clock, aging)</strong></td><td>thay trang</td><td>Choosing which page to evict when memory is full; OPT is the unreachable benchmark, aging and clock approximate LRU.</td></tr>
<tr><td><strong>working set / thrashing</strong></td><td>tập làm việc / thrashing</td><td>The pages a process is using now; when it does not fit, the process faults constantly and makes almost no progress.</td></tr>
<tr><td><strong>Belady's anomaly</strong></td><td>nghịch lý Belady</td><td>With FIFO, adding frames can increase the number of page faults.</td></tr>
<tr><td><strong>copy-on-write</strong></td><td>chép khi ghi (COW)</td><td>Pages shared after fork are copied only when one side writes to them.</td></tr>
<tr><td><strong>segmentation / external fragmentation</strong></td><td>phân đoạn / phân mảnh ngoài</td><td>Many independent variable-size address spaces per program; holes between them waste memory.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>virtual address / physical address</strong></td><td>địa chỉ ảo / địa chỉ vật lý</td><td>Địa chỉ chương trình dùng, so với địa chỉ phần cứng bộ nhớ nhìn thấy sau khi dịch.</td></tr>
<tr><td><strong>address space</strong></td><td>không gian địa chỉ</td><td>Tập địa chỉ một tiến trình được dùng, riêng của tiến trình đó.</td></tr>
<tr><td><strong>base and limit registers</strong></td><td>thanh ghi cơ sở và giới hạn</td><td>Tái định vị động: mọi địa chỉ được so với giới hạn rồi cộng với cơ sở.</td></tr>
<tr><td><strong>swapping</strong></td><td>hoán đổi (swapping)</td><td>Chuyển nguyên tiến trình (hoặc trang) giữa bộ nhớ và đĩa.</td></tr>
<tr><td><strong>bitmap / free list</strong></td><td>bitmap / danh sách trống</td><td>Hai cách theo dõi bộ nhớ trống: mỗi đơn vị cấp phát một bit, hoặc danh sách các đoạn tiến trình và lỗ.</td></tr>
<tr><td><strong>first / next / best / worst fit</strong></td><td>vừa đầu tiên / kế tiếp / khít nhất / lỗ lớn nhất</td><td>Luật chọn lỗ: lỗ đầu tiên đủ lớn, lỗ kế từ vị trí lần trước, lỗ nhỏ nhất vừa, lỗ lớn nhất.</td></tr>
<tr><td><strong>virtual memory</strong></td><td>bộ nhớ ảo</td><td>Mỗi chương trình có không gian địa chỉ riêng chia thành trang; chỉ trang đang dùng mới cần ở RAM.</td></tr>
<tr><td><strong>page / page frame</strong></td><td>trang / khung trang</td><td>Đơn vị cố định của bộ nhớ ảo / đơn vị cùng cỡ của bộ nhớ vật lý chứa nó.</td></tr>
<tr><td><strong>MMU</strong></td><td>bộ quản lý bộ nhớ (MMU)</td><td>Phần cứng dịch địa chỉ ảo sang vật lý bằng các bảng trang.</td></tr>
<tr><td><strong>page table / page table entry</strong></td><td>bảng trang / mục bảng trang</td><td>Bảng ánh xạ số trang sang khung; mỗi mục có số khung và các bit có mặt, bảo vệ, đã sửa, đã tham chiếu, cấm cache.</td></tr>
<tr><td><strong>page fault</strong></td><td>lỗi trang</td><td>Bẫy xảy ra khi chạm trang không ở bộ nhớ; nhẹ nếu không cần đọc đĩa, nặng nếu cần.</td></tr>
<tr><td><strong>TLB</strong></td><td>bộ đệm dịch địa chỉ (TLB)</td><td>Bộ đệm kết hợp nhỏ trong MMU chứa các phép dịch trang → khung gần đây.</td></tr>
<tr><td><strong>multilevel / inverted page table</strong></td><td>bảng trang nhiều mức / nghịch đảo</td><td>Bảng chia theo các trường địa chỉ để vùng không dùng không tốn gì / mỗi khung vật lý một mục, tìm bằng băm.</td></tr>
<tr><td><strong>page replacement (OPT, FIFO, LRU, clock, aging)</strong></td><td>thay trang</td><td>Chọn trang để đuổi khi bộ nhớ đầy; OPT là mốc không đạt được, aging và clock xấp xỉ LRU.</td></tr>
<tr><td><strong>working set / thrashing</strong></td><td>tập làm việc / thrashing</td><td>Các trang tiến trình đang dùng; khi không vừa bộ nhớ, tiến trình lỗi liên tục và gần như không tiến triển.</td></tr>
<tr><td><strong>Belady's anomaly</strong></td><td>nghịch lý Belady</td><td>Với FIFO, thêm khung có thể làm tăng số lỗi trang.</td></tr>
<tr><td><strong>copy-on-write</strong></td><td>chép khi ghi (COW)</td><td>Trang dùng chung sau fork chỉ bị chép khi một bên ghi vào.</td></tr>
<tr><td><strong>segmentation / external fragmentation</strong></td><td>phân đoạn / phân mảnh ngoài</td><td>Nhiều không gian địa chỉ độc lập, cỡ thay đổi cho mỗi chương trình; lỗ giữa chúng làm phí bộ nhớ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 3</h2>
<ol>
<li>Without an abstraction, programs use physical addresses: no protection, no relocation. <strong>Base and limit</strong> give each process an address space: check the limit, then add the base.</li>
<li>Free memory is tracked by a <strong>bitmap</strong> or a <strong>list</strong>; holes are chosen by first / next / best / worst / quick fit (glibc <code>malloc</code> is best fit for large blocks).</li>
<li><strong>Virtual memory</strong>: address spaces split into pages, mapped onto frames; page = address div size, offset = address mod size, physical = frame × size + offset. The offset is never changed.</li>
<li>A <strong>PTE</strong> holds the frame number plus present, protection, modified, referenced and caching-disabled bits; present = 0 → <strong>page fault</strong>.</li>
<li>Translation must be fast (<strong>TLB</strong>) and tables must stay small (<strong>multilevel</strong> or <strong>inverted</strong> tables). 32-bit: 10 | 10 | 12; x86-64/ARM64: 9 | 9 | 9 | 9 | 12.</li>
<li>Replacement: OPT is the benchmark; FIFO is bad (and has <strong>Belady's anomaly</strong>); second chance/clock fix FIFO; LRU is excellent but costly; <strong>aging</strong> and <strong>WSClock</strong> are the practical winners.</li>
<li>Design and implementation: local vs global allocation, PFF, shared pages and <strong>copy-on-write</strong>, shared libraries, the 10 steps of a page fault, instruction restart, swap areas, policy vs mechanism.</li>
<li><strong>Segmentation</strong> gives many independent, variable-size address spaces (logical, shareable, protectable) but suffers external fragmentation; MULTICS and x86 paged the segments, and x86-64 kept only FS/GS.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 3</h2>
<ol>
<li>Không có trừu tượng, chương trình dùng địa chỉ vật lý: không bảo vệ, không tái định vị. <strong>Cơ sở và giới hạn</strong> cho mỗi tiến trình một không gian địa chỉ: kiểm giới hạn, rồi cộng cơ sở.</li>
<li>Bộ nhớ trống được theo dõi bằng <strong>bitmap</strong> hoặc <strong>danh sách</strong>; lỗ được chọn bằng first / next / best / worst / quick fit (<code>malloc</code> của glibc là best fit với khối lớn).</li>
<li><strong>Bộ nhớ ảo</strong>: không gian địa chỉ chia thành trang, ánh xạ vào khung; trang = địa chỉ div cỡ, độ dời = địa chỉ mod cỡ, vật lý = khung × cỡ + độ dời. Độ dời không bao giờ đổi.</li>
<li>Một <strong>PTE</strong> giữ số khung cùng các bit có mặt, bảo vệ, đã sửa, đã tham chiếu và cấm cache; có mặt = 0 → <strong>lỗi trang</strong>.</li>
<li>Phép dịch phải nhanh (<strong>TLB</strong>) và bảng phải nhỏ (bảng <strong>nhiều mức</strong> hay <strong>nghịch đảo</strong>). 32 bit: 10 | 10 | 12; x86-64/ARM64: 9 | 9 | 9 | 9 | 12.</li>
<li>Thay trang: OPT là mốc so; FIFO dở (và có <strong>nghịch lý Belady</strong>); second chance/clock chữa FIFO; LRU rất tốt nhưng tốn kém; <strong>aging</strong> và <strong>WSClock</strong> là hai lựa chọn thực tế tốt nhất.</li>
<li>Thiết kế và cài đặt: cấp phát cục bộ vs toàn cục, PFF, trang dùng chung và <strong>copy-on-write</strong>, thư viện dùng chung, 10 bước của lỗi trang, chạy lại lệnh, vùng swap, chính sách vs cơ chế.</li>
<li><strong>Phân đoạn</strong> cho nhiều không gian địa chỉ độc lập, cỡ thay đổi (logic, chia sẻ được, bảo vệ được) nhưng bị phân mảnh ngoài; MULTICS và x86 phân trang các đoạn, còn x86-64 chỉ giữ lại FS/GS.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch3) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which statement about the Translation Lookaside Buffer (TLB) is INCORRECT?|||(Dạng câu FE) Phát biểu nào về TLB (Translation Lookaside Buffer) là SAI?',
      options: ['A TLB is sometimes called an associative memory|||TLB đôi khi được gọi là bộ nhớ kết hợp (associative memory)', 'A TLB miss implies that a disk operation will follow|||Trượt TLB nghĩa là chắc chắn sẽ có một thao tác đĩa theo sau', 'Each TLB entry holds a virtual page number and the matching page frame|||Mỗi mục TLB giữ một số trang ảo và khung trang tương ứng', 'The TLB holds only a subset of the page table entries|||TLB chỉ giữ một tập con các mục của bảng trang'],
      correctIndex: 1,
      points: 1,
      explanation: 'A TLB miss only means the translation is not cached: the MMU (or the OS) walks the page table, which is in memory. A disk operation follows only if the page itself is absent — a page fault, a different event (book §3.3.3: soft miss vs hard miss). A, C and D are all true: the TLB is a small associative cache of some page table entries. Lesson 3.A, slide 17.|||Trượt TLB chỉ có nghĩa là phép dịch chưa có trong bộ đệm: MMU (hoặc HĐH) đi tra bảng trang, mà bảng trang nằm trong bộ nhớ. Chỉ khi chính trang đó vắng mặt mới có thao tác đĩa — đó là lỗi trang, một sự kiện khác (sách §3.3.3: soft miss và hard miss). A, C và D đều đúng: TLB là bộ đệm kết hợp nhỏ chứa một số mục của bảng trang. Bài 3.A, slide 17.' },
    { id: 'q2',
      question: '(FE question type) Using base and limit registers, programs P1, P2 and P3 of sizes 8 KB, 4 KB and 16 KB are loaded one after another starting at address 0. What are the base and limit registers of P3?|||(Dạng câu FE) Dùng thanh ghi cơ sở và giới hạn, các chương trình P1, P2, P3 cỡ 8 KB, 4 KB và 16 KB được nạp nối tiếp nhau bắt đầu từ địa chỉ 0. Thanh ghi cơ sở và giới hạn của P3 là bao nhiêu?',
      options: ['Base: 8KB, Limit: 24KB|||Base: 8KB, Limit: 24KB', 'Base: 12KB, Limit: 28KB|||Base: 12KB, Limit: 28KB', 'Base: 8KB, Limit: 28KB|||Base: 8KB, Limit: 28KB', 'Base: 12KB, Limit: 16KB|||Base: 12KB, Limit: 16KB'],
      correctIndex: 3,
      points: 1,
      explanation: "Computed by a program: P3 starts after P1 and P2, so base = 8 + 4 = 12 KB; in Tanenbaum's design the limit register holds the LENGTH of the program, 16 KB — not its end address 28 KB. Every address of P3 is checked against 16 KB, then 12 KB is added. Lesson 3.A, slide 5.|||Do chương trình tính: P3 bắt đầu sau P1 và P2, nên cơ sở = 8 + 4 = 12 KB; theo thiết kế của Tanenbaum, thanh ghi giới hạn giữ ĐỘ DÀI chương trình, 16 KB — không phải địa chỉ kết thúc 28 KB. Mọi địa chỉ của P3 được so với 16 KB rồi cộng thêm 12 KB. Bài 3.A, slide 5." },
    { id: 'q3',
      question: '(FE question type) A computer with a 32-bit address uses a two-level page table. Virtual addresses are split into a 10-bit top-level page table field, a 12-bit second-level page table field, and an offset. How large are the pages?|||(Dạng câu FE) Một máy tính địa chỉ 32 bit dùng bảng trang hai mức. Địa chỉ ảo được chia thành trường bảng trang mức trên 10 bit, trường bảng trang mức hai 12 bit, và độ dời. Trang lớn bao nhiêu?',
      options: ['1-KB page|||Trang 1 KB', '2-KB page|||Trang 2 KB', '4-KB page|||Trang 4 KB', '512B page|||Trang 512 byte'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by a program: the offset gets the bits that are left, 32 − 10 − 12 = 10 bits, so a page is 2¹⁰ = 1,024 bytes. The trap is to answer 4 KB out of habit — the page size always follows from the offset width, never the other way round. Lesson 3.A, slide 18; practice 3.C, exercise 2.|||Do chương trình tính: độ dời nhận số bit còn lại, 32 − 10 − 12 = 10 bit, nên một trang là 2¹⁰ = 1.024 byte. Bẫy là trả lời 4 KB theo thói quen — cỡ trang luôn suy ra từ độ rộng của độ dời, không bao giờ ngược lại. Bài 3.A, slide 18; thực hành 3.C, bài 2.' },
    { id: 'q4',
      question: 'With 4-KB pages and this page table (virtual page → page frame) - 0→2, 1→1, 2→6, 3→0, 4→4, 5→3, 9→5, 11→7, all other pages absent - what physical address does virtual address 20500 map to?|||Với trang 4 KB và bảng trang (trang ảo → khung trang) - 0→2, 1→1, 2→6, 3→0, 4→4, 5→3, 9→5, 11→7, các trang khác vắng mặt - địa chỉ ảo 20500 ánh xạ tới địa chỉ vật lý nào?',
      options: ['20500|||20500', '8212|||8212', '12308|||12308', '24596|||24596'],
      correctIndex: 2,
      points: 1,
      explanation: "Computed by the simulator: page = 20500 div 4096 = 5, offset = 20500 mod 4096 = 20; page 5 is in frame 3, so physical = 3 × 4096 + 20 = 12308. The offset (20) is copied unchanged; only the page number is replaced. 8212 would be frame 2 and 24596 frame 6 (wrong rows of the table). This is the book's own example (Figure 3-9). Lesson 3.A, slide 13.|||Do bộ mô phỏng tính: trang = 20500 div 4096 = 5, độ dời = 20500 mod 4096 = 20; trang 5 ở khung 3, nên vật lý = 3 × 4096 + 20 = 12308. Độ dời (20) được chép nguyên; chỉ số trang bị thay. 8212 là khung 2 và 24596 là khung 6 (đọc nhầm dòng của bảng). Đây là ví dụ của chính sách (Hình 3-9). Bài 3.A, slide 13." },
    { id: 'q5',
      question: '(FE question type) If FIFO page replacement is used with four page frames, how many page faults occur with the reference string 0 1 7 2 3 2 7 1 0 3, if the four frames are initially empty?|||(Dạng câu FE) Nếu dùng thay trang FIFO với bốn khung trang, chuỗi tham chiếu 0 1 7 2 3 2 7 1 0 3 gây bao nhiêu lỗi trang, biết bốn khung ban đầu trống?',
      options: ['5|||5', '6|||6', '7|||7', '4|||4'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by the simulator: 0, 1, 7, 2 fill the four frames (4 faults); 3 evicts 0, the oldest (5); 2 and 7 hit; 1 hits; 0 evicts 1 (6); 3 hits. Total 6 — the empty frames at the start count as faults. FE3 question 17 (also FE7, FE11, FE14). Lesson 3.A, slide 20; practice 3.C, exercise 4.|||Do bộ mô phỏng tính: 0, 1, 7, 2 lấp bốn khung (4 lỗi); 3 đuổi 0, trang cũ nhất (5); 2 và 7 trúng; 1 trúng; 0 đuổi 1 (6); 3 trúng. Tổng 6 — các lần lấp khung trống ban đầu cũng tính là lỗi. FE3 câu 17 (cả FE7, FE11, FE14). Bài 3.A, slide 20; thực hành 3.C, bài 4.' },
    { id: 'q6',
      question: '(FE question type) A system uses 3 page frames, initially empty, and the LRU replacement policy. How many page faults occur for the reference string 4, 7, 6, 1, 7, 6, 1, 2, 7, 2?|||(Dạng câu FE) Một hệ thống dùng 3 khung trang, ban đầu trống, và chính sách thay trang LRU. Chuỗi tham chiếu 4, 7, 6, 1, 7, 6, 1, 2, 7, 2 gây bao nhiêu lỗi trang?',
      options: ['4|||4', '7|||7', '6|||6', '2|||2'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: 4, 7, 6 fill the frames (3); 1 evicts 4, the least recently used (4); 7, 6, 1 hit; 2 evicts 7, now the least recently used (5); 7 evicts 6 (6); 2 hits. Total 6. FIFO happens to give 6 here too, but for different evictions. FE5 question 22 = FE15 question 23. Lesson 3.A, slide 24; practice 3.C, exercise 4.|||Do bộ mô phỏng tính: 4, 7, 6 lấp khung (3); 1 đuổi 4, trang lâu nhất chưa dùng (4); 7, 6, 1 trúng; 2 đuổi 7, lúc này là trang lâu nhất chưa dùng (5); 7 đuổi 6 (6); 2 trúng. Tổng 6. FIFO tình cờ cũng ra 6 ở đây, nhưng đuổi khác trang. FE5 câu 22 = FE15 câu 23. Bài 3.A, slide 24; thực hành 3.C, bài 4.' },
    { id: 'q7',
      question: '(FE question type) Memory has holes of 10 MB, 18 MB, 9 MB and 14 MB, in that order. With best fit, which holes are used for the successive requests 11 MB, 2 MB, 9 MB and 8 MB?|||(Dạng câu FE) Bộ nhớ có các lỗ 10 MB, 18 MB, 9 MB và 14 MB theo thứ tự đó. Với best fit, các yêu cầu lần lượt 11 MB, 2 MB, 9 MB và 8 MB dùng những lỗ nào?',
      options: ['14, 3, 9, 10 MB|||14, 3, 9, 10 MB', '18, 7, 10, 9 MB|||18, 7, 10, 9 MB', '14, 3, 10, 9 MB|||14, 3, 10, 9 MB', '18, 7, 9, 10 MB|||18, 7, 9, 10 MB'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: 11 → the smallest hole that fits is 14 (3 left over); 2 → the smallest is now that 3-MB remainder; 9 → the 9-MB hole fits exactly; 8 → 10 (18 is larger). The \"3\" is the part of the 14-MB hole left after splitting. Options B and D are worst fit's habits (start with 18). FE3 question 23 = FE5 question 30. Lesson 3.A, slide 10; practice 3.C, exercise 3.|||Do bộ mô phỏng tính: 11 → lỗ nhỏ nhất vừa là 14 (dư 3); 2 → lỗ nhỏ nhất giờ là phần dư 3 MB đó; 9 → lỗ 9 MB vừa khít; 8 → 10 (18 lớn hơn). Con số \"3\" là phần còn lại của lỗ 14 MB sau khi tách. Phương án B và D là kiểu của worst fit (bắt đầu bằng 18). FE3 câu 23 = FE5 câu 30. Bài 3.A, slide 10; thực hành 3.C, bài 3." },
    { id: 'q8',
      question: 'FIFO on the reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 gives 9 page faults with 3 frames. How many page faults does it give with 4 frames (frames initially empty)?|||FIFO trên chuỗi tham chiếu 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 cho 9 lỗi trang với 3 khung. Với 4 khung (ban đầu trống) thì bao nhiêu lỗi trang?',
      options: ['8|||8', '9|||9', '6|||6', '10|||10'],
      correctIndex: 3,
      points: 1,
      explanation: "Computed by the simulator: 10 — more frames, MORE faults. This is Belady's anomaly, possible with FIFO because its choice depends on load order. LRU on the same string gives 10 with 3 frames and 8 with 4: LRU (and OPT) are stack algorithms and can never get worse with more frames. FE4 q19, FE7 q21, FE12 q19, FE13 q20. Lesson 3.B, slide 31; practice 3.C, exercise 5.|||Do bộ mô phỏng tính: 10 — thêm khung mà lỗi NHIỀU HƠN. Đây là nghịch lý Belady, xảy ra được với FIFO vì lựa chọn của nó phụ thuộc thứ tự nạp. LRU trên cùng chuỗi cho 10 lỗi với 3 khung và 8 lỗi với 4 khung: LRU (và OPT) là thuật toán ngăn xếp, không bao giờ tệ đi khi thêm khung. FE4 c19, FE7 c21, FE12 c19, FE13 c20. Bài 3.B, slide 31; thực hành 3.C, bài 5." },
    { id: 'q9',
      question: '(FE question type) What is the main advantage of the clock algorithm over the second-chance algorithm?|||(Dạng câu FE) Ưu điểm chính của thuật toán clock so với thuật toán second chance là gì?',
      options: ['It eliminates the need to move pages around in a list, reducing overhead|||Nó bỏ được việc phải dời các trang trong danh sách, giảm chi phí', 'It always causes fewer page faults|||Nó luôn gây ít lỗi trang hơn', 'It does not need the R (referenced) bit|||Nó không cần bit R (đã tham chiếu)', 'It knows the future reference string, like OPT|||Nó biết trước chuỗi tham chiếu tương lai, như OPT'],
      correctIndex: 0,
      points: 1,
      explanation: 'Clock and second chance make the same decisions (on the classic string both give 14 faults in the simulator); clock just keeps the frames on a circular list and moves a hand instead of unlinking the head and appending it to the tail. Both need the R bit; neither knows the future. FE2 q17 = FE6 q19 = FE10 q27 = FE11 q22. Lesson 3.A, slides 22–23.|||Clock và second chance ra quyết định giống nhau (trên chuỗi kinh điển, bộ mô phỏng cho cả hai 14 lỗi); clock chỉ giữ các khung trên danh sách vòng và cho một cây kim chạy, thay vì tháo trang đầu rồi nối xuống cuối. Cả hai đều cần bit R; không cái nào biết tương lai. FE2 c17 = FE6 c19 = FE10 c27 = FE11 c22. Bài 3.A, slide 22–23.' },
    { id: 'q10',
      question: '(FE question type) Segment table - segment 0: limit 600, base 219; segment 1: limit 14, base 2300; segment 2: limit 100, base 90; segment 3: limit 580, base 1327; segment 4: limit 96, base 1952. What is the physical address for the logical address (2, 50)?|||(Dạng câu FE) Bảng đoạn - đoạn 0: limit 600, base 219; đoạn 1: limit 14, base 2300; đoạn 2: limit 100, base 90; đoạn 3: limit 580, base 1327; đoạn 4: limit 96, base 1952. Địa chỉ vật lý của địa chỉ logic (2, 50) là bao nhiêu?',
      options: ['150|||150', 'Invalid address|||Địa chỉ không hợp lệ', '140|||140', '130|||130'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: segment 2 has limit 100, and 50 < 100, so the address is valid; physical = base + offset = 90 + 50 = 140. Always check the limit first: (4, 112) in the same table would be invalid because 112 ≥ 96. FE2 (SP26-RE) question 45. Lesson 3.B, slide 44.|||Do bộ mô phỏng tính: đoạn 2 có limit 100, và 50 < 100 nên địa chỉ hợp lệ; vật lý = base + độ dời = 90 + 50 = 140. Luôn kiểm giới hạn trước: (4, 112) trong cùng bảng sẽ không hợp lệ vì 112 ≥ 96. FE2 (SP26-RE) câu 45. Bài 3.B, slide 44.' },
  ],
};

export default {
  slides: [L_osg3_1, L_osg3_2],
  practice: L_on_ch3,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 3 viết lại theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán có đáp án kiểm bằng mô phỏng hoặc chương trình chạy thật: TLB, thanh ghi cơ sở và giới hạn, cỡ trang của bảng hai mức, dịch địa chỉ ảo, đếm lỗi trang FIFO và LRU, best fit, nghịch lý Belady, clock và second chance, dịch địa chỉ bằng bảng đoạn.',
};
