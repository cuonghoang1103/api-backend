/**
 * CEA201 · Chương 6 theo syllabus trường = deck 'cea7' của bản 11e —
 * External Memory, học theo từng slide, PHẦN A: slide 1–21 / 42.
 *
 * ⚠️ ĐÁNH SỐ: syllabus trường theo bản 9th ed gọi phần này là "Chapter 6 —
 * External Memory"; bộ slide là 11th ed nên in "Chapter 7". Cùng một nội dung.
 * Xem bảng quy đổi trong _slides.mjs.
 *
 * ⚠️ PHẠM VI THẬT của slide 1–21 (đọc từ /tmp/cea201-text/cea7.txt, KHÔNG suy
 * đoán): slide 2–13 là ĐĨA TỪ (vật liệu, cơ chế đọc/ghi, bố trí dữ liệu, định
 * dạng sector, đặc tính vật lý, THAM SỐ HIỆU NĂNG, Table 7.2), rồi slide 14–21
 * đã BẮT ĐẦU SANG RAID (giới thiệu, Table 7.3, Figure 7.6 a→g, Figure 7.7, và
 * chữ của RAID 0, RAID 1, RAID 2). Tức phần này KHÔNG chỉ có đĩa từ.
 * Gợi ý đổi tiêu đề/slug đã ghi trong báo cáo bàn giao.
 *
 * Slide chỉ có tiêu đề + hình/bảng (3, 4, 5, 6, 7, 8, 11, 13, 16, 17, 18) đã
 * được ĐỌC THẲNG TỪ ẢNH render /tmp/cea201-slides/cea7/NNN.webp.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · Đổi đơn vị: 7200 rpm = 120 vòng/s = 8,3333 ms/vòng ⇒ nửa vòng 4,1667 ms.
 *     15 030 rpm → 3,992 ms/vòng, nửa vòng 1,996 ms. 5400 rpm → 11,1111 ms,
 *     nửa vòng 5,5556 ms. Cả ba khớp cột "Average latency" của Table 7.2.
 *   · Bài 1: seek 8 + 4,1667 + 512/(120×262144) s = 12,183 ms; phần truyền chỉ
 *     0,1336 % tổng, tức seek+quay chiếm 99,87 %.
 *   · Bài 2 (trọn 1 track): 8 + 4,1667 + 8,3333 = 20,5 ms → 12,787 MB/s so với
 *     đỉnh 31,457 MB/s, hiệu suất 40,65 %.
 *   · Bài 3 (ví dụ của chính Stallings): 2500 sector × 512 B, seek 4 ms,
 *     7500 rpm, 500 sector/track → TUẦN TỰ 64 ms, NGẪU NHIÊN 20 040 ms.
 *     Tỉ số 313,12 lần. 20,0 MB/s so với 62,4 kB/s.
 *   · Bài 4 (1 MiB): 256 khối 4 kB ngẫu nhiên = 3148,01 ms; tuần tự = 45,5 ms.
 *     Tỉ số 69,19 lần. IOPS ngẫu nhiên 81,32.
 *   · Bài 5 (SSD NVMe 0,02 ms): 12,183/0,02 = 608,7 lần; 12,2969/0,02 = 614,8
 *     lần; 50 000 IOPS so với 81,3 IOPS.
 *   · Bài 6: cylinder 8 track = 2 MiB trong 78,833 ms → 26,602 MB/s.
 *   · Figure 7.4: 15+512+50 = 577 B (hiệu suất 88,73 %); 15+4096+100 = 4211 B
 *     (97,27 %); 8 sector cũ = 4616 B so với 1 sector AF = 4211 B → tiết kiệm
 *     405 B = 8,77 % mặt đĩa. ECC 9,77 % so với 2,44 %.
 *   · Figure 7.3: đĩa r trong 1,5 cm / ngoài 4,4 cm → MZR gấp 1,967 lần CAV,
 *     tức CAV bỏ phí 49,15 % diện tích ghi được.
 *   · Hamming (2^m ≥ N+m+1): N=4→m=3 (đúng Figure 7.6c: b0..b3 + f0,f1,f2),
 *     N=8→m=4, N=16→m=5, N=32→m=6, N=64→m=7. Tỉ lệ dư 42,9 % → 9,9 %.
 *   · Chi phí dung lượng N=4 đĩa: RAID 0 100 %, RAID 1 50 %, RAID 2 57,1 %,
 *     RAID 3/4/5 80 %, RAID 6 66,7 %.
 *
 * Chỗ slide gốc SAI hoặc LỖI THỜI — nêu rõ trong bài, KHÔNG im lặng chép lại,
 * cũng KHÔNG tự ý sửa slide:
 *   · Table 7.2 (slide 13): "Maximum sustained transfer rate" ghi 1,2 GB/s cho
 *     ổ 15 030 rpm và 3 GB/s cho ổ laptop 5400 rpm. BẤT KHẢ THI — đó là tốc độ
 *     GIAO TIẾP (SAS 12 Gb/s, SATA 3 Gb/s), không phải tốc độ đọc liên tục của
 *     mặt đĩa; ổ 5400 rpm cần track chứa ~33 MB mới đạt 3 GB/s.
 *   · Table 7.2: ô "Average latency" của cột đầu ghi "4.16" KHÔNG CÓ ĐƠN VỊ
 *     (phải là 4,16 ms); và "3.5 in (8.89 cm)s" dư một chữ "s".
 *   · Figure 7.4 (slide 7): khung (b) mang chú thích "Advanced Format 4k-byte
 *     sector" nhưng nhãn kích thước ở giữa lại ghi "512 bytes". Mâu thuẫn với
 *     chính chú thích; phải là 4096 byte (nếu đúng 512 B thật thì hiệu suất chỉ
 *     81,66 %, TỆ HƠN khuôn dạng cũ — vô lý).
 *   · slide 12: "Bloc access time" thiếu chữ k (Block access time), và dòng
 *     "the read or write operation is then / performed" bị ngắt đôi.
 *   · slide 36 (ngoài phạm vi bài này) tiêu đề dính liền — không ảnh hưởng.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea7';

export default {
  title: '6.0a — Slide by slide: Magnetic disks and the start of RAID (slides 1–21)|||6.0a — Slide bài giảng: Đĩa từ & bước vào RAID — cấu tạo, hiệu năng, RAID 0/1/2 (slide 1–21)',
  slug: 'cea201-6-0a-slides-dia-tu-va-raid-0-1-2',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương Bộ nhớ ngoài của CEA201 (slide 1–21 của deck 42 slide, bản Stallings 11e). Đi từ vật liệu đĩa và cơ chế đọc/ghi từ tính, qua bố trí dữ liệu (track · sector · cylinder), hai cách chia sector (CAV và ghi nhiều vùng), khuôn dạng sector cũ 512 B so với Advanced Format 4 kB, bảng đặc tính vật lý và phân loại đầu đọc Winchester, tới TRỌNG TÂM ĐỀ THI: thời gian truy cập khối = seek + độ trễ quay + thời gian truyền, giải trọn sáu bài có bảng từng bước, trong đó có cặp đối chiếu đọc tuần tự so với đọc ngẫu nhiên chênh nhau 313 lần. Phần cuối bước sang RAID: ba đặc điểm chung, Table 7.3, Figure 7.6/7.7 và chữ của RAID 0, 1, 2. Mọi con số đã kiểm bằng máy, và những chỗ slide gốc ghi sai đều được nêu thẳng.',
  content: [
    walkHead(D, 1, 21),
    walk(D, [

      [1, 'Chapter 7 — External Memory (title slide, Stallings 11th Edition Global Edition)',
        `<p class="y-chinh">🎯 The chapter where memory stops being <strong>addressable by the processor</strong> and becomes a <strong>device you talk to through an I/O module</strong>. Everything in Chapters 4–6 could be reached with a load instruction; nothing in Chapter 7 can.</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Your syllabus follows the 9th edition and calls this block <strong>"Chapter 6 — External Memory"</strong>; the slide deck is the 11th edition and prints <strong>"Chapter 7"</strong>. Same content, different label. Do not panic when the slide number and the timetable disagree.</li>
<li><strong>What "external" actually means.</strong> Three things at once: (1) it is <em>non-volatile</em> — it survives power off; (2) it is <em>not in the address space</em> — the CPU cannot <code>mov</code> from it, it must issue an I/O request; (3) it is <em>block-oriented</em> — the smallest thing you can move is a sector, never a byte.</li>
<li><strong>The whole deck in five topics.</strong> Magnetic disk (slides 2–13) · RAID (14–26) · solid state drives (27–30) · optical memory (31–38) · magnetic tape (39–41). Slide 42 is the summary and lists exactly those five. <strong>This lesson covers slides 1–21</strong>: all of magnetic disk, plus the RAID introduction and levels 0, 1, 2.</li>
<li><strong>The one number to carry into the chapter.</strong> Cache answers in <em>nanoseconds</em>, DRAM in <em>tens of nanoseconds</em>, a magnetic disk in <em>milliseconds</em>. That is a factor of roughly a million. Every design idea in this chapter — block transfers, caching, striping, sequential layout — exists to avoid paying that factor more often than necessary.</li>
<li><strong>Where it plugs in.</strong> Ch.4 drew the hierarchy and put disk at the bottom; this chapter fills in what the bottom is made of. Ch.5 (cache) and Ch.6 (internal memory) handled the fast half. Ch.8 (I/O) will explain the <em>mechanism</em> — DMA, interrupts — by which these requests actually travel. CSI106 chapter 10 (file access methods) and PRF192 chapter 10 (<code>fseek</code>) are the software face of the same hardware.</li>
</ul>
<p class="meo">💡 One sentence to keep for the whole chapter: <strong>on a magnetic disk, moving the head costs everything and moving the data costs almost nothing.</strong> Slide 11 turns that sentence into a formula and this lesson turns the formula into six worked problems.</p>`,
        `<p class="y-chinh">🎯 Chương mà bộ nhớ thôi <strong>được bộ xử lý đánh địa chỉ</strong> và trở thành <strong>một THIẾT BỊ phải nói chuyện qua module vào/ra</strong>. Mọi thứ trong Chương 4–6 đều với tới được bằng một lệnh load; không thứ gì trong Chương 7 làm được vậy.</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Syllabus trường theo bản 9th ed nên gọi khối này là <strong>"Chapter 6 — External Memory"</strong>; bộ slide là bản 11th ed nên in <strong>"Chapter 7"</strong>. Cùng một nội dung, khác nhãn. Đừng hoảng khi số trên slide lệch với thời khoá biểu.</li>
<li><strong>"Ngoài" thật ra nghĩa là gì.</strong> Ba điều cùng lúc: (1) <em>KHÔNG BAY HƠI</em> — tắt điện vẫn còn; (2) <em>KHÔNG nằm trong không gian địa chỉ</em> — CPU không <code>mov</code> từ đó được, phải phát một yêu cầu I/O; (3) <em>theo KHỐI</em> — đơn vị nhỏ nhất chuyển được là một sector, không bao giờ là một byte.</li>
<li><strong>Trọn deck gói trong năm chủ đề.</strong> Đĩa từ (slide 2–13) · RAID (14–26) · ổ thể rắn SSD (27–30) · bộ nhớ quang (31–38) · băng từ (39–41). Slide 42 là tổng kết và liệt kê đúng năm mục đó. <strong>Bài này đi slide 1–21</strong>: trọn phần đĩa từ, cộng phần giới thiệu RAID và các mức 0, 1, 2.</li>
<li><strong>Con số duy nhất cần mang theo suốt chương.</strong> Cache trả lời trong <em>nano giây</em>, DRAM trong <em>vài chục nano giây</em>, đĩa từ trong <em>MILI giây</em>. Chênh khoảng MỘT TRIỆU lần. Mọi ý tưởng thiết kế trong chương này — truyền theo khối, đệm, chia dải (striping), sắp dữ liệu liền mạch — đều sinh ra để khỏi phải trả cái hệ số đó nhiều lần hơn mức cần thiết.</li>
<li><strong>Nó cắm vào đâu.</strong> Ch.4 vẽ cái phân cấp và đặt đĩa ở đáy; chương này lấp xem cái đáy ấy làm bằng gì. Ch.5 (cache) và Ch.6 (bộ nhớ trong) lo nửa nhanh. Ch.8 (vào/ra) sẽ giải thích <em>CƠ CHẾ</em> — DMA, ngắt — mà mấy yêu cầu này thật sự đi qua. CSI106 chương 10 (phương thức truy cập tệp) và PRF192 chương 10 (<code>fseek</code>) chính là bộ mặt phần mềm của đúng phần cứng này.</li>
</ul>
<p class="meo">💡 Một câu giữ cho cả chương: <strong>trên đĩa từ, DI CHUYỂN ĐẦU ĐỌC tốn tất cả, còn CHUYỂN DỮ LIỆU gần như không tốn gì.</strong> Slide 11 biến câu đó thành công thức, và bài này biến công thức thành sáu bài giải trọn.</p>`],

      [2, 'Magnetic Disk — substrate material, and why glass replaced aluminium',
        `<p class="y-chinh">🎯 The physical definition the exam wants word for word: <strong>a disk is a circular platter constructed of nonmagnetic material, called the SUBSTRATE, coated with a MAGNETIZABLE material.</strong> The substrate carries nothing; the coating carries every bit.</p>
<ul>
<li><strong>Two words, two jobs.</strong> <em>Substrate</em> = the rigid, non-magnetic disc — the plate. <em>Coating</em> = the thin magnetizable film sprayed on it — the actual storage. Traditionally the substrate was aluminium or an aluminium alloy; <strong>recently glass substrates have been introduced</strong>.</li>
<li><strong>The slide lists five benefits of glass — memorise them as one story, not five bullets.</strong> Glass is <em>smoother</em> and <em>stiffer</em> than aluminium, and both properties pay off twice.</li>
</ul>
<table>
<tr><th>Benefit on the slide</th><th>Which physical property causes it</th><th>What it buys the drive</th></tr>
<tr><td>Improvement in the <strong>uniformity</strong> of the magnetic film surface</td><td>Smoother substrate</td><td>Increased disk <em>reliability</em></td></tr>
<tr><td>Significant reduction in overall <strong>surface defects</strong></td><td>Smoother substrate</td><td>Fewer read-write <em>errors</em></td></tr>
<tr><td>Ability to support <strong>lower fly heights</strong></td><td>Flatter surface</td><td>Head sits closer ⇒ <em>higher density</em> (see slide 10)</td></tr>
<tr><td>Better <strong>stiffness</strong></td><td>Higher Young's modulus</td><td>Reduces disk <em>dynamics</em> — less wobble at speed</td></tr>
<tr><td>Greater ability to <strong>withstand shock and damage</strong></td><td>Stiffness + hardness</td><td>Survives being knocked — matters for laptops</td></tr>
</table>
<ul>
<li><strong>Why "lower fly height" is the money item.</strong> Slide 10 states the rule explicitly: the narrower the head, the closer it must be to the platter to work, and narrower heads mean narrower tracks and therefore <em>greater data density</em>. Glass lets you fly lower, so glass lets you store more. Every other benefit is insurance; this one is capacity.</li>
<li><strong>Connect to Ch.6.</strong> Internal memory stored a bit as charge in a capacitor (DRAM) or a latch (SRAM), and both vanish without power. Here a bit is the <em>direction of magnetisation</em> of a tiny patch of coating — it needs no power to persist. That single physical difference is the whole reason external memory is non-volatile.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: the substrate is <strong>nonmagnetic</strong>. A question claiming "data is stored in the aluminium substrate" is wrong — data lives only in the coating. The substrate is structural.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa vật lý mà đề thi muốn đúng từng chữ: <strong>đĩa là một tấm đĩa TRÒN làm bằng vật liệu KHÔNG TỪ TÍNH, gọi là ĐẾ (substrate), phủ lên trên một lớp vật liệu CÓ THỂ TỪ HOÁ.</strong> Đế không mang gì cả; lớp phủ mới mang từng bit.</p>
<ul>
<li><strong>Hai chữ, hai việc.</strong> <em>Substrate (đế)</em> = tấm đĩa cứng, không từ tính — cái mâm. <em>Coating (lớp phủ)</em> = màng mỏng từ hoá được phun lên nó — chỗ chứa dữ liệu thật. Truyền thống đế làm bằng nhôm hoặc hợp kim nhôm; <strong>gần đây đã đưa vào đế THUỶ TINH</strong>.</li>
<li><strong>Slide liệt kê năm lợi ích của thuỷ tinh — nhớ thành MỘT câu chuyện, đừng nhớ thành năm gạch rời.</strong> Thuỷ tinh <em>NHẴN hơn</em> và <em>CỨNG hơn</em> nhôm, và mỗi tính chất ăn tiền hai lần.</li>
</ul>
<table>
<tr><th>Lợi ích slide ghi</th><th>Tính chất vật lý nào sinh ra</th><th>Ổ đĩa được gì</th></tr>
<tr><td>Cải thiện <strong>ĐỘ ĐỒNG ĐỀU</strong> của bề mặt màng từ</td><td>Đế nhẵn hơn</td><td>Tăng <em>ĐỘ TIN CẬY</em> của đĩa</td></tr>
<tr><td>Giảm mạnh <strong>KHUYẾT TẬT BỀ MẶT</strong></td><td>Đế nhẵn hơn</td><td>Ít <em>LỖI đọc-ghi</em> hơn</td></tr>
<tr><td>Cho phép <strong>ĐỘ CAO BAY THẤP HƠN</strong></td><td>Bề mặt phẳng hơn</td><td>Đầu đọc sát hơn ⇒ <em>MẬT ĐỘ CAO HƠN</em> (xem slide 10)</td></tr>
<tr><td><strong>ĐỘ CỨNG</strong> tốt hơn</td><td>Mô đun đàn hồi lớn hơn</td><td>Giảm <em>dao động</em> của đĩa — bớt rung khi quay nhanh</td></tr>
<tr><td>Chịu <strong>VA ĐẬP và hư hỏng</strong> tốt hơn</td><td>Cứng + rắn</td><td>Va quệt vẫn sống — quan trọng với laptop</td></tr>
</table>
<ul>
<li><strong>Vì sao "bay thấp hơn" mới là mục ăn tiền.</strong> Slide 10 nói thẳng quy tắc: đầu đọc càng HẸP thì càng phải sát mặt đĩa mới hoạt động được, mà đầu hẹp nghĩa là track hẹp, tức <em>MẬT ĐỘ DỮ LIỆU CAO HƠN</em>. Thuỷ tinh cho bay thấp hơn, nên thuỷ tinh cho chứa nhiều hơn. Bốn lợi ích kia là bảo hiểm; cái này là DUNG LƯỢNG.</li>
<li><strong>Nối sang Ch.6.</strong> Bộ nhớ trong lưu một bit bằng điện tích trong tụ (DRAM) hoặc bằng mạch chốt (SRAM), cả hai mất điện là bay. Ở đây một bit là <em>HƯỚNG TỪ HOÁ</em> của một mẩu lớp phủ tí hon — nó không cần điện để tồn tại. Đúng một khác biệt vật lý đó là toàn bộ lý do bộ nhớ ngoài không bay hơi.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: đế là vật liệu <strong>KHÔNG TỪ TÍNH</strong>. Câu nào bảo "dữ liệu được lưu trong đế nhôm" là SAI — dữ liệu chỉ nằm ở lớp phủ. Đế chỉ làm nhiệm vụ kết cấu.</p>`],

      [3, 'Magnetic Read and Write Mechanisms — the head, and how a current becomes a magnetic pattern',
        `<p class="y-chinh">🎯 Six boxes that together answer one question: <strong>how does an electrical signal become a permanent magnetic mark, and back again?</strong> The answer is a single component — the <strong>head</strong>, a conducting coil.</p>
<ul>
<li><strong>Box 1 — the definition.</strong> "Data are recorded on and later retrieved from the disk via a conducting coil named the <em>head</em>." In many systems there are <strong>two heads, a read head and a write head</strong>. Critically: <strong>during a read or write operation the head is STATIONARY while the platter rotates beneath it.</strong></li>
<li><strong>Box 2 — the physics.</strong> "The write mechanism exploits the fact that electricity flowing through a coil produces a magnetic field." That is Ampère's law, and it is the entire write mechanism in one line.</li>
<li><strong>Box 3 — writing.</strong> "Electric pulses are sent to the write head and the resulting magnetic patterns are recorded on the surface below, with <em>different patterns for positive and negative currents</em>." Positive current ⇒ one polarity, negative ⇒ the other. Two distinguishable states = one bit.</li>
<li><strong>Box 4 — the shape.</strong> The write head is made of easily magnetizable material and is "in the shape of a <strong>rectangular doughnut with a GAP along one side</strong> and a few turns of conducting wire along the opposite side". The gap is not a defect — it is the point of the whole design.</li>
<li><strong>Box 5 — why the gap matters.</strong> "An electric current in the wire induces a magnetic field <em>across the gap</em>, which in turn magnetizes a small area of the recording medium." The field is forced to leak out at the gap, and that leakage is what writes. Narrow gap ⇒ small magnetised area ⇒ high density.</li>
<li><strong>Box 6 — flipping a bit.</strong> "Reversing the direction of the current reverses the direction of the magnetization on the recording medium." So writing a 0 or a 1 is just the sign of the current.</li>
</ul>
<p class="meo">💡 Remember the head as a <strong>rectangular doughnut with one bite taken out of it</strong>. Current goes round the ring; the field escapes at the bite; the escaping field is the pen. Once you see that, "why is the head stationary?" answers itself — the pen holds still and the paper moves past it.</p>
<p class="pitfall">⚠️ Common confusion: "the head moves along the track to read it". No. The head is stationary during the transfer; the <em>platter rotates</em> under it. The head only moves <em>between tracks</em> (radially), and that motion is the seek of slide 11 — a separate, much more expensive operation.</p>`,
        `<p class="y-chinh">🎯 Sáu ô chữ cùng trả lời một câu hỏi: <strong>làm sao tín hiệu điện biến thành vết từ tính vĩnh viễn, rồi ngược lại?</strong> Đáp án là một linh kiện duy nhất — <strong>ĐẦU ĐỌC/GHI (head)</strong>, một cuộn dây dẫn.</p>
<ul>
<li><strong>Ô 1 — định nghĩa.</strong> "Dữ liệu được ghi lên và sau đó lấy lại từ đĩa thông qua một CUỘN DÂY DẪN gọi là <em>head</em>." Nhiều hệ có <strong>HAI đầu: một đầu đọc và một đầu ghi</strong>. Quan trọng nhất: <strong>trong lúc đọc hay ghi, đầu ĐỨNG YÊN còn mâm đĩa QUAY bên dưới nó.</strong></li>
<li><strong>Ô 2 — vật lý.</strong> "Cơ chế ghi khai thác sự thật rằng dòng điện chạy qua cuộn dây sinh ra từ trường." Đó là định luật Ampère, và đó là toàn bộ cơ chế ghi gói trong một dòng.</li>
<li><strong>Ô 3 — ghi.</strong> "Các xung điện được gửi tới đầu ghi và các mẫu từ tính tạo thành được ghi lên bề mặt bên dưới, với <em>mẫu KHÁC NHAU cho dòng dương và dòng âm</em>." Dòng dương ⇒ một chiều phân cực, dòng âm ⇒ chiều kia. Hai trạng thái phân biệt được = một bit.</li>
<li><strong>Ô 4 — hình dạng.</strong> Đầu ghi làm bằng vật liệu dễ từ hoá và có "hình một <strong>CHIẾC BÁNH VÒNG CHỮ NHẬT với một KHE HỞ ở một cạnh</strong> và vài vòng dây dẫn quấn ở cạnh đối diện". Khe hở không phải khuyết tật — nó là điểm mấu chốt của cả thiết kế.</li>
<li><strong>Ô 5 — vì sao khe hở quan trọng.</strong> "Dòng điện trong dây cảm ứng một từ trường <em>NGANG QUA KHE HỞ</em>, và từ trường đó từ hoá một vùng nhỏ của môi trường ghi." Từ trường bị ép rò ra ở khe, và chính chỗ rò đó viết chữ. Khe càng hẹp ⇒ vùng từ hoá càng nhỏ ⇒ mật độ càng cao.</li>
<li><strong>Ô 6 — lật một bit.</strong> "Đảo chiều dòng điện thì đảo chiều từ hoá trên môi trường ghi." Nên ghi 0 hay ghi 1 chỉ là DẤU của dòng điện.</li>
</ul>
<p class="meo">💡 Nhớ cái đầu đọc như một <strong>chiếc bánh vòng chữ nhật bị cắn mất một miếng</strong>. Dòng điện chạy vòng quanh; từ trường thoát ra ở chỗ cắn; chỗ thoát ra chính là ngòi bút. Thấy được hình đó thì câu "sao đầu lại đứng yên?" tự trả lời — ngòi bút giữ im, tờ giấy chạy qua.</p>
<p class="pitfall">⚠️ Nhầm lẫn phổ biến: "đầu đọc chạy dọc theo track để đọc". KHÔNG. Trong lúc truyền dữ liệu đầu ĐỨNG YÊN; <em>mâm đĩa quay</em> bên dưới. Đầu chỉ dịch chuyển <em>GIỮA CÁC TRACK</em> (theo bán kính), và chuyển động ấy chính là seek của slide 11 — một thao tác riêng, đắt hơn rất nhiều.</p>`],

      [4, 'Figure 7.1 — Inductive Write / Magnetoresistive Read Head',
        `<p class="y-chinh">🎯 The picture of a <strong>modern two-element head</strong>: an <em>inductive write element</em> (right, the doughnut with coil turns and a gap) and a separate <em>MR sensor</em> flanked by shields (left, with its own read current). Below them runs the recording medium, drawn as a row of blocks labelled <strong>N S · S N · N S · S N …</strong>.</p>
<ul>
<li><strong>Read the N/S row carefully — it is the data.</strong> The blocks alternate <code>N S</code>, then <code>S N</code>, then <code>N S</code>. Where two <em>like</em> poles meet (S next to S, or N next to N) there is a <strong>magnetisation reversal</strong>, and a reversal is what the read element detects. The arrows above the medium ("Magnetization") show each region's direction, pointing left or right.</li>
<li><strong>Why two different elements.</strong> Writing needs a strong field, which needs many coil turns — that makes a big, slow element. Reading needs sensitivity, not strength. So the drive uses an <strong>inductive</strong> element to write and a <strong>magnetoresistive (MR)</strong> element to read, and each is optimised separately. The slide's title names exactly that split.</li>
<li><strong>How the MR sensor works.</strong> An MR material's <em>electrical resistance</em> depends on the direction of the magnetisation it sits in. Pass a constant <strong>read current</strong> through it (the two vertical wires in the figure) and the voltage across it varies with the field underneath — so the field becomes a readable voltage. No motion-induced voltage is required, which is why MR heads still work at low platter speeds and at very high densities.</li>
<li><strong>The shields are not decoration.</strong> The two grey blocks either side of the MR sensor confine its field of view to one magnetic transition at a time. Without them the sensor would average several transitions together and the bits would smear.</li>
<li><strong>"Track width" arrow, top left.</strong> It marks how wide a band of medium this head writes. That width <em>is</em> the track. Narrow the head and you narrow the track, which is exactly the density argument of slides 2 and 10.</li>
</ul>
<p class="nhan">📐 Read the figure left to right as a timeline: the write element (right) lays down reversals as the medium moves; later, the MR sensor (left) passes over those same reversals and turns them back into a signal.</p>
<p class="pitfall">⚠️ Do not say "the head reads the N or S of each region". It reads the <strong>CHANGES</strong> between regions. That is why disk encodings (MFM, RLL, and their successors) are all about controlling how often reversals occur — a long run with no reversal gives the electronics nothing to synchronise on.</p>`,
        `<p class="y-chinh">🎯 Hình vẽ một <strong>đầu đọc/ghi HAI PHẦN TỬ hiện đại</strong>: một <em>phần tử ghi cảm ứng (inductive write element)</em> bên phải — cái bánh vòng có các vòng dây và khe hở — và một <em>cảm biến MR</em> riêng, hai bên có lớp chắn (shield), bên trái, với dòng đọc riêng. Bên dưới là môi trường ghi, vẽ thành một hàng khối ghi <strong>N S · S N · N S · S N …</strong></p>
<ul>
<li><strong>Đọc kỹ hàng N/S — đó chính là DỮ LIỆU.</strong> Các khối xen kẽ <code>N S</code>, rồi <code>S N</code>, rồi <code>N S</code>. Chỗ nào hai cực GIỐNG NHAU gặp nhau (S cạnh S, hoặc N cạnh N) là một <strong>ĐẢO CHIỀU TỪ HOÁ</strong>, và chính chỗ đảo chiều mới là thứ phần tử đọc phát hiện được. Mũi tên phía trên môi trường ("Magnetization") chỉ hướng của từng vùng, trái hoặc phải.</li>
<li><strong>Vì sao phải hai phần tử khác nhau.</strong> Ghi cần từ trường MẠNH, mà mạnh thì cần nhiều vòng dây — phần tử to và chậm. Đọc thì cần ĐỘ NHẠY chứ không cần mạnh. Nên ổ đĩa dùng phần tử <strong>cảm ứng</strong> để ghi và phần tử <strong>từ điện trở (MR)</strong> để đọc, mỗi cái tối ưu riêng. Tiêu đề slide gọi đúng tên sự tách đôi đó.</li>
<li><strong>Cảm biến MR hoạt động thế nào.</strong> ĐIỆN TRỞ của vật liệu MR phụ thuộc hướng từ hoá mà nó đang nằm trong. Cho một <strong>dòng đọc</strong> không đổi chạy qua nó (hai sợi dây thẳng đứng trên hình) thì điện áp hai đầu biến thiên theo từ trường bên dưới — từ trường thành điện áp đọc được. Không cần điện áp sinh ra do chuyển động, nên đầu MR vẫn chạy tốt khi mâm quay chậm và khi mật độ rất cao.</li>
<li><strong>Lớp chắn không phải trang trí.</strong> Hai khối xám hai bên cảm biến MR giới hạn "tầm nhìn" của nó xuống đúng MỘT chuyển tiếp từ tính mỗi lúc. Không có chúng thì cảm biến sẽ lấy trung bình nhiều chuyển tiếp và các bit nhoè vào nhau.</li>
<li><strong>Mũi tên "Track width" góc trên trái.</strong> Nó đánh dấu bề rộng dải môi trường mà đầu này ghi. Bề rộng đó CHÍNH LÀ track. Thu hẹp đầu là thu hẹp track, đúng lập luận mật độ của slide 2 và slide 10.</li>
</ul>
<p class="nhan">📐 Đọc hình từ phải sang trái như một dòng thời gian: phần tử ghi (bên phải) đặt xuống các đảo chiều khi môi trường chạy qua; sau đó cảm biến MR (bên trái) lướt qua đúng những đảo chiều ấy và biến chúng ngược lại thành tín hiệu.</p>
<p class="pitfall">⚠️ Đừng nói "đầu đọc đọc N hay S của từng vùng". Nó đọc các <strong>THAY ĐỔI</strong> giữa các vùng. Đó là lý do mọi phép mã hoá trên đĩa (MFM, RLL và đời sau) đều xoay quanh việc điều khiển tần suất xuất hiện đảo chiều — một đoạn dài không có đảo chiều nào thì mạch điện không có gì để đồng bộ.</p>`],

      [5, 'Figure 7.2 — Disk Data Layout: track, sector, cylinder, platter, spindle, boom',
        `<p class="y-chinh">🎯 The vocabulary slide. Every later formula uses these six words, so learn them here once: <strong>track · sector · inter-track gap · inter-sector gap · cylinder · spindle</strong>. The top of the figure is one platter seen face-on; the bottom is a stack of platters seen edge-on.</p>
<table>
<tr><th>Term on the figure</th><th>What it is</th><th>Why the exam cares</th></tr>
<tr><td><strong>Track</strong></td><td>One concentric ring on one surface</td><td>The unit the head must be <em>positioned on</em> — positioning it is the seek</td></tr>
<tr><td><strong>Sector</strong></td><td>One arc of one track (S1, S2, … SN on the figure)</td><td>The smallest readable/writable unit — 512 B or 4096 B</td></tr>
<tr><td><strong>Inter-track gap</strong></td><td>Unused space between neighbouring rings</td><td>Stops one track's field being read as its neighbour's</td></tr>
<tr><td><strong>Inter-sector gap</strong></td><td>Unused space between neighbouring sectors</td><td>Gives the electronics time to switch between read and write</td></tr>
<tr><td><strong>Cylinder</strong></td><td>All the tracks at the <em>same radius</em>, across every platter (dotted vertical band)</td><td>Everything in one cylinder is reachable with <strong>ZERO extra seek</strong></td></tr>
<tr><td><strong>Spindle / Boom</strong></td><td>The shaft all platters share / the arm all heads share</td><td>All heads move <em>together</em> — you cannot put head 0 on track 5 and head 1 on track 900</td></tr>
</table>
<ul>
<li><strong>Cylinder is the idea worth real marks.</strong> Because all heads sit on one boom and move as one, once the arm is parked, <em>every</em> track of that cylinder is available just by electronically selecting a different head. Table 7.2 (slide 13) says the HGST Ultrastar HE has <strong>8 tracks per cylinder</strong>. So an operating system that lays a file out cylinder by cylinder pays one seek for eight tracks of data — see the worked problem on slide 13.</li>
<li><strong>"Read-write head (1 per surface)" is the label to notice.</strong> Not one per platter — one per <em>surface</em>. A double-sided platter therefore carries two heads. That is why "tracks per cylinder" equals the number of recording surfaces.</li>
<li><strong>Sectors are numbered around the circle, not along the radius.</strong> The figure shows S1…SN repeated on each ring. Reading "the next sector" after SN means the head waits for the platter to bring S1 around again — a full rotation if you just missed it. That waiting is the rotational delay of slide 11.</li>
<li><strong>Gaps are pure overhead — and they are why formatted capacity is less than raw capacity.</strong> Slide 7 (Figure 7.4) prices one such overhead exactly: 65 wasted bytes per 512-byte sector.</li>
</ul>
<p class="meo">💡 Picture a multi-storey car park. A <em>track</em> is one circular ramp on one floor; a <em>sector</em> is one parking bay on that ramp; a <em>cylinder</em> is the same ramp on every floor, reachable without driving anywhere new; the <em>boom</em> is a lift that carries all your cars at once so they always stop on the same ramp number.</p>`,
        `<p class="y-chinh">🎯 Slide từ vựng. Mọi công thức về sau đều dùng sáu chữ này, nên học một lần cho xong ở đây: <strong>track · sector · khe giữa track · khe giữa sector · cylinder · spindle</strong>. Nửa trên của hình là một mâm nhìn thẳng mặt; nửa dưới là chồng mâm nhìn từ cạnh.</p>
<table>
<tr><th>Thuật ngữ trên hình</th><th>Là cái gì</th><th>Vì sao đề thi quan tâm</th></tr>
<tr><td><strong>Track (rãnh)</strong></td><td>Một vòng tròn đồng tâm trên một mặt</td><td>Đơn vị mà đầu đọc phải được <em>ĐƯA TỚI</em> — việc đưa tới đó là SEEK</td></tr>
<tr><td><strong>Sector (cung)</strong></td><td>Một cung của một track (S1, S2, … SN trên hình)</td><td>Đơn vị đọc/ghi NHỎ NHẤT — 512 B hoặc 4096 B</td></tr>
<tr><td><strong>Inter-track gap</strong></td><td>Khoảng trống không dùng giữa hai vòng kề nhau</td><td>Ngăn từ trường của track này bị đọc nhầm thành track bên</td></tr>
<tr><td><strong>Inter-sector gap</strong></td><td>Khoảng trống giữa hai sector kề nhau</td><td>Cho mạch điện kịp chuyển giữa chế độ đọc và ghi</td></tr>
<tr><td><strong>Cylinder (trụ)</strong></td><td>Tất cả các track ở <em>CÙNG BÁN KÍNH</em> trên mọi mâm (dải kẻ chấm dọc)</td><td>Mọi thứ trong một cylinder với tới được mà <strong>KHÔNG TỐN THÊM SEEK</strong></td></tr>
<tr><td><strong>Spindle / Boom</strong></td><td>Trục chung của mọi mâm / cần chung của mọi đầu đọc</td><td>Mọi đầu đọc dịch chuyển <em>CÙNG NHAU</em> — không thể để đầu 0 ở track 5 còn đầu 1 ở track 900</td></tr>
</table>
<ul>
<li><strong>Cylinder là ý ăn điểm thật.</strong> Vì mọi đầu đọc gắn chung một cần và dịch chuyển như một khối, nên khi cần đã đỗ xong thì <em>MỌI</em> track của cylinder đó đều lấy được chỉ bằng cách chọn đầu đọc khác bằng ĐIỆN. Table 7.2 (slide 13) ghi ổ HGST Ultrastar HE có <strong>8 track mỗi cylinder</strong>. Vậy một hệ điều hành xếp tệp theo từng cylinder thì trả MỘT lần seek cho TÁM track dữ liệu — xem bài giải ở slide 13.</li>
<li><strong>Nhãn "Read-write head (1 per surface)" đáng để ý.</strong> Không phải một đầu mỗi MÂM — một đầu mỗi MẶT. Mâm hai mặt thì mang hai đầu. Đó là lý do "số track mỗi cylinder" bằng đúng số mặt ghi.</li>
<li><strong>Sector đánh số VÒNG QUANH đường tròn, không phải theo bán kính.</strong> Hình vẽ S1…SN lặp trên từng vòng. Đọc "sector kế tiếp" sau SN nghĩa là đầu đọc phải CHỜ mâm quay mang S1 trở lại — mất trọn một vòng nếu vừa lỡ mất. Cái chờ đó chính là độ trễ quay ở slide 11.</li>
<li><strong>Các khe hở là hao phí thuần tuý — và đó là lý do dung lượng đã định dạng nhỏ hơn dung lượng thô.</strong> Slide 7 (Figure 7.4) báo giá đúng một loại hao phí như vậy: 65 byte bỏ đi trên mỗi sector 512 byte.</li>
</ul>
<p class="meo">💡 Hình dung một bãi đỗ xe nhiều tầng. <em>Track</em> là một đường dốc vòng trên một tầng; <em>sector</em> là một ô đỗ trên đường dốc đó; <em>cylinder</em> là cùng đường dốc ấy trên MỌI tầng, với tới được mà không phải lái đi đâu mới; <em>boom</em> là cái thang máy chở tất cả xe của bạn cùng lúc nên chúng luôn dừng ở cùng số hiệu đường dốc.</p>`],

      [6, 'Figure 7.3 — Comparison of Disk Layout Methods: (a) constant angular velocity, (b) multiple zone recording',
        `<p class="y-chinh">🎯 Two drawings of the same platter that answer: <strong>should every track hold the same number of sectors?</strong> (a) Constant angular velocity says yes — and wastes the outer half of the disk. (b) Multiple zone recording says no — and nearly doubles capacity.</p>
<ul>
<li><strong>(a) Constant angular velocity (CAV).</strong> The pie slices run straight from centre to rim, so every track has the <em>same number of sectors</em>. The disk spins at one constant speed and the electronics never change rate. Addressing is trivial: track number + sector number, and the bit rate is fixed.</li>
<li><strong>The cost of CAV, and it is huge.</strong> An outer track is physically much longer than an inner one but stores the same bits, so the bits out there are stretched thin. Take a 3.5-inch platter with inner recording radius about 1,5 cm and outer about 4,4 cm. CAV can only use the <em>innermost</em> track's density everywhere.</li>
</ul>
<p class="nhan">📐 Worked estimate (verified with python3):</p>
<table>
<tr><th>Scheme</th><th>Bits per track</th><th>Total ∝</th><th>Relative capacity</th></tr>
<tr><td>CAV</td><td>same on every track = <em>b</em>(inner)</td><td>tracks × <em>b</em>(r<sub>in</sub>)</td><td>1,000</td></tr>
<tr><td>Zone recording</td><td>∝ circumference ⇒ average ∝ (r<sub>in</sub>+r<sub>out</sub>)/2</td><td>tracks × <em>b</em>((1,5+4,4)/2)</td><td><strong>1,967</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: with r<sub>in</sub> = 1,5 cm and r<sub>out</sub> = 4,4 cm, zone recording stores <strong>1,97× more</strong> than CAV on the same platter — meaning CAV throws away about <strong>49,2 %</strong> of the usable surface. That is why no modern hard disk uses pure CAV.</p>
<ul>
<li><strong>(b) Multiple zone recording (MZR).</strong> The surface is divided into <em>zones</em> (the alternating green/grey bands). Within a zone the sector count is constant; outer zones get <em>more</em> sectors per track. Look at the figure: the outer band is cut into more pieces than the inner band.</li>
<li><strong>What MZR costs you.</strong> More complex circuitry — the read/write rate must change from zone to zone — and the tidy "sector <em>s</em> of track <em>t</em>" address is gone, so the drive must translate logical block numbers itself. Modern drives hide all of this behind <strong>LBA (logical block addressing)</strong>; the OS just asks for block <em>n</em>.</li>
<li><strong>The third option the slide does not draw: CLV.</strong> Constant linear velocity spins <em>slower</em> for outer tracks so the linear speed under the head is fixed. CDs do this (slide 33 of this deck). Hard disks do not — changing spindle speed on every seek would be far too slow.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: CAV is not "worse" in every respect. Its advantage is <em>simplicity and constant data rate</em>, and it makes the block-access formula on slide 11 exact. In this course, disk performance problems assume <strong>a fixed number of bytes per track</strong> — which is a CAV assumption. Use it when the problem says so, and know it is a simplification.</p>`,
        `<p class="y-chinh">🎯 Hai bản vẽ cùng một mâm đĩa, cùng trả lời một câu: <strong>có nên cho mọi track chứa cùng số sector không?</strong> (a) Vận tốc góc không đổi bảo CÓ — và bỏ phí nửa ngoài của đĩa. (b) Ghi nhiều vùng bảo KHÔNG — và gần như gấp đôi dung lượng.</p>
<ul>
<li><strong>(a) Constant angular velocity — CAV, vận tốc góc không đổi.</strong> Các lát bánh chạy thẳng từ tâm ra vành, nên mọi track có <em>CÙNG SỐ SECTOR</em>. Đĩa quay ở một tốc độ duy nhất và mạch điện không bao giờ phải đổi nhịp. Đánh địa chỉ cực dễ: số track + số sector, và tốc độ bit cố định.</li>
<li><strong>Cái giá của CAV, và nó khổng lồ.</strong> Track ngoài dài hơn track trong rất nhiều nhưng chứa cùng số bit, nên bit ở ngoài bị kéo giãn mỏng. Lấy mâm 3,5 inch, bán kính ghi trong khoảng 1,5 cm và ngoài khoảng 4,4 cm. CAV chỉ dùng được mật độ của track TRONG CÙNG cho mọi chỗ.</li>
</ul>
<p class="nhan">📐 Ước lượng có giải (đã kiểm bằng python3):</p>
<table>
<tr><th>Cách bố trí</th><th>Số bit mỗi track</th><th>Tổng tỉ lệ với</th><th>Dung lượng tương đối</th></tr>
<tr><td>CAV</td><td>như nhau mọi track = <em>b</em>(trong cùng)</td><td>số track × <em>b</em>(r<sub>trong</sub>)</td><td>1,000</td></tr>
<tr><td>Ghi nhiều vùng</td><td>∝ chu vi ⇒ trung bình ∝ (r<sub>trong</sub>+r<sub>ngoài</sub>)/2</td><td>số track × <em>b</em>((1,5+4,4)/2)</td><td><strong>1,967</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: với r<sub>trong</sub> = 1,5 cm và r<sub>ngoài</sub> = 4,4 cm, ghi nhiều vùng chứa được <strong>gấp 1,97 lần</strong> CAV trên cùng một mâm — nghĩa là CAV vứt đi khoảng <strong>49,2 %</strong> diện tích dùng được. Đó là lý do không ổ cứng hiện đại nào dùng CAV thuần.</p>
<ul>
<li><strong>(b) Multiple zone recording — MZR, ghi nhiều vùng.</strong> Mặt đĩa chia thành các <em>VÙNG</em> (các dải xanh/xám xen kẽ). Trong một vùng thì số sector không đổi; vùng ngoài được <em>NHIỀU</em> sector mỗi track hơn. Nhìn hình: dải ngoài bị cắt thành nhiều mảnh hơn dải trong.</li>
<li><strong>MZR bắt trả giá gì.</strong> Mạch phức tạp hơn — tốc độ đọc/ghi phải đổi theo từng vùng — và cái địa chỉ gọn gàng "sector <em>s</em> của track <em>t</em>" không còn nữa, nên bản thân ổ đĩa phải tự dịch số khối logic. Ổ hiện đại giấu tất cả sau <strong>LBA (đánh địa chỉ khối logic)</strong>; hệ điều hành chỉ việc hỏi khối số <em>n</em>.</li>
<li><strong>Lựa chọn thứ ba mà slide không vẽ: CLV.</strong> Vận tốc dài không đổi — quay CHẬM hơn ở track ngoài để tốc độ dài dưới đầu đọc luôn cố định. Đĩa CD làm vậy (slide 33 của chính deck này). Ổ cứng thì không — đổi tốc độ quay ở mỗi lần seek sẽ chậm không thể chấp nhận.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: CAV không phải "dở mọi mặt". Ưu điểm của nó là <em>ĐƠN GIẢN và tốc độ dữ liệu không đổi</em>, và chính nó làm công thức thời gian truy cập khối ở slide 11 trở nên CHÍNH XÁC. Trong môn này, bài tập hiệu năng đĩa luôn giả thiết <strong>số byte mỗi track là một hằng số</strong> — tức giả thiết CAV. Cứ dùng khi đề nói vậy, nhưng biết rõ đó là đơn giản hoá.</p>`],

      [7, 'Figure 7.4 — Legacy and Advanced Sector Formats (512-byte vs 4k-byte sectors)',
        `<p class="y-chinh">🎯 What a sector really looks like on the medium: <strong>data is the minority tenant</strong>. Around it sit a gap, a sync field, an address mark and an ECC field — and this slide lets you compute exactly how much of the platter they eat.</p>
<table>
<tr><th>Field (left to right on the figure)</th><th>Job</th></tr>
<tr><td><strong>Gap</strong></td><td>Blank run separating this sector from the previous one; gives the electronics settling time</td></tr>
<tr><td><strong>Sync</strong></td><td>A known pattern the read channel locks its clock onto</td></tr>
<tr><td><strong>Address Mark</strong></td><td>Says <em>which</em> sector this is — the drive confirms it landed on the right one</td></tr>
<tr><td><strong>Data</strong></td><td>The bytes you asked for</td></tr>
<tr><td><strong>ECC</strong></td><td>Error-correcting code, appended after the data</td></tr>
</table>
<p class="nhan">📐 Worked problem — how much of the disk is actually your data? Figures from the slide: (a) 15 bytes of gap+sync+address, 512 bytes of data, 50 bytes of ECC. (b) 15 bytes of overhead, 4096 bytes of data, 100 bytes of ECC.</p>
<table>
<tr><th>Step</th><th>(a) Legacy 512 B</th><th>(b) Advanced Format 4 kB</th></tr>
<tr><td>Bytes on the medium</td><td>15 + 512 + 50 = <strong>577</strong></td><td>15 + 4096 + 100 = <strong>4211</strong></td></tr>
<tr><td>Useful fraction</td><td>512 ÷ 577 = <strong>88,73 %</strong></td><td>4096 ÷ 4211 = <strong>97,27 %</strong></td></tr>
<tr><td>Overhead</td><td>65 ÷ 577 = 11,27 %</td><td>115 ÷ 4211 = 2,73 %</td></tr>
<tr><td>Medium needed for 4096 B of data</td><td>8 × 577 = <strong>4616 B</strong></td><td>1 × 4211 = <strong>4211 B</strong></td></tr>
<tr><td>ECC strength per byte of data</td><td>50 ÷ 512 = 9,77 %</td><td>100 ÷ 4096 = 2,44 %</td></tr>
</table>
<p class="dap-an">✅ Answer: storing the same 4096 bytes costs <strong>4616 B in the legacy format versus 4211 B in Advanced Format</strong> — a saving of 405 B, i.e. <strong>8,77 % of the platter surface, for free</strong>. And note the second column of the last row: AF spends <em>less</em> ECC per byte in percentage terms yet protects better, because one 100-byte code guarding 4096 bytes is mathematically far stronger than eight separate 50-byte codes each guarding 512 bytes. That is the entire business case for Advanced Format.</p>
<ul>
<li><strong>Why the gap and sync cannot simply be deleted.</strong> They are not data overhead, they are <em>timing</em> overhead. The read channel has no external clock; it recovers the clock from the bit stream itself, and it needs the sync field to lock on at the start of each sector. Remove it and the drive cannot tell where a byte begins.</li>
<li><strong>Connect to Ch.5.</strong> This is the same block-size trade-off as a cache line, one level down. Bigger sector ⇒ less per-sector overhead, but a 1-byte update now forces a read-modify-write of 4096 bytes. That is exactly why <em>512e</em> drives (4 kB physically, 512 B logically) suffer if a file system's partitions are misaligned.</li>
</ul>
<p class="pitfall">⚠️ <strong>Error on the slide.</strong> Panel (b) is captioned "Advanced Format <strong>4k-byte</strong> sector", but the dimension label under its data field reads "<strong>512 bytes</strong>". Those contradict each other, and the caption is the one that is right — if the data field really were 512 B with 100 B of ECC the efficiency would be 512 ÷ 627 = 81,66 %, <em>worse</em> than the legacy format, which would make Advanced Format pointless. Read it as 4096 bytes. Do not silently copy the 512.</p>`,
        `<p class="y-chinh">🎯 Một sector THẬT SỰ trông thế nào trên mặt đĩa: <strong>dữ liệu là kẻ ở trọ thiểu số</strong>. Vây quanh nó là một khe trống, một trường đồng bộ, một dấu địa chỉ và một trường ECC — và slide này cho bạn tính ra chính xác chúng ăn mất bao nhiêu mặt đĩa.</p>
<table>
<tr><th>Trường (trái sang phải trên hình)</th><th>Làm việc gì</th></tr>
<tr><td><strong>Gap (khe)</strong></td><td>Đoạn trống ngăn sector này với sector trước; cho mạch điện thời gian ổn định</td></tr>
<tr><td><strong>Sync (đồng bộ)</strong></td><td>Một mẫu bit đã biết trước để kênh đọc khoá đồng hồ vào</td></tr>
<tr><td><strong>Address Mark (dấu địa chỉ)</strong></td><td>Cho biết đây là sector NÀO — ổ đĩa xác nhận mình đáp đúng chỗ</td></tr>
<tr><td><strong>Data (dữ liệu)</strong></td><td>Số byte bạn hỏi tới</td></tr>
<tr><td><strong>ECC</strong></td><td>Mã sửa lỗi, gắn sau phần dữ liệu</td></tr>
</table>
<p class="nhan">📐 Bài giải — bao nhiêu phần của đĩa thật sự là dữ liệu của bạn? Số liệu lấy từ slide: (a) 15 byte gap+sync+address, 512 byte dữ liệu, 50 byte ECC. (b) 15 byte phụ trội, 4096 byte dữ liệu, 100 byte ECC.</p>
<table>
<tr><th>Bước</th><th>(a) Cũ 512 B</th><th>(b) Advanced Format 4 kB</th></tr>
<tr><td>Số byte chiếm trên mặt đĩa</td><td>15 + 512 + 50 = <strong>577</strong></td><td>15 + 4096 + 100 = <strong>4211</strong></td></tr>
<tr><td>Phần có ích</td><td>512 ÷ 577 = <strong>88,73 %</strong></td><td>4096 ÷ 4211 = <strong>97,27 %</strong></td></tr>
<tr><td>Hao phí</td><td>65 ÷ 577 = 11,27 %</td><td>115 ÷ 4211 = 2,73 %</td></tr>
<tr><td>Mặt đĩa cần để chứa 4096 B dữ liệu</td><td>8 × 577 = <strong>4616 B</strong></td><td>1 × 4211 = <strong>4211 B</strong></td></tr>
<tr><td>ECC trên mỗi byte dữ liệu</td><td>50 ÷ 512 = 9,77 %</td><td>100 ÷ 4096 = 2,44 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án: chứa cùng 4096 byte tốn <strong>4616 B theo khuôn dạng cũ so với 4211 B theo Advanced Format</strong> — tiết kiệm 405 B, tức <strong>8,77 % diện tích mặt đĩa, miễn phí</strong>. Và để ý dòng cuối: AF tiêu <em>ÍT</em> ECC hơn tính theo phần trăm mà lại bảo vệ TỐT HƠN, vì một mã 100 byte canh 4096 byte mạnh hơn hẳn về mặt toán học so với tám mã 50 byte riêng lẻ, mỗi mã canh 512 byte. Đó là toàn bộ lý do kinh tế của Advanced Format.</p>
<ul>
<li><strong>Vì sao không thể xoá quách gap và sync đi.</strong> Chúng không phải hao phí dữ liệu, chúng là hao phí <em>ĐỊNH THỜI</em>. Kênh đọc không có đồng hồ ngoài; nó khôi phục đồng hồ từ chính dòng bit, và nó cần trường sync để khoá vào ở đầu mỗi sector. Bỏ đi thì ổ đĩa không biết một byte bắt đầu ở đâu.</li>
<li><strong>Nối sang Ch.5.</strong> Đây đúng là bài toán đánh đổi kích thước khối của dòng cache, hạ xuống một tầng. Sector to hơn ⇒ hao phí trên mỗi sector ít hơn, nhưng sửa 1 byte bây giờ buộc phải đọc-sửa-ghi trọn 4096 byte. Chính vì thế ổ <em>512e</em> (vật lý 4 kB, logic 512 B) chạy ì ạch khi phân vùng của hệ tệp bị lệch biên.</li>
</ul>
<p class="pitfall">⚠️ <strong>LỖI TRÊN SLIDE.</strong> Khung (b) có chú thích "Advanced Format <strong>4k-byte</strong> sector", nhưng nhãn kích thước dưới trường dữ liệu của nó lại ghi "<strong>512 bytes</strong>". Hai chỗ đó mâu thuẫn, và chú thích mới là cái ĐÚNG — nếu trường dữ liệu thật sự chỉ 512 B kèm 100 B ECC thì hiệu suất là 512 ÷ 627 = 81,66 %, <em>TỆ HƠN</em> khuôn dạng cũ, tức Advanced Format thành vô nghĩa. Hãy đọc thành 4096 byte. Đừng lặng lẽ chép lại con số 512.</p>`],

      [8, 'Table 7.1 — Physical Characteristics of Disk Systems (five axes of classification)',
        `<p class="y-chinh">🎯 A five-question checklist that classifies <em>any</em> disk system ever built. Every question is a yes/no or a two-way choice, so the whole table fits in one sentence: <strong>how does the head move · can the disk come out · one side or two · one platter or many · how does the head fly.</strong></p>
<table>
<tr><th>Axis</th><th>Options on the slide</th><th>What the choice decides</th></tr>
<tr><td><strong>Head Motion</strong></td><td>Fixed head (one per track) · Movable head (one per surface)</td><td>Whether <strong>seek time exists at all</strong></td></tr>
<tr><td><strong>Disk Portability</strong></td><td>Nonremovable disk · Removable disk</td><td>Whether the medium can leave the drive</td></tr>
<tr><td><strong>Sides</strong></td><td>Single sided · Double sided</td><td>Heads per platter: 1 or 2</td></tr>
<tr><td><strong>Platters</strong></td><td>Single platter · Multiple platter</td><td>Whether <em>cylinders</em> mean anything</td></tr>
<tr><td><strong>Head Mechanism</strong></td><td>Contact (floppy) · Fixed gap · Aerodynamic gap (Winchester)</td><td>How close the head flies ⇒ achievable density</td></tr>
</table>
<ul>
<li><strong>Head Motion is the axis that matters for the exam.</strong> A <em>fixed-head</em> disk has one head per track, so it never seeks — cross it off the formula. A <em>movable-head</em> disk has one head per surface and must reposition, which is the 8–11 ms you will be adding up on slide 11. Every drive you will ever meet is movable-head; fixed-head is a historical curiosity that traded enormous cost for zero seek time.</li>
<li><strong>Read "one per track" versus "one per surface" as a cost sentence.</strong> A modern surface has millions of tracks. One head per track is unbuildable today, which is precisely why the industry chose to pay milliseconds instead of dollars.</li>
<li><strong>The three head mechanisms form a ladder, not a list.</strong> <em>Contact</em> — the head touches the medium (floppy disks); cheap, but friction wears the medium, so it can only spin slowly. <em>Fixed gap</em> — the head is held a set distance away; no wear, but the gap must be generous, so density is low. <em>Aerodynamic gap (Winchester)</em> — the head <em>flies</em> on the air the spinning disk drags with it; this is slide 10 and it is what every hard disk uses.</li>
<li><strong>Sides × Platters gives you "tracks per cylinder" directly.</strong> Double-sided × 4 platters = 8 recording surfaces = 8 heads = 8 tracks per cylinder — which is exactly the HGST Ultrastar HE row of Table 7.2 on slide 13. The table and the specification sheet fit together.</li>
<li><strong>Removable is nearly extinct for hard disks but alive elsewhere.</strong> Slide 9 lists floppy and ZIP cartridges as the examples. The <em>idea</em> survives in the optical disks of slides 31–38 and the tape cartridges of slides 39–41, where removability is the whole point: unlimited capacity from a limited number of drives.</li>
</ul>
<p class="meo">💡 Five axes, five fingers: <strong>M</strong>otion · <strong>P</strong>ortability · <strong>S</strong>ides · <strong>P</strong>latters · <strong>M</strong>echanism. If an exam question describes a drive, answer all five and you have described it completely in the book's own vocabulary.</p>`,
        `<p class="y-chinh">🎯 Một bảng kiểm năm câu hỏi, phân loại được <em>MỌI</em> hệ đĩa từng được chế tạo. Câu nào cũng là có/không hoặc chọn một trong hai, nên cả bảng gói trong một câu: <strong>đầu đọc dịch chuyển kiểu gì · đĩa rút ra được không · một mặt hay hai · một mâm hay nhiều · đầu đọc bay kiểu gì.</strong></p>
<table>
<tr><th>Trục</th><th>Lựa chọn trên slide</th><th>Lựa chọn đó quyết định gì</th></tr>
<tr><td><strong>Head Motion (chuyển động đầu)</strong></td><td>Fixed head (mỗi track một đầu) · Movable head (mỗi mặt một đầu)</td><td>Có <strong>SEEK TIME hay không</strong></td></tr>
<tr><td><strong>Disk Portability (rút ra được)</strong></td><td>Nonremovable · Removable</td><td>Môi trường có rời khỏi ổ được không</td></tr>
<tr><td><strong>Sides (số mặt)</strong></td><td>Single sided · Double sided</td><td>Số đầu đọc mỗi mâm: 1 hay 2</td></tr>
<tr><td><strong>Platters (số mâm)</strong></td><td>Single platter · Multiple platter</td><td><em>Cylinder</em> có ý nghĩa gì không</td></tr>
<tr><td><strong>Head Mechanism (cơ chế đầu)</strong></td><td>Contact (đĩa mềm) · Fixed gap · Aerodynamic gap (Winchester)</td><td>Đầu bay sát tới đâu ⇒ mật độ đạt được</td></tr>
</table>
<ul>
<li><strong>Head Motion là trục ăn điểm thi.</strong> Đĩa <em>đầu cố định</em> có mỗi track một đầu nên KHÔNG BAO GIỜ seek — gạch hẳn số hạng đó khỏi công thức. Đĩa <em>đầu di động</em> có mỗi mặt một đầu và phải đổi vị trí, tức 8–11 ms mà bạn sẽ cộng vào ở slide 11. Mọi ổ đĩa bạn từng gặp đều là đầu di động; đầu cố định là của hiếm lịch sử, đánh đổi chi phí khổng lồ để lấy seek bằng không.</li>
<li><strong>Đọc "một đầu mỗi track" so với "một đầu mỗi mặt" như một câu về TIỀN.</strong> Một mặt đĩa hiện đại có hàng triệu track. Mỗi track một đầu là không thể chế tạo nổi ngày nay, và chính vì thế ngành công nghiệp chọn trả bằng MILI GIÂY chứ không trả bằng ĐÔ LA.</li>
<li><strong>Ba cơ chế đầu là một cái THANG, không phải một danh sách rời.</strong> <em>Contact</em> — đầu chạm vào môi trường (đĩa mềm); rẻ, nhưng ma sát mài mòn môi trường nên chỉ quay chậm được. <em>Fixed gap</em> — đầu giữ cách một khoảng cố định; không mòn, nhưng khe phải rộng rãi nên mật độ thấp. <em>Aerodynamic gap (Winchester)</em> — đầu <em>BAY</em> trên lớp không khí bị mâm quay kéo theo; đó là slide 10, và là thứ mọi ổ cứng đang dùng.</li>
<li><strong>Số mặt × số mâm cho ra thẳng "tracks per cylinder".</strong> Hai mặt × 4 mâm = 8 mặt ghi = 8 đầu đọc = 8 track mỗi cylinder — đúng bằng dòng HGST Ultrastar HE của Table 7.2 ở slide 13. Bảng phân loại và tờ thông số khớp vào nhau.</li>
<li><strong>Đĩa rút ra được gần như tuyệt chủng ở ổ cứng nhưng vẫn sống ở chỗ khác.</strong> Slide 9 kể ví dụ là đĩa mềm và hộp ZIP. <em>Ý TƯỞNG</em> đó sống tiếp ở đĩa quang của slide 31–38 và băng từ của slide 39–41, nơi tính rút ra được chính là mấu chốt: dung lượng vô hạn từ một số ổ hữu hạn.</li>
</ul>
<p class="meo">💡 Năm trục, năm ngón tay: <strong>M</strong>otion · <strong>P</strong>ortability · <strong>S</strong>ides · <strong>P</strong>latters · <strong>M</strong>echanism. Đề mô tả một ổ đĩa thì cứ trả lời đủ năm trục là bạn đã mô tả nó trọn vẹn bằng đúng từ vựng của sách.</p>`],

      [9, 'Characteristics — fixed-head vs movable-head, non-removable vs removable, double sided',
        `<p class="y-chinh">🎯 The slide unpacks three of the five axes of Table 7.1 into full sentences. The one worth memorising is the first: <strong>a fixed-head disk has one read-write head PER TRACK, mounted on a fixed rigid arm that extends across all tracks; a movable-head disk has ONE head, mounted on an arm that can be extended or retracted.</strong></p>
<table>
<tr><th></th><th>Fixed-head disk</th><th>Movable-head disk</th></tr>
<tr><td>Heads</td><td>One per <strong>track</strong></td><td>One (per surface)</td></tr>
<tr><td>Arm</td><td>Fixed, rigid, spans all tracks</td><td>Extends and retracts</td></tr>
<tr><td>Seek time</td><td><strong>None</strong> — selection is electronic</td><td>Mechanical, milliseconds</td></tr>
<tr><td>Cost per track</td><td>One head each — prohibitive</td><td>One head total — cheap</td></tr>
<tr><td>Used today?</td><td>Effectively no</td><td>Every hard disk</td></tr>
</table>
<ul>
<li><strong>Non-removable disk</strong> — "permanently mounted in the disk drive. The hard disk in a personal computer is a non-removable disk." The medium and the mechanism are sealed together, which is what makes the Winchester design of slide 10 possible: you cannot keep a drive contaminant-free if the user keeps opening it.</li>
<li><strong>Removable disk</strong> — "can be removed and replaced with another disk". The slide gives two advantages, and they are different in kind: (1) <strong>unlimited amounts of data are available with a limited number of disk systems</strong> — capacity stops being bounded by the hardware you own; (2) <strong>a disk may be moved from one computer system to another</strong> — the medium becomes a transport, not just a store. Examples on the slide: floppy disks and ZIP cartridge disks.</li>
<li><strong>Double sided disk</strong> — "magnetizable coating is applied to both sides of the platter". Doubling the surfaces doubles capacity <em>and</em> doubles tracks-per-cylinder, so it improves sequential throughput too (see the cylinder problem on slide 13). It is nearly free: one extra head, no extra motor, no extra seek.</li>
<li><strong>Why fixed-head disks died, in one calculation.</strong> Table 7.2 lists a 12 TB drive. With 4096-byte sectors that is 12×10<sup>12</sup> ÷ 4096 ≈ <strong>2,93 billion sectors</strong>, spread over millions of tracks per surface. One head per track would mean millions of heads per surface. There is no version of that which is cheaper than waiting 8 ms.</li>
<li><strong>Historical note worth knowing.</strong> Fixed-head disks were real — used as swap/paging devices on 1960s–70s mainframes precisely because they had no seek. They lost not on physics but on economics, when track density grew faster than anyone could build heads.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "movable head = one head" is true <em>per surface</em>. A drive with 8 surfaces has 8 heads, all on the same boom, all at the same track number at the same time. That is not a fixed-head disk — it is eight movable heads moving as one.</p>`,
        `<p class="y-chinh">🎯 Slide này mở ba trong năm trục của Table 7.1 thành câu đầy đủ. Câu đáng học thuộc là câu đầu: <strong>đĩa ĐẦU CỐ ĐỊNH có mỗi TRACK một đầu đọc-ghi, gắn trên một cần cứng cố định trải ngang mọi track; đĩa ĐẦU DI ĐỘNG chỉ có MỘT đầu, gắn trên một cần có thể vươn ra thụt vào.</strong></p>
<table>
<tr><th></th><th>Đĩa đầu cố định</th><th>Đĩa đầu di động</th></tr>
<tr><td>Số đầu</td><td>Mỗi <strong>TRACK</strong> một đầu</td><td>Một (trên mỗi mặt)</td></tr>
<tr><td>Cần</td><td>Cố định, cứng, trải hết mọi track</td><td>Vươn ra, thụt vào</td></tr>
<tr><td>Seek time</td><td><strong>KHÔNG CÓ</strong> — chọn track bằng điện</td><td>Cơ khí, tính bằng mili giây</td></tr>
<tr><td>Giá trên mỗi track</td><td>Mỗi track một đầu — cắt cổ</td><td>Tổng cộng một đầu — rẻ</td></tr>
<tr><td>Nay còn dùng?</td><td>Coi như không</td><td>Mọi ổ cứng</td></tr>
</table>
<ul>
<li><strong>Đĩa KHÔNG rút ra được</strong> — "gắn cố định vĩnh viễn trong ổ đĩa. Ổ cứng trong máy tính cá nhân là đĩa không rút ra được." Môi trường và cơ cấu được hàn kín cùng nhau, và chính điều đó làm thiết kế Winchester của slide 10 trở nên khả thi: không thể giữ một ổ đĩa sạch tạp chất nếu người dùng cứ mở ra.</li>
<li><strong>Đĩa RÚT RA ĐƯỢC</strong> — "có thể tháo ra và thay bằng đĩa khác". Slide nêu hai ưu điểm, và chúng khác BẢN CHẤT: (1) <strong>lượng dữ liệu vô hạn với một số hữu hạn hệ đĩa</strong> — dung lượng thôi bị chặn bởi phần cứng bạn sở hữu; (2) <strong>một đĩa có thể mang từ máy này sang máy khác</strong> — môi trường thành phương tiện VẬN CHUYỂN chứ không chỉ là chỗ chứa. Ví dụ slide nêu: đĩa mềm và hộp đĩa ZIP.</li>
<li><strong>Đĩa HAI MẶT</strong> — "lớp phủ từ hoá được tráng lên cả hai mặt của mâm". Gấp đôi số mặt là gấp đôi dung lượng <em>VÀ</em> gấp đôi số track mỗi cylinder, nên nó cũng cải thiện thông lượng đọc tuần tự (xem bài cylinder ở slide 13). Gần như miễn phí: thêm một đầu đọc, không thêm mô tơ, không thêm seek.</li>
<li><strong>Vì sao đĩa đầu cố định chết, gói trong một phép tính.</strong> Table 7.2 ghi một ổ 12 TB. Với sector 4096 byte thì đó là 12×10<sup>12</sup> ÷ 4096 ≈ <strong>2,93 tỉ sector</strong>, trải trên hàng triệu track mỗi mặt. Mỗi track một đầu nghĩa là hàng TRIỆU đầu đọc trên một mặt. Không có phương án nào của chuyện đó rẻ hơn việc ngồi chờ 8 ms.</li>
<li><strong>Ghi chú lịch sử đáng biết.</strong> Đĩa đầu cố định từng có thật — dùng làm thiết bị hoán đổi/phân trang trên máy lớn thập niên 1960–70 chính vì nó không có seek. Nó thua không phải vì vật lý mà vì KINH TẾ, khi mật độ track tăng nhanh hơn khả năng chế tạo đầu đọc của bất kỳ ai.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "đầu di động = một đầu" là đúng theo từng MẶT. Ổ có 8 mặt thì có 8 đầu, tất cả trên cùng một cần, tất cả ở cùng số track vào cùng một lúc. Đó KHÔNG phải đĩa đầu cố định — đó là tám đầu di động dịch chuyển như một.</p>`],

      [10, 'Disk Classification — the head-gap trade-off and the Winchester head',
        `<p class="y-chinh">🎯 The slide states the central engineering tension of the whole magnetic-disk story as a chain of four sentences. Read them in order and the Winchester head becomes inevitable.</p>
<table>
<tr><th>Step</th><th>The slide's sentence</th><th>Consequence</th></tr>
<tr><td>1</td><td>The head must generate or sense an electromagnetic field <strong>of sufficient magnitude</strong> to write and read properly</td><td>Signal strength is non-negotiable</td></tr>
<tr><td>2</td><td>The <strong>narrower the head, the closer</strong> it must be to the platter surface to function</td><td>Narrow head ⇒ weak field ⇒ must fly lower to compensate</td></tr>
<tr><td>3</td><td>A narrower head means <strong>narrower tracks</strong> and therefore <strong>greater data density</strong></td><td>Narrow head is what you WANT — it is capacity</td></tr>
<tr><td>4</td><td>The <strong>closer the head is to the disk the greater the risk</strong> of error from impurities or imperfections</td><td>And this is the price</td></tr>
</table>
<p class="dap-an">✅ Put the four together: <strong>capacity pushes the head down, reliability pushes it up.</strong> Every hard-disk generation is a new answer to that single tug-of-war — and the glass substrate of slide 2 was one such answer (a flatter, cleaner surface lets you fly lower at the same risk).</p>
<ul>
<li><strong>Winchester heads — the answer the industry settled on.</strong> The slide's four claims: (1) used in <strong>sealed drive assemblies that are almost free of contaminants</strong>; (2) designed to operate <strong>closer to the disk's surface than conventional rigid disk heads</strong>, thus allowing greater data density; (3) it is actually an <strong>aerodynamic foil</strong> that <em>rests lightly on the platter's surface when the disk is motionless</em>; (4) <strong>the air pressure generated by a spinning disk is enough to make the foil rise above the surface</strong>.</li>
<li><strong>Point 3 is the one students get wrong.</strong> When the drive is <em>off</em>, the head is touching. It flies only because the disk is spinning. That is why a modern drive parks its heads on a ramp outside the data area when it spins down, and why the emergency "unload heads" command exists.</li>
<li><strong>The sealed assembly is what makes low flying legal.</strong> A speck of smoke is thousands of times taller than the flying height. Seal the assembly and you remove the contaminants; remove the contaminants and step 4 above stops being fatal. Sealing also explains why hard disks are non-removable (slide 9) — the two design choices are the same choice.</li>
<li><strong>Head crash, defined.</strong> If the foil touches the medium while it is spinning at full speed, the coating is scraped off and the data on that track is physically destroyed. This is not a recoverable software error. It is the reason the slide talks about impurities at all.</li>
<li><strong>Where the name comes from.</strong> IBM's 1973 drive, model 3340, had two 30 MB modules — "30-30", like the Winchester rifle cartridge. The name stuck to the whole sealed, flying-head, low-fly-height design philosophy.</li>
</ul>
<p class="meo">💡 Remember it as a <strong>hovercraft on a record</strong>: parked, it sits on the surface; up to speed, it hovers on its own air cushion micrometres above the disc, and the faster the disc spins the more firmly it hovers. Stop the disc suddenly and the hovercraft lands — which is why dropping a running laptop is worse than dropping a sleeping one.</p>`,
        `<p class="y-chinh">🎯 Slide phát biểu mâu thuẫn kỹ thuật trung tâm của cả câu chuyện đĩa từ thành một chuỗi bốn câu. Đọc theo thứ tự thì đầu Winchester trở thành điều tất yếu.</p>
<table>
<tr><th>Bước</th><th>Câu trên slide</th><th>Hệ quả</th></tr>
<tr><td>1</td><td>Đầu đọc phải sinh ra hoặc cảm nhận được từ trường <strong>ĐỦ LỚN</strong> để ghi và đọc cho đúng</td><td>Cường độ tín hiệu là thứ không mặc cả được</td></tr>
<tr><td>2</td><td>Đầu càng <strong>HẸP thì càng phải SÁT</strong> mặt đĩa mới hoạt động được</td><td>Đầu hẹp ⇒ từ trường yếu ⇒ phải bay thấp hơn để bù</td></tr>
<tr><td>3</td><td>Đầu hẹp hơn nghĩa là <strong>track hẹp hơn</strong> và do đó <strong>MẬT ĐỘ DỮ LIỆU CAO HƠN</strong></td><td>Đầu hẹp là thứ bạn MUỐN — nó là dung lượng</td></tr>
<tr><td>4</td><td>Đầu càng <strong>SÁT đĩa thì RỦI RO càng lớn</strong>, lỗi do tạp chất hoặc khuyết tật</td><td>Và đây là cái giá</td></tr>
</table>
<p class="dap-an">✅ Ghép bốn câu lại: <strong>DUNG LƯỢNG ép đầu đọc xuống, ĐỘ TIN CẬY đẩy nó lên.</strong> Mỗi thế hệ ổ cứng là một lời giải mới cho đúng cuộc kéo co đó — và đế thuỷ tinh ở slide 2 chính là một lời giải như vậy (mặt phẳng hơn, sạch hơn thì bay thấp hơn mà rủi ro không đổi).</p>
<ul>
<li><strong>Đầu Winchester — lời giải mà ngành công nghiệp chốt lại.</strong> Bốn khẳng định của slide: (1) dùng trong <strong>cụm ổ ĐƯỢC HÀN KÍN, gần như không còn tạp chất</strong>; (2) thiết kế để chạy <strong>SÁT mặt đĩa hơn đầu đĩa cứng thông thường</strong>, nhờ đó cho mật độ dữ liệu cao hơn; (3) thực chất nó là một <strong>lá khí động học</strong> mà <em>khi đĩa đứng yên thì nó tì nhẹ lên mặt mâm</em>; (4) <strong>áp suất không khí do đĩa quay sinh ra là đủ để nâng lá đó lên khỏi bề mặt</strong>.</li>
<li><strong>Điểm 3 là chỗ sinh viên hay hiểu sai.</strong> Khi ổ đĩa TẮT, đầu đọc đang CHẠM vào mặt đĩa. Nó bay được chỉ vì đĩa đang quay. Đó là lý do ổ hiện đại đỗ đầu đọc lên một cái dốc nằm ngoài vùng dữ liệu khi dừng quay, và là lý do tồn tại lệnh "unload heads" khẩn cấp.</li>
<li><strong>Cụm hàn kín mới là thứ khiến bay thấp trở nên hợp lệ.</strong> Một hạt khói cao gấp hàng nghìn lần độ cao bay. Hàn kín cụm đĩa là loại bỏ tạp chất; loại bỏ tạp chất thì bước 4 ở trên thôi chí mạng. Hàn kín cũng giải thích luôn vì sao ổ cứng không rút ra được (slide 9) — hai lựa chọn thiết kế ấy là MỘT lựa chọn.</li>
<li><strong>Head crash, định nghĩa.</strong> Nếu lá khí động chạm vào môi trường khi nó đang quay hết tốc độ thì lớp phủ bị cạo đi và dữ liệu trên track đó bị phá huỷ VẬT LÝ. Đây không phải lỗi phần mềm khôi phục được. Đó là lý do slide phải nhắc tới tạp chất.</li>
<li><strong>Cái tên từ đâu ra.</strong> Ổ đĩa năm 1973 của IBM, model 3340, có hai khối 30 MB — "30-30", giống tên đạn súng trường Winchester. Cái tên dính luôn vào cả triết lý thiết kế hàn kín, đầu bay, độ cao bay thấp.</li>
</ul>
<p class="meo">💡 Nhớ nó như một <strong>chiếc tàu đệm khí trên mặt đĩa than</strong>: đỗ thì nó nằm trên bề mặt; đủ tốc độ thì nó lơ lửng trên chính đệm không khí của mình, cách mặt đĩa vài micromet, và đĩa quay càng nhanh thì nó lơ lửng càng vững. Dừng đĩa đột ngột là tàu hạ cánh — nên đánh rơi laptop đang chạy tệ hơn đánh rơi laptop đang ngủ.</p>`],

      [11, 'Figure 7.5 — Timing of a Disk I/O Transfer (seek time t_S, latency time t_L, transfer time t_T)',
        `<p class="y-chinh">🎯 <strong>The single most examinable picture in the chapter.</strong> One platter, one arm, one highlighted block, and three labelled arcs: the arm moves in (<strong>seek time t<sub>S</sub></strong>), the disk rotates the block round to the head (<strong>latency time t<sub>L</sub></strong>), and the block finally passes under the head (<strong>transfer time t<sub>T</sub></strong>). Add them up and you have the block access time.</p>
<p class="nhan">📐 The formula, in the form every exam question uses:</p>
<table>
<tr><th>Symbol</th><th>Name</th><th>How to compute it</th></tr>
<tr><td>t<sub>S</sub></td><td>Seek time</td><td><strong>Given in the problem</strong> (an average, e.g. 4 ms or 8 ms). Zero on a fixed-head disk, zero when staying on the same track.</td></tr>
<tr><td>t<sub>L</sub></td><td>Rotational delay / latency</td><td><strong>Half a revolution on average</strong> = 1/(2r) where r = revolutions per second</td></tr>
<tr><td>t<sub>T</sub></td><td>Transfer time</td><td><strong>b / (r × N)</strong> where b = bytes to transfer, r = rev/s, N = bytes per track</td></tr>
<tr><td>t<sub>a</sub></td><td>Block access time</td><td><strong>t<sub>a</sub> = t<sub>S</sub> + 1/(2r) + b/(r×N)</strong></td></tr>
</table>
<p class="nhan">📐 Unit conversion, done once so you never do it again (verified with python3):</p>
<table>
<tr><th>Spindle speed</th><th>r (rev/s)</th><th>One revolution</th><th>Average latency = half a turn</th></tr>
<tr><td>5400 rpm</td><td>90</td><td>11,1111 ms</td><td><strong>5,5556 ms</strong></td></tr>
<tr><td>7200 rpm</td><td><strong>120</strong></td><td><strong>8,3333 ms</strong></td><td><strong>4,1667 ms</strong></td></tr>
<tr><td>10 000 rpm</td><td>166,67</td><td>6,0 ms</td><td>3,0 ms</td></tr>
<tr><td>15 030 rpm</td><td>250,5</td><td>3,992 ms</td><td>1,996 ms</td></tr>
</table>
<p class="nhan">📐 <strong>Problem 1 — read ONE sector.</strong> Drive: average seek 8 ms, 7200 rpm, 512 sectors of 512 B per track (so N = 262 144 B/track). Read one 512-byte sector.</p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>r</td><td>7200 ÷ 60</td><td>120 rev/s</td></tr>
<tr><td>Peak media rate r×N</td><td>120 × 262 144</td><td>31 457 280 B/s = 31,457 MB/s</td></tr>
<tr><td>t<sub>S</sub></td><td>given</td><td>8,0000 ms</td></tr>
<tr><td>t<sub>L</sub></td><td>1/(2×120) s</td><td>4,1667 ms</td></tr>
<tr><td>t<sub>T</sub></td><td>512 ÷ 31 457 280 s</td><td>0,0163 ms (16,3 µs)</td></tr>
<tr><td><strong>t<sub>a</sub></strong></td><td>8 + 4,1667 + 0,0163</td><td><strong>12,183 ms</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>12,183 ms</strong> — of which the actual data transfer is <strong>0,13 %</strong>. Positioning (seek + rotation) is <strong>99,87 %</strong> of the cost. Say that sentence out loud: to move 512 bytes the drive spent 12,17 ms doing nothing but getting into position.</p>
<p class="nhan">📐 <strong>Problem 2 — read a WHOLE track (262 144 B) from the same drive.</strong></p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>t<sub>S</sub> + t<sub>L</sub></td><td>unchanged</td><td>12,1667 ms</td></tr>
<tr><td>t<sub>T</sub></td><td>262 144 ÷ 31 457 280 s = one full revolution</td><td>8,3333 ms</td></tr>
<tr><td><strong>t<sub>a</sub></strong></td><td>8 + 4,1667 + 8,3333</td><td><strong>20,5 ms</strong></td></tr>
<tr><td>Effective rate</td><td>262 144 B ÷ 0,0205 s</td><td>12,787 MB/s</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>20,5 ms for 256 kB = 12,787 MB/s effective</strong>, against a peak media rate of 31,457 MB/s — you achieve only <strong>40,65 %</strong> of what the surface can deliver. Compare with Problem 1: 512× more data cost only 1,68× more time. <strong>Asking for more data per request is nearly free; asking more often is not.</strong></p>
<p class="meo">💡 Memorise the shape, not the numbers: <strong>t<sub>a</sub> = t<sub>S</sub> + half a turn + b/(r·N)</strong>. Under exam pressure, first write "rpm ÷ 60 = r", then "latency = 1/(2r)", then everything else falls out.</p>
<p class="pitfall">⚠️ Three traps in one line. (1) Latency is <em>half</em> a revolution, not a whole one — the head lands at a random angle, so on average it waits half a turn. (2) t<sub>T</sub> uses <em>N = bytes per TRACK</em>, not bytes per sector and not drive capacity. (3) The formula assumes a constant N, i.e. CAV (slide 6); on a real zoned drive N varies by zone, which the exam ignores.</p>`,
        `<p class="y-chinh">🎯 <strong>Bức hình dễ ra đề thi nhất của cả chương.</strong> Một mâm đĩa, một cần, một khối được tô đậm, và ba cung có nhãn: cần dịch vào (<strong>seek time t<sub>S</sub></strong>), đĩa quay đưa khối tới chỗ đầu đọc (<strong>latency time t<sub>L</sub></strong>), rồi khối đi qua dưới đầu đọc (<strong>transfer time t<sub>T</sub></strong>). Cộng ba cái lại là thời gian truy cập khối.</p>
<p class="nhan">📐 Công thức, viết đúng dạng mọi đề thi dùng:</p>
<table>
<tr><th>Ký hiệu</th><th>Tên</th><th>Tính thế nào</th></tr>
<tr><td>t<sub>S</sub></td><td>Thời gian tìm track (seek)</td><td><strong>ĐỀ CHO</strong> (một giá trị trung bình, ví dụ 4 ms hoặc 8 ms). Bằng 0 với đĩa đầu cố định, bằng 0 khi ở nguyên track cũ.</td></tr>
<tr><td>t<sub>L</sub></td><td>Độ trễ quay</td><td><strong>Trung bình NỬA VÒNG</strong> = 1/(2r) với r = số vòng mỗi giây</td></tr>
<tr><td>t<sub>T</sub></td><td>Thời gian truyền</td><td><strong>b / (r × N)</strong> với b = số byte cần truyền, r = vòng/giây, N = số byte mỗi track</td></tr>
<tr><td>t<sub>a</sub></td><td>Thời gian truy cập khối</td><td><strong>t<sub>a</sub> = t<sub>S</sub> + 1/(2r) + b/(r×N)</strong></td></tr>
</table>
<p class="nhan">📐 Đổi đơn vị, làm một lần cho khỏi phải làm lại (đã kiểm bằng python3):</p>
<table>
<tr><th>Tốc độ quay</th><th>r (vòng/s)</th><th>Một vòng</th><th>Độ trễ quay trung bình = nửa vòng</th></tr>
<tr><td>5400 vòng/phút</td><td>90</td><td>11,1111 ms</td><td><strong>5,5556 ms</strong></td></tr>
<tr><td>7200 vòng/phút</td><td><strong>120</strong></td><td><strong>8,3333 ms</strong></td><td><strong>4,1667 ms</strong></td></tr>
<tr><td>10 000 vòng/phút</td><td>166,67</td><td>6,0 ms</td><td>3,0 ms</td></tr>
<tr><td>15 030 vòng/phút</td><td>250,5</td><td>3,992 ms</td><td>1,996 ms</td></tr>
</table>
<p class="nhan">📐 <strong>BÀI 1 — đọc MỘT sector.</strong> Ổ đĩa: seek trung bình 8 ms, 7200 vòng/phút, mỗi track 512 sector × 512 B (tức N = 262 144 B/track). Đọc một sector 512 byte.</p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>r</td><td>7200 ÷ 60</td><td>120 vòng/s</td></tr>
<tr><td>Tốc độ đỉnh của mặt đĩa r×N</td><td>120 × 262 144</td><td>31 457 280 B/s = 31,457 MB/s</td></tr>
<tr><td>t<sub>S</sub></td><td>đề cho</td><td>8,0000 ms</td></tr>
<tr><td>t<sub>L</sub></td><td>1/(2×120) s</td><td>4,1667 ms</td></tr>
<tr><td>t<sub>T</sub></td><td>512 ÷ 31 457 280 s</td><td>0,0163 ms (16,3 µs)</td></tr>
<tr><td><strong>t<sub>a</sub></strong></td><td>8 + 4,1667 + 0,0163</td><td><strong>12,183 ms</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>12,183 ms</strong> — trong đó phần TRUYỀN DỮ LIỆU thật chỉ chiếm <strong>0,13 %</strong>. Việc đưa đầu vào vị trí (seek + quay) chiếm <strong>99,87 %</strong>. Hãy đọc to câu này: để chuyển 512 byte, ổ đĩa đã bỏ ra 12,17 ms không làm gì ngoài việc vào chỗ.</p>
<p class="nhan">📐 <strong>BÀI 2 — đọc TRỌN MỘT TRACK (262 144 B) trên cùng ổ đó.</strong></p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>t<sub>S</sub> + t<sub>L</sub></td><td>không đổi</td><td>12,1667 ms</td></tr>
<tr><td>t<sub>T</sub></td><td>262 144 ÷ 31 457 280 s = đúng một vòng quay</td><td>8,3333 ms</td></tr>
<tr><td><strong>t<sub>a</sub></strong></td><td>8 + 4,1667 + 8,3333</td><td><strong>20,5 ms</strong></td></tr>
<tr><td>Tốc độ hiệu dụng</td><td>262 144 B ÷ 0,0205 s</td><td>12,787 MB/s</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>20,5 ms cho 256 kB = 12,787 MB/s hiệu dụng</strong>, so với tốc độ đỉnh của mặt đĩa là 31,457 MB/s — bạn chỉ khai thác được <strong>40,65 %</strong> khả năng của mặt đĩa. Đối chiếu với Bài 1: dữ liệu nhiều gấp 512 lần mà chỉ tốn thêm 1,68 lần thời gian. <strong>Xin NHIỀU dữ liệu hơn mỗi lần thì gần như miễn phí; xin NHIỀU LẦN hơn thì không.</strong></p>
<p class="meo">💡 Thuộc DÁNG công thức chứ đừng thuộc con số: <strong>t<sub>a</sub> = t<sub>S</sub> + nửa vòng + b/(r·N)</strong>. Vào phòng thi, cứ viết trước "rpm ÷ 60 = r", rồi "độ trễ quay = 1/(2r)", phần còn lại tự rơi ra.</p>
<p class="pitfall">⚠️ Ba bẫy trong một dòng. (1) Độ trễ quay là <em>NỬA</em> vòng, không phải trọn vòng — đầu đọc đáp xuống ở một góc ngẫu nhiên nên trung bình chờ nửa vòng. (2) t<sub>T</sub> dùng <em>N = số byte mỗi TRACK</em>, không phải số byte mỗi sector, càng không phải dung lượng ổ. (3) Công thức giả thiết N là hằng số, tức giả thiết CAV (slide 6); ổ thật có phân vùng thì N đổi theo vùng, đề thi bỏ qua chuyện đó.</p>`],

      [12, 'Disk Performance Parameters — seek time, rotational delay, transfer time, block access time',
        `<p class="y-chinh">🎯 The words behind the picture of slide 11, in the book's own phrasing — and then the comparison that justifies this entire course: <strong>reading the same file sequentially versus randomly differs by a factor of three hundred</strong>.</p>
<table>
<tr><th>Term</th><th>The slide's definition</th></tr>
<tr><td><strong>Seek time</strong></td><td>On a movable-head system, the time it takes to <em>position the head at the track</em></td></tr>
<tr><td><strong>Rotational delay</strong> (latency time)</td><td>The time it takes for the <em>beginning of the sector to reach the head</em></td></tr>
<tr><td><strong>Transfer time</strong></td><td>Once the head is in position, the read or write operation is performed <em>as the sector moves under the head</em> — this is the data-transfer portion</td></tr>
<tr><td><strong>Block access time</strong> (access time)</td><td>The <em>sum</em> of the seek time, the latency time, and the transfer time</td></tr>
</table>
<ul>
<li><strong>The three sentences before the definitions set the stage.</strong> "When the drive is operating the disk is rotating at <em>constant speed</em>" — constant, so latency is predictable. "To read or write the head must be positioned at the desired track <em>and</em> at the beginning of the desired sector" — two conditions, hence two waits. "Track selection involves <em>moving</em> the head in a movable-head system or <em>electronically selecting</em> one head on a fixed-head system" — which is why fixed-head disks have no seek time.</li>
<li><strong>Seek time is not one number.</strong> The figure quoted on spec sheets is an <em>average</em> over all possible arm movements. A track-to-track seek is a fraction of a millisecond; a full-stroke seek is two or three times the average. This is exactly why an OS bothers with disk-arm scheduling (SCAN, C-SCAN) — see CEA201 Ch.8 and any OS course.</li>
</ul>
<p class="nhan">📐 <strong>BÀI 3 — the classic sequential-versus-random comparison (this is the textbook's own example).</strong> Drive: average seek 4 ms, 7500 rpm, 500 sectors of 512 B per track. File: 2500 sectors = 1 280 000 B ≈ 1,22 MiB, occupying 5 adjacent tracks. Assume track-to-track seek ≈ 0.</p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>One revolution</td><td>60 ÷ 7500 s</td><td>8,0 ms</td></tr>
<tr><td>Average latency</td><td>8,0 ÷ 2</td><td>4,0 ms</td></tr>
<tr><td>Time for one sector to pass</td><td>8,0 ÷ 500</td><td>0,016 ms</td></tr>
<tr><td><strong>Sequential</strong>: first track</td><td>4 (seek) + 4 (latency) + 8 (read all 500 sectors = one full turn)</td><td>16 ms</td></tr>
<tr><td><strong>Sequential</strong>: each of the 4 remaining tracks</td><td>0 (no seek) + 4 (latency) + 8 (one full turn)</td><td>12 ms each</td></tr>
<tr><td><strong>Sequential total</strong></td><td>16 + 4×12</td><td><strong>64 ms</strong></td></tr>
<tr><td><strong>Random</strong>: per sector</td><td>4 + 4 + 0,016</td><td>8,016 ms</td></tr>
<tr><td><strong>Random total</strong></td><td>2500 × 8,016</td><td><strong>20 040 ms = 20,04 s</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>64 ms sequential versus 20,04 s random — a factor of 313,1.</strong> In throughput terms: <strong>20,0 MB/s</strong> against <strong>62,4 kB/s</strong>. Identical drive, identical bytes, identical total work for the CPU. The only difference is the <em>order</em> in which the blocks were asked for. This is the most important number in the chapter.</p>
<p class="nhan">📐 <strong>BÀI 4 — the same comparison in modern units.</strong> Drive from Problem 1 (seek 8 ms, 7200 rpm, N = 262 144 B). Read 1 MiB = 1 048 576 B, (a) as 256 random 4 kB blocks, (b) as one contiguous run.</p>
<table>
<tr><th>Step</th><th>(a) 256 random 4 kB reads</th><th>(b) one sequential 1 MiB read</th></tr>
<tr><td>t<sub>S</sub> + t<sub>L</sub> per request</td><td>12,1667 ms × 256</td><td>12,1667 ms × 1</td></tr>
<tr><td>t<sub>T</sub></td><td>4096 ÷ 31 457 280 = 0,1302 ms, ×256</td><td>1 048 576 ÷ 31 457 280 = 33,3333 ms</td></tr>
<tr><td>Per request</td><td>12,2969 ms</td><td>—</td></tr>
<tr><td><strong>Total</strong></td><td><strong>3148,0 ms = 3,148 s</strong></td><td><strong>45,5 ms</strong></td></tr>
<tr><td>Effective throughput</td><td>0,333 MB/s</td><td>23,05 MB/s</td></tr>
<tr><td>IOPS</td><td>81,3 operations/s</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>3,148 s versus 45,5 ms — 69,2× slower</strong> for the very same megabyte. And note the ceiling this puts on a magnetic disk: <strong>about 81 random I/O operations per second, full stop.</strong> That number is not a benchmark, it is arithmetic — 1000 ÷ 12,3 — and no firmware, cable or file system can beat it, because it is the speed of a moving arm.</p>
<p class="nhan">📐 <strong>BÀI 5 — how much better is an SSD?</strong> An NVMe SSD has no arm and no platter; a 4 kB read completes in roughly 0,02 ms (20 µs), and there is no seek term at all.</p>
<table>
<tr><th>Operation</th><th>Magnetic disk</th><th>NVMe SSD</th><th>Ratio</th></tr>
<tr><td>Read one 512 B sector (Problem 1)</td><td>12,183 ms</td><td>≈ 0,02 ms</td><td><strong>609×</strong></td></tr>
<tr><td>One random 4 kB read (Problem 4)</td><td>12,297 ms</td><td>≈ 0,02 ms</td><td><strong>615×</strong></td></tr>
<tr><td>Random IOPS, one request at a time</td><td>81,3</td><td>50 000</td><td><strong>615×</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: on <em>random</em> work the SSD is roughly <strong>600 times faster</strong>, and that gap comes almost entirely from the two terms it does not have — seek and rotational delay. On <em>sequential</em> work the gap collapses to single digits, because there the disk is finally doing what it is good at. Slide 27 lists the SSD advantages qualitatively; this is the same claim with a number on it.</p>
<ul>
<li><strong>Connect to CSI106 chapter 10 (file access methods).</strong> That chapter divides file organisation into <em>sequential</em>, <em>indexed</em> and <em>direct/hashed</em> access and tells you sequential is cheap and random is expensive. Problem 3 is <em>why</em>: the cost is not in the software, it is 8 ms of arm movement per unpredictable jump. An indexed file is a bargain precisely because one index lookup replaces many random probes.</li>
<li><strong>Connect to PRF192 chapter 10 (<code>fseek</code>).</strong> <code>fseek(fp, offset, SEEK_SET)</code> costs you nothing in the C library — it just sets a counter. The bill arrives on the next <code>fread</code>, when the OS discovers the block is not in its buffer cache and the arm must move. A loop that seeks and reads 4 kB at random 256 times is Problem 4a: <strong>3,1 seconds</strong>. The same loop reading forward is 45 ms. That is why "read the file in order and process it" beats "seek around the file" by two orders of magnitude, and why buffered I/O exists at all.</li>
<li><strong>Connect back to Ch.4.</strong> Spatial locality was an <em>observation</em> about programs there; here it becomes a <em>business case</em>. Defragmentation, file-system extents, database clustered indexes, log-structured writes — all of them are attempts to turn the 20,04 s case into the 64 ms case.</li>
</ul>
<p class="pitfall">⚠️ <strong>"Bloc access time" on the slide is a typo</strong> for <em>Block access time</em>, and the transfer-time bullet is split awkwardly across two lines ("the read or write operation is then / performed as the sector moves under the head"). Neither changes the meaning — do not read "Bloc" as a different quantity.</p>`,
        `<p class="y-chinh">🎯 Phần chữ đứng sau bức hình của slide 11, giữ nguyên cách diễn đạt của sách — rồi tới phép so sánh biện minh cho cả môn học này: <strong>đọc cùng một tệp theo thứ tự so với đọc ngẫu nhiên chênh nhau BA TRĂM LẦN</strong>.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa của slide</th></tr>
<tr><td><strong>Seek time</strong></td><td>Trên hệ đầu di động, thời gian để <em>đưa đầu đọc tới đúng track</em></td></tr>
<tr><td><strong>Rotational delay</strong> (độ trễ quay)</td><td>Thời gian để <em>ĐẦU của sector quay tới chỗ đầu đọc</em></td></tr>
<tr><td><strong>Transfer time</strong></td><td>Khi đầu đã vào vị trí, thao tác đọc/ghi diễn ra <em>trong lúc sector chạy qua dưới đầu đọc</em> — đây là phần truyền dữ liệu</td></tr>
<tr><td><strong>Block access time</strong> (thời gian truy cập)</td><td><em>TỔNG</em> của seek time, latency time và transfer time</td></tr>
</table>
<ul>
<li><strong>Ba câu trước phần định nghĩa dựng sẵn bối cảnh.</strong> "Khi ổ đang chạy thì đĩa quay ở <em>TỐC ĐỘ KHÔNG ĐỔI</em>" — không đổi nên độ trễ quay dự đoán được. "Để đọc hay ghi, đầu phải được đặt đúng track <em>VÀ</em> đúng đầu sector cần" — hai điều kiện, nên có hai lần chờ. "Chọn track nghĩa là <em>DI CHUYỂN</em> đầu ở hệ đầu di động, hoặc <em>CHỌN BẰNG ĐIỆN</em> một đầu ở hệ đầu cố định" — chính vì thế đĩa đầu cố định không có seek time.</li>
<li><strong>Seek time không phải một con số duy nhất.</strong> Con số ghi trên tờ thông số là TRUNG BÌNH của mọi quãng dịch chuyển có thể. Seek từ track này sang track kề bên chỉ mất một phần nhỏ mili giây; seek hết chiều dài thì gấp hai ba lần trung bình. Đó chính là lý do hệ điều hành phải có thuật toán xếp lịch cần đĩa (SCAN, C-SCAN) — xem CEA201 Ch.8 và bất kỳ môn hệ điều hành nào.</li>
</ul>
<p class="nhan">📐 <strong>BÀI 3 — phép so sánh kinh điển TUẦN TỰ với NGẪU NHIÊN (đây là ví dụ của chính giáo trình).</strong> Ổ đĩa: seek trung bình 4 ms, 7500 vòng/phút, mỗi track 500 sector × 512 B. Tệp: 2500 sector = 1 280 000 B ≈ 1,22 MiB, nằm trên 5 track liền kề. Giả thiết seek giữa hai track kề ≈ 0.</p>
<table>
<tr><th>Bước</th><th>Phép tính</th><th>Kết quả</th></tr>
<tr><td>Một vòng quay</td><td>60 ÷ 7500 s</td><td>8,0 ms</td></tr>
<tr><td>Độ trễ quay trung bình</td><td>8,0 ÷ 2</td><td>4,0 ms</td></tr>
<tr><td>Thời gian một sector chạy qua</td><td>8,0 ÷ 500</td><td>0,016 ms</td></tr>
<tr><td><strong>TUẦN TỰ</strong>: track đầu tiên</td><td>4 (seek) + 4 (quay) + 8 (đọc cả 500 sector = trọn một vòng)</td><td>16 ms</td></tr>
<tr><td><strong>TUẦN TỰ</strong>: mỗi track trong 4 track còn lại</td><td>0 (không seek) + 4 (quay) + 8 (trọn một vòng)</td><td>12 ms mỗi track</td></tr>
<tr><td><strong>Tổng TUẦN TỰ</strong></td><td>16 + 4×12</td><td><strong>64 ms</strong></td></tr>
<tr><td><strong>NGẪU NHIÊN</strong>: mỗi sector</td><td>4 + 4 + 0,016</td><td>8,016 ms</td></tr>
<tr><td><strong>Tổng NGẪU NHIÊN</strong></td><td>2500 × 8,016</td><td><strong>20 040 ms = 20,04 s</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>64 ms khi đọc tuần tự so với 20,04 s khi đọc ngẫu nhiên — chênh 313,1 lần.</strong> Quy ra thông lượng: <strong>20,0 MB/s</strong> so với <strong>62,4 kB/s</strong>. Cùng ổ đĩa, cùng số byte, CPU làm y hệt một khối lượng việc. Khác biệt duy nhất là THỨ TỰ mà các khối được hỏi tới. Đây là con số quan trọng nhất của cả chương.</p>
<p class="nhan">📐 <strong>BÀI 4 — vẫn phép so sánh đó nhưng bằng đơn vị hiện đại.</strong> Ổ đĩa của Bài 1 (seek 8 ms, 7200 vòng/phút, N = 262 144 B). Đọc 1 MiB = 1 048 576 B, (a) thành 256 khối 4 kB rải ngẫu nhiên, (b) thành một dải liền mạch.</p>
<table>
<tr><th>Bước</th><th>(a) 256 lần đọc 4 kB ngẫu nhiên</th><th>(b) một lần đọc 1 MiB tuần tự</th></tr>
<tr><td>t<sub>S</sub> + t<sub>L</sub> mỗi yêu cầu</td><td>12,1667 ms × 256</td><td>12,1667 ms × 1</td></tr>
<tr><td>t<sub>T</sub></td><td>4096 ÷ 31 457 280 = 0,1302 ms, ×256</td><td>1 048 576 ÷ 31 457 280 = 33,3333 ms</td></tr>
<tr><td>Mỗi yêu cầu</td><td>12,2969 ms</td><td>—</td></tr>
<tr><td><strong>Tổng</strong></td><td><strong>3148,0 ms = 3,148 s</strong></td><td><strong>45,5 ms</strong></td></tr>
<tr><td>Thông lượng hiệu dụng</td><td>0,333 MB/s</td><td>23,05 MB/s</td></tr>
<tr><td>IOPS</td><td>81,3 thao tác/giây</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>3,148 s so với 45,5 ms — chậm hơn 69,2 lần</strong> cho đúng một megabyte như nhau. Và để ý cái trần mà nó đặt lên đĩa từ: <strong>khoảng 81 thao tác vào/ra ngẫu nhiên mỗi giây, hết.</strong> Con số đó không phải kết quả đo benchmark, nó là PHÉP CHIA — 1000 ÷ 12,3 — và không firmware, dây cáp hay hệ tệp nào vượt qua được, vì đó là tốc độ của một cánh tay cơ khí.</p>
<p class="nhan">📐 <strong>BÀI 5 — SSD hơn bao nhiêu?</strong> SSD NVMe không có cần, không có mâm quay; một lần đọc 4 kB xong trong khoảng 0,02 ms (20 µs), và KHÔNG có số hạng seek nào cả.</p>
<table>
<tr><th>Thao tác</th><th>Đĩa từ</th><th>SSD NVMe</th><th>Tỉ số</th></tr>
<tr><td>Đọc một sector 512 B (Bài 1)</td><td>12,183 ms</td><td>≈ 0,02 ms</td><td><strong>609 lần</strong></td></tr>
<tr><td>Một lần đọc 4 kB ngẫu nhiên (Bài 4)</td><td>12,297 ms</td><td>≈ 0,02 ms</td><td><strong>615 lần</strong></td></tr>
<tr><td>IOPS ngẫu nhiên, mỗi lúc một yêu cầu</td><td>81,3</td><td>50 000</td><td><strong>615 lần</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: với việc <em>NGẪU NHIÊN</em>, SSD nhanh hơn khoảng <strong>600 lần</strong>, và khoảng cách đó đến gần như trọn vẹn từ hai số hạng mà nó KHÔNG CÓ — seek và độ trễ quay. Với việc <em>TUẦN TỰ</em>, khoảng cách tụt xuống còn vài lần, vì lúc đó đĩa từ mới được làm đúng việc nó giỏi. Slide 27 liệt kê ưu điểm của SSD bằng lời; đây là đúng khẳng định ấy nhưng có con số kèm theo.</p>
<ul>
<li><strong>Nối sang CSI106 chương 10 (phương thức truy cập tệp).</strong> Chương đó chia tổ chức tệp thành <em>tuần tự</em>, <em>có chỉ mục</em> và <em>trực tiếp/băm</em>, rồi bảo tuần tự thì rẻ còn ngẫu nhiên thì đắt. Bài 3 chính là câu trả lời cho chữ <em>VÌ SAO</em>: cái giá không nằm ở phần mềm, nó là 8 ms dịch cần cho mỗi lần nhảy không đoán trước được. Tệp có chỉ mục là món hời chính vì một lần tra chỉ mục thay thế cho rất nhiều lần dò ngẫu nhiên.</li>
<li><strong>Nối sang PRF192 chương 10 (<code>fseek</code>).</strong> <code>fseek(fp, offset, SEEK_SET)</code> chẳng tốn gì trong thư viện C — nó chỉ đặt lại một biến đếm. Hoá đơn tới ở lần <code>fread</code> kế tiếp, khi hệ điều hành phát hiện khối đó không có trong bộ đệm và cánh tay phải dịch chuyển. Một vòng lặp nhảy rồi đọc 4 kB ngẫu nhiên 256 lần chính là Bài 4a: <strong>3,1 giây</strong>. Cùng vòng lặp đó mà đọc xuôi thì 45 ms. Đó là lý do "đọc tệp theo thứ tự rồi xử lý" thắng "nhảy lung tung trong tệp" hai bậc độ lớn, và là lý do vào/ra có bộ đệm tồn tại.</li>
<li><strong>Nối ngược về Ch.4.</strong> Ở đó cục bộ không gian mới chỉ là một <em>NHẬN XÉT</em> về chương trình; ở đây nó thành một <em>BÀI TOÁN KINH TẾ</em>. Chống phân mảnh, extent của hệ tệp, chỉ mục clustered của cơ sở dữ liệu, ghi theo kiểu log — tất cả đều là nỗ lực biến trường hợp 20,04 s thành trường hợp 64 ms.</li>
</ul>
<p class="pitfall">⚠️ <strong>"Bloc access time" trên slide là LỖI GÕ</strong> của <em>Block access time</em>, và gạch đầu dòng về transfer time bị ngắt đôi khó đọc ("the read or write operation is then / performed as the sector moves under the head"). Cả hai đều không đổi nghĩa — đừng đọc "Bloc" thành một đại lượng khác.</p>`],

      [13, 'Table 7.2 — Typical Hard Disk Drive Parameters (Ultrastar HE, Ultrastar C15K600, Toshiba L200)',
        `<p class="y-chinh">🎯 Three real drives side by side — <strong>enterprise, data centre, laptop</strong> — so you can see that the formula of slide 11 is not academic: every symbol in it has a column in this table.</p>
<table>
<tr><th>Characteristic</th><th>HGST Ultrastar HE<br/>(Enterprise)</th><th>HGST Ultrastar C15K600<br/>(Data Center)</th><th>Toshiba L200<br/>(Laptop)</th></tr>
<tr><td>Capacity</td><td>12 TB</td><td>600 GB</td><td>500 GB</td></tr>
<tr><td>Average seek time</td><td>8,0 ms read / 8,6 ms write</td><td>2,9 ms read / 3,1 ms write</td><td>11 ms</td></tr>
<tr><td>Spindle speed</td><td>7200 rpm</td><td>15 030 rpm</td><td>5400 rpm</td></tr>
<tr><td>Average latency</td><td>4.16 <em>(no unit printed)</em></td><td>&lt; 2 ms</td><td>5,6 ms</td></tr>
<tr><td>Max sustained transfer rate</td><td>255 MB/s</td><td>1,2 GB/s <em>(see warning)</em></td><td>3 GB/s <em>(see warning)</em></td></tr>
<tr><td>Bytes per sector</td><td>512/4096</td><td>512/4096</td><td>4096</td></tr>
<tr><td>Tracks per cylinder (platter surfaces)</td><td>8</td><td>6</td><td>4</td></tr>
<tr><td>Cache</td><td>256 MB</td><td>128 MB</td><td>16 MB</td></tr>
<tr><td>Diameter</td><td>3.5 in (8,89 cm)</td><td>2.5 in (6,35 cm)</td><td>2.5 in (6,35 cm)</td></tr>
<tr><td>Max areal density (Gb/cm<sup>2</sup>)</td><td>134</td><td>82</td><td>66</td></tr>
</table>
<p class="nhan">📐 <strong>BÀI 6 — check the table against the formula.</strong> Average latency must be exactly half a revolution, so it is fully determined by the spindle speed. Compute it for all three drives and compare with the printed values:</p>
<table>
<tr><th>Drive</th><th>rpm</th><th>1/(2r) = 60 000 ÷ (2 × rpm)</th><th>Table says</th><th>Verdict</th></tr>
<tr><td>Ultrastar HE</td><td>7200</td><td><strong>4,1667 ms</strong></td><td>4.16</td><td>✔ (rounded down; unit missing)</td></tr>
<tr><td>Ultrastar C15K600</td><td>15 030</td><td><strong>1,9960 ms</strong></td><td>&lt; 2 ms</td><td>✔ exactly right</td></tr>
<tr><td>Toshiba L200</td><td>5400</td><td><strong>5,5556 ms</strong></td><td>5,6 ms</td><td>✔ (rounded up)</td></tr>
</table>
<p class="dap-an">✅ All three match. That is the useful lesson: <strong>you never have to memorise average latency — derive it.</strong> And it explains why data-centre drives spin at 15 000 rpm despite the noise, heat and power: it is the only way to cut the latency term, which halves from 4,17 ms to 2,00 ms.</p>
<p class="nhan">📐 <strong>BÀI 7 — what "8 tracks per cylinder" buys you.</strong> Ultrastar HE, 7200 rpm, take N = 262 144 B per track as in Problem 1. Read one whole cylinder (all 8 tracks) versus reading 8 tracks scattered over the disk.</p>
<table>
<tr><th>Step</th><th>One whole cylinder</th><th>8 scattered tracks</th></tr>
<tr><td>Seeks needed</td><td>1 (head switching is electronic and instant)</td><td>8</td></tr>
<tr><td>Rotational delays</td><td>1 (the next surface starts wherever the head happens to be)</td><td>8</td></tr>
<tr><td>Revolutions of transfer</td><td>8 × 8,3333 = 66,667 ms</td><td>8 × 8,3333 = 66,667 ms</td></tr>
<tr><td><strong>Total</strong></td><td>8 + 4,1667 + 66,667 = <strong>78,833 ms</strong></td><td>8 × 20,5 = <strong>164,0 ms</strong></td></tr>
<tr><td>Effective rate for 2 MiB</td><td><strong>26,602 MB/s</strong></td><td>12,787 MB/s</td></tr>
</table>
<p class="dap-an">✅ Answer: laying data out cylinder-first delivers <strong>26,6 MB/s against 12,8 MB/s — 2,08× faster for the identical 2 MiB</strong>, because 8 seeks and 8 rotational waits collapse into one of each. This is exactly why file systems allocate by cylinder group, and why "tracks per cylinder" earns a row in a spec sheet at all.</p>
<ul>
<li><strong>Read the three columns as three different answers to the same trade-off.</strong> The laptop drive (5400 rpm, 11 ms seek, 16 MB cache) optimises for <em>power and quietness</em>. The data-centre drive (15 030 rpm, 2,9 ms seek, only 600 GB) optimises for <em>latency</em> — it buys speed by using small, fast platters and giving up capacity. The enterprise drive (12 TB, 7200 rpm, 256 MB cache) optimises for <em>bytes per rack</em>.</li>
<li><strong>Seek and spindle speed move together, and that is not a coincidence.</strong> 15 030 rpm ⇒ 2,9 ms seek; 5400 rpm ⇒ 11 ms seek. A fast drive is built fast throughout — lighter arm, stiffer platters, more power — so you never get one without the other.</li>
<li><strong>Areal density explains the capacities.</strong> 134 Gb/cm<sup>2</sup> on a 3.5-inch platter gives 12 TB; 82 Gb/cm<sup>2</sup> on a 2.5-inch platter gives 600 GB. Bigger platter <em>and</em> denser recording, multiplied together.</li>
<li><strong>The cache column is the fourth term nobody writes in the formula.</strong> 256 MB of DRAM in front of the platters means a re-read may cost microseconds instead of 12 ms. It does not change the disk's physics — it just lets you skip it sometimes, which is the Ch.4 hierarchy applied one more time, inside the drive itself.</li>
</ul>
<p class="pitfall">⚠️ <strong>Two genuine errors in this table — flagged, not silently copied, and not "fixed" either.</strong> (1) <strong>Maximum sustained transfer rate: 1,2 GB/s and 3 GB/s are impossible for a mechanical drive.</strong> A 5400 rpm platter turns 90 times a second, so 3 GB/s would need a single track holding ≈ 33 MB. Those numbers are <em>interface</em> speeds in bits (SAS 12 Gb/s, SATA 3 Gb/s), not sustained media rates; a real 5400 rpm laptop drive sustains roughly 100–130 MB/s. Only the first column (255 MB/s) is a plausible media figure. (2) The Ultrastar HE <strong>average latency cell reads "4.16" with no unit</strong> — it must be 4,16 ms — and the diameter cell reads "3.5 in (8.89 cm)s" with a stray trailing "s". None of this changes the physics; it does mean you should check a spec sheet before quoting the table in an assignment.</p>`,
        `<p class="y-chinh">🎯 Ba ổ đĩa THẬT xếp cạnh nhau — <strong>doanh nghiệp, trung tâm dữ liệu, laptop</strong> — để bạn thấy công thức của slide 11 không phải chuyện hàn lâm: mọi ký hiệu trong đó đều có một dòng trong bảng này.</p>
<table>
<tr><th>Đặc tính</th><th>HGST Ultrastar HE<br/>(Doanh nghiệp)</th><th>HGST Ultrastar C15K600<br/>(Trung tâm dữ liệu)</th><th>Toshiba L200<br/>(Laptop)</th></tr>
<tr><td>Dung lượng</td><td>12 TB</td><td>600 GB</td><td>500 GB</td></tr>
<tr><td>Seek trung bình</td><td>8,0 ms đọc / 8,6 ms ghi</td><td>2,9 ms đọc / 3,1 ms ghi</td><td>11 ms</td></tr>
<tr><td>Tốc độ quay</td><td>7200 vòng/phút</td><td>15 030 vòng/phút</td><td>5400 vòng/phút</td></tr>
<tr><td>Độ trễ quay trung bình</td><td>4.16 <em>(slide KHÔNG ghi đơn vị)</em></td><td>&lt; 2 ms</td><td>5,6 ms</td></tr>
<tr><td>Tốc độ truyền liên tục tối đa</td><td>255 MB/s</td><td>1,2 GB/s <em>(xem cảnh báo)</em></td><td>3 GB/s <em>(xem cảnh báo)</em></td></tr>
<tr><td>Byte mỗi sector</td><td>512/4096</td><td>512/4096</td><td>4096</td></tr>
<tr><td>Track mỗi cylinder (số mặt ghi)</td><td>8</td><td>6</td><td>4</td></tr>
<tr><td>Bộ đệm</td><td>256 MB</td><td>128 MB</td><td>16 MB</td></tr>
<tr><td>Đường kính</td><td>3.5 in (8,89 cm)</td><td>2.5 in (6,35 cm)</td><td>2.5 in (6,35 cm)</td></tr>
<tr><td>Mật độ bề mặt tối đa (Gb/cm<sup>2</sup>)</td><td>134</td><td>82</td><td>66</td></tr>
</table>
<p class="nhan">📐 <strong>BÀI 6 — đối chiếu bảng với công thức.</strong> Độ trễ quay trung bình bắt buộc phải bằng đúng nửa vòng, nên nó được quyết định hoàn toàn bởi tốc độ quay. Tính cho cả ba ổ rồi so với con số in trên slide:</p>
<table>
<tr><th>Ổ đĩa</th><th>vòng/phút</th><th>1/(2r) = 60 000 ÷ (2 × rpm)</th><th>Bảng ghi</th><th>Kết luận</th></tr>
<tr><td>Ultrastar HE</td><td>7200</td><td><strong>4,1667 ms</strong></td><td>4.16</td><td>✔ (làm tròn xuống; thiếu đơn vị)</td></tr>
<tr><td>Ultrastar C15K600</td><td>15 030</td><td><strong>1,9960 ms</strong></td><td>&lt; 2 ms</td><td>✔ chính xác</td></tr>
<tr><td>Toshiba L200</td><td>5400</td><td><strong>5,5556 ms</strong></td><td>5,6 ms</td><td>✔ (làm tròn lên)</td></tr>
</table>
<p class="dap-an">✅ Cả ba đều khớp. Bài học có ích: <strong>không bao giờ phải học thuộc độ trễ quay — cứ TÍNH RA.</strong> Và nó giải thích vì sao ổ trung tâm dữ liệu quay 15 000 vòng/phút bất chấp ồn, nóng và tốn điện: đó là cách duy nhất cắt được số hạng độ trễ quay, từ 4,17 ms xuống còn 2,00 ms, tức giảm một nửa.</p>
<p class="nhan">📐 <strong>BÀI 7 — "8 track mỗi cylinder" mua được gì.</strong> Ultrastar HE, 7200 vòng/phút, lấy N = 262 144 B mỗi track như Bài 1. Đọc trọn một cylinder (cả 8 track) so với đọc 8 track rải rác khắp đĩa.</p>
<table>
<tr><th>Bước</th><th>Trọn một cylinder</th><th>8 track rải rác</th></tr>
<tr><td>Số lần seek</td><td>1 (đổi đầu đọc là việc điện, tức thì)</td><td>8</td></tr>
<tr><td>Số lần chờ quay</td><td>1 (mặt kế tiếp bắt đầu ngay tại chỗ đầu đọc đang ở)</td><td>8</td></tr>
<tr><td>Số vòng quay để truyền</td><td>8 × 8,3333 = 66,667 ms</td><td>8 × 8,3333 = 66,667 ms</td></tr>
<tr><td><strong>Tổng</strong></td><td>8 + 4,1667 + 66,667 = <strong>78,833 ms</strong></td><td>8 × 20,5 = <strong>164,0 ms</strong></td></tr>
<tr><td>Tốc độ hiệu dụng cho 2 MiB</td><td><strong>26,602 MB/s</strong></td><td>12,787 MB/s</td></tr>
</table>
<p class="dap-an">✅ Đáp án: xếp dữ liệu theo cylinder cho <strong>26,6 MB/s so với 12,8 MB/s — nhanh gấp 2,08 lần cho đúng 2 MiB như nhau</strong>, vì 8 lần seek và 8 lần chờ quay gộp lại còn mỗi thứ một lần. Đây chính xác là lý do hệ tệp cấp phát theo NHÓM CYLINDER, và là lý do "track mỗi cylinder" xứng đáng có một dòng trên tờ thông số.</p>
<ul>
<li><strong>Đọc ba cột như ba lời giải khác nhau cho cùng một bài toán đánh đổi.</strong> Ổ laptop (5400 vòng/phút, seek 11 ms, đệm 16 MB) tối ưu cho <em>ĐIỆN NĂNG và ĐỘ ỒN</em>. Ổ trung tâm dữ liệu (15 030 vòng/phút, seek 2,9 ms, chỉ 600 GB) tối ưu cho <em>ĐỘ TRỄ</em> — nó mua tốc độ bằng cách dùng mâm nhỏ, nhẹ, và chịu mất dung lượng. Ổ doanh nghiệp (12 TB, 7200 vòng/phút, đệm 256 MB) tối ưu cho <em>SỐ BYTE TRÊN MỖI TỦ RACK</em>.</li>
<li><strong>Seek và tốc độ quay đi cùng nhau, và đó không phải trùng hợp.</strong> 15 030 vòng/phút ⇒ seek 2,9 ms; 5400 vòng/phút ⇒ seek 11 ms. Ổ nhanh được chế tạo nhanh ở mọi bộ phận — cần nhẹ hơn, mâm cứng hơn, tốn điện hơn — nên không bao giờ có cái này mà không có cái kia.</li>
<li><strong>Mật độ bề mặt giải thích các con số dung lượng.</strong> 134 Gb/cm<sup>2</sup> trên mâm 3.5 inch cho 12 TB; 82 Gb/cm<sup>2</sup> trên mâm 2.5 inch cho 600 GB. Mâm to hơn <em>VÀ</em> ghi dày hơn, nhân vào nhau.</li>
<li><strong>Cột bộ đệm là số hạng thứ tư không ai viết vào công thức.</strong> 256 MB DRAM đặt trước mấy cái mâm nghĩa là đọc lại một khối có thể tốn vài micro giây thay vì 12 ms. Nó không đổi vật lý của đĩa — nó chỉ cho phép đôi lúc BỎ QUA phần vật lý đó, tức là phân cấp bộ nhớ của Ch.4 áp dụng thêm một lần nữa, ngay bên trong ổ đĩa.</li>
</ul>
<p class="pitfall">⚠️ <strong>Hai lỗi thật trong bảng này — nêu ra chứ không lặng lẽ chép, và cũng KHÔNG tự ý "sửa" slide.</strong> (1) <strong>Tốc độ truyền liên tục tối đa: 1,2 GB/s và 3 GB/s là BẤT KHẢ THI với ổ cơ.</strong> Mâm 5400 vòng/phút quay 90 vòng mỗi giây, nên để đạt 3 GB/s thì một track phải chứa ≈ 33 MB. Mấy con số đó là tốc độ <em>GIAO TIẾP</em> tính bằng BIT (SAS 12 Gb/s, SATA 3 Gb/s), không phải tốc độ đọc liên tục của mặt đĩa; ổ laptop 5400 vòng/phút thật đạt khoảng 100–130 MB/s. Chỉ cột đầu (255 MB/s) là con số mặt đĩa hợp lý. (2) Ô độ trễ quay của Ultrastar HE <strong>ghi "4.16" không có đơn vị</strong> — phải là 4,16 ms — và ô đường kính ghi "3.5 in (8.89 cm)s" thừa một chữ "s". Không cái nào đổi vật lý cả; nhưng nghĩa là bạn nên tra tờ thông số thật trước khi trích bảng này vào bài nộp.</p>`],

      [14, 'RAID — Redundant Array of Independent Disks: the three common characteristics',
        `<p class="y-chinh">🎯 The chapter turns a corner here. Everything up to slide 13 was about making <em>one</em> disk faster; from here on the answer is <strong>use many disks and pretend they are one</strong>. RAID = <strong>Redundant Array of Independent Disks</strong>, and it <strong>consists of 7 levels</strong>, 0 through 6.</p>
<p class="nhan">📐 The three characteristics every RAID level shares — these are the definition, and they are the likeliest short-answer question in the chapter:</p>
<table>
<tr><th>#</th><th>Characteristic (the slide's words)</th><th>What it actually means</th></tr>
<tr><td>1</td><td>Set of physical disk drives <strong>viewed by the operating system as a single logical drive</strong></td><td>Transparency — the OS issues one request; array management software splits it up</td></tr>
<tr><td>2</td><td>Data are <strong>distributed across the physical drives</strong> of an array in a scheme known as <strong>STRIPING</strong></td><td>Parallelism — several arms move at once, so the 81-IOPS ceiling of slide 12 multiplies</td></tr>
<tr><td>3</td><td><strong>Redundant disk capacity</strong> is used to store <strong>parity information</strong>, which guarantees data recoverability in case of a disk failure</td><td>Reliability — more disks means more failures, so redundancy is compulsory, not optional</td></tr>
</table>
<ul>
<li><strong>The sentence students skip and examiners love.</strong> "Levels <em>do not imply a hierarchical relationship</em> but designate <strong>different design architectures</strong> that share three common characteristics." RAID 5 is <em>not</em> "better than" RAID 1, and RAID 6 is not RAID 5 improved. They are seven different trade-offs. A question asking "which RAID level is best?" has no answer without an application.</li>
<li><strong>Characteristic 3 has an exception you must remember.</strong> RAID <strong>0 has no redundancy at all</strong> — Table 7.3 calls it "Nonredundant" and its data availability is <em>lower than a single disk</em>. So the "R" in RAID is a lie for level 0. Slide 19 says so explicitly, and the exam likes that contradiction.</li>
<li><strong>Why redundancy became compulsory, in one calculation.</strong> If one disk fails on average once every 100 000 hours, an array of 10 such disks sees a failure roughly <em>ten times as often</em>. Build an array without redundancy and you have built something <em>less</em> reliable than the single drive you started with. That is the original 1988 Berkeley argument that created RAID.</li>
<li><strong>The name changed, and the change is meaningful.</strong> Originally "Redundant Array of <em>Inexpensive</em> Disks" — the idea was to beat one expensive mainframe disk with many cheap ones. Once the technique won, the industry renamed it "<em>Independent</em>", because the point is no longer price but parallelism and fault tolerance.</li>
<li><strong>Where RAID sits in this course.</strong> It is a pure <em>organisation</em> question, not a new technology: same platters, same heads, same formula from slide 11 — just applied N times in parallel. That is why the chapter puts it right after disk performance, and why every RAID argument reduces to seek time, rotational delay and the write penalty.</li>
</ul>
<p class="meo">💡 Three words for the three characteristics: <strong>ONE (one logical drive) · SPREAD (striping) · SPARE (redundancy)</strong>. Every level answers "how do I spread?" and "how much spare?" differently.</p>`,
        `<p class="y-chinh">🎯 Chương rẽ hướng ở đây. Từ đầu tới slide 13 là chuyện làm MỘT đĩa nhanh hơn; từ đây câu trả lời là <strong>dùng NHIỀU đĩa rồi giả vờ như chỉ có một</strong>. RAID = <strong>Redundant Array of Independent Disks</strong> (mảng đĩa độc lập có dư thừa), và nó <strong>gồm 7 mức</strong>, từ 0 tới 6.</p>
<p class="nhan">📐 Ba đặc điểm mà MỌI mức RAID đều có — đây chính là định nghĩa, và là câu hỏi ngắn dễ ra thi nhất của chương:</p>
<table>
<tr><th>#</th><th>Đặc điểm (nguyên văn slide)</th><th>Thực chất nghĩa là gì</th></tr>
<tr><td>1</td><td>Một tập ổ đĩa vật lý <strong>được hệ điều hành NHÌN THẤY NHƯ MỘT Ổ LOGIC DUY NHẤT</strong></td><td>Tính trong suốt — hệ điều hành phát một yêu cầu; phần mềm quản lý mảng lo việc chia nhỏ</td></tr>
<tr><td>2</td><td>Dữ liệu được <strong>PHÂN BỐ TRÊN CÁC Ổ VẬT LÝ</strong> của mảng theo một sơ đồ gọi là <strong>STRIPING (chia dải)</strong></td><td>Song song — nhiều cánh tay cùng dịch chuyển một lúc, nên cái trần 81 IOPS của slide 12 được nhân lên</td></tr>
<tr><td>3</td><td><strong>Dung lượng đĩa DƯ THỪA</strong> được dùng để lưu <strong>thông tin PARITY</strong>, thứ bảo đảm khôi phục được dữ liệu khi một đĩa hỏng</td><td>Độ tin cậy — càng nhiều đĩa thì càng hay hỏng, nên dư thừa là BẮT BUỘC chứ không phải tuỳ chọn</td></tr>
</table>
<ul>
<li><strong>Câu mà sinh viên hay bỏ qua còn người ra đề thì rất thích.</strong> "Các mức <em>KHÔNG hàm ý quan hệ thứ bậc</em> mà chỉ định các <strong>KIẾN TRÚC THIẾT KẾ KHÁC NHAU</strong> cùng chia sẻ ba đặc điểm chung." RAID 5 <em>KHÔNG</em> "tốt hơn" RAID 1, và RAID 6 không phải RAID 5 cải tiến. Chúng là bảy phương án đánh đổi khác nhau. Câu hỏi "mức RAID nào tốt nhất?" không có đáp án nếu chưa nói ứng dụng là gì.</li>
<li><strong>Đặc điểm 3 có một NGOẠI LỆ phải nhớ.</strong> RAID <strong>0 hoàn toàn KHÔNG có dư thừa</strong> — Table 7.3 gọi nó là "Nonredundant" và ghi độ sẵn sàng dữ liệu <em>THẤP HƠN một đĩa đơn</em>. Nên chữ "R" trong RAID là nói dối với mức 0. Slide 19 nói thẳng điều đó, và đề thi rất thích mâu thuẫn này.</li>
<li><strong>Vì sao dư thừa thành bắt buộc, gói trong một phép tính.</strong> Nếu trung bình 100 000 giờ một đĩa hỏng một lần, thì mảng 10 đĩa như vậy chứng kiến hỏng hóc <em>thường xuyên gấp mười lần</em>. Dựng mảng mà không dư thừa là bạn vừa dựng ra thứ KÉM tin cậy hơn chính cái ổ đơn ban đầu. Đó là lập luận gốc năm 1988 ở Berkeley đã khai sinh RAID.</li>
<li><strong>Cái tên đã đổi, và sự đổi ấy có ý nghĩa.</strong> Ban đầu là "Redundant Array of <em>Inexpensive</em> Disks" — ý tưởng là lấy nhiều đĩa rẻ đánh bại một đĩa mainframe đắt tiền. Khi kỹ thuật này thắng rồi, ngành công nghiệp đổi thành "<em>Independent</em>", vì điểm mấu chốt không còn là GIÁ mà là song song và chịu lỗi.</li>
<li><strong>RAID nằm ở đâu trong môn này.</strong> Nó thuần tuý là câu chuyện <em>TỔ CHỨC</em>, không phải công nghệ mới: vẫn mâm ấy, đầu đọc ấy, công thức ấy của slide 11 — chỉ áp dụng song song N lần. Vì thế chương mới đặt nó ngay sau phần hiệu năng đĩa, và vì thế mọi lập luận về RAID đều quy về seek time, độ trễ quay và hình phạt khi ghi.</li>
</ul>
<p class="meo">💡 Ba chữ cho ba đặc điểm: <strong>MỘT (một ổ logic) · TRẢI (striping) · DỰ PHÒNG (redundancy)</strong>. Mỗi mức trả lời hai câu "trải thế nào?" và "dự phòng bao nhiêu?" theo một kiểu khác.</p>`],

      [15, 'Table 7.3 — RAID Levels: category, disks required, availability, transfer capacity, request rate',
        `<p class="y-chinh">🎯 The whole of RAID on one page. Learn the <strong>first three columns</strong> cold — category, level, disks required — and you can reconstruct most of the rest by reasoning.</p>
<table>
<tr><th>Category</th><th>Level</th><th>Description</th><th>Disks required</th><th>Data availability</th></tr>
<tr><td>Striping</td><td><strong>0</strong></td><td>Nonredundant</td><td><strong>N</strong></td><td><em>Lower than a single disk</em></td></tr>
<tr><td>Mirroring</td><td><strong>1</strong></td><td>Mirrored</td><td><strong>2N</strong></td><td>Higher than RAID 2/3/4/5; lower than RAID 6</td></tr>
<tr><td rowspan="2">Parallel access</td><td><strong>2</strong></td><td>Redundant via Hamming code</td><td><strong>N + m</strong></td><td>Much higher than single disk</td></tr>
<tr><td><strong>3</strong></td><td>Bit-interleaved parity</td><td><strong>N + 1</strong></td><td>Much higher than single disk</td></tr>
<tr><td rowspan="3">Independent access</td><td><strong>4</strong></td><td>Block-interleaved parity</td><td><strong>N + 1</strong></td><td>Much higher than single disk</td></tr>
<tr><td><strong>5</strong></td><td>Block-interleaved distributed parity</td><td><strong>N + 1</strong></td><td>Much higher than single disk</td></tr>
<tr><td><strong>6</strong></td><td>Block-interleaved dual distributed parity</td><td><strong>N + 2</strong></td><td><em>Highest of all listed alternatives</em></td></tr>
</table>
<p class="nhan">📐 <strong>Worked problem — what does each level cost?</strong> Take N = 4 data disks of 4 TB each (so 16 TB of usable data) and compute how many disks you must buy. For RAID 2, m = 3 because a Hamming code over 4 data units needs 3 check units (2<sup>3</sup> ≥ 4+3+1), which is exactly what Figure 7.6(c) draws: b<sub>0</sub>…b<sub>3</sub> plus f<sub>0</sub>, f<sub>1</sub>, f<sub>2</sub>.</p>
<table>
<tr><th>Level</th><th>Disks</th><th>Bought</th><th>Usable</th><th>Efficiency</th></tr>
<tr><td>RAID 0</td><td>4</td><td>16 TB</td><td>16 TB</td><td><strong>100 %</strong></td></tr>
<tr><td>RAID 1</td><td>8</td><td>32 TB</td><td>16 TB</td><td><strong>50 %</strong></td></tr>
<tr><td>RAID 2</td><td>7</td><td>28 TB</td><td>16 TB</td><td>57,1 %</td></tr>
<tr><td>RAID 3 / 4 / 5</td><td>5</td><td>20 TB</td><td>16 TB</td><td><strong>80 %</strong></td></tr>
<tr><td>RAID 6</td><td>6</td><td>24 TB</td><td>16 TB</td><td>66,7 %</td></tr>
</table>
<p class="dap-an">✅ Answer: RAID 1 is the expensive one (you buy twice what you keep — Table 7.4 on slide 25 calls this "highest disk overhead of all RAID types (100 %) — inefficient"). RAID 3/4/5 are the efficient ones at 80 %. And RAID 2 gets <em>worse</em> the smaller the array: <strong>m grows like log N</strong>, so the redundancy fraction is 42,9 % at N = 4, 33,3 % at N = 8, 23,8 % at N = 16, and only 9,9 % at N = 64. That is exactly what the table's footnote means by "<em>m proportional to log N</em>" — and it is why RAID 2 is only conceivable for very large arrays, which is half the reason nobody built one.</p>
<ul>
<li><strong>The Category column is the real structure, not the level numbers.</strong> <em>Striping</em> (0) — spread, no protection. <em>Mirroring</em> (1) — duplicate everything. <em>Parallel access</em> (2, 3) — all disks participate in <em>every</em> request, spindles synchronised, tiny strips. <em>Independent access</em> (4, 5, 6) — each disk serves separate requests, large strips. Knowing which category a level belongs to lets you predict both performance columns.</li>
<li><strong>Read the last two columns as a single trade.</strong> <em>Large I/O transfer capacity</em> (throughput on big files) is highest for the parallel-access levels 2 and 3 — "highest of all listed alternatives". <em>Small I/O request rate</em> (transactions per second) is highest for RAID 0 and 1. No level wins both; parallel access is great at streaming and poor at transactions, independent access is the reverse.</li>
<li><strong>The write penalty shows up as words, not numbers.</strong> RAID 4 and 5 both read "significantly lower than a single disk for write". That phrase is the read-modify-write cost of slide 23: to change one block you must read the old block <em>and</em> the old parity, then write both back. Four disk operations for one logical write.</li>
<li><strong>RAID 6 buys availability with writes.</strong> N + 2 disks, two independent parity calculations, "highest of all listed alternatives" for availability — but "significantly lower than RAID 5 for write", because every write now touches two parity blocks instead of one.</li>
</ul>
<p class="meo">💡 Memorise the disk counts as a rhyme: <strong>0 → N · 1 → 2N · 2 → N+m · 3,4,5 → N+1 · 6 → N+2.</strong> Five items, and they carry most of the marks a RAID question is worth.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ RAID trên một trang. Học thuộc lòng <strong>ba cột đầu</strong> — nhóm, mức, số đĩa cần — là bạn suy ra được phần lớn phần còn lại.</p>
<table>
<tr><th>Nhóm</th><th>Mức</th><th>Mô tả</th><th>Số đĩa cần</th><th>Độ sẵn sàng dữ liệu</th></tr>
<tr><td>Striping (chia dải)</td><td><strong>0</strong></td><td>Không dư thừa</td><td><strong>N</strong></td><td><em>THẤP HƠN một đĩa đơn</em></td></tr>
<tr><td>Mirroring (soi gương)</td><td><strong>1</strong></td><td>Nhân bản</td><td><strong>2N</strong></td><td>Cao hơn RAID 2/3/4/5; thấp hơn RAID 6</td></tr>
<tr><td rowspan="2">Truy cập song song</td><td><strong>2</strong></td><td>Dư thừa bằng mã Hamming</td><td><strong>N + m</strong></td><td>Cao hơn nhiều so với đĩa đơn</td></tr>
<tr><td><strong>3</strong></td><td>Parity xen kẽ theo BIT</td><td><strong>N + 1</strong></td><td>Cao hơn nhiều so với đĩa đơn</td></tr>
<tr><td rowspan="3">Truy cập độc lập</td><td><strong>4</strong></td><td>Parity xen kẽ theo KHỐI</td><td><strong>N + 1</strong></td><td>Cao hơn nhiều so với đĩa đơn</td></tr>
<tr><td><strong>5</strong></td><td>Parity theo khối, PHÂN TÁN</td><td><strong>N + 1</strong></td><td>Cao hơn nhiều so với đĩa đơn</td></tr>
<tr><td><strong>6</strong></td><td>Parity KÉP theo khối, phân tán</td><td><strong>N + 2</strong></td><td><em>CAO NHẤT trong mọi phương án</em></td></tr>
</table>
<p class="nhan">📐 <strong>Bài giải — mỗi mức tốn bao nhiêu?</strong> Lấy N = 4 đĩa dữ liệu, mỗi đĩa 4 TB (tức 16 TB dùng được) rồi tính phải MUA bao nhiêu đĩa. Với RAID 2, m = 3 vì mã Hamming trên 4 đơn vị dữ liệu cần 3 đơn vị kiểm (2<sup>3</sup> ≥ 4+3+1), đúng bằng thứ Figure 7.6(c) vẽ: b<sub>0</sub>…b<sub>3</sub> cộng f<sub>0</sub>, f<sub>1</sub>, f<sub>2</sub>.</p>
<table>
<tr><th>Mức</th><th>Số đĩa</th><th>Mua</th><th>Dùng được</th><th>Hiệu suất</th></tr>
<tr><td>RAID 0</td><td>4</td><td>16 TB</td><td>16 TB</td><td><strong>100 %</strong></td></tr>
<tr><td>RAID 1</td><td>8</td><td>32 TB</td><td>16 TB</td><td><strong>50 %</strong></td></tr>
<tr><td>RAID 2</td><td>7</td><td>28 TB</td><td>16 TB</td><td>57,1 %</td></tr>
<tr><td>RAID 3 / 4 / 5</td><td>5</td><td>20 TB</td><td>16 TB</td><td><strong>80 %</strong></td></tr>
<tr><td>RAID 6</td><td>6</td><td>24 TB</td><td>16 TB</td><td>66,7 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án: RAID 1 là mức đắt (mua gấp đôi thứ giữ được — Table 7.4 ở slide 25 gọi đây là "chi phí đĩa cao nhất trong mọi kiểu RAID (100 %) — kém hiệu quả"). RAID 3/4/5 là mức hiệu quả, 80 %. Còn RAID 2 càng nhỏ càng TỆ: <strong>m tăng theo log N</strong>, nên tỉ lệ dư thừa là 42,9 % khi N = 4, 33,3 % khi N = 8, 23,8 % khi N = 16, và chỉ còn 9,9 % khi N = 64. Đó đúng là điều mà chú thích "<em>m tỉ lệ với log N</em>" dưới bảng muốn nói — và là lý do RAID 2 chỉ hình dung được với mảng rất lớn, tức một nửa lý do chẳng ai từng xây nó.</p>
<ul>
<li><strong>Cột NHÓM mới là cấu trúc thật, không phải số hiệu mức.</strong> <em>Striping</em> (0) — trải ra, không bảo vệ. <em>Mirroring</em> (1) — nhân đôi tất cả. <em>Truy cập song song</em> (2, 3) — MỌI đĩa tham gia vào MỌI yêu cầu, trục quay đồng bộ, dải cực nhỏ. <em>Truy cập độc lập</em> (4, 5, 6) — mỗi đĩa phục vụ yêu cầu riêng, dải lớn. Biết một mức thuộc nhóm nào là đoán được cả hai cột hiệu năng.</li>
<li><strong>Đọc hai cột cuối như MỘT cuộc đánh đổi.</strong> <em>Năng lực truyền dữ liệu I/O lớn</em> (thông lượng với tệp lớn) cao nhất ở nhóm truy cập song song, mức 2 và 3 — "cao nhất trong mọi phương án". <em>Tốc độ yêu cầu I/O nhỏ</em> (số giao dịch mỗi giây) cao nhất ở RAID 0 và 1. Không mức nào thắng cả hai; truy cập song song giỏi phát luồng, dở giao dịch, còn truy cập độc lập thì ngược lại.</li>
<li><strong>Hình phạt khi ghi hiện ra bằng CHỮ chứ không bằng số.</strong> RAID 4 và 5 đều ghi "thấp hơn đáng kể so với đĩa đơn khi GHI". Câu đó chính là chi phí đọc-sửa-ghi của slide 23: muốn đổi một khối thì phải đọc khối cũ <em>VÀ</em> parity cũ, rồi ghi lại cả hai. Bốn thao tác đĩa cho một lần ghi logic.</li>
<li><strong>RAID 6 mua độ sẵn sàng bằng tốc độ ghi.</strong> N + 2 đĩa, hai phép tính parity độc lập, độ sẵn sàng "cao nhất trong mọi phương án" — nhưng "thấp hơn đáng kể so với RAID 5 khi ghi", vì mỗi lần ghi bây giờ đụng tới HAI khối parity thay vì một.</li>
</ul>
<p class="meo">💡 Học thuộc số đĩa như một câu vè: <strong>0 → N · 1 → 2N · 2 → N+m · 3,4,5 → N+1 · 6 → N+2.</strong> Năm mục, và chúng gánh phần lớn điểm của một câu hỏi về RAID.</p>`],

      [16, 'Figure 7.6 — RAID Levels (1 of 2): (a) RAID 0 nonredundant, (b) RAID 1 mirrored, (c) RAID 2 Hamming',
        `<p class="y-chinh">🎯 Three pictures of disk cylinders, and the labels inside them tell you everything. Notice the colour code: <strong>green cylinders hold data, grey cylinders hold redundancy</strong>. Count the grey ones and you have the cost of each level.</p>
<table>
<tr><th>Panel</th><th>What the figure shows</th><th>Read it as</th></tr>
<tr><td><strong>(a) RAID 0 (non-redundant)</strong></td><td>4 green disks holding strip 0, 1, 2, 3 across the row, then strip 4, 5, 6, 7 on the next row, and so on</td><td>Consecutive strips go to <em>different</em> disks — that is striping, and there is <strong>no grey disk at all</strong></td></tr>
<tr><td><strong>(b) RAID 1 (mirrored)</strong></td><td>The same 4 green disks, then <strong>4 grey disks carrying the identical strip 0, 1, 2, 3 …</strong></td><td>Every strip exists twice. 8 disks, 4 disks' worth of data</td></tr>
<tr><td><strong>(c) RAID 2 (redundancy through Hamming code)</strong></td><td>4 green disks labelled <strong>b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub></strong> and 3 grey disks labelled <strong>f<sub>0</sub>(b), f<sub>1</sub>(b), f<sub>2</sub>(b)</strong></td><td>The strips are <em>bits</em>, not blocks — and the redundancy is a <em>function</em> of the data bits, not a copy</td></tr>
</table>
<ul>
<li><strong>The labels change from "strip" to "b" between (b) and (c) — that is the most important detail on the slide.</strong> RAID 0 and 1 write <em>strips</em> (chunks of blocks). RAID 2 writes <strong>b<sub>0</sub>…b<sub>3</sub></strong>, single <em>bits</em> of one word, one bit per disk. Slide 21 confirms it: "strips are very small, often as small as a single byte or word". That is the difference between independent access and parallel access, drawn.</li>
<li><strong>Why (c) has exactly 3 grey disks for 4 green ones.</strong> A Hamming code protecting 4 data bits needs 3 check bits: you need 2<sup>m</sup> ≥ N + m + 1, and 2<sup>3</sup> = 8 ≥ 4 + 3 + 1 = 8. It just fits. Try m = 2: 2<sup>2</sup> = 4 &lt; 4 + 2 + 1 = 7 — not enough. The figure is not arbitrary; it is the smallest code that works.</li>
<li><strong>Why (b) reads fast and (c) does not.</strong> In RAID 1 a read can be served by <em>either</em> copy, so two reads can proceed at once — Table 7.3 says "up to twice that of a single disk for read". In RAID 2 every disk holds one bit of every word, so <em>every</em> disk must participate in <em>every</em> read. One request occupies the whole array; you gain transfer rate but no request rate.</li>
<li><strong>Look at (a) again and see the failure mode.</strong> A file living in strips 0–3 has one quarter of itself on each of four disks. Lose any single disk and every such file is damaged. That is why Table 7.3 rates RAID 0's availability as <em>lower than a single disk</em> — four chances to fail instead of one.</li>
<li><strong>Grey-disk counting as an exam technique.</strong> (a) 0 grey of 4 = 0 % overhead. (b) 4 grey of 8 = 50 %. (c) 3 grey of 7 = 42,9 %. Compare with the table on slide 15 — identical numbers, obtained just by looking at the picture.</li>
</ul>
<p class="pitfall">⚠️ Do not read (b) as "RAID 1 needs striping". Slide 20 says RAID 1 <em>can</em> be implemented without data striping, "although this is less common". The figure happens to draw the striped version; mirroring and striping are independent ideas that are usually combined.</p>`,
        `<p class="y-chinh">🎯 Ba bức hình vẽ các ống trụ đĩa, và nhãn bên trong nói hết. Để ý mã màu: <strong>trụ XANH chứa dữ liệu, trụ XÁM chứa phần dư thừa</strong>. Đếm số trụ xám là ra chi phí của từng mức.</p>
<table>
<tr><th>Khung</th><th>Hình vẽ gì</th><th>Đọc thành</th></tr>
<tr><td><strong>(a) RAID 0 (không dư thừa)</strong></td><td>4 đĩa xanh chứa strip 0, 1, 2, 3 theo hàng ngang, rồi strip 4, 5, 6, 7 ở hàng dưới, cứ thế</td><td>Các strip liên tiếp nằm trên các đĩa <em>KHÁC NHAU</em> — đó là striping, và <strong>KHÔNG có đĩa xám nào cả</strong></td></tr>
<tr><td><strong>(b) RAID 1 (soi gương)</strong></td><td>Vẫn 4 đĩa xanh đó, rồi thêm <strong>4 đĩa XÁM mang y hệt strip 0, 1, 2, 3 …</strong></td><td>Mỗi strip tồn tại hai bản. 8 đĩa, chứa được lượng dữ liệu của 4 đĩa</td></tr>
<tr><td><strong>(c) RAID 2 (dư thừa bằng mã Hamming)</strong></td><td>4 đĩa xanh ghi <strong>b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub></strong> và 3 đĩa xám ghi <strong>f<sub>0</sub>(b), f<sub>1</sub>(b), f<sub>2</sub>(b)</strong></td><td>Strip ở đây là các <em>BIT</em>, không phải khối — và phần dư thừa là một <em>HÀM</em> của các bit dữ liệu, không phải bản sao</td></tr>
</table>
<ul>
<li><strong>Nhãn đổi từ "strip" sang "b" giữa (b) và (c) — đó là chi tiết quan trọng nhất trên slide.</strong> RAID 0 và 1 ghi các <em>strip</em> (từng mảng khối). RAID 2 ghi <strong>b<sub>0</sub>…b<sub>3</sub></strong>, tức từng <em>BIT</em> đơn lẻ của một từ, mỗi đĩa một bit. Slide 21 xác nhận: "các strip rất nhỏ, thường nhỏ tới mức chỉ một byte hoặc một từ". Đó chính là khác biệt giữa truy cập độc lập và truy cập song song, vẽ ra thành hình.</li>
<li><strong>Vì sao (c) có đúng 3 đĩa xám cho 4 đĩa xanh.</strong> Mã Hamming bảo vệ 4 bit dữ liệu cần 3 bit kiểm: điều kiện là 2<sup>m</sup> ≥ N + m + 1, mà 2<sup>3</sup> = 8 ≥ 4 + 3 + 1 = 8. Vừa khít. Thử m = 2: 2<sup>2</sup> = 4 &lt; 4 + 2 + 1 = 7 — không đủ. Hình không vẽ bừa; đó là mã nhỏ nhất dùng được.</li>
<li><strong>Vì sao (b) đọc nhanh còn (c) thì không.</strong> Trong RAID 1, một lệnh đọc được phục vụ bởi <em>MỘT TRONG HAI</em> bản, nên hai lệnh đọc chạy song song được — Table 7.3 ghi "đọc nhanh tới gấp đôi một đĩa đơn". Trong RAID 2, mỗi đĩa giữ một bit của MỌI từ, nên <em>MỌI</em> đĩa phải tham gia vào <em>MỌI</em> lệnh đọc. Một yêu cầu chiếm trọn cả mảng; bạn được tốc độ truyền nhưng không được số yêu cầu mỗi giây.</li>
<li><strong>Nhìn lại (a) để thấy kiểu hỏng.</strong> Một tệp nằm ở strip 0–3 thì có một phần tư nó trên mỗi đĩa trong bốn đĩa. Mất bất kỳ đĩa nào là mọi tệp như vậy hỏng. Đó là lý do Table 7.3 xếp độ sẵn sàng của RAID 0 là <em>THẤP HƠN một đĩa đơn</em> — bốn cơ hội hỏng thay vì một.</li>
<li><strong>Đếm đĩa xám như một mẹo đi thi.</strong> (a) 0 xám trên 4 = hao phí 0 %. (b) 4 xám trên 8 = 50 %. (c) 3 xám trên 7 = 42,9 %. So với bảng ở slide 15 — trùng khít, mà chỉ cần nhìn hình.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc (b) thành "RAID 1 cần striping". Slide 20 nói RAID 1 <em>CÓ THỂ</em> triển khai mà không chia dải, "tuy ít phổ biến hơn". Hình chỉ tình cờ vẽ bản có chia dải; soi gương và chia dải là hai ý tưởng độc lập, thường được ghép chung mà thôi.</p>`],

      [17, 'Figure 7.6 — RAID Levels (2 of 2): (d) RAID 3, (e) RAID 4, (f) RAID 5, (g) RAID 6',
        `<p class="y-chinh">🎯 The other four levels, and one detail separates them all: <strong>where is the grey disk, and how big is a strip?</strong> Follow the P(…) labels across the four panels and the whole design evolution appears in one glance.</p>
<table>
<tr><th>Panel</th><th>Labels on the figure</th><th>The design decision</th></tr>
<tr><td><strong>(d) RAID 3</strong> (bit-interleaved parity)</td><td>b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub> in green + <strong>one grey disk P(b)</strong></td><td>Bit-level strips like RAID 2, but <strong>a single parity bit replaces the whole Hamming code</strong> — one redundant disk, no matter the array size</td></tr>
<tr><td><strong>(e) RAID 4</strong> (block-level parity)</td><td>block 0, 1, 2, 3 in green + <strong>one grey disk holding P(0-3), P(4-7), P(8-11), P(12-15)</strong></td><td>Strips become <em>blocks</em> again (independent access), but <strong>all parity lives on one dedicated disk</strong></td></tr>
<tr><td><strong>(f) RAID 5</strong> (block-level distributed parity)</td><td>Same blocks, but P(0-3) sits on the <em>last</em> disk, P(4-7) on the <em>fourth</em>, P(8-11) on the <em>third</em>… — the parity walks diagonally across the array; <strong>no grey disk at all</strong></td><td>The dedicated parity disk is <strong>abolished</strong>; parity is spread round-robin over every drive</td></tr>
<tr><td><strong>(g) RAID 6</strong> (dual redundancy)</td><td>Blocks plus <strong>two</strong> parity chains, P(0-3) and Q(0-3), both walking diagonally over 6 disks</td><td>Two independent parity calculations ⇒ survives <strong>two</strong> simultaneous failures</td></tr>
</table>
<ul>
<li><strong>(d) versus (c) is the single best lesson in the figure.</strong> RAID 2 needed 3 redundant disks for 4 data disks; RAID 3 needs <strong>1, forever</strong>. How? Because the disk controller already <em>knows which disk failed</em> — the drive reports its own error. A Hamming code spends bits <em>locating</em> the error; a parity bit only has to <em>reconstruct</em> it. Knowing the location for free turns log N disks into one. That is why RAID 2 never shipped commercially and RAID 3 did.</li>
<li><strong>Reconstruct a failed disk with XOR — the exam's favourite two-line proof.</strong> Parity is P = b<sub>0</sub> ⊕ b<sub>1</sub> ⊕ b<sub>2</sub> ⊕ b<sub>3</sub>. If disk 2 dies, then b<sub>2</sub> = P ⊕ b<sub>0</sub> ⊕ b<sub>1</sub> ⊕ b<sub>3</sub>, because XOR is its own inverse. Concretely: b<sub>0</sub>=1, b<sub>1</sub>=0, b<sub>2</sub>=1, b<sub>3</sub>=1 ⇒ P = 1⊕0⊕1⊕1 = 1. Lose b<sub>2</sub>: recover 1⊕1⊕0⊕1 = 1 ✔. Slide 22 calls running in this state "<em>reduced mode</em>".</li>
<li><strong>(e) versus (f) is a bottleneck story.</strong> In RAID 4 every write touches the one grey parity disk, so that disk serialises the entire array — it becomes the choke point, and Table 7.4 on slide 26 calls RAID 4 "worst write transaction rate". RAID 5 fixes it with one idea: <em>put the parity somewhere different on every stripe</em>. Look at (f) again — P(0-3), P(4-7), P(8-11), P(12-15), P(16-19) each sit on a different drive. Same maths, no bottleneck. That is why RAID 5 is the one you meet in real life and RAID 4 is not.</li>
<li><strong>(g) has 6 disks where (f) has 5 — count them.</strong> N + 2 versus N + 1, for the reason slide 24 gives: "three disks would have to fail within the mean time to repair (MTTR) interval to cause data to be lost". RAID 6 exists because rebuilding a modern multi-terabyte drive takes many hours, and a second failure during that window is no longer unlikely.</li>
<li><strong>Read (d) and (e)/(f)/(g) as two different granularities of the same idea.</strong> Bit-interleaved (d) means every request needs every disk — great streaming throughput, one transaction at a time. Block-interleaved (e, f, g) means one small request can be served by one disk — many transactions at once. The parity mathematics is identical; only the strip size changed.</li>
</ul>
<p class="meo">💡 One sentence per panel: <strong>3 = parity on its own disk, bit strips · 4 = parity on its own disk, block strips · 5 = parity spread out · 6 = parity spread out, twice.</strong></p>`,
        `<p class="y-chinh">🎯 Bốn mức còn lại, và đúng một chi tiết phân biệt tất cả: <strong>đĩa xám nằm ở đâu, và strip lớn cỡ nào?</strong> Dõi theo các nhãn P(…) qua bốn khung là cả quá trình tiến hoá thiết kế hiện ra trong một cái liếc mắt.</p>
<table>
<tr><th>Khung</th><th>Nhãn trên hình</th><th>Quyết định thiết kế</th></tr>
<tr><td><strong>(d) RAID 3</strong> (parity xen kẽ theo bit)</td><td>b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub> màu xanh + <strong>một đĩa xám P(b)</strong></td><td>Strip mức bit giống RAID 2, nhưng <strong>MỘT bit parity thay thế cả mã Hamming</strong> — một đĩa dư thừa, bất kể mảng to cỡ nào</td></tr>
<tr><td><strong>(e) RAID 4</strong> (parity mức khối)</td><td>block 0, 1, 2, 3 màu xanh + <strong>một đĩa xám chứa P(0-3), P(4-7), P(8-11), P(12-15)</strong></td><td>Strip trở lại thành <em>KHỐI</em> (truy cập độc lập), nhưng <strong>toàn bộ parity nằm trên MỘT đĩa chuyên trách</strong></td></tr>
<tr><td><strong>(f) RAID 5</strong> (parity mức khối, phân tán)</td><td>Vẫn các khối đó, nhưng P(0-3) nằm ở đĩa <em>CUỐI</em>, P(4-7) ở đĩa <em>thứ tư</em>, P(8-11) ở đĩa <em>thứ ba</em>… — parity đi chéo qua mảng; <strong>không có đĩa xám nào</strong></td><td>Xoá bỏ hẳn đĩa parity chuyên trách; parity rải luân phiên trên mọi ổ</td></tr>
<tr><td><strong>(g) RAID 6</strong> (dư thừa kép)</td><td>Các khối cộng <strong>HAI</strong> chuỗi parity, P(0-3) và Q(0-3), cả hai đi chéo trên 6 đĩa</td><td>Hai phép tính parity độc lập ⇒ sống sót qua <strong>HAI</strong> lần hỏng cùng lúc</td></tr>
</table>
<ul>
<li><strong>So (d) với (c) là bài học hay nhất của cả hình.</strong> RAID 2 cần 3 đĩa dư cho 4 đĩa dữ liệu; RAID 3 cần <strong>1, mãi mãi</strong>. Bằng cách nào? Vì bộ điều khiển đĩa vốn đã <em>BIẾT ĐĨA NÀO HỎNG</em> — chính ổ đĩa báo lỗi của nó. Mã Hamming tiêu bit để <em>ĐỊNH VỊ</em> lỗi; bit parity chỉ cần <em>DỰNG LẠI</em> nó. Biết sẵn vị trí miễn phí thì log N đĩa rút còn một. Đó là lý do RAID 2 chưa bao giờ ra thị trường còn RAID 3 thì có.</li>
<li><strong>Dựng lại đĩa hỏng bằng XOR — chứng minh hai dòng mà đề thi rất thích.</strong> Parity là P = b<sub>0</sub> ⊕ b<sub>1</sub> ⊕ b<sub>2</sub> ⊕ b<sub>3</sub>. Nếu đĩa 2 chết thì b<sub>2</sub> = P ⊕ b<sub>0</sub> ⊕ b<sub>1</sub> ⊕ b<sub>3</sub>, vì XOR là nghịch đảo của chính nó. Cụ thể: b<sub>0</sub>=1, b<sub>1</sub>=0, b<sub>2</sub>=1, b<sub>3</sub>=1 ⇒ P = 1⊕0⊕1⊕1 = 1. Mất b<sub>2</sub>: khôi phục 1⊕1⊕0⊕1 = 1 ✔. Slide 22 gọi trạng thái chạy như vậy là "<em>reduced mode</em>" (chế độ suy giảm).</li>
<li><strong>So (e) với (f) là câu chuyện về NÚT THẮT CỔ CHAI.</strong> Trong RAID 4, mọi lần ghi đều đụng vào đúng một đĩa parity xám, nên cái đĩa đó tuần tự hoá cả mảng — nó thành điểm nghẽn, và Table 7.4 ở slide 26 gọi RAID 4 là "tốc độ giao dịch ghi tệ nhất". RAID 5 chữa bằng đúng một ý: <em>đặt parity ở chỗ khác nhau trên mỗi stripe</em>. Nhìn lại (f) — P(0-3), P(4-7), P(8-11), P(12-15), P(16-19) mỗi cái nằm trên một ổ khác nhau. Cùng phép toán, hết nghẽn. Đó là lý do RAID 5 là mức bạn gặp ngoài đời còn RAID 4 thì không.</li>
<li><strong>(g) có 6 đĩa trong khi (f) có 5 — cứ đếm.</strong> N + 2 so với N + 1, vì lý do slide 24 nêu: "phải BA đĩa hỏng trong khoảng thời gian sửa chữa trung bình (MTTR) thì mới mất dữ liệu". RAID 6 tồn tại vì dựng lại một ổ nhiều terabyte hiện đại mất hàng giờ, và một lần hỏng thứ hai trong khoảng thời gian đó không còn là chuyện hiếm.</li>
<li><strong>Đọc (d) và (e)/(f)/(g) như hai ĐỘ MỊN khác nhau của cùng một ý.</strong> Xen kẽ theo bit (d) nghĩa là mọi yêu cầu cần mọi đĩa — thông lượng phát luồng tuyệt vời, mỗi lúc một giao dịch. Xen kẽ theo khối (e, f, g) nghĩa là một yêu cầu nhỏ được phục vụ bởi một đĩa — nhiều giao dịch cùng lúc. Toán học parity y hệt nhau; chỉ kích thước strip đổi.</li>
</ul>
<p class="meo">💡 Mỗi khung một câu: <strong>3 = parity có đĩa riêng, strip theo bit · 4 = parity có đĩa riêng, strip theo khối · 5 = parity rải ra · 6 = parity rải ra, hai lần.</strong></p>`],

      [18, 'Figure 7.7 — Data Mapping for a RAID Level 0 Array',
        `<p class="y-chinh">🎯 The figure that defines <strong>striping</strong> precisely. On the left, one tall column labelled <strong>Logical Disk</strong> holding strip 0, 1, 2, … 15 in order. In the middle, a box labelled <strong>Array Management Software</strong>. On the right, four short columns, <strong>Physical Disk 0…3</strong>. The arrows show how the one becomes the four.</p>
<table>
<tr><th>Logical strip</th><th>Lands on</th><th>Position within that disk</th></tr>
<tr><td>0, 4, 8, 12</td><td>Physical Disk 0</td><td>1st, 2nd, 3rd, 4th</td></tr>
<tr><td>1, 5, 9, 13</td><td>Physical Disk 1</td><td>1st, 2nd, 3rd, 4th</td></tr>
<tr><td>2, 6, 10, 14</td><td>Physical Disk 2</td><td>1st, 2nd, 3rd, 4th</td></tr>
<tr><td>3, 7, 11, 15</td><td>Physical Disk 3</td><td>1st, 2nd, 3rd, 4th</td></tr>
</table>
<p class="nhan">📐 The mapping is just two integer operations on the logical strip number <em>i</em> for an array of <em>n</em> disks:</p>
<table>
<tr><th>Quantity</th><th>Formula</th><th>Check with i = 10, n = 4</th></tr>
<tr><td>Which disk</td><td><code>i mod n</code></td><td>10 mod 4 = <strong>2</strong> ✔ (the figure shows strip 10 on Physical Disk 2)</td></tr>
<tr><td>Which slot on it</td><td><code>i div n</code> (integer division)</td><td>10 div 4 = <strong>2</strong>, i.e. the third slot ✔</td></tr>
</table>
<p class="dap-an">✅ Check the figure's own highlighted example: strips <strong>8, 9, 10, 11</strong> are shaded green on the logical disk and each is traced by a separate line to a different physical disk — 8→disk 0, 9→disk 1, 10→disk 2, 11→disk 3. Verify with the formula: 8 mod 4 = 0, 9 mod 4 = 1, 10 mod 4 = 2, 11 mod 4 = 3. The picture and the arithmetic agree exactly.</p>
<ul>
<li><strong>Why consecutive strips must go to DIFFERENT disks.</strong> A request for strips 8–11 is one logical read of four strips; because the four live on four separate drives, all four arms move <em>simultaneously</em> and the read finishes in roughly the time of one strip. Put strips 8–11 on a single disk and you would have gained nothing.</li>
<li><strong>The Array Management Software box is the whole of characteristic 1 from slide 14.</strong> It is the thing that makes many disks look like one. It can live in a hardware RAID controller, in the disk driver, or in the operating system's volume manager (Linux <code>md</code>, Windows Storage Spaces, ZFS). The OS above it sees only the left-hand column.</li>
<li><strong>Strip size is the tuning knob, and slide 19 tells you which way to turn it.</strong> <em>Small strips</em> ⇒ even a single small request spans several disks ⇒ high transfer rate for that one request, but every disk is busy for it. <em>Large strips</em> ⇒ one small request fits inside one strip on one disk ⇒ several independent requests can be served at once ⇒ high request rate. You choose: streaming video, or a database.</li>
<li><strong>The failure arithmetic, made concrete.</strong> Every logical file with more than <em>n</em> strips has a piece on every disk. So the array survives exactly <strong>zero</strong> failures, and with 4 disks it fails about 4× as often as one disk would. RAID 0's speed is real and its danger is equally real.</li>
</ul>
<p class="meo">💡 Think of four cashiers and a queue of numbered customers: customer <em>i</em> always goes to cashier <em>i</em> mod 4. Four serve at once, so the queue clears four times faster — and if one cashier walks out, every group of four is broken.</p>`,
        `<p class="y-chinh">🎯 Bức hình định nghĩa chính xác chữ <strong>STRIPING (chia dải)</strong>. Bên trái là một cột cao ghi <strong>Logical Disk</strong> (đĩa logic) chứa strip 0, 1, 2, … 15 theo thứ tự. Ở giữa là một ô ghi <strong>Array Management Software</strong> (phần mềm quản lý mảng). Bên phải là bốn cột ngắn, <strong>Physical Disk 0…3</strong>. Các mũi tên cho thấy MỘT biến thành BỐN ra sao.</p>
<table>
<tr><th>Strip logic</th><th>Rơi vào</th><th>Vị trí trên đĩa đó</th></tr>
<tr><td>0, 4, 8, 12</td><td>Physical Disk 0</td><td>thứ 1, 2, 3, 4</td></tr>
<tr><td>1, 5, 9, 13</td><td>Physical Disk 1</td><td>thứ 1, 2, 3, 4</td></tr>
<tr><td>2, 6, 10, 14</td><td>Physical Disk 2</td><td>thứ 1, 2, 3, 4</td></tr>
<tr><td>3, 7, 11, 15</td><td>Physical Disk 3</td><td>thứ 1, 2, 3, 4</td></tr>
</table>
<p class="nhan">📐 Phép ánh xạ chỉ là hai phép toán số nguyên trên số hiệu strip logic <em>i</em> với mảng <em>n</em> đĩa:</p>
<table>
<tr><th>Đại lượng</th><th>Công thức</th><th>Kiểm với i = 10, n = 4</th></tr>
<tr><td>Đĩa nào</td><td><code>i mod n</code></td><td>10 mod 4 = <strong>2</strong> ✔ (hình vẽ strip 10 nằm trên Physical Disk 2)</td></tr>
<tr><td>Ô thứ mấy trên đĩa đó</td><td><code>i div n</code> (chia lấy nguyên)</td><td>10 div 4 = <strong>2</strong>, tức ô thứ ba ✔</td></tr>
</table>
<p class="dap-an">✅ Kiểm lại bằng chính ví dụ được tô đậm trên hình: các strip <strong>8, 9, 10, 11</strong> được tô xanh trên đĩa logic và mỗi cái có một đường riêng dẫn tới một đĩa vật lý khác nhau — 8→đĩa 0, 9→đĩa 1, 10→đĩa 2, 11→đĩa 3. Đối chiếu công thức: 8 mod 4 = 0, 9 mod 4 = 1, 10 mod 4 = 2, 11 mod 4 = 3. Hình vẽ và phép tính khớp chính xác.</p>
<ul>
<li><strong>Vì sao các strip liên tiếp BẮT BUỘC phải nằm trên các đĩa KHÁC NHAU.</strong> Một yêu cầu đọc strip 8–11 là MỘT lệnh đọc logic gồm bốn strip; vì bốn strip đó nằm trên bốn ổ riêng biệt nên cả bốn cánh tay dịch chuyển <em>ĐỒNG THỜI</em> và lệnh đọc xong trong khoảng thời gian của một strip. Đặt strip 8–11 lên cùng một đĩa thì chẳng được gì.</li>
<li><strong>Ô Array Management Software chính là trọn vẹn đặc điểm 1 của slide 14.</strong> Nó là thứ khiến nhiều đĩa trông như một. Nó có thể nằm trong một card RAID phần cứng, trong trình điều khiển đĩa, hoặc trong trình quản lý ổ đĩa của hệ điều hành (Linux <code>md</code>, Windows Storage Spaces, ZFS). Hệ điều hành ở trên chỉ nhìn thấy cái cột bên trái.</li>
<li><strong>Kích thước strip là núm vặn, và slide 19 bảo bạn nên vặn về phía nào.</strong> <em>Strip NHỎ</em> ⇒ ngay cả một yêu cầu nhỏ cũng trải trên nhiều đĩa ⇒ tốc độ truyền cao cho riêng yêu cầu đó, nhưng mọi đĩa đều bận vì nó. <em>Strip LỚN</em> ⇒ một yêu cầu nhỏ lọt gọn trong một strip trên một đĩa ⇒ nhiều yêu cầu độc lập được phục vụ cùng lúc ⇒ số yêu cầu mỗi giây cao. Bạn chọn: phát video, hay cơ sở dữ liệu.</li>
<li><strong>Phép tính rủi ro, nói cho cụ thể.</strong> Mọi tệp logic dài hơn <em>n</em> strip đều có một mẩu trên MỌI đĩa. Nên mảng chịu được đúng <strong>KHÔNG</strong> lần hỏng, và với 4 đĩa thì nó hỏng thường xuyên gấp khoảng 4 lần một đĩa đơn. Tốc độ của RAID 0 là thật, và nguy hiểm của nó cũng thật y như vậy.</li>
</ul>
<p class="meo">💡 Hình dung bốn quầy thu ngân và một hàng khách có đánh số: khách <em>i</em> luôn tới quầy <em>i</em> mod 4. Bốn quầy phục vụ cùng lúc nên hàng giải toả nhanh gấp bốn — và nếu một quầy bỏ đi thì mọi nhóm bốn người đều đứt.</p>`],

      [19, 'RAID Level 0 — high data transfer capacity vs high I/O request rate',
        `<p class="y-chinh">🎯 RAID 0 has no redundancy, so the slide spends its whole space on the only thing it <em>does</em> give you: performance. And it makes a distinction the exam loves — <strong>there are TWO different kinds of "fast", and RAID 0 is tuned for one or the other, not both.</strong></p>
<table>
<tr><th></th><th>RAID 0 for high <strong>data transfer capacity</strong></th><th>RAID 0 for high <strong>I/O request rate</strong></th></tr>
<tr><td>What you are optimising</td><td>MB/s on one big request</td><td>Requests per second from many small ones</td></tr>
<tr><td>Strip size wanted</td><td>Small — spread one request over every disk</td><td>Large — keep one request inside one disk</td></tr>
<tr><td>Typical workload</td><td>Video editing, scientific data, backup</td><td>Database, mail server, virtual machines</td></tr>
<tr><td>Which term of slide 11 it attacks</td><td>t<sub>T</sub> — the transfer term, divided by n</td><td>t<sub>S</sub> + t<sub>L</sub> — paid in parallel by n arms</td></tr>
</table>
<ul>
<li><strong>The slide's two requirements for high transfer capacity, and why both are needed.</strong> (1) "A high transfer capacity must exist <strong>along the entire path</strong> between host memory and the individual disk drives" — the array is only as fast as its narrowest link, so controller, bus and memory must all keep up. (2) "The application must make I/O requests that <strong>drive the disk array efficiently</strong>" — i.e. large requests spanning many strips. A program issuing 512-byte reads gets no benefit from striping at all, no matter how many disks you bought.</li>
<li><strong>The high-request-rate argument, read carefully.</strong> "For an individual I/O request for a small amount of data the I/O time is <strong>dominated by the seek time and rotational latency</strong>" — which is Problem 1 of slide 11 restated: 99,87 % positioning. "A disk array can provide high I/O execution rates by <strong>balancing the I/O load across multiple disks</strong>." You cannot make one seek faster, so you overlap several.</li>
<li><strong>The last bullet is the one students misread.</strong> "If the strip size is <strong>relatively large</strong>, multiple waiting I/O requests can be handled in parallel, <strong>reducing the queuing time</strong> for each request." Large strips are <em>good</em> here — because a small request then fits inside one strip, occupies exactly one disk, and leaves the other n−1 disks free for other requests. Small strips would make every request tie up the whole array.</li>
<li><strong>Put a number on it, using slide 12.</strong> One disk ceilinged at <strong>81,3 random IOPS</strong>. A 4-disk RAID 0 with large strips serves four independent requests at once ⇒ roughly <strong>325 IOPS</strong>. The per-request latency is unchanged at 12,3 ms — striping buys <em>throughput</em>, never <em>latency</em>. That distinction is worth marks.</li>
<li><strong>"Impact of redundancy does not interfere with analysis" — why the slide says it.</strong> RAID 0 has no parity to compute and no mirror to update, so its performance analysis is clean. That makes it the baseline against which levels 1–6 are measured: every other level's write performance is described in Table 7.3 relative to RAID 0.</li>
</ul>
<p class="pitfall">⚠️ Two traps. (1) RAID 0 is <em>not</em> RAID — it has none of characteristic 3 from slide 14, and Table 7.3 rates its availability as <strong>lower than a single disk</strong>. Never call it "redundant". (2) Striping does not shorten a single request's latency: a 4 kB read still waits one seek plus one rotation. If a question asks "does RAID 0 reduce access time for one small read?", the answer is <strong>no</strong>.</p>`,
        `<p class="y-chinh">🎯 RAID 0 không có dư thừa, nên slide dành trọn chỗ cho thứ duy nhất nó <em>CÓ</em> cho bạn: hiệu năng. Và nó nêu một phân biệt mà đề thi rất thích — <strong>có HAI kiểu "nhanh" khác nhau, và RAID 0 chỉ chỉnh được cho một trong hai, không phải cả hai.</strong></p>
<table>
<tr><th></th><th>RAID 0 cho <strong>năng lực truyền dữ liệu cao</strong></th><th>RAID 0 cho <strong>tốc độ yêu cầu I/O cao</strong></th></tr>
<tr><td>Bạn đang tối ưu cái gì</td><td>MB/s trên một yêu cầu lớn</td><td>Số yêu cầu mỗi giây từ nhiều yêu cầu nhỏ</td></tr>
<tr><td>Muốn strip cỡ nào</td><td>NHỎ — trải một yêu cầu ra mọi đĩa</td><td>LỚN — giữ một yêu cầu gọn trong một đĩa</td></tr>
<tr><td>Loại tải tiêu biểu</td><td>Dựng video, dữ liệu khoa học, sao lưu</td><td>Cơ sở dữ liệu, máy chủ thư, máy ảo</td></tr>
<tr><td>Nó đánh vào số hạng nào của slide 11</td><td>t<sub>T</sub> — số hạng truyền, chia cho n</td><td>t<sub>S</sub> + t<sub>L</sub> — n cánh tay cùng trả song song</td></tr>
</table>
<ul>
<li><strong>Hai điều kiện slide nêu cho năng lực truyền cao, và vì sao cần cả hai.</strong> (1) "Năng lực truyền cao phải tồn tại <strong>TRÊN TOÀN BỘ ĐƯỜNG ĐI</strong> giữa bộ nhớ máy chủ và từng ổ đĩa" — mảng chỉ nhanh bằng mắt xích hẹp nhất, nên bộ điều khiển, bus và bộ nhớ đều phải theo kịp. (2) "Ứng dụng phải phát ra các yêu cầu I/O <strong>khai thác mảng đĩa một cách hiệu quả</strong>" — tức yêu cầu LỚN, trải qua nhiều strip. Một chương trình phát lệnh đọc 512 byte thì chẳng hưởng lợi gì từ striping, mua bao nhiêu đĩa cũng vậy.</li>
<li><strong>Lập luận về tốc độ yêu cầu cao, đọc cho kỹ.</strong> "Với một yêu cầu I/O đơn lẻ lấy lượng dữ liệu nhỏ thì thời gian I/O <strong>bị CHI PHỐI bởi seek time và độ trễ quay</strong>" — đúng là Bài 1 của slide 11 nói lại: 99,87 % là đi vào vị trí. "Một mảng đĩa có thể cho tốc độ thực thi I/O cao bằng cách <strong>CÂN BẰNG TẢI I/O trên nhiều đĩa</strong>." Bạn không làm một lần seek nhanh hơn được, nên bạn cho nhiều lần seek chồng lên nhau.</li>
<li><strong>Gạch cuối là chỗ sinh viên hay đọc ngược.</strong> "Nếu kích thước strip <strong>tương đối LỚN</strong> thì nhiều yêu cầu I/O đang chờ có thể được xử lý song song, <strong>GIẢM thời gian xếp hàng</strong> của từng yêu cầu." Strip LỚN là <em>TỐT</em> ở đây — vì khi đó một yêu cầu nhỏ lọt gọn trong một strip, chiếm đúng một đĩa, và để n−1 đĩa còn lại rảnh cho các yêu cầu khác. Strip nhỏ thì mỗi yêu cầu lại trói chân cả mảng.</li>
<li><strong>Gắn con số vào, lấy từ slide 12.</strong> Một đĩa bị trần ở <strong>81,3 IOPS ngẫu nhiên</strong>. Mảng RAID 0 bốn đĩa với strip lớn phục vụ bốn yêu cầu độc lập cùng lúc ⇒ khoảng <strong>325 IOPS</strong>. Độ trễ của từng yêu cầu vẫn nguyên 12,3 ms — striping mua <em>THÔNG LƯỢNG</em>, không bao giờ mua <em>ĐỘ TRỄ</em>. Phân biệt đó đáng điểm.</li>
<li><strong>"Tác động của dư thừa không làm nhiễu phép phân tích" — vì sao slide phải nói câu đó.</strong> RAID 0 không có parity phải tính, không có gương phải cập nhật, nên phân tích hiệu năng của nó SẠCH. Điều đó khiến nó thành mốc chuẩn để đo các mức 1–6: hiệu năng ghi của mọi mức khác trong Table 7.3 đều mô tả TƯƠNG ĐỐI so với RAID 0.</li>
</ul>
<p class="pitfall">⚠️ Hai bẫy. (1) RAID 0 <em>KHÔNG PHẢI</em> RAID — nó không có đặc điểm 3 của slide 14, và Table 7.3 xếp độ sẵn sàng của nó <strong>THẤP HƠN một đĩa đơn</strong>. Đừng bao giờ gọi nó là "có dư thừa". (2) Striping KHÔNG rút ngắn độ trễ của một yêu cầu đơn lẻ: đọc 4 kB vẫn phải chờ một lần seek cộng một vòng quay. Đề hỏi "RAID 0 có giảm thời gian truy cập cho một lệnh đọc nhỏ không?" thì đáp án là <strong>KHÔNG</strong>.</p>`],

      [20, 'RAID Level 1 — mirroring: redundancy by duplication, not by parity',
        `<p class="y-chinh">🎯 The simplest level, and the only one whose redundancy costs no computation: <strong>redundancy is achieved by the simple expedient of DUPLICATING ALL THE DATA.</strong> The slide's opening line says exactly why it stands apart: RAID 1 "differs from RAID levels 2 through 6 in the WAY in which redundancy is achieved".</p>
<table>
<tr><th>Characteristic (slide's words)</th><th>Consequence</th></tr>
<tr><td>Data striping is used, but <strong>each logical strip is mapped to TWO separate physical disks</strong>, so every disk in the array has a <strong>mirror disk</strong> containing the same data</td><td>2N disks for N disks of data — Table 7.3's "2N"</td></tr>
<tr><td>RAID 1 <strong>can also be implemented without data striping</strong>, although this is less common</td><td>Mirroring and striping are independent choices</td></tr>
</table>
<p class="nhan">📐 The four positive aspects, each with the reason behind it:</p>
<table>
<tr><th>The slide says</th><th>Why it is true</th></tr>
<tr><td>A read request can be serviced by <strong>either of the two disks</strong> that contains the data</td><td>Two copies ⇒ pick whichever arm is nearer or idler ⇒ Table 7.3: "up to twice that of a single disk for read"</td></tr>
<tr><td>There is <strong>no "write penalty"</strong></td><td>Nothing to read first, nothing to compute — just write both copies, in parallel. Compare RAID 4/5: two reads plus two writes</td></tr>
<tr><td>Recovery from a failure is <strong>simple</strong> — when a drive fails the data can be accessed from the second drive</td><td>No reconstruction maths. Table 7.4 (slide 25): "no rebuild is necessary… just a copy to the replacement disk"</td></tr>
<tr><td>Provides a <strong>real-time copy</strong> of all data; can achieve high I/O request rates <strong>if the bulk of the requests are reads</strong></td><td>The read advantage is real; the write side is only "similar to a single disk"</td></tr>
</table>
<p class="dap-an">✅ And then the one-line verdict the slide ends on: <strong>"the principal disadvantage is the COST."</strong> From the worked table on slide 15: 8 disks bought, 4 disks of capacity kept — <strong>50 % efficiency, 100 % overhead</strong>, the worst of any level. That is the whole RAID 1 decision in one sentence: you are buying simplicity and read speed with money.</p>
<ul>
<li><strong>"No write penalty" is the phrase to remember, and to qualify.</strong> There is no <em>read-modify-write</em> penalty — nothing has to be read before writing. But every logical write still becomes <em>two</em> physical writes. They happen in parallel, so the elapsed time is that of one disk (Table 7.3: "similar to a single disk for write"), yet the array does twice the work. Write <em>latency</em> is unaffected; write <em>capacity</em> is halved.</li>
<li><strong>Why "if the bulk of the requests are reads" is a real condition.</strong> Reads scale to 2×, writes do not scale at all. A read-heavy workload (a web server serving files) loves RAID 1; a write-heavy one (a logging system) gets no throughput benefit whatsoever, only safety.</li>
<li><strong>Where it is actually used.</strong> Table 7.4 on slide 25 lists accounting, payroll, financial — "any application requiring very high availability". Also, in practice, the boot volume of almost every server, where two disks is a small absolute cost and downtime is what you are buying protection from.</li>
<li><strong>RAID 10 / RAID 0+1, the combination you will meet in real life.</strong> Not in this deck, but it follows directly: mirror the pairs, then stripe across them. You pay RAID 1's 50 % and get RAID 0's parallelism with RAID 1's recovery. It is the standard choice for database servers where the RAID 5 write penalty is unacceptable.</li>
</ul>
<p class="meo">💡 Compare the two redundancy philosophies in one line: <strong>RAID 1 stores the ANSWER twice; RAID 3–6 store a CLUE once.</strong> Copies are expensive but instant; clues are cheap but must be computed — which is exactly the write penalty of slide 23.</p>`,
        `<p class="y-chinh">🎯 Mức đơn giản nhất, và là mức duy nhất mà phần dư thừa không tốn một phép tính nào: <strong>dư thừa đạt được bằng biện pháp giản đơn là NHÂN BẢN TOÀN BỘ DỮ LIỆU.</strong> Câu mở đầu của slide nói đúng vì sao nó đứng riêng: RAID 1 "khác các mức RAID 2 tới 6 ở CÁCH đạt được sự dư thừa".</p>
<table>
<tr><th>Đặc điểm (nguyên văn slide)</th><th>Hệ quả</th></tr>
<tr><td>Vẫn dùng chia dải, nhưng <strong>mỗi strip logic được ánh xạ tới HAI đĩa vật lý riêng biệt</strong>, nên mọi đĩa trong mảng đều có một <strong>đĩa GƯƠNG</strong> chứa cùng dữ liệu</td><td>2N đĩa cho N đĩa dữ liệu — đúng cột "2N" của Table 7.3</td></tr>
<tr><td>RAID 1 <strong>cũng có thể triển khai KHÔNG chia dải</strong>, dù ít phổ biến hơn</td><td>Soi gương và chia dải là hai lựa chọn độc lập</td></tr>
</table>
<p class="nhan">📐 Bốn mặt tích cực, mỗi cái kèm lý do đứng sau:</p>
<table>
<tr><th>Slide nói</th><th>Vì sao đúng</th></tr>
<tr><td>Một yêu cầu đọc có thể được phục vụ bởi <strong>MỘT TRONG HAI đĩa</strong> chứa dữ liệu đó</td><td>Hai bản ⇒ chọn cánh tay nào gần hơn hoặc rảnh hơn ⇒ Table 7.3: "đọc nhanh tới gấp đôi một đĩa đơn"</td></tr>
<tr><td><strong>KHÔNG có "write penalty"</strong> (hình phạt khi ghi)</td><td>Không phải đọc trước, không phải tính toán gì — chỉ việc ghi cả hai bản, song song. So với RAID 4/5: hai đọc cộng hai ghi</td></tr>
<tr><td>Khôi phục sau sự cố <strong>ĐƠN GIẢN</strong> — đĩa hỏng thì lấy dữ liệu từ đĩa thứ hai</td><td>Không có phép toán dựng lại. Table 7.4 (slide 25): "không cần rebuild… chỉ việc chép sang đĩa thay thế"</td></tr>
<tr><td>Cho một <strong>bản sao THỜI GIAN THỰC</strong> của mọi dữ liệu; đạt tốc độ yêu cầu I/O cao <strong>NẾU phần lớn yêu cầu là ĐỌC</strong></td><td>Lợi thế khi đọc là thật; phía ghi chỉ "tương đương một đĩa đơn"</td></tr>
</table>
<p class="dap-an">✅ Rồi câu phán một dòng mà slide kết lại: <strong>"nhược điểm chính là GIÁ."</strong> Theo bảng đã giải ở slide 15: mua 8 đĩa, giữ được dung lượng của 4 đĩa — <strong>hiệu suất 50 %, hao phí 100 %</strong>, tệ nhất trong mọi mức. Đó là trọn vẹn quyết định về RAID 1 trong một câu: bạn đang mua SỰ ĐƠN GIẢN và TỐC ĐỘ ĐỌC bằng TIỀN.</p>
<ul>
<li><strong>"Không có write penalty" là cụm phải nhớ, và phải nói rõ thêm.</strong> Không có hình phạt <em>đọc-sửa-ghi</em> — không cần đọc gì trước khi ghi. Nhưng mỗi lần ghi logic vẫn biến thành <em>HAI</em> lần ghi vật lý. Chúng chạy song song nên thời gian trôi qua bằng một đĩa (Table 7.3: "tương đương một đĩa đơn khi ghi"), song cả mảng làm gấp đôi khối lượng việc. <em>ĐỘ TRỄ</em> ghi không đổi; <em>NĂNG LỰC</em> ghi giảm một nửa.</li>
<li><strong>Vì sao "nếu phần lớn yêu cầu là đọc" là một điều kiện THẬT.</strong> Đọc nhân lên gấp 2, ghi không nhân lên chút nào. Tải nặng đọc (máy chủ web phục vụ tệp) rất hợp RAID 1; tải nặng ghi (hệ thống ghi log) chẳng được lợi thông lượng nào, chỉ được an toàn.</li>
<li><strong>Nó thật sự được dùng ở đâu.</strong> Table 7.4 ở slide 25 liệt kê kế toán, tính lương, tài chính — "mọi ứng dụng đòi độ sẵn sàng rất cao". Và trên thực tế, nó nằm ở ổ khởi động của gần như mọi máy chủ, nơi hai cái đĩa là chi phí tuyệt đối nhỏ còn thứ bạn mua bảo hiểm chính là thời gian chết.</li>
<li><strong>RAID 10 / RAID 0+1, tổ hợp bạn sẽ gặp ngoài đời.</strong> Không có trong deck này, nhưng suy ra trực tiếp: soi gương từng cặp rồi chia dải qua các cặp. Bạn trả mức 50 % của RAID 1 và nhận được tính song song của RAID 0 cộng khả năng khôi phục của RAID 1. Đó là lựa chọn chuẩn cho máy chủ cơ sở dữ liệu, nơi hình phạt ghi của RAID 5 là không chấp nhận được.</li>
</ul>
<p class="meo">💡 So hai triết lý dư thừa trong một dòng: <strong>RAID 1 lưu ĐÁP ÁN hai lần; RAID 3–6 lưu MỘT MANH MỐI một lần.</strong> Bản sao thì đắt nhưng tức thì; manh mối thì rẻ nhưng phải TÍNH ra — và đó chính xác là hình phạt khi ghi của slide 23.</p>`],

      [21, 'RAID Level 2 — parallel access with a Hamming code, and why nobody built it',
        `<p class="y-chinh">🎯 The level that exists mainly to be argued away. RAID 2 is technically sound and commercially dead, and the slide's own last line says so: it "would only be an effective choice in an environment in which <strong>many disk errors occur</strong>".</p>
<table>
<tr><th>Characteristic (slide's words)</th><th>What it means in practice</th></tr>
<tr><td>Makes use of a <strong>parallel access</strong> technique — in a parallel access array <strong>ALL member disks participate in the execution of EVERY I/O request</strong></td><td>One request occupies the whole array ⇒ no concurrency between requests</td></tr>
<tr><td><strong>Spindles are synchronised</strong> so that each disk head is in the <em>same position</em> on each disk at any given time</td><td>Special hardware; ordinary drives do not do this. This alone makes RAID 2 expensive</td></tr>
<tr><td>Data striping is used; <strong>strips are VERY SMALL, often as small as a single byte or word</strong></td><td>Exactly what Figure 7.6(c) draws: b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub></td></tr>
</table>
<p class="nhan">📐 The performance half of the slide, decoded:</p>
<table>
<tr><th>The slide says</th><th>Explanation</th></tr>
<tr><td>An <strong>error-correcting code is calculated ACROSS CORRESPONDING BITS</strong> on each data disk, and the bits of the code are stored in the corresponding bit positions on <strong>multiple parity disks</strong></td><td>The code runs <em>across</em> the array (one bit from each disk), not <em>along</em> one disk</td></tr>
<tr><td>Typically a <strong>Hamming code</strong> is used, able to <strong>correct single-bit errors and detect double-bit errors</strong></td><td>SEC-DED — the identical code you met for main memory in Ch.6, applied one level down</td></tr>
<tr><td>The number of redundant disks is <strong>proportional to the LOG of the number of data disks</strong></td><td>m ≈ log<sub>2</sub> N — the footnote of Table 7.3</td></tr>
</table>
<p class="nhan">📐 <strong>Worked problem — how many parity disks, and is it worth it?</strong> Solve 2<sup>m</sup> ≥ N + m + 1 for each array size (verified with python3):</p>
<table>
<tr><th>Data disks N</th><th>Redundant disks m</th><th>Total</th><th>Redundancy fraction</th></tr>
<tr><td>4</td><td>3</td><td>7</td><td>42,9 %</td></tr>
<tr><td>8</td><td>4</td><td>12</td><td>33,3 %</td></tr>
<tr><td>16</td><td>5</td><td>21</td><td>23,8 %</td></tr>
<tr><td>32</td><td>6</td><td>38</td><td>15,8 %</td></tr>
<tr><td>64</td><td>7</td><td>71</td><td>9,9 %</td></tr>
</table>
<p class="dap-an">✅ Answer: the log growth is genuinely favourable — at N = 64 you pay under 10 %. <strong>But RAID 3 pays ONE disk at every size</strong>: 1/5 = 20 % at N = 4, and only 1,5 % at N = 64. RAID 2 loses at every single array size. Table 7.4 (slide 25) states the verdict bluntly: "<strong>no commercial implementations exist / not commercially viable</strong>".</p>
<ul>
<li><strong>The reason RAID 2 loses, in one sentence — and it is the best question in this whole RAID block.</strong> A Hamming code spends its extra bits <em>identifying WHICH bit is wrong</em>. But a disk array never needs that: <strong>a failed drive announces itself</strong> — the controller knows exactly which disk is missing. Given the location for free, a single parity bit is enough to reconstruct the value. RAID 2 is paying, over and over, for information it already has.</li>
<li><strong>Connect to Ch.6 (internal memory).</strong> There the Hamming/SEC-DED code was the right answer, because a DRAM bit flips <em>silently</em> — nothing tells you which one. Same code, same chapter of maths, opposite conclusion, purely because the failure model is different. If you can explain that difference you have understood both chapters.</li>
<li><strong>Parallel access kills the request rate.</strong> Since every disk serves every request, an n-disk RAID 2 handles one request at a time. Table 7.3 rates its small-I/O request rate at only "approximately twice that of a single disk" — despite having 7 disks. Compare RAID 0 with large strips, which multiplies by n.</li>
<li><strong>What it is genuinely good at.</strong> Table 7.3 rates RAID 2's large-I/O transfer capacity "highest of all listed alternatives", alongside RAID 3. Every arm moves in lockstep, so a big sequential read comes off n disks at once. That is real — it is just that RAID 3 achieves the same thing with one redundant disk instead of log N.</li>
<li><strong>Where this lesson stops.</strong> Slide 22 continues with RAID 3, then 4, 5 and 6, the comparison tables 7.4, and then SSDs, optical disks and tape. Everything from slide 22 to 42 is the second half of the chapter.</li>
</ul>
<p class="meo">💡 One line to keep: <strong>RAID 2 answers "which bit is wrong?"; a disk array already knows. RAID 3 answers "what was the value?" — and that is all it ever needed.</strong></p>`,
        `<p class="y-chinh">🎯 Mức tồn tại chủ yếu để bị lập luận loại bỏ. RAID 2 đúng về kỹ thuật mà chết về thương mại, và chính dòng cuối của slide nói vậy: nó "chỉ là lựa chọn hiệu quả trong môi trường mà <strong>lỗi đĩa xảy ra NHIỀU</strong>".</p>
<table>
<tr><th>Đặc điểm (nguyên văn slide)</th><th>Thực tế nghĩa là gì</th></tr>
<tr><td>Dùng kỹ thuật <strong>TRUY CẬP SONG SONG</strong> — trong mảng truy cập song song thì <strong>MỌI đĩa thành viên đều tham gia thực hiện MỌI yêu cầu I/O</strong></td><td>Một yêu cầu chiếm trọn cả mảng ⇒ không có sự đồng thời giữa các yêu cầu</td></tr>
<tr><td><strong>Các trục quay được ĐỒNG BỘ</strong> sao cho tại mọi thời điểm, đầu đọc trên mỗi đĩa đều ở <em>cùng một vị trí</em></td><td>Phần cứng đặc biệt; ổ đĩa thường không làm được. Chỉ riêng điều này đã khiến RAID 2 đắt</td></tr>
<tr><td>Vẫn chia dải; <strong>các strip RẤT NHỎ, thường nhỏ tới mức chỉ MỘT BYTE hoặc MỘT TỪ</strong></td><td>Đúng thứ Figure 7.6(c) vẽ: b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub></td></tr>
</table>
<p class="nhan">📐 Nửa hiệu năng của slide, giải mã ra:</p>
<table>
<tr><th>Slide nói</th><th>Giải thích</th></tr>
<tr><td>Một <strong>mã sửa lỗi được tính NGANG QUA CÁC BIT TƯƠNG ỨNG</strong> trên từng đĩa dữ liệu, và các bit của mã được lưu ở đúng vị trí bit tương ứng trên <strong>nhiều đĩa parity</strong></td><td>Mã chạy <em>NGANG</em> qua mảng (lấy một bit từ mỗi đĩa), không chạy <em>DỌC</em> theo một đĩa</td></tr>
<tr><td>Thường dùng <strong>mã Hamming</strong>, có khả năng <strong>SỬA lỗi một bit và PHÁT HIỆN lỗi hai bit</strong></td><td>SEC-DED — đúng cái mã bạn đã gặp cho bộ nhớ chính ở Ch.6, nay áp xuống một tầng</td></tr>
<tr><td>Số đĩa dư thừa <strong>tỉ lệ với LOG của số đĩa dữ liệu</strong></td><td>m ≈ log<sub>2</sub> N — đúng chú thích dưới Table 7.3</td></tr>
</table>
<p class="nhan">📐 <strong>Bài giải — cần bao nhiêu đĩa parity, và có đáng không?</strong> Giải 2<sup>m</sup> ≥ N + m + 1 cho từng cỡ mảng (đã kiểm bằng python3):</p>
<table>
<tr><th>Đĩa dữ liệu N</th><th>Đĩa dư thừa m</th><th>Tổng</th><th>Tỉ lệ dư thừa</th></tr>
<tr><td>4</td><td>3</td><td>7</td><td>42,9 %</td></tr>
<tr><td>8</td><td>4</td><td>12</td><td>33,3 %</td></tr>
<tr><td>16</td><td>5</td><td>21</td><td>23,8 %</td></tr>
<tr><td>32</td><td>6</td><td>38</td><td>15,8 %</td></tr>
<tr><td>64</td><td>7</td><td>71</td><td>9,9 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án: đà tăng theo log thật sự có lợi — tới N = 64 thì chỉ trả dưới 10 %. <strong>NHƯNG RAID 3 chỉ trả MỘT đĩa ở mọi cỡ</strong>: 1/5 = 20 % khi N = 4, và chỉ 1,5 % khi N = 64. RAID 2 thua ở MỌI cỡ mảng. Table 7.4 (slide 25) phán thẳng: "<strong>không tồn tại bản triển khai thương mại nào / không khả thi về thương mại</strong>".</p>
<ul>
<li><strong>Lý do RAID 2 thua, gói trong một câu — và đây là câu hỏi hay nhất của cả khối RAID này.</strong> Mã Hamming tiêu các bit dư của nó để <em>XÁC ĐỊNH BIT NÀO SAI</em>. Nhưng mảng đĩa không bao giờ cần chuyện đó: <strong>ổ hỏng tự khai báo</strong> — bộ điều khiển biết chính xác đĩa nào đang mất. Đã có sẵn vị trí miễn phí thì MỘT bit parity là đủ để dựng lại giá trị. RAID 2 đang trả tiền, lặp đi lặp lại, cho một thông tin mà nó đã có sẵn.</li>
<li><strong>Nối sang Ch.6 (bộ nhớ trong).</strong> Ở đó mã Hamming/SEC-DED là câu trả lời ĐÚNG, vì một bit DRAM lật <em>ÂM THẦM</em> — không có gì cho bạn biết bit nào. Cùng một mã, cùng một chương toán, kết luận NGƯỢC NHAU, thuần tuý vì mô hình lỗi khác nhau. Giải thích được khác biệt đó là bạn đã hiểu cả hai chương.</li>
<li><strong>Truy cập song song giết chết tốc độ yêu cầu.</strong> Vì mọi đĩa phục vụ mọi yêu cầu, một mảng RAID 2 n đĩa xử lý mỗi lúc MỘT yêu cầu. Table 7.3 chỉ xếp tốc độ yêu cầu I/O nhỏ của nó ở mức "khoảng gấp đôi một đĩa đơn" — dù có tới 7 đĩa. So với RAID 0 dùng strip lớn, thứ nhân lên gấp n lần.</li>
<li><strong>Nó thật sự giỏi cái gì.</strong> Table 7.3 xếp năng lực truyền I/O lớn của RAID 2 là "cao nhất trong mọi phương án", ngang RAID 3. Mọi cánh tay dịch chuyển khít nhau nên một lệnh đọc tuần tự lớn được lấy ra từ n đĩa cùng lúc. Điều đó là thật — chỉ có điều RAID 3 đạt đúng như vậy mà chỉ tốn một đĩa dư thay vì log N.</li>
<li><strong>Bài học này dừng ở đâu.</strong> Slide 22 đi tiếp với RAID 3, rồi 4, 5, 6, các bảng so sánh 7.4, rồi SSD, đĩa quang và băng từ. Toàn bộ từ slide 22 tới 42 là nửa sau của chương.</li>
</ul>
<p class="meo">💡 Một dòng để giữ lại: <strong>RAID 2 trả lời "bit nào sai?"; mảng đĩa thì đã biết sẵn. RAID 3 trả lời "giá trị là bao nhiêu?" — và đó là tất cả những gì nó từng cần.</strong></p>`],

    ]),
  ].join('\n'),
};
