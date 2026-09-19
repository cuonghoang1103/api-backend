/**
 * CEA201 · Chương 8 trên web (deck 'cea9' = Chapter 9 bản 11e — Operating System
 * Support), học theo từng slide, PHẦN B: slide 27–51.
 *
 * Phần A (slide 1–26) là tổng quan HĐH, các loại HĐH và lập lịch. Phần B này là
 * TRỌN KHỐI QUẢN LÝ BỘ NHỚ: hoán đổi (swapping) → phân vùng cố định/động →
 * phân trang → bộ nhớ ảo & lỗi trang → bảng trang nghịch đảo → TLB → phân đoạn
 * → quản lý bộ nhớ Intel x86 → quản lý bộ nhớ ARM → tổng kết.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH09-COA11e.pptx (/tmp/cea201-text/cea9.txt).
 * Slide chỉ có tiêu đề + hình (27, 28, 29, 30, 31, 33, 34, 35, 40, 44, 45, 47,
 * 48, 51) đã được ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết, và mọi phép chia
 *    địa chỉ đều kiểm CẢ HAI CHIỀU (tách ra rồi dựng ngược lại):
 *   · Bài 1 — VA 32 bit, trang 4 KiB: offset 12 bit, page# 20 bit, 1.048.576 mục.
 *     0x0000C2F5 → p = 0xC = 12, d = 0x2F5 = 757; khung 0x1A7 = 423 →
 *     PA = 0x001A72F5. Dựng ngược: 0x1A72F5 >> 12 = 423 ✓, & 0xFFF = 757 ✓.
 *   · Bài 2 — VA 32 bit, trang 8 KiB: offset 13 bit, page# 19 bit, 524.288 mục.
 *     0x00409C4A → p = 516, d = 7242; khung 51 → PA = 0x00067C4A = 425.034.
 *     Dựng ngược: 425034 >> 13 = 51 ✓, & 0x1FFF = 7242 ✓.
 *   · Bài 3 — VA 48 bit, trang 4 KiB: offset 12, page# 36, 68.719.476.736 mục.
 *     0x00007FFED3A9 → p = 0x7FFED = 524.269, d = 0x3A9 = 937; khung 0x12345 =
 *     74.565 → PA = 0x123453A9 = 305.419.177. Dựng ngược khớp cả hai trường.
 *   · Bài 4 — VA 16 bit, trang 1 KiB: offset 10, page# 6, 64 mục.
 *     0xB3C7 → p = 44, d = 967; khung 9 → PA = 0x27C7 = 10.183. Dựng ngược ✓.
 *   · Kích thước bảng trang phẳng: 32 bit/4 KiB/4 B = 4 MiB mỗi tiến trình;
 *     32 bit/8 KiB/4 B = 2 MiB; 48 bit/4 KiB/8 B = 512 GiB (!).
 *     Hai mức kiểu x86 cho tiến trình dùng 16 MiB = 4 KiB (dir) + 4×4 KiB =
 *     20 KiB → tiết kiệm 4 MiB/20 KiB = 204,8 lần.
 *   · TLB, T_tlb = 1 ns, T_mem = 100 ns, EAT = h(T+M) + (1−h)(T+2M):
 *     h = 0 → 201 ns · 0,5 → 151 · 0,9 → 111 · 0,99 → 102 · 0,999 → 101,1 ·
 *     1 → 101. Kiểm bằng HAI dạng công thức (dạng gộp T+M+(1−h)M cho cùng số).
 *   · Lỗi trang, M = 100 ns, phục vụ = 8 ms: p = 10⁻³ → 8.099,9 ns (81×);
 *     10⁻⁴ → 899,99 (9×); 10⁻⁵ → 180 (1,8×); 10⁻⁶ → 108 (1,08×).
 *     Muốn chậm dưới 10% thì p ≤ 1,25×10⁻⁶ ≈ 1 lỗi trang mỗi 800.000 truy cập.
 *   · Figure 9.13: 8×8 M = 64 M ✓ và 8+2+4+6+8+8+12+16 = 64 M ✓.
 *   · Figure 9.14: 64−8 = 56 → 56−20 = 36 → 36−14 = 22 → 22−18 = 4 ✓;
 *     (f) 14−8 = 6 ✓; (h) 20−14 = 6 ✓.
 *   · x86: 2³² = 4 GiB, 2⁴⁶ = 64 TiB, 14+32 = 46 ✓; linear 10+10+12 = 32 ✓;
 *     1024 × 4 MiB = 4 GiB ✓; TLB 32 mục × 4 KiB = 128 KiB phủ được.
 *   · ARM: L1 index 12 bit → 4096 mục × 4 B = 16 KiB; L2 index 8 bit → 256 mục
 *     × 4 B = 1 kB — khớp đúng câu "Requires 1kB" của slide 46 ✓.
 *     Section 2²⁰ = 1 MB, supersection 2²⁴ = 16 MB, large page 2¹⁶ = 64 kB ✓.
 *
 * Chỗ slide gốc CỤT/LỆCH — nêu rõ trong bài, không im lặng chép, không tự sửa:
 *   · slide 38: bản trích mất chỉ số trên, in thành "232 = 4Gbytes" và
 *     "246=64 terabytes"; đọc đúng là 2³² và 2⁴⁶.
 *   · slide 38 nói "14 bits specify segment", còn Figure 9.20(a) ở slide 40 vẽ
 *     trường Index chỉ 13 bit (bit 15..3) + TI 1 bit. Hai chỗ KHÔNG mâu thuẫn:
 *     13 bit chỉ mục trong bảng + 1 bit TI chọn GDT hay LDT = 14 bit chọn đoạn.
 *     Bài nói rõ chuyện này thay vì chép nguyên một phía.
 *   · slide 46 ghi kích thước bằng "MB/kB" thập phân trong khi số bit cho ra
 *     luỹ thừa 2 (1 MB = 2²⁰ B). Giữ nguyên chữ slide, ghi chú cách đọc.
 *   · slide 32 gộp hai tiêu đề "Demand Paging" và "Virtual Memory" trên cùng
 *     một slide — đó là hai hộp tiêu đề, không phải một khái niệm ghép.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea9';

export default {
  title: '8.0b — Slide by slide: Memory management — swapping, paging, virtual memory, TLB, segmentation, x86 & ARM (slides 27–51)|||8.0b — Slide bài giảng: Quản lý bộ nhớ — hoán đổi, phân trang, bộ nhớ ảo, TLB, phân đoạn, x86 & ARM (slide 27–51)',
  slug: 'cea201-8-0b-slides-quan-ly-bo-nho-phan-trang-tlb-x86-arm',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 8 (deck Ch.9 bản 11e) của CEA201 — trọn khối QUẢN LÝ BỘ NHỚ, 25 slide. Đi từ hoán đổi và phân vùng cố định/động (phân mảnh trong, phân mảnh ngoài), qua phân trang và cặp địa chỉ logic/vật lý, tới bộ nhớ ảo, lỗi trang, thrashing, bảng trang nghịch đảo, TLB, phân đoạn, rồi hai ví dụ thật là Intel x86 và ARM. Tâm điểm ôn thi là dạng bài CHIA ĐỊA CHỈ ẢO: bài giải trọn bốn đề (32 bit/4 KiB, 32 bit/8 KiB, 48 bit/4 KiB, 16 bit/1 KiB) có tách nhị phân và dựng ngược để đối chiếu, cộng bảng thời gian truy cập hiệu dụng của TLB ở 90 % · 99 % · 99,9 %. Mọi con số đã kiểm bằng máy.',
  content: [
    walkHead(D, 27, 51),
    walk(D, [

      [27, 'Figure 9.12 — The Use of Swapping',
        `<p class="y-chinh">🎯 Two stacked pictures answering one question: <strong>what do you do when the jobs waiting to run need more memory than you have?</strong> Part (a) is the naive answer (a long-term queue on disk, jobs move into memory once and stay); part (b) adds an <strong>intermediate queue</strong> and a second arrow pointing <em>back</em> to disk — that arrow is <strong>swapping</strong>.</p>
<ul>
<li><strong>Read every label on (a) first.</strong> On the left a disk cylinder holding the <em>long-term queue</em> (four boxed jobs). On the right <em>main memory</em>, split into an <em>Operating system</em> band at the top and one big user area below. One arrow goes disk → memory; one arrow leaves memory labelled <em>completed jobs and user sessions</em>. That is all a simple batch monitor ever does.</li>
<li><strong>Now read (b), which has one extra box and one extra arrow.</strong> The disk now carries <em>two</em> queues: the <em>intermediate queue</em> on top and the <em>long-term queue</em> below. Memory can be fed from either. Crucially, one arrow runs memory → intermediate queue: a process that is still alive but <em>not running</em> is pushed back out to disk to free its frames.</li>
<li><strong>Why swapping exists at all — the I/O problem from slide 12/16.</strong> Multiprogramming only helps while at least one process is ready to use the processor. Processes are mostly waiting on I/O, so to keep the processor busy you need <em>many</em> of them resident; but memory is finite. Swapping breaks the deadlock: keep more processes alive than memory can hold, and rotate them.</li>
<li><strong>This is exactly medium-term scheduling (slide 21).</strong> That slide said medium-term scheduling is "part of the swapping function" and that the swapping-in decision "is based on the need to manage the degree of multiprogramming". Figure 9.12(b) is the picture of that sentence.</li>
<li><strong>Swapping is I/O, so it is not free.</strong> Writing a whole process image to disk and reading it back costs milliseconds — roughly 10<sup>5</sup> times a memory access. So the OS swaps a process out only when it is blocked anyway, and the design question becomes "how few bytes must move?" — which is the question <em>paging</em> (slide 30) finally answers well.</li>
</ul>
<p class="meo">💡 Remember the two queues by their purpose: the <strong>long-term queue holds jobs that have never run</strong>, the <strong>intermediate queue holds jobs that have run and were kicked out</strong>. A job only ever visits the long-term queue once; it may visit the intermediate queue many times.</p>`,
        `<p class="y-chinh">🎯 Hai bức tranh xếp chồng trả lời một câu hỏi: <strong>làm gì khi đám việc đang chờ chạy cần nhiều bộ nhớ hơn số bạn có?</strong> Phần (a) là câu trả lời ngây thơ (một hàng đợi dài hạn nằm trên đĩa, việc vào bộ nhớ một lần rồi ở lại); phần (b) thêm một <strong>hàng đợi trung gian</strong> và một mũi tên chỉ <em>NGƯỢC</em> về đĩa — mũi tên đó chính là <strong>HOÁN ĐỔI (swapping)</strong>.</p>
<ul>
<li><strong>Đọc hết nhãn của (a) trước đã.</strong> Bên trái là hình trụ đĩa chứa <em>long-term queue</em> — hàng đợi dài hạn (bốn ô việc). Bên phải là <em>main memory</em>, chia thành dải <em>Operating system</em> ở trên và một vùng người dùng lớn ở dưới. Một mũi tên đi đĩa → bộ nhớ; một mũi tên rời bộ nhớ, ghi <em>completed jobs and user sessions</em>. Một monitor lô đơn giản chỉ làm bấy nhiêu.</li>
<li><strong>Giờ đọc (b), nó nhiều hơn đúng một cái hộp và một mũi tên.</strong> Đĩa bây giờ mang <em>HAI</em> hàng đợi: <em>intermediate queue</em> (trung gian) ở trên và <em>long-term queue</em> ở dưới. Bộ nhớ có thể nạp từ cả hai. Điểm mấu chốt: có một mũi tên chạy bộ nhớ → hàng đợi trung gian — một tiến trình vẫn còn sống nhưng <em>KHÔNG chạy</em> bị đẩy ngược ra đĩa để trả lại khung nhớ.</li>
<li><strong>Vì sao phải có hoán đổi — chính là bài toán vào/ra của slide 12/16.</strong> Đa chương trình chỉ có lợi chừng nào còn ít nhất một tiến trình sẵn sàng dùng bộ xử lý. Mà tiến trình phần lớn thời gian ngồi chờ vào/ra, nên muốn giữ bộ xử lý bận thì phải có <em>NHIỀU</em> tiến trình nằm trong bộ nhớ; nhưng bộ nhớ thì hữu hạn. Hoán đổi phá thế bí: nuôi nhiều tiến trình hơn sức chứa của bộ nhớ, rồi xoay vòng chúng.</li>
<li><strong>Đây đúng là lập lịch trung hạn ở slide 21.</strong> Slide đó nói lập lịch trung hạn "là một phần của chức năng hoán đổi" và quyết định nạp vào "dựa trên nhu cầu quản lý mức độ đa chương trình". Figure 9.12(b) chính là bức tranh của câu ấy.</li>
<li><strong>Hoán đổi là vào/ra, nên KHÔNG miễn phí.</strong> Ghi nguyên ảnh tiến trình xuống đĩa rồi đọc lại tốn hàng mili giây — cỡ 10<sup>5</sup> lần một lần truy cập bộ nhớ. Vì vậy HĐH chỉ đẩy ra khi tiến trình dù sao cũng đang bị chặn, và câu hỏi thiết kế trở thành "phải chuyển ít byte nhất là bao nhiêu?" — câu mà <em>PHÂN TRANG</em> (slide 30) mới trả lời hay.</li>
</ul>
<p class="meo">💡 Nhớ hai hàng đợi theo công dụng: <strong>hàng dài hạn chứa việc CHƯA TỪNG chạy</strong>, <strong>hàng trung gian chứa việc ĐÃ chạy rồi bị đá ra</strong>. Một việc chỉ ghé hàng dài hạn đúng một lần; nhưng có thể ghé hàng trung gian rất nhiều lần.</p>`],

      [28, 'Figure 9.13 — Example of Fixed Partitioning of a 64-Mbyte Memory',
        `<p class="y-chinh">🎯 The oldest way to share memory: cut it into fixed pieces <strong>before any process arrives</strong>. The slide shows the same 64 Mbyte memory cut two ways — (a) <strong>equal-size partitions</strong> and (b) <strong>unequal-size partitions</strong> — and the comparison exposes the defect that killed the whole scheme: <strong>internal fragmentation</strong>.</p>
<table>
<tr><th>(a) Equal-size partitions</th><th>(b) Unequal-size partitions</th></tr>
<tr><td>Operating System 8 M, then 7 × 8 M user partitions</td><td>Operating System 8 M, then 2 M · 4 M · 6 M · 8 M · 8 M · 12 M · 16 M</td></tr>
<tr><td>8 × 8 = <strong>64 M</strong> ✔</td><td>8 + 2 + 4 + 6 + 8 + 8 + 12 + 16 = <strong>64 M</strong> ✔</td></tr>
</table>
<p class="dap-an">✅ Both columns total exactly 64 M — checked by arithmetic, not by eye. That is worth doing on any figure like this: if your reading of the labels does not sum to the stated memory size, you misread a label.</p>
<ul>
<li><strong>The fatal flaw of (a): a program smaller than 8 M still eats a whole 8 M slot.</strong> Load a 3 M program and 5 M is locked away, usable by nobody. Wasted space <em>inside</em> an allocated partition is called <strong>internal fragmentation</strong> — "internal" because the hole is inside the block you handed out.</li>
<li><strong>The second flaw of (a): a program bigger than 8 M cannot run at all</strong> unless the programmer splits it by hand with overlays. Fixed size is a hard ceiling, not just an inefficiency.</li>
<li><strong>(b) softens both problems but does not cure them.</strong> With sizes 2 M…16 M the OS can pick the smallest partition that fits, so a 3 M program goes into the 4 M slot and wastes only 1 M instead of 5 M. But 1 M is still wasted, and a 20 M program is still impossible.</li>
<li><strong>The number of partitions caps the degree of multiprogramming.</strong> In (a) at most 7 user processes can be resident, no matter how tiny they are. That directly limits processor utilisation — go back to Table 9.2 (slide 15) and you can see multiprogramming's whole benefit being throttled by a layout decision made at boot.</li>
<li><strong>Where the course goes next.</strong> Slide 29 makes the partitions <em>dynamic</em> (fixes internal fragmentation, creates external fragmentation); slide 30 makes the pieces <em>small and uniform</em> (paging) and finally fixes both. Read slides 28 → 29 → 30 as three attempts at one problem.</li>
</ul>
<p class="pitfall">⚠️ Exam trap — do not swap the two fragmentation words. <strong>Internal</strong> = waste <em>inside</em> a block that was given to a process (fixed partitioning, and paging's last page). <strong>External</strong> = free memory exists but is scattered in holes too small to use (dynamic partitioning, slide 29). Fixed partitioning has internal fragmentation and <em>no</em> external fragmentation.</p>`,
        `<p class="y-chinh">🎯 Cách chia bộ nhớ cổ nhất: cắt sẵn thành các mảnh cố định <strong>TRƯỚC khi có tiến trình nào tới</strong>. Slide vẽ cùng một bộ nhớ 64 Mbyte cắt theo hai kiểu — (a) <strong>phân vùng bằng nhau</strong> và (b) <strong>phân vùng không bằng nhau</strong> — và phép so sánh phơi ra đúng cái khuyết tật đã giết cả phương án này: <strong>PHÂN MẢNH TRONG</strong>.</p>
<table>
<tr><th>(a) Phân vùng bằng nhau</th><th>(b) Phân vùng không bằng nhau</th></tr>
<tr><td>Operating System 8 M, rồi 7 phân vùng người dùng × 8 M</td><td>Operating System 8 M, rồi 2 M · 4 M · 6 M · 8 M · 8 M · 12 M · 16 M</td></tr>
<tr><td>8 × 8 = <strong>64 M</strong> ✔</td><td>8 + 2 + 4 + 6 + 8 + 8 + 12 + 16 = <strong>64 M</strong> ✔</td></tr>
</table>
<p class="dap-an">✅ Cả hai cột cộng lại đúng 64 M — kiểm bằng phép tính chứ không bằng mắt. Mẹo này đáng làm với mọi hình kiểu này: nếu cách bạn đọc nhãn mà cộng không ra đúng dung lượng đã ghi thì bạn đã đọc sai một nhãn.</p>
<ul>
<li><strong>Tử huyệt của (a): chương trình nhỏ hơn 8 M vẫn ngốn trọn một ô 8 M.</strong> Nạp một chương trình 3 M thì 5 M bị khoá lại, không ai dùng được. Chỗ phí <em>BÊN TRONG</em> một phân vùng đã cấp gọi là <strong>phân mảnh trong (internal fragmentation)</strong> — "trong" vì cái lỗ nằm bên trong chính khối bạn vừa phát ra.</li>
<li><strong>Khuyết tật thứ hai của (a): chương trình lớn hơn 8 M thì KHÔNG chạy nổi</strong>, trừ khi lập trình viên tự tay xé nhỏ bằng kỹ thuật overlay. Kích thước cố định là một trần CỨNG, không chỉ là chuyện kém hiệu quả.</li>
<li><strong>(b) làm dịu cả hai nhưng KHÔNG chữa khỏi.</strong> Với các cỡ 2 M…16 M, HĐH chọn được phân vùng nhỏ nhất vừa đủ, nên chương trình 3 M vào ô 4 M và chỉ phí 1 M thay vì 5 M. Nhưng 1 M vẫn là phí, và chương trình 20 M vẫn bất khả thi.</li>
<li><strong>Số phân vùng chặn trần mức độ đa chương trình.</strong> Ở (a) nhiều nhất 7 tiến trình người dùng nằm trong bộ nhớ, dù chúng bé tí. Điều đó chặn thẳng hiệu suất bộ xử lý — quay lại Table 9.2 (slide 15) là thấy toàn bộ cái lợi của đa chương trình bị bóp bởi một quyết định bố trí đưa ra từ lúc khởi động.</li>
<li><strong>Môn học đi tiếp về đâu.</strong> Slide 29 làm phân vùng thành <em>ĐỘNG</em> (chữa phân mảnh trong, sinh ra phân mảnh ngoài); slide 30 làm các mảnh <em>NHỎ VÀ ĐỀU NHAU</em> (phân trang) rồi mới chữa được cả hai. Hãy đọc slide 28 → 29 → 30 như ba lần thử giải cùng một bài toán.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi — đừng đảo hai chữ phân mảnh. <strong>TRONG</strong> = phí <em>bên trong</em> khối đã cấp cho tiến trình (phân vùng cố định, và trang cuối của phân trang). <strong>NGOÀI</strong> = bộ nhớ trống vẫn còn nhưng vụn thành những lỗ quá nhỏ không xài được (phân vùng động, slide 29). Phân vùng cố định có phân mảnh TRONG và <em>KHÔNG</em> có phân mảnh NGOÀI.</p>`],

      [29, 'Logical / Physical / Base address + Figure 9.14 — The Effect of Dynamic Partitioning',
        `<p class="y-chinh">🎯 The only slide in this half of the deck that carries both <strong>definitions</strong> and a <strong>figure</strong>. On the left, three address words you must not confuse; on the right, eight frames (a)…(h) showing a 64 M memory being chewed into holes as processes come and go. Those holes are <strong>external fragmentation</strong>.</p>
<table>
<tr><th>Term (slide's wording)</th><th>Meaning</th><th>Who computes it</th></tr>
<tr><td><strong>Logical address</strong></td><td>"expressed as a location relative to the beginning of the program"</td><td>The compiler/linker — it does not know where you will be loaded</td></tr>
<tr><td><strong>Physical address</strong></td><td>"an actual location in main memory"</td><td>The hardware, at the last moment before the memory access</td></tr>
<tr><td><strong>Base address</strong></td><td>"current starting location of the process"</td><td>The OS, when it loads or moves the process; held in a base register</td></tr>
</table>
<p class="nhan">📐 The relation the three words hide: <code>physical = base + logical</code> (plus a bounds check against a limit register). The word <em>current</em> in "current starting location" is the whole point — the OS may move a process, and only the base register changes.</p>
<p class="dap-an">✅ Tracing the eight frames of Figure 9.14, every number checked: (a) OS 8 M leaves <strong>64 − 8 = 56 M</strong> free. (b) Process 1 takes 20 M → <strong>56 − 20 = 36 M</strong> free. (c) Process 2 takes 14 M → <strong>36 − 14 = 22 M</strong>. (d) Process 3 takes 18 M → <strong>22 − 18 = 4 M</strong>. (e) Process 2 leaves → a <strong>14 M hole</strong> appears in the middle. (f) Process 4 (8 M) is placed in that hole → <strong>14 − 8 = 6 M</strong> left over as a new, smaller hole. (g) Process 1 leaves → a <strong>20 M hole</strong> at the top. (h) Process 2 returns into the 20 M hole → <strong>20 − 14 = 6 M</strong> left. Final state: three holes of 6 M + 6 M + 4 M = <strong>16 M free, yet a 10 M process cannot be loaded.</strong></p>
<ul>
<li><strong>That last sentence is the definition of external fragmentation</strong>, and it is why the figure has eight frames instead of two: you have to <em>watch</em> the holes accumulate to believe it. Total free memory is not the same thing as largest usable block.</li>
<li><strong>The cure is compaction — and the cure is why you need a base register.</strong> Shuffle all processes down so the holes merge into one big hole. That only works if a process can be <em>moved after it started running</em>, which is only possible if its addresses are logical and get re-based at run time.</li>
<li><strong>Compaction is expensive.</strong> It copies every resident process, so it is a memory-bandwidth-bound operation the OS can only afford rarely. Placement algorithms (best-fit, first-fit, next-fit) try to delay the day compaction is needed.</li>
<li><strong>Connect to PRF192.</strong> When you print a pointer in C you are printing a <em>logical/virtual</em> address. Run the same program twice and you may see the same value both times — because each process gets its own address space and its own translation. The physical addresses are different and you never see them.</li>
</ul>
<p class="pitfall">⚠️ Careful with the word "logical". In dynamic partitioning the logical address is an <em>offset from the start of the program</em>, translated by a single base+bounds addition. From slide 30 on, the logical address is split into a <em>page number and an offset</em>, translated by a table lookup. Same word, two very different machines — exams love this.</p>`,
        `<p class="y-chinh">🎯 Slide duy nhất ở nửa sau deck mang cả <strong>ĐỊNH NGHĨA</strong> lẫn <strong>HÌNH</strong>. Bên trái là ba chữ "địa chỉ" mà bạn không được lẫn; bên phải là tám khung (a)…(h) cho thấy bộ nhớ 64 M bị gặm thành các lỗ khi tiến trình vào ra. Những cái lỗ đó là <strong>PHÂN MẢNH NGOÀI</strong>.</p>
<table>
<tr><th>Thuật ngữ (đúng chữ slide)</th><th>Nghĩa</th><th>Ai tính ra nó</th></tr>
<tr><td><strong>Logical address</strong> — địa chỉ logic</td><td>"biểu diễn như một vị trí TƯƠNG ĐỐI so với đầu chương trình"</td><td>Trình biên dịch/liên kết — nó không biết bạn sẽ được nạp vào đâu</td></tr>
<tr><td><strong>Physical address</strong> — địa chỉ vật lý</td><td>"một vị trí THẬT trong bộ nhớ chính"</td><td>Phần cứng, ở khoảnh khắc cuối trước khi truy cập bộ nhớ</td></tr>
<tr><td><strong>Base address</strong> — địa chỉ nền</td><td>"vị trí bắt đầu HIỆN TẠI của tiến trình"</td><td>HĐH, lúc nạp hoặc lúc dời tiến trình; giữ trong thanh ghi nền</td></tr>
</table>
<p class="nhan">📐 Quan hệ mà ba chữ đó giấu: <code>vật lý = nền + logic</code> (cộng một phép kiểm biên với thanh ghi giới hạn). Chữ <em>HIỆN TẠI</em> trong "vị trí bắt đầu hiện tại" mới là điểm cốt: HĐH có quyền DỜI tiến trình, và khi đó chỉ thanh ghi nền thay đổi.</p>
<p class="dap-an">✅ Lần theo tám khung của Figure 9.14, mọi con số đã kiểm: (a) HĐH 8 M nên còn <strong>64 − 8 = 56 M</strong> trống. (b) Process 1 lấy 20 M → còn <strong>56 − 20 = 36 M</strong>. (c) Process 2 lấy 14 M → <strong>36 − 14 = 22 M</strong>. (d) Process 3 lấy 18 M → <strong>22 − 18 = 4 M</strong>. (e) Process 2 ra đi → hiện ra một <strong>lỗ 14 M</strong> ở giữa. (f) Process 4 (8 M) được đặt vào lỗ đó → thừa lại <strong>14 − 8 = 6 M</strong> thành một lỗ mới nhỏ hơn. (g) Process 1 ra đi → một <strong>lỗ 20 M</strong> phía trên. (h) Process 2 quay lại chui vào lỗ 20 M → thừa <strong>20 − 14 = 6 M</strong>. Trạng thái cuối: ba lỗ 6 M + 6 M + 4 M = <strong>16 M còn trống, vậy mà một tiến trình 10 M KHÔNG nạp được.</strong></p>
<ul>
<li><strong>Câu cuối đó chính là định nghĩa phân mảnh ngoài</strong>, và đó là lý do hình phải có tám khung chứ không phải hai: bạn phải <em>NHÌN</em> các lỗ tích lại thì mới tin. Tổng bộ nhớ trống KHÔNG phải là khối liền lớn nhất dùng được.</li>
<li><strong>Thuốc chữa là DỒN NÉN (compaction) — và chính nó giải thích vì sao cần thanh ghi nền.</strong> Xô tất cả tiến trình xuống để các lỗ nhập làm một lỗ to. Chuyện đó chỉ làm được nếu tiến trình có thể <em>BỊ DỜI SAU KHI ĐÃ CHẠY</em>, mà điều này chỉ khả thi khi địa chỉ của nó là logic và được đặt nền lại lúc chạy.</li>
<li><strong>Dồn nén rất đắt.</strong> Nó chép lại mọi tiến trình đang nằm trong bộ nhớ, tức một thao tác nghẽn băng thông bộ nhớ mà HĐH chỉ thỉnh thoảng mới dám làm. Các thuật toán đặt chỗ (best-fit, first-fit, next-fit) cố trì hoãn cái ngày phải dồn nén.</li>
<li><strong>Nối sang PRF192.</strong> Khi bạn in một con trỏ trong C là bạn đang in một địa chỉ <em>LOGIC/ẢO</em>. Chạy cùng chương trình đó hai lần có thể thấy y hệt một con số — vì mỗi tiến trình có không gian địa chỉ riêng và bản dịch riêng. Địa chỉ vật lý thì khác nhau, và bạn không bao giờ nhìn thấy nó.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận với chữ "logic". Trong phân vùng động, địa chỉ logic là <em>độ lệch so với đầu chương trình</em>, dịch bằng một phép cộng nền + kiểm biên. Từ slide 30 trở đi, địa chỉ logic bị <em>CHẺ thành số trang và độ lệch</em>, dịch bằng tra bảng. Cùng một chữ, hai cỗ máy rất khác nhau — đề thi rất thích chỗ này.</p>`],

      [30, 'Figure 9.15 — Allocation of Free Frames',
        `<p class="y-chinh">🎯 The birth of <strong>paging</strong>, in a before/after pair. Memory is pre-cut into small equal <strong>frames</strong> (numbered 13…20 here), a process is pre-cut into equally sized <strong>pages</strong> (Page 0…Page 3 of Process A), and the loader drops each page into <em>any</em> free frame — <strong>they need not be contiguous</strong>. The record of which page went where is the <strong>page table</strong>.</p>
<ul>
<li><strong>(a) Before.</strong> On the disk: Process A with Page 0, 1, 2, 3. Beside main memory, a <em>free frame list</em> reading <strong>13, 14, 15, 18, 20</strong>. In memory, frames 16, 17, 19 are marked "In use" and 13, 14, 15, 18, 20 are shaded free. Notice at once: the free frames are <em>not</em> a contiguous run — 13-14-15, then a gap, then 18, then a gap, then 20.</li>
<li><strong>(b) After.</strong> Main memory now shows <strong>Page 1 of A in frame 13, Page 2 of A in 14, Page 3 of A in 15, Page 0 of A in 18</strong>. The free frame list has shrunk to just <strong>20</strong>. And a new object has appeared: <em>Process A page table</em> holding, top to bottom, <strong>18, 13, 14, 15</strong>.</li>
<li><strong>Read the page table the right way round.</strong> Its <em>row number</em> is the page number (implicit — it is not stored) and its <em>content</em> is the frame number. Row 0 holds 18 → page 0 lives in frame 18. Row 1 holds 13 → page 1 lives in frame 13. This is why the figure deliberately put page 0 in the out-of-order frame: to stop you assuming the mapping is sorted.</li>
<li><strong>What paging fixes.</strong> External fragmentation is <strong>gone entirely</strong> — any free frame fits any page, so scattered holes are as good as a contiguous run, and compaction is never needed. Internal fragmentation is <strong>reduced to at most one page per process</strong> (the last page, on average half a page wasted), instead of up to a whole partition.</li>
<li><strong>The price paging charges.</strong> Every process now needs a table, and every memory reference now needs a lookup in it. Those two costs drive the rest of the chapter: slide 33 attacks table <em>size</em>, slide 34 attacks lookup <em>time</em>.</li>
</ul>
<p class="nhan">📐 <strong>Worked example 4 — the smallest one, to build the reflex.</strong> A machine with a <strong>16-bit virtual address</strong> and <strong>1 KiB pages</strong>. Translate virtual address <code>0xB3C7</code>, given a page table whose entry 44 contains frame 9.</p>
<table>
<tr><th>Step</th><th>Work</th><th>Result</th></tr>
<tr><td>Offset bits</td><td>log<sub>2</sub>(1024)</td><td><strong>10 bits</strong></td></tr>
<tr><td>Page-number bits</td><td>16 − 10</td><td><strong>6 bits</strong></td></tr>
<tr><td>Page table entries</td><td>2<sup>6</sup></td><td><strong>64</strong></td></tr>
<tr><td>0xB3C7 in binary</td><td>1011 0011 1100 0111</td><td>split after 6 bits: <code>101100</code> | <code>1111000111</code></td></tr>
<tr><td>Page number</td><td>101100<sub>2</sub></td><td><strong>44</strong></td></tr>
<tr><td>Offset</td><td>1111000111<sub>2</sub> = 0x3C7</td><td><strong>967</strong></td></tr>
<tr><td>Frame (from table)</td><td>entry[44]</td><td><strong>9</strong> = 001001<sub>2</sub></td></tr>
<tr><td>Physical address</td><td>001001 | 1111000111</td><td><strong>0x27C7 = 10 183</strong></td></tr>
</table>
<p class="dap-an">✅ Answer <strong>0x27C7</strong>, and here is the reverse check, which you should always do: 10 183 ÷ 1024 = frame <strong>9</strong> ✔, 10 183 mod 1024 = <strong>967</strong> ✔. Both fields come back unchanged.</p>
<p class="meo">💡 The offset is <strong>never translated</strong> — it is copied across untouched. Only the page number goes through the table. If your answer changed the low bits, you made an arithmetic slip.</p>`,
        `<p class="y-chinh">🎯 Khoảnh khắc <strong>PHÂN TRANG</strong> ra đời, kể bằng một cặp trước/sau. Bộ nhớ được cắt sẵn thành các <strong>KHUNG (frame)</strong> nhỏ bằng nhau (ở đây đánh số 13…20), tiến trình được cắt sẵn thành các <strong>TRANG (page)</strong> cùng cỡ (Page 0…Page 3 của Process A), và bộ nạp thả từng trang vào <em>BẤT KỲ</em> khung trống nào — <strong>không cần liền kề</strong>. Sổ ghi trang nào đi đâu chính là <strong>BẢNG TRANG</strong>.</p>
<ul>
<li><strong>(a) Trước.</strong> Trên đĩa: Process A có Page 0, 1, 2, 3. Cạnh bộ nhớ chính là <em>free frame list</em> — danh sách khung trống ghi <strong>13, 14, 15, 18, 20</strong>. Trong bộ nhớ, khung 16, 17, 19 đề "In use", còn 13, 14, 15, 18, 20 tô màu là trống. Để ý ngay: các khung trống <em>KHÔNG</em> liền một dải — 13-14-15, rồi hở, rồi 18, rồi hở, rồi 20.</li>
<li><strong>(b) Sau.</strong> Bộ nhớ chính giờ ghi <strong>Page 1 of A ở khung 13, Page 2 of A ở 14, Page 3 of A ở 15, Page 0 of A ở 18</strong>. Danh sách khung trống teo lại chỉ còn <strong>20</strong>. Và một vật mới xuất hiện: <em>Process A page table</em> chứa từ trên xuống <strong>18, 13, 14, 15</strong>.</li>
<li><strong>Đọc bảng trang cho ĐÚNG CHIỀU.</strong> <em>Số dòng</em> là số trang (ngầm — không được lưu) còn <em>nội dung ô</em> là số khung. Dòng 0 chứa 18 → trang 0 nằm ở khung 18. Dòng 1 chứa 13 → trang 1 nằm ở khung 13. Đó là lý do hình cố tình đặt trang 0 vào cái khung lệch thứ tự: để bạn đừng tưởng ánh xạ là sắp xếp tăng dần.</li>
<li><strong>Phân trang chữa được gì.</strong> Phân mảnh ngoài <strong>BIẾN MẤT HẲN</strong> — khung trống nào cũng vừa trang nào, nên các lỗ vụn cũng tốt ngang một dải liền, và không bao giờ cần dồn nén. Phân mảnh trong <strong>rút xuống tối đa một trang mỗi tiến trình</strong> (trang cuối, trung bình phí nửa trang), thay vì phí tới cả một phân vùng.</li>
<li><strong>Cái giá phân trang bắt trả.</strong> Mỗi tiến trình giờ phải có một cái bảng, và mỗi lần tham chiếu bộ nhớ giờ phải tra bảng đó. Hai khoản phí ấy lái phần còn lại của chương: slide 33 đánh vào <em>KÍCH THƯỚC</em> bảng, slide 34 đánh vào <em>THỜI GIAN</em> tra.</li>
</ul>
<p class="nhan">📐 <strong>Bài giải 4 — bài nhỏ nhất, để tạo phản xạ.</strong> Một máy có <strong>địa chỉ ảo 16 bit</strong> và <strong>trang 1 KiB</strong>. Hãy dịch địa chỉ ảo <code>0xB3C7</code>, biết bảng trang có mục 44 chứa khung 9.</p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>Số bit offset</td><td>log<sub>2</sub>(1024)</td><td><strong>10 bit</strong></td></tr>
<tr><td>Số bit số trang</td><td>16 − 10</td><td><strong>6 bit</strong></td></tr>
<tr><td>Số mục bảng trang</td><td>2<sup>6</sup></td><td><strong>64</strong></td></tr>
<tr><td>0xB3C7 ra nhị phân</td><td>1011 0011 1100 0111</td><td>chẻ sau 6 bit: <code>101100</code> | <code>1111000111</code></td></tr>
<tr><td>Số trang</td><td>101100<sub>2</sub></td><td><strong>44</strong></td></tr>
<tr><td>Độ lệch</td><td>1111000111<sub>2</sub> = 0x3C7</td><td><strong>967</strong></td></tr>
<tr><td>Khung (tra bảng)</td><td>entry[44]</td><td><strong>9</strong> = 001001<sub>2</sub></td></tr>
<tr><td>Địa chỉ vật lý</td><td>001001 | 1111000111</td><td><strong>0x27C7 = 10 183</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án <strong>0x27C7</strong>, và đây là phép DỰNG NGƯỢC mà bạn phải luôn làm: 10 183 ÷ 1024 = khung <strong>9</strong> ✔, 10 183 mod 1024 = <strong>967</strong> ✔. Cả hai trường trở về nguyên vẹn.</p>
<p class="meo">💡 Độ lệch <strong>KHÔNG BAO GIỜ bị dịch</strong> — nó được chép nguyên xi sang. Chỉ số trang mới đi qua bảng. Nếu đáp án của bạn làm đổi các bit thấp thì bạn đã tính nhầm ở đâu đó.</p>`],

      [31, 'Figure 9.16 — Logical and Physical Addresses',
        `<p class="y-chinh">🎯 <strong>The single most exam-relevant picture of the chapter.</strong> It draws one translation end to end: a logical address written as two fields <code>[1 | 30]</code> — <em>page number</em> and <em>relative address within page</em> — enters the page table, comes out as <code>[13 | 30]</code> — <em>frame number</em> and <em>relative address within frame</em> — and that physical address points at "Page 1 of A" sitting in frame 13 of main memory.</p>
<ul>
<li><strong>Every label matters, read them in order.</strong> Over the left box: "page number" and "relative address within page". Over the right box: "frame number" and "relative address within frame". Underneath, "Process A Page Table" holding <strong>18, 13, 14, 15</strong> — the very same table built on slide 30, with row 1 highlighted because the page number was 1.</li>
<li><strong>The offset 30 appears on both sides, unchanged.</strong> This is the whole mechanical truth of paging in one observation: <em>the low field is copied, only the high field is looked up</em>. A page and a frame are the same size, so a byte 30 bytes into page 1 is 30 bytes into frame 13.</li>
<li><strong>Why the split is free in hardware.</strong> Because page size is a power of two, "split into page number and offset" is not a division — it is just <em>deciding where to draw the line between wires</em>. No arithmetic unit is involved, which is why translation can be done in a fraction of a cycle if the table entry is at hand.</li>
<li><strong>Compare with Chapter 4's cache split and note what changed.</strong> The <em>mechanics</em> are identical (chop an address into fields by powers of two). The <em>meaning</em> is not: in a cache, the tag is compared and the block may not be present at all; in a page table, the page number is an <em>index</em>, always in range, and the entry always exists. Cache asks "is it here?", paging asks "where is it?".</li>
<li><strong>Connect to PRF192.</strong> When your C program dereferences a wild pointer and the OS kills it with a segmentation fault, what happened is that the page number part of this very split indexed a page table entry marked "not present and not allocated" — so the hardware raised a fault the OS could not satisfy.</li>
</ul>
<p class="nhan">📐 <strong>The three formulas the whole exam question type rests on.</strong> For a virtual address of <em>V</em> bits and a page size of <em>P</em> bytes:</p>
<table>
<tr><th>Quantity</th><th>Formula</th></tr>
<tr><td>Offset field width</td><td><strong>log<sub>2</sub>(P)</strong> bits</td></tr>
<tr><td>Page-number field width</td><td><strong>V − log<sub>2</sub>(P)</strong> bits</td></tr>
<tr><td>Number of page-table entries</td><td><strong>2<sup>(V − log<sub>2</sub>P)</sup></strong></td></tr>
<tr><td>Physical address</td><td><strong>(frame × P) + offset</strong>, i.e. frame in the high bits, offset in the low bits</td></tr>
</table>
<p class="nhan">📐 <strong>Worked example 1 — the classic: 32-bit virtual address, 4 KiB pages.</strong> Translate <code>0x0000C2F5</code>, given that page-table entry 12 contains frame <code>0x1A7</code>.</p>
<table>
<tr><th>Step</th><th>Work</th><th>Result</th></tr>
<tr><td>Offset bits</td><td>log<sub>2</sub>(4096) = log<sub>2</sub>(2<sup>12</sup>)</td><td><strong>12 bits</strong></td></tr>
<tr><td>Page-number bits</td><td>32 − 12</td><td><strong>20 bits</strong></td></tr>
<tr><td>Entries in the table</td><td>2<sup>20</sup></td><td><strong>1 048 576</strong></td></tr>
<tr><td>0x0000C2F5 in binary</td><td colspan="2"><code>0000 0000 0000 0000 1100 | 0010 1111 0101</code> — the bar is after bit 20</td></tr>
<tr><td>Page number</td><td>0000 0000 0000 0000 1100<sub>2</sub> = 0xC</td><td><strong>12</strong></td></tr>
<tr><td>Offset</td><td>0010 1111 0101<sub>2</sub> = 0x2F5</td><td><strong>757</strong></td></tr>
<tr><td>Frame (from table)</td><td>entry[12] = 0x1A7</td><td><strong>423</strong></td></tr>
<tr><td>Physical address</td><td>0x1A7 &lt;&lt; 12, then OR 0x2F5</td><td><strong>0x001A72F5 = 1 733 365</strong></td></tr>
</table>
<p class="dap-an">✅ Answer <strong>0x001A72F5</strong>. Reverse check: 1 733 365 ÷ 4096 = 423 = 0x1A7 ✔ (the frame), 1 733 365 mod 4096 = 757 = 0x2F5 ✔ (the offset). Faster hex trick: with 4 KiB pages the offset is exactly the <strong>last three hex digits</strong>, so <code>0x0000C</code>|<code>2F5</code> splits by eye — no binary needed.</p>
<p class="pitfall">⚠️ Two classic slips. (1) Using log<sub>10</sub> or "4096 ÷ 8" instead of log<sub>2</sub>(4096) = 12. (2) Adding <em>frame + offset</em> instead of <em>concatenating</em> them: 423 + 757 = 1180 is wrong; the frame must be shifted left by the offset width first. Write it as concatenation of bit fields and the slip cannot happen.</p>`,
        `<p class="y-chinh">🎯 <strong>Bức hình ra thi nhiều nhất của cả chương.</strong> Nó vẽ trọn một lần dịch từ đầu tới cuối: một địa chỉ logic viết thành hai trường <code>[1 | 30]</code> — <em>page number</em> (số trang) và <em>relative address within page</em> (độ lệch trong trang) — đi vào bảng trang, đi ra thành <code>[13 | 30]</code> — <em>frame number</em> và <em>relative address within frame</em> — và địa chỉ vật lý đó trỏ đúng vào "Page 1 of A" đang nằm ở khung 13 của bộ nhớ chính.</p>
<ul>
<li><strong>Nhãn nào cũng quan trọng, đọc theo thứ tự.</strong> Trên ô trái: "page number" và "relative address within page". Trên ô phải: "frame number" và "relative address within frame". Phía dưới là "Process A Page Table" chứa <strong>18, 13, 14, 15</strong> — đúng cái bảng vừa dựng ở slide 30, với dòng 1 được tô sáng vì số trang là 1.</li>
<li><strong>Độ lệch 30 xuất hiện ở CẢ HAI phía, không đổi.</strong> Đây là toàn bộ sự thật cơ học của phân trang gói trong một quan sát: <em>trường thấp được CHÉP, chỉ trường cao mới bị TRA BẢNG</em>. Trang và khung cùng kích thước, nên byte nằm cách đầu trang 1 đúng 30 byte thì cũng cách đầu khung 13 đúng 30 byte.</li>
<li><strong>Vì sao việc chẻ này MIỄN PHÍ trong phần cứng.</strong> Vì kích thước trang là luỹ thừa của 2, "chẻ thành số trang và độ lệch" không phải phép chia — nó chỉ là <em>quyết định kẻ vạch ở đâu giữa các sợi dây</em>. Không đụng tới khối số học nào, nên phép dịch xong trong một phần nhỏ của chu kỳ nếu mục bảng đã có sẵn trong tay.</li>
<li><strong>So với phép chẻ địa chỉ cache ở Chương 4, và chú ý thứ ĐÃ ĐỔI.</strong> <em>Cơ học</em> giống hệt (chặt địa chỉ thành các trường theo luỹ thừa 2). <em>Ý nghĩa</em> thì không: trong cache, tag phải ĐEM SO và khối có thể hoàn toàn không có mặt; trong bảng trang, số trang là một <em>CHỈ MỤC</em>, luôn nằm trong phạm vi, và mục luôn tồn tại. Cache hỏi "có ở đây không?", phân trang hỏi "nó ở đâu?".</li>
<li><strong>Nối sang PRF192.</strong> Khi chương trình C của bạn truy cập một con trỏ rác và bị HĐH giết bằng segmentation fault, chuyện xảy ra là phần số trang của đúng phép chẻ này đã đánh vào một mục bảng trang mang dấu "không có mặt và chưa cấp phát" — nên phần cứng nêu lỗi mà HĐH không thoả mãn nổi.</li>
</ul>
<p class="nhan">📐 <strong>Ba công thức mà cả dạng bài thi này đứng lên.</strong> Với địa chỉ ảo <em>V</em> bit và kích thước trang <em>P</em> byte:</p>
<table>
<tr><th>Đại lượng</th><th>Công thức</th></tr>
<tr><td>Số bit trường offset</td><td><strong>log<sub>2</sub>(P)</strong> bit</td></tr>
<tr><td>Số bit trường số trang</td><td><strong>V − log<sub>2</sub>(P)</strong> bit</td></tr>
<tr><td>Số mục của bảng trang</td><td><strong>2<sup>(V − log<sub>2</sub>P)</sup></strong></td></tr>
<tr><td>Địa chỉ vật lý</td><td><strong>(khung × P) + offset</strong>, tức khung nằm ở bit cao, offset nằm ở bit thấp</td></tr>
</table>
<p class="nhan">📐 <strong>Bài giải 1 — bài kinh điển: địa chỉ ảo 32 bit, trang 4 KiB.</strong> Dịch <code>0x0000C2F5</code>, biết mục 12 của bảng trang chứa khung <code>0x1A7</code>.</p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>Số bit offset</td><td>log<sub>2</sub>(4096) = log<sub>2</sub>(2<sup>12</sup>)</td><td><strong>12 bit</strong></td></tr>
<tr><td>Số bit số trang</td><td>32 − 12</td><td><strong>20 bit</strong></td></tr>
<tr><td>Số mục trong bảng</td><td>2<sup>20</sup></td><td><strong>1 048 576</strong></td></tr>
<tr><td>0x0000C2F5 ra nhị phân</td><td colspan="2"><code>0000 0000 0000 0000 1100 | 0010 1111 0101</code> — vạch đặt sau bit thứ 20</td></tr>
<tr><td>Số trang</td><td>0000 0000 0000 0000 1100<sub>2</sub> = 0xC</td><td><strong>12</strong></td></tr>
<tr><td>Độ lệch</td><td>0010 1111 0101<sub>2</sub> = 0x2F5</td><td><strong>757</strong></td></tr>
<tr><td>Khung (tra bảng)</td><td>entry[12] = 0x1A7</td><td><strong>423</strong></td></tr>
<tr><td>Địa chỉ vật lý</td><td>0x1A7 dịch trái 12 bit rồi OR 0x2F5</td><td><strong>0x001A72F5 = 1 733 365</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án <strong>0x001A72F5</strong>. Dựng ngược để đối chiếu: 1 733 365 ÷ 4096 = 423 = 0x1A7 ✔ (đúng khung), 1 733 365 mod 4096 = 757 = 0x2F5 ✔ (đúng offset). Mẹo hex nhanh hơn: với trang 4 KiB thì offset đúng bằng <strong>ba chữ số hex cuối</strong>, nên <code>0x0000C</code>|<code>2F5</code> tách được bằng mắt — khỏi cần nhị phân.</p>
<p class="pitfall">⚠️ Hai lỗi kinh điển. (1) Dùng log<sub>10</sub> hoặc lấy "4096 ÷ 8" thay vì log<sub>2</sub>(4096) = 12. (2) <em>CỘNG</em> khung với offset thay vì <em>GHÉP</em> chúng lại: 423 + 757 = 1180 là SAI; phải dịch trái khung đúng bằng độ rộng offset đã. Cứ viết ra dạng ghép các trường bit thì lỗi này không thể xảy ra.</p>`],
      [32, 'Demand Paging · Virtual Memory',
        `<p class="y-chinh">🎯 The conceptual leap of the whole chapter, in two title boxes on one slide: <strong>"Each page of a process is brought in only when it is needed."</strong> Once you accept that, a process no longer has to fit in memory at all — its <em>address space</em> can be larger than the machine's RAM. That is <strong>virtual memory</strong>.</p>
<ul>
<li><strong>The slide names its own justification: the principle of locality.</strong> "When working with a large process, execution may be confined to a small section of a program (subroutine)", so "it is better use of memory to load in just a few pages". This is Chapter 4's locality argument reappearing one level down the hierarchy — same idea, new pair of levels (RAM as the fast level, disk as the slow one).</li>
<li><strong>The page fault, in the slide's own words.</strong> "If the program references data or branches to an instruction on a page not in main memory, a <strong>page fault</strong> is triggered which tells the OS to bring in the desired page." Note the trigger is the ordinary instruction, not a system call — the program does not know anything unusual happened.</li>
<li><strong>Advantages, as listed.</strong> (1) "More processes can be maintained in memory", because each occupies only its resident pages — so the degree of multiprogramming, and with it processor utilisation, goes up. (2) "Time is saved because unused pages are not swapped in and out of memory" — you no longer pay to move code paths the run never takes (error handlers, rarely used features).</li>
<li><strong>Disadvantages, as listed.</strong> (1) "When one page is brought in, another page must be thrown out" — <em>page replacement</em>, the same eviction problem as a cache. (2) "If a page is thrown out just before it is about to be used the OS will have to go get the page again" — a bad prediction costs a whole disk access.</li>
<li><strong>Thrashing, the slide's last line.</strong> "When the processor spends most of its time swapping pages rather than executing instructions." It is a <em>cliff</em>, not a slope: as memory pressure rises, throughput degrades gently, then collapses when every process's resident set falls below what its locality needs. A thrashing machine looks frozen while its disk light is solid on.</li>
</ul>
<p class="nhan">📐 <strong>Why a page fault is so much worse than a cache miss — computed, not asserted.</strong> Take a memory access at 100 ns and a page-fault service (disk seek + transfer + OS work) at 8 ms = 8 000 000 ns. With fault probability <em>p</em>, effective access time = (1 − p) × 100 + p × 8 000 000:</p>
<table>
<tr><th>Fault rate p</th><th>One fault every…</th><th>Effective access time</th><th>Slowdown</th></tr>
<tr><td>0</td><td>never</td><td>100 ns</td><td>1,0×</td></tr>
<tr><td>10<sup>−3</sup></td><td>1 000 accesses</td><td>8 099,9 ns</td><td><strong>81×</strong></td></tr>
<tr><td>10<sup>−4</sup></td><td>10 000 accesses</td><td>899,99 ns</td><td>9,0×</td></tr>
<tr><td>10<sup>−5</sup></td><td>100 000 accesses</td><td>180,0 ns</td><td>1,8×</td></tr>
<tr><td>10<sup>−6</sup></td><td>1 000 000 accesses</td><td>108,0 ns</td><td>1,08×</td></tr>
</table>
<p class="dap-an">✅ To keep the slowdown under 10 % you need p ≤ 10 ÷ (8 000 000 − 100) = <strong>1,25 × 10<sup>−6</sup></strong> — about <strong>one page fault per 800 000 memory accesses</strong>. That is the arithmetic behind thrashing: a fault rate of one in a thousand, which sounds rare, already makes the machine 81 times slower. Compare with a cache, where a 10 % miss rate costs about 11 % (slide 35's table) — the penalty ratio here is 80 000 : 1, not 100 : 1.</p>
<p class="pitfall">⚠️ Careful reading of the slide's layout: "Demand Paging" and "Virtual Memory" are <em>two separate title boxes</em> on this one slide, not a single compound term. Demand paging is the <em>mechanism</em> (fetch a page only on the fault); virtual memory is the <em>result</em> (an address space bigger than physical memory). Naming one when the question asks for the other loses the mark.</p>
<p class="meo">💡 Remember thrashing by the symptom, not the definition: <strong>the disk light is on solid and nothing happens</strong>. Cure = give it more RAM, or reduce the degree of multiprogramming (swap a whole process out — back to Figure 9.12).</p>`,
        `<p class="y-chinh">🎯 Bước nhảy khái niệm lớn nhất của chương, gói trong hai hộp tiêu đề trên cùng một slide: <strong>"Mỗi trang của tiến trình chỉ được nạp vào KHI NÀO CẦN TỚI."</strong> Chấp nhận câu đó rồi thì tiến trình không còn phải vừa bộ nhớ nữa — <em>không gian địa chỉ</em> của nó có quyền lớn hơn RAM của máy. Đó là <strong>BỘ NHỚ ẢO</strong>.</p>
<ul>
<li><strong>Slide tự nêu lý do biện minh: nguyên lý cục bộ.</strong> "Khi làm việc với một tiến trình lớn, quá trình thực thi có thể chỉ quẩn quanh một phần nhỏ của chương trình (một chương trình con)", nên "dùng bộ nhớ khôn hơn là chỉ nạp vài trang". Đây chính là lập luận locality của Chương 4 tái xuất ở một tầng thấp hơn trong phân cấp — cùng một ý, chỉ đổi cặp mức (RAM là mức nhanh, đĩa là mức chậm).</li>
<li><strong>Lỗi trang, đúng chữ slide.</strong> "Nếu chương trình tham chiếu dữ liệu hoặc rẽ tới một lệnh nằm trên trang KHÔNG có trong bộ nhớ chính, một <strong>page fault</strong> được kích hoạt để báo HĐH nạp trang cần thiết vào." Để ý: thứ kích hoạt là một lệnh BÌNH THƯỜNG, không phải lời gọi hệ thống — chương trình không hề biết có chuyện gì bất thường.</li>
<li><strong>Ưu điểm, đúng danh sách slide.</strong> (1) "Giữ được NHIỀU tiến trình hơn trong bộ nhớ", vì mỗi tiến trình chỉ chiếm chỗ cho các trang đang cư trú — nên mức độ đa chương trình, và theo đó là hiệu suất bộ xử lý, tăng lên. (2) "Tiết kiệm thời gian vì các trang không dùng tới không bị hoán đổi ra vào" — bạn thôi phải trả giá để di chuyển những nhánh mã mà lần chạy này không bao giờ đụng tới (bộ xử lý lỗi, tính năng hiếm dùng).</li>
<li><strong>Nhược điểm, đúng danh sách slide.</strong> (1) "Nạp một trang vào thì phải ném một trang khác ra" — <em>THAY TRANG</em>, y hệt bài toán đuổi dòng của cache. (2) "Nếu ném ra đúng lúc sắp dùng tới thì HĐH lại phải đi lấy trang đó về" — một lần đoán sai trả giá bằng nguyên một lần truy cập đĩa.</li>
<li><strong>Thrashing, dòng cuối của slide.</strong> "Khi bộ xử lý dành phần lớn thời gian để hoán đổi trang thay vì thực thi lệnh." Đây là một <em>VÁCH ĐÁ</em>, không phải cái dốc: áp lực bộ nhớ tăng dần thì thông lượng giảm nhẹ, rồi SỤP khi tập cư trú của mỗi tiến trình tụt xuống dưới mức tính cục bộ của nó đòi hỏi. Máy đang thrashing trông như đứng hình trong khi đèn đĩa sáng liên tục.</li>
</ul>
<p class="nhan">📐 <strong>Vì sao lỗi trang tệ hơn trượt cache rất nhiều — TÍNH RA, không phán.</strong> Lấy một lần truy cập bộ nhớ 100 ns và một lần phục vụ lỗi trang (đĩa tìm kiếm + truyền + việc của HĐH) 8 ms = 8 000 000 ns. Với xác suất lỗi <em>p</em>, thời gian truy cập hiệu dụng = (1 − p) × 100 + p × 8 000 000:</p>
<table>
<tr><th>Tỉ lệ lỗi p</th><th>Tức một lỗi mỗi…</th><th>Thời gian hiệu dụng</th><th>Chậm gấp</th></tr>
<tr><td>0</td><td>không bao giờ</td><td>100 ns</td><td>1,0×</td></tr>
<tr><td>10<sup>−3</sup></td><td>1 000 lần truy cập</td><td>8 099,9 ns</td><td><strong>81×</strong></td></tr>
<tr><td>10<sup>−4</sup></td><td>10 000 lần</td><td>899,99 ns</td><td>9,0×</td></tr>
<tr><td>10<sup>−5</sup></td><td>100 000 lần</td><td>180,0 ns</td><td>1,8×</td></tr>
<tr><td>10<sup>−6</sup></td><td>1 000 000 lần</td><td>108,0 ns</td><td>1,08×</td></tr>
</table>
<p class="dap-an">✅ Muốn chậm dưới 10 % thì cần p ≤ 10 ÷ (8 000 000 − 100) = <strong>1,25 × 10<sup>−6</sup></strong> — cỡ <strong>một lỗi trang trên 800 000 lần truy cập bộ nhớ</strong>. Đó là phép tính nằm sau chữ thrashing: tỉ lệ lỗi một phần nghìn, nghe rất hiếm, đã làm máy chậm đi 81 lần. So với cache, nơi tỉ lệ trượt 10 % chỉ tốn thêm khoảng 11 % (bảng ở slide 35) — tỉ số hình phạt ở đây là 80 000 : 1, chứ không phải 100 : 1.</p>
<p class="pitfall">⚠️ Đọc kỹ cách bố trí slide: "Demand Paging" và "Virtual Memory" là <em>HAI hộp tiêu đề riêng</em> trên cùng một slide, không phải một thuật ngữ ghép. Phân trang theo yêu cầu là <em>CƠ CHẾ</em> (chỉ nạp trang khi có lỗi); bộ nhớ ảo là <em>KẾT QUẢ</em> (không gian địa chỉ lớn hơn bộ nhớ vật lý). Đề hỏi cái này mà trả lời cái kia là mất điểm.</p>
<p class="meo">💡 Nhớ thrashing bằng TRIỆU CHỨNG chứ đừng nhớ định nghĩa: <strong>đèn đĩa sáng trân trân mà chẳng có gì xảy ra</strong>. Thuốc chữa = thêm RAM, hoặc hạ mức độ đa chương trình xuống (đẩy hẳn một tiến trình ra — quay về Figure 9.12).</p>`],

      [33, 'Figure 9.17 — Inverted Page Table Structure',
        `<p class="y-chinh">🎯 The answer to the question slide 31 quietly raised: <strong>how big does a page table get?</strong> A conventional table has one entry per <em>virtual page</em>, so it grows with the address space and with the number of processes. An <strong>inverted page table</strong> turns it around: <em>one entry for each physical memory frame</em> — the caption says so in as many words — so its size depends on your RAM, not on anyone's address space.</p>
<ul>
<li><strong>Follow the arrows on the figure.</strong> The virtual address (<em>n</em> bits) is split into <em>Page #</em> and <em>Offset</em>. The page number (<em>n</em> bits on the arrow) goes into a <strong>hash function</strong>, which emits <em>m</em> bits — an index into the inverted table, whose rows run 0 … 2<sup>m</sup> − 1. Meanwhile the offset flies straight over the top of the diagram to the right, untouched, joining a <strong>Frame #</strong> (<em>m</em> bits) to form the <em>Real address</em>.</li>
<li><strong>Read the table's columns: Page #, Process ID, Control bits, Chain.</strong> Because the table is indexed by frame, an entry must record <em>which page of which process</em> currently occupies that frame — hence the Page # and Process ID columns. That Process ID column is what lets one table serve every process at once.</li>
<li><strong>Why the Chain column exists.</strong> A hash function can send two different pages to the same row — a collision. The figure draws exactly that: row <em>i</em> is highlighted, its Chain field points down to row <em>j</em>, also highlighted. Lookup means "hash, then walk the chain comparing Page # and Process ID until you match". That is a search, not an index — the price of inverting.</li>
<li><strong>The frame number is never stored.</strong> It is the <em>row number</em> you stopped at, which is why the arrow to "Frame #" leaves from beside row <em>j</em> rather than from inside it. Exactly the mirror image of slide 30's ordinary table, where the page number was implicit and the frame was stored.</li>
</ul>
<p class="nhan">📐 <strong>Worked example 3 — why this structure had to be invented: 48-bit virtual address, 4 KiB pages, 8-byte entries.</strong> First the translation itself, then the table size.</p>
<table>
<tr><th>Step</th><th>Work</th><th>Result</th></tr>
<tr><td>Offset bits</td><td>log<sub>2</sub>(4096)</td><td><strong>12 bits</strong></td></tr>
<tr><td>Page-number bits</td><td>48 − 12</td><td><strong>36 bits</strong></td></tr>
<tr><td>Entries in a flat table</td><td>2<sup>36</sup></td><td><strong>68 719 476 736</strong></td></tr>
<tr><td>Translate 0x00007FFED3A9</td><td>last 3 hex digits = offset</td><td>page <strong>0x7FFED = 524 269</strong>, offset <strong>0x3A9 = 937</strong></td></tr>
<tr><td>Frame (assume entry = 0x12345)</td><td>0x12345</td><td><strong>74 565</strong></td></tr>
<tr><td>Physical address</td><td>0x12345 &lt;&lt; 12 OR 0x3A9</td><td><strong>0x123453A9 = 305 419 177</strong></td></tr>
</table>
<p class="dap-an">✅ Translation answer <strong>0x123453A9</strong>; reverse check 305 419 177 ÷ 4096 = 74 565 ✔ and mod 4096 = 937 ✔. Now the size: 2<sup>36</sup> entries × 8 bytes = <strong>549 755 813 888 bytes = 512 GiB of page table, per process.</strong> That is not a large table, it is an impossible one — you would need half a terabyte of RAM to describe how you are using your RAM. An inverted table for a machine with 4 GiB of RAM and 4 KiB frames has 4 GiB ÷ 4 KiB = <strong>2<sup>20</sup> = 1 048 576 entries ≈ 8 MiB total, shared by every process</strong> — and it does not change when you switch to a 64-bit address space.</p>
<p class="meo">💡 One-line contrast to memorise: <strong>a normal page table is indexed by page number and stores frames; an inverted page table is indexed by frame number and stores pages.</strong> Normal = fast (one index) but big; inverted = small but needs a hash and a chain walk.</p>
<p class="pitfall">⚠️ The inverted table's weakness is the one thing exams ask about: <strong>sharing</strong>. Two processes mapping the same physical frame need two entries — but there is only one row per frame. That is why inverted tables make shared memory awkward, and why the two-level scheme of slide 43 (not inversion) is what x86 actually ships.</p>`,
        `<p class="y-chinh">🎯 Câu trả lời cho câu hỏi mà slide 31 lặng lẽ nêu ra: <strong>bảng trang to tới cỡ nào?</strong> Bảng thông thường có một mục cho mỗi <em>TRANG ẢO</em>, nên nó phình theo không gian địa chỉ và theo số tiến trình. <strong>BẢNG TRANG NGHỊCH ĐẢO</strong> lật ngược lại: <em>một mục cho mỗi KHUNG nhớ vật lý</em> — chú thích dưới hình ghi đúng chữ đó — nên kích thước của nó phụ thuộc RAM của bạn, chứ không phụ thuộc không gian địa chỉ của ai cả.</p>
<ul>
<li><strong>Lần theo các mũi tên trên hình.</strong> Địa chỉ ảo (<em>n</em> bit) chẻ thành <em>Page #</em> và <em>Offset</em>. Số trang (mũi tên ghi <em>n</em> bit) đi vào một <strong>hàm băm (hash function)</strong>, hàm này nhả ra <em>m</em> bit — chỉ số vào bảng nghịch đảo có các dòng chạy từ 0 tới 2<sup>m</sup> − 1. Trong khi đó offset bay thẳng qua nóc sơ đồ sang phải, không ai đụng, để ghép với một <strong>Frame #</strong> (<em>m</em> bit) thành <em>Real address</em>.</li>
<li><strong>Đọc các cột của bảng: Page #, Process ID, Control bits, Chain.</strong> Vì bảng đánh chỉ số theo KHUNG nên mỗi mục phải ghi lại <em>trang nào của tiến trình nào</em> đang chiếm khung đó — nên mới có cột Page # và Process ID. Chính cột Process ID là thứ cho phép MỘT cái bảng phục vụ mọi tiến trình cùng lúc.</li>
<li><strong>Vì sao có cột Chain.</strong> Hàm băm có thể ném hai trang khác nhau vào cùng một dòng — đụng độ. Hình vẽ đúng ca đó: dòng <em>i</em> được tô sáng, trường Chain của nó trỏ xuống dòng <em>j</em>, cũng tô sáng. Tra bảng nghĩa là "băm, rồi đi dọc chuỗi, so Page # và Process ID cho tới khi khớp". Đó là TÌM KIẾM chứ không phải đánh chỉ số — cái giá của việc nghịch đảo.</li>
<li><strong>Số khung KHÔNG hề được lưu.</strong> Nó chính là <em>SỐ DÒNG</em> nơi bạn dừng lại, nên mũi tên đi tới "Frame #" mới xuất phát từ BÊN CẠNH dòng <em>j</em> chứ không phải từ bên trong ô. Đúng là ảnh phản chiếu của bảng thường ở slide 30, nơi số trang ngầm định còn số khung được lưu.</li>
</ul>
<p class="nhan">📐 <strong>Bài giải 3 — vì sao người ta buộc phải nghĩ ra cấu trúc này: địa chỉ ảo 48 bit, trang 4 KiB, mỗi mục 8 byte.</strong> Trước hết dịch địa chỉ, sau đó tính kích thước bảng.</p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>Số bit offset</td><td>log<sub>2</sub>(4096)</td><td><strong>12 bit</strong></td></tr>
<tr><td>Số bit số trang</td><td>48 − 12</td><td><strong>36 bit</strong></td></tr>
<tr><td>Số mục của bảng phẳng</td><td>2<sup>36</sup></td><td><strong>68 719 476 736</strong></td></tr>
<tr><td>Dịch 0x00007FFED3A9</td><td>3 chữ số hex cuối là offset</td><td>trang <strong>0x7FFED = 524 269</strong>, offset <strong>0x3A9 = 937</strong></td></tr>
<tr><td>Khung (giả sử mục = 0x12345)</td><td>0x12345</td><td><strong>74 565</strong></td></tr>
<tr><td>Địa chỉ vật lý</td><td>0x12345 dịch trái 12 rồi OR 0x3A9</td><td><strong>0x123453A9 = 305 419 177</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án dịch địa chỉ là <strong>0x123453A9</strong>; dựng ngược 305 419 177 ÷ 4096 = 74 565 ✔ và mod 4096 = 937 ✔. Giờ tới kích thước: 2<sup>36</sup> mục × 8 byte = <strong>549 755 813 888 byte = 512 GiB bảng trang, cho MỘT tiến trình.</strong> Đó không phải bảng lớn, đó là bảng BẤT KHẢ THI — bạn cần nửa terabyte RAM chỉ để mô tả bạn đang dùng RAM thế nào. Còn bảng nghịch đảo của một máy 4 GiB RAM với khung 4 KiB có 4 GiB ÷ 4 KiB = <strong>2<sup>20</sup> = 1 048 576 mục ≈ 8 MiB tổng cộng, dùng chung cho mọi tiến trình</strong> — và nó KHÔNG đổi khi bạn chuyển sang không gian địa chỉ 64 bit.</p>
<p class="meo">💡 Một dòng đối chiếu để thuộc: <strong>bảng trang thường đánh chỉ số theo SỐ TRANG và lưu SỐ KHUNG; bảng nghịch đảo đánh chỉ số theo SỐ KHUNG và lưu SỐ TRANG.</strong> Thường = nhanh (một phép đánh chỉ số) nhưng to; nghịch đảo = nhỏ nhưng phải băm và đi dọc chuỗi.</p>
<p class="pitfall">⚠️ Điểm yếu của bảng nghịch đảo đúng là thứ đề thi hay hỏi: <strong>DÙNG CHUNG BỘ NHỚ</strong>. Hai tiến trình cùng ánh xạ một khung vật lý thì cần hai mục — nhưng mỗi khung chỉ có một dòng. Vì thế bảng nghịch đảo làm bộ nhớ chia sẻ trở nên vướng víu, và vì thế thứ x86 thật sự dùng là sơ đồ HAI MỨC ở slide 43, chứ không phải nghịch đảo.</p>`],

      [34, 'Figure 9.18 — Operation of Paging and Translation Lookaside Buffer (TLB)',
        `<p class="y-chinh">🎯 A flowchart of what actually happens on <em>every single memory reference</em> of a modern machine. It begins "<strong>CPU checks the TLB</strong>" — before the page table, before the cache, before anything — and the dashed box on the left labelled "<strong>Page fault handling routine</strong>" is the slow path you hope never to enter.</p>
<ul>
<li><strong>Walk the fast path first (right-hand column).</strong> Start → "CPU checks the TLB" → diamond "<em>Page table entry in TLB?</em>" → <strong>Yes</strong> → the arrow runs straight down the right edge to "CPU generates physical address". Two boxes and you are done, with <strong>no</strong> memory access for the translation.</li>
<li><strong>Now the miss path.</strong> <strong>No</strong> → "Access Page Table" (that is a real memory read, cost: one full memory access) → diamond "<em>Page in main memory?</em>" → <strong>Yes</strong> → "Update TLB" → then join the fast path at "CPU generates physical address". Note that even a TLB miss with the page resident is <em>twice</em> the work: read the table, then read the data.</li>
<li><strong>The fault path is the dashed box, and it is a story in five boxes.</strong> "Page in main memory?" → <strong>No</strong> → "OS instructs CPU to read the page from disk" → "CPU activates I/O hardware" → "Page transferred from disk to main memory" → diamond "<em>Memory full?</em>" → if <strong>Yes</strong>, "Perform page replacement" first → "Page tables updated" → and the long arrow on the far left, labelled "<strong>Return to faulted instruction</strong>", goes all the way back to the top.</li>
<li><strong>"Return to faulted instruction" is the subtle, examinable part.</strong> The faulting instruction is not resumed in the middle — it is <em>restarted from the beginning</em>. That requires the processor to be able to undo any partial effect of the instruction, which is a real constraint on instruction-set design (Chapter 16 revisits it). It is also why the program never notices: after the restart the page is present and the instruction simply succeeds.</li>
<li><strong>Read the flowchart as a three-level hierarchy, exactly like Chapter 4.</strong> TLB (a few cycles) → page table in RAM (~100 ns) → disk (~8 ms). Three levels, each ~10<sup>2</sup>–10<sup>5</sup> times slower than the last, each managed by "keep what is likely to be needed". The TLB is a cache <em>of translations</em>; that is the whole idea.</li>
</ul>
<p class="nhan">📐 <strong>Worked example 2 — a different page size, traced through this flowchart: 32-bit virtual address, 8 KiB pages.</strong> Translate <code>0x00409C4A</code>; page-table entry 516 holds frame 51.</p>
<table>
<tr><th>Step</th><th>Work</th><th>Result</th></tr>
<tr><td>Offset bits</td><td>log<sub>2</sub>(8192) = log<sub>2</sub>(2<sup>13</sup>)</td><td><strong>13 bits</strong></td></tr>
<tr><td>Page-number bits</td><td>32 − 13</td><td><strong>19 bits</strong></td></tr>
<tr><td>Entries</td><td>2<sup>19</sup></td><td><strong>524 288</strong></td></tr>
<tr><td>0x00409C4A in binary</td><td colspan="2"><code>0000000001000000100 | 1110001001010</code> — split after 19 bits</td></tr>
<tr><td>Page number</td><td>0000000001000000100<sub>2</sub> = 0x204</td><td><strong>516</strong></td></tr>
<tr><td>Offset</td><td>1110001001010<sub>2</sub> = 0x1C4A</td><td><strong>7 242</strong></td></tr>
<tr><td>Frame</td><td>entry[516]</td><td><strong>51</strong></td></tr>
<tr><td>Physical address</td><td>51 × 8192 + 7242</td><td><strong>425 034 = 0x00067C4A</strong></td></tr>
</table>
<p class="dap-an">✅ Answer <strong>0x00067C4A</strong>. Reverse check: 425 034 ÷ 8192 = 51 ✔, 425 034 mod 8192 = 7 242 ✔. Now count the memory traffic through the flowchart: if this translation <em>hits</em> in the TLB, the machine performs <strong>1</strong> memory access (the data). If it <em>misses</em> but the page is resident, <strong>2</strong> accesses (page table, then data). If the page is not resident, 2 accesses <em>plus</em> a disk transfer of 8 KiB.</p>
<p class="pitfall">⚠️ Notice the trap the 8 KiB page size sets: the offset is 13 bits, which is <em>not</em> a whole number of hex digits (13 ÷ 4 = 3,25). The "last three hex digits" shortcut from slide 31 <strong>does not work here</strong> — you must go through binary, or use 51 × 8192 + 7242 as done above. Exam setters choose 8 KiB or 2 KiB pages precisely to break the hex shortcut.</p>`,
        `<p class="y-chinh">🎯 Một lưu đồ mô tả điều THỰC SỰ xảy ra ở <em>MỖI MỘT lần tham chiếu bộ nhớ</em> của máy hiện đại. Nó mở đầu bằng "<strong>CPU checks the TLB</strong>" — trước bảng trang, trước cache, trước mọi thứ — và cái khung nét đứt bên trái mang nhãn "<strong>Page fault handling routine</strong>" là đường chậm mà bạn cầu mong đừng bao giờ bước vào.</p>
<ul>
<li><strong>Đi đường nhanh trước (cột bên phải).</strong> Start → "CPU checks the TLB" → hình thoi "<em>Page table entry in TLB?</em>" → <strong>Yes</strong> → mũi tên chạy thẳng xuống mép phải tới "CPU generates physical address". Hai cái hộp là xong, và <strong>KHÔNG</strong> tốn lần truy cập bộ nhớ nào cho việc dịch.</li>
<li><strong>Giờ tới đường trượt.</strong> <strong>No</strong> → "Access Page Table" (đây là một lần ĐỌC BỘ NHỚ thật, tốn trọn một lần truy cập) → hình thoi "<em>Page in main memory?</em>" → <strong>Yes</strong> → "Update TLB" → rồi nhập vào đường nhanh ở "CPU generates physical address". Để ý: kể cả khi TLB trượt mà trang vẫn đang nằm trong bộ nhớ thì công việc đã <em>GẤP ĐÔI</em>: đọc bảng, rồi mới đọc dữ liệu.</li>
<li><strong>Đường lỗi trang là cái khung nét đứt, và nó là một câu chuyện năm hộp.</strong> "Page in main memory?" → <strong>No</strong> → "OS instructs CPU to read the page from disk" → "CPU activates I/O hardware" → "Page transferred from disk to main memory" → hình thoi "<em>Memory full?</em>" → nếu <strong>Yes</strong> thì phải "Perform page replacement" trước → "Page tables updated" → và mũi tên dài tít bên trái, ghi "<strong>Return to faulted instruction</strong>", vòng ngược lên tận đầu.</li>
<li><strong>"Quay về lệnh gây lỗi" mới là chỗ tinh tế và hay ra thi.</strong> Lệnh gây lỗi KHÔNG được chạy tiếp từ giữa chừng — nó được <em>KHỞI ĐỘNG LẠI TỪ ĐẦU</em>. Việc đó buộc bộ xử lý phải có khả năng huỷ mọi tác dụng dở dang của lệnh, và đó là một ràng buộc thật lên thiết kế tập lệnh (Chương 16 quay lại chuyện này). Đó cũng là lý do chương trình chẳng nhận ra gì: khởi động lại xong thì trang đã có mặt và lệnh chạy trót lọt.</li>
<li><strong>Hãy đọc lưu đồ này như một phân cấp BA MỨC, y hệt Chương 4.</strong> TLB (vài chu kỳ) → bảng trang trong RAM (~100 ns) → đĩa (~8 ms). Ba mức, mỗi mức chậm hơn mức trước cỡ 10<sup>2</sup>–10<sup>5</sup> lần, mức nào cũng quản lý theo nguyên tắc "giữ lại thứ có khả năng cần tới". TLB là một cái cache <em>của các BẢN DỊCH</em>; toàn bộ ý tưởng nằm ở đó.</li>
</ul>
<p class="nhan">📐 <strong>Bài giải 2 — đổi kích thước trang, lần theo đúng lưu đồ này: địa chỉ ảo 32 bit, trang 8 KiB.</strong> Dịch <code>0x00409C4A</code>; mục 516 của bảng trang chứa khung 51.</p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>Số bit offset</td><td>log<sub>2</sub>(8192) = log<sub>2</sub>(2<sup>13</sup>)</td><td><strong>13 bit</strong></td></tr>
<tr><td>Số bit số trang</td><td>32 − 13</td><td><strong>19 bit</strong></td></tr>
<tr><td>Số mục</td><td>2<sup>19</sup></td><td><strong>524 288</strong></td></tr>
<tr><td>0x00409C4A ra nhị phân</td><td colspan="2"><code>0000000001000000100 | 1110001001010</code> — chẻ sau 19 bit</td></tr>
<tr><td>Số trang</td><td>0000000001000000100<sub>2</sub> = 0x204</td><td><strong>516</strong></td></tr>
<tr><td>Độ lệch</td><td>1110001001010<sub>2</sub> = 0x1C4A</td><td><strong>7 242</strong></td></tr>
<tr><td>Khung</td><td>entry[516]</td><td><strong>51</strong></td></tr>
<tr><td>Địa chỉ vật lý</td><td>51 × 8192 + 7242</td><td><strong>425 034 = 0x00067C4A</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án <strong>0x00067C4A</strong>. Dựng ngược: 425 034 ÷ 8192 = 51 ✔, 425 034 mod 8192 = 7 242 ✔. Giờ đếm lưu lượng bộ nhớ theo lưu đồ: nếu lần dịch này <em>TRÚNG</em> TLB, máy thực hiện <strong>1</strong> lần truy cập bộ nhớ (lấy dữ liệu). Nếu <em>TRƯỢT</em> mà trang vẫn cư trú thì <strong>2</strong> lần (bảng trang, rồi dữ liệu). Nếu trang không cư trú thì 2 lần <em>CỘNG</em> một lần truyền 8 KiB từ đĩa.</p>
<p class="pitfall">⚠️ Để ý cái bẫy mà kích thước trang 8 KiB giăng ra: offset là 13 bit, <em>KHÔNG</em> chia hết cho 4 nên không tròn số chữ số hex (13 ÷ 4 = 3,25). Mẹo "ba chữ số hex cuối" của slide 31 <strong>KHÔNG dùng được ở đây</strong> — phải đi qua nhị phân, hoặc lấy 51 × 8192 + 7242 như trên. Người ra đề chọn trang 8 KiB hay 2 KiB chính là để phá mẹo hex.</p>`],

      [35, 'Figure 9.19 — Translation Lookaside Buffer and Cache Operation',
        `<p class="y-chinh">🎯 The slide that finally joins this chapter to Chapter 4/5. Two shaded boxes side by side: <strong>TLB Operation</strong> on the left, <strong>Cache Operation</strong> on the right. A virtual address enters on the left, a <em>real</em> address leaves it, and only then does the cache get to look at anything. <strong>Translation happens before caching.</strong></p>
<ul>
<li><strong>Trace the left box.</strong> "Virtual Address" split into <em>Page #</em> and <em>Offset</em>. The page number goes to the <strong>TLB</strong> box. Two labelled outcomes leave it: "<strong>TLB hit</strong>" going down-right, and "<strong>TLB miss</strong>" going left, down to the <strong>Page Table</strong> drawn below. Both paths converge on a <strong>⊕</strong> symbol where the frame number is combined with the offset.</li>
<li><strong>Trace the right box.</strong> Out of the ⊕ comes "Real Address", drawn split into <strong>Tag</strong> and <strong>Remainder</strong>. That goes to the <strong>Cache</strong> box, with "<strong>Hit</strong>" leaving to the right as "Value", and "<strong>Miss</strong>" curling back down to <strong>Main Memory</strong>, which also returns a "Value".</li>
<li><strong>Two lookups, two tables, do not merge them in your head.</strong> The TLB is indexed/searched by <em>page number</em> and returns a <em>frame number</em>. The cache is searched by <em>tag</em> and returns <em>data</em>. A TLB hit tells you <em>where</em> the byte lives; a cache hit gives you the byte itself. You can hit one and miss the other in any of four combinations.</li>
<li><strong>The MMU sits between the CPU and the cache.</strong> That is precisely what this figure draws, and it is worth stating because students often picture the cache first. Real designs cheat this serialisation (virtually indexed, physically tagged caches let the two run in parallel), but the logical order is translate → then access.</li>
<li><strong>The TLB is a cache, so every Chapter 5 concept applies to it.</strong> It has a hit ratio, an associativity, a replacement policy, and a coherence problem — the last one being why an OS must "flush the TLB" (or use address-space IDs) on a context switch: the old process's translations are now lies.</li>
</ul>
<p class="nhan">📐 <strong>Effective access time with a TLB — the exact same formula you used for cache in Chapter 4.</strong> Let T = TLB search time = 1 ns, M = memory access = 100 ns, h = TLB hit ratio. On a hit you pay T + M; on a miss you pay T + M (read the page table) + M (read the data) = T + 2M. So <strong>EAT = h(T + M) + (1 − h)(T + 2M) = T + M + (1 − h)M</strong>:</p>
<table>
<tr><th>TLB hit ratio h</th><th>EAT</th><th>vs the ideal 101 ns</th><th>vs a machine with no paging (100 ns)</th></tr>
<tr><td>0 % (no TLB at all)</td><td><strong>201 ns</strong></td><td>+99 %</td><td><strong>2,01× — exactly twice as slow</strong></td></tr>
<tr><td>50 %</td><td>151 ns</td><td>+49,5 %</td><td>1,51×</td></tr>
<tr><td>90 %</td><td><strong>111 ns</strong></td><td>+9,9 %</td><td>1,11×</td></tr>
<tr><td>99 %</td><td><strong>102 ns</strong></td><td>+0,99 %</td><td>1,02×</td></tr>
<tr><td>99,9 %</td><td><strong>101,1 ns</strong></td><td>+0,1 %</td><td>1,011×</td></tr>
<tr><td>100 %</td><td>101 ns</td><td>—</td><td>1,01×</td></tr>
</table>
<p class="dap-an">✅ Read the first row as the answer to "why do we need a TLB at all": with no TLB, <em>every</em> memory reference needs two memory accesses — one for the page table, one for the data — so paging would cost you <strong>a factor of two, permanently</strong>. Read the 99 % row as the answer to "does a small TLB really suffice": yes — a few dozen entries, exploiting locality, reduce that 100 % penalty to about <strong>1 %</strong>. And notice the shape of the curve: the gain from 90 % to 99 % (111 → 102) is bigger than the gain from 0 % to 50 % (201 → 151) measured as a fraction of what is left — the last few percent of hit ratio are where the value is, exactly as in Chapter 4.</p>
<p class="meo">💡 Learn the formula once and reuse it three times in this course: <strong>time = (fast path) + (miss rate) × (extra cost of the slow path)</strong>. Chapter 4 wrote it as T<sub>s</sub> = T<sub>1</sub> + (1 − H)T<sub>2</sub>; here it is T + M + (1 − h)M; for page faults on slide 32 it is M + p × (fault service). Same equation, three sets of units.</p>
<p class="pitfall">⚠️ Exam trap on the miss cost: a TLB miss costs <strong>T + 2M</strong>, not T + M + something small. Students routinely forget that the page table lives <em>in main memory</em>, so reading it is itself a full memory access.</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng nối chương này với Chương 4/5. Hai khung tô xám nằm cạnh nhau: <strong>TLB Operation</strong> bên trái, <strong>Cache Operation</strong> bên phải. Một địa chỉ ẢO đi vào bên trái, một địa chỉ <em>THẬT</em> đi ra, và chỉ tới lúc đó cache mới được nhìn thấy gì. <strong>Dịch địa chỉ xảy ra TRƯỚC khi đụng cache.</strong></p>
<ul>
<li><strong>Lần theo khung trái.</strong> "Virtual Address" chẻ thành <em>Page #</em> và <em>Offset</em>. Số trang đi tới hộp <strong>TLB</strong>. Hai kết cục có nhãn rời khỏi nó: "<strong>TLB hit</strong>" đi xuống-phải, và "<strong>TLB miss</strong>" đi sang trái, xuống hộp <strong>Page Table</strong> vẽ bên dưới. Cả hai đường hội tụ tại ký hiệu <strong>⊕</strong>, nơi số khung được ghép với offset.</li>
<li><strong>Lần theo khung phải.</strong> Từ ⊕ đi ra "Real Address", vẽ chẻ thành <strong>Tag</strong> và <strong>Remainder</strong>. Nó đi vào hộp <strong>Cache</strong>, với "<strong>Hit</strong>" thoát sang phải thành "Value", còn "<strong>Miss</strong>" vòng xuống <strong>Main Memory</strong>, và bộ nhớ chính cũng trả về một "Value".</li>
<li><strong>HAI phép tra, HAI cái bảng, đừng gộp chúng trong đầu.</strong> TLB được tra theo <em>SỐ TRANG</em> và trả về <em>SỐ KHUNG</em>. Cache được tra theo <em>TAG</em> và trả về <em>DỮ LIỆU</em>. TLB trúng cho bạn biết byte đó <em>NẰM ĐÂU</em>; cache trúng đưa cho bạn chính cái byte. Bạn có thể trúng cái này trượt cái kia, đủ bốn tổ hợp.</li>
<li><strong>MMU nằm GIỮA CPU và cache.</strong> Đó chính xác là thứ hình này vẽ, và đáng nói ra vì sinh viên hay tưởng tượng cache đứng trước. Thiết kế thật có ăn gian chỗ tuần tự này (cache đánh chỉ số theo địa chỉ ảo nhưng gắn tag theo địa chỉ vật lý cho hai việc chạy song song), nhưng thứ tự LOGIC vẫn là dịch → rồi mới truy cập.</li>
<li><strong>TLB là một cái cache, nên mọi khái niệm của Chương 5 áp được lên nó.</strong> Nó có tỉ lệ trúng, có độ kết hợp, có chính sách thay thế, và có bài toán nhất quán — cái cuối cùng này chính là lý do HĐH phải "xả TLB" (hoặc dùng mã định danh không gian địa chỉ) khi chuyển ngữ cảnh: các bản dịch của tiến trình cũ giờ là lời nói dối.</li>
</ul>
<p class="nhan">📐 <strong>Thời gian truy cập hiệu dụng khi có TLB — đúng cái công thức bạn đã dùng cho cache ở Chương 4.</strong> Đặt T = thời gian tra TLB = 1 ns, M = một lần truy cập bộ nhớ = 100 ns, h = tỉ lệ trúng TLB. Trúng thì trả T + M; trượt thì trả T + M (đọc bảng trang) + M (đọc dữ liệu) = T + 2M. Vậy <strong>EAT = h(T + M) + (1 − h)(T + 2M) = T + M + (1 − h)M</strong>:</p>
<table>
<tr><th>Tỉ lệ trúng TLB h</th><th>EAT</th><th>so với mức lý tưởng 101 ns</th><th>so với máy KHÔNG phân trang (100 ns)</th></tr>
<tr><td>0 % (không có TLB)</td><td><strong>201 ns</strong></td><td>+99 %</td><td><strong>2,01× — chậm đúng gấp đôi</strong></td></tr>
<tr><td>50 %</td><td>151 ns</td><td>+49,5 %</td><td>1,51×</td></tr>
<tr><td>90 %</td><td><strong>111 ns</strong></td><td>+9,9 %</td><td>1,11×</td></tr>
<tr><td>99 %</td><td><strong>102 ns</strong></td><td>+0,99 %</td><td>1,02×</td></tr>
<tr><td>99,9 %</td><td><strong>101,1 ns</strong></td><td>+0,1 %</td><td>1,011×</td></tr>
<tr><td>100 %</td><td>101 ns</td><td>—</td><td>1,01×</td></tr>
</table>
<p class="dap-an">✅ Đọc dòng đầu như câu trả lời cho "vì sao phải có TLB": không có TLB thì <em>MỌI</em> tham chiếu bộ nhớ cần HAI lần truy cập — một cho bảng trang, một cho dữ liệu — nên phân trang sẽ lấy của bạn <strong>một hệ số 2, vĩnh viễn</strong>. Đọc dòng 99 % như câu trả lời cho "một cái TLB bé tí có đủ không": ĐỦ — vài chục mục, khai thác tính cục bộ, kéo hình phạt 100 % đó xuống còn khoảng <strong>1 %</strong>. Và để ý dáng của đường cong: xét theo phần còn lại phải cắt, cái lợi từ 90 % lên 99 % (111 → 102) lớn hơn cái lợi từ 0 % lên 50 % (201 → 151) — mấy phần trăm cuối của tỉ lệ trúng mới là chỗ có giá trị, y hệt Chương 4.</p>
<p class="meo">💡 Học công thức một lần rồi dùng lại ba chỗ trong môn này: <strong>thời gian = (đường nhanh) + (tỉ lệ trượt) × (phần phụ trội của đường chậm)</strong>. Chương 4 viết là T<sub>s</sub> = T<sub>1</sub> + (1 − H)T<sub>2</sub>; ở đây là T + M + (1 − h)M; còn với lỗi trang ở slide 32 là M + p × (chi phí phục vụ lỗi). Cùng một phương trình, ba bộ đơn vị.</p>
<p class="pitfall">⚠️ Bẫy đề thi ở chi phí trượt: TLB trượt tốn <strong>T + 2M</strong>, không phải T + M cộng thêm chút ít. Sinh viên rất hay quên rằng bảng trang <em>NẰM TRONG BỘ NHỚ CHÍNH</em>, nên đọc nó tự thân đã là một lần truy cập bộ nhớ đầy đủ.</p>`],

      [36, 'Segmentation (1 of 2) — what it is and why programmers like it',
        `<p class="y-chinh">🎯 The alternative to paging, and the slide opens with the sentence that separates them: segmentation is "<strong>usually visible to the programmer</strong>". Paging is a hardware trick the program never sees; segmentation is a way of <em>organising</em> a program that the program knows about.</p>
<ul>
<li><strong>The slide's definition.</strong> Segmentation is "provided as a convenience for organizing programs and data and as a means for associating privilege and protection attributes with instructions and data", and it "allows the programmer to view memory as consisting of <strong>multiple address spaces or segments</strong>". Note the plural — with paging you have one flat address space; with segmentation you have many, each starting at 0.</li>
<li><strong>Advantage 1 — "simplifies the handling of growing data structures".</strong> Give a stack or a heap its own segment and it can grow without colliding with anything: the hardware only has to raise the segment's limit. In a flat space, a growing structure eventually runs into its neighbour.</li>
<li><strong>Advantage 2 — "allows programs to be altered and recompiled independently without requiring that an entire set of programs be re-linked and re-loaded".</strong> Because addresses inside a segment are relative to that segment's own base, changing the size of module A does not move a single address inside module B. This is the ancestor of the shared library.</li>
<li><strong>Advantage 3 and 4 — "lends itself to sharing" and "lends itself to protection".</strong> Both come from the same source: a segment is a <em>logical</em> unit (one function, one array, one library), so permissions attached to it mean something. A page is an arbitrary 4 KiB chunk — "read-only" on a page is a mechanism; "read-only" on the code segment is a policy.</li>
</ul>
<table>
<tr><th></th><th>Paging</th><th>Segmentation</th></tr>
<tr><td>Block size</td><td><strong>Fixed</strong> and equal</td><td><strong>Variable</strong>, chosen by the programmer/compiler</td></tr>
<tr><td>Visible to the programmer?</td><td><strong>No</strong> — invisible</td><td><strong>Yes</strong> — "usually visible"</td></tr>
<tr><td>Address form</td><td>One linear address, split by hardware</td><td>Two explicit parts: <strong>segment + offset</strong></td></tr>
<tr><td>Fragmentation</td><td><strong>Internal</strong> (last page of each process)</td><td><strong>External</strong> (holes between variable-size segments)</td></tr>
<tr><td>Table entry needs</td><td>Frame number + control bits</td><td>Base <strong>and limit</strong> (size must be stored — sizes differ)</td></tr>
<tr><td>Protection / sharing</td><td>Per arbitrary 4 KiB chunk</td><td>Per <strong>logical object</strong> — natural granularity</td></tr>
<tr><td>Growth of a structure</td><td>Add pages anywhere</td><td>Raise the segment limit</td></tr>
</table>
<p class="meo">💡 One sentence that keeps the two straight for the exam: <strong>paging solves a memory-management problem (fit things in), segmentation solves a program-structure problem (keep things apart).</strong> That is why real machines do both — see slides 37 and 44.</p>
<p class="pitfall">⚠️ Do not write "segmentation has no fragmentation". It has <strong>external</strong> fragmentation, and for exactly the reason dynamic partitioning did (slide 29): variable-sized blocks leave unusable holes. What it avoids is <em>internal</em> fragmentation, because a segment is exactly as big as the object it holds.</p>`,
        `<p class="y-chinh">🎯 Phương án thay thế cho phân trang, và slide mở đầu bằng đúng câu phân biệt hai bên: phân đoạn "<strong>thường là NHÌN THẤY ĐƯỢC với lập trình viên</strong>". Phân trang là mánh phần cứng mà chương trình không hề biết; phân đoạn là một cách <em>TỔ CHỨC</em> chương trình mà chương trình có biết.</p>
<ul>
<li><strong>Định nghĩa của slide.</strong> Phân đoạn "được cung cấp như một tiện ích để tổ chức chương trình và dữ liệu, và như một phương tiện để gắn thuộc tính đặc quyền và bảo vệ vào lệnh và dữ liệu", và nó "cho phép lập trình viên xem bộ nhớ như gồm <strong>NHIỀU không gian địa chỉ hay nhiều đoạn</strong>". Chú ý số nhiều — với phân trang bạn có MỘT không gian phẳng; với phân đoạn bạn có NHIỀU không gian, mỗi cái bắt đầu từ 0.</li>
<li><strong>Ưu điểm 1 — "đơn giản hoá việc xử lý cấu trúc dữ liệu đang lớn dần".</strong> Cho ngăn xếp hay vùng heap một đoạn riêng thì nó phình ra mà không đụng vào ai: phần cứng chỉ cần nâng giới hạn của đoạn lên. Trong một không gian phẳng, một cấu trúc phình mãi rồi cũng đâm vào hàng xóm.</li>
<li><strong>Ưu điểm 2 — "cho phép sửa và biên dịch lại chương trình ĐỘC LẬP mà không phải liên kết lại, nạp lại cả bộ".</strong> Vì địa chỉ bên trong một đoạn là tương đối so với nền của chính đoạn đó, nên đổi kích thước mô-đun A không làm xê dịch một địa chỉ nào bên trong mô-đun B. Đây là tổ tiên của thư viện dùng chung.</li>
<li><strong>Ưu điểm 3 và 4 — "thuận cho việc DÙNG CHUNG" và "thuận cho việc BẢO VỆ".</strong> Cả hai cùng một gốc: một đoạn là đơn vị <em>LOGIC</em> (một hàm, một mảng, một thư viện), nên quyền gắn lên nó mới có ý nghĩa. Một trang chỉ là một mẩu 4 KiB tuỳ tiện — "chỉ đọc" trên một trang là một CƠ CHẾ; "chỉ đọc" trên đoạn mã là một CHÍNH SÁCH.</li>
</ul>
<table>
<tr><th></th><th>Phân trang</th><th>Phân đoạn</th></tr>
<tr><td>Kích thước khối</td><td><strong>CỐ ĐỊNH</strong> và bằng nhau</td><td><strong>THAY ĐỔI</strong>, do lập trình viên/trình biên dịch chọn</td></tr>
<tr><td>Lập trình viên có thấy không?</td><td><strong>KHÔNG</strong> — vô hình</td><td><strong>CÓ</strong> — "thường nhìn thấy được"</td></tr>
<tr><td>Dạng địa chỉ</td><td>Một địa chỉ tuyến tính, phần cứng tự chẻ</td><td>Hai phần TƯỜNG MINH: <strong>số đoạn + độ lệch</strong></td></tr>
<tr><td>Phân mảnh</td><td><strong>TRONG</strong> (trang cuối của mỗi tiến trình)</td><td><strong>NGOÀI</strong> (lỗ giữa các đoạn cỡ khác nhau)</td></tr>
<tr><td>Mục trong bảng cần gì</td><td>Số khung + các bit điều khiển</td><td>Nền <strong>VÀ giới hạn</strong> (phải lưu kích thước — vì mỗi đoạn một cỡ)</td></tr>
<tr><td>Bảo vệ / dùng chung</td><td>Theo từng mẩu 4 KiB tuỳ tiện</td><td>Theo <strong>ĐỐI TƯỢNG LOGIC</strong> — độ mịn tự nhiên</td></tr>
<tr><td>Cấu trúc phình to</td><td>Thêm trang ở bất cứ đâu</td><td>Nâng giới hạn của đoạn</td></tr>
</table>
<p class="meo">💡 Một câu giữ cho hai thứ không lẫn khi đi thi: <strong>phân trang giải bài toán QUẢN LÝ BỘ NHỚ (nhét vừa), phân đoạn giải bài toán CẤU TRÚC CHƯƠNG TRÌNH (giữ cho tách bạch).</strong> Đó là lý do máy thật làm CẢ HAI — xem slide 37 và 44.</p>
<p class="pitfall">⚠️ Đừng viết "phân đoạn không có phân mảnh". Nó có phân mảnh <strong>NGOÀI</strong>, và đúng vì lý do mà phân vùng động mắc phải (slide 29): khối cỡ thay đổi để lại những cái lỗ không xài được. Thứ nó tránh được là phân mảnh <em>TRONG</em>, vì một đoạn to đúng bằng đối tượng nó chứa.</p>`],
      [37, 'Intel x86 and Memory Management — the four combinations',
        `<p class="y-chinh">🎯 The slide's first line settles the paging-versus-segmentation argument by refusing to take a side: the x86 "<strong>includes hardware for BOTH segmentation and paging</strong>". Since either can be switched off, there are exactly <strong>four</strong> memory models, and the slide walks all four with the application each suits.</p>
<table>
<tr><th>Model</th><th>What the slide says</th><th>Who uses it</th></tr>
<tr><td><strong>Unsegmented, unpaged</strong></td><td>"Virtual address is the same as the physical address"</td><td>"Low-complexity, high performance controller applications" — embedded, no OS</td></tr>
<tr><td><strong>Unsegmented, paged</strong></td><td>"Memory is viewed as a paged linear address space"; "protection and management of memory is done via paging"</td><td>"Favored by some operating systems" — this is the Linux/Windows flat model</td></tr>
<tr><td><strong>Segmented, unpaged</strong></td><td>"Memory is viewed as a collection of logical address spaces"; "affords protection down to the level of a <strong>single byte</strong>"; "guarantees that the translation table needed is <strong>on-chip</strong> when the segment is in memory"; "results in <strong>predictable access times</strong>"</td><td>Real-time systems — predictability beats throughput</td></tr>
<tr><td><strong>Segmented, paged</strong></td><td>"Segmentation is used to define logical memory partitions subject to access control, and paging is used to manage the allocation of memory within the partitions"</td><td>"Operating systems such as <strong>UNIX System V</strong> favor this view"</td></tr>
</table>
<ul>
<li><strong>Row 3 is the one worth dwelling on, because it explains a design choice most students find odd.</strong> Byte-granular protection is impossible with paging (the smallest protectable unit is a page), but a segment's limit field is a byte count — so a 17-byte buffer can be protected to exactly 17 bytes. And because the segment descriptor is cached on-chip, no memory access is needed to translate: that is where "predictable access times" comes from, which is exactly what a hard real-time system needs.</li>
<li><strong>Row 2 is what your laptop actually runs.</strong> Modern OSs set up a handful of segments that all cover the entire 4 GiB (base 0, limit maximum) so segmentation becomes a no-op, and then do all the real work with paging. Segmentation was not removed for compatibility, it was <em>neutralised</em>.</li>
<li><strong>Why offer four models rather than pick one?</strong> Because the x86 had to serve embedded controllers, real-time systems and general-purpose OSs from a single instruction set. Slides 43 and 44 show how the hardware supports all four with one pipeline.</li>
<li><strong>Connect back to slide 36's table.</strong> Segmented+paged takes the strengths of both: segments give logical protection and sharing, pages remove external fragmentation from within the segments. The cost is two translations for every address — hence Figure 9.21 on slide 44.</li>
</ul>
<p class="meo">💡 Memorise the four as a 2×2 grid, not a list: rows = segmentation on/off, columns = paging on/off. Then any exam question naming an application ("a microcontroller", "a hard real-time controller", "Linux", "UNIX System V") maps to one cell.</p>
<p class="pitfall">⚠️ 64-bit mode changes this picture and the slide does not say so. In x86-64 long mode, segmentation is almost entirely disabled (base and limit are ignored for most segments), and paging is mandatory. So "the x86 does both" is true of the 32-bit architecture this chapter describes — do not claim it about a modern 64-bit kernel without qualifying it.</p>`,
        `<p class="y-chinh">🎯 Dòng đầu tiên của slide dàn xếp cuộc tranh cãi phân trang-hay-phân đoạn bằng cách từ chối chọn phe: x86 "<strong>có phần cứng cho CẢ HAI, phân đoạn và phân trang</strong>". Vì có thể tắt từng cái, tồn tại đúng <strong>BỐN</strong> mô hình bộ nhớ, và slide đi hết cả bốn kèm loại ứng dụng hợp với từng cái.</p>
<table>
<tr><th>Mô hình</th><th>Slide nói gì</th><th>Ai dùng</th></tr>
<tr><td><strong>Không đoạn, không trang</strong></td><td>"Địa chỉ ảo TRÙNG với địa chỉ vật lý"</td><td>"Ứng dụng điều khiển ít phức tạp, hiệu năng cao" — nhúng, không HĐH</td></tr>
<tr><td><strong>Không đoạn, có trang</strong></td><td>"Bộ nhớ được xem như một không gian địa chỉ tuyến tính có phân trang"; "bảo vệ và quản lý bộ nhớ làm bằng phân trang"</td><td>"Một số HĐH ưa dùng" — chính là mô hình phẳng của Linux/Windows</td></tr>
<tr><td><strong>Có đoạn, không trang</strong></td><td>"Bộ nhớ được xem như một tập các không gian địa chỉ logic"; "cho phép bảo vệ tới mức <strong>TỪNG BYTE</strong>"; "bảo đảm bảng dịch cần dùng nằm <strong>NGAY TRÊN CHIP</strong> khi đoạn còn trong bộ nhớ"; "cho ra <strong>thời gian truy cập ĐOÁN TRƯỚC ĐƯỢC</strong>"</td><td>Hệ thời gian thực — đoán trước được quan trọng hơn thông lượng</td></tr>
<tr><td><strong>Có đoạn, có trang</strong></td><td>"Phân đoạn dùng để định nghĩa các phân vùng logic chịu kiểm soát truy cập, còn phân trang dùng để quản lý cấp phát bộ nhớ BÊN TRONG các phân vùng đó"</td><td>"Các HĐH như <strong>UNIX System V</strong> ưa cách nhìn này"</td></tr>
</table>
<ul>
<li><strong>Dòng 3 đáng dừng lại lâu, vì nó giải thích một lựa chọn thiết kế mà đa số sinh viên thấy lạ.</strong> Bảo vệ tới từng byte là bất khả thi với phân trang (đơn vị nhỏ nhất bảo vệ được là một trang), nhưng trường giới hạn của một đoạn là số byte — nên một vùng đệm 17 byte có thể được bảo vệ đúng 17 byte. Và vì mô tả đoạn được giữ sẵn trên chip, việc dịch không cần lần truy cập bộ nhớ nào: "thời gian truy cập đoán trước được" ra từ đó, và đúng là thứ hệ thời gian thực cứng cần.</li>
<li><strong>Dòng 2 mới là thứ laptop bạn đang chạy.</strong> HĐH hiện đại dựng vài cái đoạn phủ trọn 4 GiB (nền 0, giới hạn tối đa) để phân đoạn thành vô tác dụng, rồi làm hết việc thật bằng phân trang. Phân đoạn không bị gỡ bỏ vì lý do tương thích, nó bị <em>VÔ HIỆU HOÁ</em>.</li>
<li><strong>Sao lại bày ra bốn mô hình thay vì chọn một?</strong> Vì x86 phải phục vụ cả vi điều khiển nhúng, hệ thời gian thực lẫn HĐH đa dụng bằng cùng một tập lệnh. Slide 43 và 44 cho thấy phần cứng đỡ được cả bốn bằng một đường ống.</li>
<li><strong>Nối lại bảng ở slide 36.</strong> "Đoạn + trang" lấy điểm mạnh của cả hai: đoạn cho bảo vệ và dùng chung theo logic, trang xoá phân mảnh ngoài ngay bên trong từng đoạn. Cái giá là HAI lần dịch cho mỗi địa chỉ — nên mới có Figure 9.21 ở slide 44.</li>
</ul>
<p class="meo">💡 Thuộc bốn mô hình dưới dạng lưới 2×2 chứ đừng học thành danh sách: hàng = phân đoạn bật/tắt, cột = phân trang bật/tắt. Khi đó đề thi nêu loại ứng dụng nào ("vi điều khiển", "bộ điều khiển thời gian thực cứng", "Linux", "UNIX System V") là ánh xạ được ngay vào một ô.</p>
<p class="pitfall">⚠️ Chế độ 64 bit làm đổi bức tranh này mà slide không nói. Ở chế độ long của x86-64, phân đoạn gần như bị vô hiệu hoàn toàn (nền và giới hạn bị bỏ qua với hầu hết các đoạn), còn phân trang thì BẮT BUỘC. Nên câu "x86 làm cả hai" đúng với kiến trúc 32 bit mà chương này mô tả — đừng phán như vậy về một nhân 64 bit hiện đại nếu không nói rõ.</p>`],

      [38, 'Segmentation (2 of 2) — the x86 address space arithmetic',
        `<p class="y-chinh">🎯 The numbers slide, and the one place in this chapter where you are asked to do exponent arithmetic on address spaces. "Each virtual address consists of a <strong>16-bit segment reference and a 32-bit offset</strong>" — and everything else on the slide follows from those two widths.</p>
<table>
<tr><th>Slide's statement</th><th>The arithmetic behind it</th></tr>
<tr><td>"Two bits of segment reference deal with the protection mechanism"</td><td>The RPL field — requestor privilege level, 2 bits → 4 levels (slide 39)</td></tr>
<tr><td>"14 bits specify segment"</td><td>16 − 2 = 14 → 2<sup>14</sup> = <strong>16 384</strong> distinct segments addressable</td></tr>
<tr><td>"Unsegmented virtual memory is 2<sup>32</sup> = 4 Gbytes"</td><td>Offset alone: 2<sup>32</sup> = 4 294 967 296 B = <strong>4 GiB</strong></td></tr>
<tr><td>"Segmented virtual memory is 2<sup>46</sup> = 64 terabytes"</td><td>14 (segment) + 32 (offset) = <strong>46</strong>; 2<sup>46</sup> = 70 368 744 177 664 B = <strong>64 TiB</strong></td></tr>
<tr><td>"Physical address space employs a 32-bit address for a maximum of 4 Gbytes"</td><td>Virtual 64 TiB is mapped down into physical 4 GiB — a ratio of <strong>16 384 : 1</strong></td></tr>
<tr><td>"Virtual address space is divided into two parts: one-half global, shared by all processors; the remainder local and distinct for each process"</td><td>The TI bit of the selector picks GDT (global) or LDT (local) — 8 192 segments each</td></tr>
</table>
<p class="dap-an">✅ All four exponent claims check out: 2<sup>32</sup> = 4 294 967 296 = 4 GiB ✔; 14 + 32 = 46 ✔; 2<sup>46</sup> = 70 368 744 177 664 B, and 70 368 744 177 664 ÷ 2<sup>40</sup> = <strong>64 TiB</strong> ✔. The point of the 64 TiB figure is <em>not</em> that any x86 ever had that much memory — it is that the <em>virtual</em> space a program may name is 16 384 times larger than the <em>physical</em> space, and that gap is precisely what paging and disk have to bridge.</p>
<ul>
<li><strong>Reconcile "14 bits specify segment" with Figure 9.20(a) on slide 40, because they look contradictory.</strong> Figure 9.20(a) draws the 16-bit selector as <strong>Index (bits 15…3, 13 bits) + TI (bit 2) + RPL (bits 1…0)</strong>. So the index into a table is only 13 bits (8 192 entries per table), but the TI bit chooses <em>which</em> table — GDT or LDT. 13 + 1 = <strong>14 bits that together identify a segment</strong>, giving 2 × 8 192 = 16 384. The two slides agree; they just count differently. This is worth knowing because an exam may quote either figure.</li>
<li><strong>Why split the space global/local at all?</strong> The global half (GDT) holds the kernel and anything shared by every process, so it is mapped identically everywhere and never changes on a context switch. The local half (LDT) is per-process. It is segmentation's version of the kernel/user address split every OS still uses today.</li>
<li><strong>Extraction warning.</strong> The text extracted from the .pptx lost its superscripts and prints "232 = 4Gbytes" and "246=64 terabytes". Read those as 2<sup>32</sup> and 2<sup>46</sup>. If you ever see an exam paper with the same flattening, the exponent is recoverable from the byte count.</li>
</ul>
<p class="pitfall">⚠️ Do not confuse the three "sizes" in this slide: <strong>46 bits</strong> is what a program can <em>name</em>, <strong>32 bits</strong> is what the chip can physically <em>address</em>, and the offset within a single segment is <strong>32 bits</strong> as well. A question asking "the maximum size of one segment" wants 4 GiB (from the 32-bit offset), not 64 TiB.</p>`,
        `<p class="y-chinh">🎯 Slide của các con số, và là chỗ duy nhất trong chương bắt bạn làm số học luỹ thừa trên không gian địa chỉ. "Mỗi địa chỉ ảo gồm một <strong>tham chiếu đoạn 16 bit và một độ lệch 32 bit</strong>" — mọi thứ còn lại trên slide đều suy ra từ hai độ rộng ấy.</p>
<table>
<tr><th>Câu trên slide</th><th>Phép tính nằm sau</th></tr>
<tr><td>"Hai bit của tham chiếu đoạn lo cơ chế bảo vệ"</td><td>Trường RPL — mức đặc quyền của bên yêu cầu, 2 bit → 4 mức (slide 39)</td></tr>
<tr><td>"14 bit dùng để chỉ định đoạn"</td><td>16 − 2 = 14 → 2<sup>14</sup> = <strong>16 384</strong> đoạn phân biệt được</td></tr>
<tr><td>"Bộ nhớ ảo không phân đoạn là 2<sup>32</sup> = 4 Gbyte"</td><td>Chỉ riêng offset: 2<sup>32</sup> = 4 294 967 296 B = <strong>4 GiB</strong></td></tr>
<tr><td>"Bộ nhớ ảo có phân đoạn là 2<sup>46</sup> = 64 terabyte"</td><td>14 (đoạn) + 32 (offset) = <strong>46</strong>; 2<sup>46</sup> = 70 368 744 177 664 B = <strong>64 TiB</strong></td></tr>
<tr><td>"Không gian địa chỉ vật lý dùng địa chỉ 32 bit, tối đa 4 Gbyte"</td><td>64 TiB ảo bị ánh xạ xuống 4 GiB vật lý — tỉ lệ <strong>16 384 : 1</strong></td></tr>
<tr><td>"Không gian địa chỉ ảo chia hai phần: một nửa TOÀN CỤC, dùng chung cho mọi bộ xử lý; phần còn lại CỤC BỘ, riêng cho từng tiến trình"</td><td>Bit TI của selector chọn GDT (toàn cục) hay LDT (cục bộ) — mỗi bảng 8 192 đoạn</td></tr>
</table>
<p class="dap-an">✅ Cả bốn khẳng định luỹ thừa đều đúng: 2<sup>32</sup> = 4 294 967 296 = 4 GiB ✔; 14 + 32 = 46 ✔; 2<sup>46</sup> = 70 368 744 177 664 B, và 70 368 744 177 664 ÷ 2<sup>40</sup> = <strong>64 TiB</strong> ✔. Ý nghĩa của con số 64 TiB <em>KHÔNG</em> phải là có con x86 nào từng có ngần ấy bộ nhớ — mà là không gian <em>ẢO</em> chương trình được phép gọi tên lớn gấp 16 384 lần không gian <em>VẬT LÝ</em>, và đúng cái khoảng cách đó là thứ phân trang cùng ổ đĩa phải bắc cầu qua.</p>
<ul>
<li><strong>Hoà giải câu "14 bit chỉ định đoạn" với Figure 9.20(a) ở slide 40, vì hai chỗ trông như mâu thuẫn.</strong> Figure 9.20(a) vẽ selector 16 bit thành <strong>Index (bit 15…3, tức 13 bit) + TI (bit 2) + RPL (bit 1…0)</strong>. Vậy chỉ mục vào một bảng chỉ có 13 bit (8 192 mục mỗi bảng), nhưng bit TI chọn <em>BẢNG NÀO</em> — GDT hay LDT. 13 + 1 = <strong>14 bit cùng nhau xác định một đoạn</strong>, cho 2 × 8 192 = 16 384. Hai slide KHÔNG chọi nhau; chúng chỉ đếm theo hai cách. Biết chuyện này có lợi vì đề thi có thể trích bên nào cũng được.</li>
<li><strong>Vì sao phải chẻ không gian thành toàn cục/cục bộ?</strong> Nửa toàn cục (GDT) chứa nhân và mọi thứ dùng chung cho mọi tiến trình, nên nó được ánh xạ y hệt ở mọi nơi và không đổi khi chuyển ngữ cảnh. Nửa cục bộ (LDT) thì riêng từng tiến trình. Đó là phiên bản phân đoạn của lằn ranh nhân/người-dùng mà mọi HĐH tới nay vẫn dùng.</li>
<li><strong>Cảnh báo về bản trích chữ.</strong> Bản trích từ .pptx mất chỉ số trên nên in thành "232 = 4Gbytes" và "246=64 terabytes". Hãy đọc là 2<sup>32</sup> và 2<sup>46</sup>. Nếu gặp đề thi cũng bị bẹt như vậy, số mũ vẫn khôi phục được từ số byte đi kèm.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn ba "kích thước" trong slide này: <strong>46 bit</strong> là thứ chương trình <em>GỌI TÊN</em> được, <strong>32 bit</strong> là thứ con chip <em>ĐỊA CHỈ HOÁ vật lý</em> được, còn độ lệch bên trong MỘT đoạn cũng là <strong>32 bit</strong>. Đề hỏi "kích thước tối đa của một đoạn" là muốn 4 GiB (từ offset 32 bit), không phải 64 TiB.</p>`],

      [39, 'Segment Protection — privilege levels and access attributes',
        `<p class="y-chinh">🎯 Segmentation's real payoff, and the reason the x86 kept it for forty years: every segment carries <strong>two forms of protection — a privilege level and an access attribute</strong> — and the hardware enforces them on every single reference, at no software cost.</p>
<ul>
<li><strong>Four privilege levels, "most protected (level 0)" to "least protected (level 3)".</strong> The famous "rings". Level 0 is the kernel; level 3 is your application. Levels 1 and 2 were meant for device drivers and OS services, and in practice almost every OS ignores them and uses only 0 and 3 — but the hardware offers four.</li>
<li><strong>The slide's clearance metaphor is the thing to memorise.</strong> "Privilege level associated with a <strong>data</strong> segment is its <em>classification</em>"; "privilege level associated with a <strong>program</strong> segment is its <em>clearance</em>". It is a military security model lifted wholesale: documents are classified, people are cleared.</li>
<li><strong>The one rule that follows.</strong> "An executing program may only access data segments for which its <strong>clearance level is lower than or equal to</strong> the privilege level of the data segment." Careful with the direction: <em>numerically</em> lower means <em>more</em> privileged, so a level-0 program can reach data classified 0, 1, 2 or 3, while a level-3 program can reach only level-3 data. Kernel reads user data: allowed. User reads kernel data: fault.</li>
<li><strong>Protection is not only about data.</strong> "The privilege mechanism also limits the use of <strong>certain instructions</strong>." Privileged instructions (I/O, loading control registers, halting) are executable only at level 0 — which is the same idea slide 11 called a "desirable hardware feature" back in the batch-monitor era, now generalised to four levels.</li>
<li><strong>The second form, the access attribute, is separate from the level.</strong> It says read-only versus read/write versus execute-only. Two independent axes: <em>who</em> may touch it (level) and <em>how</em> (attribute). Table 9.5 on slide 41 shows both stored in the segment descriptor (fields DPL and Type).</li>
</ul>
<table>
<tr><th>Level</th><th>Name in practice</th><th>What lives there</th><th>Typical use today</th></tr>
<tr><td><strong>0</strong></td><td>Ring 0 — "most protected"</td><td>OS kernel, page tables, device access</td><td>Used by every OS</td></tr>
<tr><td>1</td><td>Ring 1</td><td>OS services, drivers (as designed)</td><td>Almost always unused</td></tr>
<tr><td>2</td><td>Ring 2</td><td>Extended OS services (as designed)</td><td>Almost always unused</td></tr>
<tr><td><strong>3</strong></td><td>Ring 3 — "least protected"</td><td>Applications</td><td>Where your C program runs</td></tr>
</table>
<p class="pitfall">⚠️ The number direction trips people up every year: <strong>smaller number = MORE privilege.</strong> "Level 0 is most protected" in the slide's wording means level 0 is the most <em>trusted/protected</em> position, not the most restricted one. If you catch yourself writing "level 3 can access level 0 data", you have flipped it.</p>
<p class="meo">💡 Tie it to something you have already seen: in PRF192, writing through a bad pointer into kernel space does not corrupt the OS — it kills your process. That is this exact check firing, in hardware, before the store ever reaches memory.</p>`,
        `<p class="y-chinh">🎯 Phần thưởng thật của phân đoạn, và là lý do x86 giữ nó suốt bốn chục năm: mỗi đoạn mang <strong>HAI dạng bảo vệ — một mức đặc quyền và một thuộc tính truy cập</strong> — và phần cứng cưỡng chế chúng ở MỌI tham chiếu, không tốn một dòng phần mềm nào.</p>
<ul>
<li><strong>Bốn mức đặc quyền, "được bảo vệ nhất (mức 0)" tới "ít được bảo vệ nhất (mức 3)".</strong> Chính là các "vòng" (ring) nổi tiếng. Mức 0 là nhân; mức 3 là ứng dụng của bạn. Mức 1 và 2 vốn dành cho trình điều khiển thiết bị và dịch vụ HĐH, nhưng thực tế gần như mọi HĐH bỏ qua chúng và chỉ dùng 0 với 3 — dù phần cứng bày ra bốn.</li>
<li><strong>Phép ẩn dụ "mức duyệt an ninh" của slide mới là thứ đáng thuộc.</strong> "Mức đặc quyền gắn với một đoạn <strong>DỮ LIỆU</strong> là <em>ĐỘ MẬT</em> của nó"; "mức đặc quyền gắn với một đoạn <strong>CHƯƠNG TRÌNH</strong> là <em>MỨC ĐƯỢC DUYỆT</em> của nó". Đây là mô hình an ninh quân sự bê nguyên: tài liệu thì được đóng dấu mật, con người thì được duyệt.</li>
<li><strong>Một quy tắc suy ra từ đó.</strong> "Một chương trình đang chạy chỉ được truy cập những đoạn dữ liệu mà <strong>mức duyệt của nó THẤP HƠN HOẶC BẰNG</strong> mức đặc quyền của đoạn dữ liệu đó." Cẩn thận chiều: <em>SỐ</em> nhỏ hơn nghĩa là đặc quyền CAO hơn, nên chương trình mức 0 với tới được dữ liệu mật 0, 1, 2 hay 3, còn chương trình mức 3 chỉ với tới dữ liệu mức 3. Nhân đọc dữ liệu người dùng: được. Người dùng đọc dữ liệu nhân: lỗi.</li>
<li><strong>Bảo vệ không chỉ là chuyện dữ liệu.</strong> "Cơ chế đặc quyền cũng hạn chế việc dùng <strong>MỘT SỐ LỆNH</strong>." Lệnh đặc quyền (vào/ra, nạp thanh ghi điều khiển, dừng máy) chỉ chạy được ở mức 0 — đúng cái ý mà slide 11 gọi là "đặc tính phần cứng cần có" từ thời monitor lô, nay tổng quát hoá thành bốn mức.</li>
<li><strong>Dạng thứ hai, thuộc tính truy cập, TÁCH RỜI với mức.</strong> Nó nói chỉ-đọc, hay đọc/ghi, hay chỉ-thực-thi. Hai trục độc lập: <em>AI</em> được đụng (mức) và <em>ĐỤNG KIỂU GÌ</em> (thuộc tính). Table 9.5 ở slide 41 cho thấy cả hai được lưu trong mô tả đoạn (trường DPL và Type).</li>
</ul>
<table>
<tr><th>Mức</th><th>Tên thực tế</th><th>Ở đó có gì</th><th>Dùng thế nào ngày nay</th></tr>
<tr><td><strong>0</strong></td><td>Ring 0 — "được bảo vệ nhất"</td><td>Nhân HĐH, bảng trang, truy cập thiết bị</td><td>HĐH nào cũng dùng</td></tr>
<tr><td>1</td><td>Ring 1</td><td>Dịch vụ HĐH, trình điều khiển (theo thiết kế)</td><td>Gần như không ai dùng</td></tr>
<tr><td>2</td><td>Ring 2</td><td>Dịch vụ HĐH mở rộng (theo thiết kế)</td><td>Gần như không ai dùng</td></tr>
<tr><td><strong>3</strong></td><td>Ring 3 — "ít được bảo vệ nhất"</td><td>Ứng dụng</td><td>Nơi chương trình C của bạn chạy</td></tr>
</table>
<p class="pitfall">⚠️ Chiều của con số năm nào cũng làm người ta vấp: <strong>số NHỎ hơn = đặc quyền CAO hơn.</strong> Câu "mức 0 được bảo vệ nhất" theo cách nói của slide nghĩa là mức 0 là vị trí được <em>TIN CẬY/BẢO VỆ</em> nhất, chứ không phải bị hạn chế nhất. Nếu bắt gặp mình viết "mức 3 truy cập được dữ liệu mức 0" thì bạn đã lật ngược rồi.</p>
<p class="meo">💡 Nối với thứ bạn đã gặp: trong PRF192, ghi qua một con trỏ hỏng vào vùng nhân KHÔNG làm hỏng HĐH — nó giết tiến trình của bạn. Đó chính là phép kiểm này nổ, ở phần cứng, trước khi lệnh ghi kịp chạm tới bộ nhớ.</p>`],

      [40, 'Figure 9.20 — Intel x86 Memory Management Formats',
        `<p class="y-chinh">🎯 Five bit-layout diagrams, one per structure the x86 MMU touches. Read them as the <em>physical form</em> of everything slides 37–39 described in words. Note how much meaning is packed into single bits — this is where "protection costs nothing at run time" actually comes from.</p>
<table>
<tr><th>Part</th><th>Structure</th><th>Fields, with bit positions as drawn</th></tr>
<tr><td>(a)</td><td><strong>Segment selector</strong> (16 bits)</td><td><strong>Index</strong> 15…3 · <strong>TI</strong> 2 (table indicator) · <strong>RPL</strong> 1…0 (requestor privilege level)</td></tr>
<tr><td>(b)</td><td><strong>Linear address</strong> (32 bits)</td><td><strong>Directory</strong> 31…22 · <strong>Table</strong> 21…12 · <strong>Offset</strong> 11…0</td></tr>
<tr><td>(c)</td><td><strong>Segment descriptor</strong> (64 bits, two words)</td><td>Base 31…24 · <strong>G</strong> · <strong>D/B</strong> · L · AVL · Segment limit 19…16 · <strong>P</strong> · <strong>DPL</strong> · <strong>S</strong> · Type · Base 23…16 — then Base 15…0 · Segment limit 15…0</td></tr>
<tr><td>(d)</td><td><strong>Page directory entry</strong> (32 bits)</td><td>Page frame address 31…12 · AVL · <strong>PS</strong> · 0 · <strong>A</strong> · <strong>PCD</strong> · <strong>PWT</strong> · <strong>US</strong> · <strong>RW</strong> · <strong>P</strong></td></tr>
<tr><td>(e)</td><td><strong>Page table entry</strong> (32 bits)</td><td>Page frame address 31…12 · AVL · (reserved) · <strong>D</strong> · <strong>A</strong> · PCD · PWT · US · RW · P</td></tr>
</table>
<ul>
<li><strong>Part (b) is the one to memorise for calculations: 10 + 10 + 12 = 32.</strong> Directory 10 bits → 2<sup>10</sup> = 1 024 directory entries. Table 10 bits → 1 024 entries per page table. Offset 12 bits → 4 KiB pages. That is the whole two-level scheme of slide 43, expressed as three field widths.</li>
<li><strong>Parts (d) and (e) are nearly identical — and that is deliberate.</strong> A page directory entry and a page table entry have the same shape, so the same hardware walker can read both levels. Spot the two differences: (d) has <strong>PS</strong> (page size, 4 KiB or 4 MiB), (e) has <strong>D</strong> (dirty) in that bit position. Dirty makes no sense on a directory, page-size makes no sense on a leaf.</li>
<li><strong>The frame address is only 20 bits, and the reason is a nice piece of reasoning.</strong> Table 9.5 says it: "since page frames are aligned on 4K boundaries, the bottom 12 bits are 0, and only the top 20 bits are included in the entry". Storing zeros would be a waste — so the hardware implies them. The same trick lets a 32-bit entry hold a 32-bit address plus 12 flag bits.</li>
<li><strong>Look at (c) and count how many protection fields fit in 64 bits.</strong> DPL (2 bits — the four privilege levels of slide 39), S, Type (access attributes), P (present), G (granularity), D/B (operand size), L (64-bit code). Every one of these is checked by hardware on the same cycle as the address addition.</li>
<li><strong>G, the granularity bit, is worth one sentence.</strong> Table 9.5 explains it: the limit field is read either in bytes (max segment 1 MiB) or in 4 KiB units (max segment 4 GiB). One bit turns a 20-bit limit field into a 32-bit reach — which is how a 1980s descriptor format survived into the 4 GiB era.</li>
</ul>
<p class="meo">💡 If a question gives you a raw linear address and asks for directory/table/offset, the 10/10/12 split means in hex: the offset is the <strong>last three hex digits</strong>, and the remaining five hex digits split 10+10 — which is <em>not</em> on a hex boundary, so convert those five digits to 20 binary bits and cut in the middle.</p>
<p class="pitfall">⚠️ Do not read part (a)'s Index field as 16 bits. It is <strong>13</strong> bits (15 down to 3), because TI and RPL occupy the bottom three. Slide 38's "14 bits specify segment" counts Index + TI; the selector as a whole is 16.</p>`,
        `<p class="y-chinh">🎯 Năm sơ đồ bố trí bit, mỗi cái cho một cấu trúc mà MMU của x86 đụng tới. Hãy đọc chúng như <em>HÌNH HÀI VẬT LÝ</em> của mọi thứ slide 37–39 vừa mô tả bằng lời. Để ý bao nhiêu ý nghĩa được nhồi vào từng bit đơn lẻ — chính chỗ này đẻ ra câu "bảo vệ không tốn gì lúc chạy".</p>
<table>
<tr><th>Phần</th><th>Cấu trúc</th><th>Các trường, kèm vị trí bit đúng như hình vẽ</th></tr>
<tr><td>(a)</td><td><strong>Segment selector</strong> (16 bit)</td><td><strong>Index</strong> 15…3 · <strong>TI</strong> 2 (chỉ báo bảng) · <strong>RPL</strong> 1…0 (mức đặc quyền bên yêu cầu)</td></tr>
<tr><td>(b)</td><td><strong>Linear address</strong> (32 bit)</td><td><strong>Directory</strong> 31…22 · <strong>Table</strong> 21…12 · <strong>Offset</strong> 11…0</td></tr>
<tr><td>(c)</td><td><strong>Segment descriptor</strong> (64 bit, hai từ)</td><td>Base 31…24 · <strong>G</strong> · <strong>D/B</strong> · L · AVL · Segment limit 19…16 · <strong>P</strong> · <strong>DPL</strong> · <strong>S</strong> · Type · Base 23…16 — rồi Base 15…0 · Segment limit 15…0</td></tr>
<tr><td>(d)</td><td><strong>Page directory entry</strong> (32 bit)</td><td>Page frame address 31…12 · AVL · <strong>PS</strong> · 0 · <strong>A</strong> · <strong>PCD</strong> · <strong>PWT</strong> · <strong>US</strong> · <strong>RW</strong> · <strong>P</strong></td></tr>
<tr><td>(e)</td><td><strong>Page table entry</strong> (32 bit)</td><td>Page frame address 31…12 · AVL · (dành riêng) · <strong>D</strong> · <strong>A</strong> · PCD · PWT · US · RW · P</td></tr>
</table>
<ul>
<li><strong>Phần (b) là thứ phải thuộc để tính toán: 10 + 10 + 12 = 32.</strong> Directory 10 bit → 2<sup>10</sup> = 1 024 mục thư mục. Table 10 bit → 1 024 mục mỗi bảng trang. Offset 12 bit → trang 4 KiB. Đó là trọn sơ đồ hai mức của slide 43, diễn đạt bằng ba độ rộng trường.</li>
<li><strong>Phần (d) và (e) gần như y hệt nhau — và đó là cố ý.</strong> Mục thư mục trang và mục bảng trang cùng hình hài, nên cùng một bộ duyệt phần cứng đọc được cả hai mức. Bắt hai chỗ khác: (d) có <strong>PS</strong> (kích thước trang, 4 KiB hay 4 MiB), (e) có <strong>D</strong> (dirty — đã bị ghi) ở đúng vị trí bit đó. "Đã bị ghi" vô nghĩa với một thư mục, "kích thước trang" vô nghĩa với một lá.</li>
<li><strong>Địa chỉ khung chỉ có 20 bit, và lý do là một lập luận rất đẹp.</strong> Table 9.5 nói thẳng: "vì khung trang được căn theo biên 4K nên 12 bit thấp luôn bằng 0, và chỉ 20 bit cao được đưa vào mục". Lưu các con số 0 là phí — nên phần cứng NGẦM ĐỊNH chúng. Cùng mánh đó cho phép một mục 32 bit chứa được một địa chỉ 32 bit CỘNG 12 bit cờ.</li>
<li><strong>Nhìn (c) và đếm xem bao nhiêu trường bảo vệ nhét vừa 64 bit.</strong> DPL (2 bit — bốn mức đặc quyền của slide 39), S, Type (thuộc tính truy cập), P (có mặt), G (độ mịn), D/B (cỡ toán hạng), L (mã 64 bit). Cái nào cũng được phần cứng kiểm trong cùng chu kỳ với phép cộng địa chỉ.</li>
<li><strong>Bit G — granularity — đáng một câu riêng.</strong> Table 9.5 giải thích: trường limit được đọc hoặc theo BYTE (đoạn tối đa 1 MiB), hoặc theo đơn vị 4 KiB (đoạn tối đa 4 GiB). Một bit biến trường giới hạn 20 bit thành tầm với 32 bit — nhờ đó một định dạng mô tả từ thập niên 1980 sống sót tới thời 4 GiB.</li>
</ul>
<p class="meo">💡 Nếu đề cho một địa chỉ tuyến tính thô và hỏi directory/table/offset, thì phép chẻ 10/10/12 trong hex nghĩa là: offset đúng bằng <strong>ba chữ số hex cuối</strong>, còn năm chữ số hex còn lại chẻ 10+10 — mà chỗ này <em>KHÔNG</em> rơi vào biên hex, nên phải đổi năm chữ số đó ra 20 bit nhị phân rồi cắt đôi.</p>
<p class="pitfall">⚠️ Đừng đọc trường Index của phần (a) thành 16 bit. Nó là <strong>13</strong> bit (từ 15 xuống 3), vì TI và RPL chiếm ba bit đáy. Câu "14 bit chỉ định đoạn" ở slide 38 đếm Index + TI; còn cả cái selector thì là 16 bit.</p>`],

      [41, 'Table 9.5 — x86 Memory Management Parameters (1 of 2): the Segment Descriptor',
        `<p class="y-chinh">🎯 The field-by-field dictionary for Figure 9.20(c) — the <strong>Segment Descriptor</strong>, also called the <strong>segment table entry</strong>. Eight fields, and reading them in order tells you everything a segment "is" to the hardware: where it starts, how big it is, who may touch it, and whether it is there at all.</p>
<table>
<tr><th>Field</th><th>The table's definition</th><th>Why it must exist</th></tr>
<tr><td><strong>Base</strong></td><td>"Defines the starting address of the segment within the 4-Gbyte linear address space"</td><td>This is the base address of slide 29, now a hardware field. Physical = base + offset.</td></tr>
<tr><td><strong>Limit</strong></td><td>"Defines the size of the segment… in units of one byte, up to a segment size limit of 1 Mbyte, or in units of 4 Kbytes, up to a segment size limit of 4 Gbytes"</td><td>Segments vary in size, so size must be <em>stored</em> (unlike a page). Every access is bounds-checked against it.</td></tr>
<tr><td><strong>Granularity bit (G)</strong></td><td>"Indicates whether the Limit field is to be interpreted in units by one byte or 4 Kbytes"</td><td>The switch that chooses between the two Limit readings above — 1 MiB precise, or 4 GiB coarse.</td></tr>
<tr><td><strong>DPL</strong> (Descriptor Privilege Level)</td><td>"Specifies the privilege level of the segment referred to by this segment descriptor"</td><td>The "classification" of slide 39 — the 2 bits that hold 0…3.</td></tr>
<tr><td><strong>Type</strong></td><td>"Distinguishes between various kinds of segments and indicates the <strong>access attributes</strong>"</td><td>The second form of protection from slide 39: read-only vs read/write vs execute.</td></tr>
<tr><td><strong>S bit</strong></td><td>"Determines whether a given segment is a system segment or a code or data segment"</td><td>System segments (gates, task state) are structures the CPU itself interprets — they must be told apart.</td></tr>
<tr><td><strong>P bit</strong> (Segment Present)</td><td>"Used for nonpaged systems. It indicates whether the segment is present in main memory. For paged systems, this bit is always set to 1."</td><td>Segment-level swapping. Its "always 1 when paging is on" note tells you which mechanism owns residency.</td></tr>
<tr><td><strong>D/B bit</strong></td><td>"In a code segment, this is the D bit and indicates whether operands and addressing modes are 16 or 32 bits"</td><td>Backward compatibility with 16-bit code, decided per segment rather than per machine.</td></tr>
</table>
<ul>
<li><strong>The P bit's note is the most informative sentence on the slide.</strong> "For paged systems, this bit is always set to 1" means: when paging is enabled, <em>paging</em> decides what is resident and what is on disk, and segmentation stops doing residency at all. Two mechanisms, one job — so one of them stands down. That is exactly why modern OSs neutralise segmentation (slide 37).</li>
<li><strong>Base + Limit is the oldest protection idea in computing, and it is still here.</strong> Slide 29 introduced it as base and bounds registers for dynamic partitioning; slide 41 shows it living on as two fields of a 64-bit descriptor. The idea did not get replaced, it got tabulated.</li>
<li><strong>Notice that Base is split across the descriptor (31…24, then 23…16, then 15…0).</strong> That is not elegance, that is history — the 80286 descriptor had a 24-bit base, and the 80386 had to bolt on the top 8 bits without breaking the old layout. Hardware formats carry their ancestry forever.</li>
<li><strong>The slide's footnote "(Table is on page 323 in the textbook)"</strong> is a reminder that this table is compressed for the slide; the book gives fuller wording. If an exam quotes a definition you do not recognise, that is where it came from.</li>
</ul>
<p class="meo">💡 Group the eight fields into three jobs and they stop being a list to memorise: <strong>WHERE</strong> (Base) · <strong>HOW BIG</strong> (Limit, G) · <strong>WHO AND HOW</strong> (DPL, Type, S, P, D/B).</p>`,
        `<p class="y-chinh">🎯 Từ điển từng trường cho Figure 9.20(c) — <strong>Segment Descriptor</strong>, còn gọi là <strong>mục bảng đoạn</strong>. Tám trường, và đọc theo thứ tự là biết một cái đoạn "LÀ GÌ" với phần cứng: nó bắt đầu ở đâu, to bao nhiêu, ai được đụng, và nó có mặt hay không.</p>
<table>
<tr><th>Trường</th><th>Định nghĩa trong bảng</th><th>Vì sao nó phải tồn tại</th></tr>
<tr><td><strong>Base</strong></td><td>"Định nghĩa địa chỉ bắt đầu của đoạn trong không gian địa chỉ tuyến tính 4 Gbyte"</td><td>Chính là địa chỉ nền của slide 29, nay thành một trường phần cứng. Vật lý = nền + độ lệch.</td></tr>
<tr><td><strong>Limit</strong></td><td>"Định nghĩa kích thước của đoạn… theo đơn vị một byte, tối đa 1 Mbyte, hoặc theo đơn vị 4 Kbyte, tối đa 4 Gbyte"</td><td>Đoạn có cỡ khác nhau nên kích thước phải được <em>LƯU</em> (khác hẳn trang). Mọi truy cập đều bị kiểm biên với nó.</td></tr>
<tr><td><strong>Granularity bit (G)</strong></td><td>"Cho biết trường Limit được hiểu theo đơn vị một byte hay 4 Kbyte"</td><td>Cái công tắc chọn giữa hai cách đọc Limit ở trên — 1 MiB mà mịn, hay 4 GiB mà thô.</td></tr>
<tr><td><strong>DPL</strong> (Descriptor Privilege Level)</td><td>"Chỉ định mức đặc quyền của đoạn mà mô tả này trỏ tới"</td><td>Chính là "độ mật" ở slide 39 — 2 bit chứa giá trị 0…3.</td></tr>
<tr><td><strong>Type</strong></td><td>"Phân biệt các loại đoạn khác nhau và cho biết <strong>thuộc tính truy cập</strong>"</td><td>Dạng bảo vệ thứ hai của slide 39: chỉ-đọc, đọc/ghi, hay thực thi.</td></tr>
<tr><td><strong>S bit</strong></td><td>"Xác định đoạn đã cho là đoạn HỆ THỐNG hay đoạn mã/dữ liệu"</td><td>Đoạn hệ thống (cổng, trạng thái tác vụ) là cấu trúc do chính CPU diễn giải — phải phân biệt được.</td></tr>
<tr><td><strong>P bit</strong> (Segment Present)</td><td>"Dùng cho hệ KHÔNG phân trang. Nó cho biết đoạn có mặt trong bộ nhớ chính hay không. Với hệ CÓ phân trang, bit này LUÔN bằng 1."</td><td>Hoán đổi ở mức đoạn. Câu "luôn bằng 1 khi có phân trang" cho bạn biết cơ chế nào đang nắm quyền quản cư trú.</td></tr>
<tr><td><strong>D/B bit</strong></td><td>"Trong một đoạn mã, đây là bit D, cho biết toán hạng và chế độ địa chỉ là 16 hay 32 bit"</td><td>Tương thích ngược với mã 16 bit, quyết định theo TỪNG ĐOẠN chứ không theo cả máy.</td></tr>
</table>
<ul>
<li><strong>Ghi chú ở bit P là câu nhiều thông tin nhất slide.</strong> "Với hệ có phân trang, bit này luôn bằng 1" nghĩa là: khi bật phân trang thì <em>PHÂN TRANG</em> quyết định thứ gì cư trú, thứ gì nằm đĩa, còn phân đoạn thôi hẳn việc quản cư trú. Hai cơ chế, một công việc — nên một cái phải lùi. Đúng là lý do HĐH hiện đại vô hiệu hoá phân đoạn (slide 37).</li>
<li><strong>Base + Limit là ý tưởng bảo vệ cổ nhất của ngành máy tính, và nó vẫn còn đây.</strong> Slide 29 giới thiệu nó dưới dạng thanh ghi nền và biên cho phân vùng động; slide 41 cho thấy nó sống tiếp thành hai trường của một mô tả 64 bit. Ý tưởng không bị thay thế, nó chỉ được lập bảng.</li>
<li><strong>Để ý Base bị CHẺ RỜI trong mô tả (31…24, rồi 23…16, rồi 15…0).</strong> Đó không phải sự thanh lịch, đó là LỊCH SỬ — mô tả của 80286 có nền 24 bit, và 80386 phải chắp thêm 8 bit cao mà không được phá bố cục cũ. Định dạng phần cứng mang theo gia phả của nó mãi mãi.</li>
<li><strong>Dòng chú "(Table is on page 323 in the textbook)"</strong> nhắc rằng bảng này đã bị nén lại cho vừa slide; sách ghi đầy đủ hơn. Nếu đề thi trích một định nghĩa bạn thấy lạ thì nó ra từ đó.</li>
</ul>
<p class="meo">💡 Gom tám trường thành ba công việc là chúng hết còn là một danh sách phải học vẹt: <strong>Ở ĐÂU</strong> (Base) · <strong>TO BAO NHIÊU</strong> (Limit, G) · <strong>AI VÀ KIỂU GÌ</strong> (DPL, Type, S, P, D/B).</p>`],

      [42, 'Table 9.5 — x86 Memory Management Parameters (2 of 2): Page Directory and Page Table Entries',
        `<p class="y-chinh">🎯 The same dictionary for Figure 9.20(d) and (e). Nine fields, and they fall into three groups that every paging system in existence has in some form: <strong>where the page is</strong>, <strong>what has happened to it</strong>, and <strong>who may use it and how it is cached</strong>.</p>
<table>
<tr><th>Field</th><th>The table's definition</th><th>Group</th></tr>
<tr><td><strong>Page Frame Address</strong></td><td>"Provides the physical address of the page in memory if the present bit is set. Since page frames are aligned on 4K boundaries, the bottom 12 bits are 0, and only the top 20 bits are included in the entry. <strong>In a page directory, the address is that of a page table.</strong>"</td><td>Where</td></tr>
<tr><td><strong>Present bit (P)</strong></td><td>"Indicates whether the page table or page is in main memory"</td><td>Where</td></tr>
<tr><td><strong>Accessed bit (A)</strong></td><td>"Set to 1 by the processor <strong>in both levels of page tables</strong> when a read or write operation to the corresponding page occurs"</td><td>What happened</td></tr>
<tr><td><strong>Dirty bit (D)</strong></td><td>"Set to 1 by the processor when a <strong>write</strong> operation to the corresponding page occurs"</td><td>What happened</td></tr>
<tr><td><strong>Read/Write bit (RW)</strong></td><td>"For user-level pages, indicates whether the page is read-only access or read/write access for user-level programs"</td><td>Who</td></tr>
<tr><td><strong>User/Supervisor bit (US)</strong></td><td>"Indicates whether the page is available only to the operating system (supervisor level) or is available to both operating system and applications (user level)"</td><td>Who</td></tr>
<tr><td><strong>Page Size bit (PS)</strong></td><td>"Indicates whether page size is 4 Kbyte or 4 Mbyte"</td><td>Where (shape)</td></tr>
<tr><td><strong>Page Cache Disable (PCD)</strong></td><td>"Indicates whether data from page may be cached"</td><td>Caching</td></tr>
<tr><td><strong>Page Write Through (PWT)</strong></td><td>"Indicates whether write-through or write-back caching policy will be used for data in the corresponding page"</td><td>Caching</td></tr>
</table>
<ul>
<li><strong>The Present bit is what makes demand paging possible at all.</strong> P = 0 is not an error condition, it is a <em>message</em>: the hardware raises a page fault and hands control to the OS, which is exactly the "Page in main memory? No" branch of the flowchart on slide 34. Everything else in the entry is then free for the OS to use as a disk address.</li>
<li><strong>A and D are the hardware's gift to the replacement algorithm.</strong> <strong>A</strong> (accessed) lets the OS approximate LRU cheaply — clear all A bits periodically, and pages whose A bit stays 0 are cold. <strong>D</strong> (dirty) says whether evicting the page requires a disk <em>write</em> or can just drop it. A clean page costs nothing to evict; a dirty one costs a whole disk transfer. Chapter 5 made the same distinction for cache lines under the name write-back.</li>
<li><strong>PCD and PWT are the bridge to Chapter 5, written into the page table.</strong> Cache policy is decided <em>per page</em>, not per machine. Memory-mapped device registers get PCD = 1 (never cache — the device changes the value behind your back); ordinary DRAM gets write-back. This is how a single processor serves both without knowing which is which.</li>
<li><strong>The frame-address note answers "how does the walker know what it found?"</strong> — "in a page directory, the address is that of a page table". The same 20-bit field means <em>next-level table</em> at level 1 and <em>final data frame</em> at level 2. Level, not format, gives it meaning.</li>
<li><strong>PS = 1 gives 4 Mbyte pages, and that is not a curiosity.</strong> One 4 MiB page replaces 1 024 4 KiB pages, so one TLB entry covers 1 000× more memory. Databases and hypervisors use these "huge pages" specifically to cut TLB misses — which is slide 35's arithmetic being exploited in production.</li>
</ul>
<p class="pitfall">⚠️ Do not mix up <strong>A</strong> and <strong>D</strong>. Every access (read <em>or</em> write) sets A; only a write sets D. A page can be accessed thousands of times and still be clean. Exam questions about "which page is cheapest to evict" are testing exactly this pair.</p>`,
        `<p class="y-chinh">🎯 Vẫn là từ điển đó, cho Figure 9.20(d) và (e). Chín trường, và chúng rơi vào ba nhóm mà hệ phân trang nào trên đời cũng có dưới dạng nào đó: <strong>trang nằm ở đâu</strong>, <strong>đã có chuyện gì xảy ra với nó</strong>, và <strong>ai được dùng nó và nó được đệm thế nào</strong>.</p>
<table>
<tr><th>Trường</th><th>Định nghĩa trong bảng</th><th>Nhóm</th></tr>
<tr><td><strong>Page Frame Address</strong></td><td>"Cung cấp địa chỉ vật lý của trang trong bộ nhớ nếu bit present được đặt. Vì khung trang căn theo biên 4K nên 12 bit thấp bằng 0, và chỉ 20 bit cao được đưa vào mục. <strong>Trong một page directory, địa chỉ đó là địa chỉ của một bảng trang.</strong>"</td><td>Ở đâu</td></tr>
<tr><td><strong>Present bit (P)</strong></td><td>"Cho biết bảng trang hoặc trang có nằm trong bộ nhớ chính hay không"</td><td>Ở đâu</td></tr>
<tr><td><strong>Accessed bit (A)</strong></td><td>"Được bộ xử lý đặt lên 1 <strong>ở CẢ HAI mức bảng trang</strong> khi có thao tác đọc hoặc ghi vào trang tương ứng"</td><td>Đã xảy ra gì</td></tr>
<tr><td><strong>Dirty bit (D)</strong></td><td>"Được bộ xử lý đặt lên 1 khi có thao tác <strong>GHI</strong> vào trang tương ứng"</td><td>Đã xảy ra gì</td></tr>
<tr><td><strong>Read/Write bit (RW)</strong></td><td>"Với trang mức người dùng, cho biết trang là chỉ-đọc hay đọc/ghi đối với chương trình mức người dùng"</td><td>Ai</td></tr>
<tr><td><strong>User/Supervisor bit (US)</strong></td><td>"Cho biết trang chỉ dành cho hệ điều hành (mức giám sát) hay dùng được cho cả HĐH lẫn ứng dụng (mức người dùng)"</td><td>Ai</td></tr>
<tr><td><strong>Page Size bit (PS)</strong></td><td>"Cho biết kích thước trang là 4 Kbyte hay 4 Mbyte"</td><td>Ở đâu (hình dạng)</td></tr>
<tr><td><strong>Page Cache Disable (PCD)</strong></td><td>"Cho biết dữ liệu của trang có được đưa vào cache hay không"</td><td>Đệm</td></tr>
<tr><td><strong>Page Write Through (PWT)</strong></td><td>"Cho biết chính sách đệm dùng cho dữ liệu của trang là write-through hay write-back"</td><td>Đệm</td></tr>
</table>
<ul>
<li><strong>Bit Present mới là thứ làm cho phân trang theo yêu cầu khả thi.</strong> P = 0 KHÔNG phải một tình trạng lỗi, nó là một <em>THÔNG ĐIỆP</em>: phần cứng nêu lỗi trang và trao quyền cho HĐH, đúng nhánh "Page in main memory? No" của lưu đồ ở slide 34. Mọi thứ còn lại trong mục khi đó rảnh rỗi để HĐH dùng làm địa chỉ trên đĩa.</li>
<li><strong>A và D là món quà phần cứng tặng cho thuật toán thay trang.</strong> <strong>A</strong> (đã truy cập) giúp HĐH xấp xỉ LRU với giá rẻ — cứ định kỳ xoá sạch bit A, trang nào bit A vẫn 0 là trang nguội. <strong>D</strong> (bẩn) nói việc đuổi trang này có cần một lần <em>GHI</em> xuống đĩa hay chỉ cần vứt đi. Trang sạch đuổi đi không tốn gì; trang bẩn tốn nguyên một lần truyền đĩa. Chương 5 đã phân biệt y hệt cho dòng cache dưới cái tên write-back.</li>
<li><strong>PCD và PWT là cây cầu sang Chương 5, viết thẳng vào bảng trang.</strong> Chính sách cache quyết định theo <em>TỪNG TRANG</em>, không phải theo cả máy. Thanh ghi thiết bị ánh xạ vào bộ nhớ được đặt PCD = 1 (cấm đệm — thiết bị đổi giá trị sau lưng bạn); DRAM thường thì dùng write-back. Đó là cách một con vi xử lý phục vụ cả hai mà không cần biết cái nào là cái nào.</li>
<li><strong>Ghi chú ở trường địa chỉ khung trả lời câu "bộ duyệt làm sao biết nó vừa tìm được cái gì?"</strong> — "trong một page directory, địa chỉ đó là địa chỉ của một bảng trang". Cùng một trường 20 bit mà ở mức 1 nghĩa là <em>bảng mức kế</em>, ở mức 2 nghĩa là <em>khung dữ liệu cuối</em>. MỨC chứ không phải ĐỊNH DẠNG mới cho nó ý nghĩa.</li>
<li><strong>PS = 1 cho trang 4 Mbyte, và đó không phải chuyện lạ vui.</strong> Một trang 4 MiB thay cho 1 024 trang 4 KiB, nên MỘT mục TLB phủ được lượng bộ nhớ gấp 1 000 lần. Cơ sở dữ liệu và hypervisor dùng các "trang khổng lồ" này đúng để cắt trượt TLB — tức phép tính của slide 35 được khai thác trong sản xuất thật.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn <strong>A</strong> với <strong>D</strong>. Mọi truy cập (đọc <em>hoặc</em> ghi) đều đặt A; chỉ GHI mới đặt D. Một trang có thể bị truy cập hàng nghìn lần mà vẫn SẠCH. Câu hỏi thi kiểu "trang nào đuổi đi rẻ nhất" chính là đang kiểm tra cặp này.</p>`],
      [43, 'Paging (on the x86) — the two-level page table',
        `<p class="y-chinh">🎯 The x86's answer to "a flat page table is too big": split it in two. The slide states the whole scheme in seven lines — "<strong>Two level page table lookup</strong>", a <strong>page directory</strong> of "1024 entries max" that "splits 4 Gbyte linear memory into 1024 page groups of 4 Mbyte", and under it page tables of "1024 entries corresponding to 4 Kbyte pages".</p>
<ul>
<li><strong>Check the arithmetic against Figure 9.20(b) — it is the same fact twice.</strong> 1 024 directory entries = 10 bits. 1 024 page-table entries = 10 bits. 4 KiB page = 12 bits. 10 + 10 + 12 = <strong>32</strong>, the width of a linear address. And 1 024 × 4 MiB = 4 096 MiB = <strong>4 GiB</strong>, the whole space. The two slides are consistent to the bit.</li>
<li><strong>"Segmentation may be disabled — in which case linear address space is used."</strong> The slide opens with this because it defines what the input to paging is: if segmentation is on, paging receives the <em>linear</em> address that segmentation produced; if it is off, the linear address is the program's address unchanged. Figure 9.21 (slide 44) draws both cases as one pipeline.</li>
<li><strong>"Page directory for current process always in memory."</strong> This is the load-bearing sentence of the whole two-level design. The directory (4 KiB) is pinned; the individual page tables it points at may themselves be paged out. So a process pays 4 KiB always, and 4 KiB more per 4 MiB of address space actually used. Unused regions cost <em>one directory entry with P = 0</em> — nothing else.</li>
<li><strong>"Can use one page directory for all processes, one per process or mixture."</strong> Per-process directories are the normal case (that is what makes address spaces private); a shared one is how threads inside one process share memory. The "mixture" is how a kernel maps itself identically into every process.</li>
<li><strong>"Use TLB holding 32 page table entries."</strong> A very small number — deliberately. 32 entries × 4 KiB = <strong>128 KiB of coverage</strong>, which sounds tiny until you remember slide 35: locality means 32 well-chosen translations already deliver a hit ratio in the high nineties.</li>
<li><strong>"Two page sizes available, 4k or 4M."</strong> Set PS = 1 in a directory entry (slide 42) and that entry maps a whole 4 MiB page directly, with no second-level table at all. One TLB entry then covers 4 MiB instead of 4 KiB.</li>
</ul>
<p class="nhan">📐 <strong>How much does two-level paging actually save? Compute it for a realistic process.</strong> 32-bit address space, 4 KiB pages, 4-byte entries, and a process that actually uses 16 MiB of memory.</p>
<table>
<tr><th>Scheme</th><th>What must exist</th><th>Memory for tables</th></tr>
<tr><td><strong>One flat table</strong></td><td>2<sup>20</sup> entries × 4 B — all of them, whether used or not</td><td><strong>4 194 304 B = 4 MiB, per process</strong></td></tr>
<tr><td><strong>Two-level</strong></td><td>1 page directory (1 024 × 4 B = 4 KiB) + one page table per 4 MiB actually used. 16 MiB ÷ 4 MiB = <strong>4</strong> page tables × 4 KiB</td><td>4 096 + 4 × 4 096 = <strong>20 480 B = 20 KiB</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>4 MiB versus 20 KiB — a saving of 4 194 304 ÷ 20 480 = 204,8×.</strong> And the saving grows with how sparse the process is: the flat table is a fixed 4 MiB no matter what, while the two-level table charges only for the 4 MiB regions you touch. Run 100 processes and the difference is 400 MiB of page tables against roughly 2 MiB. That is the entire justification for the extra level of indirection.</p>
<p class="pitfall">⚠️ The cost side, which exams like to ask about: two-level lookup means a TLB miss now needs <strong>two</strong> memory accesses to translate (directory, then table), then a third for the data — so a TLB miss costs T + 3M here, not T + 2M as in slide 35's simple model. Deeper trees are worse still: x86-64 uses <strong>four</strong> levels, so a full walk is four memory accesses. That is precisely why the TLB matters more, not less, as tables get deeper.</p>`,
        `<p class="y-chinh">🎯 Câu trả lời của x86 cho "bảng trang phẳng thì quá to": chẻ nó làm hai. Slide phát biểu trọn sơ đồ trong bảy dòng — "<strong>Tra bảng trang HAI MỨC</strong>", một <strong>page directory</strong> "tối đa 1024 mục" mà "chia bộ nhớ tuyến tính 4 Gbyte thành 1024 nhóm trang, mỗi nhóm 4 Mbyte", và bên dưới là các bảng trang "1024 mục tương ứng với các trang 4 Kbyte".</p>
<ul>
<li><strong>Đối chiếu phép tính với Figure 9.20(b) — cùng một sự thật nói hai lần.</strong> 1 024 mục thư mục = 10 bit. 1 024 mục bảng trang = 10 bit. Trang 4 KiB = 12 bit. 10 + 10 + 12 = <strong>32</strong>, đúng độ rộng địa chỉ tuyến tính. Và 1 024 × 4 MiB = 4 096 MiB = <strong>4 GiB</strong>, đúng cả không gian. Hai slide khớp nhau tới từng bit.</li>
<li><strong>"Phân đoạn CÓ THỂ bị tắt — khi đó dùng không gian địa chỉ tuyến tính."</strong> Slide mở đầu bằng câu này vì nó định nghĩa ĐẦU VÀO của phân trang: nếu phân đoạn bật thì phân trang nhận địa chỉ <em>TUYẾN TÍNH</em> mà phân đoạn vừa sinh ra; nếu tắt thì địa chỉ tuyến tính chính là địa chỉ của chương trình, nguyên xi. Figure 9.21 (slide 44) vẽ cả hai ca thành một đường ống.</li>
<li><strong>"Page directory của tiến trình hiện hành LUÔN nằm trong bộ nhớ."</strong> Đây là câu chịu lực của cả thiết kế hai mức. Thư mục (4 KiB) bị ghim lại; còn các bảng trang mà nó trỏ tới thì bản thân chúng có thể bị đẩy ra đĩa. Vậy một tiến trình luôn trả 4 KiB, cộng thêm 4 KiB cho mỗi 4 MiB không gian địa chỉ THỰC SỰ dùng. Vùng không dùng tốn <em>một mục thư mục với P = 0</em> — hết, không gì thêm.</li>
<li><strong>"Có thể dùng MỘT page directory cho mọi tiến trình, hoặc mỗi tiến trình một cái, hoặc pha trộn."</strong> Mỗi tiến trình một thư mục là ca bình thường (chính nó làm cho không gian địa chỉ thành riêng tư); dùng chung một cái là cách các luồng trong cùng tiến trình chia sẻ bộ nhớ. Còn "pha trộn" là cách nhân tự ánh xạ chính nó y hệt vào mọi tiến trình.</li>
<li><strong>"Dùng TLB chứa 32 mục bảng trang."</strong> Một con số rất nhỏ — và là cố ý. 32 mục × 4 KiB = <strong>128 KiB phủ được</strong>, nghe bé tí cho tới khi bạn nhớ lại slide 35: nhờ tính cục bộ, 32 bản dịch chọn khéo đã cho tỉ lệ trúng ở mức chín mươi mấy phần trăm.</li>
<li><strong>"Có hai kích thước trang, 4k hoặc 4M."</strong> Đặt PS = 1 trong một mục thư mục (slide 42) là mục đó ánh xạ thẳng nguyên một trang 4 MiB, khỏi cần bảng mức hai. Khi đó MỘT mục TLB phủ 4 MiB thay vì 4 KiB.</li>
</ul>
<p class="nhan">📐 <strong>Phân trang hai mức thực sự tiết kiệm bao nhiêu? Tính cho một tiến trình thực tế.</strong> Không gian địa chỉ 32 bit, trang 4 KiB, mỗi mục 4 byte, và một tiến trình dùng thật 16 MiB bộ nhớ.</p>
<table>
<tr><th>Sơ đồ</th><th>Phải có những gì</th><th>Bộ nhớ cho bảng</th></tr>
<tr><td><strong>Một bảng phẳng</strong></td><td>2<sup>20</sup> mục × 4 B — đủ hết, dùng hay không dùng cũng phải có</td><td><strong>4 194 304 B = 4 MiB, mỗi tiến trình</strong></td></tr>
<tr><td><strong>Hai mức</strong></td><td>1 page directory (1 024 × 4 B = 4 KiB) + mỗi 4 MiB thật sự dùng thì một bảng trang. 16 MiB ÷ 4 MiB = <strong>4</strong> bảng × 4 KiB</td><td>4 096 + 4 × 4 096 = <strong>20 480 B = 20 KiB</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>4 MiB so với 20 KiB — tiết kiệm 4 194 304 ÷ 20 480 = 204,8 lần.</strong> Và mức tiết kiệm còn tăng theo độ thưa của tiến trình: bảng phẳng cứ 4 MiB bất kể thế nào, còn bảng hai mức chỉ tính tiền những vùng 4 MiB bạn có đụng tới. Chạy 100 tiến trình thì chênh lệch là 400 MiB bảng trang so với khoảng 2 MiB. Đó là toàn bộ lý do biện minh cho một tầng gián tiếp thêm vào.</p>
<p class="pitfall">⚠️ Mặt chi phí, thứ mà đề thi hay hỏi: tra hai mức nghĩa là một lần TLB trượt giờ cần <strong>HAI</strong> lần truy cập bộ nhớ để dịch (thư mục, rồi bảng), rồi thêm lần thứ ba để lấy dữ liệu — nên TLB trượt ở đây tốn T + 3M, chứ không phải T + 2M như mô hình đơn giản ở slide 35. Cây sâu hơn thì còn tệ hơn: x86-64 dùng <strong>BỐN</strong> mức, nên một lần duyệt đầy đủ là bốn lần truy cập bộ nhớ. Đúng vì thế mà TLB càng quan trọng HƠN chứ không kém đi khi bảng sâu thêm.</p>`],

      [44, 'Figure 9.21 — Intel x86 Memory Address Translation Mechanisms',
        `<p class="y-chinh">🎯 The whole x86 memory pipeline in one wide diagram, and the bracket along the bottom tells you how to read it: the left half is labelled <strong>Segmentation</strong>, the right half <strong>Paging</strong>. A logical address goes in on the left, a physical address comes out on the right, and in between it passes through <em>four</em> tables.</p>
<ul>
<li><strong>Stage 1 — segmentation (left bracket).</strong> "Logical address" arrives as <strong>Segment selector</strong> + <strong>Offset</strong>. The selector indexes the <strong>Global descriptor table (GDT)</strong>, picking a <strong>Segment descriptor</strong>. From that descriptor comes the <strong>Segment base address</strong>, which is added to the offset. The result lands inside the <strong>Linear address space</strong> box at the point marked <strong>Lin. Addr.</strong>, inside a highlighted <strong>Segment</strong>.</li>
<li><strong>Stage 2 — paging (right bracket).</strong> That linear address is re-drawn split as <strong>Dir | Table | Offset</strong>. <em>Dir</em> indexes the <strong>Page directory</strong> to find an <strong>Entry</strong>; that entry points at a <strong>Page table</strong>; <em>Table</em> indexes it to find another <strong>Entry</strong>; that entry points at a <strong>Page</strong> in the <strong>Physical address space</strong>; and <em>Offset</em> finally selects the byte, marked <strong>Phy. Addr.</strong></li>
<li><strong>Count the memory accesses this costs and you understand the TLB.</strong> GDT lookup, page directory lookup, page table lookup, then the data itself — <strong>four</strong> accesses for one byte, in the worst case. The TLB (and the on-chip descriptor cache) collapse the first three to zero on a hit. Without caching translations, this diagram would be unusable.</li>
<li><strong>The "Page" label with a curved arrow into the segment matters.</strong> It shows that a segment is itself made of pages — the two mechanisms are stacked, not alternatives. Segmentation decides <em>which logical region</em> and enforces protection; paging decides <em>where the bytes physically live</em>. This is exactly the "segmented paged memory" row of slide 37.</li>
<li><strong>Follow the offset, as always.</strong> It is used twice in different roles: first added to the segment base (segmentation uses addition, because segments have arbitrary bases), then as the low 12 bits of the linear address indexing within a page (paging uses concatenation, because frames are power-of-two aligned). Addition versus concatenation is the cleanest way to tell the two mechanisms apart.</li>
</ul>
<p class="nhan">📐 <strong>Trace one address through the whole figure, using the field widths from slides 40 and 43.</strong> Suppose segmentation is neutralised (base = 0, the modern flat model), so the linear address equals the offset. Take linear address <code>0x00C0_3ABC</code>:</p>
<table>
<tr><th>Field</th><th>Bits</th><th>Value</th><th>Meaning</th></tr>
<tr><td>Directory</td><td>31…22 (10 bits)</td><td>0x00C03ABC &gt;&gt; 22 = <strong>3</strong></td><td>Entry 3 of the page directory</td></tr>
<tr><td>Table</td><td>21…12 (10 bits)</td><td>(0x00C03ABC &gt;&gt; 12) &amp; 0x3FF = <strong>3</strong></td><td>Entry 3 of that page table</td></tr>
<tr><td>Offset</td><td>11…0 (12 bits)</td><td>0x00C03ABC &amp; 0xFFF = <strong>0xABC = 2 748</strong></td><td>Byte 2 748 within the 4 KiB page</td></tr>
</table>
<p class="dap-an">✅ Check by rebuilding: (3 × 2<sup>22</sup>) + (3 × 2<sup>12</sup>) + 2 748 = 12 582 912 + 12 288 + 2 748 = <strong>12 597 948 = 0x00C03ABC</strong> ✔. And the sanity check that the split is right: directory entry 3 covers linear addresses 3 × 4 MiB = 12 582 912 = 0x00C00000 up to 0x00FFFFFF — and 0x00C03ABC does lie inside that range ✔.</p>
<p class="meo">💡 Remember the diagram as a sentence: <strong>selector → descriptor → base + offset → linear → directory → table → frame + offset → physical.</strong> Four tables, two additions of an offset, one physical address.</p>`,
        `<p class="y-chinh">🎯 Trọn đường ống bộ nhớ của x86 trong một sơ đồ rộng, và cái ngoặc chạy dọc đáy cho bạn biết cách đọc: nửa trái mang nhãn <strong>Segmentation</strong>, nửa phải là <strong>Paging</strong>. Một địa chỉ logic đi vào bên trái, một địa chỉ vật lý đi ra bên phải, và trên đường nó đi qua <em>BỐN</em> cái bảng.</p>
<ul>
<li><strong>Chặng 1 — phân đoạn (ngoặc trái).</strong> "Logical address" tới dưới dạng <strong>Segment selector</strong> + <strong>Offset</strong>. Selector đánh chỉ số vào <strong>Global descriptor table (GDT)</strong>, chọn ra một <strong>Segment descriptor</strong>. Từ mô tả đó lấy ra <strong>Segment base address</strong>, đem CỘNG với offset. Kết quả rơi vào bên trong hộp <strong>Linear address space</strong> tại điểm ghi <strong>Lin. Addr.</strong>, nằm trong một <strong>Segment</strong> được tô sáng.</li>
<li><strong>Chặng 2 — phân trang (ngoặc phải).</strong> Địa chỉ tuyến tính đó được vẽ lại, chẻ thành <strong>Dir | Table | Offset</strong>. <em>Dir</em> đánh chỉ số vào <strong>Page directory</strong> để tìm một <strong>Entry</strong>; mục đó trỏ tới một <strong>Page table</strong>; <em>Table</em> đánh chỉ số vào đó để tìm một <strong>Entry</strong> nữa; mục này trỏ tới một <strong>Page</strong> trong <strong>Physical address space</strong>; và <em>Offset</em> cuối cùng chọn ra đúng byte, ghi là <strong>Phy. Addr.</strong></li>
<li><strong>Đếm số lần truy cập bộ nhớ mà việc này tốn là hiểu ngay vì sao cần TLB.</strong> Tra GDT, tra page directory, tra page table, rồi mới tới chính dữ liệu — <strong>BỐN</strong> lần truy cập cho một byte, ở trường hợp xấu nhất. TLB (và bộ đệm mô tả đoạn trên chip) bóp ba lần đầu xuống còn không khi trúng. Không đệm các bản dịch lại thì cái sơ đồ này không xài nổi.</li>
<li><strong>Cái nhãn "Page" với mũi tên cong chỉ vào trong đoạn rất đáng chú ý.</strong> Nó cho thấy bản thân một ĐOẠN cũng được làm từ các TRANG — hai cơ chế XẾP CHỒNG lên nhau chứ không phải hai lựa chọn loại trừ. Phân đoạn quyết định <em>vùng logic nào</em> và cưỡng chế bảo vệ; phân trang quyết định <em>các byte nằm ở đâu về mặt vật lý</em>. Đây đúng là dòng "segmented paged memory" của slide 37.</li>
<li><strong>Lần theo cái offset, như mọi khi.</strong> Nó được dùng HAI lần với hai vai khác nhau: trước hết đem CỘNG vào nền của đoạn (phân đoạn dùng phép CỘNG, vì đoạn có nền tuỳ ý), sau đó làm 12 bit thấp của địa chỉ tuyến tính để đánh chỉ số trong một trang (phân trang dùng phép GHÉP, vì khung được căn theo luỹ thừa 2). "Cộng hay ghép" là cách sạch nhất để phân biệt hai cơ chế.</li>
</ul>
<p class="nhan">📐 <strong>Lần một địa chỉ đi hết sơ đồ, dùng đúng độ rộng trường của slide 40 và 43.</strong> Giả sử phân đoạn đã bị vô hiệu (nền = 0, tức mô hình phẳng hiện đại) nên địa chỉ tuyến tính bằng đúng offset. Lấy địa chỉ tuyến tính <code>0x00C03ABC</code>:</p>
<table>
<tr><th>Trường</th><th>Bit</th><th>Giá trị</th><th>Ý nghĩa</th></tr>
<tr><td>Directory</td><td>31…22 (10 bit)</td><td>0x00C03ABC dịch phải 22 = <strong>3</strong></td><td>Mục 3 của page directory</td></tr>
<tr><td>Table</td><td>21…12 (10 bit)</td><td>(0x00C03ABC dịch phải 12) AND 0x3FF = <strong>3</strong></td><td>Mục 3 của bảng trang đó</td></tr>
<tr><td>Offset</td><td>11…0 (12 bit)</td><td>0x00C03ABC AND 0xFFF = <strong>0xABC = 2 748</strong></td><td>Byte thứ 2 748 trong trang 4 KiB</td></tr>
</table>
<p class="dap-an">✅ Kiểm bằng cách dựng ngược: (3 × 2<sup>22</sup>) + (3 × 2<sup>12</sup>) + 2 748 = 12 582 912 + 12 288 + 2 748 = <strong>12 597 948 = 0x00C03ABC</strong> ✔. Và phép kiểm tỉnh táo cho thấy chẻ đúng: mục thư mục 3 phủ các địa chỉ tuyến tính từ 3 × 4 MiB = 12 582 912 = 0x00C00000 tới 0x00FFFFFF — mà 0x00C03ABC quả thật nằm trong khoảng đó ✔.</p>
<p class="meo">💡 Nhớ sơ đồ dưới dạng một câu: <strong>selector → mô tả đoạn → nền + offset → tuyến tính → thư mục → bảng → khung + offset → vật lý.</strong> Bốn cái bảng, hai lần cộng offset, một địa chỉ vật lý.</p>`],

      [45, 'Figure 9.22 — ARM Memory System Overview',
        `<p class="y-chinh">🎯 A block diagram of where the <strong>Memory Management Unit</strong> physically sits. The dashed box at the top labelled <strong>MMU</strong> contains exactly three blocks — <strong>Access control hardware</strong>, <strong>TLB</strong>, <strong>Virtual memory translation hardware</strong> — and below it sit the <strong>ARM core</strong>, the <strong>Cache and write buffer</strong>, <strong>Cache line fetch hardware</strong> and <strong>Main memory</strong>.</p>
<ul>
<li><strong>Read the arrows by what they carry, because the labels say it.</strong> ARM core → cache: "<strong>Virtual address</strong>" (dashed). MMU → main memory and → cache: "<strong>Physical address</strong>". TLB ↔ translation hardware: "Virtual address" one way, "<strong>Access bits, domain</strong>" the other. TLB → access control hardware: "Access bits, domain". Access control hardware → ARM core: "<strong>Abort</strong>".</li>
<li><strong>The Abort arrow is the protection mechanism made visible.</strong> If the access bits say no, the access control hardware raises an abort straight back at the core — and that is the hardware event the OS turns into "segmentation fault" for your process. Slide 50 explains what the bits say; this arrow shows what happens when they say no.</li>
<li><strong>The TLB sits between the core and everything else, exactly as in Figure 9.19.</strong> Same architecture, different vendor: translation is on the critical path of every access, so it must be cached. The dashed "virtual address" line from the core to the cache is the one architectural difference worth noticing — it hints at a <em>virtually indexed</em> cache that starts its lookup before translation finishes, recovering the serialisation cost of slide 35.</li>
<li><strong>"Cache and write buffer" is one block, not two.</strong> The write buffer absorbs stores so the core does not stall waiting for memory — the ARM equivalent of the write policies you met in Chapter 5, and the reason the memory-management format has <strong>B</strong> (bufferable) and <strong>C</strong> (cacheable) bits (Table 9.6, slide 49).</li>
<li><strong>Why this diagram belongs in a computer-architecture course rather than an OS one.</strong> Everything here is <em>hardware the OS programs</em>. The OS writes the translation tables; the MMU reads them on every access, at silicon speed. Get the boundary right and the whole chapter falls into place: tables are software, walking them is hardware.</li>
</ul>
<p class="meo">💡 Three blocks, three jobs: <strong>translation hardware = where is it</strong>, <strong>access control hardware = may I</strong>, <strong>TLB = remember the answers</strong>. Any ARM memory-management question is asking about one of the three.</p>
<p class="pitfall">⚠️ Do not read the MMU as "part of the operating system". It is a hardware unit inside the processor. The OS never performs a translation itself — it only <em>prepares the tables</em> and handles the aborts that come back.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ khối cho thấy <strong>KHỐI QUẢN LÝ BỘ NHỚ (MMU)</strong> nằm ở đâu về mặt vật lý. Cái khung nét đứt phía trên mang nhãn <strong>MMU</strong> chứa đúng ba khối — <strong>Access control hardware</strong>, <strong>TLB</strong>, <strong>Virtual memory translation hardware</strong> — còn bên dưới là <strong>ARM core</strong>, <strong>Cache and write buffer</strong>, <strong>Cache line fetch hardware</strong> và <strong>Main memory</strong>.</p>
<ul>
<li><strong>Đọc các mũi tên theo THỨ CHÚNG MANG, vì nhãn ghi rõ.</strong> ARM core → cache: "<strong>Virtual address</strong>" (nét đứt). MMU → bộ nhớ chính và → cache: "<strong>Physical address</strong>". TLB ↔ phần cứng dịch: "Virtual address" chiều này, "<strong>Access bits, domain</strong>" chiều kia. TLB → access control hardware: "Access bits, domain". Access control hardware → ARM core: "<strong>Abort</strong>".</li>
<li><strong>Mũi tên Abort chính là cơ chế bảo vệ hiện hình.</strong> Nếu các bit truy cập nói KHÔNG, phần cứng kiểm soát truy cập ném thẳng một abort về lõi — và đó chính là sự kiện phần cứng mà HĐH biến thành "segmentation fault" cho tiến trình của bạn. Slide 50 giải thích các bit đó nói gì; mũi tên này cho thấy chuyện gì xảy ra khi chúng nói không.</li>
<li><strong>TLB nằm giữa lõi và mọi thứ khác, y hệt Figure 9.19.</strong> Cùng kiến trúc, khác hãng: dịch địa chỉ nằm trên đường găng của mọi truy cập nên bắt buộc phải đệm lại. Đường "virtual address" nét đứt chạy từ lõi thẳng sang cache là khác biệt kiến trúc đáng để ý — nó ám chỉ một cache <em>đánh chỉ số theo địa chỉ ẢO</em>, khởi động việc tra cứu trước khi phép dịch xong, tức lấy lại được cái chi phí tuần tự ở slide 35.</li>
<li><strong>"Cache and write buffer" là MỘT khối chứ không phải hai.</strong> Bộ đệm ghi hút các lệnh ghi để lõi khỏi phải đứng chờ bộ nhớ — tương đương của ARM cho các chính sách ghi bạn gặp ở Chương 5, và là lý do định dạng quản lý bộ nhớ có bit <strong>B</strong> (đệm được) và <strong>C</strong> (cache được) (Table 9.6, slide 49).</li>
<li><strong>Vì sao sơ đồ này thuộc môn KIẾN TRÚC MÁY TÍNH chứ không phải môn HĐH.</strong> Mọi thứ ở đây là <em>PHẦN CỨNG mà HĐH lập trình cho nó</em>. HĐH viết các bảng dịch; MMU đọc chúng ở mỗi lần truy cập, với tốc độ của silic. Nắm đúng lằn ranh này là cả chương vào khuôn: bảng là phần mềm, còn việc DUYỆT bảng là phần cứng.</li>
</ul>
<p class="meo">💡 Ba khối, ba việc: <strong>phần cứng dịch = nó nằm đâu</strong>, <strong>phần cứng kiểm soát truy cập = tôi có được phép không</strong>, <strong>TLB = nhớ lại các câu trả lời</strong>. Câu hỏi nào về quản lý bộ nhớ ARM cũng đang hỏi một trong ba.</p>
<p class="pitfall">⚠️ Đừng đọc MMU thành "một phần của hệ điều hành". Nó là một khối PHẦN CỨNG nằm trong bộ xử lý. HĐH không bao giờ tự tay dịch một địa chỉ nào — nó chỉ <em>CHUẨN BỊ CÁC BẢNG</em> và xử lý những cái abort bắn ngược về.</p>`],

      [46, 'Virtual Memory Address Translation (ARM) — four block sizes, two table levels',
        `<p class="y-chinh">🎯 ARM's design decision, stated in one list: "The ARM supports memory access based on either <strong>sections or pages</strong>", and there are four sizes. This is not four page sizes for convenience — it is a deliberate strategy to make the TLB cover more memory with fewer entries.</p>
<table>
<tr><th>Name (slide's wording)</th><th>Size</th><th>Offset bits it implies</th><th>Table levels needed</th></tr>
<tr><td><strong>Supersections</strong> (optional)</td><td>"16-MB blocks of main memory"</td><td>24 bits (2<sup>24</sup> = 16 777 216)</td><td>Level 1 only</td></tr>
<tr><td><strong>Sections</strong></td><td>"1-MB blocks of main memory"</td><td>20 bits (2<sup>20</sup> = 1 048 576)</td><td>Level 1 only</td></tr>
<tr><td><strong>Large pages</strong></td><td>"64-kB blocks of main memory"</td><td>16 bits (2<sup>16</sup> = 65 536)</td><td>Level 1 + Level 2</td></tr>
<tr><td><strong>Small pages</strong></td><td>"4-kB blocks of main memory"</td><td>12 bits (2<sup>12</sup> = 4 096)</td><td>Level 1 + Level 2</td></tr>
</table>
<ul>
<li><strong>The slide gives its own reason, and it is the sentence to underline.</strong> "Sections and supersections are supported to allow mapping of a <strong>large region of memory while using only a single entry in the TLB</strong>." One TLB entry for 1 MB instead of 256 entries for the same memory as 4 kB pages — that is a 256× reduction in TLB pressure, and slide 35 tells you exactly what that is worth.</li>
<li><strong>Two levels, and the slide says precisely what each holds.</strong> <em>Level 1 table</em>: "descriptors that contain the base address and translation properties for a Section and Supersection" <em>and</em> "translation properties and pointers to a level 2 table for a large page or a small page". So a level-1 entry is either a <strong>leaf</strong> (section) or a <strong>pointer</strong> (to level 2) — which is why Figure 9.24(a) on slide 48 shows four alternative formats distinguished by their bottom two bits.</li>
<li><strong>The size claim you can verify.</strong> The slide says a level 2 table "Requires 1kB of memory". Check it: the L2 index in Figure 9.23 is 8 bits → 2<sup>8</sup> = 256 entries, and each descriptor is 4 bytes → 256 × 4 = <strong>1 024 bytes = 1 kB</strong> ✔. The slide's own arithmetic is consistent. By the same reasoning the level 1 table has 2<sup>12</sup> = 4 096 entries × 4 B = <strong>16 kB</strong>.</li>
<li><strong>Compare the strategy with x86.</strong> x86 offers two page sizes (4 KiB, 4 MiB); ARM offers four, and lets the bigger ones skip the second table level entirely. Same goal — fewer TLB entries and shallower walks for large mappings — reached with a more flexible mechanism.</li>
<li><strong>Who uses the big blocks.</strong> The kernel itself, framebuffers, device memory, and any large contiguous data region. Ordinary application pages stay at 4 kB, because the internal fragmentation of a 1 MB block would be intolerable for a small process.</li>
</ul>
<p class="pitfall">⚠️ The slide writes sizes as "16-MB", "1-MB", "64-kB", "4-kB" with decimal-looking prefixes, but the bit widths force powers of two: 1 MB here means 2<sup>20</sup> = 1 048 576 bytes, not 1 000 000. Keep the slide's wording when quoting it, but compute with powers of two.</p>
<p class="meo">💡 Remember the four by the ratio chain: <strong>4 kB → ×16 → 64 kB → ×16 → 1 MB → ×16 → 16 MB.</strong> Each step is exactly four more offset bits, so 12 → 16 → 20 → 24.</p>`,
        `<p class="y-chinh">🎯 Quyết định thiết kế của ARM, phát biểu trong một danh sách: "ARM hỗ trợ truy cập bộ nhớ dựa trên <strong>section hoặc page</strong>", và có bốn cỡ. Đây không phải bốn kích thước trang cho tiện — nó là một chiến lược có chủ đích để TLB phủ được nhiều bộ nhớ hơn với ít mục hơn.</p>
<table>
<tr><th>Tên (đúng chữ slide)</th><th>Kích thước</th><th>Số bit offset suy ra</th><th>Cần mấy mức bảng</th></tr>
<tr><td><strong>Supersections</strong> (tuỳ chọn)</td><td>"khối 16-MB của bộ nhớ chính"</td><td>24 bit (2<sup>24</sup> = 16 777 216)</td><td>Chỉ mức 1</td></tr>
<tr><td><strong>Sections</strong></td><td>"khối 1-MB của bộ nhớ chính"</td><td>20 bit (2<sup>20</sup> = 1 048 576)</td><td>Chỉ mức 1</td></tr>
<tr><td><strong>Large pages</strong></td><td>"khối 64-kB của bộ nhớ chính"</td><td>16 bit (2<sup>16</sup> = 65 536)</td><td>Mức 1 + mức 2</td></tr>
<tr><td><strong>Small pages</strong></td><td>"khối 4-kB của bộ nhớ chính"</td><td>12 bit (2<sup>12</sup> = 4 096)</td><td>Mức 1 + mức 2</td></tr>
</table>
<ul>
<li><strong>Slide tự nêu lý do, và đó là câu đáng gạch chân.</strong> "Section và supersection được hỗ trợ để cho phép ánh xạ <strong>một vùng bộ nhớ LỚN mà chỉ dùng MỘT mục duy nhất trong TLB</strong>." Một mục TLB cho 1 MB thay vì 256 mục cho cùng lượng bộ nhớ nếu chia trang 4 kB — tức giảm áp lực lên TLB 256 lần, và slide 35 cho bạn biết chính xác chuyện đó đáng giá bao nhiêu.</li>
<li><strong>Hai mức, và slide nói chính xác mỗi mức chứa gì.</strong> <em>Bảng mức 1</em>: "các mô tả chứa địa chỉ nền và các thuộc tính dịch cho Section và Supersection" <em>VÀ</em> "các thuộc tính dịch cùng con trỏ tới bảng mức 2 cho large page hoặc small page". Vậy một mục mức 1 hoặc là <strong>LÁ</strong> (section), hoặc là <strong>CON TRỎ</strong> (tới mức 2) — nên Figure 9.24(a) ở slide 48 mới vẽ bốn định dạng thay thế phân biệt nhau bằng hai bit đáy.</li>
<li><strong>Khẳng định về kích thước mà bạn kiểm được.</strong> Slide nói bảng mức 2 "cần 1kB bộ nhớ". Kiểm thử xem: chỉ mục L2 trong Figure 9.23 là 8 bit → 2<sup>8</sup> = 256 mục, mỗi mô tả 4 byte → 256 × 4 = <strong>1 024 byte = 1 kB</strong> ✔. Số học của chính slide là nhất quán. Theo cùng lập luận, bảng mức 1 có 2<sup>12</sup> = 4 096 mục × 4 B = <strong>16 kB</strong>.</li>
<li><strong>So chiến lược này với x86.</strong> x86 cho hai cỡ trang (4 KiB, 4 MiB); ARM cho bốn, và còn cho các cỡ lớn BỎ QUA hẳn mức bảng thứ hai. Cùng mục tiêu — ít mục TLB hơn và duyệt nông hơn cho các ánh xạ lớn — nhưng đạt bằng một cơ chế mềm dẻo hơn.</li>
<li><strong>Ai dùng các khối lớn.</strong> Chính cái nhân, vùng đệm khung hình, bộ nhớ thiết bị, và mọi vùng dữ liệu liền lớn. Trang của ứng dụng thường vẫn ở 4 kB, vì phân mảnh trong của một khối 1 MB là không chấp nhận được với một tiến trình nhỏ.</li>
</ul>
<p class="pitfall">⚠️ Slide viết kích thước là "16-MB", "1-MB", "64-kB", "4-kB" với tiền tố trông như thập phân, nhưng độ rộng bit ép chúng phải là luỹ thừa 2: 1 MB ở đây nghĩa là 2<sup>20</sup> = 1 048 576 byte, không phải 1 000 000. Cứ giữ nguyên chữ slide khi trích dẫn, nhưng TÍNH TOÁN thì dùng luỹ thừa 2.</p>
<p class="meo">💡 Nhớ bốn cỡ bằng chuỗi tỉ số: <strong>4 kB → ×16 → 64 kB → ×16 → 1 MB → ×16 → 16 MB.</strong> Mỗi bước đúng bằng thêm bốn bit offset, nên 12 → 16 → 20 → 24.</p>`],

      [47, 'Figure 9.23 — ARM Virtual Memory Address Translation for Small Pages',
        `<p class="y-chinh">🎯 The ARM two-level walk drawn end to end, for the 4 kB small-page case. The virtual address at the top is split <strong>31 | 19 | 11 | 0</strong> into <strong>L1 index</strong>, <strong>L2 index</strong> and <strong>page index</strong>, and the two tables below are drawn with their real sizes marked: the <strong>Level 1 (L1) page table</strong> runs 0…<strong>4095</strong>, the <strong>Level 2 (L2) page table</strong> runs 0…<strong>255</strong>.</p>
<table>
<tr><th>Field</th><th>Bits (as drawn)</th><th>Width</th><th>Entries it indexes</th></tr>
<tr><td><strong>L1 index</strong></td><td>31…20</td><td>12 bits</td><td>2<sup>12</sup> = <strong>4 096</strong> — matches the "4095" label ✔</td></tr>
<tr><td><strong>L2 index</strong></td><td>19…12</td><td>8 bits</td><td>2<sup>8</sup> = <strong>256</strong> — matches the "255" label ✔</td></tr>
<tr><td><strong>page index</strong></td><td>11…0</td><td>12 bits</td><td>2<sup>12</sup> = <strong>4 096 bytes</strong> — the "Small page (4 KB)" label on the right ✔</td></tr>
</table>
<p class="dap-an">✅ 12 + 8 + 12 = <strong>32 bits</strong>, the full virtual address — the figure is internally consistent, and every one of its three labels can be derived from the bit positions alone. Table sizes follow immediately: L1 = 4 096 × 4 B = <strong>16 kB</strong>, L2 = 256 × 4 B = <strong>1 kB</strong>, which is exactly what slide 46 claimed.</p>
<ul>
<li><strong>Follow the three arrows, one per field.</strong> L1 index selects an entry in the L1 table, drawn as "<strong>L2 PT base addr</strong>" with the bits <strong>01</strong> in its low corner — that 01 is the type code meaning "this entry points at a level 2 table". L2 index then selects an entry in the L2 table, drawn as "<strong>page base addr</strong>" with the bits <strong>10</strong> — the type code for a small page. Finally the page index runs across the top of the whole diagram and joins the page base to select the byte inside the 4 KB page in <strong>Main Memory</strong>.</li>
<li><strong>The two-bit type codes are doing real work.</strong> They are how one 32-bit descriptor format can mean four different things (fault, page table pointer, section, supersection at level 1). The hardware reads the bottom two bits first, then knows how to interpret the other 30. Figure 9.24 on slide 48 lays all four out.</li>
<li><strong>Compare directly with x86's 10 | 10 | 12 (slide 43).</strong> ARM uses <strong>12 | 8 | 12</strong>. ARM's first level is four times bigger (4 096 vs 1 024 entries) and its second level four times smaller (256 vs 1 024). Consequence: ARM's L1 table alone (16 kB) covers the whole 4 GiB in sections, and its L2 tables are cheap (1 kB) so allocating one for a sparse region wastes almost nothing.</li>
<li><strong>Notice that a section needs no second table at all.</strong> With a 1 MB section, the L1 index (12 bits) plus a 20-bit offset already accounts for all 32 bits — the L2 index bits become part of the offset. That is why slide 46 could say sections are resolved at level 1: it is forced by the arithmetic, not a special case.</li>
<li><strong>The walk costs two memory accesses before the data.</strong> Read the L1 entry, read the L2 entry, then read the byte — three accesses on a TLB miss, which is again the argument for the TLB block sitting inside the MMU in Figure 9.22.</li>
</ul>
<p class="meo">💡 To read any multi-level translation figure fast, do this in order: (1) read the bit boundaries off the top, (2) turn each field width into 2<sup>n</sup> entries, (3) check the numbers written beside the tables match, (4) only then follow the arrows. If step 3 fails, you misread a boundary.</p>`,
        `<p class="y-chinh">🎯 Phép duyệt hai mức của ARM vẽ trọn từ đầu tới cuối, cho ca trang nhỏ 4 kB. Địa chỉ ảo phía trên được chẻ theo mốc <strong>31 | 19 | 11 | 0</strong> thành <strong>L1 index</strong>, <strong>L2 index</strong> và <strong>page index</strong>, còn hai cái bảng bên dưới được vẽ kèm kích thước thật: <strong>Level 1 (L1) page table</strong> chạy 0…<strong>4095</strong>, <strong>Level 2 (L2) page table</strong> chạy 0…<strong>255</strong>.</p>
<table>
<tr><th>Trường</th><th>Bit (đúng như vẽ)</th><th>Độ rộng</th><th>Số mục nó đánh chỉ số</th></tr>
<tr><td><strong>L1 index</strong></td><td>31…20</td><td>12 bit</td><td>2<sup>12</sup> = <strong>4 096</strong> — khớp nhãn "4095" ✔</td></tr>
<tr><td><strong>L2 index</strong></td><td>19…12</td><td>8 bit</td><td>2<sup>8</sup> = <strong>256</strong> — khớp nhãn "255" ✔</td></tr>
<tr><td><strong>page index</strong></td><td>11…0</td><td>12 bit</td><td>2<sup>12</sup> = <strong>4 096 byte</strong> — khớp nhãn "Small page (4 KB)" bên phải ✔</td></tr>
</table>
<p class="dap-an">✅ 12 + 8 + 12 = <strong>32 bit</strong>, đúng cả địa chỉ ảo — hình tự nhất quán với chính nó, và cả ba cái nhãn của nó đều suy ra được chỉ từ vị trí bit. Kích thước bảng theo ngay sau đó: L1 = 4 096 × 4 B = <strong>16 kB</strong>, L2 = 256 × 4 B = <strong>1 kB</strong>, đúng y như slide 46 đã khẳng định.</p>
<ul>
<li><strong>Lần theo ba mũi tên, mỗi trường một cái.</strong> L1 index chọn ra một mục trong bảng L1, vẽ là "<strong>L2 PT base addr</strong>" với hai bit <strong>01</strong> ở góc thấp — cái 01 đó là MÃ LOẠI, nghĩa là "mục này trỏ tới một bảng mức 2". L2 index rồi chọn một mục trong bảng L2, vẽ là "<strong>page base addr</strong>" với hai bit <strong>10</strong> — mã loại của trang nhỏ. Cuối cùng page index chạy vắt ngang nóc sơ đồ để ghép với nền trang, chọn ra byte trong trang 4 KB ở <strong>Main Memory</strong>.</li>
<li><strong>Hai bit mã loại đang làm việc thật.</strong> Chúng là cách một định dạng mô tả 32 bit có thể mang bốn ý nghĩa khác nhau (lỗi, con trỏ bảng trang, section, supersection ở mức 1). Phần cứng đọc hai bit đáy trước, rồi mới biết diễn giải 30 bit còn lại thế nào. Figure 9.24 ở slide 48 bày cả bốn ra.</li>
<li><strong>So thẳng với 10 | 10 | 12 của x86 (slide 43).</strong> ARM dùng <strong>12 | 8 | 12</strong>. Mức một của ARM lớn gấp bốn (4 096 so với 1 024 mục) còn mức hai nhỏ hơn bốn lần (256 so với 1 024). Hệ quả: riêng bảng L1 của ARM (16 kB) đã phủ trọn 4 GiB nếu dùng section, và các bảng L2 của nó rẻ (1 kB) nên cấp một cái cho vùng thưa gần như không phí gì.</li>
<li><strong>Để ý một section KHÔNG cần bảng thứ hai nào.</strong> Với section 1 MB, L1 index (12 bit) cộng offset 20 bit đã đủ 32 bit — các bit L2 index trở thành một phần của offset. Đó là lý do slide 46 nói được rằng section giải xong ở mức 1: điều đó bị SỐ HỌC ép ra, chứ không phải một ngoại lệ đặc biệt.</li>
<li><strong>Phép duyệt tốn hai lần truy cập bộ nhớ TRƯỚC khi chạm dữ liệu.</strong> Đọc mục L1, đọc mục L2, rồi mới đọc byte — ba lần truy cập khi TLB trượt, lại chính là lập luận cho việc khối TLB nằm bên trong MMU ở Figure 9.22.</li>
</ul>
<p class="meo">💡 Muốn đọc nhanh mọi hình dịch địa chỉ nhiều mức, làm theo thứ tự: (1) đọc các mốc bit ghi phía trên, (2) đổi từng độ rộng trường thành 2<sup>n</sup> mục, (3) đối chiếu xem các con số ghi cạnh bảng có khớp không, (4) xong xuôi mới lần mũi tên. Bước 3 mà trật thì bạn đã đọc sai một cái mốc.</p>`],
      [48, 'Figure 9.24 — ARM Memory-Management Formats',
        `<p class="y-chinh">🎯 Three stacked panels: (a) the four <strong>first-level descriptor formats</strong>, (b) the three <strong>second-level descriptor formats</strong>, (c) the four <strong>virtual memory address formats</strong>. Panel (c) is the one to study for exams — it is slide 47's split, repeated for all four block sizes.</p>
<table>
<tr><th>Panel (c) — address format</th><th>Fields, as drawn</th><th>Widths</th></tr>
<tr><td><strong>Supersection</strong></td><td>Level 1 table index (31…24) | Supersection index (23…0)</td><td>8 + 24 = 32; offset 2<sup>24</sup> = <strong>16 MB</strong></td></tr>
<tr><td><strong>Section</strong></td><td>Level 1 table index (31…20) | Section index (19…0)</td><td>12 + 20 = 32; offset 2<sup>20</sup> = <strong>1 MB</strong></td></tr>
<tr><td><strong>Small page</strong></td><td>Level 1 table index (31…20) | Level 2 table index (19…12) | Page index (11…0)</td><td>12 + 8 + 12 = 32; page 2<sup>12</sup> = <strong>4 kB</strong></td></tr>
<tr><td><strong>Large page</strong></td><td>Level 1 table index (31…20) | Level 2 table index (19…16) | Page index (15…0)</td><td>12 + 4 + 16 = 32; page 2<sup>16</sup> = <strong>64 kB</strong></td></tr>
</table>
<p class="dap-an">✅ Every row sums to 32 and every offset width reproduces exactly the block size slide 46 listed — 16 MB, 1 MB, 4 kB, 64 kB. Notice what changes as the block grows: the offset field eats the fields above it. A supersection swallows four bits of the level-1 index (so 16 consecutive L1 entries describe one supersection); a large page swallows four bits of the level-2 index (so 16 consecutive L2 entries describe one large page). That replication is an implementation detail worth knowing: the hardware does not shrink the table, it repeats the entry.</p>
<ul>
<li><strong>Panel (a), the four first-level descriptors, all differ in their bottom two bits.</strong> <strong>Fault = 00</strong> (the rest is "IGN", ignored), <strong>Page table = 01</strong> (Coarse page table base address, plus P, Domain, SBZ), <strong>Section = 10</strong> (Section base address, plus SBZ, nG, S, AP, APX, TEX, AP, P, Domain, XN, C, B), <strong>Supersection = 10 with bit 18 set to 1</strong> (base address split across three pieces, including bits [35:32] and [39:36] — the extended physical address).</li>
<li><strong>Panel (b) is the same trick at level two.</strong> <strong>Fault = 00</strong>, <strong>Small page</strong> (ends "1 XN"), <strong>Large page = 01</strong>. Again, the bottom bits declare the type and the hardware reads them first.</li>
<li><strong>The supersection base bits [35:32] and [39:36] are quietly important.</strong> They push the physical address beyond 32 bits — a 40-bit physical address = 1 TiB of RAM behind a 32-bit virtual address space. That is ARM's Large Physical Address Extension in embryo, and it answers "how can a 32-bit chip have more than 4 GiB of memory?".</li>
<li><strong>Every protection bit you will meet on slide 49 is visible here.</strong> AP, APX, TEX, C, B, S, nG, XN, Domain, SBZ — they are packed into the same 32 bits as the address, which is exactly the x86 trick from Figure 9.20: page-aligned addresses leave the low bits free for flags.</li>
<li><strong>Domain is the field with no x86 counterpart.</strong> Four bits → 16 domains (slide 50). It is an extra layer of access control <em>between</em> the privilege level and the per-page AP bits, and it is what lets several processes share one translation table safely.</li>
</ul>
<p class="pitfall">⚠️ When an exam asks you to split an ARM virtual address, first ask <em>which block size</em>. The level-1 index is 12 bits for sections, small pages and large pages, but only <strong>8 bits</strong> for supersections. Splitting a supersection address with a 12-bit L1 index gives a wrong answer that still sums to 32, so the mistake is invisible unless you check the block size first.</p>`,
        `<p class="y-chinh">🎯 Ba bảng xếp chồng: (a) bốn <strong>định dạng mô tả mức một</strong>, (b) ba <strong>định dạng mô tả mức hai</strong>, (c) bốn <strong>định dạng địa chỉ bộ nhớ ảo</strong>. Bảng (c) mới là thứ phải học cho thi — nó chính là phép chẻ ở slide 47, lặp lại cho cả bốn cỡ khối.</p>
<table>
<tr><th>Bảng (c) — định dạng địa chỉ</th><th>Các trường, đúng như vẽ</th><th>Độ rộng</th></tr>
<tr><td><strong>Supersection</strong></td><td>Level 1 table index (31…24) | Supersection index (23…0)</td><td>8 + 24 = 32; offset 2<sup>24</sup> = <strong>16 MB</strong></td></tr>
<tr><td><strong>Section</strong></td><td>Level 1 table index (31…20) | Section index (19…0)</td><td>12 + 20 = 32; offset 2<sup>20</sup> = <strong>1 MB</strong></td></tr>
<tr><td><strong>Small page</strong></td><td>Level 1 table index (31…20) | Level 2 table index (19…12) | Page index (11…0)</td><td>12 + 8 + 12 = 32; trang 2<sup>12</sup> = <strong>4 kB</strong></td></tr>
<tr><td><strong>Large page</strong></td><td>Level 1 table index (31…20) | Level 2 table index (19…16) | Page index (15…0)</td><td>12 + 4 + 16 = 32; trang 2<sup>16</sup> = <strong>64 kB</strong></td></tr>
</table>
<p class="dap-an">✅ Dòng nào cũng cộng ra 32 và độ rộng offset nào cũng tái tạo đúng cỡ khối mà slide 46 đã liệt kê — 16 MB, 1 MB, 4 kB, 64 kB. Để ý thứ thay đổi khi khối lớn lên: trường offset ĂN DẦN các trường phía trên nó. Một supersection nuốt bốn bit của chỉ mục mức 1 (nên 16 mục L1 liên tiếp cùng mô tả một supersection); một large page nuốt bốn bit của chỉ mục mức 2 (nên 16 mục L2 liên tiếp cùng mô tả một large page). Việc nhân bản đó là chi tiết hiện thực đáng biết: phần cứng KHÔNG thu nhỏ bảng, nó LẶP LẠI cái mục.</p>
<ul>
<li><strong>Bảng (a), bốn mô tả mức một, phân biệt nhau bằng HAI BIT ĐÁY.</strong> <strong>Fault = 00</strong> (phần còn lại ghi "IGN" — bỏ qua), <strong>Page table = 01</strong> (Coarse page table base address, kèm P, Domain, SBZ), <strong>Section = 10</strong> (Section base address, kèm SBZ, nG, S, AP, APX, TEX, AP, P, Domain, XN, C, B), <strong>Supersection = 10 nhưng bit 18 đặt lên 1</strong> (địa chỉ nền chẻ làm ba mảnh, gồm cả bit [35:32] và [39:36] — phần địa chỉ vật lý mở rộng).</li>
<li><strong>Bảng (b) là cùng mánh đó ở mức hai.</strong> <strong>Fault = 00</strong>, <strong>Small page</strong> (kết thúc bằng "1 XN"), <strong>Large page = 01</strong>. Lại vậy: các bit đáy khai báo LOẠI và phần cứng đọc chúng trước.</li>
<li><strong>Các bit nền [35:32] và [39:36] của supersection lặng lẽ quan trọng.</strong> Chúng đẩy địa chỉ vật lý vượt quá 32 bit — địa chỉ vật lý 40 bit = 1 TiB RAM đứng sau một không gian địa chỉ ảo 32 bit. Đó là phôi thai của Large Physical Address Extension của ARM, và nó trả lời câu "làm sao một con chip 32 bit lại có hơn 4 GiB bộ nhớ?".</li>
<li><strong>Mọi bit bảo vệ mà slide 49 sẽ nói đều thấy được ở đây.</strong> AP, APX, TEX, C, B, S, nG, XN, Domain, SBZ — chúng bị nhồi vào cùng 32 bit với địa chỉ, đúng cái mánh của x86 ở Figure 9.20: địa chỉ căn theo trang nên các bit thấp rảnh ra cho cờ.</li>
<li><strong>Domain là trường KHÔNG có đối ứng bên x86.</strong> Bốn bit → 16 miền (slide 50). Nó là một tầng kiểm soát truy cập thêm nằm <em>GIỮA</em> mức đặc quyền và các bit AP của từng trang, và chính nó cho phép nhiều tiến trình dùng chung MỘT bảng dịch mà vẫn an toàn.</li>
</ul>
<p class="pitfall">⚠️ Khi đề bảo chẻ một địa chỉ ảo ARM, việc đầu tiên là hỏi <em>CỠ KHỐI NÀO</em>. Chỉ mục mức 1 là 12 bit với section, small page và large page, nhưng chỉ <strong>8 bit</strong> với supersection. Chẻ địa chỉ supersection bằng chỉ mục L1 12 bit sẽ cho đáp án SAI mà vẫn cộng đủ 32, nên lỗi này vô hình nếu bạn không kiểm cỡ khối trước.</p>`],

      [49, 'Table 9.6 — ARM Memory-Management Parameters',
        `<p class="y-chinh">🎯 The field dictionary for Figure 9.24, and the ARM counterpart of Table 9.5. Nine entries, and they divide into two jobs that ARM keeps separate: <strong>who may touch this memory</strong> (AP/APX, Domain, XN) and <strong>how the caches and write buffer should treat it</strong> (C, B, TEX, S).</p>
<table>
<tr><th>Field</th><th>The table's definition</th><th>Job</th></tr>
<tr><td><strong>AP, APX</strong> (Access Permission, Access Permission Extension)</td><td>"These bits control access to the corresponding memory region. If an access is made to an area of memory without the required permissions, a <strong>Permission Fault</strong> is raised."</td><td>Protection</td></tr>
<tr><td><strong>Domain</strong></td><td>"Collection of memory regions. Access control can be applied on the basis of domain."</td><td>Protection</td></tr>
<tr><td><strong>XN</strong> (Execute Never)</td><td>"Determines whether the region is executable (0) or not executable (1)."</td><td>Protection</td></tr>
<tr><td><strong>C</strong> (Cacheable)</td><td>"Determines whether this memory region can be mapped through the cache."</td><td>Caching</td></tr>
<tr><td><strong>B</strong> (Bufferable)</td><td>"Determines, with the TEX bits, how the write buffer is used for cacheable memory."</td><td>Caching</td></tr>
<tr><td><strong>TEX</strong> (Type Extension)</td><td>"These bits, together with the B and C bits, control accesses to the caches, how the write buffer is used, and if the memory region is shareable and therefore must be kept coherent."</td><td>Caching</td></tr>
<tr><td><strong>S</strong> (Shared)</td><td>"Determines whether the translation is for not-shared (0), or shared (1) memory."</td><td>Coherence</td></tr>
<tr><td><strong>nG</strong> (not Global)</td><td>"Determines whether the translation should be marked as global (0), or process specific (1)."</td><td>TLB management</td></tr>
<tr><td><strong>SBZ</strong></td><td>"Should be zero."</td><td>Reserved</td></tr>
</table>
<ul>
<li><strong>XN is a security feature, not an optimisation, and it is worth knowing why it exists.</strong> Marking the stack and the heap "execute never" means that even if an attacker overflows a buffer and writes machine code into it, the processor refuses to run it. This is the <em>NX bit</em> / DEP you may have heard of on x86. Protection bits in a page table are the front line of memory safety.</li>
<li><strong>nG is the answer to a problem slide 35 raised.</strong> A context switch invalidates every translation — unless entries are tagged. Marking a translation <em>global</em> (nG = 0) says "this mapping is the same for every process, keep it in the TLB across the switch", which is how the kernel's own mappings survive. Process-specific entries (nG = 1) carry an address-space ID instead of being flushed. Both tricks exist to protect the hit ratio in the table on slide 35.</li>
<li><strong>C, B and TEX together are the ARM equivalent of PCD and PWT (slide 42) — but finer.</strong> ARM needs more bits because it also encodes <em>shareability</em>, which matters on multicore: a region marked shared must be kept coherent between cores, a non-shared region need not be, and coherence traffic is expensive. That is Chapter 20/21 territory, decided per page here.</li>
<li><strong>Domain has no x86 equivalent and is the distinctive ARM idea.</strong> A domain is a named <em>set</em> of regions, and access can be granted or denied for the whole set at once, without editing any page's own AP bits. Slide 50 explains the two roles (client and manager) that make this useful.</li>
<li><strong>"SBZ — should be zero" is not filler.</strong> It reserves bits for future architecture versions. Software that writes garbage there works today and breaks on the next chip — which is why the specification says "should be zero" rather than "is ignored".</li>
</ul>
<p class="meo">💡 Group them and you will not forget them: <strong>AP/APX/XN/Domain = permission</strong>, <strong>C/B/TEX/S = cache and coherence</strong>, <strong>nG = TLB lifetime</strong>, <strong>SBZ = leave alone</strong>.</p>`,
        `<p class="y-chinh">🎯 Từ điển từng trường cho Figure 9.24, và là bản đối ứng bên ARM của Table 9.5. Chín mục, và chúng chia làm hai công việc mà ARM giữ tách bạch: <strong>ai được đụng vùng nhớ này</strong> (AP/APX, Domain, XN) và <strong>cache cùng bộ đệm ghi phải đối xử với nó thế nào</strong> (C, B, TEX, S).</p>
<table>
<tr><th>Trường</th><th>Định nghĩa trong bảng</th><th>Việc</th></tr>
<tr><td><strong>AP, APX</strong> (Access Permission, Access Permission Extension)</td><td>"Các bit này kiểm soát truy cập vào vùng nhớ tương ứng. Nếu truy cập vào một vùng nhớ mà không có quyền cần thiết thì một <strong>Permission Fault</strong> được nêu."</td><td>Bảo vệ</td></tr>
<tr><td><strong>Domain</strong></td><td>"Một tập hợp các vùng nhớ. Kiểm soát truy cập có thể áp theo miền."</td><td>Bảo vệ</td></tr>
<tr><td><strong>XN</strong> (Execute Never)</td><td>"Xác định vùng này có thực thi được (0) hay không thực thi được (1)."</td><td>Bảo vệ</td></tr>
<tr><td><strong>C</strong> (Cacheable)</td><td>"Xác định vùng nhớ này có được ánh xạ qua cache hay không."</td><td>Đệm</td></tr>
<tr><td><strong>B</strong> (Bufferable)</td><td>"Cùng với các bit TEX, xác định bộ đệm ghi được dùng thế nào cho bộ nhớ cache được."</td><td>Đệm</td></tr>
<tr><td><strong>TEX</strong> (Type Extension)</td><td>"Các bit này, cùng với bit B và C, kiểm soát truy cập vào cache, cách dùng bộ đệm ghi, và vùng nhớ có chia sẻ được hay không nên có phải giữ nhất quán hay không."</td><td>Đệm</td></tr>
<tr><td><strong>S</strong> (Shared)</td><td>"Xác định bản dịch này dành cho bộ nhớ KHÔNG chia sẻ (0) hay CÓ chia sẻ (1)."</td><td>Nhất quán</td></tr>
<tr><td><strong>nG</strong> (not Global)</td><td>"Xác định bản dịch được đánh dấu là toàn cục (0) hay riêng của tiến trình (1)."</td><td>Quản lý TLB</td></tr>
<tr><td><strong>SBZ</strong></td><td>"Nên bằng không."</td><td>Dành riêng</td></tr>
</table>
<ul>
<li><strong>XN là một tính năng BẢO MẬT chứ không phải tối ưu, và đáng biết vì sao nó có.</strong> Đánh dấu ngăn xếp và vùng heap là "không bao giờ thực thi" nghĩa là dù kẻ tấn công có tràn bộ đệm và ghi được mã máy vào đó, bộ xử lý vẫn từ chối chạy. Đây chính là <em>bit NX</em> / DEP mà bạn có thể đã nghe bên x86. Các bit bảo vệ trong bảng trang là tuyến đầu của an toàn bộ nhớ.</li>
<li><strong>nG là lời giải cho một vấn đề mà slide 35 đã nêu.</strong> Chuyển ngữ cảnh làm vô hiệu mọi bản dịch — trừ khi các mục có gắn nhãn. Đánh dấu một bản dịch là <em>toàn cục</em> (nG = 0) nghĩa là "ánh xạ này giống nhau với mọi tiến trình, cứ giữ trong TLB qua cả lần chuyển", và đó là cách các ánh xạ của chính nhân sống sót. Mục riêng theo tiến trình (nG = 1) thì mang mã định danh không gian địa chỉ thay vì bị xả đi. Cả hai mánh sinh ra để bảo vệ tỉ lệ trúng trong bảng ở slide 35.</li>
<li><strong>C, B và TEX gộp lại là tương đương của PCD và PWT bên x86 (slide 42) — nhưng MỊN HƠN.</strong> ARM cần nhiều bit hơn vì nó mã hoá thêm <em>khả năng chia sẻ</em>, thứ rất quan trọng trên đa lõi: vùng đánh dấu chia sẻ phải được giữ nhất quán giữa các lõi, vùng không chia sẻ thì khỏi, mà lưu lượng giữ nhất quán rất đắt. Đó là địa hạt Chương 20/21, ở đây được quyết định theo TỪNG TRANG.</li>
<li><strong>Domain không có đối ứng bên x86 và là ý tưởng đặc trưng của ARM.</strong> Một miền là một <em>TẬP</em> có tên gồm nhiều vùng nhớ, và quyền truy cập có thể cấp hay chặn cho cả tập cùng lúc, khỏi phải sửa các bit AP của từng trang. Slide 50 giải thích hai vai (client và manager) làm cho chuyện này có ích.</li>
<li><strong>"SBZ — nên bằng không" không phải chữ độn.</strong> Nó GIỮ CHỖ các bit cho các phiên bản kiến trúc tương lai. Phần mềm ghi rác vào đó thì hôm nay chạy được và vỡ ở con chip kế tiếp — chính vì thế đặc tả mới viết "nên bằng không" chứ không viết "bị bỏ qua".</li>
</ul>
<p class="meo">💡 Gom nhóm là không quên: <strong>AP/APX/XN/Domain = quyền</strong>, <strong>C/B/TEX/S = cache và nhất quán</strong>, <strong>nG = tuổi thọ trong TLB</strong>, <strong>SBZ = đừng đụng vào</strong>.</p>`],

      [50, 'Access Control (ARM) — permissions, domains, clients and managers',
        `<p class="y-chinh">🎯 ARM's protection model in words, and it has <strong>two independent layers</strong>: per-region <strong>AP bits</strong> (fine grained, like everyone else's) and the <strong>domain</strong> (coarse grained, ARM's own idea). Understanding why both exist is the point of the slide.</p>
<ul>
<li><strong>Layer 1 — the AP bits.</strong> "The AP access control bits in each table entry control access to a region of memory by a given process." A region may be designated <strong>No access</strong>, <strong>Read only</strong> or <strong>Read-write</strong>, and additionally "the region can be <strong>privileged access only</strong>, reserved for use by the OS and not by applications". So the same three permissions exist twice — once for privileged code, once for user code — which is the ARM equivalent of x86's US and RW bits (slide 42).</li>
<li><strong>Layer 2 — the domain.</strong> "A collection of sections and/or pages that have particular access permissions. The ARM architecture supports <strong>16 domains</strong>." Four bits in every descriptor (Figure 9.24) name which domain a region belongs to. Sixteen is small on purpose: a domain is a coarse grouping, not a per-object label.</li>
<li><strong>Why a second layer at all? The slide answers it directly.</strong> Domains "allow multiple processes to use the same translation tables while maintaining some protection from each other". That is the payoff: <em>one</em> set of tables shared by several processes, with a per-process domain register deciding which parts are live. No table rewriting, no TLB flush, just a register load on the context switch — cheap protection.</li>
<li><strong>The two kinds of domain access are the examinable pair.</strong> <strong>Clients</strong> are "users of domains that must observe the access permissions of the individual sections and/or pages that make up that domain". <strong>Managers</strong> "control the behavior of the domain and <strong>bypass the access permissions</strong> for table entries in that domain". So client = the AP bits are checked; manager = the AP bits are ignored.</li>
<li><strong>A manager is a dangerous privilege, and that is the intended reading.</strong> It exists so an OS can touch a process's memory without rewriting permissions — copying a buffer during a system call, for example. Grant it too widely and the per-page protections become decorative.</li>
</ul>
<table>
<tr><th></th><th>Client</th><th>Manager</th></tr>
<tr><td>AP bits of individual pages</td><td><strong>Checked</strong></td><td><strong>Bypassed</strong></td></tr>
<tr><td>Typical holder</td><td>An application process</td><td>The OS, for domains it must service</td></tr>
<tr><td>Effect of a violation</td><td>Permission Fault (Table 9.6) → Abort (Figure 9.22)</td><td>No fault — access proceeds</td></tr>
</table>
<p class="meo">💡 Picture a building: <strong>AP bits are the lock on each door</strong>, the <strong>domain is the floor a set of doors belongs to</strong>, a <strong>client carries a key for each door</strong>, and a <strong>manager carries a master key for the whole floor</strong>. That single image answers most questions on this slide.</p>
<p class="pitfall">⚠️ Do not merge domains with the x86 privilege levels of slide 39. Privilege level asks "<em>how trusted is the running code?</em>" and is ordered 0…3. A domain asks "<em>which group of regions is this?</em>" and is unordered — domain 5 is not more privileged than domain 4. They are orthogonal mechanisms, and ARM checks the domain first, then the AP bits.</p>`,
        `<p class="y-chinh">🎯 Mô hình bảo vệ của ARM kể bằng lời, và nó có <strong>HAI TẦNG ĐỘC LẬP</strong>: các <strong>bit AP</strong> theo từng vùng (mịn, ai cũng có) và <strong>MIỀN (domain)</strong> (thô, ý riêng của ARM). Hiểu vì sao phải có cả hai chính là trọng tâm của slide.</p>
<ul>
<li><strong>Tầng 1 — các bit AP.</strong> "Các bit kiểm soát truy cập AP trong mỗi mục bảng kiểm soát việc một tiến trình cho trước truy cập một vùng nhớ." Một vùng có thể được đặt là <strong>No access</strong> (cấm), <strong>Read only</strong> (chỉ đọc) hoặc <strong>Read-write</strong> (đọc-ghi), và thêm nữa "vùng đó có thể là <strong>chỉ truy cập ở mức đặc quyền</strong>, dành riêng cho HĐH dùng chứ không cho ứng dụng". Vậy cùng ba quyền ấy tồn tại hai lần — một cho mã đặc quyền, một cho mã người dùng — tức tương đương bit US và RW của x86 (slide 42).</li>
<li><strong>Tầng 2 — miền.</strong> "Một tập hợp các section và/hoặc page có các quyền truy cập cụ thể. Kiến trúc ARM hỗ trợ <strong>16 miền</strong>." Bốn bit trong mỗi mô tả (Figure 9.24) nêu tên miền mà vùng đó thuộc về. Con số mười sáu nhỏ là CỐ Ý: miền là một cách gom nhóm THÔ, không phải nhãn cho từng đối tượng.</li>
<li><strong>Sao lại cần tầng thứ hai? Slide trả lời thẳng.</strong> Miền "cho phép NHIỀU tiến trình dùng CHUNG một bộ bảng dịch mà vẫn giữ được mức bảo vệ nhất định giữa chúng". Đó là phần thưởng: <em>MỘT</em> bộ bảng dùng chung cho vài tiến trình, với một thanh ghi miền theo từng tiến trình quyết định phần nào đang sống. Không phải viết lại bảng, không phải xả TLB, chỉ nạp một thanh ghi khi chuyển ngữ cảnh — bảo vệ giá rẻ.</li>
<li><strong>Hai kiểu truy cập miền là cặp hay ra thi.</strong> <strong>Clients</strong> là "những người dùng miền, BẮT BUỘC phải tuân thủ quyền truy cập của từng section và/hoặc page tạo nên miền đó". <strong>Managers</strong> thì "điều khiển hành vi của miền và <strong>BỎ QUA các quyền truy cập</strong> của các mục bảng trong miền đó". Vậy client = các bit AP bị kiểm; manager = các bit AP bị phớt lờ.</li>
<li><strong>Manager là một đặc quyền NGUY HIỂM, và đó đúng là cách nên đọc.</strong> Nó tồn tại để HĐH đụng được vào bộ nhớ của tiến trình mà khỏi phải viết lại quyền — chẳng hạn chép một vùng đệm trong lúc phục vụ một lời gọi hệ thống. Cấp nó rộng quá thì các quyền theo từng trang chỉ còn là trang trí.</li>
</ul>
<table>
<tr><th></th><th>Client</th><th>Manager</th></tr>
<tr><td>Bit AP của từng trang</td><td><strong>ĐƯỢC KIỂM</strong></td><td><strong>BỊ BỎ QUA</strong></td></tr>
<tr><td>Ai thường giữ vai này</td><td>Một tiến trình ứng dụng</td><td>HĐH, với những miền nó phải phục vụ</td></tr>
<tr><td>Vi phạm thì sao</td><td>Permission Fault (Table 9.6) → Abort (Figure 9.22)</td><td>Không lỗi — truy cập trót lọt</td></tr>
</table>
<p class="meo">💡 Hình dung một toà nhà: <strong>bit AP là ổ khoá của từng cánh cửa</strong>, <strong>miền là cái TẦNG mà một nhóm cửa thuộc về</strong>, <strong>client cầm chìa cho từng cửa</strong>, còn <strong>manager cầm chìa vạn năng của cả tầng</strong>. Riêng hình ảnh đó trả lời được phần lớn câu hỏi về slide này.</p>
<p class="pitfall">⚠️ Đừng gộp miền với các mức đặc quyền x86 ở slide 39. Mức đặc quyền hỏi "<em>mã đang chạy được tin tới đâu?</em>" và có thứ tự 0…3. Miền hỏi "<em>đây là nhóm vùng nhớ nào?</em>" và KHÔNG có thứ tự — miền 5 không đặc quyền hơn miền 4. Chúng là hai cơ chế trực giao, và ARM kiểm MIỀN trước, rồi mới kiểm bit AP.</p>`],

      [51, 'Summary — Chapter 9: Operating System Support',
        `<p class="y-chinh">🎯 The chapter's own table of contents, in two columns, and it is the best revision checklist you will get. Left column: <strong>Operating system overview</strong> (objectives and functions, types of operating systems), <strong>Scheduling</strong> (long-, medium-, short-term), <strong>Intel x86 memory management</strong> (address space, segmentation, paging). Right column: <strong>Memory management</strong> (swapping, partitioning, paging, virtual memory, translation lookaside buffer, segmentation) and <strong>ARM memory management</strong> (memory system organization, virtual memory address translation, memory-management formats, access control).</p>
<ul>
<li><strong>Everything in the right column plus the x86 block is what slides 27–51 covered.</strong> Map it back: swapping (27) · partitioning (28–29) · paging (30–31) · virtual memory (32–33) · TLB (34–35) · segmentation (36, 38–39) · x86 (37, 40–44) · ARM (45–50). If you can say one sentence about each of those eight, you have the half-chapter.</li>
<li><strong>The single thread running through all of it.</strong> Every mechanism in this half is one answer to "a program's addresses are not memory's addresses". Partitioning translates with base+bounds; paging translates with a table; segmentation translates with a descriptor; the TLB caches translations; x86 and ARM stack two or three of these together. Learn the thread and the list stops being a list.</li>
<li><strong>The one exam skill to rehearse.</strong> Splitting a virtual address. You have four worked examples in this lesson (slides 30, 31, 33, 34) covering 16/32/48-bit addresses and 1 KiB/4 KiB/8 KiB pages, plus x86's 10|10|12 (slide 44) and ARM's 12|8|12 (slide 47). The procedure is always the same three lines: offset = log<sub>2</sub>(page size) · page-number bits = address bits − offset · entries = 2<sup>page-number bits</sup>.</li>
<li><strong>The one formula to rehearse.</strong> Effective access time. EAT = fast path + (miss rate) × (extra cost). It appears three times in this chapter with different units — TLB (slide 35), page faults (slide 32), and the multi-level walk (slide 43) — and it is the same equation you used in Chapter 4 for cache.</li>
<li><strong>What comes next in this course.</strong> Chapter 12/13 return to the instruction set the OS runs on; Chapter 16 revisits the "return to the faulted instruction" problem from slide 34 as an interrupt/exception issue; Chapters 20–21 pick up the shareability and coherence bits of Table 9.6 as a multicore problem. This chapter is where the hardware/software boundary is drawn, and the rest of the course keeps referring back to it.</li>
</ul>
<table>
<tr><th>Problem</th><th>Mechanism</th><th>Fixes</th><th>Introduces</th></tr>
<tr><td>Not enough memory for all jobs</td><td>Swapping (27)</td><td>More live processes than RAM</td><td>Disk-speed context changes</td></tr>
<tr><td>How to divide memory</td><td>Fixed partitioning (28)</td><td>Simplicity</td><td><strong>Internal</strong> fragmentation, hard size ceiling</td></tr>
<tr><td>Wasted space in partitions</td><td>Dynamic partitioning (29)</td><td>Internal fragmentation</td><td><strong>External</strong> fragmentation, need for compaction</td></tr>
<tr><td>Scattered holes</td><td>Paging (30–31)</td><td>External fragmentation entirely</td><td>A per-process table, a lookup per access</td></tr>
<tr><td>Process bigger than RAM</td><td>Virtual memory (32)</td><td>The size ceiling for good</td><td>Page faults, replacement, <strong>thrashing</strong></td></tr>
<tr><td>Page table too big</td><td>Inverted (33) / two-level (43)</td><td>Table size — 204,8× in the slide-43 case</td><td>Hashing and chains / deeper walks</td></tr>
<tr><td>Two memory accesses per reference</td><td>TLB (34–35)</td><td>The 2× penalty → about 1 % at h = 99 %</td><td>Flushes on context switch (nG, ASIDs)</td></tr>
<tr><td>Protection and program structure</td><td>Segmentation (36–39)</td><td>Logical sharing and protection</td><td>External fragmentation again → so combine with paging</td></tr>
</table>
<p class="meo">💡 Revise this half-chapter by <em>redrawing</em> three figures from memory: 9.16 (one translation), 9.18 (the TLB flowchart) and 9.21 (the x86 pipeline). If you can draw those three with correct labels, you can answer almost anything the chapter asks.</p>`,
        `<p class="y-chinh">🎯 Mục lục do chính chương tự viết, bày thành hai cột, và đây là bảng kiểm ôn tập tốt nhất bạn sẽ có. Cột trái: <strong>Tổng quan hệ điều hành</strong> (mục tiêu và chức năng, các loại HĐH), <strong>Lập lịch</strong> (dài hạn, trung hạn, ngắn hạn), <strong>Quản lý bộ nhớ Intel x86</strong> (không gian địa chỉ, phân đoạn, phân trang). Cột phải: <strong>Quản lý bộ nhớ</strong> (hoán đổi, phân vùng, phân trang, bộ nhớ ảo, TLB, phân đoạn) và <strong>Quản lý bộ nhớ ARM</strong> (tổ chức hệ thống nhớ, dịch địa chỉ bộ nhớ ảo, định dạng quản lý bộ nhớ, kiểm soát truy cập).</p>
<ul>
<li><strong>Toàn bộ cột phải cộng với khối x86 chính là thứ slide 27–51 đã đi qua.</strong> Ánh xạ lại: hoán đổi (27) · phân vùng (28–29) · phân trang (30–31) · bộ nhớ ảo (32–33) · TLB (34–35) · phân đoạn (36, 38–39) · x86 (37, 40–44) · ARM (45–50). Nói được một câu về từng cái trong tám cái đó là bạn đã nắm nửa chương.</li>
<li><strong>Sợi chỉ xuyên suốt tất cả.</strong> Mọi cơ chế ở nửa này đều là MỘT câu trả lời cho "địa chỉ của chương trình không phải địa chỉ của bộ nhớ". Phân vùng dịch bằng nền+biên; phân trang dịch bằng bảng; phân đoạn dịch bằng mô tả; TLB đệm lại các bản dịch; x86 và ARM chồng hai ba thứ đó lên nhau. Nắm sợi chỉ thì danh sách thôi còn là danh sách.</li>
<li><strong>MỘT kỹ năng thi phải luyện.</strong> Chẻ địa chỉ ảo. Trong bài này bạn có bốn bài giải trọn (slide 30, 31, 33, 34) phủ địa chỉ 16/32/48 bit và trang 1 KiB/4 KiB/8 KiB, cộng 10|10|12 của x86 (slide 44) và 12|8|12 của ARM (slide 47). Quy trình luôn là ba dòng: offset = log<sub>2</sub>(kích thước trang) · số bit số trang = số bit địa chỉ − offset · số mục = 2<sup>số bit số trang</sup>.</li>
<li><strong>MỘT công thức phải luyện.</strong> Thời gian truy cập hiệu dụng. EAT = đường nhanh + (tỉ lệ trượt) × (chi phí phụ trội). Nó xuất hiện ba lần trong chương với ba bộ đơn vị — TLB (slide 35), lỗi trang (slide 32), và duyệt nhiều mức (slide 43) — và đúng là phương trình bạn đã dùng cho cache ở Chương 4.</li>
<li><strong>Tiếp theo trong môn này là gì.</strong> Chương 12/13 quay lại tập lệnh mà HĐH chạy trên đó; Chương 16 gặp lại bài toán "quay về lệnh gây lỗi" của slide 34 dưới dạng vấn đề ngắt/ngoại lệ; Chương 20–21 nhặt lại các bit chia sẻ và nhất quán của Table 9.6 như một bài toán đa lõi. Chương này là nơi kẻ lằn ranh phần cứng/phần mềm, và phần còn lại của môn cứ chỉ ngược về đây mãi.</li>
</ul>
<table>
<tr><th>Vấn đề</th><th>Cơ chế</th><th>Chữa được</th><th>Đẻ ra</th></tr>
<tr><td>Không đủ bộ nhớ cho mọi việc</td><td>Hoán đổi (27)</td><td>Nuôi nhiều tiến trình hơn RAM</td><td>Đổi ngữ cảnh ở tốc độ đĩa</td></tr>
<tr><td>Chia bộ nhớ thế nào</td><td>Phân vùng cố định (28)</td><td>Sự đơn giản</td><td>Phân mảnh <strong>TRONG</strong>, trần kích thước cứng</td></tr>
<tr><td>Phí chỗ trong phân vùng</td><td>Phân vùng động (29)</td><td>Phân mảnh trong</td><td>Phân mảnh <strong>NGOÀI</strong>, phải dồn nén</td></tr>
<tr><td>Các lỗ vụn rải rác</td><td>Phân trang (30–31)</td><td>Phân mảnh ngoài, dứt điểm</td><td>Mỗi tiến trình một bảng, mỗi truy cập một lần tra</td></tr>
<tr><td>Tiến trình lớn hơn RAM</td><td>Bộ nhớ ảo (32)</td><td>Trần kích thước, vĩnh viễn</td><td>Lỗi trang, thay trang, <strong>thrashing</strong></td></tr>
<tr><td>Bảng trang quá to</td><td>Nghịch đảo (33) / hai mức (43)</td><td>Kích thước bảng — 204,8 lần ở ca slide 43</td><td>Băm và chuỗi / duyệt sâu hơn</td></tr>
<tr><td>Mỗi tham chiếu hai lần truy cập</td><td>TLB (34–35)</td><td>Hình phạt 2× → còn khoảng 1 % ở h = 99 %</td><td>Phải xả khi đổi ngữ cảnh (nG, ASID)</td></tr>
<tr><td>Bảo vệ và cấu trúc chương trình</td><td>Phân đoạn (36–39)</td><td>Dùng chung và bảo vệ theo logic</td><td>Lại phân mảnh ngoài → nên phải kết hợp với phân trang</td></tr>
</table>
<p class="meo">💡 Ôn nửa chương này bằng cách <em>VẼ LẠI</em> ba cái hình từ trí nhớ: 9.16 (một lần dịch), 9.18 (lưu đồ TLB) và 9.21 (đường ống x86). Vẽ được ba hình đó với nhãn đúng là bạn trả lời được gần như mọi thứ chương này hỏi.</p>`],

    ]),
  ].join('\n'),
};
